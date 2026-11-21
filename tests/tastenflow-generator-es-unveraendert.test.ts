/**
 * ★★★★★ WÄCHTER: Der GENERATOR liefert für Weg „es" byte-gleich, was er vor dem
 * Umbau auf das Sprachregister lieferte (Etappe G1a,
 * BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md §4).
 *
 * Vorbild: `tests/tastenflow-generator-fr-unveraendert.test.ts` - dieser Test
 * prüft NUR den TEXT, den der Generator erzeugt (die anderen Golden-Tests für
 * Weg „es" prüfen Reihenfolge/Freischaltung und Korpus-Inhalt). Der Umbau, der
 * die 279 Sprach-Stellen in ein Register zieht, berührt den Generator am
 * stärksten (`charDrillLine`, `fertigeZeile`, `wandle…`) - hier sitzt der
 * Schutz.
 *
 * Mehrere Sprossen statt nur „voll" (Leitfaden Falle 4: eine Stichprobe nur am
 * Ende hätte eine Regression an einer FRÜHEN oder MITTLEREN Stelle nie
 * gesehen):
 *  · frueh: nur die Grundreihe (8 Tasten), keine Satzzeichen/Ziffern/Umschalt.
 *  · mittel: alle Buchstaben + Umschalt + Satzzeichen, noch keine Ziffern.
 *  · frage: wie mittel, aber nur bis zum PAAR ¿ ? (¡ ! fehlen noch) - die
 *    Paar-Vorlagen (`charDrillLine`, ES-P7a M3) mit Fokus auf ¿, ?, ¡, !.
 *  · spaet: alles frei, inklusive Ziffern, Sonderzeichen und Apostroph.
 *
 * Dazu: die zwei Landesvarianten (`esVariante`: es-ES, es-419 - die
 * Zahlenschreibweise läuft GANZ ZULETZT, nach `fitText`), die Tastatur
 * Lateinamerika (kein „€"), die Lektionen mit Satzzeichen-Paaren, Ziffern,
 * Sonderzeichen, Totasten und Apostroph (`generateRound`), und der
 * Haupt­sprache-Vorrang (D1 Nr. 18: Übungssprache „en" auf dem spanischen Weg
 * fällt für eine Fokus-Einheit, die es im Englischen nicht gibt, auf „es"
 * zurück).
 *
 * Neu aufnehmen (nur bei einer bewussten, mit Johannes besprochenen Änderung
 * an Weg „es"): `GENERATOR_ES_GOLDEN_AUFNEHMEN=1 npx vitest run --maxWorkers=2
 * --minWorkers=1 tests/tastenflow-generator-es-unveraendert.test.ts` - aus einem
 * Stand VOR der Änderung; NIE einfach die aktuelle Ausgabe hineinschreiben.
 */
