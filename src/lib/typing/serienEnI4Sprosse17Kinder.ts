/**
 * ENGLISCHE SERIEN FÜR DIE SPROSSE 17 - Kinder und Jugendliche
 * (Charge I4, 28.08.2026).
 *
 * --- WARUM ES DIESE DATEI GIBT (mit Messung) ------------------------------
 *
 * `npx tsx scripts/_i4regal.mts --lang en` sagte vor dieser Charge:
 *
 *   en/kids   [0, 5, 8, 11, 13, 16, 16]   en/teens  [0, 4, 7, 9, 10, 17, 17]
 *
 * An der Sprosse 17 standen also ganze VIER englische Serien im Regal - zwei
 * für kids (The Hare at Dusk, The Tin on the Shelf), eine für teens (The Third
 * Floor), eine für Erwachsene (The Salt Shed). Ein deutsch übendes Kind hat an
 * derselben Sprosse zehn bis zwölf Geschichten. Diese Datei legt sechs dazu:
 * drei nur für kids, drei, die bis in die Jugend tragen.
 *
 * Gemessen wurde jede Serie einzeln mit dem Pflicht-Skript aus §6 des
 * Auftragsbuchs (Öffnungs-Sprosse aus `fitsKeys` gegen `INTRO_ORDER`, Form aus
 * `validateSerie`, Tier aus `computeSerieMinTier`) - alle sechs öffnen bei 17,
 * alle sechs tragen `minTier: 2`.
 *
 * --- DAS BUDGET (am Objekt gemessen, n=17) --------------------------------
 *
 * Frei: a d e f h i j k l n o r s t u. Gesperrt: b c g m p q v w x y z.
 *
 * WAS TRÄGT - der Arbeitsvorrat für die nächste Charge:
 *  - Gerüst: the, this, that, these, those, there, then, than, he, she, her,
 *    his, it, its, is, are, has, had, at, an, and, in, on, into, onto, out,
 *    out of, of, to, no, not, none, nor, or, so, also, if, as, all, still,
 *    until, under, us, our, other, another, alone, at last, at first, later.
 *  - Modalität: has to (statt must), needs to, is free to, tries to, starts
 *    to, lets, let, should (frei!), does not, did not, is not.
 *  - Vergangenheit: regelmäßig auf -ed, solange der Stamm passt - lifted,
 *    listened, folded, halted, asked, handed, landed, started, settled,
 *    drifted, shifted, rested, hosted, tasted, headed, solders/soldered.
 *    Stark: held, told, sold, stood, took, heard, read, let, felt, left,
 *    lost, sent, sat, set, ran, found, shut. Erzählt wird trotzdem im simple
 *    present: ohne was/were gibt es keine Vergangenheit von to be.
 *  - Erstaunlich modernes Wortfeld: drone, radio, aerial, headset, handset,
 *    studio, station, satellite, astronaut, sensor, data, online, link, solar,
 *    lantern, kestrel, heron, tern, thread (für den Nachrichtenfaden im Haus),
 *    landlord, tenant, attendant, tutor, tiler, kit, solder, shriek.
 *  - Namen aus dem freien Bestand, die im englischen Regal noch nicht standen:
 *    Aidan, Sofie, Nella, Hanni, Efe, Josefine, Farid, Rahel, Odin, Leia,
 *    Ares, Louis.
 *  - ORTE, und warum sie so heißen: die Schule der Serien 1 und 3 ist **Field
 *    Hall** (beide spielen bewusst im selben Haus, mit demselben Kopf und
 *    demselben Hausmeister), Serie 4 steht an der **Isle Road**, Serie 5 an
 *    der **Hill Hall**, Serie 6 in der **Fern Street**. Frei wären außerdem
 *    Kestrel Lane, North Hall, Old Fort Road, Astrid Hall. **Alder ist
 *    verbrannt**: `serienEnSprosse16.ts` hat neun Erlen und eine Serie namens
 *    »The Line at the Alder« - der erste Entwurf dieser Datei hieß Alder Hall
 *    und Alder Street und musste in der Abnahme umbenannt werden.
 *    Achtung: *Larch* trägt ein c und geht NICHT.
 *
 * --- WAS FEHLTE UND WAS STATTDESSEN TRUG (die Merkliste dieser Charge) ----
 *
 * Das ist der Abschnitt, der Arbeit spart. Alles hier ist beim Schreiben
 * angefallen, nicht hinterher erinnert.
 *
 *  - kein b: kein but, be, been, back, about, book(!), box, boy, bike, big,
 *    number, remember. Der Gegensatz von *but* steht als Doppelpunkt, als
 *    Bindestrich oder als zweiter Satz. **book** war der teuerste Ausfall in
 *    »One In, One Out«: ein Tauschregal ohne Bücher. Es trägt stattdessen
 *    alles, was ein Haus sonst weiterreicht - a jar of seeds, a doll, a
 *    lantern, a kettle, a fan, roller skates, a tool kit.
 *  - kein c: kein can, come, each, such, school(!), class(!), children(!),
 *    teacher(!), clock, cold, torch, second(!), office, chance. Vier
 *    Ersatzformen, die sich bewährt haben: **school -> the hall** (die Schule
 *    heißt hier »Field Hall« bzw. »Fern Street« und wird nie benannt),
 *    **class -> the lesson / the others**, **teacher -> the tutor / the head**,
 *    **children -> the little ones**. Und: es gibt KEINE Sekunde. Zeitspannen
 *    unter einer Stunde heißen *an instant*, *a full hour*, *half an hour*.
 *    Auch **torch** hängt am c - das Licht in der Hand ist *a lantern*.
 *  - kein g: keine einzige -ing-Form, kein light, night, again, get, go,
 *    give, girl, garden, gate, egg(!), enough(!), nothing, anything,
 *    something, morning, evening, together, edge. Drei Folgen: (a) alles steht
 *    im simple present; (b) *no ladder is that tall* statt *tall enough*;
 *    (c) im Nest der Serie »The Kestrel on the Flat Roof« liegen keine Eier,
 *    sondern *four little ones*.
 *  - kein m: kein him, them, me, my, man, mum, some, come, home, name, time,
 *    from, more, most, make, small, room, team. Personen werden darum
 *    konsequent beim NAMEN genannt (*the tutor tells Louis*, nie *tells him*),
 *    eine Gruppe heißt *the others*, *all four*, *the rest*, und *from* wird
 *    zu *out of*. Das hat die Figuren schärfer gemacht, nicht ärmer.
 *  - kein p: kein up, open, help(!), keep, people, part, place, phone(!),
 *    top, step, stop, plant(!), play, print, path, sport, pair. **help** wird
 *    zu *it is no use* oder zum Doppelobjekt-Bau; **phone** zu *the handset*;
 *    **top floor** zu *the fourth floor*; und weil man nichts *pflanzen* kann,
 *    werden in diesen Serien Dinge *gesetzt* (*he sets it in stone and sand*).
 *  - kein v: kein have, give, over, never, ever, even, seven, five, leave(!),
 *    live, love, drive, driver, river(!). Zwei teure Fallen, die man erst
 *    beim Messen sieht: **leave** ist gesperrt (*the little ones are free of
 *    the nest* statt *leave the nest*) und **river** ebenfalls - fließendes
 *    Wasser heißt hier gar nicht vor, es gibt nur *the sea*, *the drain*,
 *    *the rain*. *has* und *had* tragen, *have* nicht.
 *  - kein w: kein was, were, we(!), will, with, what, when, where, who(!),
 *    how, know, now(!), down(!), two(!), new(!), news, word(!), work, water,
 *    walk, wall, show, snow, answer. Vier davon formen jede Seite:
 *    (a) **we** fehlt - es wird durchgehend in der dritten Person erzählt,
 *    *our* und *us* tragen dagegen; (b) **who** fehlt - man kann nicht fragen,
 *    WER etwas hingestellt hat; die Frage lautet *is this kit for the shelf?*;
 *    (c) **now** und **down** fehlen - *at this hour*, *then*, *to the floor*,
 *    *he is on the road in an instant*; (d) **two** fehlt, gezählt wird
 *    *one, three, four, nine, ten, thirteen, fourteen, hundred, thousand*.
 *  - kein y: kein you, they, day, year, my, by, very, only, any, easy, ready,
 *    story(!), family(!), key(!), try(!), yes, sky(!) - und kein Wochentag und
 *    kein einziges Adverb auf -ly. Merke: *tries* und *tried* sind frei, nur
 *    *try* selbst nicht. Ersatz: **key -> es gibt kein Schloss** (der Kopf
 *    einer Schule lässt einen Raum *stand free*), **sky -> the dark, the
 *    stars, the north**, **family -> her dad, her nan, the tenants**,
 *    **story -> the tale**.
 *  - DIE ZWÖLF STELLEN, an denen die MESSUNG rot war und der Ersatz erst
 *    danach gefunden wurde - genau die Wörter, die man beim Schreiben nicht
 *    als gesperrt in Erinnerung hat:
 *      call, calls (c)   -> he shouts out · a hard, fast shriek
 *      ranger (g)        -> an old hand at the nature trust
 *      alarm (m)         -> she sets her handset to sound at ten to nine
 *      thing (g)         -> one is odd · the first of it
 *      name, names (m)   -> all three astronauts and their lands
 *      number (b und m)  -> a tenant in the far flats
 *      reach (c)         -> the hall data does not run to the flats
 *      own (w)           -> her data line
 *      table (b)         -> the desk
 *      right (g)         -> to the far end
 *      ever (v)          -> louder than at first
 *      otherwise (w)     -> no one holds that unfair
 *      where (w)         -> tells the site hand of the nest at the north drain
 *      stick, sticks (c) -> old feathers (das Turmfalken-Nest ist ohnehin
 *                           kein Bau, sondern eine Mulde im Dachkies)
 *      ranger, warden, naturalist (g, w, zu groß für Achtjährige)
 *                        -> an old hand at the nature trust
 *      open (p)          -> die Tür *stands free*, die Türen *slide*, der Zug
 *                           *lets her out* - dreimal dasselbe Bild wird zum
 *                           Tick, darum je Serie höchstens einmal
 *  - ZEIT ist das zweite große Loch: kein day, night, week, month, year, kein
 *    Wochentag, kein morning/evening, kein tomorrow, keine Sekunde. Was
 *    bleibt: *noon, afternoon, hour, half an hour, season, dusk, the dark, at
 *    ten to nine, at half three, at half ten*. Der brauchbarste Fund der
 *    Charge: **the dark after that** = die nächste Nacht. »The Station at Ten
 *    to Nine« misst ihre ganze Zeit so.
 *
 * --- DIE SECHS SERIEN -----------------------------------------------------
 *
 *  1. The Kestrel on the Flat Roof  - kids, tiere. Eine Drohne soll das flache
 *     Dach vor den Solarziegeln ansehen und wird von einem Turmfalken
 *     angegriffen. Sofie findet das Nest im Standbild, Aidan hält den Termin
 *     der Dachdecker auf, und die beiden sagen dem Hausmeister, wo er in der
 *     Dämmerung NICHT hinfassen darf - er führt aus, was die Kinder
 *     herausgefunden haben.
 *  2. The Train to Nan              - kids, alltag. Nella fährt zum ersten Mal
 *     allein mit dem Zug; ein Baum auf der Strecke wirft den ganzen Plan um.
 *  3. The Noon Radio                - kids, technik. Zwei Kinder senden mittags
 *     aus der alten Abstellkammer - und hören eines Tages aus den Wohnungen
 *     gegenüber zurück.
 *  4. One In, One Out               - kids + teens, alltag. Ein Tauschregal im
 *     Treppenhaus, ein Werkzeugkasten ohne Besitzer und ein Vermieter, der auf
 *     den Fluchtweg pocht.
 *  5. The Station at Ten to Nine    - kids + teens, weltall. Die Raumstation
 *     zieht über das Dach; beim dritten Anlauf stehen dreizehn im Feld, und
 *     aus vierhundert Kilometern kommt eine Antwort.
 *  6. The Heat in the Hall          - kids + teens, technik. Drei Sensoren
 *     messen, was alle spüren: der Südsaal wird nach Mittag unerträglich - und
 *     im Lager liegt ein altes Sonnensegel.
 *
 * --- FORM UND RECHTE (wie im ganzen englischen Bestand) -------------------
 *
 * Selbst verfasst, britisches Englisch, KEINE Apostrophe (der Genitiv läuft
 * über *of* oder über zusammengesetzte Nomen), wörtliche Rede OHNE
 * Anführungszeichen, keine Ziffern, jede Zeile EIN Satz, 4 Etappen à 12
 * Zeilen, nur der einfache Bindestrich.
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
// kids - Drohne, Flachdach, Turmfalke. Ohne g gibt es keine Eier und keine
// -ing-Form; ohne v kann niemand das Nest *verlassen*, die Jungen sind *free
// of the nest*. Das Licht in der Hand ist eine *lantern*, denn *torch* haengt
// am c.
// ---------------------------------------------------------------------------
const THE_KESTREL_ON_THE_FLAT_ROOF: Serie = {
  slug: "en-i4-the-kestrel-on-the-flat-roof",
  titel: "The Kestrel on the Flat Roof",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Field Hall is old, and its roof is flat as a floor.",
        "Solar tiles are to sit there at the end of the season.",
        "First the roof needs a look, and no ladder is that tall.",
        "So the head lets Aidan and Sofie take out the drone.",
        "Aidan holds the drone and Sofie holds the handset.",
        "The drone lifts, thin and loud, and it turns north.",
        "On the handset the flat roof slides into the shot.",
        "There is a drain, a rusted rail and a dark tin sheet.",
        "Then the shot tilts hard to the left.",
        "The drone shudders and the data line runs red.",
        "For an instant there are talons in the shot.",
        "Then the shot ends and the drone is not in the air.",
      ],
    },
    {
      lines: [
        "The drone is on the roof, on the far north side.",
        "The head does not let one foot onto that roof.",
        "The site hand has the tall ladder in his shed.",
        "He sets it at the north side and holds it fast.",
        "He takes the ladder one rail after another.",
        "At the last rail he halts and does not talk.",
        "Then he shouts out: there is a nest here, and it is not old.",
        "In the nest there are four little ones, all still.",
        "The nest sits in the dust at the north drain.",
        "The drone lies at its side and it does not stir.",
        "Then, at his head, there is a hard, fast shriek.",
        "He is on the road in an instant, and the drone stands there.",
      ],
    },
    {
      lines: [
        "Sofie reads online and finds the still shot of the talons.",
        "It is not a rook and it is not a heron.",
        "The head sends the shot to an old hand at the nature trust.",
        "She is at the hall doors in the afternoon, in old, hard shoes.",
        "She takes one look and tells the others: it is a kestrel.",
        "Kestrels hold to old halls and flat roofs here.",
        "The four little ones are thin and not old at all.",
        "Until the little ones are free of the nest, the roof stands.",
        "The head asks Sofie and Aidan: and the tilers, then?",
        "Aidan asks the old hand of the drone out there on the roof.",
        "She tells Aidan of one hour at dusk, and one hour alone.",
        "At dusk the kestrel hunts the field, and the roof is free.",
      ],
    },
    {
      lines: [
        "It is Sofie that finds the nest, four shots after the talons.",
        "In that shot the drain holds old feathers and one dark head.",
        "Aidan reads the site sheet and finds the date of the solar tiles.",
        "He tells the head that the tilers are here in ten afternoons.",
        "The head lets Aidan send the tilers a line, and he sends it.",
        "The tilers send Aidan one line: the roof holds until the heat ends.",
        "Then Sofie tells the site hand of the nest at the north drain.",
        "She holds the shot out: the drone lies a foot to the south of it.",
        "Her line is short and hard: no hand into that drain at all.",
        "At dusk he takes the rails, and Aidan holds the lantern at the foot.",
        "The drone lands in the hands of Sofie, dented and one rotor short.",
        "On the north rail four little ones sit, and not one is still.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// kids - erste Zugfahrt allein. Ohne c kein *ticket* (es heisst *the fare*),
// ohne v kein *driver* (es heisst *the staff at the front*), ohne w kein
// *down*, kein *now* und kein *two*. Die Grossmutter ist *her nan* - *grandma*
// haengt gleich an zwei gesperrten Buchstaben.
// ---------------------------------------------------------------------------
const THE_TRAIN_TO_NAN: Serie = {
  slug: "en-i4-the-train-to-nan",
  titel: "The Train to Nan",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Nella is nine, and this is her first ride alone.",
        "The train to Northolt is in at the north end.",
        "Her dad hands her the fare and a tin of food.",
        "He tells her: it is the third halt, and not one earlier.",
        "Nella finds seat thirteen and sets the tin at her feet.",
        "The doors shut, and her dad stands out on the stones.",
        "Then the station slides off to the north.",
        "Nella folds the fare into her hand and does not let it fall.",
        "The land outside is flat, and the rain starts.",
        "At the first halt an elder sits at her side and nods.",
        "After that halt the train slides on and then it holds still.",
        "It stands in the fields, and there is no station here.",
      ],
    },
    {
      lines: [
        "The train stands there for a full hour.",
        "There is not a sound out of the front, and the fans are off.",
        "The elder at her side tells Nella that a tree is on the line.",
        "Nella asks her: is the third halt near?",
        "The elder tells her: no, the third halt is far off.",
        "Then the train runs at last - not on, and not fast.",
        "It slides into the station it had just left.",
        "The doors slide and all the others stand out in the rain.",
        "An attendant in a red tie holds a sheet and reads it out.",
        "There is another train, and it is not the one on her fare.",
        "The elder finds her son at the doors and is off to the road.",
        "Nella stands alone at the sheet, and the other train is in.",
      ],
    },
    {
      lines: [
        "Nella takes out her handset and sends her nan a line.",
        "The line does not send: out here there is no data at all.",
        "So Nella asks the attendant in the red tie, and he kneels.",
        "He reads the fare and tells Nella: this train has that halt.",
        "He sets her at the front and tells the staff to look out.",
        "The train fills fast, and Nella has no seat.",
        "She stands at the door rail and holds the tin at her side.",
        "At the first halt three of the others are out, and she sits.",
        "Later the data is there, and her line to her nan sends.",
        "Her nan sends one line: at the tea stall, and all is fine.",
        "Nella reads that line until the halt after that.",
        "Then the train slides into a station that is not Northolt.",
      ],
    },
    {
      lines: [
        "The station is Talford, and it is not on her fare at all.",
        "Half the train is out there in one hard rush.",
        "Nella stands too, and then the front staff holds a hand out.",
        "He tells her that Northolt is the halt after this one.",
        "So Nella sits, and the doors shut, and the train runs.",
        "The rain is off, and the fields shine, hard and red.",
        "Then there it is: Northolt, in tall iron letters.",
        "The train lets Nella out into the noise of the station.",
        "At the tea stall her nan stands in her old red hat.",
        "Hanni holds out her hands and Nella runs the last of it.",
        "Her nan asks her: an hour late, and all alone at Talford?",
        "Nella tells her nan: the tin of food held out, and so did I.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// kids - Radio in der Mittagspause. Ohne p keine *speakers*: der Ton laeuft
// ueber die alten *hall horns* unter dem Dach, und die Nachbarschaft hoert
// mit. Ohne c gibt es kein Schloss und keinen Schluessel - der Kopf der Schule
// laesst die Tuer schlicht *stand free*.
// ---------------------------------------------------------------------------
const THE_NOON_RADIO: Serie = {
  slug: "en-i4-the-noon-radio",
  titel: "The Noon Radio",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Field Hall has an old store at the north end.",
        "In it there are three stools, a desk and a lot of dust.",
        "Efe asks the head for the store, and the head lets her in.",
        "Josefine finds an old lead that runs to the hall horns.",
        "The horns sit under the roof and are older than the head.",
        "Efe holds the headset and Josefine holds the sound dial.",
        "At ten to noon Efe reads out her first three lines.",
        "In the hall there is no sound at all.",
        "The horns hold still, and the lesson doors stand shut.",
        "Josefine turns the dial to the left and then to the far end.",
        "There is a hiss, and then not one sound after that.",
        "Efe kneels and finds that the lead ends in dust and air.",
      ],
    },
    {
      lines: [
        "The lead is old and the last foot of it is not there.",
        "Josefine hunts out a rail of thin leads in the site shed.",
        "The site hand solders the ends and lets the joint set.",
        "At noon the horns hiss, and then Efe is in the hall, loud.",
        "The little ones look at the roof and hold still.",
        "Efe reads the food list, and the hall is full of noise.",
        "Then Josefine reads a line that a lad in the north hall sends.",
        "The line asks for a tune, and Efe has that tune at hand.",
        "The hall is full of feet and the tune runs to the end.",
        "The head stands at the store door and does not talk.",
        "Then the head asks: this hour, at noon, until the season ends?",
        "That afternoon a line lands that is not out of the hall.",
      ],
    },
    {
      lines: [
        "The line is out of the flats at the far side of the road.",
        "It reads: the horns are loud, and the tune is not.",
        "Efe reads it out at noon, and the hall is louder than at first.",
        "After that the lines land in tens, out of the road and the flats.",
        "One is out of a tenant in the far flats, and it is not short.",
        "She tells Efe and Josefine that she sits at her door at noon.",
        "Her old radio is dead, and the hall horns are all she hears.",
        "Josefine reads that line out and then the hall is silent.",
        "The head hears it at the far end of the hall and nods.",
        "Then a note out of the site hand lands on the store door.",
        "It reads: the horns are old, and the rail under is rotten.",
        "At the end of the season he is to take the horns off the roof.",
      ],
    },
    {
      lines: [
        "Efe finds an old handset in a tin at the end of the store.",
        "Josefine sets the noon radio online, and the link holds.",
        "The hall data does not run to the flats at the far side.",
        "So the son of the tenant sets the handset on her data line.",
        "At noon it sits at her door and it holds the noon radio.",
        "The tenant sends in a line, afternoon after afternoon.",
        "Efe reads one out at noon: it asks for an old sea tune.",
        "In the last afternoon of the season the site hand is on the roof.",
        "The three horns are off and out of there in an hour.",
        "At noon the hall is silent and the little ones look at the roof.",
        "Then the handsets are out on all the desks, and the tune runs.",
        "In the far flats a door stands free, and the road hears it too.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// kids + teens - Tauschregal im Treppenhaus. Ohne b gibt es KEIN einziges
// Buch - das Regal traegt darum Werkzeug, Saatgut, eine Lampe, Rollschuhe.
// Ohne w kann niemand fragen, WER etwas hingestellt hat; die Frage lautet
// *is this kit for the shelf?*. Der Nachrichtenfaden des Hauses heisst
// *the stair thread*.
// ---------------------------------------------------------------------------
const ONE_IN_ONE_OUT: Serie = {
  slug: "en-i4-one-in-one-out",
  titel: "One In, One Out",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "There are nine flats at Isle Road, and one stair for all.",
        "At the foot of the stair stands an old, dead radiator.",
        "Rahel sets a red shelf onto it, and Farid holds it fast.",
        "The shelf is out of the old store at the north door.",
        "On it Rahel sets a note in tall letters: one in, one out.",
        "Farid sets the first of it there: a tin of nails, half full.",
        "Rahel sets a jar of seeds and a red doll at its side.",
        "In an hour the tin of nails is out and a lantern is in.",
        "There is a stair thread online, and the shelf is in it at noon.",
        "The tenant at flat three asks: is that shelf for all of us?",
        "Rahel sends one line: one in, one out - and no one sells here.",
        "In the afternoon after that the shelf is full - and one is odd.",
      ],
    },
    {
      lines: [
        "It is a full tool kit: three files, a hand drill and a rule.",
        "The kit is not old and not one tool is out of it.",
        "Farid asks the stair thread: is this kit for the shelf?",
        "No one sends a line, not that afternoon and not the one after.",
        "So the kit holds there, and it holds, and it holds.",
        "In the end Odin at the fourth floor takes it in his hands.",
        "Odin is old, and he had a shed full of tools until he sold it.",
        "He tells Farid that the kit is fine and not one file is dull.",
        "Then he sets a note on the shelf, in thin, hard letters.",
        "It reads: it does not run - the fourth floor, at the left.",
        "In three afternoons there is a fan, a kettle and three radios.",
        "Then, at the foot of the stair, a note lands on the shelf itself.",
      ],
    },
    {
      lines: [
        "The note is not out of a tenant: it is out of the landlord.",
        "It reads that the stair is the one route out, and it holds free.",
        "A shelf, a radiator and four tool tins are not to stand there.",
        "In the stair thread the lines land fast, and not all are kind.",
        "Farid reads the note and does not talk until the afternoon ends.",
        "Rahel finds the fire rule online, and the rule is not false.",
        "In a fire that stair is the one route out of nine flats.",
        "So the shelf is off the stair, and no one holds that unfair.",
        "Odin reads the thread and sends one line: the north door store.",
        "That store holds three old sleds and a lot of dust.",
        "It is off the fire route, and it has a door onto the road.",
        "Rahel asks the landlord in one line - and no line lands.",
      ],
    },
    {
      lines: [
        "For three afternoons the landlord holds still.",
        "The shelf stands in the hall of their flat and holds all of it.",
        "Then, at last, the landlord is at the north door of the house.",
        "He looks at the store, at the sleds and at the dust.",
        "He asks Odin: this store, in order, and no tins on the stair?",
        "Odin nods, and Rahel tells the landlord that the route holds free.",
        "The store door stands free at the end of that afternoon.",
        "The shelf is in there, and the radiator holds it, red and tall.",
        "Odin sets the tool kit on the last shelf, and it holds there.",
        "On the door there is a list, in the hard letters of Farid.",
        "It reads: one in, one out - and the tools hold here.",
        "The stair holds no shelf at all, and the store door is not shut.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// kids + teens - die Raumstation ueber dem Dach. Ohne c gibt es keine
// Sekunde, ohne y keinen *sky*: der Himmel heisst *the dark*, *the stars*,
// *the north*. Der brauchbarste Fund der Charge steht hier - *the dark after
// that* = die naechste Nacht, denn *tomorrow* und *night* sind gesperrt.
// ---------------------------------------------------------------------------
const THE_STATION_AT_TEN_TO_NINE: Serie = {
  slug: "en-i4-the-station-at-ten-to-nine",
  titel: "The Station at Ten to Nine",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 2,
  topic: "weltall",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The station is out there, and it is not one of the stars.",
        "It runs at the far side of the air, on and on and on.",
        "It holds astronauts, and it does not stand still at all.",
        "In one hour and a half it runs all the earth.",
        "Ares reads that online and tells Leia at the hall doors.",
        "At ten to nine, he tells her, it slides north of the roof.",
        "Leia sets her handset to sound at ten to nine.",
        "At ten to nine there is rain on the road and rain in the air.",
        "The stars are not out and the roofs shine, dull and hard.",
        "Ares stands at his door in a hood and holds the handset.",
        "Not one thin line of it is there, not in a full hour.",
        "The list online holds another turn - one dark after this one.",
      ],
    },
    {
      lines: [
        "In the dark after that the air is hard and the stars are out.",
        "Leia stands in the field north of the hall, alone at first.",
        "Then Ares is there, and he holds a flask of hot tea.",
        "At ten to nine the north is still, and it is all dark.",
        "Then a still, hard star slides out of the dark.",
        "It does not flash and it does not turn at all.",
        "It holds one line, and it does not falter.",
        "In an instant it is at the roof of the hall, then off it.",
        "It runs into the dark side of the earth, and then it is out.",
        "Leia and Ares stand there, and no one talks.",
        "Ares tells Leia that the astronauts see the sun at that hour.",
        "Then Leia asks Ares: does one of the three read our lines?",
      ],
    },
    {
      lines: [
        "The list online holds all the astronauts and their lands.",
        "One is Finnish, one is Irish, one other is out of Toronto.",
        "These three send lines and shots out of the station, often.",
        "Ares sends one line: at ten to nine, north of Hill Hall.",
        "He tells the station of the field, the frost and the flask.",
        "Then he does not look at his handset for a full afternoon.",
        "Leia holds the list and finds the turn for the dark after that.",
        "That turn is late, at half ten, and it is a short one.",
        "The head hears of it and lets the north field stand free.",
        "So thirteen stand out there, all in hats and hoods.",
        "The frost is hard and the flask holds out until the last.",
        "At half ten the north holds still - and then it does not.",
      ],
    },
    {
      lines: [
        "The station slides out of the north, hard and still.",
        "Thirteen hands are out, and no one talks at all.",
        "It runs south of the roof and it is out at the tree line.",
        "Ares holds a still shot of it: one thin line in the dark.",
        "He sends the shot online, to the station and to the list.",
        "In the dark after that there is a line on his handset.",
        "It is out of the Irish astronaut, and it holds three lines.",
        "She tells the hall of the dark earth under the station.",
        "She tells of a thin red line at the end of the dark: the sun.",
        "The last line reads: the field north of Hill Hall - I look for it.",
        "Leia reads it out at noon, and the hall stands still.",
        "At ten to nine the north field is full, and no one is late.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// kids + teens - Hitze im Klassenraum, gemessen statt behauptet. Ohne g gibt
// es keine *degrees*: die Sensoren liefern LINIEN, keine Zahlen - *the red
// line rises after noon*. Ohne c kein *concrete*: der Fuss des Segels sitzt
// *in stone and hard sand*.
// ---------------------------------------------------------------------------
const THE_HEAT_IN_THE_HALL: Serie = {
  slug: "en-i4-the-heat-in-the-hall",
  titel: "The Heat in the Hall",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The south hall at Fern Street holds the sun all afternoon.",
        "Its roof is dark and there is not one tree at that side.",
        "After noon the air in there is hot and thin and dull.",
        "Louis sits at the far end, and the lesson does not hold in his head.",
        "The tutor holds the doors free, and it is no use at all.",
        "In the last lesson not one hand is in the air.",
        "Louis asks the tutor if the heat is real or if it is in his head.",
        "The tutor tells Louis that the north hall is not like this.",
        "So Louis asks the head for three heat sensors.",
        "The head lets it stand, and the site hand finds four old ones.",
        "One sits in the south hall, one in the north, one at the door.",
        "The sensors send data all the season - and the data is odd.",
      ],
    },
    {
      lines: [
        "The data of the south hall rises fast after ten to noon.",
        "It holds that line until the afternoon is at its end.",
        "The north hall data holds flat, and it is not near it.",
        "Out at the door the data falls off after four.",
        "The stones and the tin roof hold the heat until late.",
        "Louis sets all three lines onto one sheet.",
        "The red line is the south hall, and it stands out at first look.",
        "The head reads the sheet at her desk and does not talk.",
        "Then she asks Louis: this is one season, and the one after?",
        "So the sensors hold there and the data runs on.",
        "The head tells Louis that there is no fund for a sun sail.",
        "Then the site hand looks at the sheet and asks Louis for half three.",
      ],
    },
    {
      lines: [
        "At half three the store at the north door stands free.",
        "In it there are three sails, folded and full of dust.",
        "The sails are out of the old street fete, three seasons off.",
        "One is red, one has a hole and one is fine and tall.",
        "The site hand tells Louis that a sail needs four hard holds.",
        "There is one hold at the roof rail and one at the tall tree.",
        "The other holds are not there at all.",
        "So Louis finds three iron stall stands at the far shed.",
        "The site hand sets one in stone and hard sand at the south side.",
        "It holds, and it does not tilt at all.",
        "At the end of that afternoon the red sail stands out, tall and full.",
        "Then, after dark, the rain lands hard and the air tears at the roof.",
      ],
    },
    {
      lines: [
        "At ten to nine Louis is out at the south side of the hall.",
        "The sail is not there: it is out in the field, at the tree line.",
        "One iron stand is out of the sand and it holds a foot of stone.",
        "The site hand does not talk: he hauls the sail in and folds it.",
        "Then he tells Louis of a knot that holds and one that does not.",
        "This turn all four holds sit in stone, and the ties are steel.",
        "The sail stands out in the rain and in the hard air, and it holds.",
        "The data does not lie: the red line does not rise as hard.",
        "After noon the south hall is duller and the air is not thin.",
        "The head reads the sheet and asks for one out of the season after.",
        "So the sensors hold there, all four, and the data runs on.",
        "In the last lesson the red sail sets a red shade onto the floor.",
      ],
    },
  ],
};

/** Die sechs Serien der Charge I4 für die Sprosse 17 (kids und teens). */
export const SERIEN_EN_I4_SPROSSE17_KINDER: Serie[] = [
  THE_KESTREL_ON_THE_FLAT_ROOF,
  THE_TRAIN_TO_NAN,
  THE_NOON_RADIO,
  ONE_IN_ONE_OUT,
  THE_STATION_AT_TEN_TO_NINE,
  THE_HEAT_IN_THE_HALL,
];
