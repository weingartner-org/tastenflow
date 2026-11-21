/**
 * Prüfungstexte der Výzva (Tippchallenge), Niveau „S interpunkcí“ (`satz`), LERNWEG „cs“.
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien (`texteSatzCsA.ts` Nr. 0-7, `texteSatzCsB.ts`
 * Nr. 8-14) - wie auf den Wegen „de“, „en“, „fr“, „es“ und „it“. Die Schreibregeln des Niveaus stehen im Kopf von
 * `texteSatzCsA.ts`, der Wächter ist `tests/tastenflow-reto-cs-satz.test.ts`, die Belege der Vorlese-Wörter stehen in
 * `scripts/belege-woerter-cs-satz.mts`.
 *
 * ⚠️ NOCH NICHT EINGEHÄNGT (10.10.2026): `CS_NIVEAUS_GEFUELLT` und `ladeTexte` in `index.ts` kennen dieses Niveau noch nicht.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteSatzCsA";
import { TEXTE_B } from "./texteSatzCsB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
