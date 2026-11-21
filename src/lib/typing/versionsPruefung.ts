/**
 * ★★★ NEUER STAND LIVE ⇒ OFFENE FENSTER LADEN SICH SELBST NEU (10.11.2026)
 * ============================================================================
 * Anlass: Am 10.11. ging um 08:45 UTC ein Bündel ohne Server-Verbindung live
 * (Mock, `.env.production` fehlte). Um 10:00 war es behoben - aber Fenster,
 * die seit dem Morgen offen standen, liefen weiter mit dem kaputten Stand,
 * denn eine Seite fragt von sich aus nie, ob es etwas Neues gibt.
 * Auftrag Johannes: offene Fenster sollen sich selbst neu laden.
 *
 * Wie:
 *  - `stand.json` (schreibt `deploy-frontend.sh` NACH dem Umschalten der
 *    `index.html`) nennt das Haupt-Bündel, z. B. `index-OuP5V1j1.js`.
 *  - Das laufende Fenster kennt sein eigenes Haupt-Bündel aus dem
 *    `<script src=".../assets/index-….js">` der Seite.
 *  - Unterscheiden sie sich, ist ein neuer Stand live.
 *
 * Wann neu geladen wird - NIE mitten im Tippen:
 *  - sofort, wenn das Fenster gerade im Hintergrund ist (niemand sieht es);
 *  - sonst sobald es in den Hintergrund geht, oder nach RUHE_MS ohne jede
 *    Taste, Maus- oder Touch-Eingabe. Fortschritt wird laufend am Server
 *    gespeichert (alle paar Sekunden), nach drei ruhigen Minuten ist nichts
 *    mehr offen.
 *
 * Schutz gegen Schleifen: Ein Ziel-Bündel wird pro Tab höchstens EINMAL
 * angesteuert (sessionStorage). Liefert der Server nach dem Neuladen doch
 * wieder das alte Bündel (Zwischenspeicher irgendwo), bleibt es dabei.
 */

export const PRUEF_ABSTAND_MS = 5 * 60 * 1000;
export const RUHE_MS = 3 * 60 * 1000;
const MERK_SCHLUESSEL = "tf-neu-geladen-fuer";

/** Haupt-Bündel aus einem Pfad/einer Adresse: "index-AbC_12-x.js" oder null. */
export function buendelName(text: string | null | undefined): string | null {
  if (!text) return null;
  const m = /(?:^|\/)(index-[A-Za-z0-9_-]+\.js)(?:$|[?#])/.exec(text);
  return m ? m[1] : null;
}

/** Das Haupt-Bündel, mit dem DIESES Fenster läuft. */
export function eigenesBuendel(doc: Document = document): string | null {
  for (const s of Array.from(doc.querySelectorAll("script[src]"))) {
    const n = buendelName(s.getAttribute("src"));
    if (n) return n;
  }
  return null;
}

/** Ob neu geladen werden soll: verschiedenes Bündel, nicht schon einmal versucht. */
export function sollNeuLaden(
  eigenes: string | null,
  live: string | null,
  schonVersucht: string | null,
): boolean {
  if (!eigenes || !live) return false;
  if (eigenes === live) return false;
  return schonVersucht !== live;
}

export interface VersionsPruefungOptionen {
  /** Für Tests ersetzbar. */
  holeLiveBuendel?: () => Promise<string | null>;
  neuLaden?: () => void;
  jetzt?: () => number;
  pruefAbstandMs?: number;
  ruheMs?: number;
}

async function liveBuendelVomServer(): Promise<string | null> {
  try {
    const r = await fetch(`/stand.json?t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) return null;
    const j = (await r.json()) as { buendel?: unknown };
    return typeof j.buendel === "string" ? buendelName(j.buendel) : null;
  } catch {
    return null; // offline, Server weg: einfach beim nächsten Mal wieder
  }
}

function lies(): string | null {
  try {
    return sessionStorage.getItem(MERK_SCHLUESSEL);
  } catch {
    return null;
  }
}
function merke(wert: string) {
  try {
    sessionStorage.setItem(MERK_SCHLUESSEL, wert);
  } catch {
    /* ohne Speicher: kein Schleifenschutz, aber auch kein Absturz */
  }
}

/**
 * Startet die Prüfung. Gibt eine Aufräum-Funktion zurück.
 * Tut nichts, wenn das Fenster sein eigenes Bündel nicht kennt (Entwicklung).
 */
export function starteVersionsPruefung(opt: VersionsPruefungOptionen = {}): () => void {
  const eigenes = eigenesBuendel();
  if (!eigenes) return () => {};

  const holeLive = opt.holeLiveBuendel ?? liveBuendelVomServer;
  const neuLaden = opt.neuLaden ?? (() => window.location.reload());
  const jetzt = opt.jetzt ?? (() => Date.now());
  const ruheMs = opt.ruheMs ?? RUHE_MS;

  let letzteEingabe = jetzt();
  let wartendesZiel: string | null = null;
  let ruheTimer: ReturnType<typeof setTimeout> | null = null;
  let beendet = false;

  const ladeJetzt = () => {
    if (beendet || !wartendesZiel) return;
    merke(wartendesZiel);
    beendet = true;
    neuLaden();
  };

  const planeRuhe = () => {
    if (ruheTimer) clearTimeout(ruheTimer);
    if (!wartendesZiel) return;
    const rest = Math.max(0, letzteEingabe + ruheMs - jetzt());
    ruheTimer = setTimeout(() => {
      if (jetzt() - letzteEingabe >= ruheMs) ladeJetzt();
      else planeRuhe();
    }, rest);
  };

  const pruefe = async () => {
    if (beendet || wartendesZiel) return;
    const live = await holeLive();
    if (beendet || !sollNeuLaden(eigenes, live, lies())) return;
    wartendesZiel = live;
    if (document.visibilityState === "hidden") ladeJetzt();
    else planeRuhe();
  };

  const beiEingabe = () => {
    letzteEingabe = jetzt();
  };
  const beiSichtwechsel = () => {
    if (document.visibilityState === "hidden") {
      if (wartendesZiel) ladeJetzt();
    } else {
      void pruefe(); // zurück im Fenster: gleich nachsehen
    }
  };

  const ereignisse = ["keydown", "pointerdown", "touchstart"] as const;
  for (const e of ereignisse) window.addEventListener(e, beiEingabe, { capture: true, passive: true });
  document.addEventListener("visibilitychange", beiSichtwechsel);
  const intervall = setInterval(() => void pruefe(), opt.pruefAbstandMs ?? PRUEF_ABSTAND_MS);
  void pruefe();

  return () => {
    beendet = true;
    clearInterval(intervall);
    if (ruheTimer) clearTimeout(ruheTimer);
    for (const e of ereignisse) window.removeEventListener(e, beiEingabe, { capture: true });
    document.removeEventListener("visibilitychange", beiSichtwechsel);
  };
}
