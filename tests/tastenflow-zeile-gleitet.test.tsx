/**
 * Wächter: Mit Zeichenabstand (CVI) gleitet die Übungszeile im Takt des
 * Kindes (Johannes 19.09.2026: *„wer langsam schreibt, bei dem soll auch die
 * Zeile langsam weitergehen, beschleunigen und abbremsen, je schneller man
 * schreibt, desto schneller muss sich die Zeile bewegen"*).
 *
 * Geprüft wird die Rechnung (Takt → Dauer) und dass Zeile UND unsichtbares
 * Eingabefeld denselben Übergang tragen - sonst läge der Schreibzeiger
 * während des Gleitens neben dem sichtbaren Zeichen.
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TypingSession } from "@/components/typing/TypingSession";
import {
  GLEIT_KURVE,
  GLEIT_MAX_MS,
  GLEIT_MIN_MS,
  ZEILE_UEBERGANG_NORMAL,
  gleitDauer,
  naechsterTakt,
  zeilenUebergang,
} from "@/lib/typing/zeichenabstand";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("die Rechnung", () => {
  it("der Takt gleitet: neuer Abstand 40 %, bisheriger 60 %", () => {
    expect(naechsterTakt(null, 1000)).toBe(1000);
    expect(naechsterTakt(1000, 500)).toBe(800);
  });

  it("eine Pause (über 4 s) oder ein unsinniger Abstand ändert den Takt nicht", () => {
    expect(naechsterTakt(800, 9000)).toBe(800);
    expect(naechsterTakt(800, 0)).toBe(800);
    expect(naechsterTakt(null, 9000)).toBeNull();
  });

  it("langsam schreiben = langsam gleiten, schnell = schnell - in festen Grenzen", () => {
    expect(gleitDauer(2000)).toBe(GLEIT_MAX_MS);
    expect(gleitDauer(1000)).toBe(850);
    expect(gleitDauer(400)).toBe(340);
    expect(gleitDauer(100)).toBe(GLEIT_MIN_MS);
    expect(gleitDauer(null)).toBe(300);
    expect(gleitDauer(1000)).toBeGreaterThan(gleitDauer(400));
  });

  it("ohne Zeichenabstand bleibt alles wie seit jeher", () => {
    expect(zeilenUebergang(1, 1000)).toBe(ZEILE_UEBERGANG_NORMAL);
    expect(zeilenUebergang(3, 1000)).toBe(`transform 850ms ${GLEIT_KURVE}`);
  });

  it("anfahren und abbremsen: die Kurve ist symmetrisch (ease-in-out)", () => {
    expect(GLEIT_KURVE).toBe("cubic-bezier(0.45, 0, 0.55, 1)");
  });
});

describe("in der Übung", () => {
  function bau(zeichenabstand: 1 | 3) {
    return render(
      <TypingSession
        items={["abababab"]}
        contextId="test"
        unlocked={new Set(["a", "b"])}
        shiftLearned={false}
        stufe="kids"
        voiceEnabled={false}
        onRetry={vi.fn()}
        zeichenabstand={zeichenabstand}
      />,
    );
  }

  it("mit Zeichenabstand: die Dauer folgt dem Takt, Zeile und Feld gleich", () => {
    let t = 0;
    vi.spyOn(performance, "now").mockImplementation(() => t);
    const { container } = bau(3);
    const zeile = container.querySelector(".tt-prompt-spur > div") as HTMLElement;
    const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
    // Erster Auftritt: sofort da, danach bereit zum Gleiten (noch ohne Takt).
    expect(zeile.style.transition).toBe(`transform 300ms ${GLEIT_KURVE}`);

    t = 1000;
    fireEvent.keyDown(feld, { key: "a" });
    expect(zeile.style.transition).toBe(`transform 850ms ${GLEIT_KURVE}`);
    expect(feld.style.transition).toBe(zeile.style.transition);

    t = 1600; // schneller geworden: 600 ms → Takt 840 → 714 ms
    fireEvent.keyDown(feld, { key: "b" });
    expect(zeile.style.transition).toBe(`transform 714ms ${GLEIT_KURVE}`);
    expect(feld.style.transition).toBe(zeile.style.transition);
    expect(zeile.style.willChange).toBe("transform");
  });

  it("ohne Zeichenabstand: der alte kurze Übergang, an Zeile und Feld", () => {
    const { container } = bau(1);
    const zeile = container.querySelector(".tt-prompt-spur > div") as HTMLElement;
    const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.keyDown(feld, { key: "a" });
    expect(zeile.style.transition).toBe(ZEILE_UEBERGANG_NORMAL);
    expect(feld.style.transition).toBe(ZEILE_UEBERGANG_NORMAL);
    expect(zeile.style.willChange).toBe("");
  });
});

/**
 * ★★ 28.09.2026 (Johannes: „beim CVI funktioniert das smooth Weiterlaufen
 * nicht an allen Rechnern"): Bei „weniger Bewegung" im System drückte die
 * globale Regel in `index.css` jeden Übergang auf ≈ 0 - an Schulrechnern setzt
 * die IT das oft für alle. jsdom rechnet keine Media-Queries; geprüft werden
 * darum beide Hälften: die Zeile trägt Ausnahme-Klasse und Dauer, und die
 * CSS-Regel lässt genau diese Klasse mit genau dieser Dauer durch.
 */
describe("★★ CVI gleitet auch bei „weniger Bewegung\" im System", () => {
  function bau(zeichenabstand: 1 | 3) {
    return render(
      <TypingSession
        items={["abababab"]}
        contextId="test"
        unlocked={new Set(["a", "b"])}
        shiftLearned={false}
        stufe="kids"
        voiceEnabled={false}
        onRetry={vi.fn()}
        zeichenabstand={zeichenabstand}
      />,
    );
  }

  it("mit Zeichenabstand: Zeile UND Feld tragen tt-cvi-gleiten, --tt-gleit-ms = Dauer des Übergangs", () => {
    let t = 0;
    vi.spyOn(performance, "now").mockImplementation(() => t);
    const { container } = bau(3);
    const zeile = container.querySelector(".tt-prompt-spur > div") as HTMLElement;
    const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
    t = 1000;
    fireEvent.keyDown(feld, { key: "a" });
    for (const el of [zeile, feld]) {
      expect(el.classList.contains("tt-cvi-gleiten")).toBe(true);
      expect(el.style.getPropertyValue("--tt-gleit-ms")).toBe("850ms");
    }
    expect(zeile.style.transition).toBe(`transform 850ms ${GLEIT_KURVE}`);
  });

  it("ohne Zeichenabstand: keine Ausnahme - dort gilt „weniger Bewegung\" wie überall", () => {
    const { container } = bau(1);
    const zeile = container.querySelector(".tt-prompt-spur > div") as HTMLElement;
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "a" });
    expect(zeile.classList.contains("tt-cvi-gleiten")).toBe(false);
  });

  it("index.css: im reduced-motion-Block steht die Ausnahme NACH der Pauschalregel, mit !important und der Variablen", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync("src/index.css", "utf8");
    const block = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    const pauschal = block.indexOf("transition-duration: 0.001ms !important");
    const ausnahme = block.search(/\.tt-cvi-gleiten\s*\{\s*transition-duration:\s*var\(--tt-gleit-ms[^)]*\)\s*!important/);
    expect(pauschal).toBeGreaterThan(-1);
    expect(ausnahme).toBeGreaterThan(pauschal);
    // Die Ausnahme liegt noch im selben Media-Block (vor dessen Ende).
    expect(ausnahme).toBeLessThan(block.indexOf("body {"));
  });
});
