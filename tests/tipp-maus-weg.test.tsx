/**
 * Wächter: Der Hinweis beim Überfahren verschwindet, wenn die Maus weggeht
 * (Johannes 28.09.2026: „mouse over muss wieder verschwinden, wenn du die
 * Maus wegfährst" - alle Apps).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Tipp } from "../src/components/Tipp";
import { fokusIstSichtbar } from "../src/components/typing/Zeigerhinweis";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function baue() {
  render(
    <div>
      <Tipp text="Hilfe (Alt + H)">
        {(id) => (
          <button type="button" aria-describedby={id}>
            ?
          </button>
        )}
      </Tipp>
      <p>daneben</p>
    </div>,
  );
  const knopf = screen.getByRole("button");
  const kasten = document.getElementById(knopf.getAttribute("aria-describedby")!)!;
  const offen = () => !kasten.className.includes("invisible");
  return { knopf, offen };
}

describe("Tipp: Maus weg ⇒ Hinweis weg", () => {
  it("ein Fokus per MAUSKLICK hält den Hinweis nicht fest", () => {
    const { knopf, offen } = baue();
    const echt = Element.prototype.matches;
    vi.spyOn(Element.prototype, "matches").mockImplementation(function (this: Element, sel: string) {
      return sel === ":focus-visible" ? false : echt.call(this, sel);
    });
    fireEvent.mouseEnter(knopf.parentElement!);
    expect(offen()).toBe(true);
    act(() => knopf.focus()); // echter Fokus, wie nach einem Klick - aber nicht `:focus-visible`
    fireEvent.mouseLeave(knopf.parentElement!);
    expect(offen()).toBe(false);
  });

  it("ein Fokus per TABTASTE zeigt ihn weiter", () => {
    const { knopf, offen } = baue();
    act(() => knopf.focus());
    expect(fokusIstSichtbar(knopf)).toBe(true);
    expect(offen()).toBe(true);
  });

  it("Sicherheitsnetz: bleibt `mouseleave` aus, schliesst die nächste Mausbewegung ausserhalb", () => {
    const { knopf, offen } = baue();
    fireEvent.mouseEnter(knopf.parentElement!);
    expect(offen()).toBe(true);
    act(() => {
      screen.getByText("daneben").dispatchEvent(new Event("pointermove", { bubbles: true }));
    });
    expect(offen()).toBe(false);
  });

  it("eine Mausbewegung AUF dem Knopf schliesst nicht", () => {
    const { knopf, offen } = baue();
    fireEvent.mouseEnter(knopf.parentElement!);
    act(() => {
      knopf.dispatchEvent(new Event("pointermove", { bubbles: true }));
    });
    expect(offen()).toBe(true);
  });
});
