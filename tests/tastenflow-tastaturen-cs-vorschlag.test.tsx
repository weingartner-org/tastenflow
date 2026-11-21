/**
 * ★★★ F3-cs (02.10.2026): Die ERKANNTE tschechische Tastatur darf hinter dem Schalter bleiben.
 *
 * Die tschechischen Tastaturen sind unsichtbar ohne `?tschechisch-lehrgang=1`. Die Erkennung (`erkenneTastatur`) kennt
 * seit F3-cs die Windows-Belegungen „Čeština" und „Čeština (QWERTY)" (`Digit2` = „ě", `KeyY` entscheidet). Ohne Schutz
 * fragte der Streifen über der Übung auch ein Kind auf Weg „de" an einem tschechischen Windows-PC: „Wir haben eine
 * andere Tastatur erkannt: Tschechisch ... Übernehmen?" - und führte es in den versteckten Teil. Vorher (Erkennung
 * „unbekannt") gab es dort keinen Streifen.
 *
 * Geprüft wird: Schalter AUS ⇒ kein Streifen, keine Vorwahl; Schalter AN ⇒ Streifen (Vorschlag, nie still
 * umgestellt) - für QWERTZ UND QWERTY. Die bisherigen Tastaturen bleiben davon unberührt (Gegenprobe „be").
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import { type BelegungLesbar } from "../src/lib/typing/tastaturErkennung";
import { activeLayoutId, setLayout, setzeLayoutPlattform } from "../src/lib/typing/layouts";
import { LEHRGANG_PROBE_MERKER_CS } from "../src/lib/typing/lehrgangSchalter";
import { TastaturVorschlag } from "../src/components/typing/TastaturVorschlag";
import { erkennungZuruecksetzen } from "../src/components/typing/useTastaturErkennung";

/** Čeština (R1 §2.1), nur die Tasten, die die Erkennung liest. */
const CS_WINDOWS = new Map<string, string>(
  Object.entries({
    Backquote: ";", Digit2: "ě", Digit3: "š", Digit4: "č", KeyQ: "q", KeyA: "a", KeyY: "z", KeyZ: "y",
    BracketLeft: "ú", Semicolon: "ů", Quote: "§", Backslash: "¨", Minus: "=", Equal: "´", IntlBackslash: "\\",
  }),
);
/** Čeština (QWERTY) (R1 §2.2): dieselbe Grundebene, nur y und z getauscht. */
const CSQ_WINDOWS = new Map<string, string>([...CS_WINDOWS, ["KeyY", "y"], ["KeyZ", "z"]]);
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

describe("F3-cs · der Streifen „andere Tastatur erkannt\" und der tschechische Schalter", () => {
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

  it.each([["QWERTZ", CS_WINDOWS], ["QWERTY", CSQ_WINDOWS]] as const)("★ Schalter AUS: an einem tschechischen %s-PC kein Vorschlag - auch nicht für Weg „de\"", async (_n, b) => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_CS, "0"); // seit 10.10.2026 ist der Standard AN - hier der Not-Aus
    mitSystem(b);
    render(<TastaturVorschlag lernweg="de" bereit />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByTestId("tastatur-vorschlag")).toBeNull();
    expect(activeLayoutId()).toBe("de");
  });

  it("Schalter ausdrücklich AUS (Not-Aus =0): ebenfalls kein Vorschlag", async () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_CS, "0");
    mitSystem(CS_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByTestId("tastatur-vorschlag")).toBeNull();
  });

  it("★ Standard ist AN (ohne Merker, seit 10.10.2026): Vorschlag „Tschechisch (QWERTZ)\" - erst „Übernehmen\" stellt um, nie still", async () => {
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_CS)).toBeNull();
    mitSystem(CS_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Tschechisch");
    expect(streifen.textContent).toContain("QWERTZ");
    expect(activeLayoutId()).toBe("de");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });
    expect(activeLayoutId()).toBe("cs");
  });

  it("★ Schalter AN: Vorschlag „Tschechisch (QWERTZ)\" - erst „Übernehmen\" stellt um, nie still", async () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_CS, "1");
    mitSystem(CS_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Tschechisch");
    expect(streifen.textContent).toContain("QWERTZ");
    expect(activeLayoutId()).toBe("de");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });
    expect(activeLayoutId()).toBe("cs");
  });

  it("★ Schalter AN: auch die QWERTY-Tastatur wird erkannt und gemeldet („Tschechisch (QWERTY)\") - umgestellt wird erst auf „Übernehmen\"", async () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_CS, "1");
    mitSystem(CSQ_WINDOWS);
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("QWERTY");
    expect(activeLayoutId()).toBe("de");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });
    expect(activeLayoutId()).toBe("cs-qwerty");
  });

  it("Gegenprobe: eine bisherige Tastatur („be\") wird mit AUSGESCHALTETEM tschechischem Schalter weiter vorgeschlagen", async () => {
    mitSystem(new Map(Object.entries(FIXTURE.be.belegung)));
    render(<TastaturVorschlag lernweg="de" bereit />);
    const streifen = await screen.findByTestId("tastatur-vorschlag");
    expect(streifen.textContent).toContain("Belgien");
  });
});

describe("F3-cs · die Verdrahtung: Einrichtung und Zahnrad reichen den tschechischen Schalter an die Tastatur-Wahl durch", () => {
  // Ohne diese Zeile wären `cs` und `cs-qwerty` auch hinter `?tschechisch-lehrgang=1` nicht wählbar (wie bei it, pl, tr).
  // Quelltext-Wächter: die zwei Oberflächen lassen sich nicht ohne ihren ganzen Rattenschwanz rendern.
  it.each(["Einrichtung.tsx", "TypingSettings.tsx"])("%s: tastaturenFuerWeg bekommt { cs: tschechischLehrgangProbeAn() }", (datei) => {
    const quelle = readFileSync(resolve(__dirname, "../src/components/typing", datei), "utf8");
    expect(quelle).toMatch(/cs: tschechischLehrgangProbeAn\(\)/);
    expect(quelle).toMatch(/tschechischLehrgangProbeAn[^\n]*from "@\/lib\/typing\/lernweg"/);
  });
});
