/**
 * FRUEHE ENGLISCHE Buecherei-Serien (Charge I2, 21.08.2026) - die erste
 * englische Treppe ueberhaupt, und die erste, die alle drei Altersstufen
 * getrennt bedient.
 *
 * ANLASS (Bauplan 14.08. §5 I2, gemessen am 21.08. mit `_seroeffnung.mts` und
 * der Ratschen-Tafel in `tests/typing-altersgrenze.test.ts`): Die englische
 * Buecherei hatte sieben Serien, und alle sieben oeffneten spaet - eine bei
 * n=22, zwei bei n=29, vier bei n=30. Offene Serien an den Regal-Punkten
 * [13, 17, 20, 22, 26, 31, 99]:
 *
 *   EN kids       [0, 0, 0, 1, 1, 6, 6]      DE kids       [2, 4, 7, 16, 19, 33, 33]
 *   EN teens      [0, 0, 0, 1, 1, 7, 7]      DE teens      [4, 9, 18, 21, 26, 45, 45]
 *   EN erwachsen  [0, 0, 0, 0, 0, 4, 4]      DE erwachsen  [2, 4, 6, 7, 10, 17, 17]
 *
 * Wer auf Englisch lernt, sah bis 22 gelernte Einheiten NICHTS in der
 * Buecherei; auf Deutsch standen an derselben Stelle 24 Serien. Das ist das
 * Loch, das diese Charge fuellt - nicht die reine Serienzahl.
 *
 * ── DIE ENGLISCHE BESONDERHEIT ────────────────────────────────────────────
 *
 * Es gibt nur EINE `INTRO_ORDER` (`letters.ts`), und die ist auf das Deutsche
 * getextet. Fuer Englisch heisst das:
 *
 *   n=13  f j d k s l a ö e n i r t   - das ö ist wertlos, real sind es ZWOELF
 *   n=15 +h   n=16 +o   n=17 +u   n=18 +c   n=19 +g   n=20 +m   n=21 +b
 *   n=22 +w   n=23 +z   n=24 +v   n=25 +p   n=28 +x   n=29 +y   n=30 +q
 *   n=26 +ä · n=27 +ü · n=31 +ß  - fuer Englisch ALLE DREI WERTLOS
 *
 * ★ ACHTUNG: Diese Tafel ist die NACH Charge O1 (21.08.2026). Bis dahin stand
 * das `o` erst auf Platz 20 (n=16 +u · 17 +c · 18 +g · 19 +m · 20 +o); O1 hat
 * es direkt hinter das `h` gezogen, weil im Englischen to, of, on, not, no,
 * one und for daran haengen. Gemessene Schreibbarkeit EN: 16 Tasten 31 -> 42 %,
 * 17 Tasten 32 -> 47 %, 18 Tasten 33 -> 49 %; ab 20 Tasten ist die Menge
 * unveraendert. Die Serien dieser Datei oeffnen darum jetzt bei
 * kids 15/17/18/20/20/22/25, teens 15/18/19/20/22/24/29, erwachsen
 * 18/20/20/22/25/29 (vorher kids 15/16/17/19/20/22/25, teens 15/17/18/20/22/
 * 24/29, erwachsen 17/19/20/22/25/29).
 *
 * Die letzte Zeile hat eine Folge, die man kennen muss: eine englische Serie
 * kann die Regal-Punkte 26 und 27 gar nicht treffen. Wer bis p (25) schreibt,
 * oeffnet bei 25; das naechste erreichbare n ist 28.
 *
 * ── WARUM DIE SPALTE n=13 LEER BLEIBT ─────────────────────────────────────
 *
 * Bei dreizehn Einheiten fehlt das h - und damit **the**. Das Deutsche hat an
 * derselben Stelle der, die, das, den und kommt durch (so entstanden »Die
 * Terrasse«, »Der Riss«, »Der Laden«). Das Englische hat bei n=13 KEINEN
 * bestimmten Artikel, dazu weder to noch of noch on noch not. Eine Serie waere
 * kein Englisch mehr, sondern Telegramm-Stil ueber 48 Zeilen. Darum beginnt
 * diese Treppe ehrlich bei n=15, und die Spalte 13 bleibt in allen drei
 * englischen Stufen 0. Das ist eine Entscheidung, keine Luecke.
 *
 * ── WORTSCHATZ-GRENZEN JE SPROSSE (am Objekt gemessen, nicht geschaetzt) ──
 *
 *  • n=15 (+h) - `a d e f h i j k l n r s t`. DA: the, this, that, then,
 *    there, he, she, his, her, has, had, here, half, first, third, last,
 *    after, instead, at last, as if. FEHLT und tut weh: **jede Verneinung** -
 *    not, no, none (o), never (v), nothing (o) sind alle gesperrt, erzaehlt
 *    wird nur, was IST. Kein **to**, kein **of** (der Genitiv laeuft ueber
 *    zusammengesetzte Nomen: silt sacks, cellar stair, tide line). Keine
 *    **Tuer** (door o, latch c, gate g, hatch c). Keine **Tageszeit** (dawn w,
 *    dusk u, night g) - der Tag laeuft ueber Gezeiten und ueber das Licht auf
 *    dem Wasser. Kein him/them (m), kein thing (g), kein key (y), kein but
 *    (b), kein can (c), kein must (m!). Was traegt: das Perfekt (has/had +
 *    Partizip) und `let` als einziges Modalverb.
 *  • n=16 (+o) - DIE Sprosse, die Charge O1 geschaffen hat: to, of, on, into,
 *    out, for, no, not, none, nor, one, other, another, do, does, did, so,
 *    also, alone, north, south, door, floor, food, hour, road, hold, told,
 *    look, took, note, oil, soil. Damit hat das Englische zum ersten Mal
 *    ueberhaupt eine **Verneinung** (not/no/none) und ein **Ziel** (to/on) -
 *    vorher gab es unterhalb von 20 beides nicht.
 *  • n=17 (+u) - jetzt until, just, trust, dusk, dust, run, sun, hurt, hush,
 *    rush, full, fur, out of, our, four, hundred. Vor allem: die Vorsilbe
 *    **un-** (unsure, unseen, unhurt, untasted). ACHTUNG, teure Falle:
 *    **must haengt am m, nicht am u** - es kommt erst mit 20; der Ersatz ist
 *    **has to**, das seit 16 frei ist.
 *  • n=18 (+c) - can, cannot, each, such, reach, search, chance, cliff, chalk,
 *    clean, clear, ice, call, decides, descent, attic, kitchen, ancient,
 *    science, count. **thousand** geht seit 16 (o) und **hundred** seit 17.
 *  • n=19 (+g) - light, night, again, ridge, signal, single, straight, gate,
 *    grass, garden, ground, go, English und die ganze -ing-Form.
 *  • n=20 (+m) - him, them, must, time, name, same, small, from, more, most,
 *    home, come, machine, summer, metal, minute, million. Damit ist die
 *    Buchstabenmenge dieselbe wie vor O1 an dieser Stelle - der Gewinn lebt
 *    ganz in den Sprossen 16 bis 19.
 *  • n=21 (+b) - but, be, back, big, book, both, about, number, table, bed,
 *    brick, harbour.
 *  • n=22 (+w) - with, what, when, where, who, how, we, was, were, will,
 *    would, water, work, world, week, know, answer, always - und **down**,
 *    **own**, **two**. Das down ist der Grund, warum eine Serie ueber das
 *    Meer unterhalb von 22 gar nicht erst anfangen kann.
 *  • n=23 (+z) - size, dozen, zero, freeze, horizon, Amazon.
 *  • n=24 (+v) - have (has und had gibt es seit 15!), five, seven, eleven,
 *    twelve, over, never, ever, give, leave, move, river, arrive.
 *  • n=25 (+p) - up, part, people, keep, help, open, place, plant, deep,
 *    depth, pressure, speed, paper, apart, spring.
 *  • n=28 (+x) - next, six, box, text, exactly, example, exercise.
 *  • n=29 (+y) - you, they, day, year, way, my, by, very, every, many, any,
 *    only, yes, story, easy, money, energy, dry, carry - und **jeden
 *    Wochentag** (Monday, Tuesday, Thursday tragen alle ein y). Feinheit:
 *    **city** ist gesperrt, **cities** nicht.
 *  • n=30 (+q) - quick, question, quiet, quarter, equal, square, require.
 *
 * ── DIE TEUERSTE FALLE: at IST KEIN ERSATZ FUER to UND on ────────────────
 *
 * Unterhalb von n=16 gibt es weder **to** noch **on** (beide haengen am o).
 * Vor Charge O1 galt das bis n=19, und genau dort ist der Fehler entstanden -
 * die Serien dieser Datei sind unter der alten Grenze geschrieben worden.
 * Beim Schreiben dieser Charge hat sich daraus fast von selbst ein falsches
 * `at` eingeschlichen - an rund fuenfzig Stellen, und KEIN Skript faengt das:
 * die Zeile ist buchstabengerecht, kurz, einsatzig, dublettenfrei - und
 * trotzdem kein Englisch. »She treads at her dad«, »letters at his sister«,
 * »hands the flask at Dilan«, »lets it lie at her desk«, »a cast at it«.
 * Kinder lernen so etwas mit; es ist bei der Abnahme am 21.08. aufgefallen und
 * in der Nacharbeit I2-N vollstaendig behoben worden.
 *
 * DER GENERALSCHLUESSEL ist der **Doppelobjekt-Bau**: er braucht ueberhaupt
 * keine Praeposition und ist idiomatischer als jeder Ersatz.
 *
 *     hands Dilan the flask   ·   sends Ilse the tin   ·   tells her the tale
 *     left the tenant a letter   ·   sends the estate head a letter
 *
 * Weitere Auswege, die getragen haben, in der Reihenfolge des Zugriffs:
 *  • das Ziel zum SUBJEKT machen: »its heft lands in the drain«, »Astrid is
 *    standing in its light«, »the hare is under it«, »its tail is under it«.
 *  • ein Verb suchen, das die Richtung schon enthaelt: reaches, finds, catches,
 *    needs, seals, casts - statt lifts/sets/rests + Praeposition.
 *  • **in** und **near** sind ab 13 bzw. 15 frei und decken vieles ab, was
 *    sonst on/to braeuchte: »Dust falls in their hair«, »he tilts it near his
 *    ear«, »an inch in each three feet«.
 *  • die Praeposition ganz streichen: »has settled an inch«, »sets it aside«.
 *
 * Richtig bleibt `at` fuer ORT (at the shed, at the third flat), fuer ZEIT (at
 * dusk, at the third night), fuer Blick und Griff (stares at, looks at, lifts
 * at, files at, strains at, tries her hand at) und fuer »daneben« (»it lets
 * her hand rest at its side«). Wer unsicher ist, ersetzt die Zeile - eine
 * gequaelte Praeposition ist teurer als ein Umbau.
 *
 * ── DIE ZAHLWOERTER-TREPPE ────────────────────────────────────────────────
 *
 *   ab 13: ten, nine, fifteen        ab 15: three, thirteen, nineteen, half
 *   ab 16: one, thousand             ab 17: four, fourteen, hundred
 *   ab 19: eight, eighteen           ab 20: million        ab 21: billion
 *   ab 22: two                       ab 23: zero
 *   ab 24: five, seven, eleven, twelve                           ab 28: six
 *   ab 29: twenty, thirty, forty, fifty, sixty, eighty, ninety
 *
 * (Diese Tafel ist die NACH Charge O1; vorher kamen one, four, fourteen,
 * thousand und million alle erst mit dem o auf Platz 20.) Zwischen 20 und 23
 * gibt es weiterhin weder two noch five noch six noch seven: jede Rechnung
 * dort muss mit one, three, four, eight, ten, hundred, thousand und million
 * auskommen. »Light and the Second« rechnet aus genau diesem Grund in
 * Lichtminuten statt in Kilometern.
 *
 * ── APOSTROPH, VARIETAET, ZEICHENSATZ ─────────────────────────────────────
 *
 * Apostrophe sind VERBOTEN: `fitText` behandelt sie hart, unterhalb der
 * Apostroph-Lektion passt eine Zeile mit Kontraktion gar nicht. Also kein
 * don't, kein it's, kein Genitiv-s - der Genitiv laeuft ueber of (ab 20) oder
 * ueber zusammengesetzte Nomen.
 *
 * Britisches Englisch ist Pflicht (`tests/typing-textnachschub-en.test.ts`):
 * favourite, colour, metre, litre, realise, travelled, neighbour.
 *
 * Zeichensatz wie im Bestand: woertliche Rede OHNE Anfuehrungszeichen
 * (Entscheidung Johannes 28.07.), keine Ziffern, Satzzeichen nur . , - ? ! : ;
 * und nur der einfache Bindestrich ([[feedback_nur_bindestrich]]). Jede Zeile
 * ist EIN Satz - so entfaellt die Pflege der fruehen Fassungen (Regel 9).
 *
 * ── RECHTE ────────────────────────────────────────────────────────────────
 *
 * Alle Serien dieser Datei sind SELBST VERFASST. Reale Texte - auch
 * gemeinfreie - halten sich nicht an eine Buchstaben-Freischaltung (Bauplan
 * 27.07. §10); auf diesen Sprossen ist eigenes Werk der einzige Weg. Die
 * Fakten der Wissens-Serien sind je an zwei unabhaengigen Stellen
 * gegengeprueft, die Belege stehen am Objekt in `herkunft.fundstelle`.
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
// n=15 - die frueheste englische Sprosse dieser Treppe. Mit dem h
// kommt das Wort, an dem im Englischen alles haengt: the. Kein o
// (also kein to, of, not, no, or - seit Charge O1 kommt es schon
// mit 16), kein m (kein him, them, name, time), kein g (kein thing,
// light, night und keine -ing-Form), kein y (kein key, day, they),
// kein u (kein just, must, shut).
// ---------------------------------------------------------------------------
const THE_SHELL_AT_THE_TIDE_LINE: Serie = {
  slug: "en-the-shell-at-the-tide-line",
  titel: "The Shell at the Tide Line",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Leila and her dad set the tent near the flat sand.",
        "The tide is far, and the salt air is fresh.",
        "Leila takes a red tin and treads the tide line.",
        "Shells, salt, sea stars, a thin fisher thread.",
        "She kneels and lifts a flat shell.",
        "It sits harder in her hand than the rest.",
        "She shakes it, and it rattles.",
        "She shakes it near her ear: the rattle is real.",
        "Inside the shell there is a shard that slides.",
        "She stares at the thin line that held the shell sealed.",
        "This shell is sealed, and a hand has sealed it.",
        "Leila sets it in the red tin and finds her dad at the tent.",
      ],
    },
    {
      lines: [
        "Leila lets her dad hear the shell.",
        "He tilts it near his ear and listens.",
        "A fisher sealed this, he tells her.",
        "Fishers seal a shell if it hides a dear letter.",
        "There is a fisher at the last shed, he tells her.",
        "He is Nils, and his nets hall is the last in the sand.",
        "Leila treads the sand as far as the last shed.",
        "Nils sits at the rail and settles his nets.",
        "She lets Nils hear the shell.",
        "Nils is still, and his hands rest.",
        "Ilse, he tells the sea.",
        "Then he heads inside and is silent.",
      ],
    },
    {
      lines: [
        "Leila stands at the still shed and listens.",
        "Later she lists it all: Ilse, a fisher, a sealed shell.",
        "Her dad finds a thin steel file in the tent.",
        "He files at the sealed line, thin as a hair.",
        "The shell falls in half.",
        "Inside there lies a thin red thread.",
        "The thread ties a flat slate shard.",
        "Leila lifts the shard as the last red line fades.",
        "There is a letter filed in the slate: I.",
        "Ilse, she tells her dad.",
        "Her dad stares at the last shed near the sand.",
        "The shed is still, and its rail has a faint shine.",
      ],
    },
    {
      lines: [
        "As the east reddens, Leila is at the shed.",
        "Nils lets her in and takes the shard in his hand.",
        "He kneels at the third stair and lifts a rail.",
        "A red tin lies hidden in the sand there.",
        "Inside the tin there are shells, and all are sealed.",
        "The salt has held all safe.",
        "Nils lifts a shard, and it is as thin as hers.",
        "The dark lines in the slate fit her lines.",
        "Ilse sealed the first shell, and Nils sealed the last.",
        "Ilse is his sister, and she sails far islands.",
        "Leila seals a shell that hides a red thread.",
        "She lets it lie at the tide line, and the sea takes it.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Geschrieben fuer n=16 der ALTEN Folge (+ u); seit Charge O1 oeffnet
// die Serie bei n=17, weil das u dort steht. Das u bringt dusk,
// until, just, trust und die Verneinung ueber die Vorsilbe un-
// (unsure, unseen, unhurt); geschrieben ist sie noch ohne o, also
// ohne not, to und of. Gesperrt bleiben c g m b w: kein each, kein
// again, kein night, kein him, kein man.
// ---------------------------------------------------------------------------
const THE_HARE_AT_DUSK: Serie = {
  slug: "en-the-hare-at-dusk",
  titel: "The Hare at Dusk",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Sadie sits at the shed stair until the sun sinks.",
        "At dusk the field dulls and the air stills.",
        "There is a rush in the tall stalks.",
        "A hare treads the trail at the field end.",
        "It halts, and its ears stand tall.",
        "Sadie is as still as slate.",
        "The hare treads until it is in the dust lane.",
        "Then it turns and is unseen.",
        "Sadie takes a sheet and lists the dusk.",
        "The hare, the trail, the tall dust lane.",
        "She sits there the dusk after this, and the hare is there.",
        "At the third dusk the hare halts and stares at her.",
      ],
    },
    {
      lines: [
        "The hare stares, and Sadie stares.",
        "Its fur is dull, and its side is thin.",
        "It treads, and it lets a red thread lie in the dust.",
        "Sadie kneels and lifts the dust in her hand.",
        "It is red and fresh.",
        "The hare is hurt.",
        "She trails the red hints as far as the ash trees.",
        "Under the ash it is far darker.",
        "The trail thins and then it ends at a hut.",
        "The hut leans, and its rails are half fallen.",
        "Inside there is a hush.",
        "Then there is a thud, and then a hard rush in the dust.",
      ],
    },
    {
      lines: [
        "Sadie steadies the fallen rail and stares in.",
        "The hare sits under the rail, and it is held fast.",
        "Its hind heel is red.",
        "The rail rests hard, and its tail is under it.",
        "Sadie is unsure: a hare that is hurt hits, and it hurts.",
        "She takes her thin shirt, and the hare is under it.",
        "The hare stills under it.",
        "She lifts at the rail, and the dust rushes.",
        "The rail slides free.",
        "The hare lies free in the dust.",
        "It rests, and it just trusts her hand.",
        "Then it darts under the ash and is unseen.",
      ],
    },
    {
      lines: [
        "Sadie treads inside as the last red dulls.",
        "Her hands share dust and hare fur.",
        "Her aunt tends the tea and hears the full tale.",
        "A hare that trusts a hand is rare, her aunt tells her.",
        "The dusk after that, Sadie sits at the shed stair.",
        "The field stalks stand still.",
        "There is a rush in the stalks, and then a thinner rush.",
        "The hare treads the trail, and it is unhurt.",
        "Then a little hare treads after it.",
        "It is just a hand tall.",
        "Sadie is still, and her heart thuds.",
        "The dusks after this, she lets the shed rail lie free.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Geschrieben fuer n=17 der ALTEN Folge (+ c); seit Charge O1 oeffnet
// die Serie bei n=18, weil das c dort steht. Das c oeffnet cat, can,
// each, such, reach, search, chill, chest, attic, kitchen. Gesperrt
// waren beim Schreiben g m o b w: kein milk, kein warm, kein small,
// kein night, kein house (o+u) und kein four - die Katze hat darum
// drei Junge. Verneint wird mit un-, lacks und fears; cannot faellt
// aus (o). Unter der NEUEN Folge waeren o und u hier laengst da -
// die Serie bleibt trotzdem, wie sie ist.
// ---------------------------------------------------------------------------
const THE_CAT_IN_THE_ATTIC: Serie = {
  slug: "en-the-cat-in-the-attic",
  titel: "The Cat in the Attic",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Nadia hears the attic at dusk.",
        "It is a tick, and then it is a scratch.",
        "Her dad calls it the chill in the rafters.",
        "The rafters tick, he tells her, and this is an ancient flat.",
        "Nadia listens harder at the stairs.",
        "The scratch shifts.",
        "It slides, it halts, and it lands.",
        "It is inside the attic, and it is real.",
        "She takes the stair and halts a stair under the hatch.",
        "Under the hatch there is silence.",
        "Nadia reaches the latch and halts.",
        "Then, inside the attic, a hiss.",
      ],
    },
    {
      lines: [
        "Nadia lets the latch rest and sits.",
        "She sits until the hiss stills.",
        "The stair is chill, and it hurts her heels.",
        "Her sister Ines finds her there.",
        "There is a cat in the attic, Nadia tells her.",
        "Ines lifts the latch, since Ines fears little.",
        "The hatch lifts an inch.",
        "Dust falls in their hair, thick and fine as ash.",
        "Nadia sets a hand lantern at the hatch rail.",
        "Chests, crates, a chair that has three feet.",
        "Instant and thin, in the far dark: a stare.",
        "The stare lasts, and then it is unseen.",
      ],
    },
    {
      lines: [
        "The cat is lean, and its fur is dull ash.",
        "It sits stiff in the dust and stares at the lantern.",
        "Nadia sits at the hatch and stills her hands.",
        "The cat hisses.",
        "She lets it hiss.",
        "Later she fetches a dish and sets a fish in it.",
        "She slides the dish in and treads the stair harder than usual.",
        "The fish lies there, and it is untasted.",
        "Then the cat eats, and its ears lift.",
        "Nadia sits nearer at the third dusk.",
        "The cat lets her sit, and it cleans its chin.",
        "Then, in the far dark, there is a thinner call: chirr, chirr.",
      ],
    },
    {
      lines: [
        "That thin chirr is a kitten.",
        "Nadia lifts the lantern and searches the far dark.",
        "Under the slates there is a crate, and it has tilted.",
        "In the crate, in an unused shirt, there are three kittens.",
        "Their ears are flat, and their thin tails curl.",
        "The cat sits at the crate and stares.",
        "Nadia stills her hands and lets the cat see her.",
        "It is chill under the slates, and a slate is cracked.",
        "Rain has left a dark trail at the crate side.",
        "Ines fetches their dad, and he takes the hatch stair.",
        "He tells the truth: the slate has failed, and rain can reach the crate.",
        "A slater is due at the attic, and the cat still fears their hands.",
      ],
    },
    {
      lines: [
        "Nadia sets a fresh crate in the stair cellar.",
        "She fills it: an unused shirt and a thin sheet.",
        "She sets a fish there in a clean dish.",
        "The cellar is still, and it is far less chill.",
        "Then she takes the hatch stair and sits at the attic hatch.",
        "She lets the hatch lie free.",
        "A cat can trust a stair, if the stair is a still stair.",
        "At dusk the cat lifts a kitten in its teeth.",
        "It treads all the stairs and it reaches the cellar.",
        "It fetches the third kitten last, since the third is the least.",
        "Nadia sits at the cellar stair and hushes.",
        "The cat cleans all three, and it lets her hand rest at its side.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=20 (vor Charge O1: 19). Erst hier gibt es light, night, again,
// garden, grass und die -ing-Form; erst hier gibt es him, them,
// name, time, summer. Geschrieben ohne o b w: kein not, kein to, kein of, kein
// bed, kein big, kein with, kein window - das Kind steht darum am
// kitchen glass und liegt unter dem red sheet.
// ---------------------------------------------------------------------------
const THE_LIGHT_IN_THE_GARDEN_SHED: Serie = {
  slug: "en-the-light-in-the-garden-shed",
  titel: "The Light in the Garden Shed",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Talia sees the light late in the night.",
        "It sits in the garden shed, and it is faint.",
        "It flickers, it dims, and then it glimmers again.",
        "She stands at the kitchen glass and stares.",
        "The shed lies dark all summer, since the drill machine died.",
        "Talia takes the stair, and the stair creaks.",
        "Amira, her little sister, lies still under her red sheet.",
        "Her lids are shut, and she is far less still than she thinks.",
        "Talia can hear it: Amira is faking her rest.",
        "The garden light dims again.",
        "Talia lifts the kitchen latch and treads in the chill grass.",
        "The shed light is at its dimmest, and then it dies.",
      ],
    },
    {
      lines: [
        "Talia halts at the shed and listens.",
        "In the dark she can hear a thin tick and a shift.",
        "She lifts the shed latch.",
        "The shed air is dust and dried grass.",
        "There is a great glass jar, and it stands in the shelf.",
        "In the jar there are little green glimmers.",
        "Fireflies.",
        "The lid is tight, and there is a thin slit in it.",
        "A red thread ties the jar handle and the shelf rail.",
        "Talia lifts the jar, and the glass is chill.",
        "The glimmers gather at her hand.",
        "Then the shed latch clicks, and Amira is standing there.",
      ],
    },
    {
      lines: [
        "Amira is mad, and her cheeks glisten.",
        "It is mine, she tells Talia.",
        "Talia sets the jar at the shelf and kneels in the grass.",
        "Their heads are near, and the jar glimmers under their chins.",
        "Amira feeds them grass and a fresh leaf in the night.",
        "There are fifteen in the jar, and just nine glimmer still.",
        "Talia lifts the jar and searches it in the faint light.",
        "Three lie in the sand, and their green has fled.",
        "Amira sees it, and she is silent.",
        "Fireflies are a summer thing, Talia tells her.",
        "It lights in the tall grass, at the ditch, in the hedge.",
        "In a glass jar it dims, and then its light is dead.",
      ],
    },
    {
      lines: [
        "Amira sits still and thinks a great deal.",
        "Then she lifts the jar herself.",
        "The sisters take the garden as far as the tall hedge.",
        "The grass is high, and the ditch air is chill.",
        "Amira untangles the red thread and lifts the lid.",
        "At first the fireflies remain still.",
        "Then a green glimmer lifts and drifts.",
        "Then a further glimmer, and then all the rest rise.",
        "The tall grass glitters, and the hedge glitters, and the air is green.",
        "Amira laughs, and her sister laughs.",
        "Talia sets the great glass jar in the shed, and its lid stands free.",
        "The shed lies dark, and the garden is lit.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=20 - unter der ALTEN Folge war das die Sprosse, auf der das o
// dazukam: erst hier gab es to, of, for, from, on und vor allem
// not. Vorher war eine Wissens-Serie kaum moeglich: ohne of gibt es
// keine Massangabe und ohne not keine Grenze. Seit Charge O1 kommt
// das o schon mit 16 - diese Serie oeffnet trotzdem weiter bei 20,
// weil sie das m braucht. Gesperrt
// bleiben b w v p y: kein about, kein but, kein how, kein water,
// kein have, kein two, kein per, kein they, kein many.
// ---------------------------------------------------------------------------
const HOW_ANTS_FIND_FOOD: Serie = {
  slug: "en-how-ants-find-food",
  titel: "How Ants Find Food",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "natur",
  herkunft: {
    ...EIGEN,
    fundstelle: "Duftspur und kuerzeste Route: en.wikipedia.org/wiki/Ant_colony_optimization_algorithms sowie Deneubourg u. a., Doppelbruecken-Versuch, Journal of Insect Behavior 1990. Traglast 10-50fache Koerpermasse: pestworldforkids.org/pest-info/bug-articles-by-type/how-much-can-ant-lift und askabiologist.asu.edu/content/ant-factoids. Koerperlaenge Lasius niger 3,5-5 mm: insectweek.org/discover-insects/ants-bees-wasps-and-sawflies/black-garden-ant und ants.fandom.com/wiki/Black_garden_ant. Millionen-Nester bei Blattschneiderameisen: a-z-animals.com/animals/leafcutter-ant und en.wikipedia.org/wiki/Atta_(genus). Aelteste Ameisen-Fossilien 100-113 Mio. Jahre: science.org/content/article/oldest-ant-fossil-ever-found und smithsonianmag.com (Vulcanidris cratensis, 2025). Geprueft am 21.08.2026.",
  },
  etappen: [
    {
      lines: [
        "One ant comes out of the nest, and it is alone.",
        "It does not run in a straight line.",
        "It circles, it turns, it circles again.",
        "The circles get longer, and the ant tests the ground.",
        "Its antennae test the ground and taste the air.",
        "Then the ant finds a grain of sugar.",
        "It takes as much of it as it can hold.",
        "Then it turns and runs a much straighter line home.",
        "As it runs, it lets a thin scent lie on the ground.",
        "That scent is a trail, and the trail lasts a short time.",
        "In the nest, other ants meet it and taste the sugar.",
        "The ant that found the food does not eat it all: it tells the nest.",
      ],
    },
    {
      lines: [
        "Ten ants come out and find the scent trail.",
        "Each ant tracks the scent as far as the grain.",
        "Each ant that returns lets a fresh scent lie on the trail.",
        "So the trail gets stronger, not fainter.",
        "There are often three routes to one grain of sugar.",
        "The short route takes the least time.",
        "An ant on the short route returns first, and it returns again.",
        "So the short route gathers the most scent.",
        "The long route fades, and in an hour it is gone.",
        "No ant chose the short route.",
        "The ants got to the sugar through the scent alone.",
        "The nest, not the ant, found the shortest line.",
      ],
    },
    {
      lines: [
        "An ant is close to half a centimetre long.",
        "Set that against a child of one and a third metres.",
        "The child is more than a hundred ant lengths tall.",
        "A trail of ten metres is more than a thousand ant lengths.",
        "For the child, that is a run of more than one kilometre.",
        "Ten times its mass: that is the load one ant can lift.",
        "A child that could do the same could lift more than three adults.",
        "One nest can hold more than a million ants.",
        "Most nests hold far less: some thousands of ants, or some hundreds.",
        "Ants are ancient, and the oldest ant fossils are much older than us.",
        "Those fossils are close to a hundred million summers old.",
        "The nest is older than the single ant in it.",
      ],
    },
    {
      lines: [
        "One ant alone finds almost nothing.",
        "It cannot hold a chart of the ground in its head.",
        "It reads the scent, the sun, and the touch of its antennae.",
        "That is the limit, and it is also the trick.",
        "A trail that no ant refreshes fades and is gone.",
        "So a trail to food that is finished dies out.",
        "The nest does not hold on to a route that lost its sugar.",
        "Do the test at home: set one grain of sugar on a flat stone.",
        "Then sit still and look at the stone each ten minutes.",
        "The first ant comes alone, and it comes late.",
        "The tenth ant does not search at all: it runs a line.",
        "That line is a fact, and no single ant holds it.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=22 (+ b + w) - der volle T2-Satz. Erst hier gibt es with,
// what, when, how, we, was, will, but, back, about, water und
// wooden. Gesperrt bleiben v p y x: kein have (has und had gehen),
// kein up, kein keep, kein help, kein you, kein they, kein next.
// ---------------------------------------------------------------------------
const THE_WOODEN_WHISTLE: Serie = {
  slug: "en-the-wooden-whistle",
  titel: "The Wooden Whistle",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The garden wall along the road is older than the house.",
        "In the last hot week its mortar crumbled and fell.",
        "Ida finds a hollow behind a loose stone.",
        "Inside the hollow there is a rag, and the rag is hard.",
        "She unrolls it on the grass.",
        "It holds a wooden whistle, dark and short.",
        "The wood is smooth, and it has three notches.",
        "Ida blows it.",
        "It makes almost no sound at all.",
        "It makes a thin air-sound, and that is all it makes.",
        "She blows it a second time, harder.",
        "Then, from four fields off, a dog starts to bark.",
      ],
    },
    {
      lines: [
        "The bark comes closer, and it comes fast.",
        "It is Cass, the collie from the farm on the hill.",
        "Cass is old and half deaf, and she comes at a run.",
        "She sits at the gate and looks at the whistle.",
        "Ida holds it out, and Cass leans her head against it.",
        "Cass will not go home.",
        "The farmer comes down the lane and calls her.",
        "Cass turns her head, but she does not stand.",
        "Where did that whistle come from, the farmer asks.",
        "From the wall, Ida tells him.",
        "The farmer holds it and turns it and is silent.",
        "Then he tells her: the man that cut this whistle worked these fields.",
      ],
    },
    {
      lines: [
        "The man was called Tomas, and he had the farm before them.",
        "He cut a whistle for each dog he worked with.",
        "The notches count the collies: three notches, the third collie.",
        "Cass comes from that third collie, the farmer tells her.",
        "The sound sits far too high for a human ear.",
        "A dog hears it, and a child hears almost nothing.",
        "The farmer hands it back to Ida.",
        "Hold on to it, he tells her, and blow it if the fog comes down.",
        "In late autumn the fog comes down on the hill.",
        "It comes down thick, and the lane and the wall are gone.",
        "The farmer knocks on the door at dusk.",
        "Cass is out in it, and she has been out four hours.",
      ],
    },
    {
      lines: [
        "Ida takes her coat and the wooden whistle.",
        "The fog is cold, and it holds all sound down.",
        "She walks the lane as far as the gate and no farther.",
        "Then she stands still and blows the whistle.",
        "There is a thin air-sound, and then there is nothing.",
        "She blows it, counts to ten, and blows it again.",
        "The fog holds, and the fields hold, and the hill holds.",
        "Then, far off and left of the wall, a bark.",
        "Ida blows at that bark, and the bark comes closer.",
        "Cass comes out of the fog wet and muddled and glad.",
        "The farmer lifts her, and she shakes the wet all across him.",
        "Ida holds the whistle in her fist all the walk home.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=25 (+ z v p) - fast das ganze Alphabet, es fehlen nur x y q.
// Genau die drei kosten hier am meisten: kein day, kein year, kein
// only, kein many, kein energy, kein oxygen, kein carbon dioxide,
// kein example. Ersatz: morning, summer, just, a lot of, sugar,
// the air we breathe out, for instance.
// ---------------------------------------------------------------------------
const FROM_SEED_TO_PLANT: Serie = {
  slug: "en-from-seed-to-plant",
  titel: "From Seed to Plant",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    ...EIGEN,
    fundstelle: "Keimung braucht Wasser, Sauerstoff und Waerme, Licht ist keine allgemeine Bedingung: NCBI Bookshelf, Developmental Biology, Kapitel Germination (ncbi.nlm.nih.gov/books/NBK9979) und byjus.com/biology/seed-germination. Radicula zuerst, dann Spross: dieselben beiden Stellen. Keimtemperaturen Gemuesesaat 18-32 Grad: cropscience.bayer.us/articles/bayer/factors-that-affect-soybean-germination-and-emergence und sili-seedlings.com/gardeningtips/how-to-master-seed-germination. Methuselah, Dattelpalme aus einem rund 2000 Jahre alten Samen aus Masada am Toten Meer, gekeimt 2005: science.org/content/article/ancient-palm-resurrected-2000-year-old-seed und nationalgeographic.com/science/article/150324-ancient-methuselah-date-palm-sprout-science. Geprueft am 21.08.2026.",
  },
  etappen: [
    {
      lines: [
        "A seed looks dead, and it is not.",
        "Inside its hard coat there is a whole little plant.",
        "It has a root end and a shoot end, and it is folded small.",
        "Around it, or beside it, sits a store of food.",
        "That store is starch, and starch is sugar in a tight form.",
        "The seed holds almost no water, and that is the trick.",
        "A thing that holds no water can rest for a long while.",
        "A seed on a shelf can rest a whole summer and stand it.",
        "Some seeds can rest for a hundred summers.",
        "The plant inside is alive all that while, and it works almost none.",
        "It breathes so little that the measure is almost nothing.",
        "It is waiting for three things, and water is the first.",
      ],
    },
    {
      lines: [
        "Set a bean seed on a damp cloth, and it starts to swell.",
        "It drinks in water, and the hard coat cracks.",
        "Water alone is not the whole matter.",
        "The seed also needs the air, since it must breathe.",
        "A seed held under water for a week drowns.",
        "The third thing is warmth: each sort of seed has its own range.",
        "Most garden seeds need soil at ten degrees and more, and a lot want more still.",
        "Light is not on that list, and that surprises most of us.",
        "Most seeds start in the dark, under the soil.",
        "The root comes out first, and it turns down.",
        "It turns down since the seed can feel which side is down.",
        "The shoot comes second, and it climbs to the other side.",
      ],
    },
    {
      lines: [
        "The shoot lifts the first two leaves out of the soil.",
        "In a bean those first leaves are the food store itself.",
        "The store thins as the shoot climbs, and then it falls off.",
        "After that the plant must feed itself, and it feeds on light.",
        "A leaf takes in the gas we breathe out and the water from the root.",
        "In the light it forms sugar out of those two.",
        "It hands the air back cleaner than it took it.",
        "That sugar is the whole harvest: wood, root, seed and fruit.",
        "A bean root can grow close to a centimetre in a morning.",
        "The stem can crack a crust of hard soil from beneath.",
        "So the list is short: water, air, warmth and light.",
        "That is a short list for a thing as great as a tree.",
      ],
    },
    {
      lines: [
        "There is a limit, and the limit is the store.",
        "A seed can start just once, since it has just one store.",
        "Set it too deep, and the shoot runs out of store before the light.",
        "Then it dies under the soil, and no hand can start it a second time.",
        "The garden rule: set a seed three times as deep as it is thick.",
        "Do the test at home: a jar, a damp cloth, three bean seeds.",
        "Set one at the glass, so the root and the shoot are in sight.",
        "Look at it each morning and mark the glass at the root end.",
        "In a week the marks tell a straight tale of the growth.",
        "The oldest seed that a hand has started was a date seed.",
        "It sat in the dust of a fort at the Dead Sea for close to two thousand summers.",
        "It is a date palm now, and it is called Methuselah.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=15, teens. Die haerteste Sprosse der Charge: kein not, kein
// no, kein cannot - eine Verneinung ist hier UNMOEGLICH, erzaehlt
// wird darum nur, was IST. Kein door, kein latch, kein gate (o c
// g), kein table, kein can, kein alone, kein key.
// ---------------------------------------------------------------------------
const THE_THIRD_STAIR: Serie = {
  slug: "en-the-third-stair",
  titel: "The Third Stair",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The third stair in the hall rattles as Elif treads it.",
        "Elif has held that rail all her life.",
        "It is late, and the hall lantern is dead.",
        "She treads the third stair harder than she intends.",
        "The tread tilts.",
        "Elif kneels and lifts the tilted slat.",
        "Inside the stair there is dead air and ash.",
        "In the ash there lies a red tin.",
        "It is flat, and it is as tall as her hand.",
        "A red thread seals the lid.",
        "Elif takes the tin and sets the slat as it lies.",
        "She stands there and hears her heart in her ears.",
      ],
    },
    {
      lines: [
        "In her flat, at the sink, Elif slits the thread.",
        "Inside there are thin sheets, and all are sealed.",
        "All are letters, and all state her stair and her flat.",
        "There are thirteen dates, and the first is the eldest.",
        "The seals are hard and dark and still held.",
        "Elif takes a thin steel file and slits the first seal.",
        "The seal lifts, and the sheet inside is as fresh as a sheet in the dark.",
        "The letters are all in a hand that Elif has seen at the hall.",
        "It is Halit, at the third flat.",
        "She reads three lines.",
        "Halit has a sister, Ilse, and all thirteen letters are hers.",
        "Then Elif finds her flat and her stair inside the third letter.",
      ],
    },
    {
      lines: [
        "The third letter is the letter Halit left the tenant that had her flat.",
        "The lines are thin and hard.",
        "Halit asks that tenant a thin, hard task.",
        "If he ends his lease here, the tenant hands Ilse the tin.",
        "The tenant has left, and the tin is still in the stair.",
        "Elif sets the thirteen sheets in a line and sits there.",
        "Then she seals the first as it had lain.",
        "A lifted seal stands lifted, and Elif is the hand that lifted it.",
        "The stair is there still, and it hides a tin as it had.",
        "Elif lifts the tin and treads the hall.",
        "She halts at the third flat.",
        "Then, inside the third flat, a seat slides.",
      ],
    },
    {
      lines: [
        "Halit stands aside, and Elif treads in.",
        "The flat is thin: a desk, a rail, a shelf.",
        "Elif sets the red tin and lets it stand there.",
        "Halit stares at it and he is still.",
        "Then he sits, and he lets his hands lie flat.",
        "Ilse sails the far east isles, he tells her.",
        "I sealed all thirteen, and I let the tin sit in the stair.",
        "Elif states it: the first seal is lifted.",
        "Halit lifts that sheet and reads it as if a still hand had sealed it.",
        "Then he lifts his head and asks her a hard, thin task.",
        "He asks if Elif sends Ilse the tin.",
        "Elif takes the tin, and she stands there still, and her hands are fists.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=18 (vor Charge O1: 17), teens. Das c bringt can, chance, cliff,
// chalk, decides, descends - und das u dazu until.
// (must haengt am m und kam auch damals erst spaeter.) Kein hour
// und kein minute (o m), darum misst diese Serie in treads und in
// thrice; kein cannot, kein signal, also kein Handy - genau das
// haelt den Einsatz bei den dreien.
// ---------------------------------------------------------------------------
const THE_CLIFF_TRAIL: Serie = {
  slug: "en-the-cliff-trail",
  titel: "The Cliff Trail",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 2,
  topic: "abenteuer",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The cliff trail cuts a thin line in the chalk face.",
        "It descends the face, and it lands at the strand.",
        "The lane is safer, and the lane is thrice as far.",
        "It is late, and the three take the cliff trail instead.",
        "Karin treads first, then Idris, then Dilan.",
        "The chalk is dust in the heat and slick in the rain.",
        "In the last hard rain it turns as slick as ice.",
        "The tide is due at the strand, and the strand is thin.",
        "Karin calls it: half the trail is left, and the tide is far still.",
        "Idris has the flask, and Dilan has the first aid tin.",
        "Then Karin treads a slate that is unset.",
        "The slate slides, and Karin slides after it.",
      ],
    },
    {
      lines: [
        "She lands hard, and a chalk shelf under the trail catches her.",
        "Idris kneels at the trail rail and calls her.",
        "Karin sits, and her hands are unhurt.",
        "Her left ankle is turned, and it is a still, sick hurt.",
        "She stands, and she halts, and she sits.",
        "The shelf lies a full tread under the trail.",
        "Dilan slides in at the shelf and lands at her side.",
        "Idris rests at the trail and lists it all in her head.",
        "The descent is thin and slick, and it ends at the strand.",
        "The ascent that ends at the crest is hard, and it is thrice as tall.",
        "The tide fills the strand at dusk, and it is dusk.",
        "The trail lies dark, and their hands are all there is.",
      ],
    },
    {
      lines: [
        "Idris is the fastest, and Idris is unhurt.",
        "She can take the crest and fetch adults.",
        "That ascent is a thin, tall hundred treads.",
        "As she fetches adults, the tide fills the strand.",
        "Karin states the fact: the strand is finished.",
        "The three can take the crest, all three, hurt ankle and all.",
        "That ascent is chalk and flint, and it needs all their hands.",
        "Dilan is silent, and then Dilan is clear.",
        "If Idris runs, the three are cut in half, and that is the true risk.",
        "Karin decides it: all three take the crest.",
        "Idris hands Dilan the flask and takes the left side.",
        "Karin stands, her ankle takes the first tread, and she is silent.",
      ],
    },
    {
      lines: [
        "The ascent is chalk stairs and flint, tread after tread.",
        "Dilan cuts a stick, and the stick sits fast in the chalk.",
        "Karin takes their shirts in her fists.",
        "Three treads, then rest, and then three further treads.",
        "The chalk cuts their hands.",
        "Half the ascent is dark, and all that half is silent.",
        "Then the trail line thins, and the crest is there.",
        "The crest is turf, and there is a fence at it.",
        "The three sit in the turf and rest and rest.",
        "Under the crest, the tide fills the strand.",
        "The shelf that had held Karin lies under the tide.",
        "Idris starts a fresh list in her head, and the first line is the lane.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Geschrieben fuer n=18 der ALTEN Folge (+ g), teens; seit Charge O1
// oeffnet die Serie bei n=19, weil das g dort steht. Endlich light,
// night, again, ridge, signal, straight - und die -ing-Form.
// WICHTIG: must haengt am m; bis dahin traegt can allein die
// Modalitaet. Gesperrt waren beim Schreiben m o b w: kein him, kein
// them, kein not, kein house, kein hour, kein with, kein what, kein
// but.
// ---------------------------------------------------------------------------
const THE_SIGNAL_ON_THE_RIDGE: Serie = {
  slug: "en-the-signal-on-the-ridge",
  titel: "The Signal on the Ridge",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "At the third night at the steading, Astrid sees the light.",
        "It is far east, at the ridge, and it is a single flash.",
        "Then it is dark, and then three further flashes.",
        "Astrid sits at the stair and reads the flashes.",
        "Three flashes, a rest, three flashes, a rest, then a light that lasts.",
        "The light that lasts stretches: she reaches eight, and it is lit still.",
        "Then the ridge is dark all night.",
        "In the last light she charts the ridge line.",
        "The ridge is a thin, hard hike: the lane, three gates, a field, a crest.",
        "Her aunt calls it a flicker in the ash trees and lets it rest at that.",
        "Astrid charts it again at the night after this, and it is identical.",
        "At the third night, she stands at the field gate, and she has a lantern.",
      ],
    },
    {
      lines: [
        "Astrid stands at the gate and lets the ridge flash first.",
        "Three, a rest, three, a rest, and the light that lasts.",
        "Then she lifts her lantern and flashes it: three, a rest, three.",
        "The ridge light halts.",
        "The dark lasts, and it lasts, and Astrid reaches thirteen.",
        "Then the ridge flashes fast: three, three, three.",
        "It flashes again, and the flashes are ragged.",
        "It is a hard light, and it is unsettled.",
        "Astrid stands there until the flashes end.",
        "Then the ridge is dark, and it stands dark all that night.",
        "The night after this, the ridge is dark again.",
        "Astrid decides it: she takes the ridge herself.",
      ],
    },
    {
      lines: [
        "Sedat is at the steading gate at dusk, and he is unasked.",
        "Astrid states the trail: the lane, three gates, a field, the crest.",
        "The hike is hard and still, and the grass stands knee tall.",
        "Sedat has the flask, and Astrid has the lantern.",
        "The last gate is chained, and the chain is stiff and rusted.",
        "At the crest the ridge is flat, and there is a light.",
        "It is a shed, and the light in it is a lantern.",
        "The lantern lifts, and a hand shields it, and it flashes.",
        "The flashes are as at the gate: three, a rest, three, a rest.",
        "Astrid treads in the grass, and the grass hisses.",
        "The lantern halts, and the shed is silent.",
        "Then the lantern turns, and Astrid is standing in its light.",
      ],
    },
    {
      lines: [
        "The girl is Hanife, she is fifteen, and she is unafraid.",
        "The lantern is her lantern, and the flashes are her flashes.",
        "Hanife lets the light fall, and the three sit at the shed side.",
        "Her grandfather tends the herd at the far ridge end.",
        "His hearing has fled, and it fled in a single hard stretch.",
        "He sits there in the field hut all night, and he can still see.",
        "Three flashes, and it states: all is fine at the steading.",
        "The light that lasts states: this night is at its end.",
        "He flashes it all again, and that is her rest.",
        "Astrid asks the hard thing: the ragged flashes.",
        "Hanife tells it flat: he had seen a stranger light, and he had feared it.",
        "Astrid lifts the lantern and flashes three, and three, and a light that lasts.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=20, teens, Wissens-Serie. Erst das o macht Sachtexte moeglich
// (of, to, not, no, nothing). Die Zahlwoerter sind die eigentliche
// Huerde: two (w), five und seven (v), six (x), sixty und forty
// (y) fehlen alle - darum rechnet diese Serie in three, four,
// eight, eighteen, ten, hundred, thousand, million und in
// Lichtminuten statt in Kilometern.
// ---------------------------------------------------------------------------
const LIGHT_AND_THE_SECOND: Serie = {
  slug: "en-light-and-the-second",
  titel: "Light and the Second",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["teens"],
  minTier: 2,
  topic: "weltall",
  herkunft: {
    ...EIGEN,
    fundstelle: "Lichtgeschwindigkeit 299 792 458 m/s (exakt, SI-Definition): en.wikipedia.org/wiki/Speed_of_light und bipm.org/en/measurement-units/si-defining-constants. Mittlere Mondentfernung 384 400 km, Laufzeit 1,28 s: nasa.gov/moon (Moon Fact Sheet, nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html) und en.wikipedia.org/wiki/Lunar_distance. Sonnenlicht 8 min 20 s (1 AE = 499 Lichtsekunden): nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html und en.wikipedia.org/wiki/Astronomical_unit. Signallaufzeit zum Mars 3 bis 22 Minuten je Richtung: mars.nasa.gov/msl/timeline/communications und en.wikipedia.org/wiki/Mars. Licht in Glasfaser rund ein Drittel langsamer (rund 200 000 km/s): en.wikipedia.org/wiki/Optical_fiber und en.wikipedia.org/wiki/Refractive_index. Geprueft am 21.08.2026.",
  },
  etappen: [
    {
      lines: [
        "Light runs close to three hundred thousand kilometres in one second.",
        "It runs the same in all directions, and it runs at that rate for all of us.",
        "The rate has a letter all to itself: c.",
        "Nothing that holds a fact runs faster.",
        "In one second, light rounds the earth close to eight times.",
        "In a thousandth of a second, it runs three hundred kilometres.",
        "That is a fact, and it is also a limit.",
        "The rate is a constant in the dark of the cosmos.",
        "In one hour, light runs close to a thousand million kilometres.",
        "In one minute, it runs close to eighteen million kilometres.",
        "Those are the units that fit the cosmos: light second, light minute.",
        "The distance to the Moon is close to four hundred thousand kilometres.",
      ],
    },
    {
      lines: [
        "So the light of the Moon lands here in more than one second.",
        "It lands in less than one second and a half.",
        "The Sun sits far further off: eight light minutes and a third.",
        "The sunlight on this sheet left the Sun eight minutes ago.",
        "If the Sun died at this instant, the fact reaches us eight minutes late.",
        "Mars sits nearer at times and much further at others.",
        "At the nearest, the light from Mars reaches us in three minutes.",
        "At the farthest, it takes more than a third of an hour.",
        "A machine on Mars takes a call and returns it.",
        "The call runs there, and the return runs the same trail home.",
        "So a call and its return take more than four minutes at the nearest.",
        "That is the reason a machine on Mars has to act alone.",
      ],
    },
    {
      lines: [
        "Redo the sums, and the totals hold.",
        "Take the rate: three hundred thousand kilometres in one second.",
        "Take the distance to the Moon: four hundred thousand kilometres.",
        "Four hundred thousand shared out in units of three hundred thousand.",
        "That is one, and a third of one is left.",
        "So the light of the Moon needs one second and a third.",
        "Take the light minute: close to eighteen million kilometres.",
        "Take the Sun at eight light minutes: eight times eighteen million.",
        "That is more than a hundred million kilometres, and that is the distance.",
        "No one held this rate at first: most held that light lands at once.",
        "It took a clock, a distant thing and a lot of care to see it does not.",
        "The rate is far too great for a hand clock and a lane.",
      ],
    },
    {
      lines: [
        "In glass, light lags: it runs close to a third less fast than in the dark.",
        "A fine glass thread holds a call across the sea.",
        "Half a round of the earth is more than eighteen thousand kilometres.",
        "In glass, that call needs close to a tenth of a second.",
        "That tenth sits in each such call, and no machine can trim it.",
        "It is the reason a distant call has a hitch in it.",
        "No fact and no order can outrun the light.",
        "So there is no such thing as at once, if the distance is great.",
        "The light of the far stars is ancient: it left them long ago.",
        "In the dark of the cosmos no one sees the star, just its light.",
        "That light left, and then it ran, and it ran at that one rate.",
        "The distance is the lag, and the lag is the rule.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=22, teens - der volle T2-Satz. Jetzt gibt es but, with, what,
// when, who, how, was, were, about, back, work, weekend. Gesperrt
// bleiben v p y x: kein have, kein help, kein keep, kein up, kein
// police, kein you - der Dialog laeuft darum ueber Namen und
// berichtete Rede.
// ---------------------------------------------------------------------------
const THE_WALLET_IN_THE_LONG_GRASS: Serie = {
  slug: "en-the-wallet-in-the-long-grass",
  titel: "The Wallet in the Long Grass",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ruth works the bike stand at the market all weekend.",
        "Her father mends bikes, the stand is his, and the hours are hers.",
        "She wants one thing: a hind wheel that runs true.",
        "That wheel costs close to two hundred, and she has close to nothing.",
        "On the last afternoon she rides the canal lane home.",
        "The reeds are high, and the lock gates are shut.",
        "In the long grass at the lock there is a dark thing.",
        "It is a wallet, and it is fat, and it has not been in the water.",
        "Ruth stands there with it for a full minute.",
        "There is no one on the lane and no one at the lock.",
        "She counts the notes: it is close to three hundred.",
        "That is a hind wheel, and a chain, and there is still cash left.",
      ],
    },
    {
      lines: [
        "She rides home with the wallet inside her coat.",
        "She does not tell her father.",
        "In her room she sets it all out on the sheet.",
        "Notes, coins, a bus card, a folded ticket, an old mend list.",
        "The card holds a name: Alan Hodkin.",
        "The mend list is a fish stall list, and she knows that hand.",
        "Hodkin has the stall two stands down from the bike stand.",
        "He is the man that told her she counts the change too slow.",
        "He told it loud, the market heard it, and Ruth went red.",
        "She sits and looks at the cash and does not touch it.",
        "The wheel is close to two hundred, and the cash is three.",
        "No one saw the lock, no one saw the grass, and no one saw her.",
      ],
    },
    {
      lines: [
        "The night is long.",
        "At three she is still awake, and the wallet is still on the sheet.",
        "She works out what she could tell: it was in the water, in the reeds.",
        "All of that is true, and none of it is honest.",
        "In the first light she looks at the folded ticket.",
        "It is a clinic ticket, and the date on it is the third.",
        "So Hodkin has a bus card, three hundred in notes and a clinic ticket.",
        "Ruth thinks about the bus card the longest.",
        "A man that rides the bus does not hold three hundred without a reason.",
        "She stands, and she washes, and she takes the wallet.",
        "The address on the card is at the far end of the canal, at Cross Lane.",
        "It is close to four kilometres, and she walks all of it.",
      ],
    },
    {
      lines: [
        "Cross Lane is a short lane with tall thin houses.",
        "The door has no bell, and she knocks with the flat of her hand.",
        "Hodkin comes to the door in a shirt with no collar.",
        "He looks at her, then at the wallet, and he stands still.",
        "In the long grass at the lock, Ruth tells him.",
        "He takes it and he counts the notes at the door.",
        "He counts them twice.",
        "Then he asks how much she took.",
        "Nothing, she tells him.",
        "He counts them a third time, and he does not answer that.",
        "Then he shuts the door.",
        "Ruth walks the four kilometres back and counts the change slow and right.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=24 (+ z + v), teens. Das v bringt river, have, five, seven,
// twelve, never, over, leave; das z bringt size, dozen, horizon.
// Gesperrt bleiben p x y q: kein up, kein people, kein deep, kein
// example, kein day, kein year, kein many, kein only, kein city -
// aber cities geht, und Zeit misst diese Serie in months und in
// hours.
// ---------------------------------------------------------------------------
const THE_RIVER_AND_THE_SEA: Serie = {
  slug: "en-the-river-and-the-sea",
  titel: "The River and the Sea",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    ...EIGEN,
    fundstelle: "Amazonas-Abfluss rund 209 000 m3/s, mehr als die naechsten sieben Fluesse zusammen: usgs.gov/publications/reconnaissance-investigations-discharge-and-water-quality-amazon-river und en.aguasamazonicas.org/waters/flow-floods. Sedimentfracht rund 1,2 Milliarden Tonnen in zwoelf Monaten (gemessen bei Obidos): en.aguasamazonicas.org/waters/flow-floods/sediments-amazon und en.wikipedia.org/wiki/Amazon_River. Transportarten (Schwebfracht, Geschiebe) und die Rolle der Hochwaesser: en.wikipedia.org/wiki/Sediment_transport und en.wikipedia.org/wiki/Hjulstr%C3%B6m_curve. Nildelta-Erosion nach dem Assuan-Staudamm, rund 98 Prozent des Sediments zurueckgehalten: courses.ems.psu.edu/earth111/node/887 und sciencedirect.com/science/article/abs/pii/0025322796000199. Geprueft am 21.08.2026.",
  },
  etappen: [
    {
      lines: [
        "A river holds more than water.",
        "It holds the hills it came from, ground down and held under the surface.",
        "Lift a glass of river water in the flood and let it stand an hour.",
        "There is a finger of mud at the base of the glass.",
        "That mud was a hill, and it is on its road to the sea.",
        "Rivers are the machine that takes the land to the ocean.",
        "The rate is slow, and the total is immense.",
        "Once at the mouth, the current dies and the load falls out.",
        "It falls as sand first, then as silt, then as the finest mud.",
        "That fall is a delta, and a delta is land the river set down.",
        "Venice and Dhaka stand on such land.",
        "The ground under those cities came down a river.",
      ],
    },
    {
      lines: [
        "Take the Amazon, since it is the greatest of the rivers.",
        "It sends close to two hundred thousand cubic metres to the ocean each second.",
        "That is more than the four rivers behind it, all added.",
        "In that water there is silt, and the silt has been measured.",
        "It is close to a thousand million tonnes in twelve months.",
        "Share that out: it is close to a hundred million tonnes in one month.",
        "Share it further: it is more than three million tonnes in a full round of the clock.",
        "In one hour, it is more than a hundred thousand tonnes.",
        "Share it one last time: it is more than two dozen tonnes each second.",
        "It sends that load in the night as well, and it sends it in the drought.",
        "And the Amazon is one river of thousands.",
        "The totals come from gauges in the water, measured month after month.",
      ],
    },
    {
      lines: [
        "A river moves its load in three manners.",
        "The finest mud rides in the water itself and settles almost never.",
        "Sand hangs in the current and settles the instant the current slows.",
        "Stones roll and bounce along the bed and never leave it.",
        "Which of the three a grain does is a matter of the current.",
        "As the current climbs, the size of grain it can lift climbs much faster.",
        "So a river does most of its work in flood, and a flood is short.",
        "In a still month the river runs almost clear.",
        "In one flood week it can move more than in the ten months before it.",
        "That is the reason a river bed is scoured out after a flood.",
        "It is also the reason the fields at a river are the richest fields there are.",
        "The flood takes the hill, and the flood hands it to the field.",
      ],
    },
    {
      lines: [
        "There is a limit, and it is a hard one: a dam.",
        "A dam is a still lake, and in a still lake the load falls out.",
        "The silt settles behind the wall, and the river runs clear beneath it.",
        "Clear water cuts: it takes its load from the bed under the dam.",
        "And the delta at the mouth ceases to grow.",
        "The Nile delta has been shrinking since the dam at Aswan.",
        "The sea takes the shore back, since no fresh silt arrives.",
        "The reservoir itself fills in, and that is the other end of the same fact.",
        "A reservoir has a life, and its life ends in mud.",
        "These totals are measures, and a measure is an estimate with a limit.",
        "The silt total is a mean over the months, and each flood breaks the mean.",
        "Redo the sum in the other direction: an hour, a month, a river, an ocean floor.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=29 (+ x + y), teens, fuenf Etappen. Erst hier gibt es you,
// they, day, year, very, many, only - und damit einen Dialog, der
// klingt. Gesperrt ist allein das q: kein question (asks), kein
// quiet (still), kein quick (fast).
// ---------------------------------------------------------------------------
const BEHIND_THE_SPORTS_HALL: Serie = {
  slug: "en-behind-the-sports-hall",
  titel: "Behind the Sports Hall",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The skip behind the sports hall is emptied on a Thursday.",
        "Priya knows that, because her bike shed stands beside it.",
        "On the Tuesday she is late, and she cuts across the yard.",
        "Denner is there with the blue crates from the science block.",
        "The blue crates are for paper, and the sign on the gate says so.",
        "Denner lifts the first crate over the lip of the skip.",
        "The paper goes in on top of the black bags.",
        "Then the second crate, and then the glass one.",
        "Priya stands at the corner of the wall and does not move.",
        "Denner stacks the empty crates and wheels them back.",
        "The lid of the skip comes down with a flat bang.",
        "The gate sign says: this school sorts all of its waste.",
      ],
    },
    {
      lines: [
        "On the Wednesday she is early, and she waits at the bike shed.",
        "At ten past eight Denner comes out with the crates.",
        "Paper into the skip, glass in after it.",
        "She counts six crates in four minutes.",
        "On the Thursday the lorry comes and takes the whole skip.",
        "She stands at the fence and reads the name on the side of the lorry.",
        "It is a general waste firm, and there is one word on the tailgate.",
        "Priya takes a photo of the crates and a photo of the lorry.",
        "The photos sit on her phone, and she looks at them all evening.",
        "Her older brother tells her to leave it alone.",
        "Denner covered for her in October, when she broke the fire door.",
        "He told the head it was the wind, and the head believed him.",
      ],
    },
    {
      lines: [
        "On the Friday she goes to the boiler room and knocks.",
        "Denner is eating a sandwich and reading the racing page.",
        "She puts her phone on the table with the photo on the screen.",
        "He looks at it for a long while, and he does not deny it.",
        "Then he tells her to sit down.",
        "The council ended the paper round in the spring, he says.",
        "There is no separate lorry now, and there has been none since March.",
        "He told the office twice, and he got one answer: keep the crates out.",
        "The crates are for the visitors and for the sign on the gate.",
        "Priya asks who told him that.",
        "Denner folds his paper and says a name she knows very well.",
        "It is the name at the end of the speech in her bag.",
      ],
    },
    {
      lines: [
        "On the Monday she is on the stage list for the assembly.",
        "The speech is one page, and it is written for her.",
        "Our school sorts all of its waste, line four.",
        "We are proud of our green pledge, line seven.",
        "Mrs Achebe wrote it and asked her to read it as it stands.",
        "Priya reads it out in the corridor, and it makes her ears hot.",
        "If she reads it, the sign stays on the gate and Denner keeps his job.",
        "If she says what she saw, the first name in it is his.",
        "She sits in the library until the bell and writes nothing.",
        "Then she goes back to the boiler room and asks him straight out.",
        "Denner looks at the wall for a while, and then he shrugs.",
        "Read the true thing, he tells her, and leave my name out of it.",
      ],
    },
    {
      lines: [
        "The hall smells of floor polish and wet coats.",
        "Priya reads the page as it is written, down to the last line.",
        "Then she folds it and sets it on the lectern.",
        "One more thing, she says, and the hall goes still.",
        "The paper from the blue crates has gone to landfill since March.",
        "It goes into the skip behind the sports hall on a Tuesday morning.",
        "The lorry takes the skip on a Thursday.",
        "Nobody in this hall did that on purpose, she says, and it is still true.",
        "She walks off the stage, and the hall is silent for four seconds.",
        "Mrs Achebe is waiting at the side door with her arms folded.",
        "In the third week of term the council lorry comes back on a Wednesday.",
        "Denner leaves the crates by the fence, and Priya counts them from the shed.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=18 (vor Charge O1: 17), erwachsen. Geschrieben ohne o, also
// ohne of - der Genitiv laeuft darum ueber zusammengesetzte Nomen
// (silt sacks, cellar stair, estate head). Kein hour, kein minute (o m): gemessen wird in
// shifts, in inches und in feet. Kein reason, kein because - der
// Grund steht als eigener Satz da.
// ---------------------------------------------------------------------------
const THE_FALL_IN_THE_DRAIN: Serie = {
  slug: "en-the-fall-in-the-drain",
  titel: "The Fall in the Drain",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The cellar at Frisdale Stair fills after each hard rain.",
        "Rachid tends the drains at three estates, and this cellar is his third call.",
        "He has cleared this drain thrice, and it ran clear after each clearance.",
        "In the last clearance he lifted three silt sacks and a dead rat.",
        "The drain is a fine drain: hard tile, clean sides, set true.",
        "And still it fills.",
        "The tenants call the estate head, and the estate head calls Rachid.",
        "This call he lets the clearance rest and reads the drain instead.",
        "He fills a tall red tin at the sink and lets it run in the drain.",
        "The fill runs at first, and then it stalls.",
        "It stalls under the last tile stretch, and it stands there.",
        "A drain that stands is a drain that lacks its fall.",
      ],
    },
    {
      lines: [
        "Rachid lifts the third tile at the cellar hatch.",
        "It is set in sand, and the sand is fresh and unsettled.",
        "Under it there is a slate sheet, laid flat in the trench.",
        "The slate is unset, and its heft lands in the drain itself.",
        "It has rested there since the last fitter, and that fitter had left it.",
        "The drain under that slate has settled an inch.",
        "The run needs a fall: an inch in each three feet.",
        "Under that slate the run has a rise, and a rise is the fault.",
        "The silt settles at the rise and it stands there.",
        "Each clearance takes the silt and lets the rise stand.",
        "Rachid sits at the cellar stair and lists the true cure.",
        "It is a hard list.",
      ],
    },
    {
      lines: [
        "The tiles all lift, the trench is cut, and the run is set fresh.",
        "It takes three hands and three full shifts.",
        "The cash is thrice the clearance cash.",
        "Rachid sends the estate head a letter and states it all.",
        "The estate head calls in the shift after this.",
        "He has a thinner cure: clear the drain in each hard rain.",
        "That is less cash, he tells Rachid, and the tenants shall stand it.",
        "Rachid states it flat: the fill lands in the cellar.",
        "The cellar stair is the stair that all tenants tread.",
        "The tenant in the third flat is an elder, and this is her stair.",
        "She has fallen there, in the last fill, in the dark.",
        "The estate head is silent, and then the call ends.",
      ],
    },
    {
      lines: [
        "Rachid drafts a thin, hard letter and sends it.",
        "It lists the fall, the slate, the rise and that last fall.",
        "It lists the risk in the hard rain that is due.",
        "It ends at a date and a fee.",
        "The estate head calls it a threat.",
        "Rachid calls it a fact and lets the letter stand.",
        "In the third dusk after that, the rain lands.",
        "It is a hard rain, and the street stands full.",
        "Rachid treads the cellar stair at that dusk, unasked.",
        "The fill is at his heels, and it stands at the third tread.",
        "The estate head is there, in his fine shirt, at the cellar stair.",
        "Cut the trench, he tells Rachid, and Rachid lifts the first tile.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=20 (vor Charge O1: 19), erwachsen. Jetzt gibt es minute,
// machine, time, night und must. Geschrieben ohne o b w: kein hour, kein week,
// kein count, kein slow, kein but, kein job - gezaehlt wird in
// nights und minutes, langsam heisst sluggish, und der Gegensatz
// laeuft ueber und still, statt ueber but.
// ---------------------------------------------------------------------------
const THE_LEFT_HAND: Serie = {
  slug: "en-the-left-hand",
  titel: "The Left Hand",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The ice at the shed stair is thin, clear and hard as a tile.",
        "Marta lands hard, and it is her right hand that takes it.",
        "The clinic sets it in a cast and states the length: fifteen nights.",
        "Marta runs the intake desk at a small haulage firm.",
        "Each shift, thirteen lists reach her desk, and she sets them clean.",
        "The lists are hand-set: dates, freight, distances, initials.",
        "The chief takes them at the third minute after each shift starts.",
        "In the first shift under a cast, Marta sets three lists.",
        "Three, and the third is a mess.",
        "Her left hand has held a knife and a mug, and little else.",
        "The letters it sets drift and lean.",
        "The chief reads the third list and sets it aside.",
      ],
    },
    {
      lines: [
        "In the shift after this, the chief sets Nils at her desk.",
        "Nils is nineteen, and his hands are fast.",
        "He takes the intake lists, and Marta takes the calls.",
        "That is a fair share, and it stings.",
        "Marta sits at the calls and hears her lists getting set.",
        "In the third shift she tries her left hand at a single line.",
        "It takes a full minute, and the line is unclean.",
        "Nils sets thirteen lines in that same minute.",
        "Marta files that fact and lets it sit.",
        "At her flat that night she clears the kitchen desk.",
        "She sets a fresh sheet, a hard lead, and a timer at her left.",
        "Then she starts at the letters, and the first letter is a.",
      ],
    },
    {
      lines: [
        "The first three nights are a mess.",
        "Her left hand is unlike a hand at all: it is a stick.",
        "The ache sits in the fingers, and it is real.",
        "She starts a chart in the kitchen: nights and minutes.",
        "In the first night, a single line takes a full minute.",
        "In the fifth night it takes half a minute.",
        "In the ninth night she sets three lines in a minute.",
        "The chart is a hard, thin trail, and it lifts.",
        "Marta learns a thing: untrained is unlike unfit.",
        "The chart is thirteen nights tall, and it fills the kitchen tile.",
        "At the fifteenth night the cast is cut at the clinic.",
        "The hand under it is thin, chalk-fair, and it is stiff.",
      ],
    },
    {
      lines: [
        "Her right hand is slack, and it strains at each single line.",
        "In the first shift after the cast, she sets three lists and rests.",
        "In the third shift she sets thirteen.",
        "The chief needs Nils in the trailer sheds, and the desk is hers again.",
        "Marta sits at the intake desk in the still first minutes each shift.",
        "She sets a clean sheet and lifts the hard lead.",
        "Then she sets the lead in her left hand and starts a freight sheet.",
        "It is sluggish at the letters still.",
        "At the fine straight lines the left hand is steadier than the right.",
        "Marta lets her left hand set all the freight lines after that.",
        "The chart in the kitchen hangs there still.",
        "It ends at the fifteenth night, and Marta sets a fresh line under it.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=20, erwachsen, Wissens-Serie. Der erste Entwurf an dieser
// Sprosse war eine Serie ueber Schall im Meer - sie ist an einem
// einzigen Wort gescheitert: down haengt am w und kommt erst mit
// 22 (ebenso water, work, how, with). Kaese kommt ohne down aus.
// Auch hier fehlen b w v p x y: kein bacteria (cultures), kein
// whey (the thin milk), kein press (a stone as a load), kein
// protein (casein), kein dairy, kein day, kein year.
// ---------------------------------------------------------------------------
const CHEESE_AND_MONTHS: Serie = {
  slug: "en-cheese-and-months",
  titel: "Cheese and Months",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: {
    ...EIGEN,
    fundstelle: "Milchtrockenmasse rund 12 bis 13 Prozent und Kaeseausbeute rund 10 Prozent (rund 10 Liter Milch je Kilogramm Hartkaese): en.wikipedia.org/wiki/Cheese und milkfacts.info/Milk%20Composition/Milk%20Composition%20Page.htm. Lab und Chymosin, Gerinnung bei Koerperwaerme in rund einer halben Stunde: en.wikipedia.org/wiki/Rennet und britannica.com/topic/cheese. Bruchkorngroesse und Wassergehalt (fein geschnitten gleich hart, grob geschnitten gleich weich), Salzen und Rindenbildung, Reifung: britannica.com/topic/cheese und en.wikipedia.org/wiki/Cheese_ripening. Laibgewicht eines Alpen-Hartkaeses rund 75 bis 100 kg: en.wikipedia.org/wiki/Emmental_cheese und en.wikipedia.org/wiki/Gruy%C3%A8re_cheese. Geprueft am 21.08.2026.",
  },
  etappen: [
    {
      lines: [
        "Milk is food that lasts a matter of hours.",
        "In a hot room it turns in less than one round of the clock.",
        "Cheese is that same food, and it lasts months and, at its hardest, seasons.",
        "That is the sense of all of it: milk is a flood, and cheese is a store.",
        "A cattle herd is milked each morning and each dusk.",
        "It comes in at a rate that no market can take at once.",
        "So the milk is set as cheese, and the cheese sits in a cellar.",
        "In the last hard cold at the season, that cellar is the meal.",
        "Cheese is milk that has lost its thin milk.",
        "In a hundred litres of cattle milk, close to ten kilograms is solid.",
        "The rest is the thin milk, and it runs off.",
        "Take the thin milk out and hold the solid: that is all a cheese is.",
      ],
    },
    {
      lines: [
        "The maker sets the milk at the heat of a hand.",
        "Then he adds a culture, and a culture is the tiniest life there is.",
        "That life eats the milk sugar and lets an acid out.",
        "The acid is the first hand at the cheese, and the milk starts to shift.",
        "Then the maker adds rennet, and the rennet is the second hand.",
        "Rennet holds a thing that ties the milk solid in one mass.",
        "In half an hour the milk stands as a curd, and a hand can cut it.",
        "The cut is the trick: fine cuts let more of the thin milk out.",
        "Fine cuts, hard cheese; coarse cuts, soft cheese.",
        "The curd is set in a mould, and a stone is set on it as a load.",
        "The load takes out the last thin milk, and the curd knits as one mass.",
        "Then it is salted, since salt guards the rind and slacks the culture.",
      ],
    },
    {
      lines: [
        "Redo the sums at the cheese hall, since the sums are the craft.",
        "One cattle milking is close to ten litres.",
        "Ten litres of milk makes close to one kilogram of hard cheese.",
        "So one milking is one kilogram, and one kilogram is a small hard cheese.",
        "A great mountain cheese can hold close to a hundred kilograms.",
        "That is a thousand litres of milk, standing on a cellar shelf.",
        "A herd of a hundred cattle fills that cheese in one morning.",
        "The cheese then sits, and the sitting is the other half of the craft.",
        "In the first months it loses moisture, and it loses mass.",
        "A cheese of a hundred kilograms can lose close to a tenth in a season.",
        "The rind hardens, and the rind is the cheese guarding itself.",
        "The taste at the last is in the culture, the milk and the months.",
      ],
    },
    {
      lines: [
        "There is a limit in all of it, and the limit is the cellar.",
        "It must hold one heat and one moisture, and it must hold them for months.",
        "Too hot, and the cheese runs and cracks.",
        "Too cold, and the culture halts and the taste comes out thin.",
        "In dead air the rind hardens too fast, and the inside is left unset.",
        "In moist air the mould takes the rind, and the maker must clean it.",
        "So the maker turns each cheese and cleans each rind, all season long.",
        "That is the reason the hardest cheeses cost as much as their months.",
        "A cheese of four seasons is a cellar shelf held for four seasons.",
        "The craft is ancient, and it is the same craft in a hut and in a great hall.",
        "Milk, culture, rennet, salt and months: there is nothing further in it.",
        "Test that at the counter: read the mark and count the months.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=22, erwachsen - der volle T2-Satz, aber ohne v p x y. Also
// kein have, kein price, kein problem, kein people - und keinen
// einzigen Wochentag: Monday, Tuesday, Thursday tragen alle ein y.
// Datiert wird darum in weeks, in fortnights und in March.
// ---------------------------------------------------------------------------
const THE_WALL_BETWEEN_TWO_GARDENS: Serie = {
  slug: "en-the-wall-between-two-gardens",
  titel: "The Wall Between Two Gardens",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The wall between the two gardens is older than either house.",
        "It is one brick thick, and it stands as tall as a man.",
        "Doris has had the north garden since she and her husband took the house.",
        "Frank has had the south garden for four winters.",
        "In the second of those winters the wall started to lean.",
        "It leans north, into the garden that is hers.",
        "In the last hard frost it leant a full hand further.",
        "Doris marks the lean with a chalk line on the shed and a date.",
        "The ash tree stands three metres south of the wall, in his garden.",
        "Its roots run under the footing, and one has lifted a course of brick.",
        "Doris knocks and asks about the ash tree.",
        "Frank tells her that his wife set that tree in the ground.",
      ],
    },
    {
      lines: [
        "The deed calls it a shared wall: half his, half hers.",
        "A shared wall is a shared cost, and the cost comes in at two thousand four hundred.",
        "The builder wants the ash tree down and a new footing in concrete.",
        "Doris signs the estimate and sends Frank a note.",
        "Frank sends back a note of his own: a tie bar, and no tree work.",
        "A tie bar is a steel rod and two flat ends, and it costs three hundred.",
        "It will hold the wall as it stands, and it will hold it leaning.",
        "Doris writes back that a tie bar holds the fault, not the wall.",
        "Frank writes that this wall has stood a hundred winters and can stand this out.",
        "The notes come one a week, and then one a fortnight.",
        "In March the notes come from a solicitor instead.",
        "The lean at the chalk mark is a hand and a half.",
      ],
    },
    {
      lines: [
        "The solicitor letters cost more than the tie bar inside one month.",
        "Doris works that out at her kitchen table and does not laugh.",
        "Frank works out the same thing at the same hour, on the other side of the wall.",
        "Neither of them will write it down.",
        "In the third week of March there is a gale in off the sea.",
        "It comes in at the north, and it comes in all night.",
        "At close on four in the morning Doris hears the sound of it.",
        "It is not a crash: it is a long, low slide and then a thud.",
        "The wall has come down across her shed, and the shed roof is in.",
        "Frank is at the gate in a coat and no shoes.",
        "The two of them stand in the wet and look at four hundred bricks.",
        "The ash tree stands where it stood, and it has lost one arm.",
      ],
    },
    {
      lines: [
        "The mason comes at the start of the week and reads the footing.",
        "There was no footing at all: the wall sat on the bare earth.",
        "The roots did not lift it, he tells them, the roots held it in.",
        "Doris and Frank hear that standing in the same wet garden.",
        "The new wall needs a trench, and the trench needs the arm of the ash.",
        "Frank agrees to the arm and to a crown reduction, and to nothing more.",
        "The mason takes the crown out at a third and lets the tree stand.",
        "The trench is cut in the first week, and the concrete goes in at its end.",
        "The two of them clean the old bricks after work and stack them in the shed.",
        "It is dull work, and it is done with almost no talk at all.",
        "In the second week of the build, Frank brings out two mugs of tea.",
        "The new wall is one brick thick, and it stands as tall as a man.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=25, erwachsen, Wissens-Serie. Diese Serie stand zuerst bei
// n=20 im Entwurf und musste zwei Sprossen hoeher: down, water und
// how haengen am w (22), deep, depth und pressure am p (25). Erst
// hier traegt das Thema. Gesperrt bleiben x y q: kein day, kein
// year, kein only, kein exactly, kein forty und kein fifty - die
// Zahlen dieser Serie sind darum three, four, fifteen, hundred,
// thousand.
// ---------------------------------------------------------------------------
const SOUND_UNDER_THE_SEA: Serie = {
  slug: "en-sound-under-the-sea",
  titel: "Sound Under the Sea",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    ...EIGEN,
    fundstelle: "Schallgeschwindigkeit in Meerwasser rund 1500 m/s, in Luft rund 340 m/s: dosits.org/science/movement/sound-speed und britannica.com/science/SOFAR-channel. Echolotung und Halbierung der Laufzeit: en.wikipedia.org/wiki/Echo_sounding und noaa.gov (oceanservice.noaa.gov/facts/sonar.html). Tiefster Punkt Challenger Deep 10 935 m (Vermessung 2021): en.wikipedia.org/wiki/Challenger_Deep und britannica.com/place/Challenger-Deep. Lichtzonen: euphotisch bis 200 m, unterhalb 1000 m kein Sonnenlicht: oceanexplorer.noaa.gov/ocean-fact/light-distributed und whoi.edu/ocean-learning-hub/ocean-topics/how-the-ocean-works/ocean-zones. SOFAR-Kanal bei rund 1000 m Tiefe, Reichweite ueber Tausende Kilometer: britannica.com/science/SOFAR-channel und dosits.org/science/movement/sofar-channel. Geprueft am 21.08.2026.",
  },
  etappen: [
    {
      lines: [
        "Strike a stone under water, and the sound runs a long distance.",
        "In air, sound runs close to a third of a kilometre in one second.",
        "In sea water it runs close to one and a half thousand metres in one second.",
        "That is more than four times as fast.",
        "Sound is a shunt: one grain of the water nudges the one behind it.",
        "In air the grains sit far apart, and the shunt is slack.",
        "In water the grains sit close, and the shunt runs fast and clean.",
        "Light does the reverse: in air it runs, and in water it dies.",
        "At two hundred metres down, the sea is a dull green dusk.",
        "At one thousand metres down there is no sunlight left at all.",
        "So the deep sea is dark to a lens and loud to an ear.",
        "That is the reason the instruments that read the deep are ears.",
      ],
    },
    {
      lines: [
        "An echo sounder is a click and a clock.",
        "It sends one click straight down and it starts the clock.",
        "The click lands on the floor and comes home.",
        "The clock halts at the return.",
        "The click ran the depth down and the depth back.",
        "So the depth is that run, halved.",
        "A return at one second means a run of one and a half thousand metres.",
        "Halved, the floor sits at close to eight hundred metres down.",
        "The deepest floor in all the ocean lies close to eleven kilometres down.",
        "A click sent down there needs close to fifteen seconds to come home.",
        "Fifteen seconds is a long silence on a working deck.",
        "The first sounders drew that silence as a line on a paper roll.",
      ],
    },
    {
      lines: [
        "Redo the sums, since the sums are the instrument.",
        "The rate in sea water: one and a half thousand metres in one second.",
        "Take a return at four seconds.",
        "The click ran one and a half thousand metres, and it did that four times.",
        "Halve the run, since half of it is the descent.",
        "The floor sits three kilometres down.",
        "Take a return at fifteen seconds instead.",
        "Then the floor lies close to eleven kilometres down, and that is the deepest.",
        "In one minute the sound has run close to a hundred kilometres.",
        "In one hour it has run more than five thousand kilometres.",
        "In air, the same hour is close to one thousand two hundred kilometres.",
        "The clock is the whole instrument, and the rate is the whole assumption.",
      ],
    },
    {
      lines: [
        "There is a limit, and it sits in the rate itself.",
        "One and a half thousand is a mean, and it is not a constant.",
        "The rate climbs as the water gets warm, and it climbs as the salt rises.",
        "It climbs with depth as well, since the pressure down there is immense.",
        "So a sounder that holds to one rate is out at the last metres.",
        "Charts hold a correction for heat, salt and depth.",
        "There is one further thing: the rate dips and then climbs as it goes down.",
        "That dip is a channel, close to a kilometre under the surface.",
        "Sound is held in that channel as light is held in a glass thread.",
        "A sound set off in it can run for thousands of kilometres.",
        "Hulls, drills and sounders share that channel with the animals that call in it.",
        "So the last fact is this: the deep sea is dark, and it is not silent.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// n=29, erwachsen. Fast der ganze Zeichensatz - es fehlt allein
// das q, und das kostet in einem metrologischen Text mehr, als es
// aussieht: kein equal, kein square, kein require, kein frequency
// (Ersatz: the same as, needs, beats). Ziffern gibt es in Serien
// nie, also stehen alle Zahlen ausgeschrieben da.
// ---------------------------------------------------------------------------
const WHAT_A_KILOGRAM_IS: Serie = {
  slug: "en-what-a-kilogram-is",
  titel: "What a Kilogram Is",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: {
    ...EIGEN,
    fundstelle: "Internationaler Kilogramm-Prototyp, Zylinder aus 90 Prozent Platin und 10 Prozent Iridium, 1889 hinterlegt, bei Paris unter drei Glasglocken: bipm.org/en/measurement-units/history-si/prototype-kg und en.wikipedia.org/wiki/International_Prototype_of_the_Kilogram. Drift gegenueber den Kopien in der Groessenordnung von 50 Mikrogramm ueber rund hundert Jahre: dieselben beiden Stellen sowie nist.gov/si-redefinition/kilogram. Neudefinition am 20. Mai 2019 ueber die festgesetzte Planck-Konstante: bipm.org/en/measurement-units/si-defining-constants und nist.gov/si-redefinition. Kibble-Waage und der Silizium-Kugel-Weg (Avogadro-Projekt): nist.gov/si-redefinition/kilogram-kibble-balance und en.wikipedia.org/wiki/Kibble_balance. Geprueft am 21.08.2026.",
  },
  etappen: [
    {
      lines: [
        "A unit is a promise that two measures in two places mean the same thing.",
        "For most of the units, that promise is now kept by nature itself.",
        "The second is a count of the beats of a caesium atom.",
        "The metre is the distance light travels in a fixed sliver of a second.",
        "The kilogram was the odd one out, and it stayed odd for a long time.",
        "Until the spring of two thousand and nineteen, it was the mass of one lump of metal.",
        "The lump is a cylinder of platinum and iridium, smaller than a plum.",
        "It was cast in the year eighteen eighty nine, and it lives near Paris.",
        "It sits in a vault under three glass bell jars, one inside the other.",
        "Three keys are needed to reach it, and the keys are held in three places.",
        "It has been lifted out and weighed a handful of times in all those years.",
        "For a hundred and thirty years, that lump was the definition of the kilogram.",
      ],
    },
    {
      lines: [
        "Copies of it were sent out to the countries that signed the treaty.",
        "Each country kept its copy in the same careful way.",
        "Now and again the copies were carried back to Paris and set against the original.",
        "That is where the trouble showed.",
        "The original and its copies drifted apart, slowly and steadily.",
        "By the end of the last century the gap was close to fifty micrograms.",
        "A microgram is a millionth of a gram, so fifty of them is a speck of dust.",
        "It is nothing on a kitchen scale, and it is a great deal in a laboratory.",
        "And there was a deeper trouble hidden inside it.",
        "Nobody could say whether the original had lost mass or the copies had gained it.",
        "The original was the definition, so by definition it could not be wrong.",
        "A standard that cannot be wrong is a standard that cannot be checked.",
      ],
    },
    {
      lines: [
        "The way out was to stop using a thing at all.",
        "A constant of nature does not sit in a vault and it does not gather dust.",
        "So the world fixed a number and let the kilogram follow from it.",
        "The number is the Planck constant, and it belongs to the physics of the small.",
        "Its value was measured for years, ever more finely, and then it was frozen.",
        "From that day the constant carries no error at all: it is defined.",
        "The kilogram is now whatever mass makes that number come out right.",
        "The instrument that does the sum is called a Kibble balance.",
        "It sets a weight against an electric force and reads both in the same terms.",
        "A second route counts the atoms in a near perfect sphere of silicon.",
        "Both routes agree, and that agreement is the whole point of the exercise.",
        "The old cylinder still sits in its vault, and it is now an object like any other.",
      ],
    },
    {
      lines: [
        "Nothing changed on the day the definition changed.",
        "The number was chosen so that the new kilogram matched the old one.",
        "No shop scale moved, and no bag of flour got lighter.",
        "That was the point: a redefinition must be invisible to all but the labs.",
        "What changed is who is able to hold the standard.",
        "Before, a national lab had a lump of metal and a train ticket to Paris.",
        "Now a lab with a Kibble balance can realise the kilogram on its own bench.",
        "The same had happened to the metre and to the second before it.",
        "The limit is honest and worth saying: the constants are fixed by agreement.",
        "They are fixed at the values our best measurements found, and measurements err.",
        "If those measurements were a little out, the world carries that offset for ever.",
        "It is a fixed offset, though, and a fixed offset is one that all can live with.",
      ],
    },
  ],
};

/**
 * Die fruehen englischen Serien der Charge I2, in Treppen-Reihenfolge
 * (kids, dann teens, dann erwachsen; je Stufe nach Oeffnungspunkt).
 */
export const SERIEN_EN_FRUEH: Serie[] = [
  THE_SHELL_AT_THE_TIDE_LINE,
  THE_HARE_AT_DUSK,
  THE_CAT_IN_THE_ATTIC,
  THE_LIGHT_IN_THE_GARDEN_SHED,
  HOW_ANTS_FIND_FOOD,
  THE_WOODEN_WHISTLE,
  FROM_SEED_TO_PLANT,
  THE_THIRD_STAIR,
  THE_CLIFF_TRAIL,
  THE_SIGNAL_ON_THE_RIDGE,
  LIGHT_AND_THE_SECOND,
  THE_WALLET_IN_THE_LONG_GRASS,
  THE_RIVER_AND_THE_SEA,
  BEHIND_THE_SPORTS_HALL,
  THE_FALL_IN_THE_DRAIN,
  THE_LEFT_HAND,
  CHEESE_AND_MONTHS,
  THE_WALL_BETWEEN_TWO_GARDENS,
  SOUND_UNDER_THE_SEA,
  WHAT_A_KILOGRAM_IS,
];
