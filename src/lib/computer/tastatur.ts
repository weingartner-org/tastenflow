/**
 * im Griff — welche TASTATUR liegt vor dem Kind? (Etappe E-O)
 *
 * Johannes, 06.08.: „wir brauchen wie im Tastenflow einen einstellungsschalter
 * (mit Tastenkürzel) und dort eine einstellung für tastaturlayout (wie im
 * Tastenflow)."
 *
 * ★★ Die eine Entscheidung: **EINE Quelle für beide Apps.** Das Layout liegt
 * weiter in `src/lib/typing/layouts.ts` — dieselbe Einstellung, derselbe
 * Speicherplatz. Ein Kind hat EINE Tastatur vor sich; sie im Tastenflow auf
 * „Schweiz" zu stellen und in „im Griff" noch einmal, wäre zweimal dieselbe
 * Frage mit zwei möglichen Antworten. Diese Datei ist nur die schmale Brücke:
 * Sie reicht durch, was „im Griff" braucht, und fügt das hinzu, was es
 * ZUSÄTZLICH zum Tastenflow braucht — nämlich die physische Tastenlage.
 *
 * ── Was das Layout hier bewirkt ─────────────────────────────────────────────
 *
 * **1. ERKENNEN — die vertauschten Tasten Y und Z.**
 * Auf QWERTZ (Deutschland/Österreich, Schweiz) meldet die Taste mit dem
 * Aufdruck **Z** den Code `KeyY`, die mit dem Aufdruck **Y** den Code `KeyZ` —
 * genau umgekehrt zu QWERTY (USA, Großbritannien). `matchesChord` fällt auf
 * `e.code` zurück, wenn die Tastatur KEINEN Buchstaben liefert: wenn ein
 * Modifikator ein Sonderzeichen erzeugt hat (am Mac liefert Wahl+V ein „√")
 * oder gar kein Wert kommt („Dead", „Unidentified"). Ohne Layout-Wissen griffe
 * dieser Rückfall auf QWERTZ zur FALSCHEN physischen Taste: Ein Kind drückt die
 * Taste mit dem Aufdruck Z und die App prüft die Taste daneben. Cmd+Z
 * (Rückgängig) und Cmd+Y (Wiederholen) stehen in derselben Lektion — dort wäre
 * das keine Kleinigkeit, sondern eine Fehl-Lehre (K36).
 *
 * ★ Ehrlich dazugesagt: Im heutigen Vorrat ist kein Kürzel bekannt, das diesen
 * Rückfall auf y oder z auslöst — die K36-Regel („liefert die Tastatur einen
 * Buchstaben, entscheidet er allein") fängt die bekannten Fälle vorher ab. Die
 * Layout-Kenntnis ist Vorsorge und Richtigkeit, kein behobener Live-Fehler.
 *
 * **2. ANZEIGEN — Tasten, die es auf dieser Tastatur nicht gibt.**
 * `Cmd+<` (am Mac: Fenster desselben Programms wechseln) braucht die Taste
 * rechts neben der linken Umschalttaste. Die gibt es nur auf ISO-Tastaturen
 * (Deutschland/Österreich, Schweiz, Großbritannien) — die amerikanische
 * ANSI-Tastatur hat sie nicht. Statt eine Ersatz-Taste zu LEHREN, die hier
 * niemand gemessen hat, sagt die App ehrlich, dass es sie auf der eingestellten
 * Tastatur nicht gibt (Fakten-Disziplin: was nicht belegt ist, kommt nicht in
 * den Lernstoff).
 *
 * KEIN Eingriff in den Vorrat: Es fällt keine Lektion, kein Atom und keine
 * Frage weg. Die sichtbaren Zahlen je Profil (Windows 237/244/245/232, Mac
 * 173/164/161) bleiben Layout-unabhängig — sonst hinge der Lernstoff eines
 * Kindes an einem Schalter, den eine Lehrkraft nie sieht.
 */
