/**
 * ★★★★★ E4 (25.09.2026, Bauplan französischer Lehrgang §4.3 Punkt 5, §14 E4):
 * TOTASTEN IN DER POLAR-EXPEDITION (Schneerutsche + Wasser).
 *
 * Dieselbe Falle wie bei der Umschalttaste (Befund 20.09.2026, siehe
 * `expedition-lives.test.tsx` „die Umschalttaste kostet kein Herz"): Für ein
 * zusammengesetztes Zeichen wie „ê" kommt zuerst ein eigenes Tasten-Ereignis
 * mit `key: "Dead"` - ohne Ausnahme wäre das ein Fehlgriff, und jedes Zeichen
 * mit Totaste in dieser Zone unschaffbar. NUR auf französischen Tastaturen
 * wirksam (`setLayout("fr")`) - ohne Umstellung bleibt die Zone unverändert.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import { setLayout } from "../src/lib/typing/layouts";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  setLayout("de");
});

const mastery = masteryFor("normal");
const LETTERS: Record<string, LetterStat> = {
  "^": { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
  "ê": { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
  p: { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
  j: { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
};

const WATER = (units: string[]): FloeCourse => ({ stages: [{ kind: "water", units }] });
const SLIDE = (units: string[]): FloeCourse => ({ stages: [{ kind: "slide", units }] });

function renderZone(course: FloeCourse) {
  render(
    <ExpeditionStage
      open
      onClose={vi.fn()}
      course={course}
      free
      isAdult={false}
      noTimePressure={false}
      letters={LETTERS}
      mastery={mastery}
      onWin={vi.fn()}
    />,
  );
  return screen.getByRole("application");
}

const hearts = () => [...document.body.querySelectorAll(".px-hud__heart")].filter((h) => h.textContent === "❤️").length;
const statusText = () => document.body.querySelector(".px-status")?.textContent ?? "";

describe("Wasser: Dead ist ein Zwischenzustand, wenn das Ziel eine Totaste braucht", () => {
  it("Dead vor ê kostet kein Herz und wird nicht als Fehlgriff gewertet - ê danach trifft", () => {
    setLayout("fr");
    const field = renderZone(WATER(["ê", "j"]));
    expect(hearts()).toBe(2);
    act(() => void fireEvent.keyDown(field, { key: "Dead" }));
    expect(hearts()).toBe(2); // kein Herz verloren
    act(() => void fireEvent.keyDown(field, { key: "ê" })); // zweiter keydown, fertiges Zeichen
    expect(screen.getByText(/Scholle 1 von 2/)).toBeTruthy(); // weiter
  });

  it("Dead vor ^ (eigene Lerneinheit, Bauplan §5.3) kostet ebenso kein Herz", () => {
    setLayout("fr");
    const field = renderZone(WATER(["^", "j"]));
    act(() => void fireEvent.keyDown(field, { key: "Dead" }));
    expect(hearts()).toBe(2);
    act(() => void fireEvent.keyDown(field, { key: "^" }));
    expect(screen.getByText(/Scholle 1 von 2/)).toBeTruthy();
  });

  it("Dead an einer Stelle OHNE Totaste (Ziel „p\"): die Totaste wartet (W1), das „p\" danach ergibt „^p\" - EIN Herz, kein zweites", () => {
    // ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8): bewertet wird
    // erst das fertige Zeichen - vorher kostete schon die Totaste das Herz.
    setLayout("fr");
    const field = renderZone(WATER(["p", "j"]));
    expect(hearts()).toBe(2);
    act(() => void fireEvent.keyDown(field, { key: "Dead" }));
    expect(hearts()).toBe(2); // Wartezustand, kein Herz
    act(() => void fireEvent.keyDown(field, { key: "p" })); // „^p" entstanden - kein Treffer
    expect(hearts()).toBe(1); // EIN Herz weg
    expect(statusText()).not.toMatch(/Scholle 1 von 2 abgeschlossen|Scholle 2 von 2/);
    // die WIRKLICH nächste, echte Taste trifft danach ganz normal.
    act(() => void fireEvent.keyDown(field, { key: "p" }));
    expect(screen.getByText(/Scholle 1 von 2/)).toBeTruthy();
  });

  it("ohne Umstellung auf eine französische Tastatur bleibt Dead ein gewöhnlicher Fehlgriff (Wege de/en unverändert)", () => {
    // Kein setLayout("fr") - Vorgabe ist "de".
    const field = renderZone(WATER(["p", "j"]));
    expect(hearts()).toBe(2);
    act(() => void fireEvent.keyDown(field, { key: "Dead" }));
    // Auf de/en gibt es keine Totasten-Ausnahme - "Dead" ist eine gewöhnliche,
    // unbekannte Taste. floeKeyIgnored lässt sie durch (kein Fehlerton), OHNE
    // Herzverlust - GENAU wie vor E4 (Byte für Byte, siehe iceFloe.ts).
    expect(hearts()).toBe(2);
  });
});

describe("Schneerutsche: dieselbe Ausnahme wie für die Umschalttaste (Befund 20.09.2026)", () => {
  it("Dead vor ê (Anflug läuft) kostet kein Herz - ê danach trifft ganz normal", () => {
    setLayout("fr");
    vi.useFakeTimers();
    const field = renderZone(SLIDE(["ê", "j"]));
    expect(hearts()).toBe(2);
    act(() => vi.advanceTimersByTime(1300)); // im Trefferfenster
    act(() => void fireEvent.keyDown(field, { key: "Dead" }));
    expect(hearts()).toBe(2);
    act(() => void fireEvent.keyDown(field, { key: "ê" }));
    expect(hearts()).toBe(2);
    expect(screen.getByText(/Schwung 1 von 2/)).toBeTruthy();
  });

  it("Dead an einer Stelle OHNE Totaste (Ziel „p\"): die Totaste wartet (W1), das „p\" danach kostet EIN Herz", () => {
    // ★ W1 (27.09.2026): siehe Wasser oben.
    setLayout("fr");
    vi.useFakeTimers();
    const field = renderZone(SLIDE(["p", "j"]));
    expect(hearts()).toBe(2);
    act(() => vi.advanceTimersByTime(1300));
    act(() => void fireEvent.keyDown(field, { key: "Dead" }));
    expect(hearts()).toBe(2); // Wartezustand
    act(() => void fireEvent.keyDown(field, { key: "p" })); // „^p" - EIN Herz
    expect(hearts()).toBe(1);
  });
});
