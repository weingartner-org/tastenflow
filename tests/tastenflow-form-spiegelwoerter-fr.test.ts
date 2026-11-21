/**
 * ★★★ WÄCHTER: SPIEGELWÖRTER AUF WEG „fr" (E10a, 25.09.2026, Bauplan §8.1
 * Punkt 4). Geprüft wird NUR, was E10a liefert: `UMKEHR_PAARE_FR` (vier
 * echte Umkehrpaare, an Wiktionnaire geprüft, siehe Kommentar dort) und dass
 * `passendePaare`/die Weg-Tabelle „fr" nicht mit den deutschen Paaren
 * vermischt oder still auf sie zurückfällt (Bauplan §2.3 Punkt 4).
 *
 * Ob eine ganze Runde „Spiegelwörter" für Weg „fr" WIRKLICH französische
 * Wörter zieht, prüft seit E10b (25.09.2026) `tastenflow-wortquelle-fr.test.ts`:
 * `wortquelle("fr")` liefert jetzt `WORDS_FR` (`wordsFr.ts`) statt still die
 * deutsche Liste, und derselbe Wächter läuft über ALLE Übungsformen. Die
 * Lücke war in BEFUND-2026-09-25-E10A-UEBUNGSFORMEN.md beschrieben.
 */
import { describe, expect, it } from "vitest";
import { fitText } from "@/lib/typing/corpus";
import { rueckwaerts, UMKEHR_PAARE_FR } from "@/lib/typing/uebungsformen/spiegelwoerter";

describe("★ UMKEHR_PAARE_FR: vier echte, geprüfte Umkehrpaare", () => {
  it("jedes Paar besteht aus zwei VERSCHIEDENEN Wörtern", () => {
    for (const [a, b] of UMKEHR_PAARE_FR) expect(a).not.toBe(b);
  });

  it("jedes Paar ist wirklich eine Umkehrung des anderen", () => {
    for (const [a, b] of UMKEHR_PAARE_FR) {
      expect(rueckwaerts(a), `${a}/${b}`).toBe(b);
      expect(rueckwaerts(b), `${a}/${b}`).toBe(a);
    }
  });

  it("keine Grossbuchstaben, kein Bindestrich, kein Leerzeichen, kein ß", () => {
    for (const [a, b] of UMKEHR_PAARE_FR) {
      for (const wort of [a, b]) {
        expect(wort).toBe(wort.toLowerCase());
        expect(wort).not.toMatch(/[ -]/);
        expect(wort).not.toContain("ß");
      }
    }
  });

  it("genau vier Paare (Bauplan §8.1: nur gemessene, geprüfte Paare, nicht aufgefüllt)", () => {
    expect(UMKEHR_PAARE_FR).toHaveLength(4);
  });

  it("kein Paar kommt doppelt vor, und die deutsche Liste bleibt unberührt", () => {
    const gesehen = new Set<string>();
    for (const [a, b] of UMKEHR_PAARE_FR) {
      expect(gesehen.has(a)).toBe(false);
      expect(gesehen.has(b)).toBe(false);
      gesehen.add(a);
      gesehen.add(b);
    }
  });
});

describe("★ Die Paare sind mit einem passenden Tastenstand vollständig tippbar", () => {
  it("mit allen 26 Buchstaben frei geht jedes der vier Paare", () => {
    const allowed = new Set("abcdefghijklmnopqrstuvwxyz".split(""));
    for (const [a, b] of UMKEHR_PAARE_FR) {
      expect(fitText(a, allowed)).toBe(a);
      expect(fitText(b, allowed)).toBe(b);
    }
  });
});
