/**
 * ★★ Fänger für SPANISCHE Texte (ES-M, 27.09.2026): steht darin ein deutsches,
 * ein englisches oder ein französisches Wort?
 *
 * Dieselbe Bauart wie `franzoesischFaenger.ts` (Mails, Link-Vorschau), mit
 * einer dritten Liste: Spanisch ist nach Französisch gebaut - ein Rest aus der
 * französischen Vorlage wäre der wahrscheinlichste Fehler.
 *
 *  · Deutsch: der Deutsch-Fänger (`deutschFaenger.ts`), ohne einzelne
 *    Tastenzeichen („ö (25 %)") und ohne Eigennamen, die auch im Spanischen so
 *    heissen („Sensorik").
 *  · Englisch: Wörter, die es im Spanischen nicht gibt - ohne die, die dort
 *    richtig sind („no", „total", „final", „a").
 *  · Französisch: Wörter, die es im Spanischen nicht gibt - OHNE die
 *    Homografen, die im Spanischen richtig sind: „le", „les", „des", „que",
 *    „tu", „sur", „une", „en", „de", „a", „la", „se", „son", „es".
 */
import { deutscheWoerter } from "./deutschFaenger";

/** Im Spanischen richtige Wörter, die der Deutsch-Fänger als deutsch kennt. */
export const HOMOGRAFE_ES: ReadonlySet<string> = new Set(["sensorik", "länder"]);

/** Die ECHTEN deutschen Wörter eines spanischen Textes. */
export function deutschImSpanischen(text: string): string[] {
  return deutscheWoerter(text).filter((w) => !HOMOGRAFE_ES.has(w.toLowerCase()) && [...w].length > 1);
}

/** Englische Wörter, die in einem spanischen Text nichts verloren haben. */
export const ENGLISCHE_WOERTER_ES_FAENGER = [
  "the", "and", "you", "your", "with", "please", "week", "weeks", "pupil", "pupils",
  "teacher", "settings", "password", "free", "typing", "learn", "keyboard", "class",
  "email", "link", "weekly", "goal", "login", "details", "welcome", "account",
  "unsubscribe", "switch", "switched", "hello", "practised", "practice", "practise",
  "accuracy", "mistakes", "keystrokes", "name", "days", "score", "challenge", "report",
];

/** Französische Wörter, die in einem spanischen Text nichts verloren haben. */
export const FRANZOESISCHE_WOERTER_ES_FAENGER = [
  "vous", "votre", "vos", "nous", "avec", "dans", "pour", "classe", "semaine", "semaines",
  "bonjour", "élève", "élèves", "mot", "passe", "compte", "réglages", "bilan", "hebdomadaire",
  "défi", "entrainement", "cette", "cet", "être", "était", "aussi", "très", "est", "qui",
  "merci", "adresse", "lien", "jours", "enseignant", "enseignante", "précision", "erreurs",
  "touches", "caractères", "désabonner", "identifiants", "applications", "apprentissage",
  "ou", "et", "au", "aux", "ne", "pas", "rien", "tout", "toute",
];

function woerterAus(liste: readonly string[], text: string): string[] {
  return liste.filter((w) => new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, "iu").test(text));
}

/** Die englischen Wörter eines spanischen Textes. */
export function englischImSpanischen(text: string): string[] {
  return woerterAus(ENGLISCHE_WOERTER_ES_FAENGER, text);
}

/** Die französischen Wörter eines spanischen Textes. */
export function franzoesischImSpanischen(text: string): string[] {
  return woerterAus(FRANZOESISCHE_WOERTER_ES_FAENGER, text);
}
