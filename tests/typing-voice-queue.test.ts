/**
 * Warteschlange der Sprachausgabe (`speakQueued`, Tastenflow/Polar-Expedition).
 *
 * Johannes 14.07.: „Die Stimme spricht Textzeilen bei hoher Geschwindigkeit nicht zu
 * Ende." Ursache war, dass jede Ansage die laufende abbrach (`cancel()`) bzw. die
 * Drossel ältere Aufträge verwarf. `speakQueued` bricht NICHTS ab, sondern reiht ein
 * (FIFO) — und lässt höchstens zwei Aufträge warten (der dritte verdrängt den
 * ÄLTESTEN WARTENDEN, nie den laufenden).
 *
 * Geprüft mit einer nachgebauten Sprach-Engine (jsdom hat keine Web-Speech-API):
 * Sie merkt sich die gesprochenen Texte und beendet eine Ansage nur, wenn der Test
 * es sagt — so ist „läuft noch" von „ist fertig" sauber unterscheidbar.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

class FakeUtterance {
  text: string;
  rate = 1;
  pitch = 1;
  volume = 1;
  lang = "";
  voice: SpeechSynthesisVoice | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

const spokenTexts: string[] = [];
let running: FakeUtterance | null = null;
let cancelCalls = 0;

const fakeSynth = {
  speaking: false,
  pending: false,
  paused: false,
  getVoices: () => [] as SpeechSynthesisVoice[],
  speak(u: FakeUtterance) {
    if (u.volume === 0) return; // die lautlose Freischalt-Ansage (primeSpeech)
    spokenTexts.push(u.text);
    running = u;
    fakeSynth.speaking = true;
  },
  cancel() {
    cancelCalls += 1;
    running = null;
    fakeSynth.speaking = false;
    fakeSynth.pending = false;
  },
  resume() {},
  pause() {},
  addEventListener() {},
  removeEventListener() {},
};

/** Die laufende Ansage zu Ende sprechen lassen (wie es die echte Engine meldet). */
function finishRunning(): void {
  const u = running;
  running = null;
  fakeSynth.speaking = false;
  u?.onend?.();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;
w.speechSynthesis = fakeSynth;
w.SpeechSynthesisUtterance = FakeUtterance;

// Erst NACH dem Stub laden — voice.ts prüft `"speechSynthesis" in window`.
const { cancelQueued, queuedCount, speakQueued, useVoice } = await import(
  "../src/lib/typing/voice"
);

// Die Uhr läuft über die Tests hinweg NACH VORN (voice.ts merkt sich modulweit den
// Zeitpunkt des letzten Engine-Auftrags für die Drossel — mit einer je Test neu
// gestellten Uhr läge der in der „Zukunft" und würde alles verzögern).
let clock = Date.now();

beforeEach(() => {
  vi.useFakeTimers();
  clock += 60_000;
  vi.setSystemTime(clock);
  spokenTexts.length = 0;
  running = null;
  cancelCalls = 0;
  fakeSynth.speaking = false;
  fakeSynth.pending = false;
  useVoice.getState().setEnabled(true); // Vorlesen an (sonst schweigt speakQueued)
  cancelQueued();
  cancelCalls = 0;
  spokenTexts.length = 0;
});

afterEach(() => {
  cancelQueued();
  useVoice.getState().setEnabled(false);
  vi.useRealTimers();
});

/** Drossel/Ruhefenster abwarten (ENGINE_MIN_GAP_MS bzw. LINUX_SETTLE_MS). */
function settle(): void {
  vi.advanceTimersByTime(400);
}

describe("speakQueued — Ansagen werden zu Ende gesprochen (FIFO)", () => {
  it("spricht den ersten Auftrag sofort und bricht dafür nichts ab", () => {
    speakQueued("eins");
    settle();
    expect(spokenTexts).toEqual(["eins"]);
    expect(cancelCalls).toBe(0); // KEIN cancel — das war der Fehler (geköpfte Sätze)
  });

  it("schneidet die laufende Ansage nicht ab, sondern reiht sich dahinter ein", () => {
    speakQueued("eins");
    settle();
    speakQueued("zwei");
    settle();
    // „eins" läuft noch → „zwei" wartet, die Engine wurde NICHT abgebrochen.
    expect(spokenTexts).toEqual(["eins"]);
    expect(queuedCount()).toBe(1);
    expect(cancelCalls).toBe(0);

    finishRunning(); // „eins" ist fertig
    settle();
    expect(spokenTexts).toEqual(["eins", "zwei"]);
    expect(queuedCount()).toBe(0);
    expect(cancelCalls).toBe(0);
  });

  it("hält höchstens zwei Wartende — der dritte verdrängt den ältesten Wartenden", () => {
    speakQueued("eins"); // läuft
    settle();
    speakQueued("zwei"); // wartet
    speakQueued("drei"); // wartet
    speakQueued("vier"); // → „zwei" (ältester Wartender) fliegt raus
    expect(queuedCount()).toBe(2);

    finishRunning(); // die LAUFENDE Ansage wurde nie abgeschnitten
    settle();
    finishRunning();
    settle();
    expect(spokenTexts).toEqual(["eins", "drei", "vier"]);
    expect(cancelCalls).toBe(0);
  });

  it("spricht nicht, wenn das Vorlesen ausgeschaltet ist", () => {
    useVoice.getState().setEnabled(false);
    speakQueued("stumm");
    settle();
    expect(spokenTexts).toEqual([]);
    expect(queuedCount()).toBe(0);
  });

  it("cancelQueued leert die Warteschlange und stoppt die Ausgabe", () => {
    speakQueued("eins");
    settle();
    speakQueued("zwei");
    expect(queuedCount()).toBe(1);

    cancelQueued();
    expect(queuedCount()).toBe(0);
    expect(cancelCalls).toBe(1); // laufende Ansage gestoppt
    settle();
    expect(spokenTexts).toEqual(["eins"]); // „zwei" kommt nicht mehr
  });
});
