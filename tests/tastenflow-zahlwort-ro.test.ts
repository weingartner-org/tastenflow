/**
 * ★★★★ WÄCHTER O-INHALT-RO (29.10.2026): `zahlwortRo` - die rumänischen Zahlwörter 0 bis 1.000.000 - und das Zahlendiktat auf Weg „ro".
 *
 * Vorbild: `tests/tastenflow-zahlwort-cs.test.ts`. Regeln (siehe `zahlwortRo.ts`): getrennt, Zehner „și" Einer; Zählform maskulin
 * (unu, doi, doisprezece); „o sută / două sute", „o mie / două mii", „de" vor „mii" bei 00 und 20-99; ș ț mit Komma.
 * ⚠️ Die Tabelle ist gegen das Sprachwissen des Baus gelesen, NICHT von einer Person mit Rumänisch als Erstsprache.
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_RO, ZAHLWORT_RO, zahlwortRo } from "../src/lib/typing/zahlwortRo";
import { zahlwort } from "../src/lib/typing/zahlwort";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import { introOrder } from "../src/lib/typing/letters";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";

const CEDILLE = new RegExp(`[${String.fromCharCode(0x15f, 0x163, 0x15e, 0x162)}]`);

describe("zahlwortRo: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "zero"], [1, "unu"], [2, "doi"], [3, "trei"], [4, "patru"], [5, "cinci"], [6, "șase"], [7, "șapte"], [8, "opt"], [9, "nouă"],
    [10, "zece"], [11, "unsprezece"], [12, "doisprezece"], [14, "paisprezece"], [16, "șaisprezece"], [19, "nouăsprezece"],
    [20, "douăzeci"], [21, "douăzeci și unu"], [22, "douăzeci și doi"], [30, "treizeci"], [40, "patruzeci"], [50, "cincizeci"],
    [60, "șaizeci"], [66, "șaizeci și șase"], [70, "șaptezeci"], [80, "optzeci"], [90, "nouăzeci"], [99, "nouăzeci și nouă"],
    [100, "o sută"], [101, "o sută unu"], [112, "o sută doisprezece"], [200, "două sute"], [300, "trei sute"],
    [999, "nouă sute nouăzeci și nouă"],
    [1000, "o mie"], [1001, "o mie unu"], [2000, "două mii"], [2026, "două mii douăzeci și șase"], [12000, "douăsprezece mii"],
    [19000, "nouăsprezece mii"], [20000, "douăzeci de mii"], [21000, "douăzeci și una de mii"], [22000, "douăzeci și două de mii"],
    [100000, "o sută de mii"], [105000, "o sută cinci mii"], [120000, "o sută douăzeci de mii"], [200000, "două sute de mii"],
    [999999, "nouă sute nouăzeci și nouă de mii nouă sute nouăzeci și nouă"], [1000000, "un milion"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortRo(n)).toBe(wort);
  });

  it("der Einhängepunkt trägt die Funktion (nicht mehr null)", () => {
    expect(ZAHLWORT_RO).toBe(zahlwortRo);
  });

  it("„de mii“ genau dann, wenn die Tausenderzahl auf 00 oder 20-99 endet", () => {
    for (let t = 2; t < 1000; t++) {
      const w = zahlwortRo(t * 1000);
      const r = t % 100;
      expect(w.endsWith(" de mii"), `${t * 1000}: ${w}`).toBe(r === 0 || r >= 20);
    }
  });

  it("jede Zahl hat ein ANDERES Wort; nur Buchstaben der Sprache, einfache Leerzeichen; nie Cedille, nie Strich", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 20000; n++) {
      const w = zahlwortRo(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
    }
    for (let n = 0; n <= MAX_ZAHL_RO; n += 991) {
      const w = zahlwortRo(n);
      expect(/^[a-zăâîșț]+( [a-zăâîșț]+)*$/.test(w), `${n}: ${w}`).toBe(true);
      expect(CEDILLE.test(w), `${n}: ${w}`).toBe(false);
    }
  });

  it("die Grenzen werfen; der allgemeine `zahlwort(n, \"ro\")` wirft weiter (kein stilles Deutsch)", () => {
    expect(() => zahlwortRo(1_000_001)).toThrow(RangeError);
    expect(() => zahlwortRo(-1)).toThrow(RangeError);
    expect(() => zahlwortRo(0.5)).toThrow(RangeError);
    expect(() => zahlwort(41, "ro" as never)).toThrow();
  });
});

describe("Zahlendiktat auf Weg ro: angeboten, mit rumänischen Zahlwörtern", () => {
  const zufall = (start: number) => {
    let s = start;
    return () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
  };
  const ctx = (ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: "ro", introduced: introOrder("ro"), shift: true, oneHand: false, stufe: "teens", lang: "ro", count: 8,
    zufall: zufall(7), ...ueber,
  });

  it("die Form wird angeboten, und jede Antwort ist ein rumänisches Zahlwort oder Ziffern", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    const zahlen = new Set(Array.from({ length: 90 }, (_, i) => zahlwortRo(i + 10)));
    for (const a of aufgaben) for (const w of a.antworten) expect(zahlen.has(w) || /^\d+$/.test(w), w).toBe(true);
  });

  it("ohne ă wird kein Zahlwort mit ă als Antwort verlangt - und mit ă kommt eines vor", () => {
    const ohne = introOrder("ro").filter((c) => c !== "ă");
    for (const a of zahlendiktat.fragen!(ctx({ introduced: ohne }))) for (const w of a.antworten) expect(w, w).not.toMatch(/ă/);
    const mit = Array.from({ length: 12 }, (_, i) => zahlendiktat.fragen!(ctx({ zufall: zufall(i + 1) }))).flat();
    expect(mit.some((a) => a.antworten.some((w) => /ă/.test(w)))).toBe(true);
  });
});
