/**
 * ════════════════════════════════════════════════════════════════════════════
 * DIE JAHRESKARTE - Werte, keine Note (N4, 01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ★★★ Johannes am 31.08.2026, wörtlich:
 *
 *     „das sind Werte, auf die ein Lehrer dann seine Note bauen kann,
 *      nicht die App!"
 *
 * Dieses Modul rechnet darum drei Werte und ihre Herkunft - und nichts
 * darüber hinaus. Es gibt keine Gesamtzahl, keine Punkte, keine Einstufung.
 * Die Zeile „Grundlage: 148 Übungsblöcke an 62 Tagen, 19 Std. 40 Min. geübt"
 * ist deshalb kein Beiwerk: Sie ist der Teil, der die drei Zahlen überhaupt
 * beurteilbar macht.
 *
 * ── Die drei Werte ─────────────────────────────────────────────────────────
 *   Geschwindigkeit   215 Anschläge/Min       um 4 gesteigert
 *   Treffsicherheit   96 %                    um 2 % gesteigert
 *   Wochenaufgaben    87 % der Wochenaufgaben erledigt
 *
 * ★ F18: „um 4 gesteigert" sind 4 ANSCHLÄGE, keine Prozent (211 → 215).
 *   Bei der Treffsicherheit sind es Prozentpunkte - dort ist die Einheit
 *   ohnehin das Prozent.
 *
 * ★ 4.7a: Die Wochenaufgaben werden EINZELN (nach Minuten) gezählt, nicht
 *   wochenweise. Wörtlich: „wenn ein Schüler immer 2 von 3 Aufgaben in der
 *   Woche macht, bekommt er den gleichen Wert wie einer, der nichts macht."
 *   Das war ein Fehler im Modell, kein Anzeigewunsch. Seit W3a (18.09.2026)
 *   rechnet das `wochenziel.ts` (`erfuellungProzent`, siehe
 *   {@link wochenaufgabenAus}) auf dem Minuten-Modell - hier wird nur noch
 *   benutzt, was dort schon stimmt.
 *
 * ── Der Ausgangspunkt (F19/F21) ────────────────────────────────────────────
 * Nicht der 1. August und nicht die erste Woche der einzelnen Person, sondern
 * die **Startwoche der Klasse**: die erste Kalenderwoche des Schuljahres, in
 * der MINDESTENS DIE HÄLFTE der Klasse geübt hat. Wörtlich: *„damit die
 * Ferienarbeiter nicht den Start auslösen"*.
 *
 * ⚠️ Wer später dazukommt, bekommt die SPÄTERE der beiden Wochen (Klassen-
 * Startwoche oder eigene erste Woche mit Daten) - sonst stünde bei ihr eine
 * Steigerung, die sie nie erlebt hat.
 *
 * ⚠️ Ohne Klasse (selbstlernendes Konto) gilt die eigene erste Woche mit Daten.
 *
 * ⚠️ Solange keine Woche die Schwelle erreicht, gibt es KEINE Steigerung.
 * `startwoche` ist dann `null`, und die Karte sagt das hin, statt eine Zahl
 * aus einer einzigen Ferienwoche zu zeigen.
 *
 * ── Der Bezugspunkt (F13) ──────────────────────────────────────────────────
 * Zwei Möglichkeiten, umschaltbar, Grundstellung **Vorwoche**:
 *   `"vorwoche"`  - gegenüber der letzten abgeschlossenen Woche
 *   `"start"`     - gegenüber der Startwoche (Schuljahresbeginn der Klasse)
 * Der Umschalter steht neben der Zahl und sagt, worauf sich die Angabe
 * bezieht - eine Steigerung ohne Bezugspunkt ist keine Auskunft.
 *
 * ── Das Schuljahr (F14, seit D2 je Klasse) ─────────────────────────────────
 * Bis D2 (28.09.2026) fest 1. August bis 31. Juli. Seither beginnt es am
 * Ersten des Monats, den die Klasse eingestellt hat
 * (`settings.schuljahrBeginn`, `schuljahrBeginn.ts`) - ohne Angabe weiter am
 * 1. August, Byte für Byte wie vorher.
 */
