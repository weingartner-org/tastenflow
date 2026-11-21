/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TIPPCHALLENGE-BANK DES WEGES „sv" (Schwedisch) - alle sieben Niveaus eingehängt (W3, 30.10.2026).
 *
 * Vorbild cs (7 Bänke × 15 Texte: start, gross, buchstaben, satz, zahlen, alles, code; Dateien `texte<Niveau>Cs(.ts, A, B)`, Erzeuger
 * `scripts/erzeuge-schreibproben-{start,gross,woerter}-cs.mts`, Vorlese-Wörter `woerterCs.ts`). Je fertige Bank EINE Zeile unten, z. B.
 *   `start: async () => (await import("./texteStartSv")).TEXTE,`
 * und `woerter: async () => (await import("./woerterSv")).WOERTER_SV,`. Der Pfad steht ausgeschrieben (Vite).
 * Verteiler: `geruestBanken.ts` ⇒ `index.ts`, `schreibprobe.ts`. Wächter: `tests/tastenflow-reto-sv-*.test.ts` (Vorbild
 * `tastenflow-reto-cs-verdrahtet`), Prüfer `scripts/pruefe-schreibproben.mts` (`WEGE_OHNE_EIGENE_BANK` nachziehen).
 */
import type { GeruestBank } from "./geruestBanken";

export const BANK_SV: GeruestBank = {
  texte: {
    start: async () => (await import("./texteStartSv")).TEXTE,
    gross: async () => (await import("./texteGrossSv")).TEXTE,
    buchstaben: async () => (await import("./texteBuchstabenSv")).TEXTE,
    satz: async () => (await import("./texteSatzSv")).TEXTE,
    zahlen: async () => (await import("./texteZahlenSv")).TEXTE,
    alles: async () => (await import("./texteAllesSv")).TEXTE,
    code: async () => (await import("./texteCodeSv")).TEXTE,
  },
  woerter: async () => (await import("./woerterSv")).WOERTER_SV,
};
