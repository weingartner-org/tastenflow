/**
 * Thema 3 (21.07.): „In einer Geschichte weitermachen".
 *
 * Bricht ein Kind mitten in einer Geschichte ab, muss es am nächsten Tag genau
 * dort weitermachen können. Zwei Bausteine:
 *  (a) Die Bücherei bietet die zuletzt geöffnete Serie ganz oben als „Weiter" an
 *      (`lastPlace.serieSlug`) — kein automatischer Sprung, ein Klick.
 *  (b) ZEILENGENAU innerhalb der Etappe (`storyProgress[slug].line`): wer bei
 *      Zeile 5 von 12 aufhört, startet dort und nicht wieder bei Zeile 1.
 *
 * Geprüft wird beides — die reine Rechenlogik UND das echte UI, jeweils auf dem
 * ANONYMEN Weg (localStorage), weil der beim Neuladen am leichtesten bricht.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { ohneBildschirmTastatur } from "./_typing-probelauf";
import {
  advanceStory,
  noteStoryLine,
  resetStory,
  resumeSerie,
  serieBySlug,
  startEtappeFor,
  startLineFor,
  storyStateFor,
  type TypingProgress,
} from "../src/lib/typing";

const INTRODUCED_T2 = [
  "f", "j", "d", "k", "s", "l", "a", "ö",
  "e", "n", "i", "r", "t",
  "h", "u", "c", "g", "m", "o", "b", "w",
];
const FILO = "filo-und-mira";
const filo = serieBySlug(FILO)!;

function prog(p: Partial<TypingProgress>): TypingProgress {
  return { xp: 0, lessons: {}, introduced: INTRODUCED_T2, ...p };
}

function seed(progress: Record<string, unknown>) {
  localStorage.setItem("tippen-trainer:v1", JSON.stringify(progress));
}

function renderPage() {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

/**
 * Gast-Kontext auf `kids` stellen — der Weg, den ein Kind auch geht: Zahnrad
 * auf, „Textstufe (Alter)" umstellen, Zahnrad wieder zu.
 *
 * Seit Charge I1b (16.08.2026) gehört die Pilot-Serie „Filo und Mira" nur noch
 * `kids`; ein Gast startet aber mit der Vorgabe `teens` (`VORGABE_STUFE`).
 * Geprüft wird hier das Wiedereinsteigen, nicht die Stufen-Zuordnung. Das
 * Zahnrad wird wieder zugeklappt, weil im offenen Bereich ein zweites
 * Eingabefeld (Geburtsjahr) steht und `getByRole("textbox")` sonst zwei fände.
 */
async function stufeAufKids() {
  const zahnrad = await screen.findByRole(
    "button",
    { name: /Einstellungen/i },
    { timeout: 15000 },
  );
  fireEvent.click(zahnrad);
  fireEvent.change(await screen.findByLabelText(/Textstufe \(Alter\)/i), {
    target: { value: "kids" },
  });
  fireEvent.click(zahnrad);
}

beforeEach(() => {
  localStorage.clear();
  // Seit 08.08.2026 steht beim ALLERERSTEN Start die Einrichtung an Stelle des
  // Trainers (Alter · Sprache · Tastatur · Ton · Podcast). Diese Tests prüfen
  // den Trainer, nicht den ersten Start — darum gilt sie hier als erledigt.
  // Der eigene Wächter dafür ist tests/typing-einrichtung.test.tsx.
  einrichtungFertigMerken();
  // ★★★ 08.09.2026 - die Bildschirm-Tastatur bleibt in dieser Datei AUS.
  //
  // Sie ist `aria-hidden`, also eine rein optische Hilfe, kostete in jsdom aber
  // den Löwenanteil der Laufzeit: Bei JEDEM Anschlag zeichnet sie rund fünfzig
  // eingefärbte Tasten neu (die nächste Taste wechselt ja), und zwar DOPPELT -
  // unsichtbare Messvorlage plus sichtbare Tastatur -, jede Taste mit einem
  // `style={{ borderColor, background }}`. jsdom schickt jede dieser Farben
  // durch seinen CSS-Parser. Im Browser ist das billig, in jsdom teuer.
  //
  // IN DIESEM ORDNER GEMESSEN (A/B im selben Prozess, Last 175):
  //     Tastatur AN : 148,5 / 56,3 ms je Anschlag
  //     Tastatur AUS: 5,3 ms je Anschlag        → 19-fach
  // CPU-Profil der reinen Tipp-Schleife mit Tastatur: 27,7 % für das Parsen von
  // CSS-Farben (`cssstyle` + `@asamuzakjp/css-color`), aber nur 2,9 % für den
  // Code, den dieser Test prüft. Ohne Tastatur fällt `cssstyle` auf 0,9 %.
  //
  // Abgeschaltet wird über denselben Schalter, den ein Kind in den
  // Einstellungen hat. Kein Test in dieser Datei fasst die Tastatur an.
  //
  // ⚠️ Nebenwirkung mit Ansage: Eine fehlerfreie Runde OHNE Tastatur verdient
  // das Abzeichen „Blindflug" (`badges.ts`). Keine Zusicherung hier baut auf
  // der Liste der verdienten Abzeichen auf.
  //
  // Volle Begründung samt Messwerten - auch, warum gefälschte Zeitgeber KEIN
  // Ausweg sind: `tests/_typing-probelauf.ts`.
  ohneBildschirmTastatur();
});

