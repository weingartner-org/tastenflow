/**
 * Prüfungstexte der Tippchallenge, Niveau „+ punctuation", LERNWEG „en"
 * (E7b, Bauplan `BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md` §5/§10).
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien
 * (`texteSatzEnA.ts`, Nummern null bis sieben, und `texteSatzEnB.ts`,
 * Nummern acht bis vierzehn), damit zwei Läufe sie parallel schreiben
 * konnten, ohne einander zu überschreiben - siehe `texteSatzEnA.ts` für die
 * volle Begründung der Schreibregeln (Zeichenvorrat, Zeilenlänge,
 * Varianten-Neutralität). Der Wächter (`npm run pruefstand:schreibproben`)
 * prüft das Ergebnis.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteSatzEnA";
import { TEXTE_B } from "./texteSatzEnB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
