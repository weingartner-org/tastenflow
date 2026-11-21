/**
 * WÄCHTER über den ABLAUF des Klassenmatchs - vom Einladen bis zum Ende
 * (11.09.2026, Etappe E6).
 *
 * ── Was hier geprüft wird, und warum es kein Modell-Test kann ───────────────
 * `typing-klassenmatch-modell.test.ts` prüft die Rechnungen. Hier läuft der
 * ganze Weg über das **Mock-Backend samt den zwei Mitspielern Mia und Ben**:
 * einladen → sie treten bei → „Starten" → Countdown → Lauf → fertig. Genau
 * dieses Zusammenspiel ist die Stelle, an der ein Klassenmatch scheitern kann,
 * ohne dass eine einzige Zahl falsch wäre - der Knopf „Starten" geht nicht auf,
 * die Einladung kommt zweimal, oder das Match endet bei zwei Kindern zu
 * verschiedenen Zeiten.
 *
 * Und es prüft zugleich die Mitspieler selbst: Sie sind die Bedingung dafür,
 * dass dieser Weg im Browser überhaupt jemals abgenommen wird
 * (`matchMock.ts`).
 *
 * ⚠️ Die Uhren sind gestellt (`vi.useFakeTimers`). Die Zeiten des Matches
 * kommen aus `Date.now()`, das vitest mitstellt - sonst dauerte dieser Test
 * fünf Minuten und zehn Sekunden.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import {
  _mockMatchesZuruecksetzen,
  mockListeMatches,
  mockListeStaende,
} from "@/lib/typing/matchMock";
import { MATCH_COUNTDOWN_MS, MATCH_DAUER_MS } from "@/lib/typing/klassenmatch";
import { useKlassenmatch } from "@/lib/typing/useKlassenmatch";
import type { TypingAccount } from "@/lib/typing/account";

const SARAH: TypingAccount = {
  id: "sarah",
  role: "schueler",
  name: "Sarah",
  classCode: "K1",
  createdAt: 1,
};
const FRANZ: TypingAccount = {
  id: "franz",
  role: "schueler",
  name: "Franz",
  classCode: "K1",
  createdAt: 1,
};

/** Uhren vorstellen UND alle offenen Versprechen einlösen. */
async function warte(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  localStorage.clear();
  _mockMatchesZuruecksetzen();
  _resetTypingBackend();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  _mockMatchesZuruecksetzen();
  localStorage.clear();
});

describe("Der ganze Weg: einladen, Bots treten bei, starten, laufen, fertig", () => {
  it("★ führt von der Einladung bis zur Platzierungsliste", async () => {
    expect(typingBackend().kind).toBe("local");
    const { result } = renderHook(() => useKlassenmatch(SARAH));

    // --- 1) Der Schalter steht da ------------------------------------------
    await warte(50);
    expect(result.current.erlaubt).toBe(true);
    expect(result.current.meinMatch).toBeNull();

    // --- 2) Einladen --------------------------------------------------------
    await act(async () => {
      result.current.einladen();
    });
    await warte(50);
    expect(result.current.meinMatch).not.toBeNull();
    expect(result.current.binGastgeber).toBe(true);
    expect(result.current.phase).toBe("einladung");
    // ⚠️ Solange niemand da ist, geht „Starten" NICHT (F4).
    expect(result.current.kannStarten).toBe(false);

    // --- 3) Mia und Ben treten bei -----------------------------------------
    await warte(3000);
    const namen = result.current.staende.map((s) => s.name).sort();
    expect(namen).toContain("Mia");
    expect(namen).toContain("Ben");
    expect(result.current.kannStarten).toBe(true);

    // --- 4) Starten ⇒ Countdown --------------------------------------------
    await act(async () => {
      result.current.starten();
    });
    await warte(100);
    expect(result.current.phase).toBe("countdown");
    // ★ Die Zeiten kommen vom „Server" (hier: dem Mock), nicht vom Gerät.
    expect(result.current.meinMatch?.startMs).toBeGreaterThan(Date.now());

    // --- 5) Nach zehn Sekunden läuft es ------------------------------------
    await warte(MATCH_COUNTDOWN_MS + 500);
    expect(result.current.phase).toBe("laeuft");

    // --- 6) Die Bots schreiben ---------------------------------------------
    await warte(30_000);
    const mia = result.current.staende.find((s) => s.name === "Mia");
    expect(mia).toBeTruthy();
    expect(mia!.zeichen).toBeGreaterThan(0);
    expect(mia!.status).toBe("schreibt");

    // --- 7) Nach fünf Minuten ist Schluss - bei allen zugleich -------------
    await warte(MATCH_DAUER_MS);
    expect(result.current.phase).toBe("fertig");
    const nachher = result.current.staende.filter((s) => s.name === "Mia" || s.name === "Ben");
    expect(nachher.length).toBe(2);
    for (const s of nachher) expect(s.status).toBe("fertig");
  });

  it("gibt das Match mit „Absagen“ wieder frei", async () => {
    const { result } = renderHook(() => useKlassenmatch(SARAH));
    await warte(50);
    await act(async () => {
      result.current.einladen();
    });
    await warte(50);
    expect(result.current.meinMatch).not.toBeNull();
    await act(async () => {
      result.current.absagen();
    });
    await warte(50);
    expect(result.current.meinMatch).toBeNull();
    // Und der Schalter steht wieder da - ein abgesagtes Match bindet niemanden.
    expect(result.current.erlaubt).toBe(true);
  });
});

