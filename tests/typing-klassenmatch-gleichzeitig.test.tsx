/**
 * ★★★★★ WÄCHTER: ZWEI KINDER SCHREIBEN GLEICHZEITIG AUS (11.09.2026 abends).
 *
 * Johannes nach dem ersten Test mit einer echten Klasse, wörtlich:
 *   „was machen wenn zwei schüler zugleich ausschreiben: bitte schau wer der
 *    erste ist und wechsel das zweite ausschreibungsfenster automatisch in ein
 *    anfragefenster"
 *
 * ── Der Befund ──────────────────────────────────────────────────────────────
 * Beide `erstelleMatch` gingen durch (der Server erlaubt zwei offene), beide
 * Kinder sassen in ihrem eigenen Wartefenster „Noch niemand dabei" - und die
 * Klasse sah die JÜNGERE Einladung. Dazu zwei Fallen, die beim Lesen auffielen
 * und hier erst nachgestellt werden:
 *  (d) Wer einer Einladung beigetreten war, die dann abgesagt wurde, landete
 *      vor der Platzierungsliste eines Spiels, das nie lief
 *      (`matchPhaseVon` sagt für „abgebrochen" „fertig").
 *  (e) Ein Match, das der Server weggeräumt hat, hielt das Kind fest: Der
 *      Schalter sagte für immer „läuft gerade".
 *
 * ── Was hier geprüft wird ───────────────────────────────────────────────────
 *  (a) Wer zuerst da war, gewinnt - das spätere Match sagt sich selbst ab, und
 *      sein Gastgeber sieht sofort die frühere Einladung.
 *  (b) Solange eine fremde, nicht abgelehnte Einladung offen ist, legt
 *      „einladen" kein zweites Match an.
 *  (c) Bei zwei offenen Einladungen sieht die Klasse die ÄLTERE.
 *  (d) Mitgefangene Kinder werden losgelassen und bekommen einen Satz.
 *  (e) Ein verschwundenes Match lässt das Kind los.
 *
 * Gespielt wird am echten Mock-Backend (`matchMock.ts`) mit gestellten Uhren -
 * dieselbe Bauart wie `typing-klassenmatch-hook.test.tsx`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";

// `speakUi` wird ersetzt, damit der gesprochene Satz beobachtbar ist (der Rest
// des Moduls bleibt echt - dieselbe Bauart wie `typing-klassenmatch-hinweis`).
vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn() };
});

import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { _mockMatchesZuruecksetzen, mockListeMatches } from "@/lib/typing/matchMock";
import {
  MATCH_COUNTDOWN_MS,
  MATCH_DAUER_MS,
  MATCH_HINWEIS_LAEUFT,
  MATCH_NACHFRAGE_MS,
  type Match,
} from "@/lib/typing/klassenmatch";
import { useKlassenmatch } from "@/lib/typing/useKlassenmatch";
import { speakUi } from "@/lib/typing/voice";
import type { TypingAccount } from "@/lib/typing/account";

function kind(id: string, name: string): TypingAccount {
  return { id, role: "schueler", name, classCode: "K1", createdAt: 1 };
}
const SARAH = kind("sarah", "Sarah");
const FRANZ = kind("franz", "Franz");
const MIRA = kind("mira", "Mira");

/** Der Speicherort der Matches im Mock (`matchMock.ts`, SCHLUESSEL_MATCHES). */
const MATCHES_SCHLUESSEL = "tastenflow:klassenmatch:matches";

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
  vi.mocked(speakUi).mockClear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  _mockMatchesZuruecksetzen();
  localStorage.clear();
});

describe("(a) Wer zuerst ausgeschrieben hat, gewinnt", () => {
  it("★★★★★ das spätere Match sagt sich selbst ab - und sein Kind sieht die frühere Einladung", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(100);

    // Beide drücken im selben Augenblick - keines hat die Einladung des anderen
    // schon gesehen. Sarah ist fünf Millisekunden früher.
    await act(async () => {
      sarah.result.current.einladen();
      vi.setSystemTime(Date.now() + 5);
      franz.result.current.einladen();
    });
    await warte(1000);

    // Sarah bleibt Gastgeberin im Wartefenster.
    expect(sarah.result.current.binGastgeber).toBe(true);
    expect(sarah.result.current.phase).toBe("einladung");
    // Franz ist losgelassen und sieht Sarahs Einladung - mit dem Satz davor.
    expect(franz.result.current.meinMatch).toBeNull();
    expect(franz.result.current.phase).toBe("keine");
    expect(franz.result.current.einladung?.hostName).toBe("Sarah");
    expect(franz.result.current.einladungVorsatz).toBe("Sarah hat schon eingeladen.");
    // Und sein Match ist am „Server" abgesagt, nicht nur vergessen.
    const franzMatch = mockListeMatches("K1").find((m) => m.hostUid === "franz");
    expect(franzMatch?.status).toBe("abgebrochen");
  });

  it("★★★ bei Gleichstand der Zeit entscheidet die Kennung - und genau EINES sagt ab", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
      franz.result.current.einladen();
    });
    await warte(1000);

    const gastgeber = [sarah, franz].filter((h) => h.result.current.binGastgeber);
    const eingeladen = [sarah, franz].filter((h) => h.result.current.einladung);
    expect(gastgeber.length, "genau ein Kind bleibt Gastgeber").toBe(1);
    expect(eingeladen.length, "genau ein Kind sieht die Einladung").toBe(1);
    expect(eingeladen[0].result.current.einladung?.id).toBe(gastgeber[0].result.current.meinMatch?.id);
  });
});

