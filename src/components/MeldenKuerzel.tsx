/*
 * Ersatzteil im Paket „Tastenflow": Das Kürzel Alt + Umschalt + P (Melden mit
 * Bild) gehört zum Melde-Fenster der Originalplattform und ist hier leer.
 */
export function istMeldenKuerzel(_e: KeyboardEvent): boolean {
  return false;
}

export const MELDEN_MIT_BILD_EVENT = "melden-mit-bild";

export function meldeMitBild(): void {}

export function MeldenKuerzel() {
  return null;
}

export function MeldenMitBildKnopf() {
  return null;
}
