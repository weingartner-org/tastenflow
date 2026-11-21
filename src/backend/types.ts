import type { BackendErweiterung } from "./erweiterung/typen";
import type { ProgrammeOverrides } from "../lib/allPrograms";
export * from "./erweiterung/typen";

// Rollen-Modell:
//   `student`         — lernt im Kurs (Default für Selbst-Registrierte)
//   `teacher`         — Lehrperson; voller Schreib-/Lesezugriff auf eigene Kurse
//   `admin`           — Programm-Verwaltung; übergreifend volle Rechte
//   `course_observer` — Phase F (Roadmap §F + Entscheidung 6 vom 2026-05-22):
//                       PH-Leitung. Read-only, sieht NUR die ihr explizit
//                       per Enrollment zugewiesenen Kurse (kein Schreibrecht,
//                       kein Self-Enroll, keine Cross-Kurs-Sicht). Server-
//                       Rules (pocketbase/setup.mjs) erzwingen die Grenze;
//                       Client gleicht das in `isStaff`/`canManage`-Gates
//                       sichtbar nach.
export type Role = "student" | "teacher" | "admin" | "course_observer";

export interface UserProfile {
  uid: string;
  email: string;
  /**
   * Anzeige-Name. Source of Truth für Mail-Templates, Excel-Export,
   * Logging. Wenn `firstName`/`lastName` gesetzt sind, sollte
   * `displayName === joinName(firstName, lastName)` gelten; das wird
   * beim Schreiben über `setUserName` automatisch garantiert.
   */
  displayName: string;
  /**
   * Phase B.1 (2026-05-26): getrennte Vor-/Nachname-Felder für sortier-
   * fähige Tabellen und Excel-Exporte. Optional, weil Bestandskonten
   * sie erst per Heuristik-Migration bekommen (Audit im AdminPanel).
   * Setzen über `setUserName(uid, firstName, lastName)`; `displayName`
   * wird dabei aus den beiden zusammengesetzt.
   */
  firstName?: string;
  lastName?: string;
  role: Role;
  createdAt: number;
  /**
   * R2-5 Doppel-Opt-in: ist die E-Mail-Adresse per Bestätigungslink
   * verifiziert? Selbst-Registrierte starten mit `false`; Admin-/
   * Roster-angelegte Konten gelten als `true`. SOFT-Durchsetzung: ein
   * unbestätigtes Konto darf sich anmelden/umsehen, aber KEINEM Kurs
   * beitreten (siehe `enrollByCode`).
   */
  verified: boolean;
  /**
   * Schritt 6 (2026-05-25): optionale Profil-Felder + Einverständnis
   * für den Verteiler der „Abteilung für Inklusion am Bundes-
   * Blindeninstitut Wien" (BBI). Die Felder werden ausschließlich
   * vom Studi selbst auf der Konto-Seite gesetzt; siehe
   * `updateOwnProfile`. Wer `inkluListConsent` nie auf `true`
   * gesetzt hat, taucht im Inklusions-Liste-Export NICHT auf.
   */
  bundesland?: BundeslandKey;
  phone?: string;
  inkluListConsent?: boolean;
  /** Unix-ms — wann die Zustimmung gesetzt wurde (DSGVO-Belegbarkeit). */
  inkluListConsentedAt?: number;
  /**
   * 2026-06-08: true ⇒ ein Admin hat ein Start-Passwort vergeben
   * (`adminSetPassword`); die Person MUSS beim ersten Login ein eigenes
   * Passwort festlegen, bevor sie in die App gelangt (RequireAuth-Guard →
   * `/passwort-aendern-pflicht`). Wird durch `finishForcedPasswordChange`
   * wieder auf false gesetzt. Umgeht den blockierten Mail-Versand mancher
   * Schul-Postfächer (siehe project_mail_infrastruktur).
   */
  mustChangePassword?: boolean;
}

/** Pulldown-Werte für `UserProfile.bundesland`. Stabile Keys für DB +
 *  Export; menschenlesbare Labels in `BUNDESLAENDER`. */
