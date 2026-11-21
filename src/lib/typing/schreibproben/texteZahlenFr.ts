/**
 * Prüfungstexte des Défi (Tippchallenge), Niveau „+ chiffres" (`zahlen`),
 * LERNWEG „fr" (E13b-3, 26.09.2026, Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §7).
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien
 * (`texteZahlenFrA.ts`, Nummern null bis sieben, und `texteZahlenFrB.ts`,
 * Nummern acht bis vierzehn) - wie bei „+ ponctuation". Die Schreibregeln
 * stehen im Kopf von `texteZahlenFrA.ts`; der Wächter (`npm run
 * pruefstand:schreibproben`) prüft das Ergebnis.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteZahlenFrA";
import { TEXTE_B } from "./texteZahlenFrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
