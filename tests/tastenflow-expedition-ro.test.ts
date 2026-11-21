/**
 * ★★★ WÄCHTER: die Rate-Wörter der Polarstation auf Weg „ro" (Rumänisch, O-INHALT-RO, 29.10.2026). Vorbild:
 * `tests/tastenflow-expedition-cs.test.ts`.
 *
 * Bis hierher zog Weg „ro" den ENGLISCHEN Vorrat mit englischer Stimme (Rückfall G2-NEUN). Geprüft wird die Liste selbst (Form,
 * Hausregeln, Sperrliste, Herkunft aus dem Übungswortschatz des Weges) und der Weg, auf dem die Station sie zieht
 * (`stationGuessWords`), an JEDER Sprosse der Reihenfolge und auf beiden Pflicht-Tastaturen (ro, ro-prog).
 * ⚠️ Anders als bei cs ist „jedes Wort steht im Vorlese-Lexikon" NICHT prüfbar: das Fach „ro" baut erst F8 (`lexicon.ts`).
 */
import { afterEach, describe, expect, it } from "vitest";
import { WORDS_EN, rateWortSprache, stationGuessWords } from "@/lib/typing/expedition/words";
import { WORDS_RO_EXPEDITION } from "@/lib/typing/expedition/wordsRo";
import { WORDS_RO, STUFE_VOCAB_RO } from "@/lib/typing/wordsRo";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { gesperrtRo } from "@/lib/typing/sperrlisteRo";

const LISTE = WORDS_RO_EXPEDITION;
const FORM = /^[a-zăâîșț]{3,6}$/u;

/** Sprossen ohne eigenes Wort - nur Buchstaben, die fast nur in Fremdwörtern stehen (benannt, damit eine neue Lücke auffällt). */
const OHNE_EIGENE_WOERTER: string[] = [];
/** Wörter, die in dieser Sprache genauso heissen wie in der englischen Liste (Fremdwörter; geprüft 29.10.2026). */
const GLEICH_WIE_EN = new Set<string>(["deal", "expert"]);

afterEach(() => setLayout("de"));

describe("★ WORDS_RO_EXPEDITION: Form und Hausregeln", () => {
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
    expect(LISTE.filter((w) => gesperrtRo(w))).toEqual([]);
  });

  it("kein Tier, das als Schimpfwort gegen ein Kind dient, kein Wort über Tod, Waffen, Rausch, Glaube", () => {
    const heikel = ["măgar","porc","vacă","maimuță","moarte","armă","vin","bere","biserică","dumnezeu","război","cuțit"];
    expect(LISTE.filter((w) => heikel.includes(w))).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Strich und fremde Zeichen fallen auf", () => {
    expect(["Nor","ş","ţ"].filter((w) => FORM.test(w))).toEqual([]);
  });

  it("jedes Wort stammt aus dem Übungswortschatz des Weges (WORDS_RO/STUFE_VOCAB_RO) - nichts erfunden, nichts Englisches", () => {
    const basis = new Set([...WORDS_RO, ...Object.values(STUFE_VOCAB_RO).flat()]);
    expect(LISTE.filter((w) => !basis.has(w))).toEqual([]);
  });

  it("Bezug zur Szene: Wetter, Eis, Landschaft", () => {
    for (const w of ["zăpadă","munte","vânt","soare","nor","pădure","tren","hotel"]) expect(LISTE, w).toContain(w);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „ro“ nur aus der eigenen Liste - an jeder Sprosse", () => {
  const eigen = new Set(LISTE);
  for (const tastatur of ["ro","ro-prog"] as const) {
    it(`${tastatur}: ab „e“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("ro");
      const fehler: string[] = [];
      for (let n = reihenfolge.indexOf("e") + 1; n <= reihenfolge.length; n++) {
        const stand = reihenfolge.slice(0, n);
        const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
        for (const seed of [0, 5, 17]) {
          const woerter = stationGuessWords(stand, { lernweg: "ro", seed });
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
    const buchstaben = introOrder("ro").filter((u) => u !== SHIFT_UNIT && FORM.test(u.repeat(3)));
    const ohne: string[] = [];
    for (let i = buchstaben.indexOf("e"); i < buchstaben.length; i++) {
      const vorher = new Set(buchstaben.slice(0, i));
      const neu = buchstaben[i];
      if (!LISTE.some((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c)))) ohne.push(neu);
    }
    expect(ohne).toEqual(OHNE_EIGENE_WOERTER);
  });

  it("die Stimme des gelösten Wortes ist die Sprache des Weges, und es kommt kein englisches Wort mehr", () => {
    expect(rateWortSprache("ro")).toBe("ro");
    const en = new Set(WORDS_EN);
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...introOrder("ro")], { lernweg: "ro", seed })) {
        expect(eigen.has(w), w).toBe(true);
        expect(w).toBe(w.toLowerCase());
      }
    expect(LISTE.filter((w) => en.has(w) && !GLEICH_WIE_EN.has(w))).toEqual([]);
    expect([...GLEICH_WIE_EN].filter((w) => !LISTE.includes(w) || !en.has(w))).toEqual([]);
  });
});
