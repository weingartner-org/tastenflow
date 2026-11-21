/**
 * ★★ Fänger für FRANZÖSISCHE Texte (E11c, 26.09.2026): steht darin ein
 * deutsches oder ein englisches Wort?
 *
 * Dieselbe Bauart wie in `tastenflow-franzoesisch-alles.test.tsx` (dort für
 * die gerenderte Oberfläche), hier für reine Texte - Mails, Link-Vorschau.
 *
 *  · Deutsch: der Deutsch-Fänger (`deutschFaenger.ts`), OHNE die Homografen,
 *    die im Französischen richtig sind („des", „du", „liste", „mit" als
 *    Lizenzname) und ohne einzelne Tastenzeichen („ö (25 %)").
 *  · Englisch: eine kleine Liste von Wörtern, die es im Französischen nicht
 *    gibt (ohne „date", „final", „score", „badge" …, die dort gebräuchlich sind).
 */
import { deutscheWoerter } from "./deutschFaenger";

/** Im Französischen richtige Wörter, die der Deutsch-Fänger als deutsch kennt. */
export const HOMOGRAFE_FR: ReadonlySet<string> = new Set(["des", "du", "liste", "mit", "länder", "sensorik"]);

/** Die ECHTEN deutschen Wörter eines französischen Textes. */
export function deutschImFranzoesischen(text: string): string[] {
  return deutscheWoerter(text).filter((w) => !HOMOGRAFE_FR.has(w.toLowerCase()) && [...w].length > 1);
}

/** Englische Wörter, die in einem französischen Text nichts verloren haben. */
export const ENGLISCHE_WOERTER_FR_FAENGER = [
  "the", "and", "you", "your", "with", "please", "week", "weeks", "pupil", "pupils",
  "teacher", "settings", "password", "free", "typing", "learn", "keyboard", "class",
  "email", "link", "weekly", "goal", "login", "details", "welcome", "account",
  "unsubscribe", "switch", "switched", "hello", "practised", "practice", "practise",
  "accuracy", "mistakes", "keystrokes", "name", "days",
];

/** Die englischen Wörter eines französischen Textes. */
export function englischImFranzoesischen(text: string): string[] {
  return ENGLISCHE_WOERTER_FR_FAENGER.filter((w) =>
    new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, "iu").test(text),
  );
}
