import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import {
  SimEinfuehrung,
  einfuehrungGesehen,
  type EinfuehrungSchritt,
} from "../src/components/SimEinfuehrung";

/**
 * Der Rundgang der Simulationen (05.09.2026, umgebaut am selben Abend auf
 * Hervorhebung je Bereich). Zwei Dinge sind der Kern:
 *
 * 1. die MINI-HANDLUNG - ein Schritt gilt erst als geschafft, wenn sich der
 *    beobachtete Wert wirklich bewegt hat;
 * 2. jeder Schritt zeigt auf SEINEN Bereich (`ziel`), und zwar frisch gemessen.
 *
 * ⚠️ jsdom rechnet kein Layout: `getBoundingClientRect()` liefert überall Null,
 * darum entsteht hier NIE ein Leuchtrahmen. Genau das ist mitgeprüft (die
 * Einführung muss auch dann stehen) - die Hervorhebung selbst wird im Browser
 * gemessen, nicht hier.
 */
const zielA = vi.fn(() => null);
const zielB = vi.fn(() => null);

function Probe({ onEnde = () => {} }: { onEnde?: () => void }) {
  const [wert, setWert] = useState(0);
  const schritte: EinfuehrungSchritt[] = [
    {
      ziel: zielA,
      text: "Drücken Sie eine Pfeiltaste.",
      beobachte: wert,
      danach: "So wandert der Ausschnitt.",
    },
    { ziel: zielB, text: "Fast fertig." },
  ];
  return (
    <>
      <button type="button" onClick={() => setWert((w) => w + 1)}>
        Pfeiltaste
      </button>
      <SimEinfuehrung schluessel="probe" schritte={schritte} onEnde={onEnde} />
    </>
  );
}

describe("Einführung der Simulationen", () => {
  beforeEach(() => {
    localStorage.clear();
    zielA.mockClear();
    zielB.mockClear();
  });

  it("meldet einen Schritt erst als geschafft, wenn die Handlung passiert ist", () => {
    render(<Probe />);
    expect(screen.getByText("Drücken Sie eine Pfeiltaste.")).toBeTruthy();
    expect(screen.queryByText("So wandert der Ausschnitt.")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Pfeiltaste" }));

    expect(screen.getByText("So wandert der Ausschnitt.")).toBeTruthy();
    // Für Screenreader steht die Bestätigung als Wort da, nicht nur als Haken.
    expect(screen.getByText("Geschafft.")).toBeTruthy();
  });

  it("sagt den Wechsel an, ohne den Fokus zu holen - die Hände bleiben auf den Tasten", () => {
    render(<Probe />);
    const bereich = screen.getByRole("region", { name: "Einführung" });
    const text = bereich.querySelector("p");
    expect(text?.getAttribute("aria-live")).toBe("polite");
    // Nichts in der Einführung reisst den Fokus an sich.
    expect(document.activeElement).toBe(document.body);
  });

  it("zählt die Schritte und beendet am letzten", () => {
    const onEnde = vi.fn();
    render(<Probe onEnde={onEnde} />);
    expect(screen.getByText("Einführung 1/2")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Weiter/ }));
    expect(screen.getByText("Einführung 2/2")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Fertig/ }));
    expect(onEnde).toHaveBeenCalledTimes(1);
    expect(einfuehrungGesehen("probe")).toBe(true);
  });

  it("lässt sich mitten drin überspringen und kommt dann nicht wieder", () => {
    const onEnde = vi.fn();
    render(<Probe onEnde={onEnde} />);
    fireEvent.click(screen.getByRole("button", { name: "Überspringen" }));
    expect(onEnde).toHaveBeenCalledTimes(1);
    expect(einfuehrungGesehen("probe")).toBe(true);
  });

  it("kennt keinen toten Schalter - Weiter geht auch ohne die Handlung", () => {
    render(<Probe />);
    const weiter = screen.getByRole("button", { name: /Weiter/ });
    expect((weiter as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(weiter);
    expect(screen.getByText("Fast fertig.")).toBeTruthy();
  });

  it("fragt nach dem Bereich DES AKTUELLEN Schritts - und wechselt ihn mit", () => {
    render(<Probe />);
    expect(zielA).toHaveBeenCalled();
    expect(zielB).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Weiter/ }));
    expect(zielB).toHaveBeenCalled();
  });

  it("schaltet auch mit der Eingabetaste weiter - die Hände bleiben auf den Tasten", () => {
    render(<Probe />);
    expect(screen.getByText("Einführung 1/2")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Enter" });
    expect(screen.getByText("Einführung 2/2")).toBeTruthy();
  });

  it("steht auch ohne messbaren Bereich (jsdom kennt kein Layout)", () => {
    render(<Probe />);
    expect(screen.getByRole("region", { name: "Einführung" })).toBeTruthy();
  });

  it("ohne Merker ist die Einführung ungesehen", () => {
    expect(einfuehrungGesehen("noch-nie-gezeigt")).toBe(false);
  });
});
