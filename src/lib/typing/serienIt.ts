/**
 * Sammelstelle der ITALIENISCHEN Serien (Lernweg „it"), wie `serienEs.ts`: hängt die Chargen aneinander, append-only.
 *
 * IT-S (03.10.2026): die ersten Fortsetzungsgeschichten (`serienItKids1.ts`, `serienItTeens1.ts`, `serienItErwachsen1.ts`)
 * werden hier auf ECHTE `Serie`-Objekte gebracht und über das Sprachpaket `it` (`sprachpaketIt.ts`) und `SERIEN_FOLGE`
 * (`serien.ts`) angeschlossen. `nurEingehaengt` filtert Entwürfe ohne `minTier` heraus (eine Serie mit einer nie
 * freischaltbaren Zeile) und WIRFT, wenn eine solche nicht in `ERWARTET_ZURUECKGEHALTEN` steht - ein Filter, der nichts
 * meldet, sähe aus wie eine Behebung ([[feedback_gruener_waechter_beweist_was]]).
 */
import type { Serie } from "./serie";
import { SERIEN_IT_KIDS_1 } from "./serienItKids1";
import { SERIEN_IT_TEENS_1 } from "./serienItTeens1";
import { SERIEN_IT_ERWACHSEN_1 } from "./serienItErwachsen1";

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
        `serienIt.ts: "${slug}" hat kein minTier, steht aber nicht in ERWARTET_ZURUECKGEHALTEN - ` +
          `Liste nachziehen oder die Serie prüfen.`,
      );
    }
  }
  return drin;
}

// Reihenfolge = Reihenfolge des Zusammenführens (append-only): Kinder, Jugend, Erwachsene.
export const SERIEN_IT: Serie[] = [
  ...nurEingehaengt(SERIEN_IT_KIDS_1),
  ...nurEingehaengt(SERIEN_IT_TEENS_1),
  ...nurEingehaengt(SERIEN_IT_ERWACHSEN_1),
];
