/**
 * ★★★★★ WÄCHTER ÜBER DIE LAST DES KLASSENMATCHS (11.09.2026, Etappe E6b).
 *
 * ── Der Befund, der diesen Wächter nötig macht ──────────────────────────────
 * Die Prüfung der Etappe E6 hat nachgerechnet, was das Klassenmatch den Server
 * kostet - und eine Zahl lag weit über dem Budget des Umbauplans (§2.6: zehn
 * Anfragen je Sekunde je Klasse):
 *
 * | | am 11.09. vormittags | Budget |
 * |---|---|---|
 * | Match-Liste, **dauerhaft**, auch ohne Match (30 Kinder / 5 s) | 6/s | nicht vorgesehen |
 * | Stand-Liste im Match (30 / 3 s) | 10/s | nicht vorgesehen |
 * | Schreiben im Match (30 / 3 s) | 10/s | 10/s |
 * | **Summe im Match** | **26,7/s** | 10/s |
 *
 * Die sechs Abfragen je Sekunde liefen den ganzen Vormittag - auch in einer
 * Klasse, die nie ein Match spielt. Behoben wurde es nicht durch „weniger
 * fragen und hoffen", sondern durch die Bauart der Tippchallenge: **Realtime
 * ist der Hauptweg**, die Sofort-Nachfrage bei Sichtbarkeit/Fokus/Netz der
 * zweite, und der Takt nur das Netz darunter (45 s für die Matches, 15 s für
 * die Stände).
 *
 * ── Warum gemessen und nicht nur gerechnet ──────────────────────────────────
 * [[feedback_zusammenfassung_ist_kein_beleg]]: Eine Konstante auf 45 000 zu
 * setzen beweist nicht, dass auch wirklich nur alle 45 Sekunden gefragt wird -
 * ein zweiter Takt, ein Abo, das sich bei jedem Rendern neu aufbaut, eine
 * Sofort-Nachfrage ohne Drossel, und die Zahl stimmt wieder nicht. Darum läuft
 * hier der ECHTE Haken über dem ECHTEN Mock-Backend 60 Sekunden lang, und
 * gezählt wird, was am Server eine Anfrage wäre (`mockAnfragen`).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import {
  _mockMatchesZuruecksetzen,
  mockAnfragen,
  mockAnfragenZuruecksetzen,
} from "@/lib/typing/matchMock";
import {
  MATCH_COUNTDOWN_MS,
  MATCH_KINDER_JE_KLASSE,
  MATCH_NACHFRAGE_MS,
  MATCH_STAND_NACHFRAGE_MS,
  MATCH_TAKT_MS,
  matchAnfragenJeSekunde,
} from "@/lib/typing/klassenmatch";
import { useKlassenmatch } from "@/lib/typing/useKlassenmatch";
import type { TypingAccount } from "@/lib/typing/account";

const SARAH: TypingAccount = {
  id: "sarah",
  role: "schueler",
  name: "Sarah",
  classCode: "K1",
  createdAt: 1,
};

const MINUTE_MS = 60_000;

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

describe("(a) Die Rechnung steht im Code - nicht im Bericht", () => {
  it("★★★ hält das Budget des Plans ein: 30 Kinder im Match kosten höchstens 14 Anfragen/s", () => {
    const imMatch = matchAnfragenJeSekunde(MATCH_KINDER_JE_KLASSE, true);
    // Die Schreibvorgänge SIND das Budget des Plans (10/s, `MATCH_TAKT_MS`) -
    // und sie fallen nur an, solange wirklich alle 30 Kinder schreiben.
    expect(imMatch.schreiben).toBe(10);
    // Gelesen wird nur noch ein Fünftel dessen, was am 11.09. vormittags lief
    // (16,7/s: Stände alle 3 s plus Matches alle 5 s plus Klasse).
    expect(imMatch.lesen).toBeLessThanOrEqual(4);
    expect(imMatch.summe).toBeLessThanOrEqual(14);
  });

  it("★★★ kostet AUSSERHALB eines Matchs praktisch nichts", () => {
    const ohne = matchAnfragenJeSekunde(MATCH_KINDER_JE_KLASSE, false);
    expect(ohne.schreiben).toBe(0);
    // Vorher: 6,7/s (Matches alle 5 s + Klasse alle 45 s), den ganzen Vormittag.
    expect(ohne.summe).toBeLessThanOrEqual(1.5);
  });

  it("★★ nagelt die drei Zahlen fest, aus denen die Rechnung besteht", () => {
    expect(MATCH_NACHFRAGE_MS).toBe(45_000); // Matches: wie die Tippchallenge
    expect(MATCH_STAND_NACHFRAGE_MS).toBe(15_000); // Stände: fünfmal seltener als der Schreib-Takt
    expect(MATCH_TAKT_MS).toBe(3_000); // Schreiben: unverändert (Budget des Plans)
    // ⚠️ Der Takt der Stände darf NIE wieder der Schreib-Takt werden - genau
    // das war der Befund.
    expect(MATCH_STAND_NACHFRAGE_MS).toBeGreaterThan(MATCH_TAKT_MS * 3);
  });
});

describe("(b) Gemessen: ein Gerät, 60 Sekunden", () => {
  it("★★★★★ fragt OHNE Match in einer Minute höchstens dreimal nach", async () => {
    const { result } = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);
    expect(result.current.erlaubt).toBe(true);

    mockAnfragenZuruecksetzen();
    await warte(MINUTE_MS);
    const gemessen = mockAnfragen();

    /*
      Gerechnet: eine Nachfrage je 45 s ⇒ in 60 Sekunden genau eine, mit
      Rundungsspielraum höchstens drei. Vorher (5 s) waren es ZWÖLF - je Gerät,
      jede Minute, den ganzen Vormittag. Bei 30 Kindern: 6 Abfragen je Sekunde
      je Klasse gegen jetzt 0,7.
    */
    expect(gemessen.lesen).toBeLessThanOrEqual(3);
    expect(gemessen.schreiben).toBe(0);
  });

  it("★★★★★ fragt IM Match in einer Minute höchstens achtmal nach", async () => {
    const { result } = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);
    await act(async () => {
      result.current.einladen();
    });
    // Mia und Ben treten bei, dann starten wir.
    await warte(3_000);
    await act(async () => {
      result.current.starten();
    });
    await warte(MATCH_COUNTDOWN_MS + 1_000);
    expect(result.current.phase).toBe("laeuft");

    mockAnfragenZuruecksetzen();
    await warte(MINUTE_MS);
    const gemessen = mockAnfragen();

    /*
      Gerechnet: Stände alle 15 s (vier) plus Matches alle 45 s (eine) ⇒ fünf,
      mit Rundungsspielraum höchstens acht. Vorher waren es 20 + 12 = 32.
      ⚠️ Die Schreibvorgänge in dieser Messung sind die der beiden Mitspieler
      (zwei Geräte × 20 Takte); das eigene Kind schreibt hier nicht, weil kein
      Lauf im Baum steht. Sie stehen bewusst mit in der Zahl - am Server ist
      jedes Bot-Schreiben eine Anfrage.
    */
    expect(gemessen.lesen).toBeLessThanOrEqual(8);
    expect(gemessen.schreiben).toBeLessThanOrEqual(2 * (MINUTE_MS / MATCH_TAKT_MS) + 2);
  });

  it("★★★ hört ganz auf, sobald die Seite zugeht", async () => {
    const { result, unmount } = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);
    expect(typingBackend().kind).toBe("local");
    expect(result.current.geladen).toBe(true);

    unmount();
    mockAnfragenZuruecksetzen();
    await warte(2 * MINUTE_MS);
    // Kein Takt, kein Abo, keine einzige Anfrage mehr - sonst hinge ein
    // geschlossener Reiter weiter am Server.
    expect(mockAnfragen().summe).toBe(0);
  });
});
