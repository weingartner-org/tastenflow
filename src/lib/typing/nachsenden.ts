/**
 * ★★★ DIE WARTESCHLANGE IM GERÄT - was ein Kind geleistet hat, geht nicht
 * verloren, nur weil gerade das Netz fehlt (27.09.2026).
 *
 * ── Der Befund ──────────────────────────────────────────────────────────────
 * `BEFUND-2026-09-27-DATENVERBRAUCH-UND-NETZABBRUCH.md` §3: Es gab keine
 * Warteschlange und keine Wiederholung - weder für das Tippchallenge-Ergebnis
 * noch für die geübten Zeilen (Übezeit, Wochenziel, Statistik). Johannes:
 * „Netz kurz weg … Zeilen gehen verloren ist nicht gut."
 *
 * ⚠️ Der LERNSTAND steht bewusst NICHT hier (Entscheidung nach zwei
 * Prüfungen, 27.09.2026): Eine Kopie im Gerät, die den Stand am Server
 * überschreiben oder mit ihm zusammengeführt werden kann, hat zu viele Wege,
 * einem Kind etwas wegzunehmen (Zurückstufen durch die Lehrkraft, Ledger,
 * zwei Geräte). Der Lernstand wird genau wie bisher direkt gespeichert, ohne
 * Kopie im Gerät; was ohne Netz erübt wurde, übersteht nur, solange der Tab
 * offen bleibt.
 *
 * ── Wie es geht ─────────────────────────────────────────────────────────────
 *  1. Was an den Server soll, kommt ZUERST hierher (localStorage, je Konto ein
 *     Schlüssel) - erst danach wird gesendet.
 *  2. Erst wenn der Server es bestätigt, wird der Eintrag gelöscht - über
 *     seine eigene KENNUNG (`id`), nie über einen Zeitstempel.
 *  3. Zwei Arten von Einheiten, in dieser Reihenfolge: Ergebnisse, dann ALLE
 *     geübten Zeilen auf einmal (eine Lesung, ein Schreiben).
 *  4. Fehlt das Netz WIRKLICH („netz"), hört der Durchgang auf. Ein
 *     Serverfehler („server") hält nur seine eigene Einheit auf, die anderen
 *     gehen weiter (Prüfbefund S2).
 *  5. Nach jedem Fehlversuch wartet eine Einheit länger (2 s, 4 s, … bis
 *     5 min, gestreut) - kein Hämmern je Zeile (Prüfbefund S3). AUFGEGEBEN
 *     wird nie; jede gelungene Anfrage (auch ein normales Speichern des
 *     Lernstands, {@link meldeVerbindungGut}) setzt die Wartezeit zurück
 *     (dritte Prüfung S1).
 *  6. Jede Anfrage hat eine Frist ({@link SENDE_FRIST_MS}). PocketBase selbst
 *     kennt keine. Nach der Frist wird die Anfrage WIRKLICH abgebrochen
 *     (`AbortSignal` an Lesen UND Schreiben): Eine hängende erste Sendung der
 *     Zeilen (Lesen + ganze Liste neu schreiben) konnte sonst NACH der
 *     zweiten ankommen und deren Zeilen überschreiben (dritte Prüfung M1,
 *     gemessen). Beim Ergebnis schützt zusätzlich UNIQUE(pupilUid, probeId):
 *     ein spätes zweites `create` wird abgewiesen, nichts wird überschrieben.
 *     ⚠️ GRENZE (vierte Prüfung S4, bewusst so gelassen): Der Abbruch wirkt
 *     im Browser. Hat der Server eine Anfrage vor dem Abbruch schon GANZ
 *     empfangen, schreibt er sie trotzdem - meist sofort, also vor dem
 *     nächsten Versuch. Käme sie erst danach an, könnte sie dessen Zeilen
 *     überschreiben. Ausschliessen liesse sich das nur mit einer Fassung am
 *     Server; die ist nach drei Prüfungen bewusst NICHT gebaut.
 *
 * ── Idempotent ──────────────────────────────────────────────────────────────
 * Ein zweiter Versuch zählt nie doppelt: Ergebnis - UNIQUE am Server; Zeilen -
 * `ereignisseNachtragen` erkennt Zeitstempel + Lektion.
 *
 * ── Sparsam im Gerät (Prüfbefund S5) ────────────────────────────────────────
 * Die Zeilen liegen GEPACKT (dasselbe Format wie am Server, rund 20 Zeichen je
 * Zeile). Die ganze Schlange eines Kontos bleibt unter {@link MAX_ZEICHEN};
 * darüber fallen die ältesten Zeilen - mit `console.warn`, nie still. Scheitert
 * das Schreiben am vollen Speicher, wird gekürzt und NIE geworfen: Der
 * Anmelde-Speicher von PocketBase liegt im selben Topf und darf nie wegen
 * dieser Schlange scheitern.
 *
 * ── Nichts geht still verloren ──────────────────────────────────────────────
 * Unlesbares und Gekapptes wird mit `console.warn` verworfen - nie wortlos.
 * Ein Ablaufdatum gibt es NICHT: Zeilen sind idempotent, ein Ergebnis auch -
 * nichts wird nach einer Geräte-Uhr weggeworfen.
 */
