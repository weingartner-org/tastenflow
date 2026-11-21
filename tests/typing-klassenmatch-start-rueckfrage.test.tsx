/**
 * ★★★★★ WÄCHTER: DIE KLASSE CSS6 AM 02.10.2026 - nachgestellt.
 *
 * Aus den Server-Daten dieses Vormittags:
 *  • Kinder starteten Matches, bevor alle beigetreten waren - drei Anläufe.
 *  • 10:18-10:19 liefen drei Matches fast gleichzeitig: Matti legte zwei im
 *    Abstand von 13 Sekunden an, Stephan, Arne und Matti steckten in zwei
 *    Matches zugleich.
 *  • Das Match war um 10:17:20 vorbei, um 10:18 kam die nächste Einladung -
 *    und wer noch vor der Rangliste sass, bekam sie nicht.
 *
 * Johannes' Entscheidungen, je ein Block:
 *  (A) KEINE Wartezeit, aber eine Rückfrage beim Starten: „3 Kinder haben sich
 *      noch nicht entschieden. Trotzdem starten?" - gezählt wird nur, bei wem
 *      die Einladung wirklich aufging (Zeile `eingeladen`), und eine solche
 *      Zeile ist NIRGENDS eine Teilnahme.
 *  (B) Ein Kind, ein Match - im Gerät UND am Server (der Mock prüft mit
 *      `matchSperre`, derselben Regel wie `tt_match_lib.pb.js`; der echte
 *      Server ist im Bericht gegen ein lokales PocketBase gemessen). Dazu die
 *      Rückfrage „Arne lädt gerade ein. Mitmachen oder selbst einladen?".
 *  (C) Auf der Rangliste ist ein Kind frei: Die Einladung geht über der Liste
 *      auf, „Jetzt nicht" führt dorthin zurück.
 *  (D) `fertigMelden` schickt den Abschluss nur noch beim Gastgeber.
 *
 * Jeder Fall war vor der Behebung rot - der Beleg steht im Bericht vom
 * 02.10.2026 (Logik einzeln zurückgedreht, Test lief rot).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn() };
});

import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { _mockMatchesZuruecksetzen, mockListeMatches, mockListeStaende } from "@/lib/typing/matchMock";
import {
  MATCH_COUNTDOWN_MS,
  MATCH_DAUER_MS,
  MATCH_SPERRE_DABEI,
  MATCH_SPERRE_GASTGEBER,
  dabeiNamen,
  rangliste,
  type Match,
  type MatchStand,
} from "@/lib/typing/klassenmatch";
import { useKlassenmatch } from "@/lib/typing/useKlassenmatch";
import { KlassenmatchLobby } from "@/components/typing/KlassenmatchLobby";
import { KlassenmatchEinladung } from "@/components/typing/KlassenmatchEinladung";
import { KlassenmatchErgebnis } from "@/components/typing/KlassenmatchErgebnis";
import { KlassenmatchWahl } from "@/components/typing/KlassenmatchWahl";
import type { TypingAccount } from "@/lib/typing/account";

function kind(id: string, name: string): TypingAccount {
  return { id, role: "schueler", name, classCode: "CSS6", createdAt: 1 };
}
const ARNE = kind("arne", "Arne");
const MATTI = kind("matti", "Matti");
const STEPHAN = kind("stephan", "Stephan");
const LENA = kind("lena", "Lena");

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
  cleanup();
  vi.useRealTimers();
  _mockMatchesZuruecksetzen();
  localStorage.clear();
});

// ── (A) Wer hat sich noch nicht entschieden? ─────────────────────────────────

describe("(A) „Noch nicht entschieden“ - gezählt wird, bei wem die Einladung aufging", () => {
  it("★★★★★ Arne lädt ein: Matti sagt zu, Lena hat das Fenster und überlegt ⇒ 1 unentschieden, und Lena zählt NIRGENDS als dabei", async () => {
    const arne = renderHook(() => useKlassenmatch(ARNE));
    const matti = renderHook(() => useKlassenmatch(MATTI));
    const lena = renderHook(() => useKlassenmatch(LENA));
    await warte(100);
    await act(async () => {
      arne.result.current.einladen();
    });
    await warte(500);
    const id = arne.result.current.meinMatch!.id;
    expect(matti.result.current.einladung?.id).toBe(id);
    expect(lena.result.current.einladung?.id).toBe(id);

    // Beide Fenster gehen auf (das Bauteil meldet es), Matti sagt zu.
    await act(async () => {
      matti.result.current.einladungGezeigt(id);
      lena.result.current.einladungGezeigt(id);
    });
    await warte(100);
    await act(async () => {
      matti.result.current.beitreten(id);
    });
    await warte(3000); // dazu Mia und Ben aus dem Mock

    expect(arne.result.current.unentschieden).toBe(1);
    // ⚠️ Lenas Zeile steht am „Server" - aber nirgends als Teilnahme.
    const zeilen = mockListeStaende(id);
    expect(zeilen.find((s) => s.pupilUid === "lena")?.status).toBe("eingeladen");
    expect(arne.result.current.staende.map((s) => s.pupilUid)).not.toContain("lena");
    expect(dabeiNamen(zeilen, "arne")).not.toContain("Lena");
    expect(rangliste(zeilen).map((e) => e.stand.pupilUid)).not.toContain("lena");
    expect(arne.result.current.kannStarten).toBe(true);

    // Lena sagt „Jetzt nicht" ⇒ niemand überlegt mehr, und das steht am Server.
    await act(async () => {
      lena.result.current.ablehnen(id);
    });
    await warte(100);
    expect(mockListeStaende(id).find((s) => s.pupilUid === "lena")?.status).toBe("abgelehnt");
    expect(arne.result.current.unentschieden).toBe(0);
  });

  it("★★★ wer gar kein Fenster bekam (Tastenflow nicht offen), zählt nicht mit", async () => {
    const arne = renderHook(() => useKlassenmatch(ARNE));
    await warte(100);
    await act(async () => {
      arne.result.current.einladen();
    });
    await warte(3000);
    expect(arne.result.current.unentschieden).toBe(0);
  });
});

describe("(A) Die Rückfrage im Wartefenster", () => {
  const MATCH: Match = {
    id: "m1",
    classCode: "CSS6",
    hostUid: "arne",
    hostName: "Arne",
    status: "einladung",
    startMs: 0,
    endeMs: 0,
    dauerMin: 5,
    createdMs: 1,
  };
  const STAND: MatchStand = {
    id: "s1",
    matchId: "m1",
    classCode: "CSS6",
    pupilUid: "matti",
    name: "Matti",
    status: "dabei",
    zeichen: 0,
    fehler: 0,
    apm: 0,
    wert: 0,
    updatedMs: 1,
  };

  function lobby(unentschieden: number, onStarten = vi.fn(), onAbbrechen = vi.fn()) {
    return render(
      <KlassenmatchLobby
        match={MATCH}
        staende={[STAND]}
        binGastgeber
        imCountdown={false}
        restMs={0}
        kannStarten
        unentschieden={unentschieden}
        onStarten={onStarten}
        onAbbrechen={onAbbrechen}
      />,
    );
  }

  it("★★★★★ 3 unentschieden: „Starten“ fragt nach, der Fokus steht auf „Warten“, die Zahl lebt mit", () => {
    const onStarten = vi.fn();
    const ansicht = lobby(3, onStarten);
    fireEvent.click(screen.getByRole("button", { name: "Starten" }));
    expect(onStarten).not.toHaveBeenCalled();
    expect(screen.getByRole("group", { name: "3 Kinder haben sich noch nicht entschieden. Trotzdem starten?" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Warten" }));
    expect(screen.getByRole("button", { name: "Warten" }).hasAttribute("disabled")).toBe(false);

    // Zwei sagen ab - die Frage steht weiter, mit der neuen Zahl, in der Einzahl.
    ansicht.rerender(
      <KlassenmatchLobby
        match={MATCH}
        staende={[STAND]}
        binGastgeber
        imCountdown={false}
        restMs={0}
        kannStarten
        unentschieden={1}
        onStarten={onStarten}
        onAbbrechen={vi.fn()}
      />,
    );
    expect(screen.getByText("1 Kind hat sich noch nicht entschieden. Trotzdem starten?")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Trotzdem starten" }));
    expect(onStarten).toHaveBeenCalledTimes(1);
  });

  it("★★★★ Escape heisst „Warten“ - nicht „Absagen“ -, und der Fokus geht zurück auf „Starten“", async () => {
    const onStarten = vi.fn();
    const onAbbrechen = vi.fn();
    lobby(2, onStarten, onAbbrechen);
    fireEvent.click(screen.getByRole("button", { name: "Starten" }));
    fireEvent.keyDown(window, { key: "Escape" });
    await warte(10);
    expect(onAbbrechen).not.toHaveBeenCalled();
    expect(onStarten).not.toHaveBeenCalled();
    expect(screen.queryByRole("group")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Starten" }));
  });

  it("★★★ niemand überlegt ⇒ „Starten“ startet sofort wie bisher", () => {
    const onStarten = vi.fn();
    lobby(0, onStarten);
    fireEvent.click(screen.getByRole("button", { name: "Starten" }));
    expect(onStarten).toHaveBeenCalledTimes(1);
  });

  it("★★ das Einladungsfenster meldet sich beim Öffnen - einmal", () => {
    const onGezeigt = vi.fn();
    render(
      <KlassenmatchEinladung hostName="Arne" onDabei={vi.fn()} onNichtJetzt={vi.fn()} onGezeigt={onGezeigt} />,
    );
    expect(onGezeigt).toHaveBeenCalledTimes(1);
  });
});

// ── (B) Ein Kind, ein Match ──────────────────────────────────────────────────

describe("(B) Ein Kind, ein Match", () => {
  it("★★★★★ Matti legt an, lädt neu und drückt noch einmal ⇒ abgewiesen, mit Satz - kein zweites Match", async () => {
    const vorher = renderHook(() => useKlassenmatch(MATTI));
    await warte(100);
    await act(async () => {
      vorher.result.current.einladen();
    });
    await warte(500);
    expect(mockListeMatches("CSS6").length).toBe(1);
    vorher.unmount();

    // Das Neuladen: `meinMatchId` ist weg, das Gerät weiss nichts mehr.
    vi.setSystemTime(Date.now() + 13_000);
    const nachher = renderHook(() => useKlassenmatch(MATTI));
    await warte(100);
    await act(async () => {
      nachher.result.current.einladen();
    });
    await warte(500);
    expect(mockListeMatches("CSS6").length, "kein zweites Match").toBe(1);
    expect(nachher.result.current.meldung).toBe(
      `Das Klassenmatch konnte nicht ausgeschrieben werden: ${MATCH_SPERRE_GASTGEBER}`,
    );
  });

  it("★★★★★ Stephan ist in Arnes Match dabei, lädt neu und tritt Mattis Einladung bei ⇒ abgewiesen, losgelassen, Satz", async () => {
    const arne = renderHook(() => useKlassenmatch(ARNE));
    const stephanVorher = renderHook(() => useKlassenmatch(STEPHAN));
    await warte(100);
    await act(async () => {
      arne.result.current.einladen();
    });
    await warte(500);
    await act(async () => {
      stephanVorher.result.current.beitreten(arne.result.current.meinMatch!.id);
    });
    await warte(3000);
    await act(async () => {
      arne.result.current.starten();
    });
    await warte(500);
    expect(arne.result.current.phase).toBe("countdown");
    stephanVorher.unmount();

    const matti = renderHook(() => useKlassenmatch(MATTI));
    await warte(100);
    await act(async () => {
      matti.result.current.einladen();
    });
    await warte(500);
    const mattisId = matti.result.current.meinMatch!.id;

    const stephan = renderHook(() => useKlassenmatch(STEPHAN));
    await warte(500);
    expect(stephan.result.current.einladung?.id).toBe(mattisId);
    await act(async () => {
      stephan.result.current.beitreten(mattisId);
    });
    await warte(500);
    expect(stephan.result.current.meinMatch).toBeNull();
    expect(stephan.result.current.meldung).toBe(MATCH_SPERRE_DABEI);
    expect(mockListeStaende(mattisId).find((s) => s.pupilUid === "stephan")).toBeUndefined();
  });

  it("★★★★ „Klassenmatch“, während Arne einlädt ⇒ Rückfrage; „Mitmachen“ tritt Arnes Match bei", async () => {
    const arne = renderHook(() => useKlassenmatch(ARNE));
    const matti = renderHook(() => useKlassenmatch(MATTI));
    await warte(100);
    await act(async () => {
      arne.result.current.einladen();
    });
    await warte(500);
    await act(async () => {
      matti.result.current.einladen();
    });
    await warte(100);
    expect(matti.result.current.rueckfrage?.hostName).toBe("Arne");
    expect(mockListeMatches("CSS6").length).toBe(1);
    await act(async () => {
      matti.result.current.rueckfrageMitmachen();
    });
    await warte(500);
    expect(matti.result.current.rueckfrage).toBeNull();
    expect(matti.result.current.meinMatch?.id).toBe(arne.result.current.meinMatch!.id);
    expect(mockListeStaende(arne.result.current.meinMatch!.id).find((s) => s.pupilUid === "matti")?.status).toBe(
      "dabei",
    );
  });

  it("★★★★ „Selbst einladen“ ⇒ Arnes Einladung ist für Matti abgelehnt, und Mattis eigenes Match bleibt stehen", async () => {
    const arne = renderHook(() => useKlassenmatch(ARNE));
    const matti = renderHook(() => useKlassenmatch(MATTI));
    await warte(100);
    await act(async () => {
      arne.result.current.einladen();
    });
    await warte(500);
    const arnesId = arne.result.current.meinMatch!.id;
    await act(async () => {
      matti.result.current.einladen();
    });
    await warte(100);
    await act(async () => {
      matti.result.current.rueckfrageSelbst();
    });
    await warte(5000);
    // Absatz (a) „wer zuerst da war, gewinnt" sagt Mattis Match NICHT ab.
    expect(matti.result.current.binGastgeber).toBe(true);
    expect(matti.result.current.phase).toBe("einladung");
    expect(mockListeMatches("CSS6").length).toBe(2);
    expect(mockListeStaende(arnesId).find((s) => s.pupilUid === "matti")?.status).toBe("abgelehnt");
  });

  it("★★★ das Fragefenster: Satz, Fokus auf „Mitmachen“, Escape tut nichts ausser schliessen", () => {
    const onMitmachen = vi.fn();
    const onSelbst = vi.fn();
    const onSchliessen = vi.fn();
    render(
      <KlassenmatchWahl hostName="Arne" onMitmachen={onMitmachen} onSelbst={onSelbst} onSchliessen={onSchliessen} />,
    );
    expect(screen.getByText("Arne lädt gerade ein. Mitmachen oder selbst einladen?")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Mitmachen" }));
    expect(screen.getByRole("button", { name: "Selbst einladen" })).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onSchliessen).toHaveBeenCalledTimes(1);
    expect(onMitmachen).not.toHaveBeenCalled();
    expect(onSelbst).not.toHaveBeenCalled();
  });

  it("★★★ der Hook am Server trägt dieselben Sätze und prüft beim Anlegen UND beim Beitreten", () => {
    const lib = readFileSync(resolve(process.cwd(), "pocketbase/pb_hooks/tt_match_lib.pb.js"), "utf8");
    const hook = readFileSync(resolve(process.cwd(), "pocketbase/pb_hooks/tt_match.pb.js"), "utf8");
    expect(lib).toContain(`"${MATCH_SPERRE_GASTGEBER}"`);
    expect(lib).toContain(`"${MATCH_SPERRE_DABEI}"`);
    expect(hook).toContain("L.einKindEinMatch(e.app, kind.id, code, \"\")");
    expect(hook.split("L.standSperre(e,").length - 1, "Stand anlegen UND ändern").toBe(2);
    // Der Verlauf nimmt nur, wer teilnahm - nie eine `eingeladen`-Zeile.
    expect(hook).toContain("staende.filter((s) => L.nimmtTeil(s))");
  });
});

// ── (C) Auf der Rangliste ist ein Kind frei ──────────────────────────────────

describe("(C) Eine Einladung erreicht auch, wer noch vor der Rangliste sitzt", () => {
  it("★★★★★ Arnes Match ist vorbei, Matti steht vor der Liste, Lena lädt ein ⇒ Matti bekommt die Einladung und kann beitreten", async () => {
    const arne = renderHook(() => useKlassenmatch(ARNE));
    const matti = renderHook(() => useKlassenmatch(MATTI));
    await warte(100);
    await act(async () => {
      arne.result.current.einladen();
    });
    await warte(500);
    const arnesId = arne.result.current.meinMatch!.id;
    await act(async () => {
      matti.result.current.beitreten(arnesId);
    });
    await warte(3000);
    await act(async () => {
      arne.result.current.starten();
    });
    await warte(MATCH_COUNTDOWN_MS + MATCH_DAUER_MS + 500);
    // Der Lauf meldet die letzte Zeile (das tut sonst `KlassenmatchLauf`).
    await act(async () => {
      matti.result.current.fertigMelden({ zeichen: 120, fehler: 2, apm: 40, wert: 50, wartezeitMs: 0 });
      arne.result.current.fertigMelden({ zeichen: 100, fehler: 1, apm: 35, wert: 45, wartezeitMs: 0 });
    });
    await warte(500);
    expect(matti.result.current.phase).toBe("fertig");
    expect(matti.result.current.aufRangliste).toBe(true);
    expect(matti.result.current.meinMatch?.id, "die Liste steht noch").toBe(arnesId);

    const lena = renderHook(() => useKlassenmatch(LENA));
    await warte(100);
    await act(async () => {
      lena.result.current.einladen();
    });
    await warte(500);
    const lenasId = lena.result.current.meinMatch!.id;
    expect(matti.result.current.einladung?.id).toBe(lenasId);

    await act(async () => {
      matti.result.current.beitreten(lenasId);
    });
    await warte(500);
    expect(matti.result.current.meinMatch?.id).toBe(lenasId);
    expect(matti.result.current.phase).toBe("einladung");
  });

  it("★★★★ über der Liste: Escape schliesst NUR die Einladung, die Liste bleibt, der Fokus geht auf ihre Überschrift", async () => {
    const onWeiter = vi.fn();
    const onNichtJetzt = vi.fn();
    render(
      <>
        <KlassenmatchErgebnis liste={[]} eigeneUid="matti" onWeiter={onWeiter} />
        <KlassenmatchEinladung
          hostName="Lena"
          onDabei={vi.fn()}
          onNichtJetzt={onNichtJetzt}
          fokusNachNein={() => document.querySelector<HTMLElement>("[data-match-titel]")?.focus()}
        />
      </>,
    );
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Bin dabei" }));
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await warte(10);
    expect(onNichtJetzt).toHaveBeenCalledTimes(1);
    expect(onWeiter, "die Liste darf das Escape nicht bekommen").not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole("heading", { name: "Das Klassenmatch ist vorbei" }));
  });
});

// ── (D) Den Abschluss schickt nur der Gastgeber ──────────────────────────────

describe("(D) `fertigMelden` schickt den Abschluss nur beim Gastgeber", () => {
  it("★★★ Matti (kein Gastgeber) ⇒ kein PATCH auf das Match; Arne ⇒ ja", async () => {
    const arne = renderHook(() => useKlassenmatch(ARNE));
    const matti = renderHook(() => useKlassenmatch(MATTI));
    await warte(100);
    await act(async () => {
      arne.result.current.einladen();
    });
    await warte(500);
    const id = arne.result.current.meinMatch!.id;
    await act(async () => {
      matti.result.current.beitreten(id);
    });
    await warte(3000);
    await act(async () => {
      arne.result.current.starten();
    });
    await warte(MATCH_COUNTDOWN_MS + 1000);

    const spion = vi.spyOn(typingBackend(), "aktualisiereMatch");
    await act(async () => {
      matti.result.current.fertigMelden({ zeichen: 1, fehler: 0, apm: 10, wert: 1, wartezeitMs: 0 });
    });
    expect(spion).not.toHaveBeenCalled();
    await act(async () => {
      arne.result.current.fertigMelden({ zeichen: 1, fehler: 0, apm: 10, wert: 1, wartezeitMs: 0 });
    });
    expect(spion).toHaveBeenCalledWith(id, "fertig");
    spion.mockRestore();
  });
});
