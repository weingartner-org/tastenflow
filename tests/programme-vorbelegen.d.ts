/**
 * Typ für `scripts/programme-vorbelegen.mjs` (E5, 19.09.2026), damit der
 * Wächter `tests/meine-klasse-programme-je-einstieg.test.tsx` die reine
 * Regel `neueListe` typsicher importieren kann. Das Skript selbst ist reines
 * Node (kein TS) - derselbe Kunstgriff wie `tests/ueb-scripts.d.ts` für die
 * UEB-Build-Skripte.
 */
declare module "*/scripts/programme-vorbelegen.mjs" {
  export function neueListe(
    gespeichert: string[],
    gemessen: string[],
  ): string[] | null;
}
