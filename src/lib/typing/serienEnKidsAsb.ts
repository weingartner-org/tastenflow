/**
 * ENGLISCHE KINDER-GESCHICHTEN NACH DEM AFRICAN STORYBOOK - Charge G1, 29.08.2026.
 * Sechzehn Serien, Stufe `kids`.
 *
 * ── QUELLE UND RECHTE ─────────────────────────────────────────────────────
 *
 * African Storybook, zugänglich über Storybooks Canada, **CC BY 3.0 oder 4.0 -
 * je Geschichte verschieden** (am 23.09.2026 an jeder Originalseite abgelesen;
 * bis dahin stand hier pauschal 4.0, bei 9 von 16 falsch). Beide Fassungen:
 * Namensnennung, sonst nichts. Keine Share-alike-Ansteckung, keine ND-Sperre.
 * Jede Serie nennt die Autorin oder den Autor des Originals und die Fundstelle.
 *
 * Es sind **Nacherzählungen**, keine Übersetzungen und keine Abschriften: die
 * Originale sind Bilderbuchtexte von 200 bis 860 Wörtern, eine Serie fasst
 * rund 450. Die kurzen wurden ausgebaut, die langen verdichtet, alle in
 * Tippzeilen zerlegt und von wörtlicher Rede befreit.
 *
 * ── ZWEI ENTSCHEIDUNGEN, DIE MAN KENNEN MUSS ──────────────────────────────
 *
 * ★★★ **»Sakima's song« ist der Fund dieser Charge.** Sakima verliert mit drei
 * Jahren sein Augenlicht und singt Lieder, die ihm im Kopf entstehen. Am Ende
 * ist es seine Gabe, die einem Trauernden hilft.
 * ⚠️ **Im Original sagen die Eltern zu ihm: »You are only a blind boy.«**
 * Dieser Satz steht hier nicht. Nicht weil Zweifel der Eltern gestrichen
 * würden - sie bleiben, die Geschichte braucht sie -, sondern weil die
 * Abwertung nicht Teil des Zweifels sein muss. Dazu gilt in dieser App
 * »Person zuerst«: *a boy who cannot see*, nie *a blind boy*.
 *
 * ⚠️ **»Tingi and the cows« wurde NICHT übernommen.** Soldaten nehmen einer
 * Familie das Vieh, Grossmutter und Kind verstecken sich unter Blättern,
 * während ein Soldat auf das Kind tritt. Für diese Stufe zu hart, und mit
 * neunundsiebzig Wörtern trägt es ohnehin keine Serie. An seiner Stelle steht
 * »Decision«.
 *
 * ⚠️ **In »Magozwe« sagt der Onkel im Original zu dem Kind, es sei »too
 * stupid to learn anything«.** Dieser Satz steht hier nicht - Regel 6 der
 * Übergabe gilt auch für ein Zitat: nie etwas gegen ein Kind. Dass der Onkel
 * ihn nicht zur Schule lässt, bleibt.
 *
 * ⚠️ Bei drei weiteren Stoffen ist entschärft worden, wie Bauplan §10 es
 * verlangt: »Donkey Child« (der Sohn tritt im Original seine Mutter zu Boden),
 * »The Honeyguide's revenge« (der Vogel führt den Betrüger im Original zu
 * einem Leoparden) und »Why hippos have no hair« (das Feuer verbrennt das
 * Nilpferd). Der Kern bleibt jeweils erhalten.
 *
 * ── ÖFFNUNGSPUNKTE ────────────────────────────────────────────────────────
 *
 * Anders als bei den Wissens-Chargen ist hier **nicht** durchweg auf Sprosse 25
 * gebaut. Der Grund sind die Namen: *Nyame, Apiyo, Nyar-Kanyada* tragen ein
 * `y`, und ein Eigenname wird nicht verstümmelt. Wo es ohne Zwang ging, öffnet
 * die Serie früh; wo der Name es verbietet, später. Das ist ehrlicher als ein
 * erzwungener Wert.
 */
import type { Serie } from "./serie";

/**
 * Titel und Illustration je Original, abgelesen am 23.09.2026 auf der jeweiligen
 * Seite von Storybooks Canada („Written by / Illustrated by / Source: … from
 * African Storybook"). Die Lizenz des African Storybook verlangt die Nennung von
 * „writers, illustrators, translators" - Übersetzungen gibt es bei keinem der
 * sechzehn Originale. Dazu die LIZENZ je Original (3.0 oder 4.0). Die Bilder übernimmt Tastenflow nicht; genannt werden die
 * Illustratorinnen und Illustratoren trotzdem, weil sie zum Werk gehören.
 */
const ASB_ORIGINAL: Record<string, { titel: string; illustration: string; lizenz: string }> = {
  "0315": { titel: "Sakima's song", illustration: "Peris Wachuka", lizenz: "CC BY 4.0" },
  "0006": { titel: "Anansi and Wisdom", illustration: "Wiehan de Jager", lizenz: "CC BY 3.0" },
  "0141": { titel: "Chicken and Millipede", illustration: "Magriet Brink", lizenz: "CC BY 3.0" },
  "0158": { titel: "Hen and Eagle", illustration: "Wiehan de Jager", lizenz: "CC BY 3.0" },
  "0110": { titel: "A Tiny Seed: The Story of Wangari Maathai", illustration: "Maya Marshak", lizenz: "CC BY 4.0" },
  "0291": { titel: "What Vusi's sister said", illustration: "Wiehan de Jager", lizenz: "CC BY 3.0" },
  "0066": { titel: "Nozibele and the three hairs", illustration: "Wiehan de Jager", lizenz: "CC BY 3.0" },
  "0027": { titel: "Decision", illustration: "Vusi Malindi", lizenz: "CC BY 4.0" },
  "0262": { titel: "Magozwe", illustration: "Wiehan de Jager", lizenz: "CC BY 4.0" },
  "0052": { titel: "Simbegwire", illustration: "Benjamin Mitchley", lizenz: "CC BY 3.0" },
  "0324": { titel: "The day I left home for the city", illustration: "Brian Wambi", lizenz: "CC BY 4.0" },
  "0294": { titel: "Grandma's bananas", illustration: "Catherine Groenewald", lizenz: "CC BY 3.0" },
  "0243": { titel: "Holidays with grandmother", illustration: "Catherine Groenewald", lizenz: "CC BY 4.0" },
  "0111": { titel: "Why hippos have no hair", illustration: "Carol Liddiment", lizenz: "CC BY 3.0" },
  "0201": { titel: "Donkey Child", illustration: "Meghan Judge", lizenz: "CC BY 4.0" },
  "0072": { titel: "The Honeyguide's revenge", illustration: "Wiehan de Jager", lizenz: "CC BY 3.0" },
};

