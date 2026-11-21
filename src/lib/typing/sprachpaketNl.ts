/**
 * ★★★ DAS SPRACHPAKET „nl" (Niederländisch) - LEER (G2-NEUN, 25.10.2026).
 *
 * Gerüst: Die Sprache ist im Code bekannt (`Lang`, `Lernweg`, `BedienSprache`), hat aber noch KEINEN Text. Bis dahin liefert sie
 * ausdrücklich NIE einen deutschen Text: sie fällt an den Stellen, an denen ein Wert gebraucht wird, auf Englisch zurück (Marke
 * `RÜCKFALL-EN (G2-NEUN)`), und Englisch kommt auf jedem Weg mit (`sprachpaketBedarf.ts`).
 *
 * ★ G3c-VERTEILER (25.10.2026): die drei Einhängepunkte sind angeschlossen - `korpus` aus `corpusNl.ts`, `serien` aus `serienNl.ts` (steht
 * auch in `SERIEN_FOLGE`), `lexikon` aus `lexikonNachtragNl.ts`. Alle drei sind leer; wer sie füllt, ändert DIESE Datei nicht.
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur Datendateien und Typen.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_NL } from "./corpusNl";
import { NACHTRAG_NL } from "./lexikonNachtragNl";
import { SERIEN_NL } from "./serienNl";

export const SPRACHPAKET_NL: SprachDaten = {
  korpus: CORPUS_NL,
  serien: {
    SERIEN_NL,
  },
  lexikon: [NACHTRAG_NL],
};
