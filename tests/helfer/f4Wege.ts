/**
 * ★★★ F4-HU-RO-NL (25.10.2026): gemeinsame Prüfungen der Reihenfolge-Wächter `tastenflow-lernweg-{hu,ro,nl}-reihenfolge`
 * (Vorbild `tastenflow-lernweg-cs-reihenfolge.test.ts`, Fallen 34, 37, 41, 68-71).
 */
import { fitText } from "../../src/lib/typing/corpus";
import { layoutById, layoutIndex, setLayout, type KeyboardLayout, type LayoutId } from "../../src/lib/typing/layouts";
import type { Lernweg } from "../../src/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "../../src/lib/typing/letters";
import { allowedFromIntroduced } from "../../src/lib/typing/serien";
import { kombizeichenFuerLayout } from "../../src/lib/typing/totasten";

/**
 * Hat das Zeichen auf dieser Tastatur einen Griff? Eigene Taste, ein Eintrag in `access` (Umschalt, AltGr, Totaste allein) ODER ein
 * Kombizeichen der Tastatur (Totaste + Grundbuchstabe, z. B. `ë` = `"` + e auf US-International). `⇧` hat immer einen.
 */
export function hatGriff(layout: KeyboardLayout, zeichen: string): boolean {
  if (zeichen === SHIFT_UNIT) return true;
  if (layout.rows.some((r) => r.keys.includes(zeichen))) return true;
  if (layout.access[zeichen] !== undefined) return true;
  return kombizeichenFuerLayout(layout).some((k) => k.zeichen === zeichen && k.nurOhneEigeneTaste !== true);
}

/** Liegt das Zeichen auf einer eigenen Taste OHNE Zusatztaste und ohne Totaste? */
export function eigeneTaste(layout: KeyboardLayout, zeichen: string): boolean {
  const a = layout.access[zeichen];
  return layout.rows.some((r) => r.keys.includes(zeichen)) && a?.mod === undefined && a?.dead !== true;
}

/** Die Heimtasten (Grundreihe, Zeile 2) der acht Finger auf dieser Tastatur - aus den Daten. */
export function heimReihe(layout: KeyboardLayout): string[] {
  if (layout.heimtasten) return [...layout.heimtasten];
  const reihe = layout.rows[2].keys;
  // Belgisch AZERTY trägt keine eigenen Heimtasten: q s d f | j k l m (die ersten vier und die Tasten 6-9 der Grundreihe).
  return [reihe[0], reihe[1], reihe[2], reihe[3], reihe[6], reihe[7], reihe[8], reihe[9]];
}

/**
 * Falle 37: Zeugen. Jedes Wort geht mit dem ECHTEN Tastenstand bis zu seiner Einheit (`allowedFromIntroduced(introOrder(weg).slice)`)
 * durch `fitText` - und einen Schritt davor nicht. Gibt die Fehler zurück (leer = gut).
 */
export function zeugenFehler(weg: Lernweg, layout: LayoutId, zeugen: Readonly<Record<string, string>>): string[] {
  setLayout(layout);
  const o = introOrder(weg);
  const fehler: string[] = [];
  for (const [einheit, wort] of Object.entries(zeugen)) {
    const k = o.indexOf(einheit);
    if (k < 0) {
      fehler.push(`${layout}: ${einheit} fehlt in der Folge`);
      continue;
    }
    if (!wort.includes(einheit)) fehler.push(`„${wort}" enthält ${einheit} nicht`);
    const mit = allowedFromIntroduced(o.slice(0, k + 1), weg);
    const davor = allowedFromIntroduced(o.slice(0, k), weg);
    if (fitText(wort, mit, weg, weg) !== wort) fehler.push(`${layout}: „${wort}" geht nicht an der Sprosse von ${einheit} (${fitText(wort, mit, weg, weg)})`);
    if (fitText(wort, davor, weg, weg) !== null) fehler.push(`${layout}: „${wort}" geht schon VOR ${einheit}`);
  }
  return fehler;
}

/** Die Einheiten, die auf dieser Tastatur eine Zusatztaste oder Totaste brauchen (oder keine eigene Taste haben). */
export function brauchtMehrAlsEineTaste(layout: KeyboardLayout, u: string): boolean {
  if (u === SHIFT_UNIT) return false;
  return !eigeneTaste(layout, u);
}

/** Prüft, dass `layoutIndex` jede Einheit einem Finger zuordnet, die auf einer eigenen Taste liegt (die Ansage braucht ihn). */
export function fingerFehlt(layoutId: LayoutId, einheiten: readonly string[]): string[] {
  const l = layoutById(layoutId);
  const idx = layoutIndex(l);
  return einheiten.filter((u) => u !== SHIFT_UNIT && l.rows.some((r) => r.keys.includes(u)) && !idx.finger.get(u));
}

