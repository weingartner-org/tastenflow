/**
 * ★ WÄCHTER: Spielstand und Kompetenzen BLEIBEN beim Umstellen von Altersstufe
 * und Sprache (Johannes 07.08.2026: „die spielstände und kompetenzen müssen
 * auch erhalten bleiben wenn man zwischen den sprachen und im Alter umstellt!").
 *
 * Stufe und Sprache sind reine ANZEIGE-Weichen (welche Texte, welcher Ton) —
 * der Spielstand (freigeschaltete Tasten, Buchstaben-Statistik, Punkte,
 * Lektionen, Geschichten-Fortschritt, No-Repeat-Gedächtnis, Themenstränge)
 * ist EIN Stand und darf sich durch das Umstellen nie ändern. Dieser Test
 * stellt einen reichen Spielstand her, schaltet über das echte Zahnrad alle
 * Stufen und beide Sprachen durch und vergleicht danach Feld für Feld.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";

beforeEach(() => {
  localStorage.clear();
  // Seit 08.08.2026 steht beim ALLERERSTEN Start die Einrichtung an Stelle des
  // Trainers (Alter · Sprache · Tastatur · Ton · Podcast). Diese Tests prüfen
  // den Trainer, nicht den ersten Start — darum gilt sie hier als erledigt.
  // Der eigene Wächter dafür ist tests/typing-einrichtung.test.tsx.
  einrichtungFertigMerken();
});

const STORAGE_KEY = "tippen-trainer:v1";

/** Ein Kind mitten im Lernweg: 17 Einheiten, Statistik, Lektionen, Geschichte. */
const STAND = {
  xp: 540,
  lessons: {
    "home-fj": { completed: true, bestStars: 3, bestCpm: 120, attempts: 2 },
    "home-dk": { completed: true, bestStars: 2, bestCpm: 95, attempts: 1 },
  },
  letters: {
    f: { hits: 40, misses: 2, sumMs: 12000, timed: 40, recent: [300, 280, 310] },
    j: { hits: 38, misses: 1, sumMs: 11400, timed: 38, recent: [290, 300] },
  },
  introduced: ["f", "j", "d", "k", "s", "l", "a", "ö", "⇧", "e", "n", "i", "r", "t", "h", "u", "c"],
  level: 12,
  speedEma: 110,
  seenBausteine: "AAECAwQ=",
  manifestVersion: 12345,
  seenManifestCount: 100,
  roundsTotal: 41,
  storyProgress: { "das-nest-in-der-tanne": { etappe: 2, line: 5, startDay: "2026-08-01" } },
  arcProgress: { "arc-x": { step: 2, lastRound: 33 } },
  badges: { volltreffer: 1722000000000 },
  lastPlace: { mode: "adaptiv" as const },
};

function renderPage() {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

/** Die Auswahlfelder des Zahnrads, erkannt an ihren Options-Werten. */
function selectMit(value: string): HTMLSelectElement {
  const alle = screen.getAllByRole("combobox") as HTMLSelectElement[];
  const s = alle.find((el) => [...el.options].some((o) => o.value === value));
  if (!s) throw new Error(`Kein Auswahlfeld mit Option ${value}`);
  return s;
}

describe("Spielstand bleibt bei Stufen- und Sprachwechsel erhalten", () => {
  it("alle Stufen und beide Sprachen durchschalten — kein Feld ändert sich", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STAND));
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });

    // Zahnrad öffnen (das echte UI, kein Direktzugriff auf den Store).
    fireEvent.click(
      screen.getByRole("button", { name: /Einstellungen/i }),
    );
    const stufe = selectMit("erwachsen");
    const sprache = selectMit("en");

    for (const s of ["a", "c", "erwachsen", "b"]) {
      fireEvent.change(stufe, { target: { value: s } });
    }
    fireEvent.change(sprache, { target: { value: "en" } });
    // Die Items regenerieren asynchron — dem Trainer einen Tick lassen.
    await waitFor(() => expect(sprache.value).toBe("en"));
    fireEvent.change(sprache, { target: { value: "de" } });
    await waitFor(() => expect(sprache.value).toBe("de"));

    const danach = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    // Feld für Feld (nicht als Ganzes): so benennt ein Bruch sofort das Opfer.
    for (const feld of [
      "xp",
      "lessons",
      "letters",
      "introduced",
      "level",
      "speedEma",
      "seenBausteine",
      "manifestVersion",
      "seenManifestCount",
      "roundsTotal",
      "storyProgress",
      "arcProgress",
      "badges",
    ] as const) {
      expect(danach[feld], `Feld verändert: ${feld}`).toEqual(STAND[feld]);
    }
  });

  // ★ E7 (19.09.2026): Der Test „auch der Lektionen-Bereich vergisst beim
  // Sprachwechsel nichts" ist ersatzlos gestrichen, nicht angepasst - er
  // prüfte, dass der Übungsbildschirm der Übungsart „Lektionen" beim
  // Sprachwechsel auf DERSELBEN Lektion („Grundstellung: S und L") stehen
  // blieb. Diese Übungsart ist entfallen (`TypingTrainer.tsx`, siehe
  // `trainerMode.ts`); die eigentliche Zusage - das Feld `lessons` ändert
  // sich beim Sprachwechsel nicht - prüft der Test oben bereits Feld für
  // Feld, unabhängig vom Modus.
});
