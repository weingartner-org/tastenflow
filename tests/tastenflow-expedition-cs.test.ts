/**
 * ★★★ WÄCHTER: die Rate-Wörter der Polarstation auf Weg „cs" (CS-W, 09.10.2026). Modell:
 * `tests/tastenflow-expedition-it.test.ts`.
 *
 * Bis hierher zog Weg „cs" den ENGLISCHEN Vorrat (Rückfall seit G2a) - ein Kind auf dem tschechischen Weg hätte englische
 * Wörter entschlüsselt, von der englischen Stimme vorgelesen. Geprüft wird die Liste selbst (Form, Hausregeln, Sperrliste)
 * und der Weg, auf dem die Station sie zieht (`stationGuessWords`), an JEDER Sprosse der tschechischen Reihenfolge und auf
 * BEIDEN Pflicht-Tastaturen (`cs` QWERTZ, `cs-qwerty`).
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  WORDS_CS_EXPEDITION,
  WORDS_EN,
  WORDS_ES_EXPEDITION,
  WORDS_FR_EXPEDITION,
  WORDS_IT_EXPEDITION,
  rateWortSprache,
  stationGuessWords,
} from "@/lib/typing/expedition/words";
import { WORDS } from "@/lib/typing/words";
import { WORDS_CS, STUFE_VOCAB_CS } from "@/lib/typing/wordsCs";
import { lernwegDef } from "@/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { gesperrtCs } from "@/lib/typing/sperrlisteCs";
import { isRealWord } from "@/lib/typing/lexicon";

const LISTE = WORDS_CS_EXPEDITION;

/** Rate-Buchstaben: a-z und die elf Buchstaben mit eigener Taste ohne Umschalt (`ď ť ň ó` brauchen die Totaste). */
const RATE_BUCHSTABE = /^[a-záčéěíšřůúýž]$/;
const FORM = /^[a-záčéěíšřůúýž]{2,6}$/;

/**
 * Eigenwissen [G]: alltägliche tschechische Wörter, die das Vorlese-Lexikon des Weges (noch) nicht kennt - das macOS-Wörterbuch
 * nimmt für Tschechisch jedes Wort an (Falle 61), ein Beleg daran gibt es nicht. Die Lese-Abnahme durch eine Person mit
 * Tschechisch als Erstsprache (P7) gehört hierher. Kommt ein Wort dazu, das weder im Lexikon steht noch hier, wird der Wächter rot.
 */
const EIGENWISSEN = new Set<string>([]);

afterEach(() => setLayout("de"));