import type { TaskEvent } from "./account";
import { packEvents, unpackEvents } from "./eventPack";

/**
 * Was in der Schlange stehen kann.
 *  • „probe"     - ein Tippchallenge-Ergebnis (Schlüssel: die Probe). Das ERSTE
 *                  bleibt, nie überschrieben.
 *  • „ereignis"  - eine geübte Zeile (Schlüssel: Zeitstempel + Lektion).
 */
export type NachsendeArt = "probe" | "ereignis";

export interface Ausstehend {
  /** Eindeutig - daran wird ein bestätigter Eintrag gelöscht. */
  id: string;
  art: NachsendeArt;
  /** Eindeutig je Art (Probe-Kennung · „ts|lesson"). */
  schluessel: string;
  daten: unknown;
  /** Wann der Eintrag entstand (ms, Gerät) - nur zur Auskunft. */
  seitMs: number;
  /** Wie oft der Server ihn abgewiesen hat. */
  abgewiesen: number;
  /** Wie oft der Server mit einem Fehler (5xx …) antwortete. */
  serverFehler: number;
  /** Fehlversuche in Folge (Netz oder Server) - für die Wartezeit. */
  fehlversuche: number;
  /** Frühestens dann wieder im Takt versuchen (ms, Gerät). */
  naechsterMs: number;
}

/**
 * Was ein Absender meldet.
 *  • „ok"         - angekommen (oder lag schon).
 *  • „netz"       - das Netz fehlt wirklich: Durchgang anhalten.
 *  • „server"     - der Server hatte einen Fehler: diese Einheit später.
 *  • „abgewiesen" - der Server nimmt es nicht: erst beim Start wieder.
 *  • „abbruch"    - ein anderes Konto ist angemeldet: sofort aufhören,
 *                   nichts zählen.
 */
export type SendeAntwort = "ok" | "netz" | "server" | "abgewiesen" | "abbruch";

/**
 * Sendet eine Einheit (bei „ereignis" alle wartenden Zeilen auf einmal).
 * `signal` MUSS an jede Anfrage weitergereicht werden - nach der Frist wird
 * damit abgebrochen.
 */
export type Absender = (eintraege: Ausstehend[], signal: AbortSignal) => Promise<SendeAntwort>;

/** So viele Zeilen hebt das Gerät höchstens auf (gepackt rund 100 kB). */
export const MAX_EREIGNISSE = 5_000;
/** So viele Zeichen darf die Schlange EINES Kontos im Gerät belegen. */
export const MAX_ZEICHEN = 400_000;
/** Frist je Anfrage (ms) - danach gilt sie als Serverfehler. */
export const SENDE_FRIST_MS = 15_000;
const WARTE_BASIS_MS = 2_000;
export const WARTE_MAX_MS = 5 * 60_000;

