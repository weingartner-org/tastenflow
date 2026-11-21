/**
 * Die Konto-Seite der Lernwerkstatt OHNE Anmeldung (21.09.2026).
 *
 * Johannes: *„wenn ich ohne Anmeldung in der Lernwerkstatt auf Konto klicke,
 * kommt nur ‚Melde dich in einem dieser Programme an'. Da soll die Erklärung
 * kommen und die Möglichkeit der Anmeldung für alle Apps."*
 *
 * Fünf Dinge hält dieser Wächter fest, und jedes ist eine Entscheidung:
 *
 *  1. **Erst die Erklärung, dann die Anmeldung** - in dieser Reihenfolge, beide
 *     da. Vorher stand nur ein Satz und vier Verweise.
 *  2. **Dieselbe Anmeldung wie in den Programmen** - Lernende UND Lehrkraft,
 *     nicht eine eigene, dritte Fassung ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *  3. **Kein Fokus-Sprung beim Ankommen.** Im Programm MUSS der Fokus ins
 *     Formular, hier ist es Teil der Seite: Wer ankommt, liest zuerst.
 *  4. **Keine Tastenflow-Fragen** (Geburtsjahr, „Womit anfangen?") - die Seite
 *     legt Konten für ALLE Programme an. ⚠️ Die GEGENPROBE steht dabei: In
 *     Tastenflow selbst bleiben beide Felder, sonst wäre ein „fehlt hier"
 *     auch ein „fehlt überall".
 *  5. **Nach dem Anmelden geht der Fokus auf die Überschrift.** Das Formular
 *     verschwindet samt dem Knopf, den man eben betätigt hat; ohne Ziel bliebe
 *     der Fokus im Nichts.
 *
 * ⚠️ Was er NICHT beweist: dass die Anmeldung gegen den echten Server klappt.
 * Das Formular ist dasselbe, das Tastenflow und »im Griff« benutzen; hier wird
 * nur geprüft, dass es da ist und sich anders benimmt, wo es soll.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, act, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LernwerkstattKontoPage } from "../src/features/public/LernwerkstattKontoPage";
import { TypingAuth } from "../src/components/typing/TypingAuth";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import type { TypingAccount } from "../src/lib/typing";

const KIND: TypingAccount = {
  id: "p-1",
  role: "schueler",
  name: "Jano",
  classCode: "5A3",
  createdAt: 1,
};

afterEach(() => {
  cleanup();
  useTypingAuth.setState({ account: null });
});

function zeigeSeite() {
  useTypingAuth.setState({ account: null });
  return render(
    <MemoryRouter>
      <LernwerkstattKontoPage />
    </MemoryRouter>,
  );
}

const warte = (ms = 30) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

/** Wählt „Ich übe allein" und schaltet auf „Konto erstellen" - dort stehen die Zusatzfelder. */
function zumEigenenKontoErstellen() {
  fireEvent.click(screen.getByRole("checkbox", { name: /Ich übe allein/ }));
  fireEvent.click(screen.getByRole("button", { name: "Konto erstellen" }));
}

describe("Konto-Seite ohne Anmeldung", () => {
  it("zeigt die Erklärung UND die Anmeldung - in dieser Reihenfolge", () => {
    zeigeSeite();
    const erklaerung = screen.getByRole("heading", { name: "Ein Konto für alle Programme" });
    const wer = screen.getByRole("group", { name: "Wer meldet sich an?" });
    // Erklärung steht VOR dem Formular im Dokument.
    expect(
      erklaerung.compareDocumentPosition(wer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    // Die alte Sackgasse ist weg.
    expect(screen.queryByText(/Melde dich in einem dieser Programme an/)).toBeNull();
  });

  it("bietet dieselbe Anmeldung wie die Programme: Lernende und Lehrkraft", () => {
    zeigeSeite();
    expect(screen.getByRole("button", { name: "Lernende" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Lehrkraft" })).toBeTruthy();
    // „Ohne Konto weiterüben" führt zurück in die Lernwerkstatt, nicht ins Leere.
    expect(screen.getByRole("button", { name: "Ohne Konto weiterüben" })).toBeTruthy();
  });

  it("bleibt bei den Verweisen in die Programme - als Weg, nicht als Ersatz", () => {
    zeigeSeite();
    const nav = screen.getByRole("navigation", { name: "Lernprogramme" });
    expect(nav.querySelectorAll("a").length).toBeGreaterThan(0);
  });

  it("holt den Fokus NICHT ins Formular, wenn man ankommt", async () => {
    zeigeSeite();
    await warte();
    expect(document.activeElement).toBe(document.body);
  });

  it("fragt weder Geburtsjahr noch „Womit anfangen?\" - das gehört Tastenflow", () => {
    zeigeSeite();
    zumEigenenKontoErstellen();
    // Gegenprobe der Gegenprobe: Wir stehen wirklich im Anlege-Formular
    // (das zweite Passwortfeld gibt es nur dort) - sonst wäre „fehlt" wertlos.
    expect(document.getElementById("e-pw2")).toBeTruthy();
    expect(screen.queryByLabelText(/Geburtsjahr/)).toBeNull();
    expect(screen.queryByText(/Womit anfangen/)).toBeNull();
  });

  it("GEGENPROBE: in Tastenflow selbst fragt dasselbe Formular beides weiter", () => {
    render(
      <MemoryRouter>
        <TypingAuth onCancel={() => {}} />
      </MemoryRouter>,
    );
    zumEigenenKontoErstellen();
    expect(screen.getByLabelText(/Geburtsjahr/)).toBeTruthy();
    expect(screen.getByText(/Womit anfangen/)).toBeTruthy();
  });

  it("GEGENPROBE: in Tastenflow selbst springt der Fokus weiter ins Formular", async () => {
    render(
      <MemoryRouter>
        <TypingAuth onCancel={() => {}} />
      </MemoryRouter>,
    );
    await warte();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Lernende" }));
  });

  it("nach dem Anmelden steht der Fokus auf der Überschrift der Seite", async () => {
    zeigeSeite();
    act(() => useTypingAuth.setState({ account: KIND }));
    await warte();
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { level: 1, name: "Meine Zugangsdaten" }),
    );
    // Das Formular ist weg, die Erklärung auch.
    expect(screen.queryByRole("group", { name: "Wer meldet sich an?" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Ein Konto für alle Programme" })).toBeNull();
  });

  it("wer schon angemeldet ANKOMMT, bekommt keinen Fokus-Sprung", async () => {
    useTypingAuth.setState({ account: KIND });
    render(
      <MemoryRouter>
        <LernwerkstattKontoPage />
      </MemoryRouter>,
    );
    await warte();
    expect(document.activeElement).toBe(document.body);
  });
});
