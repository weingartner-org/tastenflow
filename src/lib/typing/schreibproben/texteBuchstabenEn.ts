/**
 * Prüfungstexte der Tippchallenge, Niveau „All letters (with capitals)",
 * LERNWEG „en".
 *
 * Diese Datei fügt nur zusammen: Die 15 Texte stehen in zwei Teildateien
 * (`texteBuchstabenEnA.ts` Nr. 0-7, `texteBuchstabenEnB.ts` Nr. 8-14), damit
 * zwei Läufe sie parallel schreiben konnten, ohne einander zu überschreiben -
 * genau wie beim deutschen Weg (`texteBuchstaben.ts`).
 *
 * Geschrieben in E7b (Bauplan `BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md`
 * §5.1/§5.2, Schreib-Charge „Sonnet schreibt, Opus nimmt ab" -
 * `feedback_uebungen_nur_opus_agenten`). E7a hatte hier nur einen Platzhalter
 * hinterlassen ({@link import("../schreibprobe").EN_NIVEAUS_GEFUELLT} führte
 * „buchstaben" bis dahin nicht) - der Eintrag dort ist Sache der Übergabe,
 * die dieses Niveau als Bank freigibt (siehe deren §-Verweis).
 *
 * Der Wächter (`npm run pruefstand:schreibproben`) prüft das Ergebnis:
 * Umfang und Zeilenlänge, Zeichenvorrat des Weges „en", Varianten-neutrale
 * Rechtschreibung (Bauplan §5.2 Regel 2, D4), Vergleichbarkeit der 15 Texte
 * und - zeilenweise gegen den gesamten Korpus und alle Serien - dass keine
 * Zeile im Lehrgang selbst steht.
 *
 * ⚠️ Diese Texte kommen im LEHRGANG NICHT VOR - siehe `texteBuchstaben.ts`
 * (die deutsche Fassung) für die Begründung.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteBuchstabenEnA";
import { TEXTE_B } from "./texteBuchstabenEnB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
