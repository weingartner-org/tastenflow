/**
 * ★★★★★ WÄCHTER: Der GENERATOR und „Pyramidenwörter" reichen die französische
 * Landesvariante wirklich an den Korpus weiter (E10d, 26.09.2026, Bauplan
 * §10.1/§1.2 F8/§7.2 Punkt 3, Auftrag Punkt 1).
 *
 * Vor E10d baute keiner der drei `corpusEntriesFor`-Aufrufer in `generator.ts`
 * (Buchstaben-Lektionen, Text-Lektionen, adaptive Übung) und keiner der
 * `corpusItemsFor`-Aufrufer in `pyramide.ts` (Satzpyramiden) `franzVariante`
 * in seine Anfrage ein - ein kanadisches Kind hätte also weiterhin das
 * (falsche) Leerzeichen vor `; ! ?` bekommen, sobald der Korpus je Sätze mit
 * diesen Zeichen enthält (heute: noch keiner - der ganze `CORPUS_FR` trägt
 * momentan weder `;` noch `!` noch `?`, siehe `corpusFrMitte*.ts`).
 *
 * ★ Warum dieser Wächter die WEITERGABE prüft, nicht das servierte Zeichen
 * selbst: `wandleTypografie` (franzVariante.ts, Wächter
 * `tastenflow-franzoesisch-typografie-f8.test.ts`) beweist längst, dass die
 * Umwandlung selbst richtig arbeitet - was hier fehlte, war ausschliesslich
 * die WEITERGABE der Variante bis zu dieser Funktion. Ein Test, der auf ein
 * `; ! ?` im heutigen Korpus wartet, würde darum grün bleiben, selbst wenn die
 * Weitergabe nie gebaut worden wäre (Leitfaden Falle 16/18: ein Wächter, der
 * nichts finden KANN, beweist nichts) - deshalb ein Spion auf der echten
 * Funktion, der die tatsächlich übergebene Anfrage festhält.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import * as corpusManifest from "../src/lib/typing/corpusManifest";
import * as corpusLib from "../src/lib/typing/corpus";
import { adaptiveRound, generateRound } from "../src/lib/typing/generator";
import { pyramide } from "../src/lib/typing/uebungsformen/pyramide";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";
import { lernwegDef } from "../src/lib/typing/lernweg";

afterEach(() => {
  vi.restoreAllMocks();
});

const FR = lernwegDef("fr");
/** Voller Tastenstand des Weges „fr" - Buchstaben, ⇧, Satzzeichen, Ziffern, Sonderzeichen. */
const FR_INTRODUCED = [
  ...FR.letterOrder,
  "⇧",
  ...FR.punctOrder,
  ...FR.digitOrder,
  ...FR.symbolOrder,
];

/** Deterministischer Zufallsgenerator (mulberry32) - wie `tastenflow-form-pyramide.test.ts`. */
function seededZufall(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

describe("generateRound: franzVariante erreicht corpusEntriesFor", () => {
  it("Buchstaben-Lektion (letterLessonRound) gibt franzVariante weiter", () => {
    const spion = vi.spyOn(corpusManifest, "corpusEntriesFor");
    generateRound("home-fj", {
      introduced: FR_INTRODUCED,
      lernweg: "fr",
      lang: "fr",
      stufe: "teens",
      count: 5,
      franzVariante: "fr-CA",
    });
    expect(spion).toHaveBeenCalled();
    expect(spion.mock.calls.every((c) => c[0].franzVariante === "fr-CA")).toBe(true);
  });

  it("Text-Lektion (textLessonRound) gibt franzVariante weiter", () => {
    const spion = vi.spyOn(corpusManifest, "corpusEntriesFor");
    generateRound("text-erste-saetze", {
      introduced: FR_INTRODUCED,
      lernweg: "fr",
      lang: "fr",
      stufe: "teens",
      count: 5,
      franzVariante: "fr-BE",
    });
    expect(spion).toHaveBeenCalled();
    expect(spion.mock.calls.every((c) => c[0].franzVariante === "fr-BE")).toBe(true);
  });

  it("ohne franzVariante bleibt das Feld undefined - Weg „de“/„en“ unverändert", () => {
    const spion = vi.spyOn(corpusManifest, "corpusEntriesFor");
    generateRound("home-fj", {
      introduced: [...lernwegDef("de").letterOrder],
      lernweg: "de",
      lang: "de",
      stufe: "teens",
      count: 5,
    });
    expect(spion).toHaveBeenCalled();
    expect(spion.mock.calls.every((c) => c[0].franzVariante === undefined)).toBe(true);
  });
});

describe("adaptiveRound: franzVariante erreicht corpusEntriesFor", () => {
  it("gibt franzVariante weiter", () => {
    const spion = vi.spyOn(corpusManifest, "corpusEntriesFor");
    adaptiveRound({
      introduced: FR_INTRODUCED,
      lernweg: "fr",
      lang: "fr",
      stufe: "teens",
      count: 5,
      franzVariante: "fr-CA",
    });
    expect(spion).toHaveBeenCalled();
    expect(spion.mock.calls.every((c) => c[0].franzVariante === "fr-CA")).toBe(true);
  });

  it("ohne franzVariante bleibt das Feld undefined", () => {
    const spion = vi.spyOn(corpusManifest, "corpusEntriesFor");
    adaptiveRound({
      introduced: [...lernwegDef("en").letterOrder],
      lernweg: "en",
      lang: "en",
      stufe: "teens",
      count: 5,
    });
    expect(spion).toHaveBeenCalled();
    expect(spion.mock.calls.every((c) => c[0].franzVariante === undefined)).toBe(true);
  });
});

describe("Pyramidenwörter (Satzpyramide): franzVariante erreicht corpusItemsFor", () => {
  function ctxMit(overrides: Partial<FormKontext> = {}): FormKontext {
    return {
      lernweg: "fr",
      introduced: FR_INTRODUCED,
      shift: true,
      oneHand: false,
      stufe: "teens",
      lang: "fr",
      count: 3,
      zufall: seededZufall(42),
      ...overrides,
    };
  }

  it("die Form taugt mit dem vollen Tastenstand (Gegenprobe - sonst liefe satzPool nie)", () => {
    expect(pyramide.taugt(ctxMit())).toBe(true);
  });

  it("gibt ctx.franzVariante an corpusItemsFor weiter", () => {
    const spion = vi.spyOn(corpusLib, "corpusItemsFor");
    const ctx = ctxMit({ franzVariante: "fr-CH" });
    pyramide.baue?.(ctx);
    expect(spion).toHaveBeenCalled();
    expect(spion.mock.calls.some((c) => c[0].franzVariante === "fr-CH")).toBe(true);
  });

  it("ohne ctx.franzVariante bleibt das Feld undefined", () => {
    const spion = vi.spyOn(corpusLib, "corpusItemsFor");
    pyramide.baue?.(ctxMit());
    expect(spion).toHaveBeenCalled();
    expect(spion.mock.calls.every((c) => c[0].franzVariante === undefined)).toBe(true);
  });
});
