/**
 * ★★★ EIGENE TEXTE - reine Umwandlung einer hochgeladenen Datei in tippbare
 * Zeilen, für „Eigene Übung" und die Tippchallenge mit eigener Datei
 * (Auftrag Johannes, 17.09.2026).
 *
 * ── Was hier NICHT steht ────────────────────────────────────────────────────
 * Das Herauslösen von Text aus einer Datei (`.txt`/`.docx`) - das übernimmt
 * `extractDocxText`/`FileReader` (siehe `lib/filePreview.ts`, schon vorhanden
 * und an anderer Stelle getestet). Hier beginnt die Kette erst BEIM fertigen
 * Klartext.
 *
 * ── Die drei Schritte, in dieser Reihenfolge ─────────────────────────────────
 *  1. {@link glaetteZeichen} - typografische Zeichen, die Word automatisch
 *     einsetzt (Gedankenstrich, „schöne" Anführungszeichen, Auslassungspunkte),
 *     werden auf ihr tippbares Gegenstück zurückgeführt. Das ist eine ANDERE
 *     Baustelle als `toLayoutText` (`layouts.ts`): Jenes löst Lücken der
 *     TASTATUR (ß auf Schweizer Layout), dies hier löst Lücken der
 *     TEXTVERARBEITUNG - beide bleiben getrennt.
 *  2. {@link untippbareZeichen} - was danach noch übrig bleibt und auf keiner
 *     Taste liegt (Emojis, fremdsprachige Akzentbuchstaben, ein rohes ß in der
 *     Tippchallenge). Die Lehrkraft sieht das VOR dem Start als Liste
 *     (Entscheidung Johannes 17.09.2026) - hier wird nichts automatisch
 *     verworfen.
 *  3. {@link zeileUmbrechen} - Wortumbruch auf Zeilenlänge, weil `TypingSession`
 *     zeilenweise arbeitet (siehe `schreibproben/index.ts`, „Warum Zeilen und
 *     kein Fliesstext").
 * {@link entferneUntippbareZeichen} kommt erst zum Zug, wenn die Lehrkraft trotz
 * der Warnung startet - eine Zeile OHNE das Zeichen ist tippbar, ein
 * Platzhalter dafür wäre es unter Umständen nicht.
 *
 * ── Warum ß eine Option und kein fester Wert ist ────────────────────────────
 * In der Tippchallenge gilt weiter {@link VERBOTEN_IN_PROBEN}: Zwei Kinder
 * derselben Klasse müssen denselben Text gleich lang tippen, und auf der
 * Schweizer Tastatur gibt es kein ß. Bei „Eigene Übung" gibt es diese
 * Fairness-Pflicht nicht - dort übersetzt die normale Layout-Logik ß→ss längst
 * geräteabhängig richtig. Darum trägt {@link untippbareZeichen} ein
 * `verbietenSs`, statt ß fest einzubauen.
 */
import type { Lernweg } from "./lernweg";
import { VERBOTEN_IN_PROBEN, zeichenVorrat } from "./schreibprobe";
import { eigenerBuchstabe, kleinFuer } from "./sprachRegister";
import { kombizeichenDerSprache, kombizeichenTabelle } from "./totasten";

/**
 * Wie die Sache heisst - für Kinder, Lehrkräfte und die Kopfzeile. Dieselbe
 * Regel wie bei {@link PRUEFUNG_WORT} (`schreibprobe.ts`): NUR HIER ändern.
 */
export const EIGENE_UEBUNG_WORT = "Eigene Übung";

/**
 * ★ EN6a (19.09.2026): dasselbe Wort in der englischen Bedienung der Lehrkraft
 * - Glossar §3.8/§5 Nr 9: *Custom exercise*. Das KIND liest dafür *an
 * exercise from your teacher* (§3.6, steht bei den Kind-Texten).
 */
export const EIGENE_UEBUNG_WORT_EN = "Custom exercise";

/**
 * ★ E11a (25.09.2026): dasselbe Wort auf Französisch - Glossar §9.2 wörtlich
 * (*Texte de la classe*, die Lehrkraft lädt ihn hoch).
 */
