/**
 * ★★★★ WÄCHTER: Der Lernweg der Klasse als AUSKUNFT in den Klassen-
 * Einstellungen (Bauplan englischer Lehrgang §7, E8, 24.09.2026).
 *
 * Johannes/Bauplan §7: „in den Klassen-Einstellungen sichtbar, aber nur für
 * neue Kinder wirksam (Satz dazu im Mouseover)."
 *
 * ★ FREIGABE 25.09.2026: Sichtbar, solange die BEDIENUNG englisch ist ODER
 * die Klasse schon auf Weg „en" steht - nicht mehr an den (jetzt
 * abgeschalteten) Probe-Schalter gebunden. Eine deutsche Bedienung mit einer
 * Klasse auf Weg „de" soll nie einen zweiten Lehrgang erwähnt sehen.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { KlassenEinstellungsFelder } from "@/components/typing/KlassenEinstellungsFelder";
import { BedienSpracheProvider } from "@/lib/bedienSprache";
import type { Lernweg } from "@/lib/typing/lernweg";

function zeige(lernweg: Lernweg, opts?: { englischeBedienung?: boolean }) {
  const inhalt = (
    <KlassenEinstellungsFelder
      bezug="der Klasse 3b"
      werte={{ schulstufe: 7, lang: "de", langLocked: false, klassenmatchAus: false, zeilenEndeEnter: false }}
      jetztMs={Date.now()}
      startniveau={{ lernweg, wert: "", platzhalter: "Stufe wählen", hinweis: "", srHinweis: "" }}
      onSchulstufe={() => {}}
      onSprache={() => {}}
      onSperre={() => {}}
      onStartniveau={() => {}}
      onKlassenmatch={() => {}}
      onZeilenEnde={() => {}}
    />
  );
  // ★ `useBedienSprache()` liefert ohne Anbieter IMMER „de" (siehe
  // `BedienSpracheProvider.tsx`, `OHNE_PROVIDER`) - eine englische Bedienung
  // in diesem Wächter braucht darum wirklich den Anbieter, nicht nur den
  // Merker im Speicher.
  return render(
    opts?.englischeBedienung ? <BedienSpracheProvider>{inhalt}</BedienSpracheProvider> : inhalt,
  );
}

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("★★★★ Lernweg-Auskunft in den Klassen-Einstellungen", () => {
  it(`Weg „de" MIT deutscher Bedienung: keine Erwähnung eines Lehrgangs`, () => {
    zeige("de");
    expect(screen.queryByText(/Lehrgang:/)).toBeNull();
  });

  it(`Weg „de" MIT ENGLISCHER Bedienung: „Course: German order" (die Bedienung entscheidet, nicht der Probe-Schalter)`, () => {
    localStorage.setItem("tastenflow-bedienung", "en");
    zeige("de", { englischeBedienung: true });
    expect(screen.getByText("Course: German order")).toBeTruthy();
  });

  it(`Weg „en" - IMMER sichtbar, auch mit deutscher Bedienung (die Klasse ist ja schon so weit)`, () => {
    zeige("en");
    expect(screen.getByText("Lehrgang: englische Reihenfolge")).toBeTruthy();
  });

  it("der Hinweis erklärt: gilt für später beitretende Kinder, ändert ein schon übendes Kind nie", () => {
    zeige("en");
    const feld = screen.getByText("Lehrgang: englische Reihenfolge");
    expect(feld.getAttribute("aria-describedby")).toBeTruthy();
    const hinweisId = feld.getAttribute("aria-describedby")!;
    const hinweis = document.getElementById(hinweisId);
    expect(hinweis?.textContent).toMatch(/SPÄTER beitreten/);
    expect(hinweis?.textContent).toMatch(/ändert sich nie/);
  });
});
