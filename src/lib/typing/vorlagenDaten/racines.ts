/**
 * "D'où viennent les mots ?" - das französische Gegenstück zu `fremdwoerter.ts`
 * (Deutsch) und `wordRoots.ts` (Englisch): eine ÜBUNGSVORLAGE zum Abschreiben.
 * Kinder tippen nur ab: Jede Zeile lautet `<indice> - <mot>`. Wer abschreibt,
 * lernt die Wortherkunft nebenbei.
 *
 * ★ E10a (25.09.2026, Bauplan §6.6): gebaut für den Lernweg „fr" - Aufbau wie
 * `WORD_ROOTS` (drei Altersstufen, je Stufe vier Themen), Inhalt komplett neu
 * (KEINE Übersetzung aus `fremdwoerter.ts`/`wordRoots.ts` - andere Wörter,
 * andere Herkünfte, andere Beispiele). Anders als bei `WORD_ROOTS` sind die
 * vier Themen NICHT gleich gross (25/25/20/10 je Stufe, macht 80 je Stufe
 * und 240 insgesamt) - „Racines grecques et latines" ist bewusst der
 * grössere „Kern" (Bauplan §6.6), „Mots de chez nous" bewusst der kleinere:
 * jedes seiner 30 Wörter (10 je Stufe) ist einzeln an Wiktionnaire geprüft
 * (`beleg`), und nur wirklich belegte Regionalismen kamen hinein - lieber
 * kürzer und stimmt, als aufgefüllt und falsch.
 *
 * ── Warum dieses Thema (Beleg, nicht Behauptung) ────────────────────────────
 * Programme du cycle 3 (BO n° 25 du 22.06.2023), rubrique « Enrichir le
 * lexique » : « Comprendre la formation des mots complexes : par dérivation
 * et par composition. - Connaître le sens des principaux préfixes :
 * découvrir des racines latines et grecques. » Et sous « Acquérir
 * l'orthographe lexicale » : « … en s'appuyant sur la formation des mots et
 * leur étymologie. » (Cycle 3 = CE2 à 6e, 8-11 ans - am Original gelesen,
 * siehe BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md §6.6). Belgien, Romandie
 * und Québec sind an dieser Stelle nicht am Original geprüft.
 *
 * ── Aufbau: VIER Themen statt drei (Bauplan nennt drei Gruppen; hier auf vier
 *    Dateien verteilt, damit jede Datei wie bei `WORD_ROOTS` genau 20 Paare
 *    trägt) ───────────────────────────────────────────────────────────────
 *  • „Racines grecques et latines" - der KERN (Bauplan §6.6), darum auf ZWEI
 *    Dateien verteilt (racines-1, racines-2) statt einer: télé-, photo-,
 *    bio-, -phone, -logie, aqua-, multi-, -vore und viele mehr, altersgerecht
 *    von „bicyclette" bis „anthropocentrisme".
 *  • „Mots venus d'ailleurs" - Lehnwörter aus dem Arabischen (chiffre, sucre,
 *    café, algèbre …), Italienischen (piano, opéra …), Englischen (parking,
 *    marketing …), aus afrikanischen Sprachen (gombo, banane, igname …) und
 *    aus Sprachen der ersten Völker Kanadas: der Amérindiens (caribou,
 *    toboggan, mocassin, achigan …) und der Inuit (kayak, anorak - seit
 *    26.09.2026 eigener Wert `inuit`, Prüfbericht M4: die Inuit sind keine
 *    Amérindiens; Wiktionnaire: „de l'inuktitut qajaq" / „annuraaq").
 *  • „Mots de chez nous" - belgicismes (farde, drache, couque …), helvétismes
 *    (natel, poutzer, cheni …), québécismes (dépanneur, magasiner, tuque …)
 *    und africanismes (maquis, bissap, wax, attiéké …) als gleichwertiges
 *    Französisch, nie als „falsch" markiert.
 *
 * ── Zeilenformat ─────────────────────────────────────────────────────────
 * Jede Zeile lautet `${indice} - ${mot}` (dieselbe Form wie `clue - word`).
 * `indice` ist eine kurze, wahre Umschreibung der BEDEUTUNG - nicht der
 * Wurzel selbst (dieselbe Begründung wie bei `wordRoots.ts`: bei Lehnwörtern
 * ohne erkennbare Wurzelbedeutung, z. B. „café" oder „tuque", funktioniert
 * ein Wurzel-Format nicht; die Wurzel/Herkunft steht im Feld `herkunft` für
 * die Lehrkraft).
 *
 * ── Zeilenregeln (Wächter: `tests/tastenflow-vorlage-racines.test.ts`) ──────
 * - `${indice} - ${mot}` hat höchstens 40 Zeichen (Braillezeile: 40 Module).
 * - Erlaubt: Buchstaben (inkl. der französischen Akzentbuchstaben
 *   é è ê à â ô î ù û ç ï ë), Ziffern, Leerzeichen, der gerade Apostroph `'`
 *   und der echte Bindestrich `-` (NUR als Trenner zwischen `indice` und
 *   `mot`, siehe unten). Kein Gedankenstrich, keine geschwungenen
 *   Anführungszeichen, kein Auslassungspunkt (Hausregel).
 * - `mot` ist ein Einzelwort ohne Bindestrich und Leerzeichen; `indice` darf
 *   Leerzeichen und den geraden Apostroph enthalten, aber keinen Bindestrich
 *   und nicht das Wort selbst.
 * - Kein doppeltes Leerzeichen, keine Leerzeichen am Anfang oder Ende.
 * - Kein Wort kommt in zwei Stufen oder innerhalb einer Stufe doppelt vor.
 * - Jedes Paar trägt `herkunft` (grec/latin/arabe/italien/anglais/africain/
 *   amerindien/inuit/belgicisme/helvetisme/quebecisme/africanisme - NUR für die
 *   Lehrkraft, wird beim Abtippen nicht angezeigt) UND `beleg`: die
 *   Wiktionnaire-Seite, an der die Herkunftsangabe geprüft wurde (CC BY-SA
 *   4.0, siehe Bauplan §6.6). Ein Wort ohne geprüften Beleg steht nicht in
 *   dieser Liste.
 * - Neue Rechtschreibung (F4): alle 240 WÖRTER (`mot`) sind in alter UND
 *   neuer Schreibung identisch. In den Hinweisen (`indice`), die genauso
 *   getippt werden, standen zwei alte Formen - seit 26.09.2026 „traineau"
 *   und „évènement" (Prüfbericht M2). Der Wächter über alle fr-Texte
 *   (`tests/tastenflow-neue-rechtschreibung-fr.test.ts`) liest diese Datei mit.
 *
 * ── Woher der Korpus kommt ───────────────────────────────────────────────
 * Redaktionelle Auswahl (wie bei `fremdwoerter.ts`/`wordRoots.ts`: KEINE
 * gemessene Häufigkeitsliste), gegen den oben zitierten Lehrplan und gegen
 * allgemein gebräuchliches Schulvokabular geprüft. „kids" bleibt bei ganz
 * konkreten, sehr geläufigen Wörtern (bicyclette, téléphone, pizza); „teens"
 * bei Schulfach- und Alltagswortschatz (photosynthèse, démocratie,
 * dépanneur); „erwachsen" bei reicherem, abstrakterem Wortschatz
 * (anthropocentrisme, hégémonie, bureaucratie). Jede Herkunftsangabe wurde am
 * 25.09.2026 einzeln an fr.wiktionary.org geprüft (WebFetch auf die
 * jeweilige Wortseite bzw. deren Etymologie-Abschnitt); die geprüfte
 * Seitenadresse steht bei jedem Paar im Feld `beleg`.
 */

