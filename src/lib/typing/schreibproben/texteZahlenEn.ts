/**
 * Prüfungstexte der Tippchallenge, Niveau „+ numbers", LERNWEG „en"
 * (E7b, 24.09.2026, Bauplan `BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md`
 * §5.1/§5.2/§10).
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien, damit
 * zwei Läufe sie parallel schreiben konnten, ohne einander zu überschreiben -
 * siehe `texteZahlenEnA.ts` (Nummern 0 bis 7) für die volle Begründung der
 * Schreibregeln, `texteZahlenEnB.ts` für die zweite Hälfte (8 bis 14). Der
 * Wächter (`npm run pruefstand:schreibproben`) prüft das Ergebnis.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteZahlenEnA";
import { TEXTE_B } from "./texteZahlenEnB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
