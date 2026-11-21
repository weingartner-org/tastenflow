/**
 * ★★★★★ WÄCHTER: Die Vorgabe der Übungssprache beim Anlegen einer Klasse
 * folgt der Bedienungssprache (Befund 24.09.2026, Bauplan englischer
 * Lehrgang §7): *„Neue Klassen bekommen immer `lang: 'de'`, auch bei
 * englischer Lehrkraft."*
 *
 * `useBedienSprache` wird für diese Datei gemockt, damit der Test unabhängig
 * vom Sprachbereich-Provider (`TastenflowSprachBereich`) ist - andere Dateien
 * mocken es nicht, darum steht dieser Wächter für sich allein.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: "en" as const,
      // ★ 26.09.2026: der echte Hook liefert seit E2b auch `spracheGewaehlt`;
      // seit E11a-4 lesen die Klassen-Felder genau dieses Feld.
      spracheGewaehlt: "en" as const,
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
import { getClass, registerTeacher } from "@/lib/typing/account";

// Ohne den Probe-Schalter bleibt der LERNWEG „de" (F1/§2.2) - hier geht es nur
// um die ÜBUNGSSPRACHE (`lang`), die davon unabhängig ist.
const V = startPoints("en", "de");

function lehrkraft(): TypingAccount {
  const t = registerTeacher("Ms Berger", "berger-en@example.org", "geheim123");
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

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
  vergissGeladeneKlasse();
  window.history.replaceState(null, "", "/");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("★★★★★ Englische Bedienung - die Vorgabe der neuen Klasse", () => {
  it(`zeigt „en" als Vorgabe im Sprachfeld, nicht „de"`, () => {
    const t = lehrkraft();
    zeige([], t);
    const feld = screen.getByLabelText("Language for the new class") as HTMLSelectElement;
    expect(feld.value).toBe("en");
  });

  it(`legt eine Klasse mit lang „en" an, ohne dass die Lehrkraft das Feld anfasst`, async () => {
    const t = lehrkraft();
    zeige([], t);
    fireEvent.change(screen.getByLabelText("Class name"), { target: { value: "3c" } });
    fireEvent.change(screen.getByLabelText("Year group for the new class"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Starting point for all pupils in the new class"), {
      target: { value: String(V[1].units) },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create a class" }));
    await vi.waitFor(() => expect(getClass("3C")).toBeTruthy());
    expect(getClass("3C")!.lang).toBe("en");
  });
});
