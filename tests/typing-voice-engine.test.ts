/**
 * Engine-Schutz der Sprachausgabe (Tastenflow) — Regressionstests zum
 * wiederkehrenden Bug-Report „App friert ein, nur Neuladen hilft" (nacheinander
 * Brave/Linux, Brave/macOS, iOS): Ein cancel()+speak()-Sturm im Anschlagtakt
 * verklemmt die Sprach-Engines aller Plattformen; für Kinder, die auf die
 * Stimme angewiesen sind, ist eine dauerhaft stumme Stimme eine eingefrorene App.
 *
 * Gepinnt wird (voice.ts):
 *   1. Ruhefenster: schnelles Tippen erzeugt KEINE Engine-Flut — nur die
 *      jüngste Ansage überlebt, höchstens ein cancel je Schwall.
 *   2. Atempause: nach einem echten cancel() folgt speak() NIE synchron
 *      (dokumentierter Verschlucker auf Chromium/WebKit).
 *   3. Hänger-Wächter überall (nicht mehr nur Linux): Eine stumme Engine wird
 *      je Hänger per cancel() „entstopft"; nach 3 Hängern in Folge schaltet
 *      sich das Vorlesen sichtbar aus (Live-Region übernimmt).
 *   4. „speaking hängt für immer"-Wedge (Chromium 130+): erkannt über den
 *      Sprechdauer-Deckel, geheilt per cancel().
 *   5. Hintergrund-Wechsel (iOS-Verklemmer): beim Verstecken der Seite wird
 *      laufendes Sprechen sauber abgebrochen.
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
/** Simuliert eine stumme (verklemmte) Engine: speak() startet nie `speaking`. */
let engineMute = false;
/** Simuliert den Chromium-Wedge: `speaking` bleibt true, cancel() räumt nicht. */
let speakingStuck = false;

const fakeSynth = {
  speaking: false,
  pending: false,
  paused: false,
  getVoices: () => [] as SpeechSynthesisVoice[],
  speak(u: FakeUtterance) {
    if (u.volume === 0) return; // die lautlose Freischalt-Ansage (primeSpeech)
    if (engineMute) return; // verklemmt: nimmt an, spricht aber nie
    spokenTexts.push(u.text);
    fakeSynth.speaking = true;
  },
  cancel() {
    cancelCalls += 1;
    if (!speakingStuck) fakeSynth.speaking = false;
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

// Erst NACH dem Stub laden — voice.ts prüft `"speechSynthesis" in window`.
const { cancelSpeech, speak, useVoice } = await import("../src/lib/typing/voice");

// Die Uhr läuft über die Tests hinweg NACH VORN (voice.ts merkt sich modulweit
// den Zeitpunkt des letzten Engine-Auftrags fürs Ruhefenster).
let clock = Date.now();
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.useFakeTimers();
  clock += 120_000;
  vi.setSystemTime(clock);
  spokenTexts.length = 0;
  cancelCalls = 0;
  engineMute = false;
  speakingStuck = false;
  fakeSynth.speaking = false;
  fakeSynth.pending = false;
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  // setEnabled(true) ruft primeSpeech → hebt eine frühere Stilllegung auf.
  useVoice.getState().setEnabled(true);
  cancelSpeech();
  cancelCalls = 0;
  spokenTexts.length = 0;
});

afterEach(() => {
  cancelSpeech();
  useVoice.getState().setEnabled(false);
  warnSpy.mockRestore();
  vi.useRealTimers();
});

/** Ruhefenster (150 ms) + Atempause (90 ms) sicher überbrücken. */
function settle(): void {
  vi.advanceTimersByTime(400);
}

