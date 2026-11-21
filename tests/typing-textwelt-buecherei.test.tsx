/**
 * TW-E3 (Textwelt): Bücherei „Geschichten & Wissen" + Geschichten-Engine im
 * echten UI. Prüft die Verdrahtung Ende-zu-Ende:
 *  • Resume in den Bücherei-Modus; freigeschaltete Serie mit Startknopf,
 *  • Öffnen → Leser zeigt „Etappe 1 von 6" und ein Tippfeld mit der ersten Zeile
 *    (an den Tastenstand angepasst — ungelernte Satzzeichen weggelassen),
 *  • eine Etappe durchtippen → Serie rückt vor (Etappe 2), Fortschritt persistiert,
 *  • gesperrte Serie (zu wenig Tasten) erscheint nur als Vorschau, nicht startbar,
 *  • der Modus-Umschalter „Geschichten" ist da und wechselt in die Bücherei.
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md
 */
import { describe, it, expect, beforeEach } from "vitest";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

// Ein Lernstand, der die T2-Buchstaben (Pilot-Wortschatz) beherrscht.
const INTRODUCED_T2 = [
  "f", "j", "d", "k", "s", "l", "a", "ö",
  "e", "n", "i", "r", "t",
  "h", "u", "c", "g", "m", "o", "b", "w",
];

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
 * Gast-Kontext auf `kids` stellen — den Weg, den ein Kind auch geht: Zahnrad
 * auf, „Textstufe (Alter)" umstellen, Zahnrad wieder zu.
 *
 * Warum das seit Charge I1b (16.08.2026) nötig ist: Die Pilot-Serie „Filo und
 * Mira" ist eine Erstleser-Geschichte und gehört seither NUR noch `kids`; ein
 * Gast startet dagegen mit der Vorgabe `teens` (`VORGABE_STUFE` in account.ts).
 * Geprüft wird hier die Bücherei-Mechanik, nicht die Stufen-Zuordnung — die
 * hält `typing-altersgrenze.test.ts` fest.
 *
 * Das Zahnrad wird ausdrücklich wieder ZUGEKLAPPT: im offenen Einstellungs-
 * Bereich steht ein zweites Eingabefeld (Geburtsjahr), und `getByRole("textbox")`
 * fände dann zwei.
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

