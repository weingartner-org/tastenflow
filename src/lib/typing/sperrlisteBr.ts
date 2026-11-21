/**
 * ★ G3c-VERTEILER (25.10.2026): DIE EINE SPERRLISTE FÜR WEG „br" (Portugiesisch (Brasilien)) - Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `sperrlisteCs.ts` (zwei Stufen): KERN (nie, nirgends - weder Wortliste noch Lexikon noch Pseudowort noch Text) und
 * WORTBASIS (Doppelsinn, gegen ein Kind, Themen, die ein Wortsalat nicht tragen soll - nicht in Übungswortlisten, nicht im
 * Vorlese-Lexikon, nicht als Pseudowort; in einem Text mit Zusammenhang erlaubt). Stämme sind Teilzeichenketten, klein, MIT
 * Diakritika; kurze Wörter, die in harmlosen Wörtern stecken, stehen als EXAKTE Formen (jede Beugung einzeln).
 * Quelle: Glossar der Sprache (iCloud `sprachen-2026-10-25/glossar/`), Hausregeln (nie gegen ein Kind, Person zuerst).
 *
 * Verteiler: `uebungsformen/hilfen.ts` (`erzeugtGesperrt`: Pyramide, Spiegelwörter …). Weitere Benutzer baut die Etappe der Sprache
 * ein (Pseudowörter in `generator.ts` - Schrift-Muster G3a/F6, Lexikon `lexicon.ts` - F8).
 * Wächter: `tests/tastenflow-lerndaten-br.test.ts` (Fehltreffer namentlich nennen, Falle 93).
 *
 * ★ D-LERNDATEN (25.10.2026): erste Fassung aus `recherche-pt/texte-themen.md` §5.3 und dem Prüfbericht der Recherche (*piroca, rola, rabo*). Sie ist BEWUSST klein und
 * vorsichtig (lieber eine exakte Form als ein Stamm, der Harmloses trifft) und ersetzt die Lese-Abnahme durch zwei Menschen mit
 * Portugiesisch (Brasilien) als Erstsprache NICHT (Bauplan, Prüfbericht). Jeder Treffer in den Lerndaten steht namentlich im Wächter und im Befund.
 * Die Vergleichsform `klein` ist die einfache (`toLowerCase`); braucht die Sprache eine eigene (Falle 89), hier ändern.
 */

/** Stämme (Teilzeichenketten, klein, MIT Diakritika): jede Form, die sie enthält, ist überall gesperrt. Nur, wo der Stamm nichts Harmloses trifft. */
export const BR_SPERR_KERN_STAEMME: readonly string[] = [
  "caralh", "fodid", "foder", "porra", "merda", "punheta", "buceta", "boceta", "xoxota", "cacete",
];

/** Exakte Formen, überall gesperrt (kurze Wörter, die in harmlosen Wörtern stecken, stehen hier statt bei den Stämmen). */
export const BR_SPERR_KERN_WOERTER: readonly string[] = [
  "foda", "fodas", "fode", "puta", "putas", "piroca", "cu", "cus", "bosta", "corno", "cornos", "viado", "viados",
];

/** Stämme der Wortbasis (nicht in Wortlisten, Lexikon, Pseudowörtern; im Text mit Zusammenhang erlaubt). */
export const BR_SPERR_WORTBASIS_STAEMME: readonly string[] = [
  "imbecil", "retardad", "mongoloid",
];

/** Exakte Formen der Wortbasis: Wörter gegen ein Kind, gegen Menschen mit Behinderung oder gegen Gruppen, Gewalt und Rausch. */
export const BR_SPERR_WORTBASIS: readonly string[] = [
  "idiota", "idiotas", "estúpido", "estúpida", "otário", "aleijado", "aleijada", "bicha", "rabo", "matar", "matou", "assassino",
  "assassina", "álcool",
];

function klein(wort: string): string {
  return wort.normalize("NFC").toLowerCase();
}

const KERN_EXAKT: ReadonlySet<string> = new Set(BR_SPERR_KERN_WOERTER);
const WORTBASIS_EXAKT: ReadonlySet<string> = new Set(BR_SPERR_WORTBASIS);

/** Ist dieses Wort für Kinder überall gesperrt - auch in Texten? */
export function istKernGesperrtBr(wort: string): boolean {
  const k = klein(wort);
  if (KERN_EXAKT.has(k)) return true;
  return BR_SPERR_KERN_STAEMME.some((st) => k.includes(st));
}

/** Ist dieses Wort aus Übungswortlisten, Vorlese-Lexikon und Pseudowörtern ausgeschlossen? (Kern + Wortbasis.) */
export function gesperrtBr(wort: string): boolean {
  if (istKernGesperrtBr(wort)) return true;
  const k = klein(wort);
  if (WORTBASIS_EXAKT.has(k)) return true;
  return BR_SPERR_WORTBASIS_STAEMME.some((st) => k.includes(st));
}
