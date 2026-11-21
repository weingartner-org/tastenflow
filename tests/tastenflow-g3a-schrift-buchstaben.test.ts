/**
 * ★★★ G3a-SCHRIFT (25.10.2026, Leitfaden Falle 7/43/96): Buchstaben-Muster der neun Sprachen des Gerüsts als
 * EIGENSCHAFT im Sprachregister - Vokale, Tastenkappe, Wortform mit Apostroph. Die acht Sprachen davor bleiben, wie
 * sie waren.
 */
import { describe, expect, it } from "vitest";
import { ALLE_SPRACHEN, GERUEST_SPRACHEN, istBuchstabe, kappeFuer, kleinFuer, sprachBeschreibung } from "../src/lib/typing/sprachRegister";
import { istVokalIn } from "../src/lib/typing/generator";
import { normalizeWord } from "../src/lib/typing/lexicon";
import type { Lang } from "../src/lib/typing/account";

const ALTE: readonly Lang[] = ALLE_SPRACHEN.filter((s) => !(GERUEST_SPRACHEN as readonly Lang[]).includes(s));
/** Die gemeinsame Liste `VOWELS` des Generators, wie sie vor G3a war (Kopie). */
const VOWELS_ALT = "aeiouäöüàâéèêëîïôùûÿáíóúìòıěůý";

describe("Vokale je Sprache (generator.ts `istVokalIn`)", () => {
  it("die acht Sprachen vor dem 25.10.2026 haben keine eigene Liste - Ergebnis wie vorher", () => {
    for (const s of ALTE) expect(sprachBeschreibung(s).vokale, s).toBeNull();
    for (const s of ALTE.filter((x) => x !== "pl")) {
      for (const c of "abcdefghijklmnopqrstuvwxyzäöüàâéèêëîïôùûÿáíóúìòıěůýąęłж") {
        expect(istVokalIn(c, s), `${s} ${c}`).toBe(VOWELS_ALT.includes(c));
      }
    }
  });

  it("jede der neun Sprachen hat ihre Vokale (klein, Buchstaben, keine Doppel)", () => {
    for (const s of GERUEST_SPRACHEN) {
      const v = sprachBeschreibung(s).vokale;
      expect(v, s).not.toBeNull();
      for (const c of v!) {
        expect(istBuchstabe(c), `${s} ${c}`).toBe(true);
        expect(kleinFuer(c, s), `${s} ${c}`).toBe(c);
      }
      expect(new Set(v!).size, s).toBe([...v!].length);
    }
  });

  it.each([
    ["bg", "аеиоуъюя", "бвгджзйклмнпрстфхцчшщь"],
    ["uk", "аеєиіїоуюя", "бвгґджзйклмнпрстфхцчшщь"],
    ["el", "αεηιουωάέήίόύώϊϋΐΰ", "βγδζθκλμνξπρσςτφχψ"],
    ["hu", "aáeéiíoóöőuúüű", "bcdfgjklmnprstvzy"],
    ["ro", "aăâeiîou", "bcdfgjklmnprsștțvz"],
    ["sv", "aeiouyåäöé", "bcdfgjklmnprstv"],
    ["pt", "aáàâãeéêiíoóôõuú", "bcçdfgjlmnprstvz"],
    ["br", "aáàâãeéêiíoóôõuú", "bcçdfgjlmnprstvz"],
    ["nl", "aeiouéëïó", "bcdfgjklmnprstvwz"],
  ] as const)("%s: Vokale und Konsonanten", (s, vokale, konsonanten) => {
    for (const c of vokale) expect(istVokalIn(c, s), `${s} Vokal ${c}`).toBe(true);
    for (const c of konsonanten) expect(istVokalIn(c, s), `${s} Konsonant ${c}`).toBe(false);
  });
});

describe("Tastenkappe (`kappeFuer`)", () => {
  it.each([
    ["bg", "ф", "Ф"], ["bg", "ъ", "Ъ"], ["uk", "ї", "Ї"], ["uk", "ґ", "Ґ"],
    ["el", "φ", "Φ"], ["el", "ά", "Ά"],
    // ★ G4-NAHT (25.10.2026): ς bleibt ς - Σ ist die Kappe der Taste σ (G3b, kleine Kappen; vorher hier „Σ")
    ["el", "ς", "ς"], ["el", "σ", "Σ"],
    ["hu", "ő", "Ő"], ["ro", "ș", "Ș"], ["sv", "å", "Å"], ["pt", "ç", "Ç"], ["nl", "f", "F"],
    // ΐ: Grossform aus einem Zeichen über `grossSonderformen` (Ϊ, ohne Tonos); kein Buchstabe: bleibt
    ["el", "ΐ", "Ϊ"], ["el", "΄", "΄"], ["bg", ",", ","], ["uk", "1", "1"],
  ] as const)("%s: %s ⇒ %s", (s, taste, kappe) => {
    expect(kappeFuer(taste, s)).toBe(kappe);
  });

  it("Sprachen ohne `kappenAlleGross`: nur a-z gross (wie die bisherigen `kappe`-Funktionen)", () => {
    for (const s of ALTE) {
      expect(sprachBeschreibung(s).kappenAlleGross, s).toBe(false);
      expect(kappeFuer("f", s), s).toBe(s === "tr" ? "F" : "F");
      expect(kappeFuer("ä", s), s).toBe("ä");
    }
    expect(kappeFuer("i", "tr")).toBe("İ");
  });
});

describe("Wortform mit Apostroph (Ukrainisch)", () => {
  it("U+0027, U+2019 und U+02BC ergeben dieselbe Wortform", () => {
    const formen = ["сім'я", "сім’я", "сімʼя"].map((w) => normalizeWord(w, "uk"));
    expect(new Set(formen).size).toBe(1);
    expect(formen[0]).toBe("сімя");
  });
  it("Gegenprobe: mit der Klasse aller Buchstaben bliebe U+02BC stehen", () => {
    expect("сімʼя".replace(/[^\p{L}]/gu, "")).not.toBe("сімя");
  });
  it("Bulgarisch, Griechisch: Wörter bleiben ganz", () => {
    expect(normalizeWord("Къща,", "bg")).toBe("къща");
    expect(normalizeWord("Πού;", "el")).toBe("πού");
  });
});
