/**
 * ★ G3c-VERTEILER (25.10.2026): DER RATE-WORTSCHATZ DER EXPEDITION (Polarstation) AUF WEG „nl" (Niederländisch) - Einhängepunkt, seit O-INHALT gefüllt.
 *
 * Vorbild `WORDS_CS_EXPEDITION` in `expedition/words.ts` (rund 250 Wörter, Länge 3-8, je Sprosse ab dem ersten Vokal, klein, keine
 * Namen, keine Sperrwörter, kein zweites Wort mit denselben Buchstaben). Ableitbar aus `tf-fest-nl.json` `stufenWoerter` (Rezept R).
 * Verteiler: `expedition/words.ts` (`RATE_VORRAT`, Wörter UND Stimme `"nl"`). Wächter: `tests/tastenflow-expedition-nl.test.ts`,
 * `tests/tastenflow-es-m2-expedition-wortstimme.test.ts`.
 *
 * Bis dahin LEER: der Weg rät ENGLISCHE Wörter mit englischer Stimme (wie im Gerüst G2-NEUN).
 */

/**
 * ★ O-INHALT-NL (29.10.2026): 220 Rate-Wörter, von Hand aus `wordsNl.ts` (`WORDS_NL`, `STUFE_VOCAB_NL`) gewählt - Länge 3-6, klein,
 * nur Buchstaben der Reihenfolge des Weges, keine Sperrwörter (`gesperrtNl`), kein zweites Wort mit denselben Buchstaben, je Sprosse
 * nach dem Buchstaben geordnet, mit dem das Wort tippbar wird. Bevorzugt Hauptwörter mit Bezug zur Szene und zum Alltag; weggelassen
 * sind Tiere, die als Schimpfwort gegen ein Kind dienen, und Wörter über Tod, Waffen, Rausch und Glaube. Wächter:
 * `tests/tastenflow-expedition-nl.test.ts`. ⚠️ Gegen ein Vorlese-Lexikon nicht geprüft: das Fach „nl" baut erst F8.
 */
export const WORDS_NL_EXPEDITION: readonly string[] = [
  "dak", "jas", "kaas", "klas", "kalf", "sjaal", "salsa", "fles", "elf", "deksel", "fakkel", "salade", "jasje", "les", "land",
  "knal", "deken", "eend", "ananas", "kaneel", "laken", "naald", "nek", "dans", "kind", "ijs", "eiland", "lied", "knie", "klei",
  "ski", "dijk", "lelie", "liefde", "eik", "tafel", "tent", "stad", "kat", "lift", "tas", "kast", "tekst", "fiets", "nest",
  "lente", "tand", "tante", "kist", "foto", "stoel", "slot", "doos", "klok", "kilo", "koe", "stok", "toast", "koekje", "kooi",
  "solo", "trein", "radio", "krant", "ster", "strand", "taart", "kelder", "koffer", "toren", "draak", "raket", "oranje", "rijst",
  "rok", "hond", "hotel", "hoed", "hoek", "hert", "herfst", "haas", "hand", "hart", "heide", "hitte", "haai", "giraf", "tijger",
  "geit", "gans", "hagel", "reiger", "gitaar", "regen", "gras", "ring", "glas", "golf", "tong", "engel", "melk", "storm",
  "molen", "tomaat", "helm", "kamer", "film", "maand", "droom", "mond", "markt", "lam", "water", "wind", "winter", "wolf",
  "wafel", "wiel", "winkel", "woord", "week", "twaalf", "warm", "wolken", "tuin", "muis", "uil", "duif", "fruit", "huis",
  "keuken", "jurk", "kleur", "natuur", "suiker", "museum", "euro", "sluis", "duin", "vis", "vos", "vogel", "vlag", "vloer",
  "vijver", "heuvel", "rivier", "vuur", "video", "vriend", "avond", "boek", "boom", "bloem", "brood", "bril", "bus", "berg",
  "brug", "beer", "bal", "boot", "boter", "robot", "buik", "zon", "zee", "zand", "zebra", "zomer", "zwaan", "zalm", "zout",
  "zeven", "zusje", "rugzak", "muziek", "roze", "paard", "park", "pizza", "papier", "piloot", "soep", "tulp", "polder", "lepel",
  "peer", "perzik", "spin", "pen", "snoep", "school", "schip", "camera", "cactus", "circus", "cacao", "cadeau", "schelp",
  "schoen", "gracht", "cavia", "lucht", "baby", "pony", "yoga", "hobby", "jury", "gym", "hockey", "taxi", "extra", "box", "mix",
  "examen", "luxe", "quiz", "squash",
];
