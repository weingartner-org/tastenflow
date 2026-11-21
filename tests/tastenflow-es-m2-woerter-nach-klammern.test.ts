/**
 * ★★★★ WÄCHTER (ES-M2, 27.09.2026, Prüfbericht ES-P2 S2): AUF WEG „es" WIRD
 * JEDES WORT GANZ VORGELESEN - AUCH NACH ( [ { - * # ' UND VOR ) ] }.
 *
 * Befund S2 (Rest der M5-Fehlerklasse): `readPlanAt` schob den Wortanfang nur
 * hinter ¿ ¡ ". „Mi mascota (una tortuga)": an „u" von „una" nichts, an „t"
 * „tortuga)". Gemessen: Korpus 81, Reto 372 Wörter nie ganz gesprochen.
 *
 * Geprüft über die FEHLERKLASSE: jedes öffnende × jedes schliessende Zeichen
 * um ein bekanntes Wort, dazu der ganze spanische Korpus. Gegenprobe: dieselbe
 * Messung mit den Regeln eines anderen Weges fand die Lücke (bis 28.09.).
 *
 * ★ Punkt 2 „vier Reste" (28.09.2026): die Regel gilt seither für ALLE
 * Sprachen (Listen `OEFFNEND_VOR_WORT`/`SCHLIESSEND_NACH_WORT`). Die
 * Gegenprobe „anderer Weg" und „Weg de unverändert" sind damit überholt -
 * der Wächter über alle Wege ist
 * `tests/tastenflow-woerter-nach-oeffnenden-alle-wege.test.ts`.
 */
import { describe, expect, it } from "vitest";

import {
  OEFFNEND_VOR_WORT as ES_OEFFNEND,
  SCHLIESSEND_NACH_WORT as ES_SCHLIESSEND,
  readPlanAt,
  type ReadModes,
} from "../src/lib/typing/voice";
import { isRealWord } from "../src/lib/typing/lexicon";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";

const M: ReadModes = { letters: false, words: true, sentences: true, shiftLearned: true, lang: "es" };
const istWort = (t: string) => isRealWord(t, "es");

/** Alles, was an irgendeiner Stelle der Zeile gesprochen wird. */
function gesprochen(zeile: string, m: ReadModes = M): Set<string> {
  const s = new Set<string>();
  for (let i = 0; i < zeile.length; i++) for (const p of readPlanAt(zeile, i, m, istWort)) s.add(p);
  return s;
}

/** Was ein Kind als ganzes Wort hören soll - unabhängig vom Code aufgeschrieben. */
function erwartet(t: string): string {
  const vorn = t.replace(/^[¿¡"(\[{\-*#'«“‘@]+/, "");
  const hinten = vorn.match(/[)\]}"'»”’.,;:?!…]*$/)?.[0] ?? "";
  return vorn.slice(0, vorn.length - hinten.length) + hinten.replace(/[)\]}"'»”’]/g, "");
}

/** Echte Wörter einer Zeile, die an keiner Stelle ganz gesprochen werden. */
function nieGanz(zeilen: readonly string[], m: ReadModes = M): string[] {
  const out: string[] = [];
  for (const z of zeilen) {
    const g = gesprochen(z, m);
    for (const t of z.split(" ")) {
      if (t.replace(/[^\p{L}]/gu, "").length < 2 || !istWort(t)) continue;
      if (!g.has(erwartet(t))) out.push(t);
    }
  }
  return out;
}

describe("S2: Wörter nach öffnenden und vor schliessenden Zeichen", () => {
  it("jedes öffnende × jedes schliessende Zeichen: das Wort wird ganz und ohne Zeichen gesprochen", () => {
    for (const o of ES_OEFFNEND)
      for (const c of [...ES_SCHLIESSEND, ""]) {
        const zeile = `Mi mascota ${o}tortuga${c} se llama Luna.`;
        const i = zeile.indexOf("tortuga");
        expect(readPlanAt(zeile, i, M, istWort), JSON.stringify(zeile)).toEqual(["tortuga"]);
      }
  });

  it("Satzzeichen hinter der Klammer bleiben, ein gewöhnliches Wort bleibt Zeichen für Zeichen", () => {
    const z = "Vive en casa (con su abuela), y juega.";
    expect(readPlanAt(z, z.indexOf("abuela"), M, istWort)).toEqual(["abuela,"]);
    expect(readPlanAt(z, z.indexOf("casa"), M, istWort)).toEqual(["casa"]);
    expect(readPlanAt(z, z.indexOf("juega"), M, istWort)).toEqual(["juega."]);
  });

  it("der ganze spanische Korpus: kein echtes Wort bleibt ungesprochen", () => {
    expect(nieGanz(CORPUS_ES.map((c) => c.text))).toEqual([]);
  });
});
