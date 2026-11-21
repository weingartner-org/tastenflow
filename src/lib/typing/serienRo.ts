/**
 * Sammelstelle der Serien des Weges „ro" (Rumänisch), wie `serienCs.ts`: hängt die Chargen aneinander, append-only (W3, 30.10.2026).
 * Je 12 Serien für Kinder, Jugend, Erwachsene, neu in der Sprache geschrieben (`serienRoKids1.ts`, `serienRoTeens1.ts`, `serienRoErwachsen1.ts`, Typ `serienHuNlRoTyp.ts`).
 * `nurEingehaengt` filtert Entwürfe ohne `minTier` und WIRFT, wenn eine solche nicht in `ERWARTET_ZURUECKGEHALTEN` steht.
 * Verteiler: `sprachpaketRo.ts` und `SERIEN_FOLGE` in `serien.ts` (stehen schon). Wächter: `tests/tastenflow-serien-ro.test.ts`, Befund `BEFUND-2026-10-30-W3-HU-NL-RO.md`.
 * Serien tragen KEINE Korpus-Anker-ID: eine neue Serie ändert weder den Anker noch das Manifest des Ledgers.
 *
 * ⚠️ DATENBLATT: nur Daten und Typen.
 */
import type { Serie } from "./serie";
import { SERIEN_RO_KIDS_1 } from "./serienRoKids1";
import { SERIEN_RO_TEENS_1 } from "./serienRoTeens1";
import { SERIEN_RO_ERWACHSEN_1 } from "./serienRoErwachsen1";

/** Slugs, die ABSICHTLICH kein `minTier` tragen. Heute leer. */
const ERWARTET_ZURUECKGEHALTEN = new Set<string>([]);

function nurEingehaengt<T extends { slug: string; minTier?: unknown }>(entwuerfe: readonly T[]): Serie[] {
  const drin: Serie[] = [];
  for (const e of entwuerfe) {
    if (e.minTier !== undefined) drin.push(e as unknown as Serie);
    else if (!ERWARTET_ZURUECKGEHALTEN.has(e.slug)) throw new Error(`serienRo.ts: "${e.slug}" hat kein minTier und steht nicht in ERWARTET_ZURUECKGEHALTEN.`);
  }
  return drin;
}

// Reihenfolge = Reihenfolge des Zusammenführens (append-only): Kinder, Jugend, Erwachsene.
export const SERIEN_RO: Serie[] = [
  ...nurEingehaengt(SERIEN_RO_KIDS_1),
  ...nurEingehaengt(SERIEN_RO_TEENS_1),
  ...nurEingehaengt(SERIEN_RO_ERWACHSEN_1),
];
