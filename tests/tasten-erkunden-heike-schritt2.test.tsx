/**
 * ★ Testerin Rückmeldung „Tasten erkunden" (Test 24.10.2026), Schritt 2 vom
 * 28.10.2026 - die Texte:
 *  (1) Strg + Pfeil auf/ab springt einen Absatz, Strg + Pos1/Ende an Anfang und
 *      Ende vom ganzen Text - in JEDER Bedienungssprache.
 *  (2) Tastmarken auf F, J und der 5 im Ziffernblock - an der Lage erkannt, in
 *      jeder Sprache.
 *  (3) F11: im Browser, am Laptop oft mit Fn - in jeder Sprache.
 *  (4) Nur Deutsch: kaufmännisches Und, zweite Namen, senkrechter Strich.
 *  (5) Nur die deutsche Stimme sagt „Alt Gr", Schirm und Braillezeile bleiben AltGr.
 */
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const stimme = vi.hoisted(() => ({ ui: vi.fn() }));
vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: stimme.ui,
  speakUiAlways: vi.fn(),
}));

import { TastenErkunden, sprechformDe } from "../src/components/typing/TastenErkunden";
import { erkundeTaste, tastmarke } from "../src/lib/typing/tastenErklaerung";

afterEach(() => {
  cleanup();
  stimme.ui.mockClear();
});

const T = (key: string, code: string, mehr: Partial<{ shiftKey: boolean }> = {}) => ({
  key,
  code,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  ...mehr,
});
const SPRACHEN = [undefined, "en", "fr", "es", "it", "pl", "tr", "cs", "nl"] as const;
const brailleZeile = () => document.querySelector<HTMLTextAreaElement>("textarea[data-erkunden-zeile]")?.value ?? "";

describe("(1) Strg-Wege bei Pfeil auf/ab, Pos1 und Ende", () => {
  it("de: die vier Sätze", () => {
    expect(erkundeTaste(T("ArrowUp", "ArrowUp"), "windows").zeile).toMatch(/Mit Strg dazu springt sie einen Absatz nach oben\.$/);
    expect(erkundeTaste(T("ArrowDown", "ArrowDown"), "windows").zeile).toMatch(/Mit Strg dazu springt sie einen Absatz nach unten\.$/);
    expect(erkundeTaste(T("Home", "Home"), "windows").zeile).toMatch(/Mit Strg dazu springt sie an den Anfang vom ganzen Text\.$/);
    expect(erkundeTaste(T("End", "End"), "windows").zeile).toMatch(/Mit Strg dazu springt sie ans Ende vom ganzen Text\.$/);
  });

  it("Mac: der Absatz-Weg nennt die Wahltaste wie bei links/rechts", () => {
    const links = erkundeTaste(T("ArrowLeft", "ArrowLeft"), "macos").zeile;
    const auf = erkundeTaste(T("ArrowUp", "ArrowUp"), "macos").zeile;
    const wort = /Mit (\S+) dazu springt sie ein ganzes Wort/.exec(links)?.[1];
    expect(wort).toBeTruthy();
    expect(auf).toContain(`Mit ${wort} dazu springt sie einen Absatz nach oben.`);
  });

  for (const sprache of SPRACHEN) {
    it(`${sprache ?? "de"}: jede der vier Tasten hat einen Satz mehr als vorher (Ctrl/Strg kommt vor)`, () => {
      const optionen = sprache ? { sprache } : {};
      for (const key of ["ArrowUp", "ArrowDown", "Home", "End"]) {
        const zeile = erkundeTaste(T(key, key), "windows", optionen).zeile;
        expect(zeile, key).toMatch(/Strg|Ctrl/);
      }
    });
  }
});

