/**
 * ALLE Ansage- und Tagebuchtexte der Polar-Expedition als TABELLE (Bauplan §2, E7):
 * kindgerecht erzählend ODER erwachsen sachlich, je Zone — bewusst KEINE verschachtelten
 * Ternaries, sondern eine flache, gut lesbare Datei. Bis E6 lag `zoneText` im Spiel-Hook;
 * E7 lagert sie hierher aus und ergänzt die Expeditionstagebuch-Texte (§4.7).
 *
 * Grundgesetz (Bauplan §7): In der Echo-Höhle und im Schneesturm nennt KEIN Text je das
 * zu tippende Zeichen (Blindschreiben bzw. Merken) — es wird nur angesagt bzw. auf der Tafel
 * gezeigt und verweht dann. An der Polarstation (Anagramm, Johannes 13.07.) nennt der Text
 * NIE das Lösungswort, nur die durcheinander liegenden Buchstaben — auch das Tagebuch-Beispiel
 * ist ein FREMDES Wort, nie eines aus der Rätselliste.
 */
import type { ZoneKind } from "./course";
import type { BedienSprache } from "../../bedienSprache/sprache";
import type { Lernweg } from "../lernweg";

/**
 * ★★ DIE EINE STELLE (28.09.2026): Gibt es in der Echo-Höhle das HÖHLENWESEN, das jede
 * Taste zuraunt? Das hängt am LERNWEG, nicht an der Bedienungssprache: Das Wesen spricht
 * mit deutschen Aufnahmen (`voices/monster/`), und die gibt es nur für Weg „de". Auf den
 * Wegen „en", „fr" und „es" klingt jede Taste als TON, ihr Name geht an den Screenreader
 * bzw. die Braillezeile (Entscheidung Johannes für „en": „Ton statt Stimme").
 *
 * Nach dieser Frage richten sich BEIDE Seiten: die Ansage (`caveAnnouncement` in
 * `useExpedition.ts` - Ton ja/nein) und JEDER Text, der die Höhle beschreibt (Zonentexte
 * unten, Tagebuch, Öffner und Stand in `SPIEL_TEXTE`, Kinder-Hilfe). Jede Bedienungssprache
 * hat darum zwei Fassungen: „mit Wesen" (Weg „de") und „ohne Wesen" (Ton + Screenreader).
 * Bis zum 28.09. hing es an der Bedienungssprache: Deutsch/Englisch versprachen das Wesen
 * auch auf Weg „en", Französisch/Spanisch verschwiegen es auch auf Weg „de".
 */
export function hoehleHatWesen(lernweg: Lernweg): boolean {
  return lernweg === "de";
}

/*
 * ★ ANREDE (19.09.2026): Die „Adult"-Texte sind sachlich, aber per DU - wie
 * alle Texte für Lernende (Johannes: „Schüler und Selbstlernende mit du",
 * auch ab 16; Regel `anredeFuer` in `skin.ts`). Eine Sie-Fassung braucht das
 * Spiel nicht: Eine Lehrkraft bekommt es nur mit einer Kinder- oder
 * Jugend-Textstufe zu sehen, und dort gilt ohnehin die erzählende Du-Fassung.
 */

/** Die spielbaren Zonen dieser Mechanik (Ufer/Rast/Ziel tragen keinen eigenen Text). */
export type PlayZone = "water" | "climb" | "slide" | "cave" | "storm" | "station";

/**
 * Die Zonen, deren Text NUR an der Bedienungssprache hängt. Die Höhle steht nicht darin:
 * ihr Text hängt zusätzlich am Weg ({@link hoehleHatWesen}) und hat darum eigene Tabellen
 * (`HOEHLE_TEXT`, `HOEHLE_TAGEBUCH`) - so kann keine Stelle die Höhle an der Weiche vorbei
 * aus der Sprach-Tabelle holen.
 */
type ZoneOhneHoehle = Exclude<PlayZone, "cave">;

/** Die zwei Fassungen eines Höhlen-Textes: mit Wesen (Weg „de") und ohne (Ton + Screenreader). */
interface HoehleFassungen<T> {
  mitWesen: T;
  ohneWesen: T;
}

/**
 * Der Textsatz einer Zone (kindgerecht erzählend + erwachsen sachlich). Gleiche Form wie der
 * frühere `zoneText`-Rückgabewert, damit der Hook unverändert `T.introKid(first, t)` usw. ruft.
 */
export interface ZoneTextSet {
  /** Wort für eine Station dieser Zone („Scholle", „Tritt", „Funkspruch" …). */
  noun: string;
  startText: (isAdult: boolean, name: string) => string;
  /** `first` = erste Station (Zeichenname), `t` = mit Zeitdruck. */
  introKid: (first: string, t: boolean) => string;
  introAdult: (first: string, t: boolean) => string;
  /** `back` = Station, zu der ein Scheitern zurückwirft. */
  failKid: (back: string) => string;
  failAdult: (back: string) => string;
  winKid: (clean: boolean) => string;
  winAdult: () => string;
}

/** Ein Expeditionstagebuch-Blatt (Bauplan §4.7): Aufgabe in EINEM Satz + EIN Beispiel. */
export interface DiaryText {
  /** Die Aufgabe der Zone in genau einem Satz. */
  task: string;
  /** Ein einziges, anschauliches Beispiel (nie das echte Rätselwort — §7). */
  example: string;
}

// --- Ansage-/Verlaufstexte je Zone (Kind erzählend / Erwachsene sachlich) -----------

const CAVE: ZoneTextSet = {
  // Blindschreiben (Bauplan §4.3): NIE das Zeichen im Text — es wird nur angesagt.
  noun: "Echo",
  startText: () => "Am Höhleneingang. Hör auf das Höhlenwesen!",
  introKid: () =>
    "Die Echo-Höhle! Hier ist es stockdunkel - du siehst kein Zeichen. Das Höhlenwesen raunt dir jede Taste zu. Hör gut hin und tippe, was du hörst!",
  introAdult: () =>
    "Die Echo-Höhle: Blindschreiben. Kein Zeichen ist sichtbar - das Höhlenwesen sagt jede Taste an. Tippe nach Gehör.",
  failKid: () => "Huch, erschrocken! Zurück zum Höhleneingang, hör wieder gut hin.",
  failAdult: () => "Zurück zum Höhleneingang. Die Ansage kommt erneut.",
  winKid: (clean) => `Durch die Höhle geschafft, nur nach Gehör!${clean ? " Ohne Fehler!" : ""}`,
  winAdult: () => "Höhle durchquert.",
};

/**
 * Die deutsche Höhle OHNE Wesen (Weg „en"/„fr"/„es" mit deutscher Bedienung, siehe
 * {@link hoehleHatWesen}): jede Taste klingt als Ton, ihr Name geht an den Screenreader
 * bzw. die Braillezeile - so sagt es der Text. Scheitern und Ziel wie oben (sie nennen
 * kein Wesen).
 */
const CAVE_OHNE_WESEN: ZoneTextSet = {
  ...CAVE,
  startText: () => "Am Höhleneingang. Hör gut auf jede Taste!",
  introKid: () =>
    "Die Echo-Höhle! Hier ist es stockdunkel - du siehst kein Zeichen. Jede Taste klingt als Ton durch die Dunkelheit, und der Screenreader oder die Braillezeile sagt dir, welche es ist. Hör gut hin und tippe sie!",
  introAdult: () =>
    "Die Echo-Höhle: Blindschreiben. Kein Zeichen ist sichtbar - jede Taste klingt als Ton, ihr Name geht an den Screenreader oder die Braillezeile. Tippe die angesagte Taste.",
};

const STORM: ZoneTextSet = {
  // Vorauslesen & Merken (Bauplan §4.4): die Folge steht kurz, dann verweht sie.
  noun: "Böe",
  startText: () => "Im Schneesturm. Merk dir die Zeichen, dann verwehen sie!",
  introKid: () =>
    "Der Schneesturm! Auf der Tafel steht eine kurze Folge - merk sie dir gut. Dann verweht sie im Wind, und du tippst sie aus dem Gedächtnis. Bereit? Merk dir gleich die erste Folge!",
  introAdult: () =>
    "Der Schneesturm: eine kurze Folge einprägen. Sie wird gezeigt und angesagt, dann verweht sie - aus dem Gedächtnis tippen. Bei Bedarf kommt die Ansage bzw. die Tafel noch einmal.",
  failKid: () => "Kein Problem, merk dir die Folge noch einmal.",
  failAdult: () => "Die Folge kommt noch einmal.",
  winKid: (clean) => `Durch den Schneesturm, alles aus dem Kopf getippt!${clean ? " Fehlerfrei!" : ""}`,
  winAdult: () => "Durch den Schneesturm.",
};

const STATION: ZoneTextSet = {
  // Wort-ANAGRAMM (Bauplan §4.5, Johannes 13.07.): die Buchstaben liegen DURCHEINANDER als
  // Kacheln — das Kind erkennt das Wort und tippt es in richtiger Reihenfolge. Verschnaufzone
  // (kein Zeitdruck/Scheitern). Der Text nennt NIE das Lösungswort (§7).
  noun: "Funkspruch",
  startText: () => "An der Polarstation. Entschlüssle den ersten Funkspruch!",
  introKid: () =>
    "Die Polarstation! Zeit zum Durchatmen. Der Funker schickt Wörter - aber die Buchstaben liegen durcheinander. Erkenne das Wort und tippe es in der richtigen Reihenfolge. Keine Eile, hier geht nichts unter! Kommst du nicht weiter, verrät die Tab-Taste einen Buchstaben.",
  introAdult: () =>
    "Die Polarstation: Buchstaben-Anagramme entschlüsseln. Die Buchstaben eines Wortes liegen gemischt vor - erkenne das Wort und tippe es in der richtigen Reihenfolge. Kein Zeitdruck, kein Scheitern; die Tab-Taste verrät bei Bedarf den nächsten Buchstaben.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Alle Funksprüche entschlüsselt, die Familie hat geantwortet!${clean ? " Fehlerfrei!" : ""}`,
  winAdult: () => "Alle Funksprüche entschlüsselt.",
};

const CLIMB: ZoneTextSet = {
  noun: "Tritt",
  startText: (_isAdult, name) => `Am Bergfuß. Erster Tritt: ${name}`,
  introKid: (first, t) =>
    `Die Steilwand! Klettere den Buchstabenberg hinauf. Tippe an jedem Tritt die kurze Folge${t ? " - aber trödel nicht, sonst bröckeln die Steine" : ""}. Erster Tritt: ${first}.`,
  introAdult: (first, t) =>
    `Die Steilwand: an jedem Tritt eine kurze Zeichenfolge tippen${t ? ", bevor der Fels bröckelt" : ""}. Erster Tritt: ${first}.`,
  failKid: (back) => `Hoppla - ausgerutscht! Weiche Landung im Schnee. Zurück zum letzten Tritt: ${back}.`,
  failAdult: (back) => `Abgerutscht: zurück zum letzten Rastplatz. Weiter bei: ${back}.`,
  winKid: (clean) => `Geschafft, oben am Gipfel!${clean ? " Kein einziger Ausrutscher!" : ""}`,
  winAdult: () => "Gipfel erreicht.",
};

const SLIDE: ZoneTextSet = {
  // RHYTHMUS (umgebaut 14.07.): Ein einzelner Buchstabe fliegt heran und muss GENAU an der
  // Ziellinie getippt werden — der helle Zielton sagt, wann. Kein Folgen-Abtippen mehr.
  noun: "Schwung",
  startText: (_isAdult, name) => `Oben am Hang. Der erste Buchstabe kommt: ${name}`,
  introKid: (first, t) =>
    `Die Heim-Bauchrutsche! Du saust auf dem Bauch den Hang hinab, und die Buchstaben fliegen dir entgegen. Drück jeden erst, wenn er im Tor ist - beim hellen Ton${t ? ", nicht früher" : ""}! Der erste: ${first}.`,
  introAdult: (first, t) =>
    `Die Bauchrutsche: Ein einzelner Buchstabe fliegt heran und wird im Moment der Ziellinie getippt${t ? " - der helle Zielton markiert das Trefferfenster" : ""}. Der erste: ${first}.`,
  failKid: () => "Wusch, in den Schnee gekullert! Nichts passiert, weiter geht's.",
  failAdult: () => "In den Schnee gerutscht, der nächste Buchstabe kommt.",
  winKid: (clean) => `Zuhause am Iglu!${clean ? " Fehlerfrei! Schau, das Polarlicht!" : ""}`,
  winAdult: () => "Am Ziel angekommen.",
};

const WATER: ZoneTextSet = {
  noun: "Scholle",
  startText: (isAdult, name) =>
    isAdult ? `Am Ufer. Erste Scholle: ${name}` : `Am Ufer. Spring auf die erste Scholle: ${name}`,
  introKid: (first, t) =>
    `Das Packeis! Spring von Scholle zu Scholle über das Wasser. Drück immer die Taste, die auf der nächsten Scholle steht${t ? " - aber trödel nicht, das Eis knackt schon" : ""}! Erste Scholle: ${first}.`,
  introAdult: (first, t) =>
    `Kurze Wiederholung: Drück jeweils die Taste der nächsten Scholle${t ? ", bevor sie sinkt" : ""}. Erste Scholle: ${first}.`,
  failKid: (back) => `Platsch! Deine Scholle ist versunken. Schnell zurück ans Ufer, gleich nochmal! Erste Scholle: ${back}.`,
  failAdult: (back) => `Die Scholle ist versunken, zurück zum Ufer. Erste Scholle: ${back}.`,
  winKid: (clean) => `Juhu, geschafft!${clean ? " Kein einziges Mal geplatscht, Polarlicht!" : ""}`,
  winAdult: () => "Geschafft.",
};

const ZONE_TEXT: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER,
  climb: CLIMB,
  slide: SLIDE,
  storm: STORM,
  station: STATION,
};

// --- Dieselben Texte ENGLISCH (EN3, 19.09.2026) -------------------------------------
//
// ★★ ENTSCHIEDEN IN EN3 (Glossar §4 und §6 Nr. 5): Die Erzählung der Expedition ist
// BEDIENUNG des Spiels, kein Übungsinhalt - sie folgt der Bedienungssprache und wird
// mit deren Stimme gesprochen. Was bleibt, wie es ist: die Tasten selbst (die deutsche
// Tastatur wird geübt), die Wörter der Polarstation (deutsche Wortliste, `words.ts`)
// und das Höhlenwesen, das die Tasten mit deutschen Aufnahmen ansagt („Ka") - das es
// nur auf Weg „de" gibt ({@link hoehleHatWesen}; Fassung ohne Wesen: CAVE_EN_OHNE_WESEN).
// Grundgesetz §7 gilt unverändert: Höhle und Sturm nennen nie das Zeichen, die Station
// nie das Lösungswort.
//
// Ton wie im Deutschen: „Kid" (Kind UND Jugend) erzählend und warm, „Adult" sachlich.
// Glossar §3.6: Pack Ice · Ice Cliff · Echo Cave · Blizzard · Polar Station · Belly
// Slide Home, floe, radio message, stage, northern lights. Nie „blind" (§5 Nr. 2).

const CAVE_EN: ZoneTextSet = {
  noun: "Echo",
  startText: () => "At the cave entrance. Listen to the cave creature!",
  introKid: () =>
    "The Echo Cave! It's pitch dark in here - you can't see a single character. The cave creature whispers each key to you. Listen carefully and type what you hear!",
  introAdult: () =>
    "The Echo Cave: typing by ear. No character is shown - the cave creature announces each key. Type what you hear.",
  failKid: () => "Eek, what a fright! Back to the cave entrance - listen carefully again.",
  failAdult: () => "Back to the cave entrance. The key will be announced again.",
  winKid: (clean) => `Through the cave, by ear alone!${clean ? " Without a mistake!" : ""}`,
  winAdult: () => "Cave crossed.",
};

/** Die englische Höhle OHNE Wesen (Weg „en"/„fr"/„es", {@link hoehleHatWesen}). */
const CAVE_EN_OHNE_WESEN: ZoneTextSet = {
  ...CAVE_EN,
  startText: () => "At the cave entrance. Listen carefully for each key!",
  introKid: () =>
    "The Echo Cave! It's pitch dark in here - you can't see a single character. Each key rings out as a sound in the dark, and your screen reader or braille display tells you which one it is. Listen carefully and type it!",
  introAdult: () =>
    "The Echo Cave: typing without looking. No character is shown - each key sounds a tone, and its name goes to your screen reader or braille display. Type the key that is announced.",
};

const STORM_EN: ZoneTextSet = {
  noun: "Gust",
  startText: () => "In the blizzard. Remember the characters before they blow away!",
  introKid: () =>
    "The Blizzard! A short sequence appears on the board - remember it well. Then the wind blows it away, and you type it from memory. Ready? Remember the first sequence!",
  introAdult: () =>
    "The Blizzard: memorise a short sequence. It is shown and announced, then it blows away - type it from memory. If needed, the announcement and the board come again.",
  failKid: () => "No problem - remember the sequence once more.",
  failAdult: () => "The sequence will come again.",
  winKid: (clean) => `Through the blizzard, all typed from memory!${clean ? " No mistakes!" : ""}`,
  winAdult: () => "Through the blizzard.",
};

const STATION_EN: ZoneTextSet = {
  noun: "Radio message",
  startText: () => "At the Polar Station. Decode the first radio message!",
  introKid: () =>
    "The Polar Station! Time to catch your breath. The radio operator sends words - but the letters are all jumbled up. Work out the word and type it in the right order. No rush, nothing sinks here! If you get stuck, the Tab key gives you a letter.",
  introAdult: () =>
    "The Polar Station: solving letter anagrams. The letters of a word are jumbled - work out the word and type it in the right order. No time pressure and no failing; the Tab key reveals the next letter if needed.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `All radio messages decoded - the family has answered!${clean ? " No mistakes!" : ""}`,
  winAdult: () => "All radio messages decoded.",
};

const CLIMB_EN: ZoneTextSet = {
  noun: "Foothold",
  startText: (_isAdult, name) => `At the foot of the cliff. First foothold: ${name}`,
  introKid: (first, t) =>
    `The Ice Cliff! Climb up the mountain of letters. At each foothold, type the short sequence${t ? " - but don't dawdle, or the rocks start to crumble" : ""}. First foothold: ${first}.`,
  introAdult: (first, t) =>
    `The Ice Cliff: at each foothold, type a short sequence of characters${t ? " before the rock crumbles" : ""}. First foothold: ${first}.`,
  failKid: (back) => `Whoops - you slipped! A soft landing in the snow. Back to the last foothold: ${back}.`,
  failAdult: (back) => `Slipped: back to the last resting point. Continue with: ${back}.`,
  winKid: (clean) => `You made it, right to the top!${clean ? " Not a single slip!" : ""}`,
  winAdult: () => "Summit reached.",
};

const SLIDE_EN: ZoneTextSet = {
  noun: "Swoosh",
  startText: (_isAdult, name) => `At the top of the slope. Here comes the first letter: ${name}`,
  introKid: (first, t) =>
    `The Belly Slide Home! You whizz down the slope on your tummy, and the letters fly towards you. Press each one only when it's in the gate - at the bright sound${t ? ", not before" : ""}! The first one: ${first}.`,
  introAdult: (first, t) =>
    `The Belly Slide: a single letter flies towards you and is typed the moment it reaches the finish line${t ? " - the bright target sound marks the moment to hit it" : ""}. The first one: ${first}.`,
  failKid: () => "Whoosh, you rolled into the snow! No harm done - off you go again.",
  failAdult: () => "Slid into the snow - the next letter is coming.",
  winKid: (clean) => `Home at the igloo!${clean ? " No mistakes! Look, the northern lights!" : ""}`,
  winAdult: () => "You have reached the finish.",
};

const WATER_EN: ZoneTextSet = {
  noun: "Floe",
  startText: (isAdult, name) =>
    isAdult ? `On the shore. First floe: ${name}` : `On the shore. Jump onto the first floe: ${name}`,
  introKid: (first, t) =>
    `The Pack Ice! Jump from floe to floe across the water. Always press the key on the next floe${t ? " - but don't dawdle, the ice is already cracking" : ""}! First floe: ${first}.`,
  introAdult: (first, t) =>
    `A quick recap: press the key of the next floe each time${t ? ", before it sinks" : ""}. First floe: ${first}.`,
  failKid: (back) => `Splash! Your floe has sunk. Quick, back to the shore and try again! First floe: ${back}.`,
  failAdult: (back) => `The floe has sunk - back to the shore. First floe: ${back}.`,
  winKid: (clean) => `Hooray, you made it!${clean ? " Not a single splash - northern lights!" : ""}`,
  winAdult: () => "Done.",
};

const ZONE_TEXT_EN: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_EN,
  climb: CLIMB_EN,
  slide: SLIDE_EN,
  storm: STORM_EN,
  station: STATION_EN,
};

// --- Dieselben Texte FRANZÖSISCH (E11a-5, 26.09.2026) -------------------------------
//
// ★★ NEU GESCHRIEBEN, NICHT ÜBERSETZT (Bauplan französischer Lehrgang §6.2/§9.1): aus der
// FUNKTION jeder Zone (was sieht das Kind, welche Taste muss es drücken), nicht aus dem
// deutschen oder englischen Satz. Glossar §9.2: l'Expédition, la Banquise; Fehler heisst
// « erreur (de frappe) », nie « faute » (Hausregel „nie gegen das Kind"); Tastennamen wie
// auf der Kappe: Maj, Espace, Entrée, Échap, Tab. Die Expedition duzt alle (siehe ANREDE
// oben) - auch die sachliche „Adult"-Fassung sagt « tu ».
//
// Die Begriffe decken sich mit der französischen Hilfe (`TippenHilfe.fr.tsx`,
// `LehrerHilfe.fr.tsx`): « la grotte de l'écho », « la montagne de lettres », « glisser sur
// le ventre », « l'aurore boréale ». Eine einzelne Scholle heisst « bloc de glace » wie auf
// der Bühne (`BUEHNE_TEXTE.fr.spielfeld`); « la Banquise » ist die ganze Zone.
//
// Grundgesetz §7 unverändert: Höhle und Sturm nennen nie das Zeichen, die Station nie das
// Lösungswort. Leerzeichen vor `: ; ! ?` ist ein GEWÖHNLICHES Leerzeichen (Bauplan F8 -
// so steht es überall im französischen Code), keine Auslassungspunkte in neuen Sätzen.

// ★ D1 Randfund (28.09.2026): Die Höhle versprach „la créature de la grotte te
// murmure chaque touche" - auf Weg „fr" gibt es aber KEIN Höhlenwesen (keine
// Aufnahmen, Entscheidung Johannes für Weg „en": „Ton statt Stimme",
// `caveAnnouncement` in useExpedition.ts). Jede Taste klingt als Ton, ihr Name
// geht an den Screenreader/die Braillezeile. CAVE_FR sagt genau das.
// ★ 28.09.2026 (später): Auf Weg „de" mit französischer Bedienung GIBT es das Wesen -
// dafür steht der frühere Wortlaut wieder da, als CAVE_FR_MIT_WESEN. Welche Fassung
// gilt, entscheidet {@link hoehleHatWesen} am Weg, nicht an der Sprache.
const CAVE_FR: ZoneTextSet = {
  noun: "Écho",
  startText: () => "À l'entrée de la grotte. Écoute bien chaque touche !",
  introKid: () =>
    "La Grotte de l'écho ! Il fait tout noir ici - tu ne vois aucun caractère. Chaque touche résonne dans le noir, et le lecteur d'écran ou la plage braille te dit laquelle. Écoute bien et tape-la !",
  introAdult: () =>
    "La Grotte de l'écho : taper sans voir. Aucun caractère n'est affiché - chaque touche sonne, et son nom arrive au lecteur d'écran ou à la plage braille. Tape la touche annoncée.",
  failKid: () => "Oh là là, quelle peur ! Retour à l'entrée de la grotte - écoute bien encore une fois.",
  failAdult: () => "Retour à l'entrée de la grotte. La touche sera annoncée de nouveau.",
  winKid: (clean) => `Tu as traversé la grotte, rien qu'à l'oreille !${clean ? " Sans aucune erreur !" : ""}`,
  winAdult: () => "Grotte traversée.",
};

/** Die französische Höhle MIT Wesen (Weg „de"): der Wortlaut vor dem 28.09.2026. */
const CAVE_FR_MIT_WESEN: ZoneTextSet = {
  ...CAVE_FR,
  startText: () => "À l'entrée de la grotte. Écoute la créature de la grotte !",
  introKid: () =>
    "La Grotte de l'écho ! Il fait tout noir ici - tu ne vois aucun caractère. La créature de la grotte te murmure chaque touche. Écoute bien et tape ce que tu entends !",
  introAdult: () =>
    "La Grotte de l'écho : taper à l'oreille. Aucun caractère n'est affiché - la créature de la grotte annonce chaque touche. Tape ce que tu entends.",
};

const STORM_FR: ZoneTextSet = {
  noun: "Rafale",
  startText: () => "Dans la tempête de neige. Retiens les caractères avant que le vent les emporte !",
  introKid: () =>
    "La Tempête de neige ! Une courte suite apparait sur le tableau - retiens-la bien. Puis le vent l'emporte, et tu la tapes de mémoire. On y va ? Retiens la première suite !",
  introAdult: () =>
    "La Tempête de neige : retenir une courte suite. Elle est affichée et annoncée, puis le vent l'emporte - tape-la de mémoire. Au besoin, l'annonce et le tableau reviennent.",
  failKid: () => "Pas de souci, retiens la suite encore une fois.",
  failAdult: () => "La suite revient.",
  winKid: (clean) => `Tu as traversé la tempête, tout tapé de mémoire !${clean ? " Sans erreur !" : ""}`,
  winAdult: () => "Tempête traversée.",
};

const STATION_FR: ZoneTextSet = {
  noun: "Message radio",
  startText: () => "À la station polaire. Déchiffre le premier message radio !",
  introKid: () =>
    "La Station polaire ! Le temps de souffler. L'opérateur radio envoie des mots - mais les lettres sont toutes mélangées. Trouve le mot et tape-le dans le bon ordre. Rien ne presse, ici rien ne coule ! Si tu bloques, la touche Tab te donne une lettre.",
  introAdult: () =>
    "La Station polaire : résoudre des anagrammes. Les lettres d'un mot sont mélangées - trouve le mot et tape-le dans le bon ordre. Pas de limite de temps, pas d'échec ; au besoin, la touche Tab donne la lettre suivante.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Tous les messages radio sont déchiffrés - la famille a répondu !${clean ? " Sans erreur !" : ""}`,
  winAdult: () => "Tous les messages radio sont déchiffrés.",
};

