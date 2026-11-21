/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ALPHABET DES WEGES „uk" (Ukrainisch) für die Alphabetreihen - gefüllt (★ O-INHALT-UK, 29.10.2026).
 *
 * Was hinein gehört (Vorbild `ALPHABET_ORDER_CS` in `alphabetreihen.ts`): die Buchstaben in der Reihenfolge, in der die Sprache
 * SORTIERT (mit `Intl.Collator("uk-UA")` messen), klein; Mehrzeichen-Buchstaben als ein Eintrag, wo die Schule sie als einen
 * Buchstaben lehrt (cs: `ch`). Buchstaben, die wie ihr Grundbuchstabe sortieren, gehören nicht in die Reihe.
 * Quelle: Recherche der Sprache (iCloud `recherche-uk/`), nicht in `tf-fest`.
 * Verteiler: `uebungsformen/alphabetreihen.ts` (`ALPHABET_ORDER_BY_LERNWEG`). Wächter: `tests/tastenflow-wortspiele-uk.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „uk" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/**
 * Die 33 Buchstaben der ukrainischen Абетка, so wie sie SORTIEREN (gemessen 29.10.2026, Node: `Intl.Collator("uk")` ordnet
 * а б в г ґ д е є ж з и і ї й к л м н о п р с т у ф х ц ч ш щ ь ю я). ґ, є, і, ї sind eigene Buchstaben (Glossar §2.1) und stehen
 * hinter ihrem Nachbarn. Der Apostroph ist kein Buchstabe.
 */
export const ALPHABET_ORDER_UK: string[] = [
  "а", "б", "в", "г", "ґ", "д", "е", "є", "ж", "з", "и", "і", "ї", "й", "к", "л", "м",
  "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ь", "ю", "я",
];
