/**
 * Polar-Expedition — Integration in „Mein Training" (Bauplan-Etappe E8). Sichert das
 * Umhängen der echten Einstiege vom alten Eisschollen-Spiel auf die neue Bühne:
 *  • das freie Spiel (FloeFreePlay) öffnet jetzt die GANZE Reise (ExpeditionJourney);
 *  • Schließen gibt den Fokus an den Öffner-Knopf zurück (K27, WCAG 2.4.3);
 *  • die Reise-Bilanz bucht über recordAdventure die neuen Expeditions-Abzeichen.
 * Die Zonen-Mechanik selbst deckt expedition-*.test ab; die vollständige 6-Zonen-
 * Reise ist in jsdom nicht sinnvoll durchspielbar (Merk-/Blind-/Anagramm-Zonen) und
 * bleibt dem Browser-/Johannes-Test vorbehalten.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FloeFreePlay } from "../src/components/typing/FloeFreePlay";
import { emptyProgress, recordAdventure, type TypingProgress } from "../src/lib/typing";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

/** Ein Lernstand mit genug freigeschalteten Tasten, dass die Reise Zonen hat. */
function progressWithLetters(): TypingProgress {
  return {
    ...emptyProgress(),
    introduced: ["f", "j", "d", "k", "s", "l", "a", "e", "n", "i", "r", "t"],
    letters: {
      f: { hits: 8, misses: 0, sumMs: 3200, timed: 8, recent: [400, 400, 400, 400] },
      j: { hits: 8, misses: 1, sumMs: 3600, timed: 8, recent: [450, 500, 450, 450] },
      d: { hits: 6, misses: 2, sumMs: 4200, timed: 6, recent: [700, 800, 700] },
    },
  };
}

/**
 * Der Start kommt seit 09.08.2026 NUR noch über das Ereignis
 * `tippen-open-freeplay` — den Knopf „🐧 Spielen" oben in der Leiste (A11yBar).
 * Der eigene Knopf im Karten-Kopf ist weg (er bot dasselbe Spiel ein zweites
 * Mal an). Hier steht darum ein Knopf stellvertretend für den echten Öffner.
 */
function oeffnen(): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.textContent = "🐧 Spielen";
  document.body.appendChild(btn);
  btn.focus();
  fireEvent(window, new Event("tippen-open-freeplay"));
  return btn;
}

describe("FloeFreePlay — freies Spiel öffnet die ganze Expedition (E8)", () => {
  it("startet über »🐧 Spielen« die Reise (modaler Dialog mit Tagebuch)", () => {
    render(<FloeFreePlay progress={progressWithLetters()} stufe="b" />);
    oeffnen();
    // Die Reise öffnet als modaler Dialog (ExpeditionJourney → ExpeditionStage).
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("application")).toBeInTheDocument();
  });

  it("die Karte trägt selbst KEINEN zweiten Start-Knopf mehr (09.08.2026)", () => {
    render(<FloeFreePlay progress={progressWithLetters()} stufe="b" />);
    expect(screen.queryByRole("button", { name: /Eisschollen-Spiel/ })).toBeNull();
  });

  /**
   * ★ UMGESCHRIEBEN am 22.08.2026 - Johannes' Regel R6:
   *
   *   „ESC schließt Dialoge und springt in die Eingabezeile - immer und
   *   überall. Kein Dialog, kein Aufklapper, kein Overlay darf Escape
   *   schlucken oder den Fokus woanders hinlegen."
   *
   * Bis dahin gab ESCAPE den Fokus an den Öffner zurück (K27) - und weil das
   * globale Escape der Seite ohnehin zusätzlich in die Eingabezeile zieht,
   * waren das für EINEN Tastendruck drei Fokus-Sprünge hintereinander, von
   * denen nur der letzte stehen blieb. K27 gilt weiter, aber für die KNÖPFE:
   * „Fertig" und „Spiel beenden" führen zurück auf „🐧 Spielen", das sichtbar
   * an derselben Stelle steht - von dort aus spielt man die nächste Runde.
   */
  it("★ Escape endet in der Eingabezeile, nicht auf dem Öffner (R6)", async () => {
    render(<FloeFreePlay progress={progressWithLetters()} stufe="b" />);
    const zurueck = vi.fn();
    window.addEventListener("tippen-focus-field", zurueck);
    const btn = oeffnen();
    const field = screen.getByRole("application");
    expect(document.activeElement).toBe(field); // beim Öffnen sauber fokussiert
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    // Die Anforderung läuft einen Takt später (focusField.ts).
    await waitFor(() => expect(zurueck).toHaveBeenCalledTimes(1));
    expect(document.activeElement).not.toBe(btn);
    window.removeEventListener("tippen-focus-field", zurueck);
    btn.remove();
  });

  it("über den KNOPF geht der Fokus zurück auf den Öffner (K27)", () => {
    render(<FloeFreePlay progress={progressWithLetters()} stufe="b" />);
    const btn = oeffnen();
    fireEvent.click(
      screen.getByRole("button", { name: /Reise abbrechen|Spiel beenden|Vielleicht später|Später wiederholen/ }),
    );
    expect(document.activeElement).toBe(btn);
    btn.remove();
  });

  it("ist der Öffner verschwunden, geht der Fokus ins Übungsfeld", async () => {
    render(<FloeFreePlay progress={progressWithLetters()} stufe="b" />);
    const zurueck = vi.fn();
    window.addEventListener("tippen-focus-field", zurueck);
    const btn = oeffnen();
    btn.remove(); // z. B. Moduswechsel, während die Reise lief
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => expect(zurueck).toHaveBeenCalledTimes(1));
    window.removeEventListener("tippen-focus-field", zurueck);
  });
});

describe("recordAdventure-Anbindung — die Reise-Bilanz bucht Abzeichen (E8)", () => {
  it("eine fehlerfreie Gesamtreise bucht Polarlicht + die Zonen-Meilensteine", () => {
    // So ruft der FloeFreePlay-Wrapper recordAdventure am Finale auf (onComplete).
    const journeyResult = {
      clean: true,
      fish: 2,
      aurora: true,
      zonesCleared: ["water", "climb", "cave", "storm", "station", "slide"],
    };
    const rec = recordAdventure(progressWithLetters(), journeyResult, 1_000_000, "de");
    const ids = rec.newly.map((b) => b.id);
    expect(ids).toContain("erste-expedition"); // 1. Reise
    expect(ids).toContain("polarlicht-entdecker"); // fehlerfrei → Polarlicht
    expect(ids).toContain("hoehlen-lauscher");
    expect(ids).toContain("sturm-trotzer");
    expect(ids).toContain("funker-freund");
    expect(rec.progress.badgeTally?.adventures).toBe(1);
    expect(rec.progress.badgeTally?.fishCaught).toBe(2);
  });
});
