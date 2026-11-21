/**
 * Sammelstelle der Serien des Weges „hu" (Ungarisch), wie `serienCs.ts`: hängt die Chargen aneinander, append-only (W3, 30.10.2026).
 * Je 12 Serien für Kinder, Jugend, Erwachsene, neu in der Sprache geschrieben (`serienHuKids1.ts`, `serienHuTeens1.ts`, `serienHuErwachsen1.ts`, Typ `serienHuNlRoTyp.ts`).
 * `nurEingehaengt` filtert Entwürfe ohne `minTier` und WIRFT, wenn eine solche nicht in `ERWARTET_ZURUECKGEHALTEN` steht.
 * Verteiler: `sprachpaketHu.ts` und `SERIEN_FOLGE` in `serien.ts` (stehen schon). Wächter: `tests/tastenflow-serien-hu.test.ts`, Befund `BEFUND-2026-10-30-W3-HU-NL-RO.md`.
 * Serien tragen KEINE Korpus-Anker-ID: eine neue Serie ändert weder den Anker noch das Manifest des Ledgers.
 *
 * ⚠️ DATENBLATT: nur Daten und Typen.
 */
import type { Serie } from "./serie";
import { SERIEN_HU_KIDS_1 } from "./serienHuKids1";
import { SERIEN_HU_TEENS_1 } from "./serienHuTeens1";
import { SERIEN_HU_ERWACHSEN_1 } from "./serienHuErwachsen1";

/** Slugs, die ABSICHTLICH kein `minTier` tragen. Heute leer. */
const ERWARTET_ZURUECKGEHALTEN = new Set<string>([]);

function nurEingehaengt<T extends { slug: string; minTier?: unknown }>(entwuerfe: readonly T[]): Serie[] {
  const drin: Serie[] = [];
  for (const e of entwuerfe) {
    if (e.minTier !== undefined) drin.push(e as unknown as Serie);
    else if (!ERWARTET_ZURUECKGEHALTEN.has(e.slug)) throw new Error(`serienHu.ts: "${e.slug}" hat kein minTier und steht nicht in ERWARTET_ZURUECKGEHALTEN.`);
  }
  return drin;
}

// Reihenfolge = Reihenfolge des Zusammenführens (append-only): Kinder, Jugend, Erwachsene.
export const SERIEN_HU: Serie[] = [
  ...nurEingehaengt(SERIEN_HU_KIDS_1),
  ...nurEingehaengt(SERIEN_HU_TEENS_1),
  ...nurEingehaengt(SERIEN_HU_ERWACHSEN_1),
];
