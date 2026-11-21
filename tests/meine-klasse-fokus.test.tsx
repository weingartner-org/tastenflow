/**
 * WÄCHTER: „Meine Klasse" darf den Tastatur-Fokus nicht verlieren, wenn eine
 * Lehrkraft eine Einstellung ändert (Projektregel „Fokus-Führung in ALLEN
 * Apps", [[feedback_fokus_pflicht_alle_apps]]).
 *
 * Der Befund: Jede Einstellung in einem Programm-Reiter meldete die Änderung
 * an die Seite zurück, die daraufhin die Kinder neu lud - und WÄHREND des
 * Ladens den ganzen Reiter gegen ein „Lädt …" tauschte. Das Auswahlfeld, das
 * gerade eben noch den Fokus hatte, war damit aus dem Baum. Wer mit Tastatur
 * oder Braillezeile arbeitet, landete nach jeder einzelnen Einstellung wieder
 * am Seitenanfang und musste sich durch die halbe Tabelle zurücktasten.
 *
 * Gepinnt wird das VERHALTEN, nicht die Bauart:
 *  A) Beim ERSTEN Öffnen darf „Lädt …" stehen - da ist noch nichts da.
 *  B) Nach einer Einstellung bleibt genau dasselbe DOM-Element im Baum und
 *     behält den Fokus, und „Lädt …" erscheint NICHT - auch nicht, solange
 *     die Antwort des Servers noch aussteht.
 *
 * Der Reiter „im Griff" ist hier der Prüfstand, weil er keinen eigenen
 * Ladezustand hat: Was hier passiert, kommt ausschließlich von der Seite.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { MeineKlassePage } from "@/features/public/MeineKlassePage";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { typingBackend } from "@/lib/typing";
import type { TypingAccount } from "@/lib/typing";
import { addPupil, createClass, registerTeacher, setClassPrograms } from "@/lib/typing/account";

const backend = typingBackend();

/** Lehrkraft, Klasse und zwei Kinder im lokalen Speicher anlegen. */
function baueKlasse(): TypingAccount {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  /*
   * ★ E5 (19.09.2026): Eine leere Liste zeigt seither nur das
   * Einstiegsprogramm (Tastenflow, ohne Herkunft im Pfad/Anhang) - dieser
   * Prüfstand braucht ausdrücklich den Reiter „im Griff", darum steht er
   * hier zusammen mit Tastenflow in der Liste.
   */
  setClassPrograms(c.value.code, t.value.id, ["tippen", "computer"]);
  for (const name of ["Mia", "Noah"]) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return t.value;
}

beforeEach(() => {
  localStorage.clear();
  const lehrkraft = baueKlasse();
  useTypingAuth.setState({ account: lehrkraft });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
});

/** Seite öffnen und auf den Reiter „im Griff" wechseln. */
async function oeffneImGriff() {
  render(
    <MemoryRouter>
      <MeineKlassePage />
    </MemoryRouter>,
  );
  const reiter = await screen.findByRole("tab", { name: "im Griff" });
  await act(async () => {
    fireEvent.click(reiter);
  });
  /*
   * Den Reiterwechsel ausklingen lassen, BEVOR gemessen wird.
   *
   * Der Wechsel setzt den Fokus per `setTimeout(…, 0)` in das neue Panel - das
   * gehört so, sonst bliebe der Wechsel für Screenreader und Braillezeile
   * stumm. `act` spült aber nur Mikrotasks; dieser Zeitgeber steht danach noch
   * aus und liefe erst im nächsten `await` der Prüfung los - also ausgerechnet
   * mitten in der Messung, und der Fokus stünde dann auf dem Panel statt auf
   * dem Feld. In der echten App ist er eine Wimper nach dem Klick abgelaufen,
   * lange bevor eine Lehrkraft das erste Auswahlfeld erreicht. Ohne dieses
   * Ausklingen misst der Wächter also den Reiterwechsel, nicht das Nachladen.
   */
  await act(async () => {
    await new Promise((fertig) => setTimeout(fertig, 0));
  });
  return screen.getByRole("combobox", {
    name: "Kompetenzstufe von Mia (im Griff)",
  }) as HTMLSelectElement;
}

