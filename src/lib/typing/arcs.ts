/**
 * Themenstränge („Arcs") — der rote Faden des Text-Nachschubs (TN-E1;
 * Bauplan `Sensorik/BAUPLAN-2026-07-27-TASTENFLOW-TEXT-NACHSCHUB.md` §3,
 * [[project_tastenflow_text_nachschub]]).
 *
 * Idee: Inhalte zu EINEM Thema werden zu einer geordneten Kette verbunden —
 * lehren → wiederholen → vertiefen → belohnen. Was ein Kind gelernt hat
 * (Wissens-Zeile getippt oder Serien-Etappe gelesen), kommt einige Runden
 * später als Frage IN ANDEREN WORTEN wieder, dann als Vertiefung, zuletzt als
 * thematischer Witz. Ein Schritt wird erst fällig, wenn sein Vorgänger erledigt
 * ist UND der Mindestabstand in Runden verstrichen ist — so trägt das Lernen,
 * ohne zu nerven (§10-Default: Abstand 3 Runden).
 *
 * Die Schritte referenzieren NORMALE Korpus-Bausteine (Sorte + Text → stabiler
 * Manifest-Index über `bausteinId`, siehe ledger.ts) bzw. Serien-Etappen
 * (`storyProgress`). Es gibt KEIN neues Servier-Format und keinen Umbau an
 * Manifest oder Ledger — Arcs sind reine Verkettung + Fälligkeit.
 *
 * TN-E1: reine, getestete Primitive + leere Registry. Verdrahtung in den
 * Generatoren ist TN-E2; der Pilot-Arc kommt in TN-E3.
 */
import type { Lang, Stufe } from "./account";
import { contentStufenFor } from "./account";
import type { Lernweg } from "./lernweg";
import { passtLernweg } from "./corpus";
import { seenHas, type StoryProgress } from "./ledger";

/** Rolle eines Schritts im Strang (Reihenfolge-Konvention: lehren zuerst). */
export type ArcRolle = "lehren" | "wiederholen" | "vertiefen" | "belohnen";

/** Verweis auf einen Korpus-Baustein über seine stabile Identität. */
export interface ArcBausteinRef {
  kind: string;
  text: string;
}

export interface ArcStep {
  rolle: ArcRolle;
  /**
   * Korpus-Bausteine dieses Schritts. ZWEI Einträge = Frage/Antwort-PAAR —
   * der Generator serviert sie ZUSAMMENHÄNGEND in derselben Runde (TN-E2).
   * Der Schritt gilt als erledigt, wenn ALLE seine Bausteine „gesehen" sind
   * (Bitset `seenBausteine`).
   */
  bausteine?: ArcBausteinRef[];
  /**
   * Alternativ: eine Serien-Etappe als Voraussetzung („lehren" über die
   * Bücherei). Der Schritt ist erledigt, sobald das Kind die Etappe gelesen
   * hat (`storyProgress[slug].etappe > etappe` bzw. Serie fertig). Solche
   * Schritte werden NICHT serviert — sie warten nur.
   */
  serieRef?: { slug: string; etappe: number };
  /**
   * Mindestabstand in RUNDEN zum Abschluss des Vorschritts (Default
   * {@link ARC_DELAY_DEFAULT}). Für den ersten Schritt ohne Bedeutung.
   */
  delayRounds?: number;
}

export interface Arc {
  /** Stabile, sprechende ID (kebab-case), z. B. "spinne". */
  id: string;
  /** Thema für Anzeige/Doku, z. B. "Die Spinne". */
  topic: string;
  lang: Lang;
  stufen: Stufe[];
  /**
   * ★ E4a (24.09.2026, Bauplan §6.2/§10): Nur auf DIESEM Lernweg servieren -
   * fehlt das Feld (jeder heutige Strang), gilt er auf BEIDEN Wegen. Siehe
   * `CorpusItem.nurWeg`/`Serie.nurWeg` für dieselbe Regel bei Korpus/Serien.
   */
  nurWeg?: Lernweg;
  /** Geordnete Schritte; Konvention: Schritt 0 hat Rolle "lehren". */
  steps: ArcStep[];
}

