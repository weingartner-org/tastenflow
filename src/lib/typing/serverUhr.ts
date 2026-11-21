/**
 * ★★★★★ DIE UHR DES SERVERS - gegen die Uhr des Geräts (11.09.2026, E6b).
 *
 * ── Warum es diese Datei gibt ───────────────────────────────────────────────
 * `startMs` und `endeMs` eines Klassenmatchs kommen vom SERVER (`tt_match.pb.js`
 * setzt sie genau einmal). Verglichen wurden sie bis zum 11.09.2026 gegen
 * `Date.now()` des Geräts - also gegen eine Uhr, die auf einem Schul-Notebook
 * gern um Sekunden danebenliegt. Der Prüfer hat durchgerechnet, was das kostet:
 *
 * | Versatz des Geräts | Wirkung |
 * |---|---|
 * | 5 s vor  | Der Countdown dauert **5 statt 10 Sekunden** |
 * | 5 s nach | Der Countdown dauert 15 Sekunden; das Gerät schreibt noch, wenn alle fertig sind |
 * | ab 10 s vor | **Es gibt keinen Countdown mehr** - das Gerät springt sofort ins Feld, während die Klasse noch zählt |
 * | ab 5 min vor | Das Match ist beim Öffnen schon „vorbei", die Liste ist leer |
 *
 * Und es trifft ausgerechnet Kinder, die nebeneinander sitzen: Der eine hört
 * „los", der andere schreibt schon.
 *
 * ── Wie gemessen wird: ohne eine einzige zusätzliche Anfrage ────────────────
 * Jedes Kind schreibt beim Beitreten seine eigene Stand-Zeile (`meldeDabei`) und
 * danach alle drei Sekunden eine Änderung. **Die Antwort des Servers auf genau
 * dieses Schreiben trägt `updated`** - einen Zeitstempel der Server-Uhr. Mehr
 * braucht es nicht; `pbBackend.schreibeMatchStand` reicht ihn hierher.
 *
 * Gerechnet wird wie bei einer Zeitabgleich-Abfrage (NTP), nicht naiv:
 *
 *     versatz = serverZeit − (t0 + t1) / 2
 *
 * `t0` ist der Augenblick vor dem Absenden, `t1` der nach dem Eintreffen. Die
 * Mitte der beiden ist der beste Schätzwert dafür, WANN am Gerät der Server
 * seinen Stempel setzte. Nur `t1` zu nehmen (der naive Weg) zöge die halbe
 * Antwortzeit als Versatz mit hinein - im Schul-WLAN sind das leicht 100 ms,
 * und bei einer wackligen Verbindung auch mal eine halbe Sekunde.
 *
 * ── Warum der MEDIAN der letzten drei ───────────────────────────────────────
 * Eine einzelne Messung kann danebenliegen: Wer den Tab gerade wieder öffnet,
 * dessen Anfrage hängt eine Sekunde am Netz, und die halbe Antwortzeit ist dann
 * ein halber Fehler. Drei Messungen und die mittlere davon werfen genau diesen
 * Ausreisser weg - ohne zu glätten, was ein echter Versatz ist (der ändert sich
 * nicht von Sekunde zu Sekunde). Mehr als drei zu sammeln brächte nichts: Eine
 * Uhr, die zwischendurch nachgestellt wird, soll schnell wieder stimmen.
 *
 * ── Wehrhaft: ohne Messung ist der Versatz 0 ────────────────────────────────
 * Kein Server (lokales Backend, Tests, Mock), kein lesbarer Zeitstempel, ein
 * unsinniger Wert: Dann gilt `Date.now()` unverändert. Das ist genau der
 * Zustand von vor dieser Datei - schlechter wird es nie.
 */

/** Grösser als das gilt als Unsinn und wird verworfen (ms). */
const UNSINN_AB_MS = 24 * 60 * 60 * 1000;

/** Über so viele Messungen wird der Median gebildet. */
const MESSUNGEN = 3;

/** Die letzten Messungen, jüngste zuletzt. */
let messungen: number[] = [];

/**
 * Eine Antwort des Servers auswerten.
 *
 * @param serverZeit Der Zeitstempel des Servers - `rec.updated` von PocketBase
 *   („2026-09-11 08:15:42.123Z"), eine Zahl in ms oder ein `Date`.
 * @param t0 `Date.now()` VOR dem Absenden.
 * @param t1 `Date.now()` NACH dem Eintreffen (Vorgabe: jetzt).
 */
export function meldeServerZeit(serverZeit: unknown, t0: number, t1 = Date.now()): void {
  const server = alsMs(serverZeit);
  if (server === null) return;
  if (!Number.isFinite(t0) || !Number.isFinite(t1) || t1 < t0) return;
  const versatz = server - (t0 + t1) / 2;
  // Eine Uhr, die um mehr als einen Tag danebenliegt, ist keine Messung,
  // sondern ein kaputter Wert (falsches Feld, falsches Format). Sie würde ein
  // Match sofort für „vorbei" erklären.
  if (Math.abs(versatz) > UNSINN_AB_MS) return;
  messungen = [...messungen, versatz].slice(-MESSUNGEN);
}

/** Der Versatz der Server-Uhr gegen die Geräte-Uhr (ms) - ohne Messung 0. */
export function serverVersatzMs(): number {
  if (messungen.length === 0) return 0;
  const sortiert = [...messungen].sort((a, b) => a - b);
  return sortiert[Math.floor(sortiert.length / 2)];
}

/**
 * ★★★ DIE ZEIT, MIT DER JEDER VERGLEICH GEGEN `startMs`/`endeMs` RECHNET.
 *
 * Countdown, Restzeit, Ende, Vorspann und Minutenleiste benutzen sie - nie
 * `Date.now()`. Wer hier `Date.now()` schreibt, baut den Befund von 11.09.2026
 * wieder ein.
 */
export function serverJetzt(): number {
  return Date.now() + serverVersatzMs();
}

/** Wie viele Messungen bisher vorliegen - für Wächter und Fehlersuche. */
export function serverUhrMessungen(): number {
  return messungen.length;
}

/** Nur für Wächter: die Messungen vergessen. */
export function _serverUhrZuruecksetzen(): void {
  messungen = [];
}

/** Einen Zeitstempel in Millisekunden verwandeln - oder `null`. */
function alsMs(x: unknown): number | null {
  if (typeof x === "number") return Number.isFinite(x) && x > 0 ? x : null;
  if (x instanceof Date) {
    const ms = x.getTime();
    return Number.isFinite(ms) ? ms : null;
  }
  if (typeof x !== "string" || !x.trim()) return null;
  /*
    ⚠️ PocketBase schreibt „2026-09-11 08:15:42.123Z" - mit Leerzeichen statt
    „T". Safari nimmt das nicht, `Date.parse` liefert dort NaN und der Versatz
    bliebe still bei 0. Darum wird das Leerzeichen ersetzt; fehlt die Zeitzone,
    wird „Z" angehängt (der Server stempelt in UTC).
  */
  let roh = x.trim().replace(" ", "T");
  if (!/(Z|[+-]\d{2}:?\d{2})$/.test(roh)) roh += "Z";
  const ms = Date.parse(roh);
  return Number.isFinite(ms) ? ms : null;
}
