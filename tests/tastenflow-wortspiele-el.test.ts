/**
 * ★★★ WÄCHTER O-INHALT-EL (29.10.2026): ALPHABET-REIHEN UND BUCHSTABENSALAT-NAMEN AUF WEG „el"
 * (`uebungsformen/alphabetEl.ts`, `uebungsformen/salatNamenEl.ts`). Vorbild: `tastenflow-wortspiele-cs.test.ts` §6.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { introOrder } from "@/lib/typing/letters";
import { fitText } from "@/lib/typing/corpus";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import { ALPHABET_ORDER_EL } from "@/lib/typing/uebungsformen/alphabetEl";
import { SALAT_KEINE_WOERTER_EL, SALAT_NAMEN_EL } from "@/lib/typing/uebungsformen/salatNamenEl";
import { SALAT_KEINE_WOERTER, SALAT_NAMEN } from "@/lib/typing/uebungsformen/salatNamen";
import { CORPUS_EL } from "@/lib/typing/corpusEl";
import { WORDS_EL, STUFE_VOCAB_EL } from "@/lib/typing/wordsEl";

const TASTATUREN: readonly LayoutId[] = ["el", "el-220", "el-319"];
const AZBUKA = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω"];

function zufall(samen: number): () => number {
  let s = samen;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

afterEach(() => setLayout("de"));

describe("★ Alphabet-Reihen auf „el“: das Alphabet, wie Griechisch sortiert", () => {
  const form = UEBUNGSFORMEN.find((f) => f.id === "alphabetreihen")!;
  const ctx = (bis: number, shift = false): FormKontext => ({
    lernweg: "el", introduced: introOrder("el").slice(0, bis), shift, oneHand: false, stufe: "kids", lang: "el",
    count: 40, zufall: zufall(3),
  });

  it("die Reihenfolge ist die, nach der Griechisch sortiert (Intl.Collator „el“); ς und die Tonos-Buchstaben sortieren wie ihr Grundbuchstabe und fehlen darum", () => {
    expect(ALPHABET_ORDER_EL).toEqual(AZBUKA);
    expect([...AZBUKA].reverse().sort(new Intl.Collator("el").compare)).toEqual(AZBUKA);
    expect(new Intl.Collator("el", { sensitivity: "base" }).compare("ς", "σ")).toBe(0);
    expect(new Intl.Collator("el", { sensitivity: "base" }).compare("ά", "α")).toBe(0);
    expect(new Intl.Collator("el", { sensitivity: "base" }).compare("ψ", "χ")).not.toBe(0);
  });

  it("jeder Buchstabe des Alphabets ist ein Buchstabe des Weges", () => {
    const weg = new Set(introOrder("el"));
    expect(AZBUKA.filter((b) => !weg.has(b))).toEqual([]);
  });

  for (const tastatur of TASTATUREN) {
    it(`${tastatur}: nach der Grundreihe läuft die Form - nur mit den Tasten der Grundreihe, griechisch`, () => {
      setLayout(tastatur);
      expect(form.taugt(ctx(7))).toBe(true);
      const text = form.baue!(ctx(7))!.zeilen.map((z) => z.text).join(" ");
      expect(text).not.toMatch(/[a-z]/i);
      expect(text).toContain("αδκ");
    });

    it(`${tastatur}: mit allen Buchstaben steht ψ vor ω, nie ς, alles tippbar`, () => {
      setLayout(tastatur);
      const voll = introOrder("el").length;
      const runde = form.baue!(ctx(voll, true))!;
      expect(runde.zeilen.length).toBeGreaterThanOrEqual(20);
      const roh = runde.zeilen.map((z) => z.text).join(" ");
      // `toLowerCase` machte aus einem Σ am Wortende ein ς (Final_Sigma) - die Probe auf ς liest darum den Rohtext.
      expect(roh).not.toMatch(/ς/);
      const text = roh.toLowerCase();
      for (const b of ["χψω", "ξοπ", "ρστ"]) expect(text, b).toContain(b);
      const erlaubt = new Set(introOrder("el"));
      for (const z of runde.zeilen) expect(fitText(z.text, erlaubt, "el", "el"), z.text).toBe(z.text);
    });
  }

  it("GEGENPROBE: das englische Alphabet (der alte Rückfall) gäbe auf Weg „el“ keine Reihe", () => {
    const en = "abcdefghijklmnopqrstuvwxyz".split("");
    expect(en.filter((b) => introOrder("el").includes(b))).toEqual([]);
  });
});

describe("★ Buchstabensalat auf „el“: Namen und Abkürzungen zählen nicht (salatNamenEl.ts)", () => {
  const korpus = CORPUS_EL.map((c) => c.text).join(" ");
  const kleinImKorpus = new Set((korpus.match(/\p{L}+/gu) ?? []).filter((w) => /^\p{Ll}/u.test(w)));
  const basis = new Set([...WORDS_EL, ...Object.values(STUFE_VOCAB_EL).flat()].map((w) => w.toLowerCase()));

  it("der Verteiler nimmt die griechischen Listen (nicht mehr die englischen)", () => {
    expect([...SALAT_NAMEN.el].sort()).toEqual([...SALAT_NAMEN_EL].sort());
    expect([...SALAT_KEINE_WOERTER.el].sort()).toEqual([...SALAT_KEINE_WOERTER_EL].sort());
  });

  it("alles klein, ganz griechisch, jedes nur einmal", () => {
    for (const w of [...SALAT_NAMEN_EL, ...SALAT_KEINE_WOERTER_EL]) expect(w, w).toMatch(/^[α-ωάέήίόύώϊϋΐΰ]+$/);
    const alle = [...SALAT_NAMEN_EL, ...SALAT_KEINE_WOERTER_EL];
    expect(alle.filter((w, i) => alle.indexOf(w) !== i)).toEqual([]);
  });

  it("jeder Name steht im Korpus des Weges GROSS und nie klein (belegt, nicht geraten)", () => {
    for (const n of SALAT_NAMEN_EL) {
      const gross = n[0].toUpperCase() + n.slice(1);
      expect(korpus.includes(gross), `${n} nicht im Korpus`).toBe(true);
      expect(kleinImKorpus.has(n), `${n} steht auch klein - dann ist es ein Wort`).toBe(false);
    }
  });

  it("kein Name ist zugleich ein Wort des Übungswortschatzes (sonst sperrte der Salat ein gewöhnliches Wort)", () => {
    expect(SALAT_NAMEN_EL.filter((n) => basis.has(n))).toEqual([]);
  });

  it("GEGENPROBE: die gewöhnlichen Wörter, die auch Namen sind, fehlen mit Absicht", () => {
    for (const w of ["ζωή", "ειρήνη", "σοφία", "δάφνη", "σάββατο", "κυριακή"]) expect(SALAT_NAMEN_EL, w).not.toContain(w);
  });
});
