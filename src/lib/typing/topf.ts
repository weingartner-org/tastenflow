/**
 * Der ANONYME TOPF - die Geräte-Seite.
 *
 * Auftrag Johannes 28.08.2026 (E8): persönlicher Lernstand UND anonymer Topf
 * nebeneinander, **Gäste zählen mit**, nichts läuft ab. Der Grund, der seit dem
 * 29.08. alles überwiegt: An diesem Tag wurden vier Stellschrauben des Tors
 * verstellt - und jede Zahl dafür kam aus einer Simulation mit einem erfundenen
 * Kind. Der Topf ist das, was diese Zahlen künftig an echten Kindern misst.
 *
 * ── ★ Der Befund, der diese Datei nötig gemacht hat ─────────────────────────
 * Für Gäste ist `onTask` in TippenTrainerPage **undefined** - ohne Konto wurde
 * bis heute NICHTS verbucht, nirgends. „Gäste zählen mit" war mit der
 * Tagesbilanz in `lw_events` allein also gar nicht erfüllbar: Gäste haben keine
 * Zeile darin. Deshalb führt dieses Modul eine **geräte-eigene** Tagesbilanz,
 * die Gäste und Angemeldete gleichermaßen füllen.
 *
 * ── ⚠️ Zwei Bilanzen - und warum das KEINE Doppelung ist ────────────────────
 * Es gibt die Tagesbilanz jetzt an zwei Orten, und sie messen Verschiedenes:
 *
 *   `lw_events.data.tage`   je KONTO, am Server, geräteübergreifend.
 *                           Gehört dem Kind, wird mit ihm gelöscht.
 *   hier, im localStorage   je GERÄT, ohne Anmeldung, ohne Namen.
 *                           Gehört niemandem, speist den anonymen Topf.
 *
 * Ein Kind an zwei Geräten hat EINE Konto-Bilanz und ZWEI Gerätebilanzen. Das
 * ist gewollt: Der Topf ist eine Verteilungs-Statistik über Übungsverläufe,
 * keine Zählung von Personen. Wer ihn als Personenzählung liest, liest ihn
 * falsch.
 *
 * ── Was NICHT hineinkommt ──────────────────────────────────────────────────
 * Kein Name, keine Konto-Kennung, keine Klasse, keine Adresse. Die
 * Gerätekennung wird hier gewürfelt und ist mit nichts verknüpft - besonders
 * NICHT mit der `pupilUid`: Sonst bliebe beim Löschen eines Kontos eine
 * zweite Kopie der Lerndaten stehen, an der die Lösch-Automatik vorbeigreift.
 *
 * Der Gegenpart am Server ist `pocketbase/pb_hooks/tt_topf.pb.js` - und der ist
 * ohne `TT_TOPF_AKTIV=1` **abgeschaltet**. Solange er das ist, sammelt dieses
 * Modul weiter auf dem Gerät und schickt nichts; es geht nichts verloren.
 */
import { bilanzErgaenzen, tagNummer, type Tagesbilanz } from "./eventPack";
import type { TaskEvent } from "./account";

const KENNUNG_KEY = "tastenflow:topf:geraet";
const BILANZ_KEY = "tastenflow:topf:bilanz";
const GESENDET_KEY = "tastenflow:topf:gesendet";
const TASTEN_KEY = "tastenflow:topf:tasten";

/** Die Route des Gegenparts (fail-closed, siehe tt_topf.pb.js). */
export const TOPF_ROUTE = "/api/sensorik/tt/topf";

/** So viele Übungstage hebt ein Gerät auf (rund zwei Schuljahre). */
export const MAX_TAGE = 400;

const lies = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // privates Fenster, gesperrter Speicher - nie ein Fehler
  }
};
const schreib = (key: string, wert: string): void => {
  try {
    localStorage.setItem(key, wert);
  } catch {
    /* Speicher voll oder gesperrt - der Topf ist es nicht wert, etwas zu brechen */
  }
};