describe("(2) Tastmarken", () => {
  it("de: F, J (auch gross) und Num 5 - andere Tasten nicht", () => {
    expect(erkundeTaste(T("f", "KeyF"), "windows").zeile).toBe(
      "f - Auf dieser Taste ist eine kleine Erhebung zum Ertasten. Hier liegt ein Zeigefinger.",
    );
    expect(erkundeTaste(T("J", "KeyJ", { shiftKey: true }), "windows").zeile).toMatch(/Hier liegt ein Zeigefinger\.$/);
    expect(erkundeTaste(T("5", "Numpad5"), "windows").zeile).toMatch(/Hier liegt der Mittelfinger\.$/);
    expect(erkundeTaste(T("5", "Digit5"), "windows").zeile).not.toMatch(/Erhebung/);
    expect(erkundeTaste(T("g", "KeyG"), "windows").zeile).toBe("g");
  });

  it("an der Lage erkannt: auf AZERTY trägt KeyF weiter die Marke", () => {
    expect(tastmarke(T("f", "KeyF"), "fr")).toMatch(/relief/);
    expect(tastmarke(T("a", "KeyQ"), "fr")).toBeNull();
  });

  for (const sprache of SPRACHEN) {
    it(`${sprache ?? "de"}: F, J und Num 5 bekommen einen Satz, G nicht`, () => {
      const optionen = sprache ? { sprache } : {};
      const ohne = erkundeTaste(T("g", "KeyG"), "windows", optionen).zeile;
      expect(erkundeTaste(T("f", "KeyF"), "windows", optionen).zeile.length).toBeGreaterThan(ohne.length + 10);
      expect(erkundeTaste(T("j", "KeyJ"), "windows", optionen).zeile.length).toBeGreaterThan(ohne.length + 10);
      expect(erkundeTaste(T("5", "Numpad5"), "windows", optionen).zeile.length).toBeGreaterThan(ohne.length + 10);
    });
  }
});

describe("(3) F11", () => {
  for (const sprache of SPRACHEN) {
    it(`${sprache ?? "de"}: nennt Fn`, () => {
      const optionen = sprache ? { sprache } : {};
      expect(erkundeTaste(T("F11", "F11"), "windows", optionen).zeile).toMatch(/\bFn\b/);
    });
  }
});

describe("(4) nur Deutsch: Testerin Wörter", () => {
  it("& heisst kaufmännisches Und, mit Firmennamen", () => {
    expect(erkundeTaste(T("&", "Digit6", { shiftKey: true }), "windows").zeile).toBe(
      "& - kaufmännisches Und - steht in Firmennamen, zum Beispiel Müller & Söhne. Im normalen Text schreibt man und aus.",
    );
  });

  it("zweite Namen: Raute, Umschalttaste, Feststelltaste, Löschtaste", () => {
    expect(erkundeTaste(T("#", "Backslash"), "windows").zeile).toMatch(/heißt auch Hashtag oder Nummernzeichen\.$/);
    expect(erkundeTaste(T("Shift", "ShiftLeft"), "windows").zeile).toMatch(/Sie heißt auch Großschreibtaste\.$/);
    expect(erkundeTaste(T("CapsLock", "CapsLock"), "windows").zeile).toMatch(/Sie heißt auch Dauergroßschreibtaste\.$/);
    expect(erkundeTaste(T("Backspace", "Backspace"), "windows").zeile).toMatch(/Sie heißt auch Rücktaste\.$/);
  });

  it("senkrechter Strich mit Namen", () => {
    expect(erkundeTaste(T("|", "IntlBackslash"), "windows", { altGr: true }).zeile).toMatch(/^\| - senkrechter Strich - /);
  });
});

describe("(5) Alt Gr nur für die deutsche Stimme", () => {
  it("sprechformDe", () => {
    expect(sprechformDe("AltGr-Taste - schreibt … mit AltGr + E.")).toBe("Alt Gr-Taste - schreibt … mit Alt Gr + E.");
    expect(sprechformDe("Alt-Taste")).toBe("Alt-Taste");
  });

  it("im Fenster: Braillezeile AltGr, Stimme Alt Gr", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    stimme.ui.mockClear();
    fireEvent.keyDown(document, T("AltGraph", "AltRight"));
    expect(brailleZeile()).toMatch(/AltGr-Taste/);
    const gesagt = stimme.ui.mock.calls.map((c) => String(c[0])).join(" ");
    expect(gesagt).toMatch(/Alt Gr-Taste/);
    expect(gesagt).not.toMatch(/AltGr/);
  });
});
