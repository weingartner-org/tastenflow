/**
 * ★★★ WELCHE TASTATUREN EIN WEG ANBIETET (D1 Nr. 7, 28.09.2026, Entscheidung
 * Johannes: „Weg fr nur mit französischen Tastaturen - ja"; sein Grundsatz:
 * gelehrt wird die Tastatur des Landes).
 *
 * Ein Weg mit Hauptsprache (`hauptsprache`, lernweg.ts) lehrt die Tastaturen
 * ihrer Länder - Weg „fr" die fünf französischen (Frankreich, Belgien,
 * Schweiz, Kanada zweimal), Weg „es" die zwei spanischen (Spanien,
 * Lateinamerika). Seine Reihenfolge, seine Totasten, seine Grundreihe sind
 * für diese Tastaturen gemessen; auf einer deutschen oder englischen Tastatur
 * fehlen é/è/à bzw. ñ/´ ganz. Bis hierher bot die Einrichtung und das
 * Zahnrad auf Weg „fr" auch „Deutsch", „Englisch (USA)" … an.
 *
 * Weg „de"/„en": keine Einschränkung (wie bisher - Deutsch UND Schweiz,
 * US UND UK, und Weg „en" auf einer deutschen Tastatur ist ein bewusster Fall,
 * `achteGrundtasteFuerLayout`).
 *
 * Die Regel steht an der EIGENSCHAFT des Weges (Hauptsprache), nicht an seiner
 * Kennung (Leitfaden Falle 50), und liest die Tastatur-Gruppen aus layouts.ts -
 * keine zweite Liste.
 */
import {
  LAYOUTS,
  sichtbareLayouts,
  TASTATUREN_DER_SPRACHE,
  type KeyboardLayout,
  type LayoutId,
} from "./layouts";
import type { Lang } from "./account";
import { lernwegDef, type Lernweg } from "./lernweg";

/**
 * Die Tastaturen, die dieser Weg lehrt - oder `null` (Weg ohne Einschränkung).
 * ★ G2b-2: die Tabelle `TASTATUREN_DER_SPRACHE` steht jetzt in layouts.ts (EIN Eintrag je Sprache,
 * leer erlaubt). Hat die Hauptsprache eines Weges noch keine eigenen Tastaturen (leerer Eintrag),
 * gilt der Weg als ohne Einschränkung - nicht als „keine einzige Tastatur zur Wahl".
 */
export function tastaturenDesWeges(lernweg: Lernweg): ReadonlySet<LayoutId> | null {
  const haupt = lernwegDef(lernweg).hauptsprache;
  if (!haupt) return null;
  const menge = TASTATUREN_DER_SPRACHE[haupt];
  return menge.size > 0 ? menge : null;
}

/** Passt diese Tastatur zum Weg? (Weg ohne Einschränkung: immer.) */
export function tastaturPasstZumWeg(layoutId: LayoutId, lernweg: Lernweg): boolean {
  const erlaubt = tastaturenDesWeges(lernweg);
  return erlaubt === null || erlaubt.has(layoutId);
}

/**
 * Die Tastaturen, die Einrichtung und Zahnrad auf diesem Weg ANBIETEN: die
 * sichtbaren (Probe-Schalter, `sichtbareLayouts`), auf einem Weg mit
 * Hauptsprache nur die seiner Länder.
 */
export function tastaturenFuerWeg(
  lernweg: Lernweg,
  franzoesischLehrgangAn: boolean,
  spanischLehrgangAn: boolean,
  // ★ F3-it (02.10.2026): die Schalter der weiteren Sprachen (`{ it: true }` hinter
  // `?italienisch-lehrgang=1`) - ohne Angabe wie bisher: ihre Tastaturen bleiben unsichtbar.
  weitereLehrgaengeAn: Readonly<Partial<Record<Lang, boolean>>> = {},
): readonly KeyboardLayout[] {
  const erlaubt = tastaturenDesWeges(lernweg);
  // Ein Kind, das schon auf Weg „fr"/„es" steht, bekommt dessen Tastaturen
  // auch ohne Probe-Schalter - sonst stünde hier eine leere Liste.
  // ★ F3-it: in der Reihenfolge der Menge des Weges (Weg „it": zuerst Italien, dann das Tessin) - für fr
  // und es ist das dieselbe Reihenfolge wie in `LAYOUTS`.
  if (erlaubt) return [...erlaubt].flatMap((id) => LAYOUTS.filter((l) => l.id === id));
  return sichtbareLayouts(franzoesischLehrgangAn, spanischLehrgangAn, weitereLehrgaengeAn);
}
