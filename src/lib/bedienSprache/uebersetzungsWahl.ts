/**
 * ★★★ E11b (26.09.2026): DIE WAHL DER ÜBERSETZTEN FASSUNG - EINE TABELLE
 * STATT EINER WEICHE JE SPRACHE.
 *
 * Die Rechtstexte und die Hilfe-Dialoge lagen bisher als eigene Datei neben
 * dem Deutschen (`Datenschutz.en.tsx`, `TippenHilfe.en.tsx` …) und wählten
 * sie über eine einzelne Ternäre, die `sprache` eigens gegen „en" prüfte
 * (`<…Englisch /> : <…Deutsch />`, EN6b-EN8). Eine dritte Sprache dort als
 * zweite, gleich gebaute Ternäre anzuhängen wäre dieselbe Bauart, vor der
 * der Bauplan warnt (§2.3 Punkt 3: „x === 'en' ? A : B" vermehrt sich
 * still) - auch wenn dieser Vergleich gegen „fr" statt „en" läuft und vom
 * Weichen-Zähler (`tests/tastenflow-sprach-weichen.test.ts`, zählt nur
 * Ternären, die eigens gegen „en" prüfen) nicht mitgezählt wird.
 *
 * Diese kleine Funktion ersetzt die Weiche durch eine Tabelle: eine vierte
 * Sprache bekommt später einen neuen Tabelleneintrag an jeder Aufrufstelle,
 * nie eine neue Zeile Code.
 *
 * ⚠️ BEWUSST MIT DER WIRKLICHEN SPRACHWAHL (`spracheGewaehlt`), NICHT DER
 * OBERFLÄCHEN-SICHEREN `sprache` ({@link import("./sprache").AktiveBedienSprache}):
 * `sprache` bildet „fr" seit E2b auf „en" ab, weil die übrige Oberfläche
 * „fr" noch nicht kennt ({@link import("./sprache").oberflaechenSprache}). Genau
 * an den sechs Stellen, die diese Funktion aufrufen (die drei Rechtstexte und
 * die drei Hilfe-Dialoge), gibt es seit E11b aber echten französischen Text -
 * er soll erscheinen, sobald „fr" wirklich gewählt ist (`spracheGewaehlt`),
 * nicht erst mit der grossen Freischaltung der übrigen Oberfläche (E11a-2).
 */
import type { BedienSprache } from "./sprache";

/** Übersetzungen für alle Sprachen ausser Deutsch - Deutsch bleibt die Grundfassung des Aufrufers. */
export type Uebersetzungen<T> = Partial<Record<Exclude<BedienSprache, "de">, T>>;

/**
 * Liefert die passende Übersetzung zur wirklich gewählten Sprache - oder
 * `undefined`, wenn Deutsch gilt. Der Aufrufer zeigt dann seine deutsche
 * Grundfassung.
 *
 * ★ G3c (25.10.2026, neun neue Wege): Hat eine Sprache (noch) keine eigene
 * Fassung, gilt die englische - nie still Deutsch (Falle 30), wie `texte()`
 * seit E2b. Heute trifft das nur bg, el, hu, nl, pt, br, ro, sv, uk; alle
 * älteren Sprachen haben an jeder Aufrufstelle einen eigenen Eintrag.
 */
export function waehleUebersetzung<T>(
  spracheGewaehlt: BedienSprache,
  uebersetzungen: Uebersetzungen<T>,
): T | undefined {
  if (spracheGewaehlt === "de") return undefined;
  return uebersetzungen[spracheGewaehlt] ?? uebersetzungen.en;
}
