/**
 * ★★★ W2a (28.09.2026, SYNTHESE-UND-ENTSCHEIDUNGEN D-6): WEG „fr" - ZWEI
 * RICHTIGE SCHREIBWEISEN AN DERSELBEN STELLE.
 *
 *  · Punkt 1: Leerzeichen vor `; : ! ?` - mit UND ohne richtig (Frankreich mit,
 *    Québec/OQLF und Kanton Waadt ohne). Kanada-Texte ohne: ein getipptes
 *    Leerzeichen ist auch richtig. Die Zeile passt sich an.
 *  · Punkt 2: `"` für `« »` (und umgekehrt); das Leerzeichen innen an `« »`
 *    (und an geraden `"`) mit und ohne.
 *  · Gegenprobe: auf „de"/„en" bleibt ein Leerzeichen vor `!` ein Fehlgriff -
 *    in beiden Richtungen.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: vi.fn(), playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { useTypingItem } from "@/components/typing/useTypingItem";
import { TypingSession } from "@/components/typing/TypingSession";
import { FRANZ_EINGABE } from "@/lib/typing/eingabeVarianten";
import { setLayout } from "@/lib/typing/layouts";

afterEach(() => {
  cleanup();
  setLayout("de");
});

/** Tippt `folge` Zeichen für Zeichen gegen `zeile` - wie der Hook es tut, nur ohne React. */
function tippe(zeile: string, folge: string): { zeile: string; fehler: number; index: number } {
  let z = zeile;
  let i = 0;
  let fehler = 0;
  for (const c of folge) {
    if (i < z.length && (c === z[i] || FRANZ_EINGABE.gleichwertig(z[i], c))) {
      i++;
      continue;
    }
    const neu = FRANZ_EINGABE.anpassen(z, i, c);
    if (neu !== null && (c === neu[i] || FRANZ_EINGABE.gleichwertig(neu[i], c))) {
      z = neu;
      i++;
      continue;
    }
    fehler++;
  }
  return { zeile: z, fehler, index: i };
}

describe("D-6 Punkt 1 - Leerzeichen vor ; : ! ?", () => {
  it.each([
    ["Tu viens ?", "Tu viens?"],
    ["Attention ; il pleut.", "Attention; il pleut."],
    ["Voici la liste : pain, lait.", "Voici la liste: pain, lait."],
    ["Bravo !", "Bravo!"],
  ])("„%s\" darf ohne Leerzeichen getippt werden - die Zeile wird „%s\"", (text, getippt) => {
    expect(tippe(text, getippt)).toEqual({ zeile: getippt, fehler: 0, index: getippt.length });
    // … und mit Leerzeichen wie bisher.
    expect(tippe(text, text)).toEqual({ zeile: text, fehler: 0, index: text.length });
  });

  it("geschütztes und schmales geschütztes Leerzeichen: die Leertaste trifft, Weglassen auch", () => {
    for (const nb of [" ", " "]) {
      const text = `Tu viens${nb}?`;
      expect(tippe(text, "Tu viens ?").fehler).toBe(0);
      expect(tippe(text, "Tu viens?")).toEqual({ zeile: "Tu viens?", fehler: 0, index: 9 });
    }
  });

  it("Kanada-Text ohne Leerzeichen („Allo!\"): ein getipptes Leerzeichen ist auch richtig, die Zeile zeigt es", () => {
    expect(tippe("Allo! Ça va?", "Allo ! Ça va ?")).toEqual({ zeile: "Allo ! Ça va ?", fehler: 0, index: 14 });
    expect(tippe("Allo! Ça va?", "Allo! Ça va?").fehler).toBe(0);
  });

  it("KEINE Variante: „?!\", Uhrzeit „12:30\", Adresse „http://\", Leerzeichen am Zeilenanfang, doppeltes Leerzeichen", () => {
    expect(FRANZ_EINGABE.anpassen("Quoi ?!", 6, " ")).toBeNull(); // zwischen ? und !
    expect(FRANZ_EINGABE.anpassen("à 12:30", 4, " ")).toBeNull();
    expect(FRANZ_EINGABE.anpassen("http://a", 4, " ")).toBeNull();
    expect(FRANZ_EINGABE.anpassen("!", 0, " ")).toBeNull();
    expect(FRANZ_EINGABE.anpassen("mot ?", 4, " ")).toBeNull(); // das Leerzeichen ist schon getippt
    // Und ein Leerzeichen vor einem gewöhnlichen Buchstaben bleibt ein Fehler.
    expect(FRANZ_EINGABE.anpassen("motif", 3, " ")).toBeNull();
    expect(tippe("Tu viens ?", "Tu viens !").fehler).toBe(1);
  });
});

describe("D-6 Punkt 2 - \" für « », das Leerzeichen innen mit und ohne", () => {
  it("« mot » als « mot », «mot», \" mot \" und \"mot\" - jedes Mal ohne Fehler", () => {
    for (const getippt of ["« mot »", "«mot»", "\" mot \"", "\"mot\""]) {
      const r = tippe("Il a dit « mot ».", `Il a dit ${getippt}.`);
      expect(r.fehler, getippt).toBe(0);
      expect(r.index, getippt).toBe(r.zeile.length);
    }
  });

  it("die Anführungszeichen bleiben in der Zeile stehen - nur das Leerzeichen folgt dem Kind", () => {
    expect(tippe("« mot »", "\"mot\"").zeile).toBe("«mot»");
  });

  it("Ersatztext \"mot\" (AZERTY Frankreich): innen darf ein Leerzeichen getippt werden", () => {
    expect(tippe("Il a dit \"mot\".", "Il a dit \" mot \".")).toEqual({
      zeile: "Il a dit \" mot \".",
      fehler: 0,
      index: 17,
    });
  });

  it("umgekehrt: « oder » für ein gerades \" im Text", () => {
    expect(FRANZ_EINGABE.gleichwertig("\"", "«")).toBe(true);
    expect(FRANZ_EINGABE.gleichwertig("\"", "»")).toBe(true);
    expect(FRANZ_EINGABE.gleichwertig("«", "'")).toBe(false);
  });
});

