/**
 * ★★★★★ WÄCHTER F8 Polnisch (03.10.2026): die Sprachausgabe des Weges „pl" - Zeichennamen, Stimme, Ansage der AltGr-Buchstaben (Windows:
 * „prawy Alt", Mac: „Option"), der Hinweis beim Fehlgriff „a statt ą".
 *
 * Glossar `recherche-polnisch-2026-10-02/GLOSSAR-pl.md` §2.8 „Zeichennamen der Sprachausgabe", §3 Falle 1 („Ogonki nicht still erlassen -
 * mit Hinweis `prawy Alt + A`, nie mit `Źle!`"), §3 Falle 5 (AltGr ist kein Kürzel). Vorbild: `tests/tastenflow-sprachausgabe-it.test.ts`,
 * `tests/tastenflow-w2a-es-tilde-umschalt.test.tsx`. Was Etappe O Polnisch (O-PL) schon gebaut hat (`SPOKEN_PL`, `ANSAGEN.pl`,
 * `fingerGuidePl`, `unitHowToTypePl`), wird hier fest gehalten und um das ergänzt, was F8 offen liess: die Stimme (Zosia) und der Hinweis
 * `hinweisPolskaLiteraPl`, der bis hierher geschrieben, aber nirgends eingehängt war.
 *
 * ⚠️ Stimmen: GEMESSEN ist nur der Mac (`say -v '?'` nennt für pl_PL genau EINE Stimme: Zosia). Windows (die Messliste Z4 fragt nach Paulina
 * und Adam), iOS und Chrome sind ungemessen - dort greift der allgemeine Rückfall von `beste()`; hier wird nichts erfunden.
 *
 * ⚠️ Der Name von `ł`: das Glossar (§2.8) und der Code sagen „eł" (der Name des Buchstabens im polnischen Alphabet; `l` heisst „el"). Der
 * Auftrag der Etappe nannte als Beispiel „l przekreślone" - das ist die Beschreibung des Zeichens, nicht sein Name; das Glossar gilt.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";

const ton = vi.hoisted(() => ({ fehler: vi.fn() }));
vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: ton.fehler, playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { TypingSession } from "@/components/typing/TypingSession";
import { fingerGuidePl, spokenLabel } from "../src/lib/typing/fingers";
import { unitHowToTypePl } from "../src/lib/typing/freischaltungPl";
import { setLayout, setzeLayoutPlattform, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { hinweisPolskaLiteraPl, wegPolskiejLiteryPl } from "../src/lib/typing/tastenErklaerungPl";
import { polnischerBuchstabeHinweis, polnischerBuchstabeOhneOgonek } from "../src/lib/typing/totastenTexte";
import { ANSAGEN, ansage, ansageSchritt, ansageStart, ansageZeilenstand, setVorleseSprache, sprachTagFuer } from "../src/lib/typing/vorlesen";

afterEach(() => {
  cleanup();
  setzeLayoutPlattform(null);
  setLayout("de");
  setVorleseSprache("de");
  ton.fehler.mockClear();
  vi.restoreAllMocks();
});

const NEUN = "ąćęłńóśźż";

/* ══ 1 · die Zeichennamen ═══════════════════════════════════════════════ */

