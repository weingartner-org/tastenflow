/**
 * ★★★ WÄCHTER der Bedienungssprache - Erkennung, Speicher, Merker eines
 * bekannten Geräts, Vollständigkeit der Tabellen und `<html lang>` (Bauplan
 * 12.09.2026, §5 Nr 1, 2, 5; ohne Probe-Schalter seit 19.09.2026).
 *
 * Bauplan: `BAUPLAN-2026-09-12-ENGLISCHE-BEDIENUNG-PROBESTUECK.md`. Der
 * Deutsch-Fänger über die gerenderte Übungsseite steht getrennt in
 * `tests/tastenflow-englische-bedienung.test.tsx`, der Schalter für alle in
 * `tests/tastenflow-sprache-fuer-alle.test.tsx`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { act, cleanup, render } from "@testing-library/react";
import {
  BEDIENUNG_SCHLUESSEL,
  BedienSpracheProvider,
  adressWahlLesen,
  anfangsSprache,
  aktuelleBedienSprache,
  erkenneBedienSprache,
  geraetKenntTastenflow,
  gespeicherteWahl,
  istTastenflowMerker,
  mehrzahl,
  texte,
  useBedienSprache,
  wahlMerken,
  zahl,
} from "../src/lib/bedienSprache";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute("lang", "de");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Ein Browser mit dieser Sprachliste (`tests/setup.ts` setzt sonst ["de-AT", "de"]). */
function browserMit(sprachen: string[]) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(sprachen);
}

describe("§5.1 Erkennung aus der Sprachliste des Browsers (Johannes 19.09.2026)", () => {
  // „erste und zweite und wenn da auch dritte Sprache - und wenn Deutsch vor
  // Englisch kommt, mach Deutsch"; „alles andere wie Deutsch wird automatisch
  // Englisch".
  it.each([
    [["de-AT"], "de"],
    [["tr", "de"], "de"],
    [["tr", "de", "en"], "de"],
    [["en-US", "de-AT"], "en"], // Englisch VOR Deutsch
    [["tr", "en", "de"], "en"],
    [["fr", "tr"], "en"], // weder noch ⇒ Englisch
    [["tr"], "en"],
    [["en-US"], "en"],
    [[], "de"], // leere Liste: die Sprache, in der die App gebaut ist
    [["DE"], "de"],
    [["de_CH"], "de"],
    [["del"], "en"], // „del" ist kein Deutsch
    [["enm", "de"], "de"], // „enm" ist kein Englisch - also zählt das Deutsch dahinter
  ] as const)("%j ⇒ %s", (liste, erwartet) => {
    expect(erkenneBedienSprache(liste)).toBe(erwartet);
  });

  it("die gespeicherte Wahl schlägt alles", () => {
    expect(anfangsSprache({ gespeichert: "de", bekanntesGeraet: false, sprachen: ["en-GB"] })).toBe("de");
    expect(anfangsSprache({ gespeichert: "en", bekanntesGeraet: true, sprachen: ["de-AT"] })).toBe("en");
  });

  it("★★★ bekanntes Gerät ohne Wahl ⇒ Deutsch, auch mit englischem Browser", () => {
    expect(anfangsSprache({ gespeichert: null, bekanntesGeraet: true, sprachen: ["en-US"] })).toBe("de");
  });

  it("neues Gerät ohne Wahl ⇒ die Erkennung", () => {
    expect(anfangsSprache({ gespeichert: null, bekanntesGeraet: false, sprachen: ["en-GB"] })).toBe("en");
    expect(anfangsSprache({ gespeichert: null, bekanntesGeraet: false, sprachen: ["tr", "de"] })).toBe("de");
  });
});

