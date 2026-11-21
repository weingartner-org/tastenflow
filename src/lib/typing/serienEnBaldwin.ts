/**
 * ENGLISCHE SERIEN NACH JAMES BALDWIN - Charge B1, 29.08.2026.
 * Stufe `teens`, dreizehn Geschichten.
 *
 * ── WARUM ES DIESE DATEI GIBT ─────────────────────────────────────────────
 *
 * Gezählt am 29.08.: `en/teens` hatte 27 Geschichten, das Ziel sind 40. Die
 * Quellen-Recherche (`Sensorik/QUELLEN-2026-08-29-TASTENFLOW-FREIE-TEXTE.md`)
 * hat dafür genau einen Fund vorgeschlagen, bei dem am wenigsten umzubauen
 * ist: James Baldwin, »Fifty Famous Stories Retold« (1896). Der Autor ist
 * 1925 gestorben, das Werk ist gemeinfrei, und die einzelnen Stücke sind
 * 500 bis 1000 Wörter lang - eine Serie fasst rund 450. Also einmal kürzen
 * statt neu erfinden.
 *
 * **Es sind trotzdem Nacherzählungen, keine Abschriften.** Bauplan §10
 * verlangt das ausdrücklich („modern und nicht so grausam nacherzählen"), und
 * hier kommt dazu: Baldwins Sätze sind 1896er Schulbuchsprache mit
 * Apostrophen, Zitatzeichen und Trennstrichen mitten im Wort. Nichts davon
 * ist tippbar. Jede Zeile unten ist neu geschrieben.
 *
 * ── WAS AUS DEN FÜNFZIG NICHT ÜBERNOMMEN WURDE, UND WARUM ────────────────
 *
 * ★★ **»The Blind Men and the Elephant« kommt in dieser App nicht vor.** Die
 * Geschichte benutzt Blindheit als Bild für Ahnungslosigkeit; im Original
 * sagen die Männer einander „Oh, how blind you are!" und „the blindest man
 * ought to know". Das ist am Quelltext geprüft, nicht vermutet. Für eine
 * Plattform, die Kinder mit Blindheit unterrichtet, ist der Stoff erledigt -
 * auch entschärft.
 *
 * ⚠️ **»George Washington and his Hatchet« ebenfalls nicht.** Die Anekdote
 * geht auf Parson Weems (1806) zurück und gilt in der Fachwelt seit Lodges
 * Biografie von 1889 als erfunden. Als Geschichte erzählbar, aber nur mit dem
 * Hinweis, dass sie erfunden ist - und den trägt eine Tippserie schlecht.
 *
 * ⚠️ **»Pocahontas« nicht** - eine Kolonialerzählung aus der Sicht der
 * Kolonisatoren, die ohne Einordnung nicht zu haben ist.
 *
 * ⚠️ **Die Kriegsstücke nicht** (Horatius at the Bridge, The Brave Three
 * Hundred, Arnold Winkelried, Casabianca). Sie leben davon, dass jemand
 * stirbt.
 *
 * ★ **Zwei religiöse Schlüsse sind gekürzt.** Baldwin lässt Canute auf einen
 * allmächtigen Gott verweisen und Charney Gott für die Pflanze danken. Der
 * Kern beider Geschichten - Macht hat Grenzen; etwas Lebendiges hält einen
 * Menschen aufrecht - trägt ohne das.
 *
 * ── DAS ZEICHEN-BUDGET ────────────────────────────────────────────────────
 *
 * ★★★ **Fünf der dreizehn öffnen bei 25 Einheiten, acht erst bei 29/30.**
 * Das ist die wichtigste Zahl dieser Datei, und sie war beim ersten Bau falsch.
 *
 * Gemessen: Die Sperre ist bei ALLEN dreizehn dasselbe Zeichen - das `y` an
 * Position 29 von `INTRO_ORDER`. Nicht die historischen Eigennamen, wie im
 * ersten Anlauf behauptet, sondern *they, day, say, very, only, you* und
 * **jedes Adverb auf -ly**. Wer eine Baldwin-Geschichte auf eine frühere
 * Sprosse bringen will, baut um diese Wörter herum, nicht um „Bucephalus".
 *
 * Auf **Sprosse 25** umgebaut (ohne `y x q`, also ohne direkte Anrede):
 *   Bruce and the Spider · The Bell of Atri · Androclus and the Lion ·
 *   Grace Darling · A Laconic Answer
 * Die anderen acht bleiben bei 29/30, weil sie von direkter Rede leben -
 * ohne `y` gibt es kein *you*, und „Am I the greatest man in the world?"
 * ist der Kern von Canute.
 *
 * ⚠️ **Was auf Sprosse 25 wegfällt**, an den fünf Umbauten gemessen:
 * *say* (aber `said` geht), *try* (aber `tried` geht), *they, you, your, my,
 * by, day, very, any, many, only, year, city, country, story, army, ready,
 * happy, boy, eye, money, always, already, today* - und **alle Adverbien auf
 * -ly**. Ersatz: „with care", „at once", „in the end", „out loud".
 * ⚠️ Ohne `x` fällt **`six`** aus. Bei Bruce ist die Sechs die halbe
 * Geschichte; sie steht jetzt als „five times, and then once more" da, und
 * das `seventh` trägt kein Sonderzeichen.
 * ⚠️ **»Picciola« war als sechster Umbau vorgesehen und scheitert am Namen:**
 * `Charney` trägt ein `y`. An seiner Stelle steht »A Laconic Answer« - eine
 * Geschichte über kurze Wörter, was hier gut passt.
 *
 * ⚠️ **Keine Ziffern.** Eine einzige Jahreszahl hätte alle dreizehn Serien auf
 * Tier 5 gehoben. Zahlen stehen deshalb ausgeschrieben („seven times", „two
 * hundred pounds").
 *
 * `minTier` bleibt bei allen dreizehn **3** - das Tier misst den Zeichensatz
 * (T3 = ganzes Alphabet), der Öffnungspunkt misst die Einheiten. Zwei
 * verschiedene Größen; nur die zweite hat sich bewegt.
 *
 * ⚠️ **Keine Apostrophe** - der englische Serien-Test verbietet sie. Also
 * `did not` statt der Kurzform, und `the crown of the king` statt der
 * Genitiv-Form. Das liest sich etwas förmlicher; es ist der Preis.
 *
 * ── HERKUNFT ──────────────────────────────────────────────────────────────
 *
 * Gemeinfrei, also ohne Lizenzpflicht. Die Nennung steht trotzdem an jeder
 * Serie: Wer den Stoff eines Menschen benutzt, nennt ihn.
 */
