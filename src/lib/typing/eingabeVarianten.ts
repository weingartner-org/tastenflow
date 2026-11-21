/**
 * ★★★ W2a (28.09.2026, SYNTHESE-UND-ENTSCHEIDUNGEN D-6): ZWEI RICHTIGE
 * SCHREIBWEISEN AN DERSELBEN STELLE - WEG „fr".
 *
 * Die französische Typografie ist nicht in allen Ländern gleich:
 *  · Frankreich, Belgien und die Schulbücher der Schweiz setzen vor `; : ! ?`
 *    und innen an `« »` ein (schmales) Leerzeichen („Tu viens ?", « mot »).
 *  · Québec (OQLF) schreibt vor `; ! ?` ohne, der Kanton Waadt amtlich ohne -
 *    und wer eine Tastatur ohne `« »` hat, schreibt `"` (Alpha et Oméga lehrt
 *    es so, die Schweiz empfiehlt gerade Anführungszeichen).
 *
 * Ein Kind, das die Schreibweise seiner Region tippt, hat recht. Darum gilt an
 * genau diesen Stellen BEIDES:
 *  · Steht ein Leerzeichen (gewöhnlich, geschützt oder schmal geschützt) vor
 *    `; : ! ? »`, nach `«` oder innen an einem geraden `"`, darf es fehlen:
 *    tippt das Kind gleich das nächste Zeichen, verschwindet das Leerzeichen
 *    aus der Zeile ({@link EingabeVarianten.anpassen}).
 *  · Fehlt es (Kanada: `wandleTypografie` nimmt es vor `; ! ?` heraus), darf
 *    das Kind es tippen: das Leerzeichen kommt in die Zeile.
 *  · `"` gilt für `«` und `»`, und `«`/`»` für `"` ({@link EingabeVarianten.gleichwertig}).
 *
 * „Die Anzeige passt sich dem an, was das Kind getippt hat": Die Zeile wird an
 * der Stelle geändert, sie zeigt danach, was dasteht - keine Lücke, kein
 * Fehler. Die Anführungszeichen selbst bleiben stehen, wie sie im Text sind
 * (ein `«` bleibt `«`, auch wenn `"` getippt wurde). Geändert wird nur die
 * Stelle UNTER dem Schreibzeiger - was schon getippt ist, bleibt, wie es war.
 *
 * ⚠️ Nur Weg „fr" (`TypingSession` reicht die Varianten nur dort durch). Auf
 * „de"/„en" bleibt ein Leerzeichen vor `!` ein Fehlgriff - das ist dort kein
 * richtiges Deutsch/Englisch. Wächter: `tests/tastenflow-w2a-franz-typografie.test.tsx`
 * (samt Gegenprobe de/en).
 *
 * Reine Funktionen, kein Zustand - `useTypingItem` hält die angepasste Zeile.
 */

export interface EingabeVarianten {
  /** Gilt `eingegeben` an dieser Stelle als dasselbe Zeichen wie `soll`? */
  gleichwertig(soll: string, eingegeben: string): boolean;
  /**
   * Ist `eingegeben` an der Stelle `cur` von `zeile` eine erlaubte andere
   * Schreibweise? Dann die angepasste Zeile (an `cur` steht danach, was
   * getippt wurde), sonst `null`. `zeile` ohne das Zeilenende-„\n".
   */
  anpassen(zeile: string, cur: number, eingegeben: string): string | null;
}

/** Gewöhnliches, geschütztes (U+00A0) und schmales geschütztes (U+202F) Leerzeichen. */
const LEERZEICHEN = new Set([" ", " ", " "]);

/** Die „hohen" Satzzeichen, vor denen Frankreich ein Leerzeichen setzt und Québec (ausser vor `:`) nicht. */
const HOHE_ZEICHEN = new Set([";", ":", "!", "?"]);

const istLeer = (c: string | undefined): boolean => c !== undefined && LEERZEICHEN.has(c);

