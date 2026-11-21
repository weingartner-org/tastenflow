/**
 * ★ G3c-VERTEILER (25.10.2026): DIE EINE SPERRLISTE FÜR WEG „bg" (Bulgarisch) - Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `sperrlisteCs.ts` (zwei Stufen): KERN (nie, nirgends - weder Wortliste noch Lexikon noch Pseudowort noch Text) und
 * WORTBASIS (Doppelsinn, gegen ein Kind, Themen, die ein Wortsalat nicht tragen soll - nicht in Übungswortlisten, nicht im
 * Vorlese-Lexikon, nicht als Pseudowort; in einem Text mit Zusammenhang erlaubt). Stämme sind Teilzeichenketten, klein, MIT
 * Diakritika; kurze Wörter, die in harmlosen Wörtern stecken, stehen als EXAKTE Formen (jede Beugung einzeln).
 * Quelle: Glossar der Sprache (iCloud `sprachen-2026-10-25/glossar/`), Hausregeln (nie gegen ein Kind, Person zuerst).
 *
 * Verteiler: `uebungsformen/hilfen.ts` (`erzeugtGesperrt`: Pyramide, Spiegelwörter …). Weitere Benutzer baut die Etappe der Sprache
 * ein (Pseudowörter in `generator.ts` - Schrift-Muster G3a/F6, Lexikon `lexicon.ts` - F8).
 * Wächter: `tests/tastenflow-lerndaten-bg.test.ts` (Fehltreffer namentlich nennen, Falle 93).
 *
 * ★ D-LERNDATEN (25.10.2026): erste Fassung aus `recherche-bg/texte-themen.md` §4 (Kategorien, ausdrücklich ohne Wortliste) und allgemeiner Sprachkenntnis. Sie ist BEWUSST klein und
 * vorsichtig (lieber eine exakte Form als ein Stamm, der Harmloses trifft) und ersetzt die Lese-Abnahme durch zwei Menschen mit
 * Bulgarisch als Erstsprache NICHT (Bauplan, Prüfbericht). Jeder Treffer in den Lerndaten steht namentlich im Wächter und im Befund.
 * Die Vergleichsform `klein` ist die einfache (`toLowerCase`); braucht die Sprache eine eigene (Falle 89), hier ändern.
 */

/** Stämme (Teilzeichenketten, klein, MIT Diakritika): jede Form, die sie enthält, ist überall gesperrt. Nur, wo der Stamm nichts Harmloses trifft. */
export const BG_SPERR_KERN_STAEMME: readonly string[] = [
  "путк", "курв", "шибан", "мръсниц",
];

/** Exakte Formen, überall gesperrt (kurze Wörter, die in harmlosen Wörtern stecken, stehen hier statt bei den Stämmen). */
export const BG_SPERR_KERN_WOERTER: readonly string[] = [
  "еба", "ебе", "ебеш", "ебал", "ебала", "ебан", "ебана", "кур", "кура", "пичка", "пички", "гъз", "гъза", "лайно", "лайна", "хуй",
  "педераст",
];

/** Stämme der Wortbasis (nicht in Wortlisten, Lexikon, Pseudowörtern; im Text mit Zusammenhang erlaubt). */
export const BG_SPERR_WORTBASIS_STAEMME: readonly string[] = [
  "идиот", "дебил", "малоум",
];

/** Exakte Formen der Wortbasis: Wörter gegen ein Kind, gegen Menschen mit Behinderung oder gegen Gruppen, Gewalt und Rausch. */
export const BG_SPERR_WORTBASIS: readonly string[] = [
  "глупак", "глупачка", "тъпак", "тъпачка", "кретен", "кретенка", "убиец", "убийца", "убие", "убил", "убила", "убит", "ракия",
  "водка", "алкохол", "циганин", "циганка", "цигани",
];

function klein(wort: string): string {
  return wort.normalize("NFC").toLowerCase();
}

const KERN_EXAKT: ReadonlySet<string> = new Set(BG_SPERR_KERN_WOERTER);
const WORTBASIS_EXAKT: ReadonlySet<string> = new Set(BG_SPERR_WORTBASIS);

/** Ist dieses Wort für Kinder überall gesperrt - auch in Texten? */
export function istKernGesperrtBg(wort: string): boolean {
  const k = klein(wort);
  if (KERN_EXAKT.has(k)) return true;
  return BG_SPERR_KERN_STAEMME.some((st) => k.includes(st));
}

/** Ist dieses Wort aus Übungswortlisten, Vorlese-Lexikon und Pseudowörtern ausgeschlossen? (Kern + Wortbasis.) */
export function gesperrtBg(wort: string): boolean {
  if (istKernGesperrtBg(wort)) return true;
  const k = klein(wort);
  if (WORTBASIS_EXAKT.has(k)) return true;
  return BG_SPERR_WORTBASIS_STAEMME.some((st) => k.includes(st));
}
