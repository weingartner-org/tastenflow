/**
 * ★ IT-W (03.10.2026): die Quellwörter des Buchstabensalats auf Weg „it" (*Lettere mescolate*) - nach ERTRAG gewählt
 * wie die deutschen, französischen und spanischen: häufige, kindgerechte Nomen aus dem Alltag, und jedes gibt gegen das
 * italienische Lexikon (`lexikonWoerter("it")`) mindestens {@link SALAT_ZIEL} echte Wörter her - gezählt OHNE Namen,
 * Abkürzungen, Bruchstücke und Wörter der Sperrliste (`salatNamen.ts`; Wächter `tests/tastenflow-wortspiele-it.test.ts`).
 * Die gemessenen Zahlen je Quellwort stehen im Befund `BEFUND-2026-10-02-IT-WORTSPIELE.md`.
 *
 * ⚠️ OHNE Akzent (à è é ì ò ù) und ohne Apostroph: Ein Quellwort ohne Akzent ergibt auf JEDER Tastatur denselben
 * Vorrat, und ein Fund mit Akzent zählt nur, wenn der Akzentbuchstabe im Vorrat steht (dieselbe Regel wie im
 * Französischen und Spanischen). Längere Wörter (8-10 Buchstaben) erst ab den Jugendlichen - ein langer Vorrat will
 * im Kopf behalten werden (dieselbe Regel wie im Deutschen).
 */
import type { Salatwort } from "./buchstabensalat";

const ALLE: Salatwort["stufen"] = ["kids", "teens", "erwachsen"];
const AB_TEENS: Salatwort["stufen"] = ["teens", "erwachsen"];

export const SALATWOERTER_IT: Salatwort[] = [
  // 5 Buchstaben
  { wort: "sasso", stufen: ALLE },
  { wort: "pesce", stufen: ALLE },
  { wort: "torta", stufen: ALLE },
  { wort: "leone", stufen: ALLE },
  { wort: "trota", stufen: ALLE },
  { wort: "notte", stufen: ALLE },
  { wort: "scala", stufen: ALLE },
  { wort: "nuoto", stufen: ALLE },
  { wort: "terra", stufen: ALLE },
  { wort: "volpe", stufen: ALLE },
  { wort: "fiore", stufen: ALLE },
  { wort: "ponte", stufen: ALLE },
  { wort: "colla", stufen: ALLE },
  { wort: "ruota", stufen: ALLE },
  { wort: "cervo", stufen: ALLE },
  { wort: "perla", stufen: ALLE },
  { wort: "porta", stufen: ALLE },
  { wort: "prato", stufen: ALLE },
  { wort: "testa", stufen: ALLE },
  { wort: "zaino", stufen: ALLE },
  { wort: "festa", stufen: ALLE },
  { wort: "monte", stufen: ALLE },
  { wort: "corda", stufen: ALLE },
  { wort: "salto", stufen: ALLE },
  { wort: "vento", stufen: ALLE },
  { wort: "sedia", stufen: ALLE },
  { wort: "ombra", stufen: ALLE },
  { wort: "isola", stufen: ALLE },
  // 6 Buchstaben
  { wort: "riccio", stufen: ALLE },
  { wort: "carota", stufen: ALLE },
  { wort: "lumaca", stufen: ALLE },
  { wort: "cucina", stufen: ALLE },
  { wort: "aquila", stufen: ALLE },
  { wort: "matita", stufen: ALLE },
  { wort: "strada", stufen: ALLE },
  { wort: "balena", stufen: ALLE },
  { wort: "tavolo", stufen: ALLE },
  { wort: "canale", stufen: ALLE },
  { wort: "colori", stufen: ALLE },
  { wort: "estate", stufen: ALLE },
  { wort: "piatto", stufen: ALLE },
  { wort: "farina", stufen: ALLE },
  { wort: "stella", stufen: ALLE },
  { wort: "numero", stufen: ALLE },
  { wort: "tesoro", stufen: ALLE },
  { wort: "sapone", stufen: ALLE },
  { wort: "panino", stufen: ALLE },
  { wort: "gelato", stufen: ALLE },
  { wort: "scuola", stufen: ALLE },
  { wort: "teatro", stufen: ALLE },
  { wort: "limone", stufen: ALLE },
  { wort: "regina", stufen: ALLE },
  { wort: "pietra", stufen: ALLE },
  // 7 Buchstaben
  { wort: "fontana", stufen: ALLE },
  { wort: "gondola", stufen: ALLE },
  { wort: "candela", stufen: ALLE },
  { wort: "lavagna", stufen: ALLE },
  { wort: "arancia", stufen: ALLE },
  { wort: "autunno", stufen: ALLE },
  { wort: "violino", stufen: ALLE },
  // 8 bis 10 Buchstaben - ab den Jugendlichen
  { wort: "pomodoro", stufen: AB_TEENS },
  { wort: "farfalla", stufen: AB_TEENS },
  { wort: "orologio", stufen: AB_TEENS },
  { wort: "lenzuolo", stufen: AB_TEENS },
  { wort: "pennello", stufen: AB_TEENS },
  { wort: "tartaruga", stufen: AB_TEENS },
  { wort: "telefono", stufen: AB_TEENS },
  { wort: "focaccia", stufen: AB_TEENS },
  { wort: "spiaggia", stufen: AB_TEENS },
  { wort: "elefante", stufen: AB_TEENS },
  { wort: "pinguino", stufen: AB_TEENS },
  { wort: "ciliegia", stufen: AB_TEENS },
  { wort: "chitarra", stufen: AB_TEENS },
  { wort: "ombrello", stufen: AB_TEENS },
  { wort: "righello", stufen: AB_TEENS },
  { wort: "castagna", stufen: AB_TEENS },
  { wort: "coniglio", stufen: AB_TEENS },
  { wort: "zucchero", stufen: AB_TEENS },
  { wort: "montagna", stufen: AB_TEENS },
  { wort: "gabbiano", stufen: AB_TEENS },
  { wort: "biscotto", stufen: AB_TEENS },
];
