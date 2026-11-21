/**
 * Wächter für Testerin Rückmeldung vom 25.09.2026 (Freitag).
 *
 *  1. Nele hatte 100 % Treffsicherheit und las „achte auf wenige Fehler".
 *     Der Rat-Satz kam aus der Vorgeschichte einzelner Tasten (60 Anschläge,
 *     über Runden hinweg), nicht aus der Runde. Am alten Stand nachgestellt:
 *     beide Fälle unten gaben dort den Fehler-Satz.
 *  2. Beim neuen I hieß es nur „rechter Mittelfinger" - nicht, WOHIN.
 *  3. Buchstabensalat: „Lid" wurde nicht angenommen (Runde „Linde"), und mit
 *     Screenreader hörte das Kind nur die Buchstaben, nie das Wort.
 *  4. Die Lehrkraft sieht die nächsten zwei Tasten je Kind.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { masteryFor, naechsteTasten, unitHowToType, unitHowToTypeEn } from "../src/lib/typing/letters";
import { rueckmeldungFuer } from "../src/lib/typing/rueckmeldung";
import { isRealWord } from "../src/lib/typing/lexicon";
import { pruefeSalatwort, salatFeldbeschriftung } from "../src/lib/typing/uebungsformen/buchstabensalat";
import type { LetterStat } from "../src/lib/typing/progress";

const m = masteryFor("normal");
const gut = (ms = 250): LetterStat => ({
  hits: 60, misses: 0, sumMs: 60 * ms, timed: 60, recent: Array(60).fill(ms),
});
const INTRO = ["f", "j", "d", "k", "s", "l", "a", "ö", "e", "i"];
const sauber = () => Object.fromEntries(INTRO.map((c) => [c, gut()])) as Record<string, LetterStat>;
/** „i" hatte in früheren Runden zwei Fehlgriffe, sonst ist alles sauber. */
const mitAltlast = () => ({
  ...sauber(),
  i: { hits: 10, misses: 2, sumMs: 2500, timed: 10, recent: [-1, -1, ...Array(10).fill(250)] },
});

describe("1 · Bei 100 % kein Satz über Fehler", () => {
  it("alte Fehlgriffe einer Taste + fehlerfreie Runde ⇒ kein „achte auf wenige Fehler\"", () => {
    const r = rueckmeldungFuer({
      introduced: INTRO, letters: mitAltlast(), lernweg: "de", m, rundenOhneTaste: 5, rundeAcc: 1,
    });
    expect(r.satz).not.toMatch(/Fehler|ruhiger/);
  });
  it("auch wenn die Karte auf 100 % RUNDET (1 Fehler in 200 Zeichen)", () => {
    const r = rueckmeldungFuer({
      introduced: INTRO, letters: mitAltlast(), lernweg: "de", m, rundenOhneTaste: 5, rundeAcc: 200 / 201,
    });
    expect(r.satz).not.toMatch(/Fehler|ruhiger/);
  });
  it("englisch genauso", () => {
    const r = rueckmeldungFuer({
      introduced: INTRO, letters: mitAltlast(), lernweg: "de", m, rundenOhneTaste: 5, rundeAcc: 1, lang: "en",
    });
    expect(r.satz).not.toMatch(/mistakes|calmly/);
  });
  it("Gegenprobe: eine Runde MIT Fehlern bekommt den Rat weiter (Janos Fall)", () => {
    const r = rueckmeldungFuer({
      introduced: INTRO, letters: mitAltlast(), lernweg: "de", m, rundenOhneTaste: 5, rundeAcc: 0.93,
    });
    expect(r.satz).toContain("ruhiger");
  });
  it("Tasten ohne einen einzigen Anschlag gelten nicht als ungenau (nach „Womit anfangen?\")", () => {
    const r = rueckmeldungFuer({
      introduced: [...INTRO, "r", "t", "n"], letters: sauber(), lernweg: "de", m, rundenOhneTaste: 5,
    });
    expect(r.satz).not.toMatch(/Fehler|ruhiger/);
  });
});

describe("2 · Die Freischalt-Karte nennt die Reihe", () => {
  it("I: rechter Mittelfinger, obere Reihe", () => {
    expect(unitHowToType("i")).toBe("Es liegt auf der Taste I, rechter Mittelfinger, obere Reihe: vom K aus nach vorne, fast gerade.");
    expect(unitHowToTypeEn("i")).toBe("It is on the I key, right middle finger, top row: from K, forward, almost straight.");
  });
  it("jede Reihe hat ihren Namen", () => {
    expect(unitHowToType("n")).toContain("untere Reihe");
    expect(unitHowToType("g")).toContain("Grundreihe");
    expect(unitHowToType("1")).toContain("Zahlenreihe");
  });
});

describe("2b · … und wohin der Finger geht (Johannes, 25.09. abends)", () => {
  it("gerade, etwas oder schräg - nach vorne oder nach hinten", () => {
    expect(unitHowToType("t")).toContain("vom F aus nach vorne und schräg nach rechts");
    expect(unitHowToType("z")).toContain("vom J aus nach vorne und schräg nach links");
    expect(unitHowToType("n")).toContain("vom J aus nach hinten und etwas nach links");
    expect(unitHowToType("m")).toContain("vom J aus nach hinten und etwas nach rechts");
    expect(unitHowToType("g")).toContain("vom F aus eine Taste nach rechts");
  });
  it("auf der Grundtaste selbst keine Richtung", () => {
    expect(unitHowToType("f")).toBe("Es liegt auf der Taste F, linker Zeigefinger, Grundreihe.");
  });
});

describe("3 · Buchstabensalat", () => {
  it("„Lid\" ist ein Wort und passt in „Linde\"", () => {
    expect(isRealWord("Lid", "de")).toBe(true);
    expect(pruefeSalatwort("Lid", "Linde", [], "de")).toEqual(expect.objectContaining({ ok: true }));
  });
  it("die Beschriftung beginnt mit dem Wort", () => {
    expect(salatFeldbeschriftung("Insel", "de").startsWith("Insel: e i l n s")).toBe(true);
  });
  it("Aufgaben und Quellwort werden nicht bei jedem Neuzeichnen neu gewürfelt", () => {
    // Bis 25.09. stand `waehleSalatwort(formCtx)` (Math.random) im Rendern.
    const quelle = readFileSync("src/components/typing/AdaptiveTrainer.tsx", "utf8");
    expect(quelle).not.toMatch(/const quellwort = waehleSalatwort\(/);
    expect(quelle).toMatch(/useMemo\(\s*\(\) => \(lauf\?\.form\.eigenerBildschirm === "buchstabensalat"/);
  });
});

describe("4 · Die nächsten zwei Tasten", () => {
  it("in der Reihenfolge des Lernwegs", () => {
    const zwei = naechsteTasten(["f", "j", "d", "k", "s", "l", "a", "ö"], "de", 2);
    expect(zwei).toHaveLength(2);
    expect(zwei[0]).toBe("e");
  });
  it("leer, wenn alles gelernt ist", () => {
    const alles = naechsteTasten([], "de", 999);
    expect(naechsteTasten(alles, "de", 2)).toEqual([]);
  });
});
