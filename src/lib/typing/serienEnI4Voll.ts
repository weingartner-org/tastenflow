/**
 * ENGLISCHE SERIEN AUF DEM VOLLEN ALPHABET (Charge I4, 28.08.2026).
 *
 * ── ANLASS, GEMESSEN ──────────────────────────────────────────────────────
 *
 * `npx tsx scripts/_i4regal.mts --lang en` sagte vor dieser Datei (Grundmenge
 * 151 Serien / 7368 Zeilen; Öffnungspunkte 13 / 17 / 20 / 22 / 26 / 31 / 99):
 *
 *   en/kids       [ 0, 11, 14, 17, 19, 22, 22]
 *   en/teens      [ 0, 11, 14, 16, 17, 24, 24]
 *   en/erwachsen  [ 0,  7, 10, 11, 12, 17, 17]
 *
 * Die Charge I4 hat den unteren Teil des Regals kräftig aufgefüllt - an den
 * Sprossen 17 bis 22 stehen jetzt sechzehn neue Serien. Genau dadurch ist die
 * SPITZE dünn geworden: zwischen Sprosse 26 und 31 kommen für `kids` nur drei,
 * für `teens` sieben und für `erwachsen` fünf Serien dazu. Ein Kind, das alle
 * sechsundzwanzig Buchstaben freigeschaltet hat, bekommt als Belohnung fast
 * nichts Neues zu lesen. Diese Datei legt vier Serien nach, die ausdrücklich
 * für das volle Alphabet gebaut sind.
 *
 * ── WARUM DIESE VIER DAS VOLLE ALPHABET BRAUCHEN ──────────────────────────
 *
 * `y`, `x` und `q` kommen in der Einführungsreihenfolge erst an Position 29,
 * 28 und 30. Am Objekt gemessen (`INTRO_ORDER` aus `letters.ts`):
 *
 *   Sprosse 26 und 27: gesperrt bleiben **q x y**
 *   Sprosse 28:        gesperrt bleiben **q y**   (x ist frei)
 *   Sprosse 29:        gesperrt bleibt  **q**     (x und y sind frei)
 *   Sprosse 30 und 31: nichts mehr gesperrt
 *
 * ⚠️ Daraus folgt etwas, das man wissen muss, bevor man eine „Serie für
 * Sprosse 27" plant: **die Sprosse 27 ist gar nicht erreichbar.** An Position
 * 26 und 27 stehen `ä` und `ü`, die im Englischen tot sind - eine Serie, die
 * ohne `q x y` auskommt, öffnet also bei 26, nie bei 27. Erreichbar sind im
 * oberen Feld nur 28 (mit `x`, ohne `y q`), 29 (mit `y`, ohne `q`) und 30
 * (mit `q`). Alle vier Serien hier tragen `q`, `x` UND `y` und öffnen deshalb
 * gemessen bei **30**.
 *
 * Das ist kein Selbstzweck. Die vier Stoffe sind ohne diese Buchstaben
 * schlicht nicht ehrlich erzählbar:
 *   • Braille steht und fällt mit **six** dots und **sixty-four** Mustern.
 *   • Geld heißt **money** - schon das Thema trägt ein `y`; dazu
 *     **exchanged**, **exactly**.
 *   • Der Akku braucht **energy**, **exactly**, **quiet**.
 *   • Und in der Geschichte heißt der Steinbruch **quarry**.
 * Dazu kommt, was allen vier zugutekommt und unterhalb von 29 vollständig
 * fehlt: **you, they, every, only, very, day, year, why, story, city,
 * question, quickly, next, explain**. Erst hier klingt englischer Text
 * wieder wie englischer Text und nicht wie eine Umgehung.
 *
 * ── WIE BELEGT WURDE (die Regel dieser Charge) ────────────────────────────
 *
 * Johannes für I4: „Wichtig sind gute aktuelle Texte!" Deshalb ist jede
 * Sachaussage der drei Wissens-Serien an **zwei voneinander unabhängigen
 * Quellen** geprüft - nie zweimal dieselbe Datenbank, nie Wikipedia gegen
 * Wikipedia. Beide Quellen stehen im Klartext in `herkunft.fundstelle`, mit
 * Abrufdatum. Herangezogen wurden:
 *
 *   • „The Six Dots": RNIB (Braille through the years) und American
 *     Foundation for the Blind (Life and Legacy of Louis Braille), gegen
 *     Library of Congress NLS gegengelesen.
 *   • „Where Money Came From": Bank of England (Erklärstücke „How has money
 *     changed over time" und „What is money") und British Museum, Money
 *     Gallery (Room 68).
 *   • „What a Battery Really Does": NobelPrize.org (Chemie 2019,
 *     Lithium-Ionen-Batterie) und The Electrochemical Society (History of
 *     Electrochemistry: From Volta to Edison); für die Alterungs-Etappe
 *     zusätzlich das National Renewable Energy Laboratory (US-DOE) und die
 *     Royal Society of Chemistry (PCCP-Übersicht zur Degradation) - siehe
 *     Punkt 6 weiter unten.
 *
 * WO EINE ZEILE ABSICHTLICH VORSICHTIG FORMULIERT IST - und warum:
 *
 *  1. **„sixty-four patterns in all, the empty one included."** Die Quellen
 *     widersprechen sich scheinbar: RNIB schreibt 63 Möglichkeiten, die AFB
 *     schreibt 64. Beide haben recht - 2 hoch 6 = 64 Muster, davon eines
 *     leer, also 63 nutzbare Zeichen. Die Zeile nennt die 64 UND sagt dazu,
 *     dass das leere Muster mitgezählt ist; damit stimmt sie gegen beide
 *     Quellen. Ein bloßes „sixty-four" wäre gegen RNIB falsch gewesen.
 *  2. **„The oldest coins we know are well over two thousand years old."**
 *     Die Bank of England datiert die lydischen Elektron-Münzen auf etwa 700
 *     v. Chr., das British Museum auf etwa 650 v. Chr., andere Fachquellen
 *     auf 600 v. Chr. Statt eine der drei Zahlen zu wählen, steht hier eine
 *     Größenordnung, die unter jeder Lesart wahr bleibt.
 *  3. **Kein „Tauschwirtschaft kam zuerst".** Dass der Tauschhandel dem Geld
 *     historisch vorausging, ist in der Wirtschaftsanthropologie umstritten;
 *     die ältesten Schriftzeugnisse sind Schuldlisten, nicht Tauschprotokolle.
 *     Die Serie sagt deshalb nur, was der direkte Tausch NICHT leistet, und
 *     stellt die Schuldtafeln gleichrangig daneben.
 *  4. **„Salär kommt von Salz"** ist bewusst NICHT drin - eine hübsche, aber
 *     nicht haltbare Redensart.
 *  5. **Das Gewicht des leeren Akkus.** „It weighs exactly what it weighed
 *     when it was new" gilt für die geschlossene Zelle; der Massenunterschied
 *     der abgegebenen Energie ist nicht wägbar. Die Zeile ist als Alltagsfrage
 *     gebaut, nicht als physikalische Bilanz.
 *  6. **Alterung - in der Abnahme ERSETZT, und das ist die lehrreichste
 *     Notiz dieser Datei.** Hier stand zuerst „Heat speeds all of this up,
 *     and so does sitting at full charge." Der Verfasser hat selbst gemeldet,
 *     dass er dafür nur Übersichtsliteratur und keine zwei gleichwertigen
 *     Institutionsquellen hatte - der Ladezustands-Teil war der wacklige. Die
 *     Abnahme hat die Zeile daraufhin gestrichen, nicht abgeschwächt: eine
 *     Aussage, von der ihr Autor sagt, dass sie den Maßstab nicht erreicht,
 *     darf nicht mitfahren, sonst ist die Zwei-Quellen-Regel eine Behauptung
 *     und keine Regel. An ihrer Stelle steht jetzt „A battery ages even when
 *     nobody uses it at all." - die Kalenderalterung, belegt am National
 *     Renewable Energy Laboratory (US-Energieministerium) und unabhängig
 *     davon an der Übersicht der Royal Society of Chemistry (PCCP,
 *     »Lithium ion battery degradation: what you need to know«). Beide
 *     beschreiben denselben Befund: eine Zelle verliert Kapazität auch im
 *     Ruhezustand, und Wärme beschleunigt das. Damit trägt die Folgezeile
 *     („A cell left hot all summer ages faster than one kept indoors")
 *     dieselben zwei Quellen. Die Herkunft der Akku-Serie nennt deshalb VIER
 *     Quellen statt zwei.
 *     ⚠️ Für die nächste Charge: der Ladezustand ist der Punkt, an dem die
 *     Literatur uneins wird (die Alterung steigt nicht gleichmäßig mit dem
 *     Ladestand). Wer darüber schreiben will, braucht mehr als eine Übersicht.
 *  7. **Kälte.** „Warm it again and most of that capacity comes straight
 *     back" - „most", nicht „all": bei starkem Frost bleibt ein kleiner Teil
 *     dauerhaft weg.
 *
 * ZAHLEN: Ziffern sind im Text verboten, alle Zahlen sind ausgeschrieben. Wo
 * eine Zahl schnell veraltet, steht keine (Reichweiten, Preise, Marktanteile
 * kommen nicht vor). Jahreszahlen stehen nur dort, wo sie feststehen:
 * achtzehnhundertneun, achtzehnhundert, achtzehnhundertzweiundfünfzig,
 * achtzehnhundertvierundfünfzig, zweitausendneunzehn.
 *
 * INHALTLICHES: nichts politisch Strittiges, nichts Religiöses, nichts
 * Gruseliges. Louis Braille verliert sein Augenlicht in EINER schlichten Zeile
 * ohne Unfallschilderung; auf der Kinder-Stufe hat ein Unglück nichts zu
 * suchen. **Person zuerst** durchgehend: `children who were blind`, `a reader
 * who is blind`, `an organist who is blind` - nie die andere Reihenfolge. Kein
 * Maus-Vokabular; die Zeile über das Arbeiten am Rechner spricht von der
 * Braillezeile, nicht von einem Zeigegerät. Kein rührseliger Ton: die
 * Braille-Serie erzählt eine Technikgeschichte, keine Heldengeschichte.
 *
 * ── DIE VIER SERIEN ───────────────────────────────────────────────────────
 *
 *  1. **The Six Dots** - `wissen-serie`, `kids` + `teens`, topic `sinne`.
 *     Wie die Brailleschrift gebaut ist und wie sie entstand: erst die Zelle
 *     mit ihren sechs Punkten, dann die schweren Reliefdruck-Bücher und
 *     Barbiers Zwölf-Punkt-Schrift, dann der Fünfzehnjährige, der halbiert -
 *     und zum Schluss die Schule, die seine Schrift jahrelang nicht
 *     unterrichtete, und die Braillezeile von heute.
 *
 *  2. **Where Money Came From** - `wissen-serie`, `kids` + `teens`, topic
 *     `alltag`. Vom direkten Tausch über Vieh, Korn und Kaurischnecken zu den
 *     lydischen Münzen, weiter zum chinesischen Papiergeld und zum
 *     handgeschriebenen Versprechen der Bank of England - bis zu der Frage,
 *     was eine Zahl im Rechner einer Bank eigentlich wert ist.
 *
 *  3. **What a Battery Really Does** - `wissen-serie`, `teens` +
 *     `erwachsen`, topic `technik`. Der leere Akku wiegt so viel wie der
 *     volle; ein Akku speichert überhaupt keinen Strom. Von Voltas Säule und
 *     seinem falschen Grund über die umkehrbare Reaktion und die wandernden
 *     Lithium-Ionen bis zu der Frage, warum ein Telefon nach drei Jahren
 *     weniger hält.
 *
 *  4. **The Quarry Road** - `geschichte`, nur `erwachsen`, topic `arbeit`.
 *     Marta Quinn fährt Schotter aus dem Steinbruch und nimmt seit neun
 *     Jahren den langen Weg um das Dorf. Dann hängt im Hof eine Tafel mit
 *     Ladungszahlen je Fahrerin, und im Dorf zählt Joyce Hallam am Tor die
 *     Lastwagen. Ein Konflikt ohne Bösewicht: Martas ehrliche Haltung kostet
 *     die Kollegen Geld, ihre Fahrtenbücher sind das einzige Zahlenwerk, das
 *     die Firma vorlegen kann - und am Ende steht kein Schlusssatz mit Moral.
 *
 * ── ENTDOPPELT, UND WAS DABEI AUFFIEL ─────────────────────────────────────
 *
 * Gegen den gesamten Serien-Bestand geprüft (151 Serien, Slugs und Titel
 * maschinell, Stoffe gelesen): Braille, Geld, Akku und Steinbruch kommen als
 * Serien-Stoff nirgends vor. `Water and Weather` und die vorhandenen
 * Wetter-Serien sind bewusst umgangen; die Seekarten-Geschichte der eigenen
 * Charge (`en-i4-the-chart-of-the-coast`) war der Grund, das ebenfalls
 * angebotene Thema Kartenprojektion NICHT zu nehmen.
 *
 * ⚠️ EHRLICH ANGEMERKT: Der englische KORPUS (nicht die Bücherei) hat aus der
 * Schwesterdatei `corpusEnI4Welt.ts` drei Braille-Einzelzeilen - Zelle,
 * Louis Braille mit fünfzehn, Notenschrift auf denselben sechs Punkten. Drei
 * Zeilen dieser Serie sagen dasselbe, im Wortlaut verschieden und hier in
 * einen Zusammenhang gestellt. Das ist kein Verstoß gegen die
 * Entdopplungs-Regel (Korpus und Bücherei sind getrennte Modi), aber wer die
 * beiden Dateien nebeneinander liest, wird es sehen - und die Übereinstimmung
 * ist ein zusätzlicher Beleg, denn beide Dateien haben unabhängig
 * voneinander bei RNIB und Britannica beziehungsweise AFB nachgesehen.
 *
 * ── FORM ──────────────────────────────────────────────────────────────────
 *
 * Vier Etappen zu zwölf Zeilen, ein Satz je Zeile, britisches Englisch, kein
 * Apostroph, keine Anführungszeichen, keine Ziffern; als Satzzeichen nur
 * `. , - ? ! : ;` und ausschließlich der einfache Bindestrich. Jede Etappe
 * endet mit einem Zug, der weiterlesen lässt; bei den Wissens-Serien ist das
 * eine offene Frage oder ein Widerspruch, nie ein Cliffhanger aus Angst.
 *
 * GEMESSEN AN DIESER DATEI (Wegwerf-Skript nach §6 des Auftragsbuchs, Ziel 31):
 * alle vier Serien `gruen`, 0 rot, öffnen bei 30, `minTier` deklariert 3 und
 * berechnet 3, je 4 Etappen zu 12 Zeilen, Zeilenlängen 40 bis 70 Zeichen.
 * Keine Serie öffnet unter 27. Dazu `npx tsc --noEmit` = 0,
 * `scripts/_striche.mts` = 0 und `scripts/_zahlenwaechter.mts` = 0 Fehler /
 * 0 ungeprüft.
 *
 * Append-only: die Registrierung in `serien.ts` ist Sache der Abnahme.
 */
