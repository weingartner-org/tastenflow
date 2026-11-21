/**
 * ★★★★★ WÄCHTER F8 Italienisch (02.10.2026): die Sprachausgabe des Weges „it" - Zeichennamen, Stimme, Ansage der
 * Akzentbuchstaben auf der Schweizer Belegung (Tessin, Graubünden), Ansagen.
 *
 * Bauplan `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §4 (F8), `recherche-italienisch-2026-10-02/GLOSSAR-it.md` §2.8 „Zeichennamen
 * der Sprachausgabe". Vorbild: `tests/tastenflow-sprachausgabe-es.test.ts` (ES-F8). Was Etappe O Italienisch (O-IT) schon gebaut hat
 * (`SPOKEN_IT`, `ANSAGEN.it`, `fingerGuideIt`), wird hier fest gehalten und um das ergänzt, was F8 offen liess: die Stimme (Alice) und die
 * Zwei-Schritt-Ansage von `ì ò ù` auf `ch-fr`/`ch` (F4-Befund §10 Punkt 5).
 *
 * ⚠️ Stimmen: GEMESSEN ist nur der Mac (`say -v '?'`: Alice). Windows (Elsa/Cosimo) und iOS sind ungemessen - dort greift der allgemeine
 * Rückfall von `beste()`; hier wird nichts erfunden.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { fingerGuideIt, spokenLabel } from "../src/lib/typing/fingers";
import { unitHowToTypeIt } from "../src/lib/typing/freischaltungIt";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { ANSAGEN, ansage, ansageSchritt, ansageStart, ansageZeilenstand, setVorleseSprache, sprachTagFuer } from "../src/lib/typing/vorlesen";

afterEach(() => {
  setLayout("de");
  setVorleseSprache("de");
  vi.restoreAllMocks();
});

const TASTATUREN: readonly LayoutId[] = ["it", "it-qzerty", "ch-fr", "ch"];

/* ══ 1 · die Zeichennamen ═══════════════════════════════════════════════ */

describe("1 · Zeichennamen: kein Zeichen des Weges ohne italienischen Namen, è und é am Ohr verschieden", () => {
  it("die sechs Akzentbuchstaben tragen ausgeschriebene, voneinander verschiedene Namen (Bauplan I3, Falle 4)", () => {
    const namen = ["à", "è", "é", "ì", "ò", "ù"].map((k) => spokenLabel(k, "it"));
    expect(namen).toEqual([
      "a con accento grave", "e con accento grave", "e con accento acuto", "i con accento grave", "o con accento grave", "u con accento grave",
    ]);
    expect(new Set(namen).size).toBe(6);
  });

  it("grosse Buchstaben: Buchstabe zuerst („A maiuscola“), bei Akzentbuchstaben mit dem Akzent dahinter", () => {
    expect(spokenLabel("A", "it")).toBe("A maiuscola");
    expect(spokenLabel("Q", "it")).toBe("Q maiuscola");
    expect(spokenLabel("È", "it")).toBe("E maiuscola con accento grave");
    expect(spokenLabel("É", "it")).toBe("E maiuscola con accento acuto");
  });

  it("der Apostroph heisst „apostrofo“ (Elision), Satzzeichen ohne AltGr tragen italienische Namen", () => {
    expect(spokenLabel("'", "it")).toBe("apostrofo");
    expect(spokenLabel(".", "it")).toBe("punto");
    expect(spokenLabel(",", "it")).toBe("virgola");
    expect(spokenLabel("?", "it")).toBe("punto interrogativo");
    expect(spokenLabel(":", "it")).toBe("due punti");
    expect(spokenLabel(";", "it")).toBe("punto e virgola");
    expect(spokenLabel("-", "it")).toBe("trattino");
    expect(spokenLabel(" ", "it")).toBe("spazio");
  });

  for (const layout of TASTATUREN) {
    it(`${layout}: jedes Satz-/Sonderzeichen der Reihenfolge hat einen Namen (nicht das nackte Zeichen); Ziffern und Buchstaben sagen sich selbst`, () => {
      setLayout(layout);
      const fehlt: string[] = [];
      for (const u of introOrder("it")) {
        if (u.length !== 1 || /\p{L}/u.test(u) || /[0-9]/.test(u) || u === "⇧") continue;
        if (spokenLabel(u, "it") === u) fehlt.push(u);
      }
      expect(fehlt, "Zeichen ohne italienischen Namen").toEqual([]);
      expect(spokenLabel("7", "it")).toBe("7");
      expect(spokenLabel("a", "it")).toBe("a");
    });
  }

  it("de, en, fr, es: dieselben Namen wie vorher (der Weg „it“ hat nichts verschoben)", () => {
    expect(spokenLabel("à", "fr")).not.toBe(spokenLabel("à", "it"));
    expect(spokenLabel("ñ", "es")).toBe("eñe");
    expect(spokenLabel("ä", "de")).toBe("a Umlaut");
  });
});

