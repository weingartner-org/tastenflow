/**
 * ★★★ DEUTSCH-FÄNGER FÜR TIPPCHALLENGE UND KLASSENMATCH (EN5, 19.09.2026).
 *
 * Bereich: alles, was ein KIND von der Tippchallenge und vom Klassenmatch
 * sieht und hört - Startbildschirm, fehlender Text, Lauf (samt Alt + X und
 * „abgeben"), abgegeben, Ergebnis-Karte (gewertet und zu kurz); Einladung,
 * Wartefenster (Gastgeber und Gast), Countdown mit Rückfrage, Lauf mit
 * Rückfrage, Platzierungsliste; dazu die Meldungen von `useKlassenmatch`.
 *
 * Gemessen wird am gerenderten DOM (`tests/helfer/deutschFaenger.ts`, der
 * ganze `<body>` - Fenster hängen als Portal dort) und an allem, was über
 * `speakUi`/`speakUiAlways` gesprochen wird, ausser mit der deutschen Stimme
 * (die spricht den deutschen INHALT - Absicht, Glossar §4).
 *
 * ★★ DER PRÜFUNGSTEXT BLEIBT DEUTSCH (Johannes 12.09.2026, Probestück §1
 * Nr. 3): Es gibt keine englischen Challenge-Texte. Er steht in `lang="de"`
 * (Tippfeld und Zeile), der Titel des Textes in der Ergebnis-Karte ebenso -
 * der Fänger nimmt beides aus, weil es so gewollt ist.
 *
 * ★ Der Schliessen-Knopf „✕" des gemeinsamen `Modal` war hier zuerst als
 * Ausnahme ausgenommen; seit der Abnahme (19.09.2026) fragt `Modal.tsx` den
 * Sprach-Anbieter wie die Kopfzeile - ohne aktiven Anbieter bleibt er
 * deutsch, also für die anderen Apps unverändert. Keine Ausnahme mehr.
 *
 * ⚠️ DIE BILDSCHIRM-TASTATUR IST AUS (`ohneBildschirmTastatur`, wie im
 * Probestück-Fänger): Ihre Tastenkappen und Finger-Legende gehören
 * `Keyboard.tsx`/`KeyboardPanel.tsx` - Etappe EN1, nicht EN5. Im Match steht
 * statt ihrer ohnehin das Ranking.
 *
 * ★★★ DIE GEGENPROBE: dieselben Zustände in der deutschen Bedienung müssen
 * VIELE Funde liefern - ein Fänger, der nichts findet, weil er nichts liest,
 * sähe sonst genauso grün aus.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
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
import { SchreibprobeLauf } from "@/components/typing/SchreibprobeLauf";
import { SchreibprobeErgebnis } from "@/components/typing/SchreibprobeErgebnis";
import { KlassenmatchEinladung } from "@/components/typing/KlassenmatchEinladung";
import { KlassenmatchLobby } from "@/components/typing/KlassenmatchLobby";
import { KlassenmatchLauf } from "@/components/typing/KlassenmatchLauf";
import { KlassenmatchErgebnis } from "@/components/typing/KlassenmatchErgebnis";
import { StandZeile } from "@/components/typing/StandZeile";
import { useKlassenmatchAngebot } from "@/lib/typing/klassenmatchAngebot";
import {
  HINWEIS_CHALLENGE,
  HINWEIS_CHALLENGE_EN,
  HINWEIS_TABELLE,
  HINWEIS_TABELLE_EN,
  STEIGERUNG_HINWEIS,
  STEIGERUNG_HINWEIS_EN,
  hinweisTabelle,
  hinweiseChallenge,
  steigerungHinweis,
} from "@/lib/typing/schreibprobeHinweise";
import {
  LEERER_STAND,
  NIVEAU_DEFS,
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_EN,
  bereitSatz,
  niveauTexte,
  pruefungWort,
  pruefungWortMehrzahl,
  ratVorlesen,
  restGesprochen,
  stelleBezeichnung,
  textBezeichnung,
  type SchreibprobePlan,
} from "@/lib/typing/schreibprobe";
import { tastenName, werteAus, type Probenergebnis } from "@/lib/typing/schreibprobeAuswertung";
import {
  LEERER_FORTSCHRITT,
  type SchreibprobeStand,
} from "@/lib/typing/useSchreibprobe";
import {
  MATCH_DAUER_MS,
  MATCH_HINWEIS_LAEUFT,
  MATCH_HINWEIS_LAEUFT_EN,
  countdownAnsage,
  dabeiSatz,
  ehrenplatz,
  einladungSatz,
  matchBrailleSatz,
  matchHinweisLaeuft,
  matchHinweisSatz,
  matchRestGesprochen,
  matchZeitstand,
  platzSatz,
  rangliste,
  type Match,
  type MatchStand,
} from "@/lib/typing/klassenmatch";
import { MATCH_MELDUNGEN, useKlassenmatch } from "@/lib/typing/useKlassenmatch";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { _mockMatchesZuruecksetzen } from "@/lib/typing/matchMock";
import { speakUi, speakUiAlways } from "@/lib/typing/voice";
import { emptyProgress } from "@/lib/typing/progress";
import type { TypingAccount } from "@/lib/typing/account";
import { SHIFT_UNIT } from "@/lib/typing/letters";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

// ---------------------------------------------------------------------------
// Aufbau
// ---------------------------------------------------------------------------

/** Bedienung gewählt - so, wie der Sprachschalter oder `?bedienung=…` es tut. */
function stelleBedienung(sprache: BedienSprache | null) {
  localStorage.clear();
  if (!sprache) return;
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}

