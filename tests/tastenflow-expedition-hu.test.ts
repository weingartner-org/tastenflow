/**
 * ★★★ WÄCHTER: die Rate-Wörter der Polarstation auf Weg „hu" (Ungarisch, O-INHALT-HU, 29.10.2026). Vorbild:
 * `tests/tastenflow-expedition-cs.test.ts`.
 *
 * Bis hierher zog Weg „hu" den ENGLISCHEN Vorrat mit englischer Stimme (Rückfall G2-NEUN). Geprüft wird die Liste selbst (Form,
 * Hausregeln, Sperrliste, Herkunft aus dem Übungswortschatz des Weges) und der Weg, auf dem die Station sie zieht
 * (`stationGuessWords`), an JEDER Sprosse der Reihenfolge und auf beiden Pflicht-Tastaturen (hu, hu-101).
 * ⚠️ Anders als bei cs ist „jedes Wort steht im Vorlese-Lexikon" NICHT prüfbar: das Fach „hu" baut erst F8 (`lexicon.ts`).
 */
import { afterEach, describe, expect, it } from "vitest";
import { WORDS_EN, rateWortSprache, stationGuessWords } from "@/lib/typing/expedition/words";
import { WORDS_HU_EXPEDITION } from "@/lib/typing/expedition/wordsHu";
import { WORDS_HU, STUFE_VOCAB_HU } from "@/lib/typing/wordsHu";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { gesperrtHu } from "@/lib/typing/sperrlisteHu";

const LISTE = WORDS_HU_EXPEDITION;
const FORM = /^[a-záéíóöőúüű]{3,6}$/u;

/** Sprossen ohne eigenes Wort - nur Buchstaben, die fast nur in Fremdwörtern stehen (benannt, damit eine neue Lücke auffällt). */
const OHNE_EIGENE_WOERTER: string[] = [];
/** Wörter, die in dieser Sprache genauso heissen wie in der englischen Liste (Fremdwörter; geprüft 29.10.2026). */
const GLEICH_WIE_EN = new Set<string>(["extra"]);

afterEach(() => setLayout("de"));

describe("★ WORDS_HU_EXPEDITION: Form und Hausregeln", () => {
  it("mindestens 200 Wörter, jedes nur einmal, kein zweites mit denselben Buchstaben", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(200);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
    const sig = LISTE.map((w) => [...w].sort().join(""));
    expect(LISTE.filter((_, i) => sig.indexOf(sig[i]) !== i)).toEqual([]);
  });

  it("klein, 3 bis 6 Buchstaben, nur Buchstaben der Sprache (kein Strich, kein Grossbuchstabe)", () => {
    expect(LISTE.filter((w) => !FORM.test(w))).toEqual([]);
  });

  it("keine Sperrwörter", () => {
    expect(LISTE.filter((w) => gesperrtHu(w))).toEqual([]);
  });

  it("kein Tier, das als Schimpfwort gegen ein Kind dient, kein Wort über Tod, Waffen, Rausch, Glaube", () => {
    const heikel = ["majom","liba","birka","tyúk","szamár","disznó","kés","halál","bor","sör","isten","templom","fegyver","rák"];
    expect(LISTE.filter((w) => heikel.includes(w))).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Strich und fremde Zeichen fallen auf", () => {
    expect(["Hold","ha-ha","xyzxyz1"].filter((w) => FORM.test(w))).toEqual([]);
  });

  it("jedes Wort stammt aus dem Übungswortschatz des Weges (WORDS_HU/STUFE_VOCAB_HU) - nichts erfunden, nichts Englisches", () => {
    const basis = new Set([...WORDS_HU, ...Object.values(STUFE_VOCAB_HU).flat()]);
    expect(LISTE.filter((w) => !basis.has(w))).toEqual([]);
  });

  it("Bezug zur Szene: Wetter, Eis, Landschaft", () => {
    for (const w of ["jég","hold","hegy","szél","vihar","tenger","sziget","hajó","erdő"]) expect(LISTE, w).toContain(w);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „hu“ nur aus der eigenen Liste - an jeder Sprosse", () => {
  const eigen = new Set(LISTE);
  for (const tastatur of ["hu","hu-101"] as const) {
    it(`${tastatur}: ab „e“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("hu");
      const fehler: string[] = [];
      for (let n = reihenfolge.indexOf("e") + 1; n <= reihenfolge.length; n++) {
        const stand = reihenfolge.slice(0, n);
        const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
        for (const seed of [0, 5, 17]) {
          const woerter = stationGuessWords(stand, { lernweg: "hu", seed });
          if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
          for (const w of woerter) {
            if (!eigen.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
            if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
          }
        }
      }
      expect(fehler).toEqual([]);
    });
  }

  it("jede Sprosse mit neuem Buchstaben ab „e“ bringt eigene Wörter (sonst ist die Liste falsch geschnitten)", () => {
    const buchstaben = introOrder("hu").filter((u) => u !== SHIFT_UNIT && FORM.test(u.repeat(3)));
    const ohne: string[] = [];
    for (let i = buchstaben.indexOf("e"); i < buchstaben.length; i++) {
      const vorher = new Set(buchstaben.slice(0, i));
      const neu = buchstaben[i];
      if (!LISTE.some((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c)))) ohne.push(neu);
    }
    expect(ohne).toEqual(OHNE_EIGENE_WOERTER);
  });

  it("die Stimme des gelösten Wortes ist die Sprache des Weges, und es kommt kein englisches Wort mehr", () => {
    expect(rateWortSprache("hu")).toBe("hu");
    const en = new Set(WORDS_EN);
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...introOrder("hu")], { lernweg: "hu", seed })) {
        expect(eigen.has(w), w).toBe(true);
        expect(w).toBe(w.toLowerCase());
      }
    expect(LISTE.filter((w) => en.has(w) && !GLEICH_WIE_EN.has(w))).toEqual([]);
    expect([...GLEICH_WIE_EN].filter((w) => !LISTE.includes(w) || !en.has(w))).toEqual([]);
  });
});