export const EIGENE_UEBUNG_WORT_FR = "Texte de la classe";

/** ★ ES-O (27.09.2026): dasselbe Wort auf Spanisch - *Texto de la clase*. */
export const EIGENE_UEBUNG_WORT_ES = "Texto de la clase";

/**
 * ★ O-IT (02.10.2026): dasselbe Wort auf Italienisch - Glossar §2.6
 * (*Esercizio personalizzato*). Das Kind liest *Esercizio dell'insegnante*.
 */
export const EIGENE_UEBUNG_WORT_IT = "Esercizio personalizzato";

/**
 * ★ O-PL (02.10.2026): dasselbe Wort auf Polnisch - Glossar §2.6 (*Własne
 * ćwiczenie*). Das Kind liest *Ćwiczenie dla klasy* (§2.2).
 */
export const EIGENE_UEBUNG_WORT_PL = "Własne ćwiczenie";

/**
 * ★ O-TR (02.10.2026): dasselbe Wort auf Türkisch - Glossar §2.6 (*Kişisel
 * alıştırma*). Das Kind liest *Öğretmenden alıştırma* (§2.2).
 */
export const EIGENE_UEBUNG_WORT_TR = "Kişisel alıştırma";

/**
 * ★ O-CS (03.10.2026): dasselbe Wort auf Tschechisch - Glossar §2.6 (*Vlastní
 * cvičení*). Das Kind liest *Cvičení ze školy* (§2.2).
 */
export const EIGENE_UEBUNG_WORT_CS = "Vlastní cvičení";

// ── 1. Glätten ────────────────────────────────────────────────────────────

/**
 * Typografische Ersetzungen, in Anwendungsreihenfolge. Nur Zeichen, die Word/
 * Autokorrektur verlässlich selbst einsetzt - keine Rätselraterei über fremde
 * Schriftsysteme.
 */
const TYPOGRAFISCHE_ERSETZUNGEN: readonly (readonly [von: string, nach: string])[] = [
  // ⚠️ Der Strich-Wächter (`tests/typing-striche.test.ts`) verbietet den
  // echten Halbgeviert-/Geviertstrich in jeder Zeichenkette - zu Recht für
  // Texte, die vorgelesen werden. HIER ist das Zeichen selbst der Gegenstand
  // (die Ersetzungstabelle muss es erkennen, um es zu ersetzen, nicht es
  // vorlesen) - diese Datei steht darum mit Begründung in `AUSNAHMEN`
  // (`scripts/_striche.mts`).
  ["–", "-"], // Halbgeviertstrich
  ["—", "-"], // Geviertstrich
  ["„", '"'], // „
  ["“", '"'], // "
  ["”", '"'], // "
  ["«", '"'], // «
  ["»", '"'], // »
  ["‘", "'"], // '
  ["’", "'"], // '
  ["‚", "'"], // ‚
  ["…", "..."], // …
  [" ", " "], // geschütztes Leerzeichen
  [" ", " "], // schmales geschütztes Leerzeichen
  ["\t", " "], // Tabulator (aus Tabellen/Einzügen)
  /**
   * ★ Unsichtbare Formzeichen (17.09.2026, an einem echten Emoji gemessen:
   * 🌬️ = Basis-Zeichen + U+FE0F). Ohne diese Zeile taucht das Formzeichen als
   * EIGENER, leer wirkender Eintrag in der Zeichen-Liste auf ("diese Zeichen
   * liegen auf keiner Taste: '🌬', ''") - für sich genommen ist es nie ein
   * Anschlag, den irgendjemand tippen wollte. Das sichtbare Zeichen davor
   * (hier das Emoji selbst) wird weiterhin ganz normal gemeldet.
   */
  ["︎", ""], // Variationsselektor: Text-Darstellung
  ["️", ""], // Variationsselektor: Emoji-Darstellung
  ["‍", ""], // Zero Width Joiner (Emoji-Ketten wie 👩‍👩‍👧)
  ["‌", ""], // Zero Width Non-Joiner
];

// ── 0. Die Datei lesen: welche Zeichenkodierung? ────────────────────────────