const b36 = (n: number): string => Math.round(n).toString(36);
const zahl = (s: string | undefined): number => {
  if (!s) return 0;
  const n = parseInt(s, 36);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Die Gerätekennung - 32 Hex-Zeichen, beim ersten Mal gewürfelt.
 *
 * ⚠️ Sie ist mit KEINEM Konto verknüpft und darf es nie werden (siehe Kopf).
 * `crypto.randomUUID` ist die Quelle; fehlt sie (sehr alte Browser), tut es
 * `Math.random` - für eine Statistik-Kennung reicht das, sie schützt nichts.
 */
export function geraeteKennung(): string {
  const da = lies(KENNUNG_KEY);
  if (da && /^[0-9a-f]{32}$/.test(da)) return da;
  let neu = "";
  try {
    neu = crypto.randomUUID().replace(/-/g, "");
  } catch {
    neu = "";
  }
  if (!/^[0-9a-f]{32}$/.test(neu)) {
    neu = "";
    for (let i = 0; i < 32; i++) neu += Math.floor(Math.random() * 16).toString(16);
  }
  schreib(KENNUNG_KEY, neu);
  return neu;
}

// ── Die Tagesbilanz dieses Geräts ───────────────────────────────────────────

/** Die gespeicherte Gerätebilanz lesen. */
export function geraeteBilanz(): Tagesbilanz[] {
  const roh = lies(BILANZ_KEY);
  if (!roh) return [];
  const out: Tagesbilanz[] = [];
  for (const zeile of roh.split(";")) {
    const f = zeile.split(",");
    out.push({
      tag: zahl(f[0]),
      min: zahl(f[1]),
      chars: zahl(f[2]),
      errors: zahl(f[3]),
      zeilen: zahl(f[4]),
    });
  }
  return out;
}

export function bilanzAlsText(liste: readonly Tagesbilanz[]): string {
  return liste
    .map((t) => [t.tag, t.min, t.chars, t.errors, t.zeilen].map(b36).join(","))
    .join(";");
}

/**
 * Eine abgeschlossene Übungszeile verbuchen - von JEDEM Übenden, mit Konto oder
 * ohne. Dieselbe Rechnung wie die Konto-Bilanz ({@link bilanzErgaenzen}), damit
 * die beiden nicht auseinanderlaufen können.
 */
export function topfVerbuchen(e: TaskEvent): void {
  const bilanz = bilanzErgaenzen(geraeteBilanz(), e);
  if (bilanz.length > MAX_TAGE) bilanz.splice(0, bilanz.length - MAX_TAGE);
  schreib(BILANZ_KEY, bilanzAlsText(bilanz));
}

// ── Der Tastenverlauf ───────────────────────────────────────────────────────

/**
 * Wann standen wie viele Tasten frei? Genau das ist die Frage, an der die
 * Tor-Regeln hängen - zusammen mit der Tagesbilanz ergibt sie „so viele Minuten
 * und so viele Zeichen je neuer Taste, bei diesem Tempo".
 *
 * Gespeichert wird nur, wenn sich die Zahl ÄNDERT: ein Eintrag je Freischaltung.
 */
export function topfTastenVerbuchen(ts: number, anzahlTasten: number): void {
  const roh = lies(TASTEN_KEY) ?? "";
  const zeilen = roh.length > 0 ? roh.split(";") : [];
  const letzte = zeilen.length > 0 ? zeilen[zeilen.length - 1].split(",") : null;
  if (letzte && zahl(letzte[1]) === Math.round(anzahlTasten)) return;
  zeilen.push(`${b36(tagNummer(ts))},${b36(anzahlTasten)}`);
  schreib(TASTEN_KEY, zeilen.join(";"));
}

export function tastenVerlauf(): string {
  return lies(TASTEN_KEY) ?? "";
}

// ── Senden ──────────────────────────────────────────────────────────────────

/**
 * Einmal am Tag an den Server schicken - mehr braucht eine Tages-Statistik
 * nicht, und mehr soll ein Gerät auch nicht dürfen.
 *
 * Schlägt der Aufruf fehl (der Gegenpart ist ohne `TT_TOPF_AKTIV=1`
 * abgeschaltet und antwortet 404), passiert **nichts**: kein Fehler, keine
 * Meldung, kein erneuter Versuch an diesem Tag. Gesammelt wird auf dem Gerät
 * weiter, es geht nichts verloren.
 */
export async function topfSenden(
  stufe: string,
  lang: string,
  jetzt: number = Date.now(),
): Promise<void> {
  const heute = tagNummer(jetzt);
  if (zahl(lies(GESENDET_KEY) ?? "") === heute) return;
  // Den Stempel VOR dem Versuch setzen: Ein abgeschalteter Gegenpart soll nicht
  // bei jeder Runde erneut angeklopft bekommen.
  schreib(GESENDET_KEY, b36(heute));
  const bilanz = geraeteBilanz();
  if (bilanz.length === 0) return;
  try {
    await fetch(TOPF_ROUTE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        geraet: geraeteKennung(),
        program: "tippen",
        stufe,
        lang,
        tage: bilanzAlsText(bilanz),
        tasten: tastenVerlauf(),
      }),
    });
  } catch {
    /* offline oder abgeschaltet - beides kein Fehler */
  }
}
