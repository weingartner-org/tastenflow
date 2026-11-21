/**
 * WÄCHTER: Der Reiter „Tastenflow" in „Meine Klasse" darf den Tastatur-Fokus
 * nicht verlieren, wenn eine Lehrkraft eine Einstellung ändert (Projektregel
 * „Fokus-Führung in ALLEN Apps", [[feedback_fokus_pflicht_alle_apps]]).
 *
 * Der Befund: Jedes Auswahlfeld und jedes Häkchen in der Tabelle meldete die
 * Änderung mit einem `bump()` an - und das lud den ganzen Reiter neu und
 * tauschte ihn währenddessen gegen ein „Lädt …". Das Bedienelement unter dem
 * Fokus war damit aus dem Baum. In einer Tabelle mit vierzehn Spalten und
 * einer Zeile je Kind kostet das eine Lehrkraft mit Blindheit nach JEDER
 * einzelnen Einstellung den halben Weg zurück. Für das Schreibfeld
 * „Geburtsjahr" war das schon geheilt; jetzt gilt dieselbe Regel für alles.
 *
 * Gepinnt wird das VERHALTEN:
 *  A) Nach einer Einstellung ist es DASSELBE Element, es hat den Fokus, es
 *     zeigt den neuen Wert - und „Lädt …" erscheint nicht.
 *  B) Das gilt für Auswahlfelder wie für Häkchen.
 *  C) Eine aufgeklappte Zeile bleibt aufgeklappt (die Zeile wird nicht neu
 *     gebaut, sonst wäre auch ihr Fokus weg).
 *  D) Beim ERSTEN Laden darf „Lädt …" stehen - da ist noch nichts da.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { startPoints, typingBackend } from "@/lib/typing";
import type { TypingAccount } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getClass,
  listPupils,
  registerTeacher,
} from "@/lib/typing/account";

const backend = typingBackend();

/** Klasse mit zwei Kindern im lokalen Speicher anlegen. */
function baueKinder(): TypingAccount[] {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of ["Mia", "Noah"]) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return listPupils(c.value.code);
}

let kinder: TypingAccount[] = [];

