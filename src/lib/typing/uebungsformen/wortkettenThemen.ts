/**
 * WORTKETTEN NACH THEMA - reine Inhaltsarbeit.
 *
 * Herkunft: eine der Übungsformen aus Testerin Mail (Kollegin, dieselbe
 * Zielgruppe), am 01.09.2026 mit Johannes durchgesprochen
 * (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md` §3, Punkt 9). Diese
 * Datei liefert nur den WORTVORRAT, thematisch geordnet - keine Erzeugung,
 * keine Logik. Sie ist der Baustoff für die Übungsform „Hand-Schwerpunkte"
 * (`handschwerpunkte.ts`), die daraus die Wörter herausfiltert, die sich mit
 * nur einer Hand tippen lassen.
 *
 * `stufen` folgt derselben Etikettierung wie der übrige Inhalts-Wortschatz
 * (`corpusExtras.ts`, `InhaltsStufe`). Die Themen hier sind durchweg
 * einfache Alltagswörter ohne Altersgrenze, deshalb tragen alle Ketten alle
 * drei Etiketten - eine Einschränkung hätte hier keinen erkennbaren Nutzen.
 *
 * Deutsche Nomen groß, echte Umlaute (ä ö ü ß) - Zahlwörter bleiben klein,
 * wie beim Rechnen üblich („eins zwei drei", nicht „Eins Zwei Drei").
 */

export interface Wortkette {
  /** Anzeigename des Themas, z. B. „Tiere" - kein Kind liest ihn direkt. */
  thema: string;
  /** Die Wörter der Kette - mindestens zwölf, ohne Dubletten. */
  woerter: string[];
  /** Für welche Konto-Stufen diese Kette taugt. */
  stufen: ("kids" | "teens" | "erwachsen")[];
}

