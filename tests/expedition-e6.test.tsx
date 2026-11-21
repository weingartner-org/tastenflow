/**
 * Polar-Expedition — Polarstation (E6, Bauplan §4.5, umgebaut 13.07. auf Wunsch Johannes zum
 * WORT-RATE-Spiel im SCRABBLE-STIL „Funkspruch entschlüsseln"). Prüft den Wort-Generator (nur
 * freigeschaltete Tasten, aufsteigende Länge, Nomen groß nach Umschalttaste), den Buchstaben-
 * Mischer und den KERN: ein Anagramm lösen OHNE Zeitdruck/Scheitern — Buchstaben liegen
 * durcheinander sichtbar da, das Wort wird in RICHTIGER Reihenfolge getippt, ein Fehlgriff
 * wackelt nur, die Hinweis-Taste (Tab) setzt den nächsten Buchstaben, das gelöste Wort bleibt
 * kurz stehen und wird vorgelesen (das Lösungswort steht vorher NIE im DOM).
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { courseSpots, masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import { isNoun } from "../src/lib/typing/words";
import { buildStationCourse } from "../src/lib/typing/expedition/course";
import { STATION_WORDS, stationGuessWords, scrambleLetters } from "../src/lib/typing/expedition/words";
import { STATION_GROUND_Y, stationLayout } from "../src/components/typing/expedition/scenes/StationScene";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const mastery = masteryFor("normal");
const noStats: Record<string, LetterStat> = {};
const STATION = (units: string[]): FloeCourse => ({ stages: [{ kind: "station", units }] });
const RICH = [..."fjdksölaenirthucgmobw"];
const sorted = (s: string) => [...s.toLowerCase()].sort().join("");

describe("Wort-Generator der Polarstation (words.ts)", () => {
  it("nur freigeschaltete Tasten: jedes Wort ist mit den eingeführten Buchstaben tippbar", () => {
    const intro = ["n", "a", "s", "e"];
    const allowed = new Set(intro);
    const words = stationGuessWords(intro, { count: 2, seed: 0 });
    expect(words.length).toBeGreaterThan(0);
    for (const w of words) for (const ch of w.toLowerCase()) expect(allowed.has(ch)).toBe(true);
  });

  it("Wörter werden über den Besuch LÄNGER (Johannes 13.07.: darf schwerer werden)", () => {
    const words = stationGuessWords(RICH, { count: 3, seed: 0 });
    expect(words).toHaveLength(3);
    expect(words[0].length).toBeLessThanOrEqual(words[1].length);
    expect(words[1].length).toBeLessThanOrEqual(words[2].length);
  });

  it("Nomen groß NUR nach gelernter Umschalttaste (sonst alles klein, §4.5/§7)", () => {
    const klein = stationGuessWords(RICH, { count: 3, seed: 1, shiftLearned: false });
    const gross = stationGuessWords(RICH, { count: 3, seed: 1, shiftLearned: true });
    klein.forEach((w) => expect(w).toBe(w.toLowerCase()));
    gross.forEach((w, i) => {
      if (isNoun(klein[i])) expect(w[0]).toBe(w[0].toUpperCase());
      else expect(w).toBe(klein[i]);
    });
  });

  it("kein getippbares Wort → leere Liste", () => {
    expect(stationGuessWords([], { count: 3 })).toHaveLength(0);
  });

  /**
   * PUNKT 5b (Testerin Durchgang 20.09.2026, Johannes wörtlich): „In der Polarstation sind
   * vertauschte Buchstaben. Bei ASG darf ich aber nicht GAS antworten, sondern SAG. Da
   * sollte etwas eindeutiges hin oder mehrere Lösungen akzeptieren." Punkt (a) (mehrere
   * Lösungen akzeptieren) prüft der Block „Punkt 5" weiter unten; hier Punkt (b): Wörter,
   * die ein ANDERES echtes Wort aus denselben Buchstaben zulassen ("gas"/"sag" sind BEIDE
   * in der Wortliste), bleiben aussen vor, WENN genug eindeutige übrig bleiben. Gemessen
   * (`scripts/_tmp_check_pool.mts`, Zahlen im Bericht): beim Testalphabet (21 Buchstaben)
   * bleiben 109 von 140 Wörtern eindeutig - mehr als genug.
   */
  it("PUNKT 5b: bei genug Buchstaben bleiben mehrdeutige Wörter (mit einer zweiten echten Lösung) aussen vor", () => {
    const mehrdeutig = new Set(["gas", "sag", "als", "sie", "dies", "eis", "leise", "lasch"]);
    for (const seed of [0, 1, 2, 3, 4]) {
      const words = stationGuessWords(RICH, { count: 50, seed });
      for (const w of words) expect(mehrdeutig.has(w.toLowerCase())).toBe(false);
    }
  });

  it("PUNKT 5b: bleibt der eindeutige Vorrat zu klein, gilt der volle Vorrat weiter — nie leer", () => {
    // Nur g, a, s gelernt: „gas“/„sag“ sind hier die EINZIGEN ratbaren Wörter — beide
    // mehrdeutig. Sie wegzufiltern würde den Vorrat auf 0 senken (Johannes: „das darf
    // den Vorrat nicht leer machen").
    const words = stationGuessWords(["g", "a", "s"], { count: 2, seed: 0 });
    expect(words.length).toBeGreaterThan(0);
    expect(words.every((w) => ["gas", "sag"].includes(w.toLowerCase()))).toBe(true);
  });
});

