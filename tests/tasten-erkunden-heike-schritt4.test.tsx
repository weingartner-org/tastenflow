/**
 * ★ Testerin Rückmeldung „Tasten erkunden" (Test 24.10.2026), Schritt 4 vom
 * 28.10.2026 - die gezeichnete Tastatur:
 *  (1) Im Fenster: Esc und F1-F12, unter Windows auch zwei Win-Tasten und die
 *      Menü-Taste; die Reihen bleiben gleich breit. Das Üben bleibt schlank.
 *  (2) Die Win-Taste markiert nur sich selbst (vorher Alt/AltGr).
 *  (3) Die ISO-Eingabetaste ist EINE L-förmige Taste, nicht oben ↵ und unten
 *      eine leere Taste.
 *  (4) Die 5 im Ziffernblock trägt eine Tastmarke.
 *  (5) Unter der Tastatur steht, dass die eigene anders aussehen kann.
 */
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: vi.fn(),
  speakUiAlways: vi.fn(),
}));

import { Keyboard, type GedrueckteTaste } from "../src/components/typing/Keyboard";
import { TastenErkunden } from "../src/components/typing/TastenErkunden";
import { useGrosseTastatur } from "../src/lib/typing/grosseTastatur";
import { layoutById, setLayout, type LayoutId } from "../src/lib/typing/layouts";

afterEach(() => {
  cleanup();
  setLayout("de");
  useGrosseTastatur.setState({ aktiv: false });
});

function zeichne(id: LayoutId, vollstaendig?: "windows" | "mac", gedrueckt?: GedrueckteTaste) {
  setLayout(id);
  const { container } = render(
    <Keyboard layout={layoutById(id)} unlocked={new Set()} showFingerColors={false} gedrueckt={gedrueckt} vollstaendig={vollstaendig} />,
  );
  const an = () => [...container.querySelectorAll<HTMLElement>('[data-gedrueckt="an"]')].map((e) => e.textContent);
  const fReihe = container.querySelector<HTMLElement>("[data-f-reihe]");
  const spalte = container.firstElementChild!.firstElementChild!;
  const leertastenReihe = spalte.lastElementChild as HTMLElement;
  return { container, an, fReihe, leertastenReihe };
}

/** Summe der em-Breiten einer Reihe samt Abständen (0.3em) - die rechten Kanten müssen fluchten. */
function breite(reihe: HTMLElement): number {
  const kinder = [...reihe.children] as HTMLElement[];
  const summe = kinder.reduce((s, k) => s + parseFloat(k.style.width || "0"), 0);
  return Math.round((summe + 0.3 * (kinder.length - 1)) * 10) / 10;
}

