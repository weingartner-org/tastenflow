/**
 * ★★★ WÄCHTER: Die Tippchallenge kommt bei allen Kindern SCHNELL - und die
 * Lehrkraft sieht, wer bereit ist (10.09.2026, Johannes).
 *
 * Befund davor: Das Gerät eines Kindes fragte die Klasse nur alle 45 Sekunden
 * nach. Eine Lehrkraft, die „Jetzt starten" drückte, sah ihre Klasse bis zu
 * einer Dreiviertelminute warten, im Hintergrund-Tab länger.
 *
 *  1. Realtime: Das Gerät beobachtet seine Klasse und übernimmt den Plan bei
 *     jeder Änderung - ohne auf den Takt zu warten.
 *  2. Sofort nachfragen, wenn der Tab wieder sichtbar wird, das Fenster den
 *     Fokus bekommt oder das Netz zurückkommt - gedrosselt.
 *  3. „Bereit: 12 von 14 - noch nicht: Said, Jano" bei der Lehrkraft, ohne
 *     Live-Region für jede Änderung.
 *
 * ⚠️ WAS DIESE TESTS NICHT BEWEISEN: dass die Ereignisse durch den Proxy
 * kommen. Das ist am 10.09.2026 am echten Server gemessen worden
 * (`PB_CONNECT` sofort, `x-accel-buffering: no`, ohne Kompression) und gegen
 * einen lokalen PocketBase durchgespielt (Plan beim Kind nach 0,44 s,
 * Bereit-Meldung bei der Lehrkraft nach 6 ms, Zeit vom Server gesetzt).
 *
 * WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]): (a) misst, dass der Plan OHNE
 * zweite Nachfrage erscheint - fällt die Beobachtung weg, bleibt „kein Plan"
 * stehen. (b) zählt Nachfragen - fehlt die Drossel, sind es zu viele; fehlt
 * der Horcher, zu wenige.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TypingAccount, TypingClass } from "@/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { NACHFRAGE_SOFORT_MIN_MS, useSchreibprobe } from "@/lib/typing/useSchreibprobe";
import { SchreibprobeKasten } from "@/components/lernwerkstatt/klasse/SchreibprobeKasten";
import {
  BEREIT_FRISCH_MS,
  bereitMeldungAus,
  bereitSatz,
  bereitschaft,
  type SchreibprobePlan,
} from "@/lib/typing/schreibprobe";

const WURZEL = resolve(__dirname, "..");
const lies = (p: string) => readFileSync(resolve(WURZEL, p), "utf8");

const KIND: TypingAccount = {
  id: "kind-1",
  role: "schueler",
  name: "Mia",
  classCode: "4A",
  createdAt: 0,
};

function plan(id: string, startInMs = 0): SchreibprobePlan {
  const jetzt = Date.now();
  return {
    id,
    niveau: "start",
    startMs: jetzt + startInMs,
    dauerMin: 5,
    textNr: 0,
    startZeile: 0,
    zuschlagProzent: 0,
    angelegtMs: jetzt,
  };
}

function klasse(settings?: unknown, code = "4A"): TypingClass {
  return { code, name: "4a", teacherId: "t1", createdAt: 0, settings } as TypingClass;
}

/** Ein Kind-Bildschirm, der nur zeigt, was der Haken weiss. */
function Probe() {
  const s = useSchreibprobe(KIND);
  return <p data-testid="plan">{s.plan?.id ?? "kein Plan"}</p>;
}
const planText = () => screen.getByTestId("plan").textContent;

let be: ReturnType<typeof typingBackend>;
beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
  be = typingBackend();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// ── 1. Realtime ─────────────────────────────────────────────────────────────