describe("Buchstaben-Mischer (scrambleLetters)", () => {
  it("mischt dieselben Buchstaben (gleiche Menge, gleiche Länge), aber nicht das Wort selbst", () => {
    const s = scrambleLetters("nase");
    expect(s.join("")).toHaveLength(4);
    expect(sorted(s.join(""))).toBe(sorted("nase"));
    expect(s.join("")).not.toBe("nase"); // sonst kein Rätsel
  });
  it("ist deterministisch (stabil über Aufrufe)", () => {
    expect(scrambleLetters("feld").join("")).toBe(scrambleLetters("feld").join(""));
  });
});

describe("Polarstation-Kurs (course.ts)", () => {
  it("buildStationCourse: STATION_WORDS Wörter, Etappen-Art station", () => {
    const c = buildStationCourse(["n", "a", "s", "e"], noStats, mastery, { seed: 0 });
    expect(c.stages).toHaveLength(1);
    expect(c.stages[0].kind).toBe("station");
    expect(c.stages[0].units).toHaveLength(STATION_WORDS);
  });

  it("ohne freigeschaltete Buchstaben → leerer Kurs", () => {
    expect(buildStationCourse([], noStats, mastery).stages).toHaveLength(0);
  });
});

describe("stationLayout", () => {
  it("liegt flach: alle Halte auf dem Station-Boden, x wächst", () => {
    const { pts } = stationLayout(courseSpots(STATION(["nase", "feld"])));
    for (const p of pts) expect(p.y).toBe(STATION_GROUND_Y);
    expect(pts[1].x).toBeGreaterThan(pts[0].x);
  });
});

