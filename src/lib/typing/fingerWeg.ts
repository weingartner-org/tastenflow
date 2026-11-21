/**
 * WOHIN der Finger von seiner Grundstellung aus geht - „vom K aus nach vorne,
 * fast gerade".
 *
 * ★ 25.09.2026 (Johannes): *„der Finger und die Reihe ist noch zu wenig …
 * rechter Mittelfinger obere Reihe fast gerade nach vor, also sag noch ob der
 * Finger in der Verlängerung des Unterarmes gerade oder nach rechts oder nach
 * links muss."*
 *
 * Gerechnet wird an der echten Tastatur, nicht je Taste abgetippt: Die Reihen
 * sind gegeneinander versetzt, in Tastenbreiten vom linken Rand (ISO wie ANSI):
 *
 * ```
 *   Zahlenreihe   0      (erste Taste ^ bzw. `)
 *   obere Reihe   1,5    (nach dem Tabulator)
 *   Grundreihe    1,75   (nach der Feststelltaste)
 *   untere Reihe  1,25   ISO (< nach kurzem Umschalt) · 2,25 ANSI
 * ```
 *
 * Darum liegt jede Taste der oberen Reihe eine VIERTEL Taste links von der
 * Grundtaste darunter (I über K: fast gerade), jede der unteren Reihe eine
 * HALBE Taste rechts (M unter J: etwas nach rechts). Dazu kommt die Spalte:
 * T liegt eine Spalte rechts von F und eine Reihe höher ⇒ 0,75 nach rechts,
 * also schräg.
 *
 * ⚠️ Eigene Datei, damit `fingers.ts` (dort arbeitet gerade der französische
 * Lehrgang) nicht angefasst werden muss. Keine Abhängigkeit von `letters.ts`.
 */
import { activeLayout } from "./layouts";
import { baseKeyForChar, fingerForChar, type FingerId } from "./fingers";
import type { Lang } from "./account";

/** Die Grundstellung jedes Fingers als Platz in der Grundreihe (a s d f · j k l ö). */
const HEIM_PLATZ: Partial<Record<FingerId, number>> = {
  "kleiner-links": 0,
  "ring-links": 1,
  "mittel-links": 2,
  "zeige-links": 3,
  "zeige-rechts": 6,
  "mittel-rechts": 7,
  "ring-rechts": 8,
  "kleiner-rechts": 9,
};

const GRUNDREIHE = 2;

/** Wo die erste Taste einer Reihe beginnt, in Tastenbreiten vom linken Rand. */
function reihenBeginn(reihe: number, iso: boolean): number {
  if (reihe === 0) return 0;
  if (reihe === 1) return 1.5;
  if (reihe === 2) return 1.75;
  return iso ? 1.25 : 2.25;
}

export interface FingerWeg {
  /** Die Grundtaste, von der aus der Finger geht (Zeichen wie auf der Tastatur). */
  heim: string;
  /** Reihen nach vorne (+) bzw. nach hinten (-). */
  reihen: number;
  /** Seitlich in Tastenbreiten, rechts (+) bzw. links (-). */
  seitlich: number;
}

/**
 * Der Weg von der Grundtaste des Fingers zur Taste dieses Zeichens - oder
 * `null` (Daumen, Zeichen auf keiner Taste, Grundreihe fehlt).
 */
export function fingerWegFuer(ch: string): FingerWeg | null {
  const f = fingerForChar(ch);
  const platz = f ? HEIM_PLATZ[f.id] : undefined;
  if (platz === undefined) return null;
  const rows = activeLayout().rows;
  // ISO hat die Eingabetaste schon in der oberen Reihe (hohes Enter).
  const iso = !!rows[1]?.right;
  const heim = rows[GRUNDREIHE]?.keys[platz];
  if (!heim) return null;
  const base = baseKeyForChar(ch);
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r].keys.indexOf(base);
    if (i < 0) continue;
    const x = reihenBeginn(r, iso) + i;
    const xHeim = reihenBeginn(GRUNDREIHE, iso) + platz;
    return { heim, reihen: GRUNDREIHE - r, seitlich: Math.round((x - xHeim) * 100) / 100 };
  }
  return null;
}

/** Bis hierhin gilt ein seitlicher Versatz als „fast gerade", bis `ETWAS` als „etwas". */
const FAST_GERADE = 0.3;
const ETWAS = 0.6;

/**
 * Die RICHTUNG in Worten, ohne die Grundtaste - „nach vorne, fast gerade",
 * „nach hinten und etwas nach rechts", „eine Taste nach links". `null` auf
 * der Grundtaste selbst.
 */
export function richtungInWorten(w: FingerWeg, lang: Lang = "de"): string | null {
  const en = lang === "en";
  const betrag = Math.abs(w.seitlich);
  const seite = w.seitlich > 0 ? (en ? "right" : "rechts") : en ? "left" : "links";
  if (w.reihen === 0) {
    if (betrag < 0.01) return null;
    const n = Math.round(betrag);
    if (en) return `${n === 1 ? "one key" : `${n} keys`} to the ${seite}`;
    return `${n === 1 ? "eine Taste" : `${n} Tasten`} nach ${seite}`;
  }
  const vorne = w.reihen > 0;
  const n = Math.abs(w.reihen);
  const hoch = en
    ? `${n === 2 ? "two rows " : ""}${vorne ? "forward" : "back"}`
    : `${n === 2 ? "zwei Reihen " : ""}nach ${vorne ? "vorne" : "hinten"}`;
  if (betrag <= FAST_GERADE) return en ? `${hoch}, almost straight` : `${hoch}, fast gerade`;
  if (betrag <= ETWAS)
    return en ? `${hoch} and slightly to the ${seite}` : `${hoch} und etwas nach ${seite}`;
  return en ? `${hoch} and diagonally to the ${seite}` : `${hoch} und schräg nach ${seite}`;
}
