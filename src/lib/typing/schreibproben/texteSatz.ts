/**
 * Prüfungstexte der Schreibprobe, Niveau „Satz".
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien, damit
 * zwei Läufe sie parallel schreiben konnten, ohne einander zu überschreiben.
 * Der Wächter (`npm run pruefstand:schreibproben`) prüft das Ergebnis.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteSatzA";
import { TEXTE_B } from "./texteSatzB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