import type { Lang, TaskEvent } from "./account";
import { isoWeekKey, startOfWeek } from "./goals";
import { zeilenTempoPlausibel } from "./zeilenzeit";
import { wochenStart } from "./wochenrhythmus";
import { SCHULJAHR_BEGINN_VORGABE, schuljahrBeginnOderVorgabe } from "./schuljahrBeginn";
import {
  WOCHENZIEL_GRENZE,
  erfuellungProzent,
  kindWochenzielAusFeldern,
  wochenzielGeschichte,
  type GesperrteZeit,
  type KindWochenzielFelder,
} from "./wochenziel";

export interface Schuljahr {
  /** Der Erste des Beginn-Monats (Vorgabe 1. August), 00:00 Ortszeit. */
  vonMs: number;
  /** Der letzte Tag vor dem nächsten Beginn, 23:59:59.999. */
  bisMs: number;
  /** „2026/27" - oder „2027" bei einem Beginn im Januar bis März. */
  label: string;
}

/**
 * Das Schuljahr, in dem `nowMs` liegt.
 *
 * ★ D2 (28.09.2026): `beginnMonat` (1-12) ist der Monat, in dem das Schuljahr
 * der Klasse beginnt ({@link schuljahrBeginnVon}). Ohne Angabe - und bei einem
 * ungültigen Wert - der August wie seit F14.
 *
 * ★ Der Name: Ein Schuljahr, das im Januar, Februar oder März beginnt, liegt
 * fast ganz in EINEM Kalenderjahr und heisst dort auch so („año escolar
 * 2027", Cono Sur, Mittelamerika, Kolumbien). Ab April heisst es wie bisher
 * „2026/27" (Ecuador Costa sagt „2026-2027").
 */
export function schuljahrVon(
  nowMs: number,
  beginnMonat: number = SCHULJAHR_BEGINN_VORGABE,
): Schuljahr {
  const start0 = schuljahrBeginnOderVorgabe(beginnMonat) - 1;
  const d = new Date(nowMs);
  const jahr = d.getMonth() >= start0 ? d.getFullYear() : d.getFullYear() - 1;
  const von = new Date(jahr, start0, 1, 0, 0, 0, 0);
  const bis = new Date(jahr + 1, start0, 1, 0, 0, 0, 0);
  return {
    vonMs: von.getTime(),
    bisMs: bis.getTime() - 1,
    label: start0 <= 2 ? String(jahr) : `${jahr}/${String((jahr + 1) % 100).padStart(2, "0")}`,
  };
}

/** Die Kalenderwochen (ISO-Schlüssel), in denen diese Person geübt hat. */
export function wochenMitUebung(
  events: readonly TaskEvent[],
  schuljahr: Schuljahr,
): Set<string> {
  const wochen = new Set<string>();
  for (const e of events) {
    if (e.ts < schuljahr.vonMs || e.ts > schuljahr.bisMs) continue;
    // Marker-Ereignisse sind keine Übung - sie tragen keine Zeichen.
    if (e.chars <= 0) continue;
    wochen.add(isoWeekKey(e.ts));
  }
  return wochen;
}

export interface Startwoche {
  /** ISO-Schlüssel der Woche, z. B. „2026-W37". */
  key: string;
  /** Montag dieser Woche, 00:00. */
  startMs: number;
  /** Wie viele der Klasse in dieser Woche geübt haben. */
  aktive: number;
  /** Wie viele es mindestens sein mussten (die Hälfte, aufgerundet). */
  schwelle: number;
}

/**
 * ★★ DIE STARTWOCHE DER KLASSE (F19/F21).
 *
 * Die erste Kalenderwoche des Schuljahres, in der mindestens die HÄLFTE der
 * Klasse geübt hat. Bei 24 Lernenden also ab 12, bei 6 ab 3.
 *
 * `null`, solange keine Woche die Schwelle erreicht - die Karte sagt dann
 * „Ausgangswert wird gesetzt, sobald die Klasse begonnen hat."
 *
 * ⚠️ Eine LEERE Klasse hat keine Startwoche. Ohne diese Zeile wäre die
 * Schwelle 0, jede beliebige Woche erreichte sie, und die erste Woche des
 * Schuljahres würde zum Ausgangspunkt erklärt - an einer Klasse ohne einen
 * einzigen Datenpunkt.
 */
