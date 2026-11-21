/**
 * Prüfungstexte der Yarışma (Tippchallenge, `PRUEFUNG_WORT_TR`), Niveau „Tüm tuşlar" (`alles`),
 * LERNWEG „tr".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien (`texteAllesTrA.ts` Nr. 0-7,
 * `texteAllesTrB.ts` Nr. 8-14) - wie auf den Wegen „de", „en", „fr", „es" und „it". Die Schreibregeln des
 * Niveaus, der gemessene Zeichenvorrat und die Zahlschreibweise stehen im Kopf von `texteAllesTrA.ts`,
 * der Wächter ist `tests/tastenflow-reto-tr-alles.test.ts`.
 *
 * ⚠️ EINGEHÄNGT (10.10.2026): `ladeTexte` in `index.ts` und `TR_NIVEAUS_GEFUELLT` in
 * `schreibprobe.ts` führen die Bank.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteAllesTrA";
import { TEXTE_B } from "./texteAllesTrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
