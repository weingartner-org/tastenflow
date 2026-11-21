/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ STRG MACHT SOFORT STILL - der Wächter
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 04.09.2026: *„egal an welcher Stelle gelesen wird, mit Strg muss es
 * sofort leise werden."*
 *
 * Es ist die Geste jedes Screenreaders (JAWS, NVDA, VoiceOver): Strg schweigt.
 * Fehlt sie, gibt es keinen zweiten Weg - unsere Ansage redet aus, egal wie
 * lang sie ist. Genau das war der Befund vom Vormittag: In der Grundreihe wird
 * jeder Buchstabe einzeln gesagt.
 *
 * ── WAS DIESER WÄCHTER FESTNAGELT ──────────────────────────────────────────
 *
 * 1. Strg allein macht still - ohne dass eine Oberfläche etwas dazutun muss.
 *    Der Zuhörer sitzt am Vorlese-Modul, nicht an einem Bildschirm; sonst wäre
 *    der eine vergessene Bildschirm genau der, auf dem das Kind sitzt.
 * 2. ⚠️ ALTGR IST STRG + ALT. Für `@` (AltGr + Q) meldet Windows `ctrlKey` UND
 *    `altKey`. Wer jede Strg-Kombination stumm schaltet, nimmt einem Kind die
 *    Ansage genau der Zeichen, die es gerade lernt. Die Gegenprobe dazu ist der
 *    Kern dieses Wächters - sie ist die Zeile, die beim „Aufräumen" fällt.
 * 3. Strg schaltet das Vorlesen NICHT AB. Die nächste Ansage spricht wieder,
 *    so wie bei einem Screenreader. Ein Stummschalter, der heimlich den
 *    Schalter umlegt, wäre für ein Kind mit Blindheit eine kaputte App.
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
  addEventListener(): void {}
  removeEventListener(): void {}
}

const spokenTexts: string[] = [];
let cancelCalls = 0;

const fakeSynth = {
  speaking: false,
  pending: false,
  paused: false,
  getVoices: () => [] as SpeechSynthesisVoice[],
  speak(u: FakeUtterance) {
    if (u.volume === 0) return; // die lautlose Freischalt-Ansage (primeSpeech)
    spokenTexts.push(u.text);
    fakeSynth.speaking = true;
  },
  cancel() {
    cancelCalls += 1;
    fakeSynth.speaking = false;
    fakeSynth.pending = false;
  },
  resume() {},
  pause() {},
  addEventListener() {},
  removeEventListener() {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;
w.speechSynthesis = fakeSynth;
w.SpeechSynthesisUtterance = FakeUtterance;

// Erst NACH dem Stub laden — voice.ts prüft `"speechSynthesis" in window`, und
// der Strg-Zuhörer hängt sich beim Laden des Moduls ans Dokument.
const { cancelSpeech, speak, useVoice } = await import("../src/lib/typing/voice");

/** Ruhefenster (150 ms) + Atempause (90 ms) sicher überbrücken. */
function settle(): void {
  vi.advanceTimersByTime(400);
}

/** Eine Taste, so wie der Browser sie meldet. */
function taste(init: KeyboardEventInit): void {
  document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
}

/** Zustand: es wird gerade gesprochen. */
function esSpricht(): void {
  speak("ein langer Satz, der gerade vorgelesen wird");
  settle();
  expect(spokenTexts.length).toBeGreaterThan(0);
  cancelCalls = 0;
}

beforeEach(() => {
  vi.useFakeTimers();
  useVoice.getState().setEnabled(true);
  cancelSpeech();
  cancelCalls = 0;
  spokenTexts.length = 0;
  fakeSynth.speaking = false;
  fakeSynth.pending = false;
});

afterEach(() => {
  useVoice.getState().setEnabled(false);
  vi.useRealTimers();
});

describe("Strg macht sofort still", () => {
  it("★ Strg allein bricht die laufende Ansage ab", () => {
    esSpricht();
    taste({ key: "Control", ctrlKey: true });
    expect(cancelCalls).toBe(1);
    expect(fakeSynth.speaking).toBe(false);
  });

  it("★ auch mitten im Text - egal, an welcher Stelle gelesen wird", () => {
    speak("erster Satz");
    settle();
    speak("zweiter Satz, mitten drin");
    settle();
    cancelCalls = 0;
    taste({ key: "Control", ctrlKey: true });
    expect(cancelCalls).toBe(1);
  });

  it("eine Strg-Kombination (Strg + C) macht ebenfalls still", () => {
    esSpricht();
    taste({ key: "c", ctrlKey: true });
    expect(cancelCalls).toBe(1);
  });

  it("★★★★★ GEGENPROBE AltGr: Strg + Alt ist AltGr und macht NICHT still", () => {
    esSpricht();
    // So meldet Windows AltGr + Q, mit dem ein Kind das @ tippt.
    taste({ key: "@", ctrlKey: true, altKey: true });
    expect(cancelCalls).toBe(0);
    expect(fakeSynth.speaking).toBe(true);
  });

  it("eine gewöhnliche Taste macht über diesen Weg nichts still", () => {
    esSpricht();
    taste({ key: "f" });
    taste({ key: "Shift", shiftKey: true });
    taste({ key: "Alt", altKey: true });
    expect(cancelCalls).toBe(0);
  });

  it("gehaltene Taste: einmal still ist still (kein Dauerfeuer)", () => {
    esSpricht();
    taste({ key: "Control", ctrlKey: true });
    expect(cancelCalls).toBe(1);
    /*
     * ⚠️ Der zweite Druck muss auf eine SPRECHENDE Engine treffen, sonst misst
     * dieser Fall gar nichts: `cancelSpeech` ruft die Engine nur an, wenn dort
     * wirklich etwas läuft - ein zweiter Abbruch bliebe also auch ohne den
     * Wiederholungs-Schutz aus, und der Test wäre grün ohne Grund
     * ([[feedback_gruener_waechter_beweist_was]]).
     */
    fakeSynth.speaking = true;
    taste({ key: "Control", ctrlKey: true, repeat: true });
    taste({ key: "Control", ctrlKey: true, repeat: true });
    expect(cancelCalls).toBe(1);
    expect(fakeSynth.speaking).toBe(true);
  });

  it("★ Strg schaltet das Vorlesen nicht AB - die nächste Ansage spricht wieder", () => {
    esSpricht();
    taste({ key: "Control", ctrlKey: true });
    expect(useVoice.getState().enabled).toBe(true);

    spokenTexts.length = 0;
    settle(); // Atempause nach dem Abbruch
    speak("die nächste Ansage");
    settle();
    expect(spokenTexts).toContain("die nächste Ansage");
  });
});
