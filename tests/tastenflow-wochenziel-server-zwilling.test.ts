import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  WOCHENZIEL_GRENZE,
  isoWeekKey,
  kindWochenzielAusFeldern,
  naechsteWocheKey,
  schuljahrVon,
  wochenStart,
  wochenzielGeschichte,
  wochenzielVerlauf,
  type GesperrteZeit,
  type KindWochenziel,
  type KindWochenzielFelder,
  type WochenErgebnis,
} from "@/lib/typing";
import type { TaskEvent } from "@/lib/typing/account";

/**
 * ★★★★★ DER SERVER-ZWILLING: Montag 08:00 WIEN, gerechnet OHNE Zeitzonen-
 * Datenbank (W2, 18.09.2026, `pocketbase/pb_hooks/tt_wochenziel_lib.pb.js`).
 *
 * Der Server läuft in UTC; das Wochenziel-Programm (`wochenziel.ts`) rechnet
 * mit der LOKALEN Zeit des Geräts - für Österreich Europe/Vienna. Diese Datei
 * lädt die goja-Fassung wie eine ECHTE PocketBase-Instanz sie sähe (CommonJS,
 * `new Function`, Muster wie `tests/typing-eventpack.test.ts` für die
 * Ereignis-Packung) und vergleicht sie FELD FÜR FELD mit der TypeScript-
 * Fassung - über beide DST-Wechselwochen 2026 UND 2027 hinweg, nicht nur an
 * einem Stichtag.
 *
 * `process.env.TZ = "Europe/Vienna"` macht die TypeScript-Fassung (die mit
 * `new Date(...)` und dessen LOKALEN Gettern rechnet) im Node-Prozess dieses
 * Tests zur „Referenz aus Wien" - das bildet nach, was ein Gerät in Österreich
 * sähe. Die goja-Fassung rechnet dagegen bewusst OHNE Prozess-Zeitzone (reine
 * UTC-Arithmetik + die feste EU-Sommerzeit-Regel) - genau das, was die echte
 * PocketBase-Instanz auf dem Server tut.
 */

interface GojaWochenzielLib {
  wienOffsetMs: (utcMs: number) => number;
  wochenStartMs: (utcMs: number) => number;
  isoWochenKey: (utcMs: number) => string;
  naechsteWocheKey: (utcMs: number) => string;
  // W5: der volle Wochenziel-Zwilling
  wochenStartVerschobenMs: (startMs: number, wochenVersatz: number) => number;
  kindWochenziel: (felder: unknown) => KindWochenziel;
  wochenErgebnisse: (
    events: readonly TaskEvent[],
    ziel: KindWochenziel,
    vonMs: number,
    bisMs: number,
    gesperrt?: readonly GesperrteZeit[],
  ) => WochenErgebnis[];
  wochenGeschichte: (
    events: readonly TaskEvent[],
    ziel: KindWochenziel,
    jetztMs: number,
    gesperrt?: readonly GesperrteZeit[],
    mindestens?: number,
  ) => WochenErgebnis[];
  erfuellungProzent: (
    wochen: readonly WochenErgebnis[],
    vonWoche?: string,
    bisWoche?: string,
  ) => number | null;
  schuljahrGrenzenMs: (jetztMs: number) => { vonMs: number; bisMs: number };
}

/** Die Hook-Datei so laden, wie goja sie sieht: als CommonJS-Modul. */
function ladeHookLib(pfad: string): GojaWochenzielLib {
  const code = readFileSync(resolve(__dirname, pfad), "utf8");
  const mod = { exports: {} };
  new Function("module", "exports", "require", code)(mod, mod.exports, () => ({}));
  return mod.exports as GojaWochenzielLib;
}
const server = ladeHookLib("../pocketbase/pb_hooks/tt_wochenziel_lib.pb.js");

const VORHERIGE_TZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = "Europe/Vienna";
});
afterAll(() => {
  if (VORHERIGE_TZ === undefined) delete process.env.TZ;
  else process.env.TZ = VORHERIGE_TZ;
});

/** Client-Ergebnis (die Referenz „aus Wien") gegen den Server-Zwilling prüfen. */
function pruefeZeitpunkt(ms: number): void {
  const erwarteterMontag = wochenStart(ms, WOCHENZIEL_GRENZE);
  expect(server.wochenStartMs(ms), `wochenStartMs bei ${new Date(ms).toISOString()}`).toBe(
    erwarteterMontag,
  );
  expect(server.isoWochenKey(ms), `isoWochenKey bei ${new Date(ms).toISOString()}`).toBe(
    isoWeekKey(erwarteterMontag),
  );
  expect(
    server.naechsteWocheKey(ms),
    `naechsteWocheKey bei ${new Date(ms).toISOString()}`,
  ).toBe(naechsteWocheKey(ms));
}

