/**
 * Die Regeln für JEDE tschechische Textzeile (F5-cs, 03.10.2026) - eine Funktion, die der Wächter
 * `tests/tastenflow-cs-texte-regeln.test.ts` und jeder Wächter einer Text-Charge (Etappe T) gemeinsam benutzt.
 * Vorbild: `tests/helfer/itTextRegeln.ts`. Quelle der Regeln: `src/lib/typing/corpusCs.ts` (Kopf), Glossar §1 Nr. 7, R1 T3.
 */
import { istKernGesperrtCs } from "../../src/lib/typing/sperrlisteCs";

/** Die Zeichen, die eine Zeile tragen darf: Buchstaben des Weges (`Ů` und alles andere nicht), Ziffern, Satz-/Sonderzeichen. */
const ERLAUBT = /^[A-Za-záčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚÝŽ0-9 .,?!:;'"()\-%/+=_*&<>$|@#€[\]]+$/u;

/** Typografische Zeichen, die das Kind nicht tippt (die Anzeige macht sie, nicht der Text). */
const TYPOGRAFISCH = /[„“”‚‘’»«…–—   ]/u;

/** Grosse Akzentbuchstaben, die erst nach der Totaste (`ˇ` bzw. `´`) verfügbar sind (`grossAkzentSpaet`). */
const GROSS_AKZENT = /^[ČŠŘŽĚĎŤŇÁÉÍÚÝÓ]/u;

export interface ZeilenOptionen {
  /** Eine Zeile aus den Chargen VOR der Totaste `ˇ` (Sprosse 33): sie darf nicht mit einem grossen Akzentbuchstaben beginnen. */
  fruehSprossen?: boolean;
}

/**
 * Alle Verstösse einer Zeile gegen die Regeln des Weges „cs" - leere Liste = in Ordnung.
 * (Jede Regel mit ihrer Quelle; die Meldung nennt sie, damit der Autor weiss, was er ändern soll.)
 */
export function zeilenFehler(zeile: string, optionen: ZeilenOptionen = {}): string[] {
  const fehler: string[] = [];
  const t = TYPOGRAFISCH.exec(zeile);
  if (t) {
    const code = t[0].codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0");
    fehler.push(`typografisches Zeichen „U+${code}“ (nur gerade Anführung ", Apostroph ', Bindestrich -, nie U+00A0)`);
  } else if (!ERLAUBT.test(zeile)) {
    const falsch = [...zeile].find((c) => !ERLAUBT.test(c));
    fehler.push(`Zeichen „${falsch}“ ist nicht im Zeichensatz des Weges cs (a-z, á č ď é ě í ň ó ř š ť ú ů ý ž, Ziffern, Satz- und Sonderzeichen)`);
  }
  if (zeile.includes("Ů")) fehler.push("„Ů“ kommt nie vor - die Tastatur erzeugt es auf keinem Weg (grossFehlt), die Zeile würde nie serviert");
  if (/(^|[\s"'(\-])ů/u.test(zeile)) fehler.push("„ů“ am Wortanfang - kein tschechisches Wort");
  if (/^\s*-\s/.test(zeile)) fehler.push("Dialogstrich am Anfang (wörtliche Rede mit \"…\")");
  if (/\s[,.?!:;]/.test(zeile)) fehler.push("Leerzeichen vor , . ? ! : ; (im Tschechischen nirgends)");
  if (/\s{2,}/.test(zeile) || zeile !== zeile.trim()) fehler.push("doppelte oder umgebende Leerzeichen");
  if (optionen.fruehSprossen && GROSS_AKZENT.test(zeile)) fehler.push("beginnt mit einem grossen Akzentbuchstaben - vor Sprosse 33 (Totaste ˇ) nicht verfügbar; anders anfangen");
  for (const wort of zeile.split(/[\s,.;:!?"()]+/)) {
    if (wort && istKernGesperrtCs(wort)) fehler.push(`Sperrwort „${wort}“ (sperrlisteCs.ts)`);
  }
  return fehler;
}
