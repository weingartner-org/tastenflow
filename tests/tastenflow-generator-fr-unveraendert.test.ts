/**
 * ★★★★★ WÄCHTER: Der GENERATOR liefert für Weg „fr" byte-gleich, was er vor
 * dem Gerüst des vierten Weges „es" lieferte (ES-F1).
 *
 * BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md §2 („Wächter vorher (F1): Golden-
 * Tests für de, en UND fr … Generator-Runden mit festem Samen"). Vorbild:
 * `tests/tastenflow-generator-de-en-unveraendert.test.ts` (dort ausführlich
 * erklärt) - dieser Test prüft NUR den TEXT, den der Generator erzeugt (die
 * Golden-Tests für den WEG selbst prüfen nur Reihenfolge/Freischaltung).
 *
 * Drei Sprossen statt nur „voll" (Leitfaden Falle 4: eine Stichprobe nur am
 * Ende hätte eine Regression an einer FRÜHEN oder MITTLEREN Stelle - z. B. in
 * der Satzzeichen-Behandlung vor den Ziffern - nie gesehen):
 *  · früh: nur die Grundreihe (8 Tasten), keine Satzzeichen/Ziffern/Umschalt.
 *  · mittel: alle Buchstaben + Umschalt + Satzzeichen, noch keine Ziffern.
 *  · spät: alles frei, inklusive Ziffern und Sonderzeichen.
 *
 * Zusätzlich die LANDESVARIANTE (`franzVariante.ts`, E9a/E10d) an der späten
 * Sprosse - `wandleTypografie` läuft GANZ ZULETZT, nach `fitText` und nach der
 * Ledger-Kennung, und wäre von einem „es"-Umbau, der die letzte Servierstufe
 * anfasst, am ehesten getroffen.
 *
 * Neu aufnehmen (nur bei einer bewussten, mit Johannes besprochenen Änderung
 * an Weg „fr"): Fixture-Datei aus einem Stand VOR der Änderung neu erzeugen
 * (Muster wie bei den anderen Golden-Tests) - NIE einfach die aktuelle
 * Ausgabe hineinschreiben.
 */
