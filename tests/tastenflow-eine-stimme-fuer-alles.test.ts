/**
 * ★★★★★ EINE STIMME FÜR DIE GANZE ÜBUNG (07.09.2026).
 *
 * Gemeldet von den Schülerinnen und Schülern: *„die Stimmen der Zeilenansage
 * sind extrem leise."* - „Stimmen", Mehrzahl. Am Live-Stand im Browser
 * nachgerechnet, und die Mehrzahl stimmte:
 *
 *   Zeilenansage  (`speakSequence`)   Anna (premium)
 *   Rückmeldung   (`speakUiAlways`)   Markus (erweitert)
 *
 * Zwei Wege, zwei Auswahlregeln, zwei Stimmen in derselben Übung. Die Ursache
 * war ein Zufall: In der Vorzugsliste stand „Mark" - der Name einer
 * WINDOWS-Stimme - und wurde als TEILWORT gegen die deutschen Stimmen
 * geprüft. „Markus" enthält „Mark". Eine englische Liste hat so die deutsche
 * Stimme bestimmt, und zwar nur auf einem der beiden Wege.
 *
 * ⚠️ DIE LAUTSTÄRKE ERKLÄRT DAS NICHT - auch das ist gemessen (mit `say`
 * ausgespielt, mit ffmpeg nachgerechnet: alle deutschen macOS-Stimmen liegen
 * innerhalb von gut einem Dezibel). `u.volume` wird nirgends gesetzt und steht
 * damit auf dem Höchstwert. Die einzige Schraube für die Lautstärke ist die
 * WAHL der Stimme - und die erreichte bisher nur den halben Weg: Wer im
 * Zahnrad eine andere Stimme wählte, hörte jede Rückmeldung unverändert mit
 * der alten.
 *
 * ── WAS DIESER WÄCHTER FESTNAGELT ─────────────────────────────────────────
 *
 *   1. Zeilenansage und Rückmeldung sprechen mit DERSELBEN Stimme.
 *   2. „Mark" trifft „Markus" nicht mehr (Wortgrenze statt Teilwort).
 *   3. Die gewählte Stimme gilt für BEIDE Wege.
 *   4. Sie gilt NICHT über die Sprachgrenze (Jens' Befund vom 29.08.2026:
 *      ein englischer Satz bekommt nie eine deutsche Stimme).
 *   5. Englischer INHALT bekommt eine englische Stimme - vorher fiel dieser
 *      Weg fest auf Deutsch zurück.
 *   6. Eine Scherzstimme („Flüstern") wird nie von selbst gewählt.
 *
 * ⚠️ Warum ein Verhaltenstest und kein Quelltext-Sweep: Geprüft wird, WELCHE
 * Stimme an der Utterance landet - also das, was das Kind hört. Ein Sweep über
 * Funktionsnamen wäre nach dem nächsten Umbenennen grün und trotzdem falsch.
 */
import { describe, it, expect, beforeEach } from "vitest";

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

/** Eine Stimme, wie die Browser sie melden. */
const stimme = (name: string, lang: string, isDefault = false, imNetz = false) =>
  ({
    name,
    lang,
    voiceURI: name,
    default: isDefault,
    localService: !imNetz,
  }) as SpeechSynthesisVoice;

/**
 * Die am 07.09.2026 auf dem Mac wirklich gemeldete Liste (gekürzt, Reihenfolge
 * unverändert) - „Anna (premium)" steht vorn und ist die Vorgabe des Geräts,
 * „Markus (erweitert)" weiter hinten. Genau diese Reihenfolge hat die beiden
 * Wege auseinanderlaufen lassen.
 */
let VOICES: SpeechSynthesisVoice[] = [];
const MAC_STIMMEN = () => [
  stimme("Anna (premium)", "de-DE", true),
  stimme("Anna", "de-DE"),
  stimme("Anna (erweitert)", "de-DE"),
  stimme("Flüstern", "de-DE"),
  stimme("Markus (erweitert)", "de-DE"),
  stimme("Petra (premium)", "de-DE"),
  stimme("Samantha", "en-US"),
  stimme("Daniel", "en-GB"),
];

/** Jede Utterance, die wirklich an der Engine ankam. */
const abgesetzt: FakeUtterance[] = [];

