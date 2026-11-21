/**
 * Prüfungstexte der Výzva (Tippchallenge, `PRUEFUNG_WORT_CS`), Niveau „Všechna písmena"
 * (`buchstaben`), LERNWEG „cs".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien (`texteBuchstabenCsA.ts` Nr. 0-7,
 * `texteBuchstabenCsB.ts` Nr. 8-14) - wie auf den Wegen „de", „en", „fr", „es" und „it". Die Schreibregeln des
 * Niveaus stehen im Kopf von `texteBuchstabenCsA.ts`, der Wächter ist `tests/tastenflow-reto-cs-buchstaben.test.ts`.
 *
 * ⚠️ NOCH NICHT EINGEHÄNGT (10.10.2026): `index.ts` (`ladeTexte`) und `schreibprobe.ts` (`CS_NIVEAUS_GEFUELLT`)
 * kennen diese Bank nicht - das Einhängen macht der Chef.
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteBuchstabenCsA";
import { TEXTE_B } from "./texteBuchstabenCsB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