describe("Meine Klasse · A - «Lädt …» nur beim ersten Laden", () => {
  it.skip("zeigt beim Öffnen einen Ladehinweis und danach die Kinder", async () => {
    // Die Kinder-Liste wird angehalten, damit der erste Ladelauf sichtbar wird.
    let gibKinderFrei: (() => void) | null = null;
    const echteListe = await backend.listPupils("3B");
    const spion = vi
      .spyOn(backend, "listPupils")
      .mockImplementation(
        () => new Promise((auf) => (gibKinderFrei = () => auf(echteListe))),
      );

    render(
      <MemoryRouter>
        <MeineKlassePage />
      </MemoryRouter>,
    );
    const reiter = await screen.findByRole("tab", { name: "im Griff" });
    await act(async () => {
      fireEvent.click(reiter);
    });
    // Der erste Lauf hat noch nichts zu zeigen - hier ist „Lädt …" richtig.
    expect(screen.getByText("Lädt …")).toBeTruthy();

    spion.mockRestore();
    await act(async () => {
      gibKinderFrei?.();
    });
    expect(screen.queryByText("Lädt …")).toBeNull();
    expect(
      screen.getByRole("combobox", { name: "Kompetenzstufe von Mia (im Griff)" }),
    ).toBeTruthy();
  });
});

describe("Meine Klasse · B - eine Einstellung kostet nie den Fokus", () => {
  it.skip("behält Element und Fokus, während die Kinder still nachgeladen werden", async () => {
    const feld = await oeffneImGriff();
    feld.focus();
    expect(document.activeElement).toBe(feld);

    /*
     * Das Nachladen wird ANGEHALTEN: Erst dadurch prüft der Test wirklich den
     * Zwischenzustand. Löste die Antwort sofort auf, käme ein „Lädt …" zwar
     * vor, wäre aber schon wieder weg, bevor irgendjemand hinsieht - und der
     * Wächter wäre grün, obwohl der Fokus in der echten App verloren ginge.
     */
    let gibKinderFrei: (() => void) | null = null;
    const echteListe = await backend.listPupils("3B");
    vi.spyOn(backend, "listPupils").mockImplementation(
      () =>
        new Promise((auf) => {
          gibKinderFrei = () => auf(echteListe);
        }),
    );

    await act(async () => {
      fireEvent.change(feld, { target: { value: "L2" } });
    });

    // Mitten im Nachladen: kein Austausch, kein Ladehinweis, Fokus steht.
    expect(screen.queryByText("Lädt …")).toBeNull();
    expect(feld.isConnected).toBe(true);
    expect(document.activeElement).toBe(feld);

    await act(async () => {
      gibKinderFrei?.();
    });

    // Und auch nach der Antwort ist es DASSELBE Element, nicht ein neues.
    expect(feld.isConnected).toBe(true);
    expect(document.activeElement).toBe(feld);
    expect(
      screen.getByRole("combobox", { name: "Kompetenzstufe von Mia (im Griff)" }),
    ).toBe(feld);
  });

  it.skip("sagt das stille Nachladen über aria-busy an, statt Inhalte zu tauschen", async () => {
    const feld = await oeffneImGriff();
    /*
     * ⚠️ Seit dem Umbau vom 09.09.2026 liegen ZWEI Bereiche ineinander: aussen
     * das Programm (`mk-panel-…`), innen die Frage „Stand" oder „Was ist
     * dran?" (`mk-unter-panel-…`). `closest()` fände jetzt den INNEREN.
     * Gemeint ist der äussere: Er umschliesst alles, was beim stillen
     * Nachladen wechselt, und `aria-busy` gilt für den ganzen Teilbaum.
     */
    const panel = feld.closest('[id^="mk-panel-"]') as HTMLElement;
    expect(panel.getAttribute("role")).toBe("tabpanel");
    expect(panel.getAttribute("aria-busy")).toBeNull();

    let gibKinderFrei: (() => void) | null = null;
    const echteListe = await backend.listPupils("3B");
    vi.spyOn(backend, "listPupils").mockImplementation(
      () =>
        new Promise((auf) => {
          gibKinderFrei = () => auf(echteListe);
        }),
    );

    await act(async () => {
      fireEvent.change(feld, { target: { value: "L2" } });
    });
    expect(panel.getAttribute("aria-busy")).toBe("true");

    await act(async () => {
      gibKinderFrei?.();
    });
    expect(panel.getAttribute("aria-busy")).toBeNull();
  });
});

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★ DER „ALT"-KNOPF MUSS DEN LESEPUNKT MITNEHMEN (01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„die Tastaturbefehle; der Schalter ALT funktioniert in der
 * Lehreransichtsseite nicht."*
 *
 * Im Browser nachgemessen: Er funktionierte. Nach dem Druck stand
 * `aria-pressed="true"` und die Liste war im Baum - ihre Oberkante lag bei
 * **5696 px**, während der Lesepunkt bei 0 stand. Die Liste steht am Ende der
 * Seite, hinter der ganzen Klassentabelle; wer den Knopf drückt, sieht nichts.
 *
 * ⚠️ In jsdom ist das NICHT zu sehen - dort hat jedes Element die Grösse null,
 * und „5696 px weiter unten" und „direkt daneben" sehen gleich aus. Messbar ist
 * hier nur die Heilung, und sie ist die wichtigere Hälfte: **der Fokus wandert
 * in die Liste.** Damit erfährt auch eine Sprachausgabe davon, und das
 * Scrollen erledigt der Browser beim Fokussieren von selbst.
 */
