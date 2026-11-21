/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TIPPCHALLENGE-BANK DES WEGES „pt" (Portugiesisch (Portugal)) - alle sieben Niveaus eingehängt (W3, 30.10.2026).
 *
 * Vorbild cs (7 Bänke × 15 Texte: start, gross, buchstaben, satz, zahlen, alles, code; Dateien `texte<Niveau>Cs(.ts, A, B)`, Erzeuger
 * `scripts/erzeuge-schreibproben-{start,gross,woerter}-cs.mts`, Vorlese-Wörter `woerterCs.ts`). Je fertige Bank EINE Zeile unten, z. B.
 *   `start: async () => (await import("./texteStartPt")).TEXTE,`
 * und `woerter: async () => (await import("./woerterPt")).WOERTER_PT,`. Der Pfad steht ausgeschrieben (Vite).
 * Verteiler: `geruestBanken.ts` ⇒ `index.ts`, `schreibprobe.ts`. Wächter: `tests/tastenflow-reto-pt-*.test.ts` (Vorbild
 * `tastenflow-reto-cs-verdrahtet`), Prüfer `scripts/pruefe-schreibproben.mts` (`WEGE_OHNE_EIGENE_BANK` nachziehen).
 */
import type { GeruestBank } from "./geruestBanken";

export const BANK_PT: GeruestBank = {
  texte: {
    start: async () => (await import("./texteStartPt")).TEXTE,
    gross: async () => (await import("./texteGrossPt")).TEXTE,
    buchstaben: async () => (await import("./texteBuchstabenPt")).TEXTE,
    satz: async () => (await import("./texteSatzPt")).TEXTE,
    zahlen: async () => (await import("./texteZahlenPt")).TEXTE,
    alles: async () => (await import("./texteAllesPt")).TEXTE,
    code: async () => (await import("./texteCodePt")).TEXTE,
  },
  woerter: async () => (await import("./woerterPt")).WOERTER_PT,
};
