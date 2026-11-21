/**
 * Prüfungstexte der Sfida (Tippchallenge, `PRUEFUNG_WORT_IT`), Niveau „Tutte
 * le lettere" (`buchstaben`), LERNWEG „it".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteBuchstabenItA.ts` Nr. 0-7, `texteBuchstabenItB.ts` Nr. 8-14) - wie
 * auf den Wegen „de", „en", „fr" und „es". Die Schreibregeln des Niveaus stehen
 * im Kopf von `texteBuchstabenItA.ts`, der Wächter ist
 * `tests/tastenflow-reto-it-buchstaben.test.ts`, die Belege stehen in
 * `BEFUND-2026-10-02-IT-RETO-BUCHSTABEN.md`.
 *
 * ★ IT-RETO-VERDRAHTEN (03.10.2026): inzwischen EINGEHÄNGT (`IT_NIVEAUS_GEFUELLT`, `ladeTexte`, Prüfskript für
 *   Weg „it" scharf) - der folgende Satz beschreibt den Stand davor. Befund: BEFUND-2026-10-02-IT-RETO-VERDRAHTET.md.
 * ⚠️ NOCH NICHT EINGEHÄNGT (03.10.2026): `index.ts` (`ladeTexte`) und
 * `schreibprobe.ts` kennen diese Bank nicht - das Einhängen macht ein eigener
 * Auftrag (Verdrahter), zusammen mit den anderen Niveaus des Weges „it".
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteBuchstabenItA";
import { TEXTE_B } from "./texteBuchstabenItB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