/*
 * ★ ENTSCHEIDUNG JOHANNES (11.09.2026 abends), sie ersetzt die erste Vorgabe
 * („wer abgelehnt hat, darf selbst ausschreiben"):
 *   „Das soll erst möglich sein wenn das erste match schon läuft, vorher nicht."
 *
 * ★★ UND SEIT 02.10.2026 (Klasse CSS6) wird stattdessen GEFRAGT: „Arne lädt
 * gerade ein. Mitmachen oder selbst einladen?" Alt + M legt also weiterhin
 * NICHTS an, solange eine fremde Einladung offen steht - aber es öffnet die
 * Rückfrage (`rueckfrage`), statt nur den Namen zu sagen oder das alte
 * Fenster zurückzuholen. Die Wege „Mitmachen" und „Selbst einladen" prüft
 * `typing-klassenmatch-start-rueckfrage.test.tsx`.
 */
describe("(b) Alt + M legt kein Match an, solange in der Klasse jemand einlädt", () => {
  it("★★★★ am Server entsteht nichts - stattdessen kommt die Rückfrage zu Sarahs Einladung", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1000);
    expect(franz.result.current.einladung?.hostName).toBe("Sarah");

    const spion = vi.spyOn(typingBackend(), "erstelleMatch");
    await act(async () => {
      franz.result.current.einladen();
    });
    await warte(1000);
    expect(spion).not.toHaveBeenCalled();
    expect(mockListeMatches("K1").length).toBe(1);
    expect(franz.result.current.rueckfrage?.hostName).toBe("Sarah");
    spion.mockRestore();
  });

  it("★★★★ auch nach „Jetzt nicht“ kein zweites Match ohne Rückfrage - und Escape lässt alles, wie es ist", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1000);
    const id = franz.result.current.einladung!.id;
    await act(async () => {
      franz.result.current.ablehnen(id);
    });
    await warte(100);
    expect(franz.result.current.einladung).toBeNull();

    const spion = vi.spyOn(typingBackend(), "erstelleMatch");
    await act(async () => {
      franz.result.current.einladen();
    });
    await warte(500);
    expect(spion).not.toHaveBeenCalled();
    expect(mockListeMatches("K1").length).toBe(1);
    // ★ Das ausdrückliche Alt + M fragt - auch nach einer Absage.
    expect(franz.result.current.rueckfrage?.id).toBe(id);

    // Escape: nichts angelegt, nichts beigetreten - und die abgelehnte
    // Einladung kommt VON SELBST nicht wieder (F2).
    await act(async () => {
      franz.result.current.rueckfrageSchliessen();
    });
    await warte(MATCH_NACHFRAGE_MS + 500);
    expect(franz.result.current.rueckfrage).toBeNull();
    expect(franz.result.current.einladung).toBeNull();
    expect(franz.result.current.meinMatch).toBeNull();
    expect(spion).not.toHaveBeenCalled();
    spion.mockRestore();
  });

  it("★★★ sobald das erste Match läuft (Countdown), darf ein Kind, das nicht mitspielt, ein zweites ausschreiben", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(3000); // Mia und Ben treten bei
    await act(async () => {
      sarah.result.current.starten();
    });
    await warte(100);
    expect(sarah.result.current.phase).toBe("countdown");
    await act(async () => {
      franz.result.current.einladen();
    });
    await warte(500);
    expect(franz.result.current.binGastgeber).toBe(true);
    expect(franz.result.current.phase).toBe("einladung");
  });
});

describe("(c) Bei zwei offenen Einladungen sieht die Klasse die ÄLTERE", () => {
  it("★★★★ Franz bekommt Sarahs Einladung, nicht die spätere, die noch offen steht", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1000);
    /*
      Eine zweite, SPÄTERE Einladung steht noch offen: Miras Gerät hat sie
      gleichzeitig angelegt und (a) noch nicht angewandt - zum Beispiel, weil
      es gerade kein Netz hat. Genau in diesem Fenster entscheidet die
      Reihenfolge, zu wem die Klasse geht.
    */
    const alle = JSON.parse(localStorage.getItem(MATCHES_SCHLUESSEL) ?? "[]") as Match[];
    const spaeter: Match = {
      id: "m-mira-spaet",
      classCode: "K1",
      hostUid: "mira",
      hostName: "Mira",
      status: "einladung",
      startMs: 0,
      endeMs: 0,
      dauerMin: 5,
      createdMs: alle[0].createdMs + 1000,
    };
    localStorage.setItem(MATCHES_SCHLUESSEL, JSON.stringify([...alle, spaeter]));

    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(100);
    expect(franz.result.current.einladung?.hostName).toBe("Sarah");
  });
});