const PRAEFIX = "tastenflow:nachsenden:v2:";
const ALT_PRAEFIX = "tastenflow:nachsenden:v1:";

function schluesselVon(accountId: string): string {
  return `${PRAEFIX}${accountId}`;
}

// --- Beobachter -------------------------------------------------------------

const beobachter = new Set<() => void>();

function melde(): void {
  for (const f of beobachter) {
    try {
      f();
    } catch {
      /* ein Beobachter darf die Schlange nicht aufhalten */
    }
  }
}

export function beobachteNachsenden(f: () => void): () => void {
  beobachter.add(f);
  return () => {
    beobachter.delete(f);
  };
}

// --- Die Schlange eines Kontos ----------------------------------------------

interface Zustand {
  abgewiesen: number;
  serverFehler: number;
  fehlversuche: number;
  naechsterMs: number;
}

const FRISCH: Zustand = { abgewiesen: 0, serverFehler: 0, fehlversuche: 0, naechsterMs: 0 };

interface Schlange {
  /** Die wartenden Ergebnisse. */
  einzeln: Ausstehend[];
  /** Die wartenden Zeilen, nach Zeit geordnet. */
  zeilen: TaskEvent[];
  /** Der gemeinsame Sendezustand der Zeilen. */
  zeilenZustand: Zustand;
}

const LEER = (): Schlange => ({ einzeln: [], zeilen: [], zeilenZustand: { ...FRISCH } });

/**
 * Im Speicher gehalten - ein `localStorage`-Lesen samt JSON je Anzeige wäre
 * teuer (Prüfbefund K1). Ein anderes Fenster, das schreibt, meldet sich über
 * das `storage`-Ereignis; dann wird neu gelesen.
 */
const zwischenspeicher = new Map<string, Schlange>();

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === null || e.key.startsWith(PRAEFIX)) {
      zwischenspeicher.clear();
      melde();
    }
  });
}

