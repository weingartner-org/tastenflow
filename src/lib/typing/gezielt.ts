/**
 * ★ GEZIELT ÜBEN (13.11.2026, Bauplan BAUPLAN-2026-11-13-GEZIELT-UEBEN.md §2) - EINE Quelle für das Datenmodell.
 *
 * Wer einzelne Tasten oder Sonderzeichen gezielt üben will (Lehrkraft für die Klasse oder ein Kind, Selbstlernende für
 * sich), stellt hier eine kurze Liste ein. Dieses Modul kennt nur das MODELL: säubern, Ablauf, Vorrang Kind/Klasse.
 * Den Rundenbau macht `generator.ts` (`AdaptiveOptions.gezielt`), das Vorziehen noch nicht gelernter Tasten der
 * `AdaptiveTrainer`.
 */

/** Wie stark die gewählten Zeichen die Runde prägen: ein wenig (ca. jede dritte Zeile) · viel (jede Zeile) · nur diese. */
export type GezieltAnteil = "wenig" | "viel" | "nur";

export interface Gezielt {
  /** Die gewählten Zeichen, je genau eines (ein Unicode-Zeichen), eindeutig. */
  zeichen: string[];
  anteil: GezieltAnteil;
  /** „JJJJ-MM-TT", gilt bis Tagesende (lokal); `null` = bis es ausgeschaltet wird. */
  bis: string | null;
}

/** Höchstens so viele Zeichen gleichzeitig (Entscheidung Johannes 13.11.). */
export const GEZIELT_MAX = 8;

const ANTEILE: readonly GezieltAnteil[] = ["wenig", "viel", "nur"];

function istDatum(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/**
 * Rohwert (aus dem Konto, der Klasse, `localStorage`) säubern: nur einzelne, eindeutige, sichtbare Zeichen, höchstens
 * {@link GEZIELT_MAX}; ein unbekannter Anteil wird „viel", ein ungültiges Datum `null` (= unbefristet). Alles, was kein Objekt ist
 * oder kein Zeichen übrig lässt, wird `null`.
 * Ein leeres `zeichen`-Feld ist hier ABSICHTLICH ein gültiger Wert (`{zeichen: []}`), wenn der Rohwert ein Objekt mit Liste
 * ist: für ein Kind heisst es „aus, auch wenn die Klasse etwas eingestellt hat" (siehe {@link gezieltFuerKind}).
 */
export function gezieltAus(roh: unknown): Gezielt | null {
  let wert = roh;
  if (typeof wert === "string") {
    try {
      wert = JSON.parse(wert);
    } catch {
      return null;
    }
  }
  if (!wert || typeof wert !== "object" || Array.isArray(wert)) return null;
  const o = wert as Record<string, unknown>;
  if (!Array.isArray(o.zeichen)) return null;
  const zeichen: string[] = [];
  for (const z of o.zeichen) {
    if (typeof z !== "string") continue;
    const teile = [...z];
    if (teile.length !== 1) continue;
    if (/^\s$/u.test(teile[0])) continue;
    if (zeichen.includes(teile[0])) continue;
    zeichen.push(teile[0]);
    if (zeichen.length >= GEZIELT_MAX) break;
  }
  const anteil: GezieltAnteil = ANTEILE.includes(o.anteil as GezieltAnteil) ? (o.anteil as GezieltAnteil) : "viel";
  return { zeichen, anteil, bis: istDatum(o.bis) ? o.bis : null };
}

/** Das lokale Datum als „JJJJ-MM-TT". */
export function datumLokal(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const t = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${t}`;
}

/** Gilt die Einstellung heute? Abgelaufen (`bis` liegt vor dem heutigen Tag) oder ohne Zeichen: `null` - als wäre nichts gesetzt. */
export function gezieltWirksam(g: Gezielt | null | undefined, heute: Date): Gezielt | null {
  if (!g || g.zeichen.length === 0) return null;
  if (g.bis !== null && g.bis < datumLokal(heute)) return null;
  return g;
}

/**
 * Was für dieses Kind gilt. Vorrang: Ist am Kind ein Feld gesetzt - auch `{zeichen: []}`, das heisst „aus für dieses Kind" -,
 * gilt dieses; ist es `null`/`undefined`, gilt die Klasse. Danach zählt der Ablauf ({@link gezieltWirksam}).
 */
export function gezieltFuerKind(
  kind: Gezielt | null | undefined,
  klasse: Gezielt | null | undefined,
  heute: Date,
): Gezielt | null {
  // ★ Das Kind-Feld gilt, solange es nicht abgelaufen ist - auch als „aus"
  // ({zeichen: []}). Ist seine Dauer vorbei, gilt wieder die Klasse (Bauplan §2).
  if (kind && !(kind.bis !== null && kind.bis < datumLokal(heute))) return gezieltWirksam(kind, heute);
  return gezieltWirksam(klasse ?? null, heute);
}
