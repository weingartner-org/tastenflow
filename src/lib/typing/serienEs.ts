/**
 * Sammelstelle der SPANISCHEN Serien (Lernweg „es"), wie `serienFrZusatz.ts`
 * für Französisch: hängt die einzelnen Chargen aneinander, append-only.
 *
 * ES-S (27.09.2026, Bauplan `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md`):
 * die erste Charge Fortsetzungsgeschichten (`serienEsKids1.ts`,
 * `serienEsTeens1.ts`, `serienEsErwachsen1.ts`, je 20 Serien, 27.09.2026) wird
 * hier auf ECHTE `Serie`-Objekte gebracht und an `SERIEN` (serien.ts)
 * gehängt.
 *
 * ⚠️ Nicht jeder Entwurf hat ein `minTier` - fünf Serien bleiben vorerst
 * DRAUSSEN (Auftrag: „Text nicht umschreiben, Fundstelle im Befund nennen,
 * der Chat entscheidet"), siehe `BEFUND-2026-09-27-ES-S-SERIEN-EINHAENGEN.md`:
 *  - DREI enthalten ein Apostroph in einem Wort mit Maya-Ursprung (ma'alob,
 *    tz'utujil, yuum bo'otik) - der Apostroph steht in keiner Ordnung des
 *    Weges „es" (`lernweg.ts`, `ES_PUNCT_ORDER`/`ES_SYMBOL_ORDER`) und ist
 *    damit NIE freischaltbar; `computeSerieMinTier` liefert `null`.
 *  - ZWEI nennen einen Preis in Euro ("€") - auf der Tastatur LATAM ist das
 *    Zeichen eine GEMESSENE, bewusste Lücke (`layouts.ts`, `missing: ["€"]`,
 *    "wie £ auf US"); die Serie wäre dort nie fehlerfrei tippbar, obwohl
 *    `computeSerieMinTier` (tastatur-unabhängig) einen Wert liefert.
 *
 * `nurEingehaengt` filtert genau danach (ein Entwurf mit `minTier` IST schon
 * eine vollständige `Serie` - `land`/`ort`/`eigennamen` sind für `Serie`
 * überzählige, aber erlaubte Felder) und wacht zugleich darüber, dass genau
 * die ERWARTETEN Serien draussen bleiben: ändert sich die Zahl - weil eine
 * künftige Charge eine weitere unfreischaltbare Zeile einträgt, oder weil
 * jemand die drei oben von Hand nachträgt, ohne die Liste hier zu pflegen -,
 * wirft die Funktion beim Laden, statt eine Serie still zu verschlucken
 * ([[feedback_gruener_waechter_beweist_was]]: ein Filter, der nichts meldet,
 * sieht aus wie eine Behebung).
 */
import type { Serie } from "./serie";
import { SERIEN_ES_KIDS_1 } from "./serienEsKids1";
import { SERIEN_ES_TEENS_1 } from "./serienEsTeens1";
import { SERIEN_ES_ERWACHSEN_1 } from "./serienEsErwachsen1";

/**
 * Slugs, die ABSICHTLICH kein `minTier` tragen (Apostroph- und Euro-Falle, siehe Kopf).
 *
 * ★ D1 Nr. 13 (28.09.2026, Entscheidung Johannes): LEER. Die drei
 * Apostroph-Serien sind drin, seit `'` die letzte Zeichen-Sprosse des Weges
 * „es" ist; die zwei Euro-Serien schreiben ihre Preise aus („60 euros"). Die
 * Wache unten bleibt - eine künftige Charge ohne `minTier` wirft weiter.
 */
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
        `serienEs.ts: "${slug}" hat kein minTier, steht aber nicht in ERWARTET_ZURUECKGEHALTEN - ` +
          `Liste nachziehen oder die Serie prüfen (BEFUND-2026-09-27-ES-S-SERIEN-EINHAENGEN.md).`,
      );
    }
  }
  return drin;
}

// Reihenfolge = Reihenfolge des Zusammenführens (append-only): Kinder, Jugend, Erwachsene.
export const SERIEN_ES: Serie[] = [
  ...nurEingehaengt(SERIEN_ES_KIDS_1),
  ...nurEingehaengt(SERIEN_ES_TEENS_1),
  ...nurEingehaengt(SERIEN_ES_ERWACHSEN_1),
];
