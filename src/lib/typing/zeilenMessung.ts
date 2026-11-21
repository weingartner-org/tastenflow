/**
 * ★★★★★ MESSUNGEN JE ÜBUNGSZEILE FÜR DEN EIGENSTÄNDIGKEITS-CHECK
 * (Schritt M, 19.09.2026 - der Check selbst ist E10 und NICHT gebaut).
 *
 * Johannes, 18.09.2026: *„Neu messen: ja, unbedingt, was du kriegen kannst"* -
 * und dazu seine Idee H: *„wir wissen die wackligen Tasten bei einem Kind -
 * wenn die dann manchmal überhaupt nicht wackeln und dann schon wieder, ist
 * das dann nicht ein Hinweis auf Schummeln?"*
 *
 * Hier wird NUR GEMESSEN. Nichts wird angezeigt, nichts bewertet, kein Hinweis
 * gerechnet, kein Anschlag abgewiesen - auch Tasten aus einem Programm zählen
 * beim Üben ganz normal. Die Grundlage steht in
 * `RECHERCHE-2026-09-18-EIGENSTAENDIGKEITS-CHECK.md` und
 * `MESSUNG-2026-09-18-EIGENSTAENDIGKEITS-CHECK.md`.
 *
 * ── Was je Zeile festgehalten wird (nur ZUSAMMENGEFASST, nie Rohanschläge) ──
 *
 *   unechteTasten     Tastendrücke mit `isTrusted === false` - vom Browser
 *                     selbst als „nicht von einer Taste" gekennzeichnet
 *                     (ein Skript im Browser). Fehlt = 0.
 *   wegMs             Zeit, in der das Fenster nicht im Vordergrund oder die
 *                     Seite verborgen war, solange die Zeile dastand. Fehlt = 0.
 *   rhythmusVk        Variationskoeffizient (Streuung ÷ Mittel) der Abstände
 *                     zwischen zwei Anschlägen. Fehlt = nicht messbar.
 *   haltezeitMs       Median der Zeit von „Taste runter" bis „Taste hoch".
 *                     Fehlt = nicht messbar.
 *   ueberlappung      Anteil der Anschläge, bei denen die vorige Taste noch
 *                     gehalten war (0 bis 1). Fehlt = nicht messbar.
 *   wackeligTreffer / Treffer und Versuche auf den Tasten, die zu Beginn der
 *   wackeligVersuche  Zeile die wackligen des Kindes waren (`weakestKeys`).
 *                     Fehlen = in der Zeile kam keine vor.
 *
 * ── ★★★★★ „MESSFEHLER SIND GIFT" - WAS HIER BEWUSST NICHT GERATEN WIRD ──────
 *
 * Johannes, 18.09.: Der frühere Tempo-Messfehler traf fast nur Kinder mit
 * Hilfsmittel (MESSUNG §11). Darum gilt für jede Zahl hier: lieber „nicht
 * messbar" als eine geratene Zahl.
 *
 * - **Warten auf die Stimme ist kein Rhythmus.** Ein Abstand, in dem die App
 *   gesprochen hat und das Kind gewartet hat, fällt heraus - mit derselben
 *   Regel wie die Zeilenzeit (`zeilenLuecke`, `zeilenzeit.ts`). Ebenso Abstände
 *   über der Pausentoleranz dieses Kindes, Abstände, in denen das Fenster weg
 *   war, und der ERSTE Anschlag einer Zeile (sein Abstand enthält den
 *   Zeilenwechsel). Unter {@link MIN_ABSTAENDE_RHYTHMUS} Abständen: keine Zahl.
 * - **Kein „Taste hoch", keine Haltezeit.** Manche Hilfsmittel schlucken das
 *   `keyup`. Kommt für weniger als die Hälfte der Anschläge ein `keyup` an,
 *   gibt es weder Haltezeit noch Überlappung - statt eine Zahl aus dem Rest
 *   zu bilden. Eine Taste, deren `keyup` nie kam, zählt NICHT als „noch
 *   gehalten" (sonst wäre jeder folgende Anschlag eine Überlappung).
 * - **Nur Zeichen-Tasten.** Die Umschalttaste wird absichtlich gehalten, ein
 *   Grossbuchstabe wäre sonst immer eine Überlappung. Auto-Wiederholung
 *   (`event.repeat`) ist kein neuer Anschlag.
 *
 * ⚠️ Was trotzdem NICHT heissen darf, was es zu heissen scheint (für E10):
 * Eine Braille-Tastatur über NVDA/JAWS, eine Bildschirmtastatur oder eine
 * Schaltersteuerung schicken „Taste runter" und „Taste hoch" fast gleichzeitig
 * - Haltezeit nahe 0 und keine Überlappung sind dort NORMAL, genau wie bei
 * einem Automaten. Die Sprache eines Screenreaders (nicht die der App) kann
 * die App nicht sehen: Wer auf NVDA wartet, streut im Rhythmus mehr.
 *
 * Reine Rechnung, ohne DOM und ohne Uhr: `TypingSession` reicht die Zeitpunkte
 * herein. So lässt sich jede Zahl an einer erfundenen Tastenfolge prüfen
 * (`tests/tastenflow-zeilenmessung.test.tsx`).
 */
