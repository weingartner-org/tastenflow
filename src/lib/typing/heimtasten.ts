/**
 * ★★★ G3a-SCHRIFT (25.10.2026, Leitfaden Falle 41): DIE HEIMTASTEN EINES WEGES - die Zeichen auf den Tasten mit den
 * Fühlmarken (`KeyF`, `KeyJ`), nicht die Buchstaben „f" und „j".
 *
 * Bis hierher stand an mehreren Stellen fest `["f", "j"]` (Rückfall des Generators, erste Lektion `einheiten: ["f","j"]`
 * in jedem `curriculumXx.ts`, der Wächter „die ersten zwei Einheiten sind f j"). Auf jeder lateinischen Tastatur der
 * acht Wege bis zum 25.10.2026 (QWERTZ, QWERTY, AZERTY, QZERTY, türkisch Q) liegen dort f und j - auf der bulgarischen
 * Bezugstastatur (BDS, auch Schreibmaschine) aber `о т`, auf der ukrainischen `а о`, auf der griechischen `φ ξ`
 * (Windows-Tabellen `pc-messung/DLL-TABELLEN-8-SPRACHEN.txt`, Baupläne BG/UK/EL §1-2).
 *
 * Die HAUPTTASTATUR eines Weges ist die erste seiner Tastaturen (`tastaturenDesWeges`, Reihenfolge der Menge in
 * `TASTATUREN_DER_SPRACHE` - für it zuerst Italien, für fr zuerst Frankreich). Ein Weg ohne eigene Tastaturen (de, en,
 * die neun Wege des Gerüsts, solange ihre Tastaturen fehlen) behält `f j` - wie vorher.
 */
import { tasteFuerCode } from "./anschlagDeuten";
import { LAYOUTS, TASTATUREN_DER_SPRACHE, type KeyboardLayout, type LayoutId } from "./layouts";
import type { Lernweg } from "./lernweg";
import { tastaturenDesWeges } from "./wegTastaturen";

/** Die Heimtasten jeder lateinischen Tastatur - der Rückfall für Wege ohne eigene Tastatur. */
export const HEIMZEICHEN_LATEIN: readonly [string, string] = Object.freeze(["f", "j"]) as readonly [string, string];

/** Die Zeichen (Grundebene, klein) auf `KeyF` und `KeyJ` dieser Tastatur - `null`, wenn eine der Tasten fehlt. */
export function heimZeichenDerTastatur(layout: KeyboardLayout): readonly [string, string] | null {
  const f = tasteFuerCode(layout, "KeyF");
  const j = tasteFuerCode(layout, "KeyJ");
  return f && j ? [f, j] : null;
}

/** ★ F4-KYR-GR: die Tastaturen der Sprache, die wie der Weg heisst - `null`, wenn es keine gibt (de, en). */
function eigeneMengeDesWeges(weg: Lernweg): ReadonlySet<LayoutId> | null {
  const menge = (TASTATUREN_DER_SPRACHE as Readonly<Partial<Record<string, ReadonlySet<LayoutId>>>>)[weg];
  return menge && menge.size > 0 ? menge : null;
}

/** Die Haupttastatur eines Weges - die erste seiner Tastaturen, oder `null` (Weg ohne eigene Tastaturen). */
export function hauptTastaturDesWeges(weg: Lernweg): KeyboardLayout | null {
  // ★ F4-KYR-GR (25.10.2026): `tastaturenDesWeges` kennt die Tastaturen erst über die HAUPTSPRACHE des Weges - die neun Wege
  // haben nach F4 ihre eigene Reihenfolge, aber noch keine Hauptsprache (die kommt mit dem Wortschatz). Ohne Hauptsprache gilt
  // darum die Tastatur-Menge der gleichnamigen Sprache (`TASTATUREN_DER_SPRACHE.bg` …); für de/en ist sie leer (wie vorher
  // `f j`), für die acht Wege bis zum 25.10.2026 ändert sich nichts (alle haben eine Hauptsprache oder eine leere Menge).
  const ids = tastaturenDesWeges(weg) ?? eigeneMengeDesWeges(weg);
  if (!ids) return null;
  for (const id of ids) {
    const l = LAYOUTS.find((x) => x.id === id);
    if (l) return l;
  }
  return null;
}

/**
 * Die Heimtasten des Weges: die Zeichen auf `KeyF`/`KeyJ` seiner Haupttastatur; ohne eigene Tastatur (oder ohne Weg)
 * `f j`. Für die acht Wege bis zum 25.10.2026 ist das `f j` (Wächter `tastenflow-g3a-schrift-heimtasten`).
 */
export function heimZeichenDesWeges(weg: Lernweg | undefined): readonly [string, string] {
  if (weg === undefined) return HEIMZEICHEN_LATEIN;
  const l = hauptTastaturDesWeges(weg);
  return (l && heimZeichenDerTastatur(l)) ?? HEIMZEICHEN_LATEIN;
}