/**
 * Jeder Montag 08:00 (Wien, ECHTE Zeitpunkte über `wochenStart`/`setDate` -
 * dieselbe kalendertag-sichere Technik wie `wocheVerschieben` in
 * `wochenziel.ts`) von Anfang 2026 bis Anfang 2028 - deckt beide
 * DST-Wechselwochen jedes Jahres UND die Jahreswechsel-Wochen
 * (2026-W53/2027-W01, 2027-W52/2028-W01) automatisch mit ab, ohne das
 * Kalenderdatum der Umstellung von Hand auszurechnen.
 */
function alleMontage(): number[] {
  const out: number[] = [];
  let montag = wochenStart(new Date(2026, 0, 1).getTime(), WOCHENZIEL_GRENZE);
  const ende = new Date(2028, 1, 1).getTime();
  while (montag < ende) {
    out.push(montag);
    const d = new Date(montag);
    d.setDate(d.getDate() + 7); // Kalendertage, DST-sicher (wie wocheVerschieben)
    montag = d.getTime();
  }
  return out;
}

describe("★★★★★ Server-Zwilling: Wochenziel-Montag ohne Zeitzonen-Datenbank", () => {
  it("wienOffsetMs: 2 Std. im Sommer, 1 Std. im Winter", () => {
    // Mitten im Sommer/Winter - weit weg von jeder Umstellung.
    expect(server.wienOffsetMs(new Date(2026, 6, 1).getTime())).toBe(2 * 3600000);
    expect(server.wienOffsetMs(new Date(2026, 0, 15).getTime())).toBe(1 * 3600000);
    expect(server.wienOffsetMs(new Date(2027, 6, 1).getTime())).toBe(2 * 3600000);
    expect(server.wienOffsetMs(new Date(2027, 0, 15).getTime())).toBe(1 * 3600000);
  });

  it("trifft für JEDEN Montag 2026/2027 (± rund um 08:00, mitten in der Woche, am Wochenende davor)", () => {
    const montage = alleMontage();
    // Gegenprobe: die Liste ist nicht leer und deckt beide Jahre ab.
    expect(montage.length).toBeGreaterThan(100);

    for (const m of montage) {
      // ★★★ Genau die drei Minuten um die Grenze, die die Regel entscheiden:
      // 07:59 gehört noch der ENDENDEN Woche, 08:00 und 08:01 der NEUEN.
      pruefeZeitpunkt(m - 60_000); // Montag 07:59
      pruefeZeitpunkt(m); // Montag 08:00 (die Grenze selbst)
      pruefeZeitpunkt(m + 60_000); // Montag 08:01
      pruefeZeitpunkt(m - 1); // 1 ms davor
      pruefeZeitpunkt(m + 1); // 1 ms danach
      pruefeZeitpunkt(m + 3 * 3_600_000); // Montagvormittag
      pruefeZeitpunkt(m + 2 * 86_400_000); // Mittwoch derselben Woche
      pruefeZeitpunkt(m + 6 * 86_400_000 + 23 * 3_600_000); // Sonntag kurz vor dem nächsten Montag
    }
  });

  it("Neujahrs-Grenze 2026/2027 (KW 53 ⇄ KW 01) - eigens benannt, obwohl schon in der Schleife enthalten", () => {
    // 28.12.2026 ist ein Montag - die letzte volle Ziel-Woche des Jahres
    // 2026 (KW 53); ihr Montag-08:00-Nachfolger liegt schon 2027 (KW 01).
    const montag2026W53 = wochenStart(new Date(2026, 11, 30, 12, 0, 0).getTime(), WOCHENZIEL_GRENZE);
    pruefeZeitpunkt(montag2026W53 - 60_000);
    pruefeZeitpunkt(montag2026W53);
    pruefeZeitpunkt(montag2026W53 + 60_000);
    pruefeZeitpunkt(montag2026W53 + 6 * 86_400_000 + 23 * 3_600_000); // knapp vor dem Jahreswechsel-Montag
  });
});

