/**
 * ★★★ WÄCHTER: die Rate-Wörter der Polarstation auf Weg „pl" (PL-W, 09.10.2026). Modell:
 * `tests/tastenflow-expedition-it.test.ts`.
 *
 * Bis hierher zog Weg „pl" den ENGLISCHEN Vorrat (Rückfall seit G2a) - ein Kind auf dem polnischen Weg hätte englische
 * Wörter entschlüsselt, von der englischen Stimme vorgelesen. Geprüft wird die Liste selbst (Form, Hausregeln, Sperrliste)
 * und der Weg, auf dem die Station sie zieht (`stationGuessWords`), an JEDER Sprosse der polnischen Reihenfolge auf der
 * Pflicht-Tastatur `pl` (die neun polnischen Buchstaben sind je ein AltGr-Griff und eine eigene Einheit).
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  WORDS_EN,
  WORDS_ES_EXPEDITION,
  WORDS_FR_EXPEDITION,
  WORDS_IT_EXPEDITION,
  WORDS_PL_EXPEDITION,
  rateWortSprache,
  stationGuessWords,
} from "@/lib/typing/expedition/words";
import { WORDS } from "@/lib/typing/words";
import { WORDS_PL } from "@/lib/typing/wordsPl";
import { lernwegDef } from "@/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { gesperrtPl } from "@/lib/typing/sperrlistePl";
import { isRealWord } from "@/lib/typing/lexicon";

const LISTE = WORDS_PL_EXPEDITION;

/** Rate-Buchstaben: a-z und die neun polnischen Buchstaben (je ein AltGr-Anschlag). */
const RATE_BUCHSTABE = /^[a-ząćęłńóśźż]$/;
const FORM = /^[a-ząćęłńóśźż]{2,6}$/;

/**
 * Gewöhnliche polnische Wörter, die das Vorlese-Lexikon (Tatoeba-Sätze) nicht kennt. Ein macOS-Wörterbuch für Polnisch
 * gibt es hier nicht als Prüfer (es nimmt jedes Wort an, am 09.10.2026 mit "Qwerty" und "Asdfgh" gemessen) - diese Wörter
 * stehen aus Sprachwissen da und gehören in die Durchsicht durch eine Muttersprachlerin. Kommt ein Wort dazu, das keines
 * von beidem ist, wird der Wächter rot.
 */
const NUR_SPRACHWISSEN = new Set<string>([]);

afterEach(() => setLayout("de"));

