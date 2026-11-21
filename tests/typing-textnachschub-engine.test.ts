/**
 * TN-E2 (Text-Nachschub): Wiederkehr-Engine — Planen, Einweben, Rundenende.
 * Bauplan Sensorik/BAUPLAN-2026-07-27-TASTENFLOW-TEXT-NACHSCHUB.md §3/§7.
 */
import { describe, expect, it } from "vitest";
import {
  arcPlanLineCount,
  planArcRound,
  roundEndArcUpdate,
  weaveArcGroups,
} from "../src/lib/typing/arcEngine";
import { ARC_MAX_PER_ROUND, type Arc } from "../src/lib/typing/arcs";
import { CORPUS } from "../src/lib/typing/corpus";
import { corpusIndexOf } from "../src/lib/typing/corpusManifest";
import { adaptiveRound } from "../src/lib/typing/generator";
import { emptySeen, seenAdd } from "../src/lib/typing/ledger";
import { TIER_CHARS } from "../src/lib/typing/tiers";

// Echte Korpus-Einträge als Arc-Stoff (stabil über bausteinId/corpusIndexOf).
const wissen = CORPUS.filter(
  (e) => (e.kind === "fakt" || e.kind === "wissen") && corpusIndexOf(e.kind, e.text) !== undefined,
);
const [L1, L2, L3] = wissen;
const ref = (e: { kind: string; text: string }) => ({ kind: e.kind, text: e.text });
const idx = (e: { kind: string; text: string }) => corpusIndexOf(e.kind, e.text)!;

const FULL: Set<string> = new Set(TIER_CHARS.flatMap((t) => [...t]));

const ARC: Arc = {
  id: "engine-test",
  topic: "Engine",
  lang: "de",
  stufen: ["b"],
  steps: [
    { rolle: "lehren", bausteine: [ref(L1)] },
    { rolle: "wiederholen", bausteine: [ref(L2), ref(L3)] },
  ],
};

describe("TN-E2 planArcRound", () => {
  it("serviert den fälligen Schritt als Gruppe mit Manifest-Index + exclude", () => {
    const plan = planArcRound({ lernweg: "de",
      arcProgress: undefined,
      seen: emptySeen(),
      story: undefined,
      roundsTotal: 0,
      stufe: "b",
      lang: "de",
      allowed: FULL,
      arcs: [ARC],
    });
    expect(plan.groups).toHaveLength(1);
    expect(plan.groups[0]).toHaveLength(1);
    expect(plan.groups[0][0].source).toBe(idx(L1));
    expect(plan.exclude.has(idx(L1))).toBe(true);
    expect(arcPlanLineCount(plan)).toBe(1);
  });

  it("rückt lokal über schon Getipptes vor und liefert dann das PAAR — Frage vor Antwort", () => {
    // L1 wurde (irgendwo) schon getippt, der Strang-Fortschritt hinkt hinterher:
    const seen = seenAdd(emptySeen(), idx(L1));
    const plan = planArcRound({ lernweg: "de",
      arcProgress: undefined,
      seen,
      story: undefined,
      roundsTotal: 10,
      stufe: "b",
      lang: "de",
      allowed: FULL,
      arcs: [ARC],
    });
    // Auto-Advance passiert nur LOKAL (nicht persistiert) — aber der Plan
    // überspringt den erledigten Lehr-Schritt NICHT sofort: lastRound wird beim
    // lokalen Vorrücken auf roundsTotal gestempelt, der Abstand (3) gilt.
    expect(plan.groups).toHaveLength(0);
  });

  it("höchstens ARC_MAX_PER_ROUND Gruppen pro Runde", () => {
    const arcs: Arc[] = [0, 1, 2].map((i) => ({
      ...ARC,
      id: `viel-${i}`,
      steps: [{ rolle: "lehren", bausteine: [ref(wissen[i])] }],
    }));
    const plan = planArcRound({ lernweg: "de",
      arcProgress: undefined,
      seen: emptySeen(),
      story: undefined,
      roundsTotal: 0,
      stufe: "b",
      lang: "de",
      allowed: FULL,
      arcs,
    });
    expect(plan.groups).toHaveLength(ARC_MAX_PER_ROUND);
  });

  it("Zeile passt nicht zum Tastenstand ⇒ Strang wartet (keine Gruppe)", () => {
    const plan = planArcRound({ lernweg: "de",
      arcProgress: undefined,
      seen: emptySeen(),
      story: undefined,
      roundsTotal: 0,
      stufe: "b",
      lang: "de",
      allowed: new Set(["f", "j"]),
      arcs: [ARC],
    });
    expect(plan.groups).toHaveLength(0);
    expect(plan.exclude.size).toBe(0);
  });
});

