/**
 * Wächter: Die Statistik geht auf DREI Wegen wieder zu (Johannes 10.08.2026:
 * „sonst sucht man überall den Schalter"):
 *   1. der Knopf „Statistik schließen" — er steht oben UND unten,
 *   2. noch einmal **Alt + S** (dasselbe Kürzel, das sie öffnet),
 *   3. **Escape** — die Taste, mit der in dieser App alles zugeht.
 *
 * Dazu die zweite Hälfte des Wunsches: „Passwort ändern" gehört ins Konto-Menü
 * und NICHT in die Statistik. Der Wächter dafür prüft, dass die Maske dort
 * wirklich nicht mehr steht.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";

/**
 * Ein angemeldetes Schüler-Konto. Der Anmelde-Speicher (`useTypingAuth`) liest
 * die Sitzung EINMAL beim Laden des Moduls — im Test wäre localStorage dafür zu
 * spät. Darum wird der Zustand direkt gesetzt.
 */
const JANO = {
  id: "p-jano",
  role: "schueler" as const,
  name: "Jano",
  classCode: "5A3",
  stufe: "b" as const,
  createdAt: 1,
};

beforeEach(() => {
  localStorage.clear();
  einrichtungFertigMerken();
  useTypingAuth.setState({ account: JANO });
});

function zeigeSeite() {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

/** Alt + S auf der Seite auslösen (e.code, layout-unabhängig — wie in der App). */
function altS() {
  fireEvent.keyDown(document, { code: "KeyS", altKey: true });
}

describe("Statistik schließen", () => {
  it("★ Alt + S öffnet sie — und noch einmal Alt + S schließt sie wieder", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    altS();
    expect(
      await screen.findAllByRole("button", { name: /Statistik schließen/ }),
    ).toHaveLength(2); // oben UND unten
    altS();
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /Statistik schließen/ })).toBeNull(),
    );
  });

  it("★ Escape schließt sie ebenfalls", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    altS();
    await screen.findAllByRole("button", { name: /Statistik schließen/ });
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /Statistik schließen/ })).toBeNull(),
    );
  });

  it("der Knopf schließt sie (oben wie unten derselbe Weg)", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    altS();
    const knoepfe = await screen.findAllByRole("button", {
      name: /Statistik schließen/,
    });
    fireEvent.click(knoepfe[1]); // der UNTERE — dafür gibt es ihn
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /Statistik schließen/ })).toBeNull(),
    );
  });

  it("★★ in der Statistik steht KEINE Passwort-Maske mehr", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    altS();
    await screen.findAllByRole("button", { name: /Statistik schließen/ });
    expect(screen.queryByRole("button", { name: /Passwort ändern/ })).toBeNull();
  });

  it("★★ dafür steht sie im Konto-Menü", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto/ }));
    fireEvent.click(screen.getByRole("button", { name: "Passwort ändern" }));
    expect(
      await screen.findByRole("dialog", { name: /Passwort ändern/ }),
    ).toBeInTheDocument();
    // Die Maske ist gleich offen — kein zweiter Aufklapp-Schalter im Fenster.
    expect(screen.getByLabelText("Aktuelles Passwort")).toBeInTheDocument();
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   DAS ZAHNRAD GIBT ES AUCH IN DER STATISTIK (Johannes 30.08.2026)
   ══════════════════════════════════════════════════════════════════════════
   Vorher war es dort ausgeblendet - wer beim Anschauen der Abzeichen das
   Vorlesen oder die Stimme umstellen wollte, musste erst zurück ins Üben.
   Die Gruppe „Was übst du?" fehlt in der Statistik weiterhin: Sie wechselte
   dort unsichtbar die Übungsart hinter der Auswertung. */
describe("Einstellungen in der Statistik", () => {
  it("★★ das Zahnrad steht auch in der Statistik - und öffnet die Einstellungen", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    altS();
    await screen.findAllByRole("button", { name: /Statistik schließen/ });
    const zahnrad = screen.getByRole("button", { name: /Einstellungen/ });
    fireEvent.click(zahnrad);
    // Der Bereich ist offen - mit „Vorlesen", aber OHNE „Was übst du?".
    expect(
      await screen.findByRole("heading", { name: /Vorlesen/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Was übst du/ })).toBeNull();
  });

  it("★ beim Üben hat derselbe Bereich die Gruppe „Was übst du?“ weiterhin", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Einstellungen/ }));
    expect(
      await screen.findByRole("heading", { name: /Was übst du/ }),
    ).toBeInTheDocument();
  });
});