const CLIMB_FR: ZoneTextSet = {
  noun: "Prise",
  startText: (_isAdult, name) => `Au pied de la falaise. Première prise : ${name}`,
  introKid: (first, t) =>
    `La Falaise de glace ! Grimpe la montagne de lettres. À chaque prise, tape la courte suite${t ? " - mais ne traine pas, sinon les pierres s'effritent" : ""}. Première prise : ${first}.`,
  introAdult: (first, t) =>
    `La Falaise de glace : à chaque prise, taper une courte suite de caractères${t ? " avant que la roche s'effrite" : ""}. Première prise : ${first}.`,
  failKid: (back) => `Oups, tu as glissé ! Atterrissage en douceur dans la neige. Retour à la dernière prise : ${back}.`,
  failAdult: (back) => `Glissade : retour au dernier point de repos. On reprend avec : ${back}.`,
  winKid: (clean) => `Bravo, tu es tout en haut !${clean ? " Pas une seule glissade !" : ""}`,
  winAdult: () => "Sommet atteint.",
};

const SLIDE_FR: ZoneTextSet = {
  noun: "Élan",
  startText: (_isAdult, name) => `En haut de la pente. Voici la première lettre : ${name}`,
  introKid: (first, t) =>
    `La Glissade du retour ! Tu dévales la pente sur le ventre, et les lettres volent vers toi. Appuie sur chacune seulement quand elle est dans la porte - au son clair${t ? ", pas avant" : ""} ! La première : ${first}.`,
  introAdult: (first, t) =>
    `La Glissade : une seule lettre arrive vers toi, et tu la tapes au moment où elle atteint la ligne d'arrivée${t ? " - le son clair marque le bon moment" : ""}. La première : ${first}.`,
  failKid: () => "Pouf, tu as roulé dans la neige ! Ce n'est rien, on continue.",
  failAdult: () => "Glissé dans la neige - la lettre suivante arrive.",
  winKid: (clean) => `De retour à l'igloo !${clean ? " Sans erreur ! Regarde, l'aurore boréale !" : ""}`,
  winAdult: () => "Tu as atteint l'arrivée.",
};

const WATER_FR: ZoneTextSet = {
  noun: "Bloc de glace",
  startText: (isAdult, name) =>
    isAdult ? `Sur la rive. Premier bloc de glace : ${name}` : `Sur la rive. Saute sur le premier bloc de glace : ${name}`,
  introKid: (first, t) =>
    `La Banquise ! Saute de bloc en bloc au-dessus de l'eau. Appuie toujours sur la touche du prochain bloc de glace${t ? " - mais ne traine pas, la glace craque déjà" : ""} ! Premier bloc : ${first}.`,
  introAdult: (first, t) =>
    `Petite révision : appuie à chaque fois sur la touche du prochain bloc de glace${t ? ", avant qu'il coule" : ""}. Premier bloc : ${first}.`,
  failKid: (back) => `Plouf ! Ton bloc de glace a coulé. Vite, retour sur la rive, et on recommence ! Premier bloc : ${back}.`,
  failAdult: (back) => `Le bloc de glace a coulé - retour sur la rive. Premier bloc : ${back}.`,
  winKid: (clean) => `Youpi, tu as réussi !${clean ? " Pas un seul plouf - l'aurore boréale !" : ""}`,
  winAdult: () => "Réussi.",
};

const ZONE_TEXT_FR: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_FR,
  climb: CLIMB_FR,
  slide: SLIDE_FR,
  storm: STORM_FR,
  station: STATION_FR,
};

// --- Dieselben Texte SPANISCH (ES-O, 27.09.2026) ------------------------------------
//
// ★★ NEU GESCHRIEBEN, NICHT ÜBERSETZT - aus der FUNKTION jeder Zone, wie bei „fr".
// Die Expedition tutea a todo el mundo (auch die sachliche „Adult"-Fassung sagt „tú").
// Zonen wie im Spiel (`course.ts`): la Banquisa, el Acantilado de hielo, la Cueva del
// Eco, la Tormenta de Nieve, la Estación Polar, el Tobogán de vuelta. Fehler heisst
// « error », nie « falta ». Tastennamen wie auf der Kappe: Mayús, Intro, Esc, Tab.
// Pinguine leben auf der Südhalbkugel - das Polarlicht heisst hier „aurora austral"
// (Prüfung 27.09.2026).
// Grundgesetz §7 unverändert: Höhle und Sturm nennen nie das Zeichen, die Station nie
// das Lösungswort.

const CAVE_ES: ZoneTextSet = {
  noun: "Eco",
  // ★ D1 Randfund (28.09.2026): kein „¡Escucha a la criatura!" mehr - auf Weg
  // „es" gibt es kein Höhlenwesen, nur einen Ton (siehe CAVE_FR, introKid unten).
  // Auf Weg „de" gilt CAVE_ES_MIT_WESEN ({@link hoehleHatWesen}).
  startText: () => "En la entrada de la cueva. ¡Escucha bien cada tecla!",
  introKid: () =>
    "¡La Cueva del Eco! Aquí está todo oscuro - no ves ningún carácter. Cada tecla suena en la oscuridad, y el lector de pantalla o la línea braille te dice cuál es. ¡Escucha bien y escríbela!",
  introAdult: () =>
    "La Cueva del Eco: escribir sin ver. No se muestra ningún carácter - cada tecla suena con un tono, y su nombre llega al lector de pantalla o a la línea braille. Escribe la tecla que se nombra.",
  failKid: () => "¡Uy, qué susto! Vuelta a la entrada de la cueva - escucha bien otra vez.",
  failAdult: () => "Vuelta a la entrada de la cueva. La tecla se anuncia de nuevo.",
  winKid: (clean) => `¡Has cruzado la cueva, solo de oído!${clean ? " ¡Sin ningún error!" : ""}`,
  winAdult: () => "Cueva cruzada.",
};

/**
 * Die spanische Höhle MIT Wesen (Weg „de"): der Wortlaut der ersten spanischen Fassung
 * (ES-O, Commit a8a59ded), bevor die Texte für Weg „es" ehrlich gemacht wurden.
 */
const CAVE_ES_MIT_WESEN: ZoneTextSet = {
  ...CAVE_ES,
  startText: () => "En la entrada de la cueva. ¡Escucha a la criatura de la cueva!",
  introKid: () =>
    "¡La Cueva del Eco! Aquí está todo oscuro - no ves ningún carácter. La criatura de la cueva te susurra cada tecla. ¡Escucha bien y escribe lo que oyes!",
  introAdult: () =>
    "La Cueva del Eco: escribir de oído. No se muestra ningún carácter - la criatura de la cueva anuncia cada tecla. Escribe lo que oyes.",
};

const STORM_ES: ZoneTextSet = {
  noun: "Ráfaga",
  startText: () => "En la tormenta de nieve. ¡Recuerda los caracteres antes de que el viento se los lleve!",
  introKid: () =>
    "¡La Tormenta de Nieve! En el tablero aparece una serie corta - recuérdala bien. Después el viento se la lleva y la escribes de memoria. ¿Vamos? ¡Recuerda la primera serie!",
  introAdult: () =>
    "La Tormenta de Nieve: recordar una serie corta. Se muestra y se anuncia, después el viento se la lleva - escríbela de memoria. Si hace falta, el aviso y el tablero vuelven.",
  failKid: () => "No pasa nada, recuerda la serie otra vez.",
  failAdult: () => "La serie vuelve.",
  winKid: (clean) => `¡Has cruzado la tormenta, todo escrito de memoria!${clean ? " ¡Sin errores!" : ""}`,
  winAdult: () => "Tormenta cruzada.",
};

const STATION_ES: ZoneTextSet = {
  noun: "Mensaje de radio",
  startText: () => "En la estación polar. ¡Descifra el primer mensaje de radio!",
  introKid: () =>
    "¡La Estación Polar! Hora de tomar aire. El operador de radio envía palabras - pero las letras están todas revueltas. Descubre la palabra y escríbela en el orden correcto. No hay prisa, ¡aquí nada se hunde! Si te atascas, la tecla Tab te da una letra.",
  introAdult: () =>
    "La Estación Polar: resolver anagramas. Las letras de una palabra están revueltas - descubre la palabra y escríbela en el orden correcto. Sin límite de tiempo y sin posibilidad de perder; si hace falta, la tecla Tab da la letra siguiente.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `¡Todos los mensajes de radio descifrados - la familia ha respondido!${clean ? " ¡Sin errores!" : ""}`,
  winAdult: () => "Todos los mensajes de radio descifrados.",
};

const CLIMB_ES: ZoneTextSet = {
  noun: "Agarre",
  startText: (_isAdult, name) => `Al pie del acantilado. Primer agarre: ${name}`,
  introKid: (first, t) =>
    `¡El Acantilado de hielo! Trepa por la montaña de letras. En cada agarre, escribe la serie corta${t ? " - pero no te entretengas, que las piedras se desmoronan" : ""}. Primer agarre: ${first}.`,
  introAdult: (first, t) =>
    `El Acantilado de hielo: en cada agarre, escribir una serie corta de caracteres${t ? " antes de que la roca se desmorone" : ""}. Primer agarre: ${first}.`,
  failKid: (back) => `¡Uy, has resbalado! Aterrizaje suave en la nieve. Vuelta al último agarre: ${back}.`,
  failAdult: (back) => `Resbalón: vuelta al último punto de descanso. Seguimos con: ${back}.`,
  winKid: (clean) => `¡Muy bien, estás arriba del todo!${clean ? " ¡Ni un solo resbalón!" : ""}`,
  winAdult: () => "Cima alcanzada.",
};

const SLIDE_ES: ZoneTextSet = {
  noun: "Impulso",
  startText: (_isAdult, name) => `Arriba de la pendiente. Aquí viene la primera letra: ${name}`,
  introKid: (first, t) =>
    `¡El Tobogán de vuelta! Bajas la pendiente sobre la barriga y las letras vuelan hacia ti. Pulsa cada una solo cuando esté en la puerta - con el sonido claro${t ? ", no antes" : ""}. La primera: ${first}.`,
  introAdult: (first, t) =>
    `El Tobogán: llega una sola letra hacia ti, y la escribes en el momento en que alcanza la línea de llegada${t ? " - el sonido claro marca el momento justo" : ""}. La primera: ${first}.`,
  failKid: () => "¡Pum, has rodado por la nieve! No pasa nada, seguimos.",
  failAdult: () => "Resbalón en la nieve - llega la letra siguiente.",
  winKid: (clean) => `¡De vuelta en el iglú!${clean ? " ¡Sin errores! ¡Mira, la aurora austral!" : ""}`,
  winAdult: () => "Has llegado a la meta.",
};

const WATER_ES: ZoneTextSet = {
  noun: "Bloque de hielo",
  startText: (isAdult, name) =>
    isAdult ? `En la orilla. Primer bloque de hielo: ${name}` : `En la orilla. Salta al primer bloque de hielo: ${name}`,
  introKid: (first, t) =>
    `¡La Banquisa! Salta de bloque en bloque por encima del agua. Pulsa siempre la tecla del siguiente bloque de hielo${t ? " - pero no te entretengas, que el hielo ya cruje" : ""}. Primer bloque: ${first}.`,
  introAdult: (first, t) =>
    `Un pequeño repaso: pulsa cada vez la tecla del siguiente bloque de hielo${t ? ", antes de que se hunda" : ""}. Primer bloque: ${first}.`,
  failKid: (back) => `¡Plaf! Tu bloque de hielo se ha hundido. ¡Rápido, vuelta a la orilla y otra vez! Primer bloque: ${back}.`,
  failAdult: (back) => `El bloque de hielo se ha hundido - vuelta a la orilla. Primer bloque: ${back}.`,
  winKid: (clean) => `¡Bien, lo has conseguido!${clean ? " Ni un solo chapuzón - ¡la aurora austral!" : ""}`,
  winAdult: () => "Conseguido.",
};

const ZONE_TEXT_ES: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_ES,
  climb: CLIMB_ES,
  slide: SLIDE_ES,
  storm: STORM_ES,
  station: STATION_ES,
};

// --- Dieselben Texte ITALIENISCH (O-IT, 02.10.2026) ---------------------------------
//
// Neu geschrieben, nicht übertragen; tu. Glossar §2.3: la Banchisa, la Parete di
// ghiaccio, la Grotta dell'eco, la Bufera di neve, la Stazione polare, la Scivolata
// verso casa; lastrone, messaggio radio, operatore radio, creatura della grotta,
// aurora boreale. Kinder höchstens EIN Ausrufezeichen je Meldung, Lob ohne
// Geschlechtsendung (Glossar Regel 1 und 2); nie „alla cieca" (Regel 4).
// Grundgesetz §7 unverändert: Höhle und Sturm nennen nie das Zeichen, die Station nie
// das Lösungswort.

const CAVE_IT: ZoneTextSet = {
  noun: "Eco",
  startText: () => "All'ingresso della grotta. Ascolta bene ogni tasto.",
  introKid: () =>
    "La Grotta dell'eco! Qui è buio pesto - non vedi nessun carattere. Ogni tasto suona nel buio, e il lettore di schermo o il display braille ti dice quale è. Ascolta bene e scrivilo.",
  introAdult: () =>
    "La Grotta dell'eco: scrivere a orecchio. Nessun carattere è visibile - ogni tasto suona con un tono, e il suo nome va al lettore di schermo o al display braille. Scrivi il tasto annunciato.",
  failKid: () => "Ops, che spavento! Torna all'ingresso della grotta e ascolta di nuovo con attenzione.",
  failAdult: () => "Di nuovo all'ingresso della grotta. Il tasto viene annunciato ancora.",
  winKid: (clean) => `Grotta attraversata, solo a orecchio!${clean ? " E senza nessun errore." : ""}`,
  winAdult: () => "Grotta attraversata.",
};

/** Die italienische Höhle MIT Wesen (Weg „de", {@link hoehleHatWesen}). */
const CAVE_IT_MIT_WESEN: ZoneTextSet = {
  ...CAVE_IT,
  startText: () => "All'ingresso della grotta. Ascolta la creatura della grotta.",
  introKid: () =>
    "La Grotta dell'eco! Qui è buio pesto - non vedi nessun carattere. La creatura della grotta ti sussurra ogni tasto. Ascolta bene e scrivi quello che senti.",
  introAdult: () =>
    "La Grotta dell'eco: scrivere a orecchio. Nessun carattere è visibile - la creatura della grotta annuncia ogni tasto. Scrivi quello che senti.",
};

const STORM_IT: ZoneTextSet = {
  noun: "Raffica",
  startText: () => "Nella bufera di neve. Ricorda i caratteri prima che il vento li porti via.",
  introKid: () =>
    "La Bufera di neve! Sulla lavagna c'è una breve sequenza - ricordala bene. Poi il vento la porta via e tu la scrivi a memoria. Si parte: ricorda la prima sequenza.",
  introAdult: () =>
    "La Bufera di neve: ricordare una breve sequenza. Viene mostrata e annunciata, poi il vento la porta via - scrivila a memoria. Se serve, l'annuncio e la lavagna ritornano.",
  failKid: () => "Nessun problema, ricorda di nuovo la sequenza.",
  failAdult: () => "La sequenza ritorna.",
  winKid: (clean) => `Bufera attraversata, tutto scritto a memoria!${clean ? " Senza errori." : ""}`,
  winAdult: () => "Bufera attraversata.",
};

const STATION_IT: ZoneTextSet = {
  noun: "Messaggio radio",
  startText: () => "Alla stazione polare. Decifra il primo messaggio radio.",
  introKid: () =>
    "La Stazione polare! È il momento di riprendere fiato. L'operatore radio manda parole - ma le lettere sono tutte mescolate. Scopri la parola e scrivila nell'ordine giusto. Nessuna fretta, qui non affonda niente. Se ti blocchi, il tasto Tab ti dà una lettera.",
  introAdult: () =>
    "La Stazione polare: risolvere anagrammi. Le lettere di una parola sono mescolate - scopri la parola e scrivila nell'ordine giusto. Senza limite di tempo e senza possibilità di perdere; se serve, il tasto Tab dà la lettera successiva.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Tutti i messaggi radio decifrati - la famiglia ha risposto!${clean ? " Senza errori." : ""}`,
  winAdult: () => "Tutti i messaggi radio decifrati.",
};

const CLIMB_IT: ZoneTextSet = {
  noun: "Appiglio",
  startText: (_isAdult, name) => `Ai piedi della parete. Primo appiglio: ${name}`,
  introKid: (first, t) =>
    `La Parete di ghiaccio! Arrampicati sulla montagna di lettere. A ogni appiglio scrivi la breve sequenza${t ? " - ma non perdere tempo, le pietre si sgretolano" : ""}. Primo appiglio: ${first}.`,
  introAdult: (first, t) =>
    `La Parete di ghiaccio: a ogni appiglio scrivere una breve sequenza di caratteri${t ? " prima che la roccia si sgretoli" : ""}. Primo appiglio: ${first}.`,
  failKid: (back) => `Ops, una scivolata! Atterraggio morbido nella neve. Di nuovo all'ultimo appiglio: ${back}.`,
  failAdult: (back) => `Scivolata: di nuovo all'ultimo punto di sosta. Si continua da: ${back}.`,
  winKid: (clean) => `Ce l'hai fatta, sei in cima!${clean ? " Senza nemmeno una scivolata." : ""}`,
  winAdult: () => "Cima raggiunta.",
};

const SLIDE_IT: ZoneTextSet = {
  noun: "Slancio",
  startText: (_isAdult, name) => `In cima al pendio. Ecco la prima lettera: ${name}`,
  introKid: (first, t) =>
    `La Scivolata verso casa! Scendi il pendio sulla pancia e le lettere ti volano incontro. Premi ognuna solo quando è nella porta - al suono chiaro${t ? ", non prima" : ""}. La prima: ${first}.`,
  introAdult: (first, t) =>
    `La Scivolata: arriva una sola lettera, e la scrivi nel momento in cui raggiunge il traguardo${t ? " - il suono chiaro segna il momento giusto" : ""}. La prima: ${first}.`,
  failKid: () => "Puf, un ruzzolone nella neve! Non è successo niente, si continua.",
  failAdult: () => "Scivolata nella neve - arriva la lettera successiva.",
  winKid: (clean) => `Di nuovo all'igloo!${clean ? " Senza errori - guarda, l'aurora boreale." : ""}`,
  winAdult: () => "Traguardo raggiunto.",
};

const WATER_IT: ZoneTextSet = {
  noun: "Lastrone",
  startText: (isAdult, name) =>
    isAdult ? `Sulla riva. Primo lastrone: ${name}` : `Sulla riva. Salta sul primo lastrone: ${name}`,
  introKid: (first, t) =>
    `La Banchisa! Salta da un lastrone all'altro sopra l'acqua. Premi sempre il tasto che c'è sul prossimo lastrone${t ? " - ma non perdere tempo, il ghiaccio scricchiola già" : ""}. Primo lastrone: ${first}.`,
  introAdult: (first, t) =>
    `Breve ripasso: premi ogni volta il tasto del prossimo lastrone${t ? ", prima che affondi" : ""}. Primo lastrone: ${first}.`,
  failKid: (back) => `Splash! Il tuo lastrone è affondato. Presto, di nuovo sulla riva e si riprova. Primo lastrone: ${back}.`,
  failAdult: (back) => `Il lastrone è affondato - di nuovo sulla riva. Primo lastrone: ${back}.`,
  winKid: (clean) => `Evviva, ce l'hai fatta!${clean ? " Nemmeno un tuffo - l'aurora boreale." : ""}`,
  winAdult: () => "Fatto.",
};

const ZONE_TEXT_IT: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_IT,
  climb: CLIMB_IT,
  slide: SLIDE_IT,
  storm: STORM_IT,
  station: STATION_IT,
};

// --- Dieselben Texte POLNISCH (O-PL, 02.10.2026) ------------------------------------
//
// ★ O-PL (02.10.2026): neu geschrieben, nicht übertragen; ty. Glossar §2.3: Pak lodowy,
// Lodowa ściana, Jaskinia echa, Śnieżyca, Stacja polarna, Ślizgiem do domu; kra,
// wiadomość radiowa, głos z radia, stworek z jaskini, zorza polarna, igloo. Nie eine
// Vergangenheit der 2. Person (Geschlecht, Regel 2): Präsens, Sätze über die Sache
// („Udało się", „Szczyt zdobyty"). Kinder höchstens EIN Ausrufezeichen je Meldung,
// Erwachsene keines. Der Stationsname („Kra 2 z 8") steht im Nominativ.
// Grundgesetz §7 unverändert: Höhle und Sturm nennen nie das Zeichen, die Station nie
// das Lösungswort.

const CAVE_PL: ZoneTextSet = {
  noun: "Echo",
  startText: () => "Przy wejściu do jaskini. Słuchaj uważnie każdego klawisza.",
  introKid: () =>
    "Jaskinia echa! Tu jest zupełnie ciemno - nie widać żadnego znaku. Każdy klawisz brzmi w ciemności jak dźwięk, a czytnik ekranu albo monitor brajlowski podaje ci jego nazwę. Słuchaj uważnie i naciśnij ten klawisz.",
  introAdult: () =>
    "Jaskinia echa: pisanie ze słuchu. Żaden znak nie jest widoczny - każdy klawisz brzmi jak dźwięk, a jego nazwa trafia do czytnika ekranu lub na monitor brajlowski. Naciśnij zapowiedziany klawisz.",
  failKid: () => "Ojej, ale strach! Wracasz do wejścia do jaskini - posłuchaj jeszcze raz uważnie.",
  failAdult: () => "Powrót do wejścia do jaskini. Klawisz zostanie zapowiedziany jeszcze raz.",
  winKid: (clean) => `Jaskinia za tobą - tylko ze słuchu!${clean ? " I bez żadnego błędu." : ""}`,
  winAdult: () => "Jaskinia pokonana.",
};

/** ★ O-PL: die polnische Höhle MIT Wesen (Weg „de", {@link hoehleHatWesen}). */
const CAVE_PL_MIT_WESEN: ZoneTextSet = {
  ...CAVE_PL,
  startText: () => "Przy wejściu do jaskini. Słuchaj stworka z jaskini.",
  introKid: () =>
    "Jaskinia echa! Tu jest zupełnie ciemno - nie widać żadnego znaku. Stworek z jaskini szepcze ci każdy klawisz. Słuchaj uważnie i naciśnij to, co słyszysz.",
  introAdult: () =>
    "Jaskinia echa: pisanie ze słuchu. Żaden znak nie jest widoczny - stworek z jaskini zapowiada każdy klawisz. Naciśnij to, co słyszysz.",
};

const STORM_PL: ZoneTextSet = {
  noun: "Podmuch",
  startText: () => "W śnieżycy. Zapamiętaj znaki, zanim wiatr je zwieje.",
  introKid: () =>
    "Śnieżyca! Na tablicy pojawia się krótki ciąg znaków - zapamiętaj go dobrze. Potem wiatr go zwiewa, a ty piszesz go z pamięci. Zaczynamy: zapamiętaj pierwszy ciąg.",
  introAdult: () =>
    "Śnieżyca: zapamiętywanie krótkiego ciągu znaków. Ciąg jest pokazany i zapowiedziany, potem wiatr go zwiewa - napisz go z pamięci. W razie potrzeby zapowiedź i tablica wracają.",
  failKid: () => "Nic się nie stało, zapamiętaj ciąg jeszcze raz.",
  failAdult: () => "Ciąg pojawi się jeszcze raz.",
  winKid: (clean) => `Śnieżyca za tobą - wszystko napisane z pamięci!${clean ? " Bez błędów." : ""}`,
  winAdult: () => "Śnieżyca pokonana.",
};

const STATION_PL: ZoneTextSet = {
  noun: "Wiadomość radiowa",
  startText: () => "Przy stacji polarnej. Rozszyfruj pierwszą wiadomość radiową.",
  introKid: () =>
    "Stacja polarna! Czas złapać oddech. Głos z radia przesyła słowa - ale litery są pomieszane. Odgadnij słowo i napisz je we właściwej kolejności. Bez pośpiechu, tu nic nie tonie. Jeśli utkniesz, klawisz Tab podpowie ci literę.",
  introAdult: () =>
    "Stacja polarna: rozwiązywanie anagramów. Litery słowa są pomieszane - odgadnij słowo i napisz je we właściwej kolejności. Bez limitu czasu i bez przegrywania; w razie potrzeby klawisz Tab podaje następną literę.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Wszystkie wiadomości radiowe rozszyfrowane - rodzina odpowiada!${clean ? " Bez błędów." : ""}`,
  winAdult: () => "Wszystkie wiadomości radiowe rozszyfrowane.",
};

const CLIMB_PL: ZoneTextSet = {
  noun: "Stopień",
  startText: (_isAdult, name) => `U stóp ściany. Pierwszy stopień: ${name}`,
  introKid: (first, t) =>
    `Lodowa ściana! Wspinaj się na górę z liter. Na każdym stopniu napisz krótki ciąg znaków${t ? " - ale się nie ociągaj, bo kamienie zaczynają się kruszyć" : ""}. Pierwszy stopień: ${first}.`,
  introAdult: (first, t) =>
    `Lodowa ściana: na każdym stopniu napisz krótki ciąg znaków${t ? ", zanim skała się wykruszy" : ""}. Pierwszy stopień: ${first}.`,
  failKid: (back) => `Ups, poślizg! Miękkie lądowanie w śniegu. Wracasz na ostatni stopień: ${back}.`,
  failAdult: (back) => `Poślizg: powrót do ostatniego miejsca odpoczynku. Dalej od: ${back}.`,
  winKid: (clean) => `Udało się, szczyt zdobyty!${clean ? " Ani jednego poślizgu." : ""}`,
  winAdult: () => "Szczyt zdobyty.",
};

const SLIDE_PL: ZoneTextSet = {
  noun: "Ślizg",
  startText: (_isAdult, name) => `Na szczycie stoku. Nadlatuje pierwsza litera: ${name}`,
  introKid: (first, t) =>
    `Ślizgiem do domu! Zjeżdżasz na brzuchu po stoku, a litery lecą ci naprzeciw. Naciśnij każdą dopiero wtedy, gdy jest w bramce - przy jasnym dźwięku${t ? ", nie wcześniej" : ""}. Pierwsza: ${first}.`,
  introAdult: (first, t) =>
    `Ślizg: nadlatuje jedna litera, a ty piszesz ją w chwili, gdy dotrze do mety${t ? " - jasny dźwięk wyznacza właściwy moment" : ""}. Pierwsza: ${first}.`,
  failKid: () => "Bęc, fikołek w śnieg! Nic się nie stało, jedziemy dalej.",
  failAdult: () => "Upadek w śnieg - nadlatuje następna litera.",
  winKid: (clean) => `Z powrotem przy igloo!${clean ? " Bez błędów - patrz, zorza polarna." : ""}`,
  winAdult: () => "Meta osiągnięta.",
};

