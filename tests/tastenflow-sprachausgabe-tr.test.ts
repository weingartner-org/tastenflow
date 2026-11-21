/**
 * ★★★★★ WÄCHTER F8 Türkisch (03.10.2026): die Sprachausgabe des Weges „tr" - Zeichennamen, Stimme (Yelda), Ansage von â î û über die
 * Totaste `^`, Ansagen.
 *
 * Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md` §2.8 „Zeichennamen (`SPOKEN_TR`)", §4 Nr. 1/12. Vorbild:
 * `tests/tastenflow-sprachausgabe-it.test.ts` (F8-it). Was Etappe O Türkisch (O-TR) schon gebaut hat (`SPOKEN_TR`, `ANSAGEN.tr`, `fingerGuideTr`,
 * `sprechformTr`), wird hier fest gehalten und um das ergänzt, was F8 offen liess: `₺` heisst „Türk lirası", die Stimme (Yelda) und die
 * Zwei-Schritt-Ansage von â î û (F4-Befund §3).
 *
 * ⚠️ Stimmen: GEMESSEN ist nur der Mac (`say -v '?'`: genau EINE türkische Stimme, Yelda). Windows (Tolga/Emel?) und iOS sind ungemessen
 * (Messliste Z4) - dort greift der allgemeine Rückfall von `beste()`; hier wird nichts erfunden.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { fingerGuideTr, spokenLabel } from "../src/lib/typing/fingers";
import { unitHowToTypeTr } from "../src/lib/typing/freischaltungTr";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { ANSAGEN, ansage, ansageSchritt, ansageStart, ansageZeilenstand, setVorleseSprache, sprachTagFuer } from "../src/lib/typing/vorlesen";

afterEach(() => {
  setLayout("de");
  setVorleseSprache("de");
  vi.restoreAllMocks();
});

/* ══ 1 · die Zeichennamen ═══════════════════════════════════════════════ */

describe("1 · Zeichennamen: kein Zeichen des Weges ohne türkischen Namen, i und ı am Ohr verschieden", () => {
  it("★ i und ı: „noktalı i“ und „noktasız ı“ (ılık/ilik sind zwei Wörter, Glossar §4 Nr. 1); die Grossformen mit „büyük“ davor", () => {
    expect(spokenLabel("i", "tr")).toBe("noktalı i");
    expect(spokenLabel("ı", "tr")).toBe("noktasız ı");
    expect(spokenLabel("İ", "tr")).toBe("büyük noktalı i");
    expect(spokenLabel("I", "tr")).toBe("büyük noktasız ı");
    expect(new Set(["i", "ı", "İ", "I"].map((k) => spokenLabel(k, "tr"))).size).toBe(4);
  });

  it("ğ heisst „yumuşak ge“ (sein Name im Alphabet), â î û tragen das „şapkalı“; ş ç ö ü liest die Stimme richtig - sie bleiben das Zeichen", () => {
    expect(spokenLabel("ğ", "tr")).toBe("yumuşak ge");
    expect(spokenLabel("Ğ", "tr")).toBe("büyük yumuşak ge");
    expect(spokenLabel("â", "tr")).toBe("şapkalı a");
    expect(spokenLabel("î", "tr")).toBe("şapkalı i");
    expect(spokenLabel("û", "tr")).toBe("şapkalı u");
    expect(spokenLabel("Â", "tr")).toBe("büyük şapkalı a");
    for (const k of ["ş", "ç", "ö", "ü"]) expect(spokenLabel(k, "tr")).toBe(k);
    expect(spokenLabel("A", "tr")).toBe("büyük A");
    expect(spokenLabel("Ş", "tr")).toBe("büyük Ş");
  });

  it("★ ₺ heisst „Türk lirası“, ½ „yarım“, ^ „şapka“, der Apostroph „kesme işareti“ (F8: ₺ und ½ hatten bis hierher keinen Platz in der Reihenfolge)", () => {
    expect(spokenLabel("₺", "tr")).toBe("Türk lirası");
    expect(spokenLabel("½", "tr")).toBe("yarım");
    expect(spokenLabel("^", "tr")).toBe("şapka");
    expect(spokenLabel("'", "tr")).toBe("kesme işareti");
    expect(spokenLabel("€", "tr")).toBe("avro");
    expect(spokenLabel("$", "tr")).toBe("dolar");
    expect(spokenLabel("£", "tr")).toBe("sterlin");
    // Währungen am Ohr verschieden
    expect(new Set(["₺", "€", "$", "£"].map((k) => spokenLabel(k, "tr"))).size).toBe(4);
  });

  it("Satzzeichen ohne AltGr tragen türkische Namen (TDK-Liste)", () => {
    expect(spokenLabel(".", "tr")).toBe("nokta");
    expect(spokenLabel(",", "tr")).toBe("virgül");
    expect(spokenLabel("?", "tr")).toBe("soru işareti");
    expect(spokenLabel("!", "tr")).toBe("ünlem işareti");
    expect(spokenLabel(":", "tr")).toBe("iki nokta");
    expect(spokenLabel(";", "tr")).toBe("noktalı virgül");
    expect(spokenLabel("-", "tr")).toBe("kısa çizgi");
    expect(spokenLabel(" ", "tr")).toBe("boşluk");
    expect(spokenLabel("\"", "tr")).toBe("tırnak işareti");
    expect(spokenLabel("(", "tr")).toBe("parantez aç");
    expect(spokenLabel(")", "tr")).toBe("parantez kapat");
  });

  it("★ jedes Satz-/Sonderzeichen der Reihenfolge hat einen Namen (nicht das nackte Zeichen); Ziffern und Buchstaben sagen sich selbst - auf `tr-q`", () => {
    setLayout("tr-q");
    const fehlt: string[] = [];
    for (const u of introOrder("tr")) {
      if (u.length !== 1 || /\p{L}/u.test(u) || /[0-9]/.test(u) || u === "⇧") continue;
      if (spokenLabel(u, "tr") === u) fehlt.push(u);
    }
    expect(fehlt, "Zeichen ohne türkischen Namen").toEqual([]);
    expect(spokenLabel("7", "tr")).toBe("7");
    expect(spokenLabel("a", "tr")).toBe("a");
  });

  it("de, en, fr, es, it: dieselben Namen wie vorher (der Weg „tr“ hat nichts verschoben)", () => {
    expect(spokenLabel("ñ", "es")).toBe("eñe");
    expect(spokenLabel("ä", "de")).toBe("a Umlaut");
    expect(spokenLabel("à", "it")).toBe("a con accento grave");
    expect(spokenLabel("₺", "it")).toBe("simbolo della lira turca");
    expect(spokenLabel("₺", "de")).toBe("Lira-Zeichen");
  });
});

