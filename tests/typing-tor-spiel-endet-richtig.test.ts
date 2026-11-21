/**
 * Wächter für Testerin Befund (Marburg, 28.08.2026): „Beim Eisschollen-Spiel gibt
 * es manchmal größere Lücken zwischen den Schollen. Wenn ich bis dahin komme,
 * sagt das Programm, ich hätte die nächste Taste freigeschaltet … es sieht aber
 * so aus, als würde es eigentlich noch weiter gehen."
 *
 * Ursache: `buildGateCourse` baute bei ungerader Tastenzahl DREI Etappen; die
 * Expedition kann aber nur EINE Zone je Kurs zeigen, und der Rastplatz zwischen
 * zwei Etappen trägt - wie die Ziel-Insel - `unit === null`. Betroffen war jede
 * zweite Freischaltung.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildTorCourse } from "../src/lib/typing/expedition/course";
import { courseSpots, courseUnits } from "../src/lib/typing/iceFloe";
import { masteryFor } from "../src/lib/typing/letters";
import type { LetterStat } from "../src/lib/typing/progress";

const m = masteryFor("normal");
const letters: Record<string, LetterStat> = {};
const introBis = (n: number) =>
  "fjdkslaöenirthoucgmbwzv".slice(0, n).split("");

describe("Der Tor-Kurs hat immer genau EINE Etappe", () => {
  // Bei JEDER Tastenzahl - vorher war jede zweite dreistufig.
  for (let n = 4; n <= 23; n++) {
    it(`${n} Tasten → eine Etappe, kein Rastplatz`, () => {
      const kurs = buildTorCourse(introBis(n), letters, m);
      expect(kurs.stages.length).toBe(1);
      const spots = courseSpots(kurs);
      expect(spots.filter((s) => s.kind === "rest")).toHaveLength(0);
      expect(spots.filter((s) => s.kind === "finish")).toHaveLength(1);
      // Das Ziel steht GANZ hinten - sonst endet das Spiel zu früh.
      expect(spots[spots.length - 1].kind).toBe("finish");
      expect(courseUnits(kurs).length).toBeGreaterThan(0);
    });
  }

  it("wechselt die Zone von Freischaltung zu Freischaltung", () => {
    const zonen = new Set<string>();
    for (let n = 6; n <= 20; n++)
      zonen.add(buildTorCourse(introBis(n), letters, m).stages[0]?.kind ?? "-");
    expect(zonen).toEqual(new Set(["water", "climb", "slide"]));
  });

  it("nie die Echo-Höhle als Tor (ohne Gehör/Braillezeile nicht lösbar)", () => {
    for (let n = 4; n <= 23; n++)
      expect(buildTorCourse(introBis(n), letters, m).stages[0]?.kind).not.toBe("cave");
  });

  it("derselbe Anlauf zeigt dasselbe Tor", () => {
    const a = buildTorCourse(introBis(12), letters, m);
    const b = buildTorCourse(introBis(12), letters, m);
    expect(courseUnits(a)).toEqual(courseUnits(b));
  });
});

describe("Der Rastplatz ist nicht das Ziel", () => {
  it("das Spiel beendet sich nur am finish, nicht an jedem unit === null", () => {
    const s = readFileSync("src/components/typing/expedition/useExpedition.ts", "utf8");
    // Der Rastplatz wird eigens behandelt, BEVOR auf `unit === null` geprüft wird.
    const restIdx = s.indexOf('if (next.kind === "rest")');
    const nullIdx = s.indexOf("if (next.unit === null)");
    expect(restIdx).toBeGreaterThan(-1);
    expect(nullIdx).toBeGreaterThan(-1);
    expect(restIdx).toBeLessThan(nullIdx);
  });

  it("die Trainer füttern den Tor-Kurs, nicht mehr den alten Etappen-Bau", () => {
    for (const d of [
      "src/components/typing/AdaptiveTrainer.tsx",
      "src/components/typing/SerienTrainer.tsx",
    ]) {
      const s = readFileSync(d, "utf8");
      expect(s).toContain("buildTorCourse(");
      expect(s).not.toContain("buildGateCourse(");
    }
  });
});