export type RacineStufe = "kids" | "teens" | "erwachsen";

/** Nur ein Hinweis für die Lehrkraft - wird beim Abtippen nicht gezeigt. */
export type RacineHerkunft =
  | "grec"
  | "latin"
  | "arabe"
  | "italien"
  | "anglais"
  | "africain"
  | "amerindien"
  | "inuit"
  | "belgicisme"
  | "helvetisme"
  | "quebecisme"
  | "africanisme";

export interface RacinePaar {
  /** Kurze, wahre Umschreibung der Bedeutung - kein Bindestrich, nicht das Wort selbst. */
  indice: string;
  /** Das Wort selbst - ein Einzelwort, kein Bindestrich, kein Leerzeichen. */
  mot: string;
  /** Nur für die Lehrkraft (siehe Kopfkommentar) - nicht Teil der Tippzeile. */
  herkunft: RacineHerkunft;
  /** Die Wiktionnaire-Seite, an der `herkunft` geprüft wurde (CC BY-SA 4.0). */
  beleg: string;
}

export interface RacineThema {
  id: string;
  titel: string;
  paare: RacinePaar[];
}

export const RACINES_THEMEN: readonly { id: string; titel: string }[] = [
  { id: "racines-1", titel: "Racines grecques et latines (1)" },
  { id: "racines-2", titel: "Racines grecques et latines (2)" },
  { id: "ailleurs", titel: "Mots venus d'ailleurs" },
  { id: "chez-nous", titel: "Mots de chez nous" },
];

function w(mot: string): string {
  return `https://fr.wiktionary.org/wiki/${mot}`;
}

