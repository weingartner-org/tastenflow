/**
 * ★★ WÄCHTER: Am Mac heißt die Alt-Taste auch im FLIESSTEXT „Wahl" (Johannes,
 * 18.10.2026: „passe mac an Wahl-taste an").
 *
 * Liste (Alt + T) und Hilfe-Tabelle schrieben am Mac schon „Wahl + O"
 * (`tastenflow-kuerzel-einheitlich.test.tsx`, (e)). Gemessen an diesem Tag
 * stand aber in jedem SATZ weiter „Alt": in der Hilfe „(Alt + O)" und
 * „(Alt + H, Alt + V …)", in der Hilfe für Lehrkräfte „(Zahnrad, Alt + O)" samt
 * ihren Tasten-Kästchen, in den Einstellungen „Alt und Plus, Alt und Minus" und
 * „(Alt + R)", in der Einrichtung „Neu starten: Alt + R." und gesprochen „Mit
 * Alt und R …", im Rundgang, in „Tasten erkunden" („Raus mit Alt + 3"), in den
 * Hinweisen zur Didaktik („Alt + B wechselt dorthin").
 *
 * Geprüft wird je Sprache der Bedienung (de en fr es it pl tr cs):
 *  (a) am Mac steht kein App-Kürzel mit „Alt" mehr - und das Wort der Sprache
 *      (`WAHLTASTE`: Wahl, Option, Opción, Opzione) steht da;
 *  (b) an Windows bleibt alles, wie es war („Alt + O");
 *  (c) LERNSTOFF bleibt: AltGr, „prawy Alt", „Ctrl and Alt" werden nie getauscht.
 *
 * Der Prüfer {@link appAlt} ist bewusst NICHT der Ausdruck aus `wahltaste.ts`:
 * Er nimmt die Lernstoff-Stellen ausdrücklich heraus und meldet jedes andere
 * „Alt" mit seiner Umgebung.
 *
 * Gegenprobe (18.10.2026): mit den Bauteilen vor der Behebung (`git checkout
 * HEAD --` für die 26 geänderten Dateien unter `components/typing/`) waren 42
 * von 60 rot - jedes (a) in allen acht Sprachen und beide Übungsseiten; (b) und
 * (c) blieben grün, wie sie sollen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { TippenHilfe } from "../src/components/typing/TippenHilfe";
import { LehrerHilfe } from "../src/components/typing/LehrerHilfe";
import { TypingSettings } from "../src/components/typing/TypingSettings";
import { TastenErkunden } from "../src/components/typing/TastenErkunden";
import { DidaktikInhalt } from "../src/components/typing/DidaktikHinweise";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { useRundgangWunsch } from "../src/lib/typing/rundgang";
import { WAHLTASTE, wahlText, wahlTexte } from "../src/lib/typing/wahltaste";
import type { BedienSprache } from "../src/lib/bedienSprache";

/* Die Sprache wird direkt gesetzt (it/pl/tr/cs sind hinter ihrem Schalter) -
   wie in `tastenflow-kuerzel-einheitlich.test.tsx`; `null` = der echte Anbieter. */
const bedien = vi.hoisted(() => ({ sprache: null as null | string }));
vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      if (bedien.sprache === null) return actual.useBedienSprache();
      return {
        sprache: bedien.sprache,
        spracheGewaehlt: bedien.sprache,
        setzeSprache: () => {},
        bereichAktiv: true,
        wechsle: () => {},
        beimSchalter: () => () => {},
        spracheOptionen: ["de", "en", "fr", "es", "it", "pl", "tr", "cs"],
      };
    },
  };
});

const stimme = vi.hoisted(() => ({ ui: vi.fn(), immer: vi.fn() }));
vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: stimme.ui,
  speakUiAlways: stimme.immer,
}));

const SPRACHEN: BedienSprache[] = ["de", "en", "fr", "es", "it", "pl", "tr", "cs"];

const plattformVorher = Object.getOwnPropertyDescriptor(Navigator.prototype, "platform");
function alsMac(mac: boolean) {
  Object.defineProperty(navigator, "platform", { configurable: true, get: () => (mac ? "MacIntel" : "Win32") });
}

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
  localStorage.clear();
  sessionStorage.clear();
  useTypingAuth.setState({ account: null });
  useRundgangWunsch.setState({ wunsch: null });
});

afterEach(() => {
  cleanup();
  bedien.sprache = null;
  stimme.ui.mockClear();
  stimme.immer.mockClear();
  delete (navigator as unknown as { platform?: string }).platform;
  if (plattformVorher) Object.defineProperty(Navigator.prototype, "platform", plattformVorher);
  localStorage.clear();
  useRundgangWunsch.setState({ wunsch: null });
  document.body.style.overflow = "";
});

