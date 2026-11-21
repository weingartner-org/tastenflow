import { fireEvent, screen, within } from "@testing-library/react";

/**
 * Öffnet einen Schalter der Aufgaben-Leiste „Für die ganze Klasse" (20.10.2026,
 * `AufgabenLeiste`): Die Panels der Reiter stehen seither hinter Schaltern,
 * genau wie in Tastenflow - ein zugeklapptes Panel ist `hidden`, `getByRole`
 * findet seine Knöpfe erst, wenn es offen ist. Es ist höchstens eines offen.
 */
export function oeffneLeiste(name: string | RegExp): HTMLElement {
  const gruppe = screen.getByRole("group", { name: "Für die ganze Klasse" });
  const knopf = within(gruppe).getByRole("button", { name });
  if (knopf.getAttribute("aria-expanded") !== "true") fireEvent.click(knopf);
  return knopf;
}
