/**
 * ★★★ Eigene Schulstufe je Kind (Johannes, 25.09.2026): „ich brauch bei
 * einzelnen Schülern auch die Möglichkeit, die Schulstufe noch anzupassen".
 *
 * Die Klasse hat EINE Schulstufe; ein Kind kann eine eigene bekommen, die statt
 * der Klassen-Schulstufe gilt (`mitKlassenVorrang`), jedes Schuljahr mitwächst
 * und nur von der Lehrkraft geschrieben werden darf (Feld-Wächter LOCKED).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { mitKlassenVorrang } from "@/components/typing/useTypingAuth";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import { addPupil, createClass, getAccount, listPupils, registerTeacher } from "@/lib/typing/account";
import { schuljahrStartjahr, SCHULSTUFE_ERWACHSEN } from "@/lib/typing/klassenEinstellungen";

const lies = (pfad: string) => readFileSync(resolve(__dirname, "..", pfad), "utf-8");
const JETZT = Date.now();
const SJ = schuljahrStartjahr(JETZT);

const KLASSE: TypingClass = {
  code: "3B", name: "3b", teacherId: "t1", schulstufe: 3, schulstufeSchuljahr: SJ, createdAt: 0,
};
const KIND: TypingAccount = { id: "p1", role: "schueler", name: "Mia", classCode: "3B", createdAt: 0 };

describe("die Rechnung: eigene Schulstufe vor der der Klasse", () => {
  it("ohne eigene Schulstufe gilt die Klasse (3. Schulstufe ⇒ Kindertexte)", () => {
    expect(mitKlassenVorrang(KIND, KLASSE, JETZT).stufe).toBe("kids");
  });
  it("mit eigener 8. Schulstufe bekommt das Kind Texte für 11-15", () => {
    const k = { ...KIND, schulstufe: 8, schulstufeSchuljahr: SJ };
    expect(mitKlassenVorrang(k, KLASSE, JETZT).stufe).toBe("teens");
  });
  it("„Erwachsen\" gilt auch je Kind", () => {
    const k = { ...KIND, schulstufe: SCHULSTUFE_ERWACHSEN, schulstufeSchuljahr: SJ };
    expect(mitKlassenVorrang(k, KLASSE, JETZT).stufe).toBe("erwachsen");
  });
  it("0 heisst „wie die Klasse\"", () => {
    const k = { ...KIND, schulstufe: 0, schulstufeSchuljahr: 0 };
    expect(mitKlassenVorrang(k, KLASSE, JETZT).stufe).toBe("kids");
  });
  it("sie wächst mit: vor fünf Schuljahren als 3. eingetragen ⇒ heute 8. ⇒ teens", () => {
    const k = { ...KIND, schulstufe: 3, schulstufeSchuljahr: SJ - 5 };
    expect(mitKlassenVorrang(k, { ...KLASSE, schulstufe: 1 }, JETZT).stufe).toBe("teens");
  });
});

describe("der Server", () => {
  it("das Schema kennt beide Felder an tt_pupils", () => {
    const setup = lies("pocketbase/setup.mjs");
    expect(setup).toMatch(/N\("schulstufe"\),\s*\n\s*N\("schulstufeSchuljahr"\),/);
  });
  it("ein Kind kann sich nicht selbst herausstufen (LOCKED im Feld-Wächter)", () => {
    const waechter = lies("pocketbase/pb_hooks/tt_pupils_field_guard.pb.js");
    expect(waechter).toMatch(/"schulstufe",\s*\n\s*"schulstufeSchuljahr",/);
  });
});

describe("die Lehrkraft stellt sie in „Einstellungen für Mia\" ein", () => {
  let kinder: TypingAccount[];
  beforeEach(() => {
    localStorage.clear();
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Mia", "pw1234");
    if (!p.ok) throw new Error(p.error);
    kinder = listPupils(c.value.code);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  async function klappeAuf() {
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Einstellungen und Auswertung von Mia/i }));
    });
    fireEvent.click(screen.getByText(/^Einstellungen für Mia\b/));
  }

  it("Vorgabe „wie die Klasse\", eine Wahl landet sofort im Speicher, samt Schuljahr", async () => {
    await klappeAuf();
    const feld = screen.getByLabelText("Schulstufe von Mia") as HTMLSelectElement;
    expect(feld.value).toBe("0");
    expect(feld.options[0].textContent).toMatch(/^wie die Klasse \(/);
    await act(async () => {
      fireEvent.change(feld, { target: { value: "8" } });
    });
    const gespeichert = getAccount(kinder[0].id)!;
    expect(gespeichert.schulstufe).toBe(8);
    expect(gespeichert.schulstufeSchuljahr).toBe(SJ);
    expect(await screen.findByText("Mia bekommt jetzt Texte für die 8. Schulstufe.")).toBeTruthy();

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Schulstufe von Mia"), { target: { value: "0" } });
    });
    expect(getAccount(kinder[0].id)!.schulstufe).toBe(0);
    expect(getAccount(kinder[0].id)!.schulstufeSchuljahr).toBe(0);
  }, 30_000);
});
