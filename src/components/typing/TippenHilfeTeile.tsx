/**
 * Die Bausteine der Kinder-Hilfe (`TippenHilfe`) - geteilt von der deutschen
 * und der englischen Fassung (EN7, 19.09.2026).
 *
 * ★ Warum eine eigene Datei: Die englische Hilfe steht als eigene Datei neben
 * der deutschen (`TippenHilfe.en.tsx`, dasselbe Muster wie die Rechtstexte in
 * EN8). Stünden `Kbd`, `Section` und `detailFor` in `TippenHilfe.tsx`, müsste
 * die englische Datei von der deutschen importieren und die deutsche von der
 * englischen - ein Kreis. So hängen beide an diesem Baustein, und die deutsche
 * Seite bleibt Zeichen für Zeichen, wie sie war (die Bausteine sind
 * unverändert herausgelöst).
 */
import type { Stufe } from "@/lib/typing";
import type { Lernweg } from "@/lib/typing/lernweg";
import { istMacSystem } from "@/lib/altTaste";
import { useBedienSprache } from "@/lib/bedienSprache";
import { WAHLTASTE, wahlText } from "@/lib/typing/wahltaste";

/**
 * Eine Taste/ein Tastenkürzel als kleine Taste dargestellt.
 *
 * ★ 18.10.2026 (Kürzel einheitlich, `lib/altTaste.ts`): Am Mac heißt die Taste
 * „Alt" überall „Wahl" (in der Bedienungssprache: `WAHLTASTE`) - in JEDER
 * Fassung der Hilfe, ohne dass eine von ihnen etwas davon wissen muss. Nur
 * die blosse Taste „Alt" wird getauscht; „AltGr" bleibt, wie es ist.
 */
export function Kbd({ children }: { children: React.ReactNode }) {
  const { spracheGewaehlt } = useBedienSprache();
  const inhalt = children === "Alt" && istMacSystem() ? WAHLTASTE[spracheGewaehlt] : children;
  return (
    <kbd className="inline-block rounded-md border border-hairline bg-surface-sunken px-2 py-0.5 font-legible text-sm font-semibold text-ink">
      {inhalt}
    </kbd>
  );
}

/**
 * Ein Kürzel mitten im Satz („… in den Einstellungen (Alt + O) …"), als
 * gewöhnlicher Text: am Mac „Wahl + O" (in der Sprache der Bedienung,
 * `wahlText`), sonst unverändert. ★ 18.10.2026 (Johannes: „passe mac an
 * Wahl-taste an") - `Kbd` tauscht nur die Taste in ihrem Kästchen, nicht den
 * Fliesstext. Nur für App-Kürzel; die Tasten, die das Kind lernt (AltGr,
 * „prawy Alt"), stehen nicht darin.
 */
export function AltText({ children }: { children: string }) {
  const { spracheGewaehlt } = useBedienSprache();
  return <>{wahlText(children, spracheGewaehlt)}</>;
}

/**
 * Detailtiefe der Hilfe aus der Alters-/Textstufe (1 = ganz einfach … 4 = voll).
 *
 * ★ S2-BEFUND (15.08.2026): Diese Funktion war die stille Falle, vor der
 * skin.ts warnt. Nach S1 fielen die NEUEN Stufen `kids` und `teens` beide in
 * den `default`-Zweig — ein Achtjähriger hätte die volle Erwachsenen-Hilfe
 * bekommen, und `tsc` schwieg, weil der Zweig ja existiert. Darum stehen die
 * neuen Werte jetzt ausdrücklich da.
 *
 * Die Skala ist vierstufig, obwohl es nur noch drei Stufen gibt: Sie beschreibt
 * die AUSFÜHRLICHKEIT, nicht das Alter. Verzweigt wird im Text nur auf `=== 1`,
 * `>= 2` und `>= 3`; die Stufe 2 kommt darum heute nirgends allein vor.
 *
 * ★ Die ALTEN Konto-Werte folgen genau `migriereStufe` (a → kids, b und c →
 * teens): Ein gespeichertes Konto, das noch `b` trägt, muss dieselbe Hilfe
 * sehen wie nach der Migration — sonst hinge die Ausführlichkeit daran, ob der
 * Konto-Blob schon einmal neu geschrieben wurde.
 */
export function detailFor(stufe: Stufe): 1 | 2 | 3 | 4 {
  switch (stufe) {
    case "kids":
    case "a":
      return 1;
    case "teens":
    case "b":
    case "c":
      return 3;
    default:
      return 4;
  }
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

/** Was beide Fassungen der Hilfe bekommen. */
export interface TippenHilfeProps {
  open: boolean;
  onClose: () => void;
  stufe: Stufe;
  /**
   * ★ E2 (24.09.2026): der Lernweg DES KINDES (Bauplan §6.3) - die deutsche
   * Fassung liest ihn nicht (deutsche Bedienung ⇒ immer Weg „de", D1), die
   * englische zeigt damit die WIRKLICHE Reihenfolge statt der deutschen.
   * Optional wie `sprache` anderswo in dieser Datei-Familie (Vorgabe „de") -
   * bestehende Aufrufer (immer deutsche Bedienung) bleiben unverändert.
   * ★ 28.09.2026: ALLE vier Fassungen lesen ihn für die Echo-Höhle - das
   * Höhlenwesen gibt es nur auf Weg „de" (`hoehleHatWesen` in
   * `lib/typing/expedition/texts.ts`), auch unter deutscher Bedienung.
   */
  lernweg?: Lernweg;
}
