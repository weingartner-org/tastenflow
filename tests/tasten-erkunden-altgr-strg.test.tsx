/**
 * ★ 28.10.2026, gemessen am Windows-PC (Edge, deutsche Tastatur, echte Tasten per
 * SendInput): AltGr schickt 0,1-0,2 ms VOR `AltRight` ein eigenes keydown
 * `Control`/`ControlLeft` (ctrlKey, kein altKey).
 *  · Tasten erkunden sagte darum erst „Steuerung, Steuerungstaste …", dann AltGr.
 *  · In „Tasten finden" zählte dieses Strg als „andere Taste dazwischen" (D1) -
 *    zweimal AltGr hintereinander galt als gefunden.
 * Seither wartet Strg links 30 ms; kommt AltRight, war es keins.
 */
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const stimme = vi.hoisted(() => ({ ui: vi.fn() }));
vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: stimme.ui,
  speakUiAlways: vi.fn(),
}));

import { TastenErkunden } from "../src/components/typing/TastenErkunden";

afterEach(() => {
  cleanup();
  stimme.ui.mockClear();
});

const zeile = () => document.querySelector<HTMLTextAreaElement>("textarea[data-erkunden-zeile]")!.value;
const warte = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)));
const gesagt = () => stimme.ui.mock.calls.map((c) => String(c[0])).join(" | ");

/** Was Windows beim Druck auf AltGr schickt: erst Strg links, gleich danach AltRight. */
function altGr(): void {
  fireEvent.keyDown(document, { key: "Control", code: "ControlLeft", ctrlKey: true });
  fireEvent.keyDown(document, { key: "AltGraph", code: "AltRight", ctrlKey: true, altKey: true, modifierAltGraph: true });
}

describe("Tasten erkunden", () => {
  it("AltGr: nur AltGr wird erklärt, nie Strg - auch nicht später", async () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    stimme.ui.mockClear();
    altGr();
    expect(zeile()).toMatch(/^AltGr-Taste - /);
    await warte(60);
    expect(zeile()).toMatch(/^AltGr-Taste - /);
    expect(gesagt()).not.toMatch(/Steuerung/);
  });

  it("Strg links allein wird nach der kurzen Wartezeit erklärt", async () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    fireEvent.keyDown(document, { key: "Control", code: "ControlLeft", ctrlKey: true });
    await warte(60);
    expect(zeile()).toMatch(/^Strg - Steuerungstaste - /);
  });

  it("Strg links wird verhindert, auch während es wartet", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    expect(fireEvent.keyDown(document, { key: "Control", code: "ControlLeft", ctrlKey: true })).toBe(false);
  });

  it("Gegenprobe Mac: ctrl links wartet nicht (dort gibt es kein AltGr)", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="macos" />);
    fireEvent.keyDown(document, { key: "Control", code: "ControlLeft", ctrlKey: true });
    expect(zeile()).toMatch(/^ctrl - /);
  });
});

describe("Tasten finden: AltGr gesucht", () => {
  /** Spielt die »Im Griff«-Runde (feste Reihenfolge), bis AltGr gesucht wird. */
  const TASTE: [string, [string, string]][] = [
    ["Bild-ab", ["PageDown", "PageDown"]], ["Bild-auf", ["PageUp", "PageUp"]],
    ["Pfeil nach links", ["ArrowLeft", "ArrowLeft"]], ["Pfeil nach rechts", ["ArrowRight", "ArrowRight"]],
    ["Pfeil nach oben", ["ArrowUp", "ArrowUp"]], ["Pfeil nach unten", ["ArrowDown", "ArrowDown"]],
    ["Enter", ["Enter", "Enter"]], ["Leertaste", [" ", "Space"]], ["Shift", ["Shift", "ShiftLeft"]],
    ["Caps Lock", ["CapsLock", "CapsLock"]], ["Esc", ["Escape", "Escape"]], ["Strg", ["Control", "ControlRight"]],
    ["Alt-Taste", ["Alt", "AltLeft"]], ["Pos1", ["Home", "Home"]], ["Ende", ["End", "End"]],
    ["Entf", ["Delete", "Delete"]], ["Win", ["Meta", "MetaLeft"]], ["Einfg", ["Insert", "Insert"]],
    ["Tab", ["Tab", "Tab"]], ["Backspace", ["Backspace", "Backspace"]],
  ];
  const druck = ([key, code]: [string, string]) => fireEvent.keyDown(document, { key, code });

  it("zweimal AltGr ohne andere Taste dazwischen zählt NICHT als gefunden", async () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" startModus="finden" />);
    for (let i = 0; i < 40; i++) {
      const z = zeile();
      if (/Finde (die )?AltGr/.test(z)) break;
      const m = /Finde (?:den |die |das )?([^.,]+)/.exec(z);
      const name = m?.[1]!.trim() ?? "";
      const t = TASTE.find(([n]) => name.startsWith(n))?.[1];
      if (!t) throw new Error(`unerwartet: ${z}`);
      druck(t);
      druck(["x", "KeyX"]);
      druck(t);
    }
    expect(zeile()).toMatch(/Finde (die )?AltGr/);

    altGr();
    await warte(60);
    expect(zeile()).toMatch(/^Gefunden! Drück eine andere Taste, dann noch einmal (die )?AltGr/);

    altGr();
    await warte(60);
    expect(zeile(), "das Strg vor AltGr ist keine andere Taste").toMatch(/^Gefunden!/);
  });
});
