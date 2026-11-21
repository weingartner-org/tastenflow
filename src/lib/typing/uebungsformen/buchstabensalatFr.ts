/**
 * ★ E10b-2 (26.09.2026): die Quellwörter des Buchstabensalats auf Weg „fr"
 * (« Lettres mélangées », Glossar Bauplan §9.2) - nach ERTRAG gewählt wie die
 * deutschen (Charge 3, 02.09.2026): häufige Nomen aus Schulbüchern (Manulex
 * CP + CE1, nur gemessen), kurz, und jedes gibt gegen das französische
 * Lexikon (`lexikonWoerter("fr")`) mindestens {@link SALAT_ZIEL} Wörter her
 * (Wächter `tests/tastenflow-wortspiele-fr.test.ts`).
 *
 * ⚠️ OHNE Akzent: Der Buchstabenvorrat wird über `normalizeWord` gebildet,
 * und ein Quellwort ohne Akzent ergibt auf JEDER Tastatur denselben Vorrat.
 * Längere Wörter (8-9 Buchstaben) erst ab den Jugendlichen - ein langer
 * Vorrat will im Kopf behalten werden (dieselbe Regel wie im Deutschen).
 */
import type { Salatwort } from "./buchstabensalat";

const ALLE: Salatwort["stufen"] = ["kids", "teens", "erwachsen"];
const AB_TEENS: Salatwort["stufen"] = ["teens", "erwachsen"];

export const SALATWOERTER_FR: Salatwort[] = [
  // 5 Buchstaben
  { wort: "sapin", stufen: ALLE },
  { wort: "singe", stufen: ALLE },
  { wort: "poule", stufen: ALLE },
  { wort: "sucre", stufen: ALLE },
  { wort: "carte", stufen: ALLE },
  { wort: "liste", stufen: ALLE },
  { wort: "route", stufen: ALLE },
  { wort: "sable", stufen: ALLE },
  { wort: "train", stufen: ALLE },
  { wort: "tapis", stufen: ALLE },
  { wort: "radis", stufen: ALLE },
  { wort: "laine", stufen: ALLE },
  // 6 Buchstaben
  { wort: "salade", stufen: ALLE },
  { wort: "tortue", stufen: ALLE },
  { wort: "dessin", stufen: ALLE },
  { wort: "souris", stufen: ALLE },
  { wort: "oiseau", stufen: ALLE },
  { wort: "soleil", stufen: ALLE },
  { wort: "papier", stufen: ALLE },
  { wort: "panier", stufen: ALLE },
  { wort: "farine", stufen: ALLE },
  { wort: "valise", stufen: ALLE },
  { wort: "chaise", stufen: ALLE },
  { wort: "orange", stufen: ALLE },
  { wort: "citron", stufen: ALLE },
  { wort: "fraise", stufen: ALLE },
  { wort: "samedi", stufen: ALLE },
  { wort: "montre", stufen: ALLE },
  // 7 Buchstaben
  { wort: "chambre", stufen: ALLE },
  { wort: "famille", stufen: ALLE },
  { wort: "cuisine", stufen: ALLE },
  { wort: "piscine", stufen: ALLE },
  { wort: "silence", stufen: ALLE },
  { wort: "machine", stufen: ALLE },
  { wort: "plaisir", stufen: ALLE },
  { wort: "manteau", stufen: ALLE },
  { wort: "guitare", stufen: ALLE },
  { wort: "semaine", stufen: ALLE },
  { wort: "moineau", stufen: ALLE },
  { wort: "sourire", stufen: ALLE },
  // 8 und 9 Buchstaben - erst ab den Jugendlichen
  { wort: "montagne", stufen: AB_TEENS },
  { wort: "cartable", stufen: AB_TEENS },
  { wort: "escargot", stufen: AB_TEENS },
  { wort: "dimanche", stufen: AB_TEENS },
  { wort: "aventure", stufen: AB_TEENS },
  { wort: "printemps", stufen: AB_TEENS },
  { wort: "confiture", stufen: AB_TEENS },
  { wort: "boulanger", stufen: AB_TEENS },
  { wort: "parapluie", stufen: AB_TEENS },
  { wort: "orchestre", stufen: AB_TEENS },
];