const WATER_PL: ZoneTextSet = {
  noun: "Kra",
  startText: (isAdult, name) =>
    isAdult ? `Na brzegu. Pierwsza kra: ${name}` : `Na brzegu. Skocz na pierwszą krę: ${name}`,
  introKid: (first, t) =>
    `Pak lodowy! Skacz z kry na krę nad wodą. Naciskaj zawsze klawisz, który jest na następnej krze${t ? " - ale się nie ociągaj, lód już trzeszczy" : ""}. Pierwsza kra: ${first}.`,
  introAdult: (first, t) =>
    `Krótka powtórka: naciskaj za każdym razem klawisz następnej kry${t ? ", zanim zatonie" : ""}. Pierwsza kra: ${first}.`,
  failKid: (back) => `Plusk! Twoja kra zatonęła. Szybko na brzeg i jeszcze raz. Pierwsza kra: ${back}.`,
  failAdult: (back) => `Kra zatonęła - powrót na brzeg. Pierwsza kra: ${back}.`,
  winKid: (clean) => `Hura, udało się!${clean ? " Ani jednego plusku - zorza polarna." : ""}`,
  winAdult: () => "Gotowe.",
};

const ZONE_TEXT_PL: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_PL,
  climb: CLIMB_PL,
  slide: SLIDE_PL,
  storm: STORM_PL,
  station: STATION_PL,
};

// --- Dieselben Texte TÜRKISCH (O-TR, 02.10.2026) ------------------------------------
//
// ★ O-TR (02.10.2026): neu geschrieben, nicht übertragen; sen. Glossar §2.3: Buz Tabakası,
// Buz Duvarı, Yankı Mağarası, Kar Fırtınası, Kutup İstasyonu, Eve Doğru Kayış (Spielorte
// gross als Eigennamen); buz kütlesi, telsiz mesajı, telsizci, mağara yaratığı (spricht
// weiter mit den DEUTSCHEN Aufnahmen), kutup ışıkları, iglo. Keine Endung an einen
// Platzhalter (Regel 6): "İlk basamak: ${name}". Kinder höchstens EIN Ausrufezeichen je
// Meldung, Erwachsene keines. Der Stationsname ("Buz kütlesi 2, toplam 8") steht ohne Endung.
// Grundgesetz §7 unverändert: Höhle und Sturm nennen nie das Zeichen, die Station nie
// das Lösungswort.

const CAVE_TR: ZoneTextSet = {
  noun: "Yankı",
  startText: () => "Mağaranın girişindesin. Her tuşu dikkatle dinle.",
  introKid: () =>
    "Yankı Mağarası! Burası zifiri karanlık - hiçbir karakter görünmüyor. Her tuş karanlıkta bir ses olarak duyulur, ekran okuyucu ya da Braille ekran sana hangisi olduğunu söyler. İyi dinle ve o tuşa bas.",
  introAdult: () =>
    "Yankı Mağarası: klavyeye bakmadan yazma. Hiçbir karakter görünmez - her tuş bir ses olarak duyulur, adı ekran okuyucuya ya da Braille ekrana gider. Duyurulan tuşa bas.",
  failKid: () => "Hoppala, irkildin! Mağaranın girişine dönüyorsun - yeniden dikkatle dinle.",
  failAdult: () => "Mağaranın girişine dönüş. Tuş yeniden duyurulur.",
  winKid: (clean) => `Mağarayı geçtin - yalnızca duyarak!${clean ? " Üstelik hiç hata yapmadan." : ""}`,
  winAdult: () => "Mağara geçildi.",
};

/** ★ O-TR: die türkische Höhle MIT Wesen (Weg "de", {@link hoehleHatWesen}). */
const CAVE_TR_MIT_WESEN: ZoneTextSet = {
  ...CAVE_TR,
  startText: () => "Mağaranın girişindesin. Mağara yaratığını dinle.",
  introKid: () =>
    "Yankı Mağarası! Burası zifiri karanlık - hiçbir karakter görünmüyor. Mağara yaratığı sana her tuşu fısıldar. İyi dinle ve duyduğun tuşa bas.",
  introAdult: () =>
    "Yankı Mağarası: klavyeye bakmadan yazma. Hiçbir karakter görünmez - mağara yaratığı her tuşu duyurur. Duyduğun tuşa bas.",
};

const STORM_TR: ZoneTextSet = {
  noun: "Rüzgâr",
  startText: () => "Kar fırtınasındasın. Karakterleri aklında tut, rüzgâr onları birazdan savuracak.",
  introKid: () =>
    "Kar Fırtınası! Tahtada kısa bir dizi var - onu iyi aklında tut. Sonra rüzgâr onu savurur, sen de diziyi aklından yazarsın. Hazır mısın? İlk diziyi aklında tut.",
  introAdult: () =>
    "Kar Fırtınası: kısa bir diziyi akılda tutmak. Dizi gösterilir ve duyurulur, sonra rüzgâr onu savurur - aklından yaz. Gerekirse duyuru ve tahta yeniden gelir.",
  failKid: () => "Sorun değil, diziyi bir kez daha aklında tut.",
  failAdult: () => "Dizi yeniden gelir.",
  winKid: (clean) => `Kar fırtınasını geçtin - hepsini aklından yazdın!${clean ? " Hatasız." : ""}`,
  winAdult: () => "Kar fırtınası geçildi.",
};

const STATION_TR: ZoneTextSet = {
  noun: "Telsiz mesajı",
  startText: () => "İstasyona geldin. İlk telsiz mesajını çöz.",
  introKid: () =>
    "Kutup İstasyonu! Biraz soluklanma zamanı. Telsizci kelimeler gönderiyor - ama harfler karışmış. Kelimeyi bul ve doğru sırayla yaz. Acele yok, burada hiçbir şey batmaz. Takılırsan Tab tuşu sana bir harf söyler.",
  introAdult: () =>
    "Kutup İstasyonu: harfleri karışmış kelimeleri çözmek. Bir kelimenin harfleri karışık durur - kelimeyi bul ve doğru sırayla yaz. Süre sınırı yok, kaybetmek yok; gerekirse Tab tuşu sıradaki harfi söyler.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Bütün telsiz mesajları çözüldü - aile cevap verdi!${clean ? " Hatasız." : ""}`,
  winAdult: () => "Bütün telsiz mesajları çözüldü.",
};

const CLIMB_TR: ZoneTextSet = {
  noun: "Basamak",
  startText: (_isAdult, name) => `Duvarın dibindesin. İlk basamak: ${name}`,
  introKid: (first, t) =>
    `Buz Duvarı! Harflerden bir dağa tırman. Her basamakta kısa diziyi yaz${t ? " - ama oyalanma, yoksa taşlar ufalanır" : ""}. İlk basamak: ${first}.`,
  introAdult: (first, t) =>
    `Buz Duvarı: her basamakta kısa bir karakter dizisi yaz${t ? ", kaya ufalanmadan önce" : ""}. İlk basamak: ${first}.`,
  failKid: (back) => `Hoppala, kaydın! Neyse ki kar yumuşacık. Son basamağa dönüyorsun: ${back}.`,
  failAdult: (back) => `Kayma: son dinlenme yerine dönüş. Devam: ${back}.`,
  winKid: (clean) => `Başardın, zirvedesin!${clean ? " Bir kez bile kaymadan." : ""}`,
  winAdult: () => "Zirveye ulaşıldı.",
};

const SLIDE_TR: ZoneTextSet = {
  noun: "Kayış",
  startText: (_isAdult, name) => `Yokuşun tepesindesin. İlk harf geliyor: ${name}`,
  introKid: (first, t) =>
    `Eve Doğru Kayış! Karnının üstünde yokuştan aşağı kayıyorsun, harfler sana doğru uçuyor. Her harfe ancak kapının içindeyken bas - parlak seste${t ? ", daha önce değil" : ""}. İlki: ${first}.`,
  introAdult: (first, t) =>
    `Kayış: tek bir harf yaklaşır ve bitiş çizgisine vardığı anda yazılır${t ? " - parlak hedef sesi doğru anı gösterir" : ""}. İlki: ${first}.`,
  failKid: () => "Hoppa, karda yuvarlandın! Bir şey olmadı, devam.",
  failAdult: () => "Karda kayma - sıradaki harf geliyor.",
  winKid: (clean) => `İgloya döndün!${clean ? " Hatasız - bak, kutup ışıkları." : ""}`,
  winAdult: () => "Hedefe ulaşıldı.",
};

const WATER_TR: ZoneTextSet = {
  noun: "Buz kütlesi",
  startText: (isAdult, name) =>
    isAdult ? `Kıyıdasın. İlk buz kütlesi: ${name}` : `Kıyıdasın. İlk buz kütlesine atla: ${name}`,
  introKid: (first, t) =>
    `Buz Tabakası! Suyun üstünde bir buz kütlesinden ötekine atla. Her zaman bir sonraki buz kütlesindeki tuşa bas${t ? " - ama oyalanma, buz çatırdamaya başladı bile" : ""}. İlk buz kütlesi: ${first}.`,
  introAdult: (first, t) =>
    `Kısa tekrar: her seferinde bir sonraki buz kütlesinin tuşuna bas${t ? ", o batmadan önce" : ""}. İlk buz kütlesi: ${first}.`,
  failKid: (back) => `Cup! Buz kütlen battı. Hemen kıyıya dön ve yeniden dene. İlk buz kütlesi: ${back}.`,
  failAdult: (back) => `Buz kütlesi battı - kıyıya dönüş. İlk buz kütlesi: ${back}.`,
  winKid: (clean) => `Yaşasın, başardın!${clean ? " Bir kez bile suya düşmeden - kutup ışıkları." : ""}`,
  winAdult: () => "Tamamlandı.",
};

const ZONE_TEXT_TR: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_TR,
  climb: CLIMB_TR,
  slide: SLIDE_TR,
  storm: STORM_TR,
  station: STATION_TR,
};

// --- Dieselben Texte TSCHECHISCH (O-CS, 03.10.2026) ---------------------------------
//
// ★ O-CS (03.10.2026): neu geschrieben, nicht übertragen; ty. Glossar §2.3: Ledová pole,
// Ledová stěna, Jeskyně ozvěny, Sněhová bouře, Polární stanice, Skluzavka domů; kra,
// zpráva vysílačkou, vysílačka, jeskynní tvor, polární záře, iglú. Nie eine Vergangenheit
// der 2. Person (Geschlecht, Regel 2): Präsens, Zukunft, Sätze über die Sache („Povedlo
// se", „Vrchol zdolán"). Kinder höchstens EIN Ausrufezeichen je Meldung, Erwachsene
// keines. Der Stationsname („Kra 2/8") steht im Nominativ; eine Zeichenfolge heisst
// „skupina znaků" („řada" ist die Tastenreihe). Nach einem Zeichen-Platzhalter am
// Satzende kein Punkt (Falle 4: eine Ziffer mit Punkt liest die Sprachausgabe als
// Ordnungszahl). Grundgesetz §7 unverändert: Höhle und Sturm nennen nie das Zeichen,
// die Station nie das Lösungswort.

const CAVE_CS: ZoneTextSet = {
  noun: "Ozvěna",
  startText: () => "U vchodu do jeskyně. Pozorně poslouchej každou klávesu.",
  introKid: () =>
    "Jeskyně ozvěny! Je tu úplná tma - není vidět žádný znak. Každá klávesa zazní ve tmě jako tón a odečítač obrazovky nebo braillský řádek ti řekne, která to je. Dobře poslouchej a stiskni ji.",
  introAdult: () =>
    "Jeskyně ozvěny: psaní podle sluchu. Žádný znak není vidět - každá klávesa zazní jako tón a její název jde do odečítače obrazovky nebo na braillský řádek. Stiskni ohlášenou klávesu.",
  failKid: () => "Jejda, to byl úlek! Zpátky ke vchodu do jeskyně - poslouchej znovu pozorně.",
  failAdult: () => "Zpět ke vchodu do jeskyně. Klávesa zazní znovu.",
  winKid: (clean) => `Jeskyně je za tebou - jen podle sluchu!${clean ? " A bez jediné chyby." : ""}`,
  winAdult: () => "Jeskyně zdolána.",
};

/** ★ O-CS: die tschechische Höhle MIT Wesen (Weg „de", {@link hoehleHatWesen}). */
const CAVE_CS_MIT_WESEN: ZoneTextSet = {
  ...CAVE_CS,
  startText: () => "U vchodu do jeskyně. Poslouchej jeskynního tvora.",
  introKid: () =>
    "Jeskyně ozvěny! Je tu úplná tma - není vidět žádný znak. Jeskynní tvor ti pošeptá každou klávesu. Dobře poslouchej a stiskni, co slyšíš.",
  introAdult: () =>
    "Jeskyně ozvěny: psaní podle sluchu. Žádný znak není vidět - jeskynní tvor ohlásí každou klávesu. Stiskni, co slyšíš.",
};

const STORM_CS: ZoneTextSet = {
  noun: "Poryv",
  startText: () => "Ve sněhové bouři. Zapamatuj si znaky, než je vítr odvane.",
  introKid: () =>
    "Sněhová bouře! Na tabuli se objeví krátká skupina znaků - dobře si ji zapamatuj. Pak ji vítr odvane a ty ji napíšeš zpaměti. Začínáme: zapamatuj si první skupinu.",
  introAdult: () =>
    "Sněhová bouře: zapamatovat si krátkou skupinu znaků. Skupina se ukáže a ohlásí, pak ji vítr odvane - napiš ji zpaměti. Když je potřeba, hlášení i tabule přijdou znovu.",
  failKid: () => "Nic se neděje, zapamatuj si skupinu ještě jednou.",
  failAdult: () => "Skupina přijde ještě jednou.",
  winKid: (clean) => `Sněhová bouře je za tebou - všechno napsané zpaměti!${clean ? " Bez chyb." : ""}`,
  winAdult: () => "Sněhová bouře zdolána.",
};

const STATION_CS: ZoneTextSet = {
  noun: "Zpráva vysílačkou",
  startText: () => "U polární stanice. Rozlušti první zprávu vysílačkou.",
  introKid: () =>
    "Polární stanice! Čas si oddechnout. Vysílačka posílá slova - ale písmena jsou přeházená. Poznej slovo a napiš ho ve správném pořadí. Bez spěchu, tady se nic nepotopí. Když nevíš dál, klávesa Tabulátor ti prozradí písmeno.",
  introAdult: () =>
    "Polární stanice: luštění přesmyček. Písmena slova jsou přeházená - poznej slovo a napiš ho ve správném pořadí. Bez časového limitu a bez prohry; když je potřeba, klávesa Tabulátor prozradí další písmeno.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Všechny zprávy vysílačkou jsou rozluštěné - rodina odpovídá!${clean ? " Bez chyb." : ""}`,
  winAdult: () => "Všechny zprávy vysílačkou jsou rozluštěné.",
};

const CLIMB_CS: ZoneTextSet = {
  noun: "Chyt",
  startText: (_isAdult, name) => `Pod stěnou. První chyt: ${name}`,
  introKid: (first, t) =>
    `Ledová stěna! Vylez nahoru po hoře z písmen. Na každém chytu napiš krátkou skupinu znaků${t ? " - ale nezdržuj se, jinak se kameny začnou drolit" : ""}. První chyt: ${first}`,
  introAdult: (first, t) =>
    `Ledová stěna: na každém chytu napiš krátkou skupinu znaků${t ? ", než se skála rozdrolí" : ""}. První chyt: ${first}`,
  failKid: (back) => `Jejda, uklouznutí! Měkké přistání ve sněhu. Zpátky na poslední chyt: ${back}`,
  failAdult: (back) => `Uklouznutí: zpět k poslednímu odpočívadlu. Pokračuje se od: ${back}`,
  winKid: (clean) => `Povedlo se, vrchol je tvůj!${clean ? " Ani jedno uklouznutí." : ""}`,
  winAdult: () => "Vrchol zdolán.",
};

const SLIDE_CS: ZoneTextSet = {
  noun: "Skluz",
  startText: (_isAdult, name) => `Nahoře na svahu. Přilétá první písmeno: ${name}`,
  introKid: (first, t) =>
    `Skluzavka domů! Kloužeš po bříšku dolů ze svahu a písmena ti letí naproti. Každé stiskni, až když je v bráně - při jasném tónu${t ? ", ne dřív" : ""}. První: ${first}`,
  introAdult: (first, t) =>
    `Skluzavka: přiletí jedno písmeno a napíšeš ho ve chvíli, kdy dorazí do cíle${t ? " - jasný cílový tón ukáže správný okamžik" : ""}. První: ${first}`,
  failKid: () => "Bum, kotrmelec do sněhu! Nic se nestalo, jede se dál.",
  failAdult: () => "Pád do sněhu - přilétá další písmeno.",
  winKid: (clean) => `Zpátky u iglú!${clean ? " Bez chyb - podívej, polární záře." : ""}`,
  winAdult: () => "Cíl je tady.",
};

const WATER_CS: ZoneTextSet = {
  noun: "Kra",
  startText: (isAdult, name) =>
    isAdult ? `Na břehu. První kra: ${name}` : `Na břehu. Skoč na první kru: ${name}`,
  introKid: (first, t) =>
    `Ledová pole! Skákej z kry na kru přes vodu. Vždycky stiskni klávesu, která je na další kře${t ? " - ale nezdržuj se, led už praská" : ""}. První kra: ${first}`,
  introAdult: (first, t) =>
    `Krátké opakování: pokaždé stiskni klávesu další kry${t ? ", než se potopí" : ""}. První kra: ${first}`,
  failKid: (back) => `Šplouch! Kra se potopila. Rychle zpátky na břeh a znovu. První kra: ${back}`,
  failAdult: (back) => `Kra se potopila - zpět na břeh. První kra: ${back}`,
  winKid: (clean) => `Hurá, povedlo se!${clean ? " Ani jedno šplouchnutí - polární záře." : ""}`,
  winAdult: () => "Hotovo.",
};

const ZONE_TEXT_CS: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_CS,
  climb: CLIMB_CS,
  slide: SLIDE_CS,
  storm: STORM_CS,
  station: STATION_CS,
};

/**
 * ★ O2-LIB (29.10.2026): die Erzählung der Expedition bulgarisch, ти. Keine Vergangenheit der
 * 2. Person (Geschlecht): Präsens, Aorist ohne Partizip, Sätze über die Sache. Nach einem
 * Platzhalter am Satzende kein Punkt (eine Ziffer mit Punkt liest die Sprachausgabe als Ordnungszahl).
 */
const WATER_BG: ZoneTextSet = {
  noun: "Леден къс",
  startText: (isAdult, name) =>
    isAdult ? `На брега. Първи леден къс: ${name}` : `На брега. Скочи на първия леден къс: ${name}`,
  introKid: (first, t) =>
    `Ледено поле! Скачай от къс на къс през водата. Винаги натискай клавиша на следващия къс${t ? " - но не се бави, ледът вече пука" : ""}. Първи леден къс: ${first}`,
  introAdult: (first, t) =>
    `Кратко припомняне: всеки път натискай клавиша на следващия леден къс${t ? ", преди да е потънал" : ""}. Първи леден къс: ${first}`,
  failKid: (back) => `Плисък! Късът потъна. Бързо обратно на брега и опитай пак. Първи леден къс: ${back}`,
  failAdult: (back) => `Късът потъна - обратно на брега. Първи леден къс: ${back}`,
  winKid: (clean) => `Ура, успя!${clean ? " Нито един плисък - полярно сияние." : ""}`,
  winAdult: () => "Готово.",
};

const CLIMB_BG: ZoneTextSet = {
  noun: "Опора",
  startText: (_isAdult, name) => `Под стената. Първа опора: ${name}`,
  introKid: (first, t) =>
    `Ледена стена! Изкачи планината от букви. На всяка опора напиши кратка група от знаци${t ? " - но не се бави, иначе камъните започват да се ронят" : ""}. Първа опора: ${first}`,
  introAdult: (first, t) =>
    `Ледена стена: на всяка опора напиши кратка група от знаци${t ? ", преди скалата да се разруши" : ""}. Първа опора: ${first}`,
  failKid: (back) => `Опа, подхлъзване! Меко приземяване в снега. Обратно към последната опора: ${back}`,
  failAdult: (back) => `Подхлъзване: обратно към последното място за почивка. Продължава се от: ${back}`,
  winKid: (clean) => `Успя, върхът е твой!${clean ? " Нито едно подхлъзване." : ""}`,
  winAdult: () => "Върхът е покорен.",
};

const SLIDE_BG: ZoneTextSet = {
  noun: "Плъзване",
  startText: (_isAdult, name) => `Горе на склона. Идва първата буква: ${name}`,
  introKid: (first, t) =>
    `Пързалка към дома! Спускаш се по корем по склона и буквите летят към теб. Натискай всяка чак когато е във вратата - при ясния звук${t ? ", не по-рано" : ""}. Първа: ${first}`,
  introAdult: (first, t) =>
    `Пързалката: към теб лети една буква и я пишеш в момента, в който стигне финала${t ? " - ясният звук на целта показва точния момент" : ""}. Първа: ${first}`,
  failKid: () => "Бум, премятане в снега! Нищо не е станало, продължаваме.",
  failAdult: () => "Падане в снега - идва следващата буква.",
  winKid: (clean) => `Обратно при иглуто!${clean ? " Без грешки - виж, полярно сияние." : ""}`,
  winAdult: () => "Финалът е достигнат.",
};

const STORM_BG: ZoneTextSet = {
  noun: "Порив",
  startText: () => "В снежната буря. Запомни знаците, преди вятърът да ги отнесе.",
  introKid: () =>
    "Снежна буря! На таблото се появява кратка група от знаци - запомни я добре. После вятърът я отнася и ти я пишеш по памет. Започваме: запомни първата група.",
  introAdult: () =>
    "Снежна буря: запомняне на кратка група от знаци. Тя се показва и се обявява, после вятърът я отнася - напиши я по памет. При нужда обявяването и таблото се връщат.",
  failKid: () => "Няма проблем, запомни групата още веднъж.",
  failAdult: () => "Групата ще се върне.",
  winKid: (clean) => `Бурята е зад теб - всичко е написано по памет!${clean ? " Без грешки." : ""}`,
  winAdult: () => "Бурята е преодоляна.",
};

const STATION_BG: ZoneTextSet = {
  noun: "Радиосъобщение",
  startText: () => "При полярната станция. Разгадай първото радиосъобщение.",
  introKid: () =>
    "Полярна станция! Време за почивка. Радиостанцията праща думи, но буквите са разбъркани. Познай думата и я напиши в правилния ред. Без бързане, тук нищо не потъва. Ако не знаеш как да продължиш, клавишът Tab ти подсказва буква.",
  introAdult: () =>
    "Полярна станция: разгадаване на разбъркани букви. Буквите на думата са разбъркани - познай думата и я напиши в правилния ред. Без ограничение във времето и без загуба; при нужда клавишът Tab показва следващата буква.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Всички радиосъобщения са разгадани - семейството отговаря!${clean ? " Без грешки." : ""}`,
  winAdult: () => "Всички радиосъобщения са разгадани.",
};

const ZONE_TEXT_BG: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_BG,
  climb: CLIMB_BG,
  slide: SLIDE_BG,
  storm: STORM_BG,
  station: STATION_BG,
};

const WATER_EL: ZoneTextSet = {
  noun: "Παγοκομμάτι",
  startText: (isAdult, name) =>
    isAdult ? `Στην ακτή. Πρώτο παγοκομμάτι: ${name}` : `Στην ακτή. Πήδηξε στο πρώτο παγοκομμάτι: ${name}`,
  introKid: (first, t) =>
    `Ο παγωμένος ωκεανός! Πήδα από παγοκομμάτι σε παγοκομμάτι πάνω από το νερό. Πάτησε πάντα το πλήκτρο που βρίσκεται στο επόμενο παγοκομμάτι${t ? " - αλλά μην καθυστερείς, ο πάγος ήδη ραγίζει" : ""}. Πρώτο παγοκομμάτι: ${first}`,
  introAdult: (first, t) =>
    `Σύντομη υπενθύμιση: κάθε φορά πάτησε το πλήκτρο του επόμενου παγοκομματιού${t ? ", πριν βυθιστεί" : ""}. Πρώτο παγοκομμάτι: ${first}`,
  failKid: (back) => `Πλατς, το παγοκομμάτι βυθίστηκε. Γρήγορα πίσω στην ακτή και ξανά από την αρχή. Πρώτο παγοκομμάτι: ${back}`,
  failAdult: (back) => `Το παγοκομμάτι βυθίστηκε - πίσω στην ακτή. Πρώτο παγοκομμάτι: ${back}`,
  winKid: (clean) => `Ζήτω, τα κατάφερες!${clean ? " Ούτε ένα πλατς - δες το πολικό σέλας." : ""}`,
  winAdult: () => "Ολοκληρώθηκε.",
};

const CLIMB_EL: ZoneTextSet = {
  noun: "Στήριγμα",
  startText: (_isAdult, name) => `Στους πρόποδες του γκρεμού. Πρώτο στήριγμα: ${name}`,
  introKid: (first, t) =>
    `Ο παγωμένος γκρεμός! Σκαρφάλωσε στο βουνό από γράμματα. Σε κάθε στήριγμα γράψε τη σύντομη ομάδα χαρακτήρων${t ? " - αλλά μην καθυστερείς, αλλιώς οι πέτρες αρχίζουν να θρυμματίζονται" : ""}. Πρώτο στήριγμα: ${first}`,
  introAdult: (first, t) =>
    `Ο παγωμένος γκρεμός: σε κάθε στήριγμα γράψε μια σύντομη ομάδα χαρακτήρων${t ? ", πριν θρυμματιστεί ο βράχος" : ""}. Πρώτο στήριγμα: ${first}`,
  failKid: (back) => `Ωχ, γλίστρησες! Μαλακή προσγείωση στο χιόνι. Πίσω στο τελευταίο στήριγμα: ${back}`,
  failAdult: (back) => `Γλίστρημα: πίσω στο τελευταίο σημείο ξεκούρασης. Συνέχεια από: ${back}`,
  winKid: (clean) => `Τα κατάφερες, η κορυφή είναι δική σου!${clean ? " Ούτε ένα γλίστρημα." : ""}`,
  winAdult: () => "Η κορυφή κατακτήθηκε.",
};

