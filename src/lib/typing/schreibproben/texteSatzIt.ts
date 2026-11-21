/**
 * Prüfungstexte der Sfida (Tippchallenge), Niveau „Con punteggiatura"
 * (`satz`), LERNWEG „it".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteSatzItA.ts` Nr. 0-7, `texteSatzItB.ts` Nr. 8-14) - wie auf den
 * Wegen „de", „en", „fr" und „es". Die Schreibregeln des Niveaus stehen im
 * Kopf von `texteSatzItA.ts`, der Wächter ist
 * `tests/tastenflow-reto-it-satz.test.ts`, die Belege stehen in
 * `BEFUND-2026-10-02-IT-RETO-SATZ.md`.
 *
 * ★ IT-RETO-VERDRAHTEN (03.10.2026): inzwischen EINGEHÄNGT (`IT_NIVEAUS_GEFUELLT`, `ladeTexte`, Prüfskript für
 *   Weg „it" scharf) - der folgende Satz beschreibt den Stand davor. Befund: BEFUND-2026-10-02-IT-RETO-VERDRAHTET.md.
 * ⚠️ NOCH NICHT EINGEHÄNGT (03.10.2026): `ladeTexte` in `index.ts` kennt
 * Weg „it" noch nicht, und `schreibprobe.ts` hat noch keine Liste der
 * gefüllten Niveaus für „it". Das macht ein eigener Auftrag (Verdrahter).
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteSatzItA";
import { TEXTE_B } from "./texteSatzItB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
