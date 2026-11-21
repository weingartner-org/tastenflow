/**
 * ════════════════════════════════════════════════════════════════════════════
 * E4: DIE ÜBUNGSZEITEN EINER PERSON, JE WOCHE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes am 18.09.2026 zur aufgeklappten Zeile bei der Lehrkraft (Auftrag):
 *
 *   „Bei der Ausklappübersicht der einzelnen Schüler kommt viel zu viel …
 *    Übungszeiten (hier brauchen wir auch einen Zähler, ob und wie viele
 *    Klassenmatches absolviert wurden - kommt in einer späteren Etappe, NICHT
 *    jetzt)"
 *
 * Der erste Entwurf dieser Datei gruppierte nach der UNTERRICHTS-PERIODE der
 * Klasse (`Wochenrhythmus`, „bis zur nächsten Stunde"). Dieselbe Nacht hat den
 * Unterrichtstag/-ende der Klasse ABGESCHAFFT (Bauplan §„W · Wochenziel neu",
 * Johannes: *„davon im Unterricht können wir ja nicht erfassen, weil die ganze
 * Unterrichtseinheit wegfällt"*) - eine eigene „Unterrichtsperiode" gibt es
 * seither nicht mehr zu gruppieren. Diese Datei zählt darum nach derselben
 * WOCHE wie das Wochenziel: Montag 08:00 bis zum nächsten Montag 08:00
 * ({@link WOCHENZIEL_GRENZE} aus `wochenziel.ts`) - für JEDE Klasse gleich,
 * ohne Sonderfall.
 *
 * ★★★ DIESELBE WOCHENGRENZE WIE DAS WOCHENZIEL - KEINE ZWEITE RECHNUNG
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]). Die Übezeit je
 * Kalendertag kommt aus {@link buildDayPractice} (`goals.ts`) - derselben
 * Quelle, aus der auch die Spalte „Übezeit" der Klassentabelle ihre Zahl holt
 * (`activeMs`, bei Alt-Ereignissen `ms`); {@link wochenStartFuerTag} mit
 * {@link WOCHENZIEL_GRENZE} teilt den Montag selbst genau so in einen
 * 00:00-Bucket (endende Woche) und einen 08:00-Bucket (neue Woche), wie
 * `wochenziel.ts` es für die Wochenziel-Rechnung selbst tut. Diese Datei
 * erfindet keine dritte Rechnung, sie GRUPPIERT nur, was die anderen beiden
 * schon liefern.
 *
 * Nur Wochen MIT Übung erscheinen in der Liste, die {@link uebungsperioden}
 * liefert - eine leere Woche ist keine Zeile wert.
 *
 * ★ Platz für später (E9, Klassenmatch-Anzahl je Woche): Die noch fehlende
 * Zahl wird ein weiteres Feld an {@link Uebungsperiode}, keine neue
 * Gruppierung - darum absichtlich KEIN Platzhaltertext hier. (E4-Recherche
 * 18.09.2026: `tt_match_verlauf`, wo die Anzahl dauerhaft läge, ist mit
 * `list/view/create/update/del: null` für JEDEN Client gesperrt - auch für die
 * Lehrkraft -, `tt_match_stand` kennt nur laufende Matches und wird eine
 * Stunde nach Ende gelöscht. Ohne den Zähl-Hook aus E9 gibt es im Browser
 * nichts zum Anzeigen.)
 *
 * ⚠️ KEIN eigenes Datum-Rechnen für „sieben Tage weiter" - siehe
 * {@link tageVerschieben}: `wochenStartMs + 7 * 86_400_000` (rohe
 * Millisekunden) träfe in der Sommer-/Winterzeit-Umstellungswoche NICHT mehr
 * denselben Uhrzeitpunkt, dieselbe Falle wie in `wochenziel.ts`
 * ({@link import("./wochenziel").WOCHENZIEL_GRENZE}s Kopf-Kommentar
 * „Minuten je Woche aus den Ereignissen"). Diese Datei braucht die Uhrzeit von
 * `bisMs` nicht (nur das Kalenderdatum für {@link fmtWochentagDatum}), aber
 * eine falsche Uhrzeit könnte trotzdem auf den falschen Kalendertag fallen -
 * darum dieselbe `setDate`-Technik wie dort.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ M3 (19.09.2026): JE WOCHE DIE EINZELNEN ÜBUNGSZEITEN
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„Bei der Ausklappliste der Übezeiten fehlen noch eine Unterliste
 * mit allen Übungszeiten genau erfasst"*. Jede Woche trägt darum ihre
 * {@link Uebungsperiode.sitzungen} - jede Übungszeit mit Beginn und Ende
 * (Wanduhr), der geübten Zeit und, wo es sich sicher sagen lässt, der
 * Übungsart ({@link uebungsartVon}).
 *
 * ★★★ KEINE ZWEITE SITZUNGS-REGEL: Welche Zeilen EINE Übungszeit bilden, sagt
 * {@link sitzungsGruppen} (`goals.ts`) - dieselbe Regel (mehr als
 * {@link SESSION_BREAK_MS} ohne Abgabe ⇒ neue Übungszeit), aus der auch
 * {@link buildDayPractice} die Wochensumme und „Einzelne Übezeiten" in
 * „Meine Statistik" ihre Liste bauen. Die geübte Zeit einer Übungszeit folgt
 * GENAU der Rechnung der Woche - darum ergeben die Übungszeiten einer Woche
 * zusammen die Zahl der Woche (Wächter `tastenflow-uebungsperioden.test.ts`):
 *  · ab dem Stichtag {@link ACTIVE_TIME_SINCE_MS}: die reine Tippzeit, und
 *    jede Zeile zählt in IHRE Woche. Läuft eine Übungszeit über die
 *    Wochengrenze (Montag 08:00), steht ihr Teil vor 08:00 in der alten, der
 *    Teil danach in der neuen Woche - genau so, wie die Woche selbst zählt.
 *  · vor dem Stichtag: die alte Wanduhr-Spanne, ganz in der Woche ihres
 *    Beginns (wie `buildDayPractice` sie ihrem Starttag zuschlägt).
 */
