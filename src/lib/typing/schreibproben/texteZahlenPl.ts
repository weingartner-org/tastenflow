/**
 * Prüfungstexte des Wyzwanie (Tippchallenge), Niveau „Z cyframi"
 * (`zahlen`), LERNWEG „pl" (PL-RETO, 09.10.2026).
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteZahlenPlA.ts` Nr. 0-7, `texteZahlenPlB.ts` Nr. 8-14) - wie auf den
 * anderen Wegen. Die Schreibregeln des Niveaus stehen im Kopf von
 * `texteZahlenPlA.ts`, der Wächter ist `tests/tastenflow-reto-pl-zahlen.test.ts`,
 * die Belege stehen in `BEFUND-2026-10-09-PL-RETO.md`. Eingehängt über
 * `PL_NIVEAUS_GEFUELLT` (`schreibprobe.ts`) und `ladeTexte` (`index.ts`).
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteZahlenPlA";
import { TEXTE_B } from "./texteZahlenPlB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
