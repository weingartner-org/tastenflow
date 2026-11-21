/**
 * Wächter für „ZEIT LASSEN" und die vier Tempo-Fallen (Johannes 14.08.2026).
 *
 * Der Befund, der dahinter steht: Zeitdruckfreiheit hing an der LEISTUNGSSTUFE,
 * nicht am Kind. Auf Stufe 1 zählte Tempo nicht — nur war Stufe 1 kein Ort, an
 * dem ein Kind bleiben durfte:
 *
 *   • Der Aufstieg VON Stufe 1 sah das Tempo überhaupt nicht an: drei saubere
 *     Runden genügten. Ein Kind mit 8 Anschlägen/Min landete auf Stufe 2 mit
 *     Tempo-Ziel 22, scheiterte dort, fiel zurück, stieg wieder auf — ein
 *     Pendel, ohne dass sich seine Leistung je änderte.
 *   • Stufe 1 verlangte für drei Sterne 98 % Treffsicherheit, Stufe 2
 *     rechnerisch nur ≈ 96 %: Die zeitdruckfreie Stufe war die STRENGSTE.
 *   • Die Übezeit-Uhr zählte Pausen über 5 s nicht — bei 8 Anschlägen/Min
 *     verschluckte sie rund ein Drittel der wirklich gesessenen Zeit, und das
 *     Wochenziel wurde unerreichbar.
 *   • „Gemütliches Faultier" (langsam UND fehlerfrei) verlangte ein Tempo-Ziel
 *     über null — ausgerechnet das Abzeichen für dieses Kind war das einzige,
 *     das es nie bekommen konnte.
 *
 * Die Reparatur: „Zeit lassen" ist eine Eigenschaft des KINDES
 * (`TypingAccount.noTimePressure`, Lehrkraft-Häkchen bzw. Zahnrad ohne
 * Lehrkraft) — und die vier Fallen sind einzeln geschlossen.
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  ADAPT_MIN_AT_LEVEL,
  LV_STEP2_CPM,
  STAR2,
  STAR3,
  accOnlyThreshold,
  adaptLevel,
  awardBadges,
  emptyProgress,
  formatPracticeTime,
  getPracticeMs,
  IDLE_CAP_MS,
  IDLE_CAP_SLOW_MS,
  levelTargetCpm,
  masteryForLevel,
  notePracticeActivity,
  practiceIdleCap,
  recordRound,
  resetPracticeClock,
  roundStars,
  setPracticeIdleCap,
  speedTargetCpm,
  type RoundResult,
} from "../src/lib/typing";

/** Eine Runde, wie sie ein sorgfältiges, sehr langsames Kind tippt. */
function langsamUndSauber(level: number, n = ADAPT_MIN_AT_LEVEL): RoundResult[] {
  return Array.from({ length: n }, (_, i) => ({
    ts: 1000 + i,
    acc: 1, // fehlerfrei
    cpm: 8, // acht Anschläge pro Minute
    stars: 3,
    level,
  }));
}

describe("★★★ Das Pendel: Stufe 1 hebt niemanden mehr wegen Tempo hinaus", () => {
  it("fehlerfrei, aber 8 Anschläge/Min → das Kind BLEIBT auf Stufe 1", () => {
    expect(adaptLevel(1, langsamUndSauber(1))).toBe(1);
  });

  it("auch nach vielen sauberen Runden bleibt es dort (kein Auf-Ab-Pendel)", () => {
    expect(adaptLevel(1, langsamUndSauber(1, 5))).toBe(1);
  });

  it("wer das Tempo der nächsten Stufe WIRKLICH zeigt, steigt weiterhin auf", () => {
    const schnell: RoundResult[] = Array.from({ length: 3 }, (_, i) => ({
      ts: 1000 + i,
      acc: 1,
      cpm: 120,
      stars: 3,
      level: 1,
    }));
    expect(adaptLevel(1, schnell)).toBeGreaterThan(1);
  });

  it("die Schwelle ist genau das Tempo-Ziel von Stufe 2", () => {
    const knappDrunter: RoundResult[] = Array.from({ length: 3 }, (_, i) => ({
      ts: 1000 + i,
      acc: 1,
      cpm: LV_STEP2_CPM - 1,
      stars: 3,
      level: 1,
    }));
    expect(adaptLevel(1, knappDrunter)).toBe(1);
  });
});