describe("1 · Das Gerät des Kindes beobachtet seine Klasse", () => {
  it("★★★ der Plan erscheint mit der Meldung - ohne zweite Nachfrage, ohne 45 Sekunden", async () => {
    const getClass = vi.spyOn(be, "getClass").mockResolvedValue(klasse());
    let melde: ((c: TypingClass) => void) | null = null;
    const abmelden = vi.fn();
    const beobachte = vi.spyOn(be, "beobachteKlasse").mockImplementation((_code, cb) => {
      melde = cb;
      return abmelden;
    });
    const { unmount } = render(<Probe />);
    await waitFor(() => expect(planText()).toBe("kein Plan"));
    expect(beobachte).toHaveBeenCalledWith("4A", expect.any(Function));

    act(() => melde!(klasse({ schreibprobe: plan("sp-jetzt") })));
    expect(planText()).toBe("sp-jetzt");
    expect(getClass).toHaveBeenCalledTimes(1);

    // Eine Meldung für eine ANDERE Klasse ändert nichts.
    act(() => melde!(klasse({ schreibprobe: plan("sp-fremd") }, "9Z")));
    expect(planText()).toBe("sp-jetzt");

    // Beim Verlassen wird abgemeldet.
    unmount();
    expect(abmelden).toHaveBeenCalledTimes(1);
  });

  it("die lokale Fassung beobachtet nichts - und bricht nichts", () => {
    const aus = be.beobachteKlasse("4A", () => {});
    expect(typeof aus).toBe("function");
    expect(() => aus()).not.toThrow();
  });
});

// ── 2. Sofort nachfragen ────────────────────────────────────────────────────

describe("2 · Sofort nachfragen: sichtbar, Fokus, Netz zurück - gedrosselt", () => {
  it("★★ ein Mal je Anlass, nicht zweimal im selben Augenblick", async () => {
    const start = Date.now();
    let versatz = 0;
    vi.spyOn(Date, "now").mockImplementation(() => start + versatz);
    const getClass = vi.spyOn(be, "getClass").mockResolvedValue(klasse());
    vi.spyOn(be, "beobachteKlasse").mockReturnValue(() => {});
    render(<Probe />);
    await waitFor(() => expect(getClass).toHaveBeenCalledTimes(1));

    // Gleich nach dem Öffnen: gedrosselt, keine zweite Nachfrage.
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await new Promise((r) => setTimeout(r, 1_200));
    expect(getClass).toHaveBeenCalledTimes(1);

    // Nach der Drossel: Tab wieder sichtbar ⇒ nachfragen (gestreut, < 1 s).
    versatz = NACHFRAGE_SOFORT_MIN_MS + 1;
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await waitFor(() => expect(getClass).toHaveBeenCalledTimes(2), { timeout: 2_000 });

    // Fokus im selben Augenblick: KEIN zweites Mal.
    act(() => {
      window.dispatchEvent(new Event("focus"));
    });
    await new Promise((r) => setTimeout(r, 1_200));
    expect(getClass).toHaveBeenCalledTimes(2);

    // Das Netz kommt zurück, später: wieder nachfragen.
    versatz += NACHFRAGE_SOFORT_MIN_MS + 1;
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    await waitFor(() => expect(getClass).toHaveBeenCalledTimes(3), { timeout: 2_000 });
  });
});

// ── 3. Bereit ───────────────────────────────────────────────────────────────

