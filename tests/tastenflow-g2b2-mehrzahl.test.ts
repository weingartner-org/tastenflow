/**
 * ★ G2b-2 (02.10.2026): `mehrzahl()` kennt `few` und `many` (Polnisch, Tschechisch) - und liefert für
 * de, en, fr, es genau, was es vorher lieferte (nur `one` und `other`).
 */
import { describe, expect, it } from "vitest";
import { mehrzahl, type MehrzahlFormen } from "@/lib/bedienSprache/texte";
import type { BedienSprache } from "@/lib/bedienSprache/sprache";
import { ALLE_SPRACHEN, SPRACHREGISTER } from "@/lib/typing/sprachRegister";

/** Formen, die ihren eigenen Kategorienamen zurückgeben - so sieht man, welche gewählt wurde. */
const ALLE_FORMEN: MehrzahlFormen = {
  zero: () => "zero",
  one: () => "one",
  two: () => "two",
  few: () => "few",
  many: () => "many",
  other: () => "other",
};
const NUR_EINS_UND_ANDERE: MehrzahlFormen = { one: () => "one", other: () => "other" };

const ZAHLEN = [0, 1, 2, 5, 12, 22, 25] as const;

describe("★ die gewählte Form ist die der CLDR-Regel (Intl.PluralRules) - jede Sprache, jede Probezahl", () => {
  for (const sprache of ALLE_SPRACHEN) {
    it(`${sprache}: 0, 1, 2, 5, 12, 22, 25`, () => {
      const regel = new Intl.PluralRules(SPRACHREGISTER[sprache].locale);
      for (const n of ZAHLEN) {
        // ★ O-TR: eine Sprache mit `einzahlNachZahl` (Türkisch: „5 hata") nimmt nach JEDER Zahl die Form `one`.
        const erwartet = SPRACHREGISTER[sprache].einzahlNachZahl ? "one" : regel.select(n);
        expect(mehrzahl(n, sprache as BedienSprache, ALLE_FORMEN), `${sprache} ${n}`).toBe(erwartet);
      }
    });
  }

  it("gemessen: die Formen von pl, cs, tr, it, de für 0, 1, 2, 5, 12, 22, 25", () => {
    const form = (s: BedienSprache) => ZAHLEN.map((n) => mehrzahl(n, s, ALLE_FORMEN));
    expect(form("pl")).toEqual(["many", "one", "few", "many", "many", "few", "many"]);
    expect(form("cs")).toEqual(["other", "one", "few", "other", "other", "other", "other"]);
    // ★ O-TR: Türkisch nimmt nach jeder Zahl die Einzahl-Form (`einzahlNachZahl`), also immer `one`.
    expect(form("tr")).toEqual(["one", "one", "one", "one", "one", "one", "one"]);
    expect(form("it")).toEqual(["other", "one", "other", "other", "other", "other", "other"]);
    expect(form("de")).toEqual(["other", "one", "other", "other", "other", "other", "other"]);
  });

  it("★ Polnisch: 1 sekunda · 2 sekundy · 5 sekund · 22 sekundy", () => {
    const sek: MehrzahlFormen = {
      one: (z) => `${z} sekunda`,
      few: (z) => `${z} sekundy`,
      many: (z) => `${z} sekund`,
      other: (z) => `${z} sekundy`,
    };
    expect(ZAHLEN.map((n) => mehrzahl(n, "pl", sek))).toEqual([
      "0 sekund",
      "1 sekunda",
      "2 sekundy",
      "5 sekund",
      "12 sekund",
      "22 sekundy",
      "25 sekund",
    ]);
  });
});

describe("eine fehlende Kategorie fällt auf other", () => {
  it("pl ohne few/many: wie bisher one/other", () => {
    expect(ZAHLEN.map((n) => mehrzahl(n, "pl", NUR_EINS_UND_ANDERE))).toEqual([
      "other", "one", "other", "other", "other", "other", "other",
    ]);
  });

  it("nur few fehlt: 2 fällt auf other, 5 bleibt many", () => {
    const f: MehrzahlFormen = { one: () => "one", many: () => "many", other: () => "other" };
    expect(mehrzahl(2, "pl", f)).toBe("other");
    expect(mehrzahl(5, "pl", f)).toBe("many");
  });
});

describe("★ bestehende Aufrufe (nur one und other): de, en, fr, es liefern dasselbe wie vor G2b-2", () => {
  /** Die alte Fassung, Zeichen für Zeichen. */
  function alt(n: number, sprache: BedienSprache, formen: { one: (z: string) => string; other: (z: string) => string }) {
    const regel = new Intl.PluralRules(
      { de: "de-AT", en: "en-GB", fr: "fr-FR", es: "es-ES" }[sprache as "de" | "en" | "fr" | "es"],
    ).select(n);
    return (regel === "one" ? formen.one : formen.other)(String(n));
  }
  const formen = { one: (z: string) => `${z} Stück`, other: (z: string) => `${z} Stücke` };

  for (const sprache of ["de", "en", "fr", "es"] as const) {
    it(`${sprache}`, () => {
      for (const n of [0, 1, 1.5, 2, 5, 12, 21, 100, 1_000_000, 2_000_000]) {
        const neu = mehrzahl(n, sprache, formen);
        // Die Zahl wird je Sprache geschrieben (Tausendertrenner); verglichen wird der WORT-Teil.
        expect(neu.replace(/^[\d.,\s  ]+/, ""), `${sprache} ${n}`).toBe(
          alt(n, sprache, formen).replace(/^[\d.,\s  ]+/, ""),
        );
      }
    });
  }
});
