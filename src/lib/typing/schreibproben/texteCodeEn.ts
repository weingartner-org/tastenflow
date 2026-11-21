/**
 * Prüfungstexte der Tippchallenge, Niveau „Programmcode", LERNWEG „en".
 *
 * Fügt nur zusammen - die Texte stehen in texteCodeEnA.ts (0-7) und
 * texteCodeEnB.ts (8-14), mit der vollen Erklärung im Kopf von A.
 * Der Wächter (scripts/pruefe-schreibproben.mts) prüft das Ergebnis.
 *
 * Diese Texte kommen im LEHRGANG NICHT VOR - siehe schreibproben/index.ts.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteCodeEnA";
import { TEXTE_B } from "./texteCodeEnB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