describe("1 · Zeichennamen: jedes Zeichen des Weges hat einen polnischen Namen, die neun Buchstaben am Ohr verschieden", () => {
  it("die neun polnischen Buchstaben tragen ausgeschriebene, voneinander verschiedene Namen (a/ą, e/ę, o/ó, s/ś, z/ź/ż am Ohr unterscheidbar)", () => {
    const namen = [...NEUN].map((k) => spokenLabel(k, "pl"));
    expect(namen).toEqual([
      "a z ogonkiem", "c z kreską", "e z ogonkiem", "eł", "n z kreską", "o z kreską", "s z kreską", "z z kreską", "z z kropką",
    ]);
    expect(new Set(namen).size).toBe(9);
    // und keiner ist gleich dem Namen seines Grundbuchstabens
    for (const [mit, ohne] of [["ą", "a"], ["ć", "c"], ["ę", "e"], ["ł", "l"], ["ń", "n"], ["ó", "o"], ["ś", "s"], ["ź", "z"], ["ż", "z"]]) {
      expect(spokenLabel(mit, "pl"), mit).not.toBe(spokenLabel(ohne, "pl"));
    }
  });

  it("grosse Buchstaben: Adjektiv zuerst („duże A“, wie NVDA), bei den polnischen Buchstaben „duże a z ogonkiem“", () => {
    expect(spokenLabel("A", "pl")).toBe("duże A");
    expect(spokenLabel("Q", "pl")).toBe("duże Q");
    expect(spokenLabel("Ą", "pl")).toBe("duże a z ogonkiem");
    expect(spokenLabel("Ł", "pl")).toBe("duże eł");
    expect(spokenLabel("Ż", "pl")).toBe("duże z z kropką");
  });

  it("Satzzeichen ohne AltGr tragen polnische Namen (Glossar §2.8: znak zapytania, nicht NVDAs „pytajnik“)", () => {
    expect(spokenLabel(".", "pl")).toBe("kropka");
    expect(spokenLabel(",", "pl")).toBe("przecinek");
    expect(spokenLabel("?", "pl")).toBe("znak zapytania");
    expect(spokenLabel("!", "pl")).toBe("wykrzyknik");
    expect(spokenLabel(":", "pl")).toBe("dwukropek");
    expect(spokenLabel(";", "pl")).toBe("średnik");
    expect(spokenLabel("-", "pl")).toBe("minus");
    expect(spokenLabel("'", "pl")).toBe("apostrof");
    expect(spokenLabel("\"", "pl")).toBe("cudzysłów");
    expect(spokenLabel(" ", "pl")).toBe("spacja");
    expect(spokenLabel("€", "pl")).toBe("euro");
  });

  it("★ jedes Satz- und Sonderzeichen der Reihenfolge hat einen Namen (nicht das nackte Zeichen); Ziffern und Buchstaben sagen sich selbst", () => {
    setLayout("pl");
    const fehlt: string[] = [];
    for (const u of introOrder("pl")) {
      if (u.length !== 1 || /\p{L}/u.test(u) || /[0-9]/.test(u) || u === "⇧") continue;
      if (spokenLabel(u, "pl") === u) fehlt.push(u);
    }
    expect(fehlt, "Zeichen ohne polnischen Namen").toEqual([]);
    expect(spokenLabel("7", "pl")).toBe("7");
    expect(spokenLabel("a", "pl")).toBe("a");
  });

  it("de, en, fr, es, it: dieselben Namen wie vorher (der Weg „pl“ hat nichts verschoben)", () => {
    expect(spokenLabel("ł", "en")).not.toBe(spokenLabel("ł", "pl"));
    expect(spokenLabel("ñ", "es")).toBe("eñe");
    expect(spokenLabel("ä", "de")).toBe("a Umlaut");
    expect(spokenLabel("à", "it")).toBe("a con accento grave");
  });
});

/* ══ 2 · die Ansagen ═══════════════════════════════════════════════════ */

describe("2 · Ansagen auf Polnisch (O-PL) - hier festgehalten", () => {
  it("ANSAGEN.pl trägt dieselben Schlüssel wie de, nichts bleibt leer, keine deutschen Umlaute", () => {
    expect(Object.keys(ANSAGEN.pl).sort()).toEqual(Object.keys(ANSAGEN.de).sort());
    for (const [key, satz] of Object.entries(ANSAGEN.pl)) {
      expect(satz.trim(), key).not.toBe("");
      expect(/[äöüß]/.test(satz), `${key}: ${satz}`).toBe(false);
    }
  });

  it("jeder Satz ist neu geschrieben - nie der deutsche, englische, spanische oder italienische", () => {
    for (const key of Object.keys(ANSAGEN.de) as (keyof typeof ANSAGEN.de)[]) {
      expect(ANSAGEN.pl[key], `wie Deutsch: ${key}`).not.toBe(ANSAGEN.de[key]);
      expect(ANSAGEN.pl[key], `wie Englisch: ${key}`).not.toBe(ANSAGEN.en[key]);
      expect(ANSAGEN.pl[key], `wie Spanisch: ${key}`).not.toBe(ANSAGEN.es[key]);
      expect(ANSAGEN.pl[key], `wie Italienisch: ${key}`).not.toBe(ANSAGEN.it[key]);
    }
  });

  it("die Vorlese-Sprache: ansage() folgt setVorleseSprache(\"pl\"), das Sprachkürzel der Stimme ist pl-PL", () => {
    setVorleseSprache("pl");
    expect(ansage("vorlesenAn")).toBe(ANSAGEN.pl.vorlesenAn);
    expect(sprachTagFuer("pl")).toBe("pl-PL");
  });

  it("Schritt, Start, Zeilenstand: ganze polnische Sätze, keine Ordnungszahl (nie „2.“ als „drugi“)", () => {
    expect(ansageSchritt(2, 5, "Klawiatura", "pl")).toBe("Krok 2 z 5: Klawiatura");
    expect(ansageStart("pozycja podstawowa", "pl")).toMatch(/pozycja podstawowa/);
    expect(ansageZeilenstand(3, 12, "pl")).toMatch(/Wiersz 3 z 12/);
  });
});

