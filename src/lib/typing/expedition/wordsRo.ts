/**
 * ★ G3c-VERTEILER (25.10.2026): DER RATE-WORTSCHATZ DER EXPEDITION (Polarstation) AUF WEG „ro" (Rumänisch) - Einhängepunkt, seit O-INHALT gefüllt.
 *
 * Vorbild `WORDS_CS_EXPEDITION` in `expedition/words.ts` (rund 250 Wörter, Länge 3-8, je Sprosse ab dem ersten Vokal, klein, keine
 * Namen, keine Sperrwörter, kein zweites Wort mit denselben Buchstaben). Ableitbar aus `tf-fest-ro.json` `stufenWoerter` (Rezept R).
 * Verteiler: `expedition/words.ts` (`RATE_VORRAT`, Wörter UND Stimme `"ro"`). Wächter: `tests/tastenflow-expedition-ro.test.ts`,
 * `tests/tastenflow-es-m2-expedition-wortstimme.test.ts`.
 *
 * Bis dahin LEER: der Weg rät ENGLISCHE Wörter mit englischer Stimme (wie im Gerüst G2-NEUN).
 */

/**
 * ★ O-INHALT-RO (29.10.2026): 204 Rate-Wörter, von Hand aus `wordsRo.ts` (`WORDS_RO`, `STUFE_VOCAB_RO`) gewählt - Länge 3-6, klein,
 * nur Buchstaben der Reihenfolge des Weges, keine Sperrwörter (`gesperrtRo`), kein zweites Wort mit denselben Buchstaben, je Sprosse
 * nach dem Buchstaben geordnet, mit dem das Wort tippbar wird. Bevorzugt Hauptwörter mit Bezug zur Szene und zum Alltag; weggelassen
 * sind Tiere, die als Schimpfwort gegen ein Kind dienen, und Wörter über Tod, Waffen, Rausch und Glaube. Wächter:
 * `tests/tastenflow-expedition-ro.test.ts`. ⚠️ Gegen ein Vorlese-Lexikon nicht geprüft: das Fach „ro" baut erst F8.
 */
export const WORDS_RO_EXPEDITION: readonly string[] = [
  "sala", "lada", "șef", "șase", "deal", "alee", "idee", "seif", "ideal", "felie", "fidel", "fete", "lista", "stea", "stele",
  "etaj", "sfat", "stil", "test", "lift", "stat", "ulei", "suflet", "adult", "studiu", "iulie", "util", "duș", "nas", "inel",
  "sunet", "talent", "desen", "sanie", "iunie", "dans", "insula", "linie", "final", "luni", "tren", "strada", "teatru", "aur",
  "ieri", "frate", "natura", "seara", "sertar", "serial", "real", "adresa", "caiet", "arici", "castel", "liceu", "curaj",
  "cafea", "carte", "cinci", "secret", "client", "cer", "soare", "creion", "cadou", "tort", "nor", "nord", "orar", "dosar",
  "doctor", "oraș", "foc", "joc", "noroc", "munte", "melc", "mama", "film", "medic", "metrou", "mesaj", "inima", "drum", "lume",
  "nume", "mic", "măr", "iarnă", "toamnă", "scoică", "deltă", "clasă", "lună", "masă", "casă", "mătușă", "școală", "soră",
  "penar", "păpușă", "parc", "nisip", "pat", "pisică", "pește", "pară", "prună", "lapte", "ploaie", "pădure", "plajă", "patine",
  "apă", "copil", "vară", "verde", "vis", "vecin", "elev", "viitor", "avocat", "vreme", "motiv", "albină", "barcă", "basm",
  "bloc", "bilet", "bunic", "bunică", "tablă", "baie", "birou", "alb", "bancă", "tabără", "încet", "înapoi", "încă", "cățel",
  "rețetă", "piață", "față", "emoție", "viață", "galben", "dragon", "minge", "leagăn", "covrig", "gară", "grup", "glumă",
  "coleg", "negru", "buget", "agent", "zăpadă", "zmeu", "zbor", "muzeu", "muzică", "fizică", "zece", "pauză", "ziua", "zonă",
  "azi", "zile", "câine", "pâine", "vânt", "cântec", "râu", "zâmbet", "mână", "pământ", "mâine", "gând", "zână", "tânăr",
  "hotel", "pahar", "ochi", "cheie", "rochie", "ureche", "pachet", "unchi", "chimie", "echipă", "yoga", "hobby", "rugby", "taxi",
  "exact", "fix", "expert", "extrem", "web", "watt", "squash",
];
