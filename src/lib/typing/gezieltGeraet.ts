/**
 * ★ GEZIELT ÜBEN (13.11.2026, Bauplan §2): ZWEI QUELLEN, eine Wahrheit - dieselbe Bauart wie „Einhand schreiben"
 * (`einhand.ts`):
 *   • MIT Kind-Konto entscheidet das Konto (`TypingAccount.gezielt`): in einer Klasse die Lehrkraft, ein Konto ohne
 *     Lehrkraft stellt es selbst um (Server-Wächter `tt_pupils_field_guard.pb.js`).
 *   • OHNE Kind-Konto (Gäste, Lehrkräfte, die selbst üben) merkt es dieses Gerät - hier, im Browser
 *     (`localStorage` `tippen-gezielt`).
 *
 * Dazu der Merker „diese vorgezogene Taste wurde schon einmal vorgestellt" (`tippen-gezielt-vorgestellt`), je Konto
 * bzw. Gerät - die Vorstellung kommt nur beim ersten Mal.
 */
import { create } from "zustand";
import { gezieltAus, type Gezielt } from "./gezielt";

const KEY = "tippen-gezielt";
const KEY_VORGESTELLT = "tippen-gezielt-vorgestellt";

function lesen(): Gezielt | null {
  try {
    const roh = localStorage.getItem(KEY);
    return roh ? gezieltAus(roh) : null;
  } catch {
    return null;
  }
}

function schreiben(g: Gezielt | null): void {
  try {
    if (g) localStorage.setItem(KEY, JSON.stringify(g));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

interface GezieltGeraetState {
  /** Die GERÄTE-Einstellung (gilt nur ohne Kind-Konto). `null` = nichts gesetzt. */
  gezielt: Gezielt | null;
  setGezielt: (g: Gezielt | null) => void;
}

export const useDeviceGezielt = create<GezieltGeraetState>((set) => ({
  gezielt: lesen(),
  setGezielt: (g) => {
    const sauber = g ? gezieltAus(g) : null;
    schreiben(sauber);
    set({ gezielt: sauber });
  },
}));

/** Der Schlüssel des Merkers: das Konto, sonst das Gerät. */
export function vorgestelltSchluessel(kontoId: string | null | undefined): string {
  return kontoId ? `konto:${kontoId}` : "geraet";
}

function vorgestelltAlle(): Record<string, string[]> {
  try {
    const roh = localStorage.getItem(KEY_VORGESTELLT);
    const o = roh ? (JSON.parse(roh) as unknown) : null;
    if (!o || typeof o !== "object" || Array.isArray(o)) return {};
    const aus: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      if (Array.isArray(v)) aus[k] = v.filter((z): z is string => typeof z === "string");
    }
    return aus;
  } catch {
    return {};
  }
}

/** Welche vorgezogenen Zeichen hat dieses Konto/Gerät schon vorgestellt bekommen? */
export function vorgestelltLesen(schluessel: string): string[] {
  return vorgestelltAlle()[schluessel] ?? [];
}

/** Diese Zeichen als vorgestellt merken. */
export function vorgestelltMerken(schluessel: string, zeichen: readonly string[]): void {
  try {
    const alle = vorgestelltAlle();
    const jetzt = new Set([...(alle[schluessel] ?? []), ...zeichen]);
    alle[schluessel] = [...jetzt];
    localStorage.setItem(KEY_VORGESTELLT, JSON.stringify(alle));
  } catch {
    /* ignore */
  }
}