describe("Polarstation — Anagramm lösen (§4.5, Scrabble-Stil)", () => {
  const WORDS3 = ["nase", "lese", "feld"];
  function renderStation(units = WORDS3) {
    render(
      <ExpeditionStage
        open
        onClose={vi.fn()}
        course={STATION(units)}
        free
        isAdult={false}
        noTimePressure={false}
        letters={noStats}
        onWin={vi.fn()}
        onFinished={vi.fn()}
      />,
    );
    return screen.getByRole("application");
  }

  // Die Kachel-Buchstaben (Titel „📻 …" ist länger → wegfiltern).
  const tileLetters = () =>
    [...document.body.querySelectorAll(".px-station-tiles text")]
      .map((t) => (t.textContent ?? "").trim())
      .filter((s) => s.length === 1)
      .join("");
  // Die schon getippten Buchstaben in den Slots.
  const slotLetters = () =>
    [...document.body.querySelectorAll(".px-station-slots text")].map((t) => t.textContent ?? "").join("");
  const liveText = () =>
    [...document.body.querySelectorAll('[role="alert"], [role="status"]')].map((e) => e.textContent ?? "").join(" | ");
  const type = (field: Element, ch: string) => act(() => void fireEvent.keyDown(field, { key: ch }));

  it("zeigt die Buchstaben DURCHEINANDER, Slots leer — das Lösungswort steht NICHT im DOM", () => {
    renderStation();
    expect(sorted(tileLetters())).toBe(sorted("nase")); // alle Buchstaben da …
    expect(tileLetters().toLowerCase()).not.toBe("nase"); // … aber durcheinander
    expect(slotLetters()).toBe(""); // noch nichts getippt
    expect(liveText().toLowerCase()).not.toMatch(/\bnase\b/); // Wort nirgends genannt
  });

  it("kein Zeitdruck: es läuft kein Countdown-Balken", () => {
    renderStation();
    expect(document.body.querySelector(".px-timer")).toBeNull();
  });

  it("richtige Reihenfolge füllt die Slots; falscher Buchstabe wackelt nur (kein Fortschritt)", () => {
    const field = renderStation();
    type(field, "a"); // 'a' ist im Wort, aber NICHT der erste Buchstabe → kein Slot
    expect(slotLetters()).toBe("");
    type(field, "n"); // richtiger erster Buchstabe
    expect(slotLetters()).toBe("n");
    type(field, "a");
    expect(slotLetters()).toBe("na");
  });

  it("Hinweis-Taste (Tab) setzt den nächsten Buchstaben", () => {
    const field = renderStation(["nase"]);
    act(() => void fireEvent.keyDown(field, { key: "Tab" }));
    expect(slotLetters()).toBe("n");
  });

  it("Wort gelöst → bleibt kurz stehen + wird VORGELESEN, dann weiter zum nächsten (länger)", () => {
    vi.useFakeTimers();
    const field = renderStation(["nase", "feld"]);
    for (const ch of "nase") type(field, ch);
    // Gelöst: Wort steht + wird vorgelesen (Live-Region nennt es JETZT), noch nicht weiter.
    expect(liveText().toLowerCase()).toMatch(/nase/);
    act(() => vi.advanceTimersByTime(1500)); // Steh-/Vorlese-Pause abwarten
    expect(sorted(tileLetters())).toBe(sorted("feld")); // nächstes Wort
    expect(slotLetters()).toBe(""); // frisch
  });

  it("alle drei Wörter gelöst → geschafft (freies Spiel zeigt Nochmal spielen)", () => {
    vi.useFakeTimers();
    const field = renderStation();
    for (const word of WORDS3) {
      for (const ch of word) type(field, ch);
      act(() => vi.advanceTimersByTime(1500)); // Steh-Pause + weiter
    }
    act(() => vi.advanceTimersByTime(1000)); // ins Ziel gleiten
    expect(screen.getByText(/Nochmal spielen/i)).toBeTruthy();
  });

  it("nennt die Zone (HUD/aria)", () => {
    renderStation();
    expect(screen.getAllByText(/Polarstation/).length).toBeGreaterThan(0);
  });
});

/**
 * PUNKT 5a (Testerin Durchgang 20.09.2026, Johannes wörtlich): „In der Polarstation sind
 * vertauschte Buchstaben. Bei ASG darf ich aber nicht GAS antworten, sondern SAG. Da
 * sollte etwas eindeutiges hin oder mehrere Lösungen akzeptieren." „gas“ und „sag“ stehen
 * BEIDE in der Wortliste (`src/lib/typing/words.ts`) und sind damit auch beide echte
 * Wörter im Lexikon (`isRealWord`/`lexikonWoerter`, dieselbe Quelle wie der
 * Buchstabensalat) — der Kurs unten zeigt „gas“, das Kind tippt „sag".
 */