describe("§5.1 Die Merker eines Geräts, das Tastenflow schon kennt", () => {
  it.each([
    "tippen-einrichtung",
    "tippen-trainer:v1",
    "tippen-voice",
    "tippen-a11y",
    "tastenflow:topf:bilanz",
    "tastenflow:topf:geraet",
    "tastenflow-neuigkeiten-gesehen:abc",
    "tt_pb_auth",
    "tt_merkfenster",
    "sensorik:tippen:fingerfarben",
    "px-journey-visited",
  ])("%s zählt", (k) => {
    expect(istTastenflowMerker(k)).toBe(true);
    localStorage.setItem(k, "x");
    expect(geraetKenntTastenflow()).toBe(true);
  });

  it.each([BEDIENUNG_SCHLUESSEL, "sensorik-theme", "punktgenau-irgendwas", "braille-stand"])(
    "%s zählt NICHT",
    (k) => {
      expect(istTastenflowMerker(k)).toBe(false);
      localStorage.setItem(k, "x");
      expect(geraetKenntTastenflow()).toBe(false);
    },
  );

  it("aktuelleBedienSprache (für das Backend) folgt derselben Reihenfolge", () => {
    browserMit(["en-GB"]);
    expect(aktuelleBedienSprache()).toBe("en");
    localStorage.setItem("tippen-einrichtung", "v1");
    expect(aktuelleBedienSprache()).toBe("de");
    wahlMerken("en");
    expect(aktuelleBedienSprache()).toBe("en");
  });
});

describe("§5.1 Speicher", () => {
  it("gesperrter Speicher (Safari privat): kein Absturz, Wahl vergessen, kein bekanntes Gerät", () => {
    const wirft = () => {
      throw new DOMException("gesperrt", "SecurityError");
    };
    // Ein Merker liegt da - lesen lässt er sich aber nicht.
    localStorage.setItem("tippen-einrichtung", "v1");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(wirft);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(wirft);
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(wirft);
    // `tests/setup.ts` setzt einen eigenen Speicher ein - dessen Methoden sind
    // eigene Eigenschaften, nicht die des Prototyps. Darum auch direkt sperren.
    const speicher = window.localStorage;
    const echt = { g: speicher.getItem, s: speicher.setItem, r: speicher.removeItem, k: speicher.key };
    speicher.getItem = wirft;
    speicher.setItem = wirft;
    speicher.removeItem = wirft;
    speicher.key = wirft;
    try {
      expect(() => wahlMerken("en")).not.toThrow();
      expect(gespeicherteWahl()).toBeNull();
      expect(geraetKenntTastenflow()).toBe(false);
      // Die Adresse wirkt trotzdem - nur merken geht nicht.
      expect(adressWahlLesen("?bedienung=en")).toBe("en");
    } finally {
      speicher.getItem = echt.g;
      speicher.setItem = echt.s;
      speicher.removeItem = echt.r;
      speicher.key = echt.k;
    }
  });

  it("gespeicherte Wahl: nur „de\" oder „en\" zählen", () => {
    localStorage.setItem(BEDIENUNG_SCHLUESSEL, "fr");
    expect(gespeicherteWahl()).toBeNull();
    wahlMerken("en");
    expect(gespeicherteWahl()).toBe("en");
  });
});

describe("§5.2 Vollständigkeit der Tabellen - ein fehlender Schlüssel ist ein tsc-Fehler", () => {
  it("eine vollständige Tabelle geht durch, Funktionen mit Platzhaltern inklusive", () => {
    const T = texte({
      de: { hilfe: "Hilfe", zeilen: (n: number) => `${n} Zeilen` },
      en: { hilfe: "Help", zeilen: (n: number) => `${n} lines` },
    });
    expect(T.en.hilfe).toBe("Help");
    expect(T.de.zeilen(3)).toBe("3 Zeilen");
  });

  it("★★★ fehlt ein englischer Schlüssel, meldet tsc einen Fehler (der Build prüft die Tests mit)", () => {
    // Fällt diese Zeile NICHT mehr auf, meldet tsc „Unused '@ts-expect-error'
    // directive" - der Wächter kann also nicht still grün werden.
    const T = texte({
      de: { hilfe: "Hilfe", konto: "Konto" },
      // @ts-expect-error - „konto" fehlt in der englischen Tabelle
      en: { hilfe: "Help" },
    });
    expect(T.de.konto).toBe("Konto");
  });

  it("★ ein falscher Platzhalter-Typ ist ebenfalls ein Fehler", () => {
    const T = texte({
      de: { zeilen: (n: number) => `${n} Zeilen` },
      // @ts-expect-error - die englische Fassung muss eine Zahl annehmen und Text liefern
      en: { zeilen: (n: number) => n },
    });
    expect(T.de.zeilen(1)).toBe("1 Zeilen");
  });

  it("Mehrzahl über Intl.PluralRules, Zahlen über Intl.NumberFormat", () => {
    const formen = {
      de: { one: (z: string) => `${z} neue Nachricht`, other: (z: string) => `${z} neue Nachrichten` },
      en: { one: (z: string) => `${z} new message`, other: (z: string) => `${z} new messages` },
    };
    expect(mehrzahl(1, "de", formen.de)).toBe("1 neue Nachricht");
    expect(mehrzahl(2, "de", formen.de)).toBe("2 neue Nachrichten");
    expect(mehrzahl(0, "en", formen.en)).toBe("0 new messages");
    expect(mehrzahl(1, "en", formen.en)).toBe("1 new message");
    expect(zahl(1234567, "en")).toBe("1,234,567");
  });
});

