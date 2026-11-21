/**
 * ★★★ WELCHE SPRACHPAKETE EIN WEG BRAUCHT - die EINE Stelle (28.09.2026).
 *
 * Johannes (28.09.2026): *„nur die sprache vom kind laden! und englische
 * texte kommen immer mit. in jeder sprache"*.
 *
 *  · Die Sprache des Weges: seine Hauptsprache (`hauptsprache` in der
 *    Lernweg-Definition, lernweg.ts), sonst die Sprache, für die er gebaut ist
 *    - beides liefert `uebungsSpracheImWeg` (account.ts), dieselbe Regel, nach
 *    der das Kind übt. Keine zweite Liste: Ein neuer Weg bringt seine Sprache
 *    über seine Definition mit.
 *  · Englisch immer dazu - es ist auf jedem Weg die zweite Übungssprache
 *    (Entscheidung Johannes Nr. 18, `uebungsSprachenImWeg`).
 *  · Und die Übungssprache, die das Kind gerade WIRKLICH hat, falls sie eine
 *    dritte ist: Auf Weg „de" und „en" sind Deutsch und Englisch frei wählbar
 *    (`LANGS`) - wer auf Weg „en" Deutsch übt, braucht das deutsche Paket.
 *
 * Ergebnis (Weg ⇒ Pakete, Wächter `tests/sprachpakete-inhalt.test.ts`): de ⇒ de + en · en ⇒ en (mit Übungssprache
 * Deutsch: en + de) · fr ⇒ fr + en · es ⇒ es + en.
 *
 * ★ G2a (02.10.2026): it, pl, tr, cs ⇒ bis zu ihrer eigenen Reihenfolge nur en
 * (ihr Weg ist ein Alias von „en" und übt Englisch, `WEG_GRUNDSPRACHE` in
 * account.ts). Ihre LEEREN Pakete (`sprachpaketIt|Pl|Tr|Cs.ts`) stehen schon im
 * Register (`LADER_VORGABE`); sobald ein Weg seine `hauptsprache` bekommt,
 * liefert dieselbe Regel hier „Weg + Englisch" - ohne dass hier etwas
 * nachzutragen ist.
 */
import { uebungsSpracheImWeg, type Lang } from "./account";
import type { Lernweg } from "./lernweg";

/** Englisch kommt auf jedem Weg mit (siehe Kopf). */
export const IMMER_DABEI: Lang = "en";

export function sprachPaketeFuer(lernweg: Lernweg, uebungsSprache?: Lang): Lang[] {
  const desWeges = uebungsSpracheImWeg(undefined, lernweg);
  const jetzt = uebungsSpracheImWeg(uebungsSprache, lernweg);
  return [...new Set<Lang>([desWeges, jetzt, IMMER_DABEI])];
}