describe("3a · Das Gerät meldet „bereit“ - sparsam", () => {
  it("mit Plan: sofort gemeldet, einmal - nicht bei jeder Darstellung", async () => {
    vi.spyOn(be, "getClass").mockResolvedValue(klasse({ schreibprobe: plan("sp-b") }));
    vi.spyOn(be, "beobachteKlasse").mockReturnValue(() => {});
    const melde = vi.spyOn(be, "meldeProbeBereit").mockResolvedValue(true);
    render(<Probe />);
    await waitFor(() => expect(melde).toHaveBeenCalledWith("kind-1", "sp-b"));
    await new Promise((r) => setTimeout(r, 300));
    expect(melde).toHaveBeenCalledTimes(1);
  });

  it("ohne Plan und bei einer längst vorbei Challenge: keine Meldung", async () => {
    vi.spyOn(be, "beobachteKlasse").mockReturnValue(() => {});
    const melde = vi.spyOn(be, "meldeProbeBereit").mockResolvedValue(true);
    const getClass = vi.spyOn(be, "getClass").mockResolvedValue(klasse());
    render(<Probe />);
    await waitFor(() => expect(planText()).toBe("kein Plan"));
    cleanup();
    getClass.mockResolvedValue(klasse({ schreibprobe: plan("sp-alt", -3 * 24 * 3600_000) }));
    render(<Probe />);
    await waitFor(() => expect(planText()).toBe("sp-alt"));
    await new Promise((r) => setTimeout(r, 300));
    expect(melde).not.toHaveBeenCalled();
  });

  it("am Server: das Feld ist vom Kind schreibbar, die Zeit setzt der Server", () => {
    expect(lies("pocketbase/setup.mjs")).toContain(
      '{ name: "probeBereit", type: "json", maxSize: 200 }',
    );
    const waechter = lies("pocketbase/pb_hooks/tt_pupils_field_guard.pb.js");
    const locked = waechter.slice(waechter.indexOf("const LOCKED = ["), waechter.indexOf("];"));
    expect(locked.length, "Gegenprobe: die LOCKED-Liste wurde gefunden").toBeGreaterThan(100);
    expect(locked).not.toContain("probeBereit");
    expect(waechter).toContain("{ probeId: id, ms: Date.now() }");
  });
});

describe("3b · Wer ist bereit - die Rechnung", () => {
  it("frisch, veraltet, andere Challenge, abgegeben - und die Reihenfolge der Klassenliste", () => {
    const jetzt = 10_000_000;
    const kinder = [
      { id: "s", name: "Said" },
      { id: "m", name: "Mia", probeBereit: { probeId: "p1", ms: jetzt - 5_000 } },
      { id: "j", name: "Jano", probeBereit: { probeId: "p0", ms: jetzt } },
      { id: "a", name: "Alma", probeBereit: { probeId: "p1", ms: jetzt - BEREIT_FRISCH_MS - 1 } },
      { id: "r", name: "Runa" },
    ];
    const b = bereitschaft(kinder, "p1", new Set(["r"]), jetzt);
    expect(b).toEqual({ bereit: ["Mia", "Runa"], nochNicht: ["Said", "Jano", "Alma"] });
    expect(bereitSatz(b)).toBe("Bereit: 2 von 5 - noch nicht: Said, Jano, Alma");
    expect(bereitSatz({ bereit: ["Mia", "Runa"], nochNicht: [] })).toBe("Bereit: 2 von 2");
  });

  it("die Meldung vom Server wird wehrhaft gelesen", () => {
    expect(bereitMeldungAus({ probeId: "p1", ms: 5 })).toEqual({ probeId: "p1", ms: 5 });
    for (const roh of [null, "p1", { probeId: "", ms: 5 }, { probeId: "p1" }, { probeId: "p1", ms: -1 }])
      expect(bereitMeldungAus(roh), JSON.stringify(roh)).toBeNull();
  });
});

