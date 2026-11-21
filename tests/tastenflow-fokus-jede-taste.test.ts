/**
 * ★★★ SPRACHEN-9 (30.10.2026, Fund Johannes): WIRD JEDE GELERNTE TASTE GEÜBT, WENN „MEIN TRAINING" SIE ÜBEN WILL?
 *
 * Eine Einheit, die auf keiner Liste des Weges steht, landet in `nurErlaubt` und bekommt keine eigene Zeile. Beim Apostroph und
 * bei Totasten ist das gewollt (sie stecken im Wort) - beim `;` als Grundtaste auf Weg „nl" war es eine Nebenwirkung: Das Kind übt
 * eine schwache Taste, und sie kommt in keiner Zeile vor. Gemessen wird die Runde selbst, nicht die Einteilung.
 */
import { afterEach, describe, expect, it } from "vitest";
import { adaptiveRound, rundenEinheiten } from "../src/lib/typing/generator";
import { introOrder, SHIFT_UNIT, totastenVokale } from "../src/lib/typing/letters";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { lernwegDef, type Lernweg } from "../src/lib/typing/lernweg";

const TASTATUREN: Readonly<Record<string, readonly string[]>> = {
  bg: ["bg", "bg-schreibm", "bg-phon", "bg-phon-trad"],
  el: ["el", "el-220", "el-319"],
  hu: ["hu", "hu-101"],
  nl: ["nl-intl", "be", "nl-dutch"],
  pt: ["pt"],
  br: ["br-abnt2"],
  ro: ["ro", "ro-prog"],
  sv: ["sv"],
  uk: ["ua", "ua-std"],
};

/** Kommt die Einheit (oder ein Buchstabe, den sie ergibt) in einer Runde vor, die sie üben soll? */
function wirdGeuebt(weg: Lernweg, einheit: string, runden = 5): boolean {
  const intro = introOrder(weg);
  const such = [einheit, ...(lernwegDef(weg).totastenZiele?.[einheit] ?? [])];
  for (let r = 0; r < runden; r++) {
    const zeilen = adaptiveRound({ introduced: intro, focus: [einheit], lernweg: weg, lang: weg as never, count: 12, uebungsZeilen: 2 });
    if (zeilen.some((z) => such.some((c) => z.text.toLowerCase().includes(c.toLowerCase())))) return true;
  }
  return false;
}

afterEach(() => setLayout("de"));

describe("★★★ jede Taste der neun Wege wird geübt, wenn die Runde sie üben soll", () => {
  // `΅` (ΐ ΰ) ist auf „el" erst seit den Wörtern ταΐζω … zu üben; ΰ allein bleibt ohne gebräuchliches Wort.
  for (const [weg, ids] of Object.entries(TASTATUREN)) {
    for (const id of ids) {
      it(`${weg} auf ${id}`, () => {
        setLayout(id as LayoutId);
        const nie = introOrder(weg as Lernweg).filter((u) => u !== SHIFT_UNIT && !wirdGeuebt(weg as Lernweg, u));
        expect(nie).toEqual([]);
      }, 120000);
    }
  }
});

describe("das Semikolon als Grundtaste", () => {
  it("nl: `;` ist ein Satzzeichen wie auf Weg „en“, nicht „nur erlaubt“ (alle drei Tastaturen)", () => {
    for (const id of TASTATUREN.nl) {
      setLayout(id as LayoutId);
      const e = rundenEinheiten(introOrder("nl"), "nl");
      expect(e.puncts, id).toContain(";");
      expect(e.nurErlaubt, id).not.toContain(";");
    }
  });
  it("der Apostroph und die Totasten bleiben „nur erlaubt“ - sie stecken im Wort", () => {
    setLayout("nl-intl");
    expect(rundenEinheiten(introOrder("nl"), "nl").nurErlaubt).toContain("'");
    setLayout("ua");
    expect(rundenEinheiten(introOrder("uk"), "uk").nurErlaubt).toContain("'");
    setLayout("pt");
    expect(rundenEinheiten(introOrder("pt"), "pt").nurErlaubt).toEqual(expect.arrayContaining(["~", "´", "^", "`"]));
  });
  it("pl: `;` ebenso (Johannes 30.10.2026) - und es wird geübt", () => {
    setLayout("pl");
    const e = rundenEinheiten(introOrder("pl"), "pl");
    expect(e.puncts).toContain(";");
    expect(e.nurErlaubt).not.toContain(";");
    expect(wirdGeuebt("pl", ";")).toBe(true);
  });
  it("die anderen Wege mit eigenen Listen: die Regel trifft nichts", () => {
    for (const [weg, id] of [["fr", "fr"], ["es", "es"], ["it", "it"], ["tr", "tr-q"], ["cs", "cs"]] as const) {
      setLayout(id);
      expect(rundenEinheiten(introOrder(weg), weg).puncts.filter((c) => !lernwegDef(weg).punctOrder.includes(c)), weg).toEqual([]);
    }
  });
});

describe("die Feier nennt den Buchstaben der Totaste", () => {
  it.each([
    ["pt", "pt", "`", ["à"]],
    ["br", "br-abnt2", "`", ["à"]],
    ["nl", "nl-intl", "'", ["é"]],
  ] as const)("%s auf %s: %s ⇒ %j", (weg, id, tot, ziele) => {
    setLayout(id);
    expect(totastenVokale(tot, weg)).toEqual(ziele);
  });
  it("nl auf `be` und `nl-dutch`: `'` ist dort keine Totaste - die Feier sagt nichts dazu", () => {
    for (const id of ["be", "nl-dutch"] as const) {
      setLayout(id);
      expect(totastenVokale("'", "nl"), id).toEqual([]);
    }
  });
});
