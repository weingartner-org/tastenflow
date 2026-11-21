/**
 * ════════════════════════════════════════════════════════════════════════════
 * ES GIBT NUR EINE ÜBEZEIT - Kind und Lehrkraft sehen DIESELBE Zahl
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Anlass (Johannes, 01.09.2026): *„aber haben wir jetzt wieder 2
 * unterschiedliche zeiten in der statistik und auf der übeseite der kinder?
 * das darf nicht sein"*
 *
 * Die Antwort war nein - aber es gab nichts, was das FESTHÄLT. Am 31.08. wurde
 * es einmal von Hand nachgerechnet („auf zwei Nachkommastellen genau
 * dasselbe"); eine Messung von Hand hält nichts fest, sie beschreibt einen
 * Tag. Genau so laufen zwei Anzeigen auseinander: nicht durch eine
 * Entscheidung, sondern weil später jemand an EINER von drei Stellen etwas
 * verbessert ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── Die drei Stellen, die dieselbe Frage beantworten ───────────────────────
 *
 *   1. `computePupilStats().totalMs`  → Spalte „Übezeit" in der Lehrkraft-Tabelle
 *                                       und „geübt" in der Statistik des Kindes
 *   2. `todayActiveMs()`              → die Übezeit-Uhr auf der Übungsseite
 *   3. `buildDayPractice()`           → Minuten je Tag für die Wochenziel-Kreise
 *
 * Alle drei rechnen aus DEMSELBEN gespeicherten Feld: `activeMs` je Zeile (mit
 * Rückfall auf `ms` bei Ereignissen von vor der Uhr). Dieser Wächter füttert
 * sie mit denselben Ereignissen und verlangt dasselbe Ergebnis.
 *
 * ⚠️ Wer hier etwas rot macht, hat NICHT den Test kaputt gemacht, sondern zwei
 * Anzeigen auseinandergebracht. Der Weg zurück ist, die eine Rechnung zu
 * ändern und nicht drei.
 */
import { describe, expect, it } from "vitest";
import type { TaskEvent } from "@/lib/typing/account";
import { GOAL_CHANGE_LESSON, computePupilStats } from "@/lib/typing/account";
import { ACTIVE_TIME_SINCE_MS, buildDayPractice, todayActiveMs } from "@/lib/typing/goals";

/**
 * Ein Übungstag, deutlich NACH {@link ACTIVE_TIME_SINCE_MS} - davor gilt für die
 * Tagesminuten bewusst die alte Sitzungs-Spanne (Ereignisse aus der Zeit vor
 * der Uhr tragen kein `activeMs`). Diese historische Ausnahme ist dokumentiert
 * und nicht Gegenstand dieses Wächters.
 */
const TAG = new Date(2026, 7, 20, 9, 0, 0).getTime();
expect(TAG).toBeGreaterThan(ACTIVE_TIME_SINCE_MS);

/** Eine getippte Zeile: `ms` = Wanduhr der Zeile, `activeMs` = was die Uhr zählte. */
const zeile = (offsetMs: number, ms: number, activeMs: number): TaskEvent => ({
  ts: TAG + offsetMs,
  lesson: "adaptiv",
  chars: 30,
  errors: 1,
  ms,
  activeMs,
});

/*
 * Ein Tag, wie er bei einem Kind mit Blindheit wirklich aussieht: kurze Zeilen,
 * dazwischen Ansage-Pausen. Bei manchen Zeilen liegt `activeMs` UNTER `ms`
 * (die Uhr hat eine lange Pause gekappt), bei anderen darüber (die Uhr zählt
 * auch die Zeit VOR der Zeile, in der die Ansage lief) - genau darum darf
 * keine der drei Stellen selbst rechnen, sondern muss `activeMs` nehmen.
 */
const tag: TaskEvent[] = [
  zeile(0, 12_000, 12_000),
  zeile(30_000, 9_000, 21_000),
  zeile(70_000, 15_000, 14_500),
  zeile(120_000, 8_000, 33_000),
  zeile(600_000, 11_000, 11_000),
];

const erwartet = tag.reduce((n, e) => n + (e.activeMs ?? e.ms), 0);

describe("Eine Übezeit für alle Anzeigen", () => {
  it("★★★★★ Lehrkraft-Tabelle, Uhr des Kindes und Wochenziel-Kreise liefern dieselbe Zahl", () => {
    const tabelle = computePupilStats(tag).totalMs;
    const uhr = todayActiveMs(tag, TAG + 700_000);
    const kreiseMin = [...buildDayPractice(tag).values()].reduce((n, d) => n + d.minutes, 0);

    expect(tabelle).toBe(erwartet);
    expect(uhr).toBe(erwartet);
    // Die Kreise rechnen in Minuten - auf die Millisekunde zurückgerechnet.
    expect(kreiseMin * 60000).toBeCloseTo(erwartet, 6);
  });

  it("nimmt `activeMs` und NICHT die Wanduhr `ms`", () => {
    /*
      Der Fehler, der hier am leichtesten passiert: Irgendwo rechnet jemand mit
      `ms`, weil das der offensichtlichere Wert ist. Dann zeigt eine Anzeige
      die gesessene Zeit und eine andere die gezählte - und niemand sieht dem
      Bildschirm an, welche.
    */
    const wanduhr = tag.reduce((n, e) => n + e.ms, 0);
    expect(erwartet).not.toBe(wanduhr); // die Daten unterscheiden die beiden wirklich
    expect(computePupilStats(tag).totalMs).not.toBe(wanduhr);
    expect(todayActiveMs(tag, TAG + 700_000)).not.toBe(wanduhr);
  });

  it("alte Ereignisse ohne `activeMs` fallen überall gleich auf `ms` zurück", () => {
    const alt: TaskEvent[] = tag.map(({ activeMs: _weg, ...rest }) => rest);
    const summe = alt.reduce((n, e) => n + e.ms, 0);
    expect(computePupilStats(alt).totalMs).toBe(summe);
    expect(todayActiveMs(alt, TAG + 700_000)).toBe(summe);
  });

  it("der Marker eines Ziel-Wechsels zählt nirgends als Übezeit", () => {
    /*
      Ziel-Änderungen werden als Ereignis mitgeschrieben. Sie sind keine Übung -
      und wenn eine der drei Stellen sie mitzählte, liefe genau dort die Zahl
      auseinander.
    */
    const marker: TaskEvent = {
      ts: TAG + 300_000,
      lesson: GOAL_CHANGE_LESSON,
      chars: 0,
      errors: 0,
      ms: 0,
      activeMs: 99_000,
    };
    const mit = [...tag, marker];
    expect(todayActiveMs(mit, TAG + 700_000)).toBe(erwartet);
    const kreiseMin = [...buildDayPractice(mit).values()].reduce((n, d) => n + d.minutes, 0);
    expect(kreiseMin * 60000).toBeCloseTo(erwartet, 6);
  });
});
