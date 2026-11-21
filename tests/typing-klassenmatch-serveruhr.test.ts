/**
 * ★★★★★ WÄCHTER ÜBER DEN UHR-VERSATZ IM KLASSENMATCH (11.09.2026, E6b).
 *
 * ── Der Befund ──────────────────────────────────────────────────────────────
 * `startMs` und `endeMs` kommen vom Server - verglichen wurden sie bis zum
 * 11.09.2026 gegen `Date.now()` des Geräts. Der Prüfer hat durchgerechnet, was
 * das bei fünf Sekunden Geräte-Versatz kostet: **ein Countdown von fünf statt
 * zehn Sekunden**, ab zehn Sekunden gar keiner mehr, und ein Ende, das um
 * Sekunden neben dem der anderen liegt. Kinder, die nebeneinander sitzen,
 * hörten „los" zu verschiedenen Zeiten.
 *
 * ── Was hier geprüft wird ───────────────────────────────────────────────────
 * Die Rechnung selbst (`serverUhr.ts`) und das, worauf es ankommt: Ein Gerät,
 * dessen Uhr fünf Sekunden vorgeht, und eines, das fünf Sekunden nachgeht,
 * sehen **denselben Countdown und dasselbe Ende** - auf eine halbe Sekunde.
 *
 * ⚠️ Die Zeit ist gestellt (`vi.setSystemTime`), und zwar als GERÄTE-Uhr: Der
 * Server läuft in diesen Fällen auf `ECHT`, das Gerät auf `ECHT + Versatz`.
 * Genau so sieht es in einer Klasse aus, in der ein Notebook falsch geht.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  _serverUhrZuruecksetzen,
  meldeServerZeit,
  serverJetzt,
  serverUhrMessungen,
  serverVersatzMs,
} from "@/lib/typing/serverUhr";
import { MATCH_COUNTDOWN_MS, MATCH_DAUER_MS } from "@/lib/typing/klassenmatch";

/** Die echte Zeit, auf der der Server läuft (ein fester Augenblick). */
const ECHT = Date.UTC(2026, 8, 11, 8, 30, 0);

/** So lange braucht eine Anfrage in eine Richtung (ms) - Schul-WLAN. */
const NETZ_MS = 60;

/** Die Uhr des Geräts stellen: `versatz` > 0 heisst „geht vor". */
function geraeteUhr(versatzMs: number): void {
  vi.setSystemTime(new Date(ECHT + versatzMs));
}

/**
 * Einen Schreibvorgang auf die eigene Stand-Zeile nachstellen: Das Gerät sendet
 * bei `t0`, der Server stempelt `NETZ_MS` später (mit SEINER Uhr), die Antwort
 * ist nach weiteren `NETZ_MS` da.
 */
function standGeschrieben(): void {
  const t0 = Date.now(); // Geräte-Uhr - die Uhr muss vorher gestellt sein
  const serverStempel = new Date(ECHT + NETZ_MS).toISOString();
  const t1 = t0 + 2 * NETZ_MS;
  meldeServerZeit(serverStempel, t0, t1);
}

beforeEach(() => {
  vi.useFakeTimers();
  _serverUhrZuruecksetzen();
  geraeteUhr(0);
});

afterEach(() => {
  vi.useRealTimers();
  _serverUhrZuruecksetzen();
});

describe("(a) Der Versatz wird aus der Antwort des Servers gemessen", () => {
  it("★★★ erkennt ein Gerät, das fünf Sekunden VORGEHT", () => {
    geraeteUhr(5_000);
    standGeschrieben();
    // Die Server-Uhr geht gegen die Geräte-Uhr um fünf Sekunden NACH.
    expect(serverVersatzMs()).toBeGreaterThan(-5_100);
    expect(serverVersatzMs()).toBeLessThan(-4_900);
  });

  it("★★★ erkennt ein Gerät, das fünf Sekunden NACHGEHT", () => {
    geraeteUhr(-5_000);
    standGeschrieben();
    expect(serverVersatzMs()).toBeGreaterThan(4_900);
    expect(serverVersatzMs()).toBeLessThan(5_100);
  });

  it("★★ rechnet die Antwortzeit heraus, statt sie als Versatz zu verbuchen", () => {
    // Gleiche Uhren, aber eine Sekunde Netzweg: Der naive Weg (nur `t1`) ergäbe
    // hier einen halben Versatz von 500 ms. Die Mitte aus t0 und t1 ergibt 0.
    const t0 = Date.now();
    meldeServerZeit(new Date(ECHT + 500).toISOString(), t0, t0 + 1_000);
    expect(Math.abs(serverVersatzMs())).toBeLessThanOrEqual(1);
  });

  it("★★★ wirft den Ausreisser weg - der MEDIAN der letzten drei zählt", () => {
    geraeteUhr(5_000);
    standGeschrieben();
    // Eine hängende Anfrage: Die Antwort kommt erst nach vier Sekunden, und
    // zwar einseitig (der Server hat früh gestempelt).
    const t0 = Date.now();
    meldeServerZeit(new Date(ECHT + NETZ_MS).toISOString(), t0, t0 + 4_000);
    standGeschrieben();
    expect(serverUhrMessungen()).toBe(3);
    // Der Ausreisser läge bei etwa -7 s; der Median bleibt bei -5 s.
    expect(serverVersatzMs()).toBeGreaterThan(-5_100);
    expect(serverVersatzMs()).toBeLessThan(-4_900);
  });

  it("★★ merkt sich nur die letzten drei Messungen", () => {
    for (let i = 0; i < 6; i += 1) standGeschrieben();
    expect(serverUhrMessungen()).toBe(3);
  });
});

