/**
 * ENGLISCHE WISSENS-CHARGE I4 - "Welt der Dinge" (28.08.2026)
 *
 * ANLASS (gemessen am 28.08.2026, nicht geschätzt - Zahlen aus dem Auftragsbuch
 * der Charge I4): Der deutsche Korpus zählt 2.482 Bausteine, davon 344 vom Typ
 * `fakt` und 198 vom Typ `wissen`. Der englische Korpus zählt 1.786 Bausteine,
 * davon nur 125 `fakt` und 168 `wissen`. Ein Kind, das auf Englisch übt, bekommt
 * im Bereich „Wissenswertes" also deutlich weniger zu lesen als ein Kind, das auf
 * Deutsch übt. Diese Datei trägt 75 Zeilen zum Schließen dieser Lücke bei; eine
 * zweite Datei derselben Charge deckt Natur, Tiere, Wetter, Erde, Weltraum und
 * Körper ab.
 *
 * WAS DRIN IST - neun Bereiche, bewusst abseits der Natur-Themen, die der Bestand
 * schon reichlich hat:
 *   Technik und wie Dinge funktionieren (21) · Alltag und Stadt (8) ·
 *   Verkehr (11) · Sport (5) · Musik (7) · Sprache und Schrift (6) ·
 *   Handwerk und Werkstoffe (8) · Ernährung und Landwirtschaft (9).
 *   Sorten: 50 `fakt` (ein kurzer, prüfbarer Satz) und 25 `wissen` (ein
 *   erklärter Zusammenhang).
 *
 * WIE BELEGT WURDE - die Regel dieser Charge: JEDE Zeile ist an ZWEI voneinander
 * unabhängigen Quellen geprüft; die beiden stehen im Klartext in
 * `herkunft.fundstelle`, mit Abrufdatum. Nie zweimal dieselbe Datenbank, nie
 * Wikipedia gegen Wikipedia. Herangezogen wurden unter anderem: Science Museum
 * Group, Royal Institution, Computer History Museum, Britannica, Royal Museums
 * Greenwich, Ordnance Survey, Royal Geographical Society, National Physical
 * Laboratory, Institution of Mechanical Engineers, ASME, ISO, ANSI, Galvanizers
 * Association UK und Australia, Library of Congress (NLS), RNIB, Oxford English
 * Dictionary, National Football Museum, International Paralympic Committee,
 * Canal and River Trust, English Heritage, Historic England, Royal Society of
 * Chemistry, International Dairy Foods Association, Yamaha Musical Instrument
 * Guide, Classic FM, WQXR, Penn State MATSE, Oregon State University Libraries.
 *
 * ZAHLEN: Ziffern sind im Text verboten, Zahlwörter werden ausgeschrieben. Wo
 * eine Zahl schnell veraltet (Rekorde, Messwerte eines Jahres, Nutzerzahlen),
 * steht hier gar keine Zahl oder eine robuste Größenordnung - lieber „many miles"
 * als ein Wert, der in zwei Jahren falsch ist. Aus demselben Grund steht in der
 * Zeile über Glasfasern NICHT mehr „dünner als ein Haar": die übliche Faser ist
 * mit ihrem Mantel dicker als ein Haar, die verbreitete Redensart ist also
 * ungenau.
 *
 * KEINE ZEILE FÜR ALLE DREI STUFEN - und warum das eine Regel ist, keine Laune:
 * `tests/typing-altersgrenze.test.ts` führt eine RATSCHE auf der Schnittmenge
 * `kids ∩ erwachsen`: wie viele Bausteine gleichzeitig einer Siebenjährigen und
 * einem Erwachsenen serviert werden dürfen, darf nur SINKEN. Die mittlere Stufe
 * `teens` teilt sich naturgemäß mit beiden Nachbarn - das ist ihr Zweck -, die
 * beiden äußeren aber nicht. Eine Zeile für `kids` UND `erwachsen` ist fast
 * immer ein Zeichen dafür, dass die Rahmung nicht zu Ende gedacht wurde. Der
 * erste Stand dieser Datei brachte 25 solcher Zeilen mit und hat die Ratsche
 * gerissen; sie sind einzeln nachgezogen worden, nicht im Rundumschlag.
 *
 * WARUM WELCHE ZEILE BEI WELCHER STUFE STEHT - das Trennkriterium:
 *   • `["kids","teens"]` (43 Zeilen): anschaulich und zum Staunen, ohne
 *     Vorwissen und ohne Fachwort. Wie Dinge funktionieren, Sport,
 *     Musikinstrumente, einfache Erfindungen, Verkehr, Essen - der Ziegel im
 *     Brennofen, die Glocken im Goalball, die kurze Saite, die höher klingt,
 *     Louis Braille mit fünfzehn, das Fahrrad mit zwei gleich großen Rädern.
 *   • `["teens","erwachsen"]` (32 Zeilen): trägt einen erklärten Zusammenhang,
 *     ein Fachwort oder ein Stück Vorwissen. Normung, Elektrotechnik,
 *     Werkstoffkunde, Sprach-, Wirtschafts- und Technikgeschichte, alles mit
 *     einem „weil" - Opferanode beim Verzinken, Paketvermittlung, Normgewinde,
 *     Abbinden von Zement, Spurweite, die Uhr, die auf See den Längengrad
 *     verrät.
 *   Grenzfälle wurden zur Kinderstufe hin entschieden, wenn ein Kind die Sache
 *   selbst anfassen kann (Gurt, Filz, Käse), und zur Erwachsenenstufe hin,
 *   sobald ein Schritt Deutung dazwischenliegt (Gaslicht „lange bevor",
 *   Glockenguss auf der Drehbank, Salz zieht Wasser „und so hält es").
 *   Dass die Kinderstufe hier überwiegt, ist kein Versehen: 33 der 75 Zeilen
 *   sind bauartbedingt auf T2 geschrieben, also in sehr einfachem Satzbau ohne
 *   `p q v x y z` - diese Sprache gehört nach vorne.
 *
 * ZEICHENSATZ: britisches Englisch (harbour, colour, realise, lorry, metre).
 * Kein Apostroph, keine Anführungszeichen, keine Ziffern, keine Klammern; als
 * Satzzeichen nur `. , - ? ! : ;` und ausschließlich der einfache Bindestrich.
 * Zeilenlänge vierzig bis fünfundsechzig Zeichen, ein Satz je Zeile.
 *
 * TIER-VERTEILUNG: 33 der 75 Zeilen sind auf T2 tippbar, also ganz ohne
 * `p q v x y z`. Das war der eigentliche Auftrag, denn die frühen Sprossen sind
 * auf Englisch fast leer. Was auf T2 fehlt und was hier stattdessen getragen hat:
 *   „people" ⇒ „farmers", „sailors", „a team"; „have" ⇒ „has"/„holds";
 *   „over" ⇒ „along"/„across"; „very" ⇒ „far"; „they/you" ⇒ Sache als Subjekt;
 *   „copper/zinc/bronze/pipe/paper/pump" ⇒ „steel", „iron", „metal", „glass";
 *   „whey" ⇒ „solid curd"; „gravel" ⇒ „large and small stones";
 *   „oven" ⇒ „a fire at home"; „ship" ⇒ „boat"; „crop" ⇒ „what a field grows";
 *   „lorry/year/day" ⇒ gar nicht (y), „next/box" ⇒ gar nicht (x).
 *
 * INHALTLICHES: nichts politisch Strittiges, nichts Religiöses, nichts
 * Gruseliges; kein Krieg, keine Waffen, keine Markennamen als Held der Zeile.
 * Wo Behinderung vorkommt, gilt Person zuerst. Kein Maus-Vokabular - die Zeile
 * über die Tastatur spricht vom Tippen, nie vom Zeigegerät.
 *
 * Entdoppelt gegen den GESAMTEN englischen Bestand (1.786 Bausteine), inhaltlich
 * und nicht nur wörtlich. Append-only an CORPUS_EN anhängen - die Registrierung
 * in `corpus.ts` und der Korpus-Anker sind Sache des Chefs, damit die
 * Baustein-Indizes des No-Repeat-Ledgers stabil bleiben.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];

/**
 * Selbst verfasste Zeile mit doppeltem Beleg: zwei voneinander unabhängige
 * Quellen plus Abrufdatum. Der Text ist eigenes Werk, die AUSSAGE ist geprüft.
 */
