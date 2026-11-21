/**
 * ★★★ W3 (30.10.2026): die Regeln der Serien der Wege hu, nl, ro - eine Stelle für das Werkzeug `scripts/pruefe-serien-neu.mts` und die Wächter
 * `tests/tastenflow-serien-{hu,nl,ro}.test.ts`. Vorbild: `csSerienRegeln.ts` (kleiner: ohne Belegliste je Wort, ohne Naht-Prüfung je gekürzter Fassung - Befund).
 */
import { fitText } from "../../src/lib/typing/corpus";
import { setLayout, type LayoutId } from "../../src/lib/typing/layouts";
import { introOrder } from "../../src/lib/typing/letters";
import { allowedFromIntroduced } from "../../src/lib/typing/serien";
import { computeSerieMinTier, validateSerie, type Serie } from "../../src/lib/typing/serie";
import { GEGENDEN } from "../../src/lib/typing/serienHuNlRoTyp";
import { halbesPaar } from "./paareNeueWege";
import { lernwegDef } from "../../src/lib/typing/lernweg";
import { tastaturenDes, zeilenFehler, type RetoWeg } from "./retoHuNlRo";

export type Stufe = "kids" | "teens" | "erwachsen";
export const BEZUG: Record<RetoWeg, LayoutId> = { hu: "hu", nl: "nl-intl", ro: "ro" };

const GRENZE: Record<Stufe, { min: number; max: number; maxZeichen?: number }> = {
  kids: { min: 4, max: 16 },
  teens: { min: 4, max: 18 },
  erwachsen: { min: 5, max: 18, maxZeichen: 90 },
};
const woerter = (z: string) => z.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

/** Alle Verstösse einer Zeile (leer = in Ordnung). */
export function zeilenBefunde(weg: RetoWeg, stufe: Stufe, z: string): string[] {
  const f = zeilenFehler(weg, z);
  const g = GRENZE[stufe];
  const n = woerter(z).length;
  if (n < g.min || n > g.max) f.push(`${n} Wörter (${g.min}-${g.max})`);
  if (g.maxZeichen && z.length > g.maxZeichen) f.push(`${z.length} Zeichen (höchstens ${g.maxZeichen})`);
  if (stufe === "kids" && /\d/.test(z)) f.push("Ziffer in einer Kinder-Serie");
  if (!/^["„(]?\p{Lu}|^["„(]?\d/u.test(z)) f.push("beginnt nicht gross");
  if (!/[.?!:]["”)]?$/.test(z) && !/[.?!]["”)]?,? /.test(z.slice(-1))) f.push("kein Satzschluss");
  if (halbesPaar(z, lernwegDef(weg).paareGemeinsam ?? {})) f.push("halbes Paar (Anführung oder Klammer)");
  // Der Bindestrich fiele vor seiner Sprosse weg (auf ro steht er direkt nach der Umschalttaste und ist Teil der Wörter: s-a, într-o).
  if (z.includes("-") && weg !== "ro") f.push("Bindestrich");
  if (/\d\.$/.test(z)) f.push("Ziffer und Punkt am Zeilenende (die Stimme läse eine Ordnungszahl)");
  return f;
}

export interface SerieRoh {
  slug: string; titel: string; stufen: string[]; lang: string; nurWeg: string; land: string; ort: string; eigennamen: string[]; minTier?: number;
  herkunft?: { quelle: string; lizenz: string }; etappen: { lines: string[] }[]; kind: string; topic: string;
}

/** Alle Verstösse einer Serie gegen die Form. */
export function serienBefunde(weg: RetoWeg, stufe: Stufe, s: SerieRoh): string[] {
  const f: string[] = [];
  if (!s.slug.startsWith(`${weg}-${stufe}-1-`)) f.push("Slug");
  if (s.stufen.length !== 1 || s.stufen[0] !== stufe) f.push("Stufe");
  if (s.lang !== weg || s.nurWeg !== weg) f.push("Weg");
  if (s.kind !== "geschichte" || !s.topic) f.push("kind/topic");
  if (s.herkunft?.lizenz !== "Eigenes Werk") f.push("Herkunft");
  if (!(GEGENDEN[weg] as readonly string[]).includes(s.land)) f.push(`Gegend ${s.land}`);
  if (s.etappen.length < 2 || s.etappen.length > 3) f.push(`${s.etappen.length} Etappen`);
  s.etappen.forEach((e, i) => {
    if (e.lines.length < 14 || e.lines.length > 16) f.push(`Etappe ${i}: ${e.lines.length} Zeilen`);
    if (i < s.etappen.length - 1 && !/[?!]["”]?$/.test(e.lines[e.lines.length - 1])) f.push(`Etappe ${i}: Fortsetzung endet nicht auf ? oder !`);
    for (const z of e.lines) for (const b of zeilenBefunde(weg, stufe, z)) f.push(`${b}: ${z}`);
  });
  const voll = s.etappen.flatMap((e) => e.lines).join(" ");
  for (const n of s.eigennamen) if (!voll.includes(n)) f.push(`Eigenname kommt nicht vor: ${n}`);
  return f;
}

/** Griff: jede Zeile ist am Ende der Folge auf jeder Tastatur des Weges ungekürzt tippbar. */
export function griffBefunde(weg: RetoWeg, s: SerieRoh): string[] {
  const f: string[] = [];
  for (const id of tastaturenDes(weg)) {
    setLayout(id);
    const alle = allowedFromIntroduced(introOrder(weg), weg);
    for (const e of s.etappen) for (const z of e.lines) {
      setLayout(id);
      if (fitText(z, alle, weg) !== z) f.push(`auf ${id} nicht ganz tippbar: ${z}`);
    }
  }
  setLayout("de");
  return f;
}

/** Das gerechnete `minTier` auf der Bezugstastatur. */
export function minTierVon(weg: RetoWeg, s: SerieRoh): number | null {
  setLayout(BEZUG[weg]);
  const t = computeSerieMinTier(s as unknown as Serie, weg);
  setLayout("de");
  return t;
}

export function validiere(weg: RetoWeg, s: SerieRoh): string[] {
  setLayout(BEZUG[weg]);
  const { problems } = validateSerie(s as unknown as Serie, weg);
  setLayout("de");
  return problems;
}
