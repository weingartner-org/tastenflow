/**
 * Vielfalt-Nachlage 2 (Textwelt, wiederholbare Charge §9) — 48 selbst verfasste
 * (§10) Alltags-, Natur-, Tier- und Stadt-Sätze im T2/T3-Bereich. Ziel: mehr
 * Abwechslung im mittleren Lernstand, damit „Mein Training" und die Buchstaben-
 * Lektionen lange ohne Wiederholung sinnvolle Zeilen ziehen (die „eiserne Regel").
 *
 * Rechte (§10): eigenes Werk. Keine Wahrheitsbehauptungen mit Zahlen/Namen →
 * kein Faktencheck-Aufwand; beschreibende, wohlwollende Szenen (Stufen a/b).
 *
 * Zeichensatz: ganzes Alphabet (T3), keine Ziffern/Sonderzeichen → alle Zeilen
 * sind spätestens auf Tier 3 tippbar (mit `scripts/_twcheck` gegen minTierFor ≤3
 * und den GESAMTEN Bestand geprüft). Satzzeichen sind weglassbar.
 *
 * Append-only: wird in corpus.ts HINTEN an CORPUS gehängt → Ledger-Indizes stabil.
 * Test `typing-textwelt-vielfalt2` erzwingt die T3-Grenze + Manifest-Präsenz.
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
export const VIELFALT2_CORPUS: CorpusItem[] = [
  { text: "Im Herbst fallen bunte Blätter vom Baum.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Igel rollt sich zu einer Kugel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Morgen glitzert der Tau im Gras.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Eule ruht am Tag und jagt bei Nacht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der kleine Fuchs schleicht durch das Feld.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Winter deckt Schnee die Wiesen zu.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder bauen einen dicken Schneemann.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Bach plätschert leise über die Steine.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Regenbogen spannt sich über das Tal.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Biene sammelt Nektar von der Blüte.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Frosch springt mit einem Satz ins Wasser.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Abend leuchten die ersten Sterne auf.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wind treibt die Wolken über den Hügel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Katze putzt sich mit der weichen Pfote.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Garten blühen rote und gelbe Tulpen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bäcker holt die warmen Brötchen aus dem Ofen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Ampel springt von Rot auf Grün.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bus hält an der nächsten Haltestelle.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Auf dem Markt duften frische Erdbeeren.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Maler streicht die Wand in hellem Blau.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Feuerwehr eilt mit blauem Licht zum Brand.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Zoo gähnt der Löwe in der Sonne.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Zug rollt langsam aus dem Bahnhof.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Segelboot gleitet über den ruhigen See.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Möwe kreist über dem weiten Strand.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wanderer folgt dem schmalen Pfad bergauf.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Lagerfeuer singen alle ein frohes Lied.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Spinne webt ein feines Netz im Busch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Specht klopft laut gegen den Stamm.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Teich schwimmen zwei weiße Enten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Eichhörnchen versteckt eine Nuss im Moos.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Schmetterling setzt sich auf die Blume.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Sonne wärmt die alte Steinmauer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Falke stößt pfeilschnell nach unten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Junge wirft dem Hund einen Stock.", kind: "satz", stufen: NUR_KIDS },
  { text: "Die Mühle dreht sich im kräftigen Wind.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Deich grasen Schafe im weichen Gras.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Kapitän steuert das Schiff in den Hafen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Wald raschelt das Laub unter den Schuhen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kerze wirft einen warmen Schein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bauer pflügt am frühen Morgen den Acker.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Schwarm Stare zieht nach Süden.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Uhr am Turm schlägt jede volle Stunde.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wasserfall rauscht tief in der Schlucht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Fohlen steht wackelig neben der Stute.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Ziege klettert flink über die Felsen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Fenster trommelt der warme Sommerregen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Koch würzt die Suppe mit frischem Kraut.", kind: "satz", stufen: KIDS_TEENS },
];
