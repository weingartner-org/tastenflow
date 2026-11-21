/**
 * Deutsche Wortliste (Kleinschreibung, nur Buchstaben) als Quelle für echte
 * Übungswörter. Der Generator filtert sie auf die jeweils freigeschalteten
 * Tasten — so erscheinen echte Wörter, sobald genug Buchstaben gelernt sind.
 *
 * Bewusst alltagsnah und breit gestreut. Die große, alters-gestufte Text-/
 * Witz-/Wortspiel-Sammlung kommt in einer späteren Ausbaustufe (Phase 3) dazu;
 * diese Liste deckt den Buchstaben-Lehrgang ab. Siehe [[project_zehnfinger_trainer]].
 */
export const WORDS: string[] = [
  // sehr früh möglich (Grundreihe + e/i)
  "das", "dass", "als", "los", "lag", "sag", "sah", "des", "all",
  "fad", "gas", "glas", "hals", "fall", "saal", "lasch",
  "die", "sie", "ist", "dies", "eis", "leise", "sieh", "skihalle",
  "see", "geld", "feld", "edel", "siegel", "diele", "lied", "fiel", "kies",
  "kalk", "egal", "ideal", "gilde", "geige", "lage", "lese", "gase",
  // r u t z w o q p (obere Reihe)
  "rot", "rad", "uhr", "tor", "tier", "wort", "wir", "wird", "wert", "weit",
  "ohr", "obst", "ort", "post", "quer", "quark", "pause", "park", "pakt",
  "torte", "route", "stute", "weiter", "preis", "kraut", "traut",
  "stark", "stern", "straße", "wieso", "wieder", "super", "tasse", "rose",
  // m v c , (untere Reihe teil 1)
  "maus", "haus", "raum", "team", "milch", "markt", "musik", "moment", "auto",
  "vier", "viel", "vase", "vogel", "video", "voll", "vater", "vorne",
  "circa", "comic", "creme", "café", "cola", "click",
  // x . y -
  "examen", "max", "taxi", "hexe", "praxis", "fix", "lexikon",
  "yoga", "typ", "party", "system", "hobby", "baby", "handy",
  // n b
  "name", "nein", "neun", "nase", "natur", "neben", "nudel", "norden",
  "ball", "baum", "buch", "bild", "blau", "blume", "brot", "brief", "banane",
  "bunt", "boden", "beere", "birne", "brand", "bahn", "bus", "bein",
  // ä ü ß
  "bär", "käse", "äpfel", "spät", "läuft", "wäsche", "hände", "länder",
  "tür", "über", "müde", "grün", "fünf", "küche", "glück", "schüler", "frühling",
  "fuß", "straße", "groß", "weiß", "süß", "spaß", "fleiß", "gruß", "maß",
  // allgemein, alltagsnah
  "freund", "schule", "lehrer", "kinder", "spiel", "computer", "tastatur",
  "finger", "hand", "sonne", "mond", "wasser", "feuer", "wind", "regen",
  "winter", "sommer", "morgen", "abend", "nacht", "stunde", "minute", "woche",
  "katze", "hund", "pferd", "vogel", "fisch", "tiger", "löwe", "affe", "elefant",
  "pizza", "apfel", "salat", "suppe", "kuchen", "schokolade", "honig", "milch",
  "rot", "blau", "gelb", "grün", "schwarz", "weiß", "bunt", "hell", "dunkel",
  "gut", "toll", "super", "klasse", "stark", "schnell", "leise", "laut", "warm",
];

/**
 * NICHT-Nomen im obigen Wortschatz (Verben, Adjektive, Artikel, Pronomen,
 * Adverbien, Zahlwörter). Im Deutschen werden Nomen großgeschrieben, alles
 * andere klein. Da unser Übungswortschatz weit überwiegend aus Nomen besteht,
 * pflegen wir hier nur die Ausnahmen: Sobald die Umschalttaste freigeschaltet
 * ist, schreibt der Generator ein Wort groß, AUSSER es steht in dieser Liste.
 * Beim Ergänzen des Wortschatzes ein neues Nicht-Nomen bitte hier eintragen.
 */
export const NON_NOUNS = new Set<string>([
  // Artikel, Pronomen, Partikel, Konjunktionen
  "das", "dass", "als", "des", "die", "dies", "sie", "wir", "neben", "über",
  "nein", "los", "all", "viel",
  // Verben (auch gebeugte Formen, die im Wortschatz vorkommen)
  "ist", "wird", "läuft", "lag", "sag", "sah", "fiel", "sieh", "lese",
  "spielen", "lachen", "singen", "basteln", "entdecken", "forschen",
  "klettern", "kochen", "malen", "pendeln", "sammeln", "schwimmen", "turnen",
  "traut",
  // Adjektive
  "blau", "bunt", "dunkel", "edel", "egal", "fad", "gelb", "groß", "grün",
  "gut", "hell", "ideal", "lasch", "laut", "leise", "müde", "rot", "schnell",
  "schwarz", "spät", "stark", "super", "süß", "toll", "voll", "warm", "weit",
  "weiß", "selbstständig", "fix",
  // Adverbien / Sonstiges
  "gestern", "morgen", "vorne", "wieder", "wieso", "weiter", "quer", "circa",
  "click", "max",
  // Zahlwörter (klein)
  "fünf", "neun", "vier",
]);

/** Ist das (kleingeschriebene) Wort ein Nomen? (Grundlage für Großschreibung.) */
export function isNoun(word: string): boolean {
  return !NON_NOUNS.has(word.toLowerCase());
}
