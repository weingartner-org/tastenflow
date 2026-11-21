/**
 * REIHUM, nicht zufällig - wer immer den Hauptknopf drückt, kommt an allem
 * vorbei (Johannes, 01.09.2026).
 *
 * Mitgezählt wird, welches Angebot ein Kind zuletzt bekommen hat; angeboten
 * wird das, das es am längsten nicht gab. **Die Geschichten laufen im selben
 * Wechsel mit** - sonst hätte eine der beiden Seiten immer Vorrang, und die
 * andere verhungert. Genau das ist am 25.08. schon einmal passiert (ein
 * Auswahlkriterium, das immer dasselbe bevorzugt, lässt den Rest verhungern -
 * die Vorrangregeln kamen nie aufs Blatt).
 *
 * Gezählt wird in ANGEBOTEN, nicht in Runden: Ein Angebot, das ein Kind mit
 * „lieber weiter üben" weglegt, ist trotzdem dagewesen. Sonst bekäme ein Kind
 * dieselbe Form, die es nicht mag, bis in alle Ewigkeit.
 */
import type { UebungsformId } from "./typen";

/** Die Geschichte ist kein Übungsform, läuft aber im selben Wechsel mit. */
export const GESCHICHTE = "geschichte" as const;

/** Was angeboten werden kann: eine Übungsform oder die nächste Geschichte. */
export type AngebotId = UebungsformId | typeof GESCHICHTE;

/**
 * Der Zähler im Spielstand: Kennung → laufende Nummer des Angebots, bei dem
 * sie zuletzt dran war. `naechste` ist die nächste zu vergebende Nummer.
 *
 * Warum eine eigene Nummer und nicht `roundsTotal`: Angebote und Runden
 * laufen auseinander (eine Lektion zählt anders als eine Trainingsrunde), und
 * die Reihum-Frage ist eine Frage über ANGEBOTE.
 */
export interface FormStand {
  naechste: number;
  zuletzt: Partial<Record<AngebotId, number>>;
}

export function leererStand(): FormStand {
  return { naechste: 1, zuletzt: {} };
}

/**
 * Einen Stand aus dem Spielstand lesen - alles Fremde fällt weg. Der Inhalt
 * kommt als JSON vom Server und wird nie blind geglaubt.
 */
export function standAus(data: unknown): FormStand {
  if (!data || typeof data !== "object") return leererStand();
  const d = data as { naechste?: unknown; zuletzt?: unknown };
  const naechste =
    typeof d.naechste === "number" && Number.isFinite(d.naechste) && d.naechste >= 1
      ? Math.floor(d.naechste)
      : 1;
  const zuletzt: Partial<Record<AngebotId, number>> = {};
  if (d.zuletzt && typeof d.zuletzt === "object")
    for (const [k, v] of Object.entries(d.zuletzt as Record<string, unknown>))
      if (typeof v === "number" && Number.isFinite(v) && v >= 0)
        zuletzt[k as AngebotId] = Math.floor(v);
  return { naechste, zuletzt };
}

/**
 * Welches Angebot ist als Nächstes dran? Das, das am längsten nicht dran war;
 * noch nie Angebotenes kommt vor allem anderen. Bei Gleichstand entscheidet
 * die Reihenfolge in `verfuegbar` - die Aufrufer geben sie fest vor, damit
 * dasselbe Kind auf zwei Geräten dasselbe bekommt.
 *
 * `verfuegbar` enthält NUR, was gerade taugt: Formen, die der Tastenstand
 * noch nicht hergibt, und `geschichte` ohne offene Geschichte stehen nicht
 * darin. Ist nichts verfügbar, gibt es kein Angebot (`null`) - dann trägt die
 * Karte wie bisher „Weiter".
 */
export function naechstesAngebot(
  stand: FormStand,
  verfuegbar: readonly AngebotId[],
): AngebotId | null {
  if (verfuegbar.length === 0) return null;
  let beste: AngebotId = verfuegbar[0];
  let bestwert = stand.zuletzt[verfuegbar[0]] ?? -1;
  for (const id of verfuegbar.slice(1)) {
    const wert = stand.zuletzt[id] ?? -1;
    if (wert < bestwert) {
      beste = id;
      bestwert = wert;
    }
  }
  return beste;
}

/**
 * Ein Angebot ist gemacht worden - egal, ob das Kind es angenommen hat.
 * Gibt einen NEUEN Stand zurück (der alte bleibt unberührt).
 */
export function angebotVermerkt(stand: FormStand, id: AngebotId): FormStand {
  return {
    naechste: stand.naechste + 1,
    zuletzt: { ...stand.zuletzt, [id]: stand.naechste },
  };
}
