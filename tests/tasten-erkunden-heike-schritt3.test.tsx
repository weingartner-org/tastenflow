/**
 * ★ Testerin Rückmeldung „Tasten erkunden" (Test 24.10.2026), Schritt 3 vom
 * 28.10.2026: „Win öffnet das Startmenü, Druck öffnet Snipping Tool … Wenn
 * solche Dinge passieren, bleibt die Sprache aus."
 *  (1) Kommt das Fenster zurück, sagt es, was war (Win, Druck, sonst allgemein).
 *  (2) Druck wird auch erklärt, wenn der Browser nur das Loslassen meldet.
 *  (3) Die Erklärungen von Win und Druck sagen, wie es wieder zugeht - in jeder Sprache.
 */
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: vi.fn(),
  speakUiAlways: vi.fn(),
}));

import { TastenErkunden } from "../src/components/typing/TastenErkunden";
import { erkundeTaste } from "../src/lib/typing/tastenErklaerung";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const T = (key: string, code: string) => ({ key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false });
const brailleZeile = () => document.querySelector<HTMLTextAreaElement>("textarea[data-erkunden-zeile]")?.value ?? "";
const weg = () => act(() => void window.dispatchEvent(new Event("blur")));
const zurueck = () => act(() => void window.dispatchEvent(new Event("focus")));
const SPRACHEN = [undefined, "en", "fr", "es", "it", "pl", "tr", "cs", "nl"] as const;

describe("(1) Rückkehr ins Fenster", () => {
  it("nach Win: das Startmenü war offen", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    fireEvent.keyDown(document, T("Meta", "MetaLeft"));
    expect(brailleZeile()).toMatch(/^Win - Windows-Taste - öffnet das Startmenü\./);
    weg();
    zurueck();
    expect(brailleZeile()).toBe("Die Windows-Taste hat das Startmenü geöffnet. Du bist wieder in Tasten erkunden.");
  });

  it("nach Druck: ein Programm für Bildschirmfotos war offen", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    fireEvent.keyDown(document, T("PrintScreen", "PrintScreen"));
    weg();
    zurueck();
    expect(brailleZeile()).toMatch(/^Die Drucktaste hat ein Programm für Bildschirmfotos geöffnet\./);
  });

  it("ohne Taste davor (zum Beispiel Alt + Tab von woanders): nur wieder da", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    weg();
    zurueck();
    expect(brailleZeile()).toBe("Du bist wieder in Tasten erkunden.");
  });

  it("eine Taste lange vor dem Verlassen zählt nicht als Ursache", () => {
    const now = vi.spyOn(performance, "now");
    now.mockReturnValue(1000);
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    fireEvent.keyDown(document, T("Meta", "MetaLeft"));
    now.mockReturnValue(1000 + 60_000);
    weg();
    zurueck();
    expect(brailleZeile()).toBe("Du bist wieder in Tasten erkunden.");
  });

  it("Mac: die Befehlstaste ist kein Startmenü", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="macos" />);
    fireEvent.keyDown(document, T("Meta", "MetaLeft"));
    weg();
    zurueck();
    expect(brailleZeile()).toBe("Du bist wieder in Tasten erkunden.");
  });

  it("ohne vorheriges Verlassen sagt focus nichts, und zu ist zu", () => {
    const { rerender } = render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    fireEvent.keyDown(document, T("x", "KeyX"));
    const vorher = brailleZeile();
    zurueck();
    expect(brailleZeile()).toBe(vorher);
    rerender(<TastenErkunden open={false} onClose={vi.fn()} plattform="windows" />);
    weg();
    zurueck();
    expect(document.querySelector("textarea[data-erkunden-zeile]")).toBeNull();
  });
});

describe("(2) Druck nur beim Loslassen", () => {
  it("nur keyup: wird erklärt und verhindert", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    fireEvent.keyUp(document, T("PrintScreen", "PrintScreen"));
    expect(brailleZeile()).toMatch(/^Drucktaste - macht ein Bild vom Bildschirm\./);
  });

  it("keydown und keyup: nur einmal erklärt", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    fireEvent.keyDown(document, T("PrintScreen", "PrintScreen"));
    fireEvent.keyDown(document, T("x", "KeyX"));
    // Das Loslassen von Druck danach darf die Zeile von x nicht überschreiben.
    fireEvent.keyUp(document, T("PrintScreen", "PrintScreen"));
    expect(brailleZeile()).toMatch(/^x/);
  });

  it("Gegenprobe: das Loslassen anderer Tasten tut nichts", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    fireEvent.keyDown(document, T("x", "KeyX"));
    fireEvent.keyUp(document, T("y", "KeyY"));
    expect(brailleZeile()).toMatch(/^x/);
  });
});

describe("(3) Win und Druck sagen, wie es wieder zugeht", () => {
  it("de", () => {
    expect(erkundeTaste(T("Meta", "MetaLeft"), "windows").zeile).toMatch(/Drück sie noch einmal, dann ist es wieder zu\./);
    expect(erkundeTaste(T("PrintScreen", "PrintScreen"), "windows").zeile).toMatch(/Mit Esc ist es wieder zu\.$/);
  });

  for (const sprache of SPRACHEN) {
    it(`${sprache ?? "de"}: beide Erklärungen haben einen Satz mehr, Druck nennt Esc`, () => {
      const optionen = sprache ? { sprache } : {};
      const win = erkundeTaste(T("Meta", "MetaLeft"), "windows", optionen).zeile;
      const druck = erkundeTaste(T("PrintScreen", "PrintScreen"), "windows", optionen).zeile;
      expect(win.split(". ").length, win).toBeGreaterThanOrEqual(3);
      expect(druck).toMatch(/Esc|Échap/);
    });
  }
});
