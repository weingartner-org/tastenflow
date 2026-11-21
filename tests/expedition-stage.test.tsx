/**
 * Polar-Expedition — Bühne (ExpeditionStage). Sichert die Barrierefreiheits-
 * Kontrakte aus Bauplan §7, die bei JEDER Etappe gelten:
 *  • Vollbild-Overlay als role="dialog" aria-modal + Spielfeld role="application",
 *  • genau EINE Ansage-Region beim Öffnen (Braille-Alarm) — kein Doppelsprechen,
 *  • Escape bricht ab,
 *  • Posen sind über die Debug-Leiste schaltbar (data-pose am Rig).
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";

afterEach(() => cleanup());

describe("ExpeditionStage — Bühne & Barrierefreiheit", () => {
  it("öffnet als modaler Dialog mit einem Spielfeld (role=application)", () => {
    render(<ExpeditionStage open onClose={() => {}} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("application")).toBeInTheDocument();
  });

  it("zeigt beim Öffnen genau eine Ansage-Region (kein Doppelsprechen)", () => {
    const { baseElement } = render(<ExpeditionStage open onClose={() => {}} />);
    const alerts = baseElement.querySelectorAll('.px-stage [role="alert"]');
    const statuses = baseElement.querySelectorAll('.px-stage [role="status"]');
    expect(alerts).toHaveLength(1);
    expect(statuses).toHaveLength(0);
    expect(alerts[0].textContent).toContain("Das Packeis");
  });

  it("rendert nichts, solange sie geschlossen ist", () => {
    render(<ExpeditionStage open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("bricht mit Escape ab", () => {
    const onClose = vi.fn();
    render(<ExpeditionStage open onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("lässt Alt-Kürzel der Seite durch (fängt nur Escape ab)", () => {
    const onClose = vi.fn();
    render(<ExpeditionStage open onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "h", altKey: true });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("schaltet die Figur-Pose über die Debug-Leiste", () => {
    const { baseElement } = render(<ExpeditionStage open onClose={() => {}} debug />);
    const fig = baseElement.querySelector(".px-fig");
    expect(fig).toHaveAttribute("data-pose", "idle");
    fireEvent.click(screen.getByRole("button", { name: "Watscheln" }));
    expect(fig).toHaveAttribute("data-pose", "walk");
    fireEvent.click(screen.getByRole("button", { name: "Bauchrutsche" }));
    expect(fig).toHaveAttribute("data-pose", "slide");
  });

  it("blendet die Debug-Leiste ohne `debug` aus", () => {
    render(<ExpeditionStage open onClose={() => {}} />);
    expect(screen.queryByRole("button", { name: "Watscheln" })).toBeNull();
  });

  it("hält den Fokus auf dem Spielfeld — Klick auf nicht-fokussierbare Fläche (Johannes 13.07.)", () => {
    const { baseElement } = render(<ExpeditionStage open onClose={() => {}} />);
    const field = screen.getByRole("application");
    field.blur(); // Fokus ans <body> verlieren (wie ein Klick ins Leere)
    expect(document.activeElement).not.toBe(field);
    const status = baseElement.querySelector(".px-status") as HTMLElement;
    fireEvent.mouseDown(status); // Klick auf die Statuszeile (nicht fokussierbar)
    expect(document.activeElement).toBe(field); // Fokus ist zurück auf dem Feld
  });

  it("lässt echte Bedienknöpfe den Fokus behalten (kein Zurückziehen aufs Feld)", () => {
    render(<ExpeditionStage open onClose={() => {}} />);
    const field = screen.getByRole("application");
    field.blur();
    const close = screen.getByRole("button", { name: /Schließen/i });
    fireEvent.mouseDown(close); // ein echter Knopf → Fokus NICHT ans Feld reißen
    expect(document.activeElement).not.toBe(field);
  });
});
