/**
 * ENGLISCHE Serien der zweiten Welle (TN-E7, Bauplan
 * `Sensorik/BAUPLAN-2026-07-27-TASTENFLOW-TEXT-NACHSCHUB.md` §7).
 *
 * Ausgangslage laut Prüfbericht 27.07.: 21 deutsche gegen 3 englische Serien
 * (1:7) — die englische Bücherei war nach drei Serien ausgelesen. Diese Charge
 * verdoppelt sie mehr als und bringt erstmals KURATIERTES Material (die drei
 * Pilot-Serien waren komplett selbst verfasst):
 *
 *  • „A Trip Through Space"    — Wissens-Serie nach NASA-Sachwissen (PD)
 *  • „How Animals Sleep"       — Wissens-Serie nach Simple English Wikipedia
 *  • „Too Many Bananas"        — Nacherzählung eines StoryWeaver-Buchs (CC-BY)
 *  • „Yellowstone: the first park" — nach VOA Learning English (PD)
 *
 * Rechte (§4/§10): Lizenz je Quelle AM OBJEKT verifiziert (Belege im
 * Kandidaten-Ordner `Sensorik/TN-Kandidaten/TN-E7-en/`); CC-BY-Werke mit
 * Namensnennung, Bearbeitung ausgewiesen. Jede Sachaussage doppelt belegt und
 * evergreen formuliert (keine Zahl mit Verfallsdatum).
 *
 * Sprachregeln: britisches Englisch (§10-Default), KEINE Apostrophe (fitText
 * streicht sie unterhalb T5 — „dont" wäre falsch geschriebenes Englisch),
 * keine Anführungszeichen, Ziffern ausgeschrieben, Wortschatz A2–B1 (bzw.
 * B1–B2 für die Stufen c/erwachsen).
 */
import type { Serie } from "./serie";


/** Wissens-Serie nach NASA-Sachwissen (public domain): von der Sonne zu den Planeten. */
const A_TRIP_THROUGH_SPACE: Serie = {
  slug: "a-trip-through-space",
  titel: "A Trip Through Space",
  kind: "wissen-serie",
  lang: "en",
  // 21.08. (Charge I2b): `kids` abgegeben - siehe serienEnKidsErsatz.ts.
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "weltall",
  herkunft: {
    quelle: "NASA (Space Place und science.nasa.gov, Sachwissen), selbst formuliert",
    lizenz: "Public Domain (NASA-Inhalte sind in den USA grundsätzlich nicht urheberrechtlich geschützt); Text: Eigenes Werk",
    autor: "Sensorik-Lernplattform (nach NASA-Sachwissen)",
    fundstelle: "https://spaceplace.nasa.gov/all-about-the-sun/en/",
  },
  etappen: [
    {
      lines: [
        "Look up on a clear night and you will see thousands of small lights.",
        "Almost all of them are stars, and many are larger than our own.",
        "One star stands much closer to us than all the others.",
        "We see it every single day and we call it the Sun.",
        "The Sun is a huge ball of hot glowing gas.",
        "It is about one hundred times wider than the Earth.",
        "Nearly all the material of our solar system sits inside it.",
        "The Sun is about one hundred and fifty million kilometres away.",
        "Its light needs a little over eight minutes to reach us.",
        "So we always see the Sun as it was eight minutes ago.",
        "Every plant on Earth grows with the energy of that light.",
        "Without the Sun there would be no weather, no food and no life here.",
      ],
    },
    {
      lines: [
        "The Earth travels round the Sun once every year.",
        "At the same time it turns on its own axis once a day.",
        "That turning gives us day and night.",
        "The Sun does not really rise; we roll towards it.",
        "One companion travels with us: the Moon.",
        "The Moon has no light of its own at all.",
        "It only throws the light of the Sun back to us.",
        "It needs about twenty-seven days for one trip round the Earth.",
        "And it turns on its axis in exactly the same time.",
        "That is why we always see the same side of it.",
        "Scientists call this tidal locking.",
        "The far side is not dark; it simply never faces us.",
      ],
    },
    {
      lines: [
        "Eight planets travel round our Sun.",
        "The four nearest ones are small and made of rock.",
        "Mercury is the closest, a grey world of stone and craters.",
        "Venus comes next and is the hottest planet of them all.",
        "Its thick clouds hold the heat in like a heavy blanket.",
        "Venus turns so slowly that one of its days is longer than its year.",
        "Then comes our own blue planet with its water and its air.",
        "After the Earth we find Mars, the red planet.",
        "Its dust is full of iron, and that iron has slowly rusted.",
        "The rust gives the whole surface its warm red colour.",
        "Mars has deserts, dust storms, ice at the poles and old volcanoes.",
        "Robot vehicles roll over that dust and send pictures home.",
      ],
    },
    {
      lines: [
        "Beyond Mars the planets change completely.",
        "Jupiter, Saturn, Uranus and Neptune are giants of gas and ice.",
        "Jupiter is by far the largest planet of our system.",
        "It holds more material than all the other planets together.",
        "A giant storm has been turning in its clouds for well over a century.",
        "Saturn is famous for its wide bright rings.",
        "The rings are not solid at all.",
        "They are countless pieces of ice and dust on their own paths.",
        "Some pieces are as small as grains of sand, others as large as a house.",
        "Uranus lies on its side and rolls round the Sun like a ball.",
        "Neptune has some of the fastest winds that we know of.",
        "All four giants keep whole families of moons around them.",
      ],
    },
    {
      lines: [
        "People have been living above our heads for many years now.",
        "A large space station circles the Earth again and again.",
        "It travels round the whole planet in about ninety minutes.",
        "So the crew watches a sunrise roughly sixteen times a day.",
        "Everything inside the station seems to float in the air.",
        "But gravity has not switched off up there.",
        "The station and the crew are falling round the Earth together.",
        "Falling with no ground below feels exactly like floating.",
        "Outside the walls there is almost nothing at all.",
        "Sound needs air to travel, and there is no air out there.",
        "So a hammer can hit metal in space and nobody hears it.",
        "Astronauts speak to each other by radio, even side by side.",
      ],
    },
  ],
};

