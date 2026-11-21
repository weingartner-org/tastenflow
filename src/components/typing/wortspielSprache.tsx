/**
 * ★★ DIE ZWEI SPRACHEN DER WORTSPIEL-BILDSCHIRME (EN4, 18.09.2026).
 *
 * Rätsel-Bildschirm, Buchstabensalat und Pyramide sprechen BEDIENUNG
 * („Prüfen", „Welches Wort fehlt?") und INHALT (die Wörter und Sätze, die das
 * Kind tippt). Die Bedienung folgt der Bedienungssprache, der Inhalt der
 * Übungssprache - dieselbe Trennung wie in `lib/typing/uebungsformen/bedienung.ts`.
 *
 * ★★★ OHNE AKTIVEN SPRACHBEREICH WIE VORHER: Bis EN4 entschied die
 * Übungssprache (`lang`) auch über die Sprache dieser Bildschirme - ein Kind
 * mit englischer Übungssprache las „Check" und „Your answer". Das bleibt so,
 * wo kein Provider die Bedienungssprache liefert (`ui = lang`); dann ist auch
 * nie etwas gemischt, und jeder Satz wird genau wie vorher als EIN Text
 * gezeigt und mit EINER `speakUi` gesprochen.
 *
 * ★★ GEMISCHT (in Tastenflow, Bedienung ≠ Übungssprache - etwa englische
 * Bedienung und deutsche Wörter):
 *  · Inhalt steht in `<span lang="…">`, damit eine Sprachausgabe ihn mit der
 *    richtigen Aussprache liest ({@link TeileText}).
 *  · Gesprochen wird in STÜCKEN: Bedienung mit der Stimme der Bedienung,
 *    Inhalt mit der Stimme der Übungssprache ({@link sprichNacheinander}). Ein
 *    deutscher Satz mit englischer Stimme wäre derselbe Fehler wie „Pankt".
 */
import { Fragment, useCallback, useEffect, useRef } from "react";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { sprachausgabeBeschaeftigt, speakUi, useVoice, type Lang } from "@/lib/typing";
import { ausTeilen, type TextTeil } from "@/lib/typing/uebungsformen/bedienung";
import { feinesLangAttribut } from "@/lib/typing/schreibweise";

export interface WortspielSprache {
  /** Die Sprache der Bedienung dieses Bildschirms. Ohne aktiven Sprachbereich: die Übungssprache. */
  ui: BedienSprache;
  /** Die Übungssprache - Inhalte. */
  lang: Lang;
  /** Gilt die Bedienungssprache hier (Tastenflow)? Nur dann bekommen Inhalte ein `lang`-Attribut. */
  bereichAktiv: boolean;
  /** Sprechen Bedienung und Inhalt verschiedene Sprachen? Nur bei aktivem Sprachbereich möglich. */
  gemischt: boolean;
}

export function useWortspielSprache(lang: Lang): WortspielSprache {
  const { sprache, bereichAktiv } = useBedienSprache();
  const ui: BedienSprache = bereichAktiv ? sprache : lang;
  return { ui, lang, bereichAktiv, gemischt: ui !== lang };
}

/**
 * Ein Satz aus Teilen. Nicht gemischt: EIN Textknoten, genau wie vorher.
 * Gemischt: die Inhalte in `<span lang>`.
 */
export function TeileText({
  teile,
  lang,
  gemischt,
}: {
  teile: readonly TextTeil[];
  lang: Lang;
  gemischt: boolean;
}) {
  if (!gemischt) return <>{ausTeilen(teile)}</>;
  return (
    <>
      {teile.map((t, i) =>
        t.inhalt ? (
          // ★ E10: „en" wird nur mit dem Probe-Schalter zu „en-GB"/„en-US"
          // (feinesLangAttribut, `schreibweise.ts`) - ohne ihn byte-identisch „en".
          <span key={i} lang={feinesLangAttribut(lang)}>
            {t.text}
          </span>
        ) : (
          <Fragment key={i}>{t.text}</Fragment>
        ),
      )}
    </>
  );
}

/** Ein Stück einer Ansage: Text, Sprache der Stimme, wahlweise eine eigene Tonhöhe. */
export interface SprechStueck {
  text: string;
  lang: Lang;
  pitch?: number;
  /** „sofort" für Hinweise, die zum Anschlag gehören (siehe `speakUiAlways`). */
  art?: "sofort";
  /** Eigene Äußerung, nie an das Stück davor gehängt - so entsteht eine Sprechpause. */
  pause?: true;
}

/** Teile in Sprechstücke: Bedienung in `ui`, Inhalt in `lang`. */
export function sprechStuecke(
  teile: readonly TextTeil[],
  ui: BedienSprache,
  lang: Lang,
): SprechStueck[] {
  return teile.map((t) => ({ text: t.text, lang: t.inhalt ? lang : ui, ...(t.pause ? { pause: true as const } : {}) }));
}

