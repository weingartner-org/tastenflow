/**
 * ★★★★★ WÄCHTER F8 Tschechisch (03.10.2026): die Sprachausgabe des Weges „cs" - Zeichennamen und Stimme (Zuzana).
 *
 * Glossar `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md` §2.8 „Zeichennamen der Sprachausgabe". Vorbild:
 * `tests/tastenflow-sprachausgabe-it.test.ts`. Gebaut ist in F8-cs der NAME jedes Zeichens (`SPOKEN_CS`, `spokenLabel(ch, "cs")`) und die Stimme;
 * die Ansagen in ganzen Sätzen (`ANSAGEN.cs`, `fingerGuideCs`, Freischalt-Karte) und die Zwei-Schritt-Ansage der Totasten („nejdřív mrtvá klávesa
 * háček, potom …") gehören zur Oberfläche (Etappe O-cs) - sie brauchen die Finger- und Reihennamen und den Satzbau; dieser Wächter hält fest,
 * dass die NAMEN, aus denen sie bestehen, da sind.
 *
 * ⚠️ Stimmen: GEMESSEN ist nur der Mac (`say -v '?'`: Zuzana, die einzige für cs_CZ). Windows (laut Messung des PC keine tschechische Stimme),
 * iOS und Chrome sind ungemessen - dort greift der allgemeine Rückfall von `beste()`; hier wird nichts erfunden.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { spokenLabel } from "../src/lib/typing/fingers";
import { activeLayout, setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { setVorleseSprache, sprachTagFuer } from "../src/lib/typing/vorlesen";

afterEach(() => {
  setLayout("de");
  setVorleseSprache("de");
  vi.restoreAllMocks();
});

const TASTATUREN: readonly LayoutId[] = ["cs", "cs-qwerty"];

/* ══ 1 · die Zeichennamen ═══════════════════════════════════════════════ */

