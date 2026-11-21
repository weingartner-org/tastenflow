/**
 * Prüfungstexte des Défi (Tippchallenge), Niveau „Toutes les lettres"
 * (`buchstaben`), LERNWEG „fr".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteBuchstabenFrA.ts` Nr. 0-7, `texteBuchstabenFrB.ts` Nr. 8-14) - wie
 * beim deutschen und englischen Weg (`texteBuchstaben.ts`,
 * `texteBuchstabenEn.ts`).
 *
 * ★ E13b-1 (26.09.2026, Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md`
 * §7.1/§7.2): E13a hatte hier nur einen leeren Platzhalter hinterlassen. Die
 * Texte sind auf Französisch neu geschrieben (§6.2) - die Schreibregeln des
 * Niveaus stehen im Kopf von `texteBuchstabenFrA.ts`; mit ihnen steht das
 * Niveau in {@link import("../schreibprobe").FR_NIVEAUS_GEFUELLT}.
 *
 * Der Wächter (`npm run pruefstand:schreibproben`) prüft das Ergebnis:
 * Umfang und Zeilenlänge, Zeichenvorrat des Weges „fr" (mit den Totasten-
 * Zeichen, siehe `vorratFuerPruefung` dort), Varianten- und Tastatur-
 * Neutralität, neue Rechtschreibung, Vergleichbarkeit der 15 Texte und -
 * zeilenweise gegen den gesamten Korpus und alle Serien -, dass keine Zeile im
 * Lehrgang selbst steht.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `index.ts`.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteBuchstabenFrA";
import { TEXTE_B } from "./texteBuchstabenFrB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
