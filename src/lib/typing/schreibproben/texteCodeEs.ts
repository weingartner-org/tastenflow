/**
 * Prüfungstexte des Reto (Tippchallenge), Niveau „Código informático"
 * (`code`), LERNWEG „es" (ES-Reto-Code, 27.09.2026, Bauplan
 * `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §6).
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien
 * (`texteCodeEsA.ts`, Nummern null bis sieben, und `texteCodeEsB.ts`,
 * Nummern acht bis vierzehn) - wie bei den übrigen Niveaus und Wegen.
 * Aufbau, Herkunft (selbst geschrieben, jedes Programm ausgeführt) und Regeln
 * stehen im Kopf von `texteCodeEsA.ts`, der Wächter ist
 * `tests/tastenflow-reto-es-code.test.ts`, die Belege stehen in
 * `BEFUND-2026-09-27-ES-RETO-CODE.md`. Eine andere Sprache darf hier NIE
 * still einspringen (siehe `ladeTexte` in `index.ts`).
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteCodeEsA";
import { TEXTE_B } from "./texteCodeEsB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
