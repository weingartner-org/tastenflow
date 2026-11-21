/**
 * ★★★★ WÄCHTER O-INHALT-NL (29.10.2026): `zahlwortNl` - die niederländischen Zahlwörter 0 bis 1.000.000 - und das Zahlendiktat auf
 * Weg „nl".
 *
 * Vorbild: `tests/tastenflow-zahlwort-cs.test.ts`. Regeln (siehe `zahlwortNl.ts`, Taalunie): bis „duizend" zusammen, danach ein
 * Leerzeichen; Einer vor Zehner mit „en", nach -e mit Trema („tweeëntwintig"); 1 allein „één".
 * ⚠️ Die Tabelle ist gegen das Sprachwissen des Baus gelesen, NICHT von einer Person mit Niederländisch als Erstsprache.
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_NL, ZAHLWORT_NL, zahlwortNl } from "../src/lib/typing/zahlwortNl";
import { zahlwort } from "../src/lib/typing/zahlwort";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import { introOrder } from "../src/lib/typing/letters";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";

describe("zahlwortNl: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "nul"], [1, "één"], [2, "twee"], [3, "drie"], [4, "vier"], [5, "vijf"], [6, "zes"], [7, "zeven"], [8, "acht"], [9, "negen"],
    [10, "tien"], [11, "elf"], [12, "twaalf"], [13, "dertien"], [14, "veertien"], [18, "achttien"], [19, "negentien"],
    [20, "twintig"], [21, "eenentwintig"], [22, "tweeëntwintig"], [23, "drieëntwintig"], [24, "vierentwintig"], [30, "dertig"],
    [32, "tweeëndertig"], [40, "veertig"], [45, "vijfenveertig"], [50, "vijftig"], [60, "zestig"], [70, "zeventig"],
    [80, "tachtig"], [88, "achtentachtig"], [90, "negentig"], [99, "negenennegentig"],
    [100, "honderd"], [101, "honderdeen"], [110, "honderdtien"], [123, "honderddrieëntwintig"], [200, "tweehonderd"],
    [354, "driehonderdvierenvijftig"], [999, "negenhonderdnegenennegentig"],
    [1000, "duizend"], [1001, "duizend een"], [1100, "duizend honderd"], [2000, "tweeduizend"], [2026, "tweeduizend zesentwintig"],
    [21000, "eenentwintigduizend"], [100000, "honderdduizend"], [999999, "negenhonderdnegenennegentigduizend negenhonderdnegenennegentig"],
    [1000000, "een miljoen"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortNl(n)).toBe(wort);
  });

  it("der Einhängepunkt trägt die Funktion (nicht mehr null)", () => {
    expect(ZAHLWORT_NL).toBe(zahlwortNl);
  });

  it("bis 1000 ein Wort, darüber höchstens ein Leerzeichen - genau hinter „duizend“", () => {
    for (let n = 0; n <= 1000; n++) expect(/^[a-zéë]+$/.test(zahlwortNl(n)), `${n}: ${zahlwortNl(n)}`).toBe(true);
    for (let n = 1001; n < MAX_ZAHL_NL; n += 13) {
      const w = zahlwortNl(n);
      expect(w.includes(" "), `${n}: ${w}`).toBe(n % 1000 !== 0);
      if (w.includes(" ")) expect(w.split(" ")[0].endsWith("duizend"), `${n}: ${w}`).toBe(true);
    }
  });

  it("Trema genau nach einem Einer auf -e (twee, drie), sonst „en“; nie „eeen“", () => {
    for (let n = 21; n <= 99; n++) {
      if (n % 10 === 0) continue;
      const w = zahlwortNl(n);
      expect(w.includes("ën"), `${n}: ${w}`).toBe(n % 10 === 2 || n % 10 === 3);
      expect(w).not.toMatch(/eeen/);
    }
  });

  it("jede Zahl hat ein ANDERES Wort, kein Bindestrich, kein – —", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 20000; n++) {
      const w = zahlwortNl(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
      expect(/^[a-zéë ]+$/.test(w), `${n}: ${w}`).toBe(true);
    }
  });

  it("die Grenzen werfen; der allgemeine `zahlwort(n, \"nl\")` wirft weiter (kein stilles Deutsch)", () => {
    expect(() => zahlwortNl(1_000_001)).toThrow(RangeError);
    expect(() => zahlwortNl(-1)).toThrow(RangeError);
    expect(() => zahlwortNl(2.5)).toThrow(RangeError);
    expect(() => zahlwort(41, "nl" as never)).toThrow();
  });
});

describe("Zahlendiktat auf Weg nl: angeboten, mit niederländischen Zahlwörtern", () => {
  const zufall = (start: number) => {
    let s = start;
    return () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
  };
  const ctx = (ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: "nl", introduced: introOrder("nl"), shift: true, oneHand: false, stufe: "teens", lang: "nl", count: 8,
    zufall: zufall(7), ...ueber,
  });

  it("die Form wird angeboten, und jede Antwort ist ein niederländisches Zahlwort oder Ziffern", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    const zahlen = new Set(Array.from({ length: 90 }, (_, i) => zahlwortNl(i + 10)));
    for (const a of aufgaben) for (const w of a.antworten) expect(zahlen.has(w) || /^\d+$/.test(w), w).toBe(true);
  });

  it("ohne ë wird kein Zahlwort mit ë als Antwort verlangt - und mit ë kommt eines vor", () => {
    const ohne = introOrder("nl").filter((c) => c !== "ë");
    for (const a of zahlendiktat.fragen!(ctx({ introduced: ohne }))) for (const w of a.antworten) expect(w, w).not.toMatch(/ë/);
    const mit = Array.from({ length: 16 }, (_, i) => zahlendiktat.fragen!(ctx({ zufall: zufall(i + 1) }))).flat();
    expect(mit.some((a) => a.antworten.some((w) => /ë/.test(w)))).toBe(true);
  });
});
