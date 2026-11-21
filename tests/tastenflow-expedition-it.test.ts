/**
 * ★★★ WÄCHTER: die Rate-Wörter der Polarstation auf Weg „it" (IT-S, 03.10.2026). Modell:
 * `tests/tastenflow-expedition-es.test.ts`.
 *
 * Bis hierher zog Weg „it" den ENGLISCHEN Vorrat (Rückfall seit G2a) - ein Kind auf dem italienischen Weg hätte
 * englische Wörter entschlüsselt, von der englischen Stimme vorgelesen. Geprüft wird die Liste selbst (Form,
 * Hausregeln, Sperrliste) und der Weg, auf dem die Station sie zieht (`stationGuessWords`), an JEDER Sprosse der
 * italienischen Reihenfolge und auf BEIDEN Pflicht-Tastaturen (`it`, `it-qzerty`).
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  WORDS_EN,
  WORDS_ES_EXPEDITION,
  WORDS_FR_EXPEDITION,
  WORDS_IT_EXPEDITION,
  rateWortSprache,
  stationGuessWords,
} from "@/lib/typing/expedition/words";
import { WORDS } from "@/lib/typing/words";
import { WORDS_IT, STUFE_VOCAB_IT } from "@/lib/typing/wordsIt";
import { lernwegDef } from "@/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { gesperrtIt } from "@/lib/typing/sperrlisteIt";
import { isRealWord } from "@/lib/typing/lexicon";

const LISTE = WORDS_IT_EXPEDITION;

/** Rate-Buchstaben: a-z und die fünf Akzentbuchstaben mit eigener Taste ohne Umschalt (é ist auf `it` Maiusc + è). */
const RATE_BUCHSTABE = /^[a-zàèìòù]$/;

/**
 * Am 03.10.2026 vom macOS-Wörterbuch (Italienisch) bestätigt, aber (noch) nicht im Vorlese-Lexikon des Weges -
 * die übrigen kennt `isRealWord(w, "it")`. Kommt ein Wort dazu, das keines von beidem ist, wird der Wächter rot.
 */
const NUR_WOERTERBUCH = new Set([
  "fiordo", "airone", "renna", "trota", "duna", "fune", "cometa", "olivo", "igloo", "bufera", "brina", "purè",
]);

afterEach(() => setLayout("de"));

