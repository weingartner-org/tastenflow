/**
 * Der Weg vom Motiv zum Bild - das kleine Modul, das die Medaille zeichnet.
 *
 * Es steht BEWUSST allein und kennt das Register `motivpoolDaten.ts` nicht:
 * Dort liegen 1595 Eintraege mit Namen und Suchwoertern, die im Browser
 * niemand braucht. Wer nur einen Pfad will, nimmt dieses Modul; wer den POOL
 * durchsuchen will (Bauwerkzeug, Tests), nimmt `motivpool.ts` daneben.
 * Die Trennung ist die Zusicherung, dass die Motivdaten nie im Buendel landen.
 *
 * Bilder: Fluent Emoji von Microsoft (MIT) unter
 * `public/abzeichen/fluent/color/<code>.svg` und `…/kontrast/<code>.svg`.
 * Erzeugt und nachgeprueft von `scripts/erzeuge-motivpool.mts`.
 */

/** Ordner der Motivbilder unterhalb der Anwendungswurzel. */
const WURZEL = "abzeichen/fluent";

/**
 * Codepoints eines Emojis als Dateiname: klein, "-"-verbunden, ohne die
 * Variantenwahl `fe0f`.
 *
 * ⚠️ DIE EINE QUELLE. In `badges.ts` steht weiterhin nur das Emoji-Zeichen -
 * kein zweites Feld mit Codepoints, das jemand vergessen koennte
 * nachzuziehen. Der Code wird IMMER hier abgeleitet, auf beiden Seiten mit
 * derselben Regel (siehe `normCode` im Erzeuger-Skript).
 *
 * `fe0f` muss raus, weil Fluent es in seinen Dateinamen nicht fuehrt, ein
 * Emoji im Quelltext es aber fast immer traegt: `❤️` ist `2764 fe0f`, das
 * Bild heisst `2764.svg`.
 */
export function motivCode(emoji: string): string {
  return [...emoji]
    .map((z) => z.codePointAt(0) ?? 0)
    .filter((cp) => cp !== 0xfe0f)
    .map((cp) => cp.toString(16).toLowerCase())
    .join("-");
}

/**
 * Pfad zum Motivbild.
 *
 * @param code     Codepoints (aus {@link motivCode}) ODER direkt das Emoji.
 * @param kontrast Kontrastmodus? Dann die Strichzeichnung „High Contrast",
 *                 sonst das farbige Bild.
 */
export function motivBild(code: string, kontrast = false): string {
  const c = /^[0-9a-f-]+$/.test(code) ? code : motivCode(code);
  return `${basis()}${WURZEL}/${kontrast ? "kontrast" : "color"}/${c}.svg`;
}

/**
 * Anwendungswurzel (`/` in dieser Plattform).
 *
 * ⚠️ Das `?.` ist kein Zierrat: `import.meta.env` gibt es nur, wenn Vite den
 * Baustein uebersetzt hat. `scripts/zeige-abzeichen-medaillen.mts` rendert die
 * Medaillen aber mit `tsx` in reinem Node - dort ist `import.meta.env`
 * undefiniert, und ein direkter Zugriff riss das Pruefblatt mit einem
 * TypeError ab.
 */
function basis(): string {
  return import.meta.env?.BASE_URL ?? "/";
}
