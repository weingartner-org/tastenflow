/**
 * Z1 (28.09.2026): der ABDRUCK der Server-Wochenrechnung
 * (`pocketbase/pb_hooks/tt_wochenziel_lib.pb.js`).
 *
 * Ein Abdruck ist alles, was die Datei über Wochen, Tage und Daten sagt - an
 * über tausend Zeitpunkten 2026-2028 (jeder Montag, die Minuten um 08:00 in
 * Winter- UND Sommerzeit, beide EU-Umstellungen jedes Jahres), jeder
 * Wochenschlüssel 2026-W01 bis 2028-W05, ein Wochenziel-Szenario über
 * anderthalb Jahre und der Wochenbericht in vier Sprachen.
 *
 * `tests/fixtures/wochengrenze-wien-vor-z1-golden.json` ist der Abdruck der
 * Fassung VOR Z1 (Commit 5753fa53, damals rechnete sie nur Wien). Der Test
 * `tests/tastenflow-wochengrenze-zone.test.ts` legt den Abdruck der heutigen
 * Fassung für „keine Zone", „Europe/Vienna" usw. daneben - er muss Zeichen für
 * Zeichen gleich sein. Neu erzeugen (nur mit Absicht!):
 *
 *     git show 5753fa53:pocketbase/pb_hooks/tt_wochenziel_lib.pb.js > /tmp/alt.pb.js
 *     WOCHENGRENZE_GOLDEN_AUS=/tmp/alt.pb.js npx vitest run tests/tastenflow-wochengrenze-zone.test.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const HOOKS_ORDNER = resolve(__dirname, "../../pocketbase/pb_hooks");

/* eslint-disable @typescript-eslint/no-explicit-any */
export type WzLib = Record<string, (...a: any[]) => any>;

/**
 * Eine Hook-Datei laden, wie goja sie per `require` sähe: CommonJS, mit einem
 * `require`, das weitere Hook-Dateien genauso lädt, und mit `__hooks`.
 */
export function ladeHookQuelle(quelle: string): WzLib {
  const cache = new Map<string, unknown>();
  const verlange = (pfad: string): unknown => {
    if (!cache.has(pfad)) cache.set(pfad, fuehreAus(readFileSync(pfad, "utf8")));
    return cache.get(pfad);
  };
  function fuehreAus(code: string): unknown {
    const mod = { exports: {} as Record<string, unknown> };
    // eslint-disable-next-line no-new-func
    new Function("module", "exports", "require", "__hooks", code)(mod, mod.exports, verlange, HOOKS_ORDNER);
    return mod.exports;
  }
  return fuehreAus(quelle) as WzLib;
}

