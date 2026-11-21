import { describe, it, expect } from "vitest";
import {
  INITIAL_LETTERS,
  INTRO_ORDER,
  PATIENCE_SAMPLES,
  type LetterStat,
  type TaskEvent,
  accuracyScore,
  computePupilStats,
  isMastered,
  letterLevel,
  masteryFor,
  roundStars,
  speedScore,
  speedTargetCpm,
  updateSpeedEma,
} from "../src/lib/typing";
import { fmtDuration, fmtDurationEn } from "../src/components/typing/PupilStatsPanel";

const FULL = INTRO_ORDER.length;

describe("speedTargetCpm — Tempo-Ziel wächst mit der Spielstufe (Wunsch #5)", () => {
  it("ohne Erfahrung: niedrig am Anfang, hoch am Ende", () => {
    const start = speedTargetCpm(INITIAL_LETTERS, undefined);
    const end = speedTargetCpm(FULL, undefined);
    expect(start).toBeLessThan(end);
    expect(start).toBeLessThanOrEqual(40); // Anfänger dürfen langsam sein
    expect(end).toBeGreaterThanOrEqual(150);
  });

  it("langsames Kind bekommt ein NIEDRIGERES Ziel als das Stufen-Ziel (Wunsch #7)", () => {
    const levelOnly = speedTargetCpm(FULL, undefined);
    const slow = speedTargetCpm(FULL, 50); // übt dauerhaft mit ~50/min
    expect(slow).toBeLessThan(levelOnly);
  });

  it("schnelles Kind bekommt ein höheres, aber gedeckeltes Ziel (Wunsch #7)", () => {
    const levelOnly = speedTargetCpm(INITIAL_LETTERS, undefined);
    const fast = speedTargetCpm(INITIAL_LETTERS, 400); // sehr schnell
    expect(fast).toBeGreaterThan(levelOnly);
    expect(fast).toBeLessThanOrEqual(levelOnly * 1.4 + 0.001); // Deckel
  });
});

describe("roundStars — Mittel aus Treffsicherheit und Tempo", () => {
  it("Anfänger tippt langsam, aber sauber → 3 Sterne (Wunsch #5)", () => {
    const target = speedTargetCpm(INITIAL_LETTERS, undefined); // niedrig
    expect(roundStars(0.99, target, target)).toBe(3); // genau am Ziel
  });

  it("Pause während der Runde → langsam → keine 3 Sterne (Wunsch #6)", () => {
    const target = 100;
    // Sehr treffsicher, aber wegen Pause nur halbes Tempo:
    expect(roundStars(0.99, 50, target)).toBeLessThan(3);
  });

  it("schnell genug + treffsicher → 3 Sterne", () => {
    expect(roundStars(0.98, 120, 100)).toBe(3);
  });

  it("viele Fehler ziehen die Sterne, auch bei vollem Tempo", () => {
    expect(roundStars(0.7, 200, 100)).toBeLessThan(3);
  });

  it("ohne Tempo-Ziel (≤0) zählt nur die Treffsicherheit", () => {
    expect(roundStars(0.99, 5, 0)).toBe(3);
    expect(roundStars(0.95, 5, 0)).toBe(2);
    expect(roundStars(0.5, 5, 0)).toBe(1);
  });
});

describe("roundStars — Treffsicherheit wiegt IMMER deutlich mehr als Tempo (2026-07-07)", () => {
  it("rasend schnell, aber schludrig → NIE 3 Sterne (Tempo gleicht Fehler nicht aus)", () => {
    // 90 % Treffer bei zehnfachem Tempo-Ziel: höchstens 2 Sterne.
    expect(roundStars(0.9, 1000, 100)).toBeLessThan(3);
    // Unter ~88 % Treffern reicht volles Tempo nicht mal für 2 Sterne.
    expect(roundStars(0.87, 1000, 100)).toBe(1);
  });
  it("fehlerfrei, aber im Schneckentempo → trotzdem 2 Sterne sicher", () => {
    expect(roundStars(1, 10, 100)).toBe(2);
  });
  it("fehlerfrei + 60 % des Tempo-Ziels → schon 3 Sterne", () => {
    expect(roundStars(1, 60, 100)).toBe(3);
  });
  it("3 Sterne setzen rechnerisch ≈ 96 % Treffer voraus — auch bei vollem Tempo", () => {
    expect(roundStars(0.95, 1000, 100)).toBeLessThan(3);
    expect(roundStars(0.97, 100, 100)).toBe(3);
  });
});

describe("Wertungs-Bausteine 0..1", () => {
  it("accuracyScore: unter 80 % = 0, ab 98 % = 1", () => {
    expect(accuracyScore(0.8)).toBe(0);
    expect(accuracyScore(0.98)).toBe(1);
    expect(accuracyScore(1)).toBe(1);
    expect(accuracyScore(0.89)).toBeGreaterThan(0);
  });
  it("speedScore: gedeckelt auf 1", () => {
    expect(speedScore(50, 100)).toBeCloseTo(0.5, 5);
    expect(speedScore(200, 100)).toBe(1);
    expect(speedScore(50, 0)).toBe(0);
  });
});

describe("updateSpeedEma — gleitendes Mittel", () => {
  it("erster Wert übernimmt das Tempo", () => {
    expect(updateSpeedEma(undefined, 80)).toBe(80);
    expect(updateSpeedEma(0, 80)).toBe(80);
  });
  it("zieht in Richtung des neuen Werts, ohne zu springen", () => {
    const next = updateSpeedEma(100, 200);
    expect(next).toBeGreaterThan(100);
    expect(next).toBeLessThan(200);
  });
});

