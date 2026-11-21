/**
 * ★★★ E11a-2 (26.09.2026): DAS DÉFI-FORMULAR WIRKLICH AUF FRANZÖSISCH -
 * GERENDERT, NICHT NUR DIE TABELLE.
 *
 * `tests/tastenflow-franzoesisch-bereiche.test.ts` (E11a) prüft die
 * exportierten `fr`-Tabellen der fünf Bauplan-Bereiche - ausdrücklich NICHT
 * den gerenderten Bildschirm, weil `sprache` dort weiterhin die
 * oberflächen-sichere, zweiwertige Fassung war (`oberflaechenSprache`,
 * `lib/bedienSprache/sprache.ts` - siehe Dateikopf dort und
 * BEFUND-2026-09-25-E11A-OBERFLAECHE.md §2).
 *
 * Für das DÉFI-FORMULAR (`KlassenmatchEinladung.tsx`, `KlassenmatchLobby.tsx`)
 * gilt das jetzt nicht mehr: Beide lesen seit E11a-2 `spracheGewaehlt`
 * (die WIRKLICHE Wahl) statt der gekappten `sprache` - derselbe, schon
 * geprüfte Weg wie bei der Hilfe (E11b, `waehleUebersetzung`). Dieser Test
 * bewacht das GERENDERTE Ergebnis, mit demselben Deutsch-Fänger wie beim
 * Englischen (EN5, `tests/tastenflow-englisch-challenge-match.test.tsx`).
 *
 * ⚠️ Weiterhin NICHT Teil dieser Datei: `KlassenmatchLauf.tsx` und
 * `KlassenmatchErgebnis.tsx` - die gehören zum LAUFENDEN/ABGESCHLOSSENEN
 * Défi. ★ E11a-4 (26.09.2026): sie lesen inzwischen ebenfalls
 * `spracheGewaehlt` und zeigen für „fr" echtes Französisch - eigener Test
 * `tests/tastenflow-franzoesisch-uebungsseite-rest.test.tsx`
 * (BEFUND-2026-09-26-E11A4-OBERFLAECHE-REST.md).
 *
 * ★★★ DIE GEGENPROBE (wie immer): dieselben Zustände in der deutschen
 * Bedienung müssen viele Funde liefern - ein Fänger, der nichts liest, weil
 * er nichts findet, sähe sonst genauso grün aus.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
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
import { KlassenmatchEinladung } from "@/components/typing/KlassenmatchEinladung";
import { KlassenmatchLobby } from "@/components/typing/KlassenmatchLobby";
import type { Match, MatchStand } from "@/lib/typing/klassenmatch";
import { speakUi, speakUiAlways } from "@/lib/typing/voice";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";

const MATCH_DAUER_MS = 5 * 60 * 1000;

function stelleBedienung(sprache: BedienSprache | null) {
  localStorage.clear();
  if (!sprache) return;
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}

function match(over: Partial<Match> = {}): Match {
  const start = Date.now() - 75_000;
  return {
    id: "m1",
    classCode: "K1",
    hostUid: "sarah",
    hostName: "Sarah",
    status: "laeuft",
    startMs: start,
    endeMs: start + MATCH_DAUER_MS,
    dauerMin: 5,
    createdMs: start - 20_000,
    ...over,
  };
}

function stand(over: Partial<MatchStand> = {}): MatchStand {
  return {
    id: "s",
    matchId: "m1",
    classCode: "K1",
    pupilUid: "sarah",
    name: "Sarah",
    status: "schreibt",
    zeichen: 300,
    fehler: 2,
    apm: 150,
    wert: 0,
    updatedMs: Date.now(),
    ...over,
  };
}

const STAENDE: MatchStand[] = [stand(), stand({ id: "s2", pupilUid: "toprak", name: "Toprak" })];

function gesprochen(): [string, string | undefined][] {
  return [
    ...vi.mocked(speakUi).mock.calls.map((c) => [String(c[0]), c[3] as string | undefined]),
    ...vi.mocked(speakUiAlways).mock.calls.map((c) => [String(c[0]), c[2] as string | undefined]),
  ] as [string, string | undefined][];
}

function fange(): string[] {
  const funde = new Set(findeDeutsch(document.body));
  for (const [text, stimme] of gesprochen()) {
    if (stimme === "de") continue;
    const f = pruefeText("gesprochen", text);
    if (f) funde.add(f);
  }
  return [...funde];
}

type Zustand = { name: string; aufbau: () => void | Promise<void>; mindestens?: number };

const ZUSTAENDE: Zustand[] = [
  {
    name: "Défi · Einladung",
    aufbau: () => {
      zeige(<KlassenmatchEinladung hostName="Sarah" onDabei={vi.fn()} onNichtJetzt={vi.fn()} />);
    },
  },
  {
    name: "Défi · Wartefenster als Gastgeber, noch niemand dabei",
    aufbau: () => {
      zeige(
        <KlassenmatchLobby
          match={match({ status: "einladung", startMs: 0, endeMs: 0, hostUid: "franz", hostName: "Franz" })}
          staende={[]}
          binGastgeber
          imCountdown={false}
          restMs={0}
          kannStarten={false}
          onStarten={vi.fn()}
          onAbbrechen={vi.fn()}
        />,
      );
    },
  },
  {
    name: "Défi · Wartefenster als Gast, zwei dabei",
    aufbau: () => {
      zeige(
        <KlassenmatchLobby
          match={match({ status: "einladung", startMs: 0, endeMs: 0, dauerMin: 0.5 })}
          staende={STAENDE}
          binGastgeber={false}
          imCountdown={false}
          restMs={0}
          kannStarten={false}
          onStarten={vi.fn()}
          onAbbrechen={vi.fn()}
        />,
      );
    },
  },
  {
    name: "Défi · Countdown läuft",
    aufbau: () => {
      zeige(
        <KlassenmatchLobby
          match={match({ status: "einladung", startMs: 0, endeMs: 0 })}
          staende={STAENDE}
          binGastgeber
          imCountdown
          restMs={2000}
          kannStarten={false}
          onStarten={vi.fn()}
          onAbbrechen={vi.fn()}
        />,
      );
    },
  },
];

beforeEach(() => {
  vi.mocked(speakUi).mockClear();
  vi.mocked(speakUiAlways).mockClear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("★★★ Deutsch-Fänger: das Défi-Formular in der französischen Bedienung", () => {
  for (const z of ZUSTAENDE) {
    it(`FR · ${z.name}: kein deutsches Wort`, async () => {
      stelleBedienung("fr");
      await act(async () => {
        await z.aufbau();
      });
      expect(fange()).toEqual([]);
      // Und es steht wirklich etwas da - eine leere Seite wäre auch „ohne Deutsch".
      expect((document.body.textContent ?? "").match(/[A-Za-zÀ-ÿ]{3,}/g)?.length ?? 0).toBeGreaterThan(3);
    });
  }
});

describe("★★★ GEGENPROBE: derselbe Fänger über die deutsche Bedienung", () => {
  for (const z of ZUSTAENDE) {
    it(`DE · ${z.name}: der Fänger findet Deutsch`, async () => {
      stelleBedienung("de");
      await act(async () => {
        await z.aufbau();
      });
      expect(findeDeutsch(document.body).length).toBeGreaterThanOrEqual(z.mindestens ?? 2);
    });
  }
});

describe("Das Défi-Formular auf Französisch im Einzelnen", () => {
  it('★ die Einladung nennt "Match de la classe", nicht "Klassenmatch"/"Class Match" (Glossar §9.2)', () => {
    stelleBedienung("fr");
    zeige(<KlassenmatchEinladung hostName="Sarah" onDabei={vi.fn()} onNichtJetzt={vi.fn()} />);
    expect(screen.getByText("Match de la classe")).toBeTruthy();
    expect(screen.getByRole("button", { name: "J'en suis" })).toBeTruthy();
  });

  it("★ das Wartefenster als Gastgeber zeigt einen französischen Start-Knopf und spricht Französisch", () => {
    stelleBedienung("fr");
    zeige(
      <KlassenmatchLobby
        match={match({ status: "einladung", startMs: 0, endeMs: 0, hostUid: "franz", hostName: "Franz" })}
        staende={[]}
        binGastgeber
        imCountdown={false}
        restMs={0}
        kannStarten={false}
        onStarten={vi.fn()}
        onAbbrechen={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /^(Démarrer|Commencer)$/ }));
    expect(vi.mocked(speakUi).mock.calls.some((c) => c[3] === "fr")).toBe(true);
  });
});