export function klassenStartwoche(
  eventsJePerson: readonly (readonly TaskEvent[])[],
  schuljahr: Schuljahr,
): Startwoche | null {
  if (eventsJePerson.length === 0) return null;
  const schwelle = Math.ceil(eventsJePerson.length / 2);
  const zaehler = new Map<string, number>();
  for (const events of eventsJePerson)
    for (const woche of wochenMitUebung(events, schuljahr))
      zaehler.set(woche, (zaehler.get(woche) ?? 0) + 1);

  const kandidaten = [...zaehler.entries()]
    .filter(([, n]) => n >= schwelle)
    .sort(([a], [b]) => a.localeCompare(b));
  if (kandidaten.length === 0) return null;
  const [key, aktive] = kandidaten[0];
  return { key, startMs: montagDerWoche(key, eventsJePerson, schuljahr), aktive, schwelle };
}

/**
 * Der Montag einer Woche, ermittelt an einem Ereignis DARIN. Ein ISO-Schlüssel
 * allein („2026-W37") lässt sich ohne Kalenderrechnung nicht zurückverwandeln;
 * ein Zeitstempel aus der Woche genügt und ist immer vorhanden - die Woche
 * kommt ja aus den Ereignissen.
 */
function montagDerWoche(
  key: string,
  eventsJePerson: readonly (readonly TaskEvent[])[],
  schuljahr: Schuljahr,
): number {
  for (const events of eventsJePerson)
    for (const e of events)
      if (
        e.ts >= schuljahr.vonMs &&
        e.ts <= schuljahr.bisMs &&
        e.chars > 0 &&
        isoWeekKey(e.ts) === key
      )
        return startOfWeek(e.ts);
  return schuljahr.vonMs;
}

/** Ein Wochenwert: Tempo und Treffsicherheit einer einzelnen Woche. */
export interface Wochenwert {
  key: string;
  startMs: number;
  /** ⌀ Anschläge je Minute in dieser Woche. */
  cpm: number;
  /** Treffsicherheit 0..1. */
  genauigkeit: number;
  /** Abgeschlossene Übungszeilen - ohne sie ist der Wert keine Messung. */
  zeilen: number;
}

/** Tempo und Treffsicherheit, Woche für Woche - im Schuljahr, chronologisch. */
export function wochenwerte(
  events: readonly TaskEvent[],
  schuljahr: Schuljahr,
): Wochenwert[] {
  // ★ 18.09.2026 (Bauplan F1b): Tempo nur aus plausiblen Zeilen
  // (`zeilenTempoPlausibel`) - eine über Nacht offene Zeile (29 Std.) drückte
  // sonst eine ganze Woche nach unten. Die Treffsicherheit zählt weiter ALLE.
  const nach = new Map<
    string,
    { chars: number; errors: number; tempoChars: number; ms: number; n: number; startMs: number }
  >();
  for (const e of events) {
    if (e.ts < schuljahr.vonMs || e.ts > schuljahr.bisMs) continue;
    if (e.chars <= 0 || e.ms <= 0) continue;
    const k = isoWeekKey(e.ts);
    const t =
      nach.get(k) ?? { chars: 0, errors: 0, tempoChars: 0, ms: 0, n: 0, startMs: startOfWeek(e.ts) };
    t.chars += e.chars;
    t.errors += e.errors;
    if (zeilenTempoPlausibel(e)) {
      t.tempoChars += e.chars;
      t.ms += e.ms;
    }
    t.n += 1;
    nach.set(k, t);
  }
  return [...nach.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, t]) => ({
      key,
      startMs: t.startMs,
      cpm: t.ms > 0 ? (t.tempoChars / t.ms) * 60000 : 0,
      // Dieselbe Rechnung wie `computePupilStats`: Treffer geteilt durch Soll.
      genauigkeit: t.chars > 0 ? Math.max(0, (t.chars - t.errors) / t.chars) : 0,
      zeilen: t.n,
    }));
}

/** Worauf sich die Steigerung bezieht (F13). Grundstellung: Vorwoche. */
export type Bezug = "vorwoche" | "start";

