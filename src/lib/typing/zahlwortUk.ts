/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ZAHLWORT IN UKRAINISCH.
 * ★ O-INHALT-UK (29.10.2026): geschrieben - 0 bis 1.000.000, so wie ein Kind es in der Schule schreibt.
 *
 * Regeln (Glossar `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md` §2.10, didaktik §8.3) [G - von einer Person mit Ukrainisch als
 * Erstsprache gegenzulesen; die Tabelle im Wächter ist dafür da]:
 *  · Grundform ohne Hauptwort (männlich/sächlich): „один", „два".
 *  · Apostroph U+0027 wie in der Oberfläche und auf „Українська (розширена)": „п'ять", „дев'ять", „п'ятсот", „дев'яносто".
 *  · Hunderter: сто, двісті, триста, чотириста, п'ятсот, шістсот, сімсот, вісімсот, дев'ятсот.
 *  · Tausender weiblich (тисяча): „тисяча" allein für 1000, „дві тисячі", „три тисячі", „чотири тисячі" (few), „п'ять тисяч" (many),
 *    „двадцять одна тисяча" (one) - die Form nach `Intl.PluralRules("uk")` wie in jedem Satz mit Zahl.
 *  · 1.000.000 „мільйон". Getrennt geschrieben, ein Leerzeichen, kein Bindestrich.
 * ⚠️ Mit Apostroph ist das Zahlendiktat erst nach der Apostroph-Einheit schreibbar und auf der Standard-Tastatur (ohne Apostroph)
 *    nur in der Ziffern-Richtung - das prüft `wortSchreibbar` im Verteiler selbst.
 *
 * `zahlwort(n, "uk")` wirft absichtlich und bleibt so. Verteiler: `uebungsformen/zahlendiktat.ts` (`ZAHLWORT_GERUEST`).
 * Wächter: `tests/tastenflow-zahlwort-uk.test.ts` (Vorbild `tastenflow-zahlwort-cs`).
 */

/** Die grösste Zahl, für die {@link zahlwortUk} ein Wort liefert. */
export const MAX_ZAHL_UK = 1_000_000;

const EINER_M = ["нуль", "один", "два", "три", "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять"];
/** Weiblich - vor „тисяча". */
const EINER_F = ["нуль", "одна", "дві", "три", "чотири", "п'ять", "шість", "сім", "вісім", "дев'ять"];
const ZEHN_BIS_NEUNZEHN = [
  "десять", "одинадцять", "дванадцять", "тринадцять", "чотирнадцять",
  "п'ятнадцять", "шістнадцять", "сімнадцять", "вісімнадцять", "дев'ятнадцять",
];
const ZEHNER = ["", "", "двадцять", "тридцять", "сорок", "п'ятдесят", "шістдесят", "сімдесят", "вісімдесят", "дев'яносто"];
const HUNDERTER = ["", "сто", "двісті", "триста", "чотириста", "п'ятсот", "шістсот", "сімсот", "вісімсот", "дев'ятсот"];

/** 1-999 als Wörter. */
function bisTausend(n: number, einer: readonly string[]): string[] {
  const out: string[] = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h > 0) out.push(HUNDERTER[h]);
  if (rest >= 10 && rest < 20) out.push(ZEHN_BIS_NEUNZEHN[rest - 10]);
  else {
    if (rest >= 20) out.push(ZEHNER[Math.floor(rest / 10)]);
    if (rest % 10 > 0) out.push(einer[rest % 10]);
  }
  return out;
}

/** „тисяча", „тисячі", „тисяч" nach der Zahl davor (one · few · many). */
function tausendForm(n: number): string {
  const k = new Intl.PluralRules("uk-UA").select(n);
  return k === "one" ? "тисяча" : k === "few" ? "тисячі" : "тисяч";
}

/** Das ukrainische Zahlwort für 0 bis 1.000.000 (Grundform, Tausender weiblich). */
export function zahlwortUk(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_UK) {
    throw new RangeError(`zahlwortUk: ${n} liegt nicht zwischen 0 und ${MAX_ZAHL_UK} (ganze Zahl)`);
  }
  if (n === 0) return "нуль";
  if (n === MAX_ZAHL_UK) return "мільйон";
  const tausend = Math.floor(n / 1000);
  const rest = n % 1000;
  const teile: string[] = [];
  if (tausend === 1) teile.push("тисяча");
  else if (tausend > 1) teile.push(...bisTausend(tausend, EINER_F), tausendForm(tausend));
  teile.push(...bisTausend(rest, EINER_M));
  return teile.join(" ");
}

/** Ein Zahlwort je Zahl (0 bis 1.000.000) - oder `null`, solange die Sprache keines hat. */
export const ZAHLWORT_UK: ((n: number) => string) | null = zahlwortUk;