/* ══ 2 · die Ansagen ═══════════════════════════════════════════════════ */

describe("2 · Ansagen auf Türkisch (O-TR) - hier festgehalten", () => {
  it("ANSAGEN.tr trägt dieselben Schlüssel wie de, nichts bleibt leer, keine deutschen Umlaute (ä ß)", () => {
    expect(Object.keys(ANSAGEN.tr).sort()).toEqual(Object.keys(ANSAGEN.de).sort());
    for (const [key, satz] of Object.entries(ANSAGEN.tr)) {
      expect(satz.trim(), key).not.toBe("");
      expect(/[äß]/.test(satz), `${key}: ${satz}`).toBe(false);
    }
  });

  it("jeder Satz ist neu geschrieben - nie der deutsche, englische, französische, spanische oder italienische", () => {
    for (const key of Object.keys(ANSAGEN.de) as (keyof typeof ANSAGEN.de)[]) {
      expect(ANSAGEN.tr[key], `wie Deutsch: ${key}`).not.toBe(ANSAGEN.de[key]);
      expect(ANSAGEN.tr[key], `wie Englisch: ${key}`).not.toBe(ANSAGEN.en[key]);
      expect(ANSAGEN.tr[key], `wie Spanisch: ${key}`).not.toBe(ANSAGEN.es[key]);
      expect(ANSAGEN.tr[key], `wie Italienisch: ${key}`).not.toBe(ANSAGEN.it[key]);
    }
  });

  it("die Vorlese-Sprache: ansage() folgt setVorleseSprache(\"tr\"), das Sprachkürzel der Stimme ist tr-TR", () => {
    setVorleseSprache("tr");
    expect(ansage("vorlesenAn")).toBe(ANSAGEN.tr.vorlesenAn);
    expect(sprachTagFuer("tr")).toBe("tr-TR");
  });

  it("Schritt, Start, Zeilenstand: ganze türkische Sätze, Komma statt „/“ (die Stimme liest „bölü“) und kein Ordnungszahl-Punkt", () => {
    expect(ansageSchritt(2, 5, "Klavye", "tr")).toMatch(/^Adım 2, toplam 5/);
    expect(ansageStart("temel konum", "tr")).toMatch(/temel konum/);
    expect(ansageZeilenstand(3, 12, "tr")).toMatch(/^Satır 3, toplam 12/);
    for (const satz of [ansageSchritt(2, 5, "Klavye", "tr"), ansageZeilenstand(3, 12, "tr")]) expect(satz).not.toMatch(/\d\s?\/\s?\d/);
  });
});

/* ══ 3 · die Stimme ═════════════════════════════════════════════════════ */

