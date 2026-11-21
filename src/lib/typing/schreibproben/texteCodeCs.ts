/**
 * Prüfungstexte der Výzva (Tippchallenge), Niveau „Kód" (`code`), LERNWEG „cs" (CS-Reto-Code, 10.10.2026).
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien (`texteCodeCsA.ts`, Nummern null bis
 * sieben, und `texteCodeCsB.ts`, Nummern acht bis vierzehn) - wie bei den übrigen Niveaus und Wegen. Aufbau,
 * Herkunft und Regeln stehen im Kopf von `texteCodeCsA.ts`, der Wächter ist
 * `tests/tastenflow-reto-cs-code.test.ts`.
 * ⚠️ NOCH NICHT EINGEHÄNGT: `ladeTexte` in `index.ts` kennt diese Datei noch nicht - das macht der Chef.
 * Eine andere Sprache darf dort NIE still einspringen.
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteCodeCsA";
import { TEXTE_B } from "./texteCodeCsB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