export type BundeslandKey =
  | "wien"
  | "noe"
  | "ooe"
  | "stmk"
  | "ktn"
  | "sbg"
  | "tir"
  | "vbg"
  | "bgld"
  | "ausland";

export const BUNDESLAENDER: ReadonlyArray<{
  v: BundeslandKey;
  l: string;
}> = [
  { v: "wien", l: "Wien" },
  { v: "noe", l: "Niederösterreich" },
  { v: "ooe", l: "Oberösterreich" },
  { v: "stmk", l: "Steiermark" },
  { v: "ktn", l: "Kärnten" },
  { v: "sbg", l: "Salzburg" },
  { v: "tir", l: "Tirol" },
  { v: "vbg", l: "Vorarlberg" },
  { v: "bgld", l: "Burgenland" },
  { v: "ausland", l: "Andere/Ausland" },
];

export function bundeslandLabel(v: BundeslandKey | undefined | null): string {
  if (!v) return "";
  return BUNDESLAENDER.find((b) => b.v === v)?.l ?? "";
}

/** Felder, die ein Studi (und jeder andere User) auf der eigenen Konto-
 *  Seite über sich selbst aktualisieren darf — bewusst eng: NICHT email,
 *  uid, role, verified. Backend prüft das auf Server-Seite (PB-Rule). */
export interface OwnProfileUpdate {
  bundesland?: BundeslandKey | "";
  phone?: string;
  inkluListConsent?: boolean;
}

export class BackendError extends Error {
  constructor(
    message: string,
    readonly code:
      | "auth/invalid-credentials"
      | "auth/email-in-use"
      | "auth/weak-password"
      | "exam/already-started"
      | "exam/locked"
      | "permission-denied"
      | "not-found"
      | "unknown" = "unknown",
  ) {
    super(message);
    this.name = "BackendError";
  }
}


/**
 * Cross-Welten-Konten-Verzeichnis für die Admin-Welt (/admin, Etappe 6 §3a).
 * Stammdaten (keine Passwörter/Inhalte). Quelle beim PB-Backend: admin- +
 * 2FA-gateter Hook `/api/sensorik/admin/users`.
 */
/**
 * Aggregierte Cross-Welten-Statistik für den Admin-Leitstand (/admin,
 * Plattform-Umbau Etappe 6). Reine Zähl-/Summenwerte über alle Welten —
 * KEINE personenbezogenen Inhalte (feedback_data_transparency). Beim
 * PocketBase-Backend kommt das aus dem admin-gateten Server-Hook
 * `/api/sensorik/admin/stats` (umgeht die teacher-isolierten Regeln);
 * im Mock-Backend lokal aggregiert.
 */
export interface AdminStats {
  generatedAt: number;
  accounts: {
    uni: {
      students: number;
      teachers: number;
      admins: number;
      observers: number;
      unverified: number;
      total: number;
    };
    lernwerkstatt: {
      pupils: number;
      teachers: number;
      classes: number;
      /** Konten ohne Klasse und ohne Lehrkraft (Selbstlernende, seit 09.08.2026). */
      selbstlernende?: number;
      /** Davon: Inaktivitäts-Warnung verschickt, Löschung steht an. */
      selbstlernendeGewarnt?: number;
    };
  };
  progress: {
    uni: {
      lessonProgress: number;
      examResults: number;
      submissions: number;
      workbookSubmissions: number;
    };
    lernwerkstatt: {
      tippen: number;
      braille: number;
      /** Fortschritts-Zeilen je Programm-Schlüssel (seit 13.11.2026; fehlt bei älterem Server). */
      jeProgramm?: Record<string, number>;
      total: number;
      events: number;
    };
  };
  workshops: {
    count: number;
    attendanceTotal: number;
    feedbackTotal: number;
    perWorkshop: {
      code: string;
      title: string;
      attendance: number;
      feedback: number;
    }[];
  };
  system: {
    totalAccounts: number;
    newUniLast7d: number;
    newUniLast30d: number;
    courses: number;
    workshops: number;
    authoredLessons: number;
    analyticsEvents: number;
  };
}

