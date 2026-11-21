import { describe, it, expect } from "vitest";
import {
  INTRO_ORDER,
  LETTER_ORDER,
  SHIFT_UNIT,
  type InhaltsStufe,
  adaptiveItems,
  adaptiveRound,
  corpusItemsFor,
  fitsKeys,
  wordDrillLines,
} from "../src/lib/typing";
import { CORPUS_EN, fitText } from "../src/lib/typing/corpus";
import { WORDS_EN, STUFE_VOCAB_EN, HAND_CORPUS_EN } from "../src/lib/typing/corpusEn";

const STUFEN_ALL: InhaltsStufe[] = ["kids", "teens", "erwachsen"];

describe("Englischer Korpus — Integrität", () => {
  it("hat reichlich Inhalte in allen Stufen", () => {
    expect(HAND_CORPUS_EN.length).toBeGreaterThan(300);
    for (const s of STUFEN_ALL)
      expect(HAND_CORPUS_EN.filter((it) => it.stufen.includes(s)).length).toBeGreaterThan(20);
    expect(WORDS_EN.length).toBeGreaterThan(150);
    for (const s of STUFEN_ALL) expect((STUFE_VOCAB_EN[s] ?? []).length).toBeGreaterThan(30);
  });

  it("Wörter sind klein und nur Buchstaben", () => {
    for (const w of [...WORDS_EN, ...Object.values(STUFE_VOCAB_EN).flat()]) {
      expect(w).toBe(w.toLowerCase());
      expect(/^[a-z]+$/.test(w), `„${w}" enthält Nicht-Buchstaben`).toBe(true);
    }
  });

  it("Korpus-Texte nutzen nur tippbare Zeichen", () => {
    // erlaubte Zeichen = alle freigeschalteten Einheiten (klein) + Leerzeichen
    const allowed = new Set(INTRO_ORDER.map((c) => c.toLowerCase()));
    for (const it of CORPUS_EN) {
      for (const ch of it.text) {
        if (ch === " ") continue;
        const lower = ch.toLowerCase();
        expect(allowed.has(lower), `„${ch}" in „${it.text}" nicht tippbar`).toBe(true);
      }
      // Englische Großschreibung: erstes Zeichen Großbuchstabe oder Ziffer.
      const first = it.text[0];
      expect(first === first.toUpperCase()).toBe(true);
    }
  });
});

describe("Englisch in „Mein Training“", () => {
  it("nutzt NIE eine ungelernte Taste (alle Stufen)", () => {
    const introduced = INTRO_ORDER;
    const hasShift = introduced.includes(SHIFT_UNIT);
    const allowed = new Set(introduced.map((c) => c.toLowerCase()));
    for (const stufe of STUFEN_ALL) {
      const lines = adaptiveItems({ lernweg: "de", introduced, focus: [], stufe, lang: "en", count: 60 });
      for (const line of lines) {
        for (const ch of line) {
          if (ch === " ") continue;
          const lower = ch.toLowerCase();
          if (ch !== lower) expect(hasShift).toBe(true);
          expect(allowed.has(lower), `„${ch}" in „${line}" nicht freigeschaltet`).toBe(true);
        }
      }
    }
  });

  it("blendet echte englische Korpus-Texte ein", () => {
    const introduced = INTRO_ORDER;
    let sawCorpus = false;
    for (let r = 0; r < 6 && !sawCorpus; r++) {
      const lines = adaptiveItems({ lernweg: "de", introduced, focus: [], stufe: "teens", lang: "en", count: 40 });
      if (lines.some((l) => l.length > 35)) sawCorpus = true;
    }
    expect(sawCorpus).toBe(true);
  });
});

describe("Englische Groß-/Kleinschreibung der Wort-Drills", () => {
  it("ohne Umschalttaste bleibt alles klein", () => {
    for (const line of wordDrillLines(LETTER_ORDER, false, "b", [], 20, false, "en")) {
      expect(line).toBe(line.toLowerCase());
    }
  });

  it("mit Umschalttaste nur der Satzanfang groß (keine Nomen-Großschreibung)", () => {
    for (const line of wordDrillLines(LETTER_ORDER, true, "b", [], 20, false, "en")) {
      // genau das erste Zeichen groß, der Rest klein (englische Regel)
      expect(line).toBe(line[0].toUpperCase() + line.slice(1).toLowerCase());
    }
  });
});

describe("corpusItemsFor wählt nach Sprache", () => {
  it("liefert für Englisch andere Inhalte als für Deutsch", () => {
    const allowed = new Set(INTRO_ORDER.map((c) => c.toLowerCase()));
    const en = corpusItemsFor({ lernweg: "de", stufe: "teens", allowed, lang: "en" });
    const de = corpusItemsFor({ lernweg: "de", stufe: "teens", allowed, lang: "de" });
    expect(en.length).toBeGreaterThan(0);
    expect(de.length).toBeGreaterThan(0);
    // kein nennenswerter Überlapp (verschiedene Sprachen)
    const deSet = new Set(de);
    const overlap = en.filter((t) => deSet.has(t)).length;
    expect(overlap).toBe(0);
  });
});

