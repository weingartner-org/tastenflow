/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ZAHLWORT IN RUMÄNISCH - Einhängepunkt, seit O-INHALT-RO gefüllt.
 *
 * Vorbild `zahlwortCs` (`zahlwort.ts`: 0 bis 1.000.000, Grund-/Zählform, so wie ein Kind es schreiben lernt; Bindestriche und
 * Zusammenschreibung nach der Rechtschreibung der Sprache). `zahlwort(n, "ro")` wirft absichtlich und bleibt so.
 * Verteiler: `uebungsformen/zahlendiktat.ts` (`ZAHLWORT_GERUEST`): solange hier `null` stand, bot sich das Zahlendiktat auf diesem
 * Weg NICHT an (nie deutsche Zahlwörter, Falle 19). Mit der Funktion bietet es sich an; die Rahmensätze der Form (`TEXTE` dort) kommen
 * mit der Oberfläche (Etappe O). Wächter: `tests/tastenflow-zahlwort-ro.test.ts` (Vorbild `tastenflow-zahlwort-cs`).
 *
 * ★ O-INHALT-RO (29.10.2026): die Regeln (DOOM, GALR):
 *  · GETRENNT geschrieben, Zehner und Einer mit „și": „douăzeci și unu", „o sută douăzeci și trei";
 *  · Zählform (maskulin) beim Zählen: „unu", „doi", „doisprezece", „douăzeci și doi";
 *  · Hunderter und Tausender sind Hauptwörter mit weiblichem Zahlwort davor: „o sută", „două sute", „o mie", „două mii",
 *    „douăsprezece mii", „douăzeci și una de mii";
 *  · „de" vor „mii", wenn die Tausenderzahl auf 00 oder 20-99 endet („douăzeci de mii", „o sută de mii"), sonst nicht
 *    („trei mii", „nouăsprezece mii", „o sută cinci mii");
 *  · 1.000.000 „un milion"; ș und ț mit KOMMA darunter (U+0219/U+021B), nie mit Cedille.
 * ⚠️ Gegen das Sprachwissen des Baus gelesen, nicht von einer Person mit Rumänisch als Erstsprache - der Wächter trägt die Tabelle,
 * damit sie jemand Zeile für Zeile gegenlesen kann (offen: „o sută una mii" nach der Regel ohne „de").
 */

/** Die grösste Zahl, die {@link zahlwortRo} kennt. */
export const MAX_ZAHL_RO = 1_000_000;

const EINER_M_RO = ["", "unu", "doi", "trei", "patru", "cinci", "șase", "șapte", "opt", "nouă"];
const EINER_F_RO = ["", "una", "două", "trei", "patru", "cinci", "șase", "șapte", "opt", "nouă"];
const ZEHN_BIS_19_M_RO = [
  "zece", "unsprezece", "doisprezece", "treisprezece", "paisprezece", "cincisprezece", "șaisprezece", "șaptesprezece",
  "optsprezece", "nouăsprezece",
];
const ZEHNER_RO = ["", "", "douăzeci", "treizeci", "patruzeci", "cincizeci", "șaizeci", "șaptezeci", "optzeci", "nouăzeci"];

/** 1 bis 99; `weiblich` für die Zahl vor „mii" (una, două, douăsprezece). */
function unter100Ro(n: number, weiblich: boolean): string {
  const einer = weiblich ? EINER_F_RO : EINER_M_RO;
  if (n < 10) return einer[n];
  if (n < 20) return weiblich && n === 12 ? "douăsprezece" : ZEHN_BIS_19_M_RO[n - 10];
  const z = Math.floor(n / 10);
  const e = n % 10;
  return e === 0 ? ZEHNER_RO[z] : `${ZEHNER_RO[z]} și ${einer[e]}`;
}

/** 1 bis 999. */
function unter1000Ro(n: number, weiblich: boolean): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const kopf = h === 0 ? "" : h === 1 ? "o sută" : h === 2 ? "două sute" : `${EINER_F_RO[h]} sute`;
  const schwanz = rest === 0 ? "" : unter100Ro(rest, weiblich);
  return [kopf, schwanz].filter(Boolean).join(" ");
}

/** Das rumänische Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL_RO}. */
export function zahlwortRo(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_RO) throw new RangeError(`zahlwortRo nur für 0 bis ${MAX_ZAHL_RO}, nicht ${n}`);
  if (n === 0) return "zero";
  if (n === MAX_ZAHL_RO) return "un milion";
  const tausender = Math.floor(n / 1000);
  const rest = n % 1000;
  let kopf = "";
  if (tausender === 1) kopf = "o mie";
  else if (tausender > 1) {
    const zuletzt = tausender % 100;
    const de = zuletzt === 0 || zuletzt >= 20 ? " de" : "";
    kopf = `${unter1000Ro(tausender, true)}${de} mii`;
  }
  const schwanz = rest === 0 ? "" : unter1000Ro(rest, false);
  return [kopf, schwanz].filter(Boolean).join(" ");
}

/** Ein Zahlwort je Zahl (0 bis 1.000.000) - oder `null`, solange die Sprache keines hat. */
export const ZAHLWORT_RO: ((n: number) => string) | null = zahlwortRo;