function Huelle({ children }: { children: ReactNode }) {
  return <BedienSpracheProvider>{children}</BedienSpracheProvider>;
}

/** Alles Gesprochene: `[text, sprache der Stimme]`. */
function gesprochen(): [string, string | undefined][] {
  return [
    ...vi.mocked(speakUi).mock.calls.map((c) => [String(c[0]), c[3] as string | undefined]),
    ...vi.mocked(speakUiAlways).mock.calls.map((c) => [String(c[0]), c[2] as string | undefined]),
  ] as [string, string | undefined][];
}

/**
 * ⚠️ Die EINE ausgenommene Fundstelle - der Schliessen-Knopf des gemeinsamen
 * `Modal` (siehe Dateikopf). Genau diese Zeile, sonst nichts.
 */

/**
 * ★ Ein EINZELNES „ö" ist eine Taste der DEUTSCHEN Tastatur, die geübt wird -
 * kein deutsches Wort („Home row (f j d k s l a ö)", die wackligen Tasten).
 * Der Fänger schlägt an jedem Umlaut an; ausgenommen werden hier nur
 * Fundstellen, deren sämtliche „Wörter" einzelne Zeichen sind.
 */
function nurTastenzeichen(fund: string): boolean {
  const woerter = fund.match(/\[([^\]]*)\]$/)?.[1]?.split(", ") ?? [];
  return woerter.length > 0 && woerter.every((w) => [...w].length === 1);
}

/**
 * Was der Fänger findet: der ganze `<body>`, dazu jede Ansage, die NICHT mit
 * der deutschen Stimme gesprochen wurde.
 */
function fange(): string[] {
  const funde = new Set(findeDeutsch(document.body));
  for (const [text, stimme] of gesprochen()) {
    if (stimme === "de") continue;
    const f = pruefeText("gesprochen", text);
    if (f) funde.add(f);
  }
  return [...funde].filter((f) => !nurTastenzeichen(f));
}

const KIND: TypingAccount = {
  id: "franz",
  role: "schueler",
  name: "Franz",
  classCode: "K1",
  createdAt: 1,
};

function plan(over: Partial<SchreibprobePlan> = {}): SchreibprobePlan {
  return {
    id: "sp-1",
    niveau: "start",
    startMs: Date.now() - 60_000,
    dauerMin: 10,
    textNr: 0,
    startZeile: 0,
    zuschlagProzent: 0,
    angelegtMs: Date.now() - 120_000,
    ...over,
  };
}

function probeStand(over: Partial<SchreibprobeStand> = {}): SchreibprobeStand {
  return {
    plan: plan(),
    phase: "offen",
    stand: { ...LEERER_STAND },
    geladen: true,
    einstiegBis: Date.now() + 9 * 60_000,
    beginne: vi.fn(),
    melde: vi.fn(),
    schliesseErgebnis: vi.fn(),
    gibAb: vi.fn(async (_e: Probenergebnis) => {}),
    fortschritt: LEERER_FORTSCHRITT,
    merkeFortschritt: vi.fn(),
    ...over,
  };
}

/**
 * Ein volles Ergebnis: gewertet, mit Vorlesezeit UND (altem) Zeitzuschlag,
 * wackligen Tasten samt Umschalttaste, Leertaste und „ö" (eine Taste der
 * DEUTSCHEN Tastatur - in der englischen Bedienung in `lang="de"`), und einem
 * deutschen Texttitel (Inhalt, `lang="de"`).
 */
