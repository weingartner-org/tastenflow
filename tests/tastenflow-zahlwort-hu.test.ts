/**
 * ★★★★ WÄCHTER O-INHALT-HU (29.10.2026): `zahlwortHu` - die ungarischen Zahlwörter 0 bis 1.000.000 - und das Zahlendiktat auf Weg „hu".
 *
 * Vorbild: `tests/tastenflow-zahlwort-cs.test.ts`. Regeln (siehe `zahlwortHu.ts`): bis 2000 zusammen, darüber Dreiergruppen mit
 * Bindestrich (AkH 12 § 291 a); 2 allein/am Ende „kettő", vor „ezer" „két"; „tíz/tizen…", „húsz/huszon…"; „száz", „ezer" ohne „egy".
 * ⚠️ Die Tabelle ist gegen das Sprachwissen des Baus gelesen, NICHT von einer Person mit Ungarisch als Erstsprache.
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_HU, ZAHLWORT_HU, zahlwortHu } from "../src/lib/typing/zahlwortHu";
import { zahlwort } from "../src/lib/typing/zahlwort";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import { introOrder } from "../src/lib/typing/letters";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";

const BUCHSTABEN = "a-záéíóöőúüű";

describe("zahlwortHu: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "nulla"], [1, "egy"], [2, "kettő"], [3, "három"], [4, "négy"], [5, "öt"], [6, "hat"], [7, "hét"], [8, "nyolc"], [9, "kilenc"],
    [10, "tíz"], [11, "tizenegy"], [12, "tizenkettő"], [15, "tizenöt"], [19, "tizenkilenc"],
    [20, "húsz"], [21, "huszonegy"], [22, "huszonkettő"], [29, "huszonkilenc"], [30, "harminc"], [33, "harminchárom"],
    [40, "negyven"], [44, "negyvennégy"], [50, "ötven"], [56, "ötvenhat"], [60, "hatvan"], [70, "hetven"], [77, "hetvenhét"],
    [80, "nyolcvan"], [88, "nyolcvannyolc"], [90, "kilencven"], [99, "kilencvenkilenc"],
    [100, "száz"], [101, "százegy"], [102, "százkettő"], [110, "száztíz"], [120, "százhúsz"], [123, "százhuszonhárom"],
    [200, "kétszáz"], [222, "kétszázhuszonkettő"], [300, "háromszáz"], [999, "kilencszázkilencvenkilenc"],
    [1000, "ezer"], [1001, "ezeregy"], [1100, "ezerszáz"], [1999, "ezerkilencszázkilencvenkilenc"], [2000, "kétezer"],
    [2001, "kétezer-egy"], [2015, "kétezer-tizenöt"], [2026, "kétezer-huszonhat"], [3000, "háromezer"],
    [12000, "tizenkétezer"], [21000, "huszonegyezer"], [22000, "huszonkétezer"], [22222, "huszonkétezer-kétszázhuszonkettő"],
    [100000, "százezer"], [102000, "százkétezer"], [200000, "kétszázezer"],
    [999999, "kilencszázkilencvenkilencezer-kilencszázkilencvenkilenc"], [1000000, "egymillió"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortHu(n)).toBe(wort);
  });

  it("der Einhängepunkt trägt die Funktion (nicht mehr null)", () => {
    expect(ZAHLWORT_HU).toBe(zahlwortHu);
  });

  it("bis 2000 ein Wort ohne Strich, darüber genau dann ein Bindestrich, wenn hinter den Tausendern etwas kommt", () => {
    for (let n = 0; n <= 2000; n++) expect(/^[a-záéíóöőúüű]+$/.test(zahlwortHu(n)), `${n}: ${zahlwortHu(n)}`).toBe(true);
    for (let n = 2001; n <= 30000; n += 7) {
      const w = zahlwortHu(n);
      expect(w.includes("-"), `${n}: ${w}`).toBe(n % 1000 !== 0);
      expect(w.split("-").length, `${n}: ${w}`).toBeLessThanOrEqual(2);
    }
  });

  it("„kettő“ nur am Ende, „két“ nie am Ende", () => {
    for (let n = 1; n <= 30000; n += 3) {
      const w = zahlwortHu(n);
      expect(/két$/.test(w), `${n}: ${w}`).toBe(false);
      expect(/kettő./.test(w), `${n}: ${w}`).toBe(false);
    }
  });

  it("jede Zahl hat ein ANDERES Wort, nur Buchstaben der Sprache und Bindestrich, nie – —", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 20000; n++) {
      const w = zahlwortHu(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
    }
    for (let n = 0; n <= MAX_ZAHL_HU; n += 997) expect(new RegExp(`^[${BUCHSTABEN}-]+$`).test(zahlwortHu(n)), String(n)).toBe(true);
  });

  it("die Grenzen werfen; der allgemeine `zahlwort(n, \"hu\")` wirft weiter (kein stilles Deutsch)", () => {
    expect(() => zahlwortHu(1_000_001)).toThrow(RangeError);
    expect(() => zahlwortHu(-1)).toThrow(RangeError);
    expect(() => zahlwortHu(1.5)).toThrow(RangeError);
    expect(() => zahlwort(41, "hu" as never)).toThrow();
  });
});

describe("Zahlendiktat auf Weg hu: angeboten, mit ungarischen Zahlwörtern", () => {
  const zufall = (start: number) => {
    let s = start;
    return () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
  };
  const ctx = (ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: "hu", introduced: introOrder("hu"), shift: true, oneHand: false, stufe: "teens", lang: "hu", count: 8,
    zufall: zufall(7), ...ueber,
  });

  it("die Form wird angeboten, und jede Aufgabe trägt ein ungarisches Zahlwort oder Ziffern (nie Deutsch, nie Englisch)", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    const zahlen = new Set(Array.from({ length: 90 }, (_, i) => zahlwortHu(i + 10)));
    for (const a of aufgaben) {
      for (const w of a.antworten) expect(zahlen.has(w) || /^\d+$/.test(w), w).toBe(true);
      expect(a.antworten.join(" ")).not.toMatch(/[äß]|zig|ty\b|teen/);
    }
  });

  it("ohne die Taste ő wird kein Zahlwort mit ő als Antwort verlangt - und mit ihr kommt eines vor", () => {
    const ohne = introOrder("hu").filter((c) => c !== "ő");
    for (const a of zahlendiktat.fragen!(ctx({ introduced: ohne }))) for (const w of a.antworten) expect(w, w).not.toMatch(/ő/);
    const mit = Array.from({ length: 12 }, (_, i) => zahlendiktat.fragen!(ctx({ zufall: zufall(i + 1) }))).flat();
    expect(mit.some((a) => a.antworten.some((w) => /ő/.test(w)))).toBe(true);
  });
});