import type { Herkunft } from "./corpus";
import type { Serie } from "./serie";

/** Selbst verfasst, ohne Sachbehauptung (die Geschichte). */
const EIGEN: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
};

/**
 * Selbst verfasst, jede Sachaussage an MINDESTENS zwei voneinander unabhängigen
 * Quellen geprüft. Zwei sind die Regel der Charge; wo eine einzelne Zeile eine
 * eigene Belegkette braucht, kommen weitere dazu (Akku-Serie: vier).
 */
const BELEGT = (...quellen: string[]): Herkunft => ({
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
  fundstelle: `${quellen.join(" · ")} · abgerufen 28.08.2026`,
});

/** Wissens-Serie: die Braillezelle und ihre Entstehung (kids + teens). */
const THE_SIX_DOTS: Serie = {
  slug: "en-i4-the-six-dots",
  titel: "The Six Dots",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "sinne",
  herkunft: BELEGT(
    "RNIB, Braille through the years: past, present and future",
    "American Foundation for the Blind, Life and Legacy of Louis Braille",
  ),
  etappen: [
    {
      lines: [
        "Braille is a way of writing that fingers can read.",
        "It is not a language of its own; it is a code for letters.",
        "Many languages use it, and each one has its own table.",
        "Every letter sits inside one small box called a cell.",
        "A cell holds six places for dots, in two columns of three.",
        "Each of the six places is either raised or left flat.",
        "That gives sixty-four patterns in all, the empty one included.",
        "The letter a is one dot at the top left, and nothing more.",
        "The letter b is that same dot with a second one under it.",
        "The first ten letters use only the four places at the top.",
        "Add the dot at the bottom left and you have the next ten.",
        "So here is the first question: why six places, and not five?",
      ],
    },
    {
      lines: [
        "Two hundred years ago a school in Paris taught pupils who were blind.",
        "Its books were printed with large letters pressed into thick paper.",
        "A finger could follow those shapes, but only very slowly.",
        "One ordinary book filled a shelf of heavy volumes.",
        "Worse, a pupil could read such letters but could not write them.",
        "Writing them needed a press, and no child had a press.",
        "Then a visitor brought a system of raised dots to the school.",
        "Charles Barbier had built it out of twelve dots in two columns of six.",
        "His dots stood for sounds and not for letters, so spelling was lost.",
        "And a cell of twelve is far too tall for one fingertip.",
        "The reader had to run the finger up and down for a single sign.",
        "A pupil of fifteen thought the whole thing could be cut in half.",
      ],
    },
    {
      lines: [
        "His name was Louis Braille, and he came from a village near Paris.",
        "He was born in the year eighteen hundred and nine.",
        "He lost his sight when he was still very small.",
        "He reached the school in Paris at the age of ten.",
        "By fifteen he had cut the twelve dots down to six.",
        "Now one cell sat under one fingertip and did not have to be hunted.",
        "His dots stood for letters again, so spelling came back.",
        "One letter sits outside the neat pattern of all the rest: w.",
        "French hardly used it, so it was added later and out of order.",
        "He published the code when he was twenty years old.",
        "Numbers and music were written with the very same six places.",
        "And yet his own school did not teach the code for years.",
      ],
    },
    {
      lines: [
        "Some teachers held that pupils should learn the letters others read.",
        "For a time the dots were taken out of the classroom altogether.",
        "The pupils went on using them anyway and taught one another.",
        "Louis Braille died in the year eighteen fifty-two.",
        "Two years after that, France made his code the official one.",
        "Today you meet braille on lift panels and on boxes of medicine.",
        "An organist who is blind can read a score in dots and play from it.",
        "A braille display carries a row of cells with tiny pins in them.",
        "The pins rise and sink, so one line of text can follow another.",
        "That is how a reader who is blind works at a computer all day.",
        "Paper braille is bulky; a display holds a whole library of it.",
        "But the six places have not changed since that pupil of fifteen.",
      ],
    },
  ],
};