/** Zeigt, was der Haken liefert - als Attribute, damit der Test es ablesen kann. */
function Anzeige() {
  const { sprache, bereichAktiv } = useBedienSprache();
  return createElement("output", { "data-sprache": sprache, "data-aktiv": String(bereichAktiv) });
}

describe("§5.5 Provider, Vorgabe ohne Provider und <html lang>", () => {
  it("ohne Provider gilt Deutsch - die anderen vier Apps merken nichts", () => {
    const { container } = render(createElement(Anzeige));
    const o = container.querySelector("output")!;
    expect(o.dataset.sprache).toBe("de");
    expect(o.dataset.aktiv).toBe("false");
  });

  it("★★ deutscher Browser (die Vorgabe der Tests): Deutsch, <html lang> bleibt „de\"", () => {
    expect(navigator.languages[0]).toBe("de-AT");
    const { container, unmount } = render(
      createElement(BedienSpracheProvider, null, createElement(Anzeige)),
    );
    expect(container.querySelector("output")!.dataset.sprache).toBe("de");
    expect(container.querySelector("output")!.dataset.aktiv).toBe("true");
    expect(document.documentElement.getAttribute("lang")).toBe("de");
    unmount();
    expect(document.documentElement.getAttribute("lang")).toBe("de");
  });

  it("★★★ neues Gerät, englischer Browser: <html lang> folgt der Bedienung und wird beim Verlassen zurückgesetzt", () => {
    browserMit(["en-US"]);
    document.documentElement.setAttribute("lang", "de");
    const { container, unmount } = render(
      createElement(BedienSpracheProvider, null, createElement(Anzeige)),
    );
    expect(container.querySelector("output")!.dataset.sprache).toBe("en");
    expect(document.documentElement.getAttribute("lang")).toBe("en");
    // ★ Die Erkennung wird gemerkt - sie bleibt stabil.
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBe("en");
    unmount();
    expect(document.documentElement.getAttribute("lang")).toBe("de");
  });

  it("★ Umschalten merkt die Wahl, <html lang> zieht nach, Zurücksetzen bleibt beim alten Wert", () => {
    browserMit(["en-US"]);
    document.documentElement.setAttribute("lang", "de-AT");
    let setze: (s: "de" | "en") => void = () => {};
    function Schalter() {
      const w = useBedienSprache();
      setze = w.setzeSprache;
      return null;
    }
    const { unmount } = render(
      createElement(BedienSpracheProvider, null, createElement(Schalter)),
    );
    expect(document.documentElement.getAttribute("lang")).toBe("en");
    act(() => setze("de"));
    expect(document.documentElement.getAttribute("lang")).toBe("de");
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBe("de");
    unmount();
    expect(document.documentElement.getAttribute("lang")).toBe("de-AT");
  });

  it("<html> ohne lang-Attribut: nach dem Verlassen wieder ohne", () => {
    wahlMerken("en");
    document.documentElement.removeAttribute("lang");
    const { unmount } = render(createElement(BedienSpracheProvider, null, createElement(Anzeige)));
    expect(document.documentElement.getAttribute("lang")).toBe("en");
    unmount();
    expect(document.documentElement.hasAttribute("lang")).toBe(false);
  });
});