export interface AdminUserDirectory {
  uni: {
    id: string;
    email: string;
    name: string;
    role: string;
    verified: boolean;
    createdMs: number;
  }[];
  lernwerkstatt: {
    teachers: {
      id: string;
      email: string;
      name: string;
      createdMs: number;
      /** Bestätigte Spende am (ms) bzw. 0 - grünes Häkchen (19.09.2026). */
      gespendetMs?: number;
    }[];
    pupils: {
      id: string;
      name: string;
      classCode: string;
      stufe: string;
      /** Eigenes Konto ohne Klasse (seit 09.08.2026). */
      selfManaged?: boolean;
      /** Nur bei Selbstlernenden: die echte Adresse (Klassen-Kinder: leer). */
      email?: string;
      /** Nur bei Selbstlernenden: letzte Anmeldung (ms) bzw. 0. */
      lastSeenMs?: number;
      /** Nur bei Selbstlernenden: Warnung verschickt am (ms) bzw. 0. */
      inactiveNoticeMs?: number;
      createdMs?: number;
      /** Bestätigte Spende am (ms) bzw. 0 - grünes Häkchen (19.09.2026). */
      gespendetMs?: number;
    }[];
  };
}

/**
 * Anonyme Reichweiten-Zahl je freier Simulation (Plattform-Umbau Etappe 7 C).
 * Aggregat aus dem admin-gateten Hook `/api/sensorik/admin/sim-stats` —
 * Starts + durchschnittliche Verweildauer (ms), KEINE personenbezogenen Daten,
 * kein Cookie (feedback_data_transparency).
 */
export interface SimStat {
  program: string;
  starts: number;
  avgMs: number;
}

/* ══════════════════════════════════════════════════════════════════════════
   STATISTIK (08.09.2026) — die Zahlen hinter /admin/statistik
   ══════════════════════════════════════════════════════════════════════════

   ★★★ JEDE ZAHL TRÄGT IHRE HERKUNFT, weil die drei Quellen Verschiedenes
   können. Wer sie vermischt, zählt Menschen doppelt oder gar nicht:

     „menschen…"  aus Prüfsummen (IP + Browser + Monatssalz, die IP wird NIE
                  gespeichert). Belastbar für „verschiedene Menschen HEUTE".
                  ⚠️ NICHT für Wiederkehr: Die IP wechselt nachts, und im
                  Uni-WLAN teilen sich 30 Studierende eine.
     „geraete…"   aus dem Merker im Browser. Kleinere Zahl (wer die Statistik
                  ablehnt, hat keinen), dafür ECHTE Wiederkehr über Jahre.
     „kinder…"    aus den Konten. Vollständig, aber nur für Angemeldete.

   Die Seite beschriftet das sichtbar. Wer die Felder woanders verwendet, muss
   die Beschriftung mitnehmen - eine Zahl ohne ihre Herkunft ist hier falsch.
   Serverseite: `pocketbase/pb_hooks/admin_statistik.pb.js`. */

/** Eine Zeile der Programm-Tabelle (Simulation oder Lernprogramm). */
export interface StatistikProgramm {
  programm: string;
  bereich: string; // "sim" | "app"
  besuche: number;
  /** Verschiedene Menschen (Prüfsummen), über den Zeitraum aufsummiert. */
  besucher: number;
  dauerMs: number;
  /** Davon ohne Anmeldung - die Antwort auf „wie viele üben ohne Konto". */
  besucheGast: number;
  dauerGastMs: number;
  /** Verweildauer je Besuch. */
  avgMs: number;
  avgGastMs: number;
}

/** Ein Tag der Verlaufskurve. `tag` = Tage seit 01.01.1970 (UTC). */
export interface StatistikTag {
  tag: number;
  besuche: number;
  besucher: number;
  dauerMs: number;
  besucheGast: number;
}

/** „An wie vielen Tagen war dasselbe Gerät da?" */
export interface StatistikWiederkehr {
  label: string;
  anzahl: number;
}

