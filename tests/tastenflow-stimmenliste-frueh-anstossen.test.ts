/**
 * ★★★★★ WÄCHTER: Die Stimmenliste wird früh angestossen (Punkt 11 aus Testerin
 * Durchgang, `AUFTRAG-2026-09-20-HEIKES-17-PUNKTE.md`).
 *
 * Johannes, wörtlich: *„Weiterhin hat bei den Alphabetreihen einmal die
 * Sprache gewechselt zu Englisch. … War nur an einer Stelle und dann ging es
 * auch deutsch weiter."*
 *
 * Am Code geprüft (`voice.ts`, `stimmeFuer`): Browser laden `s.getVoices()`
 * asynchron nach. Ist die Liste beim ALLERERSTEN Sprechversuch einer Sitzung
 * noch leer, setzt der Aufrufer nur `u.lang` - welche Stimme die Engine dann
 * nimmt, entscheidet sie selbst (auf einem System mit englischer
 * Standardstimme genau der gemeldete Ausrutscher). Da `stimmeFuer` die Liste
 * bei JEDER Ansage frisch abfragt, trifft jede SPÄTERE Ansage die richtige
 * Stimme von selbst - nur die ALLERERSTE ist gefährdet.
 *
 * Eine Ansage selbst auf `voiceschanged` warten zu lassen, würde die
 * „keine künstliche Latenz"-Garantie der Ansage der NÄCHSTEN TASTE brechen
 * (Befund F21, gepinnt in `typing-voice-engine.test.ts` und
 * `typing-voice-drossel.test.ts`) - dagegen wird hier NICHT gebaut. Stattdessen
 * fragt `voice.ts` die Stimmenliste schon beim IMPORT einmal ab (statt erst
 * beim ersten Sprechversuch) - der Zeitvorsprung zwischen App-Start und der
 * ersten echten Ansage ist der ganze Unterschied.
 *
 * Dieser Wächter prüft GENAU DAS: `getVoices` wird beim Import aufgerufen,
 * BEVOR irgendeine Ansage passiert ist - nicht erst beim ersten `speak()`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

class FakeUtterance {
  constructor(public text: string) {}
}

function baueFakeSynth(anfangsStimmen: SpeechSynthesisVoice[]) {
  const listeners = new Map<string, Set<() => void>>();
  return {
    speaking: false,
    pending: false,
    paused: false,
    getVoices: vi.fn(() => anfangsStimmen),
    speak: vi.fn(),
    cancel: vi.fn(),
    resume: vi.fn(),
    pause: vi.fn(),
    addEventListener: vi.fn((art: string, fn: () => void) => {
      if (!listeners.has(art)) listeners.set(art, new Set());
      listeners.get(art)!.add(fn);
    }),
    removeEventListener: vi.fn((art: string, fn: () => void) => {
      listeners.get(art)?.delete(fn);
    }),
    // Testhilfe: das Nachladen simulieren.
    _feuereVoiceschanged() {
      for (const fn of listeners.get("voiceschanged") ?? []) fn();
    },
    _anzahlListener(art: string) {
      return listeners.get(art)?.size ?? 0;
    },
  };
}

afterEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
});

describe("voice.ts stösst die Stimmenliste beim Import an, wartet aber nicht darauf", () => {
  it("ruft getVoices() SYNCHRON beim Import auf, wenn die Liste noch leer ist", async () => {
    const fakeSynth = baueFakeSynth([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.speechSynthesis = fakeSynth;
    w.SpeechSynthesisUtterance = FakeUtterance;

    await import("../src/lib/typing/voice");

    // ★ Das ist der Kern der Behebung: getVoices() wurde schon beim Laden des
    // Moduls aufgerufen - nicht erst, wenn ein Kind die erste Taste drückt.
    expect(fakeSynth.getVoices).toHaveBeenCalled();
    // Und weil die Liste noch leer war, hängt jetzt ein Zuhörer auf
    // "voiceschanged", der beim Nachladen einmalig Bescheid weiss.
    expect(fakeSynth.addEventListener).toHaveBeenCalledWith(
      "voiceschanged",
      expect.any(Function),
    );
  });

  it("registriert KEINEN voiceschanged-Zuhörer, wenn die Liste beim Import schon gefüllt ist", async () => {
    const deutscheStimme = {
      voiceURI: "de-Anna",
      name: "Anna",
      lang: "de-DE",
      localService: true,
      default: true,
    } as unknown as SpeechSynthesisVoice;
    const fakeSynth = baueFakeSynth([deutscheStimme]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.speechSynthesis = fakeSynth;
    w.SpeechSynthesisUtterance = FakeUtterance;

    await import("../src/lib/typing/voice");

    expect(fakeSynth.getVoices).toHaveBeenCalled();
    expect(fakeSynth.addEventListener).not.toHaveBeenCalledWith(
      "voiceschanged",
      expect.any(Function),
    );
  });

  it("räumt den einmaligen Zuhörer nach dem Nachladen wieder ab", async () => {
    const fakeSynth = baueFakeSynth([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.speechSynthesis = fakeSynth;
    w.SpeechSynthesisUtterance = FakeUtterance;

    await import("../src/lib/typing/voice");
    expect(fakeSynth._anzahlListener("voiceschanged")).toBeGreaterThan(0);
    fakeSynth._feuereVoiceschanged(); // Browser meldet: Liste ist jetzt da
    expect(fakeSynth._anzahlListener("voiceschanged")).toBe(0); // kein Leck
  });
});
