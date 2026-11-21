/**
 * Die Regeln für JEDE polnische Textzeile (F5-pl, 03.10.2026) - eine Funktion, die der Wächter
 * `tests/tastenflow-pl-texte-regeln.test.ts` und jeder Wächter einer Text-Charge (T1 ff.) gemeinsam benutzt.
 * Quelle: GLOSSAR-pl.md §1 Nr. 8, §2.10, §3 (Fallen 8, 10), `corpusPl.ts` (Kopf).
 */
import { istKernGesperrtPl } from "../../src/lib/typing/sperrlistePl";

/**
 * Zeichen, die auf der Tastatur `pl` ohne Umweg nicht liegen oder gegen die Hausregeln verstossen: typografische Anführung
 * („ ” “ ‘ ’ « »), Gedankenstriche, `…`, geschütztes Leerzeichen (U+00A0, Falle 8), Gradzeichen und die Buchstaben der anderen Sprachen
 * (`ä ö ü ß é è à ù â ê î ô û ñ ç á í ú`). `ó` und `€` liegen auf `pl`.
 */
const VERBOTENE_ZEICHEN = /[’‘“”„«»–—…º°ª§£~   äöüßéèàùâêîôûñçáíú]/iu;

/**
 * Alle Verstösse einer Zeile gegen die Regeln des Weges „pl" - leere Liste = in Ordnung.
 * (Jede Regel mit ihrer Quelle; die Meldung nennt sie, damit der Autor weiss, was er ändern soll.)
 */
export function zeilenFehler(zeile: string): string[] {
  const fehler: string[] = [];
  const m = VERBOTENE_ZEICHEN.exec(zeile);
  if (m) fehler.push(`Zeichen „${m[0]}“ (nur gerade Anführung/Apostroph, nur Bindestrich, kein geschütztes Leerzeichen, nichts, was auf keiner pl-Tastatur liegt)`);
  if (/^\s*[-–—]\s/.test(zeile)) fehler.push("Dialogstrich am Anfang (wörtliche Rede mit \"…\")");
  if (/\s[?!:;]/.test(zeile)) fehler.push("Leerzeichen vor ? ! : ; (im Polnischen kein Leerzeichen, GLOSSAR §1 Nr. 8)");
  if (/\d\s%/.test(zeile)) fehler.push("Prozent mit Leerzeichen (Polnisch: „95%“, GLOSSAR §1 Nr. 5)");
  if (/\b\d{1,3}\.\d{3}\b(?!\.)/.test(zeile)) fehler.push("Tausenderpunkt (Polnisch: vierstellig ohne Trenner, ab fünf Stellen ein Leerzeichen; GLOSSAR §1 Nr. 5)");
  if (/(?<!\p{L})'|'(?!\p{L})/u.test(zeile)) fehler.push("Apostroph ohne Buchstaben auf beiden Seiten (Apostroph steht nur im Wort: Braille'a; Anführung: \"…\")");
  if (/\bna ślepo\b/iu.test(zeile)) fehler.push("„na ślepo“ (nie; GLOSSAR §1 Nr. 4: „pisanie bezwzrokowe“)");
  if (/\bznaki specjalne\b/iu.test(zeile) && /[ąćęłńóśźż]/iu.test(zeile)) fehler.push("polnische Buchstaben sind keine „znaki specjalne“ (GLOSSAR §3 Nr. 10)");
  for (const wort of zeile.split(/[\s,.;:!?"()\-]+/)) {
    if (wort && istKernGesperrtPl(wort)) fehler.push(`Sperrwort „${wort}“ (sperrlistePl.ts)`);
  }
  if (/\s{2,}/.test(zeile) || zeile !== zeile.trim()) fehler.push("doppelte oder umgebende Leerzeichen");
  return fehler;
}
