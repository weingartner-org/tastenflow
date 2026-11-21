/**
 * Die LAUTSTÄRKEN der Klänge von Tastenflow (17.10.2026).
 *
 * Johannes: „unter dem runden Lautsprecher-Schalter ein Menü mit allen
 * Akustik-Einstellungen, mit Schiebereglern". Bis dahin gab es für jeden
 * Klang nur An/Aus; eine Lautstärke gab es nirgends - weder für die Töne noch
 * für den Klick noch für die Melodie.
 *
 * Drei Regler, je ein Faktor von 0 bis 1 auf den bisherigen Pegel:
 *   · `toene`   - Fehlerton, Erfolgsklang, Sterne, Abzeichen, Fanfaren
 *   · `klick`   - der leise Klick bei jedem richtigen Anschlag
 *   · `melodie` - die Melodie beim Tippen samt Band
 * Die Vorgabe ist überall 1: Wer nichts verstellt, hört GENAU, was er bisher
 * gehört hat (kein Byte anders im Klang).
 *
 * Die Sprechlautstärke und das Sprechtempo gehören dem Vorlesen und liegen
 * darum in `voice.ts` (`useVoice`), nicht hier.
 *
 * ⚠️ Der Faktor wirkt auf die SPITZE der Hüllkurve, nicht auf einen Master-
 * Regler hinter den Tönen: Die kurzen Töne entstehen einzeln (`tone()` in
 * `sound.ts`), einen gemeinsamen Ausgang gibt es dort nicht. Nur die Melodie
 * hat einen (`ausgang()` in `melodie.ts`) und hört live auf Änderungen.
 */

import { create } from "zustand";

const KEY = "tippen-lautstaerke";

export type LautstaerkeArt = "toene" | "klick" | "melodie";

export interface LautstaerkeStand {
  toene: number;
  klick: number;
  melodie: number;
}

/** Schrittweite der Regler - grob genug für Tastatur (Pfeiltasten), fein genug fürs Ohr. */
export const LAUTSTAERKE_SCHRITT = 0.05;

const VORGABE: LautstaerkeStand = { toene: 1, klick: 1, melodie: 1 };

/** Ein Wert gehört in [0, 1]; alles andere (NaN, Text, fehlend) wird zur Vorgabe. */
export function lautstaerkeBegrenzen(v: unknown, vorgabe = 1): number {
  if (typeof v !== "number" || !Number.isFinite(v)) return vorgabe;
  return Math.max(0, Math.min(1, v));
}

/** Gespeicherten Stand lesen - rein, damit prüfbar. */
export function lautstaerkeLesen(roh: string | null): LautstaerkeStand {
  if (!roh) return { ...VORGABE };
  try {
    const d = JSON.parse(roh) as Partial<Record<LautstaerkeArt, unknown>>;
    return {
      toene: lautstaerkeBegrenzen(d.toene),
      klick: lautstaerkeBegrenzen(d.klick),
      melodie: lautstaerkeBegrenzen(d.melodie),
    };
  } catch {
    return { ...VORGABE };
  }
}

function aufDisk(): LautstaerkeStand {
  try {
    return lautstaerkeLesen(localStorage.getItem(KEY));
  } catch {
    return { ...VORGABE };
  }
}

function speichern(s: LautstaerkeStand): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* localStorage nicht verfügbar - egal */
  }
}

interface LautstaerkeZustand extends LautstaerkeStand {
  setze: (art: LautstaerkeArt, wert: number) => void;
}

export const useLautstaerke = create<LautstaerkeZustand>((set, get) => ({
  ...aufDisk(),
  setze: (art, wert) => {
    const neu = lautstaerkeBegrenzen(wert);
    set({ [art]: neu } as Pick<LautstaerkeStand, LautstaerkeArt>);
    const { toene, klick, melodie } = get();
    speichern({ toene, klick, melodie });
  },
}));

/** Der Faktor für Module ohne React (sound.ts, melodie.ts). */
export function lautstaerke(art: LautstaerkeArt): number {
  return useLautstaerke.getState()[art];
}
