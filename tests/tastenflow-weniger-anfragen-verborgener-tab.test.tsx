/**
 * ★★ Im verborgenen Tab ruht der Nachfrage-Takt (28.09.2026, Serverlast -
 * gemessen, 5 Tage: 62.607 Lesungen `tt_classes`, 17.947 `tt_matches`).
 *
 * Zwei Takte sind betroffen: `useKlassenBeobachtung` (Klasse, Klassenmatch,
 * eigene Übung) und `useSchreibprobe` (die Tippchallenge des Kindes). Bewiesen
 * wird für beide:
 *  1. SICHTBAR fragt der Takt genau so oft wie bisher.
 *  2. VERBORGEN fragt er nie.
 *  3. Kommt der Tab nach vorn, wird einmal nachgefragt (Sofort-Nachfrage,
 *     gestreut unter einer Sekunde) - und danach läuft der Takt wieder.
 *  4. ★★★ Die Startmeldung der Tippchallenge: Startet die Lehrkraft, während
 *     der Tab verborgen ist UND das Realtime-Abo gerissen ist, sieht das Kind
 *     den Plan binnen einer Sekunde, nachdem es den Tab wieder nach vorn holt.
 *
 * Gegenprobe (28.09.2026): mit dem alten Takt (`setInterval(hole, …)`) sind
 * drei von vier rot - die beiden „verborgen"-Tests und der Start-Test (er
 * zählt die EINE Nachfrage beim Zurückkommen; dass der Plan dann da ist, gilt
 * auf beiden Ständen). Der Test „sichtbares Kind" ist mit Absicht auf beiden
 * grün: Er sichert, dass sich für ein sichtbares Kind nichts ändert.
 */
import { act, cleanup, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TypingAccount, TypingClass } from "@/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { useSchreibprobe } from "@/lib/typing/useSchreibprobe";
import { useKlassenBeobachtung } from "@/lib/typing/useKlassenBeobachtung";
import type { SchreibprobePlan } from "@/lib/typing/schreibprobe";

let sichtbarkeit: DocumentVisibilityState = "visible";
function zeige(z: DocumentVisibilityState) {
  sichtbarkeit = z;
  document.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  _resetTypingBackend();
  sichtbarkeit = "visible";
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => sichtbarkeit,
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const warte = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

describe("useKlassenBeobachtung: Takt nur bei sichtbarem Fenster", () => {
  const TAKT = 45_000;

  it("sichtbar wie bisher, verborgen nie, zurück: eine Nachfrage, dann wieder im Takt", async () => {
    const hole = vi.fn(async () => 1);
    renderHook(() => useKlassenBeobachtung<number>({ aktiv: true, hole, taktMs: TAKT }));
    await warte(0);
    expect(hole).toHaveBeenCalledTimes(1); // Aufbau

    await warte(3 * TAKT);
    expect(hole, "Sichtbar muss der Takt weiterlaufen").toHaveBeenCalledTimes(4);

    act(() => zeige("hidden"));
    await warte(10 * TAKT);
    expect(hole, "Im verborgenen Tab wurde nachgefragt").toHaveBeenCalledTimes(4);

    act(() => zeige("visible"));
    await warte(1_000); // Streuung der Sofort-Nachfrage
    expect(hole).toHaveBeenCalledTimes(5);
    await warte(TAKT);
    expect(hole).toHaveBeenCalledTimes(6);
  });
});

// ── Die Tippchallenge des Kindes ────────────────────────────────────────────

const KIND: TypingAccount = {
  id: "kind-1",
  role: "schueler",
  name: "Mia",
  classCode: "4A",
  createdAt: 0,
};
function klasse(settings?: unknown): TypingClass {
  return { code: "4A", name: "4a", teacherId: "t1", createdAt: 0, settings } as TypingClass;
}
function plan(id: string): SchreibprobePlan {
  const jetzt = Date.now();
  return {
    id,
    niveau: "start",
    startMs: jetzt,
    dauerMin: 5,
    textNr: 0,
    startZeile: 0,
    zuschlagProzent: 0,
    angelegtMs: jetzt,
  };
}
function Probe() {
  const s = useSchreibprobe(KIND);
  return <p data-testid="plan">{s.plan?.id ?? "kein Plan"}</p>;
}
const planText = () => screen.getByTestId("plan").textContent;

describe("useSchreibprobe: Takt nur bei sichtbarem Fenster", () => {
  const TAKT = 45_000;

  it("sichtbar wie bisher, verborgen nie", async () => {
    const be = typingBackend();
    const getClass = vi.spyOn(be, "getClass").mockResolvedValue(klasse());
    vi.spyOn(be, "beobachteKlasse").mockReturnValue(() => {});
    render(<Probe />);
    await warte(0);
    expect(getClass).toHaveBeenCalledTimes(1);
    await warte(2 * TAKT);
    expect(getClass).toHaveBeenCalledTimes(3);
    act(() => zeige("hidden"));
    await warte(10 * TAKT);
    expect(getClass, "Im verborgenen Tab wurde nachgefragt").toHaveBeenCalledTimes(3);
  });

  it("★★★ Start im verborgenen Tab, Realtime gerissen: nach vorn geholt, ist der Plan binnen 1 s da", async () => {
    const be = typingBackend();
    let serverKlasse = klasse();
    const getClass = vi.spyOn(be, "getClass").mockImplementation(async () => serverKlasse);
    // Das Realtime-Abo ist gerissen: es meldet nie etwas.
    vi.spyOn(be, "beobachteKlasse").mockReturnValue(() => {});
    render(<Probe />);
    await warte(0);
    expect(planText()).toBe("kein Plan");

    act(() => zeige("hidden"));
    await warte(TAKT + 5_000);
    // Die Lehrkraft drückt „Jetzt starten", während der Tab verborgen ist.
    serverKlasse = klasse({ schreibprobe: plan("sp-start") });
    await warte(2 * TAKT);
    expect(planText()).toBe("kein Plan"); // niemand sieht hin
    const vorher = getClass.mock.calls.length;

    act(() => zeige("visible"));
    await warte(1_000);
    expect(getClass.mock.calls.length).toBe(vorher + 1);
    expect(planText()).toBe("sp-start");
  });

  it("sichtbares Kind, Realtime gerissen: der Takt bringt den Start wie bisher spätestens nach 45 s", async () => {
    const be = typingBackend();
    let serverKlasse = klasse();
    vi.spyOn(be, "getClass").mockImplementation(async () => serverKlasse);
    vi.spyOn(be, "beobachteKlasse").mockReturnValue(() => {});
    render(<Probe />);
    await warte(0);
    serverKlasse = klasse({ schreibprobe: plan("sp-sichtbar") });
    await warte(TAKT);
    expect(planText()).toBe("sp-sichtbar");
  });
});
