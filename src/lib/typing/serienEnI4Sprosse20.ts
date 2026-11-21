/**
 * ENGLISCHE SERIEN FÜR DIE SPROSSE 20 der neuen Buchstabenfolge
 * (Charge I4, 28.08.2026).
 *
 * ── WARUM ES DIESE DATEI GIBT ─────────────────────────────────────────────
 *
 * Gemessen am 28.08. mit `npx tsx scripts/_i4regal.mts --lang en` (Grundmenge
 * 139 Serien / 6792 Zeilen, davon englisch 39 Serien / 1956 Zeilen), gelesen
 * über die Öffnungspunkte 13 / 17 / 20 / 22 / 26 / 31 / 99 Einheiten:
 *
 *   en/kids       [ 0,  5,  8, 11, 13, 16, 16]
 *   en/teens      [ 0,  4,  7,  9, 10, 17, 17]
 *   en/erwachsen  [ 0,  3,  6,  7,  8, 13, 13]
 *
 * Das deutsche Regal steht an derselben Sprosse auf 21 / 23 / 8. Ein Kind, das
 * auf Englisch übt, hatte bei zwanzig Einheiten acht Geschichten - ein
 * deutsches einundzwanzig. Diese Datei legt sieben nach, und zwar alle sieben
 * GEMESSEN bei genau 20: sie leben von den drei Buchstaben `c g m`, die diese
 * Sprosse gegenüber der 17 dazugibt. Wer hier bei 17 landet, doppelt nur
 * `serienOFolgeEn.ts`.
 *
 * ── DAS BUDGET (am Objekt gemessen, nicht zitiert) ────────────────────────
 *
 * Frei: **a c d e f g h i j k l m n o r s t u** (18).
 * Gesperrt: **b p q v w x y z**.
 *
 * ── WAS DIE SPROSSE 20 GEGENÜBER 17 NEU BRINGT ───────────────────────────
 *
 *  • **m - der Rückbezug auf Personen.** Endlich *him* und *them*. In
 *    `serienOFolgeEn.ts` (Sprosse 17) musste jede Figur dauernd beim Namen
 *    genannt werden; hier trägt *she tells him*, *all three of them*, *one of
 *    them*, *the four of them*. Dazu *must, time, name, same, home, come,
 *    some, more, most, from, small, moment, matter, metal, summer, autumn,
 *    film, form, storm, team, room, mile, metre, minute, month, moth* - und
 *    **must** als echtes Modalverb neben dem umständlichen *has to*.
 *    Das `m` bringt auch die MASSE zurück: *metre, mile, minute* gehen, damit
 *    kann eine Serie zum ersten Mal etwas beziffern (»one and a half metres«).
 *  • **c - der Anschluss.** *can, cannot, come, call, each, such, much,
 *    close, second, ice, care, chance, catch, count, cost, cold, coast,
 *    correct, contact, cause, chair, school, coin, concert, camera, cellar,
 *    carriage, counter, cutter, cartoon, crackle, chalk, cloth, card*.
 *  • **g - die Verlaufsform.** Zum ersten Mal *going, holding, standing,
 *    making, looking, listening, mending, running*. Dazu *again, night,
 *    light, long, large, garden, green, gate, glass, guard, guess, enough,
 *    laugh, high, tonight, grandmother*. Der Ton wird davon sofort lebendiger:
 *    die früheren Sprossen konnten nur behaupten - hier kann etwas gerade
 *    geschehen, während jemand zusieht.
 *
 * ── WAS FEHLTE UND WAS STATTDESSEN TRUG ──────────────────────────────────
 *
 * Der wertvollste Abschnitt dieser Datei, beim Schreiben Zeile für Zeile
 * mitgeschrieben - jedes Wort mit (!) hat mich beim ersten Durchlauf des
 * Messskripts erwischt, nicht beim Nachdenken davor.
 *
 *  • **kein w** - kein *was, were, will, would, with, what, when, where,
 *    which, who, how, we, now, know, want, wait, work, week, world, word,
 *    water, walk, wall, warm, window, winter, snow, down(!), own(!), two(!),
 *    new, answer, always, however, follow, show, low, went, saw, write,
 *    between, well, slow(!), crew(!), news(!), toward*.
 *    - **Ohne *was/were* gibt es keine Vergangenheit von *to be***: erzählt
 *      wird im simple present, das Perfekt liefert *has/had* + Partizip
 *      (*has come, has sat, has held, has told, has made, has done*).
 *    - Für *with* trägt **together, alongside, at her side, in her hand,
 *      and** oder der bloße Doppelobjekt-Bau.
 *    - Für *wait* trägt **she sits it out, she holds on, nothing comes**.
 *    - **draw, drew, drawn(!)** fallen ALLE aus - eine gezeichnete Karte
 *      heißt darum *she has set the fence and each tree in ink*, *a chart
 *      of a garden, made out of her head*.
 *    - **shadow(!)** trägt ein w: es heißt *the shade*.
 *    - **news(!)**: im Radio läuft *the coast forecast*, nicht *the news*.
 *    - *down* fehlt in JEDER Richtung: *she goes to the cellar* (nicht down
 *      to), *he sets it off* (nicht sets it down), *face to the floor*.
 *  • **kein y - der teuerste Posten der Sprosse.** Kein *you, they(!), day(!),
 *    year, any, many, only, very, my, say, way, may, key(!), eye, boy, yes,
 *    young, early, ready, easy, busy, city, story, family, money, happy,
 *    angry, hungry, dry(!), grey(!), lorry(!), trolley(!), yard, yet,
 *    already, nearly, really, maybe*, **kein Wochentag**, **kein einziges
 *    Adverb auf -ly**.
 *    - **Das Pronomen *they* fehlt, *them* und *their* nicht.** Als Subjekt
 *      trägt *the others, all three, the four of them, the class, the girls,
 *      the lot, Ada and Ines*. Das ist keine Notlösung geblieben: die Gruppen
 *      sind dadurch schärfer benannt als mit einem dauernden »sie«.
 *    - **kein *day***: Zeit läuft über *the night, three nights, the
 *      afternoon, a fortnight, the hour, the season, at first light,
 *      tonight*. Monate: es gibt nur **March, June, August** - *April,
 *      September* hängen am p, *October, December, February* am b,
 *      *November* am b und v, *January, May, July* am y.
 *    - **kein *key***: die Tasten des Harmoniums heißen darum *notes* (man
 *      hält eine Note), und ein Schlüssel kommt in keiner der sieben Serien
 *      vor - Türen werden aufgelassen, nicht aufgeschlossen.
 *    - **kein *dry***: die kalte Lötstelle heißt im Englischen sonst *dry
 *      joint*; hier trägt der zweite Fachname **cold joint**.
 *    - **kein *lorry* und kein *trolley***: es fahren *a truck* und *a tea
 *      cart*.
 *    - ⚠️ **Die Namensliste des Auftragsbuchs ist nicht geprüft**:
 *      *Constanze* trägt ein z und fällt auf jeder Sprosse unter 23 aus.
 *      Jeden Namen einzeln messen - hier tragen Ada, Alina, Aron, Astrid,
 *      Dilan, Elif, Emine, Fadila, Farid, Gideon, Halina, Ida, Ilka, Ilse,
 *      Ines, Ingrid, Lucia, Malik, Manuel, Milan, Nadja, Nella, Otto, Rica,
 *      Sofie, Tarik.
 *  • **kein b** - kein *be, been, back, but, by(!), about, before(!),
 *    because, big, book, both(!), box, boat, bus, buoy(!), build, bread,
 *    brother, number, remember, table(!), problem, trouble, club, band, job,
 *    cabinet(!), doubt(!), harbour(!), maybe*.
 *    - **kein *but***: die Gegenrede trägt **though, still, else, instead,
 *      nor, all the same, and no more** oder der Doppelpunkt.
 *    - **kein *harbour*** - der teuerste Einzelfund dieser Charge, denn er
 *      trifft jede Küstengeschichte. Es trägt **the dock, the dock office,
 *      the dock master, the anchorage, the coast, the North Sound**.
 *    - **kein *table***: es gibt *the trestle, the counter, the desk, the
 *      stand*; in der Mendhalle sind es Böcke, und das ist besser.
 *    - **kein *cabinet***: im Sortieramt stehen *racks*.
 *    - **kein *buoy***: die Seemarke heißt schlicht *a mark*, und ihre Art
 *      *a cardinal*.
 *    - **kein *before***: es trägt *the night after that, ahead of, at
 *      first, until, once*.
 *    - **kein *job* und kein *club***: der Ferienjob heißt *the round, the
 *      hours, the trade*; der Filmclub heißt *the film class*.
 *  • **kein p** - kein *people, place, part, play(!), open, help, keep, hope,
 *    up(!), stop, drop, top, paper, phone(!), please, plan, point, put, pass,
 *    step, sharp, simple, sleep, deep(!), spot, sport, jump(!), strip(!),
 *    tap(!), skipper(!), pipe(!), repair(!), September, April*.
 *    - **kein *play***: eine Musikgeschichte geht trotzdem - *she treads the
 *      harmonium, she holds three notes, the tune comes, the hall goes
 *      still*. Das Verb fehlt in der ganzen Serie und fehlt nicht.
 *    - **kein *phone***: es trägt *she calls him, his line comes, he sends
 *      her a line, the screen, the night line*.
 *    - **kein *pipe***: eine Heizungsgeschichte baut auf *the run, the feed,
 *      the return, the riser, the main, the radiator, the tank, the air
 *      cock, the furnace*.
 *    - **kein *repair***: das Reparaturcafe heißt **the mending hall**.
 *    - **kein *help***: *a hand, she lends a hand, is there a hand or three*.
 *    - **kein *tap***: geklopft wird mit *knocks*; **kein *deep***: es trägt
 *      *it needs more than that under it*.
 *  • **kein v** - kein *have(!), give(!), over, never, ever, even(!), every,
 *    five, seven, eleven, love, live, leave(!), move(!), drive, arrive,
 *    river(!), evening(!), several, cover, save, glove(!), valve(!),
 *    archive(!)*.
 *    - **have fehlt, has und had nicht**: also nie *I have*, nie *to have*.
 *      Besitz läuft über *has*, über *it came from her* oder über den
 *      of-Genitiv (*the tin of Manuel*).
 *    - **kein *even***: es trägt *still, at all, and no more*.
 *    - **kein *evening***: es trägt *the afternoon, at dusk, at nightfall,
 *      tonight, late*. (Die Auftragsliste führt *evening* irrtümlich als
 *      frei - es hängt am v.)
 *    - **kein *valve***: ein Röhrenradio ist damit unerzählbar; die
 *      Mendhalle repariert darum einen **transistor set**, und der Fehler
 *      ist eine kalte Lötstelle.
 *    - **kein *archive***: die alte Seekarte geht *into the record room*.
 *    - **kein *give***: es trägt *tells, hands, lends, lets*.
 *  • **kein x, kein z, kein q** - kein *next(!), six, box, fix, exact,
 *    explain, size, dozen, question, quiet, quick, quite*. Für *next* trägt
 *    *then, the one after, the night after that*; für *quiet* trägt *still,
 *    calm, hushed*.
 *  • ZAHLEN: frei sind **one, three, four, eight, nine, ten, thirteen,
 *    fourteen, fifteen, eighteen, nineteen, hundred, thousand, million** und
 *    die Ordinalzahlen *first, third, fourth, eighth, ninth, tenth*.
 *    Gesperrt: *two, five, six, seven, twelve, twenty, thirty, forty*. Das
 *    fehlende *two* ist im Erzählen teurer als es aussieht: für ein Paar
 *    trägt *the girls, the one and the other, all three, one more*.
 *
 * ── DIE SIEBEN SERIEN DIESER DATEI ───────────────────────────────────────
 *
 *   öffnet | Titel                       | Stufen            | Thema
 *   -------|-----------------------------|-------------------|-----------
 *     20   | The Tune in the Cellar      | kids              | schule
 *     20   | One Frame at a Time         | kids              | technik
 *     20   | The Letter That Ran Late    | kids, teens       | alltag
 *     20   | The Night Train North       | teens             | abenteuer
 *     20   | The Mending Hall            | teens, erwachsen  | technik
 *     20   | The Caretaker and the Frost | erwachsen         | arbeit
 *     20   | The Chart of the Coast      | erwachsen         | natur
 *
 *  1. **The Tune in the Cellar** (kids, schule) - der Musiksaal ist undicht,
 *     die Klasse probt im Keller, und unter einem Staubtuch steht ein altes
 *     Harmonium; eine Note hängt fest, und im Schlitz der Zunge steckt eine
 *     Münze, die der Hausmeisterin gehört hat.
 *  2. **One Frame at a Time** (kids, technik) - die Filmklasse baut einen
 *     Trickfilm aus Karton und Alufolie; im Durchlauf läuft ein Nachtfalter
 *     über den Mond, und die Klasse muss entscheiden, ob das ein Fehler ist.
 *  3. **The Letter That Ran Late** (kids + teens, alltag) - beim Räumen des
 *     alten Sortieramts fällt ein Brief hinter einem Regal hervor, adressiert
 *     an eine Straße, auf der heute die Schule steht.
 *  4. **The Night Train North** (teens, abenteuer) - Ines kennt die Strecke
 *     im Schlaf; diesmal bleibt der Zug im Frost stehen, das Licht geht aus, der
 *     Anschluss fährt ohne sie, und der Teewagen wird im Dunkeln durch den
 *     ganzen Zug getragen.
 *  5. **The Mending Hall** (teens + erwachsen, technik) - in der alten
 *     Feuerwache wird einmal im Monat repariert; Malik bringt das Radio
 *     seiner Großmutter, und der Fehler kommt und geht.
 *  6. **The Caretaker and the Frost** (erwachsen, arbeit) - drei Frostnächte,
 *     dreizehn Wohnungen, kein Heizwasser im dritten Stock; Halina steigt auf
 *     den Dachboden und findet Eis, einen Riss und Luft in der Leitung.
 *  7. **The Chart of the Coast** (erwachsen, natur) - Gideon lotet in seiner
 *     letzten Saison eine Sandbank nach, die nicht mehr dort liegt, wo die
 *     Seekarte sie führt.
 *
 * ── FORM UND RECHTE (wie im ganzen englischen Bestand) ────────────────────
 *
 * Selbst verfasst (Bauplan 27.07. §10), britisches Englisch, KEINE
 * Apostrophe, wörtliche Rede OHNE Anführungszeichen, keine Ziffern, jede
 * Zeile EIN Satz und höchstens 70 Zeichen (gemessen: 31 bis 70), Satzzeichen
 * nur . , - ? ! : ; und nur der einfache Bindestrich. Vier Etappen zu zwölf
 * Zeilen je Serie; jede Etappe endet auf einen Zug, der weiterlesen lässt,
 * die letzte schließt auf ein Bild und nicht auf eine Lehre.
 *
 * TON: Gegenwart 2026. Kein Maskottchen und kein sprechendes Tier außerhalb
 * der Kinder-Stufe (und auch dort keines: der Nachtfalter ist ein Nachtfalter).
 * Auf der Kinder-Stufe nichts Bedrohliches, kein Tod, keine Krankheit als
 * Spannungsmittel - in »The Letter That Ran Late« leben beide Geschwister,
 * und der Brief endet mit einer Antwort, nicht mit einem Grab. In »The Night
 * Train North« steigt niemand ins Gleis; geholfen wird am Teewagen.
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
// kids · Musiksaal undicht, Probe im Keller, ein Harmonium unter dem Tuch.
// Ohne `key` (y) heißen die Tasten `notes`, ohne `play` (p) wird getreten,
// gehalten und gehört - das Verb fehlt in der ganzen Serie und fehlt nicht.
// ───────────────────────────────────────────────────────────────────────────
const THE_TUNE_IN_THE_CELLAR: Serie = {
  slug: "en-i4-the-tune-in-the-cellar",
  titel: "The Tune in the Cellar",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "schule",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Rain comes in at the music room roof all autumn.",
        "So the class shifts to the cellar until the roof is mended.",
        "The cellar is cold, and it smells of chalk and old dust.",
        "Nella and Aron take the drum in first.",
        "Dilan hands Ida the flute case and holds the door.",
        "At the far end something tall stands under a dust sheet.",
        "Ida lifts one corner of the sheet and lets it fall again.",
        "It is a harmonium, and it is as old as the school.",
        "It has a treadle at each foot and a long rank of notes.",
        "Aron treads, and the harmonium takes in air.",
        "It sounds, and the sound fills the cellar to the stairs.",
        "Then one note holds on, and it does not let go.",
      ],
    },
    {
      lines: [
        "The note hangs there, thin and cross.",
        "Ida takes her hands off, and it hangs on all the same.",
        "Nella treads out the last of the air.",
        "At last the note thins into nothing.",
        "Dilan finds a catch at the side of the lid.",
        "The lid comes off, and there is a rank of reeds inside.",
        "Each reed is a thin length of metal, and each has a slot.",
        "One slot has something stuck fast in it.",
        "Ida holds the torch close, and Aron leans in.",
        "It is a coin, and it is dull and dark as old tin.",
        "It holds that reed off its slot, so the air runs on.",
        "There is a face on the coin, and none of the four can name it.",
      ],
    },
    {
      lines: [
        "Ida rests the torch on the lid so it lights the slot.",
        "Aron trims a thin lath of card and slides it in at the side.",
        "The coin shifts a little, and then it falls into his hand.",
        "The reed stands free, and it sounds true again.",
        "Nella laughs so loud that the cellar rings after her.",
        "Then the door goes, and Ilse the caretaker looks in.",
        "She tells them the cellar has to clear in a fortnight.",
        "The harmonium goes to the hall, or it is done for.",
        "The autumn concert is in three nights, in that same hall.",
        "Ida asks Ilse: can the harmonium come along to it?",
        "Ilse counts the stairs and shakes her head at first.",
        "Then she looks at the coin in the hand of Ida, and she halts.",
      ],
    },
    {
      lines: [
        "It takes eight of them to get the harmonium off the stairs.",
        "The turn at the half landing is tight, and the case is long.",
        "Ilse holds the door and calls the stairs out, one at a time.",
        "In the hall it stands near the front, close to the side door.",
        "The concert starts late, as concerts do.",
        "Nella counts the four of them in, and Ida treads.",
        "The old reeds are thick, and the tune comes out rough and full.",
        "Half the hall goes still at the third line of it.",
        "Ilse stands at the door all through it and does not sit.",
        "After the last note Ida sets the coin on the lid.",
        "Ilse takes it, turns it in the light, and tells Ida one thing:",
        "Her grandmother sat at this harmonium, in this same hall.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids · Trickfilm aus Karton und Alufolie. Ohne `stop` (p) gibt es kein
// Stop-Motion-Vokabular; es trägt `one frame at a time`, `the run`, `the
// shots`. Der Nachtfalter im Bild ist kein Maskottchen, sondern ein Fehler,
// den die Klasse behält. Ohne `shadow` (w) heißt der Schatten `the shade`.
// ───────────────────────────────────────────────────────────────────────────
const ONE_FRAME_AT_A_TIME: Serie = {
  slug: "en-i4-one-frame-at-a-time",
  titel: "One Frame at a Time",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The film class meets in the old media room each autumn.",
        "Otto and Elif are making a cartoon of a moon landing.",
        "The rocket is card and tin foil, and it is as tall as a hand.",
        "The moon is a dish of flour on a dark cloth.",
        "The camera sits on a stand and looks straight at it.",
        "Each shift of the rocket takes one shot, and each shot is a frame.",
        "It takes far more frames than the class had guessed.",
        "Otto shifts the rocket the length of a nail each time.",
        "Elif holds the light still so that the shade does not shift.",
        "The three of them do three hundred frames in one afternoon.",
        "At the end their teacher, Ingrid, runs the frames as one film.",
        "The rocket lands - and something else is on the moon.",
      ],
    },
    {
      lines: [
        "Ingrid runs the last of the frames again, at half the rate.",
        "There is something small and dark at the edge of the flour.",
        "In the third frame it is near the rim; in the tenth it is not.",
        "Lucia leans in close to the screen.",
        "It has legs, and the legs are going.",
        "It is a moth, and it has come in at the roof light.",
        "The moth has landed on the moon, in front of the camera.",
        "Otto asks if the run is done for.",
        "Ingrid tells him that nothing is done for until the class decides.",
        "The moth is in nine frames, one after another.",
        "In the last of the nine it is on the head of the rocket.",
        "Otto reaches to cut the nine, and Elif holds his hand still.",
      ],
    },
    {
      lines: [
        "Elif tells them that the moth is the film.",
        "Otto is not so sure: a fault is a fault, and faults come out.",
        "Lucia counts it: nine frames is far less than one second.",
        "Ingrid lets the class settle it, and the class is at odds.",
        "In the end the moth stands, and the film gets a title.",
        "It reads: The Moth on the Moon.",
        "Then the sun comes around to the glass of the media room.",
        "The light shifts, and the last shots come out half dark.",
        "Otto tacks a sheet of card across the glass and it is dark again.",
        "The class runs the shots once more: the shade still shifts.",
        "The stand has slid, and each frame sits a hair off the last.",
        "Nine frames are lost, and the school film night is close.",
      ],
    },
    {
      lines: [
        "Otto and Elif do the nine frames again after class.",
        "This time Lucia chalks a line around each foot of the stand.",
        "Each foot goes on its chalk mark, and the shots hold still.",
        "The moth does not come again, so Elif makes one of card.",
        "It is thin, and its legs are cut from a fine dark thread.",
        "In the film the card moth crosses the flour to the rocket.",
        "On the night the hall is full and the room is dark.",
        "The film runs for less than a minute.",
        "At the moth the hall makes one sound, all at once.",
        "After that Otto tells them the first moth is still in it.",
        "Nine frames near the end, real and not card at all.",
        "Lucia has the card moth in her hand, and she is not letting go.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids + teens · Ein Brief aus einem alten Sortieramt. Ohne `post` (p) heißt
// es `the sorting office`, `the counter`, `the mail`; ohne `lorry` (y) fährt
// ein `truck` vor. Der Empfänger lebt, die Absenderin lebt - kein Tod, kein
// Trauerbild, nur eine Zeichnung, die falsch ist und trotzdem stimmt. Ohne
// `draw/drawn` (w) wird sie `set in ink`, nicht gezeichnet.
// ───────────────────────────────────────────────────────────────────────────
const THE_LETTER_THAT_RAN_LATE: Serie = {
  slug: "en-i4-the-letter-that-ran-late",
  titel: "The Letter That Ran Late",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The old sorting office at the station is to clear this autumn.",
        "Their aunt Fadila has the last of the counters there.",
        "Sofie and Tarik come in after school to see it go.",
        "The old racks are loaded on a truck at the side door.",
        "One rack is stuck fast, and it takes three of them to shift it.",
        "Under it there is dust, one old mitten and a lot of card.",
        "Tarik finds a letter at the foot of the rack, face to the floor.",
        "The ink has faded and one edge is torn.",
        "The mark on it is so old that it is hard to read at all.",
        "Fadila holds it to the light and reads the address out.",
        "It is for a Milan Corin, at ten Elm Road.",
        "There is no Elm Road at all - the school stands across it.",
      ],
    },
    {
      lines: [
        "Fadila tells them that Elm Road is gone, all of it.",
        "The school and the games hall sit on the old line of it.",
        "Sofie holds the letter to the light: there is more than one sheet.",
        "None of the three is going to cut a letter that is not theirs.",
        "The rule at the counter is old and it holds.",
        "A letter goes to the hand it is for, or it goes to no hand at all.",
        "So the three of them set out to find Milan Corin.",
        "Tarik asks at the school office for the old class lists.",
        "The lists reach far, and there is a Corin in one of them.",
        "Milan Corin, ten Elm Road, and a note at the end: left in June.",
        "That is all of it, and the office has no more.",
        "Then Fadila reads the sender on the letter, and she sits.",
      ],
    },
    {
      lines: [
        "The name on it is Ada Corin, and the address is in Toronto.",
        "One Corin has sent it to another, across an ocean.",
        "Fadila calls the care home at the far end of the district.",
        "There is a Milan Corin there, and he is the oldest in the house.",
        "Sofie and Tarik go out to it after school on the tram.",
        "The hall of the care home smells of tea and clean linen.",
        "Milan Corin sits at the door end, in the light.",
        "His hands are still, and he does not look at them at first.",
        "Sofie tells him that a letter for him has come to the counter.",
        "He asks, and his tone is flat: from Elm Road?",
        "Tarik tells him it is from Toronto, and the hall goes still.",
        "Milan Corin holds one hand out, and it is not still at all.",
      ],
    },
    {
      lines: [
        "Fadila hands him the letter and stands off a little.",
        "He turns it and looks at the ink for a long time.",
        "The seal comes off in one clean line, as if it is fresh.",
        "There are three sheets, and one of them is a chart of a garden.",
        "Ada Corin has set the fence, the shed and each tree in ink.",
        "Milan tells them that the garden is the one at ten Elm Road.",
        "Ada is his sister, and she has made it all out of her head.",
        "He runs one finger along the fence and tells them it is off.",
        "It ran at the elm, he tells them, and not at the gate.",
        "Then he asks Sofie for a sheet and a hand to hold it still.",
        "He notes three lines, no more, and he folds it once.",
        "Fadila takes it, and this one goes out at the counter tonight.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens · Nachtzug, Frost, Anschluss weg. Ohne `wait` (w) sitzt Ines es aus,
// ohne `window` (w) gibt es nur `the cold glass`. Der Zug hält, weil Eis auf
// der Fahrleitung liegt - niemand steigt ins Gleis, geholfen wird am Teewagen
// (`trolley` trägt ein y, also `the tea cart`).
// ───────────────────────────────────────────────────────────────────────────
const THE_NIGHT_TRAIN_NORTH: Serie = {
  slug: "en-i4-the-night-train-north",
  titel: "The Night Train North",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 2,
  topic: "abenteuer",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ines takes the last train north, alone, as she often does.",
        "Her grandmother, Ingrid, is at the far end of the line.",
        "The train comes out of the station late, as it often does.",
        "Ines has a seat at the door end of the carriage.",
        "Her rucksack holds a tin of oat cakes and a torch.",
        "The land outside goes dark, then it goes darker still.",
        "At the third halt a guard comes through and reads the tickets.",
        "He is Farid, and he has had this run for a long time.",
        "He tells Ines that her connection north goes in one hour.",
        "Then the train eases, and it eases more, and at last it halts.",
        "There is no station out there, and no light at all.",
        "The lights in the carriage go out, and the heat goes out too.",
      ],
    },
    {
      lines: [
        "In the dark the carriage is louder than it is in the light.",
        "A tin rolls under the seats and no one goes after it.",
        "Farid comes through again, and he has a torch at his front.",
        "He tells them that ice has taken the line ahead.",
        "The train stands, and the frost comes in at the doors.",
        "Ines counts the minutes until there is no sense left in it.",
        "The girl across from her is Nadja, and she goes to the coast.",
        "Nadja has a card game and no one to do it against.",
        "So the three of them deal it out: Ines, Nadja and a man in a coat.",
        "The torch of Farid stands on its end and lights the three hands.",
        "It is the man in the coat that takes the most rounds.",
        "Then the doors at the front go, and cold air runs the carriage.",
      ],
    },
    {
      lines: [
        "Farid comes in, and he is not alone.",
        "Three of the line hands come after him, in hard hats.",
        "One has a rod as long as half the carriage.",
        "The ice has to come off the line, and it takes hands to do it.",
        "Farid asks the carriage for a hand or three at the tea cart.",
        "Ines is on her feet first, and Nadja comes after her.",
        "The cart is at the front, and it holds tea and hot cocoa.",
        "There are no lights, so the girls feel along the seats as it goes.",
        "Ines learns the true length of a train in the dark.",
        "In the last carriage a man holds a small child, and each is cold.",
        "Nadja hands him the tea and holds the torch for him.",
        "Then the lights come on, all at once, and the train shifts.",
      ],
    },
    {
      lines: [
        "The train runs at last, and it runs late, and no one minds it.",
        "Farid tells Ines that her connection has gone north an hour since.",
        "There is no other, not until the light comes.",
        "She is going to sit it out at the junction, alone, all night.",
        "Nadja hears it and tells her the coast train stands at that halt.",
        "It is not the same line, and it goes an hour later.",
        "It sets Ines off three stations short of her grandmother.",
        "Ingrid takes the car out at that hour if it is asked of her.",
        "At the junction the frost is hard and the hall lights are on.",
        "Farid stands at his door until the girls are on the coast train.",
        "At first light the fields come out of the dark, hard and cold.",
        "Ingrid stands at the halt in the frost, and the car is running.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens + erwachsen · Reparaturcafé ohne das Wort `repair` (p): die Mendhalle.
// Radios der alten Sorte haben `valves` (v) - darum ist es ein Transistorsatz,
// und der Fehler ist eine kalte Lötstelle - `dry joint` trägt ein y, also der
// zweite Fachname `cold joint`. Die Sicherheit
// steht im Text, nicht in einer Warnung: der Stecker kommt zuerst heraus.
// ───────────────────────────────────────────────────────────────────────────
const THE_MENDING_HALL: Serie = {
  slug: "en-i4-the-mending-hall",
  titel: "The Mending Hall",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens", "erwachsen"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The mending hall runs on the last afternoon of each month.",
        "It sits in the old fire station at the end of Anchor Lane.",
        "Malik is fifteen, and he is the least old in the hall.",
        "He has an old radio in a crate, and it does not sound at all.",
        "It came from his grandmother, Emine, and it is older than she is.",
        "At the first trestle a man mends a coat, seam and cuff.",
        "At the second, Ilka glues a chair and holds it in a cord.",
        "The third trestle is for all that runs off the mains.",
        "Astrid is at that one, and she has had this trade for a lifetime.",
        "She looks at the radio and tells Malik to get the case off.",
        "Inside there is dust, and a smell of hot dust and old glue.",
        "Astrid reaches for no tool: she reaches for the sheet in the lid.",
      ],
    },
    {
      lines: [
        "The sheet in the lid is a chart of all that is inside the set.",
        "It is faded, and one corner has come off in the glue.",
        "Astrid tells Malik the first rule of the trestle.",
        "The lead comes out at the socket, and it stands out on the floor.",
        "Nothing goes on until the set is off the mains for good.",
        "Then Malik holds the meter and Astrid reads the chart.",
        "The fuse holds, and the lead reads out clean.",
        "Astrid knocks the case, and the set sounds one dull crackle.",
        "That crackle tells them more than an hour of reading.",
        "A fault that comes and goes is the hard sort to find.",
        "Alina calls the hall in: the tea is on and the hour is late.",
        "The one after this is a month off, and Astrid marks the case in chalk.",
      ],
    },
    {
      lines: [
        "Malik does not hold on for a month.",
        "Astrid lends him the meter and a stand light instead.",
        "At home he takes the set out again and reads the chart, line for line.",
        "He finds the sound end and the mains end of it at last.",
        "Then he knocks the card inside, one corner at a time.",
        "At one corner the crackle comes, and it comes each time.",
        "Under the stand light the solder there is dull, not clean and full.",
        "One joint has a fine ring around it, thin as a hair.",
        "That is a cold joint: the solder has cracked in it.",
        "Malik has no iron at home, and the hall is shut.",
        "He sends Astrid three lines and a shot of the joint.",
        "Her line comes at once: hold it as it is, Alina lets us in tonight.",
      ],
    },
    {
      lines: [
        "The hall is dark and cold, and one light is on at the third trestle.",
        "Astrid has the iron hot and a coil of solder in her hand.",
        "She tells Malik that the iron is his, and that she is not touching it.",
        "First he cleans the joint until the metal is dull and clean.",
        "Then the iron goes on and the solder runs in, all at once.",
        "It has to run, not sit: solder that sits is another cold joint.",
        "Malik counts to three and takes the iron off.",
        "The joint stands out round and full, and it holds the light.",
        "Astrid sets the card in, then the case, then the lead.",
        "The set comes on and it hums, and a man reads the coast forecast.",
        "Malik lets it run, all of the forecast, to the last name on it.",
        "Then he calls Emine and holds the set close, so that she hears it.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// erwachsen · Hausmeisterin, dreizehn Wohnungen, drei Frostnächte. Ohne
// `pipe` (p) und ohne `water` (w) trägt die Anlage sich selbst: `the feed`,
// `the return`, `the run`, `the riser`, `the tank in the loft`. Kein Unglücks-
// fall, keine Krankheit - ein Riss, Luft in der Leitung, zwei Nächte Frist.
// ───────────────────────────────────────────────────────────────────────────
const THE_CARETAKER_AND_THE_FROST: Serie = {
  slug: "en-i4-the-caretaker-and-the-frost",
  titel: "The Caretaker and the Frost",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The frost comes in hard and it holds for three nights.",
        "Halina has the care of thirteen flats at Field Lane.",
        "At first light Manuel calls her from the third floor.",
        "There is no heat in his flat at all, and it is his third cold night.",
        "She goes to the cellar and looks at the furnace.",
        "The furnace runs, and the return line is hot at her hand.",
        "So the heat comes out of the cellar: it does not get to the third.",
        "In the flat of Ilse at the first floor the radiators are hot.",
        "At the second floor the near radiator is hot and the far one is cold.",
        "At the third floor there is no heat in the metal at all.",
        "Manuel stands in his coat and he is not glad.",
        "Halina goes for the loft ladder and the long torch.",
      ],
    },
    {
      lines: [
        "The loft is colder than the frost outside it.",
        "The tank sits on a stand of old oak at the far end.",
        "In it there is ice, and the ice is a hand thick.",
        "The feed comes out of that tank and it holds the runs full.",
        "No feed, no heat: the third floor sits at the end of the run.",
        "Halina has met this once, in her first season here.",
        "She calls the engineer on the night line and it is engaged.",
        "So she does not sit and hold on.",
        "She takes three hot cloths out of the urn in the hall.",
        "The cloths go around the feed at the tank, one after another.",
        "Manuel comes after her at the ladder and holds the torch.",
        "Then there is a sound in the tank, and it is not a good one.",
      ],
    },
    {
      lines: [
        "The ice shifts and comes off the side of the tank in one sheet.",
        "Under it there is a crack, thin and long, in the old metal.",
        "As the ice melts, the tank runs out at that crack.",
        "The loft floor takes it, and after that the ceiling of Manuel.",
        "Halina shuts the feed and lets the runs hold on to the rest.",
        "Then she gets a tin dish under the crack and a cloth in the dish.",
        "The engineer calls at last: he comes the night after this one.",
        "One night and one more, and the third floor stands cold.",
        "In the store there are three heaters of the old sort.",
        "One goes to Manuel, one to the flat of Fadila at the third.",
        "The third stands on stone in the loft, to hold the frost off the runs.",
        "At one in the morning Manuel calls her: there is a hiss in the loft.",
      ],
    },
    {
      lines: [
        "The hiss is air, and air in a run is a thing she can mend.",
        "Halina takes the small tool for the air cock of a radiator.",
        "At the third floor she turns it a third of a turn, and no more.",
        "The hiss comes out long, then it thins, then it is done.",
        "The metal fills, and the far end of the radiator gets hot.",
        "Manuel stands at the door and hears the run come to life.",
        "The third floor has heat that night, and it holds all night.",
        "The engineer comes the night after and takes the old tank out.",
        "It goes out to the road in the hands of three of them.",
        "The one that goes in is not metal at all, and it sits in a case.",
        "Halina notes the hour, the fault and the cost in her log.",
        "In the morning there is a tin of tea at her door, and no note at all.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// erwachsen · Seekarte, Sandbank, letzte Saison. Ohne `buoy` (b) und ohne
// `survey` (v, y) heißt es `a mark`, `the sounding lines`, `the runs`; und da
// `harbour` ein b trägt, liegt alles `at the dock`; ohne
// `archive` (v) geht die alte Karte `into the record room`. Der Kutter kommt
// mit einem Kratzer davon - kein Verletzter, und das ist auch der fachlich
// häufige Fall: bei halber Tide auf Sand, bei Flut wieder frei.
// ───────────────────────────────────────────────────────────────────────────
const THE_CHART_OF_THE_COAST: Serie = {
  slug: "en-i4-the-chart-of-the-coast",
  titel: "The Chart of the Coast",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Gideon has run the sounding lines off this coast for a lifetime.",
        "This is his last season on the launch, and he has told no one.",
        "The chart of the North Sound is old and it has held all that time.",
        "It marks a shoal one mile north of the island.",
        "It calls the shoal Cardinal Sand and it holds three metres on it.",
        "Gideon runs a line across it in the last of the summer light.",
        "The sounder reads three, then three, then one and a half.",
        "He runs the line again, north to south, and it reads the same.",
        "The sand does not sit at all as the chart holds it.",
        "He notes the run, the hour and the tide in his log.",
        "In the dock office that night he takes the old chart out again.",
        "It is set out in a fine, sure hand, and no one has held it false.",
      ],
    },
    {
      lines: [
        "In the morning the dock master, Ingrid, hears him out.",
        "One run is one run, she tells him, and a sounder can lie.",
        "Gideon does not argue: he asks for the launch for three tides.",
        "Ingrid lets him take it for one.",
        "He runs eight lines across Cardinal Sand at half tide.",
        "Each of the eight has the sand east of the mark on the chart.",
        "At the east end the least reading is one and a half metres.",
        "A loaded cutter out of this dock needs more than that under it.",
        "Ingrid reads the log and does not tell him the sounder lies.",
        "A correction goes into the notice, and the notice takes a season.",
        "Until then the sand sits there and no chart has it.",
        "That same night the cutter Rica comes in late, and her hull is scored.",
      ],
    },
    {
      lines: [
        "The Rica has touched sand a mile north of the island.",
        "No one is harmed, the hull holds, and she comes off on the flood.",
        "Her master, Malik, is not a man that misreads a chart.",
        "He has that sand marked on his screen at three metres.",
        "In the dock office he sets his run against the log of Gideon.",
        "The lines cross at the same sand, and the chart is out.",
        "Ingrid sends the notice out that hour, and it goes along the coast.",
        "A mark has to go in at the east end of the sand.",
        "That is a cardinal, and a cardinal is a matter of months.",
        "So the dock takes an old mark out of the store and sets it there.",
        "It is not the mark that the sand is going to get in the end.",
        "It stands there all the same, and it holds through three gales.",
      ],
    },
    {
      lines: [
        "The correction goes into the chart in the last of the summer.",
        "It comes out as one line and a shift of one sand mark to the east.",
        "A reader of it sees one line, and no more than that.",
        "Gideon gets the old chart out of the store at the dock office.",
        "It is done, and a done chart goes to the record room at the college.",
        "He notes on the corner: sand shifted east, one hundred metres.",
        "Then the date and his name, in a hand not as fine as the first.",
        "Ingrid asks him if he is going to run one more season.",
        "Gideon tells her that he has sent the office his last log.",
        "She does not ask him a second time.",
        "On the last run out he lets the third hand take the launch.",
        "Gideon stands at the sounder and reads the sand out, alone.",
      ],
    },
  ],
};

/** Die sieben englischen Serien der Charge I4 für die Sprosse 20. */
export const SERIEN_EN_I4_SPROSSE20: Serie[] = [
  THE_TUNE_IN_THE_CELLAR,
  ONE_FRAME_AT_A_TIME,
  THE_LETTER_THAT_RAN_LATE,
  THE_NIGHT_TRAIN_NORTH,
  THE_MENDING_HALL,
  THE_CARETAKER_AND_THE_FROST,
  THE_CHART_OF_THE_COAST,
];
