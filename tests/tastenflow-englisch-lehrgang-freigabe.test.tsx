/**
 * ★★★★★ FREIGABE 25.09.2026: DER ENGLISCHE LEHRGANG IST DIE GRUNDEINSTELLUNG.
 *
 * Auftrag Johannes (Nachtlauf 25.09.2026): der englische Lehrgang geht live -
 * `englischLehrgangProbeAn()` (`src/lib/typing/lernweg.ts`) liefert ohne jede
 * Einstellung `true`; `?englisch-lehrgang=0` bleibt als Not-Aus erhalten.
 * Bauplan: `BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md` §10 (E10).
 *
 * ⚠️ Die BESTEHENDE Suite (rund 60 Dateien) ist für den GEGENTEILIGEN
 * Grundzustand geschrieben ("Schalter aus") - `tests/setup.ts` setzt dafür
 * einen Vorbeleger (Merker `tastenflow-englisch-lehrgang` = "0"). Jeder Test
 * HIER, der den WIRKLICHEN Grundzustand ohne diesen Vorbeleger prüfen will,
 * entfernt den Merker zuerst selbst - das ist der Sinn dieser Datei.
 *
 * Was hier bewiesen wird:
 *  1. Ohne jede Einstellung ist der Lehrgang an; `=0` schaltet ihn aus (Not-
 *     Aus), `=1` danach wieder an.
 *  2. Eine NEUE, englische Bedienung bekommt Weg „en" - eine neue, deutsche
 *     bleibt „de" (D1).
 *  3. „Bestand" bleibt gültig: ein Fortschritt mit Übung, aber ohne
 *     gespeicherten Weg, ist „de" - auch mit der neuen Grundeinstellung.
 *  4. Ein gespeicherter Weg gewinnt immer, unabhängig von der
 *     Grundeinstellung.
 *  5. Eine deutsche Klasse in den Klassen-Einstellungen sieht KEINE Erwähnung
 *     des Lehrgangs und KEIN Schreibweise-Feld - auch mit der Grundeinstellung
 *     an (§2c: nicht mehr an den Probe-Schalter gebunden, sondern an die
 *     Bedienung/den Klassenweg).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import {
  LEHRGANG_PROBE_MERKER,
  bestimmeLernweg,
  englischLehrgangProbeAn,
  fortschrittsLernweg,
  lernwegBeimAnlegen,
} from "../src/lib/typing/lernweg";
import { KlassenEinstellungsFelder } from "../src/components/typing/KlassenEinstellungsFelder";

beforeEach(() => {
  localStorage.clear();
  // ★ Der WIRKLICHE Grundzustand - ohne den Vorbeleger aus tests/setup.ts.
  localStorage.removeItem(LEHRGANG_PROBE_MERKER);
});

describe("★★★★★ 1 · der Schalter selbst - ohne Vorbeleger", () => {
  it("ohne jede Einstellung: an (die neue Grundeinstellung)", () => {
    expect(englischLehrgangProbeAn("")).toBe(true);
  });

  it("?englisch-lehrgang=0 schaltet aus (Not-Aus) und bleibt gemerkt", () => {
    expect(englischLehrgangProbeAn("?englisch-lehrgang=0")).toBe(false);
    expect(englischLehrgangProbeAn("")).toBe(false);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER)).toBe("0");
  });

  it("=1 schaltet ein gemerktes Not-Aus wieder an", () => {
    englischLehrgangProbeAn("?englisch-lehrgang=0");
    expect(englischLehrgangProbeAn("")).toBe(false);
    expect(englischLehrgangProbeAn("?englisch-lehrgang=1")).toBe(true);
    expect(englischLehrgangProbeAn("")).toBe(true);
  });

  it("gesperrter Speicher: kein Absturz - die Grundeinstellung (an) gilt einfach ungespeichert weiter", () => {
    const echt = window.localStorage;
    const kaputt = {
      getItem: () => {
        throw new Error("gesperrt");
      },
      setItem: () => {
        throw new Error("gesperrt");
      },
      removeItem: () => {
        throw new Error("gesperrt");
      },
    };
    Object.defineProperty(window, "localStorage", { value: kaputt, configurable: true });
    try {
      expect(englischLehrgangProbeAn("")).toBe(true);
    } finally {
      Object.defineProperty(window, "localStorage", { value: echt, configurable: true });
    }
  });
});

describe("★★★★★ 2 · was das für echte Lernende heisst (E10, §2.2 D1/D2)", () => {
  it("eine NEUE, englische Bedienung bekommt Weg „en\"", () => {
    const probeAn = englischLehrgangProbeAn("");
    expect(probeAn).toBe(true);
    expect(
      bestimmeLernweg({ gespeichert: null, bedienSprache: "en", lehrgangProbeAn: probeAn }),
    ).toBe("en");
  });

  it("eine NEUE, deutsche Bedienung bleibt Weg „de\"", () => {
    const probeAn = englischLehrgangProbeAn("");
    expect(
      bestimmeLernweg({ gespeichert: null, bedienSprache: "de", lehrgangProbeAn: probeAn }),
    ).toBe("de");
  });

  it("mit dem Not-Aus bleibt jeder auf „de\" - auch englische Bedienung", () => {
    const probeAus = englischLehrgangProbeAn("?englisch-lehrgang=0");
    expect(
      bestimmeLernweg({ gespeichert: null, bedienSprache: "en", lehrgangProbeAn: probeAus }),
    ).toBe("de");
  });

  it("★★★ Bestand: wer schon geübt hat, aber keinen Weg gespeichert hat, bleibt „de\" - auch jetzt", () => {
    const geuebtOhneWeg = fortschrittsLernweg({}, true);
    expect(geuebtOhneWeg).toBe("de");
    expect(
      bestimmeLernweg({
        gespeichert: geuebtOhneWeg,
        bedienSprache: "en",
        lehrgangProbeAn: englischLehrgangProbeAn(""),
      }),
    ).toBe("de");
  });

  it("ein frischer Fortschritt ohne Übung legt noch nichts fest - die Bedienung entscheidet dann", () => {
    expect(fortschrittsLernweg({}, false)).toBeNull();
    expect(
      bestimmeLernweg({
        gespeichert: fortschrittsLernweg({}, false),
        bedienSprache: "en",
        lehrgangProbeAn: englischLehrgangProbeAn(""),
      }),
    ).toBe("en");
  });

  it("ein gespeicherter Weg gewinnt immer - unabhängig von der Grundeinstellung", () => {
    const probeAn = englischLehrgangProbeAn("");
    expect(bestimmeLernweg({ gespeichert: "de", bedienSprache: "en", lehrgangProbeAn: probeAn })).toBe(
      "de",
    );
    expect(bestimmeLernweg({ gespeichert: "en", bedienSprache: "de", lehrgangProbeAn: probeAn })).toBe(
      "en",
    );
  });

  it("Selbstanmeldung mit englischer Bedienung: Weg „en\", wird gleich beim Anlegen fest", () => {
    expect(lernwegBeimAnlegen("en")).toEqual({ lernweg: "en", mitgeben: "en" });
  });

  it("Selbstanmeldung mit deutscher Bedienung: Weg „de\", das Feld bleibt leer", () => {
    expect(lernwegBeimAnlegen("de")).toEqual({ lernweg: "de", mitgeben: "de" });
  });
});

describe("★★★★★ 3 · deutsche Klassen-Einstellungen zeigen nichts Neues (§2c)", () => {
  afterEach(() => cleanup());

  function zeigeDeutscheKlasse() {
    return render(
      <KlassenEinstellungsFelder
        bezug="der Klasse 3b"
        werte={{ schulstufe: 7, lang: "de", langLocked: false, klassenmatchAus: false, zeilenEndeEnter: false }}
        jetztMs={Date.now()}
        startniveau={{ lernweg: "de", wert: "", platzhalter: "Stufe wählen", hinweis: "", srHinweis: "" }}
        onSchulstufe={() => {}}
        onSprache={() => {}}
        onSperre={() => {}}
        onStartniveau={() => {}}
        onKlassenmatch={() => {}}
        onZeilenEnde={() => {}}
        onSchreibweise={() => {}}
      />,
    );
  }

  it("keine Lehrgang-Erwähnung, kein Schreibweise-Feld - auch mit der Grundeinstellung wirklich an", () => {
    // Ohne Anbieter liefert `useBedienSprache()` immer „de"
    // (`BedienSpracheProvider.tsx`, `OHNE_PROVIDER`) - die deutsche Bedienung
    // ist hier also echt, nicht nur ein Testartefakt.
    expect(englischLehrgangProbeAn("")).toBe(true);
    zeigeDeutscheKlasse();
    expect(screen.queryByText(/Lehrgang:/)).toBeNull();
    expect(screen.queryByText("Schreibweise")).toBeNull();
  });
});