/** Wissens-Serie: wie Geld entstand (kids + teens). */
const WHERE_MONEY_CAME_FROM: Serie = {
  slug: "en-i4-where-money-came-from",
  titel: "Where Money Came From",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "alltag",
  herkunft: BELEGT(
    "Bank of England, How has money changed over time und What is money",
    "British Museum, Money Gallery Room 68",
  ),
  etappen: [
    {
      lines: [
        "Money looks simple until you try to say what it actually is.",
        "Long before coins, goods were often swapped one for another.",
        "A basket of grain for a pot; a goat for a heap of wool.",
        "That only works when each side wants what the other one holds.",
        "A baker with plenty of bread and no need of fish is stuck.",
        "So a few goods began to stand in for all the rest.",
        "Cattle did that work, and so did grain, and so did salt.",
        "Cowrie shells served as money across Asia and Africa for ages.",
        "A shell is small, it is hard to copy, and it is easy to count.",
        "In Egypt grain lay in great barns and was moved between accounts.",
        "That is banking, thousands of years before the first bank.",
        "And much of the oldest writing we have is a list of who owed what.",
      ],
    },
    {
      lines: [
        "Those clay tablets counted grain, oil, sheep and days of work.",
        "Writing began as accounting, and the stories came later.",
        "Coins are a great deal younger than that.",
        "The oldest coins we know are well over two thousand years old.",
        "They come from Lydia, a kingdom in what is now Turkey.",
        "They were made of electrum, a natural mixture of gold and silver.",
        "Each lump was weighed, because the weight was the value.",
        "Then it was set on a die and struck with a hammer.",
        "The mark said: this piece is weighed, and you may trust it.",
        "That mark is the whole idea of a coin, and it still is.",
        "Coins spread quickly, and soon every city struck its own.",
        "But a purse of metal is a heavy thing on a long road.",
      ],
    },
    {
      lines: [
        "About a thousand years ago merchants in Sichuan found a way round it.",
        "They printed notes that could be exchanged for coin at their shops.",
        "A trader carried paper, and the metal stayed where it was.",
        "The notes worked so well that the state took the business over.",
        "Europe came to paper money hundreds of years later.",
        "The Bank of England wrote its first notes by hand, one at a time.",
        "Each note promised to pay the bearer the sum that it named.",
        "Those words are still printed on a British note today.",
        "For a long time you really could ask for the gold behind them.",
        "That has not been true for many years now.",
        "The paper has no gold under it and no metal in it.",
        "So what exactly is a note worth, if nobody hands you the gold?",
      ],
    },
    {
      lines: [
        "The answer is odd: it is worth what everybody treats it as worth.",
        "The metal in a coin is usually worth less than the coin.",
        "Money works because we all go on acting as if it works.",
        "That sounds shaky, and yet it holds up every single day.",
        "Most money today is neither paper nor metal at all.",
        "It is a number in the records of a bank.",
        "When you pay with a card, no cash travels anywhere.",
        "One number falls, another number rises, and the shop is paid.",
        "Wages, rent and savings are mostly numbers of that kind.",
        "Cash is the small visible corner of a very large system.",
        "Every new form looked strange at first: the coin, the note, the card.",
        "Whatever comes next, it will still be a promise between people.",
      ],
    },
  ],
};