describe("Polarstation — Punkt 5 (20.09.2026): mehrere gültige Lösungen aus denselben Buchstaben", () => {
  function renderStationWith(units: string[]) {
    render(
      <ExpeditionStage
        open
        onClose={vi.fn()}
        course={STATION(units)}
        free
        isAdult={false}
        noTimePressure={false}
        letters={noStats}
        onWin={vi.fn()}
        onFinished={vi.fn()}
      />,
    );
    return screen.getByRole("application");
  }
  const slotLetters = () =>
    [...document.body.querySelectorAll(".px-station-slots text")].map((t) => t.textContent ?? "").join("");
  const liveText = () =>
    [...document.body.querySelectorAll('[role="alert"], [role="status"]')].map((e) => e.textContent ?? "").join(" | ");
  const type = (field: Element, ch: string) => act(() => void fireEvent.keyDown(field, { key: ch }));

  it("„sag“ zählt als gelöst, obwohl der Funkspruch „gas“ zeigt — das Kind hat recht", () => {
    const field = renderStationWith(["gas"]);
    type(field, "s");
    type(field, "a");
    type(field, "g");
    expect(liveText().toLowerCase()).toMatch(/sag/); // das TATSÄCHLICH getippte Wort
    // Hausregel „nie etwas gegen ein Kind": keine Ansage darf einen Irrtum behaupten.
    expect(liveText().toLowerCase()).not.toMatch(/falsch|fehler|irrt/);
  });

  it("die Slot-Anzeige zeigt die TATSÄCHLICH getippten Buchstaben ('s', nicht 'g')", () => {
    const field = renderStationWith(["gas"]);
    type(field, "s");
    expect(slotLetters()).toBe("s"); // NICHT „g“ (der erste Buchstabe des „gedachten“ Worts)
    type(field, "a");
    expect(slotLetters()).toBe("sa");
  });

  it("eine Eingabe, die zu KEINER echten Lösung passt, wackelt weiter nur (kein falsches Akzeptieren)", () => {
    // Weder „gas“ noch „sag“ beginnt mit „a“.
    const field = renderStationWith(["gas"]);
    type(field, "a");
    expect(slotLetters()).toBe("");
  });

  it("die gewürfelten Kärtchen bleiben unverändert (dieselben Buchstaben, unabhängig von der gefundenen Lösung)", () => {
    renderStationWith(["gas"]);
    const kaertchen = [...document.body.querySelectorAll(".px-station-tiles text")]
      .map((t) => (t.textContent ?? "").trim())
      .filter((s) => s.length === 1)
      .join("");
    expect([...kaertchen].sort().join("")).toBe([..."gas"].sort().join(""));
  });
});

/**
 * PUNKT 2 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Hier werden Großbuchstaben
 * angezeigt, es ist aber egal, was man drückt." Getippt wird klein (keine Umschalttaste
 * nötig, `handleStationKey` vergleicht kleingeschrieben) — die Anzeige folgt dem jetzt.
 */
describe("Polarstation — Punkt 2 (20.09.2026): Anzeige folgt der Taste, nicht fest Grossbuchstaben", () => {
  it("die Kärtchen zeigen KLEINBUCHSTABEN (Standard-Einstellung `uppercase=false`, wie in jeder anderen Zone)", () => {
    render(
      <ExpeditionStage
        open
        onClose={vi.fn()}
        course={STATION(["nase"])}
        free
        isAdult={false}
        noTimePressure={false}
        letters={noStats}
        onWin={vi.fn()}
        onFinished={vi.fn()}
      />,
    );
    const kaertchen = [...document.body.querySelectorAll(".px-station-tiles text")]
      .map((t) => (t.textContent ?? "").trim())
      .filter((s) => s.length === 1);
    expect(kaertchen.length).toBeGreaterThan(0);
    for (const ch of kaertchen) expect(ch).toBe(ch.toLowerCase());
  });
});
