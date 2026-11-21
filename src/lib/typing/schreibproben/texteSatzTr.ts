/**
 * Prüfungstexte der Yarışma (Tippchallenge), Niveau „Noktalama ile" (`satz`), LERNWEG „tr".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien (`texteSatzTrA.ts`
 * Nr. 0-7, `texteSatzTrB.ts` Nr. 8-14) - wie auf den Wegen „de", „en", „fr", „es" und „it".
 * Die Schreibregeln des Niveaus stehen im Kopf von `texteSatzTrA.ts`, der Wächter ist
 * `tests/tastenflow-reto-tr-satz.test.ts`.
 *
 * ⚠️ EINGEHÄNGT (TR-RETO, 10.10.2026).
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteSatzTrA";
import { TEXTE_B } from "./texteSatzTrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
