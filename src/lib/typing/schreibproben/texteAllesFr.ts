/**
 * Prüfungstexte des Défi (Tippchallenge), Niveau „Toutes les touches"
 * (`alles`), LERNWEG „fr" (E13b-4, 26.09.2026, Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §7.1: „+ Sonderzeichen, nur
 * solche mit Griff auf allen Pflicht-Tastaturen").
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien
 * (`texteAllesFrA.ts`, Nummern null bis sieben, und `texteAllesFrB.ts`,
 * Nummern acht bis vierzehn) - wie bei „+ ponctuation" und „+ chiffres". Die
 * Schreibregeln stehen im Kopf von `texteAllesFrA.ts`; der Wächter (`npm run
 * pruefstand:schreibproben`) prüft das Ergebnis.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteAllesFrA";
import { TEXTE_B } from "./texteAllesFrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