const SLIDE_EL: ZoneTextSet = {
  noun: "Γλίστρημα",
  startText: (_isAdult, name) => `Στην κορυφή της πλαγιάς. Έρχεται το πρώτο γράμμα: ${name}`,
  introKid: (first, t) =>
    `Η τσουλήθρα για το σπίτι! Γλιστράς με την κοιλιά στην πλαγιά και τα γράμματα έρχονται καταπάνω σου. Πάτησε το καθένα μόνο όταν βρίσκεται στην πύλη - στον φωτεινό ήχο${t ? ", όχι νωρίτερα" : ""}. Πρώτο: ${first}`,
  introAdult: (first, t) =>
    `Η τσουλήθρα: ένα γράμμα έρχεται προς το μέρος σου και το γράφεις τη στιγμή που φτάνει στον τερματισμό${t ? " - ο φωτεινός ήχος στόχου δείχνει τη σωστή στιγμή" : ""}. Πρώτο: ${first}`,
  failKid: () => "Μπαμ, τούμπα στο χιόνι! Δεν έγινε τίποτα, συνεχίζουμε.",
  failAdult: () => "Πτώση στο χιόνι - έρχεται το επόμενο γράμμα.",
  winKid: (clean) => `Πίσω στο ιγκλού!${clean ? " Χωρίς λάθη - δες το πολικό σέλας." : ""}`,
  winAdult: () => "Έφτασες στον τερματισμό.",
};

const STORM_EL: ZoneTextSet = {
  noun: "Ριπή",
  startText: () => "Στη χιονοθύελλα. Θυμήσου τους χαρακτήρες πριν τους πάρει ο άνεμος.",
  introKid: () =>
    "Η χιονοθύελλα! Στον πίνακα εμφανίζεται μια σύντομη ομάδα χαρακτήρων - θυμήσου την καλά. Μετά την παίρνει ο άνεμος και εσύ τη γράφεις από μνήμης. Ξεκινάμε: θυμήσου την πρώτη ομάδα.",
  introAdult: () =>
    "Η χιονοθύελλα: απομνημόνευση μιας σύντομης ομάδας χαρακτήρων. Εμφανίζεται και εκφωνείται, μετά την παίρνει ο άνεμος - γράψε την από μνήμης. Αν χρειαστεί, η εκφώνηση και ο πίνακας επανέρχονται.",
  failKid: () => "Δεν πειράζει, θυμήσου την ομάδα ακόμη μία φορά.",
  failAdult: () => "Η ομάδα θα εμφανιστεί ξανά.",
  winKid: (clean) => `Πέρασες τη χιονοθύελλα - όλα γραμμένα από μνήμης!${clean ? " Χωρίς λάθη." : ""}`,
  winAdult: () => "Η χιονοθύελλα ξεπεράστηκε.",
};

const STATION_EL: ZoneTextSet = {
  noun: "Μήνυμα ασυρμάτου",
  startText: () => "Στον πολικό σταθμό. Αποκρυπτογράφησε το πρώτο μήνυμα ασυρμάτου.",
  introKid: () =>
    "Ο πολικός σταθμός! Ώρα να πάρεις ανάσα. Ο ασύρματος στέλνει λέξεις - αλλά τα γράμματα είναι ανακατεμένα. Βρες τη λέξη και γράψε την με τη σωστή σειρά. Χωρίς βιασύνη, εδώ τίποτα δεν βυθίζεται. Αν κολλήσεις, το πλήκτρο Tab σου δίνει ένα γράμμα.",
  introAdult: () =>
    "Ο πολικός σταθμός: ανακατεμένα γράμματα. Τα γράμματα μιας λέξης είναι ανακατεμένα - βρες τη λέξη και γράψε την με τη σωστή σειρά. Χωρίς χρονικό όριο και χωρίς αποτυχία. Αν χρειαστεί, το πλήκτρο Tab αποκαλύπτει το επόμενο γράμμα.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Όλα τα μηνύματα ασυρμάτου αποκρυπτογραφήθηκαν - η οικογένεια απαντά!${clean ? " Χωρίς λάθη." : ""}`,
  winAdult: () => "Όλα τα μηνύματα ασυρμάτου αποκρυπτογραφήθηκαν.",
};

const ZONE_TEXT_EL: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_EL,
  climb: CLIMB_EL,
  slide: SLIDE_EL,
  storm: STORM_EL,
  station: STATION_EL,
};

const WATER_HU: ZoneTextSet = {
  noun: "Jégtábla",
  startText: (isAdult, name) =>
    isAdult ? `A parton. Az első jégtábla: ${name}` : `A parton. Ugorj az első jégtáblára: ${name}`,
  introKid: (first, t) =>
    `Jégmező! Ugorj jégtábláról jégtáblára a vízen át. Mindig azt a billentyűt nyomd meg, amelyik a következő jégtáblán van${t ? " - de ne időzz, a jég már reped" : ""}. Első jégtábla: ${first}`,
  introAdult: (first, t) =>
    `Gyors ismétlés: mindig a következő jégtábla billentyűjét nyomd meg${t ? ", mielőtt elsüllyed" : ""}. Első jégtábla: ${first}`,
  failKid: (back) => `Placcs! A jégtábla elsüllyedt. Gyorsan vissza a partra, és újra. Első jégtábla: ${back}`,
  failAdult: (back) => `A jégtábla elsüllyedt - vissza a partra. Első jégtábla: ${back}`,
  winKid: (clean) => `Hurrá, sikerült!${clean ? " Egyetlen placcsolás sem - sarki fény." : ""}`,
  winAdult: () => "Kész.",
};

const CLIMB_HU: ZoneTextSet = {
  noun: "Kapaszkodó",
  startText: (_isAdult, name) => `A jégfal lábánál. Első kapaszkodó: ${name}`,
  introKid: (first, t) =>
    `Jégfal! Mássz fel a betűk hegyén. Minden kapaszkodónál írd be a rövid jelcsoportot${t ? " - de ne időzz, különben a kövek morzsolódni kezdenek" : ""}. Első kapaszkodó: ${first}`,
  introAdult: (first, t) =>
    `Jégfal: minden kapaszkodónál írj be egy rövid jelcsoportot${t ? ", mielőtt a szikla összeomlik" : ""}. Első kapaszkodó: ${first}`,
  failKid: (back) => `Hoppá, megcsúsztál! Puha landolás a hóban. Vissza az utolsó kapaszkodóhoz: ${back}`,
  failAdult: (back) => `Megcsúszás: vissza az utolsó pihenőhöz. Folytatás innen: ${back}`,
  winKid: (clean) => `Sikerült, fent vagy a csúcson!${clean ? " Egyetlen megcsúszás sem." : ""}`,
  winAdult: () => "A csúcs elérve.",
};

const SLIDE_HU: ZoneTextSet = {
  noun: "Csúszás",
  startText: (_isAdult, name) => `A lejtő tetején. Érkezik az első betű: ${name}`,
  introKid: (first, t) =>
    `Hasoncsúszás haza! Hason csúszol lefelé a lejtőn, a betűk pedig szembe repülnek veled. Mindegyiket csak akkor nyomd meg, amikor a kapuban van - a világos hangnál${t ? ", nem előbb" : ""}. Az első: ${first}`,
  introAdult: (first, t) =>
    `Hasoncsúszás: egy betű repül feléd, és abban a pillanatban írod be, amikor a célba ér${t ? " - a világos célhang jelzi a helyes pillanatot" : ""}. Az első: ${first}`,
  failKid: () => "Huss, belebucskáztál a hóba! Semmi baj, megy tovább a játék.",
  failAdult: () => "Esés a hóba - jön a következő betű.",
  winKid: (clean) => `Megérkeztél az iglunál!${clean ? " Hiba nélkül - nézd, a sarki fény." : ""}`,
  winAdult: () => "A cél elérve.",
};

const STORM_HU: ZoneTextSet = {
  noun: "Széllökés",
  startText: () => "A hóviharban. Jegyezd meg a jeleket, mielőtt a szél elfújja őket.",
  introKid: () =>
    "Hóvihar! A táblán megjelenik egy rövid jelcsoport - jól jegyezd meg. Aztán a szél elfújja, te pedig emlékezetből írod be. Kezdjük: jegyezd meg az első jelcsoportot.",
  introAdult: () =>
    "Hóvihar: egy rövid jelcsoportot kell megjegyezni. Megjelenik és elhangzik, aztán a szél elfújja - írd be emlékezetből. Ha kell, a bemondás és a tábla újra jön.",
  failKid: () => "Semmi baj, jegyezd meg még egyszer a jelcsoportot.",
  failAdult: () => "A jelcsoport még egyszer jön.",
  winKid: (clean) => `Átjutottál a hóviharon - mind emlékezetből!${clean ? " Hiba nélkül." : ""}`,
  winAdult: () => "A hóvihar leküzdve.",
};

const STATION_HU: ZoneTextSet = {
  noun: "Rádióüzenet",
  startText: () => "A sarki állomáson. Fejtsd meg az első rádióüzenetet.",
  introKid: () =>
    "Sarki állomás! Ideje kifújni magad. A rádiós szavakat küld - de a betűk összekeveredtek. Találd ki a szót, és írd be a helyes sorrendben. Semmi sietség, itt semmi sem süllyed el. Ha elakadsz, a Tab billentyű elárul egy betűt.",
  introAdult: () =>
    "Sarki állomás: betűkeverékek megfejtése. A szó betűi összekeveredtek - találd ki a szót, és írd be a helyes sorrendben. Időkorlát és kudarc nélkül; ha kell, a Tab billentyű elárulja a következő betűt.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Minden rádióüzenet megfejtve - a család válaszol!${clean ? " Hiba nélkül." : ""}`,
  winAdult: () => "Minden rádióüzenet megfejtve.",
};

/** ★ O2-LIB (29.10.2026): die Zonentexte der Expedition, Ungarisch (te; Glossar §2.3). */
const ZONE_TEXT_HU: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_HU,
  climb: CLIMB_HU,
  slide: SLIDE_HU,
  storm: STORM_HU,
  station: STATION_HU,
};

/** ★ O2-LIB (29.10.2026): die Expedition niederländisch - Glossar nl §2.3 (Het pakijs, De ijswand, De echogrot, De sneeuwstorm, Het poolstation, De buikglijbaan naar huis); je-Vorm, Präsens, nie über das Kind. */
const WATER_NL: ZoneTextSet = {
  noun: "IJsschots",
  startText: (isAdult, name) =>
    isAdult ? `Aan de kust. Eerste ijsschots: ${name}` : `Aan de kust. Spring op de eerste ijsschots: ${name}`,
  introKid: (first, t) =>
    `Het pakijs! Spring van ijsschots naar ijsschots over het water. Druk steeds op de toets van de volgende ijsschots${t ? " - maar treuzel niet, het ijs kraakt al" : ""}! Eerste ijsschots: ${first}.`,
  introAdult: (first, t) =>
    `Even herhalen: druk steeds op de toets van de volgende ijsschots${t ? ", voordat die zinkt" : ""}. Eerste ijsschots: ${first}.`,
  failKid: (back) => `Plons! De ijsschots is gezonken. Snel terug naar de kust en probeer het nog eens! Eerste ijsschots: ${back}.`,
  failAdult: (back) => `De ijsschots is gezonken - terug naar de kust. Eerste ijsschots: ${back}.`,
  winKid: (clean) => `Hoera, gelukt!${clean ? " Geen enkele plons - poollicht!" : ""}`,
  winAdult: () => "Klaar.",
};

const CLIMB_NL: ZoneTextSet = {
  noun: "Houvast",
  startText: (_isAdult, name) => `Aan de voet van de ijswand. Eerste houvast: ${name}`,
  introKid: (first, t) =>
    `De ijswand! Klim omhoog over de berg van letters. Typ bij elk houvast de korte reeks tekens${t ? " - maar treuzel niet, anders gaan de rotsen brokkelen" : ""}. Eerste houvast: ${first}.`,
  introAdult: (first, t) =>
    `De ijswand: typ bij elk houvast een korte reeks tekens${t ? " voordat de rots brokkelt" : ""}. Eerste houvast: ${first}.`,
  failKid: (back) => `Oeps, uitgegleden! Zacht landen in de sneeuw. Terug naar het vorige houvast: ${back}.`,
  failAdult: (back) => `Uitgegleden: terug naar de laatste rustplek. Ga verder met: ${back}.`,
  winKid: (clean) => `Gelukt, helemaal tot de top!${clean ? " Geen enkele uitglijder!" : ""}`,
  winAdult: () => "Top bereikt.",
};

const SLIDE_NL: ZoneTextSet = {
  noun: "Glijpartij",
  startText: (_isAdult, name) => `Boven aan de helling. Daar komt de eerste letter: ${name}`,
  introKid: (first, t) =>
    `De buikglijbaan naar huis! Je glijdt op je buik van de helling en de letters vliegen op je af. Druk pas op een letter als die in de poort is - bij de heldere toon${t ? ", niet eerder" : ""}! De eerste: ${first}.`,
  introAdult: (first, t) =>
    `De buikglijbaan: één letter vliegt op je af en je typt die op het moment dat hij de finish bereikt${t ? " - de heldere doeltoon geeft het juiste moment aan" : ""}. De eerste: ${first}.`,
  failKid: () => "Woesj, je rolt in de sneeuw! Geen nood - op naar de volgende.",
  failAdult: () => "In de sneeuw gegleden - de volgende letter komt eraan.",
  winKid: (clean) => `Thuis bij de iglo!${clean ? " Geen fouten! Kijk, het poollicht!" : ""}`,
  winAdult: () => "De finish is bereikt.",
};

const STORM_NL: ZoneTextSet = {
  noun: "Windvlaag",
  startText: () => "In de sneeuwstorm. Onthoud de tekens voordat ze wegwaaien!",
  introKid: () =>
    "De sneeuwstorm! Op het bord verschijnt een korte reeks tekens - onthoud die goed. Dan waait de wind ze weg en typ je ze uit je hoofd. Klaar? Onthoud de eerste reeks!",
  introAdult: () =>
    "De sneeuwstorm: onthoud een korte reeks tekens. De reeks wordt getoond en uitgesproken, waait dan weg - typ hem uit het hoofd. Zo nodig komen de aankondiging en het bord opnieuw.",
  failKid: () => "Geen probleem - onthoud de reeks nog een keer.",
  failAdult: () => "De reeks komt opnieuw.",
  winKid: (clean) => `Dwars door de sneeuwstorm, alles uit het hoofd getypt!${clean ? " Zonder fouten!" : ""}`,
  winAdult: () => "Door de sneeuwstorm.",
};

const STATION_NL: ZoneTextSet = {
  noun: "Radiobericht",
  startText: () => "Bij het poolstation. Ontcijfer het eerste radiobericht!",
  introKid: () =>
    "Het poolstation! Tijd om even bij te komen. De radio-operator stuurt woorden - maar de letters staan door elkaar. Bedenk welk woord het is en typ het in de goede volgorde. Geen haast, hier zinkt niets! Kom je er niet uit, dan geeft de toets Tab je een letter.",
  introAdult: () =>
    "Het poolstation: letterpuzzels oplossen. De letters van een woord staan door elkaar - bedenk welk woord het is en typ het in de goede volgorde. Geen tijdsdruk en niemand valt af; de toets Tab onthult zo nodig de volgende letter.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Alle radioberichten zijn ontcijferd - de familie antwoordt!${clean ? " Zonder fouten!" : ""}`,
  winAdult: () => "Alle radioberichten zijn ontcijferd.",
};

const ZONE_TEXT_NL: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_NL,
  climb: CLIMB_NL,
  slide: SLIDE_NL,
  storm: STORM_NL,
  station: STATION_NL,
};

/**
 * ★ O-LIB (30.10.2026): a narrativa da expedição em português (Portugal), tu. Glossar §2.3: A Banquisa,
 * A Parede de Gelo, A Gruta do Eco, A Tempestade de Neve, A Estação Polar, O Escorrega para Casa; bloco de
 * gelo, mensagem de rádio, criatura da gruta, aurora polar, iglu. Nunca um adjetivo ou particípio no
 * Kind (Geschlecht): Präsens, Imperativ, Sätze über die Sache. Nach einem Zeichen-Platzhalter am Satzende
 * kein Punkt (eine Ziffer mit Punkt liest die Sprachausgabe als Ordnungszahl). Grundgesetz §7: Höhle und
 * Sturm nennen nie das Zeichen, die Station nie das Lösungswort.
 */
const WATER_PT: ZoneTextSet = {
  noun: "Bloco de gelo",
  startText: (isAdult, name) =>
    isAdult ? `Na margem. Primeiro bloco de gelo: ${name}` : `Na margem. Salta para o primeiro bloco de gelo: ${name}`,
  introKid: (first, t) =>
    `A Banquisa! Salta de bloco em bloco por cima da água. Prime sempre a tecla que está no bloco seguinte${t ? " - mas não demores, o gelo já está a estalar" : ""}. Primeiro bloco: ${first}`,
  introAdult: (first, t) =>
    `Uma breve recapitulação: prime sempre a tecla do bloco seguinte${t ? ", antes que se afunde" : ""}. Primeiro bloco: ${first}`,
  failKid: (back) => `Chape! O bloco de gelo afundou-se. Depressa, de volta à margem e tenta outra vez. Primeiro bloco: ${back}`,
  failAdult: (back) => `O bloco de gelo afundou-se - de volta à margem. Primeiro bloco: ${back}`,
  winKid: (clean) => `Hurra, conseguiste!${clean ? " Nem um único chape - aurora polar!" : ""}`,
  winAdult: () => "Concluído.",
};

const CLIMB_PT: ZoneTextSet = {
  noun: "Apoio",
  startText: (_isAdult, name) => `Ao pé da parede. Primeiro apoio: ${name}`,
  introKid: (first, t) =>
    `A Parede de Gelo! Sobe a montanha de letras. Em cada apoio, escreve a pequena sequência de carateres${t ? " - mas não demores, senão as pedras começam a desfazer-se" : ""}. Primeiro apoio: ${first}`,
  introAdult: (first, t) =>
    `A Parede de Gelo: em cada apoio, escreve uma pequena sequência de carateres${t ? " antes que a rocha se desfaça" : ""}. Primeiro apoio: ${first}`,
  failKid: (back) => `Ups, escorregaste! Aterragem suave na neve. De volta ao último apoio: ${back}`,
  failAdult: (back) => `Escorregadela: de volta ao último ponto de descanso. Continua em: ${back}`,
  winKid: (clean) => `Conseguiste, chegaste ao cimo!${clean ? " Sem uma única escorregadela!" : ""}`,
  winAdult: () => "Cume alcançado.",
};

const SLIDE_PT: ZoneTextSet = {
  noun: "Deslize",
  startText: (_isAdult, name) => `No alto da encosta. Aí vem a primeira letra: ${name}`,
  introKid: (first, t) =>
    `O Escorrega para Casa! Deslizas de barriga pela encosta abaixo e as letras voam ao teu encontro. Prime cada uma só quando estiver no portão - no momento do som claro${t ? ", não antes" : ""}. A primeira: ${first}`,
  introAdult: (first, t) =>
    `O Escorrega: uma única letra voa ao teu encontro e escreve-se no instante em que chega à meta${t ? " - o som claro do alvo marca o momento certo" : ""}. A primeira: ${first}`,
  failKid: () => "Bum, caíste na neve! Não foi nada - lá vais tu outra vez.",
  failAdult: () => "Queda na neve - vem aí a próxima letra.",
  winKid: (clean) => `Em casa, junto ao iglu!${clean ? " Sem erros! Olha, a aurora polar!" : ""}`,
  winAdult: () => "Chegada à meta.",
};

const STORM_PT: ZoneTextSet = {
  noun: "Rajada",
  startText: () => "Na tempestade de neve. Memoriza os carateres antes que o vento os leve!",
  introKid: () =>
    "A Tempestade de Neve! Aparece no quadro uma pequena sequência de carateres - memoriza-a bem. Depois o vento leva-a e escreves de memória. Tudo pronto? Memoriza a primeira sequência!",
  introAdult: () =>
    "A Tempestade de Neve: memorizar uma pequena sequência de carateres. É mostrada e anunciada, depois o vento leva-a - escreve-a de memória. Se for preciso, o anúncio e o quadro voltam.",
  failKid: () => "Não faz mal - memoriza a sequência mais uma vez.",
  failAdult: () => "A sequência volta a aparecer.",
  winKid: (clean) => `Tempestade atravessada, tudo escrito de memória!${clean ? " Sem erros!" : ""}`,
  winAdult: () => "Tempestade atravessada.",
};

const STATION_PT: ZoneTextSet = {
  noun: "Mensagem de rádio",
  startText: () => "Na Estação Polar. Decifra a primeira mensagem de rádio!",
  introKid: () =>
    "A Estação Polar! É hora de respirar fundo. O rádio envia palavras - mas as letras vêm todas misturadas. Descobre a palavra e escreve-a pela ordem certa. Sem pressa, aqui nada se afunda! Se não souberes continuar, a tecla de tabulação dá-te uma letra.",
  introAdult: () =>
    "A Estação Polar: resolver anagramas. As letras de uma palavra estão misturadas - descobre a palavra e escreve-a pela ordem certa. Sem limite de tempo e sem falhar; se for preciso, a tecla de tabulação revela a letra seguinte.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Todas as mensagens de rádio decifradas - a família respondeu!${clean ? " Sem erros!" : ""}`,
  winAdult: () => "Todas as mensagens de rádio decifradas.",
};

const ZONE_TEXT_PT: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_PT,
  climb: CLIMB_PT,
  slide: SLIDE_PT,
  storm: STORM_PT,
  station: STATION_PT,
};

/**
 * ★ O2-LIB (29.10.2026): die Zonentexte der Expedition, Portugiesisch (Brasilien) - você.
 * Glossar: O campo de gelo, O paredão de gelo, A nevasca, A estação polar, Escorregando para
 * casa; placa, apoio, mensagem de rádio, aurora polar. Kein Geschlecht (Partizip nie am Kind),
 * Kinder höchstens ein Ausrufezeichen je Meldung, nach einem Zeichen-Platzhalter am Satzende
 * kein Punkt (eine Ziffer mit Punkt liest die Sprachausgabe als Ordnungszahl).
 */
const WATER_BR: ZoneTextSet = {
  noun: "Placa",
  startText: (isAdult, name) =>
    isAdult ? `Na margem. Primeira placa: ${name}` : `Na margem. Pule para a primeira placa: ${name}`,
  introKid: (first, t) =>
    `O campo de gelo! Pule de placa em placa por cima da água. Pressione sempre a tecla que está na próxima placa${t ? " - mas sem demora, o gelo já está rachando" : ""}. Primeira placa: ${first}`,
  introAdult: (first, t) =>
    `Uma revisão rápida: pressione sempre a tecla da próxima placa${t ? ", antes que ela afunde" : ""}. Primeira placa: ${first}`,
  failKid: (back) => `Splash! A placa afundou. Rápido, de volta à margem para tentar de novo. Primeira placa: ${back}`,
  failAdult: (back) => `A placa afundou - de volta à margem. Primeira placa: ${back}`,
  winKid: (clean) => `Oba, deu certo!${clean ? " Nenhum splash - aurora polar." : ""}`,
  winAdult: () => "Concluído.",
};

const CLIMB_BR: ZoneTextSet = {
  noun: "Apoio",
  startText: (_isAdult, name) => `Ao pé do paredão. Primeiro apoio: ${name}`,
  introKid: (first, t) =>
    `O paredão de gelo! Suba a montanha de letras. Em cada apoio, digite a sequência curta de caracteres${t ? " - mas sem demora, senão as pedras começam a se soltar" : ""}. Primeiro apoio: ${first}`,
  introAdult: (first, t) =>
    `O paredão de gelo: em cada apoio, digite uma sequência curta de caracteres${t ? " antes que a rocha se solte" : ""}. Primeiro apoio: ${first}`,
  failKid: (back) => `Opa, escorregou! Pouso macio na neve. De volta ao último apoio: ${back}`,
  failAdult: (back) => `Escorregada: de volta ao último ponto de descanso. Continue por: ${back}`,
  winKid: (clean) => `Deu certo, o topo é seu!${clean ? " Nenhuma escorregada." : ""}`,
  winAdult: () => "Topo alcançado.",
};

const SLIDE_BR: ZoneTextSet = {
  noun: "Deslize",
  startText: (_isAdult, name) => `No alto da ladeira. Vem vindo a primeira letra: ${name}`,
  introKid: (first, t) =>
    `Escorregando para casa! Você desce a ladeira de barriga e as letras voam na sua direção. Pressione cada uma só quando ela estiver no portão - no som claro${t ? ", não antes" : ""}. A primeira: ${first}`,
  introAdult: (first, t) =>
    `Escorregando para casa: uma letra voa na sua direção e é digitada no momento em que chega à linha de chegada${t ? " - o som claro do alvo marca a hora certa" : ""}. A primeira: ${first}`,
  failKid: () => "Ops, rolou na neve! Não foi nada, vamos de novo.",
  failAdult: () => "Caiu na neve - vem vindo a próxima letra.",
  winKid: (clean) => `Em casa, no iglu!${clean ? " Sem erros - olhe a aurora polar." : ""}`,
  winAdult: () => "Linha de chegada alcançada.",
};

const STORM_BR: ZoneTextSet = {
  noun: "Rajada",
  startText: () => "Na nevasca. Memorize os caracteres antes que o vento os leve.",
  introKid: () =>
    "A nevasca! Uma sequência curta aparece no quadro - memorize bem. Depois o vento a leva, e você digita de memória. Vamos lá: memorize a primeira sequência.",
  introAdult: () =>
    "A nevasca: memorizar uma sequência curta de caracteres. Ela é mostrada e anunciada, depois o vento a leva - digite de memória. Se for preciso, o anúncio e o quadro voltam.",
  failKid: () => "Sem problema, memorize a sequência mais uma vez.",
  failAdult: () => "A sequência volta mais uma vez.",
  winKid: (clean) => `A nevasca ficou para trás - tudo digitado de memória!${clean ? " Sem erros." : ""}`,
  winAdult: () => "Nevasca superada.",
};

const STATION_BR: ZoneTextSet = {
  noun: "Mensagem de rádio",
  startText: () => "Na estação polar. Decifre a primeira mensagem de rádio.",
  introKid: () =>
    "A estação polar! Hora de respirar. O rádio envia palavras, mas as letras estão embaralhadas. Descubra a palavra e digite na ordem certa. Sem pressa, aqui nada afunda. Se travar, a tecla Tab mostra uma letra.",
  introAdult: () =>
    "A estação polar: decifrar anagramas. As letras de uma palavra estão embaralhadas - descubra a palavra e digite na ordem certa. Sem limite de tempo e sem derrota; se for preciso, a tecla Tab revela a próxima letra.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Todas as mensagens de rádio foram decifradas - a família respondeu!${clean ? " Sem erros." : ""}`,
  winAdult: () => "Todas as mensagens de rádio foram decifradas.",
};

const ZONE_TEXT_BR: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_BR,
  climb: CLIMB_BR,
  slide: SLIDE_BR,
  storm: STORM_BR,
  station: STATION_BR,
};