export interface Wert {
  /** Der aktuelle Stand - die Zahl, die gross dasteht. */
  jetzt: number;
  /**
   * Die Steigerung gegenüber dem Bezugspunkt, in DERSELBEN Einheit wie
   * `jetzt`: Anschläge bei der Geschwindigkeit (F18), Prozentpunkte bei der
   * Treffsicherheit. `null` = kein Bezugspunkt vorhanden, also keine Aussage.
   */
  steigerung: number | null;
  /** Der Wert am Bezugspunkt selbst - damit „211 → 215" nachvollziehbar ist. */
  vorher: number | null;
}

export interface Jahreskarte {
  schuljahr: Schuljahr;
  /** Startwoche der Klasse - `null`, solange die Schwelle nicht erreicht ist. */
  startwoche: Startwoche | null;
  /**
   * Der tatsächlich benutzte Ausgangspunkt DIESER Person: die SPÄTERE aus
   * Klassen-Startwoche und eigener erster Woche mit Daten.
   */
  ausgangswoche: Wochenwert | null;
  bezug: Bezug;
  geschwindigkeit: Wert;
  treffsicherheit: Wert;
  /** ★ W3a (18.09.2026): Minuten und Prozent statt Einheiten - siehe {@link Wochenaufgaben}. */
  aufgaben: Wochenaufgaben;
  /** Für die Zeile „Grundlage: …". */
  grundlage: { bloecke: number; tage: number; ms: number };
}

/**
 * ★★★ W3a (18.09.2026): „Wochenaufgaben" auf dem neuen Minuten-Modell
 * (`wochenziel.ts`) statt der alten Einheiten - Bauplan §7g, Johannes: „es
 * kann dann ja in % ausgegeben werden: Kind A hat 87 % der Wochenaufgaben
 * erledigt." Gezählt wird - wie schon bei der alten `aufgaben.soll/erledigt`
 * - über die GANZE Geschichte des Kindes (nicht nur das laufende Schuljahr,
 * obwohl die Karte darüber „Schuljahr" heisst; das war schon vor diesem
 * Umbau so, siehe {@link wochenzielGeschichte} ohne Zeitraum-Grenze).
 */
export interface Wochenaufgaben {
  /** Ist überhaupt (irgendwann) ein Wochenziel gesetzt? */
  aktiv: boolean;
  /** Σ erfüllt ÷ Σ Ziel über alle ABGESCHLOSSENEN Ziel-Wochen. `null` ohne eine einzige. */
  anteil: number | null;
  minutenErfuellt: number;
  minutenZiel: number;
  /** Wie viele der abgeschlossenen Ziel-Wochen GANZ erfüllt waren. */
  wochenGanz: number;
  /** Wie viele abgeschlossene Ziel-Wochen es überhaupt gab. */
  wochenGesamt: number;
}

const LEERE_WOCHENAUFGABEN: Wochenaufgaben = {
  aktiv: false,
  anteil: null,
  minutenErfuellt: 0,
  minutenZiel: 0,
  wochenGanz: 0,
  wochenGesamt: 0,
};

/**
 * {@link Wochenaufgaben} aus den Rohfeldern eines Kindes UND der Klasse
 * (`gesperrt`) - dieselbe Quelle wie die Spalte „Wochenziel" der Tabelle
 * (`wochenzielZeitraum.ts`), hier über die GANZE Geschichte statt eines
 * Zeitraums.
 */
function wochenaufgabenAus(
  events: readonly TaskEvent[],
  felder: KindWochenzielFelder,
  gesperrt: readonly GesperrteZeit[],
  nowMs: number,
): Wochenaufgaben {
  const ziel = kindWochenzielAusFeldern(felder);
  if (ziel.verlauf.length === 0) return LEERE_WOCHENAUFGABEN;
  const laufendeWoche = wochenStart(nowMs, WOCHENZIEL_GRENZE);
  const bericht = wochenzielGeschichte(events, ziel, nowMs, gesperrt);
  // ⚠️ Die laufende Woche zählt nicht mit - sie ist noch nicht vorbei
  // ([[feedback_nie_gegen_das_kind]]), genau wie in `wochenzielImZeitraum`.
  const zielwochen = bericht.filter((w) => w.zielwoche && w.startMs < laufendeWoche);
  if (zielwochen.length === 0) return { ...LEERE_WOCHENAUFGABEN, aktiv: true };
  return {
    aktiv: true,
    anteil: erfuellungProzent(zielwochen),
    minutenErfuellt: zielwochen.reduce((sum, w) => sum + w.erfuellt, 0),
    minutenZiel: zielwochen.reduce((sum, w) => sum + w.ziel, 0),
    wochenGanz: zielwochen.filter((w) => w.offen === 0).length,
    wochenGesamt: zielwochen.length,
  };
}

