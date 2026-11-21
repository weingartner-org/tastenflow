/**
 * ★★ „GRUNDSTELLUNG PRÜFEN" (D-8, Didaktik-Entscheidung 27./28.09.2026).
 *
 * Vorbild ist „A sus puestos" aus Mekanta (ONCE, Spanien, für Kinder ab 5 mit
 * und ohne Blindheit): Das Kind legt die Finger auf die Grundreihe und drückt
 * ALLE ACHT Grundtasten zugleich. Das gelingt nur, wenn alle acht Finger
 * richtig liegen - so prüft ein Kind seine Grundstellung selbst, ohne zu
 * sehen und ohne Lehrkraft (Recherche `didaktik-spanisch.md` §8.1, E12).
 *
 * Diese Datei ist die ganze Logik, ohne React: welche acht Tasten es sind,
 * wie ein Druck ausgewertet wird, und die Sätze in allen vier Sprachen. Das
 * Bauteil dazu steht in `components/typing/GrundstellungPruefen.tsx`.
 *
 * ── Welche acht Tasten ──────────────────────────────────────────────────────
 * Aus der TASTATUR, nicht aus einer Liste: Plätze 0-3 und 6-9 der Grundreihe
 * (`layout.rows[2]`) - dieselben Plätze, die `fingerWeg.ts` als Heimat der
 * Finger kennt. Damit stimmt es auf jeder Tastatur ohne eigene Tabelle:
 * QWERTZ a s d f j k l ö · US/UK a s d f j k l ; · AZERTY q s d f j k l m ·
 * Spanien/Lateinamerika a s d f j k l ñ · Schweiz-Französisch a s d f j k l é.
 * Ein Wächter vergleicht das mit der Grundreihe jedes Lernwegs
 * (`achteGrundtasteFuerLayout`, `tests/tastenflow-grundstellung.test.ts`).
 *
 * ── Was „gleichzeitig" heisst - und warum nicht strenger ────────────────────
 * ★★★ Viele Tastaturen melden NICHT acht Tasten auf einmal. Eine gewöhnliche
 * USB-Tastatur im Grundmodus meldet höchstens sechs; Folientastaturen
 * verschlucken Tasten, die in derselben Leitung liegen („Rollover"). Ein Kind,
 * das alles richtig macht, darf dafür nie „falsch" hören. Darum:
 *  • Ein VERSUCH dauert vom ersten Tastendruck, bis ALLE Tasten wieder
 *    losgelassen sind. Gezählt wird jede Taste, die in dieser Zeit ankam.
 *    Eine Taste, die die Tastatur erst meldet, wenn eine andere losgelassen
 *    wird (so machen es viele), zählt damit noch mit.
 *  • Sind alle acht gleichzeitig gedrückt, kommt das Ergebnis sofort - ohne
 *    auf das Loslassen zu warten.
 *  • Fehlen höchstens zwei Tasten und kam keine falsche dazu, heisst es
 *    freundlich „drück die fehlende Taste noch einmal" - und kommt sie binnen
 *    {@link NACHREICHEN_MS}, gilt die Grundstellung als richtig.
 *  • Wiederholte Tastendrücke (gedrückt halten) zählen nicht; Leertaste
 *    (Daumen), Umschalt, Strg, Alt und die Befehlstaste werden übergangen.
 *
 * ── Barrierefreiheit ───────────────────────────────────────────────────────
 * Das Ergebnis ist EIN Satz. Das Bauteil stellt ihn in ein Feld (Braillezeile,
 * bleibt stehen) und spricht ihn über `speakUi` - nie über einen
 * Live-Bereich, der beim Tippen eine Blitzmeldung auf die Braillezeile setzt.
 */
import type { Lang } from "./account";
import { FINGERS, fingerName, spokenLabel, type FingerId, type Hand } from "./fingers";
import { layoutIndex, layoutSprache, type KeyboardLayout } from "./layouts";
import { kleinFuer, } from "./sprachRegister";
import { stelleFuerCode } from "./anschlagDeuten";

/** Die Reihe der Grundtasten in `layout.rows`. */
const GRUNDREIHE = 2;

/** Die Plätze der acht Grundtasten in der Grundreihe (a s d f · j k l ö). */
const GRUND_PLAETZE = [0, 1, 2, 3, 6, 7, 8, 9] as const;

/** Die Finger dieser acht Plätze, in derselben Reihenfolge. */
const GRUND_FINGER: readonly FingerId[] = [
  "kleiner-links",
  "ring-links",
  "mittel-links",
  "zeige-links",
  "zeige-rechts",
  "mittel-rechts",
  "ring-rechts",
  "kleiner-rechts",
];

// ★ G4-NAHT (25.10.2026): die Code-Tabelle stand hier ABGESCHRIEBEN (Keyboard.tsx exportierte sie nicht); seit W1 steht sie
// EINMAL in `anschlagDeuten.ts` (`stelleFuerCode`) - dort kennt sie auch die Zusatztaste `IntlRo` (ABNT2).

/** Tasten, die bei der Prüfung nie mitzählen (Daumen, Zusatztasten). */
const UEBERGANGEN = new Set([
  " ", "Spacebar", "Shift", "Control", "Alt", "AltGraph", "Meta", "OS", "CapsLock",
  "Dead", "Unidentified", "Process",
]);

/** So lange darf eine fehlende Taste nachgereicht werden. */
export const NACHREICHEN_MS = 10_000;

/** Eine Taste an ihrem Platz auf der Tastatur. */
export interface TastenOrt {
  reihe: number;
  spalte: number;
  /** Das Zeichen, das die Taste auf dieser Tastatur trägt (klein). */
  zeichen: string;
}

/** Eine der acht Grundtasten. */
export interface Grundtaste extends TastenOrt {
  finger: FingerId;
}

const schluessel = (o: TastenOrt): string => `${o.reihe}:${o.spalte}`;

/** Die acht Grundtasten dieser Tastatur - links nach rechts. */
export function grundtastenFuer(layout: KeyboardLayout): Grundtaste[] {
  const reihe = layout.rows[GRUNDREIHE].keys;
  return GRUND_PLAETZE.map((spalte, i) => ({
    reihe: GRUNDREIHE,
    spalte,
    zeichen: reihe[spalte],
    finger: GRUND_FINGER[i],
  }));
}

/**
 * Wo liegt die gedrückte Taste? Zuerst über `code` (die PHYSISCHE Stelle -
 * die Finger liegen auf Stellen, nicht auf Zeichen); fehlt er (manche
 * Tablets), über das Zeichen. `null` für alles ausserhalb der vier
 * Buchstabenreihen und für die übergangenen Tasten.
 */
export function tastenOrtFuer(
  e: { code?: string; key: string },
  layout: KeyboardLayout,
): TastenOrt | null {
  if (UEBERGANGEN.has(e.key) || e.code === "Space") return null;
  if (e.code && e.code !== "Unidentified") {
    const s = stelleFuerCode(layout, e.code);
    return s ? { reihe: s.reihe, spalte: s.spalte, zeichen: layout.rows[s.reihe].keys[s.spalte] } : null;
  }
  const ch = kleinFuer(e.key, layoutSprache(layout)); // G2b-1: türkisch I ⇒ ı
  if (ch.length !== 1) return null;
  for (let r = 0; r < layout.rows.length; r++) {
    const spalte = layout.rows[r].keys.indexOf(ch);
    if (spalte >= 0) return { reihe: r, spalte, zeichen: ch };
  }
  return null;
}

/** Wo eine Reihe beginnt, in Tastenbreiten (wie `fingerWeg.ts`). */
function reihenBeginn(reihe: number, iso: boolean): number {
  if (reihe === 0) return 0;
  if (reihe === 1) return 1.5;
  if (reihe === 2) return 1.75;
  return iso ? 1.25 : 2.25;
}

/** Waagrechte Lage einer Taste in Tastenbreiten vom linken Rand. */
function xVon(o: TastenOrt, layout: KeyboardLayout): number {
  return reihenBeginn(o.reihe, !!layout.rows[1]?.right) + o.spalte;
}

/** Auf ganze Tasten gerundet - ohne „-0" (q liegt fast genau über a). */
const ganz = (x: number): number => Math.round(x) || 0;

/** Der Finger, der diese Taste im Zehnfingersystem drückt. */
function fingerVon(o: TastenOrt, layout: KeyboardLayout): FingerId | null {
  return layoutIndex(layout).finger.get(o.zeichen) ?? null;
}

// ── Die Auswertung ───────────────────────────────────────────────────────────

/** Ein einzelner Befund, aus dem ein Satz wird. */
export type Punkt =
  /** Eine ganze Hand liegt versetzt (alle vier Tasten gleich verschoben). */
  | { art: "hand"; hand: Hand; reihen: number; tasten: number }
  /** Ein Finger drückte eine andere Taste als seine Grundtaste. */
  | { art: "tausch"; finger: FingerId; soll: string; ist: string; reihen: number; tasten: number }
  /** Eine Grundtaste kam nicht an. */
  | { art: "fehlt"; finger: FingerId; soll: string }
  /** Eine Taste kam dazu, die keine Grundtaste ist. */
  | { art: "dazu"; ist: string };