/** Wissens-Serie nach Simple English Wikipedia (CC-BY-SA): wie Tiere schlafen. */
const HOW_ANIMALS_SLEEP: Serie = {
  slug: "how-animals-sleep",
  titel: "How Animals Sleep",
  kind: "wissen-serie",
  lang: "en",
  // 21.08. (Charge I2b): `kids` abgegeben - siehe serienEnKidsErsatz.ts.
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "tiere",
  herkunft: {
    quelle: "Simple English Wikipedia, Artikel »Sleep« und »Hibernation« (Stoffgrundlage), ergänzt und geprüft an Fachquellen; Text selbst formuliert",
    lizenz: "CC BY-SA 4.0 (Lizenzhinweis am Objekt geprüft 27.07.2026) - Ableitung bleibt CC BY-SA",
    autor: "Wikipedia-Autorinnen und -Autoren (Stoff); Bearbeitung: Sensorik-Lernplattform",
    fundstelle: "https://simple.wikipedia.org/wiki/Sleep",
  },
  etappen: [
    {
      lines: [
        "Nearly every animal with a brain has to sleep.",
        "All mammals and all birds have a sleep cycle.",
        "Many reptiles, fish and even insects rest in a similar way.",
        "Sleep is much more than lying still and doing nothing.",
        "While an animal sleeps, its brain sorts out the whole day.",
        "An animal that never sleeps becomes slow, ill and forgetful.",
        "But sleep is dangerous as well, because a sleeper cannot run.",
        "So every kind of animal has found its own safe way of resting.",
        "A cat can sleep for fifteen hours in a warm quiet corner.",
        "A wild horse can never afford anything like that.",
        "Where an animal sleeps tells you a great deal about its life.",
        "Let us look at some of the strangest ways of doing it.",
      ],
    },
    {
      lines: [
        "Horses often sleep standing on all four legs.",
        "Their legs hold a clever set of tendons and ligaments.",
        "These lock the joints, so the animal can doze without falling over.",
        "Standing this way costs the horse almost no strength.",
        "And a standing horse can be away in a single second.",
        "But light dozing is not enough in the long run.",
        "For deep dreaming sleep a horse has to lie down.",
        "It does that only in short spells, and only where it feels safe.",
        "In a herd some animals lie down while the others keep watch.",
        "Cows and elephants also rest on their feet for long hours.",
        "Giraffes are among the shortest sleepers on land.",
        "A few short rests are enough for them in a whole day.",
      ],
    },
    {
      lines: [
        "A dolphin has a problem that we do not have.",
        "It must come to the surface and breathe on purpose.",
        "If it fell fully asleep, it would simply stop breathing.",
        "So a dolphin rests one half of its brain at a time.",
        "The other half keeps swimming, breathing and watching.",
        "One eye stays open while the other one is shut.",
        "After a while the two halves change over.",
        "Some ducks use the same trick when they sleep in a row.",
        "The birds at the two ends keep the outer eye open.",
        "The birds in the middle can safely close both of theirs.",
        "Sea otters sleep floating on their backs in the cold water.",
        "Many of them wrap up in seaweed so that they do not drift away.",
      ],
    },
    {
      lines: [
        "Bats spend their days hanging head down under a roof or a branch.",
        "That looks hard, but it costs them no strength at all.",
        "Their own weight pulls the tendons in their feet tight.",
        "The claws close and hold on without any muscle work.",
        "A bat can hang like this for hours and sleep deeply.",
        "When it lets go, it drops straight into flight.",
        "Some birds even sleep in the air itself.",
        "Frigatebirds fly over the open sea for days without landing.",
        // R2: Messgeräte „finden" keine Schlafphasen - sie zeichnen sie auf.
        "Small instruments on their heads recorded short naps in flight.",
        "They rest one half of the brain, and sometimes both for seconds.",
        "Back on land the very same birds sleep for many hours.",
        "Swifts can stay in the air for months between two summers.",
      ],
    },
    {
      lines: [
        "Winter brings hard cold and very little food.",
        "Some animals answer that with an extremely deep sleep.",
        "A dormouse rolls up and lets its whole body grow cold.",
        "Its heart then beats only a few times each minute.",
        "It can spend more than half the year in that state.",
        "Ground squirrels go further and become almost as cold as ice.",
        "They warm up for a few hours now and then, and sink back again.",
        "A bear in its winter den does something rather different.",
        "Its body stays much warmer, and it can wake up quickly.",
        "Hummingbirds use the same idea for a single night.",
        "They cool right down after sunset and warm up again at dawn.",
        "Deep rest is one of the oldest answers to a hard season.",
      ],
    },
  ],
};

