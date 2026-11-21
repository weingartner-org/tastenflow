/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ZAHLWORT IN UNGARISCH - Einhängepunkt, seit O-INHALT-HU gefüllt.
 *
 * Vorbild `zahlwortCs` (`zahlwort.ts`: 0 bis 1.000.000, Grund-/Zählform, so wie ein Kind es schreiben lernt; Bindestriche und
 * Zusammenschreibung nach der Rechtschreibung der Sprache). `zahlwort(n, "hu")` wirft absichtlich und bleibt so.
 * Verteiler: `uebungsformen/zahlendiktat.ts` (`ZAHLWORT_GERUEST`): solange hier `null` stand, bot sich das Zahlendiktat auf diesem
 * Weg NICHT an (nie deutsche Zahlwörter, Falle 19). Mit der Funktion bietet es sich an; die Rahmensätze der Form (`TEXTE` dort) kommen
 * mit der Oberfläche (Etappe O). Wächter: `tests/tastenflow-zahlwort-hu.test.ts` (Vorbild `tastenflow-zahlwort-cs`).
 *
 * ★ O-INHALT-HU (29.10.2026): die Regeln nach Glossar §2.10 („Zahlwörter") und AkH 12 § 291 a:
 *  · bis 2000 ZUSAMMEN geschrieben („ezerkilencszázkilencvenkilenc"); darüber in Dreiergruppen mit BINDESTRICH, aber nur, wenn
 *    hinter den Tausendern noch etwas kommt („kétezer-tizenöt", „kétezer" allein ohne Strich);
 *  · 2 heisst allein und am Ende „kettő" („tizenkettő", „huszonkettő"), vor „száz"/„ezer" „két" („kétszáz", „huszonkétezer");
 *  · 10 „tíz", 11-19 „tizen…", 20 „húsz", 21-29 „huszon…";
 *  · 100 „száz", 1000 „ezer" (ohne „egy"), 1.000.000 „egymillió".
 * ⚠️ Gegen das Sprachwissen des Baus gelesen, nicht von einer Person mit Ungarisch als Erstsprache (Glossar §5) - der Wächter trägt
 * die Tabelle, damit sie jemand Zeile für Zeile gegenlesen kann.
 */

/** Die grösste Zahl, die {@link zahlwortHu} kennt. */
export const MAX_ZAHL_HU = 1_000_000;

const EINER_HU = ["", "egy", "kettő", "három", "négy", "öt", "hat", "hét", "nyolc", "kilenc"];
/** Die Zehner als Vorsilbe (vor einem Einer) und allein. */
const ZEHNER_VOR_HU = ["", "tizen", "huszon", "harminc", "negyven", "ötven", "hatvan", "hetven", "nyolcvan", "kilencven"];
const ZEHNER_ALLEIN_HU = ["", "tíz", "húsz", "harminc", "negyven", "ötven", "hatvan", "hetven", "nyolcvan", "kilencven"];

/** 1 bis 999 in einem Wort. `vorZahlwort`: steht ein „ezer" dahinter, heisst die 2 am Ende „két". */
function unter1000Hu(n: number, vorZahlwort: boolean): string {
  const h = Math.floor(n / 100);
  const z = Math.floor((n % 100) / 10);
  const e = n % 10;
  const einer = (k: number) => (k === 2 && vorZahlwort ? "két" : EINER_HU[k]);
  let wort = "";
  if (h === 1) wort = "száz";
  else if (h === 2) wort = "kétszáz";
  else if (h > 2) wort = `${EINER_HU[h]}száz`;
  if (e === 0) wort += ZEHNER_ALLEIN_HU[z];
  else wort += ZEHNER_VOR_HU[z] + einer(e);
  return wort;
}

/** Das ungarische Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL_HU}. */
export function zahlwortHu(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_HU) throw new RangeError(`zahlwortHu nur für 0 bis ${MAX_ZAHL_HU}, nicht ${n}`);
  if (n === 0) return "nulla";
  if (n === MAX_ZAHL_HU) return "egymillió";
  const tausender = Math.floor(n / 1000);
  const rest = n % 1000;
  if (tausender === 0) return unter1000Hu(rest, false);
  const kopf = tausender === 1 ? "ezer" : `${unter1000Hu(tausender, true)}ezer`;
  if (rest === 0) return kopf;
  // Bis 2000 zusammen, darüber mit Bindestrich (AkH 12 § 291 a).
  return n <= 2000 ? kopf + unter1000Hu(rest, false) : `${kopf}-${unter1000Hu(rest, false)}`;
}

/** Ein Zahlwort je Zahl (0 bis 1.000.000) - oder `null`, solange die Sprache keines hat. */
export const ZAHLWORT_HU: ((n: number) => string) | null = zahlwortHu;