export function ladeWochenzielLib(): WzLib {
  return ladeHookQuelle(readFileSync(resolve(HOOKS_ORDNER, "tt_wochenziel_lib.pb.js"), "utf8"));
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const M = 60_000;
const H = 3_600_000;
const T = 86_400_000;

/** Montag, 5.1.2026, 08:00 MEZ (= 07:00 UTC) - plus 7 Tage je Woche. */
const BASIS = Date.UTC(2026, 0, 5, 7, 0);
const WOCHEN = 110;
/**
 * Um 07:00 UTC (08:00 MEZ) UND 06:00 UTC (08:00 MESZ) je die Minute davor,
 * die Grenze selbst und die Minute danach - plus Punkte mitten in der Woche.
 */
const VERSAETZE = [-25 * H, -61 * M, -60 * M, -59 * M, -1 * M, 0, 1 * M, 17 * H, 30 * H, 150 * H];

/** Der Abdruck von `wz`, jede Funktion mit `zone` als letztem Argument. */
export function abdruck(wz: WzLib, zone: unknown): unknown {
  const punkte: unknown[] = [];
  for (let w = 0; w < WOCHEN; w++) {
    for (const v of VERSAETZE) {
      const t = BASIS + w * 7 * T + v;
      const ws = wz.wochenStartMs(t, zone);
      const sj = wz.schuljahrGrenzenMs(t, undefined, zone);
      const sj2 = wz.schuljahrGrenzenMs(t, 2, zone);
      punkte.push([
        t,
        ws,
        wz.isoWochenKey(t, zone),
        wz.naechsteWocheKey(t, zone),
        wz.uebungstagSchluesselMs(t, zone),
        wz.wochenStartVerschobenMs(ws, -1, zone),
        wz.wochenStartVerschobenMs(ws, 1, zone),
        sj.vonMs,
        sj.bisMs,
        sj2.vonMs,
        sj2.bisMs,
        wz.fmtTagMonat(t, zone),
        wz.datumEn(t, zone),
        wz.kurzDatumEn(t, zone),
        wz.datumFr(t, zone),
        wz.kurzDatumFr(t, zone),
        wz.datumEs(t, zone),
        wz.kurzDatumEs(t, zone),
      ]);
    }
  }

  const schluessel: unknown[] = [];
  for (const jahr of [2026, 2027, 2028]) {
    for (let w = 1; w <= 53; w++) {
      const key = `${jahr}-W${w < 10 ? "0" + w : w}`;
      schluessel.push([key, wz.wochenStartFuerSchluessel(key, zone)]);
    }
  }

  // Ein Kind über anderthalb Jahre: Sitzungen, lange Pausen, Alt-Ereignisse
  // ohne `activeMs`, Ziel-Marker, Übung VOR dem Tippzeit-Stichtag (7.7.2026)
  // und an jedem zweiten Montag Ereignisse genau um 08:00 MEZ/MESZ.
  const rng = mulberry32(28092026);
  const events: Record<string, unknown>[] = [];
  let ts = Date.UTC(2026, 5, 20, 9, 0);
  const ende = Date.UTC(2027, 11, 20);
  while (ts < ende) {
    ts += rng() < 0.4 ? 31 * M + Math.floor(rng() * 3 * T) : Math.floor(rng() * 25 * M);
    const ms = (1 + Math.floor(rng() * 30)) * M;
    const e: Record<string, unknown> = { ts, lesson: "u1", chars: 50, errors: 2, ms };
    if (rng() < 0.85) e.activeMs = ms;
    events.push(e);
    if (rng() < 0.03) events.push({ ts: ts + 1, lesson: "__goal__", chars: 0, errors: 0, ms: 0 });
  }
  for (let w = 26; w < 104; w += 2) {
    for (const v of [-61 * M, -60 * M, -59 * M, -1 * M, 0, 1 * M]) {
      events.push({ ts: BASIS + w * 7 * T + v, lesson: "u1", chars: 10, errors: 0, ms: 5 * M, activeMs: 5 * M });
    }
  }
  const ziel = wz.kindWochenziel({
    wochenzielVerlauf: [
      { ab: "2026-W30", minuten: 60 },
      { ab: "2027-W10", minuten: 45 },
    ],
    goalCatchUp: true,
    goalExcusedWeeks: ["2026-W40", "2027-W02"],
    goalWeeks: [],
  });
  const gesperrt = [
    { abMs: Date.UTC(2026, 8, 15, 8), bisMs: Date.UTC(2026, 8, 15, 9) },
    { abMs: Date.UTC(2027, 2, 29, 5), bisMs: Date.UTC(2027, 2, 29, 7) },
  ];
  const tagesUebung = wz.buildDayPractice(events, zone);
  const tage = Object.keys(tagesUebung)
    .sort()
    .map((k) => [k, tagesUebung[k]]);
  const ergebnisse = wz.wochenErgebnisse(events, ziel, Date.UTC(2026, 6, 13), Date.UTC(2027, 11, 20), gesperrt, zone);
  const geschichte = wz.wochenGeschichte(events, ziel, Date.UTC(2027, 5, 1), gesperrt, Date.UTC(2026, 8, 1), zone);
  const wochenSummen = [0, 20, 40, 60, 75].map((w) => {
    const start = wz.wochenStartMs(BASIS + w * 7 * T + 3 * T, zone);
    return [start, wz.minutenDerWoche(tagesUebung, start, zone), wz.tageInWoche(tagesUebung, start, zone)];
  });
  const anfaenge = wz.wochenAnfaengeZwischen(Date.UTC(2026, 0, 1), Date.UTC(2028, 0, 1), zone);

  const berichte: unknown[] = [];
  for (const wocheStartMs of [Date.UTC(2026, 0, 12, 7), Date.UTC(2026, 8, 14, 6), Date.UTC(2027, 2, 22, 7)]) {
    for (const ort of [false, true]) {
      const daten: Record<string, unknown> = {
        klasse: "3B & <Co>",
        wocheStartMs,
        zeilen: [
          { name: "Lena", geuebtMin: 63.4, tage: 4, treffsicherheit: "96 %", stufe: "5", hatZiel: true, zielwoche: true, erlassen: false, zielMin: 60, erfuelltMin: 60, offenMin: 0, schuljahrAnteil: 0.87, nachholenOffenMin: null },
          { name: "Jonas", geuebtMin: 25, tage: 2, treffsicherheit: null, stufe: null, hatZiel: true, zielwoche: true, erlassen: false, zielMin: 60, erfuelltMin: 25, offenMin: 35, schuljahrAnteil: null, nachholenOffenMin: 35 },
          { name: "Mira", geuebtMin: 0, tage: 0, treffsicherheit: null, stufe: "-", hatZiel: false, zielwoche: false, erlassen: false, zielMin: 0, erfuelltMin: 0, offenMin: 0, schuljahrAnteil: null, nachholenOffenMin: null },
        ],
        klassenLink: "https://tastenflow.org/meine-klasse?klasse=3B&app=tippen",
        gesperrtMs: 90 * M,
        fussHtml: "<p>Fuss</p>",
        zeitzone: zone,
      };
      if (ort) {
        daten.ortVon = { jahr: 2026, monat0: 8, tag: 14, stunde: 8, minute: 0, wochentag: 0, lokal: true };
        daten.ortBis = { jahr: 2026, monat0: 8, tag: 21, stunde: 8, minute: 0, wochentag: 0, lokal: true };
      }
      for (const sprache of [undefined, "en", "fr", "es"]) berichte.push(wz.berichtHtml(daten, sprache));
    }
  }

  return { punkte, schluessel, tage, ergebnisse, geschichte, wochenSummen, anfaenge, berichte };
}
