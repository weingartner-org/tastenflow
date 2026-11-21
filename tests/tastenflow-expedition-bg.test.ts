/**
 * ★★★ WÄCHTER O-INHALT-BG (29.10.2026): die Rate-Wörter der Polarstation auf Weg „bg" (`expedition/wordsBg.ts`).
 * Vorbild: `tests/tastenflow-expedition-cs.test.ts`.
 *
 * Bis hierher zog Weg „bg" den ENGLISCHEN Vorrat (Rückfall seit G2-NEUN) - ein Kind auf dem bulgarischen Weg hätte englische Wörter
 * entschlüsselt, die es auf seiner kyrillischen Tastatur gar nicht tippen kann. Geprüft wird die Liste selbst (Form, Hausregeln,
 * Sperrliste) und der Weg, auf dem die Station sie zieht (`stationGuessWords`), an JEDER Sprosse der bulgarischen Reihenfolge und auf
 * beiden Pflicht-Tastaturen (`bg` BDS, `bg-schreibm`).
 */
import { afterEach, describe, expect, it } from "vitest";
import { WORDS_EN, rateWortSprache, stationGuessWords } from "@/lib/typing/expedition/words";
import { WORDS_BG_EXPEDITION } from "@/lib/typing/expedition/wordsBg";
import { WORDS_BG, STUFE_VOCAB_BG } from "@/lib/typing/wordsBg";
import { lernwegDef } from "@/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { gesperrtBg } from "@/lib/typing/sperrlisteBg";

const LISTE = WORDS_BG_EXPEDITION;

/** Rate-Buchstaben: kyrillisch klein mit eigener Taste ohne Umschalt auf BDS UND Schreibmaschine (kein ѝ, kein ы э). */
const RATE_BUCHSTABE = /^[а-щъьюя]$/;
const FORM = /^[а-щъьюя]{2,6}$/;

/**
 * Eigenwissen [G]: alltägliche bulgarische Wörter, die der Übungswortschatz des Weges (noch) nicht trägt - meist die Szene der
 * Expedition und Tiere. Das Vorlese-Lexikon kennt „bg" noch nicht (F8). Die Lese-Abnahme durch eine Person mit Bulgarisch als
 * Erstsprache gehört hierher. Kommt ein Wort dazu, das weder im Wortschatz noch hier steht, wird der Wächter rot.
 */
const EIGENWISSEN = new Set<string>([
  "лед", "елен", "орел", "зима", "бобър", "мъгла", "морж", "шал", "хляб", "бухал", "кит", "ски", "мраз", "сова", "компас",
  "сияние", "иглу", "мост", "лист", "огън", "пътека", "зебра", "ракета", "робот", "балон", "банан", "тигър", "слон", "лъв",
  "мед", "зъб", "плод", "рог", "гълъб", "имане",
]);

afterEach(() => setLayout("de"));

