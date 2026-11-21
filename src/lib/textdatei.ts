/**
 * Eine hochgeladene Textdatei lesen - mit dem richtigen Zeichensatz.
 *
 * ★ 29.09.2026 hierher gezogen, damit Tastenflow und der Hörsaal dieselbe
 * Erkennung benutzen, ohne dass der Hörsaal Tastenflow einbindet. Vorher
 * stand sie in `lib/typing/eigenerText.ts` (das sie weiter anbietet); der
 * Hörsaal las Abgaben mit `res.text()` - das ist IMMER UTF-8, und eine
 * Windows-„ANSI"-Datei kam als „�bung f�r Gr��e" an (Durchsicht 29.09.).
 *
 * ⚠️ Wer irgendwo eine Datei eines Menschen als Text liest, nimmt DIESE
 * Funktion. Der Wächter `textdatei-kodierung-waechter.test.ts` hält jede
 * Stelle der Plattform, die Bytes als Text liest, gegen eine benannte Liste.
 */

/**
 * ★★★★★ DIE UMLAUTE FEHLTEN (3. Klasse HAS, 23.09.2026: *„Das Programm hat
 * dabei alle Umlaute entfernt"*).
 *
 * Gemessen am Server: In `tt_eigene_texte` stand „berlegen Sie grundstzlich" -
 * das ganze Ü, das ganze ä, nicht nur die Pünktchen. So sieht eine Datei aus,
 * die Windows im Editor als „ANSI" gespeichert hat (Windows-1252): Dort ist
 * ü EIN Byte (0xFC), und das ist in UTF-8 kein gültiges Zeichen. Bis heute
 * las die App jede `.txt` als UTF-8; jedes Umlaut-Byte wurde zum
 * Ersatzzeichen „�", das auf keiner Taste liegt - und beim Start wurde es,
 * wie jedes solche Zeichen, entfernt.
 *
 * Die Reihenfolge:
 *  1. Kennzeichen am Anfang der Datei (BOM): UTF-8, UTF-16 LE/BE - so
 *     speichert der Windows-Editor „UTF-8 mit BOM" und „Unicode".
 *  2. Sonst streng als UTF-8 lesen. Ein gültiger UTF-8-Text ist fast nie
 *     zufällig etwas anderes - das ist der Normalfall.
 *  3. Scheitert das, ist es Windows-1252. Darin ist JEDES Byte ein Zeichen,
 *     es bleibt also nichts als „�" zurück.
 */
export function dekodiereTextdatei(bytes: Uint8Array): string {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf)
    return new TextDecoder("utf-8").decode(bytes);
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe)
    return new TextDecoder("utf-16le").decode(bytes);
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff)
    return new TextDecoder("utf-16be").decode(bytes);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("windows-1252").decode(bytes);
  }
}
