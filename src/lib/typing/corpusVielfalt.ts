/**
 * Vielfalt-Charge (Textwelt TW-E7) — mehr frühe (Tier-2-)Bausteine für Abwechslung:
 * frische Alltags-Sätze (selbst verfasst) + bekannte GEMEINFREIE Sprichwörter
 * (deutsches Kulturgut, kein Einzel-Urheberrecht → rechtlich unkritisch, §10).
 * Ergänzt die Erstleser-Charge (TW-E6): die „eiserne Regel" (nichts wiederholt
 * sich) braucht MASSE genau bei den Tasten, die Kinder früh schon können.
 *
 * Alle Zeilen kommen mit dem T2-Zeichensatz aus (Buchstaben a b c d e f g h i j k
 * l m n o r s t u w ö; KEIN p q v x y z ä ü ß). Keine Fakten → kein Faktencheck.
 * Append-only an CORPUS gehängt (Ledger-Indizes stabil). Tier-Grenzen erzwingt
 * `typing-textwelt-vielfalt`.
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
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
/** Frische Alltags-Sätze (T2, selbst verfasst) — andere Szenen als TW-E6. */
const VIELFALT_SAETZE: CorpusItem[] = [
  { text: "Das Brot ist noch warm.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Uhr an der Wand tickt laut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Lehrer schreibt an die Tafel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Kind lacht laut.", kind: "satz", stufen: NUR_KIDS },
  { text: "Im Herbst weht ein kalter Wind.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Schnee ist kalt und nass.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Kater sonnt sich am Tor.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Anton isst ein Butterbrot.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder bauen eine Burg aus Sand.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Koch macht heute Nudeln.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Auto hat einen starken Motor.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wagen rollt langsam ans Tor.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Oma strickt einen warmen Schal.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Junge malt ein Haus.", kind: "satz", stufen: NUR_KIDS },
  { text: "Am Morgen singt der Hahn.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Boot hat ein rotes Segel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Fluss ist breit und tief.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Biene summt um die Blume.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Hund wedelt froh und bellt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Kind trinkt warmen Kakao.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Bauer holt die Kuh in den Stall.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Frosch hockt am Teich.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Sonne malt den Himmel rot.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Baum wirft im Herbst sein Laub ab.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Meer rauscht an den Strand.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Boot treibt auf dem Fluss.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Mond scheint hell und klar.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Feuer im Ofen wird warm.", kind: "satz", stufen: KIDS_TEENS },
];

/** Bekannte gemeinfreie Sprichwörter, die mit dem T2-Zeichensatz auskommen. */
const VIELFALT_SPRICHWOERTER: CorpusItem[] = [
  { text: "Ende gut, alles gut.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Wer rastet, der rostet.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Eile mit Weile.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Aller Anfang ist schwer.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Kleider machen Leute.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "In der Ruhe liegt die Kraft.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Wer wagt, gewinnt.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Hunger ist der beste Koch.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Der Ton macht die Musik.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Gut Ding will Weile haben.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Wie man sich bettet, so liegt man.", kind: "sprichwort", stufen: ALLE_DREI },
  { text: "Reden ist Silber, Schweigen ist Gold.", kind: "sprichwort", stufen: ALLE_DREI },
];

/** Gesamte Vielfalt-Charge (TW-E7). */
export const VIELFALT_CORPUS: CorpusItem[] = [
  ...VIELFALT_SAETZE,
  ...VIELFALT_SPRICHWOERTER,
];
