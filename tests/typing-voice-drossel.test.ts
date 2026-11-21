/**
 * Die Drossel (`runSpeech`) und die zwei Klassen von Ansagen — Befund F21 des
 * Vollaudits vom 30./31.08.2026.
 *
 * GEMESSEN (Nacht auf den 31.08., `pruefstand/kind/protokolle/beweis-92-rueckkehr.json`):
 * Nach dem Rundenende wurde „Mein Training." angeschlossen und war trotzdem in
 * KEINER Protokollzeile zu hören. Ursache auf eine Zeile genau: `runSpeech` hielt
 * EINEN modulweiten Warteplatz (`pendingJob`), und den bekam immer der jüngste
 * Auftrag. Von zwei Ansagen überlebte nur die zweite — und die zweite ist fast
 * immer der Aufgabentext des frisch aufgebauten Trainers.
 *
 * ⚠️ Die naheliegende Behebung ist FALSCH: Eine schlichte FIFO-Reihe für alles
 * spräche beim flüssigen Tippen jeden einzelnen Anschlag nach (Abnahmeregel R-A9,
 * „kein Dauerfeuer"). Der eine Platz ist dort Absicht. Es braucht zwei Klassen:
 *
 *   - ERSETZBAR (Vorgabe): Zeichen, Wörter, Zeilen beim Tippen. Ein neuer Auftrag
 *     dieser Klasse verdrängt einen wartenden derselben Klasse — wie bisher.
 *   - EREIGNIS: „Mein Training.", ein Geschichtentitel, eine Medaille. Diese
 *     Ansagen sagen dem Kind, was gerade GESCHEHEN ist. Sie dürfen nicht
 *     verschwinden, und sie dürfen den Aufgabentext auch nicht verdrängen —
 *     beide gehören gesprochen, nacheinander.
 *
 * Die Tests hier halten beide Richtungen fest: dass nichts verlorengeht UND dass
 * beim Tippen nicht mehr gesprochen wird als vorher.
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
    if (u.volume === 0) return; // lautlose Freischalt-Ansage (primeSpeech)
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

const { cancelQueued, cancelSpeech, speak, speakUi, speakSequence, useVoice } = await import(
  "../src/lib/typing/voice"
);

// Die Uhr läuft über die Tests hinweg NACH VORN (voice.ts merkt sich modulweit den
// Zeitpunkt des letzten Engine-Auftrags — eine je Test neu gestellte Uhr läge in
// der „Zukunft" und würde alles verzögern).
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
  useVoice.getState().setEnabled(true);
  cancelQueued();
  cancelSpeech();
  cancelCalls = 0;
  spokenTexts.length = 0;
});

afterEach(() => {
  cancelQueued();
  cancelSpeech();
  useVoice.getState().setEnabled(false);
  vi.useRealTimers();
});

/** Drossel-/Ruhefenster abwarten (SETTLE_MS + Atempause nach cancel). */
function settle(): void {
  vi.advanceTimersByTime(400);
}

describe("F21 — eine Ereignis-Ansage darf nicht verschwinden", () => {
  it("spricht Ereignis-Ansage UND Aufgabentext, in dieser Reihenfolge", () => {
    // Ausgangslage wie nach einem Rundenende: die Belohnungsansage läuft noch.
    fakeSynth.speaking = true;

    speakUi("Mein Training."); // Ereignis: sagt, was geschehen ist
    speak("Eine Runde um die Erde schafft die ISS in 90 Minuten."); // Aufgabentext
    settle();

    // Gemessen am 31.08. war hier NUR der Aufgabentext zu hören.
    expect(spokenTexts[0]).toBe("Mein Training.");

    finishRunning();
    settle();

    expect(spokenTexts).toEqual([
      "Mein Training.",
      "Eine Runde um die Erde schafft die ISS in 90 Minuten.",
    ]);
  });

  it("hält auch den Geschichtentitel, wenn die erste Zeile sofort nachkommt", () => {
    fakeSynth.speaking = true;

    speakUi("Das Licht in der Höhle."); // Ereignis: der Titel
    speak("Jaro und Lena wandern durch den Wald."); // erste Zeile
    settle();
    expect(spokenTexts[0]).toBe("Das Licht in der Höhle.");

    finishRunning();
    settle();
    expect(spokenTexts).toEqual([
      "Das Licht in der Höhle.",
      "Jaro und Lena wandern durch den Wald.",
    ]);
  });

  it("hält zwei Ereignis-Ansagen hintereinander (Medaille, dann Aufstieg)", () => {
    fakeSynth.speaking = true;

    speakUi("Neue Medaille: Flinke Finger.");
    speakUi("Aufstieg: nächste Übungsstufe.");
    settle();
    expect(spokenTexts[0]).toBe("Neue Medaille: Flinke Finger.");

    finishRunning();
    settle();
    expect(spokenTexts).toEqual([
      "Neue Medaille: Flinke Finger.",
      "Aufstieg: nächste Übungsstufe.",
    ]);
  });
});