/** §10-Default: Mindestabstand zwischen zwei Arc-Schritten (in Runden). */
export const ARC_DELAY_DEFAULT = 3;
/** §10-Default: höchstens so viele Arc-Schritte pro Runde servieren. */
export const ARC_MAX_PER_ROUND = 2;

/** Fortschritt eines Kindes je Strang (additiv in TypingProgress.arcProgress). */
export interface ArcState {
  /** Index des als NÄCHSTES fälligen Schritts (0-basiert). */
  step: number;
  /**
   * `roundsTotal`-Stand, bei dem der letzte Schritt erledigt wurde
   * (−1 = noch keiner — der erste Schritt ist sofort fällig).
   */
  lastRound: number;
}

export type ArcProgress = Record<string, ArcState>;

/** Kontext, gegen den Fälligkeit geprüft wird (bewusst als Funktions-Parameter,
 * damit die Primitive rein und ohne Korpus-Import testbar bleiben). */
export interface ArcContext {
  /** „gesehen"-Bitset (`decodeSeen(progress.seenBausteine)`). */
  seen: Uint8Array;
  /** Manifest-Index eines Bausteins (corpusIndexOf) — undefined = unbekannt. */
  indexOf: (kind: string, text: string) => number | undefined;
  story: StoryProgress | undefined;
  /** Bisheriger Rundenzähler des Kindes (`progress.roundsTotal ?? 0`). */
  roundsTotal: number;
}

/** Aktueller Stand eines Strangs (Default: vor Schritt 0). */
export function arcStateFor(progress: ArcProgress | undefined, id: string): ArcState {
  const s = progress?.[id];
  if (!s) return { step: 0, lastRound: -1 };
  return { step: Math.max(0, s.step | 0), lastRound: Math.max(-1, s.lastRound | 0) };
}

/** Ist ein Strang komplett durch? */
export function isArcDone(arc: Arc, state: ArcState): boolean {
  return state.step >= arc.steps.length;
}

/** Sind alle Bausteine eines Schritts „gesehen" (getippt)? */
export function arcStepErledigt(step: ArcStep, ctx: ArcContext): boolean {
  if (step.serieRef) {
    const st = ctx.story?.[step.serieRef.slug];
    if (!st) return false;
    return !!st.done || (st.etappe | 0) > step.serieRef.etappe;
  }
  if (step.bausteine && step.bausteine.length) {
    return step.bausteine.every((b) => {
      const idx = ctx.indexOf(b.kind, b.text);
      return idx !== undefined && seenHas(ctx.seen, idx);
    });
  }
  return false; // leerer Schritt kann nie erledigt sein (validateArc fängt das)
}

/**
 * Rückt den Strang um einen Schritt vor (rein). `lastRound` = jetzt — davon
 * zählt der Mindestabstand des Folgeschritts.
 */
export function advanceArc(
  progress: ArcProgress | undefined,
  arc: Arc,
  roundsTotal: number,
): ArcProgress {
  const cur = arcStateFor(progress, arc.id);
  const step = Math.min(arc.steps.length, cur.step + 1);
  return { ...(progress ?? {}), [arc.id]: { step, lastRound: roundsTotal } };
}

/**
 * Zieht den Strang über alle Schritte vor, die BEREITS erledigt sind — z. B.
 * eine gelesene Serien-Etappe (serieRef) oder Bausteine, die das Kind schon
 * auf normalem Weg getippt hat. So kann die Engine (TN-E2) jede Runde einfach
 * zuerst `arcAutoAdvance` rufen und dann mit `arcDueStep` nachsehen, was zu
 * servieren ist. Rein; gibt (ggf. unveränderten) Fortschritt zurück.
 */
export function arcAutoAdvance(
  progress: ArcProgress | undefined,
  arc: Arc,
  ctx: ArcContext,
): ArcProgress {
  let p = progress ?? {};
  let cur = arcStateFor(p, arc.id);
  while (!isArcDone(arc, cur) && arcStepErledigt(arc.steps[cur.step], ctx)) {
    p = advanceArc(p, arc, ctx.roundsTotal);
    cur = arcStateFor(p, arc.id);
  }
  return p;
}