/**
 * Jedes „Alt", das ein App-Kürzel ist. Herausgenommen ist der Lernstoff: die
 * Taste AltGr (AltGr, Alt Gr), die rechte Alt-Taste (prawy/pravý/sağ/right
 * Alt), „Ctrl/Strg + Alt" und „Ctrl and Alt" (Tasten, die das Kind kennenlernt),
 * Wörter wie „Altı" oder „Altersstufe", „Alt-Taste" / „Alt-Code".
 */
function appAlt(text: string): string[] {
  const ohneLernstoff = text
    .replace(/\bAlt ?-?Gr\b/g, "·")
    .replace(/\b(prawy|prawym|prawego|pravý|pravým|sağ|right|Right|rechte|rechten) Alt\b/gu, "·")
    .replace(/\b(Ctrl|Strg) (\+|and|und|et|y|e|i|ve|a) Alt\b/g, "·")
    .replace(/\bAlt-(Taste|Code|kod|kodu)/g, "·");
  const treffer: string[] = [];
  const re = /(?<![\p{L}\p{N}])Alt(?![\p{L}\p{N}])/gu;
  for (let m = re.exec(ohneLernstoff); m; m = re.exec(ohneLernstoff))
    treffer.push(ohneLernstoff.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, " "));
  return treffer;
}

const textVon = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ");

/** Die Hilfe in beiden Fassungen, die die Sätze tragen: Jugend (Belohnungs-Spiel) und Erwachsene. */
function hilfeText(): string {
  const teile: string[] = [];
  for (const stufe of ["teens", "erwachsen"] as const) {
    const { unmount } = render(<TippenHilfe open onClose={() => {}} stufe={stufe} />);
    teile.push(textVon(screen.getByRole("dialog")));
    unmount();
  }
  return teile.join(" ");
}

// ---------------------------------------------------------------------------
describe.each(SPRACHEN)("Bedienung %s", (sprache) => {
  const WAHL = WAHLTASTE[sprache];

  it("(a) Hilfe (Alt + H) am Mac: kein „Alt“ im Satz, das Wort der Sprache steht da", () => {
    alsMac(true);
    bedien.sprache = sprache;
    const text = hilfeText();
    expect(appAlt(text)).toEqual([]);
    expect(text).toContain(`(${WAHL} + O)`);
    expect(text).toContain(`${WAHL} + H, ${WAHL} + V`);
  });

  it("(b) Hilfe an Windows: unverändert „Alt + O“", () => {
    alsMac(false);
    bedien.sprache = sprache;
    const text = hilfeText();
    expect(text).toContain("(Alt + O)");
    expect(text).toContain("Alt + H, Alt + V");
    if (sprache !== "de") expect(text).not.toContain(`${WAHL} + O`);
  });

  it("(a) Hilfe für Lehrkräfte am Mac: Kästchen und Sätze mit dem Wort der Sprache", () => {
    alsMac(true);
    bedien.sprache = sprache;
    render(
      <MemoryRouter>
        <LehrerHilfe open onClose={() => {}} />
      </MemoryRouter>,
    );
    const text = textVon(screen.getByRole("dialog"));
    expect(appAlt(text)).toEqual([]);
    expect(text).toContain(`${WAHL} + O`);
    const kaestchen = [...screen.getByRole("dialog").querySelectorAll("kbd")].map((k) => k.textContent);
    expect(kaestchen).toContain(WAHL);
    expect(kaestchen).not.toContain("Alt");
  });

  it("(b) Hilfe für Lehrkräfte an Windows: „Alt“ wie bisher", () => {
    alsMac(false);
    bedien.sprache = sprache;
    render(
      <MemoryRouter>
        <LehrerHilfe open onClose={() => {}} />
      </MemoryRouter>,
    );
    const dialog = screen.getByRole("dialog");
    expect(textVon(dialog)).toContain("Alt + O");
    expect([...dialog.querySelectorAll("kbd")].map((k) => k.textContent)).toContain("Alt");
  });

  it("(a) Einstellungen (Alt + O) am Mac: „Wahl und Plus“, „(Wahl + R)“ - an Windows „Alt“", () => {
    const zeige = () =>
      render(
        <TypingSettings
          lernweg="de"
          mode="adaptiv"
          onModeChange={() => {}}
          stufe="teens"
          onStufeChange={() => {}}
          lang="de"
          onLangChange={() => {}}
          onEinrichtungNeu={() => {}}
        />,
      );
    bedien.sprache = sprache;
    alsMac(true);
    const { container, unmount } = zeige();
    const mac = textVon(container);
    expect(appAlt(mac)).toEqual([]);
    expect(mac).toContain(WAHL);
    unmount();
    alsMac(false);
    const win = textVon(zeige().container);
    expect(win).toMatch(/Alt (\+ [BR]|und|and|et|y|e|i|ve|a) /);
  });

  it("(a) Tasten erkunden (Alt + 3) am Mac: „Raus mit Wahl + 3“ - auf der Zeile und gesprochen", async () => {
    alsMac(true);
    bedien.sprache = sprache;
    render(<TastenErkunden open onClose={() => {}} />);
    const zeile = () => document.querySelector<HTMLTextAreaElement>("textarea[data-erkunden-zeile]")?.value ?? "";
    await waitFor(() => expect(zeile().length).toBeGreaterThan(10));
    expect(appAlt(zeile())).toEqual([]);
    expect(zeile()).toContain(`${WAHL} + 3`);
    expect(zeile()).toContain(`${WAHL} + 4`);
    const gesagt = [...stimme.ui.mock.calls, ...stimme.immer.mock.calls].map((c) => String(c[0])).join(" ");
    expect(appAlt(gesagt)).toEqual([]);
    // Die Hinweise an den Modus-Schaltern (Tipp) ebenso.
    expect(appAlt(textVon(document.body))).toEqual([]);
  });

  it("(a)/(c) Hinweise zur Didaktik am Mac: Alt + B wird Wahl + B - „Ctrl and Alt“ (Lernstoff) bleibt", () => {
    alsMac(true);
    const { container } = render(<DidaktikInhalt lang={sprache} />);
    const text = textVon(container);
    expect(appAlt(text)).toEqual([]);
    expect(text).toContain(`${WAHL} + B`);
    if (sprache === "en") expect(text).toContain("including Ctrl and Alt.");
  });
});