import {
  GOAL_CHANGE_LESSON,
  istSchreibprobe,
  istWortspiel,
  type TaskEvent,
} from "./account";
import {
  ACTIVE_TIME_SINCE_MS,
  SESSION_BREAK_MS,
  buildDayPractice,
  sitzungsGruppen,
  zeilenUebezeitMs,
} from "./goals";
import { uebungstagSchluessel, wochenStartFuerTag } from "./wochenrhythmus";
import { WOCHENZIEL_GRENZE } from "./wochenziel";
import { fmtTagMonat } from "./datum";
import { LESSON_IDS } from "./curriculum";

export interface Uebungsperiode {
  /** Beginn der Woche (Montag 08:00, {@link WOCHENZIEL_GRENZE}). */
  startMs: number;
  /**
   * Der letzte Kalendertag DIESER Woche (nicht der Beginn der nächsten) -
   * für die Anzeige „… - {@link fmtWochentagDatum}(bisMs)".
   */
  bisMs: number;
  /** Geübte Zeit dieser Woche in ms - dieselbe Größe wie überall im Haus. */
  ms: number;
  /** An wie vielen Kalendertagen dieser Woche geübt wurde. */
  tage: number;
  /**
   * ★ M3: die einzelnen Übungszeiten DIESER Woche, jüngste zuerst (wie die
   * Wochen selbst) - zusammen genau {@link Uebungsperiode.ms}, siehe Dateikopf.
   */
  sitzungen: Uebungssitzung[];
}

/**
 * ★ M3: Was in einer Übungszeit geübt wurde - abgelesen an der Kennung der
 * Zeile (`TaskEvent.lesson`), die genau EIN Bildschirm setzt:
 *  · `"adaptiv"` - „Mein Training" (`AdaptiveTrainer.tsx`)
 *  · eine Lektions-Kennung aus {@link LESSON_IDS} - die früheren „Lektionen"
 *    (bis E7, 19.09.2026; alte Zeilen tragen sie weiter)
 *  · `"serie:…"` - „Geschichten" (`SerienTrainer.tsx`)
 *  · `"form:…"` - ein Wortspiel ({@link istWortspiel})
 *  · `"schreibprobe"` - eine Tippchallenge ({@link istSchreibprobe})
 *  · `"klassenmatch"` - ein Klassenmatch (`KlassenmatchLauf.tsx`)
 *  · `"eigene-uebung"` - eine Eigene Übung (`EigeneUebungLauf.tsx`)
 *
 * Eine Kennung, die keiner davon gleicht, bekommt KEINE Art - lieber nichts
 * als geraten. Dass jede Kennung, die ein Bildschirm setzt, hier eine Art
 * findet, prüft der Wächter `tastenflow-uebungsperioden.test.ts` an den
 * Quelltexten selbst.
 */
export type Uebungsart =
  | "training"
  | "lektion"
  | "geschichte"
  | "wortspiel"
  | "tippchallenge"
  | "klassenmatch"
  | "eigene-uebung";

export function uebungsartVon(lesson: string): Uebungsart | null {
  if (lesson === "adaptiv") return "training";
  if (lesson.startsWith("serie:")) return "geschichte";
  if (istWortspiel(lesson)) return "wortspiel";
  if (istSchreibprobe(lesson)) return "tippchallenge";
  if (lesson === "klassenmatch") return "klassenmatch";
  if (lesson === "eigene-uebung") return "eigene-uebung";
  if (LESSON_IDS.includes(lesson)) return "lektion";
  return null;
}

/** ★ M3: EINE Übungszeit innerhalb einer Woche - siehe Dateikopf. */
export interface Uebungssitzung {
  /** Wanduhr: Anfang der ersten Zeile (`ts - ms`). */
  startMs: number;
  /** Wanduhr: Abgabe der letzten Zeile. */
  endMs: number;
  /** Geübte Zeit in ms - dieselbe Rechnung wie {@link Uebungsperiode.ms}. */
  ms: number;
  /** Was geübt wurde, in der Reihenfolge des ersten Vorkommens, ohne Doppelte. */
  arten: Uebungsart[];
}

