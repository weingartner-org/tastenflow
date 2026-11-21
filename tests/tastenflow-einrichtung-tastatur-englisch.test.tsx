/**
 * ★★★★ WÄCHTER: Der Tastatur-Schritt der Einrichtung rät in englischer
 * Bedienung nicht mehr zur DEUTSCHEN Tastatur (Bauplan englischer Lehrgang
 * §7/§10, E8, 24.09.2026).
 *
 * Befund: Der Satz sagte in der englischen Bedienung wörtlich *„If in doubt,
 * choose German - the keyboard with Ä, Ö and Ü."* - obwohl die Einrichtung
 * seit E2 (23.09.2026) in der englischen Bedienung von SELBST US oder UK
 * vorwählt (`vorschlagLayout`, nie Deutsch). Der Rat widersprach der eigenen
 * Vorauswahl.
 */
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Einrichtung } from "@/components/typing/Einrichtung";
import { BedienSpracheProvider } from "@/lib/bedienSprache";

function stelleBedienung(sprache: "de" | "en") {
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeige() {
  return render(
    <BedienSpracheProvider>
      <Einrichtung
        lernweg="de"
        stufe="teens"
        lang="de"
        onLangChange={() => {}}
        startUnits={2}
        onStartUnitsChange={() => {}}
        onExit={() => {}}
      />
    </BedienSpracheProvider>,
  );
}

/** Von „willkommen" bis zum Tastatur-Schritt vorwärts klicken. */
function zumTastaturSchritt() {
  // willkommen → alter → sprache → tastatur: drei Klicks auf „Weiter"/„Continue".
  for (let i = 0; i < 3; i++) {
    fireEvent.click(document.querySelector<HTMLButtonElement>("section .btn-primary")!);
  }
}

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("★★★★ Tastatur-Schritt: der Rat passt zur eigenen Vorauswahl", () => {
  it(`Englisch: KEIN „choose German" mehr - der Satz nennt die schon getroffene Vorauswahl`, () => {
    stelleBedienung("en");
    zeige();
    zumTastaturSchritt();
    expect(document.body.textContent).toMatch(/already selected for you/);
    expect(document.body.textContent).not.toMatch(/choose German/);
  });

  it(`Deutsch: unverändert „Im Zweifel: die deutsche."`, () => {
    stelleBedienung("de");
    zeige();
    zumTastaturSchritt();
    expect(document.body.textContent).toMatch(/Im Zweifel: die deutsche\./);
  });
});
