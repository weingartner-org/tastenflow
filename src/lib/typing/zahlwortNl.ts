/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ZAHLWORT IN NIEDERLÄNDISCH - Einhängepunkt, seit O-INHALT-NL gefüllt.
 *
 * Vorbild `zahlwortCs` (`zahlwort.ts`: 0 bis 1.000.000, Grund-/Zählform, so wie ein Kind es schreiben lernt; Bindestriche und
 * Zusammenschreibung nach der Rechtschreibung der Sprache). `zahlwort(n, "nl")` wirft absichtlich und bleibt so.
 * Verteiler: `uebungsformen/zahlendiktat.ts` (`ZAHLWORT_GERUEST`): solange hier `null` stand, bot sich das Zahlendiktat auf diesem
 * Weg NICHT an (nie deutsche Zahlwörter, Falle 19). Mit der Funktion bietet es sich an; die Rahmensätze der Form (`TEXTE` dort) kommen
 * mit der Oberfläche (Etappe O). Wächter: `tests/tastenflow-zahlwort-nl.test.ts` (Vorbild `tastenflow-zahlwort-cs`).
 *
 * ★ O-INHALT-NL (29.10.2026): die Regeln nach der Taalunie (Woordenlijst, „Telwoorden"):
 *  · bis einschliesslich „duizend" ZUSAMMEN geschrieben („driehonderdvierenvijftig", „tweeduizend"); NACH „duizend" ein Leerzeichen
 *    („tweeduizend driehonderd", „duizend een");
 *  · Einer VOR dem Zehner mit „en": „eenentwintig"; endet der Einer auf -e, steht das Trema: „tweeëntwintig", „drieëntwintig";
 *  · 100 „honderd", 1000 „duizend" (ohne „een"), 1.000.000 „een miljoen";
 *  · 1 allein „één" (mit Akzenten, sonst läse man den Artikel „een"); in Zusammensetzungen „een" („eenentwintig", „honderdeen").
 * ⚠️ Gegen das Sprachwissen des Baus gelesen, nicht von einer Person mit Niederländisch als Erstsprache - der Wächter trägt die
 * Tabelle, damit sie jemand Zeile für Zeile gegenlesen kann. Für Belgien gilt dieselbe Schreibung.
 */

/** Die grösste Zahl, die {@link zahlwortNl} kennt. */
export const MAX_ZAHL_NL = 1_000_000;

const BIS_19_NL = [
  "", "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen",
  "tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien",
];
const ZEHNER_NL = ["", "", "twintig", "dertig", "veertig", "vijftig", "zestig", "zeventig", "tachtig", "negentig"];

/** 1 bis 99. */
function unter100Nl(n: number): string {
  if (n < 20) return BIS_19_NL[n];
  const z = Math.floor(n / 10);
  const e = n % 10;
  if (e === 0) return ZEHNER_NL[z];
  const einer = BIS_19_NL[e];
  // Trema, wo zwei e aufeinandertreffen und getrennt gesprochen werden: twee + en ⇒ tweeën.
  return `${einer}${einer.endsWith("e") ? "ën" : "en"}${ZEHNER_NL[z]}`;
}

/** 1 bis 999 in einem Wort. */
function unter1000Nl(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const kopf = h === 0 ? "" : h === 1 ? "honderd" : `${BIS_19_NL[h]}honderd`;
  return kopf + (rest === 0 ? "" : unter100Nl(rest));
}

/** Das niederländische Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL_NL}. */
export function zahlwortNl(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_NL) throw new RangeError(`zahlwortNl nur für 0 bis ${MAX_ZAHL_NL}, nicht ${n}`);
  if (n === 0) return "nul";
  if (n === 1) return "één";
  if (n === MAX_ZAHL_NL) return "een miljoen";
  const tausender = Math.floor(n / 1000);
  const rest = n % 1000;
  if (tausender === 0) return unter1000Nl(rest);
  const kopf = tausender === 1 ? "duizend" : `${unter1000Nl(tausender)}duizend`;
  return rest === 0 ? kopf : `${kopf} ${unter1000Nl(rest)}`;
}

/** Ein Zahlwort je Zahl (0 bis 1.000.000) - oder `null`, solange die Sprache keines hat. */
export const ZAHLWORT_NL: ((n: number) => string) | null = zahlwortNl;
