/**
 * ★★★ W2a (28.09.2026, SYNTHESE D-7): WEG „es" - UMSCHALT VOR DER TILDE-TASTE.
 *
 * Umschalt + ´-Taste gibt auf der spanischen Tastatur „¨"; danach ein Vokal
 * ergibt „ä" statt „á". Das bleibt EIN gewöhnlicher Fehlgriff (kein zweiter),
 * dazu kommt ein Hinweis in der Bedienungssprache, woran es lag.
 * Gegenprobe: Weg „de" und ein anderer Fehlgriff auf „es" ohne Hinweis.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";

const ton = vi.hoisted(() => ({ fehler: vi.fn() }));
vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: ton.fehler, playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { TypingSession } from "@/components/typing/TypingSession";
import { setLayout } from "@/lib/typing/layouts";
import { umschaltVorTilde, umschaltVorTildeText } from "@/lib/typing/totastenTexte";

afterEach(() => {
  cleanup();
  setLayout("de");
  ton.fehler.mockClear();
});

describe("umschaltVorTilde - erkennt genau „Trema statt Akut auf demselben Vokal\"", () => {
  it.each([
    ["á", "ä"], ["é", "ë"], ["í", "ï"], ["ó", "ö"], ["ú", "ü"], ["Á", "Ä"], ["É", "Ë"],
  ])("%s erwartet, %s entstanden ⇒ ja", (soll, ist) => {
    expect(umschaltVorTilde(soll, ist)).toBe(true);
  });

  it.each([
    ["á", "a"], ["á", "é"], ["ü", "ü"], ["á", "ë"], ["n", "ñ"], ["a", "ä"],
  ])("%s erwartet, %s entstanden ⇒ nein", (soll, ist) => {
    expect(umschaltVorTilde(soll, ist)).toBe(false);
  });

  it("der Hinweis steht in jeder Bedienungssprache und nennt keine fremde Taste", () => {
    expect(umschaltVorTildeText("es")).toMatch(/tilde.*sin Mayús/);
    expect(umschaltVorTildeText("de")).toMatch(/ohne Umschalttaste/);
    expect(umschaltVorTildeText("fr")).toMatch(/sans Maj/);
    expect(umschaltVorTildeText("en")).toMatch(/without Shift/);
  });
});

function sitzung(lernweg: "es" | "de") {
  const r = render(
    <TypingSession
      items={["más", "fin"]}
      contextId="test-w2a-tilde"
      unlocked={new Set([..."abcdefghijklmnñopqrstuvwxyz´ "])}
      shiftLearned={false}
      stufe={1 as never}
      voiceEnabled={false}
      lernweg={lernweg}
      onRetry={() => {}}
    />,
  );
  const feld = r.container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]');
  if (!feld) throw new Error("Übungsfeld nicht gefunden");
  return { feld, container: r.container };
}

async function druecke(feld: HTMLTextAreaElement, key: string, code?: string, shiftKey = false) {
  await act(async () => {
    fireEvent.keyDown(feld, { key, code, shiftKey });
  });
}

describe("TypingSession - der Hinweis kommt dazu, der Fehler bleibt einer", () => {
  it("Weg es: Umschalt + ´, dann a an der Stelle von „á\" ⇒ EIN Fehlerton, Hinweis sichtbar, danach geht „á\" normal", async () => {
    setLayout("es");
    const { feld, container } = sitzung("es");
    await druecke(feld, "m", "KeyM");
    await druecke(feld, "Shift", "ShiftLeft", true);
    await druecke(feld, "Dead", "Quote", true);
    await druecke(feld, "ä", "KeyA");
    expect(ton.fehler).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain(umschaltVorTildeText("de"));
    expect(feld.selectionStart).toBe(1); // steht weiter vor „á"
    await druecke(feld, "Dead", "Quote");
    await druecke(feld, "á", "KeyA");
    expect(feld.selectionStart).toBe(2);
    expect(ton.fehler).toHaveBeenCalledTimes(1);
  });

  it("Gegenprobe Weg es: ein anderer Fehlgriff („e\" statt „á\") bekommt keinen Tilde-Hinweis", async () => {
    setLayout("es");
    const { feld, container } = sitzung("es");
    await druecke(feld, "m", "KeyM");
    await druecke(feld, "e", "KeyE");
    expect(ton.fehler).toHaveBeenCalledTimes(1);
    expect(container.textContent).not.toContain(umschaltVorTildeText("de"));
  });

  it("Gegenprobe Weg de: dieselbe Folge ist ein Fehlgriff ohne Hinweis", async () => {
    setLayout("es");
    const { feld, container } = sitzung("de");
    await druecke(feld, "m", "KeyM");
    await druecke(feld, "Dead", "Quote", true);
    await druecke(feld, "ä", "KeyA");
    expect(ton.fehler).toHaveBeenCalledTimes(1);
    expect(container.textContent).not.toContain(umschaltVorTildeText("de"));
  });
});
