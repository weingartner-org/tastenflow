/**
 * ENGLISCHE WISSENS-SERIEN FÜR ERWACHSENE - Charge W1, 29.08.2026.
 * Zwölf Serien, Stufe `erwachsen`, alle auf **Sprosse 25** (ohne `y`, `x`, `q`).
 *
 * Gezählt am 29.08.: `en/erwachsen` hatte acht Wissens-Serien, das Ziel sind
 * zwanzig. Grundlage:
 * `Sensorik/QUELLEN-2026-08-29-TASTENFLOW-FREIE-TEXTE.md`.
 *
 * ⚠️ **Warum hier keine Jahreszahlen stehen.** Ziffern heben eine Serie auf
 * Tier 5. Ausgeschrieben scheitert es am `y`: *twenty* trägt eines, und ohne
 * *twenty* gibt es kein Jahr zwischen zwanzig und hundert. Die drei
 * geschichtlichen Serien (Insulin, Führhund, Gummi) nennen deshalb die
 * Personen und die Reihenfolge, aber keine Jahreszahl - lieber eine Lücke
 * als eine Zahl, die man nicht prüfen kann.
 *
 * ★ Zwei Serien liegen am Thema der Plattform: was ein Führhund lernt und
 * wie eine Sprachausgabe spricht. Beide sind an den Stellen, wo es strittig
 * ist, bewusst zurückhaltend formuliert.
 *
 * ── FAKTEN, DIE GEGENGELESEN WURDEN ──────────────────────────────────────
 * • Insulin: Banting und Best isolierten den Auszug in Toronto, Macleod stellte
 *   das Labor, Collip reinigte ihn; der erste Mensch war Leonard Thompson,
 *   vierzehn Jahre alt; der Nobelpreis ging an Banting und Macleod, die ihn
 *   mit Best und Collip teilten. (University of Toronto, Nobelprize.org,
 *   Canadian Encyclopedia)
 * • Führhunde: Die erste Schule eröffnete Gerhard Stalling in Deutschland
 *   während des Krieges für erblindete Soldaten; Dorothy Harrison Eustis
 *   schrieb später über die Schule in Potsdam; Morris Frank kam mit Buddy
 *   in die Vereinigten Staaten. (International Guide Dog Federation,
 *   The Seeing Eye)
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

const INSULIN_Q = {
  quelle:
    "Sensorik (selbst formuliert); Hergang geprüft an University of Toronto, Nobelprize.org und The Canadian Encyclopedia",
  lizenz: "Eigenes Werk",
  autor: "Sensorik-Lernplattform",
  fundstelle: "https://heritage.utoronto.ca/exhibits/insulin",
  en: {
    quelle:
      "Sensorik (self-written); the account checked against University of Toronto, Nobelprize.org and The Canadian Encyclopedia",
    lizenz: "Own work",
    autor: "Sensorik learning platform",
  },
} as const;

const FUEHRHUND_Q = {
  quelle:
    "Sensorik (selbst formuliert); Hergang geprüft an International Guide Dog Federation und The Seeing Eye",
  lizenz: "Eigenes Werk",
  autor: "Sensorik-Lernplattform",
  fundstelle: "https://www.igdf.org.uk/guide-dogs/history-of-guide-dogs/",
  en: {
    quelle:
      "Sensorik (self-written); the account checked against International Guide Dog Federation and The Seeing Eye",
    lizenz: "Own work",
    autor: "Sensorik learning platform",
  },
} as const;

// ───────────────────────────────────────────────────────────────────────────
const WHAT_A_GUIDE_DOG_LEARNS: Serie = {
  slug: "en-w1-what-a-guide-dog-learns",
  titel: "What a Guide Dog Learns",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "sinne",
  herkunft: FUEHRHUND_Q,
  etappen: [
    {
      lines: [
        "A common notion about guide dogs is that the dog leads.",
        "It is closer to the truth to call it a team of two.",
        "The person holds the route in mind and gives the commands.",
        "The dog handles what is in front of the two of them.",
        "The person decides to turn left at the third crossing.",
        "The dog decides how to get past the parked van.",
        "Neither could do the walk without the other.",
        "The first school of this sort opened in the German lands.",
        "It was set up in the great war, for soldiers who lost their sight.",
        "The teacher was a doctor named Gerhard Stalling.",
        "The idea spread, and a later school stood at Potsdam.",
        "An American named Harrison Eustis wrote about that school.",
      ],
    },
    {
      lines: [
        "A man named Morris Frank read what she had written.",
        "He asked her to teach him and a dog together.",
        "He came home from Switzerland with a dog and a plan.",
        "The two of them founded the first school in the States.",
        "A dog for this work is chosen before it is trained.",
        "Not each dog can do it, and no amount of training changes that.",
        "What is looked for is a calm dog that is not startled.",
        "A dog that chases a cat has ended the walk for both of them.",
        "The dog also has to be sound in the hips and the joints.",
        "This is hard work, and it is done for a great part of a life.",
        "Puppies live with a volunteer household for the first stretch.",
        "There the dog learns houses, buses, shops and children.",
      ],
    },
    {
      lines: [
        "The formal training comes later and it is not long.",
        "The dog learns to walk a little ahead and to the left.",
        "It learns to stop at a kerb and hold until it is told to go.",
        "It learns to walk around an obstacle and come back to the line.",
        "It learns to stop under a branch that would strike the head.",
        "None of that is possible without the last one, and it is the hard one.",
        "The dog must refuse a command that would put the two in danger.",
        "If the command is forward and a car is coming, the dog holds.",
        "The trade calls that intelligent disobedience.",
        "It is the one moment where the dog overrules the person.",
        "Teaching a dog to heed a command is common work.",
        "Teaching it when not to heed one is the whole art here.",
      ],
    },
    {
      lines: [
        "A guide dog does not read a road sign or know the address.",
        "It does not know where the person means to go.",
        "The person builds the route from what is held in mind.",
        "The dog fills in the part that cannot be heard or felt.",
        "That is the reason a guide dog is not the same as a cane.",
        "A cane reads the ground a stride ahead, and it never tires.",
        "A dog reads further ahead and can plan around a whole obstacle.",
        "Neither is better. Each suits a different person and route.",
        "A lot of people use both, on different sorts of walk.",
        "One rule matters to all the rest of us on the street.",
        "A dog in harness is at work and is not to be spoken to.",
        "Speak to the person instead. The dog has a task in hand.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_A_SCREEN_READER_SPEAKS: Serie = {
  slug: "en-w1-how-a-screen-reader-speaks",
  titel: "How a Screen Reader Speaks",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A screen is a field of small coloured lamps and nothing more.",
        "A machine that speaks a screen cannot start from those lamps.",
        "It has to start from what the lamps were drawn from.",
        "So a screen reader does not look at the screen at all.",
        "It asks the program what it has put there and what each part is.",
        "That is the first thing to understand about the whole trade.",
        "A button on a screen is a shape drawn in the lamps.",
        "Under it the program holds a note: this is a button.",
        "The note also holds the name and whether it is pressed.",
        "The screen reader reads that note and speaks it.",
        "If the program left the note blank, there is nothing to speak.",
        "The button is drawn, it works, and it cannot be named.",
      ],
    },
    {
      lines: [
        "That is the reason an unlabelled button is such a common fault.",
        "To one person it is an obvious arrow on a bar.",
        "To another it is the word button and nothing else.",
        "The same holds for an image without a written note.",
        "The screen reader can announce that an image is there.",
        "What is in it, it cannot see and cannot guess.",
        "It also builds an order for moving through a page.",
        "That order comes from the structure the program handed over.",
        "Headings, lists, tables and regions are all part of it.",
        "With them a person can leap from heading to heading.",
        "Without them the page is one long run of words.",
        "Structure is what turns reading into looking things up.",
      ],
    },
    {
      lines: [
        "The second half is turning the words into sound.",
        "The old manner was to store small pieces of recorded speech.",
        "The machine cut and joined them to build each word.",
        "That is the reason older voices had a clipped, jointed sound.",
        "The joins were audible, and the beat was flat.",
        "It was clear enough to work with, and it was tiring to hear.",
        "The newer manner builds the sound from a trained model.",
        "The model has learned how speech moves from one sound to another.",
        "It can hold a beat across a whole sentence.",
        "The result is closer to a person and is easier over long hours.",
        "It also needs far more computing, and it can be slower to start.",
        "Both sorts are in use, and each has a place.",
      ],
    },
    {
      lines: [
        "There is one point that surprises people who hear it first.",
        "Practised users run the speech far faster than most can follow.",
        "Rates of three or four hundred words a minute are common.",
        "At that rate a page is read in the time it takes to see one.",
        "The ear can be trained to it, and the training takes months.",
        "A new user starts slow and moves the rate up over a season.",
        "The other half of the work does not use sound at all.",
        "A braille line sets pins up under the fingers, a row at a time.",
        "The same notes from the program feed both the voice and the pins.",
        "Braille is slower than fast speech, and it is silent.",
        "It also shows spelling, which speech runs past.",
        "For code and for spelling, a lot of people reach for the pins.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_INSULIN_WAS_FOUND: Serie = {
  slug: "en-w1-how-insulin-was-found",
  titel: "How Insulin Was Found",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "koerper",
  herkunft: INSULIN_Q,
  etappen: [
    {
      lines: [
        "Before insulin, a child with the severe diabetes died.",
        "There was no treatment that could change that outcome.",
        "The one thing that helped at all was near starvation.",
        "A doctor could hold a child alive for a season on almost no food.",
        "It bought time, and it was a hard thing to prescribe.",
        "The trouble sits in a gland behind the stomach.",
        "It is called the pancreas, and it has two separate tasks.",
        "One is to send juices into the gut to break down food.",
        "The other is to send a substance into the blood.",
        "That substance lets the cells take in sugar and use it.",
        "Without it, sugar builds up in the blood and is lost in the water.",
        "The cells starve with sugar all around them.",
      ],
    },
    {
      lines: [
        "It had been shown that removing the gland caused the illness.",
        "So the substance had to be in there somewhere.",
        "Getting it out was the problem that held all of them up.",
        "The juices that break down food also break down the substance.",
        "Grind up the gland and the thing sought is broken up.",
        "That is where the work at Toronto came in.",
        "A surgeon named Banting had an idea about the order of things.",
        "Tie off the ducts that lead the juices out, and wait.",
        "The part that makes the juices withers first.",
        "The part that makes the substance holds on longer.",
        "Then the gland can be taken and the substance drawn out.",
        "He needed a room to work in, and he had none of his own.",
      ],
    },
    {
      lines: [
        "He asked Macleod at the college, who gave him a room.",
        "He also gave him a student assistant named Best.",
        "The two of them worked through a summer on the idea.",
        "The first drawn fluid worked on dogs and was crude and impure.",
        "A biochemist named Collip then took on the cleaning.",
        "His purified fluid was what could be given to a person.",
        "The first was a lad of fourteen named Leonard Thompson.",
        "He was near death, and he weighed almost nothing.",
        "The first injection was the crude one and did little.",
        "The purer fluid came a fortnight later, and it worked.",
        "His blood sugar fell and he came back to himself.",
        "The word went out, and it went out fast.",
      ],
    },
    {
      lines: [
        "What followed reads like a strange sort of miracle.",
        "Wards held children who had been sent there to die.",
        "Some were in a coma, and parents were waiting at the beds.",
        "The doctors went from bed to bed with the drawn fluid.",
        "Before the last child was reached, the first ones were waking.",
        "The prize came the following season, to Banting and Macleod.",
        "Banting shared his half of the prize with Best.",
        "Macleod shared his half with Collip.",
        "The four of them sold the patent to the college.",
        "The sum was one dollar, and that was the whole of it.",
        "The point was that no one should hold the substance back.",
        "What it costs a person to live has been argued about ever since.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const WHAT_A_BAROMETER_MEASURES: Serie = {
  slug: "en-w1-what-a-barometer-measures",
  titel: "What a Barometer Measures",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Above our heads there stands a column of air.",
        "It reaches up for miles, and it has weight.",
        "That weight presses on the ground and on all of us.",
        "The press is about the weight of a car on a table top.",
        "We do not feel it because it comes from all sides at once.",
        "The inside of the frame presses back with the same force.",
        "A barometer is a device for reading that press.",
        "The first one was made in the Italian lands, and it is elegant.",
        "Fill a long tube with the silver metal that flows.",
        "Seal one end, and stand the tube upright in a dish of the same.",
        "Some of the metal runs out of the tube into the dish.",
        "But it does not all run out, and there the matter starts.",
      ],
    },
    {
      lines: [
        "The column in the tube settles at a certain height.",
        "Above it, in the sealed end, there is nothing at all.",
        "The air cannot get in there, so the column is not held up from above.",
        "It is held up from below. The air presses on the dish.",
        "So the height of the column is a reading of the air press.",
        "Torricelli built this and understood what it meant.",
        "The column stands at about the height of an arm.",
        "Take the whole thing up a mountain and the column falls.",
        "There is less air above, so there is less to press down.",
        "That was the proof, and it was carried out on a mountain in France.",
        "It also gave the world a manner of measuring height.",
        "Read the press and the height above the sea follows from it.",
      ],
    },
    {
      lines: [
        "A tube of flowing metal is of great weight and it can break.",
        "So a second sort was built, and it is the common one now.",
        "Take a shallow metal can and draw most of the air out of it.",
        "Seal it, and hold the lid off the base with a small spring.",
        "When the air press rises, the lid is pushed in a little.",
        "When it falls, the spring lets the lid come out.",
        "A train of levers turns that small move into a swing of a hand.",
        "The whole thing fits on a wall and holds no fluid.",
        "The trade calls it the aneroid, which means without fluid.",
        "The same can, with a pen on the lever, draws a line on a drum.",
        "That gives a record of the press over a week.",
        "Such a record is what a forecaster begins with.",
      ],
    },
    {
      lines: [
        "The reading matters less than the direction it is moving.",
        "An even fall means a front of wet weather is coming.",
        "A fast fall means it is coming soon and it will be rough.",
        "An even rise means the weather is settling.",
        "That is the reason old barometers have words on the dial.",
        "Storm, rain, change, fair, and set fair.",
        "The words are a rough guide and are not to be trusted alone.",
        "A high press at the coast can still sit under a cold wind.",
        "Air moves from where the press is high to where it is low.",
        "Around a low, the turning earth bends that flow into a spiral.",
        "So a falling barometer means the spiral is on its route to us.",
        "Sailors read this instrument before there was a forecast to hear.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const WHAT_CONCRETE_DOES: Serie = {
  slug: "en-w1-what-concrete-does",
  titel: "What Concrete Does",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Concrete is poured as a thick fluid and ends as stone.",
        "It is the most used building material in the world.",
        "Most people take it for a sort of glue that hardens.",
        "It is closer to a slow growth of small locked forms.",
        "The blend has four parts and each is needed.",
        "Cement is the powder that does the chemical work.",
        "Sand and gravel make up the bulk and are the cheap part.",
        "Water is the fourth, and it is not a filler at all.",
        "Cement is made from limestone burnt at a fierce heat.",
        "The burning drives one gas out of the stone.",
        "What is left is ground to a fine pale powder.",
        "That powder is unstable, and that is the whole point.",
      ],
    },
    {
      lines: [
        "Add water and the powder begins to take it back in.",
        "The water does not leave again as it does from mud.",
        "It is drawn into the structure of new forms.",
        "Those forms grow out from each grain as fine needles.",
        "The needles from one grain reach the needles from another.",
        "Where these needles meet, all of them lock together.",
        "In a few hours the mass can hold its own shape.",
        "In a month it has most of the strength it will ever have.",
        "It goes on gaining a little for a hundred seasons after that.",
        "So concrete does not lose its water. It sets.",
        "Concrete under water sets just as well.",
        "That is the reason it can be poured for a harbour wall.",
      ],
    },
    {
      lines: [
        "Too much water in the blend is the common fault.",
        "Wet concrete is easier to pour and to work into a form.",
        "But the water that is not taken up leaves small holes.",
        "Those holes are where the strength goes.",
        "So the trade rule is to use the least water that will pour.",
        "The other fault is letting the surface lose water too soon.",
        "If the top goes hard before the setting is done, it cracks.",
        "So fresh concrete is kept damp for the first week.",
        "Concrete is strong against pressing and weak against pulling.",
        "It is about ten times stronger one manner than the other.",
        "A beam of plain concrete cracks along its underside at once.",
        "That is where the steel comes in.",
      ],
    },
    {
      lines: [
        "Steel bars are laid in the form before the pour.",
        "The bars are set low, where the pulling load will be.",
        "The concrete handles the pressing, the steel handles the pulling.",
        "The two hold together because both move alike under heat.",
        "If one grew and the other did not, the bond would break.",
        "That match is a stroke of luck and the trade rests on it.",
        "The concrete also seals the steel against damp air.",
        "Fresh concrete is a strong alkali, and that guards the steel.",
        "In time the surface takes in gas from the air and turns neutral.",
        "Once the guard is gone, water reaches the bars and rust begins.",
        "Rust swells, and the swelling cracks the concrete open.",
        "That is the slow illness of half the bridges built since then.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const WHAT_A_LIGHTHOUSE_DOES: Serie = {
  slug: "en-w1-what-a-lighthouse-does",
  titel: "What a Lighthouse Does",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A lighthouse has to solve a problem that sounds simple.",
        "It must be seen from far out at sea, in bad weather.",
        "And it must be told apart from all the other lights ashore.",
        "A bright lamp alone will not do either of those.",
        "Light from a bare lamp goes out in all directions.",
        "Almost all of it goes up into the air or down into the rock.",
        "Just a thin band of it ever runs out toward a ship.",
        "So the first task is to gather the light into that band.",
        "A curved mirror behind the lamp sends the back half forward.",
        "That helps, and it was the first answer.",
        "A lens in front would help more, and there the trouble started.",
        "A lens large enough to do it would be too thick to make.",
      ],
    },
    {
      lines: [
        "A thick lens cracks as it cools and it is of great weight.",
        "The answer came from a French engineer named Fresnel.",
        "He saw that the bending is done at the surface of a lens.",
        "The glass in the middle just holds the surfaces apart.",
        "So he cut the lens into a set of rings.",
        "Each ring keeps the surface angle it had in the full lens.",
        "The bulk behind it is thrown out.",
        "The rings are set in a frame, one inside the other.",
        "It is a hand span thick and does the work of a barrel.",
        "It gathers almost all the light into one flat beam.",
        "That beam can be seen from far out past the horizon.",
        "The design is still in use, and not just in lighthouses.",
      ],
    },
    {
      lines: [
        "Now for the second problem: telling one light from another.",
        "The answer is that no two lights near each other flash alike.",
        "Each one has a set pattern, and the pattern is its name.",
        "One flashes once each half minute.",
        "Another gives a group of three and then a long dark.",
        "A third holds an even light with a short dark cut into it.",
        "The patterns are printed on the chart beside each light.",
        "A sailor times the flashes and reads off the position.",
        "In fog the light is useless, so a sound is used instead.",
        "That sound has a pattern of its own for the same reason.",
        "Some stations also send a radio mark on a set band.",
        "The lighthouse is a sign that speaks its own name.",
      ],
    },
    {
      lines: [
        "Making the light turn was its own small trade.",
        "The whole lens frame had to rotate at an even rate.",
        "Some of the great ones floated on a bath of the flowing metal.",
        "The float took the weight and left almost no drag.",
        "A falling weight on a chain drove the turn, as in a clock.",
        "The keeper wound that weight back up through the night.",
        "The keeper also trimmed the wick and kept the glass clean.",
        "Salt mist on the glass could cut the range in half.",
        "Almost all of these stations run without a keeper now.",
        "The lamp is electric and the turn is done with a small motor.",
        "Ships hold their place from satellites and not from a beam.",
        "The lights are kept on all the same, for the hour the rest fails.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_A_WELL_REACHES_WATER: Serie = {
  slug: "en-w1-how-a-well-reaches-water",
  titel: "How a Well Reaches Water",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "natur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Rain that falls on a field does not all run off it.",
        "Some soaks in and moves down between the grains of soil.",
        "It keeps going down as long as there is room to go.",
        "In the end it reaches rock that it cannot pass.",
        "There it stops and begins to fill the spaces above.",
        "So there is a zone where all the small spaces hold water.",
        "The top of that zone has a name: the water table.",
        "Above it the ground is damp but the spaces hold air.",
        "Below it the spaces are full and hold no air at all.",
        "A well is a hole sunk to below that line.",
        "Water runs in from the sides and stands in the hole.",
        "The level in the well is the level of the table around it.",
      ],
    },
    {
      lines: [
        "The water table is not flat, and that is worth knowing.",
        "It follows the shape of the land above, in a softer form.",
        "Under a hill it stands higher. Under a hollow it stands lower.",
        "Where it meets the surface, a spring runs out.",
        "A river in a wet season is the water table showing itself.",
        "The table also rises and falls through the seasons.",
        "It stands high after the wet months and falls through a hot summer.",
        "A shallow well can run out in a hot season and fill again later.",
        "That is not a fault in the well. It is the table moving.",
        "Draw water fast from a well and the level around it dips.",
        "The dip has the form of a shallow funnel around the shaft.",
        "Two wells set close will draw on the same funnel and both suffer.",
      ],
    },
    {
      lines: [
        "The rock that holds and passes the water has a name of its own.",
        "It has to have spaces, and the spaces have to join up.",
        "Sandstone and gravel do this well and hold a great store.",
        "Packed earth of the finest grain holds water and will not pass it.",
        "So a bed of it works as a floor, and sometimes as a lid.",
        "Where such a bed lies over the water bearing rock, it seals it.",
        "Then the water below can be under pressure from higher ground.",
        "Bore through the seal and the water rises on its own.",
        "It can rise above the ground and run without a pump.",
        "Such a well is named after a region in France where these were dug.",
        "Deep wells of this sort can reach water that fell long ago.",
        "In some parched lands that water has been underground for ages.",
      ],
    },
    {
      lines: [
        "A well is also a hole straight down into the drinking store.",
        "Whatever runs into it goes into the water all of us draw.",
        "So the top is raised above the ground and given a cover.",
        "The first stretch of the shaft is sealed against the sides.",
        "Without it, surface water runs down outside the lining.",
        "It carries with it whatever was on the field above.",
        "A well set below a farm is a well set below the drainage.",
        "The old rule was to put the well uphill of the cattle.",
        "Where the ground is coarse gravel, the filtering is poor.",
        "Where it is fine, the water is cleaned as it creeps through.",
        "That slow creep is a treatment works that no one built.",
        "It takes months, and it is the reason old wells ran clean.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const WHAT_A_THERMOMETER_DOES: Serie = {
  slug: "en-w1-what-a-thermometer-does",
  titel: "What a Thermometer Does",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Heat and hotness are not the same, and the difference matters.",
        "A bath holds more heat than a cup of boiling water.",
        "The cup is hotter. The bath holds more of it.",
        "A thermometer does not measure heat. It measures hotness.",
        "It does that in a roundabout manner, and it has to.",
        "There is no direct sense for hotness that can be trusted.",
        "Put one hand in cold water and one in warm.",
        "Then put both into the same bowl in the middle.",
        "One hand reports warm and the other reports cold.",
        "So the reading has to come from a thing, not from a person.",
        "Almost all matter grows a little larger as it gets hotter.",
        "That small growth is what a thermometer reads.",
      ],
    },
    {
      lines: [
        "A fluid in a thin tube shows the growth well.",
        "The bulb at the base holds a large amount of the fluid.",
        "The tube above it is narrow, no wider than a hair.",
        "A small growth in the bulb sends the fluid far up the tube.",
        "So a change too small to see becomes a move of a finger width.",
        "For a long time the fluid was the silver metal that flows.",
        "It grows at an even rate over a wide range of hotness.",
        "It does not wet the glass, so it leaves a clean surface.",
        "And it holds fluid from below freezing to far above boiling.",
        "It is also a poison, and that has ended its use in most places.",
        "Coloured alcohol has taken over for common work.",
        "It freezes at a much lower point, which suits cold lands.",
      ],
    },
    {
      lines: [
        "A scale needs two set points that can be found again.",
        "Freezing water and boiling water are the common pair.",
        "Both hold still at one hotness while the change is going on.",
        "Water at its freezing point stops falling until all of it is ice.",
        "So a maker can set a mark there, and set it again on another glass.",
        "The space between the two marks is then cut into even steps.",
        "Celsius set a hundred steps between the two.",
        "Fahrenheit used another pair of points and got a finer step.",
        "Neither scale has a true zero. Both start where it suited.",
        "There is a scale that does start at the true bottom.",
        "That bottom is the point where all motion in matter stops.",
        "Nothing can be colder, and nothing has ever reached it.",
      ],
    },
    {
      lines: [
        "A clinical thermometer has one more trick in the glass.",
        "The tube is pinched to a narrow throat above the bulb.",
        "As the fluid grows, it is forced through the throat.",
        "As it cools, the thread breaks at the throat and holds.",
        "So the reading stands until it is shaken back down.",
        "Modern ones read the hotness with an electric part instead.",
        "The resistance of that part changes as it warms.",
        "A small circuit reads the resistance and shows a number.",
        "Some read at a distance from the heat a surface sends out.",
        "All hot things send out that radiation, and the hotter the more.",
        "Such a device reads a forehead without touching it.",
        "The old glass tube still measures the same thing as all of them.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// ⚠️ Der Name des Erfinders der Vulkanisierung trägt ein `y` und fehlt hier
// deshalb. Siehe Dateikopf: lieber eine benannte Lücke als eine falsche Zahl
// oder ein verstümmelter Eigenname.
const HOW_RUBBER_BECAME_USEFUL: Serie = {
  slug: "en-w1-how-rubber-became-useful",
  titel: "How Rubber Became Useful",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Cut the bark of a certain tree and a white sap runs out.",
        "It hardens in the air into a soft stuff with spring in it.",
        "People in South America used it long before it reached Europe.",
        "It was made into balls, into shoes and into sheets for rain.",
        "When it came to Europe it was taken for a marvel.",
        "Then the first hot summer arrived, and the marvel failed.",
        "In heat the stuff turned soft and then to a paste that clings.",
        "Shoes made of it welded themselves to the floor.",
        "In hard frost the same stuff turned brittle and broke.",
        "So it was useful in a narrow band of weather and useless outside it.",
        "For a while it was written off as a strange trifle.",
        "The problem was in how the long chains inside it are held.",
      ],
    },
    {
      lines: [
        "The stuff is built of long chains folded on each other.",
        "Pull it and the chains straighten out, so it stretches.",
        "Let go and the chains fold back, so it returns.",
        "That is where the spring in it comes from.",
        "But nothing holds one chain to the chain beside it.",
        "So under heat the chains slide past each other and remain there.",
        "The shape is lost, and it does not come back.",
        "What was needed was a set of ties between the chains.",
        "Ties would let the chains straighten and stop them sliding.",
        "The answer turned out to be sulphur, and heat.",
        "Warm the stuff with sulphur and short bridges form.",
        "Each bridge joins one chain to the chain beside it.",
      ],
    },
    {
      lines: [
        "The find was made in the States, and it was half an accident.",
        "The man who made it had spent his means and his health on the search.",
        "A blend of sulphur and the sap fell on a hot stove.",
        "Instead of paste, it charred at the edge and held its form.",
        "The centre had become firm, elastic and stable.",
        "Finding the right heat and hour took him seasons more.",
        "He was in debt for most of his life and died in it.",
        "The trade calls it vulcanising, after the god of the forge.",
        "The number of bridges formed sets how hard the result is.",
        "A few bridges leave a soft sheet that gives, as in a band.",
        "More bridges give a firm block, as in a shoe sole.",
        "A great number give a hard stuff once used for combs.",
      ],
    },
    {
      lines: [
        "With that one step the stuff became a material to build with.",
        "It could seal a joint, drive a belt and take a shock.",
        "Almost all of what came after rests on it.",
        "The wheel with air inside it needs a wall that holds and gives.",
        "No machine with a spinning shaft works without seals.",
        "The demand was so great that whole regions grew nothing else.",
        "That trade has a dark record in more than one land.",
        "Later the chains were built from oil instead of from sap.",
        "Those are made to order and can be tuned for heat or for oil.",
        "The tree is still tapped: its stuff resists tearing best.",
        "A large part of a truck tire still comes out of a tree.",
        "Sap, sulphur and heat, and the rest followed.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_A_SAIL_MOVES_A_BOAT: Serie = {
  slug: "en-w1-how-a-sail-moves-a-boat",
  titel: "How a Sail Moves a Boat",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "A boat running before the wind is simple to understand.",
        "The wind pushes the sail and the sail pushes the boat.",
        "The boat cannot go faster than the wind that drives it.",
        "That is the old broad sail, and it served for ages.",
        "It has one great fault: it can go one direction alone.",
        "A ship with such a sail waits in harbour for the right wind.",
        "Whole fleets have waited weeks for a shift.",
        "A modern sail can do what looks impossible at first.",
        "It can drive a boat toward the wind, at an angle to it.",
        "It can also drive a boat faster than the wind itself.",
        "Neither of those can be done with a push from behind.",
        "The sail is not being pushed. It is working as a wing.",
      ],
    },
    {
      lines: [
        "Set on edge to the wind, a sail takes a curved form.",
        "Air that meets it has to part and pass on either side.",
        "The air on the outer curve has further to travel.",
        "That side ends up at a lower pressure than the inner side.",
        "The difference in pressure is a force across the sail.",
        "It does not point where the wind points.",
        "It points more or less at right angles to the cloth.",
        "So a sail set at an angle can pull a boat forward.",
        "This is the same force that holds an aircraft up.",
        "The sail is a wing stood on its edge in the water.",
        "The push from behind is a small part of the whole.",
        "On most points of sail the pull does almost all the work.",
      ],
    },
    {
      lines: [
        "The force on the sail also pushes the boat to the side.",
        "It pushes to the side harder than it pulls forward.",
        "Left alone, the boat would slide off across the water.",
        "That is what the keel under the hull is for.",
        "A keel is a thin blade set deep in the water.",
        "It can slide forward with ease and to the side with none.",
        "So the side force is held, and the forward force is not.",
        "The boat goes where it can go, and that is ahead.",
        "The two forces together also lean the boat over.",
        "The weight of the keel below is what rights it again.",
        "A boat without a keel is held up with the weight of the crew.",
        "Sail, keel and crew are one balance, and all three are needed.",
      ],
    },
    {
      lines: [
        "No boat can sail straight into the wind.",
        "In a wedge of about a right angle the sail will not fill.",
        "To reach a mark upwind, a boat crosses that wedge in steps.",
        "It sails at an angle, then turns and sails on the other side.",
        "That zigzag is called beating, and the turn is called a tack.",
        "The route is longer than a straight line, and it gets there.",
        "The other surprise is the boat that outruns the wind.",
        "As a boat moves, it makes a wind of its own from ahead.",
        "That wind and the true wind add into one flow over the sail.",
        "The faster the boat, the stronger and more forward that flow is.",
        "So going faster can make the sail pull harder.",
        "Ice boats and some hulls use this to run several times the wind.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_WOOD_BENDS_AND_HOLDS: Serie = {
  slug: "en-w1-how-wood-bends-and-holds",
  titel: "How Wood Bends and Holds",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "arbeit",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "Wood is not one material. It is a bundle of fine tubes.",
        "The tubes ran up the tree and carried water to the leaves.",
        "That is the reason wood behaves so unlike in each direction.",
        "Along the tubes it is strong and hard to pull apart.",
        "Across them it splits with a wedge and little force.",
        "A person who works with wood is reading those tubes.",
        "The lines we call the grain are the ends of them.",
        "A tree sets down a fresh ring in each growing season.",
        "The wood made in spring is open and pale.",
        "The wood made later is dense and dark.",
        "One pale band and one dark band make one ring.",
        "The rings hold a record of the seasons the tree stood through.",
      ],
    },
    {
      lines: [
        "A fresh cut tree holds more water than wood.",
        "Some of that water sits in the tubes and runs out first.",
        "The rest is held in the walls of the tubes.",
        "That second lot is the one that matters.",
        "As it leaves, the walls draw in and the wood shrinks.",
        "It shrinks little along the tubes and a lot across them.",
        "It also shrinks more around the ring than across it.",
        "Those two amounts are not the same, and there is the trouble.",
        "One face of a board pulls in more than the other.",
        "So the board cups, bows or twists as it loses its water.",
        "That is warping, and it is not a fault in the tree.",
        "It is the plain result of shrinking at two rates at once.",
      ],
    },
    {
      lines: [
        "So wood is seasoned before it is used at all.",
        "It is stacked with thin sticks between the boards.",
        "Air moves through the stack and the water leaves slow.",
        "Too fast, and the outside shrinks while the inside is full.",
        "Then the outside splits, and the board is spoiled.",
        "A rule of thumb gave one season for each inch of thickness.",
        "A kiln can do the same work in a matter of weeks.",
        "Even seasoned wood is never done moving.",
        "It takes water back out of damp air and gives it up in warm air.",
        "A door that sticks in a wet autumn is doing just that.",
        "A floor laid in a damp month opens gaps when the heating starts.",
        "So a fitter leaves room at the walls and the room is hidden.",
      ],
    },
    {
      lines: [
        "The same movement is what lets wood be bent on purpose.",
        "Steam softens the stuff that holds the tubes together.",
        "A softened board can be drawn around a form and held.",
        "As it cools and loses its water it sets in the new shape.",
        "The back of a good chair is made this manner.",
        "So is the rim of a wheel and the side of a boat.",
        "The outside of the bend is stretched and can tear.",
        "So a steel band is strapped along it to hold the ends in.",
        "Then the wood is pressed, not pulled, and it takes the curve.",
        "A board glued from thin sheets moves far less than a solid one.",
        "Each sheet is laid with its tubes across the sheet below.",
        "One sheet cannot shrink because the ones beside it will not.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const HOW_INK_WAS_MADE: Serie = {
  slug: "en-w1-how-ink-was-made",
  titel: "How Ink Was Made",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "kultur",
  herkunft: EIGEN_SACH,
  etappen: [
    {
      lines: [
        "The oldest ink was soot and water, and it was a good ink.",
        "Soot is almost pure carbon, and carbon does not fade.",
        "It was bound with gum so that it would hold on the surface.",
        "Writing in it is as black now as it was when it was made.",
        "It has one weakness, and it is a serious one.",
        "The carbon sits on the surface and is not held in it.",
        "A wet sponge takes it off and leaves the sheet clean.",
        "On old writing sheets that could be done and was done.",
        "A whole page was washed off and the sheet used again.",
        "For a deed or a contract that will not do at all.",
        "What was needed was an ink that bites into the surface.",
        "The answer came from a swelling on an oak leaf.",
      ],
    },
    {
      lines: [
        "A small insect sets an egg in the bud of an oak.",
        "The tree grows a hard round swelling around it.",
        "That swelling is called a gall, and it is full of tannin.",
        "Tannin is the same stuff that dries the mouth in strong tea.",
        "The galls were gathered, crushed and steeped in water or wine.",
        "To that dark brew a salt of iron was added.",
        "The two react and the blend turns from pale to deep black.",
        "Gum from a tree was stirred in to hold it on the pen.",
        "That is iron gall ink, and it ruled writing for ages.",
        "It was made in kitchens, in monasteries and in offices.",
        "Almost all the old records of Europe are written in it.",
        "The recipe was common knowledge and was written down often.",
      ],
    },
    {
      lines: [
        "The great strength of this ink is that it holds.",
        "The black settles into the fibres and cannot be sponged off.",
        "It goes on darkening for a while after the pen has passed.",
        "A writer could see the line deepen on the sheet.",
        "The great fault took hundreds of seasons to show itself.",
        "The blend is acid, and acid works on the sheet under it.",
        "Where the ink is thick, the acid eats into the fibres.",
        "In the worst cases the writing falls out of the sheet.",
        "A page can be left with the shape of the words in holes.",
        "The trade calls that ink corrosion.",
        "It is one of the harder problems in the care of old records.",
        "The ink that would not wash off is eating its own page.",
      ],
    },
    {
      lines: [
        "The pen for it was a feather from a large bird.",
        "The shaft is hollow and holds a small store of ink.",
        "The end was cut to a point and split up the middle.",
        "The split lets the ink run down to the paper.",
        "A writer cut and recut that point through a working morning.",
        "The steel nib later did the same work and lasted longer.",
        "The iron in the ink was hard on steel, and nibs corroded.",
        "Modern ink in a pen is a colour in water with a wetting agent.",
        "It is kinder to the pen and to the sheet.",
        "It is also far less permanent than what it replaced.",
        "Records offices still ask for an ink that will hold.",
        "The soot, the oak gall and the iron are all still in the trade.",
      ],
    },
  ],
};

/** Zwölf Wissens-Serien der Charge W1 fuer en/erwachsen, alle auf Sprosse 25. */
export const SERIEN_EN_WISSEN_ERWACHSEN: Serie[] = [
  WHAT_A_GUIDE_DOG_LEARNS,
  HOW_A_SCREEN_READER_SPEAKS,
  HOW_INSULIN_WAS_FOUND,
  WHAT_A_BAROMETER_MEASURES,
  WHAT_CONCRETE_DOES,
  WHAT_A_LIGHTHOUSE_DOES,
  HOW_A_WELL_REACHES_WATER,
  WHAT_A_THERMOMETER_DOES,
  HOW_RUBBER_BECAME_USEFUL,
  HOW_A_SAIL_MOVES_A_BOAT,
  HOW_WOOD_BENDS_AND_HOLDS,
  HOW_INK_WAS_MADE,
];
