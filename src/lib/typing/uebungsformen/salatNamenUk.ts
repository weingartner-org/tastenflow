/**
 * ★ G3c-VERTEILER (25.10.2026): WAS DER BUCHSTABENSALAT AUF WEG „uk" (Ukrainisch) NICHT ALS WORT ZÄHLT - gefüllt (★ O-INHALT-UK, 29.10.2026).
 *
 * Vorbild: die `cs`-Einträge in `salatNamen.ts`. Aus ALLEN Funden der Quellwörter (`buchstabensalatUk.ts`) von Hand
 * durchgesehen: {@link SALAT_NAMEN_UK} Vornamen, Nachnamen, Orte, Länder, Flüsse; {@link SALAT_KEINE_WOERTER_UK} Abkürzungen,
 * Ausrufe, fremde Wörter, Schreibungen ohne Diakritika, die als Wort falsch sind, und Funde, die ein Kind nicht als Wort finden soll.
 * Alles klein. Verteiler: `uebungsformen/salatNamen.ts`. Wächter: `tests/tastenflow-salat-namen.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „uk" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/*
 * ★ O-INHALT-UK (29.10.2026): Das Vorlese-Lexikon kennt „uk" noch nicht (F8) - der Salat hat heute KEINE Funde. Sobald das Fach
 * kommt, trägt es die Wörter des Korpus (Charge 1) und damit dessen Namen in genau den Formen, die dort stehen („одесі", „львова" -
 * Ukrainisch beugt Namen). Darum stehen hier vorab die Wörter, die im Korpus mitten im Satz GROSS stehen und nie klein vorkommen
 * (gezählt 29.10.2026 über `CORPUS_UK`), klein. Bewusst NICHT hier: Adjektive und Feste, die nur im Namen gross stehen („Чорного"
 * моря, „Паралімпійських", „Різдво", „Великоднем"), und Namen, die zugleich gewöhnliche Wörter sind: „Віра" (Glaube), „Роман"
 * (Roman). Wächter: `tests/tastenflow-wortspiele-uk.test.ts` (jeder Name im Korpus belegt).
 */
export const SALAT_NAMEN_UK: readonly string[] = [
  "одесі", "києві", "одеси", "дніпра", "харкові", "поліссі", "львова", "парижі", "дніпрі", "лада", "львові", "волині",
  "карпатах", "яремчі", "україни", "миколаєвом", "чернігівщині", "сумщині", "косові", "черкасах", "чернігові", "святослав",
  "брайля", "бровко", "рівного", "говерла", "житомирі", "соломія", "петриківки", "софії", "устина", "карпат", "марко",
  "сербін", "магучіх", "луцьку", "назар", "полтаві", "ілля", "десни", "піддубна", "мирослава", "вероніка", "богдан",
  "чернівців", "яна", "ірина", "андрію", "микола", "тернополі", "василь", "ужгороді", "ганна", "миколаєві", "петро", "одесою",
  "дніпропетровщини", "дмитро", "сумах", "вінниці", "людмила", "петриківці",
];

/** Abkürzungen und Ausrufe - kein Wort, das ein Kind im Salat finden soll (alles klein). */
export const SALAT_KEINE_WOERTER_UK: readonly string[] = ["юнеско", "грн", "тис", "км", "кг", "хв", "год", "ок", "ой", "ах", "ех", "гм"];
