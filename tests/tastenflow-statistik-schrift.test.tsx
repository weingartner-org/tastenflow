/**
 * ★★★ ALT + PLUS / ALT + MINUS VERGRÖSSERT AUCH DIE STATISTIK (29.10.2026).
 *
 * Wunsch einer Lehrerin: „Schriftgröße bei der Statistik größer (oder
 * anpassbar)". Entscheidung Johannes: Alt + Plus / Minus soll auch in der
 * Statistik wirken.
 *
 * VORHER (gemessen): Die Seite nahm Alt + Plus in der Statistik ENTGEGEN und
 * stellte die Übungszeile größer - die in dem Augenblick gar nicht zu sehen
 * ist. Die Statistik selbst blieb, wie sie war: Die Taste wirkte, aber an der
 * falschen Stelle. Darum ist der erste Test unten ROT am Stand davor
 * (`[data-statistik-schrift]` gab es nicht, die Stufe der Übungszeile sprang).
 *
 * Geprüft: Kind (Meine Statistik, über die ganze Seite) und Lehrkraft
 * (Klassenstatistik im Tastenflow-Reiter).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { useTypingA11y } from "../src/lib/typing/a11y";
import { TastenflowReiter } from "../src/components/lernwerkstatt/klasse/TastenflowReiter";
import type { TypingAccount, TypingClass } from "../src/lib/typing";
import {
  addPupil,
  createClass,
  getClass,
  listPupils,
  registerTeacher,
} from "@/lib/typing/account";
import { useStatistikSchrift } from "../src/lib/typing/statistikSchrift";

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
  useStatistikSchrift.getState().normal();
  useTypingA11y.getState().resetZoom();
});
afterEach(() => {
  cleanup();
  localStorage.clear();
});

function zeigeSeite() {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

function altPlus() {
  fireEvent.keyDown(document.body, { key: "+", code: "Equal", altKey: true });
}
function altMinus() {
  fireEvent.keyDown(document.body, { key: "-", code: "Minus", altKey: true });
}
function alt0() {
  fireEvent.keyDown(document.body, { key: "º", code: "Digit0", altKey: true });
}

function schrift(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-statistik-schrift]");
}
function faktor(): string {
  return schrift()?.style.zoom ?? "";
}

async function oeffneStatistik() {
  zeigeSeite();
  await screen.findByRole("heading", { name: /Mein Training/i });
  fireEvent.keyDown(document, { code: "KeyS", altKey: true });
  await screen.findAllByRole("button", { name: /Statistik schließen/ });
}

describe("★★★ Kind: Alt + Plus / Minus in „Meine Statistik“", () => {
  it("★ Alt + Plus macht die Statistik größer, Alt + Minus wieder kleiner", async () => {
    await oeffneStatistik();
    expect(schrift(), "die Statistik trägt keinen Schrift-Faktor").not.toBeNull();
    expect(faktor()).toBe("1");
    altPlus();
    expect(faktor()).toBe("1.25");
    altPlus();
    expect(faktor()).toBe("1.5");
    altMinus();
    expect(faktor()).toBe("1.25");
  });

  it("★ es geht bis 2,5 und nicht weiter; nach unten nicht unter 1", async () => {
    await oeffneStatistik();
    for (let i = 0; i < 12; i++) altPlus();
    expect(faktor()).toBe("2.5");
    for (let i = 0; i < 12; i++) altMinus();
    expect(faktor()).toBe("1");
  });

  it("★ Alt + 0 holt die normale Größe zurück", async () => {
    await oeffneStatistik();
    altPlus();
    altPlus();
    alt0();
    expect(faktor()).toBe("1");
  });

  it("★★ die Übungszeile bleibt unberührt - sie hat ihre eigene Stufe", async () => {
    await oeffneStatistik();
    altPlus();
    altPlus();
    expect(faktor()).toBe("1.5");
    expect(useTypingA11y.getState().zoom).toBe(1);
  });

  it("★★ die Stufe bleibt gespeichert (nächster Besuch, nächstes Öffnen)", async () => {
    await oeffneStatistik();
    altPlus();
    altPlus();
    fireEvent.keyDown(document, { code: "KeyS", altKey: true }); // Statistik zu
    await waitFor(() => expect(schrift()).toBeNull());
    fireEvent.keyDown(document, { code: "KeyS", altKey: true }); // und wieder auf
    await screen.findAllByRole("button", { name: /Statistik schließen/ });
    expect(faktor()).toBe("1.5");
  });

  it("★★ und beim Üben wirkt Alt + Plus weiter nur auf die Übungszeile", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    altPlus();
    expect(useTypingA11y.getState().zoom).toBe(1.25);
    expect(useStatistikSchrift.getState().faktor).toBe(1);
  });

  it("★ die Änderung wird angesagt (eine Zeile, für Sprachausgabe und Braillezeile)", async () => {
    await oeffneStatistik();
    altPlus();
    const status = document.querySelector("[data-statistik-schrift-ansage]");
    expect(status?.textContent).toBe("Schrift 125 Prozent");
    expect(status?.getAttribute("role")).toBe("status");
  });
});

describe("★★★ Lehrkraft: Alt + Plus / Minus in der Klassenstatistik", () => {
  function baueKlasse(): { cls: TypingClass; teacherId: string; kinder: TypingAccount[] } {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    for (const name of ["Anna", "Ben"]) {
      const p = addPupil(c.value.code, name, "pw1234");
      if (!p.ok) throw new Error(p.error);
    }
    return { cls: getClass(c.value.code)!, teacherId: t.value.id, kinder: listPupils(c.value.code) };
  }

  it("★ die Klassenstatistik wird mit Alt + Plus größer und mit Alt + Minus kleiner", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    expect(faktor()).toBe("1");
    act(() => altPlus());
    expect(faktor()).toBe("1.25");
    act(() => altPlus());
    act(() => altMinus());
    expect(faktor()).toBe("1.25");
    act(() => alt0());
    expect(faktor()).toBe("1");
  });

  it("★ dieselbe gespeicherte Stufe wie bei „Meine Statistik“ (ein Gerät, eine Größe)", async () => {
    useStatistikSchrift.getState().groesser();
    useStatistikSchrift.getState().groesser();
    const { cls, teacherId, kinder } = baueKlasse();
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    expect(faktor()).toBe("1.5");
  });
});