/** Die Pause in Minuten, nach der eine neue Übungszeit beginnt - für Hinweise. */
export const UEBUNGSZEIT_PAUSE_MIN = Math.round(SESSION_BREAK_MS / 60_000);

/** Kalendertag-sicher (DST) `ms` um `tage` Tage verschieben - siehe Dateikopf. */
function tageVerschieben(ms: number, tage: number): number {
  const d = new Date(ms);
  d.setDate(d.getDate() + tage);
  return d.getTime();
}

/**
 * Die Übungswochen EINER Person, jüngste zuerst - nur Wochen, in denen
 * wirklich geübt wurde (siehe Dateikopf). Dieselbe Wochengrenze wie das
 * Wochenziel ({@link WOCHENZIEL_GRENZE}), für jede Klasse gleich.
 */
export function uebungsperioden(events: readonly TaskEvent[]): Uebungsperiode[] {
  const tage = buildDayPractice(
    events.filter((e) => e.lesson !== GOAL_CHANGE_LESSON),
    WOCHENZIEL_GRENZE,
  );
  const eimer = new Map<number, { minuten: number; tage: number }>();
  for (const [tagSchluessel, praxis] of tage) {
    if (praxis.minutes <= 0) continue;
    const start = wochenStartFuerTag(tagSchluessel, WOCHENZIEL_GRENZE);
    const bucket = eimer.get(start) ?? { minuten: 0, tage: 0 };
    bucket.minuten += praxis.minutes;
    bucket.tage += 1;
    eimer.set(start, bucket);
  }
  const sitzungen = sitzungenJeWoche(events);
  return [...eimer.entries()]
    .map(([startMs, w]) => ({
      startMs,
      bisMs: tageVerschieben(startMs, 6),
      ms: Math.round(w.minuten * 60_000),
      tage: w.tage,
      sitzungen: sitzungen.get(startMs) ?? [],
    }))
    .sort((a, b) => b.startMs - a.startMs);
}

/** Die Woche (Montag 08:00), in die ein Zeitpunkt zählt - wie in {@link uebungsperioden}. */
function wocheVon(ms: number): number {
  return wochenStartFuerTag(uebungstagSchluessel(ms, WOCHENZIEL_GRENZE), WOCHENZIEL_GRENZE);
}

function artenVon(events: readonly TaskEvent[]): Uebungsart[] {
  const arten: Uebungsart[] = [];
  for (const e of events) {
    const art = uebungsartVon(e.lesson);
    if (art && !arten.includes(art)) arten.push(art);
  }
  return arten;
}

/**
 * ★ M3: die Übungszeiten je Woche (Schlüssel = Montag 08:00) - aus
 * {@link sitzungsGruppen}, mit GENAU der Zuordnung, die {@link buildDayPractice}
 * für die Wochensumme trifft (siehe Dateikopf). Übungszeiten ohne geübte Zeit
 * bleiben weg - wie eine Woche ohne Übung.
 */
function sitzungenJeWoche(events: readonly TaskEvent[]): Map<number, Uebungssitzung[]> {
  const out = new Map<number, Uebungssitzung[]>();
  const ablegen = (woche: number, s: Uebungssitzung) => {
    if (s.ms <= 0) return;
    const liste = out.get(woche) ?? [];
    liste.push(s);
    out.set(woche, liste);
  };
  for (const g of sitzungsGruppen(events)) {
    if (g.startMs < ACTIVE_TIME_SINCE_MS) {
      // Alte Regel: die ganze Wanduhr-Spanne, in der Woche ihres Beginns.
      ablegen(wocheVon(g.startMs), {
        startMs: g.startMs,
        endMs: g.endMs,
        ms: g.endMs - g.startMs,
        arten: artenVon(g.events),
      });
      continue;
    }
    // Ab dem Stichtag: jede Zeile in IHRE Woche - über die Wochengrenze
    // hinweg wird die Übungszeit geteilt.
    let teil: TaskEvent[] = [];
    let teilWoche = Number.NaN;
    const teilAblegen = () => {
      if (teil.length === 0) return;
      let ms = 0;
      let endMs = 0;
      for (const e of teil) {
        ms += zeilenUebezeitMs(e);
        endMs = Math.max(endMs, e.ts);
      }
      ablegen(teilWoche, {
        startMs: teil[0].ts - Math.max(0, teil[0].ms),
        endMs,
        ms,
        arten: artenVon(teil),
      });
    };
    for (const e of g.events) {
      const woche = wocheVon(e.ts);
      if (woche !== teilWoche) {
        teilAblegen();
        teil = [];
        teilWoche = woche;
      }
      teil.push(e);
    }
    teilAblegen();
  }
  for (const liste of out.values()) liste.sort((a, b) => b.startMs - a.startMs);
  return out;
}

/** „Do 11.09." - Wochentag (kurz, ohne Punkt) + Tag/Monat. */
const WOCHENTAG_KURZ = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] as const;
export function fmtWochentagDatum(ms: number): string {
  return `${WOCHENTAG_KURZ[(new Date(ms).getDay() + 6) % 7]} ${fmtTagMonat(ms)}`;
}
