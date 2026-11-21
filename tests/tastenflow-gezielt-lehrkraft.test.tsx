/**
 * ★★★ WÄCHTER: GEZIELT ÜBEN - die Lehrkraft-Seite (Etappe C, 13.11.2026, Bauplan §5).
 *
 *   (a) Klasse: die Zeile „Gezielt üben (alle)" speichert über `setClassEinstellungen` (Feld `gezielt`); „Ausschalten"
 *       löscht es.
 *   (b) Kind: eigener Wert · „Wie die Klasse" (Feld `null`) · „Für dieses Kind aus" (`{zeichen: []}`); der Vorrang
 *       Kind vor Klasse kommt aus `gezieltFuerKind`.
 *   (c) Tabelle: die Spalte „Gezielt" zeigt die Zeichen, „wie die Klasse" oder „aus".
 *   (d) Mehrfachauswahl: ein Kästchen je Kind, die Leiste „N Kinder markiert", EIN Dialog, derselbe Wert bei jedem
 *       markierten Kind - und nur bei diesen.
 *   (e) Der Dialog der Lehrkraft bietet „bis zu diesem Datum" statt „nur heute".
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getAccount,
  getClass,
  listPupils,
  registerTeacher,
  setClassEinstellungen,
  setGezielt,
} from "@/lib/typing/account";
import { setLayout } from "@/lib/typing/layouts";
import { gezieltHerkunft } from "@/lib/typing/gezieltLehrkraft";

const NAMEN = ["Anna", "Ben", "Cem"];

function baueKlasse(): { cls: TypingClass; teacherId: string; kinder: TypingAccount[] } {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of NAMEN) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return { cls: getClass(c.value.code)!, teacherId: t.value.id, kinder: listPupils(c.value.code) };
}

beforeEach(() => {
  localStorage.clear();
  setLayout("de");
});
afterEach(() => cleanup());

const id = (kinder: TypingAccount[], name: string) => kinder.find((k) => k.name === name)!.id;

async function oeffne(cls: TypingClass, teacherId: string, kinder: TypingAccount[]) {
  render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />);
  return await screen.findByRole("table", { name: /Lernende der Klasse/ });
}

/** Im offenen Dialog Tasten drücken und „Fertig". */
async function waehleImDialog(tasten: string[]) {
  const dialog = await screen.findByRole("dialog");
  const feld = within(dialog).getByLabelText("Taste drücken");
  for (const k of tasten) fireEvent.keyDown(feld, { key: k });
  await userEvent.click(within(dialog).getByRole("button", { name: "Fertig" }));
}

/** Die Spalte „Gezielt": Text der Zelle in der Zeile des Kindes (sichtbarer Teil). */
function zelleGezielt(tabelle: HTMLElement, name: string): HTMLElement {
  const letzte = [...tabelle.querySelectorAll("thead tr")].pop() as HTMLElement;
  const koepfe = [...letzte.querySelectorAll("th")];
  const i = koepfe.findIndex((th) => (th.textContent || "").trim().startsWith("Gezielt"));
  expect(i, "die Spalte „Gezielt“ fehlt").toBeGreaterThanOrEqual(0);
  const zeile = [...tabelle.querySelectorAll("tbody tr")].find(
    (tr) => tr.querySelector("th span > span")?.textContent?.trim() === name,
  )!;
  return zeile.querySelectorAll("td, th")[i] as HTMLElement;
}
const sichtbar = (z: HTMLElement) => (z.querySelector('[aria-hidden="true"]')?.textContent ?? "").trim();

describe("(a) die Klasse", () => {
  it("die Zeile „Gezielt üben (alle)\" speichert das Feld gezielt an der Klasse, „Ausschalten\" löscht es", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);
    await userEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));

    const zeile = document.querySelector("[data-gezielt-klasse]") as HTMLElement;
    expect(within(zeile).getByText("Gezielt üben (alle)")).toBeTruthy();
    expect(within(zeile).getByText("Aus")).toBeTruthy();
    expect(within(zeile).queryByRole("button", { name: "Ausschalten" })).toBeNull();

    await userEvent.click(within(zeile).getByRole("button", { name: "Tasten wählen …" }));
    await waehleImDialog(["ö", "ä"]);

    await waitFor(() => expect(getClass(cls.code)?.gezielt?.zeichen).toEqual(["ö", "ä"]));
    expect(getClass(cls.code)?.gezielt?.anteil).toBe("viel");
    expect(getClass(cls.code)?.gezielt?.bis).toBeNull();
    // Kästchen und Zusammenfassung stehen jetzt in der Zeile.
    expect(within(zeile).getByText("viel")).toBeTruthy();

    await userEvent.click(within(zeile).getByRole("button", { name: "Ausschalten" }));
    await waitFor(() => expect(getClass(cls.code)?.gezielt ?? null).toBeNull());
    // Der Fokus ging an den Knopf, der bleibt.
    expect(document.activeElement).toBe(within(zeile).getByRole("button", { name: "Tasten wählen …" }));
  });
});

