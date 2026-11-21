/**
 * Prüfungstexte der Sfida (Tippchallenge, `PRUEFUNG_WORT_IT`), Niveau „Tutti i tasti" (`alles`),
 * LERNWEG „it".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien (`texteAllesItA.ts` Nr. 0-7,
 * `texteAllesItB.ts` Nr. 8-14) - wie auf den Wegen „de", „en", „fr" und „es". Die Schreibregeln des
 * Niveaus, der gemessene Zeichenvorrat und die Zahlschreibweise stehen im Kopf von `texteAllesItA.ts`,
 * der Wächter ist `tests/tastenflow-reto-it-alles.test.ts`, die Belege stehen in
 * `BEFUND-2026-10-02-IT-RETO-ALLES.md`.
 *
 * ★ IT-RETO-VERDRAHTEN (03.10.2026): inzwischen EINGEHÄNGT (`IT_NIVEAUS_GEFUELLT`, `ladeTexte`, Prüfskript für
 *   Weg „it" scharf) - der folgende Satz beschreibt den Stand davor. Befund: BEFUND-2026-10-02-IT-RETO-VERDRAHTET.md.
 * ⚠️ NOCH NICHT EINGEHÄNGT (02.10.2026): `ladeTexte` in `index.ts` und die Liste der gefüllten Niveaus
 * in `schreibprobe.ts` kennen den Weg „it" noch nicht - das macht ein eigener Auftrag (Verdrahter).
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteAllesItA";
import { TEXTE_B } from "./texteAllesItB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
