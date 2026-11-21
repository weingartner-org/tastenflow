/**
 * „Zeit lassen" — der Schalter, mit dem für EIN KIND das Tempo überall
 * aufhört zu zählen (Tastenflow, 14.08.2026).
 *
 * Wirkung, wenn er an ist:
 *   • kein Zeitfenster im Expeditions-Spiel (`noTimePressure`),
 *   • Tempo-Ziel 0 → die Sterne zählen allein die Sorgfalt (stars.ts),
 *   • Buchstaben gelten ohne Tempo-Messung als „sitzt" (letters.ts),
 *   • kein Auf- und Abstieg der Leistungsstufe (progress.ts),
 *   • die Übezeit-Uhr toleriert lange Pausen zwischen zwei Anschlägen
 *     (practiceClock.ts) — sonst verschluckt sie bei 8 Anschlägen pro Minute
 *     rund ein Drittel der wirklich gesessenen Zeit.
 *
 * ZWEI QUELLEN, eine Wahrheit:
 *   • MIT Konto entscheidet das Konto (`TypingAccount.noTimePressure`): Bei
 *     Kindern einer Klasse setzt ihn die Lehrkraft (wie „Einhand schreiben"),
 *     selbstlernende Konten stellen ihn selbst um (Server-Guard
 *     `tt_pupils_field_guard`).
 *   • OHNE Konto (Gäste) merkt ihn dieses Gerät — hier, im Browser. Das ist
 *     dieselbe Logik wie bei Ton, Vorlesen und Zoom: Ohne Konto beschreibt die
 *     Einstellung das Gerät, nicht die Person.
 *
 * Siehe [[project_zehnfinger_trainer]], [[feedback_programme_nicht_einschraenken]].
 */
import { create } from "zustand";

const KEY = "tippen-zeit-lassen";

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

interface NoTimePressureState {
  /** Der GERÄTE-Schalter (gilt nur für Gäste ohne Konto). */
  on: boolean;
  setOn: (on: boolean) => void;
}

export const useDeviceNoTimePressure = create<NoTimePressureState>((set) => ({
  on: read(),
  setOn: (on: boolean) => {
    write(on);
    set({ on });
  },
}));

// (Bis 11.09.2026 stand hier `deviceNoTimePressure()`, entfernt weil
// ungenutzt - auch nicht aus `tests/`.)
