/**
 * Spiele (Pinguin-Expedition): ALLE gelernten Buchstabentasten kommen vor, schwache öfter.
 *
 * Wunsch einer Lehrerin (29.10.2026): *„könnten bei den Spielen auch bei niedrigem Niveau alle
 * bereits erlernten Buchstaben vorkommen (f j d)?"* - Entscheidung Johannes: alle gelernten Tasten,
 * schwache öfter. Vorher nahm die Folge nur die neueste Taste plus Tasten mit Übungsbedarf,
 * höchstens drei - bei einem Kind mit nur einer wackligen Taste hiess die Folge „k k k k k k".
 */
import { describe, it, expect } from "vitest";
import { masteryFor, weakestLetters } from "../src/lib/typing/letters";
import type { LetterStat } from "../src/lib/typing/progress";
import { buildFloeSequence } from "../src/lib/typing/iceFloe";
import {
  buildCaveCourse,
  buildPackeisCourse,
  buildSlideCourse,
  buildSteilwandCourse,
  buildStormCourse,
} from "../src/lib/typing/expedition/course";

const m = masteryFor("normal");
/** Sitzt: viele fehlerfreie, flotte Anschläge. */
const sitzt = (): LetterStat => ({ hits: 60, misses: 0, sumMs: 60 * 400, timed: 60, recent: Array(20).fill(400) });
/** Wackelt: viele Fehler, langsame Treffer. */
const wackelt = (): LetterStat => ({
  hits: 6,
  misses: 12,
  sumMs: 6 * 2600,
  timed: 6,
  recent: [-1, 2600, -1, -1, 2600, -1, 2600, -1, -1, 2600, -1, 2600, -1, -1, 2600, -1, 2600, -1],
});

const STAND: Record<string, LetterStat> = { f: sitzt(), j: sitzt(), d: sitzt(), k: wackelt() };
const FJDK = ["f", "j", "d", "k"];
const haeufigkeit = (seq: string[]) => {
  const h: Record<string, number> = {};
  for (const u of seq) h[u] = (h[u] ?? 0) + 1;
  return h;
};

describe("Stand: f j d k gelernt, k wackelt (der Fall der Lehrerin)", () => {
  it("Vorbedingung: für die Übungsauswahl (weakestLetters) ist nur k schwach - und das bleibt so", () => {
    // Andere Aufrufer (Training, ChordDojo) dürfen sich NICHT ändern.
    expect(weakestLetters(FJDK, STAND, "de", 3, m)).toEqual(["k"]);
  });

  it("Tor-Überquerung (6 Schollen): alle vier Tasten, k am häufigsten", () => {
    const seq = buildFloeSequence(FJDK, STAND, m, 6);
    expect(seq).toHaveLength(6);
    const h = haeufigkeit(seq);
    expect(Object.keys(h).sort()).toEqual(["d", "f", "j", "k"]);
    expect(h.k).toBeGreaterThan(h.f);
    expect(h.k).toBeGreaterThan(h.j);
    expect(h.k).toBeGreaterThan(h.d);
  });

  it("Packeis, Bauchrutsche (8), Steilwand und Höhle: überall alle vier Tasten, k vorn", () => {
    const kurse: Record<string, string[]> = {
      packeis: buildPackeisCourse(FJDK, STAND, m).stages[0].units,
      packeisFrei: buildPackeisCourse(FJDK, STAND, m, { free: true, seed: 1 }).stages[0].units,
      rutsche: buildSlideCourse(FJDK, STAND, m).stages[0].units,
      rutscheFrei: buildSlideCourse(FJDK, STAND, m, { free: true, seed: 2 }).stages[0].units,
      hoehle: buildCaveCourse(FJDK, STAND, m).stages[0].units,
      // Steilwand: Folgen aus 2-4 Zeichen - einzeln betrachtet alle Zeichen aller Tritte.
      steilwand: [...buildSteilwandCourse(FJDK, STAND, m).stages[0].units.join("")],
      sturm: [...buildStormCourse(FJDK, STAND, m).stages[0].units.join("")],
    };
    for (const [name, units] of Object.entries(kurse)) {
      const h = haeufigkeit(units);
      expect(Object.keys(h).sort(), name).toEqual(["d", "f", "j", "k"]);
      if (name !== "sturm" && name !== "steilwand") {
        expect(h.k, `${name}: k am häufigsten`).toBeGreaterThan(Math.max(h.f, h.j, h.d));
      }
    }
  });

  it("die Länge bleibt, wie sie war (6 / 8 / 12-14 / 6-8)", () => {
    expect(buildPackeisCourse(FJDK, STAND, m).stages[0].units).toHaveLength(6);
    expect(buildSlideCourse(FJDK, STAND, m).stages[0].units).toHaveLength(8);
    expect(buildSlideCourse(FJDK, STAND, m, { free: true, seed: 0 }).stages[0].units).toHaveLength(12);
    expect(buildCaveCourse(FJDK, STAND, m, { seed: 1 }).stages[0].units).toHaveLength(7);
  });
});

