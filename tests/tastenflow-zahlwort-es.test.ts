/**
 * ★★★★★ WÄCHTER M6 (ES-P7a-Behebung, 27.09.2026, Prüfbericht Fundament es):
 * DAS SPANISCHE ZAHLWORT.
 *
 * `zahlwortFuerKind` (uebungsformen/zahlendiktat.ts) rief für „es" bisher
 * `zahlwort(n, ctx.lang)` auf - dieselbe Funktion, die für „fr" seit E10a
 * absichtlich WIRFT, weil sie sonst still den DEUTSCHEN Zweig liefert. Für
 * „es" gab es diese Absicherung nicht: die Form lieferte deutsche Zahlwörter
 * für spanische Kinder („Type it in digits: einundvierzig.", „91 in words
 * is einundneunzig."). Gemessen (e6): 3 von 15 Kontexten boten die Form an,
 * jede Ausgabe deutsch.
 *
 * Behoben: `zahlwort(n, "es")` wirft jetzt wie `zahlwort(n, "fr")`; die
 * echte Übersetzung liegt in der neuen Funktion {@link zahlwortEs} (RAE-
 * Regeln: 16-19 „dieci-", 21-29 „veinti-", ab 31 mit „y", 100 „cien" allein
 * vs. „ciento" mit Folgezahl). Stichproben unten sind an der RAE-Norm
 * (Ortografía de la lengua española, Kapitel Zahlwörter) selbst hergeleitet.
 */
import { describe, expect, it } from "vitest";
import { zahlwort, zahlwortEs, MAX_ZAHL } from "@/lib/typing/zahlwort";

const STICHPROBEN: [number, string][] = [
  [0, "cero"], [1, "uno"], [2, "dos"], [5, "cinco"], [9, "nueve"],
  [10, "diez"], [11, "once"], [12, "doce"], [13, "trece"], [14, "catorce"],
  [15, "quince"],
  [16, "dieciséis"], [17, "diecisiete"], [18, "dieciocho"], [19, "diecinueve"],
  [20, "veinte"],
  [21, "veintiuno"], [22, "veintidós"], [23, "veintitrés"], [24, "veinticuatro"],
  [25, "veinticinco"], [26, "veintiséis"], [27, "veintisiete"], [28, "veintiocho"],
  [29, "veintinueve"],
  [30, "treinta"], [31, "treinta y uno"], [35, "treinta y cinco"], [39, "treinta y nueve"],
  [40, "cuarenta"], [41, "cuarenta y uno"],
  [50, "cincuenta"], [51, "cincuenta y uno"],
  [60, "sesenta"], [61, "sesenta y uno"],
  [70, "setenta"], [71, "setenta y uno"],
  [80, "ochenta"], [81, "ochenta y uno"],
  [90, "noventa"], [99, "noventa y nueve"],
  [100, "cien"], // NICHT "ciento" ohne Folgezahl
  [101, "ciento uno"], [110, "ciento diez"], [111, "ciento once"],
  [115, "ciento quince"], [116, "ciento dieciséis"], [121, "ciento veintiuno"],
  [150, "ciento cincuenta"], [199, "ciento noventa y nueve"],
  [200, "doscientos"], [201, "doscientos uno"], [231, "doscientos treinta y uno"],
  [300, "trescientos"], [400, "cuatrocientos"],
  [500, "quinientos"], // unregelmässig, nicht "cincocientos"
  [515, "quinientos quince"],
  [600, "seiscientos"], [700, "setecientos"], [800, "ochocientos"], [900, "novecientos"],
  [999, "novecientos noventa y nueve"],
];

describe("★★★★★ M6: zahlwortEs liefert echte spanische Zahlwörter nach RAE", () => {
  for (const [n, wort] of STICHPROBEN) {
    it(`${n} → "${wort}"`, () => {
      expect(zahlwortEs(n)).toBe(wort);
    });
  }

  it("deckt 0 bis MAX_ZAHL, wirft ausserhalb", () => {
    expect(() => zahlwortEs(-1)).toThrow();
    expect(() => zahlwortEs(MAX_ZAHL + 1)).toThrow();
    expect(() => zahlwortEs(1.5)).toThrow();
    expect(zahlwortEs(0)).toBe("cero");
    expect(zahlwortEs(MAX_ZAHL)).toBe("novecientos noventa y nueve");
  });
});

describe('★★★★★ M6: zahlwort(n, "es") wirft laut, statt still Deutsch zu liefern', () => {
  it('wie zahlwort(n, "fr") - keine stille Falle mehr', () => {
    expect(() => zahlwort(41, "es")).toThrow();
    expect(() => zahlwort(41, "fr")).toThrow();
  });

  it("de/en unverändert - liefern weiterhin ihr Wort ohne zu werfen", () => {
    expect(zahlwort(41, "de")).toBe("einundvierzig");
    expect(zahlwort(41, "en")).toBe("forty-one");
  });
});