import { weakestKeys, type TaskEvent } from "./account";
import type { WackligRahmen } from "./wacklig";
import type { KeyEvent } from "./letters";
import { zeilenLuecke } from "./zeilenzeit";

/** Unter so vielen gültigen Abständen gibt es keinen Rhythmus-Wert. */
export const MIN_ABSTAENDE_RHYTHMUS = 8;
/** Unter so vielen gemessenen Haltezeiten gibt es keinen Median. */
export const MIN_HALTEZEITEN = 5;
/** Unter so vielen bekannten Anschlag-Paaren gibt es keinen Überlappungs-Anteil. */
export const MIN_UEBERLAPP_PAARE = 5;
/**
 * Mindestens dieser Anteil der Anschläge braucht ein `keyup`, sonst gilt die
 * Haltezeit als nicht messbar (siehe Kopf: nicht raten).
 */
export const KEYUP_ANTEIL_MIN = 0.5;
/**
 * Länger gehalten ist kein Anschlag mehr - und eine Taste, die so lange „unten"
 * steht, hat ihr `keyup` meist verloren (Fensterwechsel, Hilfsmittel).
 */
export const HALTEN_MAX_MS = 2000;
/**
 * So viele wacklige Tasten werden je Zeile verfolgt - dieselbe Auswahl, die die
 * Lehrkraft in „Meine Klassen" beim Kind sieht (`weakestKeys(…, 8)`).
 */
export const WACKELIG_ANZAHL = 8;

/** Die Messwerte EINER Zeile - schon gerundet, `null` = nicht messbar. */
export interface ZeilenMesswerte {
  unechteTasten: number;
  wegMs: number;
  rhythmusVk: number | null;
  haltezeitMs: number | null;
  ueberlappung: number | null;
}

/** Die Felder, die davon in einem {@link TaskEvent} landen. */
export type ZeilenMessFelder = Pick<
  TaskEvent,
  | "unechteTasten"
  | "wegMs"
  | "rhythmusVk"
  | "haltezeitMs"
  | "ueberlappung"
  | "wackeligTreffer"
  | "wackeligVersuche"
>;

/** Die Namen dieser Felder - für {@link ohneZeilenMessung}. */
export const ZEILEN_MESS_FELDER: readonly (keyof ZeilenMessFelder)[] = [
  "unechteTasten",
  "wegMs",
  "rhythmusVk",
  "haltezeitMs",
  "ueberlappung",
  "wackeligTreffer",
  "wackeligVersuche",
];