describe("Thema 3 (b) — zeilengenauer Stand", () => {
  it("merkt die Zeile der laufenden Etappe", () => {
    const sp = noteStoryLine({ [FILO]: { etappe: 2 } }, FILO, 2, 5);
    expect(storyStateFor(sp, FILO)).toEqual({ etappe: 2, done: false, line: 5 });
  });

  it("übernimmt KEINEN Stand aus einer anderen Etappe", () => {
    const vorher = { [FILO]: { etappe: 2, line: 5 } };
    // Der Leser steht auf Etappe 0 (z. B. nach „nochmal lesen") — sein Zeilen-
    // stand darf den Stand der fälligen Etappe 2 nicht überschreiben.
    expect(noteStoryLine(vorher, FILO, 0, 9)).toEqual(vorher);
  });

  it("merkt für eine fertige Serie nichts mehr", () => {
    const fertig = { [FILO]: { etappe: 6, done: true } };
    expect(noteStoryLine(fertig, FILO, 6, 4)).toEqual(fertig);
  });

  it("wirft den Zeilen-Stand beim Etappenwechsel und beim Zurücksetzen weg", () => {
    const mitten = { [FILO]: { etappe: 1, line: 7 } };
    expect(storyStateFor(advanceStory(mitten, FILO, 6), FILO).line).toBe(0);
    expect(storyStateFor(resetStory(mitten, FILO), FILO).line).toBe(0);
  });

  it("startLineFor gibt den gemerkten Stand zurück …", () => {
    const p = prog({ storyProgress: { [FILO]: { etappe: 1, line: 5 } } });
    expect(startEtappeFor(p, filo)).toBe(1);
    expect(startLineFor(p, filo)).toBe(5);
  });

  it("… aber 0, wenn der Stand hinter dem Etappen-Ende läge oder die Serie fertig ist", () => {
    const zuWeit = prog({ storyProgress: { [FILO]: { etappe: 0, line: 99 } } });
    expect(startLineFor(zuWeit, filo)).toBe(0);
    const fertig = prog({ storyProgress: { [FILO]: { etappe: 6, done: true, line: 4 } } });
    expect(startLineFor(fertig, filo)).toBe(0);
  });

  it("startLineFor ist rückwärtsverträglich (Altstand ohne line)", () => {
    expect(startLineFor(prog({ storyProgress: { [FILO]: { etappe: 2 } } }), filo)).toBe(0);
    expect(startLineFor(prog({}), filo)).toBe(0);
  });
});

describe("Thema 3 (a) — welche Serie wird als „Weiter“ angeboten", () => {
  const allowed = new Set(INTRODUCED_T2);

  it("bevorzugt die ZULETZT geöffnete Serie — auch ohne fertige Etappe", () => {
    // Genau der Abbruch-Fall: Etappe 0 läuft noch, Status wäre „neu".
    const p = prog({
      lastPlace: { mode: "buecherei", serieSlug: FILO },
      storyProgress: { [FILO]: { etappe: 0, line: 3 } },
    });
    expect(resumeSerie(p, allowed, "kids", "de", "de")?.slug).toBe(FILO);
  });

  it("bietet nichts an, wenn noch nie eine Serie geöffnet wurde", () => {
    expect(resumeSerie(prog({}), allowed, "kids", "de", "de")).toBeUndefined();
  });

  it("überspringt eine fertig gelesene Serie", () => {
    const p = prog({
      lastPlace: { mode: "buecherei", serieSlug: FILO },
      storyProgress: { [FILO]: { etappe: 6, done: true } },
    });
    expect(resumeSerie(p, allowed, "kids", "de", "de")?.slug).not.toBe(FILO);
  });

  it("überspringt eine (noch) nicht freigeschaltete Serie", () => {
    const p = prog({
      introduced: ["f", "j", "d", "k", "s", "l", "a", "ö"], // nur T0
      lastPlace: { mode: "buecherei", serieSlug: FILO },
      storyProgress: { [FILO]: { etappe: 1 } },
    });
    expect(resumeSerie(p, new Set(p.introduced), "kids", "de", "de")).toBeUndefined();
  });
});

