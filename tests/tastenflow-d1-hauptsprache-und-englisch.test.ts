/**
 * ★★★★ WÄCHTER D1 Nr. 18 (28.09.2026, Entscheidung Johannes): „es gibt immer
 * die Hauptsprache und dazu die Möglichkeit, englische Texte zu schreiben …
 * die Tastaturfolge der 1. Sprache hat aber Vorrang".
 *
 * Die Wahl selbst (Einrichtung, Zahnrad, Klasse, Sprachschalter) prüft
 * `tastenflow-es-m2-uebungssprache-im-weg.test.tsx`. Hier: was ein Kind auf
 * Weg fr/es mit ENGLISCH wirklich bekommt.
 *  1. Die Klasse beginnt mit der Hauptsprache, auch bei englischer Bedienung.
 *  2. „Mein Training": jede neue Einheit des Weges kommt in ihrer Runde vor -
 *     auch die, die es im Englischen nicht gibt (´ ^ ¨ ¿ ¡). Die Runde übt sie
 *     dann in der Hauptsprache (Vorrang der Tastenfolge). Gegenprobe: ohne
 *     Fokus bleibt die Runde englisch.
 */
import { afterEach, describe, expect, it } from "vitest";
import { hauptspracheDesWeges, neueKlassenSprache } from "../src/lib/typing/account";
import { adaptiveRound } from "../src/lib/typing/generator";
import { setLayout, toLayoutText, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { KOMBIZEICHEN } from "../src/lib/typing/totasten";
import type { Lernweg } from "../src/lib/typing/lernweg";

afterEach(() => setLayout("de"));

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function mitZufall<T>(seed: number, fn: () => T): T {
  const echt = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = echt;
  }
}
function erkennungszeichen(u: string): string[] {
  const out = [u, toLayoutText(u.toUpperCase())];
  for (const k of KOMBIZEICHEN) if (k.tot === u) out.push(k.zeichen, k.zeichen.toUpperCase());
  return out;
}

describe("D1 Nr. 18 · die Klasse beginnt mit der Hauptsprache", () => {
  it("englische Bedienung, Weg fr/es: Französisch/Spanisch - nicht Englisch", () => {
    expect(neueKlassenSprache("en", "fr")).toBe("fr");
    expect(neueKlassenSprache("en", "es")).toBe("es");
    expect(neueKlassenSprache("de", "fr")).toBe("fr");
    expect(neueKlassenSprache("fr", "fr")).toBe("fr");
  });
  it("Gegenprobe Weg de/en: wie bisher aus der Bedienung", () => {
    expect(neueKlassenSprache("en", "de")).toBe("en");
    expect(neueKlassenSprache("de", "de")).toBe("de");
    expect(neueKlassenSprache("de", "en")).toBe("de");
    expect(hauptspracheDesWeges("de")).toBeUndefined();
    expect(hauptspracheDesWeges("en")).toBeUndefined();
  });
});

const FAELLE: [Lernweg, LayoutId][] = [
  ["fr", "fr"],
  ["es", "es"],
  ["es", "latam"],
];

describe("D1 Nr. 18 · Englisch auf Weg fr/es: jede neue Einheit kommt in ihrer Runde vor", () => {
  for (const [weg, l] of FAELLE) {
    it(`${weg}/${l}: keine Einheit von introOrder ohne eine einzige Zeile`, () => {
      setLayout(l);
      const o = introOrder(weg);
      const fehlt: string[] = [];
      for (let n = 3; n <= o.length; n++) {
        const neu = o[n - 1];
        if (neu === SHIFT_UNIT) continue;
        const zeilen = mitZufall(n, () => [
          ...adaptiveRound({ introduced: o.slice(0, n), focus: [neu], stufe: "kids", lang: "en", lernweg: weg, count: 12, uebungsZeilen: 2 }),
          ...adaptiveRound({ introduced: o.slice(0, n), focus: [neu], stufe: "teens", lang: "en", lernweg: weg, count: 12, uebungsZeilen: 2 }),
        ]);
        const z = erkennungszeichen(neu);
        if (!zeilen.some((x) => z.some((c) => x.text.includes(c)))) fehlt.push(`${n}:${neu}`);
      }
      expect(fehlt).toEqual([]);
    });
  }

  it("Gegenprobe: ohne Fokus bleibt die Runde englisch (kein á, kein ¿ auf Weg es)", () => {
    setLayout("es");
    const o = introOrder("es");
    const zeilen = mitZufall(3, () =>
      Array.from({ length: 4 }, () =>
        adaptiveRound({ introduced: o, stufe: "teens", lang: "en", lernweg: "es", count: 16 }),
      ).flat(),
    );
    expect(zeilen.some((z) => /[¿¡ñáéíóú]/.test(z.text))).toBe(false);
  });

  it("Fokus auf ´ (Weg es, Englisch): die Runde übt Wörter mit Akzent (Hauptsprache)", () => {
    setLayout("es");
    const o = introOrder("es");
    const n = o.indexOf("´") + 1;
    const zeilen = mitZufall(5, () =>
      adaptiveRound({ introduced: o.slice(0, n), focus: ["´"], stufe: "kids", lang: "en", lernweg: "es", count: 12, uebungsZeilen: 2 }),
    );
    expect(zeilen.some((z) => /[áéíóú]/i.test(z.text))).toBe(true);
  });
});
