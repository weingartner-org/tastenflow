/**
 * T2-Masse-Nachlage (Textwelt, wiederholbare Charge §9) — 46 selbst verfasste
 * (§10) Alltags-Sätze GENAU im T2-Zeichensatz. Der TW-E4-Audit zeigte, dass auch
 * der mittlere Erstleser-Bereich (servierbar ≤T2 = 263 im Alt-Bestand) dünn ist;
 * viel Wortsalat entsteht genau hier. Diese Charge bringt Familie, Wetter, Essen,
 * Tiere, Garten und Gefühle als sinnvolle Sätze in genau diesen Lernstand.
 *
 * Rechte (§10): eigenes Werk. Keine Zahlen/Fakten → kein Faktencheck.
 *
 * T2-Zeichensatz (aus tiers.ts, kumulativ): a b c d e f g h i j k l m n o r s t u w ö
 * (KEIN p q v x y z ä ü ß). Satzzeichen sind weglassbar und heben den Tier nicht.
 * Alle Zeilen mit `scripts/_twcheck` gegen minTierFor ≤2 und den GESAMTEN Bestand
 * (Dedup) geprüft. Append-only → Ledger-Indizes stabil. Test
 * `typing-textwelt-t2masse` erzwingt die T2-Grenze + Manifest-Präsenz.
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
export const T2MASSE_CORPUS: CorpusItem[] = [
  { text: "Am Sonntag schlafen alle etwas mehr.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Familie holt sich warmes Essen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Kaffee steht in der bunten Tasse.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Kind lacht und greift nach dem Ball.", kind: "satz", stufen: NUR_KIDS },
  { text: "Die Mutter singt ein leises Lied.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bruder baut einen hohen Turm.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Sonne lacht am hohen Himmel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Nachmittag kommt ein warmer Regen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Dicke Wolken stehen tief am Himmel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Nebel liegt weich auf der Wiese.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Herbst wird es am Abend schnell kalt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder essen frische rote Kirschen.", kind: "satz", stufen: NUR_KIDS },
  { text: "Auf dem Teller liegt warmes Brot mit Honig.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Koch kocht ein warmes Essen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Ofen backt ein runder Kuchen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Junge trinkt kalte Milch aus dem Becher.", kind: "satz", stufen: NUR_KIDS },
  { text: "Das Kind freut sich riesig und lacht.", kind: "satz", stufen: NUR_KIDS },
  { text: "Manchmal ist Warten richtig schwer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nach dem Streit sind alle wieder gut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Lachen macht den langen Tag heller.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die kleine Hand fasst den Stift fest.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Kater streckt sich lang in der Sonne.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Kaninchen mummelt an einem Blatt.", kind: "satz", stufen: NUR_KIDS },
  { text: "Die Kuh steht ruhig auf der Weide.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Stall gackern die Hennen laut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Schaf blökt laut hinter dem Tor.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Hund holt den Stock aus dem Bach.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Ente watschelt ans andere Ufer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bauer holt das Heu mit dem Wagen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Morgen tanken wir frische Luft.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Blume dreht sich nach dem Licht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Beet wachsen Bohnen und Salat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wurm kriecht tief in die Erde.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Eine Schnecke kriecht am nassen Halm.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wind schaukelt die hohen Halme.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Junge wirft den Drachen in die Luft.", kind: "satz", stufen: NUR_KIDS },
  { text: "Die Kinder malen bunte Bilder an die Wand.", kind: "satz", stufen: NUR_KIDS },
  { text: "Am Strand baut das Kind eine Burg.", kind: "satz", stufen: NUR_KIDS },
  { text: "Im Winter rodeln alle den Berg herab.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Murmel rollt unter das braune Sofa.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Abend liest der Onkel eine Geschichte.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Bald ruhen alle Tiere in dem stillen Haus.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein guter Freund hilft dir immer gern.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Teilen macht die Freude nur noch mehr.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Mit Mut schafft man auch harte Sachen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nun wird es dunkel und der Mond kommt.", kind: "satz", stufen: KIDS_TEENS },
];
