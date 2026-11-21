/**
 * ★★★ WÄCHTER: die Rate-Wörter der Polarstation auf Weg „fr" (E10b-2,
 * 26.09.2026, Bauplan französischer Lehrgang §8.1).
 *
 * Bis hierher fiel Weg „fr" in der Expedition auf den ENGLISCHEN Vorrat
 * (`WORDS_EN`) - ein Kind auf dem französischen Weg riet englische Wörter.
 * Jetzt gibt es {@link WORDS_FR_EXPEDITION}; geprüft wird die Liste selbst
 * (Form, Rechtschreibung, Hausregeln) und der Weg, auf dem die Station sie
 * zieht (`stationGuessWords`), an jeder Sprosse der französischen Reihenfolge.
 */
import { describe, expect, it } from "vitest";
import { WORDS_EN, WORDS_FR_EXPEDITION, stationGuessWords } from "@/lib/typing/expedition/words";
import { WORDS } from "@/lib/typing/words";
import { lernwegDef } from "@/lib/typing/lernweg";
import { SHIFT_UNIT } from "@/lib/typing/letters";

const LISTE = WORDS_FR_EXPEDITION;

describe("★ WORDS_FR_EXPEDITION: Form und Hausregeln", () => {
  it("rund 200 Wörter, jedes nur einmal", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(200);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
  });

  it("klein, 2 bis 6 Buchstaben, nur Buchstaben mit EINER Taste auf Weg „fr“ (kein ê ï …)", () => {
    expect(LISTE.filter((w) => !/^[a-zéèàçù]{2,6}$/.test(w))).toEqual([]);
  });

  it("nur neue Rechtschreibung (F4): kein î/û, kein oignon/événement", () => {
    expect(LISTE.filter((w) => /[îû]/.test(w) || ["oignon", "événement", "boîte"].includes(w))).toEqual([]);
  });

  it("kein Wort mit Landesunterschied, kulturell ruhig (§6.5, §10.1)", () => {
    const nein = [
      "déjeuner", "diner", "souper", "septante", "nonante", "huitante", "courriel", "gomme",
      "porc", "cochon", "jambon", "lard", "église", "messe", "noël", "dieu", "vin", "bière",
    ];
    expect(LISTE.filter((w) => nein.includes(w))).toEqual([]);
  });

  it("Tiere, Pflanzen und Orte aus der ganzen Frankophonie sind dabei", () => {
    for (const w of ["baobab", "okapi", "fennec", "zébu", "érable", "wapiti", "manioc", "igname"])
      expect(LISTE, w).toContain(w);
  });

  it("keine Übernahme aus den deutschen oder englischen Listen - ausser Wörtern, die im Französischen genauso heissen", () => {
    // Geprüft am 26.09.2026: jedes dieser Wörter ist Französisch in genau
    // dieser Schreibung (Manulex CP/CE1).
    const GLEICH_GESCHRIEBEN = new Set(["des", "tasse", "rose", "route", "café", "banane", "taxi", "lion", "train", "six"]);
    const de = new Set(WORDS.map((w) => w.toLowerCase()));
    const en = new Set(WORDS_EN);
    expect(LISTE.filter((w) => (de.has(w) || en.has(w)) && !GLEICH_GESCHRIEBEN.has(w))).toEqual([]);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „fr“ nur aus der französischen Liste", () => {
  const reihenfolge = lernwegDef("fr").introOrder;
  const fr = new Set(LISTE);

  it("an jeder Sprosse ab „e“: drei Wörter, alle aus der Liste, alle mit dem Stand tippbar", () => {
    const fehler: string[] = [];
    for (let n = 9; n <= reihenfolge.length; n++) {
      const stand = reihenfolge.slice(0, n);
      const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
      for (const seed of [0, 5, 17]) {
        const woerter = stationGuessWords(stand, { lernweg: "fr", seed });
        if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
        for (const w of woerter) {
          if (!fr.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
          if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
        }
      }
    }
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: Weg „en“ zieht weiter englisch, Weg „de“ weiter deutsch", () => {
    const en = stationGuessWords([...lernwegDef("en").letterOrder], { lernweg: "en", seed: 1 });
    for (const w of en) expect(WORDS_EN).toContain(w);
    const de = new Set(WORDS.map((w) => w.toLowerCase()));
    for (const w of stationGuessWords([...lernwegDef("de").letterOrder], { seed: 1 })) expect(de.has(w.toLowerCase())).toBe(true);
  });

  it("nichts wird grossgeschrieben (Nomen gross ist Deutsch)", () => {
    const alle = [...reihenfolge];
    for (const seed of [0, 1, 2, 3]) {
      for (const w of stationGuessWords(alle, { lernweg: "fr", seed, shiftLearned: true })) expect(w).toBe(w.toLowerCase());
    }
  });
});
