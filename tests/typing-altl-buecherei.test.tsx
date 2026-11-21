/**
 * WÄCHTER: Alt+L beantwortet die Übungs-/Spielstufe AUCH in der Bücherei
 * („Geschichten & Wissen").
 *
 * Der Befund (22.08.2026): `TippenTrainerPage` wirft auf Alt+L das Ereignis
 * `tippen-request-level`; geantwortet hat aber nur `AdaptiveTrainer` (bis
 * 19.09.2026 auch `TypingTrainer`, siehe E7 in `trainerMode.ts`) - und die
 * Trainer werden EXKLUSIV gerendert. In der Bücherei war also niemand da, der
 * antwortet, obwohl der Ring die Stufe dort sehr wohl ANZEIGT und die
 * Kürzel-Liste das Kürzel ohne Einschränkung allen zusagt. Wer sieht, bekam
 * die Zahl; wer auf Sprachausgabe oder Braillezeile angewiesen ist, kam gar
 * nicht an sie heran.
 *
 * Warum eine eigene Datei statt eines Blocks in `typing-stufen-feinschliff`:
 * Jener Wächter liest Quelltext-Zeichenketten und mountet nur zwei leichte
 * Bauteile (Hilfe-Dialog, Einstellungen). Hier wird VERHALTEN geprüft - der
 * ganze `SerienTrainer` samt Korpus und, für die Doppelantwort, samt Leser und
 * `TypingSession`. Das ist eine andere Gewichtsklasse und gehört nicht in eine
 * leichte Datei.
 *
 * Geprüft wird durchweg Verhalten, nie Quelltext. Und die erwarteten Wörter
 * kommen aus `copyFor(...)` - schriebe man sie hin, würde der Wächter bei der
 * nächsten Wortänderung stillschweigend falsch.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";

// `speakUi` wird ersetzt, weil die DOPPELANTWORT sonst unbeobachtbar wäre: Im
// Leser rendert der `SerienTrainer` weder Pille noch Live-Region, die zweite
// Antwort wäre also NUR als zweite Sprachausgabe hörbar. Der Rest des Moduls
// bleibt echt (`useVoice` ist ein Zustand-Speicher, den halbe Bauteile brauchen).
vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn() };
});

import { SerienTrainer } from "../src/components/typing/SerienTrainer";
import {
  allowedFromIntroduced,
  copyFor,
  emptyProgress,
  playerLevel,
  speakUi,
  unlockedSerien,
} from "../src/lib/typing";
import type { Stufe, TypingProgress } from "../src/lib/typing";

/** Ein Lernstand, der die T2-Buchstaben beherrscht (wie typing-textwelt-buecherei). */
const INTRODUCED_T2 = [
  "f", "j", "d", "k", "s", "l", "a", "ö",
  "e", "n", "i", "r", "t",
  "h", "u", "c", "g", "m", "o", "b", "w",
];

/** So viel XP, dass die Stufe sicher NICHT 1 ist - sonst prüfte man die Vorgabe. */
const XP = 640;

function stand(): TypingProgress {
  return { ...emptyProgress(), xp: XP, introduced: [...INTRODUCED_T2] };
}

/** Erwartete Antwort - Wortlaut aus dem Profil, Zahl aus der XP-Rechnung. */
function erwartet(stufe: Stufe): string {
  return `${copyFor(stufe).progressLabel} ${playerLevel(XP).level}`;
}

/** Sammelt jede Antwort auf Alt+L, solange der Aufruf läuft. */
function alsAntworten(fn: () => void): string[] {
  const gehoert: string[] = [];
  const horcher = (e: Event) => gehoert.push((e as CustomEvent<string>).detail);
  window.addEventListener("tippen-announce-level", horcher);
  try {
    fn();
  } finally {
    window.removeEventListener("tippen-announce-level", horcher);
  }
  return gehoert;
}

/** Alt+L auslösen - genau das Ereignis, das `TippenTrainerPage` wirft. */
function altL(): string[] {
  let gehoert: string[] = [];
  act(() => {
    gehoert = alsAntworten(() => {
      window.dispatchEvent(new Event("tippen-request-level"));
    });
  });
  return gehoert;
}

