/**
 * ★★★ F3-tr (02.10.2026): Die ERKANNTE türkische Tastatur darf hinter dem Schalter bleiben.
 *
 * Die türkischen Tastaturen sind unsichtbar ohne `?tuerkisch-lehrgang=1`. Die Erkennung (`erkenneTastatur`) kennt
 * seit F3-tr die Windows-Belegungen „Türkçe Q" und „Türkçe F". Ohne Schutz fragte der Streifen über der Übung auch
 * ein Kind auf Weg „de" an einem türkischen Windows-PC: „Wir haben eine andere Tastatur erkannt: Türkisch Q ...
 * Übernehmen?" - und führte es in den versteckten Teil. Vorher (Erkennung „unbekannt") gab es dort keinen Streifen.
 *
 * Geprüft wird: Schalter AUS ⇒ kein Streifen, keine Vorwahl; Schalter AN ⇒ Streifen (Vorschlag, nie still
 * umgestellt) - für Q UND für F. Die elf bisherigen Tastaturen bleiben davon unberührt (Gegenprobe „be").
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import { type BelegungLesbar } from "../src/lib/typing/tastaturErkennung";
import { activeLayoutId, setLayout, setzeLayoutPlattform } from "../src/lib/typing/layouts";
import { LEHRGANG_PROBE_MERKER_TR } from "../src/lib/typing/lehrgangSchalter";
import { TastaturVorschlag } from "../src/components/typing/TastaturVorschlag";
import { erkennungZuruecksetzen } from "../src/components/typing/useTastaturErkennung";

/** Türkçe Q (R1 §2.1), nur die Tasten, die die Erkennung liest. */
const Q_WINDOWS = new Map<string, string>(
  Object.entries({
    Backquote: "\"", KeyQ: "q", KeyA: "a", KeyY: "y", KeyI: "ı", BracketLeft: "ğ", BracketRight: "ü",
    Semicolon: "ş", Quote: "i", Backslash: ",", Digit6: "6", Comma: "ö", Period: "ç", Slash: ".",
    IntlBackslash: "<",
  }),
);
/** Türkçe F (R1 §2.2), nur die Tasten, die die Erkennung liest. */
const F_WINDOWS = new Map<string, string>(
  Object.entries({
    Backquote: "+", KeyQ: "f", KeyA: "u", KeyY: "d", KeyI: "n", BracketLeft: "q", BracketRight: "w",
    Semicolon: "y", Quote: "ş", Backslash: "x", Digit6: "6", Comma: "b", Period: ".", Slash: ",",
    IntlBackslash: "<",
  }),
);
const FIXTURE = JSON.parse(
  readFileSync(resolve(__dirname, "fixtures/tastatur-belegungen-windows.json"), "utf8"),
) as Record<string, { belegung: Record<string, string> }>;

const nav = navigator as Navigator & { keyboard?: unknown };
function mitSystem(b: Map<string, string>) {
  Object.defineProperty(nav, "keyboard", {
    configurable: true,
    value: { getLayoutMap: () => Promise.resolve(b as BelegungLesbar) },
  });
}

describe("F3-tr · der Streifen „andere Tastatur erkannt\" und der türkische Schalter", () => {
  beforeEach(() => {
    localStorage.clear();
    erkennungZuruecksetzen();
    setzeLayoutPlattform("windows");
    setLayout("de");
  });
  afterEach(() => {
    cleanup();
    delete (nav as { keyboard?: unknown }).keyboard;
    erkennungZuruecksetzen();
    setzeLayoutPlattform(null);
    setLayout("de");
    localStorage.clear();
  });

  it.each([["Q", Q_WINDOWS], ["F", F_WINDOWS]] as const)("★ Schalter AUS: an einem türkischen %s-PC kein Vorschlag - auch nicht für Weg „de\"", async (_n, b) => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_TR, "0"); // seit 10.10.2026 ist der Standard AN - hier der Not-Aus
    mitSystem(b);
    render(<TastaturVorschlag lernweg="de" bereit />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByTestId("tastatur-vorschlag")).toBeNull();
    expect(activeLayoutId()).toBe("de");
  });

  it("Schalter ausdrücklich AUS (Not-Aus =0): ebenfalls kein Vorschlag", async () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_TR, "0");
    mitSystem(Q_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByTestId("tastatur-vorschlag")).toBeNull();
  });

  it("★ Standard ist AN (ohne Merker, seit 10.10.2026): Vorschlag „Türkisch Q\" - erst „Übernehmen\" stellt um, nie still", async () => {
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_TR)).toBeNull();
    mitSystem(Q_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Türkisch Q");
    expect(activeLayoutId()).toBe("de");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });
    expect(activeLayoutId()).toBe("tr-q");
  });

  it("★ Schalter AN: Vorschlag „Türkisch Q\" - erst „Übernehmen\" stellt um, nie still", async () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_TR, "1");
    mitSystem(Q_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Türkisch Q");
    expect(activeLayoutId()).toBe("de");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });
    expect(activeLayoutId()).toBe("tr-q");
  });

  it("★ Schalter AN: auch die F-Tastatur wird erkannt und gemeldet („Türkisch F\") - umgestellt wird erst auf „Übernehmen\"", async () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_TR, "1");
    mitSystem(F_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Türkisch F");
    expect(activeLayoutId()).toBe("de");
  });

  it("Gegenprobe: eine bisherige Tastatur („be\") wird mit AUSGESCHALTETEM türkischem Schalter weiter vorgeschlagen", async () => {
    mitSystem(new Map(Object.entries(FIXTURE.be.belegung)));
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Belgien");
  });
});
