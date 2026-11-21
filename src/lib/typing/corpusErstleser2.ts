/**
 * Erstleser-Nachlage 2 (Textwelt, wiederholbare Charge §9) — weitere frische
 * T2-Alltagsszenen (Schule, Küche, Spiel, Bauernhof, Abend), selbst verfasst
 * (§10). Mehr Masse bei den frühen Tasten = mehr Abwechslung ohne Wiederholung
 * (die „eiserne Regel"). T2-Zeichensatz (a b c d e f g h i j k l m n o r s t u w ö;
 * KEIN p q v x y z ä ü ß). Append-only an CORPUS. `typing-textwelt-erstleser2`
 * erzwingt die T2-Grenze.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
/**
 * NUR 7-9 (30.07.2026): Zeilen, die ein Kind mit 11 als zu jung liest
 * (»Das Kind isst.«, »Guck mal, wie hoch ich schon bin!«). In-place
 * abgesenkt - ein angehaengter Zwilling koennte Stufen nur HINZUFUEGEN.
 * Der Wortlaut ist unveraendert, 7-9 verliert nichts.
 */
const NUR_KIDS: Stufe[] = ["kids"];
export const ERSTLESER2_CORPUS: CorpusItem[] = [
  { text: "Die Schultasche ist schwer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Mia rechnet gern und schnell.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Lehrer liest uns ein Buch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "In der Kiste sind bunte Stifte.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tom teilt sein Brot mit Ben.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wecker klingelt am Morgen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Oma kocht am warmen Herd.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Kuchen im Ofen wird braun.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Korb liegen rote Kirschen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder rennen auf den Hof.", kind: "satz", stufen: NUR_KIDS },
  { text: "Ben baut mit bunten Steinen.", kind: "satz", stufen: NUR_KIDS },
  { text: "Lena malt eine gelbe Sonne.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Hund liegt unter dem Tisch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Kater liegt faul am Ofen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Himmel steht ein bunter Drachen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wind hebt den Drachen hoch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nina rollt mit dem Rad ans Tor.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Ball rollt in die Ecke.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Garten summt eine Hummel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Baum wirft lange Schatten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Reh trinkt aus dem klaren Bach.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Sonne sinkt hinter den Berg.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Mond kommt langsam herauf.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Es ist Nacht, alle Tiere ruhen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bauer melkt am Morgen die Kuh.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Stall muht laut eine Kuh.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Hahn ruft in den frischen Morgen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Henne sucht im Sand nach Futter.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Traktor rollt langsam aufs Feld.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Abend liest Mama uns etwas Schönes.", kind: "satz", stufen: NUR_KIDS },
];
