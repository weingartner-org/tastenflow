/**
 * ★★★ Das Tippchallenge-Ergebnis geht ohne Netz nicht mehr verloren
 * (27.09.2026, `BEFUND-2026-09-27-DATENVERBRAUCH-UND-NETZABBRUCH.md` §3.3).
 *
 * Vorher: „abgegeben" im Gerät, EIN Sendeversuch, jeder Fehler geschluckt -
 * kein Netz beim Abgeben ⇒ Ergebnis weg, die Lehrkraft sah „nicht angetreten".
 *
 * Geprüft wird:
 *  1. die Schlange: vormerken → nachsenden → gelöscht; kein Doppel; übersteht
 *     ein Neuladen; Reihenfolge; „abgewiesen" nur beim Start/online nochmal;
 *     zwei gleichzeitige Durchgänge senden nicht doppelt,
 *  2. der Server-Weg (`PocketBaseTypingBackend.speichereProbenergebnis`)
 *     meldet Erfolg/Fehler, statt zu schlucken - und ein zweiter Versuch nach
 *     verlorener Antwort legt KEINE zweite Zeile an,
 *  3. erster Versand scheitert (kein Netz) → `online` → genau EIN Ergebnis,
 *  4. der ruhige Satz auf dem Ergebnis-Bildschirm - ohne Live-Bereich.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, renderHook, screen, waitFor } from "@testing-library/react";
import { ClientResponseError } from "pocketbase";

vi.mock("@/lib/typing/sound", () => ({
  playErrorSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playKeyTick: vi.fn(),
  isKeyTickOn: () => false,
  isSoundMuted: () => true,
}));

import {
  _nachsendenZuruecksetzen,
  ausstehende,
  istAusstehend,
  merkeVor,
  sendeAusstehende,
  wartetImTakt,
  type Ausstehend,
  type SendeAntwort,
} from "@/lib/typing/nachsenden";
import { absenderFuer, nachsendenJetzt, useNachsenden } from "@/lib/typing/useNachsenden";
import { PocketBaseTypingBackend } from "@/lib/typing/pbBackend";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import {
  fuersSpeichern,
  werteAus,
  type Probenergebnis,
} from "@/lib/typing/schreibprobeAuswertung";
import type { TypingAccount } from "@/lib/typing/account";
import { SchreibprobeLauf } from "@/components/typing/SchreibprobeLauf";
import { LEERER_STAND, type SchreibprobePlan } from "@/lib/typing/schreibprobe";
import { LEERER_FORTSCHRITT, type SchreibprobeStand } from "@/lib/typing/useSchreibprobe";

/** So sendet die App, wenn das Netz zurückkommt (`online`) oder beim Start. */
const ONLINE = { sofort: true, auchAbgewiesene: true } as const;

const KIND: TypingAccount = {
  id: "kind-1",
  role: "schueler",
  name: "Ferdi",
  classCode: "K1",
  createdAt: 1,
};

function ergebnis(probeId = "sp-1"): Probenergebnis {
  const beginn = new Date(2026, 8, 27, 10, 4).getTime();
  return werteAus({
    probeId,
    niveau: "buchstaben",
    textNr: 0,
    textTitel: "Der Igel",
    beginnMs: beginn,
    endeMs: beginn + 5 * 60_000,
    zeitMs: 5 * 60_000,
    zuschlagProzent: 0,
    wartezeitMs: 0,
    zeichen: 900,
    fehler: 12,
    zeilen: 20,
    schreibMs: 5 * 60_000,
    anschlaege: [],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: false,
  });
}

