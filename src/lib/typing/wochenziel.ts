/**
 * Wochenziel NEU - Minuten je Woche, OHNE Einheiten (Bauplan W,
 * `BAUPLAN-2026-09-18-MEINE-KLASSEN-UMBAU.md` §„W · Wochenziel neu",
 * `ENTWURF-2026-09-18-MEINE-KLASSEN-UMBAU.md` §7f - UND Johannes' Korrektur
 * vom 18.09.2026, NACH dem ersten Entwurf dieser Datei, wörtlich: *„Wir
 * benötigen doch die Wochenaufgabe in Minuten bei jedem Kind einzeln, aber
 * wenn für die ganze Klasse eingestellt wird, ändern sich alle mit. Wir
 * bleiben bei Minuten pro Woche ohne Einheiten."* - und VIER Review-Runden
 * derselben Nacht (siehe unten, je an ihrer Stelle). Die dritte Runde
 * (Johannes, wörtlich): *„das Wochenziel beginnt am Montag um 8:00 Uhr"* und
 * *„Das neue Ziel beginnt ab kommender Woche um 8:00 Uhr (nicht ab dieser
 * Woche!)"*. Die vierte ersetzte die Sperr-MARKE am Ereignis durch
 * Sperr-ZEITRÄUME an der Klasse (siehe „Eine Stunde sperren" unten). Die
 * FÜNFTE (letzte) Runde ersetzt den Zielverlauf-Mechanismus komplett (siehe
 * „Zieländerung" unten - der Grund ist ein Wettlauf-Fehler, kein Wunsch).
 *
 * ── Wo das Ziel WOHNT (Korrektur, wichtig) ──────────────────────────────────
 * Das Wochenziel ist und bleibt eine EIGENSCHAFT JEDES KINDES (wie heute
 * `goalMinutes`/`goalUnits` in `account.ts`) - NICHT ein Klassen-Datensatz.
 * „Für die ganze Klasse einstellen" ist nur eine BEQUEMLICHKEIT einer
 * höheren Schicht (W3: ein Knopf, der denselben Wert allen Kindern der
 * Klasse einzeln schreibt - wie das heutige „Für alle übernehmen",
 * `tests/tastenflow-einstellungen-speichern.test.tsx`). Diese Datei kennt
 * nur das JE-KIND-Ziel; sie weiss nichts von „Klasse".
 *
 * ⚠️⚠️ ADDITIV, NICHTS WIRD UMGESTELLT (Bauplan-Schritt W1, 18.09.2026): Diese
 * Datei liest und schreibt nichts, was `goals.ts` oder `wochenrhythmus.ts`
 * heute benutzen. Die laufende App rechnet unverändert nach Einheiten, bis
 * die Lehrkraft-Seite (W3) und die Kind-Ansicht (W4) auf dieses Modul
 * umgestellt sind.
 *
 * ── Woche ────────────────────────────────────────────────────────────────
 * ★★★ Grenze Montag 08:00 (lokal), NICHT Mitternacht (Johannes, dritte
 * Review-Runde: *„das Wochenziel beginnt am Montag um 8:00 Uhr"*). Eine
 * Ziel-Woche läuft also von Montag 08:00 bis zum NÄCHSTEN Montag 08:00; wer
 * am Montag vor 8 Uhr übt, übt noch für die VORIGE Woche.
 *
 * ⚠️ KEIN eigenes Datum-Rechnen dafür - `wochenrhythmus.ts` kann genau das
 * schon (eine Unterrichtsstunde verschiebt die Wochengrenze auf einen
 * beliebigen Wochentag/Uhrzeit). Diese Datei benutzt sie über EINE feste,
 * exportierte Konstante, {@link WOCHENZIEL_GRENZE} - „Unterricht am Montag,
 * Ende 8:00" ist genau die Montag-8:00-Grenze, kein neuer Mechanismus.
 * `wochenStart(ts, WOCHENZIEL_GRENZE)` liefert den Wochenanfang,
 * `buildDayPractice(events, WOCHENZIEL_GRENZE)` (aus `goals.ts`) die
 * Tages-Buckets - sie teilt über `uebungstagSchluessel` den Montag selbst in
 * einen 00:00-Bucket (VORIGE Woche) und einen 08:00-Bucket (NEUE Woche).
 * `wochenrhythmus.ts` UND `goals.ts` werden dabei nur GELESEN/importiert,
 * nicht verändert.
 *
 * ★ SCHLÜSSEL bleiben ECHTE ISO-Wochenschlüssel: `isoWeekKey(wochenStartMs)`
 * des Montags um 8:00 ist derselbe Schlüssel wie der ISO-Kalenderwoche dieses
 * Montags („2026-W38") - NICHT `wochenSchluessel` aus `wochenrhythmus.ts` (die
 * gäbe „U…"-Schlüssel, die mit den gespeicherten `goalWeeks`/erlassenen
 * Wochen nichts zu tun hätten). Gespeicherte Wochen-Schlüssel behalten also
 * unverändert ihre Bedeutung.
 *
 * ── Minuten je Woche aus den Ereignissen ────────────────────────────────────
 * Dieselbe Tagesbasis wie das heutige Wochenziel: {@link buildDayPractice}
 * aus `goals.ts` (reine Tippzeit `activeMs` ab dem Stichtag, davor die alte
 * Wanduhr-Spanne - nichts wird rückwirkend entwertet).
 *
 * ★★★★ „Eine Stunde sperren" - VIERTE Review-Runde, ZEITRAUM statt MARKE:
 * Die ersten drei Runden trugen die Sperre als Bit am einzelnen Ereignis
 * (`TaskEvent.gesperrt`). Grund für die Rücknahme: Das Bit hängt davon ab,
 * dass das GERÄT DES KINDES die Sperre RECHTZEITIG mitbekommt (offline,
 * veraltete Realtime-Verbindung) - das ist ein MESSFEHLER, keine Buchhaltung.
 * Die Lehrkraft speichert die Sperre stattdessen als ZEITRAUM AN DER KLASSE
 * (`tt_classes.gesperrteZeiten`, JSON-Liste, Feld kommt mit W2) und {@link
 * GesperrteZeit} wird HIER, nachträglich, gegen die Ereignisse ausgewertet
 * ({@link inGesperrterZeit}). Das wirkt:
 *  - RÜCKWIRKEND (auch für Ereignisse, die geschrieben wurden, bevor die
 *    Sperre gesetzt war - ein Kind, das offline übte, verliert nichts UND
 *    gewinnt nichts durch Zufall),
 *  - übersteht ein „Aufheben" der Sperre unverändert (der Zeitraum bleibt in
 *    der Vergangenheit gültig, auch wenn die Lehrkraft ihn vorzeitig beendet),
 *  - und ist auch dem SERVER zugänglich (die Wochen-Mail kann dieselbe Liste
 *    lesen, ohne eine Ereignis-Marke zu brauchen).
 * Übungszeit in einem gesperrten Zeitraum zählt überall sonst unverändert als
 * Übezeit/Statistik - nur die Minuten fürs WOCHENZIEL schliessen sie aus,
 * indem die betroffenen Ereignisse VOR {@link buildDayPractice} entfernt
 * werden.
 *
 * ── Zieländerung: ein FELD am Kind, KEINE Ereignis-Marker mehr ─────────────
 * ★★★★★ FÜNFTE (letzte) Review-Runde - ein Entwurfsfehler der dritten/vierten
 * Runde wurde noch VOR jeder Auslieferung gefunden: Die Marker-Geschichte
 * lag im `lw_events`-Datensatz JEDES KINDES. Eine Ziel-Änderung „für die
 * ganze Klasse" hätte also den BROWSER DER LEHRKRAFT dazu gebracht, in
 * ~25 Kinder-Datensätze GLEICHZEITIG einen Marker zu schreiben - während
 * genau diese Kinder mitten im Unterricht selbst Zeilen anhängen
 * (Lesen-Ändern-Schreiben auf DERSELBEN Zeile). Ein klassischer
 * Lost-Update-Wettlauf, und zwar ausgerechnet während der Stunde, für die
 * die Sperre gedacht ist.
 *
 * ⇒ Der Zielverlauf ist jetzt ein FELD AM KIND-DATENSATZ selbst
 * (`tt_pupils.wochenzielVerlauf`, JSON-Liste, kommt mit W2) - NUR die
 * Lehrkraft schreibt es, nie ein Kind. Ereignisse sind an der Ziel-Geschichte
 * nicht mehr beteiligt: kein Marker-Event, kein `GOAL_CHANGE_LESSON`, kein
 * `zielJeWoche`-Bit (die entsprechenden Änderungen an `eventPack.ts`,
 * `account.ts`/`TaskEvent` und dem Server-Zwilling sind zurückgenommen).
 *
 * {@link ZielAbschnitt} `{ ab, minuten }` heisst: „ab der Woche `ab` gilt
 * `minuten`" - eine aufsteigend sortierte Liste, {@link zielFuerWoche} sucht
 * darin den passenden Abschnitt für eine gegebene Woche. Johannes, dritte
 * Runde: *„Das neue Ziel beginnt ab kommender Woche"* - {@link zielAendern}
 * setzt den neuen Abschnitt darum immer auf {@link naechsteWocheKey}, nie auf
 * die laufende Woche.
 *
 * ★ Ein NEUES Kind (Beitritt zur Klasse) bekommt seinen ERSTEN Abschnitt
 * ebenfalls erst ab der NÄCHSTEN Woche ({@link neuesKindVerlauf}) - das
 * ersetzt das frühere `zaehltAbWoche`-Feld ersatzlos: Ohne einen Abschnitt,
 * der eine Woche abdeckt, liefert {@link zielFuerWoche} für sie ohnehin 0
 * („kein Ziel vor dem ersten Abschnitt").
 *
 * ★ Der ÜBERGANG von den alten Feldern (`goalMinutes`/`goalUnits`, ohne
 * eigene Minuten/Woche-Zahl) wird verlustfrei und OHNE Schreibzugriff
 * nachgebildet: {@link kindWochenzielAusFeldern} rechnet bei Bedarf
 * `goalMinutes × goalUnits` um EINEN einzigen Abschnitt aus, gültig ab
 * {@link UMSTELLUNG_WOCHE} - Wochen davor zählen nicht, weil nirgends
 * protokolliert ist, WANN das alte Ziel wirklich begann (Johannes,
 * 18.09.2026: *„die vergangenen Wochen zählen natürlich nicht"*). Das ist
 * dieselbe Haltung wie beim neuen Kind: lieber ehrlich bei 0 anfangen als
 * eine erfundene Vergangenheit vortäuschen.
 *
 * ── Nachholen ────────────────────────────────────────────────────────────
 * ★ Überschuss füllt die ÄLTESTE offene Woche zuerst (nicht die jüngste).
 * Das ist NICHT aus `goals.ts` übernommen - dort gibt es dafür kein Vorbild,
 * weil das alte Modell nur EINEN gepoolten Rückstand kennt und ihn nur aus
 * der LAUFENDEN Woche heraus abbaut. Hier bekommt jede Wochenzeile ihr
 * eigenes „erfüllt"/„offen" - Ältestes zuerst ist die Reihenfolge, die einer
 * Lehrkraft am leichtesten zu erklären ist und verhindert, dass ein Kind
 * viele kleine Lücken vor sich herschiebt, während nur die jüngste gestopft
 * wird.
 *
 * ★★ Review 18.09.2026 nachts, „nie etwas gegen ein Kind": auch eine Woche
 * OHNE eigenes Ziel (nicht gewählt, erlassen) gibt ihre GANZE geübte Zeit als
 * Überschuss an ältere offene Wochen weiter - eine Ferienwoche, in der
 * trotzdem geübt wurde, soll nicht spurlos verpuffen, nur weil sie selbst
 * kein Ziel hatte. Die Woche selbst bleibt dabei bei `ziel = 0` / `erfuellt =
 * 0` / `offen = 0` stehen - nur ihr Überschuss wandert weiter. Wochen vor
 * `zurueckgesetztAb` (oder vor dem ersten Abschnitt im Verlauf) werden
 * dadurch NICHT plötzlich füllbar: Sie haben nie `offen > 0` (ihr `ziel` ist
 * immer 0) und kommen darum nie in die Warteschlange.
 *
 * ── Erlassen / Zurücksetzen ──────────────────────────────────────────────
 * Bleibt wie in `goals.ts`: eine erlassene Woche (`erlasseneWochen`) zählt
 * NIRGENDS - weder als Soll noch als Ist. Wochen vor `zurueckgesetztAb`
 * (Stichwoche „Überfällige zurücksetzen", Lehrkraft-Handlung) sind ebenso aus
 * der Rechnung. Beide werden hier dadurch abgebildet, dass ihr `ziel` auf 0
 * gesetzt wird: `erfüllt = min(geübt, 0) = 0` und `offen = 0` folgen dann von
 * selbst, ohne Sonderfall-Code an jeder Stelle, die die Zahlen
 * weiterverarbeitet.
 */
