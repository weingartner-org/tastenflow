/**
 * Polar-Expedition — E7 „Reise-Dramaturgie". Sichert die neuen Bausteine:
 *  • texts.ts: ausgelagerte Zonen-Texte (Station auf ANAGRAMM umgeschrieben) + Tagebuch,
 *  • ExpeditionStage im Reise-Modus: Expeditionstagebuch vor der Zone (Leertaste startet,
 *    Escape zurück), Mini-Reisekarte, Tag→Nacht-Letterbox (data-time),
 *  • ExpeditionJourney: startet mit dem Tagebuch der ersten Zone.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";
import { ExpeditionJourney } from "../src/components/typing/expedition/ExpeditionJourney";
import { zoneText, diaryText } from "../src/lib/typing/expedition/texts";
import { buildPackeisCourse, EXPEDITION_ZONES } from "../src/lib/typing/expedition/course";
import { masteryFor } from "../src/lib/typing/letters";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

const M = masteryFor("normal");
const INTRO = ["f", "j", "d", "k", "s", "l", "a", "e", "n", "i", "r", "t", "h", "u"];

const journeyProp = () => ({
  index: 0,
  total: 6,
  zones: EXPEDITION_ZONES.map((z, i) => ({
    name: z.name,
    timeOfDay: z.timeOfDay,
    state: (i === 0 ? "current" : "todo") as "current" | "todo",
  })),
  diary: {
    zoneName: "Das Packeis",
    task: "Spring über die Schollen.",
    example: "Leuchtet ein F, drückst du F.",
    firstVisit: true,
  },
});

describe("texts.ts — ausgelagerte Zonen- und Tagebuchtexte", () => {
  it("beschreibt die Polarstation als Anagramm statt Wort-Funken", () => {
    const s = zoneText("station");
    expect(s.introKid("", false)).toContain("durcheinander");
    expect(s.introKid("", false).toLowerCase()).not.toContain("funk das");
    expect(s.winKid(true)).toContain("entschlüsselt");
  });

  it("liefert für jede Zone ein Tagebuch-Blatt (Aufgabe + Beispiel), je Zielgruppe", () => {
    for (const z of EXPEDITION_ZONES) {
      const kid = diaryText(z.kind, false);
      const adult = diaryText(z.kind, true);
      expect(kid.task.length).toBeGreaterThan(0);
      expect(kid.example.length).toBeGreaterThan(0);
      expect(adult.task.length).toBeGreaterThan(0);
    }
    // Kind erzählend vs. Erwachsene sachlich - seit 19.09.2026 BEIDE per Du
    // (Johannes: „Schüler und Selbstlernende mit du", auch ab 16).
    expect(diaryText("water", true).task).toBe("Drück jeweils die Taste der nächsten, leuchtenden Scholle.");
    expect(diaryText("water", true).task).not.toContain("Sie");
    expect(diaryText("water", false).task).toContain("drück");
  });

  it("nennt im Station-Tagebuch NIE ein echtes Rätselwort, nur ein Fremd-Beispiel", () => {
    expect(diaryText("station", false).example).toContain("Esel");
  });
});

describe("ExpeditionStage — Reise-Modus (Tagebuch, Reisekarte, Tag→Nacht)", () => {
  const course = buildPackeisCourse(INTRO, undefined, M, { free: true, seed: 2 });

  it("zeigt vor der Zone das Expeditionstagebuch und liest es an", () => {
    const { baseElement } = render(
      <ExpeditionStage open onClose={() => {}} course={course} free journey={journeyProp()} timeOfDay="morning" />,
    );
    expect(baseElement.querySelector(".px-diary")).not.toBeNull();
    const alert = baseElement.querySelector('.px-stage [role="alert"]');
    expect(alert?.textContent).toContain("Expeditionstagebuch");
    expect(alert?.textContent).toContain("Das Packeis");
  });

  it("koppelt die Letterbox an die Tageszeit (data-time)", () => {
    render(<ExpeditionStage open onClose={() => {}} course={course} free journey={journeyProp()} timeOfDay="evening" />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-time", "evening");
  });

  it("zeichnet die Mini-Reisekarte mit einem Punkt je Zone", () => {
    const { baseElement } = render(
      <ExpeditionStage open onClose={() => {}} course={course} free journey={journeyProp()} timeOfDay="morning" />,
    );
    expect(baseElement.querySelectorAll(".px-hud__dot")).toHaveLength(6);
  });

  it("startet die Zone mit der Leertaste (Tagebuch verschwindet)", () => {
    const { baseElement } = render(
      <ExpeditionStage open onClose={() => {}} course={course} free journey={journeyProp()} timeOfDay="morning" />,
    );
    expect(baseElement.querySelector(".px-diary")).not.toBeNull();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: " " });
    expect(baseElement.querySelector(".px-diary")).toBeNull();
  });

  it("beendet die Reise mit Escape", () => {
    const onClose = vi.fn();
    render(<ExpeditionStage open onClose={onClose} course={course} free journey={journeyProp()} timeOfDay="morning" />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("ExpeditionJourney — Orchestrator", () => {
  it("startet mit dem Tagebuch der ersten Zone (Zone 1)", () => {
    const { baseElement } = render(
      <ExpeditionJourney open onClose={() => {}} introduced={INTRO} mastery={M} seed={2} />,
    );
    const diary = baseElement.querySelector(".px-diary");
    expect(diary).not.toBeNull();
    expect(diary?.textContent).toContain("Zone 1");
    expect(diary?.textContent).toContain(EXPEDITION_ZONES[0].name);
  });

  it("rendert nichts, solange sie geschlossen ist", () => {
    render(<ExpeditionJourney open={false} onClose={() => {}} introduced={INTRO} mastery={M} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
