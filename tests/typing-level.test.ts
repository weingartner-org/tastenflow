import { describe, it, expect } from "vitest";
import {
  LEVEL_MAX,
  RoundResult,
  adaptLevel,
  calibrateFromSpeeds,
  computeImprovement,
  currentLevel,
  emptyProgress,
  levelForCpm,
  levelTargetCpm,
  masteryForLevel,
  recordRound,
  speedTargetCpm,
} from "../src/lib/typing";

function round(level: number, acc: number, cpm: number, ts = 1000): RoundResult {
  return { ts, acc, cpm, stars: 2, level };
}
/** n gleiche Runden auf einer Stufe. */
function rounds(level: number, acc: number, cpm: number, n: number): RoundResult[] {
  return Array.from({ length: n }, (_, i) => round(level, acc, cpm, 1000 + i));
}

describe("levelTargetCpm — geometrische Tempo-Skala", () => {
  it("Stufe 1 ignoriert Tempo (0), ab Stufe 2 wächst es streng monoton", () => {
    expect(levelTargetCpm(1)).toBe(0);
    let prev = 0;
    for (let L = 2; L <= LEVEL_MAX; L++) {
      const t = levelTargetCpm(L);
      expect(t).toBeGreaterThan(prev);
      prev = t;
    }
  });
  it("die Eckwerte liegen wie geplant (≈22 unten, ≈420 oben)", () => {
    expect(Math.round(levelTargetCpm(2))).toBe(22);
    expect(Math.round(levelTargetCpm(LEVEL_MAX))).toBe(420);
  });
  it("levelForCpm ist die (gerundete) Umkehrung", () => {
    for (const L of [5, 12, 20, 33, 48]) {
      expect(levelForCpm(levelTargetCpm(L))).toBe(L);
    }
    expect(levelForCpm(1)).toBe(2); // sehr langsam → unterste gemessene Stufe
  });
});

describe("masteryForLevel — Schwellen je Stufe", () => {
  it("Stufe 1 ignoriert das Tempo", () => {
    expect(masteryForLevel(1).ignoreSpeed).toBe(true);
  });
  it("höhere Stufe = strengeres (kleineres) Tempo-Ziel", () => {
    expect(masteryForLevel(30).targetMs).toBeLessThan(masteryForLevel(10).targetMs);
    expect(masteryForLevel(10).ignoreSpeed).toBe(false);
  });
});

describe("speedTargetCpm — Sterne-Tempo aus der Leistungsstufe", () => {
  it("Stufe 1 → 0 (Sterne nur über Treffsicherheit, jedes Kind kann 3 holen)", () => {
    expect(speedTargetCpm(1, undefined)).toBe(0);
    expect(speedTargetCpm(1, 80)).toBe(0);
  });
  it("ohne Erfahrung = Stufen-Ziel; höhere Stufe = höheres Ziel", () => {
    expect(speedTargetCpm(8, undefined)).toBeLessThan(speedTargetCpm(40, undefined));
  });
});

describe("Anfangs-Kalibrierung — einpendeln (Wunsch: am Anfang schneller)", () => {
  it("eine schnelle, saubere Messung zieht die Stufe sofort deutlich hoch", () => {
    // 200/min sauber → Stufe springt ans Können, statt viele Runden auf einem
    // viel zu niedrigen Ziel zu verharren.
    const { level } = calibrateFromSpeeds(6, [200]);
    expect(level).toBeGreaterThan(25);
  });
  it("das Tempo-Ziel folgt sofort (nicht mehr ~45 trotz 200 Anschlägen)", () => {
    const { level } = calibrateFromSpeeds(6, [200]);
    expect(speedTargetCpm(level, 200)).toBeGreaterThan(120);
  });
  it("der Median der sauberen Tempi dämpft einen Ausreißer", () => {
    const { level } = calibrateFromSpeeds(38, [200, 60]); // Median 130 → moderat
    expect(level).toBeGreaterThan(20);
    expect(level).toBeLessThan(40);
  });
  it("pendelt sich ein, wenn genug Messungen die Stufe kaum noch bewegen", () => {
    const here = levelForCpm(121);
    const { level, settled } = calibrateFromSpeeds(here, [120, 122, 121]);
    expect(settled).toBe(true);
    expect(Math.abs(level - here)).toBeLessThanOrEqual(1);
  });
  it("wenige, noch streuende Messungen sind NICHT eingependelt", () => {
    expect(calibrateFromSpeeds(6, [200]).settled).toBe(false);
    expect(calibrateFromSpeeds(6, []).settled).toBe(false);
  });
  it("recordRound kalibriert in der Kalibrierphase; eine unsaubere Runde straft nicht", () => {
    const a = recordRound({ ...emptyProgress(), level: 6 }, { acc: 0.96, cpm: 200, stars: 3 }, 6, 1000);
    expect(a.newLevel).toBeGreaterThan(25); // saubere, schnelle Runde → hoch
    expect(a.leveledUp).toBe(true);
    const b = recordRound({ ...emptyProgress(), level: 6 }, { acc: 0.5, cpm: 200, stars: 1 }, 6, 1000);
    expect(b.newLevel).toBe(6); // unsaubere Runde fließt nicht ein → Stufe bleibt
  });
  it("nach dem Einpendeln übernimmt das 5-Runden-Fenster (adaptLevel)", () => {
    // calibrated=true → recordRound nutzt das gedämpfte Fenster: zu wenige Runden
    // auf der Stufe → bleibt (Abklingzeit), nicht der Kalibrier-Sprung.
    const base = { ...emptyProgress(), level: 10, calibrated: true };
    const rec = recordRound(base, { acc: 0.99, cpm: 999, stars: 3 }, 10, 2000);
    expect(rec.newLevel).toBe(10);
  });
});

