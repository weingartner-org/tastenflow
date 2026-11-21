/**
 * ENGLISCHE WISSENS-SERIEN FÜR KINDER - Charge W1, 29.08.2026.
 * Dreizehn Serien, Stufe `kids`, alle auf **Sprosse 25**.
 *
 * ── WARUM ES DIESE DATEI GIBT ─────────────────────────────────────────────
 *
 * Gezählt am 29.08.: `en/kids` hatte sieben Wissens-Serien, das Ziel sind
 * zwanzig. Grundlage der Quellenwahl ist
 * `Sensorik/QUELLEN-2026-08-29-TASTENFLOW-FREIE-TEXTE.md`.
 *
 * ── SPROSSE 25: OHNE `y`, `x`, `q` ────────────────────────────────────────
 *
 * Die Baldwin-Charge (B1b) hat gezeigt, dass bei englischen Serien immer
 * dasselbe Zeichen sperrt: das `y` an Position 29. Wissenstexte kommen
 * leichter ohne aus als Geschichten - sie haben keine direkte Rede, also
 * fehlt auch kein *you*. Alle dreizehn öffnen deshalb bei 25 Einheiten
 * statt bei 29 oder 30.
 *
 * ⚠️ **Was das im Sachtext kostet**, an diesen dreizehn gemessen:
 * *oxygen* (x und y!), *energy*, *body*, *dry*, *sky*, *fly*, *day*, *year*,
 * *they*, *very*, *only*, *many*, *carry*, *layer*, *crystal*, *system*,
 * *liquid* (q), *mix* (x), *six* (x), *quick* (q), *expand* (x) - und jedes
 * Adverb auf -ly.
 * Ersatz, der sich bewährt hat: *air* statt oxygen · *the parts* statt
 * molecules · *a fluid* statt liquid · *stir together* statt mix ·
 * *at once* / *with care* / *in the end* statt der -ly-Adverbien ·
 * *the air above* statt sky · *on the wing* statt flying.
 *
 * ⚠️ **Keine Ziffern** (sie heben auf Tier 5). Zahlen stehen ausgeschrieben.
 * *twenty* trägt ein `y` - bei Mengenangaben hilft *a dozen*, *a tenth*,
 * *a hundred*.
 *
 * ── FAKTEN ────────────────────────────────────────────────────────────────
 *
 * Sachwissen, das an mehr als einer Quelle geprüft wurde, dann selbst
 * formuliert. Die Zahl der Handknochen (siebenundzwanzig: acht Handwurzel,
 * fünf Mittelhand, vierzehn Finger) ist an Johns Hopkins Medicine und der
 * Mayo Clinic gegengelesen.
 *
 * ★ Drei der dreizehn liegen bewusst am Thema der Plattform: Eulen, Fledermäuse
 * und die Hand. Kinder, die mit den Ohren und den Fingern arbeiten, lesen hier
 * über Ohren und Finger.
 */
import type { Serie } from "./serie";

const EIGEN_SACH = {
  quelle: "Sensorik (Sachwissen selbst formuliert, an Fachquellen geprüft)",
  lizenz: "Eigenes Werk",
  autor: "Sensorik-Lernplattform",
  en: {
    quelle: "Sensorik (factual content self-written, checked against expert sources)",
    lizenz: "Own work",
    autor: "Sensorik learning platform",
  },
} as const;

const HAND = {
  quelle:
    "Sensorik (selbst formuliert); Knochenzahl geprüft an Johns Hopkins Medicine und Mayo Clinic",
  lizenz: "Eigenes Werk",
  autor: "Sensorik-Lernplattform",
  fundstelle: "https://www.hopkinsmedicine.org/health/treatment-tests-and-therapies/anatomy-of-the-hand",
  en: {
    quelle: "Sensorik (self-written); the bone count checked against Johns Hopkins Medicine and Mayo Clinic",
    lizenz: "Own work",
    autor: "Sensorik learning platform",
  },
} as const;

