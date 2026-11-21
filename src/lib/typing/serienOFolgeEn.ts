/**
 * ENGLISCHE SERIEN FUER DIE SPROSSE 17 der NEUEN Buchstabenfolge
 * (Charge O1, 21.08.2026) - die englische Haelfte von `serienOFolge.ts`.
 *
 * ── WARUM GERADE DAS ENGLISCHE DAVON LEBT ─────────────────────────────────
 *
 * Es gibt nur EINE `INTRO_ORDER` (letters.ts), und sie ist nach deutscher
 * Buchstabenhaeufigkeit gebaut. Das `o` stand darin auf Platz 19 - im
 * Deutschen traegt es 2,5 Prozent, im Englischen 7,5, und an ihm haengen
 * **to, of, on, not, no, one, for**. Bis Einheit 20 hatte das Englische damit
 * weder Ziel noch Genitiv noch Verneinung; die Charge I2 musste jede fruehe
 * Zeile daran vorbeischreiben (siehe den langen Abschnitt „at ist kein Ersatz
 * fuer to und on" im Kopf von `serienEnFrueh.ts`).
 *
 * O1 zieht das `o` direkt hinter das `h`. Gemessene Schreibbarkeit (Anteil der
 * haeufigsten Woerter, der bei n Tasten tippbar ist): EN 16 Tasten 31 -> 42 %,
 * 17 Tasten 32 -> 47 %, 18 Tasten 33 -> 49 %. Ab 20 Tasten ist die Menge
 * identisch - der Gewinn lebt genau in den Sprossen 16 bis 19.
 *
 * ── DIE ENGLISCHE TREPPE NACH DEM UMBAU ───────────────────────────────────
 *
 *   n=13  f j d k s l a ö e n i r t   - das ö ist wertlos, real ZWOELF
 *   n=15 +h   n=16 +o   n=17 +u   n=18 +c   n=19 +g   n=20 +m   n=21 +b
 *   n=22 +w   n=23 +z   n=24 +v   n=25 +p   n=28 +x   n=29 +y   n=30 +q
 *   n=26 +ä · n=27 +ü · n=31 +ß  - fuer Englisch alle drei wertlos
 *
 * Neu gegenueber der ALTEN Folge: bei n=16 steht jetzt `o` statt `u`, bei
 * n=17 `o u` statt `u c`. Ab n=20 ist die Menge dieselbe wie vorher.
 *
 * ── DAS BUDGET DIESER DATEI (n=17, am Objekt gemessen) ────────────────────
 *
 * Frei: **a d e f h i j k l n o r s t u**. Gesperrt: **b c g m p q v w x y z**.
 *
 * WAS ES JETZT GIBT und vorher an dieser Sprosse fehlte:
 *  • **to, of, on, into, onto, out, for, from?** - nein, *from* haengt am m.
 *    Frei sind *to, of, on, into, out, our, or, one, none, no, not, other,
 *    another, do, does, did, done, so, also, alone, north, south, food, door,
 *    floor, hour, house, road, hold, told, took, look, soil, oil, note*.
 *  • **die Verneinung**: *not, no, none, nor, do not, does not, did not, is
 *    not*. Die Charge I2 hatte unterhalb von 20 gar keine.
 *  • **has to** ersetzt *must* (das am m haengt), **let** bleibt das zweite
 *    Modalverb. *can* kommt erst mit 18 (c), *will/would* mit 22 (w).
 *
 * WAS FEHLT und jede Zeile formt:
 *  • **kein m** - kein *him, them, must, time, name, same, small, from, more,
 *    most, home, come, some, make*. Rueckbezug auf eine Gruppe laeuft ueber
 *    *the others, all three, the rest*; *from* wird durch *out of* oder den
 *    Doppelobjekt-Bau ersetzt.
 *  • **kein w** - kein *was, were, will, would, with, what, when, where, who,
 *    how, we, know, down, own, two, answer, water, snow, dawn*. Von *be*
 *    existiert also keine Vergangenheit: erzaehlt wird im Praesens, das
 *    Perfekt liefert *has/had* + Partizip (die es ohne g nur als starke Form
 *    gibt: *held, told, found, stood, sat, run, read, let, shut, set*).
 *  • **kein g** - keine einzige **-ing**-Form, kein *light, night, again,
 *    get, go, give, big, great, good, edge, age*. Die Verlaufsform gibt es in
 *    dieser Datei nicht; alles steht im simple present.
 *  • **kein c** - kein *can, cannot, each, such, reach, chance, school,
 *    office, ice, decide, second?* - nein, *second* traegt eines und ist
 *    trotzdem hier: es steht in dieser Datei NICHT, wo es ein c braeuchte.
 *    Kurz: kein c-Wort. *each* wird zu *all*, *school* zu *hall* oder
 *    *station*, *can* faellt weg oder wird zu *is free to*.
 *  • **kein b, p, v, y, x, z, q** - kein *but, be, back, about, book, up,
 *    open, keep, help, part, people, have, five, seven, over, never, ever,
 *    you, they, day, year, my, by, very, only, any, next, six*. Der
 *    Gegensatz, den *but* traegt, steht als Doppelpunkt, als Gedankenstrich
 *    oder als zweiter Satz. **have** fehlt, *has* und *had* nicht.
 *  • ZAHLEN: frei sind *one, three, four, ten, nine, thirteen, hundred,
 *    thousand* und die Ordinalzahlen *first, third, fourth, tenth*. Gesperrt:
 *    two, five, six, seven, eight, twelve, twenty. Maasse: *foot/feet, hour,
 *    ton* gehen; *metre, minute, mile* haengen alle am m.
 *
 * ── FORM UND RECHTE (wie im ganzen englischen Bestand) ────────────────────
 *
 * Selbst verfasst (Bauplan 27.07. §10), britisches Englisch, KEINE Apostrophe
 * (also kein *dont*, kein Genitiv-s mit Apostroph - der Genitiv laeuft ueber
 * *of* oder ueber zusammengesetzte Nomen), woertliche Rede OHNE
 * Anfuehrungszeichen, keine Ziffern, jede Zeile EIN Satz und hoechstens 85
 * Zeichen, nur der einfache Bindestrich.
 *
 * DIE TEUERSTE FALLE aus I2-N gilt weiter, auch wenn sie hier entschaerft
 * ist: **at ist kein Ersatz fuer to und on**. Ab dieser Sprosse sind to und
 * on frei - `at` steht darum nur noch, wo es hingehoert: Ort (at the shed),
 * Zeit (at the third hour), Blick und Griff (looks at, tears at).
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

// ───────────────────────────────────────────────────────────────────────────
// kids · A tin, a note, a flat stone. Kein dig (g), kein key (y), kein drop
// (p) - die Kinder heben, kippen und lassen Oel in die Fuge laufen.
// ───────────────────────────────────────────────────────────────────────────
const THE_TIN_ON_THE_SHELF: Serie = {
  slug: "en-the-tin-on-the-shelf",
  titel: "The Tin on the Shelf",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The shed at the far end of the land holds old tools.",
        "Nils shifts a rake and finds a shelf.",
        "On the shelf there is a tin.",
        "The tin is red and it is full of dust.",
        "Hedda holds it and hears a rattle.",
        "The lid is stiff.",
        "Nils turns it, and it turns.",
        "In the tin there are nails, a rod and a note.",
        "The note is old and thin.",
        "On it there is a line and a dot.",
        "The line starts at the shed.",
        "It ends at the third tree.",
      ],
    },
    {
      lines: [
        "Hedda folds the note into her hand.",
        "Nils leads and Hedda holds the note.",
        "There are ten trees near the shed.",
        "The first is tall, the third is short.",
        "At the third tree the soil is hard.",
        "There is a flat stone in the roots.",
        "The stone is not too hard to shift.",
        "Nils tilts it and Hedda holds it.",
        "Under the stone there is a hole.",
        "In the hole there is another tin.",
        "It is not red - it is dark and old.",
        "Hedda tries the lid: it holds fast.",
      ],
    },
    {
      lines: [
        "The lid does not turn.",
        "Nils holds the tin, Hedda turns the lid.",
        "It still does not turn.",
        "Rust holds it shut.",
        "Hedda has an idea: oil.",
        "In the shed there is a tin of oil.",
        "She lets the oil run into the joint.",
        "Then the lid turns, one third, then all.",
        "In the tin there are three tools.",
        "A file, a nail hook and a lens.",
        "And a note in the odd, old hand of the first.",
        "It holds one line: For the hands that find it.",
      ],
    },
    {
      lines: [
        "Hedda holds the note in the sun.",
        "The old hand is the hand of their aunt Ada.",
        "Ada had this shed, and she had these tools.",
        "She left the land here to their father.",
        "Nils rolls the file in his hand.",
        "It is thin and fine, and it is still hard.",
        "Hedda takes the lens and holds it near the red tin.",
        "Under the lens the red tin has one letter on the lid: A.",
        "It is not just a tin, then.",
        "It is a start and an end - a line, a stone, a hole.",
        "Nils sets the tools on the shelf, all in one line.",
        "Hedda sets the note there too, and lets the shed shut.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens · Ein Aufzug, dessen Zifferblatt kein drittes Stockwerk kennt - und
// eine Etage, die trotzdem Luft haelt. Kein can (c), kein was (w).
// ───────────────────────────────────────────────────────────────────────────
const THE_THIRD_FLOOR: Serie = {
  slug: "en-the-third-floor",
  titel: "The Third Floor",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 2,
  topic: "mystery",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The house on the north side is tall and old.",
        "It has a lift, and the lift has a dial.",
        "The dial holds the hall, the first, the fourth and the tenth.",
        "The stair holds a door on all ten floors.",
        "Idris rides the lift to the fourth and then to the first.",
        "It halts at all that the dial holds.",
        "It does not halt at the third, and it does not offer it.",
        "Selin trusts the dial: an old lift, an old fault.",
        "Idris does not.",
        "He takes the stair and hears his tread on the stone.",
        "The stair turns, and it turns, and then it holds still at the third.",
        "The floor has one door, and the door has no handle.",
      ],
    },
    {
      lines: [
        "Idris tells Selin, and she takes the stair too.",
        "The door is flat and thin and it has no handle.",
        "It is held shut on the far side.",
        "Near the floor there is a line of dust.",
        "The dust is odd: it lifts at the door and lands at the stair.",
        "There is air on the far side.",
        "Selin holds her hand near the join.",
        "The air is soft, and it is not the air of the stair.",
        "So the third floor is there, and it holds air.",
        "Idris reads the list of tenants in the hall.",
        "It lists the hall, the first, the fourth, the tenth.",
        "One line is odd: a third tenant, an old title, and no flat.",
      ],
    },
    {
      lines: [
        "The landlord sits at the desk on the hall floor.",
        "He is old and he is not fond of the stair.",
        "Idris asks for the third.",
        "The landlord holds that there is no third floor.",
        "Then he tells the tale: the third and the flat under it are one.",
        "The join is old - it is not on his lists.",
        "Selin asks for the tenant that held it.",
        "He is silent.",
        "Idris asks for the door on the third floor.",
        "The landlord stands and turns to his files.",
        "He hands Idris one thin folder.",
        "On the folder there is one line: Held, no heir.",
      ],
    },
    {
      lines: [
        "In the folder there are letters, all unsent.",
        "These are old and thin, and none is torn.",
        "All are addressed to one hall in the far north.",
        "The hand on all of these is the hand of the third tenant.",
        "Idris reads one line, then he sets it aside.",
        "It is not for us, he tells Selin.",
        "Selin holds the folder for a hard, still hour.",
        "Then she asks the landlord for the north hall.",
        "The hall in the north is still there.",
        "Selin sends the letters, all of these, in one flat lot.",
        "Idris rides the lift to the fourth and looks at the dial.",
        "There is still no third, and there is still a floor.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// erwachsen · Ein Salzlager, ein Frost und eine Order, die keiner unterschreibt.
// Kein must (m) - die Pflicht steht als „has to", die Wahl als Doppelpunkt.
// ───────────────────────────────────────────────────────────────────────────
const THE_SALT_SHED: Serie = {
  slug: "en-the-salt-shed",
  titel: "The Salt Shed",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The salt shed stands at the far end of the north road.",
        "Torsten holds the store and the list.",
        "The store is a hill of salt, and it is not tall.",
        "It has held all the frost so far, and it has held it thin.",
        "The frost is due, and it is not a soft one.",
        "Torsten reads the order for a load of salt.",
        "The order has no date on it.",
        "He dials the hall that sends the salt.",
        "The line is dead.",
        "He dials the road trust: a tired hand states that the hall is shut.",
        "It is shut, and it is shut for the rest of the season.",
        "Torsten stands in the shed and looks at the hill of salt.",
      ],
    },
    {
      lines: [
        "The road trust holds thirteen roads.",
        "The hill of salt is not for thirteen roads.",
        "It is for three, and it is thin for three.",
        "Ilona is at the loader at the first hour.",
        "She asks: all the roads, or the hard ones?",
        "Torsten is silent.",
        "The north road holds the hill, and the hill is the hard one.",
        "The flat roads take frost too, and there are ten of those.",
        "Salt on all thirteen roads holds one frost, and then the shed is dust.",
        "Salt on three roads holds three frosts.",
        "Ilona lets the loader stand and dusts her hands.",
        "She states it flat: the order is not hers, it is his.",
      ],
    },
    {
      lines: [
        "Torsten sits at the desk in the shed.",
        "He notes the roads, one after the other.",
        "The hill road, the north stair road, the old ford road.",
        "These three lead to the halls and to the station.",
        "The ten others lead to fields and to still, flat land.",
        "Ten roads and no salt: the frost holds all ten until the sun.",
        "He notes one line and does not soften it: ten roads, no salt.",
        "Then he dials the ten roads, one after the other.",
        "He tells the tenants there is no salt on this road.",
        "One of the ten is loud.",
        "One is not loud, and that one is harder.",
        "Not one of the ten tells Torsten that it is a fair order.",
      ],
    },
    {
      lines: [
        "The frost lands at the third hour.",
        "It is hard and still, and it holds until the sun.",
        "Ilona salts the three roads and stands the loader in the shed.",
        "The hill road holds.",
        "The north stair road holds.",
        "On the ford road a trailer turns, then it holds too.",
        "On the ten roads there is no one out at all.",
        "The tenants had his line, and the tenants stood still.",
        "At noon the road trust dials the shed.",
        "It is not thanks, and it is not a fault.",
        "It is one line: send in the list of roads that had no salt.",
        "Torsten sends it, and he sends the hour of all ten dials too.",
      ],
    },
  ],
};

/** Die englischen Serien der Charge O1 (Sprosse 17 der neuen Folge). */
export const SERIEN_O_FOLGE_EN: Serie[] = [
  THE_TIN_ON_THE_SHELF,
  THE_THIRD_FLOOR,
  THE_SALT_SHED,
];