/** Startknopf DER Karte „Filo und Mira" (mehrere Serien → mehrere Startknöpfe). */
async function filoStartButton() {
  const heading = await screen.findByRole("heading", { name: /Filo und Mira/i });
  const card = heading.closest("li") as HTMLElement;
  return within(card).getByRole("button", { name: /Los geht|Loslegen|Beginnen|Weiter \(Etappe|Nochmal lesen/i });
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

describe("TW-E3 — Bücherei-UI", () => {
  it("Resume in die Bücherei: freigeschaltete Pilot-Serie mit Startknopf", async () => {
    seed({ xp: 0, lessons: {}, introduced: INTRODUCED_T2, lastPlace: { mode: "buecherei" } });
    renderPage();
    // Erster Render der Datei: hier faellt die einmalige Modul-Initialisierung
    // an (Korpus + Serien). Unter Suite-Last dauert das laenger als die
    // Standard-Wartezeit von 1 s, und die Seite steht noch auf „Laedt ...".
    // Das ist ein Harness-Artefakt, kein App-Verhalten - darum ausdruecklich
    // warten statt die Zusicherung aufzuweichen.
    expect(
      await screen.findByRole(
        "heading",
        { name: /Geschichten & Wissen/i },
        { timeout: 15000 },
      ),
    ).toBeInTheDocument();
    await stufeAufKids();
    expect(
      await screen.findByRole("heading", { name: /Filo und Mira/i }),
    ).toBeInTheDocument();
    expect(await filoStartButton()).toBeInTheDocument();
  });

  it("Öffnen der Serie → Leser zeigt Etappe 1 von 6 und die erste (angepasste) Zeile", async () => {
    seed({ xp: 0, lessons: {}, introduced: INTRODUCED_T2, lastPlace: { mode: "buecherei" } });
    renderPage();
    await stufeAufKids();
    fireEvent.click(await filoStartButton());
    expect(await screen.findByText(/Etappe 1 von 6/i)).toBeInTheDocument();
    const field = (await screen.findByRole("textbox")) as HTMLInputElement;
    // Erste Zeile „Filo ist ein kleiner Hund." → ohne gelernten Punkt: kein "."
    expect(field.value.startsWith("Filo ist ein kleiner Hund")).toBe(true);
    expect(field.value).not.toContain(".");
    // Zurück in die Bücherei
    fireEvent.click(screen.getByRole("button", { name: /Zurück zur Bücherei/i }));
    expect(
      await screen.findByRole("heading", { name: /Geschichten & Wissen/i }),
    ).toBeInTheDocument();
  });

  it("gesperrte Serie: Anfänger sieht nur die Vorschau, keinen Startknopf", async () => {
    seed({
      xp: 0,
      lessons: {},
      introduced: ["f", "j", "d", "k", "s", "l", "a", "ö"], // nur T0
      lastPlace: { mode: "buecherei" },
    });
    renderPage();
    await screen.findByRole("heading", { name: /Geschichten & Wissen/i });
    await stufeAufKids();
    // Titel taucht in der „Das kannst du bald lesen"-Liste auf …
    expect(await screen.findByText(/Filo und Mira/i)).toBeInTheDocument();
    // … aber es gibt keinen Startknopf.
    expect(screen.queryByRole("button", { name: /Los geht|Loslegen|Beginnen|Weiter \(Etappe|Nochmal lesen/i })).toBeNull();
  });

  it("Modus-Umschalter «Geschichten» wechselt aus «Mein Training» in die Bücherei", async () => {
    seed({ xp: 0, lessons: {}, introduced: INTRODUCED_T2 });
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    // Der Umschalter wohnt seit 22.08.2026 im Zahnrad (Charge „SCHLANK").
    fireEvent.keyDown(document, { code: "KeyO", altKey: true });
    fireEvent.click(await screen.findByRole("button", { name: /^Geschichten$/i }));
    expect(
      await screen.findByRole("heading", { name: /Geschichten & Wissen/i }),
    ).toBeInTheDocument();
  });

  it("eine Etappe durchtippen → Serie rückt auf Etappe 2 vor und merkt den Stand", async () => {
    seed({ xp: 0, lessons: {}, introduced: INTRODUCED_T2, lastPlace: { mode: "buecherei" } });
    renderPage();
    await stufeAufKids();
    fireEvent.click(await filoStartButton());
    await screen.findByText(/Etappe 1 von 6/i);

    // Zeile für Zeile durchtippen, bis die Abschluss-Karte („Weiter") erscheint.
    for (let guard = 0; guard < 20; guard++) {
      const weiter = screen.queryByRole("button", { name: /^Weiter$/ });
      if (weiter) break;
      const field = screen.getByRole("textbox") as HTMLInputElement;
      const val = field.value;
      for (const ch of val) fireEvent.keyDown(field, { key: ch });
      // Auf die nächste Zeile ODER die Abschluss-Karte warten (550-ms-Übergang).
      await waitFor(
        () => {
          const stillField = screen.queryByRole("textbox") as HTMLInputElement | null;
          const done = screen.queryByRole("button", { name: /^Weiter$/ });
          expect(!!done || (stillField && stillField.value !== val)).toBe(true);
        },
        { timeout: 3000 },
      );
    }

    // „Weiter" führt zur nächsten Etappe.
    fireEvent.click(screen.getByRole("button", { name: /^Weiter$/ }));
    expect(await screen.findByText(/Etappe 2 von 6/i)).toBeInTheDocument();

    // Fortschritt ist persistiert (Resume-fähig).
    const saved = JSON.parse(localStorage.getItem("tippen-trainer:v1")!);
    expect(saved.storyProgress?.["filo-und-mira"]?.etappe).toBe(1);
    // 22.08.2026 von 30 s auf 60 s - siehe typing-page: im vollen Lauf reichte
    // die alte Grenze unter Last nicht mehr.
  }, 60000);
});