describe("Thema 3 — im echten UI (anonym, localStorage)", () => {
  it("zeigt die angefangene Geschichte oben mit Etappe UND Zeile", async () => {
    seed({
      xp: 0,
      lessons: {},
      introduced: INTRODUCED_T2,
      lastPlace: { mode: "buecherei", serieSlug: FILO },
      storyProgress: { [FILO]: { etappe: 0, line: 3 } },
    });
    renderPage();
    await stufeAufKids();

    // „Hier warst du zuletzt" statt „Fortsetzen": Der Pilot gehört seit Charge
    // I1b zu `kids`, und das Kinder-Profil spricht das Kind an (das nüchterne
    // Profil sagt „Fortsetzen"). Geprüft wird hier die Etappen-/Zeilen-Anzeige,
    // nicht die Wortwahl.
    const weiter = await screen.findByText(/Hier warst du zuletzt/i);
    const karte = weiter.closest("div.card") as HTMLElement;
    expect(within(karte).getByRole("heading", { name: /Filo und Mira/i })).toBeInTheDocument();
    // Zeile 3 (0-basiert) = die 4. Zeile der Etappe.
    expect(within(karte).getByText(/Etappe 1 von 6 · Zeile 4 von 12/i)).toBeInTheDocument();
  });

  it("„Weiterlesen“ steigt genau bei der gemerkten Zeile ein", async () => {
    seed({
      xp: 0,
      lessons: {},
      introduced: INTRODUCED_T2,
      lastPlace: { mode: "buecherei", serieSlug: FILO },
      storyProgress: { [FILO]: { etappe: 0, line: 3 } },
    });
    renderPage();
    await stufeAufKids();

    fireEvent.click(await screen.findByRole("button", { name: /Weiterlesen/i }));
    expect(await screen.findByText(/Etappe 1 von 6/i)).toBeInTheDocument();
    const field = (await screen.findByRole("textbox")) as HTMLInputElement;
    // 4. Zeile der Etappe 1 — NICHT die erste („Filo ist ein kleiner Hund").
    expect(field.value.startsWith("Mira wohnt in einem Baum")).toBe(true);
  });

  it("ohne gemerkte Zeile beginnt die Etappe wie bisher bei Zeile 1", async () => {
    seed({
      xp: 0,
      lessons: {},
      introduced: INTRODUCED_T2,
      lastPlace: { mode: "buecherei", serieSlug: FILO },
      storyProgress: { [FILO]: { etappe: 0 } },
    });
    renderPage();
    await stufeAufKids();

    fireEvent.click(await screen.findByRole("button", { name: /Weiterlesen/i }));
    const field = (await screen.findByRole("textbox")) as HTMLInputElement;
    expect(field.value.startsWith("Filo ist ein kleiner Hund")).toBe(true);
  });

  it("schreibt den Zeilen-Stand beim Tippen mit (überlebt das Neuladen)", async () => {
    seed({
      xp: 0,
      lessons: {},
      introduced: INTRODUCED_T2,
      lastPlace: { mode: "buecherei" },
    });
    renderPage();
    await stufeAufKids();

    const heading = await screen.findByRole("heading", { name: /Filo und Mira/i });
    const card = heading.closest("li") as HTMLElement;
    fireEvent.click(within(card).getByRole("button", { name: /Los geht|Loslegen|Beginnen|Weiter \(Etappe/i }));
    await screen.findByText(/Etappe 1 von 6/i);

    // Zwei Zeilen tippen …
    for (let n = 0; n < 2; n++) {
      const field = screen.getByRole("textbox") as HTMLInputElement;
      const val = field.value;
      for (const ch of val) fireEvent.keyDown(field, { key: ch });
      await waitFor(
        () => {
          const jetzt = screen.queryByRole("textbox") as HTMLInputElement | null;
          expect(jetzt && jetzt.value !== val).toBe(true);
        },
        { timeout: 3000 },
      );
    }

    // … der Stand liegt im Spielstand: Serie gemerkt UND bei Zeile 2 (0-basiert).
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("tippen-trainer:v1")!);
      expect(saved.lastPlace?.serieSlug).toBe(FILO);
      expect(saved.storyProgress?.[FILO]?.line).toBe(2);
      expect(saved.storyProgress?.[FILO]?.etappe).toBe(0); // Etappe noch nicht fertig
    });
  }, 30000);
});