import { buildDayPractice, isoWeekKey } from "./goals";
import { wochenStart, type Wochenrhythmus } from "./wochenrhythmus";
import type { Lang, TaskEvent } from "./account";
import { prozentMitZeichen } from "./sprachRegister";

/**
 * ★★★ DIE EINE WOCHENGRENZE für das Wochenziel: Montag 08:00 (lokal) - siehe
 * Kopf-Kommentar „Woche". Ausgedrückt als `Wochenrhythmus` (Mo = `Wochentag`
 * 0, siehe `wochenrhythmus.ts`), damit `wochenStart`/`buildDayPractice` die
 * bereits vorhandene, geprüfte Grenztag-Rechnung übernehmen, statt sie hier
 * ein zweites Mal zu bauen.
 *
 * `giltAbMs: 0` ist ohne Wirkung: Das Feld steuerte in `wochenrhythmus.ts`
 * bis zum 19.09.2026 einen rückwirkenden Vergleich bei einem sich ÄNDERNDEN
 * Unterrichtstag einer Klasse (`nieZumNachteil`, inzwischen entfernt, weil
 * der Unterrichtstag selbst abgeschafft ist) - `WOCHENZIEL_GRENZE` ändert
 * sich nie, also gibt es nichts zu vergleichen. `0` steht nur, weil das Feld
 * Pflicht ist.
 */
