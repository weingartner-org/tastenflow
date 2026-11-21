/**
 * ERSATZ fuer die englische KINDER-Buecherei (Charge I2b, 21.08.2026) - drei
 * eigene Serien, damit die drei geteilten Wissens-Serien die kids-Stufe
 * verlassen koennen, ohne dass ein Kind eine einzige Geschichte verliert.
 *
 * ── ANLASS ────────────────────────────────────────────────────────────────
 *
 * Drei englische Wissens-Serien trugen seit dem Drei-Stufen-Umbau ALLE DREI
 * Stufen zugleich: „Water and Weather", „A Trip Through Space" und „How
 * Animals Sleep". Sie waren einmal mit b+c+erwachsen fuer alle ab zehn
 * gedacht; die Uebersetzung auf drei Stufen hat daraus kids+teens+erwachsen
 * gemacht - also Siebenjaehrige und Erwachsene an derselben Zeile. Der
 * Waechter `tests/typing-altersgrenze.test.ts` hielt das als Ausnahme fest
 * (`EN_KIDS_UND_ERWACHSEN_MAX = 3`, Ziel 0).
 *
 * Charge I2 hat die englische Buecherei von sieben auf siebenundzwanzig
 * Serien gebracht - aber die drei liessen sich trotzdem nicht freigeben:
 * gemessen am 21.08. stand das kids-Regal an den Punkten n=31 und n=99 bei
 * genau 13 Serien, und genau 13 war auch der committete REGAL_BODEN. Nimmt
 * man den dreien `kids` weg, faellt es auf 10. Es gab also KEINEN Spielraum -
 * Johannes' Weiche 4 gilt woertlich: erst schreiben, dann aussortieren.
 *
 * ── WAS DIESE DATEI TUT ───────────────────────────────────────────────────
 *
 * Drei eigene Serien, je fuer `kids` allein geschrieben, an drei Sprossen, die
 * das kids-Regal noch nicht hatte (21, 24, 29). Sie ersetzen die drei
 * abgegebenen Serien NICHT nur der Zahl nach, sondern auch dem Fach nach:
 *
 *   abgegeben (kids)                 neu (kids)
 *   A Trip Through Space  weltall →  The Moon and the Month     weltall, n=29
 *   How Animals Sleep     tiere   →  How Birds Build a Nest     tiere,   n=24
 *   Water and Weather     natur   →  The Red Hen at the School Gate
 *                                                               alltag,  n=21
 *
 * Beim Wasser ist der Tausch bewusst KEIN Wasser-Ersatz: die kids-Stufe hat
 * mit „How Ants Find Food" und „From Seed to Plant" bereits zwei
 * Natur-Wissens-Serien, und ihr fehlte statt dessen jede englische Geschichte
 * aus dem Alltag. Die drei abgegebenen Serien bleiben fuer teens und
 * erwachsen unveraendert stehen - es geht nichts verloren, es wird nur
 * entflochten.
 *
 * ── DIE SPROSSEN, AN DENEN HIER GESCHRIEBEN WIRD ──────────────────────────
 *
 * Die Buchstaben-Grenzen je Sprosse stehen ausfuehrlich im Kopf von
 * `serienEnFrueh.ts` (Charge I2) - hier nur, was fuer genau diese drei zaehlt:
 *
 *  • n=21 (+b) - `a b c d e f g h i j k l m n o r s t u`. Der Alltag ist da
 *    (school, class, gate, corn, crate, chalk), und das o bringt to, of, not,
 *    no, from, for (es stand beim Schreiben auf Platz 20; seit Charge O1 kommt
 *    es schon mit 16 - an dieser Sprosse aendert das nichts). Was fehlt und
 *    die Erzaehlung formt: **kein w**, also kein was und kein were - die
 *    ganze Geschichte laeuft im Praesens, und wo ein Rueckblick noetig ist,
 *    traegt das Perfekt oder eine Form ohne Hilfsverb (laid, crossed).
 *    Ebenso gesperrt: jedes Fragewort (what, when, where, why, who, how
 *    tragen alle ein w), **put** und **help** (p), **lay/lays** (y - `laid`
 *    dagegen geht), down, now, know, two, window.
 *  • n=24 (+v) - jetzt have, never, over, five, seven, twelve und das ganze w
 *    seit 22 (with, when, water, own, down). Es fehlen p, x, y: kein up, open,
 *    keep, deep, place, part, pair, cup, spring - und kein **they**, kein
 *    **day**, kein **year**, kein **fly**. Die Serie spricht darum von „the
 *    birds" statt they, von „in twelve months" statt in a year, und vom
 *    **flight** statt vom Fliegen. Zahlwoerter auf -ty (twenty, thirty) sind
 *    ebenfalls gesperrt; wo eine Zeitspanne noetig ist, steht `decades`.
 *  • n=29 (+y) - alles ausser q. Erst hier gibt es **sky**, **day**, **they**
 *    und **you**; darum steht die Wissens-Serie ueber den Mond hier und nicht
 *    frueher. Zu meiden ist nur, was ein q traegt (quarter! - darum „half
 *    moon" statt „quarter moon", question, quiet).
 *
 * ── RECHTE UND FAKTEN ─────────────────────────────────────────────────────
 *
 * Alle drei Serien sind SELBST VERFASST (Bauplan 27.07. §10) - reale Texte
 * halten sich nicht an eine Buchstaben-Freischaltung. Die Fakten der beiden
 * Wissens-Serien sind je an zwei unabhaengigen Stellen gegengeprueft, die
 * Belege stehen am Objekt in `herkunft.fundstelle`.
 *
 * Form wie im Bestand: vier Etappen zu zwoelf Zeilen, jede Zeile EIN Satz und
 * hoechstens 85 Zeichen, britisches Englisch, keine Apostrophe, keine
 * Anfuehrungszeichen, keine Ziffern, nur der einfache Bindestrich.
 */
