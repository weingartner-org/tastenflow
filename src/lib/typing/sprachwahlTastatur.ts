/**
 * ★★★ DIE TASTATUR-RÜCKFRAGE BEIM ERSTEN START (W2b, 28.09.2026).
 *
 * Johannes (27.09.2026): *„pop up beim ändern der Sprache wäre wichtig:
 * Achtung diese Sprache ist nur mit der passenden Tastatur .... möglich.
 * Verwendet dieses Kind eine .... Tastatur? (Ja) (Nein) : bei nein springt es
 * wieder auf die ursprüngliche sprache zurück"* - und: gilt auch bei der
 * eigenen Wahl beim ersten Start; wo der Browser die Tastatur erkennt und sie
 * passt, entfällt die Frage.
 *
 * Beim ersten Start entscheidet die BEDIENUNGSSPRACHE über den Lernweg
 * (`bestimmeLernweg`, festgeschrieben beim ersten Fortschritt). Wer also im
 * Sprachwähler der Kopfzeile „Français" wählt, wählt den Weg „fr" - und der
 * lehrt nur die Tastaturen seiner Länder (`wegTastaturen.ts`).
 *
 * Die ganze Entscheidung steht hier, rein und testbar:
 *  · Steht der Weg schon fest (Konto, Gerät, geübter Fortschritt): keine
 *    Frage - die Sprache wechselt nur die Knöpfe, nie den Weg.
 *  · Der neue Weg hat keine Landestastaturen (de, en): keine Frage.
 *  · Die eingestellte Tastatur passt schon: keine Frage, nichts umgestellt.
 *  · Die ERKANNTE Tastatur passt (`tastaturErkennung.ts`): keine Frage - sie
 *    wird eingestellt (die Person hat sie vor sich, und die bisherige passt
 *    zu dieser Sprache nicht).
 *  · Sonst: die Frage. „Ja" stellt die Vorwahl des Landes ein
 *    (`vorschlagLayout`), „Nein" lässt Sprache und Tastatur, wie sie waren.
 */
import type { LayoutId } from "./layouts";
import { lernwegDef, type Lernweg } from "./lernweg";
import type { TastaturErkannt } from "./tastaturErkennung";
import { tastaturPasstZumWeg, tastaturenDesWeges } from "./wegTastaturen";

export type SprachwahlTastatur =
  | { art: "ohneFrage"; layout?: LayoutId }
  | { art: "frage"; weg: RueckfrageWeg; layout: LayoutId };

/** Die Hauptsprachen, für die das Rückfrage-Fenster Sätze hat. */
export type RueckfrageWeg = "fr" | "es" | "it" | "pl" | "tr" | "cs" | "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";
const RUECKFRAGE_WEGE: ReadonlySet<string> = new Set<RueckfrageWeg>(["fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"]);
function hatRueckfrage(w: string): w is RueckfrageWeg {
  return RUECKFRAGE_WEGE.has(w);
}

export function tastaturBeimSprachwechsel(opts: {
  /** Steht der Lernweg schon fest? Dann ändert die Sprache ihn nicht. */
  wegFest: boolean;
  /** Der Weg, den die neue Sprache beim ersten Fortschritt ergäbe. */
  neuerWeg: Lernweg;
  eingestellt: LayoutId;
  erkannt: TastaturErkannt | null;
  /** Die Vorwahl des Landes aus Sprache und Browser (`vorschlagLayout`). */
  vorschlag: LayoutId;
}): SprachwahlTastatur {
  const { wegFest, neuerWeg, eingestellt, erkannt, vorschlag } = opts;
  if (wegFest) return { art: "ohneFrage" };
  const erlaubt = tastaturenDesWeges(neuerWeg);
  if (!erlaubt) return { art: "ohneFrage" };
  if (tastaturPasstZumWeg(eingestellt, neuerWeg)) return { art: "ohneFrage" };
  if (erkannt?.art === "app" && tastaturPasstZumWeg(erkannt.id, neuerWeg)) {
    return { art: "ohneFrage", layout: erkannt.id };
  }
  const layout = erlaubt.has(vorschlag) ? vorschlag : [...erlaubt][0];
  // An der EIGENSCHAFT des Weges (Hauptsprache), nie an seiner Kennung
  // (Leitfaden Falle 50) - `tastaturenDesWeges` liefert nur mit Hauptsprache etwas.
  const haupt = lernwegDef(neuerWeg).hauptsprache ?? "fr";
  // ★ O2-SONST (30.10.2026): die neun Wege haben jetzt auch die Sätze des Rückfrage-Fensters (`SprachwahlRueckfrage.tsx`).
  if (!hatRueckfrage(haupt)) return { art: "ohneFrage" };
  return { art: "frage", weg: haupt, layout };
}
