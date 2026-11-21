/**
 * ★★★★★ F3-pl (02.10.2026): DIE EINGABE DER POLNISCHEN BUCHSTABEN - Windows (AltGr) und Mac (Option).
 *
 * R1 `recherche-polnisch-2026-10-02/tastaturen-und-zeichen.md` §4: Wie der Browser einen Anschlag meldet.
 *
 *  · Windows Chrome/Edge: AltGr + a ⇒ `ctrlKey` UND `altKey`, `AltGraph` an, `key` „ą", `code` `KeyA`.
 *  · Windows Firefox: AltGr + a ⇒ `ctrlKey` und `altKey` AUS, `AltGraph` an, `key` „ą".
 *  · Mac „Polish - Pro": Option + a ⇒ `altKey` OHNE Strg, `AltGraph` aus, `key` „ą" (Messung: das fertige
 *    Zeichen) - sieht aus wie das Alt-Kürzel der Seite (Alt + A, Alt + C, Alt + N, Alt + O, Alt + X …).
 *
 * Gelöst (`zeichenTaste.ts`, `istAltGrBuchstabe`): ein Anschlag, dessen `key` ein AltGr-Buchstabe der
 * EINGESTELLTEN Tastatur ist und dessen `code` die Taste seines Grundbuchstabens ist, ist ein ZEICHEN - und
 * löst kein Alt-Kürzel aus. Auf jeder anderen Tastatur ändert sich kein Anschlag.
 */
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TypingSession } from "../src/components/typing/TypingSession";
import { FreieSchreibzeile } from "../src/components/typing/FreieSchreibzeile";
import { anschlagAus, deuteAnschlag } from "../src/lib/typing/anschlagDeuten";
import { layoutById, setLayout, setzeLayoutPlattform } from "../src/lib/typing/layouts";
import { istAltGr, istKuerzel, istZeichenAnschlag, type TastenEreignis } from "../src/lib/typing/zeichenTaste";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: vi.fn(), playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

afterEach(() => {
  cleanup();
  setzeLayoutPlattform(null);
  setLayout("de");
});

const PL = layoutById("pl");

/** Ein Tastendruck mit allem, was der Browser meldet. */
function ereignis(
  key: string,
  code: string,
  mod: { alt?: boolean; ctrl?: boolean; shift?: boolean; meta?: boolean; altGraph?: boolean } = {},
): TastenEreignis & { code: string; shiftKey: boolean } {
  return {
    key, code, altKey: !!mod.alt, ctrlKey: !!mod.ctrl, metaKey: !!mod.meta, shiftKey: !!mod.shift,
    getModifierState: (t) => t === "AltGraph" && !!mod.altGraph,
  };
}

// Die vier Formen, in denen AltGr + a ankommt
const WINDOWS_CHROME = ereignis("ą", "KeyA", { alt: true, ctrl: true, altGraph: true });
const WINDOWS_CHROME_OHNE_ALTGRAPH = ereignis("ą", "KeyA", { alt: true, ctrl: true });
const WINDOWS_FIREFOX = ereignis("ą", "KeyA", { altGraph: true });
const MAC_OPTION = ereignis("ą", "KeyA", { alt: true });

