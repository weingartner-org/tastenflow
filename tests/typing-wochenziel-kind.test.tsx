/**
 * ★★★ W4 (19.09.2026, Bauplan §„W4 Kind") - die Kind-Sicht auf das neue
 * Wochenziel (Minuten je Kalenderwoche, `wochenziel.ts`, OHNE Einheiten).
 *
 * Zwei Gruppen:
 *  1. [[WeeklyGoalRings]] direkt - der EINE Ring, seine Zahlen, das
 *     Nachhol-Extra, die gesperrte Stunde und die Alt+D-Ansage in beiden
 *     Anrede-Registern (`isFormal`).
 *  2. Das Wochenziel-Fenster in `TippenTrainerPage` (ersetzt seit heute das
 *     frühere Tagesziel-Fenster vom 16.09.2026) - einmal je Ziel-Woche, nicht
 *     bei einem Wochenziel von 0.
 *
 * ★ `resetPracticeClock()` in jedem `beforeEach`: Ohne sie hinge
 *   `pendingPracticeMs()` (Modul-Zustand) am vorigen Test - dieselbe Falle,
 *   die die ÄLTERE Ring-Fassung schon mit unscharfen `toBeGreaterThan`-
 *   Grenzen umschiffen musste. Mit ihr ist „25 von 60" genau 25, nicht
 *   „25 plus ein bisschen".
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  addPupil,
  aktuelleWocheKey,
  createClass,
  isoWeekKey,
  recordEvent,
  registerTeacher,
  resetPracticeClock,
  stundeSperren,
  wochenStart,
  wochenzielAnsage,
  wochenzielFensterGezeigt,
  WOCHENZIEL_GRENZE,
  type TaskEvent,
  type TypingAccount,
} from "@/lib/typing";
import { WeeklyGoalRings } from "@/components/typing/WeeklyGoalRings";
import { TippenTrainerPage } from "@/features/public/TippenTrainerPage";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { einrichtungFertigMerken } from "@/lib/typing/einrichtung";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

/**
 * Mittwoch der Woche „Montag, 10.08.2026, 08:00" (dieselbe Testwoche wie
 * `typing-wochenziel-neu.test.ts`) - „jetzt" für alle Tests hier.
 */
const JETZT = new Date(2026, 7, 12, 10, 0, 0).getTime();
/** Dienstag der VORWOCHE, 10:00 - für den Nachhol-Test. */
const VORWOCHE_DIENSTAG = new Date(2026, 7, 4, 10, 0, 0).getTime();
const MIN = 60_000;

/**
 * Der ISO-Wochenschlüssel der VORWOCHE - „gilt seit" für die Testziele.
 * ⚠️ NICHT ein sehr altes Datum wie „2000-W01" nehmen: Der Ring rechnet das
 * Nachholen über `wochenzielGeschichte`, die vom ERSTEN Abschnitt bis heute
 * JEDE Woche aufzählt - ein Abschnitt aus dem Jahr 2000 liesse sie 26 Jahre
 * lang (nicht existente) offene Wochen aufsummieren.
 */
const AB_VORWOCHE = isoWeekKey(wochenStart(VORWOCHE_DIENSTAG, WOCHENZIEL_GRENZE));

