/**
 * ★★★ WÄCHTER: DER TASTATUR-VORSCHLAG UNTERBRICHT NIE DAS TIPPEN (28.09.2026).
 *
 * Anlass: Der Plakat-Agent meldete (`BEFUND-2026-09-28-PLAKAT-ES.md` §3.3),
 * nach dem ersten Anschlag lege sich `TastaturVorschlag` über die Übung, der
 * Fokus wandere dorthin und jeder weitere Anschlag gehe ins Leere. Gemessen
 * am Live-Stand war es NICHT der Vorschlag, sondern das Merkfenster zur
 * falschen Umschalttaste („Un consejo" - Puppeteers „Shift" ist die LINKE,
 * das C gehört der linken Hand) - ein gewolltes Fenster (Johannes 31.08.).
 * Beleg und Gegenprobe: `BEFUND-2026-09-28-VORSCHLAG-FOKUS.md`.
 *
 * Die Frage, die der Fund aufwarf, bleibt trotzdem berechtigt, und dieser
 * Wächter hält ihre Antwort fest:
 *
 *  1. Erscheint der Streifen MITTEN in einer Zeile (Erkennung aus
 *     Tastendrücken), bleibt der Fokus im Übungsfeld - DASSELBE Element, nicht
 *     neu aufgebaut -, die Zeile bleibt stehen, und der nächste Anschlag
 *     zählt (Klick-Ton).
 *  2. Die Erkennung aus Tastendrücken läuft nur auf SICHER Windows - nicht am
 *     Mac, iPad, Chromebook, Linux, Android (dort ist die Regel ungemessen).
 *
 * WOHIN ER SICH BEWEGT, WENN ES SCHLECHTER WIRD: Wer dem Streifen einen
 * `autoFocus`/`focus()` beim Erscheinen gibt, ihn als Bedingung um die Übung
 * legt (Neuaufbau) oder den Horcher Tasten verschlucken lässt, wird bei (1)
 * rot; wer die Tastendruck-Erkennung wieder für alles ausser Mac öffnet, bei (2).
 *
 * ⚠️ TÖNE AUS - jsdom hat kein Web-Audio.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
  playKeySound: vi.fn(),
  playKeyTick: vi.fn(),
  playErrorSound: vi.fn(),
  playLineSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

// Feste Zeilen, damit „der nächste richtige Anschlag" bekannt ist (Bauart wie
// `tastenflow-anschlaege-zeilenwechsel`).
vi.mock("@/lib/typing/generator", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/generator")>();
  return {
    ...echt,
    adaptiveRound: vi.fn(() =>
      ["fjfj dkdk", "jfjf kdkd"].map((text) => ({ text, source: null, art: "woerter" })),
    ),
  };
});

import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { TastaturVorschlag } from "@/components/typing/TastaturVorschlag";
import { erkennungZuruecksetzen } from "@/components/typing/useTastaturErkennung";
import { tastenErkennungMoeglich } from "@/lib/typing/tastaturErkennung";
import { setLayout, setzeLayoutPlattform } from "@/lib/typing/layouts";
import { playErrorSound, playKeyTick } from "@/lib/typing/sound";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { ohneBildschirmTastatur, zeilenMarke } from "./_typing-probelauf";

const UA = {
  windowsChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
  windowsFirefox: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
  // gemessen 28.09.2026 im Plakat-Skript (`headless: "shell"` am Mac)
  macHeadless:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.22 Safari/537.36",
  ipad: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  chromebook:
    "Mozilla/5.0 (X11; CrOS x86_64 16002.51.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
  linuxFirefox: "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
  android:
    "Mozilla/5.0 (Linux; Android 14; SM-X200) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
};

const nav = navigator as Navigator & { keyboard?: unknown };
function setzeUA(ua: string) {
  Object.defineProperty(nav, "userAgent", { configurable: true, get: () => ua });
}
function uaZurueck() {
  delete (nav as { userAgent?: string }).userAgent;
}

/** Tasten einer US-Tastatur (Grundebene), die die Regel eindeutig macht. */
const US_TASTEN: Array<[code: string, key: string]> = [
  ["KeyA", "a"],
  ["KeyQ", "q"],
  ["KeyY", "y"],
  ["Semicolon", ";"],
  ["Backquote", "`"],
  ["Backslash", "\\"],
];

