/**
 * ★ G3c-VERTEILER (25.10.2026): DER RATE-WORTSCHATZ DER EXPEDITION (Polarstation) AUF WEG „sv" (Schwedisch) - Einhängepunkt.
 *
 * ★ O-INHALT-SV (29.10.2026): gefüllt nach Vorbild `WORDS_CS_EXPEDITION` (`expedition/words.ts`). Je Sprosse der Reihenfolge
 * des Weges (Rate-Buchstaben: a-z und å ä ö - alle mit eigener Taste ohne Umschalt; é kommt über die Totaste und bleibt draussen) die Wörter, die mit der neuen Taste erst tippbar werden - ausgewählt
 * aus dem eigenen Übungswortschatz (`wordsSv.ts`: `WORDS_SV` und `STUFE_VOCAB_SV`, aus `tf-fest` `stufenWoerter`/`wortschatz`),
 * bevorzugt Dinge, Tiere, Wetter und Orte, die zur Szene passen.
 * Regeln (Wächter `tests/tastenflow-expedition-pt-br-sv.test.ts`): klein, 2 bis 6 Buchstaben, nur a-z und å ä ö; jedes Wort steht im
 * Übungswortschatz des Weges (das Vorlese-Lexikon kennt die neun Wege noch nicht - F8); nichts aus der Sperrliste, kein Tier als
 * Schimpfwort, nichts über Tod, Waffen, Rausch, Glaube; keine zwei Wörter aus denselben Buchstaben.
 * `q` hat nur ein Wort (quiz) - das einzige schwedische Alltagswort mit q im Übungswortschatz.
 * ⚠️ Gegen das Sprachwissen des Baus gewählt; die Lese-Abnahme durch eine Person mit der Sprache als Erstsprache steht aus.
 * Verteiler: `expedition/words.ts` (`RATE_VORRAT`, Wörter UND Stimme `"sv"`).
 */

export const WORDS_SV_EXPEDITION: readonly string[] = [
  // nach e
  "kaffe", "eld", "sked", "sadel", "leksak", "kedja", "flöde", "sedel", "kakel", "ek",
  // nach i
  "fisk", "is", "fiska", "sida", "lila", "fil", "fika", "disk", "skida", "sill", "silke", "isflak", "fiske",
  // nach ä
  "säl", "släde", "fjäll", "kälke", "läsk", "läsa", "källa",
  // nach r
  "fjäril", "färja", "dörr", "röd", "fred", "kläder", "läkare", "lärare", "resa", "serie", "kärlek", "sälar",
  // nach t
  "katt", "träd", "teater", "saft", "stad", "fest", "te", "tre", "tid", "kraft", "röst", "skatt", "fritid",
  // nach n
  "snö", "strand", "sten", "kanin", "linjal", "insjö", "dans", "natt", "land", "tanke",
  // nach g
  "gädda", "gröt", "glass", "regn", "gräs", "grön", "älg", "gardin", "garn", "färg", "ägg", "glas", "dag", "stig", "lag",
  // nach h
  "häst", "höst", "hage", "hand", "hjärta", "hjärna", "hjälte", "hälsa",
  // nach o
  "sol", "skog", "ost", "ekorre", "lingon", "hallon", "kakao", "skola", "dator", "kort",
  // nach m
  "mjölk", "smör", "moln", "himmel", "sommar", "semla", "mormor", "morfar", "film", "mat", "medalj", "klimat", "miljö", "möte", "mamma",
  // nach v
  "vante", "vinter", "vind", "hav", "vit", "svart", "räv", "älv", "vatten", "elev", "kvitto", "svar", "val", "lov",
  // nach u
  "hund", "jul", "ljus", "sju", "kudde", "uggla", "gul", "humla", "gunga", "sudd", "lodjur", "kung", "musik", "hus", "djur", "rum",
  // nach å
  "tåg", "sång", "måne", "tårta", "våffla", "åtta", "två", "år",
  // nach p
  "päron", "påsk", "pulka", "penna", "lampa", "äpple", "kopp", "park", "papper", "spel", "pris",
  // nach b
  "björn", "bröd", "banan", "blåbär", "bulle", "berg", "blomma", "bad", "båt", "buss", "boll", "bok", "bil", "bänk", "bank",
  // nach c
  "lucia", "lunch", "snäcka", "täcke", "vecka", "recept", "match",
  // nach y
  "cykel", "myra", "bandy", "gympa", "syskon", "yrke",
  // nach x
  "lax", "kex", "sax", "läxa", "byxor", "taxi", "text", "pixel", "axel",
  // nach w
  "webb", "watt", "wifi", "wok",
  // nach z
  "pizza", "zoo", "jazz", "zon", "zebra",
  // nach q
  "quiz",
];