import { afterAll, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { adaptiveRound, generateRound, wordDrillZeilen } from "../src/lib/typing/generator";
import { SHIFT_UNIT } from "../src/lib/typing/letters";

const DATEI = resolve(__dirname, "fixtures/tastenflow-generator-fr-golden.json");
const GOLDEN: Record<string, string[]> = existsSync(DATEI)
  ? JSON.parse(readFileSync(DATEI, "utf8"))
  : {};

/** Deterministischer PRNG (mulberry32) - dasselbe Muster wie beim de/en-Wächter. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeededRandom<T>(seed: number, fn: () => T): T {
  const real = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = real;
  }
}

const STUFEN = ["kids", "teens", "erwachsen"] as const;
const LANG = "fr" as const;
const def = lernwegDef(LANG);
const letterOrder = [...def.letterOrder];
const punct = [...def.punctOrder];
const digits = [...def.digitOrder];
const symbols = [...def.symbolOrder];

/** Aufnehmen statt vergleichen? Nur mit ausdrücklichem Auftrag (Kopf-Kommentar). */
const AUFNEHMEN = process.env.GENERATOR_FR_GOLDEN_AUFNEHMEN === "1";
const ERGEBNIS: Record<string, string[]> = {};

/** Entweder in ERGEBNIS ablegen (Aufnahme-Lauf) oder gegen GOLDEN[key] prüfen. */
function pruefeOderNimmAuf(key: string, zeilen: string[]): void {
  if (AUFNEHMEN) {
    ERGEBNIS[key] = zeilen;
    return;
  }
  expect(zeilen, `Fixture-Eintrag fehlt: ${key}`).toEqual(GOLDEN[key]);
}

/** Die drei Sprossen (Leitfaden Falle 4: früh/mittel/spät, nicht nur „voll"). */
const RUNGS: { name: string; introduced: () => string[] }[] = [
  { name: "frueh", introduced: () => letterOrder.slice(0, def.homeRowLetters) },
  {
    name: "mittel",
    introduced: () => [...letterOrder, SHIFT_UNIT, ...punct],
  },
  {
    name: "spaet",
    introduced: () => [...letterOrder, SHIFT_UNIT, ...punct, ...digits, ...symbols],
  },
];

/** Drei Défi-Lektionen des Weges „fr" (curriculumFr.ts) - das Gegenstück zu
 *  „satzzeichen"/„zahlen"/„satz-sonderzeichen" (de) bzw. „en-punctuation"/
 *  „en-numbers"/„en-symbols" (en). Diese IDs sind layout-unabhängig vergeben
 *  (curriculumFr.ts BAU-Tabelle), anders als die Lektions-INTROS. */
const FR_LESSON_IDS = ["fr-ponctuation-1", "fr-chiffres", "fr-speciaux-1"];

describe('★★★★★ Generator: Weg „fr" unverändert vor dem „es"-Umbau (ES-F1)', () => {
  describe("wordDrillZeilen", () => {
    for (const n of [8, 16, 24, letterOrder.length]) {
      for (const stufe of STUFEN) {
        for (const shiftDrill of [false, true]) {
          it(`Tastenstand ${n} / Stufe ${stufe} / shiftDrill=${shiftDrill}`, () => {
            const allowed = letterOrder.slice(0, n);
            const key = `wordDrillZeilen:${n}:${stufe}:${shiftDrill}`;
            const zeilen = withSeededRandom(42, () =>
              wordDrillZeilen(allowed, true, stufe, allowed.slice(0, 3), 12, shiftDrill, LANG),
            ).map((z) => z.text);
            pruefeOderNimmAuf(key, zeilen);
          });
        }
      }
    }
  });

  describe("adaptiveRound - früh/mittel/spät (Falle 4: nicht nur die letzte Sprosse)", () => {
    for (const rung of RUNGS) {
      it(`Sprosse „${rung.name}"`, () => {
        const introduced = rung.introduced();
        const zeilen = withSeededRandom(7, () =>
          adaptiveRound({
            introduced,
            stufe: "teens",
            lang: LANG,
            lernweg: LANG,
            count: 16,
            focus: [punct[0], digits[0], symbols[0]].filter((c) => introduced.includes(c)),
          }).map((l) => l.text),
        );
        pruefeOderNimmAuf(`adaptiveRound:${rung.name}`, zeilen);
      });
    }

    it('Landesvariante an der späten Sprosse ("fr-CA" statt der Vorgabe "fr-FR")', () => {
      const introduced = RUNGS.find((r) => r.name === "spaet")!.introduced();
      const zeilen = withSeededRandom(7, () =>
        adaptiveRound({
          introduced,
          stufe: "teens",
          lang: LANG,
          lernweg: LANG,
          count: 16,
          focus: [punct[0], digits[0], symbols[0]],
          franzVariante: "fr-CA",
        }).map((l) => l.text),
      );
      pruefeOderNimmAuf("adaptiveRound:spaet:fr-CA", zeilen);
    });
  });

  describe("generateRound - drei Défi-Lektionen (Satzzeichen/Ziffern/Sonderzeichen)", () => {
    for (const id of FR_LESSON_IDS) {
      it(`Lektion „${id}"`, () => {
        const zeilen = withSeededRandom(99, () =>
          generateRound(id, { lernweg: LANG, lang: LANG, stufe: "teens", count: 16 }).map(
            (l) => l.text,
          ),
        );
        pruefeOderNimmAuf(`generateRound:${id}`, zeilen);
      });
    }
  });

  it("Gegenprobe: die Fixture selbst ist nicht leer (ein leerer Wächter beweist nichts)", () => {
    if (AUFNEHMEN) {
      expect(Object.keys(ERGEBNIS).length).toBeGreaterThan(30);
      return;
    }
    expect(Object.keys(GOLDEN).length).toBeGreaterThan(30);
    expect(GOLDEN["wordDrillZeilen:8:kids:false"]?.length).toBe(12);
  });

  // Erst NACH allen it()s dieser Datei geschrieben - sonst fehlten Einträge,
  // deren it() (Deklarationsreihenfolge) hinter dem Schreiben stünde.
  afterAll(() => {
    if (!AUFNEHMEN) return;
    mkdirSync(dirname(DATEI), { recursive: true });
    writeFileSync(DATEI, JSON.stringify(ERGEBNIS, null, 1) + "\n", "utf8");
  });
});
