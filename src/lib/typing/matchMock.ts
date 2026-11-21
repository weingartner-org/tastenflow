/**
 * ★★★ DAS KLASSENMATCH OHNE SERVER - mit zwei Mitspielern, die es nicht gibt.
 *
 * Auftrag (Umbauplan §2.6): *„`LocalTypingBackend` simuliert zwei Mitspieler
 * (Zufallstempo), damit der ganze Weg im Browser ohne Server abnehmbar ist."*
 *
 * ── Warum das mehr ist als eine Bequemlichkeit ──────────────────────────────
 * Ein Klassenmatch lässt sich allein nicht abnehmen: Der Knopf „Starten" geht
 * erst, wenn ein anderes Kind beigetreten ist (F4), das Ranking braucht mehr
 * als eine Zeile (F11), und die Platzierungsliste am Ende ist ohne Zweiten und
 * Dritten keine (F13). Wer das nur am Server prüfen kann, prüft es nicht -
 * er müsste drei Kinder gleichzeitig anmelden. Mia und Ben sind darum kein
 * Spielzeug, sondern die Bedingung dafür, dass dieser Weg überhaupt jemals in
 * einem Browser durchlaufen wird.
 *
 * ── Was echt ist und was nicht ──────────────────────────────────────────────
 * Echt ist ALLES ausser den zwei Mitspielern: Die Daten liegen im
 * Gerätespeicher, die Zustände sind dieselben (`einladung` → `countdown` →
 * `laeuft` → `fertig`), die Zeiten werden hier gesetzt wie sonst am Server, und
 * Änderungen erreichen **andere Tabs desselben Browsers** über das
 * `storage`-Ereignis. Damit lässt sich auch F2 abnehmen: ein zweites Kind in
 * einem zweiten Tab, das die Einladung bekommt und „Jetzt nicht" drückt.
 *
 * ⚠️ `storage` feuert NUR in den ANDEREN Tabs - im eigenen nicht. Für den
 * eigenen Tab gibt es darum zusätzlich eine kleine Melderunde
 * ({@link melde}). Ohne sie sähe das Gerät, das gerade selbst geschrieben hat,
 * seine eigene Änderung erst bei der nächsten Nachfrage.
 *
 * ── Die Abnahme-Abkürzung: 30 Sekunden statt 5 Minuten ──────────────────────
 * `?matchMinuten=0.5` verkürzt ein Match - **nur hier, also nur ohne Server**.
 * Am echten Server setzt `tt_match.pb.js` die Zeit, und dort gibt es den
 * Schalter nicht; ein Kind kann sich sein Match also nirgends kürzer stellen.
 * Fünf Minuten im Browser abzusitzen, nur um die Platzierungsliste zu sehen,
 * hiesse in der Praxis: Niemand sieht sie je.
 */
import {
  MATCH_COUNTDOWN_MS,
  MATCH_DAUER_MIN,
  MATCH_TAKT_MS,
  type Match,
  type MatchStand,
  type MatchStatus,
  matchSperre,
  matchWert,
} from "./klassenmatch";

const SCHLUESSEL_MATCHES = "tastenflow:klassenmatch:matches";
const SCHLUESSEL_STAENDE = "tastenflow:klassenmatch:staende";

/** Die zwei Mitspieler. Feste Kennungen, damit sie nicht doppelt beitreten. */
const BOTS = [
  { uid: "mock-mia", name: "Mia", apm: 170 },
  { uid: "mock-ben", name: "Ben", apm: 115 },
] as const;

/**
 * ★ Die Mitspieler stehen in JEDEM Match für ANDERE Kinder - die Sperre „ein
 * Kind, ein Match" (unten) gilt für sie darum nicht. Sonst träten sie einem
 * zweiten, gleichzeitigen Match nie bei, und genau dieser Fall soll sich im
 * Browser ohne Server abnehmen lassen.
 */
function istBot(uid: string): boolean {
  return BOTS.some((b) => b.uid === uid);
}

// ── Der Speicher ────────────────────────────────────────────────────────────

function lies<T>(schluessel: string): T[] {
  try {
    const roh = localStorage.getItem(schluessel);
    if (!roh) return [];
    const o = JSON.parse(roh);
    return Array.isArray(o) ? (o as T[]) : [];
  } catch {
    return [];
  }
}

