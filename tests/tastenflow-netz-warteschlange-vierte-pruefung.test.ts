/**
 * ★★★ Die Befunde der VIERTEN Prüfung von `fix/netz-warteschlange`
 * (27.09.2026) - als Tests; auf 87bbff05 rot.
 *
 * R4a Speicher voll, ONLINE: Jede geübte Zeile ging still verloren - die
 *     Schlange kappte genau die neue Zeile, meldete trotzdem „liegt im
 *     Gerät", und der direkte Weg (wie auf f10c6eea) lief nicht.
 * R4b Der Rückfall „Anmeldung nur in diesem Tab" trug keine Anmeldung (oder
 *     die des VORIGEN Kindes). Jetzt: einmal Platz schaffen, einmal nochmal
 *     versuchen, sonst genau wie vorher ein Fehler.
 * S2  Platz schaffen nur so viel wie nötig - die ältesten Zeilen zuerst,
 *     über alle Konten.
 * K4  Die längste Wartezeit ist wirklich 5 min, samt Streuung.
 * K5  Wird ein Konto an diesem Gerät gelöscht, verschwindet seine Schlange.
 */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ClientResponseError } from "pocketbase";
import * as nach from "@/lib/typing/nachsenden";
import * as un from "@/lib/typing/useNachsenden";
import { PocketBaseTypingBackend, SichererAuthStore } from "@/lib/typing/pbBackend";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import type { TaskEvent, TypingAccount } from "@/lib/typing/account";

const K = { id: "k1", role: "schueler", name: "x", classCode: "K", createdAt: 1 } as TypingAccount;
const z = (i: number, basis = 1_800_000_000_000): TaskEvent => ({
  ts: basis + i * 20_000,
  lesson: "l03",
  chars: 30,
  errors: 1,
  ms: 20_000,
  activeMs: 20_000,
});
const warn: unknown[][] = [];

beforeEach(() => {
  localStorage.clear();
  nach._nachsendenZuruecksetzen();
  _resetTypingBackend();
  warn.length = 0;
  vi.spyOn(console, "warn").mockImplementation((...a) => {
    warn.push(a);
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it("R4a Speicher voll, ONLINE: die geübte Zeile geht trotzdem an den Server (direkter Weg)", async () => {
  const echt = localStorage.setItem.bind(localStorage);
  vi.spyOn(localStorage, "setItem").mockImplementation((k: string, v: string) => {
    if (k.startsWith("tastenflow:nachsenden")) throw new DOMException("voll", "QuotaExceededError");
    return echt(k, v);
  });
  const b = typingBackend();
  vi.spyOn(b, "currentAccount").mockReturnValue(K);
  const gesendet: TaskEvent[] = [];
  vi.spyOn(b, "recordEvents").mockImplementation(async (_id, ev) => {
    gesendet.push(...ev);
  });
  vi.spyOn(b, "recordEvent").mockImplementation(async (_id, ev) => {
    gesendet.push(ev);
  });
  // Die Schlange darf nicht behaupten, die Zeile liege im Gerät.
  expect(nach.merkeVor(K.id, "ereignis", "x", z(1))).toBe(false);
  nach._nachsendenZuruecksetzen();
  un.ereignisVormerken(K, z(2));
  await vi.waitFor(() => expect(gesendet.map((e) => e.ts)).toEqual([z(2).ts]));
});

it("R4b Anmeldung bei vollem Speicher: kein falscher Rückfall - wie vorher ein Fehler, nie das vorige Kind", () => {
  localStorage.setItem("tt_pb_auth", JSON.stringify({ token: "ALT", record: { id: "vorheriges-kind" } }));
  const echt = localStorage.setItem.bind(localStorage);
  vi.spyOn(localStorage, "setItem").mockImplementation((k: string, v: string) => {
    if (k === "tt_pb_auth") throw new DOMException("voll", "QuotaExceededError");
    return echt(k, v);
  });
  const s = new SichererAuthStore("tt_pb_auth");
  expect(() => s.save("NEU", { id: "neues-kind" } as never)).toThrow();
});

it("R4b Gegenprobe: schafft die Schlange Platz, klappt die Anmeldung beim ZWEITEN Versuch", () => {
  const echt = localStorage.setItem.bind(localStorage);
  for (let i = 0; i < 50; i++) nach.merkeVor(K.id, "ereignis", "x", z(i));
  let erster = true;
  vi.spyOn(localStorage, "setItem").mockImplementation((k: string, v: string) => {
    if (k === "tt_pb_auth" && erster) {
      erster = false;
      throw new DOMException("voll", "QuotaExceededError");
    }
    return echt(k, v);
  });
  const s = new SichererAuthStore("tt_pb_auth");
  expect(() => s.save("NEU", { id: "neues-kind" } as never)).not.toThrow();
  expect(s.token).toBe("NEU");
});

it("S2 Platz schaffen: nur so viel wie nötig, die ältesten Zeilen zuerst - über alle Konten", () => {
  const A = "konto-a";
  const B = "konto-b";
  for (let i = 0; i < 200; i++) nach.merkeVor(A, "ereignis", "x", z(i, 1_700_000_000_000)); // älter
  for (let i = 0; i < 200; i++) nach.merkeVor(B, "ereignis", "x", z(i, 1_800_000_000_000)); // jünger
  const vorher = nach.ausstehende(A).length + nach.ausstehende(B).length;
  expect(nach.gibSpeicherFrei(500)).toBe(true);
  const a = nach.ausstehende(A).length;
  const bb = nach.ausstehende(B).length;
  expect(bb).toBe(200); // die jüngeren bleiben ganz
  expect(a).toBeLessThan(200);
  expect(vorher - a - bb).toBeLessThan(100); // nicht die Hälfte von allem
  expect(warn.some((w) => /Zeile/.test(String(w[0])))).toBe(true); // gemeldet, mit Zahl
});

it("K4 die längste Wartezeit ist wirklich 5 min - auch mit Streuung", async () => {
  const b = typingBackend();
  vi.spyOn(b, "currentAccount").mockReturnValue(K);
  vi.spyOn(b, "recordEvents").mockRejectedValue(new ClientResponseError({ status: 502, response: {} }));
  nach.merkeVor(K.id, "ereignis", "x", z(1));
  for (let i = 0; i < 15; i++) {
    await un.nachsendenJetzt(K, { sofort: true });
    const naechster = nach.ausstehende(K.id)[0].naechsterMs;
    expect(naechster - Date.now()).toBeLessThanOrEqual(nach.WARTE_MAX_MS);
  }
});

it("K5 Konto an diesem Gerät gelöscht ⇒ seine Schlange ist weg", async () => {
  nach.merkeVor(K.id, "ereignis", "x", z(1));
  nach.merkeVor(K.id, "probe", "sp-1", { probeId: "sp-1" });
  const pb = {
    authStore: { clear: vi.fn(), record: null },
    filter: () => "",
    collection: () => ({
      getFirstListItem: async () => {
        throw new ClientResponseError({ status: 404, response: {} });
      },
      delete: async () => true,
    }),
  };
  const be = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
  (be as unknown as { pb: unknown }).pb = pb;
  const r = await be.kontoLoeschen(K.id);
  expect(r.ok).toBe(true);
  expect(nach.ausstehende(K.id)).toEqual([]);
  expect(Object.keys(localStorage).filter((k) => k.includes(K.id))).toEqual([]);
});