export interface JahreskarteOptionen {
  goalMinutes?: number;
  goalUnits?: number;
  goalWeeks?: string[];
  goalCatchUp?: boolean;
  goalResetWeek?: string;
  /** Einzeln erlassene Wochen (Befund 16.09.2026) - zählen nie als versäumt. */
  goalExcusedWeeks?: string[];
  /** ★ W3a: der neue Wochenziel-Verlauf (`wochenziel.ts`) - siehe {@link Wochenaufgaben}. */
  wochenzielVerlauf?: unknown;
  /** ★ W3a: die gesperrten Zeiten der Klasse - siehe `wochenziel.ts` „Eine Stunde sperren". */
  gesperrt?: readonly GesperrteZeit[];
  bezug?: Bezug;
  /** Die Startwoche der Klasse, aus {@link klassenStartwoche}. */
  startwoche?: Startwoche | null;
  /** ★ D2: der Beginn des Schuljahres der Klasse (1-12) - ohne Angabe August. */
  schuljahrBeginn?: number;
}

/**
 * Die Jahreskarte EINER Person.
 *
 * ⚠️ Ohne Bezugspunkt bleibt `steigerung` `null` - und `null` heisst „keine
 * Aussage", nicht „0". Eine Null stünde da wie „hat sich nicht verbessert";
 * das wäre eine Behauptung über ein Kind, für die es keine Messung gibt
 * ([[feedback_nie_gegen_das_kind]]).
 */
export function jahreskarte(
  events: readonly TaskEvent[],
  nowMs: number,
  opts: JahreskarteOptionen = {},
): Jahreskarte {
  const sj = schuljahrVon(nowMs, opts.schuljahrBeginn);
  const bezug: Bezug = opts.bezug ?? "vorwoche";
  const wochen = wochenwerte(events, sj);
  const aktuelleWoche = isoWeekKey(nowMs);

  // Der eigene Ausgangspunkt: die SPÄTERE aus Klassen-Startwoche und eigener
  // erster Woche mit Daten (F19, „wer später dazukommt").
  const eigeneErste = wochen[0] ?? null;
  const klassenKey = opts.startwoche?.key ?? null;
  const ausgangswoche =
    eigeneErste === null
      ? null
      : klassenKey === null
        ? eigeneErste
        : (wochen.find((w) => w.key >= klassenKey) ?? null);

  // Die letzte ABGESCHLOSSENE Woche - die laufende ist noch keine Vorwoche.
  const vorwoche = [...wochen].reverse().find((w) => w.key < aktuelleWoche) ?? null;
  const jetztWoche = wochen.find((w) => w.key === aktuelleWoche) ?? vorwoche;
  /*
   * ⚠️ `jetzt` ist „diese Woche, sonst die letzte abgeschlossene MIT DATEN" -
   * für EINE Person richtig (am Montagmorgen hat noch niemand geübt). Der
   * Rückgriff hat keine Grenze. Bis K3 (19.09.2026) stand darum hier das Feld
   * `jetztAktuell` für den Klassen-Mittelwert (A3, 11.09.); der Überblick der
   * Klasse rechnet seither je Zeitraum (`klassenueberblick.ts`) und braucht
   * es nicht mehr.
   */

  const bezugsWoche = bezug === "start" ? ausgangswoche : vorwoche;
  // Ein Bezugspunkt, der die aktuelle Woche SELBST ist, sagt nichts aus.
  const gueltig = bezugsWoche && jetztWoche && bezugsWoche.key !== jetztWoche.key;

  const tempoJetzt = jetztWoche ? Math.round(jetztWoche.cpm) : 0;
  const genauJetzt = jetztWoche ? jetztWoche.genauigkeit : 0;

  return {
    schuljahr: sj,
    startwoche: opts.startwoche ?? null,
    ausgangswoche,
    bezug,
    geschwindigkeit: {
      jetzt: tempoJetzt,
      // ★ F18: ANSCHLÄGE, keine Prozent.
      steigerung: gueltig ? tempoJetzt - Math.round(bezugsWoche!.cpm) : null,
      vorher: gueltig ? Math.round(bezugsWoche!.cpm) : null,
    },
    treffsicherheit: {
      jetzt: genauJetzt,
      // Prozentpunkte - dort ist die Einheit ohnehin das Prozent.
      steigerung: gueltig
        ? Math.round((genauJetzt - bezugsWoche!.genauigkeit) * 100)
        : null,
      vorher: gueltig ? bezugsWoche!.genauigkeit : null,
    },
    aufgaben: wochenaufgabenAus(events, opts, opts.gesperrt ?? [], nowMs),
    grundlage: grundlageAus(events, sj),
  };
}

