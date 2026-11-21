/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TIPPCHALLENGE-BANK DES WEGES „bg" (Bulgarisch).
 *
 * Vorbild cs (7 Bänke × 15 Texte: start, gross, buchstaben, satz, zahlen, alles, code; Dateien `texte<Niveau>Cs(.ts, A, B)`, Erzeuger
 * `scripts/erzeuge-schreibproben-{start,gross,woerter}-cs.mts`, Vorlese-Wörter `woerterCs.ts`). Je fertige Bank EINE Zeile unten, z. B.
 *   `start: async () => (await import("./texteStartBg")).TEXTE,`
 * und `woerter: async () => (await import("./woerterBg")).WOERTER_BG,`. Der Pfad steht ausgeschrieben (Vite).
 * Verteiler: `geruestBanken.ts` ⇒ `index.ts`, `schreibprobe.ts`. Wächter: `tests/tastenflow-reto-bg-*.test.ts` (Vorbild
 * `tastenflow-reto-cs-verdrahtet`), Prüfer `scripts/pruefe-schreibproben.mts` (`WEGE_OHNE_EIGENE_BANK` nachziehen).
 *
 * ★ W3 (30.10.2026): alle sieben Niveaus eingehängt; es gilt NUR noch die eigene Bank.
 */
import type { GeruestBank } from "./geruestBanken";

export const BANK_BG: GeruestBank = {
  texte: {
    start: async () => (await import("./texteStartBg")).TEXTE,
    gross: async () => (await import("./texteGrossBg")).TEXTE,
    buchstaben: async () => (await import("./texteBuchstabenBg")).TEXTE,
    satz: async () => (await import("./texteSatzBg")).TEXTE,
    zahlen: async () => (await import("./texteZahlenBg")).TEXTE,
    alles: async () => (await import("./texteAllesBg")).TEXTE,
    code: async () => (await import("./texteCodeBg")).TEXTE,
  },
  woerter: async () => (await import("./woerterBg")).WOERTER_BG,
};
