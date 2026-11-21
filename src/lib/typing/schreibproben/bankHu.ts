/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TIPPCHALLENGE-BANK DES WEGES „hu" (Ungarisch).
 *
 * Vorbild cs (7 Bänke × 15 Texte: start, gross, buchstaben, satz, zahlen, alles, code; Dateien `texte<Niveau>Cs(.ts, A, B)`, Erzeuger
 * `scripts/erzeuge-schreibproben-{start,gross,woerter}-cs.mts`, Vorlese-Wörter `woerterCs.ts`). Je fertige Bank EINE Zeile unten, z. B.
 *   `start: async () => (await import("./texteStartHu")).TEXTE,`
 * und `woerter: async () => (await import("./woerterHu")).WOERTER_HU,`. Der Pfad steht ausgeschrieben (Vite).
 * Verteiler: `geruestBanken.ts` ⇒ `index.ts`, `schreibprobe.ts`. Wächter: `tests/tastenflow-reto-hu-*.test.ts` (Vorbild
 * `tastenflow-reto-cs-verdrahtet`), Prüfer `scripts/pruefe-schreibproben.mts` (`WEGE_OHNE_EIGENE_BANK` nachziehen).
 *
 * ★ W3 (30.10.2026): alle sieben Bänke eingehängt, kein Rückfall mehr. Wächter `tests/tastenflow-reto-hu.test.ts`, Befund `BEFUND-2026-10-30-W3-HU-NL-RO.md`.
 */
import type { GeruestBank } from "./geruestBanken";

export const BANK_HU: GeruestBank = {
  texte: {
    start: async () => (await import("./texteStartHu")).TEXTE,
    gross: async () => (await import("./texteGrossHu")).TEXTE,
    buchstaben: async () => (await import("./texteBuchstabenHu")).TEXTE,
    satz: async () => (await import("./texteSatzHu")).TEXTE,
    zahlen: async () => (await import("./texteZahlenHu")).TEXTE,
    alles: async () => (await import("./texteAllesHu")).TEXTE,
    code: async () => (await import("./texteCodeHu")).TEXTE,
  },
  woerter: async () => (await import("./woerterHu")).WOERTER_HU,
};