export const RACINES: Record<RacineStufe, RacineThema[]> = {
  // ---------------------------------------------------------------- kids (7-10)
  kids: [
    {
      id: "racines-1",
      titel: "Racines grecques et latines (1)",
      paare: [
        { indice: "deux roues", mot: "bicyclette", herkunft: "latin", beleg: w("bicyclette") },
        { indice: "trois roues", mot: "tricycle", herkunft: "grec", beleg: w("tricycle") },
        { indice: "une seule roue", mot: "monocycle", herkunft: "grec", beleg: w("monocycle") },
        { indice: "forme à cinq côtés", mot: "pentagone", herkunft: "grec", beleg: w("pentagone") },
        { indice: "forme à six côtés", mot: "hexagone", herkunft: "grec", beleg: w("hexagone") },
        { indice: "forme à huit côtés", mot: "octogone", herkunft: "grec", beleg: w("octogone") },
        { indice: "parle avec qqn de loin", mot: "téléphone", herkunft: "grec", beleg: w("téléphone") },
        { indice: "montre des images de loin", mot: "télévision", herkunft: "grec", beleg: w("télévision") },
        { indice: "pour voir le tout petit", mot: "microscope", herkunft: "grec", beleg: w("microscope") },
        { indice: "pour voir les étoiles", mot: "télescope", herkunft: "grec", beleg: w("télescope") },
        { indice: "mesure la chaleur", mot: "thermomètre", herkunft: "grec", beleg: w("thermomètre") },
        { indice: "mille grammes", mot: "kilogramme", herkunft: "grec", beleg: w("kilogramme") },
        { indice: "mille mètres", mot: "kilomètre", herkunft: "grec", beleg: w("kilomètre") },
        { indice: "étude des êtres vivants", mot: "biologie", herkunft: "grec", beleg: w("biologie") },
        { indice: "étude de la Terre", mot: "géographie", herkunft: "grec", beleg: w("géographie") },
        { indice: "avance toute seule", mot: "automobile", herkunft: "grec", beleg: w("automobile") },
        { indice: "bassin pour poissons", mot: "aquarium", herkunft: "latin", beleg: w("aquarium") },
        { indice: "immense lézard disparu", mot: "dinosaure", herkunft: "grec", beleg: w("dinosaure") },
        { indice: "voyage dans l'espace", mot: "astronaute", herkunft: "grec", beleg: w("astronaute") },
        { indice: "parc à animaux sauvages", mot: "zoo", herkunft: "grec", beleg: w("zoo") },
        { indice: "forme à quatre côtés", mot: "quadrilatère", herkunft: "latin", beleg: w("quadrilatère") },
        { indice: "copie faite par la lumière", mot: "photocopie", herkunft: "grec", beleg: w("photocopie") },
        { indice: "tempête qui tourne", mot: "cyclone", herkunft: "grec", beleg: w("cyclone") },
        { indice: "salle qui montre le ciel", mot: "planétarium", herkunft: "latin", beleg: w("planétarium") },
        { indice: "être vivant minuscule", mot: "microbe", herkunft: "grec", beleg: w("microbe") },
      ],
    },
    {
      id: "racines-2",
      titel: "Racines grecques et latines (2)",
      paare: [
        { indice: "faite par la lumière", mot: "photographie", herkunft: "grec", beleg: w("photographie") },
        { indice: "partie d'un texte", mot: "paragraphe", herkunft: "grec", beleg: w("paragraphe") },
        { indice: "écrit préparé à l'avance", mot: "programme", herkunft: "grec", beleg: w("programme") },
        { indice: "écriture correcte", mot: "orthographe", herkunft: "grec", beleg: w("orthographe") },
        { indice: "engin qui va sous l'eau", mot: "submersible", herkunft: "latin", beleg: w("submersible") },
        { indice: "grand magasin", mot: "supermarché", herkunft: "latin", beleg: w("supermarché") },
        { indice: "entre plusieurs pays", mot: "international", herkunft: "latin", beleg: w("international") },
        { indice: "déplacer quelque chose", mot: "transporter", herkunft: "latin", beleg: w("transporter") },
        { indice: "port pour les avions", mot: "aéroport", herkunft: "grec", beleg: w("aéroport") },
        { indice: "aile qui tourne", mot: "hélicoptère", herkunft: "grec", beleg: w("hélicoptère") },
        { indice: "mange des plantes", mot: "herbivore", herkunft: "latin", beleg: w("herbivore") },
        { indice: "mange de la viande", mot: "carnivore", herkunft: "latin", beleg: w("carnivore") },
        { indice: "mange de tout", mot: "omnivore", herkunft: "latin", beleg: w("omnivore") },
        { indice: "règle la chaleur", mot: "thermostat", herkunft: "grec", beleg: w("thermostat") },
        { indice: "actionnée par le pied", mot: "pédale", herkunft: "latin", beleg: w("pédale") },
        { indice: "support à trois pieds", mot: "tripode", herkunft: "grec", beleg: w("tripode") },
        { indice: "animal à quatre pattes", mot: "quadrupède", herkunft: "latin", beleg: w("quadrupède") },
        { indice: "marche sur deux pieds", mot: "bipède", herkunft: "latin", beleg: w("bipède") },
        { indice: "petite bête à cent pattes", mot: "centipède", herkunft: "latin", beleg: w("centipède") },
        { indice: "ancien mot pour un vélo", mot: "vélocipède", herkunft: "latin", beleg: w("vélocipède") },
        { indice: "outil qui calcule", mot: "calculatrice", herkunft: "latin", beleg: w("calculatrice") },
        { indice: "fait de deux couleurs", mot: "bicolore", herkunft: "latin", beleg: w("bicolore") },
        { indice: "fait de trois couleurs", mot: "tricolore", herkunft: "latin", beleg: w("tricolore") },
        { indice: "vêtement toujours identique", mot: "uniforme", herkunft: "latin", beleg: w("uniforme") },
        { indice: "traverse l'Atlantique", mot: "transatlantique", herkunft: "latin", beleg: w("transatlantique") },
      ],
    },
    {
      id: "ailleurs",
      titel: "Mots venus d'ailleurs",
      paare: [
        { indice: "symbole d'un nombre", mot: "chiffre", herkunft: "arabe", beleg: w("chiffre") },
        { indice: "aliment qui rend les plats doux", mot: "sucre", herkunft: "arabe", beleg: w("sucre") },
        { indice: "boisson chaude et amère", mot: "café", herkunft: "arabe", beleg: w("café") },
        { indice: "fibre légère pour les tissus", mot: "coton", herkunft: "arabe", beleg: w("coton") },
        { indice: "petit fruit orange et velouté", mot: "abricot", herkunft: "arabe", beleg: w("abricot") },
        { indice: "boisson sucrée et épaisse", mot: "sirop", herkunft: "arabe", beleg: w("sirop") },
        { indice: "grand instrument à touches", mot: "piano", herkunft: "italien", beleg: w("piano") },
        { indice: "petite terrasse en hauteur", mot: "balcon", herkunft: "italien", beleg: w("balcon") },
        { indice: "plat rond garni au four", mot: "pizza", herkunft: "italien", beleg: w("pizza") },
        { indice: "longues pâtes fines", mot: "spaghetti", herkunft: "italien", beleg: w("spaghetti") },
        { indice: "petits papiers de fête", mot: "confetti", herkunft: "italien", beleg: w("confetti") },
        { indice: "jeu de ballon au pied", mot: "football", herkunft: "anglais", beleg: w("football") },
        { indice: "pain garni à emporter", mot: "sandwich", herkunft: "anglais", beleg: w("sandwich") },
        { indice: "rencontre sportive", mot: "match", herkunft: "anglais", beleg: w("match") },
        { indice: "personnage comique de cirque", mot: "clown", herkunft: "anglais", beleg: w("clown") },
        { indice: "légume vert utilisé en cuisine", mot: "gombo", herkunft: "africain", beleg: w("gombo") },
        { indice: "grand cerf du Grand Nord", mot: "caribou", herkunft: "amerindien", beleg: w("caribou") },
        { indice: "petit bateau étroit à pagaie", mot: "kayak", herkunft: "inuit", beleg: w("kayak") },
        { indice: "manteau chaud à capuche", mot: "anorak", herkunft: "inuit", beleg: w("anorak") },
        { indice: "traineau qui glisse", mot: "toboggan", herkunft: "amerindien", beleg: w("toboggan") },
      ],
    },
    {
      id: "chez-nous",
      titel: "Mots de chez nous",
      paare: [
        { indice: "pâtisserie briochée", mot: "couque", herkunft: "belgicisme", beleg: w("couque") },
        { indice: "bonbon violet en cône", mot: "cuberdon", herkunft: "belgicisme", beleg: w("cuberdon") },
        { indice: "téléphone portable", mot: "natel", herkunft: "helvetisme", beleg: w("natel") },
        { indice: "couette épaisse", mot: "duvet", herkunft: "helvetisme", beleg: w("duvet") },
        { indice: "bonnet de laine pour l'hiver", mot: "tuque", herkunft: "quebecisme", beleg: w("tuque") },
        { indice: "plat de frites et fromage", mot: "poutine", herkunft: "quebecisme", beleg: w("poutine") },
        { indice: "bateau qui traverse l'eau", mot: "traversier", herkunft: "quebecisme", beleg: w("traversier") },
        { indice: "petit restaurant en plein air", mot: "maquis", herkunft: "africanisme", beleg: w("maquis") },
        { indice: "boisson rouge et sucrée", mot: "bissap", herkunft: "africanisme", beleg: w("bissap") },
        { indice: "jeu de babyfoot", mot: "kicker", herkunft: "belgicisme", beleg: w("kicker") },
      ],
    },
  ],

  // --------------------------------------------------------------- teens (11-15)
  teens: [
    {
      id: "racines-1",
      titel: "Racines grecques et latines (1)",
      paare: [
        { indice: "plusieurs couleurs", mot: "polychrome", herkunft: "grec", beleg: w("polychrome") },
        { indice: "peur des lieux fermés", mot: "claustrophobie", herkunft: "grec", beleg: w("claustrophobie") },
        { indice: "ordre dans le temps", mot: "chronologie", herkunft: "grec", beleg: w("chronologie") },
        { indice: "étude du cœur", mot: "cardiologie", herkunft: "grec", beleg: w("cardiologie") },
        { indice: "étude de l'eau", mot: "hydrologie", herkunft: "grec", beleg: w("hydrologie") },
        { indice: "peur des hauteurs", mot: "acrophobie", herkunft: "grec", beleg: w("acrophobie") },
        { indice: "sa propre signature", mot: "autographe", herkunft: "grec", beleg: w("autographe") },
        { indice: "le peuple au pouvoir", mot: "démocratie", herkunft: "grec", beleg: w("démocratie") },
        { indice: "spécialiste des roches", mot: "géologue", herkunft: "grec", beleg: w("géologue") },
        { indice: "période de dix ans", mot: "décennie", herkunft: "latin", beleg: w("décennie") },
        { indice: "qui a cent ans", mot: "centenaire", herkunft: "latin", beleg: w("centenaire") },
        { indice: "période de mille ans", mot: "millénaire", herkunft: "latin", beleg: w("millénaire") },
        { indice: "parle deux langues", mot: "bilingue", herkunft: "latin", beleg: w("bilingue") },
        { indice: "parle plusieurs langues", mot: "multilingue", herkunft: "latin", beleg: w("multilingue") },
        { indice: "forme à dix côtés", mot: "décagone", herkunft: "grec", beleg: w("décagone") },
        { indice: "moitié d'une sphère", mot: "hémisphère", herkunft: "grec", beleg: w("hémisphère") },
        { indice: "peur du feu", mot: "pyrophobie", herkunft: "grec", beleg: w("pyrophobie") },
        { indice: "récit d'une vie", mot: "biographie", herkunft: "grec", beleg: w("biographie") },
        { indice: "étude des étoiles", mot: "astronomie", herkunft: "grec", beleg: w("astronomie") },
        { indice: "d'une autre planète", mot: "extraterrestre", herkunft: "latin", beleg: w("extraterrestre") },
        { indice: "élevage en eau", mot: "aquaculture", herkunft: "latin", beleg: w("aquaculture") },
        { indice: "avion qui se pose sur l'eau", mot: "hydravion", herkunft: "grec", beleg: w("hydravion") },
        { indice: "qui a une forme humaine", mot: "anthropomorphe", herkunft: "grec", beleg: w("anthropomorphe") },
        { indice: "climat d'un petit lieu", mot: "microclimat", herkunft: "grec", beleg: w("microclimat") },
        { indice: "mis en valeur en photo", mot: "photogénique", herkunft: "grec", beleg: w("photogénique") },
      ],
    },
    {
      id: "racines-2",
      titel: "Racines grecques et latines (2)",
      paare: [
        { indice: "enregistre les séismes", mot: "sismographe", herkunft: "grec", beleg: w("sismographe") },
        { indice: "message envoyé de loin", mot: "télégramme", herkunft: "grec", beleg: w("télégramme") },
        { indice: "faite avec la lumière", mot: "photosynthèse", herkunft: "grec", beleg: w("photosynthèse") },
        { indice: "gaz autour de la Terre", mot: "atmosphère", herkunft: "grec", beleg: w("atmosphère") },
        { indice: "étude de la chaleur", mot: "thermodynamique", herkunft: "grec", beleg: w("thermodynamique") },
        { indice: "électricité de l'eau", mot: "hydroélectrique", herkunft: "grec", beleg: w("hydroélectrique") },
        { indice: "glisse bien dans l'air", mot: "aérodynamique", herkunft: "grec", beleg: w("aérodynamique") },
        { indice: "être vivant invisible", mot: "microorganisme", herkunft: "grec", beleg: w("microorganisme") },
        { indice: "visible à l'œil nu", mot: "macroscopique", herkunft: "grec", beleg: w("macroscopique") },
        { indice: "outil pour écouter le cœur", mot: "stéthoscope", herkunft: "grec", beleg: w("stéthoscope") },
        { indice: "outil qui garde l'équilibre", mot: "gyroscope", herkunft: "grec", beleg: w("gyroscope") },
        { indice: "tube à motifs changeants", mot: "kaléidoscope", herkunft: "grec", beleg: w("kaléidoscope") },
        { indice: "outil pour voir par-dessus", mot: "périscope", herkunft: "grec", beleg: w("périscope") },
        { indice: "montre ce qui est derrière", mot: "rétroviseur", herkunft: "latin", beleg: w("rétroviseur") },
        { indice: "jour et nuit égaux", mot: "équinoxe", herkunft: "latin", beleg: w("équinoxe") },
        { indice: "jour ou nuit la plus longue", mot: "solstice", herkunft: "latin", beleg: w("solstice") },
        { indice: "dix épreuves sportives", mot: "décathlon", herkunft: "grec", beleg: w("décathlon") },
        { indice: "cinq épreuves sportives", mot: "pentathlon", herkunft: "grec", beleg: w("pentathlon") },
        { indice: "trois épreuves sportives", mot: "triathlon", herkunft: "grec", beleg: w("triathlon") },
        { indice: "en forme d'hexagone", mot: "hexagonal", herkunft: "grec", beleg: w("hexagonal") },
        { indice: "vue sur tout un paysage", mot: "panorama", herkunft: "grec", beleg: w("panorama") },
        { indice: "ligne d'un coin à l'autre", mot: "diagonale", herkunft: "grec", beleg: w("diagonale") },
        { indice: "équilibre entre deux côtés", mot: "symétrie", herkunft: "grec", beleg: w("symétrie") },
        { indice: "aux deux côtés différents", mot: "asymétrique", herkunft: "grec", beleg: w("asymétrique") },
        { indice: "en forme de polygone", mot: "polygonal", herkunft: "grec", beleg: w("polygonal") },
      ],
    },
    {
      id: "ailleurs",
      titel: "Mots venus d'ailleurs",
      paare: [
        { indice: "branche des mathématiques", mot: "algèbre", herkunft: "arabe", beleg: w("algèbre") },
        { indice: "liquide fort et inflammable", mot: "alcool", herkunft: "arabe", beleg: w("alcool") },
        { indice: "lieu où l'on vend des objets", mot: "magasin", herkunft: "arabe", beleg: w("magasin") },
        { indice: "liste des prix", mot: "tarif", herkunft: "arabe", beleg: w("tarif") },
        { indice: "chef de la marine de guerre", mot: "amiral", herkunft: "arabe", beleg: w("amiral") },
        { indice: "évènement imprévu", mot: "hasard", herkunft: "arabe", beleg: w("hasard") },
        { indice: "vêtement qui part de la taille", mot: "jupe", herkunft: "arabe", beleg: w("jupe") },
        { indice: "vêtement sans manches", mot: "gilet", herkunft: "arabe", beleg: w("gilet") },
        { indice: "pour dormir confortablement", mot: "matelas", herkunft: "arabe", beleg: w("matelas") },
        { indice: "science des transformations", mot: "chimie", herkunft: "arabe", beleg: w("chimie") },
        { indice: "grande fête costumée", mot: "carnaval", herkunft: "italien", beleg: w("carnaval") },
        { indice: "avis ou note officielle", mot: "bulletin", herkunft: "italien", beleg: w("bulletin") },
        { indice: "homme ou femme de l'armée", mot: "soldat", herkunft: "italien", beleg: w("soldat") },
        { indice: "montagne qui peut exploser", mot: "volcan", herkunft: "italien", beleg: w("volcan") },
        { indice: "lieu pour garer les voitures", mot: "parking", herkunft: "anglais", beleg: w("parking") },
        { indice: "petit billet d'entrée", mot: "ticket", herkunft: "anglais", beleg: w("ticket") },
        { indice: "tranche de pain grillée", mot: "toast", herkunft: "anglais", beleg: w("toast") },
        { indice: "fruit long et jaune", mot: "banane", herkunft: "africain", beleg: w("banane") },
        { indice: "chaussure souple sans lacet", mot: "mocassin", herkunft: "amerindien", beleg: w("mocassin") },
        { indice: "poisson d'eau douce du Canada", mot: "achigan", herkunft: "amerindien", beleg: w("achigan") },
      ],
    },
    {
      id: "chez-nous",
      titel: "Mots de chez nous",
      paare: [
        { indice: "classeur pour les feuilles", mot: "farde", herkunft: "belgicisme", beleg: w("farde") },
        { indice: "pluie forte et soudaine", mot: "drache", herkunft: "belgicisme", beleg: w("drache") },
        { indice: "grande fête étudiante", mot: "guindaille", herkunft: "belgicisme", beleg: w("guindaille") },
        { indice: "nettoyer à fond", mot: "poutzer", herkunft: "helvetisme", beleg: w("poutzer") },
        { indice: "grand désordre", mot: "cheni", herkunft: "helvetisme", beleg: w("cheni") },
        { indice: "serpillière pour le sol", mot: "panosse", herkunft: "helvetisme", beleg: w("panosse") },
        { indice: "petite épicerie de quartier", mot: "dépanneur", herkunft: "quebecisme", beleg: w("dépanneur") },
        { indice: "faire les magasins", mot: "magasiner", herkunft: "quebecisme", beleg: w("magasiner") },
        { indice: "voiture", mot: "char", herkunft: "quebecisme", beleg: w("char") },
        { indice: "tissu imprimé africain", mot: "wax", herkunft: "africanisme", beleg: w("wax") },
      ],
    },
  ],

  // ------------------------------------------------------------- erwachsen (16+)
  erwachsen: [
    {
      id: "racines-1",
      titel: "Racines grecques et latines (1)",
      paare: [
        { indice: "amour de la sagesse", mot: "philosophie", herkunft: "grec", beleg: w("philosophie") },
        { indice: "étude des humains", mot: "anthropologie", herkunft: "grec", beleg: w("anthropologie") },
        { indice: "étude de l'esprit", mot: "psychologie", herkunft: "grec", beleg: w("psychologie") },
        { indice: "étude de la société", mot: "sociologie", herkunft: "latin", beleg: w("sociologie") },
        { indice: "origine des mots", mot: "étymologie", herkunft: "grec", beleg: w("étymologie") },
        { indice: "erreur d'époque", mot: "anachronisme", herkunft: "grec", beleg: w("anachronisme") },
        { indice: "se croit très important", mot: "mégalomane", herkunft: "grec", beleg: w("mégalomane") },
        { indice: "peur de l'étranger", mot: "xénophobie", herkunft: "grec", beleg: w("xénophobie") },
        { indice: "amour des autres", mot: "philanthropie", herkunft: "grec", beleg: w("philanthropie") },
        { indice: "n'aime pas les humains", mot: "misanthrope", herkunft: "grec", beleg: w("misanthrope") },
        { indice: "à la même distance", mot: "équidistant", herkunft: "latin", beleg: w("équidistant") },
        { indice: "présent partout", mot: "omniprésent", herkunft: "latin", beleg: w("omniprésent") },
        { indice: "tour d'un cercle", mot: "circonférence", herkunft: "latin", beleg: w("circonférence") },
        { indice: "aux côtés tous égaux", mot: "équilatéral", herkunft: "latin", beleg: w("équilatéral") },
        { indice: "tous du même avis", mot: "unanime", herkunft: "latin", beleg: w("unanime") },
        { indice: "qui dure toujours", mot: "perpétuel", herkunft: "latin", beleg: w("perpétuel") },
        { indice: "pouvoir des bureaux", mot: "bureaucratie", herkunft: "grec", beleg: w("bureaucratie") },
        { indice: "pouvoir de la religion", mot: "théocratie", herkunft: "grec", beleg: w("théocratie") },
        { indice: "pouvoir d'un seul", mot: "autocratie", herkunft: "grec", beleg: w("autocratie") },
        { indice: "citoyen du monde", mot: "cosmopolite", herkunft: "grec", beleg: w("cosmopolite") },
        { indice: "l'humain au centre", mot: "anthropocentrisme", herkunft: "grec", beleg: w("anthropocentrisme") },
        { indice: "parle plusieurs langues", mot: "polyglotte", herkunft: "grec", beleg: w("polyglotte") },
        { indice: "calme intérieur constant", mot: "équanimité", herkunft: "latin", beleg: w("équanimité") },
        { indice: "qui agit sur le passé", mot: "rétroactif", herkunft: "latin", beleg: w("rétroactif") },
        { indice: "qui a une forme animale", mot: "zoomorphe", herkunft: "grec", beleg: w("zoomorphe") },
      ],
    },
    {
      id: "racines-2",
      titel: "Racines grecques et latines (2)",
      paare: [
        { indice: "domination sur les autres", mot: "hégémonie", herkunft: "grec", beleg: w("hégémonie") },
        { indice: "semble contredire le bon sens", mot: "paradoxe", herkunft: "grec", beleg: w("paradoxe") },
        { indice: "mot de même sens", mot: "synonyme", herkunft: "grec", beleg: w("synonyme") },
        { indice: "mot de sens contraire", mot: "antonyme", herkunft: "grec", beleg: w("antonyme") },
        { indice: "même forme mais autre sens", mot: "homonyme", herkunft: "grec", beleg: w("homonyme") },
        { indice: "faux nom", mot: "pseudonyme", herkunft: "grec", beleg: w("pseudonyme") },
        { indice: "mot fait d'initiales", mot: "acronyme", herkunft: "grec", beleg: w("acronyme") },
        { indice: "regard sur le passé", mot: "rétrospective", herkunft: "latin", beleg: w("rétrospective") },
        { indice: "tourné vers l'avenir", mot: "prospectif", herkunft: "latin", beleg: w("prospectif") },
        { indice: "regard tourné vers soi", mot: "introspection", herkunft: "latin", beleg: w("introspection") },
        { indice: "prudent et attentif", mot: "circonspect", herkunft: "latin", beleg: w("circonspect") },
        { indice: "qui a plusieurs sens", mot: "équivoque", herkunft: "latin", beleg: w("équivoque") },
        { indice: "deux valeurs opposées", mot: "ambivalent", herkunft: "latin", beleg: w("ambivalent") },
        { indice: "utile de plusieurs façons", mot: "polyvalent", herkunft: "latin", beleg: w("polyvalent") },
        { indice: "qui peut tout faire", mot: "omnipotent", herkunft: "latin", beleg: w("omnipotent") },
        { indice: "apprend tout seul", mot: "autodidacte", herkunft: "grec", beleg: w("autodidacte") },
        { indice: "né sur sa propre terre", mot: "autochtone", herkunft: "grec", beleg: w("autochtone") },
        { indice: "immense pierre dressée", mot: "mégalithe", herkunft: "grec", beleg: w("mégalithe") },
        { indice: "bloc de pierre unique", mot: "monolithe", herkunft: "grec", beleg: w("monolithe") },
        { indice: "étude des fossiles", mot: "paléontologie", herkunft: "grec", beleg: w("paléontologie") },
        { indice: "sans nom connu", mot: "anonyme", herkunft: "grec", beleg: w("anonyme") },
        { indice: "nom de famille", mot: "patronyme", herkunft: "grec", beleg: w("patronyme") },
        { indice: "étude des noms de lieux", mot: "toponymie", herkunft: "grec", beleg: w("toponymie") },
        { indice: "qui va vers l'arrière", mot: "rétrograde", herkunft: "latin", beleg: w("rétrograde") },
        { indice: "supérieur aux autres", mot: "prééminent", herkunft: "latin", beleg: w("prééminent") },
      ],
    },
    {
      id: "ailleurs",
      titel: "Mots venus d'ailleurs",
      paare: [
        { indice: "souverain d'un pays musulman", mot: "sultan", herkunft: "arabe", beleg: w("sultan") },
        { indice: "point le plus haut du ciel", mot: "zénith", herkunft: "arabe", beleg: w("zénith") },
        { indice: "point le plus bas du ciel", mot: "nadir", herkunft: "arabe", beleg: w("nadir") },
        { indice: "ancêtre ancien de la chimie", mot: "alchimie", herkunft: "arabe", beleg: w("alchimie") },
        { indice: "potion magique qui guérit", mot: "élixir", herkunft: "arabe", beleg: w("élixir") },
        { indice: "attaque surprise avec pillage", mot: "razzia", herkunft: "arabe", beleg: w("razzia") },
        { indice: "épice jaune et parfumée", mot: "safran", herkunft: "arabe", beleg: w("safran") },
        { indice: "matière noire pour les routes", mot: "goudron", herkunft: "arabe", beleg: w("goudron") },
        { indice: "œuvre musicale et théâtrale", mot: "opéra", herkunft: "italien", beleg: w("opéra") },
        { indice: "peinture faite sur un mur", mot: "fresque", herkunft: "italien", beleg: w("fresque") },
        { indice: "dessins faits sur les murs", mot: "graffiti", herkunft: "italien", beleg: w("graffiti") },
        { indice: "organisation criminelle secrète", mot: "mafia", herkunft: "italien", beleg: w("mafia") },
        { indice: "musicien extrêmement habile", mot: "virtuose", herkunft: "italien", beleg: w("virtuose") },
        { indice: "chant donné le soir", mot: "sérénade", herkunft: "italien", beleg: w("sérénade") },
        { indice: "art de vendre un produit", mot: "marketing", herkunft: "anglais", beleg: w("marketing") },
        { indice: "personne qui finance", mot: "sponsor", herkunft: "anglais", beleg: w("sponsor") },
        { indice: "capacité à diriger", mot: "leadership", herkunft: "anglais", beleg: w("leadership") },
        { indice: "groupe de pression", mot: "lobby", herkunft: "anglais", beleg: w("lobby") },
        { indice: "racine tropicale qu'on mange", mot: "igname", herkunft: "africain", beleg: w("igname") },
        { indice: "dommage subi par un bateau", mot: "avarie", herkunft: "arabe", beleg: w("avarie") },
      ],
    },
    {
      id: "chez-nous",
      titel: "Mots de chez nous",
      paare: [
        { indice: "pourboire ou argent reçu", mot: "dringuelle", herkunft: "belgicisme", beleg: w("dringuelle") },
        { indice: "chicorée blanche", mot: "witloof", herkunft: "belgicisme", beleg: w("witloof") },
        { indice: "plein d'énergie", mot: "spitant", herkunft: "belgicisme", beleg: w("spitant") },
        { indice: "distributeur de billets", mot: "bancomat", herkunft: "helvetisme", beleg: w("bancomat") },
        { indice: "apéritif entre amis", mot: "verrée", herkunft: "helvetisme", beleg: w("verrée") },
        { indice: "promotion sur un produit", mot: "action", herkunft: "helvetisme", beleg: w("action") },
        { indice: "collège avant l'université", mot: "cégep", herkunft: "quebecisme", beleg: w("cégep") },
        { indice: "moment où le jour baisse", mot: "brunante", herkunft: "quebecisme", beleg: w("brunante") },
        { indice: "déranger quelqu'un", mot: "achaler", herkunft: "quebecisme", beleg: w("achaler") },
        { indice: "semoule de manioc", mot: "attiéké", herkunft: "africanisme", beleg: w("attiéké") },
      ],
    },
  ],
};

/** Die Zeile eines Paares: zuerst die Umschreibung, dann das Wort - siehe Kopfkommentar. */
export function racineZeile(p: RacinePaar): string {
  return `${p.indice} - ${p.mot}`;
}

/**
 * Dieselben Wörter, alphabetisch nach `indice` geordnet - für den Défi, genau
 * wie {@link WORD_ROOTS_ALPHABETISCH} es für die englischen Word roots tut.
 */
export const RACINES_ALPHABETISCH: Record<RacineStufe, string[]> = Object.fromEntries(
  (Object.keys(RACINES) as RacineStufe[]).map((stufe) => [
    stufe,
    RACINES[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indice.localeCompare(b.indice, "fr"))
      .map(racineZeile),
  ]),
) as Record<RacineStufe, string[]>;
