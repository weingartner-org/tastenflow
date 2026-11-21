/**
 * Prüfungstexte des Reto (Tippchallenge), Niveau „Todas las letras"
 * (`buchstaben`), LERNWEG „es".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteBuchstabenEsA.ts` Nr. 0-7, `texteBuchstabenEsB.ts` Nr. 8-14) - wie
 * auf den Wegen „de", „en" und „fr". Die Schreibregeln des Niveaus stehen im
 * Kopf von `texteBuchstabenEsA.ts`, der Wächter ist
 * `tests/tastenflow-reto-es-buchstaben.test.ts`, die Belege stehen in
 * `BEFUND-2026-09-27-ES-RETO-BUCHSTABEN.md`.
 *
 * ★★★★★ ES-P7a-Behebung (27.09.2026, M7): jetzt EINGEHÄNGT - siehe
 * `index.ts` `ladeTexte` und `schreibprobe.ts` `ES_NIVEAUS_GEFUELLT`.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteBuchstabenEsA";
import { TEXTE_B } from "./texteBuchstabenEsB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
