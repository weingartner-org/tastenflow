/**
 * Tempo- und Genauigkeits-Kennzahlen. CPM = Anschläge pro Minute (im
 * deutschen Tastschreiben üblich); WPM = Wörter pro Minute (= CPM / 5, mit
 * 5 Anschlägen je „Normwort"). Grundsatz im Lehrgang: erst Treffsicherheit,
 * dann Tempo. Siehe [[project_zehnfinger_trainer]].
 */
import type { Lang } from "./account";
import { prozentMitZeichen } from "./sprachRegister";

export function cpm(chars: number, ms: number): number {
  if (ms <= 0 || chars <= 0) return 0;
  return Math.round((chars / ms) * 60000);
}

export function wpm(chars: number, ms: number): number {
  return Math.round(cpm(chars, ms) / 5);
}

/** Genauigkeit 0..1 aus richtig getippten Zeichen und Fehlanschlägen. */
export function accuracy(chars: number, errors: number): number {
  const total = chars + errors;
  return total > 0 ? chars / total : 1;
}

/**
 * ★ E11a-2 (26.09.2026, Weichen-Zähler §2.3): Tabelle statt Ternäre - Deutsch
 * UND Französisch setzen ein Leerzeichen vor das Zeichen, nur Englisch nicht
 * (Glossar §1.2).
 */
// ★ ES-O (27.09.2026): Spanisch nach RAE mit Leerzeichen („95 %") - die Norm
// gilt in Spanien und Amerika gleich (Bauplan D9).
const PROZENT_ZEICHEN: Record<Lang, string> = {
  de: " %",
  en: "%",
  fr: " %",
  es: " %",
  it: "%", // ★ O-IT (02.10.2026): Italienisch ohne Leerzeichen, „95%" (Glossar Regel 5).
  pl: "%", // ★ O-PL (02.10.2026): Polnisch ohne Leerzeichen, „95%" (Intl und PWN, Glossar Regel 5).
  // ★ O-TR (02.10.2026): Türkisch „%95" - das Zeichen steht VOR der Zahl; die Stellung
  // liest `prozentMitZeichen` aus dem Sprachregister (`prozentVorDerZahl`), hier nur das Zeichen.
  tr: "%",
  // ★ O-CS (03.10.2026): Tschechisch „95 %" - der Abstand wird geschützt (U+00A0); das
  // liest `prozentMitZeichen` aus dem Sprachregister (`prozentAbstandGeschuetzt`).
  cs: " %",
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: "%",
  el: "%",
  hu: "%",
  nl: "%",
  pt: "%",
  br: "%",
  ro: "\u00A0%",
  sv: "\u00A0%",
  uk: "%",
};

export function fmtPercent(value0to1: number, sprache: Lang = "de"): string {
  return prozentMitZeichen(Math.round(value0to1 * 100), PROZENT_ZEICHEN[sprache], sprache);
}