/** Nacherzählung eines StoryWeaver-Buchs (CC-BY 4.0, Attribution im Herkunfts-Block). */
const TOO_MANY_BANANAS: Serie = {
  slug: "too-many-bananas",
  titel: "Too Many Bananas",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "alltag",
  herkunft: {
    quelle: "StoryWeaver / Pratham Books",
    lizenz: "CC BY 4.0 (am Buch verifiziert 27.07.2026; Nacherzählung mit Änderungen: vereinfacht, gekürzt, ohne wörtliche Rede)",
    autor: "Rohini Nilekani (Original); Nacherzählung: Sensorik-Lernplattform",
    fundstelle: "https://storyweaver.org.in/en/stories/208-too-many-bananas",
  },
  etappen: [
    {
      lines: [
        "Sringeri Srinivas was a farmer with a big problem.",
        "He grew the best bananas in the village.",
        "They were sweet and ripe and golden.",
        "But nobody wanted to buy them.",
        "His family said no. His neighbour said no.",
        "His friends said no. The traders said no.",
        "Even his cows turned their heads away.",
        "Your bananas are very sweet, the people said.",
        "But we have eaten far too many of them.",
        "We cannot eat one more banana!",
        "Poor Sringeri Srinivas sat down and thought.",
        "What can a farmer do with too many bananas?",
      ],
    },
    {
      lines: [
        "The next morning he made a plan.",
        "There was a centre for farmers in the big town.",
        "Maybe someone there would have a good idea.",
        "He packed his best bananas and set off.",
        "He was away for a few days.",
        "When he came home, he was smiling.",
        "He went back to work on his farm.",
        "He grew more bananas than ever before.",
        "But now he did not offer them to anyone.",
        "Not to his family, not to his friends.",
        "Not to the traders, not even to the cows.",
        "Where were all the bananas going?",
      ],
    },
    {
      lines: [
        "The whole village became very curious.",
        "Then his neighbour Shivanna planned a great feast.",
        "It was a special day of prayers and offerings.",
        "The priest gave Shivanna a big task.",
        "Bring one hundred and eight ripe bananas for the gods.",
        "Shivanna ran to Sringeri Srinivas at once.",
        "I said no to your bananas before, he said. I am sorry.",
        "But today I need one hundred and eight of them.",
        "Can you help me, please?",
        "The farmer thought for a moment.",
        "My crop is already cut, he said. But let me see.",
        "Start the feast. I will surely come.",
      ],
    },
    {
      lines: [
        "The feast began and the whole village came.",
        "The priest started to sing the old prayers.",
        "Soon it was time to offer the bananas.",
        "Then Sringeri Srinivas walked in with a big bag.",
        "He took out twenty-seven small packets.",
        "Each one was wrapped in a green banana leaf.",
        "On each packet was written: fine banana halwa.",
        "Halwa is a soft sweet made from fruit.",
        "Each packet holds the pulp of four bananas, he said.",
        "Four times twenty-seven makes one hundred and eight!",
        "The priest was so surprised that he forgot to sing.",
        "Then the village laughed and clapped for a long time.",
      ],
    },
  ],
};