/**
 * Eine Lehrkraft mit ihren Zahlen.
 * ⚠️ Enthält den ANMELDENAMEN (Johannes 08.09.: „bei Lehrer möchte ich die
 * anmeldenamen sehen") - deshalb liegt die Route hinter Admin + 2FA. Von
 * KINDERN kommt hier nichts Namentliches an, nur Anzahlen und Minuten.
 */
export interface StatistikLehrkraft {
  id: string;
  anmeldename: string;
  name: string;
  bestaetigt: boolean;
  angelegtMs: number;
  klassen: number;
  kinder: number;
  /** Kinder, die im Zeitraum tatsächlich geübt haben. */
  kinderAktiv: number;
  /** Übezeit aller ihrer Kinder im Zeitraum, in Minuten. */
  minuten: number;
  /** Letzter Übungstag irgendeines ihrer Kinder (0 = nie). */
  letzterTag: number;
  /**
   * Wann diese Lehrkraft gespendet hat, in Millisekunden (0 oder fehlend =
   * nie). Quelle ist das Kontofeld `gespendetAm`; NUR das Datum, kein Betrag
   * (Johannes 20.09.2026: „Das Häkchen kann auch gerne in der Statistik
   * aufscheinen, ist mir fast lieber, da haben wir ja auch alle Benutzer.").
   *
   * ⚠️ Bewusst optional: Ein Server, auf dem der Hook noch ohne dieses Feld
   * läuft, schickt es nicht mit - die Seite zeigt dann kein Häkchen statt
   * abzustürzen.
   */
  gespendetMs?: number;
}

/**
 * Ein Kind-Konto, so weit die Textvorrats-Rechnung es braucht (20.09.2026).
 * Kurze Feldnamen, weil die Liste ALLE Konten trägt; die Bedeutung steht
 * ausgeschrieben in `lib/typing/textvorrat.ts` (`TextvorratKonto`).
 *
 * ⚠️ Nichts davon zeigt auf ein bestimmtes Kind: kein Name, keine Kennung,
 * kein Klassencode, kein Klassenname. Von der Klasse geht nur ihre
 * SCHULSTUFE mit - die Zahl, aus der die Textstufe folgt.
 */
export interface StatistikTextvorratKind {
  /** Kontofeld `stufe`, roh (alte Werte a/b/c kommen vor). */
  s?: string;
  /** Geburtsjahr. */
  j?: number;
  /** Übungssprache des Kontos. */
  l?: string;
  /** 1 = gehört einer Klasse an, dann hat die Klasse Vorrang. */
  k?: number;
  /** Schulstufe der Klasse (100 = Erwachsen). */
  ks?: number;
  /** Startjahr des Schuljahrs, in dem die Schulstufe eingetragen wurde. */
  kj?: number;
  /** Sprache der Klasse. */
  kl?: string;
  /** `seenBausteine` als base64 - ein Bit je getipptem Baustein. */
  b?: string;
}

/** Übe-Zahlen je Programm (Gäste bzw. Konten). */
export interface StatistikLernProgramm {
  programm: string;
  geraete?: number;
  kinder?: number;
  tage: number;
  minuten: number;
}

/** Statable (statable.eu) - nur gelesen vom eigenen Statable-Server, Zählwerte ohne Personenbezug (Hook `admin_statistik.pb.js`). */
export interface StatableName { wert: string; name: string; n: number }
export interface StatableStatistik {
  von: number; bis: number;
  starts: number; zeitMs: number;
  geraete: number; geraeteWiederkehrend: number; geraeteNeu: number;
  rSitzungen: number; hilfeseitenAufrufe: number; hilfeArtikelGelesen: number;
  auswertungenGesamt: number; lerneinheitenOffen: number; lerneinheitenFertig: number;
  verfahren: StatableName[];
  lernen: { wert: string; name: string; offen: number; fertig: number }[];
  pfade: StatableName[];
  hilfeArtikel: StatableName[];
  sprachen: StatableName[];
  verlauf: { tag: number; starts: number; geraete: number }[];
}

