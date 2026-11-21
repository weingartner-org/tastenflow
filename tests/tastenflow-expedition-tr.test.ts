/**
 * ★★★ WÄCHTER: die Rate-Wörter der Polarstation auf Weg „tr" (TR-S, 09.10.2026). Modell:
 * `tests/tastenflow-expedition-it.test.ts`.
 *
 * Bis hierher zog Weg „tr" den ENGLISCHEN Vorrat (Rückfall seit G2a) - ein Kind auf dem türkischen Weg hätte englische Wörter
 * entschlüsselt, von der englischen Stimme vorgelesen. Geprüft wird die Liste selbst (Form, Hausregeln, Sperrliste, Lexikon)
 * und der Weg, auf dem die Station sie zieht (`stationGuessWords`), an JEDER Sprosse der türkischen Reihenfolge auf `tr-q`.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  WORDS_EN,
  WORDS_ES_EXPEDITION,
  WORDS_FR_EXPEDITION,
  WORDS_IT_EXPEDITION,
  WORDS_TR_EXPEDITION,
  rateWortSprache,
  stationGuessWords,
} from "@/lib/typing/expedition/words";
import { WORDS } from "@/lib/typing/words";
import { WORDS_TR, STUFE_VOCAB_TR } from "@/lib/typing/wordsTr";
import { lernwegDef } from "@/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { fuerWortlisteUngeeignetTr } from "@/lib/typing/sperrlisteTr";
import { isRealWord } from "@/lib/typing/lexicon";

const LISTE = WORDS_TR_EXPEDITION;

/** Rate-Buchstaben: a-z und die sechs türkischen Buchstaben, jeder mit eigener Taste ohne Umschalt auf `tr-q`. */
const RATE_BUCHSTABE = /^[a-zçğıöşü]$/;
const FORM = /^[a-zçğıöşü]{2,6}$/;

afterEach(() => setLayout("de"));