describe("1 · Zeichennamen: kein Zeichen des Weges ohne tschechischen Namen, e/é/ě am Ohr verschieden", () => {
  it("die fünfzehn Buchstaben mit Zeichen tragen ausgeschriebene, voneinander verschiedene Namen (Glossar §2.8)", () => {
    const zeichen = ["á", "é", "í", "ó", "ú", "ý", "ě", "ů", "č", "ď", "ň", "ř", "š", "ť", "ž"];
    const namen = zeichen.map((k) => spokenLabel(k, "cs"));
    expect(namen).toEqual([
      "dlouhé á", "dlouhé é", "dlouhé í", "dlouhé ó", "dlouhé ú", "dlouhé ý",
      "e s háčkem", "u s kroužkem",
      "c s háčkem", "d s háčkem", "n s háčkem", "r s háčkem", "s s háčkem", "t s háčkem", "z s háčkem",
    ]);
    expect(new Set(namen).size).toBe(15);
  });

  it("e, é und ě klingen verschieden („e“, „dlouhé é“, „e s háčkem“) - und i, í, y, ý ebenso", () => {
    expect(new Set(["e", "é", "ě"].map((k) => spokenLabel(k, "cs"))).size).toBe(3);
    expect(new Set(["i", "í", "y", "ý"].map((k) => spokenLabel(k, "cs"))).size).toBe(4);
    expect(new Set(["u", "ú", "ů"].map((k) => spokenLabel(k, "cs"))).size).toBe(3);
  });

  it("grosse Buchstaben: Adjektiv vorn („velké A“), bei Buchstaben mit Zeichen mit dem Namen dahinter", () => {
    expect(spokenLabel("A", "cs")).toBe("velké A");
    expect(spokenLabel("Q", "cs")).toBe("velké Q");
    expect(spokenLabel("Č", "cs")).toBe("velké c s háčkem");
    expect(spokenLabel("Á", "cs")).toBe("velké dlouhé á");
    expect(spokenLabel("Ř", "cs")).toBe("velké r s háčkem");
  });

  it("die Totasten heissen háček, čárka nad písmenem, dvě tečky - und „čárka“ allein ist das KOMMA (Falle 2: beides darf nie gleich klingen)", () => {
    expect(spokenLabel("ˇ", "cs")).toBe("háček");
    expect(spokenLabel("´", "cs")).toBe("čárka nad písmenem");
    expect(spokenLabel("¨", "cs")).toBe("dvě tečky");
    expect(spokenLabel(",", "cs")).toBe("čárka");
    expect(spokenLabel(",", "cs")).not.toBe(spokenLabel("´", "cs"));
  });

  it("Satzzeichen tragen die Namen des Glossars: tečka, čárka, spojovník (nicht „pomlčka“), dvojtečka, středník, otazník, vykřičník, apostrof, mezera", () => {
    expect(spokenLabel(".", "cs")).toBe("tečka");
    expect(spokenLabel(",", "cs")).toBe("čárka");
    expect(spokenLabel("-", "cs")).toBe("spojovník");
    expect(spokenLabel(":", "cs")).toBe("dvojtečka");
    expect(spokenLabel(";", "cs")).toBe("středník");
    expect(spokenLabel("?", "cs")).toBe("otazník");
    expect(spokenLabel("!", "cs")).toBe("vykřičník");
    expect(spokenLabel("'", "cs")).toBe("apostrof");
    expect(spokenLabel("\"", "cs")).toBe("uvozovky");
    expect(spokenLabel(" ", "cs")).toBe("mezera");
    expect(spokenLabel("(", "cs")).toBe("levá závorka");
    expect(spokenLabel(")", "cs")).toBe("pravá závorka");
    expect(spokenLabel("@", "cs")).toBe("zavináč");
    expect(spokenLabel("#", "cs")).toBe("mřížka");
    expect(spokenLabel("%", "cs")).toBe("procento");
    expect(spokenLabel("€", "cs")).toBe("euro");
    expect(spokenLabel("\\", "cs")).toBe("zpětné lomítko");
    expect(spokenLabel("|", "cs")).toBe("svislá čára");
    expect(spokenLabel("&", "cs")).toBe("ampersand");
    expect(spokenLabel("_", "cs")).toBe("podtržítko");
  });

  for (const layout of TASTATUREN) {
    it(`${layout}: jedes Satz-/Sonderzeichen der Reihenfolge hat einen Namen (nicht das nackte Zeichen); Ziffern und einfache Buchstaben sagen sich selbst`, () => {
      setLayout(layout);
      const fehlt: string[] = [];
      for (const u of introOrder("cs")) {
        if (u.length !== 1 || /[0-9]/.test(u) || u === "⇧") continue;
        // ein Buchstabe ohne Zeichen sagt sich selbst; alles andere (Satz-/Sonderzeichen, Totasten, Buchstaben mit Zeichen) braucht einen Namen
        if (/[a-z]/.test(u)) continue;
        if (spokenLabel(u, "cs") === u) fehlt.push(u);
      }
      expect(fehlt, "Einheiten ohne tschechischen Namen").toEqual([]);
      expect(spokenLabel("7", "cs")).toBe("7");
      expect(spokenLabel("a", "cs")).toBe("a");
    });

    it(`${layout}: JEDES Zeichen, das die Tastatur liefert (Tasten, Umschalt, AltGr, Totasten), hat einen Namen - Falle 24 des Französischen`, () => {
      setLayout(layout);
      const l = activeLayout();
      const alle = new Set<string>([...l.rows.flatMap((r) => r.keys), ...Object.keys(l.access)]);
      const fehlt = [...alle].filter((c) => c.length === 1 && !/[0-9a-z]/.test(c) && c !== "⇧" && spokenLabel(c, "cs") === c);
      expect(fehlt, `${layout}: Zeichen ohne tschechischen Namen`).toEqual([]);
    });
  }

  it("alle Buchstaben des Weges mit Zeichen (lernwegDef(\"cs\")) tragen einen Namen und keiner ist doppelt vergeben", () => {
    const mitZeichen = lernwegDef("cs").letterOrder.filter((u) => /\p{L}/u.test(u) && !/^[a-z]$/.test(u) && u !== "ˇ");
    expect(mitZeichen.length).toBe(11);
    const namen = mitZeichen.map((u) => spokenLabel(u, "cs"));
    for (const [i, n] of namen.entries()) expect(n, mitZeichen[i]).not.toBe(mitZeichen[i]);
    expect(new Set(namen).size).toBe(namen.length);
  });

  it("de, en, fr, es, it: dieselben Namen wie vorher (der Weg „cs“ hat nichts verschoben)", () => {
    expect(spokenLabel("à", "fr")).not.toBe(spokenLabel("á", "cs"));
    expect(spokenLabel("ñ", "es")).toBe("eñe");
    expect(spokenLabel("ä", "de")).toBe("a Umlaut");
    expect(spokenLabel("è", "it")).toBe("e con accento grave");
    expect(spokenLabel("A", "en")).toBe("capital A");
  });
});

