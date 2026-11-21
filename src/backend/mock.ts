/**
 * Local, zero-dependency backend. Persists to localStorage so the whole app
 * (auth, progress, exam lock, dashboard) works offline for the morning review
 * without Java / a real server. PocketBase mirrors this contract for
 * production (EU self-host).
 */
import {
  type AdminStats,
  type Statistik,
  type StatistikTextvorratKind,
  type AdminUserDirectory,
  type SimStat,
  type Backend,
  type OwnProfileUpdate,
  type Role,
  type UserProfile,
  BackendError,
} from "./types";
import type { ProgrammeOverrides } from "../lib/allPrograms";
import { genThrowawayPassword } from "../lib/throwawayPassword";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function genCode(): string {
  // 4-stelliger Check-in-Code (muss zu CHECKIN_CODE_LENGTH in checkinLink.ts passen).
  let s = "";
  for (let i = 0; i < 4; i++)
    s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return s;
}
// Textvorrat der Admin-Statistik: erfundene Lernstände für das Layout.
// ⚠️ NUR die Bitset-Primitive - KEIN Korpus (s. `mockTextvorratKinder`).
import { emptySeen,encodeSeen,seenAdd } from "@/lib/typing/ledger";
import { mitErweiterung } from "./erweiterung/mock";


export const NS = "sensorik:v1:";
const SESSION_KEY = NS + "session";

export function genId(): string {
  const c = globalThis.crypto;
  return c?.randomUUID
    ? c.randomUUID()
    : "id_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface StoredUser extends UserProfile {
  pwHash: string;
}

export function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(NS + key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function write(key: string, value: unknown) {
  localStorage.setItem(NS + key, JSON.stringify(value));
}

export const uidFor = (email: string) => "u_" + hash(email.toLowerCase());

// base64url → Text (für das mittlere JWT-Segment).
function b64urlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return typeof atob === "function"
    ? atob(b64)
    : Buffer.from(b64, "base64").toString("binary");
}

// Mock-Decoder des Handoff-Tokens. Akzeptiert:
//  • ein echtes Handoff-JWT (mittleres Segment = base64url-JSON), oder
//  • die bequeme Testform „learner:CTX[:SUB[:NAME[:EMAIL]]]" bzw. „instructor:CTX".
// Gibt {sub, contextId, role, name?, email?} zurück oder null (→ „expired").
export function parseMockHandoffToken(t: string): {
  sub: string;
  contextId: string;
  role: "learner" | "instructor";
  name?: string;
  email?: string;
} | null {
  if (!t) return null;
  const conv = /^(learner|instructor):([^:]+)(?::(.+))?$/.exec(t);
  if (conv) {
    // conv[3] = „SUB[:NAME[:EMAIL]]" — Abschnitt-B „mit Namen" bequem testbar.
    const rest = (conv[3] || "").split(":");
    return {
      role: conv[1] as "learner" | "instructor",
      contextId: conv[2],
      sub: rest[0] || `demo-${conv[2]}`,
      name: rest[1] || undefined,
      email: rest[2] || undefined,
    };
  }
  const parts = t.split(".");
  if (parts.length >= 2) {
    try {
      const p = JSON.parse(b64urlDecode(parts[1])) as {
        sub?: unknown;
        contextId?: unknown;
        context?: { id?: unknown };
        role?: unknown;
        name?: unknown;
        email?: unknown;
      };
      const contextId = String(p.contextId ?? p.context?.id ?? "");
      const sub = String(p.sub ?? "");
      if (contextId && sub) {
        return {
          sub,
          contextId,
          role: p.role === "instructor" ? "instructor" : "learner",
          name: typeof p.name === "string" ? p.name : undefined,
          email: typeof p.email === "string" ? p.email : undefined,
        };
      }
    } catch {
      /* kein gültiges JWT */
    }
  }
  return null;
}

/**
 * Erfundene Kind-Konten für den Textvorrats-Abschnitt der Admin-Statistik
 * (20.09.2026), damit beim Bauen etwas dasteht.
 *
 * ⚠️ Der KORPUS wird hier bewusst NICHT angefasst. Ein Bitset aus den echten
 * Vorrats-Indizes zu bauen hiesse, den ganzen Korpus in jeden Test zu ziehen,
 * der das Mock-Backend nach der Statistik fragt - gemessen rund vier Sekunden,
 * und zwei fremde Wächter liefen damit in ihre Zeitgrenze. Stattdessen werden
 * einfach die ersten `bis` Baustein-Indizes gesetzt; welche davon zum Vorrat
 * einer Stufe gehören, rechnet die Seite selbst aus. Die Prozentzahlen sind
 * dadurch krumm - das ist gut so: Sie sehen nicht nach echten Daten aus.
 *
 * ⚠️ Erfundene Zahlen bleiben erfundene Zahlen: Sie gehören ins Layout, in
 * keine Entscheidung (dieselbe Warnung wie über `getStatistik`).
 */