describe("★ AltGr + Buchstabe ist ein ZEICHEN, kein Kürzel - in allen vier Ereignisformen", () => {
  it.each([
    ["Windows Chrome/Edge (Strg + Alt + AltGraph)", WINDOWS_CHROME],
    ["Windows Chrome/Edge ohne getModifierState (nur Strg + Alt)", WINDOWS_CHROME_OHNE_ALTGRAPH],
    ["Windows Firefox (nur AltGraph)", WINDOWS_FIREFOX],
    ["Mac Option (nur altKey)", MAC_OPTION],
  ])("%s: ą wird getippt, kein Alt-Kürzel", (_name, e) => {
    setLayout("pl");
    expect(istZeichenAnschlag(e)).toBe(true);
    expect(istKuerzel(e)).toBe(false);
  });

  it("★ die Grossformen genauso (mit Umschalt): Ą auf allen vier Wegen", () => {
    setLayout("pl");
    for (const [alt, ctrl, altGraph] of [[true, true, true], [true, true, false], [false, false, true], [true, false, false]]) {
      const e = ereignis("Ą", "KeyA", { alt, ctrl, altGraph, shift: true });
      expect(istZeichenAnschlag(e), `alt=${alt} ctrl=${ctrl} altGraph=${altGraph}`).toBe(true);
      expect(istKuerzel(e)).toBe(false);
    }
  });

  it("★ alle 18 Zeichen auf Mac (Option) und Windows (Strg + Alt): jedes ein Zeichen", () => {
    setLayout("pl");
    for (const [zeichen, zugang] of Object.entries(PL.access)) {
      if (!zugang.buchstabe) continue;
      const code = zugang.base === "x" ? "KeyX" : `Key${zugang.base.toUpperCase()}`;
      const mitShift = zugang.mitUmschalt === true;
      expect(istKuerzel(ereignis(zeichen, code, { alt: true, shift: mitShift })), `Mac: ${zeichen}`).toBe(false);
      expect(istKuerzel(ereignis(zeichen, code, { alt: true, ctrl: true, shift: mitShift })), `Windows: ${zeichen}`).toBe(false);
      expect(istAltGr(ereignis(zeichen, code, { alt: true, shift: mitShift })), `Mac: ${zeichen}`).toBe(true);
    }
  });

  it("Gegenproben: Alt + C (key „c\"), Strg + C, Befehl + A, Strg + Alt + Buchstabe bleiben Kürzel", () => {
    setLayout("pl");
    expect(istKuerzel(ereignis("c", "KeyC", { alt: true }))).toBe(true);
    expect(istKuerzel(ereignis("c", "KeyC", { ctrl: true }))).toBe(true);
    expect(istKuerzel(ereignis("ą", "KeyA", { meta: true }))).toBe(true);
    expect(istKuerzel(ereignis("h", "KeyH", { alt: true, ctrl: true }))).toBe(true);
    expect(istZeichenAnschlag(ereignis("c", "KeyC", { alt: true }))).toBe(false);
  });

  it("★ die Nebenwege der Mac-Messung (Option + K ⇒ Ż, Option + F ⇒ ń, Option + Umschalt + H ⇒ Ó) bleiben Alt-Kürzel", () => {
    setLayout("pl");
    expect(istKuerzel(ereignis("Ż", "KeyK", { alt: true }))).toBe(true);
    expect(istKuerzel(ereignis("ń", "KeyF", { alt: true }))).toBe(true);
    expect(istKuerzel(ereignis("Ó", "KeyH", { alt: true, shift: true }))).toBe(true);
    expect(istKuerzel(ereignis("Ń", "Digit1", { alt: true }))).toBe(true);
  });

  it("AltGr auf einer Taste mit LEERER AltGr-Ebene (AltGr + q): kein Zeichen - `key` ist die Grundbeschriftung", () => {
    setLayout("pl");
    const e = ereignis("q", "KeyQ", { alt: true, ctrl: true, altGraph: true });
    // Chrome/Edge melden die Grundbeschriftung - die Deutung erkennt die leere Ebene als Fehlgriff (Folge 4)
    expect(deuteAnschlag(anschlagAus(e), null, PL).deutung).toEqual({ art: "fehlgriff", eingabe: "" });
    expect(deuteAnschlag(anschlagAus(ereignis("w", "KeyW", { altGraph: true })), null, PL).deutung).toEqual({
      art: "fehlgriff",
      eingabe: "",
    });
  });

  it("★ die Deutung: jede der vier Formen ergibt das Zeichen ą (nie einen Fehlgriff)", () => {
    for (const e of [WINDOWS_CHROME, WINDOWS_CHROME_OHNE_ALTGRAPH, WINDOWS_FIREFOX, MAC_OPTION]) {
      expect(deuteAnschlag(anschlagAus(e), null, PL).deutung).toEqual({ art: "zeichen", zeichen: "ą" });
    }
  });

  it("★ Wächter: auf de, en, fr, es, it, ch ist jeder Anschlag wie vorher (Option + ą ist dort ein Kürzel)", () => {
    for (const id of ["de", "ch", "us", "uk", "fr", "es", "it", "ch-fr"] as const) {
      setLayout(id);
      expect(istKuerzel(MAC_OPTION), id).toBe(true);
      expect(istZeichenAnschlag(MAC_OPTION), id).toBe(false);
      // und die bekannten Fälle bleiben Zeichen bzw. Kürzel
      expect(istKuerzel(ereignis("@", "KeyQ", { alt: true, ctrl: true })), id).toBe(false);
      expect(istKuerzel(ereignis("w", "KeyW", { alt: true })), id).toBe(true);
    }
  });
});

// ── Die Übungszeile (TypingSession) ──────────────────────────────────────────────────────────────────────

