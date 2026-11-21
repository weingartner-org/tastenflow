/**
 * Wiederkehr-Engine der Themenstränge (TN-E2; Bauplan
 * `Sensorik/BAUPLAN-2026-07-27-TASTENFLOW-TEXT-NACHSCHUB.md` §3/§7).
 *
 * Arbeitsteilung:
 *  • {@link planArcRound} — VOR dem Rundenbau: rückt Stränge über bereits
 *    Erledigtes vor (lokal, ohne zu persistieren), sammelt die FÄLLIGEN
 *    Schritte als servierfertige Zeilen-GRUPPEN (Frage/Antwort-Paar bleibt
 *    zusammen) und liefert die zugehörigen Manifest-Indizes als Ausschluss-
 *    Menge (damit der Generator dieselbe Zeile nicht zufällig doppelt zieht).
 *  • {@link weaveArcGroups} — NACH dem Rundenbau: webt die Gruppen an
 *    zufälligen Stellen ein, OHNE ein Paar zu trennen (die Runde wird sonst
 *    ganz normal gemischt — Arc-Zeilen dürfen dabei nicht auseinanderfallen).
 *  • {@link roundEndArcUpdate} — am RUNDENENDE: Rundenzähler +1 und Stränge
 *    gegen das frische „gesehen"-Bitset vorrücken; das Ergebnis wird vom
 *    Trainer mit dem übrigen Rundenergebnis persistiert.
 *
 * Die Arc-Zeilen sind NORMALE Korpus-Zeilen: `fitText` passt sie an den
 * Tastenstand an (passt eine Zeile nicht, wartet der Strang einfach), und der
 * `source`-Index läuft über das bestehende No-Repeat-Ledger — getippte
 * Arc-Zeilen werden also automatisch „gesehen" und der Strang rückt beim
 * nächsten {@link roundEndArcUpdate} vor. Kein neues Persistenz-Format.
 */
import type { Lang, Stufe } from "./account";
import {
  ARC_MAX_PER_ROUND,
  arcAutoAdvance,
  arcDueStep,
  arcStateFor,
  arcsFor,
  type Arc,
  type ArcContext,
  type ArcProgress,
} from "./arcs";
import { fitText, hatGrossbuchstaben, nurKleinschrift } from "./corpus";
import { corpusIndexOf } from "./corpusManifest";
import type { StoryProgress } from "./ledger";
import type { RoundLine } from "./generator";
import type { Lernweg } from "./lernweg";
import { wandleSchreibweise, type EnglischVariante } from "./schreibweise";

export interface ArcPlanArgs {
  arcProgress: ArcProgress | undefined;
  /** „gesehen"-Bitset (bereits präfix-validiert, wie im Trainer üblich). */
  seen: Uint8Array;
  story: StoryProgress | undefined;
  roundsTotal: number;
  stufe: Stufe;
  lang: Lang;
  /**
   * ★ E4a (24.09.2026): der Lernweg des Kindes - Pflicht, siehe
   * `arcsFor`/`GenerateOptions.lernweg`.
   */
  lernweg: Lernweg;
  /** Freigeschaltete Zeichen (Buchstaben + Satz-/Sonderzeichen/Ziffern). */
  allowed: Set<string>;
  /**
   * ★ D-2 (28.09.2026): Umschalttaste gelernt? Fehlt es, gilt „ja"
   * (unverändert). Erwachsene vor ⇧ bekommen keinen Strang-Schritt mit
   * Grossbuchstaben (`nurKleinschrift`, corpus.ts).
   */
  umschalt?: boolean;
  /** Nur für Tests: Registry-Ersatz statt `arcsFor`. */
  arcs?: Arc[];
  /** ★ E9 (24.09.2026): britisch/amerikanisch, siehe `CorpusQuery.variante`. */
  variante?: EnglischVariante;
}

export interface ArcRoundPlan {
  /** Servierfertige Zeilen-Gruppen (1 Gruppe = 1 Arc-Schritt, Reihenfolge fix). */
  groups: RoundLine[][];
  /** Manifest-Indizes der Gruppen — dem Generator als Ausschluss übergeben. */
  exclude: Set<number>;
}

