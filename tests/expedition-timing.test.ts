/**
 * Polar-Expedition — adaptiver Zeitdruck (lib/typing/expedition/timing.ts,
 * Bauplan §5). Sichert die Fenster-Formel, den Polster-Verlauf und die
 * Barrierefreiheits-Sonderfälle (kein Tracking, „ohne Zeitdruck", neue Taste).
 */
import { describe, it, expect } from "vitest";
import {
  NEW_KEY_MS,
  POLSTER_MIN,
  POLSTER_START,
  WINDOW_MAX_MS,
  WINDOW_MIN_MS,
  advancePolster,
  sequenceWindowMs,
  unitMedianMs,
  unitWindowMs,
} from "../src/lib/typing/expedition/timing";
import type { LetterStat } from "../src/lib/typing/progress";

const stat = (partial: Partial<LetterStat>): LetterStat => ({
  hits: 0,
  misses: 0,
  sumMs: 0,
  timed: 0,
  recent: [],
  ...partial,
});

const noLimit = { ignoreSpeed: true };
const timed = { ignoreSpeed: false };

describe("unitMedianMs — Median der gemessenen Anschlagszeiten", () => {
  it("nimmt den Median der getakteten Treffer (recent > 0)", () => {
    // 200, 400, 900 → Median 400; Fehler (−1) und ungetaktete Treffer (0) zählen nicht.
    expect(unitMedianMs(stat({ recent: [200, -1, 0, 900, 400] }))).toBe(400);
  });

  it("mittelt bei gerader Anzahl die beiden mittleren Werte", () => {
    expect(unitMedianMs(stat({ recent: [300, 500] }))).toBe(400);
  });

  it("ist robust gegen einen Ausreißer (Median, nicht Mittel)", () => {
    // Ein verträumter 9000er-Anschlag verzerrt den Median nicht.
    expect(unitMedianMs(stat({ recent: [400, 420, 9000] }))).toBe(420);
  });

  it("fällt für Altstände ohne Fenster auf das Lebenszeit-Mittel zurück", () => {
    expect(unitMedianMs(stat({ recent: undefined, sumMs: 2400, timed: 3 }))).toBe(800);
  });

  it("liefert null, wenn es keine Messwerte gibt", () => {
    expect(unitMedianMs(undefined)).toBeNull();
    expect(unitMedianMs(stat({ recent: [-1, 0] }))).toBeNull();
  });
});

describe("advancePolster — Rückenwind statt Bestrafung", () => {
  it("beginnt großzügig und wird je sicherer Station sportlicher", () => {
    let p = POLSTER_START;
    expect(p).toBe(2.2);
    p = advancePolster(p, "cleared");
    expect(p).toBeCloseTo(2.1, 5);
  });

  it("sinkt nie unter das Minimum", () => {
    let p = POLSTER_START;
    for (let i = 0; i < 50; i++) p = advancePolster(p, "cleared");
    expect(p).toBe(POLSTER_MIN);
  });

  it("setzt nach einem Scheitern auf den großzügigen Start zurück", () => {
    expect(advancePolster(POLSTER_MIN, "failed")).toBe(POLSTER_START);
  });
});

describe("unitWindowMs — Fenster einer einzelnen Taste", () => {
  it("gibt kein Limit bei „ohne Zeitdruck“ (WCAG)", () => {
    expect(unitWindowMs("f", { f: stat({ recent: [300] }) }, noLimit)).toBeNull();
  });

  it("gibt einer ganz neuen Taste ohne Messwerte 14 Sekunden", () => {
    expect(unitWindowMs("q", {}, timed)).toBe(NEW_KEY_MS);
    expect(NEW_KEY_MS).toBeGreaterThan(WINDOW_MAX_MS); // bewusst über dem Normal-Max
  });

  it("rechnet median × polster im erlaubten Bereich", () => {
    // Median 1000 × Polster 3 = 3000 ms.
    const letters = { f: stat({ recent: [1000, 1000, 1000] }) };
    expect(unitWindowMs("f", letters, timed, 3.0)).toBe(3000);
  });

  it("klemmt schnelle Tipper auf das Minimum", () => {
    // Median 300 × 2 = 600 → auf WINDOW_MIN_MS angehoben.
    const letters = { f: stat({ recent: [300, 300] }) };
    expect(unitWindowMs("f", letters, timed, 2.0)).toBe(WINDOW_MIN_MS);
  });

  it("klemmt sehr langsame Messwerte auf das Maximum", () => {
    const letters = { f: stat({ recent: [8000, 8000] }) };
    expect(unitWindowMs("f", letters, timed, 3.0)).toBe(WINDOW_MAX_MS);
  });

  it("findet die Statistik auch für Großbuchstaben (kleingeschrieben gemessen)", () => {
    const letters = { a: stat({ recent: [1000] }) };
    expect(unitWindowMs("A", letters, timed, 3.0)).toBe(3000);
  });
});

describe("sequenceWindowMs — Fenster einer Zeichenfolge", () => {
  it("summiert die Einzelfenster der Zeichen (Bauplan §5)", () => {
    const letters = {
      f: stat({ recent: [1000] }), // 1000 × 3 = 3000
      j: stat({ recent: [2000] }), // 2000 × 3 = 6000
    };
    expect(sequenceWindowMs(["f", "j"], letters, timed, 3.0)).toBe(9000);
  });

  it("bleibt bei „ohne Zeitdruck“ ohne Limit", () => {
    expect(sequenceWindowMs(["f", "j"], {}, noLimit)).toBeNull();
  });

  it("liefert für eine leere Folge kein Limit", () => {
    expect(sequenceWindowMs([], {}, timed)).toBeNull();
  });
});
