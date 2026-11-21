/**
 * ★★★★★ WÄCHTER D1 Nr. 6 (28.09.2026, Entscheidung Johannes): „Mein
 * Training" übt JEDES Zeichen der Reihenfolge - auf JEDEM Weg und JEDER
 * Tastatur des Weges.
 *
 * Der Fund (dieselbe Fehlerklasse wie M1 auf Weg „fr", Leitfaden Falle 7):
 * `rundenEinheiten` teilte den Tastenstand auf Weg „en" über die DEUTSCHEN
 * Listen ein - „\" und „£" stehen auf keiner und fielen aus dem Tastenstand.
 * Ein Kind bekam sie freigeschaltet und tippte sie nie. Dazu E7 der
 * Didaktik-Recherche Englisch: „€" liegt auf UK/Irland auf AltGr + 4 und
 * fehlte in `EN_SYMBOL_ORDER`.
 *
 * Geprüft über die FEHLERKLASSE am Weg, den ein Kind nimmt:
 *  1. Die Einteilung (`rundenEinheiten`) enthält an jeder Sprosse genau den
 *     Tastenstand von `allowedFromIntroduced` - kein Zeichen fällt heraus.
 *  2. Eine echte `adaptiveRound` mit der neuen Einheit im Fokus enthält sie -
 *     jede Einheit von `introOrder` (Totaste: an ihren Kombizeichen).
 *  3. „€" ist auf Weg „en" da, wo die Tastatur es hat (UK), und fehlt, wo
 *     nicht (US).
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, toLayoutText, type LayoutId } from "../src/lib/typing/layouts";
import { advanceIntroduced, defaultIntroduced, introOrder, neuFreigeschaltet, SHIFT_UNIT } from "../src/lib/typing/letters";
import { adaptiveRound, rundenEinheiten } from "../src/lib/typing/generator";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { KOMBIZEICHEN } from "../src/lib/typing/totasten";
import type { Lernweg } from "../src/lib/typing/lernweg";

afterEach(() => setLayout("de"));

const TASTATUREN: [Lernweg, LayoutId][] = [
  ["de", "de"],
  ["de", "ch"],
  ["en", "us"],
  ["en", "uk"],
  ["fr", "fr"],
  ["es", "es"],
  ["es", "latam"],
];

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function erkennungszeichen(u: string): string[] {
  const out = [u, toLayoutText(u.toUpperCase())];
  for (const k of KOMBIZEICHEN) if (k.tot === u) out.push(k.zeichen, k.zeichen.toUpperCase());
  return out;
}

describe("D1 Nr. 6 · 1. kein freigeschaltetes Zeichen fällt aus der Einteilung", () => {
  for (const [weg, l] of TASTATUREN) {
    it(`${weg}/${l}: an jeder Sprosse alles von allowedFromIntroduced eingeteilt`, () => {
      setLayout(l);
      const o = introOrder(weg);
      for (let n = 2; n <= o.length; n++) {
        const intro = o.slice(0, n);
        const r = rundenEinheiten(intro, weg);
        const eingeteilt = new Set([...r.letters, ...r.puncts, ...r.digits, ...r.symbols, ...r.nurErlaubt]);
        const fehlt = [...allowedFromIntroduced(intro, weg)].filter((c) => !eingeteilt.has(c));
        expect(fehlt, `${weg}/${l}, Sprosse ${n} (${o[n - 1]})`).toEqual([]);
      }
    });
  }
});

describe("D1 Nr. 6 · 2. jede neue Einheit kommt in ihrer Runde vor", () => {
  for (const [weg, l] of TASTATUREN) {
    it(`${weg}/${l}: jede Einheit von introOrder steht in ihrer Runde`, () => {
      setLayout(l);
      const o = introOrder(weg);
      const fehlt: string[] = [];
      const echt = Math.random;
      try {
        // Die Stände, die ein Kind WIRKLICH durchläuft (`advanceIntroduced`) -
        // seit D1 Nr. 19 kommen Klammern als Paar, „(" allein gibt es nicht.
        let intro = defaultIntroduced(weg);
        for (let schritt = 0; schritt < 150; schritt++) {
          const vor = intro;
          intro = advanceIntroduced(intro, {}, weg, undefined, 99);
          if (intro === vor) break;
          const neuAlle = neuFreigeschaltet(vor, intro).filter((u) => u !== SHIFT_UNIT);
          if (!neuAlle.length) continue;
          Math.random = mulberry32(intro.length);
          const zeilen = [
            ...adaptiveRound({ introduced: intro, focus: neuAlle, stufe: "kids", lang: weg, lernweg: weg, count: 12, uebungsZeilen: 2 }),
            ...adaptiveRound({ introduced: intro, focus: neuAlle, stufe: "teens", lang: weg, lernweg: weg, count: 12, uebungsZeilen: 2 }),
          ];
          for (const neu of neuAlle) {
            const z = erkennungszeichen(neu);
            if (!zeilen.some((x) => z.some((c) => x.text.includes(c)))) fehlt.push(`${intro.length}:${neu}`);
          }
        }
        expect(intro).toEqual(o);
      } finally {
        Math.random = echt;
      }
      expect(fehlt, `${weg}/${l}: Einheiten ohne eine einzige Zeile in ihrer Runde`).toEqual([]);
    });
  }
});

describe("D1 Nr. 6 · 3. „€“ auf Weg en, wo die Tastatur es hat", () => {
  it("UK: € ist eine Sprosse (die letzte) und wird geübt; US: kein €", () => {
    setLayout("uk");
    const uk = introOrder("en");
    expect(uk[uk.length - 1]).toBe("€");
    expect(uk).toContain("£");
    expect(uk).toContain("\\");
    setLayout("us");
    expect(introOrder("en")).not.toContain("€");
    expect(introOrder("en")).not.toContain("£");
  });
  it("Gegenprobe Weg de: die Einteilung ist dieselbe wie vor D1 (nichts kommt dazu)", () => {
    setLayout("de");
    const o = introOrder("de");
    const r = rundenEinheiten(o, "de");
    expect(r.nurErlaubt).toEqual([]);
    expect(new Set(r.symbols).size).toBe(r.symbols.length);
  });
});
