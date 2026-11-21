/**
 * TN-E1 (Text-Nachschub): Themenstrang-Primitive — Fälligkeit, Auto-Vorrücken,
 * Validierung, Persistenz-Durchreichung. Bauplan
 * Sensorik/BAUPLAN-2026-07-27-TASTENFLOW-TEXT-NACHSCHUB.md §3.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  ARC_DELAY_DEFAULT,
  ARCS,
  advanceArc,
  arcAutoAdvance,
  arcDueStep,
  arcStateFor,
  arcStepErledigt,
  arcsFor,
  isArcDone,
  validateArc,
  type Arc,
  type ArcContext,
} from "../src/lib/typing/arcs";
import { emptySeen, seenAdd } from "../src/lib/typing/ledger";
import { loadProgress, saveProgress } from "../src/lib/typing/progress";

// Test-Arc mit fester Index-Zuordnung (indexOf als Fake — Primitive sind rein).
const INDEX: Record<string, number> = {
  "wissen|die spinne hat acht beine": 0,
  "fakt|weisst du noch wie viele beine": 1,
  "fakt|acht beine ein insekt hat sechs": 2,
  "fakt|spinnenseide ist zugfester als stahl": 3,
  "witz|was liest eine spinne das netz": 4,
};
const ref = (kind: string, text: string) => ({ kind, text });
const fakeIndexOf = (kind: string, text: string): number | undefined =>
  INDEX[`${kind}|${text}`];

const ARC: Arc = {
  id: "spinne-test",
  topic: "Die Spinne",
  lang: "de",
  stufen: ["kids", "teens"],
  steps: [
    { rolle: "lehren", bausteine: [ref("wissen", "die spinne hat acht beine")] },
    {
      rolle: "wiederholen",
      bausteine: [
        ref("fakt", "weisst du noch wie viele beine"),
        ref("fakt", "acht beine ein insekt hat sechs"),
      ],
    },
    {
      rolle: "vertiefen",
      bausteine: [ref("fakt", "spinnenseide ist zugfester als stahl")],
      delayRounds: 5,
    },
    { rolle: "belohnen", bausteine: [ref("witz", "was liest eine spinne das netz")] },
  ],
};

const SERIE_ARC: Arc = {
  id: "serie-test",
  topic: "Serien-Voraussetzung",
  lang: "de",
  stufen: ["teens"],
  steps: [
    { rolle: "lehren", serieRef: { slug: "die-spinne", etappe: 1 } },
    { rolle: "wiederholen", bausteine: [ref("fakt", "weisst du noch wie viele beine")] },
  ],
};

function ctx(over: Partial<ArcContext> = {}): ArcContext {
  return {
    seen: emptySeen(),
    indexOf: fakeIndexOf,
    story: undefined,
    roundsTotal: 0,
    ...over,
  };
}

describe("TN-E1 Arc-Primitive", () => {
  it("arcStateFor: Default vor Schritt 0, lastRound -1", () => {
    expect(arcStateFor(undefined, "spinne-test")).toEqual({ step: 0, lastRound: -1 });
  });

  it("Schritt 0 ist sofort fällig (kein Mindestabstand ohne Vorschritt)", () => {
    const due = arcDueStep(ARC, arcStateFor(undefined, ARC.id), ctx());
    expect(due?.rolle).toBe("lehren");
  });

  it("advanceArc rückt vor und stempelt lastRound; isArcDone am Ende", () => {
    let p = advanceArc(undefined, ARC, 7);
    expect(arcStateFor(p, ARC.id)).toEqual({ step: 1, lastRound: 7 });
    p = advanceArc(p, ARC, 8);
    p = advanceArc(p, ARC, 9);
    p = advanceArc(p, ARC, 10);
    expect(isArcDone(ARC, arcStateFor(p, ARC.id))).toBe(true);
    expect(arcDueStep(ARC, arcStateFor(p, ARC.id), ctx({ roundsTotal: 99 }))).toBeNull();
  });

  it("Mindestabstand: Folgeschritt erst nach delayRounds (Default 3) fällig", () => {
    const p = advanceArc(undefined, ARC, 10); // Schritt 0 erledigt bei Runde 10
    const st = arcStateFor(p, ARC.id);
    expect(arcDueStep(ARC, st, ctx({ roundsTotal: 10 + ARC_DELAY_DEFAULT - 1 }))).toBeNull();
    const due = arcDueStep(ARC, st, ctx({ roundsTotal: 10 + ARC_DELAY_DEFAULT }));
    expect(due?.rolle).toBe("wiederholen");
    expect(due?.bausteine).toHaveLength(2); // Frage/Antwort-PAAR
  });

  it("eigener delayRounds gewinnt über den Default", () => {
    let p = advanceArc(undefined, ARC, 0);
    p = advanceArc(p, ARC, 4); // Schritt 1 erledigt bei Runde 4 → Schritt 2 hat delay 5
    const st = arcStateFor(p, ARC.id);
    expect(arcDueStep(ARC, st, ctx({ roundsTotal: 8 }))).toBeNull();
    expect(arcDueStep(ARC, st, ctx({ roundsTotal: 9 }))?.rolle).toBe("vertiefen");
  });

  it("arcStepErledigt: alle Bausteine gesehen ⇒ erledigt; einer fehlt ⇒ nicht", () => {
    let seen = seenAdd(emptySeen(), 1);
    expect(arcStepErledigt(ARC.steps[1], ctx({ seen }))).toBe(false);
    seen = seenAdd(seen, 2);
    expect(arcStepErledigt(ARC.steps[1], ctx({ seen }))).toBe(true);
  });

  it("serieRef: wartet auf die gelesene Etappe, wird nie serviert", () => {
    const st = arcStateFor(undefined, SERIE_ARC.id);
    // Nicht serviert (auch wenn fällig): serieRef-Schritte warten nur.
    expect(arcDueStep(SERIE_ARC, st, ctx())).toBeNull();
    // Etappe 1 noch nicht durch (etappe zeigt die NÄCHSTE fällige Etappe):
    expect(
      arcStepErledigt(SERIE_ARC.steps[0], ctx({ story: { "die-spinne": { etappe: 1 } } })),
    ).toBe(false);
    expect(
      arcStepErledigt(SERIE_ARC.steps[0], ctx({ story: { "die-spinne": { etappe: 2 } } })),
    ).toBe(true);
    expect(
      arcStepErledigt(SERIE_ARC.steps[0], ctx({ story: { "die-spinne": { etappe: 0, done: true } } })),
    ).toBe(true);
  });

  it("arcAutoAdvance zieht über erledigte Schritte vor (Serie gelesen + Zeile schon getippt)", () => {
    const seen = seenAdd(emptySeen(), 1);
    const p = arcAutoAdvance(undefined, SERIE_ARC, ctx({
      seen,
      story: { "die-spinne": { etappe: 2 } },
      roundsTotal: 12,
    }));
    // Schritt 0 (Serie gelesen) UND Schritt 1 (Zeile 1 schon gesehen) übersprungen:
    expect(arcStateFor(p, SERIE_ARC.id)).toEqual({ step: 2, lastRound: 12 });
    expect(isArcDone(SERIE_ARC, arcStateFor(p, SERIE_ARC.id))).toBe(true);
  });

  it("arcAutoAdvance ohne erledigte Schritte ändert nichts", () => {
    const p = arcAutoAdvance(undefined, ARC, ctx());
    expect(arcStateFor(p, ARC.id)).toEqual({ step: 0, lastRound: -1 });
  });

  it("unbekannter Baustein (Autorenfehler) macht den Schritt still statt kaputt", () => {
    const broken: Arc = {
      ...ARC,
      id: "kaputt",
      steps: [{ rolle: "lehren", bausteine: [ref("fakt", "gibt es nicht")] }],
    };
    expect(arcDueStep(broken, arcStateFor(undefined, "kaputt"), ctx())).toBeNull();
    expect(arcStepErledigt(broken.steps[0], ctx())).toBe(false);
  });
});

describe("TN-E1 validateArc", () => {
  it("gültiger Arc: keine Verstöße", () => {
    expect(validateArc(ARC)).toEqual([]);
    expect(validateArc(SERIE_ARC)).toEqual([]);
  });

  it("fängt: Schritt 0 nicht lehren, >2 Bausteine, beides/keines, schlechter delay", () => {
    const bad: Arc = {
      id: "Bad_ID",
      topic: "x",
      lang: "de",
      stufen: [],
      steps: [
        { rolle: "witz" as never, bausteine: [ref("a", "b"), ref("c", "d"), ref("e", "f")] },
        { rolle: "wiederholen" },
        { rolle: "vertiefen", bausteine: [ref("a", "b")], serieRef: { slug: "s", etappe: 0 }, delayRounds: 0 },
      ],
    };
    const errs = validateArc(bad);
    expect(errs.some((e) => e.includes("kebab-case"))).toBe(true);
    expect(errs.some((e) => e.includes("keine Stufen"))).toBe(true);
    expect(errs.some((e) => e.includes('Schritt 0 muss "lehren"'))).toBe(true);
    expect(errs.some((e) => e.includes("höchstens 2 Bausteine"))).toBe(true);
    expect(errs.some((e) => e.includes("genau EINES"))).toBe(true);
    expect(errs.some((e) => e.includes("delayRounds"))).toBe(true);
  });

  it("Registry: alle registrierten Arcs sind gültig (append-only ab TN-E3)", () => {
    for (const a of ARCS) expect(validateArc(a)).toEqual([]);
  });

  it("arcsFor filtert nach Sprache und Stufe", () => {
    // Registry ist in TN-E1 leer — Filter-Logik über die Test-Arcs geprüft:
    expect(arcsFor("teens", "de", "de")).toEqual(
      ARCS.filter((a) => a.lang === "de" && a.stufen.includes("teens")),
    );
  });
});

describe("TN-E1 Persistenz-Durchreichung (loadProgress)", () => {
  beforeEach(() => localStorage.clear());

  it("roundsTotal + arcProgress überleben Speichern/Laden", () => {
    saveProgress({
      xp: 5,
      lessons: {},
      letters: {},
      roundsTotal: 42,
      arcProgress: { spinne: { step: 2, lastRound: 40 } },
    });
    const p = loadProgress();
    expect(p.roundsTotal).toBe(42);
    expect(p.arcProgress).toEqual({ spinne: { step: 2, lastRound: 40 } });
  });

  it("Altstände ohne die neuen Felder laden unverändert (undefined, kein Bruch)", () => {
    saveProgress({ xp: 1, lessons: {}, letters: {} });
    const p = loadProgress();
    expect(p.roundsTotal).toBeUndefined();
    expect(p.arcProgress).toBeUndefined();
  });
});