function mockTextvorratKinder(): StatistikTextvorratKind[] {
  const bits = (bis: number): string => {
    let menge = emptySeen();
    for (let i = 0; i < bis; i++) menge = seenAdd(menge, i);
    return encodeSeen(menge);
  };
  const kinder: StatistikTextvorratKind[] = [
    // Das fleissigste Kind: eine 7. Schulstufe, also „teens".
    { k: 1, ks: 7, b: bits(2600) },
    { k: 1, ks: 7, b: bits(900) },
    { k: 1, ks: 7, b: bits(260) },
    // Eine zweite Klasse in der Grundschule.
    { k: 1, ks: 3, b: bits(1400) },
    { k: 1, ks: 3, b: bits(120) },
    // Selbstlernend, mit Geburtsjahr statt Stufe.
    { j: new Date().getFullYear() - 34, b: bits(700) },
    // Englisch, über die Klasse gesetzt.
    { k: 1, ks: 9, kl: "en", b: bits(900) },
  ];
  // Und viele, die noch gar nichts aus dem Korpus getippt haben.
  for (let i = 0; i < 24; i++) kinder.push({ k: 1, ks: 5 });
  return kinder;
}

// Rollen, die eine Lehrkraft/Admin über die Teilnehmer-Verwaltung VERGEBEN
// darf — NIE "admin" (spiegelt ASSIGNABLE_PARTICIPANT_ROLES im Hook).
export const ASSIGNABLE_PARTICIPANT_ROLES: Role[] = [
  "student",
  "course_observer",
  "teacher",
];

// Nur noch EIN Admin- + EIN Studierenden-Demokonto (Nutzerwunsch
// 2026-05-19): aufgeräumt, Admin lokal weiter testbar. Auf Produktion
// werden Demo-Konten ohnehin übersprungen (setup.mjs PB_SEED_DEMO).
const DEMO: Array<[string, string, string, Role]> = [
  ["admin@example.edu", "Test1234!", "Admin (Demo)", "admin"],
  ["student1@example.edu", "Test1234!", "Studentin Demo 1", "student"],
];

/** Anhänge des Workshop-Chats (nur im Speicher; der Mock hält keine Dateien). */
export const chatAnhaenge = new Map<string, Blob>();

export class MockKern {
  readonly kind = "mock" as const;
  protected listeners = new Set<(u: UserProfile | null) => void>();
  protected session: UserProfile | null = null;

  async init() {
    const users = read<Record<string, StoredUser>>("users", {});
    if (Object.keys(users).length === 0) {
      for (const [email, pw, name, role] of DEMO) {
        const uid = uidFor(email);
        users[uid] = {
          uid,
          email,
          displayName: name,
          role,
          createdAt: Date.now(),
          verified: true, // Demo-Konten gelten als bestätigt.
          pwHash: hash(pw),
        };
      }
      write("users", users);
      this.seedDemoData();
    }
    // Demo-Einheit-Inhalt immer sicherstellen (auch bei bereits
    // initialisiertem Dev-Store), damit das Kästchen-Layout sichtbar ist.
    this.seedDemoUnitContent();
    const stored = read<UserProfile | null>("session", null);
    // Sitzung aus dem (maßgeblichen) Users-Store auffrischen, damit
    // u.a. `verified`/`role` aktuell sind (auch bei Alt-Sitzungen).
    const fresh = stored ? this.users()[stored.uid] : null;
    this.session = fresh ? this.strip(fresh) : stored;
  }

  /** Andockpunkte für Probedaten: der Hörsaal-Teil legt hier seinen
   *  Beispielkurs an (nur im Probe-Backend, nie live). */
  protected seedDemoData() {}
  protected seedDemoUnitContent() {}

  onAuthChange(cb: (u: UserProfile | null) => void) {
    this.listeners.add(cb);
    cb(this.session);
    return () => this.listeners.delete(cb);
  }
  protected emit() {
    for (const l of this.listeners) l(this.session);
  }
  currentUser() {
    return this.session;
  }

  protected users(): Record<string, StoredUser> {
    return read<Record<string, StoredUser>>("users", {});
  }

  /**
   * ⚠️ NUR FÜR TESTS — im Backend-Vertrag (src/backend/types.ts) gibt es
   * diese Tür nicht, und im PocketBase-Backend auch nicht.
   *
   * Legt ein Studi-Konto an und meldet es an, ohne Beitritts-Code. Die
   * meisten Tests brauchen bloß „irgendein angemeldetes Konto"; sie über
   * `signUp` zu führen hieße, in jedem Test erst einen laufenden Kurs mit
   * Code zu bauen. Wer die echte Selbst-Registrierung prüfen will, nimmt
   * `signUp` — genau das tut tests/enroll-code.test.ts.
   */
  async testKontoAnlegen(
    email: string,
    password: string,
    displayName: string,
  ) {
    return this.strip(this.kontoAnlegen(email, password, displayName));
  }

