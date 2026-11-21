// @vitest-environment jsdom
/**
 * Alt + E holt JAWS nach Esc in den Formularmodus zurück - nur ein echter
 * Fokuswechsel über ein anderes Element wirkt (gemessen 31.10.2026,
 * BEFUND-2026-10-31-JAWS-KURZER-WEG.md). Das andere Element muss ein Spiegel der
 * Zeile sein: Die Braillezeile darf nichts anderes zeigen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { SPRUNG_MS, zeileNeuAnsteuern } from "../src/lib/typing/focusField";

function zeile(): HTMLTextAreaElement {
  const z = document.createElement("textarea");
  z.dataset.typingField = "practice";
  z.value = "fjjj fjj";
  z.lang = "bg";
  document.body.appendChild(z);
  z.focus();
  z.setSelectionRange(3, 3);
  return z;
}

describe("Alt + E: Sprung über den Spiegel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
  });
  afterEach(() => vi.useRealTimers());

  it("verlässt die Zeile wirklich und steht danach wieder dort", () => {
    const z = zeile();
    zeileNeuAnsteuern();
    expect(document.activeElement).not.toBe(z);
    vi.advanceTimersByTime(SPRUNG_MS);
    expect(document.activeElement).toBe(z);
    expect(document.querySelectorAll("textarea")).toHaveLength(1);
    expect(z.selectionStart).toBe(3);
  });

  it("der Spiegel zeigt dieselbe Zeile, dieselbe Sprache, dieselbe Stelle", () => {
    zeile();
    zeileNeuAnsteuern();
    const s = document.activeElement as HTMLTextAreaElement;
    expect(s.tagName).toBe("TEXTAREA");
    expect(s.value).toBe("fjjj fjj");
    expect(s.lang).toBe("bg");
    expect(s.selectionStart).toBe(3);
    expect(s.dataset.typingField).toBeUndefined();
  });

  it("springt nicht, wenn der Fokus woanders steht", () => {
    zeile();
    const knopf = document.createElement("button");
    document.body.appendChild(knopf);
    knopf.focus();
    zeileNeuAnsteuern();
    expect(document.querySelectorAll("textarea")).toHaveLength(1);
  });

  it("Esc und geschlossene Fenster springen nicht: nur Alt + E ruft den Sprung", () => {
    const seite = readFileSync("src/features/public/TippenTrainerPage.tsx", "utf8");
    expect(seite.match(/zeileNeuAnsteuern\(\)/g)).toHaveLength(1);
    expect(seite).toMatch(/case "KeyE":\s+e\.preventDefault\(\);\s+zeileNeuAnsteuern\(\);/);
  });
});
