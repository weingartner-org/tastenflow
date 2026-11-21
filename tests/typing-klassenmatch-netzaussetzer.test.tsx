/**
 * ★★★★★ WÄCHTER: EIN NETZAUSSETZER MITTEN IM KLASSENMATCH (11.09.2026 spät).
 *
 * ── Der Befund ──────────────────────────────────────────────────────────────
 * `useKlassenBeobachtung` ist so gebaut, dass eine gescheiterte Nachfrage den
 * bisherigen Stand STEHEN lässt (siehe dessen Dateikopf: „Ein Netzaussetzer
 * mitten im Match darf das Ranking nicht leeren"). Das greift aber nur, wenn
 * die Nachfrage auch wirklich SCHEITERT. `pbBackend.listeMatches` und
 * `listeMatchStaende` fingen den Fehler selbst ab und antworteten mit `[]` -
 * der Haken übernahm also eine leere Liste. Im Schul-WLAN heisst das: Ein Kind
 * verliert mitten im Schreiben sein Match, `KlassenmatchLauf` hängt aus, das
 * Tippfeld ist weg, und wenn das Netz zurückkommt, beginnen die Zähler bei null.
 *
 * ── Was hier geprüft wird ───────────────────────────────────────────────────
 *  (a) `pbBackend` wirft bei einem Netzfehler, statt eine leere Liste zu melden.
 *  (b) Der Haken hält mitten im Lauf Match, Phase und Stände.
 *  (c) Auf der Seite bleibt der Lauf im Baum - dasselbe Tippfeld -, und was bis
 *      dahin geschrieben wurde, geht beim Verlassen mit.
 *
 * Der Netzfehler läuft in (b) und (c) durch den ECHTEN Code von `pbBackend`
 * (mit einem PocketBase-Ersatz ohne Netz) - nicht durch einen Ersatz, der
 * `[]` oder einen Fehler von sich aus liefert. Sonst prüfte der Wächter seine
 * eigene Annahme statt des Programms.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { useEffect, useRef } from "react";

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

import { KlassenmatchLauf } from "@/components/typing/KlassenmatchLauf";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { PocketBaseTypingBackend } from "@/lib/typing/pbBackend";
import {
  _mockMatchesZuruecksetzen,
  mockListeStaende,
  stoppBots,
} from "@/lib/typing/matchMock";
import {
  MATCH_COUNTDOWN_MS,
  MATCH_DAUER_MS,
  MATCH_NACHFRAGE_MS,
  type Match,
} from "@/lib/typing/klassenmatch";
import { emptyProgress } from "@/lib/typing/progress";
import { useKlassenmatch } from "@/lib/typing/useKlassenmatch";
import type { TypingAccount } from "@/lib/typing/account";

function kind(id: string, name: string): TypingAccount {
  return { id, role: "schueler", name, classCode: "K1", createdAt: 1 };
}
const SARAH = kind("sarah", "Sarah");
const FRANZ = kind("franz", "Franz");

/** Der Speicherort der Matches im Mock (`matchMock.ts`, SCHLUESSEL_MATCHES). */
const MATCHES_SCHLUESSEL = "tastenflow:klassenmatch:matches";

/** Ein PocketBase-Ersatz, dessen Netz weg ist - wie `fetch` im Browser. */
function pbOhneNetz() {
  return {
    filter: (s: string) => s,
    collection() {
      return {
        async getFullList() {
          throw new TypeError("Failed to fetch");
        },
      };
    },
  };
}

/** Das echte `PocketBaseTypingBackend`, nur mit dem Ersatz statt des Servers. */
function backendOhneNetz(): PocketBaseTypingBackend {
  const b = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
  (b as unknown as { pb: unknown }).pb = pbOhneNetz();
  return b;
}

/**
 * Das Gerät verliert das Netz: Die beiden Nachfragen des Hakens laufen ab jetzt
 * durch den Code von `pbBackend`. Gibt „Netz wieder da" zurück.
 */
function netzWeg(): () => void {
  const pb = backendOhneNetz();
  const matches = vi
    .spyOn(typingBackend(), "listeMatches")
    .mockImplementation((code) => pb.listeMatches(code));
  const staende = vi
    .spyOn(typingBackend(), "listeMatchStaende")
    .mockImplementation((id) => pb.listeMatchStaende(id));
  return () => {
    matches.mockRestore();
    staende.mockRestore();
  };
}

async function warte(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  localStorage.clear();
  _mockMatchesZuruecksetzen();
  _resetTypingBackend();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  _mockMatchesZuruecksetzen();
  localStorage.clear();
});

describe("(a) pbBackend: ein Netzfehler ist ein Fehler, keine leere Liste", () => {
  it("★★★★ listeMatches wirft", async () => {
    await expect(backendOhneNetz().listeMatches("K1")).rejects.toThrow("Failed to fetch");
  });

  it("★★★★ listeMatchStaende wirft", async () => {
    await expect(backendOhneNetz().listeMatchStaende("m1")).rejects.toThrow("Failed to fetch");
  });
});

