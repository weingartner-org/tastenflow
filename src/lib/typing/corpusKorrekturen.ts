/**
 * TN-E12 (Nachzügler-Charge, 27.07.2026) — die restlichen Befunde des
 * Prüfberichts vom 27.07., die weder in die P1-Liste noch in eine der
 * Inhalts-Etappen gefallen sind.
 *
 * Anlass: Nachfrage „hast du alles ausgebessert?" — die ehrliche Antwort war
 * nein. Offen waren noch acht sachlich falsche/irreführende Fakten, zehn
 * Sprachfehler, vier Erstleser-Zeilen mit Fehlvorstellungs-Risiko und (auf der
 * englischen Seite, `corpusEnKorrekturen.ts`) acht Grammatik-/Sinnfehler.
 *
 * Vorgehen wie immer append-only: Die alte Fassung wird in
 * `corpusDeactivated.ts` stillgelegt, die korrigierte hier NEU angehängt.
 * Eine Textänderung an alter Manifest-Position würde die `bausteinId`
 * verschieben und das No-Repeat-Ledger aller Kinder zurücksetzen.
 *
 * Belege für die Sach-Korrekturen stehen im Prüfbericht
 * `Sensorik/Pruefberichte/PRUEFBERICHT-2026-07-27-TASTENFLOW-TEXTE.md`,
 * Abschnitt „Lehrreich (Faktencheck)".
 */
