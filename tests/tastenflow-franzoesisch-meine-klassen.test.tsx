/**
 * ★★★ E11a-3 (26.09.2026): „MEINE KLASSEN" (TASTENFLOW) WIRKLICH AUF
 * FRANZÖSISCH - GERENDERT, NICHT NUR DIE TABELLE.
 *
 * `TastenflowReiter.tsx` liest seit E11a-3 `spracheGewaehlt` (die WIRKLICHE
 * Sprachwahl) statt der oberflächen-sicheren, gekappten `sprache` -
 * `REITER_TEXTE.fr` (aus E11a) ist damit zum ERSTEN MAL wirklich erreichbar,
 * dazu kaskadierend `Klassenueberblick.tsx` und rund ein Dutzend Bausteine
 * in `lib/typing/` (siehe BEFUND-2026-09-26-E11A3-OBERFLAECHE-BAUTEILE.md).
 *
 * Dieser Test bewacht das GERENDERTE Ergebnis, mit demselben Deutsch-Fänger
 * wie beim Englischen (EN6a, `tests/tastenflow-englisch-lehrkraft-ansicht.test.tsx`)
 * und beim Défi-Formular (E11a-2, `tests/tastenflow-franzoesisch-defi-formular.test.tsx`).
 *
 * ★★★ DIE GEGENPROBE (wie immer): derselbe Aufbau in der deutschen Bedienung
 * muss viele Funde liefern - ein Fänger, der nichts liest, weil er nichts
 * findet, sähe sonst genauso grün aus.
 *
 * ⚠️ Bewusst NICHT Teil dieses Tests: der Excel-Export (eigener Wächter,
 * `tests/tastenflow-leistung-export.test.ts`, dort keine fr-Fassung nötig,
 * weil das Format am gerenderten DOM nicht sichtbar ist) und die Panels
 * „Tippchallenge"/„Eigene Übung" (Défi/Tippchallenge-Prüfer, E13a).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speakSequence: vi.fn() };
});

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
  playKeySound: vi.fn(),
  playKeyTick: vi.fn(),
  playErrorSound: vi.fn(),
  playLineSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { BedienSpracheProvider, type BedienSprache } from "../src/lib/bedienSprache";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { Klassenueberblick } from "@/components/lernwerkstatt/klasse/Klassenueberblick";
import type { PupilData } from "@/components/typing/PupilStatsPanel";
import { computePupilStats, emptyProgress, typingBackend } from "@/lib/typing";
import type { TaskEvent, TypingAccount } from "@/lib/typing/account";
import { findeDeutsch } from "./helfer/deutschFaenger";

function stelleBedienung(sprache: BedienSprache) {
  localStorage.clear();
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}

// ── Klassenüberblick: eine kleine, aber echte Klasse (zwei Kinder, ein
//    abgeschlossenes Wochenziel, damit Kennzahlen UND Wochenaufgaben-Satz
//    beide etwas zu sagen haben) ─────────────────────────────────────────────

const JETZT = new Date(2026, 8, 19, 12, 0, 0).getTime();

function zeilen(tag: [number, number], n: number, ms: number): TaskEvent[] {
  const [monat, t] = tag;
  const start = new Date(2026, monat - 1, t, 10, 0, 0).getTime();
  return Array.from({ length: n }, (_, i) => ({
    ts: start + i * 60_000,
    lesson: "l1",
    chars: 100,
    errors: 1,
    ms,
  }));
}

function daten(name: string, events: TaskEvent[]): PupilData {
  const pupil = {
    id: name.toLowerCase(),
    role: "schueler",
    name,
    classCode: "3B",
    createdAt: 1,
  } as TypingAccount;
  return { pupil, progress: emptyProgress(), events, stats: computePupilStats(events) };
}

const DATEN: PupilData[] = [
  daten("Aline", [...zeilen([8, 26], 6, 30_000), ...zeilen([9, 9], 6, 28_000)]),
  daten("Baptiste", [...zeilen([8, 26], 6, 45_000), ...zeilen([9, 9], 6, 40_000)]),
];

function zeigeUeberblick() {
  vi.setSystemTime(JETZT);
  return zeige(<Klassenueberblick datas={DATEN} gesperrt={[]} />);
}

/**
 * ★ „des" ist Deutsch UND Französisch (Artikel „der/das/des" bzw. die
 * Zusammenziehung „de" + „les") - derselbe Grund wie in
 * `tests/tastenflow-franzoesische-hilfe.test.tsx` (E11b): der grosse
 * `deutschFaenger` träfe echtes Französisch. Ein Fund, der NUR „des" enthält,
 * ist ein Fehlalarm; ein Fund mit einem ECHTEN deutschen Wort bleibt.
 */
