/**
 * Prüfungstexte des Wyzwanie (Tippchallenge), Niveau „Z interpunkcją"
 * (`satz`), LERNWEG „pl" (PL-RETO, 09.10.2026).
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteSatzPlA.ts` Nr. 0-7, `texteSatzPlB.ts` Nr. 8-14) - wie auf den
 * anderen Wegen. Die Schreibregeln des Niveaus stehen im Kopf von
 * `texteSatzPlA.ts`, der Wächter ist `tests/tastenflow-reto-pl-satz.test.ts`,
 * die Belege stehen in `BEFUND-2026-10-09-PL-RETO.md`. Eingehängt über
 * `PL_NIVEAUS_GEFUELLT` (`schreibprobe.ts`) und `ladeTexte` (`index.ts`).
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteSatzPlA";
import { TEXTE_B } from "./texteSatzPlB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
