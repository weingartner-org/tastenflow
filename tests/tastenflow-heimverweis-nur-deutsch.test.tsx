/**
 * ★ Johannes 28.09.2026: „der Sensorik-Link (links oben in der Kopfzeile) soll
 * nur in der deutschen URL zu sehen sein, bei allen anderen soll er
 * verschwinden - die Seite weingartner.org gibt es nur auf Deutsch."
 *
 * Geprüft am EINBAU (die ganze Seite unter ihrer echten Adresse), nicht nur am
 * Bauteil: Der Wert wird durch `AppKopfzeile` gereicht, und genau dort ginge er
 * verloren. Gegenprobe: in der deutschen Bedienung ist der Verweis da.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { TastenflowSprachBereich } from "../src/features/public/TastenflowSprachBereich";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { LEHRGANG_PROBE_MERKER_ES, LEHRGANG_PROBE_MERKER_FR } from "../src/lib/typing/lernweg";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

function zeigeSeite(adresse = "/programme/tastenflow") {
  render(
    <MemoryRouter initialEntries={[adresse]}>
      <TastenflowSprachBereich>
        <TippenTrainerPage />
      </TastenflowSprachBereich>
    </MemoryRouter>,
  );
}

/** Der Heim-Verweis - an seinem Namen erkannt, in jeder Sprache. */
function heimVerweis() {
  return screen.queryByRole("link", {
    name: /Sensorik Lernplattform|Sensorik learning platform|Plateforme d'apprentissage Sensorik|Plataforma de aprendizaje Sensorik/,
  });
}

beforeEach(() => {
  localStorage.clear();
  einrichtungFertigMerken();
  ohneBildschirmTastatur();
  useTypingAuth.setState({ account: null });
  Element.prototype.scrollIntoView = () => {};
});
afterEach(() => cleanup());

describe("★ Sensorik links oben nur in der deutschen Bedienung", () => {
  it("Gegenprobe: deutsch ⇒ der Verweis ist da", () => {
    localStorage.setItem("tastenflow-bedienung", "de");
    zeigeSeite();
    expect(heimVerweis()).not.toBeNull();
  });

  it("englisch ⇒ kein Verweis", () => {
    localStorage.setItem("tastenflow-bedienung", "en");
    zeigeSeite();
    expect(heimVerweis()).toBeNull();
  });

  it("französisch ⇒ kein Verweis", () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "1");
    localStorage.setItem("tastenflow-bedienung", "fr");
    zeigeSeite();
    expect(document.documentElement.lang).toBe("fr");
    expect(heimVerweis()).toBeNull();
  });

  it("spanisch ⇒ kein Verweis", () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1");
    localStorage.setItem("tastenflow-bedienung", "es");
    zeigeSeite();
    expect(document.documentElement.lang).toBe("es");
    expect(heimVerweis()).toBeNull();
  });
});