  /** Gemeinsamer Kern von `signUp` und `testKontoAnlegen`. */
  protected kontoAnlegen(
    email: string,
    password: string,
    displayName: string,
  ): StoredUser {
    email = email.trim().toLowerCase();
    if (password.length < 8)
      throw new BackendError("Passwort zu kurz (mind. 8 Zeichen).", "auth/weak-password");
    const users = this.users();
    const uid = uidFor(email);
    if (users[uid]) throw new BackendError("E-Mail wird bereits verwendet.", "auth/email-in-use");
    const profile: StoredUser = {
      uid,
      email,
      displayName: displayName.trim() || email,
      role: "student",
      createdAt: Date.now(),
      verified: false, // R2-5: erst nach E-Mail-Bestätigung true.
      pwHash: hash(password),
    };
    users[uid] = profile;
    write("users", users);
    this.setSession(profile);
    return profile;
  }

  async adminCreateUser(
    email: string,
    displayName: string,
    role: Role,
  ) {
    email = email.trim().toLowerCase();
    const users = this.users();
    const uid = uidFor(email);
    if (users[uid])
      throw new BackendError(
        "E-Mail wird bereits verwendet.",
        "auth/email-in-use",
      );
    // Phase C / Welcome-Mail: 64-Zeichen-Zufalls-PW, das niemand kennen
    // oder nutzen muss. Studi setzt eigene PW über den Reset-Link.
    const throwaway = genThrowawayPassword();
    const profile: StoredUser = {
      uid,
      email,
      displayName: displayName.trim() || email,
      role,
      createdAt: Date.now(),
      // R2-5 / Phase C: Konto bleibt unverified, bis die Studi den
      // Reset-Link in der Welcome-Mail klickt. Vorher kein Kursbeitritt.
      verified: false,
      pwHash: hash(throwaway),
    };
    users[uid] = profile;
    write("users", users);
    // deliberately NO setSession: the admin stays logged in.
    return this.strip(profile);
  }

  /**
   * Phase C / Welcome-Mail: lokal kein SMTP — wir merken uns nur, dass
   * für diese Adresse eine Welcome-Mail "verschickt" wurde (Tests +
   * Admin-UI greifen darauf zu). Idempotent.
   */
  async sendWelcomeMail(email: string): Promise<void> {
    email = email.trim().toLowerCase();
    const list = read<Record<string, number>>("welcomeMailedAt", {});
    list[email] = Date.now();
    write("welcomeMailedAt", list);
  }

  /**
   * 2026-06-08: Admin vergibt ein Start-Passwort. Konto sofort aktiv
   * (`verified:true`) + `mustChangePassword:true` für den erzwungenen
   * Erstwechsel. Ändert NICHT die Admin-Sitzung (außer beim eigenen Konto).
   */
  async adminSetPassword(uid: string, password: string): Promise<void> {
    this.forbidObserverWrites();
    if (password.length < 8)
      throw new BackendError(
        "Passwort zu kurz (mind. 8 Zeichen).",
        "auth/weak-password",
      );
    const users = this.users();
    const u = users[uid];
    if (!u) throw new BackendError("Konto nicht gefunden.", "not-found");
    u.pwHash = hash(password);
    u.mustChangePassword = true;
    u.verified = true;
    write("users", users);
    if (this.session?.uid === uid) this.setSession(u);
  }

  /**
   * 2026-06-08: erzwungener Erstwechsel — die angemeldete Person setzt ihr
   * eigenes Passwort und löscht das Flag. Sitzung bleibt bestehen (im Mock
   * rotiert kein Token); die Studi ist danach normal angemeldet.
   */
  async finishForcedPasswordChange(password: string): Promise<void> {
    if (!this.session)
      throw new BackendError("Nicht angemeldet.", "auth/invalid-credentials");
    if (password.length < 8)
      throw new BackendError(
        "Passwort zu kurz (mind. 8 Zeichen).",
        "auth/weak-password",
      );
    const users = this.users();
    const u = users[this.session.uid];
    if (!u) throw new BackendError("Konto nicht gefunden.", "not-found");
    u.pwHash = hash(password);
    u.mustChangePassword = false;
    write("users", users);
    this.setSession(u);
  }

