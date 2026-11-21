/**
 * ★★★ WÄCHTER O-INHALT-UK (29.10.2026): ALPHABET-REIHEN UND BUCHSTABENSALAT-NAMEN AUF WEG „uk"
 * (`uebungsformen/alphabetUk.ts`, `uebungsformen/salatNamenUk.ts`). Vorbild: `tastenflow-wortspiele-cs.test.ts` §6.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { introOrder } from "@/lib/typing/letters";
import { fitText } from "@/lib/typing/corpus";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import { ALPHABET_ORDER_UK } from "@/lib/typing/uebungsformen/alphabetUk";
import { SALAT_KEINE_WOERTER_UK, SALAT_NAMEN_UK } from "@/lib/typing/uebungsformen/salatNamenUk";
import { SALAT_KEINE_WOERTER, SALAT_NAMEN } from "@/lib/typing/uebungsformen/salatNamen";
import { CORPUS_UK } from "@/lib/typing/corpusUk";
import { WORDS_UK, STUFE_VOCAB_UK } from "@/lib/typing/wordsUk";

const TASTATUREN: readonly LayoutId[] = ["ua", "ua-std"];
const AZBUKA = ["а", "б", "в", "г", "ґ", "д", "е", "є", "ж", "з", "и", "і", "ї", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ь", "ю", "я"];

function zufall(samen: number): () => number {
  let s = samen;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

afterEach(() => setLayout("de"));

describe("★ Alphabet-Reihen auf „uk“: die Абетка, wie Ukrainisch sortiert", () => {
  const form = UEBUNGSFORMEN.find((f) => f.id === "alphabetreihen")!;
  const ctx = (bis: number, shift = false): FormKontext => ({
    lernweg: "uk", introduced: introOrder("uk").slice(0, bis), shift, oneHand: false, stufe: "kids", lang: "uk",
    count: 40, zufall: zufall(3),
  });

  it("die Reihenfolge ist die, nach der Ukrainisch sortiert (Intl.Collator „uk“); ґ є і ї sind eigene Buchstaben", () => {
    expect(ALPHABET_ORDER_UK).toEqual(AZBUKA);
    expect([...AZBUKA].reverse().sort(new Intl.Collator("uk").compare)).toEqual(AZBUKA);
    expect(new Intl.Collator("uk", { sensitivity: "base" }).compare("ґ", "г")).not.toBe(0);
    expect(new Intl.Collator("uk", { sensitivity: "base" }).compare("ї", "і")).not.toBe(0);
  });

  it("jeder Buchstabe der Абетка ist ein Buchstabe des Weges", () => {
    const weg = new Set(introOrder("uk"));
    expect(AZBUKA.filter((b) => !weg.has(b))).toEqual([]);
  });

  for (const tastatur of TASTATUREN) {
    it(`${tastatur}: nach der Grundreihe läuft die Form - nur mit den Tasten der Grundreihe, kyrillisch`, () => {
      setLayout(tastatur);
      expect(form.taugt(ctx(7))).toBe(true);
      const text = form.baue!(ctx(7))!.zeilen.map((z) => z.text).join(" ");
      expect(text).not.toMatch(/[a-z]/i);
      expect(text).toContain("авд");
    });

    it(`${tastatur}: mit allen Buchstaben steht ґ hinter г und ї hinter і, alles tippbar`, () => {
      setLayout(tastatur);
      const voll = introOrder("uk").length;
      const runde = form.baue!(ctx(voll, true))!;
      expect(runde.zeilen.length).toBeGreaterThanOrEqual(20);
      const text = runde.zeilen.map((z) => z.text).join(" ").toLowerCase();
      for (const b of ["гґд", "еєж", "зиі"]) expect(text, b).toContain(b);
      expect(text).not.toMatch(/[ыэёъ]/);
      const erlaubt = new Set(introOrder("uk"));
      for (const z of runde.zeilen) expect(fitText(z.text, erlaubt, "uk", "uk"), z.text).toBe(z.text);
    });
  }

  it("GEGENPROBE: das englische Alphabet (der alte Rückfall) gäbe auf Weg „uk“ keine Reihe", () => {
    const en = "abcdefghijklmnopqrstuvwxyz".split("");
    expect(en.filter((b) => introOrder("uk").includes(b))).toEqual([]);
  });
});

describe("★ Buchstabensalat auf „uk“: Namen und Abkürzungen zählen nicht (salatNamenUk.ts)", () => {
  const korpus = CORPUS_UK.map((c) => c.text).join(" ");
  const kleinImKorpus = new Set((korpus.match(/\p{L}+/gu) ?? []).filter((w) => /^\p{Ll}/u.test(w)));
  const basis = new Set([...WORDS_UK, ...Object.values(STUFE_VOCAB_UK).flat()].map((w) => w.toLowerCase()));

  it("der Verteiler nimmt die ukrainischen Listen (nicht mehr die englischen)", () => {
    expect([...SALAT_NAMEN.uk].sort()).toEqual([...SALAT_NAMEN_UK].sort());
    expect([...SALAT_KEINE_WOERTER.uk].sort()).toEqual([...SALAT_KEINE_WOERTER_UK].sort());
  });

  it("alles klein, ganz ukrainisch-kyrillisch, jedes nur einmal", () => {
    for (const w of [...SALAT_NAMEN_UK, ...SALAT_KEINE_WOERTER_UK]) expect(w, w).toMatch(/^[а-щьюяєіїґ']+$/);
    const alle = [...SALAT_NAMEN_UK, ...SALAT_KEINE_WOERTER_UK];
    expect(alle.filter((w, i) => alle.indexOf(w) !== i)).toEqual([]);
  });

  it("jeder Name steht im Korpus des Weges GROSS und nie klein (belegt, nicht geraten)", () => {
    for (const n of SALAT_NAMEN_UK) {
      const gross = n[0].toLocaleUpperCase("uk-UA") + n.slice(1);
      expect(korpus.includes(gross), `${n} nicht im Korpus`).toBe(true);
      expect(kleinImKorpus.has(n), `${n} steht auch klein - dann ist es ein Wort`).toBe(false);
    }
  });

  it("kein Name ist zugleich ein Wort des Übungswortschatzes (sonst sperrte der Salat ein gewöhnliches Wort)", () => {
    expect(SALAT_NAMEN_UK.filter((n) => basis.has(n))).toEqual([]);
  });

  it("GEGENPROBE: die gewöhnlichen Wörter, die auch Namen sind, fehlen mit Absicht", () => {
    for (const w of ["віра", "роман", "різдво", "чорного"]) expect(SALAT_NAMEN_UK, w).not.toContain(w);
  });
});
