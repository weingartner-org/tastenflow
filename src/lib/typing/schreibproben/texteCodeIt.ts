/**
 * Prüfungstexte der Sfida (Tippchallenge), Niveau „Codice informatico"
 * (`code`), LERNWEG „it" (IT-Reto-Code, 02.10.2026).
 *
 * Diese Datei fügt nur zusammen: Die Texte stehen in zwei Teildateien
 * (`texteCodeItA.ts`, Nummern null bis sieben, und `texteCodeItB.ts`,
 * Nummern acht bis vierzehn) - wie bei den übrigen Niveaus und Wegen.
 * Aufbau, Herkunft (selbst geschrieben, jedes Programm ausgeführt) und Regeln
 * stehen im Kopf von `texteCodeItA.ts`, der Wächter ist
 * `tests/tastenflow-reto-it-code.test.ts`, die Belege stehen in
 * `BEFUND-2026-10-02-IT-RETO-CODE.md`.
 *
 * ★ IT-RETO-VERDRAHTEN (03.10.2026): inzwischen EINGEHÄNGT (`IT_NIVEAUS_GEFUELLT`, `ladeTexte`, Prüfskript für
 *   Weg „it" scharf) - der folgende Satz beschreibt den Stand davor. Befund: BEFUND-2026-10-02-IT-RETO-VERDRAHTET.md.
 * ⚠️ NOCH NICHT EINGEHÄNGT: `ladeTexte` in `index.ts` kennt diese Datei noch
 * nicht - das Einhängen ist ein eigener Auftrag. Eine andere Sprache darf
 * dort NIE still einspringen.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteCodeItA";
import { TEXTE_B } from "./texteCodeItB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
