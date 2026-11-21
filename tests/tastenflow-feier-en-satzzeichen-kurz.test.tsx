/**
 * ★ Englische Freischalt-Feier: Satzzeichen ohne Gattungswort (Johannes 28.09.2026)
 * ============================================================================
 * „the punctuation mark question mark" war keine Doppelung wie im Spanischen,
 * aber umständlich. Jetzt: „the question mark" - auf der Karte, auf der
 * Braillezeile und in der Sprachausgabe, auf jedem Weg. Die anderen Gattungen
 * (letter, digit, special character) behalten ihr Wort.
 */
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: "en",
      spracheGewaehlt: "en",
      setzeSprache: () => {},
      bereichAktiv: true,
      wechsle: () => {},
      beimSchalter: () => () => {},
    }),
  };
});

import { UnlockCelebration } from "../src/components/typing/UnlockCelebration";
import {
  unlockBrailleLabelEn,
  unlockInfoEn,
  unlockSpeech,
} from "../src/lib/typing/letters";

afterEach(cleanup);

describe("englische Feier: Satzzeichen", () => {
  it("Sprache, Braillezeile und Karten-Teile ohne „punctuation mark“", () => {
    expect(unlockSpeech("?", true, "en")).toMatch(/^Unlocked: the question mark\./);
    expect(unlockSpeech("?", false, "en")).toMatch(/^Congratulations! The question mark is unlocked\./);
    expect(unlockBrailleLabelEn("?")).toBe("New: question mark ?");
    const i = unlockInfoEn("?");
    expect(i.noun).toBe("");
    expect(i.name).toBe("question mark");
  });

  it("auf jedem Weg - auch ¿ auf Weg es", () => {
    for (const weg of [undefined, "de", "en", "fr", "es"] as const) {
      expect(unlockSpeech(",", true, "en", weg)).not.toMatch(/punctuation mark/);
    }
    expect(unlockSpeech("¿", true, "en", "es")).toMatch(/^Unlocked: the inverted question mark\./);
  });

  it("die Karte zeigt „the question mark“ ohne doppeltes Leerzeichen", () => {
    const { container } = render(
      <UnlockCelebration unit="?" skin="erwachsen" onClose={() => undefined} />,
    );
    const text = container.textContent ?? "";
    expect(text).toContain("the question mark");
    expect(text).not.toMatch(/punctuation mark/);
    expect(text).not.toMatch(/the {2}/);
  });

  it("Gegenprobe: Buchstaben, Ziffern und Sonderzeichen behalten ihr Gattungswort", () => {
    expect(unlockSpeech("r", true, "en")).toMatch(/^Unlocked: the letter R\./);
    expect(unlockSpeech("5", true, "en")).toMatch(/^Unlocked: the digit five\./);
    expect(unlockSpeech("@", true, "en")).toMatch(/^Unlocked: the special character at sign\./);
    expect(unlockBrailleLabelEn("@")).toBe("New special character at sign @");
  });
});
