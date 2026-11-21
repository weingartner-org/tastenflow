/**
 * ★★★ E2b (25.09.2026, Bauplan D9/§9.3): erkennt „fr" jetzt WIRKLICH - aber
 * NUR mit dem Probe-Schalter des französischen Lehrgangs. Auftrag E2b Punkt 2.
 *
 * Getrennt von `tests/bedien-sprache-erkennung.test.ts` (der bleibt
 * unverändert grün - die dortigen Aufrufe ohne den Schalter zeigen weiter das
 * Verhalten von HEUTE, siehe dort §5.1 „weder noch ⇒ Englisch" und §5.1
 * „gespeicherte Wahl: nur de oder en zählen").
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  adressWahlLesen,
  anfangsSprache,
  erkenneBedienSprache,
  gespeicherteWahl,
  gespeicherteWahlRoh,
  oberflaechenSprache,
  wahlMerken,
  BEDIENUNG_SCHLUESSEL,
} from "../src/lib/bedienSprache/sprache";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

describe("erkenneBedienSprache: „fr-*“ NUR mit dem Schalter", () => {
  it.each([
    [["fr-FR"], false, "en"],
    [["fr-BE"], false, "en"],
    [["fr", "tr"], false, "en"],
    [["fr-FR"], true, "fr"],
    [["fr-BE"], true, "fr"],
    [["tr", "fr-CA"], true, "fr"],
  ] as const)("%j, Schalter=%s ergibt %s", (liste, an, erwartet) => {
    expect(erkenneBedienSprache(liste, an)).toBe(erwartet);
  });

  it("mit dem Schalter gilt weiter: Deutsch vor Französisch, Französisch vor Englisch", () => {
    expect(erkenneBedienSprache(["de", "fr"], true)).toBe("de");
    expect(erkenneBedienSprache(["fr", "en"], true)).toBe("fr");
  });

  it("ohne Angabe (wie bisher an jeder bestehenden Aufrufstelle) bleibt der Schalter aus", () => {
    expect(erkenneBedienSprache(["fr-FR"])).toBe("en");
  });
});

describe("?bedienung=fr NUR mit dem Schalter", () => {
  it("ohne den Schalter: wirkungslos, wie bisher (Gegenprobe zu bedien-sprache-erkennung.test.ts)", () => {
    expect(adressWahlLesen("?bedienung=fr")).toBeNull();
    expect(adressWahlLesen("?bedienung=fr", undefined, false)).toBeNull();
  });

  it("mit dem Schalter: wählt „fr“ und merkt es", () => {
    expect(adressWahlLesen("?bedienung=fr", undefined, true)).toBe("fr");
    expect(localStorage.getItem(BEDIENUNG_SCHLUESSEL)).toBe("fr");
  });

  it("mit dem Schalter: „de“/„en“ wirken unverändert, keine Schalter-Wirkung auf sie nötig", () => {
    expect(adressWahlLesen("?bedienung=en", undefined, true)).toBe("en");
    expect(adressWahlLesen("?bedienung=de", undefined, true)).toBe("de");
  });
});

describe("Speicherung wie bei de/en", () => {
  it("gespeicherteWahlRoh erkennt „fr“, gespeicherteWahl (eng, fürs Backend) NICHT", () => {
    wahlMerken("fr");
    expect(gespeicherteWahlRoh()).toBe("fr");
    expect(gespeicherteWahl()).toBeNull();
  });

  it("wahlMerken/gespeicherteWahlRoh: derselbe Weg wie de/en", () => {
    wahlMerken("de");
    expect(gespeicherteWahlRoh()).toBe("de");
    wahlMerken("en");
    expect(gespeicherteWahlRoh()).toBe("en");
    wahlMerken("fr");
    expect(gespeicherteWahlRoh()).toBe("fr");
  });

  it("gesperrter Speicher: kein Absturz, „fr“ bleibt ungemerkt (wie de/en)", () => {
    const speicher = window.localStorage;
    const echt = { g: speicher.getItem, s: speicher.setItem };
    const wirft = () => {
      throw new DOMException("gesperrt", "SecurityError");
    };
    speicher.getItem = wirft;
    speicher.setItem = wirft;
    try {
      expect(() => wahlMerken("fr")).not.toThrow();
      expect(gespeicherteWahlRoh()).toBeNull();
    } finally {
      speicher.getItem = echt.g;
      speicher.setItem = echt.s;
    }
  });
});

describe("anfangsSprache: eine gespeicherte „fr“-Wahl gewinnt immer (Regel 1, wie beim Lernweg D2)", () => {
  it("gespeichert „fr“ gewinnt, auch wenn der Schalter gerade aus ist", () => {
    expect(anfangsSprache({ gespeichert: "fr", bekanntesGeraet: false, sprachen: ["de"] })).toBe(
      "fr",
    );
  });

  it("ohne gespeicherte Wahl: Erkennung nur mit franzoesischAn", () => {
    expect(
      anfangsSprache({ gespeichert: null, bekanntesGeraet: false, sprachen: ["fr-FR"] }),
    ).toBe("en");
    expect(
      anfangsSprache({
        gespeichert: null,
        bekanntesGeraet: false,
        sprachen: ["fr-FR"],
        franzoesischAn: true,
      }),
    ).toBe("fr");
  });

  it("ein bekanntes Gerät bleibt Deutsch, auch mit dem Schalter (dieselbe Regel wie bei Englisch)", () => {
    expect(
      anfangsSprache({
        gespeichert: null,
        bekanntesGeraet: true,
        sprachen: ["fr-FR"],
        franzoesischAn: true,
      }),
    ).toBe("de");
  });
});

/**
 * ★ E11a-5 (26.09.2026): eingeschaltet - „fr" fällt NICHT mehr auf Englisch
 * zurück (Johannes F18). Bis E11a-4 stand hier `["fr", "en"]`.
 */
describe("oberflaechenSprache - seit E11a-5 ohne Rückfall", () => {
  it.each([
    ["de", "de"],
    ["en", "en"],
    ["fr", "fr"],
  ] as const)("%s ergibt %s", (bs, erwartet) => {
    expect(oberflaechenSprache(bs)).toBe(erwartet);
  });
});