import type { CorpusItem, CorpusKind, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const NUR_KIDS: Stufe[] = ["kids"];
const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
const NUR_TEENS: Stufe[] = ["teens"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
const NUR_ERW: Stufe[] = ["erwachsen"];
const EIGEN: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
};

const it = (text: string, kind: CorpusKind, stufen: Stufe[]): CorpusItem => ({
  text,
  kind,
  stufen,
  herkunft: EIGEN,
});

/** Sachlich korrigierte Fassungen (alte Fassung stillgelegt). */
const FAKTEN: CorpusItem[] = [
  // Folklore ohne Beleg → beschreibt jetzt die belegte Trockenstarre.
  it("Manche Schnecken überstehen trockene Zeiten in einer Art Starre.", "fakt", KIDS_TEENS),
  // „millionenfach" überzeichnet (gängig 10.000 bis 100.000-fach); die neue
  // Fassung nennt eine sichere Untergrenze und bleibt im T2-Zeichensatz.
  it("Ein Hund riecht um ein Tausendfaches besser als ein Mensch.", "fakt", ALLE_DREI),
  // „hunderte am Tag" gilt für die ganze Larvenzeit, nicht für einen Tag.
  it("Ein Marienkäfer frisst an einem Tag etwa fünfzig Blattläuse.", "fakt", KIDS_TEENS),
  // Nur JUNGE Sonnenblumen wandern mit; die aufgeblühte steht fest nach Osten.
  it("Junge Sonnenblumen wandern mit der Sonne, alte stehen nach Osten.", "fakt", KIDS_TEENS),
  // Nach Hornbostel-Sachs ist das Klavier ein Saiteninstrument (Chordophon).
  it("Beim Klavier schlagen Hämmer auf Saiten, darum zählt es zu den Saiteninstrumenten.", "wissen", NUR_ERW),
  // „Wood Wide Web" gilt als überinterpretiert; die Verflechtung selbst ist unstrittig.
  it("Baumwurzeln sind im Boden eng mit feinen Pilzgeflechten verwoben.", "fakt", TEENS_ERW),
  // Es war ein KRIEG (britisch-sansibarisch, 1896), keine Schlacht.
  it("Der kürzeste Krieg der Geschichte dauerte weniger als eine Stunde.", "fakt", NUR_ERW),
  it("Der kürzeste Krieg der Geschichte war nach gut einer halben Stunde vorbei.", "fakt", NUR_TEENS),
  // 50,7 Prozent — „meist" überzeichnet den knappen Vorsprung.
  it("Schon bei 23 Menschen ist ein gemeinsamer Geburtstag wahrscheinlicher als keiner.", "wissen", NUR_ERW),
];

/** Sprachlich korrigierte Fassungen (Groß-/Kleinschreibung, Wortwahl). */
const SPRACHE: CorpusItem[] = [
  // Hinweis: Die reinen GROSSSCHREIBUNGS-Korrekturen (Doppelpunkt-Sätze,
  // „der Große") stehen NICHT hier, sondern wurden an Ort und Stelle im Quelltext
  // gefixt. Grund: `bausteinKey` ignoriert Groß-/Kleinschreibung und Satzzeichen —
  // die ID bleibt also gleich (ledger-sicher), und `mergeCorpus` hätte eine
  // angehängte Zweitfassung ohnehin als Dublette verworfen (dann wäre die Zeile
  // mit der Deaktivierung der Altfassung ganz verschwunden).
  // „genau so" (auf diese Weise) vs. „genauso" (in gleicher Weise).
  it("Anna, Otto, Reliefpfeiler: alles Wörter, die rückwärts genauso klingen.", "wortspiel", KIDS_TEENS),
  // „rücklings" heißt auf dem Rücken, nicht rückwärts gelesen.
  it("Anna, Otto und Hannah heißen rückwärts gelesen genauso wie vorwärts.", "wortspiel", NUR_ERW),
  // Substantiviertes Adjektiv → groß.
  // Die überlieferte Bauernregel lautet anders; die alte Fassung ergab keinen Sinn.
  it("Abendrot, Gutwetterbote. Morgenrot, schlecht Wetter droht.", "sprichwort", ALLE_DREI),
  it("Ist es an Lichtmess hell und rein, wird ein langer Winter sein.", "sprichwort", TEENS_ERW),
];

/**
 * Vier Zeilen waren als `sprichwort` getaggt, sind aber schlichte Sätze (zwei
 * davon ohne Verb). Inhalt bleibt, nur die Sorte stimmt jetzt.
 */
const SORTE: CorpusItem[] = [
  it("Kater Karl mag warme Milch.", "satz", NUR_KIDS),
  it("Im Gras liegen eine Ente, ein Igel und ein Hund.", "satz", NUR_KIDS),
  it("Mein Hut ist im Garten.", "satz", NUR_KIDS),
  it("Im alten Haus wohnt eine Maus.", "satz", NUR_KIDS),
];

/** Erstleser-Zeilen, die eine Fehlvorstellung anlegten. */
const ERSTLESER: CorpusItem[] = [
  // Fische nehmen gelösten Sauerstoff auf, sie holen keine Luft.
  it("Ein Fisch lebt im Wasser und atmet mit Kiemen.", "wissen", NUR_KIDS),
  // Wolken sind feinste Tröpfchen und Eiskristalle, nicht „nasse Luft".
  it("Eine Wolke besteht aus feinem Wasser. Daraus wird der Regen.", "wissen", NUR_KIDS),
  // Der Fachbegriff heißt Schwimmhaut; „an den Fingern" war falsch.
  it("Eine Ente hat an den Beinen eine Schwimmhaut.", "wissen", NUR_KIDS),
  // Der alte Satz brach mittendrin ab und sagte nichts aus.
  it("Ein Hai hat im Mund viele Reihen von Zähnen.", "wissen", NUR_KIDS),
];

/** TN-E13 (Rest-Charge): Ersatz für Wein-Wortspiel, Marke und Film-Tagline. */
const REST: CorpusItem[] = [
  // Gleiche Buchstaben-Pointe, ohne Alkohol (Wunsch Johannes 27.07.).
  it("Aus Eis wird mit einem R ein Reis.", "wortspiel", KIDS_TEENS),
  // Der Vergleich ist stark, der Markenname unnötig.
  it("Kleopatra lebte näher am ersten Smartphone als am Bau der Pyramiden.", "wissen", NUR_TEENS),
  // Ohne die Horrorfilm-Werbezeile, dafür mit dem, was daraus folgt.
  it("Im All gibt es keinen Schall. Rufen bringt dort gar nichts.", "fakt", NUR_TEENS),
];

export const KORREKTUR_CORPUS: CorpusItem[] = [
  ...FAKTEN,
  ...SPRACHE,
  ...SORTE,
  ...ERSTLESER,
  ...REST,
];
