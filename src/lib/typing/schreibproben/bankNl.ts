/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TIPPCHALLENGE-BANK DES WEGES „nl" (Niederländisch).
 *
 * Vorbild cs (7 Bänke × 15 Texte: start, gross, buchstaben, satz, zahlen, alles, code; Dateien `texte<Niveau>Cs(.ts, A, B)`, Erzeuger
 * `scripts/erzeuge-schreibproben-{start,gross,woerter}-cs.mts`, Vorlese-Wörter `woerterCs.ts`). Je fertige Bank EINE Zeile unten, z. B.
 *   `start: async () => (await import("./texteStartNl")).TEXTE,`
 * und `woerter: async () => (await import("./woerterNl")).WOERTER_NL,`. Der Pfad steht ausgeschrieben (Vite).
 * Verteiler: `geruestBanken.ts` ⇒ `index.ts`, `schreibprobe.ts`. Wächter: `tests/tastenflow-reto-nl-*.test.ts` (Vorbild
 * `tastenflow-reto-cs-verdrahtet`), Prüfer `scripts/pruefe-schreibproben.mts` (`WEGE_OHNE_EIGENE_BANK` nachziehen).
 *
 * ★ W3 (30.10.2026): alle sieben Bänke eingehängt, kein Rückfall mehr. Wächter `tests/tastenflow-reto-nl.test.ts`, Befund `BEFUND-2026-10-30-W3-HU-NL-RO.md`.
 */
import type { GeruestBank } from "./geruestBanken";

export const BANK_NL: GeruestBank = {
  texte: {
    start: async () => (await import("./texteStartNl")).TEXTE,
    gross: async () => (await import("./texteGrossNl")).TEXTE,
    buchstaben: async () => (await import("./texteBuchstabenNl")).TEXTE,
    satz: async () => (await import("./texteSatzNl")).TEXTE,
    zahlen: async () => (await import("./texteZahlenNl")).TEXTE,
    alles: async () => (await import("./texteAllesNl")).TEXTE,
    code: async () => (await import("./texteCodeNl")).TEXTE,
  },
  woerter: async () => (await import("./woerterNl")).WOERTER_NL,
};