beforeEach(() => {
  localStorage.clear();
  resetPracticeClock();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(JETZT);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

/** Ein Kind mit Klasse und (optional) einem flachen Wochenziel ab {@link AB_VORWOCHE}. */
function pupil(
  minuten: number | null,
  extra: Partial<TypingAccount> = {},
): { acc: TypingAccount; classCode: string } {
  const t = registerTeacher("L", `l${Math.random()}@s.at`, "geheim1");
  if (!t.ok) throw new Error("Lehrkraft");
  const cls = createClass(t.value.id, "3b");
  if (!cls.ok) throw new Error("Klasse");
  const p = addPupil(cls.value.code, "Kind", "1234", extra.stufe ?? "b");
  if (!p.ok) throw new Error("Kind");
  const acc: TypingAccount = {
    ...p.value,
    wochenzielVerlauf: minuten !== null ? [{ ab: AB_VORWOCHE, minuten }] : [],
    ...extra,
  };
  return { acc, classCode: cls.value.code };
}

/** `minuten` Minuten reine Tippzeit, endend genau bei `endeMs` (Standard: JETZT). */
function practiceBis(id: string, minuten: number, endeMs: number = JETZT): void {
  const start = endeMs - minuten * MIN;
  for (let i = 1; i <= minuten; i++) {
    const e: TaskEvent = {
      ts: start + i * MIN,
      lesson: "adaptiv",
      chars: 40,
      errors: 0,
      ms: MIN,
      activeMs: MIN,
    };
    recordEvent(id, e);
  }
}

/** `minuten` Minuten reine Tippzeit, beginnend bei `startMs`. */
function practiceAb(id: string, minuten: number, startMs: number): void {
  for (let i = 1; i <= minuten; i++) {
    const e: TaskEvent = {
      ts: startMs + i * MIN,
      lesson: "adaptiv",
      chars: 40,
      errors: 0,
      ms: MIN,
      activeMs: MIN,
    };
    recordEvent(id, e);
  }
}

describe("WeeklyGoalRings (W4): ein Ring in Minuten je Woche", () => {
  it("zeigt „25 von 60 Min.\" - kompakt UND im Kopf-Format", async () => {
    const { acc } = pupil(60);
    practiceBis(acc.id, 25);

    const { unmount } = render(<WeeklyGoalRings account={acc} kompakt />);
    await screen.findByText("Wochenziel");
    expect(screen.getByText("von 60 Min.")).toBeTruthy();
    expect(screen.getByText("25")).toBeTruthy();
    expect(screen.getByRole("img").getAttribute("aria-label")).toMatch(
      /Dein Wochenziel: 25 von 60 Minuten/,
    );
    unmount();

    render(<WeeklyGoalRings account={acc} />);
    await screen.findByText("Wochenziel");
    expect(screen.getByText("von 60 Min.")).toBeTruthy();
    expect(screen.getByText("25")).toBeTruthy();
  });

  it("Wochenziel erreicht: voller Ring mit Haken, kein „Noch …\" mehr", async () => {
    const { acc } = pupil(60);
    practiceBis(acc.id, 60);

    render(<WeeklyGoalRings account={acc} kompakt />);
    await screen.findByText("Wochenziel");
    expect(screen.getByText("✓")).toBeTruthy();
    const aria = screen.getByRole("img").getAttribute("aria-label") ?? "";
    expect(aria).toMatch(/60 von 60 Minuten, geschafft!/);
    await waitFor(() =>
      expect(wochenzielAnsage()).toBe("Wochenziel geschafft: 60 von 60 Minuten."),
    );
  });

  it("Nachholen an: offene Minuten der Vorwoche stehen als „+40 Min. nachholen\" daneben", async () => {
    const { acc } = pupil(60, { goalCatchUp: true });
    // Vorwoche: nur 20 von 60 Minuten geübt → 40 offen.
    practiceAb(acc.id, 20, VORWOCHE_DIENSTAG);
    // Laufende Woche: noch nichts geübt.

    render(<WeeklyGoalRings account={acc} kompakt />);
    await screen.findByText("Wochenziel");
    expect(screen.getByText("+40 Min. nachholen")).toBeTruthy();
    const aria = screen.getByRole("img").getAttribute("aria-label") ?? "";
    expect(aria).toMatch(/Dazu 40 Minuten zum Nachholen\./);
    await waitFor(() =>
      expect(wochenzielAnsage()).toBe(
        "Wochenziel: 0 von 60 Minuten. Noch 60 Minuten bis Montag, 8 Uhr. " +
          "Dazu 40 Minuten zum Nachholen.",
      ),
    );
  });

  it("eine gesperrte Stunde zählt nicht fürs Wochenziel (wohl aber sonst)", async () => {
    const { acc, classCode } = pupil(60);
    // Die Klasse sperrt die laufende Stunde (Montag … JETZT+60min) - JETZT
    // steht schon fest (beforeEach), stundeSperren() liest also genau das.
    stundeSperren(classCode);
    // 30 Minuten, alle INNERHALB der gesperrten Stunde.
    practiceAb(acc.id, 30, JETZT);

    render(<WeeklyGoalRings account={acc} kompakt />);
    await screen.findByText("Wochenziel");
    await waitFor(() => {
      const aria = screen.getByRole("img").getAttribute("aria-label") ?? "";
      expect(aria).toMatch(/Dein Wochenziel: 0 von 60 Minuten/);
    });
    expect(screen.queryByText("30")).toBeNull();
  });

  it("Alt+D-Satz ist in beiden Anrede-Registern derselbe (die Ansage nennt kein Fürwort)", async () => {
    const { acc: kindKonto } = pupil(60);
    practiceBis(kindKonto.id, 25);
    const { unmount } = render(<WeeklyGoalRings account={kindKonto} kompakt />);
    await screen.findByText("Wochenziel");
    expect(screen.getByRole("img").getAttribute("aria-label")).toMatch(/^Dein Wochenziel:/);
    await waitFor(() =>
      expect(wochenzielAnsage()).toBe(
        "Wochenziel: 25 von 60 Minuten. Noch 35 Minuten bis Montag, 8 Uhr.",
      ),
    );
    unmount();

    const { acc: erwachsenKonto } = pupil(60, { stufe: "erwachsen" });
    practiceBis(erwachsenKonto.id, 25);
    render(<WeeklyGoalRings account={erwachsenKonto} kompakt />);
    await screen.findByText("Wochenziel");
    // Seit 19.09.2026 auch ab 16 per Du - „Sie" liest nur die Lehrkraft.
    expect(screen.getByRole("img").getAttribute("aria-label")).toMatch(/^Dein Wochenziel:/);
    await waitFor(() =>
      // ★ Dieselbe Zahlen-Ansage wie im Du - der Satz nennt bewusst kein
      // „du"/„Sie" (siehe goalAnsage.ts).
      expect(wochenzielAnsage()).toBe(
        "Wochenziel: 25 von 60 Minuten. Noch 35 Minuten bis Montag, 8 Uhr.",
      ),
    );
  });
});

describe("Das Wochenziel-Fenster in TippenTrainerPage (W4, ersetzt das Tagesziel-Fenster)", () => {
  beforeEach(() => {
    einrichtungFertigMerken();
    ohneBildschirmTastatur();
    _resetTypingBackend();
    useTypingAuth.setState({ account: null });
  });

  function zeigeSeite(account: TypingAccount) {
    useTypingAuth.setState({ account });
    return render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
  }

  async function wartetAufSeite() {
    await waitFor(() =>
      expect(document.querySelector('[data-typing-field="practice"]')).toBeTruthy(),
    );
  }

  it("kommt einmal, wenn das Wochenziel erreicht ist - nicht wieder in derselben Woche", async () => {
    const { acc } = pupil(30);
    practiceBis(acc.id, 30);

    const { unmount } = zeigeSeite(acc);
    await wartetAufSeite();
    await screen.findByText("Wochenziel geschafft!");
    expect(wochenzielFensterGezeigt(aktuelleWocheKey(JETZT))).toBe(true);
    unmount();

    // Zweiter Aufruf, dieselbe Woche, derselbe Stand (Merker in localStorage) -
    // das Fenster kommt NICHT wieder.
    zeigeSeite(acc);
    await wartetAufSeite();
    expect(screen.queryByText("Wochenziel geschafft!")).toBeNull();
  });

  it("★ EN10-Befund: kommt NICHT, wenn nur die gesperrte Stunde das Ziel füllen würde - auch wenn die Sperre spät vom Server kommt", async () => {
    // Nachgestellt, was EN10 im Browser sah: „Weekly goal reached!" während
    // der Ring 33 von 45 zeigte. Der erste Durchlauf rechnete mit einer noch
    // LEEREN Sperr-Liste (die Klasse war noch nicht geladen), zählte die
    // gesperrte Stunde mit und merkte das Fenster für die ganze Woche.
    const { acc, classCode } = pupil(30);
    stundeSperren(classCode);
    practiceAb(acc.id, 30, JETZT); // alle 30 Minuten IN der gesperrten Stunde
    const b = typingBackend();
    const echt = b.getClass.bind(b);
    vi.spyOn(b, "getClass").mockImplementation(
      (code: string) => new Promise((fertig) => setTimeout(() => fertig(echt(code)), 300)),
    );

    zeigeSeite(acc);
    await wartetAufSeite();
    await new Promise((r) => setTimeout(r, 800));
    expect(screen.queryByText("Wochenziel geschafft!")).toBeNull();
    expect(wochenzielFensterGezeigt(aktuelleWocheKey(JETZT))).toBe(false);
  });

  it("kommt NICHT bei einem Wochenziel von 0", async () => {
    const { acc } = pupil(null); // kein Wochenziel gesetzt
    practiceBis(acc.id, 120); // viel geübt - spielt keine Rolle ohne Ziel

    zeigeSeite(acc);
    await wartetAufSeite();
    expect(screen.queryByText("Wochenziel geschafft!")).toBeNull();
    expect(wochenzielFensterGezeigt(aktuelleWocheKey(JETZT))).toBe(false);
  });
});
