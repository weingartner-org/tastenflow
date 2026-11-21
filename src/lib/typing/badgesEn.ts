/**
 * ★★★ DER ABZEICHEN-KATALOG ENGLISCH (EN3, 19.09.2026).
 *
 * Johannes' Auftrag 18.09.2026: *„überlege gut was das deutsche Wort am besten
 * beschreibt und übersetze nicht stur nach Wörterbuch"*. Und seine Notiz zur
 * Probe: Die Abzeichen-Namen standen bis hierher in der englischen Bedienung
 * deutsch (in `lang="de"`) - jetzt sind sie echtes Englisch.
 *
 * ── Wie die Namen übersetzt sind ──────────────────────────────────────────
 * Die Namen sind VERSPIELT. Übersetzt ist die IDEE, nicht das Wort: Wo das
 * Deutsche mit einem Stabreim spielt („Marathon-Maus"), sucht das Englische
 * seinen eigenen („Marathon Mouse"); wo es eine Redewendung ist („Weiße
 * Weste", „Fels in der Brandung", „Tausendsassa"), steht die britische
 * Redewendung mit derselben Aussage („Clean Sheet", „Solid as a Rock",
 * „Whale of a Time" - zum Wal auf der Medaille). Grossschreibung wie ein
 * Titel (britischer Brauch bei Namen von Auszeichnungen). Kurz: Ein Name
 * steht auf einem Namensschild unter der Medaille und wird vorgelesen.
 *
 * Die trockenen Zweitnamen (`nameNeutral`, ab 11 Jahren) bleiben trocken und
 * in Satzschreibung, wie ihre deutschen Vorbilder.
 *
 * Die Beschreibungen ohne Anrede, wie im Deutschen (sie gelten für Kinder und
 * Erwachsene). Glossar: Fehler ⇒ *mistake*, Treffsicherheit ⇒ *accuracy*,
 * Anschlag ⇒ *keystroke*, Etappe ⇒ *stage*, Eisschollen-Spiel ⇒ *Ice Floe*,
 * Leistungsstufe ⇒ *difficulty level*, Punktering ⇒ *points ring*,
 * Grundstellung ⇒ *home position*, Tastschreiben ⇒ *touch typing* (§3.2, §3.6).
 *
 * `bildbeschreibung`: das Motiv in Worten für die Sprachausgabe (britisch:
 * *tortoise*, *aeroplane*, *cockerel*, *mortarboard*). Metall und Band setzt
 * `medaillenBeschreibung` in `BadgeMedal.tsx` davor - wie im Deutschen.
 *
 * ── Warum eine eigene Datei ───────────────────────────────────────────────
 * Die deutsche Tabelle (`badges.ts`) bleibt Zeichen für Zeichen, wie sie ist.
 * Diese Datei holt aus `badges.ts` nur Typen, keine Werte - sonst hinge sie
 * im Kreis (`badges.ts` liest die englischen Texte über `badgeName` und
 * Freunde). Die fünf Beschreibungen mit einer Zahl aus `badges.ts` sind darum
 * Funktionen: Die Zahl kommt beim Aufruf herein und ist dieselbe wie im
 * Deutschen.
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - der Wächter
 * `tests/tastenflow-englisch-statistik.test.tsx` prüft, dass jede ID einen
 * englischen Eintrag hat, dass es einen Zweitnamen genau dort gibt, wo es ihn
 * im Deutschen gibt, und dass der Medaillen-Satz unter 120 Zeichen bleibt.
 */
// ★ E2 (24.09.2026): `lernwegDef` statt Werten aus `badges.ts` - kein Zirkel,
// `lernweg.ts` liest nichts von hier oder aus `badges.ts`.
import { lernwegDef, type Lernweg } from "./lernweg";
// ★ E8 (24.09.2026): die Lektionszahl des WEGES (Bauplan §7) - `curriculum.ts`
// liest nichts von hier oder aus `badges.ts`, kein Zirkel.
import { lektionenFuer } from "./curriculum";

