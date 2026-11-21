/**
 * ★★★ DAS SPRACHPAKET „sv" (Schwedisch) - LEER (G2-NEUN, 25.10.2026).
 *
 * Gerüst: Die Sprache ist im Code bekannt (`Lang`, `Lernweg`, `BedienSprache`), hat aber noch KEINEN Text. Bis dahin liefert sie
 * ausdrücklich NIE einen deutschen Text: sie fällt an den Stellen, an denen ein Wert gebraucht wird, auf Englisch zurück (Marke
 * `RÜCKFALL-EN (G2-NEUN)`), und Englisch kommt auf jedem Weg mit (`sprachpaketBedarf.ts`).
 *
 * ★ G3c-VERTEILER (25.10.2026): die drei Einhängepunkte sind angeschlossen - `korpus` aus `corpusSv.ts`, `serien` aus `serienSv.ts` (steht
 * auch in `SERIEN_FOLGE`), `lexikon` aus `lexikonNachtragSv.ts`. Alle drei sind leer; wer sie füllt, ändert DIESE Datei nicht.
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur Datendateien und Typen.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_SV } from "./corpusSv";
import { NACHTRAG_SV } from "./lexikonNachtragSv";
import { SERIEN_SV } from "./serienSv";

export const SPRACHPAKET_SV: SprachDaten = {
  korpus: CORPUS_SV,
  serien: {
    SERIEN_SV,
  },
  lexikon: [NACHTRAG_SV],
};
