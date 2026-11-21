/**
 * ★ G3c-VERTEILER (25.10.2026): DER RATE-WORTSCHATZ DER EXPEDITION (Polarstation) AUF WEG „hu" (Ungarisch) - Einhängepunkt, seit O-INHALT gefüllt.
 *
 * Vorbild `WORDS_CS_EXPEDITION` in `expedition/words.ts` (rund 250 Wörter, Länge 3-8, je Sprosse ab dem ersten Vokal, klein, keine
 * Namen, keine Sperrwörter, kein zweites Wort mit denselben Buchstaben). Ableitbar aus `tf-fest-hu.json` `stufenWoerter` (Rezept R).
 * Verteiler: `expedition/words.ts` (`RATE_VORRAT`, Wörter UND Stimme `"hu"`). Wächter: `tests/tastenflow-expedition-hu.test.ts`,
 * `tests/tastenflow-es-m2-expedition-wortstimme.test.ts`.
 *
 * Bis dahin LEER: der Weg rät ENGLISCHE Wörter mit englischer Stimme (wie im Gerüst G2-NEUN).
 */

/**
 * ★ O-INHALT-HU (29.10.2026): 298 Rate-Wörter, von Hand aus `wordsHu.ts` (`WORDS_HU`, `STUFE_VOCAB_HU`) gewählt - Länge 3-6, klein,
 * nur Buchstaben der Reihenfolge des Weges, keine Sperrwörter (`gesperrtHu`), kein zweites Wort mit denselben Buchstaben, je Sprosse
 * nach dem Buchstaben geordnet, mit dem das Wort tippbar wird. Bevorzugt Hauptwörter mit Bezug zur Szene und zum Alltag; weggelassen
 * sind Tiere, die als Schimpfwort gegen ein Kind dienen, und Wörter über Tod, Waffen, Rausch und Glaube. Wächter:
 * `tests/tastenflow-expedition-hu.test.ts`. ⚠️ Gegen ein Vorlese-Lexikon nicht geprüft: das Fach „hu" baut erst F8.
 */
export const WORDS_HU_EXPEDITION: readonly string[] = [
  "dal", "fal", "faj", "alak", "sas", "sakk", "lak", "kajak", "lakk", "falka", "kék", "fék", "séf", "éjfél", "fél", "fej", "jel",
  "kedd", "lélek", "éles", "fedél", "esés", "lelkes", "kifli", "lila", "sisak", "déli", "kis", "ide", "tej", "tea", "sajt",
  "séta", "tél", "lift", "lista", "illat", "fiatal", "fekete", "delta", "festék", "kaland", "tinta", "ének", "delfin", "néni",
  "latin", "félénk", "élénk", "fent", "kint", "zene", "szél", "tészta", "kéz", "asztal", "zenész", "fizika", "edzés", "kész",
  "tiszta", "alma", "mese", "film", "matek", "kémia", "emelet", "méz", "szem", "jelmez", "zsemle", "kréta", "terem", "rétes",
  "kert", "kar", "térd", "terasz", "szerda", "strand", "rajz", "remek", "mester", "iskola", "torta", "toll", "olaj", "torna",
  "fotel", "forint", "zokni", "mozi", "roller", "iroda", "oldal", "tigris", "egér", "sziget", "tenger", "jég", "tégla", "liget",
  "angol", "gazdag", "meleg", "magas", "reggel", "saláta", "gitár", "láda", "táska", "lángos", "málna", "sárga", "sátor",
  "zsiráf", "nadrág", "ország", "diák", "játék", "állat", "nyár", "nyak", "király", "gyerek", "arany", "fény", "tanya", "kenyér",
  "nyereg", "dinnye", "gyors", "meggy", "fagyi", "magyar", "hold", "homok", "hinta", "hang", "hegy", "ház", "hal", "hideg",
  "hajnal", "fehér", "hagyma", "hangya", "vonat", "medve", "virág", "tavasz", "vihar", "villám", "szilva", "leves", "levél",
  "város", "vaj", "evezés", "orvos", "nyelv", "ablak", "ebéd", "barát", "szoba", "labda", "zebra", "bokor", "bagoly", "tábla",
  "robot", "kabát", "bárány", "béka", "busz", "ruha", "kutya", "kenu", "uszoda", "unoka", "munka", "futás", "uborka", "nyuszi",
  "cukor", "citrom", "ceruza", "macska", "csiga", "kacsa", "malac", "kecske", "katica", "csizma", "foci", "kulcs", "csomag",
  "tánc", "pizza", "sapka", "kapu", "lámpa", "piac", "papucs", "pohár", "park", "polc", "lepke", "pulyka", "eper", "kép", "gép",
  "föld", "zöld", "könyv", "körte", "bögre", "köd", "öröm", "szöveg", "tölgy", "kötél", "ötlet", "tejföl", "mókus", "hajó",
  "autó", "óra", "ajtó", "dió", "róka", "gólya", "póló", "rózsa", "rádió", "csónak", "szánkó", "fóka", "erdő", "eső", "felhő",
  "cipő", "fenyő", "szőlő", "mező", "ősz", "hétfő", "csengő", "levegő", "teknős", "üveg", "füzet", "ünnep", "fül", "sün", "süti",
  "tükör", "szürke", "ezüst", "épület", "fürdő", "szünet", "kígyó", "víz", "tíz", "híd", "szív", "cím", "radír", "gyík", "író",
  "színes", "fiú", "túra", "hús", "kút", "húg", "nyúl", "túró", "újság", "múzeum", "úszás", "betű", "gyűrű", "hűtő", "fűzfa",
  "hegedű", "műsor", "hűvös", "wifi", "web", "watt", "taxi", "extra", "fax", "luxus", "fix", "squash",
];
