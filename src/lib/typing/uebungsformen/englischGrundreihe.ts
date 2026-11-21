/**
 * FRÜHES ENGLISCH IN DER GRUNDREIHE - reine Inhaltsarbeit.
 *
 * Herkunft: eine der Übungsformen aus Testerin Mail (Kollegin, dieselbe
 * Zielgruppe), am 01.09.2026 mit Johannes durchgesprochen
 * (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md` §3, Punkt 9). Testerin
 * Beispiel: „sad fall dad gag ask slash glad had all glas" - echte englische
 * Wörter, die sich schon in der Grundreihe (ohne die obere/untere Reihe zu
 * verlassen) schreiben lassen, für Kinder, die Englisch beginnen, bevor sie
 * die ganze Tastatur gelernt haben.
 *
 * ⚠️ Testerin Liste selbst enthält einen Tippfehler: „glas" ist kein englisches
 * Wort (englisch wäre „glass", zwei s). Übernommen wurde es hier NICHT -
 * dafür steht „glass" selbst in der Liste (ebenfalls reine Grundreihe: g l a
 * s s). Geprüft ist hier JEDES Wort einzeln gegen den Grundreihen-Tastensatz
 * im zugehörigen Test (`tests/tastenflow-form-handschwerpunkte.test.ts`) -
 * nicht nur behauptet.
 *
 * Die volle deutsche Grundreihe ist „a s d f g h j k l ö ä" (`layouts.ts`,
 * Reihe 2). Englische Wörter kennen kein ö/ä, bleibt also „a s d f g h j k l"
 * - neun Tasten. Innerhalb davon gibt es einen KLEINEN Kern ohne Dehnung für
 * die Zeigefinger: „a s d f" links, „j k l" rechts (plus dem Ersatz für ö,
 * das auf Englisch nicht existiert) - `g` und `h` liegen näher zur Mitte und
 * verlangen von den Zeigefingern eine Dehnung nach innen. Die beiden Gruppen
 * stehen unten getrennt exportiert, damit eine Runde erst die einfacheren
 * Wörter (ohne g/h) anbieten kann, bevor die Dehnung dazukommt.
 */

/** Englische Wörter, die AUSSCHLIESSLICH aus Grundreihen-Tasten bestehen. */
export const EN_GRUNDREIHE: string[] = [
  "sad", "fall", "dad", "gag", "ask", "slash", "glad", "had", "all", "glass",
  "gas", "lad", "add", "asks", "dads", "flags", "flasks", "halls", "salads",
  "ash", "hash", "lag", "lags", "sag", "sags", "flag", "flask", "half", "hall",
  "salad", "gala", "salsa", "alas", "fad", "fads", "gags", "lash", "dash",
  "flash", "alfalfa", "adds", "jag",
];

/** Der kleine Kern ohne die beiden Dehn-Tasten der Zeigefinger. */
const KLEINER_GRUNDREIHEN_SATZ = new Set(["a", "s", "d", "f", "j", "k", "l"]);

function nurAusMenge(wort: string, menge: Set<string>): boolean {
  return [...wort.toLowerCase()].every((ch) => menge.has(ch));
}

/**
 * Wörter, die ohne `g`/`h` auskommen - reine „asdf jklö"-Reichweite, die
 * Zeigefinger bleiben auf ihrer Heimattaste.
 */
export const EN_GRUNDREIHE_KLEIN: string[] = EN_GRUNDREIHE.filter((w) =>
  nurAusMenge(w, KLEINER_GRUNDREIHEN_SATZ),
);

/** Wörter, die `g` oder `h` brauchen - die Zeigefinger dehnen sich zur Mitte. */
export const EN_GRUNDREIHE_MIT_G_H: string[] = EN_GRUNDREIHE.filter(
  (w) => !nurAusMenge(w, KLEINER_GRUNDREIHEN_SATZ),
);

// (Bis 11.09.2026 stand hier `istGrundreihenwort()`, entfernt weil ungenutzt.)
