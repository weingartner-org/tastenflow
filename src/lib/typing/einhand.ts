/**
 * „Einhand schreiben" - die Umschalt-Gegenhand-Regel ist AUS: Großbuchstaben
 * und Sonderzeichen gelten mit jeder Umschalttaste (für alle, die mit einer
 * Hand tippen). 19.09.2026 - Johannes: *„Selbstlernende sollen sich alles
 * einstellen können"* - dann: *„auch Leute ohne Anmeldung"*.
 *
 * ZWEI QUELLEN, eine Wahrheit - dieselbe Bauart wie „Zeit lassen"
 * (`noTimePressure.ts`) und „Zeichenabstand groß (CVI)" (`zeichenabstand.ts`):
 *   • MIT Kind-Konto entscheidet das Konto (`TypingAccount.oneHand`): In einer
 *     Klasse setzt es die Lehrkraft, ein Konto ohne Lehrkraft stellt es selbst
 *     um (Server-Guard `tt_pupils_field_guard`).
 *   • OHNE Kind-Konto (Gäste, Lehrkräfte, die selbst üben) merkt es dieses
 *     Gerät - hier, im Browser.
 */
import { create } from "zustand";

const KEY = "tippen-einhand";

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function write(on: boolean): void {
  try {
    if (on) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

interface EinhandState {
  /** Der GERÄTE-Schalter (gilt nur ohne Kind-Konto). */
  on: boolean;
  setOn: (on: boolean) => void;
}

export const useDeviceEinhand = create<EinhandState>((set) => ({
  on: read(),
  setOn: (on: boolean) => {
    write(on);
    set({ on });
  },
}));
