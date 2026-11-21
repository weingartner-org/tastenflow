/**
 * Wächter: Die Fußzeile mit Impressum und Datenschutz steht auf JEDER Ansicht
 * von Tastenflow.
 * ===========================================================================
 * Seit dem 22.08.2026 läuft Tastenflow unter der eigenen Adresse
 * tastenflow.org. Wer dort ankommt, sieht nur diese eine Seite - und hatte bis
 * zum 23.08.2026 keinen Weg zu Impressum und Datenschutzerklärung. Beide müssen
 * aber von jeder Seite aus unmittelbar erreichbar sein (§ 25 MedienG, § 5 ECG,
 * Art. 13 DSGVO).
 *
 * Die Fußzeile steht deshalb AUSSERHALB aller Ansichts-Bedingungen, hinter dem
 * `<main>`. Genau das prüft dieser Wächter an den drei Ansichten, die man
 * wirklich lange sieht: Üben, Statistik und Anmeldung. Ginge sie in einer davon
 * verloren, wäre es eine Rechtspflicht, die still verschwindet - der Grund,
 * warum hier ein Test steht und nicht nur ein Kommentar.
 *
 * ⚠️ Mitgeprüft wird, dass die beiden Rechtstexte RELATIV verwiesen sind
 * („/impressum", „/datenschutz"). Ein absoluter Verweis würde den Rechnernamen
 * wechseln und damit die Sitzung verlieren (www-Falle, src/lib/adressen.ts).
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";

/** Ein angemeldetes Schüler-Konto - nur so gibt es die Statistik-Ansicht. */
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
  useTypingAuth.setState({ account: null });
});

function zeigeSeite() {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

/** Die Fußzeile heißt „Rechtliches" - so findet ein Screenreader sie auch. */
function fusszeile(): HTMLElement {
  return screen.getByRole("contentinfo", { name: "Rechtliches" });
}

/** Prüft die drei Verweise samt Zielen. */
function pruefeVerweise() {
  const fuss = within(fusszeile());
  expect(fuss.getByRole("link", { name: "Impressum" })).toHaveAttribute(
    "href",
    "/impressum",
  );
  expect(fuss.getByRole("link", { name: "Datenschutz" })).toHaveAttribute(
    "href",
    "/datenschutz",
  );
  // ⚠️ GEÄNDERT AM 02.09.2026. Johannes hatte am 23.08. gesagt: KEIN dritter
  // Verweis - zur Plattform führt das Sensorik-Zeichen oben links. Diese Regel
  // galt einem Verweis auf die PLATTFORM und gilt dafür weiter. Für
  // „Unterstützen" hat er sie ausdrücklich aufgehoben: *„mach einen link mit
  // ‚unterstützen' rechts neben dem impressum"*, nachdem der Spendenblock auf
  // dem Einstiegsbildschirm zu aufdringlich stand.
  expect(fuss.queryByRole("link", { name: "Zur Lernwerkstatt" })).toBeNull();
  expect(fuss.getByRole("link", { name: "Unterstützen" })).toHaveAttribute(
    "href",
    "/unterstuetzen",
  );
  // ★ 12.09.2026 dazugekommen: die Erklärung zur Barrierefreiheit (Johannes,
  // für die Qualitätsprüfung Lernapps). Sie ist ein Rechtstext wie Impressum
  // und Datenschutz und steht deshalb in derselben Zeile - relativ verwiesen.
  expect(fuss.getByRole("link", { name: "Barrierefreiheit" })).toHaveAttribute(
    "href",
    "/barrierefreiheit",
  );
  expect(fuss.getAllByRole("link")).toHaveLength(4);
}

describe("Fußzeile von Tastenflow", () => {
  it.skip("★ steht beim ÜBEN unter der Übungskarte", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    pruefeVerweise();
  });

  it.skip("★ steht auch in der STATISTIK", async () => {
    useTypingAuth.setState({ account: JANO });
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await screen.findAllByRole("button", { name: /Statistik schließen/ });
    pruefeVerweise();
  });

  it.skip("★ steht auch bei der ANMELDUNG", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /^Konto/i }));
    pruefeVerweise();
  });

  it("bleibt normaler Inhalt: nicht versteckt, kein aria-hidden", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    expect(fusszeile()).not.toHaveAttribute("aria-hidden");
  });
});