describe("Die Einladung bei den anderen (F2, F9)", () => {
  it("★ erreicht ein anderes Kind derselben Klasse", async () => {
    const gast = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(50);
    expect(franz.result.current.einladung).toBeNull();

    await act(async () => {
      gast.result.current.einladen();
    });
    // ★ „in etwa einer Sekunde": Realtime meldet im Mock sofort, der Takt
    // wäre spätestens nach `MATCH_NACHFRAGE_MS` da.
    await warte(1000);
    expect(franz.result.current.einladung?.hostName).toBe("Sarah");
  });

  it("★★ kommt nach „Jetzt nicht“ NICHT wieder - eine andere schon", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(50);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1000);
    const ersteId = franz.result.current.einladung!.id;

    await act(async () => {
      franz.result.current.ablehnen(ersteId);
    });
    await warte(1000);
    expect(franz.result.current.einladung).toBeNull();

    // Ein ZWEITES Match (Sarah sagt ab und lädt neu ein) kommt durch.
    await act(async () => {
      sarah.result.current.absagen();
    });
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1000);
    expect(franz.result.current.einladung).not.toBeNull();
    expect(franz.result.current.einladung!.id).not.toBe(ersteId);
  });

  it("★ erreicht NICHT, wer selbst gerade in einem Match steckt (F9)", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(50);
    // Franz schreibt sein eigenes Match aus …
    await act(async () => {
      franz.result.current.einladen();
    });
    // … Mia und Ben treten bei, und Franz startet. ⚠️ Das Starten gehört seit
    // 11.09.2026 abends dazu (Johannes: ein zweites Match „erst … wenn das
    // erste match schon läuft, vorher nicht" - `typing-klassenmatch-gleichzeitig`
    // (b)).
    await warte(3000);
    await act(async () => {
      franz.result.current.starten();
    });
    await warte(100);
    // … und Sarah schreibt ein zweites aus (erlaubt: sie ist in keinem).
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1000);
    expect(sarah.result.current.binGastgeber).toBe(true);
    // Franz bekommt Sarahs Einladung NICHT - er ist gebunden.
    expect(franz.result.current.einladung).toBeNull();
    expect(franz.result.current.binGastgeber).toBe(true);
  });

  it("bringt „Bin dabei“ in dasselbe Match", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(50);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1000);
    const id = franz.result.current.einladung!.id;
    await act(async () => {
      franz.result.current.beitreten(id);
    });
    await warte(500);
    expect(franz.result.current.meinMatch?.id).toBe(id);
    expect(franz.result.current.binGastgeber).toBe(false);
    // Und Sarah sieht ihn in ihrer Liste.
    expect(sarah.result.current.staende.some((s) => s.name === "Franz")).toBe(true);
  });
});

/*
 * ★★★★ „VERLASSEN" MITTEN IM LAUF (Johannes 11.09.2026 abends: „esc mit
 * fragefenster, willst du wirklich abbrechen?").
 *
 * Geprüft wird die Stelle, die nur der Ablauf zeigt: Verlässt der GASTGEBER,
 * darf das Match der anderen weder enden noch abbrechen - und sie müssen
 * trotzdem zu ihrer Liste kommen, obwohl niemand mehr da ist, der `fertig`
 * setzen darf (die Uhr rechnet jedes Gerät selbst, F13).
 */
