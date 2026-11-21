/**
 * PocketBase-Backend des Tipptrainers „Tastenflow" — zentrale Server-Konten,
 * damit sich Schüler:innen von JEDEM Gerät anmelden können.
 *
 * Eigener PocketBase-Client mit EIGENEM authStore (Schlüssel `tt_pb_auth`),
 * vollständig getrennt von der LMS-Anmeldung: Wer als Kind im Tipptrainer
 * angemeldet ist, beeinflusst die LMS-Sitzung nicht und umgekehrt.
 *
 * Anmeldung der Kinder: PocketBase kennt nur E-Mail-Login. Wir bilden aus
 * Klassencode + Name eine SYNTHETISCHE, deterministische E-Mail
 * (`<code>__<name>@tt.local`). So funktioniert dieselbe Anmeldung „Klassencode +
 * Name + Passwort" überall — und die E-Mail-Eindeutigkeit von PocketBase sorgt
 * zugleich dafür, dass es einen Namen pro Klasse nur einmal gibt.
 *
 * Collections/Regeln: siehe pocketbase/setup.mjs (adversarial getestet).
 * Siehe [[project_zehnfinger_trainer]], [[feedback_security_first]].
 */
import PocketBase, {
  ClientResponseError,
  LocalAuthStore,
  getTokenPayload,
  type AuthRecord,
} from "pocketbase";
import { gibSpeicherFrei, vergissKonto } from "./nachsenden";
import { changeOwnPasswordPb } from "@/lib/lernwerkstatt/passwort";
import type { RecordModel, UnsubscribeFunc } from "pocketbase";
import { bereitMeldungAus } from "./schreibprobe";
import { ereignisAnhaengen, ereignisseNachtragen, unpackEvents } from "./eventPack";
import {
  ClassTeacher,
  KindVerschoben,
  Lang,
  Result,
  Stufe,
  TaskEvent,
  TypingAccount,
  TypingClass,
  VORGABE_STUFE,
  istPlausiblesGeburtsjahr,
  migriereStufe,
  type KlassenAnlage,
  type KlassenEinstellungenAenderung,
} from "./account";
import type { ProbenAbgabe, TypingBackend } from "./backend";
import type { Match, MatchStand, MatchStatus } from "./klassenmatch";
import { meldeServerZeit } from "./serverUhr";
import { lehntSitzungAb, SitzungAbgelaufenFehler } from "./sitzung";
import type { ProbenZeiger, SchreibprobePlan } from "./schreibprobe";
import type { EigenerTextGelesen } from "./eigenerText";
import { eigeneUebungReihe, eigeneUebungenAusRoh, reiheMitNeuer, reiheOhne } from "./eigeneUebungReihe";
import { ersteWorte, type MeinTextEintrag } from "./meineTexte";
import {
  ergebnisAusJson,
  fuersSpeichern,
  type Probenergebnis,
} from "./schreibprobeAuswertung";
import { TempoLevel, startpunktEinheiten } from "./letters";
// ★ E1 (24.09.2026): der Lernweg (Bauplan englischer Lehrgang §2.2).
import { istLernweg, lernwegVon, type Lernweg } from "./lernweg";
import { gezieltAus, type Gezielt } from "./gezielt";
import { istSchuljahrBeginn } from "./schuljahrBeginn";
import { geraeteZeitzone, istZeitzonenName } from "./zeitzone";

/**
 * ★ Nachtlauf 28.09.2026: erst auf `true` stellen, NACHDEM Johannes
 * „Update LMS (komplett)" ausgeführt hat (setup.mjs legt `zeitzone` an
 * `tt_teachers`/`tt_pupils` an). Vorher schriebe jede Anmeldung einmal
 * vergeblich. Die Hooks kommen ohne gespeicherte Zone aus (Wiener Zeit mit
 * Zusatz).
 * ★ 28.09.2026 09:30: „Update LMS (komplett)" ist gelaufen, das Feld ist am
 * Server (gemessen) - eingeschaltet.
 */
export const ZEITZONE_AM_SERVER = true;
import { istEnglischVariante } from "./schreibweise";
import { TypingProgress, emptyProgress } from "./progress";
import { DEFAULT_GOAL_MINUTES, DEFAULT_GOAL_UNITS, isoWeekKey } from "./goals";
import { backendUrl, hausApp, istEigenerHost } from "@/lib/adressen";
import { naechsterKlassencodeVersuch } from "@/lib/lernwerkstatt/klassencode";
import type { SpendenBannerZielgruppe } from "@/lib/spendenbannerTexte";
import type { SpendenBannerZustand } from "@/lib/spendenbanner";
import { aktuelleBedienSprache, kontoBedienSprache, type BedienSprache } from "@/lib/bedienSprache/sprache";
import { FREMDSCHRIFT_REGELN, istSprache, SPRACHREGISTER, umschreibenMitRegeln, type UmschriftRegel } from "./sprachRegister";
// ★★★ Wochenziel NEU (W2, 18.09.2026) - reine Logik in wochenziel.ts (W1).
import {
  kindWochenzielAusFeldern,
  neuesKindVerlauf,
  zielAendern,
  type GesperrteZeit,
  type KindWochenzielFelder,
  type ZielAbschnitt,
} from "./wochenziel";
// Dieselben zwei Zahlen wie im lokalen Mock (`account.ts`) - EINE Quelle,
// damit „läuft schon eine Sperre?"/„wie lange aufbewahren?" nie auseinanderlaufen.
import { SPERR_AUFBEWAHREN_MS, SPERR_DAUER_MS } from "./account";

// MAX_EVENTS lebt seit 29.08.2026 als MAX_EVENTS_GEPACKT in eventPack.ts -
// die Kappung gehoert dorthin, wo auch gepackt wird (sonst zwei Wahrheiten).
const CLASS_CODE_RE = /^[A-Z0-9.-]{2,12}$/;

// Umbau Etappe 4c (2026-06-26) — Doppel-Schreiben auf das vereinheitlichte
// Lernwerkstatt-Modell. Kanonische Quelle ist `lw_progress`/`lw_events` (mit
// Skalar-Feld `program`), die alten `tt_progress`/`tt_events` werden PARALLEL
// weitergeschrieben (Rückfallebene + der Wochenbericht-Hook liest sie noch).
// Gelesen wird bevorzugt aus lw_*; fehlt dort die Zeile, greift der Fallback
// auf die Alt-Tabelle. Erst 4d schaltet die Alt-Tabellen ab.
// Memory: project_lernwerkstatt_datenmodell.
const PROGRAM = "tippen";

/**
 * ★ G2b-2 (02.10.2026): Buchstaben, die `synthEmail` schon VOR den vier neuen Sprachen
 * kannte - ä ö ü ß (ausgeschrieben) und alles, was Namen in de, en, fr, es tragen
 * (à â ç é è ê ë î ï ô ù û ÿ œ æ á í ó ú ñ). Für sie ändert sich NICHTS: Die Login-Adresse
 * jedes bestehenden Kindes („José" ⇒ „jos") muss dieselbe bleiben, sonst findet seine
 * Anmeldung es nicht mehr.
 */
// (als \u-Folge geschrieben: eine Zeichenliste ist kein Wort und soll den Rechtschreib-Wächter für fr nicht reizen)
const NAMENSZEICHEN_VOR_G2B2 =
  "\u00e4\u00f6\u00fc\u00df" + "\u00e0\u00e2\u00e7\u00e9\u00e8\u00ea\u00eb\u00ee\u00ef\u00f4\u00f9\u00fb\u00ff\u0153\u00e6\u00e1\u00ed\u00f3\u00fa\u00f1";

/**
 * ★ G2b-2: die Umschrift für Buchstaben, die NUR die neuen Sprachen tragen (it ì ò ·
 * pl ą ć ę ł ń ś ź ż · tr ğ ı ş İ · cs č ď ě ň ř š ť ů ý ž) - aus dem Sprachregister
 * (`klassencodeUmschrift`), klein geschrieben. Vorher fielen sie als „-" heraus
 * („Łukasz" ⇒ „ukasz", „Şule" ⇒ „ule"): Namen konnten in einer Klasse zusammenfallen,
 * und mit türkischem İ passte der Login nicht zur angelegten Adresse.
 * Der Server rechnet gleich (`tt_klasse_lib.pb.js`, `SYNTH_UMSCHRIFT`); ein Wächter
 * hält beide Tabellen zusammen.
 */
function synthTabelle(sprachen: readonly Lang[]): Readonly<Record<string, string>> {
  const t: Record<string, string> = {};
  for (const s of sprachen) {
    for (const [zeichen, ersatz] of Object.entries(SPRACHREGISTER[s].klassencodeUmschrift)) {
      if (NAMENSZEICHEN_VOR_G2B2.includes(zeichen.toLowerCase())) continue;
      // ★ G2-NEUN (25.10.2026): nur EINZELNE Zeichen - die Zeichenpaare des Klassencodes (Griechisch „ου",
      // Ukrainisch „зг") gelten hier nicht; der Server rechnet Zeichen für Zeichen (`charAt`).
      if ([...zeichen].length !== 1) continue;
      // ★ G3a-SCHRIFT (25.10.2026): nur BUCHSTABEN - der ukrainische Klassencode streicht auch den Apostroph; ' und ’
      // bleiben hier, was sie waren („O'Brien" ⇒ o-brien), nur U+02BC (für Unicode ein Buchstabe) fällt weg.
      if (!/\p{L}/u.test(zeichen)) continue;
      t[zeichen] = ersatz.toLowerCase();
    }
  }
  return Object.freeze(t);
}

/**
 * ★ G2-NEUN (25.10.2026): dazu die Buchstaben der neun Sprachen des Gerüsts, die vorher als „-" herausfielen
 * (hu ő ű · pt/br ã õ · ro ă ș ț ţ · sv å · ALLE kyrillischen und griechischen Buchstaben). Ein ganz kyrillischer
 * Name („Іван") wurde vorher zu „x" - zwei solche Kinder in einer Klasse hatten dieselbe Adresse. Ein Zeichen, das
 * zwei Sprachen verschieden umschreiben (kyrillisch „и": bg „i", uk „y"), nimmt die SPÄTERE Sprache (Ukrainisch).
 * Wer vor G2-NEUN angelegt wurde, meldet sich weiter an: {@link synthEmailVorG2Neun} und der zweite Versuch in
 * `loginPupil`.
 */
export const SYNTH_UMSCHRIFT: Readonly<Record<string, string>> = synthTabelle([
  "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk",
]);

/** ★ G2-NEUN: die Tabelle von vor G2-NEUN (nur it, pl, tr, cs) - für die Anmeldung schon bestehender Kinder. */
const SYNTH_UMSCHRIFT_VOR_G2NEUN: Readonly<Record<string, string>> = synthTabelle(["it", "pl", "tr", "cs"]);

/**
 * ★ G3a-SCHRIFT (25.10.2026): die Regeln der amtlichen Umschrift für kyrillische und griechische Namen (Wortanfang
 * ukrainisch „Юлія" ⇒ yuliia, griechisch „αυ"/„μπ"/„ου" …) - `FREMDSCHRIFT_REGELN` aus dem Sprachregister, klein
 * geschrieben. Der Server rechnet dieselben (`SYNTH_REGELN` in `tt_klasse_lib.pb.js`); ein Wächter hält beide gleich.
 * Lateinische Namen berührt keine Regel.
 */
export const SYNTH_REGELN: readonly UmschriftRegel[] = Object.freeze(
  FREMDSCHRIFT_REGELN.map((r) => Object.freeze({ ...r, ersatz: r.ersatz.toLowerCase() })),
);

function umschriftNeuerSprachen(
  name: string,
  tabelle: Readonly<Record<string, string>> = SYNTH_UMSCHRIFT,
  regeln: readonly UmschriftRegel[] = SYNTH_REGELN,
): string {
  return umschreibenMitRegeln(name, tabelle, regeln);
}

/**
 * ★ G2-NEUN (25.10.2026): die Login-Adresse, wie {@link synthEmail} sie VOR G2-NEUN bildete. Ein Kind mit
 * kyrillischem, griechischem oder z. B. ungarischem Namen („Ildikó Fűzi"), das vorher angelegt wurde, trägt
 * diese Adresse - die Anmeldung versucht sie, wenn die neue nicht passt. Für jeden anderen Namen gleich
 * {@link synthEmail}.
 */
export function synthEmailVorG2Neun(classCode: string, name: string): string {
  return synthEmailMit(classCode, name, SYNTH_UMSCHRIFT_VOR_G2NEUN, []);
}

/**
 * Deterministische Login-E-Mail aus Klassencode + Name.
 * Exportiert, damit der Braille-Trainer EXAKT dieselbe E-Mail bildet (geteilte
 * Identität — sonst fände Braille ein in Tastenflow angelegtes Kind nicht).
 */
export function synthEmail(classCode: string, name: string): string {
  return synthEmailMit(classCode, name, SYNTH_UMSCHRIFT);
}

