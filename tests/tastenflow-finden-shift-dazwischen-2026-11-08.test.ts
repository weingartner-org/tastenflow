/**
 * Testerin 08.11.2026 (Meldung pmz4j730qlyz3jm): „Ich hatte als andere Taste die linke Shift,
 * da reagiert das Programm nicht." - nach dem ersten Treffer blieb die Runde bei
 * „Wähle eine andere Taste ..." stehen, weil Shift als stummer Veränderer verworfen wurde.
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import { findenSchritt, type FindenZiel } from "../src/lib/typing/findenRunde";
import { layoutById } from "../src/lib/typing/layouts";

const DE = layoutById("de");
const E = (o: Partial<KeyEventLike> & { key: string }): KeyEventLike => ({
  ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...o,
});
const ziele: FindenZiel[] = [{ art: "zeichen", zeichen: "d" }, { art: "zeichen", zeichen: "k" }];
const shift = E({ key: "Shift", code: "ShiftLeft", shiftKey: true });

describe("Shift als andere Taste dazwischen", () => {
  it("nach dem ersten Treffer antwortet die Runde auf Shift (kein Schweigen)", () => {
    const s = findenSchritt({ e: shift, ziele, index: 0, bestaetigt: true, dazwischen: false, plattform: "windows", layout: DE });
    expect(s?.art).toBe("daneben");
  });
  it("danach zählt das zweite D", () => {
    const s = findenSchritt({ e: E({ key: "d", code: "KeyD" }), ziele, index: 0, bestaetigt: true, dazwischen: true, plattform: "windows", layout: DE });
    expect(s?.art).toBe("weiter");
  });
  it("vor dem ersten Treffer bleibt Shift stumm", () => {
    expect(findenSchritt({ e: shift, ziele, index: 0, bestaetigt: false, plattform: "windows", layout: DE })).toBeNull();
  });
});
