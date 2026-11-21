/**
 * Die eigenen Adressen der Plattform - und woher der Browser sein Backend holt.
 * ============================================================================
 *
 * Seit dem 22.08.2026 läuft dieselbe App unter ZWEI Adressen:
 *
 *   - `weingartner.org`  - die Lernplattform mit allen Programmen
 *   - `tastenflow.org`   - nur Tastenflow, eigene Adresse zum Weitersagen
 *   - `lexami.org`       - Lexami (seit 14.11.2026); seit 16.11.2026 IST die
 *                          Wurzel Lexami (`lexami.org/en/de/Haus`, kurze Adresse,
 *                          `lib/woerterbuch/adresse.ts`); die lange Form leitet um
 *
 * Beide werden vom selben Server (Caddy) aus demselben PocketBase bedient.
 *
 * ── DIE FALLE, DERENTWEGEN ES DIESE DATEI GIBT (www-Falle vom 16.08.2026) ──
 *
 * Das Bündel fragte sein Backend bisher an einer FEST einkompilierten Adresse
 * (`VITE_POCKETBASE_URL`, in der Produktion `https://weingartner.org`). Solange
 * die Seite selbst unter genau dieser Adresse lief, war das dieselbe Herkunft
 * und alles ging gut. Ruft aber jemand `tastenflow.org` auf, ist
 * `weingartner.org` eine FREMDE Herkunft:
 *
 *   1. PocketBase antwortet zwar mit `Access-Control-Allow-Origin: *`,
 *   2. aber „*" gilt nicht für Anfragen mit Zugangsdaten,
 *   3. der Browser verwirft daher das HttpOnly-Cookie des Datei-Ausweises
 *      (`POST /api/sensorik/inhalt/ausweis`),
 *   4. und geschützte Dateien - Handbuch, Kursdateien - antworten mit 404.
 *
 * Genau dieser Ablauf hat am 16.08.2026 unter `www.weingartner.org` schon
 * einmal die Kursdateien lahmgelegt. Er kostet einen halben Tag Suche, weil
 * die Anmeldung selbst funktioniert (Token im localStorage) und nur die
 * cookie-gestützten Downloads scheitern.
 *
 * ── DIE REGEL ───────────────────────────────────────────────────────────────
 *
 * Läuft die Seite unter einer EIGENEN Adresse, ist das Backend die EIGENE
 * Herkunft. Dann gibt es keine fremde Herkunft, kein CORS und kein verworfenes
 * Cookie - egal, unter welcher der Adressen jemand ankommt.
 *
 * Überall sonst (localhost, Tests, Vorschau-Hosts wie `*.sslip.io`) gilt
 * weiterhin `VITE_POCKETBASE_URL`, ersatzweise die lokale PocketBase.
 *
 * ⚠️ Eine neue eigene Adresse gehört in EIGENE_HOSTS - sonst wiederholt sich
 *    die Falle dort von Neuem.
 */

/** Herkunft der Seite, wie `window.location` sie liefert. */
export interface Herkunft {
  /** Nur der Rechnername, z. B. „tastenflow.org" (ohne Anschluss-Nummer). */
  hostname: string;
  /** Vollständige Herkunft, z. B. „https://tastenflow.org". */
  origin: string;
}

/**
 * Alle Adressen, unter denen DIESE App im Netz erreichbar ist. Unter ihnen
 * bedient derselbe Server auch das Backend - deshalb darf (und muss) die
 * eigene Herkunft benutzt werden.
 *
 * ⚠️ Vollständig halten: `www.`-Schreibweisen gehören dazu, auch wenn Caddy
 *    sie weiterleitet. Die Weiterleitung kann ausfallen, die Liste nicht.
 */
export const EIGENE_HOSTS: readonly string[] = [
  "weingartner.org",
  "www.weingartner.org",
  "tastenflow.org",
  "www.tastenflow.org",
  "lexami.org",
  "www.lexami.org",
];

