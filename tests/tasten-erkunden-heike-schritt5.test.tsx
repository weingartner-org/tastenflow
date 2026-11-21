/**
 * ★ Testerin Rückmeldung „Tasten erkunden" (Test 24.10.2026), Schritt 5 vom
 * 28.10.2026: „Hier ist ein Fehler drin: Drücke Backspace: Backspace. Drücke
 * eine andere Taste und danach noch mal Backspace: Leertaste. Es geht weiter,
 * da Leer als Backspace erkannt wurde."
 *
 * NICHT nachstellbar (28.10.2026): im lokalen Browser mit echten Tastendrücken
 * (»Im Griff«) und hier in beiden Wegen (»Im Griff«-Runde und Tastenflow
 * „Meine Tasten") sagt die Leertaste „Das ist die Leertaste. Finde Backspace."
 * und die Runde bleibt stehen. Die Regel D1 (18.10.) war am 24.10. live.
 * Dieser Wächter hält genau Testerin Ablauf fest - bis eine Messung zeigt, was
 * an ihrem Gerät anders war.
 */
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: vi.fn(),
  speakUiAlways: vi.fn(),
}));

import { TastenErkunden } from "../src/components/typing/TastenErkunden";

afterEach(() => cleanup());

const zeile = () => document.querySelector<HTMLTextAreaElement>("textarea[data-erkunden-zeile]")!.value;
const druck = (key: string, code: string) => fireEvent.keyDown(document, { key, code });

/** Gesuchter Name (Anfang) → die Taste dazu. Reihenfolge zählt: „Bild-ab" vor „Bild", „AltGr" vor „Alt". */
const TASTE: [string, [string, string]][] = [
  ["Bild-ab", ["PageDown", "PageDown"]], ["Bild-auf", ["PageUp", "PageUp"]],
  ["Pfeil nach links", ["ArrowLeft", "ArrowLeft"]], ["Pfeil nach rechts", ["ArrowRight", "ArrowRight"]],
  ["Pfeil nach oben", ["ArrowUp", "ArrowUp"]], ["Pfeil nach unten", ["ArrowDown", "ArrowDown"]],
  ["Enter", ["Enter", "Enter"]], ["Leertaste", [" ", "Space"]], ["Shift", ["Shift", "ShiftLeft"]],
  ["Caps Lock", ["CapsLock", "CapsLock"]], ["Esc", ["Escape", "Escape"]], ["Strg", ["Control", "ControlRight"]] /* Strg links wartet 30 ms auf AltGr */,
  ["AltGr", ["AltGraph", "AltRight"]], ["Alt", ["Alt", "AltLeft"]], ["Pos1", ["Home", "Home"]],
  ["Ende", ["End", "End"]], ["Entf", ["Delete", "Delete"]], ["Win", ["Meta", "MetaLeft"]],
  ["Einfg", ["Insert", "Insert"]], ["Tab", ["Tab", "Tab"]],
];

/** Spielt die Runde (jede Taste, eine andere, dieselbe noch einmal), bis Backspace gesucht wird. */
async function bisBackspace(): Promise<void> {
  let letzte: [string, string] | null = null;
  for (let i = 0; i < 400; i++) {
    const z = zeile();
    if (/Backspace|Löschtaste/.test(z.split("Finde")[1] ?? "")) return;
    // ★ Seit 07.11.2026 (96268387a, Testerin 04./05.11.) wollen Shift und Strg
    // BEIDE Seiten: „Links gefunden. Jetzt die rechte." - also die andere Seite
    // derselben Taste drücken.
    const seite = /^(Links|Rechts) gefunden\. Jetzt die (rechte|linke)\./.exec(z);
    if (seite && letzte) {
      const [key, code] = letzte;
      const andere = seite[1] === "Links" ? code.replace(/Left$/, "Right") : code.replace(/Right$/, "Left");
      druck(key, andere);
      // Strg links wartet 30 ms, ob noch AltGr kommt - erst danach zählt der Druck.
      if (andere === "ControlLeft") await new Promise((r) => setTimeout(r, 50));
      continue;
    }
    // Tastenflow „Meine Tasten" wählt die Tasten zufällig - kam Backspace nicht dran: neue Runde (Enter).
    if (/Noch einmal mit Enter/.test(z)) {
      druck("Enter", "Enter");
      continue;
    }
    const m = /Finde (?:den |die |das )?([^.,]+)/.exec(z);
    const name = m?.[1]!.trim() ?? "";
    // Tastenflow „Meine Tasten" fragt auch gelernte Buchstaben („Finde N.").
    const buchstabe: [string, string] | null = [...name].length === 1 ? [name.toLowerCase(), "KeyQ"] : null;
    const t = buchstabe ?? TASTE.find(([n]) => name.startsWith(n))?.[1];
    if (!t) throw new Error(`unerwartet: ${z}`);
    letzte = t;
    druck(...t);
    druck("1", "Digit1");
    druck(...t);
  }
  throw new Error(`Backspace kam nicht dran - zuletzt: ${zeile()}`);
}

describe("Testerin Ablauf: Backspace, Leertaste, Backspace", () => {
  for (const weg of ["imgriff", "tastenflow"] as const) {
    it(`${weg}: die Leertaste zählt nicht als Backspace, erst Backspace danach`, async () => {
      const lade = weg === "tastenflow" ? () => Promise.resolve([..."asdfjklöeinr"]) : undefined;
      render(<TastenErkunden open onClose={vi.fn()} plattform="windows" startModus="finden" {...(lade ? { ladeGelernte: lade } : {})} />);
      await new Promise((r) => setTimeout(r, 20));
      await bisBackspace();

      druck("Backspace", "Backspace");
      expect(zeile()).toMatch(/^Gefunden! Drück eine andere Taste, dann noch einmal Backspace\./);

      druck(" ", "Space");
      expect(zeile()).toMatch(/^Das ist die Leertaste\. Finde Backspace\./);

      // Noch einmal die Leertaste: weiter daneben, die Runde bleibt stehen.
      druck(" ", "Space");
      expect(zeile()).toMatch(/^Das ist die Leertaste\. Finde Backspace\./);

      druck("Backspace", "Backspace");
      expect(zeile()).not.toMatch(/Finde Backspace/);
    });
  }
});
