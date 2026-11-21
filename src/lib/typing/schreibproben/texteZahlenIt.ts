/**
 * Prüfungstexte der Sfida (Tippchallenge), Niveau „Con numeri" (`zahlen`),
 * LERNWEG „it".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteZahlenItA.ts` Nr. 0-7, `texteZahlenItB.ts` Nr. 8-14) - wie auf den
 * Wegen „de", „en", „fr" und „es". Die Schreibregeln des Niveaus und die
 * Zahlschreibweise stehen im Kopf von `texteZahlenItA.ts`, der Wächter ist
 * `tests/tastenflow-reto-it-zahlen.test.ts`, die Belege stehen in
 * `BEFUND-2026-10-02-IT-RETO-ZAHLEN.md`.
 *
 * ★ IT-RETO-VERDRAHTEN (03.10.2026): inzwischen EINGEHÄNGT (`IT_NIVEAUS_GEFUELLT`, `ladeTexte`, Prüfskript für
 *   Weg „it" scharf) - der folgende Satz beschreibt den Stand davor. Befund: BEFUND-2026-10-02-IT-RETO-VERDRAHTET.md.
 * ⚠️ NOCH NICHT EINGEHÄNGT: `ladeTexte` (`index.ts`) und `niveauHatBank`
 * (`schreibprobe.ts`) kennen diese Bank noch nicht - das macht ein eigener
 * Auftrag (Verdrahtung des Weges „it").
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteZahlenItA";
import { TEXTE_B } from "./texteZahlenItB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