describe("R-A9 — beim Tippen darf NICHT mehr gesprochen werden als bisher", () => {
  it("verdrängt wartende Zeichen-Ansagen wie bisher (nur die jüngste überlebt)", () => {
    fakeSynth.speaking = true;

    // Flüssiges Tippen: sechs Anschläge im selben Ruhefenster.
    for (const zeichen of ["a", "b", "c", "d", "e", "f"]) speak(zeichen);
    settle();

    // Genau EINE Ansage — die jüngste. Das war vorher so und muss so bleiben.
    expect(spokenTexts).toEqual(["f"]);

    finishRunning();
    settle();
    expect(spokenTexts).toEqual(["f"]); // nichts rückt nach
  });

  it("eine Ereignis-Ansage sammelt keine Zeichen-Ansagen hinter sich an", () => {
    fakeSynth.speaking = true;

    speakUi("Mein Training."); // Ereignis
    for (const zeichen of ["a", "b", "c", "d", "e"]) speak(zeichen); // Tippfluss
    settle();

    expect(spokenTexts[0]).toBe("Mein Training.");

    finishRunning();
    settle();

    // Hinter dem Ereignis steht höchstens die JÜNGSTE Zeichen-Ansage, nie alle.
    expect(spokenTexts).toEqual(["Mein Training.", "e"]);
  });

  it("deckelt die Reihe auch bei einem Sturm von Ereignis-Ansagen", () => {
    fakeSynth.speaking = true;

    for (let i = 1; i <= 12; i += 1) speakUi(`Ereignis ${i}.`);
    settle();

    // Abarbeiten, bis nichts mehr nachrückt (höchstens ein Dutzend Runden).
    for (let i = 0; i < 12; i += 1) {
      finishRunning();
      settle();
    }

    // Nicht alle zwölf — die Reihe ist gedeckelt, sonst hört das Kind minutenlang
    // alte Sätze (dieselbe Erwägung wie QUEUE_MAX_WAITING bei speakQueued).
    expect(spokenTexts.length).toBeLessThanOrEqual(4);
    /*
     * Die JÜNGSTE Nachricht muss dabei sein — sie beschreibt den jetzigen Zustand.
     *
     * ⚠️ OHNE SATZPUNKT (nachgezogen 04.09.2026): Seit `fuerSprachausgabe` fällt
     * ein Punkt, der unmittelbar hinter einer Zahl das Satzende bildet, für die
     * ANSAGE weg - sonst liest jede Sprachausgabe „Ereignis 12." als
     * Ordnungszahl („zwölftes"). Gemeldet von Testerin am 03.09. am Zahlendiktat
     * („73." wurde „73-ter"), und sie hat ausdrücklich gesagt: „das ist auch bei
     * den ganzen Meldungen so".
     *
     * Dieser Wächter deckelt die REIHENLÄNGE - die Zeichensetzung ist nicht sein
     * Gegenstand. Er prüft darum den Wortlaut, der wirklich gesprochen wird.
     */
    expect(spokenTexts).toContain("Ereignis 12");
  });
});

/**
 * ★★★★★ „sofort" - DIE ANSAGE DER NÄCHSTEN TASTE (03.09.2026 abends).
 *
 * Johannes am iPad: *„sofort wenn eine Taste gedrückt wird muss die nächste
 * angesagt werden."* Gemessen hatte er fast eine Sekunde.
 *
 * ── DIE GEGENPROBE, DIE HIER ZÄHLT ────────────────────────────────────────
 * Ein Test, der nur zeigt, dass „sofort" sofort spricht, wäre die halbe
 * Wahrheit: Er würde auch grün, wenn jemand das Ruhefenster für ALLE Ansagen
 * abgeschafft hätte - also genau die Drossel, gegen die R-A9 („kein
 * Dauerfeuer") gebaut ist. Deshalb steht hier immer beides nebeneinander:
 * „sofort" spricht ohne Warten, „ersetzbar" wartet weiter.
 */
describe("„sofort“ - die Ansage der nächsten Taste wartet nicht", () => {
  it("spricht OHNE das Ruhefenster abzuwarten", () => {
    speakSequence(["j"], "sofort");
    // KEIN settle() - genau darum geht es.
    expect(spokenTexts).toEqual(["j"]);
  });

  it("★ die Gegenprobe: „ersetzbar“ wartet weiterhin", () => {
    // Erst die Engine anfassen, damit die freie Bahn zu ist …
    speakSequence(["a"], "sofort");
    spokenTexts.length = 0;
    finishRunning();
    // … dann eine gewöhnliche Ansage: die darf NICHT sofort kommen.
    speakSequence(["ganze Zeile"]);
    expect(spokenTexts).toEqual([]);
    settle();
    expect(spokenTexts).toEqual(["ganze Zeile"]);
  });

  it("eine veraltete „sofort“-Ansage wird verworfen, nicht nachgesprochen", () => {
    // Engine beschäftigt → der erste Auftrag legt sich hin.
    fakeSynth.speaking = true;
    speakSequence(["a"]);
    speakSequence(["b"], "sofort");
    settle();
    // Beim flüssigen Tippen darf kein Stau entstehen: „a" ist überholt.
    expect(spokenTexts).not.toContain("a");
  });

  it("⚠️ eine EREIGNIS-Ansage wird von „sofort“ NICHT verdrängt", () => {
    // „Mein Training." und Konsorten sagen, was geschehen ist - sie dürfen
    // nicht verschwinden, weil ein Kind schnell weitertippt (Befund F21).
    fakeSynth.speaking = true;
    speakUi("Mein Training.");
    speakSequence(["j"], "sofort");
    // ⚠️ Der Nachrück-Wächter muss das Sprechen ERST SEHEN, bevor die Ansage
    //    endet - sonst hält er sie für einen Fehlstart und wartet die volle
    //    Karenz ab. Genau so läuft es auch in echt: Die Engine spricht, der
    //    Wächter sieht es, und beim Verstummen rückt der nächste nach.
    vi.advanceTimersByTime(300);
    finishRunning();
    vi.advanceTimersByTime(600);
    expect(spokenTexts).toContain("Mein Training.");
  });
});