export interface Statistik {
  /** Statable-Abschnitt; `null`, wenn der Statable-Server nicht antwortet (dann steht der Grund in `statableFehler`). */
  statable?: StatableStatistik | null;
  statableFehler?: string;
  generatedAt: number;
  zeitraum: { tage: number; vonTag: number; bisTag: number };
  reichweite: {
    menschenImZeitraum: number;
    menschenGesamt: number;
    geraeteImZeitraum: number;
    geraeteGesamt: number;
    geraeteWiederkehrend: number;
    geraeteEinmalig: number;
    besucheJeGeraet: number;
    tageJeGeraet: number;
    verweilJeGeraetMs: number;
    wiederkehrVerteilung: StatistikWiederkehr[];
    programme: StatistikProgramm[];
    verlauf: StatistikTag[];
  };
  lernen: {
    besucheOhneAnmeldung: { besuche: number; dauerMs: number };
    ohneAnmeldung: {
      geraete: number;
      uebungstage: number;
      minuten: number;
      wiederkehrend: number;
      programme: StatistikLernProgramm[];
    };
    mitKonto: {
      kinderGesamt: number;
      kinderAktiv: number;
      selbstlernende: number;
      minuten: number;
      programme: StatistikLernProgramm[];
    };
  };
  lehrkraefte: {
    anzahl: number;
    liste: StatistikLehrkraft[];
    klassen: number;
  };
  /**
   * ★ Reicht der Textvorrat? (Johannes 20.09.2026: „kannst du herausfinden,
   * wie viel die Schüler, die am meisten Text geschrieben haben, vom Text
   * ihrer Altersklasse schon verbraucht haben?")
   *
   * Hier stehen nur die ROHEN Tatsachen je Kind-Konto; wie gross der Vorrat
   * einer Textstufe ist, weiss nur der Korpus, und der liegt im Frontend.
   * Ausgerechnet wird in `lib/typing/textvorrat.ts` - dort steht auch, warum
   * der Server das nicht kann, ohne bei jeder Inhalts-Charge falsch zu werden.
   *
   * ⚠️ Bewusst optional: Ein Server, auf dem der Hook noch ohne dieses Feld
   * läuft, schickt es nicht mit - die Seite sagt das dann, statt eine
   * erfundene Null zu zeigen.
   */
  textvorrat?: {
    /**
     * Eine Zeile je Kind-Konto, OHNE Schlüssel und in beliebiger Reihenfolge -
     * kein Name, keine Kennung, kein Klassencode
     * ([[feedback_nie_gegen_das_kind]]). Die Feldnamen sind kurz, weil die
     * Liste alle Konten trägt; ausgeschrieben stehen sie in
     * `TextvorratKonto`.
     */
    kinder: StatistikTextvorratKind[];
  };
  /**
   * Was es schon vor dieser Messung gab (Johannes 08.09.2026: „kannst du
   * bisherige daten auch einpflegen, gibt es da nicht mehr?").
   *
   * ⚠️ `sims` sind SUMMEN OHNE DATUM (seit 27.06.2026) - sie stehen deshalb
   * neben dem Zeitraum, nicht in der Verlaufskurve. Wer sie in die Tagesreihe
   * presste, müsste ein Datum erfinden.
   */
  vorher: {
    sims: { programm: string; starts: number; dauerMs: number; avgMs: number }[];
    /** Lektionsaufrufe in den Kursen - andere Welt als die Simulationen. */
    kurse: {
      aufrufe: number;
      dauerMs: number;
      konten: number;
      vonMs: number;
      bisMs: number;
      lektionen: { lektion: string; aufrufe: number }[];
    };
  };
  system: { uniKonten: number; kurse: number };
}

/**
 * Die Schnittstelle zum Server. `BackendErweiterung` sind die Methoden von
 * Erweiterungen, die nicht im öffentlichen Repository liegen (dort leer).
 */
export interface Backend extends BackendErweiterung {
  readonly kind: "mock" | "pocketbase";
  init(): Promise<void>;
  onAuthChange(cb: (u: UserProfile | null) => void): () => void;
  currentUser(): UserProfile | null;