/* ══ 3 · die Stimme ═════════════════════════════════════════════════════ */

describe("3 · Stimmenwahl: Zosia am Mac, nie eine deutsche Stimme für polnischen Text", () => {
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
    setVorleseSprache("pl");
    abgesetzt.length = 0;
    speakSequence(["Dzień dobry, jak się masz?"], "sofort");
    expect(abgesetzt).toHaveLength(1);
    return abgesetzt[0];
  }

  it("Mac: Zosia wird gewählt - vor der Standard-Stimme", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Zosia", "pl-PL")]);
    expect(u.voice?.name).toBe("Zosia");
    expect(u.lang).toBe("pl-PL");
  });

  it("ohne Zosia: irgendeine polnische Stimme (keine deutsche), die des Geräts zuerst", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Microsoft Paulina - Polish (Poland)", "pl-PL")]);
    expect(u.voice?.lang.toLowerCase().startsWith("pl")).toBe(true);
  });

  it("nur eine deutsche und eine englische Stimme (Windows ohne polnische Stimme): KEINE Stimme gewählt - nie liest die deutsche Polnisch, lang bleibt pl-PL", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Daniel", "en-GB")]);
    expect(u.voice).toBeNull();
    expect(u.lang).toBe("pl-PL");
  });

  it("eine im Zahnrad GEWÄHLTE deutsche Stimme gilt nicht für polnischen Text (Jens' Befund vom 29.08.), die polnische schon", async () => {
    const u = await sprich([stimme("Anna", "de-DE", true), stimme("Zosia", "pl-PL")], "Anna");
    expect(u.voice?.name).toBe("Zosia");
    const v = await sprich([stimme("Zosia", "pl-PL"), stimme("Microsoft Adam", "pl-PL")], "Microsoft Adam");
    expect(v.voice?.name).toBe("Microsoft Adam");
  });

  it("Zeilenansage und Rückmeldung sprechen mit DERSELBEN Stimme (W14: keine Doppelstimme)", async () => {
    const { speakSequence, speakUiAlways, useVoice } = await import("../src/lib/typing/voice");
    VOICES = [stimme("Anna", "de-DE", true), stimme("Zosia", "pl-PL")];
    useVoice.setState({ enabled: true, voiceURI: "" });
    setVorleseSprache("pl");
    abgesetzt.length = 0;
    speakSequence(["Dzień dobry."], "sofort");
    speakUiAlways("Świetna robota!", undefined, "pl", "sofort");
    expect(abgesetzt).toHaveLength(2);
    expect(abgesetzt[0].voice?.name).toBe("Zosia");
    expect(abgesetzt[1].voice?.name).toBe("Zosia");
  });
});

/* ══ 4 · AltGr-Buchstaben: die Ansage ══════════════════════════════════ */