describe("(b) Wehrhaft: ohne Messung bleibt alles wie vorher", () => {
  it("★★★ hat ohne eine einzige Antwort den Versatz 0", () => {
    expect(serverVersatzMs()).toBe(0);
    expect(serverJetzt()).toBe(Date.now());
  });

  it("verwirft, was kein Zeitstempel ist", () => {
    const t0 = Date.now();
    for (const unsinn of [undefined, null, "", "morgen", 0, -1, {}]) {
      meldeServerZeit(unsinn, t0, t0 + 20);
    }
    expect(serverUhrMessungen()).toBe(0);
    expect(serverVersatzMs()).toBe(0);
  });

  it("★★ verwirft eine Uhr, die um mehr als einen Tag danebenliegt", () => {
    const t0 = Date.now();
    meldeServerZeit(new Date(ECHT + 3 * 24 * 60 * 60 * 1000).toISOString(), t0, t0 + 20);
    expect(serverUhrMessungen()).toBe(0);
  });

  it("★★★ liest das Format von PocketBase - mit Leerzeichen und ohne „T“", () => {
    // So steht es im Datensatz: „2026-09-11 08:30:00.060Z".
    const t0 = Date.now();
    meldeServerZeit("2026-09-11 08:30:00.060Z", t0, t0 + 2 * NETZ_MS);
    expect(serverUhrMessungen()).toBe(1);
    expect(Math.abs(serverVersatzMs())).toBeLessThanOrEqual(1);
  });

  it("hängt die Zeitzone an, wenn sie fehlt (der Server stempelt in UTC)", () => {
    const t0 = Date.now();
    meldeServerZeit("2026-09-11 08:30:00.060", t0, t0 + 2 * NETZ_MS);
    expect(serverUhrMessungen()).toBe(1);
    expect(Math.abs(serverVersatzMs())).toBeLessThanOrEqual(1);
  });
});

describe("(c) Worauf es ankommt: derselbe Countdown und dasselbe Ende", () => {
  /** Die Zeiten, die der Server beim „Starten" setzt - für ALLE dieselben. */
  const startMs = ECHT + MATCH_COUNTDOWN_MS;
  const endeMs = startMs + MATCH_DAUER_MS;

  /** Was ein Gerät mit diesem Versatz sieht. */
  function sicht(versatzGeraetMs: number) {
    _serverUhrZuruecksetzen();
    geraeteUhr(versatzGeraetMs);
    standGeschrieben(); // beim Beitreten (meldeDabei)
    return {
      ohneAusgleich: startMs - Date.now(),
      countdownMs: startMs - serverJetzt(),
      restMs: endeMs - serverJetzt(),
    };
  }

  it("★★★★★ zeigt bei fünf Sekunden Versatz trotzdem zehn Sekunden Countdown", () => {
    for (const versatz of [5_000, -5_000, 0]) {
      const s = sicht(versatz);
      expect(Math.abs(s.countdownMs - MATCH_COUNTDOWN_MS)).toBeLessThanOrEqual(500);
    }
  });

  it("★★★★★ hätte OHNE Ausgleich fünf statt zehn Sekunden gezählt (der Befund)", () => {
    // Der Gegenbeweis: Genau das war der Fehler, und genau das passiert wieder,
    // wenn jemand hier `Date.now()` statt `serverJetzt()` schreibt.
    expect(sicht(5_000).ohneAusgleich).toBe(5_000);
    expect(sicht(-5_000).ohneAusgleich).toBe(15_000);
  });

  it("★★★★★ lässt zwei verschieden gehende Geräte GEMEINSAM aufhören", () => {
    const vor = sicht(5_000);
    const nach = sicht(-5_000);
    expect(Math.abs(vor.restMs - nach.restMs)).toBeLessThanOrEqual(500);
    // Und beide sehen die volle Spieldauer plus Countdown.
    expect(Math.abs(vor.restMs - (MATCH_COUNTDOWN_MS + MATCH_DAUER_MS))).toBeLessThanOrEqual(500);
  });
});
