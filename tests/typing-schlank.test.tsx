/**
 * WÄCHTER der Charge „SCHLANK" (Johannes, 22.08.2026): Über der Übungskarte
 * von „Tastenflow" stand eine graue Leiste - Übungsart, „Spielen", Zahnrad.
 * Sie kostete in JEDER Sitzung Platz und Aufmerksamkeit, obwohl man sie selten
 * braucht. Der Auftrag: „so wenig wie möglich soll vom Üben ablenken."
 *
 * Was dieser Wächter festnagelt (durchweg VERHALTEN, nie Quelltext):
 *   1. Die Leiste ist weg - zwischen Kopfzeile und Übungskarte steht nichts.
 *   2. Das Zahnrad sitzt in der Kopfzeile und klappt den Bereich UNTER ihr auf.
 *   3. Die Übungsart ist die erste Gruppe darin („Was übst du?").
 *   4. Alt + B schaltet sie reihum und SAGT SIE AN - im Formularfeld nicht.
 *   5. „Spielen" steht bis 15 Jahre, ab 16 nicht (Fassung 31.08.2026; am
 *      22.08. stand hier „nur noch in der Kinder-Stufe", siehe unten).
 *
 * `speakUi` wird ersetzt, weil die Ansage sonst unbeobachtbar wäre: Auf dem
 * Bildschirm wechselt zwar die Karte, gehört wird ohne Ansage nichts - und
 * genau darauf ist die Zielgruppe angewiesen.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn() };
});

import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TRAINER_MODE_ANSAGE, speakUi } from "../src/lib/typing";

/** Ein Lernstand mit allen Buchstaben - sonst ist die Bücherei leer. */
const ALLE_BUCHSTABEN = [
  "f", "j", "d", "k", "s", "l", "a", "ö", "e", "n", "i", "r", "t",
  "h", "u", "c", "g", "m", "o", "b", "w", "z", "v", "p", "ä", "ü",
  "x", "y", "q", "ß",
];

beforeEach(() => {
  localStorage.clear();
  einrichtungFertigMerken();
  vi.mocked(speakUi).mockClear();
});
afterEach(cleanup);

/** `stufe` wirkt ohne Konto über die selbst gewählte Textstufe im Zahnrad. */
function renderPage(seed?: Record<string, unknown>) {
  if (seed) localStorage.setItem("tippen-trainer:v1", JSON.stringify(seed));
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

function zahnrad(): HTMLElement {
  return screen.getByRole("button", { name: /Einstellungen/i });
}

/** Zahnrad auf und die Textstufe umstellen (Gäste wählen sie selbst). */
async function stelleStufe(label: RegExp) {
  fireEvent.keyDown(document, { code: "KeyO", altKey: true });
  const feld = await screen.findByLabelText(/Textstufe \(Alter\)/i);
  fireEvent.change(feld, {
    target: {
      value: [...(feld as HTMLSelectElement).options].find((o) => label.test(o.text))!
        .value,
    },
  });
  // Wieder zu - der Wächter prüft danach die Übungskarte, nicht das Zahnrad.
  fireEvent.keyDown(document, { code: "KeyO", altKey: true });
  await waitFor(() => expect(screen.queryByLabelText(/Tastatur-Layout/i)).toBeNull());
}

describe("SCHLANK 1 - die graue Leiste über der Übungskarte ist weg", () => {
  it("★★ beim Üben steht zwischen Kopfzeile und Karte kein Umschalter mehr", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    // Die Übungsarten und „Spielen" waren die Leiste. Zugeklappt darf keine
    // davon auf der Seite stehen.
    expect(screen.queryByRole("button", { name: /^Wortspiele$/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /^Geschichten$/i })).toBeNull();
    expect(screen.queryByRole("group", { name: "Übungsart" })).toBeNull();
  });

  it("★ das Zahnrad steht in der Kopfzeile und öffnet ein FENSTER", async () => {
    /*
      ⚠️ 07.09.2026: Bis dahin hieß dieser Test „…und klappt den Bereich unter
      ihr auf" und maß, dass der Bereich NACH der Kopfzeile im Dokument steht.
      Johannes: *„das einstellungefenster [soll] nicht oben den inhalt nach
      unten schieben sondern ein eigenes fester öffnen"* - genau die Bauart,
      die dieser Test festhielt, ist damit gefallen.
    */
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    const nav = screen.getByRole("navigation", { name: "Werkzeuge" });
    expect(nav.contains(zahnrad())).toBe(true);
    // Ein Dialog wird nicht auf- und zugeklappt: kein `aria-expanded`,
    // kein `aria-controls` - dafür die Dialog-Ankündigung.
    expect(zahnrad()).not.toHaveAttribute("aria-controls");
    expect(zahnrad()).toHaveAttribute("aria-haspopup", "dialog");

    fireEvent.click(zahnrad());
    const bereich = await screen.findByRole("dialog");
    // ★★★ DER KERN DER SACHE: Der Inhalt der Seite rückt NICHT nach unten.
    // Das Fenster hängt am `body` (Portal), nicht im Fluss der Seite.
    const kopf = nav.closest("header")!;
    expect(kopf.contains(bereich)).toBe(false);
    expect(bereich.closest("main")).toBeNull();
    expect(bereich.parentElement?.parentElement).toBe(document.body);
  });

  it("★★ Fokus-Führung: auf per Knopf → in den Bereich, Esc → zurück ins Feld", async () => {
    renderPage();
    await screen.findByRole("textbox");
    fireEvent.click(zahnrad());
    // ★ Der Fokus geht IN das Fenster - das erledigt `Modal` selbst, seit die
    //   Einstellungen ein Dialog sind (07.09.2026). Vorher sprang die Seite
    //   von Hand auf das erste Bedienelement.
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    // Hausregel 14.08.2026: Nach Escape steht der Fokus IMMER in der Eingabezeile.
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("textbox")),
    );
  });

  it("★ auch das Zahnrad führt zurück ins Übungsfeld - EINE Regel für alle Wege", async () => {
    /*
      ⚠️ 07.09.2026 GEÄNDERT. Vorher hieß dieser Test „zugeklappt per Zahnrad
      bleibt der Fokus auf dem Zahnrad (es verschwindet ja nicht)" - richtig,
      solange die Einstellungen ein AUFKLAPPBEREICH waren.

      Bei einem Fenster hing genau das am Zufall: `Modal` gibt den Fokus an den
      Öffner zurück, aber nur, wenn React dieses Element noch im Baum hat -
      sonst fällt es selbst auf das Übungsfeld. Eine Regel, die manchmal so und
      manchmal anders ausgeht, ist keine. Jetzt führen alle fünf Wege hinaus
      (Zahnrad · Alt+O · Escape · „Zurück zum Üben" · Klick auf „Tastenflow")
      an dieselbe Stelle - Johannes' eigene Formulierung: „wieder zum programm".
    */
    renderPage();
    await screen.findByRole("textbox");
    fireEvent.click(zahnrad());
    await screen.findByRole("dialog");
    fireEvent.click(zahnrad());
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("textbox")),
    );
  });
});

