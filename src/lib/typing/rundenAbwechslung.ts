/**
 * ★★★ DIE RÜCKMELDUNG NACH DER RUNDE WECHSELT (29.10.2026).
 *
 * Wunsch einer Lehrerin: „Die Rückmeldung nach einer Trainingseinheit ist
 * immer die gleiche (auch bei drei Sternen), kann diese variiert werden und
 * etwas motivierender sein?"
 *
 * ── DIE REGEL ──────────────────────────────────────────────────────────────
 * Zu jeder Sternzahl gibt es mehrere Sätze (`rundenSaetze.ts`). Welcher dran
 * ist, entscheidet ein ZÄHLER je Sternzahl - nicht der Zufall:
 *
 *  • Der Zähler geht bei jeder Runde um eins weiter. Bei mindestens zwei
 *    Sätzen heisst das: Zwei Runden mit gleicher Sternzahl hintereinander
 *    zeigen nie denselben Satz. Das ist KEINE Hoffnung, sondern Rechnung -
 *    mit `Math.random()` bliebe es eine.
 *  • Er steht im Gerätespeicher: Ein neu geladener Bildschirm, ein Wechsel
 *    der Übungsart oder ein anderer Tag fängt nicht wieder bei Satz eins an
 *    (dann sähe das Kind jedes Mal denselben ersten Satz - genau die Klage).
 *  • Er wird EINMAL beim Rundenende gezogen (im Ereignis), nie im Render:
 *    Ein Bildschirm, der sich neu zeichnet, darf den Satz nicht wechseln.
 *  • Ohne Speicher (Privatfenster) zählt ein Merker im Arbeitsspeicher.
 *
 * Die Funktionen sind rein bis auf `naechsteVariante`; die Auswahl selbst
 * (`waehle`) ist eine einfache Rechnung und lässt sich ohne Browser prüfen.
 */

/** Die Zähler, die es gibt: Karte (Titel, Sprechtext), Bemerkung, Rat-Satz. */
export type ZaehlerArt = "karte" | "bemerkung" | "rat";

export const RUNDEN_ZAEHLER_KEY = "sensorik:tippen:runden-abwechslung";

/**
 * Die Zähler laufen modulo 60: 60 ist durch 2, 3, 4, 5 und 6 teilbar, also
 * bricht beim Überlauf KEINE Liste dieser Längen die Regel „nie zweimal
 * hintereinander" (bei 1000 oder 2^31 träte an der Nahtstelle ein Sprung auf).
 */
const ZAEHLER_MODUL = 60;

const imArbeitsspeicher: Record<string, number> = {};

function lies(): Record<string, number> {
  try {
    const roh = localStorage.getItem(RUNDEN_ZAEHLER_KEY);
    if (!roh) return {}; // der Speicher geht, nur ist noch nichts darin
    const d = JSON.parse(roh) as unknown;
    if (d && typeof d === "object") return d as Record<string, number>;
    return {};
  } catch {
    /* kein Speicher (Privatfenster) oder kaputter Eintrag - dann der Arbeitsspeicher */
    return { ...imArbeitsspeicher };
  }
}

function schreibe(d: Record<string, number>): void {
  Object.assign(imArbeitsspeicher, d);
  try {
    localStorage.setItem(RUNDEN_ZAEHLER_KEY, JSON.stringify(d));
  } catch {
    /* Speichern ist optional */
  }
}

/** Sterne auf die drei Listen abbilden: 0 und 1 -> 1, 2 -> 2, 3 und mehr -> 3. */
export function sterneStufe(sterne: number): 1 | 2 | 3 {
  return sterne >= 3 ? 3 : sterne >= 2 ? 2 : 1;
}

/**
 * Die Nummer der Variante für diese Runde ziehen - und den Zähler weiterrücken.
 * Je (Art, Sternstufe) ein eigener Zähler.
 */
export function naechsteVariante(art: ZaehlerArt, sterne: number): number {
  const schluessel = `${art}${sterneStufe(sterne)}`;
  const d = lies();
  const jetzt = Number.isInteger(d[schluessel]) ? d[schluessel] : 0;
  schreibe({ ...d, [schluessel]: (jetzt + 1) % ZAEHLER_MODUL });
  return jetzt;
}

/**
 * Aus einer Liste die Variante wählen. Ohne Nummer die erste - so liefert
 * jeder Aufruf, der keine Nummer kennt (alle Alt-Aufrufer, alle Tests), einen
 * festen, bekannten Satz.
 */
export function waehle<T>(liste: readonly T[], variante = 0): T {
  const n = liste.length;
  return liste[((variante % n) + n) % n];
}