/**
 * ════════════════════════════════════════════════════════════════════════
 * W5: DER SERVER-ZWILLING DER GANZEN WOCHENZIEL-AUSWERTUNG
 * ════════════════════════════════════════════════════════════════════════
 * Der Wochenbericht (`tt_weekly_report.pb.js`) muss GENAU das sagen, was die
 * Lehrkraft in „Meine Klassen" sieht - `wochenzielVerlauf`/
 * `kindWochenzielAusFeldern`/`erfuellungProzent` (Client) gegen
 * `wochenErgebnisse`/`kindWochenziel`/`erfuellungProzent` (Server-Zwilling,
 * goja). Diese Suite ist der BEWEIS - nicht eine Behauptung im Kommentar.
 *
 * Ein deterministischer PRNG (mulberry32) macht jeden Lauf reproduzierbar -
 * ein Fehlschlag zeigt immer denselben Fall, egal wie oft man ihn wiederholt.
 */

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

function randInt(rng: () => number, minIncl: number, maxIncl: number): number {
  return minIncl + Math.floor(rng() * (maxIncl - minIncl + 1));
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[randInt(rng, 0, arr.length - 1)];
}

// ⚠️ NICHT `alleMontage()` schon hier beim Laden des Moduls aufrufen: Das
// `beforeAll` oben setzt `process.env.TZ = "Europe/Vienna"` erst, bevor die
// EINZELNEN Tests laufen - beim Laden des Moduls selbst ist die Zeitzone noch
// die des Testläufers. `montageListe()` ruft darum `alleMontage()` jedes Mal
// frisch auf (billig, ~100 Einträge) - immer erst INNERHALB eines Tests.
function montageListe(): number[] {
  return alleMontage();
}

function ev(ts: number, minuten: number, extra: Partial<TaskEvent> = {}): TaskEvent {
  const ms = minuten * 60_000;
  return { ts, lesson: "probe", chars: 20, errors: 1, ms, activeMs: ms, ...extra };
}

/**
 * Eine bunte, zufällige (aber seed-feste) Ereignisliste über
 * [`vonMs` - 21 Tage, `bisMs` + 21 Tage] - der Rand vor dem eigentlichen
 * Bereich ist wichtig für Nachholen (ältere offene Wochen) und für den
 * ersten Zielverlaufs-Abschnitt, der oft VOR `vonMs` liegt.
 *
 * Mischt bewusst: kurze Pausen (bleiben in derselben Sitzung), lange Pausen
 * (> 30 min, neue Sitzung), Ereignisse ohne `activeMs` (Alt-Format, dann
 * zählt `ms`), gelegentliche `__goal__`-Marker (dürfen nirgends zählen) UND
 * an JEDEM Montag im Bereich gezielt 07:59/08:00/08:01-Ereignisse - genau die
 * drei Minuten, die über die Wochenzugehörigkeit entscheiden.
 */
function zufallsEvents(rng: () => number, vonMs: number, bisMs: number): TaskEvent[] {
  const events: TaskEvent[] = [];
  const spanStart = vonMs - 21 * 86_400_000;
  const spanEnd = bisMs + 21 * 86_400_000;
  let ts = spanStart + randInt(rng, 0, 86_400_000);
  const anzahl = randInt(rng, 40, 140);
  for (let i = 0; i < anzahl && ts < spanEnd; i++) {
    const langePause = rng() < 0.4;
    ts += langePause ? randInt(rng, 31 * 60_000, 4 * 86_400_000) : randInt(rng, 0, 25 * 60_000);
    if (ts >= spanEnd) break;
    const minuten = randInt(rng, 1, 30);
    const msWert = minuten * 60_000;
    const mitActiveMs = rng() < 0.85;
    const basis: TaskEvent = {
      ts,
      lesson: "probe",
      chars: randInt(rng, 10, 300),
      errors: randInt(rng, 0, 15),
      ms: msWert,
    };
    events.push(mitActiveMs ? { ...basis, activeMs: msWert } : basis);
    if (rng() < 0.04) {
      events.push({ ts: ts + 1, lesson: "__goal__", chars: 0, errors: 0, ms: 0, minutesGoal: 20 });
    }
  }
  for (const m of montageListe()) {
    if (m < spanStart || m > spanEnd) continue;
    if (rng() < 0.5) events.push(ev(m - 60_000, randInt(rng, 1, 20))); // Montag 07:59
    if (rng() < 0.5) events.push(ev(m, randInt(rng, 1, 20))); // Montag 08:00 - die Grenze selbst
    if (rng() < 0.3) events.push(ev(m + 60_000, randInt(rng, 1, 20))); // Montag 08:01
  }
  return events;
}

