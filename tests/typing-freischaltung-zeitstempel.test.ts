/**
 * Wächter für den Freischalt-Zeitstempel (28.08.2026).
 *
 * Hintergrund: Bis dahin wurde jede neue Taste im Bildschirm gefeiert, aber
 * nirgends aufgeschrieben — die Frage „wie lange hat das Kind bis zur nächsten
 * Taste geübt?" war für KEIN Kind beantwortbar. Der Wächter sichert beides:
 * die reine Funktion UND dass BEIDE Stellen, an denen eine Taste dazukommt
 * („Mein Training" und der Serien-Trainer), den Stempel auch wirklich setzen.
 * Zwei Stellen, die voneinander nichts wissen, sind hier die eigentliche Gefahr
 * — [[feedback_zwei_stellen_die_voneinander_nichts_wissen]].
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { stampUnlocks, ohneZeitstempel } from "../src/lib/typing/letters";
import { loadProgress } from "../src/lib/typing/progress";

describe("stampUnlocks", () => {
  it("stempelt genau die neu dazugekommenen Einheiten", () => {
    const out = stampUnlocks(["f", "j"], ["f", "j", "d"], undefined, 1000);
    expect(out).toEqual({ d: 1000 });
  });

  it("lässt einen schon vergebenen Zeitpunkt unangetastet", () => {
    const out = stampUnlocks(["f", "j"], ["f", "j", "d"], { d: 500 }, 9999);
    expect(out).toEqual({ d: 500 });
  });

  it("gibt dieselbe Referenz zurück, wenn nichts dazukam", () => {
    const bisher = { d: 500 };
    expect(stampUnlocks(["f", "j"], ["f", "j"], bisher, 1000)).toBe(bisher);
    expect(stampUnlocks(["f", "j"], ["f", "j"], undefined, 1000)).toBeUndefined();
  });

  it("verkraftet mehrere Einheiten auf einmal", () => {
    const out = stampUnlocks([], ["f", "j"], undefined, 42);
    expect(out).toEqual({ f: 42, j: 42 });
  });
});

describe("ohneZeitstempel", () => {
  it("nennt die Alt-Einheiten, statt sie stillschweigend wegzulassen", () => {
    expect(ohneZeitstempel(["f", "j", "d"], { d: 1 })).toEqual(["f", "j"]);
    expect(ohneZeitstempel(["f"], undefined)).toEqual(["f"]);
  });
});

describe("loadProgress reicht introducedAt durch", () => {
  it("verliert den Zeitstempel nicht beim Neuladen (Whitelist-Falle)", () => {
    // Die Testumgebung stellt localStorage schon bereit (tests/setup.ts) — nicht
    // ersetzen, sonst fehlt dem Aufräumen dort das `clear`.
    localStorage.setItem(
      "tippen-trainer:v1",
      JSON.stringify({
        xp: 0, lessons: {}, letters: {},
        introduced: ["f", "j", "d"], introducedAt: { d: 1234 },
      }),
    );
    expect(loadProgress().introducedAt).toEqual({ d: 1234 });
  });
});

describe("jede Freischalt-Stelle stempelt", () => {
  /*
    ★★★ 11.09.2026: DIESER WÄCHTER HAT SEINE AUFGABE GEWECHSELT.

    Bis dahin stand `introducedAt: stampUnlocks(...)` in JEDER Stelle einzeln.
    Seit dem Klassenmatch (F7) gibt es drei Läufe, die eine Runde beenden -
    und die Regel steht darum EINMAL in `lib/typing/tastenfreischaltung.ts`.
    Ein dritter handgeschriebener Stempel wäre die dritte Fassung derselben
    Sache ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).

    Geprüft wird jetzt: Die gemeinsame Regel stempelt, und jede Stelle, die
    `introduced` schreibt, hat ihren Stempel dabei - gleich, ob aus der Regel
    oder von Hand.
  */
  it("★★★ die gemeinsame Regel setzt den Zeitstempel", () => {
    const s = readFileSync("src/lib/typing/tastenfreischaltung.ts", "utf8");
    expect(s).toContain("stampUnlocks(");
    // Und sie gibt ihn auch heraus - sonst käme er nie in einen Fortschritt.
    expect(s).toContain("introducedAt:");
  });

  /*
    ★ 02.10.2026: Das Klassenmatch gehört NICHT mehr zu den Stellen, die
    `introduced` schreiben - es merkt die Taste nur vor, und die Vorstellung in
    „Mein Training" stempelt (`loeseVormerkungEin`, siehe der Test darunter).
    Der alte Wortlaut verlangte vom Match, dass es `introduced: frei.introduced`
    schreibt - das war der Fehler (Arda, CSS6), nicht die Regel.
  */
  const dateien = [
    "src/components/typing/AdaptiveTrainer.tsx",
    "src/components/typing/SerienTrainer.tsx",
  ];

  it("★★★★★ das Klassenmatch schreibt `introduced`/`introducedAt` NIE (nur die Vormerkung)", () => {
    const s = readFileSync("src/components/typing/KlassenmatchLauf.tsx", "utf8");
    expect(s).not.toMatch(/\bintroduced: (grown|frei\.introduced)\b/);
    expect(s).not.toMatch(/introducedAt: (stampUnlocks\(|frei\.introducedAt)/);
    expect(s).toContain("freischaltungAusMatch: frei.freischaltungAusMatch");
  });

  it("★★★ die Vorstellung nach einem Match stempelt (`loeseVormerkungEin`)", () => {
    const s = readFileSync("src/lib/typing/tastenfreischaltung.ts", "utf8");
    expect(s).toMatch(/introducedAt: stampUnlocks\(vorher, nachher/);
  });

  it("★★★ keine Stelle schreibt `introduced`, ohne auch `introducedAt` zu schreiben", () => {
    for (const d of dateien) {
      const s = readFileSync(d, "utf8");
      // Zeilen, die den Fortschritt mit neuen Einheiten schreiben …
      const schreibend = (s.match(/\bintroduced: (grown|frei\.introduced)\b/g) ?? []).length;
      expect(schreibend, `${d} schaltet gar nicht frei?`).toBeGreaterThan(0);
      // … und ebenso viele, die den Zeitstempel mitschreiben.
      const mitStempel = (
        s.match(/introducedAt: (stampUnlocks\(|frei\.introducedAt)/g) ?? []
      ).length;
      expect(mitStempel, `${d}: ${schreibend} mal introduced, ${mitStempel} mal introducedAt`).toBe(
        schreibend,
      );
    }
  });
});