function sitzung(item: string, unlocked: string[]) {
  const onItemDone = vi.fn();
  const { container } = render(
    <TypingSession
      items={[item, "ab"]}
      contextId="pl-eingabe"
      unlocked={new Set(unlocked)}
      shiftLearned
      stufe="teens"
      voiceEnabled={false}
      onItemDone={onItemDone}
      onSessionDone={() => {}}
      onRetry={() => {}}
      lang="de"
    />,
  );
  const feld = container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
  const druecke = async (
    key: string,
    code: string,
    m: { altKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; modifierAltGraph?: boolean } = {},
  ) => {
    await act(async () => {
      fireEvent.keyDown(feld, { key, code, ...m });
    });
  };
  const warteBisFertig = async () => {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 900));
    });
  };
  return { feld, onItemDone, druecke, warteBisFertig };
}

describe("★★★★★ strenge Zeile (TypingSession) auf `pl`: die polnischen Buchstaben zählen auf jedem Weg", () => {
  const BUCHSTABEN = ["a", "m", "j", "ą", "ć", "ę", "ł", "ń", "ó", "ś", "ź", "ż"];

  it("★ „mają\" mit Option am Mac: der vierte Anschlag ist ein Zeichen - Zeile fertig, kein Fehler", async () => {
    setLayout("pl");
    const { onItemDone, druecke, warteBisFertig } = sitzung("mają", BUCHSTABEN);
    await druecke("m", "KeyM");
    await druecke("a", "KeyA");
    await druecke("j", "KeyJ");
    await druecke("ą", "KeyA", { altKey: true });
    await warteBisFertig();
    expect(onItemDone).toHaveBeenCalledTimes(1);
    expect(onItemDone.mock.calls[0][0]).toMatchObject({ chars: 4, errors: 0 });
  });

  it("★ alle vier Ereignisformen in einer Zeile „ąąąą\": Windows Chrome, Windows Chrome ohne AltGraph, Firefox, Mac", async () => {
    setLayout("pl");
    const { onItemDone, druecke, warteBisFertig } = sitzung("ąąąą", BUCHSTABEN);
    await druecke("ą", "KeyA", { altKey: true, ctrlKey: true, modifierAltGraph: true });
    await druecke("ą", "KeyA", { altKey: true, ctrlKey: true });
    await druecke("ą", "KeyA", { modifierAltGraph: true });
    await druecke("ą", "KeyA", { altKey: true });
    await warteBisFertig();
    expect(onItemDone).toHaveBeenCalledTimes(1);
    expect(onItemDone.mock.calls[0][0]).toMatchObject({ chars: 4, errors: 0 });
  });

  it("★ „Łódź\" (alle Grossform-Anschläge mit Umschalt): Mac Option + Umschalt + L, Option + O, d, Option + X", async () => {
    setLayout("pl");
    const { onItemDone, druecke, warteBisFertig } = sitzung("Łódź", [...BUCHSTABEN, "d", "l"]);
    // Die Gegenhand-Regel (17.10.2026 wieder streng): die Umschalttaste wird
    // wirklich gehalten - L liegt rechts, also die LINKE Umschalttaste.
    await druecke("Shift", "ShiftLeft", { shiftKey: true });
    await druecke("Ł", "KeyL", { altKey: true, shiftKey: true });
    await druecke("ó", "KeyO", { altKey: true });
    await druecke("d", "KeyD");
    await druecke("ź", "KeyX", { altKey: true });
    await warteBisFertig();
    expect(onItemDone).toHaveBeenCalledTimes(1);
    expect(onItemDone.mock.calls[0][0]).toMatchObject({ chars: 4, errors: 0 });
  });

  it("ein ANDERES Zeichen mit Option (Alt + C ⇒ key „c\" statt „ć\") ist weiter ein Kürzel - kein Fehler, nichts getippt", async () => {
    setLayout("pl");
    const { onItemDone, druecke, warteBisFertig } = sitzung("ć", BUCHSTABEN);
    await druecke("c", "KeyC", { altKey: true }); // Kürzel: zählt nicht
    await druecke("ć", "KeyC", { altKey: true });
    await warteBisFertig();
    expect(onItemDone.mock.calls[0][0]).toMatchObject({ chars: 1, errors: 0 });
  });

  it("★ Fehlgriff: a statt ą ist ein Fehler (ein ANDERES Wort wäre „maja\" statt „mają\" - die Zeile zählt Zeichen)", async () => {
    setLayout("pl");
    const { onItemDone, druecke, warteBisFertig } = sitzung("mają", BUCHSTABEN);
    await druecke("m", "KeyM");
    await druecke("a", "KeyA");
    await druecke("j", "KeyJ");
    await druecke("a", "KeyA"); // Fehler: das ą braucht AltGr/Option
    await druecke("ą", "KeyA", { altKey: true });
    await warteBisFertig();
    expect(onItemDone.mock.calls[0][0]).toMatchObject({ chars: 4, errors: 1 });
  });
});

