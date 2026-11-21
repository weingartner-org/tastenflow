/**
 * Prüfungstexte der Yarışma (Tippchallenge, `PRUEFUNG_WORT_TR`), Niveau „Tüm harfler"
 * (`buchstaben`), LERNWEG „tr".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteBuchstabenTrA.ts` Nr. 0-7, `texteBuchstabenTrB.ts` Nr. 8-14) - wie auf den
 * Wegen „de", „en", „fr", „es" und „it". Die Schreibregeln des Niveaus stehen im Kopf von
 * `texteBuchstabenTrA.ts`, der Wächter ist `tests/tastenflow-reto-tr-buchstaben.test.ts`.
 *
 * ⚠️ EINGEHÄNGT (10.10.2026): `index.ts` (`ladeTexte`) und `schreibprobe.ts`
 * führen diese Bank, zusammen mit den anderen Niveaus des Weges „tr".
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteBuchstabenTrA";
import { TEXTE_B } from "./texteBuchstabenTrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
