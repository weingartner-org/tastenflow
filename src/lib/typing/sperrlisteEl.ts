/**
 * ★ G3c-VERTEILER (25.10.2026): DIE EINE SPERRLISTE FÜR WEG „el" (Griechisch) - Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `sperrlisteCs.ts` (zwei Stufen): KERN (nie, nirgends - weder Wortliste noch Lexikon noch Pseudowort noch Text) und
 * WORTBASIS (Doppelsinn, gegen ein Kind, Themen, die ein Wortsalat nicht tragen soll - nicht in Übungswortlisten, nicht im
 * Vorlese-Lexikon, nicht als Pseudowort; in einem Text mit Zusammenhang erlaubt). Stämme sind Teilzeichenketten, klein, MIT
 * Diakritika; kurze Wörter, die in harmlosen Wörtern stecken, stehen als EXAKTE Formen (jede Beugung einzeln).
 * Quelle: Glossar der Sprache (iCloud `sprachen-2026-10-25/glossar/`), Hausregeln (nie gegen ein Kind, Person zuerst).
 *
 * Verteiler: `uebungsformen/hilfen.ts` (`erzeugtGesperrt`: Pyramide, Spiegelwörter …). Weitere Benutzer baut die Etappe der Sprache
 * ein (Pseudowörter in `generator.ts` - Schrift-Muster G3a/F6, Lexikon `lexicon.ts` - F8).
 * Wächter: `tests/tastenflow-lerndaten-el.test.ts` (Fehltreffer namentlich nennen, Falle 93).
 *
 * ★ D-LERNDATEN (25.10.2026): erste Fassung aus `recherche-el/texte-themen.md` §7 und dem Prüfbericht der Recherche (harmlose Wörter mit vulgärem Anfang: Καβάλα, αρχιδούκας, μουντός, κώλυμα, πουτίγκα) und allgemeiner Sprachkenntnis. Sie ist BEWUSST klein und
 * vorsichtig (lieber eine exakte Form als ein Stamm, der Harmloses trifft) und ersetzt die Lese-Abnahme durch zwei Menschen mit
 * Griechisch als Erstsprache NICHT (Bauplan, Prüfbericht). Jeder Treffer in den Lerndaten steht namentlich im Wächter und im Befund.
 * Die Vergleichsform `klein` ist die einfache (`toLowerCase`); braucht die Sprache eine eigene (Falle 89), hier ändern.
 */

/** Stämme (Teilzeichenketten, klein, MIT Diakritika): jede Form, die sie enthält, ist überall gesperrt. Nur, wo der Stamm nichts Harmloses trifft. */
export const EL_SPERR_KERN_STAEMME: readonly string[] = [
  "γαμιέ", "γαμημέν", "πουτάν", "καριόλ", "μαλάκ",
];

/** Exakte Formen, überall gesperrt (kurze Wörter, die in harmlosen Wörtern stecken, stehen hier statt bei den Stämmen). */
export const EL_SPERR_KERN_WOERTER: readonly string[] = [
  "γαμώ", "γαμάς", "γαμάει", "γαμώτο", "μουνί", "μουνιά", "πούτσα", "πούτσος", "αρχίδι", "αρχίδια", "κώλος", "κώλο", "κώλου",
  "σκατά", "σκατό", "πούστης", "πούστη", "πούστηδες",
];

/** Stämme der Wortbasis (nicht in Wortlisten, Lexikon, Pseudowörtern; im Text mit Zusammenhang erlaubt). */
export const EL_SPERR_WORTBASIS_STAEMME: readonly string[] = [
  "ηλίθι",
];

/** Exakte Formen der Wortbasis: Wörter gegen ein Kind, gegen Menschen mit Behinderung oder gegen Gruppen, Gewalt und Rausch. */
export const EL_SPERR_WORTBASIS: readonly string[] = [
  "βλάκας", "βλάκα", "βλάκες", "χαζός", "χαζή", "χαζό", "κρετίνος", "καθυστερημένος", "σακάτης", "σκοτώνω", "σκότωσε", "σκοτώθηκε",
  "δολοφόνος", "γύφτος", "γύφτοι", "αλκοόλ",
];

function klein(wort: string): string {
  return wort.normalize("NFC").toLowerCase();
}

const KERN_EXAKT: ReadonlySet<string> = new Set(EL_SPERR_KERN_WOERTER);
const WORTBASIS_EXAKT: ReadonlySet<string> = new Set(EL_SPERR_WORTBASIS);

/** Ist dieses Wort für Kinder überall gesperrt - auch in Texten? */
export function istKernGesperrtEl(wort: string): boolean {
  const k = klein(wort);
  if (KERN_EXAKT.has(k)) return true;
  return EL_SPERR_KERN_STAEMME.some((st) => k.includes(st));
}

/** Ist dieses Wort aus Übungswortlisten, Vorlese-Lexikon und Pseudowörtern ausgeschlossen? (Kern + Wortbasis.) */
export function gesperrtEl(wort: string): boolean {
  if (istKernGesperrtEl(wort)) return true;
  const k = klein(wort);
  if (WORTBASIS_EXAKT.has(k)) return true;
  return EL_SPERR_WORTBASIS_STAEMME.some((st) => k.includes(st));
}