/** Ein Tastendruck, der ankommt (keydown eines Zeichens). */
export interface Tastendruck {
  /** Zeitpunkt des Ereignisses (`event.timeStamp`). */
  t: number;
  /** Welche Taste - `event.code`, sonst `event.key` klein. */
  id: string;
  /** `event.isTrusted` - `false` heisst: ein Skript hat die Taste erzeugt. */
  echt: boolean;
  /** `event.repeat` - Auto-Wiederholung einer gehaltenen Taste. */
  wiederholung: boolean;
  /** Bisher gesprochene Zeit der App-Stimme (`spokenMs()`). */
  gesprochenMs: number;
  /** Spricht die App-Stimme gerade (`isSpeaking()`)? */
  sprichtJetzt: boolean;
  /** Pausentoleranz dieses Kindes (`practiceIdleCap()`). */
  deckelMs: number;
}

interface Druck {
  id: string;
  runter: number;
  hoch: number | null;
  /** Wurde die NÄCHSTE Taste gedrückt, während diese noch unten war? */
  naechsterSchonGedrueckt: boolean;
}

interface ZeilenStand {
  unecht: number;
  wegMs: number;
  abstaende: number[];
  halten: number[];
  anschlaege: number;
  paareBekannt: number;
  paareUeberlappt: number;
}

const leererStand = (): ZeilenStand => ({
  unecht: 0,
  wegMs: 0,
  abstaende: [],
  halten: [],
  anschlaege: 0,
  paareBekannt: 0,
  paareUeberlappt: 0,
});

const zweiStellen = (x: number): number => Math.round(x * 100) / 100;