// ───────────────────────────────────────────────────────────────────────────
const HOW_ICE_FLOATS: Serie = {
  slug: "en-w1-how-ice-floats",
  titel: "How Ice Floats",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Put a stone in a bowl of water and it goes to the bottom.",
        "Put a lump of ice in the same bowl and it stands on top.",
        "A stone is hard and heavier than water, so it sinks.",
        "Ice is hard as well, and ice does not sink at all.",
        "That is odd, and it is worth a closer look.",
        "Water is made of parts far too small to see.",
        "When water is warm, those parts move about fast.",
        "When water gets cold, the parts slow down.",
        "In most things, cold parts settle closer to each other.",
        "Closer parts mean more matter in the same room.",
        "So most cold things are more dense than warm ones.",
        "Water does this as well, but water stops at one point.",
      ],
    },
    {
      lines: [
        "Water is at its most dense a little above freezing.",
        "Below that point it does something no one would guess.",
        "Instead of drawing closer, the parts lock into a frame.",
        "Each part takes hold of the parts around it.",
        "The frame that forms has open room inside it.",
        "That open room is what makes ice less dense.",
        "Ice holds more room than the same water held.",
        "So ice floats, and it floats with most of it under.",
        "About a tenth of a block of ice stands above the water.",
        "The rest is under the surface, out of sight.",
        "Sailors have known this about ice at sea for a long time.",
        "The part in the air is the smaller part.",
      ],
    },
    {
      lines: [
        "Now think about a lake when the cold comes in.",
        "The water at the top gets cold before the rest.",
        "It grows more dense and sinks toward the bottom.",
        "Warmer water rises to take its place at the top.",
        "This turning goes on until the whole lake is cold.",
        "Then the water at the top passes the freezing point.",
        "Now it does not sink. It holds still and turns to ice.",
        "A sheet of ice forms across the top of the lake.",
        "Under that sheet the water stands above freezing.",
        "The ice works as a lid and holds the cold out.",
        "Fish and plants live on under the ice all winter.",
        "A deep lake does not freeze right down to its bed.",
      ],
    },
    {
      lines: [
        "Think what would happen if ice went down instead.",
        "The first ice would drop to the bed of the lake.",
        "More ice would form and settle on top of it.",
        "Winter after winter the ice would build from below.",
        "No sun could reach it there to melt it again.",
        "The lake would fill with ice and stand solid.",
        "Nothing that lives in water could last in such a place.",
        "The same holds for the cold seas of the north.",
        "One odd turn in how water freezes lets life hold on.",
        "It looks like a small thing, and it is not a small thing.",
        "Look at the ice in a glass of water on a hot afternoon.",
        "That floating lump is doing the same work as the lake lid.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const WHAT_MAKES_A_RAINBOW: Serie = {
  slug: "en-w1-what-makes-a-rainbow",
  titel: "What Makes a Rainbow",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A rainbow needs two things at the same moment.",
        "It needs rain in the air and sun behind that rain.",
        "That is the whole of the trick, and it is not a small one.",
        "White light from the sun is not one thing at all.",
        "It is a whole set of colours, running from red to blue.",
        "Our sense of sight puts them together and calls it white.",
        "When light moves from air into water, it bends.",
        "It bends because it does not travel at one same rate.",
        "In water it moves slower than it does in open air.",
        "That change of rate is what turns the beam a little.",
        "Here is the point that makes the whole thing work.",
        "Each colour bends at its own angle, a little apart.",
      ],
    },
    {
      lines: [
        "Red bends the least of all the colours.",
        "Blue bends the most, and the rest sit in between.",
        "So a beam that goes in white comes out spread apart.",
        "One drop of rain is a small ball of clear water.",
        "Sunlight enters the front of it and bends.",
        "It runs on to the back wall of the drop.",
        "There it turns around and comes back out the front.",
        "On the return it bends a second time.",
        "So each drop sends light out as a fan of colours.",
        "The fan comes back toward the sun, not on past it.",
        "That is the reason a rainbow stands behind us.",
        "The sun has to be at our back for us to see one.",
      ],
    },
    {
      lines: [
        "One drop alone would not make a bow that we can see.",
        "A rainbow is the work of thousands upon thousands of drops.",
        "Each drop sends one colour toward the place we stand.",
        "Drops high in the air send us their red.",
        "Drops lower down send us their blue.",
        "All those drops together build the band of colour.",
        "That is the reason red sits on the top of a rainbow.",
        "Blue sits along the inside of the band.",
        "The bow is round because the angle is the same all round.",
        "Each drop at that one angle sends light our route.",
        "From the ground we see part of that ring, as an arch.",
        "From a high place a rainbow can look like a full circle.",
      ],
    },
    {
      lines: [
        "No two people ever see the same rainbow.",
        "The light that reaches one person comes from certain drops.",
        "A person a step to the side gets light from other drops.",
        "So each of us has a bow of our own.",
        "That is also the reason a rainbow cannot be reached.",
        "Walk toward it and the drops that serve us change.",
        "The bow moves off, holding the same distance.",
        "Sometimes a second, fainter bow stands outside the first.",
        "In that one the light turned around twice inside the drop.",
        "That second turn flips it, so the colours run the other route.",
        "A garden hose in the sun can make a small bow.",
        "Stand with the sun at the back and the mist in front.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_OWLS_HEAR_IN_THE_DARK: Serie = {
  slug: "en-w1-how-owls-hear-in-the-dark",
  titel: "How Owls Hear in the Dark",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "An owl hunts at night, when there is little light.",
        "Its sight is sharp, but sight is not the whole of it.",
        "An owl can take a mouse under a sheet of snow.",
        "It cannot see through snow. It hears the mouse.",
        "The ears of an owl are not where we would look.",
        "There is nothing on the head that we would call an ear.",
        "The openings sit at the sides, under the feathers.",
        "In some owls the two openings are not level.",
        "One sits a little above the other on the head.",
        "That small difference is a fine tool.",
        "A sound from below reaches the lower ear first.",
        "A sound from above reaches the higher ear first.",
      ],
    },
    {
      lines: [
        "The owl can tell which ear was first, and to what amount.",
        "From that it can work out how high the sound came from.",
        "The two ears also sit apart from left to right.",
        "A sound on the left reaches the left ear first.",
        "So the owl has both height and side from the same sound.",
        "It builds a picture of the place from sound alone.",
        "A mouse under snow makes a small scratching noise.",
        "That is enough for the owl to fall on the right spot.",
        "The face of an owl helps as well.",
        "It is a wide, flat set of stiff feathers.",
        "Those feathers work like a dish and gather sound in.",
        "The dish sends the sound toward the openings at the sides.",
      ],
    },
    {
      lines: [
        "There is a second half to the hunt, and it is silence.",
        "A hunter that makes noise cannot hear the small sounds.",
        "The feathers of an owl are built to hold the noise down.",
        "The front edge of the wing has a soft comb of fine teeth.",
        "That comb breaks the air into small streams.",
        "Small streams make far less noise than one large rush.",
        "The back edge of the wing is soft and ragged.",
        "It lets the air off the wing without a sharp sound.",
        "The rest of the feathers have a coat like fine hair.",
        "That coat takes up sound as the feathers move.",
        "An owl in the air is close to silent.",
        "It hears well, and it is not heard.",
      ],
    },
    {
      lines: [
        "An owl can also turn its head much further than we can.",
        "It has to, because its two great orbs cannot turn.",
        "Our sight organs roll in the skull. Those of an owl do not.",
        "So the whole head has to move instead.",
        "The neck holds twice the bones of our own neck.",
        "Special routes for the blood run through those bones.",
        "That is how the turn does not cut the blood off.",
        "Watch an owl on a branch and the head moves in small steps.",
        "Each step is the owl taking a new hearing.",
        "It is not looking around. It is listening around.",
        "Now think about how much of that we can also do.",
        "Two ears set apart, and a head that turns: we have both.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_A_SHIP_STANDS_ON_WATER: Serie = {
  slug: "en-w1-how-a-ship-stands-on-water",
  titel: "How a Ship Stands on Water",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A nail dropped into a bucket goes straight to the bottom.",
        "A ship is made of the same iron, and it does not.",
        "A ship can hold a whole town of goods and still float.",
        "The answer is not in the iron. It is in the shape.",
        "Set a bowl on water and watch where the water goes.",
        "The bowl pushes some of the water out of its place.",
        "That water has to go somewhere, so it rises a little.",
        "Water does not care to be pushed. It pushes back.",
        "The push it gives is called the lift, and it works upward.",
        "Here is the rule that holds it all together.",
        "The lift is as great as the water that was pushed aside.",
        "So a thing floats when it can push aside its own weight.",
      ],
    },
    {
      lines: [
        "Now take the nail and the ship again.",
        "The nail is small and solid iron all through.",
        "It pushes aside no more water than its own small form.",
        "That little water weighs less than the nail does.",
        "So the lift is too small, and the nail goes down.",
        "The ship is in the main air inside a thin iron shell.",
        "Its hull is wide and deep and holds a great room.",
        "It pushes aside a huge amount of water as it sits.",
        "That water weighs more than the whole ship weighs.",
        "So the lift is greater than the pull downward.",
        "The ship rises until the two are in balance.",
        "There it stands, and there it stops.",
      ],
    },
    {
      lines: [
        "This is the reason a loaded ship sits lower.",
        "Take on cargo and the ship must push aside more water.",
        "It can do that in one manner: it settles deeper.",
        "Sailors mark the hull with lines to watch this.",
        "The lines show how deep a ship is allowed to sit.",
        "Load it past that mark and it is no longer safe.",
        "Salt water gives a little more lift than fresh water.",
        "Salt water holds more matter in the same room.",
        "So the same ship rides higher at sea than in a river.",
        "The marks on the hull have a line for each of them.",
        "A ship that leaves a river for the open sea rises a little.",
        "None of this is a trick. It is the water doing its work.",
      ],
    },
    {
      lines: [
        "A hole in the hull ends the whole balance at once.",
        "Water comes in and takes the place of the air.",
        "The ship no longer pushes aside more than it weighs.",
        "So the lift falls short, and the ship goes down.",
        "That is the reason a hull is split into sealed rooms.",
        "One room can fill without the rest filling too.",
        "The ship sits lower, and it stands.",
        "A person in water works under the same rule.",
        "Fill the chest with air and the whole form floats better.",
        "Let the air out and it is harder to hold up.",
        "That is worth knowing before the first swimming lesson.",
        "Breathe in, hold still, and the water will hold on.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_A_SEED_TRAVELS: Serie = {
  slug: "en-w1-how-a-seed-travels",
  titel: "How a Seed Travels",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A plant stands in one place from its first hour to its last.",
        "It cannot walk off to look for better ground.",
        "And still, plants are found on hills far from other plants.",
        "The plant does not travel. The seed does.",
        "A seed is a small parcel with a whole plant asleep inside.",
        "It also holds a store of food for the first few weeks.",
        "The trouble is that it must land in a good spot.",
        "Under the parent plant is a poor spot indeed.",
        "There the ground is in shade and the roots are taken.",
        "So plants have worked out how to send seeds off.",
        "There are four main manners of doing it.",
        "Wind, water, animals, and a push from the plant itself.",
      ],
    },
    {
      lines: [
        "Wind is the first and the lightest of them.",
        "A dandelion seed hangs under a small crown of fine hairs.",
        "The hairs hold it in the air the manner a chute would.",
        "A breath of wind can take it across a whole field.",
        "A seed from a maple has a stiff blade on one side.",
        "As it falls, the blade sets it turning about a centre.",
        "The turn slows the fall and holds it in the air longer.",
        "Longer in the air means further from the tree.",
        "A pine seed has a thin flat wing that works the same manner.",
        "All these seeds have to be light to be moved at all.",
        "A light seed can take little food with it.",
        "So wind seeds must land somewhere good, or come to nothing.",
      ],
    },
    {
      lines: [
        "The second manner is water, and it works on coasts.",
        "A coconut has a thick husk full of trapped air.",
        "That husk lets it float for weeks on the open sea.",
        "It can come ashore on an island far from where it grew.",
        "The husk also keeps the salt out on the crossing.",
        "The third manner is animals, and there are two forms of it.",
        "Some seeds sit inside sweet fruit that animals eat.",
        "The seed itself has a hard coat and is not broken down.",
        "It passes through and lands with a small store of dung.",
        "That dung is food for the first roots.",
        "Other seeds do not wait to be eaten at all.",
        "A burdock seed has hooks that take hold of hair and cloth.",
      ],
    },
    {
      lines: [
        "Walk through rough ground and the hooks come home with us.",
        "A person can plant a hedge without meaning to.",
        "Those hooks were the model for the hook and loop band.",
        "A man in the alps looked at them under a glass.",
        "Then he made the same hooks out of cloth.",
        "The fourth manner is the plant doing the work itself.",
        "Some pods lose their water and the two halves pull apart.",
        "The strain builds until the pod splits with a snap.",
        "The snap throws the seeds a stride or more from the plant.",
        "Touch a ripe balsam pod and it goes off in the hand.",
        "Four routes out, and a plant that never moves at all.",
        "Look at the ground under a tree and the seeds are on the road.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const THE_BONES_IN_A_HAND: Serie = {
  slug: "en-w1-the-bones-in-a-hand",
  titel: "The Bones in a Hand",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "koerper",
  herkunft: HAND,
  etappen: [
    {
      lines: [
        "Hold one hand still and look at it with the other hand.",
        "It feels like one solid thing at the end of the arm.",
        "It is not. Two dozen and three bones are in there.",
        "That is more than a fourth of all the bones we have.",
        "Both hands together hold more than a hundred bones.",
        "The bones fall into three groups, and each has its work.",
        "Eight small ones sit in the wrist, in two rows of four.",
        "These are shaped like pebbles and roll on each other.",
        "That rolling is what lets the wrist bend in all directions.",
        "Five long bones run from the wrist into the palm.",
        "Feel the back of a hand and those five are near the skin.",
        "The last four and ten are the bones of the fingers.",
      ],
    },
    {
      lines: [
        "Each finger holds three of them, one after another.",
        "The thumb holds two, and that is the first thing to note.",
        "The thumb is short one bone, and it does more than the rest.",
        "The reason is where the thumb bone meets the wrist.",
        "That joint is shaped like a saddle, hollow in two directions.",
        "A saddle joint can rock and it can also turn.",
        "So the thumb can come across to meet each finger tip.",
        "Hold a pen and count how much of the work the thumb does.",
        "No other finger can reach across the palm like that.",
        "That one joint is what makes the hand a tool.",
        "Braille reading rests on the same build.",
        "The finger holds still, the wrist rolls, the arm feeds the line.",
      ],
    },
    {
      lines: [
        "Bones alone would be a bag of pebbles and nothing more.",
        "The hand also holds bands that hold the bones together.",
        "And it holds cords that pull the bones about.",
        "Here is a thing that surprises most people.",
        "Almost none of the pulling parts sit in the hand at all.",
        "Make a fist and feel the underside of the arm.",
        "The parts that move the fingers are up there.",
        "Long cords run from the arm through the wrist to each finger.",
        "That is a good build. It keeps the fingers thin.",
        "Thin fingers can reach into a narrow place.",
        "If the pulling parts sat in the fingers, each would be fat.",
        "We would have paws, not hands.",
      ],
    },
    {
      lines: [
        "The finger tips hold more feeling nerves than most skin.",
        "That is the reason a finger tip can read raised dots.",
        "It can tell two points apart when both are a hair apart.",
        "The back of the arm cannot come near that.",
        "The skin of a finger tip is also ridged in fine lines.",
        "Those ridges help the finger hold on to smooth things.",
        "The ridges also seem to sharpen the sense of small shapes.",
        "The nail on the back gives the tip something to press on.",
        "Without a nail the pad would spread out under the load.",
        "Two dozen and three bones, a saddle joint, a nerve rich tip.",
        "All of it is at the end of the arm right now.",
        "Set the hand on the table and it is doing all of this.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_SOAP_CLEANS: Serie = {
  slug: "en-w1-how-soap-cleans",
  titel: "How Soap Cleans",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Get grease on both hands and hold them under the tap.",
        "The water runs off and the grease holds where it was.",
        "Now rub a little soap in and hold them under again.",
        "This time the grease comes off and runs down the drain.",
        "Water alone could not shift it. Soap could.",
        "To see the reason we have to look at water itself.",
        "Water parts hold on to each other with some force.",
        "That is the reason water pulls into round drops.",
        "Grease and oil hold on to each other in the same manner.",
        "But water and grease do not hold on to one another at all.",
        "Pour oil into water and the two will not stir together.",
        "Leave the glass alone and the oil comes back to the top.",
      ],
    },
    {
      lines: [
        "Soap is made of parts with a most unusual shape.",
        "Each one is a long thin part with two different ends.",
        "One end is at home in water and holds on to it.",
        "The other end will not touch water at all.",
        "That other end holds on to grease instead.",
        "So each soap part has a foot in both camps.",
        "Drop soap into water full of grease and the parts go to work.",
        "The grease loving ends dig into the grease.",
        "The water loving ends stick out into the water.",
        "Soon a ball of grease is covered in soap parts.",
        "From the outside that ball now looks like water to water.",
        "So the water can take hold of it and lift it off.",
      ],
    },
    {
      lines: [
        "These small covered balls have a name: micelles.",
        "A single drop of soaped water holds a great host of them.",
        "Each one has a bit of dirt or grease shut inside.",
        "The tap water takes them all down the drain together.",
        "That is the whole of it: soap makes grease behave like water.",
        "There is a second thing soap does at the same time.",
        "Water parts pull hard on each other at the surface.",
        "That pull makes it hard for water to soak into cloth.",
        "Soap parts get in between and weaken that pull.",
        "So soaped water can reach into small spaces and seams.",
        "It runs into the weave of a cloth where plain water sits on top.",
        "Both effects work at once, and that is enough.",
      ],
    },
    {
      lines: [
        "Soap has been made for thousands of seasons in one manner.",
        "Fat is cooked with wood ash or with lime.",
        "That cooking breaks the fat into the long two ended parts.",
        "Old soap was harsh on the hands and it did work.",
        "The rule about washing hands rests on all of this.",
        "Rubbing matters as much as the soap does.",
        "Rubbing breaks the grease into balls small enough to lift.",
        "Warm water helps, because warm grease is softer.",
        "And the time matters, because the parts need a moment to work.",
        "Count out a slow verse and the soap has done its work.",
        "Then rinse, and the micelles go with the water.",
        "Nothing about it is magic. It is one part with two ends.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_LEAVES_TURN_RED_AND_GOLD: Serie = {
  slug: "en-w1-how-leaves-turn-red-and-gold",
  titel: "How Leaves Turn Red and Gold",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "herbst",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "In autumn the leaves of some trees turn gold and red.",
        "It looks as if the tree is painting them.",
        "The truth is closer to the other side of that.",
        "The gold was in the leaf all summer, under the green.",
        "A leaf is a small works that makes food out of light.",
        "The part that catches the light is a green stuff.",
        "It uses that light to build sugar out of air and water.",
        "There is so much of the green stuff that we see nothing else.",
        "But the leaf holds other colours as well.",
        "One set of them is gold and orange, and it helps with the light.",
        "It catches beams the green stuff cannot use.",
        "All summer that gold is there and hidden.",
      ],
    },
    {
      lines: [
        "When the nights get cold, the tree makes a hard choice.",
        "Broad leaves lose water fast, and in winter water is scarce.",
        "Frozen ground holds water the roots cannot draw up.",
        "A tree in leaf in winter would run itself parched.",
        "So the tree shuts the leaves down and lets them go.",
        "It begins to build a seal at the foot of each leaf stem.",
        "The seal cuts the leaf off from the water of the tree.",
        "With no fresh water the green stuff cannot be kept up.",
        "It breaks down, and the tree draws the good parts back in.",
        "As the green fades, the gold that was there comes out.",
        "Nothing has been added to make a leaf gold.",
        "Something has been taken from the leaf instead.",
      ],
    },
    {
      lines: [
        "Red is a different tale, and a stranger one.",
        "Red is not sitting there under the green all summer.",
        "The leaf makes it fresh, in the last weeks of its life.",
        "That seems a waste for a leaf about to fall.",
        "Trees do it in cold bright autumns, and not in dull ones.",
        "It takes sun in the afternoon and cold at night.",
        "One thought is that the red works as a screen.",
        "Bright light can harm a leaf that is shutting down.",
        "The red coat lets the tree finish drawing the good parts back.",
        "Another thought is that red marks the tree to insects.",
        "Not all of it is settled, and that is worth saving.",
        "Some of what a maple does in October is not settled.",
      ],
    },
    {
      lines: [
        "The seal at the foot of the stem keeps growing.",
        "In the end it cuts the last thread that holds the leaf on.",
        "A breath of wind, or the weight of rain, and the leaf lets go.",
        "The scar it leaves behind is sealed against water and rot.",
        "Look at a bare branch and those small scars are in rows.",
        "On the ground the leaves are food for the soil.",
        "Worms pull them under and small life breaks them down.",
        "What the tree could not take back comes back through the roots.",
        "Not one leaf on the ground is a loss to the wood.",
        "Pine trees keep their needles and do it another manner.",
        "A needle loses far less water than a broad leaf does.",
        "So the pine stands green and the maple stands bare.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_A_SNAIL_MOVES: Serie = {
  slug: "en-w1-how-a-snail-moves",
  titel: "How a Snail Moves",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A snail has no legs and it still gets where it is going.",
        "Watch one cross a stone and nothing seems to move.",
        "Look closer at the underside and there is a lot going on.",
        "The whole flat underside of a snail is one broad foot.",
        "That foot is a sheet of muscle from front to back.",
        "The snail does not slide the foot along in one piece.",
        "It sends waves down the foot, from the tail to the head.",
        "Each wave lifts a small band of the foot off the ground.",
        "The lifted band moves forward a little and sets down again.",
        "Then the band behind it does the same thing.",
        "So a snail walks on a set of small steps at once.",
        "The whole animal creeps forward the width of each step.",
      ],
    },
    {
      lines: [
        "Under all of it there is a thin coat of slime.",
        "That slime does more work than most people think.",
        "It is not there to make the snail slick.",
        "It is a stuff that can be either firm or loose.",
        "Left alone, it sets and holds the snail in place.",
        "Press on it hard, and it turns thin and lets the foot slide.",
        "So each wave presses, the slime gives, and the band moves.",
        "Between the waves the slime sets and holds fast.",
        "A snail can hold on to a wall or crawl on a ceiling.",
        "It can also cross the sharp edge of a blade and not be cut.",
        "The slime lifts it just clear of the edge.",
        "One stuff that is both glue and grease at once.",
      ],
    },
    {
      lines: [
        "The trail a snail leaves is that same slime.",
        "It costs the snail a lot to make, in water and in food.",
        "Some snails follow the trails of others to save that cost.",
        "A snail that walks on a fresh trail spends far less.",
        "The shell is the other half of the tale.",
        "It grows with the snail from the first hours of its life.",
        "The animal builds it at the open lip, a band at a time.",
        "The lines on a shell are the marks of that growth.",
        "A shell is made from lime the snail takes in with its food.",
        "In ground with little lime the shells are thin.",
        "The snail can pull the whole of itself in behind a door.",
        "In a parched spell it seals that door with hard slime.",
      ],
    },
    {
      lines: [
        "The head has two sets of horns, and both can be pulled in.",
        "On the top pair sit the small dark sight organs.",
        "These see light and shade and not much more.",
        "The lower pair is for smell and touch and does more work.",
        "A snail finds food far more with smell than with sight.",
        "It has a tongue set with thousands of small hard teeth.",
        "The tongue works like a file and rasps the food loose.",
        "That is the faint sound a snail makes on a leaf.",
        "Watch one on a wet stone and hold still.",
        "The waves under the foot can be seen from the side.",
        "It is worth the wait, and it takes some waiting.",
        "A garden snail keeps to a pace of its own.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const WHAT_A_SHADOW_IS: Serie = {
  slug: "en-w1-what-a-shadow-is",
  titel: "What a Shadow Is",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A shadow is not a thing. A shadow is a place.",
        "It is the place where the light did not arrive.",
        "Light moves in straight lines and does not bend around a wall.",
        "Put a hand in front of a lamp and the hand stops the light.",
        "Behind the hand there is a room the light cannot reach.",
        "That unlit room is the shadow, and it has the shape of the hand.",
        "The shape is a little larger than the hand itself.",
        "Light spreads out from a lamp in all directions.",
        "So the lines that graze the hand keep spreading behind it.",
        "Hold the hand near the wall and the shadow is small and sharp.",
        "Draw it back toward the lamp and the shadow grows.",
        "Nothing about the hand changed. The distance did.",
      ],
    },
    {
      lines: [
        "Look at the edge of a shadow on a wall.",
        "It is not one hard line. There is a soft band as well.",
        "A lamp is not a single point of light.",
        "It is a small area, and light comes from all across it.",
        "Some of the light is blocked and some of it gets past.",
        "The dark middle is the part where all the light is blocked.",
        "The soft band is where some light still arrives.",
        "A small lamp far off gives a hard, clean edge.",
        "A broad lamp close up gives a wide soft band.",
        "On an overcast afternoon the whole heaven is the lamp.",
        "Then shadows are so soft that we scarce see them.",
        "In bright sun the shadow of a leaf has a clean edge.",
      ],
    },
    {
      lines: [
        "The sun moves across the heavens from morning to evening.",
        "So the shadow of a post moves as well, and it turns.",
        "At noon the sun stands at its highest for that date.",
        "The shadow is at its shortest at that moment.",
        "In the morning and the evening the sun sits low.",
        "Then the light comes in at a slant and the shadow is long.",
        "People read the hour from this for thousands of seasons.",
        "A sundial is a post and a set of marks on a plate.",
        "The post has to lean, and it has to lean north.",
        "Then the shadow moves at an even rate through the hours.",
        "Set a stick in the ground and mark the shadow each hour.",
        "The marks will not sit at even spaces unless the stick leans.",
      ],
    },
    {
      lines: [
        "The largest shadow we ever stand in is that of the moon.",
        "Now and then the moon comes between the earth and the sun.",
        "Its shadow falls on the ground and sweeps across it.",
        "In the dark middle of that shadow the sun is hidden.",
        "That band is narrow, and it moves fast across the land.",
        "Around it is the soft band, where part of the sun still shows.",
        "The earth casts a shadow of its own out into space.",
        "When the moon runs into it, the moon goes dark and red.",
        "The red comes from light bent around the rim of the earth.",
        "Both of these have been watched and recorded for ages.",
        "People knew how to reckon them before the reason was clear.",
        "A shadow is still a place where the light did not arrive.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_BATS_HEAR_THE_DARK: Serie = {
  slug: "en-w1-how-bats-hear-the-dark",
  titel: "How Bats Hear the Dark",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "sinne",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A bat comes out at dusk and hunts small insects in the air.",
        "It does this in the dark, at speed, without hitting a branch.",
        "For a long time no one could work out how.",
        "The old thought was that bats must see in the dark.",
        "A test showed that a bat with covered ears cannot manage at all.",
        "A bat with covered sight organs manages just as well as ever.",
        "So the hunt is done with sound, and not with light.",
        "The bat calls out as it moves, again and again.",
        "The calls are far too high for us to hear.",
        "Sound that high is called ultrasound.",
        "Each call goes out, meets something, and comes back.",
        "The bat listens for what comes back, and reads it.",
      ],
    },
    {
      lines: [
        "The first thing the return tells the bat is distance.",
        "Sound moves at a set rate through air.",
        "So the time between the call and the return is a measure.",
        "A short wait means the thing is close at hand.",
        "A long wait means it is further off.",
        "The bat can hold that reckoning for a whole room of objects.",
        "The second thing the return tells it is direction.",
        "The two ears of a bat sit apart, as ours do.",
        "A return from the left arrives at the left ear first.",
        "That small difference gives the side.",
        "The folds and ridges in the outer ear shape the sound as well.",
        "From that shaping the bat can also read height.",
      ],
    },
    {
      lines: [
        "The third thing is the hardest, and it is the most useful.",
        "The return also carries the size and the surface.",
        "A hard smooth wall sends back a clean strong return.",
        "A soft leaf sends back a weak scattered one.",
        "A moth in the air gives a small return that flickers.",
        "The flicker comes from the beat of the moth wings.",
        "So the bat can tell a moth from a falling leaf in the dark.",
        "As it closes in, the bat calls faster and faster.",
        "At the end the calls run together into a buzz.",
        "More calls in less time means a sharper picture.",
        "It is the same as looking harder as we come near a thing.",
        "The whole hunt can take less than a second.",
      ],
    },
    {
      lines: [
        "Some moths have found an answer to all of this.",
        "Certain moths can hear the calls of a bat coming.",
        "When one hears a call, it drops out of the air at once.",
        "Others send back a rush of clicks of their own.",
        "That rush seems to muddle the return the bat is listening for.",
        "So the hunt and the escape have both been sharpened.",
        "People use the same idea under water.",
        "A ship sends out a sound and times the return from the sea bed.",
        "From that it can draw a chart of what is below.",
        "Some people who cannot see use a form of this as well.",
        "A click of the tongue comes back off a wall or an open door.",
        "The ear can be trained to read a room. The bat had it first.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const WHERE_THE_WIND_COMES_FROM: Serie = {
  slug: "en-w1-where-the-wind-comes-from",
  titel: "Where the Wind Comes From",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Wind is air on the move, and nothing more than that.",
        "The harder part is what sets the air moving.",
        "The answer starts with the sun, as most answers do.",
        "The sun does not heat the ground in an even manner.",
        "Dark soil takes in more heat than bright sand.",
        "Bare rock heats faster than a stand of trees.",
        "Water heats slower than the land beside it.",
        "So one patch of ground is warmer than the patch beside it.",
        "The air above the warm patch takes that heat in.",
        "Warm air spreads out and grows lighter for its size.",
        "Lighter air cannot hold its place under cooler air.",
        "It rises, and it keeps on rising while it holds warmer.",
      ],
    },
    {
      lines: [
        "When the warm air lifts, it leaves a gap at the ground.",
        "Air does not leave a gap standing for long.",
        "Cooler air from around slides in to fill the space.",
        "That sliding in is what we feel as wind.",
        "So wind runs from the cool place toward the warm place.",
        "Higher up, the risen air spreads out and cools.",
        "As it cools it grows heavier and settles back down.",
        "It comes down somewhere cooler and joins the flow again.",
        "The whole thing turns like a slow wheel of air.",
        "One wheel can be as wide as a field or as wide as an ocean.",
        "Wind is the low part of that wheel, where we stand.",
        "The rest of it is above our heads and out of sight.",
      ],
    },
    {
      lines: [
        "The coast shows this better than most places do.",
        "In the morning the sun heats the land faster than the sea.",
        "The air above the land rises, and the cool sea air comes in.",
        "That is the breeze that blows off the water at noon.",
        "It brings the smell of salt inland with it.",
        "At night the whole thing turns around.",
        "Land loses its heat fast once the sun is down.",
        "The sea holds its heat far longer.",
        "Now the warmer air is over the water and rises there.",
        "So at night the breeze runs from the land out to sea.",
        "Fishermen have used that turn for hundreds of seasons.",
        "Out on the morning wind, home on the one at dusk.",
      ],
    },
    {
      lines: [
        "The same thing works on the scale of the whole earth.",
        "The middle of the earth takes the most sun.",
        "The far north and the far south take the least.",
        "So warm air rises at the middle and moves toward the poles.",
        "Cold air runs back along the ground toward the middle.",
        "But the earth is turning under all that moving air.",
        "The turn bends the flow to one side as it goes.",
        "That bend is what gives the great winds their set courses.",
        "Sailors learned those courses and named them.",
        "A ship could count on a wind in a given band of the sea.",
        "The whole trade of the old sailing ships rested on that.",
        "Warm air rising, cool air sliding in: it is all one rule.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_A_FEATHER_HOLDS_THE_HEAT: Serie = {
  slug: "en-w1-how-a-feather-holds-the-heat",
  titel: "How a Feather Holds the Heat",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A small bird can sit in the snow all night and live.",
        "It has no coat and no fire and no hot drink.",
        "It has feathers, and that turns out to be enough.",
        "To see how, we have to look at what holds heat in.",
        "Still air is one of the poorest carriers of heat there is.",
        "Heat crosses still air slower than it crosses cloth or wood.",
        "So a coat of trapped air is a fine screen against the cold.",
        "The trouble is that air will not hold still on its own.",
        "Moving air carries the heat off at once.",
        "A thing that holds heat must first hold the air.",
        "That is what a feather does, and it does it well.",
        "Air keeps the heat of the bird in, and not the feather.",
      ],
    },
    {
      lines: [
        "A bird wears two different sorts of feather.",
        "The outer ones are flat and firm and lie in rows.",
        "Each has a stiff shaft with a blade on either side.",
        "The blade is made of fine branches set close together.",
        "Each branch carries smaller branches with hooks on them.",
        "The hooks catch on the branches beside them and hold fast.",
        "So the whole blade locks into one smooth sheet.",
        "That sheet turns the rain and holds the wind out.",
        "When a bird runs its beak along a feather, it is doing repairs.",
        "It is hooking the loose branches back together.",
        "A bird that cannot preen will not hold its warmth.",
        "The outer coat is the roof. Under it comes the rest.",
      ],
    },
    {
      lines: [
        "Under the flat feathers sits a soft mass called down.",
        "Down has no hooks and no flat blade at all.",
        "Its branches spread out in all directions from the base.",
        "That tangle is the whole point of it.",
        "The tangle holds a great deal of air in small pockets.",
        "The air cannot flow from one pocket into another.",
        "So the heat of the bird has to cross still air to get out.",
        "It crosses slow, and most of it does not get out at all.",
        "The thicker the down, the more still air there is.",
        "This is the reason a down coat is warm and weighs little.",
        "The warmth is not in the down. It is in the air the down holds.",
        "Press a down coat flat and the warmth goes with the air.",
      ],
    },
    {
      lines: [
        "In hard cold a bird will fluff itself into a ball.",
        "It lifts the outer feathers and lets the down open out.",
        "That holds more air, and the ball of air gets thicker.",
        "A robin in the snow looks round for that reason alone.",
        "It also tucks one foot up into the feathers.",
        "The bare foot is where the heat would run out fastest.",
        "Birds stand on cold ice with bare feet and manage it.",
        "The blood on the route out passes the blood on the route back.",
        "The warm blood hands its heat over before it reaches the foot.",
        "So the foot runs cold and the heat holds in the bird.",
        "Feathers, down, a fluffed ball and a clever set of blood routes.",
        "None of it is a coat. All of it is a manner of holding air.",
      ],
    },
  ],
};

/** Die dreizehn Wissens-Serien der Charge W1 fuer en/kids, alle auf Sprosse 25. */
export const SERIEN_EN_WISSEN_KIDS: Serie[] = [
  HOW_ICE_FLOATS,
  WHAT_MAKES_A_RAINBOW,
  HOW_OWLS_HEAR_IN_THE_DARK,
  HOW_A_SHIP_STANDS_ON_WATER,
  HOW_A_SEED_TRAVELS,
  THE_BONES_IN_A_HAND,
  HOW_SOAP_CLEANS,
  HOW_LEAVES_TURN_RED_AND_GOLD,
  HOW_A_SNAIL_MOVES,
  WHAT_A_SHADOW_IS,
  HOW_BATS_HEAR_THE_DARK,
  WHERE_THE_WIND_COMES_FROM,
  HOW_A_FEATHER_HOLDS_THE_HEAT,
];
