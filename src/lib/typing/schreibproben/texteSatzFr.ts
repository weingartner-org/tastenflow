/**
 * Prüfungstexte des Défi (Tippchallenge), Niveau „+ ponctuation" (`satz`),
 * LERNWEG „fr" (E13b-2, 26.09.2026, Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §7).
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien
 * (`texteSatzFrA.ts`, Nummern null bis sieben, und `texteSatzFrB.ts`,
 * Nummern acht bis vierzehn) - wie bei „en". Die Schreibregeln stehen im
 * Kopf von `texteSatzFrA.ts`; der Wächter (`npm run
 * pruefstand:schreibproben`) prüft das Ergebnis.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteSatzFrA";
import { TEXTE_B } from "./texteSatzFrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
