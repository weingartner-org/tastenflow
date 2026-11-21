/**
 * ★★★★★ WÄCHTER (ES-M, 27.09.2026): Die Vorgabe beim Anlegen einer Klasse aus
 * der SPANISCHEN Bedienung - nach dem Muster des französischen Wächters
 * (`tastenflow-klasse-lang-vorgabe-franzoesisch.test.tsx`).
 *
 * Befund ES-O §4 Punkt 4: *„Server speichert den Lernweg/die Sprache „es"
 * einer Klasse nicht"* - die Oberfläche schlug „es" vor, `createClass`
 * schrieb aber nur „en"/„fr" als Weg, ein neues Kind erbte nur „en"/„fr".
 * Die Regel jetzt:
 *
 *  · MIT dem Schalter des spanischen Lehrgangs (`?spanisch-lehrgang=1`,
 *    Bauplan D10): Übungssprache „es" UND Weg „es" - die Auswahl bietet
 *    „Español" an, und die Klasse bekommt den Weg wirklich.
 *  · OHNE den Schalter: wie bisher „de" und Weg „de" - „Español" steht nicht
 *    in der Auswahl. ★ Seit der Freigabe 28.09.2026 ist der Schalter default
 *    AN; „ohne" heisst jetzt „Not-Aus" (`?spanisch-lehrgang=0`, Merker "0").
 *  · Ein neues Kind der Klasse erbt den Weg „es".
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: "es" as const,
      spracheGewaehlt: "es" as const,
      setzeSprache: () => {},
      bereichAktiv: true,
      wechsle: () => {},
      beimSchalter: () => () => {},
    }),
  };
});

import { KlasseUndKinder } from "@/components/lernwerkstatt/klasse/KlasseUndKinder";
import { vergissGeladeneKlasse } from "@/components/typing/useTypingAuth";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import { startPoints } from "@/lib/typing";
import { _resetTypingBackend } from "@/lib/typing/backend";
import { addPupil, createClass, getClass, registerTeacher, setLernweg } from "@/lib/typing/account";
import { LEHRGANG_PROBE_MERKER_ES } from "@/lib/typing/lernweg";

function lehrkraft(): TypingAccount {
  const t = registerTeacher("Sra. García", `garcia-es-${Math.random()}@example.org`, "geheim123");
  if (!t.ok) throw new Error(t.error);
  return t.value;
}

function zeige(classes: TypingClass[], teacher: TypingAccount) {
  render(
    <KlasseUndKinder
      teacher={teacher}
      classes={classes}
      cls={classes[0] ?? null}
      pupils={[]}
      offeneProgramme={[]}
      einstiegsProgramm="tippen"
      onSelectClass={() => {}}
      onChanged={() => {}}
    />,
  );
}

/** Füllt die Pflichtfelder und legt die Klasse an. `weg` bestimmt die Startniveaus. */
async function anlegen(name: string, weg: "de" | "es") {
  fireEvent.change(screen.getByLabelText("Nombre de la clase"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Curso de la clase nueva"), { target: { value: "5" } });
  fireEvent.change(screen.getByLabelText("Nivel de partida para todo el alumnado de la clase nueva"), {
    target: { value: String(startPoints("es", weg)[1].units) },
  });
  fireEvent.click(screen.getByRole("button", { name: "Crear la clase" }));
  await vi.waitFor(() => expect(getClass(name.toUpperCase())).toBeTruthy());
  return getClass(name.toUpperCase())!;
}

function optionen(): string[] {
  const feld = screen.getByLabelText("Idioma de la clase nueva") as HTMLSelectElement;
  return [...feld.options].map((o) => o.value);
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
  localStorage.clear();
});

describe("★★★★★ Spanische Bedienung MIT dem Schalter des spanischen Lehrgangs", () => {
  beforeEach(() => localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1"));

  it(`zeigt „es" als Vorgabe im Sprachfeld, und „Español" steht in der Auswahl`, () => {
    zeige([], lehrkraft());
    const feld = screen.getByLabelText("Idioma de la clase nueva") as HTMLSelectElement;
    expect(feld.value).toBe("es");
    // ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M2, Entscheidung des Chats bis
    // Johannes' Antwort auf S8): auf Weg „es" ist die Übungssprache an den Weg
    // gebunden - „Deutsch"/„English" stehen nicht mehr zur Wahl (bis dahin
    // `["de", "en", "es"]`). Wächter: `tastenflow-es-m2-uebungssprache-im-weg`.
    // ★ D1 Nr. 18 (28.09.2026, Entscheidung Johannes): Hauptsprache + Englisch,
    // Deutsch nie - die Hauptsprache bleibt die Vorgabe (Wert oben).
    expect(optionen()).toEqual(["es", "en"]);
    expect(feld.selectedOptions[0].textContent).toBe("Español");
  });

  it(`★ legt eine Klasse mit lang „es" UND Weg „es" an, ohne dass die Lehrkraft das Feld anfasst`, async () => {
    zeige([], lehrkraft());
    const klasse = await anlegen("5a", "es");
    expect(klasse.lang).toBe("es");
    // Vor ES-M: `undefined` - die Oberfläche schlug „es" vor, geschrieben
    // wurde nur „en"/„fr" (Befund ES-O §4 Punkt 4).
    expect(klasse.lernweg).toBe("es");
  });

  it(`ein neues Kind der Klasse erbt den Weg „es"`, async () => {
    zeige([], lehrkraft());
    const klasse = await anlegen("5b", "es");
    const kind = addPupil(klasse.code, "Lucía", "pw1234");
    if (!kind.ok) throw new Error("Kind");
    expect(kind.value.lernweg).toBe("es");
  });
});

// ★ 28.09.2026 (Freigabe fr/es): OHNE jeden Merker ist der Lehrgang an -
// die Klasse bekommt dieselbe Vorgabe wie mit `=1`.
describe("★ Spanische Bedienung ohne Merker (Grundeinstellung seit 28.09.2026: an)", () => {
  it(`zeigt „es" als Vorgabe, und „Español" steht in der Auswahl`, () => {
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_ES)).toBeNull();
    zeige([], lehrkraft());
    const feld = screen.getByLabelText("Idioma de la clase nueva") as HTMLSelectElement;
    expect(feld.value).toBe("es");
    expect(optionen()).toEqual(["es", "en"]);
  });
});

