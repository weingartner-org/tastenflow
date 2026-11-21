/**
 * ★★★ F58 (29.10.2026): baut die Tabelle der Zeichennamen einer der neun Gerüst-Sprachen (`zeichenNamen<Xx>.ts`).
 *
 * Warum ein Helfer: Der Einhängepunkt (`fingers.ts`, `ZEICHENNAMEN_DER_NEUEN_SPRACHEN`) ist eine flache Tabelle Zeichen ⇒ Name. Fehlt ein
 * Grossbuchstabe darin, fällt `spokenLabel` auf den ENGLISCHEN Rückfall („capital д", gemessen am 29.10.2026 für alle neun). Jeden
 * Grossbuchstaben von Hand zu schreiben, wäre die Stelle, an der einer vergessen wird. Hier wird für JEDEN Buchstaben des Alphabets die
 * Grossform gebaut - nach der Regel der Sprache (`gross`: „главно а", „A mare", „e maiúsculo com acento agudo").
 *
 * Grossform über `toUpperCase()` ohne Sprache (nicht `grossFuer`): mit der Sprache „el" macht ICU aus `ά` ein `Α` OHNE Tonos - Ά bekäme
 * keinen Namen. Keine der neun Sprachen braucht die türkische i-Regel. Eine Grossform aus mehreren Zeichen (`ΐ`, `ß`) bekommt keinen
 * Eintrag; eine schon vergebene (`ς` ⇒ `Σ`, das schon `σ` gehört) wird nicht überschrieben - darum steht `σ` vor `ς` im Alphabet.
 */

/** Zeichen ⇒ gesprochener Name, eingefroren. */
export type Zeichennamen = Readonly<Record<string, string>>;

/**
 * @param zeichen    Satz- und Sonderzeichen, Totasten, Leerzeichen, Enter.
 * @param buchstaben kleine Buchstaben mit eigenem Namen (`й` ⇒ „и кратко", `ő` ⇒ „hosszú ő"). Ein Buchstabe ohne Eintrag heisst wie
 *                   er selbst.
 * @param alphabet   ALLE kleinen Buchstaben, deren Grossform einen Namen bekommen soll (auch die ohne eigenen Namen, `a` ⇒ „nagy a").
 * @param gross      der Name der Grossform aus dem Namen des kleinen Buchstabens.
 */
export function zeichenTabelle(
  zeichen: Readonly<Record<string, string>>,
  buchstaben: Readonly<Record<string, string>>,
  alphabet: string,
  gross: (name: string, klein: string) => string,
): Zeichennamen {
  const aus: Record<string, string> = { ...zeichen, ...buchstaben };
  for (const klein of alphabet) {
    const g = klein.toUpperCase();
    if (g === klein || [...g].length !== 1 || aus[g] !== undefined) continue;
    aus[g] = gross(buchstaben[klein] ?? klein, klein);
  }
  return Object.freeze(aus);
}

/** Die 26 lateinischen Buchstaben a-z. */
export const LATEIN_KLEIN = "abcdefghijklmnopqrstuvwxyz";

/** Die lateinischen Buchstaben mit einem Vorwort („латинско a"), für die Wege in kyrillischer oder griechischer Schrift. */
export function lateinMitVorwort(vorwort: string): Record<string, string> {
  return Object.fromEntries([...LATEIN_KLEIN].map((c) => [c, `${vorwort} ${c}`]));
}