import type { Serie } from "./serie";

/**
 * Baldwin ist 1925 gestorben; das Werk erschien 1896. Gemeinfrei in Österreich
 * und Deutschland (70 Jahre nach dem Tod) wie in den USA (vor 1930 erschienen).
 * `lizenz: "gemeinfrei"` ist bewusst so kurz - `validateHerkunft` sucht in
 * diesem Feld nach der Silbe `nd` und schlägt bei jeder ND-Lizenz an.
 */
const BALDWIN = {
  quelle: "James Baldwin, Fifty Famous Stories Retold (1896), Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "James Baldwin",
  fundstelle: "gutenberg.org/ebooks/18442",
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Die Durchhalte-Geschichte der Sammlung. Sechs Fehlversuche, dann der siebte.
// Für einen Tipptrainer, in dem ein Kind lange an einer Taste sitzt, ist das
// der passendste Stoff der ganzen fünfzig - darum steht er an erster Stelle.
const BRUCE_AND_THE_SPIDER: Serie = {
  slug: "en-baldwin-bruce-and-the-spider",
  titel: "Bruce and the Spider",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "mut",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "Robert Bruce was a king in Scotland long ago.",
        "The times he lived in were hard and full of war.",
        "The king of England had marched a great force north.",
        "He meant to drive Bruce out of his own land.",
        "Bruce gathered his men and led them into battle.",
        "His men fought well, but the battle was lost.",
        "A second time he called them out, and lost again.",
        "A third and a fourth time it went the same.",
        "Five times he had led them out, and five times lost.",
        "Then he went out once more, and it ended as before.",
        "His force was scattered across the hills and gone.",
        "He hid himself in the woods with nothing left.",
      ],
    },
    {
      lines: [
        "One wet morning he sat under a rough shed of branches.",
        "Rain dripped from the roof and ran along the ground.",
        "He was tired to the bone and sick at heart.",
        "He thought there was no use in a fresh effort.",
        "A kingdom, he told himself, was not for such a man.",
        "While he sat there he looked at the beam above him.",
        "A spider was there, at work on a web.",
        "She had to throw a thread from one beam to the far one.",
        "Bruce watched her swing out on her thin line.",
        "The thread fell short, and she had to start again.",
        "A second time she threw, and a second time it fell.",
        "He counted without meaning to: three, then four, then five.",
      ],
    },
    {
      lines: [
        "Then she threw once more, and that throw fell as well.",
        "Five throws and one more, and all had come to nothing.",
        "Bruce spoke to her out loud, alone in the wet shed.",
        "She knew as well as he did what it is to fail, he said.",
        "But the spider did not stop after that last throw.",
        "She drew herself up and made a fresh start.",
        "This time she worked slow and with more care.",
        "Bruce forgot his own trouble and watched her.",
        "She swung out on the line for the seventh time.",
        "The thread flew across and caught on the far beam.",
        "It held. She set to work on it at once.",
        "Then I will make a seventh attempt, he said.",
      ],
    },
    {
      lines: [
        "He rose, went out into the rain and called his men.",
        "One after the other his men came in from the hills.",
        "He told them what he meant to do and where to go.",
        "He sent word to towns that had given up hope.",
        "The word went from house to house across the land.",
        "In time a new force stood with him, larger than before.",
        "A seventh battle was fought, and this time it held.",
        "The king of England took his force home again.",
        "Bruce kept the crown, and Scotland kept its own laws.",
        "It is said that no one named Bruce ever harmed a spider.",
        "Not in a house, and not out on the open moor.",
        "The lesson the small creature taught was not forgotten.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Gerechtigkeit, die auch für den gilt, der nicht sprechen kann. Baldwins
// Original singt den Glockenton in Versen; hier steht Prosa, weil ein Reim
// beim Tippen nur stolpert.
const THE_BELL_OF_ATRI: Serie = {
  slug: "en-baldwin-the-bell-of-atri",
  titel: "The Bell of Atri",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "gerechtigkeit",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "Atri is an old town, built on the side of a steep hill.",
        "Long ago the king of Atri bought a great bell.",
        "He had it hung in a tower above the market place.",
        "A long rope hung from the bell down to the ground.",
        "It hung so low that the smallest child could reach it.",
        "This is the bell of justice, the king told the people.",
        "It must never be rung, he said, without real need.",
        "If a person here is wronged, let that person ring it.",
        "Then the judges will come and hear the case at once.",
        "Rich and poor, old and small: the rope is for all.",
        "But no one is to touch it who has not been wronged.",
        "The people looked up at the bell and went home.",
      ],
    },
    {
      lines: [
        "Season after season passed, and the bell was rung.",
        "Wrongs were heard in the market place and set right.",
        "In the end the rope grew thin and began to come apart.",
        "The lower strands broke off, one after the other.",
        "Soon a tall man alone could reach what was left.",
        "This will not do, said the judges when it was shown to them.",
        "What if a child is wronged and cannot reach the rope?",
        "A new rope was sent for, but there was none in Atri.",
        "One would have to come across the mountains.",
        "A man who stood near said he would mend it for now.",
        "He came back from his garden with a long grape vine.",
        "He tied it to the bell, leaves and tendrils and all.",
      ],
    },
    {
      lines: [
        "On the hill above the town lived an old knight.",
        "In earlier times he had ridden through much of the world.",
        "His horse had carried him out of one danger after another.",
        "But as he grew older he cared for nothing but gold.",
        "He sold his land, his house and all that he owned.",
        "He kept the horse alone, and then he grudged it its feed.",
        "The beast earns me nothing, he said to himself.",
        "So he turned the old horse out onto the bare hillside.",
        "It wandered the roads, lame and thin and cold.",
        "One hot afternoon it came into the market place.",
        "The heat had driven each person indoors to rest.",
        "The horse saw green leaves hanging from the tower.",
      ],
    },
    {
      lines: [
        "It stretched its thin neck and took a leaf in its mouth.",
        "The vine held fast, so the horse pulled harder at it.",
        "High above, the great bell swung and began to ring.",
        "The sound rolled down the hot streets of the town.",
        "The judges heard it, put on their robes and came out.",
        "Who could be ringing the bell at such an hour?",
        "At the tower stood the old horse, at work on the vine.",
        "One judge said: this is the horse of the miser.",
        "It has come to ask for justice, and it shall have it.",
        "People crowded in and told of the hills and the hunger.",
        "The judges sent for the miser and gave their ruling.",
        "Half of all his gold would keep the horse to the end.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Mitgefühl, das zurückkommt. Baldwins Fassung führt einen Mann in die Arena
// zu einem hungrigen Löwen; hier bleibt die Szene, aber die Todesangst wird
// nicht ausgemalt. Person zuerst: ein Mann, der als Sklave gehalten wurde.
const ANDROCLUS_AND_THE_LION: Serie = {
  slug: "en-baldwin-androclus-and-the-lion",
  titel: "Androclus and the Lion",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "tiere",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "In old Rome there lived a man called Androclus.",
        "He was held as a slave, and the man who held him was cruel.",
        "At last Androclus ran, and took to the wild woods.",
        "For a week and more he found little to eat and grew weak.",
        "One evening he crept into a cave and fell asleep.",
        "A loud noise woke him: a lion had come into the cave.",
        "Androclus held still and thought his end had come.",
        "But the lion did not spring at him or show anger.",
        "It limped across the stone floor and settled down.",
        "It held one front paw up off the ground and moaned.",
        "Androclus watched the paw for a long while.",
        "Then he did a thing he could not later account for.",
      ],
    },
    {
      lines: [
        "He crossed the cave and took hold of the sore paw.",
        "The lion stood still and let him lift it.",
        "It rubbed its head on his shoulder as he worked.",
        "Deep in the pad there was a long thorn, driven in hard.",
        "Androclus took the end of it between two fingers.",
        "He gave one strong pull, and the thorn came out.",
        "The lion leapt about the cave like a small dog.",
        "It licked his hands and would not leave his side.",
        "That night the two of them slept in the same cave.",
        "For months after that the lion brought him food.",
        "Androclus lived in the woods and was not afraid.",
        "It was, he said later, a better life than the one before.",
      ],
    },
    {
      lines: [
        "One noon some soldiers came through the wood.",
        "Soldiers found him and knew at once who he was.",
        "He was taken back to Rome in irons.",
        "The law then was hard on all who ran from a master.",
        "Androclus was to be sent into the arena to face a lion.",
        "A lion was shut up and kept without food.",
        "A morning was set, and thousands came to watch.",
        "Such a place drew a crowd, as a match does now.",
        "Androclus was led out onto the sand of the arena.",
        "He looked up and found no kindness in the rows above.",
        "Then a gate was drawn back and the lion came out.",
        "It crossed the sand at a run and reached him at once.",
      ],
    },
    {
      lines: [
        "Androclus called out, and it was not from fear.",
        "It was his friend from the cave in the wild wood.",
        "The crowd stood up, and then the crowd went silent.",
        "All of them saw both arms go round the neck of the lion.",
        "The beast settled at his feet and pushed its head at him.",
        "No one in all those rows could make sense of it.",
        "In the end the crowd called on him to account for it.",
        "So Androclus stood up, one hand on the mane, and told them.",
        "He told of the thorn, the cave and the months of food.",
        "I am a man, he said, and no man has been good to me.",
        "This lion alone was good, and we hold to each other.",
        "Live and be free, the crowd called back. Live and be free.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Vertrauen, das jemand mit dem eigenen Leben deckt. Der Stoff ist antik und
// bekannt; er steht hier, weil er ohne Kampf auskommt.
const DAMON_AND_PYTHIAS: Serie = {
  slug: "en-baldwin-damon-and-pythias",
  titel: "Damon and Pythias",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "freundschaft",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "In Syracuse there ruled a hard man named Dionysius.",
        "A young man called Pythias had spoken against him.",
        "For that he was taken and shut up in the prison.",
        "A day was set on which he was to lose his life.",
        "His home lay far off, across the sea from the city.",
        "His father and mother did not know what had happened.",
        "Let me go home and say farewell to them, he asked.",
        "Then I will come back and give myself up again.",
        "The ruler laughed at him and shook his head.",
        "How could I know that you would ever return?",
        "You want to save yourself, and nothing more.",
        "You would take ship and I would never see you again.",
      ],
    },
    {
      lines: [
        "Then a second young man stepped out and spoke.",
        "His name was Damon, and Pythias was his friend.",
        "Put me in the prison in his place, he said.",
        "Let him go home and set his affairs in order.",
        "He has never in his life broken a word he gave.",
        "He will come back on the day that you have set.",
        "And if he is not here by then, I will die instead.",
        "The ruler was astonished that anyone would offer this.",
        "He had not thought such an offer possible.",
        "In the end he agreed and had Damon shut up.",
        "Pythias went down to the harbour and took ship.",
        "The prison door closed on a man who had done nothing.",
      ],
    },
    {
      lines: [
        "Weeks went by, and the set day came nearer.",
        "Pythias did not return, and no word came from him.",
        "The ruler told the jailer to watch Damon closely.",
        "But Damon made no move at all to get away.",
        "His trust in his friend had not shifted an inch.",
        "If he is not back in time, Damon said, it is not his doing.",
        "Something has held him against his own will.",
        "At last the day came, and then the very hour.",
        "Damon was ready and said he did not grieve.",
        "To suffer for a man he loved was no hard thing.",
        "The jailer came to the cell to lead him out.",
        "At that same moment a shape stood in the doorway.",
      ],
    },
    {
      lines: [
        "It was Pythias, worn out and wet to the skin.",
        "Storms had held his ship, and then it had wrecked.",
        "He had feared all the way that he would come too late.",
        "He greeted Damon and then turned to the jailer.",
        "He gave himself up and asked that his friend go free.",
        "He was glad, he said, that he had come in time.",
        "The ruler heard the whole of it and stood silent.",
        "He was not so hard that he could not see what this was.",
        "Men who trust each other like that, he said, should live.",
        "He would not put them to death over a few words.",
        "He set them both free and let them go home.",
        "I would give all I own for one such friend, he said.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Genau hinsehen statt zwingen. Im Original wird das Pferd geschlagen; hier
// steht nur, dass die Männer es nicht halten konnten.
const ALEXANDER_AND_BUCEPHALUS: Serie = {
  slug: "en-baldwin-alexander-and-bucephalus",
  titel: "Alexander and Bucephalus",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "tiere",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "King Philip of Macedon bought a fine black horse.",
        "Its name was Bucephalus, and it cost a great sum.",
        "It was tall and strong, and it moved well.",
        "But no one at the court could get up onto its back.",
        "It reared and swung and would not stand for a rider.",
        "The grooms tried hard, and it grew worse with each try.",
        "The more they crowded it, the less it would bear them.",
        "At last the king had had enough of the whole thing.",
        "Take it away, he said, and let me hear no more.",
        "His young son Alexander had watched from the wall.",
        "It is a pity to lose a horse as good as that, he said.",
        "Those men do not know how to go about it.",
      ],
    },
    {
      lines: [
        "The king turned round and looked at the boy.",
        "So you could do better than my own grooms?",
        "I think I could, said Alexander, if you let me try.",
        "And if you fail, said his father, what then?",
        "Then I will pay you what the horse cost, said the boy.",
        "The men at the court laughed out loud at that.",
        "But the king waved his hand and let him go.",
        "Alexander walked down and did not run at the horse.",
        "He had watched it for some time from above.",
        "He had seen that it shied whenever it turned east.",
        "It was not the men that frightened it, or the noise.",
        "It was the black shape moving on the ground beside it.",
      ],
    },
    {
      lines: [
        "The horse was afraid of nothing but its own shadow.",
        "So Alexander took the bridle and turned its head.",
        "He turned it until it faced straight into the sun.",
        "Now the shadow fell behind, out of its sight.",
        "He stood at its shoulder and spoke to it quietly.",
        "He kept the same voice and did not hurry at all.",
        "He stroked its neck until the shaking stopped.",
        "The horse stood still and let him stay beside it.",
        "Then, in one quick spring, he was on its back.",
        "Everyone there expected the boy to be thrown.",
        "But he kept his seat and did not pull it up.",
        "He let it run out along the plain as far as it liked.",
      ],
    },
    {
      lines: [
        "When at last it slowed, he turned it and rode back.",
        "He came at a walk to the place where his father stood.",
        "The whole court shouted when they saw who held the reins.",
        "Alexander got down, and the king came and held him.",
        "My son, he said, Macedon is too small for you.",
        "You must look for a kingdom that will fit you.",
        "From that day the two of them were rarely apart.",
        "Where one was seen, the other was not far off.",
        "The horse would let no other person mount it.",
        "It carried Alexander through many lands and years.",
        "More than once it carried him out of great danger.",
        "It began with a boy who watched, and saw a shadow.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Grenzen der Macht. Baldwins Schluss weist auf einen allmächtigen Gott; hier
// endet es bei der Krone im Sand - die überlieferte Pointe.
const KING_CANUTE_AND_THE_TIDE: Serie = {
  slug: "en-baldwin-king-canute-and-the-tide",
  titel: "King Canute and the Tide",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "macht",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "Canute was a king who ruled in England long ago.",
        "He came from Denmark and held a wide kingdom.",
        "The men around him were officers of his court.",
        "They praised him from the hour he woke until night.",
        "You are the greatest man who has ever lived, said one.",
        "There has never been a king so mighty, said another.",
        "There is nothing in the world that dares to disobey you.",
        "Canute had sense, and he grew tired of hearing it.",
        "He knew what he was and what he was not.",
        "He knew that praise of that kind buys nothing.",
        "One day he walked down to the shore with them.",
        "The tide was out, and the wet sand lay bare.",
      ],
    },
    {
      lines: [
        "They followed him along the beach, praising as they went.",
        "He decided that he would teach them something.",
        "He told his men to carry down his heavy chair.",
        "Set it here, he said, close by the edge of the water.",
        "They set the chair on the sand and stood around it.",
        "Canute sat down and looked out at the grey sea.",
        "Am I the greatest man in the world? he asked them.",
        "There is no one so mighty as you, they said at once.",
        "Do all things in this kingdom obey me? he asked.",
        "Nothing dares to disobey you, they said. Nothing at all.",
        "Then Canute looked down at the small waves at his feet.",
        "And will the sea obey me? he asked them.",
      ],
    },
    {
      lines: [
        "The officers looked at each other and said nothing.",
        "None of them dared to be the first to say no.",
        "Command it, one of them said at last, and it will obey.",
        "So Canute leaned forward and spoke to the water.",
        "Sea, he said, I command you to come no further.",
        "Waves, stop where you are and do not touch my feet.",
        "The men stood behind the chair and waited.",
        "The tide came in, exactly as it always had.",
        "It came up over the sand and around the chair legs.",
        "It wet the feet of the king, and then his robe.",
        "Canute did not move, and the water kept rising.",
        "His officers began to wonder if he had lost his mind.",
      ],
    },
    {
      lines: [
        "At last he stood up, with his robe heavy and dark.",
        "He walked back up the beach out of the water.",
        "Then he took the crown off his own head.",
        "He looked at it for a moment and let it fall.",
        "It lay there in the wet sand at his feet.",
        "I will not wear it again, he said to the men.",
        "You have called me the master of all things.",
        "Now you have seen how far a king really reaches.",
        "The sea did not hear me, and the tide came in.",
        "Learn from what you have watched here today.",
        "He walked back to the town without the crown.",
        "The story is told to this day, and it is told for that.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Wenig brauchen. Die berühmteste Antwort der Antike, und sie ist eine Bitte
// um nichts weiter als Sonnenlicht.
const DIOGENES_AND_THE_SUNLIGHT: Serie = {
  slug: "en-baldwin-diogenes-and-the-sunlight",
  titel: "Diogenes and the Sunlight",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "denken",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "In the city of Corinth there lived a thinker.",
        "His name was Diogenes, and he was known everywhere.",
        "People came from all over Greece to hear him talk.",
        "But his way of living was strange to most of them.",
        "He held that no one should own more than they needed.",
        "And he held that a person needs very little indeed.",
        "So he kept no house of his own in the city.",
        "He slept in a large tub, which he rolled from place to place.",
        "He spent his days sitting in the sun near the market.",
        "He said what he thought to whoever stopped to listen.",
        "He had no servants, no chest of clothes, no land.",
        "He seemed, to those who watched him, quite content.",
      ],
    },
    {
      lines: [
        "One day at noon he walked through the busy streets.",
        "He carried a lantern, lit, although the sun was high.",
        "He held it up and looked into the faces he passed.",
        "People stopped and stared at him as he went.",
        "Why do you carry a lamp when the sun is shining?",
        "I am looking for an honest man, he answered.",
        "He walked on and left them to think about it.",
        "Some laughed, and some did not laugh at all.",
        "Word of the man in the tub spread beyond Corinth.",
        "It reached the court of Alexander of Macedon.",
        "Alexander by then had taken half the known world.",
        "He wanted to see this thinker for himself.",
      ],
    },
    {
      lines: [
        "When Alexander came to Corinth, the city turned out.",
        "The leading men came to greet him and to praise him.",
        "One man did not come, and it was Diogenes.",
        "He was the only man whose view Alexander cared about.",
        "So the king went to find him instead.",
        "He found him in an out of the way corner of the city.",
        "Diogenes lay on the ground beside his tub.",
        "He was taking in the warmth and light of the sun.",
        "Alexander came up with a crowd of officers behind him.",
        "Diogenes sat up and looked at the king.",
        "I have heard a great deal about your wisdom, said Alexander.",
        "Is there anything at all that I can do for you?",
      ],
    },
    {
      lines: [
        "Diogenes thought about the question for a moment.",
        "Yes, he said. There is one thing you can do.",
        "Alexander waited, and so did all the men behind him.",
        "You can stand a little to one side, said Diogenes.",
        "You are keeping the sunshine off me.",
        "That was the whole of it. He asked for nothing else.",
        "The answer was not what the king had expected.",
        "It did not make him angry, which surprised his officers.",
        "It made him think better of the man, not worse.",
        "As he rode away, Alexander said to them:",
        "Say what you like about him. If I were not Alexander,",
        "I would want to be Diogenes.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Eine wahre Begebenheit von 1838. ⚠️ Baldwin nennt weder Jahr noch Schiff;
// diese Fassung nennt sie ebenfalls nicht - sonst müsste jede Zahl geprüft
// werden UND die Serie stiege auf Tier 5. Was hier steht, steht bei Baldwin.
const GRACE_DARLING: Serie = {
  slug: "en-baldwin-grace-darling",
  titel: "Grace Darling",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "mut",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "It was a dark morning in September, and a storm was out.",
        "Off the shore of the Farne Islands lies a low rock.",
        "In the night a ship had been driven onto that rock.",
        "The waves had broken the hull clean into two parts.",
        "One half had been carried off in the dark.",
        "The other half still held, and there were people on it.",
        "Men clung to what was left of the masts and rails.",
        "Each wave that came broke straight over them.",
        "It was clear the wreck would not hold much longer.",
        "On one of the islands there stood a lighthouse.",
        "In it lived the keeper and his daughter, Grace Darling.",
        "She had lived beside that sea all her life.",
      ],
    },
    {
      lines: [
        "All through the night she had listened to the storm.",
        "Above the wind she thought she heard cries.",
        "She could not be sure, and she could see nothing.",
        "When the first light came she went to the window.",
        "A mile off she could make out the broken ship.",
        "She could see dark shapes holding to the masts.",
        "We must reach them, she said to her father.",
        "Let us take the boat out now, before it breaks up.",
        "It is no use, Grace, her father said. We cannot get to them.",
        "He was an old man and knew what those waves could do.",
        "We cannot sit here and watch them drown, she said.",
        "We must at least make the attempt. He could not refuse.",
      ],
    },
    {
      lines: [
        "Within minutes the two of them had the boat out.",
        "It was the great lighthouse boat, built for weather.",
        "Grace took one oar and her father took the other.",
        "The two of them pulled out from the island for the rock.",
        "The sea ran hard against them the whole while.",
        "Twice it seemed the boat would be turned right around.",
        "It took far longer than either of them had thought.",
        "At last the boat came in close under the wreck.",
        "Here the danger was worse than out in open water.",
        "The waves broke against the boat and threw it about.",
        "Hard rowing alone kept it off the edges of the rock.",
        "Her father watched for his moment and climbed across.",
      ],
    },
    {
      lines: [
        "While he was on the wreck, Grace held the boat alone.",
        "She had both oars and the whole sea against her.",
        "One after the other the worn out crew were helped down.",
        "It was all she could do to hold the boat off the rock.",
        "Then her father climbed back into his place.",
        "Strong hands took the oars, and the boat turned for home.",
        "In time all of them were inside the lighthouse.",
        "There Grace looked after them until the storm dropped.",
        "She was as sure a nurse as she had been a sailor.",
        "When the men were strong again, each went home.",
        "This was long ago, but the name is not forgotten.",
        "On her grave beside the sea a stone figure holds an oar.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Etwas Lebendiges, das einen Menschen aufrecht hält. Baldwins Schluss dankt
// Gott; hier endet es bei dem, was die Kaiserin sagt und tut.
const PICCIOLA: Serie = {
  slug: "en-baldwin-picciola",
  titel: "Picciola",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "hoffnung",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "Many years ago a man was shut up in a prison in France.",
        "His name was Charney, and he had done nothing wrong.",
        "He had been put there on a charge that was not true.",
        "It seemed to him that no one in the world thought of him.",
        "There were no books in that prison for him to read.",
        "He was not allowed pen or paper, so he could not write.",
        "The days went by slowly and all of them were the same.",
        "His one thing to do was to walk in the paved yard.",
        "He walked it end to end, hour after hour.",
        "He had counted the paving stones a thousand times.",
        "One spring morning he stopped in the middle of a step.",
        "Between two stones there was a small mound of earth.",
      ],
    },
    {
      lines: [
        "He bent down to look at what had pushed it up.",
        "A seed had fallen into the crack and had sprouted.",
        "One green leaf was working its way out of the ground.",
        "Charney lifted his foot to crush it and then stopped.",
        "He saw that the leaf had a soft coat over it.",
        "That coat is there to keep it safe, he said out loud.",
        "So he stepped around it and walked on.",
        "The next day he nearly trod on it before he remembered.",
        "There were two leaves now, and the stem was stronger.",
        "He crouched by it for a long time, looking at every part.",
        "After that he went to it first thing each morning.",
        "He wanted to know if the cold or the sun had hurt it.",
      ],
    },
    {
      lines: [
        "One day he saw the jailer walk right past the plant.",
        "The man came so close that Charney shook from head to foot.",
        "When his food came he begged the jailer to spare it.",
        "He expected to be laughed at for such a request.",
        "But the jailer had a kinder heart than he looked.",
        "Do you think I would harm your plant? he said.",
        "It would have died long ago if I had not watched out for it.",
        "Charney felt ashamed of what he had thought of the man.",
        "He gave the plant a name and called it Picciola.",
        "When the dog of the jailer nearly broke it, he built a house.",
        "He used the firewood he was given, night after cold night.",
        "He learned how it turned to the sun and folded before rain.",
      ],
    },
    {
      lines: [
        "In summer it carried thirty flowers on one stem.",
        "Then one morning it began to droop, and he could not stop it.",
        "The stones held the roots and the plant was dying.",
        "Only the highest officers could order stones lifted.",
        "So Charney made ink from soot and water in his cell.",
        "He spread out his handkerchief to use in place of paper.",
        "With a sharpened stick he wrote the story of the plant.",
        "He sent it out with a young woman who promised to carry it.",
        "It went to the court, and it was read there.",
        "The wife of the emperor heard the whole of it.",
        "A man who cares for a plant like that is no danger.",
        "The stones were lifted, and Charney was set free.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Eine Geschichte, die nicht aufhört - Korn für Korn, Heuschrecke für
// Heuschrecke. Für einen Tipptrainer, in dem Zeile für Zeile getippt wird,
// ist das die selbstironischste Wahl der ganzen Sammlung.
const THE_ENDLESS_TALE: Serie = {
  slug: "en-baldwin-the-endless-tale",
  titel: "The Endless Tale",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "geschichten",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "In a land far to the east there was a king with no work.",
        "He sat all day on soft cushions and listened to stories.",
        "It did not matter to him what a story was about.",
        "He never grew tired, however long it ran.",
        "There is only one fault in your tale, he would say.",
        "It is far too short. And then he would look sad.",
        "Every storyteller in the world was called to his palace.",
        "Some of them told tales that went on for weeks.",
        "But each of them came to an end, and the king grieved.",
        "So he sent word out to every town in the kingdom.",
        "He offered a prize for a story that had no end at all.",
        "He would marry the daughter of the king and rule after him.",
      ],
    },
    {
      lines: [
        "But he added a hard condition to the offer.",
        "Anyone who tried and failed would lose his head.",
        "The daughter of the king was well liked in that country.",
        "Many young men would have done much to marry her.",
        "But none of them wished to lose a head over it.",
        "So very few came forward, and those few did not last.",
        "One man told a tale that ran for three whole months.",
        "At the end of it he could think of nothing more.",
        "What happened to him was a warning to the rest.",
        "For a long time after that, no one tried at all.",
        "Then one morning a stranger came in from the south.",
        "He walked into the hall and stood before the king.",
      ],
    },
    {
      lines: [
        "Is it true, he asked, that you offer a prize?",
        "For a story that has no end? It is true, said the king.",
        "And the man who tells it marries your daughter?",
        "Yes, said the king, if he succeeds. If not, he loses his head.",
        "Very well, said the stranger. I have a tale about locusts.",
        "Tell it, said the king, and sat back on his cushions.",
        "Once there was a king who took all the corn in his land.",
        "He stored it in a granary with very thick walls.",
        "But a swarm of locusts came over the fields and found it.",
        "After many days they found a crack on the east side.",
        "It was just wide enough for one locust at a time.",
        "So one locust went in and carried away one grain of corn.",
      ],
    },
    {
      lines: [
        "Then another locust went in and carried away a grain.",
        "Then another locust went in and took a grain as well.",
        "Day after day the stranger said the same sentence.",
        "Week after week the locusts went in and came out.",
        "A month went by. Then a whole year went by.",
        "At the end of the second year the king spoke up.",
        "How much longer will these locusts be at it?",
        "They have cleared one cubit so far, said the storyteller.",
        "There are many thousand cubits in that granary.",
        "Man, cried the king, you will drive me out of my mind.",
        "Take my daughter, be my heir, rule the kingdom.",
        "Only never let me hear of those locusts again.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Können, das aus Übung kommt und nicht aus Herkunft. Der Junge schnitzt
// keinen Marmor, sondern Butter - und wird einer der großen Bildhauer.
const ANTONIO_CANOVA: Serie = {
  slug: "en-baldwin-antonio-canova",
  titel: "Antonio Canova",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "kunst",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "In Italy, years ago, there lived a boy named Antonio Canova.",
        "His father had died, and he lived with his grandfather.",
        "The old man cut stone for a living and was very poor.",
        "Antonio was small and not strong enough for heavy work.",
        "He did not care much for the games of the other boys.",
        "But he liked going with his grandfather to the stone yard.",
        "The old man cut and trimmed the great blocks of stone.",
        "The boy sat among the chips and made things of his own.",
        "Sometimes he shaped a small figure out of soft clay.",
        "Sometimes he took a hammer and chisel to a bit of rock.",
        "His grandfather watched him and was delighted.",
        "That boy will be a sculptor one day, he said.",
      ],
    },
    {
      lines: [
        "In the same town there lived a rich man, a count.",
        "Now and then the count held a great dinner.",
        "Friends came from other towns to sit at his table.",
        "The grandfather went up to help in the kitchen then.",
        "He was a good cook as well as a good stone cutter.",
        "One day Antonio went along with him to the house.",
        "Guests were coming from the city and there was much to do.",
        "The boy could not cook and was too young to serve.",
        "But he could scour pans and fetch and carry.",
        "He was quick, and he made himself useful all morning.",
        "Then, as the table was being laid, there was a crash.",
        "A man ran into the kitchen holding pieces of marble.",
      ],
    },
    {
      lines: [
        "I have broken the statue for the middle of the table.",
        "What am I to do? What will the count say?",
        "The other servants gathered round and no one had an answer.",
        "The whole dinner turned on that table looking right.",
        "Antonio left his pans and went over to the man.",
        "If you had another statue, could you set the table?",
        "Certainly, said the man, if it were the right size.",
        "Will you let me try to make one? asked the boy.",
        "The man laughed at him. Who are you? he said.",
        "Who talks of making statues within the hour?",
        "Let him try, said the servants, who knew him.",
        "And since there was nothing else to be done, he tried.",
      ],
    },
    {
      lines: [
        "On the kitchen table lay a great square of butter.",
        "It weighed two hundred pounds and had come fresh that day.",
        "Antonio took a kitchen knife and began to cut into it.",
        "In a few minutes the shape of a crouching lion appeared.",
        "The servants crowded round and could not believe it.",
        "It is finer than the statue that broke, they said.",
        "The man carried it in and set it in the middle of the table.",
        "When the guests came in, they saw the yellow lion first.",
        "Famous artists were among them, and they knew what it was.",
        "The count sent for the boy and asked who had taught him.",
        "No one but my grandfather the stone cutter, said Antonio.",
        "From that day he was taught, and in time he worked in marble.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Zufriedenheit. Baldwins Original enthält einen kurzen Vers; hier steht
// Prosa, weil ein Reim beim Tippen nur stolpert.
const THE_MILLER_OF_THE_DEE: Serie = {
  slug: "en-baldwin-the-miller-of-the-dee",
  titel: "The Miller of the Dee",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "arbeit",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "On the banks of the river Dee there stood a mill.",
        "The man who worked it was said to be the happiest in England.",
        "He was busy from first light until the end of the day.",
        "And all the while he worked he sang at the top of his voice.",
        "He was so cheerful that he made other people cheerful.",
        "Travellers who passed the mill talked about him afterwards.",
        "The story of the singing miller went from town to town.",
        "In the end it reached the court, and the king heard it.",
        "The king at that time was often low in spirits.",
        "He had a kingdom, and he had very little peace.",
        "I will go down and talk to this miller, he said.",
        "Perhaps the man can tell me how to be happy.",
      ],
    },
    {
      lines: [
        "So the king rode out to the river and found the mill.",
        "As he stepped inside he could hear the miller singing.",
        "The song said that he envied nobody in the world.",
        "He was as happy as a man could well be, it said.",
        "And nobody in the world envied him either.",
        "You are wrong, my friend, said the king.",
        "You are as wrong as a man can be.",
        "I envy you, and I would gladly change places with you.",
        "If only I could be as light hearted as you are.",
        "The miller turned round and saw who had spoken.",
        "He smiled and bowed, with flour on both his hands.",
        "I could not think of changing places with you, sir.",
      ],
    },
    {
      lines: [
        "Now tell me, said the king, how you manage it.",
        "You stand here in a dusty mill from morning to night.",
        "I am a king, and I am in trouble every day of the year.",
        "What makes you so glad, when I am not?",
        "The miller smiled again and thought for a moment.",
        "I do not know why you are sad, he said, but I know why I am glad.",
        "I earn my own bread with my own two hands.",
        "I love my wife, and I love my children.",
        "I love my friends, and my friends love me.",
        "And I do not owe a single penny to any man alive.",
        "Here is the river Dee, and every day it turns my wheel.",
        "The wheel grinds the corn that feeds all of us.",
      ],
    },
    {
      lines: [
        "Why should I not be happy? the miller asked.",
        "The king stood in the doorway and said nothing at first.",
        "Say no more, he said at last. Stay where you are.",
        "Stay here and go on being happy in your mill.",
        "But I envy you, and I will say so plainly.",
        "Your dusty cap is worth more than my gold crown.",
        "Your mill does more for you than my kingdom does for me.",
        "There should be more men like you in this country.",
        "What a good place it would be to live in.",
        "Then he said goodbye and walked back to his horse.",
        "He rode away slowly along the bank of the river.",
        "And behind him the miller went back to work, singing.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// Woher das Wort »lakonisch« kommt - und die kürzeste Antwort der Geschichte.
// Eine Geschichte über Sprache, in einem Programm, das Sprache tippt.
const A_LACONIC_ANSWER: Serie = {
  slug: "en-baldwin-a-laconic-answer",
  titel: "A Laconic Answer",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "sprache",
  herkunft: BALDWIN,
  etappen: [
    {
      lines: [
        "Far to the east of Rome there lies a land called Greece.",
        "In old times the Greeks were not one people under one rule.",
        "The land was split into a number of separate states.",
        "Each of them had its own laws and its own leaders.",
        "In the south lived a people known as the Spartans.",
        "The Spartans were known for plain habits and for courage.",
        "The name of their region was Laconia.",
        "For that reason the people there were called Lacons.",
        "One of their rules was about speaking, not fighting.",
        "A Spartan was to use no more words than were needed.",
        "That is where our word laconic comes from.",
        "A laconic answer is a short one.",
      ],
    },
    {
      lines: [
        "In the north of Greece there was a land called Macedon.",
        "At one time a king named Philip ruled there.",
        "Philip was a soldier and a careful planner.",
        "He wanted to be master of the whole of Greece.",
        "So he raised a great force and went to war.",
        "One state after another was forced to call him king.",
        "Some were taken and some gave in as soon as he came.",
        "In the end almost all of Greece had given in.",
        "The Spartans in the south had not.",
        "Sparta kept its own laws and sent him no answer.",
        "Philip decided that a letter would settle it.",
        "He sat down and wrote to them himself.",
      ],
    },
    {
      lines: [
        "The letter was meant to frighten them into giving in.",
        "It was written in the plainest terms he could find.",
        "He wrote that he would level their great town to the ground.",
        "That would happen, he added, if he came down into Laconia.",
        "He sent it south with his fastest riders.",
        "The Spartans read the letter in council.",
        "No speech came back, and no list of terms.",
        "There was no arguing about the size of his force.",
        "There was no asking for time or for better conditions.",
        "An answer was written and sent north again.",
        "In a week the answer was brought to Philip.",
        "He broke the seal in front of his officers.",
      ],
    },
    {
      lines: [
        "There was one word written on the whole sheet.",
        "The word was: if.",
        "Nothing else. No greeting and no name.",
        "Philip read it and understood it at once.",
        "The Spartans were telling him that fear was not in it.",
        "Not so long as that small word stood between.",
        "If he came down, then something might come of it.",
        "But he had not come down, and he might never come.",
        "Threats are made of words, and words can be answered.",
        "The shortest answer in that whole war was two letters.",
        "It is remembered now. The letter Philip wrote is not.",
        "That is the whole meaning of speaking short.",
      ],
    },
  ],
};

/** Die dreizehn Baldwin-Serien der Charge B1 (englisch, Stufe teens). */
export const SERIEN_EN_BALDWIN: Serie[] = [
  BRUCE_AND_THE_SPIDER,
  THE_BELL_OF_ATRI,
  ANDROCLUS_AND_THE_LION,
  DAMON_AND_PYTHIAS,
  ALEXANDER_AND_BUCEPHALUS,
  KING_CANUTE_AND_THE_TIDE,
  DIOGENES_AND_THE_SUNLIGHT,
  GRACE_DARLING,
  PICCIOLA,
  THE_ENDLESS_TALE,
  ANTONIO_CANOVA,
  THE_MILLER_OF_THE_DEE,
  A_LACONIC_ANSWER,
];
