/**
 * ★★★ WÄCHTER O-INHALT-EL (29.10.2026): die Rate-Wörter der Polarstation auf Weg „el" (`expedition/wordsEl.ts`).
 * Vorbild: `tests/tastenflow-expedition-cs.test.ts`.
 *
 * Bis hierher zog Weg „el" den ENGLISCHEN Vorrat - auf der griechischen Tastatur ist keines dieser Wörter tippbar, die Station blieb
 * leer. ★ O2-TASTATUR (30.10.2026): Wörter mit Tonos gehören dazu (zwei Anschläge, `typableWord` fragt `totastenBuchstabeFrei`).
 * Geprüft: Form und Hausregeln, und an jeder Sprosse ab ι, dass die Station drei tippbare griechische Wörter findet - auf allen drei
 * griechischen Tastaturen -, und dass vor der Tonos-Taste kein Wort mit Tonos kommt.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { masteryFor, type FloeCourse } from "@/lib/typing";
import { ExpeditionStage } from "@/components/typing/expedition/ExpeditionStage";
import { WORDS_EN, rateWortSprache, stationGuessWords } from "@/lib/typing/expedition/words";
import { WORDS_EL_EXPEDITION } from "@/lib/typing/expedition/wordsEl";
import { WORDS_EL, STUFE_VOCAB_EL } from "@/lib/typing/wordsEl";
import { lernwegDef } from "@/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { gesperrtEl } from "@/lib/typing/sperrlisteEl";

const LISTE = WORDS_EL_EXPEDITION;
/** Rate-Buchstaben: griechisch klein mit EINER Taste ohne Umschalt - α-ω (mit ς). */
const RATE_BUCHSTABE = /^[α-ω]$/;
/** Die Wörter: α-ω, dazu die sieben Vokale mit Tonos (zwei Anschläge) - keine Dialytika, kein lateinischer Doppelgänger. */
const FORM = /^[α-ωάέήίόύώ]{2,6}$/;
/** Ein Vokal mit Tonos ist frei, sobald die Totaste UND der Vokal gelernt sind. */
const mitStandTippbar = (w: string, erlaubt: Set<string>) =>
  [...w].every((c) => erlaubt.has(c) || (/[άέήίόύώ]/.test(c) && erlaubt.has("΄") && erlaubt.has(c.normalize("NFD")[0])));

/** Eigenwissen [G]: Wörter, die der Übungswortschatz (fast nur Wörter mit Tonos) nicht trägt - Lehnwörter, Buchstabennamen, Einsilber. */
const EIGENWISSEN = new Set<string>([
  "πιο", "πια", "μπαρ", "ροκ", "ραπ", "νους", "μυς", "δρυς", "ντους", "φλας", "για", "γκρι", "μοβ", "ζεν", "τζιν", "ψι", "πι",
  "μι", "νι", "ρο", "ταυ", "χι", "δυο", "μια", "στοπ",
]);

afterEach(() => setLayout("de"));