  /**
   * Phase C / Welcome-Mail: Reset-Token einlösen + neues Passwort
   * setzen. Im Mock gibt es keine echten Mail-Tokens — als Token wird
   * (wie bei `confirmEmailVerification`) die uid ODER die E-Mail des
   * Kontos akzeptiert; das genügt für lokale Tests und die
   * ResetPasswordPage im Token-Modus. Setzt zugleich `verified:true`
   * (Entscheidung 6c — auf Live erledigt das der pb_hook).
   */
  async confirmPasswordReset(
    token: string,
    newPassword: string,
  ): Promise<void> {
    const t = token.trim();
    if (!t) throw new BackendError("Ungültiger Link.", "not-found");
    if (newPassword.length < 8)
      throw new BackendError(
        "Passwort zu kurz (mind. 8 Zeichen).",
        "auth/weak-password",
      );
    const users = this.users();
    const u = users[t] ?? users[uidFor(t.toLowerCase())];
    if (!u)
      throw new BackendError(
        "Der Link ist ungültig oder abgelaufen.",
        "not-found",
      );
    u.pwHash = hash(newPassword);
    u.verified = true;
    write("users", users);
    if (this.session?.uid === u.uid) this.setSession(u);
  }

  async signIn(email: string, password: string) {
    email = email.trim().toLowerCase();
    const u = this.users()[uidFor(email)];
    if (!u || u.pwHash !== hash(password))
      throw new BackendError("E-Mail oder Passwort ist falsch.", "auth/invalid-credentials");
    this.setSession(u);
    return this.strip(u);
  }

  async signOut() {
    this.session = null;
    localStorage.removeItem(SESSION_KEY);
    this.emit();
  }

  async resetPassword(email: string) {
    // Local mock: reset to a known value and surface it (no e-mail to send).
    const users = this.users();
    const u = users[uidFor(email.trim().toLowerCase())];
    if (u) {
      u.pwHash = hash("Test1234!");
      write("users", users);
    }
    // Always resolve (no account enumeration), like real auth backends.
  }

  protected strip(u: StoredUser): UserProfile {
    const { pwHash: _pw, ...rest } = u;
    // Alt-Datensätze (vor R2-5) hatten kein `verified` → als bestätigt
    // behandeln, damit bestehende lokale Tester nicht plötzlich
    // ausgesperrt sind. Neu-Signup setzt es explizit auf false.
    return { ...rest, verified: u.verified ?? true };
  }

  /** R2-5: setzt ein Konto auf bestätigt (mock-intern). */
  protected markVerified(uid: string) {
    const users = this.users();
    const u = users[uid];
    if (!u) throw new BackendError("Konto nicht gefunden.", "not-found");
    if (!u.verified) {
      u.verified = true;
      write("users", users);
    }
    if (this.session?.uid === uid) this.setSession(u);
  }

  /** R2-5: lokal kein SMTP → bewusstes No-op (kein harter Fehler). */
  async requestEmailVerification(): Promise<void> {
    /* Versand ist Infrastruktur (PocketBase-SMTP). */
  }

  /**
   * R2-5: Token einlösen. Im Mock gibt es keine echten Mail-Tokens;
   * als Token wird die uid ODER die E-Mail des Kontos akzeptiert
   * (genügt für lokale Tests / die ConfirmEmail-Seite).
   */
  async confirmEmailVerification(token: string): Promise<void> {
    const t = token.trim();
    if (!t) throw new BackendError("Ungültiger Bestätigungslink.", "not-found");
    const byUid = this.users()[t];
    const uid = byUid ? t : uidFor(t.toLowerCase());
    this.markVerified(uid);
  }

  /**
   * Adresswechsel bestätigen. Im Mock gibt es keine echten Mail-Tokens und
   * keine zweite Adresse - der Fall wird wie eine Bestätigung behandelt, damit
   * die Seite lokal durchspielbar bleibt. Das Passwort wird nur auf „nicht
   * leer" geprüft: Eine Attrappe, die Passwörter wirklich prüft, wäre eine
   * zweite Wahrheit neben dem Server.
   */
  async confirmEmailChange(token: string, password: string): Promise<void> {
    if (!password.trim())
      throw new BackendError("Bitte das eigene Passwort eingeben.", "auth/invalid-credentials");
    await this.confirmEmailVerification(token);
  }

  /**
   * NUR Mock/Tests: simuliert das Klicken des Bestätigungslinks für
   * eine E-Mail (nicht Teil des Backend-Interfaces). Wird vom lokalen
   * Dev-Knopf auf der „Bitte bestätigen"-Seite genutzt.
   */
  async __simulateEmailConfirm(email: string): Promise<void> {
    this.markVerified(uidFor(email.trim().toLowerCase()));
  }
  protected setSession(u: StoredUser) {
    this.session = this.strip(u);
    write("session", this.session);
    this.emit();
  }

  async getProfile(uid: string) {
    const u = this.users()[uid];
    return u ? this.strip(u) : null;
  }
  async listUsers() {
    return Object.values(this.users()).map((u) => this.strip(u));
  }

