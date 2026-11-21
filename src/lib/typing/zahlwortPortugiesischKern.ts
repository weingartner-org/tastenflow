/**
 * ★ O-INHALT-PT/BR (29.10.2026): die gemeinsame Rechnung der portugiesischen Zahlwörter für die Wege „pt" und „br" - sie
 * unterscheiden sich nur in 16, 17 und 19 (Portugal „dezasseis, dezassete, dezanove", Brasilien „dezesseis, dezessete, dezenove").
 * Nur von `zahlwortPt.ts` und `zahlwortBr.ts` gelesen. Regeln dort.
 */

export const MAX_ZAHL_PORTUGIESISCH = 1_000_000;

const BIS_19_PT = [
  "zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
  "dez", "onze", "doze", "treze", "catorze", "quinze", "dezasseis", "dezassete", "dezoito", "dezanove",
];
const BIS_19_BR = [...BIS_19_PT.slice(0, 16), "dezesseis", "dezessete", "dezoito", "dezenove"];
const ZEHNER = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const HUNDERTER = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

/** 1 bis 999. */
function bis999(n: number, klein: readonly string[]): string {
  if (n === 100) return "cem";
  const teile: string[] = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h > 0) teile.push(HUNDERTER[h]);
  if (rest > 0) {
    if (rest < 20) teile.push(klein[rest]);
    else {
      const e = rest % 10;
      teile.push(e > 0 ? `${ZEHNER[Math.floor(rest / 10)]} e ${klein[e]}` : ZEHNER[Math.floor(rest / 10)]);
    }
  }
  return teile.join(" e ");
}

/** Das Zahlwort von 0 bis 1.000.000 - „pt" (Portugal) oder „br" (Brasilien). */
export function zahlwortPortugiesisch(n: number, land: "pt" | "br"): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_PORTUGIESISCH) {
    throw new RangeError(`zahlwort ${land} nur für 0 bis ${MAX_ZAHL_PORTUGIESISCH}, nicht ${n}`);
  }
  const klein = land === "br" ? BIS_19_BR : BIS_19_PT;
  if (n === 0) return "zero";
  if (n === MAX_ZAHL_PORTUGIESISCH) return "um milhão";
  if (n < 1000) return bis999(n, klein);
  const tausend = Math.floor(n / 1000);
  const rest = n % 1000;
  const kopf = tausend === 1 ? "mil" : `${bis999(tausend, klein)} mil`;
  if (rest === 0) return kopf;
  const mitE = rest < 100 || rest % 100 === 0;
  return `${kopf}${mitE ? " e " : " "}${bis999(rest, klein)}`;
}
