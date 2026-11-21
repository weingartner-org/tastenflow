/**
 * ★★★ WÄCHTER: ALPHABETREIHEN AUF WEG „fr" (E10a, 25.09.2026, Bauplan §8.1
 * Punkt 3). Das französische Alphabet hat 26 Buchstaben, a bis z - Akzente
 * gehören nicht dazu (Auftrag E10a Punkt 3). Die Reihenfolge läuft über eine
 * Weg-Tabelle, nicht über eine (weitere) verschachtelte Bedingung - siehe
 * `tests/tastenflow-sprach-weichen.test.ts`.
 */
import { describe, expect, it } from "vitest";
import { alphabetreihen } from "@/lib/typing/uebungsformen/alphabetreihen";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";

function ctxFr(introduced: string[], overrides: Partial<FormKontext> = {}): FormKontext {
  return {
    lernweg: "fr",
    introduced,
    shift: false,
    oneHand: false,
    stufe: "teens",
    lang: "fr",
    count: 6,
    zufall: () => 0,
    ...overrides,
  };
}

const ALPHABET_26 = "abcdefghijklmnopqrstuvwxyz".split("");

describe("★ Alphabetreihen auf Weg fr", () => {
  it("mit allen 26 Buchstaben freigeschaltet taugt die Form", () => {
    const ctx = ctxFr(ALPHABET_26);
    expect(alphabetreihen.taugt(ctx)).toBe(true);
  });

  it("mit nur 5 Buchstaben taugt die Form nicht (Schwelle wie de/en)", () => {
    const ctx = ctxFr(["a", "b", "c", "d", "e"]);
    expect(alphabetreihen.taugt(ctx)).toBe(false);
  });

  it("eine gebaute Runde besteht NUR aus a-z - kein é è à ç ù, kein ß, kein ö", () => {
    const ctx = ctxFr(ALPHABET_26);
    const runde = alphabetreihen.baue!(ctx);
    expect(runde).not.toBeNull();
    for (const zeile of runde!.zeilen) {
      for (const zeichen of zeile.text.toLowerCase()) {
        if (zeichen === " " || zeichen === ".") continue;
        expect(ALPHABET_26, zeile.text).toContain(zeichen);
      }
    }
  });

  it("mit einem Tastenstand, der nur a-m kennt, bleiben n-z aussen vor", () => {
    const teilAlphabet = ALPHABET_26.slice(0, 13); // a..m
    const ctx = ctxFr(teilAlphabet);
    const runde = alphabetreihen.baue!(ctx);
    expect(runde).not.toBeNull();
    for (const zeile of runde!.zeilen) {
      for (const zeichen of zeile.text.toLowerCase()) {
        if (zeichen === " " || zeichen === ".") continue;
        expect(teilAlphabet, zeile.text).toContain(zeichen);
      }
    }
  });

  it("Weg de bleibt byte-gleich: ä ö ü ß stehen weiter am Ende des deutschen Alphabets", () => {
    const deAlphabet = "abcdefghijklmnopqrstuvwxyzäöüß".split("");
    const ctx: FormKontext = {
      lernweg: "de",
      introduced: deAlphabet,
      shift: false,
      oneHand: false,
      stufe: "teens",
      lang: "de",
      count: 6,
      zufall: () => 0,
    };
    const runde = alphabetreihen.baue!(ctx);
    expect(runde).not.toBeNull();
    // Mit `zufall: () => 0` läuft der Cursor bei genug Zeilen einmal über
    // die ganzen 30 Zeichen des deutschen Alphabets hinweg - dann MUSS ein
    // Umlaut oder ß vorkommen, sonst wäre die deutsche Reihenfolge (die
    // dieser Wächter NICHT anfassen soll) verändert.
    const text = runde!.zeilen.map((z) => z.text).join(" ");
    expect(/[äöüß]/.test(text), text).toBe(true);
  });
});
