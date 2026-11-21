/**
 * ★★★ DAS SPRACHPAKET „it" (Italienisch) - alle Tastenflow-Texte dieser Sprache, die erst geladen werden, wenn ein Kind
 * sie braucht (G2a 02.10.2026 leer, F5-F8 02.10.2026: Lexikon-Nachtrag gefüllt).
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur
 * Datendateien und Typen - sonst bekäme es bei jeder Code-Änderung einen neuen Namen (`scripts/buendel-aufteilung.ts`).
 * Welche Pakete ein Weg braucht: `sprachPaketeFuer` in `sprachpaketBedarf.ts`.
 *
 * Inhalt heute:
 *  · `korpus`: LEER (Text-Chargen T1-T9 folgen, siehe `corpusIt.ts`) - der Weg übt bis dahin mit dem Wort-Drill des
 *    Generators (`wordsIt.ts`, im festen Paket `tf-fest-it`), nie mit deutschen oder englischen Sätzen.
 *  · `serien`: `SERIEN_IT` (IT-S, 03.10.2026: Sammelstelle `serienIt.ts`; die drei Chargen sind noch Stubs und werden gefüllt).
 *  · `lexikon`: das Wortfach der Sprachausgabe (`lexikonNachtragIt.ts`), damit echte italienische Wörter beim Vorlesen GANZ
 *    gesprochen werden statt buchstabiert (Falle 58: Lexikon VOR den Texten).
 *
 * ⚠️ Die Reihenfolge von `korpus` ist die Reihenfolge des Zusammenführens in `corpus.ts` (`mergeCorpus`, der erste Eintrag
 *    gewinnt) - Neues HINTEN anhängen und den Korpus-Anker neu erzeugen (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 * ⚠️ Eine Serien-Liste gehört ZUSÄTZLICH in `SERIEN_FOLGE` (serien.ts) - der Wächter `tests/sprachpakete-inhalt.test.ts`
 *    meldet, wenn sie fehlt.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_IT } from "./corpusIt";
import { NACHTRAG_IT } from "./lexikonNachtragIt";
import { SERIEN_IT } from "./serienIt";

export const SPRACHPAKET_IT: SprachDaten = {
  korpus: CORPUS_IT,
  serien: {
    SERIEN_IT,
  },
  lexikon: [NACHTRAG_IT],
};
