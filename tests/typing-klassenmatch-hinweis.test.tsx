/**
 * ★★★★★ WÄCHTER: DER SCHALTER SAGT, WARUM ES GERADE NICHT GEHT (11.09.2026, E6b).
 *
 * ── Der Befund ──────────────────────────────────────────────────────────────
 * §2.6 verlangt für ein Kind, das schon in einem Match steckt, *„den
 * Match-Schalter mit dem Hinweis ‚läuft gerade'"*. Gebaut war: Der Schalter
 * **verschwindet** - und bei zwei offenen Matches in der Klasse ebenso. Beides
 * lässt ein Kind vor einer Zeile stehen, in der eben noch ein Schalter war, und
 * Alt + M tat stillschweigend nichts. Genau das gibt es in diesem Programm
 * nicht (R-A3).
 *
 * ── Was hier geprüft wird ───────────────────────────────────────────────────
 *  (a) Der Haken sagt den Grund - am echten Mock-Backend durchgespielt.
 *  (b) Der Schalter steht da, trägt den Grund in seiner BESCHRIFTUNG (damit er
 *      auf der Braillezeile steht, sobald der Fokus ihn erreicht), ist NICHT
 *      `disabled` und schreibt kein Match aus, sondern antwortet.
 *  (c) Alt + M gibt dieselbe Antwort.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// `speakUi` wird ersetzt: Ohne Sprachausgabe in jsdom wäre die Antwort des
// Schalters sonst unbeobachtbar (der Rest des Moduls bleibt echt - `useVoice`
// ist ein Zustandsspeicher, den die Bauteile brauchen).
vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn() };
});

import { StandZeile } from "../src/components/typing/StandZeile";
import { _resetTypingBackend } from "@/lib/typing/backend";
import { _mockMatchesZuruecksetzen } from "@/lib/typing/matchMock";
import { MATCH_HINWEIS_LAEUFT, matchHinweisSatz } from "@/lib/typing/klassenmatch";
import { KLASSENMATCH_EREIGNIS, useKlassenmatchAngebot } from "@/lib/typing/klassenmatchAngebot";
import { useKlassenmatch } from "@/lib/typing/useKlassenmatch";
import { speakUi } from "@/lib/typing/voice";
import type { TypingAccount } from "@/lib/typing/account";

function kind(id: string, name: string): TypingAccount {
  return { id, role: "schueler", name, classCode: "K1", createdAt: 1 };
}
const SARAH = kind("sarah", "Sarah");
const FRANZ = kind("franz", "Franz");
const MIRA = kind("mira", "Mira");
const BEN = kind("ben", "Ben");

async function warte(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  localStorage.clear();
  _mockMatchesZuruecksetzen();
  _resetTypingBackend();
  useKlassenmatchAngebot.setState({ offen: false, hinweis: "" });
  vi.mocked(speakUi).mockClear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  _mockMatchesZuruecksetzen();
  localStorage.clear();
});

describe("(a) Der Haken nennt den Grund", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("★★★★★ sagt „Klassenmatch läuft gerade“, sobald dieses Kind drinsteckt", async () => {
    const { result } = renderHook(() => useKlassenmatch(SARAH));
    await warte(100);
    expect(result.current.erlaubt).toBe(true);
    expect(result.current.hinweis).toBe("");

    await act(async () => {
      result.current.einladen();
    });
    await warte(100);
    expect(result.current.erlaubt).toBe(false);
    expect(result.current.hinweis).toBe(MATCH_HINWEIS_LAEUFT);

    // Und er verschwindet wieder, sobald das Match abgesagt ist.
    await act(async () => {
      result.current.absagen();
    });
    await warte(100);
    expect(result.current.hinweis).toBe("");
    expect(result.current.erlaubt).toBe(true);
  });

  it("★★★★★ kennt seit 15.09.2026 KEINE Grenze mehr für offene Matches", async () => {
    // Johannes: „ich möchte dass mehr wie 2 match parallel laufen können" -
    // bis dahin stand hier F9 (höchstens zwei offene Matches je Klasse), und
    // Mira wäre an genau dieser Stelle (zwei offene Matches: Sarahs laufendes
    // und Franz' Einladung) schon abgewiesen worden.
    const sarah = renderHook(() => useKlassenmatch(SARAH));
    const franz = renderHook(() => useKlassenmatch(FRANZ));
    const mira = renderHook(() => useKlassenmatch(MIRA));
    const ben = renderHook(() => useKlassenmatch(BEN));
    await warte(100);

    // Sarah startet ihr Match, damit Franz überhaupt ausschreiben darf (ein
    // zweites geht erst, wenn das erste LÄUFT - unverändert seit 11.09.2026).
    await act(async () => {
      sarah.result.current.einladen();
    });
    await warte(1_500); // der Mock-Mitspieler „Mia" tritt bei, siehe matchMock.ts
    await act(async () => {
      sarah.result.current.starten();
    });
    await warte(100);
    await act(async () => {
      franz.result.current.einladen();
    });
    await warte(100);

    // Zwei Matches sind jetzt offen (Sarahs läuft, Franz' lädt noch ein) -
    // weder Mira noch Ben sind daran gebunden, und beide dürfen trotzdem.
    expect(mira.result.current.erlaubt).toBe(true);
    expect(mira.result.current.hinweis).toBe("");
    expect(ben.result.current.erlaubt).toBe(true);
    expect(ben.result.current.hinweis).toBe("");
  });

  it("★★★ sagt GAR NICHTS, wo es den Schalter nicht gibt (kein Klassenkind)", async () => {
    const selbst: TypingAccount = {
      id: "s1",
      role: "schueler",
      name: "Selbst",
      selfManaged: true,
      createdAt: 1,
    };
    const { result } = renderHook(() => useKlassenmatch(selbst));
    await warte(100);
    expect(result.current.erlaubt).toBe(false);
    // Ein Kind ohne Klasse bekommt keinen Schalter und darum auch keinen Grund:
    // Es hat niemanden zum Einladen, und das ändert sich nicht von selbst.
    expect(result.current.hinweis).toBe("");
  });
});

describe("(b) Der Schalter in der Stand-Zeile", () => {
  function zeige(hinweis: string) {
    useKlassenmatchAngebot.setState({ offen: true, hinweis });
    render(<StandZeile stufeLabel="Übungsstufe" level={7} nextUnit="p" shiftLearned />);
    return screen.getByRole("button", { name: /Klassenmatch|Matches/ });
  }

  it("★★★★★ steht da und trägt den Zustand in seiner Beschriftung", () => {
    const knopf = zeige(MATCH_HINWEIS_LAEUFT);
    expect(knopf.textContent).toContain(MATCH_HINWEIS_LAEUFT);
  });

  it("★★★★★ ist NIE `disabled` - und auch nicht `aria-disabled`", () => {
    const knopf = zeige(MATCH_HINWEIS_LAEUFT);
    expect((knopf as HTMLButtonElement).disabled).toBe(false);
    expect(knopf.getAttribute("aria-disabled")).toBeNull();
    // Er bleibt ein Fokus-Ziel: Auf der Braillezeile steht der Grund, sobald
    // der Fokus ihn erreicht - ohne eine einzige Live-Meldung.
    act(() => (knopf as HTMLButtonElement).focus());
    expect(document.activeElement).toBe(knopf);
  });

  it("★★★★★ ANTWORTET beim Drücken, statt ein Match auszuschreiben", () => {
    const knopf = zeige(MATCH_HINWEIS_LAEUFT);
    const ausgeschrieben: Event[] = [];
    const horcher = (e: Event) => ausgeschrieben.push(e);
    window.addEventListener(KLASSENMATCH_EREIGNIS, horcher);
    try {
      fireEvent.click(knopf);
    } finally {
      window.removeEventListener(KLASSENMATCH_EREIGNIS, horcher);
    }
    expect(ausgeschrieben.length).toBe(0);
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith(matchHinweisSatz(MATCH_HINWEIS_LAEUFT));
  });

  it("★★★ schreibt OHNE Hinweis weiterhin ein Match aus", () => {
    const knopf = zeige("");
    const ausgeschrieben: Event[] = [];
    const horcher = (e: Event) => ausgeschrieben.push(e);
    window.addEventListener(KLASSENMATCH_EREIGNIS, horcher);
    try {
      fireEvent.click(knopf);
    } finally {
      window.removeEventListener(KLASSENMATCH_EREIGNIS, horcher);
    }
    expect(ausgeschrieben.length).toBe(1);
  });

  it("★★ bleibt ganz weg, wo es das Match nicht gibt", () => {
    useKlassenmatchAngebot.setState({ offen: false, hinweis: "" });
    render(<StandZeile stufeLabel="Übungsstufe" level={7} nextUnit="p" shiftLearned />);
    expect(screen.queryByRole("button", { name: /Klassenmatch/ })).toBeNull();
  });
});

describe("(c) Alt + M gibt dieselbe Antwort", () => {
  /*
    ⚠️ Quelltext statt Verhalten, und das ist hier eine bewusste Schwäche: Der
    Tastatur-Handler hängt in `TippenTrainerPage`, und diese Seite im Test mit
    angemeldetem Klassenkind samt laufendem Match aufzubauen kostet mehr, als
    dieser eine Zweig wert ist. Gemessen wurde er im Browser (Bericht E6b §4).
    Was der Wächter kann: Er schlägt an, wenn jemand den Zweig wieder entfernt.
  */
  const quelle = readFileSync(
    resolve(__dirname, "../src/features/public/TippenTrainerPage.tsx"),
    "utf8",
  );

  it("★★★ behandelt Alt + M auch dann, wenn gerade nicht eingeladen werden kann", () => {
    const block = quelle.slice(quelle.indexOf('case "KeyM"'), quelle.indexOf('case "Equal"'));
    expect(block).toContain("matchRef.current.erlaubt");
    expect(block).toContain("matchRef.current.hinweis");
    // ★ EN1 (19.09.2026): gesprochen über `sprichBedienung` - der Hinweis
    // steht in der Bedienungssprache, also mit deren Stimme (ohne aktiven
    // Sprachbereich ist das genau `speakUi(text)` wie vorher).
    expect(block).toContain("sprichBedienung(matchHinweisSatz(");
    // Keine Live-Region: Beim Tippen verdrängt jede Meldung die Braillezeile.
    expect(block).not.toContain("aria-live");
  });
});
