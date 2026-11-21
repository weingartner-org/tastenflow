/**
 * ENGLISCHE GESCHICHTEN FÜR ERWACHSENE - Charge E1, 30.08.2026.
 * Einundzwanzig Serien, Stufe `erwachsen`, alle auf **Sprosse 29**.
 *
 * Damit ist das letzte Regal der Bücherei voll: alle acht Regale (vier Stufen
 * mal zwei Sprachen) stehen bei 40 Geschichten und 20 Wissens-Serien.
 *
 * ── VIER STIMMEN, ALLE GEMEINFREI ─────────────────────────────────────────
 *
 * | Autorin/Autor | gestorben | Stücke | Ton |
 * |---|---|---|---|
 * | Kate Chopin | 1904 | 4 | knappe Innensicht, Frauen an einem Wendepunkt |
 * | O. Henry | 1910 | 8 | New Yorker Kleinleute, Pointe am Schluss |
 * | Saki | 1916 | 7 | englische Gesellschaftskomödie, trocken |
 * | Katherine Mansfield | 1923 | 2 | Klasse und Mitgefühl, ohne Zeigefinger |
 *
 * Es sind **Nacherzählungen**, keine Abschriften. Die Originale sind länger als
 * eine Serie und mussten verdichtet werden; die Sprosse verlangt ohnehin einen
 * Neusatz jeder Zeile.
 *
 * ── ⚠️ AUSWAHL NACH HEUTIGER ETHIK, NICHT NUR NACH LIZENZ ─────────────────
 *
 * Ein Text ist nicht schon deshalb geeignet, weil er gemeinfrei ist. Sechs
 * bereits geprüfte Stücke sind an dieser Hürde ausgeschieden (Einwand von
 * Johannes, 30.08.):
 * - **Memoirs of a Yellow Dog** (O. Henry): Der Witz lebt vom Klischee der
 *   herrischen, dicken Ehefrau, der der Mann am Ende entkommt.
 * - **The Romance of a Busy Broker** (O. Henry): Der Chef macht seiner
 *   Sekretärin einen Heiratsantrag.
 * - **Mammon and the Archer** (O. Henry): Der Antrag gelingt nur, weil sie zwei
 *   Stunden in einer Droschke festsitzt und nicht weg kann.
 * - **The Treasure-Ship** (Saki): Erpressung als glückliches Ende.
 * - **The Return of Alcibiade** (Chopin): spielt auf einer Plantage, der tote
 *   Sohn fiel für die Konföderierten.
 * - **Regret** (Chopin): Die Moral liest sich heute als „eine Frau ohne Kinder
 *   hat etwas versäumt".
 * Ebenso ausgeschieden: **Beyond the Bayou** (Chopin) - Plantagenstoff, die
 * schwarze Hauptfigur trägt den Namen „die Verrückte" - und **The
 * Schartz-Metterklume Method** (Saki), in der Kinder den Raub der Sabinerinnen
 * nachspielen sollen.
 * ⇒ **Regel: erst Lizenz prüfen, dann Ethik, dann schreiben.** Beides ist eine
 * eigene Prüfung, und die zweite fällt häufiger negativ aus als die erste.
 *
 * ── ⚠️ JEDE QUELLE EINZELN GEPRÜFT ────────────────────────────────────────
 *
 * Wie bei Charge G3 wurde jede Quelle abgerufen und der Autor am Text bestätigt.
 * Auf en.wikisource.org sind **„The Open Window", „The Last Leaf", „A Pair of
 * Silk Stockings" und „After Twenty Years" Begriffsklärungsseiten** mit je zwei
 * bis vier gleichnamigen Werken verschiedener Autoren. Wer den blossen Titel
 * abruft, erwischt mit guter Chance den falschen Text.
 *
 * ── SPROSSE 29 - UND DIE FALLE, DIE KEINE ZEICHENPRÜFUNG FINDET ───────────
 *
 * Englisch kann nur bei 25, 28, 29 oder 30 öffnen; auf 26, 27 und 31 stehen
 * `ä`, `ü`, `ß` (I4-Übergabe §2.1). Gewählt ist **29**:
 * - Auf 25 fehlt das `y`, und damit *you, your, day, year, very, say, way,
 *   only, many, money, family, city, story, easy, happy, eye, boy*, jeder
 *   Wochentag und **jedes Adverb auf -ly**. Für literarische Prosa ist das
 *   Kauderwelsch.
 * - Auf 29 fehlt nur `q`: *quiet, quick, question, quite, square, require*.
 *   Ersatz, der trägt: *still* statt quiet · *swift* statt quick · *rather*
 *   statt quite · *what she asked* statt question.
 *
 * ⚠️⚠️ **Der Apostroph sperrt eine ganze Serie.** Gemessen mit `serieTypeable`:
 * Punkt, Komma und Doppelpunkt werden weggelassen, solange sie nicht gelernt
 * sind - eine Zeile mit `.` öffnet bei n=15. Eine Zeile mit `'` öffnet erst bei
 * **n=52**, denn aus *don't* darf nie ein falsches *dont* werden. Also:
 * **keine Kurzformen und keine Genitiv-Apostrophe** - *do not* statt *don't*,
 * *the hat of the man* oder *his hat* statt *the man's hat*. Zu Prosa von 1900
 * passt das ohnehin.
 */
import type { Serie } from "./serie";

const CHOPIN = {
  quelle: "Kate Chopin, Kurzgeschichten (1894-1897), Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "Kate Chopin (Original); Nacherzählung: Sensorik-Lernplattform",
  fundstelle: "en.wikisource.org, abgerufen 30.08.2026",
} as const;

const O_HENRY = {
  quelle: "O. Henry, The Four Million (1906) und The Trimmed Lamp (1907), Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "O. Henry (Original); Nacherzählung: Sensorik-Lernplattform",
  fundstelle: "en.wikisource.org, abgerufen 30.08.2026",
} as const;

const SAKI = {
  quelle: "Saki (H. H. Munro), Beasts and Super-Beasts (1914), Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "Saki (Original); Nacherzählung: Sensorik-Lernplattform",
  fundstelle: "en.wikisource.org, abgerufen 30.08.2026",
} as const;

const MANSFIELD = {
  quelle: "Katherine Mansfield, The Garden Party and Other Stories (1922), Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "Katherine Mansfield (Original); Nacherzählung: Sensorik-Lernplattform",
  fundstelle: "en.wikisource.org und gutenberg.org (eBook 1429), abgerufen 30.08.2026",
} as const;

