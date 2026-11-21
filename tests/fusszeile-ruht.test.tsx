/**
 * ★ Die Fußzeile ruht, solange gearbeitet wird (Johannes, 25.09.2026).
 *
 * Kinder mit Blindheit standen „plötzlich im Impressum": Tab und der Lesemodus
 * von NVDA führten aus der Übung in die Fußzeile. Im Arbeiten bleibt sie jetzt
 * sichtbar, ist aber kein Tab-Halt und für Screenreader ausgeblendet. Im
 * Hauptmenü (niemand meldet sich) bleibt sie, wie sie war.
 */
import { describe, expect, it } from "vitest";
import { useState } from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RechtlichesFusszeile, useFusszeileRuht } from "@/components/RechtlichesFusszeile";

function Arbeit({ aktiv }: { aktiv: boolean }) {
  useFusszeileRuht(aktiv);
  return null;
}

let schalte: (an: boolean) => void = () => {};
function Seite({ start }: { start: boolean }) {
  const [an, setAn] = useState(start);
  schalte = setAn;
  return (
    <MemoryRouter>
      {an && <Arbeit aktiv />}
      <RechtlichesFusszeile />
    </MemoryRouter>
  );
}

function fusszeile() {
  return document.querySelector("footer") as HTMLElement;
}

describe("RechtlichesFusszeile - ruht im Arbeiten", () => {
  it("im Hauptmenü: erreichbar wie immer", () => {
    render(<Seite start={false} />);
    expect(fusszeile().hasAttribute("aria-hidden")).toBe(false);
    const impressum = screen.getByRole("link", { name: "Impressum" });
    expect(impressum.hasAttribute("tabindex")).toBe(false);
  });

  it("im Arbeiten: sichtbar, aber kein Tab-Halt und für Screenreader ausgeblendet", () => {
    render(<Seite start />);
    expect(fusszeile().getAttribute("aria-hidden")).toBe("true");
    // Sichtbar bleibt sie: Text steht da, nichts ist versteckt.
    expect(fusszeile().textContent).toContain("Impressum");
    for (const a of fusszeile().querySelectorAll("a")) {
      expect(a.getAttribute("tabindex")).toBe("-1");
    }
  });

  it("zurück im Hauptmenü ist sie wieder erreichbar", () => {
    render(<Seite start />);
    act(() => schalte(false));
    expect(fusszeile().hasAttribute("aria-hidden")).toBe(false);
    for (const a of fusszeile().querySelectorAll("a")) {
      expect(a.hasAttribute("tabindex")).toBe(false);
    }
  });
});
