/**
 * ★★★★ WÄCHTER D1 Nr. 19 (28.09.2026, Entscheidung Johannes: „Klammern als
 * festes Paar - ja"): ( ) [ ] { } werden wie ¿?/¡! behandelt - auf JEDEM Weg.
 *
 * Der Fund: an der Sprosse von „(" strich `fitText` das noch ungelernte „)"
 * (runde Klammern sind weglassbar) - ein Kind tippte „… en La Paz (Bolivia en
 * julio." (gemessen, pruefstand/d1/m19-klammer-paare.mts: fr 58, es 43 Zeilen).
 *
 * Geprüft über die FEHLERKLASSE:
 *  1. Freischaltung: auf jedem Weg und jeder Tastatur kommen ( ) / [ ] / { }
 *     GEMEINSAM (`paareGemeinsam`, `advanceIntroduced`) - nie einzeln.
 *  2. `fitText`: genau eine Hälfte gelernt ⇒ keine Zeile mit Klammer; beide ⇒
 *     beide bleiben; keine ⇒ beide weg (wie bisher). Über ALLE Sprossen × den
 *     Korpus der Wegsprache: nie eine halbe Klammer.
 *  3. „Mein Training" übt die Klammern an ihrer Sprosse - mit Partner.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { advanceIntroduced, defaultIntroduced, introOrder } from "../src/lib/typing/letters";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { CORPUS, CORPUS_EN, CORPUS_FR, fitText } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { adaptiveRound } from "../src/lib/typing/generator";
import type { Lernweg } from "../src/lib/typing/lernweg";

afterEach(() => setLayout("de"));

const TASTATUREN: Record<Lernweg, LayoutId[]> = {
  de: ["de", "ch"],
  en: ["us", "uk"],
  fr: ["fr", "be", "ch-fr", "ca-fr"],
  es: ["es", "latam"],
  // RÜCKFALL-EN (G2a): it, pl, tr, cs zeigen vorerst Englisch.
  it: ["us", "uk"],
  pl: ["us", "uk"],
  tr: ["us", "uk"],
  cs: ["us", "uk"],
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: ["us", "uk"],
  el: ["us", "uk"],
  hu: ["us", "uk"],
  nl: ["us", "uk"],
  pt: ["us", "uk"],
  br: ["us", "uk"],
  ro: ["us", "uk"],
  sv: ["us", "uk"],
  uk: ["us", "uk"],
};
const KORPUS = { de: CORPUS, en: CORPUS_EN, fr: CORPUS_FR, es: CORPUS_ES } as const;
// G2a: nur die vier Wege mit eigenem Korpus (it/pl/tr/cs haben noch keinen).
const WEGE_MIT_KORPUS = ["de", "en", "fr", "es"] as const;
const PAARE: [string, string][] = [["(", ")"], ["[", "]"], ["{", "}"]];
const halbesPaar = (t: string): boolean =>
  PAARE.some(([a, b]) => [...t].filter((c) => c === a).length !== [...t].filter((c) => c === b).length);

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("D1 Nr. 19 · 1. Klammern werden gemeinsam freigeschaltet", () => {
  for (const weg of WEGE_MIT_KORPUS) {
    for (const l of TASTATUREN[weg]) {
      it(`${weg}/${l}: ( mit ), [ mit ], { mit } - und am Ende ist alles da`, () => {
        setLayout(l);
        let intro = defaultIntroduced(weg);
        for (let i = 0; i < 150; i++) {
          const vor = intro;
          intro = advanceIntroduced(intro, {}, weg, undefined, 99);
          if (intro === vor) break;
          const neu = intro.filter((c) => !vor.includes(c));
          for (const [a, b] of PAARE) {
            if (neu.includes(a) || neu.includes(b)) expect(neu, `${weg}/${l} Schritt ${i}`).toEqual([a, b]);
          }
        }
        expect(intro).toEqual(introOrder(weg));
      });
    }
  }
});

describe("D1 Nr. 19 · 2. fitText streicht nie eine Hälfte", () => {
  it("die drei Fälle an einer Zeile", () => {
    const zeile = "Vivo en La Paz (Bolivia) desde julio.";
    const basis = new Set([..."vivoenlapzbsdjuli", " ", "."]);
    // keine Hälfte gelernt: beide weg (wie bisher)
    expect(fitText(zeile, basis, "es")).toBe("Vivo en La Paz Bolivia desde julio.");
    // genau eine: die Zeile kommt nicht
    expect(fitText(zeile, new Set([...basis, "("]), "es")).toBeNull();
    // beide: beide bleiben
    expect(fitText(zeile, new Set([...basis, "(", ")"]), "es")).toBe(zeile);
    // gilt auf JEDEM Weg (derselbe Satz, andere Wege)
    for (const w of ["de", "en", "fr"] as const) expect(fitText(zeile, new Set([...basis, "("]), w), w).toBeNull();
  });

  for (const weg of WEGE_MIT_KORPUS) {
    it(`${weg}: über alle Sprossen × Korpus nie eine halbe Klammer (auch mitten im Paar)`, () => {
      setLayout(TASTATUREN[weg][0]);
      const o = introOrder(weg);
      const texte = KORPUS[weg].map((it) => it.text).filter((t) => /[()[\]{}]/.test(t));
      expect(texte.length, "der Korpus hat Zeilen mit Klammern").toBeGreaterThan(0);
      let halbe = 0;
      for (let n = 2; n <= o.length; n++) {
        const a = allowedFromIntroduced(o.slice(0, n), weg);
        for (const t of texte) {
          const f = fitText(t, a, weg);
          if (f !== null && halbesPaar(f)) halbe++;
        }
      }
      expect(halbe).toBe(0);
    });
  }
});

describe("D1 Nr. 19 · 3. Mein Training übt die Klammern an ihrer Sprosse", () => {
  for (const weg of WEGE_MIT_KORPUS) {
    it(`${weg}: jede Klammer-Sprosse hat Zeilen mit dem Paar, keine mit halbem Paar`, () => {
      setLayout(TASTATUREN[weg][0]);
      const o = introOrder(weg);
      const lang = weg;
      for (const [a, b] of PAARE) {
        const n = o.indexOf(b) + 1;
        if (n === 0) continue;
        const echt = Math.random;
        Math.random = mulberry32(n);
        let zeilen: { text: string }[];
        try {
          zeilen = [0, 1, 2].flatMap(() =>
            adaptiveRound({ introduced: o.slice(0, n), focus: [a, b], stufe: "teens", lang, lernweg: weg, count: 12, uebungsZeilen: 2 }),
          );
        } finally {
          Math.random = echt;
        }
        expect(zeilen.some((z) => z.text.includes(a) && z.text.includes(b)), `${weg} ${a}${b}`).toBe(true);
        // Ausnahme mit Absicht: die französische Schreibweise halboffener
        // Intervalle „]2 ; 5]" (generator.ts, Vorlage für „[" „]" auf Weg „fr")
        // ist kein halbes Paar, sondern Mathematik, wie sie in Frankreich steht.
        const intervall = /^[[\]]\d+ ; \d+[[\]]$/;
        expect(
          zeilen.filter((z) => halbesPaar(z.text) && !(weg === "fr" && intervall.test(z.text))).map((z) => z.text),
          `${weg} ${a}${b}`,
        ).toEqual([]);
      }
    });
  }
});