function synthEmailMit(
  classCode: string,
  name: string,
  tabelle: Readonly<Record<string, string>>,
  regeln: readonly UmschriftRegel[] = SYNTH_REGELN,
): string {
  const code = classCode.trim().toLowerCase();
  const slug = umschriftNeuerSprachen(name.trim(), tabelle, regeln)
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${code}__${slug || "x"}@tt.local`;
}

function mapTeacher(rec: RecordModel): TypingAccount {
  return {
    id: rec.id,
    role: "lehrkraft",
    name: rec.name as string,
    email: rec.email as string,
    // Spendenbanner (Nachbesserung 19.09.2026) - 0/fehlend = noch nie gezeigt.
    spendenAufrufAm: Number(rec.spendenAufrufAm) > 0 ? Number(rec.spendenAufrufAm) : 0,
    spendenAufrufMeilenstein:
      Number(rec.spendenAufrufMeilenstein) > 0 ? Number(rec.spendenAufrufMeilenstein) : 0,
    // „Was gibt's Neues" (Z3, 19.09.2026) - leer/fehlend = noch keine Fassung quittiert.
    neuigkeitenGesehen: typeof rec.neuigkeitenGesehen === "string" ? rec.neuigkeitenGesehen : "",
    createdAt: (rec.createdAtMs as number) ?? 0,
  };
}

function mapPupil(rec: RecordModel): TypingAccount {
  return {
    id: rec.id,
    role: "schueler",
    name: rec.name as string,
    classCode: rec.classCode as string,
    // S1 (15.08.2026): DIE Lese-Übersetzung für PocketBase. Das Textfeld
    // `tt_pupils.stufe` trägt noch alte Werte (a/b/c) — migriereStufe macht
    // daraus kids/teens; Leeres bleibt leer (dann entscheiden Geburtsjahr bzw.
    // Vorgabe, siehe stufeFuer). Beim nächsten Speichern steht der neue Wert
    // in der Datenbank.
    stufe: migriereStufe(rec.stufe),
    // Geburtsjahr (nur die Jahreszahl, Bauplan §0b.3). 0/leer = nicht angegeben.
    geburtsjahr: Number(rec.geburtsjahr) > 0 ? Number(rec.geburtsjahr) : undefined,
    lang: ((rec.lang as Lang) || "de"),
    langLocked: !!rec.langLocked,
    tempo: (rec.tempo as TempoLevel) ?? "normal",
    // Vorkenntnisse (01.09.2026): ab welchen Tasten das Kind begonnen hat.
    // Fehlt bei Alt-Konten → 0 = „Anfänger", nichts ist vorweg freigeschaltet.
    startUnits: Number(rec.startUnits) > 0 ? Number(rec.startUnits) : 0,
    // Wann er zuletzt eingestellt wurde (04.09.2026) — daran hängt das
    // Zurückstufen. Fehlt bei jedem Konto von vor diesem Tag → 0 = kein
    // Beschluss, es bleibt bei der nur dazunehmenden Angleichung.
    startUnitsAt: Number(rec.startUnitsAt) > 0 ? Number(rec.startUnitsAt) : 0,
    // ★ E1 (24.09.2026): der Lernweg - nur ein gültiger Wert zählt, leer/fehlend
    // (jedes Bestandskonto) bleibt weg und heisst „de" (`lernwegVon`).
    ...(istLernweg(rec.lernweg) ? { lernweg: rec.lernweg } : {}),
    // Plus (23.09.2026): roh durchgereicht, geprüft wird in
    // `lib/plus/beschluss.ts`. Fehlt bei allen Konten davor → undefined.
    plusBeschluss: rec.plusBeschluss ?? undefined,
    goalMinutes: (rec.goalMinutes as number) ?? DEFAULT_GOAL_MINUTES,
    goalUnits: (rec.goalUnits as number) ?? DEFAULT_GOAL_UNITS,
    goalWeeks: Array.isArray(rec.goalWeeks) ? (rec.goalWeeks as string[]) : [],
    goalCatchUp: !!rec.goalCatchUp,
    goalResetWeek: (rec.goalResetWeek as string) || undefined,
    goalExcusedWeeks: Array.isArray(rec.goalExcusedWeeks)
      ? (rec.goalExcusedWeeks as string[])
      : [],
    // ★★★ Wochenziel NEU (W2, 18.09.2026) - roh durchgereicht wie goalWeeks;
    // die eigentliche Prüfung jedes Abschnitts übernimmt erst
    // `kindWochenzielAusFeldern` (dort wird auch garbage json vertragen).
    wochenzielVerlauf: Array.isArray(rec.wochenzielVerlauf)
      ? (rec.wochenzielVerlauf as ZielAbschnitt[])
      : [],
    // im Griff (P1): optional — fehlt bei Konten vor P1, dann leer.
    toolProfile: (rec.toolProfile as string) || "",
    skillLevel: (rec.skillLevel as string) || "",
    // Kontakt-Adresse fürs Passwort per Mail (14.09.2026) - optional, leer bei
    // den meisten Konten. NICHT dasselbe wie das Auth-Feld `email` (das trägt
    // die erfundene Login-Adresse, siehe synthEmail()).
    contactEmail: (rec.contactEmail as string) || "",
    // Einhand schreiben: fehlt bei Alt-Konten → false (Gegenhand-Regel an).
    oneHand: !!rec.oneHand,
    // ★ „Gezielt üben" (13.11.2026): JSON-Feld, fehlt/leer/Unsinn → null (nicht gesetzt).
    gezielt: gezieltAus(rec.gezielt),
    // ★ 25.09.2026: eigene Schulstufe (0/fehlend = wie die Klasse).
    schulstufe: Number(rec.schulstufe) || 0,
    schulstufeSchuljahr: Number(rec.schulstufeSchuljahr) || 0,
    // „Zeit lassen" (14.08.2026): fehlt bei Alt-Konten → false (Tempo zählt).
    noTimePressure: !!rec.noTimePressure,
    // „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): roher Faktor, fehlt
    // bei Alt-Konten → 0 (via `zeichenabstandFaktor` gleichbedeutend mit „aus").
    zeichenabstand: Number(rec.zeichenabstand) || 0,
    // „Bereit für die Tippchallenge" (10.09.2026) - wehrhaft gelesen.
    probeBereit: bereitMeldungAus(rec.probeBereit) ?? undefined,
    // Selbstlernend (09.08.2026): eigenes Konto ohne Klasse und ohne Lehrkraft.
    // Fehlt bei allen Bestandskonten → false = Kind einer Klasse.
    selfManaged: !!rec.selfManaged,
    // Nur Selbstlernende haben eine ECHTE Adresse; Klassen-Kinder tragen die
    // synthetische `…@tt.local` — die zeigen wir nirgends an.
    email: rec.selfManaged ? ((rec.email as string) || "") : undefined,
    // Ist die Adresse durch den Link in der Mail bewiesen? Nur dann geht der
    // Wochenbericht dorthin (09.08.2026).
    verified: !!rec.verified,
    // Wochenbericht abbestellt (23.08.2026)? Fehlt bei Alt-Konten → false, also
    // Post wie bisher.
    mailWeeklyOptOut: !!rec.mailWeeklyOptOut,
    // Spendenbanner (Nachbesserung 19.09.2026) - nur bei `selfManaged` befüllt
    // (ein Kind einer Klasse bekommt den Banner nie), 0/fehlend = noch nie gezeigt.
    spendenAufrufAm: Number(rec.spendenAufrufAm) > 0 ? Number(rec.spendenAufrufAm) : 0,
    spendenAufrufMeilenstein:
      Number(rec.spendenAufrufMeilenstein) > 0 ? Number(rec.spendenAufrufMeilenstein) : 0,
    createdAt: (rec.createdAtMs as number) ?? 0,
  };
}

/**
 * Der Satz, den PocketBase zu einem Fehler mitschickt - der Hook formuliert
 * ihn für Kinder („Eure Lehrkraft hat das Klassenmatch … ausgeschaltet"). Fehlt
 * er (Netz weg, Server nicht erreichbar), bleibt ein leerer Text; der Aufrufer
 * setzt dann seinen eigenen Satz.
 */
function serverMeldung(err: unknown): string {
  const e = err as { response?: { message?: unknown }; data?: { message?: unknown }; message?: unknown } | null;
  const aus = e?.response?.message ?? e?.data?.message ?? "";
  if (typeof aus === "string" && aus.trim() && !/^Something went wrong/i.test(aus)) return aus.trim();
  return "";
}

function mapClass(rec: RecordModel): TypingClass {
  return {
    code: rec.code as string,
    name: rec.name as string,
    teacherId: rec.teacherUid as string,
    weeklyReport: !!rec.weeklyReport,
    // „Programme dieser Klasse" (MK-E2). Fehlt bei allen Bestandsklassen und
    // bei Klassen, die nie eingestellt wurden → leer = alle anzeigen.
    programs: Array.isArray(rec.programs) ? (rec.programs as string[]) : [],
    // ★ N6 (bis 19.09.2026: der einstellbare Wochenrhythmus, seither
    // abgeschafft, siehe `wochenrhythmus.ts`). Das Feld gibt es am Server
    // seit dem 02.07.2026 - es braucht KEINE Schema-Änderung.
    settings:
      rec.settings && typeof rec.settings === "object"
        ? (rec.settings as TypingClass["settings"])
        : null,
    // ★ Klassen-Einstellungen (11.09.2026), echte Felder - siehe den Typ.
    // Nie blind geglaubt: eine Schulstufe ausserhalb 1-13 ist „nicht
    // gesetzt", eine unbekannte Sprache ist die Vorgabe.
    // ★ 11.09.2026 Nacht: 100 = „Erwachsen" (`SCHULSTUFE_ERWACHSEN`,
    // Begründung in `klassenEinstellungen.ts`) gilt ebenfalls.
    schulstufe:
      typeof rec.schulstufe === "number" &&
      ((rec.schulstufe >= 1 && rec.schulstufe <= 13) || rec.schulstufe === 100)
        ? Math.round(rec.schulstufe)
        : undefined,
    schulstufeSchuljahr:
      typeof rec.schulstufeSchuljahr === "number" && rec.schulstufeSchuljahr > 2000
        ? Math.round(rec.schulstufeSchuljahr)
        : undefined,
    // ★ G2b-2: jede Sprache des Registers (vorher nur de/en: eine Klasse mit fr/es/it …
    // las sich ohne Sprache, und `nichtGespeicherteEinstellungen` meldete bei jedem
    // Anlegen „Sprache nicht gespeichert"). Unbekannt bleibt „nicht gesetzt".
    lang: istSprache(rec.lang) ? rec.lang : undefined,
    langLocked: !!rec.langLocked,
    klassenmatchAus: !!rec.klassenmatchAus,
    // ★ Zeilenende mit Enter (23.09.2026) - eigenes Bool-Feld, siehe den Typ.
    zeilenEndeEnter: !!rec.zeilenEndeEnter,
    // ★ „Gezielt üben" für die Klasse (13.11.2026) - JSON-Feld, siehe den Typ.
    gezielt: gezieltAus(rec.gezielt),
    // ★ Startniveau der Klasse als Vorgabe (11.09.2026 Nacht). `0` ist am
    // Server der leere Wert einer Zahlenspalte = keine Vorgabe.
    startUnits:
      typeof rec.startUnits === "number" && rec.startUnits > 0
        ? Math.round(rec.startUnits)
        : undefined,
    startUnitsAt:
      typeof rec.startUnitsAt === "number" && rec.startUnitsAt > 0
        ? Math.round(rec.startUnitsAt)
        : undefined,
    // ★ E1 (24.09.2026): Lernweg für NEUE Kinder der Klasse - leer = „de".
    ...(istLernweg(rec.lernweg) ? { lernweg: rec.lernweg } : {}),
    // ★ E9 (24.09.2026): Schreibweise-Vorgabe - leer = „automatisch".
    ...(istEnglischVariante(rec.schreibweise) ? { schreibweise: rec.schreibweise } : {}),
    // ★★★ Wochenziel NEU (W2, 18.09.2026) - beide wehrhaft wie der Rest
    // dieser Funktion: kaputtes JSON darf nie eine Klasse unlesbar machen.
    wochenzielVorgabe: wochenzielVorgabeAus(rec.wochenzielVorgabe),
    gesperrteZeiten: gesperrteZeitenAus(rec.gesperrteZeiten),
    // ★★★★★ Z1 (19.09.2026): die Reihe der „Eigenen Übungen" - wehrhaft
    // gelesen, ein kaputter Eintrag fällt weg (`eigeneUebungReihe.ts`).
    eigeneUebungen: eigeneUebungenAusRoh(rec.eigeneUebungen),
    // ★★★ »Im Griff« (29.09.2026): roh durchgereicht - gelesen wird über
    // `kapitelAusRoh` (`lib/computer/klassenKapitel.ts`).
    imgriffKapitel: rec.imgriffKapitel,
    createdAt: (rec.createdAtMs as number) ?? 0,
  };
}

/** Siehe {@link TypingClass.wochenzielVorgabe} - `undefined` bei jedem kaputten Wert. */
function wochenzielVorgabeAus(raw: unknown): TypingClass["wochenzielVorgabe"] {
  if (!raw || typeof raw !== "object") return undefined;
  const v = raw as Record<string, unknown>;
  if (typeof v.minuten !== "number" || !Number.isFinite(v.minuten)) return undefined;
  return {
    minuten: v.minuten,
    wochen: Array.isArray(v.wochen) ? (v.wochen as string[]) : [],
    nachholen: !!v.nachholen,
    am: typeof v.am === "number" ? v.am : 0,
  };
}

/** Siehe {@link TypingClass.gesperrteZeiten} - kaputte/halbe Einträge fallen einzeln weg. */
function gesperrteZeitenAus(raw: unknown): GesperrteZeit[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((z): z is GesperrteZeit => {
    if (!z || typeof z !== "object") return false;
    const g = z as Record<string, unknown>;
    return typeof g.abMs === "number" && typeof g.bisMs === "number";
  });
}

/**
 * Eine Match-Zeile vom Server. Wehrhaft wie {@link mapClass}: Ein unbekannter
 * Zustand gilt als `abgebrochen` - ein Match, dessen Zustand niemand versteht,
 * darf kein Kind vom Üben abhalten.
 */
function mapMatch(rec: RecordModel): Match {
  const status = rec.status as string;
  return {
    id: rec.id,
    classCode: String(rec.classCode ?? ""),
    hostUid: String(rec.hostUid ?? ""),
    hostName: String(rec.hostName ?? ""),
    status:
      status === "einladung" ||
      status === "countdown" ||
      status === "laeuft" ||
      status === "fertig"
        ? status
        : "abgebrochen",
    startMs: zahlAus(rec.startMs),
    endeMs: zahlAus(rec.endeMs),
    dauerMin: zahlAus(rec.dauerMin),
    createdMs: zahlAus(rec.createdMs),
  };
}

/** Eine Stand-Zeile vom Server. Unbekannter Zustand ⇒ `dabei` (zählt nicht mit). */
function mapMatchStand(rec: RecordModel): MatchStand {
  const status = rec.status as string;
  return {
    id: rec.id,
    matchId: String(rec.matchId ?? ""),
    classCode: String(rec.classCode ?? ""),
    pupilUid: String(rec.pupilUid ?? ""),
    name: String(rec.name ?? ""),
    // ★ 02.10.2026: `eingeladen`/`abgelehnt` bleiben, was sie sind. Bis dahin
    // wurde JEDER unbekannte Wert zu „dabei" - eine Einladung, über die noch
    // nicht entschieden ist, hätte als Teilnahme gezählt.
    status:
      status === "schreibt" || status === "fertig" || status === "eingeladen" || status === "abgelehnt"
        ? status
        : "dabei",
    zeichen: zahlAus(rec.zeichen),
    fehler: zahlAus(rec.fehler),
    apm: zahlAus(rec.apm),
    wert: zahlAus(rec.wert),
    wartezeitMs: zahlAus(rec.wartezeitMs),
    updatedMs: zahlAus(rec.updatedMs),
  };
}

/** Eine Zahl vom Server - alles andere ist 0. Nie negativ. */
function zahlAus(x: unknown): number {
  return typeof x === "number" && Number.isFinite(x) && x > 0 ? x : 0;
}

function fail(error: string): Result<never> {
  return { ok: false, error };
}

/**
 * ★ EN9 (19.09.2026): `{ bedienSprache: "en" }` fürs Anlegen eines Kontos, wenn
 * die Bedienung gerade englisch ist - sonst NICHTS (der deutsche Rumpf bleibt
 * Zeichen für Zeichen, wie er war). Die Sprache des Kontos bestimmt, in welcher
 * Sprache seine Mails kommen, schon die allererste (Bestätigung, Begrüssung).
 */
export function spracheBeimAnlegen(): { bedienSprache?: Exclude<BedienSprache, "de"> } {
  // ★ E11c (26.09.2026): auch „fr" - die Mails kennen es jetzt
  // (`kontoBedienSprache`, nicht `aktuelleBedienSprache`: die kennt „fr" nicht).
  // ★ ES-M (27.09.2026): ebenso „es" - die Mails am Server kennen es
  // (`MAIL_SPRACHEN` in tt_mail_texte_lib.pb.js; der Wächter
  // tastenflow-spanisch-mails vergleicht beide Listen).
  // ★ G2b-2 (02.10.2026): keine feste Liste mehr - jede Sprache ausser Deutsch wird
  // mitgeschickt (der Server nimmt it, pl, tr, cs an und schreibt ihnen Englisch,
  // solange es keine eigenen Mail-Texte gibt: `MAIL_SPRACHEN_OHNE_TEXT`). Ein Wert,
  // den das Register nicht kennt, wird ENGLISCH - nie Deutsch, nie ein Absturz.
  const s = kontoBedienSprache();
  if (s === "de") return {};
  return { bedienSprache: istSprache(s) ? s : "en" };
}

/**
 * ★ 27.09.2026: Hat die Anfrage den Server gar nicht (sinnvoll) erreicht?
 * Status 0 = kein Netz / abgebrochen; 408/429/5xx = Server gerade nicht in der
 * Lage. In all diesen Fällen lohnt ein späterer Versuch - anders als bei einer
 * echten Antwort des Servers (4xx), die beim nächsten Versuch gleich ausfiele.
 * Ein Fehler, der gar kein `ClientResponseError` ist, zählt ebenfalls als
 * „kein Kontakt" (nichts deutet darauf hin, dass der Server geantwortet hat).
 */
export function keinServerKontakt(e: unknown): boolean {
  if (!(e instanceof ClientResponseError)) return true;
  const st = e.status;
  return st === 0 || e.isAbort || st === 408 || st === 429 || st >= 500;
}

/**
 * ★★ 27.09.2026 (Prüfbefund S2): Fehlt das Netz WIRKLICH? Nur dann gilt ein
 * Fehlschlag als „netz" (Durchgang anhalten, ruhiger Satz „keine
 * Verbindung"). Ein Serverfehler (5xx, 408, 429, abgebrochene Anfrage,
 * unbekannter Fehler) ist etwas anderes: Das Kind IST online, der Satz wäre
 * falsch, und die Schlange soll mit dem Übrigen weitermachen.
 *
 * Wirklich offline: Status 0 ohne Abbruch (PocketBase verpackt so ein
 * gescheitertes `fetch`), ein nacktes `TypeError` aus `fetch`, oder der
 * Browser meldet `navigator.onLine === false`.
 */
export function wirklichOffline(e: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  if (e instanceof ClientResponseError) return e.status === 0 && !e.isAbort;
  return e instanceof TypeError;
}

/**
 * ★★★ DIE WARTESCHLANGE DARF DER ANMELDUNG NICHT DEN PLATZ NEHMEN (27.09.2026,
 * dritte und vierte Prüfung).
 *
 * `LocalAuthStore` schreibt die Anmeldung ohne Fehlerbehandlung in
 * `localStorage`. Im selben Topf liegt seit heute die Warteschlange im Gerät
 * (`nachsenden.ts`). Scheitert das Speichern der Anmeldung am vollen Topf,
 * gibt die Warteschlange GENAU so viel Platz frei, wie die Anmeldung braucht
 * (die ältesten Zeilen, gemeldet), und es wird EINMAL nochmal versucht.
 * Scheitert auch das, wirft es genau wie vorher.
 *
 * ⚠️ KEIN Rückfall „nur im Speicher dieses Tabs": `LocalAuthStore` liest Token
 * und Konto aus `localStorage` - ein Rückfall trug darum gar keine Anmeldung
 * oder sogar die des VORIGEN Kindes (vierte Prüfung S1).
 */
export class SichererAuthStore extends LocalAuthStore {
  save(token: string, record?: AuthRecord): void {
    try {
      super.save(token, record);
      return;
    } catch (e) {
      const bedarf = token.length + JSON.stringify(record ?? null).length + 200;
      if (!gibSpeicherFrei(bedarf)) throw e;
      console.warn("[anmeldung] Gerätespeicher war voll - Warteschlange hat Platz freigegeben");
    }
    super.save(token, record); // wirft wie vorher, wenn es immer noch nicht passt
  }
}

/**
 * ★ 27.09.2026: Optionen für eine abbrechbare Anfrage. Mit `signal` bricht
 * `AbortController.abort()` den `fetch` wirklich ab; `requestKey: null`
 * nimmt sie aus dem Auto-Abbruch des SDK. Ohne `signal`: genau wie bisher
 * (keine Optionen).
 */
function abbrechbar(signal?: AbortSignal): { signal: AbortSignal; requestKey: null } | undefined {
  return signal ? { signal, requestKey: null } : undefined;
}

/**
 * ★ Antwort eines Schreibens auf die Kennung beschränken (28.09.2026,
 * Serverlast). Ohne `fields` schickt PocketBase nach jedem PATCH den ganzen
 * Datensatz zurück - bei `lw_events` im Mittel 6,4 KB, bei `lw_progress`
 * 4,5 KB, je getippter Zeile beide. Gebraucht wird davon nur die Kennung (beim
 * Anlegen, für den Merker in `saveProgress`); `aktualisiereLw` verwirft die
 * Antwort ganz. Das Schreiben selbst ändert sich nicht.
 */
function nurKennung(signal?: AbortSignal): { fields: string; signal?: AbortSignal; requestKey?: null } {
  return { ...abbrechbar(signal), fields: "id" };
}

/** Fehlertext aus einer Hook-Antwort ziehen (e.json(status,{error})) — sonst generisch. */
function hookError(e: unknown): string {
  if (e instanceof ClientResponseError) {
    const r = e.response as { error?: string; message?: string } | undefined;
    if (r && typeof r.error === "string" && r.error) return r.error;
    if (r && typeof r.message === "string" && r.message) return r.message;
    if (e.status) return `Aktion fehlgeschlagen (${e.status}). Bitte erneut versuchen.`;
  }
  return "Aktion fehlgeschlagen. Ist der Server erreichbar?";
}

export class PocketBaseTypingBackend implements TypingBackend {
  readonly kind = "pocketbase" as const;
  private pb: PocketBase;
  /**
   * Die Kennung der EIGENEN Stand-Zeile je Match (Klassenmatch, 11.09.2026).
   *
   * ★ Gemerkt und nicht gesucht: Alle drei Sekunden schreibt jedes Kind seinen
   * Stand. Ohne diesen Merker käme vor jedem Schreiben eine Suchabfrage dazu -
   * bei 30 Kindern wären das 20 Abfragen je Sekunde je Klasse allein dafür.
   * Geht der Merker verloren (Neuladen), sucht `schreibeMatchStand` genau
   * einmal nach und merkt sich das Ergebnis wieder.
   */
  private matchStandIds = new Map<string, string>();

  /**
   * ★★ Die Kennung der `lw_progress`-Zeile je (Anmeldung, Kind, Programm)
   * (28.09.2026, Serverlast).
   *
   * Gemessen am Server (5 Tage): 78.467 Suchabfragen `lw_progress`
   * (pupilUid + program, perPage=1) - die häufigste Anfrage überhaupt. Vor
   * JEDEM Speichern des Lernstands wurde die Zeile gesucht, nur um ihre
   * Kennung zu erfahren; der Inhalt der Suche wurde nie gebraucht (Tastenflow
   * ERSETZT `data` beim Speichern, es führt nichts zusammen). Jetzt wird die
   * Kennung beim ersten Finden oder Anlegen gemerkt - wie `matchStandIds`.
   *
   * ⚠️ NUR für `lw_progress`. Die Lesung vor dem Schreiben von `lw_events`
   *    bleibt: Dort bestimmt sie den INHALT (anhängen an die Liste am Server)
   *    und ist die Sperre gegen das Überschreiben durch ein zweites Gerät
   *    (siehe `upsertLw`).
   * ⚠️ Der Schlüssel trägt die ANMELDUNG mit: ein Merker eines anderen Kontos
   *    am selben Gerät passt nie. `logout()` und das Löschen eines Kontos vergessen ihn.
   * ⚠️ Lazy angelegt: Die Wächter bauen das Backend mit `Object.create` - ein
   *    Feld-Initialisierer liefe dort nie.
   */
  private lwProgressIds?: Map<string, string>;
  private progressMerker(): Map<string, string> {
    return (this.lwProgressIds ??= new Map());
  }
  private progressSchluessel(pupilUid: string): string {
    const wer = (this.pb.authStore.record?.id as string | undefined) ?? "";
    return `${wer}|${pupilUid}|${PROGRAM}`;
  }
  private merkeProgressZeile(pupilUid: string, id: string | undefined): void {
    if (id) this.progressMerker().set(this.progressSchluessel(pupilUid), id);
  }
  private vergissProgressZeile(pupilUid: string): void {
    const merker = this.lwProgressIds;
    if (!merker) return;
    for (const k of [...merker.keys()]) if (k.split("|")[1] === pupilUid) merker.delete(k);
  }

  constructor() {
    const url = backendUrl();
    // EIGENER authStore-Schlüssel → keine Kollision mit der LMS-Sitzung.
    this.pb = new PocketBase(url, new SichererAuthStore("tt_pb_auth"));
    this.pb.autoCancellation(false);
  }

  // --- Sitzung ---------------------------------------------------------------
  currentAccount(): TypingAccount | null {
    const rec = this.pb.authStore.record as RecordModel | null;
    if (!rec || !this.pb.authStore.isValid) return null;
    if (rec.collectionName === "tt_teachers") return mapTeacher(rec);
    if (rec.collectionName === "tt_pupils") return mapPupil(rec);
    return null;
  }

  /**
   * ★ L2 (19.09.2026, Johannes: *„ich habe den CVI-Zeichenabstand bei Jano
   * getestet … da aktualisiert etwas nicht, den Browser von Jano hab ich
   * aktualisiert"*). Gemessen: am Server stand der Wert (4), auf dem Gerät
   * nicht - `currentAccount` liest den Datensatz, der bei der ANMELDUNG in
   * den `authStore` kam, und ein Neuladen fragte den Server nie. `authRefresh`
   * holt den Datensatz frisch UND verlängert die Sitzung; der `authStore`
   * trägt danach den neuen Stand. Scheitert es (offline, abgelaufen), bleibt
   * alles, wie es war - ein Ladefehler nimmt nie etwas weg.
   */
  async kontoAuffrischen(): Promise<TypingAccount | null> {
    const rec = this.pb.authStore.record as RecordModel | null;
    if (!rec || !this.pb.authStore.isValid) return null;
    const sammlung = rec.collectionName;
    if (sammlung !== "tt_teachers" && sammlung !== "tt_pupils") return null;
    try {
      await this.pb.collection(sammlung).authRefresh();
    } catch (e) {
      // ★★★★★ 23.09.2026: Lehnt der Server die Anmeldung ab, ist das KEIN
      // Ladefehler - ab hier geht kein Schreibversuch mehr durch
      // (`lib/typing/sitzung.ts`). Kein Netz bleibt `null`.
      if (e instanceof ClientResponseError && !e.isAbort && lehntSitzungAb(e.status))
        throw new SitzungAbgelaufenFehler();
      return null;
    }
    return this.currentAccount();
  }

  /** Ablauf der gespeicherten Anmeldung (siehe `TypingBackend.sitzungEndetMs`). */
  sitzungEndetMs(): number {
    const token = this.pb.authStore.token;
    if (!token) return 0;
    const exp = getTokenPayload(token).exp;
    return typeof exp === "number" && Number.isFinite(exp) ? exp * 1000 : 0;
  }

  /**
   * ★ L2b (19.09.2026): Realtime auf den EIGENEN Datensatz. Johannes, nachdem
   * das Auffrischen beim Neuladen ging: *„jetzt sind die Buchstaben sehr weit
   * bei Jano auseinander, das ist gut, aber wenn ich jetzt wieder umstelle,
   * passiert bei ihm nichts"*. Die Lehrkraft schreibt `tt_pupils` des Kindes;
   * die viewRule lässt das Kind seinen eigenen Datensatz sehen - also darf
   * es ihn auch abonnieren. Der `authStore` wird mitgeführt, damit auch ein
   * späteres Neuladen den neuen Stand hat.
   *
   * Eine gerissene Verbindung fängt `kontoAuffrischen` beim Zurückkommen ins
   * Fenster (useTypingAuth) - dasselbe Netz wie bei der Klasse.
   */
  kontoBeobachten(id: string, beiAenderung: (konto: TypingAccount) => void): () => void {
    const rec = this.pb.authStore.record as RecordModel | null;
    if (!rec || rec.id !== id || !this.pb.authStore.isValid) return () => {};
    const sammlung = rec.collectionName;
    if (sammlung !== "tt_teachers" && sammlung !== "tt_pupils") return () => {};
    let abmelden: (() => Promise<void>) | null = null;
    let beendet = false;
    this.pb
      .collection(sammlung)
      .subscribe(id, (e) => {
        if (beendet || e.action !== "update") return;
        const aktuell = this.pb.authStore.record as RecordModel | null;
        if (!aktuell || aktuell.id !== id) return;
        this.pb.authStore.save(this.pb.authStore.token, e.record);
        const konto = this.currentAccount();
        if (konto) beiAenderung(konto);
      })
      .then((ab) => {
        if (beendet) void ab().catch(() => {});
        else abmelden = ab;
      })
      .catch(() => {
        /* kein Realtime (Netz, Proxy) - dann trägt das Auffrischen */
      });
    return () => {
      beendet = true;
      if (abmelden) void abmelden().catch(() => {});
    };
  }

  /** Zeitpunkt der letzten Ausweis-Beschaffung (0 = noch nie). */
  private inhaltsAusweisBisMs = 0;
  async inhaltsAusweisSichern(opt?: { frisch?: boolean }): Promise<void> {
    // Gleiches Muster wie im LMS-Backend (`src/backend/pocketbase.ts`): Das
    // Cookie hält 20 Minuten (COOKIE_MAXAGE_S im Hook), erneuert wird nach 10 -
    // so läuft es nie mitten im Handbuch-Download ab.
    //
    // ⚠️⚠️ GEMESSEN am 23.09.2026 (Mail einer Lehrerin, Server-Protokoll): Das
    //   Cookie hält 20 Minuten, der AUSWEIS darin aber nur so lange, wie die
    //   Sammlung ihn ausstellt - für `tt_teachers`/`tt_pupils` waren das 180 s
    //   (seit 23.09. 1800 s, `setup.mjs`). Zwischen Minute 3 und 10 lief jeder
    //   Handbuch-Download in ein 404, auch nach Ab- und Anmelden. Darum:
    //   `frisch` (vor jedem Download) holt IMMER einen neuen, und `logout()`
    //   setzt die Sperre zurück.
    const ERNEUERN_NACH_MS = 10 * 60 * 1000;
    const jetzt = Date.now();
    if (!opt?.frisch && this.inhaltsAusweisBisMs > jetzt - ERNEUERN_NACH_MS) return;
    if (!this.pb.authStore.isValid) return; // ohne Anmeldung keinen Ausweis
    try {
      await this.pb.send("/api/sensorik/inhalt/ausweis", { method: "POST" });
      this.inhaltsAusweisBisMs = jetzt;
    } catch {
      // Bewusst geschluckt: Ohne Ausweis bleibt es beim 404 für Geschützte -
      // richtig für Nicht-Berechtigte, kein Grund für einen Absturz.
      this.inhaltsAusweisBisMs = 0;
    }
  }

  logout(): void {
    this.pb.authStore.clear();
    // ★ 28.09.2026: gemerkte `lw_progress`-Kennungen gehören der Anmeldung.
    this.lwProgressIds?.clear();
    // Die nächste Anmeldung ist ein anderes Konto (oder dasselbe neu) - sie
    // bekommt einen eigenen Ausweis, nicht die Sperre des alten.
    this.inhaltsAusweisBisMs = 0;
  }

  // --- Lehrkraft -------------------------------------------------------------
  async registerTeacher(name: string, email: string, password: string) {
    const mail = email.trim().toLowerCase();
    if (!name.trim()) return fail("Bitte einen Namen angeben.");
    if (!mail.includes("@")) return fail("Bitte eine gültige E-Mail angeben.");
    if (password.length < 6)
      return fail("Das Passwort braucht mindestens 6 Zeichen.");
    try {
      await this.pb.collection("tt_teachers").create({
        name: name.trim(),
        email: mail,
        password,
        passwordConfirm: password,
        createdAtMs: Date.now(),
        // ★ EN9: Lief die Anmeldung auf Englisch, kommen schon Bestätigung
        // und Begrüssung englisch (`tt_mail_sprache.pb.js`,
        // `tt_teacher_welcome.pb.js`). Deutsch: das Feld bleibt weg.
        ...spracheBeimAnlegen(),
        // ★ 16.11.2026: Wo das Konto entsteht, dorthin zeigen schon Bestätigung
        // und Begrüssung (`tt_heimat_lib.pb.js`).
        // Auf weingartner.org bleibt das Feld weg - der Rumpf wie vorher.
        ...(hausApp() ? { heimat: hausApp() } : {}),
      });
      // Bestätigungs-Mail mit Link (09.08.2026): Bis dahin gab es nur eine
      // Begrüßungs-Mail OHNE Link — die beweist nichts. Erst der Klick zeigt,
      // dass die Adresse jemandem gehört, der sie auch öffnen kann.
      await this.sendeLehrkraftBestaetigung(mail);
      const auth = await this.pb
        .collection("tt_teachers")
        .authWithPassword(mail, password);
      return { ok: true as const, value: mapTeacher(auth.record) };
    } catch (e) {
      if (e instanceof ClientResponseError && e.status === 400)
        return fail("Für diese E-Mail gibt es schon ein Konto.");
      return fail("Konto konnte nicht erstellt werden. Ist der Server erreichbar?");
    }
  }

  async loginTeacher(email: string, password: string) {
    try {
      const auth = await this.pb
        .collection("tt_teachers")
        .authWithPassword(email.trim().toLowerCase(), password);
      this.bedienSpracheAbgleichen(auth.record);
      return { ok: true as const, value: mapTeacher(auth.record) };
    } catch {
      return fail("E-Mail oder Passwort stimmt nicht.");
    }
  }

  // „Passwort vergessen": PocketBases eingebauter, sicherer Reset-Weg auf der
  // tt_teachers-Tabelle. Die Mail (Vorlage in PB-Admin) verlinkt auf
  // /lernprogramm-passwort?token=… → confirmTeacherPasswordReset.
  // Antwort verrät NICHT, ob die Adresse existiert (kein Konto-Ausspähen).
  async requestTeacherPasswordReset(email: string) {
    try {
      await this.pb.collection("tt_teachers").requestPasswordReset(email.trim().toLowerCase());
    } catch {
      // bewusst verschluckt — gleiche Antwort, egal ob Konto existiert
    }
    return { ok: true as const, value: true as const };
  }

  async confirmTeacherPasswordReset(token: string, newPassword: string) {
    if (newPassword.length < 6) return fail("Das Passwort braucht mindestens 6 Zeichen.");
    try {
      await this.pb
        .collection("tt_teachers")
        .confirmPasswordReset(token, newPassword, newPassword);
      return { ok: true as const, value: true as const };
    } catch (e) {
      if (e instanceof ClientResponseError && e.status === 400)
        return fail("Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.");
      return fail("Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?");
    }
  }

  // --- Klassen ---------------------------------------------------------------
  /**
   * ★ Der Klassencode ist PFLICHT (10.09.2026, Johannes) - bis dahin erzeugte
   * diese Methode bei leerem Feld sechs Zufallszeichen. Die Kinder melden sich
   * mit dem Code an; einen zum Namen passenden schlägt jetzt die Oberfläche
   * vor (`lib/lernwerkstatt/klassencode.ts`).
   */
  async createClass(
    teacherId: string,
    name: string,
    code: string,
    einstellungen?: KlassenAnlage,
    /**
     * ★ Nachbesserung 20.09.2026 (Johannes: „Das Programm kann ja eine Nummer
     * vergeben und damit arbeiten"). `true`, wenn `code` der aus dem Namen
     * VORGESCHLAGENE Code ist (`codeSelbst === false` in `KlasseUndKinder.tsx`).
     * Belegt eine ANDERE Lehrkraft genau diesen Code (global eindeutig, siehe
     * `idx_tt_class_code`), versucht diese Methode selbst den nächsten freien
     * ("TEST" → "TEST2" …) - erst wenn auch das misslingt, oder der Code
     * selbst getippt war, kommt die Absage.
     */
    codeAutoVorschlag?: boolean,
  ) {
    if (!name.trim()) return fail("Bitte einen Klassennamen angeben.");
    const wish = (code ?? "").trim().toUpperCase();
    if (!wish)
      return fail("Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.");
    if (!CLASS_CODE_RE.test(wish))
      return fail(
        "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.",
      );
    /*
      ★★★ Die Einstellungen gehen IM SELBEN Aufruf mit (11.09.2026, Nacht).
      Geprüft, dass der Server sie beim Anlegen annimmt: Die create-Regel in
      `setup.mjs` prüft nur Lehrkraft, Besitzer und Code; `tt_klasse.pb.js`
      nur, dass der Code nicht leer ist; `tt_grenzen.pb.js` nur die Zahl der
      Klassen. Kein Hook verwirft oder prüft die übrigen Felder.
      ⚠️ Kennt der Server ein Feld nicht (Schema nicht eingespielt), übergeht
      PocketBase es OHNE Fehler. Darum vergleicht die Verwaltung die Antwort
      mit dem Gewünschten (`nichtGespeicherteEinstellungen`) und sagt, was
      fehlt - statt eine halb eingerichtete Klasse still stehen zu lassen.
    */
    const body: Record<string, unknown> = {
      name: name.trim(),
      teacherUid: teacherId,
      weeklyReport: false,
      createdAtMs: Date.now(),
      data: {},
    };
    if (einstellungen) {
      const e = einstellungen;
      if (e.schulstufe !== undefined && e.schulstufe > 0) {
        body.schulstufe = Math.round(e.schulstufe);
        body.schulstufeSchuljahr = e.schulstufeSchuljahr ?? 0;
      }
      if (e.lang !== undefined) body.lang = e.lang;
      if (e.langLocked !== undefined) body.langLocked = e.langLocked;
      if (e.klassenmatchAus !== undefined) body.klassenmatchAus = e.klassenmatchAus;
      // Wert und Beschluss-Zeitpunkt gehören zusammen (wie `setStartUnits`).
      if (e.startUnits !== undefined && e.startUnits > 0) {
        body.startUnits = Math.round(e.startUnits);
        body.startUnitsAt = Date.now();
      }
      // ★ Zeilenende mit Enter (23.09.2026), siehe TypingClass.zeilenEndeEnter.
      if (e.zeilenEndeEnter !== undefined) body.zeilenEndeEnter = e.zeilenEndeEnter;
      if (e.gezielt !== undefined) body.gezielt = e.gezielt ? gezieltAus(e.gezielt) : null;
      // ★ E1 (24.09.2026): der Lernweg für neue Kinder - nur „en" wird geschrieben.
      // ★ E11c (26.09.2026): ebenso „fr" (`tt_classes.lernweg` ist freier Text).
      // ★ ES-M (27.09.2026): jeder gültige Weg ausser „de" (leer heisst „de") -
      // an der Eigenschaft statt an einer Liste (Leitfaden, Falle 50); damit
      // auch „es".
      if (istLernweg(e.lernweg) && e.lernweg !== "de") body.lernweg = e.lernweg;
      // ★ E9 (24.09.2026): die Schreibweise-Vorgabe - nur „gb"/„us" wird geschrieben.
      if (e.schreibweise === "gb" || e.schreibweise === "us") body.schreibweise = e.schreibweise;
      // ★ D2 (28.09.2026): der Beginn des Schuljahres - in `settings` (JSON,
      // seit 02.07.2026 am Server), KEINE neue Spalte. Eine neue Klasse hat
      // dort noch nichts, darum ein frisches Objekt.
      if (istSchuljahrBeginn(e.schuljahrBeginn)) body.settings = { schuljahrBeginn: e.schuljahrBeginn };
    }

    /*
      ★ Punkt 2 der Nachbesserung: WARUM ein erneuter Versuch nach dem
      Fehlschlag statt eines Vorab-Checks beim Tippen. Ein Vorab-Check
      bräuchte eine NEUE Route (der Klassencode ist über die normale
      Sammlungs-Schnittstelle nicht abfragbar - `tt_classes` hat keine
      passende Leseregel für "gibt es Code X", und eine eigene Regel dafür zu
      öffnen hiesse, jeder Lehrkraft eine Suche über fremde Klassencodes zu
      erlauben). Der erneute Versuch braucht dagegen NICHTS Neues: Er nutzt
      dieselbe `create`-Anfrage und dieselbe Unterscheidung
      `validation_not_unique` am Feld `code`, die es hier schon gab (siehe
      unten) - nur eben in einer Schleife.
    */
    let versuchCode = wish;
    for (let versuch = 1; versuch <= 20; versuch++) {
      try {
        const rec = await this.pb.collection("tt_classes").create({ ...body, code: versuchCode });
        return { ok: true as const, value: mapClass(rec) };
      } catch (e) {
        if (e instanceof ClientResponseError && e.status === 400) {
          // ★ 19.09.2026: EIN 400er hatte bisher IMMER diesen Satz, auch wenn er
          // von der Klassen-Grenze (`tt_grenzen.pb.js`, „höchstens 20 Klassen je
          // Lehrkraft") kam - der Klassencode war dann frei, nur die Grenze war
          // erreicht. Am Feld unterscheiden, nicht raten: Nur eine echte
          // Doppelung des Codes (Server: `code.code === "validation_not_unique"`)
          // bekommt diesen Satz, jeder andere 400er die eigene Meldung des Hooks.
          const feld = (e.response as { data?: Record<string, { code?: string }> } | undefined)
            ?.data?.code;
          if (feld?.code === "validation_not_unique") {
            if (codeAutoVorschlag && versuch < 20) {
              versuchCode = naechsterKlassencodeVersuch(wish, versuch + 1);
              continue;
            }
            return fail(
              "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).",
            );
          }
          return fail(hookError(e));
        }
        return fail("Klasse konnte nicht angelegt werden. Ist der Server erreichbar?");
      }
    }
    return fail(
      "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).",
    );
  }

  async listClasses(_teacherId: string) {
    // KEIN teacherUid-Filter mehr: die listRule auf tt_classes liefert die eigenen
    // UND die co-betreuten Klassen (über die Co-Lehrkraft-Mitgliedschaft). Sortiert
    // nach Anlagezeit. Der teacherId-Parameter bleibt für die Schnittstelle erhalten.
    const list = await this.pb
      .collection("tt_classes")
      .getFullList({ sort: "createdAtMs" });
    return list.map(mapClass);
  }

  // --- Co-Lehrkräfte (über den Server-Hook tt_coteacher) ---------------------
  async listClassTeachers(classCode: string): Promise<ClassTeacher[]> {
    try {
      const res = (await this.pb.send("/api/tt/coteacher/list", {
        method: "POST",
        body: { classCode },
      })) as { teachers?: ClassTeacher[] };
      return Array.isArray(res?.teachers) ? res.teachers : [];
    } catch {
      return [];
    }
  }

  async addTeacherToClass(
    classCode: string,
    email: string,
  ): Promise<Result<{ teachers: ClassTeacher[]; invitedEmail?: string }>> {
    try {
      const res = (await this.pb.send("/api/tt/coteacher/add", {
        method: "POST",
        body: { classCode, email },
      })) as { teachers?: ClassTeacher[]; invited?: boolean; email?: string };
      return {
        ok: true,
        value: {
          teachers: res?.teachers ?? [],
          invitedEmail: res?.invited ? res.email : undefined,
        },
      };
    } catch (e) {
      return fail(hookError(e));
    }
  }

  async removeTeacherFromClass(
    classCode: string,
    teacherId: string,
  ): Promise<Result<ClassTeacher[]>> {
    try {
      const res = (await this.pb.send("/api/tt/coteacher/remove", {
        method: "POST",
        body: { classCode, teacherId },
      })) as { teachers?: ClassTeacher[] };
      return { ok: true, value: res?.teachers ?? [] };
    } catch (e) {
      return fail(hookError(e));
    }
  }

  async previewCoteacherInvite(
    token: string,
  ): Promise<Result<{ klasseName: string; email: string; eingeloest: boolean }>> {
    try {
      const res = (await this.pb.send("/api/tt/coteacher/invite-vorschau", {
        method: "POST",
        body: { token },
      })) as { klasseName: string; email: string; eingeloest: boolean };
      return { ok: true, value: res };
    } catch (e) {
      return fail(hookError(e));
    }
  }

  async acceptCoteacherInvite(
    token: string,
  ): Promise<Result<{ classCode: string; klasseName: string }>> {
    try {
      const res = (await this.pb.send("/api/tt/coteacher/invite-annehmen", {
        method: "POST",
        body: { token },
      })) as { classCode: string; klasseName: string };
      return { ok: true, value: res };
    } catch (e) {
      return fail(hookError(e));
    }
  }

  async setClassWeeklyReport(code: string, teacherId: string, on: boolean) {
    try {
      const rec = await this.pb
        .collection("tt_classes")
        .getFirstListItem(
          this.pb.filter("code={:c} && teacherUid={:t}", { c: code, t: teacherId }),
        );
      const updated = await this.pb
        .collection("tt_classes")
        .update(rec.id, { weeklyReport: on });
      return mapClass(updated);
    } catch {
      return null;
    }
  }

  /**
   * „Programme dieser Klasse" setzen (MK-E2). Anders als `setClassWeeklyReport`
   * OHNE `teacherUid`-Filter — sonst könnte eine Co-Lehrkraft die Einstellung
   * nicht ändern. Wer darf, entscheidet die Server-Regel auf `tt_classes`
   * (Eigentümer:in ODER Co-Lehrkraft), nicht dieser Client.
   */
  async getClass(code: string) {
    try {
      const rec = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: code }));
      return mapClass(rec);
    } catch {
      // Ein Kind ohne Klasse, ein falscher Code, kein Netz: In allen drei
      // Fällen gilt der alte Rhythmus (Montag bis Sonntag), und niemand
      // verliert etwas. Eine Ausnahme hier würde den Trainer anhalten.
      return null;
    }
  }

  // ── Realtime (10.09.2026) ─────────────────────────────────────────────────
  /**
   * Eine Sammlung beobachten - die EINE Stelle für `subscribe`.
   *
   * ⚠️ Der Filter wird MITGESCHICKT (weniger Ereignisse im Netz) und im
   * Rückruf trotzdem noch einmal geprüft: Was durchkommt, entscheidet am
   * Server die listRule, nicht der Filter. Scheitert die Verbindung, passiert
   * nichts - die Nachfrage im Takt bleibt das Netz. Wird abgemeldet, bevor die
   * Anmeldung fertig ist, meldet sie sich gleich danach wieder ab.
   */
  private beobachte(
    sammlung: string,
    filter: string,
    nimm: (rec: RecordModel) => void,
  ): () => void {
    let beendet = false;
    let abmelden: UnsubscribeFunc | null = null;
    this.pb
      .collection(sammlung)
      .subscribe(
        "*",
        (ev) => {
          if (!beendet && ev.action !== "delete") nimm(ev.record);
        },
        { filter },
      )
      .then((aus) => {
        if (beendet) void aus().catch(() => {});
        else abmelden = aus;
      })
      .catch(() => {
        /* keine Verbindung: die Nachfrage im Takt bleibt */
      });
    return () => {
      beendet = true;
      if (abmelden) void abmelden().catch(() => {});
    };
  }

  beobachteKlasse(code: string, beiAenderung: (cls: TypingClass) => void) {
    return this.beobachte("tt_classes", this.pb.filter("code={:c}", { c: code }), (rec) => {
      if (rec.code === code) beiAenderung(mapClass(rec));
    });
  }

  beobachteKinder(classCode: string, beiAenderung: (kind: TypingAccount) => void) {
    return this.beobachte(
      "tt_pupils",
      this.pb.filter("classCode={:c}", { c: classCode }),
      (rec) => {
        if (rec.classCode === classCode) beiAenderung(mapPupil(rec));
      },
    );
  }

  /**
   * „Bereit" melden. Die Zeit im Rumpf ist nur ein Platzhalter - der Server
   * setzt sie selbst (`tt_pupils_field_guard.pb.js`). `selfPupilFields`, weil
   * die updateRule des Kindes die unveränderte `teacherUid` verlangt.
   */
  async meldeProbeBereit(accountId: string, probeId: string) {
    try {
      await this.pb.collection("tt_pupils").update(accountId, {
        probeBereit: { probeId, ms: Date.now() },
        ...this.selfPupilFields(accountId),
      });
      return true;
    } catch {
      return false;
    }
  }

  // ── Klasseneinstellungen (E3, 11.09.2026) ────────────────────────────────
  /**
   * ★★★ B8: Schulstufe, Eintragsjahr, Sprache und Sprachsperre der Klasse -
   * echte Felder an `tt_classes` (nicht `settings`; die 2000 Bytes dort tragen
   * schon Plan und Zeiger, `setup.mjs:1230`).
   *
   * OHNE `teacherUid`-Filter, sonst
   * könnte eine Co-Lehrkraft nichts ändern. Wer darf, entscheidet die
   * updateRule am Server, nicht dieser Aufruf.
   *
   * ⚠️ `schulstufe: 0` löscht - am Server ist `0` der leere Wert einer
   * Zahlenspalte, das Eintragsjahr geht mit. Ein Jahr ohne Stufe wäre eine
   * Angabe, zu der es nichts mehr gibt.
   */
  async setClassEinstellungen(
    code: string,
    _teacherId: string,
    aenderung: KlassenEinstellungenAenderung,
  ) {
    try {
      const rec = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: code }));
      const body: Record<string, unknown> = {};
      if (aenderung.schulstufe !== undefined) {
        const stufe = Math.max(0, Math.round(aenderung.schulstufe));
        body.schulstufe = stufe;
        body.schulstufeSchuljahr =
          stufe === 0 ? 0 : (aenderung.schulstufeSchuljahr ?? rec.schulstufeSchuljahr ?? 0);
      } else if (aenderung.schulstufeSchuljahr !== undefined) {
        body.schulstufeSchuljahr = aenderung.schulstufeSchuljahr;
      }
      if (aenderung.lang !== undefined) body.lang = aenderung.lang;
      if (aenderung.langLocked !== undefined) body.langLocked = aenderung.langLocked;
      /*
        ★★★ NACHBESSERUNG 23.09.2026 (gefunden beim Bauplan „Zeilenende mit
        Enter"): `startUnits` fehlte hier - die Oberfläche
        (`TastenflowReiter.stufeSetzen`) meldete „gilt", aber der Server bekam
        die Vorgabe nie (der Parametertyp war lokal
        nachgebaut und liess `startUnits` weg, TS methodenbivariant erkannte
        die Lücke nicht). Live hatten 24 von 43 Klassen einen Wert - nur vom
        ANLEGEN (`createClass` oben schreibt es korrekt), nie vom nachträglichen
        Ändern. Wert und Zeitpunkt gehören zusammen, wie in `account.ts`.
      */
      if (aenderung.startUnits !== undefined) {
        const units = Math.max(0, Math.round(aenderung.startUnits));
        body.startUnits = units;
        body.startUnitsAt = units > 0 ? Date.now() : 0;
      }
      // ★ Zeilenende mit Enter (23.09.2026), siehe TypingClass.zeilenEndeEnter.
      if (aenderung.zeilenEndeEnter !== undefined)
        body.zeilenEndeEnter = aenderung.zeilenEndeEnter;
      // ★ „Gezielt üben" (13.11.2026): `null` löscht, sonst gesäubert.
      if (aenderung.gezielt !== undefined)
        body.gezielt = aenderung.gezielt ? gezieltAus(aenderung.gezielt) : null;
      // ★ E1 (24.09.2026): nur die VORGABE für neue Kinder - kein bestehendes
      // Kind wird angefasst (dessen Weg steht fest, D2).
      // ★ E2a: „de" bleibt der stille Normalfall (leerer String) - jeder
      // ANDERE gültige Weg (jetzt auch „fr") wird geschrieben. Vorher stand
      // hier `=== "en" ? "en" : ""` - das hätte „fr" still verworfen.
      if (aenderung.lernweg !== undefined)
        body.lernweg = aenderung.lernweg === "de" ? "" : aenderung.lernweg;
      // ★ E9 (24.09.2026): die Schreibweise-Vorgabe - `""` löscht sie wieder
      // (zurück auf „automatisch"), siehe TypingClass.schreibweise.
      if (aenderung.schreibweise !== undefined)
        body.schreibweise = istEnglischVariante(aenderung.schreibweise)
          ? aenderung.schreibweise
          : "";
      // ★ D2 (28.09.2026): der Beginn des Schuljahres - in `settings`. ⚠️ Das
      // GANZE Feld geht zurück (PocketBase ersetzt JSON, es mischt nicht) -
      // darum `...alt`, sonst wären Plan und Zeiger der Tippchallenge weg.
      // Dasselbe Muster wie `setzeSchreibprobe`.
      if (istSchuljahrBeginn(aenderung.schuljahrBeginn)) {
        const alt = (rec.settings && typeof rec.settings === "object" ? rec.settings : {}) as Record<
          string,
          unknown
        >;
        body.settings = { ...alt, schuljahrBeginn: aenderung.schuljahrBeginn };
      }
      const updated = await this.pb.collection("tt_classes").update(rec.id, body);
      return mapClass(updated);
    } catch {
      return null;
    }
  }

  // ── Klassenmatch (11.09.2026) ─────────────────────────────────────────────
  /**
   * F8: Das Klassenmatch je Klasse abschalten. Eigenes Feld an `tt_classes`
   * (nicht `settings`); schreiben darf nur die Lehrkraft - das entscheidet die
   * updateRule, nicht dieser Aufruf (`_teacherId` bleibt ungenutzt).
   */
  async setClassKlassenmatchAus(code: string, _teacherId: string, aus: boolean) {
    try {
      const rec = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: code }));
      const updated = await this.pb
        .collection("tt_classes")
        .update(rec.id, { klassenmatchAus: aus });
      return mapClass(updated);
    } catch {
      return null;
    }
  }

  /**
   * ★★★★★ EIN NETZFEHLER GEHT ALS FEHLER NACH OBEN (11.09.2026 spät).
   *
   * Bis dahin stand hier `catch { return []; }` - „kein Netz, dann gibt es eben
   * gerade kein Match". Das war im Match der falsche Handel: Der einzige
   * Aufrufer (`useKlassenmatch` über `useKlassenBeobachtung`) hält bei einem
   * FEHLER den bisherigen Stand, eine LEERE Liste aber übernimmt er. Ein Kind im
   * Schul-WLAN verlor so mitten im Schreiben sein Match, der Lauf hing aus, und
   * die Zähler begannen danach bei null (nachgestellt:
   * `tests/typing-klassenmatch-netzaussetzer.test.tsx`).
   *
   * Das Üben hängt weiterhin nicht daran: Der Haken fängt den Fehler selbst ab.
   */
  async listeMatches(classCode: string) {
    const recs = await this.pb.collection("tt_matches").getFullList({
      filter: this.pb.filter("classCode={:c}", { c: classCode }),
      // ⚠️ KEIN `sort` auf ein selbst gepflegtes Feld über die Liste - die
      // Reihenfolge macht der Client (`offeneMatches`). Ein Match mehr oder
      // weniger in der Antwort ist harmlos, eine falsche Sortierung am
      // Server wäre es nicht.
    });
    return recs.map(mapMatch);
  }

  /**
   * Ein Match ausschreiben. Mitgeschickt wird nur, was die createRule verlangt
   * (`hostUid` und `classCode` müssen zum angemeldeten Kind passen) - `status`,
   * `hostName`, `dauerMin` und `createdMs` setzt der Hook am Server neu.
   * Ein Kind, das hier etwas anderes schriebe, bekäme es überschrieben.
   */
  async erstelleMatch(account: TypingAccount) {
    if (!account.classCode) return null;
    try {
      const rec = await this.pb.collection("tt_matches").create({
        classCode: account.classCode,
        hostUid: account.id,
        hostName: account.name,
        status: "einladung",
        startMs: 0,
        endeMs: 0,
        dauerMin: 0,
        createdMs: 0,
      });
      return mapMatch(rec);
    } catch (err) {
      /*
       * ★★★★★ NICHT VERSCHLUCKEN (Johannes, 11.09.2026 abends: „wenn ich als
       * Sarah auf Klassenmatch klicke, dann passiert gar nichts"). Bis dahin
       * stand hier `return null` - und der Hook-Absturz am Server
       * (`ReferenceError`, Serverprotokoll 17:51) kam bei niemandem an: kein
       * Fenster, kein Satz, nichts. Der Hook weist auch bewusst ab (Lehrkraft
       * hat abgeschaltet, zwei offen) - und genau DIESE Sätze soll das Kind
       * lesen. Darum wandert die Meldung des Servers als Fehler nach oben;
       * `useKlassenmatch` macht daraus einen Satz am Bildschirm.
       */
      throw new Error(serverMeldung(err));
    }
  }

  async aktualisiereMatch(matchId: string, status: MatchStatus) {
    try {
      const rec = await this.pb.collection("tt_matches").update(matchId, { status });
      return mapMatch(rec);
    } catch {
      return null;
    }
  }

  beobachteMatches(classCode: string, beiAenderung: (match: Match) => void) {
    return this.beobachte(
      "tt_matches",
      this.pb.filter("classCode={:c}", { c: classCode }),
      (rec) => {
        if (rec.classCode === classCode) beiAenderung(mapMatch(rec));
      },
    );
  }

  /**
   * Wie {@link listeMatches}: Ein Netzfehler geht als Fehler nach oben. Eine
   * leere Liste leerte mitten im Match das Ranking, und im Wartefenster ginge
   * „Starten" nicht mehr, weil scheinbar niemand dabei ist.
   */
  async listeMatchStaende(matchId: string) {
    const recs = await this.pb.collection("tt_match_stand").getFullList({
      filter: this.pb.filter("matchId={:m}", { m: matchId }),
    });
    return recs.map(mapMatchStand);
  }

  /**
   * Die eigene Stand-Zeile schreiben. Erst versuchen zu ändern, sonst anlegen -
   * der eindeutige Index (`matchId`, `pupilUid`) lässt keine zweite Zeile zu,
   * und der Weg über „suchen, dann entscheiden" wäre eine Abfrage mehr je drei
   * Sekunden und je Kind.
   *
   * ★★★ JEDE ANTWORT IST ZUGLEICH EIN ZEITABGLEICH (11.09.2026, E6b). Der
   * Datensatz trägt `updated` - den Stempel der SERVER-Uhr. Daraus rechnet
   * {@link meldeServerZeit} den Versatz gegen die Geräte-Uhr, und alle
   * Vergleiche gegen `startMs`/`endeMs` benutzen ihn. Das kostet keine einzige
   * zusätzliche Anfrage: Diese Zeile wird beim Beitreten ohnehin angelegt und
   * danach im Takt fortgeschrieben.
   */
  async schreibeMatchStand(
    account: TypingAccount,
    matchId: string,
    werte: Pick<MatchStand, "status" | "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">,
    optionen?: { fehlerMelden?: boolean },
  ) {
    if (!account.classCode) return null;
    /*
      ★★★ Der Satz des Servers, falls er abgewiesen hat (02.10.2026, „Ein Kind,
      ein Match"). ⚠️ PocketBases eigene Sammelsätze („Failed to create
      record.") zählen NICHT - die kommen auch, wenn nur der eindeutige Index
      greift, weil die Zeile schon steht (dann geht es unten weiter).
    */
    let grund = "";
    const merke = (err: unknown) => {
      const satz = serverMeldung(err);
      if (satz && !/^Failed to /i.test(satz)) grund = satz;
    };
    const rumpf = {
      matchId,
      classCode: account.classCode,
      pupilUid: account.id,
      name: account.name,
      updatedMs: Date.now(),
      ...werte,
    };
    /** Schreiben und dabei die Server-Uhr ablesen (siehe oben). */
    const mitZeitabgleich = async (tun: () => Promise<RecordModel>) => {
      const t0 = Date.now();
      const rec = await tun();
      meldeServerZeit((rec as { updated?: unknown }).updated, t0);
      return rec;
    };
    const id = this.matchStandIds.get(matchId);
    if (id) {
      try {
        return mapMatchStand(
          await mitZeitabgleich(() => this.pb.collection("tt_match_stand").update(id, rumpf)),
        );
      } catch (err) {
        // Zeile weg (aufgeräumt): unten neu anlegen.
        merke(err);
        this.matchStandIds.delete(matchId);
      }
    }
    try {
      const rec = await mitZeitabgleich(() =>
        this.pb.collection("tt_match_stand").create(rumpf),
      );
      this.matchStandIds.set(matchId, rec.id);
      return mapMatchStand(rec);
    } catch (err) {
      merke(err);
      // Schon vorhanden (anderes Gerät, Neuladen): die eigene Zeile suchen und
      // sie von da an fortschreiben.
      try {
        const rec = await this.pb
          .collection("tt_match_stand")
          .getFirstListItem(
            this.pb.filter("matchId={:m} && pupilUid={:p}", { m: matchId, p: account.id }),
          );
        this.matchStandIds.set(matchId, rec.id);
        return mapMatchStand(
          await mitZeitabgleich(() =>
            this.pb.collection("tt_match_stand").update(rec.id, rumpf),
          ),
        );
      } catch (err) {
        merke(err);
        if (optionen?.fehlerMelden) throw new Error(grund);
        return null;
      }
    }
  }

  beobachteMatchStaende(matchId: string, beiAenderung: (stand: MatchStand) => void) {
    return this.beobachte(
      "tt_match_stand",
      this.pb.filter("matchId={:m}", { m: matchId }),
      (rec) => {
        if (rec.matchId === matchId) beiAenderung(mapMatchStand(rec));
      },
    );
  }

  /**
   * ★ E9 (19.09.2026): siehe `TypingBackend.klassenmatchAnzahl` - Route
   * `GET /api/tt/klassenmatch-anzahl?klasse=<code>` (`tt_match_anzahl.pb.js`).
   * Die Antwort trägt schon genau die Form der Zusage (Kennung → Woche →
   * Zahl); diese Methode reicht sie nur durch. JEDER Fehler (kein Netz, keine
   * Berechtigung, unbekannte Klasse, kaputte Antwort) meldet `null` -
   * „unbekannt" (★ M3, 19.09.2026: bis dahin `{}`, das die Anzeige seit dem
   * Zähler „Hat noch an keinem Klassenmatch teilgenommen" als falsche Null
   * gelesen hätte - siehe `TypingBackend.klassenmatchAnzahl`).
   */
  async klassenmatchAnzahl(
    classCode: string,
  ): Promise<Record<string, Record<string, number>> | null> {
    try {
      const res = (await this.pb.send(
        `/api/tt/klassenmatch-anzahl?klasse=${encodeURIComponent(classCode)}`,
        { method: "GET" },
      )) as { kinder?: Record<string, Record<string, number>> };
      return res && typeof res.kinder === "object" && res.kinder ? res.kinder : null;
    } catch {
      return null;
    }
  }

  // ── Schreibprobe (09.09.2026) ─────────────────────────────────────────────

  /**
   * Die Schreibprobe der Klasse starten oder absagen.
   *
   * Plan UND Zeiger gehen in EINEM `update` weg. Zwei Schreibvorgänge hätten
   * einen Zwischenzustand, in dem eine Challenge läuft, der Zeiger ihres
   * Niveaus aber noch auf die vorige zeigt - und bei einem Netzaussetzer bliebe
   * genau der stehen. Die alte Verbrauchsliste bleibt, wie sie am Server steht
   * (`...alt`): Sie gilt für jedes Niveau ohne Zeiger.
   *
   * ★ E7a (24.09.2026): `lernweg` wählt den Schlüssel, unter dem `zeiger`
   * abgelegt wird (`schreibprobeZeiger`/`schreibprobeZeigerEn`, siehe
   * `zeigerSchluessel` in `schreibprobe.ts`) - Weg „de" bleibt dabei am alten,
   * unpräfigierten Schlüssel.
   */
  async setzeSchreibprobe(
    code: string,
    _teacherId: string,
    plan: SchreibprobePlan | null,
    zeiger: ProbenZeiger,
    lernweg: Lernweg = "de",
  ) {
    try {
      const rec = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: code }));
      const alt = (rec.settings ?? {}) as Record<string, unknown>;
      // ★ E2a: BEWUSST nicht um „fr" erweitert - siehe die gleiche Stelle in
      // `account.ts#setClassEinstellungen` (Bauplan §15.6, dritter Zeiger E13).
      const zeigerFeld = lernweg === "en" ? "schreibprobeZeigerEn" : "schreibprobeZeiger";
      const settings = {
        ...alt,
        schreibprobe: plan,
        [zeigerFeld]: zeiger,
      };
      const updated = await this.pb.collection("tt_classes").update(rec.id, { settings });
      return mapClass(updated);
    } catch {
      return null;
    }
  }

  /**
   * Ein Schreibproben-Ergebnis ablegen.
   *
   * ★★ Der Riegel gegen den zweiten Versuch steht am Server:
   * `tt_schreibproben` erlaubt Kindern nur `create`, kein `update`, und ein
   * UNIQUE-Index über (pupilUid, probeId) weist die zweite Zeile ab.
   *
   * ★★★ 27.09.2026 (Befund Netzabbruch §3.3): Die Antwort UNTERSCHEIDET jetzt,
   * statt jeden Fehler zu schlucken. Das braucht die Warteschlange im Gerät
   * (`nachsenden.ts`), die ein Ergebnis so lange nachschickt, bis der Server es
   * hat:
   *  • kein Netz (Status 0), Server überlastet (5xx, 408, 429) ⇒ „netz";
   *  • der Server hat geantwortet und abgelehnt ⇒ NACHSEHEN, ob die Zeile
   *    schon liegt. Das ist der Fall „die erste Abgabe kam an, nur die Antwort
   *    ging verloren" - der UNIQUE-Index weist den zweiten Versuch ab, und das
   *    Ergebnis ist trotzdem da ⇒ „lag-schon". Liegt keine ⇒ „abgewiesen".
   * Ein zweiter Versuch legt darum NIE eine zweite Zeile an.
   *
   * `requestKey: null`: Das SDK bricht sonst eine gleichartige laufende Anfrage
   * still ab (Auto-Cancel) - eine Abgabe darf nicht an einer zweiten scheitern.
   */
  async speichereProbenergebnis(
    pupil: TypingAccount,
    ergebnis: Probenergebnis,
    signal?: AbortSignal,
  ): Promise<ProbenAbgabe> {
    const { classCode, teacherUid } = this.zuordnung();
    try {
      await this.pb.collection("tt_schreibproben").create({
        pupilUid: pupil.id,
        classCode: classCode || pupil.classCode || "",
        teacherUid,
        probeId: ergebnis.probeId,
        niveau: ergebnis.niveau,
        textNr: ergebnis.textNr,
        beginnAtMs: ergebnis.beginnMs,
        endeAtMs: ergebnis.endeMs,
        anschlaege: ergebnis.anschlaege,
        genauigkeit: Math.round(ergebnis.genauigkeit * 10000) / 10000,
        zeichen: ergebnis.zeichen,
        fehler: ergebnis.fehler,
        data: fuersSpeichern(ergebnis),
      }, { requestKey: null, ...(signal ? { signal } : {}) });
      return "gespeichert";
    } catch (e) {
      // ★ S2: wirklich offline ⇒ „netz"; Serverfehler ⇒ „server" (hält die
      // übrige Schlange nicht auf).
      if (keinServerKontakt(e)) return wirklichOffline(e) ? "netz" : "server";
    }
    // Der Server hat geantwortet und nicht angelegt: liegt die Zeile schon?
    try {
      await this.pb.collection("tt_schreibproben").getFirstListItem(
        this.pb.filter("pupilUid={:p} && probeId={:id}", {
          p: pupil.id,
          id: ergebnis.probeId,
        }),
        { requestKey: null, ...(signal ? { signal } : {}) },
      );
      return "lag-schon";
    } catch (e) {
      if (!keinServerKontakt(e)) return "abgewiesen";
      return wirklichOffline(e) ? "netz" : "server";
    }
  }

  async leseProbenergebnisse(pupilId: string): Promise<Probenergebnis[]> {
    try {
      const liste = await this.pb.collection("tt_schreibproben").getFullList({
        filter: this.pb.filter("pupilUid={:p}", { p: pupilId }),
        sort: "-beginnAtMs",
      });
      return liste
        .map((r) => ergebnisAusJson(r.data))
        .filter((e): e is Probenergebnis => e !== null);
    } catch {
      return [];
    }
  }

  async leseKlassenProben(classCode: string): Promise<Record<string, Probenergebnis[]>> {
    const out: Record<string, Probenergebnis[]> = {};
    try {
      const liste = await this.pb.collection("tt_schreibproben").getFullList({
        filter: this.pb.filter("classCode={:c}", { c: classCode }),
        sort: "-beginnAtMs",
      });
      for (const r of liste) {
        const e = ergebnisAusJson(r.data);
        if (!e) continue;
        const id = r.pupilUid as string;
        (out[id] ??= []).push(e);
      }
    } catch {
      // Kein Netz oder abgewiesen: leer melden, nicht abstürzen. Die Sicht
      // sagt daneben, dass gerade nichts gelesen werden konnte.
    }
    return out;
  }

  /**
   * Einen hochgeladenen Text ablegen (`tt_eigene_texte`) - für „Eigene
   * Übung" UND die Tippchallenge mit eigener Datei. Legt IMMER eine NEUE
   * Zeile an (kein `update` - siehe `setup.mjs`, dieselbe Bauart wie die
   * Schreibprobe-Ergebnisse); die Zeilen selbst liegen im `data`-Feld
   * (5-MB-Deckel), nicht in `tt_classes.settings` (2000 Byte).
   */
  async speichereEigenenText(
    classCode: string,
    teacherId: string,
    dateiname: string,
    zeilen: string[],
  ): Promise<string | null> {
    try {
      const rec = await this.pb.collection("tt_eigene_texte").create({
        classCode,
        // ★ 19.09.2026 (Z1-Befund): die ANGEMELDETE Lehrkraft, nicht die
        // Eigentümerin der Klasse - die create-Regel verlangt
        // `@request.auth.id = @request.body.teacherUid`; mit der Id der
        // Eigentümerin scheiterte jeder Start einer Co-Lehrkraft still.
        teacherUid: (this.pb.authStore.record?.id as string | undefined) ?? teacherId,
        dateiname,
        data: { zeilen, zeichenGesamt: zeilen.reduce((n, z) => n + z.length, 0) },
      });
      return rec.id as string;
    } catch {
      return null;
    }
  }

  async leseEigenenText(id: string): Promise<EigenerTextGelesen | null> {
    try {
      const rec = await this.pb.collection("tt_eigene_texte").getOne(id);
      const data = (rec.data ?? {}) as { zeilen?: unknown };
      if (!Array.isArray(data.zeilen)) return null;
      return { dateiname: (rec.dateiname as string) ?? "", zeilen: data.zeilen as string[] };
    } catch {
      return null;
    }
  }

  /**
   * ★★★★★ „Eigene Übung starten" (Z1, 19.09.2026): an die Reihe der Klasse
   * HÄNGEN statt den Zeiger zu ersetzen. Gelesen wird die FRISCHE Zeile vom
   * Server (nicht die der Seite) - so geht auch eine Übung nicht verloren,
   * die eine Co-Lehrkraft eben gestartet hat. Reihe und geleerter alter
   * Zeiger gehen in EINEM `update` weg (derselbe Grund wie bei
   * {@link PocketBaseTypingBackend.setzeSchreibprobe}: kein Zwischenzustand).
   * `von` ist die angemeldete Lehrkraft, nicht zwingend die Eigentümerin.
   */
  async starteEigeneUebung(
    code: string,
    teacherId: string,
    eintrag: { textId: string; dateiname: string },
    vonAllenFertig: readonly string[] = [],
  ): Promise<TypingClass | null> {
    return this.schreibeEigeneUebungen(code, (rec) =>
      reiheMitNeuer(
        eigeneUebungReihe(this.klasseFuerReihe(rec)),
        {
          ...eintrag,
          gestartetAm: Date.now(),
          von: (this.pb.authStore.record?.id as string | undefined) ?? teacherId,
        },
        vonAllenFertig,
      ),
    );
  }

  /** Eine Übung aus der Reihe nehmen (Z1, „Beenden"). */
  async beendeEigeneUebung(
    code: string,
    _teacherId: string,
    textId: string,
  ): Promise<TypingClass | null> {
    return this.schreibeEigeneUebungen(code, (rec) =>
      reiheOhne(eigeneUebungReihe(this.klasseFuerReihe(rec)), textId),
    );
  }

  /** »Im Griff«: die Kapitel-Reihe der Klasse neu schreiben (29.09.2026). */
  async schreibeImGriffKapitel(
    code: string,
    _teacherId: string,
    aendern: (roh: unknown) => unknown[],
  ): Promise<TypingClass | null> {
    try {
      const rec = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: code }));
      const updated = await this.pb.collection("tt_classes").update(rec.id, {
        imgriffKapitel: aendern(rec.imgriffKapitel),
      });
      // ⚠️ Kennt der Server das Feld nicht (»Update LMS (komplett)« noch
      // nicht gelaufen), verwirft er es still - dann ehrlich scheitern,
      // statt „gestartet" zu melden.
      if (updated.imgriffKapitel === undefined) return null;
      return mapClass(updated);
    } catch {
      return null;
    }
  }

  /** Die rohen Felder, die `eigeneUebungReihe` braucht (samt altem Zeiger). */
  private klasseFuerReihe(rec: RecordModel) {
    return {
      eigeneUebungen: rec.eigeneUebungen,
      settings: rec.settings,
      teacherId: rec.teacherUid as string,
    };
  }

  private async schreibeEigeneUebungen(
    code: string,
    neueReihe: (rec: RecordModel) => ReturnType<typeof reiheOhne>,
  ): Promise<TypingClass | null> {
    try {
      const rec = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: code }));
      const alt = (rec.settings ?? {}) as Record<string, unknown>;
      const reihe = neueReihe(rec);
      let updated = await this.pb.collection("tt_classes").update(rec.id, {
        eigeneUebungen: reihe,
        // Faules Umziehen (`eigeneUebungReihe.ts`): ab jetzt gilt die Reihe.
        settings: { ...alt, eigeneUebung: null },
      });
      if (updated.eigeneUebungen === undefined) {
        // ⚠️ Der Server kennt das Feld noch nicht (Frontend deployt, »Update
        // LMS (komplett)« noch nicht gelaufen) - er verwirft es still. Dann
        // nicht ALLES verlieren, sondern wie vor Z1 den einen Zeiger setzen:
        // die jüngste Übung der Reihe.
        const juengste = reihe[reihe.length - 1];
        updated = await this.pb.collection("tt_classes").update(rec.id, {
          settings: {
            ...alt,
            eigeneUebung: juengste
              ? { textId: juengste.textId, dateiname: juengste.dateiname, angelegtMs: juengste.gestartetAm }
              : null,
          },
        });
      }
      return mapClass(updated);
    } catch {
      return null;
    }
  }

  /**
   * Meine Texte (`tt_meine_texte`, E8, 19.09.2026) - die Textablage EINER
   * Lehrkraft. Die Serverregel filtert ohnehin auf `teacherUid = auth.id`;
   * der Filter hier ist trotzdem explizit, damit die Absicht im Quelltext
   * steht, nicht nur in `setup.mjs` ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
   */
  async listeMeineTexte(teacherId: string): Promise<MeinTextEintrag[]> {
    try {
      const liste = await this.pb.collection("tt_meine_texte").getFullList({
        filter: this.pb.filter("teacherUid={:t}", { t: teacherId }),
        sort: "-createdAtMs",
      });
      return liste.map((r) => {
        const data = (r.data ?? {}) as { zeilen?: unknown };
        const zeilen = Array.isArray(data.zeilen) ? (data.zeilen as string[]) : [];
        return {
          id: r.id as string,
          dateiname: (r.dateiname as string) ?? "",
          erstelltMs: (r.createdAtMs as number) ?? 0,
          ersteWorte: ersteWorte(zeilen),
        };
      });
    } catch {
      return [];
    }
  }

  async speichereMeinenText(
    teacherId: string,
    dateiname: string,
    zeilen: string[],
  ): Promise<string | null> {
    try {
      const rec = await this.pb.collection("tt_meine_texte").create({
        teacherUid: teacherId,
        dateiname,
        createdAtMs: Date.now(),
        data: { zeilen, zeichenGesamt: zeilen.reduce((n, z) => n + z.length, 0) },
      });
      return rec.id as string;
    } catch {
      return null;
    }
  }

  async leseMeinenText(id: string): Promise<EigenerTextGelesen | null> {
    try {
      const rec = await this.pb.collection("tt_meine_texte").getOne(id);
      const data = (rec.data ?? {}) as { zeilen?: unknown };
      if (!Array.isArray(data.zeilen)) return null;
      return { dateiname: (rec.dateiname as string) ?? "", zeilen: data.zeilen as string[] };
    } catch {
      return null;
    }
  }

  async loescheMeinenText(id: string, _teacherId: string): Promise<boolean> {
    try {
      await this.pb.collection("tt_meine_texte").delete(id);
      return true;
    } catch {
      return false;
    }
  }

  async setClassPrograms(code: string, _teacherId: string, programs: string[]) {
    try {
      const rec = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: code }));
      const updated = await this.pb
        .collection("tt_classes")
        .update(rec.id, { programs });
      return mapClass(updated);
    } catch {
      return null;
    }
  }

  /**
   * Klasse nachträglich bearbeiten (Name und/oder Klassencode).
   *
   * ★★★ Der CODE-Wechsel läuft seit 10.09.2026 am SERVER
   * (`/api/tt/klassencode-aendern`, `pb_hooks/tt_klasse_lib.pb.js`). Bis dahin
   * stellte diese Methode erst alle Kinder um und dann die Klasse - mit einem
   * Rückbau von Hand, falls etwas scheiterte. Zwei Gründe für den Umzug:
   *  • Die updateRule von `tt_pupils` lässt einen neuen `classCode` nur noch
   *    zu, wenn die Lehrkraft auch in der NEUEN Klasse ist. Die gab es im
   *    Augenblick des Umstellens noch nicht.
   *  • Co-Lehrkräfte, Tippchallenge-Ergebnisse und Lerndaten blieben beim
   *    alten Code stehen - die Ergebnisse verschwanden aus der Liste.
   * Die Route macht alles in EINER Transaktion. Ein reiner Namenswechsel geht
   * weiter direkt; wer darf, entscheidet die Regel auf `tt_classes`.
   */
  async updateClass(
    code: string,
    _teacherId: string,
    changes: { name?: string; code?: string },
  ): Promise<Result<TypingClass>> {
    if (changes.name !== undefined && !changes.name.trim())
      return fail("Bitte einen Klassennamen angeben.");
    const wish =
      changes.code !== undefined ? changes.code.trim().toUpperCase() : undefined;
    if (wish !== undefined) {
      if (!wish) return fail("Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.");
      if (!CLASS_CODE_RE.test(wish))
        return fail(
          "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.",
        );
    }

    let cls: RecordModel;
    try {
      cls = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: code }));
    } catch {
      return fail("Diese Klasse gibt es nicht.");
    }

    const codeChanged = wish !== undefined && wish !== (cls.code as string);
    try {
      if (codeChanged) {
        const res = (await this.pb.send("/api/tt/klassencode-aendern", {
          method: "POST",
          body: {
            classCode: cls.code,
            neuerCode: wish,
            ...(changes.name !== undefined ? { name: changes.name.trim() } : {}),
          },
        })) as { code?: string };
        const neu = await this.getClass(res?.code || wish!);
        return neu
          ? { ok: true as const, value: neu }
          : fail("Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.");
      }
      const rec =
        changes.name !== undefined
          ? await this.pb.collection("tt_classes").update(cls.id, { name: changes.name.trim() })
          : cls;
      return { ok: true as const, value: mapClass(rec) };
    } catch (e) {
      return fail(hookError(e));
    }
  }

  async kindVerschieben(pupilId: string, zielCode: string): Promise<Result<KindVerschoben>> {
    const ziel = zielCode.trim().toUpperCase();
    if (!ziel) return fail("Bitte den Klassencode der neuen Klasse eingeben.");
    try {
      const res = (await this.pb.send("/api/tt/kind-verschieben", {
        method: "POST",
        body: { pupilId, zielCode: ziel },
      })) as Partial<KindVerschoben>;
      return {
        ok: true,
        value: {
          zielCode: String(res?.zielCode || ziel),
          zielName: String(res?.zielName || ""),
          mathecoach:
            res?.mathecoach === "mitgewandert" || res?.mathecoach === "bleibt"
              ? res.mathecoach
              : "keine",
        },
      };
    } catch (e) {
      return fail(hookError(e));
    }
  }

  async deleteClass(code: string, teacherId: string): Promise<Result<true>> {
    try {
      // Erst alle Schüler:innen der Klasse (samt Daten) entfernen.
      const pupils = await this.listPupils(code);
      for (const p of pupils) await this.deletePupil(p.id);
      const rec = await this.pb
        .collection("tt_classes")
        .getFirstListItem(
          this.pb.filter("code={:c} && teacherUid={:t}", {
            c: code,
            t: teacherId,
          }),
        );
      await this.pb.collection("tt_classes").delete(rec.id);
      return { ok: true, value: true };
    } catch {
      return fail("Klasse konnte nicht gelöscht werden.");
    }
  }

  // --- Schüler:innen ---------------------------------------------------------
  async addPupil(
    classCode: string,
    name: string,
    password: string,
    stufe: Stufe,
    tempo: TempoLevel,
    startUnits: number,
    toolProfile?: string,
    skillLevel?: string,
    geburtsjahr?: number,
    contactEmail?: string,
  ) {
    if (!name.trim()) return fail("Bitte einen Namen angeben.");
    if (password.length < 4)
      return fail("Das Passwort braucht mindestens 4 Zeichen.");
    const teacherUid = this.pb.authStore.record?.id;
    if (!teacherUid) return fail("Bitte zuerst als Lehrkraft anmelden.");
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        classCode,
        teacherUid,
        stufe,
        lang: "de",
        tempo,
        startUnits,
        goalMinutes: DEFAULT_GOAL_MINUTES,
        goalUnits: DEFAULT_GOAL_UNITS,
        createdAtMs: Date.now(),
        email: synthEmail(classCode, name),
        password,
        passwordConfirm: password,
        // Klartext-Spiegel für die Teilnehmerliste - siehe `setup.mjs`.
        passwordPlain: password,
      };
      if (toolProfile) body.toolProfile = toolProfile;
      if (skillLevel) body.skillLevel = skillLevel;
      // Mit Geburtsjahr bleibt die Stufe LEER und wächst mit (stufeFuer).
      if (istPlausiblesGeburtsjahr(geburtsjahr)) {
        body.geburtsjahr = geburtsjahr;
        body.stufe = "";
      }
      // Kontakt-Mail (14.09.2026): löst tt_pupils_passwort_mail.pb.js aus,
      // sobald der Datensatz steht (derselbe passwordPlain-Wert oben).
      if (contactEmail?.trim()) body.contactEmail = contactEmail.trim();
      // ★★★ Wochenziel-Vorgabe der Klasse übernehmen (W2, Johannes §7g: „alles
      // was für die Klasse gilt, gilt auch für das neue Kind") - EINE weitere
      // Lesung (`getClass` liest ohnehin schon gemappt, siehe dort), ab der
      // NÄCHSTEN Woche, nie rückwirkend ({@link neuesKindVerlauf}).
      const cls = await this.getClass(classCode);
      // ★ E1 (24.09.2026): ein NEUES Kind erbt den Lernweg der Klasse (Bauplan
      // §2.2) - nur „en" wird geschrieben, leer heisst „de".
      // ★ E11c (26.09.2026): ebenso „fr" - `tt_pupils_selfsignup` nimmt es an.
      // ★ ES-M (27.09.2026): jeder Weg ausser „de" - damit auch „es"
      // (`tt_pupils_selfsignup` nimmt es seit ES-M an).
      const klassenWeg = lernwegVon(cls);
      if (klassenWeg !== "de") body.lernweg = klassenWeg;
      if (cls?.wochenzielVorgabe) {
        body.wochenzielVerlauf = neuesKindVerlauf(cls.wochenzielVorgabe.minuten, Date.now());
        body.goalWeeks = cls.wochenzielVorgabe.wochen;
        body.goalCatchUp = cls.wochenzielVorgabe.nachholen;
      }
      const rec = await this.pb.collection("tt_pupils").create(body);
      return { ok: true as const, value: mapPupil(rec) };
    } catch (e) {
      if (e instanceof ClientResponseError && e.status === 400) {
        // ★ 19.09.2026: EIN 400er hatte bisher IMMER diesen Satz, auch wenn er
        // von der Klassen-Stärke (`tt_grenzen.pb.js`, „höchstens 30 Kinder je
        // Klasse") kam - der Name war dann frei, nur die Klasse schon voll.
        // Am Feld unterscheiden, nicht raten: Der Name ist nur über die
        // synthetische Login-Adresse eindeutig (`synthEmail`), eine echte
        // Doppelung meldet der Server darum als `email.code ===
        // "validation_not_unique"` - jeder andere 400er bekommt die eigene
        // Meldung des Hooks (z. B. die Grenze).
        const feld = (e.response as { data?: Record<string, { code?: string }> } | undefined)
          ?.data?.email;
        if (feld?.code === "validation_not_unique")
          return fail("Diesen Namen gibt es in der Klasse schon.");
        return fail(hookError(e));
      }
      return fail("Das Konto konnte nicht angelegt werden.");
    }
  }

  async setToolProfile(accountId: string, toolProfile: string) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { toolProfile, ...this.selfPupilFields(accountId) });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  async setSkillLevel(accountId: string, skillLevel: string) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { skillLevel, ...this.selfPupilFields(accountId) });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /**
   * ★★★ Spendenbanner (Nachbesserung 19.09.2026, `lib/spendenbanner.ts`):
   * `zielgruppe` wählt die Collection - „lehrkraft" ⇒ `tt_teachers`,
   * „selbstlernend" ⇒ `tt_pupils`. `accountId` ist immer das eigene Konto
   * (siehe `SpendenBanner.tsx`); bei `tt_pupils` braucht das Selbst-Update
   * darum `selfPupilFields` (unveränderte `teacherUid`, wie bei
   * `meldeProbeBereit`).
   */
  async getSpendenbannerZustand(
    accountId: string,
    zielgruppe: SpendenBannerZielgruppe,
  ): Promise<SpendenBannerZustand | null> {
    try {
      const collection = zielgruppe === "lehrkraft" ? "tt_teachers" : "tt_pupils";
      const rec = await this.pb.collection(collection).getOne(accountId, {
        fields: "spendenAufrufAm,spendenAufrufMeilenstein,gespendetAm",
      });
      const meilensteinH = Number(rec.spendenAufrufMeilenstein) || 0;
      // ★ 19.09.2026: Eine bestätigte Spende zählt auch dann, wenn der Banner
      // selbst noch nie gezeigt wurde. ⚠️ Vor »Update LMS (komplett)« fehlt
      // das Feld am Server - PocketBase liefert es dann nicht mit (0), und es
      // gilt der Merker am Gerät.
      const gespendetMs = Number(rec.gespendetAm) > 0 ? Number(rec.gespendetAm) : 0;
      if (meilensteinH <= 0 && !gespendetMs) return null;
      return {
        meilensteinH,
        zuletztGezeigtMs: Number(rec.spendenAufrufAm) || 0,
        ...(gespendetMs ? { gespendetMs } : {}),
      };
    } catch {
      return null;
    }
  }

  async setSpendenbannerZustand(
    accountId: string,
    zielgruppe: SpendenBannerZielgruppe,
    meilensteinH: number,
    zuletztGezeigtMs: number,
  ): Promise<boolean> {
    try {
      const collection = zielgruppe === "lehrkraft" ? "tt_teachers" : "tt_pupils";
      await this.pb.collection(collection).update(accountId, {
        spendenAufrufAm: zuletztGezeigtMs,
        spendenAufrufMeilenstein: meilensteinH,
        ...(collection === "tt_pupils" ? this.selfPupilFields(accountId) : {}),
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ★★★★★ Bestätigte Spende (19.09.2026, `lib/spendeBestaetigt.ts`) - nur das
   * eigene Konto: `tt_teachers` per updateRule `@request.auth.id = id`,
   * `tt_pupils` mit der unveränderten `teacherUid` (`selfPupilFields`); der
   * Feld-Wächter `tt_pupils_field_guard.pb.js` lässt `gespendetAm` bewusst
   * durch (siehe dort).
   */
  async setGespendetAm(
    accountId: string,
    zielgruppe: SpendenBannerZielgruppe,
    gespendetMs: number,
  ): Promise<boolean> {
    try {
      const collection = zielgruppe === "lehrkraft" ? "tt_teachers" : "tt_pupils";
      await this.pb.collection(collection).update(accountId, {
        gespendetAm: gespendetMs,
        ...(collection === "tt_pupils" ? this.selfPupilFields(accountId) : {}),
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ★★ „Was gibt's Neues" (Z3, 19.09.2026, `lib/typing/neuigkeiten.ts`):
   * nur `tt_teachers`, nur das eigene Konto (viewRule/updateRule
   * `@request.auth.id = id`; kein Hook wacht über Lehrkraft-Felder).
   * ⚠️ Solange das Feld am Server noch nicht angelegt ist (vor »Update LMS
   * (komplett)«), liefert PocketBase es nicht mit und verwirft es beim
   * Schreiben still - dann hält der Merker im Gerät das Fenster zu.
   */
  async getNeuigkeitenStand(
    teacherId: string,
  ): Promise<{ gesehen: string; erstelltMs: number } | null> {
    try {
      const rec = await this.pb.collection("tt_teachers").getOne(teacherId, {
        fields: "neuigkeitenGesehen,createdAtMs",
      });
      return {
        gesehen: typeof rec.neuigkeitenGesehen === "string" ? rec.neuigkeitenGesehen : "",
        erstelltMs: Number(rec.createdAtMs) > 0 ? Number(rec.createdAtMs) : 0,
      };
    } catch {
      return null;
    }
  }

  async setNeuigkeitenGesehen(teacherId: string, fassung: string): Promise<boolean> {
    try {
      await this.pb.collection("tt_teachers").update(teacherId, { neuigkeitenGesehen: fassung });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ★★ Der Rundgang beim ersten Betreten (Z4, 19.09.2026, `lib/typing/rundgang.ts`):
   * `rundgaengeGesehen` (JSON-Liste) am EIGENEN Konto - `tt_teachers` für
   * Lehrkräfte, `tt_pupils` für Kinder und Selbstlernende.
   * ⚠️ Beim Kind braucht das Selbst-Update `selfPupilFields` (die unveränderte
   * `teacherUid`) - sonst weist die updateRule von `tt_pupils` den Schreib-
   * vorgang STILL ab (404), gemessen am 19.09.2026. Das Feld steht bewusst
   * NICHT in der LOCKED-Liste von `tt_pupils_field_guard.pb.js`.
   * ⚠️ Vor »Update LMS (komplett)« gibt es das Feld am Server noch nicht:
   * PocketBase liefert es dann nicht mit (⇒ leere Liste) und verwirft es beim
   * Schreiben still - der Merker im Gerät hält den Rundgang trotzdem zu.
   */
  async getRundgaengeGesehen(
    accountId: string,
    rolle: "lehrkraft" | "schueler",
  ): Promise<string[] | null> {
    try {
      const rec = await this.pb
        .collection(rolle === "lehrkraft" ? "tt_teachers" : "tt_pupils")
        .getOne(accountId, { fields: "rundgaengeGesehen" });
      const liste: unknown = rec.rundgaengeGesehen;
      return Array.isArray(liste) ? liste.filter((k): k is string => typeof k === "string") : [];
    } catch {
      return null;
    }
  }

  async setRundgaengeGesehen(
    accountId: string,
    rolle: "lehrkraft" | "schueler",
    liste: string[],
  ): Promise<boolean> {
    try {
      if (rolle === "lehrkraft") {
        await this.pb.collection("tt_teachers").update(accountId, { rundgaengeGesehen: liste });
      } else {
        await this.pb.collection("tt_pupils").update(accountId, {
          rundgaengeGesehen: liste,
          ...this.selfPupilFields(accountId),
        });
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Kontakt-E-Mail setzen/ändern (14.09.2026) - NUR die Lehrkraft, kein
   * Selbst-Update (`contactEmail` steht darum in der LOCKED-Liste von
   * tt_pupils_field_guard.pb.js, anders als toolProfile/skillLevel oben).
   * Löst beim nächsten Zurücksetzen automatisch die Passwort-Mail aus
   * (tt_pupils_passwort_mail.pb.js) - leer lassen schaltet sie wieder ab.
   */
  async setContactEmail(accountId: string, contactEmail: string): Promise<Result<true>> {
    try {
      await this.pb
        .collection("tt_pupils")
        .update(accountId, { contactEmail: contactEmail.trim() });
      return { ok: true, value: true };
    } catch {
      return fail("Die Kontakt-E-Mail konnte nicht gespeichert werden.");
    }
  }

  async loginPupil(classCode: string, name: string, password: string) {
    try {
      // ★ G2-NEUN (25.10.2026): zuerst die heutige Adresse, dann - nur wenn sie anders lautet - die von vor
      // G2-NEUN (kyrillische, griechische, ungarische ő ű … Namen, die vor der neuen Umschrift angelegt wurden).
      const neu = synthEmail(classCode, name);
      const alt = synthEmailVorG2Neun(classCode, name);
      const auth = await this.pb
        .collection("tt_pupils")
        .authWithPassword(neu, password)
        .catch((fehler: unknown) => {
          if (alt === neu) throw fehler;
          return this.pb.collection("tt_pupils").authWithPassword(alt, password);
        });
      await this.ensureRows(auth.record);
      return { ok: true as const, value: mapPupil(auth.record) };
    } catch {
      return fail("Klassencode, Name oder Passwort stimmt nicht.");
    }
  }

  /**
   * SELBSTLERNENDE: eigenes Konto anlegen (ohne Klasse, ohne Lehrkraft).
   *
   * Die Regel in `setup.mjs` lässt genau diesen einen Fall ohne Anmeldung zu —
   * `selfManaged = true`, `classCode` und `teacherUid` leer. Alles Weitere
   * (echte Adresse, Passwortlänge, keine Lehrkraft-Felder) prüft der Hook
   * `tt_pupils_selfsignup` server-seitig; hier wird nur sauber gefragt und die
   * Antwort verständlich gemacht.
   */
  async registerPupilSelf(
    name: string,
    email: string,
    password: string,
    geburtsjahr?: number,
    startUnits?: number,
    /**
     * ★ E1 (24.09.2026): ein schon feststehender Lernweg (Gast, der vorher
     * geübt hat). Fehlt er, bleibt das Feld leer und wird beim ersten
     * Fortschritt festgelegt.
     */
    lernweg?: Lernweg,
  ) {
    const sauber = name.trim();
    const adresse = email.trim().toLowerCase();
    if (!sauber) return fail("Bitte gib deinen Namen an.");
    if (!adresse.includes("@")) return fail("Bitte gib eine gültige E-Mail-Adresse an.");
    if (password.length < 8) return fail("Das Passwort braucht mindestens 8 Zeichen.");
    // Mit Geburtsjahr bleibt `stufe` LEER — dann wächst sie mit (stufeFuer).
    // Ohne Jahr steht die Vorgabe drin, wie bei jedem anderen neuen Konto.
    const mitJahr = istPlausiblesGeburtsjahr(geburtsjahr);
    try {
      await this.pb.collection("tt_pupils").create({
        email: adresse,
        emailVisibility: false,
        password,
        passwordConfirm: password,
        name: sauber,
        selfManaged: true,
        classCode: "",
        teacherUid: "",
        stufe: mitJahr ? "" : VORGABE_STUFE,
        geburtsjahr: mitJahr ? geburtsjahr : 0,
        // ★ 19.09.2026 (Johannes: *„wer englische Oberfläche einstellt, hat
        //   automatisch sofort englische Texte"*): Das neue Konto übt in der
        //   Sprache, in der es gerade angelegt wird - danach im Zahnrad
        //   änderbar. Ein bestehendes Konto berührt das nie.
        lang: aktuelleBedienSprache(),
        // Vorkenntnisse (01.09.2026): Was hier steht, prüft und übernimmt der
        // Server - `tt_pupils_selfsignup.pb.js` lässt es NUR für ein Konto
        // ohne Lehrkraft durch und klemmt es auf einen gültigen Startpunkt.
        startUnits: Math.max(0, Math.round(startUnits ?? 0)),
        // ★ E1: der Server nimmt nur "de"/"en" an (tt_pupils_selfsignup).
        ...(istLernweg(lernweg) ? { lernweg } : {}),
        createdAtMs: Date.now(),
        // ★ EN9: wie bei der Lehrkraft - die Bestätigungs-Mail gleich englisch.
        ...spracheBeimAnlegen(),
      });
    } catch (e) {
      const msg = String((e as { message?: string })?.message ?? "");
      // Die häufigste Absage überhaupt: Die Adresse ist schon vergeben.
      if (/validation|email/i.test(msg)) {
        return fail(
          "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.",
        );
      }
      return fail("Das Konto konnte nicht angelegt werden.");
    }
    // Bestätigungs-Mail anstoßen (der Link beweist die Adresse). Schlägt das
    // fehl, ist das Konto trotzdem gültig — nachfordern geht jederzeit auf der
    // Konto-Seite.
    await this.sendeKontoBestaetigung(adresse);
    // Direkt anmelden — sonst stünde man nach dem Anlegen wieder vor dem
    // Anmeldeformular.
    return this.loginPupilSelf(adresse, password);
  }

  /** SELBSTLERNENDE: Anmeldung mit der echten E-Mail-Adresse. */
  async loginPupilSelf(email: string, password: string) {
    try {
      const auth = await this.pb
        .collection("tt_pupils")
        .authWithPassword(email.trim().toLowerCase(), password);
      await this.ensureRows(auth.record);
      this.bedienSpracheAbgleichen(auth.record);
      return { ok: true as const, value: mapPupil(auth.record) };
    } catch {
      return fail("E-Mail-Adresse oder Passwort stimmt nicht.");
    }
  }

  /* ── Adresse beweisen und ändern (09.08.2026) ──────────────────────────────
   *
   * Ein selbstlernendes Konto hängt an SEINER E-Mail-Adresse: Dorthin geht der
   * Wochenbericht, und dorthin geht die Warnung, bevor ein ruhendes Konto
   * gelöscht wird. Ein Tippfehler beim Anlegen wäre damit ein stiller
   * Totalverlust. Darum zwei Wege — beide über PocketBases eigene Token-Flüsse,
   * also mit einem Link in der Mail als Beweis (dasselbe Muster wie
   * „Passwort vergessen" bei den Lehrkräften):
   *
   *   1. BESTÄTIGEN: Beim Anlegen geht eine Mail mit Link raus. Erst der Klick
   *      beweist, dass die Adresse wirklich jemandem gehört.
   *   2. ÄNDERN: Der Link geht an die NEUE Adresse — wer sie nicht öffnen kann,
   *      ändert nichts. (Bestätigt wird mit dem eigenen Passwort, damit ein
   *      offen stehender Rechner nicht genügt.)
   *
   * Üben hängt an KEINEM davon: Ein unbestätigtes Konto lernt normal weiter.
   * Gesperrt ist nur das, was ohne bewiesene Adresse schadet — der
   * Wochenbericht.
   */

  /** Bestätigungs-Mail an ein Schüler-Konto (Selbstlernende) schicken. */
  async sendeKontoBestaetigung(email: string) {
    try {
      await this.pb.collection("tt_pupils").requestVerification(email.trim().toLowerCase());
    } catch {
      // Bewusst verschluckt: Die Antwort ist immer dieselbe, egal ob es das
      // Konto gibt — sonst wäre das Formular ein Adress-Prüfgerät.
    }
    return { ok: true as const, value: true as const };
  }

  /** Den Link aus der Bestätigungs-Mail einlösen. */
  async bestaetigeKonto(token: string): Promise<Result<true>> {
    try {
      await this.pb.collection("tt_pupils").confirmVerification(token);
      return { ok: true, value: true };
    } catch {
      return fail(
        "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.",
      );
    }
  }

  /** Adresswechsel anstoßen — der Link geht an die NEUE Adresse. */
  async adresseAendern(neueAdresse: string): Promise<Result<true>> {
    const adresse = neueAdresse.trim().toLowerCase();
    if (!adresse.includes("@")) return fail("Bitte gib eine gültige E-Mail-Adresse an.");
    try {
      await this.pb.collection("tt_pupils").requestEmailChange(adresse);
      return { ok: true, value: true };
    } catch {
      return fail("Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?");
    }
  }

  /** Den Link aus der Wechsel-Mail einlösen (braucht das eigene Passwort). */
  async bestaetigeAdresse(token: string, passwort: string): Promise<Result<true>> {
    try {
      await this.pb.collection("tt_pupils").confirmEmailChange(token, passwort);
      return { ok: true, value: true };
    } catch {
      return fail("Link abgelaufen oder Passwort falsch.");
    }
  }

  /**
   * Adresswechsel einer LEHRKRAFT bestaetigen (04.09.2026). Derselbe
   * Token-Fluss, andere Sammlung - siehe Schnittstelle.
   */
  async bestaetigeLehrkraftAdresse(token: string, passwort: string): Promise<Result<true>> {
    try {
      await this.pb.collection("tt_teachers").confirmEmailChange(token, passwort);
      return { ok: true, value: true };
    } catch {
      return fail("Link abgelaufen oder Passwort falsch.");
    }
  }

  /** Eigenes Passwort ändern (Selbstlernende). */
  async passwortAendern(
    accountId: string,
    altesPasswort: string,
    neuesPasswort: string,
  ): Promise<Result<true>> {
    if (neuesPasswort.length < 8) return fail("Das neue Passwort braucht mindestens 8 Zeichen.");
    try {
      await this.pb.collection("tt_pupils").update(accountId, {
        oldPassword: altesPasswort,
        password: neuesPasswort,
        passwordConfirm: neuesPasswort,
        ...this.selfPupilFields(accountId),
      });
      return { ok: true, value: true };
    } catch {
      return fail("Das alte Passwort stimmt nicht.");
    }
  }

  /**
   * Eigenes Konto samt Lerndaten löschen (nur Selbstlernende — Kinder einer
   * Klasse gehören ihrer Lehrkraft). Die Server-Regel erlaubt genau das.
   */
  async kontoLoeschen(accountId: string): Promise<Result<true>> {
    try {
      // Die Lerndaten aller Programme löscht der Server mit dem Konto
      // (`tt_pupils_loeschen.pb.js`, 14.11.2026).
      this.vergissProgressZeile(accountId);
      await this.pb.collection("tt_pupils").delete(accountId);
      this.pb.authStore.clear();
      // ★ 27.09.2026: auch die Warteschlange dieses Kontos im Gerät.
      vergissKonto(accountId);
      return { ok: true, value: true };
    } catch {
      return fail("Das Konto konnte nicht gelöscht werden.");
    }
  }

  /** „Passwort vergessen" für ein selbstlernendes Schüler-Konto. */
  async requestPupilPasswordReset(email: string) {
    try {
      await this.pb.collection("tt_pupils").requestPasswordReset(email.trim().toLowerCase());
    } catch {
      // Immer dieselbe Antwort — das Formular soll kein Adress-Prüfgerät sein.
    }
    return { ok: true as const, value: true as const };
  }

  /** Den Link aus der Reset-Mail einlösen (Schüler-Konto). */
  async confirmPupilPasswordReset(token: string, neuesPasswort: string): Promise<Result<true>> {
    if (neuesPasswort.length < 8) return fail("Das Passwort braucht mindestens 8 Zeichen.");
    try {
      await this.pb
        .collection("tt_pupils")
        .confirmPasswordReset(token, neuesPasswort, neuesPasswort);
      return { ok: true, value: true };
    } catch {
      return fail("Der Link ist abgelaufen oder wurde schon benutzt.");
    }
  }

  /** Bestätigungs-Mail an ein LEHRKRAFT-Konto schicken. */
  async sendeLehrkraftBestaetigung(email: string) {
    try {
      await this.pb.collection("tt_teachers").requestVerification(email.trim().toLowerCase());
    } catch {
      /* siehe oben — immer dieselbe Antwort */
    }
    return { ok: true as const, value: true as const };
  }

  /** Den Link aus der Lehrkraft-Bestätigungsmail einlösen. */
  async bestaetigeLehrkraft(token: string): Promise<Result<true>> {
    try {
      await this.pb.collection("tt_teachers").confirmVerification(token);
      return { ok: true, value: true };
    } catch {
      return fail("Dieser Link ist abgelaufen oder wurde schon benutzt.");
    }
  }

  async listPupils(classCode: string) {
    const list = await this.pb
      .collection("tt_pupils")
      .getFullList({
        filter: this.pb.filter("classCode={:c}", { c: classCode }),
        sort: "name",
      });
    return list.map(mapPupil);
  }

  /**
   * ★★★ Nur für „Teilnehmerliste herunterladen" - dieselbe Abfrage wie
   * {@link listPupils}, aber mit `passwordPlain` statt durch {@link mapPupil}
   * zu gehen, das es absichtlich wegwirft (siehe die Begründung in
   * `backend.ts`). Kein eigener Zugriffsweg: dieselbe `viewRule` von
   * `tt_pupils` entscheidet, wer die Zeile überhaupt sieht.
   *
   * ⚠️ NICHT `password` (das eingebaute Auth-Feld): PocketBase gibt ein
   * `type: "password"`-Feld nie über die API zurück, an niemanden - das war
   * der Grund, warum diese Liste bisher immer leer blieb. `passwordPlain`
   * ist der eigens dafür angelegte Klartext-Spiegel (siehe `setup.mjs`).
   */
  async listPupilPasswords(classCode: string) {
    const list = await this.pb
      .collection("tt_pupils")
      .getFullList({
        filter: this.pb.filter("classCode={:c}", { c: classCode }),
        sort: "name",
        fields: "name,passwordPlain",
      });
    return list.map((r) => ({ name: String(r.name ?? ""), password: String(r.passwordPlain ?? "") }));
  }

  async deletePupil(accountId: string): Promise<Result<true>> {
    try {
      // ★★★ 14.11.2026: ALLES des Kindes - Lernstand und Übungsdaten aller
      // Programme, Nachrichten, Challenge-Ergebnisse, Klassenmatch-Teilnahmen -
      // löscht der Server in derselben Transaktion wie das Konto
      // (`pocketbase/pb_hooks/tt_pupils_loeschen.pb.js`). Bis dahin stand hier
      // eine eigene, unvollständige Liste (nur Tastenflow und Tippchallenge).
      // Scheitert ein Teil, bleibt auch das Konto - und hier kommt die Meldung.
      this.vergissProgressZeile(accountId);
      await this.pb.collection("tt_pupils").delete(accountId);
      return { ok: true, value: true };
    } catch {
      return fail("Das Konto konnte nicht gelöscht werden.");
    }
  }

  // ── Die Sprache der Mails (EN9, 19.09.2026) ────────────────────────────
  /**
   * ★ Die Bedienungssprache am angemeldeten Konto merken (`bedienSprache`),
   * danach richten sich die Mails an dieses Konto
   * (`pocketbase/pb_hooks/tt_mail_texte_lib.pb.js`). Der Weg: jemand drückt
   * angemeldet den Sprachschalter (`TastenflowSprachBereich`). Gilt für JEDES Konto, auch für ein Kind einer Klasse -
   * es ist seine eigene, ausdrückliche Wahl (die Zugangsdaten-Mail an seine
   * Kontakt-Adresse folgt ihr, `tt_pupils_passwort_mail_lib.pb.js`).
   *
   * EIN Aufruf, nur wenn sich etwas ändert; scheitert still - die Bedienung
   * ist dann trotzdem umgeschaltet, nur die Mails bleiben in der alten Sprache.
   */
  async merkeBedienSprache(sprache: BedienSprache): Promise<void> {
    const rec = this.pb.authStore.record as RecordModel | null;
    if (!rec || !this.pb.authStore.isValid) return;
    await this.schreibeBedienSprache(rec, sprache);
  }

  /**
   * Nach einer Anmeldung: gilt am Gerät eine andere Bedienungssprache als am
   * Konto, gewinnt das Gerät - denn in DIESER Sprache liest die Person gerade
   * alles. Wichtigster Fall: Jemand stellt vor der Anmeldung auf Englisch um
   * (der Schalter steht schon in der Kopfzeile) und meldet sich dann an - ohne
   * diesen Abgleich kämen seine Mails weiter deutsch.
   *
   * ⚠️ Nur für Lehrkräfte und selbstlernende Konten, NICHT für Kinder einer
   * Klasse: Die melden sich oft an geteilten Schulgeräten an, und die
   * Sprache, die das Kind davor dort eingestellt hat, sagt nichts über die
   * Sprache der Eltern, an die ihre Zugangsdaten-Mail geht.
   * ★ Seit 19.09.2026 hat jedes Gerät eine Bedienungssprache (gemerkte Wahl,
   * bekanntes Gerät oder Erkennung, `lib/bedienSprache/sprache.ts`) - der
   * Abgleich läuft darum bei jeder Anmeldung. Ändert sich nichts, schreibt er
   * nichts (`schreibeBedienSprache`).
   */
  private bedienSpracheAbgleichen(rec: RecordModel): void {
    const art = rec.collectionName;
    if (art !== "tt_teachers" && !(art === "tt_pupils" && rec.selfManaged)) return;
    // ★ E11c: `kontoBedienSprache` - sonst überschrieb der Abgleich ein
    // französisches Konto bei jeder Anmeldung mit „de".
    void this.schreibeBedienSprache(rec, kontoBedienSprache());
    // ★ D2 (28.09.2026): dieselben Konten, derselbe Zeitpunkt - die Zeitzone.
    void this.schreibeZeitzone(rec, geraeteZeitzone());
    // ★ 16.11.2026: und die Adresse, auf der die Lehrkraft gerade arbeitet.
    void this.schreibeHeimat(rec);
  }

  /**
   * ★ 16.11.2026 (Johannes: „wenn man ein lehrerkonto erstellt und plötzlich auf
   * weingartner steht kennen sich die leute nicht mehr aus"): die Adresse, auf
   * der eine Lehrkraft zuletzt angemeldet war - "tippen" (tastenflow.org),
   * "lexami" (lexami.org) oder leer (weingartner.org). Danach richten die Mails
   * am Server ihre Links (`pb_hooks/tt_heimat_lib.pb.js`). Nur Lehrkräfte; EIN
   * Aufruf nur bei einer Änderung, scheitert still.
   */
  private async schreibeHeimat(rec: RecordModel): Promise<void> {
    if (rec.collectionName !== "tt_teachers") return;
    if (!istEigenerHost(typeof window === "undefined" ? null : window.location.hostname)) return;
    const heimat = hausApp() ?? "";
    if (String(rec.heimat ?? "") === heimat) return;
    try {
      await this.pb.collection("tt_teachers").update(rec.id, { heimat });
    } catch {
      /* still - eine Mail mit dem Link auf weingartner.org ist kein Grund für eine Meldung */
    }
  }

  /**
   * ★ D2 (28.09.2026): die Zeitzone des Geräts (`Europe/Vienna`,
   * `America/Mexico_City` …) am Konto merken - danach nennen die Mails
   * (Wochenbericht, Tippchallenge) Uhrzeiten in DIESER Zone statt in Wiener
   * Zeit (`pocketbase/pb_hooks/tt_zeitzone_lib.pb.js`). Derselbe Weg wie die
   * Bedienungssprache: nur Lehrkräfte und selbstlernende Konten (ein Kind
   * einer Klasse bekommt keine Mail mit Uhrzeit), EIN Aufruf nur bei einer
   * Änderung, scheitert still.
   *
   * ⚠️ Ohne das Feld `zeitzone` am Server (Schema noch nicht eingespielt)
   * übergeht PocketBase den Wert ohne Fehler - dann schreibt der Abgleich bei
   * jeder Anmeldung einmal vergeblich. Harmlos.
   */
  private async schreibeZeitzone(rec: RecordModel, zone: string): Promise<void> {
    if (!ZEITZONE_AM_SERVER) return;
    const art = rec.collectionName;
    if (art !== "tt_teachers" && art !== "tt_pupils") return;
    if (!istZeitzonenName(zone)) return;
    if (String(rec.zeitzone ?? "") === zone) return;
    try {
      await this.pb.collection(art).update(rec.id, {
        zeitzone: zone,
        // Die updateRule des Kindes verlangt die unveränderte `teacherUid`.
        ...(art === "tt_pupils" ? this.selfPupilFields(rec.id) : {}),
      });
    } catch {
      /* still - eine Mail in Wiener Zeit ist kein Grund für eine Meldung */
    }
  }

  private async schreibeBedienSprache(rec: RecordModel, sprache: BedienSprache): Promise<void> {
    const art = rec.collectionName;
    if (art !== "tt_teachers" && art !== "tt_pupils") return;
    // ★ E11a-5 (26.09.2026): „fr" erkennen - sonst hielte der Abgleich ein
    // französisches Konto für deutsch und schriebe bei JEDER Anmeldung neu.
    // (Seit E11c kennen auch die Mails am Server „fr" - `tt_mail_texte_lib.pb.js`.)
    // ★ ES-M (27.09.2026): ebenso „es" - sonst schriebe der Abgleich ein
    // spanisches Konto bei JEDER Anmeldung neu.
    // ★ G2b-2: jede Sprache des Registers (kein Aufzählen mehr); leer/fehlend = „de"
    // (Bestand), ein Wert, den es nicht gibt, ist von keiner Sprache gleich - dann
    // wird neu geschrieben.
    const bisher: BedienSprache | null = !rec.bedienSprache
      ? "de"
      : istSprache(rec.bedienSprache)
        ? rec.bedienSprache
        : null;
    if (bisher === sprache) return;
    try {
      await this.pb.collection(art).update(rec.id, {
        bedienSprache: sprache,
        // Die updateRule des Kindes verlangt die unveränderte `teacherUid`.
        ...(art === "tt_pupils" ? this.selfPupilFields(rec.id) : {}),
      });
    } catch {
      /* still - siehe oben */
    }
  }

  /**
   * Zusatzfelder, die ein Kind beim SELBST-Setzen (Sprache/Stufe …) mitschicken
   * muss. Die PocketBase-Regel für `tt_pupils` verlangt
   * `@request.body.teacherUid = teacherUid` — ein im Body FEHLENDES Feld zählt
   * dort als leer, dann schlägt die Regel fehl und der Schreibvorgang wird
   * stillschweigend abgewiesen (genau das ließ die Schalter „Sprache" und
   * „Altersbereich" beim angemeldeten Kind wirkungslos erscheinen). Wir senden
   * die UNVERÄNDERTE teacherUid mit → die Regel greift, ohne dass das Kind sie
   * ändern könnte. Beim Lehrkraft-Pfad gilt die andere Regel-Hälfte, dann lassen
   * wir das Feld weg. Siehe pocketbase/setup.mjs (tt_pupils.updateRule).
   */
  private selfPupilFields(accountId: string): Record<string, unknown> {
    const rec = this.pb.authStore.record as RecordModel | null;
    if (rec && rec.collectionName === "tt_pupils" && rec.id === accountId)
      return { teacherUid: rec.teacherUid };
    return {};
  }

  async setStufe(accountId: string, stufe: Stufe) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { stufe, ...this.selfPupilFields(accountId) });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /**
   * Geburtsjahr setzen oder (mit `undefined`) löschen. Ein gültiges Jahr leert
   * zugleich `stufe` — sonst bliebe die ausdrückliche Wahl vorrangig und das
   * Jahr wirkungslos (Vorrangmodell in `account.stufeFuer`).
   *
   * Ein Kind MIT Lehrkraft kann das nicht selbst: Der Server-Guard
   * `tt_pupils_field_guard` setzt `geburtsjahr` bei Selbst-Updates auf den
   * gespeicherten Wert zurück (wie „Zeit lassen"). Selbstlernende Konten dürfen.
   */
  async setGeburtsjahr(accountId: string, geburtsjahr: number | undefined) {
    const gueltig = istPlausiblesGeburtsjahr(geburtsjahr);
    try {
      const rec = await this.pb.collection("tt_pupils").update(accountId, {
        geburtsjahr: gueltig ? geburtsjahr : 0,
        ...(gueltig ? { stufe: "" } : {}),
        ...this.selfPupilFields(accountId),
      });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /**
   * Vorkenntnisse setzen (Lehrkraft; ein Konto ohne Lehrkraft sich selbst).
   * Schreibt AUSSCHLIESSLICH Felder am Kind-Datensatz - der Fortschritt bleibt
   * unberuehrt.
   *
   * ★★ Das ist keine Bequemlichkeit, sondern die Sicherheitsgrenze: Die Regel
   * `lw_progress.update` laesst nur das Kind selbst schreiben, und daran wird
   * nicht geruettelt. Die Lehrkraft traegt den Wunsch ein, das Kind wendet ihn
   * beim naechsten Laden an (`letters.startpunktAnwenden`, aufgerufen in
   * TippenTrainerPage).
   *
   * ★★★ 04.09.2026: `startUnitsAt` gehoert dazu. Erst der Zeitstempel macht aus
   * dem Wert einen BESCHLUSS - und nur ein Beschluss darf ZURUECKSTUFEN (genau
   * einmal). Ohne ihn bliebe es beim alten Verhalten „nur dazunehmen", und ein
   * zu hoch eingestellter Startpunkt waere wieder unumkehrbar.
   */
  async setPlusBeschluss(accountId: string, beschluss: unknown) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { plusBeschluss: beschluss, ...this.selfPupilFields(accountId) });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  async setStartUnits(accountId: string, startUnits: number) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, {
          startUnits: Math.max(0, Math.round(startUnits)),
          startUnitsAt: Date.now(),
          ...this.selfPupilFields(accountId),
        });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /**
   * ★ E1 (24.09.2026): den Lernweg festlegen - EINMAL. Der Server
   * (`tt_pupils_field_guard.pb.js`) lässt das Feld nur schreiben, solange es
   * leer ist; ein zweiter Versuch ändert still nichts. Das Kind schreibt es
   * selbst beim ersten Fortschritt (darum `selfPupilFields`).
   */
  async setLernweg(accountId: string, lernweg: Lernweg) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { lernweg, ...this.selfPupilFields(accountId) });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /**
   * ★ W2b (28.09.2026, Weg je Kind): die Lehrkraft stellt den Lernweg eines
   * Kindes ihrer Klasse um. OHNE `selfPupilFields` - das ist kein Selbst-
   * Update. Der Server (`tt_pupils_field_guard.pb.js`) lässt einen schon
   * gesetzten Weg NUR für eine Lehrkraft DIESER Klasse (Eigentümerin oder
   * Co-Lehrkraft) umschreiben; sonst bleibt er still, wie er war. Darum wird
   * die Antwort geprüft: Steht danach nicht der gewünschte Weg da, ist es
   * `null` (die Oberfläche meldet es), nie ein stilles „hat geklappt".
   */
  async setLernwegDurchLehrkraft(accountId: string, lernweg: Lernweg) {
    try {
      const rec = await this.pb.collection("tt_pupils").update(accountId, { lernweg });
      const konto = mapPupil(rec);
      return konto.lernweg === lernweg || (lernweg === "de" && lernwegVon(konto) === "de")
        ? konto
        : null;
    } catch {
      return null;
    }
  }

  async setLang(accountId: string, lang: Lang) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { lang, ...this.selfPupilFields(accountId) });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }


  /**
   * „Einhand schreiben" - die Lehrkraft für ihre Kinder, ein Konto ohne
   * Lehrkraft für sich selbst (19.09.2026, Johannes: *„Selbstlernende sollen
   * sich alles einstellen können"*). `selfPupilFields` für den Selbst-Weg
   * (die updateRule verlangt die unveränderte `teacherUid`); ob das Kind es
   * darf, entscheidet `tt_pupils_field_guard.pb.js`.
   */
  /**
   * ★ 25.09.2026: eigene Schulstufe eines Kindes (0 = wie die Klasse). Nur die
   * Lehrkraft - ein Kind schriebe es ohnehin vergeblich (LOCKED im Feld-Wächter).
   */
  async setSchulstufe(accountId: string, schulstufe: number, schulstufeSchuljahr: number) {
    try {
      const rec = await this.pb.collection("tt_pupils").update(accountId, {
        schulstufe,
        schulstufeSchuljahr: schulstufe ? schulstufeSchuljahr : 0,
      });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  async setOneHand(accountId: string, oneHand: boolean) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { oneHand, ...this.selfPupilFields(accountId) });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /**
   * ★ „Gezielt üben" (13.11.2026) - dieselbe Regel und derselbe Weg wie {@link setOneHand}: die Lehrkraft schreibt es
   * für ihr Kind (Klassen-Regel von `tt_pupils`, kein Feld-Wächter-Zweig), ein Konto ohne Lehrkraft für sich
   * (`selfPupilFields`; der Wächter lässt es nur bei `selfManaged` durch). `null` = nicht gesetzt.
   */
  async setGezielt(accountId: string, gezielt: Gezielt | null) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, {
          gezielt: gezielt ? gezieltAus(gezielt) : null,
          ...this.selfPupilFields(accountId),
        });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /** „Zeit lassen" - dieselbe Regel und derselbe Weg wie {@link setOneHand}. */
  async setNoTimePressure(accountId: string, noTimePressure: boolean) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { noTimePressure, ...this.selfPupilFields(accountId) });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /**
   * ★★★ „Zeichenabstand groß (CVI)" - seit 19.09.2026 für JEDES Kind selbst
   * (Johannes: *„die CVI-Einstellungen kann sich jedes Kind immer auch selbst
   * in den Einstellungen einstellen, aber auch die Lehrkraft"*), und für die
   * Lehrkraft je Kind in „Meine Klassen" - wer zuletzt stellt, gilt.
   *
   * ⚠️ `selfPupilFields` ist hier PFLICHT: Ein Kind einer Klasse hat eine
   * `teacherUid`, und die updateRule verlangt sie unverändert im Body - ohne
   * sie weist der Server das Schreiben still ab (404), und die Wahl im
   * Zahnrad wäre beim nächsten Laden wieder weg. Der Wächter
   * `tt_pupils_field_guard.pb.js` prüft danach nur den Wert (1-4).
   */
  async setZeichenabstand(accountId: string, zeichenabstand: number) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { zeichenabstand, ...this.selfPupilFields(accountId) });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /**
   * Wochenbericht abbestellen/wieder einschalten (23.08.2026).
   *
   * Das Kind schreibt hier seinen EIGENEN Datensatz — erlaubt durch die
   * update-Regel von `tt_pupils`; `mailWeeklyOptOut` steht bewusst nicht in der
   * LOCKED-Liste des Server-Wächters (tt_pupils_field_guard), weil es keine
   * Lehrkraft-Einstellung ist.
   */
  async setMailWeeklyOptOut(accountId: string, optOut: boolean) {
    try {
      const rec = await this.pb
        .collection("tt_pupils")
        .update(accountId, { mailWeeklyOptOut: optOut });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  async resetGoalOverdue(accountId: string) {
    try {
      const rec = await this.pb.collection("tt_pupils").update(accountId, {
        goalResetWeek: isoWeekKey(Date.now()),
        ...this.selfPupilFields(accountId),
      });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  async setGoalExcusedWeeks(accountId: string, weeks: string[]) {
    try {
      const rec = await this.pb.collection("tt_pupils").update(accountId, {
        goalExcusedWeeks: weeks,
        ...this.selfPupilFields(accountId),
      });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  // ── Wochenziel NEU (W2, 18.09.2026, `wochenziel.ts`) ─────────────────────
  /**
   * ★★★ Anders als das frühere `setGoal`: KEIN Ereignis-Marker mehr (der
   * Zielverlauf ist ein Feld am Kind, siehe Kopf-Kommentar in `wochenziel.ts`
   * - der Wettlauf-Fehler, den die Marker-Fassung hatte, betraf genau diesen
   * Weg: die Lehrkraft hätte sonst in `lw_events` geschrieben, während das
   * Kind mitten im Unterricht selbst Zeilen anhängt). Die BASIS ist der vorhandene
   * Verlauf (`kindWochenzielAusFeldern` - liest den echten Verlauf, sonst die
   * lazy KW-38-Umrechnung, ohne sie zu schreiben).
   *
   * ★ 19.09.2026: Auch ein Konto OHNE Lehrkraft ruft das für sich selbst auf
   * (Zahnrad, „Mein Wochenziel") - `selfPupilFields` ist darum schon da; ob
   * es darf, entscheidet `tt_pupils_field_guard.pb.js` (nur `selfManaged`).
   */
  async setWochenziel(
    accountId: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ) {
    try {
      const cur = await this.pb.collection("tt_pupils").getOne(accountId);
      const basis = kindWochenzielAusFeldern(cur as unknown as KindWochenzielFelder).verlauf;
      const verlauf = zielAendern(basis, ziel.minuten, Date.now());
      const rec = await this.pb.collection("tt_pupils").update(accountId, {
        wochenzielVerlauf: verlauf,
        goalWeeks: ziel.wochen,
        goalCatchUp: ziel.nachholen,
        ...this.selfPupilFields(accountId),
      });
      return mapPupil(rec);
    } catch {
      return null;
    }
  }

  /**
   * „Für die Klasse einstellen": merkt die Vorgabe an der Klasse
   * (für später beitretende Kinder, siehe {@link addPupil}) und schreibt sie
   * danach JEDEM Kind der Klasse - sequentiell, nicht parallel, damit ein
   * überlastetes Netz nicht 30 Schreibungen gleichzeitig auslöst.
   */
  async setKlassenWochenziel(
    classCode: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ): Promise<{ ok: number; fehler: string[] }> {
    try {
      const cls = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: classCode }));
      await this.pb.collection("tt_classes").update(cls.id, {
        wochenzielVorgabe: {
          minuten: ziel.minuten,
          wochen: ziel.wochen,
          nachholen: ziel.nachholen,
          am: Date.now(),
        },
      });
    } catch {
      return { ok: 0, fehler: [] };
    }
    let ok = 0;
    const fehler: string[] = [];
    for (const kind of await this.listPupils(classCode)) {
      if (await this.setWochenziel(kind.id, ziel)) ok++;
      else fehler.push(kind.name);
    }
    return { ok, fehler };
  }

  /**
   * „Eine Stunde sperren": Zeitraum an der KLASSE (siehe Kopf-Kommentar in
   * `wochenziel.ts`) - läuft schon eine Sperre, bleibt die Klasse
   * unverändert. Abgelaufene Zeiträume älter als {@link SPERR_AUFBEWAHREN_MS}
   * werden beim Anlegen einer neuen Sperre entsorgt.
   */
  async stundeSperren(classCode: string) {
    try {
      const cls = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: classCode }));
      const jetzt = Date.now();
      const bisher = gesperrteZeitenAus(cls.gesperrteZeiten);
      if (bisher.some((z) => z.abMs <= jetzt && z.bisMs > jetzt)) return mapClass(cls);
      const bereinigt = bisher.filter((z) => z.bisMs >= jetzt - SPERR_AUFBEWAHREN_MS);
      const rec = await this.pb.collection("tt_classes").update(cls.id, {
        gesperrteZeiten: [...bereinigt, { abMs: jetzt, bisMs: jetzt + SPERR_DAUER_MS }],
      });
      return mapClass(rec);
    } catch {
      return null;
    }
  }

  /** Eine LAUFENDE Sperre vorzeitig beenden (`bisMs` = jetzt); sonst ohne Wirkung. */
  async sperreAufheben(classCode: string) {
    try {
      const cls = await this.pb
        .collection("tt_classes")
        .getFirstListItem(this.pb.filter("code={:c}", { c: classCode }));
      const jetzt = Date.now();
      const geaendert = gesperrteZeitenAus(cls.gesperrteZeiten).map((z) =>
        z.abMs <= jetzt && z.bisMs > jetzt ? { ...z, bisMs: jetzt } : z,
      );
      const rec = await this.pb.collection("tt_classes").update(cls.id, {
        gesperrteZeiten: geaendert,
      });
      return mapClass(rec);
    } catch {
      return null;
    }
  }

  // --- Passwörter ------------------------------------------------------------
  /**
   * Seit 10.08.2026 liegt die Umsetzung in `lib/lernwerkstatt/passwort.ts` —
   * sie hängt allein an der geteilten PocketBase-Sitzung und wird darum von
   * ALLEN vier Lernprogrammen benutzt (Punktgenau/Klangpunkte über ihr eigenes
   * Backend). Hier bleibt nur die Weiterleitung.
   */
  async changeOwnPassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<Result<true>> {
    return changeOwnPasswordPb(this.pb, oldPassword, newPassword);
  }

  async resetPupilPassword(
    pupilId: string,
    newPassword: string,
  ): Promise<Result<true>> {
    if (newPassword.length < 4)
      return fail("Das neue Passwort braucht mindestens 4 Zeichen.");
    try {
      // Lehrkraft setzt das Passwort IHRES eigenen Kindes neu — ohne das alte zu
      // kennen (vergessenes Passwort). Erlaubt durch die `manageRule` auf
      // tt_pupils (scoped auf die eigene Lehrkraft).
      await this.pb.collection("tt_pupils").update(pupilId, {
        password: newPassword,
        passwordConfirm: newPassword,
        // Klartext-Spiegel für die Teilnehmerliste - siehe `setup.mjs`.
        passwordPlain: newPassword,
      });
      return { ok: true, value: true };
    } catch (e) {
      if (e instanceof ClientResponseError && e.status === 400)
        return fail("Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).");
      return fail("Passwort konnte nicht zurückgesetzt werden.");
    }
  }

  // --- Fortschritt + Telemetrie ---------------------------------------------
  // Lesen: bevorzugt aus lw_progress (kanonisch), sonst aus der Alt-Tabelle
  // (Kind zwischen 4b und 4c angelegt → lw-Zeile evtl. noch nicht da).
  async getProgress(accountId: string): Promise<TypingProgress> {
    const lw = await this.findLwRow("lw_progress", accountId);
    // ★ 28.09.2026: die gefundene Zeile merken - das erste Speichern danach
    // braucht dann keine Suche mehr.
    if (lw) this.merkeProgressZeile(accountId, lw.id);
    const rec = lw ?? (await this.findOwnedRow("tt_progress", accountId));
    if (rec?.data) return { ...emptyProgress(), ...(rec.data as object) };
    return emptyProgress();
  }

  /**
   * ★★★ WER SCHREIBT HIER GERADE - Kind oder Lehrkraft? (03.09.2026)
   *
   * Beide üben in Tastenflow, beide schreiben in dieselben zwei Tabellen, aber
   * die Zuordnungs-Felder bedeuten je Rolle etwas anderes:
   *
   *  • **Kind:** `teacherUid`/`classCode` stehen in seinem Auth-Datensatz und
   *    sagen, WEM es gehört. Sie werden denormalisiert mitgeschrieben, damit
   *    Co-Lehrkräfte den Fortschritt über die Klasse lesen dürfen.
   *  • **Lehrkraft:** Sie gehört niemandem - ihr Auth-Datensatz hat die beiden
   *    Felder gar nicht, `?? ""` lieferte deshalb bisher zweimal leer. Genau
   *    daran ist jedes Speichern gescheitert: Die Regel auf `lw_progress`
   *    liess ausschliesslich `tt_pupils` schreiben (gemessen: 39 + 15
   *    abgewiesene Versuche, alle von Lehrkräften). Eine Lehrkraft, die
   *    „selbst üben" benutzt, trägt ihre EIGENE Kennung in `teacherUid` ein -
   *    das Paar (pupilUid = ich, teacherUid = ich) ist der Schlüssel, an dem
   *    die neue Regel ihre eigene Zeile erkennt und nur diese freigibt.
   *
   * ⚠️ Die eigene Zeile einer Lehrkraft taucht in KEINER Klassenliste auf:
   * `listPupils` fragt `tt_pupils` nach dem Klassencode, nicht `lw_progress`.
   * Auch die Lösch-Automatik greift nicht - sie läuft ausschliesslich über
   * `tt_pupils.selfManaged = true` (`tt_selflearner_lifecycle.pb.js`).
   */
  private zuordnung(): { classCode: string; teacherUid: string } {
    const rec = this.pb.authStore.record;
    if (!rec) return { classCode: "", teacherUid: "" };
    if (rec.collectionName === "tt_teachers")
      return { classCode: "", teacherUid: rec.id as string };
    return {
      classCode: (rec.classCode as string) ?? "",
      teacherUid: (rec.teacherUid as string) ?? "",
    };
  }

  async saveProgress(accountId: string, progress: TypingProgress) {
    // classCode mitschreiben (denormalisiert) → Co-Lehrkräfte dürfen den
    // Fortschritt über die Klasse lesen. Das Kind kennt den eigenen Klassencode.
    const { classCode, teacherUid } = this.zuordnung();
    const now = Date.now();
    // Umbau Etappe 4d-Schritt2 (2026-06-26): nur noch kanonisch lw_progress.
    // Das Doppel-Schreiben in die Alt-Tabelle entfällt; tt_progress bleibt als
    // (eingefrorene) Sicherungs-Kopie liegen. Memory: project_lernwerkstatt_datenmodell.
    //
    // ★★ 28.09.2026 (Serverlast): mit gemerkter Kennung direkt aktualisieren,
    // ohne die Zeile vorher zu suchen (siehe `lwProgressIds`).
    // ⚠️ NIE STILL VERWERFEN: Scheitert das Aktualisieren, wird der Merker
    //    vergessen. Bei 404 (die Zeile gibt es nicht mehr - gelöscht,
    //    zurückgesetzt, an einem anderen Gerät neu angelegt) geht es auf dem
    //    alten Weg weiter: suchen, dann aktualisieren oder anlegen. Jeder
    //    andere Fehler fliegt weiter wie bisher (der Aufrufer erfährt es), und
    //    das nächste Speichern sucht wieder.
    const merker = this.progressMerker();
    const schluessel = this.progressSchluessel(accountId);
    const bekannt = merker.get(schluessel);
    if (bekannt) {
      try {
        await this.aktualisiereLw("lw_progress", { id: bekannt }, progress, classCode, now);
        return;
      } catch (e) {
        merker.delete(schluessel);
        if (!PocketBaseTypingBackend.istFehlendeZeile(e)) throw e;
      }
    }
    const id = await this.upsertLw("lw_progress", accountId, progress, classCode, teacherUid, now);
    this.merkeProgressZeile(accountId, id);
  }

  async recordEvent(accountId: string, event: TaskEvent) {
    const { classCode, teacherUid } = this.zuordnung();
    const now = Date.now();
    // Kanonische Liste lesen (lw, sonst Alt), anhängen, kappen — dann dieselbe
    // Liste in BEIDE Tabellen schreiben (so bleiben sie identisch).
    // ★ Die lw-Zeile wird EINMAL gelesen und unten unverändert weitergereicht -
    //   sie bestimmt den Inhalt UND das Ziel des Schreibens (siehe upsertLw).
    const lwZeile = await this.findLwRow("lw_events", accountId);
    const canonical = lwZeile ?? (await this.findOwnedRow("tt_events", accountId));
    // Seit 29.08.2026 GEPACKT (eventPack.ts): 6.500 statt 1.000 Ereignisse bei
    // gleicher Last je getippter Zeile. `ereignisAnhaengen` liest beide Formate,
    // haengt an, kappt und packt - ein Konto stellt sich beim ersten Schreiben
    // von selbst um.
    // ⚠️ Der Datensatz traegt `lastTs`; daran haengt die Loesch-Automatik im
    // Hook tt_selflearner_lifecycle.pb.js.
    const gepackt = ereignisAnhaengen(canonical?.data, event);
    // Umbau 4d-Schritt2: nur noch lw_events (tt_events = eingefrorene Sicherung).
    await this.upsertLw(
      "lw_events",
      accountId,
      gepackt,
      classCode,
      teacherUid,
      now,
      lwZeile,
    );
    // ★ 28.09.2026: die geschriebene Liste zurück - die Wochenziel-Anzeige
    // rechnet damit, statt die Zeile gleich noch einmal zu lesen.
    return unpackEvents(gepackt);
  }

  /**
   * ★★ Mehrere geübte Zeilen nachtragen (27.09.2026, Warteschlange im Gerät).
   *
   * EINE Lesung, EIN Schreiben für ALLE wartenden Zeilen - statt zwei Anfragen je
   * Zeile. Idempotent über {@link ereignisseNachtragen}: Kam eine Sendung an
   * und nur die Antwort ging verloren, liegen ihre Zeilen schon in der Liste
   * und werden beim zweiten Versuch übersprungen - die Übezeit zählt nicht
   * doppelt. Liegt schon alles, wird gar nicht geschrieben.
   *
   * Dieselbe Regel wie `recordEvent`: die lw-Zeile wird EINMAL gelesen und an
   * `upsertLw` weitergereicht (siehe dort, Behebung 31.08.2026). Keine neue
   * Server-Regel nötig - es ist dasselbe `update` wie bei einer Zeile.
   *
   * ★★★ `signal` (dritte Prüfung, 27.09.2026): Lesen UND Schreiben lassen sich
   * abbrechen. Die Warteschlange bricht nach ihrer Frist WIRKLICH ab - sonst
   * konnte eine hängende erste Sendung (Lesen + ganze Liste neu schreiben)
   * NACH der zweiten ankommen und deren Zeilen überschreiben.
   */
  async recordEvents(accountId: string, events: readonly TaskEvent[], signal?: AbortSignal) {
    if (events.length === 0) return;
    const { classCode, teacherUid } = this.zuordnung();
    const lwZeile = await this.findLwRow("lw_events", accountId, signal);
    const canonical = lwZeile ?? (await this.findOwnedRow("tt_events", accountId, signal));
    const { gepackt } = ereignisseNachtragen(canonical?.data, events);
    // Alles lag schon: nichts schreiben - die Liste ist die gelesene.
    if (!gepackt) return unpackEvents(canonical?.data);
    await this.upsertLw(
      "lw_events",
      accountId,
      gepackt,
      classCode,
      teacherUid,
      Date.now(),
      lwZeile,
      signal,
    );
    // ★ 28.09.2026: wie `recordEvent` - die geschriebene Liste zurück.
    return unpackEvents(gepackt);
  }

  async getEvents(accountId: string): Promise<TaskEvent[]> {
    const rec =
      (await this.findLwRow("lw_events", accountId)) ??
      (await this.findOwnedRow("tt_events", accountId));
    // Beide Formate - alte Konten tragen `events`, umgestellte `ev`.
    return unpackEvents(rec?.data);
  }

  // --- Helpers ---------------------------------------------------------------
  /**
   * ★★★ „Es gibt die Zeile nicht" und „ich darf sie nicht lesen" sind ZWEI
   * VERSCHIEDENE ANTWORTEN (Behebung 31.08.2026).
   *
   * Bis dahin stand hier `catch { return null }` - und damit sahen ein
   * abgewiesener Zugriff (403), ein Netzaussetzer und eine wirklich fehlende
   * Zeile für die App vollkommen gleich aus. Das hatte zwei Folgen, beide
   * gemessen in `tests/tastenflow-lesefehler-schreibweg.test.ts`:
   *
   *  • ANZEIGE: Wird der Lesezugriff abgewiesen, fällt `getEvents` still auf
   *    die eingefrorene Alt-Tabelle zurück oder liefert eine leere Liste. Die
   *    Lehrkraft sieht dann „Stufe 1 von 50, 0 Abzeichen" und glaubt es. **Eine
   *    falsche Null ist schlimmer als eine Fehlermeldung.**
   *  • DATEN: `recordEvent` bestimmt aus derselben Antwort den INHALT der
   *    Zeile. Kommt „leer" zurück, obwohl die Zeile voll ist, wird die ganze
   *    Übungsgeschichte des Kindes durch ein einziges Ereignis ersetzt.
   *
   * Nur 404 heißt „gibt es nicht" ⇒ `null`. Alles andere fliegt weiter und muss
   * an der Aufrufstelle behandelt werden. Die Anzeige-Wege fangen es und sagen
   * ehrlich, dass gerade nichts gelesen werden konnte.
   */
  private static istFehlendeZeile(e: unknown): boolean {
    return e instanceof ClientResponseError && e.status === 404;
  }

  private async findOwnedRow(
    collection: string,
    pupilUid: string,
    signal?: AbortSignal,
  ): Promise<RecordModel | null> {
    try {
      return await this.pb
        .collection(collection)
        .getFirstListItem(this.pb.filter("pupilUid={:p}", { p: pupilUid }), abbrechbar(signal));
    } catch (e) {
      if (PocketBaseTypingBackend.istFehlendeZeile(e)) return null;
      throw e;
    }
  }

  // lw_*-Zeile dieses Kindes für DIESES Programm (unique je (pupilUid, program)).
  private async findLwRow(
    collection: string,
    pupilUid: string,
    signal?: AbortSignal,
  ): Promise<RecordModel | null> {
    try {
      return await this.pb
        .collection(collection)
        .getFirstListItem(
          this.pb.filter("pupilUid={:p} && program={:prog}", {
            p: pupilUid,
            prog: PROGRAM,
          }),
          abbrechbar(signal),
        );
    } catch (e) {
      if (PocketBaseTypingBackend.istFehlendeZeile(e)) return null;
      throw e;
    }
  }

  // Upsert in die kanonische lw_*-Tabelle (mit program + classCode).
  /**
   * ★★★ `bekannteZeile` ist keine Abkürzung, sondern die eigentliche Behebung
   * (31.08.2026).
   *
   * Bis dahin las `upsertLw` die Zeile SELBST noch einmal - und damit lagen
   * zwei getrennte Lesungen derselben Zeile vor: Die eine bestimmte den
   * INHALT (in `recordEvent`), die andere entschied „anlegen oder
   * aktualisieren". Nur die zweite bewachte das Schreiben. Misslang die erste
   * und gelang die zweite, wurde ein aus dem Nichts gebauter Inhalt über eine
   * gefundene Zeile geschrieben: die ganze Übungsgeschichte des Kindes,
   * ersetzt durch ein einziges Ereignis. Dafür genügte ein Netzaussetzer
   * zwischen den beiden Lesungen.
   *
   * Jetzt reicht der Aufrufer die Zeile herein, aus der er den Inhalt gebaut
   * hat. Eine Lesung, eine Wahrheit. Wer nichts hereinreicht (`undefined`),
   * hat selbst nicht gelesen - dann liest diese Stelle, wie bisher.
   * ⚠️ `null` ist NICHT dasselbe wie `undefined`: `null` heißt „ich habe
   * gelesen, es gibt sie nicht" und führt zum Anlegen.
   */
  private async upsertLw(
    collection: string,
    pupilUid: string,
    data: object,
    classCode: string,
    teacherUid: string,
    now: number,
    bekannteZeile?: RecordModel | null,
    signal?: AbortSignal,
  ) {
    const existing =
      bekannteZeile !== undefined
        ? bekannteZeile
        : await this.findLwRow(collection, pupilUid, signal);
    if (existing) {
      await this.aktualisiereLw(collection, existing, data, classCode, now, signal);
      return existing.id;
    }
    const neu = await this.pb.collection(collection).create(
      {
        pupilUid,
        program: PROGRAM,
        teacherUid,
        classCode,
        data,
        updatedAtMs: now,
      },
      nurKennung(signal),
    );
    return neu?.id as string | undefined;
  }

  /**
   * Das eigentliche Aktualisieren einer lw_*-Zeile (Kennung bekannt) - der
   * EINE Änderungsaufruf, über den beide Wege gehen (gefundene Zeile und
   * gemerkte Kennung, `saveProgress`).
   * ⚠️ `existing.id` steht hier mit Absicht so: Der Wächter
   * `tastenflow-lehrkraft-uebt-selbst.test.ts` sucht genau diese Zeile und
   * prüft, dass der Rumpf keine Zuordnungs-Felder trägt (Server-Regel).
   */
  private async aktualisiereLw(
    collection: string,
    existing: { id: string },
    data: object,
    classCode: string,
    now: number,
    signal?: AbortSignal,
  ): Promise<void> {
    await this.pb
      .collection(collection)
      .update(existing.id, { data, classCode, updatedAtMs: now }, nurKennung(signal));
  }

  /**
   * Beim ersten Login: Fortschritt (mit Startlevel) + Telemetrie-Zeile in
   * BEIDEN Modellen anlegen (Doppel-Schreiben, Umbau 4c). WICHTIG für den
   * Übergang: existiert die Alt-Zeile schon (Kind aus 4b), wird deren Inhalt in
   * die fehlende lw-Zeile ÜBERNOMMEN — niemals mit Leerdaten überschrieben
   * (sonst läse getProgress den Fortschritt als „zurückgesetzt"). Reihenfolge
   * der Vorzugsquelle: vorhandene Alt-Zeile → vorhandene lw-Zeile → Startdaten.
   */
  private async ensureRows(pupil: RecordModel) {
    const teacherUid = (pupil.teacherUid as string) ?? "";
    const classCode = (pupil.classCode as string) ?? "";
    const now = Date.now();

    // Umbau 4d-Schritt2: nur noch die lw-Zeile anlegen. Eine evtl. vorhandene
    // Alt-Zeile (Sicherungs-Kopie) dient nur als Seed-Quelle, falls die lw-Zeile
    // fehlt — sonst Startdaten. NIE leer überschreiben.
    const lwProg = await this.findLwRow("lw_progress", pupil.id);
    // ★ 28.09.2026: gefunden oder gleich angelegt - die Kennung merken.
    if (lwProg) this.merkeProgressZeile(pupil.id, lwProg.id);
    if (!lwProg) {
      const oldProg = await this.findOwnedRow("tt_progress", pupil.id);
      const startUnits = (pupil.startUnits as number) ?? 0;
      // ★ E1 (24.09.2026): `startUnits` ist eine Anzahl im Weg DIESES Kindes.
      const lernweg = lernwegVon({ lernweg: pupil.lernweg });
      const fresh = {
        ...emptyProgress(),
        introduced:
          startUnits > 0 ? startpunktEinheiten(startUnits, lernweg) : emptyProgress().introduced, // ★ D-1
        ...(lernweg === "de" ? {} : { lernweg }),
      };
      const seed = (oldProg?.data as object) ?? fresh;
      const id = await this.upsertLw("lw_progress", pupil.id, seed, classCode, teacherUid, now);
      this.merkeProgressZeile(pupil.id, id);
    }

    const lwEv = await this.findLwRow("lw_events", pupil.id);
    if (!lwEv) {
      const oldEv = await this.findOwnedRow("tt_events", pupil.id);
      const seed = (oldEv?.data as object) ?? { events: [] };
      await this.upsertLw("lw_events", pupil.id, seed, classCode, teacherUid, now);
    }
  }
}
