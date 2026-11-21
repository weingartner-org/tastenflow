/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TIPPCHALLENGE-BANK DES WEGES „uk" (Ukrainisch).
 *
 * Vorbild cs (7 Bänke × 15 Texte: start, gross, buchstaben, satz, zahlen, alles, code; Dateien `texte<Niveau>Cs(.ts, A, B)`, Erzeuger
 * `scripts/erzeuge-schreibproben-{start,gross,woerter}-cs.mts`, Vorlese-Wörter `woerterCs.ts`). Je fertige Bank EINE Zeile unten, z. B.
 *   `start: async () => (await import("./texteStartUk")).TEXTE,`
 * und `woerter: async () => (await import("./woerterUk")).WOERTER_UK,`. Der Pfad steht ausgeschrieben (Vite).
 * Verteiler: `geruestBanken.ts` ⇒ `index.ts`, `schreibprobe.ts`. Wächter: `tests/tastenflow-reto-uk-*.test.ts` (Vorbild
 * `tastenflow-reto-cs-verdrahtet`), Prüfer `scripts/pruefe-schreibproben.mts` (`WEGE_OHNE_EIGENE_BANK` nachziehen).
 *
 * ★ W3 (30.10.2026): alle sieben Niveaus eingehängt; es gilt NUR noch die eigene Bank.
 */
import type { GeruestBank } from "./geruestBanken";

export const BANK_UK: GeruestBank = {
  texte: {
    start: async () => (await import("./texteStartUk")).TEXTE,
    gross: async () => (await import("./texteGrossUk")).TEXTE,
    buchstaben: async () => (await import("./texteBuchstabenUk")).TEXTE,
    satz: async () => (await import("./texteSatzUk")).TEXTE,
    zahlen: async () => (await import("./texteZahlenUk")).TEXTE,
    alles: async () => (await import("./texteAllesUk")).TEXTE,
    code: async () => (await import("./texteCodeUk")).TEXTE,
  },
  woerter: async () => (await import("./woerterUk")).WOERTER_UK,
};