describe("(b) ein Kind", () => {
  async function zeigeKind(cls: TypingClass, teacherId: string, kinder: TypingAccount[], name: string) {
    const tabelle = await oeffne(cls, teacherId, kinder);
    await userEvent.click(
      screen.getByRole("button", { name: new RegExp(`Einstellungen und Auswertung von ${name} ausklappen`) }),
    );
    await userEvent.click(screen.getByText(new RegExp(`^Einstellungen für ${name}\\b`)));
    return { tabelle, zeile: document.querySelector("[data-gezielt-kind]") as HTMLElement };
  }

  it("eigener Wert: „Ändern …\" speichert am Kind; die Zeile sagt „gilt statt der Klasse\"", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    const { zeile } = await zeigeKind(cls, teacherId, kinder, "Anna");
    await userEvent.click(within(zeile).getByRole("button", { name: "Ändern …" }));
    await waehleImDialog(["ß"]);
    await waitFor(() => expect(getAccount(id(kinder, "Anna"))?.gezielt?.zeichen).toEqual(["ß"]));
    expect(getAccount(id(kinder, "Ben"))?.gezielt ?? null).toBeNull();
    await waitFor(() => expect(within(zeile).getByText("gilt statt der Klasse")).toBeTruthy());
  });

  it("„Wie die Klasse\" setzt das Kind-Feld auf null; der Knopf verschwindet, der Fokus bleibt auf „Ändern …\"", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    setClassEinstellungen(cls.code, teacherId, { gezielt: { zeichen: ["ö"], anteil: "viel", bis: null } });
    setGezielt(id(kinder, "Anna"), { zeichen: ["ß"], anteil: "wenig", bis: null });
    const { zeile } = await zeigeKind(getClass(cls.code)!, teacherId, listPupils(cls.code), "Anna");

    await userEvent.click(within(zeile).getByRole("button", { name: "Wie die Klasse" }));
    await waitFor(() => expect(getAccount(id(kinder, "Anna"))?.gezielt ?? null).toBeNull());
    await waitFor(() => expect(within(zeile).queryByRole("button", { name: "Wie die Klasse" })).toBeNull());
    expect(document.activeElement).toBe(within(zeile).getByRole("button", { name: "Ändern …" }));
  });

  it("„Für dieses Kind aus\" gibt es nur, wenn die Klasse etwas eingestellt hat, und setzt {zeichen: []}", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    // Ohne Wert an der Klasse: kein solcher Knopf.
    const ohne = await zeigeKind(cls, teacherId, kinder, "Ben");
    expect(within(ohne.zeile).queryByRole("button", { name: "Für dieses Kind aus" })).toBeNull();
    cleanup();

    setClassEinstellungen(cls.code, teacherId, { gezielt: { zeichen: ["ö"], anteil: "viel", bis: null } });
    const { zeile } = await zeigeKind(getClass(cls.code)!, teacherId, listPupils(cls.code), "Ben");
    await userEvent.click(within(zeile).getByRole("button", { name: "Für dieses Kind aus" }));
    await waitFor(() => expect(getAccount(id(kinder, "Ben"))?.gezielt?.zeichen).toEqual([]));
    // Vorrang: für Ben gilt nichts, für Anna (kein eigenes Feld) die Klasse.
    const k = getClass(cls.code)!;
    expect(gezieltHerkunft(getAccount(id(kinder, "Ben"))?.gezielt, k.gezielt, new Date()).quelle).toBe("kind-aus");
    expect(gezieltHerkunft(getAccount(id(kinder, "Anna"))?.gezielt, k.gezielt, new Date()).quelle).toBe("klasse");
  });
});

