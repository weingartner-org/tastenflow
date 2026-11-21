/**
 * ★ Testerin Rückmeldung „Tasten erkunden" (Test 24.10.2026, Windows, JAWS aus),
 * Schritt 1 vom 27.10.2026:
 *  (1) Ziffernblock bei ausgeschaltetem Num: keine englischen Namen mehr
 *      („Taste ArrowDown"), sondern dieselbe Erklärung wie die eigene Taste;
 *      die 5 (`Clear`) bekommt einen eigenen Satz. In JEDER Bedienungssprache.
 *  (2) F5 wird geschluckt (steht in `tasten-erkunden-f-tasten.test.tsx`).
 *  (3) Die Menü-Taste öffnet kein Kontextmenü mehr.
 *  (4) Die Feststelltaste sagt, ob sie jetzt an oder aus ist.
 */
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: vi.fn(),
  speakUiAlways: vi.fn(),
}));

import { TastenErkunden } from "../src/components/typing/TastenErkunden";
import { erkundeTaste } from "../src/lib/typing/tastenErklaerung";

afterEach(() => cleanup());

const T = (key: string, code: string) => ({ key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false });
const brailleZeile = () => document.querySelector<HTMLTextAreaElement>("textarea[data-erkunden-zeile]")?.value ?? "";
const SPRACHEN = [undefined, "en", "fr", "es", "it", "pl", "tr", "cs", "nl"] as const;

/** Ziffernblock ohne Num: was der Browser meldet, und die eigene Taste dazu. */
const OHNE_NUM: [key: string, code: string][] = [
  ["ArrowDown", "Numpad2"],
  ["ArrowLeft", "Numpad4"],
  ["ArrowRight", "Numpad6"],
  ["ArrowUp", "Numpad8"],
  ["Home", "Numpad7"],
  ["End", "Numpad1"],
  ["PageUp", "Numpad9"],
  ["PageDown", "Numpad3"],
  ["Insert", "Numpad0"],
  ["Delete", "NumpadDecimal"],
];

describe("(1) Ziffernblock bei ausgeschaltetem Num", () => {
  for (const sprache of SPRACHEN) {
    const optionen = sprache ? { sprache } : {};
    it(`${sprache ?? "de"}: genau wie die eigene Taste erklärt, nie der englische key-Name`, () => {
      for (const [key, code] of OHNE_NUM) {
        const ziffernblock = erkundeTaste(T(key, code), "windows", optionen);
        const eigene = erkundeTaste(T(key, key), "windows", optionen);
        expect(ziffernblock, `${code} = ${key}`).toEqual(eigene);
        expect(ziffernblock.zeile, code).not.toMatch(/Arrow(Up|Down|Left|Right)|PageUp|PageDown/);
        expect(ziffernblock.schlucken, code).toBe(true);
      }
    });

    it(`${sprache ?? "de"}: die 5 ohne Num („Clear") hat einen Satz`, () => {
      const aus = erkundeTaste(T("Clear", "Numpad5"), "windows", optionen);
      expect(aus.gross).toBe("5");
      expect(aus.zeile).not.toMatch(/Clear/);
      expect(aus.zeile).toMatch(/^5 - /);
    });
  }

  it("de: Pfeil nach unten auf dem Ziffernblock", () => {
    expect(erkundeTaste(T("ArrowDown", "Numpad2"), "windows").zeile).toMatch(/^Pfeil nach unten - /);
    expect(erkundeTaste(T("Clear", "Numpad5"), "windows").zeile).toBe(
      "5 - Taste 5 im Ziffernblock - schreibt die 5, wenn die Num-Taste an ist. Jetzt ist Num aus, darum tut sie nichts. " +
        "Auf dieser Taste ist eine kleine Erhebung zum Ertasten. Hier liegt der Mittelfinger.",
    );
  });

  it("Gegenprobe: mit Num bleiben die Ziffern Ziffern", () => {
    expect(erkundeTaste(T("2", "Numpad2"), "windows").gross).toBe("2");
    expect(erkundeTaste(T(",", "NumpadDecimal"), "windows").gross).toBe(",");
  });
});

describe("(3) Menü-Taste", () => {
  it("wird geschluckt, und das Fenster verhindert das Kontextmenü", () => {
    expect(erkundeTaste(T("ContextMenu", "ContextMenu"), "windows").schlucken).toBe(true);
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    expect(fireEvent.keyDown(document, T("ContextMenu", "ContextMenu"))).toBe(false);
    expect(brailleZeile()).toMatch(/^Menü-Taste - /);
    expect(fireEvent.contextMenu(document.body), "kein Kontextmenü").toBe(false);
  });

  it("Gegenprobe: ist das Fenster zu, bleibt das Kontextmenü unangetastet", () => {
    render(<TastenErkunden open={false} onClose={vi.fn()} plattform="windows" />);
    expect(fireEvent.contextMenu(document.body)).toBe(true);
  });
});

describe("(4) Feststelltaste sagt ihren Zustand", () => {
  const caps = T("CapsLock", "CapsLock");

  it("erkundeTaste: an, aus, und ohne Angabe wie bisher", () => {
    expect(erkundeTaste(caps, "windows", { feststellAn: true }).zeile).toMatch(
      /Sie ist jetzt an: Alles wird groß geschrieben\. Drück sie noch einmal, dann schreibst du wieder klein\.$/,
    );
    expect(erkundeTaste(caps, "windows", { feststellAn: false }).zeile).toMatch(/Sie ist jetzt aus: Du schreibst wieder klein\.$/);
    expect(erkundeTaste(caps, "windows").zeile).not.toMatch(/jetzt/);
  });

  for (const sprache of SPRACHEN) {
    it(`${sprache ?? "de"}: an und aus klingen verschieden`, () => {
      const optionen = sprache ? { sprache } : {};
      const an = erkundeTaste(caps, "windows", { ...optionen, feststellAn: true });
      const aus = erkundeTaste(caps, "windows", { ...optionen, feststellAn: false });
      const ohne = erkundeTaste(caps, "windows", optionen);
      expect(an.zeile).not.toBe(aus.zeile);
      expect(an.zeile.startsWith(ohne.zeile.replace(/\.$/, ""))).toBe(true);
      expect(an.ansage).not.toBe(ohne.ansage);
    });
  }

  it("im Fenster: der Zustand kommt aus getModifierState", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    fireEvent.keyDown(document, { ...caps, modifierCapsLock: true });
    expect(brailleZeile()).toMatch(/Sie ist jetzt an:/);
    fireEvent.keyDown(document, { ...caps, modifierCapsLock: false });
    expect(brailleZeile()).toMatch(/Sie ist jetzt aus: Du schreibst wieder klein\.$/);
  });
});
