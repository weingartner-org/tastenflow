/**
 * ★ O2-TASTATUR (30.10.2026): DIE AKZENT-TOTASTEN, DIE ERST MIT DEN NEUN SPRACHEN KAMEN - Tilde (pt, br, nl) und Tonos samt Dialytika
 * mit Tonos (el). In ALLEN siebzehn Bedienungssprachen, denn das Zahnrad bietet die Tastatur auch einem Kind mit anderer Bedienung an.
 * Die vier Akzente von vorher (`AKZENTE_<XX>`) bleiben, wo sie sind: ihre Schlüssel gelten in jeder Sprach-Datei, und die Sätze der
 * acht alten Sprachen ändern sich nicht. `tsc` verlangt hier jede Sprache und jeden Akzent.
 * Der zweite Satz („erscheint erst mit dem nächsten Buchstaben") steht je Sprache schon in `AKZENTE_<XX>`; er kommt von dort.
 * ⚠️ Ohne Muttersprachler-Lesung ([G]).
 */
import type { BedienSprache } from "../bedienSprache/sprache";

export type NeuerAkzent = "tilde" | "tonos" | "dialytikaTonos";

const NEUE_AKZENTE = new Set<string>(["tilde", "tonos", "dialytikaTonos"]);

export function istNeuerAkzent(id: string): id is NeuerAkzent {
  return NEUE_AKZENTE.has(id);
}