  /**
   * Admin-Leitstand (Etappe 6) — lokale Aggregation aus den Mock-Stores.
   * Welt B (Lernwerkstatt-Trainer, Collections tt_ und lw_) lebt im separaten
   * Trainer-Backend und ist im Mock 0 (gegen die echte PocketBase liefert der
   * Server-Hook die echten Zahlen). Genügt für Tests + Dev-Vorschau.
   */
  async getSimStats(): Promise<SimStat[]> {
    // Mock/Dev: Demo-Zahlen, damit die Verwaltungs-Seite lokal etwas zeigt.
    // Live kommen die echten anonymen Zähler aus dem Server-Hook.
    return [
      { program: "sehsimulation", starts: 842, avgMs: 190_000 },
      { program: "bildbeschreibung", starts: 311, avgMs: 95_000 },
      { program: "hoeren-tempo", starts: 233, avgMs: 100_000 },
      { program: "screenreader", starts: 410, avgMs: 125_000 },
      { program: "serielles-lesen", starts: 152, avgMs: 80_000 },
      { program: "tabellen", starts: 98, avgMs: 70_000 },
      { program: "ipad-gesten", starts: 187, avgMs: 110_000 },
    ];
  }

  /**
   * Mock/Dev: erfundene, aber PLAUSIBLE Zahlen, damit die Statistikseite lokal
   * etwas zeigt und die Diagramme beim Bauen beurteilt werden können.
   *
   * ⚠️ Erfundene Zahlen sind hier ausdrücklich als solche zu behandeln: Am
   * 29.08.2026 wurden vier Stellschrauben des Tipp-Tors nach Werten aus einer
   * Simulation verstellt - genau der Fehler, den der anonyme Topf seither
   * verhindern soll. Diese Werte gehören in KEINE Entscheidung, nur ins Layout.
   */
  async getStatistik(tage = 90): Promise<Statistik> {
    const t = Math.min(730, Math.max(1, Math.round(tage)));
    const TAG_MS = 86400000;
    const heute = Math.floor(Date.now() / TAG_MS);
    const vonTag = heute - t + 1;

    const verlauf = [];
    for (let d = vonTag; d <= heute; d++) {
      // Eine ruhige Welle mit Wochenend-Delle - reicht, um zu sehen, ob die
      // Kurve stimmt, und sieht nicht nach echten Daten aus.
      const wochentag = (d + 4) % 7; // 0 = Montag
      const grund = wochentag >= 5 ? 6 : 18;
      const welle = Math.round(grund + 8 * Math.sin(d / 5));
      const besuche = Math.max(0, welle);
      verlauf.push({
        tag: d,
        besuche,
        besucher: Math.round(besuche * 0.7),
        dauerMs: besuche * 145_000,
        besucheGast: Math.round(besuche * 0.8),
      });
    }

    const prog = (
      programm: string,
      bereich: string,
      besuche: number,
      avgMs: number,
    ) => ({
      programm,
      bereich,
      besuche,
      besucher: Math.round(besuche * 0.68),
      dauerMs: besuche * avgMs,
      besucheGast: Math.round(besuche * (bereich === "sim" ? 0.95 : 0.55)),
      dauerGastMs: Math.round(besuche * avgMs * (bereich === "sim" ? 0.95 : 0.5)),
      avgMs,
      avgGastMs: Math.round(avgMs * 0.9),
    });

    return {
      generatedAt: Date.now(),
      zeitraum: { tage: t, vonTag, bisTag: heute },
      reichweite: {
        menschenImZeitraum: 1284,
        menschenGesamt: 3907,
        geraeteImZeitraum: 611,
        geraeteGesamt: 1502,
        geraeteWiederkehrend: 233,
        geraeteEinmalig: 378,
        besucheJeGeraet: 2.4,
        tageJeGeraet: 1.9,
        verweilJeGeraetMs: 322_000,
        wiederkehrVerteilung: [
          { label: "1 Tag", anzahl: 378 },
          { label: "2 Tage", anzahl: 121 },
          { label: "3-5 Tage", anzahl: 68 },
          { label: "6-10 Tage", anzahl: 27 },
          { label: "11-30 Tage", anzahl: 14 },
          { label: "über 30 Tage", anzahl: 3 },
        ],
        programme: [
          prog("sehsimulation", "sim", 842, 190_000),
          prog("screenreader", "sim", 410, 125_000),
          prog("bildbeschreibung", "sim", 311, 95_000),
          prog("hoeren-tempo", "sim", 233, 100_000),
          prog("ipad-gesten", "sim", 187, 110_000),
          prog("serielles-lesen", "sim", 152, 80_000),
          prog("tabellen", "sim", 98, 70_000),
          prog("tippen", "app", 654, 480_000),
          prog("computer", "app", 214, 360_000),
          prog("braille", "app", 121, 300_000),
          prog("klangpunkte", "app", 46, 260_000),
          prog("hoerbuch", "app", 33, 210_000),
        ],
        verlauf,
      },
      lernen: {
        besucheOhneAnmeldung: { besuche: 588, dauerMs: 588 * 300_000 },
        ohneAnmeldung: {
          geraete: 96,
          uebungstage: 268,
          minuten: 1940,
          wiederkehrend: 41,
          programme: [{ programm: "tippen", geraete: 96, tage: 268, minuten: 1940 }],
        },
        mitKonto: {
          kinderGesamt: 0,
          kinderAktiv: 0,
          selbstlernende: 0,
          minuten: 0,
          programme: [],
        },
      },
      /*
        ⚠️ ERFUNDENE Konten, nur fürs Layout (wie alle Zahlen hier). Sie stehen
        seit 20.09.2026 da, weil die Lehrkraft-Tabelle sonst in jeder Vorschau
        leer ist - und damit auch das grüne Häkchen für Spendende, das Johannes
        an diesem Tag in die Statistik bestellt hat. Die zweite Zeile trägt
        bewusst KEINE Spende, damit der Unterschied sichtbar ist.
        Die Namen sind als Beispiel kenntlich; echte Lernwerkstatt-Konten leben
        im Trainer-Backend und kommen im Mock nicht vor.
      */
      lehrkraefte: {
        anzahl: 2,
        klassen: 3,
        liste: [
          {
            id: "beispiel-1",
            anmeldename: "beispiel.eins@example.org",
            name: "Beispiel Eins",
            bestaetigt: true,
            angelegtMs: Date.now() - 200 * TAG_MS,
            klassen: 2,
            kinder: 14,
            kinderAktiv: 9,
            minuten: 640,
            letzterTag: heute - 1,
            gespendetMs: Date.now() - 12 * TAG_MS,
          },
          {
            id: "beispiel-2",
            anmeldename: "beispiel.zwei@example.org",
            name: "Beispiel Zwei",
            bestaetigt: false,
            angelegtMs: Date.now() - 40 * TAG_MS,
            klassen: 1,
            kinder: 5,
            kinderAktiv: 2,
            minuten: 95,
            letzterTag: heute - 6,
            gespendetMs: 0,
          },
        ],
      },
      /*
        ★ Textvorrat (20.09.2026) - erfundene Konten mit erfundenen
        Lernständen, damit die Seite beim Bauen etwas zeigt. Die ANTEILE
        rechnet die Seite daraus selbst aus, gegen den echten Korpus.
        ⚠️ Diese Zahlen gehören in KEINE Entscheidung (s. o.).
      */
      textvorrat: { kinder: mockTextvorratKinder() },
      vorher: {
        sims: [
          { programm: "sehsimulation", starts: 86, dauerMs: 37_930_624, avgMs: 492_606 },
          { programm: "serielles-lesen", starts: 28, dauerMs: 995_503, avgMs: 36_870 },
        ],
        kurse: {
          aufrufe: 2543,
          dauerMs: 2543 * 42_000,
          konten: 31,
          vonMs: Date.now() - 120 * 86_400_000,
          bisMs: Date.now(),
          lektionen: [
            { lektion: "l01", aufrufe: 420 },
            { lektion: "l02", aufrufe: 388 },
          ],
        },
      },
      system: { uniKonten: Object.keys(this.users()).length, kurse: 0 },
    };
  }
  /** Admin-Leitstand im Probe-Backend: ohne Erweiterung nur die Konten.
   *  Der Hörsaal-Teil überschreibt diese Methode mit seinen Zahlen. */
  async getAdminStats(): Promise<AdminStats> {
    this.requireAdmin();
    const total = Object.keys(this.users()).length;
    const null4 = { lessonProgress: 0, examResults: 0, submissions: 0, workbookSubmissions: 0 };
    return {
      generatedAt: Date.now(),
      accounts: {
        uni: { students: 0, teachers: 0, admins: 0, observers: 0, unverified: 0, total: 0 },
        lernwerkstatt: { pupils: 0, teachers: 0, classes: 0 },
      },
      progress: { uni: null4, lernwerkstatt: { tippen: 0, braille: 0, total: 0, events: 0 } },
      workshops: { count: 0, attendanceTotal: 0, feedbackTotal: 0, perWorkshop: [] },
      system: { totalAccounts: total, newUniLast7d: 0, newUniLast30d: 0, courses: 0, workshops: 0, authoredLessons: 0, analyticsEvents: 0 },
    };
  }

