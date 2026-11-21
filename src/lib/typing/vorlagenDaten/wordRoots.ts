/**
 * Word roots - the English equivalent of `fremdwoerter.ts`: an ÜBUNGSVORLAGE
 * zum Abschreiben for English-speaking classes (UK, USA, Canada, Australia,
 * Ireland). The German file teaches loanwords in today's German
 * ("Fremdwörterkunde"); the matching topic in English classrooms is word
 * roots - Greek and Latin roots, prefixes and suffixes, plus loanwords from
 * other languages. Kinder tippen nur ab: Jede Zeile lautet
 * `<clue> - <word>`. Wer abschreibt, lernt die Wortstämme nebenbei.
 *
 * ── Warum dieses Thema (Beleg, nicht Behauptung) ────────────────────────────
 * Zwei Lehrpläne verlangen genau das ausdrücklich:
 *  • US Common Core, Language standards L.4.4.b bis L.8.4.b: *„Use common,
 *    grade-appropriate Greek and Latin affixes and roots as clues to the
 *    meaning of a word"* (L.4.4.b, Beispiel „telegraph, photograph,
 *    autograph"; L.6.4.b bis L.8.4.b: *„Use common, grade-appropriate Greek
 *    or Latin affixes and roots as clues to the meaning of a word"*, mit
 *    eigenen Beispielen je Klassenstufe).
 *    Quelle: https://www.thecorestandards.org/ELA-Literacy/L/4/4/b/
 *    (Fetch am 24.09.2026 vom offiziellen Corestandards-Server mit HTTP 403
 *    abgewiesen; der Wortlaut oben ist über mehrere unabhängige Fach-Quellen,
 *    die den Standard wörtlich zitieren, gegengeprüft, siehe u. a.
 *    https://learninglab.si.edu/standards/CCSS.ELA-Literacy.L.4.4b/1727 -
 *    diese zweite Quelle liess sich aus demselben Grund nicht direkt
 *    abrufen, deckt sich aber wortgleich mit weiteren Fundstellen).
 *  • England, National Curriculum, „English Appendix 1: Spelling" (amtliches
 *    PDF, direkt gelesen): Für Years 3 und 4 stehen als STATUTORY
 *    requirements u. a. „More prefixes" (dis-, mis-, in-/il-/im-/ir-, re-,
 *    sub-, inter-, super-, anti-, auto-) und drei eigene Zeilen zu Wörtern
 *    nach Herkunft: *„Words with the /k/ sound spelt ch (Greek in origin)"*
 *    (Beispiele: scheme, chorus, chemist, echo, character), *„Words with the
 *    /ʃ/ sound spelt ch (mostly French in origin)"* (chef, chalet, machine,
 *    brochure) und *„Words with the /s/ sound spelt sc (Latin in origin)"*
 *    (science, scene, discipline, fascinate, crescent). Die Vorgabe nennt
 *    dazu ausdrücklich das Beispiel *„bicycle is cycle (from the Greek for
 *    wheel) with bi– (meaning 'two') before it"*. Years 5 und 6 bauen mit
 *    weiteren lateinisch geprägten Endungen darauf auf (-cious/-tious,
 *    -cial/-tial, -able/-ible u. a.).
 *    Quelle: https://assets.publishing.service.gov.uk/media/5a7ccc06ed915d63cc65ce61/English_Appendix_1_-_Spelling.pdf
 *    (amtliches PDF von assets.publishing.service.gov.uk, Seiten 11-14
 *    „Spelling - work for years 3 and 4"; am 24.09.2026 vollständig gelesen).
 *
 * ── Aufbau (wie `fremdwoerter.ts`) ───────────────────────────────────────────
 * Drei Altersstufen (kids 7-10, teens 11-15, erwachsen 16+), je vier Themen
 * zu genau 20 Paaren (WORD_ROOT_THEMEN, immer in dieser Reihenfolge), also 80
 * je Stufe und 240 insgesamt:
 *  • „Numbers and size" - Zahl- und Grössenwurzeln (uni-, bi-, tri-, multi-,
 *    cent-, milli- ...), altersgerecht von „bicycle" bis „equilateral".
 *  • „Science and nature" - griechisch/lateinisch geprägte Fachwörter der
 *    Naturwissenschaft (telescope, photosynthesis, biodegradable ...).
 *  • „People and society" - Gesellschafts- und Sprachwurzeln (telephone,
 *    democracy, philanthropy ...).
 *  • „Words from other languages" - eine LEHNWORT-Vorlage je Stufe
 *    (Französisch, Deutsch, Italienisch, Spanisch, Arabisch, Hindi,
 *    Japanisch - redaktionell gemischt, keine gemessene Häufigkeitsliste,
 *    genau wie die Auswahl in `fremdwoerter.ts`).
 *
 * ── Zeilenformat: EIN Format für alle 240 Paare ──────────────────────────────
 * Jede Zeile lautet `${clue} - ${word}` - dieselbe Form wie das deutsche
 * `${de} - ${fremd}`. Ein Doppelpunkt-Format wie „clue: word" fiele weg
 * (Doppelpunkt kommt im Lehrgang erst spät dran, siehe Vorbild
 * `fremdwoerter.ts`); ein Wurzel-Format wie „tele - far - telephone" wurde
 * geprüft und verworfen, weil es (a) für Lehnwörter ohne erkennbare
 * Wurzelbedeutung (chef, sofa, tsunami) nicht funktioniert und (b) bei
 * hybriden Wörtern (bicycle = lateinisch bi- + griechisch kyklos) eine
 * einzelne „Wurzel" vortäuschen würde, wo es zwei sind. `clue` ist darum
 * immer eine kurze, wahre Umschreibung der BEDEUTUNG (nicht der Wurzel
 * selbst) - für Wurzelwörter genügt das zum Lernen (die Wurzel steckt im
 * `herkunft`-Feld für die Lehrkraft), für Lehnwörter ist es die einzig
 * ehrliche Form.
 *
 * ── Zeilenregeln (ein Wächtertest prüft sie, `tests/tastenflow-vorlage-word-roots.test.ts`) ─
 * - `${clue} - ${word}` hat höchstens 40 Zeichen (Braillezeile: 40 Module).
 * - Erlaubt: a-z A-Z, Ziffern, Leerzeichen und der echte Bindestrich `-`.
 *   Keine Akzentbuchstaben, kein Apostroph, kein sonstiges Satzzeichen -
 *   auch nicht dort, wo ein Loanword im Original einen Akzent trüge
 *   („café" wird „cafe" - das ist die im Englischen ebenso gültige,
 *   unakzentuierte Schreibweise, nicht eine Vereinfachung unsererseits).
 * - `word` ist ein Einzelwort ohne Bindestrich und Leerzeichen; `clue` darf
 *   Leerzeichen enthalten, aber keinen Bindestrich und nicht das Wort selbst.
 * - Kein doppeltes Leerzeichen, keine Leerzeichen am Anfang oder Ende.
 * - Kein Wort kommt in zwei Stufen oder innerhalb einer Stufe doppelt vor.
 * - KEINE US/UK-Schreibvariante: weder das britische noch das amerikanische
 *   Wort einer Variantenschreibung kommt vor (color/colour, center/centre,
 *   program/programme, -ise/-ize, -yse/-yze, theater/theatre, meter/metre,
 *   liter/litre, aluminum/aluminium, gray/grey, mum/mom, math/maths,
 *   defense/defence, catalog/catalogue, practice/practise als Verb,
 *   labour/labor u. Verwandte, travelled/traveled uvm. - die volle Liste
 *   steht im Wächtertest). Wörter, die auf beiden Seiten des Atlantiks
 *   GLEICH geschrieben werden (z. B. „thermometer"), sind dagegen erlaubt.
 * - Jedes Paar trägt zusätzlich `herkunft` (griechisch/lateinisch/
 *   französisch/deutsch/italienisch/spanisch/arabisch/Hindi/japanisch) - ein
 *   Feld NUR für die Lehrkraft, wird beim Abtippen nicht angezeigt. Bei
 *   hybriden Wörtern (griechisch-lateinische Neubildungen wie „television",
 *   „sociology" oder „genocide") nennt `herkunft` die Sprache der im
 *   jeweiligen Thema unterrichteten Wurzel, nicht zwingend jedes einzelne
 *   gebundene Morphem - das ist bei diesen Wörtern in der Fachliteratur
 *   selbst uneinheitlich (z. B. wird „bicycle" je nach Quelle als
 *   neulateinische ODER als griechische Bildung geführt); es wird nichts
 *   Falsches behauptet, nur vereinfacht.
 *
 * ── Woher der Korpus kommt ───────────────────────────────────────────────────
 * Redaktionelle Auswahl (wie bei `fremdwoerter.ts`: KEINE gemessene
 * Häufigkeitsliste), gegen die beiden oben genannten Lehrpläne und gegen
 * allgemein gebräuchliches Schulvokabular geprüft. „kids" bleibt bei ganz
 * konkreten, sehr geläufigen Wörtern (bicycle, telephone, pizza); „teens"
 * bei Schulfach-Vokabular (photosynthesis, democracy, anthropologist);
 * „erwachsen" bei reicherem, abstrakterem Wortschatz (philanthropy,
 * circumference, schadenfreude).
 */

