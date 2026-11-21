/**
 * ★★★ WÄCHTER: „Womit anfangen?" bei der SELBSTANMELDUNG (01.09.2026).
 *
 * Johannes: *„Ich muss die startstufe ‚Wo fangen wir an' gleich bei der
 * erstellung beim anlegen von schülern in der klasse angeben können und wenn
 * sich jemand selbst anmeldet auch."*
 *
 * In der Klasse setzt die Lehrkraft den Startpunkt beim Anlegen. Wer sich
 * SELBST anmeldet, hat niemanden, der es für ihn tut - also muss er es dort
 * angeben können.
 *
 * ── Was hier gemessen wird ────────────────────────────────────────────────
 *
 *  1. Das Feld erscheint beim Anlegen eines eigenen Kontos - und NUR dort.
 *     Beim Anmelden mit Klassencode hat es nichts zu suchen: Dort entscheidet
 *     die Lehrkraft, und ein Feld, das nichts bewirkt, ist schlimmer als
 *     keines.
 *  2. Der gewählte Wert kommt wirklich unten an. Ohne diesen Fall wäre das
 *     Feld eine Zierde - genau der Fehler, den der Server-Hook drei Wochen
 *     lang hatte (er überschrieb jeden Wert still mit 0).
 *  3. ⚠️ Ohne die Prop ändert sich für die anderen Programme NICHTS. Dieses
 *     Formular gehört Punktgenau, Mathecoach und Tastenflow gemeinsam
 *     (`apps/GEMEINSAM.md`) - wer hier etwas fest einbaut, ändert Programme,
 *     die er gerade nicht vor sich hat.
 *  4. Das Feld ist KEINE Pflicht. Die Vorgabe ist der erste Startpunkt, und
 *     wer nichts weiss, kommt mit einem Tabstopp daran vorbei.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SchuelerAnmeldung } from "@/components/lernwerkstatt/SchuelerAnmeldung";

afterEach(cleanup);

const STARTPUNKTE = [
  { units: 2, label: `Anfänger: nur F und J` },
  { units: 8, label: `Grundstellung` },
  { units: 30, label: `Alle Buchstaben` },
];

function zeige(props: Record<string, unknown> = {}) {
  const gemeldet: unknown[][] = [];
  render(
    <MemoryRouter>
      <SchuelerAnmeldung
        klassenCode=""
      busy={false}
      onFehlerZuruecksetzen={() => {}}
      onKlassenLogin={() => {}}
      onSelbstLogin={() => {}}
      onSelbstRegister={(...args) => gemeldet.push(args)}
      onLokalerFehler={() => {}}
      startpunkte={STARTPUNKTE}
      startpunktLabel={`Womit anfangen?`}
        {...props}
      />
    </MemoryRouter>,
  );
  return gemeldet;
}

/**
 * Den Weg „eigenes Konto anlegen" öffnen: erst das Häkchen „Ich übe allein",
 * dann den Umschalter „Konto erstellen".
 */
function eigenesKontoAnlegen() {
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: /^Konto erstellen$/ }));
}

/** Name, Adresse und beide Passwörter ausfüllen. */
function fuelleAus() {
  fireEvent.change(screen.getByLabelText(/Dein Name/i), { target: { value: "Mia" } });
  // Zwei Felder tragen diese Beschriftung (Anmelden und Anlegen liegen beide
  // im Baum) - gefüllt wird das des SICHTBAREN Formulars, also das letzte.
  const mails = screen.getAllByLabelText(/E-Mail-Adresse/i);
  fireEvent.change(mails[mails.length - 1], { target: { value: "mia@example.org" } });
  for (const feld of screen.getAllByLabelText(/Passwort/i))
    fireEvent.change(feld, { target: { value: "geheim12" } });
}

/** Absenden - der Absende-Knopf ist der mit dem Typ `submit`. */
function absenden() {
  const knopf = screen
    .getAllByRole("button")
    .find((b) => (b as HTMLButtonElement).type === "submit");
  fireEvent.click(knopf!);
}

describe(`Startpunkt bei der Selbstanmeldung`, () => {
  it(`steht NICHT im Klassenweg - dort entscheidet die Lehrkraft`, () => {
    zeige();
    expect(screen.queryByLabelText(/Womit anfangen/i)).toBeNull();
  });

  it(`erscheint beim Anlegen eines eigenen Kontos`, () => {
    zeige();
    eigenesKontoAnlegen();
    expect(screen.getByLabelText(/Womit anfangen/i)).toBeTruthy();
  });

  it(`⚠️ erscheint NICHT, wenn eine App keine Startpunkte hereinreicht`, () => {
    // Punktgenau, Klangpunkte, Mathecoach, »im Griff«: dieselbe Komponente,
    // aber dort gibt es keinen Tastenstand zu wählen.
    zeige({ startpunkte: undefined });
    eigenesKontoAnlegen();
    expect(screen.queryByLabelText(/Womit anfangen/i)).toBeNull();
  });

  it(`reicht den GEWÄHLTEN Wert nach unten weiter - nicht die Vorgabe`, () => {
    const gemeldet = zeige();
    eigenesKontoAnlegen();
    fuelleAus();
    fireEvent.change(screen.getByLabelText(/Womit anfangen/i), {
      target: { value: "30" },
    });
    absenden();
    expect(gemeldet).toHaveLength(1);
    // Reihenfolge: name, email, passwort, geburtsjahr, startUnits
    expect(gemeldet[0][4]).toBe(30);
  });

  it(`gibt ohne eigene Wahl den ersten Startpunkt weiter - keine Pflicht`, () => {
    const gemeldet = zeige();
    eigenesKontoAnlegen();
    fuelleAus();
    absenden();
    expect(gemeldet).toHaveLength(1);
    expect(gemeldet[0][4]).toBe(2);
  });
});