beforeEach(() => {
  localStorage.clear();
  _nachsendenZuruecksetzen();
  _resetTypingBackend();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// ── 1. Die Schlange ─────────────────────────────────────────────────────────

describe("Warteschlange im Gerät", () => {
  it("vormerken → nachsenden → gelöscht", async () => {
    expect(merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis()))).toBe(true);
    expect(istAusstehend(KIND.id, "probe", "sp-1")).toBe(true);

    const gesendet: string[] = [];
    await sendeAusstehende(KIND.id, async ([e]) => {
      gesendet.push(e.schluessel);
      return "ok";
    });
    expect(gesendet).toEqual(["sp-1"]);
    expect(ausstehende(KIND.id)).toEqual([]);
    expect(localStorage.getItem(`tastenflow:nachsenden:v2:${KIND.id}`)).toBeNull();
  });

  it("kein Doppel: dieselbe Probe zweimal vorgemerkt steht einmal da - die ERSTE bleibt", () => {
    const erste = fuersSpeichern(ergebnis());
    merkeVor(KIND.id, "probe", "sp-1", erste);
    merkeVor(KIND.id, "probe", "sp-1", { ...erste, zeichen: 9999 });
    const liste = ausstehende(KIND.id);
    expect(liste).toHaveLength(1);
    expect((liste[0].daten as Probenergebnis).zeichen).toBe(erste.zeichen);
  });

  it("übersteht ein Neuladen (Modul frisch geladen, Gerätespeicher bleibt)", async () => {
    merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis()));
    vi.resetModules();
    const frisch = await import("@/lib/typing/nachsenden");
    expect(frisch.ausstehende(KIND.id).map((e) => e.schluessel)).toEqual(["sp-1"]);
    // Und nur für DIESES Konto - ein anderes Kind am selben Gerät sieht nichts.
    expect(frisch.ausstehende("anderes-kind")).toEqual([]);
  });

  it("kein Netz: bleibt liegen, der Durchgang hört auf, die Reihenfolge bleibt", async () => {
    merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis("sp-1")));
    merkeVor(KIND.id, "probe", "sp-2", fuersSpeichern(ergebnis("sp-2")));
    const versucht: string[] = [];
    await sendeAusstehende(KIND.id, async ([e]) => {
      versucht.push(e.schluessel);
      return "netz";
    });
    expect(versucht).toEqual(["sp-1"]); // nichts übersprungen
    expect(ausstehende(KIND.id).map((e) => e.schluessel)).toEqual(["sp-1", "sp-2"]);
    expect(wartetImTakt(KIND.id)).toBe(true);
  });

  it("ein Absender, der wirft, zählt wie „kein Netz“ - nichts geht verloren", async () => {
    merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis()));
    await sendeAusstehende(KIND.id, async () => {
      throw new Error("Failed to fetch");
    });
    expect(istAusstehend(KIND.id, "probe", "sp-1")).toBe(true);
  });

  it("abgewiesen: bleibt, wird im Takt übersprungen, beim Start/online wieder versucht", async () => {
    merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis()));
    let antwort: SendeAntwort = "abgewiesen";
    const absender = vi.fn(async () => antwort);
    await sendeAusstehende(KIND.id, absender, { auchAbgewiesene: true });
    expect(ausstehende(KIND.id)[0].abgewiesen).toBe(1);
    expect(wartetImTakt(KIND.id)).toBe(false);

    await sendeAusstehende(KIND.id, absender); // Takt
    expect(absender).toHaveBeenCalledTimes(1);

    antwort = "ok";
    await sendeAusstehende(KIND.id, absender, { auchAbgewiesene: true }); // Start
    expect(absender).toHaveBeenCalledTimes(2);
    expect(ausstehende(KIND.id)).toEqual([]);
  });

  it("zwei gleichzeitige Durchgänge senden denselben Eintrag nicht doppelt", async () => {
    merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis()));
    const gesendet: string[] = [];
    const absender = async ([e]: Ausstehend[]): Promise<SendeAntwort> => {
      gesendet.push(e.schluessel);
      await new Promise((r) => setTimeout(r, 5));
      return "ok";
    };
    await Promise.all([
      sendeAusstehende(KIND.id, absender),
      sendeAusstehende(KIND.id, absender),
    ]);
    expect(gesendet).toEqual(["sp-1"]);
  });

  it("ein unlesbarer Eintrag wird verworfen - aber nicht still", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem(
      `tastenflow:nachsenden:v1:${KIND.id}`,
      JSON.stringify([{ art: "probe" }, { art: "probe", schluessel: "sp-1", seitMs: 1, daten: {} }]),
    );
    expect(ausstehende(KIND.id).map((e) => e.schluessel)).toEqual(["sp-1"]);
    expect(warn).toHaveBeenCalled();
  });
});

// ── 2. Der Server-Weg meldet, statt zu schlucken ────────────────────────────