/* ══ 2 · die Vorlese-Sprache ═══════════════════════════════════════════ */

describe("2 · Vorlese-Sprache cs: das Sprachkürzel der Stimme ist cs-CZ", () => {
  it("sprachTagFuer(\"cs\") ist cs-CZ", () => {
    setVorleseSprache("cs");
    expect(sprachTagFuer("cs")).toBe("cs-CZ");
  });
});

/* ══ 3 · die Stimme ═════════════════════════════════════════════════════ */

describe("3 · Stimmenwahl: Zuzana am Mac, nie eine deutsche Stimme für tschechischen Text", () => {
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
    setVorleseSprache("cs");
    abgesetzt.length = 0;
    speakSequence(["Ahoj, jak se máš?"], "sofort");
    expect(abgesetzt).toHaveLength(1);
    return abgesetzt[0];
  }

  it("Mac: Zuzana wird gewählt - vor der Standard-Stimme einer anderen Sprache", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Zuzana", "cs-CZ"), stimme("Daniel", "en-GB")]);
    expect(u.voice?.name).toBe("Zuzana");
    expect(u.lang).toBe("cs-CZ");
  });

  it("ohne Zuzana: irgendeine tschechische Stimme (keine deutsche, keine Scherzstimme)", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Zarvox", "cs-CZ"), stimme("Eine Stimme (Tschechisch)", "cs-CZ")]);
    expect(u.voice?.lang.toLowerCase().startsWith("cs")).toBe(true);
    expect(u.voice?.name).not.toBe("Zarvox");
  });

  it("nur eine deutsche und eine englische Stimme (Windows ohne tschechische): KEINE Stimme gewählt (nie die deutsche liest Tschechisch), lang bleibt cs-CZ", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Daniel", "en-GB")]);
    expect(u.voice).toBeNull();
    expect(u.lang).toBe("cs-CZ");
  });

  it("eine im Zahnrad GEWÄHLTE deutsche Stimme gilt nicht für tschechischen Text (Jens' Befund vom 29.08.), die tschechische schon", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Zuzana", "cs-CZ")], "Anna");
    expect(u.voice?.name).toBe("Zuzana");
    const v = await sprich([stimme("Zuzana", "cs-CZ"), stimme("Eine Stimme (Tschechisch)", "cs-CZ")], "Eine Stimme (Tschechisch)");
    expect(v.voice?.name).toBe("Eine Stimme (Tschechisch)");
  });

  it("Zeilenansage und Rückmeldung sprechen mit DERSELBEN Stimme (W14: keine Doppelstimme)", async () => {
    const { speakSequence, speakUiAlways, useVoice } = await import("../src/lib/typing/voice");
    VOICES = [stimme("Anna", "de-DE", true), stimme("Zuzana", "cs-CZ")];
    useVoice.setState({ enabled: true, voiceURI: "" });
    setVorleseSprache("cs");
    abgesetzt.length = 0;
    speakSequence(["Ahoj."], "sofort");
    speakUiAlways("Výborně!", undefined, "cs", "sofort");
    expect(abgesetzt).toHaveLength(2);
    expect(abgesetzt[0].voice?.name).toBe("Zuzana");
    expect(abgesetzt[1].voice?.name).toBe("Zuzana");
  });
});
