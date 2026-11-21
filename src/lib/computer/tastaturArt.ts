/**
 * im Griff — welche ART Tastatur liegt vor dem Kind? (D2, Testerin 18.10.2026)
 *
 * Testerin: „Umschalt und Strg gibt es zumindest immer doppelt, oder? Auch hier
 * könnte man eine Auswahl Laptop oder PC bzw. externe Tastatur machen."
 *
 * Zwei Arten: `"computer"` (Vorgabe: volle Tastatur) und `"laptop"`. Die Art
 * gehört wie die Plattform (`plattform.ts`) zum GERÄT, nicht zum Kind: Dasselbe
 * Kind sitzt vormittags am Schul-PC und nachmittags am Laptop. Darum liegt sie
 * im Browser des Geräts (localStorage), ohne Konto-Feld.
 *
 * Wirkung (bisher): Die Suchrunde „Tasten finden" fragt am Laptop nur Tasten,
 * die es dort ohne Fn-Taste gibt - siehe `LAPTOP_OHNE` in `tastenNamen.ts`.
 * Nicht gebaut: „links, dann rechts" bei Doppeltasten.
 */
const STORAGE_KEY = "computer.tastaturArt";

export type TastaturArt = "computer" | "laptop";

/** Die Arten mit Anzeigenamen - EINE Quelle für den Schalter und die Ansage. */
export const TASTATUR_ARTEN: readonly (readonly [TastaturArt, string])[] = [
  ["laptop", "Laptop"],
  ["computer", "Computer-Tastatur"],
] as const;

export function istTastaturArt(v: unknown): v is TastaturArt {
  return v === "computer" || v === "laptop";
}

let gewaehlt: TastaturArt | null = null;
let geladen = false;
const listeners = new Set<() => void>();

function ensureLoaded(): void {
  if (geladen) return;
  geladen = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (istTastaturArt(raw)) gewaehlt = raw;
  } catch {
    /* localStorage nicht verfügbar - dann gilt die Vorgabe */
  }
}

/** Die eingestellte Art; ohne Wahl die Computer-Tastatur (volle Liste). */
export function aktiveTastaturArt(): TastaturArt {
  ensureLoaded();
  return gewaehlt ?? "computer";
}

/** Art umstellen (wird im Browser gemerkt). */
export function setTastaturArt(a: TastaturArt): void {
  ensureLoaded();
  if (!istTastaturArt(a) || a === aktiveTastaturArt()) return;
  gewaehlt = a;
  try {
    localStorage.setItem(STORAGE_KEY, a);
  } catch {
    /* ignorieren */
  }
  for (const fn of listeners) fn();
}

/** Auf Wechsel horchen (für `useSyncExternalStore`). */
export function subscribeTastaturArt(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Ansage nach dem Umstellen - sagt, was jetzt gilt. */
export function tastaturArtAnsage(a: TastaturArt): string {
  return a === "laptop"
    ? "Tastatur: Laptop. Ich frage nur Tasten, die es am Laptop gibt."
    : "Tastatur: Computer-Tastatur. Ich frage alle Tasten.";
}

/** Nur für Tests: Speicher vergessen, damit die nächste Abfrage neu lädt. */
export function _tastaturArtZuruecksetzen(): void {
  gewaehlt = null;
  geladen = false;
}
