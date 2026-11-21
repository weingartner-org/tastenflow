/**
 * ★★★ F4-HU-RO-NL (25.10.2026): DER BAUKASTEN DER LEKTIONEN - der Teil von `curriculumCs.ts`, der in jeder Sprache gleich ist.
 *
 * `curriculumCs.ts` (und vor ihm it/pl/tr) trägt in EINER Datei zweierlei: die geschriebenen Texte der Sprache und die Rechnung,
 * die die Tasten jeder Lektion aus der Reihenfolge des Weges auf DIESER Tastatur zieht (`tastenJeLektion`) und die Griffe aus den
 * Daten der Tastatur liest. Die Rechnung steht hier EINMAL, unverändert übernommen; die Sprach-Dateien (`curriculumHu.ts`,
 * `curriculumRo.ts`, `curriculumNl.ts`, `curriculumBg.ts`, `curriculumEl.ts`, `curriculumUk.ts`, seit GEN-HAUPTSPRACHE (29.10.2026) auch
 * `curriculumPt.ts`, `curriculumBr.ts`, `curriculumSv.ts` über {@link griffSaetzeAusInfo}) bringen nur ihre Bauplan-Objekte und ihre
 * Sätze (`GriffSaetze`). Die zweite Fassung derselben Rechnung (`lektionenAusFolge.ts`) ist entfernt.
 *
 * DIE REGEL (wie cs): die Tasten aller Lektionen hintereinander SIND `introOrder(weg)` - auf jeder Tastatur. Eine Einheit kommt in
 * ihre geplante Lektion; ist die vorbei oder kommt die Einheit früher als geplant (Tastatur mit anderer achter Heimtaste), in die
 * laufende. Die IDs bleiben auf jeder Tastatur gleich (der Fortschritt hängt an der ID). Wo eine andere Pflicht-Tastatur des Weges
 * einen anderen Text ergibt, steht er in `introByLayout`.
 */
import type { Lesson, LessonKind } from "./curriculum";
import type { FingerId, KeyAccess } from "./fingers";
import { layoutById, layoutIndex, type KeyboardLayout, type LayoutId } from "./layouts";
import { lernwegDef, type Lernweg } from "./lernweg";
import { SHIFT_UNIT, achteGrundtasteFuerLayout } from "./letters";
import { kleinFuer } from "./sprachRegister";
import { kombizeichenFuerLayout } from "./totasten";

/** Eine geplante Lektion (wie `CsLektionsBauplan`). */
export interface LektionsBauplan {
  id: string;
  kind: LessonKind;
  /** Die neuen Einheiten, genau in der Reihenfolge des Weges. */
  einheiten: readonly string[];
  enablesShift?: boolean;
  corpusKinds?: Lesson["corpusKinds"];
  /** Der Titel aus den Tasten, die auf DIESER Tastatur ankommen. */
  titel: (tasten: readonly string[], layout: KeyboardLayout) => string;
  /** Der geschriebene erste Absatz. */
  vorspann: (tasten: readonly string[]) => string;
  /** Statt der gerechneten Griffe ein eigener Teil (Shift, Ziffern, Schluss). */
  griffe?: (tasten: readonly string[], layout: KeyboardLayout) => string;
}

/** Wo eine Taste liegt - aus den Daten der Tastatur, nie geraten. */
export interface Lage {
  /** 0 Zahlenreihe, 1 obere, 2 Grund-, 3 untere Reihe. */
  readonly reihe: number;
  readonly finger: FingerId;
  /** Die Heimtaste dieses Fingers auf dieser Tastatur (soweit sie in der Grundreihe liegt). */
  readonly heim: string | null;
  /** Abstand in Spalten zur Heimtaste (0 = dieselbe Spalte). */
  readonly abstand: number;
  readonly richtung: "links" | "rechts";
  /** Die Taste IST die Heimtaste. */
  readonly istHeim: boolean;
}

/** Die Sätze einer Sprache für die gerechneten Griffe. */
export interface GriffSaetze {
  /** Ein Griff-Satz für eine Einheit, deren Taste und Lage bekannt sind (`zugang` = Zusatztaste/Totaste, sonst leer). */
  griff(u: string, lage: Lage | null, zugang: KeyAccess | undefined, layout: KeyboardLayout, kombi: { tot: string; totZugang: KeyAccess | undefined; totLage: Lage | null } | null): string;
}