/**
 * Nachbarn mit derselben Stimme und Tonhöhe werden EINE Äußerung - jede
 * zusätzliche Äußerung ist eine Pause mehr und auf dem iPad ein Risiko mehr
 * (`voice.ts`, Kommentar zu `GROSS_PITCH`).
 *
 * ⚠️ Ein Stück aus lauter Satzzeichen und Leerraum („." hinter einem
 * deutschen Wort) wird NIE allein gesprochen - eine Stimme sagte sonst „dot"
 * oder „Punkt". Es hängt sich an das Stück davor, gleich welcher Sprache.
 * Ausnahme: ein Stück mit eigener Tonhöhe - das ist ein einzeln genannter
 * Buchstabe (`fehlerAnsage`), und der darf auch ein Satzzeichen sein.
 *
 * Die Leerzeichen stehen schon in den Teilen; zusammengehängt wird ohne
 * eigenes, getrimmt erst am Ende.
 */
export function zusammenfassen(stuecke: readonly SprechStueck[]): SprechStueck[] {
  const out: SprechStueck[] = [];
  for (const s of stuecke) {
    const vorher = out[out.length - 1];
    const nurZeichen = s.pitch === undefined && !/[\p{L}\p{N}]/u.test(s.text);
    const gleich =
      vorher && !s.pause && vorher.lang === s.lang && vorher.pitch === s.pitch && vorher.art === s.art;
    if (vorher && (gleich || (nurZeichen && vorher.pitch === undefined))) vorher.text += s.text;
    else if (!nurZeichen) out.push({ ...s });
  }
  return out.map((s) => ({ ...s, text: s.text.trim() })).filter((s) => s.text);
}

/** Frühestens so lange nach einem Stück wird nachgesehen, ob es ausgeredet hat. */
const MIN_WARTEN_MS = 150;
/** So oft wird nachgesehen. */
const NACHSEHEN_MS = 100;
/** Längstens so lange wird gewartet - eine hängende Sprachausgabe hält nichts auf. */
const MAX_WARTEN_MS = 30_000;

/**
 * Spricht die Stücke NACHEINANDER, jedes mit seiner eigenen Stimme - das
 * nächste erst, wenn das vorige ausgeredet hat.
 *
 * ⚠️ Warum nicht einfach mehrmals `speakUi`: Eine zweite Ansage bricht die
 * laufende ab (`cancelIfBusy` in `voice.ts`, Regel F21 heisst „darf nicht
 * verschwinden", nicht „darf nicht unterbrechen"). Hier wird deshalb gewartet,
 * bis die Sprachausgabe frei ist (`sprachausgabeBeschaeftigt`) - dieselbe
 * Bauart wie `speakUiNachLaufender`, nur mit Sprache je Stück.
 *
 * Gibt eine Funktion zurück, die den Rest verwirft (neue Aufgabe, Bildschirm
 * geschlossen).
 */
export function sprichNacheinander(stuecke: readonly SprechStueck[]): () => void {
  if (!useVoice.getState().enabled) return () => {};
  const rest = zusammenfassen(stuecke);
  let aus = false;
  let zeitgeber: ReturnType<typeof setTimeout> | null = null;
  const naechstes = () => {
    if (aus) return;
    const s = rest.shift();
    if (!s) return;
    speakUi(s.text, s.pitch, s.art, s.lang);
    if (!rest.length) return;
    const beginn = Date.now();
    const warte = () => {
      zeitgeber = null;
      if (aus) return;
      const vergangen = Date.now() - beginn;
      if (vergangen >= MAX_WARTEN_MS || (vergangen >= MIN_WARTEN_MS && !sprachausgabeBeschaeftigt()))
        naechstes();
      else zeitgeber = setTimeout(warte, NACHSEHEN_MS);
    };
    zeitgeber = setTimeout(warte, MIN_WARTEN_MS);
  };
  naechstes();
  return () => {
    aus = true;
    if (zeitgeber !== null) clearTimeout(zeitgeber);
  };
}

/**
 * {@link sprichNacheinander} für einen Bildschirm: Eine neue Ansage verwirft
 * den Rest der vorigen, und beim Schliessen verstummt, was noch wartet.
 */
export function useNacheinanderSprechen(): (stuecke: readonly SprechStueck[]) => void {
  const abbruch = useRef<(() => void) | null>(null);
  useEffect(() => () => abbruch.current?.(), []);
  return useCallback((stuecke: readonly SprechStueck[]) => {
    abbruch.current?.();
    abbruch.current = sprichNacheinander(stuecke);
  }, []);
}