describe("★ WORDS_CS_EXPEDITION: Form und Hausregeln", () => {
  it("rund 250 Wörter, jedes nur einmal", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(240);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
  });

  it("klein, 2 bis 6 Zeichen, nur Rate-Buchstaben (kein ď ť ň ó, kein Grossbuchstabe, kein Strich)", () => {
    expect(LISTE.filter((w) => !FORM.test(w))).toEqual([]);
  });

  it("keine Sperrwörter (Kern und Wortbasis)", () => {
    expect(LISTE.filter((w) => gesperrtCs(w))).toEqual([]);
  });

  it("kein Tier, das als Schimpfwort gegen ein Kind dient, und kein Wort über Tod, Waffen, Rausch, Glaube", () => {
    const heikel = ["kráva", "vůl", "osel", "opice", "prase", "svině", "kozel", "slepice", "husa", "hroch", "kůň", "pavián",
      "zbraň", "pistole", "smrt", "mrtvý", "zabít", "víno", "pivo", "bůh", "kostel", "lebka", "krev", "válka", "voják"];
    expect(LISTE.filter((w) => heikel.includes(w))).toEqual([]);
  });

  it("Gegenprobe: Sperrwort, ď, ó, Grossbuchstabe und Strich fallen auf", () => {
    expect(["kurva", "hloupý", "dům"].filter((w) => gesperrtCs(w))).toEqual(["kurva", "hloupý"]);
    expect(["teď", "bóje", "Les", "ice-cream", "sníh"].filter((w) => !FORM.test(w))).toEqual(["teď", "bóje", "Les", "ice-cream"]);
  });

  it("jedes Wort ist ein tschechisches Wort: Vorlese-Lexikon oder (benannt) Eigenwissen", () => {
    expect(LISTE.filter((w) => !isRealWord(w, "cs") && !EIGENWISSEN.has(w))).toEqual([]);
    // Die Ausnahmeliste trägt nur Wörter der Liste und nichts, was das Lexikon schon kennt (sonst veraltet sie still).
    expect([...EIGENWISSEN].filter((w) => !LISTE.includes(w) || isRealWord(w, "cs"))).toEqual([]);
  });

  it("Bezug zur Szene und zum Land: Expedition, Tiere der Gebirge und des Eises, Orte Tschechiens", () => {
    for (const w of ["sníh", "led", "kra", "sob", "mrož", "stan", "bunda", "šála", "čepice", "lyže", "vítr", "mráz", "mlha", "hvězda",
      "ozvěna", "úplněk", "počasí", "iglú", "magnet", "globus", "šifra", "vlk", "los", "orel", "liška", "ježek", "hrad", "zámek",
      "rybník", "údolí", "hřiště", "škola", "pošta", "kámen", "mouka", "mléko", "chléb", "sýr", "hřbet", "sopka"])
      expect(LISTE, w).toContain(w);
  });

  it("die meisten Wörter stammen nicht aus dem fremden Vorrat: mindestens ein Drittel steht im tschechischen Übungswortschatz (WORDS_CS/STUFE_VOCAB_CS)", () => {
    const basis = new Set([...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat()]);
    expect(LISTE.filter((w) => basis.has(w)).length / LISTE.length).toBeGreaterThan(0.3);
  });

  it("keine Übernahme aus den anderen Listen - ausser Wörtern, die im Tschechischen genauso heissen", () => {
    // Geprüft am 09.10.2026: jedes dieser Wörter ist Tschechisch in genau dieser Schreibung (les, los, cesta … sind Alltagswörter).
    const GLEICH = new Set(["les", "film", "disk", "los", "domino", "sud", "cesta", "zebra", "taxi", "text", "mix", "relax", "extra",
      "expert", "web", "wifi", "kiwi"]);
    const andere = new Set([...WORDS.map((w) => w.toLowerCase()), ...WORDS_EN, ...WORDS_FR_EXPEDITION, ...WORDS_ES_EXPEDITION,
      ...WORDS_IT_EXPEDITION]);
    expect(LISTE.filter((w) => andere.has(w) && !GLEICH.has(w))).toEqual([]);
    // Die Ausnahmen sind genau die Überschneidungen - eine veraltete Ausnahme fiele auf.
    expect([...GLEICH].filter((w) => !LISTE.includes(w) || !andere.has(w))).toEqual([]);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „cs“ nur aus der tschechischen Liste - an jeder Sprosse", () => {
  const cs = new Set(LISTE);
  for (const tastatur of ["cs", "cs-qwerty"] as const) {
    it(`${tastatur}: ab „e“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("cs");
      const fehler: string[] = [];
      for (let n = reihenfolge.indexOf("e") + 1; n <= reihenfolge.length; n++) {
        const stand = reihenfolge.slice(0, n);
        const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
        for (const seed of [0, 5, 17]) {
          const woerter = stationGuessWords(stand, { lernweg: "cs", seed });
          if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
          for (const w of woerter) {
            if (!cs.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
            if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
          }
        }
      }
      expect(fehler).toEqual([]);
    });

    it(`${tastatur}: jede Sprosse mit neuem Rate-Buchstaben bringt eigene Wörter (sonst ist die Liste falsch geschnitten)`, () => {
      setLayout(tastatur);
      const buchstaben = introOrder("cs").filter((u) => RATE_BUCHSTABE.test(u));
      const ohne: string[] = [];
      for (let i = buchstaben.indexOf("e"); i < buchstaben.length; i++) {
        const vorher = new Set(buchstaben.slice(0, i));
        const neu = buchstaben[i];
        if (!LISTE.some((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c)))) ohne.push(neu);
      }
      expect(ohne).toEqual([]);
    });

    it(`${tastatur}: jede dieser Sprossen hat mindestens drei Wörter, die genau mit ihr neu dazukommen (ausser den letzten vier)`, () => {
      setLayout(tastatur);
      const buchstaben = introOrder("cs").filter((u) => RATE_BUCHSTABE.test(u));
      const duenn: string[] = [];
      for (let i = buchstaben.indexOf("e"); i < buchstaben.length; i++) {
        const vorher = new Set(buchstaben.slice(0, i));
        const neu = buchstaben[i];
        const anzahl = LISTE.filter((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c))).length;
        if (anzahl < 3) duenn.push(`${neu}: ${anzahl}`);
      }
      // `q` hat zwei Wörter (squash, quad) - die einzigen tschechischen Alltagswörter, die ein `q` tragen; sonst überall mindestens drei.
      expect(duenn).toEqual(["q: 2"]);
    });
  }

  it("Gegenprobe: ohne die Wörter mit q fände der Wächter die leere Sprosse", () => {
    const buchstaben = lernwegDef("cs").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    const ohneQ = LISTE.filter((w) => !w.includes("q"));
    const i = buchstaben.indexOf("q");
    const vorher = new Set(buchstaben.slice(0, i));
    expect(ohneQ.some((w) => w.includes("q") && [...w].every((c) => c === "q" || vorher.has(c)))).toBe(false);
    expect(LISTE.some((w) => w.includes("q") && [...w].every((c) => c === "q" || vorher.has(c)))).toBe(true);
  });

  it("Gegenprobe: Weg „de“ zieht weiter deutsch, Weg „es“ weiter spanisch, Weg „it“ weiter italienisch", () => {
    const de = new Set(WORDS.map((w) => w.toLowerCase()));
    for (const w of stationGuessWords([...lernwegDef("de").letterOrder], { seed: 1 })) expect(de.has(w.toLowerCase())).toBe(true);
    for (const w of stationGuessWords([...lernwegDef("es").letterOrder], { lernweg: "es", seed: 1 })) expect(WORDS_ES_EXPEDITION).toContain(w);
    for (const w of stationGuessWords([...lernwegDef("it").letterOrder], { lernweg: "it", seed: 1 })) expect(WORDS_IT_EXPEDITION).toContain(w);
  });

  it("nichts wird grossgeschrieben; die Stimme des gelösten Wortes ist Tschechisch", () => {
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...lernwegDef("cs").introOrder], { lernweg: "cs", seed, shiftLearned: true })) expect(w).toBe(w.toLowerCase());
    expect(rateWortSprache("cs")).toBe("cs");
  });
});