// ★ 28.09.2026 (Freigabe fr/es): Der Schalter ist seither default AN -
// „ohne Schalter" heisst jetzt „Not-Aus =0" (Merker "0"). Die Aussage des
// Blocks bleibt: ist der Lehrgang aus, gilt wie bisher „de".
describe("★★★★★ Spanische Bedienung mit Not-Aus (Merker \"0\") - wie bisher", () => {
  beforeEach(() => localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "0"));

  it(`Vorgabe „de", und „Español" steht NICHT in der Auswahl`, () => {
    zeige([], lehrkraft());
    const feld = screen.getByLabelText("Idioma de la clase nueva") as HTMLSelectElement;
    expect(feld.value).toBe("de");
    expect(optionen()).toEqual(["de", "en"]);
  });

  it(`legt eine Klasse mit lang „de" und ohne Weg (= „de") an`, async () => {
    zeige([], lehrkraft());
    const klasse = await anlegen("4a", "de");
    expect(klasse.lang).toBe("de");
    expect(klasse.lernweg).toBeUndefined();
  });

  it("Not-Aus ?spanisch-lehrgang=0 schaltet einen gemerkten Schalter wieder ab", () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1");
    window.history.replaceState(null, "", "/?spanisch-lehrgang=0");
    zeige([], lehrkraft());
    expect((screen.getByLabelText("Idioma de la clase nueva") as HTMLSelectElement).value).toBe("de");
  });
});

describe(`★★★ Der lokale Speicher: createClass schreibt „es", der Weg eines Kindes bleibt fest`, () => {
  it(`createClass(…, { lernweg: "es" }) trägt den Weg ein - „de" bleibt leer`, () => {
    const t = lehrkraft();
    const es = createClass(t.id, "6a", "6A", { lernweg: "es" } as never);
    const de = createClass(t.id, "6b", "6B", { lernweg: "de" } as never);
    if (!es.ok || !de.ok) throw new Error("Klasse");
    expect(getClass("6A")?.lernweg).toBe("es");
    expect(getClass("6B")?.lernweg).toBeUndefined();
  });

  it(`★ ein Kind auf Weg „es" (oder „fr") lässt sich NICHT umschreiben - wie am Server`, () => {
    const t = lehrkraft();
    const c = createClass(t.id, "6c", "6C", { lernweg: "es" } as never);
    if (!c.ok) throw new Error("Klasse");
    const kind = addPupil(c.value.code, "Mateo", "pw1234");
    if (!kind.ok) throw new Error("Kind");
    expect(kind.value.lernweg).toBe("es");
    // Vor ES-M hielt `setLernweg` nur „de"/„en" fest.
    expect(setLernweg(kind.value.id, "de")?.lernweg).toBe("es");
  });
});