/**
 * ★★★ GEN-HAUPTSPRACHE (29.10.2026): der Griff einer Einheit als EIN Wert - die Form, in der pt/br/sv ihre Sätze schreiben (bis
 * hierher aus `lektionenAusFolge.ts`, der zweiten Fassung derselben Rechnung; jetzt gibt es nur noch diesen Baukasten).
 */
export interface GriffInfo {
  einheit: string;
  /** Die Taste, die gedrückt wird (Grundebene). */
  basis: string;
  /** Mit Umschalt oder AltGr? */
  mod?: "shift" | "altgr";
  /** Eine Totaste (schreibt allein nichts)? */
  tot: boolean;
  /** Lage der Taste `basis` - `null`, wenn die Daten der Tastatur sie nicht kennen (auch bei einem Kombizeichen ohne eigene Taste). */
  lage: Lage | null;
}

/** {@link GriffSaetze} aus einer Funktion über {@link GriffInfo} (pt, br, sv). */
export function griffSaetzeAusInfo(satz: (g: GriffInfo, layout: KeyboardLayout) => string): GriffSaetze {
  return {
    griff(u, lage, zugang, layout, kombi) {
      const mod = zugang?.mod === "shift" || zugang?.mod === "altgr" ? zugang.mod : undefined;
      return satz({ einheit: u, basis: zugang?.base ?? u, mod, tot: zugang?.dead === true, lage: kombi ? null : lage }, layout);
    },
  };
}

function platz(layout: KeyboardLayout, taste: string): { reihe: number; spalte: number } | null {
  for (let r = 0; r < layout.rows.length; r++) {
    const s = layout.rows[r].keys.indexOf(taste);
    if (s >= 0) return { reihe: r, spalte: s };
  }
  return null;
}

/** Die Spalte in der Zählung der Grundreihe (Zahlenreihe und ISO-Unterreihe beginnen eine Taste weiter links). */
function grundreihenSpalte(layout: KeyboardLayout, reihe: number, spalte: number): number {
  if (reihe === 0) return spalte - 1;
  if (reihe === 3 && layout.rows[3].keys.length === 11) return spalte - 1;
  return spalte;
}

/** Finger → seine Taste in der Grundstellung auf DIESER Tastatur. */
function heimTasten(weg: Lernweg, layout: KeyboardLayout): ReadonlyMap<FingerId, string> {
  const m = new Map<FingerId, string>();
  for (const k of lernwegDef(weg).homeKeys) {
    const f = layoutIndex(layout).finger.get(k);
    const p = platz(layout, k);
    if (f && p && p.reihe === 2 && !m.has(f)) m.set(f, k);
  }
  return m;
}

/** Lage einer Taste (oder `null`, wenn die Tastatur sie nicht führt oder der Daumen sie drückt). */
export function lageVon(weg: Lernweg, layout: KeyboardLayout, taste: string): Lage | null {
  const p = platz(layout, taste);
  const finger = layoutIndex(layout).finger.get(taste);
  if (!p || !finger || finger === "daumen") return null;
  const h = heimTasten(weg, layout).get(finger) ?? null;
  const hp = h ? platz(layout, h) : null;
  const s = grundreihenSpalte(layout, p.reihe, p.spalte);
  const abstand = hp ? Math.abs(s - hp.spalte) : 0;
  const richtung = hp && s < hp.spalte ? "links" : "rechts";
  return { reihe: p.reihe, finger, heim: h, abstand, richtung, istHeim: taste === h };
}

/** Die Reihenfolge des Weges auf dieser Tastatur (wie `introOrder`, aber für ein beliebiges Layout). */
export function reihenfolgeAuf(weg: Lernweg, layout: KeyboardLayout): string[] {
  const fehlt = layoutIndex(layout).missing;
  const vorhanden = lernwegDef(weg).introOrder.filter((u) => !fehlt.has(kleinFuer(u, weg)));
  return achteGrundtasteFuerLayout(vorhanden, weg, layout.id);
}

/** Ein Griff-Satz für eine Einheit: Taste, Zusatztaste/Totaste oder Kombizeichen (Totaste + Grundbuchstabe). */
export function griffSatz(weg: Lernweg, layout: KeyboardLayout, u: string, s: GriffSaetze): string {
  const zugang = layout.access[u];
  if (zugang) return s.griff(u, lageVon(weg, layout, zugang.base), zugang, layout, null);
  const lage = lageVon(weg, layout, u);
  if (lage) return s.griff(u, lage, undefined, layout, null);
  const k = kombizeichenFuerLayout(layout).find((x) => x.zeichen === u && x.nurOhneEigeneTaste !== true);
  if (k) {
    const totZugang = layout.access[k.tot];
    return s.griff(u, lageVon(weg, layout, k.dann), undefined, layout, {
      tot: k.tot,
      totZugang,
      totLage: lageVon(weg, layout, totZugang?.base ?? k.tot),
    });
  }
  return s.griff(u, null, undefined, layout, null);
}

