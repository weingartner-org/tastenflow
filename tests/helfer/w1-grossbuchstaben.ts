/**
 * ★ W1 (27.09.2026, BEFUND-2026-09-27-W1-WINDOWS-BLOCKER.md §3): Welche
 * französische Zeile ist von der W1-Regel für Grossbuchstaben betroffen?
 *
 * Johannes §3.8: Grossbuchstaben mit Akzent werden nicht mehr ersetzt
 * („À" statt „A"). Braucht die Tastatur für sie eine Totaste (Windows-AZERTY
 * À È Ù Ê …), kommt die Zeile erst, wenn deren Totaste bzw. AltGr-Griff
 * gelernt ist - ★ W2a (28.09.2026) je Zeichen (`grossAkzentEinheiten`,
 * corpus.ts), bis dahin mit der letzten Einheit des Weges. Erzeugt die Tastatur einen Grossbuchstaben gar nicht (AZERTY
 * É, Ç), kommt die Zeile auf ihr nie vor (auf Belgien, der Schweiz und in
 * Kanada schon).
 *
 * Die Inhalts-Wächter der französischen Texte rechnen die Sprosse einer Zeile
 * nur über die BUCHSTABEN aus - diese Zeilen nehmen sie darum aus und
 * verweisen hierher. Geprüft, dass die Regel wirkt, wird zentral in
 * `tests/tastenflow-w1-modelle-gegen-windows.test.ts`.
 */
import { layoutById, type LayoutId } from "../../src/lib/typing/layouts";
import { grossbuchstabeWeg } from "../../src/lib/typing/totasten";

/** „nie" (Grossbuchstabe fehlt der Tastatur), „spaet" (über Totaste, späte Lektion) oder `null`. */
export function w1GrossArt(text: string, layoutId: LayoutId = "fr"): "nie" | "spaet" | null {
  const lay = layoutById(layoutId);
  let spaet = false;
  for (const c of text) {
    const weg = grossbuchstabeWeg(c, lay);
    if (weg === "fehlt") return "nie";
    if (weg === "totaste") spaet = true;
  }
  return spaet ? "spaet" : null;
}

/** Trägt eine Serie eine Zeile, die auf dieser Tastatur NIE vorkommt (É/Ç auf AZERTY)? */
export function w1SerieNie(s: { etappen: { lines: string[] }[] }, layoutId: LayoutId = "fr"): boolean {
  return s.etappen.some((e) => e.lines.some((z) => w1GrossArt(z, layoutId) === "nie"));
}

/** Trägt eine Serie mindestens eine solche Zeile? */
export function w1SerieBetroffen(s: { etappen: { lines: string[] }[] }, layoutId: LayoutId = "fr"): boolean {
  return s.etappen.some((e) => e.lines.some((z) => w1GrossArt(z, layoutId) !== null));
}
