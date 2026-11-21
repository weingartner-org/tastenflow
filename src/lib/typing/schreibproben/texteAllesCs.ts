/**
 * Prüfungstexte der Výzva (Tippchallenge, `PRUEFUNG_WORT_CS`), Niveau „Všechny klávesy" (`alles`), LERNWEG „cs".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien (`texteAllesCsA.ts` Nr. 0-7, `texteAllesCsB.ts`
 * Nr. 8-14) - wie auf den Wegen „de", „en", „fr", „es" und „it". Die Schreibregeln des Niveaus, der gemessene Zeichenvorrat und
 * die Zahlschreibweise stehen im Kopf von `texteAllesCsA.ts`, der Wächter ist `tests/tastenflow-reto-cs-alles.test.ts`, die
 * Belege der Vorlese-Wörter stehen in `scripts/belege-woerter-cs-alles.mts`.
 *
 * ⚠️ NOCH NICHT EINGEHÄNGT (CS-RETO, 10.10.2026): `ladeTexte` in `index.ts` und `CS_NIVEAUS_GEFUELLT` in `schreibprobe.ts` hängt der Chef ein.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteAllesCsA";
import { TEXTE_B } from "./texteAllesCsB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