export type BefundArt =
  /** Alle acht, nichts dazu. */
  | "richtig"
  /** Keine falsche Taste, höchstens zwei fehlen - bitte nachreichen (Rollover). */
  | "nachreichen"
  /** Keine falsche Taste, aber zu wenige angekommen. */
  | "zuWenig"
  /** Mindestens eine Taste lag daneben. */
  | "korrektur";

export interface Befund {
  art: BefundArt;
  punkte: Punkt[];
  /** Wie viele der acht Grundtasten angekommen sind. */
  angekommen: number;
  /** `richtig` erst nach dem Nachreichen einer fehlenden Taste. */
  nachgereicht?: boolean;
}

/** Höchstens so viele fehlende Tasten gelten als „die Tastatur hat sie verschluckt". */
const HOECHSTENS_VERSCHLUCKT = 2;

/**
 * Wertet EINEN Versuch aus: alle Tasten, die zwischen dem ersten Druck und
 * dem Loslassen der letzten ankamen.
 */
export function werteAus(gedrueckt: readonly TastenOrt[], layout: KeyboardLayout): Befund {
  const grund = grundtastenFuer(layout);
  const grundSchluessel = new Set(grund.map(schluessel));
  const da = new Map<string, TastenOrt>();
  for (const o of gedrueckt) da.set(schluessel(o), o);

  const fehlend = grund.filter((g) => !da.has(schluessel(g)));
  let fremd = [...da.values()].filter((o) => !grundSchluessel.has(schluessel(o)));
  const angekommen = grund.length - fehlend.length;

  if (fremd.length === 0) {
    if (fehlend.length === 0) return { art: "richtig", punkte: [], angekommen };
    const punkte: Punkt[] = fehlend.map((g) => ({ art: "fehlt", finger: g.finger, soll: g.zeichen }));
    const verschluckt = fehlend.length <= HOECHSTENS_VERSCHLUCKT;
    return { art: verschluckt ? "nachreichen" : "zuWenig", punkte, angekommen };
  }

  const punkte: Punkt[] = [];
  let offen = [...fehlend];

  /*
   * Zuerst die ganze Hand: Liegen die vier Tasten einer Hand alle gleich weit
   * daneben (s d f g statt a s d f), ist es EIN Befund, nicht vier.
   */
  for (const hand of ["links", "rechts"] as const) {
    const soll = grund.filter((g) => FINGERS[g.finger].hand === hand);
    const ist = [...da.values()].filter((o) => {
      const f = fingerVon(o, layout);
      return f !== null && f !== "daumen" && FINGERS[f].hand === hand;
    });
    if (ist.length !== soll.length) continue;
    const reihe = ist[0].reihe;
    const dc = Math.min(...ist.map((o) => o.spalte)) - Math.min(...soll.map((g) => g.spalte));
    if (reihe === GRUNDREIHE && dc === 0) continue;
    const verschoben = soll.every((g) => ist.some((o) => o.reihe === reihe && o.spalte === g.spalte + dc));
    if (!verschoben) continue;
    // Die Richtung an der echten Tastatur: Die Reihen sind gegeneinander
    // versetzt (q liegt fast genau über a, nicht eine Taste daneben).
    const vorher = soll[0];
    const nachher: TastenOrt = { reihe, spalte: vorher.spalte + dc, zeichen: "" };
    punkte.push({
      art: "hand",
      hand,
      reihen: GRUNDREIHE - reihe,
      tasten: ganz(xVon(nachher, layout) - xVon(vorher, layout)),
    });
    const handSchluessel = new Set(ist.map(schluessel));
    fremd = fremd.filter((o) => !handSchluessel.has(schluessel(o)));
    offen = offen.filter((g) => FINGERS[g.finger].hand !== hand);
  }

  // Dann Finger für Finger: Die falsche Taste gehört zum Finger der fehlenden.
  for (const g of [...offen]) {
    const i = fremd.findIndex((o) => fingerVon(o, layout) === g.finger);
    if (i < 0) continue;
    const o = fremd[i];
    fremd = fremd.filter((_, j) => j !== i);
    offen = offen.filter((x) => x !== g);
    punkte.push({
      art: "tausch",
      finger: g.finger,
      soll: g.zeichen,
      ist: o.zeichen,
      reihen: GRUNDREIHE - o.reihe,
      tasten: ganz(xVon(o, layout) - xVon(g, layout)),
    });
  }
  for (const g of offen) punkte.push({ art: "fehlt", finger: g.finger, soll: g.zeichen });
  for (const o of fremd) punkte.push({ art: "dazu", ist: o.zeichen });

  return { art: "korrektur", punkte, angekommen };
}

// ── Der Zustand über mehrere Tastendrücke ─────────────────────────────────────

export interface TastenEreignis {
  art: "down" | "up";
  code?: string;
  key: string;
  repeat?: boolean;
  /** Zeitpunkt in ms (für das Nachreichen). */
  zeit: number;
}

/**
 * Sammelt Tastendrücke zu Versuchen und liefert je Versuch GENAU EINEN Befund
 * (oder `null`, solange ein Versuch läuft). Ohne React - der Test fährt ihn
 * mit denselben Ereignissen, die das Bauteil bekommt.
 */
export class GrundstellungsPruefung {
  private gehalten = new Set<string>();
  private versuch = new Map<string, TastenOrt>();
  /** Das Ergebnis dieses Versuchs ist schon gemeldet (alle acht gehalten). */
  private gemeldet = false;
  /** Fehlende Tasten, die nachgereicht werden dürfen - und bis wann. */
  private nachzureichen: { schluessel: Set<string>; bis: number } | null = null;

  constructor(private readonly layout: KeyboardLayout) {}

  /** Ein Tastenereignis. Liefert einen Befund, wenn ein Versuch fertig ist. */
  taste(e: TastenEreignis): Befund | null {
    const o = tastenOrtFuer(e, this.layout);
    if (!o) return null;
    const k = schluessel(o);
    if (e.art === "down") {
      if (e.repeat) return null;
      this.gehalten.add(k);
      if (!this.gemeldet) this.versuch.set(k, o);
      // Alle acht gleichzeitig gehalten: sofort melden, nicht aufs Loslassen warten.
      if (!this.gemeldet && this.alleAchtGehalten()) {
        this.gemeldet = true;
        this.nachzureichen = null;
        return werteAus([...this.versuch.values()], this.layout);
      }
      return null;
    }
    // Loslassen
    this.gehalten.delete(k);
    if (this.gehalten.size > 0) return null;
    const versuch = [...this.versuch.values()];
    const warGemeldet = this.gemeldet;
    this.versuch.clear();
    this.gemeldet = false;
    if (warGemeldet || versuch.length === 0) return null;
    return this.werteVersuch(versuch, e.zeit);
  }

  /** Wird diese Taste gerade gehalten? (Für die Bildschirm-Anzeige.) */
  haelt(o: TastenOrt): boolean {
    return this.gehalten.has(schluessel(o));
  }

  /** Fokus verloren o. ä.: laufenden Versuch verwerfen (kein Befund). */
  zuruecksetzen(): void {
    this.gehalten.clear();
    this.versuch.clear();
    this.gemeldet = false;
    this.nachzureichen = null;
  }

  private alleAchtGehalten(): boolean {
    return grundtastenFuer(this.layout).every((g) => this.gehalten.has(schluessel(g)));
  }

  private werteVersuch(versuch: TastenOrt[], zeit: number): Befund {
    const n = this.nachzureichen;
    if (n && zeit <= n.bis && versuch.every((o) => n.schluessel.has(schluessel(o)))) {
      for (const o of versuch) n.schluessel.delete(schluessel(o));
      if (n.schluessel.size === 0) {
        this.nachzureichen = null;
        return { art: "richtig", punkte: [], angekommen: 8, nachgereicht: true };
      }
      const grund = grundtastenFuer(this.layout);
      const rest = grund.filter((g) => n.schluessel.has(schluessel(g)));
      return {
        art: "nachreichen",
        punkte: rest.map((g) => ({ art: "fehlt", finger: g.finger, soll: g.zeichen })),
        angekommen: grund.length - rest.length,
      };
    }
    const b = werteAus(versuch, this.layout);
    this.nachzureichen =
      b.art === "nachreichen"
        ? {
            schluessel: new Set(
              grundtastenFuer(this.layout)
                .filter((g) => b.punkte.some((p) => p.art === "fehlt" && p.finger === g.finger))
                .map(schluessel),
            ),
            bis: zeit + NACHREICHEN_MS,
          }
        : null;
    return b;
  }
}

// ── Die Sätze - je Sprache neu geschrieben, nicht übersetzt ───────────────────

interface Saetze {
  titel: string;
  /** Die Anleitung mit den Tasten dieser Tastatur. */
  anleitung: (links: string, rechts: string) => string;
  richtig: string;
  nachgereicht: string;
  /** Nachreichen: eine oder zwei Tasten (je mit Finger). */
  nachreichen: (tasten: readonly { taste: string; finger: string }[]) => string;
  zuWenig: (n: number) => string;
  tausch: (finger: string, soll: string, ist: string, richtung: string) => string;
  hand: (hand: Hand, richtung: string) => string;
  fehlt: (finger: string, soll: string) => string;
  dazu: (tasten: readonly string[]) => string;
  /** Alle acht waren da, dazu kam noch etwas. */
  nurDazu: (tasten: readonly string[]) => string;
  /** Nach einer Korrektur: wie man die Grundstellung wiederfindet. */
  nochmal: (f: string, j: string) => string;
  richtung: (reihen: number, tasten: number) => string;
  und: string;
}

