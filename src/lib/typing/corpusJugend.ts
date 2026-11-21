/**
 * TN-E4 (Text-Nachschub §7) — Groß-Charge für die Altersstufe c (13–15 Jahre).
 *
 * Anlass (Prüfbericht 27.07.): Stufe c war die am schlechtesten versorgte Zelle
 * — 610 servierbare Zeilen, davon 28 % wortgleich Stufe-a-Material („Was ist
 * grün und rettet Omas?"), und sämtliche 336 Sätze der Textwelt-Offensive
 * gingen an a/b. Diese Charge liefert erstmals Inhalt auf Augenhöhe:
 * Weltraum, Technik, Körper/Sport, Musik, Erfindungen, Natur, Alltagsphänomene.
 *
 * Herkunft/Rechte (§4): verdichtet aus Klexikon, Wikipedia DE und Serlo (alle
 * CC BY-SA 4.0, Lizenz am Objekt geprüft) sowie selbst verfasst; kein
 * wörtliches Zitat, jede Zeile eigene Formulierung. Jeder Sachfakt wurde mit
 * unabhängiger Zweitquelle gegengeprüft (ESA, DLR, DWD, Krankenkassen-
 * Pulstabellen u. a.) und evergreen formuliert (keine Zahl mit Verfallsdatum,
 * Superlative nur mit Einschränkung).
 *
 * Append-only: HINTEN an CORPUS anhängen, damit die Ledger-Indizes stabil
 * bleiben. Zwölf dieser Zeilen tragen die beiden Themenstränge
 * `tn-de-c-iss` und `tn-de-c-koerper` (siehe arcs.ts).
 */
import type { CorpusItem } from "./corpus";
import type { Herkunft } from "./corpus";
import type { Stufe } from "./account";

