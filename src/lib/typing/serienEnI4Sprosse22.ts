/**
 * ENGLISCHE SERIEN FÜR DIE SPROSSE 22 der neuen Buchstabenfolge
 * (Charge I4, 28.08.2026).
 *
 * ── WARUM ES DIESE DATEI GIBT ─────────────────────────────────────────────
 *
 * Gemessen am 28.08. mit `npx tsx scripts/_i4regal.mts --lang en`, nachdem
 * die Charge I4 ihre ersten neunzehn Serien abgelegt hatte (Grundmenge 151
 * Serien / 7368 Zeilen, davon englisch 51 Serien / 2532 Zeilen), gelesen über
 * die Öffnungspunkte 13 / 17 / 20 / 22 / 26 / 31 / 99 Einheiten:
 *
 *   en/kids       [ 0, 11, 14, 17, 19, 22, 22]
 *   en/teens      [ 0, 11, 14, 16, 17, 24, 24]
 *   en/erwachsen  [ 0,  7, 10, 11, 12, 17, 17]
 *
 * Die Sprossen 17 und 20 waren an diesem Tag also gut versorgt; die Sprosse
 * 22 hatte VIER Serien, und alle vier stammen aus dem Altbestand
 * (`serienEnFrueh.ts`). Genau dort setzt diese Datei an: fünf Serien, alle
 * fünf GEMESSEN bei genau 22. Keine davon fällt auf 20 zurück - jede trägt
 * mindestens ein `w` und mindestens ein `b`, und das ist Absicht: wer auf
 * dieser Sprosse bei 20 landet, doppelt `serienEnI4Sprosse20.ts` und
 * verschenkt die beiden Buchstaben, für die es diese Datei gibt.
 *
 * (Zur Reihenfolge: Einheit 21 ist das `b`, Einheit 22 das `w`. Eine Serie
 * ohne `w` öffnete bei 21. Alle fünf hier öffnen bei 22.)
 *
 * ── DAS BUDGET (am Objekt gemessen, nicht zitiert) ────────────────────────
 *
 * Frei: **a b c d e f g h i j k l m n o r s t u w** (20).
 * Gesperrt: **p q v x y z** (und ä ö ü ß, für Englisch ohnehin tot).
 *
 * ── WAS DIE SPROSSE 22 GEGENÜBER 20 NEU BRINGT ───────────────────────────
 *
 *  • **w - und damit ZUM ERSTEN MAL IN DIESER GANZEN CHARGE DIE
 *    VERGANGENHEIT VON `to be`.** *was* und *were* sind da. Auf 17 und 20
 *    musste jede Rückblende über *has/had* + Partizip laufen; hier kann eine
 *    Geschichte endlich schlicht erzählen: *It was nineteen winters back, and
 *    it was raining hard.* Das ändert den Ton mehr als jedes Substantiv.
 *    Dazu: *with, without, within, between, below, wide, what, when, where,
 *    which, who, whose, how, we(!), us, our, now, know, want, well, work,
 *    week, weekend, world, word, water, weather, wind, winter, window, wall,
 *    warm, wet, west, walk, watch, wash, wait, wake, wooden, wheel, white,
 *    brown, snow, down(!), own, two(!), new, answer, allow, follow, show,
 *    low, slow, swim, throw, would, will, went, saw, write, wrote, written,
 *    wrong, knew, grew, threw, drew(!), draw, drawn*.
 *    - **`we`, `us`, `our` gibt es zum ersten Mal** - ein Wir ist sagbar.
 *      `they` bleibt gesperrt (y); `them` und `their` waren schon frei.
 *    - **`draw/drew/drawn` sind zurück**: gezeichnet werden darf wieder.
 *    - **`two` ist zurück** - das Paar muss nicht mehr umschrieben werden.
 *  • **b - die Gegenrede und der Grund.** *but* und *because* fehlten auf
 *    ALLEN früheren Sprossen; ein Text ohne sie argumentiert nicht, er
 *    behauptet nur. Dazu *be, been, being, back, about, before, best,
 *    better, big, book, both, brother, bread, bridge, build, built, bus,
 *    boat, bike, born, break, bring, brick, bench, board, boiler, bowl,
 *    branch, table, number, remember, October, December, neighbour(!),
 *    harbour(!)*.
 *    - **`be` bringt Passiv und Infinitiv zurück**: *has to be booked*,
 *      *is not shut*. Auf 17 und 20 stand alles zwingend aktiv.
 *    - **`harbour` ist geheilt** - der Kopf der Sprosse 20 nennt es den
 *      teuersten Einzelverlust der Charge. Ebenso **`neighbour`** und
 *      **`table`**.
 *
 * ── WAS FEHLTE UND WAS STATTDESSEN TRUG ──────────────────────────────────
 *
 * Beim Schreiben Zeile für Zeile mitgeschrieben. Alles mit (!) hat das
 * Messskript gefunden, nicht das Auge - das sind die teuren.
 *
 *  • **kein y - weiterhin der teuerste Posten.** Kein *you, your, they, day,
 *    year, any, many, only, very, my, say, way, may, young, early, ready,
 *    city, story, family, money, easy, busy, happy, angry, hungry, key, eye,
 *    boy, yellow, yard, yet, beyond, everybody, anything, nobody(!),
 *    always(!), grey(!), dry, lorry, memory(!), empty(!)* -
 *    und **kein Wochentag** und **kein einziges Adverb auf -ly**.
 *    - ⚠️ **Der Auftragszettel führt `by` unter den freien b-Wörtern. `by`
 *      trägt ein y und ist gesperrt.** Damit fallen auch *side by side, one
 *      by one, stood by, nearby, by then* weg. Ersatz: *under one another,
 *      one after another, at that hour*. Ebenso irrtümlich als frei geführt:
 *      **`body`** (y) und **`problem`** (p).
 *    - **Es gibt keine zweite Person.** Kein *you*, kein *your*: jede
 *      wörtliche Rede ist indirekt oder nennt den Namen. In dieser Datei
 *      kommt kein einziger Anführungssatz vor, und keine Zeile leidet.
 *    - **Die y-Falle sitzt UNGLEICHMÄSSIG in den Flexionsformen** - das ist
 *      der nützlichste Fund dieser Datei:
 *        *dry* gesperrt, aber *dries, dried, drier* frei ·
 *        *carry* gesperrt, aber *carried, carries* frei ·
 *        *say/says* gesperrt, aber **`said` frei** ·
 *        *lay/lays(!)* gesperrt, aber *laid* frei ·
 *        *stay/stays(!)* gesperrt ⇒ *stands, holds* ·
 *        *ninety/eighty* gesperrt, aber **`nineties`/`eighties` frei** -
 *        darum ist Alma Hollis *in her nineties* und Tomas *in his eighties*.
 *      **Alle Zehner auf -ty sind tot** (twenty bis ninety); frei bleiben
 *      one, two, three, four, eight, nine, ten, thirteen, fourteen, fifteen,
 *      eighteen, nineteen, hundred, thousand, million und die Ordinalzahlen
 *      first, second, third, fourth, eighth, ninth, tenth. Gesperrt: five,
 *      six, seven, eleven, twelve, dozen, zero.
 *    - **Kein Wochentag, aber `the weekend` ist frei.** Zeit läuft hier über
 *      *the morning, the afternoon, noon, the night, midnight, dawn, dusk,
 *      the hour, the week, the weekend, the month, the season, the winter*.
 *      Monate frei: **March, June, August, October, December**. Gesperrt:
 *      January, February, May, July (y), April, September (p), November (v!
 *      - der Auftragszettel führt es als frei).
 *  • **kein p - und die Asymmetrie zu `down` formt jede Bewegung.** Kein
 *    *up(!), open(!), help, keep, hope, stop, top, part, place, people,
 *    paper, post(!), please, point, put, pass, step, sleep, deep(!),
 *    drip(!), drop(!), split(!), strip, cup(!), tape(!), plot, crop, spring,
 *    important, problem, possible, temperature(!), lamp, phone*.
 *    - **`down` ist da, `up` nicht.** Alles fährt und fällt herunter, nichts
 *      hinauf: *comes to the head of, sets it on, holds it out*.
 *    - **`open` fehlt, `wide` trägt**: *the glass door hangs wide*.
 *    - **`cup`(!) hat mich den ganzen Schalenkranz des Windmessers gekostet.**
 *      Ein Anemometer hat *cups* - das Wort trägt ein p. Es heißt hier
 *      **three bowls on arms**, und die Bowls drehen sich durch alle vier
 *      Etappen. Ebenso **`tape`**(!) ⇒ *the bands* am Karton.
 *    - **`stop` fehlt - und damit die Bushaltestelle.** Es trägt **the bus
 *      shelter, the stand, the halt**; *the bus halts*, *comes to a stand*.
 *      Das ist britischer als *bus stop* und war ein Gewinn.
 *    - **`drip/drop`(!) fehlen beide**: ein undichtes Dachlicht *lets water
 *      in at one corner*, und wenn es dicht ist, *it goes still*.
 *    - **`temperature`(!) fehlt** ⇒ *degrees, how warm the air is, the heat*.
 *  • **kein v - `has`/`had` bleiben, `have` fehlt.** Kein *have, give, love,
 *    live/lives(!), leave/leaves(!), move/moves/moving(!), over, never,
 *    ever, every, everyone, everything, even, seven, eleven, twelve, five,
 *    van, driver(!), drive, drove(!), river, evening, above, cover/covers(!),
 *    valve, arrive, believe, several, harvest(!), oven/ovens(!), themselves*.
 *    - ⚠️ **`harvest` trägt ein v.** Eine Gartengeschichte ohne das Wort für
 *      Ernte: es trägt **the lifting** (das echte Wort der Gärtnerei fürs
 *      Roden von Bohnen und Zwiebeln) - besser als das Original.
 *    - ⚠️ **`oven` trägt ein v.** In der Bäckerei sind es **the fires**.
 *    - ⚠️ **`moving air` trägt ein v** ⇒ **a cold draught**.
 *    - *leave* ⇒ *heads out, is off, lets it stand*; *over* ⇒ *across, along*;
 *      *evening* ⇒ *the afternoon, at dusk, tonight*; *lives there* ⇒ *is
 *      from there*.
 *  • **kein x, kein z, kein q** - kein *next, six, box, fix, size(!), zone,
 *    dozen, question, quiet, quick*. *next* ⇒ *the one after this*; *quiet*
 *    ⇒ *still, without a sound*; *size*(!) ⇒ *a boiler such as a school hall
 *    takes*; *box* ⇒ **carton**.
 *  • **Fahrzeuge, jetzt fast vollständig:** frei sind *bus, boat, bike,
 *    train, wheel, board, cab, load*. Weiter gesperrt: *lorry* (y), *van,
 *    driver* (v).
 *    - **Es gibt kein Wort für die Person am Steuer.** Es trägt *the one at
 *      the wheel, she takes the wheel, she brings the bus in* - und der
 *      Serientitel »The Last Turn at the Wheel« lebt genau davon.
 *    - ★ **Auf Sprosse 22 gibt es keinen britischen Lastwagen - aber man
 *      braucht auch keinen.** `lorry` (y) und `van` (v) fehlen; das
 *      amerikanische Ersatzwort ist NICHT die Antwort. Frei und britisch
 *      sind: **`tractor`, `trailer`, `wagon`, `coach`** (der Reisebus) und
 *      **`float`** (der Milchwagen); dazu *the cab, the load*. Diese Datei
 *      hatte im ersten Durchgang drei amerikanische Stellen - jetzt sperrt
 *      am Cold Beck *a council tractor and trailer* die Straße, und das
 *      gerettete Buch fährt auf *a wagon* nach Litton und zurück.
 *      **Für ein Fuhrwerk oder einen Bahnwagen ist `wagon` ohnehin das
 *      schönere Wort.**
 *  • **Wetter ist auf dieser Sprosse endlich vollständig:** *weather, water,
 *    wind, snow, frost, ice, rain, hail, sleet, storm, gust, gale, shower,
 *    thunder, cloud, mist, fog, sun, heat, cold, warm, wet, forecast* - alle
 *    frei. Nur *dry* (y) und *damp* (p) fehlen; es heißt *not wet, hard*.
 *  • **Verwandtschaft:** frei sind *mother, father, brother, sister, son,
 *    daughter, aunt, uncle, grandmother, husband, wife, child, children,
 *    woman, man, neighbour*. Gesperrt bleibt **`family`** (y) ⇒ *the
 *    household, her mother and her brother, all four at home*.
 *
 * ── DIE FÜNF SERIEN DIESER DATEI ─────────────────────────────────────────
 *
 *   öffnet | Titel                      | Stufen            | Thema
 *   -------|----------------------------|-------------------|----------
 *     22   | The Weather Roof           | kids              | technik
 *     22   | The Books in the Shelter   | kids, teens       | alltag
 *     22   | Last Winter at the Baths   | teens, erwachsen  | winter
 *     22   | The Last Turn at the Wheel | erwachsen         | arbeit
 *     22   | The Book of First Frosts   | erwachsen         | natur
 *
 *  1. **The Weather Roof** (kids, technik) - eine Klasse baut die vergessene
 *     Wetterstation der Schule auf dem Flachdach wieder auf; ihre Windwerte
 *     sind doppelt so hoch wie die der Stadt, und schuld ist nicht der
 *     Messer, sondern das Aufzugshaus, das den Wind faltet.
 *  2. **The Books in the Shelter** (kids + teens, alltag) - im Wartehaus an
 *     der Hollow Lane steht eines Morgens ein Bücherschrank; nach dem ersten
 *     Regen ist die untere Reihe hin, und hinter dem Boden liegt ein Brief
 *     der Frau, die den Schrank dort abgestellt hat.
 *  3. **Last Winter at the Baths** (teens + erwachsen, winter) - das alte
 *     Hallenbad soll Ende März schließen; die Zahl auf dem Aushang rechnet
 *     einen ganzen Neubau, und die Schwimmerinnen und Schwimmer rechnen nach.
 *  4. **The Last Turn at the Wheel** (erwachsen, arbeit) - Wandas letzte
 *     Nacht auf einer Linie, die es ab morgen nicht mehr gibt; am Cold Beck
 *     steht das Wasser auf der Straße, und sie kennt die alte Straße hinter
 *     der Mühle noch aus ihrem ersten Winter.
 *  5. **The Book of First Frosts** (erwachsen, natur) - eine Buchbinderin
 *     rettet das durchnässte Anbaubuch einer Gärtnerei; in den getrockneten
 *     Lagen steht Spalte für Spalte, wann der erste Frost kam - hundert
 *     Winter lang im Oktober, zuletzt im Dezember.
 *
 * ── FORM UND RECHTE ──────────────────────────────────────────────────────
 *
 * Selbst verfasst (Bauplan 27.07. §10), durchgehend britisches Englisch -
 * kein amerikanisches Wort in der Datei, siehe die Fahrzeug-Zeile oben -,
 * KEINE Apostrophe, wörtliche Rede immer
 * indirekt, keine Ziffern, jede Zeile EIN Satz von 26 bis 67 Zeichen
 * (gemessen), Satzzeichen nur . , - ? ! : ; und nur der einfache Bindestrich.
 * Vier Etappen zu zwölf Zeilen je Serie; jede Etappe endet auf einen Zug, der
 * weiterlesen lässt, die letzte schließt auf ein Bild und nicht auf eine Lehre.
 *
 * TON: Gegenwart 2026. Auf der Kinder-Stufe nichts Bedrohliches, kein Tod,
 * keine Krankheit als Spannungsmittel, kein Maskottchen und kein sprechendes
 * Tier. Hasan in »Last Winter at the Baths« ist ein Mensch, der blind ist -
 * Person zuerst, und seine Blindheit ist kein Thema der Geschichte, sondern
 * eine Tatsache in Bahn eins. Vielfalt ist erzählt, nicht erklärt.
 */
