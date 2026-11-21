/**
 * ENGLISCHE SERIEN FUER DIE SPROSSE 16 der neuen Buchstabenfolge
 * (Charge E16, 21.08.2026).
 *
 * ── WARUM ES DIESE DATEI GIBT ─────────────────────────────────────────────
 *
 * Die Charge O1 hat das `o` in `LETTER_ORDER` direkt hinter das `h` gerueckt.
 * Damit ist eine Sprosse entstanden, die es vorher NICHT gab: bei 16
 * Einheiten stehen `f j d k s l a oe e n i r t h o` - vierzehn nutzbare
 * Buchstaben (das oe ist fuers Englische wertlos) plus Umschalttaste. Diese
 * Sprosse war leer.
 *
 * Sie ist strikt LEICHTER als die Sprosse 15, auf der die Charge I2 bereits
 * geschrieben hat (`The Shell at the Tide Line`, `The Third Stair`): derselbe
 * Satz plus das `o`. Alles, was dort ging, geht hier auch - dazu kommen
 * **to, of, on, no, not, none, one, old, hold, told, road, floor, door,
 * north, other, another, note, stone, alone, so, do, does, from?** - nein,
 * *from* haengt am m.
 *
 * ── DAS BUDGET (am Objekt gemessen, `npx tsx scripts/_seroeffnung.mts`) ────
 *
 * Frei: **a d e f h i j k l n o r s t**. Gesperrt: **u c g m b w y p v z x q**
 * (und ae ue ss).
 *
 * WAS TRAEGT:
 *  • the, this, that, there, then, than, he, she, her, his, it, its, is, are,
 *    has, had, at, an, and, in, on, into, onto, of, to, no, not, none, nor,
 *    or, so, if, as, all, one, three, nine, ten, thirteen, fifteen, nineteen.
 *  • **Die regelmaessige Vergangenheit auf -ed ist frei**, solange der Stamm
 *    passt: *lifted, listened, filed, sealed, folded, halted, tilted, asked,
 *    handed, landed, started, rattled, settled, drifted*. Dazu die starken
 *    Formen *held, told, sold, stood, took, heard, read, led, felt, left,
 *    lost, sent, sat, set, let, fell, knelt, lain*.
 *  • **Handwerk traegt erstaunlich weit**: joiner, joint, tenon, stile, rail,
 *    lathe, trestle, drill, file, hoist, ladder, nail, oak, alder, slate,
 *    tile, roof, floor, door, shed, loft, trailer, loader, oats, hens, horse.
 *  • **Der Doppelobjekt-Bau ist der Generalschluessel**, wo eine Praeposition
 *    klemmt: *hands Ronja the tin*, *sends Ilse the note*, *tells Aron the
 *    trail*.
 *
 * ── DIE MERKLISTE: WAS NICHT GING UND WAS STATTDESSEN TRUG ────────────────
 *
 *  • **kein m** - das teuerste Loch der Sprosse. Es kostet nicht nur *time,
 *    home, name, some, more, most, made, small, from*, sondern die beiden
 *    Pronomen **him** und **them**. Ein Mann kann also nicht als Objekt
 *    auftreten: statt *she tells him* steht ueberall *she tells Aron*, statt
 *    *the three of them* steht *all three*. Das hat die Figuren am Ende
 *    besser gemacht - es wird konsequent beim Namen genannt.
 *    Auch **mother** faellt weg; es gibt in diesen Serien nur *her father*,
 *    *her dad*, *her sister*, *the elder*, *the tenant*.
 *  • **kein u** - kein *you, our, out, us, but, just, must, until, under, up,
 *    house, sound, found(!), loud, hour, four(!), dusk*. Achtung, zwei
 *    Fallen: *find* ist frei, seine Vergangenheit *found* nicht (also steht
 *    alles im Praesens); und *four* ist gesperrt, *three* und *nine* nicht.
 *    *out* wird zu *free* (*it treads free*) oder faellt weg.
 *  • **kein g** - KEINE einzige -ing-Form, kein *going, holding, standing*.
 *    Erzaehlt wird im einfachen Praesens. Dazu fallen *again, night, light,
 *    right, long, big, thing, through* und - teuer - **hedge**; die
 *    Feldgrenze heisst darum *the thorn line*.
 *  • **kein w** - kein *was, were, we, with, what, when, where, who, how,
 *    now, know, will, would, well, want, water, work, down, two(!), low*.
 *    Ohne *was/were* gibt es KEINE Vergangenheit von *to be*: das ist der
 *    Grund fuer das durchgehende Praesens, nicht Stilwille. *low* wird zu
 *    *north* oder *flat*, *two* ist gar nicht sagbar - wo gezaehlt werden
 *    muss, heisst es *all three, less one*.
 *  • **kein c** - kein *can, come, call, each, such, much, which, school,
 *    chance, close, second, ice, track*. *each* wird zu *all*, *tracks* zu
 *    *the trail* und *the dents*.
 *  • **kein y** - kein *you, they, day, year, any, many, only, very, my, say,
 *    way* und **kein einziger Wochentag** (alle sieben tragen ein y). Und:
 *    **kein Adverb auf -ly**, ausnahmslos. Wo eines noetig waere, steht eine
 *    Praepositionalfuegung (*he holds the hill road hard*).
 *  • **kein b, p, v** - kein *be, been, back, by, about, people, part, place,
 *    have(!), give, over, never, rope, keep, help*. *have* fehlt, *has* und
 *    *had* nicht. Statt *rope* traegt *the lead*.
 *  • **ZEIT ist das zweite grosse Loch**: kein *day, night, hour, minute,
 *    week, month, year*, kein Wochentag, kein Monat, kein *morning, evening,
 *    dawn, dusk*. Was bleibt: **noon, afternoon, season** und die Marken
 *    *at first, then, later, at last, in the end, after that, as it darkens*.
 *    Die Serien messen ihre Zeit darum in *afternoons* und *seasons*.
 *  • ZAHLEN: frei sind **one, three, nine, ten, thirteen, fifteen, nineteen**
 *    und die Ordinalzahlen *first, third, ninth, tenth*. Gesperrt: two, four,
 *    five, six, seven, eight, twelve, twenty, hundred, thousand. Maasse gibt
 *    es keine (*metre, minute, mile, kilo* haengen alle am m oder u); gemessen
 *    wird in *a hand*, *a hand and a half*, *at her knee*, *as far as the
 *    flat of her hand*.
 *
 * ── DIE TEUERSTE FALLE (aus I2-N, hier entschaerft, aber nicht weg) ───────
 *
 * **at ist kein Ersatz fuer to und on.** Beide sind auf dieser Sprosse frei
 * und stehen darum ueberall, wo sie hingehoeren; `at` steht nur noch fuer
 * Ort (*at the shed*), Zeit (*at noon*), Blick und Griff (*stares at*, *holds
 * fast at*) und fuer das Danebenstehen (*at her side*).
 *
 * Das ist die Fortschreibung der I2-N-Lehre fuer diese Sprosse, und der
 * Unterschied ist wichtig: bei I2 (n=15) waren `to` und `on` GESPERRT, das
 * ausweichende `at` war dort ein Notbehelf. Ab n=16 liegen `o` und `n` beide
 * im Budget - `at` an einer Stelle, an der Englisch `on` oder `to` verlangt,
 * ist hier also kein Zwang, sondern ein Fehler. Die Charge E16-N hat fuenf
 * solche Stellen getauscht (Hand ON der Kerbe, ON the far side, Schlingen ON
 * the trails, Haende TO the lantern, Dose ON the shelf). Was RICHTIG bleibt:
 * jedes *at all*, alle Ortsangaben (*at the ford*, *at the drain*, *at the
 * station*, *at noon*), *at his side* (= daneben), *holds the hare at the
 * head*, *one hand at the stake*.
 *
 * ── DIE WISSENS-SERIE: GEPRUEFT, UND SIE GEHT ────────────────────────────
 *
 * Der Auftrag E16 §4 laesst offen, ob auf dieser Sprosse eine Wissens-Serie
 * moeglich ist. Der Probelauf sagt: knapp, aber ja - und sie steht als
 * `Salt and the Sea` (kids) in dieser Datei. Der Befund im Einzelnen:
 *  • Es gibt KEINE Maasseinheit (metre, minute, mile, hour, gram haengen alle
 *    am m oder u). Groessenordnung geht darum nur ueber ANTEILE - und die
 *    tragen: *a third*, *a tenth*, *half a tenth*, *less than*, *far more?* -
 *    nein, *more* haengt am m; es heisst *far saltier*, *far less*.
 *  • Der Begruendungs-Satz war die eigentliche Frage: kein **because** (c),
 *    kein **when** (w), kein **with** (w), kein **from** (m), kein **can**
 *    (c), kein **why** (y). Es traegt aber **the reason** (frei!) und **so**:
 *    *That end is the reason the Dead Sea is as it is.* Damit ist ein
 *    Sachtext moeglich, der nicht bloss aufzaehlt.
 *  • Die GRENZE, die eine Wissens-Serie zeigen muss, liefert der Stoff
 *    selbst: Regen nimmt Salz nur bis zur Saettigung auf, danach faellt es
 *    als Halit zu Boden - und wo es so salzig ist, lebt kein Fisch.
 *  • Jede Sachaussage der Serie ist doppelt belegt; die Fundstellen stehen
 *    am `herkunft`-Feld der Serie (NOAA/USGS, Britannica/Wikipedia zum
 *    Toten Meer, NASA Earth Observatory zum Halit, ASM zum Salzen).
 *  • Was NICHT ging: eine Wissens-Serie mit MESSWERTEN. Ohne Einheit gibt
 *    es kein 35 g je kg und keine 34 Prozent - nur *a third* und *half a
 *    tenth*. Die Serie kann Groessenordnungen zeigen, nicht messen.
 *
 * ── FORM UND RECHTE (wie im ganzen englischen Bestand) ────────────────────
 *
 * Selbst verfasst (Bauplan 27.07. §10), britisches Englisch, KEINE
 * Apostrophe, woertliche Rede OHNE Anfuehrungszeichen, keine Ziffern, jede
 * Zeile EIN Satz (darum keine Pflege in `fruehFassungen.ts`) und hoechstens
 * 85 Zeichen, nur der einfache Bindestrich.
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
// kids - Fischotter, Furt, Feldgraben. Ohne g gibt es keine tracks und keine
// -ing-Form: die Spur heisst *the trail* und *the dents*, und alles steht im
// Praesens. Der Otter-Bau heisst im Englischen *holt* - ein Wort, das ganz
// aus dem Budget faellt und nebenbei etwas beibringt.
// ---------------------------------------------------------------------------
const THE_OTTER_AT_THE_FORD: Serie = {
  slug: "en-the-otter-at-the-ford",
  titel: "The Otter at the Ford",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ida and Aron take the field trail to the ford.",
        "The rain has left the silt at the flat side soft.",
        "There is a trail in it, and the trail is fresh.",
        "It is not a hen, and it is not a deer.",
        "Aron kneels and sets his hand near the first dent.",
        "One dent is as far as the flat of her hand.",
        "Inside it there is a star of toes.",
        "Otter, Ida tells Aron.",
        "The trail leads to the alder roots and ends there.",
        "The sand inside the roots is dark and it falls off.",
        "There is a hole in it, and the hole is as tall as a tin.",
        "Ida holds still, and inside the hole there is a soft, hard hiss.",
      ],
    },
    {
      lines: [
        "The hiss halts, and the alder roots stand still.",
        "That is a holt, Ida tells Aron.",
        "A holt is the den of an otter, and it sits in old roots.",
        "The otter is inside it, and it hears the alder shake.",
        "Aron lets his hand fall and treads far off the roots.",
        "Ida sets a flat stone in the silt at the ford.",
        "If the otter treads there, the stone holds its trail, she tells Aron.",
        "Then the rain does not take the trail off the land.",
        "The rain lands at noon and it holds all afternoon.",
        "As it thins, the ford is fast and the silt is fresh.",
        "On the flat stone there are three dents.",
        "This trail does not lead to the holt: it heads into the field.",
      ],
    },
    {
      lines: [
        "The field is flat, and the trail is hard to hold.",
        "Aron finds one dent, then not one at all, then three.",
        "The trail leads to the old field drain.",
        "The drain holds a still flood, dark at the reed line.",
        "In the still flood there are eels.",
        "An otter takes eels, and it takes fish, Ida tells Aron.",
        "Then the reeds shift at the far end of the drain.",
        "The otter is there, and it slides in as if the flood is air.",
        "It is not seen at all, and then it rises.",
        "There is an eel in its teeth, and it holds the eel hard.",
        "It heads off into the reeds and the reeds fold on it.",
        "Then, on the far side of the drain, a net lifts and falls.",
      ],
    },
    {
      lines: [
        "The net sits on a rod, and Old Kadir holds the rod.",
        "He takes eels at this drain, and he has done so all his life.",
        "Ida tells Old Kadir that an otter is at the drain.",
        "Old Kadir lets the net fall in the reeds and holds still.",
        "Then he lifts it, folds it and sets it at his side.",
        "If the otter is here, the eels are here, he tells her.",
        "He hands Aron the rod and takes the trail to the ford.",
        "Then all three sit at the drain and hold still.",
        "The reeds shift, and the otter slides into the flood.",
        "It rolls, and there is not one drift of rain on its hair.",
        "Ida sets a flat stone at the drain, and Aron sets one at the ford.",
        "The trails are held, and the otter is not.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// teens - Hochwasser auf einem kleinen Hof. Kein *low* (w), also heisst das
// tiefe Feld *the north field*; keine *hedge* (g), also *the thorn line*;
// kein *rope* (p), also *the lead*. Die Zeit laeuft in Nachmittagen, weil es
// weder Stunde noch Tag noch Nacht gibt. Kein Schlusssatz mit Moral: am Ende
// steht eine frische Kerbe im Schuppentor, sonst nichts.
// ---------------------------------------------------------------------------
const THE_FLOOD_LINE: Serie = {
  slug: "en-the-flood-line",
  titel: "The Flood Line",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The rain lands at noon, and it does not halt.",
        "Ronja treads the lane to the ford and finds it fast and dark.",
        "The stones of the ford are lost in it, and the road at the side is thin.",
        "On the shed door there is a line filed into the oak.",
        "Erol filed it there after the last flood, and it stands at her knee.",
        "In the shed there are thirteen hens, a sled and all the oats.",
        "The oats sit on the floor at the hen end.",
        "Ronja finds Erol at the trailer in the shed lane.",
        "The ford is at the third stone, she tells her father.",
        "It rains, and then it rains, and then it holds off, he tells her.",
        "He does not lift his head off the drill.",
        "Then the road at the ford darkens, and the dark on it is not rain.",
      ],
    },
    {
      lines: [
        "Erol stands at the shed door and reads the filed line.",
        "The flood is not at the shed, and it is not far off it.",
        "He hands Ronja the tin of nails and takes the ladder off the rail.",
        "The oats sit on the floor, so the oats lift first.",
        "Ronja hoists the oats to the loft, one load and then the other.",
        "The hens do not take to the ladder, and one is loose in the lane.",
        "She finds it in the thorn at the field side and holds it fast.",
        "Then the flood takes the lane, and it takes it at one stroke.",
        "It stands at the shed door in less than an afternoon.",
        "Erol lifts the last hen into the loft and sets the ladder inside.",
        "Then he stands in the flood at the door and he is still.",
        "The trailer is at the north field, he tells Ronja, and the seed is in it.",
      ],
    },
    {
      lines: [
        "The north field lies at the far side of the ford.",
        "The road there is lost in the flood, so Erol takes the hill trail.",
        "Ronja treads after her father, and the rain finds all the holes in her hood.",
        "The trailer holds the seed for the season.",
        "Seed that the flood finds is seed that is lost, Erol tells her.",
        "At the hill end the field is a lake, flat and dark and still.",
        "The trailer stands in it, and it has drifted a third of the field.",
        "It is held on the thorn line at the field end, and the thorns hold.",
        "Erol treads in as far as his knees and halts.",
        "This lake is faster than it looks, he tells her.",
        "Then, at the far thorns, a horse stands in the flood.",
        "It does not shift at all, and it holds its head to the rain.",
      ],
    },
    {
      lines: [
        "The horse is the horse of Old Doris at the hill hall.",
        "Erol sends Ronja to the hall and holds the thorn line.",
        "Ronja treads the hill trail and she does not halt at all.",
        "Doris takes her lead and her hat and heads off after her.",
        "The horse holds still as Doris sets the lead on its head.",
        "It treads free at the thorn line, and it is not lost.",
        "The trailer holds fast in the thorns, and the seed in it is lost.",
        "As it darkens, Erol files a fresh line into the shed door.",
        "The older line sits at her knee; the fresh one stands a hand and a half taller.",
        "Ronja sets her hand on the older line and then on the fresh one.",
        "Then she takes the file and files her first line into the oak.",
        "The hens are in the loft, and the lane is a ford.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// erwachsen - Tischlerei, Auftrag, Fristen, Fehlbetrag. Der Kern der Serie
// ist eine Zahl, die man auf dieser Sprosse nicht sagen kann: *two* haengt am
// w und *four* am u. Gezaehlt wird darum ueber *all three, less one* und
// *the fee less one door* - was der Sache sogar naeher kommt als eine Zahl.
// Das Fachvokabular des Tischlers (joint, tenon, stile, trestle, lathe)
// steht dagegen vollstaendig zur Verfuegung.
// ---------------------------------------------------------------------------
const THE_THREE_OAK_DOORS: Serie = {
  slug: "en-the-three-oak-doors",
  titel: "The Three Oak Doors",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ines is a joiner, and her shed sits at the ford road.",
        "The hall at the hill sends her an order for its three oak doors.",
        "The old doors are rotten at the foot, and the frost is not far off.",
        "Ines lists the oak in her loft: it is oak for all three, less one.",
        "The oak for the third door is on order, and it lands after the frost.",
        "She has alder, and alder is not oak.",
        "Alder holds the rain far less than oak holds it.",
        "She sits at the desk and adds the fee in her head.",
        "The fee for three doors holds the shed all frost.",
        "The fee less one door holds it far less than that.",
        "Talia at the station takes the order on if Ines lets it fall.",
        "Ines sets the order on the desk and lets it lie there.",
      ],
    },
    {
      lines: [
        "At noon Ines dials the hall and asks for Halina.",
        "Halina holds the hall order, and she is not a soft hand.",
        "Ines tells her the oak, the frost and the alder, all three.",
        "Halina is silent, and the line hisses.",
        "Three doors is three doors, Halina tells her.",
        "The hall dinner is in the frost, and the doors are for the dinner.",
        "If one door is alder, it rots at the foot in three seasons.",
        "Then the hall orders that door a third season on, Ines tells her.",
        "Halina lets that sit, and she does not take it on.",
        "The order stands at three, and it stands in the frost, she tells Ines.",
        "Then Halina asks it flat.",
        "Is the third door oak, or is it not?",
      ],
    },
    {
      lines: [
        "Anders holds the field at the ford, and in it there lies a fallen oak.",
        "The flood took it, and it has lain there three seasons.",
        "Ines finds the heart of it hard and dark and free of rot.",
        "Anders takes a fee for it, and the fee is not a soft one.",
        "The oak is a lot to lift, and Ines has no loader.",
        "Hakan hoists it to the trailer and holds the hill road hard.",
        "The oak lands in the shed as it darkens.",
        "Ines sets it on the trestles and lets it stand.",
        "Oak that is not dried lifts and tilts, and it tears its joints.",
        "Dried oak has stood three seasons in a shed, and Ines has not three seasons.",
        "She sits on a trestle at the fresh oak in the dark shed.",
        "Then she thinks of the old hall doors: rotten at the foot, oak at the head.",
      ],
    },
    {
      lines: [
        "Ines lifts the three old doors off the hall and sets all three on the floor.",
        "The foot of all three is rotten, and the head of all three is oak.",
        "She files the rot off and finds hard oak a hand in.",
        "Then she sets fresh feet of oak into the old stiles.",
        "She fits a tenon at all three, and all three joints hold.",
        "The stiles are old and the feet are fresh, and the door is one door.",
        "Halina stands at the hall door and reads the line of the joint.",
        "It is not hidden, Ines tells her: this door is old oak and fresh oak.",
        "It holds the rain, and it holds it as oak holds it.",
        "The order is for three fresh doors, so the fee is not the fee for three.",
        "Halina hands her the fee less one door and the order for the hall floor.",
        "In the shed the fallen oak lies on the trestles and dries.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// kids, WISSENS-SERIE - der Probelauf aus dem Dateikopf, ausgefuehrt. Keine
// Maasseinheit (metre, minute, gram haengen alle am m oder u), also laeuft
// die Groessenordnung ueber Anteile: *a tenth*, *half a tenth*, *a third*.
// Der Begruendungs-Satz laeuft ueber *the reason* und *so*, weil *because*
// (c) und *when* (w) fehlen. Kein *river* (v) und kein *stream* (m): der
// kleine Bach heisst hier *rill* - beim ersten Auftreten erklaert er sich
// aus dem Satz. Die Grenze, die eine Wissens-Serie zeigen muss, liefert der
// Stoff selbst: die Saettigung und der tote Fisch.
// ---------------------------------------------------------------------------
const SALT_AND_THE_SEA: Serie = {
  slug: "en-salt-and-the-sea",
  titel: "Salt and the Sea",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "natur",
  herkunft: { ...EIGEN, fundstelle: "Meerwasser rund 3,5 Prozent Salz (35 g je kg): oceanservice.noaa.gov/facts/whysalty.html und usgs.gov/faqs/why-ocean-salty. Herkunft des Salzes - leicht saurer Regen loest Mineralien aus dem Gestein, Fluesse tragen sie ins Meer, Natrium und Chlorid stellen ueber 90 Prozent der geloesten Ionen: noaa.gov/jetstream/ocean/sea-water und usgs.gov/faqs/why-ocean-salty. Totes Meer rund 34 Prozent Salz und abflusslos (Jordan muendet hinein, Verlust nur ueber Verdunstung): britannica.com/place/Dead-Sea/Climate-and-hydrology und en.wikipedia.org/wiki/Dead_Sea. Keine Fische darin, starker Auftrieb durch die Dichte: britannica.com/place/Dead-Sea und newworldencyclopedia.org/entry/Dead_Sea. Halit faellt bei Saettigung aus und lagert sich am Grund ab: earthobservatory.nasa.gov/images/145373/getting-saltier und en.wikipedia.org/wiki/Dead_Sea. Saettigungsgrenze rund 357-360 g Kochsalz je Liter (26 Prozent) bei 20-25 Grad: en.wikipedia.org/wiki/Saline_water und ck12.org (Loeslichkeit NaCl 360 g/L bei 25 Grad). Salz senkt den Gefrierpunkt, darum Streusalz: en.wikipedia.org/wiki/Road_salt und science.howstuffworks.com/nature/climate-weather/atmospheric/road-salt.htm. Salzen entzieht Wasser und hemmt Mikroben, seit der Antike die Haltbarmachung: asm.org/articles/2024/january/salt,-microbes,-acid,-heat-in-food-preservation und recipes.howstuffworks.com/tools-and-techniques/salt-prevent-food-from-spoiling.htm. Traenen rund 0,9 Prozent Kochsalz, also deutlich duenner als Meerwasser: allaboutvision.com/eye-care/eye-anatomy/why-are-tears-salty und scienceabc.com/humans/why-are-tears-salty. Geprueft am 21.08.2026." },
  etappen: [
    {
      lines: [
        "The sea is salt, and the rain that lands on it is not.",
        "Set a dish of sea in the heat and let it stand all afternoon.",
        "The dish thins and thins, and at last it is no dish of sea at all.",
        "There is a fine, hard sand in it, and that sand is salt.",
        "The rain has lifted off, and the salt has not.",
        "Salt does not lift off, and all the rest sits on that.",
        "So the salt of the sea has a start, and the start is not the sea.",
        "It starts on land, in the stone of the hills.",
        "Rain lands on stone, and rain eats at stone.",
        "It takes salt off it, and it takes iron off it, and it holds all that.",
        "Then it drains off in thin rills, and all the rills lead to the sea.",
        "So the salt of the sea is the salt of the hills, and it sits there still.",
      ],
    },
    {
      lines: [
        "So, is the sea as salt as it looks?",
        "Less than it looks: not a tenth of it is salt, and not half a tenth either.",
        "In a tin of sea, all of it is rain, less a thin hand of salt.",
        "That is little, and the sea is not little.",
        "There is one lake that is far saltier than all the rest.",
        "It sits at the east, at the end of the Jordan, in a hard, hot land.",
        "It is the Dead Sea, and it is a lake, not a sea.",
        "In it, a third of all that stands there is salt.",
        "Set the one at the other: less than half a tenth, and a third.",
        "Rain lands in the Dead Sea, and no rill drains free of it.",
        "The heat lifts the rain off it, and the salt is left, season after season.",
        "The salt in it holds and holds - and there is an end to that.",
      ],
    },
    {
      lines: [
        "Rain takes in salt, and it takes it in to an end.",
        "Set salt in a dish of rain and stir it in.",
        "Set in a fresh hand of it, and that, too, is taken in.",
        "Set in one hand and then another and then another.",
        "At an end the rain takes in no salt at all.",
        "The salt that is left sits at the floor of the dish, hard and flat.",
        "That end is the reason the Dead Sea is as it is.",
        "It holds all the salt it takes, and the rest falls to its floor.",
        "The salt at that floor is halite, and it lies there in flat sheets.",
        "No fish is in the Dead Sea, not one, and there is a reason for that.",
        "Salt as hard as that takes the rain off a fish, and no fish holds at that.",
        "There is one odd trait left, and it is the oddest of all.",
      ],
    },
    {
      lines: [
        "Sit in the Dead Sea, and it holds a lad or a lass afloat.",
        "The salt in it is so dense that it lifts a head free of the flood.",
        "Fresh rain does not do that, and the sea does far less of it.",
        "It is the salt that holds a lad afloat, and it is not the hands at all.",
        "Salt is in a lot that is not the sea.",
        "It is in a tear: a tear is salt, and it is far thinner than the sea.",
        "Salt in a fish takes the rain off the flesh, and rot does not take hold.",
        "That is old, old trade: salt held the food of all the frost seasons.",
        "Salt is on the road, too.",
        "Rain that holds salt does not harden in the frost as fresh rain does.",
        "So salt on a road holds the frost off it, and no heat at all is in that.",
        "Salt sits, and rain lifts off: the sea, the lake, the tear and the road.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// teens - Schlingen im Feld, eine Vierzehnjaehrige und ein alter Paechter,
// der kein Einkommen hat. Kein *light* (g), also ist die Lampe eine
// *lantern* und das Licht *lit*; kein *wire* (w), also *a thin steel
// thread*; kein *again* und kein *when*. Es gibt keine Zukunftsform (kein
// *will*), das Kommende steht darum im Praesens oder in *is to*. Der
// Schluss traegt keine Moral: die Abmachung ist unfair und sie haelt.
// ---------------------------------------------------------------------------
const THE_NINTH_SNARE: Serie = {
  slug: "en-the-ninth-snare",
  titel: "The Ninth Snare",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Tilda takes the field trail after the frost, as she does after all the frosts.",
        "At the thorn line there is a hare, and the hare is not dead.",
        "It is held at the foot in a thin steel thread.",
        "The thread is set in a loose knot at a stake.",
        "Tilda kneels and holds the hare at the head and the flank.",
        "Then she lets the knot free, one hand at the stake and one at the hare.",
        "The hare treads free and is lost in the thorns in less than an instant.",
        "Tilda stands there and holds the thread and the stake in her hand.",
        "Three treads later, on the far side of the thorns, there is another stake.",
        "There is a third at the field end, and a ninth at the drain.",
        "All nine are set on the trails the hares take, and all nine are fresh.",
        "Tilda has the trail to herself, and she has it all afternoon.",
      ],
    },
    {
      lines: [
        "She sets a flat stone at all nine stakes and reads the trail to the end.",
        "The stones hold the stakes, so the stakes are not lost in the thorns.",
        "She lets all nine snares stand, and she does not take one off.",
        "A snare that is not there tells the hand that set it that it is seen.",
        "Tilda is not set on that, and she is not set on the hares in the thread.",
        "She sits at the drain and reads her list of stones and stakes.",
        "Nine snares is not one hare for the hearth: nine is a trade.",
        "The hares of nine snares are hares that are sold.",
        "Then she reads her list of nine and finds that all nine hold to one end.",
        "All nine sit at the north end, and all nine are near the shed.",
        "The shed at the field end has stood still all the frost.",
        "As it darkens, there is a lit lantern inside it.",
      ],
    },
    {
      lines: [
        "Tilda holds off the trail and treads the drain to the shed.",
        "The shed door stands half free, and the lantern sits on the floor.",
        "Old Hakan sits at a stool and folds a thin steel thread on a rod.",
        "There are stakes at his feet, and there are threads on the shelf.",
        "He sees her at the door and he does not stand and he does not halt.",
        "Nine snares, she tells Hakan, and one held a hare all afternoon.",
        "Hakan sets the rod on the shelf and holds his hands to the lantern.",
        "The hares eat his seed, he tells her, and the seed is the season.",
        "He sells the rest at the station and the fee holds the shed in the frost.",
        "Then he tells her that he has not held a fee off the field in three seasons.",
        "Tilda stands at the door and lets the frost in and does not shift.",
        "Then Hakan asks her the hard one: is she to tell the hall?",
      ],
    },
    {
      lines: [
        "Tilda does not tell the hall, and she does not tell her father.",
        "She tells Hakan a trade instead, and she tells it flat.",
        "The trail at the thorn line is hers, and no snare sits there.",
        "The seed field at the north end is his, and the snares stand there.",
        "A snare is read at first, and no hare holds in a thread all afternoon.",
        "Hakan lets that sit and then he lets it stand.",
        "He lifts the nine stakes off the thorn trail and sets three at the seed field.",
        "Tilda holds the nine flat stones on her list, and she holds the list.",
        "She takes the trail after the frost, as she does after all the frosts.",
        "At the seed field she halts and reads the three stakes.",
        "The thorn line holds no thread at all, and her nine stones sit in the frost.",
        "It is not a fair trade, and it holds.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// erwachsen - Grundgrenze, Urkunde, Nachbarschaft. Kein *border*, kein
// *boundary*, kein *map*, kein *measure*, kein *metre*: gemessen wird in
// *rods* (die alte Feldrute, die genau ins Budget passt), und die Grenze
// heisst schlicht *the line*. Kein *now* (w) - was gerade gilt, heisst *as
// it stands*. Die Urkunde gibt der Erzaehlerin nicht recht, sondern dem
// Nachbarn; das bleibt so stehen.
// ---------------------------------------------------------------------------
const THE_LINE_AT_THE_ALDER: Serie = {
  slug: "en-the-line-at-the-alder",
  titel: "The Line at the Alder",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The old alder at the field end fell in the flood.",
        "It stood there as far as all the tenants at the ford road hold in the head.",
        "It stood at the line: the field of Frida at one side, that of Aslan at the other.",
        "No stone stands there, and no rail stands there, and no deed is at hand.",
        "There is the alder, and after the flood there is the fallen alder.",
        "Frida finds it at first, flat on the drain and torn at the root.",
        "Aslan is at the far side, and he holds a stake and a hand file.",
        "It is a hard fall, he tells her, and it is a hard field.",
        "Frida asks Aslan the line, if the alder does not hold it.",
        "The drain stands there, Aslan tells her, and the drain is the line.",
        "The drain lies three rods into the field that Frida tends.",
        "Frida does not fold, and she does not stand her side of it either.",
      ],
    },
    {
      lines: [
        "At noon Frida sits at the desk in her hall and lists it flat.",
        "Three rods is not the field, and three rods is not little either.",
        "It is the oat land at the north end, and that oat land is the seed of it.",
        "Frida has tended that oat land after all the frosts of nine seasons.",
        "Aslan has held his field three seasons, not nine, and he holds the deed of it.",
        "A field is held on a deed, and it is not held on a tended oat land.",
        "So Frida takes the ford road to the hall at the hill and asks for the field list.",
        "The hall holds all the deeds of the ford road in a tin at the third shelf.",
        "The tin is dented, and the deeds in it are old and thin and hard.",
        "Frida finds the deed of her field at the end of the tin.",
        "It is the older deed, and an older deed holds.",
        "Then she reads the line of it, and it is not the line she holds in her head.",
      ],
    },
    {
      lines: [
        "The deed does not tell of the alder at all.",
        "It tells of the old drain: the line stands at the drain and not a rod off it.",
        "Frida reads it and reads it, and it stands as it stands.",
        "Aslan is not off the line: her older deed sets the line at the drain.",
        "The three rods are not hers, and the alder held a line that had no deed.",
        "It is not the fall of the alder that took the oat land off her.",
        "It is the alder that held it there, and it held it there all nine seasons.",
        "Frida sets the deed in the tin and sets the tin on the third shelf.",
        "Then she takes the ford road to the field and she does not hold off.",
        "Aslan stands at the drain and holds his stake as if it is a rod of iron.",
        "It is the drain, Frida tells Aslan, and it is in the deed, alder or no alder.",
        "He lets the stake fall, and he does not lift his head at first.",
      ],
    },
    {
      lines: [
        "The three rods are the drain side, and the oats there are the last of hers.",
        "Frida sets the first stone at the drain end, and Aslan sets the tenth.",
        "The stones stand at the drain, one at all ten rods of the field.",
        "Aslan lets her lift the last of the oats and lets her hold the fallen alder.",
        "Alder holds the hearth as fine as oak does, he tells her, and he is not soft.",
        "Frida takes the alder in three loads and lets the third stand at the shed.",
        "Then the tenants stand at the stones and shake hands, and it is not soft.",
        "The oat land is his, and it is his in the frost and in the seed season.",
        "Frida tends the field at her side of the stones, and it is not less a field.",
        "The fallen alder lies at the drain and holds no line at all.",
        "The tenants at the ford road hold to the alder line in the head still.",
        "The line that stands is the line in the deed, and it is not the alder.",
      ],
    },
  ],
};

/** Die englischen Serien der Charge E16 (Sprosse 16 der neuen Folge). */
export const SERIEN_EN_SPROSSE16: Serie[] = [
  THE_OTTER_AT_THE_FORD,
  SALT_AND_THE_SEA,
  THE_FLOOD_LINE,
  THE_NINTH_SNARE,
  THE_THREE_OAK_DOORS,
  THE_LINE_AT_THE_ALDER,
];
