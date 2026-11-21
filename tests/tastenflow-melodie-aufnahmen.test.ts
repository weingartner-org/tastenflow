/**
 * ★ Aufnahmen für die Melodie (16.10.2026) - Johannes' Regeln als Wächter:
 *   1. das laufende Lied zuerst, dann das nächste, dann der Rest;
 *   2. verschoben wird höchstens EIN Halbton, sonst spielt der erzeugte Klang;
 *   3. fehlt ein ganzer Satz, fragt nicht jeder Anschlag den Server erneut;
 *   4. die Lade-Anzeige zählt, was das laufende Lied noch braucht.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ERSATZ_MAX,
  _pufferSetzen,
  _samplerZuruecksetzen,
  bereit,
  laden,
  sampleSpielen,
  useMelodieLaden,
} from "@/lib/typing/melodieSampler";

class Param {
  value = 0;
  setValueAtTime() {}
  linearRampToValueAtTime() {}
  exponentialRampToValueAtTime() {}
}
class Knoten {
  gain = new Param();
  playbackRate = new Param();
  buffer: unknown = null;
  connect<T>(z: T): T {
    return z;
  }
  start() {}
  stop() {}
}
const quellen: Knoten[] = [];
const ac = {
  createGain: () => new Knoten(),
  createBufferSource: () => {
    const k = new Knoten();
    quellen.push(k);
    return k;
  },
  decodeAudioData: (d: ArrayBuffer) => Promise.resolve({ duration: 2, laenge: d.byteLength } as unknown as AudioBuffer),
} as unknown as BaseAudioContext;
const puffer = { duration: 2 } as AudioBuffer;

let abrufe: string[] = [];
let index: Record<string, number[]> = {};
let cent: Record<string, Record<string, number>> = {};
/** Solange gesetzt, warten die Ton-Downloads, bis `freigeben()` gerufen wird. */
let sperre: Promise<void> | null = null;
let freigeben: () => void = () => {};

beforeEach(() => {
  _samplerZuruecksetzen();
  quellen.length = 0;
  abrufe = [];
  sperre = null;
  cent = {};
  index = { "klavier-mf": [55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72] };
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      abrufe.push(url);
      const m = /melodie\/([^/]+)\/(index\.json|(\d+)\.mp3)$/.exec(url);
      if (!m || !index[m[1]]) return Promise.resolve({ ok: false, status: 404 });
      if (m[2] === "index.json")
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ toene: index[m[1]], cent: cent[m[1]] }) });
      const antwort = { ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) };
      return sperre ? sperre.then(() => antwort) : Promise.resolve(antwort);
    }),
  );
});

describe("Laden nach Dringlichkeit", () => {
  it("das laufende Lied wird vor dem Rest geholt, auch wenn der Rest zuerst bestellt wurde", async () => {
    const rest = laden(ac, "klavier-mf", [55, 57, 59, 69, 71, 72], 2);
    const lied = laden(ac, "klavier-mf", [60, 64, 67], 0);
    await Promise.all([rest, lied]);
    const toene = abrufe.filter((u) => u.endsWith(".mp3")).map((u) => Number(/(\d+)\.mp3$/.exec(u)![1]));
    // Die ersten drei Downloads sind höchstens einer aus dem Rest (er war schon unterwegs) -
    // die Liedtöne stehen alle vor den letzten Resttönen.
    const posLied = [60, 64, 67].map((m) => toene.indexOf(m));
    const posLetzteRest = [69, 71, 72].map((m) => toene.indexOf(m));
    expect(Math.max(...posLied)).toBeLessThan(Math.min(...posLetzteRest));
    expect(bereit("klavier-mf", [55, 60, 64, 67, 72])).toBe(true);
  });

  it("ein nicht aufgenommener Ton wird nicht angefragt", async () => {
    await laden(ac, "klavier-mf", [61], 0);
    expect(abrufe.some((u) => u.endsWith("/61.mp3"))).toBe(false);
  });

  it("ein fehlender Satz wird genau einmal gefragt, nicht bei jedem Anschlag", async () => {
    for (let i = 0; i < 5; i++) await laden(ac, "gibts-nicht", [60], 0);
    expect(abrufe.filter((u) => u.includes("gibts-nicht")).length).toBe(1);
  });

  it("die Anzeige zählt die offenen Töne des laufenden Lieds und geht auf null", async () => {
    sperre = new Promise<void>((r) => (freigeben = r));
    const p = laden(ac, "klavier-mf", [60, 64, 67], 0);
    await new Promise((r) => setTimeout(r, 0));
    const waehrend = useMelodieLaden.getState().offen;
    freigeben();
    await p;
    expect(waehrend).toBeGreaterThan(0);
    expect(useMelodieLaden.getState().offen).toBe(0);
  });
});

describe("Spielen: genau, sonst höchstens ein Halbton", () => {
  it("genau der Ton: keine Verschiebung", () => {
    _pufferSetzen("klavier-mf", 60, puffer);
    expect(sampleSpielen(ac, {} as AudioNode, "klavier-mf", 60, 0, 0.3, 0.5)).not.toBeNull();
    expect(quellen.at(-1)!.playbackRate.value).toBe(0); // nie gesetzt = 1 im echten Browser
  });

  it("Nachbar einen Halbton weg: verschoben, nicht weiter", () => {
    expect(ERSATZ_MAX).toBe(1);
    _pufferSetzen("klavier-mf", 60, puffer);
    expect(sampleSpielen(ac, {} as AudioNode, "klavier-mf", 61, 0, 0.3, 0.5)).not.toBeNull();
    expect(quellen.at(-1)!.playbackRate.value).toBeCloseTo(Math.pow(2, 1 / 12), 6);
    // zwei Halbtöne: KEINE Aufnahme - der erzeugte Klang springt ein
    expect(sampleSpielen(ac, {} as AudioNode, "klavier-mf", 62, 0, 0.3, 0.5)).toBeNull();
  });

  it("Stimmkorrektur: ein zu tief gestimmter Ton wird um seine gemessenen Cent gerade gezogen", async () => {
    cent = { "klavier-mf": { "60": -28, "64": 80 } };
    await laden(ac, "klavier-mf", [60, 64], 0);
    sampleSpielen(ac, {} as AudioNode, "klavier-mf", 60, 0, 0.3, 0.5);
    expect(quellen.at(-1)!.playbackRate.value).toBeCloseTo(Math.pow(2, 28 / 1200), 6);
    // nie mehr als 50 Cent - ein Messfehler darf keinen falschen Ton machen
    sampleSpielen(ac, {} as AudioNode, "klavier-mf", 64, 0, 0.3, 0.5);
    expect(quellen.at(-1)!.playbackRate.value).toBeCloseTo(Math.pow(2, -50 / 1200), 6);
  });
});