const zahlDe = (n: number) => (n === 1 ? "eine" : n === 2 ? "zwei" : String(n));
const liste = (xs: readonly string[], und: string) =>
  xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} ${und} ${xs[xs.length - 1]}`;
const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * ★ O-PL (02.10.2026): die polnische Mehrzahl ohne Bruchzahlen - 1 `one`,
 * 2-4 und 22-24 … `few`, sonst `many` (Glossar §2.10a; hier zählen nur ganze
 * Tasten und Reihen, `other` kommt nicht vor). Bewusst hier und nicht über
 * `mehrzahl` aus `bedienSprache/texte`: `fingers.ts` misst dort einen
 * Ladekreis („texte is not a function").
 */
function formPl(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const zehner = n % 100;
  return n % 10 >= 2 && n % 10 <= 4 && (zehner < 12 || zehner > 14) ? few : many;
}

/**
 * ★ O-CS (03.10.2026): die tschechische Mehrzahl ohne Bruchzahlen - 1 `one`, 2-4
 * `few`, sonst (0, 5 und mehr) `other` (Glossar §2.11; hier zählen nur ganze
 * Tasten und Reihen, `many` kommt nicht vor). Bewusst hier und nicht über
 * `mehrzahl` aus `bedienSprache/texte`, aus demselben Grund wie {@link formPl}.
 */
function formCs(n: number, one: string, few: string, other: string): string {
  return n === 1 ? one : n >= 2 && n <= 4 ? few : other;
}

/** ★ O2-LIB (30.10.2026): Zahlwort für Reihen und Tasten, bulgarisch („един ред", „два реда", „3 реда"; Zählform nach der Zahl). */
const reihenBg = (n: number) => (n === 1 ? "един ред" : n === 2 ? "два реда" : `${n} реда`);

/** ★ O2-LIB (30.10.2026): „един клавиш", „два клавиша", „3 клавиша". */
const klavisheBg = (n: number) => (n === 1 ? "един клавиш" : n === 2 ? "два клавиша" : `${n} клавиша`);

/** ★ O2-LIB (30.10.2026): „μία σειρά · δύο σειρές" / „ένα πλήκτρο · δύο πλήκτρα" - Zahlwort mit Geschlecht (Glossar §2.10). */
function zahlWortEl(n: number, geschlecht: "f" | "n"): string {
  if (n === 1) return geschlecht === "f" ? "μία" : "ένα";
  if (n === 2) return "δύο";
  if (n === 3) return geschlecht === "f" ? "τρεις" : "τρία";
  if (n === 4) return geschlecht === "f" ? "τέσσερις" : "τέσσερα";
  return String(n);
}

/**
 * ★ O2-LIB (30.10.2026): die ukrainische Mehrzahlform für ganze Tasten und Reihen - one 1, 21 …, few 2-4, 22-24 …, many
 * 0, 5-20 … (Glossar §2.11; hier zählen nur kleine ganze Zahlen). Bewusst hier und nicht über `mehrzahl` aus
 * `bedienSprache/texte`, aus demselben Grund wie die Formen der anderen Sprachen dieser Datei.
 */
function formUk(n: number, one: string, few: string, many: string): string {
  const r10 = n % 10;
  const r100 = n % 100;
  return r10 === 1 && r100 !== 11 ? one : r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14) ? few : many;
}

const SAETZE: Record<Lang, Saetze> = {
  de: {
    titel: "Grundstellung prüfen",
    anleitung: (links, rechts) =>
      `Leg die Finger auf die Grundreihe: links ${links}, rechts ${rechts}. Die Daumen ruhen auf der Leertaste. ` +
      "Dann drück alle acht Tasten zugleich und lass sie wieder los.",
    richtig: "Alle acht Finger liegen richtig.",
    nachgereicht: "Jetzt sind alle acht da. Alle acht Finger liegen richtig.",
    nachreichen: (t) =>
      t.length === 1
        ? `Fast. Die Taste ${t[0].taste} (${t[0].finger}) ist nicht angekommen - manche Tastaturen melden nicht alle acht Tasten auf einmal. Drück sie noch einmal.`
        : `Fast. Die Tasten ${liste(t.map((x) => `${x.taste} (${x.finger})`), "und")} sind nicht angekommen - manche Tastaturen melden nicht alle acht Tasten auf einmal. Drück sie noch einmal.`,
    zuWenig: (n) =>
      `Es ${n === 1 ? "ist nur eine" : `sind nur ${n}`} von acht Tasten angekommen. Leg alle acht Finger auf die Grundreihe und drück sie zugleich.`,
    tausch: (finger, soll, ist, richtung) => `${gross(finger)}: statt ${soll} kam ${ist} - der Finger liegt ${richtung}.`,
    hand: (hand, richtung) => `Die ${hand === "links" ? "linke" : "rechte"} Hand liegt ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: ${soll} fehlt.`,
    dazu: (t) => (t.length === 1 ? `Dazu kam noch ${t[0]}.` : `Dazu kamen noch ${liste(t, "und")}.`),
    nurDazu: (t) =>
      `Alle acht Grundtasten sind angekommen, dazu noch ${liste(t, "und")}. Die Finger liegen richtig - drück nur die acht Tasten der Grundreihe.`,
    nochmal: (f, j) => `Ertaste mit den Zeigefingern die kleinen Erhebungen auf ${f} und ${j} und versuch es noch einmal.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      if (reihen !== 0)
        teile.push(`${zahlDe(Math.abs(reihen))} ${Math.abs(reihen) === 1 ? "Reihe" : "Reihen"} zu weit ${reihen > 0 ? "vorne" : "hinten"}`);
      if (tasten !== 0)
        teile.push(`${zahlDe(Math.abs(tasten))} ${Math.abs(tasten) === 1 ? "Taste" : "Tasten"} zu weit ${tasten > 0 ? "rechts" : "links"}`);
      return teile.length ? teile.join(" und ") : "daneben";
    },
    und: "und",
  },
  en: {
    titel: "Check your home position",
    anleitung: (links, rechts) =>
      `Put your fingers on the home row: left hand on ${links}, right hand on ${rechts}. Your thumbs rest on the space bar. ` +
      "Then press all eight keys at the same time and let go.",
    richtig: "All eight fingers are in the right place.",
    nachgereicht: "Now all eight are there. All eight fingers are in the right place.",
    nachreichen: (t) =>
      t.length === 1
        ? `Nearly. The key ${t[0].taste} (${t[0].finger}) didn't come through - some keyboards can't report eight keys at once. Press it again.`
        : `Nearly. The keys ${liste(t.map((x) => `${x.taste} (${x.finger})`), "and")} didn't come through - some keyboards can't report eight keys at once. Press them again.`,
    zuWenig: (n) =>
      `Only ${n === 1 ? "one" : n} of the eight keys came through. Put all eight fingers on the home row and press them together.`,
    tausch: (finger, soll, ist, richtung) => `${gross(finger)}: ${ist} instead of ${soll} - your finger is ${richtung}.`,
    hand: (hand, richtung) => `Your ${hand === "links" ? "left" : "right"} hand is ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: ${soll} is missing.`,
    dazu: (t) => `${gross(liste(t, "and"))} came as well.`,
    nurDazu: (t) =>
      `All eight home keys came through, and ${liste(t, "and")} as well. Your fingers are in the right place - press only the eight keys of the home row.`,
    nochmal: (f, j) => `Feel for the small bumps on ${f} and ${j} with your index fingers and try again.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 1 ? "one" : n === 2 ? "two" : String(n));
      if (reihen !== 0)
        teile.push(`${zahl(Math.abs(reihen))} ${Math.abs(reihen) === 1 ? "row" : "rows"} too far ${reihen > 0 ? "forward" : "back"}`);
      if (tasten !== 0)
        teile.push(`${zahl(Math.abs(tasten))} ${Math.abs(tasten) === 1 ? "key" : "keys"} too far to the ${tasten > 0 ? "right" : "left"}`);
      return teile.length ? teile.join(" and ") : "off its key";
    },
    und: "and",
  },
  fr: {
    titel: "Vérifier la position de base",
    anleitung: (links, rechts) =>
      `Pose les doigts sur la rangée de base : à gauche ${links}, à droite ${rechts}. Les pouces reposent sur la barre d'espace. ` +
      "Puis appuie sur les huit touches en même temps et relâche-les.",
    richtig: "Les huit doigts sont bien placés.",
    nachgereicht: "Voilà les huit. Les huit doigts sont bien placés.",
    nachreichen: (t) =>
      t.length === 1
        ? `Presque. La touche ${t[0].taste} (${t[0].finger}) n'est pas arrivée - certains claviers ne transmettent pas huit touches à la fois. Appuie encore une fois dessus.`
        : `Presque. Les touches ${liste(t.map((x) => `${x.taste} (${x.finger})`), "et")} ne sont pas arrivées - certains claviers ne transmettent pas huit touches à la fois. Appuie encore une fois dessus.`,
    zuWenig: (n) =>
      `Seulement ${n === 1 ? "une touche" : `${n} touches`} sur huit ${n === 1 ? "est arrivée" : "sont arrivées"}. Pose les huit doigts sur la rangée de base et appuie sur toutes en même temps.`,
    tausch: (finger, soll, ist, richtung) => `${gross(finger)} : ${ist} au lieu de ${soll} - le doigt est ${richtung}.`,
    hand: (hand, richtung) => `La main ${hand === "links" ? "gauche" : "droite"} est ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)} : il manque ${soll}.`,
    dazu: (t) => (t.length === 1 ? `Il y avait aussi la touche ${t[0]}.` : `Il y avait aussi les touches ${liste(t, "et")}.`),
    nurDazu: (t) =>
      `Les huit touches de base sont arrivées, et aussi ${liste(t, "et")}. Les doigts sont bien placés - appuie seulement sur les huit touches de la rangée de base.`,
    nochmal: (f, j) => `Cherche du bout des index les petits reliefs des touches ${f} et ${j}, puis recommence.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number, fem: boolean) => (n === 1 ? (fem ? "une" : "un") : n === 2 ? "deux" : String(n));
      if (reihen !== 0)
        teile.push(`${zahl(Math.abs(reihen), true)} ${Math.abs(reihen) === 1 ? "rangée" : "rangées"} trop ${reihen > 0 ? "haut" : "bas"}`);
      if (tasten !== 0)
        teile.push(`${zahl(Math.abs(tasten), true)} ${Math.abs(tasten) === 1 ? "touche" : "touches"} trop à ${tasten > 0 ? "droite" : "gauche"}`);
      return teile.length ? teile.join(" et ") : "à côté";
    },
    und: "et",
  },
  es: {
    titel: "Comprobar la posición de base",
    anleitung: (links, rechts) =>
      `Pon los dedos en la fila guía: a la izquierda ${links}, a la derecha ${rechts}. Los pulgares descansan en la barra espaciadora. ` +
      "Luego pulsa las ocho teclas a la vez y suéltalas.",
    richtig: "Los ocho dedos están bien colocados.",
    nachgereicht: "Ya están las ocho. Los ocho dedos están bien colocados.",
    nachreichen: (t) =>
      t.length === 1
        ? `Casi. La tecla ${t[0].taste} (${t[0].finger}) no ha llegado - algunos teclados no transmiten ocho teclas a la vez. Púlsala otra vez.`
        : `Casi. Las teclas ${liste(t.map((x) => `${x.taste} (${x.finger})`), "y")} no han llegado - algunos teclados no transmiten ocho teclas a la vez. Púlsalas otra vez.`,
    zuWenig: (n) =>
      `Solo ${n === 1 ? "ha llegado una" : `han llegado ${n}`} de las ocho teclas. Pon los ocho dedos en la fila guía y púlsalas a la vez.`,
    tausch: (finger, soll, ist, richtung) => `${gross(finger)}: ${ist} en lugar de ${soll} - el dedo está ${richtung}.`,
    hand: (hand, richtung) => `La mano ${hand === "links" ? "izquierda" : "derecha"} está ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: falta la tecla ${soll}.`,
    dazu: (t) => (t.length === 1 ? `Además llegó la tecla ${t[0]}.` : `Además llegaron las teclas ${liste(t, "y")}.`),
    nurDazu: (t) =>
      `Han llegado las ocho teclas de la fila guía y, además, ${liste(t, "y")}. Los dedos están bien colocados - pulsa solo las ocho teclas de la fila guía.`,
    nochmal: (f, j) => `Busca con los índices las pequeñas marcas en relieve de la ${f} y la ${j} y vuelve a intentarlo.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 1 ? "una" : n === 2 ? "dos" : String(n));
      if (reihen !== 0)
        teile.push(`${zahl(Math.abs(reihen))} ${Math.abs(reihen) === 1 ? "fila" : "filas"} demasiado ${reihen > 0 ? "arriba" : "abajo"}`);
      if (tasten !== 0)
        teile.push(`${zahl(Math.abs(tasten))} ${Math.abs(tasten) === 1 ? "tecla" : "teclas"} demasiado a la ${tasten > 0 ? "derecha" : "izquierda"}`);
      return teile.length ? teile.join(" y ") : "fuera de su tecla";
    },
    und: "y",
  },
  // ★ O-IT (02.10.2026): neu auf Italienisch, tu - „riga di base", „posizione
  // base", „i rilievi su F e J" (Glossar §2.1).
  it: {
    titel: "Controlla la posizione base",
    anleitung: (links, rechts) =>
      `Metti le dita sulla riga di base: a sinistra ${links}, a destra ${rechts}. I pollici riposano sulla barra spaziatrice. ` +
      "Poi premi tutti e otto i tasti insieme e lasciali.",
    richtig: "Tutte e otto le dita sono al posto giusto.",
    nachgereicht: "Ora ci sono tutti e otto. Tutte e otto le dita sono al posto giusto.",
    nachreichen: (t) =>
      t.length === 1
        ? `Quasi. Il tasto ${t[0].taste} (${t[0].finger}) non è arrivato - alcune tastiere non trasmettono otto tasti insieme. Premilo di nuovo.`
        : `Quasi. I tasti ${liste(t.map((x) => `${x.taste} (${x.finger})`), "e")} non sono arrivati - alcune tastiere non trasmettono otto tasti insieme. Premili di nuovo.`,
    zuWenig: (n) =>
      `${n === 1 ? "È arrivato solo un tasto" : `Sono arrivati solo ${n} tasti`} su otto. Metti tutte e otto le dita sulla riga di base e premi i tasti insieme.`,
    tausch: (finger, soll, ist, richtung) => `${gross(finger)}: invece di ${soll} è arrivato ${ist} - il dito è ${richtung}.`,
    hand: (hand, richtung) => `La mano ${hand === "links" ? "sinistra" : "destra"} è ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: manca il tasto ${soll}.`,
    dazu: (t) => (t.length === 1 ? `In più è arrivato il tasto ${t[0]}.` : `In più sono arrivati i tasti ${liste(t, "e")}.`),
    nurDazu: (t) =>
      `Sono arrivati tutti e otto i tasti della riga di base e, in più, ${liste(t, "e")}. Le dita sono al posto giusto - premi solo gli otto tasti della riga di base.`,
    nochmal: (f, j) => `Con gli indici cerca i piccoli rilievi su ${f} e ${j} e riprova.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahlF = (n: number) => (n === 1 ? "una" : n === 2 ? "due" : String(n));
      const zahlM = (n: number) => (n === 1 ? "un" : n === 2 ? "due" : String(n));
      if (reihen !== 0)
        teile.push(`${zahlF(Math.abs(reihen))} ${Math.abs(reihen) === 1 ? "riga" : "righe"} troppo ${reihen > 0 ? "in alto" : "in basso"}`);
      if (tasten !== 0)
        teile.push(`${zahlM(Math.abs(tasten))} ${Math.abs(tasten) === 1 ? "tasto" : "tasti"} troppo a ${tasten > 0 ? "destra" : "sinistra"}`);
      return teile.length ? teile.join(" e ") : "fuori posto";
    },
    und: "e",
  },
  // ★ O-PL (02.10.2026): neu auf Polnisch, ty - „rząd podstawowy", „pozycja
  // podstawowa", „wypustki na F i J" (Glossar §2.1). Kein Satz über das Kind
  // im Präteritum: was angekommen ist, sagt die Taste („dotarł") oder die
  // -no-Form („naciśnięto"). Finger und Tasten nach dem Doppelpunkt.
  pl: {
    titel: "Sprawdź pozycję podstawową",
    anleitung: (links, rechts) =>
      `Połóż palce na rzędzie podstawowym. Lewa ręka: ${links}. Prawa ręka: ${rechts}. Kciuki leżą na spacji. ` +
      "Potem naciśnij wszystkie osiem klawiszy naraz i puść je.",
    richtig: "Wszystkie palce leżą dobrze.",
    nachgereicht: "Teraz dotarły wszystkie klawisze. Wszystkie palce leżą dobrze.",
    nachreichen: (t) =>
      t.length === 1
        ? `Prawie. Klawisz ${t[0].taste} (${t[0].finger}) nie dotarł - niektóre klawiatury nie przekazują ośmiu klawiszy naraz. Naciśnij go jeszcze raz.`
        : `Prawie. Klawisze ${liste(t.map((x) => `${x.taste} (${x.finger})`), "i")} nie dotarły - niektóre klawiatury nie przekazują ośmiu klawiszy naraz. Naciśnij je jeszcze raz.`,
    zuWenig: (n) =>
      `${formPl(n, "Dotarł tylko jeden klawisz", `Dotarły tylko ${n} klawisze`, `Dotarło tylko ${n} klawiszy`)} z ośmiu. ` +
      "Połóż wszystkie osiem palców na rzędzie podstawowym i naciśnij klawisze naraz.",
    tausch: (finger, soll, ist, richtung) => `${gross(finger)}: zamiast ${soll} naciśnięto ${ist} - palec jest ${richtung}.`,
    hand: (hand, richtung) => `${hand === "links" ? "Lewa" : "Prawa"} ręka jest ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: brakuje klawisza ${soll}.`,
    dazu: (t) =>
      t.length === 1 ? `Dodatkowo naciśnięto klawisz ${t[0]}.` : `Dodatkowo naciśnięto klawisze ${liste(t, "i")}.`,
    nurDazu: (t) =>
      `Wszystkie klawisze podstawowe dotarły, a dodatkowo naciśnięto ${liste(t, "i")}. Palce leżą dobrze - naciśnij tylko osiem klawiszy rzędu podstawowego.`,
    nochmal: (f, j) => `Wyczuj palcami wskazującymi małe wypustki na ${f} i ${j} i spróbuj jeszcze raz.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 1 ? "jeden" : n === 2 ? "dwa" : n === 3 ? "trzy" : n === 4 ? "cztery" : String(n));
      if (reihen !== 0) {
        const n = Math.abs(reihen);
        teile.push(`o ${zahl(n)} ${formPl(n, "rząd", "rzędy", "rzędów")} za ${reihen > 0 ? "wysoko" : "nisko"}`);
      }
      if (tasten !== 0) {
        const n = Math.abs(tasten);
        teile.push(`o ${zahl(n)} ${formPl(n, "klawisz", "klawisze", "klawiszy")} za bardzo w ${tasten > 0 ? "prawo" : "lewo"}`);
      }
      return teile.length ? teile.join(" i ") : "nie na swoim miejscu";
    },
    und: "i",
  },
  // ★ O-TR (02.10.2026): neu auf Türkisch, sen - „temel sıra", „temel konum",
  // „F ve J tuşlarındaki çıkıntılar" (Glossar §2.1). Die Endung hängt an
  // „tuş", nie an der Taste oder Zahl (Regel 6): „${soll} tuşu eksik",
  // „Sekiz tuştan sadece 3 tanesi geldi". Nach einer Zahl Einzahl („2 sıra").
  tr: {
    titel: "Temel konumu kontrol et",
    anleitung: (links, rechts) =>
      `Parmaklarını temel sıraya yerleştir. Sol el: ${links}. Sağ el: ${rechts}. Başparmakların boşluk çubuğunun üstünde durur. ` +
      "Sonra sekiz tuşa aynı anda bas ve bırak.",
    richtig: "Sekiz parmağın hepsi doğru yerde.",
    nachgereicht: "Şimdi sekiz tuşun hepsi geldi. Sekiz parmağın hepsi doğru yerde.",
    nachreichen: (t) =>
      t.length === 1
        ? `Neredeyse. ${t[0].taste} tuşu (${t[0].finger}) gelmedi - bazı klavyeler sekiz tuşu aynı anda iletemez. Bu tuşa bir kez daha bas.`
        : `Neredeyse. Şu tuşlar gelmedi: ${liste(t.map((x) => `${x.taste} (${x.finger})`), "ve")} - bazı klavyeler sekiz tuşu aynı anda iletemez. Bu tuşlara bir kez daha bas.`,
    zuWenig: (n) =>
      `Sekiz tuştan sadece ${n === 1 ? "bir" : n} tanesi geldi. Sekiz parmağını da temel sıraya koy ve tuşlara aynı anda bas.`,
    tausch: (finger, soll, ist, richtung) => `${gross(finger)}: ${soll} yerine ${ist} geldi - parmak ${richtung}.`,
    hand: (hand, richtung) => `${hand === "links" ? "Sol" : "Sağ"} el ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: ${soll} tuşu eksik.`,
    dazu: (t) =>
      t.length === 1 ? `Ayrıca ${t[0]} tuşuna da basıldı.` : `Ayrıca şu tuşlara da basıldı: ${liste(t, "ve")}.`,
    nurDazu: (t) =>
      `Sekiz temel tuşun hepsi geldi, ayrıca şunlar da: ${liste(t, "ve")}. Parmakların doğru yerde - sadece temel sıradaki sekiz tuşa bas.`,
    nochmal: (f, j) => `İşaret parmaklarınla ${f} ve ${j} tuşlarındaki çıkıntıları bul ve tekrar dene.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 1 ? "bir" : n === 2 ? "iki" : n === 3 ? "üç" : String(n));
      if (reihen !== 0) teile.push(`${zahl(Math.abs(reihen))} sıra fazla ${reihen > 0 ? "yukarıda" : "aşağıda"}`);
      if (tasten !== 0) teile.push(`${zahl(Math.abs(tasten))} tuş fazla ${tasten > 0 ? "sağda" : "solda"}`);
      return teile.length ? teile.join(" ve ") : "yerinde değil";
    },
    und: "ve",
  },
  // ★ O-CS (03.10.2026): neu auf Tschechisch, ty - „základní řada", „základní
  // postavení", „hmatové výstupky na F a J" (Glossar §2.1). Kein Satz über das
  // Kind in der Vergangenheit: was angekommen ist, sagt die TASTE („klávesa F
  // nedorazila"), jede Taste mit „klávesa" davor (Regel 11). Die Zahl der
  // angekommenen Tasten mit Mehrzahl samt Verb („Dorazily jen 3 klávesy z osmi.").
  cs: {
    titel: "Kontrola základního postavení",
    anleitung: (links, rechts) =>
      `Polož prsty na základní řadu. Levá ruka: ${links}. Pravá ruka: ${rechts}. Palce leží na mezerníku. ` +
      "Potom stiskni všech osm kláves najednou a zase je pusť.",
    richtig: "Všech osm prstů leží správně.",
    nachgereicht: "Teď dorazilo všech osm kláves. Všech osm prstů leží správně.",
    nachreichen: (t) =>
      t.length === 1
        ? `Skoro. Klávesa ${t[0].taste} (${t[0].finger}) nedorazila - některé klávesnice nepošlou osm kláves najednou. Stiskni ji ještě jednou.`
        : `Skoro. Tyto klávesy nedorazily: ${liste(t.map((x) => `${x.taste} (${x.finger})`), "a")} - některé klávesnice nepošlou osm kláves najednou. Stiskni je ještě jednou.`,
    zuWenig: (n) =>
      `${n === 0 ? "Nedorazila žádná klávesa" : formCs(n, "Dorazila jen jedna klávesa", `Dorazily jen ${n} klávesy`, `Dorazilo jen ${n} kláves`)} z osmi. ` +
      "Polož všech osm prstů na základní řadu a stiskni klávesy najednou.",
    tausch: (finger, soll, ist, richtung) =>
      `${gross(finger)}: místo klávesy ${soll} dorazila klávesa ${ist} - prst leží ${richtung}.`,
    hand: (hand, richtung) => `${hand === "links" ? "Levá" : "Pravá"} ruka leží ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: chybí klávesa ${soll}.`,
    dazu: (t) =>
      t.length === 1 ? `Navíc dorazila klávesa ${t[0]}.` : `Navíc dorazily klávesy ${liste(t, "a")}.`,
    nurDazu: (t) =>
      `Dorazilo všech osm kláves základní řady a navíc ${liste(t, "a")}. Prsty leží správně - stiskni jen osm kláves základní řady.`,
    nochmal: (f, j) => `Ukazováčky nahmatej hmatové výstupky na klávesách ${f} a ${j} a zkus to znovu.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 1 ? "jednu" : n === 2 ? "dvě" : n === 3 ? "tři" : n === 4 ? "čtyři" : String(n));
      if (reihen !== 0) {
        const n = Math.abs(reihen);
        teile.push(`o ${zahl(n)} ${formCs(n, "řadu", "řady", "řad")} příliš ${reihen > 0 ? "vysoko" : "nízko"}`);
      }
      if (tasten !== 0) {
        const n = Math.abs(tasten);
        teile.push(`o ${zahl(n)} ${formCs(n, "klávesu", "klávesy", "kláves")} příliš ${tasten > 0 ? "vpravo" : "vlevo"}`);
      }
      return teile.length ? teile.join(" a ") : "mimo své místo";
    },
    und: "a",
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    titel: "Проверка на изходната позиция",
    anleitung: (links, rechts) =>
      `Постави пръстите на основния ред. Лява ръка: ${links}. Дясна ръка: ${rechts}. Палците почиват на интервала. ` +
      "После натисни всичките осем клавиша едновременно и ги пусни.",
    richtig: "Всичките осем пръста лежат правилно.",
    nachgereicht: "Сега са дошли всичките осем клавиша. Всичките осем пръста лежат правилно.",
    nachreichen: (t) =>
      t.length === 1
        ? `Почти. Клавишът ${t[0].taste} (${t[0].finger}) не дойде - някои клавиатури не предават осем клавиша наведнъж. Натисни го още веднъж.`
        : `Почти. Тези клавиши не дойдоха: ${liste(t.map((x) => `${x.taste} (${x.finger})`), "и")} - някои клавиатури не предават осем клавиша наведнъж. Натисни ги още веднъж.`,
    zuWenig: (n) =>
      `${n === 0 ? "Не дойде нито един клавиш" : n === 1 ? "Дойде само един клавиш" : `Дойдоха само ${n} клавиша`} от осемте. ` +
      "Постави всичките осем пръста на основния ред и натисни клавишите едновременно.",
    tausch: (finger, soll, ist, richtung) =>
      `${gross(finger)}: вместо клавиш ${soll} дойде клавиш ${ist} - пръстът лежи ${richtung}.`,
    hand: (hand, richtung) => `${hand === "links" ? "Лявата" : "Дясната"} ръка лежи ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: липсва клавиш ${soll}.`,
    dazu: (t) =>
      t.length === 1 ? `Дойде и клавиш ${t[0]}.` : `Дойдоха и клавишите ${liste(t, "и")}.`,
    nurDazu: (t) =>
      `Дойдоха всичките осем основни клавиша и още ${liste(t, "и")}. Пръстите лежат правилно - натисни само осемте клавиша на основния ред.`,
    nochmal: (f, j) => `Напипай с показалците издатините на клавишите ${f} и ${j} и опитай пак.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      if (reihen !== 0) teile.push(`${reihenBg(Math.abs(reihen))} клавиши твърде ${reihen > 0 ? "нагоре" : "надолу"}`);
      if (tasten !== 0) teile.push(`${klavisheBg(Math.abs(tasten))} твърде ${tasten > 0 ? "надясно" : "наляво"}`);
      return teile.length ? teile.join(" и ") : "извън мястото си";
    },
    und: "и",
  },
  el: {
    titel: "Έλεγχος βασικής θέσης",
    anleitung: (links, rechts) =>
      `Βάλε τα δάχτυλά σου στη βασική σειρά. Αριστερό χέρι: ${links}. Δεξί χέρι: ${rechts}. Οι αντίχειρες ακουμπούν στο πλήκτρο διαστήματος. ` +
      "Μετά πάτησε και τα οκτώ πλήκτρα ταυτόχρονα και άφησέ τα.",
    richtig: "Και τα οκτώ δάχτυλα βρίσκονται σωστά.",
    nachgereicht: "Τώρα έφτασαν και τα οκτώ πλήκτρα. Και τα οκτώ δάχτυλα βρίσκονται σωστά.",
    nachreichen: (t) =>
      t.length === 1
        ? `Σχεδόν. Το πλήκτρο ${t[0].taste} (${t[0].finger}) δεν έφτασε - μερικά πληκτρολόγια δεν στέλνουν και τα οκτώ πλήκτρα ταυτόχρονα. Πάτησέ το ξανά.`
        : `Σχεδόν. Τα πλήκτρα ${liste(t.map((x) => `${x.taste} (${x.finger})`), "και")} δεν έφτασαν - μερικά πληκτρολόγια δεν στέλνουν και τα οκτώ πλήκτρα ταυτόχρονα. Πάτησέ τα ξανά.`,
    zuWenig: (n) =>
      `${n === 0 ? "Δεν έφτασε κανένα πλήκτρο από τα οκτώ" : n === 1 ? "Έφτασε μόνο ένα πλήκτρο από τα οκτώ" : `Έφτασαν μόνο ${n} πλήκτρα από τα οκτώ`}. ` +
      "Βάλε και τα οκτώ δάχτυλα στη βασική σειρά και πάτησέ τα ταυτόχρονα.",
    tausch: (finger, soll, ist, richtung) =>
      `${gross(finger)}: αντί για το πλήκτρο ${soll} έφτασε το πλήκτρο ${ist} - το δάχτυλο βρίσκεται ${richtung}.`,
    hand: (hand, richtung) => `Το ${hand === "links" ? "αριστερό" : "δεξί"} χέρι βρίσκεται ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: λείπει το πλήκτρο ${soll}.`,
    dazu: (t) =>
      t.length === 1 ? `Έφτασε επιπλέον το πλήκτρο ${t[0]}.` : `Έφτασαν επιπλέον τα πλήκτρα ${liste(t, "και")}.`,
    nurDazu: (t) =>
      `Έφτασαν και τα οκτώ βασικά πλήκτρα και επιπλέον ${liste(t, "και")}. Τα δάχτυλα βρίσκονται σωστά - πάτησε μόνο τα οκτώ πλήκτρα της βασικής σειράς.`,
    nochmal: (f, j) => `Βρες με τους δείκτες τα μικρά ανάγλυφα σημάδια στα πλήκτρα ${f} και ${j} και δοκίμασε ξανά.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      if (reihen !== 0) {
        const n = Math.abs(reihen);
        teile.push(`κατά ${zahlWortEl(n, "f")} ${n === 1 ? "σειρά" : "σειρές"} πολύ ${reihen > 0 ? "πάνω" : "κάτω"}`);
      }
      if (tasten !== 0) {
        const n = Math.abs(tasten);
        teile.push(`κατά ${zahlWortEl(n, "n")} ${n === 1 ? "πλήκτρο" : "πλήκτρα"} πολύ ${tasten > 0 ? "δεξιά" : "αριστερά"}`);
      }
      return teile.length ? teile.join(" και ") : "εκτός θέσης";
    },
    und: "και",
  },
  hu: {
    titel: "Alapállás ellenőrzése",
    anleitung: (links, rechts) =>
      `Tedd az ujjaidat az alapsorra. Bal kéz: ${links}. Jobb kéz: ${rechts}. A hüvelykujjak a szóközön pihennek. ` +
      "Utána nyomd le egyszerre mind a nyolc billentyűt, majd engedd fel őket.",
    richtig: "Mind a nyolc ujj jó helyen van.",
    nachgereicht: "Most mind a nyolc megérkezett. Mind a nyolc ujj jó helyen van.",
    nachreichen: (t) =>
      t.length === 1
        ? `Majdnem. Nem érkezett meg ez a billentyű: ${t[0].taste} (${t[0].finger}) - egyes billentyűzetek nem jeleznek egyszerre nyolc billentyűt. Nyomd le még egyszer.`
        : `Majdnem. Ezek a billentyűk nem érkeztek meg: ${liste(t.map((x) => `${x.taste} (${x.finger})`), "és")} - egyes billentyűzetek nem jeleznek egyszerre nyolc billentyűt. Nyomd le őket még egyszer.`,
    zuWenig: (n) =>
      `${n === 0 ? "Egyetlen billentyű sem érkezett meg a nyolcból." : `Csak ${n} billentyű érkezett meg a nyolcból.`} ` +
      "Tedd mind a nyolc ujjat az alapsorra, és nyomd le őket egyszerre.",
    tausch: (finger, soll, ist, richtung) => `${gross(finger)}: ${soll} helyett ${ist} érkezett - az ujj ${richtung} van.`,
    hand: (hand, richtung) => `A ${hand === "links" ? "bal" : "jobb"} kéz ${richtung} van.`,
    fehlt: (finger, soll) => `${gross(finger)}: nem érkezett meg ${soll}.`,
    dazu: (t) =>
      t.length === 1 ? `Ezen kívül még ez érkezett: ${t[0]}.` : `Ezen kívül még ezek érkeztek: ${liste(t, "és")}.`,
    nurDazu: (t) =>
      `Mind a nyolc alapbillentyű megérkezett, ezen kívül még ezek is: ${liste(t, "és")}. Az ujjak jól fekszenek - csak az alapsor nyolc billentyűjét nyomd le.`,
    nochmal: (f, j) =>
      `Mutatóujjaiddal tapintsd ki a kis kiemelkedéseket a következő két billentyűn: ${f} és ${j}. Utána próbáld újra.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      if (reihen !== 0)
        teile.push(`${Math.abs(reihen)} billentyűsorral túl ${reihen > 0 ? "magasan" : "alacsonyan"}`);
      if (tasten !== 0)
        teile.push(`${Math.abs(tasten)} billentyűvel túl ${tasten > 0 ? "jobbra" : "balra"}`);
      return teile.length ? teile.join(" és ") : "nem a saját billentyűjén";
    },
    und: "és",
  },
  nl: {
    titel: "Basishouding controleren",
    anleitung: (links, rechts) =>
      `Leg je vingers op de basisrij: linkerhand op ${links}, rechterhand op ${rechts}. Je duimen rusten op de spatiebalk. ` +
      "Druk dan alle acht toetsen tegelijk in en laat ze weer los.",
    richtig: "Alle acht vingers liggen goed.",
    nachgereicht: "Nu zijn alle acht toetsen aangekomen. Alle acht vingers liggen goed.",
    nachreichen: (t) =>
      t.length === 1
        ? `Bijna. De toets ${t[0].taste} (${t[0].finger}) is niet aangekomen - sommige toetsenborden geven niet alle acht toetsen tegelijk door. Druk er nog een keer op.`
        : `Bijna. Deze toetsen zijn niet aangekomen: ${liste(t.map((x) => `${x.taste} (${x.finger})`), "en")} - sommige toetsenborden geven niet alle acht toetsen tegelijk door. Druk er nog een keer op.`,
    zuWenig: (n) =>
      `${n === 0 ? "Er is geen enkele toets" : n === 1 ? "Er is maar één toets" : `Er zijn maar ${n} toetsen`} van de acht aangekomen. Leg alle acht vingers op de basisrij en druk ze tegelijk in.`,
    tausch: (finger, soll, ist, richtung) =>
      `${gross(finger)}: in plaats van toets ${soll} kwam toets ${ist} aan - de vinger ligt ${richtung}.`,
    hand: (hand, richtung) => `De ${hand === "links" ? "linkerhand" : "rechterhand"} ligt ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: toets ${soll} ontbreekt.`,
    dazu: (t) =>
      t.length === 1 ? `Er kwam ook toets ${t[0]} bij.` : `Er kwamen ook de toetsen ${liste(t, "en")} bij.`,
    nurDazu: (t) =>
      `Alle acht basistoetsen zijn aangekomen, plus ${liste(t, "en")}. De vingers liggen goed - druk alleen de acht toetsen van de basisrij in.`,
    nochmal: (f, j) => `Voel met je wijsvingers de voelstreepjes op ${f} en ${j} en probeer het nog eens.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 1 ? "één" : n === 2 ? "twee" : n === 3 ? "drie" : n === 4 ? "vier" : String(n));
      if (reihen !== 0) {
        const n = Math.abs(reihen);
        teile.push(`${zahl(n)} ${n === 1 ? "rij" : "rijen"} te ver naar ${reihen > 0 ? "boven" : "beneden"}`);
      }
      if (tasten !== 0) {
        const n = Math.abs(tasten);
        teile.push(`${zahl(n)} ${n === 1 ? "toets" : "toetsen"} te ver naar ${tasten > 0 ? "rechts" : "links"}`);
      }
      return teile.length ? teile.join(" en ") : "naast de eigen toets";
    },
    und: "en",
  },
  pt: {
    titel: "Verificar a posição inicial",
    anleitung: (links, rechts) =>
      `Põe os dedos na fila de base. Mão esquerda: ${links}. Mão direita: ${rechts}. Os polegares descansam na barra de espaço. ` +
      "Depois prime as oito teclas ao mesmo tempo e larga-as.",
    richtig: "Os oito dedos estão bem colocados.",
    nachgereicht: "Agora chegaram as oito. Os oito dedos estão bem colocados.",
    nachreichen: (t) =>
      t.length === 1
        ? `Quase. A tecla ${t[0].taste} (${t[0].finger}) não chegou - alguns teclados não conseguem enviar oito teclas ao mesmo tempo. Prime-a outra vez.`
        : `Quase. As teclas ${liste(t.map((x) => `${x.taste} (${x.finger})`), "e")} não chegaram - alguns teclados não conseguem enviar oito teclas ao mesmo tempo. Prime-as outra vez.`,
    zuWenig: (n) =>
      `${n === 0 ? "Nenhuma das oito teclas chegou." : n === 1 ? "Só chegou uma das oito teclas." : `Só chegaram ${n} das oito teclas.`} ` +
      "Põe os oito dedos na fila de base e prime as teclas ao mesmo tempo.",
    tausch: (finger, soll, ist, richtung) =>
      `${gross(finger)}: chegou a tecla ${ist} em vez da tecla ${soll} - o dedo está ${richtung}.`,
    hand: (hand, richtung) => `A mão ${hand === "links" ? "esquerda" : "direita"} está ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: falta a tecla ${soll}.`,
    dazu: (t) =>
      t.length === 1 ? `Chegou também a tecla ${t[0]}.` : `Chegaram também as teclas ${liste(t, "e")}.`,
    nurDazu: (t) =>
      `Chegaram as oito teclas da fila de base e ainda ${liste(t, "e")}. Os dedos estão bem colocados - prime só as oito teclas da fila de base.`,
    nochmal: (f, j) => `Procura com os indicadores os pequenos relevos nas teclas ${f} e ${j} e tenta outra vez.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 1 ? "uma" : n === 2 ? "duas" : String(n));
      if (reihen !== 0) {
        const n = Math.abs(reihen);
        teile.push(`${zahl(n)} ${n === 1 ? "fila" : "filas"} demasiado ${reihen > 0 ? "acima" : "abaixo"}`);
      }
      if (tasten !== 0) {
        const n = Math.abs(tasten);
        teile.push(`${zahl(n)} ${n === 1 ? "tecla" : "teclas"} demasiado ${tasten > 0 ? "à direita" : "à esquerda"}`);
      }
      return teile.length ? teile.join(" e ") : "fora da sua tecla";
    },
    und: "e",
  },
  br: {
    titel: "Verificar a posição inicial",
    anleitung: (links, rechts) =>
      `Apoie os dedos na fileira central: mão esquerda em ${links}, mão direita em ${rechts}. Os polegares ficam na barra de espaço. ` +
      "Depois pressione as oito teclas ao mesmo tempo e solte.",
    richtig: "Os oito dedos estão no lugar certo.",
    nachgereicht: "Agora as oito chegaram. Os oito dedos estão no lugar certo.",
    nachreichen: (t) =>
      t.length === 1
        ? `Quase. A tecla ${t[0].taste} (${t[0].finger}) não chegou - alguns teclados não enviam as oito teclas ao mesmo tempo. Pressione a tecla de novo.`
        : `Quase. As teclas ${liste(t.map((x) => `${x.taste} (${x.finger})`), "e")} não chegaram - alguns teclados não enviam as oito teclas ao mesmo tempo. Pressione as teclas de novo.`,
    zuWenig: (n) =>
      `${n === 0 ? "Nenhuma das oito teclas chegou" : n === 1 ? "Só uma das oito teclas chegou" : `Só ${n} das oito teclas chegaram`}. ` +
      "Apoie os oito dedos na fileira central e pressione as teclas ao mesmo tempo.",
    tausch: (finger, soll, ist, richtung) =>
      `${gross(finger)}: em vez de ${soll}, chegou ${ist} - o dedo está ${richtung}.`,
    hand: (hand, richtung) => `A mão ${hand === "links" ? "esquerda" : "direita"} está ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: falta ${soll}.`,
    dazu: (t) =>
      t.length === 1 ? `Chegou também a tecla ${t[0]}.` : `Chegaram também as teclas ${liste(t, "e")}.`,
    nurDazu: (t) =>
      `As oito teclas da fileira central chegaram, e mais ${liste(t, "e")}. Os dedos estão no lugar certo - pressione só as oito teclas da fileira central.`,
    nochmal: (f, j) =>
      `Com os indicadores, sinta as marcas em relevo nas teclas ${f} e ${j} e tente de novo.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 1 ? "uma" : n === 2 ? "duas" : String(n));
      if (reihen !== 0) {
        const n = Math.abs(reihen);
        teile.push(`${zahl(n)} ${n === 1 ? "fileira" : "fileiras"} ${reihen > 0 ? "acima" : "abaixo"} do lugar`);
      }
      if (tasten !== 0) {
        const n = Math.abs(tasten);
        teile.push(`${zahl(n)} ${n === 1 ? "tecla" : "teclas"} ${tasten > 0 ? "à direita" : "à esquerda"} do lugar`);
      }
      return teile.length ? teile.join(" e ") : "fora do lugar";
    },
    und: "e",
  },
  ro: {
    titel: "Verificarea poziției de bază",
    anleitung: (links, rechts) =>
      `Pune degetele pe șirul de bază. Mâna stângă: ${links}. Mâna dreaptă: ${rechts}. Degetele mari se odihnesc pe bara de spațiu. ` +
      "Apoi apasă toate cele opt taste deodată și eliberează-le.",
    richtig: "Toate cele opt degete sunt la locul lor.",
    nachgereicht: "Acum au ajuns toate cele opt taste. Toate cele opt degete sunt la locul lor.",
    nachreichen: (t) =>
      t.length === 1
        ? `Aproape. Tasta ${t[0].taste} (${t[0].finger}) nu a ajuns - unele tastaturi nu pot raporta opt taste deodată. Apasă-o încă o dată.`
        : `Aproape. Aceste taste nu au ajuns: ${liste(t.map((x) => `${x.taste} (${x.finger})`), "și")} - unele tastaturi nu pot raporta opt taste deodată. Apasă-le încă o dată.`,
    zuWenig: (n) =>
      `${n === 0 ? "Nu a ajuns nicio tastă din cele opt" : n === 1 ? "A ajuns doar o tastă din cele opt" : `Au ajuns doar ${n} taste din cele opt`}. ` +
      "Pune toate cele opt degete pe șirul de bază și apasă tastele deodată.",
    tausch: (finger, soll, ist, richtung) =>
      `${gross(finger)}: a ajuns tasta ${ist} în loc de tasta ${soll} - degetul stă ${richtung}.`,
    hand: (hand, richtung) => `Mâna ${hand === "links" ? "stângă" : "dreaptă"} stă ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: lipsește tasta ${soll}.`,
    dazu: (t) =>
      t.length === 1 ? `În plus a ajuns tasta ${t[0]}.` : `În plus au ajuns tastele ${liste(t, "și")}.`,
    nurDazu: (t) =>
      `Toate cele opt taste de bază au ajuns, și în plus ${liste(t, "și")}. Degetele sunt la locul lor - apasă doar cele opt taste ale șirului de bază.`,
    nochmal: (f, j) => `Cu degetele arătătoare caută liniuțele în relief de pe tastele ${f} și ${j} și încearcă din nou.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 2 ? "două" : String(n));
      if (reihen !== 0) {
        const n = Math.abs(reihen);
        teile.push(`cu ${n === 1 ? "un șir" : `${zahl(n)} șiruri`} prea ${reihen > 0 ? "sus" : "jos"}`);
      }
      if (tasten !== 0) {
        const n = Math.abs(tasten);
        teile.push(`cu ${n === 1 ? "o tastă" : `${zahl(n)} taste`} prea la ${tasten > 0 ? "dreapta" : "stânga"}`);
      }
      return teile.length ? teile.join(" și ") : "pe alt loc";
    },
    und: "și",
  },
  sv: {
    titel: "Kontrollera grundställningen",
    anleitung: (links, rechts) =>
      `Lägg fingrarna på grundraden: vänster hand på ${links}, höger hand på ${rechts}. Tummarna vilar på Mellanslag. ` +
      "Tryck sedan ned alla åtta tangenter samtidigt och släpp dem igen.",
    richtig: "Alla åtta fingrar ligger rätt.",
    nachgereicht: "Nu har alla åtta kommit fram. Alla åtta fingrar ligger rätt.",
    nachreichen: (t) =>
      t.length === 1
        ? `Nästan. Tangenten ${t[0].taste} (${t[0].finger}) kom inte fram - vissa tangentbord kan inte rapportera åtta tangenter samtidigt. Tryck på den igen.`
        : `Nästan. Tangenterna ${liste(t.map((x) => `${x.taste} (${x.finger})`), "och")} kom inte fram - vissa tangentbord kan inte rapportera åtta tangenter samtidigt. Tryck på dem igen.`,
    zuWenig: (n) =>
      `${n === 0 ? "Ingen av de åtta tangenterna kom fram." : `Bara ${n === 1 ? "en" : n} av de åtta tangenterna kom fram.`} Lägg alla åtta fingrar på grundraden och tryck ned dem samtidigt.`,
    tausch: (finger, soll, ist, richtung) => `${gross(finger)}: ${ist} i stället för ${soll} - fingret ligger ${richtung}.`,
    hand: (hand, richtung) => `Din ${hand === "links" ? "vänstra" : "högra"} hand ligger ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: ${soll} saknas.`,
    dazu: (t) => `Även ${liste(t, "och")} kom med.`,
    nurDazu: (t) =>
      `Alla åtta hemtangenter kom fram, och även ${liste(t, "och")}. Fingrarna ligger rätt - tryck bara på de åtta tangenterna på grundraden.`,
    nochmal: (f, j) => `Känn efter de små upphöjningarna på ${f} och ${j} med pekfingrarna och försök igen.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      const zahl = (n: number) => (n === 1 ? "en" : n === 2 ? "två" : String(n));
      if (reihen !== 0)
        teile.push(`${zahl(Math.abs(reihen))} ${Math.abs(reihen) === 1 ? "rad" : "rader"} för långt ${reihen > 0 ? "fram" : "bak"}`);
      if (tasten !== 0)
        teile.push(`${zahl(Math.abs(tasten))} ${Math.abs(tasten) === 1 ? "tangent" : "tangenter"} för långt åt ${tasten > 0 ? "höger" : "vänster"}`);
      return teile.length ? teile.join(" och ") : "bredvid sin tangent";
    },
    und: "och",
  },
  uk: {
    titel: "Перевір основне положення",
    anleitung: (links, rechts) =>
      `Поклади пальці на основний ряд. Ліва рука: ${links}. Права рука: ${rechts}. Великі пальці лежать на пробілі. ` +
      "Потім натисни всі вісім клавіш одночасно й відпусти їх.",
    richtig: "Усі вісім пальців лежать правильно.",
    nachgereicht: "Тепер дійшли всі вісім клавіш. Усі вісім пальців лежать правильно.",
    nachreichen: (t) =>
      t.length === 1
        ? `Майже. Клавіша ${t[0].taste} (${t[0].finger}) не дійшла - деякі клавіатури не передають одразу вісім клавіш. Натисни її ще раз.`
        : `Майже. Ці клавіші не дійшли: ${liste(t.map((x) => `${x.taste} (${x.finger})`), "і")} - деякі клавіатури не передають одразу вісім клавіш. Натисни їх ще раз.`,
    zuWenig: (n) =>
      `${n === 0 ? "Не дійшла жодна клавіша" : formUk(n, "Дійшла лише одна клавіша", `Дійшли лише ${n} клавіші`, `Дійшло лише ${n} клавіш`)} з восьми. ` +
      "Поклади всі вісім пальців на основний ряд і натисни клавіші одночасно.",
    tausch: (finger, soll, ist, richtung) =>
      `${gross(finger)}: замість клавіші ${soll} дійшла клавіша ${ist} - палець лежить ${richtung}.`,
    hand: (hand, richtung) => `${hand === "links" ? "Ліва" : "Права"} рука лежить ${richtung}.`,
    fehlt: (finger, soll) => `${gross(finger)}: бракує клавіші ${soll}.`,
    dazu: (t) =>
      t.length === 1 ? `Додатково дійшла клавіша ${t[0]}.` : `Додатково дійшли клавіші ${liste(t, "і")}.`,
    nurDazu: (t) =>
      `Дійшли всі вісім клавіш основного ряду, а ще ${liste(t, "і")}. Пальці лежать правильно - натискай лише вісім клавіш основного ряду.`,
    nochmal: (f, j) => `Вказівними пальцями намацай виступи на клавішах ${f} і ${j} та спробуй ще раз.`,
    richtung: (reihen, tasten) => {
      const teile: string[] = [];
      if (reihen !== 0) {
        const n = Math.abs(reihen);
        const zahl = n === 1 ? "один" : n === 2 ? "два" : n === 3 ? "три" : n === 4 ? "чотири" : String(n);
        teile.push(`на ${zahl} ${formUk(n, "ряд", "ряди", "рядів")} надто ${reihen > 0 ? "високо" : "низько"}`);
      }
      if (tasten !== 0) {
        const n = Math.abs(tasten);
        const zahl = n === 1 ? "одну" : n === 2 ? "дві" : n === 3 ? "три" : n === 4 ? "чотири" : String(n);
        teile.push(`на ${zahl} ${formUk(n, "клавішу", "клавіші", "клавіш")} надто ${tasten > 0 ? "праворуч" : "ліворуч"}`);
      }
      return teile.length ? teile.join(" і ") : "не на своєму місці";
    },
    und: "і",
  },
};