export const AKZENTE_NEU: Readonly<Record<BedienSprache, Readonly<Record<NeuerAkzent, { name: string; was: string }>>>> = {
  de: {
    tilde: { name: "Tilde", was: "setzt eine kleine Welle auf den nächsten Buchstaben, zum Beispiel ã." },
    tonos: { name: "Tonos", was: "setzt den Betonungsstrich auf den nächsten griechischen Buchstaben, zum Beispiel ά." },
    dialytikaTonos: { name: "Dialytika mit Tonos", was: "setzt zwei Punkte und den Betonungsstrich auf den nächsten griechischen Buchstaben, zum Beispiel ΐ." },
  },
  en: {
    tilde: { name: "tilde", was: "puts a little wave on the next letter, for example ã." },
    tonos: { name: "tonos", was: "puts the stress mark on the next Greek letter, for example ά." },
    dialytikaTonos: { name: "dialytika tonos", was: "puts two dots and the stress mark on the next Greek letter, for example ΐ." },
  },
  fr: {
    tilde: { name: "tilde", was: "met une petite vague sur la lettre suivante, par exemple ã." },
    tonos: { name: "tonos", was: "met l'accent grec sur la lettre grecque suivante, par exemple ά." },
    dialytikaTonos: { name: "dialytika tonos", was: "met deux points et l'accent grec sur la lettre grecque suivante, par exemple ΐ." },
  },
  es: {
    tilde: { name: "virgulilla", was: "pone una pequeña onda sobre la letra siguiente, por ejemplo ã." },
    tonos: { name: "tonos", was: "pone el acento griego sobre la letra griega siguiente, por ejemplo ά." },
    dialytikaTonos: { name: "dialytika tonos", was: "pone dos puntos y el acento griego sobre la letra griega siguiente, por ejemplo ΐ." },
  },
  it: {
    tilde: { name: "tilde", was: "mette una piccola onda sulla lettera seguente, per esempio ã." },
    tonos: { name: "tonos", was: "mette l'accento greco sulla lettera greca seguente, per esempio ά." },
    dialytikaTonos: { name: "dialytika tonos", was: "mette due punti e l'accento greco sulla lettera greca seguente, per esempio ΐ." },
  },
  pl: {
    tilde: { name: "tylda", was: "stawia małą falkę nad następną literą, na przykład ã." },
    tonos: { name: "tonos", was: "stawia grecki akcent nad następną grecką literą, na przykład ά." },
    dialytikaTonos: { name: "dialytika tonos", was: "stawia dwie kropki i grecki akcent nad następną grecką literą, na przykład ΐ." },
  },
  tr: {
    tilde: { name: "tilde işareti", was: "sonraki harfin üstüne küçük bir dalga koyar, örneğin ã." },
    tonos: { name: "tonos", was: "sonraki Yunan harfinin üstüne vurgu işareti koyar, örneğin ά." },
    dialytikaTonos: { name: "dialytika tonos", was: "sonraki Yunan harfinin üstüne iki nokta ve vurgu işareti koyar, örneğin ΐ." },
  },
  cs: {
    tilde: { name: "vlnovka", was: "dá nad další písmeno malou vlnku, například ã." },
    tonos: { name: "tonos", was: "dá nad další řecké písmeno přízvuk, například ά." },
    dialytikaTonos: { name: "dialytika tonos", was: "dá nad další řecké písmeno dvě tečky a přízvuk, například ΐ." },
  },
  bg: {
    tilde: { name: "вълничка", was: "слага малка вълничка над следващата буква, например ã." },
    tonos: { name: "тонос", was: "слага гръцкото ударение над следващата гръцка буква, например ά." },
    dialytikaTonos: { name: "диалитика с тонос", was: "слага две точки и ударение над следващата гръцка буква, например ΐ." },
  },
  el: {
    tilde: { name: "περισπωμένη", was: "βάζει ένα μικρό κύμα πάνω στο επόμενο γράμμα, για παράδειγμα ã." },
    tonos: { name: "τόνος", was: "βάζει τον τόνο στο επόμενο γράμμα, για παράδειγμα ά." },
    dialytikaTonos: { name: "διαλυτικά και τόνος", was: "βάζει διαλυτικά και τόνο στο επόμενο γράμμα, για παράδειγμα ΐ." },
  },
  hu: {
    tilde: { name: "hullámvonal", was: "kis hullámot tesz a következő betűre, például ã." },
    tonos: { name: "tonosz", was: "görög hangsúlyjelet tesz a következő görög betűre, például ά." },
    dialytikaTonos: { name: "dialütika tonosszal", was: "két pontot és hangsúlyjelet tesz a következő görög betűre, például ΐ." },
  },
  nl: {
    tilde: { name: "tilde", was: "zet een klein golfje op de volgende letter, bijvoorbeeld ã." },
    tonos: { name: "tonos", was: "zet het Griekse accent op de volgende Griekse letter, bijvoorbeeld ά." },
    dialytikaTonos: { name: "dialytika met tonos", was: "zet twee puntjes en het Griekse accent op de volgende Griekse letter, bijvoorbeeld ΐ." },
  },
  pt: {
    tilde: { name: "til", was: "põe um til na letra seguinte, por exemplo ã." },
    tonos: { name: "tonos", was: "põe o acento grego na letra grega seguinte, por exemplo ά." },
    dialytikaTonos: { name: "dialitika com tonos", was: "põe dois pontos e o acento grego na letra grega seguinte, por exemplo ΐ." },
  },
  br: {
    tilde: { name: "til", was: "coloca um til na próxima letra, por exemplo ã." },
    tonos: { name: "tonos", was: "coloca o acento grego na próxima letra grega, por exemplo ά." },
    dialytikaTonos: { name: "dialitika com tonos", was: "coloca dois pontos e o acento grego na próxima letra grega, por exemplo ΐ." },
  },
  ro: {
    tilde: { name: "tildă", was: "pune un mic val pe litera următoare, de exemplu ã." },
    tonos: { name: "tonos", was: "pune accentul grecesc pe următoarea literă grecească, de exemplu ά." },
    dialytikaTonos: { name: "dialitika cu tonos", was: "pune două puncte și accentul grecesc pe următoarea literă grecească, de exemplu ΐ." },
  },
  sv: {
    tilde: { name: "tilde", was: "sätter en liten våg på nästa bokstav, till exempel ã." },
    tonos: { name: "tonos", was: "sätter den grekiska accenten på nästa grekiska bokstav, till exempel ά." },
    dialytikaTonos: { name: "dialytika med tonos", was: "sätter två prickar och den grekiska accenten på nästa grekiska bokstav, till exempel ΐ." },
  },
  uk: {
    tilde: { name: "тильда", was: "ставить маленьку хвильку над наступною літерою, наприклад ã." },
    tonos: { name: "тонос", was: "ставить грецький наголос над наступною грецькою літерою, наприклад ά." },
    dialytikaTonos: { name: "діалітика з тоносом", was: "ставить дві крапки і наголос над наступною грецькою літерою, наприклад ΐ." },
  },
};
