/**
 * ★★★★★ WÄCHTER (E11c, 26.09.2026): Die Vorgabe beim Anlegen einer Klasse aus
 * der FRANZÖSISCHEN Bedienung - nach dem Muster des englischen Wächters
 * (`tastenflow-klasse-lang-vorgabe-englisch.test.tsx`).
 *
 * Befund E11a-5 §3 Punkt 2: *„eine Lehrkraft mit französischer Bedienung legt
 * weiter eine Klasse auf Weg „de" an"*. Die Regel jetzt:
 *
 *  · MIT dem Schalter des französischen Lehrgangs (`?franzoesisch-lehrgang=1`,
 *    Bauplan F16): Übungssprache „fr" UND Weg „fr" - die Auswahl bietet
 *    „Français" an.
 *  · OHNE den Schalter: wie bisher „de" und Weg „de" (Französisch gibt es nur
 *    auf Weg „fr", F15) - und „Français" steht nicht in der Auswahl.
 *    ★ Seit der Freigabe 28.09.2026 ist der Schalter default AN; „ohne" heisst
 *    jetzt „Not-Aus" (`?franzoesisch-lehrgang=0`, Merker "0").
 *  · Ein neues Kind der Klasse erbt den Weg „fr".
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: "fr" as const,
      spracheGewaehlt: "fr" as const,
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
import { addPupil, getClass, registerTeacher } from "@/lib/typing/account";
import { LEHRGANG_PROBE_MERKER_FR } from "@/lib/typing/lernweg";

function lehrkraft(): TypingAccount {
  const t = registerTeacher("Mme Martin", `martin-fr-${Math.random()}@example.org`, "geheim123");
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
async function anlegen(name: string, weg: "de" | "fr") {
  fireEvent.change(screen.getByLabelText("Nom de la classe"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Niveau scolaire de la nouvelle classe"), { target: { value: "5" } });
  fireEvent.change(screen.getByLabelText("Niveau de départ pour tous les élèves de la nouvelle classe"), {
    target: { value: String(startPoints("fr", weg)[1].units) },
  });
  fireEvent.click(screen.getByRole("button", { name: "Créer la classe" }));
  await vi.waitFor(() => expect(getClass(name.toUpperCase())).toBeTruthy());
  return getClass(name.toUpperCase())!;
}

function optionen(): string[] {
  const feld = screen.getByLabelText("Langue de la nouvelle classe") as HTMLSelectElement;
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

describe("★★★★★ Französische Bedienung MIT dem Schalter des französischen Lehrgangs", () => {
  beforeEach(() => localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "1"));

  it(`zeigt „fr" als Vorgabe im Sprachfeld, und „Français" steht in der Auswahl`, () => {
    zeige([], lehrkraft());
    const feld = screen.getByLabelText("Langue de la nouvelle classe") as HTMLSelectElement;
    expect(feld.value).toBe("fr");
    // ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M2, Entscheidung des Chats bis
    // Johannes' Antwort auf S8): auf Weg „fr" ist die Übungssprache an den Weg
    // gebunden - „Deutsch"/„English" stehen nicht mehr zur Wahl (bis dahin
    // `["de", "en", "fr"]`). Wächter: `tastenflow-es-m2-uebungssprache-im-weg`.
    // ★ D1 Nr. 18 (28.09.2026, Entscheidung Johannes): Hauptsprache + Englisch,
    // Deutsch nie - die Hauptsprache bleibt die Vorgabe (Wert oben).
    expect(optionen()).toEqual(["fr", "en"]);
    expect(feld.selectedOptions[0].textContent).toBe("Français");
  });

  it(`legt eine Klasse mit lang „fr" und Weg „fr" an, ohne dass die Lehrkraft das Feld anfasst`, async () => {
    zeige([], lehrkraft());
    const klasse = await anlegen("cm2a", "fr");
    expect(klasse.lang).toBe("fr");
    expect(klasse.lernweg).toBe("fr");
  });

  it(`ein neues Kind der Klasse erbt den Weg „fr"`, async () => {
    zeige([], lehrkraft());
    const klasse = await anlegen("cm2b", "fr");
    const kind = addPupil(klasse.code, "Inès", "pw1234");
    if (!kind.ok) throw new Error("Kind");
    expect(kind.value.lernweg).toBe("fr");
  });
});

// ★ 28.09.2026 (Freigabe fr/es): OHNE jeden Merker ist der Lehrgang an -
// die Klasse bekommt dieselbe Vorgabe wie mit `=1`.
describe("★ Französische Bedienung ohne Merker (Grundeinstellung seit 28.09.2026: an)", () => {
  it(`zeigt „fr" als Vorgabe, und „Français" steht in der Auswahl`, () => {
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_FR)).toBeNull();
    zeige([], lehrkraft());
    const feld = screen.getByLabelText("Langue de la nouvelle classe") as HTMLSelectElement;
    expect(feld.value).toBe("fr");
    expect(optionen()).toEqual(["fr", "en"]);
  });
});

// ★ 28.09.2026 (Freigabe fr/es): Der Schalter ist seither default AN -
// „ohne Schalter" heisst jetzt „Not-Aus =0" (Merker "0"). Die Aussage des
// Blocks bleibt: ist der Lehrgang aus, gilt wie bisher „de".
describe("★★★★★ Französische Bedienung mit Not-Aus (Merker \"0\") - wie bisher", () => {
  beforeEach(() => localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "0"));

  it(`Vorgabe „de", und „Français" steht NICHT in der Auswahl`, () => {
    zeige([], lehrkraft());
    const feld = screen.getByLabelText("Langue de la nouvelle classe") as HTMLSelectElement;
    expect(feld.value).toBe("de");
    expect(optionen()).toEqual(["de", "en"]);
  });

  it(`legt eine Klasse mit lang „de" und ohne Weg (= „de") an`, async () => {
    zeige([], lehrkraft());
    const klasse = await anlegen("cm1a", "de");
    expect(klasse.lang).toBe("de");
    expect(klasse.lernweg).toBeUndefined();
  });

  it("Not-Aus ?franzoesisch-lehrgang=0 schaltet einen gemerkten Schalter wieder ab", () => {
    localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "1");
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=0");
    zeige([], lehrkraft());
    expect((screen.getByLabelText("Langue de la nouvelle classe") as HTMLSelectElement).value).toBe("de");
  });
});
