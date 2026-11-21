/**
 * ★★★ WÄCHTER O-INHALT-PT/BR/SV (29.10.2026): die Zahlwörter der Wege „pt", „br" und „sv" (Vorbild `tastenflow-zahlwort-cs`).
 *
 * pt/br: „e" zwischen den Teilen („cento e vinte e três"), 100 = „cem", sonst „cento"; „mil" ohne „um"; nach „mil" ein „e" nur vor
 * einem Rest unter 100 oder einem runden Hunderter; Portugal „dezasseis, dezassete, dezanove", Brasilien „dezesseis, dezessete,
 * dezenove"; 14 in beiden „catorze" (Glossar). sv: zusammengeschrieben, Zählform „ett", „hundra"/„tusen" ohne „ett", „en miljon".
 * ⚠️ Die Tabellen sind gegen das Sprachwissen des Baus gelesen, NICHT von Personen mit der Sprache als Erstsprache - sie stehen als
 * Tabelle da, damit sie jemand Zeile für Zeile gegenlesen kann.
 */
import { describe, expect, it } from "vitest";
import { zahlwort } from "../src/lib/typing/zahlwort";
import { ZAHLWORT_PT } from "../src/lib/typing/zahlwortPt";
import { ZAHLWORT_BR } from "../src/lib/typing/zahlwortBr";
import { ZAHLWORT_SV, MAX_ZAHL_SV, zahlwortSv } from "../src/lib/typing/zahlwortSv";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";
import type { Lernweg } from "../src/lib/typing/lernweg";

const pt = ZAHLWORT_PT!;
const br = ZAHLWORT_BR!;

describe("Zahlwort pt (Portugal) und br (Brasilien): die Tabelle", () => {
  const GEMEINSAM: readonly (readonly [number, string])[] = [
    [0, "zero"], [1, "um"], [2, "dois"], [3, "três"], [9, "nove"], [10, "dez"], [11, "onze"], [14, "catorze"], [15, "quinze"],
    [18, "dezoito"], [20, "vinte"], [21, "vinte e um"], [33, "trinta e três"], [45, "quarenta e cinco"], [50, "cinquenta"],
    [68, "sessenta e oito"], [77, "setenta e sete"], [80, "oitenta"], [99, "noventa e nove"],
    [100, "cem"], [101, "cento e um"], [110, "cento e dez"], [123, "cento e vinte e três"], [200, "duzentos"],
    [345, "trezentos e quarenta e cinco"], [500, "quinhentos"], [999, "novecentos e noventa e nove"],
    [1000, "mil"], [1001, "mil e um"], [1100, "mil e cem"], [1200, "mil e duzentos"], [1234, "mil duzentos e trinta e quatro"],
    [2000, "dois mil"], [2026, "dois mil e vinte e seis"], [21000, "vinte e um mil"], [100000, "cem mil"],
    [101000, "cento e um mil"], [999999, "novecentos e noventa e nove mil novecentos e noventa e nove"], [1000000, "um milhão"],
  ];
  it.each(GEMEINSAM)("%i ⇒ %s (pt und br)", (n, wort) => {
    expect(pt(n)).toBe(wort);
    expect(br(n)).toBe(wort);
  });

  it("16, 17, 19: Portugal dezasseis/dezassete/dezanove, Brasilien dezesseis/dezessete/dezenove - nie gemischt", () => {
    expect([16, 17, 19].map(pt)).toEqual(["dezasseis", "dezassete", "dezanove"]);
    expect([16, 17, 19].map(br)).toEqual(["dezesseis", "dezessete", "dezenove"]);
    for (let n = 0; n <= 20000; n++) {
      expect(/dezess|dezen/.test(pt(n)), `pt ${n}`).toBe(false);
      expect(/dezass|dezan/.test(br(n)), `br ${n}`).toBe(false);
    }
  });

  it("nur Kleinbuchstaben und Zeichen der Sprache, ein Leerzeichen, kein Bindestrich; jede Zahl ein anderes Wort", () => {
    for (const f of [pt, br]) {
      const gesehen = new Map<string, number>();
      for (let n = 0; n <= 20000; n++) {
        const w = f(n);
        expect(/^[a-zãçêõ]+( [a-zãçêõ]+)*$/.test(w), `${n}: ${w}`).toBe(true);
        expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
        gesehen.set(w, n);
      }
    }
  });

  it("die Grenzen werfen", () => {
    expect(() => pt(1_000_001)).toThrow(RangeError);
    expect(() => br(-1)).toThrow(RangeError);
    expect(() => pt(1.5)).toThrow(RangeError);
  });
});

