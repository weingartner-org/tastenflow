/**
 * ★ Johannes 28.09.2026: „gibt es einen Grund, warum es beim Tasten erkunden
 * keine F-Tasten gibt?" - „ja, bau das mit den F-Tasten".
 *
 *  (1) Unter Windows sagte das Erkunden F1-F12 an und liess sie dann zum
 *      Browser durch: F1 Hilfe, F3 Suche, F6 Adresszeile, F11 Vollbild - das
 *      Kind war danach nicht mehr im Feld. Jetzt werden sie geschluckt - seit
 *      27.10.2026 auch F5 (Testerin 24.10.: F5 warf hinaus). In JEDER Bedienungssprache.
 *  (2) Am Mac sieht der Browser F1-F12 ab Werk gar nicht (Helligkeit, Ton);
 *      die Begrüßung nennt dort den Weg mit fn. Unter Windows bleibt sie gleich.
 */
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: vi.fn(),
  speakUiAlways: vi.fn(),
}));

import { ERKUNDEN_BEGRUESSUNG, ERKUNDEN_MAC_FN, TastenErkunden } from "../src/components/typing/TastenErkunden";
import { erkundeTaste, istFTasteOhneAusweg } from "../src/lib/typing/tastenErklaerung";

afterEach(() => cleanup());

const F = (key: string) => ({ key, code: key, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false });
const brailleZeile = () => document.querySelector<HTMLTextAreaElement>("textarea[data-erkunden-zeile]")?.value ?? "";

describe("(1) F-Tasten: angesagt und geschluckt - auch F5", () => {
  for (const sprache of [undefined, "en", "fr", "es", "it", "pl", "tr", "cs", "nl"] as const) {
    it(`erkundeTaste (${sprache ?? "de"}): F1-F12 und F24 geschluckt`, () => {
      const optionen = sprache ? { sprache } : {};
      for (let n = 1; n <= 12; n++) {
        const aus = erkundeTaste(F(`F${n}`), "windows", optionen);
        expect(aus.zeile, `F${n}`).toMatch(new RegExp(`^F${n}\\b`));
        expect(aus.schlucken, `F${n}`).toBe(true);
      }
      expect(erkundeTaste(F("F24"), "windows", optionen).schlucken).toBe(true);
    });
  }

  it("istFTasteOhneAusweg: F1-F24, sonst nichts", () => {
    expect(istFTasteOhneAusweg("F1")).toBe(true);
    expect(istFTasteOhneAusweg("F24")).toBe(true);
    expect(istFTasteOhneAusweg("F5")).toBe(true);
    expect(istFTasteOhneAusweg("F25")).toBe(false);
    expect(istFTasteOhneAusweg("f")).toBe(false);
    expect(istFTasteOhneAusweg("Fn")).toBe(false);
  });

  it("im Fenster: F3 und F5 werden verhindert (keine Suche, kein Neuladen), Zeile nennt die Taste", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    const f3 = fireEvent.keyDown(document, F("F3"));
    expect(f3, "F3 darf nicht zum Browser").toBe(false);
    expect(brailleZeile()).toMatch(/^F3 - /);
    const f5 = fireEvent.keyDown(document, F("F5"));
    expect(f5, "F5 darf nicht neu laden").toBe(false);
    expect(brailleZeile()).toMatch(/^F5 - Funktionstaste - lädt eine Webseite neu\. Hier passiert nichts/);
  });
});

describe("(2) Mac: die Begrüßung nennt den Weg mit fn", () => {
  it("macos: Begrüßung + fn-Hinweis", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="macos" />);
    expect(brailleZeile()).toBe(`${ERKUNDEN_BEGRUESSUNG} ${ERKUNDEN_MAC_FN}`);
  });

  it("Gegenprobe windows: Begrüßung wie bisher, ohne fn", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    expect(brailleZeile()).toBe(ERKUNDEN_BEGRUESSUNG);
  });
});