/**
 * Öffnet das gerade `"` an Stelle `i`? Steht davor ein Zeichen, schliesst es
 * („mot" - „t" davor). Am Anfang oder nach einem Leerzeichen öffnet es, wenn
 * ein Zeichen folgt; folgt ein Leerzeichen oder das Zeilenende (`" mot "`),
 * entscheidet die Zahl der geraden `"` davor.
 */
function oeffnetGerade(zeile: string, i: number): boolean {
  if (zeile[i] !== "\"") return false;
  const davor = zeile[i - 1];
  if (i > 0 && !istLeer(davor) && davor !== "(" && davor !== "[") return false;
  const danach = zeile[i + 1];
  // Ein Satzzeichen danach („mot".) gehört zum Schliessen.
  if (danach !== undefined && !istLeer(danach) && !/[.,;:!?)\]]/.test(danach)) return true;
  let anzahl = 0;
  for (let k = 0; k < i; k++) if (zeile[k] === "\"") anzahl++;
  return anzahl % 2 === 0;
}

const schliesstGerade = (zeile: string, i: number): boolean =>
  zeile[i] === "\"" && !oeffnetGerade(zeile, i);

/**
 * Darf zwischen `zeile[i - 1]` und `zeile[i]` (Stelle `i`, dort steht KEIN
 * Leerzeichen) eines stehen - und darf ein Leerzeichen an dieser Stelle auch
 * fehlen? Dieselbe Frage für beide Richtungen, EINE Stelle.
 */
function leerzeichenFrei(davor: string | undefined, danach: string | undefined, zeile: string, iDavor: number, iDanach: number): boolean {
  if (davor === undefined || danach === undefined) return false;
  if (istLeer(davor) || istLeer(danach)) return false;
  if (HOHE_ZEICHEN.has(danach)) {
    // „?!" und „!!" bleiben zusammen; nach « schon abgedeckt (unten).
    if (HOHE_ZEICHEN.has(davor)) return false;
    // „12:30", „http://" - kein Satzzeichen, sondern Uhrzeit/Adresse.
    const nachher = zeile[iDanach + 1];
    if (danach === ":" && /\d/.test(davor) && nachher !== undefined && /\d/.test(nachher)) return false;
    if (danach === ":" && nachher === "/") return false;
    return true;
  }
  if (danach === "»" || davor === "«") return true;
  if (danach === "\"" && schliesstGerade(zeile, iDanach)) return true;
  if (davor === "\"" && oeffnetGerade(zeile, iDavor)) return true;
  return false;
}

function gleichwertigFr(soll: string, eingegeben: string): boolean {
  if (soll === eingegeben) return true;
  if ((soll === "«" || soll === "»") && eingegeben === "\"") return true;
  if (soll === "\"" && (eingegeben === "«" || eingegeben === "»")) return true;
  // Das geschützte Leerzeichen hat keine eigene Taste - die Leertaste ist es.
  if ((soll === " " || soll === " ") && eingegeben === " ") return true;
  return false;
}

/** Die Varianten des Weges „fr" (D-6). */
export const FRANZ_EINGABE: EingabeVarianten = Object.freeze({
  gleichwertig: gleichwertigFr,
  anpassen(zeile: string, cur: number, eingegeben: string): string | null {
    if (cur < 0 || cur >= zeile.length) return null;
    const hier = zeile[cur];
    // (1) Das Leerzeichen WEGLASSEN: an `cur` steht eines, getippt wurde das
    //     Zeichen danach.
    if (istLeer(hier)) {
      const danach = zeile[cur + 1];
      if (danach === undefined || !gleichwertigFr(danach, eingegeben)) return null;
      if (!leerzeichenFrei(zeile[cur - 1], danach, zeile, cur - 1, cur + 1)) return null;
      return zeile.slice(0, cur) + zeile.slice(cur + 1);
    }
    // (2) Ein Leerzeichen EINFÜGEN: an `cur` steht keines, getippt wurde eines.
    if (eingegeben === " " && cur > 0 && leerzeichenFrei(zeile[cur - 1], hier, zeile, cur - 1, cur)) {
      return zeile.slice(0, cur) + " " + zeile.slice(cur);
    }
    return null;
  },
});
