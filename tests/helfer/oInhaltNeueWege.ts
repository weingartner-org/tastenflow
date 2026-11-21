/**
 * ★★★ O-INHALT (29.10.2026): GEMEINSAME PRÜFER für die Einhängepunkte je Sprache der neun Wege (bg, el, uk …) -
 * Freischalt-Feier, Abzeichen, „Tasten erkunden", Startpunkte, Alphabet. Jede Sprache ruft dieselben Prüfer mit ihren Werten auf,
 * damit ein Mass für alle gilt.
 *
 *  · {@link schriftFehler}: jedes Wort ist GANZ in der Schrift der Sprache (kyrillisch/griechisch) - kein lateinisches „a" mitten im
 *    kyrillischen Wort (Glossar bg §4 Falle 2) - oder ein lateinisches Wort aus der erlaubten Liste (Tastennamen wie auf der Kappe).
 *  · {@link strichFehler}: nur Bindestrich, nie Halbgeviert/Geviert (Braillezeile) - ausser das Zeichen ist die Sache selbst.
 *  · {@link englischFehler}: kein englisches Wort aus dem englischen Rückfall (Probe über die häufigsten Wörter der englischen Sätze).
 *  · Deutsch: `deutscheWoerter` aus `deutschFaenger.ts`.
 */
import { deutscheWoerter } from "./deutschFaenger";

export type Schrift = "Cyrillic" | "Greek";

const IN_SCHRIFT: Record<Schrift, RegExp> = { Cyrillic: /^\p{Script=Cyrillic}+$/u, Greek: /^\p{Script=Greek}+$/u };
const LATEIN = /^\p{Script=Latin}+$/u;

/** Die Wörter eines Textes (Buchstabenfolgen, Apostroph und Bindestrich trennen). */
export function woerter(text: string): string[] {
  return text.match(/[\p{L}\p{M}]+/gu) ?? [];
}

/** Wörter, die weder ganz in der Schrift stehen noch ein erlaubtes lateinisches Wort (Kappe, Marke) sind. */
export function schriftFehler(text: string, schrift: Schrift, erlaubtLatein: ReadonlySet<string>): string[] {
  return woerter(text).filter((w) => {
    if (IN_SCHRIFT[schrift].test(w.normalize("NFC"))) return false;
    if (LATEIN.test(w) && (erlaubtLatein.has(w) || w.length === 1)) return false;
    return true;
  });
}

/** Halbgeviert/Geviert im Text (nur Bindestrich, Hausregel). */
export function strichFehler(text: string): boolean {
  return /[–—]/.test(text);
}

/** Typische Wörter der englischen Rückfall-Sätze - eines davon im Text heisst: hier steht noch Englisch. */
const ENGLISCH = new Set([
  "the", "and", "key", "keys", "with", "letter", "letters", "press", "then", "first", "unlocked", "new", "digit", "capital",
  "row", "finger", "left", "right", "home", "hold", "down", "find", "found", "got", "it", "on", "of", "to", "is", "for",
  "rounds", "round", "without", "mistake", "mistakes", "badge", "days", "weeks", "lessons", "level", "stars", "unlock",
]);
export function englischFehler(text: string, erlaubtLatein: ReadonlySet<string> = new Set()): string[] {
  return woerter(text).filter((w) => ENGLISCH.has(w.toLowerCase()) && !erlaubtLatein.has(w));
}

/** Alle Fehler eines sichtbaren oder gesprochenen Satzes: Schrift, Strich, Deutsch, Englisch. */
export function satzFehler(
  quelle: string,
  text: string,
  schrift: Schrift,
  erlaubtLatein: ReadonlySet<string>,
): string[] {
  const out: string[] = [];
  const s = schriftFehler(text, schrift, erlaubtLatein);
  if (s.length) out.push(`${quelle}: fremde Schrift ${s.join(", ")} - „${text}"`);
  if (strichFehler(text)) out.push(`${quelle}: Gedankenstrich - „${text}"`);
  const d = deutscheWoerter(text).filter((w) => w.length > 1);
  if (d.length) out.push(`${quelle}: Deutsch ${d.join(", ")} - „${text}"`);
  const e = englischFehler(text, erlaubtLatein);
  if (e.length) out.push(`${quelle}: Englisch ${e.join(", ")} - „${text}"`);
  return out;
}