describe("SCHLANK 1b - kein Zahnrad, wo es nichts einzustellen gibt", () => {
  it("★★ waehrend der Einrichtung fehlt es - und Alt + O verspricht nichts", async () => {
    // Beim allerersten Start steht die Einrichtung an Stelle des Trainers.
    // Dort gibt es keine Übungsart und keinen Bereich; ein Kürzel, das
    // „Einstellungen geöffnet" meldet und nichts öffnet, waere schlimmer als
    // gar keines.
    localStorage.clear();
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    await screen.findByRole("heading", { name: /Einrichtung|Willkommen|Für wen/i });
    expect(screen.queryByRole("button", { name: /^Einstellungen/i })).toBeNull();
    vi.mocked(speakUi).mockClear();
    fireEvent.keyDown(document, { code: "KeyO", altKey: true });
    expect(vi.mocked(speakUi)).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
    // Dasselbe gilt fuer Alt + B: keine Ansage ohne sichtbare Wirkung.
    fireEvent.keyDown(document, { code: "KeyB", altKey: true });
    expect(vi.mocked(speakUi)).not.toHaveBeenCalled();
  });
});

describe("SCHLANK 2 - »Was übst du?« ist die erste Gruppe im Zahnrad", () => {
  it("★★ DREI Umschalt-Knöpfe, der aktive meldet sich als gedrückt", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(zahnrad());
    const gruppe = await screen.findByRole("group", { name: "Übungsart" });
    const knoepfe = [...gruppe.querySelectorAll("button")];
    // ★ Seit 02.09.2026 vier („Wortspiele" als vierter Bereich), seit E7
    // (19.09.2026) wieder drei - „Lektionen" ist entfallen (siehe
    // `trainerMode.ts`). Die Liste kommt aus `TRAINER_MODES` - dieselbe, an
    // der auch Alt + B hängt.
    expect(knoepfe.map((b) => b.textContent?.replace("📖 ", ""))).toEqual([
      "Mein Training",
      "Geschichten",
      "Wortspiele",
    ]);
    expect(knoepfe[0]).toHaveAttribute("aria-pressed", "true");
    expect(knoepfe[1]).toHaveAttribute("aria-pressed", "false");
  });

  it("★ sie steht VOR den Texten - sie ist die einzige Einstellung, die sofort etwas anderes zeigt", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(zahnrad());
    const bereich = await screen.findByRole("dialog");
    const ueberschriften = [...bereich.querySelectorAll("h3")].map((h) => h.textContent);
    expect(ueberschriften[0]).toContain("Was übst du?");
  });

  it("★★ der Knopf schaltet wirklich um", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(zahnrad());
    fireEvent.click(await screen.findByRole("button", { name: /^Wortspiele$/i }));
    expect(await screen.findByRole("heading", { name: "Wortspiele" })).toBeInTheDocument();
  });
});