const fakeSynth = {
  speaking: false,
  pending: false,
  paused: false,
  getVoices: () => VOICES,
  speak(u: FakeUtterance) {
    if (u.volume === 0) return; // die lautlose Freischalt-Ansage
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

// Erst NACH dem Stub laden - voice.ts prüft `"speechSynthesis" in window`.
const { speakSequence, speakUiAlways, useVoice } = await import("@/lib/typing/voice");
const { setVorleseSprache } = await import("@/lib/typing/vorlesen");

/** Die Zeilenansage - der Weg, über den der Übungstext gesprochen wird. */
function zeilenansage(text = "Die Sonne scheint."): FakeUtterance {
  abgesetzt.length = 0;
  // „sofort" umgeht das Ruhefenster; geprüft wird die Stimmenwahl, nicht die Drossel.
  speakSequence([text], "sofort");
  expect(abgesetzt, "die Zeilenansage kam nicht an der Engine an").toHaveLength(1);
  return abgesetzt[0];
}

/** Eine Rückmeldung der App - Lob, Fehlerhinweis, Sterne. */
function rueckmeldung(text = "Geschafft."): FakeUtterance {
  abgesetzt.length = 0;
  speakUiAlways(text, undefined, undefined, "sofort");
  expect(abgesetzt, "die Rückmeldung kam nicht an der Engine an").toHaveLength(1);
  return abgesetzt[0];
}

describe("Eine Stimme für die ganze Übung", () => {
  beforeEach(() => {
    VOICES = MAC_STIMMEN();
    abgesetzt.length = 0;
    setVorleseSprache("de");
    useVoice.setState({ enabled: true, voiceURI: "" });
  });

  it("1. Zeilenansage und Rückmeldung sprechen mit DERSELBEN Stimme", () => {
    const zeile = zeilenansage();
    const lob = rueckmeldung();
    expect(zeile.voice?.name).toBeTruthy();
    expect(
      lob.voice?.name,
      "Übungstext und Lob dürfen nicht mit zwei Stimmen kommen - genau das " +
        "haben die Kinder gehört",
    ).toBe(zeile.voice?.name);
  });

  it("2. „Mark\" trifft „Markus\" nicht mehr - beide Wege nehmen Anna", () => {
    // Nur zwei deutsche Stimmen: die alte Teilwort-Regel hätte für die
    // Rückmeldung „Markus" gewählt (englische Liste), für die Zeile „Anna".
    VOICES = [stimme("Anna", "de-DE", true), stimme("Markus (erweitert)", "de-DE")];
    expect(zeilenansage().voice?.name).toBe("Anna");
    expect(rueckmeldung().voice?.name).toBe("Anna");
  });

  it("3. die im Zahnrad gewählte Stimme gilt für BEIDE Wege", () => {
    useVoice.setState({ voiceURI: "Petra (premium)" });
    expect(zeilenansage().voice?.name).toBe("Petra (premium)");
    expect(
      rueckmeldung().voice?.name,
      "Wer eine leise Stimme gegen eine lautere tauscht, muss die Rückmeldung " +
        "auch lauter hören",
    ).toBe("Petra (premium)");
  });

  it("4. die gewählte Stimme gilt NICHT über die Sprachgrenze", () => {
    // Eine englische Stimme gewählt, der Satz ist deutsch (Jens, 29.08.2026).
    useVoice.setState({ voiceURI: "Samantha" });
    const lob = rueckmeldung();
    expect(lob.voice?.name).not.toBe("Samantha");
    expect(lob.voice?.lang.slice(0, 2)).toBe("de");
  });

  it("5. englischer Inhalt bekommt eine englische Stimme", () => {
    setVorleseSprache("en");
    const zeile = zeilenansage("The sun is shining.");
    expect(
      zeile.voice?.lang.slice(0, 2),
      "der Übungstext fiel vorher fest auf eine deutsche Stimme zurück",
    ).toBe("en");
    expect(zeile.lang.slice(0, 2)).toBe("en");
  });

  it("5a. ★ 19.09.2026: Englisch spricht BRITISCH - Daniel (en-GB) vor Samantha (en-US)", () => {
    // EN10 hörte am Mac „Samantha", obwohl „Daniel" installiert war; britisches
    // Englisch gilt (Johannes, Frage 18). MAC_STIMMEN hat Samantha VOR Daniel.
    setVorleseSprache("en");
    const zeile = zeilenansage("The sun is shining.");
    expect(zeile.voice?.name).toBe("Daniel");
  });

  it("5b. ohne britische Stimme bleibt es bei einer anderen englischen", () => {
    VOICES = MAC_STIMMEN().filter((v) => v.lang !== "en-GB");
    setVorleseSprache("en");
    const zeile = zeilenansage("The sun is shining.");
    expect(zeile.voice?.name).toBe("Samantha");
  });

  it("7. eine Netz-Stimme wird nie von selbst gewählt - Windows/Edge", () => {
    /*
     * Edge meldet unter Windows „Microsoft Katja Online (Natural)" neben der
     * eingebauten „Microsoft Katja Desktop". Beide treffen den Vorzugsnamen
     * „Katja" - genommen werden muss die auf dem Gerät: Eine Netz-Stimme
     * braucht Internet, kostet Anlaufzeit und fällt im Schulnetz aus, ohne
     * dass jemand merkt, warum.
     */
    VOICES = [
      stimme("Microsoft Katja Online (Natural) - German (Germany)", "de-DE", true, true),
      stimme("Microsoft Katja Desktop - German", "de-DE"),
    ];
    expect(zeilenansage().voice?.name).toBe("Microsoft Katja Desktop - German");
    expect(rueckmeldung().voice?.name).toBe("Microsoft Katja Desktop - German");
  });

  it("7a. gibt es NUR Netz-Stimmen, wird trotzdem gesprochen", () => {
    VOICES = [stimme("Microsoft Hedda Online (Natural)", "de-DE", true, true)];
    expect(zeilenansage().voice?.name).toBe("Microsoft Hedda Online (Natural)");
  });

  it("7b. eine ausdrücklich gewählte Netz-Stimme bleibt gewählt", () => {
    VOICES = [
      stimme("Microsoft Katja Online (Natural)", "de-DE", false, true),
      stimme("Microsoft Katja Desktop", "de-DE", true),
    ];
    useVoice.setState({ voiceURI: "Microsoft Katja Online (Natural)" });
    expect(zeilenansage().voice?.name).toBe("Microsoft Katja Online (Natural)");
    expect(rueckmeldung().voice?.name).toBe("Microsoft Katja Online (Natural)");
  });

  it("6. eine Scherzstimme wird nie von selbst gewählt", () => {
    // „Flüstern" steht vorn und ist die Vorgabe des Geräts - trotzdem tabu.
    VOICES = [stimme("Flüstern", "de-DE", true), stimme("Yannick (erweitert)", "de-DE")];
    expect(zeilenansage().voice?.name).toBe("Yannick (erweitert)");
    expect(rueckmeldung().voice?.name).toBe("Yannick (erweitert)");
  });
});
