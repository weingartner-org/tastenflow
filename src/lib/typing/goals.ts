/**
 * Die Zeit-Grundlage des Tipptrainers „Tastenflow": Sitzungen, Tage, Wochen.
 *
 * ★★★★★ AUFGERÄUMT (19.09.2026, Bauplan §„W · Wochenziel neu"): Das
 * WOCHENZIEL selbst (Minuten je Woche, Zielverlauf, Nachholen, „Eine Stunde
 * sperren") rechnet seit W1 in `wochenziel.ts` - diese Datei liefert ihm nur
 * noch die REINE ZEIT-BUCHHALTUNG: aus welchen Ereignissen wird eine
 * Sitzung ({@link buildSessions}), wie viel wurde an einem Kalendertag geübt
 * ({@link buildDayPractice}), was zeigt die Übezeit-Uhr gerade
 * ({@link todayActiveMs}) - und die Kalenderwochen-Hilfsfunktionen
 * ({@link isoWeekKey}, {@link listSelectableWeeks}, {@link weekLabel}), die
 * auch ausserhalb des Wochenziels gebraucht werden (Jahreskarte, Excel,
 * Klassenmatch). Das alte, einheitenbasierte Wochenziel-Modell
 * (`computeWeeklyGoal`/`weeklyGoalReport`/Minuten-je-Einheit) ist mit diesem
 * Umbau ENTFERNT - alle Aufrufer sind auf `wochenziel.ts` umgestellt.
 *
 * ★ Gezählt wird nach TAG, nicht nach Sitzung (Johannes 27.07.). Maßgeblich ist
 * allein die an einem Kalendertag geübte Zeit - bei einer Unterbrechung von
 * mehr als {@link SESSION_BREAK_MS} beginnt eine neue Sitzung, aber der Tag
 * bleibt derselbe Eimer.
 *
 * Alles wird aus den vorhandenen Übungs-Ereignissen (`TaskEvent`) abgeleitet —
 * keine zusätzliche Telemetrie nötig. Reine, testbare Funktionen (now als Param).
 * Siehe [[project_zehnfinger_trainer]], [[feedback_data_transparency]].
 */
import { GOAL_CHANGE_LESSON, type Lang, type TaskEvent } from "./account";
import { itPrepTag } from "./datum";

// Standard: KEIN Wochenziel (0) — die Lehrkraft setzt es bewusst (Wunsch Johannes).
// ★ Bleiben als Vorgabewert für die ALTEN Felder `goalMinutes`/`goalUnits` -
// sie werden nicht mehr geschrieben (siehe `wochenziel.ts`), aber weiterhin
// lazy umgerechnet (`kindWochenzielAusFeldern`), solange ein Kind noch keinen
// eigenen `wochenzielVerlauf` hat.
export const DEFAULT_GOAL_MINUTES = 0;
export const DEFAULT_GOAL_UNITS = 0;

