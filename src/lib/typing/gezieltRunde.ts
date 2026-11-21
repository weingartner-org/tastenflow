/**
 * ★ GEZIELT ÜBEN (13.11.2026, Bauplan §3): aus der Einstellung (`Gezielt`) die Zeichen und Einheiten für EINE Runde machen.
 *
 * Zeichen, die auf der eingestellten Tastatur nicht erreichbar sind, fallen still heraus. Noch nicht gelernte Einheiten
 * werden VORGEZOGEN: sie kommen nur für den Rundenbau in die erlaubte Menge - nie in `progress.introduced`.
 */
import type { Gezielt, GezieltAnteil } from "./gezielt";
import { fingerForChar } from "./fingers";
import { activeLayout, layoutSprache } from "./layouts";
import { introOrder } from "./letters";
import { kleinFuer } from "./sprachRegister";
import type { Lernweg } from "./lernweg";
import { kombizeichenZu } from "./totasten";

export interface GezieltRunde {
  /** Für `AdaptiveOptions.gezielt` - nur erreichbare Zeichen. */
  gezielt: { zeichen: string[]; anteil: GezieltAnteil };
  /** `introduced` PLUS vorgezogene Einheiten - NUR für den Aufruf von `adaptiveRound` gedacht. */
  introFuerRunde: string[];
  /** Die Zeichen dieser Einstellung, die noch nicht gelernt sind (für die einmalige Vorstellung, Etappe B). */
  vorgezogen: string[];
}

/** Die Einheiten, die ein Zeichen braucht (das Zeichen selbst, oder Totaste + Buchstabe); leer = nicht lehrbar auf diesem Weg. */
function einheitenFuer(zeichen: string, lernweg: Lernweg): string[] {
  const folge = introOrder(lernweg);
  if (folge.includes(zeichen)) return [zeichen];
  const k = kombizeichenZu(zeichen, activeLayout());
  if (k) {
    const u = [k.tot, k.dann].filter((e) => folge.includes(e));
    if (u.length === 2) return u;
  }
  return [];
}

/** `null`, wenn nach dem Aussortieren nichts übrig bleibt (dann läuft die Runde ganz gewöhnlich). */
export function gezieltFuerRunde(g: Gezielt | null | undefined, intro: readonly string[], lernweg: Lernweg): GezieltRunde | null {
  if (!g || g.zeichen.length === 0) return null;
  const sprache = layoutSprache();
  const zeichen: string[] = [];
  const vorgezogen: string[] = [];
  const zusatz: string[] = [];
  for (const roh of g.zeichen) {
    const z = kleinFuer(roh, sprache);
    if (zeichen.includes(z) || !fingerForChar(z)) continue;
    const einheiten = einheitenFuer(z, lernweg);
    if (einheiten.length === 0) continue;
    zeichen.push(z);
    const fehlt = einheiten.filter((e) => !intro.includes(e));
    if (fehlt.length > 0) {
      vorgezogen.push(z);
      for (const e of fehlt) if (!zusatz.includes(e)) zusatz.push(e);
    }
  }
  if (zeichen.length === 0) return null;
  return { gezielt: { zeichen, anteil: g.anteil }, introFuerRunde: [...intro, ...zusatz], vorgezogen };
}