  async listAdminUsers(): Promise<AdminUserDirectory> {
    this.requireAdmin();
    const uni = Object.values(this.users())
      .map((u) => this.strip(u))
      .map((u) => ({
        id: u.uid,
        email: u.email,
        name: u.displayName ?? "",
        role: u.role,
        verified: !!u.verified,
        createdMs: u.createdAt,
      }));
    // Lernwerkstatt-Konten leben im separaten Trainer-Backend → im Mock leer.
    return { uni, lernwerkstatt: { teachers: [], pupils: [] } };
  }

  // --- Admin-2FA (TOTP) — Mock (Etappe 6 Schritt 2) ---------------------
  // Der Mock hat keinen Server → vereinfachte Simulation, damit der UI-Fluss
  // lokal/Preview/Tests durchlaufen kann: gültiger Code ist die Demo-Eingabe
  // „123456". Echte RFC-6238-Prüfung macht NUR der Live-Hook. Zustand in
  // localStorage.
  protected totpState(): {
    enabled: boolean;
    unlockedUntil: number;
    recovery: string[];
  } {
    const raw = localStorage.getItem(NS + "admintotp");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fällt durch zum Default
      }
    }
    return { enabled: false, unlockedUntil: 0, recovery: [] };
  }

  async getTotpStatus(): Promise<{ enabled: boolean; unlocked: boolean }> {
    const s = this.totpState();
    return { enabled: s.enabled, unlocked: s.enabled && Date.now() < s.unlockedUntil };
  }

  async setupTotp(): Promise<{ secret: string; otpauthUri: string }> {
    this.requireAdmin();
    const secret = "JBSWY3DPEHPK3PXP"; // Demo-Secret (Mock)
    return {
      secret,
      otpauthUri:
        "otpauth://totp/Sensorik:demo?secret=" +
        secret +
        "&issuer=Sensorik&algorithm=SHA1&digits=6&period=30",
    };
  }

  async confirmTotp(code: string): Promise<{ recoveryCodes: string[] }> {
    this.requireAdmin();
    if (code.trim() !== "123456")
      throw new BackendError(
        "Code stimmt nicht (Mock-Demo-Code: 123456).",
        "auth/invalid-credentials",
      );
    const recoveryCodes = Array.from(
      { length: 10 },
      (_, i) => `DEMO-${String(i + 1).padStart(2, "0")}XX`,
    );
    write("admintotp", {
      enabled: true,
      unlockedUntil: Date.now() + 12 * 60 * 60 * 1000,
      recovery: recoveryCodes,
    });
    return { recoveryCodes };
  }

  async verifyTotp(code: string): Promise<void> {
    this.requireAdmin();
    const s = this.totpState();
    const c = code.trim();
    if (c === "123456") {
      write("admintotp", { ...s, unlockedUntil: Date.now() + 12 * 60 * 60 * 1000 });
      return;
    }
    const idx = s.recovery.indexOf(c.toUpperCase());
    if (idx !== -1) {
      const recovery = s.recovery.slice();
      recovery.splice(idx, 1);
      write("admintotp", {
        ...s,
        recovery,
        unlockedUntil: Date.now() + 12 * 60 * 60 * 1000,
      });
      return;
    }
    throw new BackendError("Code stimmt nicht.", "auth/invalid-credentials");
  }

  async setRole(uid: string, role: Role) {
    this.forbidObserverWrites();
    const users = this.users();
    if (!users[uid]) throw new BackendError("Nutzer:in nicht gefunden.", "not-found");
    users[uid].role = role;
    write("users", users);
    if (this.session?.uid === uid) this.setSession(users[uid]);
  }

  /** Phase B.1 (2026-05-26): Admin korrigiert Vor-/Nachname. */
  async setUserName(uid: string, firstName: string, lastName: string) {
    this.forbidObserverWrites();
    const users = this.users();
    if (!users[uid])
      throw new BackendError("Nutzer:in nicht gefunden.", "not-found");
    const f = firstName.trim();
    const l = lastName.trim();
    users[uid].firstName = f;
    users[uid].lastName = l;
    users[uid].displayName = [f, l].filter(Boolean).join(" ");
    write("users", users);
    if (this.session?.uid === uid) this.setSession(users[uid]);
    return this.strip(users[uid]);
  }

  /** Admin ändert die Login-/E-Mail-Adresse (2026-06-04). */
  async setEmail(uid: string, email: string) {
    this.forbidObserverWrites();
    const users = this.users();
    if (!users[uid])
      throw new BackendError("Nutzer:in nicht gefunden.", "not-found");
    const e = email.trim().toLowerCase();
    if (!e) throw new BackendError("E-Mail-Adresse fehlt.", "unknown");
    const clash = Object.values(users).find(
      (u) => u.uid !== uid && u.email.toLowerCase() === e,
    );
    if (clash)
      throw new BackendError(
        "Diese E-Mail-Adresse ist bereits vergeben.",
        "auth/email-in-use",
      );
    users[uid].email = e;
    write("users", users);
    if (this.session?.uid === uid) this.setSession(users[uid]);
    return this.strip(users[uid]);
  }

  /** Schritt 6 (2026-05-25): siehe Backend-Interface-Doc. */
  async updateOwnProfile(fields: OwnProfileUpdate) {
    if (!this.session) {
      throw new BackendError("Nicht angemeldet.", "permission-denied");
    }
    const users = this.users();
    const u = users[this.session.uid];
    if (!u) throw new BackendError("Konto nicht gefunden.", "not-found");

    // Nur ausdrücklich erlaubte Felder schreiben. Email/Rolle/uid sind
    // bewusst NICHT änderbar — selbst wenn der Client sie mitschickt,
    // werden sie hier ignoriert.
    if (fields.bundesland !== undefined) {
      u.bundesland = fields.bundesland || undefined;
    }
    if (fields.phone !== undefined) {
      u.phone = fields.phone.trim() || undefined;
    }
    if (fields.inkluListConsent !== undefined) {
      const wasConsent = u.inkluListConsent === true;
      u.inkluListConsent = fields.inkluListConsent;
      if (fields.inkluListConsent && !wasConsent) {
        u.inkluListConsentedAt = Date.now();
      } else if (!fields.inkluListConsent) {
        u.inkluListConsentedAt = undefined;
      }
    }

    write("users", users);
    this.setSession(u);
    return this.strip(u);
  }

  /** Andockpunkt beim Löschen eines Kontos: Erweiterungen (z.B. der
   *  Hörsaal-Teil) räumen hier ihre Datensätze dieses Kontos ab. Der Kern
   *  selbst hat keine. */
  protected async loescheZusatzdaten(_uid: string): Promise<void> {}

  /**
   * Vollständige, bedingungslose Konto-Löschung durch eine:n Admin (DSGVO,
   * „Recht auf Vergessenwerden"). Anders als maybePurgeParticipant OHNE
   * Schutzbedingungen — entfernt auch Einschreibungen und Forenbeiträge.
   * Einziger Schutz: nicht das eigene angemeldete Konto.
   */
  async deleteUser(uid: string) {
    this.forbidObserverWrites();
    this.requireAdmin();
    if (this.session?.uid === uid)
      throw new BackendError(
        "Sie können Ihr eigenes Konto nicht löschen.",
        "permission-denied",
      );
    const users = this.users();
    const u = users[uid];
    if (!u) return;
    await this.loescheZusatzdaten(uid);
    // Welcome-Mail-Vermerk (E-Mail-Schlüssel) mitlöschen.
    if (u.email) {
      const wm = read<Record<string, number>>("welcomeMailedAt", {});
      if (wm[u.email] !== undefined) {
        delete wm[u.email];
        write("welcomeMailedAt", wm);
      }
    }
    // Konto selbst.
    delete users[uid];
    write("users", users);
  }

  /** Ohne Server gibt es nichts abzusichern — die Mock-Inhalte sind lokal. */
  async inhaltsAusweisSichern(): Promise<void> {
    return;
  }

  async getProgrammeOverrides(): Promise<ProgrammeOverrides> {
    return read<ProgrammeOverrides>("appSettings:programme-overrides", {});
  }
  async saveProgrammeOverrides(overrides: ProgrammeOverrides): Promise<void> {
    this.requireAdmin();
    write("appSettings:programme-overrides", overrides);
  }

  /** Mirrors the admin-only write rule the PocketBase backend enforces
   *  server-side — keeps the dev mock honest about the security model. */
  protected requireAdmin() {
    if (this.session?.role !== "admin")
      throw new BackendError(
        "Nur Administrator:innen dürfen Inhalte bearbeiten.",
        "permission-denied",
      );
  }

  /**
   * Phase F — `course_observer` ist eine Read-only-Rolle. Jeder schreibende
   * Backend-Aufruf (egal welche Collection) muss am Mock genau so scheitern
   * wie auf Live (PB-Server-Rules in pocketbase/setup.mjs sind die echte
   * Grenze; der Mock zieht hier nur sichtbar nach). Diese Methode wird in
   * jeder schreibenden Backend-Methode aufgerufen
   * (save/upload/delete/create/upsert/enroll/recordEvent …).
   */
  protected forbidObserverWrites() {
    if (this.session?.role === "course_observer")
      throw new BackendError(
        "Beobachtungs-Konten dürfen nichts ändern.",
        "permission-denied",
      );
  }

  protected del(key: string) {
    localStorage.removeItem(NS + key);
  }
  protected removeWhere<T>(prefix: string, pred: (v: T) => boolean) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(NS + prefix)) continue;
      try {
        if (pred(JSON.parse(localStorage.getItem(k)!) as T))
          localStorage.removeItem(k);
      } catch {
        /* skip */
      }
    }
  }

  protected scan<T>(prefix: string): T[] {
    const out: T[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS + prefix)) {
        try {
          out.push(JSON.parse(localStorage.getItem(k)!) as T);
        } catch {
          /* skip */
        }
      }
    }
    return out;
  }
}

export class MockBackend extends mitErweiterung(MockKern) implements Backend {}