describe("(c) die Spalte „Gezielt\" in der Tabelle", () => {
  it("Zeichen · „wie die Klasse\" · „aus\" - je nachdem, was für das Kind gilt", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    setClassEinstellungen(cls.code, teacherId, { gezielt: { zeichen: ["ö", "ä"], anteil: "viel", bis: null } });
    setGezielt(id(kinder, "Anna"), { zeichen: ["ß"], anteil: "viel", bis: null });
    setGezielt(id(kinder, "Ben"), { zeichen: [], anteil: "viel", bis: null });
    const tabelle = await oeffne(getClass(cls.code)!, teacherId, listPupils(cls.code));

    expect(sichtbar(zelleGezielt(tabelle, "Anna"))).toBe("ß");
    expect(sichtbar(zelleGezielt(tabelle, "Ben"))).toBe("aus");
    // Cem erbt von der Klasse: „wie die Klasse" - die Zeichen stehen für die Sprachausgabe dabei.
    const cem = zelleGezielt(tabelle, "Cem");
    expect(cem.textContent).toContain("wie die Klasse");
    expect(cem.querySelector(".sr-only")?.textContent).toMatch(/wie die Klasse.*o Umlaut/);
  });

  it("ohne jede Einstellung steht überall „aus\"", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    const tabelle = await oeffne(cls, teacherId, kinder);
    for (const n of NAMEN) expect(sichtbar(zelleGezielt(tabelle, n))).toBe("aus");
  });

  it("ein abgelaufener Wert am Kind zählt nicht - dann gilt wieder die Klasse", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    setClassEinstellungen(cls.code, teacherId, { gezielt: { zeichen: ["ö"], anteil: "viel", bis: null } });
    setGezielt(id(kinder, "Anna"), { zeichen: ["ß"], anteil: "viel", bis: "2020-01-01" });
    const tabelle = await oeffne(getClass(cls.code)!, teacherId, listPupils(cls.code));
    expect(zelleGezielt(tabelle, "Anna").textContent).toContain("wie die Klasse");
  });
});

describe("(d) die Mehrfachauswahl", () => {
  it("ein Kästchen je Kind; die Leiste erscheint ab einem markierten Kind und verschwindet wieder", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);
    expect(document.querySelector("[data-gezielt-leiste]")).toBeNull();
    for (const n of NAMEN) expect(screen.getByRole("checkbox", { name: `${n} markieren` })).toBeTruthy();

    await userEvent.click(screen.getByRole("checkbox", { name: "Anna markieren" }));
    expect(screen.getByText("1 Kind markiert")).toBeTruthy();
    await userEvent.click(screen.getByRole("checkbox", { name: "Cem markieren" }));
    expect(screen.getByText("2 Kinder markiert")).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Markierung aufheben" }));
    expect(document.querySelector("[data-gezielt-leiste]")).toBeNull();
    expect((screen.getByRole("checkbox", { name: "Anna markieren" }) as HTMLInputElement).checked).toBe(false);
  });

  it("EIN Dialog setzt denselben Wert bei jedem markierten Kind - und nur bei diesen", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);
    await userEvent.click(screen.getByRole("checkbox", { name: "Anna markieren" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "Cem markieren" }));

    await userEvent.click(screen.getByRole("button", { name: "Gezielt üben für diese …" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/2 markierte Kinder/)).toBeTruthy();
    await waehleImDialog(["ö", "ä"]);

    await waitFor(() => {
      expect(getAccount(id(kinder, "Anna"))?.gezielt?.zeichen).toEqual(["ö", "ä"]);
      expect(getAccount(id(kinder, "Cem"))?.gezielt?.zeichen).toEqual(["ö", "ä"]);
    });
    expect(getAccount(id(kinder, "Ben"))?.gezielt ?? null).toBeNull();
    // Die Klasse selbst bleibt unberührt.
    expect(getClass(cls.code)?.gezielt ?? null).toBeNull();
  });
});

describe("(e) der Dialog der Lehrkraft", () => {
  it("bietet „bis zu diesem Datum\" statt „nur heute\" und speichert das Datum", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);
    await userEvent.click(screen.getByRole("checkbox", { name: "Ben markieren" }));
    await userEvent.click(screen.getByRole("button", { name: "Gezielt üben für diese …" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).queryByRole("button", { name: "Nur heute" })).toBeNull();

    fireEvent.keyDown(within(dialog).getByLabelText("Taste drücken"), { key: "ö" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Bis zu diesem Datum" }));
    const datum = within(dialog).getByLabelText("Datum") as HTMLInputElement;
    fireEvent.change(datum, { target: { value: "2099-12-24" } });
    await userEvent.click(within(dialog).getByRole("button", { name: "Fertig" }));

    await waitFor(() => expect(getAccount(id(kinder, "Ben"))?.gezielt?.bis).toBe("2099-12-24"));
  });
});
