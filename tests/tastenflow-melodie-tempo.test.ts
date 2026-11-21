import { describe, it, expect } from "vitest";
import { computePupilStats, tempoOhneBremsendeMelodie, type TaskEvent } from "@/lib/typing/account";
import { packEvents, unpackEvents } from "@/lib/typing/eventPack";
import { scoreAusStats } from "@/lib/typing/score";

/**
 * ★ Melodie bremst das Tempo nie (19.10.2026, Johannes): Zeilen mit Melodie
 * zählen für das TEMPO nur, wenn sie das Tempo heben. Genauigkeit bleibt wie immer.
 */
const zeile = (i: number, cpm: number, extra: Partial<TaskEvent> = {}): TaskEvent => ({
  ts: 1_700_000_000_000 + i * 60_000,
  lesson: "L1",
  chars: 60,
  errors: 0,
  ms: Math.round((60 / cpm) * 60000),
  ...extra,
});

describe("Melodie und Tempo", () => {
  const ohne = [0, 1, 2, 3].map((i) => zeile(i, 200));

  it("langsamere Zeilen mit Melodie senken das Tempo nicht", () => {
    const stats0 = computePupilStats(ohne);
    const mit = [...ohne, zeile(4, 120, { melodie: true }), zeile(5, 100, { melodie: true })];
    const stats1 = computePupilStats(mit);
    expect(stats1.avgCpm).toBeCloseTo(stats0.avgCpm, 5);
    expect(scoreAusStats(stats1).wert).toBe(scoreAusStats(stats0).wert);
  });

  it("schnellere Zeilen mit Melodie heben es", () => {
    const stats0 = computePupilStats(ohne);
    const stats1 = computePupilStats([...ohne, zeile(4, 260, { melodie: true })]);
    expect(stats1.avgCpm).toBeGreaterThan(stats0.avgCpm);
  });

  it("die Genauigkeit zählt weiter - auch die der Melodie-Zeilen", () => {
    const stats = computePupilStats([...ohne, zeile(4, 100, { melodie: true, errors: 20 })]);
    expect(stats.errors).toBe(20);
    expect(stats.accuracy).toBeLessThan(1);
    expect(stats.tasks).toBe(5);
  });

  it("ohne Zeile ohne Melodie gibt es nichts, was sinken könnte: alle zählen", () => {
    const nur = [zeile(0, 100, { melodie: true }), zeile(1, 120, { melodie: true })];
    expect(tempoOhneBremsendeMelodie(nur)).toHaveLength(2);
    expect(computePupilStats(nur).avgCpm).toBeGreaterThan(0);
  });

  it("die Reihenfolge der Zeilen ändert nichts", () => {
    const a = [zeile(0, 100, { melodie: true }), ...ohne];
    const b = [...ohne, zeile(0, 100, { melodie: true })];
    expect(computePupilStats(a).avgCpm).toBeCloseTo(computePupilStats(b).avgCpm, 5);
  });

  it("überlebt die Packung", () => {
    const liste = [zeile(0, 200), zeile(1, 150, { melodie: true, blurred: true, lang: "en" })];
    const zurueck = unpackEvents(packEvents(liste));
    expect(zurueck[0].melodie).toBeUndefined();
    expect(zurueck[1].melodie).toBe(true);
    expect(zurueck[1].blurred).toBe(true);
    expect(zurueck[1].lang).toBe("en");
  });
});