/* ══ 2 · die Ansagen ═══════════════════════════════════════════════════ */

describe("2 · Ansagen auf Italienisch (O-IT) - hier festgehalten", () => {
  it("ANSAGEN.it trägt dieselben Schlüssel wie de, nichts bleibt leer, keine deutschen Umlaute", () => {
    expect(Object.keys(ANSAGEN.it).sort()).toEqual(Object.keys(ANSAGEN.de).sort());
    for (const [key, satz] of Object.entries(ANSAGEN.it)) {
      expect(satz.trim(), key).not.toBe("");
      expect(/[äöüß]/.test(satz), `${key}: ${satz}`).toBe(false);
    }
  });

  it("jeder Satz ist neu geschrieben - nie der deutsche, englische oder spanische", () => {
    for (const key of Object.keys(ANSAGEN.de) as (keyof typeof ANSAGEN.de)[]) {
      expect(ANSAGEN.it[key], `wie Deutsch: ${key}`).not.toBe(ANSAGEN.de[key]);
      expect(ANSAGEN.it[key], `wie Englisch: ${key}`).not.toBe(ANSAGEN.en[key]);
      expect(ANSAGEN.it[key], `wie Spanisch: ${key}`).not.toBe(ANSAGEN.es[key]);
    }
  });

  it("die Vorlese-Sprache: ansage() folgt setVorleseSprache(\"it\"), das Sprachkürzel der Stimme ist it-IT", () => {
    setVorleseSprache("it");
    expect(ansage("vorlesenAn")).toBe(ANSAGEN.it.vorlesenAn);
    expect(sprachTagFuer("it")).toBe("it-IT");
  });

  it("Schritt, Start, Zeilenstand: ganze italienische Sätze, Komma statt Ordnungszahl-Punkt (nie „2.“ als „seconda“)", () => {
    expect(ansageSchritt(2, 5, "Tastiera", "it")).toBe("Passo 2 di 5. Tastiera");
    expect(ansageStart("posizione base", "it")).toBe("Punto di partenza: posizione base.");
    expect(ansageZeilenstand(3, 12, "it")).toMatch(/^Riga 3 di 12,/);
  });
});

/* ══ 3 · die Stimme ═════════════════════════════════════════════════════ */

describe("3 · Stimmenwahl: Alice am Mac, nie eine deutsche Stimme für italienischen Text", () => {
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

  const stimme = (name: string, lang: string, isDefault = false) =>
    ({ name, lang, voiceURI: name, default: isDefault, localService: true }) as SpeechSynthesisVoice;

  let VOICES: SpeechSynthesisVoice[] = [];
  const abgesetzt: FakeUtterance[] = [];
  const fakeSynth = {
    speaking: false,
    pending: false,
    paused: false,
    getVoices: () => VOICES,
    speak(u: FakeUtterance) {
      abgesetzt.push(u);
    },
    cancel() {},
    resume() {},
    pause() {},
    addEventListener() {},
    removeEventListener() {},
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.speechSynthesis = fakeSynth;
  w.SpeechSynthesisUtterance = FakeUtterance;

  async function sprich(voices: SpeechSynthesisVoice[], gewaehlt = ""): Promise<FakeUtterance> {
    const { speakSequence, useVoice } = await import("../src/lib/typing/voice");
    VOICES = voices;
    useVoice.setState({ enabled: true, voiceURI: gewaehlt });
    setVorleseSprache("it");
    abgesetzt.length = 0;
    speakSequence(["Ciao, come stai?"], "sofort");
    expect(abgesetzt).toHaveLength(1);
    return abgesetzt[0];
  }

  it("Mac: Alice wird gewählt - vor der Standard-Stimme und vor den mehrsprachigen Familien-Stimmen", async () => {
    const u = await sprich([
      stimme("Anna", "de-DE", true),
      stimme("Eddy (Italienisch (Italien))", "it-IT"),
      stimme("Alice", "it-IT"),
      stimme("Grandma (Italienisch (Italien))", "it-IT"),
    ]);
    expect(u.voice?.name).toBe("Alice");
    expect(u.lang).toBe("it-IT");
  });

  it("ohne Alice: irgendeine italienische Stimme (keine deutsche, keine Scherzstimme), die des Geräts zuerst", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Eddy (Italienisch (Italien))", "it-IT"), stimme("Zarvox", "it-IT")]);
    expect(u.voice?.lang.toLowerCase().startsWith("it")).toBe(true);
    expect(u.voice?.name).not.toBe("Zarvox");
  });

  it("nur eine deutsche und eine englische Stimme: KEINE Stimme gewählt (nie die deutsche liest Italienisch), lang bleibt it-IT", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Daniel", "en-GB")]);
    expect(u.voice).toBeNull();
    expect(u.lang).toBe("it-IT");
  });

  it("eine im Zahnrad GEWÄHLTE deutsche Stimme gilt nicht für italienischen Text (Jens' Befund vom 29.08.), die italienische schon", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Alice", "it-IT"), stimme("Eddy (Italienisch (Italien))", "it-IT")], "Anna");
    expect(u.voice?.name).toBe("Alice");
    const v = await sprich([stimme("Alice", "it-IT"), stimme("Eddy (Italienisch (Italien))", "it-IT")], "Eddy (Italienisch (Italien))");
    expect(v.voice?.name).toBe("Eddy (Italienisch (Italien))");
  });

  it("Zeilenansage und Rückmeldung sprechen mit DERSELBEN Stimme (W14: keine Doppelstimme)", async () => {
    const { speakSequence, speakUiAlways, useVoice } = await import("../src/lib/typing/voice");
    VOICES = [stimme("Anna", "de-DE", true), stimme("Alice", "it-IT")];
    useVoice.setState({ enabled: true, voiceURI: "" });
    setVorleseSprache("it");
    abgesetzt.length = 0;
    speakSequence(["Ciao."], "sofort");
    speakUiAlways("Ottimo lavoro!", undefined, "it", "sofort");
    expect(abgesetzt).toHaveLength(2);
    expect(abgesetzt[0].voice?.name).toBe("Alice");
    expect(abgesetzt[1].voice?.name).toBe("Alice");
  });
});

