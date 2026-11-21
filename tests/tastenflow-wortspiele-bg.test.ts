/**
 * ★★★ WÄCHTER O-INHALT-BG (29.10.2026): ALPHABET-REIHEN UND BUCHSTABENSALAT-NAMEN AUF WEG „bg"
 * (`uebungsformen/alphabetBg.ts`, `uebungsformen/salatNamenBg.ts`). Vorbild: `tastenflow-wortspiele-cs.test.ts` §6.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { introOrder } from "@/lib/typing/letters";
import { fitText } from "@/lib/typing/corpus";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import { ALPHABET_ORDER_BG } from "@/lib/typing/uebungsformen/alphabetBg";
import { SALAT_KEINE_WOERTER_BG, SALAT_NAMEN_BG } from "@/lib/typing/uebungsformen/salatNamenBg";
import { SALAT_KEINE_WOERTER, SALAT_NAMEN } from "@/lib/typing/uebungsformen/salatNamen";
import { CORPUS_BG } from "@/lib/typing/corpusBg";
import { WORDS_BG, STUFE_VOCAB_BG } from "@/lib/typing/wordsBg";

const TASTATUREN: readonly LayoutId[] = ["bg", "bg-schreibm"];
const AZBUKA = ["а", "б", "в", "г", "д", "е", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ь", "ю", "я"];

function zufall(samen: number): () => number {
  let s = samen;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

afterEach(() => setLayout("de"));

describe("★ Alphabet-Reihen auf „bg“: die Азбука, wie Bulgarisch sortiert", () => {
  const form = UEBUNGSFORMEN.find((f) => f.id === "alphabetreihen")!;
  const ctx = (bis: number, shift = false): FormKontext => ({
    lernweg: "bg", introduced: introOrder("bg").slice(0, bis), shift, oneHand: false, stufe: "kids", lang: "bg",
    count: 40, zufall: zufall(3),
  });

  it("die Reihenfolge ist die, nach der Bulgarisch sortiert (Intl.Collator „bg-BG“); ѝ sortiert wie и und fehlt darum", () => {
    expect(ALPHABET_ORDER_BG).toEqual(AZBUKA);
    expect([...AZBUKA].reverse().sort(new Intl.Collator("bg-BG").compare)).toEqual(AZBUKA);
    expect(new Intl.Collator("bg-BG", { sensitivity: "base" }).compare("ѝ", "и")).toBe(0);
    expect(new Intl.Collator("bg-BG", { sensitivity: "base" }).compare("й", "и")).not.toBe(0);
  });

  it("jeder Buchstabe der Азбука ist ein Buchstabe des Weges", () => {
    const weg = new Set(introOrder("bg"));
    expect(AZBUKA.filter((b) => !weg.has(b))).toEqual([]);
  });

  for (const tastatur of TASTATUREN) {
    it(`${tastatur}: nach der Grundreihe läuft die Form - nur mit den Tasten der Grundreihe, kyrillisch`, () => {
      setLayout(tastatur);
      expect(form.taugt(ctx(7))).toBe(true);
      const text = form.baue!(ctx(7))!.zeilen.map((z) => z.text).join(" ");
      expect(text).not.toMatch(/[a-z]/i);
      expect(text).toContain("авм");
    });

    it(`${tastatur}: mit allen Buchstaben steht ъ vor ь und ю vor я, alles tippbar`, () => {
      setLayout(tastatur);
      const voll = introOrder("bg").length;
      const runde = form.baue!(ctx(voll, true))!;
      expect(runde.zeilen.length).toBeGreaterThanOrEqual(20);
      const text = runde.zeilen.map((z) => z.text).join(" ").toLowerCase();
      for (const b of ["щъь", "юя", "ийк"]) expect(text, b).toContain(b);
      expect(text).not.toMatch(/ѝ/);
      const erlaubt = new Set(introOrder("bg"));
      for (const z of runde.zeilen) expect(fitText(z.text, erlaubt, "bg", "bg"), z.text).toBe(z.text);
    });
  }

  it("GEGENPROBE: das englische Alphabet (der alte Rückfall) gäbe auf Weg „bg“ keine Reihe", () => {
    const en = "abcdefghijklmnopqrstuvwxyz".split("");
    expect(en.filter((b) => introOrder("bg").includes(b))).toEqual([]);
  });
});

describe("★ Buchstabensalat auf „bg“: Namen und Abkürzungen zählen nicht (salatNamenBg.ts)", () => {
  const korpus = CORPUS_BG.map((c) => c.text).join(" ");
  const kleinImKorpus = new Set((korpus.match(/\p{L}+/gu) ?? []).filter((w) => /^\p{Ll}/u.test(w)));
  const basis = new Set([...WORDS_BG, ...Object.values(STUFE_VOCAB_BG).flat()].map((w) => w.toLowerCase()));

  it("der Verteiler nimmt die bulgarischen Listen (nicht mehr die englischen)", () => {
    expect([...SALAT_NAMEN.bg].sort()).toEqual([...SALAT_NAMEN_BG].sort());
    expect([...SALAT_KEINE_WOERTER.bg].sort()).toEqual([...SALAT_KEINE_WOERTER_BG].sort());
  });

  it("alles klein, ganz kyrillisch, jedes nur einmal", () => {
    for (const w of [...SALAT_NAMEN_BG, ...SALAT_KEINE_WOERTER_BG]) expect(w, w).toMatch(/^[а-яѝ]+$/);
    const alle = [...SALAT_NAMEN_BG, ...SALAT_KEINE_WOERTER_BG];
    expect(alle.filter((w, i) => alle.indexOf(w) !== i)).toEqual([]);
  });

  it("jeder Name steht im Korpus des Weges GROSS und nie klein (belegt, nicht geraten)", () => {
    for (const n of SALAT_NAMEN_BG) {
      const gross = n[0].toLocaleUpperCase("bg-BG") + n.slice(1);
      expect(korpus.includes(gross), `${n} nicht im Korpus`).toBe(true);
      expect(kleinImKorpus.has(n), `${n} steht auch klein - dann ist es ein Wort`).toBe(false);
    }
  });

  it("kein Name ist zugleich ein Wort des Übungswortschatzes (sonst sperrte der Salat ein gewöhnliches Wort)", () => {
    expect(SALAT_NAMEN_BG.filter((n) => basis.has(n))).toEqual([]);
  });

  it("GEGENPROBE: die gewöhnlichen Wörter, die auch Namen sind, fehlen mit Absicht", () => {
    for (const w of ["мила", "ива", "вида", "сребърна"]) expect(SALAT_NAMEN_BG, w).not.toContain(w);
  });
});
