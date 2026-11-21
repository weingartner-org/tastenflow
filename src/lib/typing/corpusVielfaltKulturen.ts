/**
 * TN-E13 (Rest-Charge, 27.07.2026) — Vielfalt: Namen und Rollenbilder.
 *
 * Zwei Befunde des Prüfberichts vom 27.07., ausdrücklich von Johannes bestätigt
 * („ja, füge Vielfalt und Multikulti gerne ein"):
 *
 *  • **Namen:** Der Bestand kannte 23 Vornamen, ausnahmslos deutsch/nordisch
 *    (Anna 12×, Ben 8×, Mia 6×, Finn 5×). In einer Inklusionsplattform eine
 *    sichtbare Lücke — Kinder sollen sich in den Übungstexten wiederfinden.
 *  • **Rollenbilder:** 14 von 14 Zeilen mit weiblichen Figuren waren häuslich
 *    (Oma backt, Mutter kocht, Oma strickt), während 33 Zeilen Männer in
 *    BERUFEN zeigten (Bauer, Koch, Lehrer, Kapitän). Einzige berufstätige Frau
 *    war eine Lehrerin.
 *
 * Diese Charge dreht beides um, ohne zu belehren: Namen aus vielen Sprachräumen
 * stehen einfach da, Frauen üben Berufe aus, Männer kümmern sich um Haushalt
 * und Kinder — als selbstverständlicher Alltag, nicht als Botschaft.
 *
 * ★ Zeichensatz-Zwang: Die Tiers erlauben unterhalb T3 kein p q v x y z ä ü ß.
 * Namen wie Zeynep, Yusuf oder Priya sind damit erst spät tippbar. Deshalb
 * werden Namen zudem in deutscher Schreibweise gesetzt: Buchstaben wie ş oder
 * č stehen auf KEINER Tier-Stufe — solche Zeilen wären nie tippbar (der Test
 * hat genau das bei „Ayşe" gefangen).
 * sind die frühen Zeilen mit Namen gebaut, die im T2-Satz liegen (Amina, Nuri,
 * Malik, Dara, Anush, Ibrahim, Sanel, Marisol …), die späteren dürfen mehr.
 *
 * Alle Zeilen selbst verfasst (§10). Append-only.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
const EIGEN: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
};

const s = (text: string, stufen: Stufe[] = KIDS_TEENS): CorpusItem => ({
  text,
  kind: "satz",
  stufen,
  herkunft: EIGEN,
});

/**
 * Frühe Zeilen (T2-Zeichensatz): Namen aus vielen Sprachräumen im ganz
 * normalen Alltag.
 */
const NAMEN_FRUEH: CorpusItem[] = [
  s("Amina holt das Brot und Malik trägt die Milch."),
  s("Nuri malt einen Bus. Dara malt das ganze Haus dahinter."),
  s("Im Hof rufen Ibrahim und Sanel nach dem Ball."),
  s("Marisol hat ihre Trommel dabei und alle hören ihr gerne zu.", KIDS_TEENS),
  s("Anush schreibt an Onkel Aram. Der Brief ist schon fertig."),
  s("Tarik sucht sein Buch. Er findet es unter dem Bett."),
  s("Lina und Amir teilen sich die letzten Nudeln."),
  s("Bei Familie Nour steht der Tee immer schon auf dem Tisch."),
  s("Mo hat heute Geburtstag. Alle in der Klasse singen mit."),
  s("Ferhat baut aus Sand einen Turm. Der Turm hält lange."),
  s("Aisha hat eine Idee. Sie holt Farbe und einen Karton."),
  s("Onkel Kemal bringt frische Feigen aus dem Garten mit."),
  s("Rania kann schon alleine kochen. Es riecht durch das ganze Haus."),
  s("Der kleine Milan schläft. Sonst liest ihm sein Bruder laut vor.", KIDS_TEENS),
];

/**
 * Spätere Zeilen (voller Zeichensatz): Namen, die p/q/v/x/y/z/Umlaute
 * brauchen — jetzt sind sie tippbar.
 */
const NAMEN_SPAET: CorpusItem[] = [
  s("Zeynep erklärt die Aufgabe, und plötzlich verstehen es alle.", KIDS_TEENS),
  s("Yusuf sammelt Steine, die aussehen wie kleine Tiere.", KIDS_TEENS),
  s("Priya bringt ihrer Nachbarin die Post mit nach oben.", KIDS_TEENS),
  s("Vito und Xenia streiten kurz und lachen dann wieder.", KIDS_TEENS),
  s("Ayse schreibt ihren Namen auf Deutsch und in ihrer zweiten Sprache.", KIDS_TEENS),
  s("Kwame zeigt uns ein Lied, das sein Vater ihm beigebracht hat.", KIDS_TEENS),
  s("Mateusz repariert das Rad seiner Schwester in zehn Minuten.", KIDS_TEENS),
  s("Fatima übersetzt für ihre Oma, wenn der Arzt etwas fragt.", KIDS_TEENS),
  s("Nguyen bringt am Freitag immer etwas zum Teilen mit.", KIDS_TEENS),
  s("Elif zeichnet Häuser, die es so noch gar nicht gibt.", KIDS_TEENS),
];