/** ★ O2-LIB (29.10.2026): die Zonentexte rumänisch - Banchiza, Peretele de gheață, Pe burtă spre casă, Viscolul, Stația polară (Glossar §2.3). */
const WATER_RO: ZoneTextSet = {
  noun: "Sloi",
  startText: (isAdult, name) =>
    isAdult ? `Pe mal. Primul sloi: ${name}` : `Pe mal. Sari pe primul sloi: ${name}`,
  introKid: (first, t) =>
    `Banchiza! Sari de pe un sloi pe altul peste apă. Apasă mereu tasta de pe următorul sloi${t ? " - dar nu zăbovi, gheața deja trosnește" : ""}. Primul sloi: ${first}`,
  introAdult: (first, t) =>
    `Scurtă reluare: apasă de fiecare dată tasta următorului sloi${t ? ", înainte să se scufunde" : ""}. Primul sloi: ${first}`,
  failKid: (back) => `Plici! Sloiul s-a scufundat. Repede înapoi pe mal și din nou! Primul sloi: ${back}`,
  failAdult: (back) => `Sloiul s-a scufundat - înapoi pe mal. Primul sloi: ${back}`,
  winKid: (clean) => `Ura, ai reușit!${clean ? " Nicio stropitură - aurora polară!" : ""}`,
  winAdult: () => "Gata.",
};

const CLIMB_RO: ZoneTextSet = {
  noun: "Priză",
  startText: (_isAdult, name) => `La baza peretelui. Prima priză: ${name}`,
  introKid: (first, t) =>
    `Peretele de gheață! Urcă pe muntele de litere. La fiecare priză scrie grupul scurt de caractere${t ? " - dar nu zăbovi, altfel pietrele încep să se desprindă" : ""}. Prima priză: ${first}`,
  introAdult: (first, t) =>
    `Peretele de gheață: la fiecare priză scrie un grup scurt de caractere${t ? ", înainte să se desprindă stânca" : ""}. Prima priză: ${first}`,
  failKid: (back) => `Hopa, a alunecat piciorul! Aterizare moale în zăpadă. Înapoi la ultima priză: ${back}`,
  failAdult: (back) => `Alunecare: înapoi la ultimul punct de odihnă. Se continuă de la: ${back}`,
  winKid: (clean) => `Ai reușit, ești sus de tot!${clean ? " Nicio alunecare!" : ""}`,
  winAdult: () => "Vârf cucerit.",
};

const SLIDE_RO: ZoneTextSet = {
  noun: "Alunecare",
  startText: (_isAdult, name) => `Sus pe pantă. Vine prima literă: ${name}`,
  introKid: (first, t) =>
    `Pe burtă spre casă! Aluneci pe burtică la vale, iar literele zboară spre tine. Apasă fiecare literă abia când este în poartă - la sunetul clar${t ? ", nu mai devreme" : ""}. Prima: ${first}`,
  introAdult: (first, t) =>
    `Pe burtă spre casă: o literă zboară spre tine și o scrii în clipa în care ajunge la țintă${t ? " - sunetul clar al țintei arată momentul potrivit" : ""}. Prima: ${first}`,
  failKid: () => "Hop, te-ai rostogolit în zăpadă! Nu s-a întâmplat nimic, mergem mai departe.",
  failAdult: () => "Cădere în zăpadă - urmează următoarea literă.",
  winKid: (clean) => `Acasă, la iglu!${clean ? " Fără greșeli - uite, aurora polară!" : ""}`,
  winAdult: () => "Ai ajuns la linia de sosire.",
};

const STORM_RO: ZoneTextSet = {
  noun: "Rafală",
  startText: () => "În viscol. Ține minte caracterele înainte să le ia vântul!",
  introKid: () =>
    "Viscolul! Pe tablă apare un grup scurt de caractere - ține-l bine minte. Apoi vântul îl spulberă, iar tu îl scrii din memorie. Gata? Ține minte primul grup!",
  introAdult: () =>
    "Viscolul: ține minte un grup scurt de caractere. Grupul este arătat și anunțat, apoi vântul îl spulberă - scrie-l din memorie. La nevoie, anunțul și tabla revin.",
  failKid: () => "Nu-i nimic, ține minte grupul încă o dată.",
  failAdult: () => "Grupul revine.",
  winKid: (clean) => `Ai trecut de viscol, totul scris din memorie!${clean ? " Fără greșeli!" : ""}`,
  winAdult: () => "Viscol depășit.",
};

const STATION_RO: ZoneTextSet = {
  noun: "Mesaj radio",
  startText: () => "La stația polară. Descifrează primul mesaj radio!",
  introKid: () =>
    "Stația polară! E timpul să tragi aer. Stația radio trimite cuvinte - dar literele sunt amestecate. Descoperă cuvântul și scrie-l în ordinea corectă. Fără grabă, aici nu se scufundă nimic! Dacă nu mai știi, tasta Tab îți dă o literă.",
  introAdult: () =>
    "Stația polară: rezolvarea anagramelor. Literele unui cuvânt sunt amestecate - descoperă cuvântul și scrie-l în ordinea corectă. Fără limită de timp și fără eșec; tasta Tab dezvăluie litera următoare, la nevoie.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Toate mesajele radio sunt descifrate - familia a răspuns!${clean ? " Fără greșeli!" : ""}`,
  winAdult: () => "Toate mesajele radio sunt descifrate.",
};

const ZONE_TEXT_RO: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_RO,
  climb: CLIMB_RO,
  slide: SLIDE_RO,
  storm: STORM_RO,
  station: STATION_RO,
};

/** ★ O2-LIB (30.10.2026): die Expedition schwedisch - Glossar sv §2.3 (Packisen, Isväggen, Ekogrottan, Snöstormen, Polarstationen, Magåkning hem); du-Form, Präsens, nie über das Kind. */
const WATER_SV: ZoneTextSet = {
  noun: "Isflak",
  startText: (isAdult, name) =>
    isAdult ? `Vid stranden. Första isflaket: ${name}` : `Vid stranden. Hoppa upp på det första isflaket: ${name}`,
  introKid: (first, t) =>
    `Packisen! Hoppa från isflak till isflak över vattnet. Tryck alltid på tangenten på nästa isflak${t ? " - men dröja inte kvar, isen knakar redan" : ""}. Första isflaket: ${first}.`,
  introAdult: (first, t) =>
    `Kort repetition: tryck varje gång på tangenten för nästa isflak${t ? ", innan det sjunker" : ""}. Första isflaket: ${first}.`,
  failKid: (back) => `Plums! Isflaket sjönk. Snabbt tillbaka till stranden, så försöker du igen. Första isflaket: ${back}.`,
  failAdult: (back) => `Isflaket har sjunkit - tillbaka till stranden. Första isflaket: ${back}.`,
  winKid: (clean) => (clean ? "Hurra, det gick utan ett enda plums - norrsken!" : "Hurra, det gick!"),
  winAdult: () => "Klart.",
};

const CLIMB_SV: ZoneTextSet = {
  noun: "Fotfäste",
  startText: (_isAdult, name) => `Vid foten av isväggen. Första fotfästet: ${name}`,
  introKid: (first, t) =>
    `Isväggen! Klättra uppför berget av bokstäver. Skriv den korta teckenföljden vid varje fotfäste${t ? " - men dröja inte kvar, annars börjar stenarna smulas sönder" : ""}. Första fotfästet: ${first}.`,
  introAdult: (first, t) =>
    `Isväggen: skriv en kort teckenföljd vid varje fotfäste${t ? " innan berget smulas sönder" : ""}. Första fotfästet: ${first}.`,
  failKid: (back) => `Hoppsan, du halkade! Mjuk landning i snön. Tillbaka till senaste fotfästet: ${back}.`,
  failAdult: (back) => `Halkade: tillbaka till senaste viloplatsen. Fortsätt med: ${back}.`,
  winKid: (clean) => (clean ? "Det gick, ända upp till toppen utan en enda halka!" : "Det gick, ända upp till toppen!"),
  winAdult: () => "Toppen är nådd.",
};

const SLIDE_SV: ZoneTextSet = {
  noun: "Åk",
  startText: (_isAdult, name) => `Högst upp i backen. Här kommer första bokstaven: ${name}`,
  introKid: (first, t) =>
    `Magåkning hem! Du åker på magen nedför backen och bokstäverna flyger emot dig. Tryck på varje bokstav först när den är i porten - vid den ljusa tonen${t ? ", inte före" : ""}. Den första: ${first}.`,
  introAdult: (first, t) =>
    `Magåkningen: en bokstav flyger emot dig och skrivs i samma ögonblick som den når mållinjen${t ? " - den ljusa måltonen visar rätt ögonblick" : ""}. Den första: ${first}.`,
  failKid: () => "Svisch, du rullade ner i snön! Ingen fara - nu kör vi igen.",
  failAdult: () => "Rullade ner i snön - nästa bokstav kommer.",
  winKid: (clean) => (clean ? "Hemma vid igloon utan ett enda fel - titta, norrsken!" : "Hemma vid igloon!"),
  winAdult: () => "Målet är nått.",
};

const STORM_SV: ZoneTextSet = {
  noun: "Vindby",
  startText: () => "I snöstormen. Kom ihåg tecknen innan vinden blåser bort dem.",
  introKid: () =>
    "Snöstormen! På tavlan visas en kort teckenföljd - lär dig den väl. Sedan blåser vinden bort den, och du skriver den ur minnet. Redo? Kom ihåg den första teckenföljden.",
  introAdult: () =>
    "Snöstormen: lär dig en kort teckenföljd. Den visas och läses upp, sedan blåser den bort - skriv den ur minnet. Vid behov kommer uppläsningen och tavlan tillbaka.",
  failKid: () => "Ingen fara - kom ihåg teckenföljden en gång till.",
  failAdult: () => "Teckenföljden kommer tillbaka.",
  winKid: (clean) => (clean ? "Igenom snöstormen, allt skrivet ur minnet och utan ett enda fel!" : "Igenom snöstormen, allt skrivet ur minnet!"),
  winAdult: () => "Genom snöstormen.",
};

const STATION_SV: ZoneTextSet = {
  noun: "Radiomeddelande",
  startText: () => "Vid polarstationen. Lös det första radiomeddelandet.",
  introKid: () =>
    "Polarstationen! Dags att pusta ut. Radion sänder ord - men bokstäverna ligger huller om buller. Lista ut ordet och skriv det i rätt ordning. Ingen brådska, här sjunker ingenting. Kör du fast ger tangenten Tabb dig en bokstav.",
  introAdult: () =>
    "Polarstationen: att lösa bokstavspussel. Bokstäverna i ett ord ligger huller om buller - lista ut ordet och skriv det i rätt ordning. Ingen tidspress och inget som kan misslyckas; tangenten Tabb visar nästa bokstav vid behov.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Alla radiomeddelanden är lösta - familjen svarar!${clean ? " Utan fel." : ""}`,
  winAdult: () => "Alla radiomeddelanden är lösta.",
};

const ZONE_TEXT_SV: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_SV,
  climb: CLIMB_SV,
  slide: SLIDE_SV,
  storm: STORM_SV,
  station: STATION_SV,
};

/**
 * ★ O2-LIB (30.10.2026): die Expedition ukrainisch, ти. Glossar §2.3: Паковий лід, Крижана стіна, Печера відлуння,
 * Хуртовина, Полярна станція, Додому на животику; крижина, радіоповідомлення, полярне сяйво, іглу. Nie eine Vergangenheit
 * der 2. Person (Geschlecht, Regel 2): Gegenwart, Zukunft und Sätze über die Sache. Kinder höchstens EIN Ausrufezeichen
 * je Meldung, Erwachsene keines. Nach einem Zeichen-Platzhalter am Satzende kein Punkt (Falle 4). Grundgesetz §7
 * unverändert: Höhle und Sturm nennen nie das Zeichen, die Station nie das Lösungswort.
 */
const WATER_UK: ZoneTextSet = {
  noun: "Крижина",
  startText: (isAdult, name) =>
    isAdult ? `На березі. Перша крижина: ${name}` : `На березі. Стрибни на першу крижину: ${name}`,
  introKid: (first, t) =>
    `Паковий лід! Стрибай з крижини на крижину через воду. Щоразу натискай клавішу, яка на наступній крижині${t ? " - але не барися, лід уже тріщить" : ""}. Перша крижина: ${first}`,
  introAdult: (first, t) =>
    `Коротке нагадування: щоразу натискай клавішу наступної крижини${t ? ", поки вона не потонула" : ""}. Перша крижина: ${first}`,
  failKid: (back) => `Плюх! Крижина затонула. Швидко назад на берег і ще раз. Перша крижина: ${back}`,
  failAdult: (back) => `Крижина затонула - назад на берег. Перша крижина: ${back}`,
  winKid: (clean) => `Ура, вийшло!${clean ? " Жодного плюху - ось і полярне сяйво." : ""}`,
  winAdult: () => "Готово.",
};

const CLIMB_UK: ZoneTextSet = {
  noun: "Опора",
  startText: (_isAdult, name) => `Біля підніжжя стіни. Перша опора: ${name}`,
  introKid: (first, t) =>
    `Крижана стіна! Піднімайся на гору з літер. На кожній опорі надрукуй коротку групу знаків${t ? " - але не барися, бо каміння почне кришитися" : ""}. Перша опора: ${first}`,
  introAdult: (first, t) =>
    `Крижана стіна: на кожній опорі надрукуй коротку групу знаків${t ? ", поки скеля не почала кришитися" : ""}. Перша опора: ${first}`,
  failKid: (back) => `Ой, ковзнуло! М'яка посадка в сніг. Назад на останню опору: ${back}`,
  failAdult: (back) => `Зісковзування: назад до останньої опори. Продовження: ${back}`,
  winKid: (clean) => `Вийшло, вершина твоя!${clean ? " Жодного зісковзування." : ""}`,
  winAdult: () => "Вершину досягнуто.",
};

const SLIDE_UK: ZoneTextSet = {
  noun: "Спуск",
  startText: (_isAdult, name) => `Нагорі схилу. Летить перша літера: ${name}`,
  introKid: (first, t) =>
    `Додому на животику! Ти мчиш униз по схилу на животі, а літери летять назустріч. Натискай кожну лише тоді, коли вона у воротах - на яскравий звук${t ? ", не раніше" : ""}. Перша: ${first}`,
  introAdult: (first, t) =>
    `Спуск на животі: назустріч летить одна літера, і її друкують у мить, коли вона досягає фінішу${t ? " - яскравий звук цілі показує потрібну мить" : ""}. Перша: ${first}`,
  failKid: () => "Бум, сальто в сніг! Нічого страшного, їдемо далі.",
  failAdult: () => "Падіння в сніг - летить наступна літера.",
  winKid: (clean) => `Знову біля іглу!${clean ? " Без помилок - дивись, полярне сяйво." : ""}`,
  winAdult: () => "Фініш.",
};

const STORM_UK: ZoneTextSet = {
  noun: "Порив",
  startText: () => "У хуртовині. Запам'ятай знаки, поки вітер не здув їх.",
  introKid: () =>
    "Хуртовина! На дошці з'являється коротка група знаків - добре запам'ятай її. Потім вітер здуває її, а ти друкуєш її з пам'яті. Починаємо: запам'ятай першу групу.",
  introAdult: () =>
    "Хуртовина: запам'ятати коротку групу знаків. Група показується й оголошується, потім вітер здуває її - надрукуй її з пам'яті. За потреби оголошення й дошка повертаються.",
  failKid: () => "Нічого страшного, запам'ятай групу ще раз.",
  failAdult: () => "Група повернеться ще раз.",
  winKid: (clean) => `Хуртовину пройдено - усе надруковано з пам'яті!${clean ? " Без помилок." : ""}`,
  winAdult: () => "Хуртовину пройдено.",
};

const STATION_UK: ZoneTextSet = {
  noun: "Радіоповідомлення",
  startText: () => "Біля полярної станції. Розшифруй перше радіоповідомлення.",
  introKid: () =>
    "Полярна станція! Час перепочити. Рація надсилає слова, але літери в них переплутані. Здогадайся, яке це слово, і надрукуй його в правильному порядку. Без поспіху, тут ніщо не тоне. Якщо не знаєш, що далі, клавіша Tab підкаже літеру.",
  introAdult: () =>
    "Полярна станція: розгадування слів із переплутаних літер. Літери слова переплутані - здогадайся, яке це слово, і надрукуй його в правильному порядку. Без обмеження часу й без програшу; за потреби клавіша Tab підкаже наступну літеру.",
  failKid: () => "",
  failAdult: () => "",
  winKid: (clean) => `Усі радіоповідомлення розшифровано - родина відповідає!${clean ? " Без помилок." : ""}`,
  winAdult: () => "Усі радіоповідомлення розшифровано.",
};

const ZONE_TEXT_UK: Record<ZoneOhneHoehle, ZoneTextSet> = {
  water: WATER_UK,
  climb: CLIMB_UK,
  slide: SLIDE_UK,
  storm: STORM_UK,
  station: STATION_UK,
};

/**
 * ★ E11a-5: EINE Tabelle je Bedienungssprache statt einer Weiche. Bis dahin stand hier
 * `sprache === "en" ? ZONE_TEXT_EN : ZONE_TEXT` - das hätte „fr" still auf Deutsch fallen
 * lassen (Leitfaden Falle 30). `Record<BedienSprache, …>` macht eine fehlende Sprache zum
 * `tsc`-Fehler statt zu einem stillen Rückfall.
 */
const ZONE_TEXT_JE_SPRACHE: Record<BedienSprache, Record<ZoneOhneHoehle, ZoneTextSet>> = {
  de: ZONE_TEXT,
  en: ZONE_TEXT_EN,
  fr: ZONE_TEXT_FR,
  es: ZONE_TEXT_ES,
  it: ZONE_TEXT_IT,
  // ★ O-PL (02.10.2026): polnisch.
  pl: ZONE_TEXT_PL,
  // ★ O-TR (02.10.2026): türkisch.
  tr: ZONE_TEXT_TR,
  // ★ O-CS (03.10.2026): tschechisch.
  cs: ZONE_TEXT_CS,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: ZONE_TEXT_BG,
  el: ZONE_TEXT_EL,
  hu: ZONE_TEXT_HU,
  nl: ZONE_TEXT_NL,
  pt: ZONE_TEXT_PT,
  br: ZONE_TEXT_BR,
  ro: ZONE_TEXT_RO,
  sv: ZONE_TEXT_SV,
  uk: ZONE_TEXT_UK,
};

/** ★ O2-LIB (29.10.2026): die bulgarische Höhle ohne Wesen (Weg ausser „de"). */
const CAVE_BG: ZoneTextSet = {
  noun: "Ехо",
  startText: () => "При входа на пещерата. Слушай внимателно всеки клавиш.",
  introKid: () =>
    "Пещера на ехото! Тук е съвсем тъмно - не се вижда нито един знак. Всеки клавиш прозвучава в тъмното като тон, а екранният четец или брайловият дисплей ти казва кой е. Слушай внимателно и го натисни.",
  introAdult: () =>
    "Пещера на ехото: писане по слух. Не се вижда никакъв знак - всеки клавиш прозвучава като тон, а името му отива към екранния четец или към брайловия дисплей. Натисни обявения клавиш.",
  failKid: () => "Опа, какъв страх! Обратно към входа на пещерата - слушай отново внимателно.",
  failAdult: () => "Обратно към входа на пещерата. Клавишът ще прозвучи отново.",
  winKid: (clean) => `Пещерата е зад теб - само по слух!${clean ? " И без нито една грешка." : ""}`,
  winAdult: () => "Пещерата е преодоляна.",
};

/** ★ O2-LIB (29.10.2026): die bulgarische Höhle MIT Wesen (Weg „de"). */
const CAVE_BG_MIT_WESEN: ZoneTextSet = {
  ...CAVE_BG,
  startText: () => "При входа на пещерата. Слушай пещерното същество.",
  introKid: () =>
    "Пещера на ехото! Тук е съвсем тъмно - не се вижда нито един знак. Пещерното същество ти прошепва всеки клавиш. Слушай внимателно и натисни това, което чуваш.",
  introAdult: () =>
    "Пещера на ехото: писане по слух. Не се вижда никакъв знак - пещерното същество обявява всеки клавиш. Натисни това, което чуваш.",
};

/** ★ O-EL-LIB (30.10.2026): die griechische Höhle OHNE Wesen. Höhle und Sturm nennen nie das Zeichen. */
const CAVE_EL: ZoneTextSet = {
  noun: "Ηχώ",
  startText: () => "Στην είσοδο της σπηλιάς. Άκου προσεκτικά κάθε πλήκτρο.",
  introKid: () =>
    "Η σπηλιά της ηχούς! Εδώ μέσα είναι σκοτάδι - δεν φαίνεται κανένας χαρακτήρας. Κάθε πλήκτρο ηχεί στο σκοτάδι ως ήχος, και ο αναγνώστης οθόνης ή η οθόνη braille σου λέει ποιο είναι. Άκου προσεκτικά και πάτησέ το.",
  introAdult: () =>
    "Η σπηλιά της ηχούς: γράψιμο με το αυτί. Κανένας χαρακτήρας δεν φαίνεται - κάθε πλήκτρο ηχεί ως ήχος και το όνομά του πηγαίνει στον αναγνώστη οθόνης ή στην οθόνη braille. Πάτησε το πλήκτρο που ανακοινώνεται.",
  failKid: () => "Ωχ, τι τρομάρα! Πίσω στην είσοδο της σπηλιάς - άκου ξανά προσεκτικά.",
  failAdult: () => "Πίσω στην είσοδο της σπηλιάς. Το πλήκτρο θα ακουστεί ξανά.",
  winKid: (clean) => `Πέρασες τη σπηλιά, μόνο με το αυτί!${clean ? " Και χωρίς κανένα λάθος." : ""}`,
  winAdult: () => "Η σπηλιά ξεπεράστηκε.",
};

/** ★ O-EL-LIB (30.10.2026): die griechische Höhle MIT Wesen (Weg „de", hoehleHatWesen). */
const CAVE_EL_MIT_WESEN: ZoneTextSet = {
  ...CAVE_EL,
  startText: () => "Στην είσοδο της σπηλιάς. Άκου το πλάσμα της σπηλιάς.",
  introKid: () =>
    "Η σπηλιά της ηχούς! Εδώ μέσα είναι σκοτάδι - δεν φαίνεται κανένας χαρακτήρας. Το πλάσμα της σπηλιάς σου ψιθυρίζει κάθε πλήκτρο. Άκου προσεκτικά και πάτησε αυτό που ακούς.",
  introAdult: () =>
    "Η σπηλιά της ηχούς: γράψιμο με το αυτί. Κανένας χαρακτήρας δεν φαίνεται - το πλάσμα της σπηλιάς ανακοινώνει κάθε πλήκτρο. Πάτησε αυτό που ακούς.",
};

/** ★ O2-LIB (29.10.2026): die Höhle OHNE Wesen, Ungarisch. */
const CAVE_HU: ZoneTextSet = {
  noun: "Visszhang",
  startText: () => "A barlang bejáratánál. Figyelj jól minden billentyűre.",
  introKid: () =>
    "Visszhangbarlang! Itt teljes a sötétség - egyetlen jel sem látszik. Minden billentyű hangként szólal meg a sötétben, a képernyőolvasó vagy a Braille-kijelző pedig megmondja, melyik az. Figyelj jól, és nyomd meg.",
  introAdult: () =>
    "Visszhangbarlang: gépelés hallás után. Egyetlen jel sem látszik - minden billentyű hangot ad, a nevét pedig a képernyőolvasó vagy a Braille-kijelző mondja be. Nyomd meg a bemondott billentyűt.",
  failKid: () => "Jaj, de ijesztő volt! Vissza a barlang bejáratához - figyelj újra jól.",
  failAdult: () => "Vissza a barlang bejáratához. A billentyű újra elhangzik.",
  winKid: (clean) => `Átjutottál a barlangon - csak a füleddel!${clean ? " Egyetlen hiba nélkül." : ""}`,
  winAdult: () => "A barlang leküzdve.",
};

/** ★ O2-LIB (29.10.2026): die Höhle MIT Wesen (Weg „de"), Ungarisch. */
const CAVE_HU_MIT_WESEN: ZoneTextSet = {
  ...CAVE_HU,
  startText: () => "A barlang bejáratánál. Hallgasd a barlanglakót.",
  introKid: () =>
    "Visszhangbarlang! Itt teljes a sötétség - egyetlen jel sem látszik. A barlanglakó minden billentyűt súg neked. Figyelj jól, és nyomd meg azt, amit hallasz.",
  introAdult: () =>
    "Visszhangbarlang: gépelés hallás után. Egyetlen jel sem látszik - a barlanglakó minden billentyűt bemond. Nyomd meg azt, amit hallasz.",
};

/** ★ O2-LIB (29.10.2026): die Echogrot niederländisch (Weg "de" mit Grotwezen, übrige ohne). Grundgesetz §7: nie das Zeichen nennen. */
const CAVE_NL: ZoneTextSet = {
  noun: "Echo",
  startText: () => "Bij de ingang van de grot. Luister goed naar elke toets.",
  introKid: () =>
    "De echogrot! Het is hier pikdonker - je ziet geen enkel teken. Elke toets klinkt in het donker als een toon, en je schermlezer of brailleleesregel zegt welke het is. Luister goed en druk erop!",
  introAdult: () =>
    "De echogrot: typen op het gehoor. Er is geen teken te zien - elke toets klinkt als een toon en de naam gaat naar je schermlezer of brailleleesregel. Druk op de toets die wordt genoemd.",
  failKid: () => "Hu, wat een schrik! Terug naar de ingang van de grot - luister nog eens goed.",
  failAdult: () => "Terug naar de ingang van de grot. De toets klinkt opnieuw.",
  winKid: (clean) => `Door de grot, helemaal op het gehoor!${clean ? " En zonder één fout!" : ""}`,
  winAdult: () => "Grot doorkruist.",
};

const CAVE_NL_MIT_WESEN: ZoneTextSet = {
  ...CAVE_NL,
  startText: () => "Bij de ingang van de grot. Luister naar het grotwezen!",
  introKid: () =>
    "De echogrot! Het is hier pikdonker - je ziet geen enkel teken. Het grotwezen fluistert je elke toets toe. Luister goed en druk op wat je hoort!",
  introAdult: () =>
    "De echogrot: typen op het gehoor. Er is geen teken te zien - het grotwezen noemt elke toets. Druk op wat je hoort.",
};

