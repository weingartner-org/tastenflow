/**
 * Wächter für die Rückmeldung aus Marburg (Testerin, 28.08.2026):
 *  1. „Es wäre schön, wenn man hören könnte, dass es Großbuchstaben sind."
 *  2. „Buchstabenfolgen werden einzeln genannt, Wörter aber als Ganzes. Für
 *     Schüler, denen es schwer fällt, wäre besser: ‚Saal: S-a-a-l'."
 * Dazu die Entscheidung Johannes: Großbuchstaben, die nur durch die
 * Auto-Großschreibung entstehen (Umschalt noch nicht gelernt), werden GROSS
 * ANGEZEIGT, aber NICHT groß gesprochen - das Kind tippt ja die kleine Taste.
 */
import { describe, expect, it } from "vitest";
import { readPlanAt, spokenLabelFor, GROSS_PITCH } from "../src/lib/typing/voice";

const istWort = (t: string) => ["Saal", "saal", "Kalk", "Fall"].includes(t);
const M = (o: Partial<Parameters<typeof readPlanAt>[2]> = {}) => ({
  letters: false, words: true, sentences: false, ...o,
});

describe("Der erste Buchstabe eines Wortes ging verloren", () => {
  it("Wörter + Buchstaben nannten „Saal, a, a, l“ - das S fehlte", () => {
    const plan: string[] = [];
    for (let i = 0; i < "Saal".length; i++)
      plan.push(...readPlanAt("Saal", i, M({ letters: true }), istWort));
    expect(plan[0]).toBe("Saal");
    expect(plan).toContain("großes S"); // war vorher NICHT dabei
    expect(plan.filter((p) => p === "a")).toHaveLength(2);
    expect(plan).toContain("l");
  });
});

describe("Wort und anschließend buchstabieren", () => {
  it("„Saal: großes S, a, a, l“ - das ganze Wort, dann jeder Buchstabe", () => {
    const plan: string[] = [];
    for (let i = 0; i < "Saal".length; i++)
      plan.push(...readPlanAt("Saal", i, M({ spell: true }), istWort));
    expect(plan).toEqual(["Saal", "großes S", "a", "a", "l"]);
  });

  it("buchstabiert nicht doppelt, wenn auch Buchstaben an sind", () => {
    const plan: string[] = [];
    for (let i = 0; i < "Saal".length; i++)
      plan.push(...readPlanAt("Saal", i, M({ spell: true, letters: true }), istWort));
    expect(plan).toEqual(["Saal", "großes S", "a", "a", "l"]);
  });

  it("ohne den Schalter bleibt alles wie bisher", () => {
    const plan: string[] = [];
    for (let i = 0; i < "Saal".length; i++)
      plan.push(...readPlanAt("Saal", i, M(), istWort));
    expect(plan).toEqual(["Saal"]);
  });
});

describe("Auto-Großschreibung wird nicht groß gesprochen", () => {
  it("solange die Umschalttaste fehlt: angezeigt groß, gesprochen klein", () => {
    expect(spokenLabelFor("S", false)).toBe("s");
    expect(spokenLabelFor("S", true)).toBe("großes S");
    // Zeichen ohne Groß/Klein bleiben unberührt.
    expect(spokenLabelFor(",", false)).toBe(spokenLabelFor(",", true));
  });

  it("gilt auch in der Lese-Reihe", () => {
    const ohne: string[] = [];
    for (let i = 0; i < "Saal".length; i++)
      ohne.push(...readPlanAt("Saal", i, M({ spell: true, shiftLearned: false }), istWort));
    expect(ohne).toEqual(["Saal", "s", "a", "a", "l"]);

    const mit: string[] = [];
    for (let i = 0; i < "Saal".length; i++)
      mit.push(...readPlanAt("Saal", i, M({ spell: true, shiftLearned: true }), istWort));
    expect(mit).toEqual(["Saal", "großes S", "a", "a", "l"]);
  });

  it("fehlt die Angabe, gilt „gelernt“ (Altverhalten)", () => {
    const plan: string[] = [];
    for (let i = 0; i < "Saal".length; i++)
      plan.push(...readPlanAt("Saal", i, M({ spell: true }), istWort));
    expect(plan).toContain("großes S");
  });
});

describe("Stimmlage", () => {
  it("ist eine Zugabe im erlaubten Bereich, nicht der einzige Hinweis", () => {
    expect(GROSS_PITCH).toBeGreaterThan(1);
    expect(GROSS_PITCH).toBeLessThanOrEqual(2);
    // Das Wort „großes“ trägt die Information - auf jeder Stimme und auf der
    // Braillezeile. Deshalb steht es auch dann im Plan, wenn die Tonhöhe wirkt.
    const plan: string[] = [];
    for (let i = 0; i < "Saal".length; i++)
      plan.push(...readPlanAt("Saal", i, M({ spell: true }), istWort));
    expect(plan).toContain("großes S");
  });
});