describe("★ WORDS_BG_EXPEDITION: Form und Hausregeln", () => {
  it("rund 250 Wörter, jedes nur einmal", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(240);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
  });

  it("klein, 2 bis 6 Zeichen, nur Rate-Buchstaben (kein ѝ, kein lateinischer Doppelgänger, kein Grossbuchstabe)", () => {
    expect(LISTE.filter((w) => !FORM.test(w))).toEqual([]);
  });

  it("keine zwei Wörter mit denselben Buchstaben (sonst hätte die Station zwei Lösungen)", () => {
    const gesehen = new Map<string, string>();
    const doppelt: string[] = [];
    for (const w of LISTE) {
      const k = [...w].sort().join("");
      if (gesehen.has(k)) doppelt.push(`${gesehen.get(k)}/${w}`);
      gesehen.set(k, w);
    }
    expect(doppelt).toEqual([]);
  });

  it("keine Sperrwörter (Kern und Wortbasis)", () => {
    expect(LISTE.filter((w) => gesperrtBg(w))).toEqual([]);
  });

  it("kein Tier, das als Schimpfwort gegen ein Kind dient, und kein Wort über Tod, Waffen, Rausch, Glaube", () => {
    const heikel = ["крава", "магаре", "прасе", "свиня", "коза", "маймуна", "гъска", "пуйка", "кокошка", "пушка",
      "оръжие", "смърт", "мина", "вино", "бира", "ракия", "църква", "бог", "кръв", "война", "войник", "череп"];
    expect(LISTE.filter((w) => heikel.includes(w))).toEqual([]);
  });

  it("Gegenprobe: ѝ, Grossbuchstabe, lateinisches a und Strich fallen auf", () => {
    expect(["сѝн", "Сняг", "снaг", "ски-лифт", "сняг"].filter((w) => !FORM.test(w))).toEqual(["сѝн", "Сняг", "снaг", "ски-лифт"]);
  });

  it("jedes Wort ist ein bulgarisches Wort: Übungswortschatz des Weges oder (benannt) Eigenwissen", () => {
    const basis = new Set([...WORDS_BG, ...Object.values(STUFE_VOCAB_BG).flat()].map((w) => w.toLowerCase()));
    expect(LISTE.filter((w) => !basis.has(w) && !EIGENWISSEN.has(w))).toEqual([]);
    // Die Ausnahmeliste trägt nur Wörter der Liste und nichts, was der Wortschatz schon kennt (sonst veraltet sie still).
    expect([...EIGENWISSEN].filter((w) => !LISTE.includes(w) || basis.has(w))).toEqual([]);
    // Mindestens zwei Drittel stammen aus dem Übungswortschatz.
    expect(LISTE.filter((w) => basis.has(w)).length / LISTE.length).toBeGreaterThan(0.66);
  });

  it("Bezug zur Szene und zum Land: Expedition, Eis, Tiere der Berge und Wälder", () => {
    for (const w of ["сняг", "лед", "морж", "тюлен", "иглу", "компас", "сияние", "мъгла", "мраз", "звезда", "вятър", "буря", "ехо",
      "пещера", "лисица", "мечка", "вълк", "елен", "орел", "щъркел", "гора", "връх", "езеро", "река", "хляб", "сирене", "баница"])
      expect(LISTE, w).toContain(w);
  });

  it("nichts aus dem englischen Vorrat (der alte Rückfall)", () => {
    expect(LISTE.filter((w) => WORDS_EN.includes(w))).toEqual([]);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „bg“ nur aus der bulgarischen Liste - an jeder Sprosse", () => {
  const bg = new Set(LISTE);
  for (const tastatur of ["bg", "bg-schreibm"] as const) {
    it(`${tastatur}: ab „е“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("bg");
      const fehler: string[] = [];
      for (let n = reihenfolge.indexOf("е") + 1; n <= reihenfolge.length; n++) {
        const stand = reihenfolge.slice(0, n);
        const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
        for (const seed of [0, 5, 17]) {
          const woerter = stationGuessWords(stand, { lernweg: "bg", seed });
          if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
          for (const w of woerter) {
            if (!bg.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
            if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
          }
        }
      }
      expect(fehler).toEqual([]);
    });
  }

  it("jede Sprosse ab „е“ hat mindestens drei Wörter, die genau mit ihr neu dazukommen", () => {
    const buchstaben = lernwegDef("bg").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    const duenn: string[] = [];
    for (let i = buchstaben.indexOf("е"); i < buchstaben.length; i++) {
      const vorher = new Set(buchstaben.slice(0, i));
      const neu = buchstaben[i];
      const anzahl = LISTE.filter((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c))).length;
      if (anzahl < 3) duenn.push(`${neu}: ${anzahl}`);
    }
    expect(duenn).toEqual([]);
  });

  it("Gegenprobe: ohne die Wörter mit ь fände der Wächter die leere Sprosse", () => {
    const buchstaben = lernwegDef("bg").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    const i = buchstaben.indexOf("ь");
    const vorher = new Set(buchstaben.slice(0, i));
    const ohne = LISTE.filter((w) => !w.includes("ь"));
    expect(ohne.some((w) => w.includes("ь") && [...w].every((c) => c === "ь" || vorher.has(c)))).toBe(false);
    expect(LISTE.some((w) => w.includes("ь") && [...w].every((c) => c === "ь" || vorher.has(c)))).toBe(true);
  });

  it("nichts wird grossgeschrieben; die Stimme des gelösten Wortes ist Bulgarisch", () => {
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...lernwegDef("bg").introOrder], { lernweg: "bg", seed, shiftLearned: true })) expect(w).toBe(w.toLowerCase());
    expect(rateWortSprache("bg")).toBe("bg");
  });
});
