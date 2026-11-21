/**
 * Prüfungstexte der Výzva (Tippchallenge), Niveau „S číslicemi" (`zahlen`), LERNWEG „cs".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien (`texteZahlenCsA.ts` Nr. 0-7,
 * `texteZahlenCsB.ts` Nr. 8-14) - wie auf den Wegen „de", „en", „fr", „es" und „it". Schreibregeln und Zahlschreibweise
 * stehen im Kopf von `texteZahlenCsA.ts`, der Wächter ist `tests/tastenflow-reto-cs-zahlen.test.ts`.
 *
 * ⚠️ NOCH NICHT EINGEHÄNGT: `ladeTexte` (`index.ts`) kennt diese Bank erst nach dem Einhängen durch den Chef.
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteZahlenCsA";
import { TEXTE_B } from "./texteZahlenCsB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