describe("TN-E2 weaveArcGroups", () => {
  it("Paar bleibt benachbart und in Reihenfolge (Frage VOR Antwort)", () => {
    const base = Array.from({ length: 10 }, (_, i) => ({ text: `z${i}`, source: null, art: "unsinn" as const }));
    const pair = [
      { text: "frage", source: 1, art: "text" as const },
      { text: "antwort", source: 2, art: "text" as const },
    ];
    for (let i = 0; i < 25; i++) {
      const out = weaveArcGroups(base, [pair]);
      const at = out.findIndex((l) => l.text === "frage");
      expect(at).toBeGreaterThanOrEqual(0);
      expect(out[at + 1]?.text).toBe("antwort");
      expect(out).toHaveLength(12);
    }
  });

  it("mehrere Gruppen: jede bleibt in sich zusammenhängend", () => {
    const base = Array.from({ length: 8 }, (_, i) => ({ text: `z${i}`, source: null, art: "unsinn" as const }));
    const g1 = [{ text: "a1", source: 1, art: "text" as const }, { text: "a2", source: 2, art: "text" as const }];
    const g2 = [{ text: "b1", source: 3, art: "text" as const }];
    for (let i = 0; i < 25; i++) {
      const out = weaveArcGroups(base, [g1, g2]);
      const a1 = out.findIndex((l) => l.text === "a1");
      expect(out[a1 + 1]?.text).toBe("a2");
      expect(out.filter((l) => l.source !== null)).toHaveLength(3);
    }
  });
});

describe("TN-E2 roundEndArcUpdate", () => {
  it("zählt die Runde und rückt Stränge über frisch Getipptes vor", () => {
    const seen = seenAdd(emptySeen(), idx(L1));
    const upd = roundEndArcUpdate({ lernweg: "de",
      arcProgress: undefined,
      seen,
      story: undefined,
      roundsTotal: 4,
      stufe: "b",
      lang: "de",
      arcs: [ARC],
    });
    expect(upd.roundsTotal).toBe(5);
    expect(upd.arcProgress?.["engine-test"]).toEqual({ step: 1, lastRound: 5 });
  });

  it("ohne Ereignis: nur der Zähler steigt", () => {
    const upd = roundEndArcUpdate({ lernweg: "de",
      arcProgress: undefined,
      seen: emptySeen(),
      story: undefined,
      roundsTotal: undefined,
      stufe: "b",
      lang: "de",
      arcs: [ARC],
    });
    expect(upd.roundsTotal).toBe(1);
    expect(upd.arcProgress?.["engine-test"]).toBeUndefined();
  });
});

describe("TN-E2 Generator-exclude", () => {
  it("adaptiveRound zieht ausgeschlossene Bausteine nie selbst", () => {
    const intro = [..."abcdefghijklmnopqrstuvwxyzäöüß", ".", ","];
    const banned = new Set([idx(L1), idx(L2), idx(L3)]);
    for (let i = 0; i < 10; i++) {
      const round = adaptiveRound({ lernweg: "de",
        introduced: intro,
        stufe: "b",
        lang: "de",
        count: 12,
        seen: emptySeen(),
        exclude: banned,
      });
      for (const l of round) {
        if (l.source !== null) expect(banned.has(l.source)).toBe(false);
      }
    }
  });
});