let zaehler = 0;
function neueId(): string {
  zaehler += 1;
  return `${Date.now().toString(36)}-${zaehler.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function zeilenSchluessel(e: TaskEvent): string {
  return `${e.ts}|${e.lesson}`;
}

function zahl(x: unknown): number {
  return typeof x === "number" && Number.isFinite(x) && x >= 0 ? x : 0;
}

function zustandAus(x: unknown): Zustand {
  const o = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
  return {
    abgewiesen: zahl(o.abgewiesen),
    serverFehler: zahl(o.serverFehler),
    fehlversuche: zahl(o.fehlversuche),
    naechsterMs: zahl(o.naechsterMs),
  };
}

function einzelnAus(x: unknown): Ausstehend | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  if (o.art !== "probe" || typeof o.schluessel !== "string" || !o.schluessel) return null;
  if (typeof o.seitMs !== "number") return null;
  return {
    id: typeof o.id === "string" && o.id ? o.id : neueId(),
    art: o.art,
    schluessel: o.schluessel,
    daten: o.daten,
    seitMs: o.seitMs,
    ...zustandAus(o),
  };
}

function lese(accountId: string): Schlange {
  const im = zwischenspeicher.get(accountId);
  if (im) return im;
  const s = LEER();
  let roh: string | null = null;
  try {
    roh = localStorage.getItem(schluesselVon(accountId));
  } catch {
    return s;
  }
  if (roh) {
    try {
      const o = JSON.parse(roh) as { e?: unknown; ev?: unknown; evZ?: unknown };
      for (const x of Array.isArray(o.e) ? o.e : []) {
        const e = einzelnAus(x);
        if (e) s.einzeln.push(e);
        else console.warn("[nachsenden] unlesbarer Eintrag verworfen", x);
      }
      s.zeilen = o.ev ? unpackEvents(o.ev) : [];
      s.zeilenZustand = zustandAus(o.evZ);
    } catch (e) {
      console.warn("[nachsenden] Warteschlange unlesbar - verworfen", accountId, e);
    }
  }
  zwischenspeicher.set(accountId, s);
  return s;
}

function alsText(s: Schlange): string {
  return JSON.stringify({
    v: 2,
    e: s.einzeln,
    ev: s.zeilen.length ? packEvents(s.zeilen) : null,
    evZ: s.zeilenZustand,
  });
}

/** Die ältesten `n` Zeilen verwerfen - nie still. */
function kappe(accountId: string, s: Schlange, n: number, grund: string): void {
  if (n <= 0) return;
  const weg = s.zeilen.slice(0, n);
  s.zeilen = s.zeilen.slice(n);
  console.warn(
    `[nachsenden] ${grund}: ${weg.length} älteste geübte Zeile(n) von ${accountId} verworfen`,
    weg.map(zeilenSchluessel),
  );
}

/**
 * Schreiben - wirft NIE. Zu gross oder Speicher voll: die ältesten Zeilen
 * fallen (gemeldet), dann noch ein Versuch. Gibt zurück, ob es im Gerät liegt.
 */
function schreibe(accountId: string, s: Schlange): boolean {
  zwischenspeicher.set(accountId, s);
  if (s.zeilen.length > MAX_EREIGNISSE)
    kappe(accountId, s, s.zeilen.length - MAX_EREIGNISSE, "Warteschlange voll");
  let text = alsText(s);
  while (text.length > MAX_ZEICHEN && s.zeilen.length > 0) {
    kappe(accountId, s, Math.max(1, Math.ceil(s.zeilen.length / 4)), "Speicherbudget überschritten");
    text = alsText(s);
  }
  let ok = false;
  let warVoll = false;
  for (let versuch = 0; versuch < 24 && !ok; versuch++) {
    try {
      if (s.einzeln.length === 0 && s.zeilen.length === 0)
        localStorage.removeItem(schluesselVon(accountId));
      else localStorage.setItem(schluesselVon(accountId), text);
      ok = true;
    } catch (e) {
      if (s.zeilen.length === 0) {
        console.warn("[nachsenden] Gerätespeicher nicht beschreibbar", e);
        break;
      }
      warVoll = true;
      kappe(accountId, s, Math.ceil(s.zeilen.length / 2), "Gerätespeicher voll");
      text = alsText(s);
    }
  }
  // War der Speicher voll, noch einmal halbieren: Luft für die Anmeldung
  // (PocketBase schreibt sie in denselben Topf, ohne Fehlerbehandlung).
  if (ok && warVoll && s.zeilen.length > 1) {
    kappe(accountId, s, Math.ceil(s.zeilen.length / 2), "Gerätespeicher voll (Luft für die Anmeldung)");
    try {
      localStorage.setItem(schluesselVon(accountId), alsText(s));
    } catch {
      /* dann bleibt die vorige, grössere Fassung stehen */
    }
  }
  melde();
  return ok;
}

/**
 * ★★ Platz schaffen, wenn ein ANDERER Schreibvorgang am vollen Speicher
 * scheitert - vor allem die Anmeldung (`SichererAuthStore` in `pbBackend.ts`).
 *
 * Nur so viel wie nötig (vierte Prüfung S2): Es fallen die ÄLTESTEN
 * wartenden Zeilen - über alle Konten dieses Geräts hinweg -, bis mindestens
 * `zeichen` Zeichen frei sind. Die Zahl wird gemeldet. Ergebnisse fallen nie.
 * Gibt zurück, ob etwas frei wurde.
 */
export function gibSpeicherFrei(zeichen: number): boolean {
  let schluessel: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PRAEFIX)) schluessel.push(k);
    }
  } catch {
    schluessel = [];
  }
  const konten = schluessel
    .map((k) => ({ k, id: k.slice(PRAEFIX.length) }))
    .map((x) => ({ ...x, q: lese(x.id), vorher: 0, weg: 0 }))
    .filter((x) => x.q.zeilen.length > 0);
  for (const x of konten) x.vorher = alsText(x.q).length;
  let frei = 0;
  let schritte = 0;
  while (frei < zeichen) {
    // Das Konto mit der global ältesten wartenden Zeile.
    let naechstes: (typeof konten)[number] | null = null;
    for (const x of konten)
      if (x.q.zeilen.length > 0 && (!naechstes || x.q.zeilen[0].ts < naechstes.q.zeilen[0].ts))
        naechstes = x;
    if (!naechstes) break;
    naechstes.q.zeilen.shift();
    naechstes.weg += 1;
    // Nachmessen in Schritten - ein Packen je Zeile wäre unnötig teuer.
    if (++schritte % 20 === 0 || konten.every((x) => x.q.zeilen.length === 0)) {
      frei = konten.reduce((n, x) => n + x.vorher - alsText(x.q).length, 0);
    }
  }
  frei = konten.reduce((n, x) => n + x.vorher - alsText(x.q).length, 0);
  let geschrieben = false;
  for (const x of konten) {
    if (x.weg === 0) continue;
    console.warn(
      `[nachsenden] Speicher für die Anmeldung gebraucht: ${x.weg} älteste geübte Zeile(n) von ${x.id} verworfen`,
    );
    try {
      if (x.q.zeilen.length === 0 && x.q.einzeln.length === 0) localStorage.removeItem(x.k);
      else localStorage.setItem(x.k, alsText(x.q));
      geschrieben = true;
    } catch {
      /* weiter mit dem nächsten */
    }
  }
  if (geschrieben) melde();
  return geschrieben && frei > 0;
}

/** Test-Hilfe / Umzug: eine alte Schlange (v1) wird gelesen und umgeschrieben. */
function uebernimmAlteFassung(accountId: string): void {
  let roh: string | null = null;
  try {
    roh = localStorage.getItem(`${ALT_PRAEFIX}${accountId}`);
  } catch {
    return;
  }
  if (!roh) return;
  try {
    const liste = JSON.parse(roh) as unknown[];
    const s = lese(accountId);
    for (const x of Array.isArray(liste) ? liste : []) {
      const o = x as Record<string, unknown>;
      if (o?.art === "ereignis" && o.daten) s.zeilen.push(o.daten as TaskEvent);
      else {
        const e = einzelnAus(x);
        if (e) s.einzeln.push(e);
        else console.warn("[nachsenden] unlesbarer Eintrag verworfen", x);
      }
    }
    s.zeilen.sort((a, b) => a.ts - b.ts);
    schreibe(accountId, s);
    localStorage.removeItem(`${ALT_PRAEFIX}${accountId}`);
  } catch (e) {
    console.warn("[nachsenden] alte Warteschlange unlesbar - verworfen", accountId, e);
  }
}

// --- Öffentliche Sicht ------------------------------------------------------

/**
 * Alle wartenden Einträge dieses Kontos - Ergebnisse, dann Zeilen. Die
 * Zeilen erscheinen einzeln (Kennung = Schlüssel), mit dem gemeinsamen Zustand.
 */
export function ausstehende(accountId: string): Ausstehend[] {
  if (!accountId) return [];
  uebernimmAlteFassung(accountId);
  const s = lese(accountId);
  const zeilen: Ausstehend[] = s.zeilen.map((e) => ({
    id: zeilenSchluessel(e),
    art: "ereignis",
    schluessel: zeilenSchluessel(e),
    daten: e,
    seitMs: e.ts,
    ...s.zeilenZustand,
  }));
  return [...s.einzeln, ...zeilen];
}

/**
 * Einen Eintrag vormerken. Steht einer mit derselben Art und demselben
 * Schlüssel schon da:
 *  • ohne `ersetzen` bleibt der ERSTE stehen (Ergebnis, Zeile);
 *  • mit `ersetzen` gilt der NEUE - mit NEUER Kennung, frischem Zustand. Ein
 *    laufender Durchgang, der den alten gerade sendet, löscht danach nur den
 *    alten.
 *
 * Gibt zurück, ob der Eintrag im Gerät liegt (false: kein Speicher - dann
 * sendet der Aufrufer selbst, einmal).
 */
export function merkeVor(
  accountId: string,
  art: NachsendeArt,
  schluessel: string,
  daten: unknown,
  opt: { ersetzen?: boolean } = {},
): boolean {
  if (!accountId || !schluessel) return false;
  uebernimmAlteFassung(accountId);
  const s = lese(accountId);
  if (art === "ereignis") {
    const e = daten as TaskEvent;
    if (!e || typeof e.ts !== "number" || typeof e.lesson !== "string") return false;
    // ★ Der Schlüssel einer Zeile ist IMMER „ts|lesson" aus der Zeile selbst,
    // nie der übergebene (dritte Prüfung K3) - dieselbe Kennung, an der der
    // Server sie wiedererkennt.
    const k = zeilenSchluessel(e);
    if (s.zeilen.some((x) => zeilenSchluessel(x) === k)) return true;
    s.zeilen.push(e);
    if (s.zeilen.length > 1 && s.zeilen[s.zeilen.length - 2].ts > e.ts)
      s.zeilen.sort((a, b) => a.ts - b.ts);
    const ok = schreibe(accountId, s);
    // ★★ Vierte Prüfung M1: „liegt im Gerät" NUR, wenn GENAU DIESE Zeile
    // geschrieben ist. Kappte der volle Speicher sie weg, meldet merkeVor
    // `false` - dann sendet der Aufrufer sie direkt, wie auf f10c6eea. Sonst
    // ging bei vollem Speicher JEDE Zeile still verloren, auch mit Netz.
    return ok && lese(accountId).zeilen.some((x) => zeilenSchluessel(x) === k);
  }
  const da = s.einzeln.findIndex((e) => e.art === art && e.schluessel === schluessel);
  if (da >= 0 && !opt.ersetzen) return true;
  const neu: Ausstehend = { id: neueId(), art, schluessel, daten, seitMs: Date.now(), ...FRISCH };
  if (da >= 0) s.einzeln.splice(da, 1);
  s.einzeln.push(neu);
  return schreibe(accountId, s);
}

/** Wartet dieser Eintrag noch? */
export function istAusstehend(accountId: string, art: NachsendeArt, schluessel: string): boolean {
  if (!accountId) return false;
  // Ohne die Zeilen-Sicht aufzubauen - die Anzeige fragt das oft.
  const s = lese(accountId);
  if (art === "probe") return s.einzeln.some((e) => e.art === art && e.schluessel === schluessel);
  return s.zeilen.some((e) => zeilenSchluessel(e) === schluessel);
}

/**
 * ★ Ein Konto wurde an diesem Gerät gelöscht: seine Schlange ebenso
 * (vierte Prüfung K5) - nichts davon soll auf dem Gerät liegen bleiben.
 */
export function vergissKonto(accountId: string): void {
  if (!accountId) return;
  zwischenspeicher.delete(accountId);
  ohneVerbindung.delete(accountId);
  try {
    localStorage.removeItem(schluesselVon(accountId));
    localStorage.removeItem(`${ALT_PRAEFIX}${accountId}`);
  } catch {
    /* kein Speicher - dann liegt auch nichts */
  }
  melde();
}

/** Der wartende Eintrag dieser Art und dieses Schlüssels (oder null). */
export function wartender(
  accountId: string,
  art: NachsendeArt,
  schluessel: string,
): Ausstehend | null {
  return ausstehende(accountId).find((e) => e.art === art && e.schluessel === schluessel) ?? null;
}

/** Gilt dieser Eintrag als „der Server nimmt ihn nicht"? */
export function giltAlsAbgewiesen(e: Pick<Ausstehend, "abgewiesen">): boolean {
  return e.abgewiesen > 0;
}

// --- Verbindung ------------------------------------------------------------

/** Konten, deren letzter Versuch am WIRKLICH fehlenden Netz scheiterte. */
const ohneVerbindung = new Set<string>();

/** Fehlt gerade das Netz, und wartet etwas? - für den ruhigen Satz. */
export function verbindungFehlt(accountId: string): boolean {
  return ohneVerbindung.has(accountId) && ausstehende(accountId).length > 0;
}

function setzeVerbindung(accountId: string, fehlt: boolean): void {
  if (ohneVerbindung.has(accountId) === fehlt) return;
  if (fehlt) ohneVerbindung.add(accountId);
  else ohneVerbindung.delete(accountId);
  melde();
}

// --- Senden -----------------------------------------------------------------

/** Je Konto höchstens EIN Durchgang gleichzeitig. */
const laeuft = new Map<string, Promise<void>>();

export interface SendeOptionen {
  /** Auch Abgewiesenes und Aufgegebenes versuchen (Start, `online`, Abmelden). */
  auchAbgewiesene?: boolean;
  /** Die Wartezeit nach Fehlversuchen überspringen (Start, `online`, Abmelden). */
  sofort?: boolean;
  /** Wird vor jeder Einheit gefragt: `true` ⇒ aufhören (Kontowechsel). */
  abbrechen?: () => boolean;
}

function warteZeit(fehlversuche: number): number {
  const roh = WARTE_BASIS_MS * 2 ** Math.max(0, fehlversuche - 1);
  // Gestreut, aber NIE über der Obergrenze (vierte Prüfung K4).
  return Math.min(WARTE_MAX_MS, Math.round(roh * (0.5 + Math.random())));
}

/** Den Zustand einer Einheit nach einer Antwort fortschreiben. */
function nachAntwort(z: Zustand, antwort: SendeAntwort): void {
  if (antwort === "abgewiesen") {
    z.abgewiesen += 1;
  } else if (antwort === "server" || antwort === "netz") {
    if (antwort === "server") z.serverFehler += 1;
    z.fehlversuche += 1;
    z.naechsterMs = Date.now() + warteZeit(z.fehlversuche);
  }
}

function faellig(z: Zustand, opt: SendeOptionen): boolean {
  if (giltAlsAbgewiesen(z) && !opt.auchAbgewiesene) return false;
  if (z.naechsterMs > Date.now() && !opt.sofort) return false;
  return true;
}

/**
 * Den Absender mit Frist aufrufen: Nach {@link SENDE_FRIST_MS} wird die
 * Anfrage über ihr `AbortSignal` WIRKLICH abgebrochen und gilt als „server".
 */
function mitSendeFrist(absender: Absender, eintraege: Ausstehend[]): Promise<SendeAntwort> {
  const ctrl = new AbortController();
  return new Promise((ok) => {
    const t = setTimeout(() => {
      console.warn(`[nachsenden] Anfrage hängt länger als ${SENDE_FRIST_MS / 1000} s - abgebrochen, später nochmal`);
      ctrl.abort();
      ok("server");
    }, SENDE_FRIST_MS);
    absender(eintraege, ctrl.signal).then(
      (a) => {
        clearTimeout(t);
        ok(a);
      },
      () => {
        clearTimeout(t);
        ok("server");
      },
    );
  });
}

/**
 * ★ Eine Anfrage an den Server ist gelungen (auch AUSSERHALB der Schlange,
 * z. B. ein normales Speichern des Lernstands): Die Wartezeiten dieses Kontos
 * werden zurückgesetzt - der Server ist offensichtlich wieder da (dritte
 * Prüfung S1). „Abgewiesen" bleibt, das ist eine Antwort, keine Störung.
 */
export function meldeVerbindungGut(accountId: string): void {
  if (!accountId) return;
  const s = lese(accountId);
  let geaendert = false;
  for (const z of [s.zeilenZustand, ...s.einzeln]) {
    if (z.fehlversuche || z.naechsterMs || z.serverFehler) {
      z.fehlversuche = 0;
      z.naechsterMs = 0;
      z.serverFehler = 0;
      geaendert = true;
    }
  }
  if (geaendert) schreibe(accountId, s);
  setzeVerbindung(accountId, false);
}

/**
 * Alles Fällige dieses Kontos senden: Ergebnisse, dann alle Zeilen. Läuft
 * schon ein Durchgang, wartet dieser auf ihn und startet danach einen eigenen.
 */
export async function sendeAusstehende(
  accountId: string,
  absender: Absender,
  opt: SendeOptionen = {},
): Promise<void> {
  if (!accountId) return;
  const vorher = laeuft.get(accountId);
  const durchgang = (async () => {
    if (vorher) await vorher.catch(() => undefined);
    uebernimmAlteFassung(accountId);
    const s0 = lese(accountId);
    const einheiten: Array<{ art: NachsendeArt; ids: string[] }> = [
      ...s0.einzeln.map((e) => ({ art: e.art, ids: [e.id] })),
      ...(s0.zeilen.length ? [{ art: "ereignis" as const, ids: [] }] : []),
    ];
    for (const einheit of einheiten) {
      if (opt.abbrechen?.()) return;
      const s = lese(accountId);
      let eintraege: Ausstehend[];
      let zustand: Zustand;
      if (einheit.art === "ereignis") {
        if (!faellig(s.zeilenZustand, opt) || s.zeilen.length === 0) continue;
        eintraege = ausstehende(accountId).filter((e) => e.art === "ereignis");
        zustand = s.zeilenZustand;
      } else {
        const e = s.einzeln.find((x) => x.id === einheit.ids[0]);
        if (!e || !faellig(e, opt)) continue;
        eintraege = [e];
        zustand = e;
      }
      let antwort: SendeAntwort;
      try {
        antwort = await mitSendeFrist(absender, eintraege);
      } catch {
        antwort = "server";
      }
      if (antwort === "abbruch") return;
      const nach = lese(accountId);
      if (antwort === "ok") {
        if (einheit.art === "ereignis") {
          const weg = new Set(eintraege.map((e) => e.schluessel));
          nach.zeilen = nach.zeilen.filter((e) => !weg.has(zeilenSchluessel(e)));
          nach.zeilenZustand = { ...FRISCH };
        } else {
          // ⚠️ Nur DIESE Kennung.
          nach.einzeln = nach.einzeln.filter((x) => x.id !== eintraege[0].id);
        }
        schreibe(accountId, nach);
        // Gelungen: auch die Wartezeiten der übrigen Einheiten zurücksetzen.
        meldeVerbindungGut(accountId);
        continue;
      }
      // Fehlschlag: Zustand der Einheit fortschreiben (am AKTUELLEN Stand).
      const ziel =
        einheit.art === "ereignis"
          ? nach.zeilenZustand
          : nach.einzeln.find((x) => x.id === eintraege[0].id);
      if (ziel) nachAntwort(ziel, antwort);
      else nachAntwort(zustand, antwort);
      schreibe(accountId, nach);
      if (antwort === "netz") {
        setzeVerbindung(accountId, true);
        return; // Kein Netz: aufhören - der Rest käme genauso wenig an.
      }
      setzeVerbindung(accountId, false);
    }
  })();
  laeuft.set(accountId, durchgang);
  try {
    await durchgang;
  } finally {
    if (laeuft.get(accountId) === durchgang) laeuft.delete(accountId);
  }
}

/** Erst nach einem laufenden Durchgang dieses Kontos (K4). */
export async function nachLaufendemDurchgang(accountId: string): Promise<void> {
  const l = laeuft.get(accountId);
  if (l) await l.catch(() => undefined);
}

/** Wartet etwas, das im Takt versucht werden soll? */
export function wartetImTakt(accountId: string): boolean {
  const s = lese(accountId);
  const jetzt = Date.now();
  const bereit = (z: Zustand) => !giltAlsAbgewiesen(z) && z.naechsterMs <= jetzt;
  return (s.zeilen.length > 0 && bereit(s.zeilenZustand)) || s.einzeln.some(bereit);
}

/** Test-Hilfe: laufende Durchgänge und Zwischenspeicher vergessen. */
export function _nachsendenZuruecksetzen(): void {
  laeuft.clear();
  ohneVerbindung.clear();
  zwischenspeicher.clear();
}
