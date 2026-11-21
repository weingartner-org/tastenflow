/**
 * ★★★ DAS SPRACHPAKET „el" (Griechisch) - LEER (G2-NEUN, 25.10.2026).
 *
 * Gerüst: Die Sprache ist im Code bekannt (`Lang`, `Lernweg`, `BedienSprache`), hat aber noch KEINEN Text. Bis dahin liefert sie
 * ausdrücklich NIE einen deutschen Text: sie fällt an den Stellen, an denen ein Wert gebraucht wird, auf Englisch zurück (Marke
 * `RÜCKFALL-EN (G2-NEUN)`), und Englisch kommt auf jedem Weg mit (`sprachpaketBedarf.ts`).
 *
 * ★ G3c-VERTEILER (25.10.2026): die drei Einhängepunkte sind angeschlossen - `korpus` aus `corpusEl.ts`, `serien` aus `serienEl.ts` (steht
 * auch in `SERIEN_FOLGE`), `lexikon` aus `lexikonNachtragEl.ts`. Alle drei sind leer; wer sie füllt, ändert DIESE Datei nicht.
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur Datendateien und Typen.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_EL } from "./corpusEl";
import { NACHTRAG_EL } from "./lexikonNachtragEl";
import { SERIEN_EL } from "./serienEl";

export const SPRACHPAKET_EL: SprachDaten = {
  korpus: CORPUS_EL,
  serien: {
    SERIEN_EL,
  },
  lexikon: [NACHTRAG_EL],
};