describe("★ WORDS_IT_EXPEDITION: Form und Hausregeln", () => {
  it("rund 250 Wörter, jedes nur einmal", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(240);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
  });

  it("klein, 2 bis 6 Zeichen, nur Rate-Buchstaben (kein é, kein Apostroph, kein Grossbuchstabe)", () => {
    expect(LISTE.filter((w) => !/^[a-zàèìòù]{2,6}$/.test(w))).toEqual([]);
  });

  it("keine Sperrwörter (Kern und Wortbasis)", () => {
    expect(LISTE.filter((w) => gesperrtIt(w))).toEqual([]);
  });

  it("Gegenprobe: ein Wortbasis-Wort, ein Kern-Stamm und ein Wort mit é oder Apostroph fallen auf", () => {
    expect(["patata", "cazzotto", "casa"].filter((w) => gesperrtIt(w))).toEqual(["patata", "cazzotto"]);
    expect(["perché", "po'", "Casa", "gelato"].filter((w) => !/^[a-zàèìòù]{2,6}$/.test(w))).toEqual(["perché", "po'", "Casa"]);
  });

  it("jedes Wort ist ein italienisches Wort: Vorlese-Lexikon oder (benannt) vom Wörterbuch bestätigt", () => {
    expect(LISTE.filter((w) => !isRealWord(w, "it") && !NUR_WOERTERBUCH.has(w))).toEqual([]);
    // Die Ausnahmeliste trägt nur Wörter der Liste und nichts, was das Lexikon schon kennt (sonst veraltet sie still).
    expect([...NUR_WOERTERBUCH].filter((w) => !LISTE.includes(w) || isRealWord(w, "it"))).toEqual([]);
  });

  it("Bezug zur Szene und zum Land: Expedition, Tiere der Alpen und der Meere, Orte Italiens", () => {
    for (const w of ["neve", "slitta", "tenda", "bufera", "vetta", "igloo", "kayak", "nord", "sud", "est", "ovest", "orso",
      "lupo", "lince", "ghiro", "aquila", "foca", "orca", "squalo", "malga", "baita", "lido", "isola", "piazza", "olivo"])
      expect(LISTE, w).toContain(w);
  });

  it("die meisten Wörter stammen aus dem italienischen Übungswortschatz (WORDS_IT/STUFE_VOCAB_IT)", () => {
    const basis = new Set([...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat()]);
    expect(LISTE.filter((w) => basis.has(w)).length / LISTE.length).toBeGreaterThan(0.6);
  });

  it("keine Übernahme aus den anderen Listen - ausser Wörtern, die im Italienischen genauso heissen", () => {
    // Geprüft am 03.10.2026: jedes dieser Wörter ist Italienisch in genau dieser Schreibung (macOS-Wörterbuch).
    const GLEICH = new Set(["sale", "idea", "koala", "nido", "onda", "lana", "rana", "arena", "rosa", "sirena", "torre", "est",
      "casa", "cielo", "carta", "cena", "foca", "orca", "cesta", "cacao", "luna", "duna", "sud", "museo", "vela", "uva", "lago",
      "regalo", "igloo", "libro", "nube", "pizza", "zoo", "yoga", "kayak", "hobby", "kiwi", "web", "wifi", "taxi", "extra"]);
    const andere = new Set([...WORDS.map((w) => w.toLowerCase()), ...WORDS_EN, ...WORDS_FR_EXPEDITION, ...WORDS_ES_EXPEDITION]);
    expect(LISTE.filter((w) => andere.has(w) && !GLEICH.has(w))).toEqual([]);
    // Die Ausnahmen sind genau die Überschneidungen - eine veraltete Ausnahme fiele auf.
    expect([...GLEICH].filter((w) => !LISTE.includes(w) || !andere.has(w))).toEqual([]);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „it“ nur aus der italienischen Liste - an jeder Sprosse", () => {
  const it_ = new Set(LISTE);
  for (const tastatur of ["it", "it-qzerty"] as const) {
    it(`${tastatur}: ab „e“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("it");
      const fehler: string[] = [];
      for (let n = reihenfolge.indexOf("e") + 1; n <= reihenfolge.length; n++) {
        const stand = reihenfolge.slice(0, n);
        const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
        for (const seed of [0, 5, 17]) {
          const woerter = stationGuessWords(stand, { lernweg: "it", seed });
          if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
          for (const w of woerter) {
            if (!it_.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
            if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
          }
        }
      }
      expect(fehler).toEqual([]);
    });

    it(`${tastatur}: jede Sprosse mit neuem Rate-Buchstaben bringt eigene Wörter (sonst ist die Liste falsch geschnitten)`, () => {
      setLayout(tastatur);
      const buchstaben = introOrder("it").filter((u) => RATE_BUCHSTABE.test(u));
      const ohne: string[] = [];
      for (let i = buchstaben.indexOf("e"); i < buchstaben.length; i++) {
        const vorher = new Set(buchstaben.slice(0, i));
        const neu = buchstaben[i];
        if (!LISTE.some((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c)))) ohne.push(neu);
      }
      expect(ohne).toEqual([]);
    });
  }

  it("Gegenprobe: ohne die Wörter mit q fände der Wächter die leere Sprosse", () => {
    const buchstaben = lernwegDef("it").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    const ohneQ = LISTE.filter((w) => !w.includes("q"));
    const i = buchstaben.indexOf("q");
    const vorher = new Set(buchstaben.slice(0, i));
    expect(ohneQ.some((w) => w.includes("q") && [...w].every((c) => c === "q" || vorher.has(c)))).toBe(false);
    expect(LISTE.some((w) => w.includes("q") && [...w].every((c) => c === "q" || vorher.has(c)))).toBe(true);
  });

  it("Gegenprobe: Weg „de“ zieht weiter deutsch, Weg „es“ weiter spanisch", () => {
    const de = new Set(WORDS.map((w) => w.toLowerCase()));
    for (const w of stationGuessWords([...lernwegDef("de").letterOrder], { seed: 1 })) expect(de.has(w.toLowerCase())).toBe(true);
    for (const w of stationGuessWords([...lernwegDef("es").letterOrder], { lernweg: "es", seed: 1 })) expect(WORDS_ES_EXPEDITION).toContain(w);
  });

  it("nichts wird grossgeschrieben; die Stimme des gelösten Wortes ist Italienisch", () => {
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...lernwegDef("it").introOrder], { lernweg: "it", seed, shiftLearned: true })) expect(w).toBe(w.toLowerCase());
    expect(rateWortSprache("it")).toBe("it");
  });
});
