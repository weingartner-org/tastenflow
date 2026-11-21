/**
 * ★★★ DAS SPRACHPAKET „tr" (Türkisch) - alle Tastenflow-Texte dieser Sprache, die erst geladen werden, wenn ein Kind sie braucht
 * (G2a 02.10.2026 leer, F5-F8 03.10.2026: Lexikon-Nachtrag gefüllt).
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur
 * Datendateien und Typen - sonst bekäme es bei jeder Code-Änderung einen neuen Namen (`scripts/buendel-aufteilung.ts`).
 * Welche Pakete ein Weg braucht: `sprachPaketeFuer` in `sprachpaketBedarf.ts`.
 *
 * Inhalt heute:
 *  · `korpus`: LEER (Text-Chargen der Etappe T folgen, siehe `corpusTr.ts`) - der Weg übt bis dahin mit dem Wort-Drill des
 *    Generators (`wordsTr.ts`, im festen Paket `tf-fest-tr`), nie mit deutschen oder englischen Sätzen.
 *  · `serien`: `SERIEN_TR` (TR-S, 09.10.2026: Sammelstelle `serienTr.ts`; Kinder, Jugend, Erwachsene je eine erste Charge).
 *  · `lexikon`: das Wortfach der Sprachausgabe (`lexikonNachtragTr.ts`), damit echte türkische Wörter beim Vorlesen GANZ
 *    gesprochen werden statt buchstabiert (Falle 58: Lexikon VOR den Texten).
 *
 * ⚠️ Die Reihenfolge von `korpus` ist die Reihenfolge des Zusammenführens in `corpus.ts` (`mergeCorpus`, der erste Eintrag
 *    gewinnt) - Neues HINTEN anhängen und den Korpus-Anker neu erzeugen (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 * ⚠️ Eine Serien-Liste gehört ZUSÄTZLICH in `SERIEN_FOLGE` (serien.ts) - der Wächter `tests/sprachpakete-inhalt.test.ts`
 *    meldet, wenn sie fehlt.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_TR } from "./corpusTr";
import { NACHTRAG_TR } from "./lexikonNachtragTr";
import { SERIEN_TR } from "./serienTr";

export const SPRACHPAKET_TR: SprachDaten = {
  korpus: CORPUS_TR,
  serien: {
    SERIEN_TR,
  },
  lexikon: [NACHTRAG_TR],
};