import { afterAll, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { adaptiveRound, generateRound, wordDrillZeilen } from "../src/lib/typing/generator";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { setLayout } from "../src/lib/typing/layouts";
import type { EsVariante } from "../src/lib/typing/esVariante";

const DATEI = resolve(__dirname, "fixtures/tastenflow-generator-es-golden.json");
const GOLDEN: Record<string, string[]> = existsSync(DATEI)
  ? JSON.parse(readFileSync(DATEI, "utf8"))
  : {};

/** Deterministischer PRNG (mulberry32) - dasselbe Muster wie bei den anderen Wächtern. */
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
const LANG = "es" as const;
const def = lernwegDef(LANG);
const letterOrder = [...def.letterOrder];
const punct = [...def.punctOrder];
const digits = [...def.digitOrder];
const symbols = [...def.symbolOrder];

/** Aufnehmen statt vergleichen? Nur mit ausdrücklichem Auftrag (Kopf-Kommentar). */
const AUFNEHMEN = process.env.GENERATOR_ES_GOLDEN_AUFNEHMEN === "1";
const ERGEBNIS: Record<string, string[]> = {};

/** Entweder in ERGEBNIS ablegen (Aufnahme-Lauf) oder gegen GOLDEN[key] prüfen. */
function pruefeOderNimmAuf(key: string, zeilen: string[]): void {
  if (AUFNEHMEN) {
    ERGEBNIS[key] = zeilen;
    return;
  }
  expect(zeilen, `Fixture-Eintrag fehlt: ${key}`).toEqual(GOLDEN[key]);
}

/** Die Einheiten bis EINSCHLIESSLICH des Paares ¿ ? (ohne ¡ !). */
const BIS_FRAGE = (): string[] => {
  const i = punct.indexOf("?");
  return punct.slice(0, i + 1);
};

/** Die Sprossen (Leitfaden Falle 4: früh/mittel/Paar/spät, nicht nur „voll"). */
const RUNGS: { name: string; introduced: () => string[]; focus: () => string[] }[] = [
  {
    name: "frueh",
    introduced: () => letterOrder.slice(0, def.homeRowLetters),
    focus: () => [],
  },
  {
    name: "mittel",
    introduced: () => [...letterOrder, SHIFT_UNIT, ...punct.slice(0, 2)],
    focus: () => [punct[0], SHIFT_UNIT],
  },
  {
    name: "frage",
    introduced: () => [...letterOrder, SHIFT_UNIT, ...BIS_FRAGE()],
    focus: () => ["¿", "?"],
  },
  {
    name: "paare",
    introduced: () => [...letterOrder, SHIFT_UNIT, ...punct],
    focus: () => ["¿", "?", "¡", "!"],
  },
  {
    // Nur das Paar ¡ ! im Fokus - die Ausrufe-Vorlagen von `charDrillLine`
    // (bei Fokus auf alle vier Einheiten dominieren die Frage-Vorlagen).
    name: "ruf",
    introduced: () => [...letterOrder, SHIFT_UNIT, ...punct],
    focus: () => ["¡", "!"],
  },
  {
    name: "spaet",
    introduced: () => [...letterOrder, SHIFT_UNIT, ...punct, ...digits, ...symbols],
    focus: () => [punct[0], digits[0], symbols[0], "'"],
  },
];

/** Lektionen des Weges „es" (curriculumEs.ts): Satzzeichen, Paare, Ziffern,
 *  Sonderzeichen mit Apostroph, Totasten, ñ. */
const ES_LESSON_IDS = [
  "es-puntuacion-1",
  "es-interrogacion",
  "es-exclamacion",
  "es-puntuacion-2",
  "es-numeros",
  "es-especiales-1",
  "es-especiales-2",
  "es-tilde",
  "es-dieresis",
  "es-enye",
];

describe('★★★★★ Generator: Weg „es" unverändert vor dem Sprachregister-Umbau (G1a)', () => {
  describe("wordDrillZeilen", () => {
    for (const n of [8, 17, 25, letterOrder.length]) {
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

  describe("adaptiveRound - früh/mittel/Paar/spät (Falle 4: nicht nur die letzte Sprosse)", () => {
    for (const rung of RUNGS) {
      for (const stufe of STUFEN) {
        // Frühe Sprossen nur in einer Stufe (die Textwahl hängt dort nicht an der Stufe).
        if ((rung.name === "frueh" || rung.name === "mittel") && stufe !== "teens") continue;
        for (const seed of ["spaet", "paare", "ruf"].includes(rung.name) ? [7, 31] : [7]) {
          it(`Sprosse „${rung.name}" / ${stufe} / Zufall ${seed}`, () => {
            const introduced = rung.introduced();
            const zeilen = withSeededRandom(seed, () =>
              adaptiveRound({
                introduced,
                stufe,
                lang: LANG,
                lernweg: LANG,
                count: 16,
                focus: rung.focus().filter((c) => introduced.includes(c)),
              }).map((l) => l.text),
            );
            pruefeOderNimmAuf(`adaptiveRound:${rung.name}:${stufe}:${seed}`, zeilen);
          });
        }
      }
    }

    it("ohne Fokus an der späten Sprosse (gewöhnliche Mischrunde)", () => {
      const introduced = RUNGS.find((r) => r.name === "spaet")!.introduced();
      const zeilen = withSeededRandom(5, () =>
        adaptiveRound({ introduced, stufe: "erwachsen", lang: LANG, lernweg: LANG, count: 16 }).map(
          (l) => l.text,
        ),
      );
      pruefeOderNimmAuf("adaptiveRound:spaet:ohneFokus", zeilen);
    });

    for (const variante of ["es-ES", "es-419"] as EsVariante[]) {
      it(`Landesvariante an der späten Sprosse (${variante}) - Zahlenschreibweise läuft zuletzt`, () => {
        const introduced = RUNGS.find((r) => r.name === "spaet")!.introduced();
        const zeilen = withSeededRandom(7, () =>
          adaptiveRound({
            introduced,
            stufe: "teens",
            lang: LANG,
            lernweg: LANG,
            count: 16,
            focus: [digits[0], digits[5], symbols[0]],
            esVariante: variante,
          }).map((l) => l.text),
        );
        pruefeOderNimmAuf(`adaptiveRound:spaet:${variante}`, zeilen);
      });
    }

    it('Tastatur Lateinamerika (kein „€"): späte Sprosse mit den Einheiten dieser Tastatur', () => {
      setLayout("latam");
      try {
        const voll = new Set(introOrder(LANG));
        const introduced = RUNGS.find((r) => r.name === "spaet")!
          .introduced()
          .filter((u) => voll.has(u));
        const zeilen = withSeededRandom(7, () =>
          adaptiveRound({
            introduced,
            stufe: "teens",
            lang: LANG,
            lernweg: LANG,
            count: 16,
            focus: [punct[0], digits[0], symbols[0], "'"],
            esVariante: "es-419",
          }).map((l) => l.text),
        );
        pruefeOderNimmAuf("adaptiveRound:spaet:latam", zeilen);
      } finally {
        setLayout("de");
      }
    });

    it('Hauptsprache-Vorrang (D1 Nr. 18): Übungssprache „en" auf Weg „es", Fokus ¿ ? ¡ ! → spanische Runde', () => {
      const introduced = RUNGS.find((r) => r.name === "paare")!.introduced();
      const zeilen = withSeededRandom(7, () =>
        adaptiveRound({
          introduced,
          stufe: "teens",
          lang: "en",
          lernweg: LANG,
          count: 16,
          focus: ["¿", "?", "¡", "!"],
        }).map((l) => l.text),
      );
      pruefeOderNimmAuf("adaptiveRound:paare:lang-en", zeilen);
    });
  });

  describe("generateRound - die Lektionen mit Satzzeichen, Paaren, Ziffern, Sonderzeichen, Totasten", () => {
    for (const id of ES_LESSON_IDS) {
      it(`Lektion „${id}"`, () => {
        const zeilen = withSeededRandom(99, () =>
          generateRound(id, { lernweg: LANG, lang: LANG, stufe: "teens", count: 16 }).map(
            (l) => l.text,
          ),
        );
        pruefeOderNimmAuf(`generateRound:${id}`, zeilen);
      });
    }

    it('Lektion „es-numeros" mit Landesvariante "es-419" (Zahlenschreibweise)', () => {
      const zeilen = withSeededRandom(99, () =>
        generateRound("es-numeros", {
          lernweg: LANG,
          lang: LANG,
          stufe: "erwachsen",
          count: 16,
          esVariante: "es-419",
        }).map((l) => l.text),
      );
      pruefeOderNimmAuf("generateRound:es-numeros:es-419", zeilen);
    });

    it('Lektion „es-interrogacion" in der Übungssprache "en" (Hauptsprache-Vorrang)', () => {
      const zeilen = withSeededRandom(99, () =>
        generateRound("es-interrogacion", {
          lernweg: LANG,
          lang: "en",
          stufe: "teens",
          count: 16,
        }).map((l) => l.text),
      );
      pruefeOderNimmAuf("generateRound:es-interrogacion:lang-en", zeilen);
    });
  });

  it("Gegenprobe: die Fixture selbst ist nicht leer (ein leerer Wächter beweist nichts)", () => {
    if (AUFNEHMEN) {
      expect(Object.keys(ERGEBNIS).length).toBeGreaterThan(40);
      return;
    }
    expect(Object.keys(GOLDEN).length).toBeGreaterThan(40);
    expect(GOLDEN["wordDrillZeilen:8:kids:false"]?.length).toBe(12);
    // Die späte Sprosse trägt wirklich Ziffern/Apostroph/Paare - sonst prüfte sie nur Buchstaben.
    const spaet = Object.entries(GOLDEN)
      .filter(([k]) => k.startsWith("adaptiveRound:spaet:") || k.startsWith("generateRound:"))
      .flatMap(([, z]) => z);
    expect(spaet.some((z) => /\d/.test(z)), "Zeile mit Ziffer").toBe(true);
    expect(spaet.some((z) => z.includes("'")), "Zeile mit Apostroph").toBe(true);
    const paare = Object.entries(GOLDEN)
      .filter(([k]) => k.startsWith("adaptiveRound:paare:") || k.includes("interrogacion") || k.includes("exclamacion"))
      .flatMap(([, z]) => z);
    expect(paare.some((z) => z.includes("¿") && z.includes("?")), "Zeile mit ¿…?").toBe(true);
    expect(paare.some((z) => z.includes("¡") && z.includes("!")), "Zeile mit ¡…!").toBe(true);
  });

  // Erst NACH allen it()s dieser Datei geschrieben - sonst fehlten Einträge,
  // deren it() (Deklarationsreihenfolge) hinter dem Schreiben stünde.
  afterAll(() => {
    setLayout("de");
    if (!AUFNEHMEN) return;
    mkdirSync(dirname(DATEI), { recursive: true });
    writeFileSync(DATEI, JSON.stringify(ERGEBNIS, null, 1) + "\n", "utf8");
  });
});