describe("★★★ „Zeit lassen“ ist eine Eigenschaft des Kindes, nicht der Stufe", () => {
  it("kein Tempo-Ziel bei den Sternen — auf JEDER Stufe", () => {
    expect(speedTargetCpm(20, 150)).toBeGreaterThan(0);
    expect(speedTargetCpm(20, 150, true)).toBe(0);
  });

  it("die Buchstaben werden ohne Tempo beurteilt (ignoreSpeed) — auf jeder Stufe", () => {
    expect(masteryForLevel(20).ignoreSpeed).toBe(false);
    expect(masteryForLevel(20, true).ignoreSpeed).toBe(true);
  });

  it("die Leistungsstufe bewegt sich nicht mehr (weder hinauf noch hinab)", () => {
    // Zwei Runden liegen schon auf Stufe 12 — die dritte löst die Anpassung aus.
    const p = {
      ...emptyProgress(),
      calibrated: true,
      level: 12,
      rounds: langsamUndSauber(12, 2),
    };
    const ohne = recordRound(p, { acc: 1, cpm: 8, stars: 3 }, 12, 1000);
    const mit = recordRound(p, { acc: 1, cpm: 8, stars: 3 }, 12, 1000, true);
    // Ohne den Schalter reißt das Tempo die Stufe nach unten …
    expect(ohne.newLevel).toBeLessThan(12);
    // … mit ihm bleibt sie stehen.
    expect(mit.newLevel).toBe(12);
    expect(mit.leveledUp).toBe(false);
    // Die Runde selbst steht trotzdem im Verlauf (Steigerungs-Statistik lebt).
    expect(mit.progress.rounds).toHaveLength(3);
  });

  it("auch die Kalibrierung greift nicht mehr (sie sucht die Stufe am Tempo)", () => {
    const p = emptyProgress(); // calibrated ist noch nicht gesetzt
    const rec = recordRound(p, { acc: 1, cpm: 8, stars: 3 }, 6, 1000, true);
    expect(rec.newLevel).toBe(6);
    expect(rec.progress.calSpeeds ?? []).toHaveLength(0);
  });
});

describe("★★ Ohne Tempo-Ziel ist die Sterne-Latte nicht mehr die strengste", () => {
  it("drei Sterne verlangen dieselbe Treffsicherheit wie mit vollem Tempo (≈ 95,6 %)", () => {
    const schwelle = accOnlyThreshold(STAR3);
    expect(schwelle).toBeGreaterThan(0.95);
    expect(schwelle).toBeLessThan(0.96);
    // Genau dieselbe Treffsicherheit reicht mit vollem Tempo für drei Sterne …
    expect(roundStars(schwelle + 0.001, 100, 100)).toBe(3);
    // … und ohne Tempo-Ziel jetzt auch (vorher: zwei, weil 98 % verlangt waren).
    expect(roundStars(schwelle, 8, 0)).toBe(3);
    expect(roundStars(0.96, 8, 0)).toBe(3);
    // Die alte Latte (98 %) ist damit weg — 96 % genügen wie überall sonst.
    expect(roundStars(schwelle - 0.01, 8, 0)).toBe(2);
  });

  it("zwei Sterne ebenso (≈ 88,4 % statt vormals 92 %)", () => {
    const schwelle = accOnlyThreshold(STAR2);
    expect(roundStars(schwelle, 8, 0)).toBe(2);
    expect(roundStars(schwelle - 0.01, 8, 0)).toBe(1);
  });

  it("schludrig bleibt schludrig — die Genauigkeit zählt weiterhin voll", () => {
    expect(roundStars(0.8, 8, 0)).toBe(1);
  });
});

