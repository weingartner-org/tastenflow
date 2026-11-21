/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TIPPCHALLENGE-BANK DES WEGES „el" (Griechisch).
 *
 * Vorbild cs (7 Bänke × 15 Texte: start, gross, buchstaben, satz, zahlen, alles, code; Dateien `texte<Niveau>Cs(.ts, A, B)`, Erzeuger
 * `scripts/erzeuge-schreibproben-{start,gross,woerter}-cs.mts`, Vorlese-Wörter `woerterCs.ts`). Je fertige Bank EINE Zeile unten, z. B.
 *   `start: async () => (await import("./texteStartEl")).TEXTE,`
 * und `woerter: async () => (await import("./woerterEl")).WOERTER_EL,`. Der Pfad steht ausgeschrieben (Vite).
 * Verteiler: `geruestBanken.ts` ⇒ `index.ts`, `schreibprobe.ts`. Wächter: `tests/tastenflow-reto-el-*.test.ts` (Vorbild
 * `tastenflow-reto-cs-verdrahtet`), Prüfer `scripts/pruefe-schreibproben.mts` (`WEGE_OHNE_EIGENE_BANK` nachziehen).
 *
 * ★ W3 (30.10.2026): alle sieben Niveaus eingehängt; es gilt NUR noch die eigene Bank.
 */
import type { GeruestBank } from "./geruestBanken";

export const BANK_EL: GeruestBank = {
  texte: {
    start: async () => (await import("./texteStartEl")).TEXTE,
    gross: async () => (await import("./texteGrossEl")).TEXTE,
    buchstaben: async () => (await import("./texteBuchstabenEl")).TEXTE,
    satz: async () => (await import("./texteSatzEl")).TEXTE,
    zahlen: async () => (await import("./texteZahlenEl")).TEXTE,
    alles: async () => (await import("./texteAllesEl")).TEXTE,
    code: async () => (await import("./texteCodeEl")).TEXTE,
  },
  woerter: async () => (await import("./woerterEl")).WOERTER_EL,
};