/** Lokale Mitternacht (00:00) des Tages, in dem `ts` liegt. */
function localDayStart(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Pause, ab der eine neue „Sitzung" beginnt. Kurze Lese-/Denkpausen innerhalb
 * einer Übung gehören noch zur selben Sitzung; eine echte Unterbrechung (> 30 min)
 * trennt sie. So entspricht eine Sitzung dem, was ein Kind als „einmal üben" erlebt.
 *
 * ★ M3 (19.09.2026): exportiert, weil der Hinweis an den einzelnen
 * Übungszeiten der Lehrkraft (`TastenflowReiter.tsx`) die Grenze NENNT - aus
 * dieser Zahl, nicht abgeschrieben.
 */
export const SESSION_BREAK_MS = 30 * 60_000;

/**
 * Stichtag der NEUEN (aktiven) Zeitrechnung. Sitzungen, die VOR diesem Zeitpunkt
 * begonnen haben, behalten die alte Wanduhr-Spannen-Rechnung — so bleibt alles,
 * was unter der alten Regel schon „erledigt" war, für ALLE Schüler:innen erledigt
 * (keine rückwirkende Entwertung, Wunsch Johannes). Erst ab diesem Zeitpunkt zählt
 * die reine Tippzeit (`activeMs`, Pausen heraus). Bewusst auf Mitternacht des Tages
 * NACH der Umstellung gelegt, damit auch alles von heute noch die alte Regel behält.
 */
export const ACTIVE_TIME_SINCE_MS = new Date(2026, 6, 7, 0, 0, 0).getTime();

// --- Kalenderwochen (ISO 8601) -----------------------------------------------

/** ISO-Wochenschlüssel „2026-W25" für einen Zeitpunkt. */
export function isoWeekKey(ts: number): string {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  // auf den Donnerstag derselben Woche schieben (ISO: Donnerstag bestimmt das Jahr)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNo =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86_400_000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    );
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** Reine Wochennummer (1–53) eines Zeitpunkts. */
export function isoWeekNo(ts: number): number {
  return Number(isoWeekKey(ts).slice(-2));
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Kompakte Beschriftung einer Woche aus ihrem Montag, z. B. „KW 25 · 16.–22.06.". */
export function weekLabel(mondayMs: number): string {
  const mon = new Date(mondayMs);
  const sun = new Date(mondayMs);
  sun.setDate(sun.getDate() + 6); // Kalender-Tage (DST-sicher)
  const no = isoWeekNo(mondayMs);
  return `KW ${no} · ${pad2(mon.getDate())}.${pad2(mon.getMonth() + 1)}.-${pad2(
    sun.getDate(),
  )}.${pad2(sun.getMonth() + 1)}.`;
}

/**
 * ★ Dieselbe Woche englisch (EN3, 19.09.2026): „Week 38 (w/c 14 Sept)".
 *
 * Glossar §3.3: Briten kennen keine Kalenderwochen-Nummern - die Nummer bleibt
 * (sie ist dieselbe Woche wie „KW 38" in der deutschen Fassung), aber sie steht
 * nie allein: dahinter der Montag als *w/c* (week commencing, britischer
 * Schulbrauch). Das Ende der Woche braucht es damit nicht mehr.
 */
export function weekLabelEn(mondayMs: number): string {
  const mon = new Date(mondayMs);
  const tag = mon.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `Week ${isoWeekNo(mondayMs)} (w/c ${tag})`;
}

/**
 * ★ Dieselbe Woche französisch (E11a-2, 26.09.2026): „Semaine 38 (à partir du
 * 14 sept.)" - dieselbe Nummer wie „KW 38", der Montag dahinter (Glossar
 * §9.2 „à partir du", wie das englische „w/c").
 */
export function weekLabelFr(mondayMs: number): string {
  const mon = new Date(mondayMs);
  const tag = mon.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return `Semaine ${isoWeekNo(mondayMs)} (à partir du ${tag})`;
}

/** ★ ES-O (27.09.2026): dieselbe Woche spanisch - „Semana 38 (desde el 14 sept)". */
export function weekLabelEs(mondayMs: number): string {
  const mon = new Date(mondayMs);
  const tag = mon.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  return `Semana ${isoWeekNo(mondayMs)} (desde el ${tag})`;
}

/**
 * ★ O-IT (02.10.2026): dieselbe Woche italienisch - „Settimana del 14
 * settembre", OHNE Wochennummer: Kalenderwochen sind in Italien unüblich
 * (Glossar §2.6 „Zielwochen · Kalenderwoche"). Elision „dell'8 settembre".
 */
export function weekLabelIt(mondayMs: number): string {
  const mon = new Date(mondayMs);
  const tag = mon.toLocaleDateString("it-IT", { day: "numeric", month: "long" });
  return `Settimana ${itPrepTag("del", mon.getDate())}${tag}`;
}

/**
 * ★ O-PL (02.10.2026): dieselbe Woche polnisch - „Tydzień 14-20 września"
 * (Glossar §2.6/§2.10), OHNE Wochennummer (in Polen im Schulalltag unüblich).
 * Monat ausgeschrieben im Genitiv (Intl); über zwei Monate an beiden Enden:
 * „Tydzień 31 sierpnia - 6 września".
 */
export function weekLabelPl(mondayMs: number): string {
  const mon = new Date(mondayMs);
  const sun = new Date(mondayMs);
  sun.setDate(sun.getDate() + 6);
  const lang = (d: Date) => d.toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
  const gleich = mon.getMonth() === sun.getMonth() && mon.getFullYear() === sun.getFullYear();
  return gleich
    ? `Tydzień ${mon.getDate()}-${lang(sun)}`
    : `Tydzień ${lang(mon)} - ${lang(sun)}`;
}

/**
 * ★ O-TR (02.10.2026): dieselbe Woche türkisch - "14-20 Eylül haftası" (Glossar
 * §2.6/§2.10), OHNE Wochennummer (Glossar §4 Nr. 13). Monat ausgeschrieben (Intl
 * tr-TR); über zwei Monate an beiden Enden: "31 Ağustos - 6 Eylül haftası".
 * Die Endung steht an "hafta", nie an einer Zahl (Glossar Regel 6).
 */
export function weekLabelTr(mondayMs: number): string {
  const mon = new Date(mondayMs);
  const sun = new Date(mondayMs);
  sun.setDate(sun.getDate() + 6);
  const lang = (d: Date) => d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
  const gleich = mon.getMonth() === sun.getMonth() && mon.getFullYear() === sun.getFullYear();
  return gleich
    ? `${mon.getDate()}-${lang(sun)} haftası`
    : `${lang(mon)} - ${lang(sun)} haftası`;
}

/**
 * ★ O-CS (03.10.2026): dieselbe Woche tschechisch - „Týden 14.-20. září"
 * (Glossar §2.6/§2.10), OHNE Wochennummer (nie „38. týden"). Monat
 * ausgeschrieben im Genitiv aus Intl cs-CZ (nie selbst gebildet, Glossar §4
 * Falle 7), im selben Monat nur am Ende, sonst an beiden Enden: „Týden 31. srpna
 * - 6. září". Nur Bindestrich.
 */
export function weekLabelCs(mondayMs: number): string {
  const mon = new Date(mondayMs);
  const sun = new Date(mondayMs);
  sun.setDate(sun.getDate() + 6);
  const lang = (d: Date) => d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long" });
  const gleich = mon.getMonth() === sun.getMonth() && mon.getFullYear() === sun.getFullYear();
  return gleich
    ? `Týden ${mon.getDate()}.-${lang(sun)}`
    : `Týden ${lang(mon)} - ${lang(sun)}`;
}

/**
 * ★ E11a-2 (26.09.2026, Weichen-Zähler §2.3): EINE Stelle statt einer
 * Ternäre je Aufrufstelle (`WeeklyGoalStats.tsx`, `WeekMultiSelect.tsx`,
 * `ExcusedWeeksSelect.tsx`) - fällt für unbekannte Sprachen auf
 * {@link weekLabel} (Deutsch) zurück.
 */
export function weekLabelJeSprache(mondayMs: number, sprache: Lang): string {
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) {
    const k = KETTEN_NEUN[sprache];
    const d = new Date(mondayMs);
    return k.wocheLabel(isoWeekNo(mondayMs), k.zeitraum.tag(d.getDate(), d.toLocaleDateString(GEBIET[sprache], { month: "short" })));
  }
  const s = sprache;
  if (s === "cs") return weekLabelCs(mondayMs); // ★ O-CS (03.10.2026)
  if (s === "tr") return weekLabelTr(mondayMs);
  if (s === "pl") return weekLabelPl(mondayMs);
  if (s === "it") return weekLabelIt(mondayMs);
  if (s === "en") return weekLabelEn(mondayMs);
  if (s === "fr") return weekLabelFr(mondayMs);
  if (s === "es") return weekLabelEs(mondayMs);
  return weekLabel(mondayMs);
}

export interface SelectableWeek {
  key: string;
  label: string;
  startMs: number;
}

/**
 * Wählbare Kalenderwochen ab der laufenden Woche (für das Pulldown der Lehrkraft).
 * `back` Wochen rückwärts (Standard 0), `count` Wochen ab jetzt vorwärts.
 */
export function listSelectableWeeks(
  nowMs: number,
  count = 20,
  back = 0,
): SelectableWeek[] {
  // Mit KALENDER-Tagen schrittweise (setDate), nicht in Millisekunden — sonst
  // driftet die Schrittweite über die Sommer-/Winterzeit-Umstellung und es käme
  // zu doppelten Wochenschlüsseln.
  const first = new Date(startOfWeek(nowMs));
  first.setDate(first.getDate() - back * 7);
  const out: SelectableWeek[] = [];
  for (let i = 0; i < count + back; i++) {
    const d = new Date(first);
    d.setDate(first.getDate() + i * 7);
    const startMs = startOfWeek(d.getTime()); // auf Montag 00:00 normalisieren
    out.push({ key: isoWeekKey(startMs), label: weekLabel(startMs), startMs });
  }
  return out;
}

/** Eine zusammenhängende Übungssitzung (aus den Ereignissen rekonstruiert). */
import {
  wochenStart,
  uebungstagSchluessel,
  type Wochenrhythmus,
} from "./wochenrhythmus";
import { istGeruestSprache } from "./sprachRegister";
import { KETTEN_NEUN } from "./kettenNeun";
import { GEBIET } from "../bedienSprache/texte";

export interface GoalSession {
  startMs: number;
  endMs: number;
  /** Reine Tippzeit der Sitzung in Minuten (Pausen herausgerechnet, siehe buildSessions). */
  minutes: number;
}

/**
 * Beginn der Woche, in der `nowMs` liegt.
 *
 * Ohne Rhythmus: Montag 00:00 (lokal) - unverändert seit jeher.
 * Mit Rhythmus (z. B. {@link import("./wochenziel").WOCHENZIEL_GRENZE}): der
 * letzte Abgabeschluss. Die Rechnung selbst steht in `wochenrhythmus.ts`,
 * damit sie nur an EINER Stelle wohnt.
 */
export function startOfWeek(
  nowMs: number,
  rhythmus: Wochenrhythmus | null = null,
): number {
  return wochenStart(nowMs, rhythmus);
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ M3 (19.09.2026): DIE EINE SITZUNGS-REGEL - EINMAL GESCHRIEBEN
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Welche Zeilen gehören zu EINER Sitzung? Chronologisch, und eine neue Sitzung
 * beginnt, sobald zwischen der Abgabe einer Zeile und der nächsten mehr als
 * {@link SESSION_BREAK_MS} liegen. Beginn = Anfang der ersten Zeile
 * (`ts - ms`, Wanduhr), Ende = Abgabe der letzten.
 *
 * Bis M3 stand genau diese Schleife ZWEIMAL da - in {@link buildSessions}
 * und in {@link buildDayPractice}, Zeichen für Zeichen gleich, aber ohne
 * voneinander zu wissen. Seit die Lehrkraft in „Übungszeiten" jede einzelne
 * Übungszeit einer Woche sieht (Johannes 19.09.2026: *„eine Unterliste mit
 * allen Übungszeiten genau erfasst"*, `uebungsperioden.ts`), wäre es die
 * dritte Stelle gewesen - darum steht die Regel jetzt HIER, und alle drei
 * lesen sie ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 * Am Ergebnis von `buildSessions`/`buildDayPractice` ändert das nichts:
 * dieselbe Reihenfolge, dieselben Grenzen, dieselben Additionen.
 */
export interface Sitzungsgruppe {
  /** Wanduhr: Anfang der ersten Zeile (`ts - ms`). */
  startMs: number;
  /** Wanduhr: Abgabe der letzten Zeile. */
  endMs: number;
  /** Die Zeilen dieser Sitzung, chronologisch - ohne Ziel-Änderungs-Marker. */
  events: TaskEvent[];
}

export function sitzungsGruppen(events: readonly TaskEvent[]): Sitzungsgruppe[] {
  const ev = events
    .filter((e) => e.ts > 0 && e.lesson !== GOAL_CHANGE_LESSON)
    .sort((a, b) => a.ts - b.ts);
  const out: Sitzungsgruppe[] = [];
  let offen: Sitzungsgruppe | null = null;
  for (const e of ev) {
    const lineStart = e.ts - Math.max(0, e.ms);
    if (!offen || e.ts - offen.endMs > SESSION_BREAK_MS) {
      offen = { startMs: lineStart, endMs: e.ts, events: [e] };
      out.push(offen);
    } else {
      offen.endMs = Math.max(offen.endMs, e.ts);
      offen.events.push(e);
    }
  }
  return out;
}

/**
 * Die geübte Zeit EINER Zeile in ms: reine Tippzeit (`activeMs`), bei
 * Alt-Ereignissen ohne sie die Bearbeitungszeit (`ms`) - dieselbe Größe, die
 * {@link buildDayPractice}, {@link buildSessions} und {@link todayActiveMs}
 * zählen.
 */
export function zeilenUebezeitMs(e: TaskEvent): number {
  return Math.max(0, e.activeMs ?? e.ms);
}

/**
 * Ereignisse zu Sitzungen zusammenfassen (chronologisch). Die Sitzungs-Minuten
 * sind AB dem Stichtag {@link ACTIVE_TIME_SINCE_MS} die REINE TIPPZEIT (Summe der
 * `activeMs` je Zeile, lange Pausen bereits herausgerechnet — Fallback `ms` bei
 * Alt-Ereignissen), NICHT die Wanduhr-Spanne. Sonst zählten Lese-/Denk-/Vorlese-
 * Pausen (und über die 30-min-Toleranz sogar echte Unterbrechungen) als Übungszeit
 * mit, und ein Zeit-Ziel wäre nach viel weniger echtem Üben erfüllt. So misst das
 * Wochenziel dasselbe wie die Übezeit-Uhr und die „geübte Zeit". VOR dem Stichtag
 * behalten die Sitzungen die alte Spannen-Rechnung, damit früher Erledigtes
 * erledigt bleibt. `startMs`/`endMs` bleiben Wanduhr (Datum, Tag, Sitzungsgrenzen).
 * Welche Zeilen eine Sitzung bilden: {@link sitzungsGruppen}.
 */
export function buildSessions(events: readonly TaskEvent[]): GoalSession[] {
  return sitzungsGruppen(events).map((g) => {
    // Vor dem Stichtag: alte Wanduhr-Spanne (nichts rückwirkend entwerten). Ab
    // dem Stichtag: reine Tippzeit.
    let activeMs = 0;
    for (const e of g.events) activeMs += zeilenUebezeitMs(e);
    return {
      startMs: g.startMs,
      endMs: g.endMs,
      minutes:
        g.startMs >= ACTIVE_TIME_SINCE_MS
          ? activeMs / 60000
          : (g.endMs - g.startMs) / 60000,
    };
  });
}

/** Übezeit eines Kalendertages — siehe {@link buildDayPractice}. */
export interface DayPractice {
  /** Gesamte Übezeit dieses Tages in Minuten. */
  minutes: number;
  /**
   * NUR für Tage VOR dem Stichtag {@link ACTIVE_TIME_SINCE_MS}: die Minuten der
   * einzelnen Sitzungen dieses Tages. Dort gilt weiter die alte Regel „eine lange
   * Sitzung = eine Einheit" — sonst würden aus alten Wanduhr-Spannen (inklusive
   * Pausen) nachträglich zusätzliche Einheiten entstehen. Ab dem Stichtag bleibt
   * die Liste leer und es zählt allein die Tagessumme.
   */
  legacySessions: number[];
}

/**
 * Übezeit je KALENDERTAG (lokale Mitternacht → {@link DayPractice}) — die Grundlage
 * der Wochenziel-Zählung (Johannes 27.07.: „die Zeit soll nicht nach Sitzung
 * gerechnet werden").
 *
 * Zwei Zeitrechnungen, sauber getrennt am Stichtag {@link ACTIVE_TIME_SINCE_MS}:
 *  • Sitzungen, die VOR dem Stichtag begannen, behalten die alte Wanduhr-Spanne
 *    und werden ihrem Starttag zugeschlagen (nichts wird rückwirkend um- oder
 *    entwertet — alte Wochen stehen in der Statistik unverändert da).
 *  • Alles ab dem Stichtag zählt die reine Tippzeit (`activeMs`) und schlägt jedes
 *    Ereignis SEINEM Kalendertag zu — exakt wie {@link todayActiveMs}, das die
 *    Übezeit-Uhr im Trainer-Kopf speist. Uhr und Kreise messen damit dasselbe,
 *    auch wenn eine Sitzung über Mitternacht läuft.
 */
export function buildDayPractice(
  events: readonly TaskEvent[],
  /**
   * ★ Der Rhythmus der Klasse. Nur er weiss, ob der Grenztag geteilt werden
   * muss (siehe {@link uebungstagSchluessel}). Fehlt er, ist der Schlüssel
   * die lokale Mitternacht - Zeichen für Zeichen wie bisher.
   */
  rhythmus: Wochenrhythmus | null = null,
): Map<number, DayPractice> {
  const out = new Map<number, DayPractice>();
  const dayOf = (ms: number): DayPractice => {
    const key = uebungstagSchluessel(ms, rhythmus);
    let d = out.get(key);
    if (!d) {
      d = { minutes: 0, legacySessions: [] };
      out.set(key, d);
    }
    return d;
  };
  // ★ M3: welche Zeilen eine Sitzung bilden, sagt {@link sitzungsGruppen}.
  for (const g of sitzungsGruppen(events)) {
    if (g.startMs < ACTIVE_TIME_SINCE_MS) {
      const span = (g.endMs - g.startMs) / 60000;
      const d = dayOf(g.startMs);
      d.minutes += span;
      d.legacySessions.push(span);
    } else {
      for (const e of g.events) dayOf(e.ts).minutes += zeilenUebezeitMs(e) / 60000;
    }
  }
  return out;
}

/**
 * Heute schon gespeicherte Übezeit (ms) — Summe der `activeMs` aller heutigen
 * Übungs-Ereignisse (Fallback `ms` bei Alt-Ereignissen). Setzt beim Laden die
 * Übezeit-Uhr auf (primePracticeClock), damit Uhr und Wochenziel-Anzeige nach
 * einem Neuladen dieselbe „heute geübt"-Zeit zeigen.
 */
export function todayActiveMs(
  events: readonly TaskEvent[],
  nowMs: number,
): number {
  const today = localDayStart(nowMs);
  let sum = 0;
  for (const e of events) {
    if (e.lesson === GOAL_CHANGE_LESSON) continue;
    if (e.ts <= 0 || localDayStart(e.ts) !== today) continue;
    sum += zeilenUebezeitMs(e);
  }
  return sum;
}
