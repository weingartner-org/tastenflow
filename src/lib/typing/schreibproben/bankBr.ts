/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TIPPCHALLENGE-BANK DES WEGES „br" (Portugiesisch (Brasilien)) - alle sieben Niveaus eingehängt (W3, 30.10.2026).
 *
 * Vorbild cs (7 Bänke × 15 Texte: start, gross, buchstaben, satz, zahlen, alles, code; Dateien `texte<Niveau>Cs(.ts, A, B)`, Erzeuger
 * `scripts/erzeuge-schreibproben-{start,gross,woerter}-cs.mts`, Vorlese-Wörter `woerterCs.ts`). Je fertige Bank EINE Zeile unten, z. B.
 *   `start: async () => (await import("./texteStartBr")).TEXTE,`
 * und `woerter: async () => (await import("./woerterBr")).WOERTER_BR,`. Der Pfad steht ausgeschrieben (Vite).
 * Verteiler: `geruestBanken.ts` ⇒ `index.ts`, `schreibprobe.ts`. Wächter: `tests/tastenflow-reto-br-*.test.ts` (Vorbild
 * `tastenflow-reto-cs-verdrahtet`), Prüfer `scripts/pruefe-schreibproben.mts` (`WEGE_OHNE_EIGENE_BANK` nachziehen).
 */
import type { GeruestBank } from "./geruestBanken";

export const BANK_BR: GeruestBank = {
  texte: {
    start: async () => (await import("./texteStartBr")).TEXTE,
    gross: async () => (await import("./texteGrossBr")).TEXTE,
    buchstaben: async () => (await import("./texteBuchstabenBr")).TEXTE,
    satz: async () => (await import("./texteSatzBr")).TEXTE,
    zahlen: async () => (await import("./texteZahlenBr")).TEXTE,
    alles: async () => (await import("./texteAllesBr")).TEXTE,
    code: async () => (await import("./texteCodeBr")).TEXTE,
  },
  woerter: async () => (await import("./woerterBr")).WOERTER_BR,
};