describe("★★★★★ die Alt-Kürzel der Seite hören NICHT mit, wenn Option + Buchstabe ein Zeichen ist", () => {
  /** Der Tastendruck erreicht das Fenster (dort sitzen die Seiten-Kürzel: Alt + C Weiter, Alt + N, Alt + O, Alt + X …). */
  function fensterHoerer() {
    const gesehen = vi.fn();
    window.addEventListener("keydown", gesehen);
    return { gesehen, ab: () => window.removeEventListener("keydown", gesehen) };
  }

  it("★ Option + C (key „ć\") im Übungsfeld erreicht das Fenster NICHT - Alt + C „Weiter\" löst nicht aus", async () => {
    setLayout("pl");
    const { gesehen, ab } = fensterHoerer();
    try {
      const { druecke } = sitzung("ć", ["ć", "c"]);
      await druecke("ć", "KeyC", { altKey: true });
      expect(gesehen).not.toHaveBeenCalled();
    } finally {
      ab();
    }
  });

  it("alle vier Tasten, die die Seite als Alt-Kürzel belegt (A, C, N, O) und X (Restzeit): als Zeichen unsichtbar für das Fenster", async () => {
    setLayout("pl");
    const { gesehen, ab } = fensterHoerer();
    try {
      const { druecke } = sitzung("ąćńóź", ["ą", "ć", "ń", "ó", "ź"]);
      for (const [z, code] of [["ą", "KeyA"], ["ć", "KeyC"], ["ń", "KeyN"], ["ó", "KeyO"], ["ź", "KeyX"]] as const) {
        await druecke(z, code, { altKey: true });
      }
      expect(gesehen).not.toHaveBeenCalled();
    } finally {
      ab();
    }
  });

  it("★ Gegenprobe: ein echtes Alt-Kürzel (Alt + C mit key „c\") erreicht das Fenster weiter", async () => {
    setLayout("pl");
    const { gesehen, ab } = fensterHoerer();
    try {
      const { druecke } = sitzung("ć", ["ć", "c"]);
      await druecke("c", "KeyC", { altKey: true });
      expect(gesehen).toHaveBeenCalledTimes(1);
    } finally {
      ab();
    }
  });

  it("★ Gegenprobe: auf `us` (kein AltGr-Buchstabe) erreicht auch ein Anschlag mit key „ą\" das Fenster - unverändert", async () => {
    setLayout("us");
    const { gesehen, ab } = fensterHoerer();
    try {
      const { druecke } = sitzung("a", ["a"]);
      await druecke("ą", "KeyA", { altKey: true });
      expect(gesehen).toHaveBeenCalledTimes(1);
    } finally {
      ab();
    }
  });

  it("★ Gegenprobe: auf `pl` bleibt Option + K (key „Ż\", nicht die Taste des Buchstabens) ein Kürzel - das Fenster sieht es", async () => {
    setLayout("pl");
    const { gesehen, ab } = fensterHoerer();
    try {
      const { druecke } = sitzung("a", ["a", "ż"]);
      await druecke("Ż", "KeyK", { altKey: true });
      expect(gesehen).toHaveBeenCalledTimes(1);
    } finally {
      ab();
    }
  });
});

describe("★ freie Zeile (FreieSchreibzeile): Option + Buchstabe landet im Getippten", () => {
  it("„mają łoś\" mit Option steht in der Ist-Zeile, ein Alt-Kürzel (Alt + W) nicht", async () => {
    setLayout("pl");
    const onZeileFertig = vi.fn();
    const { container } = render(
      <FreieSchreibzeile
        {...({
          items: ["mają łoś", "zwei"],
          contextId: "pl-frei",
          stufe: "teens",
          voiceEnabled: false,
          zeilenEnde: true,
          onZeileFertig,
          onSessionDone: () => {},
          lang: "de",
        } as unknown as Parameters<typeof FreieSchreibzeile>[0])}
      />,
    );
    const feld = container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
    const folge: [string, string, Record<string, boolean>][] = [
      ["m", "KeyM", {}], ["a", "KeyA", {}], ["j", "KeyJ", {}], ["w", "KeyW", { altKey: true }],
      ["ą", "KeyA", { altKey: true }], [" ", "Space", {}], ["ł", "KeyL", { altKey: true }],
      ["o", "KeyO", {}], ["ś", "KeyS", { altKey: true }], ["Enter", "Enter", {}],
    ];
    for (const [key, code, m] of folge) {
      await act(async () => {
        fireEvent.keyDown(feld, { key, code, ...m });
      });
    }
    expect(onZeileFertig).toHaveBeenCalledTimes(1);
    expect(onZeileFertig.mock.calls[0][0].ist).toBe("mają łoś");
  });
});