/** Der Name einer Taste im Satz: Buchstaben als Buchstabe, alles andere beim Namen. */
export function tastenWort(zeichen: string, lang: Lang): string {
  const istBuchstabe = zeichen.toLowerCase() !== zeichen.toUpperCase();
  return istBuchstabe ? zeichen : spokenLabel(zeichen, lang);
}

/** Der Titel der Übung in dieser Sprache. */
export function grundstellungTitel(lang: Lang): string {
  return SAETZE[lang].titel;
}

/** Die Anleitung mit den acht Tasten DIESER Tastatur. */
export function grundstellungAnleitung(layout: KeyboardLayout, lang: Lang): string {
  const g = grundtastenFuer(layout).map((t) => tastenWort(t.zeichen, lang));
  return SAETZE[lang].anleitung(g.slice(0, 4).join(" "), g.slice(4).join(" "));
}

/** Der ganze Satz zu einem Befund - für die Braillezeile und die Stimme. */
export function befundSatz(b: Befund, layout: KeyboardLayout, lang: Lang): string {
  const s = SAETZE[lang];
  const w = (z: string) => tastenWort(z, lang);
  const fn = (f: FingerId) => fingerName(FINGERS[f], lang);
  if (b.art === "richtig") return b.nachgereicht ? s.nachgereicht : s.richtig;
  const fehlend = b.punkte.filter((p): p is Extract<Punkt, { art: "fehlt" }> => p.art === "fehlt");
  if (b.art === "nachreichen") return s.nachreichen(fehlend.map((p) => ({ taste: w(p.soll), finger: fn(p.finger) })));
  if (b.art === "zuWenig") return s.zuWenig(b.angekommen);
  // Alle acht waren da, nur kam etwas dazu: Die Finger liegen richtig.
  if (b.punkte.every((p) => p.art === "dazu"))
    return s.nurDazu(b.punkte.map((p) => (p.art === "dazu" ? w(p.ist) : "")));
  const saetze: string[] = [];
  const dazu: string[] = [];
  for (const p of b.punkte) {
    if (p.art === "hand") saetze.push(s.hand(p.hand, s.richtung(p.reihen, p.tasten)));
    else if (p.art === "tausch") saetze.push(s.tausch(fn(p.finger), w(p.soll), w(p.ist), s.richtung(p.reihen, p.tasten)));
    else if (p.art === "fehlt") saetze.push(s.fehlt(fn(p.finger), w(p.soll)));
    else dazu.push(w(p.ist));
  }
  if (dazu.length) saetze.push(s.dazu(dazu));
  const grund = grundtastenFuer(layout);
  saetze.push(s.nochmal(w(grund[3].zeichen), w(grund[4].zeichen)));
  return saetze.join(" ");
}