const ALLE_STUFEN: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_DE: Wortkette[] = [
  {
    thema: "Tiere",
    woerter: ["Hund", "Katze", "Maus", "Vogel", "Fisch", "Pferd", "Kuh", "Uhu", "Feder", "Rasse", "Zoo", "Elefant", "Löwe", "Bär", "Ente"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Küche",
    woerter: ["Tasse", "Wasser", "Teller", "Löffel", "Gabel", "Messer", "Topf", "Pfanne", "Brot", "Milch", "Öl", "Mohn", "Zucker", "Salz", "Ofen"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Wetter",
    woerter: ["Wetter", "Regen", "Sonne", "Wind", "Wolke", "Schnee", "Nebel", "Sturm", "Blitz", "Donner", "Frost", "Hagel", "Regenbogen", "Kälte", "Wärme"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Schule",
    woerter: ["Test", "Kuli", "Heft", "Buch", "Tafel", "Kreide", "Lehrer", "Klasse", "Pause", "Stift", "Radiergummi", "Schultasche", "Note", "Ferien"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Sport",
    woerter: ["Stab", "Ball", "Tor", "Lauf", "Sprung", "Team", "Sieg", "Spiel", "Turnen", "Schwimmen", "Fahrrad", "Seil", "Netz", "Trikot", "Medaille"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Musik",
    woerter: ["Bass", "Note", "Lied", "Trommel", "Flöte", "Gitarre", "Klavier", "Chor", "Rhythmus", "Takt", "Melodie", "Gesang", "Geige", "Harfe"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Werkzeug",
    woerter: ["Hammer", "Säge", "Zange", "Schraube", "Nagel", "Bohrer", "Feile", "Meißel", "Mopp", "Besen", "Schaufel", "Leiter", "Werkbank", "Klebeband"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Kleidung",
    woerter: ["Hose", "Hemd", "Jacke", "Schuh", "Socke", "Mütze", "Schal", "Handschuh", "Kimono", "Knopf", "Gürtel", "Kleid", "Rock", "Mantel"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Körper",
    woerter: ["Kopf", "Bauch", "Arm", "Bein", "Hand", "Fuß", "Auge", "Ohr", "Nase", "Mund", "Kinn", "Bart", "Wade", "Ferse"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Gefühle",
    woerter: ["Freude", "Angst", "Wut", "Mut", "Liebe", "Trauer", "Stolz", "Scham", "Neid", "Sorge", "Hoffnung", "Ruhe", "Spannung", "Erleichterung"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Farben",
    woerter: ["Rot", "Blau", "Gelb", "Grün", "Lila", "Orange", "Braun", "Grau", "Rosa", "Türkis", "Bunt", "Gold", "Silber", "Schwarz", "Weiß"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Zeit",
    woerter: ["Stunde", "Minute", "Sekunde", "Woche", "Monat", "Jahr", "Morgen", "Mittag", "Abend", "Nacht", "Uhr", "Kalender", "Termin", "Frist"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Verkehr",
    woerter: ["Rad", "Auto", "Bus", "Zug", "Straße", "Ampel", "Fußweg", "Bahnhof", "Rollstuhl", "Taxi", "Brücke", "Kreuzung", "Tunnel", "Gleis"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Berufe",
    woerter: ["Lohn", "Lehrer", "Arzt", "Bäcker", "Koch", "Pilot", "Bauer", "Feuerwehr", "Polizei", "Handwerker", "Verkäufer", "Ingenieur", "Gärtner", "Friseur"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Obst und Gemüse",
    woerter: ["Beere", "Erdbeere", "Rebe", "Apfel", "Birne", "Banane", "Kirsche", "Traube", "Karotte", "Tomate", "Kartoffel", "Zwiebel", "Gurke", "Salat", "Kohl"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Wald",
    woerter: ["Ast", "Gras", "Erde", "Pilz", "Baum", "Wurzel", "Moos", "Farn", "Reh", "Fuchs", "Eiche", "Tanne", "Laub", "Specht"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Meer",
    woerter: ["Welle", "Sand", "Strand", "Muschel", "Krabbe", "Qualle", "Boot", "Hafen", "Insel", "Riff", "Alge", "Möwe", "Gezeiten", "Ebbe"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Haus",
    woerter: ["Bett", "Vase", "Klo", "Tür", "Fenster", "Dach", "Keller", "Garten", "Küche", "Bad", "Flur", "Treppe", "Wand", "Boden"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Familie",
    woerter: ["Vater", "Mutter", "Bruder", "Schwester", "Oma", "Opa", "Onkel", "Tante", "Kind", "Baby", "Cousine", "Zwilling", "Gast", "Fest"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Zahlen-in-Worten",
    woerter: ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "hundert"],
    stufen: ALLE_STUFEN,
  },

  // ── Charge 2 (02.09.2026): auf Johannes' Auftrag verdoppelt ──────────
  { thema: "Garten", woerter: ["Beet", "Rasen", "Zaun", "Hecke", "Schaufel", "Rechen", "Gießkanne", "Erde", "Samen", "Wurzel", "Blüte", "Busch", "Kompost", "Schubkarre", "Gartentor"], stufen: ALLE_STUFEN },
  { thema: "Bauernhof", woerter: ["Stall", "Scheune", "Traktor", "Heu", "Stroh", "Weide", "Zaun", "Melken", "Futter", "Hufeisen", "Feld", "Ernte", "Ziege", "Schwein", "Hahn"], stufen: ALLE_STUFEN },
  { thema: "Zirkus", woerter: ["Zelt", "Manege", "Seil", "Ring", "Trommel", "Kostüm", "Fanfare", "Reifen", "Leiter", "Balken", "Ball", "Wagen", "Bühne", "Musik", "Applaus"], stufen: ALLE_STUFEN },
  { thema: "Reisen", woerter: ["Koffer", "Karte", "Ticket", "Gleis", "Hafen", "Zelt", "Rucksack", "Weg", "Grenze", "Reiseziel", "Fähre", "Bus", "Route", "Gepäck", "Ankunft"], stufen: ALLE_STUFEN },
  { thema: "Frühstück", woerter: ["Brot", "Butter", "Marmelade", "Honig", "Ei", "Käse", "Müsli", "Haferflocken", "Semmel", "Joghurt", "Obst", "Teller", "Tasse", "Messer", "Serviette"], stufen: ALLE_STUFEN },
  { thema: "Getränke", woerter: ["Wasser", "Saft", "Milch", "Tee", "Kakao", "Limonade", "Sirup", "Becher", "Krug", "Flasche", "Strohhalm", "Eiswürfel", "Kanne", "Sprudel", "Durst"], stufen: ALLE_STUFEN },
  { thema: "Möbel", woerter: ["Tisch", "Stuhl", "Bett", "Schrank", "Regal", "Sofa", "Hocker", "Kommode", "Lampe", "Teppich", "Vorhang", "Spiegel", "Truhe", "Bank", "Sessel"], stufen: ALLE_STUFEN },
  { thema: "Spielzeug", woerter: ["Ball", "Puppe", "Würfel", "Karten", "Puzzle", "Kreisel", "Reifen", "Seil", "Bausteine", "Murmel", "Rutsche", "Schaukel", "Roller", "Drachen", "Teddy"], stufen: ALLE_STUFEN },
  { thema: "Feste", woerter: ["Kerze", "Kuchen", "Girlande", "Luftballon", "Geschenk", "Karte", "Musik", "Tanz", "Kostüm", "Krapfen", "Laterne", "Feuerwerk", "Gast", "Einladung", "Torte"], stufen: ALLE_STUFEN },
  { thema: "Bäume", woerter: ["Eiche", "Buche", "Ahorn", "Birke", "Linde", "Kastanie", "Fichte", "Tanne", "Kiefer", "Weide", "Erle", "Ulme", "Esche", "Rinde", "Krone"], stufen: ALLE_STUFEN },
  { thema: "Blumen", woerter: ["Rose", "Tulpe", "Nelke", "Lilie", "Veilchen", "Narzisse", "Krokus", "Margerite", "Mohn", "Aster", "Flieder", "Stiel", "Blatt", "Knospe", "Duft"], stufen: ALLE_STUFEN },
  { thema: "Vögel", woerter: ["Amsel", "Meise", "Specht", "Reiher", "Möwe", "Schwalbe", "Star", "Fink", "Rabe", "Taube", "Eule", "Storch", "Feder", "Nest", "Gesang"], stufen: ALLE_STUFEN },
  { thema: "Insekten", woerter: ["Biene", "Wespe", "Hummel", "Ameise", "Käfer", "Fliege", "Mücke", "Libelle", "Grille", "Falter", "Raupe", "Larve", "Flügel", "Fühler", "Stachel"], stufen: ALLE_STUFEN },
  { thema: "Winter", woerter: ["Schnee", "Eis", "Frost", "Schlitten", "Mütze", "Schal", "Handschuh", "Kufe", "Zapfen", "Ofen", "Decke", "Kachel", "Rodel", "Kälte", "Nebel"], stufen: ALLE_STUFEN },
  { thema: "Sommer", woerter: ["Sonne", "Hitze", "Bad", "See", "Sand", "Muschel", "Eis", "Schatten", "Hut", "Wiese", "Zelt", "Grill", "Ferien", "Schwimmen", "Gewitter"], stufen: ALLE_STUFEN },
  { thema: "Backen", woerter: ["Mehl", "Zucker", "Hefe", "Teig", "Rührschüssel", "Blech", "Ofen", "Rolle", "Form", "Waage", "Prise", "Kruste", "Krümel", "Guss", "Streusel"], stufen: ALLE_STUFEN },
  { thema: "Bahnhof", woerter: ["Gleis", "Bahnsteig", "Schiene", "Waggon", "Fahrplan", "Schalter", "Anzeige", "Ansage", "Ausgang", "Halle", "Uhr", "Koffer", "Zug", "Abfahrt", "Ankunft"], stufen: ALLE_STUFEN },
  { thema: "Post", woerter: ["Brief", "Marke", "Umschlag", "Paket", "Karte", "Stempel", "Schalter", "Waage", "Adresse", "Kasten", "Bote", "Sendung", "Formular", "Empfänger", "Absender"], stufen: ALLE_STUFEN },
  { thema: "Arztpraxis", woerter: ["Termin", "Anmeldung", "Wartezimmer", "Karte", "Fieber", "Pflaster", "Salbe", "Verband", "Spritze", "Waage", "Liege", "Rezept", "Husten", "Schnupfen", "Untersuchung"], stufen: ALLE_STUFEN },
  { thema: "Bücherei", woerter: ["Buch", "Regal", "Ausweis", "Rückgabe", "Leihfrist", "Katalog", "Titel", "Seite", "Roman", "Sachbuch", "Hörbuch", "Punktschrift", "Lesesaal", "Tisch", "Ruhe"], stufen: ALLE_STUFEN },
];

export const WORTKETTEN_EN: Wortkette[] = [
  {
    thema: "Animals",
    woerter: ["cat", "dog", "cow", "hippo", "lion", "koi", "bear", "deer", "beaver", "fox", "sheep", "horse", "rabbit", "goat", "duck"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Kitchen",
    woerter: ["milk", "onion", "bread", "cabbage", "water", "sugar", "butter", "cheese", "spoon", "plate", "kettle", "toast", "apple", "carrot"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Weather",
    woerter: ["star", "moon", "rain", "snow", "wind", "cloud", "storm", "frost", "fog", "sunshine", "thunder", "breeze", "drizzle", "hail"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "School",
    woerter: ["test", "eraser", "book", "pencil", "ruler", "desk", "class", "teacher", "lesson", "homework", "chalk", "folder", "marker", "notebook"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Sports",
    woerter: ["hoop", "pool", "team", "ball", "goal", "race", "medal", "coach", "whistle", "jersey", "referee", "stadium", "sprint", "relay"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Colours",
    woerter: ["pink", "grey", "red", "blue", "green", "yellow", "purple", "orange", "brown", "black", "white", "gold", "silver", "khaki"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Family",
    woerter: ["sister", "father", "mother", "brother", "aunt", "uncle", "cousin", "grandma", "grandpa", "baby", "twin", "parent", "nephew", "niece"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Body",
    woerter: ["hip", "beard", "hand", "arm", "leg", "foot", "eye", "ear", "nose", "mouth", "chin", "elbow", "shoulder", "knee"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "House",
    woerter: ["mop", "nook", "igloo", "door", "window", "roof", "kitchen", "garden", "wall", "floor", "ceiling", "chimney", "porch", "attic"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Clothes",
    woerter: ["sweater", "dress", "scarf", "vest", "shirt", "shoe", "sock", "hat", "glove", "jacket", "belt", "skirt", "coat", "button"],
    stufen: ALLE_STUFEN,
  },

  // -- Batch 2 (02.09.2026): brought up to the German level -------------
  { thema: "Garden", woerter: ["fence", "hedge", "lawn", "spade", "rake", "seed", "root", "soil", "bud", "bush", "hose", "shed", "path", "wheelbarrow", "greenhouse"], stufen: ALLE_STUFEN },
  { thema: "Farm", woerter: ["barn", "tractor", "hay", "straw", "field", "gate", "goat", "pig", "hen", "rooster", "stable", "harvest", "fodder", "meadow", "farmer"], stufen: ALLE_STUFEN },
  { thema: "Circus", woerter: ["tent", "ring", "rope", "drum", "hoop", "ladder", "beam", "costume", "stage", "music", "clown", "juggler", "wagon", "trumpet", "applause"], stufen: ALLE_STUFEN },
  { thema: "Travel", woerter: ["suitcase", "map", "ticket", "platform", "harbour", "backpack", "route", "border", "ferry", "coach", "luggage", "arrival", "journey", "passport", "hotel"], stufen: ALLE_STUFEN },
  { thema: "Breakfast", woerter: ["bread", "butter", "jam", "honey", "egg", "cheese", "cereal", "oats", "roll", "yoghurt", "fruit", "plate", "cup", "knife", "napkin"], stufen: ALLE_STUFEN },
  { thema: "Drinks", woerter: ["water", "juice", "milk", "tea", "cocoa", "lemonade", "syrup", "mug", "jug", "bottle", "straw", "ice", "kettle", "thirst", "fizzy"], stufen: ALLE_STUFEN },
  { thema: "Furniture", woerter: ["table", "chair", "bed", "wardrobe", "shelf", "sofa", "stool", "drawer", "lamp", "carpet", "curtain", "mirror", "chest", "bench", "armchair"], stufen: ALLE_STUFEN },
  { thema: "Toys", woerter: ["ball", "doll", "dice", "cards", "puzzle", "hoop", "rope", "bricks", "marble", "slide", "swing", "scooter", "kite", "teddy", "spinner"], stufen: ALLE_STUFEN },
  { thema: "Parties", woerter: ["candle", "cake", "garland", "balloon", "present", "card", "music", "dance", "costume", "lantern", "guest", "invitation", "ribbon", "party", "surprise"], stufen: ALLE_STUFEN },
  { thema: "Trees", woerter: ["oak", "beech", "maple", "birch", "lime", "chestnut", "spruce", "fir", "pine", "willow", "elm", "ash", "bark", "crown", "branch"], stufen: ALLE_STUFEN },
  { thema: "Flowers", woerter: ["rose", "tulip", "lily", "violet", "daisy", "crocus", "poppy", "aster", "lilac", "stem", "leaf", "bud", "scent", "petal", "bloom"], stufen: ALLE_STUFEN },
  { thema: "Birds", woerter: ["blackbird", "sparrow", "woodpecker", "heron", "gull", "swallow", "starling", "finch", "raven", "pigeon", "owl", "stork", "feather", "nest", "song"], stufen: ALLE_STUFEN },
  { thema: "Insects", woerter: ["bee", "wasp", "bumblebee", "ant", "beetle", "fly", "mosquito", "dragonfly", "cricket", "moth", "caterpillar", "larva", "wing", "antenna", "sting"], stufen: ALLE_STUFEN },
  { thema: "Winter", woerter: ["snow", "ice", "frost", "sledge", "hat", "scarf", "glove", "runner", "icicle", "stove", "blanket", "cold", "fog", "mitten", "boots"], stufen: ALLE_STUFEN },
  { thema: "Summer", woerter: ["sun", "heat", "lake", "sand", "shell", "shade", "hat", "meadow", "tent", "grill", "holiday", "swimming", "storm", "towel", "picnic"], stufen: ALLE_STUFEN },
  { thema: "Baking", woerter: ["flour", "sugar", "yeast", "dough", "bowl", "tray", "oven", "roller", "tin", "scales", "pinch", "crust", "crumb", "icing", "sprinkles"], stufen: ALLE_STUFEN },
  { thema: "Station", woerter: ["platform", "rail", "carriage", "timetable", "counter", "display", "announcement", "exit", "hall", "clock", "suitcase", "train", "departure", "arrival", "seat"], stufen: ALLE_STUFEN },
  { thema: "Post office", woerter: ["letter", "stamp", "envelope", "parcel", "card", "counter", "scales", "address", "postbox", "sender", "form", "delivery", "postman", "receipt", "label"], stufen: ALLE_STUFEN },
  { thema: "Doctor", woerter: ["appointment", "waiting", "fever", "plaster", "ointment", "bandage", "scales", "couch", "cough", "cold", "check", "nurse", "surgery", "medicine", "recovery"], stufen: ALLE_STUFEN },
  { thema: "Library", woerter: ["book", "shelf", "card", "return", "catalogue", "title", "page", "novel", "audiobook", "braille", "reading", "table", "quiet", "borrow", "author"], stufen: ALLE_STUFEN },
  { thema: "Music", woerter: ["guitar", "piano", "drum", "flute", "violin", "trumpet", "note", "chord", "rhythm", "song", "choir", "band", "concert", "string", "sound"], stufen: ALLE_STUFEN },
  { thema: "Tools", woerter: ["hammer", "nail", "screw", "saw", "drill", "pliers", "file", "ruler", "tape", "clamp", "bench", "glue", "brush", "chisel", "spanner"], stufen: ALLE_STUFEN },
  { thema: "Feelings", woerter: ["happy", "sad", "angry", "calm", "proud", "shy", "tired", "curious", "brave", "lonely", "excited", "worried", "grateful", "gentle", "cheerful"], stufen: ALLE_STUFEN },
  { thema: "Time", woerter: ["hour", "minute", "second", "morning", "noon", "evening", "night", "today", "tomorrow", "yesterday", "week", "month", "year", "clock", "calendar"], stufen: ALLE_STUFEN },
  { thema: "Traffic", woerter: ["street", "crossing", "signal", "kerb", "pavement", "bicycle", "bus", "tram", "lorry", "helmet", "brake", "corner", "junction", "route", "stop"], stufen: ALLE_STUFEN },
  { thema: "Jobs", woerter: ["teacher", "baker", "doctor", "nurse", "farmer", "driver", "builder", "cook", "gardener", "painter", "tailor", "cleaner", "engineer", "waiter", "librarian"], stufen: ALLE_STUFEN },
  { thema: "Fruit and vegetables", woerter: ["apple", "pear", "plum", "cherry", "grape", "melon", "carrot", "potato", "onion", "bean", "pea", "cabbage", "cucumber", "pepper", "spinach"], stufen: ALLE_STUFEN },
  { thema: "Forest", woerter: ["tree", "moss", "fern", "trunk", "branch", "mushroom", "clearing", "path", "stream", "deer", "fox", "badger", "acorn", "cone", "shade"], stufen: ALLE_STUFEN },
  { thema: "Sea", woerter: ["wave", "shore", "sand", "shell", "crab", "seaweed", "tide", "harbour", "boat", "sail", "anchor", "gull", "cliff", "salt", "current"], stufen: ALLE_STUFEN },
  { thema: "Numbers in words", woerter: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "twenty", "hundred", "thousand"], stufen: ALLE_STUFEN },
];