/** Herkunft je Original - CC BY 4.0 verlangt die Namensnennung. */
function asb(autor: string, id: string) {
  const o = ASB_ORIGINAL[id];
  return {
    quelle: `African Storybook („${o.titel}"), über Storybooks Canada`,
    lizenz: `${o.lizenz} (Nacherzählung: gekürzt bzw. ausgebaut, in Tippzeilen zerlegt, ohne wörtliche Rede)`,
    autor: `${autor} (Original), Illustration ${o.illustration}; Nacherzählung: Sensorik-Lernplattform`,
    fundstelle: `https://storybookscanada.ca/stories/en/${id}/`,
    en: {
      quelle: `African Storybook ("${o.titel}"), via Storybooks Canada`,
      lizenz: `${o.lizenz} (retold: shortened or expanded, split into typing lines, without direct speech)`,
      // Volksmärchen haben keine Autorin - dort steht die Herkunft statt „Written by".
      autor: /folktale/i.test(autor)
        ? `${autor}; illustrated by ${o.illustration} (original); retold for typing practice by Sensorik`
        : `Written by ${autor}, illustrated by ${o.illustration} (original); retold for typing practice by Sensorik`,
    },
  } as const;
}

// ───────────────────────────────────────────────────────────────────────────
// ★★★ Der Fund der Charge. Siehe Dateikopf: der abwertende Satz des Originals
// steht hier nicht, der Zweifel der Eltern schon.
const SAKIMAS_SONG: Serie = {
  slug: "en-g1-sakimas-song",
  titel: "The Song That Sakima Made",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "musik",
  herkunft: asb("Ursula Nafula", "0315"),
  etappen: [
    {
      lines: [
        "Sakima lived with his parents and his small sister.",
        "Their hut stood at the end of a row of trees.",
        "It was on the land of a rich man, and the land was wide.",
        "When Sakima was three, he fell ill and lost his sight.",
        "After that he came to know the place in another manner.",
        "He knew the path to the well from the sound under his feet.",
        "He knew each tree by the noise its leaves made in the wind.",
        "He could sit with the older people and follow their talk.",
        "Not all boys of six could do that, and the elders knew it.",
        "His parents worked in the house of the rich man.",
        "They left in the dark and came home in the dark.",
        "So Sakima looked after his sister through the long hours.",
      ],
    },
    {
      lines: [
        "What Sakima loved most of all was to sing.",
        "His mother asked him once where he found his songs.",
        "He told her that no one had taught him any of them.",
        "They came into his head, he said, and then he sang them.",
        "He sang best when his sister was hungry and restless.",
        "There was one song she asked for more than the others.",
        "She would rock from side to side while he sang it.",
        "When it ended she would ask him to begin again.",
        "He never refused her, and he sang it as often as she asked.",
        "The song had no words that anyone else knew.",
        "It rose and fell like water moving over stones.",
        "That was the whole of their afternoons, and it was enough.",
      ],
    },
    {
      lines: [
        "One evening his parents came home and said nothing at all.",
        "Sakima could hear that something was wrong in the silence.",
        "He asked them, and at last they told him.",
        "The son of the rich man had gone and had not come back.",
        "The man sat alone in his house and would see no one.",
        "Sakima said that he could sing for him.",
        "A song might reach him where words had not.",
        "His parents did not think that it would help.",
        "The man was rich, they said, and had every comfort.",
        "What could a song from their hut do for such a house?",
        "Sakima heard the doubt, and he did not argue with it.",
        "He only said that he would like to be taken there.",
      ],
    },
    {
      lines: [
        "In the end his father led him up to the house.",
        "They stood at the door and were let in.",
        "The rich man sat in a dark room and did not look up.",
        "Sakima did not speak. He began his sister song.",
        "It rose and fell in that room as it did under the trees.",
        "The man was still at first, and then he was not.",
        "He asked who the singer was and where the song came from.",
        "Sakima told him the truth: it came into his head.",
        "The man asked him to sing it once more, and he did.",
        "After that Sakima was sent for often.",
        "His parents never again said that a song could not help.",
        "And the song was the same one his sister had asked for.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const ANANSI_AND_WISDOM: Serie = {
  slug: "en-g1-anansi-and-wisdom",
  titel: "Anansi and the Pot of Wisdom",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "sage",
  herkunft: asb("Ghanaian folktale, retold by the African Storybook", "0006"),
  etappen: [
    {
      lines: [
        "Long ago, the story goes, people knew almost nothing.",
        "They did not know how to plant a crop in a field.",
        "They did not know how to weave a cloth on a frame.",
        "They did not know how to work iron into a tool.",
        "All the wisdom in the world was held by the sky god.",
        "He kept it safe in a pot made of clay.",
        "One day he decided to give that pot to Anansi.",
        "Anansi is a spider, and a clever one, and known for it.",
        "Each time he looked into the pot he learned a new thing.",
        "How to set a seed. How to bend a branch. How to tie a knot.",
        "It was the finest thing that had ever come to him.",
        "And the more he learned, the less he wanted to share it.",
      ],
    },
    {
      lines: [
        "He decided to hide the pot where no one else could reach.",
        "The top of the tallest tree in the forest would do.",
        "He spun a long thread and wound it round the clay pot.",
        "Then he tied the thread to the front of himself.",
        "The pot now hung against his chest, and he began to climb.",
        "It went badly from the first branch onward.",
        "The pot swung and knocked against his knees at each step.",
        "He could not see past it to find the next hold.",
        "He climbed a little and slipped back a little.",
        "The bark took the skin off his legs.",
        "Below him, at the foot of the tree, his son stood watching.",
        "The boy had been there the whole time and had said nothing.",
      ],
    },
    {
      lines: [
        "At last the son called up to his father.",
        "Would it not be easier, he asked, to tie the pot behind?",
        "Anansi stopped where he was and thought about it.",
        "Then he came down and tied the pot on his back instead.",
        "He went up the same tree, and this time it was easy.",
        "The pot rode behind him and his hands were free.",
        "He was at the top before he had time to think.",
        "There he sat on the highest branch with the pot beside him.",
        "And there, instead of being pleased, he grew angry.",
        "He was the one who held all the wisdom of the world.",
        "And his own son had seen at once what he had not.",
        "The thought sat in him and would not be put down.",
      ],
    },
    {
      lines: [
        "In his anger he took the clay pot in both hands.",
        "He threw it out and away from the top of the tree.",
        "It fell a long time and struck the hard ground.",
        "It broke into more pieces than anyone could count.",
        "The wisdom that had been shut inside it was loose.",
        "It went out in all directions, into everything.",
        "A little of it settled here, and a little of it there.",
        "From that day, people found that they could learn.",
        "They learned to plant, to weave, to work iron and to build.",
        "No one has all of it, and everyone has some.",
        "That is the reason, the story says, why it is spread so thin.",
        "And it is the reason a child can see what a parent misses.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const CHICKEN_AND_MILLIPEDE: Serie = {
  slug: "en-g1-chicken-and-millipede",
  titel: "Chicken and Millipede",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: asb("Winny Asara", "0141"),
  etappen: [
    {
      lines: [
        "Chicken and Millipede were friends, and they were rivals.",
        "Whatever the one did, the other had to do it better.",
        "If Chicken ran, Millipede ran beside her.",
        "If Millipede climbed, Chicken went up the other side.",
        "One morning they decided to settle it with a game.",
        "They would play football, and the better one would win.",
        "They marked a field in the dust and set up two goals.",
        "Chicken was fast over the ground, and she knew it.",
        "But Millipede had a great many legs, and he was faster.",
        "Chicken could kick the ball a long way down the field.",
        "Millipede kicked it further, and he did it again.",
        "Chicken began to feel sour about the whole thing.",
      ],
    },
    {
      lines: [
        "They agreed to end it with shots at the goal.",
        "Millipede went into the goal first and stood in it.",
        "Chicken took her shots, and one of them went in.",
        "One goal from all those tries, and no more.",
        "Then Chicken went into the goal and Millipede took the ball.",
        "He kicked it in. He rolled it in. He headed it in.",
        "He scored once, and then again, and then three more times.",
        "Five goals stood against the one that Chicken had.",
        "Chicken was beaten, and she took it badly.",
        "She stamped in the dust and would not look at him.",
        "Millipede began to laugh at the fuss she was making.",
        "That was the worst thing he could have done.",
      ],
    },
    {
      lines: [
        "Chicken opened her beak wide and swallowed him whole.",
        "Then she turned and walked off toward home.",
        "On the path she met the mother of Millipede.",
        "The mother asked whether she had seen her child anywhere.",
        "Chicken said nothing at all and kept walking.",
        "The mother stood still, because she had heard something.",
        "It was a small voice, and it was calling for her.",
        "She listened again and found where it came from.",
        "The voice was coming from inside the chicken.",
        "The mother called out to her child to use what he had.",
        "A millipede can make a smell that no one can bear.",
        "He can make a taste that is worse than the smell.",
      ],
    },
    {
      lines: [
        "Inside the chicken, the child did as he was told.",
        "Chicken stopped on the path and stood very still.",
        "Then she burped, and then she swallowed hard.",
        "Then she spat, and then she began to cough.",
        "She coughed and coughed until her eyes watered.",
        "At last she coughed out the millipede onto the dust.",
        "He was wet and cross, and he was in one piece.",
        "His mother took him and they went up a tree together.",
        "They stayed there until the chicken had gone home.",
        "From that time on the two of them kept apart.",
        "That is the reason, the story says, why hens scratch the ground.",
        "And it is the reason a millipede goes the other route.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HEN_AND_EAGLE: Serie = {
  slug: "en-g1-hen-and-eagle",
  titel: "Hen and Eagle",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: asb("Ann Nduku", "0158"),
  etappen: [
    {
      lines: [
        "Once, the story goes, Hen and Eagle were friends.",
        "In those times not one bird in the land could fly.",
        "They all walked, and they lived together in peace.",
        "Then a season came when nothing grew and food ran short.",
        "Eagle had to walk further each morning to find any.",
        "She came home in the evening worn out and hungry.",
        "There must be an easier manner of travelling, she said.",
        "Hen slept on it, and in the morning she had an idea.",
        "She went about the village gathering fallen feathers.",
        "There were feathers from every bird that lived there.",
        "Sew them onto our own, she said, and see what happens.",
        "It might make the long walks a great deal shorter.",
      ],
    },
    {
      lines: [
        "There was one needle in the whole village, and Eagle had it.",
        "So Eagle sat down and sewed first.",
        "She made herself a fine pair of wings out of the feathers.",
        "Then she opened them and rose over the roof of the hut.",
        "She flew a circle above Hen and came down again.",
        "Hen borrowed the needle and started on her own pair.",
        "But sewing is slow, and Hen grew tired of it.",
        "She left the needle on the shelf and went to cook.",
        "Her children were hungry, and that came first.",
        "Meanwhile the other birds had seen Eagle in the air.",
        "One after another they came to borrow the needle.",
        "Each of them sewed a pair of wings and flew off.",
      ],
    },
    {
      lines: [
        "Soon there were birds turning in the air over the village.",
        "The last of them brought the needle back to the hut.",
        "Hen was not there, so he left it on the shelf.",
        "Her children found it and began to play with it.",
        "When they were tired of the game, they dropped it in the sand.",
        "That afternoon Eagle came back from her hunting.",
        "Some feathers had worked loose on the long flight.",
        "She asked Hen for the needle to sew them tight again.",
        "Hen looked on the shelf, and it was not there.",
        "She looked in the kitchen, and it was not there.",
        "She looked in the yard, and there was only sand.",
        "Eagle waited while she looked, and the sun went down.",
      ],
    },
    {
      lines: [
        "Give me one more morning, said Hen, and I will find it.",
        "One morning, said Eagle, and no longer than that.",
        "If it is not found, one of the chicks comes with me.",
        "When Eagle returned, Hen was still scratching in the sand.",
        "There was no needle in it, and there never would be.",
        "So Eagle came down fast and took one of the chicks.",
        "She carried it off over the roofs and was gone.",
        "From that day the two of them were friends no longer.",
        "Whenever Eagle comes, she finds Hen scratching in the sand.",
        "And when the shadow of a wing crosses the ground,",
        "Hen calls to her chicks to get out of the open.",
        "They answer that they are no fools, and they run.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const A_TINY_SEED: Serie = {
  slug: "en-g1-a-tiny-seed",
  titel: "A Tiny Seed: Wangari Maathai",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: asb("Nicola Rijsdijk", "0110"),
  etappen: [
    {
      lines: [
        "On the slopes of a mountain in East Africa lay a village.",
        "In that village a girl worked in the fields with her mother.",
        "Her name was Wangari, and she liked being outside best.",
        "In the food garden she broke up the soil with a blade.",
        "Then she pressed small seeds down into the warm earth.",
        "Her favourite hour was the one just after sundown.",
        "When it grew too dark to see the plants, it was time to go.",
        "She followed the narrow paths home, crossing streams as she went.",
        "Wangari was a clever child and wanted to go to school.",
        "Her parents needed her hands at home and said no.",
        "When she was seven, her older brother spoke up for her.",
        "He talked until they agreed, and Wangari went to school.",
      ],
    },
    {
      lines: [
        "She loved it from the first morning.",
        "Every book she read left her wanting the next one.",
        "She did so well that a school far away asked for her.",
        "It was across the ocean, in the United States.",
        "Wangari went, and she was glad to go.",
        "At the American school she learned a great deal that was new.",
        "She studied plants and how a plant grows from a seed.",
        "While she studied, she remembered how she had grown.",
        "She had played with her brothers in the shade of trees.",
        "The forests of her own country had been full of them.",
        "The more she learned, the more she thought about home.",
        "When her studies ended, she went back to Kenya.",
      ],
    },
    {
      lines: [
        "Her country had changed while she was gone.",
        "Great farms had been laid out across the land.",
        "The trees that had stood there were gone.",
        "Women had no wood left to make a cooking fire.",
        "The streams that had run through the forest ran thin.",
        "People were poor, and the children were hungry.",
        "Wangari looked at it and knew what had to be done.",
        "She began to teach the women how to raise trees.",
        "She showed them how to take a seed and start it in soil.",
        "She showed them how to care for a young tree.",
        "The women grew the trees and sold them.",
        "With that money they could feed their households.",
      ],
    },
    {
      lines: [
        "It was work they could do themselves, and that was the point.",
        "The women found that they were not helpless after all.",
        "As the seasons passed, the young trees grew tall.",
        "Where there had been bare ground there was forest again.",
        "The streams that had run thin began to run full.",
        "What Wangari had started spread across the land.",
        "It crossed borders and reached other countries.",
        "Millions of trees have grown from seeds she handed out.",
        "People far away took notice of what she had done.",
        "She was given a famous prize for peace.",
        "She was the first woman from Africa ever to receive it.",
        "She died some seasons ago, and the trees are standing.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const WHAT_VUSIS_SISTER_SAID: Serie = {
  slug: "en-g1-what-vusis-sister-said",
  titel: "What the Sister of Vusi Said",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "alltag",
  herkunft: asb("Nina Orange", "0291"),
  etappen: [
    {
      lines: [
        "Early one morning the grandmother of Vusi called him in.",
        "She gave him an egg and told him where to take it.",
        "His parents were baking a cake for his sister.",
        "The sister was to be married, and the cake was for that.",
        "So Vusi set off along the path with the egg in his hands.",
        "On the way he came upon two boys picking fruit.",
        "One of them took the egg out of his hands as a joke.",
        "He threw it at a tree, and the egg was gone.",
        "Vusi told them what the egg had been for.",
        "It was for the cake, and the cake was for the wedding.",
        "The boys were sorry then, and they had no egg to give.",
        "They gave him a walking stick for his sister instead.",
      ],
    },
    {
      lines: [
        "Vusi went on, carrying the stick.",
        "Further along he came to two men building a house.",
        "One of them asked whether he could use that strong stick.",
        "Vusi handed it over, and the stick was not strong enough.",
        "It broke at once under the weight of the beam.",
        "Vusi told them the whole tale from the beginning.",
        "The egg, the cake, the wedding, and now the stick.",
        "The builders were sorry, and they had no stick to give.",
        "They gave him a bundle of thatch for his sister instead.",
        "Vusi went on again, carrying the thatch on his shoulder.",
        "Further along he came to a farmer and a cow.",
        "The cow leaned over and asked for one bite of the thatch.",
      ],
    },
    {
      lines: [
        "Vusi let her have one, and it was good thatch.",
        "The cow took another bite, and then the whole bundle.",
        "Vusi told the farmer the tale from the beginning.",
        "The egg, the stick, the thatch, and now nothing at all.",
        "The cow was sorry that she had been so greedy.",
        "The farmer said the cow could go with him as the gift.",
        "So Vusi set off once more, leading a cow on a rope.",
        "But the cow had a home, and she wanted her supper.",
        "At dusk she pulled free and ran back down the road.",
        "Vusi went after her and lost the path in the dark.",
        "He wandered a long time before he found it again.",
        "The wedding had begun without him hours before.",
      ],
    },
    {
      lines: [
        "When he came in at last, the guests were eating.",
        "Vusi stood in the door and told his sister everything.",
        "There was no egg. There was no cake. There was no gift.",
        "There had been a stick and thatch and a cow, and none were left.",
        "He had walked all day and arrived with empty hands.",
        "His sister listened to the whole of it without a word.",
        "Then she thought about it for a moment.",
        "She told him that she did not much care about gifts.",
        "She did not even care that much about the cake.",
        "Everyone she wanted was in the room, and that was the day.",
        "She sent him to put on his good clothes and come back.",
        "And that is what Vusi did.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const NOZIBELE: Serie = {
  slug: "en-g1-nozibele-and-the-three-hairs",
  titel: "Nozibele and the Three Hairs",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "abenteuer",
  herkunft: asb("Tessa Welch", "0066"),
  etappen: [
    {
      lines: [
        "A long time ago, three girls went out to gather wood.",
        "It was a hot day, and the work was slow.",
        "On the way back they went down to the river to swim.",
        "They played and splashed until the light began to change.",
        "All at once they saw how late it had become.",
        "They gathered the wood and hurried along the path.",
        "Near the village Nozibele put a hand to her neck.",
        "Her necklace was gone. She had left it at the river.",
        "She asked the others to walk back with her.",
        "They would not. It was dark, and home was close.",
        "So Nozibele turned round and went back alone.",
        "She found the necklace on a stone where she had swum.",
      ],
    },
    {
      lines: [
        "On the way home she lost the path in the dark.",
        "She walked a long time without knowing where she was.",
        "Then she saw a light some distance off among the trees.",
        "She went toward it and found a hut with a lit window.",
        "She knocked, and the door was opened by a dog.",
        "The dog asked her what she wanted at that hour.",
        "She said that she was lost and needed a place to sleep.",
        "The dog let her in, and the door shut behind her.",
        "Then the dog told her to cook something to eat.",
        "She said that she had never cooked for a dog before.",
        "The dog told her to cook all the same, and she did.",
        "After that he told her to make up the bed.",
      ],
    },
    {
      lines: [
        "She had never made a bed for a dog either, and she made it.",
        "In the morning she was not allowed to leave.",
        "Every day after that she cooked and swept and washed.",
        "Every day the dog watched her do it.",
        "Then one morning the dog said he was going visiting.",
        "She was to sweep and cook and wash before he came back.",
        "As soon as he was out of sight, Nozibele stood still.",
        "She pulled three hairs from her own head.",
        "One she put under the bed where he slept.",
        "One she put behind the door of the hut.",
        "One she put out in the pen where the animals stood.",
        "Then she ran, and she ran as fast as she could.",
      ],
    },
    {
      lines: [
        "When the dog came back the hut was quiet.",
        "He called her name, and a voice answered from the bed.",
        "It said that she was there, underneath it.",
        "He looked, and there was nothing but a hair.",
        "He called again, and a voice answered from the door.",
        "It said that she was there, behind it.",
        "He looked behind the door, and found only a hair.",
        "The third voice called to him from out in the pen.",
        "By then the dog understood what had been done to him.",
        "He ran all the route to the village after her.",
        "But her brothers were standing at the edge with heavy sticks.",
        "The dog turned round, and no one has seen him since.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DECISION: Serie = {
  slug: "en-g1-decision",
  titel: "The Village That Decided",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "alltag",
  herkunft: asb("Ursula Nafula", "0027"),
  etappen: [
    {
      lines: [
        "My village had a great many problems, and everyone knew it.",
        "There was one tap for all of us, at the end of the road.",
        "Each morning a long line stood waiting at it.",
        "We waited as well for food that came from elsewhere.",
        "We locked our doors early because of thieves.",
        "A lot of children left school before they had finished.",
        "Girls went off to work as maids in other villages.",
        "Boys walked about with nothing to do at all.",
        "When the wind came up, waste paper hung in the trees.",
        "It caught on the fences and stayed there for weeks.",
        "Broken glass lay in the road, and people were cut on it.",
        "That was the village, and we had grown used to it.",
      ],
    },
    {
      lines: [
        "Then one morning the tap ran out.",
        "Nothing came from it at all, not a drop.",
        "Every container in the village stood empty in the sun.",
        "That was the thing that finally moved us.",
        "My father walked from one house to the next all morning.",
        "At each door he asked the people to come to a meeting.",
        "Some said they would come. Some said nothing.",
        "In the afternoon they gathered under the big tree.",
        "More came than my father had expected.",
        "They sat on the roots and on the ground and waited.",
        "My father stood up in front of all of them.",
        "He said that we would have to solve this together.",
      ],
    },
    {
      lines: [
        "For a moment nobody answered him at all.",
        "Then a boy of eight, sitting on a fallen trunk, called out.",
        "His name was Juma, and he said he could help with cleaning.",
        "He was the youngest person at the meeting.",
        "After him a woman stood up at the back.",
        "She said the women would join her and grow food.",
        "There was ground behind the school that no one used.",
        "Then a man stood up on the other side.",
        "He said the men would dig a well.",
        "It would take weeks, and they would dig it.",
        "By the end everyone was talking at once.",
        "We called out together that we would change our lives.",
      ],
    },
    {
      lines: [
        "The next morning the work began, and it was hard.",
        "Juma went along the fences pulling the paper down.",
        "Other children came out to help him without being asked.",
        "The women marked out the ground behind the school.",
        "They broke the soil and set the first seeds in it.",
        "The men chose a place and started to dig.",
        "They went down through soil and then through stone.",
        "It took much longer than anyone had said it would.",
        "But there was water at the bottom, and it was clean.",
        "The line at the tap grew shorter after that.",
        "None of it came from outside the village.",
        "From that day we have gone on solving them ourselves.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const MAGOZWE: Serie = {
  slug: "en-g1-magozwe",
  titel: "Magozwe",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "mut",
  herkunft: asb("Lesley Koyi", "0262"),
  etappen: [
    {
      lines: [
        "In a busy city there lived a group of boys with no home.",
        "They slept on the pavement and took each day as it came.",
        "In the morning they rolled up their mats and lit a small fire.",
        "The fire was made of rubbish, and it drove off the cold.",
        "Among them was Magozwe, and he was the youngest of all.",
        "His parents had died when he was five years old.",
        "After that he was sent to live with an uncle.",
        "The uncle did not want him and did not look after him.",
        "There was not enough food, and there was a great deal of work.",
        "When Magozwe asked whether he could go to school,",
        "The answer was no, and it was no every time he asked.",
        "After three years of that, he left and did not go back.",
      ],
    },
    {
      lines: [
        "Life on the street was hard, and the days were long.",
        "The boys begged, and sometimes they were given something.",
        "Sometimes they were chased off before they could ask.",
        "Then one afternoon a man stopped where they sat.",
        "His name was Thomas, and he did not hurry past.",
        "He asked them what their names were and listened to the answers.",
        "He came back the following week, and the week after that.",
        "He brought food now and then, and he brought books.",
        "Magozwe could not read a word of them at first.",
        "Thomas read to him, sitting on the kerb.",
        "There was a book about a boy who flew an aeroplane.",
        "There was another about a boy who played football.",
      ],
    },
    {
      lines: [
        "Magozwe listened to those two stories over and over.",
        "One day Thomas told him about a house with a green roof.",
        "Children lived there, and there was a bed for each of them.",
        "He asked whether Magozwe would like to go and see it.",
        "Magozwe did not answer him for a long while.",
        "He had been taken in once before, and it had gone badly.",
        "He thought that the street might be the safer choice.",
        "He told Thomas what he was afraid of, and Thomas listened.",
        "Over the weeks Thomas kept coming back and kept talking.",
        "In the end Magozwe went to look at the house.",
        "He moved into a room there and shared it with two boys.",
        "There were ten children in that house, and a cat and a goat.",
      ],
    },
    {
      lines: [
        "He began school, and school was very hard.",
        "The other children knew things he had never been taught.",
        "There were mornings when he wanted to give it up.",
        "On those mornings he thought about the two books.",
        "The boy who flew, and the boy who played.",
        "Neither of them had given up either.",
        "So he stayed, and he went on, and it got easier.",
        "One afternoon he sat in the yard with a book from school.",
        "Thomas came out and sat down beside him.",
        "He asked what the story was about.",
        "It was about a boy who grows up to be a teacher, said Magozwe.",
        "Thomas asked the name of the boy, and Magozwe told him his own.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// ⚠️ Entschärft: im Original schlägt der Onkel das Kind und die Stiefmutter
// wirft es aus dem Haus. Hier bleibt die Zurückweisung, nicht die Gewalt.
const SIMBEGWIRE: Serie = {
  slug: "en-g1-simbegwire",
  titel: "Simbegwire",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "alltag",
  herkunft: asb("Rukia Nantale", "0052"),
  etappen: [
    {
      lines: [
        "When the mother of Simbegwire died, the house went quiet.",
        "Her father did what he could for his daughter.",
        "Little by little the two of them learned to be glad again.",
        "Each morning they sat together and talked about the day.",
        "Each evening they made the meal side by side.",
        "After the dishes he helped her with her school work.",
        "Then one day her father came home later than usual.",
        "He called for her, and she came running out.",
        "Then she stopped, because he was holding a woman by the hand.",
        "He said that he wanted her to meet someone.",
        "The woman was called Anita, and she said hello.",
        "She did not smile, and she did not take the hand of the girl.",
      ],
    },
    {
      lines: [
        "Her father was happy, and he talked about the three of them.",
        "He talked about the life they would all have together.",
        "Simbegwire listened and said very little.",
        "Anita moved into the house the following month.",
        "From the first week it was clear how things would go.",
        "Anita had no time for the girl and did not pretend to.",
        "There was less food on her plate than on the others.",
        "There was more work for her and less said to her.",
        "When her father was there, it was better.",
        "When he travelled for his work, it was worse.",
        "Simbegwire told him once, and he found it hard to believe.",
        "So she stopped telling him, and she kept it to herself.",
      ],
    },
    {
      lines: [
        "One morning, after a bad week, she could not stay.",
        "She packed the few things she had and left before light.",
        "She walked out of the village and along the river.",
        "By evening she was tired and did not know where to go.",
        "She found a tall tree at the edge of the water.",
        "She climbed into it and made a bed among the branches.",
        "She stayed there, and she sang to herself in the evenings.",
        "The song was one her mother had sung to her.",
        "A woman from the village heard it from the path below.",
        "She stood still and listened, and she knew the voice.",
        "She was the sister of the mother of Simbegwire.",
        "She called up into the tree until the girl came down.",
      ],
    },
    {
      lines: [
        "Her aunt took her home and fed her and put her to bed.",
        "Word was sent to her father, and he came at once.",
        "He held her for a long time without saying anything.",
        "Then he told her that she had found a good home.",
        "She could stay with her aunt for as long as she wanted.",
        "He came to see her every single day after that.",
        "In time he brought Anita with him.",
        "Anita reached out and said that she had been wrong.",
        "She asked whether she might be allowed to start again.",
        "Simbegwire looked at her father and at his worried face.",
        "Then she stepped forward and put her arms around Anita.",
        "The next week there was a meal at the house, and she went.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const THE_DAY_I_LEFT_FOR_THE_CITY: Serie = {
  slug: "en-g1-the-day-i-left-for-the-city",
  titel: "The Morning I Left for the City",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "abenteuer",
  herkunft: asb("Lesley Koyi, Ursula Nafula", "0324"),
  etappen: [
    {
      lines: [
        "The bus stop in my village was small and always full.",
        "Buses came in loaded past the roof and left the same manner.",
        "On the ground lay more goods waiting to be lifted up.",
        "Men stood on the steps calling out where each bus was going.",
        "One of them was calling for the city, out to the west.",
        "That was the bus I had come to catch.",
        "It was nearly full, and people were still pushing on.",
        "Some pushed their bundles into the space beneath it.",
        "Others heaved theirs onto the racks over the seats.",
        "New passengers held their tickets and looked for a place.",
        "Women settled their small children for the long ride.",
        "I found a seat by a window and pressed myself into it.",
      ],
    },
    {
      lines: [
        "The man beside me held a green plastic bag on his knees.",
        "He held it as if it were the only thing he owned.",
        "His sandals were worn through and his coat was old.",
        "He looked out of the window and seemed uneasy.",
        "I looked out of mine and thought about what I was doing.",
        "I was leaving the village where I had grown up.",
        "I was going to a city I had never seen.",
        "The loading was finished and everyone had a seat.",
        "Then the sellers came aboard through both doors.",
        "Each of them called out what they had to sell.",
        "The words came so fast that they sounded strange to me.",
        "A few passengers bought a drink or a small thing to eat.",
      ],
    },
    {
      lines: [
        "Those of us with no money watched them do it.",
        "Then the horn sounded, and that meant we were leaving.",
        "The man on the steps shouted at the sellers to get off.",
        "They pushed past each other to reach the door.",
        "Some were still handing back change as they went.",
        "One or two tried a last sale from the step itself.",
        "The bus pulled out, and I kept my face at the window.",
        "I watched the roofs of the village go behind us.",
        "I wondered whether I would ever come back to see them.",
        "As we drove on, the air inside grew hot and heavy.",
        "I shut my eyes and tried to fall asleep.",
        "My mind went straight back to the village instead.",
      ],
    },
    {
      lines: [
        "I wondered whether my mother would be all right.",
        "I wondered whether my rabbits would fetch any money.",
        "I wondered whether my brother would water the seedlings.",
        "I had planted them behind the house in the spring.",
        "Then I went over the name of the road where my uncle lived.",
        "I said it under my breath until the words ran together.",
        "I was still saying it when I fell asleep at last.",
        "Nine hours later I woke to banging on the side of the bus.",
        "They were calling for passengers going back east.",
        "I took my bag and stepped down onto the road.",
        "The return bus was already filling up behind me.",
        "The thing that mattered now was to find the house of my uncle.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const GRANDMAS_BANANAS: Serie = {
  slug: "en-g1-grandmas-bananas",
  titel: "The Basket of Grandmother",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "alltag",
  herkunft: asb("Ursula Nafula", "0294"),
  etappen: [
    {
      lines: [
        "The garden of my grandmother was a wonderful place.",
        "It was full of sorghum and millet and cassava.",
        "Best of all, at the far end, stood the bananas.",
        "She had a great many grandchildren, and I was sure of one thing.",
        "I was the one she liked best, though she never said so.",
        "She asked me to her house more often than the others.",
        "She told me small secrets that she told to no one else.",
        "There was one secret, though, that she would not tell.",
        "I did not know where she ripened the bananas.",
        "One morning I saw a wide straw basket standing in the sun.",
        "I asked her what it was for.",
        "She told me it was her magic basket, and nothing more.",
      ],
    },
    {
      lines: [
        "Beside the basket lay a stack of banana leaves.",
        "Now and then she went out and turned them over.",
        "I asked her what the leaves were for.",
        "She told me they were her magic leaves, and nothing more.",
        "I watched her for a long time from the doorway.",
        "The basket, the leaves and the bananas, and no explanation.",
        "In the end she sent me off on an errand.",
        "By the time I came back, everything was put away.",
        "That went on for days, and I grew more curious.",
        "Then one afternoon she left the house without me.",
        "The door of the store room stood open behind her.",
        "I went in, and there in the corner was the basket.",
      ],
    },
    {
      lines: [
        "It was covered over with the banana leaves.",
        "I lifted a corner and looked underneath.",
        "There were the bananas, laid in rows, turning gold.",
        "The leaves held the warmth in and did the work.",
        "That was the whole of the magic, and I had found it.",
        "The next day I came back while she was visiting my mother.",
        "One bunch was ripe all the way through.",
        "I took a single banana and hid it in my dress.",
        "I covered the basket again and went behind the house.",
        "It was the sweetest thing I had ever eaten.",
        "The day after that I took four.",
        "As I crept out I heard her coughing in the yard.",
      ],
    },
    {
      lines: [
        "I hid them under my dress and walked straight past her.",
        "She said nothing to me, and I said nothing to her.",
        "The following morning was market day.",
        "She always took the ripe bananas and the cassava to sell.",
        "She got up early, as she did every market morning.",
        "I did not go over to her house that day.",
        "I did not go the next day either.",
        "That evening my mother called me in.",
        "My father was there, and my grandmother was there.",
        "I knew before anyone spoke what it was about.",
        "That night I lay in bed for a long while.",
        "I have not taken what was not mine since then.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOLIDAYS_WITH_GRANDMOTHER: Serie = {
  slug: "en-g1-holidays-with-grandmother",
  titel: "Holidays with Grandmother",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "ferien",
  herkunft: asb("Violet Otieno", "0243"),
  etappen: [
    {
      lines: [
        "Odongo and Apiyo lived in the city with their father.",
        "They waited all year for the school holidays.",
        "It was not only that school was shut for a while.",
        "It was that the holidays meant going to their grandmother.",
        "She lived in a fishing village beside a wide lake.",
        "The night before, they packed their bags and could not sleep.",
        "They lay awake and talked about the village until late.",
        "Early the next morning they set off in the car of their father.",
        "They drove past mountains and past wild animals.",
        "They drove past tea growing in long green rows.",
        "They counted cars and sang until they ran out of songs.",
        "Then they slept, and their father woke them at the village.",
      ],
    },
    {
      lines: [
        "Their grandmother was resting on a mat under a tree.",
        "Her name in the village was Nyar-Kanyada.",
        "She got up when she saw the car and came to meet them.",
        "The children danced around her and sang the song they knew.",
        "That evening they helped her lay out the mats to sleep.",
        "The house smelled of wood smoke and of the lake.",
        "In the morning she took them out to the garden.",
        "She showed them how to hoe between the rows.",
        "Apiyo went along the line pulling out the weeds.",
        "Odongo carried the water from the tap at the corner.",
        "They took the cows out to graze in the afternoon.",
        "Once the cows got into a neighbour garden and had to be fetched.",
      ],
    },
    {
      lines: [
        "After that the children watched them more carefully.",
        "On another morning they went with her to the market.",
        "She had a stall there with vegetables and sugar and soap.",
        "Apiyo liked telling the customers what each thing cost.",
        "Odongo packed what people bought into their baskets.",
        "At the end of the day the three of them drank tea together.",
        "Then they helped her count what she had taken in.",
        "The holidays went faster than any holidays before.",
        "Far too soon it was time to go back to the city.",
        "Nyar-Kanyada gave Odongo a cap and Apiyo a jumper.",
        "She packed food for the journey and tied it up.",
        "When their father came for them, they did not want to go.",
      ],
    },
    {
      lines: [
        "They asked her to come to the city and live with them.",
        "She smiled and said that she was too old for a city.",
        "She would be here, she said, when they came again.",
        "Both children held on to her for a long time.",
        "Then they got into the car and waved until she was gone.",
        "Back at school they told their friends about the village.",
        "They told them about the lake and the cows and the market.",
        "Some of the children thought that the city was better.",
        "Others thought that the village sounded better.",
        "They argued about it for most of a week.",
        "On one thing, though, every one of them agreed.",
        "Odongo and Apiyo had a wonderful grandmother.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// ⚠️ Entschärft: im Original schickt Rabbit das Feuer, um Hippo zu verbrennen,
// und freut sich darüber. Hier bleibt der Streit und die Ursprungserklärung;
// die Schadenfreude nicht.
const WHY_HIPPOS_HAVE_NO_HAIR: Serie = {
  slug: "en-g1-why-hippos-have-no-hair",
  titel: "Why Hippos Have No Hair",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: asb("Basilio Gimo, David Ker", "0111"),
  etappen: [
    {
      lines: [
        "One morning Rabbit was out walking beside the river.",
        "The path there was narrow and the grass grew thick.",
        "Hippo was out too, taking her time over the green grass.",
        "She was large, and she was not looking where she went.",
        "She did not see Rabbit on the path in front of her.",
        "She put one foot down and stood on his toes.",
        "Rabbit shouted at her at the top of his voice.",
        "Could she not see, he said, whose foot she was on?",
        "Hippo lifted her foot at once and said she was sorry.",
        "She had not seen him at all, and she asked him to forgive her.",
        "It was a fair apology, and it was meant.",
        "But Rabbit was in no mood to take one.",
      ],
    },
    {
      lines: [
        "He said that she had done it on purpose.",
        "He said that one day she would be sorry for it.",
        "Then he turned and went off up the bank.",
        "Hippo watched him go and went back to her grass.",
        "She thought the whole thing was over.",
        "Rabbit did not think it was over at all.",
        "He went to look for Fire, who lived in the dry country.",
        "He asked Fire to go and deal with Hippo for him.",
        "She came out of the water to eat, he said, in the evening.",
        "Fire said that this would be no trouble at all.",
        "Fire is not careful, and Fire does not ask questions.",
        "That evening Hippo was grazing far from the river.",
      ],
    },
    {
      lines: [
        "The grass around her was dry and stood high.",
        "Fire came through it faster than she could turn.",
        "She felt the heat on her back and she ran.",
        "She ran for the river and went in with a great splash.",
        "The water closed over her and she was safe.",
        "But when she came up again, her coat was gone.",
        "Every hair she had was burned away.",
        "She stood in the shallows and looked at herself.",
        "She had been proud of that coat, and it was not there.",
        "Rabbit heard about it and did not feel as he had expected.",
        "He had wanted an apology, and he had got a bare hippo.",
        "The two of them were never friends after that.",
      ],
    },
    {
      lines: [
        "Hippo found that she did not mind the water so much.",
        "Without her coat the sun burned her bare skin.",
        "So she stayed in the river through the whole hot day.",
        "She came out to eat only after the sun had gone down.",
        "Her children were born without hair as well.",
        "So were their children, and so it went on.",
        "That is the reason, the story says, why hippos are bare.",
        "It is the reason they lie in the water all day.",
        "And it is the reason they will not go far from it.",
        "Look for one on a river bank at noon and there will be none.",
        "Wait until evening, and they come up onto the grass.",
        "All of it, the story says, because of one apology not taken.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// ⚠️ Entschärft: im Original tritt der Sohn seine Mutter zu Boden. Hier bleibt
// der Zorn und das Weglaufen, nicht der Schlag.
const DONKEY_CHILD: Serie = {
  slug: "en-g1-donkey-child",
  titel: "Donkey Child",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "alltag",
  herkunft: asb("Lindiwe Matshikiza", "0201"),
  etappen: [
    {
      lines: [
        "It was a small girl who first saw the shape in the distance.",
        "She stood on the path and watched it come nearer.",
        "It turned out to be a woman, and the woman was with child.",
        "The girl was shy, and she went out to meet her all the same.",
        "Her people decided that the woman would stay with them.",
        "They would keep her safe, and the child as well.",
        "The child came soon after, on a night of great noise.",
        "There were blankets and water and people calling out.",
        "Then the child was there, and everyone stepped back.",
        "The child was a donkey. That was the whole of it.",
        "Some said a promise was a promise and it held.",
        "Others said the child would bring them nothing but trouble.",
      ],
    },
    {
      lines: [
        "The arguing went on until the woman took her child and left.",
        "She found herself alone again on the same road.",
        "She did not know what to do with such a child.",
        "She did not know what to do with herself either.",
        "In the end she settled it in her own mind.",
        "He was her child, and she was his mother, and that was that.",
        "Had he stayed small, it might all have gone differently.",
        "But Donkey grew, and then he grew again.",
        "Soon he could no longer be carried on her back.",
        "However hard he tried, he could not act like the others.",
        "His mother was tired more often than she was not.",
        "Sometimes she set him to work that is given to animals.",
      ],
    },
    {
      lines: [
        "The anger built up in him over the seasons.",
        "He could not do this and he could not be that.",
        "There was no place that was made for him.",
        "One morning it came out of him all at once.",
        "He said hard things to his mother in the yard.",
        "Then he was ashamed of himself for saying them.",
        "He turned and ran, and he did not stop running.",
        "He ran until the village was out of sight behind him.",
        "He ran until the road ran out and there was only grass.",
        "When at last he stopped, it was almost dark.",
        "He lay down where he was and fell into a heavy sleep.",
        "When he woke, an old man was standing over him.",
      ],
    },
    {
      lines: [
        "Donkey looked up into his face and felt a little hope.",
        "He stayed with the old man, and the old man taught him.",
        "He learned how to find water and how to keep warm.",
        "He learned a great deal that no one had shown him before.",
        "The old man learned things from him as well.",
        "They helped each other, and they laughed together.",
        "One morning the old man asked to be carried up a mountain.",
        "They went up into the clouds and slept there.",
        "Donkey dreamed that his mother was ill and calling him.",
        "When he woke, the clouds had gone, and so had his friend.",
        "He went down and found his mother, and she was alone.",
        "They looked at each other a long while, and then held on.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const THE_HONEYGUIDE: Serie = {
  slug: "en-g1-the-honeyguide",
  titel: "The Honeyguide and Gingile",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: asb("Zulu folktale, retold by the African Storybook", "0072"),
  etappen: [
    {
      lines: [
        "There is a small bird in that country called the honeyguide.",
        "It knows where the wild bees have built their combs.",
        "It cannot open a hive, and a person can.",
        "So the bird leads people to the tree and waits.",
        "Afterwards it is given a share of the comb.",
        "That is the old arrangement, and both sides keep it.",
        "This is the story of the bird Ngede and a man called Gingile.",
        "One morning Gingile was out hunting and heard the call.",
        "His mouth watered at the thought of honey.",
        "He stood still and searched the branches until he saw it.",
        "The bird called and flew to the next tree, and the next.",
        "It stopped now and then to be sure that he was following.",
      ],
    },
    {
      lines: [
        "After half an hour they came to a huge wild fig tree.",
        "Ngede hopped about among the branches and then settled.",
        "He put his head on one side as if to ask what was keeping him.",
        "Gingile could see no bees from below, and he trusted the bird.",
        "He put down his spear and gathered dry sticks.",
        "He made a small fire and let it smoke.",
        "Then he took a smoking branch and climbed with it.",
        "The smoke made the bees slow and heavy, as it always does.",
        "He reached in and took the comb out in great pieces.",
        "The bird watched him from a branch above.",
        "It waited for the piece that is always left behind.",
        "Gingile wrapped every last piece in leaves and climbed down.",
      ],
    },
    {
      lines: [
        "He left nothing at all for the bird that had led him there.",
        "Ngede called after him, and Gingile walked on.",
        "Some weeks later Gingile heard the same call again.",
        "He remembered the honey and forgot the rest.",
        "The bird led him a long route through the bush.",
        "It stopped at last under a tall tree and waited.",
        "Gingile made his fire and took his smoking branch.",
        "He climbed, and he noticed that he could hear no bees.",
        "The hive must be deep inside the trunk, he thought.",
        "He pulled himself up one more branch to look.",
        "There was no hive in that tree at all.",
        "What was in it was a leopard, and she had been asleep.",
      ],
    },
    {
      lines: [
        "She opened her eyes and looked at him from very close.",
        "Gingile went down that tree faster than he had gone up.",
        "He missed a branch near the bottom and fell the last part.",
        "He landed hard and turned his ankle under him.",
        "Then he was up and off through the bush at a limp.",
        "The leopard was still half asleep and let him go.",
        "Ngede sat in the tree above and watched him leave.",
        "The bird had settled the account in its own manner.",
        "Gingile did not forget the lesson of that afternoon.",
        "When his children hear the story, they understand it.",
        "Whenever they take honey, they leave the largest piece.",
        "It is set on a branch, and the bird comes for it.",
      ],
    },
  ],
};

/** Sechzehn Kinder-Geschichten der Charge G1 nach dem African Storybook. */
export const SERIEN_EN_KIDS_ASB: Serie[] = [
  SAKIMAS_SONG,
  ANANSI_AND_WISDOM,
  CHICKEN_AND_MILLIPEDE,
  HEN_AND_EAGLE,
  A_TINY_SEED,
  WHAT_VUSIS_SISTER_SAID,
  NOZIBELE,
  DECISION,
  MAGOZWE,
  SIMBEGWIRE,
  THE_DAY_I_LEFT_FOR_THE_CITY,
  GRANDMAS_BANANAS,
  HOLIDAYS_WITH_GRANDMOTHER,
  WHY_HIPPOS_HAVE_NO_HAIR,
  DONKEY_CHILD,
  THE_HONEYGUIDE,
];