describe("★★ „Gemütliches Faultier“ ist endlich zu holen, wo es hingehört", () => {
  function faultier(target: number, cpm: number): boolean {
    const p = { ...emptyProgress(), level: 1 };
    const res = awardBadges(
      p,
      { acc: 1, cpm, stars: 3, level: 1, target },
      Date.UTC(2026, 7, 14, 10, 0, 0), "de",
    );
    return res.newly.some((b) => b.id === "gemuetliches-faultier");
  }

  it("ohne Tempo-Ziel (Stufe 1 / „Zeit lassen“): langsam + fehlerfrei = verdient", () => {
    expect(faultier(0, 8)).toBe(true);
  });

  it("wer ohne Tempo-Ziel flott tippt, bekommt es weiterhin nicht", () => {
    expect(faultier(0, 60)).toBe(false);
  });

  it("mit Tempo-Ziel bleibt der alte Maßstab (60 % des Ziels)", () => {
    const ziel = levelTargetCpm(10);
    expect(faultier(ziel, ziel * 0.3)).toBe(true);
    expect(faultier(ziel, ziel * 0.9)).toBe(false);
  });
});

describe("★★ Die Übezeit-Uhr verschluckt die Zeit langsamer Kinder nicht mehr", () => {
  beforeEach(() => {
    resetPracticeClock();
    setPracticeIdleCap(IDLE_CAP_MS);
  });

  /** Acht Anschläge pro Minute = alle 7,5 s einer. Zwölf Anschläge = 90 s. */
  function tippeLangsam(): number {
    const start = 10_000;
    for (let i = 0; i < 12; i++) notePracticeActivity(start + i * 7500);
    return start + 11 * 7500; // Zeitpunkt des letzten Anschlags
  }

  it("★★★ mit der alten 5-Sekunden-Toleranz fehlte rund ein Drittel", () => {
    /*
      ⚠️ GEDREHT am 01.09.2026. Dieser Fall hielt fest, dass die REGEL-Toleranz
      zu klein ist - das war seine Aufgabe, und er hat sie erfüllt: Seit dem
      01.09. ist sie es nicht mehr, `IDLE_CAP_MS` steht auf 30 s (Begründung
      dort - für ein Kind, das sich die Zeile vorlesen lässt, galt derselbe
      Verlust wie für ein langsam schreibendes).

      Er wird darum nicht gelöscht, sondern misst jetzt die alte Toleranz
      ausdrücklich: Sinkt die Regel je wieder auf 5 s, steht hier wieder, was
      das kostet - und der Fall darunter zeigt, was mit der heutigen Toleranz
      herauskommt.
    */
    setPracticeIdleCap(5000);
    const ende = tippeLangsam();
    expect(getPracticeMs(ende)).toBeLessThan(0.75 * (ende - 10_000));
  });

  it("★★★ mit der heutigen Regel-Toleranz zählt dieselbe Zeit VOLLSTÄNDIG", () => {
    /*
      Johannes, 01.09.2026: *„Das Kind sagt ich hab 20 min gearbeitet, der
      Lehrer sagt stimmt nicht es waren nur 18 min. Das darf nicht sein."*
      Gemessen an genau dieser Stelle: Ohne „Zeit lassen", ohne jede
      Sondereinstellung, zählt die Uhr die ganze gesessene Zeit.
    */
    const ende = tippeLangsam();
    expect(getPracticeMs(ende)).toBe(ende - 10_000);
  });

  it("mit „Zeit lassen“ zählt die Uhr die gesessene Zeit durchgehend", () => {
    setPracticeIdleCap(IDLE_CAP_SLOW_MS);
    expect(practiceIdleCap()).toBe(IDLE_CAP_SLOW_MS);
    const ende = tippeLangsam();
    expect(getPracticeMs(ende)).toBe(ende - 10_000);
    expect(formatPracticeTime(getPracticeMs(ende))).toBe("1:22");
  });

  it("eine ECHTE Pause bleibt auch dann eine Pause", () => {
    setPracticeIdleCap(IDLE_CAP_SLOW_MS);
    notePracticeActivity(0);
    notePracticeActivity(5 * 60_000); // fünf Minuten weg
    // Gezählt werden nur die beiden aktiven Abschnitte, nicht die Pause.
    expect(getPracticeMs(5 * 60_000)).toBeLessThanOrEqual(IDLE_CAP_SLOW_MS);
  });
});