describe("4 · die neun Buchstaben: Ansage „prawy Alt + Buchstabe“ (Windows) und „Option + Buchstabe“ (Mac) - AltGr ist kein Kürzel", () => {
  it("Windows: die Finger-Ansage nennt den Buchstaben, den Finger, „prawy Alt“ (rechts neben der Leertaste) und die Grundtaste", () => {
    setLayout("pl");
    for (const [k, taste] of [["ą", "A"], ["ć", "C"], ["ę", "E"], ["ł", "L"], ["ń", "N"], ["ó", "O"], ["ś", "S"], ["ź", "X"], ["ż", "Z"]] as const) {
      const a = fingerGuidePl(k, false, "pl");
      expect(a, k).toContain(spokenLabel(k, "pl"));
      expect(a, k).toMatch(/przytrzymaj prawy Alt \(na prawo od spacji\)/);
      expect(a, k).toContain(`klawisz ${taste}.`);
    }
  });

  it("Mac: „klawisz Option“ statt „prawy Alt“, dieselbe Grundtaste", () => {
    setLayout("pl");
    setzeLayoutPlattform("mac");
    const a = fingerGuidePl("ą", false, "pl");
    expect(a).toMatch(/przytrzymaj klawisz Option/);
    expect(a).not.toMatch(/prawy Alt/);
    expect(a).toContain("klawisz A.");
  });

  it("die grossen Formen (Dreiergriff): zusätzlich die Shift-Taste der Gegenhand", () => {
    setLayout("pl");
    expect(fingerGuidePl("Ą", false, "pl")).toMatch(/do tego prawy Shift/);
    expect(fingerGuidePl("Ł", false, "pl")).toMatch(/do tego (lewy|prawy) Shift/);
    expect(fingerGuidePl("Ą", true, "pl")).toMatch(/do tego Shift/); // Einhand: neutral
  });

  it("die Freischalt-Karte sagt dasselbe in einem Satz („Przytrzymaj prawy Alt i naciśnij klawisz A.“)", () => {
    setLayout("pl");
    for (const k of NEUN) expect(unitHowToTypePl(k, "pl"), k).toMatch(/^Przytrzymaj prawy Alt i naciśnij klawisz [A-Z]\.$/);
    expect(unitHowToTypePl("Ą", "pl")).toMatch(/Shift/);
  });

  it("wegPolskiejLiteryPl und hinweisPolskaLiteraPl: der Weg je Plattform, `null` für alles andere", () => {
    setLayout("pl");
    expect(wegPolskiejLiteryPl("ą", "windows")).toBe("prawy Alt + A");
    expect(wegPolskiejLiteryPl("ą", "macos")).toBe("Option + A");
    expect(wegPolskiejLiteryPl("Ł", "windows")).toBe("prawy Alt + Shift + L");
    expect(wegPolskiejLiteryPl("ź", "windows")).toBe("prawy Alt + X");
    expect(hinweisPolskaLiteraPl("ę", "windows")).toBe("Litera ę: prawy Alt + E.");
    expect(wegPolskiejLiteryPl("a", "windows")).toBeNull();
    expect(wegPolskiejLiteryPl("ä", "windows")).toBeNull();
  });
});

/* ══ 5 · der Hinweis beim Fehlgriff ════════════════════════════════════ */

describe("5 · „a“ statt „ą“ ist ein Fehlgriff mit Hinweis auf den WEG - nie ein Ersatz, nie „Źle!“", () => {
  it("erkannt wird genau: erwartet ein polnischer Buchstabe, eingegeben sein Grundbuchstabe (gross oder klein; ź auch mit z)", () => {
    for (const [soll, ist] of [["ą", "a"], ["ć", "c"], ["ę", "e"], ["ł", "l"], ["ń", "n"], ["ó", "o"], ["ś", "s"], ["ź", "x"], ["ź", "z"], ["ż", "z"], ["Ą", "a"], ["Ł", "L"]]) {
      expect(polnischerBuchstabeOhneOgonek(soll, ist), `${soll} ← ${ist}`).toBe(true);
    }
    for (const [soll, ist] of [["ą", "b"], ["ą", "ą"], ["a", "ą"], ["a", "a"], ["ż", "x"], ["ł", "ł"], ["e", "ę"]]) {
      expect(polnischerBuchstabeOhneOgonek(soll, ist), `${soll} ← ${ist}`).toBe(false);
    }
  });

  it("der Hinweis steht in jeder Bedienungssprache, nennt die Zusatztaste der Plattform und die Taste", () => {
    setLayout("pl");
    expect(polnischerBuchstabeHinweis("pl", "ą", "a")).toBe("Litera ą: prawy Alt + A.");
    expect(polnischerBuchstabeHinweis("de", "ą", "a")).toBe("Buchstabe ą: rechte Alt-Taste (AltGr) + A.");
    expect(polnischerBuchstabeHinweis("en", "ł", "l")).toBe("Letter ł: right Alt (AltGr) + L.");
    expect(polnischerBuchstabeHinweis("fr", "ź", "x")).toBe("Lettre ź : Alt droite (AltGr) + X.");
    expect(polnischerBuchstabeHinweis("es", "ó", "o")).toBe("Letra ó: Alt derecha (AltGr) + O.");
    expect(polnischerBuchstabeHinweis("it", "ś", "s")).toBe("Lettera ś: Alt destro (AltGr) + S.");
    expect(polnischerBuchstabeHinweis("de", "Ą", "a")).toBe("Buchstabe Ą: rechte Alt-Taste (AltGr) + Umschalttaste + A.");
  });

  it("am Mac heisst die Zusatztaste Option", () => {
    setLayout("pl");
    setzeLayoutPlattform("mac");
    expect(polnischerBuchstabeHinweis("pl", "ę", "e")).toBe("Litera ę: Option + E.");
    expect(polnischerBuchstabeHinweis("de", "ę", "e")).toBe("Buchstabe ę: Optionstaste + E.");
    expect(polnischerBuchstabeHinweis("en", "ź", "z")).toBe("Letter ź: Option key + X.");
  });

  it("★ an der EIGENSCHAFT der Tastatur: auf jeder Tastatur, die den Buchstaben nicht über AltGr liefert, ist der Hinweis `null` (Falle 50)", () => {
    for (const layout of ["de", "us", "uk", "ch", "it", "es", "fr"] as LayoutId[]) {
      setLayout(layout);
      expect(polnischerBuchstabeHinweis("de", "ą", "a"), layout).toBeNull();
      expect(polnischerBuchstabeHinweis("de", "ł", "l"), layout).toBeNull();
    }
    setLayout("pl");
    expect(polnischerBuchstabeHinweis("de", "ą", "b")).toBeNull(); // ein anderer Fehlgriff
    expect(polnischerBuchstabeHinweis("de", "a", "ą")).toBeNull(); // nicht erwartet
  });
});