describe("★★★★ Wer mitten im Lauf verlässt", () => {
  it("der Gastgeber geht - seine Zahlen bleiben stehen, die anderen schreiben weiter und kommen zu ihrer Liste", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(50);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1000);
    await act(async () => {
      franz.result.current.beitreten(franz.result.current.einladung!.id);
    });
    await warte(500);
    await act(async () => {
      sarah.result.current.starten();
    });
    await warte(MATCH_COUNTDOWN_MS + 30_000);
    expect(franz.result.current.phase).toBe("laeuft");
    const matchId = sarah.result.current.meinMatch!.id;

    await act(async () => {
      sarah.result.current.mittendrinVerlassen({ zeichen: 42, fehler: 1, apm: 90, wert: 0 });
    });
    await warte(500);

    // Sarah ist draussen …
    expect(sarah.result.current.meinMatch).toBeNull();
    // … ihre Zeile trägt die BISHERIGEN Zahlen, nicht null …
    const zeile = mockListeStaende(matchId).find((s) => s.pupilUid === "sarah");
    expect(zeile?.status).toBe("fertig");
    expect(zeile?.zeichen).toBe(42);
    // … und das Match der anderen ist weder abgesagt noch beendet.
    const status = mockListeMatches("K1").find((m) => m.id === matchId)?.status;
    expect(status).not.toBe("abgebrochen");
    expect(status).not.toBe("fertig");
    expect(franz.result.current.phase).toBe("laeuft");

    // Nach Ablauf der Zeit ist Franz fertig - ohne Gastgeber.
    await warte(MATCH_DAUER_MS);
    expect(franz.result.current.phase).toBe("fertig");
    expect(franz.result.current.staende.some((s) => s.name === "Sarah" && s.zeichen === 42)).toBe(true);
  });
});

describe("Wer gar nicht darf", () => {
  it("bekommt den Schalter nicht, wenn das Konto keiner Klasse gehört", async () => {
    const selbstlernend: TypingAccount = {
      id: "s1",
      role: "schueler",
      name: "Selbst",
      selfManaged: true,
      createdAt: 1,
    };
    const { result } = renderHook(() => useKlassenmatch(selbstlernend));
    await warte(50);
    expect(result.current.erlaubt).toBe(false);
    expect(result.current.einladung).toBeNull();
  });

  it("bekommt den Schalter nicht ohne Konto", async () => {
    const { result } = renderHook(() => useKlassenmatch(null));
    await warte(50);
    expect(result.current.erlaubt).toBe(false);
  });
});

/*
 * ★★★★★ „DANN PASSIERT GAR NICHTS" (Johannes am Live-Stand, 11.09.2026 abends).
 *
 * Der Server hatte Sarahs Match abgewiesen (Hook-Absturz, Serverprotokoll
 * 17:51), und `einladen` verschluckte das. Seit heute trägt der Haken den Grund
 * als Satz (`meldung`), der Bildschirm zeigt ihn, die Stimme spricht ihn. Wer
 * das `.catch(() => {})` zurückbringt, wird hier rot.
 */
describe("★★★★★ Wenn der Server das Match abweist, sagt die App warum", () => {
  it("der Satz des Servers kommt beim Kind an", async () => {
    const { result } = renderHook(() => useKlassenmatch(SARAH));
    await warte(50);
    expect(result.current.erlaubt).toBe(true);
    const grund = "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.";
    const spion = vi
      .spyOn(typingBackend(), "erstelleMatch")
      .mockRejectedValueOnce(new Error(grund));
    await act(async () => {
      result.current.einladen();
    });
    await warte(50);
    expect(spion).toHaveBeenCalledTimes(1);
    expect(result.current.meinMatch).toBeNull();
    expect(result.current.meldung).toBe(`Das Klassenmatch konnte nicht ausgeschrieben werden: ${grund}`);
    // „Verstanden" nimmt den Satz wieder weg.
    await act(async () => {
      result.current.meldungLoeschen();
    });
    expect(result.current.meldung).toBe("");
    spion.mockRestore();
  });

  it("ohne Satz vom Server gibt es einen eigenen - nie Stille", async () => {
    const { result } = renderHook(() => useKlassenmatch(SARAH));
    await warte(50);
    const spion = vi.spyOn(typingBackend(), "erstelleMatch").mockResolvedValueOnce(null);
    await act(async () => {
      result.current.einladen();
    });
    await warte(50);
    expect(result.current.meldung).toMatch(/konnte gerade nicht ausgeschrieben werden/);
    expect(result.current.meldung).toMatch(/sag es deiner Lehrkraft/);
    spion.mockRestore();
  });
});