export const WOCHENZIEL_GRENZE: Wochenrhythmus = {
  unterrichtstag: 0, // Montag
  endeMinuten: 8 * 60, // 08:00
  giltAbMs: 0,
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Kalendertag-sicher (DST) `ms` um `tage` Tage verschieben - dieselbe Technik
 *  wie {@link wochenAnfaengeZwischen}: `setDate`, nicht Millisekunden-Arithmetik. */
function wocheVerschieben(ms: number, tage: number): number {
  const d = new Date(ms);
  d.setDate(d.getDate() + tage);
  return d.getTime();
}

/** Der ISO-Wochenschlüssel der LAUFENDEN Ziel-Woche (Montag-08:00-Grenze). */
export function aktuelleWocheKey(jetztMs: number): string {
  return isoWeekKey(wochenStart(jetztMs, WOCHENZIEL_GRENZE));
}

/**
 * Der ISO-Wochenschlüssel der FOLGENDEN Ziel-Woche nach `jetztMs` - die
 * Woche, ab der eine JETZT gemachte Änderung gilt (Johannes, dritte Runde:
 * „ab kommender Woche"). Montag 07:00 (vor der 8-Uhr-Grenze) → die laufende
 * Woche hat schon vorher begonnen, „nächste" ist darum DIESER Montag;
 * Montag 09:00 (nach der Grenze) → „nächste" ist der Montag danach.
 */
export function naechsteWocheKey(jetztMs: number): string {
  return isoWeekKey(wocheVerschieben(wochenStart(jetztMs, WOCHENZIEL_GRENZE), 7));
}

// ── Gesperrte Zeiten („eine Stunde sperren", vierte Review-Runde) ───────────

/**
 * Ein gesperrter Zeitraum an der KLASSE (siehe Kopf-Kommentar „Eine Stunde
 * sperren"): Übung in `[abMs, bisMs)` zählt nicht fürs Wochenziel. `abMs`
 * inklusive, `bisMs` exklusive - dieselbe Halboffen-Konvention wie überall in
 * dieser Datei (z. B. {@link minutenDerWoche}s Wochenfenster), damit sich
 * zwei aneinandergrenzende Zeiträume nie überlappen und nie eine Lücke
 * lassen.
 */
export interface GesperrteZeit {
  abMs: number;
  bisMs: number;
}

/** Liegt `ts` in IRGENDEINEM der gesperrten Zeiträume (`abMs` inklusive, `bisMs` exklusive)? */
export function inGesperrterZeit(ts: number, gesperrt: readonly GesperrteZeit[]): boolean {
  return gesperrt.some((z) => ts >= z.abMs && ts < z.bisMs);
}

// ── Zielverlauf (fünfte Review-Runde: Feld am Kind, keine Ereignis-Marker) ──

/**
 * Ein Abschnitt des Zielverlaufs: „ab der Woche `ab` (ISO-Schlüssel der
 * Montag-08:00-Woche) gilt `minuten` Minuten je Woche". Eine Liste davon,
 * aufsteigend nach `ab` sortiert, ist der GANZE Zielverlauf eines Kindes -
 * siehe Kopf-Kommentar „Zieländerung".
 */
export interface ZielAbschnitt {
  ab: string;
  minuten: number;
}

/**
 * Das Minuten-Ziel, das in `wocheKey` gilt: der Abschnitt mit dem GRÖSSTEN
 * `ab <= wocheKey`, sonst 0 - „kein Ziel vor dem ersten Abschnitt". Das
 * ersetzt das frühere `zaehltAbWoche`: Ein Kind ohne (oder mit erst später
 * beginnendem) Verlauf hat für frühere Wochen einfach keinen Treffer und
 * bekommt 0, ganz ohne eigenes Feld dafür.
 *
 * Sucht das MAXIMUM selbst (statt sich auf Sortierung zu verlassen) - robust
 * auch gegen einen Verlauf, der (noch) nicht sauber sortiert oder doppelt
 * belegt ist.
 */
export function zielFuerWoche(verlauf: readonly ZielAbschnitt[], wocheKey: string): number {
  let bester: ZielAbschnitt | null = null;
  for (const a of verlauf) {
    if (a.ab <= wocheKey && (!bester || a.ab > bester.ab)) bester = a;
  }
  return bester ? bester.minuten : 0;
}

/**
 * Öffentliche Fassung von {@link zielFuerWoche} für einen Zeitpunkt statt
 * eines Wochenschlüssels - der Komfort-Einstieg für eine einzelne Woche.
 */
export function effektivesWochenziel(
  ziel: Pick<KindWochenziel, "verlauf">,
  wochenStartMs: number,
): number {
  return zielFuerWoche(ziel.verlauf, isoWeekKey(wochenStartMs));
}

const ZIEL_MIN_MINUTEN = 0;
const ZIEL_MAX_MINUTEN = 600; // 10 Stunden/Woche - grosszügige Aussengrenze gegen Tippfehler

function rundeUndKlemme(minuten: number): number {
  return Math.min(ZIEL_MAX_MINUTEN, Math.max(ZIEL_MIN_MINUTEN, Math.round(minuten || 0)));
}

/**
 * Das Wochenziel ändern - reine Funktion, kein Seiteneffekt (das Schreiben
 * ans Feld `tt_pupils.wochenzielVerlauf` ist Sache von W2/W3). Die Änderung
 * gilt immer ab {@link naechsteWocheKey}, NIE ab der laufenden Woche
 * (Johannes, dritte Runde).
 *
 * Schritte:
 *  1. Jeder Abschnitt AB der Folgewoche wird verworfen - ein zweiter Wechsel
 *     in DERSELBEN (noch nicht erreichten) Woche ersetzt den anstehenden
 *     Abschnitt, statt ihn zu duplizieren oder danebenzustellen.
 *  2. Ergibt sich für die Folgewoche danach ohnehin schon derselbe Wert (der
 *     letzte verbliebene Abschnitt davor, oder 0 ohne einen), entfällt ein
 *     neuer Abschnitt komplett - „zurück auf den bisherigen Wert" räumt die
 *     anstehende Änderung einfach weg, statt eine überflüssige zu speichern.
 */
export function zielAendern(
  verlauf: readonly ZielAbschnitt[],
  neueMinuten: number,
  jetztMs: number,
): ZielAbschnitt[] {
  const minuten = rundeUndKlemme(neueMinuten);
  const naechste = naechsteWocheKey(jetztMs);
  const bereinigt = verlauf.filter((a) => a.ab < naechste);
  if (zielFuerWoche(bereinigt, naechste) === minuten) return bereinigt;
  return [...bereinigt, { ab: naechste, minuten }];
}

/**
 * Steht eine Ziel-Änderung noch AUS (ein Abschnitt, der erst nach der
 * laufenden Woche beginnt)? Für die Anzeige „ab Mo 21.09.: 60 Min." beim
 * Kind bzw. bei der Lehrkraft. `null`, wenn nichts ansteht. Liefert den
 * ÄLTESTEN anstehenden Abschnitt - nach {@link zielAendern} kann es ohnehin
 * nie mehr als einen geben, aber die Suche bleibt robust, falls doch.
 */
export function anstehendeAenderung(
  verlauf: readonly ZielAbschnitt[],
  jetztMs: number,
): ZielAbschnitt | null {
  const aktuell = aktuelleWocheKey(jetztMs);
  let bester: ZielAbschnitt | null = null;
  for (const a of verlauf) {
    if (a.ab > aktuell && (!bester || a.ab < bester.ab)) bester = a;
  }
  return bester;
}

/**
 * Der Zielverlauf eines KOMPLETT NEUEN Kindes (Beitritt zur Klasse): ein
 * einziger Abschnitt ab der NÄCHSTEN Woche (Johannes, 18.09.2026: neue
 * Kinder bekommen das Klassenziel automatisch, aber „die vergangenen Wochen
 * zählen natürlich nicht") - leer, wenn `vorgabeMinuten` 0 (oder kleiner)
 * ist, denn ein Abschnitt mit 0 Minuten wäre nur ein anderer Weg, dasselbe
 * „kein Ziel" zu sagen wie ein leerer Verlauf.
 */
export function neuesKindVerlauf(vorgabeMinuten: number, jetztMs: number): ZielAbschnitt[] {
  const minuten = rundeUndKlemme(vorgabeMinuten);
  return minuten > 0 ? [{ ab: naechsteWocheKey(jetztMs), minuten }] : [];
}

/**
 * ★★★ Stichwoche des Umbaus - siehe {@link kindWochenzielAusFeldern}. Der
 * Umbau selbst geschah in der Nacht vom 18. auf den 19.09.2026; das ist die
 * ISO-Woche, ab der die umgerechneten Alt-Ziele gelten (Wochen davor bleiben
 * ohne Ziel, siehe dort).
 */
export const UMSTELLUNG_WOCHE = "2026-W38";

function istGueltigerZielAbschnitt(x: unknown): x is ZielAbschnitt {
  if (!x || typeof x !== "object") return false;
  const a = x as Record<string, unknown>;
  return (
    typeof a.ab === "string" &&
    /^\d{4}-W\d{2}$/.test(a.ab) &&
    typeof a.minuten === "number" &&
    Number.isFinite(a.minuten) &&
    a.minuten >= 0
  );
}

/** Die Felder eines Kindes, aus denen {@link kindWochenzielAusFeldern} das Wochenziel liest. */
export interface KindWochenzielFelder {
  wochenzielVerlauf?: unknown;
  goalMinutes?: number;
  goalUnits?: number;
  goalWeeks?: string[];
  goalCatchUp?: boolean;
  goalExcusedWeeks?: string[];
  goalResetWeek?: string;
}

/**
 * {@link KindWochenziel} aus den Rohfeldern eines Kind-Datensatzes bauen -
 * der EINE Übersetzungsort zwischen Speicherform und Rechnung.
 *
 * ── Der Übergang von den alten Feldern ──────────────────────────────────
 * Ist `wochenzielVerlauf` (noch) keine gültige, nicht-leere Liste (fehlt,
 * ist kaputt, oder alle Einträge fallen bei der Prüfung durch), wird er
 * LAZY aus den alten Feldern erzeugt, OHNE irgendetwas zu schreiben - reine
 * Vorlese-Umrechnung, bei jedem Aufruf neu:
 *
 *     altes Ziel = Minuten je EINHEIT × Einheiten je Woche
 *                = `goalMinutes` × `goalUnits`
 *
 * Das ergibt GENAU EINEN Abschnitt, gültig ab {@link UMSTELLUNG_WOCHE} - alle
 * Wochen davor bleiben ohne Ziel (0), weil in den alten Feldern nirgends
 * steht, WANN dieses Ziel wirklich zu laufen begann (Johannes, 18.09.2026,
 * wörtlich: *„die vergangenen Wochen zählen natürlich nicht, deshalb sind %
 * auch gut"*). War kein altes Ziel gesetzt (`goalMinutes` oder `goalUnits`
 * ist 0 oder fehlt), bleibt der Verlauf leer - „kein Ziel" bleibt „kein
 * Ziel", umgerechnet oder nicht.
 */
export function kindWochenzielAusFeldern(p: KindWochenzielFelder): KindWochenziel {
  let verlauf: ZielAbschnitt[] = [];
  if (Array.isArray(p.wochenzielVerlauf) && p.wochenzielVerlauf.length > 0) {
    verlauf = p.wochenzielVerlauf
      .filter(istGueltigerZielAbschnitt)
      .map((a) => ({ ab: a.ab, minuten: Math.round(a.minuten) }))
      .sort((a, b) => (a.ab < b.ab ? -1 : a.ab > b.ab ? 1 : 0));
  }
  if (verlauf.length === 0) {
    const goalMinutes = p.goalMinutes ?? 0;
    const goalUnits = p.goalUnits ?? 0;
    if (goalMinutes > 0 && goalUnits > 0) {
      verlauf = [{ ab: UMSTELLUNG_WOCHE, minuten: goalMinutes * goalUnits }];
    }
  }
  return {
    verlauf,
    wochen: p.goalWeeks ?? [],
    nachholen: !!p.goalCatchUp,
    erlasseneWochen: p.goalExcusedWeeks ?? [],
    zurueckgesetztAb: p.goalResetWeek,
  };
}

// ── Ziel einer bestimmten Woche ─────────────────────────────────────────────

/**
 * Ist `woche` überhaupt eine gewählte Ziel-Woche? Leere Auswahl heisst „jede
 * Woche" - identisch zur bisherigen Regel in `goals.ts`, nur ohne die
 * dortige Rhythmus-Übersetzung (die fällt mit diesem Umbau weg).
 */
export function istZielwoche(
  woche: string,
  gewaehlteWochen: readonly string[],
): boolean {
  return gewaehlteWochen.length === 0 || gewaehlteWochen.includes(woche);
}

// ── Das Wochenziel EINES Kindes ──────────────────────────────────────────────

export interface KindWochenziel {
  /** Der Zielverlauf - siehe {@link ZielAbschnitt}, {@link zielFuerWoche}. */
  verlauf: ZielAbschnitt[];
  /** Ziel nur in diesen ISO-Kalenderwochen; leer = jede Woche ist Ziel-Woche. */
  wochen: string[];
  /** Überschuss füllt offene Minuten früherer Wochen (siehe Kopf-Kommentar). */
  nachholen: boolean;
  /** Einzeln erlassene Wochen (ISO-Schlüssel) - zählen weder oben noch unten. */
  erlasseneWochen: string[];
  /**
   * „Überfällige zurücksetzen" (Lehrkraft-Handlung): Wochen VOR dieser Woche
   * sind aus der Rechnung (Rückstand gestrichen). Fehlt der Wert, ist nichts
   * zurückgesetzt.
   */
  zurueckgesetztAb?: string;
}

/**
 * Der Text fürs Popup vor dem Speichern einer Zieländerung (Johannes,
 * 18.09.2026: *„ja, aber mit Popup und Erklärung für den Lehrer"*). Reine
 * Text-Funktion, ohne Seiteneffekt.
 *
 * ★★★ Dritte Review-Runde: das neue Ziel gilt NICHT ab dieser, sondern erst
 * ab der FOLGENDEN Woche, Montag 8:00 (Johannes: *„Das neue Ziel beginnt ab
 * kommender Woche um 8:00 Uhr (nicht ab dieser Woche!)"*). `datum` ist darum
 * der Montag NACH `jetztMs` - also der Montag der laufenden Ziel-Woche
 * (`wochenStart(jetztMs, WOCHENZIEL_GRENZE)`) plus sieben Kalendertage: Ein
 * `jetztMs` um Montag 07:00 liegt noch VOR der heutigen 8-Uhr-Grenze, die
 * laufende Woche begann darum schon letzten Montag - plus sieben Tage ist
 * das HEUTIGE Datum; ein `jetztMs` um Montag 09:00 liegt schon IN der
 * heutigen Woche - plus sieben Tage ist der NÄCHSTE Montag. Beide Fälle sind
 * getestet.
 */
export function zielAenderungsText(neueMinuten: number, jetztMs: number): string {
  const laufendeWoche = wochenStart(jetztMs, WOCHENZIEL_GRENZE);
  const montag = new Date(wocheVerschieben(laufendeWoche, 7));
  const datum = `${pad2(montag.getDate())}.${pad2(montag.getMonth() + 1)}.`;
  return (
    `Das neue Ziel von ${Math.round(neueMinuten)} Minuten pro Woche gilt ab Montag, ` +
    `${datum}, 8:00 Uhr. Bis dahin gilt das bisherige Ziel.`
  );
}

// ── Minuten je Woche aus den Ereignissen ────────────────────────────────────

/**
 * Geübte Minuten EINER Woche (Montag `wochenStartMs` 08:00 bis zum NÄCHSTEN
 * Montag 08:00), aus einer bereits gebauten Tagesübersicht
 * ({@link buildDayPractice}, mit {@link WOCHENZIEL_GRENZE} gebaut). Reine
 * Summe - kein Einheiten-/Tages-Deckel mehr (der gehörte zur alten
 * Einheiten-Rechnung in `goals.ts`, hier zählt jede Minute).
 *
 * ⚠️⚠️ DAS ENDE MUSS KALENDER-TAGE ZÄHLEN, NICHT MILLISEKUNDEN (Review,
 * dritte Runde): `wochenStartMs + 7 * 86_400_000` trifft in der Woche der
 * Sommer-/Winterzeit-Umstellung NICHT mehr 08:00, sondern 07:00 oder 09:00 -
 * dieselbe Uhr-Grenze wie {@link wochenAnfaengeZwischen} verlangt darum
 * dieselbe Technik ({@link wocheVerschieben}, `setDate`), sonst zählt eine
 * Stunde am Wochenwechsel doppelt oder gar nicht.
 */
function minutenDerWoche(
  dayPractice: ReadonlyMap<number, { minutes: number }>,
  wochenStartMs: number,
): number {
  const wochenEndeMs = wocheVerschieben(wochenStartMs, 7);
  let summe = 0;
  for (const [tag, dp] of dayPractice) {
    if (tag >= wochenStartMs && tag < wochenEndeMs) summe += dp.minutes;
  }
  return summe;
}

/**
 * Alle Wochenanfänge (Montag 08:00, siehe {@link WOCHENZIEL_GRENZE}) von der
 * Woche um `vonMs` bis (inklusive) der Woche um `bisMs`. In KALENDER-TAGEN
 * geschritten ({@link wocheVerschieben}, `setDate`), nicht in Millisekunden -
 * derselbe Grund wie in `goals.ts` (`listSelectableWeeks`): über die
 * Sommer-/Winterzeit-Umstellung würde eine feste Millisekunden-Schrittweite
 * sonst Wochen doppelt zählen oder überspringen.
 */
function wochenAnfaengeZwischen(vonMs: number, bisMs: number): number[] {
  const out: number[] = [];
  const ende = wochenStart(bisMs, WOCHENZIEL_GRENZE);
  let start = wochenStart(vonMs, WOCHENZIEL_GRENZE);
  // Sicherheitsgurt gegen eine vertauschte/verrutschte Eingabe: nie endlos.
  for (let i = 0; i < 100_000 && start <= ende; i++) {
    out.push(start);
    start = wocheVerschieben(start, 7);
  }
  return out;
}

// ── Der Wochen-Bericht ──────────────────────────────────────────────────────

export interface WochenErgebnis {
  /** ISO-Wochenschlüssel, z. B. „2026-W38". */
  woche: string;
  /** Montag 08:00 dieser Woche (siehe {@link WOCHENZIEL_GRENZE}). */
  startMs: number;
  /**
   * Minuten-Soll dieser Woche - bereits 0, wenn die Woche nicht gewählt,
   * erlassen, vor `zurueckgesetztAb` liegt, oder vor dem ersten Abschnitt
   * im Zielverlauf (siehe Kopf-Kommentar).
   */
  ziel: number;
  /** Tatsächlich geübte Minuten (ohne Zeit in `gesperrt`-Zeiträumen), IMMER echt. */
  geuebt: number;
  /** min(geuebt, ziel) - nach Nachholen ggf. durch Überschuss anderer Wochen erhöht. */
  erfuellt: number;
  /** ziel - erfuellt (nie negativ). */
  offen: number;
  /** Einzeln für dieses Kind erlassen? */
  erlassen: boolean;
  /** Zählt diese Woche überhaupt (gewählt, nicht erlassen, nicht zurückgesetzt, Ziel > 0)? */
  zielwoche: boolean;
}

/**
 * Der Wochen-Bericht für EIN Kind über einen Zeitraum [vonMs, bisMs] (je ein
 * Zeitpunkt in der ersten bzw. letzten Woche). Chronologisch aufsteigend.
 *
 * Reihenfolge der Schritte:
 *  1. Je Woche das rohe Bild: geübte Minuten, effektives Ziel (0, wenn die
 *     Woche nicht zählt - siehe {@link WochenErgebnis.ziel} -, sonst aus dem
 *     Zielverlauf, {@link zielFuerWoche}), daraus `erfuellt`/`offen`.
 *  2. Ist `ziel.nachholen` gesetzt, füllt der Überschuss einer Woche (bei
 *     einer Ziel-Woche: geuebt - ziel, wenn positiv; bei einer Woche OHNE
 *     Ziel: die GANZE geübte Zeit, siehe Kopf-Kommentar) die älteste noch
 *     offene Woche zuerst - nie über deren eigenes Ziel hinaus.
 *
 * `gesperrt` (Standard: keiner) sind die Sperr-Zeiträume DER KLASSE (siehe
 * Kopf-Kommentar „Eine Stunde sperren") - Ereignisse darin werden VOR
 * {@link buildDayPractice} entfernt, zählen also nicht als `geuebt`.
 */
export function wochenzielVerlauf(
  events: readonly TaskEvent[],
  ziel: KindWochenziel,
  vonMs: number,
  bisMs: number,
  gesperrt: readonly GesperrteZeit[] = [],
): WochenErgebnis[] {
  const dayPractice = buildDayPractice(
    events.filter((e) => !inGesperrterZeit(e.ts, gesperrt)),
    WOCHENZIEL_GRENZE,
  );
  const erlasseneWochen = new Set(ziel.erlasseneWochen ?? []);
  const zurueckgesetztAb = ziel.zurueckgesetztAb;

  const ergebnisse: WochenErgebnis[] = wochenAnfaengeZwischen(vonMs, bisMs).map(
    (startMs) => {
      const woche = isoWeekKey(startMs);
      const geuebt = minutenDerWoche(dayPractice, startMs);
      const erlassen = erlasseneWochen.has(woche);
      const vorReset = !!zurueckgesetztAb && woche < zurueckgesetztAb;
      const gewaehlt = istZielwoche(woche, ziel.wochen);
      const effektivesZiel = zielFuerWoche(ziel.verlauf, woche);
      const zielwoche = gewaehlt && !vorReset && !erlassen && effektivesZiel > 0;
      const zielMin = zielwoche ? effektivesZiel : 0;
      const erfuellt = Math.min(geuebt, zielMin);
      const offen = Math.max(0, zielMin - erfuellt);
      return { woche, startMs, ziel: zielMin, geuebt, erfuellt, offen, erlassen, zielwoche };
    },
  );

  if (ziel.nachholen) wendeNachholenAn(ergebnisse);
  return ergebnisse;
}

/**
 * Überschuss füllt die ÄLTESTE noch offene Ziel-Woche zuerst (Entscheidung,
 * siehe Kopf-Kommentar). Mutiert die übergebenen Objekte in place - sie
 * gehören ausschliesslich {@link wochenzielVerlauf} und werden nirgendwo
 * sonst geteilt.
 *
 * ★ Review 18.09.2026 nachts: eine Woche OHNE eigenes Ziel (`ziel === 0` -
 * nicht gewählt oder erlassen) gibt ihre GANZE geübte Zeit als Überschuss
 * weiter, nicht nur das, was über ein (nicht vorhandenes) Ziel hinausgeht.
 * Ihre eigene Zeile bleibt trotzdem bei `ziel`/`erfuellt`/`offen` = 0 stehen
 * - nur der Überschuss wandert zu älteren offenen Wochen. Wochen vor
 * `zurueckgesetztAb` (oder vor dem ersten Abschnitt) werden dadurch NICHT
 * füllbar: sie haben nie `offen > 0` (ihr `ziel` ist immer 0) und kommen
 * darum nie in die Warteschlange.
 *
 * Die Invariante `erfuellt + offen === ziel` bleibt für jede ZIEL-Woche
 * jederzeit erhalten: jede Füllung senkt `offen` genau um das, was sie zu
 * `erfuellt` addiert - „nie über 100 %" folgt daraus von selbst, ohne eigene
 * Kappung.
 */
function wendeNachholenAn(wochen: readonly WochenErgebnis[]): void {
  const offeneSchlange: WochenErgebnis[] = [];
  for (const w of wochen) {
    const ueberschuss0 = w.ziel > 0 ? Math.max(0, w.geuebt - w.ziel) : w.geuebt;
    let ueberschuss = ueberschuss0;
    while (ueberschuss > 0 && offeneSchlange.length > 0) {
      const alt = offeneSchlange[0];
      const fuellung = Math.min(ueberschuss, alt.offen);
      alt.erfuellt += fuellung;
      alt.offen -= fuellung;
      ueberschuss -= fuellung;
      if (alt.offen <= 0) offeneSchlange.shift();
    }
    if (w.ziel > 0 && w.offen > 0) offeneSchlange.push(w);
  }
}

// ── Erfüllung in Prozent ─────────────────────────────────────────────────────

/**
 * Erfüllung in Prozent (als Anteil 0..1, NICHT gerundet - siehe
 * {@link prozentAnzeige}) über die Ziel-Wochen im Bereich [`vonWoche`,
 * `bisWoche`] (Wochenschlüssel-Vergleich; beide Grenzen inklusive, beide
 * optional = ganze `wochen`-Liste). Σ erfuellt ÷ Σ ziel, nur über Wochen mit
 * `ziel > 0` (das schliesst nicht-gewählte, erlassene und zurückgesetzte
 * Wochen von selbst aus, siehe {@link WochenErgebnis.ziel}).
 *
 * `null`, wenn es im Bereich KEINE Ziel-Woche gibt - nie eine Division durch 0.
 */
export function erfuellungProzent(
  wochen: readonly WochenErgebnis[],
  vonWoche?: string,
  bisWoche?: string,
): number | null {
  let soll = 0;
  let erf = 0;
  for (const w of wochen) {
    if (vonWoche && w.woche < vonWoche) continue;
    if (bisWoche && w.woche > bisWoche) continue;
    if (w.ziel <= 0) continue;
    soll += w.ziel;
    erf += w.erfuellt;
  }
  return soll > 0 ? erf / soll : null;
}

/**
 * Die Prozentzahl für die Anzeige („87 % der Wochenaufgaben erledigt",
 * Johannes 18.09.2026). Rundung passiert AUSSCHLIESSLICH hier
 * (`Math.round`, „,5" rundet aufwärts) - die Rechnung selbst
 * ({@link erfuellungProzent}) bleibt unverrundet, damit sie sich verlustfrei
 * weiterverarbeiten lässt (Tabelle, Jahreskarte, Excel, Mail - dieselbe Zahl,
 * überall gleich gerundet).
 */
/**
 * ★ E11a-2 (26.09.2026, Weichen-Zähler §2.3): Tabelle statt Ternäre - Deutsch
 * UND Französisch setzen ein Leerzeichen vor das Zeichen, nur Englisch nicht
 * (Glossar §1.2).
 */
// ★ ES-O (27.09.2026): Spanisch nach RAE mit Leerzeichen („95 %").
const PROZENT_ZEICHEN: Record<Lang, string> = {
  de: " %",
  en: "%",
  fr: " %",
  es: " %",
  it: "%", // ★ O-IT (02.10.2026): Italienisch ohne Leerzeichen, „95%" (Glossar Regel 5).
  pl: "%", // ★ O-PL (02.10.2026): Polnisch ohne Leerzeichen, „95%" (Intl und PWN, Glossar Regel 5).
  // ★ O-TR (02.10.2026): Türkisch „%95" - Stellung aus dem Sprachregister (`prozentMitZeichen`).
  tr: "%",
  // ★ O-CS (03.10.2026): Tschechisch „95 %" mit geschütztem Abstand (Register `prozentAbstandGeschuetzt`).
  cs: " %",
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: "%",
  el: "%",
  hu: "%",
  nl: "%",
  pt: "%",
  br: "%",
  ro: "\u00A0%",
  sv: "\u00A0%",
  uk: "%",
};

export function prozentAnzeige(
  anteil: number | null,
  sprache: Lang = "de",
): string {
  if (anteil === null) return "-";
  return prozentMitZeichen(Math.round(anteil * 100), PROZENT_ZEICHEN[sprache], sprache);
}

// ── Die laufende Woche (Kind-Ansicht) ───────────────────────────────────────

export interface AktuelleWoche {
  geuebtMin: number;
  zielMin: number;
  /** offene Minuten dieser Woche (max(0, zielMin - geuebtMin)). */
  rest: number;
}

/**
 * Die laufende Woche EINES Kindes für die Anzeige „25 von 60 Min." - bewusst
 * NUR die Zahlen dieser einen Woche, ohne Nachholen aus anderen Wochen
 * einzurechnen (Nachholen wirkt auf die %-Übersicht/den Wochen-Bericht über
 * mehrere Wochen, {@link wochenzielVerlauf}; die Live-Anzeige „wie stehe ich
 * DIESE Woche" bleibt einfach und unabhängig von der Geschichte). `gesperrt`
 * wird unverändert an {@link wochenzielVerlauf} weitergereicht.
 */
export function aktuelleWoche(
  events: readonly TaskEvent[],
  ziel: KindWochenziel,
  nowMs: number,
  gesperrt: readonly GesperrteZeit[] = [],
): AktuelleWoche {
  const startMs = wochenStart(nowMs, WOCHENZIEL_GRENZE);
  const [w] = wochenzielVerlauf(events, ziel, startMs, startMs, gesperrt);
  return { geuebtMin: w.geuebt, zielMin: w.ziel, rest: w.offen };
}

// ── Wochenschlüssel ⇄ Zeitpunkt, und die VOLLE Geschichte (W3a, 18.09.2026) ──

/**
 * Montag 08:00 ({@link WOCHENZIEL_GRENZE}) der ISO-Woche `key` (z. B.
 * „2026-W38") - die KEHRFUNKTION zu {@link isoWeekKey}:
 * `isoWeekKey(wochenStartFuerSchluessel(key)) === key` für jeden gültigen
 * Schlüssel. `undefined` bei einem kaputten Schlüssel - nie eine
 * Wochengrenze aus Unfug.
 *
 * Rechnet nach demselben Verfahren wie {@link isoWeekKey} selbst (der 4.
 * Januar liegt immer in KW1), nur rückwärts: erst der Montag der KW1 dieses
 * Jahres, dann `(woche - 1)` Wochen weiter. Gebraucht, um den Zielverlauf
 * eines Kindes (der nur Wochenschlüssel kennt) mit den Übungs-Ereignissen
 * (die nur Zeitpunkte kennen) zusammenzubringen - siehe
 * {@link wochenzielGeschichte}.
 */
export function wochenStartFuerSchluessel(key: string): number | undefined {
  const m = /^(\d{4})-W(\d{2})$/.exec(key);
  if (!m) return undefined;
  const jahr = Number(m[1]);
  const woche = Number(m[2]);
  const jan4 = new Date(jahr, 0, 4);
  const jan4Wochentag = (jan4.getDay() + 6) % 7; // Mo=0…So=6
  const montag = new Date(jahr, 0, 4 - jan4Wochentag + (woche - 1) * 7);
  montag.setHours(8, 0, 0, 0); // WOCHENZIEL_GRENZE: Montag 08:00
  return montag.getTime();
}

/**
 * ★★★ DER VOLLE WOCHEN-BERICHT EINES KINDES - vom ERSTEN Abschnitt seines
 * Zielverlaufs (davor ist jedes Ziel 0, siehe Kopf-Kommentar „Der ÜBERGANG
 * von den alten Feldern") bis EINSCHLIESSLICH der laufenden Woche um
 * `jetztMs`.
 *
 * `mindestens` deckt eine vor- oder zurückgeblätterte Woche ab, die sonst
 * ausserhalb dieses Bereichs läge (eine Woche vor dem ersten Abschnitt, oder
 * eine Woche nach der laufenden) - der Bericht wird dafür einfach weiter
 * gespannt, nie ein zweites Mal gerechnet.
 *
 * `[]`, wenn der Verlauf leer ist - dann gibt es nichts zu berichten, und
 * jeder Aufrufer behandelt das wie „kein Wochenziel gesetzt".
 *
 * ★ EINE Quelle für „Woche" UND „Schuljahr/Gesamt" (`wochenzielZeitraum.ts`)
 * UND die Jahreskarte (`jahreskarte.ts`) UND „Meine Statistik"
 * (`WeeklyGoalStats.tsx`) - alle vier fragen hier, keiner rechnet nach.
 */
export function wochenzielGeschichte(
  events: readonly TaskEvent[],
  ziel: KindWochenziel,
  jetztMs: number,
  gesperrt: readonly GesperrteZeit[] = [],
  mindestens?: number,
): WochenErgebnis[] {
  if (ziel.verlauf.length === 0) return [];
  const abschnittsMs = ziel.verlauf
    .map((a) => wochenStartFuerSchluessel(a.ab))
    .filter((ms): ms is number => ms !== undefined);
  const laufendeWoche = wochenStart(jetztMs, WOCHENZIEL_GRENZE);
  let von = abschnittsMs.length > 0 ? Math.min(...abschnittsMs) : laufendeWoche;
  let bis = laufendeWoche;
  if (mindestens !== undefined) {
    von = Math.min(von, mindestens);
    bis = Math.max(bis, mindestens);
  }
  return wochenzielVerlauf(events, ziel, von, bis, gesperrt);
}