export type WordRootStufe = "kids" | "teens" | "erwachsen";

/** Nur ein Hinweis für die Lehrkraft - wird beim Abtippen nicht gezeigt. */
export type WordRootHerkunft =
  | "greek"
  | "latin"
  | "french"
  | "german"
  | "italian"
  | "spanish"
  | "arabic"
  | "hindi"
  | "japanese";

export interface WordRootPaar {
  /** Kurze, wahre Umschreibung der Bedeutung - kein Apostroph, kein Bindestrich. */
  clue: string;
  /** Das Wort selbst - ein Einzelwort, keine US/UK-Variantenschreibung. */
  word: string;
  /** Nur für die Lehrkraft (siehe Kopfkommentar) - nicht Teil der Tippzeile. */
  herkunft: WordRootHerkunft;
}

export interface WordRootThema {
  id: string;
  titel: string;
  paare: WordRootPaar[];
}

export const WORD_ROOT_THEMEN: readonly { id: string; titel: string }[] = [
  { id: "numbers", titel: "Numbers and size" },
  { id: "nature", titel: "Science and nature" },
  { id: "people", titel: "People and society" },
  { id: "words", titel: "Words from other languages" },
];

export const WORD_ROOTS: Record<WordRootStufe, WordRootThema[]> = {
  kids: [
    {
      id: "numbers",
      titel: "Numbers and size",
      paare: [
        { clue: "two wheels", word: "bicycle", herkunft: "latin" },
        { clue: "three wheels", word: "tricycle", herkunft: "greek" },
        { clue: "one wheel", word: "unicycle", herkunft: "latin" },
        { clue: "three sided shape", word: "triangle", herkunft: "latin" },
        { clue: "four sided shape", word: "rectangle", herkunft: "latin" },
        { clue: "five sided shape", word: "pentagon", herkunft: "greek" },
        { clue: "six sided shape", word: "hexagon", herkunft: "greek" },
        { clue: "eight sided shape", word: "octagon", herkunft: "greek" },
        { clue: "one horned horse", word: "unicorn", herkunft: "latin" },
        { clue: "eight armed sea animal", word: "octopus", herkunft: "greek" },
        { clue: "hundred years", word: "century", herkunft: "latin" },
        { clue: "ten years", word: "decade", herkunft: "greek" },
        { clue: "one thousand grams", word: "kilogram", herkunft: "greek" },
        { clue: "one thousand years", word: "millennium", herkunft: "latin" },
        { clue: "pair of two", word: "duo", herkunft: "latin" },
        { clue: "group of three", word: "trio", herkunft: "italian" },
        { clue: "group of four", word: "quartet", herkunft: "italian" },
        { clue: "group of five", word: "quintet", herkunft: "italian" },
        { clue: "large group of people", word: "multitude", herkunft: "latin" },
        { clue: "half of a circle", word: "semicircle", herkunft: "latin" },
      ],
    },
    {
      id: "nature",
      titel: "Science and nature",
      paare: [
        { clue: "tool to see far stars", word: "telescope", herkunft: "greek" },
        { clue: "tool to see tiny things", word: "microscope", herkunft: "greek" },
        { clue: "glass tank for fish", word: "aquarium", herkunft: "latin" },
        { clue: "boat that goes underwater", word: "submarine", herkunft: "latin" },
        { clue: "park with wild animals", word: "zoo", herkunft: "greek" },
        { clue: "study of the earth", word: "geography", herkunft: "greek" },
        { clue: "huge extinct reptile", word: "dinosaur", herkunft: "greek" },
        { clue: "study of living things", word: "biology", herkunft: "greek" },
        { clue: "tool that measures heat", word: "thermometer", herkunft: "greek" },
        { clue: "living thing too small to see", word: "microbe", herkunft: "greek" },
        { clue: "person who travels to space", word: "astronaut", herkunft: "greek" },
        { clue: "study of stars and space", word: "astronomy", herkunft: "greek" },
        { clue: "animal that eats plants", word: "herbivore", herkunft: "latin" },
        { clue: "animal that eats meat", word: "carnivore", herkunft: "latin" },
        { clue: "animal that eats everything", word: "omnivore", herkunft: "latin" },
        { clue: "picture taken by a camera", word: "photograph", herkunft: "greek" },
        { clue: "moving staircase", word: "escalator", herkunft: "latin" },
        { clue: "underground train", word: "subway", herkunft: "latin" },
        { clue: "car that moves by itself", word: "automobile", herkunft: "greek" },
        { clue: "air pressure tool", word: "barometer", herkunft: "greek" },
      ],
    },
    {
      id: "people",
      titel: "People and society",
      paare: [
        { clue: "talking machine", word: "telephone", herkunft: "greek" },
        { clue: "picture box that talks", word: "television", herkunft: "greek" },
        { clue: "own signature", word: "autograph", herkunft: "greek" },
        { clue: "life story", word: "biography", herkunft: "greek" },
        { clue: "big book of words", word: "dictionary", herkunft: "latin" },
        { clue: "group living close together", word: "community", herkunft: "latin" },
        { clue: "leader of a country", word: "president", herkunft: "latin" },
        { clue: "person new to a country", word: "immigrant", herkunft: "latin" },
        { clue: "person who studies stars", word: "astronomer", herkunft: "greek" },
        { clue: "person who takes photos", word: "photographer", herkunft: "greek" },
        { clue: "person who writes a book", word: "author", herkunft: "latin" },
        { clue: "leader of a school", word: "principal", herkunft: "latin" },
        { clue: "between many nations", word: "international", herkunft: "latin" },
        { clue: "one single person", word: "individual", herkunft: "latin" },
        { clue: "person who treats the sick", word: "doctor", herkunft: "latin" },
        { clue: "place that treats the sick", word: "hospital", herkunft: "latin" },
        { clue: "person who studies nature", word: "naturalist", herkunft: "latin" },
        { clue: "person who explores places", word: "explorer", herkunft: "latin" },
        { clue: "working together", word: "cooperation", herkunft: "latin" },
        { clue: "fair treatment for all", word: "equality", herkunft: "latin" },
      ],
    },
    {
      id: "words",
      titel: "Words from other languages",
      paare: [
        { clue: "a cook", word: "chef", herkunft: "french" },
        { clue: "a dance style", word: "ballet", herkunft: "french" },
        { clue: "a coffee shop", word: "cafe", herkunft: "french" },
        { clue: "a car shelter", word: "garage", herkunft: "french" },
        { clue: "a garden for children", word: "kindergarten", herkunft: "german" },
        { clue: "a round meat sandwich", word: "hamburger", herkunft: "german" },
        { clue: "a twisted salty snack", word: "pretzel", herkunft: "german" },
        { clue: "a musical instrument", word: "piano", herkunft: "italian" },
        { clue: "a cheesy flat bread", word: "pizza", herkunft: "italian" },
        { clue: "long thin pasta", word: "spaghetti", herkunft: "italian" },
        { clue: "a mountain that erupts", word: "volcano", herkunft: "italian" },
        { clue: "an outdoor courtyard", word: "patio", herkunft: "spanish" },
        { clue: "a spinning storm", word: "tornado", herkunft: "spanish" },
        { clue: "a small biting insect", word: "mosquito", herkunft: "spanish" },
        { clue: "letters instead of numbers", word: "algebra", herkunft: "arabic" },
        { clue: "a soft couch", word: "sofa", herkunft: "arabic" },
        { clue: "soap for washing hair", word: "shampoo", herkunft: "hindi" },
        { clue: "a thick wild forest", word: "jungle", herkunft: "hindi" },
        { clue: "a huge sea wave", word: "tsunami", herkunft: "japanese" },
        { clue: "a martial art", word: "karate", herkunft: "japanese" },
      ],
    },
  ],
  teens: [
    {
      id: "numbers",
      titel: "Numbers and size",
      paare: [
        { clue: "speaks one language", word: "monolingual", herkunft: "latin" },
        { clue: "speaks two languages", word: "bilingual", herkunft: "latin" },
        { clue: "speaks many languages", word: "multilingual", herkunft: "latin" },
        { clue: "decided by one side", word: "unilateral", herkunft: "latin" },
        { clue: "agreed by two sides", word: "bilateral", herkunft: "latin" },
        { clue: "shape with many angles", word: "polygon", herkunft: "greek" },
        { clue: "cut into two parts", word: "bisect", herkunft: "latin" },
        { clue: "cut into three parts", word: "trisect", herkunft: "latin" },
        { clue: "rate out of a hundred", word: "percentage", herkunft: "latin" },
        { clue: "one thousand bytes", word: "kilobyte", herkunft: "greek" },
        { clue: "one million bytes", word: "megabyte", herkunft: "greek" },
        { clue: "one billion bytes", word: "gigabyte", herkunft: "greek" },
        { clue: "far too small to see", word: "microscopic", herkunft: "greek" },
        { clue: "extremely large", word: "gigantic", herkunft: "greek" },
        { clue: "having many sides", word: "multifaceted", herkunft: "latin" },
        { clue: "rank out of a hundred", word: "percentile", herkunft: "latin" },
        { clue: "control by one seller", word: "monopoly", herkunft: "greek" },
        { clue: "race of three sports", word: "triathlon", herkunft: "greek" },
        { clue: "quarter of a circle", word: "quadrant", herkunft: "latin" },
        { clue: "shape with ten sides", word: "decagon", herkunft: "greek" },
      ],
    },
    {
      id: "nature",
      titel: "Science and nature",
      paare: [
        { clue: "green matter in leaves", word: "chlorophyll", herkunft: "greek" },
        { clue: "light into plant food", word: "photosynthesis", herkunft: "greek" },
        { clue: "study of heredity", word: "genetics", herkunft: "greek" },
        { clue: "study of body parts", word: "anatomy", herkunft: "greek" },
        { clue: "study of matter", word: "physics", herkunft: "greek" },
        { clue: "study of chemicals", word: "chemistry", herkunft: "greek" },
        { clue: "living things together", word: "ecosystem", herkunft: "greek" },
        { clue: "layer of gas round earth", word: "atmosphere", herkunft: "greek" },
        { clue: "huge area of land", word: "continent", herkunft: "latin" },
        { clue: "study of weather", word: "meteorology", herkunft: "greek" },
        { clue: "study of old remains", word: "archaeology", herkunft: "greek" },
        { clue: "study of fossils", word: "paleontology", herkunft: "greek" },
        { clue: "animal with no backbone", word: "invertebrate", herkunft: "latin" },
        { clue: "animal with a backbone", word: "vertebrate", herkunft: "latin" },
        { clue: "tiny living thing", word: "microorganism", herkunft: "greek" },
        { clue: "gradual species change", word: "evolution", herkunft: "latin" },
        { clue: "change of form", word: "metamorphosis", herkunft: "greek" },
        { clue: "study of the mind", word: "psychology", herkunft: "greek" },
        { clue: "study of society", word: "sociology", herkunft: "latin" },
        { clue: "living things and their home", word: "ecology", herkunft: "greek" },
      ],
    },
    {
      id: "people",
      titel: "People and society",
      paare: [
        { clue: "rule by the people", word: "democracy", herkunft: "greek" },
        { clue: "rule by one ruler", word: "monarchy", herkunft: "greek" },
        { clue: "rule by a few", word: "oligarchy", herkunft: "greek" },
        { clue: "rule by no one", word: "anarchy", herkunft: "greek" },
        { clue: "love for own country", word: "patriotism", herkunft: "greek" },
        { clue: "moving to a new land", word: "migration", herkunft: "latin" },
        { clue: "stats about people", word: "demographics", herkunft: "greek" },
        { clue: "studies human cultures", word: "anthropologist", herkunft: "greek" },
        { clue: "moral principles", word: "ethics", herkunft: "greek" },
        { clue: "fairness for all", word: "equity", herkunft: "latin" },
        { clue: "freedom to self rule", word: "autonomy", herkunft: "greek" },
        { clue: "large political group", word: "nation", herkunft: "latin" },
        { clue: "represents own country", word: "ambassador", herkunft: "latin" },
        { clue: "large important city", word: "metropolis", herkunft: "greek" },
        { clue: "local town government", word: "municipality", herkunft: "latin" },
        { clue: "legal member of state", word: "citizen", herkunft: "latin" },
        { clue: "count of all people", word: "census", herkunft: "latin" },
        { clue: "system of trade", word: "economy", herkunft: "greek" },
        { clue: "states joined as one", word: "federation", herkunft: "latin" },
        { clue: "leaves own country", word: "emigrant", herkunft: "latin" },
      ],
    },
    {
      id: "words",
      titel: "Words from other languages",
      paare: [
        { clue: "a hired driver", word: "chauffeur", herkunft: "french" },
        { clue: "a wide city street", word: "boulevard", herkunft: "french" },
        { clue: "an outline in shadow", word: "silhouette", herkunft: "french" },
        { clue: "starts a business", word: "entrepreneur", herkunft: "french" },
        { clue: "a travel keepsake", word: "souvenir", herkunft: "french" },
        { clue: "a love of travel", word: "wanderlust", herkunft: "german" },
        { clue: "a noisy knocking ghost", word: "poltergeist", herkunft: "german" },
        { clue: "a lookalike double", word: "doppelganger", herkunft: "german" },
        { clue: "a shop with fine foods", word: "delicatessen", herkunft: "german" },
        { clue: "a musical drama", word: "opera", herkunft: "italian" },
        { clue: "a platform outside", word: "balcony", herkunft: "italian" },
        { clue: "an artist workroom", word: "studio", herkunft: "italian" },
        { clue: "a rain shade", word: "umbrella", herkunft: "italian" },
        { clue: "a public square", word: "plaza", herkunft: "spanish" },
        { clue: "a lively celebration", word: "fiesta", herkunft: "spanish" },
        { clue: "a six-stringed instrument", word: "guitar", herkunft: "spanish" },
        { clue: "the number nought", word: "zero", herkunft: "arabic" },
        { clue: "a plant fibre for cloth", word: "cotton", herkunft: "arabic" },
        { clue: "singing along to music", word: "karaoke", herkunft: "japanese" },
        { clue: "the art of paper folding", word: "origami", herkunft: "japanese" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "numbers",
      titel: "Numbers and size",
      paare: [
        { clue: "relating to numbers", word: "numerical", herkunft: "latin" },
        { clue: "every two years", word: "biennial", herkunft: "latin" },
        { clue: "hundredth anniversary", word: "centennial", herkunft: "latin" },
        { clue: "of a thousand years", word: "millennial", herkunft: "latin" },
        { clue: "every four years", word: "quadrennial", herkunft: "latin" },
        { clue: "ten sport contest", word: "decathlon", herkunft: "greek" },
        { clue: "five sport contest", word: "pentathlon", herkunft: "greek" },
        { clue: "person in their eighties", word: "octogenarian", herkunft: "latin" },
        { clue: "person aged a hundred", word: "centenarian", herkunft: "latin" },
        { clue: "a great number of kinds", word: "multiplicity", herkunft: "latin" },
        { clue: "increase fast in number", word: "proliferate", herkunft: "latin" },
        { clue: "extremely small", word: "infinitesimal", herkunft: "latin" },
        { clue: "too many to count", word: "innumerable", herkunft: "latin" },
        { clue: "the perfect example", word: "quintessential", herkunft: "latin" },
        { clue: "agreed as if one", word: "unanimous", herkunft: "latin" },
        { clue: "an exact copy", word: "duplicate", herkunft: "latin" },
        { clue: "three exact copies", word: "triplicate", herkunft: "latin" },
        { clue: "split into two branches", word: "bifurcate", herkunft: "latin" },
        { clue: "distance round a circle", word: "circumference", herkunft: "latin" },
        { clue: "all sides equal", word: "equilateral", herkunft: "latin" },
      ],
    },
    {
      id: "nature",
      titel: "Science and nature",
      paare: [
        { clue: "breaks down naturally", word: "biodegradable", herkunft: "greek" },
        { clue: "all life on earth", word: "biosphere", herkunft: "greek" },
        { clue: "formed from hot magma", word: "igneous", herkunft: "latin" },
        { clue: "study of heat energy", word: "thermodynamics", herkunft: "greek" },
        { clue: "force that pulls objects", word: "gravity", herkunft: "latin" },
        { clue: "germ that causes disease", word: "pathogen", herkunft: "greek" },
        { clue: "breaking down of food", word: "digestion", herkunft: "latin" },
        { clue: "wearing away of land", word: "erosion", herkunft: "latin" },
        { clue: "underground water layer", word: "aquifer", herkunft: "latin" },
        { clue: "study of the universe", word: "cosmology", herkunft: "greek" },
        { clue: "tiny units of matter", word: "molecules", herkunft: "latin" },
        { clue: "liquid turning to gas", word: "evaporation", herkunft: "latin" },
        { clue: "speeds up a reaction", word: "catalyst", herkunft: "greek" },
        { clue: "study of fungi", word: "mycology", herkunft: "greek" },
        { clue: "animal that hunts prey", word: "predator", herkunft: "latin" },
        { clue: "living without oxygen", word: "anaerobic", herkunft: "greek" },
        { clue: "needing oxygen", word: "aerobic", herkunft: "greek" },
        { clue: "winter animal sleep", word: "hibernation", herkunft: "latin" },
        { clue: "study of earthquakes", word: "seismology", herkunft: "greek" },
        { clue: "shifting earth plates", word: "tectonic", herkunft: "greek" },
      ],
    },
    {
      id: "people",
      titel: "People and society",
      paare: [
        { clue: "rule by officials", word: "bureaucracy", herkunft: "greek" },
        { clue: "rule by the rich", word: "plutocracy", herkunft: "greek" },
        { clue: "rule by religion", word: "theocracy", herkunft: "greek" },
        { clue: "study of human society", word: "anthropology", herkunft: "greek" },
        { clue: "mass killing of a people", word: "genocide", herkunft: "greek" },
        { clue: "giving to help others", word: "philanthropy", herkunft: "greek" },
        { clue: "fear of foreigners", word: "xenophobia", herkunft: "greek" },
        { clue: "fear of small spaces", word: "claustrophobia", herkunft: "greek" },
        { clue: "love of wisdom", word: "philosophy", herkunft: "greek" },
        { clue: "fairness to all sides", word: "impartiality", herkunft: "latin" },
        { clue: "chosen to represent others", word: "delegate", herkunft: "latin" },
        { clue: "shared ownership system", word: "communism", herkunft: "latin" },
        { clue: "private ownership system", word: "capitalism", herkunft: "latin" },
        { clue: "setting people free", word: "liberation", herkunft: "latin" },
        { clue: "studies word origins", word: "etymologist", herkunft: "greek" },
        { clue: "master of persuasive talk", word: "rhetorician", herkunft: "greek" },
        { clue: "groups united for a goal", word: "coalition", herkunft: "latin" },
        { clue: "including everyone", word: "inclusion", herkunft: "latin" },
        { clue: "kept apart from others", word: "isolation", herkunft: "latin" },
        { clue: "building a large empire", word: "imperialism", herkunft: "latin" },
      ],
    },
    {
      id: "words",
      titel: "Words from other languages",
      paare: [
        { clue: "an overused phrase", word: "cliche", herkunft: "french" },
        { clue: "a type of art or music", word: "genre", herkunft: "french" },
        { clue: "deliberate damage", word: "sabotage", herkunft: "french" },
        { clue: "a blending disguise", word: "camouflage", herkunft: "french" },
        { clue: "an arranged meeting", word: "rendezvous", herkunft: "french" },
        { clue: "deep fear or dread", word: "angst", herkunft: "german" },
        { clue: "a sudden fierce attack", word: "blitz", herkunft: "german" },
        { clue: "joy when others fail", word: "schadenfreude", herkunft: "german" },
        { clue: "a strong coffee shot", word: "espresso", herkunft: "italian" },
        { clue: "coffee with milk foam", word: "cappuccino", herkunft: "italian" },
        { clue: "wall writing as art", word: "graffiti", herkunft: "italian" },
        { clue: "a complete failure", word: "fiasco", herkunft: "italian" },
        { clue: "a highly skilled performer", word: "virtuoso", herkunft: "italian" },
        { clue: "a fleet of warships", word: "armada", herkunft: "spanish" },
        { clue: "a small fighting band", word: "guerrilla", herkunft: "spanish" },
        { clue: "a country ruler", word: "sultan", herkunft: "arabic" },
        { clue: "a padded bed base", word: "mattress", herkunft: "arabic" },
        { clue: "a tax on imports", word: "tariff", herkunft: "arabic" },
        { clue: "a small country house", word: "bungalow", herkunft: "hindi" },
        { clue: "a light padded bed mat", word: "futon", herkunft: "japanese" },
      ],
    },
  ],
};

/** Die Zeile eines Paares: zuerst die Umschreibung, dann das Wort - siehe Kopfkommentar. */
export function wordRootZeile(p: WordRootPaar): string {
  return `${p.clue} - ${p.word}`;
}

/**
 * Dieselben Wörter, alphabetisch nach `clue` geordnet - für die Tippchallenge,
 * genau wie `fremdChallengePaare` in `vorlagen.ts` es für die deutschen
 * Fremdwörter tut (dort alphabetisch nach `de`, auf drei Dateien verteilt).
 * Hier bewusst schlicht EIN Feld je Stufe: Eine künftige Verdrahtung in
 * `vorlagen.ts` kann dieselbe Liste in gleich grosse Stücke teilen
 * (`FREMD_CHALLENGE_DATEIEN`-Muster) - das Aufteilen selbst ist reine
 * Anordnung und gehört dorthin, nicht in die Wortdaten.
 */
export const WORD_ROOTS_ALPHABETISCH: Record<WordRootStufe, string[]> = Object.fromEntries(
  (Object.keys(WORD_ROOTS) as WordRootStufe[]).map((stufe) => [
    stufe,
    WORD_ROOTS[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.clue.localeCompare(b.clue, "en"))
      .map(wordRootZeile),
  ]),
) as Record<WordRootStufe, string[]>;
