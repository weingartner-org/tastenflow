/**
 * ════════════════════════════════════════════════════════════════════════════
 * DIE SPRACHE DER ÖFFENTLICHEN SEITEN: /erleben, Sims, Hörbuch-Studio
 * (Bauplan 2026-11-06 §1c)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ★ HINTER DEM PROBE-SCHALTER `?sprachen-sims=1` (Not-Aus `=0`), Vorgabe AUS.
 *   Ohne Schalter: alles deutsch wie bis 06.11.2026, kein Sprachwähler, kein
 *   Blick auf die Browser-Sprache. Grund (Bauplan): Die Erkennung aus der
 *   Browser-Sprache würde deutschsprachige Besucher mit englischem Browser
 *   umschalten. Eingeschaltet wird nur auf Johannes' Wort.
 *
 * ★ BEWUSST EIN EIGENER KONTEXT, nicht der gemeinsame `BedienSpracheProvider`:
 *   Der merkt sich die Wahl unter `tastenflow-bedienung` und kennt die
 *   Tastenflow-Lehrgangsschalter. Eine Sprachwahl in einer Sim soll Tastenflow
 *   nicht umstellen (und umgekehrt). Die Texte bauen trotzdem auf `texte()`
 *   aus `lib/bedienSprache` (gemeinsamer Teil, unverändert benutzt).
 *
 * Wahl, in dieser Reihenfolge: `?sprache=xx` · gemerkte Wahl (`sims-sprache`)
 * · Browser-Sprache · Deutsch.
 */
import { type BedienSprache } from "@/lib/bedienSprache";
import {
  ALLE_SPRACHEN,
  SPRACH_SELBSTNAME as SELBSTNAME,
  anfangsSpracheAus,
  appSpracheBauen,
  browserSpracheAus,
} from "@/lib/appSprache";

export const SIMS_SPRACHEN_SCHALTER = "sprachen-sims";
export const SIMS_SPRACHE_MERKER = "sims-sprache";

/** Alle 17 Sprachen von Tastenflow, in der Reihenfolge des Sprachwählers. */
export const SIMS_SPRACHEN: readonly BedienSprache[] = ALLE_SPRACHEN;

/** Wie jede Sprache sich selbst nennt (gleich wie der Sprachwähler von Tastenflow). */
export const SPRACH_SELBSTNAME = SELBSTNAME;

/** Eine Browser-Sprache (`pt-BR`, `fr-CA`, `uk`) auf eine der 17 abbilden. */
export function ausBrowserSprache(tag: string): BedienSprache | null {
  return browserSpracheAus(tag, SIMS_SPRACHEN);
}

export function anfangsSimSprache(opts: {
  suche: string;
  gemerkt: string | null;
  browser: readonly string[];
}): BedienSprache {
  return anfangsSpracheAus(opts, SIMS_SPRACHEN);
}

const SIMS = appSpracheBauen({
  schalter: SIMS_SPRACHEN_SCHALTER,
  merker: SIMS_SPRACHE_MERKER,
  sprachen: SIMS_SPRACHEN,
});

export const simsSprachenAn = SIMS.schalterAn;
export const SimSpracheProvider = SIMS.Provider;
/** Die Sprache der öffentlichen Seite; außerhalb des Providers und ohne Schalter: `de`. */
export const useSimSprache = SIMS.useSprache;
export const useSimSpracheWert = SIMS.useWert;
/** Der Sprachwähler für die Kopfzeile der öffentlichen Seiten (ohne Schalter: nichts). */
export const SimSprachWaehler = SIMS.Waehler;

/**
 * Die Texte einer Sim in allen Sprachen. `de` ist der Bestand (Byte für Byte wie
 * bis 06.11.2026), `en` ist Pflicht; jede andere Sprache, die fehlt, fällt auf
 * Englisch - nie auf Deutsch. Jede Sprache hat dieselben Schlüssel wie `de`
 * (tsc prüft das).
 */
export function simTexte<T extends object>(
  tabelle: { de: T; en: T } & Partial<Record<BedienSprache, T>>,
): Readonly<Record<BedienSprache, T>> {
  const aus = {} as Record<BedienSprache, T>;
  for (const s of SIMS_SPRACHEN) aus[s] = tabelle[s] ?? tabelle.en;
  return aus;
}