/** Zufällige (seed-feste) Sperr-Zeiträume rund um [`vonMs`, `bisMs`]. */
function zufallsGesperrt(rng: () => number, vonMs: number, bisMs: number): GesperrteZeit[] {
  const anzahl = randInt(rng, 0, 3);
  const out: GesperrteZeit[] = [];
  for (let i = 0; i < anzahl; i++) {
    const abMs = randInt(rng, vonMs - 14 * 86_400_000, bisMs);
    const bisMsWert = abMs + randInt(rng, 30 * 60_000, 2 * 86_400_000);
    out.push({ abMs, bisMs: bisMsWert });
  }
  return out;
}

/** Zufällige (seed-feste) rohe Kind-Felder - deckt beide Wege ab: Minuten-Verlauf UND Alt-Felder (Lazy-Umrechnung). */
function zufallsFelder(rng: () => number, wochenSchluessel: readonly string[]): KindWochenzielFelder {
  const weg = rng();
  if (weg < 0.15) {
    // Kein Ziel überhaupt.
    return {};
  }
  if (weg < 0.4) {
    // Alt-Felder - lazy Umrechnung ab UMSTELLUNG_WOCHE.
    const goalMinutes = pick(rng, [0, 10, 15, 20, 30]);
    const goalUnits = pick(rng, [0, 1, 2, 3, 5]);
    return { goalMinutes, goalUnits };
  }
  // Minuten-Verlauf mit 1-3 Abschnitten (Zieländerungen) - manchmal mit einem
  // ungültigen Eintrag dazwischen (muss beim Filtern verschwinden).
  const anzahl = randInt(rng, 1, 3);
  const schluessel = [...wochenSchluessel].sort();
  const verlauf: unknown[] = [];
  for (let i = 0; i < anzahl; i++) {
    const ab = pick(rng, schluessel);
    const minuten = pick(rng, [0, 10, 15, 20, 30, 45, 60, 90]);
    verlauf.push({ ab, minuten });
  }
  if (rng() < 0.2) {
    // Ein ungültiger Eintrag - muss von istGueltigerZielAbschnitt gefiltert werden.
    verlauf.push(
      pick(rng, [{ ab: "nicht-iso", minuten: 30 }, { ab: "2026-W99", minuten: -5 }, { minuten: 30 }, null]),
    );
  }
  return { wochenzielVerlauf: verlauf };
}

/** Vergleicht zwei WochenErgebnis-Listen: Text-/Bool-Felder exakt, Minuten-Felder auf 1e-9 genau. */
function erwarteGleicheWochen(client: readonly WochenErgebnis[], server: readonly WochenErgebnis[]): void {
  expect(server.length, "Anzahl Wochen").toBe(client.length);
  for (let i = 0; i < client.length; i++) {
    const c = client[i];
    const s = server[i];
    const stelle = `Woche ${c.woche} (Index ${i})`;
    expect(s.woche, stelle).toBe(c.woche);
    expect(s.startMs, stelle).toBe(c.startMs);
    expect(s.erlassen, stelle).toBe(c.erlassen);
    expect(s.zielwoche, stelle).toBe(c.zielwoche);
    expect(s.ziel, stelle).toBeCloseTo(c.ziel, 9);
    expect(s.geuebt, stelle).toBeCloseTo(c.geuebt, 9);
    expect(s.erfuellt, stelle).toBeCloseTo(c.erfuellt, 9);
    expect(s.offen, stelle).toBeCloseTo(c.offen, 9);
  }
}

describe("★★★★★ Server-Zwilling: kindWochenziel (Lazy-Umrechnung + Zielverlauf-Validierung)", () => {
  it("stimmt mit kindWochenzielAusFeldern über 300 zufällige Kind-Felder überein", () => {
    const rng = mulberry32(20260919);
    const wochenSchluessel = montageListe().map((m) => isoWeekKey(m));
    for (let i = 0; i < 300; i++) {
      const felder = zufallsFelder(rng, wochenSchluessel);
      const clientZiel = kindWochenzielAusFeldern(felder);
      const serverZiel = server.kindWochenziel(felder);
      expect(serverZiel.verlauf, `Fall ${i}: ${JSON.stringify(felder)}`).toEqual(clientZiel.verlauf);
      expect(serverZiel.wochen).toEqual(clientZiel.wochen);
      expect(serverZiel.nachholen).toBe(clientZiel.nachholen);
      expect(serverZiel.erlasseneWochen).toEqual(clientZiel.erlasseneWochen);
      expect(serverZiel.zurueckgesetztAb).toBe(clientZiel.zurueckgesetztAb);
    }
  });
});

