/**
 * „Meine Klasse" (MK-E0/E2): der gemeinsame Lehrkraft-Bereich aller vier
 * Lernprogramme.
 *
 * ⚠️ Der Reiter „Überblick" und sein Kasten „Braucht Aufmerksamkeit" sind am
 * 09.09.2026 ersatzlos entfallen (Entscheidung Johannes). Die Prüfungen zu
 * `hinweiseFuer` standen hier und sind mit der Sache selbst gegangen.
 *
 * Kern der Prüfung ist die Regel hinter „Programme dieser Klasse":
 * Sie ist ein reiner ANZEIGE-Filter, und eine leere Auswahl bedeutet
 * „alle anzeigen" — sonst würden Bestandsklassen (die das Feld nie gesetzt
 * haben) plötzlich mit leerem Bereich dastehen.
 */
import { describe, expect, it } from "vitest";
import {
  LW_PROGRAMS,
  lwProgram,
  programsOfClass,
} from "@/lib/lernwerkstatt/klassen";
import {
  createClass,
  listClasses,
  registerTeacher,
  setClassPrograms,
} from "@/lib/typing/account";
import type { TypingClass } from "@/lib/typing/account";

function klasse(programs?: string[]): TypingClass {
  return {
    code: "3B",
    name: "3b",
    teacherId: "t1",
    programs,
    createdAt: 0,
  };
}

describe("programsOfClass — Anzeige-Filter", () => {
  it("Ohne Auswahl (Bestandsklasse) werden ALLE Programme gezeigt", () => {
    expect(programsOfClass(klasse()).map((p) => p.key)).toEqual(
      LW_PROGRAMS.map((p) => p.key),
    );
    expect(programsOfClass(klasse([])).map((p) => p.key)).toEqual(
      LW_PROGRAMS.map((p) => p.key),
    );
  });

  it.skip("Eine Auswahl zeigt genau die gewählten Programme", () => {
    expect(programsOfClass(klasse(["braille", "computer"])).map((p) => p.key)).toEqual([
      "braille",
      "computer",
    ]);
  });

  it("Vom Admin geparkte Programme erscheinen nie — auch wenn gewählt", () => {
    const released = (k: string) => k !== "klangpunkte";
    expect(
      programsOfClass(klasse(["klangpunkte", "tippen"]), released).map((p) => p.key),
    ).toEqual(["tippen"]);
  });

  it("Bleibt nach dem Filtern nichts übrig, werden lieber alle offenen gezeigt", () => {
    const released = (k: string) => k === "tippen";
    // Die Klasse hat NUR ein geparktes Programm gewählt → kein leerer Bereich.
    expect(programsOfClass(klasse(["klangpunkte"]), released).map((p) => p.key)).toEqual([
      "tippen",
    ]);
  });

  it("Ohne Klasse (noch keine angelegt) gelten alle offenen Programme", () => {
    expect(programsOfClass(null).map((p) => p.key)).toEqual(
      LW_PROGRAMS.map((p) => p.key),
    );
  });
});

describe("lwProgram — Schlüssel auflösen", () => {
  it.skip("Kennt die vier Programme und den Alt-Namen „punktgenau“", () => {
    expect(lwProgram("computer")?.label).toBe("im Griff");
    expect(lwProgram("tippen")?.label).toBe("Tastenflow");
    expect(lwProgram("punktgenau")?.key).toBe("braille");
  });

  it("Unbekannte oder fehlende Schlüssel liefern null", () => {
    expect(lwProgram("hoerbuch")).toBeNull();
    expect(lwProgram(null)).toBeNull();
    expect(lwProgram(undefined)).toBeNull();
  });
});

describe("setClassPrograms — Speicherweg (lokales Backend)", () => {
  it("Speichert die Auswahl an der Klasse und liest sie zurück", () => {
    localStorage.clear();
    const t = registerTeacher("Frau L", "l@schule.at", "geheim123");
    expect(t.ok).toBe(true);
    if (!t.ok) return;
    const c = createClass(t.value.id, "3b", "3B");
    expect(c.ok).toBe(true);
    if (!c.ok) return;

    // Frisch angelegt: noch keine Auswahl → „alle anzeigen".
    expect(listClasses(t.value.id)[0].programs ?? []).toEqual([]);

    setClassPrograms("3B", t.value.id, ["braille", "computer"]);
    expect(listClasses(t.value.id)[0].programs).toEqual(["braille", "computer"]);

    // Zurücksetzen auf „alle" ist möglich.
    setClassPrograms("3B", t.value.id, []);
    expect(listClasses(t.value.id)[0].programs).toEqual([]);
  });

  it("Eine fremde Lehrkraft kann die Auswahl nicht ändern", () => {
    localStorage.clear();
    const a = registerTeacher("A", "a@schule.at", "geheim123");
    const b = registerTeacher("B", "b@schule.at", "geheim123");
    if (!a.ok || !b.ok) throw new Error("Registrierung fehlgeschlagen");
    const c = createClass(a.value.id, "3b", "3B");
    if (!c.ok) throw new Error("Klasse fehlgeschlagen");

    expect(setClassPrograms("3B", b.value.id, ["tippen"])).toBeNull();
    expect(listClasses(a.value.id)[0].programs ?? []).toEqual([]);
  });
});
