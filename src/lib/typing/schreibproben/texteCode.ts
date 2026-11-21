/**
 * Prüfungstexte der Tippchallenge, Niveau „Programmcode".
 *
 * Diese Datei fügt nur zusammen - die Texte stehen in zwei Teildateien.
 * Der Wächter (`npm run pruefstand:schreibproben`) prüft das Ergebnis.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteCodeA";
import { TEXTE_B } from "./texteCodeB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
