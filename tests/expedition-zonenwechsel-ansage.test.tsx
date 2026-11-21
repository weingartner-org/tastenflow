/**
 * Polar-Expedition — die Ansage beim ZONENWECHSEL wird nicht mehr abgeschnitten
 * (Testerin Durchgang, Punkt 4, 20.09.2026).
 *
 * Johannes, wörtlich: „Im Schneesturm wurde der letzte Satz der Ansage nicht zuende
 * gesprochen. Da muss vermutlich nur die Pause zwischen den Spielen größer sein,
 * damit die Dame noch fertig reden kann. Auf das Spiel hatte das aber keinen
 * Einfluss."
 *
 * Befund (ExpeditionJourney.tsx, `handleZoneDone`): die Zone wechselte bisher nach
 * einer FESTEN Pause (`WIN_HOLD_MS`, 2,2 s) - unabhängig davon, ob die Ansage aus
 * `arriveFinish` (das „Geschafft!" + ggf. der Fische-Satz) da überhaupt fertig
 * gesprochen war. `key={step}` unmountet danach die alte Zonen-Bühne und mountet die
 * neue; deren Zonen-Intro spricht sofort und würgt die noch laufende Ansage der
 * vorigen Zone ab (`cancelIfBusy`, voice.ts).
 *
 * Die Probe hier ersetzt die echte Sprachausgabe (jsdom hat keine) durch einen
 * steuerbaren Schalter für `sprachausgabeBeschaeftigt` (wie
 * tests/tastenflow-satz-ausreden.test.tsx) und die echte Zonen-Bühne durch einen
 * Platzhalter, der nur zeigt, WELCHE Zone gerade gemountet ist - so lässt sich die
 * Zeitsteuerung ohne ein echtes Durchspielen jeder Zone prüfen.
 *
 * ⚠️ GEGENPROBE: Ohne die Behebung (fester `window.setTimeout(..., WIN_HOLD_MS)`
 * statt der Warteschleife) wird der erste Test hier ROT - die zweite Zone wäre nach
 * 3000 ms längst gemountet, obwohl die Ansage laut `sprachausgabeBeschaeftigt` noch
 * läuft.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { masteryFor } from "../src/lib/typing/letters";

const stimme = vi.hoisted(() => ({ beschaeftigt: false }));

vi.mock("@/lib/typing", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing")>();
  return {
    ...echt,
    sprachausgabeBeschaeftigt: () => stimme.beschaeftigt,
  };
});

let onFinishedByLeg: ((r: { clean: boolean; flawless: boolean; fish: number }) => void) | null = null;
let mountedZoneKind = "";

vi.mock("../src/components/typing/expedition/ExpeditionStage", () => ({
  ExpeditionStage: (props: {
    course?: { stages?: { kind?: string }[] };
    onFinished?: (r: { clean: boolean; flawless: boolean; fish: number }) => void;
  }) => {
    onFinishedByLeg = props.onFinished ?? null;
    mountedZoneKind = props.course?.stages?.[0]?.kind ?? "?";
    return <div data-testid="buehne" data-zone={mountedZoneKind} />;
  },
}));

import { ExpeditionJourney } from "../src/components/typing/expedition/ExpeditionJourney";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.localStorage.clear();
  stimme.beschaeftigt = false;
  onFinishedByLeg = null;
  mountedZoneKind = "";
});

const M = masteryFor("normal");
// Dieselbe Liste wie in expedition-e7.test.tsx - dort belegt (6 Reisekarte-Punkte),
// dass mit ihr JEDE der sechs Zonen einen nicht-leeren Kurs bekommt.
const INTRO = ["f", "j", "d", "k", "s", "l", "a", "e", "n", "i", "r", "t", "h", "u"];

function beenden() {
  act(() => {
    onFinishedByLeg?.({ clean: true, flawless: true, fish: 0 });
  });
}

describe("ExpeditionJourney — Zonenwechsel wartet auf die Ansage (Punkt 4, 20.09.2026)", () => {
  it("wechselt NICHT zur nächsten Zone, solange die Ansage noch spricht", () => {
    vi.useFakeTimers();
    render(<ExpeditionJourney open onClose={() => {}} introduced={INTRO} mastery={M} seed={2} />);
    expect(mountedZoneKind).toBe("water");

    stimme.beschaeftigt = true; // die „Geschafft!"-Ansage (ggf. + Fische-Satz) spricht noch
    beenden();
    // Die alte feste Pause (2,2 s) ist längst um - trotzdem noch dieselbe Zone, weil
    // die Ansage laut `sprachausgabeBeschaeftigt` noch nicht fertig ist.
    act(() => vi.advanceTimersByTime(3000));
    expect(mountedZoneKind).toBe("water");

    // Jetzt ist die Ansage fertig - zwei Abfragen (240 ms) später wechselt die Zone.
    stimme.beschaeftigt = false;
    act(() => vi.advanceTimersByTime(300));
    expect(mountedZoneKind).toBe("climb");
  });

  it("wartet mindestens die alte Pause ab, auch wenn die Ansage sofort fertig ist (Tempo unverändert)", () => {
    vi.useFakeTimers();
    render(<ExpeditionJourney open onClose={() => {}} introduced={INTRO} mastery={M} seed={2} />);
    expect(mountedZoneKind).toBe("water");

    stimme.beschaeftigt = false; // Vorlesen aus / Ansage bereits fertig
    beenden();
    act(() => vi.advanceTimersByTime(2000));
    expect(mountedZoneKind).toBe("water"); // vor 2,2 s wechselt nichts - Tempo wie bisher
    act(() => vi.advanceTimersByTime(300));
    expect(mountedZoneKind).toBe("climb");
  });

  it("bricht bei dauerhaft hängender Sprachausgabe spätestens nach der Notbremse durch", () => {
    vi.useFakeTimers();
    render(<ExpeditionJourney open onClose={() => {}} introduced={INTRO} mastery={M} seed={2} />);
    stimme.beschaeftigt = true;
    beenden();
    act(() => vi.advanceTimersByTime(9000));
    expect(mountedZoneKind).toBe("water"); // noch unter der Notbremse (10 s)
    act(() => vi.advanceTimersByTime(2000)); // insgesamt über 10 s
    expect(mountedZoneKind).toBe("climb");
  });
});
