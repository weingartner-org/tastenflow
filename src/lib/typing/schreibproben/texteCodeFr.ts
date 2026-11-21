/**
 * Prüfungstexte des Défi (Tippchallenge), Niveau „Code" (`code`), LERNWEG
 * „fr" (E13b-5, 26.09.2026, Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-
 * LEHRGANG.md` §7.1: „Programmcode mit französischen Kommentaren - eigene
 * Bank, griff-neutral").
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien
 * (`texteCodeFrA.ts`, Nummern null bis sieben, und `texteCodeFrB.ts`,
 * Nummern acht bis vierzehn) - wie bei den übrigen Niveaus. Aufbau, Herkunft
 * (selbst geschrieben, jedes Programm ausgeführt) und Regeln stehen im Kopf
 * von `texteCodeFrA.ts`. „de"s Bank darf hier NIE still einspringen (Falle,
 * siehe `dateiName()` in `scripts/pruefe-schreibproben.mts`).
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteCodeFrA";
import { TEXTE_B } from "./texteCodeFrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