  signIn(email: string, password: string): Promise<UserProfile>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;

  /**
   * Phase C / Welcome-Mail (2026-05-22): den Token aus dem
   * "Passwort festlegen"-/"Passwort vergessen"-Mail-Link einlösen und
   * dabei das neue Passwort der Studi setzen. Wirft "not-found" bei
   * ungültigem oder abgelaufenem Token, "auth/weak-password" bei zu
   * kurzem Passwort.
   *
   * Das ist der Gegenpart zu `resetPassword` (= Mail anstoßen) bzw.
   * `sendWelcomeMail`. Bei PocketBase setzt der pb_hook
   * `welcome_verify.pb.js` nach Erfolg zusätzlich `verified:true`
   * (R2-5-Doppelnutzen). Der Mock erledigt das `verified:true` selbst.
   */
  confirmPasswordReset(token: string, newPassword: string): Promise<void>;

  /**
   * R2-5: (erneut) eine Bestätigungs-Mail an die Adresse des aktuell
   * angemeldeten Kontos anstoßen. Versand erfolgt serverseitig
   * (PocketBase-SMTP); ohne SMTP ein No-op (kein harter Fehler).
   */
  requestEmailVerification(): Promise<void>;
  /**
   * R2-5: Bestätigungs-Token aus dem Mail-Link einlösen → Konto
   * `verified`. Wirft bei ungültigem/abgelaufenem Token.
   */
  confirmEmailVerification(token: string): Promise<void>;
  /**
   * Adresswechsel bestätigen: Der Link ging an die NEUE Adresse, zusätzlich
   * wird das eigene Passwort verlangt (04.09.2026). Ohne beides könnte ein
   * offen stehender Rechner genügen, um ein Konto auf eine fremde Adresse
   * umzuhängen.
   *
   * ⚠️ Die Mail dazu löst bisher KEINE Oberfläche aus - den Wechsel stösst nur
   * die Verwaltung an. Der Weg ist trotzdem gebaut, weil der Link sonst in
   * PocketBases Admin-Oberfläche zeigte: Wer ihn öffnete, landete auf Englisch
   * in einem Bereich, den er weder versteht noch betreten darf.
   */
  confirmEmailChange(token: string, password: string): Promise<void>;
  getProfile(uid: string): Promise<UserProfile | null>;
  listUsers(): Promise<UserProfile[]>;
  /**
   * Admin-Leitstand (Etappe 6): aggregierte Cross-Welten-Statistik.
   * NUR Admin (Server-Hook erzwingt es zusätzlich, fail-closed).
   * Wirft BackendError("totp/required") wenn 2FA eingerichtet, aber die
   * Sitzung nicht freigeschaltet ist.
   */
  getAdminStats(): Promise<AdminStats>;
  /**
   * Admin-Welt (Etappe 6 §3a): Cross-Welten-Konten-Verzeichnis. NUR Admin +
   * 2FA-frei (Server-Hook erzwingt es). Stammdaten, keine Passwörter.
   */
  listAdminUsers(): Promise<AdminUserDirectory>;
  /**
   * Admin-Welt (Etappe 7 C): anonyme Reichweiten-Zähler der freien
   * Simulationen (Starts + Ø-Verweildauer je Programm). Nur Admin + 2FA
   * (Server-Hook erzwingt es). Aggregat, keine Personendaten.
   */
  getSimStats(): Promise<SimStat[]>;
  /**
   * Die volle Statistik für /admin/statistik. `tage` = Länge des Zeitraums
   * (1-730, Vorgabe 90). Admin + 2FA; wirft sonst.
   */
  getStatistik(tage?: number): Promise<Statistik>;
  /**
   * Admin-2FA (TOTP, Etappe 6 Schritt 2). Status der Authenticator-2FA fürs
   * Admin-Fenster: eingerichtet? aktuell freigeschaltet?
   */
  getTotpStatus(): Promise<{ enabled: boolean; unlocked: boolean }>;
  /**
   * Startet die 2FA-Einrichtung: liefert ein neues Secret + otpauth-URI zum
   * Einscannen (nur Admin, nur wenn noch nicht aktiv).
   */
  setupTotp(): Promise<{ secret: string; otpauthUri: string }>;
  /**
   * Bestätigt die Einrichtung mit einem App-Code → aktiviert 2FA, schaltet die
   * Sitzung frei und liefert einmalig die Wiederherstellungs-Codes.
   */
  confirmTotp(code: string): Promise<{ recoveryCodes: string[] }>;
  /**
   * Schaltet die Admin-Sitzung mit einem App-Code (oder Wiederherstellungs-
   * Code) frei. Wirft bei falschem Code.
   */
  verifyTotp(code: string): Promise<void>;
  setRole(uid: string, role: Role): Promise<void>;
  /**
   * Löscht ein Benutzerkonto VOLLSTÄNDIG und unwiderruflich, inklusive aller
   * personenbezogenen Daten: Lernfortschritt, Quiz-Ergebnisse, Abgaben, Noten,
   * Anwesenheiten, Forenbeiträge, Quiz-Zuweisungen, Analytik und ALLE Kurs-
   * Einschreibungen (DSGVO „Recht auf Vergessenwerden"). Anders als die
   * automatische Teilnehmer-Bereinigung bei Kurs-Löschung kennt diese explizite
   * Admin-Aktion KEINE Schutzbedingungen außer einer: das eigene, gerade
   * angemeldete Konto kann nicht gelöscht werden (wirft). PB-Rule: nur Admins.
   */
  deleteUser(uid: string): Promise<void>;
  /**
   * Phase B.1 (2026-05-26): Admin korrigiert Vor-/Nachname (z. B. nach
   * Heuristik-Migration aus der Audit-Liste). `displayName` wird vom
   * Backend automatisch aus `joinName(first, last)` neu gebildet.
   * PB-Rule: nur Admins.
   */
  setUserName(
    uid: string,
    firstName: string,
    lastName: string,
  ): Promise<UserProfile>;
  /**
   * Ändert die Login-/E-Mail-Adresse eines Kontos (2026-06-04). Die E-Mail IST
   * die Anmelde-Kennung — die Person meldet sich danach mit der neuen Adresse
   * an. Wirft, wenn die Adresse bereits vergeben ist.
   *
   * ACHTUNG (2026-06-04): PocketBase schützt das E-Mail-Feld von Auth-
   * Collections gesondert — ein direktes Update erlaubt es NUR Superusern oder
   * via `manageRule`. Die `users`-Collection hat KEIN manageRule, ein App-Admin
   * (role="admin") ist KEIN PB-Superuser → dieser Aufruf scheitert für Admins.
   * Daher aktuell NICHT aus dem »Benutzer bearbeiten«-Dialog verdrahtet;
   * E-Mail-Korrekturen laufen über die PocketBase-Admin-Oberfläche (Superuser).
   * Wieder-Verdrahtung wäre nach Setzen einer manageRule ein UI-Einzeiler.
   */
  setEmail(uid: string, email: string): Promise<UserProfile>;
  /**
   * Schritt 6 (2026-05-25): Studi/User aktualisiert eigene Profil-Felder
   * (Bundesland, Telefon, Inklusions-Liste-Zustimmung). NUR diese drei
   * Felder dürfen geändert werden — Email/Rolle/uid sind unveränderlich.
   * Backend setzt `inkluListConsentedAt = Date.now()` automatisch, wenn
   * `inkluListConsent === true` neu gesetzt wird; ein Widerruf (false)
   * löscht den Timestamp.
   * PocketBase-Rule: `id = @request.auth.id` (User darf nur sein eigenes
   * Record schreiben). Mock prüft client-seitig analog.
   */
  updateOwnProfile(fields: OwnProfileUpdate): Promise<UserProfile>;
  /**
   * Admin-side account creation for roster import. Unlike signUp(), this must
   * NOT change the current auth session (the admin stays logged in while
   * bulk-creating participants).
   *
   * Phase C / Welcome-Mail-Flow (2026-05-22): das Konto wird mit einem
   * langen Zufalls-Passwort angelegt, das **niemand jemals nutzt**. Die
   * Studierende setzt ihr eigenes Passwort über den Reset-Link in der
   * Welcome-Mail (siehe `sendWelcomeMail`). Konto bleibt
   * `verified:false`, bis der Reset-Link geklickt ist (Doppelnutzen
   * für R2-5).
   */
  adminCreateUser(
    email: string,
    displayName: string,
    role: Role,
  ): Promise<UserProfile>;