describe("§5.1 ?bedienung=en - die Sprache über die Adresse wählen (NVDA-Prüfstand, Test-Link)", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("adressWahlLesen: nur „de\" oder „en\", und die Wahl wird gemerkt", () => {
    expect(adressWahlLesen("?bedienung=en")).toBe("en");
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBe("en");
    expect(adressWahlLesen("?bedienung=fr")).toBeNull();
    expect(adressWahlLesen("")).toBeNull();
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBe("en");
  });

  it("★★ ?bedienung=en wirkt auf einem deutschen Gerät - englisch und gemerkt", () => {
    window.history.replaceState(null, "", "/programme/tastenflow?bedienung=en");
    const { container } = render(createElement(BedienSpracheProvider, null, createElement(Anzeige)));
    expect(container.querySelector("output")!.dataset.sprache).toBe("en");
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBe("en");
    expect(document.documentElement.getAttribute("lang")).toBe("en");
  });

  it("?bedienung schlägt die Erkennung UND eine ältere gespeicherte Wahl", () => {
    browserMit(["en-US"]);
    localStorage.setItem(BEDIENUNG_SCHLUESSEL, "en");
    window.history.replaceState(null, "", "/programme/tastenflow?bedienung=de");
    const { container } = render(createElement(BedienSpracheProvider, null, createElement(Anzeige)));
    expect(container.querySelector("output")!.dataset.sprache).toBe("de");
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBe("de");
  });
});

describe("EN0 · `aktiv` und `wechsle` - der EINE Provider in `Root` (18.09.2026)", () => {
  it("★★★ nicht aktiv (fremde App): trotz englischer Wahl Deutsch, <html lang> unberührt", () => {
    localStorage.setItem(BEDIENUNG_SCHLUESSEL, "en");
    document.documentElement.setAttribute("lang", "de");
    const { container } = render(
      createElement(BedienSpracheProvider, { aktiv: false, children: createElement(Anzeige) }),
    );
    const o = container.querySelector("output")!;
    expect(o.dataset.sprache).toBe("de");
    expect(o.dataset.aktiv).toBe("false");
    expect(document.documentElement.getAttribute("lang")).toBe("de");
  });

  it("★ nicht aktiv: die Erkennung wird NICHT gemerkt - der Speicher der anderen Apps bleibt unberührt", () => {
    browserMit(["en-US"]);
    render(createElement(BedienSpracheProvider, { aktiv: false, children: createElement(Anzeige) }));
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBeNull();
  });

  it("★ aktiv ⇄ nicht aktiv: <html lang> folgt beim Hineingehen und kommt beim Hinausgehen zurück", () => {
    localStorage.setItem(BEDIENUNG_SCHLUESSEL, "en");
    document.documentElement.setAttribute("lang", "de-AT");
    const { rerender } = render(
      createElement(BedienSpracheProvider, { aktiv: true, children: createElement(Anzeige) }),
    );
    expect(document.documentElement.getAttribute("lang")).toBe("en");
    rerender(createElement(BedienSpracheProvider, { aktiv: false, children: createElement(Anzeige) }));
    expect(document.documentElement.getAttribute("lang")).toBe("de-AT");
    rerender(createElement(BedienSpracheProvider, { aktiv: true, children: createElement(Anzeige) }));
    expect(document.documentElement.getAttribute("lang")).toBe("en");
  });

  it("★★ wechsle: stellt um, merkt es und sagt es in der ZIELSPRACHE - über die hereingereichte Stimme", () => {
    localStorage.setItem(BEDIENUNG_SCHLUESSEL, "de");
    const sprich = vi.fn();
    let wechsle: (s: "de" | "en") => void = () => {};
    function Schalter() {
      wechsle = useBedienSprache().wechsle;
      return createElement(Anzeige);
    }
    const { container } = render(
      createElement(BedienSpracheProvider, { sprich, children: createElement(Schalter) }),
    );
    act(() => wechsle("en"));
    expect(container.querySelector("output")!.dataset.sprache).toBe("en");
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBe("en");
    expect(sprich).toHaveBeenCalledWith("Buttons and menus are now in English.", "en");
  });

  it("wechsle auf einer fremden Adresse (nicht aktiv) tut nichts - kein Satz, kein Speicher", () => {
    const sprich = vi.fn();
    let wechsle: (s: "de" | "en") => void = () => {};
    function Schalter() {
      wechsle = useBedienSprache().wechsle;
      return null;
    }
    render(
      createElement(BedienSpracheProvider, { aktiv: false, sprich, children: createElement(Schalter) }),
    );
    act(() => wechsle("en"));
    expect(sprich).not.toHaveBeenCalled();
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBeNull();
  });
});