// ---------------------------------------------------------------------------
describe.each(["de", "en"] as BedienSprache[])("Übungsseite %s am Mac: Einrichtung, Ansage, Rundgang", (sprache) => {
  it("„Neu starten: Wahl + R.“, gesprochen „Wahl und R“, der Rundgang nennt „Wahl + H“", { timeout: 60_000 }, async () => {
    alsMac(true);
    bedien.sprache = sprache;
    const WAHL = WAHLTASTE[sprache];
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const einrichtung = await waitFor(
      () => {
        const el = document.getElementById("tippen-einrichtung-titel")?.closest("section");
        expect(el).toBeTruthy();
        return el!;
      },
      { timeout: 10_000 },
    );
    expect(textVon(einrichtung)).toContain(`${WAHL} + R.`);
    expect(appAlt(textVon(einrichtung))).toEqual([]);

    // Überspringen (Escape) - die Ansage sagt, wie es wieder geht.
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(document.getElementById("tippen-einrichtung-titel")).toBeNull());
    const gesagt = [...stimme.ui.mock.calls, ...stimme.immer.mock.calls].map((c) => String(c[0])).join(" ");
    expect(gesagt).toMatch(new RegExp(`${WAHL} (und|and) R`));
    expect(appAlt(gesagt)).toEqual([]);

    // Der Rundgang: jeder Schritt, angezeigt und im eigenen Live-Bereich.
    const region = await screen.findByRole("region", { name: sprache === "de" ? "Rundgang" : "Tour" }, { timeout: 10_000 });
    const saetze: string[] = [];
    for (let i = 0; i < 12; i++) {
      const text = textVon(region);
      saetze.push(text);
      await act(async () => {
        await new Promise((r) => setTimeout(r, 150));
      });
      saetze.push(document.querySelector("[data-rundgang-ansage]")?.textContent ?? "");
      const weiter = within(region).queryByRole("button", { name: sprache === "de" ? /Weiter/ : /Next/ });
      if (!weiter) break;
      fireEvent.click(weiter);
      await waitFor(() => expect(textVon(region)).not.toBe(text));
    }
    const alles = saetze.join(" ");
    expect(appAlt(alles)).toEqual([]);
    expect(alles).toContain(`${WAHL} + H`);
  });
});

// ---------------------------------------------------------------------------
describe("(c) Lernstoff und Windows: wahlText / wahlTexte", () => {
  it("tauscht nur App-Kürzel", () => {
    expect(wahlText("Mit Alt und R kannst du", "de", true)).toBe("Mit Wahl und R kannst du");
    expect(wahlText("(Alt + O)", "it", true)).toBe("(Opzione + O)");
    for (const lernstoff of [
      "AltGr + Q",
      "Alt Gr + ò",
      "prawy Alt + A",
      "pravý Alt",
      "sağ Alt",
      "the right Alt key",
      "Ctrl + Alt + N",
      "including Ctrl and Alt.",
      "Alt-Taste",
      "Alt-Code",
      "Altı ay oldu",
      "Altersstufe",
    ])
      expect(wahlText(lernstoff, "de", true), lernstoff).toBe(lernstoff);
  });

  it("an Windows dieselbe Tabelle (dasselbe Objekt), am Mac Funktionen und Listen mit", () => {
    const tabelle = { a: "Alt + R", f: (k: string) => [k, " Alt + X"], l: ["Alt + 3"] };
    expect(wahlTexte(tabelle, "de", false)).toBe(tabelle);
    const mac = wahlTexte(tabelle, "en", true);
    expect(mac.a).toBe("Option + R");
    expect(mac.f("Alt + B")).toEqual(["Option + B", " Option + X"]);
    expect(mac.l).toEqual(["Option + 3"]);
  });
});