/**
 * Rollenbilder ausgleichen: Frauen in Berufen, Männer im Haushalt und in der
 * Fürsorge — beiläufig erzählt.
 */
const ROLLEN: CorpusItem[] = [
  // Frauen in Berufen
  s("Die Kranfahrerin winkt uns von ganz oben aus der Kabine.", KIDS_TEENS),
  s("Frau Berg ist Tischlerin. Sie riecht immer ein bisschen nach Holz.", KIDS_TEENS),
  s("Meine Mutter ist Ärztin und hat heute Nachtdienst.", KIDS_TEENS),
  s("Die Busfahrerin kennt jede Haltestelle im ganzen Ort.", KIDS_TEENS),
  s("Amina ist Trainerin. Sie erklärt ruhig, bis es alle können.", KIDS_TEENS),
  s("Die Forscherin hält das Glas ins Licht und macht sich Notizen.", KIDS_TEENS),
  s("Frau Dorn baut Motoren. Am liebsten die ganz alten.", KIDS_TEENS),
  s("Die Pilotin erzählt, wie ruhig es hoch über den Wolken ist.", KIDS_TEENS),
  s("Meine Schwester lernt Programmieren und zeigt es mir abends.", KIDS_TEENS),
  s("Die Dachdeckerin ruft von oben, dass alles dicht ist.", KIDS_TEENS),
  s("Frau Halim leitet die Werkstatt und kennt jede Schraube.", ALLE_DREI),
  s("Die Richterin hört sich beide Seiten in Ruhe an.", ALLE_DREI),
  // Männer im Haushalt und in der Fürsorge
  s("Mein Vater backt am Sonntag Brot. Das dauert den halben Tag.", KIDS_TEENS),
  s("Opa strickt einen Schal. Er sagt, das mache den Kopf frei.", KIDS_TEENS),
  s("Papa singt beim Bügeln, aber nur, wenn niemand hinsieht.", KIDS_TEENS),
  s("Onkel Ali kocht das Essen für alle und deckt auch den Tisch.", KIDS_TEENS),
  s("Mein Bruder wickelt das Baby und redet dabei die ganze Zeit.", KIDS_TEENS),
  s("Der Nachbar gießt die Blumen, wenn wir nicht da sind.", KIDS_TEENS),
  s("Papa holt die Kinder ab und hat immer Obst dabei.", KIDS_TEENS),
  s("Mein Onkel näht die Knöpfe an. Er kann das besser als alle.", KIDS_TEENS),
];

/**
 * Nachlage im REINEN T2-Satz (ohne p q v x y z ä ü ß): Damit auch die Jüngsten
 * diese Zeilen FRÜH bekommen — beim ersten Durchgang lag die Hälfte der Charge
 * über T2 und wäre für Siebenjährige erst spät erschienen.
 */
const T2_SICHER: CorpusItem[] = [
  s("Adem holt seine kleine Schwester aus dem Kindergarten ab."),
  s("Hana ist Malerin. Ihre Bilder sind im Flur.", KIDS_TEENS),
  s("Omar bringt Karim ein Buch aus der Schule mit."),
  s("Die Doktorin hört mich ab und nickt dann.", KIDS_TEENS),
  s("Fatou kocht Reis mit Bohnen. Es duftet bis in den Hof."),
  s("Timur hilft dem Nachbarn und bekommt danach Kuchen."),
  s("Iman ist Meisterin in der Werkstatt. Sie kennt jede Maschine.", KIDS_TEENS),
  s("Salim wischt den Tisch und stellt die Teller in den Schrank.", KIDS_TEENS),
  s("Nadia ist Chefin einer kleinen Backstube am Markt.", KIDS_TEENS),
  s("Bashir und Rosa teilen sich das Salatblatt."),
  s("Die Elektrikerin sucht den Fehler und findet ihn sofort.", KIDS_TEENS),
  s("Herr Ilir wickelt das Kind und singt dabei ein Lied.", KIDS_TEENS),
  s("Alma ist Astronautin. Sie kennt alle Sterne.", KIDS_TEENS),
  s("Faris deckt den Tisch, Idris holt das Brot."),
];

export const VIELFALT_KULTUREN_CORPUS: CorpusItem[] = [
  ...NAMEN_FRUEH,
  ...NAMEN_SPAET,
  ...ROLLEN,
  ...T2_SICHER,
];