  /**
   * Phase C / Welcome-Mail (2026-05-22): triggert serverseitig die
   * "Passwort festlegen"-Mail an die angegebene Adresse. Best-effort —
   * wirft NICHT, wenn SMTP fehlt; der/die Aufrufer:in entscheidet, ob
   * das ein Fehler ist. Aufruf direkt nach `adminCreateUser` für neu
   * eingeladene Konten; oder über den "Erneut senden"-Knopf im
   * Admin-Panel für bereits angelegte, noch nicht aktivierte Konten.
   *
   * Backend-seitig identisch zu `resetPassword`: PB
   * `requestPasswordReset(email)`. Das Mail-Template ist
   * Johannes-NAS-Schritt (PB-Admin → Mail → Reset-Template umtexten).
   */
  sendWelcomeMail(email: string): Promise<void>;

  /**
   * 2026-06-08: Admin vergibt einer Teilnehmer:in ein Start-Passwort. Das
   * Konto wird sofort aktiv (`verified:true`) und für den ersten Login mit
   * `mustChangePassword:true` markiert. Gedacht als Weg an blockierten
   * Schul-Mailservern vorbei: der/die Admin nennt der Person das Passwort
   * direkt. Nur Admin (serverseitig über admin_set_password.pb.js erzwungen;
   * PocketBase erlaubt das Setzen fremder Passwörter nicht per Client-Update).
   */
  adminSetPassword(uid: string, password: string): Promise<void>;
  /**
   * 2026-06-08: Die angemeldete Person setzt ihr eigenes Passwort und löscht
   * damit das `mustChangePassword`-Flag (erzwungener Erstwechsel nach
   * `adminSetPassword`). Funktioniert serverseitig NUR, solange das Flag
   * gesetzt ist. Meldet die Person danach mit dem neuen Passwort neu an
   * (setPassword rotiert den tokenKey).
   */
  finishForcedPasswordChange(password: string): Promise<void>;
  /**
   * Besorgt den Ausweis für geschützte Lehrinhalte (2026-08-03).
   *
   * Lektions-Artefakte (`/lektionen/…`) und Lektions-Medien (`/media/…`) sind
   * seither nur noch mit Anmeldung abrufbar; der Server verlangt ein
   * kurzlebiges Cookie (pb_hooks/geschuetzte_inhalte.pb.js). Diese Methode holt
   * es. **Vor jeder Anzeige von Lektionsinhalten aufrufen** — sie ist billig
   * (eigener Cache) und darf gefahrlos mehrfach gerufen werden.
   *
   * Wirft NICHT: Ohne Anmeldung oder bei einem Serverfehler bleibt es beim
   * fehlenden Ausweis, und die Inhalte antworten mit 404. Die Anzeige muss
   * damit umgehen können, statt an einer Ausnahme zu zerbrechen.
   */
  inhaltsAusweisSichern(): Promise<void>;

  // --- Programme-Entwürfe-Status (Admin-Tracking) --------------------------
  // Speichert je Programm-Key { released?, type? } als Verwaltungs-Notiz.
  // Wirkt nur im Admin-Entwürfe-Reiter — öffentliche Seiten nutzen den
  // statischen draft-Flag in allPrograms.ts.
  getProgrammeOverrides(): Promise<ProgrammeOverrides>;
  saveProgrammeOverrides(overrides: ProgrammeOverrides): Promise<void>;
}
