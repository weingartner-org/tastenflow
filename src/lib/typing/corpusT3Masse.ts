/**
 * T3-Masse-Nachlage (Textwelt, wiederholbare Charge §9) — 46 selbst verfasste
 * (§10) Sätze mit reichem Wortschatz (volles Alphabet, T3). Themen: Jahreszeiten,
 * Berufe, Natur, Wetter, Orte, kleine Szenen. Füllt die Vielfalt im vollen
 * Zeichensatz und hält „Mein Training" auch bei fortgeschrittenem Stand lange
 * ohne Wiederholung sinnvoll.
 *
 * Rechte (§10): eigenes Werk. Beschreibende Szenen ohne Zahlen/Wahrheits-
 * behauptungen → kein Faktencheck. Volles Alphabet, keine Ziffern → alle ≤T3
 * (mit `scripts/_twcheck` gegen minTierFor ≤3 und den Gesamtbestand geprüft).
 * Append-only → Ledger-Indizes stabil. Test `typing-textwelt-t3masse`.
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
export const T3MASSE_CORPUS: CorpusItem[] = [
  { text: "Im Frühling zwitschern die Vögel im Park.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Gärtnerin pflanzt zarte Setzlinge ins Beet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Fluss quaken die Frösche den ganzen Tag.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Schäfer zieht mit seiner Herde übers Feld.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Schmetterling flattert über die Wiese.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Zwillinge bauen zusammen eine Burg.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Auf dem Dachfirst sitzt eine graue Taube.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Pilz wächst versteckt unter dem Moos.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Winter glitzert der Frost an den Zweigen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Feuerwehr übt das Löschen mit dem Schlauch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Zauberer holt ein Kaninchen aus dem Hut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Hafen schaukeln bunte Boote im Wasser.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Möwe stürzt sich pfeilschnell ins Meer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bäcker verkauft frische Brezeln und Brot.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Eichhörnchen hüpft flink von Ast zu Ast.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder pflücken reife Äpfel vom Baum.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Zug quietscht, als er im Bahnhof hält.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Zoo wälzt sich das Nilpferd im Schlamm.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Ärztin verbindet das kranke Knie.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Junge übt fleißig auf seiner Geige.", kind: "satz", stufen: NUR_KIDS },
  { text: "Ein warmer Sommerregen erfrischt den Garten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Wolken türmen sich vor dem Gewitter.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Blitz zuckt hell über den dunklen Himmel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Bald darauf grollt der Donner in der Ferne.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Katze putzt sich gemütlich in der Sonne.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Fuchs schnürt lautlos durch das hohe Gras.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Lagerfeuer erzählt der Opa alte Sagen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Funken tanzen hoch in die Nacht hinauf.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Schmied schwingt den Hammer auf das Eisen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "In der Werkstatt riecht es nach frischem Holz.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Näherin steppt einen bunten Flicken auf.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Postbote bringt ein dickes Päckchen vorbei.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Auf dem Markt feilscht die Frau um den Preis.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Koch würzt die Suppe mit frischem Pfeffer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Bäuerin füttert die quiekenden Ferkel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Reh äugt vorsichtig aus dem Dickicht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Specht zimmert sein Loch in den Stamm.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Sonne versinkt glutrot hinter den Hügeln.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Vollmond spiegelt sich im stillen Teich.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Eine Fledermaus jagt lautlos nach Motten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wanderer folgt dem Pfad über den Pass.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Vom Gipfel schweift der Blick weit ins Land.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Quelle sprudelt frisch aus dem Felsen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Regenbogen wölbt sich über das Tal.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kinder springen quietschend in die Pfützen.", kind: "satz", stufen: NUR_KIDS },
  { text: "Zufrieden gähnt der Hund und streckt sich lang.", kind: "satz", stufen: KIDS_TEENS },
];