import type { Serie } from "./serie";

/** Herkunft der selbst verfassten englischen Serien dieser Datei. */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, englisches Original)",
  autor: "Sensorik-Lernplattform",
} as const;

// ───────────────────────────────────────────────────────────────────────────
// kids · Eine Wetterstation auf dem Flachdach der Schule.
// ───────────────────────────────────────────────────────────────────────────
const THE_WEATHER_ROOF: Serie = {
  slug: "en-i4-the-weather-roof",
  titel: "The Weather Roof",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Under the stair at Block Three stands a tall carton.",
        "It has been there since before this class started school.",
        "Mr Idris cuts the bands, and the dust comes out first.",
        "Inside there is a mast, three bowls on arms, and a rain gauge.",
        "It is a weather station, and no one has run it for four winters.",
        "Hilda the caretaker undoes the door to the flat roof.",
        "The roof is broad and bare, and the wind comes hard from the west.",
        "Wren holds the mast while Bilal bolts the foot of it down.",
        "Aisha sets the rain gauge well clear of the wall.",
        "The three bowls turn, and then turn faster.",
        "On the tablet in the classroom a number climbs.",
        "The reading is far higher than the wind on the roof feels.",
      ],
    },
    {
      lines: [
        "The town station stands at the end of Mill Water Lane.",
        "It reads the wind too, and it sends its numbers online.",
        "Mr Idris holds both readings on the board, hour after hour.",
        "At noon the town has three metres a second.",
        "The school roof has eight.",
        "At three the town has four, and the roof has ten.",
        "Bilal thinks the bowls are broken.",
        "Wren does not: the bowls turn true when she blows on them.",
        "Aisha asks what stands west of the mast.",
        "West of the mast there is the lift housing, tall and flat.",
        "The wind hits it, and the wind has to go somewhere.",
        "It goes across the housing - and straight through the bowls.",
      ],
    },
    {
      lines: [
        "Bilal holds a long ribbon at the foot of the housing.",
        "The ribbon stands out flat, hard as a board.",
        "Three metres further out it hangs down and is still.",
        "So the housing does not hold the wind back: it bends it.",
        "Aisha marks the still air with chalk on the roof felt.",
        "The class walks the roof and marks it, corner to corner.",
        "The north corner is calm, and it is broad enough for the mast.",
        "Hilda comes out with a drill and four long bolts.",
        "The mast comes down and goes back at the north corner.",
        "At noon the roof reads four, and so does the town.",
        "Wren writes the two numbers under one another and grins.",
        "Then, at the end of the week, the forecast turns.",
      ],
    },
    {
      lines: [
        "The storm comes in from the west after midnight.",
        "The class is at home, and the mast is not.",
        "Hilda checks the bolts at dawn, in the rain, on her own.",
        "The bowls turn so fast that the count runs on and on.",
        "At ten to eight the roof reads nineteen metres a second.",
        "It is the hardest gust the school has known.",
        "The town station missed it: a branch had fallen on its mast.",
        "So the warden at Mill Water asks the school for its record.",
        "Aisha sends the log across, hour after hour, all of it.",
        "The lane is shut at noon, and the beck holds at the wall.",
        "On the roof the bowls turn on, calm now, in a thin sun.",
        "Wren lets the chalk marks stand where the class made them.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids + teens · Ein Buchtausch-Schrank im Wartehaus an der Hollow Lane.
// ───────────────────────────────────────────────────────────────────────────
const THE_BOOKS_IN_THE_SHELTER: Serie = {
  slug: "en-i4-the-books-in-the-shelter",
  titel: "The Books in the Shelter",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The bus shelter on Hollow Lane has three walls and a bench.",
        "One morning in October there is a cabinet in it as well.",
        "It is a tall wooden cabinet with a door of glass.",
        "Inside there are books, four rows of them, and a card.",
        "The card asks the reader to take one and hand one back.",
        "Bethan takes a book about the moon and the tides.",
        "Kamil takes one about a girl that builds a boat.",
        "Marek reads the card three times and takes nothing.",
        "The bus comes, and all three get on.",
        "All week the cabinet stands there, and no one knows whose it is.",
        "On the last morning of the week the glass door hangs wide.",
        "The rain has come in, and the bottom row is soaked.",
      ],
    },
    {
      lines: [
        "Kamil lands the wet books on the bench, one after another.",
        "Four of them are ruined, and the card is a smear of ink.",
        "Bethan holds the book about the tides and it comes to bits.",
        "The roof of the shelter has a hole the width of a hand.",
        "It has had that hole since before all three were born.",
        "Marek climbs onto the bench and looks at the felt.",
        "The felt is torn back, and the wind has got under it.",
        "Bethan writes to the council about the roof.",
        "The council writes back in three weeks: the roof is on a list.",
        "That is not fast enough, and the winter is coming in hard.",
        "So the three take the cabinet to the wood room at school.",
        "In the drawer under the bottom shelf there is a letter.",
      ],
    },
    {
      lines: [
        "The letter is in a hand that leans hard and is slow to read.",
        "It comes from a woman called Alma Hollis.",
        "She writes that the cabinet stood in her hall a long while.",
        "In the end she could not take the stair to it.",
        "So she had it carried down to the shelter and left it there.",
        "The letter asks for nothing back, and it has no date on it.",
        "Marek finds the house: it is the last one on Hollow Lane.",
        "Alma Hollis is in her nineties and comes to the door on two sticks.",
        "She knows Bethan at once, and asks after her grandmother.",
        "The three tell her about the hole and the four ruined books.",
        "Alma Hollis is not sad about the books, and she tells them so.",
        "She asks one thing of the three, and it is not about the roof.",
      ],
    },
    {
      lines: [
        "What she asks is that the cabinet go back to the shelter.",
        "A book in a school hall is a book that waits for a bell.",
        "A book in a bus shelter is a book that gets found.",
        "Then she tells them about the loft, and about the sea books.",
        "There are four cartons of them under the cold water tank.",
        "Kamil hands them down, and Bethan sorts them on the stair.",
        "In the wood room Marek cuts a new back and a new sill.",
        "He sets the glass in rubber so the rain runs off it.",
        "The caretaker at school hands them the last of her roof felt.",
        "The hole in the shelter roof is shut in one afternoon.",
        "On the first cold morning a man in a wet coat takes a book down.",
        "He reads it standing, and he lets the bus go on without him.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens + erwachsen · Das alte Hallenbad soll schließen - der Kessel, sagt
// der Aushang. Die Zahl dahinter stimmt nicht.
// ───────────────────────────────────────────────────────────────────────────
const LAST_WINTER_AT_THE_BATHS: Serie = {
  slug: "en-i4-last-winter-at-the-baths",
  titel: "Last Winter at the Baths",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens", "erwachsen"],
  minTier: 2,
  topic: "winter",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The notice on the door of the baths is one sheet of card.",
        "It states that the baths shut at the end of March.",
        "The reason on the sheet is the boiler, and one large sum.",
        "Bruna reads it four times before she undoes the door.",
        "She has coached at these baths for nineteen winters.",
        "At half four the first swimmers come in out of the frost.",
        "Hasan, who is blind, takes lane one and counts his lengths.",
        "Marta takes lane three, as she has since her hand was mended.",
        "The water is warm, and the hall smells of chlorine and old tile.",
        "No one in the water knows about the card on the door.",
        "Bruna holds it back until the last of them is out and dressed.",
        "Then she reads the sheet out, and the changing room goes still.",
      ],
    },
    {
      lines: [
        "The council has costed a new boiler and a new roof at once.",
        "The roof is sound: Fionn has been on it, and he is a roofer.",
        "The lantern of glass at the far end lets water in at one corner.",
        "That is a length of lead and an afternoon, and no more.",
        "Fionn writes it down and hands the sheet to Bruna at the door.",
        "Marta works in an office that costs out school builds.",
        "She asks the council for the sheets behind the large sum.",
        "The sheets come in three weeks, and there are four of them.",
        "The sum counts a full rebuild of the hall, roof and all.",
        "It counts a boiler such as a school hall takes.",
        "The baths are one room, and much smaller than that.",
        "That night the boiler halts, and the water starts to go cold.",
      ],
    },
    {
      lines: [
        "Cold is not the end of it: the water holds at nine degrees.",
        "Hasan swims four lengths in it and comes out laughing.",
        "The others last one length, and Marta lasts none at all.",
        "Fionn cuts the corner of the lantern back and beds the lead in.",
        "It takes him one afternoon, as he said it would.",
        "Hasan cannot see the corner; he hears it go still.",
        "Marta writes to the council and asks for a second costing.",
        "The council answers that a costing costs, and there are no funds.",
        "So the swimmers cost it out on their own.",
        "Bruna calls the firm that fitted the last boiler.",
        "The firm sends a man out, and he is in the hall an hour.",
        "His number is one tenth of the number on the card.",
      ],
    },
    {
      lines: [
        "The meeting is in the school hall on the last night of March.",
        "Fourteen swimmers come, and the hall holds a hundred.",
        "Marta reads out both numbers, and then the four sheets.",
        "A woman from the council asks who would run the baths.",
        "No one answers at first, and the hall is not a warm room.",
        "Then Hasan stands and asks how a trust is set out.",
        "It takes three months and a lot of forms, and Marta does them.",
        "The trust takes the baths on for one winter, as a trial.",
        "The council mends the boiler and hands the doors across.",
        "The water comes back to warm on the first night of October.",
        "Hasan is first in at half four, counting his lengths.",
        "Frost stands on the lantern glass, and nothing comes through.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// erwachsen · Die letzte Nacht des Nachtbusses - und der Bach steht auf der
// Straße.
// ───────────────────────────────────────────────────────────────────────────
const THE_LAST_TURN_AT_THE_WHEEL: Serie = {
  slug: "en-i4-the-last-turn-at-the-wheel",
  titel: "The Last Turn at the Wheel",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The last bus out of Northgate goes at ten to one.",
        "Wanda has taken it out of the garage for nineteen winters.",
        "Tonight is the last of them: after tonight the route is done.",
        "What comes instead is a small bus that has to be booked.",
        "It comes to the door, and it does not run at one in the morning.",
        "Wanda checks the oil, the lights and the boards.",
        "She sets the front board to Cold Beck and Nethertown.",
        "The first three at the stand are the ones from the bakehouse.",
        "Chidi gets on last and hands her a warm loaf in a cloth.",
        "He has done that on the coldest nights for four winters.",
        "The frost is hard, and the road out of town shines with it.",
        "At the beck a council tractor and trailer stand across the road.",
      ],
    },
    {
      lines: [
        "The bridge at Cold Beck is shut until the water falls.",
        "The beck has come out of its bed and stands across the road.",
        "A man in a wet coat tells Wanda to turn the bus around.",
        "The control room tells her the same: take the riders back.",
        "Back means Northgate, and no one on the bus is from there.",
        "Chidi starts at four at the bakehouse on the far side.",
        "Amina is on the ward at Nethertown at two.",
        "Tomas is in his eighties and cannot stand an hour in the frost.",
        "Wanda holds the bus at the stand and thinks the road out.",
        "There is another road, and no bus has taken it for a long while.",
        "It runs behind the mill and comes out at Nethertown.",
        "It is narrow, it is dark, and it has a ford at the far end.",
      ],
    },
    {
      lines: [
        "Wanda calls the control room and names the road she means.",
        "The control room sits an hour off and has the road on a screen.",
        "On the screen the mill road is a thin line and nothing more.",
        "Wanda knows it: it was the route in her first winter.",
        "She tells them she has taken it in snow, and once in a flood.",
        "The control room is still for a while, and then it answers.",
        "The mill road is old tarmac, and it holds.",
        "The branches come in at the roof of the bus and drag along it.",
        "Amina stands at the front and calls out the low ones.",
        "At the ford the water runs across the road, two hands of it.",
        "Wanda takes it at a walk, and the bus does not falter.",
        "On the far side Nethertown comes out of the dark, all lights on.",
      ],
    },
    {
      lines: [
        "Amina gets off at the ward gate and is not late for her shift.",
        "Chidi gets off at the bakehouse, and the fires are lit.",
        "Tomas rides on to the end, as he has done for a long while.",
        "He tells her about the first night she took him home.",
        "It was nineteen winters back, and it was raining hard.",
        "He had come out of the works at Northgate with a bad hand.",
        "Wanda cannot call that night back at all.",
        "She takes him to his gate all the same, and his gate is no stand.",
        "Then the bus runs to the garage with no one on board.",
        "Wanda brings it in at ten to four and signs the sheet.",
        "She hangs the fob on the board, and the board is full again.",
        "Out at Cold Beck the water falls, and the frost comes back.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// erwachsen · Eine Buchbinderin rettet das Anbauheft einer Gärtnerei - und
// in den getrockneten Lagen steht, wann der erste Frost kam.
// ───────────────────────────────────────────────────────────────────────────
const THE_BOOK_OF_FIRST_FROSTS: Serie = {
  slug: "en-i4-the-book-of-first-frosts",
  titel: "The Book of First Frosts",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "natur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The carton comes in on a wagon from Litton, and it is wet.",
        "Rosa Bode binds and mends books in a room behind the museum.",
        "Inside the carton there is one book, and it is a block.",
        "It was a ledger, and it held a hundred and nineteen winters.",
        "The market garden at Litton has written in it since it started.",
        "In the frost the tank in the loft burst, and the water found it.",
        "Nour, who holds the garden now, carried the carton in herself.",
        "She asks Rosa what a book like this costs to mend.",
        "Rosa does not answer that. She undoes the cord and looks.",
        "The boards are black, and the cloth comes off in her hand.",
        "The bottom third of the book has gone hard as a brick.",
        "The rest is wet, and mould has come out in a brown bloom.",
      ],
    },
    {
      lines: [
        "A wet book will not wait: the mould works on in the dark.",
        "Rosa takes the book to bits at the bench, fold after fold.",
        "The hard third does not come to bits at all.",
        "She stands it in a cold draught for three nights.",
        "Then the folds come free, one and one and one.",
        "Each fold goes into a cold bath, and the water turns brown.",
        "The ink of the oldest hand is iron gall, and it holds fast.",
        "One later hand runs at once and comes out a blur.",
        "That hand held the book for nineteen winters, and it is thin now.",
        "Rosa dries each fold between cloths and boards.",
        "In the middle of the block are three folds that are not the book.",
        "No one at Litton knows about them.",
      ],
    },
    {
      lines: [
        "The three folds are a list of sowings from a garden at Nethertown.",
        "That garden went under a road four decades back.",
        "Rosa hands the three folds to Nour and comes back to the ledger.",
        "The columns are ruled in hand, and all of them run the same.",
        "One holds the sowing, one the lifting, one the first frost.",
        "In the oldest hand the first frost lands in October.",
        "It lands there, October after October, for a hundred winters.",
        "In the hand of her grandmother it lands at the end of that month.",
        "In the hand of her father it lands later still, and later again.",
        "In the last four winters it has landed in December.",
        "In one of those four it did not land at all.",
        "Nour asks Rosa to bind the book so it can take a hundred more.",
      ],
    },
    {
      lines: [
        "Rosa sews the folds on three linen cords, one at a time.",
        "The needle goes in and out of the old holes, not new ones.",
        "The back of the book comes round under her thumb.",
        "She cuts new boards and binds them in a hard brown cloth.",
        "The old cloth goes on the front board, mould and all.",
        "It still carries the mark of the tank water, and it stands.",
        "It takes her four months, and Nour comes in three times.",
        "The book goes back to Litton in a case, on the same wagon.",
        "Nour rules the new columns in the same hand as her father.",
        "She writes in the sowing of the beans and the last frost.",
        "The first frost of that winter comes in the middle of December.",
        "Nour writes it in, and the ink stands wet on the sheet a while.",
      ],
    },
  ],
};

export const SERIEN_EN_I4_SPROSSE22: Serie[] = [
  THE_WEATHER_ROOF,
  THE_BOOKS_IN_THE_SHELTER,
  LAST_WINTER_AT_THE_BATHS,
  THE_LAST_TURN_AT_THE_WHEEL,
  THE_BOOK_OF_FIRST_FROSTS,
];
