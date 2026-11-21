/**
 * ★★★ Die Befunde der DRITTEN Prüfung von `fix/netz-warteschlange`
 * (27.09.2026) - als Tests. R1, R2/R3 (Lernstand-Kopie), R5 und K3 waren auf
 * 3c3ea3d3 rot.
 *
 * R1  Die Frist brach die Anfrage nicht ab: Eine hängende erste Sendung
 *     (Lesen + ganze Liste neu schreiben) landete NACH der zweiten und
 *     überschrieb deren Zeile. ⚠️ Was dieser Test beweist - und was nicht:
 *     Er beweist, dass das Abbruch-Signal Lesen UND Schreiben erreicht und
 *     nach der Frist ausgelöst wird. Der Server-Ersatz nimmt dabei an, dass
 *     eine abgebrochene Anfrage nie ankommt (wie ein `fetch`, dessen Körper
 *     noch nicht ganz beim Server war). Einen Abbruch AM SERVER beweist er
 *     nicht - hat der Server die Anfrage schon ganz, schreibt er sie
 *     (Grenze, dokumentiert in `nachsenden.ts`, Punkt 6).
 * R2/R3 Die Lernstand-Kopie im Gerät galt auch bei 5xx/Frist und überschrieb
 *     danach den neueren Stand. Sie ist entfernt: Nach einem Speichern ohne
 *     Netz liegt KEINE Kopie im Gerät.
 * R5  Nach 5 Serverfehlern ruhten die Zeilen bis zum Neuladen. Jetzt: nie
 *     aufgeben, nur länger warten; jede gelungene Anfrage setzt zurück.
 * K3  `merkeVor` erkennt eine Zeile an „ts|lesson" aus der Zeile selbst.
 * S2  Die Seite treibt die Schlange wirklich an: beim Start und bei `online`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ClientResponseError } from "pocketbase";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn() };
});

import * as nach from "../src/lib/typing/nachsenden";
import * as un from "../src/lib/typing/useNachsenden";
import { PocketBaseTypingBackend } from "../src/lib/typing/pbBackend";
import { _resetTypingBackend, typingBackend } from "../src/lib/typing/backend";
import { packEvents, unpackEvents } from "../src/lib/typing/eventPack";
import type { TaskEvent, TypingAccount } from "../src/lib/typing/account";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { TastenflowSprachBereich } from "../src/features/public/TastenflowSprachBereich";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { useVoice } from "../src/lib/typing";
import { useContrast } from "../src/lib/contrast";
import { naechsteZeile, ohneBildschirmTastatur, tippfeldPflicht, zeilenMarke } from "./_typing-probelauf";

const K = { id: "k1", role: "schueler", name: "x", classCode: "K", createdAt: 1 } as TypingAccount;
const z = (i: number): TaskEvent => ({
  ts: 1_800_000_000_000 + i * 20_000,
  lesson: "l03",
  chars: 30,
  errors: 1,
  ms: 20_000,
  activeMs: 20_000,
});

beforeEach(() => {
  localStorage.clear();
  nach._nachsendenZuruecksetzen();
  _resetTypingBackend();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/**
 * Ein Server, dessen ERSTES `update` hängt und erst auf `freigeben()` landet -
 * es sei denn, die Anfrage wurde vorher abgebrochen (wie bei `fetch`: eine
 * abgebrochene Anfrage schreibt nichts mehr).
 */
function server() {
  const row = { id: "ev1", pupilUid: K.id, program: "tippen", data: packEvents([z(0)]) as unknown };
  let halte: null | { freigeben: () => void } = null;
  let ersteUpdate = true;
  const lesenSignale: (AbortSignal | undefined)[] = [];
  const pb = {
    authStore: { record: { classCode: "K", teacherUid: "t" }, isValid: true },
    filter: () => "",
    collection: () => ({
      async getFirstListItem(_f: string, opt?: { signal?: AbortSignal }) {
        lesenSignale.push(opt?.signal);
        return { ...row, data: JSON.parse(JSON.stringify(row.data)) };
      },
      update(_id: string, body: { data: unknown }, opt?: { signal?: AbortSignal }) {
        const kopie = JSON.parse(JSON.stringify(body.data));
        if (ersteUpdate) {
          ersteUpdate = false;
          return new Promise((ok, fehl) => {
            let abgebrochen = false;
            opt?.signal?.addEventListener("abort", () => {
              abgebrochen = true;
              fehl(new ClientResponseError({ isAbort: true, status: 0 }));
            });
            halte = {
              freigeben: () => {
                if (abgebrochen) return; // wie fetch: kommt nie an
                row.data = kopie;
                ok({});
              },
            };
          });
        }
        row.data = kopie;
        return Promise.resolve({});
      },
      async create() {
        throw new Error("nicht erwartet");
      },
    }),
  };
  const be = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
  (be as unknown as { pb: unknown }).pb = pb;
  return { be, row, lesenSignale, freigeben: () => halte?.freigeben() };
}

