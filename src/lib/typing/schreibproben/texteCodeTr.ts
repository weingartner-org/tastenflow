/**
 * Prüfungstexte der Yarışma (Tippchallenge), Niveau „Kod" (Programmcode,
 * `code`), LERNWEG „tr" (TR-Reto-Code, 10.10.2026).
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien
 * (`texteCodeTrA.ts`, Nummern null bis sieben, und `texteCodeTrB.ts`,
 * Nummern acht bis vierzehn) - wie bei den übrigen Niveaus und Wegen.
 * Aufbau, Herkunft (selbst geschrieben, jedes Programm ausgeführt) und Regeln
 * stehen im Kopf von `texteCodeTrA.ts`, der Wächter ist
 * `tests/tastenflow-reto-tr-code.test.ts`.
 *
 * ⚠️ EINGEHÄNGT (10.10.2026): `ladeTexte` in `index.ts` lädt diese Datei.
 * Eine andere Sprache darf dort NIE
 * still einspringen.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteCodeTrA";
import { TEXTE_B } from "./texteCodeTrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
