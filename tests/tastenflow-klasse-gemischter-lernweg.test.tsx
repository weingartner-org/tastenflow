/**
 * ★★★★★ WÄCHTER: „Die meisten stehen bei …" in einer GEMISCHTEN Klasse
 * (Bauplan englischer Lehrgang §7, §11 Falle 1, 24.09.2026).
 *
 * `startpunktMitKlasse` (`klassenEinstellungen.ts`) lässt eine Vorgabe der
 * Klasse schon seit E1 unberührt, wenn ein Kind auf einem ANDEREN Lernweg
 * steht - ihre Zahl ist eine Anzahl im Weg der Klasse und hiesse für das Kind
 * etwas anderes. Dieselbe Falle galt bis zu diesem Wächter auch für die
 * ANZEIGE „die meisten stehen bei …" im Kasten „Einstellungen der Klasse"
 * (`TastenflowReiter.tsx`, `Klasseneinstellungen`): Sie zählte den Stand JEDES
 * Kindes gegen die Einheiten-Tabelle DER KLASSE, ganz gleich, in welchem Weg
 * die Zahl steht.
 *
 * Aufgebaut wird eine Klasse ohne eigenen Lernweg (= „de"), ein Kind, das
 * wirklich auf „de" steht, und ZWEI Kinder, deren Lernweg auf „en" erzwungen
 * wird (`setLernweg`, wie es der Server nur einmal zulässt) - mit einem
 * Startwert, der ausserhalb der deutschen Einheiten-Tabelle liegt und darum,
 * FALSCH als deutsche Anzahl gelesen, in die HÖCHSTE deutsche Stufe fiele und
 * die Mehrheit kippte.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { startPoints } from "@/lib/typing";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getClass,
  listPupils,
  registerTeacher,
  setLernweg,
  setStartUnits,
} from "@/lib/typing/account";

const STARTS_DE = startPoints("de", "de");

function baueGemischteKlasse(): { cls: TypingClass; teacherId: string; kinder: TypingAccount[] } {
  const t = registerTeacher("Frau Berger", "berger-mix@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3m", "3M");
  if (!c.ok) throw new Error(c.error);
  // Ein echtes „de"-Kind auf der untersten Stufe.
  const de = addPupil(c.value.code, "Anna", "pw1234");
  if (!de.ok) throw new Error(de.error);
  setStartUnits(de.value.id, STARTS_DE[0].units);
  // Zwei „en"-Kinder mit einer Anzahl, die - FALSCH als deutsche Anzahl
  // gelesen - in die höchste deutsche Stufe fiele und die Mehrheit kippte.
  for (const name of ["Ben", "Cem"]) {
    const en = addPupil(c.value.code, name, "pw1234");
    if (!en.ok) throw new Error(en.error);
    setLernweg(en.value.id, "en");
    setStartUnits(en.value.id, STARTS_DE[STARTS_DE.length - 1].units);
  }
  return { cls: getClass(c.value.code)!, teacherId: t.value.id, kinder: listPupils(c.value.code) };
}

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe(`★★★★★ E8 - gemischte Klasse: „die meisten stehen bei …" zählt nur den Weg der Klasse`, () => {
  it(`die zwei „en"-Kinder verschieben die Anzeige NICHT auf die höchste deutsche Stufe`, async () => {
    const { cls, teacherId, kinder } = baueGemischteKlasse();
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await userEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));

    const feld = screen.getByLabelText(
      /Startniveau für alle Kinder der Klasse/,
    ) as HTMLSelectElement;
    // Ohne die Behebung stünden hier die zwei „en"-Kinder (2 gegen 1) und der
    // Platzhalter nennte die HÖCHSTE deutsche Stufe.
    expect(feld.options[0].textContent).toMatch(
      new RegExp(`die meisten stehen bei „${STARTS_DE[0].label}"`),
    );
    expect(feld.options[0].textContent).not.toMatch(
      new RegExp(`die meisten stehen bei „${STARTS_DE[STARTS_DE.length - 1].label}"`),
    );
  });
});