/** Wissens-Serie: was ein Akku wirklich tut (teens + erwachsen). */
const WHAT_A_BATTERY_REALLY_DOES: Serie = {
  slug: "en-i4-what-a-battery-really-does",
  titel: "What a Battery Really Does",
  kind: "wissen-serie",
  lang: "en",
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "technik",
  herkunft: BELEGT(
    "NobelPrize.org, The Nobel Prize in Chemistry 2019 (lithium-ion batteries)",
    "The Electrochemical Society, The History of Electrochemistry: From Volta to Edison",
    "National Renewable Energy Laboratory (US-DOE), Arbeiten zur Kalender- und Zyklusalterung von Lithium-Ionen-Zellen",
    "Royal Society of Chemistry, PCCP-Übersicht Lithium ion battery degradation: what you need to know",
  ),
  etappen: [
    {
      lines: [
        "Take a torch battery that has gone flat and set it on a scale.",
        "It weighs exactly what it weighed on the day it was new.",
        "Nothing has leaked out, and nothing has been carried away.",
        "So what has actually changed inside that little case?",
        "A battery holds two different materials and a paste between them.",
        "The paste lets charged particles through, but never electrons.",
        "The two materials would react with each other if they could reach.",
        "The only road open to the electrons runs outside, through the wire.",
        "So they travel through the lamp, and the lamp lights up.",
        "Inside, charged particles drift the other way to keep the books even.",
        "Break the circuit and the whole reaction stops on the spot.",
        "A battery, then, stores no electricity whatsoever.",
      ],
    },
    {
      lines: [
        "What it stores is chemical energy, held in the materials themselves.",
        "Electricity is only the form that energy takes on its way out.",
        "The first battery of this kind was built in the year eighteen hundred.",
        "Alessandro Volta stacked discs of two metals in a tall pile.",
        "Between every pair he laid cloth soaked in salt water.",
        "The pile gave a steady current, and a steady current was new.",
        "Until then there had been sparks and jars that emptied in a flash.",
        "Volta was sure the current came from the two metals touching.",
        "He said so plainly, and for years a great many agreed with him.",
        "But chemists in London kept asking what the salt water was doing.",
        "Humphry Davy showed that the current came out of the reaction.",
        "The man who built the first battery had the reason wrong.",
      ],
    },
    {
      lines: [
        "A simple battery runs one way, and then it is finished.",
        "In some pairs of materials the reaction can be driven backwards.",
        "Push current in against the flow, and the chemistry is reset.",
        "That is all that charging is: the reaction is undone.",
        "Nothing is poured in, and no electricity is filled into a tank.",
        "The cells in phones, tools and cars work with lithium.",
        "Lithium ions sit in one electrode and slide across to the other.",
        "Charging moves them back, and the electrodes keep their shape.",
        "Because the frame is not eaten away, the cell lasts hundreds of turns.",
        "It took a Nobel Prize in chemistry in two thousand and nineteen.",
        "It is a quiet idea: let the ions move and leave the structure alone.",
        "And yet a phone that is three years old plainly holds less.",
      ],
    },
    {
      lines: [
        "Every charge leaves a very small mark, and the marks add up.",
        "A thin skin grows on one electrode from the first day onwards.",
        "That skin is useful, because it stops the paste being eaten away.",
        "But each time it grows it takes a little lithium out of service.",
        "The lithium is still in the cell; it is simply locked away.",
        "A battery ages even when nobody uses it at all.",
        "A cell left hot all summer ages faster than one kept indoors.",
        "Cold does something quite different and much less final.",
        "The ions move sluggishly, so the phone can give less power outside.",
        "Warm it again and most of that capacity comes straight back.",
        "An old cell is not rubbish: the metals in it can be recovered.",
        "The same lithium can end up in a cell that nobody has built yet.",
      ],
    },
  ],
};