/** Die Tasten jeder Lektion auf dieser Tastatur (wie `curriculumCs.ts#tastenJeLektion`). */
function tastenJeLektion(weg: Lernweg, plaene: readonly LektionsBauplan[], layout: KeyboardLayout): Map<string, string[]> {
  const reihenfolge = reihenfolgeAuf(weg, layout);
  const geplant = new Map<string, number>();
  plaene.forEach((b, i) => {
    for (const u of b.einheiten) geplant.set(u, i);
    if (b.enablesShift) geplant.set(SHIFT_UNIT, i);
  });
  const neu = new Map<string, string[]>(plaene.map((b) => [b.id, []]));
  let jetzt = 0;
  const naechsteRegulaer = (k: number): number => {
    for (let j = k + 1; j < reihenfolge.length; j++) {
      const q = geplant.get(reihenfolge[j]);
      if (q !== undefined && q >= jetzt) return q;
    }
    return Infinity;
  };
  reihenfolge.forEach((u, k) => {
    const p = geplant.get(u);
    const naechste = naechsteRegulaer(k);
    let l: number;
    if (p === undefined) l = jetzt;
    else if (p < jetzt) l = jetzt;
    else if (u !== SHIFT_UNIT && p > jetzt && naechste < p) l = jetzt;
    else l = p;
    jetzt = l;
    if (u !== SHIFT_UNIT) neu.get(plaene[l].id)!.push(u);
  });
  return neu;
}

function baueLektionen(weg: Lernweg, plaene: readonly LektionsBauplan[], layout: KeyboardLayout, s: GriffSaetze): Lesson[] {
  const tastenJe = tastenJeLektion(weg, plaene, layout);
  return plaene.map((b) => {
    const tasten = tastenJe.get(b.id) ?? [];
    const griffe = b.griffe ? b.griffe(tasten, layout) : tasten.map((u) => griffSatz(weg, layout, u, s)).join(" ");
    const vorspann = b.vorspann(tasten);
    const lektion: Lesson = {
      id: b.id,
      title: b.titel(tasten, layout),
      kind: b.kind,
      newKeys: tasten,
      intro: griffe ? `${vorspann} ${griffe}` : vorspann,
    };
    if (b.enablesShift) lektion.enablesShift = true;
    if (b.corpusKinds) lektion.corpusKinds = b.corpusKinds;
    return lektion;
  });
}

/**
 * Die Lektionen eines Weges je Tastatur - gecacht (dieselbe Liste bei gleicher Tastatur); jede Lektion trägt in `introByLayout` die
 * Einführung der anderen Pflicht-Tastaturen des Weges, wo sie abweicht.
 */
export function lektionenJeTastatur(
  weg: Lernweg,
  pflicht: readonly LayoutId[],
  plaene: readonly LektionsBauplan[],
  s: GriffSaetze,
): (layoutId: LayoutId) => readonly Lesson[] {
  const cache = new Map<LayoutId, readonly Lesson[]>();
  return (layoutId: LayoutId) => {
    const da = cache.get(layoutId);
    if (da) return da;
    const eigene = baueLektionen(weg, plaene, layoutById(layoutId), s);
    const andere = pflicht
      .filter((id) => id !== layoutId)
      .map((id) => [id, new Map(baueLektionen(weg, plaene, layoutById(id), s).map((l) => [l.id, l.intro]))] as const);
    for (const l of eigene) {
      const je: Partial<Record<LayoutId, string>> = {};
      for (const [id, intros] of andere) {
        const text = intros.get(l.id);
        if (text !== undefined && text !== l.intro) je[id] = text;
      }
      if (Object.keys(je).length > 0) l.introByLayout = je;
    }
    const fertig = Object.freeze(eigene);
    cache.set(layoutId, fertig);
    return fertig;
  };
}

/** Die Fingerkennung als Teile (für die Sätze der Sprachen). */
export function fingerTeile(f: FingerId): { hand: "links" | "rechts" | null; art: "kleiner" | "ring" | "mittel" | "zeige" | "daumen" } {
  if (f === "daumen") return { hand: null, art: "daumen" };
  const [art, hand] = f.split("-") as ["kleiner" | "ring" | "mittel" | "zeige", "links" | "rechts"];
  return { hand, art };
}