/** ★ O-LIB (30.10.2026): a Gruta do Eco em português - SEM criatura (caminhos sem criatura, {@link hoehleHatWesen}). */
const CAVE_PT: ZoneTextSet = {
  noun: "Eco",
  startText: () => "À entrada da gruta. Ouve com atenção cada tecla.",
  introKid: () =>
    "A Gruta do Eco! Está tudo escuro - não se vê nenhum caráter. Cada tecla soa no escuro como um som, e o teu leitor de ecrã ou a tua linha braille diz-te qual é. Ouve com atenção e prime-a.",
  introAdult: () =>
    "A Gruta do Eco: escrever de ouvido. Nenhum caráter é mostrado - cada tecla soa como um som e o seu nome vai para o leitor de ecrã ou para a linha braille. Prime a tecla anunciada.",
  failKid: () => "Ui, que susto! De volta à entrada da gruta - ouve outra vez com atenção.",
  failAdult: () => "De volta à entrada da gruta. A tecla volta a soar.",
  winKid: (clean) => `Gruta atravessada, só de ouvido!${clean ? " E sem um único erro!" : ""}`,
  winAdult: () => "Gruta atravessada.",
};

/** ★ O-LIB (30.10.2026): a Gruta do Eco portuguesa COM criatura (caminho "de", {@link hoehleHatWesen}). */
const CAVE_PT_MIT_WESEN: ZoneTextSet = {
  ...CAVE_PT,
  startText: () => "À entrada da gruta. Ouve a criatura da gruta.",
  introKid: () =>
    "A Gruta do Eco! Está tudo escuro - não se vê nenhum caráter. A criatura da gruta sussurra-te cada tecla. Ouve com atenção e prime o que ouvires.",
  introAdult: () =>
    "A Gruta do Eco: escrever de ouvido. Nenhum caráter é mostrado - a criatura da gruta anuncia cada tecla. Prime o que ouvires.",
};

/**
 * ★ O2-LIB (29.10.2026): die Höhle, Portugiesisch (Brasilien). Grundgesetz §7: Höhle und Sturm
 * nennen nie das Zeichen. Fassung ohne Wesen (Bildschirmleser/Braillezeile sagt die Taste) und
 * Fassung mit Wesen ("criatura da caverna").
 */
const CAVE_BR: ZoneTextSet = {
  noun: "Eco",
  startText: () => "Na entrada da caverna. Escute com atenção cada tecla.",
  introKid: () =>
    "A caverna do eco! Está tudo escuro - nenhum caractere aparece. Cada tecla soa no escuro como um tom, e o leitor de tela ou a linha braille diz qual é. Escute bem e pressione.",
  introAdult: () =>
    "A caverna do eco: digitação de ouvido. Nenhum caractere aparece - cada tecla soa como um tom, e o nome dela vai para o leitor de tela ou para a linha braille. Pressione a tecla anunciada.",
  failKid: () => "Ui, que susto! De volta à entrada da caverna - escute com atenção de novo.",
  failAdult: () => "De volta à entrada da caverna. A tecla soa de novo.",
  winKid: (clean) => `Caverna atravessada, só de ouvido!${clean ? " E sem um único erro." : ""}`,
  winAdult: () => "Caverna atravessada.",
};

const CAVE_BR_MIT_WESEN: ZoneTextSet = {
  ...CAVE_BR,
  startText: () => "Na entrada da caverna. Escute a criatura da caverna.",
  introKid: () =>
    "A caverna do eco! Está tudo escuro - nenhum caractere aparece. A criatura da caverna sussurra cada tecla para você. Escute bem e pressione o que ouvir.",
  introAdult: () =>
    "A caverna do eco: digitação de ouvido. Nenhum caractere aparece - a criatura da caverna anuncia cada tecla. Pressione o que ouvir.",
};

/**
 * ★ O2-LIB (29.10.2026): die rumänische Höhle - Peștera ecoului; Erzählung wie im
 * Deutschen, ohne Vergangenheit der 2. Person; Grundgesetz §7: nie das Zeichen nennen.
 */
const CAVE_RO: ZoneTextSet = {
  noun: "Ecou",
  startText: () => "La intrarea în peșteră. Ascultă cu atenție fiecare tastă.",
  introKid: () =>
    "Peștera ecoului! E întuneric beznă - nu se vede niciun caracter. Fiecare tastă răsună în întuneric ca un sunet, iar cititorul de ecran sau afișajul braille îți spune care este. Ascultă bine și apas-o.",
  introAdult: () =>
    "Peștera ecoului: scriere după ureche. Niciun caracter nu se vede - fiecare tastă răsună ca un sunet, iar numele ei ajunge la cititorul de ecran sau pe afișajul braille. Apasă tasta anunțată.",
  failKid: () => "Vai, ce sperietură! Înapoi la intrarea în peșteră - ascultă din nou cu atenție.",
  failAdult: () => "Înapoi la intrarea în peșteră. Tasta este anunțată din nou.",
  winKid: (clean) => `Ai trecut de peșteră, numai după ureche!${clean ? " Și fără nicio greșeală!" : ""}`,
  winAdult: () => "Peștera a fost traversată.",
};

/** ★ O2-LIB: die rumänische Höhle MIT Wesen (Weg „de“, {@link hoehleHatWesen}). */
const CAVE_RO_MIT_WESEN: ZoneTextSet = {
  ...CAVE_RO,
  startText: () => "La intrarea în peșteră. Ascultă făptura peșterii.",
  introKid: () =>
    "Peștera ecoului! E întuneric beznă - nu se vede niciun caracter. Făptura peșterii îți șoptește fiecare tastă. Ascultă bine și apasă ce auzi.",
  introAdult: () =>
    "Peștera ecoului: scriere după ureche. Niciun caracter nu se vede - făptura peșterii anunță fiecare tastă. Apasă ce auzi.",
};

/** ★ O2-LIB (30.10.2026): die Ekogrottan schwedisch (Weg "de" mit Grottvarelse, übrige ohne). Grundgesetz §7: nie das Zeichen nennen. */
const CAVE_SV: ZoneTextSet = {
  noun: "Eko",
  startText: () => "Vid grottans ingång. Lyssna noga efter varje tangent.",
  introKid: () =>
    "Ekogrottan! Här är det becksvart - inga tecken syns. Varje tangent ljuder som en ton i mörkret, och din skärmläsare eller ditt punktskriftsdisplay säger vilken det är. Lyssna noga och tryck på den.",
  introAdult: () =>
    "Ekogrottan: att skriva med hjälp av hörseln. Inga tecken syns - varje tangent ljuder som en ton och dess namn går till skärmläsaren eller punktskriftsdisplayet. Tryck på tangenten som sägs.",
  failKid: () => "Oj, vilken skräck! Tillbaka till grottans ingång - lyssna noga igen.",
  failAdult: () => "Tillbaka till grottans ingång. Tangenten ljuder igen.",
  winKid: (clean) => (clean ? "Genom grottan, bara med hörseln och utan ett enda fel!" : "Genom grottan, bara med hörseln!"),
  winAdult: () => "Grottan är passerad.",
};

const CAVE_SV_MIT_WESEN: ZoneTextSet = {
  ...CAVE_SV,
  startText: () => "Vid grottans ingång. Lyssna på grottvarelsen.",
  introKid: () =>
    "Ekogrottan! Här är det becksvart - inga tecken syns. Grottvarelsen viskar varje tangent till dig. Lyssna noga och tryck på det du hör.",
  introAdult: () =>
    "Ekogrottan: att skriva med hjälp av hörseln. Inga tecken syns - grottvarelsen säger varje tangent. Tryck på det du hör.",
};

/** ★ O2-LIB (30.10.2026): die ukrainische Höhle OHNE Wesen (alle Wege ausser „de", {@link hoehleHatWesen}). */
const CAVE_UK: ZoneTextSet = {
  noun: "Відлуння",
  startText: () => "Біля входу до печери. Уважно слухай кожну клавішу.",
  introKid: () =>
    "Печера відлуння! Тут цілковита темрява - жодного знака не видно. Кожна клавіша лунає в темряві звуком, а читач екрана або брайлівський дисплей каже, яка це. Уважно слухай і натискай її.",
  introAdult: () =>
    "Печера відлуння: друк на слух. Жодного знака не видно - кожна клавіша лунає звуком, а її назва йде до читача екрана або на брайлівський дисплей. Натисни оголошену клавішу.",
  failKid: () => "Ой, який переляк! Назад до входу в печеру - слухай ще уважніше.",
  failAdult: () => "Назад до входу в печеру. Клавішу оголосять ще раз.",
  winKid: (clean) => `Печеру пройдено - лише на слух!${clean ? " І без жодної помилки." : ""}`,
  winAdult: () => "Печеру пройдено.",
};

/** ★ O2-LIB (30.10.2026): die ukrainische Höhle MIT Wesen (Weg „de", {@link hoehleHatWesen}). */
const CAVE_UK_MIT_WESEN: ZoneTextSet = {
  ...CAVE_UK,
  startText: () => "Біля входу до печери. Слухай печерну істоту.",
  introKid: () =>
    "Печера відлуння! Тут цілковита темрява - жодного знака не видно. Печерна істота шепоче тобі кожну клавішу. Уважно слухай і натискай те, що чуєш.",
  introAdult: () =>
    "Печера відлуння: друк на слух. Жодного знака не видно - печерна істота оголошує кожну клавішу. Натисни те, що чуєш.",
};

/** ★ 28.09.2026: die Höhle je Bedienungssprache in beiden Fassungen ({@link hoehleHatWesen}). */
const HOEHLE_TEXT: Record<BedienSprache, HoehleFassungen<ZoneTextSet>> = {
  de: { mitWesen: CAVE, ohneWesen: CAVE_OHNE_WESEN },
  en: { mitWesen: CAVE_EN, ohneWesen: CAVE_EN_OHNE_WESEN },
  fr: { mitWesen: CAVE_FR_MIT_WESEN, ohneWesen: CAVE_FR },
  es: { mitWesen: CAVE_ES_MIT_WESEN, ohneWesen: CAVE_ES },
  it: { mitWesen: CAVE_IT_MIT_WESEN, ohneWesen: CAVE_IT },
  // ★ O-PL (02.10.2026): polnisch.
  pl: { mitWesen: CAVE_PL_MIT_WESEN, ohneWesen: CAVE_PL },
  // ★ O-TR (02.10.2026): türkisch.
  tr: { mitWesen: CAVE_TR_MIT_WESEN, ohneWesen: CAVE_TR },
  // ★ O-CS (03.10.2026): tschechisch.
  cs: { mitWesen: CAVE_CS_MIT_WESEN, ohneWesen: CAVE_CS },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: { mitWesen: CAVE_BG_MIT_WESEN, ohneWesen: CAVE_BG },
  el: { mitWesen: CAVE_EL_MIT_WESEN, ohneWesen: CAVE_EL },
  hu: { mitWesen: CAVE_HU_MIT_WESEN, ohneWesen: CAVE_HU },
  nl: { mitWesen: CAVE_NL_MIT_WESEN, ohneWesen: CAVE_NL },
  pt: { mitWesen: CAVE_PT_MIT_WESEN, ohneWesen: CAVE_PT },
  br: { mitWesen: CAVE_BR_MIT_WESEN, ohneWesen: CAVE_BR },
  ro: { mitWesen: CAVE_RO_MIT_WESEN, ohneWesen: CAVE_RO },
  sv: { mitWesen: CAVE_SV_MIT_WESEN, ohneWesen: CAVE_SV },
  uk: { mitWesen: CAVE_UK_MIT_WESEN, ohneWesen: CAVE_UK },
};

/**
 * Der Textsatz einer Zone (kindgerecht/sachlich). Ersetzt das frühere `zoneText` im Hook.
 * ★ EN3: mit der Bedienungssprache - ohne Angabe Deutsch, genau wie vorher.
 * ★ E11a-5: alle drei Bedienungssprachen.
 * ★ 28.09.2026: mit dem Lernweg - er entscheidet, ob die Höhle das Wesen nennt
 * ({@link hoehleHatWesen}). Ohne Angabe Weg „de", wie der Spiel-Hook.
 */
export function zoneText(zone: PlayZone, sprache: BedienSprache = "de", lernweg: Lernweg = "de"): ZoneTextSet {
  if (zone === "cave") return HOEHLE_TEXT[sprache][hoehleHatWesen(lernweg) ? "mitWesen" : "ohneWesen"];
  return ZONE_TEXT_JE_SPRACHE[sprache][zone];
}

// --- Expeditionstagebuch (Bauplan §4.7) ---------------------------------------------
//
// Vor JEDER Zone (Johannes' Auflage): Zonenname (aus EXPEDITION_ZONES) + Aufgabe in EINEM
// Satz + EIN Beispiel. Kind erzählend, Erwachsene sachlich - beide per Du (seit
// 19.09.2026, siehe ANREDE oben). Die Beispiele sind
// bewusst neutral gehalten (nie ein echtes Rätselwort der Station — §7).

const DIARY_KID: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Spring über die Schollen und drück immer die Taste, die auf der nächsten Scholle leuchtet.",
    example: "Leuchtet ein F, drückst du F.",
  },
  climb: {
    task: "Tippe an jedem Tritt die kurze Zeichenfolge, dann kletterst du höher.",
    example: "Steht dort der, tippst du d, e, r.",
  },
  storm: {
    task: "Merk dir die Zeichen auf der Tafel - dann verwehen sie, und du tippst sie aus dem Gedächtnis.",
    example: "Merkst du dir S, C, H, tippst du danach S, C, H.",
  },
  station: {
    task: "Die Buchstaben liegen durcheinander - erkenne das Wort und tippe es in der richtigen Reihenfolge; kommst du nicht weiter, verrät die Tab-Taste einen Buchstaben.",
    example: "Aus l, e, s, e wird das Wort Esel.",
  },
  slide: {
    task: "Die Buchstaben fliegen dir entgegen - drück jeden genau dann, wenn er im Tor ist: beim hellen Ton, nicht früher.",
    example: "Fliegt ein F heran, wartest du, bis es im Tor ist, und drückst dann F.",
  },
};

const DIARY_ADULT: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Drück jeweils die Taste der nächsten, leuchtenden Scholle.",
    example: "Leuchtet ein F, drückst du F.",
  },
  climb: {
    task: "Tippe an jedem Tritt die kurze Zeichenfolge, um höher zu klettern.",
    example: "Steht dort der, tippst du d, e, r.",
  },
  storm: {
    task: "Präg dir die Folge ein; sie verweht, dann tippst du sie aus dem Gedächtnis.",
    example: "Auf S, C, H folgt getippt S, C, H.",
  },
  station: {
    task: "Die Buchstaben eines Wortes liegen gemischt vor - erkennen und in richtiger Reihenfolge tippen; bei Bedarf verrät die Tab-Taste den nächsten Buchstaben.",
    example: "Aus l, e, s, e wird das Wort Esel.",
  },
  slide: {
    task: "Ein einzelner Buchstabe fliegt heran - tippe ihn genau im Moment der Ziellinie (heller Zielton), nicht früher.",
    example: "Fliegt ein F heran, drückst du F, sobald es im Tor steht.",
  },
};

// ★ EN3 (19.09.2026): das Tagebuch englisch. Zwei Beispiele sind eigens gewählt:
//  • Echo-Höhle: Das Höhlenwesen spricht mit deutschen Aufnahmen („Ka") - das
//    Beispiel sagt darum dazu, welche Taste das ist. (Seit 28.09.2026 in
//    `HOEHLE_TAGEBUCH`, mit einer Fassung ohne Wesen für die Wege ausser „de".)
//  • Polarstation: „Esel" ist kein englisches Wort. „Radio" ist es in beiden
//    Sprachen, passt zur Funkstation und steht NICHT in der Rätselliste (§7).
const DIARY_KID_EN: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Jump across the floes and always press the key that lights up on the next floe.",
    example: "If an F lights up, you press F.",
  },
  climb: {
    task: "Type the short sequence at each foothold, and you climb higher.",
    example: "If it says “ask”, you type a, s, k.",
  },
  storm: {
    task: "Remember the characters on the board - then they blow away, and you type them from memory.",
    example: "If you remember S, C, H, you then type S, C, H.",
  },
  station: {
    task: "The letters are jumbled up - work out the word and type it in the right order; if you get stuck, the Tab key gives you a letter.",
    example: "The letters o, i, d, a, r make the word radio.",
  },
  slide: {
    task: "The letters fly towards you - press each one exactly when it's in the gate: at the bright sound, not before.",
    example: "If an F flies towards you, wait until it's in the gate, then press F.",
  },
};

const DIARY_ADULT_EN: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Each time, press the key of the next floe that lights up.",
    example: "If an F lights up, press F.",
  },
  climb: {
    task: "Type the short sequence at each foothold to climb higher.",
    example: "If it says “ask”, type a, s, k.",
  },
  storm: {
    task: "Memorise the sequence; it blows away, then type it from memory.",
    example: "S, C, H is shown - afterwards you type S, C, H.",
  },
  station: {
    task: "The letters of a word are jumbled - work out the word and type it in the right order; if needed, the Tab key reveals the next letter.",
    example: "The letters o, i, d, a, r make the word radio.",
  },
  slide: {
    task: "A single letter flies towards you - type it exactly as it reaches the finish line (bright target sound), not before.",
    example: "If an F flies towards you, press F as soon as it is in the gate.",
  },
};

// ★ E11a-5 (26.09.2026): das Tagebuch französisch - neu geschrieben, siehe oben bei
// ZONE_TEXT_FR. Die Beispiele passen zum französischen Lehrgang (AZERTY, Weg „fr"): nur
// Zeichen, die dort früh kommen (Grundreihe q s d f j k l m, dazu e i u a n o t r), und
// kein echtes Rätselwort der Station (§7).
//  • Steilwand: « sel » - s, e, l liegen alle im ersten Abschnitt des Weges „fr".
//  • Schneesturm: Q, S, D - der Anfang der AZERTY-Grundreihe, kein Wort.
//  • Polarstation: « radio » wie im Englischen - ein französisches Wort, das zur Funkstation
//    passt und in keiner Rätselliste steht (`words.ts`).
//  • ★★ Echo-Höhle - DAS HÖHLENWESEN: Es spricht mit AUFNAHMEN, nicht mit der Stimme der
//    Bedienung (`caveAnnouncement` in `useExpedition.ts`): auf Weg „de" die deutschen
//    Aufnahmen („Ka"), auf den übrigen Wegen gar keine Stimme, nur ein Ton - der Name
//    des Zeichens steht dann in der Live-Region, in der Sprache des Weges. Seit 28.09.2026
//    steht das Höhlen-Blatt darum nicht hier, sondern in `HOEHLE_TAGEBUCH` (zwei Fassungen,
//    entschieden am Weg). ⚠️ Die frühere Annahme hier („das Beispiel stimmt in beiden
//    Fällen") hielt nicht: auf Weg „fr" gibt es kein Wesen, das man „hört".
const DIARY_KID_FR: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Saute de bloc en bloc et appuie toujours sur la touche qui s'allume sur le prochain bloc de glace.",
    example: "Si un F s'allume, tu appuies sur F.",
  },
  climb: {
    task: "À chaque prise, tape la courte suite de caractères, et tu grimpes plus haut.",
    example: "Si c'est écrit \"sel\", tu tapes s, e, l.",
  },
  storm: {
    task: "Retiens les caractères du tableau - puis le vent les emporte, et tu les tapes de mémoire.",
    example: "Si tu retiens Q, S, D, tu tapes ensuite Q, S, D.",
  },
  station: {
    task: "Les lettres sont mélangées - trouve le mot et tape-le dans le bon ordre ; si tu bloques, la touche Tab te donne une lettre.",
    example: "Les lettres o, i, d, a, r donnent le mot radio.",
  },
  slide: {
    task: "Les lettres volent vers toi - appuie sur chacune juste quand elle est dans la porte : au son clair, pas avant.",
    example: "Si un F arrive vers toi, attends qu'il soit dans la porte, puis appuie sur F.",
  },
};

const DIARY_ADULT_FR: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "À chaque fois, appuie sur la touche du prochain bloc de glace qui s'allume.",
    example: "Si un F s'allume, appuie sur F.",
  },
  climb: {
    task: "À chaque prise, tape la courte suite de caractères pour grimper plus haut.",
    example: "Si c'est écrit \"sel\", tape s, e, l.",
  },
  storm: {
    task: "Retiens la suite ; le vent l'emporte, puis tape-la de mémoire.",
    example: "Q, S, D s'affiche - ensuite, tu tapes Q, S, D.",
  },
  station: {
    task: "Les lettres d'un mot sont mélangées - trouve le mot et tape-le dans le bon ordre ; au besoin, la touche Tab donne la lettre suivante.",
    example: "Les lettres o, i, d, a, r donnent le mot radio.",
  },
  slide: {
    task: "Une seule lettre arrive vers toi - tape-la juste quand elle atteint la ligne d'arrivée (son clair), pas avant.",
    example: "Si un F arrive vers toi, appuie sur F dès qu'il est dans la porte.",
  },
};

// ★ ES-O (27.09.2026): das Tagebuch spanisch. Die Beispiele passen zum Weg „es": nur
// Zeichen, die dort früh kommen (Grundreihe a s d f j k l ñ, dazu e o n t u r c i m) und
// kein echtes Rätselwort der Station (§7).
//  • Acantilado: « sal » - s, a, l liegen alle in der Grundreihe.
//  • Tormenta: A, S, D - der Anfang der Grundreihe, kein Wort.
//  • Estación: « radio » - passt zur Funkstation und steht in keiner Rätselliste.
//  • Cueva: ⚠️ auf Weg „es" spricht das Wesen NICHT (`caveAnnouncement` in
//    `useExpedition.ts`: nur ein Ton je Taste, der Name steht in der Live-Region, also nur
//    beim Lesegerät/auf der Braillezeile). Die Texte versprechen darum nur das (Prüfung
//    27.09.2026) - ob die Höhle auf „es" eine Stimme bekommt, entscheidet Johannes.
//    Seit 28.09.2026 in `HOEHLE_TAGEBUCH` (Weg „de" mit spanischer Bedienung: mit Wesen).
const DIARY_KID_ES: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Salta de bloque en bloque y pulsa siempre la tecla que se enciende en el siguiente bloque de hielo.",
    example: "Si se enciende una F, pulsas F.",
  },
  climb: {
    task: "En cada agarre, escribe la serie corta de caracteres y subes más alto.",
    example: "Si aparece \"sal\", escribes s, a, l.",
  },
  storm: {
    task: "Recuerda los caracteres del tablero - después el viento se los lleva y los escribes de memoria.",
    example: "Si recuerdas A, S, D, después escribes A, S, D.",
  },
  station: {
    task: "Las letras están revueltas - descubre la palabra y escríbela en el orden correcto; si te atascas, la tecla Tab te da una letra.",
    example: "Las letras o, i, d, a, r forman la palabra radio.",
  },
  slide: {
    task: "Las letras vuelan hacia ti - pulsa cada una justo cuando esté en la puerta: con el sonido claro, no antes.",
    example: "Si llega una F hacia ti, espera a que esté en la puerta y pulsa F.",
  },
};

const DIARY_ADULT_ES: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Pulsa cada vez la tecla del siguiente bloque de hielo que se enciende.",
    example: "Si se enciende una F, pulsa F.",
  },
  climb: {
    task: "En cada agarre, escribe la serie corta de caracteres para subir más alto.",
    example: "Si aparece \"sal\", escribe s, a, l.",
  },
  storm: {
    task: "Recuerda la serie; el viento se la lleva y después la escribes de memoria.",
    example: "Aparece A, S, D - después escribes A, S, D.",
  },
  station: {
    task: "Las letras de una palabra están revueltas - descubre la palabra y escríbela en el orden correcto; si hace falta, la tecla Tab da la letra siguiente.",
    example: "Las letras o, i, d, a, r forman la palabra radio.",
  },
  slide: {
    task: "Llega una sola letra hacia ti - escríbela justo cuando alcance la línea de llegada (sonido claro), no antes.",
    example: "Si llega una F hacia ti, pulsa F en cuanto esté en la puerta.",
  },
};

// ★ O-IT (02.10.2026): das Tagebuch italienisch, tu. Beispiele: « sala » (s, a, l liegen in
// der Grundreihe jeder Tastatur), A, S, D (kein Wort), « radio » (passt zur Funkstation und
// steht in keiner Rätselliste, §7).
const DIARY_KID_IT: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Salta da un lastrone all'altro e premi sempre il tasto che si accende sul prossimo lastrone.",
    example: "Se si accende una F, premi F.",
  },
  climb: {
    task: "A ogni appiglio scrivi la breve sequenza di caratteri, e sali più in alto.",
    example: `Se c'è scritto "sala", scrivi s, a, l, a.`,
  },
  storm: {
    task: "Ricorda i caratteri sulla lavagna - poi il vento li porta via e tu li scrivi a memoria.",
    example: "Se ricordi A, S, D, poi scrivi A, S, D.",
  },
  station: {
    task: "Le lettere sono mescolate - scopri la parola e scrivila nell'ordine giusto; se ti blocchi, il tasto Tab ti dà una lettera.",
    example: "Le lettere o, i, d, a, r formano la parola radio.",
  },
  slide: {
    task: "Le lettere ti volano incontro - premi ognuna proprio quando è nella porta: al suono chiaro, non prima.",
    example: "Se arriva una F, aspetta che sia nella porta e poi premi F.",
  },
};

const DIARY_ADULT_IT: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Premi ogni volta il tasto del prossimo lastrone che si accende.",
    example: "Se si accende una F, premi F.",
  },
  climb: {
    task: "A ogni appiglio scrivi la breve sequenza di caratteri per salire più in alto.",
    example: `Se c'è scritto "sala", scrivi s, a, l, a.`,
  },
  storm: {
    task: "Ricorda la sequenza; il vento la porta via, poi la scrivi a memoria.",
    example: "Compare A, S, D - poi scrivi A, S, D.",
  },
  station: {
    task: "Le lettere di una parola sono mescolate - scopri la parola e scrivila nell'ordine giusto; se serve, il tasto Tab dà la lettera successiva.",
    example: "Le lettere o, i, d, a, r formano la parola radio.",
  },
  slide: {
    task: "Arriva una sola lettera - scrivila proprio quando raggiunge il traguardo (suono chiaro), non prima.",
    example: "Se arriva una F, premi F appena è nella porta.",
  },
};

