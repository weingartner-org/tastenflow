/**
 * „Klasse bearbeiten" (Tastenflow): Klassenname + Beitritts-Code nachträglich
 * ändern. Geprüft wird der LOKALE Pfad (account.ts) — beim Code-Wechsel muss der
 * neue Code auf alle Schüler:innen mitwandern, damit ihr Login weiter funktioniert.
 * Der PocketBase-Pfad (mit E-Mail-Kaskade) ist ohne Server nicht testbar.
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  addPupil,
  createClass,
  listClasses,
  listPupils,
  loginPupil,
  registerTeacher,
  updateClass,
} from "../src/lib/typing";

beforeEach(() => {
  localStorage.clear();
});

function setup() {
  const t = registerTeacher("Frau Klein", "klein@schule.at", "geheim1");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "ABC");
  if (!c.ok) throw new Error(c.error);
  addPupil("ABC", "Anna", "pw12");
  addPupil("ABC", "Ben", "pw12");
  return { teacherId: t.value.id };
}

describe("updateClass — Klasse bearbeiten", () => {
  it("benennt den Klassennamen um (Code + Kinder bleiben)", () => {
    const { teacherId } = setup();
    const r = updateClass("ABC", teacherId, { name: "3b Sport" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toBe("3b Sport");
      expect(r.value.code).toBe("ABC");
    }
    expect(listPupils("ABC").length).toBe(2);
    expect(loginPupil("ABC", "Anna", "pw12").ok).toBe(true);
  });

  it("ändert den Beitritts-Code → wandert auf alle Kinder mit", () => {
    const { teacherId } = setup();
    const r = updateClass("ABC", teacherId, { code: "xyz9" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.code).toBe("XYZ9"); // wird großgeschrieben
    // Unter dem neuen Code sind die Kinder, unter dem alten nicht mehr.
    expect(listPupils("XYZ9").map((p) => p.name).sort()).toEqual(["Anna", "Ben"]);
    expect(listPupils("ABC").length).toBe(0);
    // Login folgt dem neuen Code; der alte gilt nicht mehr.
    expect(loginPupil("XYZ9", "Anna", "pw12").ok).toBe(true);
    expect(loginPupil("ABC", "Anna", "pw12").ok).toBe(false);
    // Klassenliste der Lehrkraft zeigt nur noch den neuen Code.
    expect(listClasses(teacherId).map((c) => c.code)).toEqual(["XYZ9"]);
  });

  it("Name UND Code in einem Schritt", () => {
    const { teacherId } = setup();
    const r = updateClass("ABC", teacherId, { name: "Neue 3b", code: "N3B" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toBe("Neue 3b");
      expect(r.value.code).toBe("N3B");
    }
    expect(loginPupil("N3B", "Ben", "pw12").ok).toBe(true);
  });

  it("lehnt einen bereits vergebenen Code ab", () => {
    const { teacherId } = setup();
    createClass(teacherId, "4a", "QRS");
    const r = updateClass("ABC", teacherId, { code: "QRS" });
    expect(r.ok).toBe(false);
    // Die Klasse bleibt unverändert erreichbar.
    expect(loginPupil("ABC", "Anna", "pw12").ok).toBe(true);
  });

  it("der eigene, unveränderte Code ist kein Kollisions-Fehler", () => {
    const { teacherId } = setup();
    const r = updateClass("ABC", teacherId, { name: "3b", code: "ABC" });
    expect(r.ok).toBe(true);
  });

  it("weist ungültige Codes und leere Namen ab", () => {
    const { teacherId } = setup();
    expect(updateClass("ABC", teacherId, { code: "!!" }).ok).toBe(false);
    expect(updateClass("ABC", teacherId, { code: "" }).ok).toBe(false);
    expect(updateClass("ABC", teacherId, { name: "   " }).ok).toBe(false);
  });

  it("nur die eigene Lehrkraft darf bearbeiten", () => {
    setup();
    const r = updateClass("ABC", "fremde-lehrkraft-id", { name: "Kapern" });
    expect(r.ok).toBe(false);
    expect(listClasses("fremde-lehrkraft-id").length).toBe(0);
  });
});