describe("★ WORDS_EL_EXPEDITION: Form und Hausregeln", () => {
  it("mindestens 250 Wörter, davon rund sechzig ohne Tonos für die Sprossen davor, jedes nur einmal", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(250);
    expect(LISTE.filter((w) => !/[άέήίόύώ]/.test(w)).length).toBeGreaterThanOrEqual(55);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
  });

  it("klein, 2 bis 6 Zeichen, nur α-ω und Vokale mit Tonos (keine Dialytika, kein lateinischer Doppelgänger)", () => {
    expect(LISTE.filter((w) => !FORM.test(w))).toEqual([]);
  });

  it("keine zwei Wörter mit denselben Buchstaben", () => {
    const gesehen = new Map<string, string>();
    const doppelt: string[] = [];
    for (const w of LISTE) {
      const k = [...w].sort().join("");
      if (gesehen.has(k)) doppelt.push(`${gesehen.get(k)}/${w}`);
      gesehen.set(k, w);
    }
    expect(doppelt).toEqual([]);
  });

  it("keine Sperrwörter", () => {
    expect(LISTE.filter((w) => gesperrtEl(w))).toEqual([]);
  });

  it("Gegenprobe: Dialytika, Grossbuchstabe, lateinisches o fallen auf", () => {
    expect(["φώς", "ϊδ", "Φως", "φoς", "φως"].filter((w) => !FORM.test(w))).toEqual(["ϊδ", "Φως", "φoς"]);
  });

  it("jedes Wort ist ein griechisches Wort: Übungswortschatz des Weges oder (benannt) Eigenwissen", () => {
    const basis = new Set([...WORDS_EL, ...Object.values(STUFE_VOCAB_EL).flat()].map((w) => w.toLowerCase()));
    expect(LISTE.filter((w) => !basis.has(w) && !EIGENWISSEN.has(w))).toEqual([]);
    expect([...EIGENWISSEN].filter((w) => !LISTE.includes(w) || basis.has(w))).toEqual([]);
  });

  it("nichts aus dem englischen Vorrat (der alte Rückfall)", () => {
    expect(LISTE.filter((w) => WORDS_EN.includes(w))).toEqual([]);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „el“ nur aus der griechischen Liste", () => {
  const el = new Set(LISTE);
  for (const tastatur of ["el", "el-220", "el-319"] as const) {
    it(`${tastatur}: ab „ι“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("el");
      const fehler: string[] = [];
      for (let n = reihenfolge.indexOf("ι") + 1; n <= reihenfolge.length; n++) {
        const stand = reihenfolge.slice(0, n);
        const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
        for (const seed of [0, 5, 17]) {
          const woerter = stationGuessWords(stand, { lernweg: "el", seed });
          if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
          for (const w of woerter) {
            if (!el.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
            if (!mitStandTippbar(w, erlaubt)) fehler.push(`${n}: „${w}" nicht tippbar`);
          }
        }
      }
      expect(fehler).toEqual([]);
    });
  }

  it("jede Sprosse ab „ι“ bringt mindestens drei eigene Wörter, seit Wörter mit Tonos dazugehören (ausser die benannt dünnen)", () => {
    const buchstaben = lernwegDef("el").letterOrder.filter((u) => RATE_BUCHSTABE.test(u));
    const duenn: string[] = [];
    for (let i = buchstaben.indexOf("ι"); i < buchstaben.length; i++) {
      const vorher = new Set(buchstaben.slice(0, i));
      vorher.add("΄");
      const neu = buchstaben[i];
      const ohneTonos = (w: string) => w.normalize("NFD").replace(/\p{M}+/gu, "");
      const anzahl = LISTE.filter((w) => ohneTonos(w).includes(neu) && [...ohneTonos(w)].every((c) => c === neu || vorher.has(c))).length;
      if (anzahl < 3) duenn.push(`${neu}: ${anzahl}`);
    }
    expect(duenn).toEqual([]);
  });

  it("★★★ vor der Tonos-Taste kommt kein Wort mit Tonos; danach kommen sie", () => {
    setLayout("el");
    const reihenfolge = introOrder("el");
    const tonos = reihenfolge.indexOf("΄");
    for (let n = reihenfolge.indexOf("ι") + 1; n <= tonos; n++) {
      for (const seed of [0, 5, 17, 23]) {
        const woerter = stationGuessWords(reihenfolge.slice(0, n), { lernweg: "el", seed });
        expect(woerter.filter((w) => /[άέήίόύώ]/.test(w))).toEqual([]);
      }
    }
    const spaeter = new Set<string>();
    for (let seed = 0; seed < 40; seed++) for (const w of stationGuessWords(reihenfolge, { lernweg: "el", seed })) spaeter.add(w);
    expect([...spaeter].filter((w) => /[άέήίόύώ]/.test(w)).length).toBeGreaterThan(0);
  });

  it("nichts wird grossgeschrieben; die Stimme des gelösten Wortes ist Griechisch", () => {
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...lernwegDef("el").introOrder], { lernweg: "el", seed, shiftLearned: true })) expect(w).toBe(w.toLowerCase());
    expect(rateWortSprache("el")).toBe("el");
  });
});

describe("★★★ die Station selbst: ein Buchstabe mit Tonos sind zwei Anschläge, die Totaste kostet nichts", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("Dead, dann ά löst den ersten Buchstaben; die Totaste ist kein Fehlgriff", () => {
    setLayout("el");
    masteryFor("normal");
    const course: FloeCourse = { stages: [{ kind: "station", units: ["άλλο"] }] };
    render(<ExpeditionStage open onClose={vi.fn()} course={course} free isAdult={false} noTimePressure={false} letters={{}} mastery={masteryFor("normal")} onWin={vi.fn()} lernweg="el" />);
    const feld = screen.getByRole("application");
    const herzen = () => [...document.body.querySelectorAll(".px-hud__heart")].filter((h) => h.textContent === "❤️").length;
    const vorher = herzen();
    act(() => void fireEvent.keyDown(feld, { key: "Dead", code: "Semicolon" }));
    expect(herzen()).toBe(vorher);
    act(() => void fireEvent.keyDown(feld, { key: "ά", code: "KeyA" }));
    expect(herzen()).toBe(vorher);
    expect(document.body.textContent).toContain("ά");
    // Gegenprobe: ein falscher Buchstabe kostet wirklich ein Herz (sonst prüft dieser Wächter nichts).
    act(() => void fireEvent.keyDown(feld, { key: "ψ", code: "KeyC" }));
    expect(herzen()).toBe(vorher - 1);
  });
});
