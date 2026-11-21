/**
 * Wächter der GRUNDREGEL von „Tastenflow" (Johannes 14.08.2026):
 *
 *   **Escape schließt jedes Fenster — und der Fokus steht danach IMMER in der
 *   Eingabezeile.**
 *
 * Vorher kannte der Escape-Zweig der Seite nur drei Fenster (Hilfe, Kurztasten,
 * Statistik), schloss immer nur das oberste davon und gab den Fokus allein bei
 * der Hilfe zurück. Wer aus der Statistik kam, musste sich erst wieder ins
 * Schreibfeld tabben; die Einstellungen und die Lektionsliste hörten auf Escape
 * gar nicht.
 *
 * Geprüft wird beides — dass das Fenster zugeht UND wo der Fokus danach steht.
 * Die Fokus-Anforderung läuft bewusst einen Takt später (`setTimeout(0)` in
 * lib/typing/focusField.ts), damit das geschlossene Fenster erst aus dem Baum
 * ist; darum wartet jeder Test mit `waitFor`.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import {
  focusPracticeField,
  takePracticeFocusRequest,
  PENDING_MS,
} from "../src/lib/typing/focusField";

const JANO = {
  id: "p-jano",
  role: "schueler" as const,
  name: "Jano",
  classCode: "5A3",
  stufe: "b" as const,
  createdAt: 1,
};

beforeEach(() => {
  // jsdom kennt scrollIntoView nicht — die Lektionsliste scrollt die aktive
  // Lektion beim Aufpoppen mittig in den Blick.
  Element.prototype.scrollIntoView = () => {};
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

function esc() {
  fireEvent.keyDown(document, { key: "Escape" });
}

/** Das Übungsfeld der Tipp-Sitzung (data-typing-field="practice"). */
function feld(): HTMLElement | null {
  return document.querySelector('[data-typing-field="practice"]');
}

async function warteAufFeldFokus() {
  await waitFor(() => expect(document.activeElement).toBe(feld()));
}

describe("Escape holt IMMER die Eingabezeile", () => {
  it("★★★ ohne offenes Fenster: Escape setzt den Fokus ins Schreibfeld", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    // Fokus bewusst woanders hin (ein Knopf der Seite).
    const knopf = screen.getByRole("button", { name: /Kurztasten|Tastenkürzel/i });
    knopf.focus();
    expect(document.activeElement).not.toBe(feld());
    esc();
    await warteAufFeldFokus();
  });

  it("★★★ Statistik: geht zu UND der Fokus landet im Schreibfeld", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await screen.findAllByRole("button", { name: /Statistik schließen/ });
    esc();
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /Statistik schließen/ })).toBeNull(),
    );
    // Der Trainer baut sich nach der Statistik NEU auf und lädt seinen
    // Spielstand asynchron — das Feld gibt es im nächsten Takt noch gar nicht.
    // Es löst die offene Anforderung beim Erscheinen selbst ein.
    await warteAufFeldFokus();
  });

  it("★★★ Tastenkürzel-Fenster: geht zu UND der Fokus landet im Schreibfeld", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyT", altKey: true });
    await screen.findByRole("dialog", { name: /Tastenkürzel/ });
    esc();
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: /Tastenkürzel/ })).toBeNull(),
    );
    await warteAufFeldFokus();
  });

  it("★★★ Hilfe: geht zu UND der Fokus landet im Schreibfeld", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyH", altKey: true });
    await screen.findByRole("dialog");
    esc();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await warteAufFeldFokus();
  });

  it("★★★ Einstellungs-Bereich (Zahnrad): klappt bei Escape zu — vorher hörte er gar nicht darauf", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyO", altKey: true });
    expect(await screen.findByLabelText("Tastatur-Layout")).toBeInTheDocument();
    esc();
    await waitFor(() =>
      expect(screen.queryByLabelText("Tastatur-Layout")).toBeNull(),
    );
    await warteAufFeldFokus();
  });

  it("★★ Konto-Menü: Escape gibt den Fokus ins Schreibfeld statt auf den Öffner", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto/ }));
    await screen.findByRole("button", { name: "Passwort ändern" });
    esc();
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Passwort ändern" })).toBeNull(),
    );
    await warteAufFeldFokus();
  });

  // ★ E7 (19.09.2026): Der Test „Lektionsliste im Lehrgang" ist entfallen -
  // die Übungsart „Lektionen" samt Lektionsliste gibt es nicht mehr
  // (Johannes: „als eigenen Bereich auflösen, nur noch Vorlagen").
});

describe("Die Fokus-Anforderung selbst (focusField.ts)", () => {
  it("bleibt kurz offen, damit ein erst später aufgebautes Feld sie einlöst", () => {
    focusPracticeField(1000);
    expect(takePracticeFocusRequest(1000 + PENDING_MS - 1)).toBe(true);
  });

  it("wird beim Lesen VERBRAUCHT (kein zweites Feld reißt den Fokus an sich)", () => {
    focusPracticeField(1000);
    expect(takePracticeFocusRequest(1001)).toBe(true);
    expect(takePracticeFocusRequest(1002)).toBe(false);
  });

  it("verfällt, wenn viel zu viel Zeit vergangen ist", () => {
    focusPracticeField(1000);
    expect(takePracticeFocusRequest(1000 + PENDING_MS + 1)).toBe(false);
  });
});
