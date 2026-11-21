/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ZAHLWORT IN BULGARISCH.
 * ★ O-INHALT-BG (29.10.2026): geschrieben - 0 bis 1.000.000, Schriftform, so wie ein Kind es in der Schule schreibt.
 *
 * Regeln (Glossar `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md` §2.10, Bauplan B18) [G - von einer Person mit Bulgarisch als
 * Erstsprache gegenzulesen; die Tabelle im Wächter ist dafür da]:
 *  · Zählform OHNE Hauptwort: „едно", „две" (sächlich - die Form, mit der man zählt).
 *  · Schriftform, nicht die gesprochene: „единадесет" (nicht „единайсет"), „двадесет" (nicht „двайсет").
 *  · „и" steht vor dem LETZTEN Glied: 21 „двадесет и едно", 120 „сто и двадесет", 121 „сто двадесет и едно",
 *    1005 „хиляда и пет", 2300 „две хиляди и триста", 1250 „хиляда двеста и петдесет". Die Zahlen 11-19 sind EIN Glied.
 *  · Hunderter: сто, двеста, триста, четиристотин, петстотин, шестстотин, седемстотин, осемстотин, деветстотин.
 *  · Tausender: „хиляда" (f.) allein für 1000; sonst die weibliche Form davor: „две хиляди", „двадесет и една хиляди".
 *  · 1.000.000 „един милион".
 *  · Getrennt geschrieben, ein Leerzeichen, kein Bindestrich - nur Kleinbuchstaben der bulgarischen Tastatur.
 *
 * `zahlwort(n, "bg")` wirft absichtlich und bleibt so. Verteiler: `uebungsformen/zahlendiktat.ts` (`ZAHLWORT_GERUEST`): mit der
 * Funktion bietet sich das Zahlendiktat auf Weg „bg" an (die Rahmensätze der Form kommen mit der Oberfläche, Etappe O).
 * Wächter: `tests/tastenflow-zahlwort-bg.test.ts` (Vorbild `tastenflow-zahlwort-cs`).
 */

/** Die grösste Zahl, für die {@link zahlwortBg} ein Wort liefert. */
export const MAX_ZAHL_BG = 1_000_000;

const EINER_N = ["нула", "едно", "две", "три", "четири", "пет", "шест", "седем", "осем", "девет"];
/** Weiblich - vor „хиляди". */
const EINER_F = ["нула", "една", "две", "три", "четири", "пет", "шест", "седем", "осем", "девет"];
const ZEHN_BIS_NEUNZEHN = [
  "десет", "единадесет", "дванадесет", "тринадесет", "четиринадесет",
  "петнадесет", "шестнадесет", "седемнадесет", "осемнадесет", "деветнадесет",
];
const ZEHNER = ["", "", "двадесет", "тридесет", "четиридесет", "петдесет", "шестдесет", "седемдесет", "осемдесет", "деветдесет"];
const HUNDERTER = ["", "сто", "двеста", "триста", "четиристотин", "петстотин", "шестстотин", "седемстотин", "осемстотин", "деветстотин"];

/** Die Glieder einer Zahl 1-999 („сто", „двадесет", „едно"); 11-19 ist EIN Glied. */
function glieder(n: number, einer: readonly string[]): string[] {
  const out: string[] = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h > 0) out.push(HUNDERTER[h]);
  if (rest >= 10 && rest < 20) out.push(ZEHN_BIS_NEUNZEHN[rest - 10]);
  else {
    const z = Math.floor(rest / 10);
    const e = rest % 10;
    if (z > 0) out.push(ZEHNER[z]);
    if (e > 0) out.push(einer[e]);
  }
  return out;
}

/** Glieder verbinden: „и" vor dem letzten, wenn es mehr als eines gibt. */
function verbinde(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(" ")} и ${teile[teile.length - 1]}`;
}

/** Das bulgarische Zahlwort für 0 bis 1.000.000 (Schriftform, Zählform ohne Hauptwort). */
export function zahlwortBg(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_BG) {
    throw new RangeError(`zahlwortBg: ${n} liegt nicht zwischen 0 und ${MAX_ZAHL_BG} (ganze Zahl)`);
  }
  if (n === 0) return "нула";
  if (n === MAX_ZAHL_BG) return "един милион";
  const tausend = Math.floor(n / 1000);
  const rest = n % 1000;
  const unten = glieder(rest, EINER_N);
  if (tausend === 0) return verbinde(unten);
  const oben = tausend === 1 ? "хиляда" : `${verbinde(glieder(tausend, EINER_F))} хиляди`;
  if (unten.length === 0) return oben;
  // Ein einzelnes Glied darunter bekommt das „и" („хиляда и пет", „две хиляди и триста");
  // mehrere tragen es selbst vor ihrem letzten („хиляда двеста и петдесет").
  return unten.length === 1 ? `${oben} и ${unten[0]}` : `${oben} ${verbinde(unten)}`;
}

/** Ein Zahlwort je Zahl (0 bis 1.000.000) - oder `null`, solange die Sprache keines hat. */
export const ZAHLWORT_BG: ((n: number) => string) | null = zahlwortBg;