/** Zuhörer im EIGENEN Tab - `storage` erreicht nur die anderen. */
const zuhoerer = new Set<(schluessel: string) => void>();

function melde(schluessel: string): void {
  for (const z of [...zuhoerer]) {
    try {
      z(schluessel);
    } catch {
      /* ein kaputter Zuhörer darf die anderen nicht aufhalten */
    }
  }
}

function schreibe<T>(schluessel: string, liste: T[]): void {
  try {
    localStorage.setItem(schluessel, JSON.stringify(liste));
  } catch {
    // Kein Speicher (privates Fenster): Dann gibt es eben kein Match. Ein
    // Spiel darf daran scheitern, das Üben nicht.
  }
  melde(schluessel);
}

function neueId(): string {
  return `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Die Dauer eines Matches in Minuten - im Mock mit Abkürzung (siehe Dateikopf).
 * Ausserhalb von 0,1 bis 60 Minuten gilt die Vorgabe; eine Zahl aus der Adresse
 * wird nie blind geglaubt.
 */
function mockDauerMin(): number {
  try {
    const roh = new URLSearchParams(window.location.search).get("matchMinuten");
    const n = roh === null ? NaN : Number(roh);
    if (Number.isFinite(n) && n >= 0.1 && n <= 60) return n;
  } catch {
    /* kein window/keine Adresse (Tests): die Vorgabe */
  }
  return MATCH_DAUER_MIN;
}

// ── Der Anfragen-Zähler: die LAST messbar machen ────────────────────────────
/**
 * ★★★ WIE VIELE „SERVER-ANFRAGEN" DER WEG WIRKLICH KOSTET (11.09.2026, E6b).
 *
 * Der Umbauplan §2.6 gibt ein Budget vor, und der Prüfer hat am 11.09.2026
 * nachgerechnet, dass die Match-Liste es um ein Mehrfaches sprengte (6 Abfragen
 * je Sekunde je Klasse, den ganzen Vormittag, auch ohne ein einziges Match).
 * Eine Zahl, die niemand misst, ist eine Behauptung - darum zählt der Mock
 * mit, und ein Wächter (`tests/typing-klassenmatch-last.test.tsx`) lässt den
 * Haken 60 Sekunden mit und 60 Sekunden ohne Match laufen.
 *
 * Gezählt wird genau das, was am echten Server eine Anfrage WÄRE: die Aufrufe
 * des Backends und die Schreibvorgänge der beiden Mitspieler (sie stehen für
 * die Geräte der anderen Kinder). **Nicht** gezählt wird, was das Realtime-Abo
 * im Gerät nachreicht - am Server ist das eine zugestellte Zeile, keine Frage.
 */
export interface MockAnfragen {
  lesen: number;
  schreiben: number;
  summe: number;
}

let anfragen = { lesen: 0, schreiben: 0 };

/** Eine Anfrage verbuchen - gerufen vom `LocalTypingBackend` und von den Bots. */
export function mockAnfrageGezaehlt(art: "lesen" | "schreiben"): void {
  anfragen[art] += 1;
}

/** Was seit dem letzten Zurücksetzen zusammengekommen ist. */
export function mockAnfragen(): MockAnfragen {
  return { ...anfragen, summe: anfragen.lesen + anfragen.schreiben };
}

/** Den Zähler auf null stellen (Messung, Wächter). */
export function mockAnfragenZuruecksetzen(): void {
  anfragen = { lesen: 0, schreiben: 0 };
}

// ── Lesen ───────────────────────────────────────────────────────────────────

export function mockListeMatches(classCode: string): Match[] {
  return lies<Match>(SCHLUESSEL_MATCHES).filter((m) => m.classCode === classCode);
}

export function mockListeStaende(matchId: string): MatchStand[] {
  return lies<MatchStand>(SCHLUESSEL_STAENDE).filter((s) => s.matchId === matchId);
}

/**
 * Änderungen beobachten - im eigenen Tab über {@link melde}, in anderen Tabs
 * über `storage`. Gibt die Abmeldung zurück.
 */
export function mockBeobachte(schluessel: "matches" | "staende", beiAenderung: () => void): () => void {
  const ziel = schluessel === "matches" ? SCHLUESSEL_MATCHES : SCHLUESSEL_STAENDE;
  const eigen = (s: string) => {
    if (s === ziel) beiAenderung();
  };
  zuhoerer.add(eigen);
  const fremd = (e: StorageEvent) => {
    if (e.key === ziel) beiAenderung();
  };
  window.addEventListener("storage", fremd);
  return () => {
    zuhoerer.delete(eigen);
    window.removeEventListener("storage", fremd);
  };
}

// ── Schreiben ───────────────────────────────────────────────────────────────

export function mockErstelleMatch(
  classCode: string,
  hostUid: string,
  hostName: string,
): Match {
  const jetzt = Date.now();
  /*
    ★★★★★ EIN KIND, EIN MATCH (02.10.2026) - dieselbe Regel wie der Hook am
    Server (`einKindEinMatch` in `tt_match_lib.pb.js`), mit demselben Satz. Der
    Fehler geht als `Error` nach oben, genau wie `pbBackend.erstelleMatch` die
    Meldung des Servers weiterreicht.
  */
  const sperre = matchSperre(
    hostUid,
    lies<Match>(SCHLUESSEL_MATCHES),
    lies<MatchStand>(SCHLUESSEL_STAENDE),
    jetzt,
  );
  if (sperre) throw new Error(sperre);
  const match: Match = {
    id: neueId(),
    classCode,
    hostUid,
    hostName,
    status: "einladung",
    startMs: 0,
    endeMs: 0,
    dauerMin: mockDauerMin(),
    createdMs: jetzt,
  };
  schreibe(SCHLUESSEL_MATCHES, [...lies<Match>(SCHLUESSEL_MATCHES), match]);
  starteBots(match.id);
  return match;
}

/**
 * Den Zustand ändern - und beim Übergang nach `countdown` die Zeiten setzen,
 * genau wie es der Hook am Server tut. **Die Zeit kommt hier her und nicht vom
 * Aufrufer**: Sonst stellte sich jedes Gerät seine eigene, und zwei Kinder
 * hätten zwei Enden.
 */
export function mockAktualisiereMatch(matchId: string, status: MatchStatus): Match | null {
  const alle = lies<Match>(SCHLUESSEL_MATCHES);
  const i = alle.findIndex((m) => m.id === matchId);
  if (i < 0) return null;
  const alt = alle[i];
  const jetzt = Date.now();
  const neu: Match = { ...alt, status };
  if (status === "countdown" && !(alt.startMs > 0)) {
    neu.startMs = jetzt + MATCH_COUNTDOWN_MS;
    neu.endeMs = neu.startMs + Math.round(alt.dauerMin * 60_000);
  }
  alle[i] = neu;
  schreibe(SCHLUESSEL_MATCHES, alle);
  if (status === "fertig" || status === "abgebrochen") stoppBots(matchId);
  return neu;
}

export function mockSchreibeStand(
  matchId: string,
  classCode: string,
  pupilUid: string,
  name: string,
  werte: Pick<MatchStand, "status" | "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">,
): MatchStand {
  const alle = lies<MatchStand>(SCHLUESSEL_STAENDE);
  const i = alle.findIndex((s) => s.matchId === matchId && s.pupilUid === pupilUid);
  /*
    ★★★★★ EIN KIND, EIN MATCH (02.10.2026): Wer neu auf `dabei`/`schreibt`
    geht, darf in keinem ANDEREN offenen Match stecken - wie am Server
    (`standSperre` in `tt_match_lib.pb.js`). Fortschreiben derselben
    Teilnahme kostet keine Prüfung.
  */
  const neuDabei = werte.status === "dabei" || werte.status === "schreibt";
  const warDabei = i >= 0 && (alle[i].status === "dabei" || alle[i].status === "schreibt");
  if (neuDabei && !warDabei && !istBot(pupilUid)) {
    const sperre = matchSperre(pupilUid, lies<Match>(SCHLUESSEL_MATCHES), alle, Date.now(), matchId);
    if (sperre) throw new Error(sperre);
  }
  const zeile: MatchStand = {
    id: i >= 0 ? alle[i].id : neueId(),
    matchId,
    classCode,
    pupilUid,
    name,
    updatedMs: Date.now(),
    ...werte,
  };
  if (i >= 0) alle[i] = zeile;
  else alle.push(zeile);
  schreibe(SCHLUESSEL_STAENDE, alle);
  return zeile;
}

// ── Die zwei Mitspieler ─────────────────────────────────────────────────────

const laeufe = new Map<string, number[]>();

function merkeUhr(matchId: string, id: number): void {
  const liste = laeufe.get(matchId) ?? [];
  liste.push(id);
  laeufe.set(matchId, liste);
}

export function stoppBots(matchId: string): void {
  for (const id of laeufe.get(matchId) ?? []) {
    window.clearTimeout(id);
    window.clearInterval(id);
  }
  laeufe.delete(matchId);
}

/**
 * Mia tritt nach gut einer Sekunde bei, Ben nach knapp drei - zeitversetzt,
 * damit die Zeile beim Gastgeber sichtbar wächst und die Reihenfolge „Neueste
 * neben der Zahl" (F3) überhaupt einen Unterschied macht.
 *
 * Danach läuft ein Takt, der auf `laeuft` wartet und dann im selben
 * {@link MATCH_TAKT_MS} schreibt wie ein echtes Kind.
 */
function starteBots(matchId: string): void {
  BOTS.forEach((bot, i) => {
    merkeUhr(
      matchId,
      window.setTimeout(
        () => {
          const match = lies<Match>(SCHLUESSEL_MATCHES).find((m) => m.id === matchId);
          if (!match || match.status !== "einladung") return;
          // Ein Bot steht für das Gerät eines anderen Kindes - sein Schreiben
          // ist am echten Server eine Anfrage und wird darum mitgezählt.
          mockAnfrageGezaehlt("schreiben");
          mockSchreibeStand(matchId, match.classCode, bot.uid, bot.name, {
            status: "dabei",
            zeichen: 0,
            fehler: 0,
            apm: 0,
            wert: 0,
          });
        },
        1200 + i * 1400,
      ),
    );
  });

  // Der Schreib-Takt. Er beginnt mit dem Match und endet mit ihm.
  const zeichen = new Map<string, { z: number; f: number }>();
  const takt = window.setInterval(() => {
    const match = lies<Match>(SCHLUESSEL_MATCHES).find((m) => m.id === matchId);
    if (!match) {
      stoppBots(matchId);
      return;
    }
    const jetzt = Date.now();
    if (!(match.startMs > 0) || jetzt < match.startMs) return;
    const vorbei = match.endeMs > 0 && jetzt >= match.endeMs;
    const laufMs = Math.max(1, Math.min(jetzt, match.endeMs) - match.startMs);
    for (const bot of BOTS) {
      const stand = mockListeStaende(matchId).find((s) => s.pupilUid === bot.uid);
      if (!stand) continue;
      if (stand.status === "fertig") continue;
      const bisher = zeichen.get(bot.uid) ?? { z: 0, f: 0 };
      // Zufallstempo: das eigene Tempo plus/minus ein Viertel - damit sich die
      // Plätze im Lauf wirklich tauschen und die Liste sich sichtbar umsortiert.
      const tempo = bot.apm * (0.75 + Math.random() * 0.5);
      const dazu = Math.max(0, Math.round((tempo * MATCH_TAKT_MS) / 60_000));
      const z = bisher.z + dazu;
      const f = bisher.f + (Math.random() < 0.25 ? 1 : 0);
      zeichen.set(bot.uid, { z, f });
      const apm = Math.round((z / laufMs) * 60_000);
      mockAnfrageGezaehlt("schreiben"); // siehe oben: ein Bot ist ein Gerät
      mockSchreibeStand(matchId, match.classCode, bot.uid, bot.name, {
        status: vorbei ? "fertig" : "schreibt",
        zeichen: z,
        fehler: f,
        apm,
        wert: matchWert({ zeichen: z, fehler: f, apm }),
      });
    }
    if (vorbei) stoppBots(matchId);
  }, MATCH_TAKT_MS);
  merkeUhr(matchId, takt);
}

/** Test-Hilfe: alles wegräumen (Speicher, Uhren und der Anfragen-Zähler). */
export function _mockMatchesZuruecksetzen(): void {
  for (const id of [...laeufe.keys()]) stoppBots(id);
  mockAnfragenZuruecksetzen();
  try {
    localStorage.removeItem(SCHLUESSEL_MATCHES);
    localStorage.removeItem(SCHLUESSEL_STAENDE);
  } catch {
    /* ignore */
  }
}
