/**
 * ★★★ DAS SPRACHPAKET „pt" (Portugiesisch (Portugal)) - LEER (G2-NEUN, 25.10.2026).
 *
 * Gerüst: Die Sprache ist im Code bekannt (`Lang`, `Lernweg`, `BedienSprache`), hat aber noch KEINEN Text. Bis dahin liefert sie
 * ausdrücklich NIE einen deutschen Text: sie fällt an den Stellen, an denen ein Wert gebraucht wird, auf Englisch zurück (Marke
 * `RÜCKFALL-EN (G2-NEUN)`), und Englisch kommt auf jedem Weg mit (`sprachpaketBedarf.ts`).
 *
 * ★ G3c-VERTEILER (25.10.2026): die drei Einhängepunkte sind angeschlossen - `korpus` aus `corpusPt.ts`, `serien` aus `serienPt.ts` (steht
 * auch in `SERIEN_FOLGE`), `lexikon` aus `lexikonNachtragPt.ts`. Alle drei sind leer; wer sie füllt, ändert DIESE Datei nicht.
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur Datendateien und Typen.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_PT } from "./corpusPt";
import { NACHTRAG_PT } from "./lexikonNachtragPt";
import { SERIEN_PT } from "./serienPt";

export const SPRACHPAKET_PT: SprachDaten = {
  korpus: CORPUS_PT,
  serien: {
    SERIEN_PT,
  },
  lexikon: [NACHTRAG_PT],
};
