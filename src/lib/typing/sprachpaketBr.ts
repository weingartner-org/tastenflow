/**
 * ★★★ DAS SPRACHPAKET „br" (Portugiesisch (Brasilien)) - LEER (G2-NEUN, 25.10.2026).
 *
 * Gerüst: Die Sprache ist im Code bekannt (`Lang`, `Lernweg`, `BedienSprache`), hat aber noch KEINEN Text. Bis dahin liefert sie
 * ausdrücklich NIE einen deutschen Text: sie fällt an den Stellen, an denen ein Wert gebraucht wird, auf Englisch zurück (Marke
 * `RÜCKFALL-EN (G2-NEUN)`), und Englisch kommt auf jedem Weg mit (`sprachpaketBedarf.ts`).
 *
 * ★ G3c-VERTEILER (25.10.2026): die drei Einhängepunkte sind angeschlossen - `korpus` aus `corpusBr.ts`, `serien` aus `serienBr.ts` (steht
 * auch in `SERIEN_FOLGE`), `lexikon` aus `lexikonNachtragBr.ts`. Alle drei sind leer; wer sie füllt, ändert DIESE Datei nicht.
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur Datendateien und Typen.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_BR } from "./corpusBr";
import { NACHTRAG_BR } from "./lexikonNachtragBr";
import { SERIEN_BR } from "./serienBr";

export const SPRACHPAKET_BR: SprachDaten = {
  korpus: CORPUS_BR,
  serien: {
    SERIEN_BR,
  },
  lexikon: [NACHTRAG_BR],
};