const EIGEN = (q1: string, q2: string): Herkunft => ({
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
  fundstelle: `${q1} · ${q2} · abgerufen 28.08.2026`,
  // Die Fundstelle bleibt deutsch (Prüf-Vermerk je Zeile, nicht Teil von
  //  `en`) - SerienTrainer zeigt in der englischen Bedienung nur eine
  //  reine URL an, keinen Prüfsatz; siehe dortiger Kommentar (24.09.2026).
  en: {
    quelle: "Sensorik",
    lizenz: "Own work (self-written)",
    autor: "Sensorik learning platform",
  },
});

export const EN_I4_WELT_CORPUS: CorpusItem[] = [
  // ---- Technik und wie Dinge funktionieren ----
  {
    text: "Steel is iron with a small amount of carbon in it.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Science Museum Group, Sammlung Bessemer converter und Sample of Bessemer Steel",
      "Britannica, Eintrag Bessemer process",
    ),
  },
  {
    text: "Faraday found that a moving magnet can make a current.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Royal Institution, Sammlungsobjekt Michael Faradays generator",
      "Computer History Museum, Storage Engine: Faraday describes electro-magnetic induction",
    ),
  },
  {
    text: "Nearly all our electricity still rests on what Faraday found.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Royal Institution, Sammlungsobjekt Michael Faradays generator",
      "Royal Society, Philosophical Transactions A: The birth of the electric machines",
    ),
  },
  {
    text: "The transistor takes its name from transfer and resistor.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Computer History Museum, Silicon Engine: Invention of the Point-Contact Transistor",
      "Britannica, Eintrag Transistor - Innovation at Bell Labs",
    ),
  },
  {
    text: "Packet switching was worked out at a laboratory in Teddington.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "National Physical Laboratory, Rubrik Famous: Donald Davies",
      "Britannica, Eintrag Donald Davies",
    ),
  },
  {
    text: "An optical fibre is a glass core wrapped in a second glass.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Britannica, Eintrag Fiber optics",
      "Nature Materials, Milestone The birth of optical communications",
    ),
  },
  {
    text: "Glass fibres keep light inside by reflecting it off the wall.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Britannica, Eintrag Fiber optics - total internal reflection",
      "Nature Materials, Milestone The birth of optical communications",
    ),
  },
  {
    text: "Light runs for miles along a fine thread of glass.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Fiber optics",
      "The Conversation, Fachbeitrag Sixty years of fiber optics",
    ),
  },
  {
    text: "Cables on the sea floor link one land to another.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Telegraph - the Atlantic cable",
      "History, Rubrik Telegraph and Morse Code",
    ),
  },
  {
    text: "In Morse code the commonest letters got the shortest signs.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "History, Rubrik Morse Code and Telegraph",
      "The Conversation, Fachbeitrag Morse code marks one hundred and seventy-five years",
    ),
  },
  {
    text: "A telegraph key sent every letter as short and long pulses.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "History, Rubrik Morse Code and Telegraph",
      "Early Radio History, Quellensammlung Telegraphic Codes",
    ),
  },
  {
    text: "The first cable across the Atlantic carried telegraph signals.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "History, Rubrik Telegraph",
      "Britannica, Eintrag Transatlantic telegraph cable",
    ),
  },
  {
    text: "A lighthouse lens is built from rings of glass.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "United States Lighthouse Society, Aufsatz The Fresnel Lens von Thomas Tag",
      "American Ceramic Society, Beitrag Fresnel lenses in the maritime industry",
    ),
  },
  {
    text: "A lighthouse beam can be seen many miles out to sea.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "St Augustine Lighthouse and Maritime Museum, Rubrik Lighthouse Technology: Fresnel Lens",
      "United States Lighthouse Society, Aufsatz The Fresnel Lens",
    ),
  },
  {
    text: "A good clock at sea told sailors how far west a boat was.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Royal Museums Greenwich, Rubrik Harrisons clocks and the longitude problem",
      "Britannica, Eintrag John Harrison",
    ),
  },
  {
    text: "Harrison built sea clocks to solve the longitude puzzle.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Royal Museums Greenwich, Rubrik Longitude found",
      "Britannica, Eintrag John Harrison, British horologist",
    ),
  },
  {
    text: "A spirit level works because a bubble always climbs to the top.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Britannica, Eintrag Level, surveying instrument",
      "Science Museum Group, Sammlung Spirit levels",
    ),
  },
  {
    text: "Machines got easier to mend once screws were all the same.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Institution of Mechanical Engineers, Archiv Sir Joseph Whitworth",
      "ASME, Engineering History Landmark The United States Standard Screw Threads",
    ),
  },
  {
    text: "Whitworth gave engineering its first national screw thread.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Institution of Mechanical Engineers, Archiv Sir Joseph Whitworth",
      "ASME, Engineering History Landmark The United States Standard Screw Threads",
    ),
  },
  {
    text: "The keyboard you type on today grew out of the typewriter.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Library of Congress, Inside Adams: There will always be a QWERTY",
      "University of Wisconsin, Lehrmaterial Origins of the QWERTY Keyboard",
    ),
  },
  {
    text: "The QWERTY layout comes from an early typewriter.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Library of Congress, Inside Adams: There will always be a QWERTY",
      "University of Wisconsin, Lehrmaterial Origins of the QWERTY Keyboard",
    ),
  },

  // ---- Alltag und Stadt ----
  {
    text: "Sewers dug under London long ago are still at work.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Institution of Civil Engineers, Rubrik Sir Joseph Bazalgette",
      "Historic England, Blogbeitrag The Story of Londons Sewer System",
    ),
  },
  {
    text: "Gas lit our streets long before electric light did.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Britannica, Eintrag Street lighting",
      "London Museum, Sammlungsgeschichte Gaslight in the city",
    ),
  },
  {
    text: "A Roman water channel fell just a little along each mile.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Britannica, Eintrag Aqueduct, engineering",
      "Groundwater, Fachaufsatz The Aqueducts and Water Supply of Ancient Rome",
    ),
  },
  {
    text: "A greenhouse holds the warmth of the sun inside the glass.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Greenhouse, horticulture",
      "Royal Horticultural Society, Ratgeber Greenhouse growing",
    ),
  },
  {
    text: "Bricks harden in a kiln far hotter than a fire at home.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Brick and tile - firing",
      "American Ceramic Society, Beitrag The urban fabric of brick",
    ),
  },
  {
    text: "The oldest bricks of all were simply mud dried in the sun.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "American Ceramic Society, Beitrag The urban fabric of brick, Teil zwei",
      "Britannica, Eintrag Brick and tile - early history",
    ),
  },
  {
    text: "Contour lines on a map join points that lie at equal height.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Ordnance Survey GetOutside, Leitfaden Understanding Contour Lines",
      "Royal Geographical Society, Unterrichtsmaterial Map skills",
    ),
  },
  {
    text: "Contour lines packed close together warn you of a steep slope.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Ordnance Survey, Handreichung Map Reading",
      "Royal Geographical Society, Unterrichtsmaterial Map skills",
    ),
  },

  // ---- Verkehr ----
  {
    text: "A canal lock lifts a boat with nothing but water.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Canal and River Trust, Rubrik How does a canal lock work",
      "Britannica, Eintrag Canals and inland waterways - locks",
    ),
  },
  {
    text: "Roman roads were laid in beds of large and small stones.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "English Heritage, Rubrik Roads in Roman Britain",
      "Britannica, Eintrag Roman road system",
    ),
  },
  {
    text: "Red and green ruled the traffic before amber came in.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "History, Rubrik First electric traffic signal installed",
      "Kittelson and Associates, Fachbeitrag A history of the electric traffic signal",
    ),
  },
  {
    text: "A zebra crossing takes its name from its black and white stripes.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Roads.org.uk, Rubrik Pedestrian Crossings: Black and white",
      "Transport Research Laboratory, Geschichte der Fußgängerüberwege",
    ),
  },
  {
    text: "A seat belt holds the chest and the waist at the same time.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Deutsches Patent- und Markenamt, Meilenstein Dreipunkt-Sicherheitsgurt",
      "National Inventors Hall of Fame, Eintrag Nils Bohlin and the safety belt",
    ),
  },
  {
    text: "Trains in most of the world run on one width of track.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Britannica, Eintrag Standard gauge",
      "Linda Hall Library, Ausstellung The Transcontinental Railroad: Rail Gauge",
    ),
  },
  {
    text: "A shipping container fits a ship, a train and a lorry alike.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "ISO, Beitrag Boxing clever: how standardization built a global economy",
      "ANSI Blog, Beitrag Series One Freight Containers, ISO 668",
    ),
  },
  {
    text: "One agreed box size changed the way the whole world trades.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "ISO, Beitrag Boxing clever: how standardization built a global economy",
      "ANSI Blog, Beitrag Series One Freight Containers, ISO 668",
    ),
  },
  {
    text: "The safety bicycle gave both wheels the same size and a chain.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Science Museum Group, Objekt Rover Safety Bicycle, 1885",
      "Britannica, Eintrag Bicycle - the safety bicycle",
    ),
  },
  {
    text: "A chain carries the work of the pedals to the back wheel.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Science Museum Group, Objekt Rover Safety Bicycle, 1885",
      "Britannica, Eintrag Bicycle - chain drive",
    ),
  },
  {
    text: "A bicycle wheel holds a load because its spokes pull tight.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Harvard Center for Astrophysics, Fachnotiz Hubs hang from the rim",
      "US-Patentschrift Tensioned spoked bicycle wheel assembly and hub therefor",
    ),
  },

  // ---- Sport ----
  {
    text: "One set of rules in London made football one game.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "National Football Museum, Sammlungsstück The Laws of the Game, 1863",
      "FIFA Museum, Beitrag The quest for a universal code of football laws",
    ),
  },
  {
    text: "The marathon owes its exact length to a race held in London.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Why Is a Marathon Twenty-six Point Two Miles",
      "Sportarchiv 1908 Olympic Marathon Centenary, Streckenbeschreibung",
    ),
  },
  {
    text: "The ball in goalball holds bells that can be heard.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "International Paralympic Committee, Rubrik Goalball: about the sport",
      "Canadian Paralympic Committee, Sportporträt Goalball",
    ),
  },
  {
    text: "Goalball is played in silence so that the players can listen.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "International Paralympic Committee, Rubrik Goalball: how it is played",
      "Olympics.com, Beitrag Goalball, a para sport played in complete silence",
    ),
  },
  {
    text: "On a tandem the pilot steers and the rider behind adds power.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "APH ConnectCenter, Rubrik Tandem Bicycling for People Who are Blind or Low Vision",
      "Vision Sports Ireland, Rubrik Tandem Cycling",
    ),
  },

  // ---- Musik ----
  {
    text: "An orchestra takes its first note from the oboe.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Yamaha Hub, Rubrik Why does the oboe lead the orchestra in tuning",
      "Classic FM, Musiktheorie: Why do orchestras tune to an A",
    ),
  },
  {
    text: "An oboe is chosen for tuning because its pitch barely shifts.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Yamaha Hub, Rubrik Why does the oboe lead the orchestra in tuning",
      "phys.org, Fachbeitrag Why is the oboe used to tune an orchestra",
    ),
  },
  {
    text: "The pitch that orchestras tune to was agreed at a London meeting.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "WQXR, Rubrik How To Classical: Why do we tune to that A",
      "Classic FM, Musiktheorie: Why do orchestras tune to an A",
    ),
  },
  {
    text: "A shorter string sounds higher than a long one.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Sound - vibrating strings",
      "Euphonics, Lehrtext zur Akustik von Saiten und Glocken",
    ),
  },
  {
    text: "A piano holds far more strings than it has keys.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Yamaha Musical Instrument Guide, Piano-Trivia zur Zahl der Tasten",
      "Classic FM, Rubrik Why does a piano have eighty-eight keys",
    ),
  },
  {
    text: "Most piano notes are sounded by three strings at once.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Yamaha Musical Instrument Guide, Piano-Trivia zum Saitenchor",
      "Britannica, Eintrag Piano - stringing",
    ),
  },
  {
    text: "A cast bell is tuned afterwards on a lathe.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Euphonics, Lehrtext Kapitel Church bells",
      "McShane Bell Company, Rubrik Bell Casting and Tuning",
    ),
  },

  // ---- Sprache und Schrift ----
  {
    text: "Braille holds one letter in a cell of raised dots.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Library of Congress NLS, Informationsblatt About Braille",
      "Britannica, Eintrag Braille writing system",
    ),
  },
  {
    text: "Louis Braille was fifteen when he settled on his six dots.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Braille writing system",
      "RNIB, Rubrik Braille through the years",
    ),
  },
  {
    text: "Braille also wrote a music code built on the same six dots.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Braille writing system",
      "RNIB, Rubrik Braille through the years",
    ),
  },
  {
    text: "Gutenberg cast his printing type from lead, tin and antimony.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Johannes Gutenberg",
      "Oregon State University Libraries, Ausstellung Incunabula: The Gutenberg Press",
    ),
  },
  {
    text: "Movable type let the same page be printed over and over.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Britannica, Eintrag Printing press",
      "Oregon State University Libraries, Ausstellung Incunabula: The Gutenberg Press",
    ),
  },
  {
    text: "Volunteers sent in quotations by the thousand for the dictionary.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Oxford English Dictionary, Rubrik Contributors to the OED",
      "University of Oxford, Examining the OED: Reading and readers",
    ),
  },

  // ---- Handwerk und Werkstoffe ----
  {
    text: "Bronze is harder than the copper it is mostly made from.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Bronze, alloy",
      "Penn State MATSE 81, Lehrkapitel Egyptian Bronze Processing",
    ),
  },
  {
    text: "Bessemer blew air through molten iron to make steel cheaply.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Science Museum Group, Objekt Original pilot Bessemer converter, 1865",
      "Britannica, Eintrag Bessemer process",
    ),
  },
  {
    text: "Zinc on steel corrodes first, and so it shields the steel.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Galvanizers Association UK, Rubrik Galvanisation",
      "Galvanizers Association of Australia, Rubrik How Galvanizing Protects Steel",
    ),
  },
  {
    text: "Wool locks into felt when it is rubbed in warm water.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Felt",
      "Dress and Textile Specialists mit dem Victoria and Albert Museum, Identifying Fibres and Fabrics",
    ),
  },
  {
    text: "Felt is one of the oldest cloths that people ever made.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Felt",
      "Textile Museum der George Washington University, Rubrik Textile Terms",
    ),
  },
  {
    text: "Fresh wood shrinks as it dries, so it is dried before use.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Ohio State University Extension, Merkblatt Understanding Dimensional Changes in Wood",
      "Scion Digital Library, Fachschrift The air-seasoning and kiln-drying of timber",
    ),
  },
  {
    text: "Roman concrete used volcanic ash and could even set under water.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Britannica, Eintrag Pozzolana",
      "Science Advances, Fachaufsatz Hot mixing: insights into Roman concrete",
    ),
  },
  {
    text: "Cement does not dry hard; it sets by reacting with water.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Building Conservation Directory, Fachbeitrag Pozzolans for Lime Mortars",
      "Science Advances, Fachaufsatz Hot mixing: insights into Roman concrete",
    ),
  },

  // ---- Ernährung und Landwirtschaft ----
  {
    text: "Milk is heated hot and cooled fast to make it safe to drink.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Why Is Milk Pasteurized",
      "International Dairy Foods Association, Rubrik Pasteurization",
    ),
  },
  {
    text: "Pasteurisation is named after the chemist Louis Pasteur.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Why Is Milk Pasteurized",
      "International Dairy Foods Association, Rubrik Pasteurization",
    ),
  },
  {
    text: "Cheese starts when milk sets into solid curd.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Royal Society of Chemistry, Chemistry World, Folge Chymosin",
      "Journal of Dairy Science, Fachaufsatz zur Labwirkung bei der Käsegerinnung",
    ),
  },
  {
    text: "Salt draws the water out of food, and so the food lasts.",
    kind: "wissen",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "American Society for Microbiology, Beitrag Salt, Microbes, Acid and Heat in Food Preservation",
      "US National Academies, Bericht Preservation and Physical Property Roles of Sodium in Foods",
    ),
  },
  {
    text: "Kneading builds a net in the dough that holds the gas.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Royal Society of Chemistry, Education: Magnificent molecules - Gluten",
      "Royal Society of Chemistry, Buchkapitel Bread Making in The Science of Bakery Products",
    ),
  },
  {
    text: "Flour is grain that has been ground fine.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Flour",
      "Water Mill Museum, Rubrik History of the Water Mill",
    ),
  },
  {
    text: "Water mills ground corn long before steam engines came.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Watermill Museum Brüglingen, Ausstellung zur Mühlengeschichte",
      "Water Mill Museum, Rubrik History of the Water Mill",
    ),
  },
  {
    text: "Farmers change what a field grows each season.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    herkunft: EIGEN(
      "Britannica, Eintrag Norfolk four-course system",
      "Farmers Weekly, Fachbeitrag Norfolk four-course arable rotation brought up to date",
    ),
  },
  {
    text: "Turnips and clover ended the old habit of the fallow field.",
    kind: "fakt",
    stufen: TEENS_ERW,
    herkunft: EIGEN(
      "Britannica, Eintrag Norfolk four-course system",
      "Nature, Beitrag Crop Rotation",
    ),
  },
];