/** Die Zahlen, die in fünf Beschreibungen stehen - aus `badges.ts` hereingereicht. */
export interface AbzeichenZahlen {
  /** Wie viele Lektionen es gibt (`LESSONS.length`). */
  lektionen: number;
  /** „Immer trocken": so viele Abenteuer ohne Plumpsen. */
  trockeneAbenteuer: number;
  /** „Fischfänger": so viele Bonus-Fische. */
  fische: number;
  /** „Zurück im Sattel": so viele Tage Pause. */
  pauseTage: number;
  /**
   * ★ E2 (24.09.2026): der Lernweg DES KINDES - einzig für
   * „grundstellungs-gorilla" (Bauplan §6.3): die Grundreihe unterscheidet
   * sich je Weg (`f j d k s l a ö` gegen `f j d k s l a ;`). Die englische
   * BEDIENUNG kann auch bei Weg „de" stehen (ein Konto, das erst später auf
   * Englisch umgestellt hat, D2 - der Weg selbst wechselt nie); darum reicht
   * die Bedienungssprache allein hier nicht.
   */
  lernweg: Lernweg;
}

export interface AbzeichenTextEn {
  name: string;
  /** Nur, wo die deutsche Fassung einen `nameNeutral` hat. */
  nameNeutral?: string;
  description: string | ((z: AbzeichenZahlen) => string);
  bildbeschreibung: string;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name. */
export const ABZEICHEN_GRUPPEN_EN: Readonly<Record<string, string>> = {
  Fehlerfrei: "No mistakes",
  "Saubere Serie": "Clean streak",
  Fleiß: "Hard work",
  Anschläge: "Keystrokes",
  Dranbleiben: "Sticking with it",
  Übungswochen: "Practice weeks",
  Sterne: "Stars",
  Lektionen: "Lessons",
  Stufen: "Levels",
  Tastenwelt: "Keyboard world",
  "Sitzt!": "Nailed it!",
  Tempo: "Speed",
  "Am Stück": "In a row",
  Meisterprüfung: "Mastery",
  Abenteuer: "Adventures",
  "Abenteuer-Kunststücke": "Adventure tricks",
  Expedition: "Expedition",
  Geschichten: "Stories",
  Lesestunde: "Reading time",
  "Lese-Kunststücke": "Reading tricks",
  Geheim: "Secret",
};

/** Der ganze Katalog englisch, je Abzeichen-ID. */
export const ABZEICHEN_EN: Readonly<Record<string, AbzeichenTextEn>> = {
  // ── Fehlerfrei ───────────────────────────────────────────────────────────
  volltreffer: { name: "Bullseye", description: "A whole round without a single mistake.", bildbeschreibung: "a target with an arrow in the centre" },
  "null-fehler-ninja": { name: "Zero-Mistake Ninja", description: "5 rounds with no mistakes at all.", bildbeschreibung: "a ninja" },
  "makellos-meister": { name: "Spotless Superstar", description: "15 rounds with no mistakes at all.", bildbeschreibung: "three sparkling stars" },
  "diamant-finger": { name: "Diamond Fingers", description: "40 rounds with no mistakes at all.", bildbeschreibung: "a blue gem" },
  "weisse-weste": { name: "Clean Sheet", description: "80 rounds with no mistakes at all.", bildbeschreibung: "a white dove" },
  "einhorn-finger": { name: "Unicorn Fingers", nameNeutral: "150 rounds without a mistake", description: "150 rounds with no mistakes at all.", bildbeschreibung: "a unicorn" },
  // ── Saubere Serie ────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Precision Penguin", nameNeutral: "Clean hat-trick", description: "3 clean rounds in a row (at least 95% accuracy).", bildbeschreibung: "a penguin" },
  adlerauge: { name: "Eagle Eye", description: "7 clean rounds in a row (at least 95% accuracy).", bildbeschreibung: "an eagle" },
  "laser-lama": { name: "Laser Llama", nameNeutral: "Laser mode", description: "15 clean rounds in a row (at least 95% accuracy).", bildbeschreibung: "a llama" },
  "eiskalte-serie": { name: "Ice-Cool Streak", description: "25 clean rounds in a row (at least 95% accuracy).", bildbeschreibung: "an ice cube" },
  // ── Fleiß ────────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Keyboard Chick", nameNeutral: "First round", description: "The very first round is done.", bildbeschreibung: "a chick hatching from an egg" },
  "ausdauer-ameise": { name: "Endurance Ant", nameNeutral: "Warmed up", description: "25 rounds practised.", bildbeschreibung: "an ant" },
  "marathon-maus": { name: "Marathon Mouse", nameNeutral: "A hundred rounds", description: "100 rounds practised.", bildbeschreibung: "a mouse's face" },
  "munteres-murmeltier": { name: "Busy Beaver", nameNeutral: "Marathon", description: "250 rounds practised.", bildbeschreibung: "a beaver" },
  dauerlaeufer: { name: "Long-Distance Runner", description: "500 rounds practised.", bildbeschreibung: "a person running" },
  tausendsassa: { name: "Whale of a Time", nameNeutral: "A thousand rounds", description: "1,000 rounds practised.", bildbeschreibung: "a whale spouting water" },
  // ── Anschläge ────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Thousand-Key Tiger", nameNeutral: "A thousand correct keys", description: "1,000 correct keystrokes.", bildbeschreibung: "a tiger's face" },
  "tasten-t-rex": { name: "Keyboard T-Rex", nameNeutral: "Ten thousand correct keys", description: "10,000 correct keystrokes.", bildbeschreibung: "a T-Rex" },
  "galaktische-fingerspitzen": { name: "Galactic Fingertips", description: "50,000 correct keystrokes.", bildbeschreibung: "a rocket taking off" },
  "hunderttausend-held": { name: "Hundred-Thousand Hero", nameNeutral: "A hundred thousand correct keys", description: "100,000 correct keystrokes.", bildbeschreibung: "a yellow lightning bolt" },
  viertelmillion: { name: "Quarter of a Million", description: "250,000 correct keystrokes - as much as there is in a whole book.", bildbeschreibung: "a satellite" },
  // ── Dranbleiben ──────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Keep-Going Badger", nameNeutral: "Kept at it", description: "Practised on 3 different days.", bildbeschreibung: "a badger" },
  gewohnheitstier: { name: "Creature of Habit", description: "Practised on 7 different days.", bildbeschreibung: "a tortoise" },
  "wie-ein-uhrwerk": { name: "Like Clockwork", description: "Practised on 20 different days.", bildbeschreibung: "a red alarm clock" },
  unaufhaltsam: { name: "Unstoppable", description: "Practised on 50 different days.", bildbeschreibung: "a mountain with a snowy peak" },
  "tief-verwurzelt": { name: "Deeply Rooted", description: "Practised on 100 different days.", bildbeschreibung: "a green leafy tree" },
  "fels-in-der-brandung": { name: "Solid as a Rock", description: "Practised on 200 different days - almost every day of a whole school year.", bildbeschreibung: "a stone statue from Easter Island" },
  // ── Übungswochen ─────────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Three Months In", description: "Practised in 12 different weeks.", bildbeschreibung: "a brown autumn leaf" },
  "halbes-jahr-dabei": { name: "Six Months In", description: "Practised in 26 different weeks.", bildbeschreibung: "a cloud with snow falling" },
  "ganzes-jahr-dabei": { name: "A Whole Year In", description: "Practised in 52 different weeks.", bildbeschreibung: "a birthday cake with a candle" },
  // ── Sterne ───────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Shooting Star", description: "The first round with 3 stars.", bildbeschreibung: "a shooting star in the night sky" },
  "sternen-sammler": { name: "Star Collector", description: "10 rounds with 3 stars.", bildbeschreibung: "a glowing yellow star" },
  sternenhimmel: { name: "Starry Sky", description: "30 rounds with 3 stars.", bildbeschreibung: "the Milky Way in the night sky" },
  sternenmeer: { name: "Sea of Stars", description: "75 rounds with 3 stars.", bildbeschreibung: "an eight-pointed orange star" },
  // ── Lektionen ────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Lesson Lion", nameNeutral: "Five lessons", description: "5 lessons completed.", bildbeschreibung: "a lion" },
  "kapitel-kaeptn": { name: "Chapter Captain", description: "15 lessons completed.", bildbeschreibung: "an anchor" },
  // ★ E8 (24.09.2026, Bauplan §7): NICHT `z.lektionen` (immer `LESSONS.length`,
  // die deutschen 27) - der Weg des Kindes hat seine eigene Lektionszahl
  // (`lektionenFuer`, 19 auf Weg „en"). „Alle Lektionen" muss ALLE seines
  // eigenen Lehrgangs meinen, sonst wäre die Höchststufe auf Weg „en"
  // unerreichbar.
  "lehrgangs-legende": { name: "Course Legend", description: (z) => `All ${lektionenFuer(z.lernweg).length} lessons completed.`, bildbeschreibung: "a gold trophy" },
  // ── Stufen (der Punktering) ──────────────────────────────────────────────
  "kletter-koala": { name: "Climbing Koala", nameNeutral: "Level 5", description: "Reached level 5 on the points ring.", bildbeschreibung: "a koala" },
  "punkte-rakete": { name: "Points Rocket", description: "Reached level 10 on the points ring.", bildbeschreibung: "a red balloon" },
  "gipfel-gaemse": { name: "Mountain Goat", nameNeutral: "Level 20", description: "Reached level 20 on the points ring.", bildbeschreibung: "a goat" },
  hoehenflug: { name: "Flying High", nameNeutral: "Level 50", description: "Reached level 50 on the points ring.", bildbeschreibung: "a helicopter" },
  "ueber-den-wolken": { name: "Above the Clouds", nameNeutral: "Level 100", description: "Reached level 100 on the points ring.", bildbeschreibung: "a flying saucer" },
  sternenreise: { name: "Star Voyage", nameNeutral: "Level 200", description: "Reached level 200 on the points ring.", bildbeschreibung: "a comet with a long tail" },
  // ── Tastenwelt ───────────────────────────────────────────────────────────
  // ★ E2 (24.09.2026): die Grundreihe hängt jetzt am LERNWEG des Kindes, nicht
  // mehr fest an der deutschen (Bauplan §6.3) - „f j d k s l a ö" auf Weg
  // „de", „f j d k s l a ;" auf Weg „en" (die 8. Grundtaste auf US/UK; auf
  // DE/CH-Tastaturen sitzt „ö" ({@link achteGrundtasteFuerLayout}), aber die
  // NAME der Taste in der Ansage bleibt „;" - Weg „en" nennt die Taste, nicht
  // das Gerät).
  "grundstellungs-gorilla": {
    name: "Home Row Gorilla",
    nameNeutral: "Home row in place",
    description: (z) =>
      `All eight keys of the home position unlocked: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "a gorilla",
  },
  "gross-baumeister": { name: "Capital Builder", nameNeutral: "Capitals", description: "The Shift key is learnt - real capital letters, typed yourself.", bildbeschreibung: "four capital letters on blue keys" },
  "puenktchen-panda": { name: "Dotty Panda", nameNeutral: "The umlauts", description: "ä, ö and ü unlocked.", bildbeschreibung: "a panda" },
  "schlangen-s": { name: "Snaky S", nameNeutral: "The sharp s", description: "ß, the sharp s, unlocked - the last letter on the keyboard.", bildbeschreibung: "a snake" },
  "alphabet-as": { name: "Alphabet Ace", description: "All the letters from A to Z unlocked.", bildbeschreibung: "small letters on blue keys" },
  "punkt-und-komma": { name: "Full Stop and Comma", description: "Full stop and comma unlocked - the first real punctuation marks.", bildbeschreibung: "a black quill pen" },
  "satzzeichen-sammler": { name: "Punctuation Collector", nameNeutral: "All the punctuation", description: "All seven punctuation marks unlocked: . , - ? ! : ;", bildbeschreibung: "a big red exclamation mark" },
  "zahlen-zebra": { name: "Number Zebra", nameNeutral: "Half the number row", description: "Five numbers of the number row unlocked.", bildbeschreibung: "a zebra" },
  "zahlen-zauberer": { name: "Number Wizard", nameNeutral: "Number row complete", description: "The whole number row from 1 to 0 unlocked.", bildbeschreibung: "a blue key with the number 10" },
  "klammer-krokodil": { name: "Bracket Crocodile", nameNeutral: "Open bracket, close bracket", description: "The round brackets ( ) unlocked - the first symbols.", bildbeschreibung: "a crocodile" },
  "alltags-ass": { name: "Everyday Ace", nameNeutral: "Everyday symbols", description: "@, €, $ and § unlocked - the symbols for email, money and sections of a law.", bildbeschreibung: "an envelope for emails" },
  "tastatur-krone": { name: "Keyboard Queen", nameNeutral: "The whole keyboard", description: "EVERY key on the keyboard unlocked - right up to the last symbol.", bildbeschreibung: "a golden crown" },
  // ── Sitzt! ───────────────────────────────────────────────────────────────
  "feste-burg": { name: "Safe as Houses", nameNeutral: "Home row mastered", description: "All eight keys of the home position are mastered.", bildbeschreibung: "a house" },
  "buchstaben-baendiger": { name: "Letter Tamer", nameNeutral: "All letters mastered", description: "Every single letter is mastered - not one of them is wobbly any more.", bildbeschreibung: "a red square with a big A" },
  "zahlen-fels": { name: "Rock-Solid Numbers", nameNeutral: "All numbers mastered", description: "The whole number row is mastered.", bildbeschreibung: "an abacus with colourful beads" },
  "nichts-wackelt": { name: "Nothing Wobbles", description: "Every single key on the keyboard is mastered - the whole keyboard, not just unlocked.", bildbeschreibung: "a blue diamond shape with a dot in the middle" },
  // ── Tempo ────────────────────────────────────────────────────────────────
  // „Flinker Fuchs" ⇒ „Quick Brown Fox": der englische Tipp-Satz schlechthin
  // („The quick brown fox jumps over the lazy dog").
  "flinker-fuchs": { name: "Quick Brown Fox", nameNeutral: "Fast and clean", description: "Speed goal reached AND at least 95% accuracy - fast only counts when it's clean.", bildbeschreibung: "a fox" },
  "tempo-60": { name: "Rapid Rabbit", nameNeutral: "60 a minute, clean", description: "A round at 60 keystrokes per minute with at least 95% accuracy - the pass mark in the typing competition.", bildbeschreibung: "a rabbit" },
  "tempo-90": { name: "Dashing Deer", nameNeutral: "90 a minute, clean", description: "A round at 90 keystrokes per minute with at least 95% accuracy.", bildbeschreibung: "a deer" },
  "tempo-120": { name: "Galloping Horse", nameNeutral: "120 a minute, clean", description: "A round at 120 keystrokes per minute with at least 98% accuracy - the goal of the Bavarian curriculum.", bildbeschreibung: "a galloping horse" },
  "tempo-160": { name: "Steam Engine", nameNeutral: "160 a minute, clean", description: "A round at 160 keystrokes per minute with at least 98% accuracy - the goal of the Austrian curriculum.", bildbeschreibung: "a steam locomotive" },
  "tempo-200": { name: "Express Train", nameNeutral: "200 a minute, clean", description: "A round at 200 keystrokes per minute with at least 98% accuracy - the level of a practised touch typist.", bildbeschreibung: "a high-speed train" },
  "tempo-300": { name: "Jet Plane", nameNeutral: "300 a minute, clean", description: "A round at 300 keystrokes per minute with at least 99% accuracy - professional level.", bildbeschreibung: "a small aeroplane" },
  // ── Am Stück ─────────────────────────────────────────────────────────────
  "kette-100": { name: "Chain Reaction", nameNeutral: "100 in a row", description: "100 correct keystrokes in a row, without a single mistake.", bildbeschreibung: "two chain links" },
  "kette-250": { name: "No Stumbles", description: "250 correct keystrokes in a row.", bildbeschreibung: "a chain of several links" },
  "kette-500": { name: "Common Thread", nameNeutral: "500 in a row", description: "500 correct keystrokes in a row - a whole round and more.", bildbeschreibung: "a spool of thread" },
  "kette-1000": { name: "A Thousand, No Mistakes", description: "1,000 correct keystrokes in a row.", bildbeschreibung: "Mount Fuji with a cap of snow" },
  "kette-2000": { name: "The Iron Chain", nameNeutral: "2,000 in a row", description: "2,000 correct keystrokes in a row - four or five rounds without the tiniest slip.", bildbeschreibung: "a volcano with lava flowing out" },
  // ── Abenteuer ────────────────────────────────────────────────────────────
  "erste-expedition": { name: "First Expedition", description: "The first Ice Floe adventure in free play, all the way to the igloo.", bildbeschreibung: "a compass" },
  polarforscher: { name: "Polar Explorer", description: "10 Ice Floe adventures completed in free play.", bildbeschreibung: "a snowflake" },
  "eismeer-legende": { name: "Polar Sea Legend", description: "30 Ice Floe adventures completed in free play.", bildbeschreibung: "a tall blue wave" },
  "packeis-profi": { name: "Pack Ice Pro", nameNeutral: "60 adventures", description: "60 Ice Floe adventures completed in free play.", bildbeschreibung: "a suitcase" },
  // ── Abenteuer-Kunststücke ────────────────────────────────────────────────
  // „Trockener Frack": Der Frack ist der Pinguin selbst - englisch der Smoking.
  "trockener-frack": { name: "Dry Tuxedo", description: "A whole adventure without falling into the water or the snow even once.", bildbeschreibung: "a black top hat" },
  "immer-trocken": { name: "Always Dry", description: (z) => `${z.trockeneAbenteuer} adventures without a single splash.`, bildbeschreibung: "a closed umbrella" },
  fischfaenger: { name: "Fish Catcher", description: (z) => `${z.fische} bonus fish caught in the Ice Floe adventure.`, bildbeschreibung: "a blue fish" },
  // ── Expedition ───────────────────────────────────────────────────────────
  // „blind, nur nach Gehör" ⇒ *in the dark, by ear alone*: nie „blind" als
  // Tipp-Wort (Glossar §3.2, §5 Nr. 2).
  "hoehlen-lauscher": { name: "Cave Listener", description: "Made it through the Echo Cave to the exit in the dark, by ear alone.", bildbeschreibung: "a bat" },
  "sturm-trotzer": { name: "Blizzard Beater", description: "Got through the Blizzard - typed the sequences from memory.", bildbeschreibung: "a face blowing wind" },
  "funker-freund": { name: "Radio Buddy", description: "Decoded and sent a whole radio message at the Polar Station.", bildbeschreibung: "a radio" },
  "polarlicht-entdecker": { name: "Northern Lights Explorer", description: "The whole Polar Expedition without a single mistake - the northern lights dance.", bildbeschreibung: "a star with a trail of sparkles" },
  // ── Geschichten ──────────────────────────────────────────────────────────
  "lese-luchs": { name: "Reading Leopard", nameNeutral: "First story", description: "The first story read and typed right to the end.", bildbeschreibung: "a leopard" },
  buecherwurm: { name: "Bookworm", description: "3 stories read right to the end.", bildbeschreibung: "a green caterpillar" },
  "buecherei-baer": { name: "Library Bear", nameNeutral: "Eight stories", description: "8 stories read right to the end.", bildbeschreibung: "a bear" },
  vielleser: { name: "Avid Reader", description: "15 stories read right to the end.", bildbeschreibung: "a pile of colourful books" },
  // ── Lesestunde ───────────────────────────────────────────────────────────
  "seiten-spatz": { name: "Page Sparrow", nameNeutral: "First page", description: "The first stage of a story typed.", bildbeschreibung: "a small blue bird" },
  "kapitel-krake": { name: "Chapter Octopus", nameNeutral: "Ten stages", description: "10 stages read and typed.", bildbeschreibung: "an octopus" },
  "geschichten-gigant": { name: "Story Giant", description: "30 stages read and typed.", bildbeschreibung: "an elephant" },
  leseratte: { name: "Page-Turner", nameNeutral: "75 stages", description: "75 stages read and typed.", bildbeschreibung: "a scroll" },
  // ── Lese-Kunststücke ─────────────────────────────────────────────────────
  federleicht: { name: "Light as a Feather", description: "A whole stage typed without a single mistake.", bildbeschreibung: "a white feather" },
  "in-einem-rutsch": { name: "In One Go", description: "A whole story read to the end in a single day.", bildbeschreibung: "a blue spiral" },
  "lesezeichen-held": { name: "Bookmark Hero", description: "On another day, carried on reading exactly where it had stopped last time.", bildbeschreibung: "a bookmark" },
  // ── Meisterprüfung ───────────────────────────────────────────────────────
  "zehn-minuten-abschrift": { name: "The 10-Minute Copy Test", description: "Ten minutes of typing in one go with no more than 0.5% mistakes - exactly what the classic typing test asks for.", bildbeschreibung: "a stopwatch" },
  // ★ E8: siehe „lehrgangs-legende" oben - dieselbe Begründung.
  "lehrgangs-meister": { name: "Course Master", description: (z) => `All ${lektionenFuer(z.lernweg).length} lessons completed with three stars.`, bildbeschreibung: "a black mortarboard" },
  "goldene-tastatur": { name: "The Golden Keyboard", description: "Every key unlocked, every key mastered - and once 160 keystrokes per minute at 98% accuracy. The last badge.", bildbeschreibung: "a sports medal on a ribbon" },
  // ── Geheim ───────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Laid-Back Sloth", description: "Nice and slow, and without a single mistake - accuracy beats speed!", bildbeschreibung: "a sloth" },
  "comeback-kaenguru": { name: "Comeback Kangaroo", description: "A 3-star round straight after a 1-star round.", bildbeschreibung: "a kangaroo" },
  nachteule: { name: "Night Owl", description: "A round finished after 9pm.", bildbeschreibung: "an owl" },
  "frueher-vogel": { name: "Early Bird", description: "A round finished before 7am.", bildbeschreibung: "a cockerel" },
  // „Nimmersatt": die Raupe Nimmersatt heisst englisch „The Very Hungry
  // Caterpillar" - daher der Name; der Apfel auf der Medaille passt dazu.
  nimmersatt: { name: "The Very Hungry Reader", description: "3 stages gobbled up in a single day.", bildbeschreibung: "a green apple" },
  "ferien-held": { name: "Holiday Hero", description: "Practised in the middle of the summer holidays - in July or August.", bildbeschreibung: "a beach with a sunshade" },
  "wochenend-schreiber": { name: "Weekend Typist", description: "Practised on a Saturday and on a Sunday.", bildbeschreibung: "a calendar page" },
  "zurueck-im-sattel": { name: "Back in the Saddle", description: (z) => `Practised again after a break of more than ${z.pauseTage} days - coming back counts.`, bildbeschreibung: "two arrows going round in a circle" },
  "doppelt-genaeht": { name: "Double Stitch", description: "Two rounds without a mistake, one straight after the other.", bildbeschreibung: "a sewing needle with thread" },
  winterkind: { name: "Winter Child", description: "Practised in the depths of winter - in December or January.", bildbeschreibung: "a snowman" },
  jahreswechsel: { name: "Turn of the Year", description: "Practised on the last day of the year or the first day of the new one.", bildbeschreibung: "fireworks in the night sky" },
  "tages-marathon": { name: "Marathon Day", description: "Ten rounds in a single day.", bildbeschreibung: "a jockey on a racehorse" },
  sternentag: { name: "Star-Studded Day", description: "Three rounds with three stars in a single day.", bildbeschreibung: "a sun with a face" },
  blitzsauber: { name: "Squeaky Clean", description: "Three rounds without a mistake in a single day.", bildbeschreibung: "a bar of soap with bubbles" },
  "volle-woche": { name: "Full Week", description: "Practised on five different days in ONE week.", bildbeschreibung: "a green book" },
  // „Blindflug" ⇒ „No Peeking": zum Affen, der sich die Augen zuhält - und
  // ohne das Wort „blind" (Glossar §5 Nr. 2).
  blindflug: { name: "No Peeking", description: "A whole round without a mistake - with the on-screen keyboard hidden. That is what touch typing is all about.", bildbeschreibung: "a monkey covering its eyes with its hands" },
  // ★ D1 Randfund (28.09.2026): any two different languages.
  sprachwechsler: { name: "Language Switcher", description: "Practised in two languages - for example English and German.", bildbeschreibung: "the globe showing Europe and Africa" },
  lesenacht: { name: "Bedtime Reader", description: "A story stage read after 8pm.", bildbeschreibung: "a moon with a face" },
  "zaehe-taste": { name: "Stubborn Key", description: "A key that was tricky for a long time is now mastered.", bildbeschreibung: "a snail" },
  aufsteiger: { name: "On the Up", description: "Five difficulty levels higher than at the start.", bildbeschreibung: "a chart with a rising line" },
};
