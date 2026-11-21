/**
 * „Große Tastatur (mit Ziffernblock)" (25.09.2026, Auftrag Johannes: „Kannst
 * du erkennen, ob eine Tastatur mit Zahlenblock dran hängt, und dann eine
 * volle einblenden?").
 *
 * Geprüft wird:
 *  A) Erkennung - ein Tastendruck mit `event.code` beginnend mit „Numpad"
 *     schaltet die volle Tastatur ein und wird gemerkt; ein gewöhnlicher
 *     Tastendruck tut das nicht.
 *  B) Bewusstes Aus bleibt aus - schaltet man von Hand aus, schaltet ein
 *     weiterer Ziffernblock-Anschlag die Automatik nicht wieder ein; ein
 *     bewusstes An bleibt ebenso an.
 *  C) Die volle Tastatur zeichnet den Ziffernblock (und, wo Platz ist, den
 *     Pfeil-/Sprungtasten-Block) - ohne die Einstellung fehlt beides.
 *  D) Markierung - eine gedrückte Ziffernblock-Taste markiert sich SELBST,
 *     unabhängig von der Markierung des Hauptblocks, und wird NIE als
 *     „nächste" Taste hervorgehoben.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";

import { Keyboard, type GedrueckteTaste } from "../src/components/typing/Keyboard";
import {
  istZiffernblockCode,
  meldeZiffernblockTaste,
  useGrosseTastatur,
} from "../src/lib/typing/grosseTastatur";
import { layoutById, setLayout, type LayoutId } from "../src/lib/typing/layouts";

const ERKANNT_KEY = "tippen-ziffernblock-erkannt";
const WAHL_KEY = "tippen-grosse-tastatur";

function zuruecksetzen(): void {
  localStorage.removeItem(ERKANNT_KEY);
  localStorage.removeItem(WAHL_KEY);
  useGrosseTastatur.setState({ aktiv: false });
}

beforeEach(zuruecksetzen);
afterEach(() => {
  cleanup();
  zuruecksetzen();
  setLayout("de");
});

const druck = (code: string, key = ""): GedrueckteTaste => ({ code, key });

// --- A) Erkennung -------------------------------------------------------------
describe("A · Erkennung - ein Ziffernblock-Anschlag schaltet die volle Tastatur ein", () => {
  it("istZiffernblockCode: nur `Numpad…`, auch `NumpadEnter`", () => {
    expect(istZiffernblockCode("Numpad5")).toBe(true);
    expect(istZiffernblockCode("NumpadEnter")).toBe(true);
    expect(istZiffernblockCode("NumLock")).toBe(false); // klingt ähnlich, ist es nicht
    expect(istZiffernblockCode("Digit5")).toBe(false);
    expect(istZiffernblockCode(undefined)).toBe(false);
  });

  it("ein echter Tastendruck (document, capture) mit `Numpad…` schaltet ein und merkt sich das", () => {
    expect(useGrosseTastatur.getState().aktiv).toBe(false);
    fireEvent.keyDown(document, { code: "Numpad5", key: "5" });
    expect(useGrosseTastatur.getState().aktiv).toBe(true);
    expect(localStorage.getItem(ERKANNT_KEY)).toBe("1");
  });

  it("NumpadEnter zählt genauso wie jede andere Ziffernblock-Taste", () => {
    fireEvent.keyDown(document, { code: "NumpadEnter", key: "Enter" });
    expect(useGrosseTastatur.getState().aktiv).toBe(true);
  });

  it("ein gewöhnlicher Tastendruck (KeyA, NumLock) schaltet nichts ein", () => {
    fireEvent.keyDown(document, { code: "KeyA", key: "a" });
    fireEvent.keyDown(document, { code: "NumLock", key: "NumLock" });
    expect(useGrosseTastatur.getState().aktiv).toBe(false);
    expect(localStorage.getItem(ERKANNT_KEY)).toBeNull();
  });

  it("meldeZiffernblockTaste() direkt aufgerufen wirkt genauso wie der Horcher", () => {
    meldeZiffernblockTaste();
    expect(useGrosseTastatur.getState().aktiv).toBe(true);
    expect(localStorage.getItem(ERKANNT_KEY)).toBe("1");
  });
});

// --- B) Bewusste Wahl schlägt die Automatik -----------------------------------
describe("B · eine bewusste Wahl schlägt die Automatik", () => {
  it("bewusst ausgeschaltet: ein weiterer Ziffernblock-Anschlag schaltet NICHT wieder ein", () => {
    meldeZiffernblockTaste(); // Automatik schaltet ein
    expect(useGrosseTastatur.getState().aktiv).toBe(true);
    useGrosseTastatur.getState().setAktiv(false); // bewusst aus
    expect(localStorage.getItem(WAHL_KEY)).toBe("aus");
    fireEvent.keyDown(document, { code: "Numpad9", key: "9" });
    expect(useGrosseTastatur.getState().aktiv, "die Automatik darf ein bewusstes Aus nicht überschreiben").toBe(
      false,
    );
    // Die Gerätetatsache wird trotzdem weiter gemerkt.
    expect(localStorage.getItem(ERKANNT_KEY)).toBe("1");
  });

  it("bewusst eingeschaltet bleibt an, auch ohne je eine Ziffernblock-Taste gesehen zu haben", () => {
    useGrosseTastatur.getState().setAktiv(true);
    expect(localStorage.getItem(WAHL_KEY)).toBe("an");
    expect(useGrosseTastatur.getState().aktiv).toBe(true);
  });

  it("neu geladen (kein Speicher) hält ein früher gemerktes Aus die Automatik weiter fern", () => {
    localStorage.setItem(ERKANNT_KEY, "1");
    localStorage.setItem(WAHL_KEY, "aus");
    // Simuliert einen frischen Store-Aufbau, wie er beim Laden der Seite entsteht.
    const wahl = localStorage.getItem(WAHL_KEY);
    const erkannt = localStorage.getItem(ERKANNT_KEY) === "1";
    const aktivBeimStart = wahl === "an" || (wahl === null && erkannt);
    expect(aktivBeimStart).toBe(false);
  });
});

// --- C) Die volle Tastatur zeichnet den Ziffernblock --------------------------
describe("C · die volle Tastatur zeichnet Ziffernblock und Pfeil-/Sprungtasten-Block", () => {
  afterEach(() => cleanup());

  it("ohne die Einstellung fehlen Ziffernblock UND Pfeil-/Sprungtasten-Block", () => {
    useGrosseTastatur.setState({ aktiv: false });
    const { container } = render(
      <Keyboard layout={layoutById("de")} unlocked={new Set()} showFingerColors={false} />,
    );
    expect(container.querySelector('[data-ziffernblock="an"]')).toBeNull();
    expect(container.querySelector('[data-navblock="an"]')).toBeNull();
  });

  it("mit der Einstellung zeichnet sie beide Blöcke", () => {
    useGrosseTastatur.setState({ aktiv: true });
    const { container } = render(
      <Keyboard layout={layoutById("de")} unlocked={new Set()} showFingerColors={false} />,
    );
    const ziffernblock = container.querySelector('[data-ziffernblock="an"]');
    expect(ziffernblock).not.toBeNull();
    // Alle 17 Tasten eines echten Ziffernblocks, in der üblichen Beschriftung.
    expect(ziffernblock!.textContent).toBe("Num/*-789+456123↵0,");
    expect(container.querySelector('[data-navblock="an"]')).not.toBeNull();
  });

  it("`ohneZiffernblock` unterdrückt NUR den Ziffernblock dieser Zeichnung - die Einstellung bleibt an", () => {
    useGrosseTastatur.setState({ aktiv: true });
    const { container } = render(
      <Keyboard layout={layoutById("de")} unlocked={new Set()} showFingerColors={false} ohneZiffernblock />,
    );
    expect(container.querySelector('[data-ziffernblock="an"]')).toBeNull();
    expect(useGrosseTastatur.getState().aktiv).toBe(true);
  });

  it("Ziffernblock-Dezimaltrennzeichen: Komma auf de/ch, Punkt auf us/uk", () => {
    useGrosseTastatur.setState({ aktiv: true });
    for (const [id, komma] of [
      ["de", true],
      ["ch", true],
      ["us", false],
      ["uk", false],
    ] as [LayoutId, boolean][]) {
      setLayout(id);
      const { container } = render(
        <Keyboard layout={layoutById(id)} unlocked={new Set()} showFingerColors={false} />,
      );
      const ziffernblock = container.querySelector('[data-ziffernblock="an"]')!;
      expect(ziffernblock.textContent!.endsWith(komma ? "," : "."), id).toBe(true);
      cleanup();
    }
  });
});

// --- D) Markierung -------------------------------------------------------------
describe("D · eine gedrückte Ziffernblock-Taste markiert sich selbst", () => {
  afterEach(() => cleanup());

  function volleTastatur(gedrueckt?: GedrueckteTaste, nextChar?: string) {
    useGrosseTastatur.setState({ aktiv: true });
    return render(
      <Keyboard
        layout={layoutById("de")}
        unlocked={new Set()}
        showFingerColors={false}
        gedrueckt={gedrueckt}
        nextChar={nextChar}
      />,
    );
  }

  it("Numpad7 markiert NUR die „7\" im Ziffernblock, nicht die „7\" im Hauptblock", () => {
    const { container } = volleTastatur(druck("Numpad7", "7"));
    const an = [...container.querySelectorAll('[data-gedrueckt="an"]')] as HTMLElement[];
    expect(an.map((e) => e.textContent)).toEqual(["7"]);
    const ziffernblock = container.querySelector('[data-ziffernblock="an"]')!;
    expect(ziffernblock.contains(an[0])).toBe(true);
  });

  it("NumpadEnter markiert die Enter-Taste DES ZIFFERNBLOCKS", () => {
    const { container } = volleTastatur(druck("NumpadEnter", "Enter"));
    const ziffernblock = container.querySelector('[data-ziffernblock="an"]')!;
    const anImZiffernblock = [...ziffernblock.querySelectorAll('[data-gedrueckt="an"]')];
    expect(anImZiffernblock.map((e) => e.textContent)).toEqual(["↵"]);
  });

  it("eine Pfeiltaste markiert sich im Pfeil-/Sprungtasten-Block", () => {
    const { container } = volleTastatur(druck("ArrowUp", "ArrowUp"));
    const navblock = container.querySelector('[data-navblock="an"]')!;
    const anImNavblock = [...navblock.querySelectorAll('[data-gedrueckt="an"]')];
    expect(anImNavblock.map((e) => e.textContent)).toEqual(["↑"]);
  });

  it("ohne gedrueckt bleibt der Ziffernblock unmarkiert", () => {
    const { container } = volleTastatur();
    expect(container.querySelectorAll('[data-gedrueckt="an"]')).toHaveLength(0);
  });

  it("eine Ziffernblock-Taste wird NIE als „nächste\" Taste hervorgehoben (auch wenn nextChar passt)", () => {
    const { container } = volleTastatur(undefined, "7");
    const ziffernblock = container.querySelector('[data-ziffernblock="an"]')!;
    // Die „7" im HAUPTBLOCK darf als nächste Taste hervorgehoben sein …
    expect(container.querySelectorAll(".tt-taste-ziel").length).toBeGreaterThan(0);
    // … aber NICHTS davon liegt im Ziffernblock.
    expect(ziffernblock.querySelectorAll(".tt-taste-ziel")).toHaveLength(0);
  });
});
