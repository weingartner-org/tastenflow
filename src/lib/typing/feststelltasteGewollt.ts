import type { KeyboardLayout } from "./layouts";
import { activeLayout, capsUpperFuer, layoutSprache } from "./layouts";
import { kleinFuer } from "./sprachRegister";

/**
 * Ist die Feststelltaste für diesen GROSSBUCHSTABEN ein richtiger Weg?
 *
 * ★ Anlass (Jasmin Föhner, Zürich, 29.10.2026): „Auf der Schweizer Tastatur
 * können die Umlaute nur mit der Feststelltaste geschrieben werden" - und bei
 * jedem Ä Ö Ü ging das Feststelltasten-Fenster auf, obwohl das Zeichen richtig
 * entstanden war und angenommen wurde.
 *
 * Gewollt ist die Feststelltaste dort, wo Umschalt auf der Taste des
 * Kleinbuchstabens ein ANDERES Zeichen gibt (Schweiz: Umschalt + ö = é) oder
 * die Tastatur sie ausdrücklich führt (`capsUpper`, Mac). Auf der deutschen
 * Tastatur gibt Umschalt + ö das Ö - dort bleibt das Fenster wie bisher
 * (Johannes 12.10.2026: bei jedem Buchstaben).
 */
export function feststelltasteGewollt(zeichen: string, layout: KeyboardLayout = activeLayout()): boolean {
  if (!/^\p{Lu}$/u.test(zeichen)) return false;
  const klein = kleinFuer(zeichen, layoutSprache(layout));
  if (klein === zeichen) return false;
  if (capsUpperFuer(layout).includes(klein)) return true;
  return Object.entries(layout.access).some(
    ([ch, zugang]) => zugang.base === klein && zugang.mod === "shift" && ch !== zeichen,
  );
}