async function zeigeBuecherei(stufe: Stufe, initialSlug?: string) {
  const p = stand();
  render(
    <SerienTrainer
      loadFn={async () => p}
      saveFn={() => {}}
      stufe={stufe}
      lang="de"
      initialSlug={initialSlug}
    />,
  );
  // Auf den geladenen Spielstand warten (vorher steht nur „Lädt …" da). Unter
  // Suite-Last dauert die einmalige Korpus-Initialisierung länger als die
  // Standard-Wartezeit - Harness-Artefakt, darum ausdrücklich warten.
  await waitFor(
    () => expect(screen.queryByText(/^Lädt/)).not.toBeInTheDocument(),
    { timeout: 15000 },
  );
}

beforeEach(() => {
  vi.mocked(speakUi).mockClear();
});

afterEach(() => {
  cleanup();
});

describe("Alt+L in der Buecherei · die Stufe wird beantwortet", () => {
  it("die Buecherei-Liste antwortet mit GENAU einer Ansage", async () => {
    await zeigeBuecherei("kids");
    expect(altL()).toEqual([erwartet("kids")]);
  });

  it("die Antwort erreicht Einblendung, Braillezeile und Sprachausgabe", async () => {
    await zeigeBuecherei("kids");
    const label = erwartet("kids");
    altL();

    // 1. Fürs Auge: die Pille (aria-hidden, darum über den Text gesucht).
    expect(screen.getByText(`📊 ${label}`)).toBeInTheDocument();
    // 2. Für Sprachausgabe UND Braillezeile: die Live-Region. Sie wird erst
    //    geleert und 50 ms später gefüllt - sonst liest NVDA zwei GLEICHE
    //    Meldungen hintereinander nicht erneut.
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe(label),
    );
    // 3. App-eigenes Vorlesen.
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith(label);
  });

  it("zweimal Alt+L wird zweimal beantwortet (kein haengengebliebener Text)", async () => {
    await zeigeBuecherei("kids");
    expect(altL()).toEqual([erwartet("kids")]);
    expect(altL()).toEqual([erwartet("kids")]);
  });
});

describe("Alt+L in der Buecherei · der Wortlaut folgt der Stufe", () => {
  it("kids und erwachsen bekommen verschiedene Woerter - beide aus copyFor", async () => {
    // Erst festhalten, dass die Stufen sich ÜBERHAUPT unterscheiden: sonst
    // ginge der Vergleich unten auch dann durch, wenn beide dasselbe sagen.
    expect(copyFor("kids").progressLabel).not.toBe(
      copyFor("erwachsen").progressLabel,
    );

    await zeigeBuecherei("kids");
    expect(altL()).toEqual([erwartet("kids")]);
    cleanup();

    await zeigeBuecherei("erwachsen");
    expect(altL()).toEqual([erwartet("erwachsen")]);
  });
});

describe("Alt+L in der Buecherei · keine Doppelantwort", () => {
  it("im Leser antwortet der Trainer einmal - und spricht genau einmal", async () => {
    // Eine Serie waehlen, die dieser Lernstand wirklich hergibt (statt einen
    // Namen hinzuschreiben, der beim naechsten Korpus-Umbau verschwindet).
    const offen = unlockedSerien(allowedFromIntroduced(INTRODUCED_T2, "de"), "kids", "de", "de");
    expect(offen.length).toBeGreaterThan(0);

    await zeigeBuecherei("kids", offen[0].slug);
    // Der Leser steht (Etappen-Anzeige), die Buecherei-Liste ist weg.
    await waitFor(
      () => expect(screen.getByText(/Etappe 1 von/i)).toBeInTheDocument(),
      { timeout: 15000 },
    );

    const label = erwartet("kids");
    // GENAU eine Ansage - die drei Trainer sind exklusiv, es darf nie zweimal
    // geantwortet werden.
    expect(altL()).toEqual([label]);
    // …und GENAU einmal gesprochen: Im Leser gibt `TypingSession` aus, der
    // `SerienTrainer` haelt sich heraus. Faellt der Waechter `activeSlug`, sagt
    // Alt+L die Stufe doppelt.
    await waitFor(() =>
      expect(
        vi.mocked(speakUi).mock.calls.filter(([t]) => t === label),
      ).toHaveLength(1),
    );
  });
});

describe("Alt+L in der Buecherei · nach dem Aushaengen ist Ruhe", () => {
  it("kein haengengebliebener Ereignis-Empfaenger", async () => {
    await zeigeBuecherei("kids");
    expect(altL()).toHaveLength(1);
    cleanup();
    expect(altL()).toEqual([]);
  });
});
