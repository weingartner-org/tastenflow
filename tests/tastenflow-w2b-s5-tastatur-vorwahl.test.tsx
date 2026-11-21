/**
 * ★★ W2b Punkt 4 = S5 aus dem Windows-Befund §3.5 (28.09.2026): „In der
 * spanischen Oberfläche ist bei der Einrichtung die deutsche Tastatur
 * vorgewählt."
 *
 * Ursache: Die Vorwahl lief nur beim AUFBAU der Einrichtung. Wer sie deutsch
 * öffnete und dann im Sprachwähler „Español" nahm, behielt „Alemán". Jetzt
 * läuft sie bei jedem Sprachwechsel neu - solange vorher keine Tastatur
 * gemerkt war und niemand in der Einrichtung selbst eine angeklickt hat -, und
 * die ERKANNTE Tastatur (Punkt 3) geht der Browsersprache vor.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Einrichtung } from "@/components/typing/Einrichtung";
import { BedienSpracheProvider, useBedienSprache } from "@/lib/bedienSprache";
import { activeLayoutId, setLayout, setzeLayoutPlattform } from "@/lib/typing/layouts";
import type { Lernweg } from "@/lib/typing/lernweg";
import { LEHRGANG_PROBE_MERKER_ES } from "@/lib/typing/lernweg";
import { erkennungZuruecksetzen } from "@/components/typing/useTastaturErkennung";

function Umschalter() {
  const { wechsle } = useBedienSprache();
  return (
    <>
      <button type="button" onClick={() => wechsle("es")}>
        nach-es
      </button>
      <button type="button" onClick={() => wechsle("de")}>
        nach-de
      </button>
    </>
  );
}

function zeige(lernweg: Lernweg = "de") {
  return render(
    <BedienSpracheProvider spanischAn aktiv>
      <Umschalter />
      <Einrichtung
        lernweg={lernweg}
        stufe="teens"
        lang="de"
        onLangChange={() => {}}
        startUnits={2}
        onStartUnitsChange={() => {}}
        onExit={() => {}}
      />
    </BedienSpracheProvider>,
  );
}

const nav = navigator as Navigator & { keyboard?: unknown };

beforeEach(() => {
  setLayout("de");
  localStorage.clear();
  localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1");
  erkennungZuruecksetzen();
  setzeLayoutPlattform("windows");
});
afterEach(() => {
  cleanup();
  delete (nav as { keyboard?: unknown }).keyboard;
  erkennungZuruecksetzen();
  setzeLayoutPlattform(null);
  localStorage.clear();
});

describe("★★ Nachtlauf 28.09.: eine gemerkte Tastatur, die der Weg nicht anbietet, wird ersetzt", () => {
  it("AZERTY von einem französischen Besuch, jetzt Weg es ⇒ spanische Tastatur vorgewählt", async () => {
    setLayout("fr");
    localStorage.setItem("tippen-layout", "fr");
    await act(async () => {
      zeige("es");
    });
    expect(activeLayoutId()).toBe("es");
  });
  it("Gegenprobe: gemerkte Schweizer Tastatur auf Weg de bleibt", async () => {
    setLayout("ch");
    localStorage.setItem("tippen-layout", "ch");
    await act(async () => {
      zeige("de");
    });
    expect(activeLayoutId()).toBe("ch");
  });
});

describe("★★ S5: die Vorwahl folgt dem Sprachwechsel in der Einrichtung", () => {
  it("deutsch geöffnet ⇒ nichts vorgewählt (wie bisher); dann Español ⇒ spanische Tastatur", async () => {
    zeige();
    expect(localStorage.getItem("tippen-layout")).toBeNull();
    expect(activeLayoutId()).toBe("de");
    await act(async () => {
      fireEvent.click(screen.getByText("nach-es"));
    });
    // jsdom: navigator.languages = ["en-US"] - kein es-*, also Spanien.
    expect(activeLayoutId()).toBe("es");
  });

  it("zurück auf Deutsch ⇒ wieder die deutsche", async () => {
    zeige();
    await act(async () => {
      fireEvent.click(screen.getByText("nach-es"));
    });
    await act(async () => {
      fireEvent.click(screen.getByText("nach-de"));
    });
    expect(activeLayoutId()).toBe("de");
  });

  it("hat die Person selbst eine Tastatur angeklickt, bleibt sie - auch beim Sprachwechsel", async () => {
    zeige();
    // willkommen → alter → sprache → tastatur
    for (let i = 0; i < 3; i++) {
      fireEvent.click(document.querySelector<HTMLButtonElement>("section .btn-primary")!);
    }
    await act(async () => {
      fireEvent.click(screen.getByText(/Schweiz \(Schweizer Tastatur\)/));
    });
    expect(activeLayoutId()).toBe("ch");
    await act(async () => {
      fireEvent.click(screen.getByText("nach-es"));
    });
    expect(activeLayoutId()).toBe("ch");
  });

  it("war auf dem Gerät schon eine gemerkt, stellt die Einrichtung nichts um", async () => {
    setLayout("us");
    zeige();
    await act(async () => {
      fireEvent.click(screen.getByText("nach-es"));
    });
    expect(activeLayoutId()).toBe("us");
  });

  it("★ mit Erkennung (Punkt 3): erkannt Lateinamerika ⇒ latam, nicht die Vorwahl aus der Sprache", async () => {
    const fixture = JSON.parse(
      readFileSync(resolve(__dirname, "fixtures/tastatur-belegungen-windows.json"), "utf8"),
    ) as Record<string, { belegung: Record<string, string> }>;
    Object.defineProperty(nav, "keyboard", {
      configurable: true,
      value: { getLayoutMap: () => Promise.resolve(new Map(Object.entries(fixture.latam.belegung))) },
    });
    zeige("es");
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    await act(async () => {
      fireEvent.click(screen.getByText("nach-es"));
    });
    expect(activeLayoutId()).toBe("latam");
  });
});