/* ══ 4 · ì ò ù auf der Schweizer Belegung ══════════════════════════════ */

describe("4 · Akzentbuchstaben auf ch-fr und ch: zwei Schritte (Gravis-Totaste, dann Vokal) - auf it und it-qzerty eine eigene Taste", () => {
  it("ch-fr und ch: die Finger-Ansage nennt die Totaste mit ihrem Finger, dann den Vokal mit seinem", () => {
    for (const layout of ["ch-fr", "ch"] as const) {
      setLayout(layout);
      for (const [akzent, vokal] of [["ì", "I"], ["ò", "O"], ["ù", "U"]] as const) {
        const a = fingerGuideIt(akzent, false, "it");
        expect(a, `${layout} ${akzent}`).toMatch(/prima il tasto morto accento grave \(mignolo destro, con Maiusc\)/);
        expect(a, `${layout} ${akzent}`).toContain(`poi ${vokal},`);
        expect(a, `${layout} ${akzent}`).toMatch(/(indice|medio|anulare|mignolo) (destro|sinistro)/);
      }
    }
  });

  it("die grossen Ì Ò Ù: dazu die Maiusc-Taste der Gegenhand", () => {
    setLayout("ch-fr");
    expect(fingerGuideIt("Ì", false, "it")).toMatch(/poi I, medio destro, con il tasto Maiusc sinistro\.$/);
    expect(fingerGuideIt("È", false, "it")).toMatch(/poi E, medio sinistro, con il tasto Maiusc destro\.$/);
    expect(fingerGuideIt("Ì", true, "it")).toMatch(/con Maiusc\.$/); // Einhand: neutral
  });

  it("die Freischalt-Karte sagt dasselbe in einem Satz („Si scrive in due passi: …“)", () => {
    for (const layout of ["ch-fr", "ch"] as const) {
      setLayout(layout);
      for (const k of ["ì", "ò", "ù"]) {
        expect(unitHowToTypeIt(k, "it"), `${layout} ${k}`).toMatch(/^Si scrive in due passi: prima il tasto morto accento grave \(mignolo destro, con Maiusc\), poi la lettera [IOU]\.$/);
      }
    }
  });

  it("it und it-qzerty: jeder Akzentbuchstabe hat eine eigene Taste - KEINE Zwei-Schritt-Ansage", () => {
    for (const layout of ["it", "it-qzerty"] as const) {
      setLayout(layout);
      for (const k of ["à", "è", "ì", "ò", "ù"]) {
        expect(fingerGuideIt(k, false, "it"), `${layout} ${k}`).not.toMatch(/tasto morto|due passi/);
        expect(unitHowToTypeIt(k, "it"), `${layout} ${k}`).toMatch(/^Si trova sul tasto /);
      }
    }
  });

  it("à und è auf ch-fr haben eine eigene Taste (nur ì ò ù laufen über die Gravis-Totaste)", () => {
    setLayout("ch-fr");
    expect(fingerGuideIt("à", false, "it")).not.toMatch(/tasto morto/);
    expect(fingerGuideIt("è", false, "it")).not.toMatch(/tasto morto/);
  });
});
