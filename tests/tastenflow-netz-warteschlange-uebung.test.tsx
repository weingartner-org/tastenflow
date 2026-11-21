/**
 * ★★★ Netz kurz weg - geübte Zeilen gehen nicht mehr verloren
 * (27.09.2026; Johannes: „Netz kurz weg ... Zeilen gehen verloren ist nicht
 * gut"; `BEFUND-2026-09-27-DATENVERBRAUCH-UND-NETZABBRUCH.md` §3.1 und §3.2).
 *
 * Vorher: Jede Zeile ging mit EINEM `recordEvent` weg, ohne Fehlerbehandlung -
 * offline geübte Zeilen fehlten dauerhaft in Übezeit, Wochenziel und Statistik.
 * Der Lernstand angemeldeter Konten lag nur im Speicher des Tabs; ein
 * Neuladen oder ein geschlossener Tab ohne Netz verlor alles seit dem letzten
 * Speichern. Und ein blosser Netzaussetzer zeigte „sag es deiner Lehrkraft".
 *
 * Geprüft wird:
 *  A. N Zeilen offline → online → der Server hat GENAU N, einmal - auch wenn
 *     die erste Sendung ankam und nur die Antwort verloren ging.
 *  B. Neuladen offline: die Schlange bleibt.
 *  C. (entfällt) Der Lernstand ist NICHT in der Schlange und hat keine
 *     Kopie im Gerät - er wird wie vorher direkt gespeichert.
 *  D. Die Grenze der Schlange: die älteste fällt, nie still.
 *  E. Die Seite: Netzaussetzer ⇒ ruhiger Satz, KEIN `role="alert"`; lehnt der
 *     Server ab ⇒ der Streifen wie bisher (Gegenprobe).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ClientResponseError } from "pocketbase";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn() };
});

import {
  MAX_EREIGNISSE,
  _nachsendenZuruecksetzen,
  ausstehende,
  merkeVor,
  verbindungFehlt,
} from "../src/lib/typing/nachsenden";
import { ereignisVormerken, nachsendenJetzt } from "../src/lib/typing/useNachsenden";
import { PocketBaseTypingBackend } from "../src/lib/typing/pbBackend";
import { _resetTypingBackend, typingBackend } from "../src/lib/typing/backend";
import { packEvents, tagesbilanz, unpackEvents } from "../src/lib/typing/eventPack";
import type { TaskEvent, TypingAccount } from "../src/lib/typing/account";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { TastenflowSprachBereich } from "../src/features/public/TastenflowSprachBereich";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { useVoice } from "../src/lib/typing";
import { useContrast } from "../src/lib/contrast";
import {
  naechsteZeile,
  ohneBildschirmTastatur,
  tippfeldPflicht,
  zeilenMarke,
} from "./_typing-probelauf";

/** So sendet die App, wenn das Netz zurückkommt (`online`) oder beim Start. */
const ONLINE = { sofort: true, auchAbgewiesene: true } as const;

const KIND: TypingAccount = {
  id: "kind-1",
  role: "schueler",
  name: "Ferdi",
  classCode: "K1",
  createdAt: 1,
};

const T0 = new Date(2026, 8, 27, 10, 0).getTime();
function zeile(i: number): TaskEvent {
  return { ts: T0 + i * 20_000, lesson: "l03", chars: 30, errors: 1, ms: 20_000, activeMs: 20_000 };
}

// ── Ein PocketBase-Ersatz für lw_events / lw_progress ──────────────────────

interface Zeile {
  id: string;
  pupilUid: string;
  program: string;
  data: unknown;
  updatedAtMs: number;
}

function fakeServer() {
  const tabellen: Record<string, Zeile[]> = { lw_events: [], lw_progress: [], tt_events: [], tt_progress: [] };
  const zustand = { netz: true, antwortVerloren: false };
  const aufrufe = { update: 0, create: 0 };
  const netzfehler = () => new ClientResponseError({ status: 0, isAbort: false });
  const pb = {
    authStore: { record: { classCode: "K1", teacherUid: "t1" }, isValid: true },
    filter: (_s: string, p: Record<string, string>) => JSON.stringify(p),
    collection(name: string) {
      const t = tabellen[name];
      if (!t) throw new Error(`unerwartet: ${name}`);
      return {
        async getFirstListItem(filter: string) {
          if (!zustand.netz) throw netzfehler();
          const p = JSON.parse(filter) as { p: string };
          const z = t.find((x) => x.pupilUid === p.p);
          if (!z) throw new ClientResponseError({ status: 404, response: {} });
          return { ...z };
        },
        async update(id: string, body: Partial<Zeile>) {
          if (!zustand.netz) throw netzfehler();
          const z = t.find((x) => x.id === id)!;
          Object.assign(z, JSON.parse(JSON.stringify(body)));
          aufrufe.update++;
          if (zustand.antwortVerloren) throw netzfehler();
          return { ...z };
        },
        async create(body: Partial<Zeile>) {
          if (!zustand.netz) throw netzfehler();
          const z = { id: `${name}-${t.length + 1}`, ...JSON.parse(JSON.stringify(body)) } as Zeile;
          t.push(z);
          aufrufe.create++;
          if (zustand.antwortVerloren) throw netzfehler();
          return { ...z };
        },
      };
    },
  };
  const backend = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
  (backend as unknown as { pb: unknown }).pb = pb;
  return { backend, tabellen, zustand, aufrufe };
}