/**
 * Der aktuell FÄLLIGE, SERVIERBARE Schritt eines Strangs — oder `null`, wenn
 * (a) der Strang durch ist, (b) der Mindestabstand seit dem Vorschritt noch
 * nicht verstrichen ist, (c) der fällige Schritt ein warteender `serieRef`-
 * Schritt ist (der wird gelesen, nicht serviert) oder (d) einer seiner
 * Bausteine im Manifest fehlt (Autorenfehler — Tests fangen das, zur Laufzeit
 * wird der Strang einfach still).
 */
export function arcDueStep(arc: Arc, state: ArcState, ctx: ArcContext): ArcStep | null {
  if (isArcDone(arc, state)) return null;
  const step = arc.steps[state.step];
  if (step.serieRef) return null;
  if (!step.bausteine || !step.bausteine.length) return null;
  if (state.lastRound >= 0) {
    const delay = step.delayRounds ?? ARC_DELAY_DEFAULT;
    if (ctx.roundsTotal - state.lastRound < delay) return null;
  }
  if (step.bausteine.some((b) => ctx.indexOf(b.kind, b.text) === undefined)) return null;
  return step;
}

/**
 * Strukturelle Gültigkeit eines Strangs (für Tests/Lints, §6): nicht leer,
 * Schritt 0 lehrt, jeder Schritt hat ENTWEDER 1–2 Bausteine ODER einen
 * serieRef, „wiederholen"-Schritte mit 2 Bausteinen sind das Frage/Antwort-
 * Paar (mehr als 2 ist verboten — Paare müssen in eine Runde passen).
 * Liefert die Liste der Verstöße (leer = gültig).
 */
export function validateArc(arc: Arc): string[] {
  const errs: string[] = [];
  if (!arc.id || !/^[a-z0-9-]+$/.test(arc.id)) errs.push(`${arc.id}: ID fehlt oder nicht kebab-case`);
  if (!arc.steps.length) errs.push(`${arc.id}: keine Schritte`);
  if (!arc.stufen.length) errs.push(`${arc.id}: keine Stufen`);
  if (arc.steps.length && arc.steps[0].rolle !== "lehren")
    errs.push(`${arc.id}: Schritt 0 muss "lehren" sein`);
  arc.steps.forEach((s, i) => {
    const hasB = !!(s.bausteine && s.bausteine.length);
    if (hasB === !!s.serieRef)
      errs.push(`${arc.id}[${i}]: genau EINES von bausteine/serieRef nötig`);
    if (s.bausteine && s.bausteine.length > 2)
      errs.push(`${arc.id}[${i}]: höchstens 2 Bausteine (Frage/Antwort-Paar)`);
    if (s.serieRef && s.rolle !== "lehren")
      errs.push(`${arc.id}[${i}]: serieRef nur für "lehren"-Schritte`);
    if (s.delayRounds !== undefined && (!Number.isInteger(s.delayRounds) || s.delayRounds < 1))
      errs.push(`${arc.id}[${i}]: delayRounds muss ganze Zahl >= 1 sein`);
  });
  return errs;
}

/**
 * Registry aller Themenstränge — append-only wie der Korpus. Inhalts-Chargen
 * (TN-E4 ff.) hängen HINTEN an.
 *
 * Pilot „Die Spinne" (TN-E3): knüpft an die bestehende Wissens-Serie
 * `die-spinne` an. Schritt 0 wartet, bis das Kind Etappe 1 der Serie gelesen
 * hat (dort stehen „acht Beine" und „kein Insekt"); danach kommen — mit
 * Abstand — dieselben Inhalte als FRAGE in anderen Worten zurück, dann eine
 * Vertiefung und zuletzt ein Witz als Belohnung. Die Zeilen selbst stehen in
 * `corpusWiederkehr.ts` (normale Korpus-Bausteine).
 */
