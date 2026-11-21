/**
 * EU-self-hostable backend. Mirrors the MockBackend contract
 * on PocketBase (single Go binary: auth + SQLite + rules). Host-agnostic:
 * runs identically on localhost and on a later EU VPS — die Backend-Adresse
 * liefert `backendUrl()` (src/lib/adressen.ts): unter den eigenen Adressen die
 * eigene Herkunft, sonst VITE_POCKETBASE_URL. Not exercised by vitest (honest limitation:
 * needs a running server); verified by running PocketBase locally + the app in the
 * browser. Collection schema/rules: see pocketbase/setup.mjs.
 *
 * Storage shape: every non-auth collection holds the exact domain object in a
 * `data` json field plus a few scalar columns purely for filtering/sorting
 * (mirrors how Mock stores whole objects under keys).
 * Domain ids live inside `data` (+ a `did` column) — PocketBase's own 15-char
 * record id is not used as a business key.
 */
import PocketBase, { ClientResponseError } from "pocketbase";
import {
  type AdminStats,
  type Statistik,
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
import { backendUrl } from "../lib/adressen";
import { mitErweiterung } from "./erweiterung/pocketbase";

const CHECKIN_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function genCheckinCode(): string {
  // 4-stelliger Check-in-Code (muss zu CHECKIN_CODE_LENGTH in checkinLink.ts passen).
  let s = "";
  for (let i = 0; i < 4; i++)
    s += CHECKIN_ALPHABET[Math.floor(Math.random() * CHECKIN_ALPHABET.length)];
  return s;
}
export function genId(): string {
  const c = globalThis.crypto;
  return c?.randomUUID
    ? c.randomUUID()
    : "id_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
export function isNotFound(e: unknown): boolean {
  return e instanceof ClientResponseError && e.status === 404;
}

/** PocketBase auth record → app UserProfile. */
export type AuthRec = {
  id: string;
  email: string;
  displayName?: string;
  /** Phase B.1 (2026-05-26): getrennte Vor-/Nachname-Felder. PB-Schema
   *  muss die Spalten haben (siehe setup.mjs). Migration 2026-05-26
   *  per migrate-name-split.mjs durchgelaufen, Skript entfernt
   *  2026-05-28. */
  firstName?: string;
  lastName?: string;
  role?: Role;
  createdAtMs?: number;
  created?: string;
  /** PocketBase-natives Feld der E-Mail-Verifizierung. */
  verified?: boolean;
  /** Schritt 6 (2026-05-25): optionale Profil-Felder; PB-Schema muss
   *  diese Spalten haben, sonst kommen sie als undefined zurück. */
  bundesland?: string;
  phone?: string;
  inkluListConsent?: boolean;
  inkluListConsentedAt?: number;
  /** 2026-06-08: erzwungener Passwortwechsel nach Admin-Start-Passwort. */
  mustChangePassword?: boolean;
};
export function recToProfile(r: AuthRec): UserProfile {
  return {
    uid: r.id,
    email: r.email,
    displayName: r.displayName || r.email,
    firstName: r.firstName || undefined,
    lastName: r.lastName || undefined,
    role: (r.role as Role) || "student",
    createdAt: r.createdAtMs ?? (r.created ? Date.parse(r.created) : Date.now()),
    verified: r.verified ?? false,
    bundesland: (r.bundesland as UserProfile["bundesland"]) || undefined,
    phone: r.phone || undefined,
    inkluListConsent: r.inkluListConsent ?? undefined,
    inkluListConsentedAt: r.inkluListConsentedAt ?? undefined,
    mustChangePassword: r.mustChangePassword ?? false,
  };
}

/**
 * Fehler eines Sensorik-Hook-Endpunkts in einen sprechenden BackendError
 * übersetzen (gleiche Bauart wie bei `shareAuthoredLesson`).
 */
export function toCheckError(err: unknown, fallback: string): BackendError {
  const cre = err as ClientResponseError;
  const status = typeof cre?.status === "number" ? cre.status : 0;
  const msg =
    (cre?.data &&
      typeof (cre.data as { error?: string }).error === "string" &&
      (cre.data as { error?: string }).error) ||
    cre?.message ||
    fallback;
  if (status === 401 || status === 403)
    return new BackendError(msg, "permission-denied");
  if (status === 404) return new BackendError(msg, "not-found");
  return new BackendError(msg, "unknown");
}

export class PocketBaseKern {
  readonly kind = "pocketbase" as const;
  protected pb: PocketBase;
  protected profile: UserProfile | null = null;
  protected listeners = new Set<(u: UserProfile | null) => void>();

  constructor() {
    // Backend = eigene Herkunft, sobald die Seite unter einer unserer
    // Adressen läuft (siehe src/lib/adressen.ts - www-Falle).
    this.pb = new PocketBase(backendUrl());
    // Auto-Cancellation des PB-SDK global ausschalten: bei parallelen
    // Loads (Dashboard ruft 6 Collections gleichzeitig, Sidebar/Layout
    // ebenfalls Listen) bricht das SDK sonst „doppelte" Requests an
    // dieselbe Collection ab → unklare Hänger im UI. Wir brauchen die
    // De-Dup-Logik des SDK an dieser Stelle nicht; React/UI dedupen
    // ihre Render-Zyklen selbst.
    this.pb.autoCancellation(false);
  }

  async init() {
    this.pb.authStore.onChange(() => {
      const rec = this.pb.authStore.record as unknown as AuthRec | null;
      this.profile = rec ? recToProfile(rec) : null;
      for (const l of this.listeners) l(this.profile);
    });
    // 2026-05-30: Abgelaufenes/ungültiges Token NICHT als eingeloggt
    // behandeln. PocketBase behält bei abgelaufenem Token den `record` im
    // authStore; ohne diese Zeile surfacen wir unten die (gecachte) Rolle
    // und die App zeigt weiter die Admin-/Kurs-Oberfläche, während jeder
    // PB-Aufruf still scheitert (Lesen → leere Liste, Schreiben → HTTP 400
    // „create rule failure"). `isValid` prüft die Token-Ablaufzeit. Liegt
    // also ein Token vor, ist aber nicht (mehr) gültig: verwerfen, damit der
    // Nutzer sauber auf der Anmeldung landet statt in einer toten Sitzung.
    if (this.pb.authStore.token && !this.pb.authStore.isValid) {
      this.pb.authStore.clear();
    }
    // Surface the persisted session synchronously so a hard reload renders
    // the (role-gated) route immediately; revalidate in the background and
    // let authStore.onChange propagate the result (refreshed or cleared).
    const rec = this.pb.authStore.record as unknown as AuthRec | null;
    this.profile = rec ? recToProfile(rec) : null;
    if (this.pb.authStore.isValid) {
      void this.pb
        .collection("users")
        .authRefresh()
        .catch(() => this.pb.authStore.clear());
    }
  }

  onAuthChange(cb: (u: UserProfile | null) => void) {
    this.listeners.add(cb);
    cb(this.profile);
    return () => this.listeners.delete(cb);
  }
  currentUser() {
    return this.profile;
  }

  /**
   * Phase F / Audit #17 — `course_observer` ist eine Read-only-Rolle. Die
   * ECHTE Grenze sind die PocketBase-Server-Rules (pocketbase/setup.mjs); der
   * Client spiegelt den Block hier nur, damit ein Observer dieselbe klare
   * Ablehnung wie im Mock (forbidObserverWrites) bekommt statt eines rohen
   * Server-403. Gespiegelt am Mock, der diese Prüfung in JEDEM schreibenden
   * Aufruf macht — hier (gezielt) am Selbst-Beitritt, der sonst client-seitig
   * ungeprüft durchliefe.
   */
  protected forbidObserverWrites() {
    if (this.profile?.role === "course_observer")
      throw new BackendError(
        "Beobachtungs-Konten dürfen nichts ändern.",
        "permission-denied",
      );
  }

  // --- generic record helpers (data-json + filter columns) ----------------
  protected async upsert<T>(
    coll: string,
    matchFilter: string,
    cols: Record<string, unknown>,
    data: T,
    // Workshop-Lehrer ohne Konto: ihr Ausweis geht als `z` an jede Anfrage.
    opts: { query?: Record<string, string> } = {},
  ): Promise<T> {
    const body = { ...cols, data };
    try {
      const ex = await this.pb.collection(coll).getFirstListItem(matchFilter, opts);
      await this.pb.collection(coll).update(ex.id, body, opts);
    } catch (e) {
      if (isNotFound(e)) await this.pb.collection(coll).create(body, opts);
      else throw e;
    }
    return data;
  }
  protected async listData<T>(
    coll: string,
    opts: { filter?: string; sort?: string } = {},
  ): Promise<T[]> {
    const recs = await this.pb.collection(coll).getFullList(opts);
    return recs.map((r) => (r as unknown as { data: T }).data);
  }
  protected async getOneData<T>(
    coll: string,
    filter: string,
  ): Promise<T | null> {
    try {
      const r = await this.pb.collection(coll).getFirstListItem(filter);
      return (r as unknown as { data: T }).data;
    } catch (e) {
      if (isNotFound(e)) return null;
      throw e;
    }
  }
  protected async delWhere(coll: string, filter: string) {
    const recs = await this.pb.collection(coll).getFullList({ filter });
    await Promise.all(
      recs.map((r) => this.pb.collection(coll).delete(r.id)),
    );
  }
  async signIn(email: string, password: string) {
    try {
      await this.pb.collection("users").authWithPassword(email, password);
      return recToProfile(this.pb.authStore.record as unknown as AuthRec);
    } catch {
      throw new BackendError(
        "E-Mail oder Passwort ist falsch.",
        "auth/invalid-credentials",
      );
    }
  }
  async signOut() {
    this.pb.authStore.clear();
  }
  async resetPassword(email: string) {
    try {
      await this.pb.collection("users").requestPasswordReset(email);
    } catch {
      /* no account enumeration */
    }
  }

  async confirmPasswordReset(
    token: string,
    newPassword: string,
  ): Promise<void> {
    if (newPassword.length < 8)
      throw new BackendError(
        "Passwort zu kurz (mind. 8 Zeichen).",
        "auth/weak-password",
      );
    try {
      await this.pb
        .collection("users")
        .confirmPasswordReset(token, newPassword, newPassword);
    } catch (e) {
      if (e instanceof ClientResponseError) {
        const d = (e.response?.data ?? {}) as Record<
          string,
          { code?: string }
        >;
        if (d.password)
          throw new BackendError(
            "Passwort zu schwach (mind. 8 Zeichen).",
            "auth/weak-password",
          );
      }
      throw new BackendError(
        "Der Link ist ungültig oder abgelaufen. Bitte fordern Sie eine neue Mail an.",
        "not-found",
      );
    }
    // `verified:true` setzt serverseitig der pb_hook welcome_verify.pb.js
    // nach erfolgreichem Reset (Entscheidung 6c) — hier nichts weiter zu tun.
  }

  async requestEmailVerification(): Promise<void> {
    const email =
      this.profile?.email ||
      (this.pb.authStore.record as unknown as AuthRec | null)?.email;
    if (!email)
      throw new BackendError("Nicht angemeldet.", "auth/invalid-credentials");
    try {
      await this.pb.collection("users").requestVerification(email);
    } catch {
      throw new BackendError(
        "Bestätigungs-Mail konnte nicht gesendet werden. Eventuell ist der Mailversand noch nicht eingerichtet.",
      );
    }
  }

  async confirmEmailVerification(token: string): Promise<void> {
    try {
      await this.pb.collection("users").confirmVerification(token);
    } catch {
      throw new BackendError(
        "Der Bestätigungslink ist ungültig oder abgelaufen.",
        "not-found",
      );
    }
    // Falls angemeldet: Auth-Datensatz auffrischen, damit `verified`
    // sofort greift (authStore.onChange aktualisiert das Profil).
    try {
      if (this.pb.authStore.isValid) {
        await this.pb.collection("users").authRefresh();
      }
    } catch {
      /* nicht kritisch — spätestens beim nächsten Login aktuell */
    }
  }

  async confirmEmailChange(token: string, password: string): Promise<void> {
    try {
      await this.pb.collection("users").confirmEmailChange(token, password);
    } catch {
      throw new BackendError(
        "Der Link ist ungültig oder abgelaufen - oder das Passwort stimmt nicht.",
        "not-found",
      );
    }
  }

  async getProfile(uid: string) {
    try {
      const r = (await this.pb
        .collection("users")
        .getOne(uid)) as unknown as AuthRec;
      return recToProfile(r);
    } catch (e) {
      if (isNotFound(e)) return null;
      throw e;
    }
  }
  async listUsers() {
    const recs = (await this.pb
      .collection("users")
      .getFullList()) as unknown as AuthRec[];
    return recs.map(recToProfile);
  }

  async getAdminStats(): Promise<AdminStats> {
    try {
      return (await this.pb.send("/api/sensorik/admin/stats", {
        method: "GET",
      })) as AdminStats;
    } catch (err) {
      const cre = err as ClientResponseError;
      if (cre?.status === 403) {
        throw new BackendError(
          "Nur für Administrator:innen.",
          "permission-denied",
        );
      }
      throw new BackendError(
        "Statistik konnte nicht geladen werden.",
        "unknown",
      );
    }
  }

  /**
   * Die volle Statistik für /admin/statistik aus dem admin-gateten Hook
   * `/api/sensorik/admin/statistik`. Er läuft mit App-Rechten und ist der
   * einzige Weg an die teacher-isolierten Daten heran.
   *
   * ⚠️ Der 403 mit `code: "totp_required"` ist KEIN Rechte-Fehler, sondern die
   * Aufforderung, die Sitzung per 2FA freizuschalten - die Seite fragt danach
   * neu ab, statt eine Fehlermeldung stehen zu lassen.
   */
  async getStatistik(tage = 90): Promise<Statistik> {
    const t = Math.min(730, Math.max(1, Math.round(tage)));
    try {
      return (await this.pb.send("/api/sensorik/admin/statistik?tage=" + t, {
        method: "GET",
      })) as Statistik;
    } catch (err) {
      const cre = err as ClientResponseError;
      if (cre?.status === 403) {
        throw new BackendError("Nur für Administrator:innen.", "permission-denied");
      }
      throw new BackendError("Statistik konnte nicht geladen werden.", "unknown");
    }
  }

  async listAdminUsers(): Promise<AdminUserDirectory> {
    try {
      return (await this.pb.send("/api/sensorik/admin/users", {
        method: "GET",
      })) as AdminUserDirectory;
    } catch (err) {
      const cre = err as ClientResponseError;
      if (cre?.status === 403) {
        throw new BackendError("Nur für Administrator:innen.", "permission-denied");
      }
      throw new BackendError("Konten konnten nicht geladen werden.", "unknown");
    }
  }

  async getSimStats(): Promise<SimStat[]> {
    try {
      const res = (await this.pb.send("/api/sensorik/admin/sim-stats", {
        method: "GET",
      })) as { sims?: SimStat[] };
      return Array.isArray(res?.sims) ? res.sims : [];
    } catch (err) {
      const cre = err as ClientResponseError;
      if (cre?.status === 403) {
        throw new BackendError("Nur für Administrator:innen.", "permission-denied");
      }
      throw new BackendError(
        "Reichweiten konnten nicht geladen werden.",
        "unknown",
      );
    }
  }

  // --- Admin-2FA (TOTP, Etappe 6 Schritt 2) -----------------------------
  async getTotpStatus(): Promise<{ enabled: boolean; unlocked: boolean }> {
    try {
      const r = (await this.pb.send("/api/sensorik/admin/totp/status", {
        method: "GET",
      })) as { enabled: boolean; unlocked: boolean };
      return { enabled: !!r.enabled, unlocked: !!r.unlocked };
    } catch {
      // Fail-closed: im Zweifel als „nicht freigeschaltet" behandeln.
      return { enabled: false, unlocked: false };
    }
  }

  async setupTotp(): Promise<{ secret: string; otpauthUri: string }> {
    try {
      return (await this.pb.send("/api/sensorik/admin/totp/setup", {
        method: "POST",
        body: {},
      })) as { secret: string; otpauthUri: string };
    } catch (err) {
      throw new BackendError(
        (err as ClientResponseError)?.response?.error ||
          "2FA-Einrichtung fehlgeschlagen.",
        "unknown",
      );
    }
  }

  async confirmTotp(code: string): Promise<{ recoveryCodes: string[] }> {
    try {
      return (await this.pb.send("/api/sensorik/admin/totp/confirm", {
        method: "POST",
        body: { code },
      })) as { recoveryCodes: string[] };
    } catch (err) {
      throw new BackendError(
        (err as ClientResponseError)?.response?.error ||
          "Code stimmt nicht.",
        "auth/invalid-credentials",
      );
    }
  }

  async verifyTotp(code: string): Promise<void> {
    try {
      await this.pb.send("/api/sensorik/admin/totp/verify", {
        method: "POST",
        body: { code },
      });
    } catch (err) {
      throw new BackendError(
        (err as ClientResponseError)?.response?.error || "Code stimmt nicht.",
        "auth/invalid-credentials",
      );
    }
  }
  async setRole(uid: string, role: Role) {
    await this.pb.collection("users").update(uid, { role });
  }

  /** Phase B.1 (2026-05-26): Admin korrigiert Vor-/Nachname. */
  async setUserName(uid: string, firstName: string, lastName: string) {
    const f = firstName.trim();
    const l = lastName.trim();
    const displayName = [f, l].filter(Boolean).join(" ");
    const rec = (await this.pb.collection("users").update(uid, {
      firstName: f,
      lastName: l,
      name: displayName,
    })) as unknown as AuthRec;
    return recToProfile(rec);
  }

  /** Ändert die Login-/E-Mail-Adresse (2026-06-04). Hinweis: ein direktes
   *  email-Update erlaubt PocketBase nur Superusern / via manageRule — daher
   *  derzeit nicht aus dem »Benutzer bearbeiten«-Dialog aufgerufen (s.
   *  Interface-Doc in types.ts). */
  async setEmail(uid: string, email: string) {
    const rec = (await this.pb.collection("users").update(uid, {
      email: email.trim(),
    })) as unknown as AuthRec;
    return recToProfile(rec);
  }

  /** Andockpunkt beim Löschen eines Kontos: Erweiterungen (z.B. der
   *  Hörsaal-Teil) räumen hier ihre Datensätze dieses Kontos ab. Der Kern
   *  selbst hat keine. */
  protected async loescheZusatzdaten(_uid: string): Promise<void> {}

  /** Vollständige, bedingungslose Konto-Löschung durch eine:n Admin (DSGVO).
   *  Anders als maybePurgeParticipant OHNE Schutzbedingungen — entfernt auch
   *  Einschreibungen (alle Kurse) und Forenbeiträge des Kontos. Einziger
   *  Schutz: nicht das eigene angemeldete Konto. */
  async deleteUser(uid: string) {
    if (this.profile?.uid === uid)
      throw new BackendError(
        "Sie können Ihr eigenes Konto nicht löschen.",
        "permission-denied",
      );
    await this.loescheZusatzdaten(uid);
    // Konto selbst (deleteRule = ADMIN).
    await this.pb.collection("users").delete(uid);
  }

  /** Schritt 6 (2026-05-25): siehe Backend-Interface-Doc. */
  async updateOwnProfile(fields: OwnProfileUpdate) {
    const me = this.currentUser();
    if (!me) throw new BackendError("Nicht angemeldet.", "permission-denied");

    // Nur ausdrücklich erlaubte Felder schicken. Email/Rolle/uid bleiben
    // unverändert (PB-Rule erzwingt das zusätzlich serverseitig).
    const update: Record<string, unknown> = {};
    if (fields.bundesland !== undefined) {
      update.bundesland = fields.bundesland || "";
    }
    if (fields.phone !== undefined) {
      update.phone = fields.phone.trim();
    }
    if (fields.inkluListConsent !== undefined) {
      update.inkluListConsent = fields.inkluListConsent;
      // Timestamp setzen/zurücksetzen, damit DSGVO-Belegbar.
      const wasConsent = me.inkluListConsent === true;
      if (fields.inkluListConsent && !wasConsent) {
        update.inkluListConsentedAt = Date.now();
      } else if (!fields.inkluListConsent) {
        update.inkluListConsentedAt = null;
      }
    }

    // role MUSS (unverändert) mit in den Body: die users-Update-Rule verlangt
    // `@request.body.role = role` (Schutz gegen Selbst-Beförderung). Ohne das
    // Feld wertete PB die Regel als false → 404 → Studis konnten Bundesland/
    // Telefon nicht speichern (2026-06-10 live in den PB-Logs, 3×).
    update.role = me.role;
    const rec = (await this.pb
      .collection("users")
      .update(me.uid, update)) as unknown as AuthRec;
    const profile = recToProfile(rec);
    this.profile = profile;
    for (const l of this.listeners) l(profile);
    return profile;
  }
  async adminCreateUser(
    email: string,
    displayName: string,
    role: Role,
  ) {
    email = email.trim().toLowerCase();
    // Phase C / Welcome-Mail (Entscheidung 6a): Konto bekommt ein
    // langes Wegwerf-PW, das niemand nutzt. Die Studi setzt eigene PW
    // über den Reset-Link aus der Welcome-Mail. `verified` bleibt
    // explizit FALSE — wird nach erfolgreichem PW-Set durch einen
    // pb_hook (NAS-Schritt, siehe pb_hooks/welcome_verify.pb.js) auf
    // true gesetzt; Doppelnutzen R2-5.
    const password = genThrowawayPassword();
    try {
      // Create only (no authWithPassword) → the admin session is untouched.
      // Hardened createRule allows new users only as "student"; elevate
      // afterwards (admin-only updateRule) if the roster asked for staff.
      const rec = await this.pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        displayName: displayName.trim() || email,
        role: "student",
        createdAtMs: Date.now(),
        // Wichtig: ohne diese Flag liefert PB die Mail in listUsers/
        // getFullList NICHT aus → Roster-Dedupe (siehe lib/roster.ts)
        // sieht „kein Email" und behandelt Konto als neu (oder
        // crasht je nach Codepfad). Hier explizit sichtbar.
        emailVisibility: true,
      });
      if (role !== "student") {
        await this.pb.collection("users").update(rec.id, { role });
      }
      return recToProfile({
        ...(rec as unknown as AuthRec),
        role,
        verified: false,
      });
    } catch (e) {
      if (e instanceof ClientResponseError) {
        const d = (e.response?.data ?? {}) as Record<
          string,
          { code?: string }
        >;
        if (d.email?.code === "validation_not_unique")
          throw new BackendError(
            "E-Mail wird bereits verwendet.",
            "auth/email-in-use",
          );
        if (d.password)
          throw new BackendError(
            "Passwort zu schwach (mind. 8 Zeichen).",
            "auth/weak-password",
          );
      }
      throw new BackendError("Konto anlegen fehlgeschlagen.");
    }
  }

  /**
   * Phase C / Welcome-Mail (Entscheidung 6a/6b): triggert die
   * "Passwort festlegen"-Mail an die angegebene Adresse. Server-seitig
   * identisch zu `resetPassword` — PB-Mail-Template ist umgetextet
   * (Johannes-NAS-Schritt, PB-Admin → Mail → Reset-Template).
   * Best-effort: kein harter Fehler bei SMTP-Pleite — der Admin sieht
   * im Panel, welche Konten noch unverified sind, und kann den Versand
   * über den "Erneut senden"-Knopf wiederholen.
   */
  async sendWelcomeMail(email: string): Promise<void> {
    try {
      await this.pb.collection("users").requestPasswordReset(email);
    } catch {
      /* SMTP evtl. noch nicht eingerichtet → Admin sieht unverified-
         Marker im Panel und kann erneut senden. */
    }
  }

  /**
   * 2026-06-08: Admin vergibt ein Start-Passwort (Weg an blockierten
   * Schul-Mailservern vorbei). Fremde Passwörter darf PocketBase nicht per
   * Client-Update setzen → die Arbeit macht der admin-gegatete Hook
   * admin_set_password.pb.js (setzt Passwort + verified:true +
   * mustChangePassword:true serverseitig).
   */
  async adminSetPassword(uid: string, password: string): Promise<void> {
    if (password.length < 8)
      throw new BackendError(
        "Passwort zu kurz (mind. 8 Zeichen).",
        "auth/weak-password",
      );
    try {
      await this.pb.send("/api/sensorik/admin/set-password", {
        method: "POST",
        body: { uid, password },
      });
    } catch (err) {
      const cre = err as ClientResponseError;
      const status = typeof cre?.status === "number" ? cre.status : 0;
      if (status === 403)
        throw new BackendError(
          "Nur Administrator:innen dürfen Passwörter vergeben.",
          "permission-denied",
        );
      if (status === 404)
        throw new BackendError("Konto nicht gefunden.", "not-found");
      if (status === 400)
        throw new BackendError(
          "Passwort zu kurz (mind. 8 Zeichen).",
          "auth/weak-password",
        );
      throw new BackendError(
        "Das Passwort konnte nicht gesetzt werden. Bitte später erneut versuchen.",
        "unknown",
      );
    }
  }

  /**
   * 2026-06-08: erzwungener Erstwechsel — die angemeldete Person setzt ihr
   * eigenes Passwort und löscht das Flag (Hook account_finish_password.pb.js).
   * setPassword rotiert serverseitig den tokenKey → die alte Sitzung ist
   * danach ungültig; deshalb gleich mit dem neuen Passwort neu anmelden, damit
   * authStore.onChange das gelöschte Flag in den Store trägt.
   */
  async finishForcedPasswordChange(password: string): Promise<void> {
    if (password.length < 8)
      throw new BackendError(
        "Passwort zu kurz (mind. 8 Zeichen).",
        "auth/weak-password",
      );
    const email =
      this.profile?.email ||
      (this.pb.authStore.record as unknown as AuthRec | null)?.email ||
      "";
    try {
      await this.pb.send("/api/sensorik/account/finish-password", {
        method: "POST",
        body: { password },
      });
    } catch (err) {
      const cre = err as ClientResponseError;
      const status = typeof cre?.status === "number" ? cre.status : 0;
      if (status === 400)
        throw new BackendError(
          "Passwort zu kurz (mind. 8 Zeichen).",
          "auth/weak-password",
        );
      if (status === 401)
        throw new BackendError(
          "Bitte melden Sie sich erneut an.",
          "auth/invalid-credentials",
        );
      if (status === 409)
        throw new BackendError(
          "Für dieses Konto ist keine Passwortänderung nötig.",
          "unknown",
        );
      throw new BackendError(
        "Das Passwort konnte nicht gespeichert werden. Bitte später erneut versuchen.",
        "unknown",
      );
    }
    if (email) {
      await this.pb.collection("users").authWithPassword(email, password);
    }
  }

  /** Zeitpunkt der letzten Ausweis-Beschaffung (0 = noch nie). */
  protected inhaltsAusweisBisMs = 0;
  async inhaltsAusweisSichern(): Promise<void> {
    // Das Cookie hält 20 Minuten (COOKIE_MAXAGE_S im Hook). Wir erneuern es
    // deutlich früher, damit es nie mitten in einer Lektion abläuft — ein
    // abgelaufener Ausweis führt zu 404 auf Bilder und Videos.
    const ERNEUERN_NACH_MS = 10 * 60 * 1000;
    const jetzt = Date.now();
    if (this.inhaltsAusweisBisMs > jetzt - ERNEUERN_NACH_MS) return;
    if (!this.currentUser()) return; // ohne Anmeldung gibt es keinen Ausweis
    try {
      await this.pb.send("/api/sensorik/inhalt/ausweis", { method: "POST" });
      this.inhaltsAusweisBisMs = jetzt;
    } catch {
      // Bewusst geschluckt: Ohne Ausweis bleiben die Inhalte auf 404. Das ist
      // die richtige Antwort für Nicht-Berechtigte und darf die Seite nicht
      // zum Absturz bringen. Beim nächsten Aufruf wird es erneut versucht.
      this.inhaltsAusweisBisMs = 0;
    }
  }

  async getProgrammeOverrides(): Promise<ProgrammeOverrides> {
    return (
      (await this.getOneData<ProgrammeOverrides>(
        "appSettings",
        this.pb.filter("key={:k}", { k: "programme-overrides" }),
      )) ?? {}
    );
  }
  async saveProgrammeOverrides(overrides: ProgrammeOverrides): Promise<void> {
    await this.upsert(
      "appSettings",
      this.pb.filter("key={:k}", { k: "programme-overrides" }),
      { key: "programme-overrides" },
      overrides,
    );
  }
}

export class PocketBaseBackend extends mitErweiterung(PocketBaseKern) implements Backend {}