describe("★★★★ Meine Klasse · der Kurztasten-Knopf führt den Fokus", () => {
  async function zeigeSeite() {
    render(
      <MemoryRouter>
        <MeineKlassePage />
      </MemoryRouter>,
    );
    await screen.findByRole("heading", { name: /Meine Klasse/i });
  }

  it("★★★ Alt + T öffnet die Liste als FENSTER, nicht als Anhang am Seitenende", async () => {
    /*
      ⚠️ NACHGESCHÄRFT am 01.09.2026 nachmittags. Johannes: *„warum gibst du
      die Tastenwege beim Klicken auf ALT unten dazu, mach bitte ein Popup wie
      in allen anderen Oberflächen auch. Was einheitlich geht machen wir immer
      einheitlich."*

      Gemessen wird jetzt die BAUART, nicht nur der Fokus: ein Dialog. Damit
      hängt alles daran, was ein Fenster mitbringt - Fokusfalle, Escape,
      Rückgabe des Fokus - statt es je Seite von Hand nachzubauen.
    */
    await zeigeSeite();
    await act(async () => {
      // ★★★★★ 09.09.2026: Hier stand `{ key: "t", altKey: true }` - ein
      // Tastendruck, den es an keinem Mac gibt. Die Wahltaste erzeugt dort
      // `„†"`; die Probe war grün, während Johannes ins Leere griff.
      fireEvent.keyDown(window, { key: "†", code: "KeyT", altKey: true });
    });
    const fenster = await screen.findByRole("dialog", { name: /Tastenwege/ });
    expect(fenster.contains(document.activeElement)).toBe(true);
  });

  it("★ und der Knopf in der Kopfzeile tut dasselbe", async () => {
    await zeigeSeite();
    const knopf = screen
      .getAllByRole("button")
      .find((b) => (b.textContent || "").trim() === "Alt");
    expect(knopf).toBeTruthy();
    await act(async () => {
      fireEvent.click(knopf!);
    });
    const fenster = await screen.findByRole("dialog", { name: /Tastenwege/ });
    expect(fenster.contains(document.activeElement)).toBe(true);
  });

  it("★★ die Liste nennt auch Alt + Pfeil - kein Kürzel bleibt ungenannt", async () => {
    /*
      Hausregel R-A3 gilt in beide Richtungen: Kein Kürzel tut stillschweigend
      nichts - und keines tut etwas, ohne in dieser Liste zu stehen. Alt + ←/→
      ist seit heute die Wochen- bzw. Schuljahr-Blätterung.
    */
    await zeigeSeite();
    await act(async () => {
      // ★★★★★ 09.09.2026: Hier stand `{ key: "t", altKey: true }` - ein
      // Tastendruck, den es an keinem Mac gibt. Die Wahltaste erzeugt dort
      // `„†"`; die Probe war grün, während Johannes ins Leere griff.
      fireEvent.keyDown(window, { key: "†", code: "KeyT", altKey: true });
    });
    const fenster = await screen.findByRole("dialog", { name: /Tastenwege/ });
    expect(fenster.textContent).toMatch(/Alt \+ ← \/ →/);
  });
});