export const ARCS: Arc[] = [
  {
    id: "spinne",
    topic: "Die Spinne",
    lang: "de",
    stufen: ["kids", "teens"],
    steps: [
      // Voraussetzung: Etappe 1 (Index 0) der Wissens-Serie ist gelesen.
      { rolle: "lehren", serieRef: { slug: "die-spinne", etappe: 0 } },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "fakt", text: "Weißt du es noch? Wie viele Beine trägt eine Spinne?" },
          { kind: "fakt", text: "Acht Beine hat sie. Ein Insekt kommt mit sechs aus." },
        ],
      },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "fakt", text: "Kurze Frage: Zählt die Spinne zu den Insekten?" },
          { kind: "fakt", text: "Nein, sie ist ein Spinnentier. Ihr Körper hat zwei Teile." },
        ],
        delayRounds: 5,
      },
      {
        rolle: "vertiefen",
        bausteine: [
          { kind: "wissen", text: "Spinnenseide ist erstaunlich reißfest und dabei federleicht." },
        ],
        delayRounds: 5,
      },
      {
        rolle: "belohnen",
        bausteine: [
          { kind: "witz", text: "Warum sitzt die Spinne am Rechner? Sie prüft ihr Netz." },
        ],
        delayRounds: 4,
      },
    ],
  },
  // ── TN-E4: zwei Stränge für die Altersstufe c (13–15). Der Lehr-Schritt sind
  // hier KORPUS-Zeilen (keine Serie): drei Fakten, die zusammen die Grundlage
  // legen; die Wiederkehr-Fragen greifen sie später in anderen Worten auf.
  {
    id: "tn-de-c-iss",
    topic: "Leben auf der Raumstation",
    lang: "de",
    stufen: ["teens"],
    steps: [
      {
        rolle: "lehren",
        bausteine: [
          { kind: "fakt", text: "Eine Runde um die Erde schafft die ISS in ungefähr neunzig Minuten." },
          { kind: "fakt", text: "Auf der ISS schwebt alles, weil die Station im freien Fall um die Erde rast." },
        ],
      },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "fakt", text: "Kurze Frage: Wie lange dauert eine Erdumrundung der Raumstation?" },
          { kind: "fakt", text: "Rund anderthalb Stunden. Deshalb wechseln dort Tag und Nacht im Eiltempo." },
        ],
      },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "fakt", text: "Warum schweben Menschen an Bord, obwohl die Erde sie anzieht?" },
          { kind: "fakt", text: "Weil Station und Besatzung gemeinsam fallen, während sie um die Erde rasen." },
        ],
        delayRounds: 4,
      },
      {
        rolle: "vertiefen",
        bausteine: [
          { kind: "fakt", text: "In der Schwerelosigkeit bauen Muskeln ab, darum trainiert die Besatzung täglich." },
        ],
        delayRounds: 5,
      },
      {
        rolle: "belohnen",
        bausteine: [
          { kind: "spruch", text: "Motto der Raumstation: Wer nichts festbindet, sucht es später an der Decke." },
        ],
        delayRounds: 4,
      },
    ],
  },
  {
    id: "tn-de-c-koerper",
    topic: "Was der Körper bei Anstrengung macht",
    lang: "de",
    stufen: ["teens"],
    steps: [
      {
        rolle: "lehren",
        bausteine: [
          { kind: "fakt", text: "Ein erwachsenes Herz schlägt in Ruhe etwa siebzig Mal pro Minute." },
          { kind: "fakt", text: "Muskeln können nur ziehen, niemals schieben." },
        ],
      },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "fakt", text: "Weißt du es noch? Kann ein Muskel auch drücken?" },
          { kind: "fakt", text: "Nein, Ziehen ist alles; für die Gegenbewegung gibt es einen zweiten Muskel." },
        ],
      },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "fakt", text: "Frage zum Puls: Wie oft schlägt ein Herz in Ruhe pro Minute?" },
          { kind: "fakt", text: "Rund siebzig Mal. Unter Belastung schlägt es deutlich schneller." },
        ],
        delayRounds: 4,
      },
      {
        rolle: "vertiefen",
        bausteine: [
          { kind: "fakt", text: "Ausdauertraining macht das Herz kräftiger, deshalb schlägt es ruhiger." },
        ],
        delayRounds: 5,
      },
      {
        rolle: "belohnen",
        bausteine: [
          { kind: "spruch", text: "Bizeps und Trizeps sind sich einig: Einer von beiden zieht immer." },
        ],
        delayRounds: 4,
      },
    ],
  },
  // ── TN-E7: englische Stränge an den beiden neuen Wissens-Serien. Der
  // Lehr-Schritt ist hier eine SERIEN-Etappe (Bücherei), die Wiederkehr kommt
  // im Training — so verzahnen sich beide Modi auch auf Englisch.
  {
    id: "arc-en-space",
    topic: "A Trip Through Space",
    lang: "en",
    // 21.08. (Charge I2b): `kids` abgegeben, weil der Lehr-Schritt eine
    // Etappe dieser Serie ist - und die steht der kids-Stufe nicht mehr offen.
    stufen: ["teens", "erwachsen"],
    steps: [
      { rolle: "lehren", serieRef: { slug: "a-trip-through-space", etappe: 0 } },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "wissen", text: "Do you remember? How old is the sunlight that reaches your window?" },
          { kind: "wissen", text: "About eight minutes, because that is how long its journey takes." },
        ],
      },
      {
        rolle: "vertiefen",
        bausteine: [
          { kind: "fakt", text: "The next star after the Sun is so far away that its light travels for years." },
        ],
        delayRounds: 5,
      },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "wissen", text: "Why do we never get to see the back of the Moon from our garden?" },
          { kind: "wissen", text: "It turns once while it circles us, so one side always looks away." },
        ],
        delayRounds: 4,
      },
      {
        rolle: "belohnen",
        bausteine: [
          { kind: "witz", text: "Why did the Sun never go to school? Because it was already a bright star." },
        ],
        delayRounds: 4,
      },
    ],
  },
  {
    id: "arc-en-sleep",
    topic: "How Animals Sleep",
    lang: "en",
    // 21.08. (Charge I2b): `kids` abgegeben, weil der Lehr-Schritt eine
    // Etappe dieser Serie ist - und die steht der kids-Stufe nicht mehr offen.
    stufen: ["teens", "erwachsen"],
    steps: [
      { rolle: "lehren", serieRef: { slug: "how-animals-sleep", etappe: 2 } },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "wissen", text: "Do you remember? Why can a dolphin never fall asleep completely?" },
          { kind: "wissen", text: "It has to decide to breathe, so one half of its brain stays awake." },
        ],
      },
      {
        rolle: "vertiefen",
        bausteine: [
          { kind: "fakt", text: "Seals can rest half their brain at sea and both halves once they are on land." },
        ],
        delayRounds: 5,
      },
      {
        rolle: "wiederholen",
        bausteine: [
          { kind: "wissen", text: "How can a sleeping bat hold on for hours without getting tired?" },
          { kind: "wissen", text: "Its own weight closes the claws, so hanging needs no muscle work." },
        ],
        delayRounds: 4,
      },
      {
        rolle: "belohnen",
        bausteine: [
          { kind: "witz", text: "A bat told me the whole world looks better upside down. I let it hang." },
        ],
        delayRounds: 4,
      },
    ],
  },
];

/**
 * Stränge für Stufe+Sprache (Servier-Filter der Engine, TN-E2).
 *
 * @param lernweg ★ E4a (24.09.2026, Bauplan §6.2/§10): Pflicht, kein stiller
 *   Rückfall (wie `corpusItemsFor`/`serienForStufe`). Filtert Stränge mit
 *   gesetztem `Arc.nurWeg` auf den eigenen Weg; ein Strang ohne das Feld gilt
 *   weiter auf BEIDEN Wegen (jeder heutige Strang).
 */
export function arcsFor(stufe: Stufe, lang: Lang, lernweg: Lernweg): Arc[] {
  // S1: Konto-Stufe (kids/teens) → die alten Inhalts-Etiketten der Stränge.
  const etiketten = contentStufenFor(stufe);
  return ARCS.filter(
    (a) =>
      a.lang === lang &&
      etiketten.some((e) => a.stufen.includes(e)) &&
      passtLernweg(a.nurWeg, lernweg),
  );
}