/**
 * Ein PocketBase-Ersatz für `tt_schreibproben` mit dem UNIQUE-Index
 * (pupilUid, probeId) - und einem Netz, das man ab- und anschalten kann.
 * `antwortVerloren`: die Zeile kommt an, die ANTWORT nicht (der gemeinste Fall).
 */
function fakeServer() {
  const zeilen: { pupilUid: string; probeId: string }[] = [];
  const zustand = { netz: true, antwortVerloren: false, abweisen: false };
  const netzfehler = () => new ClientResponseError({ status: 0, isAbort: false });
  const pb = {
    authStore: { record: { classCode: "K1", teacherUid: "t1" }, isValid: true },
    filter: (_s: string, p: Record<string, string>) => JSON.stringify(p),
    collection(name: string) {
      if (name !== "tt_schreibproben") throw new Error(`unerwartet: ${name}`);
      return {
        async create(body: { pupilUid: string; probeId: string }) {
          if (!zustand.netz) throw netzfehler();
          if (zustand.abweisen)
            throw new ClientResponseError({ status: 400, response: { message: "Failed to create record." } });
          if (zeilen.some((z) => z.pupilUid === body.pupilUid && z.probeId === body.probeId))
            throw new ClientResponseError({
              status: 400,
              response: { data: { probeId: { code: "validation_not_unique" } } },
            });
          zeilen.push({ pupilUid: body.pupilUid, probeId: body.probeId });
          if (zustand.antwortVerloren) throw netzfehler();
          return { id: `r${zeilen.length}`, ...body };
        },
        async getFirstListItem(filter: string) {
          if (!zustand.netz) throw netzfehler();
          const p = JSON.parse(filter) as { p: string; id: string };
          const z = zeilen.find((x) => x.pupilUid === p.p && x.probeId === p.id);
          if (!z) throw new ClientResponseError({ status: 404, response: {} });
          return { id: "r", ...z };
        },
      };
    },
  };
  const backend = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
  (backend as unknown as { pb: unknown }).pb = pb;
  return { backend, zeilen, zustand };
}

describe("speichereProbenergebnis (Server) sagt, was geschehen ist", () => {
  it("gespeichert / kein Netz / lag schon / abgewiesen", async () => {
    const s = fakeServer();
    s.zustand.netz = false;
    expect(await s.backend.speichereProbenergebnis(KIND, ergebnis())).toBe("netz");
    expect(s.zeilen).toHaveLength(0);

    s.zustand.netz = true;
    expect(await s.backend.speichereProbenergebnis(KIND, ergebnis())).toBe("gespeichert");
    expect(await s.backend.speichereProbenergebnis(KIND, ergebnis())).toBe("lag-schon");
    expect(s.zeilen).toHaveLength(1);

    s.zustand.abweisen = true;
    expect(await s.backend.speichereProbenergebnis(KIND, ergebnis("sp-neu"))).toBe("abgewiesen");
  });

  it("Antwort verloren, Zeile angekommen: der zweite Versuch legt KEINE zweite an", async () => {
    const s = fakeServer();
    // Der Weg der App (`typingBackend()`) geht an den Server-Ersatz.
    vi.spyOn(typingBackend(), "speichereProbenergebnis").mockImplementation((p, e) =>
      s.backend.speichereProbenergebnis(p, e),
    );
    s.zustand.antwortVerloren = true;
    merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis()));
    await nachsendenJetzt(KIND);
    expect(istAusstehend(KIND.id, "probe", "sp-1")).toBe(true); // Gerät weiss es nicht
    expect(s.zeilen).toHaveLength(1);

    s.zustand.antwortVerloren = false;
    await nachsendenJetzt(KIND, ONLINE);
    expect(istAusstehend(KIND.id, "probe", "sp-1")).toBe(false);
    expect(s.zeilen).toHaveLength(1);
  });
});

// ── 3. Erster Versand scheitert, `online` holt es nach ─────────────────────

