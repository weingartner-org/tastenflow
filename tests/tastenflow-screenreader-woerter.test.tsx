/**
 * ★★★★★ MIT DEM SCREENREADER ALLEIN: WÖRTER UND SÄTZE, NICHT NUR BUCHSTABEN
 * (Julian Iriogbe, obvita St. Gallen, 23.09.2026).
 *
 * Drei Befunde aus seiner Mail, drei Wächter:
 *
 *  1. Mit „Vorlesen aus" und „Buchstabieren an" kam nur die nächste Taste -
 *     *„statt lauter Einzelbuchstaben, die er erst während des Schreibens im
 *     Kopf zusammensetzen muss."* Jetzt: am Zeilenanfang der ganze Satz
 *     (Johannes 23.09.), am Wortanfang das Wort, dann die Tasten.
 *  2. Der Schalter „Buchstabieren" stand nur bei „Vorlesen an" - genau dort,
 *     wo man ihn für den Screenreader NICHT braucht.
 *  3. Mehrsprachige Edge-Stimmen lasen Einzelbuchstaben englisch oder
 *     französisch - sie raten die Sprache selbst.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, cleanup, act, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { TypingSession } from "@/components/typing/TypingSession";
import { TypingSettings } from "@/components/typing/TypingSettings";
import { useTypingA11y, TASTEN_ANSAGE_KEY } from "@/lib/typing/a11y";
import { istMehrsprachigeStimme, useVoice } from "@/lib/typing/voice";

async function abklingen(): Promise<void> {
  await act(async () => {
    await new Promise((f) => setTimeout(f, 900));
  });
}

function aufbauen(zeile: string) {
  act(() => useTypingA11y.getState().setTastenAnsage("naechste"));
  const ergebnis = render(
    <TypingSession
      items={[zeile]}
      contextId="test-screenreader-woerter"
      unlocked={new Set("das haus ist rot. fjk".split(""))}
      shiftLearned={false}
      stufe={1 as never}
      voiceEnabled={false}
      onRetry={() => {}}
    />,
  );
  const feld = ergebnis.container.querySelector<HTMLInputElement>('[data-feld="tippen"]');
  const live = ergebnis.container.querySelector('[role="status"][aria-live="assertive"]');
  if (!feld || !live) throw new Error("Übungsfeld oder Live-Bereich nicht gefunden");
  return { feld, live };
}

async function anschlag(feld: HTMLInputElement, live: Element, taste: string): Promise<string> {
  live.textContent = "pruefmarke";
  await act(async () => {
    fireEvent.keyDown(feld, { key: taste });
    await new Promise((f) => setTimeout(f, 120));
  });
  const jetzt = live.textContent ?? "";
  return jetzt === "pruefmarke" ? "" : jetzt.trim();
}

beforeEach(() => {
  try {
    localStorage.removeItem(TASTEN_ANSAGE_KEY);
  } catch {
    /* egal */
  }
});
afterEach(cleanup);

describe("1. Der Screenreader-Weg liest Satz und Wort", () => {
  it("★★★ sagt am Zeilenanfang den GANZEN Satz, dann das erste Wort", async () => {
    const { live } = aufbauen("das haus ist rot.");
    await abklingen();
    const text = (live.textContent ?? "").trim();
    expect(text.startsWith("das haus ist rot.")).toBe(true);
    expect(text).toMatch(/rot\. das/);
  });

  it("★★★ sagt am Wortanfang das ganze WORT - nicht nur den Buchstaben", async () => {
    const { feld, live } = aufbauen("das haus ist rot.");
    await abklingen();
    await anschlag(feld, live, "d");
    await anschlag(feld, live, "a");
    expect(await anschlag(feld, live, "s")).toBe("Leertaste");
    expect(await anschlag(feld, live, " ")).toMatch(/^haus,/);
    // Mitten im Wort bleibt es beim einzelnen Buchstaben.
    expect(await anschlag(feld, live, "h")).toBe("a");
  });

  it("buchstabiert eine ÜBUNGSSILBE weiter - dort gibt es kein Wort zu sagen", async () => {
    const { feld, live } = aufbauen("fjk");
    await abklingen();
    expect((live.textContent ?? "").trim()).toBe("f");
    expect(await anschlag(feld, live, "f")).toBe("j");
  });
});

describe("2. „Buchstabieren“ steht auch bei „Vorlesen aus“ da", () => {
  const settings = () =>
    render(
      <TypingSettings lernweg="de"
        stufe={"kids" as never}
        lang="de"
        onLangChange={() => {}}
        zeichenabstand={1}
        onZeichenabstandChange={() => {}}
      />,
    );

  it("★★★★ bei „Vorlesen aus“", () => {
    act(() => useVoice.setState({ enabled: false }));
    settings();
    expect(screen.getByRole("button", { name: "Buchstabieren" })).toBeTruthy();
  });

  it("und genau EINMAL bei „Vorlesen an“", () => {
    act(() => useVoice.setState({ enabled: true }));
    settings();
    expect(screen.getAllByRole("button", { name: "Buchstabieren" })).toHaveLength(1);
  });
});

describe("3. Mehrsprachige Stimmen", () => {
  it("erkennt die Edge-Stimmen am Namen", () => {
    expect(
      istMehrsprachigeStimme({ name: "Microsoft SeraphinaMultilingual Online (Natural) - German (Germany)" }),
    ).toBe(true);
    expect(istMehrsprachigeStimme({ name: "Microsoft Katja Online (Natural) - German (Germany)" })).toBe(false);
    expect(istMehrsprachigeStimme({ name: "Anna (premium)" })).toBe(false);
  });
});