describe("SCHLANK 3 - Alt + B schaltet die Übungsart reihum", () => {
  it("★★★ reihum Mein Training → Geschichten → Wortspiele → Mein Training, jedes Mal angesagt", async () => {
    renderPage({ xp: 0, lessons: {}, introduced: ALLE_BUCHSTABEN });
    await screen.findByRole("heading", { name: /Mein Training/i });
    // Der Bereich bleibt offen: Dort steht der Zustand, den das Kürzel bewegt.
    fireEvent.click(zahnrad());
    await screen.findByRole("group", { name: "Übungsart" });
    const gedrueckt = () =>
      [...screen.getByRole("group", { name: "Übungsart" }).querySelectorAll("button")]
        .find((b) => b.getAttribute("aria-pressed") === "true")
        ?.textContent?.replace("📖 ", "");

    expect(gedrueckt()).toBe("Mein Training");
    for (const erwartet of ["Geschichten", "Wortspiele", "Mein Training"] as const) {
      vi.mocked(speakUi).mockClear();
      fireEvent.keyDown(document, { code: "KeyB", altKey: true });
      await waitFor(() => expect(gedrueckt()).toBe(erwartet));
      const ansage =
        erwartet === "Geschichten"
          ? TRAINER_MODE_ANSAGE.buecherei
          : erwartet === "Wortspiele"
            ? TRAINER_MODE_ANSAGE.wortspiele
            : TRAINER_MODE_ANSAGE.adaptiv;
      expect(vi.mocked(speakUi)).toHaveBeenCalledWith(ansage);
    }
  }, 20000);

  it("★★ in einem echten Formularfeld kapert Alt + B nichts", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(zahnrad());
    const feld = await screen.findByLabelText(/Tastatur-Layout/i);
    feld.focus();
    vi.mocked(speakUi).mockClear();
    fireEvent.keyDown(feld, { code: "KeyB", altKey: true });
    expect(vi.mocked(speakUi)).not.toHaveBeenCalledWith(TRAINER_MODE_ANSAGE.buecherei);
    expect(screen.getByRole("button", { name: /^Mein Training$/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("★ das Kürzel steht in der Kurztasten-Liste", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyT", altKey: true });
    const liste = await screen.findByRole("dialog", { name: /Tastenkürzel/i });
    expect(liste.textContent).toContain("Alt + B");
    expect(liste.textContent).toContain("Übungsart");
  });
});

/**
 * ★★ 31.08.2026 (Johannes): „Spiel auch für jugentliche anbieten, nicht für
 * erwachsene, bei einem buchstaben bekommen es aber nur die kinder."
 *
 * Das nimmt Punkt 5 der Charge „SCHLANK" zur Hälfte zurück: Der freie
 * Einstieg (der Knopf, den man selbst drückt) steht wieder bis 15 Jahre - die
 * Runde NACH einer neu freigeschalteten Taste bleibt den Kindern vorbehalten
 * (das prüft `typing-drei-profile.test.tsx` an `gateModeFor`). Genau diese
 * TRENNUNG ist der Kern; darum steht sie hier als eigener Wächter.
 */
describe("SCHLANK 4 (Fassung 31.08.) - »Spielen« bis 15 Jahre, ab 16 nicht", () => {
  it("★★★ Kinder finden den Knopf im Kopf der Übungskarte", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    await stelleStufe(/7/);
    expect(
      await screen.findByRole("button", { name: /Spielen/i }),
    ).toBeInTheDocument();
  });

  it("★★★ die Jugend-Stufe hat den freien Spiel-Einstieg wieder", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    // Vorgabe ohne Angabe ist die Jugend-Stufe - der Knopf muss ohne jede
    // Einstellung da sein (davon hängt auch der Gast ab, der genau hier landet).
    expect(
      await screen.findByRole("button", { name: /Spielen/i }),
    ).toBeInTheDocument();
    await stelleStufe(/11/);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Spielen/i })).toBeInTheDocument(),
    );
  });

  it("★★★ ab 16 bleibt es dabei: kein freier Spiel-Einstieg", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    await stelleStufe(/16|Erwachsen/i);
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /Spielen/i })).toBeNull(),
    );
  });
});
