/**
 * Sammelstelle der TÜRKISCHEN Serien (Lernweg „tr"), wie `serienIt.ts`: hängt die Chargen aneinander, append-only.
 *
 * TR-S (09.10.2026): die ersten Fortsetzungsgeschichten (`serienTrKids1.ts`, `serienTrTeens1.ts`, `serienTrErwachsen1.ts`)
 * werden hier auf ECHTE `Serie`-Objekte gebracht und über das Sprachpaket `tr` (`sprachpaketTr.ts`) und `SERIEN_FOLGE`
 * (`serien.ts`) angeschlossen. `nurEingehaengt` filtert Entwürfe ohne `minTier` heraus (eine Serie mit einer nie
 * freischaltbaren Zeile) und WIRFT, wenn eine solche nicht in `ERWARTET_ZURUECKGEHALTEN` steht - ein Filter, der nichts
 * meldet, sähe aus wie eine Behebung ([[feedback_gruener_waechter_beweist_was]]).
 *
 * Serien tragen KEINE Korpus-Anker-ID (`scripts/erzeuge-korpus-anker.mts` liest nur den Korpus): eine neue Serie ändert
 * weder den Anker noch das Manifest des Ledgers.
 */
import type { Serie } from "./serie";
import { SERIEN_TR_KIDS_1 } from "./serienTrKids1";
import { SERIEN_TR_TEENS_1 } from "./serienTrTeens1";
import { SERIEN_TR_ERWACHSEN_1 } from "./serienTrErwachsen1";

/** Slugs, die ABSICHTLICH kein `minTier` tragen (mit Begründung im Befund). Heute leer. */
const ERWARTET_ZURUECKGEHALTEN = new Set<string>([]);

function nurEingehaengt<T extends { slug: string; minTier?: unknown }>(entwuerfe: readonly T[]): Serie[] {
  const draussen: string[] = [];
  const drin: Serie[] = [];
  for (const e of entwuerfe) {
    if (e.minTier === undefined) draussen.push(e.slug);
    else drin.push(e as unknown as Serie);
  }
  for (const slug of draussen) {
    if (!ERWARTET_ZURUECKGEHALTEN.has(slug)) {
      throw new Error(
        `serienTr.ts: "${slug}" hat kein minTier, steht aber nicht in ERWARTET_ZURUECKGEHALTEN - ` +
          `Liste nachziehen oder die Serie prüfen.`,
      );
    }
  }
  return drin;
}

// Reihenfolge = Reihenfolge des Zusammenführens (append-only): Kinder, Jugend, Erwachsene.
export const SERIEN_TR: Serie[] = [
  ...nurEingehaengt(SERIEN_TR_KIDS_1),
  ...nurEingehaengt(SERIEN_TR_TEENS_1),
  ...nurEingehaengt(SERIEN_TR_ERWACHSEN_1),
];