/** Fällige Arc-Schritte als servierfertige Zeilen-Gruppen (max 2 pro Runde). */
export function planArcRound(args: ArcPlanArgs): ArcRoundPlan {
  const ctx: ArcContext = {
    seen: args.seen,
    indexOf: (kind, text) => corpusIndexOf(kind, text, args.lang), // ★ G3a-SCHRIFT: Sprache der Übung
    story: args.story,
    roundsTotal: args.roundsTotal,
  };
  const groups: RoundLine[][] = [];
  const exclude = new Set<number>();
  const klein = nurKleinschrift(args.stufe, args.umschalt ?? true); // ★ D-2
  for (const arc of args.arcs ?? arcsFor(args.stufe, args.lang, args.lernweg)) {
    if (groups.length >= ARC_MAX_PER_ROUND) break;
    // Erledigtes überspringen (nur LOKAL — persistiert wird am Rundenende).
    const local = arcAutoAdvance(args.arcProgress, arc, ctx);
    const due = arcDueStep(arc, arcStateFor(local, arc.id), ctx);
    if (!due || !due.bausteine) continue;
    const lines: RoundLine[] = [];
    for (const b of due.bausteine) {
      // ★ G3a-SCHRIFT (25.10.2026): in der Sprache der Übung - für die neun Sprachen des Gerüsts zählt jeder Buchstabe.
      const index = corpusIndexOf(b.kind, b.text, args.lang);
      const fitted = index === undefined ? null : fitText(b.text, args.allowed, args.lernweg, args.lang);
      if (index === undefined || fitted === null) break; // passt (noch) nicht → warten
      if (klein && hatGrossbuchstaben(fitted)) break; // ★ D-2: erst nach ⇧
      // Arc-Bausteine sind immer echter Text (Geschichte/Serie).
      // ★ E9: die Schreibweise erst NACH der Ledger-Kennung (`index` oben).
      const text = args.variante === "us" ? wandleSchreibweise(fitted, "us") : fitted;
      lines.push({ text, source: index, art: "text" });
    }
    if (lines.length !== due.bausteine.length) continue;
    groups.push(lines);
    for (const l of lines) if (l.source !== null) exclude.add(l.source);
  }
  return { groups, exclude };
}

/**
 * Webt die Gruppen an zufälligen Stellen in die (bereits gemischte) Runde ein.
 * Innerhalb einer Gruppe bleibt die Reihenfolge erhalten (Frage VOR Antwort)
 * und die Zeilen bleiben DIREKT benachbart.
 */
export function weaveArcGroups(
  base: RoundLine[],
  groups: RoundLine[][],
  rng: () => number = Math.random,
): RoundLine[] {
  // Einfügepunkte werden IM BASISTEXT gewählt (0..base.length) — würde in das
  // WACHSENDE Ergebnis gespleißt, könnte eine spätere Gruppe eine frühere
  // auseinanderreißen (vom Test gefangen).
  const at = groups.map(() => Math.floor(rng() * (base.length + 1)));
  const out: RoundLine[] = [];
  for (let i = 0; i <= base.length; i++) {
    groups.forEach((g, gi) => {
      if (at[gi] === i) out.push(...g);
    });
    if (i < base.length) out.push(base[i]);
  }
  return out;
}

/** Wie viele Zeilen der Plan belegt (fürs Kürzen der Generator-Anfrage). */
export function arcPlanLineCount(plan: ArcRoundPlan): number {
  return plan.groups.reduce((a, g) => a + g.length, 0);
}

/**
 * Rundenende: Zähler +1, Stränge gegen das FRISCHE Bitset vorrücken (die eben
 * getippten Arc-Zeilen sind über `onLineSeen` schon verbucht). Liefert die
 * beiden additiven Felder zum Mit-Persistieren.
 */
export function roundEndArcUpdate(args: {
  arcProgress: ArcProgress | undefined;
  seen: Uint8Array;
  story: StoryProgress | undefined;
  roundsTotal: number | undefined;
  stufe: Stufe;
  lang: Lang;
  /** ★ E4a (24.09.2026): der Lernweg des Kindes - Pflicht, siehe `arcsFor`. */
  lernweg: Lernweg;
  arcs?: Arc[];
}): { roundsTotal: number; arcProgress: ArcProgress | undefined } {
  const roundsTotal = (args.roundsTotal ?? 0) + 1;
  const ctx: ArcContext = {
    seen: args.seen,
    indexOf: (kind, text) => corpusIndexOf(kind, text, args.lang), // ★ G3a-SCHRIFT: Sprache der Übung
    story: args.story,
    roundsTotal,
  };
  let p = args.arcProgress;
  for (const arc of args.arcs ?? arcsFor(args.stufe, args.lang, args.lernweg)) {
    p = arcAutoAdvance(p, arc, ctx);
  }
  return { roundsTotal, arcProgress: p };
}