import type { Serie } from "./serie";

/** Herkunft der selbst verfassten englischen Serien dieser Datei. */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, englisches Original)",
  autor: "Sensorik-Lernplattform",
  en: {
    quelle: "Sensorik",
    lizenz: "Own work (self-written, English original)",
    autor: "Sensorik learning platform",
  },
} as const;

// ---------------------------------------------------------------------------
// n=21 (+ b). Alltags-Geschichte. Kein w: kein was, kein were, kein
// Fragewort - erzaehlt wird im Praesens. Kein p (kein put, help,
// open), kein y (kein lay/lays; laid geht), kein v, x, z, q.
// ---------------------------------------------------------------------------
const THE_RED_HEN_AT_THE_SCHOOL_GATE: Serie = {
  slug: "en-the-red-hen-at-the-school-gate",
  titel: "The Red Hen at the School Gate",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The first frost of the autumn sits on the school gate.",
        "Nora comes in half an hour before the bell.",
        "At the gate there is a red hen.",
        "She stands still in the cold and looks at Nora.",
        "There is no cage, no cord and no farm near her.",
        "Nora sits on her heels and holds out a hand.",
        "The hen comes closer and tests the hand.",
        "She does not run, and she is not afraid.",
        "Nora goes in, and the hen comes after her.",
        "The hen crosses the hall and settles in a corner.",
        "Mrs Lund finds a crate and a handful of dried grass.",
        "At the third lesson there is an egg in the crate.",
      ],
    },
    {
      lines: [
        "The class calls the hen Clara, and the name holds.",
        "Bruno takes corn from home in an old tin.",
        "Clara eats the corn, and after that she eats the crumbs.",
        "She drinks from a dish beside the radiator.",
        "Mrs Lund sets a card at the school door.",
        "The card reads: a red hen sits in class three.",
        "No one comes for her, and no one calls the school.",
        "Nora makes a chart in chalk beside the door.",
        "Clara laid three eggs in the first ten mornings.",
        "She is loud at first light and silent at noon.",
        "She casts dust and sand into her feathers, and the class laughs.",
        "Then, on a hard cold morning, a man stands at the gate.",
      ],
    },
    {
      lines: [
        "The man is Mr Costa, and he holds the farm on the hill.",
        "Three of his hens are gone, and the latch of the hen house is loose.",
        "He looks at Clara for a long time and is silent.",
        "She is old, he tells the class, and she is the oldest hen he has.",
        "An old hen makes an egg here and an egg there, he tells them.",
        "Three eggs in ten mornings, Nora tells him, and she holds out the chart.",
        "Mr Costa reads the chalk lines and looks at Clara again.",
        "The far end of his hen house is cold, he tells the class.",
        "Clara has come to the school for the heat of the radiator.",
        "She crossed four fields and a road to find it.",
        "Then Bruno asks him if the school can hold on to Clara.",
        "Mr Costa looks at the chart, at Clara, and at the class.",
      ],
    },
    {
      lines: [
        "She is old, he tells them, and an old hen is not a machine.",
        "If the school holds her, the school feeds her, at all hours.",
        "The class makes a small hen house of crates behind the shed.",
        "Three crates, a lid, one hinge, and dried grass from the farm.",
        "Bruno nails the hinge, and Nora cuts the little door.",
        "The caretaker sets it off the cold ground and out of the rain.",
        "Clara tests it, turns three times, and settles in the dried grass.",
        "Each class in the school takes one morning of the ten.",
        "The chart at the hall door holds the egg count of the month.",
        "In maths the class counts the eggs, the corn and the cold mornings.",
        "In late autumn Clara stands at the gate at first light.",
        "She is at the school before the children, and she has not been late once.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=24 (+ v). Wissens-Serie. Kein p, kein x, kein y: kein up, open,
// keep, deep, cup, pair, part - und kein they, day, year, fly. Die
// Serie sagt darum „the birds", „in twelve months" und „flight".
// ---------------------------------------------------------------------------
const HOW_BIRDS_BUILD_A_NEST: Serie = {
  slug: "en-how-birds-build-a-nest",
  titel: "How Birds Build a Nest",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: {
    ...EIGEN,
    fundstelle:
      "Mehlschwalbe/Rauchschwalbe, rund 1000 bis 1300 Fluege mit Lehmkuegelchen je Nest: allaboutbirds.org/guide/Barn_Swallow/lifehistory (Cornell Lab of Ornithology) und georgiawildlife.com/out-my-backdoor-barn-swallows-offer-unique-window-nesting (Georgia DNR). Schneidervogel (Orthotomus sutorius) naeht Blattraender mit Fasern und Spinnenseide, Loecher mit dem Schnabel gestochen: nhm.ac.uk/discover/the-bird-that-stitches-its-home.html (Natural History Museum London) und britannica.com/animal/tailorbird. Groesstes Einzelnest: Weisskopfseeadler bei St. Petersburg, Florida, 2,9 m Durchmesser, 6,1 m hoch, rund 2 Tonnen (Guinness): guinnessworldrecords.com (Largest bird nest) und nps.gov/places/000/bald-eagle.htm. Kleinstes Nest: Bienenelfe (Mellisuga helenae), Nest gut 2 cm weit, Eier von der Groesse einer Kaffeebohne: animalia.bio/bee-hummingbird und archive.adirondackcouncil.org/news/10-facts-about-hummingbirds. Siedelweber (Philetairus socius) in der Kalahari/Namibia, ueber 100 Kammern in einem Strohdach, Bauten ueber 100 Jahre bewohnt: allaboutbirds.org/news/in-africa-sociable-weavers-build-a-nest-of-many-uses und audubon.org/magazine/africas-social-weaverbirds-take-communal-living-whole-new-level. Trottellumme legt auf blanken Felsband, birnenfoermiges Ei rollt im engen Bogen: rspb.org.uk/birds-and-wildlife/guillemot und en.wikipedia.org/wiki/Common_murre. Kuckuck als Brutschmarotzer und Mauersegler (Nestbau aus Luftfracht, mit Speichel verklebt): rspb.org.uk/birds-and-wildlife/cuckoo und rspb.org.uk/birds-and-wildlife/swift. Geprueft am 21.08.2026.",
  },
  etappen: [
    {
      lines: [
        "At the end of the cold months a bird has one huge task.",
        "It must make a safe hollow for its eggs.",
        "No one shows the bird how, and it has never done it before.",
        "It builds from the inside, with the beak and the feet alone.",
        "The stuff comes from close at hand: twigs, moss, grass and mud.",
        "Some birds add hair, wool, feathers and even bits of thread.",
        "A thrush lines its bowl with soft mud and lets the mud harden.",
        "The bird sits in the bowl and turns, and the turning makes it round.",
        "So the nest fits the bird that built it, and it fits no other bird.",
        "A nest is not a house, and a bird does not live in it.",
        "It is a cradle, and it is in use for a few weeks alone.",
        "As the last chick leaves it, the work of that nest is done.",
      ],
    },
    {
      lines: [
        "A swallow builds from mud, and it hauls the mud in its beak.",
        "One beak holds a load of mud close to the size of a bean.",
        "The two birds must make more than one thousand flights for one nest.",
        "The mud goes on in rims, and each rim must harden first.",
        "A rim that is set on too fast falls, and the birds start again.",
        "The finished nest holds fast under a roof or on a beam.",
        "In warm lands there is a small bird that sews, and that is no joke.",
        "It is the tailorbird, and it uses a green leaf as the cradle.",
        "It makes a row of little holes along the two edges of the leaf.",
        "Then it draws silk and fibres through the holes, hole for hole.",
        "The leaf folds and shuts, and the nest sits hidden inside it.",
        "The bird has no hand and no needle, and it sews all the same.",
      ],
    },
    {
      lines: [
        "The largest nest of one bird ever found is the nest of an eagle.",
        "It is close to three metres across and it stands twice as tall.",
        "It holds the mass of a small car, and it broke the tree it sat in.",
        "The eagles add to the same nest over and over, for decades.",
        "The smallest nest of all is the nest of the bee hummingbird.",
        "It is close to the size of half a walnut shell.",
        "The eggs inside it are close to the size of a coffee bean.",
        "In the dust of Namibia the sociable weavers build in one crowd.",
        "One straw roof in a thorn tree can hold more than a hundred chambers.",
        "It is the largest bird home on earth, and it lasts for decades.",
        "Under the thick straw the heat of the sun cannot reach the birds.",
        "And in the cold of the night the same straw holds the heat in.",
      ],
    },
    {
      lines: [
        "Some birds build almost nothing at all.",
        "An ostrich makes a shallow hollow in the sand and no more.",
        "A guillemot uses a bare cliff ledge and builds no nest at all.",
        "Its egg is far from round, and it rolls in a tight circle.",
        "So the egg turns on the ledge instead of falling off it.",
        "A cuckoo builds nothing, and it sets its egg in the nest of another.",
        "The other bird feeds the chick, and the chick is soon the larger.",
        "A swift comes to the ground for the nest alone, and for nothing else.",
        "It builds from feathers and straw that it catches in the air.",
        "It sticks the whole nest together with its own hard saliva.",
        "Look at a nest in the cold months, as the branches are bare.",
        "It looks like nothing much, and it is a home built with one beak.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=29 (+ y). Wissens-Serie. Alles ausser q ist da - erst hier gibt
// es sky, day, they und you. Zu meiden: quarter (darum half moon),
// question, quiet, square.
// ---------------------------------------------------------------------------
const THE_MOON_AND_THE_MONTH: Serie = {
  slug: "en-the-moon-and-the-month",
  titel: "The Moon and the Month",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "weltall",
  herkunft: {
    ...EIGEN,
    fundstelle:
      "Mittlere Mondentfernung 384 400 km, Laufzeit des Lichts 1,28 s, Durchmesser 3475 km (rund ein Viertel des Erddurchmessers von 12 742 km), Schwerkraft rund ein Sechstel: nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html (NASA Moon Fact Sheet) und en.wikipedia.org/wiki/Moon. Synodischer Monat 29,53 Tage (Phasen), siderischer Umlauf 27,32 Tage, gebundene Rotation: science.nasa.gov/moon/moon-phases und en.wikipedia.org/wiki/Lunar_phase. Wortverwandtschaft Mond/Monat (englisch moon/month, gemeinsame indogermanische Wurzel): etymonline.com/word/month und en.wikipedia.org/wiki/Month. Erste Bilder der Rueckseite durch Luna 3 am 7. Oktober 1959: nasa.gov/history und en.wikipedia.org/wiki/Luna_3. Kein Luftmantel, darum bleiben Fussabdruecke sehr lange: science.nasa.gov/moon und airandspace.si.edu. Zwei Flutberge und zwei Hochwasser je Tag, Gezeitenreibung verlangsamt die Erddrehung: oceanservice.noaa.gov/education/tutorial_tides und en.wikipedia.org/wiki/Tidal_acceleration. Mond entfernt sich rund 3,8 cm im Jahr (Laser-Messung an den Reflektoren): nasa.gov/lunar-laser-ranging und en.wikipedia.org/wiki/Lunar_Laser_Ranging_experiments. Geprueft am 21.08.2026.",
  },
  etappen: [
    {
      lines: [
        "The moon is our nearest neighbour in the whole sky.",
        "It has no light of its own, not a single beam.",
        "What we see is sunlight, thrown back at us from grey rock.",
        "The moon is close to four hundred thousand kilometres from us.",
        "Light crosses that gap in a little over one second.",
        "A car at motorway speed would need close to half a year for it.",
        "The moon is much smaller than the earth, close to a fourth as wide.",
        "It holds far less matter, so it holds you far less tightly.",
        "A child of thirty kilos would tilt a moon scale at five.",
        "There is no air up there, so there is no wind and no rain.",
        "There is no sound either, and the sky above the moon is black.",
        "And still it is the one world that human feet have ever touched.",
      ],
    },
    {
      lines: [
        "Look at the moon each night for a month and it changes shape.",
        "That change is the oldest clock that people have ever used.",
        "The moon itself does not change at all.",
        "Half of it is lit by the sun at all times, just like half of the earth.",
        "What changes is how much of that lit half we can see from here.",
        "At new moon the lit half faces away from us, and we see nothing.",
        "A few nights later a thin crescent stands over the sunset.",
        "After a week we see one half of the disc, cut straight through.",
        "After two weeks the whole lit face turns to us: a full moon.",
        "Then the same steps run backwards until the moon is new again.",
        "One full round of shapes takes close to a month, and never less.",
        "That is where the word month comes from: moon and month are kin.",
      ],
    },
    {
      lines: [
        "The moon turns on its own axis, just as the earth does.",
        "But it turns slowly: once for each circuit it makes around us.",
        "The two motions match, so one face is turned to us for ever.",
        "No one on earth saw the far side until a camera flew past it.",
        "That was less than seventy years ago, and the first shots were poor.",
        "The far side is not the dark side: it gets as much sun as ours does.",
        "It is simply the side that never faces the earth.",
        "The face we know is marked by craters and by wide grey plains.",
        "Each crater is the scar of a rock that struck the moon.",
        "The earth has been struck as often, and it has healed every scar.",
        "Wind, rain and moving ground wear our own craters flat in time.",
        "The moon has none of that, so a footprint there can last for ages.",
      ],
    },
    {
      lines: [
        "The moon pulls at the earth, and the sea answers first.",
        "The water heaps a little towards the moon.",
        "It heaps on the far side of the earth as well.",
        "So most coasts get two high tides and two low ones in a day.",
        "The tides rub against the sea floor and slow the earth down.",
        "Our day is getting longer, by a tiny amount in every century.",
        "And the moon is drifting away from us as that happens.",
        "It leaves us about four centimetres further off every year.",
        "Now and then the three of them stand in one straight line.",
        "If the earth is in the middle, its shadow falls on the moon.",
        "If the moon is in the middle, its shadow falls on us: an eclipse.",
        "None of it is magic, and all of it is over your head tonight.",
      ],
    },
  ],
};

/** Charge I2b (append-only an SERIEN gehaengt). */
export const SERIEN_EN_KIDS_ERSATZ: readonly Serie[] = [
  THE_RED_HEN_AT_THE_SCHOOL_GATE,
  HOW_BIRDS_BUILD_A_NEST,
  THE_MOON_AND_THE_MONTH,
];
