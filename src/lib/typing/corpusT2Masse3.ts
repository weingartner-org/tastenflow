/**
 * T2-Masse-Nachlage 3 (Textwelt, wiederholbare Charge §9) — 46 weitere selbst
 * verfasste (§10) Alltags-Sätze GENAU im T2-Zeichensatz. Frische Themen:
 * Geburtstag & Fest, Haustiere, Herbst, Kochen, Zubettgehen, Spielplatz. Baut die
 * (wertvollste) T2-Masse weiter aus — je mehr Masse, desto länger ohne Wiederholung.
 *
 * Rechte (§10): eigenes Werk. Keine Zahlen/Fakten → kein Faktencheck.
 * T2-Zeichensatz: a b c d e f g h i j k l m n o r s t u w ö (KEIN p q v x y z ä ü ß —
 * `z` verbietet zu/zum/Zeit/Katze/tanzt/zwei/ganz/kurz …). Alle Zeilen mit
 * `scripts/_twcheck` gegen minTierFor ≤2 und den Gesamtbestand geprüft. Append-only.
 * Test `typing-textwelt-t2masse3`.
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
export const T2MASSE3_CORPUS: CorpusItem[] = [
  { text: "Heute hat der kleine Ben Geburtstag.", kind: "satz", stufen: NUR_KIDS },
  { text: "Alle Freunde sind schon da.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Bunte Ballons schweben durch den Raum.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Auf dem Tisch steht ein runder Kuchen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ben darf sich etwas Schönes denken.", kind: "satz", stufen: NUR_KIDS },
  { text: "Er macht die Augen fest und lacht.", kind: "satz", stufen: NUR_KIDS },
  { text: "Dann teilt er den Kuchen an alle aus.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Jedes Kind hat ein Geschenk mitgebracht.", kind: "satz", stufen: NUR_KIDS },
  { text: "Ben freut sich riesig und dankt allen.", kind: "satz", stufen: NUR_KIDS },
  { text: "So ein Fest macht wirklich Laune.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Mia hat einen kleinen braunen Hund.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Sein Name ist Fussel, er ist klein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Jeden Morgen geht Mia mit ihm los.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Fussel rennt froh durch das nasse Gras.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Er holt den Ball und bringt ihn wieder.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Abend liegt er faul in seinem Korb.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Kater schnurrt auf dem warmen Sofa.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein kleiner Hamster nagt an einem Kern.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Herbst werden die Tage kalt und nass.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Laub leuchtet rot und braun und gelb.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wind treibt das Laub durch die Luft.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder rechen einen hohen Haufen.", kind: "satz", stufen: NUR_KIDS },
  { text: "Dann hocken sie sich mitten hinein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Drachen fliegt hoch am grauen Himmel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Oma kocht am Herd ein gutes Essen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Es riecht nach warmem Brot und Kraut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Sohn schneidet die Bohnen klein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Auf dem Herd brodelt der dicke Brei.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Mia kostet mit dem Löffel einen Schluck.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Hmm, das schmeckt richtig gut, sagt sie.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Abend geht es bald ins Bett.", kind: "satz", stufen: NUR_KIDS },
  { text: "Ben trinkt noch schnell etwas warme Milch.", kind: "satz", stufen: NUR_KIDS },
  { text: "Die Mutter liest ihm eine Geschichte.", kind: "satz", stufen: NUR_KIDS },
  { text: "Bald werden seine Augen sehr schwer.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Mond schaut sanft in das Kinderbett.", kind: "satz", stufen: NUR_KIDS },
  { text: "Schlaf gut, kleiner Ben, sagt die Mutter.", kind: "satz", stufen: NUR_KIDS },
  { text: "Auf dem Hof toben die Kinder herum.", kind: "satz", stufen: NUR_KIDS },
  { text: "Kinder schaukeln hoch und rufen laut.", kind: "satz", stufen: NUR_KIDS },
  { text: "Ein Kind saust schnell die Bahn herab.", kind: "satz", stufen: NUR_KIDS },
  { text: "Andere buddeln tief in dem nassen Sand.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der kleine Tom klettert bis nach oben.", kind: "satz", stufen: NUR_KIDS },
  { text: "Guck mal, wie hoch ich schon bin!", kind: "satz", stufen: NUR_KIDS },
  { text: "Ein Junge malt mit Kreide auf den Stein.", kind: "satz", stufen: NUR_KIDS },
  { text: "Bald ruft die Lehrerin alle wieder herein.", kind: "satz", stufen: NUR_KIDS },
  { text: "Ein guter Tag bringt so manche Freude.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Ende sind alle froh und matt.", kind: "satz", stufen: KIDS_TEENS },
];
