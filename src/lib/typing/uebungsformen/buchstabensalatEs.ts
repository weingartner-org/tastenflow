/**
 * ★ ES-W (27.09.2026): die Quellwörter des Buchstabensalats auf Weg „es"
 * (« Letras revueltas ») - nach ERTRAG gewählt wie die deutschen und die
 * französischen: häufige, kindgerechte Nomen, kurz, und jedes gibt gegen das
 * spanische Lexikon (`lexikonWoerter("es")`) mindestens {@link SALAT_ZIEL}
 * echte Wörter her - gezählt OHNE Namen, Abkürzungen und Wörter der
 * Sperrliste (`salatNamen.ts`; Wächter `tests/tastenflow-wortspiele-es.test.ts`).
 * Gemessen am 27.09.2026: von 5 (*perro, arena, tigre*) bis 78 (*dinosaurio*).
 *
 * ★ ñ ist ein eigener Buchstabe (*piñata, montaña, compañero*): Aus
 * „montaña" lässt sich *año* holen, aber kein *ano* - `normalizeWord(_, "es")`
 * lässt ñ stehen. Die Feldbeschriftung und die Ansage zeigen darum auch das ñ
 * (`salatBuchstaben(quellwort, lang)`).
 *
 * ⚠️ OHNE Akzent (á é í ó ú): Ein Quellwort ohne Akzent ergibt auf JEDER
 * Tastatur denselben Vorrat, und Funde mit Akzent zählen dann nur, wenn der
 * Akzentbuchstabe im Vorrat steht (dieselbe Regel wie im Französischen).
 * Längere Wörter (8-10 Buchstaben) erst ab den Jugendlichen - ein langer
 * Vorrat will im Kopf behalten werden (dieselbe Regel wie im Deutschen).
 */
import type { Salatwort } from "./buchstabensalat";

const ALLE: Salatwort["stufen"] = ["kids", "teens", "erwachsen"];
const AB_TEENS: Salatwort["stufen"] = ["teens", "erwachsen"];

export const SALATWOERTER_ES: Salatwort[] = [
  // 5 und 6 Buchstaben
  { wort: "silla", stufen: ALLE },
  { wort: "playa", stufen: ALLE },
  { wort: "fresa", stufen: ALLE },
  { wort: "perro", stufen: ALLE },
  { wort: "arena", stufen: ALLE },
  { wort: "tigre", stufen: ALLE },
  { wort: "nubes", stufen: ALLE },
  { wort: "noche", stufen: ALLE },
  { wort: "plato", stufen: ALLE },
  { wort: "lunes", stufen: ALLE },
  { wort: "piano", stufen: ALLE },
  { wort: "calle", stufen: ALLE },
  { wort: "cielo", stufen: ALLE },
  { wort: "nieve", stufen: ALLE },
  { wort: "leche", stufen: ALLE },
  { wort: "piñata", stufen: ALLE },
  { wort: "pelota", stufen: ALLE },
  { wort: "cometa", stufen: ALLE },
  { wort: "paloma", stufen: ALLE },
  { wort: "helado", stufen: ALLE },
  { wort: "maleta", stufen: ALLE },
  { wort: "canela", stufen: ALLE },
  { wort: "camino", stufen: ALLE },
  { wort: "verano", stufen: ALLE },
  { wort: "tomate", stufen: ALLE },
  { wort: "tierra", stufen: ALLE },
  { wort: "piedra", stufen: ALLE },
  { wort: "sirena", stufen: ALLE },
  { wort: "regalo", stufen: ALLE },
  { wort: "pastel", stufen: ALLE },
  // 7 Buchstaben
  { wort: "ventana", stufen: ALLE },
  { wort: "caballo", stufen: ALLE },
  { wort: "montaña", stufen: ALLE },
  { wort: "escuela", stufen: ALLE },
  { wort: "mercado", stufen: ALLE },
  { wort: "patines", stufen: ALLE },
  { wort: "planeta", stufen: ALLE },
  { wort: "tijeras", stufen: ALLE },
  { wort: "palmera", stufen: ALLE },
  { wort: "lectura", stufen: ALLE },
  { wort: "mochila", stufen: ALLE },
  { wort: "tortuga", stufen: ALLE },
  // 8 bis 10 Buchstaben - erst ab den Jugendlichen
  { wort: "mariposa", stufen: AB_TEENS },
  { wort: "escalera", stufen: AB_TEENS },
  { wort: "estrella", stufen: AB_TEENS },
  { wort: "chocolate", stufen: AB_TEENS },
  { wort: "castillo", stufen: AB_TEENS },
  { wort: "biblioteca", stufen: AB_TEENS },
  { wort: "cuaderno", stufen: AB_TEENS },
  { wort: "compañero", stufen: AB_TEENS },
  { wort: "paraguas", stufen: AB_TEENS },
  { wort: "dinosaurio", stufen: AB_TEENS },
];
