/**
 * ★★★ Drei Fehlerklassen an Fokus und Bewegung - als Quelltext-Prüfung.
 * ============================================================================
 * Gefunden am 29.09.2026 in Punktgenau und Klangpunkte, jede an mehreren
 * Stellen. Der Helfer sucht die KLASSE, nicht die reparierten Stellen
 * ([[feedback_waechter_deckt_die_fehlerklasse]]):
 *
 * 1. **Weiches Scrollen per Skript** - `behavior: "smooth"` übergeht
 *    „weniger Bewegung". Die Regel in `index.css` schaltet nur das
 *    CSS-`scroll-behavior` ab; ein ausdrückliches „smooth" im Skript gewinnt.
 * 2. **Fokusanzeige dünner als 4,5 px** - der Plattform-Standard steht in
 *    `index.css` (`:where(…):focus-visible`, 4,5 px). Die Grundregel hat die
 *    Gewichtung 0 und verliert gegen jede Tailwind-Klasse: Wer
 *    `focus-visible:ring-2` schreibt, hat an der Stelle wieder 2 px.
 * 3. **Fokus nur als Randfarbe** - `outline-none` plus `focus:border-…` ohne
 *    eigenen Umriss. Im Windows-Kontrastmodus sieht jeder Rand gleich aus;
 *    übrig bleibt ein 2-px-Farbwechsel (dieselbe Klasse wie `.field-input`
 *    bis 07.09., Kommentar in `index.css`).
 *
 * ⚠️ Jede Funktion hat in den Wächtern eine GEGENPROBE: Sie muss die alten
 * Zeilen von vor dem 29.09. als Fehler melden. Ein Wächter, der nie rot
 * werden kann, beweist nichts ([[feedback_gruener_waechter_beweist_was]]).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export const STANDARD_PX = 4.5;

/** Alle `.ts`/`.tsx`-Dateien unter den genannten Pfaden (Dateien oder Ordner). */
export function quelldateien(wurzel: string, pfade: string[]): string[] {
  const aus: string[] = [];
  const geh = (p: string) => {
    const voll = join(wurzel, p);
    if (statSync(voll).isDirectory()) {
      for (const n of readdirSync(voll)) geh(join(p, n));
    } else if (/\.tsx?$/.test(p) && !/\.test\.tsx?$/.test(p)) {
      aus.push(p);
    }
  };
  for (const p of pfade) geh(p);
  return aus.sort();
}

export interface Fund {
  datei: string;
  zeile: number;
  text: string;
}

function zeilenMit(datei: string, quelle: string, treffer: (zeile: string) => boolean): Fund[] {
  return quelle
    .split("\n")
    .map((text, i) => ({ datei, zeile: i + 1, text: text.trim() }))
    .filter((z) => !z.text.startsWith("//") && !z.text.startsWith("*") && treffer(z.text));
}

/** Klasse 1: `behavior: "smooth"` im Skript. */
export function weichesScrollen(datei: string, quelle: string): Fund[] {
  return zeilenMit(datei, quelle, (z) => /behavior:\s*["'`]smooth["'`]/.test(z));
}

/**
 * Die Breite einer Fokus-Klasse in px, oder `null`, wenn die Klasse keine
 * Breite setzt (`focus-visible:outline` allein ist nur die Linienart).
 */
export function fokusBreite(klasse: string): number | null {
  const m = /^(?:[a-z-]+:)*(?:focus|focus-visible|focus-within):(ring|outline)(?:-(\d+(?:\.\d+)?)|-\[(\d+(?:\.\d+)?)px\])?$/.exec(
    klasse,
  );
  if (!m) return null;
  const [, art, zahl, px] = m;
  if (px !== undefined) return Number(px);
  if (zahl !== undefined) return Number(zahl); // Tailwind: ring-2 = 2px, outline-2 = 2px
  return art === "ring" ? 3 : null; // `ring` allein = 3px; `outline` allein setzt keine Breite
}

/** Alle Klassen-Wörter einer Zeile (grob: alles zwischen Leerzeichen und Anführungszeichen). */
function klassenIn(zeile: string): string[] {
  return zeile.split(/[\s"'`{}()]+/).filter(Boolean);
}

/** Klasse 2: eine Fokus-Klasse mit weniger als 4,5 px. */
export function duenneFokusanzeige(datei: string, quelle: string): Fund[] {
  return zeilenMit(datei, quelle, (z) =>
    klassenIn(z).some((k) => {
      const b = fokusBreite(k);
      return b !== null && b < STANDARD_PX;
    }),
  );
}

/** Klasse 3: `outline-none` und ein Fokus, der nur die Randfarbe wechselt. */
export function fokusNurRandfarbe(datei: string, quelle: string): Fund[] {
  return zeilenMit(datei, quelle, (z) => {
    const k = klassenIn(z);
    if (!k.includes("outline-none")) return false;
    const nurRand = k.some((w) => /^(?:focus|focus-visible):border-/.test(w));
    const eigenerUmriss = k.some((w) => (fokusBreite(w) ?? 0) >= STANDARD_PX);
    return nurRand && !eigenerUmriss;
  });
}

/** Für die Fehlermeldung: `datei:zeile  text`. */
export function zeige(funde: Fund[]): string[] {
  return funde.map((f) => `${f.datei}:${f.zeile}  ${f.text}`);
}

/** Bequemlichkeit: eine Prüfung über viele Dateien. */
export function pruefe(
  wurzel: string,
  dateien: string[],
  pruefung: (datei: string, quelle: string) => Fund[],
): Fund[] {
  return dateien.flatMap((d) => pruefung(d, readFileSync(join(wurzel, d), "utf8")));
}
