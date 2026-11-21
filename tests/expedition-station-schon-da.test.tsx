/**
 * Polarstation - „SCHON DA" statt Herzabzug (02.10.2026).
 *
 * Befund einer Lehrkraft aus einer echten Klasse: „Bei der Polarstation war Buchstabensalat
 * und ein Buchstabe ausgegraut, sie konnte nichts schreiben (Klasse war das Wort und K war
 * ‚inaktiv'). Das Wort kam dann noch mal und dann war alles gut."
 *
 * Ablauf damals: K richtig (Kärtchen grau = verbraucht) -> Fehlgriff (Herz weg, Statuszeile
 * liess „Bisher: K" weg, obwohl K noch stand) -> das Kind begann wieder mit K -> „kk" passt
 * zu keiner Lösung -> zweites Herz weg, Zone von vorn.
 *
 * Entscheidung Johannes: „was wäre wenn man zum zweiten mal k drückt dass die sprache einfach
 * sagt k hast du schon gedrückt weiter mit dem nächsten buchstaben?" - Ein Buchstabe, der
 * schon so oft getippt ist, wie er im Wort vorkommt, ist KEIN Fehlgriff: kein Herz, nur ein
 * Hinweis (sichtbar und gesprochen). Ausserdem muss die Statuszeile nach einem Fehlgriff
 * weiter „Bisher: …" nennen, solange etwas getippt ist, und die Ansage sagt, was schon steht.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";
import { SPIEL_TEXTE } from "../src/components/typing/expedition/useExpedition";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

masteryFor("normal");
const noStats: Record<string, LetterStat> = {};
const STATION = (units: string[]): FloeCourse => ({ stages: [{ kind: "station", units }] });

function renderStation(unit: string, isAdult = false) {
  render(
    <ExpeditionStage
      open
      onClose={vi.fn()}
      course={STATION([unit])}
      free
      isAdult={isAdult}
      noTimePressure={false}
      letters={noStats}
      onWin={vi.fn()}
      onFinished={vi.fn()}
    />,
  );
  return screen.getByRole("application");
}

const hearts = () => [...document.body.querySelectorAll(".px-hud__heart")].filter((h) => h.textContent === "❤️").length;
const statusText = () => document.body.querySelector(".px-status")?.textContent ?? "";
const ansage = () => document.body.querySelector('[role="status"]')?.textContent ?? "";
const slotLetters = () =>
  [...document.body.querySelectorAll(".px-station-slots text")].map((t) => t.textContent ?? "").join("");
const graueKaertchen = () =>
  // ★ 29.10.2026 (Kontrast): ein benutztes Kärtchen ist nicht mehr nur blass (.32), sondern trägt
  // einen gestrichelten Rand und die Deckkraft .72 (Schrift bleibt ≥ 4,5 : 1).
  [...document.body.querySelectorAll(".px-station-tiles g")].filter(
    (g) => g.getAttribute("opacity") === "0.72" && g.querySelector("rect[stroke-dasharray]"),
  ).length;
const type = (field: Element, ch: string) => act(() => void fireEvent.keyDown(field, { key: ch }));

describe("Polarstation - Buchstabe, der schon steht, ist kein Fehlgriff", () => {
  it("NACHGESTELLT: K, Fehlgriff, K -> nur ein Herz weg, das zweite K kostet nichts und wird angesagt", () => {
    const field = renderStation("klasse");
    expect(hearts()).toBe(2);
    type(field, "k");
    expect(slotLetters()).toBe("k");
    type(field, "x"); // Fehlgriff (steht nicht im Wort)
    expect(hearts()).toBe(1);
    type(field, "k"); // schon da
    expect(hearts()).toBe(1); // vorher: 0 -> Zone von vorn
    expect(slotLetters()).toBe("k"); // nichts verändert
    expect(statusText()).toMatch(/K hast du schon\. Weiter mit dem nächsten Buchstaben\./);
    expect(ansage()).toMatch(/K hast du schon/);
    // Weiter geht es mit dem nächsten Buchstaben.
    type(field, "l");
    expect(slotLetters()).toBe("kl");
  });

  it("Erwachsene bekommen die sachlichere Fassung", () => {
    const field = renderStation("klasse", true);
    type(field, "k");
    type(field, "k");
    expect(hearts()).toBe(2);
    expect(statusText()).toMatch(/K ist schon gesetzt\. Weiter mit dem nächsten Buchstaben\./);
  });

  it("zählt nach Vorkommen: das zweite S in „klasse“ bleibt richtig, ein drittes S ist „schon da“", () => {
    const field = renderStation("klasse");
    for (const ch of "klas") type(field, ch);
    type(field, "s"); // zweites S - richtig
    expect(slotLetters()).toBe("klass");
    expect(hearts()).toBe(2);
    type(field, "s"); // drittes S - schon da, kein Herz
    expect(hearts()).toBe(2);
    expect(slotLetters()).toBe("klass");
    expect(statusText()).toMatch(/S hast du schon/);
    type(field, "e");
    expect(slotLetters()).toBe("klasse");
  });

  it("ein Buchstabe, der noch NICHT so oft getippt ist, aber an der falschen Stelle steht, bleibt ein Fehlgriff", () => {
    const field = renderStation("klasse");
    type(field, "a"); // im Wort, aber noch nicht dran: Fehlgriff, kein „schon da“
    expect(hearts()).toBe(1);
    expect(statusText()).not.toMatch(/hast du schon/);
    type(field, "k"); // jetzt richtig - und nicht von vorn
    expect(slotLetters()).toBe("k");
    expect(hearts()).toBe(1);
  });

  it("Buchstabe ohne Vorkommen im Wort ist nie „schon da“", () => {
    const field = renderStation("klasse");
    type(field, "x");
    expect(hearts()).toBe(1);
    expect(statusText()).not.toMatch(/hast du schon/);
  });

  it("„schon da“ zählt nicht als Fehlgriff für das Überspringen (zählt nicht zum Versuch)", () => {
    // Nur K und dann K, K, K: ein Treffer (K) genügt zwar für `wirklichVersucht`, aber die
    // Wiederholungen dürfen weder Herzen noch Fehlgriffe erzeugen.
    const field = renderStation("klasse");
    type(field, "k");
    for (let i = 0; i < 5; i++) type(field, "k");
    expect(hearts()).toBe(2);
  });
});

describe("Polarstation - Statuszeile und Ansage nach einem Fehlgriff", () => {
  it("NACHGESTELLT: nach K und einem Fehlgriff nennt die Statuszeile weiter „Bisher: K“", () => {
    const field = renderStation("klasse");
    type(field, "k");
    expect(statusText()).toMatch(/Bisher: k\./i);
    type(field, "x");
    expect(hearts()).toBe(1);
    expect(statusText()).toMatch(/Bisher: k\./i); // vorher: weg, obwohl K grau blieb
    expect(graueKaertchen()).toBe(1); // Zeile und Kärtchen sagen dasselbe
  });

  it("die Ansage nach dem Fehlgriff sagt, was schon steht", () => {
    const field = renderStation("klasse");
    type(field, "k");
    type(field, "x");
    expect(ansage()).toMatch(/Autsch, ein Herz weg!/);
    expect(ansage()).toMatch(/Schon da: k\./i);
  });

  it("ohne etwas Getipptes bleibt die Ansage unverändert (kein „Schon da“)", () => {
    const field = renderStation("klasse");
    type(field, "x");
    expect(ansage()).toMatch(/Autsch, ein Herz weg!/);
    expect(ansage()).not.toMatch(/Schon da/);
  });
});

describe("Polarstation - „schon da“ in allen Sprachwegen", () => {
  for (const sprache of ["de", "en", "fr", "es", "it"] as const) {
    it(`${sprache}: Kind- und Erwachsenen-Fassung nennen den Buchstaben, Stand-Satz nennt die Folge`, () => {
      const S = SPIEL_TEXTE[sprache];
      expect(S.schonDa(false, "K")).toContain("K");
      expect(S.schonDa(true, "K")).toContain("K");
      expect(S.schonDa(false, "K")).not.toBe(S.schonDa(true, "K"));
      expect(S.schonDaStand("K, A")).toContain("K, A");
      // Hausregel: nie ein Vorwurf, nie Bindestrich-Varianten
      for (const t of [S.schonDa(false, "K"), S.schonDa(true, "K"), S.schonDaStand("K")]) {
        expect(t).not.toMatch(/[–—]/);
        expect(t.toLowerCase()).not.toMatch(/falsch|fehler|wrong|faux|incorrect/);
      }
    });
  }
});
