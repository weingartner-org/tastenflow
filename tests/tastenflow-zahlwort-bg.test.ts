/**
 * ★★★★ WÄCHTER O-INHALT-BG (29.10.2026): `zahlwortBg` - die bulgarischen Zahlwörter 0 bis 1.000.000 - und das Zahlendiktat auf
 * Weg „bg". Vorbild: `tests/tastenflow-zahlwort-cs.test.ts`.
 *
 * Regeln (siehe `zahlwortBg.ts`, Glossar bg §2.10): Schriftform („единадесет"), Zählform ohne Hauptwort („едно", „две"), „и" vor dem
 * letzten Glied, Tausender weiblich („две хиляди", „двадесет и една хиляди"), „хиляда" allein, „един милион".
 * ⚠️ Die Tabelle ist gegen das Sprachwissen des Baus gelesen [G], NICHT von einer Person mit Bulgarisch als Erstsprache - sie steht
 * als Tabelle da, damit sie jemand Zeile für Zeile gegenlesen kann.
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_BG, ZAHLWORT_BG, zahlwortBg } from "../src/lib/typing/zahlwortBg";
import { zahlwort } from "../src/lib/typing/zahlwort";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";
import { LERNWEGE } from "../src/lib/typing/lernweg";

describe("zahlwortBg: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "нула"], [1, "едно"], [2, "две"], [3, "три"], [4, "четири"], [5, "пет"], [6, "шест"], [7, "седем"], [8, "осем"], [9, "девет"],
    [10, "десет"], [11, "единадесет"], [12, "дванадесет"], [13, "тринадесет"], [14, "четиринадесет"], [15, "петнадесет"],
    [16, "шестнадесет"], [17, "седемнадесет"], [18, "осемнадесет"], [19, "деветнадесет"],
    [20, "двадесет"], [21, "двадесет и едно"], [22, "двадесет и две"], [29, "двадесет и девет"], [30, "тридесет"],
    [40, "четиридесет"], [45, "четиридесет и пет"], [50, "петдесет"], [60, "шестдесет"], [70, "седемдесет"], [80, "осемдесет"],
    [90, "деветдесет"], [99, "деветдесет и девет"],
    [100, "сто"], [101, "сто и едно"], [110, "сто и десет"], [111, "сто и единадесет"], [120, "сто и двадесет"],
    [121, "сто двадесет и едно"], [200, "двеста"], [300, "триста"], [400, "четиристотин"], [500, "петстотин"], [600, "шестстотин"],
    [700, "седемстотин"], [800, "осемстотин"], [900, "деветстотин"], [999, "деветстотин деветдесет и девет"],
    [1000, "хиляда"], [1001, "хиляда и едно"], [1005, "хиляда и пет"], [1100, "хиляда и сто"], [1250, "хиляда двеста и петдесет"],
    [1234, "хиляда двеста тридесет и четири"], [2000, "две хиляди"], [2300, "две хиляди и триста"], [3000, "три хиляди"],
    [10000, "десет хиляди"], [11000, "единадесет хиляди"], [21000, "двадесет и една хиляди"], [22000, "двадесет и две хиляди"],
    [100000, "сто хиляди"], [101000, "сто и една хиляди"], [200000, "двеста хиляди"],
    [999999, "деветстотин деветдесет и девет хиляди деветстотин деветдесет и девет"], [1000000, "един милион"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortBg(n)).toBe(wort);
  });

  it("die Funktion ist am Verteiler eingehängt (nicht mehr `null`)", () => {
    expect(ZAHLWORT_BG).toBe(zahlwortBg);
  });

  it("jede Zahl von 0 bis 2.000: nur kyrillische Kleinbuchstaben, EIN Leerzeichen zwischen den Wörtern, kein Bindestrich", () => {
    for (let n = 0; n <= 2000; n++) {
      const w = zahlwortBg(n);
      expect(/^[а-я]+( [а-я]+)*$/.test(w), `${n}: ${w}`).toBe(true);
    }
  });

  it("die Schriftform, nie die gesprochene (единайсет, двайсет, трийсет)", () => {
    for (let n = 0; n <= 1000; n++) expect(zahlwortBg(n), String(n)).not.toMatch(/айсет|йсет/);
  });

  it("„и\" steht genau einmal, und zwar vor dem letzten Wort - bei jeder Zahl unter 1000 mit mehr als einem Glied", () => {
    for (let n = 21; n < 1000; n++) {
      const w = zahlwortBg(n).split(" ");
      const i = w.indexOf("и");
      if (i < 0) continue;
      expect(w.filter((x) => x === "и").length, `${n}`).toBe(1);
      expect(i, `${n}: ${w.join(" ")}`).toBe(w.length - 2);
    }
  });

  it("jede Zahl hat ein ANDERES Wort (keine Verwechslung, die ein Kind nicht auflösen kann)", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 20000; n++) {
      const w = zahlwortBg(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
    }
  });

  it("die Grenzen: 1.000.000 ist die grösste Zahl; darüber, unter 0 und Bruchzahlen werfen", () => {
    expect(MAX_ZAHL_BG).toBe(1_000_000);
    expect(() => zahlwortBg(1_000_001)).toThrow(RangeError);
    expect(() => zahlwortBg(-1)).toThrow(RangeError);
    expect(() => zahlwortBg(1.5)).toThrow(RangeError);
  });

  it("der allgemeine `zahlwort(n, \"bg\")` gibt kein Deutsch (er wirft)", () => {
    expect(() => zahlwort(41, "bg")).toThrow();
  });
});

describe("Zahlendiktat auf Weg bg: mit bulgarischen Zahlwörtern", () => {
  const alleTasten = [...LERNWEGE.bg.letterOrder, ..."0123456789.,"];
  const ctx = (ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: "bg",
    introduced: alleTasten,
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang: "bg",
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

  it("die Form wird angeboten, und die Zahlwörter sind bulgarisch (nie deutsch, nie englisch)", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    const zahlen = new Set(Array.from({ length: 90 }, (_, i) => zahlwortBg(i + 10)));
    for (const a of aufgaben) {
      const antworten = a.antworten.join(" ");
      expect(antworten, antworten).not.toMatch(/[a-zäöüß]/i);
      expect(a.antworten.some((w) => zahlen.has(w) || /^\d+$/.test(w)), a.frage).toBe(true);
    }
  });

  it("ohne die Taste ч wird kein Zahlwort mit ч verlangt - eine unlösbare Aufgabe gibt es nicht", () => {
    // „щ" kommt in keinem Zahlwort 10-99 vor - die Probe nimmt darum „ч" (четиридесет, четиринадесет).
    const ohne = alleTasten.filter((c) => c !== "ч");
    const aufgaben = zahlendiktat.fragen!(ctx({ introduced: ohne }));
    expect(aufgaben.length).toBeGreaterThan(3);
    for (const a of aufgaben) for (const antwort of a.antworten) expect(antwort, antwort).not.toMatch(/ч/);
  });

  it("ohne Ziffern wird die Form nicht angeboten (die Schranke gilt auch hier)", () => {
    expect(zahlendiktat.taugt(ctx({ introduced: [...LERNWEGE.bg.letterOrder] }))).toBe(false);
  });
});