describe("3 · Stimmenwahl: Yelda am Mac, nie eine deutsche Stimme für türkischen Text", () => {
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
    setVorleseSprache("tr");
    abgesetzt.length = 0;
    speakSequence(["Merhaba, nasılsın?"], "sofort");
    expect(abgesetzt).toHaveLength(1);
    return abgesetzt[0];
  }

  it("Mac: Yelda wird gewählt - vor der Standard-Stimme einer anderen Sprache", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Daniel", "en-GB"), stimme("Yelda", "tr-TR")]);
    expect(u.voice?.name).toBe("Yelda");
    expect(u.lang).toBe("tr-TR");
  });

  it("ohne Yelda: irgendeine türkische Stimme (keine deutsche, keine Scherzstimme), die des Geräts zuerst", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Beispielstimme (Türkçe)", "tr-TR"), stimme("Zarvox", "tr-TR")]);
    expect(u.voice?.lang.toLowerCase().startsWith("tr")).toBe(true);
    expect(u.voice?.name).not.toBe("Zarvox");
  });

  it("★ nur eine deutsche und eine englische Stimme (so ist es unter Windows laut Plan): KEINE Stimme gewählt - nie liest die deutsche Türkisch, lang bleibt tr-TR", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Daniel", "en-GB")]);
    expect(u.voice).toBeNull();
    expect(u.lang).toBe("tr-TR");
  });

  it("eine im Zahnrad GEWÄHLTE deutsche Stimme gilt nicht für türkischen Text (Jens' Befund vom 29.08.), die türkische schon", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Yelda", "tr-TR")], "Anna");
    expect(u.voice?.name).toBe("Yelda");
    const v = await sprich([stimme("Yelda", "tr-TR"), stimme("Beispielstimme (Türkçe)", "tr-TR")], "Beispielstimme (Türkçe)");
    expect(v.voice?.name).toBe("Beispielstimme (Türkçe)");
  });

  it("Zeilenansage und Rückmeldung sprechen mit DERSELBEN Stimme (W14: keine Doppelstimme)", async () => {
    const { speakSequence, speakUiAlways, useVoice } = await import("../src/lib/typing/voice");
    VOICES = [stimme("Anna", "de-DE", true), stimme("Yelda", "tr-TR")];
    useVoice.setState({ enabled: true, voiceURI: "" });
    setVorleseSprache("tr");
    abgesetzt.length = 0;
    speakSequence(["Merhaba."], "sofort");
    speakUiAlways("Harika, devam et!", undefined, "tr", "sofort");
    expect(abgesetzt).toHaveLength(2);
    expect(abgesetzt[0].voice?.name).toBe("Yelda");
    expect(abgesetzt[1].voice?.name).toBe("Yelda");
  });
});

/* ══ 4 · â î û über die Totaste ^ ══════════════════════════════════════ */

describe("4 · â î û: zwei Schritte (Totaste ^, dann der Vokal) - mit dem Finger der Totaste und dem Finger des Vokals", () => {
  it("die Finger-Ansage nennt die Totaste mit ihrem Finger und Shift, dann den Vokal mit seinem Finger", () => {
    setLayout("tr-q");
    for (const [z, vokal] of [["â", "A"], ["î", "İ"], ["û", "U"]] as const) {
      const a = fingerGuideTr(z, false, "tr");
      expect(a, z).toMatch(/^şapkalı [aiu]: önce ölü tuş şapka \(sol orta parmak, Shift tuşuyla\), sonra /);
      expect(a, z).toContain(`sonra ${vokal} tuşu: `);
      expect(a, z).toMatch(/(serçe|yüzük|orta|işaret) parmağ?[ıi]?|başparmak|serçe parmak/);
    }
  });

  it("das grosse Â: dazu die Shift-Taste der Gegenhand (Einhand: neutral)", () => {
    setLayout("tr-q");
    expect(fingerGuideTr("Â", false, "tr")).toMatch(/sonra A tuşu: sol serçe parmak, ayrıca sağ Shift tuşu\.$/);
    expect(fingerGuideTr("Â", true, "tr")).toMatch(/ayrıca Shift tuşu\.$/);
  });

  it("die Freischalt-Karte der Totaste sagt, welche Vokale folgen („Önce … sonra ünlü harfe: â, î, û“)", () => {
    setLayout("tr-q");
    expect(unitHowToTypeTr("^", "tr")).toBe("Önce Shift tuşunu basılı tutup 3 tuşuna bas, sonra ünlü harfe: â, î, û.");
  });

  it("die Karten der neuen Sonderzeichen: ₺ und ½ über Alt Gr (Mac: Option), der Apostroph über Shift + 2", () => {
    setLayout("tr-q");
    expect(unitHowToTypeTr("₺", "tr")).toBe("Alt Gr tuşunu basılı tut ve T tuşuna bas.");
    expect(unitHowToTypeTr("½", "tr")).toBe("Alt Gr tuşunu basılı tut ve 5 tuşuna bas.");
    expect(unitHowToTypeTr("'", "tr")).toBe("Shift tuşunu basılı tut ve 2 tuşuna bas.");
    expect(fingerGuideTr("₺", false, "tr")).toMatch(/^Türk lirası: sol işaret parmağı, Alt Gr tuşunu/);
  });

  it("ğ ı i: die Ansage nennt den Namen, den Finger und die Taste - ein Kind mit Blindheit weiss, welche Taste „noktalı“ und welche „noktasız“ ist", () => {
    setLayout("tr-q");
    expect(fingerGuideTr("ı", false, "tr")).toMatch(/^noktasız ı: sağ orta parmak, K tuşundan\.$/);
    expect(fingerGuideTr("i", false, "tr")).toMatch(/^noktalı i: /);
    expect(fingerGuideTr("ğ", false, "tr")).toMatch(/^yumuşak ge: sağ serçe parmak/);
  });
});
