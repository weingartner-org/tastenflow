/**
 * ★★★ F3-it (02.10.2026): Die ERKANNTE italienische Tastatur darf hinter dem Schalter bleiben.
 *
 * Die italienischen Tastaturen sind unsichtbar ohne `?italienisch-lehrgang=1`. Die Erkennung
 * (`erkenneTastatur`) kennt aber seit F3 die italienische Windows-Belegung. Ohne Schutz fragte der
 * Streifen über der Übung auch ein Kind auf Weg „de" an einem italienischen Windows-PC: „Wir haben
 * eine andere Tastatur erkannt: Italienisch ... Übernehmen?" - und führte es in den versteckten Teil.
 *
 * Geprüft wird: Schalter AUS ⇒ kein Streifen, keine Vorwahl; Schalter AN ⇒ Streifen (Vorschlag, nie
 * still umgestellt). Die elf bisherigen Tastaturen bleiben davon unberührt (Gegenprobe „be").
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import { type BelegungLesbar } from "../src/lib/typing/tastaturErkennung";
import { activeLayoutId, setLayout, setzeLayoutPlattform } from "../src/lib/typing/layouts";
import { LEHRGANG_PROBE_MERKER_IT } from "../src/lib/typing/lehrgangSchalter";
import { TastaturVorschlag } from "../src/components/typing/TastaturVorschlag";
import { erkennungZuruecksetzen } from "../src/components/typing/useTastaturErkennung";

const IT_WINDOWS = new Map<string, string>(
  Object.entries({
    Backquote: "\\", Minus: "'", Equal: "ì", KeyQ: "q", KeyA: "a", KeyY: "y", KeyZ: "z", KeyM: "m",
    BracketLeft: "è", BracketRight: "+", Semicolon: "ò", Quote: "à", Backslash: "ù",
    Digit1: "1", Digit6: "6", Comma: ",", Period: ".", Slash: "-", IntlBackslash: "<",
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

describe("F3-it · der Streifen „andere Tastatur erkannt\" und der italienische Schalter", () => {
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

  it("★ Schalter AUS: an einem italienischen PC kein Vorschlag - auch nicht für Weg „de\"", async () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_IT, "0"); // seit 10.10.2026 ist der Standard AN - hier der Not-Aus
    mitSystem(IT_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByTestId("tastatur-vorschlag")).toBeNull();
    expect(activeLayoutId()).toBe("de");
  });

  it("Schalter ausdrücklich AUS (Not-Aus =0): ebenfalls kein Vorschlag", async () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_IT, "0");
    mitSystem(IT_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByTestId("tastatur-vorschlag")).toBeNull();
  });

  it("★ Standard ist AN (ohne Merker, seit 10.10.2026): Vorschlag „Italienisch\" - erst „Übernehmen\" stellt um, nie still", async () => {
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_IT)).toBeNull();
    mitSystem(IT_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Italienisch");
    expect(activeLayoutId()).toBe("de");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });
    expect(activeLayoutId()).toBe("it");
  });

  it("★ Schalter AN: Vorschlag „Italienisch\" - erst „Übernehmen\" stellt um, nie still", async () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_IT, "1");
    mitSystem(IT_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Italienisch");
    expect(activeLayoutId()).toBe("de");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });
    expect(activeLayoutId()).toBe("it");
  });

  it("Gegenprobe: eine bisherige Tastatur („be\") wird mit AUSGESCHALTETEM italienischem Schalter weiter vorgeschlagen", async () => {
    mitSystem(new Map(Object.entries(FIXTURE.be.belegung)));
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Belgien");
  });
});
