/**
 * ★★★★★ WÄCHTER: Der GENERATOR liefert für Weg „fr" wirklich Französisch.
 *
 * Auftrag E10c (26.09.2026, `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md`):
 * vor diesem Umbau lieferte der Generator (`src/lib/typing/generator.ts`) für
 * Weg „fr" deutsche Wörter (`UNIQUE_WORDS`/`STUFE_VOCAB`), deutsche Nomen-
 * Grossschreibung (`caseWord`) und deutsche Markov-Pseudowörter - gemessen im
 * Befund (`BEFUND-2026-09-26-E10C-GENERATOR-FR.md`, Vorher-Abschnitt): „Fluss
 * des neun Feld", „Freundschaft", „kluss stem klette" usw. auf Weg „fr".
 *
 * Dieser Wächter prüft über alle Sprossen 9-34 und alle drei Altersstufen je
 * 50 erzeugte Zeilen:
 *  1. kein `ä ö ü ß` (deutsche Buchstaben, auf keiner französischen Tastatur),
 *  2. jede Zeile passt zum Zeichensatz der Sprosse (`fitText(…, "fr")` - prüft
 *     zugleich, dass ein Bindestrich im Weg „fr" nicht still zum Leerzeichen
 *     wird, siehe corpus.ts E8b Block 1b),
 *  3. keine Grossschreibung ausser am Zeilenanfang (Bauplan §6.5 Punkt 2 - im
 *     Französischen gibt es keine Nomen-Grossschreibung),
 *  4. bei ECHTEN Wörtern (nicht bei den bewusst erfundenen Pseudowort-Zeilen)
 *     kein Wort, das in der deutschen Liste (`WORDS`) steht, ohne AUCH ein
 *     gültiges Wort aus dem französischen Wortschatz (`WORDS_FR`/
 *     `STUFE_VOCAB_FR`) zu sein.
 *
 * Gegenprobe (von Hand, siehe Befund §Testliste): derselbe Test gegen den
 * Stand VOR E10c (per `git stash`) schlägt bei JEDER der vier Prüfungen fehl -
 * ein Wächter, der beim ersten Lauf nichts findet, beweist nichts (Leitfaden
 * Falle 16/18).
 */
import { describe, expect, it } from "vitest";
import { WORDS } from "../src/lib/typing/words";
import { STUFE_VOCAB } from "../src/lib/typing/corpusExtras";
import { WORDS_FR, STUFE_VOCAB_FR } from "../src/lib/typing/wordsFr";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { wordDrillZeilen } from "../src/lib/typing/generator";
import { fitText } from "../src/lib/typing/corpus";

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

const FR_DEF = lernwegDef("fr");
const FR_LETTER_ORDER = [...FR_DEF.letterOrder];
const FR_LETTERS_BEFORE_SHIFT = FR_DEF.lettersBeforeShift;

/** Alle gültigen Wörter der französischen Übungsformen (Bauplan §2.3 Punkt 2). */
const FRENCH_VOCAB = new Set<string>([
  ...WORDS_FR.map((w) => w.toLowerCase()),
  ...Object.values(STUFE_VOCAB_FR).flat().map((w) => w.toLowerCase()),
]);

/** Deutsche Wörter, die NICHT auch ein gültiges französisches Wort sind. */
const GERMAN_WORDS = [...WORDS, ...Object.values(STUFE_VOCAB).flat()];
const GERMAN_ONLY = new Set(
  GERMAN_WORDS.map((w) => w.toLowerCase()).filter((w) => !FRENCH_VOCAB.has(w)),
);

const STUFEN = ["kids", "teens", "erwachsen"] as const;
const SPROSSEN = Array.from(
  { length: FR_LETTER_ORDER.length - 9 + 1 },
  (_, i) => i + 9,
); // 9 … 34

/** Grossbuchstabe (auch mit Akzent) - für die Nur-Zeilenanfang-Prüfung. */
const GROSSBUCHSTABE = /[A-ZÀÂÇÉÈÊËÏÎÔÙÛ]/;

describe("★★★★★ Generator: Weg „fr“ liefert wirklich Französisch (E10c)", () => {
  for (const n of SPROSSEN) {
    const allowedArr = FR_LETTER_ORDER.slice(0, n);
    const allowedSet = new Set(allowedArr);
    const shift = n >= FR_LETTERS_BEFORE_SHIFT;

    for (const stufe of STUFEN) {
      it(`Sprosse ${n} (${allowedArr.join(" ")}) / Stufe ${stufe}: 50 Zeilen ohne deutsche Spur`, () => {
        const zeilen = withSeededRandom(1000 + n * 7 + stufe.length, () =>
          wordDrillZeilen(allowedArr, shift, stufe, [], 50, false, "fr"),
        );
        expect(zeilen.length).toBe(50);

        for (const z of zeilen) {
          // 1. kein ä ö ü ß
          expect(z.text, z.text).not.toMatch(/[äöüß]/i);

          // 2. passt zum Zeichensatz der Sprosse (Weg „fr": Bindestrich hart).
          expect(fitText(z.text, allowedSet, "fr"), z.text).not.toBeNull();

          // 3. keine Grossschreibung ausser am Zeilenanfang.
          expect(z.text.slice(1), z.text).not.toMatch(GROSSBUCHSTABE);

          // 4. echte Wörter: keines nur-deutsch.
          if (!z.unsinn) {
            const tokens = z.text
              .toLowerCase()
              .split(/\s+/)
              .filter((t) => t.length >= 2);
            for (const t of tokens) {
              expect(GERMAN_ONLY.has(t), `"${t}" in "${z.text}" ist nur Deutsch`).toBe(
                false,
              );
            }
          }
        }
      });
    }
  }

  it("Gegenprobe: die Prüfungen finden wirklich etwas (kein leerer Wächter)", () => {
    expect(GERMAN_ONLY.has("freundschaft")).toBe(true);
    expect(GERMAN_ONLY.has("umwelt")).toBe(true);
    // "an" ist deutsch UND französisch (Jahr) - darf nicht als „nur deutsch" gelten.
    expect(GERMAN_ONLY.has("an")).toBe(false);
    expect(fitText("straße", new Set(["s", "t", "r", "a"])), "straße mit ß").toBeNull();
    expect("wort Mitte".slice(1)).toMatch(GROSSBUCHSTABE);
  });
});