/**
 * ★ Die Erkennung selbst steht seit 29.09.2026 in `@/lib/textdatei` (der
 * Hörsaal braucht sie auch) - hier nur weitergereicht, damit jeder bisherige
 * Import gleich bleibt. Die Geschichte dazu (3. Klasse HAS, 23.09.) steht dort.
 */
export { dekodiereTextdatei } from "@/lib/textdatei";

/** Zeilenenden vereinheitlichen - vor allem für Dateien von Windows/Mac. */
function vereinheitlicheZeilenenden(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

/**
 * Typografische Zeichen auf ihr tippbares Gegenstück zurückführen. Gibt den
 * geglätteten Text UND die Liste der dabei ersetzten Quellzeichen zurück (für
 * eine kurze Zusammenfassung in der Vorschau, z. B. „– wurde zu -").
 */
export function glaetteZeichen(text: string): { text: string; ersetzt: string[] } {
  let ergebnis = vereinheitlicheZeilenenden(text);
  const ersetzt: string[] = [];
  for (const [von, nach] of TYPOGRAFISCHE_ERSETZUNGEN) {
    if (ergebnis.includes(von)) {
      // ★ Ein unsichtbares Formzeichen (Variationsselektor, ZWJ/ZWNJ - "nach"
      // ist dann "") gehört nicht in die Zusammenfassung: „wurde zu "
      // klingt für ein Zeichen, das man nie gesehen hat, wie ein Programmfehler.
      if (nach) ersetzt.push(von);
      ergebnis = ergebnis.split(von).join(nach);
    }
  }
  return { text: ergebnis, ersetzt };
}

// ── 2. Was danach noch übrig bleibt ─────────────────────────────────────────

/**
 * ★ 21.09.2026: „alles" PLUS die Zeichen, die nur das Niveau „Programmcode"
 * kennt (der Unterstrich `_`, siehe `extra` in `schreibprobe.ts`). Die App
 * kann ihn tippen und ansagen; ohne ihn liefe Programmcode als Vorlage
 * (`vorlagen.ts`) in die Liste „liegen auf keiner Taste" - und wer trotzdem
 * startet, bekäme jeden Bezeichner ohne Unterstrich.
 */
// ★ E1 (24.09.2026): über BEIDE Lernwege vereint - eine Taste, die auf
// irgendeinem Weg gelernt wird, liegt auf einer Taste.
//
// ★★ G2b-2 (02.10.2026): der Vorrat gilt JE WEG. Bis dahin stand hier fest
// `["de", "en"]` (E2a: „fr" lag damals noch auf keiner Tastatur). Seit fr und es
// live sind, hiess das: eine Lehrkraft einer französischen oder spanischen
// Klasse verlor é, ñ, ¿ beim Start aus ihrem Text („año" ⇒ „ao"). Jetzt gilt für
// den Weg des Kindes: der Vorrat von de und en (unverändert, wie bisher) PLUS
// der eigene Vorrat des Weges. Ohne Weg (`weg` fehlt) gilt der alte Vorrat von
// de und en - jeder bisherige Aufruf verhält sich wie vorher. Ein Zeichen eines
// ANDEREN Weges (é auf Weg „de") bleibt untippbar: dieses Kind hat keine Taste
// dafür.
const GRUND_WEGE = ["de", "en"] as const satisfies readonly Lernweg[];

function vorratVon(wege: readonly Lernweg[]): Set<string> {
  return new Set(wege.flatMap((w) => [...zeichenVorrat("alles", w), ...zeichenVorrat("code", w)]));
}

let bekannteZeichenGrund: Set<string> | null = null;
const bekannteZeichenJeWeg = new Map<Lernweg, Set<string>>();

/** Die Zeichen, die auf einer Taste des Weges `weg` liegen (ohne Weg: de + en). */
function bekannteZeichen(weg?: Lernweg): Set<string> {
  bekannteZeichenGrund ??= vorratVon(GRUND_WEGE);
  if (weg === undefined || (GRUND_WEGE as readonly Lernweg[]).includes(weg)) return bekannteZeichenGrund;
  let v = bekannteZeichenJeWeg.get(weg);
  if (!v) {
    v = new Set([...bekannteZeichenGrund, ...vorratVon([weg])]);
    bekannteZeichenJeWeg.set(weg, v);
  }
  return v;
}

/** Das Kombinationszeichen eines Akzents → die Totaste, die ihn erzeugt. */
const TOTASTE_DES_AKZENTS: Readonly<Record<string, string>> = {
  "\u0301": "´",
  "\u0300": "`",
  "\u0302": "^",
  "\u0308": "¨",
};

/**
 * Liegt `zeichen` (klein) über eine TOTASTE auf einer Taste des Weges - á é í ó ú
 * auf Weg „es" (´ + Buchstabe), ê â î ô û ë ï ü ÿ auf Weg „fr" (^ oder ¨ +
 * Buchstabe)? Die Totaste muss auf dem EIGENEN Vorrat des Weges liegen (nicht
 * auf dem von de/en: das deutsche ^ ist zwar eine Totaste, aber der Weg „de"
 * lehrt sie nicht - dort bleibt „ê" untippbar, wie bisher).
 */
function ueberTotasteTippbar(zeichen: string, weg: Lernweg, bekannt: ReadonlySet<string>): boolean {
  // Die Wege de und en lehren keine Totaste (ihr ^ ist eine gewöhnliche Taste): wie bisher.
  if ((GRUND_WEGE as readonly Lernweg[]).includes(weg)) return false;
  // ★★★ G3a-SCHRIFT (25.10.2026): die Sprachen ab dem 25.10.2026 prüfen an IHRER Kombizeichen-Liste (totasten.ts) -
  // die Zerlegung unten kennt nur vier Akzente: griechisch „ά" (Tonos `΄`, nicht `´`), „ΐ" (drei Teile), portugiesisch
  // „ã" (Tilde), niederländisch „é" über `'` wären untippbar gewesen. Und ein eigener Buchstabe der Sprache (bulgarisch
  // „й", ungarisch „ő") kommt NIE über eine Totaste: er liegt auf seiner Taste oder fehlt (`eigenerBuchstabe`).
  if (kombizeichenTabelle(weg).eigeneUebungNachListe) {
    if (eigenerBuchstabe(zeichen, weg)) return false;
    const vorrat = vorratVon([weg]);
    return kombizeichenDerSprache(weg).some((k) => k.zeichen === zeichen && bekannt.has(k.dann) && vorrat.has(k.tot));
  }
  const teile = [...zeichen.normalize("NFD")];
  if (teile.length !== 2) return false;
  const tot = TOTASTE_DES_AKZENTS[teile[1]];
  if (!tot || !bekannt.has(teile[0])) return false;
  return vorratVon([weg]).has(tot);
}

/**
 * Die Zeichen, die nach dem Glätten immer noch auf keiner Taste liegen -
 * einmal je Zeichen, in der Reihenfolge des ersten Auftretens. Gross-/
 * Kleinschreibung ist dabei egal: Ist ein Buchstabe gelernt, ist es auch seine
 * Grossform (Umschalttaste), nie ein eigenes Zeichen.
 *
 * `\n` (Zeilentrenner) zählt nie mit - der verschwindet ohnehin beim Umbrechen
 * in {@link zeileUmbrechen} und wird nie zu einem Anschlag.
 */
export function untippbareZeichen(text: string, opts: { verbietenSs: boolean; weg?: Lernweg }): string[] {
  const bekannt = bekannteZeichen(opts.weg);
  // Türkisch: „İ" muss zu „i" werden, nicht zu „i̇" (zwei Zeichen) - `kleinFuer`.
  const klein = (z: string) => (opts.weg === undefined ? z.toLowerCase() : kleinFuer(z, opts.weg));
  const gefunden: string[] = [];
  const gesehen = new Set<string>();
  for (const zeichen of text) {
    if (zeichen === "\n" || gesehen.has(zeichen)) continue;
    gesehen.add(zeichen);
    if (zeichen === "ß") {
      if (opts.verbietenSs) gefunden.push(zeichen);
      continue;
    }
    const k = klein(zeichen);
    if (bekannt.has(k)) continue;
    if (opts.weg !== undefined && ueberTotasteTippbar(k, opts.weg, bekannt)) continue;
    gefunden.push(zeichen);
  }
  return gefunden;
}

// ── 3. Umbrechen ─────────────────────────────────────────────────────────────

/**
 * Vernünftiger Mittelwert der bestehenden Prüfungsniveaus (20 bis 40 Zeichen
 * je Zeile, `NIVEAU_DEFS[*].zeileVon/zeileBis` in `schreibprobe.ts`).
 */
export const ZEILE_ZIEL_STANDARD = 36;

/**
 * Wortumbruch auf Zeilenlänge - JE QUELLZEILE, nicht über den ganzen Text
 * hinweg. ⚠️ Gemessen 17.09.2026: Ein erster Entwurf brach über `/\s+/`
 * gesamte Absätze neu um und behandelte einen einzelnen Zeilenumbruch dabei
 * wie ein Leerzeichen - aus einem Gedicht mit bewusst kurzen Zeilen wurde ein
 * einziger Fliesstext. Die Lehrkraft hat die Zeilen ihrer Datei selbst
 * gesetzt; eine schon kurze Zeile bleibt darum unverändert stehen, nur eine
 * zu LANGE Zeile wird an Wortgrenzen aufgeteilt. Leere Zeilen (Absatzabstand)
 * werden übersprungen - eine leere Zeile wäre ein Anschlag ohne Zeichen.
 * Ein einzelnes Wort, das länger als `zielLaenge` ist, bekommt trotzdem eine
 * eigene Zeile (nicht zerschnitten - ein zerschnittenes Wort ist kein Wort
 * mehr).
 */
export function zeileUmbrechen(text: string, zielLaenge: number = ZEILE_ZIEL_STANDARD): string[] {
  const zeilen: string[] = [];
  const quellzeilen = vereinheitlicheZeilenenden(text).split("\n");
  for (const quellzeile of quellzeilen) {
    const woerter = quellzeile.split(/\s+/).filter((w) => w.length > 0);
    let aktuell = "";
    for (const wort of woerter) {
      const kandidat = aktuell ? `${aktuell} ${wort}` : wort;
      if (kandidat.length > zielLaenge && aktuell) {
        zeilen.push(aktuell);
        aktuell = wort;
      } else {
        aktuell = kandidat;
      }
    }
    if (aktuell) zeilen.push(aktuell);
  }
  return zeilen;
}

// ── 4. Erst beim Start: übrige untippbare Zeichen entfernen ────────────────

/**
 * Entfernt die übrig gebliebenen untippbaren Zeichen aus jeder Zeile (die
 * Lehrkraft hat sie gesehen und trotzdem gestartet). Mehrfache Leerzeichen,
 * die dadurch entstehen, werden zusammengezogen - eine Lücke ist kein
 * Anschlag, zwei Lücken hintereinander sähen aber wie einer aus.
 */
export function entferneUntippbareZeichen(
  zeilen: readonly string[],
  verbotene: ReadonlySet<string>,
): string[] {
  if (verbotene.size === 0) return [...zeilen];
  return zeilen.map((zeile) =>
    [...zeile]
      .filter((z) => !verbotene.has(z))
      .join("")
      .replace(/ {2,}/g, " ")
      .trim(),
  );
}

// ── 3a. Fertig gesetzte Zeilen (Vorlagen mit fester Zeilenform) ─────────────

/**
 * Die Kette für einen Text, dessen ZEILEN schon feststehen - Vorlagen wie
 * „Programmcode" (21.09.2026). Gleiche Schritte 1 und 2 wie
 * {@link verarbeiteEigenenText}, aber KEIN Umbrechen: {@link zeileUmbrechen}
 * zerlegt eine Zeile an jeder Lücke und setzt sie mit EINEM Leerzeichen wieder
 * zusammen - die Einrückung, in Python die Syntax selbst, ginge verloren, und
 * eine Zeile über dem Zielmass würde geteilt statt so getippt, wie der Code
 * sie zeigt. Leere Zeilen werden trotzdem übersprungen (ein Anschlag ohne
 * Zeichen).
 */
export function verarbeiteFesteZeilen(
  zeilen: readonly string[],
  opts: { verbietenSs: boolean; weg?: Lernweg },
): EigenerTextVorschau {
  const { text, ersetzt } = glaetteZeichen(zeilen.join("\n"));
  const unbekannt = untippbareZeichen(text, opts);
  const fertig = text.split("\n").filter((z) => z.trim().length > 0);
  const zeichenGesamt = fertig.reduce((n, z) => n + z.length, 0) + Math.max(0, fertig.length - 1);
  return { zeilen: fertig, zeichenGesamt, ersetzt, unbekannt };
}

// ── Zusammenfassung für die Vorschau ────────────────────────────────────────

/**
 * Der Zeiger, den `tt_classes.settings.eigeneUebung` trägt - genauso klein
 * wie der bestehende `schreibprobe`-Zeiger (`SchreibprobePlan`), passt locker
 * in die 2000-Byte-Grenze der Klassen-Einstellungen. Der eigentliche Text
 * liegt in einer eigenen Zeile (`tt_eigene_texte`/lokal `eigeneTexte`),
 * darauf verweist nur die Id.
 *
 * ★ LEGACY seit Z1 (19.09.2026): Es gilt die REIHE
 * (`tt_classes.eigeneUebungen`, `eigeneUebungReihe.ts`). Dieser Zeiger wird
 * nur noch gelesen, solange die Reihe leer ist (faules Umziehen).
 */
export interface EigenerTextZeiger {
  textId: string;
  angelegtMs: number;
  /** Für die Anzeige in „Meine Klassen" - ohne eigene Abfrage der Zeile. */
  dateiname: string;
}

/** Ein hochgeladener Text, wie ihn Lehrkraft und Kind zu lesen bekommen. */
export interface EigenerTextGelesen {
  dateiname: string;
  zeilen: string[];
}

/**
 * Den Zeiger aus den Klassen-Einstellungen lesen - wehrhaft, genau wie
 * `schreibprobe.planAusEinstellungen`: Ein kaputter Wert vom Server darf
 * keinem Kind eine falsche Übung vor die Nase setzen, er heisst dann einfach
 * „keine zugewiesen".
 */
export function eigeneUebungZeigerAusEinstellungen(settings: unknown): EigenerTextZeiger | null {
  if (!settings || typeof settings !== "object") return null;
  const roh = (settings as { eigeneUebung?: unknown }).eigeneUebung;
  if (!roh || typeof roh !== "object") return null;
  const p = roh as Record<string, unknown>;
  const textId = typeof p.textId === "string" ? p.textId.trim() : "";
  if (!textId) return null;
  const angelegtMsRoh = typeof p.angelegtMs === "number" ? p.angelegtMs : Number(p.angelegtMs);
  const angelegtMs = Number.isFinite(angelegtMsRoh) ? angelegtMsRoh : 0;
  const dateiname = typeof p.dateiname === "string" ? p.dateiname : "";
  return { textId, angelegtMs, dateiname };
}

export interface EigenerTextVorschau {
  zeilen: string[];
  zeichenGesamt: number;
  ersetzt: string[];
  unbekannt: string[];
}

/**
 * Die ganze Kette auf einmal, für die Vorschau in der Lehrkraft-Oberfläche.
 * `zeilen` enthält an dieser Stelle noch die übrig gebliebenen `unbekannt`-
 * Zeichen - erst {@link entferneUntippbareZeichen} beim tatsächlichen Start
 * nimmt sie heraus, damit die Vorschau ehrlich zeigt, was in der Datei stand.
 */
export function verarbeiteEigenenText(
  rohtext: string,
  opts: { verbietenSs: boolean; zielZeilenlaenge?: number; weg?: Lernweg },
): EigenerTextVorschau {
  const { text, ersetzt } = glaetteZeichen(rohtext);
  const unbekannt = untippbareZeichen(text, opts);
  const zeilen = zeileUmbrechen(text, opts.zielZeilenlaenge);
  const zeichenGesamt = zeilen.reduce((n, z) => n + z.length, 0) + Math.max(0, zeilen.length - 1);
  return { zeilen, zeichenGesamt, ersetzt, unbekannt };
}
