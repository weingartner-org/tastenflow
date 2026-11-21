import { describe, it, expect } from "vitest";
import {
  TaskEvent,
  buildSessions,
  isoWeekKey,
  listSelectableWeeks,
  startOfWeek,
} from "../src/lib/typing";

// Mittwoch, 17. Juni 2026, 09:00 (lokal) — bewusst Wochenmitte, damit angehängte
// Sitzungen (bis Freitag) in derselben Mo–So-Woche bleiben.
const BASE = new Date(2026, 5, 17, 9, 0, 0).getTime();
const MIN = 60_000;
const H = 60 * MIN;

// Übungszeit = REINE TIPPZEIT (activeMs), nicht die Wanduhr-Spanne. Ein Ereignis
// trägt daher seine aktive Tippzeit; ohne Angabe = `ms` (wie bei Alt-Ständen).
function ev(ts: number, ms = 2000, activeMs = ms): TaskEvent {
  return { ts, lesson: "x", chars: 10, errors: 0, ms, activeMs };
}

/** Eine 20-Minuten-Sitzung (reine Tippzeit) ab `start`: vier Zeilen à 5 min. */
function block20(start: number): TaskEvent[] {
  const five = 5 * MIN;
  return [
    ev(start, five),
    ev(start + 5 * MIN, five),
    ev(start + 10 * MIN, five),
    ev(start + 20 * MIN, five),
  ];
}

describe("startOfWeek", () => {
  it("liefert Montag 00:00 der laufenden Woche", () => {
    const ws = startOfWeek(BASE);
    const d = new Date(ws);
    expect(d.getDay()).toBe(1); // Montag
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(BASE - ws).toBeLessThan(7 * 24 * H);
  });
});

describe("buildSessions", () => {
  it("fasst nahe Ereignisse zusammen und trennt bei großer Pause", () => {
    const events = [...block20(BASE), ...block20(BASE + 2 * H)];
    const s = buildSessions(events);
    expect(s).toHaveLength(2);
    expect(s[0].minutes).toBeGreaterThanOrEqual(20);
    expect(s[1].minutes).toBeGreaterThanOrEqual(20);
  });

  it("ist robust gegen unsortierte Eingaben", () => {
    const events = [ev(BASE + 20 * MIN), ev(BASE), ev(BASE + 10 * MIN)];
    const s = buildSessions(events);
    expect(s).toHaveLength(1);
  });
});

describe("Zeitrechnung: aktive Zeit ab Stichtag, alte Rechnung bleibt rückwirkend", () => {
  // Nach dem Stichtag (ACTIVE_TIME_SINCE_MS = 2026-07-07): irgendein Werktag danach.
  const AFTER = new Date(2026, 6, 8, 9, 0, 0).getTime();

  // ~8 min AKTIVES Tippen, aber ~18 min Wanduhr-Spanne (viele Pausen dazwischen).
  function pauseHeavy(base: number): TaskEvent[] {
    const active = 20_000;
    const pause = 25_000;
    const out: TaskEvent[] = [];
    let t = base;
    for (let i = 0; i < 24; i++) {
      out.push(ev(t + active, active, active)); // ts = Zeilenende, activeMs = 20 s
      t = t + active + pause;
    }
    return out;
  }

  it("NACH dem Stichtag: Pausen zählen NICHT — nur reine Tippzeit (Jano-Fall)", () => {
    const events = pauseHeavy(AFTER);
    const sessions = buildSessions(events);
    expect(sessions).toHaveLength(1); // Pausen < 30 min → eine Sitzung
    expect(sessions[0].minutes).toBeGreaterThan(7); // reine Tippzeit ~8 min
    expect(sessions[0].minutes).toBeLessThan(9); // NICHT die ~18-min-Spanne
  });

  it("VOR dem Stichtag: alte Wanduhr-Rechnung bleibt — Erledigtes bleibt erledigt", () => {
    const events = pauseHeavy(BASE); // 2026-06-17, vor dem Stichtag
    const sessions = buildSessions(events);
    expect(sessions[0].minutes).toBeGreaterThan(15); // Wanduhr-Spanne ~18 min
  });
});

describe("Kalenderwochen", () => {
  const curKey = isoWeekKey(BASE);

  it("isoWeekKey hat das Format YYYY-Www", () => {
    expect(curKey).toMatch(/^\d{4}-W\d{2}$/);
  });

  it("listSelectableWeeks beginnt bei der laufenden Woche", () => {
    const ws = listSelectableWeeks(BASE, 5);
    expect(ws).toHaveLength(5);
    expect(ws[0].key).toBe(curKey);
    expect(ws[0].label).toMatch(/^KW \d+/);
  });

  it("liefert eindeutige Wochenschlüssel auch über die Sommer-/Winterzeit", () => {
    // 60 Wochen ab Juni 2026 überspannen die Zeitumstellung (Ende Okt.) — früher
    // gab es dadurch doppelte Schlüssel (z. B. zweimal KW 43).
    const ws = listSelectableWeeks(BASE, 60);
    const keys = ws.map((w) => w.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
