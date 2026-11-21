/**
 * T2-Masse-Nachlage 2 (Textwelt, wiederholbare Charge §9) — 46 weitere selbst
 * verfasste (§10) Alltags-Sätze GENAU im T2-Zeichensatz. Frische Themen: Schule
 * & Lernen, Stadt & Verkehr, wenn es wieder warm wird, Helfen & Arbeit, Abend &
 * Morgen. Baut die T2-Masse weiter aus (No-Repeat je länger, je mehr).
 *
 * Rechte (§10): eigenes Werk. Keine Zahlen/Fakten → kein Faktencheck.
 * T2-Zeichensatz: a b c d e f g h i j k l m n o r s t u w ö (KEIN p q v x y z ä ü ß).
 * Alle Zeilen mit `scripts/_twcheck` gegen minTierFor ≤2 und den Gesamtbestand
 * geprüft. Append-only → Ledger-Indizes stabil. Test `typing-textwelt-t2masse2`.
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
export const T2MASSE2_CORPUS: CorpusItem[] = [
  { text: "Die Schule beginnt am Morgen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder holen ihre Hefte heraus.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Lehrer schreibt Wörter an die Tafel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Mia liest der Klasse etwas laut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nach der Stunde rennen alle raus.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Hof lachen und toben die Kinder.", kind: "satz", stufen: NUR_KIDS },
  { text: "Ben teilt sein Brot mit dem Freund.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Ende nimmt Lena ihre Tasche.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Junge lernt gern neue Sachen.", kind: "satz", stufen: NUR_KIDS },
  { text: "Rechnen macht dem Kind heute Freude.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Lehrer lobt die kleine Klasse.", kind: "satz", stufen: NUR_KIDS },
  { text: "Wer gut lernt, der kann bald mehr.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bus wartet ruhig an der Ecke.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Auto rollt langsam durch die Stadt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Laster bringt Waren in den Laden.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Markt kauft die Frau frisches Obst.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Kinder rennen froh durch den Hof.", kind: "satz", stufen: NUR_KIDS },
  { text: "Die Uhr am Turm meldet die Stunde.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Radfahrer klingelt hell und laut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nun wird es endlich wieder warm.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die ersten Blumen wachsen im Beet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Baum baut ein Star sein Nest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Sonne scheint hell und lang.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Bald ist der kalte Winter fort.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Sommer baden alle gern im See.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der warme Wind trocknet das Heu.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Mutter kocht ein gutes Essen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Sohn deckt schon mal den Tisch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nach dem Essen hilft Lena beim Abwasch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Onkel malt das alte Tor neu an.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bauer holt die Rinder auf den Hof.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Koch backt am Morgen frisches Brot.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer anderen hilft, dem hilft man auch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Abend wird der Himmel tief rot.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Sterne kommen einer nach dem andern.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Mond scheint hell in mein Bett hinein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder schlafen tief und fest.", kind: "satz", stufen: NUR_KIDS },
  { text: "Am Morgen weckt der Hahn den Hof.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Bald ist der neue Tag wieder da.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der kleine Hund tollt durch den Garten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder bauen ein Haus aus Ton.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Mann trinkt einen Tee im Haus.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein warmer Mantel tut heute gut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Ball kullert langsam in das Loch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Oma strickt einen warmen Socken.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein guter Tag beginnt mit einem Lachen.", kind: "satz", stufen: KIDS_TEENS },
];