/** Die Adressen, unter denen NUR Tastenflow zu Hause ist. */
export const TASTENFLOW_HOSTS: readonly string[] = [
  "tastenflow.org",
  "www.tastenflow.org",
];

/**
 * Die Adressen von Lexami (Johannes 14.11.2026: „habe die domain gekauft").
 * Die alte Adresse weingartner.org/programme/lexami (und /programme/woerterbuch)
 * leitet seit 14.11.2026 abends per Caddy (302, Pfad bleibt) nach lexami.org um
 * (Johannes: „die alte adresse wird umgeleitet"). Lernlisten ohne Konto und das
 * offline gespeicherte Wörterbuch liegen im Browser je Adresse - unter lexami.org
 * beginnen sie neu. Seit 16.11.2026 wohnt Lexami auf lexami.org an der
 * Wurzel (kurze Adresse); `/programme/lexami/…` leitet dort auf `/…` um
 * (`LexamiLangeAdresse` in `App.tsx`).
 */
export const LEXAMI_HOSTS: readonly string[] = [
  "lexami.org",
  "www.lexami.org",
];

/** Lexami innerhalb der Plattform (weingartner.org, localhost); auf lexami.org kurz „/". */
export const LEXAMI_PFAD = "/programme/lexami";

/** Die Startseite der Lernplattform - das Zuhause aller übrigen Programme. */
export const PLATTFORM_START = "https://weingartner.org/";

/** Die eigene Adresse von Tastenflow (ohne Schrägstrich am Ende). */
export const TASTENFLOW_START = "https://tastenflow.org";

/**
 * Tastenflow innerhalb der Plattform. Eingefroren - Lesezeichen, verschickte
 * Mails, Moodle-Links und die Arbeitsheft-Einbettungen zeigen darauf, und
 * unter `tastenflow.org` beantwortet dieselbe App den Pfad ebenfalls.
 */
export const TASTENFLOW_PFAD = "/programme/tastenflow";

/**
 * Die Herkunft der laufenden Seite - oder `null` außerhalb eines Browsers
 * (Server-Rendering, Node-Skripte). Für Tests lässt sich jede Herkunft als
 * schlichtes Objekt hereinreichen; die Funktionen bleiben damit rein.
 */
function laufendeHerkunft(herkunft?: Herkunft): Herkunft | null {
  if (herkunft) return herkunft;
  if (typeof window === "undefined" || !window.location) return null;
  return {
    hostname: window.location.hostname,
    origin: window.location.origin,
  };
}

/** Läuft die Seite unter einer unserer eigenen Adressen? */
export function istEigenerHost(hostname: string | null | undefined): boolean {
  if (!hostname) return false;
  return EIGENE_HOSTS.includes(hostname.toLowerCase());
}

/** Läuft die Seite unter der Tastenflow-Adresse? */
export function istTastenflowHost(hostname: string | null | undefined): boolean {
  if (!hostname) return false;
  return TASTENFLOW_HOSTS.includes(hostname.toLowerCase());
}

