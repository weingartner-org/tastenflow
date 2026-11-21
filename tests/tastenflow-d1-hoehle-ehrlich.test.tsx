/**
 * ★★ WÄCHTER: Die Echo-Höhle verspricht nur, was sie tut - entschieden am WEG.
 *
 * Geschichte: Am 27.09.2026 (D1 Randfund, Commit 31e7cb57) wurden die fr/es-Texte
 * ehrlich gemacht - auf Weg „fr"/„es" spielt die Höhle nur einen TON, der Name geht an
 * den Screenreader (`caveAnnouncement`, Entscheidung wie Weg „en": „Ton statt Stimme").
 * Offen blieb die Kehrseite: Die Texte hingen an der BEDIENUNGSSPRACHE, nicht am Weg.
 * Deutsch und Englisch versprachen das Höhlenwesen auch auf Weg „en"/„fr"/„es", und
 * Französisch/Spanisch verschwiegen es auch auf Weg „de", wo es wirklich raunt.
 *
 * Die Regel (28.09.2026): Ein Höhlen-Text nennt das Wesen GENAU DANN, wenn der Weg „de"
 * ist - in jeder Bedienungssprache. Geprüft wird die volle Matrix
 * Bedienung {de, en, fr, es} × Weg {de, en, fr, es}:
 *   (1) die Ansage selbst: Ton genau dann, wenn der Weg nicht „de" ist;
 *   (2) Zonentexte (Start, Intro Kind/Erwachsene, Scheitern, Ziel) und Tagebuch-Blatt;
 *   (3) GERENDERT: die Bühne in der Höhle - Öffner (Braille-Region), Intro-Ansage,
 *       Startzeile und der Stand nach dem ersten richtigen Anschlag;
 *   (4) GERENDERT: die Kinder-Hilfe (sie bekommt den Weg als Prop).
 * Die Erwartung steht HIER (`weg === "de"`), nicht aus dem Code übernommen - sonst
 * prüfte der Wächter die Weiche mit sich selbst.
 *
 * Gegenprobe am 28.09.2026: gegen den Stand vor der Weiche (5753fa53) ist dieser Wächter
 * rot - de/en nennen das Wesen auf Weg „en", fr/es verschweigen es auf Weg „de".
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const zustand = vi.hoisted(() => ({ sprache: "de" as "de" | "en" | "fr" | "es" }));

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: zustand.sprache,
      spracheGewaehlt: zustand.sprache,
      setzeSprache: () => {},
      // `false`: ohne Stimme schreibt die Bühne jede Ansage in ihre Live-Region.
      bereichAktiv: false,
      wechsle: () => {},
      beimSchalter: () => () => {},
    }),
  };
});
// Siehe `tastenflow-franzoesische-hilfe.test.tsx`: das Modul zieht einen dynamischen
// `import("exceljs")` mit, den Vite vor dem Lauf auflösen will.
vi.mock("@/lib/typing/excelMarke", () => ({}));

import { diaryText, zoneText } from "../src/lib/typing/expedition/texts";
import { caveAnnouncement } from "../src/components/typing/expedition/useExpedition";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";
import { TippenHilfe } from "../src/components/typing/TippenHilfe";
import { masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import type { Stufe } from "../src/lib/typing/account";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  zustand.sprache = "de";
});

type Sprache = "de" | "en" | "fr" | "es";
type Weg = "de" | "en" | "fr" | "es";
const SPRACHEN: Sprache[] = ["de", "en", "fr", "es"];
const WEGE: Weg[] = ["de", "en", "fr", "es"];

/** Das Wesen in jeder Sprache - auch als „Monster" (so heisst es in der Hilfe). */
const WESEN = /Höhlenwesen|Monster|creature|créature|criatura/i;
/** Wer ohne Wesen spielt, erfährt die Taste über Screenreader/Braillezeile. */
const LESEGERAET = /Screenreader|screen reader|lecteur d'écran|lector de pantalla/i;

const MATRIX = SPRACHEN.flatMap((s) => WEGE.map((w) => [s, w] as const));

describe("die Ansage: Ton genau dann, wenn der Weg nicht „de\" ist", () => {
  it.each(WEGE)("Weg %s", (w) => {
    expect(caveAnnouncement("a", w).tone).toBe(w !== "de");
  });
});