describe("(1) die volle Tastatur nur im Fenster", () => {
  it("windows: Esc + F1-F12 oben, Strg Win Alt Leertaste AltGr Win Menü Strg unten", () => {
    const { fReihe, leertastenReihe } = zeichne("de", "windows");
    expect(fReihe).not.toBeNull();
    const fTasten = [...fReihe!.querySelectorAll("span")].map((s) => s.textContent);
    expect(fTasten).toEqual(["Esc", ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`)]);
    expect([...leertastenReihe.children].map((k) => k.textContent)).toEqual([
      "Strg", "Win", "Alt", "Leertaste", "AltGr", "Win", "☰", "Strg",
    ]);
  });

  it("die Leertastenreihe bleibt so breit wie vorher (34 em)", () => {
    const schlank = zeichne("de").leertastenReihe;
    const schlankBreite = breite(schlank);
    cleanup();
    expect(breite(zeichne("de", "windows").leertastenReihe)).toBe(schlankBreite);
    expect(schlankBreite).toBe(34);
  });

  it("mac: die F-Reihe ja, aber keine Win-Tasten", () => {
    const { fReihe, leertastenReihe } = zeichne("de", "mac");
    expect(fReihe).not.toBeNull();
    expect(leertastenReihe.textContent).not.toMatch(/Win/);
  });

  it("Gegenprobe Üben: ohne `vollstaendig` keine F-Reihe, keine Win-Taste", () => {
    const { fReihe, leertastenReihe } = zeichne("de");
    expect(fReihe).toBeNull();
    expect(leertastenReihe.children).toHaveLength(5);
  });

  it("F7 und Esc werden markiert", () => {
    expect(zeichne("de", "windows", { code: "F7", key: "F7" }).an()).toEqual(["F7"]);
    cleanup();
    expect(zeichne("de", "windows", { code: "Escape", key: "Escape" }).an()).toEqual(["Esc"]);
  });

  it("mit Ziffernblock rücken Pfeil- und Ziffernblock um die F-Reihe nach unten", () => {
    useGrosseTastatur.setState({ aktiv: true });
    const { container } = zeichne("de", "windows");
    const block = container.querySelector<HTMLElement>("[data-ziffernblock]")!.parentElement!;
    expect(block.style.marginTop).toBe("2.4em");
  });
});

describe("(2) die Win-Taste markiert nur sich selbst", () => {
  it("windows voll: MetaLeft ⇒ linke Win, MetaRight ⇒ rechte Win, ContextMenu ⇒ Menü", () => {
    expect(zeichne("de", "windows", { code: "MetaLeft", key: "Meta" }).an()).toEqual(["Win"]);
    cleanup();
    expect(zeichne("de", "windows", { code: "ContextMenu", key: "ContextMenu" }).an()).toEqual(["☰"]);
    cleanup();
    expect(zeichne("de", "windows", { code: "AltLeft", key: "Alt" }).an()).toEqual(["Alt"]);
  });

  it("Gegenprobe ohne Win-Tasten (Üben, Mac): Meta sitzt weiter auf Alt", () => {
    expect(zeichne("de", undefined, { code: "MetaLeft", key: "Meta" }).an()).toEqual(["Alt"]);
  });
});

describe("(3) die ISO-Eingabetaste ist eine Taste", () => {
  it("de: oberer und unterer Teil sind verbunden", () => {
    const { container } = zeichne("de");
    const oben = container.querySelector<HTMLElement>('[data-iso-enter="oben"]')!;
    const unten = container.querySelector<HTMLElement>('[data-iso-enter="unten"]')!;
    expect(oben.textContent).toBe("↵");
    expect(unten.style.marginTop).toBe("calc(-0.3em - 1px)");
    expect(parseFloat(unten.style.borderTopWidth)).toBe(0);
    expect(parseFloat(oben.style.borderBottomRightRadius)).toBe(0);
  });

  it("gedrückt: beide Teile markiert, wie bisher", () => {
    const { container } = zeichne("de", undefined, { code: "Enter", key: "Enter" });
    expect(container.querySelector('[data-iso-enter="oben"]')!.getAttribute("data-gedrueckt")).toBe("an");
    expect(container.querySelector('[data-iso-enter="unten"]')!.getAttribute("data-gedrueckt")).toBe("unterteil");
  });

  it("Gegenprobe us (ANSI, ein breiter Enter): nichts zu verbinden", () => {
    const { container } = zeichne("us");
    expect(container.querySelector("[data-iso-enter]")).toBeNull();
  });
});

describe("(4) Tastmarke auf der Ziffernblock-5", () => {
  it("nur die 5 trägt sie", () => {
    useGrosseTastatur.setState({ aktiv: true });
    const { container } = zeichne("de");
    const marken = [...container.querySelectorAll("[data-ziffernblock] [data-tastmarke]")];
    expect(marken).toHaveLength(1);
    expect(marken[0]!.parentElement!.textContent).toBe("5");
  });
});

describe("(5) im Fenster", () => {
  it("volle Tastatur, Hinweissatz, F7 leuchtet", () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" />);
    expect(document.body.textContent).toContain(
      "Deine Tastatur kann anders aussehen. Jede Taste wird erklärt, auch wenn sie hier fehlt.",
    );
    fireEvent.keyDown(document, { key: "F7", code: "F7" });
    const sichtbar = document.querySelector("[data-tastatur]")!;
    expect(sichtbar.querySelector("[data-f-reihe]")).not.toBeNull();
    expect([...sichtbar.querySelectorAll('[data-gedrueckt="an"]')].map((e) => e.textContent)).toEqual(["F7"]);
  });
});