describe("adaptLevel — automatische Anpassung", () => {
  it("nach der Kalibrierung: zu wenige Runden auf der Stufe → bleibt (Abklingzeit)", () => {
    // Verlauf bereits über die Kalibrierungsphase hinaus (frühere Runden auf
    // Stufe 9), dann erst 2 Runden auf Stufe 10 → Abklingzeit greift.
    const history = [
      ...rounds(9, 0.9, levelTargetCpm(9), 3),
      ...rounds(10, 0.99, 999, 2),
    ];
    expect(adaptLevel(10, history)).toBe(10);
  });

  it("mehrere starke Runden → Aufstieg", () => {
    const target = levelTargetCpm(10);
    const next = adaptLevel(10, rounds(10, 0.97, target * 1.05, 4));
    expect(next).toBeGreaterThan(10);
  });

  it("deutlich über Ziel → Sprung über mehrere Stufen auf einmal", () => {
    const target = levelTargetCpm(8);
    const next = adaptLevel(8, rounds(8, 0.98, target * 2, 4));
    expect(next - 8).toBeGreaterThan(1);
    expect(next).toBeLessThanOrEqual(LEVEL_MAX);
  });

  it("schwache Runden → eine Stufe hinunter", () => {
    expect(adaptLevel(10, rounds(10, 0.7, 5, 4))).toBe(9);
  });

  it("sehr langsam UND sehr fehlerhaft → zurück auf Stufe 1", () => {
    const target = levelTargetCpm(12);
    expect(adaptLevel(12, rounds(12, 0.5, target * 0.3, 4))).toBe(1);
  });

  it("von Stufe 1 zurück ins gemessene Tempo, wenn wieder sauber & flott", () => {
    const next = adaptLevel(1, rounds(1, 0.99, 60, 4));
    expect(next).toBeGreaterThanOrEqual(2);
  });

  it("steigt nie über LEVEL_MAX, fällt nie unter 1", () => {
    const top = levelTargetCpm(LEVEL_MAX);
    expect(adaptLevel(LEVEL_MAX, rounds(LEVEL_MAX, 0.99, top * 3, 4))).toBe(LEVEL_MAX);
    expect(adaptLevel(1, rounds(1, 0.3, 1, 4))).toBe(1);
  });
});

describe("currentLevel / recordRound", () => {
  it("currentLevel leitet sich aus der Start-Anforderung ab, wenn keine Stufe gesetzt ist", () => {
    const p = emptyProgress();
    expect(currentLevel(p, "nurgenau")).toBe(1);
    expect(currentLevel(p, "normal")).toBeGreaterThan(1);
    expect(currentLevel({ ...p, level: 23 }, "normal")).toBe(23);
  });

  it("recordRound trägt die Runde ein, führt die Stufe nach und meldet Aufstieg", () => {
    const target = levelTargetCpm(10);
    // In der Kalibrierphase (calibrated noch ungesetzt) zieht eine saubere, über
    // dem Stufenziel liegende Runde die Stufe direkt mit nach oben.
    const base = { ...emptyProgress(), level: 10, rounds: rounds(10, 0.97, target * 1.1, 2) };
    const rec = recordRound(base, { acc: 0.97, cpm: target * 1.1, stars: 3 }, 10, 2000);
    expect(rec.newLevel).toBeGreaterThan(10);
    expect(rec.leveledUp).toBe(true);
    expect(rec.progress.level).toBe(rec.newLevel);
    expect(rec.progress.rounds?.length).toBe(3);
  });
});

describe("computeImprovement — Steigerung im Verlauf", () => {
  it("erkennt steigendes Tempo", () => {
    const rs: RoundResult[] = [
      round(5, 0.9, 30),
      round(5, 0.9, 35),
      round(6, 0.92, 45),
      round(7, 0.95, 60),
    ];
    const imp = computeImprovement(rs);
    expect(imp).not.toBeNull();
    expect(imp!.cpmDelta).toBeGreaterThan(0);
    expect(imp!.levelNow).toBeGreaterThanOrEqual(imp!.levelStart);
  });
  it("null bei zu wenig Daten", () => {
    expect(computeImprovement([round(5, 0.9, 30)])).toBeNull();
  });
});