describe("Zonentexte und Tagebuch: das Wesen genau auf Weg „de\"", () => {
  it.each(MATRIX)("Bedienung %s × Weg %s", (s, w) => {
    const T = zoneText("cave", s, w);
    const texte = [
      T.startText(false, "x"),
      T.startText(true, "x"),
      T.introKid("x", false),
      T.introKid("x", true),
      T.introAdult("x", false),
      T.introAdult("x", true),
      T.failKid("x"),
      T.failAdult("x"),
      T.winKid(true),
      T.winAdult(),
    ];
    const blaetter = [diaryText("cave", false, s, w), diaryText("cave", true, s, w)];
    const alles = [...texte, ...blaetter.flatMap((b) => [b.task, b.example])].join(" | ");
    if (w === "de") {
      expect(T.introKid("x", false), "Intro Kind nennt das Wesen").toMatch(WESEN);
      expect(T.introAdult("x", false), "Intro Erwachsene nennt das Wesen").toMatch(WESEN);
      expect(blaetter[0].task, "Tagebuch Kind nennt das Wesen").toMatch(WESEN);
      expect(blaetter[1].task, "Tagebuch Erwachsene nennt das Wesen").toMatch(WESEN);
    } else {
      expect(alles).not.toMatch(WESEN);
      // Ehrlich heisst auch: sagen, woher die Taste kommt.
      expect(T.introKid("x", false)).toMatch(LESEGERAET);
      expect(T.introAdult("x", false)).toMatch(LESEGERAET);
      expect(blaetter[0].task).toMatch(LESEGERAET);
      expect(blaetter[1].task).toMatch(LESEGERAET);
    }
  });

  it("die „mit Wesen\"-Fassung auf Deutsch und Englisch ist wörtlich die bisherige", () => {
    expect(zoneText("cave", "de", "de").introKid("x", false)).toBe(
      "Die Echo-Höhle! Hier ist es stockdunkel - du siehst kein Zeichen. Das Höhlenwesen raunt dir jede Taste zu. Hör gut hin und tippe, was du hörst!",
    );
    expect(zoneText("cave", "de", "de").startText(false, "x")).toBe("Am Höhleneingang. Hör auf das Höhlenwesen!");
    expect(zoneText("cave", "en", "de").introAdult("x", false)).toBe(
      "The Echo Cave: typing by ear. No character is shown - the cave creature announces each key. Type what you hear.",
    );
    expect(diaryText("cave", false, "de", "de")).toEqual({
      task: "Hier ist es dunkel - das Höhlenwesen sagt jede Taste an, du tippst nur nach Gehör.",
      example: "Hörst du Ka, drückst du K.",
    });
    expect(diaryText("cave", true, "en", "de")).toEqual({
      task: "In the dark, the cave creature announces each key - type by ear.",
      example: "If you hear “Ka” - that is K - press K.",
    });
  });

  it("ohne Angabe des Weges: Weg „de\" (wie der Spiel-Hook)", () => {
    expect(zoneText("cave", "fr").introKid("x", false)).toMatch(/créature/);
    expect(diaryText("cave", false, "es").task).toMatch(/criatura/);
  });
});

describe("GERENDERT: die Bühne in der Höhle", () => {
  const noStats: Record<string, LetterStat> = {};
  const HOEHLE: FloeCourse = { stages: [{ kind: "cave", units: ["d", "e"] }] };

  /** Alles, was ein Kind lesen oder hören kann: Text (samt Live-Regionen) und aria-label. */
  function allesLesbare(): string {
    const teile = [document.body.textContent ?? ""];
    for (const el of document.body.querySelectorAll("[aria-label]")) teile.push(el.getAttribute("aria-label") ?? "");
    return teile.join(" | ");
  }

  it.each(MATRIX)("Bedienung %s × Weg %s", (s, w) => {
    zustand.sprache = s;
    render(
      <ExpeditionStage
        open
        onClose={vi.fn()}
        course={HOEHLE}
        free
        isAdult={false}
        noTimePressure
        letters={noStats}
        mastery={masteryFor("normal")}
        onWin={vi.fn()}
        lernweg={w}
      />,
    );
    const vorher = allesLesbare();
    // Erster richtiger Anschlag: jetzt steht der Stand der Höhle („Echo 1 von 2. …").
    fireEvent.keyDown(screen.getByRole("application"), { key: "d" });
    const nachher = allesLesbare();
    const alles = `${vorher} || ${nachher}`;
    if (w === "de") {
      expect(vorher, "Start/Öffner/Intro nennen das Wesen").toMatch(WESEN);
      expect(nachher, "der Stand nennt das Wesen").toMatch(WESEN);
    } else {
      expect(alles).not.toMatch(WESEN);
    }
  });
});

describe("GERENDERT: die Kinder-Hilfe", () => {
  // „kids" zeigt den erzählenden Absatz über die Höhle, „teens" den knappen - beide
  // Stufen zeigen den Abschnitt über die Computerstimmen.
  const STUFEN: Stufe[] = ["kids", "teens"];

  it.each(MATRIX)("Bedienung %s × Weg %s", (s, w) => {
    zustand.sprache = s;
    for (const stufe of STUFEN) {
      const { container, unmount } = render(<TippenHilfe open onClose={() => {}} stufe={stufe} lernweg={w} />);
      const text = container.ownerDocument.body.textContent ?? "";
      if (w === "de") expect(text, `Stufe ${stufe}`).toMatch(WESEN);
      else expect(text, `Stufe ${stufe}`).not.toMatch(WESEN);
      unmount();
    }
  });
});
