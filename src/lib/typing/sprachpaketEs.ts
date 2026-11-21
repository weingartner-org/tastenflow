/**
 * ★★★ DAS SPRACHPAKET „es" (Spanisch) - alle Tastenflow-Texte dieser Sprache,
 * die erst geladen werden, wenn ein Kind sie braucht (28.09.2026).
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es
 * ist ein DATENBLATT: Es importiert nur Datendateien und Typen - sonst bekäme
 * es bei jeder Code-Änderung einen neuen Namen (`scripts/buendel-aufteilung.ts`).
 * Welche Pakete ein Weg braucht: `sprachPaketeFuer` in `sprachpaketBedarf.ts`.
 *
 * ⚠️ Die Reihenfolge von `korpus` ist die Reihenfolge des Zusammenführens in
 *    `corpus.ts` (`mergeCorpus`, der erste Eintrag gewinnt) - Neues HINTEN
 *    anhängen und den Korpus-Anker neu erzeugen
 *    (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 * ⚠️ Eine neue Serien-Liste gehört ZUSÄTZLICH in `SERIEN_FOLGE` (serien.ts) -
 *    der Wächter `tests/sprachpakete-inhalt.test.ts` meldet, wenn sie fehlt.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_ES } from "./corpusEs";
import { SERIEN_ES } from "./serienEs";
import { NACHTRAG_ES, NACHTRAG_ES2 } from "./lexikonNachtragEs";

export const SPRACHPAKET_ES: SprachDaten = {
  korpus: CORPUS_ES,
  serien: {
    SERIEN_ES,
  },
  lexikon: [NACHTRAG_ES, NACHTRAG_ES2],
};
