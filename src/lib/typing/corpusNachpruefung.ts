/**
 * Nachprüfung 28.07.2026 — die Prüfbericht-Befunde, die trotz „alles behoben"
 * noch offen waren.
 *
 * Anlass: Johannes' Nachfrage „überprüfe, ob wirklich alle gefundenen Fehler
 * ausgebessert wurden". Eine Gegenprüfung Befund für Befund am aktiven Korpus
 * ergab: von rund 80 prüfbaren Befunden waren ~70 belegt behoben — aber diese
 * hier eben nicht. Sie fielen durchs Raster, weil die zuständigen Chargen
 * jeweils nur EINEN Teil einer Gruppe erwischt hatten (4 von 8 fehlkategorisierten
 * Rätseln, 4 von 19 Pseudo-Sprichwörtern).
 *
 * Vorgehen wie immer append-only: alte Fassung in `corpusDeactivated.ts`
 * stilllegen, korrigierte Fassung HIER neu anhängen. `bausteinKey` normalisiert
 * nur Satz-/Sonderzeichen weg — schon ein eingefügtes Leerzeichen („genau so" vs.
 * „genauso") ergibt eine andere ID, deshalb geht auch das nicht in-place.
 *
 * Prüfbericht: `Sensorik/Pruefberichte/PRUEFBERICHT-2026-07-27-TASTENFLOW-TEXTE.md`.
 */
import type { CorpusItem, CorpusKind, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const NUR_KIDS: Stufe[] = ["kids"];
const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
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

/**
 * Rätsel, die als `satz` getaggt waren (Prüfbericht 1.1c: „8 Witzrätsel als
 * kind satz"). TN-E12 hatte vier davon erwischt, diese vier nicht — sie liefen
 * weiter in der Lektion „Erste ganze Sätze" mit. Inhalt bleibt, nur die Sorte
 * stimmt jetzt.
 */
const SORTE_WITZ: CorpusItem[] = [
  it("Was raschelt da im Busch? Ein kleines Eichhörnchen!", "witz", NUR_KIDS),
  it("Was sitzt auf dem Baum und ruft Aha? Eine Meise mit Schnupfen.", "witz", KIDS_TEENS),
  it("Wo treffen sich viele Kühe? In einem Muuuuseum.", "witz", KIDS_TEENS),
  it("Warum kann ein Fahrrad nicht stehen? Es ist zu müde.", "witz", KIDS_TEENS),
  // Vom neuen Regel-Gate gefunden — im Prüfbericht standen nur 8, es waren 9.
  it("Welches Tier kann am besten rechnen? Die Addierschlange.", "witz", KIDS_TEENS),
];

/**
 * Erfundene Sinnsprüche, die als `sprichwort` getaggt waren (Prüfbericht 1.1c:
 * „~21 erfundene Pseudo-Sprichwörter"). Ein `sprichwort` gibt sich als
 * überliefertes Gut aus — genau das sind diese Zeilen nicht. Als `spruch`
 * (Motto/Sinnspruch) sind sie richtig eingeordnet und dürfen bleiben; zwei
 * Zeilen bekommen die Sorte, die inhaltlich passt.
 *
 * Eine Nebenwirkung des Sorten-Wechsels: Das TN-E4-Gate („kein Kinder-Humor für
 * c/erwachsen") prüft `witz`/`wortspiel`/`spruch` und schlägt an, sobald ein
 * Eintrag ZUGLEICH für Stufe a und für c/erwachsen gilt. Die fünf altersneutralen
 * Mottos verlieren darum die Stufe a — für 7–9-Jährige gibt es reichlich eigene
 * Sprüche, und die dünnen Zellen c/erwachsen behalten die Zeile.
 */
const SORTE_SPRUCH: CorpusItem[] = [
  it("Wer rastet im Lernen, der rostet im Können.", "spruch", TEENS_ERW),
  it("Übung macht den Punkt zur Linie.", "spruch", NUR_ERW),
  it("Wer tastet, der findet.", "spruch", ALLE_DREI),
  it("Auch unter den Fingern kann man lesen.", "spruch", TEENS_ERW),
  it("Der Wald ruft, und das Echo lacht.", "spruch", KIDS_TEENS),
  it("Hund und Katze, alte Freunde im Streit.", "spruch", KIDS_TEENS),
  // Bild- und Kinderregister („Lieder im Mund") — bleibt bei a/b, nicht bei c.
  it("Sonne im Herzen, Lieder im Mund.", "spruch", KIDS_TEENS),
  it("Wer fragt, der lernt.", "spruch", ALLE_DREI),
  it("Reden ist gut, Tun ist besser.", "spruch", ALLE_DREI),
  it("Klein anfangen, groß werden.", "spruch", ALLE_DREI),
  it("Wer lacht, hat mehr Luft.", "spruch", KIDS_TEENS),
  it("Wer langsam tastet, liest auch gut.", "spruch", KIDS_TEENS),
  it("Ein guter Tag fängt mit Lachen an.", "spruch", ALLE_DREI),
  // Kein Spruch, sondern eine Braille-Tatsache — gehört zu den Fakten.
  it("Sechs Punkte sind ein ganzer Buchstabe.", "fakt", ALLE_DREI),
  // Kein Spruch, sondern ein schlichter Satz (wie „Kater Karl" in TN-E12).
  it("Der Hund mag warme Wurst.", "satz", NUR_KIDS),
];

/**
 * Restliche Einzelbefunde.
 */
const REST: CorpusItem[] = [
  // Prüfbericht 1.6: „Rabatt-Werbesprache" (corpusZahlen.ts). Die Prozent-Übung
  // bleibt, die Werbeformel „Im Angebot" fällt weg.
  it("Die Jacke kostet heute 20 Prozent weniger.", "satz", KIDS_TEENS),
  // Prüfbericht 1.4 („genau so" vs. „genauso"): derselbe Fehlertyp wie der in
  // TN-E12 behobene, nur in einer später geschriebenen Zeile.
  it(
    "Der Wasserkocher braucht genauso lange wie meine Geduld am Morgen.",
    "satz",
    NUR_ERW,
  ),
];

export const NACHPRUEFUNG_CORPUS: CorpusItem[] = [
  ...SORTE_WITZ,
  ...SORTE_SPRUCH,
  ...REST,
];