describe("2 · Tastendruck-Erkennung nur auf SICHER Windows", () => {
  it.each([
    ["Windows Chrome", UA.windowsChrome, true],
    ["Windows Firefox", UA.windowsFirefox, true],
    ["Mac, Headless-Chrome (Plakat-Skript)", UA.macHeadless, false],
    ["iPad (meldet sich als Macintosh)", UA.ipad, false],
    ["Chromebook", UA.chromebook, false],
    ["Linux Firefox", UA.linuxFirefox, false],
    ["Android-Tablet", UA.android, false],
  ])("%s", (_n, ua, erwartet) => {
    expect(tastenErkennungMoeglich(ua)).toBe(erwartet);
  });
  it("userAgentData hat Vorrang vor der Zeichenkette", () => {
    expect(tastenErkennungMoeglich(UA.windowsChrome, "Chrome OS")).toBe(false);
    expect(tastenErkennungMoeglich(UA.chromebook, "Windows")).toBe(true);
  });

  describe("am Bauteil: dieselben Tasten, zwei Plattformen", () => {
    beforeEach(() => {
      localStorage.clear();
      erkennungZuruecksetzen();
      setzeLayoutPlattform("windows"); // `layoutPlattform` sagt bei beiden „windows"
      setLayout("de");
    });
    afterEach(() => {
      cleanup();
      erkennungZuruecksetzen();
      setzeLayoutPlattform(null);
      setLayout("de");
      uaZurueck();
    });
    async function tippeUS() {
      for (const [code, key] of US_TASTEN) {
        await act(async () => {
          fireEvent.keyDown(document.body, { code, key });
        });
      }
    }
    it("Gegenprobe - Windows (Firefox, ohne getLayoutMap): der Streifen kommt", async () => {
      setzeUA(UA.windowsFirefox);
      render(<TastaturVorschlag lernweg="de" bereit />);
      await tippeUS();
      expect(screen.queryByTestId("tastatur-vorschlag")).not.toBeNull();
    });
    it("★ Chromebook, dieselben Tasten: nichts erkannt, kein Streifen", async () => {
      setzeUA(UA.chromebook);
      render(<TastaturVorschlag lernweg="de" bereit />);
      await tippeUS();
      expect(screen.queryByTestId("tastatur-vorschlag")).toBeNull();
    });
  });
});

describe("1 · ★★★ der Streifen erscheint MITTEN in der Zeile - das Tippen geht weiter", () => {
  beforeEach(() => {
    localStorage.clear();
    erkennungZuruecksetzen();
    setzeLayoutPlattform("windows");
    setzeUA(UA.windowsFirefox); // Firefox: kein getLayoutMap, Erkennung aus Tastendrücken
    setLayout("de");
    einrichtungFertigMerken();
    ohneBildschirmTastatur();
  });
  afterEach(() => {
    cleanup();
    erkennungZuruecksetzen();
    setzeLayoutPlattform(null);
    setLayout("de");
    uaZurueck();
    vi.mocked(playKeyTick).mockClear();
    vi.mocked(playErrorSound).mockClear();
  });

  it("Fokus bleibt im selben Übungsfeld, die Zeile bleibt, der nächste Anschlag zählt", async () => {
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const feld = (await screen.findByRole("textbox", undefined, { timeout: 10_000 })) as HTMLTextAreaElement;
    const zeile = feld.value;
    expect(zeile).toBe("fjfj dkdk");
    feld.focus();
    expect(document.activeElement).toBe(feld);
    expect(screen.queryByTestId("tastatur-vorschlag")).toBeNull();

    // Die ersten zwei Zeichen richtig - wir sind MITTEN in der Zeile.
    fireEvent.keyDown(feld, { key: "f", code: "KeyF" });
    fireEvent.keyDown(feld, { key: "j", code: "KeyJ" });
    const marke = zeilenMarke();

    // Jetzt Tasten einer US-Tastatur (für die Übung Fehlgriffe) - die
    // Erkennung aus Tastendrücken entscheidet „us" ≠ eingestellt „de".
    for (const [code, key] of US_TASTEN) {
      await act(async () => {
        fireEvent.keyDown(document.activeElement ?? feld, { code, key });
      });
    }
    expect(screen.queryByTestId("tastatur-vorschlag"), "der Streifen kam gar nicht - Probe misst nichts").not.toBeNull();

    // ★ Der Fokus ist nicht gewandert, das Feld nicht neu aufgebaut.
    expect(feld.isConnected, "das Übungsfeld wurde neu aufgebaut").toBe(true);
    expect(screen.getByRole("textbox"), "ein anderes Übungsfeld steht da").toBe(feld);
    expect(document.activeElement, "der Fokus ging aus dem Übungsfeld").toBe(feld);
    expect(zeilenMarke(), "die Zeile ist gewechselt oder zurückgesetzt").toBe(marke);
    expect(feld.value).toBe(zeile);

    // ★ Der nächste richtige Anschlag zählt: Klick-Ton, kein Fehlerton.
    vi.mocked(playKeyTick).mockClear();
    vi.mocked(playErrorSound).mockClear();
    await act(async () => {
      fireEvent.keyDown(document.activeElement ?? feld, { key: zeile[2], code: "KeyF" });
    });
    expect(vi.mocked(playKeyTick), "der Anschlag nach dem Streifen blieb ohne Antwort").toHaveBeenCalledTimes(1);
    expect(vi.mocked(playErrorSound)).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(feld);
  }, 30_000);
});