describe("Ruhefenster — keine Engine-Flut beim schnellen Tippen", () => {
  it("einzelne Ansage bei stiller Engine spricht sofort (keine künstliche Latenz)", () => {
    speak("f");
    expect(spokenTexts).toEqual(["f"]); // synchron, ohne Timer-Vorlauf
    expect(cancelCalls).toBe(0);
  });

  it("ein Anschlag-Schwall erreicht die Engine höchstens zweimal (erste + jüngste Ansage)", () => {
    speak("f"); // Engine still → spricht sofort
    // 8 weitere Anschläge im 60-ms-Takt — viel schneller als das Ruhefenster.
    for (const ch of ["j", "f", "j", "f", "j", "f", "j", "x"]) {
      vi.advanceTimersByTime(60);
      speak(ch);
    }
    settle();
    // Früher: je Anschlag ein cancel+speak (die Flut, die die Engines verklemmt).
    // Jetzt: nur die erste und die JÜNGSTE Ansage, dazwischen Funkstille.
    expect(spokenTexts).toEqual(["f", "x"]);
    expect(cancelCalls).toBe(1); // einmal die laufende erste Ansage abgelöst
  });

  it("nach einem echten cancel() folgt speak() nie synchron (Atempause)", () => {
    speak("eins");
    expect(spokenTexts).toEqual(["eins"]); // läuft (fake: speaking=true)
    vi.advanceTimersByTime(200); // Ruhefenster vorbei, Engine spricht noch
    speak("zwei");
    // „zwei" muss die laufende Ansage ablösen — aber NICHT im selben Tick.
    vi.advanceTimersByTime(150); // Ruhefenster: Auftrag wird abgesetzt → cancel
    expect(cancelCalls).toBe(1);
    expect(spokenTexts).toEqual(["eins"]); // Atempause läuft noch
    vi.advanceTimersByTime(90); // Atempause (CANCEL_GAP_MS) vorbei
    expect(spokenTexts).toEqual(["eins", "zwei"]);
  });
});

describe("Hänger-Wächter — Selbstheilung und Notbremse (alle Plattformen)", () => {
  it("eine stumme Engine wird je Hänger per cancel() entstopft, nach 3 Hängern schaltet sich Vorlesen aus", () => {
    engineMute = true;
    for (let i = 0; i < 3; i++) {
      speak(`versuch ${i + 1}`);
      vi.advanceTimersByTime(3200); // STALL_MS abwarten → Hänger zählt
    }
    // Je Hänger ein Selbstheilungs-cancel + der Abschluss-cancel der Notbremse.
    expect(cancelCalls).toBeGreaterThanOrEqual(3);
    expect(useVoice.getState().enabled).toBe(false); // Schalter sichtbar aus
    expect(warnSpy).toHaveBeenCalled();
  });

  it("Nutzer-Geste (Vorlesen an) gibt einer stillgelegten Engine eine neue Chance", () => {
    engineMute = true;
    for (let i = 0; i < 3; i++) {
      speak("stumm");
      vi.advanceTimersByTime(3200);
    }
    expect(useVoice.getState().enabled).toBe(false);
    engineMute = false; // Engine hat sich gefangen
    useVoice.getState().setEnabled(true); // Geste → primeSpeech → neue Chance
    vi.advanceTimersByTime(200);
    speak("wieder da");
    settle();
    expect(spokenTexts).toContain("wieder da");
  });

  it("erkennt den Wedge (speaking hängt für immer) über den Sprechdauer-Deckel", () => {
    speakingStuck = true;
    speak("hi"); // Deckel: 4000 ms Grundpuffer + 2 Zeichen × 200 ms
    expect(spokenTexts).toEqual(["hi"]);
    vi.advanceTimersByTime(6000); // weit über jede plausible Sprechdauer
    // Der Ticker hat den Wedge erkannt und per cancel() zu heilen versucht.
    expect(cancelCalls).toBeGreaterThanOrEqual(1);
    expect(useVoice.getState().enabled).toBe(true); // EIN Hänger legt nichts still
  });
});

describe("Hintergrund-Wechsel — der klassische iOS-Verklemmer", () => {
  it("bricht laufendes Sprechen ab, wenn die Seite unsichtbar wird", () => {
    speak("mitten im satz");
    expect(fakeSynth.speaking).toBe(true);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(cancelCalls).toBe(1);
    expect(fakeSynth.speaking).toBe(false);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
});
