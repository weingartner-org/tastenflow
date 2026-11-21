/**
 * WÄCHTER: „Jede Woche (laufend)" muss auch beim AUFKLAPPEN so aussehen
 * (Befund 16.09.2026, Johannes: „bei der jede woche laufend sollten
 * standardmäßig alle wochen ausgewählt sein, es sind aber alle deaktiviert").
 *
 * Vorher stand im geschlossenen Knopf zwar „Jede Woche (laufend)", aber die
 * aufgeklappte Liste zeigte KEIN einziges angehaktes Kästchen - das sah aus
 * wie „nichts gewählt", nicht wie „alles gewählt". Jetzt zeigen bei leerer
 * Auswahl alle angezeigten Wochen als angehakt, und ein Abwählen einer
 * einzelnen Woche bedeutet „jede Woche ausser dieser" - nicht "nur diese
 * eine".
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { WeekMultiSelect } from "@/components/typing/WeekMultiSelect";
import { listSelectableWeeks } from "@/lib/typing";

afterEach(cleanup);

const NOW_MS = new Date(2026, 8, 16, 9, 0, 0).getTime();
const WOCHEN = listSelectableWeeks(NOW_MS, 5);

function oeffnen() {
  fireEvent.click(screen.getByRole("button", { name: /Ziel-Kalenderwochen/i }));
}

describe('WeekMultiSelect - „laufend" sieht auch so aus', () => {
  it("zeigt bei leerer Auswahl ALLE angezeigten Wochen als angehakt", () => {
    render(<WeekMultiSelect value={[]} onChange={vi.fn()} nowMs={NOW_MS} count={5} />);
    expect(screen.getByText("Jede Woche (laufend)")).toBeTruthy();
    oeffnen();
    const kaestchen = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(kaestchen).toHaveLength(5);
    expect(kaestchen.every((k) => k.checked)).toBe(true);
    expect(screen.getByText("alle (laufend)")).toBeTruthy();
  });

  it('Abwählen EINER Woche aus „laufend" ergibt „alle ausser dieser" - nicht nur diese eine', () => {
    const onChange = vi.fn();
    render(<WeekMultiSelect value={[]} onChange={onChange} nowMs={NOW_MS} count={5} />);
    oeffnen();
    const kaestchen = screen.getAllByRole("checkbox");
    fireEvent.click(kaestchen[0]);
    const erwartet = WOCHEN.slice(1)
      .map((w) => w.key)
      .sort();
    expect(onChange).toHaveBeenCalledWith(erwartet);
  });

  it('„jede Woche ausser dieser" zeigt genau diesen Satz im Knopf, und die eine bleibt unangehakt', () => {
    const restlichenVier = WOCHEN.slice(1).map((w) => w.key);
    render(
      <WeekMultiSelect value={restlichenVier} onChange={vi.fn()} nowMs={NOW_MS} count={5} />,
    );
    expect(screen.getByText(`Jede Woche außer ${WOCHEN[0].label}`)).toBeTruthy();
    oeffnen();
    const kaestchen = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(kaestchen[0].checked).toBe(false);
    expect(kaestchen.slice(1).every((k) => k.checked)).toBe(true);
  });

  it('erneutes Anhaken der letzten fehlenden Woche kehrt zu „laufend" (leerer Auswahl) zurück', () => {
    const onChange = vi.fn();
    const restlichenVier = WOCHEN.slice(1).map((w) => w.key);
    render(
      <WeekMultiSelect value={restlichenVier} onChange={onChange} nowMs={NOW_MS} count={5} />,
    );
    oeffnen();
    const kaestchen = screen.getAllByRole("checkbox");
    fireEvent.click(kaestchen[0]);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('der Schnell-Knopf heisst jetzt „Alle (laufend)" - passend zur neuen Optik', () => {
    render(<WeekMultiSelect value={["irgendeine-woche"]} onChange={vi.fn()} nowMs={NOW_MS} count={5} />);
    oeffnen();
    expect(screen.getByRole("button", { name: "Alle (laufend)" })).toBeTruthy();
  });
});
