/**
 * Korpus-Charge „10–12 auf Augenhöhe" (30.07.2026).
 *
 * ANLASS (gemessen mit `scripts/_zehnzwoelf.mts`, aktiver Korpus): Von 1193
 * aktiven Einträgen für Stufe b waren 844 zugleich für 7–9 freigegeben. Die
 * WICHTIGE Korrektur gegenüber dem ersten Verdacht: Davon sind nur **70
 * wirklich zu jung gerahmt** („Das Kind isst.", „Guck mal, wie hoch ich schon
 * bin!") — die übrigen 774 sind altersneutral und bloß KURZ, weil der
 * Tastensatz nichts anderes hergibt („Der Schmied schwingt den Hammer auf das
 * Eisen."). Ein Rundumschlag hätte 10–12 bei den ersten 13 Tasten von 78 auf 3
 * Zeilen gestürzt; das gezielte Absenken kostet nur 5.
 *
 * WAS DIESE DATEI IST: der Ersatz, der VOR dem Absenken dastehen muss (Weiche 4,
 * Johannes: erst schreiben, dann aussortieren). Sie deckt den gemessenen
 * Fehlbetrag mit Reserve ab:
 *
 *     Tier | Fehlbetrag nach dem Absenken | hier neu
 *     T1   |                            5 |      13
 *     T2   |                           38 |      53
 *     T3   |                           70 |      90
 *
 * Kein Retag von Bestands-Zeilen: Ein Retag auf `b` hülfe zwar der Menge, würde
 * aber die Doppel-Freigaben nicht senken — und die deckelt der Wächter-Test
 * (`tests/typing-altersgrenze.test.ts`). Append-only ans Ende von `CORPUS`.
 *
 * TON: ernst genommen, nicht nüchtern. Ein Elfjähriger ist kein Jugendlicher —
 * aber auch kein Kleinkind. Gegenstände: Training, Werkstatt, Musik, Karte und
 * Weg, Streit unter Freunden, das eigene Urteil. Keine Verkleinerungsformen,
 * keine sprechenden Tiere, kein „das Kind" als Figur, keine Moral am Schluss.
 *
 * RECHTE: alle Zeilen selbst verfasst. Bewusst als `kind: "satz"` gehalten und
 * ohne Tatsachenbehauptung, die eine Quelle bräuchte — Wissens-Inhalte
 * verlangen die Doppelbeleg-Disziplin (Bauplan §4) und laufen über eigene
 * TN-C-Chargen. Wo eine Zeile wie eine Regel klingt, ist sie als Erfahrung
 * formuliert, nicht als Sprichwort (Regel: kein erfundener Spruch als
 * `sprichwort`).
 *
 * WORTSCHATZ-GRENZEN (Regel 13): T1 kennt nur `a d e f i j k l n r s t ö` —
 * kein *und*, kein *nicht*, kein *ich*, kein *o*, kein *h*, kein Zeitwort.
 * T2 nimmt `h o u c g m b w` dazu, aber noch KEIN `z ä ü ß` (also kein *zu*,
 * *kurz*, *übt*, *fängt*, *schätzen*). Jede Zeile ist mit `minTierFor` am
 * Objekt geprüft, nicht geschätzt; ae/ue/oe-Ersatzschreibungen wären auf einer
 * deutschen Tastatur schlicht falsch und kommen darum nicht vor.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

/** Gezielt für 10–12 — bewusst NIE zusammen mit „a" (das ist der ganze Punkt). */
const KIDS_TEENS: Stufe[] = ["kids", "teens"];
export const MITTEL_CORPUS: CorpusItem[] = [
  // ── T1 · die ersten 13 Tasten ────────────────────────────────────────────
  // Hier war die Not am größten: 78 servierbare Zeilen, davon 75 auch für 7–9.
  // Ohne Redeverben und ohne Zeitwörter trägt der knappe Satz die Aussage.
  { text: "Ilka trainiert seit den Ferien.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die erste Idee ist selten die feinste.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Karin liest die Karte, dann die Liste.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nadia rennt in der ersten Elf.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tarek faltet die Karte in drei Teile.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die alte Kiste ist fest. Sie fiel nie.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nils stellt die Leiter allein an.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Sie tastet die Kante, dann tritt sie an.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Erst denken, dann treten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Kein Trainer rennt an deiner Stelle.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Eine Idee allein ist selten fertig.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Talent ist selten alles.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ilka listet jede Stelle, die knistert.", kind: "satz", stufen: KIDS_TEENS },

  // ── T2 · Erstleser-Zeichensatz (+ h o u c g m b w) ───────────────────────
  { text: "Beim Training kommt immer ein Moment, an dem es leichter wird.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer die Sache kennt, redet knapp.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Radfahren lernt niemand aus einem Buch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die schwerste Runde ist meist die dritte.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ilka baut ihr Regal aus alten Brettern.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nils misst nach und schneidet danach.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer misst, muss auch nachmessen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Werkzeug in der falschen Hand macht Arbeit.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Manche Fragen sind besser als schnelle Antworten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Mut kommt oft erst nach dem ersten Schritt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Karin hat einen Kompass und einen Bleistift dabei.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Auf der Karte sind acht Wege markiert.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der gerade Weg ist nicht immer der schnelle.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer im Wald umkehrt, hat nicht aufgegeben.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Fehler beim Messen wandert durch die ganze Arbeit.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tarek schreibt sich auf, was nicht geklappt hat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Aus einem Missgeschick wird mit der Sache ein Handgriff.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer ein Instrument lernt, hört andere Musik.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die ersten Wochen klingen schlecht. Das gehört dazu.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nadia trainiert jeden Morgen acht Minuten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Acht Minuten am Tag sind mehr als drei Stunden am Sonntag.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer nur am Wochenende trainiert, beginnt jedes Mal neu.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ilka hat sich das Werkzeug selbst geordnet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer sein Werkzeug kennt, sucht nicht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Hafen liegen zwischen den Kranen auch kleine Boote.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wind kommt heute aus dem Norden.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer segeln lernt, lernt auch warten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Manchmal ist die Ruhe das ganze Training.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer selber kocht, weiss immer, was darin ist.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kette am Rad braucht Fett, sonst mahlt sie.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Karin misst den Umfang mit einer Schnur.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Manche Aufgaben lösen sich, wenn man sie umdreht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer eine Sache jemandem beibringen kann, hat sie verstanden.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nadia hilft Ilka beim Rechnen und lernt dabei mehr.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Kran hebt den Container auf das Schiff.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Hafen arbeiten Menschen in drei Schichten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nils holt Luft und startet noch einmal von oben.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Weg wird nicht kleiner, wenn man ihn anschaut.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer laut redet, hat darum noch nicht recht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tarek liest die Anleitung erst nach dem dritten Versuch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Beim vierten liest er sie doch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Eine gute Frage bringt eine Gruppe weiter als eine schnelle Antwort.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ilka macht den Knoten dreimal, dann sitzt er.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Karin hat den Weg im Kopf und die Karte in der Hand.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer den Anfang kann, kann noch nicht das Ganze.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Am Ende macht die Ruhe den Unterschied.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nils nimmt den langen Weg und kommt trocken an.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Werkzeug, das man sucht, ist ein Werkzeug, das fehlt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nadia bringt das Rad in die Werkstatt und sieht dabei zu.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Beim zweiten Mal macht sie es allein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Manches lernt man nur, wenn es einmal schiefgeht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Fehler von gestern ist der Handgriff von morgen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ilka misst zweimal und schneidet einmal.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Karin hat die Sache im Griff, weil sie sie oft gemacht hat.", kind: "satz", stufen: KIDS_TEENS },

  // ── T3 · ganzes Alphabet ─────────────────────────────────────────────────
  { text: "Wer zu früh aufgibt, erfährt nie, ob es gereicht hätte.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Kompromiss ist kein verlorener Streit.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Zwischen Mut und Übermut liegt genau eine Frage.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ilka repariert ihr Fahrrad selbst und spart zwölf Euro.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Lehrer erklärt den Hebel an einer Schaufel.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nadia zeichnet den Plan, bevor sie sägt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer zuerst zeichnet, sägt seltener zweimal.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Skizze muss nicht schön sein, nur klar.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tarek übt die schwierige Stelle langsam.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Langsam üben ist der kürzeste Weg zu schnell.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer immer nur das Leichte übt, bleibt beim Leichten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Pause gehört zum Üben dazu.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Streit unter Freunden ist kein Bruch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Zuhören ist schwerer, als es aussieht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer nachfragt, wirkt nicht dumm, sondern wach.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Manchmal hat die andere Seite einfach recht.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ilka gibt zu, dass sie sich geirrt hat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das kostet zwei Sätze und spart eine Woche.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer flunkert, muss sich alles merken.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Wahrheit hat den Vorteil, dass man sie nicht üben muss.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Museum steht das Skelett eines Wals.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nadia zählt die Rippen und verliert den Faden.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer zählt, sollte auch markieren.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Karin sammelt Steine und sortiert sie nach Farbe.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Später sortiert sie nach Härte und lernt mehr dabei.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein System schlägt eine große Sammlung.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tarek programmiert ein kleines Spiel mit zwei Tasten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Spiel sieht hässlich aus, aber es läuft.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Etwas, das läuft, ist mehr wert als ein schöner Plan.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nils schreibt seinen Text zweimal, den zweiten kürzer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der zweite Versuch ist fast immer der bessere.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer streicht, verliert nichts außer Ballast.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Zeitung liegt am Kiosk, die Nachricht steht im Netz.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer eine Quelle nennt, macht sich angreifbar und stark zugleich.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Zwei Quellen sind besser als eine laute.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ilka prüft, wer etwas behauptet, bevor sie es glaubt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nadia klettert die Wand bis zum vierten Griff.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Beim fünften rutscht sie ab und fängt neu an.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Griff, der gestern zu weit war, geht heute.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Wer sich vergleicht, übersieht den eigenen Weg.", kind: "satz", stufen: KIDS_TEENS },
];
