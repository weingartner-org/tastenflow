/**
 * ★★★★★ WÄCHTER: Der GENERATOR liefert für „de" und „en" byte-gleich, was er
 * vor E10c lieferte.
 *
 * Auftrag E10c (26.09.2026, `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md`,
 * Punkt 3): der Generator (`src/lib/typing/generator.ts`) lernt den Weg „fr" -
 * `wordBase`, `stufeVocab`, `caseWord`, die Pseudowort-Werkstatt
 * (`pseudoRoh`/`syllable`), die Satz-Großschreibung (`SENTENCE_CAP`) und die
 * Füllwörter in `charDrillLine`/`punctItems` wurden von Ternären
 * (`lang === "en" ? … : …`) auf Tabellen (`Record<Lang, …>`) umgestellt. Die
 * Golden-Tests für die WEGE (`tastenflow-lernweg-*-unveraendert.test.ts`)
 * prüfen nur die Reihenfolge/Freischaltung, nicht den vom Generator erzeugten
 * TEXT - dieser Wächter schliesst genau diese Lücke.
 *
 * Die Fixture (`tests/fixtures/tastenflow-generator-de-en-golden.json`) wurde
 * VOR dem Umbau mit dem UNVERÄNDERTEN Generator aufgenommen (deterministischer
 * Zufall, `mulberry32`, siehe `tests/typing-erweiterung.test.ts`) und deckt
 * `wordDrillZeilen` (mehrere Tastenstände/Stufen/shiftDrill), `adaptiveRound`
 * (mit Satzzeichen/Ziffern/Sonderzeichen - `charDrillLine`) und `generateRound`
 * für die Satzzeichen-/Zahlen-/Sonderzeichen-Lektionen (`punctItems`/
 * `symbolItems`) ab. Dieser Test rechnet dieselben Aufrufe mit demselben Samen
 * heute nach und verlangt Gleichheit - wird er rot, hat der Umbau „de"/„en"
 * angefasst, was verboten ist (Auftrag Punkt 3: „Deutsch und Englisch ändern
 * sich um KEIN Byte").
 *
 * Neu aufnehmen (nur bei einer bewussten, mit Johannes besprochenen Änderung
 * an Deutsch/Englisch): Fixture-Datei aus einem Stand VOR der Änderung neu
 * erzeugen (siehe Kopf-Kommentar der anderen Golden-Tests für das Muster) -
 * NIE einfach die aktuelle Ausgabe hineinschreiben.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { adaptiveRound, generateRound, wordDrillZeilen } from "../src/lib/typing/generator";
import type { Lang } from "../src/lib/typing/account";

const DATEI = resolve(__dirname, "fixtures/tastenflow-generator-de-en-golden.json");
const GOLDEN: Record<string, string[]> = JSON.parse(readFileSync(DATEI, "utf8"));

/** Deterministischer PRNG (mulberry32) - dasselbe Muster wie typing-erweiterung.test.ts. */
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

describe("★★★★★ Generator: Weg „de“/„en“ unverändert nach E10c (Weg „fr“)", () => {
  for (const lang of ["de", "en"] as const) {
    const letterOrder = [...lernwegDef(lang).letterOrder];

    describe(`wordDrillZeilen (${lang})`, () => {
      for (const n of [8, 13, 21, letterOrder.length]) {
        for (const stufe of STUFEN) {
          for (const shiftDrill of [false, true]) {
            it(`Tastenstand ${n} / Stufe ${stufe} / shiftDrill=${shiftDrill}`, () => {
              const allowed = letterOrder.slice(0, n);
              const key = `wordDrillZeilen:${lang}:${n}:${stufe}:${shiftDrill}`;
              const zeilen = withSeededRandom(42, () =>
                wordDrillZeilen(allowed, true, stufe, allowed.slice(0, 3), 12, shiftDrill, lang),
              ).map((z) => z.text);
              expect(zeilen).toEqual(GOLDEN[key]);
            });
          }
        }
      }
    });

    it(`adaptiveRound mit Satzzeichen/Ziffern/Sonderzeichen (${lang})`, () => {
      const def = lernwegDef(lang);
      const full = [...def.letterOrder];
      const punct = [...def.punctOrder];
      const digits = [...def.digitOrder];
      const symbols = [...def.symbolOrder];
      const introduced = [...full, "⇧", ...punct, ...digits, ...symbols];
      const zeilen = withSeededRandom(7, () =>
        adaptiveRound({
          introduced,
          stufe: "teens",
          lang,
          lernweg: lang,
          count: 16,
          focus: [punct[0], digits[0], symbols[0]],
        }).map((l) => l.text),
      );
      expect(zeilen).toEqual(GOLDEN[`adaptiveRound:${lang}`]);
    });

    const lessonIds: string[] =
      lang === "de"
        ? ["satzzeichen", "zahlen", "satz-sonderzeichen"]
        : ["en-punctuation", "en-numbers", "en-symbols"];
    for (const id of lessonIds) {
      it(`generateRound „${id}“ (${lang})`, () => {
        const zeilen = withSeededRandom(99, () =>
          generateRound(id, { lernweg: lang as Lang, lang, stufe: "teens", count: 16 }).map(
            (l) => l.text,
          ),
        );
        expect(zeilen).toEqual(GOLDEN[`generateRound:${lang}:${id}`]);
      });
    }
  }

  it("Gegenprobe: die Fixture selbst ist nicht leer (ein leerer Wächter beweist nichts)", () => {
    expect(Object.keys(GOLDEN).length).toBeGreaterThan(40);
    expect(GOLDEN["wordDrillZeilen:de:8:kids:false"]?.length).toBe(12);
  });
});
