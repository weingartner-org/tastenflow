/**
 * Pins aus dem Tastenflow-Tiefentest (10.07.2026). Jeder Test sichert genau
 * einen gefundenen Fehler ab, damit er nicht zurückkehrt:
 *  - F2: „ß" in der gesprochenen Tippanleitung war „SS" (toUpperCase-Falle).
 *  - F4: Abbruch des Spiels (Esc) gab den Fokus nicht zurück (WCAG). Seit E8
 *        läuft das über die neue Bühne (ExpeditionStage) — hier gegen sie gepinnt.
 *  - F6: die Freischalt-Feier spielte Fanfare/Auto-Schließer bei jedem beiläufigen
 *        Re-Render neu (onClose lag in den Effekt-Abhängigkeiten).
 *
 * (F5 „fliegender Bonus-Fisch verschluckt keinen Ziel-Anschlag" betraf das alte
 *  `IceFloeGame`; die Fisch-Mechanik liegt jetzt in `useExpedition` und wird über
 *  die expedition-*-Tests abgedeckt.)
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { unitHowToType } from "../src/lib/typing";
import type { FloeCourse } from "../src/lib/typing";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";
import { UnlockCelebration } from "../src/components/typing/UnlockCelebration";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("F2 — Tippanleitung für ß (kein SS)", () => {
  it('nennt die ß-Taste „Eszett", nicht „SS"', () => {
    const howTo = unitHowToType("ß");
    expect(howTo).toContain("Eszett");
    expect(howTo).not.toContain("SS");
  });
  it('das Fragezeichen (Umschalt+ß) sagt „Umschalt und Eszett"', () => {
    // „?" entsteht auf der deutschen Tastatur mit Umschalt+ß.
    const howTo = unitHowToType("?");
    expect(howTo).toContain("Eszett");
    expect(howTo).not.toContain("SS");
  });
});

describe("F4 — Fokus-Rückgabe beim Abbrechen des Spiels (neue Bühne)", () => {
  const COURSE: FloeCourse = { stages: [{ kind: "water", units: ["f", "j"] }] };
  /**
   * ★ UMGESCHRIEBEN am 22.08.2026 (Fokusziele, Nr 19 + Regel R6).
   *
   * Der ursprüngliche Test hielt fest, dass die BÜHNE selbst den Fokus an den
   * Öffner zurückgibt (`restoreFocus` in `useFocusTrap`). Genau das ist mit der
   * Fokusziele-Charge weggefallen, und zwar aus zwei Gründen:
   *
   *  1. Nr 19: Beim Belohnungs-Lauf ist der Öffner die Feier-Karte - die es
   *     beim Schließen längst nicht mehr gibt. `restoreFocus` fand dort nichts
   *     und ließ den Fokus auf `body`.
   *  2. „Nie zwei Ziele nacheinander" (R2): Wo der Öffner noch stand, liefen
   *     die Rückgabe der Bühne UND der Rückweg des Aufrufers hintereinander -
   *     auf einer Braillezeile zwei Sprünge für einen Tastendruck.
   *
   * Den Rückweg setzt jetzt der Aufrufer, und er setzt genau einen:
   * `FloeFreePlay` (Öffner bzw. Eingabezeile, siehe expedition-integration),
   * die beiden Trainer (immer Eingabezeile). Was die Bühne weiterhin leistet,
   * steht hier: Anfangsfokus auf dem Spielfeld, und Escape MELDET sich als
   * Escape, damit der Aufrufer R6 einhalten kann.
   */
  it("★ Anfangsfokus im Spielfeld, und Escape meldet sich als Escape (R6)", () => {
    const gruende: (string | undefined)[] = [];
    function Harness2({ open }: { open: boolean }) {
      return (
        <>
          <button data-testid="opener">Weiter</button>
          <ExpeditionStage
            open={open}
            onClose={(grund) => gruende.push(grund)}
            course={COURSE}
            free={false}
            isAdult={false}
            uppercase={false}
            voiceEnabled={false}
            letters={{}}
            onWin={() => {}}
          />
        </>
      );
    }
    const { rerender } = render(<Harness2 open={false} />);
    const opener = screen.getByTestId("opener");
    opener.focus();
    expect(document.activeElement).toBe(opener);
    // Tor geht auf: Fokus wandert ins Spielfeld (wie in der App).
    rerender(<Harness2 open />);
    const field = screen.getByRole("application");
    expect(document.activeElement).toBe(field);
    // Escape meldet sich als Escape - daran erkennt der Aufrufer, dass er in
    // die Eingabezeile gehen muss und nicht auf den Auslöser.
    fireEvent.keyDown(field, { key: "Escape" });
    expect(gruende).toEqual(["escape"]);
    // Der Knopf „Spiel beenden" meldet KEINEN Grund - dort gilt der
    // Rückweg des Aufrufers.
    fireEvent.click(screen.getByRole("button", { name: /Später wiederholen|Vielleicht später|Spiel beenden/ }));
    expect(gruende).toEqual(["escape", undefined]);
  });
});

describe("F6 — Freischalt-Feier spielt nicht bei jedem Re-Render neu", () => {
  /**
   * ★ UMGESCHRIEBEN am 22.08.2026 (Fokusziele, Nr 12).
   *
   * F6 sicherte ursprünglich, dass der SELBSTSCHLIESSER nach sieben Sekunden
   * ab dem Mounten läuft und ein beiläufiger Re-Render ihn nicht zurücksetzt
   * (K18). Diesen Selbstschließer gibt es nicht mehr: Johannes' Regel vom
   * 22.08.2026 verbietet Zeitgeber, die ein FOKUSSIERTES Element entfernen -
   * und der Fokus stand auf „Weiter". Wer die Ansage noch hörte oder auf der
   * Braillezeile las, stand mitten im Satz im Nichts.
   *
   * Was von F6 bleibt und hier weiterhin geprüft wird: Ein beiläufiger
   * Re-Render (frische `onClose`, Alt + V, Sprachwechsel) darf die Karte NICHT
   * von selbst schließen - und auch nach der alten Frist von sieben Sekunden
   * steht sie noch.
   */
  it("★ die Karte schliesst sich NIE von selbst - auch nicht nach 7 Sekunden", () => {
    vi.useFakeTimers();
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();
    const { rerender } = render(
      <UnlockCelebration unit="d" skin="kind" onClose={onClose1} />,
    );
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    // Beiläufiger Eltern-Re-Render reicht eine FRISCHE onClose durch.
    rerender(<UnlockCelebration unit="d" skin="kind" onClose={onClose2} />);
    act(() => {
      vi.advanceTimersByTime(60_000); // weit über die frühere Frist hinaus
    });
    expect(onClose1).not.toHaveBeenCalled();
    expect(onClose2).not.toHaveBeenCalled();
    // Und sie steht immer noch da, mit dem Fokus auf „Weiter".
    const weiter = screen.getByRole("button", { name: /weiter/i });
    expect(document.activeElement).toBe(weiter);
  });
});
