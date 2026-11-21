/**
 * ★★★★★ WÄCHTER: KEINE VERGESSENE EINLADUNG MEHR (15.09.2026).
 *
 * ── Der Anlass ──────────────────────────────────────────────────────────────
 * Johannes, in einer Nachricht mit vier Punkten:
 *  1. *„wenn jemand ein mathsch starten möchte und alle lehnen ab soll das
 *     nicht im Hintergrund weiterlaufen sonder beendet werden"*
 *  2. *„wenn jemand öfter ALT + M drückt soll das nicht im hintergrund
 *     geespeichert werden"*
 *  3. Sebastian bekam „Tester lädt dich zu einem Klassenmatch ein" ZEHNMAL
 *     für dasselbe Vorhaben, obwohl sie in der Zwischenzeit schon eines
 *     gemacht hatten.
 *  4. *„matchanfragen die nicht beatwortet werden sollen einfach
 *     verschwinden, wenn gar niemand was macht nach 30sec"*
 *
 * Punkt 3 erklärt sich aus Punkt 2: Ein gehaltenes oder mehrfach gedrücktes
 * Alt + M feuerte den Tastatur-Handler mehrmals, BEVOR der Server auf den
 * ersten Aufruf geantwortet und `meinMatchId` gesetzt hatte - jeder Aufruf
 * legte ein EIGENES `tt_matches` an. Punkt 1 und 4 sind dieselbe Sache aus
 * zwei Blickwinkeln: eine Einladung, der niemand folgt, soll nicht mehr zehn
 * Minuten lang einen Platz in der Liste belegen.
 *
 * ── Was hier geprüft wird ───────────────────────────────────────────────────
 *  (a) Zwei Alt+M-artige Aufrufe im selben Wimpernschlag legen nur EIN Match an.
 *  (b) Steht die Gastgeberin oder der Gastgeber 30 Sekunden lang allein in der
 *      Einladung (niemand ist „Bin dabei" gefolgt), sagt das eigene Gerät
 *      selbst ab - der Schalter ist danach wieder frei.
 *  (c) Ist wenigstens ein Kind beigetreten, bleibt die Einladung auch nach
 *      30 Sekunden offen - die Frist gilt nur für „niemand ist beigetreten".
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";

// `speakUi` wird ersetzt, damit die Ansage beobachtbar ist (der Rest des
// Moduls bleibt echt - dieselbe Bauart wie `typing-klassenmatch-hinweis`).
vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn() };
});

import { _resetTypingBackend } from "@/lib/typing/backend";
import { _mockMatchesZuruecksetzen, mockListeMatches, stoppBots } from "@/lib/typing/matchMock";
import { MATCH_EINLADUNG_FRIST_MS } from "@/lib/typing/klassenmatch";
import { useKlassenmatch } from "@/lib/typing/useKlassenmatch";
import { speakUi } from "@/lib/typing/voice";
import type { TypingAccount } from "@/lib/typing/account";

function kind(id: string, name: string): TypingAccount {
  return { id, role: "schueler", name, classCode: "K1", createdAt: 1 };
}
const SARAH = kind("sarah", "Sarah");
const FRANZ = kind("franz", "Franz");

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

describe("(a) Kein doppeltes Anlegen bei mehrfachem Alt + M", () => {
  it("★★★★★ zwei Aufrufe im selben Wimpernschlag legen nur EIN Match an", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);

    await act(async () => {
      // Zwei „Tastendrücke" hintereinander, bevor der Server geantwortet hat -
      // genau das, was ein gehaltenes oder hastig doppelt gedrücktes Alt + M
      // am Fenster auslöst.
      sarah.result.current.einladen();
      sarah.result.current.einladen();
    });
    await warte(200);

    expect(mockListeMatches("K1").length).toBe(1);
    expect(sarah.result.current.binGastgeber).toBe(true);
  });

  it("★★★ nach der Antwort des Servers legt ein NEUER Aufruf trotzdem kein zweites an (das Kind steckt jetzt selbst drin)", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(200);
    expect(mockListeMatches("K1").length).toBe(1);

    // Ein weiterer Druck, nachdem der Server längst geantwortet hat: „erlaubt"
    // ist jetzt false (das Kind ist selbst gebunden) - `einladen` tut nichts.
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(200);
    expect(mockListeMatches("K1").length).toBe(1);
  });
});

describe("(b) Allein nach 30 Sekunden: die Einladung sagt sich selbst ab", () => {
  it("★★★★★ niemand folgt - das Gerät der Gastgeberin sagt nach 30 s selbst ab", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);

    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(100);
    expect(sarah.result.current.binGastgeber).toBe(true);
    expect(sarah.result.current.phase).toBe("einladung");
    // ★ Der Mock lässt sonst nach gut einer Sekunde „Mia" beitreten
    // (`matchMock.ts`, für die Starten-Wächter da) - für DIESEN Wächter (echt
    // niemand folgt) werden die Bots hier ausdrücklich angehalten.
    stoppBots(sarah.result.current.meinMatch!.id);

    // Kurz vor der Frist steht die Einladung noch.
    await warte(MATCH_EINLADUNG_FRIST_MS - 500);
    expect(sarah.result.current.meinMatch).not.toBeNull();

    // Und direkt danach ist sie weg - ohne dass „Absagen" gedrückt wurde.
    await warte(1_000);
    expect(sarah.result.current.meinMatch).toBeNull();
    expect(sarah.result.current.phase).toBe("keine");
    expect(sarah.result.current.erlaubt).toBe(true);
    expect(sarah.result.current.meldung).toMatch(/zurückgezogen/);
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith(
      expect.stringContaining("zurückgezogen"),
    );

    // Und am Server steht das Match auf „abgebrochen", nicht mehr offen.
    const [match] = mockListeMatches("K1");
    expect(match.status).toBe("abgebrochen");
  });

  it("★★★ ist wenigstens ein Kind beigetreten, bleibt die Einladung auch nach 30 s offen", async () => {
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    await warte(100);

    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(200);
    const einladung = franz.result.current.einladung;
    expect(einladung).not.toBeNull();
    await act(async () => {
      franz.result.current.beitreten(einladung!.id);
    });
    await warte(200);

    // 30 Sekunden und mehr vergehen - Franz ist dabei, die Einladung bleibt.
    await warte(MATCH_EINLADUNG_FRIST_MS + 5_000);
    expect(sarah.result.current.meinMatch).not.toBeNull();
    expect(sarah.result.current.phase).toBe("einladung");
    expect(sarah.result.current.kannStarten).toBe(true);
  });
});