describe("(d) Wer einer abgesagten Einladung beigetreten war", () => {
  it("★★★★★ wird losgelassen - und landet NICHT vor einer Ergebnisliste", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1000);
    await act(async () => {
      franz.result.current.beitreten(franz.result.current.einladung!.id);
    });
    await warte(500);
    expect(franz.result.current.phase).toBe("einladung");

    await act(async () => {
      sarah.result.current.absagen();
    });
    await warte(1000);

    // ⚠️ Vorher: phase „fertig" mit dem abgesagten Match - die Seite zeigte
    // `KlassenmatchLauf` mit startMs = endeMs = 0, und der ging sofort in die
    // Platzierungsliste.
    expect(franz.result.current.phase).toBe("keine");
    expect(franz.result.current.meinMatch).toBeNull();
    expect(franz.result.current.hinweis).toBe("");
    expect(franz.result.current.erlaubt).toBe(true);
    expect(franz.result.current.meldung).toBe("Sarah hat das Klassenmatch abgesagt.");
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith("Sarah hat das Klassenmatch abgesagt.");
  });

  it("★★★★ sieht danach die ältere Einladung - mit dem Satz im Fenster, nicht als zweite Stimme", async () => {
    const mira = renderHook(() => useKlassenmatch(MIRA));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(100);
    await act(async () => {
      mira.result.current.einladen();
    });
    await warte(1000);
    const miraId = franz.result.current.einladung!.id;
    await act(async () => {
      franz.result.current.beitreten(miraId);
    });
    await warte(500);
    expect(franz.result.current.phase).toBe("einladung");

    /*
      Sarahs Einladung war FRÜHER da, kam aber erst jetzt an (ein langsames
      Realtime-Abo): Sie steht im Speicher, ohne dass jemand benachrichtigt
      wurde - erst die nächste Nachfrage im Takt findet sie.
    */
    const alle = JSON.parse(localStorage.getItem(MATCHES_SCHLUESSEL) ?? "[]") as Match[];
    const frueher: Match = {
      id: "m-sarah-frueh",
      classCode: "K1",
      hostUid: "sarah",
      hostName: "Sarah",
      status: "einladung",
      startMs: 0,
      endeMs: 0,
      dauerMin: 5,
      createdMs: alle[0].createdMs - 1000,
    };
    localStorage.setItem(MATCHES_SCHLUESSEL, JSON.stringify([...alle, frueher]));
    await warte(MATCH_NACHFRAGE_MS + 500);

    // Mira hat ihr späteres Match abgesagt (a) …
    expect(mira.result.current.meinMatch).toBeNull();
    expect(mira.result.current.einladung?.id).toBe("m-sarah-frueh");
    // … Franz ist losgelassen und sieht Sarahs Einladung, mit Miras Satz davor.
    expect(franz.result.current.phase).toBe("keine");
    expect(franz.result.current.einladung?.id).toBe("m-sarah-frueh");
    expect(franz.result.current.einladungVorsatz).toBe("Mira hat das Klassenmatch abgesagt.");
    // Keine zweite Stimme: Das Einladungsfenster spricht den Satz mit.
    expect(franz.result.current.meldung).toBe("");
    expect(vi.mocked(speakUi)).not.toHaveBeenCalledWith("Mira hat das Klassenmatch abgesagt.");
  });
});

describe("(e) Ein Match, das der Server weggeräumt hat", () => {
  it("★★★ hält das Kind nicht für immer mit „läuft gerade“ fest", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(3000); // Mia und Ben treten bei
    await act(async () => {
      sarah.result.current.starten();
    });
    await warte(MATCH_COUNTDOWN_MS + MATCH_DAUER_MS + 1000);
    expect(sarah.result.current.phase).toBe("fertig");

    // Sarah lässt die Platzierungsliste offen stehen. Eine Stunde nach dem
    // Match räumt der Server auf (`tt_match.pb.js`, Cron, F10).
    localStorage.setItem(MATCHES_SCHLUESSEL, "[]");
    await warte(MATCH_NACHFRAGE_MS + 500);

    expect(sarah.result.current.meinMatch).toBeNull();
    expect(sarah.result.current.hinweis, "der Schalter hängt auf „läuft gerade“").not.toBe(
      MATCH_HINWEIS_LAEUFT,
    );
    expect(sarah.result.current.erlaubt).toBe(true);
  });
});