/** Den Weg der App (`typingBackend()`) an den Server-Ersatz hängen - JEDE Methode. */
function verbinde(s: ReturnType<typeof fakeServer>) {
  const b = typingBackend() as unknown as Record<string, unknown>;
  const ziel = s.backend as unknown as Record<string, (...a: unknown[]) => unknown>;
  for (const k of Object.getOwnPropertyNames(PocketBaseTypingBackend.prototype)) {
    if (k === "constructor" || typeof b[k] !== "function") continue;
    vi.spyOn(b as never, k as never).mockImplementation(((...a: unknown[]) =>
      ziel[k].apply(s.backend, a)) as never);
  }
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

// ── A + B: geübte Zeilen ───────────────────────────────────────────────────

describe("Geübte Zeilen ohne Netz", () => {
  const N = 12;

  it("offline N Zeilen → Neuladen → online (Antwort verloren) → genau N am Server, einmal", async () => {
    const s = fakeServer();
    verbinde(s);
    // Die Zeile gab es schon vorher - die Geschichte darf nicht leiden.
    s.tabellen.lw_events.push({
      id: "ev1",
      pupilUid: KIND.id,
      program: "tippen",
      data: packEvents([zeile(-10)]),
      updatedAtMs: 1,
    });

    s.zustand.netz = false;
    for (let i = 0; i < N; i++) {
      ereignisVormerken(KIND, zeile(i));
      await nachsendenJetzt(KIND);
    }
    expect(ausstehende(KIND.id).filter((e) => e.art === "ereignis")).toHaveLength(N);
    expect(unpackEvents(s.tabellen.lw_events[0].data)).toHaveLength(1);
    expect(verbindungFehlt(KIND.id)).toBe(true);

    // ── Neuladen offline: frisches Modul, derselbe Gerätespeicher.
    vi.resetModules();
    const frisch = await import("../src/lib/typing/nachsenden");
    expect(frisch.ausstehende(KIND.id).filter((e) => e.art === "ereignis")).toHaveLength(N);

    // ── Netz zurück, aber die erste Antwort geht verloren (Zeile kam an).
    s.zustand.netz = true;
    s.zustand.antwortVerloren = true;
    await nachsendenJetzt(KIND, ONLINE);
    expect(ausstehende(KIND.id)).toHaveLength(N); // das Gerät weiss es nicht
    expect(unpackEvents(s.tabellen.lw_events[0].data)).toHaveLength(1 + N);

    s.zustand.antwortVerloren = false;
    await nachsendenJetzt(KIND, ONLINE);
    expect(ausstehende(KIND.id)).toEqual([]);
    expect(verbindungFehlt(KIND.id)).toBe(false);

    const amServer = unpackEvents(s.tabellen.lw_events[0].data);
    expect(amServer).toHaveLength(1 + N); // NICHT 1 + 2N
    expect(new Set(amServer.map((e) => e.ts)).size).toBe(1 + N);
    // Die Tagesbilanz (Übezeit, Wochenziel) zählt jede nachgetragene Zeile
    // EINMAL - N, nicht 2N. (Die Zeile von vorher kam ohne Bilanz in den
    // Ersatz, `packEvents` rechnet keine.)
    const bilanz = tagesbilanz(s.tabellen.lw_events[0].data);
    expect(bilanz.reduce((a, t) => a + t.zeilen, 0)).toBe(N);
    expect(bilanz.reduce((a, t) => a + t.min * 60_000 + (t.restMs ?? 0), 0)).toBe(N * 20_000);
  });

  it("gebündelt: N offline geübte Zeilen gehen mit EINEM Schreiben", async () => {
    const s = fakeServer();
    verbinde(s);
    s.zustand.netz = false;
    for (let i = 0; i < N; i++) merkeVor(KIND.id, "ereignis", `${zeile(i).ts}|l03`, zeile(i));
    s.zustand.netz = true;
    await nachsendenJetzt(KIND, ONLINE);
    expect(s.aufrufe.create + s.aufrufe.update).toBe(1);
    expect(unpackEvents(s.tabellen.lw_events[0].data)).toHaveLength(N);
  });

  it("dieselbe Zeile zweimal vorgemerkt steht einmal in der Schlange", () => {
    merkeVor(KIND.id, "ereignis", `${zeile(1).ts}|l03`, zeile(1));
    merkeVor(KIND.id, "ereignis", `${zeile(1).ts}|l03`, zeile(1));
    expect(ausstehende(KIND.id)).toHaveLength(1);
  });
});

// ── D: die Grenze ──────────────────────────────────────────────────────────

describe("Grenze der Schlange", () => {
  const SCHL = `tastenflow:nachsenden:v2:${KIND.id}`;
  const volleZeilen = () => Array.from({ length: MAX_EREIGNISSE }, (_, i) => zeile(i));

  it(`höchstens ${MAX_EREIGNISSE} Zeilen - die älteste fällt, mit Warnung`, () => {
    localStorage.setItem(SCHL, JSON.stringify({ v: 2, e: [], ev: packEvents(volleZeilen()), evZ: {} }));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(merkeVor(KIND.id, "ereignis", `${zeile(99_999).ts}|l03`, zeile(99_999))).toBe(true);
    const liste = ausstehende(KIND.id);
    expect(liste).toHaveLength(MAX_EREIGNISSE);
    expect(liste[0].schluessel).toBe(`${zeile(1).ts}|l03`);
    expect(liste[liste.length - 1].schluessel).toBe(`${zeile(99_999).ts}|l03`);
    expect(warn).toHaveBeenCalled();
  });

  it("ein Ergebnis fällt der Grenze nie zum Opfer", () => {
    merkeVor(KIND.id, "probe", "sp-1", { probeId: "sp-1" });
    const e = (JSON.parse(localStorage.getItem(SCHL)!) as { e: unknown[] }).e;
    localStorage.setItem(SCHL, JSON.stringify({ v: 2, e, ev: packEvents(volleZeilen()), evZ: {} }));
    _nachsendenZuruecksetzen();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    merkeVor(KIND.id, "ereignis", `${zeile(99_999).ts}|l03`, zeile(99_999));
    const arten = ausstehende(KIND.id).map((x) => x.art);
    expect(arten).toContain("probe");
  });
});

// ── E: die Seite ───────────────────────────────────────────────────────────

const JANO = {
  id: "p-jano",
  role: "schueler" as const,
  name: "Jano",
  classCode: "5A3",
  stufe: "b" as const,
  createdAt: 1,
};

function zeigeSeite() {
  useTypingAuth.setState({ account: JANO });
  render(
    <MemoryRouter initialEntries={["/programme/tastenflow"]}>
      <TastenflowSprachBereich>
        <TippenTrainerPage />
      </TastenflowSprachBereich>
    </MemoryRouter>,
  );
}

async function tippeZeile(): Promise<boolean> {
  const feld = tippfeldPflicht("tippeZeile");
  const marke = zeilenMarke();
  for (const ch of feld.value) fireEvent.keyDown(feld, { key: ch });
  return naechsteZeile(marke, 20_000);
}

describe("Die Übungsseite bei einem Netzaussetzer", () => {
  beforeEach(() => {
    localStorage.setItem("tastenflow-bedienung", "de");
    document.documentElement.setAttribute("lang", "de");
    einrichtungFertigMerken();
    ohneBildschirmTastatur();
    useContrast.getState().setMode("hell");
    useVoice.getState().setEnabled(false);
    Element.prototype.scrollIntoView = () => {};
  });

  const RUHIG = /Gerade keine Verbindung\. Die geübten Zeilen werden später gesendet/;

  it("Netz weg: ruhiger Satz ohne Live-Bereich, KEIN „sag es deiner Lehrkraft“ - die Zeile wartet im Gerät", async () => {
    const netz = () => new ClientResponseError({ status: 0, isAbort: false });
    vi.spyOn(typingBackend(), "saveProgress").mockRejectedValue(netz());
    vi.spyOn(typingBackend(), "recordEvents").mockRejectedValue(netz());
    zeigeSeite();
    await waitFor(() => tippfeldPflicht());
    await tippeZeile();
    const satz = await screen.findByText(RUHIG);
    expect(satz.closest("[aria-live],[role='status'],[role='alert']")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(document.body.textContent ?? "").not.toMatch(/sag es deiner Lehrkraft/);
    expect(ausstehende(JANO.id).some((e) => e.art === "ereignis")).toBe(true);
  }, 60_000);

  it("Gegenprobe: lehnt der SERVER ab, steht der Streifen wie bisher", async () => {
    vi.spyOn(typingBackend(), "saveProgress").mockRejectedValue(
      new ClientResponseError({ status: 403, response: { message: "Forbidden" } }),
    );
    zeigeSeite();
    await waitFor(() => tippfeldPflicht());
    await tippeZeile();
    const streifen = await screen.findByRole("alert");
    expect(streifen.textContent).toMatch(/sag es deiner Lehrkraft/);
    expect(screen.queryByText(RUHIG)).toBeNull();
  }, 60_000);
});