function ohneFranzoesischeHomografe(funde: string[]): string[] {
  // ★ E11a-5: „du" dazu - Artikel im Französischen („semaine du 14 sept."),
  // derselbe Grund wie „des" (E11a-4 filtert beide).
  const HOMOGRAFE = new Set(["des", "du"]);
  return funde.filter((f) => {
    const woerter = f.match(/\[([^\]]*)\]$/)?.[1]?.split(", ") ?? [];
    return woerter.some((w) => !HOMOGRAFE.has(w.toLowerCase()));
  });
}

describe("★★★ Klassenüberblick auf Französisch (E11a-3)", () => {
  beforeEach(() => {
    stelleBedienung("fr");
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    localStorage.clear();
  });

  it("wirklich Französisch: kein deutsches Wort im ganzen Überblick (Titel, Kennzahlen, Score-Leiste)", async () => {
    let ueberblick!: HTMLElement;
    await act(async () => {
      const { container } = zeigeUeberblick();
      ueberblick = container;
    });
    // Sichtbare Anker, mit denen die Etappe steht oder fällt.
    expect(screen.getByText("Aperçu de la classe")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Mois dans l'aperçu de la classe" })).toBeTruthy();
    expect(screen.getByText("Frappes/min")).toBeTruthy();
    expect(screen.getByText("Précision")).toBeTruthy();
    expect(screen.getByText("Scores dans la classe")).toBeTruthy();
    expect(screen.queryByText("Klassenüberblick")).toBeNull();
    expect(ohneFranzoesischeHomografe(findeDeutsch(ueberblick))).toEqual([]);
  });

  it("★★★ GEGENPROBE: derselbe Überblick deutsch liefert viele Funde", async () => {
    stelleBedienung("de");
    let ueberblick!: HTMLElement;
    await act(async () => {
      const { container } = zeigeUeberblick();
      ueberblick = container;
    });
    expect(screen.getByText("Klassenüberblick")).toBeTruthy();
    expect(findeDeutsch(ueberblick).length).toBeGreaterThan(5);
  });
});

describe("★★★ Meine Klassen (TastenflowReiter) trägt lang=fr und lädt französisch (E11a-3)", () => {
  beforeEach(() => {
    stelleBedienung("fr");
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("„Chargement …“ statt „Lädt …“, solange der Stand noch unterwegs ist", async () => {
    vi.spyOn(typingBackend(), "getProgress").mockImplementation(() => new Promise(() => {}));
    zeige(<TastenflowReiter pupils={[]} onChanged={() => {}} />);
    expect(screen.getByRole("status").textContent).toBe("Chargement …");
  });

  it("ohne Kinder: die Ansicht trägt lang=fr an ihrer Wurzel (wie das Défi-Formular, E11a-2)", async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = zeige(<TastenflowReiter pupils={[]} onChanged={() => {}} />));
    });
    const wurzel = container.querySelector("[aria-busy], [lang]") ?? container.firstElementChild;
    expect(wurzel?.getAttribute("lang")).toBe("fr");
  });
});
