/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ALPHABET DES WEGES „bg" (Bulgarisch) für die Alphabetreihen - gefüllt (★ O-INHALT-BG, 29.10.2026).
 *
 * Was hinein gehört (Vorbild `ALPHABET_ORDER_CS` in `alphabetreihen.ts`): die Buchstaben in der Reihenfolge, in der die Sprache
 * SORTIERT (mit `Intl.Collator("bg-BG")` messen), klein; Mehrzeichen-Buchstaben als ein Eintrag, wo die Schule sie als einen
 * Buchstaben lehrt (cs: `ch`). Buchstaben, die wie ihr Grundbuchstabe sortieren, gehören nicht in die Reihe.
 * Quelle: Recherche der Sprache (iCloud `recherche-bg/`), nicht in `tf-fest`.
 * Verteiler: `uebungsformen/alphabetreihen.ts` (`ALPHABET_ORDER_BY_LERNWEG`). Wächter: `tests/tastenflow-wortspiele-bg.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „bg" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/**
 * Die 30 Buchstaben der bulgarischen Азбука, so wie sie SORTIERT (gemessen 29.10.2026, Node: `Intl.Collator("bg-BG")` ordnet
 * а б в г д е ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ь ю я). ѝ fehlt mit Absicht: `Intl.Collator("bg-BG", { sensitivity:
 * "base" })` sortiert es wie и (Vergleich 0) - es ist kein eigener Buchstabe der Азбука, sondern и mit Akzent (Glossar §2.1).
 */
export const ALPHABET_ORDER_BG: string[] = [
  "а", "б", "в", "г", "д", "е", "ж", "з", "и", "й", "к", "л", "м", "н", "о",
  "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ь", "ю", "я",
];
