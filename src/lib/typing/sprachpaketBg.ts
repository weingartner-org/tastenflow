/**
 * ★★★ DAS SPRACHPAKET „bg" (Bulgarisch) - LEER (G2-NEUN, 25.10.2026).
 *
 * Gerüst: Die Sprache ist im Code bekannt (`Lang`, `Lernweg`, `BedienSprache`), hat aber noch KEINEN Text. Bis dahin liefert sie
 * ausdrücklich NIE einen deutschen Text: sie fällt an den Stellen, an denen ein Wert gebraucht wird, auf Englisch zurück (Marke
 * `RÜCKFALL-EN (G2-NEUN)`), und Englisch kommt auf jedem Weg mit (`sprachpaketBedarf.ts`).
 *
 * ★ G3c-VERTEILER (25.10.2026): die drei Einhängepunkte sind angeschlossen - `korpus` aus `corpusBg.ts`, `serien` aus `serienBg.ts` (steht
 * auch in `SERIEN_FOLGE`), `lexikon` aus `lexikonNachtragBg.ts`. Alle drei sind leer; wer sie füllt, ändert DIESE Datei nicht.
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur Datendateien und Typen.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_BG } from "./corpusBg";
import { NACHTRAG_BG } from "./lexikonNachtragBg";
import { SERIEN_BG } from "./serienBg";

export const SPRACHPAKET_BG: SprachDaten = {
  korpus: CORPUS_BG,
  serien: {
    SERIEN_BG,
  },
  lexikon: [NACHTRAG_BG],
};