describe("★★★★★ Server-Zwilling: wochenErgebnisse (der ganze Wochen-Bericht eines Kindes)", () => {
  it("stimmt mit wochenzielVerlauf über 60 zufällige Szenarien 2026-2028 überein (Minuten auf 1e-9 genau)", () => {
    const rng = mulberry32(1809202601);
    const montage = montageListe();
    for (let szenario = 0; szenario < 60; szenario++) {
      const startIdx = randInt(rng, 0, montage.length - 40);
      const laenge = randInt(rng, 6, 35);
      const vonMs = montage[startIdx];
      const bisMs = montage[startIdx + laenge];
      const wochenSchluessel = montage
        .slice(Math.max(0, startIdx - 8), startIdx + laenge + 8)
        .map((m) => isoWeekKey(m));

      const felder = zufallsFelder(rng, wochenSchluessel);
      const ziel = kindWochenzielAusFeldern(felder);
      // Zusätzlich Zielwochen-Auswahl, Erlass, Reset, Nachholen zufällig aufsetzen -
      // unabhängig vom Verlauf, wie es echte Kind-Datensätze auch tun.
      ziel.wochen = rng() < 0.7 ? [] : wochenSchluessel.filter(() => rng() < 0.6);
      ziel.nachholen = rng() < 0.5;
      ziel.erlasseneWochen = wochenSchluessel.filter(() => rng() < 0.08);
      ziel.zurueckgesetztAb = rng() < 0.25 ? pick(rng, wochenSchluessel) : undefined;

      const events = zufallsEvents(rng, vonMs, bisMs);
      const gesperrt = zufallsGesperrt(rng, vonMs, bisMs);

      const clientRows = wochenzielVerlauf(events, ziel, vonMs, bisMs, gesperrt);
      const serverRows = server.wochenErgebnisse(events, ziel, vonMs, bisMs, gesperrt);
      erwarteGleicheWochen(clientRows, serverRows);
    }
  });

  it("stimmt mit wochenzielGeschichte überein (voller Verlauf + `mindestens`, wie die Mail ihn braucht)", () => {
    const rng = mulberry32(1809202602);
    const montage = montageListe();
    for (let szenario = 0; szenario < 30; szenario++) {
      const startIdx = randInt(rng, 10, montage.length - 40);
      const laenge = randInt(rng, 6, 30);
      const vonMs = montage[startIdx];
      const bisMs = montage[startIdx + laenge];
      const jetztMs = bisMs + randInt(rng, 0, 4) * 7 * 86_400_000;
      const mindestens = montage[startIdx - randInt(rng, 0, 10)];
      const wochenSchluessel = montage
        .slice(startIdx - 10, startIdx + laenge + 4)
        .map((m) => isoWeekKey(m));

      const felder = zufallsFelder(rng, wochenSchluessel);
      const ziel = kindWochenzielAusFeldern(felder);
      ziel.nachholen = rng() < 0.5;

      const events = zufallsEvents(rng, vonMs, bisMs);
      const gesperrt = zufallsGesperrt(rng, vonMs, bisMs);

      const clientRows = wochenzielGeschichte(events, ziel, jetztMs, gesperrt, mindestens);
      const serverRows = server.wochenGeschichte(events, ziel, jetztMs, gesperrt, mindestens);
      erwarteGleicheWochen(clientRows, serverRows);
    }
  });
});

describe("★★★★★ Server-Zwilling: schuljahrGrenzenMs (fest 1.8.-31.7., wie jahreskarte.ts)", () => {
  it("trifft schuljahrVon an vielen Punkten quer über 2026-2028", () => {
    const punkte = [
      new Date(2026, 0, 15).getTime(),
      new Date(2026, 6, 31, 23, 59, 59).getTime(),
      new Date(2026, 7, 1, 0, 0, 0).getTime(),
      new Date(2026, 7, 1, 0, 0, 1).getTime(),
      new Date(2026, 8, 19).getTime(),
      new Date(2027, 0, 1).getTime(),
      new Date(2027, 6, 31, 23, 59, 59).getTime(),
      new Date(2027, 7, 1, 0, 0, 0).getTime(),
      new Date(2027, 11, 24).getTime(),
    ];
    for (const p of punkte) {
      const client = schuljahrVon(p);
      const s = server.schuljahrGrenzenMs(p);
      expect(s.vonMs, `Schuljahr-Anfang bei ${new Date(p).toISOString()}`).toBe(client.vonMs);
      expect(s.bisMs, `Schuljahr-Ende bei ${new Date(p).toISOString()}`).toBe(client.bisMs);
    }
  });
});