/** Übungsblöcke, Tage und geübte Zeit im Schuljahr. */
function grundlageAus(
  events: readonly TaskEvent[],
  sj: Schuljahr,
): { bloecke: number; tage: number; ms: number } {
  const tage = new Set<string>();
  let bloecke = 0;
  let ms = 0;
  for (const e of events) {
    if (e.ts < sj.vonMs || e.ts > sj.bisMs) continue;
    if (e.chars <= 0) continue;
    bloecke += 1;
    ms += e.activeMs ?? e.ms;
    const d = new Date(e.ts);
    tage.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  return { bloecke, tage: tage.size, ms };
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ VIER TÖPFE FÜR DEN SCORE (B1, 11.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Bis dahin standen hier die Töpfe der TREFFSICHERHEIT (unter 85 % · 85-92 % ·
 * 92-96 % · über 96 %). Die Punktleiste zeigt seit diesem Umbau den Score, und
 * zwei Massstäbe unter einer Leiste wären eine falsche Auskunft: 92 heisst beim
 * Score etwas ganz anderes als 92 % Treffsicherheit.
 *
 * ── Woher die Grenzen kommen (aus der Formel gerechnet, nicht geraten) ──────
 * Der Score ist `100 × Güte × Wurzel(Tempo/240)` (`schreibprobeWertung.ts`).
 * Eingesetzt, was in einer Klasse wirklich vorkommt:
 *
 *   | Treffsicherheit | Tempo | Güte  | Tempo-Anteil | Score |
 *   |---|---|---|---|---|
 *   | 95 %  |  60 | 0,80 | 0,50 | **40** ← Anfang, erste Wochen
 *   | 95 %  | 120 | 0,80 | 0,71 | **57**
 *   | 98 %  | 150 | 0,91 | 0,79 | **72**
 *   | 98 %  | 180 | 0,91 | 0,87 | **79**
 *   | 99 %  | 240 | 0,95 | 1,00 | **95** ← sehr weit, selten
 *
 * Daraus die vier Töpfe: **unter 50** ist der Anfang (die Tasten sitzen noch
 * nicht), **50-70** der gewöhnliche Verlauf eines Schuljahres, **70-85** sicher
 * und flüssig, **über 85** aussergewöhnlich. Die Grenzen liegen damit dort, wo
 * die Klasse sich wirklich verteilt - vier Töpfe, von denen drei immer leer
 * sind, wären kein Überblick.
 *
 * ⚠️ Kein Topf heisst „schlecht". Ein Topf sagt, wo jemand STEHT, und der
 * unterste ist der, in dem jedes Kind anfängt ([[feedback_nie_gegen_das_kind]]).
 */
export const SCORE_TOEPFE: readonly {
  bis: number;
  label: string;
  labelEn: string;
  labelFr: string;
  /** ★ ES-O (27.09.2026): spanisch. */
  labelEs: string;
  /** ★ O-IT (02.10.2026): italienisch. */
  labelIt: string;
  /** ★ O-PL (02.10.2026): polnisch. */
  labelPl: string;
  /** ★ O-TR (02.10.2026): türkisch - "50 altı", "85 üstü" (keine Endung an der Zahl, Glossar Regel 6). */
  labelTr: string;
  /** ★ O-CS (03.10.2026): tschechisch - „pod 50", „nad 85" (pod/nad ändern sich vor keiner Zahl). */
  labelCs: string;
  labelBg: string;
  labelEl: string;
  labelHu: string;
  labelNl: string;
  labelPt: string;
  labelBr: string;
  labelRo: string;
  labelSv: string;
  labelUk: string;
}[] = [
  { bis: 50, label: "unter 50", labelEn: "under 50", labelFr: "moins de 50", labelEs: "menos de 50", labelIt: "meno di 50", labelPl: "poniżej 50", labelTr: "50 altı", labelCs: "pod 50", labelBg: "под 50", labelEl: "κάτω από 50", labelHu: "50 alatt", labelNl: "onder 50", labelPt: "menos de 50", labelBr: "menos de 50", labelRo: "sub 50", labelSv: "under 50", labelUk: "до 50" },
  { bis: 70, label: "50-70", labelEn: "50-70", labelFr: "50-70", labelEs: "50-70", labelIt: "50-70", labelPl: "50-70", labelTr: "50-70", labelCs: "50-70", labelBg: "50-70", labelEl: "50-70", labelHu: "50-70", labelNl: "50-70", labelPt: "50-70", labelBr: "50-70", labelRo: "50-70", labelSv: "50-70", labelUk: "50-70" },
  { bis: 85, label: "70-85", labelEn: "70-85", labelFr: "70-85", labelEs: "70-85", labelIt: "70-85", labelPl: "70-85", labelTr: "70-85", labelCs: "70-85", labelBg: "70-85", labelEl: "70-85", labelHu: "70-85", labelNl: "70-85", labelPt: "70-85", labelBr: "70-85", labelRo: "70-85", labelSv: "70-85", labelUk: "70-85" },
  { bis: Infinity, label: "über 85", labelEn: "over 85", labelFr: "plus de 85", labelEs: "más de 85", labelIt: "più di 85", labelPl: "powyżej 85", labelTr: "85 üstü", labelCs: "nad 85", labelBg: "над 85", labelEl: "πάνω από 85", labelHu: "85 felett", labelNl: "boven 85", labelPt: "mais de 85", labelBr: "mais de 85", labelRo: "peste 85", labelSv: "över 85", labelUk: "понад 85" },
];

/**
 * Die Beschriftung eines Topfes in der Bedienungssprache (EN3, 19.09.2026;
 * „fr" seit E11a-2, Weichen-Zähler §2.3) - ohne Angabe Deutsch, also genau
 * `label`.
 */
export function topfLabel(i: number, sprache: Lang = "de"): string {
  const t = SCORE_TOEPFE[i];
  if (!t) return "";
  // ★ O2-LIB (30.10.2026): die neun Sprachen des Gerüsts mit eigener Beschriftung - nie Englisch, nie Deutsch.
  const s = sprache;
  if (s === "bg") return t.labelBg;
  if (s === "el") return t.labelEl;
  if (s === "hu") return t.labelHu;
  if (s === "nl") return t.labelNl;
  if (s === "pt") return t.labelPt;
  if (s === "br") return t.labelBr;
  if (s === "ro") return t.labelRo;
  if (s === "sv") return t.labelSv;
  if (s === "uk") return t.labelUk;
  if (s === "cs") return t.labelCs; // ★ O-CS (03.10.2026)
  if (s === "tr") return t.labelTr;
  if (s === "pl") return t.labelPl;
  if (s === "it") return t.labelIt;
  // ★ ES-O (27.09.2026): eigene spanische Beschriftung.
  if (s === "es") return t.labelEs;
  if (s === "en") return t.labelEn;
  if (s === "fr") return t.labelFr;
  return t.label;
}

/**
 * Die Verteilung einer Klasse auf die vier Töpfe.
 *
 * ⚠️ Der Balken ist ein BILD und braucht seinen Text daneben - die vier Zahlen
 * unter den Töpfen ersetzen ihn vollständig. Diese Funktion liefert genau
 * diese Zahlen; wer sie zeichnet, darf sie nicht weglassen.
 *
 * ⚠️ Die Werte kommen in DERSELBEN Einheit wie die Topfgrenzen herein - für
 * {@link SCORE_TOEPFE} also 0 bis 100, nicht 0 bis 1.
 */
export function verteilung(
  werte: readonly number[],
  toepfeDef: readonly { bis: number; label: string }[] = SCORE_TOEPFE,
): number[] {
  const toepfe = toepfeDef.map(() => 0);
  for (const w of werte) {
    const i = toepfeDef.findIndex((t) => w < t.bis);
    toepfe[i === -1 ? toepfeDef.length - 1 : i] += 1;
  }
  return toepfe;
}