describe("(b) Der Haken hält seinen Stand, wenn eine Nachfrage scheitert", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("★★★★★ mitten im Lauf bleiben das Match, die Phase und die Stände", async () => {
    const { result } = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);
    await act(async () => {
      result.current.einladen();
    });
    await warte(3000); // Mia und Ben treten bei
    await act(async () => {
      result.current.starten();
    });
    await warte(MATCH_COUNTDOWN_MS + 20_000);
    expect(result.current.phase).toBe("laeuft");
    const matchId = result.current.meinMatch!.id;
    expect(result.current.staende.map((s) => s.name)).toEqual(expect.arrayContaining(["Mia", "Ben"]));

    // Mia und Ben schreiben ab jetzt nicht mehr - sonst reichte ihr nächster
    // Stand die Zeilen über das Abo nach, und der Verlust bliebe unsichtbar.
    stoppBots(matchId);
    const netzZurueck = netzWeg();
    // Beide Takte (Matches 45 s, Stände 15 s) fragen mindestens einmal nach.
    await warte(MATCH_NACHFRAGE_MS + 500);
    try {
      expect(typingBackend().listeMatches).toHaveBeenCalled();
      expect(result.current.meinMatch?.id, "das Match ist weg").toBe(matchId);
      expect(result.current.phase).toBe("laeuft");
      expect(result.current.staende.map((s) => s.name), "das Ranking ist leer").toEqual(
        expect.arrayContaining(["Mia", "Ben"]),
      );
    } finally {
      netzZurueck();
    }
  });
});

// ── (c) Auf der Seite ───────────────────────────────────────────────────────

const ladeLeer = async () => emptyProgress();
const speichere = () => {};
const merke = () => {};

/**
 * Die Seite im Kleinen: dieselbe Bedingung wie `TippenTrainerPage`
 * (`matchDran` und nicht mehr in der Einladung), derselbe Haken, dieselben
 * Rückrufe. Das Kind ist dem laufenden Match beigetreten.
 */
function Seite({ matchId }: { matchId: string }) {
  const m = useKlassenmatch(FRANZ);
  const beigetreten = useRef(false);
  useEffect(() => {
    if (beigetreten.current) return;
    beigetreten.current = true;
    m.beitreten(matchId);
  });
  if (!m.meinMatch || m.phase === "keine" || m.phase === "einladung") {
    return <p>Üben</p>;
  }
  return (
    <KlassenmatchLauf
      match={m.meinMatch}
      staende={m.staende}
      account={FRANZ}
      stufe="kids"
      lang="de"
      loadFn={ladeLeer}
      saveFn={speichere}
      onTask={merke}
      onStand={m.standMelden}
      onFertig={m.fertigMelden}
      onWeiter={m.verlassen}
      onVerlassen={m.mittendrinVerlassen}
    />
  );
}

describe("(c) ★★★★★ Der Lauf bleibt im Baum, und die Zahlen bleiben", () => {
  it("ein Netzaussetzer mitten im Schreiben nimmt dem Kind weder das Feld noch seine Anschläge", async () => {
    const start = Date.now() - 60_000;
    const laufend: Match = {
      id: "m-lauf",
      classCode: "K1",
      hostUid: "sarah",
      hostName: "Sarah",
      status: "countdown",
      startMs: start,
      endeMs: start + MATCH_DAUER_MS,
      dauerMin: 5,
      createdMs: start - 30_000,
    };
    localStorage.setItem(MATCHES_SCHLUESSEL, JSON.stringify([laufend]));
    render(<Seite matchId={laufend.id} />);
    const feld = await screen.findByRole("textbox", undefined, { timeout: 8000 });
    for (const taste of ["f", "j", "f", "d", "k"]) fireEvent.keyDown(feld, { key: taste });

    const netzZurueck = netzWeg();
    try {
      // Die Sofort-Nachfrage, wenn das Fenster den Fokus bekommt - frühestens
      // zehn Sekunden nach der letzten (`SOFORT_MIN_MS`).
      vi.setSystemTime(Date.now() + 11_000);
      window.dispatchEvent(new Event("focus"));
      await act(async () => {
        await new Promise((r) => setTimeout(r, 1300));
      });
      expect(typingBackend().listeMatches).toHaveBeenCalled();
      expect(screen.queryByRole("textbox"), "das Tippfeld ist aus dem Baum gefallen").toBe(feld);
    } finally {
      netzZurueck();
      vi.useRealTimers();
    }

    // Die Zahlen: „Verlassen" schreibt, was bis hierhin geschrieben wurde.
    fireEvent.click(screen.getByRole("button", { name: "Verlassen" }));
    const dialog = await screen.findByRole("dialog", { name: "Klassenmatch verlassen?" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Verlassen" }));
    await waitFor(() => {
      const zeile = mockListeStaende(laufend.id).find((s) => s.pupilUid === "franz");
      expect(zeile?.status).toBe("fertig");
      expect((zeile?.zeichen ?? 0) + (zeile?.fehler ?? 0)).toBeGreaterThan(0);
    });
  }, 20_000);
});