beforeEach(() => {
  localStorage.clear();
  kinder = baueKinder();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Reiter rendern und warten, bis Fortschritt und Telemetrie da sind. */
async function zeigeReiter() {
  render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
  await screen.findByRole("table", { name: /Lernende der Klasse/ });
}

/**
 * ★ Seit Layout A (01.09.2026) stehen die EINSTELLUNGEN hinter dem Knopf
 * „Einstellungen" vor dem Namen - die Zeile zeigt nur noch die Leistung. Die
 * Regel, die dieser Wächter schützt, ist dieselbe geblieben: Das
 * Bedienelement unter dem Fokus darf seine eigene Einstellung überleben.
 * Aufgeklappt wird darum vorher.
 *
 * ★ E4 (18.09.2026): „Womit anfangen?", die Häkchen und das Wochenziel liegen
 * seither ZUSÄTZLICH hinter der eigenen Zeile „Einstellungen für {Name}"
 * (ein `<details>`, zu bis geöffnet) - eine Ebene tiefer als vorher. Diese
 * Funktion klappt darum BEIDE auf: erst die Person, dann ihre
 * Einstellungs-Zeile. Der `<summary>` bekommt in jsdom keine eigene Rolle
 * („button" fehlt), darum über den sichtbaren Text geklickt.
 */
async function oeffneEinstellungen(name = "Mia") {
  const knopf = screen.getByRole("button", {
    name: `Einstellungen und Auswertung von ${name} ausklappen`,
  });
  await act(async () => {
    fireEvent.click(knopf);
  });
  fireEvent.click(screen.getByText(new RegExp(`^Einstellungen für ${name}\\b`)));
  return knopf;
}

/**
 * Das Auswahlfeld, an dem diese Datei ihre Fokus-Regeln misst. Bis zum
 * 01.09.2026 war das „Start-Niveau" (Tempo); seither steht dort „Womit
 * anfangen?" - dieselbe Bauart, dieselbe Frage an sie.
 */
const startFeld = () =>
  screen.getByRole("combobox", { name: "Womit Mia anfängt" }) as HTMLSelectElement;
/** Zwei Werte aus der Liste, die sicher nicht die Vorgabe sind. */
const startWert = (n: number) => String(startPoints("de", "de")[n].units);
const einhandFeld = () =>
  screen.getByRole("checkbox", {
    name: "Einhand schreiben für Mia: Umschalt-Gegenhand-Regel aus",
  }) as HTMLInputElement;

describe("Tastenflow-Reiter · A - ein Auswahlfeld überlebt seine eigene Einstellung", () => {
  it("behält Element, Fokus und den neuen Wert, ohne «Lädt …» zu zeigen", async () => {
    await zeigeReiter();
    await oeffneEinstellungen();
    const feld = startFeld();
    feld.focus();

    await act(async () => {
      fireEvent.change(feld, { target: { value: startWert(3) } });
    });

    expect(screen.queryByText("Lädt …")).toBeNull();
    expect(feld.isConnected).toBe(true);
    expect(document.activeElement).toBe(feld);
    // Kein Zurückspringen auf den alten Wert: Das Feld zeigt, was der Server
    // geantwortet hat.
    expect(feld.value).toBe(startWert(3));
    expect(startFeld()).toBe(feld);
  });

  /*
    ★ B8/B10 (11.09.2026): Die Sprache steht nicht mehr je Kind, sondern im
    Kasten „Einstellungen der Klasse". Die Regel, die dieser Wächter schützt,
    gilt dort genauso - und sie ist dort sogar wichtiger: Der Kasten steht seit
    11.09.2026 ganz unten, nach der Tabelle; ein Neuaufbau würfe die Lehrkraft
    an den Seitenanfang zurück, weit weg von dem Feld, das sie eben geändert hat.
  */
  it("gilt genauso für die Sprache - jetzt im Kasten der Klasse", async () => {
    const cls = getClass(kinder[0].classCode ?? "")!;
    const lehrerId = cls.teacherId;
    render(
      <TastenflowReiter
        pupils={kinder}
        onChanged={() => {}}
        cls={cls}
        teacherId={lehrerId}
      />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    // ★ E3 (18.09.2026): der Kasten steht seither hinter dem Schalter
    // „Einstellungen der Klasse" der Aufgaben-Zeile - erst öffnen.
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));

    const feld = screen.getByRole("combobox", {
      name: `Sprache der Klasse ${cls.name}`,
    }) as HTMLSelectElement;
    feld.focus();

    await act(async () => {
      fireEvent.change(feld, { target: { value: "en" } });
    });

    expect(screen.queryByText("Lädt …")).toBeNull();
    expect(document.activeElement).toBe(feld);
    expect(feld.value).toBe("en");
  });
});

describe("Tastenflow-Reiter · B - dasselbe gilt für die Häkchen", () => {
  it("behält Element, Fokus und den neuen Zustand", async () => {
    await zeigeReiter();
    await oeffneEinstellungen();
    const feld = einhandFeld();
    feld.focus();
    expect(feld.checked).toBe(false);

    await act(async () => {
      fireEvent.click(feld);
    });

    expect(screen.queryByText("Lädt …")).toBeNull();
    expect(feld.isConnected).toBe(true);
    expect(document.activeElement).toBe(feld);
    expect(feld.checked).toBe(true);
    expect(einhandFeld()).toBe(feld);
  });
});

describe("Tastenflow-Reiter · C - eine aufgeklappte Zeile bleibt aufgeklappt", () => {
  it("baut die Zeile bei einer Einstellung nicht neu", async () => {
    await zeigeReiter();
    await oeffneEinstellungen();
    expect(
      screen.getByRole("button", {
        name: "Einstellungen und Auswertung von Mia einklappen",
      }),
    ).toBeTruthy();

    await act(async () => {
      fireEvent.change(startFeld(), { target: { value: startWert(2) } });
    });

    // Wäre die Zeile neu gebaut worden, stünde sie wieder zugeklappt da.
    expect(
      screen.getByRole("button", {
        name: "Einstellungen und Auswertung von Mia einklappen",
      }),
    ).toBeTruthy();
  });
});

describe("Tastenflow-Reiter · D - «Lädt …» nur beim ersten Laden", () => {
  it("zeigt den Ladehinweis, solange der Stand der Kinder noch aussteht", async () => {
    // Ein Halt je Kind - der Reiter fragt für jedes einzeln nach.
    const haltestellen: (() => void)[] = [];
    const echterStand = await backend.getProgress(kinder[0].id);
    const spion = vi
      .spyOn(backend, "getProgress")
      .mockImplementation(
        () =>
          new Promise((auf) => {
            haltestellen.push(() => auf(echterStand));
          }),
      );

    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
    expect(screen.getByText("Lädt …")).toBeTruthy();

    spion.mockRestore();
    await act(async () => {
      for (const frei of haltestellen) frei();
    });
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    expect(screen.queryByText("Lädt …")).toBeNull();
  });
});

describe("Tastenflow-Reiter · E - die Seite wird je Handgriff genau einmal gerufen", () => {
  /**
   * ★ W3b (18.09.2026): „Für die Klasse übernehmen" schreibt das Ziel seit
   * `setKlassenWochenziel` in EINEM Aufruf ans Backend (die Schleife über
   * alle Kinder läuft jetzt in `account.ts`, nicht mehr hier in der Seite) -
   * die Regel bleibt aber dieselbe wie vorher beim alten `onSetClassGoal`:
   * genau EIN Aufruf, genau EINE Meldung an die Seite, egal wie viele Kinder
   * die Klasse hat.
   */
  it("meldet «Für die Klasse übernehmen» genau einmal, nicht je Kind", async () => {
    const gemeldet = vi.fn();
    const gesetzt = vi.spyOn(backend, "setKlassenWochenziel");
    const cls = getClass(kinder[0].classCode ?? "")!;
    const lehrerId = cls.teacherId;

    render(<TastenflowReiter pupils={kinder} onChanged={gemeldet} cls={cls} teacherId={lehrerId} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    // ★ E3 (18.09.2026): „Wochenziel" steht seither hinter einem eigenen
    // Schalter der Aufgaben-Zeile - erst öffnen.
    fireEvent.click(screen.getByRole("button", { name: /^Wochenziel/ }));
    fireEvent.change(screen.getByLabelText("Minuten pro Woche"), {
      target: { value: "20" },
    });
    gemeldet.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Für die Klasse übernehmen" }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });

    // Ein einziger Aufruf ans Backend - die Schleife über beide Kinder läuft
    // dort, nicht mehr in dieser Seite …
    expect(gesetzt).toHaveBeenCalledTimes(1);
    // … und die Seite hört davon auch nur ein einziges Mal.
    expect(gemeldet).toHaveBeenCalledTimes(1);
  });

  it("meldet auch eine einzelne Einstellung genau einmal", async () => {
    const gemeldet = vi.fn();
    render(<TastenflowReiter pupils={kinder} onChanged={gemeldet} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await oeffneEinstellungen();
    gemeldet.mockClear();

    await act(async () => {
      fireEvent.change(startFeld(), { target: { value: startWert(3) } });
    });
    expect(gemeldet).toHaveBeenCalledTimes(1);
  });
});