import {
  activeLayoutId,
  layoutById,
  setLayout,
  sichtbareLayouts,
  subscribeLayout,
} from "@/lib/typing/layouts";
import type { LayoutId } from "@/lib/typing/layouts";

export type { LayoutId };

/** Die Auswahl für das Einstellungsfeld: Kennung + Klartext-Name. */
export interface TastaturWahl {
  id: LayoutId;
  /** Voller Name im Auswahlfeld („Deutsch (Deutschland/Österreich)"). */
  label: string;
  /** Kurzname für Ansagen („deutsche Tastatur"). */
  kurz: string;
}

/**
 * ★ E3 (25.09.2026): Die französischen und spanischen Tastaturen stehen hier
 * nicht zur Wahl ({@link sichtbareLayouts}).
 *
 * ★★ 28.09.2026 (Freigabe fr/es, Johannes: die anderen Apps gibt es nur auf
 * Deutsch): Bis zur Freigabe folgte diese Liste den Tastenflow-Schaltern
 * `?franzoesisch-lehrgang` / `?spanisch-lehrgang`. Seit die beiden default AN
 * sind, hätte »Im Griff« dadurch plötzlich AZERTY und die spanischen
 * Tastaturen angeboten. Die Liste hängt deshalb an KEINEM Tastenflow-Schalter
 * mehr: »Im Griff« zeigt immer genau de, ch, us, uk - wie vor der Freigabe.
 */
export function tastaturWahlen(): TastaturWahl[] {
  const liste = sichtbareLayouts(false, false);
  // ★ 28.09.2026: Die Tastatur ist EINE Einstellung für beide Apps. Hat ein
  // Kind in Tastenflow eine andere gewählt (AZERTY, spanisch …), steht genau
  // diese zusätzlich in der Liste - sonst zeigte das Auswahlfeld eine Tastatur,
  // die gar nicht eingestellt ist, während die Übungen mit der echten rechnen.
  const aktiv = activeLayoutId();
  const alle = liste.some((l) => l.id === aktiv) ? liste : [...liste, layoutById(aktiv)];
  return alle.map((l) => ({
    id: l.id,
    label: l.label,
    kurz: l.kurz,
  }));
}

/** Das eingestellte Layout (dieselbe Einstellung wie im Tastenflow). */
export function aktivesTastaturLayout(): LayoutId {
  return activeLayoutId();
}

/** Layout umstellen — wirkt sofort in BEIDEN Apps. */
export function setzeTastaturLayout(id: LayoutId | string): void {
  setLayout(id);
}

/** Auf Layout-Wechsel horchen (für `useSyncExternalStore`). */
export function abonniereTastaturLayout(fn: () => void): () => void {
  return subscribeLayout(fn);
}

/**
 * Kurzname eines Layouts, für Ansagen. Nimmt bewusst auch einen rohen String
 * (der Wert eines Auswahlfelds ist einer) — `layoutById` fällt auf die deutsche
 * Tastatur zurück, wenn die Kennung unbekannt ist.
 */
export function tastaturKurzname(id: LayoutId | string): string {
  return layoutById(id).kurz;
}

/** Ansage nach dem Umstellen — sagt, was jetzt gilt. */
export function tastaturAnsage(id: LayoutId | string): string {
  return `Tastatur: ${tastaturKurzname(id)}.`;
}

/* ── 1. Erkennen: die physische Tastenlage ────────────────────────────────── */

/**
 * QWERTZ-Tastaturen (Deutschland/Österreich, Schweiz). Auf ihnen sind die
 * Buchstaben **y und z physisch vertauscht** gegenüber QWERTY.
 */
const QWERTZ: ReadonlySet<LayoutId> = new Set<LayoutId>(["de", "ch"]);

export function istQwertz(id: LayoutId): boolean {
  return QWERTZ.has(id);
}

