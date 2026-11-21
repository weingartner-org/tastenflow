/**
 * ★★★★ WÄCHTER O-INHALT-UK (29.10.2026): `zahlwortUk` - die ukrainischen Zahlwörter 0 bis 1.000.000 - und das Zahlendiktat auf
 * Weg „uk". Vorbild: `tests/tastenflow-zahlwort-cs.test.ts`.
 *
 * Regeln (siehe `zahlwortUk.ts`, Glossar uk §2.10): Grundform („один", „два"), Apostroph U+0027 („п'ять"), Tausender weiblich mit
 * der Form nach der Zahl („дві тисячі", „п'ять тисяч", „двадцять одна тисяча"), „тисяча" allein, „мільйон".
 * ⚠️ Die Tabelle ist gegen das Sprachwissen des Baus gelesen [G], NICHT von einer Person mit Ukrainisch als Erstsprache - sie steht
 * als Tabelle da, damit sie jemand Zeile für Zeile gegenlesen kann.
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_UK, ZAHLWORT_UK, zahlwortUk } from "../src/lib/typing/zahlwortUk";
import { zahlwort } from "../src/lib/typing/zahlwort";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";
import { LERNWEGE } from "../src/lib/typing/lernweg";

describe("zahlwortUk: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "нуль"], [1, "один"], [2, "два"], [3, "три"], [4, "чотири"], [5, "п'ять"], [6, "шість"], [7, "сім"], [8, "вісім"], [9, "дев'ять"],
    [10, "десять"], [11, "одинадцять"], [12, "дванадцять"], [13, "тринадцять"], [14, "чотирнадцять"], [15, "п'ятнадцять"],
    [16, "шістнадцять"], [17, "сімнадцять"], [18, "вісімнадцять"], [19, "дев'ятнадцять"],
    [20, "двадцять"], [21, "двадцять один"], [22, "двадцять два"], [30, "тридцять"], [40, "сорок"], [45, "сорок п'ять"],
    [50, "п'ятдесят"], [60, "шістдесят"], [70, "сімдесят"], [80, "вісімдесят"], [90, "дев'яносто"], [99, "дев'яносто дев'ять"],
    [100, "сто"], [101, "сто один"], [111, "сто одинадцять"], [123, "сто двадцять три"], [200, "двісті"], [300, "триста"],
    [400, "чотириста"], [500, "п'ятсот"], [600, "шістсот"], [700, "сімсот"], [800, "вісімсот"], [900, "дев'ятсот"],
    [999, "дев'ятсот дев'яносто дев'ять"],
    [1000, "тисяча"], [1001, "тисяча один"], [1234, "тисяча двісті тридцять чотири"], [2000, "дві тисячі"], [3000, "три тисячі"],
    [4000, "чотири тисячі"], [5000, "п'ять тисяч"], [11000, "одинадцять тисяч"], [21000, "двадцять одна тисяча"],
    [22000, "двадцять дві тисячі"], [25000, "двадцять п'ять тисяч"], [100000, "сто тисяч"], [101000, "сто одна тисяча"],
    [102000, "сто дві тисячі"], [200000, "двісті тисяч"],
    [999999, "дев'ятсот дев'яносто дев'ять тисяч дев'ятсот дев'яносто дев'ять"], [1000000, "мільйон"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortUk(n)).toBe(wort);
  });

  it("die Funktion ist am Verteiler eingehängt (nicht mehr `null`)", () => {
    expect(ZAHLWORT_UK).toBe(zahlwortUk);
  });

  it("jede Zahl von 0 bis 2.000: nur ukrainische Kleinbuchstaben und der Apostroph U+0027, EIN Leerzeichen, kein Bindestrich", () => {
    for (let n = 0; n <= 2000; n++) {
      const w = zahlwortUk(n);
      expect(/^[а-щьюяєіїґ']+( [а-щьюяєіїґ']+)*$/.test(w), `${n}: ${w}`).toBe(true);
      // kein russischer Buchstabe (ы э ё ъ) und kein typografischer Apostroph
      expect(w, `${n}`).not.toMatch(/[ыэёъʼ’]/);
    }
  });

  it("keine Russismen bei 50-80 (п'ятдесят, nicht п'ятидесят)", () => {
    for (let n = 0; n <= 1000; n++) expect(zahlwortUk(n), String(n)).not.toMatch(/п'ятидесят|шестидесят|семидесят/);
  });

  it("die Tausender richten sich nach der Zahl davor (one · few · many)", () => {
    for (const [n, form] of [[21000, "тисяча"], [23000, "тисячі"], [24000, "тисячі"], [25000, "тисяч"], [12000, "тисяч"], [112000, "тисяч"]] as const)
      expect(zahlwortUk(n).split(" ").at(-1), String(n)).toBe(form);
  });

  it("jede Zahl hat ein ANDERES Wort (keine Verwechslung, die ein Kind nicht auflösen kann)", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 20000; n++) {
      const w = zahlwortUk(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
    }
  });

  it("die Grenzen: 1.000.000 ist die grösste Zahl; darüber, unter 0 und Bruchzahlen werfen", () => {
    expect(MAX_ZAHL_UK).toBe(1_000_000);
    expect(() => zahlwortUk(1_000_001)).toThrow(RangeError);
    expect(() => zahlwortUk(-1)).toThrow(RangeError);
    expect(() => zahlwortUk(1.5)).toThrow(RangeError);
  });

  it("der allgemeine `zahlwort(n, \"uk\")` gibt kein Deutsch (er wirft)", () => {
    expect(() => zahlwort(41, "uk")).toThrow();
  });
});

describe("Zahlendiktat auf Weg bg: mit ukrainischen Zahlwörtern", () => {
  const alleTasten = [...LERNWEGE.uk.letterOrder, ..."0123456789.,"];
  const ctx = (ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: "uk",
    introduced: alleTasten,
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang: "uk",
    count: 8,
    zufall: (() => {
      let s = 7;
      return () => {
        s = (s * 1103515245 + 12345) % 2147483648;
        return s / 2147483648;
      };
    })(),
    ...ueber,
  });

  it("die Form wird angeboten, und die Zahlwörter sind ukrainisch (nie deutsch, nie englisch)", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    const zahlen = new Set(Array.from({ length: 90 }, (_, i) => zahlwortUk(i + 10)));
    for (const a of aufgaben) {
      const antworten = a.antworten.join(" ");
      expect(antworten, antworten).not.toMatch(/[a-zäöüß]/i);
      expect(a.antworten.some((w) => zahlen.has(w) || /^\d+$/.test(w)), a.frage).toBe(true);
    }
  });

  it("ohne den Apostroph (Standard-Tastatur, frühe Sprossen) wird kein Zahlwort mit Apostroph verlangt", () => {
    const ohne = alleTasten.filter((c) => c !== "'");
    const aufgaben = zahlendiktat.fragen!(ctx({ introduced: ohne }));
    expect(aufgaben.length).toBeGreaterThan(3);
    for (const a of aufgaben) for (const antwort of a.antworten) expect(antwort, antwort).not.toMatch(/'/);
  });

  it("ohne Ziffern wird die Form nicht angeboten (die Schranke gilt auch hier)", () => {
    expect(zahlendiktat.taugt(ctx({ introduced: [...LERNWEGE.uk.letterOrder] }))).toBe(false);
  });
});