describe("3c · Die Lehrkraft sieht „Bereit: 1 von 3 - noch nicht: Said, Jano“", () => {
  /** Der Textknoten mit dem Satz - um seine Umgebung zu prüfen. */
  function bereitKnoten(): Element | undefined {
    return [...document.querySelectorAll("*")].find((el) =>
      [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").startsWith("Bereit:")),
    );
  }

  it("★★★ zählt, nennt die Namen, aktualisiert per Beobachtung - und meldet NUR „alle bereit“", async () => {
    const jetzt = Date.now();
    const p = plan("sp-k");
    const kinder = [
      { id: "k-said", role: "schueler", name: "Said", classCode: "4A", createdAt: 0 },
      { id: "k-mia", role: "schueler", name: "Mia", classCode: "4A", createdAt: 0, probeBereit: { probeId: "sp-k", ms: jetzt - 5_000 } },
      { id: "k-jano", role: "schueler", name: "Jano", classCode: "4A", createdAt: 0, probeBereit: { probeId: "sp-alt", ms: jetzt } },
    ] as TypingAccount[];
    let meldeKind: ((k: TypingAccount) => void) | null = null;
    const beobachte = vi.spyOn(be, "beobachteKinder").mockImplementation((_code, cb) => {
      meldeKind = cb;
      return () => {};
    });
    vi.spyOn(be, "listPupils").mockResolvedValue([]);
    render(<SchreibprobeKasten cls={klasse({ schreibprobe: p })} pupils={kinder} onClassChange={() => {}} />);

    await waitFor(() =>
      expect(document.body.textContent).toContain("Bereit: 1 von 3 - noch nicht: Said, Jano"),
    );
    expect(beobachte).toHaveBeenCalledWith("4A", expect.any(Function));
    // ⚠️ Keine Live-Region: jede Änderung wäre eine Blitzmeldung auf der
    // Braillezeile ([[reference_live_region_ist_braille_blitzmeldung]]).
    expect(bereitKnoten()?.closest("[aria-live]")).toBeNull();
    const status = screen.getByRole("status");
    expect(status.textContent).not.toContain("bereit");

    act(() => meldeKind!({ ...kinder[0], probeBereit: { probeId: "sp-k", ms: Date.now() } }));
    await waitFor(() =>
      expect(document.body.textContent).toContain("Bereit: 2 von 3 - noch nicht: Jano"),
    );
    expect(status.textContent).not.toContain("bereit");

    act(() => meldeKind!({ ...kinder[2], probeBereit: { probeId: "sp-k", ms: Date.now() } }));
    await waitFor(() => expect(document.body.textContent).toContain("Bereit: 3 von 3"));
    await waitFor(() => expect(status.textContent).toBe("Alle 3 Kinder sind bereit."));
  });

  it("★★ nach dem Einstiegsfenster steht „Bereit“ nicht mehr da - beginnen kann dann niemand mehr", async () => {
    // Gestartet wird sofort (Johannes 10.09.2026). „Bereit" beantwortet darum
    // nur im Einstiegsfenster eine Frage; danach steht die Abgabeliste allein.
    vi.spyOn(be, "beobachteKinder").mockReturnValue(() => {});
    vi.spyOn(be, "listPupils").mockResolvedValue([]);
    vi.spyOn(be, "leseKlassenProben").mockResolvedValue({});
    const kinder = [{ ...KIND, probeBereit: { probeId: "sp-spaet", ms: Date.now() } }];
    // Vor 11 Minuten gestartet: Fenster (10 min) zu, Prüfungszeit (5 min) läuft noch.
    render(
      <SchreibprobeKasten
        cls={klasse({ schreibprobe: plan("sp-spaet", -11 * 60_000) })}
        pupils={kinder}
        onClassChange={() => {}}
      />,
    );
    await waitFor(() => expect(document.body.textContent).toContain("Abgegeben: 0 von 1"));
    expect(document.body.textContent).not.toContain("Bereit:");
    cleanup();
    // Gegenprobe: dasselbe Kind, die Challenge eben gestartet ⇒ die Zeile steht da.
    render(
      <SchreibprobeKasten
        cls={klasse({ schreibprobe: plan("sp-spaet") })}
        pupils={kinder}
        onClassChange={() => {}}
      />,
    );
    await waitFor(() => expect(document.body.textContent).toContain("Bereit: 1 von 1"));
  });

  it("ohne gestartete Challenge steht nichts von „Bereit“ da - und niemand wird beobachtet", async () => {
    const beobachte = vi.spyOn(be, "beobachteKinder");
    render(<SchreibprobeKasten cls={klasse()} pupils={[KIND]} onClassChange={() => {}} />);
    await screen.findByLabelText("Tastaturniveau");
    expect(document.body.textContent).not.toContain("Bereit:");
    expect(beobachte).not.toHaveBeenCalled();
  });
});
