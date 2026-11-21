/**
 * ★★★★★ DER PROBELAUF AUF DER SEITE - sieht eine Lehrkraft ihre Schalter?
 *
 * Johannes am 04.09.2026:
 *
 *   „als lehrer kann man in einstellungen kein startlevel von sich selbst
 *    einstellen und auch nicht das tempo? Können das alle anderen (außer
 *    schüler einer klasse, die dürfen das nicht selbst)"
 *
 * ── WARUM DIESER TEST AUF DER SEITE STEHT UND NICHT AM BAUTEIL ────────────
 *
 * Es gab schon einen Test für den Startpunkt: `tastenflow-startpunkt-selbst`.
 * Er war die ganze Zeit GRÜN - und hat den Fehler trotzdem nicht gesehen. Er
 * prüft `TypingSettings` mit den Props, die er selbst hineinreicht, und
 * beantwortet damit nur: „zeigt das Bauteil das Feld, wenn man es ihm sagt?"
 *
 * Die Frage, die zählt, ist eine andere: „SAGT die Seite es einer Lehrkraft?"
 * Genau dort - beim Rechnen der Props in `TippenTrainerPage` - stand die zu
 * enge Bedingung. Ein Bauteil-Test kann eine falsche Bedingung nicht finden,
 * weil er sie ersetzt.
 *
 * ⇒ Deshalb wird hier die ganze Seite gebaut, mit einem echten Konto im
 *   Anmeldezustand, und danach gefragt, was auf dem Bildschirm steht.
 *
 * Die Regel selbst und der Quelltext-Wächter stehen daneben in
 * `tastenflow-selbst-einstellen.test.ts`.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";

/** Eine Lehrkraft, die selbst übt - seit 03.09.2026 darf sie das. */
const LEHRKRAFT = {
  id: "t-heike",
  role: "lehrkraft" as const,
  name: "Heike",
  email: "heike@example.org",
  createdAt: 1,
};

/** Ein Kind einer Klasse - seine Lehrkraft führt beide Einstellungen. */
const KLASSENKIND = {
  id: "p-jano",
  role: "schueler" as const,
  name: "Jano",
  classCode: "5A3",
  createdAt: 1,
};

/** Ein selbstlernendes Konto - eigene Anmeldung, keine Klasse. */
const SELBSTLERNEND = {
  id: "p-frei",
  role: "schueler" as const,
  name: "Mira",
  selfManaged: true,
  createdAt: 1,
};

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
  localStorage.clear();
  einrichtungFertigMerken();
  // ⚠️ 07.09.2026: Bis dahin stand hier `localStorage.setItem("tippen-settings-
  // open", "1")` - der Bereich klappte beim Start von selbst auf. Seit die
  // Einstellungen ein FENSTER sind (Johannes' Auftrag), gibt es diesen
  // gemerkten Zustand nicht mehr, und zwar mit Absicht: Eine App, die mit
  // einem modalen Dialog startet, sperrt ein Kind mit Screenreader bei jedem
  // Einstieg erst einmal darin ein. Geöffnet wird jetzt in `zeigeSeiteFuer`.
});
afterEach(cleanup);

async function zeigeSeiteFuer(konto: unknown) {
  useTypingAuth.setState({ account: konto as never });
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
  // Erst wenn die Übungskarte steht, gibt es das Zahnrad.
  await screen.findByRole("heading", { name: /Mein Training/i });
  // Das Fenster öffnen - sonst stünde nichts da, wonach zu fragen wäre.
  fireEvent.click(screen.getByRole("button", { name: /Einstellungen/i }));
  await screen.findByRole("dialog");
}

/** Das Feld „Womit anfangen?" - da oder nicht da. */
function startpunktFeld(): Element | null {
  return document.querySelector('[aria-label="Startpunkt im Lernstoff"]');
}

/** Der „Zeit lassen"-Knopf, egal in welcher Stellung. */
function zeitLassenKnopf(): HTMLButtonElement | null {
  return (
    (Array.from(document.querySelectorAll("button")).find((b) =>
      /Zeit lassen:/.test(b.textContent ?? ""),
    ) as HTMLButtonElement) ?? null
  );
}

describe("Eine Lehrkraft, die selbst übt", () => {
  it("★★★★★ sieht „Womit anfangen?“ - ihren eigenen Startpunkt", async () => {
    await zeigeSeiteFuer(LEHRKRAFT);
    await waitFor(() =>
      expect(
        startpunktFeld(),
        "Eine Lehrkraft gehört keiner Klasse an - sie setzt ihren Startpunkt selbst",
      ).toBeTruthy(),
    );
  });

  it("★★★★★ kann „Zeit lassen“ umlegen - der Knopf ist nicht gesperrt", async () => {
    await zeigeSeiteFuer(LEHRKRAFT);
    const knopf = zeitLassenKnopf();
    expect(knopf, "den „Zeit lassen“-Knopf muss es geben").toBeTruthy();
    expect(
      knopf!.disabled,
      "gesperrt war er, weil die Bedingung `!account` lautete - eine Lehrkraft " +
        "ist angemeldet und hat trotzdem niemanden über sich",
    ).toBe(false);
  });

  it("★★★ bekommt NICHT den Satz „stellt deine Lehrkraft ein“", async () => {
    // Der Satz stand vorher wörtlich vor ihr - für eine Lehrkraft eine Auskunft
    // über eine Person, die es nicht gibt.
    await zeigeSeiteFuer(LEHRKRAFT);
    expect(document.body.textContent).not.toMatch(/stellt deine Lehrkraft ein/);
  });
});

describe("Die Gegenprobe - sonst wäre alles oben auch bei offener Tür grün", () => {
  it("★★★★ Kind einer Klasse: kein Startpunkt, „Zeit lassen“ gesperrt", async () => {
    await zeigeSeiteFuer(KLASSENKIND);
    expect(
      startpunktFeld(),
      "in einer Klasse führt die Lehrkraft den Startpunkt",
    ).toBeNull();
    const knopf = zeitLassenKnopf();
    expect(knopf, "der Knopf steht da - er zeigt den Stand an").toBeTruthy();
    expect(knopf!.disabled, "…aber umlegen darf ihn nur die Lehrkraft").toBe(true);
  });

  it("★★ Selbstlernendes Konto: darf beides selbst", async () => {
    await zeigeSeiteFuer(SELBSTLERNEND);
    await waitFor(() => expect(startpunktFeld()).toBeTruthy());
    expect(zeitLassenKnopf()!.disabled).toBe(false);
  });

  it("★★ Gast ohne Anmeldung: darf beides selbst", async () => {
    await zeigeSeiteFuer(null);
    await waitFor(() => expect(startpunktFeld()).toBeTruthy());
    expect(zeitLassenKnopf()!.disabled).toBe(false);
  });
});