describe("★ WORDS_PL_EXPEDITION: Form und Hausregeln", () => {
  it("rund 250 Wörter, jedes nur einmal", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(240);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
  });

  it("klein, 2 bis 6 Zeichen, nur Rate-Buchstaben (kein Apostroph, kein Grossbuchstabe, keine andere Sprache)", () => {
    expect(LISTE.filter((w) => !FORM.test(w))).toEqual([]);
  });

  it("keine Sperrwörter (Kern und Wortbasis)", () => {
    expect(LISTE.filter((w) => gesperrtPl(w))).toEqual([]);
  });

  it("Gegenprobe: ein Wortbasis-Wort, ein Kern-Stamm und ein Wort mit Apostroph oder Grossbuchstaben fallen auf", () => {
    expect(["diabeł", "kurwa", "kawa"].filter((w) => gesperrtPl(w))).toEqual(["diabeł", "kurwa"]);
    expect(["Braille'a", "Kawa", "ä", "niedźwiedź"].filter((w) => !FORM.test(w))).toEqual(["Braille'a", "Kawa", "ä", "niedźwiedź"]);
  });

  it("jedes Wort ist ein polnisches Wort: Vorlese-Lexikon oder (benannt) aus Sprachwissen", () => {
    expect(LISTE.filter((w) => !isRealWord(w, "pl") && !NUR_SPRACHWISSEN.has(w))).toEqual([]);
    // Die Ausnahmeliste trägt nur Wörter der Liste und nichts, was das Lexikon schon kennt (sonst veraltet sie still).
    expect([...NUR_SPRACHWISSEN].filter((w) => !LISTE.includes(w) || isRealWord(w, "pl"))).toEqual([]);
  });

  it("Bezug zur Szene und zum Land: Wetter, Ausrüstung, Tiere der Wälder und Meere, Dinge Polens", () => {
    for (const w of ["śnieg", "mróz", "wiatr", "mgła", "burza", "plecak", "kompas", "mapa", "sprzęt", "wilk", "łoś", "ryś", "bóbr",
      "żubr", "łabędź", "mors", "jeleń", "żagiel", "góra", "wieś", "chata", "szkoła", "chleb", "żurek", "pączek", "rzeźba"])
      expect(LISTE, w).toContain(w);
  });

  it("die meisten Wörter stammen aus dem polnischen Übungswortschatz oder dem Lexikon (WORDS_PL / isRealWord)", () => {
    const basis = new Set(WORDS_PL);
    const treffer = LISTE.filter((w) => basis.has(w) || isRealWord(w, "pl")).length;
    expect(treffer / LISTE.length).toBeGreaterThan(0.85);
  });

  it("keine Übernahme aus den anderen Listen - ausser Wörtern, die im Polnischen genauso heissen", () => {
    // Geprüft am 09.10.2026: jedes dieser Wörter ist Polnisch in genau dieser Schreibung.
    const GLEICH = new Set(["sad", "idea", "cena", "mapa", "igloo", "taxi", "mix", "box", "max"]);
    const andere = new Set([
      ...WORDS.map((w) => w.toLowerCase()),
      ...WORDS_EN,
      ...WORDS_FR_EXPEDITION,
      ...WORDS_ES_EXPEDITION,
      ...WORDS_IT_EXPEDITION,
    ]);
    const ueber = LISTE.filter((w) => andere.has(w));
    // Was sich überschneidet, steht auf der benannten Liste; die Überschneidung bleibt klein.
    expect(ueber.filter((w) => !GLEICH.has(w))).toEqual([]);
    expect(ueber.length).toBeLessThan(LISTE.length * 0.1);
    // Die Ausnahmen sind genau die Überschneidungen - eine veraltete Ausnahme fiele auf.
    expect([...GLEICH].filter((w) => LISTE.includes(w) && !andere.has(w))).toEqual([]);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „pl“ nur aus der polnischen Liste - an jeder Sprosse", () => {
  const pl_ = new Set(LISTE);

  it("ab „e“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar", () => {
    setLayout("pl");
    const reihenfolge = introOrder("pl");
    const fehler: string[] = [];
    for (let n = reihenfolge.indexOf("e") + 1; n <= reihenfolge.length; n++) {
      const stand = reihenfolge.slice(0, n);
      const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
      for (const seed of [0, 5, 17]) {
        const woerter = stationGuessWords(stand, { lernweg: "pl", seed });
        if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
        for (const w of woerter) {
          if (!pl_.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
          if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
        }
      }
    }
    expect(fehler).toEqual([]);
  });

  it("jede Sprosse mit neuem Rate-Buchstaben bringt eigene Wörter (sonst ist die Liste falsch geschnitten)", () => {
    setLayout("pl");
    const buchstaben = introOrder("pl").filter((u) => RATE_BUCHSTABE.test(u));
    const ohne: string[] = [];
    for (let i = buchstaben.indexOf("e"); i < buchstaben.length; i++) {
      const vorher = new Set(buchstaben.slice(0, i));
      const neu = buchstaben[i];
      if (!LISTE.some((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c)))) ohne.push(neu);
    }
    expect(ohne).toEqual([]);
  });

  it("jeder der neun polnischen Buchstaben hat Wörter, die erst mit ihm tippbar werden - ohne ihn wäre es eine leere Sprosse", () => {
    const buchstaben = lernwegDef("pl").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    for (const o of ["ę", "ł", "ż", "ą", "ś", "ć", "ó", "ń", "ź"]) {
      const i = buchstaben.indexOf(o);
      const vorher = new Set(buchstaben.slice(0, i));
      const eigene = LISTE.filter((w) => w.includes(o) && [...w].every((c) => c === o || vorher.has(c)));
      expect(eigene.length, o).toBeGreaterThanOrEqual(3);
    }
  });

  it("Gegenprobe: ohne die Wörter mit ź fände der Wächter die leere Sprosse", () => {
    const buchstaben = lernwegDef("pl").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    const ohneZ = LISTE.filter((w) => !w.includes("ź"));
    const i = buchstaben.indexOf("ź");
    const vorher = new Set(buchstaben.slice(0, i));
    expect(ohneZ.some((w) => w.includes("ź") && [...w].every((c) => c === "ź" || vorher.has(c)))).toBe(false);
    expect(LISTE.some((w) => w.includes("ź") && [...w].every((c) => c === "ź" || vorher.has(c)))).toBe(true);
  });

  it("Gegenprobe: Weg „de“ zieht weiter deutsch, Weg „es“ weiter spanisch, Weg „it“ weiter italienisch", () => {
    const de = new Set(WORDS.map((w) => w.toLowerCase()));
    for (const w of stationGuessWords([...lernwegDef("de").letterOrder], { seed: 1 })) expect(de.has(w.toLowerCase())).toBe(true);
    for (const w of stationGuessWords([...lernwegDef("es").letterOrder], { lernweg: "es", seed: 1 })) expect(WORDS_ES_EXPEDITION).toContain(w);
    for (const w of stationGuessWords([...lernwegDef("it").letterOrder], { lernweg: "it", seed: 1 })) expect(WORDS_IT_EXPEDITION).toContain(w);
  });

  it("nichts wird grossgeschrieben; die Stimme des gelösten Wortes ist Polnisch", () => {
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...lernwegDef("pl").introOrder], { lernweg: "pl", seed, shiftLearned: true })) expect(w).toBe(w.toLowerCase());
    expect(rateWortSprache("pl")).toBe("pl");
    // tr und cs zeigen weiter den englischen Rückfall (G2a) - nur pl ist umgestellt.
    // (tr hat seit TR-S einen eigenen Vorrat mit Stimme "tr")
    expect(rateWortSprache("tr")).toBe("tr");
    // (cs hat seit CS-W einen eigenen Vorrat mit Stimme "cs")
    expect(rateWortSprache("cs")).toBe("cs");
  });
});