it("R1 das Abbruch-Signal erreicht Lesen und Schreiben: eine abgebrochene erste Sendung überschreibt keine Zeile", async () => {
  vi.useFakeTimers();
  const s = server();
  const b = typingBackend();
  vi.spyOn(b, "currentAccount").mockReturnValue(K);
  vi.spyOn(b, "recordEvents").mockImplementation((id, ev, sig) =>
    s.be.recordEvents(id, ev, sig as AbortSignal | undefined),
  );
  nach.merkeVor(K.id, "ereignis", `${z(1).ts}|l03`, z(1));
  const lauf1 = un.nachsendenJetzt(K, { sofort: true });
  await vi.advanceTimersByTimeAsync(nach.SENDE_FRIST_MS + 10);
  await lauf1;
  nach.merkeVor(K.id, "ereignis", `${z(2).ts}|l03`, z(2));
  await un.nachsendenJetzt(K, { sofort: true });
  expect(nach.ausstehende(K.id)).toEqual([]);
  s.freigeben(); // die hängende erste Anfrage - abgebrochen, sie landet nicht mehr
  await vi.advanceTimersByTimeAsync(1);
  const amServer = unpackEvents(s.row.data).map((e) => e.ts);
  expect(amServer).toEqual([z(0).ts, z(1).ts, z(2).ts]); // keine Zeile verloren
  // Das LESEN (findLwRow) bekam das Signal ebenfalls - und das der ersten
  // Sendung wurde nach der Frist ausgelöst.
  expect(s.lesenSignale.length).toBeGreaterThanOrEqual(2);
  expect(s.lesenSignale.every((x) => x instanceof AbortSignal)).toBe(true);
  expect(s.lesenSignale[0]?.aborted).toBe(true);
  expect(s.lesenSignale[s.lesenSignale.length - 1]?.aborted).toBe(false);
});

it("R5 nach 5 Serverfehlern ruhen die Zeilen NICHT: nach der Wartezeit wird wieder gesendet", async () => {
  vi.useFakeTimers();
  const b = typingBackend();
  vi.spyOn(b, "currentAccount").mockReturnValue(K);
  const rec = vi.spyOn(b, "recordEvents").mockRejectedValue(new ClientResponseError({ status: 502, response: {} }));
  nach.merkeVor(K.id, "ereignis", "a", z(1));
  for (let i = 0; i < 5; i++) await un.nachsendenJetzt(K, { sofort: true });
  rec.mockResolvedValue(undefined);
  await vi.advanceTimersByTimeAsync(8 * 60_000); // höchstens 5 min × 1,5
  expect(nach.wartetImTakt(K.id)).toBe(true);
  await un.nachsendenJetzt(K); // wie der Takt
  expect(nach.ausstehende(K.id)).toEqual([]);
});

it("R5 eine gelungene Anfrage (z. B. ein normales Speichern) setzt die Wartezeit sofort zurück", async () => {
  const b = typingBackend();
  vi.spyOn(b, "currentAccount").mockReturnValue(K);
  const rec = vi.spyOn(b, "recordEvents").mockRejectedValue(new ClientResponseError({ status: 502, response: {} }));
  nach.merkeVor(K.id, "ereignis", "a", z(1));
  for (let i = 0; i < 5; i++) await un.nachsendenJetzt(K, { sofort: true });
  rec.mockResolvedValue(undefined);
  await un.nachsendenJetzt(K);
  expect(nach.ausstehende(K.id)).toHaveLength(1); // Gegenprobe: noch in der Wartezeit
  nach.meldeVerbindungGut(K.id);
  await un.nachsendenJetzt(K);
  expect(nach.ausstehende(K.id)).toEqual([]);
});

