/**
 * ★ PL-W (09.10.2026): die Quellwörter des Buchstabensalats auf Weg „pl" (*Pomieszane litery*) - nach ERTRAG gewählt wie
 * die deutschen, französischen, spanischen und italienischen: häufige, kindgerechte Nomen aus dem Alltag, und jedes gibt
 * gegen das polnische Lexikon (`lexikonWoerter("pl")`) mindestens {@link SALAT_ZIEL} echte Wörter her - gezählt OHNE Namen,
 * Abkürzungen, Bruchstücke, Schreibungen ohne Ogonki und Wörter, die ein Kind nicht finden soll (`salatNamen.ts`; Wächter
 * `tests/tastenflow-wortspiele-pl.test.ts`). Jedes Quellwort steht selbst im polnischen Lexikon (sonst buchstabierte die
 * Stimme es).
 *
 * ★ Die neun polnischen Buchstaben sind EIGENE Buchstaben (`normalizeWord(_, "pl")` lässt sie stehen): aus *trąbka* zählt
 * *trąba*, aus einem Vorrat ohne `ą` nie - ein Fund mit `ą` zählt nur, wenn das `ą` im Vorrat steht. Vier Quellwörter
 * tragen einen polnischen Buchstaben (*pociąg, ogórek, jabłko, trąbka*, dazu *wiewiórka, słonecznik* ab den Jugendlichen):
 * Sie kommen erst, wenn dieser Buchstabe gelernt ist (`fitsKeys`), und üben ihn dann im Vorrat. Die übrigen sind ohne
 * polnische Buchstaben, damit der Salat schon nach `u` (Nr. 22) etwas anzubieten hat.
 *
 * Längere Wörter (8-10 Buchstaben) erst ab den Jugendlichen - ein langer Vorrat will im Kopf behalten werden (dieselbe
 * Regel wie im Deutschen und Italienischen).
 */
import type { Salatwort } from "./buchstabensalat";

const ALLE: Salatwort["stufen"] = ["kids", "teens", "erwachsen"];
const AB_TEENS: Salatwort["stufen"] = ["teens", "erwachsen"];