function ergebnis(over: Partial<Parameters<typeof werteAus>[0]> = {}): Probenergebnis {
  const mal = (char: string, richtig: number, falsch: number) => [
    ...Array.from({ length: richtig }, () => ({ char, correct: true, ms: 200 })),
    ...Array.from({ length: falsch }, () => ({ char, correct: false })),
  ];
  return werteAus({
    probeId: "sp-1",
    niveau: "satz",
    textNr: 3,
    textTitel: "Der Fuchs und die Trauben",
    startZeile: 12,
    beginnMs: Date.now() - 600_000,
    endeMs: Date.now(),
    zeitMs: 600_000,
    zuschlagProzent: 25,
    wartezeitMs: 42_000,
    zeichen: 1400,
    fehler: 23,
    zeilen: 41,
    schreibMs: 520_000,
    anschlaege: [
      ...mal(SHIFT_UNIT, 5, 3),
      ...mal(" ", 20, 4),
      ...mal("ö", 3, 2),
      ...mal("k", 6, 2),
    ],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: true,
    ...over,
  });
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

const STAENDE: MatchStand[] = [
  stand(),
  stand({ id: "s2", pupilUid: "mia", name: "Mia", zeichen: 200, apm: 100, updatedMs: Date.now() - 2000 }),
  stand({ id: "s3", pupilUid: "ben", name: "Ben", zeichen: 100, apm: 50, updatedMs: Date.now() - 4000 }),
  stand({ id: "s4", pupilUid: "franz", name: "Franz", zeichen: 50, apm: 20, updatedMs: Date.now() - 6000 }),
];

function lauf(m: Match) {
  return zeige(
    <KlassenmatchLauf
      match={m}
      staende={STAENDE}
      account={KIND}
      stufe="kids"
      lang="de"
      loadFn={async () => emptyProgress()}
      saveFn={vi.fn()}
      onTask={vi.fn()}
      onStand={vi.fn()}
      onFertig={vi.fn()}
      onWeiter={vi.fn()}
      onVerlassen={vi.fn()}
    />,
  );
}

const TIPPEN = '[data-feld="tippen"]';

// ---------------------------------------------------------------------------
// Die Zustände - jeder baut in der Sprache auf, die der Provider liefert.
// ---------------------------------------------------------------------------

interface Zustand {
  name: string;
  aufbau: () => Promise<void> | void;
  /** Wie viele Funde die deutsche Gegenprobe mindestens bringen muss (Vorgabe 3). */
  mindestens?: number;
}

const ZUSTAENDE: Zustand[] = [
  {
    name: "Tippchallenge · Startbildschirm",
    aufbau: () => {
      zeige(<SchreibprobeLauf probe={probeStand()} account={KIND} stufe="kids" onTask={vi.fn()} />);
    },
  },
  {
    name: "Tippchallenge · Text fehlt (nach „Beginnen“)",
    aufbau: async () => {
      zeige(
        <SchreibprobeLauf
          // „eigen" ohne Datei: Der Text kann nicht kommen - der Ausweg muss dastehen.
          probe={probeStand({ plan: plan({ niveau: "eigen" }) })}
          account={KIND}
          stufe="kids"
          onTask={vi.fn()}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: /^(Start|Beginnen)$/ }));
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /Keep practising|Weiter üben/ })).toBeTruthy(),
      );
    },
    // Ein kleiner Bildschirm: Satz und Knopf - „Tippchallenge" ist ein Name.
    mindestens: 2,
  },
  {
    name: "Tippchallenge · Lauf, Restzeit angesagt, Alt + X",
    aufbau: async () => {
      const { container } = zeige(
        <SchreibprobeLauf
          probe={probeStand({
            phase: "laeuft",
            // 50 Sekunden Rest: die Ansagen bei fünf Minuten und einer Minute fallen.
            stand: { ...LEERER_STAND, beginnMs: Date.now() - (600_000 - 50_000) },
          })}
          account={KIND}
          stufe="kids"
          onTask={vi.fn()}
        />,
      );
      await waitFor(() => expect(container.querySelector(TIPPEN)).toBeTruthy(), { timeout: 4000 });
      fireEvent.keyDown(window, { code: "KeyX", altKey: true });
    },
  },
  {
    name: "Tippchallenge · abgegeben (ohne Ergebnis im Gerät)",
    aufbau: () => {
      zeige(
        <SchreibprobeLauf
          probe={probeStand({ phase: "abgegeben", stand: { ...LEERER_STAND, abgegeben: true } })}
          account={KIND}
          stufe="kids"
          onTask={vi.fn()}
        />,
      );
    },
  },
  {
    name: "Tippchallenge · Ergebnis-Karte, gewertet, alle Zeilen",
    aufbau: () => {
      zeige(<SchreibprobeErgebnis ergebnis={ergebnis()} onWeiter={vi.fn()} />);
    },
  },
  {
    name: "Tippchallenge · Ergebnis-Karte, zu kurz, Text zu Ende, nichts wacklig",
    aufbau: () => {
      zeige(
        <SchreibprobeErgebnis
          ergebnis={ergebnis({
            zeichen: 120,
            fehler: 1,
            wartezeitMs: 0,
            zuschlagProzent: 0,
            anschlaege: [{ char: "f", correct: true, ms: 200 }],
            textZuEnde: true,
            frueherAbgegeben: false,
          })}
          onWeiter={vi.fn()}
        />,
      );
    },
  },
  {
    name: "Klassenmatch · Einladung",
    aufbau: () => {
      zeige(<KlassenmatchEinladung hostName="Sarah" onDabei={vi.fn()} onNichtJetzt={vi.fn()} />);
    },
  },
  {
    name: "Klassenmatch · Wartefenster als Gastgeber, noch niemand dabei, „Starten“ gedrückt",
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
      fireEvent.click(screen.getByRole("button", { name: /^(Start|Starten)$/ }));
    },
  },
  {
    name: "Klassenmatch · Wartefenster als Gast, drei dabei, 30-Sekunden-Match",
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
    name: "Klassenmatch · Countdown, Escape öffnet die Rückfrage",
    aufbau: async () => {
      const start = Date.now() + 3_000;
      lauf(match({ startMs: start, endeMs: start + MATCH_DAUER_MS }));
      await screen.findByRole("heading", { name: /Class Match|Klassenmatch/ });
      await act(async () => {
        fireEvent.keyDown(window, { key: "Escape" });
      });
      await screen.findByRole("dialog");
    },
  },
  {
    name: "Klassenmatch · Lauf, Restzeit angesagt, Alt + X, „Verlassen“ öffnet die Rückfrage",
    aufbau: async () => {
      const start = Date.now() - (MATCH_DAUER_MS - 50_000);
      const { container } = lauf(match({ startMs: start, endeMs: start + MATCH_DAUER_MS }));
      await waitFor(() => expect(container.querySelector(TIPPEN)).toBeTruthy(), { timeout: 4000 });
      fireEvent.keyDown(window, { code: "KeyX", altKey: true });
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /^(Leave|Verlassen)$/ }));
      });
      await screen.findByRole("dialog");
    },
  },
  {
    name: "Klassenmatch · Platzierungsliste",
    aufbau: () => {
      zeige(<KlassenmatchErgebnis liste={rangliste(STAENDE)} eigeneUid="franz" onWeiter={vi.fn()} />);
    },
  },
];