it("K3 dieselbe Zeile unter zwei verschiedenen Schlüsseln steht EINMAL in der Schlange", () => {
  nach.merkeVor(K.id, "ereignis", "irgendwas", z(1));
  nach.merkeVor(K.id, "ereignis", "etwas-anderes", z(1));
  expect(nach.ausstehende(K.id)).toHaveLength(1);
  expect(nach.ausstehende(K.id)[0].schluessel).toBe(`${z(1).ts}|l03`);
});

// ── Die Seite ──────────────────────────────────────────────────────────────

const JANO = { id: "p-jano", role: "schueler" as const, name: "Jano", classCode: "5A3", stufe: "b" as const, createdAt: 1 };

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

describe("Die Übungsseite", () => {
  beforeEach(() => {
    localStorage.setItem("tastenflow-bedienung", "de");
    document.documentElement.setAttribute("lang", "de");
    einrichtungFertigMerken();
    ohneBildschirmTastatur();
    useContrast.getState().setMode("hell");
    useVoice.getState().setEnabled(false);
    Element.prototype.scrollIntoView = () => {};
  });

  it("R2/R3 ein Speichern ohne Netz legt KEINE Lernstand-Kopie ins Gerät - und zeigt keinen Warnstreifen", async () => {
    const speichern = vi
      .spyOn(typingBackend(), "saveProgress")
      .mockRejectedValue(new ClientResponseError({ status: 0, isAbort: false }));
    // JEDER Schreibvorgang ins Gerät wird mitgeschrieben - nicht nur der Stand am Ende.
    const echt = localStorage.setItem.bind(localStorage);
    const geschrieben: string[] = [];
    vi.spyOn(localStorage, "setItem").mockImplementation((k: string, v: string) => {
      geschrieben.push(k);
      return echt(k, v);
    });
    zeigeSeite();
    await waitFor(() => tippfeldPflicht());
    const vorher = speichern.mock.calls.length;
    for (let n = 0; n < 3 && speichern.mock.calls.length === vorher; n++) {
      const feld = tippfeldPflicht("zeile");
      const marke = zeilenMarke();
      for (const ch of feld.value) fireEvent.keyDown(feld, { key: ch });
      await naechsteZeile(marke, 20_000);
    }
    // Der ruhige Satz beweist: das Speichern der Zeile ist ohne Netz gescheitert.
    await waitFor(() => expect(document.body.textContent ?? "").toMatch(/Gerade keine Verbindung/));
    expect(speichern.mock.calls.length).toBeGreaterThan(vorher);
    expect(geschrieben.filter((k) => k.includes("lernstand"))).toEqual([]);
    expect(Object.keys(localStorage).filter((k) => k.includes("lernstand"))).toEqual([]);
    expect(document.querySelector("[role='alert']")).toBeNull();
  }, 60_000);

  it("S2 die Seite sendet Wartendes beim Start", async () => {
    const rec = vi.spyOn(typingBackend(), "recordEvents").mockResolvedValue(undefined);
    nach.merkeVor(JANO.id, "ereignis", "x", z(1));
    zeigeSeite();
    await waitFor(() => expect(rec).toHaveBeenCalledWith(JANO.id, [z(1)], expect.anything()));
    await waitFor(() => expect(nach.ausstehende(JANO.id)).toEqual([]));
  }, 30_000);

  it("S2 … und wieder, wenn das Netz zurückkommt (`online`)", async () => {
    const rec = vi
      .spyOn(typingBackend(), "recordEvents")
      .mockRejectedValue(new ClientResponseError({ status: 0, isAbort: false }));
    nach.merkeVor(JANO.id, "ereignis", "x", z(1));
    zeigeSeite();
    await waitFor(() => expect(rec).toHaveBeenCalledTimes(1)); // Start: kein Netz
    expect(nach.ausstehende(JANO.id)).toHaveLength(1);
    rec.mockResolvedValue(undefined);
    window.dispatchEvent(new Event("online"));
    await waitFor(() => expect(nach.ausstehende(JANO.id)).toEqual([]), { timeout: 4000 });
    expect(rec).toHaveBeenCalledTimes(2);
  }, 30_000);
});
