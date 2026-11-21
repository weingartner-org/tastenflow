/**
 * ★★★ DAS SPRACHPAKET „cs" (Tschechisch) - alle Tastenflow-Texte dieser Sprache, die erst geladen werden, wenn ein Kind
 * sie braucht (G2a 02.10.2026 leer, F5-F8 03.10.2026: Korpus-Einhängepunkt und Lexikon-Nachtrag).
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur
 * Datendateien und Typen - sonst bekäme es bei jeder Code-Änderung einen neuen Namen (`scripts/buendel-aufteilung.ts`).
 * Welche Pakete ein Weg braucht: `sprachPaketeFuer` in `sprachpaketBedarf.ts`.
 *
 * Inhalt heute:
 *  · `korpus`: LEER (Text-Chargen folgen, siehe `corpusCs.ts`) - der Weg übt bis dahin mit dem Wort-Drill des Generators
 *    (`wordsCs.ts`, im festen Paket `tf-fest-cs`), nie mit englischen oder deutschen Sätzen.
 *  · `serien`: `SERIEN_CS` (CS-S, 09.10.2026: Sammelstelle `serienCs.ts` mit den Chargen Kinder, Jugend, Erwachsene).
 *  · `lexikon`: das Wortfach der Sprachausgabe (`lexikonNachtragCs.ts`), damit echte tschechische Wörter beim Vorlesen GANZ gesprochen werden
 *    statt buchstabiert (Falle 58: Lexikon VOR den Texten) - ⚠️ ohne Wörterbuch-Beleg, siehe den Kopf der Datei.
 *
 * ⚠️ Die Reihenfolge von `korpus` ist die Reihenfolge des Zusammenführens in `corpus.ts` (`mergeCorpus`, der erste Eintrag
 *    gewinnt) - Neues HINTEN anhängen und den Korpus-Anker neu erzeugen (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 * ⚠️ Eine Serien-Liste gehört ZUSÄTZLICH in `SERIEN_FOLGE` (serien.ts) - der Wächter `tests/sprachpakete-inhalt.test.ts`
 *    meldet, wenn sie fehlt.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_CS } from "./corpusCs";
import { NACHTRAG_CS } from "./lexikonNachtragCs";
import { SERIEN_CS } from "./serienCs";

export const SPRACHPAKET_CS: SprachDaten = {
  korpus: CORPUS_CS,
  serien: {
    SERIEN_CS,
  },
  lexikon: [NACHTRAG_CS],
};