beforeEach(() => {
  localStorage.clear();
  ohneBildschirmTastatur();
  vi.mocked(speakUi).mockClear();
  vi.mocked(speakUiAlways).mockClear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Der Fänger
// ---------------------------------------------------------------------------

describe("★★★ Deutsch-Fänger: Tippchallenge und Klassenmatch in der englischen Bedienung", () => {
  for (const z of ZUSTAENDE) {
    it(`EN · ${z.name}: kein deutsches Wort`, async () => {
      stelleBedienung("en");
      await z.aufbau();
      expect(fange()).toEqual([]);
      // Und es steht wirklich etwas da - eine leere Seite wäre auch „ohne Deutsch".
      expect((document.body.textContent ?? "").match(/[A-Za-z]{3,}/g)?.length ?? 0).toBeGreaterThan(3);
    });
  }
});

describe("★★★ GEGENPROBE: derselbe Fänger über die deutsche Bedienung", () => {
  for (const z of ZUSTAENDE) {
    it(`DE · ${z.name}: der Fänger findet Deutsch`, async () => {
      stelleBedienung("de");
      await z.aufbau();
      expect(findeDeutsch(document.body).length).toBeGreaterThanOrEqual(z.mindestens ?? 3);
    });
  }
});

// ---------------------------------------------------------------------------
// Einzelne Zusagen
// ---------------------------------------------------------------------------

describe("Die englische Challenge im Einzelnen", () => {
  it("★ der Startbildschirm: Typing Challenge, Key range, Time limit, die zwei Ratschläge", () => {
    stelleBedienung("en");
    zeige(<SchreibprobeLauf probe={probeStand()} account={KIND} stufe="kids" onTask={vi.fn()} />);
    expect(screen.getByText(PRUEFUNG_WORT_EN)).toBeTruthy();
    expect(screen.getByText("Key range:").nextElementSibling?.textContent).toMatch(/^Home row \(/);
    expect(screen.getByText("Time limit:").nextElementSibling?.textContent).toBe("10 minutes");
    expect(screen.getByText(ratVorlesen("en").stattScreenreader)).toBeTruthy();
    expect(screen.getByRole("button", { name: "I'll sit this one out" })).toBeTruthy();
  });

  it("★★ der Prüfungstext bleibt DEUTSCH und steht in lang=\"de\" - englisch ist nur der Rahmen", async () => {
    stelleBedienung("en");
    const { container } = zeige(
      <SchreibprobeLauf
        probe={probeStand({ phase: "laeuft", stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 } })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(container.querySelector(TIPPEN)).toBeTruthy(), { timeout: 4000 });
    expect(container.querySelector(TIPPEN)?.getAttribute("lang")).toBe("de");
    // ★ Der Zeitstand vor der Zeile hat keine Wörter und bleibt gleich breit.
    const wert = (container.querySelector(TIPPEN) as HTMLTextAreaElement).value;
    expect(wert).toMatch(/^\d\d:\d\d {3}/);
    expect(screen.getByText(/Alt \+ X/).textContent).toBe("Alt + X tells you how much time is left.");
  });

  it("★ Alt + X und die Ansagen sprechen ENGLISCH mit der englischen Stimme", async () => {
    stelleBedienung("en");
    const { container } = zeige(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - (600_000 - 50_000) },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(container.querySelector(TIPPEN)).toBeTruthy(), { timeout: 4000 });
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith(
      expect.stringMatching(/^\d+ seconds left\.$/),
      undefined,
      undefined,
      "en",
    );
    fireEvent.keyDown(window, { code: "KeyX", altKey: true });
    await waitFor(() =>
      expect(container.querySelector('[role="status"]')?.textContent?.trim()).toMatch(
        /^\d+ seconds left\.$/,
      ),
    );
  });

  it("★ zweimal „abgeben“: die Antwort steht englisch im Live-Bereich (deutsch in der Gegenprobe)", async () => {
    for (const sprache of ["en", "de"] as const) {
      stelleBedienung(sprache);
      const { container } = zeige(
        <SchreibprobeLauf
          probe={probeStand({ phase: "laeuft", stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 } })}
          account={KIND}
          stufe="kids"
          onTask={vi.fn()}
        />,
      );
      await waitFor(() => expect(container.querySelector(TIPPEN)).toBeTruthy(), { timeout: 4000 });
      const abgeben = screen.getByRole("button", { name: /Done - hand in|Fertig - abgeben/ });
      await act(async () => {
        fireEvent.click(abgeben);
      });
      await act(async () => {
        fireEvent.click(abgeben);
      });
      const antwort = container.querySelector('[role="status"]')?.textContent?.trim() ?? "";
      if (sprache === "en") {
        expect(antwort).toBe("Your Typing Challenge is already being scored.");
        expect(findeDeutsch(container).filter((f) => !nurTastenzeichen(f))).toEqual([]);
      } else {
        expect(antwort).toBe(`Deine ${PRUEFUNG_WORT} wird schon ausgewertet.`);
      }
      cleanup();
    }
  });

  it("★ die Ergebnis-Karte: Score mit Dezimalpunkt, Titel und „ö\" in lang=\"de\", Prozent ohne Leerzeichen", () => {
    stelleBedienung("en");
    const { container } = zeige(<SchreibprobeErgebnis ergebnis={ergebnis()} onWeiter={vi.fn()} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Your Typing Challenge");
    expect(screen.getByText("Der Fuchs und die Trauben").getAttribute("lang")).toBe("de");
    expect(screen.getByText("With punctuation · Text 4, from line 13 ·", { exact: false })).toBeTruthy();
    expect(screen.getByText("ö").getAttribute("lang")).toBe("de");
    expect(screen.getByText("Shift")).toBeTruthy();
    expect(screen.getByText("25%")).toBeTruthy();
    // Der Score mit Punkt, nicht mit Komma.
    const score = screen.getByText("Score").closest("div")?.querySelector("dd")?.textContent ?? "";
    expect(score).toMatch(/^\d+\.\d$/);
    // Wacklig: „5 of 8 correct" - in denselben Textknoten wie die deutsche Fassung.
    expect(container.textContent).toContain("5 of 8 correct");
  });
});

describe("Das englische Klassenmatch im Einzelnen", () => {
  it("★ die Einladung spricht einmal, englisch, mit englischer Stimme - auch bei Vorlesen aus", () => {
    stelleBedienung("en");
    zeige(<KlassenmatchEinladung hostName="Sarah" onDabei={vi.fn()} onNichtJetzt={vi.fn()} />);
    expect(vi.mocked(speakUiAlways)).toHaveBeenCalledWith(
      "Sarah is inviting you to a Class Match.",
      undefined,
      "en",
    );
    expect(screen.getByRole("button", { name: "I'm in" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Not now" })).toBeTruthy();
  });

  it("★★ der Countdown sagt „Go!“ mit englischer Stimme", () => {
    stelleBedienung("en");
    zeige(
      <KlassenmatchLobby
        match={match()}
        staende={STAENDE}
        binGastgeber={false}
        imCountdown
        restMs={0}
        kannStarten={false}
        onStarten={vi.fn()}
        onAbbrechen={vi.fn()}
      />,
    );
    expect(vi.mocked(speakUiAlways)).toHaveBeenCalledWith("Go!", undefined, "en");
    expect(screen.getByText(/Starting in/).textContent).toBe("Starting in 0 seconds.");
  });

  it("★ der Lauf: „2nd of 4\" über dem Feld, Alt + X mit Ordnungszahlen, Vorspann unverändert", async () => {
    stelleBedienung("en");
    const start = Date.now() - 75_000;
    const { container } = lauf(match({ startMs: start, endeMs: start + MATCH_DAUER_MS }));
    await waitFor(() => expect(container.querySelector(TIPPEN)).toBeTruthy(), { timeout: 4000 });
    expect(screen.getByText(/ of 4$/).textContent).toBe("4th of 4");
    fireEvent.keyDown(window, { code: "KeyX", altKey: true });
    await waitFor(() =>
      expect(container.querySelector("[data-match-live]")?.textContent?.trim()).toMatch(
        /^4th of 4, \d:\d\d\. 1st Sarah, 2nd Mia, 3rd Ben$/,
      ),
    );
    const feld = container.querySelector(TIPPEN) as HTMLTextAreaElement;
    expect(feld.value.startsWith("P4 ")).toBe(true);
  });

  it("★ der Schalter in der Stand-Zeile sagt „Class Match in progress\" - englisch, mit englischer Stimme", () => {
    stelleBedienung("en");
    useKlassenmatchAngebot.setState({ offen: true, hinweis: matchHinweisLaeuft("en") });
    zeige(<StandZeile stufeLabel="Game level" level={3} nextUnit="e" />);
    const knopf = screen.getByRole("button", { name: /Class Match in progress/ });
    fireEvent.click(knopf);
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith(
      matchHinweisSatz(MATCH_HINWEIS_LAEUFT_EN),
      undefined,
      undefined,
      "en",
    );
    expect(pruefeText("Satz", matchHinweisSatz(MATCH_HINWEIS_LAEUFT_EN))).toBeNull();
    useKlassenmatchAngebot.setState({ offen: false, hinweis: "" });
  });

  it("★ die Platzierungsliste: Trophy, Silver, Bronze - als Wort", () => {
    stelleBedienung("en");
    // ★ Seit 18.11.2026 nur die obere Hälfte: mit sechs Kindern drei Plätze.
    const sechs = [
      ...STAENDE,
      stand({ id: "s5", pupilUid: "lea", name: "Lea", zeichen: 40, apm: 15, updatedMs: Date.now() - 7000 }),
      stand({ id: "s6", pupilUid: "tom", name: "Tom", zeichen: 30, apm: 10, updatedMs: Date.now() - 8000 }),
    ];
    zeige(<KlassenmatchErgebnis liste={rangliste(sechs)} eigeneUid="franz" onWeiter={vi.fn()} />);
    expect(screen.getByText("Well done - you took part!")).toBeTruthy();
    for (const wort of ["Trophy", "Silver", "Bronze"]) {
      expect(screen.getByText(wort, { exact: false })).toBeTruthy();
    }
  });
});

describe("★★ Die Meldungen von useKlassenmatch (am Mock-Backend durchgespielt)", () => {
  const SARAH: TypingAccount = { id: "sarah", role: "schueler", name: "Sarah", classCode: "K1", createdAt: 1 };
  const FRANZ: TypingAccount = { id: "franz", role: "schueler", name: "Franz", classCode: "K1", createdAt: 1 };

  async function warte(ms: number) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms);
    });
  }

  beforeEach(() => {
    _mockMatchesZuruecksetzen();
    _resetTypingBackend();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    _mockMatchesZuruecksetzen();
  });

  it("★ „läuft gerade\" heisst englisch „Class Match in progress\" - und der Satz dazu ist englisch", async () => {
    stelleBedienung("en");
    const { result } = renderHook(() => useKlassenmatch(SARAH), { wrapper: Huelle });
    await warte(100);
    await act(async () => {
      result.current.einladen();
    });
    await warte(100);
    expect(result.current.hinweis).toBe(MATCH_HINWEIS_LAEUFT_EN);
    expect(pruefeText("Satz", matchHinweisSatz(result.current.hinweis))).toBeNull();
  });

  it("★★ „Sarah has already sent an invitation.\" und „Sarah has called off the Class Match.\"", async () => {
    stelleBedienung("en");
    const sarah = renderHook(() => useKlassenmatch(SARAH), { wrapper: Huelle });
    const franz = renderHook(() => useKlassenmatch(FRANZ), { wrapper: Huelle });
    await warte(100);
    await act(async () => {
      sarah.result.current.einladen();
      vi.setSystemTime(Date.now() + 5);
      franz.result.current.einladen();
    });
    await warte(1000);
    expect(franz.result.current.einladungVorsatz).toBe("Sarah has already sent an invitation.");

    await act(async () => {
      franz.result.current.beitreten(franz.result.current.einladung!.id);
    });
    await warte(500);
    await act(async () => {
      sarah.result.current.absagen();
    });
    await warte(1000);
    expect(franz.result.current.meldung).toBe("Sarah has called off the Class Match.");
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith(
      "Sarah has called off the Class Match.",
      undefined,
      undefined,
      "en",
    );
  });

  it("★ ein abgewiesenes Ausschreiben sagt es englisch (ohne Grund vom Server)", async () => {
    stelleBedienung("en");
    const { result } = renderHook(() => useKlassenmatch(SARAH), { wrapper: Huelle });
    await warte(100);
    vi.spyOn(typingBackend(), "erstelleMatch").mockRejectedValue(new Error(""));
    await act(async () => {
      result.current.einladen();
    });
    await warte(100);
    expect(result.current.meldung).toBe(MATCH_MELDUNGEN.en.nichtAusgeschriebenOhneGrund);
    expect(pruefeText("Meldung", result.current.meldung)).toBeNull();
  });

  it("deutsche Bedienung (deutscher Browser, nichts gemerkt): alles deutsch - wortgleich", async () => {
    stelleBedienung(null);
    const { result } = renderHook(() => useKlassenmatch(SARAH), { wrapper: Huelle });
    await warte(100);
    await act(async () => {
      result.current.einladen();
    });
    await warte(100);
    expect(result.current.hinweis).toBe(MATCH_HINWEIS_LAEUFT);
  });
});

// ---------------------------------------------------------------------------
// Die Texte der Bibliothek - Tabelle für Tabelle, auch wo kein Bildschirm sie zeigt
// ---------------------------------------------------------------------------

/** Ruft einen Tabellen-Eintrag mit Beispielwerten auf - ein Satz, ein Name, eine Zahl. */
function alsText(wert: unknown): string {
  if (typeof wert === "string") return wert;
  if (typeof wert === "function") {
    const r = (wert as (...a: unknown[]) => unknown)("Sarah", 3);
    return Array.isArray(r) ? r.join("") : String(r);
  }
  return String(wert);
}

/** Alle englischen Sätze der Bibliothek, mit einem Namen je Fundstelle. */
function englischeSaetze(): [string, string][] {
  const liste: [string, string][] = [];
  for (const [k, v] of Object.entries(hinweiseChallenge("en"))) liste.push([`Hinweis ${k}`, v]);
  for (const anrede of ["du", "Sie"] as const)
    for (const [k, v] of Object.entries(hinweisTabelle(anrede, "en")))
      liste.push([`Tabelle ${anrede}.${k}`, v]);
  liste.push(["Steigerung", steigerungHinweis("du", "en")]);
  for (const [k, v] of Object.entries(ratVorlesen("en"))) liste.push([`Rat ${k}`, v]);
  for (const def of NIVEAU_DEFS)
    for (const [k, v] of Object.entries(niveauTexte(def, "en")))
      liste.push([`Niveau ${def.key}.${k}`, v]);
  for (const ms of [0, 1_000, 50_000, 300_000])
    liste.push([`restGesprochen ${ms}`, restGesprochen(ms, "en")]);
  for (const ms of [1_000, 10_000, 60_000, 120_000])
    liste.push([`matchRestGesprochen ${ms}`, matchRestGesprochen(ms, "en")]);
  liste.push(["textBezeichnung", textBezeichnung(3, "en")]);
  liste.push(["stelleBezeichnung", stelleBezeichnung(3, 57, "en")]);
  liste.push(["bereitSatz", bereitSatz({ bereit: ["Mia"], nochNicht: ["Said", "Jano"] }, "en")]);
  liste.push(["Wort", `${pruefungWort("en")} ${pruefungWortMehrzahl("en")}`]);
  liste.push(["tastenName", `${tastenName(SHIFT_UNIT, "en")} ${tastenName(" ", "en")}`]);
  liste.push(["einladungSatz", einladungSatz("Sarah", "en")]);
  liste.push(["dabeiSatz leer", dabeiSatz([], "en")]);
  liste.push(["dabeiSatz", dabeiSatz(["Toprak", "Mia"], "en")]);
  liste.push(["platzSatz", platzSatz(2, 6, "en")]);
  liste.push(["matchBrailleSatz", matchBrailleSatz(2, 6, 225_000, rangliste(STAENDE), "en")]);
  liste.push(["countdown", countdownAnsage(0, "en") ?? ""]);
  liste.push(["Hinweis läuft", `${matchHinweisLaeuft("en")} ${matchHinweisSatz(matchHinweisLaeuft("en"))}`]);
  for (const p of [1, 2, 3]) liste.push([`Ehrenplatz ${p}`, ehrenplatz(p, "en")?.wort ?? ""]);
  for (const [k, v] of Object.entries(MATCH_MELDUNGEN.en)) liste.push([`Meldung ${k}`, alsText(v)]);
  return liste;
}

describe("★★ Die englischen Sätze der Bibliothek", () => {
  it("★★★ kein deutsches Wort in irgendeinem Satz (mit Gegenprobe über die deutschen)", () => {
    const funde = englischeSaetze()
      .map(([wo, satz]) => pruefeText(wo, satz))
      .filter((f): f is string => !!f && !nurTastenzeichen(f));
    expect(funde).toEqual([]);
    // Gegenprobe: dieselben Fundstellen deutsch - hier MUSS der Fänger anschlagen.
    const deutsch = [
      ...Object.values(HINWEIS_CHALLENGE),
      ...Object.values(HINWEIS_TABELLE.du),
      ...Object.values(HINWEIS_TABELLE.Sie),
      STEIGERUNG_HINWEIS,
      ...Object.values(ratVorlesen("de")),
      ...Object.values(MATCH_MELDUNGEN.de).map(alsText),
      restGesprochen(50_000),
      matchRestGesprochen(120_000),
      dabeiSatz([]),
      einladungSatz("Sarah"),
      matchHinweisSatz(MATCH_HINWEIS_LAEUFT),
    ];
    const deutscheFunde = deutsch.map((s, i) => pruefeText(`de ${i}`, s)).filter(Boolean);
    expect(deutscheFunde.length).toBeGreaterThan(deutsch.length * 0.8);
  });

  it("★ nur Bindestrich, kein Maus-Vokabular (Hausregel, Braillezeile)", () => {
    for (const [wo, satz] of englischeSaetze()) {
      expect(satz, wo).not.toMatch(/[–—]/);
      expect(satz, wo).not.toMatch(/\b(click|hover|tap)\b/i);
    }
  });

  it("★★ die Hinweise tragen in beiden Sprachen DIESELBEN Zahlen (aus denselben Konstanten)", () => {
    const zahlen = (s: string) => (s.match(/\d+/g) ?? []).sort();
    for (const k of Object.keys(HINWEIS_CHALLENGE) as (keyof typeof HINWEIS_CHALLENGE)[]) {
      expect(zahlen(HINWEIS_CHALLENGE_EN[k]), k).toEqual(zahlen(HINWEIS_CHALLENGE[k]));
    }
    for (const anrede of ["du", "Sie"] as const) {
      for (const k of Object.keys(HINWEIS_TABELLE[anrede]) as (keyof typeof HINWEIS_TABELLE.du)[]) {
        expect(zahlen(HINWEIS_TABELLE_EN[anrede][k]), `${anrede}.${k}`).toEqual(
          zahlen(HINWEIS_TABELLE[anrede][k]),
        );
      }
    }
    expect(STEIGERUNG_HINWEIS_EN).not.toBe("");
  });

  it("★ ohne Angabe bleibt jede Funktion Deutsch - Zeichen für Zeichen die Sätze von vorher", () => {
    expect(pruefungWort()).toBe(PRUEFUNG_WORT);
    expect(restGesprochen(0)).toBe("Die Zeit ist um.");
    expect(restGesprochen(45_000)).toBe("Noch 45 Sekunden.");
    expect(restGesprochen(300_000)).toBe("Noch 5 Minuten.");
    expect(textBezeichnung(3)).toBe("Text 4 von 15");
    expect(stelleBezeichnung(3, 57)).toBe("Text 4, ab Zeile 58");
    expect(bereitSatz({ bereit: ["Mia"], nochNicht: ["Said", "Jano"] })).toBe(
      "Bereit: 1 von 3 - noch nicht: Said, Jano",
    );
    expect(tastenName(SHIFT_UNIT)).toBe("Umschalt");
    expect(tastenName(" ")).toBe("Leertaste");
    expect(einladungSatz("Sarah")).toBe("Sarah lädt dich zu einem Klassenmatch ein.");
    expect(dabeiSatz(["Toprak", "Mia"])).toBe("2 dabei: Toprak, Mia");
    expect(platzSatz(2, 6)).toBe("Platz 2 von 6");
    expect(matchRestGesprochen(60_000)).toBe("Noch 1 Minute.");
    expect(matchRestGesprochen(10_000)).toBe("Noch 10 Sekunden.");
    expect(countdownAnsage(0)).toBe("Los!");
    expect(ehrenplatz(1)?.wort).toBe("Pokal");
    expect(matchHinweisLaeuft()).toBe(MATCH_HINWEIS_LAEUFT);
    expect(hinweiseChallenge()).toBe(HINWEIS_CHALLENGE);
    expect(niveauTexte(NIVEAU_DEFS[0]).kurz).toBe("Grundreihe");
    expect(matchZeitstand(2, 225_000)).toBe("P2 3:45 ");
  });

  it("★ Englisch mit echter Einzahl und Ordnungszahlen", () => {
    expect(restGesprochen(1_000, "en")).toBe("1 second left.");
    expect(matchRestGesprochen(60_000, "en")).toBe("1 minute left.");
    expect(matchRestGesprochen(120_000, "en")).toBe("2 minutes left.");
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23].map((p) => platzSatz(p, 30, "en").split(" ")[0])).toEqual([
      "1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "23rd",
    ]);
  });
});

describe("§ Deutsche Bedienung: die Karte wie ohne Provider", () => {
  it("★★★ keine neuen lang-Attribute, deutsche Karte wie ohne Provider", () => {
    stelleBedienung(null);
    // Die Hinweis-Kennungen kommen aus `useId` und zählen je Aufbau weiter.
    const ohneIds = (h: string) => h.replace(/zeigerhinweis-[^"]+/g, "zeigerhinweis-·");
    const mit = zeige(<SchreibprobeErgebnis ergebnis={ergebnis()} onWeiter={vi.fn()} />);
    const html = ohneIds(mit.container.innerHTML);
    expect(mit.container.querySelector("[lang]")).toBeNull();
    cleanup();
    const ohne = render(<SchreibprobeErgebnis ergebnis={ergebnis()} onWeiter={vi.fn()} />);
    expect(ohneIds(ohne.container.innerHTML)).toBe(html);
    expect(html).toContain("Deine Tippchallenge");
    expect(html).toContain("Wacklige Tasten");
  });
});