/** Ein Tastendruck, wie `handleKey` ihn bekommt. */
function taste(key: string, code?: string): KeyboardEvent {
  return {
    key,
    code,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    getModifierState: () => false,
    preventDefault: () => {},
  } as unknown as KeyboardEvent;
}

describe("useTypingItem mit den Varianten", () => {
  it("das Weglassen passt die Zeile an, meldet sie VOR dem Treffer und schliesst die Zeile mit ihrer neuen Länge", () => {
    setLayout("fr");
    const reihenfolge: string[] = [];
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "a ?",
        active: true,
        onComplete,
        onCorrect: (ch) => reihenfolge.push(`treffer ${ch}`),
        onWrong: () => reihenfolge.push("fehler"),
        varianten: FRANZ_EINGABE,
        onZeileAngepasst: (z) => reihenfolge.push(`zeile ${z}`),
      }),
    );
    act(() => result.current.handleKey(taste("a", "KeyQ")));
    act(() => result.current.handleKey(taste("?", "KeyM")));
    expect(reihenfolge).toEqual(["treffer a", "zeile a?", "treffer ?"]);
    expect(result.current.zeile).toBe("a?");
    expect(onComplete).toHaveBeenCalledWith(0);
  });

  it("eine neue Zeile zeigt nie die alte Anpassung", () => {
    const { result, rerender } = renderHook(
      ({ expected, zeile }) =>
        useTypingItem({ expected, zeile, active: true, onComplete: vi.fn(), varianten: FRANZ_EINGABE }),
      { initialProps: { expected: "a ?", zeile: 0 } },
    );
    act(() => result.current.handleKey(taste("a")));
    act(() => result.current.handleKey(taste("?")));
    expect(result.current.zeile).toBe("a?");
    rerender({ expected: "a ?", zeile: 1 });
    expect(result.current.zeile).toBe("a ?");
    expect(result.current.index).toBe(0);
  });

  it("ohne `varianten` (Wege de/en/es) bleibt alles, wie es war", () => {
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "a ?", active: true, onComplete: vi.fn(), onWrong }),
    );
    act(() => result.current.handleKey(taste("a")));
    act(() => result.current.handleKey(taste("?")));
    expect(onWrong).toHaveBeenCalledWith(" ", "?", 1, false);
    expect(result.current.zeile).toBe("a ?");
  });
});

function sitzung(lernweg: "fr" | "de" | "en", zeile: string) {
  const r = render(
    <TypingSession
      items={[zeile, "fin"]}
      contextId="test-w2a-typo"
      unlocked={new Set([..."abcdefghijklmnopqrstuvwxyz?! "])}
      shiftLearned={false}
      stufe={1 as never}
      voiceEnabled={false}
      lernweg={lernweg}
      onRetry={() => {}}
    />,
  );
  const feld = r.container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]');
  if (!feld) throw new Error("Übungsfeld nicht gefunden");
  return feld;
}

async function tippeInsFeld(feld: HTMLTextAreaElement, text: string) {
  for (const c of text) {
    await act(async () => {
      fireEvent.keyDown(feld, { key: c, code: c === " " ? "Space" : undefined });
    });
  }
}

describe("TypingSession - die Anzeige folgt dem Kind (Weg fr) und bleibt streng (de/en)", () => {
  it("Weg fr: „oui !\" ohne Leerzeichen getippt - im Feld steht danach „oui!\", der Zeiger am Ende", async () => {
    setLayout("fr");
    const feld = sitzung("fr", "oui !");
    await tippeInsFeld(feld, "oui");
    expect(feld.value).toBe("oui !");
    await tippeInsFeld(feld, "!");
    // Die Zeile ist fertig; bis die nächste steht, zeigt das Feld die angepasste.
    expect(["oui!", "fin"]).toContain(feld.value);
    expect(feld.value).not.toBe("oui !");
  });

  it("Weg fr, Kanada-Text „oui!\": das getippte Leerzeichen erscheint im Feld", async () => {
    setLayout("ca-fr");
    const feld = sitzung("fr", "oui!");
    await tippeInsFeld(feld, "oui ");
    expect(feld.value).toBe("oui !");
    expect(feld.selectionStart).toBe(4);
  });

  it.each(["de", "en"] as const)("Gegenprobe Weg %s: Leerzeichen vor ! weglassen oder einfügen bleibt ein Fehlgriff", async (weg) => {
    const ohne = sitzung(weg, "hallo !");
    await tippeInsFeld(ohne, "hallo!");
    expect(ohne.value).toBe("hallo !");
    expect(ohne.selectionStart).toBe(5); // steht noch vor dem Leerzeichen
    cleanup();
    const mit = sitzung(weg, "hallo!");
    await tippeInsFeld(mit, "hallo ");
    expect(mit.value).toBe("hallo!");
    expect(mit.selectionStart).toBe(5);
  });
});
