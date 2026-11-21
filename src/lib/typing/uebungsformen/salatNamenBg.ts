/**
 * ★ G3c-VERTEILER (25.10.2026): WAS DER BUCHSTABENSALAT AUF WEG „bg" (Bulgarisch) NICHT ALS WORT ZÄHLT - gefüllt (★ O-INHALT-BG, 29.10.2026).
 *
 * Vorbild: die `cs`-Einträge in `salatNamen.ts`. Aus ALLEN Funden der Quellwörter (`buchstabensalatBg.ts`) von Hand
 * durchgesehen: {@link SALAT_NAMEN_BG} Vornamen, Nachnamen, Orte, Länder, Flüsse; {@link SALAT_KEINE_WOERTER_BG} Abkürzungen,
 * Ausrufe, fremde Wörter, Schreibungen ohne Diakritika, die als Wort falsch sind, und Funde, die ein Kind nicht als Wort finden soll.
 * Alles klein. Verteiler: `uebungsformen/salatNamen.ts`. Wächter: `tests/tastenflow-salat-namen.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „bg" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/*
 * ★ O-INHALT-BG (29.10.2026): Das Vorlese-Lexikon kennt „bg" noch nicht (F8) - der Salat hat auf diesem Weg heute KEINE Funde, aus
 * denen man die Namen von Hand lesen könnte. Sobald das Fach kommt, trägt es die Wörter des Korpus (Charge 1) - und damit dessen
 * Namen. Darum stehen hier vorab genau die Namen, die im Korpus des Weges mitten im Satz GROSS stehen und nie klein vorkommen
 * (gezählt 29.10.2026 über `CORPUS_BG`: Orte, Flüsse, Gebirge, Länder, Vornamen). Bewusst NICHT hier, weil sie zugleich
 * gewöhnliche Wörter sind: „мила" (lieb), „ива" (Weide), „вида" (die Art), „сребърна" (silbern), „велико", „широка" - sie zählen
 * im Salat als Wörter (wie „ernst" im Deutschen). Wächter: `tests/tastenflow-wortspiele-bg.test.ts` (jeder Name ist im Korpus
 * belegt) und `tests/tastenflow-salat-namen.test.ts`.
 */
export const SALAT_NAMEN_BG: readonly string[] = [
  // Orte, Flüsse, Gebirge, Landschaften
  "софия", "пловдив", "варна", "дунав", "добрич", "русе", "смолян", "бургас", "габрово", "плевен", "загора", "шумен", "видин",
  "пирин", "рила", "девин", "търново", "банско", "троян", "мадара", "добруджа", "странджа", "несебър", "витоша", "созопол",
  "родопите", "мусала", "чепеларе", "разград", "царевец", "кърджали", "златоград", "казанлък", "силистра", "мелник", "царево",
  "балчик", "етъра",
  // Länder und Städte draussen
  "българия", "германия", "испания", "париж",
  // Vornamen, Nachnamen
  "ружди", "деси", "борис", "петьо", "яна", "калоян", "стела", "енева", "ема", "емре", "стоянов", "мария", "айше", "петя",
  "стефан", "христина",
];

/** Abkürzungen und Ausrufe - kein Wort, das ein Kind im Salat finden soll (alles klein). */
export const SALAT_KEINE_WOERTER_BG: readonly string[] = [
  "юнеско", "напр", "вж", "бул", "стр", "тел", "млн", "мин", "сек", "км", "кг", "гр", "ул", "др", "ох", "ах", "ех", "уф", "хм",
];