describe("Zahlwort sv: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "noll"], [1, "ett"], [2, "två"], [3, "tre"], [4, "fyra"], [7, "sju"], [8, "åtta"], [9, "nio"], [10, "tio"], [11, "elva"],
    [12, "tolv"], [13, "tretton"], [14, "fjorton"], [16, "sexton"], [17, "sjutton"], [18, "arton"], [19, "nitton"], [20, "tjugo"],
    [21, "tjugoett"], [34, "trettiofyra"], [40, "fyrtio"], [58, "femtioåtta"], [66, "sextiosex"], [70, "sjuttio"], [80, "åttio"],
    [99, "nittionio"], [100, "hundra"], [101, "hundraett"], [120, "hundratjugo"], [200, "tvåhundra"], [345, "trehundrafyrtiofem"],
    [1000, "tusen"], [1001, "tusenett"], [1100, "tusenhundra"], [2000, "tvåtusen"], [2026, "tvåtusentjugosex"],
    [21000, "tjugoettusen"], [100000, "hundratusen"], [999999, "niohundranittioniotusenniohundranittionio"], [1000000, "en miljon"],
  ];
  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortSv(n)).toBe(wort);
  });

  it("zusammengeschrieben, nur a-z und å ä ö, jede Zahl ein anderes Wort", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n < MAX_ZAHL_SV; n++) {
      const w = zahlwortSv(n);
      if (n <= 20000) {
        expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
        gesehen.set(w, n);
      }
      if (n % 97 === 0) expect(/^[a-zåäö]+$/.test(w), `${n}: ${w}`).toBe(true);
    }
    expect(ZAHLWORT_SV).toBe(zahlwortSv);
    expect(() => zahlwortSv(1_000_001)).toThrow(RangeError);
  });

  it("der allgemeine `zahlwort(n, …)` kennt pt, br, sv weiter nicht (kein stilles Deutsch)", () => {
    for (const s of ["pt", "br", "sv"] as const) expect(() => zahlwort(41, s)).toThrow();
  });
});

describe("Zahlendiktat auf den Wegen pt, br, sv: angeboten, mit Zahlwörtern der Sprache", () => {
  const TASTEN: Record<string, string> = {
    pt: "abcdefghijklmnopqrstuvwxyzãçêõáéíóú0123456789.,",
    br: "abcdefghijklmnopqrstuvwxyzãçêõáéíóú0123456789.,",
    sv: "abcdefghijklmnopqrstuvwxyzåäö0123456789.,",
  };
  const ctx = (s: "pt" | "br" | "sv", ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: s as Lernweg,
    introduced: [...TASTEN[s]],
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang: s,
    count: 8,
    zufall: (() => {
      let x = 7;
      return () => {
        x = (x * 1103515245 + 12345) % 2147483648;
        return x / 2147483648;
      };
    })(),
    ...ueber,
  });
  const WORT = { pt, br, sv: zahlwortSv } as const;

  it.each(["pt", "br", "sv"] as const)("%s: die Form bietet sich an, keine deutschen Zahlwörter", (s) => {
    expect(zahlendiktat.taugt(ctx(s))).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx(s));
    expect(aufgaben.length).toBeGreaterThan(3);
    const woerter = new Set(Array.from({ length: 90 }, (_, i) => WORT[s](i + 10)));
    for (const a of aufgaben) {
      const text = `${a.frage} ${a.antworten.join(" ")}`;
      expect(text, text).not.toMatch(/[üß]|zig\b|und/);
      expect(a.antworten.some((w) => woerter.has(w) || /^\d+$/.test(w)), text).toBe(true);
    }
  });

  it("sv ohne å: kein Zahlwort mit å als Antwort verlangt (åtta, åttio)", () => {
    const ohne = [...TASTEN.sv].filter((c) => c !== "å");
    const aufgaben = zahlendiktat.fragen!(ctx("sv", { introduced: ohne }));
    for (const a of aufgaben) for (const w of a.antworten) expect(w, w).not.toMatch(/å/);
  });
});