const NUR_TEENS: Stufe[] = ["teens"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
const H1: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Internationale_Raumstation" };  // 4 Zeilen · abgerufen 2026-07-27
const H2: Herkunft = { quelle: "ESA (Space for Kids), eigene Formulierung", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "https://www.esa.int/kids/de/lernen/Leben_im_Weltraum/Raumstationen/Wo_ist_die_Internationale_Raumstation" };  // 1 Zeilen · abgerufen 2026-07-27
const H3: Herkunft = { quelle: "Klexikon, eigene Verdichtung", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Internationale_Raumstation" };  // 1 Zeilen · abgerufen 2026-07-27
const H4: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Internationale_Raumstation" };  // 1 Zeilen · abgerufen 2026-07-27
const H5: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Mond" };  // 1 Zeilen · abgerufen 2026-07-27
const H6: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Mond" };  // 4 Zeilen · abgerufen 2026-07-27
const H7: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Sonne" };  // 3 Zeilen · abgerufen 2026-07-27
const H8: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Sonne" };  // 1 Zeilen · abgerufen 2026-07-27
const H9: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Mars_(Planet)" };  // 9 Zeilen · abgerufen 2026-07-27
const H10: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Lichtgeschwindigkeit" };  // 1 Zeilen · abgerufen 2026-07-27
const H11: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Lichtjahr" };  // 1 Zeilen · abgerufen 2026-07-27
const H12: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Schall" };  // 3 Zeilen · abgerufen 2026-07-27
const H13: Herkunft = { quelle: "Sensorik", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "Selbst verfasst am 2026-07-27, keine Fremdquelle" };  // 32 Zeilen · abgerufen 2026-07-27
const H14: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Internet" };  // 3 Zeilen · abgerufen 2026-07-27
const H15: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Seekabel" };  // 2 Zeilen · abgerufen 2026-07-27
const H16: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Global_Positioning_System" };  // 4 Zeilen · abgerufen 2026-07-27
const H17: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Zuse_Z3" };  // 5 Zeilen · abgerufen 2026-07-27
const H18: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Bit" };  // 1 Zeilen · abgerufen 2026-07-27
const H19: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Byte" };  // 1 Zeilen · abgerufen 2026-07-27
const H20: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Fahrrad" };  // 4 Zeilen · abgerufen 2026-07-27
const H21: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Buchdruck" };  // 3 Zeilen · abgerufen 2026-07-27
const H22: Herkunft = { quelle: "Gutenberg-Gesellschaft, eigene Formulierung", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "https://www.gutenberg-gesellschaft.de/johannes-gutenberg/gutenbergs-erfindung" };  // 1 Zeilen · abgerufen 2026-07-27
const H23: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Herz" };  // 5 Zeilen · abgerufen 2026-07-27
const H24: Herkunft = { quelle: "Klexikon, eigene Verdichtung", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Herz" };  // 1 Zeilen · abgerufen 2026-07-27
const H25: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Muskel" };  // 5 Zeilen · abgerufen 2026-07-27
const H26: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Knochen" };  // 6 Zeilen · abgerufen 2026-07-27
const H27: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Gehirn" };  // 4 Zeilen · abgerufen 2026-07-27
const H28: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Marathonlauf" };  // 4 Zeilen · abgerufen 2026-07-27
const H29: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Schallgeschwindigkeit" };  // 2 Zeilen · abgerufen 2026-07-27
const H30: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/H%C3%B6rschwelle" };  // 1 Zeilen · abgerufen 2026-07-27
const H31: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Hertz_(Einheit)" };  // 1 Zeilen · abgerufen 2026-07-27
const H32: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Menschliche_Stimme" };  // 2 Zeilen · abgerufen 2026-07-27
const H33: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Musikinstrument" };  // 3 Zeilen · abgerufen 2026-07-27
const H34: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Blitz" };  // 4 Zeilen · abgerufen 2026-07-27
const H35: Herkunft = { quelle: "Klexikon", lizenz: "CC BY-SA 4.0", autor: "Klexikon-Autorinnen und -Autoren", fundstelle: "https://klexikon.zum.de/wiki/Regenbogen" };  // 3 Zeilen · abgerufen 2026-07-27
const H36: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Rayleigh-Streuung" };  // 2 Zeilen · abgerufen 2026-07-27
const H37: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Dichteanomalie" };  // 3 Zeilen · abgerufen 2026-07-27
const H38: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Mount_Everest" };  // 2 Zeilen · abgerufen 2026-07-27
const H39: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Marianengraben" };  // 2 Zeilen · abgerufen 2026-07-27
const H40: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Blauwal" };  // 2 Zeilen · abgerufen 2026-07-27
const H41: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Gepard" };  // 2 Zeilen · abgerufen 2026-07-27
const H42: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Erdmagnetfeld" };  // 1 Zeilen · abgerufen 2026-07-27
const H43: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Magnetismus" };  // 2 Zeilen · abgerufen 2026-07-27
const H44: Herkunft = { quelle: "Wikipedia DE", lizenz: "CC BY-SA 4.0", autor: "Wikipedia-Autorinnen und -Autoren", fundstelle: "https://de.wikipedia.org/wiki/Echo" };  // 1 Zeilen · abgerufen 2026-07-27
const H45: Herkunft = { quelle: "Sensorik", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "Selbst verfasst am 2026-07-27, Wiederkehr-Frage zu Arc tn-de-c-iss" };  // 2 Zeilen · abgerufen 2026-07-27
const H46: Herkunft = { quelle: "Sensorik", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "Selbst verfasst am 2026-07-27, Antwortzeile zu Arc tn-de-c-iss" };  // 2 Zeilen · abgerufen 2026-07-27
const H47: Herkunft = { quelle: "ESA (Space for Kids), eigene Formulierung", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "https://www.esa.int/kids/de/lernen/Leben_im_Weltraum/Leben_im_Weltraum/Training" };  // 1 Zeilen · abgerufen 2026-07-27
const H48: Herkunft = { quelle: "Sensorik", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "Selbst verfasst am 2026-07-27, Belohnungszeile zu Arc tn-de-c-iss" };  // 1 Zeilen · abgerufen 2026-07-27
const H49: Herkunft = { quelle: "Sensorik", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "Selbst verfasst am 2026-07-27, Wiederkehr-Frage zu Arc tn-de-c-koerper" };  // 2 Zeilen · abgerufen 2026-07-27
const H50: Herkunft = { quelle: "Sensorik", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "Selbst verfasst am 2026-07-27, Antwortzeile zu Arc tn-de-c-koerper" };  // 2 Zeilen · abgerufen 2026-07-27
const H51: Herkunft = { quelle: "Sensorik", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "https://www.dak.de/dak/gesundheit/bewegung-und-sport/sport-fakten-wissen/sportlerherz_87390" };  // 1 Zeilen · abgerufen 2026-07-27
const H52: Herkunft = { quelle: "Sensorik", lizenz: "Eigenes Werk (selbst verfasst)", autor: "Sensorik-Lernplattform", fundstelle: "Selbst verfasst am 2026-07-27, Belohnungszeile zu Arc tn-de-c-koerper" };  // 1 Zeilen · abgerufen 2026-07-27
const H53: Herkunft = { quelle: "Serlo", lizenz: "CC BY-SA 4.0", autor: "Serlo Education und Autorinnen und Autoren", fundstelle: "https://de.serlo.org/mathe/1785/steigung" };  // 4 Zeilen · abgerufen 2026-07-27

export const JUGEND_CORPUS: CorpusItem[] = [
  { text: "Die Raumstation ISS umkreist die Erde in etwa vierhundert Kilometern Höhe.", kind: "fakt", stufen: TEENS_ERW, herkunft: H1 },
  { text: "Eine Runde um die Erde schafft die ISS in ungefähr neunzig Minuten.", kind: "fakt", stufen: TEENS_ERW, herkunft: H1 },
  { text: "Wer auf der ISS lebt, sieht an einem einzigen Tag sechzehn Sonnenaufgänge.", kind: "fakt", stufen: TEENS_ERW, herkunft: H2 },
  { text: "Auf der ISS schwebt alles, weil die Station im freien Fall um die Erde rast.", kind: "fakt", stufen: TEENS_ERW, herkunft: H3 },
  { text: "Die ISS ist rund hundert Meter lang, also etwa so lang wie ein Fußballfeld.", kind: "fakt", stufen: NUR_TEENS, herkunft: H1 },
  { text: "Menschen leben seit dem Jahr 2000 ohne Unterbrechung auf der Raumstation.", kind: "fakt", stufen: TEENS_ERW, herkunft: H4 },
  { text: "Wer zur ISS fliegt, bleibt meist ein halbes Jahr an Bord.", kind: "fakt", stufen: NUR_TEENS, herkunft: H1 },
  { text: "Der Mond ist im Mittel etwa 384000 Kilometer von der Erde entfernt.", kind: "fakt", stufen: TEENS_ERW, herkunft: H5 },
  { text: "Auf dem Mond wärst du nur etwa ein Sechstel so schwer wie auf der Erde.", kind: "fakt", stufen: NUR_TEENS, herkunft: H6 },
  { text: "Wir sehen immer dieselbe Mondseite, weil der Mond sich passend mitdreht.", kind: "fakt", stufen: NUR_TEENS, herkunft: H6 },
  { text: "Am Mondtag wird der Boden über hundert Grad heiß, nachts wird er eisig.", kind: "fakt", stufen: NUR_TEENS, herkunft: H6 },
  { text: "Neil Armstrong betrat 1969 als erster Mensch den Mond.", kind: "fakt", stufen: TEENS_ERW, herkunft: H6 },
  { text: "Die Sonne steht rund 150 Millionen Kilometer von der Erde entfernt.", kind: "fakt", stufen: TEENS_ERW, herkunft: H7 },
  { text: "Die sichtbare Oberfläche der Sonne ist etwa 5500 Grad heiß.", kind: "fakt", stufen: TEENS_ERW, herkunft: H8 },
  { text: "Die Sonne besteht fast nur aus Gas, vor allem aus Wasserstoff.", kind: "fakt", stufen: NUR_TEENS, herkunft: H7 },
  { text: "In die Sonne würde die Erde mehr als eine Million Mal hineinpassen.", kind: "fakt", stufen: NUR_TEENS, herkunft: H7 },
  { text: "Der Mars ist etwa halb so groß wie die Erde.", kind: "fakt", stufen: NUR_TEENS, herkunft: H9 },
  { text: "Ein Tag auf dem Mars dauert nur wenig länger als ein Tag bei uns.", kind: "fakt", stufen: NUR_TEENS, herkunft: H9 },
  { text: "Ein Marsjahr dauert fast zwei Erdenjahre.", kind: "fakt", stufen: NUR_TEENS, herkunft: H9 },
  { text: "Der Mars hat zwei kleine Monde: Phobos und Deimos.", kind: "fakt", stufen: NUR_TEENS, herkunft: H9 },
  { text: "Rost im Staub gibt dem Mars seine rote Farbe.", kind: "fakt", stufen: NUR_TEENS, herkunft: H9 },
  { text: "Die Luft auf dem Mars ist sehr dünn und besteht fast nur aus Kohlendioxid.", kind: "fakt", stufen: TEENS_ERW, herkunft: H9 },
  { text: "Der Olympus Mons ist der höchste bekannte Berg im Sonnensystem.", kind: "fakt", stufen: TEENS_ERW, herkunft: H9 },
  { text: "Auf dem Mars wiegst du nur gut ein Drittel dessen, was du hier wiegst.", kind: "fakt", stufen: NUR_TEENS, herkunft: H9 },
  { text: "Licht legt in einer einzigen Sekunde fast dreihunderttausend Kilometer zurück.", kind: "fakt", stufen: TEENS_ERW, herkunft: H10 },
  { text: "Ein Lichtjahr ist keine Zeit, sondern eine Strecke.", kind: "fakt", stufen: TEENS_ERW, herkunft: H11 },
  { text: "Im Weltall hört niemand einen Knall, weil dort die Luft zum Schwingen fehlt.", kind: "fakt", stufen: TEENS_ERW, herkunft: H12 },
  { text: "Um zehn vor neun stellte Jana das Teleskop auf den Balkon.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Wir haben die Raumstation als hellen Punkt über dem Dach ziehen sehen.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Halte die Hand ruhig, sonst rutscht der Planet aus dem Sucher.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Der Himmel war klar, also hat sich das frühe Aufstehen gelohnt.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Das Internet entstand um 1970 zunächst an amerikanischen Universitäten.", kind: "fakt", stufen: TEENS_ERW, herkunft: H14 },
  { text: "Fast der gesamte Datenverkehr zwischen den Kontinenten läuft durch Seekabel.", kind: "fakt", stufen: TEENS_ERW, herkunft: H15 },
  { text: "In Seekabeln reisen die Daten als Lichtblitze durch dünne Glasfasern.", kind: "fakt", stufen: TEENS_ERW, herkunft: H15 },
  { text: "Das World Wide Web ist nur ein Dienst im Internet, nicht das Internet selbst.", kind: "fakt", stufen: TEENS_ERW, herkunft: H14 },
  { text: "Ein Server ist ein Rechner, der anderen Geräten Daten zur Verfügung stellt.", kind: "fakt", stufen: TEENS_ERW, herkunft: H14 },
  { text: "GPS-Satelliten kreisen in gut zwanzigtausend Kilometern Höhe um die Erde.", kind: "fakt", stufen: TEENS_ERW, herkunft: H16 },
  { text: "Ein Empfänger braucht vier Satelliten, um Ort und Uhrzeit sicher zu bestimmen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H16 },
  { text: "Jeder GPS-Satellit trägt mindestens eine Atomuhr an Bord.", kind: "fakt", stufen: TEENS_ERW, herkunft: H16 },
  { text: "GPS misst, wie lange ein Funksignal vom Satelliten bis zu dir unterwegs ist.", kind: "fakt", stufen: TEENS_ERW, herkunft: H16 },
  { text: "Konrad Zuse stellte 1941 in Berlin seine Rechenmaschine Z3 vor.", kind: "fakt", stufen: TEENS_ERW, herkunft: H17 },
  { text: "Die Z3 gilt als erster funktionsfähiger programmierbarer Rechner der Welt.", kind: "fakt", stufen: TEENS_ERW, herkunft: H17 },
  { text: "In der Z3 arbeiteten über zweitausend Relais, also mechanische Schalter.", kind: "fakt", stufen: TEENS_ERW, herkunft: H17 },
  { text: "Ihr Programm bekam die Z3 als Lochstreifen eingelesen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H17 },
  { text: "Ein Nachbau der Z3 steht heute im Deutschen Museum in München.", kind: "fakt", stufen: TEENS_ERW, herkunft: H17 },
  { text: "Im Inneren rechnet ein Computer nur mit null und eins.", kind: "fakt", stufen: NUR_TEENS, herkunft: H18 },
  { text: "Acht Bit ergeben zusammen ein Byte.", kind: "fakt", stufen: NUR_TEENS, herkunft: H19 },
  { text: "Karl Drais stellte 1817 seine Laufmaschine vor, den Urahn des Fahrrads.", kind: "fakt", stufen: TEENS_ERW, herkunft: H20 },
  { text: "Die Laufmaschine hatte keine Pedale; man stieß sich mit den Füßen ab.", kind: "fakt", stufen: NUR_TEENS, herkunft: H20 },
  { text: "Erst gegen Ende des neunzehnten Jahrhunderts bekamen Räder Luftreifen.", kind: "fakt", stufen: NUR_TEENS, herkunft: H20 },
  { text: "Ein gut gewartetes Fahrrad bringt fast die ganze Tretkraft auf die Straße.", kind: "fakt", stufen: TEENS_ERW, herkunft: H20 },
  { text: "Johannes Gutenberg druckte um 1450 in Mainz mit beweglichen Lettern.", kind: "fakt", stufen: TEENS_ERW, herkunft: H21 },
  { text: "Vor dem Buchdruck musste jedes Buch mit der Hand abgeschrieben werden.", kind: "fakt", stufen: TEENS_ERW, herkunft: H21 },
  { text: "Mit dem Druck wurden Texte auf einmal schneller und billiger verbreitet.", kind: "fakt", stufen: TEENS_ERW, herkunft: H21 },
  { text: "Gutenbergs Trick war einfach: Buchstaben immer wieder neu zusammensetzen.", kind: "fakt", stufen: NUR_TEENS, herkunft: H22 },
  { text: "Der Akku war leer, also blieb das Handy im Rucksack.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Speichere die Datei, bevor du das Fenster schließt.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Das Update lief über Nacht durch und war am Morgen fertig.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Ohne Passwort kommst du in dieses Netzwerk nicht hinein.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Wir haben die Kette geölt und danach die Bremsen nachgestellt.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Erst den Reifen prüfen, dann losfahren: Das spart Ärger unterwegs.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Ein erwachsenes Herz schlägt in Ruhe etwa siebzig Mal pro Minute.", kind: "fakt", stufen: TEENS_ERW, herkunft: H23 },
  { text: "Dein Herz ist ungefähr so groß wie deine eigene Faust.", kind: "fakt", stufen: NUR_TEENS, herkunft: H23 },
  { text: "Das Herz hat vier Räume: zwei Vorhöfe und zwei Kammern.", kind: "fakt", stufen: TEENS_ERW, herkunft: H23 },
  { text: "Beim Sport schlägt das Herz schneller, weil die Muskeln mehr Sauerstoff brauchen.", kind: "fakt", stufen: NUR_TEENS, herkunft: H24 },
  { text: "Das Herz eines Babys schlägt fast doppelt so schnell wie das eines Erwachsenen.", kind: "fakt", stufen: NUR_TEENS, herkunft: H23 },
  { text: "Beim Tauchen schlägt das Herz eines Blauwals nur wenige Male pro Minute.", kind: "fakt", stufen: TEENS_ERW, herkunft: H23 },
  { text: "Der menschliche Körper hat mehr als sechshundert Muskeln.", kind: "fakt", stufen: TEENS_ERW, herkunft: H25 },
  { text: "Muskeln können nur ziehen, niemals schieben.", kind: "fakt", stufen: TEENS_ERW, herkunft: H25 },
  { text: "Darum arbeiten Muskeln in Paaren: Einer beugt, der andere streckt.", kind: "fakt", stufen: TEENS_ERW, herkunft: H25 },
  { text: "Der Herzmuskel arbeitet, ohne dass du daran denken musst.", kind: "fakt", stufen: NUR_TEENS, herkunft: H25 },
  { text: "Ohne Bewegung werden Muskeln schwächer und bauen sich ab.", kind: "fakt", stufen: TEENS_ERW, herkunft: H25 },
  { text: "Ein erwachsener Mensch hat etwa 206 Knochen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H26 },
  { text: "Babys kommen mit über dreihundert Knochen zur Welt, viele wachsen zusammen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H26 },
  { text: "Der Steigbügel im Ohr ist der kleinste Knochen im Körper.", kind: "fakt", stufen: TEENS_ERW, herkunft: H26 },
  { text: "Der Oberschenkelknochen ist der längste Knochen des Menschen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H26 },
  { text: "Im roten Knochenmark entstehen rote und weiße Blutkörperchen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H26 },
  { text: "Knochen sind lebendiges Gewebe und werden ständig umgebaut.", kind: "fakt", stufen: TEENS_ERW, herkunft: H26 },
  { text: "Das Gehirn macht nur etwa zwei Prozent des Körpergewichts aus.", kind: "fakt", stufen: TEENS_ERW, herkunft: H27 },
  { text: "Trotzdem verbraucht das Gehirn rund ein Fünftel unserer Energie.", kind: "fakt", stufen: TEENS_ERW, herkunft: H27 },
  { text: "Im Gehirn arbeiten geschätzt sechsundachtzig Milliarden Nervenzellen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H27 },
  { text: "Jede Nervenzelle ist mit tausenden anderen Zellen verbunden.", kind: "fakt", stufen: TEENS_ERW, herkunft: H27 },
  { text: "Ein Marathon ist 42,195 Kilometer lang.", kind: "fakt", stufen: TEENS_ERW, herkunft: H28 },
  { text: "Die krumme Marathondistanz geht auf die Spiele von 1908 in London zurück.", kind: "fakt", stufen: TEENS_ERW, herkunft: H28 },
  { text: "Der Name Marathon stammt von einem Ort in Griechenland.", kind: "fakt", stufen: NUR_TEENS, herkunft: H28 },
  { text: "Einen olympischen Marathon laufen Frauen erst seit 1984.", kind: "fakt", stufen: TEENS_ERW, herkunft: H28 },
  { text: "In Luft breitet sich Schall mit etwa 340 Metern pro Sekunde aus.", kind: "fakt", stufen: TEENS_ERW, herkunft: H29 },
  { text: "Im Wasser ist Schall gut viermal so schnell unterwegs wie in Luft.", kind: "fakt", stufen: TEENS_ERW, herkunft: H29 },
  { text: "Menschen hören Töne etwa zwischen zwanzig und zwanzigtausend Hertz.", kind: "fakt", stufen: TEENS_ERW, herkunft: H30 },
  { text: "Hertz gibt an, wie oft etwas in einer Sekunde schwingt.", kind: "fakt", stufen: TEENS_ERW, herkunft: H31 },
  { text: "Je schneller etwas schwingt, desto höher klingt der Ton.", kind: "fakt", stufen: NUR_TEENS, herkunft: H12 },
  { text: "Beim Sprechen schwingen deine Stimmlippen viele Male in der Sekunde.", kind: "fakt", stufen: NUR_TEENS, herkunft: H32 },
  { text: "Längere Stimmlippen schwingen langsamer, deshalb klingt die Stimme tiefer.", kind: "fakt", stufen: TEENS_ERW, herkunft: H32 },
  { text: "Instrumente teilt man in Saiten, Blas, Schlag und Tasten ein.", kind: "fakt", stufen: NUR_TEENS, herkunft: H33 },
  { text: "Die Geige wird gestrichen, die Gitarre wird gezupft.", kind: "fakt", stufen: NUR_TEENS, herkunft: H33 },
  { text: "Schon in der Steinzeit spielten Menschen Flöten aus Knochen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H33 },
  { text: "Nach dem Aufwärmen fühlte sich der Sprint deutlich leichter an.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Sie lief die letzte Runde am schnellsten und blieb trotzdem ruhig.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Wir haben zwei Stunden geprobt und danach das Stück aufgenommen.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Der Bass war zu laut, also haben wir ihn leiser gedreht.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Halte die Schultern locker, dann klingt der Ton freier.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Zwischen zwei Läufen hilft es, ruhig und tief zu atmen.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Blitz und Donner entstehen gleichzeitig, doch das Licht ist viel schneller.", kind: "fakt", stufen: TEENS_ERW, herkunft: H34 },
  { text: "Drei Sekunden zwischen Blitz und Donner bedeuten etwa einen Kilometer.", kind: "fakt", stufen: TEENS_ERW, herkunft: H34 },
  { text: "Ein Blitzableiter führt den Strom sicher in den Boden.", kind: "fakt", stufen: TEENS_ERW, herkunft: H34 },
  { text: "Ein Blitz kann über einen Kilometer lang werden.", kind: "fakt", stufen: NUR_TEENS, herkunft: H34 },
  { text: "Ein Regenbogen erscheint nur, wenn du die Sonne im Rücken hast.", kind: "fakt", stufen: NUR_TEENS, herkunft: H35 },
  { text: "In jedem Regentropfen wird das Sonnenlicht in Farben zerlegt.", kind: "fakt", stufen: NUR_TEENS, herkunft: H35 },
  { text: "Auch an einem Wasserfall kann ein Regenbogen entstehen.", kind: "fakt", stufen: NUR_TEENS, herkunft: H35 },
  { text: "Der Himmel wirkt blau, weil Luftteilchen blaues Licht stärker streuen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H36 },
  { text: "Abends wird das blaue Licht herausgefiltert, darum leuchtet der Himmel rot.", kind: "fakt", stufen: TEENS_ERW, herkunft: H36 },
  { text: "Eis schwimmt, weil gefrorenes Wasser weniger dicht ist als flüssiges.", kind: "fakt", stufen: TEENS_ERW, herkunft: H37 },
  { text: "Wasser ist bei vier Grad am dichtesten, nicht am Gefrierpunkt.", kind: "fakt", stufen: TEENS_ERW, herkunft: H37 },
  { text: "Darum frieren Seen von oben zu und nicht vom Grund her.", kind: "fakt", stufen: TEENS_ERW, herkunft: H37 },
  { text: "Der Mount Everest ist der höchste Berg über dem Meeresspiegel.", kind: "fakt", stufen: TEENS_ERW, herkunft: H38 },
  { text: "Seine Höhe liegt bei rund 8849 Metern.", kind: "fakt", stufen: TEENS_ERW, herkunft: H38 },
  { text: "Die tiefste bekannte Stelle im Meer liegt fast elf Kilometer unter Wasser.", kind: "fakt", stufen: TEENS_ERW, herkunft: H39 },
  { text: "Würde man den Everest dort versenken, bliebe er tief unter Wasser.", kind: "fakt", stufen: TEENS_ERW, herkunft: H39 },
  { text: "Der Blauwal gilt als größtes Tier, das je auf der Erde gelebt hat.", kind: "fakt", stufen: TEENS_ERW, herkunft: H40 },
  { text: "Blauwale werden etwa dreißig Meter lang und über hundert Tonnen schwer.", kind: "fakt", stufen: TEENS_ERW, herkunft: H40 },
  { text: "Der Gepard ist das schnellste Landtier und schafft über hundert Kilometer pro Stunde.", kind: "fakt", stufen: NUR_TEENS, herkunft: H41 },
  { text: "Dieses Tempo hält ein Gepard aber nur wenige hundert Meter durch.", kind: "fakt", stufen: NUR_TEENS, herkunft: H41 },
  { text: "Ein Kompass funktioniert, weil die Erde selbst ein Magnetfeld hat.", kind: "fakt", stufen: TEENS_ERW, herkunft: H42 },
  { text: "Gleiche Pole stoßen sich ab, verschiedene ziehen sich an.", kind: "fakt", stufen: NUR_TEENS, herkunft: H43 },
  { text: "Zerbrichst du einen Magneten, hat jedes Stück wieder zwei Pole.", kind: "fakt", stufen: TEENS_ERW, herkunft: H43 },
  { text: "Ein Echo hörst du, wenn Schall an einer Wand zurückgeworfen wird.", kind: "fakt", stufen: NUR_TEENS, herkunft: H44 },
  { text: "Fledermäuse orientieren sich mit Tönen, die wir nicht hören können.", kind: "fakt", stufen: NUR_TEENS, herkunft: H12 },
  { text: "Bevor du losschreibst, lies die Aufgabe noch einmal ruhig durch.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Der Bus kam zehn Minuten zu spät, trotzdem hat es gereicht.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Wir treffen uns nach der sechsten Stunde am Fahrradständer.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Mia hat das Referat übernommen, Jonas kümmert sich um die Folien.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Leon hat den Tisch abgeräumt, Sarah reparierte das Regal.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Am Wochenende hilft Yusuf in der Werkstatt seines Onkels.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Der Zug war voll, also sind wir bis zur nächsten Station gestanden.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Nimm die Jacke mit, am Abend wird es hier oben kühl.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Ich habe den Text zweimal gelesen und trotzdem eine Stelle übersehen.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Wenn du müde bist, hilft eine kurze Pause mehr als noch ein Kaffee.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Das Werkzeug liegt im untersten Fach, gleich neben den Schrauben.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Sie erklärte den Aufbau des Motors ruhig und ohne Fachwörter.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Beim dritten Versuch hat der Sprung endlich geklappt.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Wer früh anfängt, muss am Ende nicht hetzen.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Im Sommer trainieren wir draußen, im Winter in der Halle.", kind: "satz", stufen: NUR_TEENS, herkunft: H13 },
  { text: "Das Kabel ist zu kurz; wir brauchen eine Verlängerung.", kind: "satz", stufen: TEENS_ERW, herkunft: H13 },
  { text: "Kurze Frage: Wie lange dauert eine Erdumrundung der Raumstation?", kind: "fakt", stufen: TEENS_ERW, herkunft: H45 },
  { text: "Rund anderthalb Stunden. Deshalb wechseln dort Tag und Nacht im Eiltempo.", kind: "fakt", stufen: TEENS_ERW, herkunft: H46 },
  { text: "Warum schweben Menschen an Bord, obwohl die Erde sie anzieht?", kind: "fakt", stufen: TEENS_ERW, herkunft: H45 },
  { text: "Weil Station und Besatzung gemeinsam fallen, während sie um die Erde rasen.", kind: "fakt", stufen: TEENS_ERW, herkunft: H46 },
  { text: "In der Schwerelosigkeit bauen Muskeln ab, darum trainiert die Besatzung täglich.", kind: "fakt", stufen: TEENS_ERW, herkunft: H47 },
  { text: "Motto der Raumstation: Wer nichts festbindet, sucht es später an der Decke.", kind: "spruch", stufen: TEENS_ERW, herkunft: H48 },
  { text: "Frage zum Puls: Wie oft schlägt ein Herz in Ruhe pro Minute?", kind: "fakt", stufen: TEENS_ERW, herkunft: H49 },
  { text: "Rund siebzig Mal. Unter Belastung schlägt es deutlich schneller.", kind: "fakt", stufen: TEENS_ERW, herkunft: H50 },
  { text: "Weißt du es noch? Kann ein Muskel auch drücken?", kind: "fakt", stufen: TEENS_ERW, herkunft: H49 },
  { text: "Nein, Ziehen ist alles; für die Gegenbewegung gibt es einen zweiten Muskel.", kind: "fakt", stufen: TEENS_ERW, herkunft: H50 },
  { text: "Ausdauertraining macht das Herz kräftiger, deshalb schlägt es ruhiger.", kind: "fakt", stufen: TEENS_ERW, herkunft: H51 },
  { text: "Bizeps und Trizeps sind sich einig: Einer von beiden zieht immer.", kind: "spruch", stufen: TEENS_ERW, herkunft: H52 },
  { text: "Vom Mars aus wirkt die Sonne kleiner als von der Erde aus.", kind: "fakt", stufen: TEENS_ERW, herkunft: H9 },
  { text: "Die Steigung einer Geraden sagt, wie stark sie steigt oder fällt.", kind: "fakt", stufen: TEENS_ERW, herkunft: H53 },
  { text: "Zwei parallele Geraden haben immer dieselbe Steigung.", kind: "fakt", stufen: TEENS_ERW, herkunft: H53 },
  { text: "Ein Steigungsdreieck zeigt, wie weit man nach rechts und nach oben geht.", kind: "fakt", stufen: NUR_TEENS, herkunft: H53 },
  { text: "Eine waagrechte Gerade hat die Steigung null.", kind: "fakt", stufen: TEENS_ERW, herkunft: H53 },
];