// ────────────────────────────────────────────────────────── Chopin 1 von 4 ──
const THE_STORY_OF_AN_HOUR: Serie = {
  slug: "en-e1-the-story-of-an-hour",
  titel: "The Story of an Hour",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: CHOPIN,
  etappen: [
    {
      lines: [
        "Mrs Mallard had a weak heart, and all of them knew it.",
        "So the news had to be broken to her with great care.",
        "Her sister Josephine told her in broken sentences.",
        "Richards, a friend of her husband, stood nearby.",
        "He had been at the newspaper office that morning.",
        "The list of the dead had come in from the rail line.",
        "The name of Brently Mallard stood at the top of it.",
        "Richards had waited for a second message to be sure.",
        "Then he had hurried over to bring the news himself.",
        "Mrs Mallard did not hear the story as many women do.",
        "She wept at once, with sudden and wild sorrow.",
        "Then she went up alone and would have no one with her.",
      ],
    },
    {
      lines: [
        "There stood an open window, and she sank into a chair.",
        "She was worn out in body, and something reached deeper.",
        "In the open ground before the house the trees were new.",
        "The breath of rain was in the air, and it was sweet.",
        "A man called out his wares in the street below.",
        "Someone was singing far off, and the notes carried well.",
        "Countless sparrows were twittering under the eaves.",
        "Patches of blue sky showed between the clouds.",
        "She sat with her head back on the cushion of the chair.",
        "She did not move, except when a sob shook her.",
        "She was young, with a fair and calm face.",
        "But now her eyes looked out at nothing, and waited.",
      ],
    },
    {
      lines: [
        "Something was coming to her, and she was afraid of it.",
        "She did not know what it was, and could not name it.",
        "It came out of the sky and reached her through the air.",
        "Her chest rose and fell, and she began to know it.",
        "She tried to beat it back with her will, and could not.",
        "Then a small word broke from her parted lips.",
        "She said it under her breath, again and again: free.",
        "The look of fear went out of her eyes and stayed away.",
        "Her pulse beat fast, and the blood warmed her body.",
        "She did not stop to ask whether this joy was proper.",
        "She saw the years to come that would be her own.",
        "She opened her arms out wide to meet them.",
      ],
    },
    {
      lines: [
        "Josephine knelt outside the door and begged her to open.",
        "She called: Louise, you will make yourself ill.",
        "Mrs Mallard answered: I am not making myself ill.",
        "She was drinking in the very spring of life out there.",
        "Her mind ran on the long line of days that would come.",
        "Then she rose at last and opened the door to her sister.",
        "She held her sister at the waist, and they went down.",
        "Richards stood waiting at the foot of the stairs.",
        "Someone was opening the front door with a latchkey.",
        "It was Brently Mallard, travel stained and calm.",
        "He had been far away and knew nothing of the accident.",
        "The doctors said she had died of the joy that kills.",
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────── Chopin 2 von 4 ──
const A_PAIR_OF_SILK_STOCKINGS: Serie = {
  slug: "en-e1-a-pair-of-silk-stockings",
  titel: "A Pair of Silk Stockings",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: CHOPIN,
  etappen: [
    {
      lines: [
        "Little Mrs Sommers came into fifteen dollars one day.",
        "It seemed a very large sum to her small purse.",
        "She carried the money about with her for two days.",
        "She would not spend a cent of it without a plan.",
        "For a night or two she lay awake and turned it over.",
        "The children needed shoes, and shoes wear out fast.",
        "There was cloth for shirts, and there were caps.",
        "She counted the sums on her fingers in the dark.",
        "The old days before her marriage came back to her.",
        "She did not let herself look back for long.",
        "The day of the errand came, and she went out early.",
        "She did not eat first, and that was her mistake.",
      ],
    },
    {
      lines: [
        "She reached the great shop and felt weak at the knee.",
        "She sat down on a stool at an empty counter.",
        "Her hand fell on something smooth and very fine.",
        "She looked down and saw a heap of silk stockings.",
        "A card above them named a price that was low.",
        "The girl behind the counter asked what she wished.",
        "The old careful Mrs Sommers would have asked for shoes.",
        "Mrs Sommers heard her own voice ask for the size.",
        "She held the silk in her two hands for a while.",
        "Then she said she would take that pair, and paid.",
        "She did not choose. She simply did not hold back.",
        "She carried the small parcel to the waiting room.",
      ],
    },
    {
      lines: [
        "There she changed her old stockings for the new ones.",
        "She was not thinking, and that was rather restful.",
        "Next she walked to the counter that held the boots.",
        "The clerk knelt and fitted her with care and patience.",
        "She was hard to please, and he did not seem to mind.",
        "She wanted the boots to sit well and to look well.",
        "She paid for them and walked out in the new pair.",
        "Then came gloves, fitted slowly and buttoned neatly.",
        "Then two magazines, of the sort she used to read.",
        "She carried her parcels lightly and held her head up.",
        "She was hungry now, and there was a place at hand.",
        "She had never gone into such a place before.",
      ],
    },
    {
      lines: [
        "She sat at a small table and a waiter came at once.",
        "She ordered oysters, a chop, a sweet and a glass of wine.",
        "She read her magazine between one dish and the next.",
        "There was no fuss and no hurry, and the room was warm.",
        "The bill was more than she had ever paid for a meal.",
        "She left a coin for the waiter and he bowed to her.",
        "Then she saw a theatre bill and bought a seat.",
        "She sat among people who had come to be amused.",
        "A woman beside her shared her sweets and said little.",
        "When it was over she went out into the street.",
        "She took a cable car and sat with her hands still.",
        "A man across from her saw a wish in her face: to ride on.",
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────── Chopin 3 von 4 ──
const RIPE_FIGS: Serie = {
  slug: "en-e1-ripe-figs",
  titel: "Ripe Figs",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "natur",
  herkunft: CHOPIN,
  etappen: [
    {
      lines: [
        "Maman-Nainaine said that Babette could go on a visit.",
        "She could go when the figs were ripe, and not before.",
        "Babette was young, and the figs were still small.",
        "They were hard and green on the wide dark leaves.",
        "It was still early spring when the promise was given.",
        "Babette thought the summer would never come at all.",
        "Maman-Nainaine sat under her own roof and sewed.",
        "She was patient in a way that Babette was not.",
        "Every morning the girl went down to the trees.",
        "She turned the leaves and looked underneath them.",
        "She counted the fruit and found it hard as wood.",
        "Then she came back and said nothing at all.",
      ],
    },
    {
      lines: [
        "The days grew longer and the shadows grew shorter.",
        "The river ran low and warm between its banks.",
        "The rice fields were flooded and then drained again.",
        "Cotton stood in rows and turned from green to grey.",
        "The birds came into the fig trees and were driven off.",
        "Babette drove them off with a stick and much noise.",
        "Maman-Nainaine watched her from the shaded porch.",
        "She did not tell the girl to hurry or to wait.",
        "She only said that the fruit knows its own hour.",
        "Babette did not think that was much of an answer.",
        "She walked to the trees again before breakfast.",
        "The figs were still green, and she was still here.",
      ],
    },
    {
      lines: [
        "Then one morning the leaves had a different look.",
        "The fruit hung heavy and had turned a deep purple.",
        "Babette stood under the tree and did not move.",
        "Then she ran to the house and asked for a platter.",
        "She picked twelve figs and laid them out with care.",
        "She set them on the platter in two even rows.",
        "She carried the platter in to breakfast herself.",
        "Maman-Nainaine looked at the fruit for a long time.",
        "She said: how early the figs have ripened this year.",
        "Babette said: I think they have ripened very late.",
        "Maman-Nainaine bit into one and found it good.",
        "Then she said that Babette might go on her visit.",
      ],
    },
    {
      lines: [
        "She told the girl to give her love to the cousins.",
        "She told her to be good and to help in the house.",
        "She sent word to Tante Frosine as well.",
        "The word was this: I shall come myself in the autumn.",
        "I shall come when the chrysanthemums are in bloom.",
        "Babette heard it and understood at last.",
        "The old woman did not count the weeks or the days.",
        "She counted the fruit and the flowers instead.",
        "That was her calendar, and it had never failed her.",
        "Babette went off with her bundle down the road.",
        "She looked back once at the trees by the house.",
        "The figs were ripe, and the summer had been long.",
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────── Chopin 4 von 4 ──
const A_RESPECTABLE_WOMAN: Serie = {
  slug: "en-e1-a-respectable-woman",
  titel: "A Respectable Woman",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: CHOPIN,
  etappen: [
    {
      lines: [
        "Mrs Baroda was a little put out at the news.",
        "Her husband had asked a friend to stay a week or two.",
        "The friend was Gouvernail, from his college days.",
        "She had never met him and had made a picture of him.",
        "In her mind he was tall and thin and wore glasses.",
        "In her mind he talked too much and stood too close.",
        "She had planned a rest after a busy winter season.",
        "Now there would be a guest and no rest at all.",
        "The man who came was not the man she had imagined.",
        "He was slim enough, but he was calm and easy.",
        "He was not cold, and he was not eager either.",
        "He simply took the place as he found it.",
      ],
    },
    {
      lines: [
        "Gouvernail liked to sit on the wide porch and read.",
        "He walked along the levee with her husband at dusk.",
        "He said very little and seemed content with that.",
        "Mrs Baroda set herself to draw him into talk.",
        "She walked with him and asked him about his work.",
        "He answered well, and then he fell silent again.",
        "She could not tell whether he liked her or not.",
        "That was new to her, and it began to trouble her.",
        "Her husband said: he is tired, let him alone.",
        "He said: Gouvernail has been working himself hard.",
        "Mrs Baroda said she was not in the habit of that.",
        "But she found that she thought about him a great deal.",
      ],
    },
    {
      lines: [
        "One evening she sat alone on a bench near the oak.",
        "The air was still and the frogs were loud in the ditch.",
        "Gouvernail came along the walk and sat down by her.",
        "He did not ask leave, and she did not send him away.",
        "He began to speak, more freely than he had before.",
        "He spoke of the night and of the wind in the leaves.",
        "He spoke of days when he had wanted a great deal.",
        "He said he wanted less now, and slept better for it.",
        "She heard the voice more than she heard the words.",
        "She wished to reach out and touch his sleeve.",
        "She did not move, and she did not answer him.",
        "He was not thinking of her, and she knew it.",
      ],
    },
    {
      lines: [
        "The next morning she left for the city very early.",
        "She stayed away until the guest had gone home.",
        "Her husband asked her afterwards what had happened.",
        "She said only that she had wanted a change of air.",
        "The summer passed and the autumn came after it.",
        "One evening she said she would ask Gouvernail again.",
        "Her husband was pleased and a little surprised.",
        "He said: I am glad, my dear, that you got over it.",
        "She said: I have got over nothing at all.",
        "She said: I have overcome everything instead.",
        "She said she would be very nice to him this time.",
        "Her husband laughed and did not ask what she meant.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────── O. Henry 1 von 8 ──
const THE_GIFT_OF_THE_MAGI: Serie = {
  slug: "en-e1-the-gift-of-the-magi",
  titel: "The Gift of the Magi",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "winter",
  herkunft: O_HENRY,
  etappen: [
    {
      lines: [
        "One dollar and eighty seven cents. That was all of it.",
        "Sixty cents of it was in pennies, saved one at a time.",
        "Della had saved them by haggling with the grocer.",
        "Her cheeks burned when she thought of the haggling.",
        "She counted the money three times, and it stayed the same.",
        "The next day would be Christmas, and that was all she had.",
        "There was nothing to do but sit down and cry.",
        "So Della did just that, on the shabby little couch.",
        "The flat was furnished at eight dollars a week.",
        "In the hall below there was a box that held no letters.",
        "There was a bell that no finger could make ring.",
        "On the door was a card with the name of James Young.",
      ],
    },
    {
      lines: [
        "When the income was thirty dollars, the name looked well.",
        "Now the income was twenty, and the name looked too long.",
        "But whenever the man of the house came up the stairs,",
        "he was called Jim, and Della held him very hard.",
        "Della finished her cry and attended to her cheeks.",
        "She stood by the window and looked out at a grey cat.",
        "Tomorrow was Christmas, and she had a dollar and change.",
        "She had been saving every penny she could for months.",
        "Twenty dollars a week does not go far in a flat.",
        "She had wanted to buy something fine and rare for Jim.",
        "Something worthy of him, and of no one else at all.",
        "There was a tall glass between the windows of the room.",
      ],
    },
    {
      lines: [
        "Suddenly she turned from the window and stood before it.",
        "Her eyes were shining, but her face had lost its colour.",
        "She pulled down her hair and let it fall its full length.",
        "Two things in that flat were the pride of the two of them.",
        "One was the gold watch that Jim had from his father.",
        "The other was the hair of Della, brown and very long.",
        "She did up her hair again, swiftly and with care.",
        "She put on her old brown jacket and her old brown hat.",
        "She went down the stairs and out into the street.",
        "She stopped at a sign that read: Hair Goods of All Kinds.",
        "A large woman looked at her and said only: I buy hair.",
        "Della said: will you buy mine? And she took off her hat.",
      ],
    },
    {
      lines: [
        "Twenty dollars, said the woman, lifting the mass in a hand.",
        "Give it to me at once, said Della, and it was done.",
        "For two hours she went through the shops on her toes.",
        "She found it at last: a chain of plain platinum.",
        "It had no false ornament, as all good things have none.",
        "It was worthy of the watch, and still as good things are.",
        "She hurried home with it and set the table for supper.",
        "When Jim came in he stopped inside the door and stared.",
        "His eyes were fixed on Della, and she could not read them.",
        "He said at last: I sold the watch to buy you the combs.",
        "Della had cut her hair, and the combs could not be used.",
        "Of all who give gifts, these two were the wisest of all.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────── O. Henry 2 von 8 ──
const THE_LAST_LEAF: Serie = {
  slug: "en-e1-the-last-leaf",
  titel: "The Last Leaf",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "kultur",
  herkunft: O_HENRY,
  etappen: [
    {
      lines: [
        "In a small district of the town the streets run mad.",
        "They break themselves into short strips called places.",
        "Artists came to this old district for cheap rooms.",
        "Sue and Johnsy had a studio at the top of a brick house.",
        "Sue was from the north and Johnsy was from the west.",
        "They had met over a table and found their tastes agreed.",
        "That was in May, and in November a cold stranger came.",
        "The doctors gave him the name of pneumonia.",
        "He walked the district and touched one here and one there.",
        "Johnsy lay on her iron bed and hardly moved at all.",
        "She looked through the window at a blank brick wall.",
        "The doctor spoke to Sue out in the hallway one morning.",
      ],
    },
    {
      lines: [
        "He said the odds were one in ten, and no better.",
        "He said the one chance was that she should want to live.",
        "He said she had made up her mind not to get well.",
        "Sue went into the workroom and cried until she was done.",
        "Then she walked into the room whistling a bright tune.",
        "Johnsy lay with her face towards the window, counting.",
        "She counted backward, and the numbers grew smaller.",
        "Sue looked out and saw an old ivy vine on the wall.",
        "The cold breath of autumn had stripped it almost bare.",
        "Johnsy said she was counting the leaves that were left.",
        "She said: when the last one falls I must go too.",
        "Sue said she had never heard of anything so foolish.",
      ],
    },
    {
      lines: [
        "Downstairs lived old Behrman, a painter of sixty.",
        "He had failed in art for forty years and more.",
        "He always spoke of the masterpiece he would paint.",
        "He had never begun it, and he drank more than he should.",
        "He earned a little by sitting as a model for the artists.",
        "Sue went down and told him what Johnsy had said.",
        "Behrman shouted that it was a stupid business.",
        "He said no one dies because leaves drop off a vine.",
        "But he came up and looked out of the window with her.",
        "The ivy vine hung on the wall, and the rain was cold.",
        "They looked at each other and did not speak of it.",
        "Then Behrman went down to his own room again.",
      ],
    },
    {
      lines: [
        "All that night the rain beat and the wind blew hard.",
        "In the morning Johnsy asked for the shade to be drawn up.",
        "One leaf was still there against the brick wall.",
        "It was the last one, and it hung bravely on the stem.",
        "It stayed all that day, and it stayed the night after.",
        "Johnsy lay and looked at it for a long time.",
        "Then she said: I have been a bad girl, Sue.",
        "She said the leaf had shown her that she was wrong.",
        "She asked for broth, and then for a hand mirror.",
        "In the afternoon the doctor said she was out of danger.",
        "Behrman had died of pneumonia in the hospital that day.",
        "They found a lantern and a brush and paint of two colours.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────── O. Henry 3 von 8 ──
const AFTER_TWENTY_YEARS: Serie = {
  slug: "en-e1-after-twenty-years",
  titel: "After Twenty Years",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: O_HENRY,
  etappen: [
    {
      lines: [
        "A policeman moved up the avenue and looked impressive.",
        "The hour was barely ten, but the wind had emptied it.",
        "He tried doors as he went and swung his club.",
        "Now and then he turned and cast his eye down the street.",
        "In the doorway of a darkened shop a man was leaning.",
        "He had an unlit cigar in his mouth and stood still.",
        "As the policeman came up, the man spoke at once.",
        "He said: it is all right, I am waiting for a friend.",
        "He said it was a date made twenty years ago.",
        "There was a restaurant here then, called Big Joe.",
        "It was torn down five years ago, said the policeman.",
        "The man struck a match to light his cigar and spoke on.",
      ],
    },
    {
      lines: [
        "In the light the policeman saw a pale strong jaw.",
        "He saw keen eyes and a small white scar near the brow.",
        "A large diamond was set oddly in the mans scarf pin.",
        "The man said: twenty years ago I dined here with Jimmy.",
        "Jimmy Wells was the best friend I ever had, he said.",
        "We were raised here together, like two brothers.",
        "I was eighteen and he was twenty, said the man.",
        "The next morning I was to start for the west.",
        "You could not have dragged Jimmy out of the city.",
        "We agreed to meet here again in twenty years,",
        "at this same hour, whatever our stations might be.",
        "The policeman asked whether he had heard from him.",
      ],
    },
    {
      lines: [
        "The man said they had written for a year or two.",
        "Then the west had swallowed him and he lost the trail.",
        "He said: Jimmy will come if he is alive at all.",
        "He was the truest old chap in the world, he said.",
        "The policeman said he hoped so and moved along.",
        "A fine rain began to fall and the wind blew colder.",
        "The waiting man stayed in the doorway and smoked.",
        "About twenty minutes later a tall man hurried across.",
        "He wore a long overcoat with the collar turned up.",
        "He said: is that you, Bob? And Bob said: is that you?",
        "They took each other by the arm and walked to a corner.",
        "There a shop window threw a strong electric light.",
      ],
    },
    {
      lines: [
        "Under the light each looked at the face of the other.",
        "Bob stopped suddenly and let go of the arm he held.",
        "He said: you are not Jimmy Wells, that is plain.",
        "Twenty years is long, but not long enough for that.",
        "It has changed the shape of your nose, he said.",
        "The tall man said: it sometimes changes a good man.",
        "He said Bob had been under arrest for ten minutes.",
        "He said Chicago wanted him and had sent word ahead.",
        "He handed Bob a small piece of paper before they went.",
        "The note said: Bob, I was at the place on time.",
        "When you struck the match I saw the face of a wanted man.",
        "I could not do it myself, so I got a friend to come.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────── O. Henry 4 von 8 ──
const THE_COP_AND_THE_ANTHEM: Serie = {
  slug: "en-e1-the-cop-and-the-anthem",
  titel: "The Cop and the Anthem",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "winter",
  herkunft: O_HENRY,
  etappen: [
    {
      lines: [
        "Soapy moved on his bench in the park and knew the sign.",
        "When wild geese honk at night, winter is at hand.",
        "When leaves fall, a man without a coat should plan.",
        "Soapy had three months on the island in his mind.",
        "There he would have a bed and food and good company.",
        "He wanted no charity from the hands of a committee.",
        "He would rather be a guest of the law than of alms.",
        "So he set out to have himself arrested that evening.",
        "The easiest way was to dine well and then not pay.",
        "He walked to a bright restaurant on the avenue.",
        "His trousers were poor, and his shoes were worse.",
        "The head waiter turned him out before he sat down.",
      ],
    },
    {
      lines: [
        "Soapy went on and looked for a second chance.",
        "He picked up a stone and threw it at a shop window.",
        "The glass broke with a noise that brought people running.",
        "A policeman came round the corner with his club out.",
        "Soapy stood still with his hands in his pockets.",
        "He smiled and said: do you not see who did it?",
        "The policeman ran after a man half a street away.",
        "He never thought that the guilty man would stay.",
        "Soapy walked on with the taste of failure in his mouth.",
        "He went into a cheap eating house and ate a large meal.",
        "Then he told the waiter that he had not one cent.",
        "Two waiters took him and laid him neatly on the pavement.",
      ],
    },
    {
      lines: [
        "He got up and beat the dust out of his old clothes.",
        "Arrest seemed a rosy dream and the island far away.",
        "He tried to be loud and unruly on a busy corner.",
        "He danced and shouted and made a great disturbance.",
        "A policeman said to a passer by: it is the students.",
        "He said they were let out to celebrate and did no harm.",
        "Soapy stopped in bitterness and walked on again.",
        "He saw an umbrella standing inside a cigar shop.",
        "He took it and walked out slowly with it in his hand.",
        "The owner followed and Soapy said the umbrella was his.",
        "The man said he had found it himself that morning.",
        "He begged pardon and hurried off across the street.",
      ],
    },
    {
      lines: [
        "Soapy went east through a street that had little light.",
        "He came to an old church with a soft glow inside.",
        "The organ was being played by someone alone in there.",
        "Soapy stood still against the iron fence and listened.",
        "The music held him where he was and would not let go.",
        "He thought of his mother and of roses and clean thoughts.",
        "He thought of friends and collars and honest work.",
        "A sudden and strong change came over his whole mind.",
        "He would pull himself out of the pit he had fallen in.",
        "He would find the man who once offered him a place.",
        "A hand fell on his arm, and it was a policeman.",
        "The judge gave him three months on the island.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────── O. Henry 5 von 8 ──
const THE_GREEN_DOOR: Serie = {
  slug: "en-e1-the-green-door",
  titel: "The Green Door",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "abenteuer",
  herkunft: O_HENRY,
  etappen: [
    {
      lines: [
        "Rudolf Steiner was a true follower of adventure.",
        "Few of us are, and most take the safe road home.",
        "By day he sold pianos, and he sold them well.",
        "By night he walked out to see what would happen.",
        "One evening he went along a busy cross street.",
        "A man there was handing out cards to the passers by.",
        "The cards named a dentist above the shop fronts.",
        "Rudolf took one and dropped it, as all the others did.",
        "At the next corner he took a second card from the man.",
        "This one had two words written on it in ink.",
        "The words were these: The Green Door.",
        "Rudolf stood still and looked at the writing.",
      ],
    },
    {
      lines: [
        "He walked back and took a third card from the man.",
        "It was a plain card with nothing written on it.",
        "The man looked at him and gave no sign at all.",
        "Rudolf went into the doorway beside the dentist sign.",
        "He climbed two flights of stairs in near darkness.",
        "On the first landing there were two doors, both brown.",
        "On the second landing one of the doors was green.",
        "He stood before it and heard nothing on the other side.",
        "He knocked, and after a moment the door opened.",
        "A young woman stood there, not twenty years old.",
        "She was white as a sheet and swayed where she stood.",
        "Rudolf caught her as she fell and carried her in.",
      ],
    },
    {
      lines: [
        "He laid her on a couch that was worn to the boards.",
        "He ran down the stairs and out into the street.",
        "In ten minutes he was back with a basket of food.",
        "There was bread and milk and cold meat and tea.",
        "He made her eat slowly and would not let her talk.",
        "The colour came back into her face by degrees.",
        "Then she told him, in a few words, how it had been.",
        "She had worked in a shop and the wages had been cut.",
        "Then the shop had closed and there was no other place.",
        "She had eaten nothing for the last three days.",
        "She had not begged, and she had not told anyone.",
        "Rudolf said he had been sent by the good luck of the town.",
      ],
    },
    {
      lines: [
        "She asked him how he had come to knock at her door.",
        "He said he had come to see a piano tuner in the house.",
        "He would not tell her about the card and the writing.",
        "He said he would come again the next evening.",
        "She said she would be glad, and she meant it.",
        "Rudolf went down the stairs feeling like a king.",
        "At the street door he stopped and looked about him.",
        "Then he went back to the man who gave out the cards.",
        "He asked him why he had written on the two cards.",
        "The man pointed to a theatre across the street.",
        "The play being shown there was called The Green Door.",
        "Rudolf laughed and said: it was meant for me all the same.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────── O. Henry 6 von 8 ──
const A_SERVICE_OF_LOVE: Serie = {
  slug: "en-e1-a-service-of-love",
  titel: "A Service of Love",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "kultur",
  herkunft: O_HENRY,
  etappen: [
    {
      lines: [
        "Joe Larrabee came out of the flat oak country.",
        "He had the fire of art in him from the age of six.",
        "At twenty he set out for the city with a loose tie.",
        "Delia Caruthers came from a village in the pine woods.",
        "She did things with six octaves that promised much.",
        "Her relatives put up the money to send her north.",
        "Joe and Delia met in a studio and soon agreed.",
        "They married, for love is the best thing to hold to.",
        "They rented a flat and began to keep house in it.",
        "It was a lonely flat, like the low note of a piano.",
        "But they were happy, and each believed in the other.",
        "Joe was painting under the great master Magister.",
      ],
    },
    {
      lines: [
        "Delia was studying under the famous teacher Rosenstock.",
        "The lessons were dear, and the money went down fast.",
        "It goes down very fast when you do not count it.",
        "One evening Delia came home with shining eyes.",
        "She said she had found a pupil, and a fine one.",
        "The pupil was Clementina, the child of a general.",
        "The pay was five dollars a lesson, three a week.",
        "Joe said that was fine, but she must not work too hard.",
        "Delia said she loved it, and that art was long.",
        "A week later Joe came home with a look of triumph.",
        "He had sold a small sketch to a man from the country.",
        "He had eighteen dollars in his hand to prove it.",
      ],
    },
    {
      lines: [
        "So it went on for some weeks in the little flat.",
        "Each brought money home and told a small story with it.",
        "Delia spoke of Clementina and her heavy touch.",
        "Joe spoke of the man from the country and his taste.",
        "Then one evening Delia came home at five with a bandage.",
        "Her right hand was wrapped up above the wrist.",
        "Joe asked her at once what had happened to it.",
        "She said Clementina had upset a dish of hot rabbit.",
        "She said the old general had bound it up himself.",
        "Joe looked at the bandage and said nothing for a while.",
        "Then he asked what the hour had been that afternoon.",
        "Delia said it was five, and Joe asked her again.",
      ],
    },
    {
      lines: [
        "Joe said: sit down here beside me, and let us talk.",
        "He said: what have you been doing for these weeks?",
        "Delia held out for a moment and then gave way.",
        "She said there was no Clementina and no general.",
        "She had been ironing shirts in a laundry all along.",
        "The iron had burned her hand that afternoon.",
        "She said she had done it so that he could paint.",
        "Joe said: and there was no man from the country.",
        "He had been firing the engine in the same laundry.",
        "He had sent the oil and the cloth up for her hand.",
        "They both laughed, and then they were both silent.",
        "Joe said: when one loves, that is the whole of it.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────── O. Henry 7 von 8 ──
const THE_SKYLIGHT_ROOM: Serie = {
  slug: "en-e1-the-skylight-room",
  titel: "The Skylight Room",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "weltall",
  herkunft: O_HENRY,
  etappen: [
    {
      lines: [
        "Mrs Parker kept a house of rooms to let in the city.",
        "She showed the best room first, on the first floor.",
        "It had a couch and a marble stand and heavy curtains.",
        "She would let it only to a doctor or a dentist.",
        "If you did not take it, she showed a smaller one.",
        "The rooms grew smaller as you climbed the stairs.",
        "Her voice grew shorter with every flight you went.",
        "At the top there was a room under the roof itself.",
        "It had one window, and the window was in the ceiling.",
        "Mrs Parker called it the skylight room and named a price.",
        "The price was two dollars a week, and no less.",
        "Miss Elsie Leeson climbed the stairs and took it.",
      ],
    },
    {
      lines: [
        "Miss Leeson was small, and she carried her own bag.",
        "She worked at a machine and wrote what men told her.",
        "She came home late and went out again very early.",
        "She had a laugh that carried down two flights of stairs.",
        "The other lodgers liked her, and she liked them.",
        "Mr Skidder wrote plays and read them aloud to her.",
        "Miss Longnecker knew a great deal about the stars.",
        "One evening they all sat on the steps in the warm air.",
        "Miss Longnecker pointed up and named the bright ones.",
        "She named the great bear and the small one after it.",
        "Miss Leeson said she knew one that was not on the list.",
        "She said she could see it from her bed at night.",
      ],
    },
    {
      lines: [
        "She said it hung right over the pane in her ceiling.",
        "She had given it a name of her own, she told them.",
        "The name she had given it was Billy Jackson.",
        "Miss Longnecker said that was not a name for a star.",
        "Miss Leeson said it was the only name she needed.",
        "That week the work at the machine came to an end.",
        "She went out each morning and looked for another place.",
        "She came home each evening with nothing in her hand.",
        "She stopped laughing on the stairs after a while.",
        "She said she was not hungry, and she was not asked twice.",
        "One evening she climbed the last flight very slowly.",
        "She lay down on her cot without taking off her hat.",
      ],
    },
    {
      lines: [
        "Above her the small pane held the same bright star.",
        "She looked up at it and said: Billy, I am ill.",
        "She said: I am ill and I cannot get up any more.",
        "The star said nothing, as stars have always done.",
        "In the morning a lodger found the door standing open.",
        "The ambulance came and a young doctor climbed the stairs.",
        "He carried her down himself and would not wait for help.",
        "He said to the driver: drive fast, and then faster.",
        "He said her trouble was hunger and nothing else.",
        "At the hospital they asked the doctor for his name.",
        "He said: my name is William Jackson, put that down.",
        "And the report says that the patient will recover.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────── O. Henry 8 von 8 ──
const BY_COURIER: Serie = {
  slug: "en-e1-by-courier",
  titel: "By Courier",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: O_HENRY,
  etappen: [
    {
      lines: [
        "A young woman sat alone on a bench in the park.",
        "She was reading, but her eyes did not follow the page.",
        "There was a sadness about her that she did not show.",
        "A young man came along the walk with a bag in his hand.",
        "A boy in a ragged coat walked beside him with a case.",
        "The young man saw her and his face changed at once.",
        "He had been told never to speak to her again.",
        "He stopped and thought, and then he called the boy.",
        "He gave him a coin and told him what to say.",
        "The boy listened with his head on one side.",
        "Then he went over and stood in front of the bench.",
        "He said: he sent me to tell you he is going away.",
      ],
    },
    {
      lines: [
        "The young woman looked up and asked who had sent him.",
        "The boy pointed with his thumb at the other bench.",
        "He said: that gent over there with the bag and all.",
        "He says he is off to the coast and then to the north.",
        "He says you told him not to write and he has not.",
        "But he says a man may send word by a boy in a park.",
        "The young woman closed her book and sat up straight.",
        "She said: tell him that I have nothing to hear.",
        "Tell him that I saw what I saw with my own eyes.",
        "The boy went back and gave the message word for word.",
        "The young man listened and then he shook his head.",
        "He said: go back and tell her she saw a bandage.",
      ],
    },
    {
      lines: [
        "The boy went back and told her about the bandage.",
        "He said: he says the lady in the room was ill.",
        "He says her heart went bad and she fell against him.",
        "He says her father wrote him a letter about it.",
        "He says the letter is in his pocket if you want it.",
        "The young woman said: I do not want any letter.",
        "But her hands were not still in her lap any more.",
        "The boy went back and forth across the walk again.",
        "He carried the words as if they were parcels.",
        "He said to himself that grown people were very slow.",
        "At last the young man drew a letter from his coat.",
        "He gave it to the boy and said: put that in her hand.",
      ],
    },
    {
      lines: [
        "The young woman took the letter and read it twice.",
        "It was from a father, and it thanked the young man.",
        "It thanked him for what he had done in that room.",
        "It said the daughter would have died without him.",
        "The young woman folded it and held it for a moment.",
        "Then she looked across the walk at the other bench.",
        "The young man was sitting with his hat in his hands.",
        "The boy stood waiting to be sent one more time.",
        "The young woman said: go and tell him one thing.",
        "The boy said: what shall I tell him, then?",
        "She said: tell that man over there that his girl wants him.",
        "The boy went, and the two benches became one.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────── Saki 1 von 7 ──
const THE_OPEN_WINDOW: Serie = {
  slug: "en-e1-the-open-window",
  titel: "The Open Window",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "mystery",
  herkunft: SAKI,
  etappen: [
    {
      lines: [
        "My aunt will be down in a moment, said the young lady.",
        "She was fifteen, and she seemed very sure of herself.",
        "In the meantime you must put up with me, she said.",
        "Framton Nuttel tried to say something civil to her.",
        "He was in the country for a rest cure of the nerves.",
        "His sister had given him letters to the people here.",
        "She had said he would mope if he knew no one at all.",
        "He wondered whether Mrs Sappleton was one of the nice ones.",
        "Do you know many of the people round here, asked the niece.",
        "Hardly a soul, said Framton, and that is the trouble.",
        "Then you know nothing about my aunt, said the girl.",
        "Only her name and address, he said, and nothing else.",
      ],
    },
    {
      lines: [
        "Her great tragedy happened three years ago, said the girl.",
        "That would be after your sister was here, she added.",
        "Framton felt that tragedies were out of place here.",
        "You may wonder why we keep that window open, she said.",
        "It was a long window that opened on to the lawn.",
        "It is rather warm for the season, said Framton.",
        "Out through that window, three years ago to a day,",
        "her husband and her two brothers went off shooting.",
        "They never came back, said the girl, not one of them.",
        "In crossing the moor they were lost in a bog.",
        "It had been a dreadful wet summer, said the girl.",
        "Ground that was safe in other years gave way with them.",
      ],
    },
    {
      lines: [
        "My aunt always thinks they will come back some evening.",
        "She thinks they will walk in at that window again.",
        "That is why the window is kept open till it is dark.",
        "Poor dear aunt, said the girl, and her voice faltered.",
        "Just then the aunt came in and made her apologies.",
        "I hope Vera has been amusing you, she said brightly.",
        "She hoped he did not mind the open window at all.",
        "My husband and brothers will be home from shooting soon,",
        "and they always come in this way, she said.",
        "She talked on about birds and about the marshes.",
        "To Framton it was all horrible and he tried to turn it.",
        "He spoke of his own health and of what the doctors said.",
      ],
    },
    {
      lines: [
        "The aunt was not listening, and her eyes went past him.",
        "Suddenly she said: here they are at last, just in time.",
        "Framton turned and looked in the same direction.",
        "In the deep dusk three figures walked across the lawn.",
        "They all carried guns, and one had a white coat on him.",
        "A tired brown dog kept close at their heels.",
        "Framton grabbed his stick and his hat and went.",
        "He ran down the drive and out through the gate.",
        "A man on a bicycle had to run into the hedge for him.",
        "Here we are, said the man with the white coat, coming in.",
        "Who was that who ran out as we came up, he asked.",
        "The girl said he had a horror of dogs, and had a reason.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────── Saki 2 von 7 ──
const THE_STORY_TELLER: Serie = {
  slug: "en-e1-the-story-teller",
  titel: "The Story-Teller",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "kultur",
  herkunft: SAKI,
  etappen: [
    {
      lines: [
        "It was a hot afternoon and the carriage was close.",
        "The next stop was nearly an hour further on.",
        "In the carriage were a small girl and a smaller girl.",
        "There was also a small boy, and an aunt with them.",
        "A bachelor sat in the far corner and did not speak.",
        "The children took up the seats as children do.",
        "The aunt began most of her remarks with the word now.",
        "The children began most of theirs with the word why.",
        "The small boy asked why the sheep were being driven.",
        "The aunt said they were being driven to another field.",
        "The boy said the other field had more grass in it.",
        "The aunt said that farmers were often foolish men.",
      ],
    },
    {
      lines: [
        "The aunt then tried to tell them a small story.",
        "It was about a little girl who was good to everyone.",
        "Because she was good, many people came to like her.",
        "In the end she was saved from a bull by her friends.",
        "The bigger girl asked whether they would have saved her",
        "if she had not been so very good, and the aunt said yes.",
        "The children said the story was the stupidest one yet.",
        "The bachelor said aloud that he did not think much of it.",
        "The aunt turned and looked at him with some heat.",
        "She said it was not easy to tell stories to children.",
        "The bachelor said he would try, and the children agreed.",
        "He began: once upon a time there was a girl named Bertha.",
      ],
    },
    {
      lines: [
        "Bertha was good, said the bachelor, and that is rare.",
        "She was so good that she won three medals for it.",
        "One was for never being late, and she wore them all.",
        "They were large medals and they clinked as she walked.",
        "The prince of the land heard of her and was pleased.",
        "He said she might walk in his park once a week.",
        "No child had been allowed in that park before.",
        "There were no flowers in it, for the prince had said so.",
        "There were pigs and there were birds of every colour.",
        "Bertha walked about and was proud of her three medals.",
        "She thought: if I were not so good I would not be here.",
        "Just then a very large wolf came into the park.",
      ],
    },
    {
      lines: [
        "Bertha ran and hid herself in a thicket of myrtle.",
        "The wolf came near and sniffed among the leaves.",
        "He could not see her, for the bushes were thick.",
        "Bertha kept still and hardly breathed at all.",
        "But she was shaking, and the three medals clinked.",
        "The wolf heard them and came straight to the thicket.",
        "He ate her all up, and left only her shoes and medals.",
        "The pigs got safely away to the far end of the park.",
        "The children said it was the most beautiful story ever.",
        "The aunt said he had ruined years of careful teaching.",
        "The bachelor got out at his stop and looked pleased.",
        "He thought: they will ask her for that story for months.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────── Saki 3 von 7 ──
const THE_LUMBER_ROOM: Serie = {
  slug: "en-e1-the-lumber-room",
  titel: "The Lumber Room",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "abenteuer",
  herkunft: SAKI,
  etappen: [
    {
      lines: [
        "The children were to be driven to the sands that day.",
        "Nicholas was not to be one of them, and he knew why.",
        "He was in disgrace over a frog found in his bread.",
        "Older and wiser people had said there was no frog.",
        "Nicholas had put it there himself, out of the garden.",
        "So he had been right and they had been wrong.",
        "That was the whole of his offence, as he saw it.",
        "The aunt drove off with the others in the trap.",
        "She said Nicholas would be sorry all afternoon.",
        "She said he would think of the sands and the sea.",
        "Nicholas said he did not think he would be sorry.",
        "He said the boots of one cousin were far too tight.",
      ],
    },
    {
      lines: [
        "The aunt had one weakness, and Nicholas knew it well.",
        "She could not bear the thought of the gooseberry garden.",
        "It had two doors, and both of them could be locked.",
        "She spent the afternoon watching those two doors.",
        "Nicholas made two or three moves in that direction.",
        "He was never really trying to go in at all.",
        "He simply wanted her to stand there and keep guard.",
        "Once he was sure of her, he went back into the house.",
        "He had another place in mind, and a better one.",
        "In the wall of the hall hung a key on a nail.",
        "It was the key of the lumber room, and it fitted well.",
        "Nicholas turned it and let himself in and shut the door.",
      ],
    },
    {
      lines: [
        "The room was full of things that had been put away.",
        "Everything in it was strange to him, and that was best.",
        "There was a hanging of cloth on a wooden frame.",
        "On it a hunter stood with a bow, and a stag lay hit.",
        "Behind the trees two wolves were coming up unseen.",
        "Nicholas looked at it and made up the rest himself.",
        "There were candlesticks shaped like snakes and flowers.",
        "There was a teapot made in the shape of a duck.",
        "There was a book of birds, drawn and coloured by hand.",
        "He had never seen such colours in his whole life.",
        "He was still turning the pages when a voice called.",
        "The aunt was calling his name from the garden below.",
      ],
    },
    {
      lines: [
        "Nicholas put the key back and went out into the garden.",
        "The voice came from inside the water tank by the wall.",
        "The aunt had slipped and could not get out again.",
        "She called: Nicholas, go and fetch me the small ladder.",
        "Nicholas said: were you told not to go in that garden?",
        "The aunt said she was speaking to him as his aunt.",
        "Nicholas said the voice might belong to someone else.",
        "He said the Evil One often speaks with a known voice.",
        "He said he would test it: may I have strawberry jam?",
        "The aunt said yes at once, and that settled the matter.",
        "There is no strawberry jam in the house, said Nicholas.",
        "A kitchen maid found her later and brought the ladder.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────── Saki 4 von 7 ──
const DUSK: Serie = {
  slug: "en-e1-dusk",
  titel: "Dusk",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: SAKI,
  etappen: [
    {
      lines: [
        "Norman Gortsby sat on a bench in the park at dusk.",
        "The scene was fitted to his mood, as he thought.",
        "Dusk, he told himself, is the hour of the defeated.",
        "Men and women come out then who have lost the fight.",
        "They come out when their shabby clothes show less.",
        "Gortsby was not poor, but he was defeated in his way.",
        "On the bench beside him sat an elderly gentleman.",
        "He had an air of having nowhere much to go.",
        "After a while the old man got up and walked off.",
        "His place was taken at once by a young man.",
        "The young man sat down with some force and swore.",
        "Gortsby said: you do not seem in a good temper.",
      ],
    },
    {
      lines: [
        "The young man said he was in a foolish position.",
        "He had come up to town that afternoon, he said.",
        "He had meant to stay at a hotel he knew of old.",
        "When he got there the hotel had been pulled down.",
        "A cinema stood on the ground where it had been.",
        "He had taken a room at another house instead.",
        "Then he had gone out to buy a cake of soap.",
        "He had walked and walked and looked at the shops.",
        "Now he could not remember the name of the street.",
        "He had no money on him beyond two pence, he said.",
        "He was in a city where he knew not a single face.",
        "Gortsby said: the soap is the weak point of the tale.",
      ],
    },
    {
      lines: [
        "The young man felt in his pockets and found nothing.",
        "He said he must have dropped it somewhere on the way.",
        "Gortsby said: to lose a hotel and a cake of soap",
        "argues real carelessness, and he did not lend him money.",
        "The young man got up and walked away with dignity.",
        "He did not look back, and he did not ask again.",
        "Gortsby sat on and thought about the whole business.",
        "He told himself he had been right to hold back.",
        "Then he rose to go, and something lay by the bench.",
        "It was a small cake of soap in its paper wrapper.",
        "It must have fallen when the young man sat down.",
        "Gortsby picked it up and hurried after him.",
      ],
    },
    {
      lines: [
        "He caught him up at the edge of the park by a lamp.",
        "He said: I am glad I can give you back your soap.",
        "He said he had judged him wrongly and was sorry.",
        "He gave him a sovereign and asked for his address.",
        "The young man took both and thanked him warmly.",
        "He went off into the street and was soon gone.",
        "Gortsby walked back by the bench feeling better.",
        "Beside it the elderly gentleman was searching about.",
        "He was looking under the seat and among the leaves.",
        "Have you lost anything, sir, asked Gortsby.",
        "Yes, said the old man, I have lost a cake of soap.",
        "Gortsby stood still and did not say a word to that.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────── Saki 5 von 7 ──
const THE_BOAR_PIG: Serie = {
  slug: "en-e1-the-boar-pig",
  titel: "The Boar-Pig",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "tiere",
  herkunft: SAKI,
  etappen: [
    {
      lines: [
        "There is a garden party at the great house today.",
        "Mrs Stossen and her daughter had not been asked.",
        "They had made up their minds to go all the same.",
        "They put on their best clothes and set out early.",
        "The plan was to come in from the back of the grounds.",
        "There was a path through the paddock and the orchard.",
        "From the orchard a small gate led to the lawn.",
        "They walked through the long grass in their thin shoes.",
        "They reached the gate and found it locked and barred.",
        "Mrs Stossen said they would go back the way they came.",
        "Then they saw what was standing in the paddock.",
        "It was a white boar of very great size and weight.",
      ],
    },
    {
      lines: [
        "The animal stood in the gap and did not move.",
        "It looked at them with small eyes and grunted once.",
        "Mrs Stossen said that pigs were harmless as a rule.",
        "Her daughter said that this one did not look harmless.",
        "They stood among the fruit trees and did not move.",
        "Above them in a medlar tree sat a girl of thirteen.",
        "Her name was Matilda, and she had been sent outside.",
        "She had been kept from the party for bad behaviour.",
        "She had been sitting in the tree for a long while.",
        "She had opened the gate of the pig herself, for interest.",
        "Are you stuck, she asked, looking down through the leaves.",
        "Mrs Stossen said they had lost their way, and no more.",
      ],
    },
    {
      lines: [
        "Matilda said the animal would stand there for hours.",
        "She said he was fond of that gap and knew it well.",
        "She said she could move him if she had a reason.",
        "Mrs Stossen said she would be very much obliged.",
        "Matilda said obligation was a poor sort of coin.",
        "She said she was collecting for the Fresh Air Fund.",
        "She said the fund sent poor children to the sea.",
        "Mrs Stossen said she would give half a crown to it.",
        "Matilda said the sum seemed small for two ladies.",
        "The white boar turned round and grunted again.",
        "Mrs Stossen raised the sum, and raised it once more.",
        "At eight shillings and sixpence the bargain was struck.",
      ],
    },
    {
      lines: [
        "Matilda climbed down and went off to the fruit store.",
        "She came back with an apron full of ripe medlars.",
        "She held one out and called the animal by his name.",
        "He came to her at a good trot, and left the gap free.",
        "The two ladies went through and did not look back.",
        "They walked home the long way round by the road.",
        "Matilda led the boar to his sty and shut him in.",
        "She counted the money and thought about the fund.",
        "She sent two shillings and sixpence to the seaside fund.",
        "The rest of it she kept for herself, and said nothing.",
        "She said the fund had done nothing for the pig.",
        "And the pig, she said, had done most of the work.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────── Saki 6 von 7 ──
const THE_STALLED_OX: Serie = {
  slug: "en-e1-the-stalled-ox",
  titel: "The Stalled Ox",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "tiere",
  herkunft: SAKI,
  etappen: [
    {
      lines: [
        "Theophil Eshley was an artist by calling and habit.",
        "He painted cattle, and he painted nothing else.",
        "His pictures showed cows under a walnut tree at noon.",
        "Sometimes it was three cows and sometimes it was two.",
        "The critics had long ago said all there was to say.",
        "He lived beside a lady named Adela Pingsford.",
        "She had a garden that she kept with great care.",
        "One afternoon she came to his door in some heat.",
        "She said: there is an ox in my garden at this moment.",
        "Eshley said that was interesting but not his affair.",
        "She said he painted cattle and should know about them.",
        "He said painting them and driving them were two arts.",
      ],
    },
    {
      lines: [
        "She would not go away, so he came out with her.",
        "In the garden a large red ox stood among the flowers.",
        "It was eating the tall flowers with slow enjoyment.",
        "Eshley waved his hat at it in a hopeful manner.",
        "The ox looked at him and went on with its meal.",
        "He tried once more, and this time with a stick.",
        "The animal turned and walked towards the house.",
        "It went in through the open door of the morning room.",
        "Adela Pingsford made a sound that was not a word.",
        "The ox began on the flowers that stood in a bowl.",
        "Then it took an interest in the cloth of a chair.",
        "Eshley stood at the window and looked at the scene.",
      ],
    },
    {
      lines: [
        "He said the light in the room was really remarkable.",
        "He went home and came back with his easel and paints.",
        "He set the easel up on the lawn and began at once.",
        "Adela Pingsford asked him what he thought he was doing.",
        "He said he was doing what he had always wanted to do.",
        "He was painting an ox in a room, and not under a tree.",
        "She said she would go and fetch the police herself.",
        "She went, and Eshley went on with his painting.",
        "The light held for another hour and then it went.",
        "The ox grew tired of the room and walked out again.",
        "It went down the garden and out through the gap.",
        "Eshley packed up his easel and followed it home.",
      ],
    },
    {
      lines: [
        "The picture was finished in the weeks that followed.",
        "It was sent to a great show in Paris in the spring.",
        "It was hung well, and the critics stood before it.",
        "They said that here at last was a new thing from him.",
        "They said the cattle painter had found a second life.",
        "The picture made his name in a way the trees never had.",
        "He sent Adela Pingsford new plants for her garden.",
        "He sent her a book about the flowers of the alps.",
        "She thanked him in a note of four cold lines.",
        "They met at times afterwards and spoke of the weather.",
        "They never spoke of the ox or of the morning room.",
        "But he kept the picture, and she kept the note.",
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────── Saki 7 von 7 ──
const THE_PHILANTHROPIST_AND_THE_CAT: Serie = {
  slug: "en-e1-the-philanthropist-and-the-cat",
  titel: "The Philanthropist and the Happy Cat",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: SAKI,
  etappen: [
    {
      lines: [
        "Jocantha Bessbury was in a mood of good will that day.",
        "Her world was a pleasant place, and she said so.",
        "Her husband had bought her a fur that suited her.",
        "The cat lay in the best chair by the fire and purred.",
        "Jocantha looked at the cat and felt a warm thought.",
        "She said the cat was happy because it was well kept.",
        "She said she would like to make someone else happy too.",
        "Her husband went out after lunch to his club.",
        "Jocantha sat and worked out a small plan of kindness.",
        "She had a ticket for a play that she could not use.",
        "She would give it to a girl who could never afford one.",
        "She put on her coat and went out to find such a girl.",
      ],
    },
    {
      lines: [
        "She went into a tea shop where working girls came.",
        "She looked about her over the top of her cup.",
        "At a table near her sat a girl in a plain coat.",
        "The girl looked tired and was eating a small bun.",
        "Jocantha thought: here is the very one for my ticket.",
        "She began to think of the words she would use.",
        "She would say it lightly, so as not to give offence.",
        "Then a young man came in and sat at the same table.",
        "He was good looking and he had a book with him.",
        "Jocantha at once found the girl less interesting.",
        "She thought the young man looked poor and clever.",
        "She decided that the ticket should go to him instead.",
      ],
    },
    {
      lines: [
        "Now she had to make him notice that she was there.",
        "She spoke to the waitress in a voice meant to carry.",
        "She asked about the cakes and about the weather.",
        "The young man read his book and turned a page.",
        "She asked for a second cup and rattled her spoon.",
        "The young man read on and turned another page.",
        "She let her bag fall, and it made a fair noise.",
        "The young man turned a page and did not look up.",
        "At last she upset the milk jug over the table.",
        "The waitress came and mopped it up with a cloth.",
        "The young man moved his book and did not look up.",
        "The title of it was Sepoy and Sahib, in gold letters.",
      ],
    },
    {
      lines: [
        "Jocantha paid and went out into the cold street.",
        "The ticket was still in her bag, and the evening was long.",
        "She walked home and found the house very dull.",
        "The fur no longer seemed to suit her as it had.",
        "The tea was cold and the fire had burned low.",
        "She thought the world was a poor place after all.",
        "In the best chair the cat lay and purred as before.",
        "It had been out in the garden in the afternoon.",
        "It had caught its sparrow and it had eaten it.",
        "That was the whole ground of its contentment.",
        "It had wanted one thing and it had got that thing.",
        "Jocantha looked at the cat and did not like it.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────── Mansfield 1 von 2 ──
const THE_DOLLS_HOUSE: Serie = {
  slug: "en-e1-the-dolls-house",
  titel: "The Doll House",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "schule",
  herkunft: MANSFIELD,
  etappen: [
    {
      lines: [
        "Old Mrs Hay sent the children a doll house from town.",
        "It came on a cart and stood in the courtyard to air.",
        "It smelled of paint, and the smell was very strong.",
        "The father said the smell would pass in a few days.",
        "The house was green with a yellow roof and a porch.",
        "The whole front swung back on a hook to open it.",
        "Inside were four rooms with carpets and beds and chairs.",
        "There was a stove in the kitchen with tiny pans.",
        "But the best thing of all was the little lamp.",
        "It stood on the table in the middle of the room.",
        "It was made of glass and filled with something white.",
        "It looked as though it might be lit and give light.",
      ],
    },
    {
      lines: [
        "The children were to tell the school about it.",
        "They might bring two at a time to see it in the yard.",
        "Isabel would tell the story, being the eldest.",
        "Kezia wanted to tell about the lamp, and was refused.",
        "At school the news went round before the bell rang.",
        "The girls stood in a ring and Isabel held the middle.",
        "She told about the carpets and the beds and the stove.",
        "Two of the girls were asked to come that afternoon.",
        "Two more were asked for the day after that one.",
        "Nearly every girl in the class had her turn in the end.",
        "But there were two who were never asked at all.",
        "They were the Kelveys, and everyone knew about them.",
      ],
    },
    {
      lines: [
        "Their mother washed clothes for the other families.",
        "No one knew where the father was, and no one asked.",
        "The girls wore clothes made from what people gave them.",
        "Lil wore a dress cut down from a green tablecloth.",
        "Else wore a long white dress that had been a nightgown.",
        "Else never spoke and held the sleeve of her sister.",
        "At school they stood apart and no one went near them.",
        "The other children had been told to keep away.",
        "They stood at the edge of the ring and listened.",
        "They heard about the carpets and about the stove.",
        "Lil smiled her silly smile and Else looked down.",
        "Then the bell rang and everyone went inside again.",
      ],
    },
    {
      lines: [
        "One afternoon Kezia stood at the gate of the yard.",
        "The Kelveys came along the road on their way home.",
        "Kezia opened the gate and said: come and see it.",
        "Lil said they were not allowed, and shook her head.",
        "Kezia said her aunt was out and no one would know.",
        "Else pulled at the sleeve of her sister and stared.",
        "So the two of them came in and stood by the house.",
        "Kezia swung the front open on its hook for them.",
        "Then Aunt Beryl came out and called across the yard.",
        "She sent the two girls off through the gate at once.",
        "They walked away and sat down by the road to rest.",
        "Else said: I saw the little lamp, and she smiled.",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────── Mansfield 2 von 2 ──
const THE_GARDEN_PARTY: Serie = {
  slug: "en-e1-the-garden-party",
  titel: "The Garden Party",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: MANSFIELD,
  etappen: [
    {
      lines: [
        "The weather was ideal, and they could not have ordered it.",
        "Windless and warm, and the sky without a cloud in it.",
        "The gardener had been up since dawn cutting the grass.",
        "The roses had come out in hundreds overnight.",
        "Breakfast was not over when the men came with the tent.",
        "Laura went out to tell them where it should stand.",
        "She carried a piece of bread and butter in her hand.",
        "She felt it was awkward and wished she had left it.",
        "The men were tall and friendly and easy with her.",
        "One of them bent and pinched a sprig of lavender.",
        "He held it to his nose and breathed the smell in.",
        "Laura thought: why can I not have friends like these?",
      ],
    },
    {
      lines: [
        "The tent went up beside the karaka trees on the lawn.",
        "The flowers came, trays and trays of pink lilies.",
        "The band was to play in the corner by the tennis court.",
        "The cook made fifteen kinds of sandwich in the kitchen.",
        "Then Sadie came in with news from the road below.",
        "There had been an accident down in the little lane.",
        "A young carter had been thrown from his horse and killed.",
        "He lived in one of the small cottages under the hill.",
        "He left a wife and five small children behind him.",
        "Laura said at once: we must stop the garden party.",
        "Her sister Jose said she was being absurd about it.",
        "She said people like that did not expect such things.",
      ],
    },
    {
      lines: [
        "Laura went to her mother and told her the whole story.",
        "Her mother said the same and was not moved at all.",
        "She said it was not in their garden that he died.",
        "Then she took a hat from a box and set it on Laura.",
        "It was black, with gold daisies and a long ribbon.",
        "Laura saw herself in the glass and stopped speaking.",
        "The hat was becoming, and she thought about that.",
        "She went out and the guests began to arrive.",
        "The band played and the lilies stood in the tent.",
        "People said it was the most successful party of all.",
        "Laura shook hands and smiled and passed the plates.",
        "The afternoon slowly ripened and slowly faded.",
      ],
    },
    {
      lines: [
        "When it was over her mother had a sudden idea.",
        "She filled a basket with the sandwiches left over.",
        "She said Laura should take it down to the cottages.",
        "Laura went down the hill in her party dress and hat.",
        "The lane was dark and smoky and full of shadows.",
        "People stood at their doors and watched her come.",
        "A woman let her in and led her through the kitchen.",
        "Another woman drew back a sheet in the small room.",
        "The young man lay there with his eyes shut, sleeping.",
        "He was far from garden parties and baskets and lace.",
        "Laura said only: forgive my hat, and went out again.",
        "At the gate her brother met her, and she could not explain.",
      ],
    },
  ],
};

export const SERIEN_EN_ERWACHSEN_E1: readonly Serie[] = [
  THE_STORY_OF_AN_HOUR,
  A_PAIR_OF_SILK_STOCKINGS,
  RIPE_FIGS,
  A_RESPECTABLE_WOMAN,
  THE_GIFT_OF_THE_MAGI,
  THE_LAST_LEAF,
  AFTER_TWENTY_YEARS,
  THE_COP_AND_THE_ANTHEM,
  THE_GREEN_DOOR,
  A_SERVICE_OF_LOVE,
  THE_SKYLIGHT_ROOM,
  BY_COURIER,
  THE_OPEN_WINDOW,
  THE_STORY_TELLER,
  THE_LUMBER_ROOM,
  DUSK,
  THE_BOAR_PIG,
  THE_STALLED_OX,
  THE_PHILANTHROPIST_AND_THE_CAT,
  THE_DOLLS_HOUSE,
  THE_GARDEN_PARTY,
];
