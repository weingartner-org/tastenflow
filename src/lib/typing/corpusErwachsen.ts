/**
 * Erwachsenen-Charge (Textwelt TW-E13) — sachlich-humorvolle Texte für erwachsene
 * Lernende (u. a. Braille-Arbeitende): trockener Witz, ruhige Beobachtungen, ein
 * paar belastbare Fakten. KEIN Kinderton, kein Maskottchen (Bauplan §4/§5-E13).
 *
 * ★ Rechte (§10): ALLES selbst formuliert — bewusst KEINE fremden Aphorismen/Zitate
 * (die könnten urheberrechtlich geschützt sein). Es sind eigene, neue Sätze im
 * Geist trockener Alltags-Beobachtung. Fakten sind elementar und unstrittig wahr.
 *
 * Basis-Zeichensatz (keine Ziffern/Sonderzeichen), volles Alphabet → T3.
 * Append-only an CORPUS. `typing-textwelt-erwachsen` erzwingt Stufe + Zeichensatz.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const NUR_ERW: Stufe[] = ["erwachsen"];
/** Sachlich-humorvolle, selbst formulierte Beobachtungen (kein fremdes Zitat). */
const ERWACHSEN_SPRUECHE: CorpusItem[] = [
  { text: "Wer alle zehn Finger nutzt, gewinnt Zeit für das Wesentliche.", kind: "spruch", stufen: NUR_ERW },
  { text: "Ein klarer Kopf beginnt oft mit einem klaren Schreibtisch.", kind: "spruch", stufen: NUR_ERW },
  { text: "Routine ist der Freund, der niemals absagt.", kind: "spruch", stufen: NUR_ERW },
  { text: "Wer langsam liest, versteht manchmal mehr als der Eilige.", kind: "spruch", stufen: NUR_ERW },
  { text: "Ordnung spart die Zeit, die wir sonst mit Suchen verlieren.", kind: "spruch", stufen: NUR_ERW },
  { text: "Ein guter Plan am Morgen erspart viel Hektik am Abend.", kind: "spruch", stufen: NUR_ERW },
  { text: "Die beste Idee kommt selten am lautesten Ort.", kind: "spruch", stufen: NUR_ERW },
  { text: "Höflichkeit kostet nichts und bringt oft am meisten ein.", kind: "spruch", stufen: NUR_ERW },
  { text: "Wer Fragen stellt, bleibt länger neugierig als der Schweigsame.", kind: "spruch", stufen: NUR_ERW },
  { text: "Kaffee löst keine Probleme, aber er begleitet sie geduldig.", kind: "spruch", stufen: NUR_ERW },
  { text: "Ein voller Kalender ist kein Beweis für ein volles Leben.", kind: "spruch", stufen: NUR_ERW },
  { text: "Pausen sind keine verlorene Zeit, sondern getankte Kraft.", kind: "spruch", stufen: NUR_ERW },
  { text: "Wer schreibt, sortiert nebenbei seine Gedanken.", kind: "spruch", stufen: NUR_ERW },
  { text: "Gute Werkzeuge ersetzen kein Können, aber sie helfen ihm nach.", kind: "spruch", stufen: NUR_ERW },
  { text: "Manchmal ist der Umweg die eigentliche Strecke.", kind: "spruch", stufen: NUR_ERW },
  { text: "Wer zuhört, erfährt Dinge, die kein Bildschirm verrät.", kind: "spruch", stufen: NUR_ERW },
  { text: "Kleine Schritte kommen weiter als große Vorsätze.", kind: "spruch", stufen: NUR_ERW },
  { text: "Der Feierabend gehört dem Leben, nicht dem Bildschirm.", kind: "spruch", stufen: NUR_ERW },
  { text: "Genauigkeit zuerst, das Tempo stellt sich von selbst ein.", kind: "spruch", stufen: NUR_ERW },
  { text: "Ein leeres Postfach ist ein seltener, flüchtiger Anblick.", kind: "wortspiel", stufen: NUR_ERW },
];

/** Belastbare Erwachsenen-Fakten (unstrittig, ohne Zahlen). */
const ERWACHSEN_FAKTEN: CorpusItem[] = [
  { text: "Honig ist eines der wenigen Lebensmittel, das kaum verdirbt.", kind: "fakt", stufen: NUR_ERW },
  { text: "Spinnen sind keine Insekten, sondern Spinnentiere.", kind: "fakt", stufen: NUR_ERW },
  { text: "Der Eiffelturm ist im Sommer etwas höher als im Winter.", kind: "wissen", stufen: NUR_ERW },
  { text: "Bienen verständigen sich über einen Tanz.", kind: "fakt", stufen: NUR_ERW },
  { text: "Das Gehirn verbraucht viel Energie, obwohl es klein ist.", kind: "wissen", stufen: NUR_ERW },
  { text: "Der Körper erneuert ständig einen Teil seiner Zellen.", kind: "wissen", stufen: NUR_ERW },
];

/** Gesamte Erwachsenen-Charge (TW-E13). */
export const ERWACHSEN_CORPUS: CorpusItem[] = [
  ...ERWACHSEN_SPRUECHE,
  ...ERWACHSEN_FAKTEN,
];