describe("Zeichen-Drill im Englisch-Modus (Prüfbericht 27.07., Teil 0 Punkt 5)", () => {
  // Reproduktion des Befunds „brown, camera und king": Komma-Fokus bei allen
  // Buchstaben + Punkt/Komma — vorher standen deutsche Füllwörter („und",
  // „oder", „erst … dann") fest verdrahtet in den Drill-Vorlagen.
  const introduced = [..."abcdefghijklmnopqrstuvwxyz", ".", ","];
  const rounds = () =>
    adaptiveRound({ lernweg: "de", introduced, focus: [","], stufe: "teens", lang: "en", count: 12 });

  it("keine deutschen Füllwörter in 40 Komma-Fokus-Runden", () => {
    const verboten = new Set(["und", "oder", "erst", "dann", "uhr"]);
    for (let r = 0; r < 40; r++) {
      for (const l of rounds()) {
        for (const token of l.text.toLowerCase().split(/[^a-zäöüß]+/)) {
          expect(verboten.has(token), `deutsches Füllwort in „${l.text}"`).toBe(false);
        }
      }
    }
  });

  it("Komma-Drills nutzen die englischen Muster (and/or/first–then)", () => {
    // Jede Komma-Drill-Vorlage enthält ein Füllwort — im EN-Modus also immer
    // „and"/„or"/„first … then". Drill-Zeilen sind die generierten (source null).
    let sawDrill = false;
    for (let r = 0; r < 40; r++) {
      for (const l of rounds()) {
        if (l.source !== null || !l.text.includes(",")) continue;
        sawDrill = true;
        expect(
          / (and|or) |^first /.test(l.text),
          `Komma-Drill ohne englisches Füllwort: „${l.text}"`,
        ).toBe(true);
      }
    }
    expect(sawDrill).toBe(true);
  });
});

describe("Kontraktionen — Apostroph ist hart (Prüfbericht 27.07., Teil 2 Punkt 1)", () => {
  // Tastenstand direkt VOR der Apostroph-Taste: alles bis einschließlich «"»
  // ist gelernt, nur ' selbst (und alles danach) fehlt.
  const beforeApos = INTRO_ORDER.slice(0, INTRO_ORDER.indexOf("'"));
  const allowed = new Set(beforeApos.map((c) => c.toLowerCase()));
  // Verstümmelte Kontraktionen, die fitText früher erzeugte („don't" → „dont").
  const GARBLED =
    /\b(dont|wont|didnt|wasnt|doesnt|isnt|arent|cant|couldnt|wouldnt|shouldnt|havent|hasnt|werent|im|ive|youre|theyre|whats|thats|theres)\b/i;

  it("Einträge mit Apostroph passen ohne '-Taste nicht (fitsKeys)", () => {
    const withApos = CORPUS_EN.filter((it) => /['’]/.test(it.text));
    expect(withApos.length).toBeGreaterThan(10); // Reproduktionsbasis (don't/won't …)
    for (const it of withApos) {
      expect(fitsKeys(it.text, allowed), `serviert trotz Apostroph: „${it.text}"`).toBe(false);
    }
  });

  it("unterhalb der '-Taste wird NIE eine verstümmelte Kontraktion serviert", () => {
    for (const stufe of STUFEN_ALL) {
      for (const line of corpusItemsFor({ lernweg: "de", stufe, allowed, lang: "en" })) {
        expect(GARBLED.test(line), `verstümmelt in „${line}"`).toBe(false);
      }
    }
  });

  it("mit '-Taste bleibt eine Kontraktion unverändert erhalten", () => {
    // Seit TN-E13 enthält der aktive englische Bestand KEINE Kontraktion mehr
    // (alle 16 Apostroph-Zeilen sind ohne Apostroph neu formuliert, damit sie
    // nicht erst mit einer der letzten Tasten erscheinen). Die Regel selbst gilt
    // weiter — darum wird sie hier direkt an fitText geprüft statt am Bestand.
    const withApos = new Set([...allowed, "'"]);
    expect(fitText("I don't know.", withApos)).toBe("I don't know.");
    expect(fitText("It wasn't me.", withApos)).toBe("It wasn't me.");
    const lines = STUFEN_ALL.flatMap((stufe) =>
      corpusItemsFor({ lernweg: "de", stufe, allowed: withApos, lang: "en" }),
    );
    for (const line of lines) {
      expect(GARBLED.test(line), `verstümmelt trotz '-Taste: »${line}«`).toBe(false);
    }
  });
});
