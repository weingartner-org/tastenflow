/**
 * T3-Masse-Nachlage 2 (Textwelt, wiederholbare Charge §9) — 46 weitere selbst
 * verfasste (§10) T3-Sätze mit reichem Wortschatz. Frische Themen: Reisen &
 * Fahrzeuge, Musik & Instrumente, Sport & Bewegung, Märchen & Fantasie, Dinge im
 * Alltag, Gefühle. Hält „Mein Training" bei fortgeschrittenem Stand abwechslungs-
 * reich (No-Repeat je mehr Masse, desto länger).
 *
 * Rechte (§10): eigenes Werk. Beschreibende Szenen ohne Zahlen/Wahrheits-
 * behauptungen → kein Faktencheck. Volles Alphabet, keine Ziffern → alle ≤T3
 * (mit `scripts/_twcheck` gegen minTierFor ≤3 und den Gesamtbestand geprüft).
 * Append-only → Ledger-Indizes stabil. Test `typing-textwelt-t3masse2`.
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
export const T3MASSE2_CORPUS: CorpusItem[] = [
  { text: "Das Flugzeug hebt langsam von der Bahn ab.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Passagiere schnallen sich an ihren Platz.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tief unten schrumpfen die Häuser zu Punkten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Schiff tuckert gemächlich durch den Kanal.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Zug rast durch einen langen Tunnel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Steuer sitzt eine ruhige Pilotin.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Rakete zischt in den weiten Weltraum.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Ballon steigt sanft in den blauen Himmel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Geiger stimmt vor dem Konzert sein Instrument.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Trommel dröhnt laut durch den ganzen Saal.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Chor singt ein fröhliches Frühlingslied.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Flöte klingt zart wie ein Vogel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Pianist übt jeden Tag eine Stunde.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Auf dem Platz jubeln die Zuschauer laut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Läufer sprintet als Erster ins Ziel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Turnerin schwingt sich elegant vom Reck.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Torwart fängt den Ball im letzten Moment.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Schwimmerin taucht tief ins kühle Becken.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bergsteiger klettert an der steilen Wand.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Märchen wohnt ein Drache in der Höhle.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Zauberer spricht einen geheimen Spruch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Fee winkt und lässt Sterne funkeln.", kind: "satz", stufen: NUR_KIDS },
  { text: "Ein tapferer Ritter zieht durch das Land.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Hexe rührt in ihrem großen Kessel.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Zwerg hütet einen Schatz aus Gold.", kind: "satz", stufen: NUR_KIDS },
  { text: "In der Nacht huscht ein Kobold durch den Flur.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Prinzessin reitet auf einem weißen Pferd.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Pirat sucht die Insel mit dem Schatz.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Auf dem Tisch liegt ein zerknülltes Blatt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die alte Uhr tickt gleichmäßig an der Wand.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Schlüssel klimpert leise in der Tasche.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Regenschirm tropft neben der Garderobe.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Lampe wirft einen gemütlichen Schein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Regal stapeln sich viele dicke Bücher.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wecker klingelt schrill am frühen Morgen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Schere schneidet das Papier in Streifen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Pinsel malt bunte Kleckse auf das Blatt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kerze flackert im leichten Luftzug.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Junge freut sich riesig über sein Geschenk.", kind: "satz", stufen: NUR_KIDS },
  { text: "Vor Aufregung kann Lena kaum still sitzen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein herzhaftes Lachen steckt schnell alle an.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Manchmal hilft ein tiefer Atemzug gegen Angst.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nach dem Streit reichen sich beide die Hand.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Stolz auf die eigene Arbeit tut richtig gut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Neugierig öffnet das Kind die alte Truhe.", kind: "satz", stufen: NUR_KIDS },
  { text: "Ein Gefühl von Glück wärmt das ganze Herz.", kind: "satz", stufen: KIDS_TEENS },
];