/** Wissens-Serie nach VOA Learning English (public domain): der erste Nationalpark. */
const YELLOWSTONE_FIRST_PARK: Serie = {
  slug: "yellowstone-first-park",
  titel: "Yellowstone: The First National Park",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "VOA Learning English (Voice of America), Beitrag »Yellowstone: The World's First National Park« von Andrew Smith, 16.02.2025; verdichtet und neu formuliert",
    lizenz: "Public Domain (US-Regierung; VOA-eigener Text, Terms of Use verifiziert 27.07.2026)",
    autor: "Andrew Smith (VOA-Original); Verdichtung: Sensorik-Lernplattform",
    fundstelle: "https://learningenglish.voanews.com/a/yellowstone-the-world-s-first-national-park/7974034.html",
  },
  etappen: [
    {
      lines: [
        "Deep in the American West lies a place full of steam and wild animals.",
        "Its name is Yellowstone, and it changed the way we protect nature.",
        "In the year eighteen seventy-two it became the first national park.",
        "A national park is land that a country keeps safe for everyone.",
        "Nobody may build towns there, and nobody may sell the land.",
        "People visit, look, and leave the land as they found it.",
        "Yellowstone is still one of the largest parks in the United States.",
        "It covers almost nine thousand square kilometres.",
        "That is more land than some whole countries have.",
        "Most of the park lies in the state of Wyoming.",
        "Visitors find mountains, deep canyons, rivers and clear lakes there.",
        "But the most surprising part of Yellowstone lies under the ground.",
      ],
    },
    {
      lines: [
        "Yellowstone sits on top of an old and very large volcano.",
        "Scientists call this kind of giant volcano a supervolcano.",
        "The volcano is still active, but it sleeps most of the time.",
        "A lake of hot liquid rock lies some kilometres below the park.",
        "This hot rock stands under enormous pressure.",
        "The heat rises and warms the water in the ground.",
        "In many places, boiling water shoots high into the air.",
        "Such a fountain of hot water is called a geyser.",
        "Yellowstone has more geysers and hot springs than any other place on Earth.",
        "The most famous geyser has a friendly name: Old Faithful.",
        "It erupts about every ninety minutes, day and night.",
        "Faithful means true and loyal - the geyser earned its name.",
      ],
    },
    {
      lines: [
        "The whole park lies high up on a great plateau.",
        "The average height is about two thousand four hundred metres.",
        "Winters are long and extremely cold up there.",
        "In January the air often stays below freezing all day.",
        "Snow covers the roads, and many areas close for months.",
        "Summer is short, bright and full of visitors.",
        "The Yellowstone River has cut a deep canyon into the rock.",
        "Its walls glow in yellow, orange and red colours.",
        "At the Lower Falls the river drops almost one hundred metres.",
        "A path leads visitors close to the top of the falls.",
        "They can feel the spray and hear the thunder of the water.",
        "Large fires burned parts of the park years ago - young forest grows there now.",
      ],
    },
    {
      lines: [
        "Yellowstone is famous for its wild animals as well.",
        "Few places on Earth have so many large wild animals in one area.",
        "Herds of bison walk slowly across the open valleys.",
        "Bison are heavy wild animals, related to cows, with huge heads.",
        "Thousands of them live in the park all year round.",
        "It is one of the largest wild bison herds on Earth.",
        "Grizzly bears fish in the rivers and sleep through the winter.",
        "Wolves hunt in packs in the quiet northern valleys.",
        "Elk and deer feed near the warm springs in winter.",
        "Visitors must keep a safe distance from all of them.",
        "The animals are not tame, and the park belongs to them.",
        "Some people say a wild west still exists - its name is Yellowstone.",
      ],
    },
  ],
};

/** TN-E7-Serien (append-only an SERIEN gehängt). */
export const SERIEN_EN2: readonly Serie[] = [
  A_TRIP_THROUGH_SPACE,
  HOW_ANIMALS_SLEEP,
  TOO_MANY_BANANAS,
  YELLOWSTONE_FIRST_PARK,
];
