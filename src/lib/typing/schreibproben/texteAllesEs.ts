/**
 * Prüfungstexte des Reto (Tippchallenge), Niveau „Todo" (`alles`), LERNWEG
 * „es".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteAllesEsA.ts` Nr. 0-7, `texteAllesEsB.ts` Nr. 8-14) - wie auf den
 * Wegen „de", „en" und „fr". Die Schreibregeln des Niveaus, der
 * Zeichenvorrat und die variantenneutrale Zahlschreibweise stehen im Kopf
 * von `texteAllesEsA.ts`, der Wächter ist
 * `tests/tastenflow-reto-es-alles.test.ts`, die Belege stehen in
 * `BEFUND-2026-09-27-ES-RETO-ALLES.md`.
 *
 * ★★★★★ ES-P7a-Behebung (27.09.2026, M7): jetzt EINGEHÄNGT - siehe
 * `index.ts` `ladeTexte` und `schreibprobe.ts` `ES_NIVEAUS_GEFUELLT`.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteAllesEsA";
import { TEXTE_B } from "./texteAllesEsB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