/** Median einer Liste (leer ⇒ `null`). */
export function median(werte: readonly number[]): number | null {
  if (werte.length === 0) return null;
  const s = [...werte].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 === 1 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * Variationskoeffizient (Streuung ÷ Mittel, Streuung über alle Werte) -
 * `null` unter {@link MIN_ABSTAENDE_RHYTHMUS} Werten oder bei Mittel 0.
 */
export function variationskoeffizient(werte: readonly number[]): number | null {
  if (werte.length < MIN_ABSTAENDE_RHYTHMUS) return null;
  const mittel = werte.reduce((s, x) => s + x, 0) / werte.length;
  if (!(mittel > 0)) return null;
  const varianz = werte.reduce((s, x) => s + (x - mittel) ** 2, 0) / werte.length;
  return zweiStellen(Math.sqrt(varianz) / mittel);
}

/**
 * Misst die Anschläge einer Übungszeile nach der anderen. Ein Messer lebt so
 * lange wie die Übungssitzung; was über Zeilen hinweg gilt (gedrückte Tasten,
 * der letzte Anschlag, „Fenster weg seit"), bleibt stehen, die Zähler der
 * Zeile beginnen mit {@link abschliessen} von vorn.
 *
 * ⚠️ Zwei Uhren, die sich NIE mischen: Anschläge (Rhythmus, Haltezeit) laufen
 * auf `event.timeStamp`, Fenster-weg auf `Date.now()`. Verglichen wird nur
 * innerhalb derselben Uhr.
 */
export class ZeilenMesser {
  private offen = new Map<string, Druck>();
  private vorige: Druck | null = null;
  private letzteAnkunft: number | null = null;
  private gesprochenBei = 0;
  private ersteTasteDerZeile = true;
  private wegSeitLetzterTaste = false;
  private wegSeit: number | null = null;
  private z: ZeilenStand = leererStand();

  /** Eine Zeichen-Taste geht runter. */
  taste(d: Tastendruck): void {
    if (!d.echt) this.z.unecht += 1;
    if (d.wiederholung) return; // Auto-Wiederholung: kein neuer Anschlag
    this.rhythmus(d);
    this.runter(d.t, d.id);
  }

  /** Eine Taste geht hoch. Unbekannte Tasten (z. B. Umschalt) zählen nicht. */
  losgelassen(t: number, id: string): void {
    const d = this.offen.get(id);
    if (!d) return;
    this.offen.delete(id);
    d.hoch = t;
    const dauer = t - d.runter;
    if (dauer >= 0 && dauer <= HALTEN_MAX_MS) this.z.halten.push(dauer);
    if (d.naechsterSchonGedrueckt) {
      this.z.paareBekannt += 1;
      this.z.paareUeberlappt += 1;
    }
  }

  /** Das Fenster ist nicht mehr vorne oder die Seite ist verborgen. */
  weg(t: number): void {
    if (this.wegSeit === null) this.wegSeit = t;
    this.wegSeitLetzterTaste = true;
    // Was jetzt noch „unten" ist, bekommt sein `keyup` woanders hin - nicht
    // raten, sondern vergessen.
    this.offen.clear();
    this.vorige = null;
  }

  /** Das Fenster ist wieder vorne und sichtbar. */
  zurueck(t: number): void {
    if (this.wegSeit === null) return;
    this.z.wegMs += Math.max(0, t - this.wegSeit);
    this.wegSeit = null;
  }

  /**
   * Die Zeile steht da. Ab hier zählt die Zeit „Fenster weg" für sie - die
   * Abschluss-Karte davor und die Zeilenpause gehören keiner Zeile.
   */
  zeileSteht(t: number): void {
    this.z.wegMs = 0;
    if (this.wegSeit !== null) this.wegSeit = t;
  }

  /**
   * Die Zeile ist fertig: ihre Werte, gerundet - und die Zähler von vorn.
   * Anschläge, die ab jetzt kommen (auch in der Zeilenpause), gehören der
   * nächsten Zeile.
   */
  abschliessen(t: number): ZeilenMesswerte {
    if (this.wegSeit !== null) {
      this.z.wegMs += Math.max(0, t - this.wegSeit);
      this.wegSeit = t;
    }
    const z = this.z;
    const keyupReicht =
      z.anschlaege > 0 && z.halten.length >= KEYUP_ANTEIL_MIN * z.anschlaege;
    const haltezeit =
      keyupReicht && z.halten.length >= MIN_HALTEZEITEN ? median(z.halten) : null;
    const ueberlappung =
      keyupReicht && z.paareBekannt >= MIN_UEBERLAPP_PAARE
        ? zweiStellen(z.paareUeberlappt / z.paareBekannt)
        : null;
    const werte: ZeilenMesswerte = {
      unechteTasten: z.unecht,
      wegMs: Math.round(z.wegMs),
      rhythmusVk: variationskoeffizient(z.abstaende),
      haltezeitMs: haltezeit === null ? null : Math.round(haltezeit),
      ueberlappung,
    };
    this.verwerfen();
    return werte;
  }

  /** Alles der angefangenen Zeile vergessen (neue Runde, Abbruch). */
  verwerfen(): void {
    this.z = leererStand();
    this.ersteTasteDerZeile = true;
  }

  private rhythmus(d: Tastendruck): void {
    const erste = this.ersteTasteDerZeile;
    const warWeg = this.wegSeitLetzterTaste;
    const vorher = this.letzteAnkunft;
    const gesprochen = d.gesprochenMs - this.gesprochenBei;
    this.ersteTasteDerZeile = false;
    this.wegSeitLetzterTaste = false;
    this.letzteAnkunft = d.t;
    this.gesprochenBei = d.gesprochenMs;
    if (erste || warWeg || vorher === null) return;
    const abstand = d.t - vorher;
    if (!(abstand >= 0)) return;
    // Dieselbe Regel wie die Zeilenzeit: Zuhören fällt heraus, und was über
    // der Pausentoleranz liegt, war kein Tippen.
    const l = zeilenLuecke(abstand, gesprochen, d.sprichtJetzt, d.deckelMs);
    if (l.zuhoerMs > 0 || l.zeileMs < abstand) return;
    this.z.abstaende.push(abstand);
  }

  private runter(t: number, id: string): void {
    // Tasten, deren `keyup` nie kam, nicht ewig als „unten" führen.
    for (const [k, d] of this.offen) {
      if (t - d.runter > HALTEN_MAX_MS) this.offen.delete(k);
    }
    this.z.anschlaege += 1;
    const v = this.vorige;
    if (v) {
      if (v.hoch !== null) {
        // Schon losgelassen - überlappt nur, wenn das `keyup` (verspätet
        // gemeldet) zeitlich NACH diesem Anschlag lag.
        this.z.paareBekannt += 1;
        if (v.hoch > t) this.z.paareUeberlappt += 1;
      } else if (v.id === id) {
        // Dieselbe Taste noch einmal, ohne dass sie hochging: ihr `keyup` ist
        // verloren - das Paar zählt nicht.
        this.offen.delete(v.id);
      } else if (this.offen.get(v.id) === v) {
        v.naechsterSchonGedrueckt = true; // entschieden, wenn ihr `keyup` kommt
      }
      // sonst: ihr `keyup` ist verloren - dieses Paar zählt nicht
    }
    const neu: Druck = { id, runter: t, hoch: null, naechsterSchonGedrueckt: false };
    this.offen.set(id, neu);
    this.vorige = neu;
  }
}

/**
 * Treffer und Versuche einer Zeile auf den wackligen Tasten.
 * `null`, wenn keine wackligen Tasten bekannt sind.
 */
export function wackeligZaehlen(
  anschlaege: readonly KeyEvent[],
  wacklige: ReadonlySet<string> | null | undefined,
): { treffer: number; versuche: number } | null {
  if (!wacklige || wacklige.size === 0) return null;
  let treffer = 0;
  let versuche = 0;
  for (const a of anschlaege) {
    if (!wacklige.has(a.char)) continue;
    versuche += 1;
    if (a.correct) treffer += 1;
  }
  return { treffer, versuche };
}

/**
 * Die wackligen Tasten eines Kindes - dieselbe Auswahl wie bei der Lehrkraft.
 * @param rahmen ★ D-5: Weg und Stufe des Kindes (siehe `weakestKeys`).
 */
export function wackeligeTastenAus(
  letters: Parameters<typeof weakestKeys>[0],
  introduced: readonly string[],
  rahmen: WackligRahmen,
): string[] {
  return weakestKeys(letters, [...introduced], rahmen, WACKELIG_ANZAHL).map((w) => w.unit);
}

/**
 * Aus den Messwerten die Felder für das Ereignis der Zeile. Was 0 oder nicht
 * messbar ist, fehlt - so bleibt die gepackte Zeile kurz (`eventPack.ts`).
 */
export function zeilenMessFelder(
  m: ZeilenMesswerte,
  wackelig: { treffer: number; versuche: number } | null,
): ZeilenMessFelder {
  const out: ZeilenMessFelder = {};
  if (m.unechteTasten > 0) out.unechteTasten = m.unechteTasten;
  if (m.wegMs > 0) out.wegMs = m.wegMs;
  if (m.rhythmusVk !== null) out.rhythmusVk = m.rhythmusVk;
  if (m.haltezeitMs !== null) out.haltezeitMs = m.haltezeitMs;
  if (m.ueberlappung !== null) out.ueberlappung = m.ueberlappung;
  if (wackelig && wackelig.versuche > 0) {
    out.wackeligTreffer = wackelig.treffer;
    out.wackeligVersuche = wackelig.versuche;
  }
  return out;
}

/**
 * Ein Ereignis OHNE diese Messungen - für Konten, die keiner Klasse angehören
 * (Selbstlernende, übende Lehrkräfte): Dort gibt es keine Lehrkraft, für die
 * gemessen würde, also wird es auch nicht gespeichert (Datensparsamkeit).
 */
export function ohneZeilenMessung<E extends object>(e: E): E {
  const out = { ...e } as Record<string, unknown>;
  for (const k of ZEILEN_MESS_FELDER) delete out[k];
  return out as E;
}