describe("kein Netz beim Abgeben, danach wieder Netz", () => {
  it("genau EIN Ergebnis am Server, die Schlange ist leer", async () => {
    const b = typingBackend(); // lokales Backend (Mock-Betrieb der Tests)
    const echt = b.speichereProbenergebnis.bind(b);
    let netz = false;
    const spion = vi
      .spyOn(b, "speichereProbenergebnis")
      .mockImplementation(async (p, e) => (netz ? echt(p, e) : "netz"));

    // Abgeben wie `gibAb`: erst ins Gerät, dann senden.
    merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis()));
    await nachsendenJetzt(KIND, { auchAbgewiesene: true });
    expect(istAusstehend(KIND.id, "probe", "sp-1")).toBe(true);
    expect(await b.leseProbenergebnisse(KIND.id)).toHaveLength(0);

    // Das Netz kommt zurück - das Ereignis `online` treibt den Haken.
    vi.useFakeTimers();
    try {
      renderHook(() => useNachsenden(KIND));
      netz = true;
      await act(async () => {
        window.dispatchEvent(new Event("online"));
        await vi.advanceTimersByTimeAsync(3_000);
      });
    } finally {
      vi.useRealTimers();
    }
    await waitFor(() => expect(istAusstehend(KIND.id, "probe", "sp-1")).toBe(false));
    expect(await b.leseProbenergebnisse(KIND.id)).toHaveLength(1);

    // Noch ein `online` und ein Start: nichts wird doppelt.
    window.dispatchEvent(new Event("online"));
    renderHook(() => useNachsenden(KIND));
    await new Promise((r) => setTimeout(r, 50));
    expect(await b.leseProbenergebnisse(KIND.id)).toHaveLength(1);
    expect(spion.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("beim nächsten Start dieses Kontos wird nachgesendet (ohne `online`)", async () => {
    merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis()));
    renderHook(() => useNachsenden(KIND));
    await waitFor(() => expect(istAusstehend(KIND.id, "probe", "sp-1")).toBe(false));
    expect(await typingBackend().leseProbenergebnisse(KIND.id)).toHaveLength(1);
  });

  it("absenderFuer: „lag-schon“ zählt als angekommen", async () => {
    const b = typingBackend();
    vi.spyOn(b, "speichereProbenergebnis").mockResolvedValue("lag-schon");
    merkeVor(KIND.id, "probe", "sp-1", fuersSpeichern(ergebnis()));
    await sendeAusstehende(KIND.id, absenderFuer(KIND));
    expect(ausstehende(KIND.id)).toEqual([]);
  });
});

// ── 4. Der ruhige Satz ─────────────────────────────────────────────────────

function plan(): SchreibprobePlan {
  return {
    id: "sp-1",
    niveau: "start",
    startMs: Date.now() - 60_000,
    dauerMin: 10,
    textNr: 0,
    startZeile: 0,
    zuschlagProzent: 0,
    angelegtMs: Date.now() - 120_000,
  };
}

function probeStand(over: Partial<SchreibprobeStand> = {}): SchreibprobeStand {
  return {
    plan: plan(),
    phase: "abgegeben",
    stand: { ...LEERER_STAND, abgegeben: true },
    geladen: true,
    einstiegBis: Date.now() + 9 * 60_000,
    beginne: vi.fn(),
    melde: vi.fn(),
    schliesseErgebnis: vi.fn(),
    gibAb: vi.fn(async () => {}),
    fortschritt: LEERER_FORTSCHRITT,
    merkeFortschritt: vi.fn(),
    ...over,
  };
}

describe("Ergebnis-Bildschirm, solange das Ergebnis im Gerät wartet", () => {
  const SATZ = /sobald die Verbindung wieder da ist/;

  it("sagt ruhig, dass gesendet wird - ohne Live-Bereich", () => {
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({ ergebnisUnterwegs: true })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    const satz = screen.getByText(SATZ);
    expect(satz.closest("[aria-live],[role='status'],[role='alert']")).toBeNull();
    // Kein Vorhalt, kein Alarm.
    expect(container.textContent ?? "").not.toMatch(/Lehrkraft|Fehler|verloren/);
  });

  it("ohne wartendes Ergebnis steht der Satz nicht da", () => {
    render(
      <SchreibprobeLauf probe={probeStand()} account={KIND} stufe="kids" onTask={vi.fn()} />,
    );
    expect(screen.queryByText(SATZ)).toBeNull();
  });
});