/** Rechnername ohne „www." - die beiden Schreibweisen sind dieselbe Adresse. */
function ohneWww(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/** Zeigt `adresse` (z. B. „https://tastenflow.org") auf denselben Rechner? */
function gleicherRechner(hostname: string, adresse: string): boolean {
  const ziel = adresse.replace(/^https?:\/\//, "").replace(/[/?#].*$/, "");
  return ohneWww(hostname) === ohneWww(ziel);
}

/** Läuft die aufgerufene Seite gerade unter der Lexami-Adresse? */
export function hierIstLexami(herkunft?: Herkunft): boolean {
  const hier = laufendeHerkunft(herkunft);
  return !!hier && LEXAMI_HOSTS.includes(hier.hostname.toLowerCase());
}

/** Läuft die aufgerufene Seite gerade unter der Tastenflow-Adresse? */
export function hierIstTastenflow(herkunft?: Herkunft): boolean {
  const hier = laufendeHerkunft(herkunft);
  return !!hier && istTastenflowHost(hier.hostname);
}

/**
 * Das Ziel jedes Verweises auf Tastenflow.
 * ============================================================================
 *
 * Seit dem 22.08.2026 ist `https://tastenflow.org` die öffentliche Adresse des
 * Programms; `weingartner.org/programme/tastenflow` leitet dorthin weiter (das
 * macht Caddy). Die App soll darum gar nicht erst auf die alte Adresse zeigen -
 * sonst läuft jeder Klick durch eine Weiterleitung.
 *
 *   - schon auf tastenflow.org ⇒ „/" (bleibt im selben Fenster und, wichtiger,
 *     auf demselben Rechnernamen: die Sitzung hängt daran)
 *   - auf weingartner.org      ⇒ „https://tastenflow.org"
 *   - sonst (localhost, Tests) ⇒ „/programme/tastenflow", denn dort gibt es
 *     die zweite Adresse nicht
 *
 * ⚠️ Nur für Verweise VON AUSSEN auf Tastenflow. Die Navigation INNERHALB von
 *    Tastenflow (z. B. „/lernwerkstatt/klasse?app=tippen") bleibt relativ,
 *    damit sie auf tastenflow.org den Rechnernamen nicht wechselt.
 */
export function tastenflowHref(herkunft?: Herkunft): string {
  return programmHref(
    { path: TASTENFLOW_PFAD, externeAdresse: TASTENFLOW_START },
    herkunft,
  );
}

/**
 * Dasselbe für ein beliebiges Programm aus dem Katalog (`allPrograms.ts`).
 * Ohne eigene Adresse bleibt es beim Pfad im Haus - das ist der Normalfall.
 */
export function programmHref(
  programm: { path: string | null; externeAdresse?: string },
  herkunft?: Herkunft,
): string {
  const pfad = programm.path ?? "/programme";
  const extern = programm.externeAdresse;
  if (!extern) return pfad;
  const hier = laufendeHerkunft(herkunft);
  if (!hier) return pfad;
  // Schon dort? Dann relativ bleiben - der Rechnername (und mit ihm die
  // Sitzung) darf beim Klick nicht wechseln. „www." zählt als dieselbe
  // Adresse, sonst schickte ein Klick auf www.tastenflow.org quer über den
  // Rechnernamen hinweg (und durch Caddys Weiterleitung).
  if (gleicherRechner(hier.hostname, extern)) return "/";
  if (istEigenerHost(hier.hostname)) return extern;
  // Entwicklung, Tests, Vorschau-Hosts: die zweite Adresse gibt es dort nicht.
  return pfad;
}

/**
 * Das Ziel des Heim-Verweises in der Kopfzeile („Sensorik Lernplattform, zur
 * Startseite"). Auf tastenflow.org führt er BEWUSST hinüber zur Plattform -
 * dort wohnen die übrigen Programme; „/" wäre dort ja Tastenflow selbst.
 */
export function plattformStartHref(herkunft?: Herkunft): string {
  // Auf lexami.org ist „/" Lexami selbst - auch von dort geht es zur Plattform.
  return hierIstTastenflow(herkunft) || hierIstLexami(herkunft) ? PLATTFORM_START : "/";
}

/**
 * DIE EIGENE ADRESSE EINER APP (Johannes 16.11.2026)
 * ============================================================================
 *
 * „wenn man ein lehrerkonto erstellt und plötzlich auf weingartner steht kennen
 * sich die leute nicht mehr aus" - entschieden: „eigene adresse aber für
 * tastenflow und lexami". Wer auf tastenflow.org oder lexami.org ist, bleibt
 * dort: Konto, Bestätigen, Einladung, „Meine Klassen", Zurück-Wege.
 *
 * `hausApp()` sagt, welcher App die laufende Adresse gehört - als Schlüssel aus
 * `ALL_PROGRAMS` -, oder `null` auf weingartner.org, localhost und in Tests.
 */
export type HausApp = "tippen" | "lexami";

export function hausApp(herkunft?: Herkunft): HausApp | null {
  if (hierIstTastenflow(herkunft)) return "tippen";
  if (hierIstLexami(herkunft)) return "lexami";
  return null;
}

/** Der Anzeigename der App, der die Adresse gehört. */
export function hausAppName(app: HausApp): string {
  return app === "tippen" ? "Tastenflow" : "Lexami";
}

/** Der Rechnername jeder Haus-App - für Mails und Links von außen. */
export const HAUS_APP_START: Record<HausApp, string> = {
  tippen: TASTENFLOW_START,
  lexami: "https://lexami.org",
};

/**
 * Wohin ein „Zurück" führt, das bisher fest auf `/lernwerkstatt` zeigte
 * (Konto, Bestätigen, Einladung, Passwort, „Selbst üben" in Meine Klassen).
 * Auf der eigenen Adresse einer App ist das die App selbst („/"), sonst die
 * Lernwerkstatt.
 */
export function hausStartHref(herkunft?: Herkunft): string {
  return hausApp(herkunft) ? "/" : LERNWERKSTATT_PFAD;
}

/**
 * Der Text zum `hausStartHref()`: Auf der eigenen Adresse einer App steht dort
 * deren Name statt „Lernwerkstatt" („Zur Lernwerkstatt" ⇒ „Zur Lexami") - in
 * jeder Sprache, weil der Name in allen Übersetzungen wörtlich vorkommt.
 */
export function mitHausName(text: string, herkunft?: Herkunft): string {
  const app = hausApp(herkunft);
  return app ? text.replace("Lernwerkstatt", hausAppName(app)) : text;
}

/** Der Pfad der Lernwerkstatt im Haus. */
export const LERNWERKSTATT_PFAD = "/lernwerkstatt";

/**
 * „MEINE KLASSE" - ZWEI ADRESSEN, JE NACH RECHNERNAMEN (F9, 31.08.2026)
 * ============================================================================
 *
 * Johannes hat am 31.08. gemeldet: „auf einmal steht Lernwerkstatt in der
 * Adresse". Gemessen stimmte das - die Seite lag unter `/lernwerkstatt/klasse`,
 * auch dann, wenn man sie von `tastenflow.org` aus geöffnet hatte. Entschieden
 * (Entwurf §0a, F9): **zwei Adressen, je nach Rechnernamen.**
 *
 *   auf `tastenflow.org`   ⇒ `/meine-klasse`
 *   auf `weingartner.org`  ⇒ `/lernwerkstatt/<programm>/klasse`
 *   ohne bekanntes Programm ⇒ `/meine-klasse` (die gibt es auf BEIDEN)
 *
 * ⚠️ ADDITIV. Die alte Adresse `/lernwerkstatt/klasse` bleibt als Route
 * bestehen und leitet auf das Ergebnis dieser Funktion um - verschickte Links,
 * Lesezeichen und die Hilfe-Texte der anderen vier Programme kommen weiter an.
 * Keine bestehende Zeile dieser Datei ist dafür geändert worden.
 */
export const MEINE_KLASSE_PFAD = "/meine-klasse";

/** Die alte, gemeinsame Adresse - bleibt gültig und leitet um. */
export const MEINE_KLASSE_PFAD_ALT = "/lernwerkstatt/klasse";

/**
 * Die Adresse von „Meine Klassen" für die laufende Seite.
 *
 * @param programm  Schlüssel des Programms (`tippen`, `braille`, `klangpunkte`,
 *                  `computer`) - er entscheidet über den Reiter und über
 *                  „← Zurück zu …". Fehlt er, führt der Weg auf `/meine-klasse`.
 * @param klasse    Beitritts-Code, wenn eine bestimmte Klasse gemeint ist.
 */
export function meineKlasseHref(
  programm?: string | null,
  klasse?: string | null,
  herkunft?: Herkunft,
): string {
  const anhang = new URLSearchParams();
  // Der Programm-Schlüssel steht auf `weingartner.org` im PFAD und braucht
  // dort keinen zweiten Platz im Anhang. Auf `tastenflow.org` ist der Anhang
  // der einzige Ort dafür.
  if (klasse) anhang.set("klasse", klasse);
  const frage = anhang.toString() ? "?" + anhang.toString() : "";

  if (!programm) return MEINE_KLASSE_PFAD + frage;
  if (hausApp(herkunft)) {
    const mitApp = new URLSearchParams(anhang);
    mitApp.set("app", programm);
    return MEINE_KLASSE_PFAD + "?" + mitApp.toString();
  }
  return `${LERNWERKSTATT_PFAD}/${programm}/klasse${frage}`;
}

/**
 * „KLASSE VERWALTEN" - EIN EIGENER BILDSCHIRM (Johannes, 09.09.2026)
 * ============================================================================
 *
 * Bis heute war die Verwaltung ein Reiter („Klasse & Konten") zwischen den vier
 * Programmen. Damit behauptete die Reiterreihe, sie sei eines von fünf
 * gleichartigen Dingen - und Johannes hat den Bereich darum nicht als das
 * erkannt, was er ist: **Vorbereitung, nicht Unterricht.** Jetzt führt ein
 * Knopf im Klassenkopf hierher, und die Reiterreihe beantwortet nur noch eine
 * Frage: *welches Programm?*
 *
 * ⚠️ EIN Pfad für BEIDE Rechnernamen - anders als bei `meineKlasseHref()`.
 * Der Grund steht oben: `/meine-klasse` gibt es auf beiden. Und das Programm
 * gehört hier nicht in den Pfad, weil die Verwaltung programm-neutral ist; es
 * wandert nur als `?app=` mit, weil es den Rückweg füttert.
 */
export const KLASSE_VERWALTEN_PFAD = "/meine-klasse/verwalten";

/**
 * Die Adresse des Verwaltungs-Bildschirms.
 *
 * @param programm  Schlüssel des Programms, aus dem der Weg kam - er füttert
 *                  den Rückweg („← zurück zu Klasse 3b") und nichts sonst.
 * @param klasse    Beitritts-Code der Klasse, die verwaltet wird.
 */
export function klasseVerwaltenHref(
  programm?: string | null,
  klasse?: string | null,
): string {
  const anhang = new URLSearchParams();
  if (programm) anhang.set("app", programm);
  if (klasse) anhang.set("klasse", klasse);
  const frage = anhang.toString() ? "?" + anhang.toString() : "";
  return KLASSE_VERWALTEN_PFAD + frage;
}

/**
 * Adresse des Backends für die laufende Seite.
 *
 * Eigene Adresse ⇒ eigene Herkunft (kein CORS, Cookies bleiben gültig).
 * Sonst ⇒ `VITE_POCKETBASE_URL`, ersatzweise die lokale PocketBase.
 */
export function backendUrl(herkunft?: Herkunft): string {
  const hier = laufendeHerkunft(herkunft);
  if (hier && istEigenerHost(hier.hostname)) return hier.origin;
  return eingebauteBackendUrl();
}

/**
 * Die einkompilierte Backend-Adresse (Entwicklung, Tests, Vorschau-Hosts).
 * `import.meta.env` fehlt in reinen Node-Läufen - deshalb der Zugriff über
 * `?.` statt direkt.
 */
function eingebauteBackendUrl(): string {
  const ausUmgebung =
    typeof import.meta !== "undefined"
      ? (import.meta.env?.VITE_POCKETBASE_URL as string | undefined)
      : undefined;
  return ausUmgebung ?? "http://127.0.0.1:8090";
}
