/**
 * ★★★★★ WÄCHTER F8 Polnisch (03.10.2026): `zahlwortPl` - die Zahlwörter 0 bis 1.000.000 - und die Zahlenschreibung `zahl(n, "pl")`.
 *
 * Vorbild: `tests/tastenflow-zahlwort-it.test.ts`. Regeln (siehe `zahlwort.ts`): getrennt geschrieben; Hunderter als EIN Wort
 * (`dwieście`, `trzysta` … `dziewięćset`); `tysiąc` für genau 1.000, `tysiące` bei 2-4 (nicht 12-14), sonst `tysięcy`; `milion` für
 * genau 1.000.000 („jeden milion“ gibt es nicht).
 *
 * ⚠️ Die Soll-Werte unten stammen aus der Grammatik (RJP/PWN „Zapis liczebników") und stehen Zahl für Zahl da - NICHT aus der Funktion
 * abgeleitet (ein Test, der den Code gegen sich selbst prüft, bewiese nichts, Falle 15). Von keiner Muttersprachlerin gelesen (P7).
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_PL, zahlwort, zahlwortPl } from "../src/lib/typing/zahlwort";
import { zahl } from "../src/lib/bedienSprache/texte";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";

describe("zahlwortPl: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "zero"], [1, "jeden"], [2, "dwa"], [3, "trzy"], [4, "cztery"], [5, "pięć"], [6, "sześć"], [7, "siedem"], [8, "osiem"], [9, "dziewięć"],
    [10, "dziesięć"], [11, "jedenaście"], [12, "dwanaście"], [13, "trzynaście"], [14, "czternaście"], [15, "piętnaście"], [16, "szesnaście"],
    [17, "siedemnaście"], [18, "osiemnaście"], [19, "dziewiętnaście"],
    [20, "dwadzieścia"], [21, "dwadzieścia jeden"], [22, "dwadzieścia dwa"], [23, "dwadzieścia trzy"], [24, "dwadzieścia cztery"],
    [25, "dwadzieścia pięć"], [29, "dwadzieścia dziewięć"],
    [30, "trzydzieści"], [31, "trzydzieści jeden"], [40, "czterdzieści"], [44, "czterdzieści cztery"], [50, "pięćdziesiąt"], [51, "pięćdziesiąt jeden"],
    [60, "sześćdziesiąt"], [67, "sześćdziesiąt siedem"], [70, "siedemdziesiąt"], [78, "siedemdziesiąt osiem"], [80, "osiemdziesiąt"],
    [90, "dziewięćdziesiąt"], [93, "dziewięćdziesiąt trzy"], [99, "dziewięćdziesiąt dziewięć"],
    [100, "sto"], [101, "sto jeden"], [102, "sto dwa"], [110, "sto dziesięć"], [111, "sto jedenaście"], [112, "sto dwanaście"], [120, "sto dwadzieścia"],
    [123, "sto dwadzieścia trzy"], [200, "dwieście"], [215, "dwieście piętnaście"], [300, "trzysta"], [400, "czterysta"], [500, "pięćset"],
    [600, "sześćset"], [700, "siedemset"], [800, "osiemset"], [900, "dziewięćset"], [999, "dziewięćset dziewięćdziesiąt dziewięć"],
    [1000, "tysiąc"], [1001, "tysiąc jeden"], [1010, "tysiąc dziesięć"], [1100, "tysiąc sto"], [1234, "tysiąc dwieście trzydzieści cztery"],
    [2000, "dwa tysiące"], [2022, "dwa tysiące dwadzieścia dwa"], [3000, "trzy tysiące"], [4000, "cztery tysiące"], [5000, "pięć tysięcy"],
    [10000, "dziesięć tysięcy"], [11000, "jedenaście tysięcy"], [12000, "dwanaście tysięcy"], [13000, "trzynaście tysięcy"], [14000, "czternaście tysięcy"],
    [15000, "piętnaście tysięcy"], [20000, "dwadzieścia tysięcy"], [21000, "dwadzieścia jeden tysięcy"], [22000, "dwadzieścia dwa tysiące"],
    [24000, "dwadzieścia cztery tysiące"], [25000, "dwadzieścia pięć tysięcy"], [100000, "sto tysięcy"], [101000, "sto jeden tysięcy"],
    [102000, "sto dwa tysiące"], [112000, "sto dwanaście tysięcy"], [122000, "sto dwadzieścia dwa tysiące"], [200000, "dwieście tysięcy"],
    [999999, "dziewięćset dziewięćdziesiąt dziewięć tysięcy dziewięćset dziewięćdziesiąt dziewięć"], [1000000, "milion"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortPl(n)).toBe(wort);
  });

  it("die Regeln einzeln: tysiąc / tysiące / tysięcy, nie „jeden tysiąc“, nie „jeden milion“", () => {
    expect(zahlwortPl(1000)).not.toMatch(/^jeden/);
    expect(zahlwortPl(1000000)).not.toMatch(/jeden/);
    // 2-4 Tausender (auch nach Zehnern): tysiące; 12-14 und alles andere: tysięcy
    for (const t of [2, 3, 4, 22, 23, 24, 32, 102, 103, 124]) expect(zahlwortPl(t * 1000), String(t * 1000)).toMatch(/ tysiące$/);
    for (const t of [5, 6, 9, 10, 11, 12, 13, 14, 15, 21, 25, 31, 100, 101, 111, 112, 113, 114, 121]) expect(zahlwortPl(t * 1000), String(t * 1000)).toMatch(/ tysięcy$/);
  });

  it("jede Zahl von 0 bis 2.000: nur Kleinbuchstaben des polnischen Alphabets und Leerzeichen, nie ein Bindestrich, nie ein Leerzeichen am Rand", () => {
    for (let n = 0; n <= 2000; n++) {
      const w = zahlwortPl(n);
      expect(/^[a-ząćęłńóśźż]+( [a-ząćęłńóśźż]+)*$/.test(w), `${n}: ${w}`).toBe(true);
    }
  });

  it("alle 1.000 Zahlen von 1.000 bis 1.999.. und runde Tausender: die Wörter sind verschieden (keine Zahl teilt sich ein Wort)", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 3000; n++) {
      const w = zahlwortPl(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
    }
  });

  it("ausserhalb von 0 bis 1.000.000, Bruchzahlen und Negatives: ein klarer Fehler, nie ein Raten", () => {
    for (const n of [-1, 1.5, 1000001, Number.NaN]) expect(() => zahlwortPl(n), String(n)).toThrow(RangeError);
    expect(MAX_ZAHL_PL).toBe(1_000_000);
  });

  it("zahlwort(n, \"pl\") gibt es nicht - die Meldung nennt den Weg (Falle 50: nie still Deutsch)", () => {
    expect(() => zahlwort(5, "pl")).toThrow(/zahlwortPl/);
  });
});

describe("das Zahlendiktat auf Weg „pl“: angeboten, mit polnischen Zahlwörtern, nur mit schreibbaren Aufgaben", () => {
  const ctx = (opts: Partial<FormKontext> = {}): FormKontext => {
    const alleTasten = [..."abcdefghijklmnopqrstuvwxyząćęłńóśźż0123456789 .,"];
    return {
      lang: "pl",
      stufe: "teens",
      lernweg: "pl",
      introduced: alleTasten,
      shiftLearned: true,
      count: 8,
      zufall: (() => {
        let s = 42;
        return () => {
          s = (s * 1103515245 + 12345) % 2147483648;
          return s / 2147483648;
        };
      })(),
      ...opts,
    } as FormKontext;
  };

  it("die Form wird auf pl angeboten und baut Aufgaben mit polnischen Zahlwörtern", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    // Antworten sind Zahlwörter oder (bei der Umkehr-Aufgabe) Ziffern - nie ein deutsches oder englisches Wort
    for (const a of aufgaben) for (const antwort of a.antworten) expect(antwort, antwort).toMatch(/^([a-ząćęłńóśźż ]+|[0-9]+)$/);
    const woerter = aufgaben.flatMap((a) => a.antworten).filter((x) => /\p{L}/u.test(x));
    expect(woerter.length).toBeGreaterThan(0);
    // und jedes Wort ist das Zahlwort einer Zahl, die `zahlwortPl` kennt (nie ein selbstgebautes)
    const bekannt = new Set(Array.from({ length: 1001 }, (_, n) => zahlwortPl(n)));
    for (const w of woerter) expect(bekannt.has(w), w).toBe(true);
  });

  it("ohne `ę` kommt kein Zahlwort mit `ę` (pięć, dziesięć) als Antwort - die Aufgabe wäre unlösbar", () => {
    const ohneE = [..."abcdefghijklmnopqrstuvwxyząćłńóśźż0123456789 .,"];
    const aufgaben = zahlendiktat.fragen!(ctx({ introduced: ohneE }));
    for (const a of aufgaben) for (const antwort of a.antworten) expect(antwort, antwort).not.toMatch(/ę/);
  });
});

describe("zahl(n, \"pl\"): Dezimalkomma; vierstellig OHNE Trenner, ab fünf Stellen mit geschütztem Leerzeichen (Intl pl-PL und PWN sagen dasselbe)", () => {
  it("1234, 12 345, 1234,5 - gemessen mit Node 26.6 (`Intl.NumberFormat(\"pl-PL\")`, Glossar §1 Nr. 5)", () => {
    expect(zahl(1234, "pl")).toBe("1234");
    expect(zahl(12345, "pl")).toBe("12 345");
    expect(zahl(1234.5, "pl")).toBe("1234,5");
    expect(zahl(999, "pl")).toBe("999");
    expect(zahl(1000000, "pl")).toBe("1 000 000");
  });

  it("★ der Trenner ist das GESCHÜTZTE Leerzeichen - darum steht keine `zahl()` in einer Zeile, die ein Kind abtippt (Glossar §3 Fallen 8)", () => {
    expect(zahl(12345, "pl")).toContain(" ");
    expect(zahl(12345, "pl")).not.toContain(" ");
  });

  it("Italienisch bekommt den Punkt schon bei vier Stellen, Polnisch nie einen Punkt; de, en wie vorher", () => {
    expect(zahl(1234, "it")).toBe("1.234");
    expect(zahl(12345, "pl")).not.toContain(".");
    expect(zahl(1234, "de")).toBe(new Intl.NumberFormat("de-AT").format(1234));
    expect(zahl(1234, "en")).toBe("1,234");
  });
});