// --- Wunsch #4: geübte Zeit zählt nur aktive Tipp-Zeit -----------------------
function ev(over: Partial<TaskEvent>): TaskEvent {
  return { ts: 1000, lesson: "x", chars: 10, errors: 0, ms: 5000, ...over };
}

describe("computePupilStats — geübte Zeit ohne lange Pausen (Wunsch #4)", () => {
  it("nutzt activeMs (reine Tipp-Zeit), wenn vorhanden", () => {
    // Wanduhr 5 min, aber nur 30 s aktiv getippt:
    const s = computePupilStats([ev({ ms: 300000, activeMs: 30000 })]);
    expect(s.totalMs).toBe(30000);
  });
  it("fällt für alte Ereignisse ohne activeMs auf ms zurück", () => {
    const s = computePupilStats([ev({ ms: 4000 })]);
    expect(s.totalMs).toBe(4000);
  });
  it("Tempo (avgCpm) zählt weiter die Wanduhr — Pausen bremsen das Tempo", () => {
    // 10 Zeichen in 5 s Wanduhr → 120/min, unabhängig von activeMs
    const s = computePupilStats([ev({ ms: 5000, activeMs: 1000 })]);
    expect(Math.round(s.avgCpm)).toBe(120);
  });
});

describe("computePupilStats — geübte Zeit getrennt Deutsch/Englisch", () => {
  it("teilt die geübte Zeit nach Sprache auf", () => {
    const s = computePupilStats([
      ev({ ms: 2000, lang: "de" }),
      ev({ ms: 3000, lang: "en" }),
      ev({ ms: 1000, lang: "en" }),
    ]);
    expect(s.totalMs).toBe(6000);
    expect(s.totalMsDe).toBe(2000);
    expect(s.totalMsEn).toBe(4000);
  });
  it("zählt Ereignisse ohne Sprach-Vermerk (alte Stände) als Deutsch", () => {
    const s = computePupilStats([ev({ ms: 2000 }), ev({ ms: 3000, lang: "en" })]);
    expect(s.totalMsDe).toBe(2000);
    expect(s.totalMsEn).toBe(3000);
    expect(s.totalMsDe + s.totalMsEn).toBe(s.totalMs);
  });
  it("nutzt auch hier activeMs (reine Tipp-Zeit) je Sprache", () => {
    const s = computePupilStats([
      ev({ ms: 300000, activeMs: 30000, lang: "en" }),
    ]);
    expect(s.totalMsEn).toBe(30000);
    expect(s.totalMsDe).toBe(0);
  });
  // ★ Mechanik-Behebung fr (26.09.2026): französische Übezeit zählte als Deutsch.
  it("zählt französische Inhalte eigens, nicht als Deutsch", () => {
    const s = computePupilStats([
      ev({ ms: 2000, lang: "de" }),
      ev({ ms: 3000, lang: "en" }),
      ev({ ms: 5000, lang: "fr" }),
    ]);
    expect(s.totalMsDe).toBe(2000);
    expect(s.totalMsEn).toBe(3000);
    expect(s.totalMsFr).toBe(5000);
    expect(s.totalMsDe + s.totalMsEn + s.totalMsFr).toBe(s.totalMs);
  });
});

// --- Wunsch #7: langsame, genaue Kinder bleiben nicht hängen ------------------
function recentStat(values: number[]): LetterStat {
  let hits = 0;
  let sumMs = 0;
  let timed = 0;
  for (const v of values) {
    if (v < 0) continue;
    hits += 1;
    if (v > 0) {
      sumMs += v;
      timed += 1;
    }
  }
  return { hits, misses: values.length - hits, sumMs, timed, recent: values };
}

describe("letterLevel — automatische Anpassung (Geduld) für langsame Kinder", () => {
  const m = masteryFor("normal");
  it("viel geuebt + treffsicher, aber langsam gilt als sitzt", () => {
    const slowButPracticed = recentStat(new Array(PATIENCE_SAMPLES).fill(2500));
    expect(letterLevel(slowButPracticed, m, "de")).toBe("sitzt");
    expect(isMastered(slowButPracticed, m, "de")).toBe(true);
  });
  it("zu wenig geuebt + langsam bleibt hakt", () => {
    const slowFew = recentStat(new Array(PATIENCE_SAMPLES - 4).fill(2500));
    expect(letterLevel(slowFew, m, "de")).toBe("hakt");
  });
  it("viel geuebt, aber unsauber ist NICHT sitzt", () => {
    const sloppy = recentStat([
      ...new Array(PATIENCE_SAMPLES - 4).fill(800),
      -1, -1, -1, -1,
    ]);
    expect(letterLevel(sloppy, m, "de")).not.toBe("sitzt");
  });
});

describe("geübte Zeit zweisprachig (Wunsch #3)", () => {
  it("Deutsch", () => {
    expect(fmtDuration(45000)).toBe("45 Sek.");
    expect(fmtDuration(5 * 60000)).toBe("5 Min.");
    expect(fmtDuration(65 * 60000)).toBe("1 Std. 5 Min.");
  });
  it("Englisch", () => {
    expect(fmtDurationEn(45000)).toBe("45 sec");
    expect(fmtDurationEn(5 * 60000)).toBe("5 min");
    expect(fmtDurationEn(65 * 60000)).toBe("1 hr 5 min");
  });
});