// ★ O-PL (02.10.2026): das Tagebuch polnisch, ty. Beispiele wie it: „sala" (s, a, l liegen
// im rząd podstawowy jeder Tastatur, auch „Polski (programisty)"), A, S, D (kein Wort),
// „radio" (passt zur Funkstation und steht in keiner Rätselliste, §7). Kein Geschlecht:
// Präsens und Befehlsform.
const DIARY_KID_PL: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Skacz po krach i naciskaj zawsze klawisz, który świeci na następnej krze.",
    example: "Jeśli świeci F, naciskasz F.",
  },
  climb: {
    task: "Na każdym stopniu napisz krótki ciąg znaków, a wejdziesz wyżej.",
    example: "Jeśli jest tam „sala”, piszesz s, a, l, a.",
  },
  storm: {
    task: "Zapamiętaj znaki na tablicy - potem wiatr je zwiewa, a ty piszesz je z pamięci.",
    example: "Jeśli zapamiętasz A, S, D, potem piszesz A, S, D.",
  },
  station: {
    task: "Litery są pomieszane - odgadnij słowo i napisz je we właściwej kolejności; jeśli utkniesz, klawisz Tab podpowie ci literę.",
    example: "Z liter o, i, d, a, r powstaje słowo radio.",
  },
  slide: {
    task: "Litery lecą ci naprzeciw - naciśnij każdą dokładnie wtedy, gdy jest w bramce: przy jasnym dźwięku, nie wcześniej.",
    example: "Jeśli nadlatuje F, poczekaj, aż będzie w bramce, i naciśnij F.",
  },
};

const DIARY_ADULT_PL: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Naciskaj za każdym razem klawisz następnej kry, która świeci.",
    example: "Jeśli świeci F, naciśnij F.",
  },
  climb: {
    task: "Na każdym stopniu napisz krótki ciąg znaków, aby wspiąć się wyżej.",
    example: "Jeśli jest tam „sala”, napisz s, a, l, a.",
  },
  storm: {
    task: "Zapamiętaj ciąg; wiatr go zwiewa, potem napisz go z pamięci.",
    example: "Pojawia się A, S, D - potem piszesz A, S, D.",
  },
  station: {
    task: "Litery słowa są pomieszane - odgadnij słowo i napisz je we właściwej kolejności; w razie potrzeby klawisz Tab podaje następną literę.",
    example: "Z liter o, i, d, a, r powstaje słowo radio.",
  },
  slide: {
    task: "Nadlatuje jedna litera - napisz ją dokładnie w chwili, gdy dotrze do mety (jasny dźwięk), nie wcześniej.",
    example: "Jeśli nadlatuje F, naciśnij F, gdy tylko będzie w bramce.",
  },
};

// ★ O-TR (02.10.2026): das Tagebuch türkisch, sen. Beispiele: "sal" (s, a, l liegen in der
// temel sıra der Türkçe Q), A, S, D (kein Wort), "radyo" (passt zur Funkstation und steht
// in keiner Rätselliste, §7). Keine Endung an einem Zeichen (Regel 6): "F tuşuna bas".
const DIARY_KID_TR: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Buz kütlelerinin üstünden atla ve her zaman bir sonraki buz kütlesinde yanan tuşa bas.",
    example: "F yanıyorsa F tuşuna basarsın.",
  },
  climb: {
    task: "Her basamakta kısa karakter dizisini yaz, böylece daha yükseğe tırmanırsın.",
    example: 'Orada "sal" yazıyorsa s, a, l yazarsın.',
  },
  storm: {
    task: "Tahtadaki karakterleri aklında tut - sonra rüzgâr onları savurur, sen de onları aklından yazarsın.",
    example: "A, S, D dizisini aklında tutarsan sonra A, S, D yazarsın.",
  },
  station: {
    task: "Harfler karışmış - kelimeyi bul ve doğru sırayla yaz; takılırsan Tab tuşu sana bir harf söyler.",
    example: "o, y, d, a, r harflerinden radyo kelimesi çıkar.",
  },
  slide: {
    task: "Harfler sana doğru uçuyor - her birine tam kapının içindeyken bas: parlak seste, daha önce değil.",
    example: "F geliyorsa kapıya girmesini bekle, sonra F tuşuna bas.",
  },
};

const DIARY_ADULT_TR: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Her seferinde yanan bir sonraki buz kütlesinin tuşuna bas.",
    example: "F yanıyorsa F tuşuna bas.",
  },
  climb: {
    task: "Daha yükseğe tırmanmak için her basamakta kısa karakter dizisini yaz.",
    example: 'Orada "sal" yazıyorsa s, a, l yaz.',
  },
  storm: {
    task: "Diziyi aklında tut; rüzgâr onu savurur, sonra aklından yaz.",
    example: "A, S, D gösterilir - sonra A, S, D yazarsın.",
  },
  station: {
    task: "Bir kelimenin harfleri karışık - kelimeyi bul ve doğru sırayla yaz; gerekirse Tab tuşu sıradaki harfi söyler.",
    example: "o, y, d, a, r harflerinden radyo kelimesi çıkar.",
  },
  slide: {
    task: "Tek bir harf yaklaşır - onu tam bitiş çizgisine vardığı anda yaz (parlak hedef sesi), daha önce değil.",
    example: "F geliyorsa kapıya girer girmez F tuşuna bas.",
  },
};

// ★ O-CS (03.10.2026): das Tagebuch tschechisch, ty. Beispiele: „had" (h, a, d liegen in der
// základní řada jeder tschechischen Tastatur), A, S, D (kein Wort), „rádio" (passt zur
// Funkstation und steht in keiner Rätselliste, §7). Kein Geschlecht: Präsens, Zukunft und
// Befehlsform (nie „abys vylezl"). Keine Anführungszeichen - das Beispiel geht in die Ansage.
const DIARY_KID_CS: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Skákej po krách a vždycky stiskni klávesu, která svítí na další kře.",
    example: "Když svítí F, stiskneš F.",
  },
  climb: {
    task: "Na každém chytu napiš krátkou skupinu znaků a vylezeš výš.",
    example: "Když tam stojí slovo had, napíšeš h, a, d.",
  },
  storm: {
    task: "Zapamatuj si znaky na tabuli - pak je vítr odvane a ty je napíšeš zpaměti.",
    example: "Když si zapamatuješ A, S, D, pak napíšeš A, S, D.",
  },
  station: {
    task: "Písmena jsou přeházená - poznej slovo a napiš ho ve správném pořadí; když nevíš dál, klávesa Tabulátor ti prozradí písmeno.",
    example: "Z písmen o, i, d, á, r vznikne slovo rádio.",
  },
  slide: {
    task: "Písmena ti letí naproti - stiskni každé přesně ve chvíli, kdy je v bráně: při jasném tónu, ne dřív.",
    example: "Když přilétá F, počkej, až bude v bráně, a pak stiskni F.",
  },
};

const DIARY_ADULT_CS: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Pokaždé stiskni klávesu další kry, která svítí.",
    example: "Když svítí F, stiskni F.",
  },
  climb: {
    task: "Na každém chytu napiš krátkou skupinu znaků - tak se dostaneš výš.",
    example: "Když tam stojí slovo had, napiš h, a, d.",
  },
  storm: {
    task: "Zapamatuj si skupinu znaků; vítr ji odvane, pak ji napiš zpaměti.",
    example: "Ukáže se A, S, D - potom napíšeš A, S, D.",
  },
  station: {
    task: "Písmena slova jsou přeházená - poznej slovo a napiš ho ve správném pořadí; když je potřeba, klávesa Tabulátor prozradí další písmeno.",
    example: "Z písmen o, i, d, á, r vznikne slovo rádio.",
  },
  slide: {
    task: "Přilétá jedno písmeno - napiš ho přesně ve chvíli, kdy dorazí do cíle (jasný cílový tón), ne dřív.",
    example: "Když přilétá F, stiskni F, jakmile je v bráně.",
  },
};

/**
 * ★★ Das Tagebuch-Blatt der ECHO-HÖHLE (28.09.2026) - je Bedienungssprache in beiden
 * Fassungen ({@link hoehleHatWesen}).
 *
 * „mit Wesen" (Weg „de"): Das Wesen spricht mit DEUTSCHEN Aufnahmen - „Ka" für K, in
 * jeder Bedienungssprache. Das Beispiel nennt darum, was das Wesen sagt, UND (ausser im
 * Deutschen) welche Taste das ist. Deutsch und Englisch wörtlich wie bisher, Französisch
 * wie bisher, Spanisch der Wortlaut der ersten Fassung (ES-O, a8a59ded).
 *
 * „ohne Wesen" (Wege „en", „fr", „es"): Es gibt KEINE Stimme, die „Ka" sagt - nur einen
 * Ton, und den Namen der Taste in der Live-Region, in der Sprache des WEGES
 * (`caveAnnouncement`). Das frühere Beispiel „Hörst du Ka" wäre dort falsch: auf Weg „en"
 * liest der Screenreader „K" in seiner eigenen Aussprache. Darum nennt das Beispiel nur
 * die Taste selbst - das stimmt mit jedem Screenreader und jeder Braillezeile. Spanisch
 * bleibt beim bisherigen „ka" (auf Weg „es" ist das der Name in der Live-Region).
 * Grundgesetz §7 gilt: das Beispiel ist ein Beispiel, nie das zu tippende Zeichen.
 */
// ★ O-IT: „it" steht als HOEHLE_TAGEBUCH_IT weiter unten (eigene Konstante, gleiche Form).
// ★ O-PL (02.10.2026): „pl" ebenso als HOEHLE_TAGEBUCH_PL weiter unten.
// ★ O-TR (02.10.2026): "tr" ebenso als HOEHLE_TAGEBUCH_TR weiter unten.
// ★ O-CS (03.10.2026): „cs" ebenso als HOEHLE_TAGEBUCH_CS weiter unten.
const HOEHLE_TAGEBUCH_FERTIG = {
  de: {
    mitWesen: {
      kind: {
        task: "Hier ist es dunkel - das Höhlenwesen sagt jede Taste an, du tippst nur nach Gehör.",
        example: "Hörst du Ka, drückst du K.",
      },
      erwachsen: {
        task: "Im Dunkeln sagt das Höhlenwesen jede Taste an - tippe nach Gehör.",
        example: "Hörst du Ka, drückst du K.",
      },
    },
    ohneWesen: {
      kind: {
        task: "Hier ist es dunkel - jede Taste klingt als Ton, und der Screenreader oder die Braillezeile sagt dir, welche es ist.",
        example: "Sagt dein Screenreader K, drückst du K.",
      },
      erwachsen: {
        task: "Im Dunkeln klingt jede Taste als Ton; ihr Name geht an den Screenreader oder die Braillezeile.",
        example: "Sagt der Screenreader K, drückst du K.",
      },
    },
  },
  en: {
    mitWesen: {
      kind: {
        task: "It's dark in here - the cave creature says each key, and you type by ear alone.",
        example: "If you hear “Ka” - that is K - you press K.",
      },
      erwachsen: {
        task: "In the dark, the cave creature announces each key - type by ear.",
        example: "If you hear “Ka” - that is K - press K.",
      },
    },
    ohneWesen: {
      kind: {
        task: "It's dark in here - each key sounds a tone, and your screen reader or braille display tells you which one it is.",
        example: "If your screen reader says K, you press K.",
      },
      erwachsen: {
        task: "In the dark, each key sounds a tone; its name goes to the screen reader or braille display.",
        example: "If the screen reader says K, press K.",
      },
    },
  },
  fr: {
    mitWesen: {
      kind: {
        task: "Ici, il fait noir - la créature de la grotte dit chaque touche, et tu tapes rien qu'à l'oreille.",
        example: "Si tu entends \"Ka\", c'est le K : tu appuies sur K.",
      },
      erwachsen: {
        task: "Dans le noir, la créature de la grotte annonce chaque touche - tape à l'oreille.",
        example: "Si tu entends \"Ka\", c'est le K : appuie sur K.",
      },
    },
    ohneWesen: {
      kind: {
        task: "Ici, il fait noir - chaque touche sonne, et le lecteur d'écran ou la plage braille te dit laquelle.",
        example: "Si ton lecteur d'écran dit K, tu appuies sur K.",
      },
      erwachsen: {
        task: "Dans le noir, chaque touche sonne ; son nom arrive au lecteur d'écran ou à la plage braille.",
        example: "Si le lecteur d'écran dit K, appuie sur K.",
      },
    },
  },
  es: {
    mitWesen: {
      kind: {
        task: "Aquí está oscuro - la criatura de la cueva dice cada tecla, y tú escribes solo de oído.",
        example: "Si oyes \"Ka\", es la K: pulsas K.",
      },
      erwachsen: {
        task: "A oscuras, la criatura de la cueva anuncia cada tecla - escribe de oído.",
        example: "Si oyes \"Ka\", es la K: pulsa K.",
      },
    },
    ohneWesen: {
      kind: {
        task: "Aquí está oscuro - cada tecla suena con un tono, y el lector de pantalla o la línea braille te dice cuál es.",
        example: "Si tu lector de pantalla dice \"ka\", pulsas K.",
      },
      erwachsen: {
        task: "A oscuras, cada tecla suena con un tono; su nombre llega al lector de pantalla o a la línea braille.",
        example: "Si el lector de pantalla dice \"ka\", pulsa K.",
      },
    },
  },
} as const;

/** ★ O-IT (02.10.2026): das Höhlen-Blatt italienisch, in beiden Fassungen. */
const HOEHLE_TAGEBUCH_IT: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Qui è buio - la creatura della grotta dice ogni tasto, e tu scrivi solo a orecchio.",
      example: `Se senti "Ka", è la K: premi K.`,
    },
    erwachsen: {
      task: "Al buio la creatura della grotta annuncia ogni tasto - scrivi a orecchio.",
      example: `Se senti "Ka", è la K: premi K.`,
    },
  },
  ohneWesen: {
    kind: {
      task: "Qui è buio - ogni tasto suona con un tono, e il lettore di schermo o il display braille ti dice quale è.",
      example: "Se il tuo lettore di schermo dice K, premi K.",
    },
    erwachsen: {
      task: "Al buio ogni tasto suona con un tono; il suo nome va al lettore di schermo o al display braille.",
      example: "Se il lettore di schermo dice K, premi K.",
    },
  },
};

/** ★ O-PL (02.10.2026): das Höhlen-Blatt polnisch, in beiden Fassungen. */
const HOEHLE_TAGEBUCH_PL: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Tu jest ciemno - stworek z jaskini mówi każdy klawisz, a ty piszesz tylko ze słuchu.",
      example: "Jeśli słyszysz „Ka”, to jest K: naciskasz K.",
    },
    erwachsen: {
      task: "W ciemności stworek z jaskini zapowiada każdy klawisz - pisz ze słuchu.",
      example: "Jeśli słyszysz „Ka”, to jest K: naciśnij K.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Tu jest ciemno - każdy klawisz brzmi jak dźwięk, a czytnik ekranu albo monitor brajlowski podaje ci jego nazwę.",
      example: "Jeśli twój czytnik ekranu mówi K, naciskasz K.",
    },
    erwachsen: {
      task: "W ciemności każdy klawisz brzmi jak dźwięk; jego nazwa trafia do czytnika ekranu lub na monitor brajlowski.",
      example: "Jeśli czytnik ekranu mówi K, naciśnij K.",
    },
  },
};

/** ★ O-TR (02.10.2026): das Höhlen-Blatt türkisch, in beiden Fassungen. */
const HOEHLE_TAGEBUCH_TR: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Burası karanlık - mağara yaratığı her tuşu söyler, sen de yalnızca duyarak yazarsın.",
      example: '"Ka" duyarsan bu K harfidir: K tuşuna basarsın.',
    },
    erwachsen: {
      task: "Karanlıkta mağara yaratığı her tuşu duyurur - duyarak yaz.",
      example: '"Ka" duyarsan bu K harfidir: K tuşuna bas.',
    },
  },
  ohneWesen: {
    kind: {
      task: "Burası karanlık - her tuş bir ses olarak duyulur, ekran okuyucu ya da Braille ekran sana hangisi olduğunu söyler.",
      example: "Ekran okuyucun K derse K tuşuna basarsın.",
    },
    erwachsen: {
      task: "Karanlıkta her tuş bir ses olarak duyulur; adı ekran okuyucuya ya da Braille ekrana gider.",
      example: "Ekran okuyucu K derse K tuşuna bas.",
    },
  },
};

/** ★ O-CS (03.10.2026): das Höhlen-Blatt tschechisch, in beiden Fassungen. */
const HOEHLE_TAGEBUCH_CS: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Je tu tma - jeskynní tvor ti řekne každou klávesu a ty píšeš jen podle sluchu.",
      example: "Když uslyšíš Ka, je to K: stiskneš K.",
    },
    erwachsen: {
      task: "Ve tmě ohlásí jeskynní tvor každou klávesu - piš podle sluchu.",
      example: "Když uslyšíš Ka, je to K: stiskni K.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Je tu tma - každá klávesa zazní jako tón a odečítač obrazovky nebo braillský řádek ti řekne, která to je.",
      example: "Když tvůj odečítač obrazovky řekne K, stiskneš K.",
    },
    erwachsen: {
      task: "Ve tmě zazní každá klávesa jako tón; její název jde do odečítače obrazovky nebo na braillský řádek.",
      example: "Když odečítač obrazovky řekne K, stiskni K.",
    },
  },
};

/** ★ O2-LIB (30.10.2026): das Höhlen-Blatt bulgarisch, in beiden Fassungen („Къ" = die Silbe des Höhlenwesens für К). */
const HOEHLE_TAGEBUCH_BG: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Тук е тъмно - пещерното същество казва всеки клавиш, а ти пишеш само по слух.",
      example: "Ако чуеш Къ, натискаш К.",
    },
    erwachsen: {
      task: "В тъмното пещерното същество съобщава всеки клавиш - пиши по слух.",
      example: "Ако чуеш Къ, натисни К.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Тук е тъмно - всеки клавиш звучи като тон, а екранният четец или брайловият дисплей ти казва кой е.",
      example: "Ако екранният ти четец каже К, натискаш К.",
    },
    erwachsen: {
      task: "В тъмното всеки клавиш звучи като тон; името му отива към екранния четец или брайловия дисплей.",
      example: "Ако екранният четец каже К, натисни К.",
    },
  },
};

/** ★ O2-LIB (30.10.2026): das Höhlen-Blatt griechisch, in beiden Fassungen (εσύ). Die Silbe für K ist der Buchstabenname κάπα. */
const HOEHLE_TAGEBUCH_EL: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Εδώ είναι σκοτάδι - το πλάσμα της σπηλιάς λέει κάθε πλήκτρο και εσύ γράφεις μόνο με την ακοή.",
      example: "Όταν ακούσεις κάπα, πατάς το Κ.",
    },
    erwachsen: {
      task: "Στο σκοτάδι το πλάσμα της σπηλιάς ανακοινώνει κάθε πλήκτρο - γράψε με την ακοή.",
      example: "Όταν ακούσεις κάπα, πάτησε το Κ.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Εδώ είναι σκοτάδι - κάθε πλήκτρο παίζει έναν ήχο και ο αναγνώστης οθόνης ή η οθόνη braille σου λέει ποιο είναι.",
      example: "Όταν ο αναγνώστης οθόνης σου πει κάπα, πατάς το Κ.",
    },
    erwachsen: {
      task: "Στο σκοτάδι κάθε πλήκτρο παίζει έναν ήχο και το όνομά του πηγαίνει στον αναγνώστη οθόνης ή στην οθόνη braille.",
      example: "Όταν ο αναγνώστης οθόνης πει κάπα, πάτησε το Κ.",
    },
  },
};

/** ★ O2-LIB (30.10.2026): das Höhlen-Blatt ungarisch, in beiden Fassungen (Silbe „ká" für K). */
const HOEHLE_TAGEBUCH_HU: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Itt sötét van - a barlanglakó bemondja minden billentyűt, te csak hallás után gépelsz.",
      example: "Ha azt hallod, hogy ká, a K billentyűt nyomod meg.",
    },
    erwachsen: {
      task: "A sötétben a barlanglakó bemondja minden billentyűt - hallás után gépelj.",
      example: "Ha azt hallod, hogy ká, nyomd meg a K billentyűt.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Itt sötét van - minden billentyű hangként szólal meg, és a képernyőolvasó vagy a Braille-kijelző megmondja, melyik az.",
      example: "Ha a képernyőolvasó azt mondja: K, a K billentyűt nyomod meg.",
    },
    erwachsen: {
      task: "A sötétben minden billentyű hangként szólal meg; a nevét a képernyőolvasó vagy a Braille-kijelző kapja.",
      example: "Ha a képernyőolvasó azt mondja: K, nyomd meg a K billentyűt.",
    },
  },
};

/** ★ O2-LIB (30.10.2026): das Höhlen-Blatt niederländisch, in beiden Fassungen. Die Silbe für K ist der Name des Buchstabens: "ka". */
const HOEHLE_TAGEBUCH_NL: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Het is hier donker - het grotwezen zegt elke toets en jij typt alleen op het gehoor.",
      example: "Hoor je ka, dan druk je op K.",
    },
    erwachsen: {
      task: "In het donker zegt het grotwezen elke toets - typ op het gehoor.",
      example: "Hoor je ka, druk dan op K.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Het is hier donker - elke toets klinkt als een toon en je schermlezer of brailleleesregel zegt welke het is.",
      example: "Zegt je schermlezer K, dan druk je op K.",
    },
    erwachsen: {
      task: "In het donker klinkt elke toets als een toon; de naam gaat naar de schermlezer of de brailleleesregel.",
      example: "Zegt de schermlezer K, druk dan op K.",
    },
  },
};

/** ★ O2-LIB (30.10.2026): a folha da gruta do diário da expedição em português (Portugal), nas duas versões; "Cá" é o nome da letra K. */
const HOEHLE_TAGEBUCH_PT: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Aqui está escuro - a criatura da gruta diz cada tecla e tu escreves só de ouvido.",
      example: "Se ouvires \"cá\", é o K: prime K.",
    },
    erwachsen: {
      task: "No escuro, a criatura da gruta anuncia cada tecla - escreve de ouvido.",
      example: "Se ouvires \"cá\", é o K: prime K.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Aqui está escuro - cada tecla soa como um tom, e o leitor de ecrã ou a linha braille diz-te qual é.",
      example: "Se o teu leitor de ecrã disser K, prime K.",
    },
    erwachsen: {
      task: "No escuro, cada tecla soa como um tom; o nome dela vai para o leitor de ecrã ou para a linha braille.",
      example: "Se o leitor de ecrã disser K, prime K.",
    },
  },
};

/** ★ O2-LIB (30.10.2026): das Höhlen-Blatt, Portugiesisch (Brasilien), in beiden Fassungen - die Silbe für K ist "Cá". */
const HOEHLE_TAGEBUCH_BR: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Aqui está escuro - a criatura da caverna diz cada tecla, e você digita só de ouvido.",
      example: "Se você ouvir Cá, é o K: pressione K.",
    },
    erwachsen: {
      task: "No escuro, a criatura da caverna anuncia cada tecla - digite de ouvido.",
      example: "Se ouvir Cá, é o K: pressione K.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Aqui está escuro - cada tecla soa como um tom, e o leitor de tela ou a linha braille diz qual é.",
      example: "Se o seu leitor de tela disser K, pressione K.",
    },
    erwachsen: {
      task: "No escuro, cada tecla soa como um tom; o nome dela vai para o leitor de tela ou para a linha braille.",
      example: "Se o leitor de tela disser K, pressione K.",
    },
  },
};

/** ★ O2-LIB (30.10.2026): das Höhlen-Blatt rumänisch, in beiden Fassungen. Die Silbe „Ca" ist der Buchstabenname von K. */
const HOEHLE_TAGEBUCH_RO: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "E întuneric - făptura peșterii spune fiecare tastă, iar tu scrii doar după ureche.",
      example: "Dacă auzi Ca, apeși tasta K.",
    },
    erwachsen: {
      task: "În întuneric, făptura peșterii anunță fiecare tastă - scrie după ureche.",
      example: "Dacă auzi Ca, apasă tasta K.",
    },
  },
  ohneWesen: {
    kind: {
      task: "E întuneric - fiecare tastă sună ca un ton, iar cititorul de ecran sau afișajul braille îți spune care este.",
      example: "Dacă cititorul tău de ecran spune K, apeși tasta K.",
    },
    erwachsen: {
      task: "În întuneric, fiecare tastă sună ca un ton; numele ei ajunge la cititorul de ecran sau pe afișajul braille.",
      example: "Dacă cititorul de ecran spune K, apasă tasta K.",
    },
  },
};

/** ★ O2-LIB (29.10.2026): das Höhlen-Blatt schwedisch, in beiden Fassungen. */
const HOEHLE_TAGEBUCH_SV: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Här är det mörkt - grottvarelsen säger varje tangent, och du skriver bara med hjälp av hörseln.",
      example: "Hör du kå, trycker du på K.",
    },
    erwachsen: {
      task: "I mörkret säger grottvarelsen varje tangent - skriv med hörseln.",
      example: "Hör du kå, trycker du på K.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Här är det mörkt - varje tangent ljuder som en ton, och din skärmläsare eller ditt punktskriftsdisplay säger vilken det är.",
      example: "Säger din skärmläsare K, trycker du på K.",
    },
    erwachsen: {
      task: "I mörkret ljuder varje tangent som en ton; dess namn går till skärmläsaren eller punktskriftsdisplayet.",
      example: "Säger skärmläsaren K, trycker du på K.",
    },
  },
};

/** ★ O2-LIB (30.10.2026): das Höhlen-Blatt ukrainisch, in beiden Fassungen („Ка" ist der Name der Taste К). */
const HOEHLE_TAGEBUCH_UK: HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }> = {
  mitWesen: {
    kind: {
      task: "Тут темно - печерна істота називає кожну клавішу, а ти друкуєш лише на слух.",
      example: "Чуєш Ка - натискаєш К.",
    },
    erwachsen: {
      task: "У темряві печерна істота називає кожну клавішу - друкуй на слух.",
      example: "Чуєш Ка - натискай К.",
    },
  },
  ohneWesen: {
    kind: {
      task: "Тут темно - кожна клавіша звучить як тон, а читач екрана або брайлівський дисплей каже тобі, яка це.",
      example: "Якщо твій читач екрана каже К, ти натискаєш К.",
    },
    erwachsen: {
      task: "У темряві кожна клавіша звучить як тон; її назва йде до читача екрана або на брайлівський дисплей.",
      example: "Якщо читач екрана каже К, натискай К.",
    },
  },
};

// ★ Eine Datendatei darf keinen Code importieren (Bündel-Aufteilung): der Rückfall auf Englisch für die
// neuen Sprachen steht darum HIER und nicht über `mitRueckfallEn` aus dem Sprachregister.
const HOEHLE_TAGEBUCH: Record<BedienSprache, HoehleFassungen<{ kind: DiaryText; erwachsen: DiaryText }>> = {
  ...HOEHLE_TAGEBUCH_FERTIG,
  it: HOEHLE_TAGEBUCH_IT,
  pl: HOEHLE_TAGEBUCH_PL, // ★ O-PL (02.10.2026)
  tr: HOEHLE_TAGEBUCH_TR, // ★ O-TR (02.10.2026)
  cs: HOEHLE_TAGEBUCH_CS, // ★ O-CS (03.10.2026)
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: HOEHLE_TAGEBUCH_BG,
  el: HOEHLE_TAGEBUCH_EL,
  hu: HOEHLE_TAGEBUCH_HU,
  nl: HOEHLE_TAGEBUCH_NL,
  pt: HOEHLE_TAGEBUCH_PT,
  br: HOEHLE_TAGEBUCH_BR,
  ro: HOEHLE_TAGEBUCH_RO,
  sv: HOEHLE_TAGEBUCH_SV,
  uk: HOEHLE_TAGEBUCH_UK,
};

