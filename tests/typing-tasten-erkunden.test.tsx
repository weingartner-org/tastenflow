/**
 * „Tasten erkunden" (Alt + 3, Wunsch Johannes 07.08.2026): Jede gedrückte
 * Taste wird angesagt und groß angezeigt — auch Sondertasten. Die Auswege aus
 * der (erlaubten, angesagten) Tastaturfalle sind der Kern dieser Tests:
 * Alt + 3, zweimal Esc — und einmal Esc darf NICHT hinauswerfen (Esc ist
 * selbst Lernstoff und wird nur angesagt).
 *
 * ★ 12.09.2026 (Johannes): Abkürzung - Name - was sie tut. Die Sätze selbst
 * prüft `tests/typing-tasten-erklaerung.test.ts`.
 *
 * ★★★ 12.09.2026, zweiter Wunsch: Die Zeile soll auf der Braillezeile STEHEN
 * BLEIBEN, bis die nächste Taste kommt, und länger als 40 Zellen lesbar sein.
 * Darum steht sie im Wert eines einzeiligen Textarea mit Fokus, NICHT in einem
 * Live-Bereich (der ist eine Blitzmeldung). Ob NVDA das wirklich so zeigt,
 * kann jsdom nicht wissen - das misst `pruefstand/nvda/erkunden-braille-lauf.mts`.
 * Hier steht die BAUART, die dafür nötig ist.
 */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ladeKuerzelKatalog } from "../src/lib/typing/kuerzelKatalog";

// ★ 12.09.2026 (Johannes): „wenn vorlesen aus ist dann lies auch beim tasten
// erkunden nicht vor". Die Stimme darf nur über `speakUi` laufen (achtet den
// Vorlesen-Schalter), nie über `speakUiAlways`. Beide werden hier mitgeschnitten.
const stimme = vi.hoisted(() => ({ ui: vi.fn(), immer: vi.fn() }));
// Seit 28.09.2026 importiert TastenErkunden aus den einzelnen Modulen, nicht mehr
// aus dem Sammel-Import `@/lib/typing` (der zog alle Tastenflow-Texte in »Im Griff«
// und Punktgenau, tests/buendel-aufteilung.test.ts) - gemockt wird darum die Quelle.
vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: stimme.ui,
  speakUiAlways: stimme.immer,
}));

import { ERKUNDEN_BEGRUESSUNG, TastenErkunden } from "../src/components/typing/TastenErkunden";

afterEach(() => {
  cleanup();
  stimme.ui.mockClear();
  stimme.immer.mockClear();
});

/** Drückt eine Taste; `true` = der Browser darf sie behalten (nicht geschluckt). */
function tippe(init: KeyboardEventInit): boolean {
  return fireEvent.keyDown(document, init);
}

function feld(): HTMLTextAreaElement {
  const f = document.querySelector<HTMLTextAreaElement>("textarea[data-erkunden-zeile]");
  if (!f) throw new Error("Das Braillezeilen-Feld fehlt.");
  return f;
}

/** Das, was auf der Braillezeile steht: der Wert des Feldes. */
const brailleZeile = (): string => feld().value;

/** Das Popup für Sehende. */
const popup = (): string =>
  document.querySelector("[data-erkunden-popup]")?.textContent ?? "";

// ★ 28.09.2026: Der Kürzel-Katalog von »Im Griff« wird nachgeladen
// (`lib/typing/kuerzelKatalog.ts`); im Fenster ist er da, sobald die Begrüßung
// gesprochen ist. Diese Tests prüfen die Sätze MIT Katalog - den Weg davor
// prüft `tests/tasten-erkunden-katalog-nachladen.test.tsx`.
beforeAll(() => ladeKuerzelKatalog());

