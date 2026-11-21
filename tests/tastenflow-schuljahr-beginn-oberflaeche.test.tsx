/**
 * ★★★ D2 (28.09.2026): „Beginn des Schuljahres" in der Oberfläche.
 *
 * Wohin sich dieser Wächter bewegt, wenn es schlechter wird:
 *  · Das Feld fehlt beim Anlegen oder in „Einstellungen der Klasse" - rot.
 *  · Die Wahl kommt nicht in `settings.schuljahrBeginn` an - rot.
 *  · Das Umstellen lässt die heutige Schulstufe springen - rot.
 *  · Der Server-Weg wirft Plan und Zeiger der Tippchallenge aus `settings` - rot.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { KlasseUndKinder } from "@/components/lernwerkstatt/klasse/KlasseUndKinder";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { useTypingAuth, vergissGeladeneKlasse } from "@/components/typing/useTypingAuth";
import { startPoints, type TypingAccount } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getClass,
  listPupils,
  registerTeacher,
} from "@/lib/typing/account";
import { _resetTypingBackend } from "@/lib/typing/backend";
import { PocketBaseTypingBackend } from "@/lib/typing/pbBackend";
import { aktuelleSchulstufe, schuljahrStartjahr } from "@/lib/typing/klassenEinstellungen";
import { schuljahrBeginnVon } from "@/lib/typing/schuljahrBeginn";

const V = startPoints("de", "de");

function lehrkraft(): TypingAccount {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  return t.value;
}

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
  vergissGeladeneKlasse();
  window.history.replaceState(null, "", "/");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
});

describe("Neue Klasse anlegen", () => {
  it("das Feld steht da, zeigt die Vorgabe und die Wahl geht mit", async () => {
    const t = lehrkraft();
    render(
      <KlasseUndKinder
        teacher={t}
        classes={[]}
        cls={null}
        pupils={[]}
        offeneProgramme={[]}
        einstiegsProgramm="tippen"
        onSelectClass={() => {}}
        onChanged={() => {}}
      />,
    );
    const feld = screen.getByLabelText("Beginn des Schuljahres der neuen Klasse") as HTMLSelectElement;
    expect(feld.hasAttribute("disabled")).toBe(false);
    expect(feld.options).toHaveLength(12);
    // jsdom meldet „en-US" ⇒ August, die Vorgabe wie bisher.
    expect(feld.value).toBe("8");
    fireEvent.change(feld, { target: { value: "2" } });

    fireEvent.change(screen.getByLabelText("Klassenname"), { target: { value: "3c" } });
    fireEvent.change(screen.getByLabelText("Schulstufe der neuen Klasse"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Startniveau für alle Kinder der neuen Klasse"), {
      target: { value: String(V[1].units) },
    });
    fireEvent.click(screen.getByRole("button", { name: "Klasse anlegen" }));
    await waitFor(() => expect(getClass("3C")).toBeTruthy());
    const neu = getClass("3C")!;
    expect(schuljahrBeginnVon(neu)).toBe(2);
    expect(neu.schulstufeSchuljahr).toBe(schuljahrStartjahr(Date.now(), 2));
  });
});

describe("Einstellungen der Klasse", () => {
  it("Umstellen speichert den Monat und lässt die heutige Schulstufe stehen", async () => {
    const t = lehrkraft();
    const c = createClass(t.id, "3b", "3B", {
      schulstufe: 7,
      schulstufeSchuljahr: schuljahrStartjahr(),
    });
    if (!c.ok) throw new Error(c.error);
    addPupil("3B", "Anna", "pw1234");
    const vorher = aktuelleSchulstufe(getClass("3B"));
    render(
      <TastenflowReiter pupils={listPupils("3B")} onChanged={() => {}} cls={getClass("3B")} teacherId={t.id} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await userEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));
    const feld = screen.getByLabelText("Beginn des Schuljahres der Klasse 3b") as HTMLSelectElement;
    expect(feld.value).toBe("8");
    await userEvent.selectOptions(feld, "Februar");
    await waitFor(() => expect(schuljahrBeginnVon(getClass("3B"))).toBe(2));
    expect(aktuelleSchulstufe(getClass("3B"))).toBe(vorher);
    expect(document.body.textContent).toContain("Das Schuljahr dieser Klasse beginnt jetzt am 1. Februar.");
  });
});

describe("Server-Weg", () => {
  it("setClassEinstellungen behält die übrigen Schlüssel in `settings`", async () => {
    const be = new PocketBaseTypingBackend();
    const update = vi.fn(async (_id: string, body: Record<string, unknown>) => ({
      id: "r1",
      code: "3B",
      name: "3b",
      teacherUid: "t1",
      ...body,
    }));
    const rec = {
      id: "r1",
      code: "3B",
      settings: { schreibprobe: { id: "sp1" }, schreibprobeZeiger: { satz: { textNr: 1 } } },
    };
    (be as unknown as { pb: unknown }).pb = {
      filter: (s: string) => s,
      collection: () => ({ getFirstListItem: async () => rec, update }),
    };
    const neu = await be.setClassEinstellungen("3B", "t1", { schuljahrBeginn: 3 });
    expect(update.mock.calls[0][1]).toEqual({
      settings: {
        schreibprobe: { id: "sp1" },
        schreibprobeZeiger: { satz: { textNr: 1 } },
        schuljahrBeginn: 3,
      },
    });
    expect(neu && schuljahrBeginnVon(neu)).toBe(3);
  });

  it("createClass schreibt den Monat in `settings` und sonst nichts dorthin", async () => {
    const be = new PocketBaseTypingBackend();
    const create = vi.fn(async (body: Record<string, unknown>) => ({ id: "r1", ...body }));
    (be as unknown as { pb: unknown }).pb = { collection: () => ({ create }) };
    await be.createClass("t1", "3c", "3c", { schuljahrBeginn: 2 });
    expect(create.mock.calls[0][0].settings).toEqual({ schuljahrBeginn: 2 });
    create.mockClear();
    await be.createClass("t1", "3d", "3d", {});
    expect(create.mock.calls[0][0].settings).toBeUndefined();
  });
});
