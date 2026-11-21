/**
 * ★★★ WÄCHTER O-INHALT-UK (29.10.2026): die Rate-Wörter der Polarstation auf Weg „uk" (`expedition/wordsUk.ts`).
 * Vorbild: `tests/tastenflow-expedition-cs.test.ts`.
 *
 * Bis hierher zog Weg „uk" den ENGLISCHEN Vorrat (Rückfall seit G2-NEUN) - ein Kind auf dem ukrainischen Weg hätte englische Wörter
 * entschlüsselt, die es auf seiner kyrillischen Tastatur gar nicht tippen kann. Geprüft wird die Liste selbst (Form, Hausregeln,
 * Sperrliste) und der Weg, auf dem die Station sie zieht (`stationGuessWords`), an JEDER Sprosse der ukrainischen Reihenfolge und auf
 * beiden Pflicht-Tastaturen (`ua` erweitert, `ua-std` ohne Apostroph).
 */
import { afterEach, describe, expect, it } from "vitest";
import { WORDS_EN, rateWortSprache, stationGuessWords } from "@/lib/typing/expedition/words";
import { WORDS_UK_EXPEDITION } from "@/lib/typing/expedition/wordsUk";
import { WORDS_UK, STUFE_VOCAB_UK } from "@/lib/typing/wordsUk";
import { lernwegDef } from "@/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { gesperrtUk } from "@/lib/typing/sperrlisteUk";

const LISTE = WORDS_UK_EXPEDITION;

/** Rate-Buchstaben: ukrainisch klein mit eigener Taste ohne Umschalt auf beiden Tastaturen (kein ы э ё ъ, kein Apostroph). */
const RATE_BUCHSTABE = /^[а-щьюяєіїґ]$/;
const FORM = /^[а-щьюяєіїґ]{2,6}$/;

/** Eigenwissen [G]: heute leer - jedes Wort steht im Übungswortschatz des Weges. Kommt eines dazu, das dort fehlt, wird der Wächter rot. */
const EIGENWISSEN = new Set<string>([]);

afterEach(() => setLayout("de"));

describe("★ WORDS_UK_EXPEDITION: Form und Hausregeln", () => {
  it("rund 300 Wörter, jedes nur einmal", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(240);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
  });

  it("klein, 2 bis 6 Zeichen, nur Rate-Buchstaben (kein Apostroph, kein russischer Buchstabe, kein lateinischer Doppelgänger)", () => {
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
    expect(LISTE.filter((w) => gesperrtUk(w))).toEqual([]);
  });

  it("kein Tier, das als Schimpfwort gegen ein Kind dient, und kein Kriegs- oder Waffenwort (Glossar §2.4), nichts über Tod, Rausch, Glaube", () => {
    const heikel = ["корова", "коза", "свиня", "мавпа", "курка", "ворона", "гуска", "осел", "ракета", "танк", "постріл", "снайпер",
      "штурм", "зброя", "солдат", "бій", "вибух", "війна", "смерть", "кров", "вино", "пиво", "горілка", "церква", "бог", "череп"];
    expect(LISTE.filter((w) => heikel.includes(w))).toEqual([]);
  });

  it("Gegenprobe: Apostroph, russisches ы, Grossbuchstabe, lateinisches a und Strich fallen auf", () => {
    expect(["м'яч", "мыло", "Сніг", "снiг", "ски-лифт", "сніг"].filter((w) => !FORM.test(w))).toEqual(["м'яч", "мыло", "Сніг", "снiг", "ски-лифт"]);
  });

  it("jedes Wort ist ein ukrainisches Wort: Übungswortschatz des Weges oder (benannt) Eigenwissen", () => {
    const basis = new Set([...WORDS_UK, ...Object.values(STUFE_VOCAB_UK).flat()].map((w) => w.toLowerCase()));
    expect(LISTE.filter((w) => !basis.has(w) && !EIGENWISSEN.has(w))).toEqual([]);
    // Die Ausnahmeliste trägt nur Wörter der Liste und nichts, was der Wortschatz schon kennt (sonst veraltet sie still).
    expect([...EIGENWISSEN].filter((w) => !LISTE.includes(w) || basis.has(w))).toEqual([]);
    // Mindestens zwei Drittel stammen aus dem Übungswortschatz.
    expect(LISTE.filter((w) => basis.has(w)).length / LISTE.length).toBeGreaterThan(0.66);
  });

  it("Bezug zur Szene und zum Land: Winter, Tiere, Landschaft, Küche", () => {
    for (const w of ["сніг", "мороз", "туман", "хмара", "зима", "тюлень", "лисиця", "олень", "бобер", "орел", "гніздо", "острів",
      "озеро", "гора", "ліс", "хліб", "борщ", "кавун"])
      expect(LISTE, w).toContain(w);
  });

  it("nichts aus dem englischen Vorrat (der alte Rückfall)", () => {
    expect(LISTE.filter((w) => WORDS_EN.includes(w))).toEqual([]);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „uk“ nur aus der ukrainischen Liste - an jeder Sprosse", () => {
  const uk = new Set(LISTE);
  for (const tastatur of ["ua", "ua-std"] as const) {
    it(`${tastatur}: ab „е“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("uk");
      const fehler: string[] = [];
      for (let n = reihenfolge.indexOf("е") + 1; n <= reihenfolge.length; n++) {
        const stand = reihenfolge.slice(0, n);
        const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
        for (const seed of [0, 5, 17]) {
          const woerter = stationGuessWords(stand, { lernweg: "uk", seed });
          if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
          for (const w of woerter) {
            if (!uk.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
            if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
          }
        }
      }
      expect(fehler).toEqual([]);
    });
  }

  it("jede Sprosse ab „е“ hat mindestens drei Wörter, die genau mit ihr neu dazukommen", () => {
    const buchstaben = lernwegDef("uk").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    const duenn: string[] = [];
    for (let i = buchstaben.indexOf("е"); i < buchstaben.length; i++) {
      const vorher = new Set(buchstaben.slice(0, i));
      const neu = buchstaben[i];
      const anzahl = LISTE.filter((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c))).length;
      if (anzahl < 3) duenn.push(`${neu}: ${anzahl}`);
    }
    expect(duenn).toEqual([]);
  });

  it("Gegenprobe: ohne die Wörter mit ґ fände der Wächter die leere Sprosse", () => {
    const buchstaben = lernwegDef("uk").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    const i = buchstaben.indexOf("ґ");
    const vorher = new Set(buchstaben.slice(0, i));
    const ohne = LISTE.filter((w) => !w.includes("ґ"));
    expect(ohne.some((w) => w.includes("ґ") && [...w].every((c) => c === "ґ" || vorher.has(c)))).toBe(false);
    expect(LISTE.some((w) => w.includes("ґ") && [...w].every((c) => c === "ґ" || vorher.has(c)))).toBe(true);
  });

  it("nichts wird grossgeschrieben; die Stimme des gelösten Wortes ist Ukrainisch", () => {
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...lernwegDef("uk").introOrder], { lernweg: "uk", seed, shiftLearned: true })) expect(w).toBe(w.toLowerCase());
    expect(rateWortSprache("uk")).toBe("uk");
  });
});