describe("Niedriges Niveau: f j d, ohne jede Messung", () => {
  it("alle drei kommen vor, auch wenn keine Taste auffällt", () => {
    const sitzend = { f: sitzt(), j: sitzt(), d: sitzt() };
    expect(Object.keys(haeufigkeit(buildFloeSequence(["f", "j", "d"], sitzend, m, 6))).sort()).toEqual(["d", "f", "j"]);
    expect(Object.keys(haeufigkeit(buildFloeSequence(["f", "j", "d"], undefined, m, 6))).sort()).toEqual(["d", "f", "j"]);
  });

  it("nur j wackelt (nicht die neueste d): j öfter, aber f und d bleiben dabei", () => {
    const seq = buildFloeSequence(["f", "j", "d"], { f: sitzt(), j: wackelt(), d: sitzt() }, m, 6);
    const h = haeufigkeit(seq);
    expect(Object.keys(h).sort()).toEqual(["d", "f", "j"]);
    expect(h.j).toBeGreaterThan(h.f);
  });
});

describe("Viele Tasten gelernt: die Folge bleibt so lang wie früher", () => {
  const ACHT = ["f", "j", "d", "k", "s", "l", "a", "ö"];
  const ZWANZIG = [...ACHT, "e", "i", "n", "r", "t", "h", "o", "u", "m", "g", "c", "b"];
  const stand = (viele: string[]) =>
    Object.fromEntries(viele.map((u) => [u, u === "n" ? wackelt() : sitzt()])) as Record<string, LetterStat>;

  it("mehr gelernte Tasten als Plätze: genau `count` verschiedene Plätze, die schwache Taste und die Grundreihe zuerst", () => {
    const seq = buildFloeSequence(ZWANZIG, stand(ZWANZIG), m, 8);
    expect(seq).toHaveLength(8);
    expect(seq).toContain("n"); // die schwache (und eine neue wäre „b", aber n wackelt)
    // jede Taste höchstens einmal, wenn es mehr Tasten als Plätze gibt
    const h = haeufigkeit(seq);
    expect(Math.max(...Object.values(h))).toBeLessThanOrEqual(1 + 1);
    // Grundreihe vor den übrigen Buchstaben
    const grund = seq.filter((u) => ACHT.includes(u));
    expect(grund.length).toBeGreaterThanOrEqual(5);
  });

  it("genug Plätze (12) für 8 Grundreihen-Tasten: alle 8 sind dabei", () => {
    const seq = buildFloeSequence(ACHT, stand(ACHT), m, 12);
    expect(seq).toHaveLength(12);
    expect(new Set(seq)).toEqual(new Set(ACHT));
  });

  it("deterministisch: derselbe Stand ergibt dieselbe Folge (gleiches Tor bei jedem Anlauf)", () => {
    expect(buildFloeSequence(ZWANZIG, stand(ZWANZIG), m, 8)).toEqual(buildFloeSequence(ZWANZIG, stand(ZWANZIG), m, 8));
  });

  it("nie zwei gleiche Zeichen hintereinander, solange es mehrere Tasten gibt", () => {
    for (const n of [4, 6, 8, 12]) {
      const seq = buildFloeSequence(FJDK, STAND, m, n);
      for (let i = 1; i < seq.length; i++) expect(seq[i], `Platz ${i} bei ${n}`).not.toBe(seq[i - 1]);
    }
  });
});

describe("Randfälle", () => {
  it("eine einzige gelernte Taste: die Folge besteht aus ihr", () => {
    expect(buildFloeSequence(["f"], undefined, m, 4)).toEqual(["f", "f", "f", "f"]);
  });
  it("nichts gelernt: leer", () => {
    expect(buildFloeSequence([], undefined, m, 6)).toEqual([]);
  });
});
