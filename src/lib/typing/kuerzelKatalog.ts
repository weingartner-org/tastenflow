/*
 * Ersatzteil im Paket „Tastenflow": In der Plattform sagt „Tasten erkunden"
 * bei einer Tastenkombination, was sie tut (Strg + C - kopieren). Das Wissen
 * stammt aus dem Kürzel-Katalog eines anderen Programms der Plattform. Dieses
 * Programm gehört nicht zum Paket - der Katalog ist hier leer.
 *
 * Folge: „Tasten erkunden" nennt Einzeltasten und Tastenkombinationen, sagt
 * bei Kombinationen aber nicht, was sie bewirken. Wer einen eigenen Katalog
 * hat, liefert ihn hier (Form: `Skill[]` je Plattform, siehe `lib/computer/model.ts`).
 */
import type { Plattform, Skill } from "../computer/model";

/** Immer „fertig": es gibt nichts nachzuladen. */
export function ladeKuerzelKatalog(): Promise<void> {
  return Promise.resolve();
}

export function kuerzelKatalogGeladen(): boolean {
  return true;
}

/** Leerer Katalog (nie `null`, sonst wartete das Fenster ewig darauf). */
export function kuerzelKatalog(_plattform: Plattform): Skill[] | null {
  return [];
}

/** Nur für Tests: nichts zu vergessen. */
export function kuerzelKatalogVergessenFuerTests(): void {}