describe("TastenErkunden — ansagen und anzeigen", () => {
  let onClose: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    onClose = vi.fn();
  });

  it("zeigt und benennt einen Buchstaben (Umlaut mit eindeutiger Ansage)", () => {
    render(<TastenErkunden open onClose={onClose} />);
    tippe({ key: "a", code: "KeyA" });
    expect(brailleZeile()).toBe("a");
    tippe({ key: "ä", code: "Quote" });
    expect(brailleZeile()).toBe("ä - a Umlaut");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("★ Johannes' Beispiel: Abkürzung - Name - was sie tut", () => {
    render(<TastenErkunden open onClose={onClose} />);
    tippe({ key: "Tab", code: "Tab" });
    expect(brailleZeile()).toMatch(
      /^Tab - Tabulatortaste - springt von Element zu Element, zum Beispiel zu Link, Eingabefeld oder Schalter\./,
    );
    tippe({ key: "Shift", code: "ShiftLeft" });
    expect(brailleZeile()).toMatch(/^Shift - Umschalttaste - schreibt große Buchstaben/);
    tippe({ key: "Backspace", code: "Backspace" });
    expect(brailleZeile()).toMatch(/^Backspace - Löschtaste - löscht das Zeichen links/);
  });

  it("Sondertasten, Zeichen und F-Tasten werden geschluckt - auch F5 (Testerin 24.10.2026)", () => {
    render(<TastenErkunden open onClose={onClose} />);
    expect(tippe({ key: "Tab", code: "Tab" })).toBe(false);
    expect(tippe({ key: "x", code: "KeyX" })).toBe(false);
    expect(tippe({ key: "F5", code: "F5" })).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
    expect(brailleZeile()).toMatch(/^F5 - Funktionstaste - lädt eine Webseite neu\./);
  });

  it("einmal Esc sagt an, wie der zweite Druck wirkt — wirft NICHT hinaus", () => {
    render(<TastenErkunden open onClose={onClose} />);
    tippe({ key: "Escape", code: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
    expect(brailleZeile()).toMatch(/^Esc - Escape-Taste - bricht ab\./);
    expect(brailleZeile()).toMatch(/Noch einmal Esc beendet Tasten erkunden\.$/);
  });

  it("zweimal Esc im Zeitfenster steigt aus", () => {
    const now = vi.spyOn(performance, "now");
    render(<TastenErkunden open onClose={onClose} />);
    now.mockReturnValue(1000);
    tippe({ key: "Escape", code: "Escape" });
    now.mockReturnValue(1900);
    tippe({ key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    now.mockRestore();
  });

  it("zwei Esc mit zu großem Abstand steigen NICHT aus", () => {
    const now = vi.spyOn(performance, "now");
    render(<TastenErkunden open onClose={onClose} />);
    now.mockReturnValue(1000);
    tippe({ key: "Escape", code: "Escape" });
    now.mockReturnValue(4000);
    tippe({ key: "Escape", code: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
    now.mockRestore();
  });

  it("Alt + 3 steigt aus (Johannes' Notausgang)", () => {
    render(<TastenErkunden open onClose={onClose} />);
    tippe({ key: "3", code: "Digit3", altKey: true });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("andere Alt-Kombis laufen zur Seite durch (App-Kürzel bleiben nutzbar)", () => {
    render(<TastenErkunden open onClose={onClose} />);
    const vorher = brailleZeile();
    expect(tippe({ key: "h", code: "KeyH", altKey: true })).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
    // nichts angezeigt/angesagt — die Kombination gehört der App
    expect(brailleZeile()).toBe(vorher);
  });

  describe("★ 12.09.2026: AltGr (Windows meldet sie als Strg + Alt)", () => {
    it("ein AltGr-Zeichen wird angesagt, samt dem Weg dorthin - bis dahin lief es stumm durch", () => {
      render(<TastenErkunden open onClose={onClose} />);
      const behalten = tippe({
        key: "€", code: "KeyE", altKey: true, ctrlKey: true, modifierAltGraph: true,
      });
      expect(behalten).toBe(false);
      expect(brailleZeile()).toBe("€ - Euro - ist das Zeichen für Euro. Mit AltGr + E.");
    });

    it("AltGr + 3 („³“) ist KEIN Ausweg", () => {
      render(<TastenErkunden open onClose={onClose} />);
      tippe({ key: "³", code: "Digit3", altKey: true, ctrlKey: true, modifierAltGraph: true });
      expect(onClose).not.toHaveBeenCalled();
      expect(brailleZeile()).toMatch(/^³ - hoch 3 - /);
    });

    it("die AltGr-Taste allein wird angesagt", () => {
      render(<TastenErkunden open onClose={onClose} />);
      tippe({ key: "AltGraph", code: "AltRight", altKey: true, ctrlKey: true, modifierAltGraph: true });
      expect(brailleZeile()).toMatch(/^AltGr-Taste - schreibt das dritte Zeichen einer Taste/);
    });

    it.skip("★ Strg + C ist Lernstoff: angesagt und geschluckt (Johannes 12.09.2026)", () => {
      render(<TastenErkunden open onClose={onClose} />);
      expect(tippe({ key: "c", code: "KeyC", ctrlKey: true })).toBe(false);
      expect(brailleZeile()).toBe("Strg + C - Tastenkombination - kopieren.");
    });
  });

  describe("★ 12.09.2026: Vorlesen aus heisst still", () => {
    it.skip("gesprochen wird nur über speakUi (achtet den Vorlesen-Schalter), nie über speakUiAlways", () => {
      render(<TastenErkunden open onClose={onClose} />);
      tippe({ key: "Tab", code: "Tab" });
      tippe({ key: "c", code: "KeyC", ctrlKey: true });
      tippe({ key: "3", code: "Digit3", altKey: true });
      expect(stimme.immer).not.toHaveBeenCalled();
      expect(stimme.ui).toHaveBeenCalledWith(expect.stringMatching(/^Tab, Tabulatortaste: /));
      expect(stimme.ui).toHaveBeenCalledWith("Strg + C, Tastenkombination: Kopieren.");
      expect(stimme.ui).toHaveBeenCalledWith("Tasten erkunden beendet.");
    });

    it("die Braillezeile bekommt die Zeile trotzdem - sie hängt nicht an der Stimme", () => {
      render(<TastenErkunden open onClose={onClose} />);
      tippe({ key: "Tab", code: "Tab" });
      expect(brailleZeile()).toMatch(/^Tab - Tabulatortaste - /);
    });
  });

  it("der Ausstiegs-Hinweis steht dauerhaft auf dem Schirm", () => {
    render(<TastenErkunden open onClose={onClose} />);
    expect(screen.getAllByText(/Alt \+ 3/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/zweimal Esc/).length).toBeGreaterThanOrEqual(1);
  });

  it("geschlossen (open=false) hört er nicht zu", () => {
    render(<TastenErkunden open={false} onClose={onClose} />);
    tippe({ key: "3", code: "Digit3", altKey: true });
    tippe({ key: "a", code: "KeyA" });
    expect(onClose).not.toHaveBeenCalled();
    expect(document.querySelector("textarea[data-erkunden-zeile]")).toBeNull();
  });
});

describe("★★★ 12.09.2026: die Zeile bleibt stehen und ist länger als 40 Zellen lesbar", () => {
  it("KEIN Live-Bereich im Modus - der wäre eine Blitzmeldung auf der Braillezeile", () => {
    render(<TastenErkunden open onClose={vi.fn()} />);
    tippe({ key: "Tab", code: "Tab" });
    expect(document.querySelector("[aria-live]")).toBeNull();
    expect(document.querySelector('[role="status"], [role="alert"]')).toBeNull();
  });

  it("die Zeile steht in EINEM Textarea: eine Zeile, kein Umbruch (sonst mehrzeilig nur dem Namen nach)", () => {
    render(<TastenErkunden open onClose={vi.fn()} />);
    const f = feld();
    expect(f.tagName).toBe("TEXTAREA");
    expect(f.getAttribute("rows")).toBe("1");
    expect(f.getAttribute("wrap")).toBe("off");
    // Nicht „schreibgeschützt" - NVDA hängte sonst ein Wort an die Zeile.
    expect(f.readOnly).toBe(false);
  });

  it("das Feld bekommt beim Öffnen den Fokus - nur das Feld mit Fokus steht auf der Braillezeile", () => {
    vi.useFakeTimers();
    try {
      render(<TastenErkunden open onClose={vi.fn()} />);
      act(() => {
        vi.runAllTimers();
      });
      expect(document.activeElement).toBe(feld());
      expect(brailleZeile()).toBe(ERKUNDEN_BEGRUESSUNG);
    } finally {
      vi.useRealTimers();
    }
  });

  it("die Zeile bleibt, bis die nächste Taste kommt - und die Schreibmarke steht vorne", () => {
    vi.useFakeTimers();
    try {
      render(<TastenErkunden open onClose={vi.fn()} />);
      tippe({ key: "Tab", code: "Tab" });
      const tab = brailleZeile();
      expect(tab.length).toBeGreaterThan(40);
      // Nichts setzt die Zeile von selbst zurück: Auch nach vielen Sekunden steht sie noch.
      act(() => {
        vi.advanceTimersByTime(30_000);
      });
      expect(brailleZeile()).toBe(tab);
      expect(feld().selectionStart).toBe(0);
      expect(feld().selectionEnd).toBe(0);
      // Erst die nächste Taste ändert sie.
      tippe({ key: "Enter", code: "Enter" });
      expect(brailleZeile()).not.toBe(tab);
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(feld().selectionStart).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("★★★★ NVDA-Befund: nach jeder neuen Zeile BEWEGT sich die Schreibmarke (1, dann 0)", () => {
    // Stünde sie vorher und nachher auf 0, bekäme NVDA keine Bewegung zu sehen
    // und zeigte weiter die alte Zeile (gemessen 12.09.2026, erkunden-braille-nachher-2).
    vi.useFakeTimers();
    try {
      render(<TastenErkunden open onClose={vi.fn()} />);
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(feld().selectionStart).toBe(0);
      const setzen = vi.spyOn(feld(), "setSelectionRange");
      tippe({ key: "Tab", code: "Tab" });
      expect(feld().selectionStart).toBe(1);
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(feld().selectionStart).toBe(0);
      expect(setzen.mock.calls.map((c) => c[0])).toEqual([1, 0]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("Eingaben ins Feld ändern die Zeile nicht", () => {
    render(<TastenErkunden open onClose={vi.fn()} />);
    tippe({ key: "Tab", code: "Tab" });
    const tab = brailleZeile();
    fireEvent.change(feld(), { target: { value: "xyz" } });
    expect(brailleZeile()).toBe(tab);
  });

  it("Alt-Kürzel der Seite bleiben aus dem Feld heraus erlaubt (data-kuerzel=\"an\")", () => {
    render(<TastenErkunden open onClose={vi.fn()} />);
    expect(feld().dataset.kuerzel).toBe("an");
  });
});

describe("★★ 12.09.2026: das Popup für Sehende", () => {
  it("erscheint erst mit der ersten Taste und zeigt genau die Wörter der Braillezeile", () => {
    render(<TastenErkunden open onClose={vi.fn()} />);
    expect(document.querySelector("[data-erkunden-popup]")).toBeNull();
    tippe({ key: "Tab", code: "Tab" });
    expect(popup()).toContain(brailleZeile());
    // ★ 22.09.2026: kein Vorspann mehr - die Taste und die Zeile, sonst nichts.
    expect(popup()).not.toMatch(/Braillezeile/);
    expect(popup()).toBe("⇥" + brailleZeile());
    tippe({ key: "@" });
    expect(popup()).toContain("@ - At-Zeichen - steht in jeder E-Mail-Adresse.");
  });

  it("ist vor Screenreadern verborgen - sonst stünde die Zeile doppelt", () => {
    render(<TastenErkunden open onClose={vi.fn()} />);
    tippe({ key: "Tab", code: "Tab" });
    expect(document.querySelector("[data-erkunden-popup]")?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("★ 12.09.2026: die Bildschirmtastatur ist eingeblendet und markiert die gedrückte Taste", () => {
  /** Die markierte Taste in der SICHTBAREN Tastatur (die Messvorlage trägt sie auch). */
  const markiert = () =>
    [...document.querySelectorAll('[data-tastatur="an"] [data-gedrueckt="an"]')].map((t) =>
      t.textContent?.trim(),
    );

  it("die Tastatur steht da, bevor eine Taste gedrückt wurde - ohne Markierung", () => {
    render(<TastenErkunden open onClose={vi.fn()} />);
    expect(document.querySelector('[data-tastatur="an"]')).not.toBeNull();
    expect(markiert()).toEqual([]);
  });

  it("A markiert die A-Taste, danach markiert Strg + C die C-Taste (nie zwei)", () => {
    render(<TastenErkunden open onClose={vi.fn()} />);
    tippe({ key: "a", code: "KeyA" });
    expect(markiert()).toEqual(["A"]);
    tippe({ key: "c", code: "KeyC", ctrlKey: true });
    expect(markiert()).toEqual(["C"]);
  });

  it("Gegenprobe: ein durchgereichtes Tastenflow-Kürzel (Alt + H) ändert die Markierung nicht", () => {
    render(<TastenErkunden open onClose={vi.fn()} />);
    tippe({ key: "a", code: "KeyA" });
    tippe({ key: "h", code: "KeyH", altKey: true });
    expect(markiert()).toEqual(["A"]);
  });
});
