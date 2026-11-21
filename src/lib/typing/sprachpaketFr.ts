/**
 * ★★★ DAS SPRACHPAKET „fr" (Französisch) - alle Tastenflow-Texte dieser Sprache,
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
import { CORPUS_FR_WEG_FRUEH } from "./corpusFrWegFrueh";
import { CORPUS_FR_MITTE } from "./corpusFrMitte";
import { CORPUS_FR_ENDE } from "./corpusFrEnde";
import { SERIEN_FR_WEG_FRUEH } from "./serienFrWegFrueh";
import { SERIEN_FR_MITTE } from "./serienFrMitte";
import { SERIEN_FR_ENDE } from "./serienFrEnde";
import { SERIEN_FR_ZUSATZ } from "./serienFrZusatz";
import { NACHTRAG_FR, NACHTRAG_FR_BINDESTRICH, NACHTRAG_FR2 } from "./lexikonNachtragFr";

export const SPRACHPAKET_FR: SprachDaten = {
  // ★ E9-kids / E9-ende-kids (26.09.2026): Sprossen 25-34 und ab der Punkt-Sprosse, HINTEN angehängt.
  korpus: [...CORPUS_FR_WEG_FRUEH, ...CORPUS_FR_MITTE, ...CORPUS_FR_ENDE],
  serien: {
    SERIEN_FR_WEG_FRUEH,
    SERIEN_FR_MITTE,
    SERIEN_FR_ENDE,
    SERIEN_FR_ZUSATZ,
  },
  lexikon: [NACHTRAG_FR, NACHTRAG_FR_BINDESTRICH, NACHTRAG_FR2],
};
