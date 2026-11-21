/**
 * Tester (Kind, 13.11.2026, Lernwerkstatt): „Die Lautvorlesen funktion
 * funktioniert mit Kopfhörern verzögert." Bluetooth-Kopfhörer schalten die
 * Leitung ab, sobald nichts mehr klingt; die nächste Ansage wartet dann, bis
 * sie wieder steht. Johannes: „Ist es nicht ohnehin gut, die Bluetooth-
 * Verbindung aufrecht zu erhalten?" ⇒ Ab der ersten Taste hält ein
 * unhörbares Signal die Leitung wach, solange die Seite sichtbar ist.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

class FakeCtx {
  static alle: FakeCtx[] = [];
  state = "suspended";
  sampleRate = 44100;
  destination = {};
  gestartet = 0;
  gain = -1;
  constructor() {
    FakeCtx.alle.push(this);
  }
  resume() {
    this.state = "running";
    return Promise.resolve();
  }
  suspend() {
    this.state = "suspended";
    return Promise.resolve();
  }
  createOscillator() {
    return { frequency: { value: 0 }, connect: () => {}, start: () => void this.gestartet++ };
  }
  createGain() {
    const g = { gain: { value: 1 }, connect: () => {} };
    queueMicrotask(() => (this.gain = g.gain.value));
    return g;
  }
  createBufferSource() {
    return { buffer: null, connect: () => {}, start: () => {} };
  }
  createBuffer() {
    return {};
  }
}

describe("Bluetooth-Leitung wach halten (Tester 13.11.)", () => {
  beforeEach(() => {
    vi.resetModules();
    FakeCtx.alle = [];
    vi.stubGlobal("AudioContext", FakeCtx);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("ab der ersten Taste läuft genau ein unhörbares Signal", async () => {
    const { keepAudioAlive } = await import("@/lib/audioUnlock");
    keepAudioAlive(new (FakeCtx as unknown as typeof AudioContext)());
    const vorher = FakeCtx.alle.length;
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }));
    await Promise.resolve();
    const neu = FakeCtx.alle.slice(vorher);
    expect(neu.length).toBe(1);
    expect(neu[0].state).toBe("running");
    expect(neu[0].gestartet).toBe(1);
    // unhörbar: unter -72 dBFS (dort setzt Chrome das Lautsprecher-Zeichen)
    expect(neu[0].gain).toBeGreaterThan(0);
    expect(20 * Math.log10(neu[0].gain)).toBeLessThan(-72);
  });

  it("verborgene Seite hält die Leitung nicht wach", async () => {
    const { keepAudioAlive } = await import("@/lib/audioUnlock");
    keepAudioAlive(new (FakeCtx as unknown as typeof AudioContext)());
    const vorher = FakeCtx.alle.length;
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    const wach = FakeCtx.alle[vorher];
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(wach.state).toBe("suspended");
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(wach.state).toBe("running");
  });
});