/**
 * Physischer Tastencode (`KeyboardEvent.code`) für ein Zeichen — auf DIESER
 * Tastatur.
 *
 * ★ Nur y und z wandern. Alle anderen Buchstaben, die Ziffern und die beiden
 * Satzzeichen liegen auf de/ch/us/uk an derselben Stelle; für sie ist die
 * Antwort dieselbe wie vor E-O. `null` heißt „für dieses Zeichen gibt es keinen
 * verlässlichen Code" — dann bleibt es beim Vergleich über `e.key`.
 */
export function physischerCode(zeichen: string, layout: LayoutId): string | null {
  if (/^[a-z]$/.test(zeichen)) {
    if (istQwertz(layout)) {
      if (zeichen === "z") return "KeyY";
      if (zeichen === "y") return "KeyZ";
    }
    return `Key${zeichen.toUpperCase()}`;
  }
  if (/^\d$/.test(zeichen)) return `Digit${zeichen}`;
  if (zeichen === ".") return "Period";
  if (zeichen === ",") return "Comma";
  return null;
}

/* ── 2. Anzeigen: Tasten, die diese Tastatur nicht hat ────────────────────── */

/**
 * Die Taste rechts neben der linken Umschalttaste. Es gibt sie auf
 * ISO-Tastaturen (de, ch, uk) — die amerikanische ANSI-Tastatur hat dort keine
 * eigene Taste, sondern gleich das Y (bzw. Z).
 *
 * Beleg: `src/lib/typing/layouts.ts` — die untere Reihe von `de`/`ch`/`uk`
 * beginnt mit einer Zusatztaste (`<` bzw. `\`), die von `us` nicht.
 */
const ANSI: ReadonlySet<LayoutId> = new Set<LayoutId>(["us"]);

/** Hat diese Tastatur die Zusatztaste links unten (ISO)? */
export function hatIsoZusatztaste(layout: LayoutId): boolean {
  return !ANSI.has(layout);
}

/**
 * Ein Kürzel, das auf der ISO-Zusatztaste endet — z. B. `Cmd+<` oder
 * `Umschalt+Cmd+<`. Gesucht wird in beliebigem Text, weil das Kürzel in „Im
 * Griff" nicht nur als `keys`-Feld vorkommt, sondern auch mitten in einer
 * Lernkarte (`mac.grundlagen.programme-wechseln`).
 */
const ISO_KUERZEL = /(?:Cmd|Strg|Alt|Wahl|ctrl|Win|Umschalt)(?:\+[A-Za-zÄÖÜäöü]+)*\+</;

/**
 * Der Hinweis zu einem Kürzel, das es auf der eingestellten Tastatur so nicht
 * gibt — oder `null`, wenn alles passt. Nimmt einen Kürzel-String ODER einen
 * ganzen Lehrtext.
 *
 * ★★ Bewusst KEIN Ersatz-Kürzel. Welche Taste an einer amerikanischen Tastatur
 * dieselbe Aufgabe übernimmt, ist hier nicht gemessen worden — und der
 * Abwärtsakzent, den Apples generische Referenz nennt, ist in dieser App
 * ausdrücklich gesperrt (`dataMac.ts`, Sperrtest in
 * `tests/computer-mac-grundlagen.test.ts`). Eine ehrliche Lücke ist besser als
 * eine geratene Anleitung (Fakten-Disziplin).
 */
export function tastaturHinweis(text: string, layout: LayoutId): string | null {
  if (hatIsoZusatztaste(layout)) return null;
  if (!ISO_KUERZEL.test(text)) return null;
  return (
    `Hinweis zu deiner Tastatur: Auf der ${tastaturKurzname(layout)} gibt es die ` +
    `Taste < neben der linken Umschalttaste nicht. Dieser Griff gilt für ` +
    `Tastaturen, die sie haben — deine hat an dieser Stelle keine eigene Taste.`
  );
}