/**
 * ★ O2-LIB (29.10.2026): das Tagebuch bulgarisch, ти. Beispiele: „дом", О (auf der BDS-Tastatur
 * trägt F die Taste О), А, С, Д, „радио" (Funkstation, steht in keiner Rätselliste). Kein
 * Geschlecht: Präsens, Zukunft und Befehlsform. Keine Anführungszeichen - das Beispiel geht in die Ansage.
 */
const DIARY_KID_BG: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Скачай по ледените късове и винаги натискай клавиша, който свети на следващия къс.",
    example: "Когато свети О, натискаш О.",
  },
  climb: {
    task: "На всяка опора напиши кратка група от знаци и се изкачваш по-нависоко.",
    example: "Когато там пише дом, пишеш д, о, м.",
  },
  storm: {
    task: "Запомни знаците на таблото - после вятърът ги отнася и ти ги пишеш по памет.",
    example: "Когато запомниш А, С, Д, после пишеш А, С, Д.",
  },
  station: {
    task: "Буквите са разбъркани - познай думата и я напиши в правилния ред; ако не знаеш как да продължиш, клавишът Tab ти подсказва буква.",
    example: "От буквите о, и, д, а, р се получава думата радио.",
  },
  slide: {
    task: "Буквите летят към теб - натисни всяка точно в мига, когато е във вратата: при ясния звук, не по-рано.",
    example: "Когато към теб лети О, изчакай да стигне до вратата и тогава натисни О.",
  },
};

const DIARY_ADULT_BG: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Всеки път натисни клавиша на следващия леден къс, който свети.",
    example: "Когато свети О, натисни О.",
  },
  climb: {
    task: "На всяка опора напиши кратка група от знаци - така се изкачваш по-нависоко.",
    example: "Когато там пише дом, напиши д, о, м.",
  },
  storm: {
    task: "Запомни групата от знаци; вятърът я отнася, после я напиши по памет.",
    example: "Показва се А, С, Д - след това пишеш А, С, Д.",
  },
  station: {
    task: "Буквите на думата са разбъркани - познай думата и я напиши в правилния ред; при нужда клавишът Tab показва следващата буква.",
    example: "От буквите о, и, д, а, р се получава думата радио.",
  },
  slide: {
    task: "Към теб лети една буква - напиши я точно в мига, когато стигне финала (ясен звук на целта), не по-рано.",
    example: "Когато към теб лети О, натисни О, щом е във вратата.",
  },
};

// ★ O-EL-LIB (30.10.2026): das Tagebuch griechisch, εσύ. Beispiele: Φ (Taste in der Grundreihe), Α, Σ, Δ (kein Wort),
// σκι (σ, κ, ι), ράδιο (passt zur Funkstation). Keine Anführungszeichen - das Beispiel geht in die Ansage.
const DIARY_KID_EL: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Πήδα στα παγοκομμάτια και πάτησε πάντα το πλήκτρο που φωτίζεται στο επόμενο παγοκομμάτι.",
    example: "Αν φωτίζεται το Φ, πατάς το Φ.",
  },
  climb: {
    task: "Σε κάθε στήριγμα γράψε τη σύντομη ομάδα χαρακτήρων και ανεβαίνεις ψηλότερα.",
    example: "Αν γράφει η λέξη σκι, γράφεις σ, κ, ι.",
  },
  storm: {
    task: "Θυμήσου τους χαρακτήρες στον πίνακα - μετά τους παίρνει ο άνεμος και εσύ τους γράφεις από μνήμης.",
    example: "Αν θυμηθείς Α, Σ, Δ, μετά γράφεις Α, Σ, Δ.",
  },
  station: {
    task: "Τα γράμματα είναι ανακατεμένα - βρες τη λέξη και γράψε την με τη σωστή σειρά. Αν κολλήσεις, το πλήκτρο Tab σου δίνει ένα γράμμα.",
    example: "Από τα γράμματα ο, ι, δ, α, ρ προκύπτει η λέξη ράδιο.",
  },
  slide: {
    task: "Τα γράμματα έρχονται καταπάνω σου - πάτησε το καθένα ακριβώς τη στιγμή που βρίσκεται στην πύλη: στον φωτεινό ήχο, όχι νωρίτερα.",
    example: "Αν έρχεται το Φ, περίμενε να φτάσει στην πύλη και μετά πάτησε το Φ.",
  },
};

const DIARY_ADULT_EL: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Κάθε φορά πάτησε το πλήκτρο του επόμενου παγοκομματιού που φωτίζεται.",
    example: "Αν φωτίζεται το Φ, πάτησε το Φ.",
  },
  climb: {
    task: "Σε κάθε στήριγμα γράψε μια σύντομη ομάδα χαρακτήρων - έτσι ανεβαίνεις ψηλότερα.",
    example: "Αν γράφει η λέξη σκι, γράψε σ, κ, ι.",
  },
  storm: {
    task: "Απομνημόνευσε την ομάδα χαρακτήρων. Την παίρνει ο άνεμος, μετά γράψε την από μνήμης.",
    example: "Εμφανίζεται Α, Σ, Δ - μετά γράφεις Α, Σ, Δ.",
  },
  station: {
    task: "Τα γράμματα μιας λέξης είναι ανακατεμένα - βρες τη λέξη και γράψε την με τη σωστή σειρά. Αν χρειαστεί, το πλήκτρο Tab αποκαλύπτει το επόμενο γράμμα.",
    example: "Από τα γράμματα ο, ι, δ, α, ρ προκύπτει η λέξη ράδιο.",
  },
  slide: {
    task: "Ένα γράμμα έρχεται προς το μέρος σου - γράψε το ακριβώς τη στιγμή που φτάνει στον τερματισμό (φωτεινός ήχος στόχου), όχι νωρίτερα.",
    example: "Αν έρχεται το Φ, πάτησε το Φ μόλις βρεθεί στην πύλη.",
  },
};

/** ★ O2-LIB (29.10.2026): das Tagebuch, Ungarisch (te). Beispiele: kéz, A S D, rádió. Keine Anführungszeichen (geht in die Ansage). */
const DIARY_KID_HU: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Ugorj a jégtáblákon, és mindig azt a billentyűt nyomd meg, amelyik a következő jégtáblán világít.",
    example: "Ha az F világít, az F billentyűt nyomod meg.",
  },
  climb: {
    task: "Minden kapaszkodónál írd be a rövid jelcsoportot, és feljebb másztál.",
    example: "Ha a kéz szó áll ott, beírod: k, é, z.",
  },
  storm: {
    task: "Jegyezd meg a táblán lévő jeleket - aztán a szél elfújja őket, te pedig emlékezetből beírod.",
    example: "Ha megjegyezted az A, S, D jeleket, akkor beírod: A, S, D.",
  },
  station: {
    task: "A betűk összekeveredtek - találd ki a szót, és írd be a helyes sorrendben; ha elakadsz, a Tab billentyű elárul egy betűt.",
    example: "Az o, i, d, á, r betűkből lesz a rádió szó.",
  },
  slide: {
    task: "A betűk szembe repülnek veled - mindegyiket pontosan akkor nyomd meg, amikor a kapuban van: a világos hangnál, nem előbb.",
    example: "Ha egy F repül feléd, várd meg, amíg a kapuban van, és akkor nyomd meg az F billentyűt.",
  },
};

const DIARY_ADULT_HU: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Mindig a következő, kivilágított jégtábla billentyűjét nyomd meg.",
    example: "Ha az F világít, nyomd meg az F billentyűt.",
  },
  climb: {
    task: "Minden kapaszkodónál írd be a rövid jelcsoportot - így jutsz feljebb.",
    example: "Ha a kéz szó áll ott, írd be: k, é, z.",
  },
  storm: {
    task: "Jegyezd meg a jelcsoportot; a szél elfújja, utána írd be emlékezetből.",
    example: "Megjelenik az A, S, D - utána beírod: A, S, D.",
  },
  station: {
    task: "A szó betűi összekeveredtek - találd ki a szót, és írd be a helyes sorrendben; ha kell, a Tab billentyű elárulja a következő betűt.",
    example: "Az o, i, d, á, r betűkből lesz a rádió szó.",
  },
  slide: {
    task: "Egy betű repül feléd - pontosan akkor írd be, amikor a célba ér (világos célhang), nem előbb.",
    example: "Ha egy F repül feléd, nyomd meg az F billentyűt, amint a kapuban van.",
  },
};

/** ★ O2-LIB (29.10.2026): das Expeditionstagebuch niederländisch. Beispiele: "kas" (k, a, s liegen in der basisrij), A, S, D, "radio" (steht in keiner Rätselliste). Keine Anführungszeichen - das Beispiel geht in die Ansage. */
const DIARY_KID_NL: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Spring over de ijsschotsen en druk steeds op de toets die oplicht op de volgende ijsschots.",
    example: "Licht er een F op, dan druk je op F.",
  },
  climb: {
    task: "Typ bij elk houvast de korte reeks tekens, dan klim je hoger.",
    example: "Staat er het woord kas, dan typ je k, a, s.",
  },
  storm: {
    task: "Onthoud de tekens op het bord - dan waaien ze weg en typ je ze uit je hoofd.",
    example: "Onthoud je A, S, D, dan typ je daarna A, S, D.",
  },
  station: {
    task: "De letters staan door elkaar - bedenk welk woord het is en typ het in de goede volgorde; kom je er niet uit, dan geeft de toets Tab je een letter.",
    example: "Uit de letters o, i, d, a, r maak je het woord radio.",
  },
  slide: {
    task: "De letters vliegen op je af - druk op elke letter precies als die in de poort is: bij de heldere toon, niet eerder.",
    example: "Vliegt er een F op je af, wacht dan tot hij in de poort is en druk dan op F.",
  },
};

const DIARY_ADULT_NL: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Druk steeds op de toets van de volgende ijsschots die oplicht.",
    example: "Licht er een F op, druk dan op F.",
  },
  climb: {
    task: "Typ bij elk houvast de korte reeks tekens om hoger te komen.",
    example: "Staat er het woord kas, typ dan k, a, s.",
  },
  storm: {
    task: "Onthoud de reeks tekens; die waait weg, typ hem dan uit het hoofd.",
    example: "A, S, D wordt getoond - daarna typ je A, S, D.",
  },
  station: {
    task: "De letters van een woord staan door elkaar - bedenk welk woord het is en typ het in de goede volgorde; zo nodig onthult de toets Tab de volgende letter.",
    example: "Uit de letters o, i, d, a, r maak je het woord radio.",
  },
  slide: {
    task: "Eén letter vliegt op je af - typ die precies als hij de finish bereikt (heldere doeltoon), niet eerder.",
    example: "Vliegt er een F op je af, druk dan op F zodra die in de poort is.",
  },
};

// ★ O-LIB (30.10.2026): o diário em português, tu. Exemplos: „sal" (s, a, l estão na fila de base de todos os
// teclados portugueses), A, S, D (nenhuma palavra), „rádio" (cabe na estação de rádio e não está em nenhuma
// lista de enigmas, §7). Sem género: presente e imperativo. Sem aspas - o exemplo vai para o anúncio.
const DIARY_KID_PT: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Salta pelos blocos de gelo e prime sempre a tecla que se acende no bloco seguinte.",
    example: "Se acender F, primes F.",
  },
  climb: {
    task: "Escreve a pequena sequência de carateres em cada apoio e sobes mais alto.",
    example: "Se lá estiver a palavra sal, escreves s, a, l.",
  },
  storm: {
    task: "Memoriza os carateres no quadro - depois o vento leva-os e tu escreves-os de memória.",
    example: "Se memorizares A, S, D, depois escreves A, S, D.",
  },
  station: {
    task: "As letras estão misturadas - descobre a palavra e escreve-a pela ordem certa; se não souberes continuar, a tecla de tabulação dá-te uma letra.",
    example: "Com as letras o, i, d, á, r forma-se a palavra rádio.",
  },
  slide: {
    task: "As letras voam ao teu encontro - prime cada uma exatamente quando estiver no portão: ao som claro, não antes.",
    example: "Se vier a voar um F, espera que esteja no portão e depois prime F.",
  },
};

const DIARY_ADULT_PT: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "De cada vez, prime a tecla do bloco seguinte que se acende.",
    example: "Se acender F, prime F.",
  },
  climb: {
    task: "Escreve a pequena sequência de carateres em cada apoio - assim sobes mais alto.",
    example: "Se lá estiver a palavra sal, escreve s, a, l.",
  },
  storm: {
    task: "Memoriza a sequência de carateres; o vento leva-a, depois escreve-a de memória.",
    example: "Aparece A, S, D - a seguir escreves A, S, D.",
  },
  station: {
    task: "As letras da palavra estão misturadas - descobre a palavra e escreve-a pela ordem certa; se for preciso, a tecla de tabulação revela a letra seguinte.",
    example: "Com as letras o, i, d, á, r forma-se a palavra rádio.",
  },
  slide: {
    task: "Voa ao teu encontro uma única letra - escreve-a exatamente quando chegar à meta (som claro do alvo), não antes.",
    example: "Se vier a voar um F, prime F assim que estiver no portão.",
  },
};

/**
 * ★ O2-LIB (29.10.2026): das Tagebuch, Portugiesisch (Brasilien), você. Beispiele: "gato" (g, a, t, o),
 * F, A S D, "rádio" (passt zur Funkstation, steht in keiner Rätselliste). Keine Anführungszeichen -
 * das Beispiel geht in die Ansage. Kein Geschlecht.
 */
const DIARY_KID_BR: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Pule pelas placas e pressione sempre a tecla que acende na próxima placa.",
    example: "Se o F acender, pressione F.",
  },
  climb: {
    task: "Em cada apoio, digite a sequência curta de caracteres e você sobe mais.",
    example: "Se aparecer a palavra gato, digite g, a, t, o.",
  },
  storm: {
    task: "Memorize os caracteres do quadro - depois o vento os leva e você digita de memória.",
    example: "Se você memorizar A, S, D, depois digita A, S, D.",
  },
  station: {
    task: "As letras estão embaralhadas - descubra a palavra e digite na ordem certa; se travar, a tecla Tab mostra uma letra.",
    example: "As letras o, i, d, á, r formam a palavra rádio.",
  },
  slide: {
    task: "As letras voam na sua direção - pressione cada uma exatamente quando estiver no portão: no som claro, não antes.",
    example: "Se um F vier voando, espere até ele estar no portão e então pressione F.",
  },
};

const DIARY_ADULT_BR: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Pressione sempre a tecla da próxima placa que acende.",
    example: "Se o F acender, pressione F.",
  },
  climb: {
    task: "Digite a sequência curta de caracteres em cada apoio para subir.",
    example: "Se aparecer a palavra gato, digite g, a, t, o.",
  },
  storm: {
    task: "Memorize a sequência de caracteres; o vento a leva, depois digite de memória.",
    example: "Aparece A, S, D - depois você digita A, S, D.",
  },
  station: {
    task: "As letras de uma palavra estão embaralhadas - descubra a palavra e digite na ordem certa; se necessário, a tecla Tab revela a próxima letra.",
    example: "As letras o, i, d, á, r formam a palavra rádio.",
  },
  slide: {
    task: "Uma letra voa na sua direção - digite-a exatamente quando chegar à linha de chegada (som claro do alvo), não antes.",
    example: "Se um F vier voando, pressione F assim que ele estiver no portão.",
  },
};

/**
 * ★ O2-LIB (29.10.2026): das Tagebuch rumänisch, tu. Beispiele: „las“ (l, a, s liegen in der
 * Grundreihe der rumänischen Tastatur), A, S, D (kein Wort), „radio“ (passt zur Funkstation und
 * steht in keiner Rätselliste). Kein Geschlecht: Präsens und Befehlsform. Keine Anführungszeichen -
 * das Beispiel geht in die Ansage.
 */
const DIARY_KID_RO: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Sari din sloi în sloi și apasă mereu tasta care luminează pe următorul sloi.",
    example: "Dacă luminează F, apeși F.",
  },
  climb: {
    task: "La fiecare priză scrii grupul scurt de caractere și urci mai sus.",
    example: "Dacă scrie cuvântul las, scrii l, a, s.",
  },
  storm: {
    task: "Ține minte caracterele de pe tablă - apoi vântul le spulberă, iar tu le scrii din memorie.",
    example: "Dacă ții minte A, S, D, apoi scrii A, S, D.",
  },
  station: {
    task: "Literele sunt amestecate - descoperă cuvântul și scrie-l în ordinea corectă; dacă nu mai știi, tasta Tab îți dă o literă.",
    example: "Din literele o, i, d, a, r se formează cuvântul radio.",
  },
  slide: {
    task: "Literele zboară spre tine - apasă fiecare literă exact când este în poartă: la sunetul clar, nu mai devreme.",
    example: "Dacă zboară spre tine F, așteaptă până ajunge în poartă și apoi apasă F.",
  },
};

const DIARY_ADULT_RO: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "De fiecare dată, apasă tasta următorului sloi, cea care luminează.",
    example: "Dacă luminează F, apasă F.",
  },
  climb: {
    task: "La fiecare priză scrie grupul scurt de caractere - așa ajungi mai sus.",
    example: "Dacă scrie cuvântul las, scrie l, a, s.",
  },
  storm: {
    task: "Ține minte grupul de caractere; vântul îl spulberă, apoi scrie-l din memorie.",
    example: "Apare A, S, D - după aceea scrii A, S, D.",
  },
  station: {
    task: "Literele unui cuvânt sunt amestecate - descoperă cuvântul și scrie-l în ordinea corectă; la nevoie, tasta Tab dezvăluie litera următoare.",
    example: "Din literele o, i, d, a, r se formează cuvântul radio.",
  },
  slide: {
    task: "Zboară spre tine o literă - scrie-o exact în clipa în care ajunge la țintă (sunet clar al țintei), nu mai devreme.",
    example: "Dacă zboară spre tine F, apasă F de îndată ce este în poartă.",
  },
};

/** ★ O2-LIB (30.10.2026): das Expeditionstagebuch schwedisch. Beispiele: "ask" (a, s, k liegen in der grundraden), A, S, D, "radio" (steht in keiner Rätselliste). Keine Anführungszeichen - das Beispiel geht in die Ansage. */
const DIARY_KID_SV: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Hoppa över isflaken och tryck alltid på tangenten som lyser på nästa isflak.",
    example: "Om ett F lyser trycker du på F.",
  },
  climb: {
    task: "Skriv den korta teckenföljden vid varje fotfäste, så klättrar du högre.",
    example: "Om det står ordet ask skriver du a, s, k.",
  },
  storm: {
    task: "Kom ihåg tecknen på tavlan - sedan blåser de bort och du skriver dem ur minnet.",
    example: "Om du kommer ihåg A, S, D skriver du sedan A, S, D.",
  },
  station: {
    task: "Bokstäverna ligger huller om buller - lista ut ordet och skriv det i rätt ordning; kör du fast ger tangenten Tabb dig en bokstav.",
    example: "Av bokstäverna o, i, d, a, r blir det ordet radio.",
  },
  slide: {
    task: "Bokstäverna flyger emot dig - tryck på varje bokstav exakt när den är i porten: vid den ljusa tonen, inte före.",
    example: "Om ett F flyger emot dig, vänta tills det är i porten och tryck sedan på F.",
  },
};

const DIARY_ADULT_SV: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Tryck varje gång på tangenten för nästa isflak som lyser.",
    example: "Om ett F lyser, tryck på F.",
  },
  climb: {
    task: "Skriv den korta teckenföljden vid varje fotfäste för att komma högre.",
    example: "Om det står ordet ask, skriv a, s, k.",
  },
  storm: {
    task: "Lär dig teckenföljden; den blåser bort, skriv den sedan ur minnet.",
    example: "A, S, D visas - efteråt skriver du A, S, D.",
  },
  station: {
    task: "Bokstäverna i ett ord ligger huller om buller - lista ut ordet och skriv det i rätt ordning; vid behov visar tangenten Tabb nästa bokstav.",
    example: "Av bokstäverna o, i, d, a, r blir det ordet radio.",
  },
  slide: {
    task: "En bokstav flyger emot dig - skriv den exakt när den når mållinjen (den ljusa måltonen), inte före.",
    example: "Om ett F flyger emot dig, tryck på F så fort det är i porten.",
  },
};

// ★ O2-LIB (30.10.2026): das Tagebuch ukrainisch, ти. Beispiele: „лад" (л, а, д liegen in der Grundreihe der ukrainischen
// Tastatur), А, О, Л (kein Wort), „радіо" (passt zur Funkstation, steht in keiner Rätselliste, §7). Kein Geschlecht:
// Gegenwart, Zukunft und Befehlsform. Keine Anführungszeichen - das Beispiel geht in die Ansage.
const DIARY_KID_UK: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Стрибай по крижинах і щоразу натискай клавішу, яка світиться на наступній крижині.",
    example: "Коли світиться А, натискаєш А.",
  },
  climb: {
    task: "На кожній опорі друкуй коротку групу знаків - і піднімешся вище.",
    example: "Коли там стоїть слово лад, друкуєш л, а, д.",
  },
  storm: {
    task: "Запам'ятай знаки на дошці - потім вітер здує їх, а ти надрукуєш їх з пам'яті.",
    example: "Коли запам'ятаєш А, О, Л, потім друкуєш А, О, Л.",
  },
  station: {
    task: "Літери переплутані - здогадайся, яке це слово, і надрукуй його в правильному порядку; якщо не знаєш, що далі, клавіша Tab підкаже літеру.",
    example: "З літер о, і, д, а, р виходить слово радіо.",
  },
  slide: {
    task: "Літери летять назустріч - натискай кожну точно тоді, коли вона у воротах: на яскравий звук, не раніше.",
    example: "Коли летить А, зачекай, поки вона буде у воротах, і тоді натисни А.",
  },
};

const DIARY_ADULT_UK: Record<ZoneOhneHoehle, DiaryText> = {
  water: {
    task: "Щоразу натискай клавішу наступної крижини, яка світиться.",
    example: "Коли світиться А, натисни А.",
  },
  climb: {
    task: "На кожній опорі друкуй коротку групу знаків - так піднімешся вище.",
    example: "Коли там стоїть слово лад, друкуй л, а, д.",
  },
  storm: {
    task: "Запам'ятай групу знаків; вітер здує її, потім надрукуй її з пам'яті.",
    example: "Показано А, О, Л - потім друкуєш А, О, Л.",
  },
  station: {
    task: "Літери слова переплутані - здогадайся, яке це слово, і надрукуй його в правильному порядку; за потреби клавіша Tab підкаже наступну літеру.",
    example: "З літер о, і, д, а, р виходить слово радіо.",
  },
  slide: {
    task: "Летить одна літера - надрукуй її точно тоді, коли вона досягає фінішу (яскравий звук цілі), не раніше.",
    example: "Коли летить А, натисни А, щойно вона у воротах.",
  },
};

/**
 * ★ E11a-5: Tagebuch-Tabellen je Bedienungssprache und Zielgruppe - statt der früheren
 * verschachtelten Weiche `sprache === "en" ? … : …`, die „fr" still auf Deutsch hätte
 * fallen lassen (Leitfaden Falle 30).
 */
const DIARY_JE_SPRACHE: Record<
  BedienSprache,
  { kind: Record<ZoneOhneHoehle, DiaryText>; erwachsen: Record<ZoneOhneHoehle, DiaryText> }
> = {
  de: { kind: DIARY_KID, erwachsen: DIARY_ADULT },
  en: { kind: DIARY_KID_EN, erwachsen: DIARY_ADULT_EN },
  fr: { kind: DIARY_KID_FR, erwachsen: DIARY_ADULT_FR },
  es: { kind: DIARY_KID_ES, erwachsen: DIARY_ADULT_ES },
  it: { kind: DIARY_KID_IT, erwachsen: DIARY_ADULT_IT },
  // ★ O-PL (02.10.2026): polnisch.
  pl: { kind: DIARY_KID_PL, erwachsen: DIARY_ADULT_PL },
  // ★ O-TR (02.10.2026): türkisch.
  tr: { kind: DIARY_KID_TR, erwachsen: DIARY_ADULT_TR },
  // ★ O-CS (03.10.2026): tschechisch.
  cs: { kind: DIARY_KID_CS, erwachsen: DIARY_ADULT_CS },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: { kind: DIARY_KID_BG, erwachsen: DIARY_ADULT_BG },
  el: { kind: DIARY_KID_EL, erwachsen: DIARY_ADULT_EL },
  hu: { kind: DIARY_KID_HU, erwachsen: DIARY_ADULT_HU },
  nl: { kind: DIARY_KID_NL, erwachsen: DIARY_ADULT_NL },
  pt: { kind: DIARY_KID_PT, erwachsen: DIARY_ADULT_PT },
  br: { kind: DIARY_KID_BR, erwachsen: DIARY_ADULT_BR },
  ro: { kind: DIARY_KID_RO, erwachsen: DIARY_ADULT_RO },
  sv: { kind: DIARY_KID_SV, erwachsen: DIARY_ADULT_SV },
  uk: { kind: DIARY_KID_UK, erwachsen: DIARY_ADULT_UK },
};

/**
 * Das Tagebuch-Blatt einer Zone (Aufgabe + Beispiel), je Zielgruppe (Bauplan §4.7).
 * ★ EN3: mit der Bedienungssprache - ohne Angabe Deutsch.
 * ★ E11a-5: alle drei Bedienungssprachen.
 * ★ 28.09.2026: mit dem Lernweg - die Höhle nennt das Wesen nur auf Weg „de"
 * ({@link hoehleHatWesen}). Ohne Angabe Weg „de".
 */
export function diaryText(
  zone: ZoneKind,
  isAdult: boolean,
  sprache: BedienSprache = "de",
  lernweg: Lernweg = "de",
): DiaryText {
  if (zone === "cave") {
    const blatt = HOEHLE_TAGEBUCH[sprache][hoehleHatWesen(lernweg) ? "mitWesen" : "ohneWesen"];
    return isAdult ? blatt.erwachsen : blatt.kind;
  }
  const satz = DIARY_JE_SPRACHE[sprache];
  const table = isAdult ? satz.erwachsen : satz.kind;
  return table[zone as ZoneOhneHoehle] ?? table.water;
}