export const SALATWOERTER_PL: Salatwort[] = [
  // 5 Buchstaben
  { wort: "motyl", stufen: ALLE },
  { wort: "balon", stufen: ALLE },
  { wort: "zegar", stufen: ALLE },
  { wort: "lampa", stufen: ALLE },
  { wort: "dywan", stufen: ALLE },
  { wort: "sanki", stufen: ALLE },
  { wort: "karta", stufen: ALLE },
  { wort: "ekran", stufen: ALLE },
  { wort: "kwiat", stufen: ALLE },
  { wort: "skarb", stufen: ALLE },
  { wort: "wyspa", stufen: ALLE },
  { wort: "kogut", stufen: ALLE },
  { wort: "obiad", stufen: ALLE },
  // 6 Buchstaben
  { wort: "kotlet", stufen: ALLE },
  { wort: "piasek", stufen: ALLE },
  { wort: "zeszyt", stufen: ALLE },
  { wort: "plecak", stufen: ALLE },
  { wort: "sweter", stufen: ALLE },
  { wort: "wiosna", stufen: ALLE },
  { wort: "ziemia", stufen: ALLE },
  { wort: "koszyk", stufen: ALLE },
  { wort: "statek", stufen: ALLE },
  { wort: "litera", stufen: ALLE },
  { wort: "myszka", stufen: ALLE },
  { wort: "spacja", stufen: ALLE },
  { wort: "kolano", stufen: ALLE },
  { wort: "muzyka", stufen: ALLE },
  { wort: "dolina", stufen: ALLE },
  { wort: "korona", stufen: ALLE },
  { wort: "kompas", stufen: ALLE },
  { wort: "muszla", stufen: ALLE },
  { wort: "piesek", stufen: ALLE },
  { wort: "cebula", stufen: ALLE },
  { wort: "jagoda", stufen: ALLE },
  { wort: "kompot", stufen: ALLE },
  { wort: "kangur", stufen: ALLE },
  { wort: "delfin", stufen: ALLE },
  { wort: "kartka", stufen: ALLE },
  { wort: "sernik", stufen: ALLE },
  { wort: "gitara", stufen: ALLE },
  { wort: "kamera", stufen: ALLE },
  { wort: "namiot", stufen: ALLE },
  { wort: "bocian", stufen: ALLE },
  { wort: "pociąg", stufen: ALLE },
  { wort: "ogórek", stufen: ALLE },
  { wort: "jabłko", stufen: ALLE },
  { wort: "trąbka", stufen: ALLE },
  // 7 Buchstaben
  { wort: "pomidor", stufen: ALLE },
  { wort: "rakieta", stufen: ALLE },
  { wort: "tramwaj", stufen: ALLE },
  { wort: "latarka", stufen: ALLE },
  { wort: "kalosze", stufen: ALLE },
  { wort: "marchew", stufen: ALLE },
  { wort: "cytryna", stufen: ALLE },
  { wort: "kanarek", stufen: ALLE },
  { wort: "pingwin", stufen: ALLE },
  { wort: "parasol", stufen: ALLE },
  { wort: "telefon", stufen: ALLE },
  { wort: "klawisz", stufen: ALLE },
  { wort: "zadanie", stufen: ALLE },
  { wort: "tablica", stufen: ALLE },
  { wort: "jezioro", stufen: ALLE },
  { wort: "tulipan", stufen: ALLE },
  { wort: "ptaszek", stufen: ALLE },
  { wort: "pierogi", stufen: ALLE },
  { wort: "barszcz", stufen: ALLE },
  { wort: "makaron", stufen: ALLE },
  { wort: "czosnek", stufen: ALLE },
  { wort: "kapusta", stufen: ALLE },
  { wort: "gruszka", stufen: ALLE },
  { wort: "herbata", stufen: ALLE },
  { wort: "samolot", stufen: ALLE },
  { wort: "autobus", stufen: ALLE },
  { wort: "gwiazda", stufen: ALLE },
  { wort: "pelikan", stufen: ALLE },
  { wort: "kolacja", stufen: ALLE },
  { wort: "piernik", stufen: ALLE },
  { wort: "dzwonek", stufen: ALLE },
  // 8 bis 10 Buchstaben - ab den Jugendlichen
  { wort: "latarnia", stufen: AB_TEENS },
  { wort: "poduszka", stufen: AB_TEENS },
  { wort: "czekolada", stufen: AB_TEENS },
  { wort: "hulajnoga", stufen: AB_TEENS },
  { wort: "motocykl", stufen: AB_TEENS },
  { wort: "helikopter", stufen: AB_TEENS },
  { wort: "teleskop", stufen: AB_TEENS },
  { wort: "kalendarz", stufen: AB_TEENS },
  { wort: "parasolka", stufen: AB_TEENS },
  { wort: "akwarium", stufen: AB_TEENS },
  { wort: "dinozaur", stufen: AB_TEENS },
  { wort: "krokodyl", stufen: AB_TEENS },
  { wort: "biblioteka", stufen: AB_TEENS },
  { wort: "telewizor", stufen: AB_TEENS },
  { wort: "wieloryb", stufen: AB_TEENS },
  { wort: "ogrodnik", stufen: AB_TEENS },
  { wort: "tornister", stufen: AB_TEENS },
  { wort: "piekarnia", stufen: AB_TEENS },
  { wort: "bursztyn", stufen: AB_TEENS },
  { wort: "wodospad", stufen: AB_TEENS },
  { wort: "marchewka", stufen: AB_TEENS },
  { wort: "truskawka", stufen: AB_TEENS },
  { wort: "wiewiórka", stufen: AB_TEENS },
  { wort: "schronisko", stufen: AB_TEENS },
  { wort: "słonecznik", stufen: AB_TEENS },
  { wort: "skrzypce", stufen: AB_TEENS },
  { wort: "fortepian", stufen: AB_TEENS },
];
