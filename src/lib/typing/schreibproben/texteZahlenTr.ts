/**
 * Prüfungstexte der Yarışma (Tippchallenge), Niveau „Sayılarla" (`zahlen`),
 * LERNWEG „tr".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteZahlenTrA.ts` Nr. 0-7, `texteZahlenTrB.ts` Nr. 8-14) - wie auf den
 * Wegen „de", „en", „fr", „es" und „it". Die Schreibregeln des Niveaus und die
 * Zahlschreibweise stehen im Kopf von `texteZahlenTrA.ts`, der Wächter ist
 * `tests/tastenflow-reto-tr-zahlen.test.ts`.
 *
 * ⚠️ EINGEHÄNGT (10.10.2026): `ladeTexte` (`index.ts`) und `niveauHatBank`
 * (`schreibprobe.ts`) führen diese Bank (TR-RETO).
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteZahlenTrA";
import { TEXTE_B } from "./texteZahlenTrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