function sitzung(lernweg: "pl" | "de", items: string[] = ["ząb", "dom"]) {
  const r = render(
    <TypingSession
      items={items}
      contextId="test-f8-pl-ogonek"
      unlocked={new Set([..."abcdefghijklmnopqrstuvwxyząćęłńóśźż "])}
      shiftLearned={false}
      stufe={1 as never}
      voiceEnabled={false}
      lernweg={lernweg}
      onRetry={() => {}}
    />,
  );
  const feld = r.container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]');
  if (!feld) throw new Error("Übungsfeld nicht gefunden");
  return { feld, container: r.container };
}

async function druecke(feld: HTMLTextAreaElement, key: string, code?: string) {
  await act(async () => {
    fireEvent.keyDown(feld, { key, code });
  });
}

describe("6 · TypingSession: der Hinweis kommt dazu, der Fehler bleibt EINER", () => {
  it("Weg pl: „z“, dann „a“ an der Stelle von „ą“ ⇒ EIN Fehlerton, Hinweis sichtbar; danach geht „ą“ ganz normal", async () => {
    setLayout("pl");
    const { feld, container } = sitzung("pl");
    await druecke(feld, "z", "KeyZ");
    await druecke(feld, "a", "KeyA");
    expect(ton.fehler).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain(polnischerBuchstabeHinweis("de", "ą", "a")!);
    expect(feld.selectionStart).toBe(1); // steht weiter vor „ą“
    await druecke(feld, "ą", "KeyA");
    expect(feld.selectionStart).toBe(2);
    expect(ton.fehler).toHaveBeenCalledTimes(1);
  });

  it("Gegenprobe Weg pl: ein ANDERER Fehlgriff („b“ statt „ą“) bekommt keinen Hinweis", async () => {
    setLayout("pl");
    const { feld, container } = sitzung("pl");
    await druecke(feld, "z", "KeyZ");
    await druecke(feld, "b", "KeyB");
    expect(ton.fehler).toHaveBeenCalledTimes(1);
    expect(container.textContent).not.toContain("rechte Alt-Taste");
  });

  it("Gegenprobe: auf einer Tastatur ohne AltGr-Buchstaben (de) gibt es den Hinweis nicht - derselbe Fehlgriff ist ein gewöhnlicher", async () => {
    setLayout("de");
    const { feld, container } = sitzung("de", ["zahn", "dom"]);
    await druecke(feld, "z", "KeyY");
    await druecke(feld, "b", "KeyB");
    expect(ton.fehler).toHaveBeenCalledTimes(1);
    expect(container.textContent).not.toContain("rechte Alt-Taste");
  });
});