describe("★ WORDS_TR_EXPEDITION: Form und Hausregeln", () => {
  it("rund 250 Wörter, jedes nur einmal", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(240);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
  });

  it("klein, 2 bis 6 Zeichen, nur Rate-Buchstaben (kein â, kein Apostroph, kein Grossbuchstabe)", () => {
    expect(LISTE.filter((w) => !FORM.test(w))).toEqual([]);
  });

  it("keine Sperrwörter (Kern, Wortbasis, gefaltet, unerwünscht)", () => {
    expect(LISTE.filter((w) => fuerWortlisteUngeeignetTr(w))).toEqual([]);
  });

  it("Gegenprobe: ein Kern-Stamm, ein unerwünschtes Wort und Wörter mit â, Apostroph oder Grossbuchstaben fallen auf", () => {
    expect(["sik", "ordu", "kedi"].filter((w) => fuerWortlisteUngeeignetTr(w))).toEqual(["sik", "ordu"]);
    expect(["hâlâ", "ali'ye", "Kedi", "k"].filter((w) => !FORM.test(w))).toEqual(["hâlâ", "ali'ye", "Kedi", "k"]);
  });

  it("jedes Wort ist ein türkisches Wort des Vorlese-Lexikons - die Stimme sagt es ganz", () => {
    expect(LISTE.filter((w) => !isRealWord(w, "tr"))).toEqual([]);
  });

  it("Bezug zur Szene und zum Land: Himmelsrichtungen, Kälte, Reise, Tiere, Landschaft, Dinge des Landes", () => {
    for (const w of ["kuzey", "güney", "doğu", "batı", "kar", "buz", "buzul", "kutup", "donmuş", "rota", "harita", "kamp", "ekip",
      "yelken", "kayık", "kürek", "kurt", "tilki", "geyik", "yunus", "tavşan", "kuğu", "dağ", "göl", "vadi", "mağara", "orman", "çöl",
      "deniz", "çay", "zeytin", "çorba", "kahve"])
      expect(LISTE, w).toContain(w);
  });

  it("★ ı und i sind zwei Buchstaben: Wörter mit ı und mit i stehen beide drin, und kein Wort mit ı verschwindet in einer i-Form", () => {
    expect(LISTE.filter((w) => w.includes("ı")).length).toBeGreaterThan(15);
    expect(LISTE.filter((w) => w.includes("i")).length).toBeGreaterThan(15);
    // Wortpaare, die sich nur im Punkt unterscheiden, stehen nie beide in der Liste (die Rate-Aufgabe wäre mehrdeutig).
    const falten = (w: string) => w.replace(/ı/g, "i");
    const ohnePunkt = LISTE.map(falten);
    expect(LISTE.filter((w, i) => ohnePunkt.indexOf(falten(w)) !== i)).toEqual([]);
  });

  it("die meisten Wörter stammen aus dem türkischen Übungswortschatz (WORDS_TR/STUFE_VOCAB_TR)", () => {
    const basis = new Set([...WORDS_TR, ...Object.values(STUFE_VOCAB_TR).flat()]);
    expect(LISTE.filter((w) => basis.has(w)).length / LISTE.length).toBeGreaterThan(0.4);
  });

  it("keine Übernahme aus den anderen Listen - ausser Wörtern, die im Türkischen genauso heissen", () => {
    // Geprüft am 09.10.2026: jedes dieser Wörter ist Türkisch in genau dieser Schreibung (im Vorlese-Lexikon).
    const GLEICH = new Set(["fil", "sis", "tren", "robot", "koala", "zebra", "web", "wifi"]);
    const andere = new Set([
      ...WORDS.map((w) => w.toLowerCase()), ...WORDS_EN, ...WORDS_FR_EXPEDITION, ...WORDS_ES_EXPEDITION, ...WORDS_IT_EXPEDITION,
    ]);
    const gemeinsam = LISTE.filter((w) => andere.has(w));
    expect(gemeinsam.filter((w) => !GLEICH.has(w))).toEqual([]);
    // Die Ausnahmen sind genau die Überschneidungen - eine veraltete Ausnahme fiele auf.
    expect([...GLEICH].filter((w) => !gemeinsam.includes(w))).toEqual([]);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „tr“ nur aus der türkischen Liste - an jeder Sprosse", () => {
  const tr_ = new Set(LISTE);

  it("tr-q: ab „e“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar", () => {
    setLayout("tr-q");
    const reihenfolge = introOrder("tr");
    const fehler: string[] = [];
    for (let n = reihenfolge.indexOf("e") + 1; n <= reihenfolge.length; n++) {
      const stand = reihenfolge.slice(0, n);
      const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
      for (const seed of [0, 5, 17]) {
        const woerter = stationGuessWords(stand, { lernweg: "tr", seed });
        if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
        for (const w of woerter) {
          if (!tr_.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
          if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
        }
      }
    }
    expect(fehler).toEqual([]);
  });

  it("tr-q: jede Sprosse mit neuem türkischen Rate-Buchstaben (e bis ö) bringt eigene Wörter", () => {
    setLayout("tr-q");
    const buchstaben = introOrder("tr").filter((u) => RATE_BUCHSTABE.test(u));
    const ohne: string[] = [];
    for (let i = buchstaben.indexOf("e"); i < buchstaben.indexOf("ö") + 1; i++) {
      const vorher = new Set(buchstaben.slice(0, i));
      const neu = buchstaben[i];
      if (!LISTE.some((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c)))) ohne.push(neu);
    }
    expect(ohne).toEqual([]);
  });

  it("Gegenprobe: ohne die Wörter mit ğ fände der Wächter die leere Sprosse", () => {
    const buchstaben = lernwegDef("tr").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    const ohneG = LISTE.filter((w) => !w.includes("ğ"));
    const i = buchstaben.indexOf("ğ");
    const vorher = new Set(buchstaben.slice(0, i));
    expect(ohneG.some((w) => w.includes("ğ") && [...w].every((c) => c === "ğ" || vorher.has(c)))).toBe(false);
    expect(LISTE.some((w) => w.includes("ğ") && [...w].every((c) => c === "ğ" || vorher.has(c)))).toBe(true);
  });

  it("Gegenprobe: Weg „de“ zieht weiter deutsch, Weg „it“ weiter italienisch", () => {
    const de = new Set(WORDS.map((w) => w.toLowerCase()));
    for (const w of stationGuessWords([...lernwegDef("de").letterOrder], { seed: 1 })) expect(de.has(w.toLowerCase())).toBe(true);
    for (const w of stationGuessWords([...lernwegDef("it").letterOrder], { lernweg: "it", seed: 1 })) expect(WORDS_IT_EXPEDITION).toContain(w);
  });

  it("nichts wird grossgeschrieben; die Stimme des gelösten Wortes ist Türkisch", () => {
    setLayout("tr-q");
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...lernwegDef("tr").introOrder], { lernweg: "tr", seed, shiftLearned: true })) expect(w).toBe(w.toLocaleLowerCase("tr"));
    expect(rateWortSprache("tr")).toBe("tr");
  });
});