/** Geschichte für Erwachsene: der Steinbruch, das Dorf und die Tafel im Hof. */
const THE_QUARRY_ROAD: Serie = {
  slug: "en-i4-the-quarry-road",
  titel: "The Quarry Road",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Marta Quinn hauls stone out of Ardstone Quarry, six loads a day.",
        "The quarry sits above Netherby, and there are two ways down.",
        "The short way runs through the village and over the old bridge.",
        "The long way adds forty minutes and a hill that eats the brakes.",
        "Marta has taken the long way for nine years.",
        "She has never explained why, and nobody has ever asked her.",
        "This spring the firm won a contract with a count written into it.",
        "So many tonnes to the port by the end of every week.",
        "On Monday a board went up by the weighbridge with all the names on it.",
        "Loads to a shift, driver by driver, chalked in and rubbed out daily.",
        "Ezra Okafor, the yard foreman, put it up because he was told to.",
        "Marta reads it on her way out and finds her name at the bottom.",
      ],
    },
    {
      lines: [
        "Nobody says a word to her about the board, which is worse.",
        "Ezra knows exactly where her minutes go, and he lets it lie.",
        "At the Netherby gate a woman has been counting lorries for months.",
        "Joyce Hallam keeps a tally on a clipboard by her door.",
        "Sixty-one on a quiet Tuesday, more than ninety in the dry weeks.",
        "She has written to the council and asked for a weight limit.",
        "Marta pulls in at the gate one morning and asks to see the tally.",
        "Joyce takes her for one of the fast ones and does not soften it.",
        "Marta neither corrects her nor defends the other drivers.",
        "A weight limit would send every load the long way round.",
        "That is what Marta has done alone for nine years.",
        "It would also cost the firm the contract, and cost her the job.",
      ],
    },
    {
      lines: [
        "The contract is the whole of it, and Ezra has the figures.",
        "Forty minutes a load, six drivers, five days: the margin is gone.",
        "He asks her at last why she is always the slow one.",
        "She tells him plainly, standing in the yard, and does not dress it up.",
        "Ezra does not argue with a single word of it.",
        "Then he asks what she expects him to do about the port.",
        "Marta has a proposal ready; she has had nine years to make one.",
        "No lorry through Netherby before nine or after three.",
        "Ten miles an hour over the bridge, and nothing at all at school times.",
        "The rest of the day the long road, and the count set against it.",
        "Ezra says the owner will not pay for forty minutes of goodwill.",
        "That week the council writes back and asks the firm for figures.",
      ],
    },
    {
      lines: [
        "Ezra has no figures worth the name, and he says so to Marta.",
        "She has kept a log of every run since her first winter.",
        "Nine years of times, loads and weather, in hard little books.",
        "Handing them over sets her own runs beside everybody else.",
        "She gives up her books and not one line about anyone but herself.",
        "The survey takes six weeks, and Netherby hears nothing in that time.",
        "What comes back is not the weight limit Joyce asked for.",
        "It is a speed limit, a ban at school times, and a check on the bridge.",
        "The firm keeps the port contract and loses part of what it hoped for.",
        "Two drivers leave in the autumn for better money at the docks.",
        "The board by the weighbridge stays up, and she is still near the foot.",
        "She takes the long road out on the first frost and puts the heater on.",
      ],
    },
  ],
};

/** Die vier Serien der Charge I4 auf dem vollen Alphabet (append-only). */
export const SERIEN_EN_I4_VOLL: Serie[] = [
  THE_SIX_DOTS,
  WHERE_MONEY_CAME_FROM,
  WHAT_A_BATTERY_REALLY_DOES,
  THE_QUARRY_ROAD,
];
