/**
 * Thema 1 (21.07.): »Individuelles Üben schwacher Zeichen«.
 *
 * Kernanliegen Johannes: Wer an »?« und »,« hakt, soll GENAU diese Zeichen
 * verstärkt üben — und zwar in SINNVOLLEN Sätzen, nicht im Zeichen-Stakkato.
 * Geprüft werden die drei Hebel:
 *   A) Der Drill-Anteil richtet sich nach der Korpus-Dichte (viele echte Sätze
 *      mit »,«/»?« ⇒ echte Sätze; keine mit »§«/»@« ⇒ Drill bleibt).
 *   B) Ein hartnäckiges Satzzeichen bekommt einen EIGENEN Fokus-Platz und
 *      verdrängt keinen wackeligen Buchstaben.
 *   C) Die Drill-Vorlagen sind vielfältiger — und verlangen NIE eine Taste,
 *      die noch nicht freigeschaltet ist.
 */
import { describe, it, expect } from "vitest";
import {
  CHAR_CORPUS_ENOUGH,
  EXTRA_FOCUS_NEED,
  INTRO_ORDER,
  PUNCT_ORDER,
  SHIFT_UNIT,
  adaptiveRound,
  focusUnits,
  needScore,
  weakestLetters,
  type LetterStat,
} from "../src/lib/typing";
import { corpusEntriesFor } from "../src/lib/typing/corpusManifest";

const stat = (hits: number, misses: number, avgMs: number): LetterStat => ({
  hits,
  misses,
  sumMs: avgMs * hits,
  timed: hits,
});
const sitzt = stat(20, 0, 450);
const hakt = stat(6, 6, 900);

/** Alle Einheiten bis einschließlich `unit` (adaptive Reihenfolge). */
function introducedUpTo(unit: string): string[] {
  return INTRO_ORDER.slice(0, INTRO_ORDER.indexOf(unit) + 1);
}

/** Alle Einheiten »sitzen«, nur die genannten haken. */
function statsWith(introduced: string[], weak: string[]): Record<string, LetterStat> {
  const out: Record<string, LetterStat> = {};
  for (const u of introduced) out[u] = weak.includes(u) ? hakt : sitzt;
  return out;
}

/** Wie viele Zeilen einer Runde stammen aus dem echten Korpus (statt Drill)? */
function corpusShare(lines: { text: string; source: number | null }[]): number {
  return lines.filter((l) => l.source !== null).length / lines.length;
}

describe("B — eigener Fokus-Platz für ein hartnäckiges Satzzeichen", () => {
  // Bis »;« — »?« ist damit NICHT mehr die neueste Einheit und muss sich seinen
  // Platz gegen die Buchstaben erkämpfen. Genau Johannes' Fall.
  const intro = introducedUpTo(";");

  it("nimmt »?« dazu, ohne einen wackeligen Buchstaben zu verdrängen", () => {
    // Drei Buchstaben haken SCHLIMMER als »?« → »?« fiel bisher aus den Top-3.
    const miserabel = stat(3, 7, 1400);
    const letters = statsWith(intro, ["?"]);
    for (const c of ["n", "r", "t"]) letters[c] = miserabel;
    const top3 = weakestLetters(intro, letters, "de", 3);
    const focus = focusUnits(intro, letters, "de", 3);

    expect(top3).toEqual(expect.arrayContaining(["n", "r", "t"]));
    expect(top3).not.toContain("?"); // Ausgangslage: verdrängt
    expect(focus).toContain("?"); // jetzt garantiert dabei
    // Die drei Buchstaben-Plätze bleiben unangetastet.
    for (const u of top3) expect(focus).toContain(u);
    expect(focus).toHaveLength(top3.length + 1);
  });

  it("vergibt keinen Zusatzplatz, wenn ohnehin ein Satzzeichen unter den Schwächsten ist", () => {
    // Nur »?« hakt → es steht schon vorn, kein doppelter Schwerpunkt.
    const letters = statsWith(intro, ["?"]);
    const focus = focusUnits(intro, letters, "de", 3);
    expect(focus).toContain("?");
    expect(focus).toEqual(weakestLetters(intro, letters, "de", 3));
  });

  it("vergibt keinen Zusatzplatz, wenn alle Satzzeichen sitzen", () => {
    const letters = statsWith(intro, ["n", "r", "t"]);
    const focus = focusUnits(intro, letters, "de", 3);
    expect(focus).toHaveLength(3);
    for (const p of PUNCT_ORDER) expect(focus).not.toContain(p);
    // Gegenprobe: sitzende Zeichen liegen wirklich unter der Schwelle.
    expect(needScore(sitzt, undefined, "de", ".")).toBeLessThan(EXTRA_FOCUS_NEED);
  });

  it("lässt die Umschalttaste außen vor (kein Satz-/Sonderzeichen)", () => {
    const letters = statsWith(intro, ["n", "r", "t", SHIFT_UNIT]);
    const focus = focusUnits(intro, letters, "de", 3);
    expect(focus.filter((u) => u === SHIFT_UNIT)).toHaveLength(0);
  });
});

describe("A — der Korpus entscheidet über Drill oder echten Satz", () => {
  // Vorbedingung des ganzen Themas: für »,« und »?« liegen wirklich reichlich
  // echte Sätze bereit — sonst wäre die Dichte-Steuerung sinnlos.
  /**
   * ── Was sich am 21.08.2026 geändert hat (Charge I3) ──────────────────────
   * Hier stand bis dahin: für »@«, »§« und »€« gibt es GAR KEINE echten Sätze,
   * gemessen `toBe(0)`. Das war der Stand des deutschen Korpus, nicht ein Ziel:
   * `tests/typing-corpus.test.ts` verbot diese Zeichen im deutschen Bestand
   * überhaupt (Handliste ohne die halbe Tastenstufe T5), und `corpusZahlen.ts`
   * hatte sich freiwillig auf den Basis-Zeichensatz beschränkt.
   *
   * Das Ziffern-Portfolio (I3) liefert jetzt echte Sätze mit »@« (Mail-Adressen)
   * und »§« (Paragrafen-Verweise). Die STEUERUNG, die dieser Test absichert,
   * bleibt davon unberührt und ist der eigentliche Prüfgegenstand: Der
   * Drill-Anteil richtet sich nach `charSupply / CHAR_CORPUS_ENOUGH`. Solange
   * der Vorrat unter dieser Schwelle liegt, trägt der Drill die Runde weiter —
   * genau das wird jetzt gemessen, statt einer Null, die nur ein Zufall des
   * damaligen Bestands war. Für »,« und »?« gilt unverändert das Gegenteil.
   */
  it("hält für »,« und »?« genug echte Sätze vor, für Sonderzeichen zu wenige", () => {
    const bisKomma = new Set(introducedUpTo(","));
    const alles = new Set(INTRO_ORDER);
    const zaehle = (allowed: Set<string>, unit: string) =>
      corpusEntriesFor({ lernweg: "de", stufe: "teens", allowed, lang: "de" }).filter((e) =>
        e.text.includes(unit),
      ).length;

    expect(zaehle(bisKomma, ",")).toBeGreaterThanOrEqual(CHAR_CORPUS_ENOUGH);
    expect(zaehle(new Set(introducedUpTo("?")), "?")).toBeGreaterThanOrEqual(
      CHAR_CORPUS_ENOUGH,
    );
    for (const sym of ["@", "§", "€"])
      expect(
        zaehle(alles, sym),
        `»${sym}«: der Vorrat hat CHAR_CORPUS_ENOUGH erreicht — der Drill ` +
          `trägt die Runde nicht mehr allein; Steuerung neu bewerten`,
      ).toBeLessThan(CHAR_CORPUS_ENOUGH);
  });

  it("übt ein schwaches »,« überwiegend in echten Sätzen MIT Komma", () => {
    const intro = introducedUpTo(",");
    const lines = Array.from({ length: 40 }, () =>
      adaptiveRound({ lernweg: "de", introduced: intro, focus: [","], stufe: "teens", count: 12 }),
    ).flat();

    // Der Großteil der Runde besteht aus echten Bausteinen, nicht aus Drill.
    expect(corpusShare(lines)).toBeGreaterThan(0.6);
    // …und diese Bausteine enthalten ganz überwiegend wirklich ein Komma.
    const korpus = lines.filter((l) => l.source !== null);
    const mitKomma = korpus.filter((l) => l.text.includes(",")).length;
    expect(mitKomma / korpus.length).toBeGreaterThan(0.8);
  });

  it("übt ein schwaches »?« überwiegend in echten Fragen", () => {
    const intro = introducedUpTo("?");
    const lines = Array.from({ length: 40 }, () =>
      adaptiveRound({ lernweg: "de", introduced: intro, focus: ["?"], stufe: "teens", count: 12 }),
    ).flat();

    expect(corpusShare(lines)).toBeGreaterThan(0.6);
    const korpus = lines.filter((l) => l.source !== null);
    expect(korpus.filter((l) => l.text.includes("?")).length / korpus.length).toBeGreaterThan(
      0.8,
    );
  });

  it("bleibt beim Drill, wo der Korpus nichts hergibt (»§«)", () => {
    const lines = Array.from({ length: 40 }, () =>
      adaptiveRound({ lernweg: "de", introduced: [...INTRO_ORDER], focus: ["§"], stufe: "teens", count: 12 }),
    ).flat();
    // Ohne Drill ließe sich »§« gar nicht üben → Drill bleibt der Hauptweg.
    expect(corpusShare(lines)).toBeLessThan(0.4);
    const drill = lines.filter((l) => l.source === null);
    expect(drill.filter((l) => l.text.includes("§")).length / drill.length).toBeGreaterThan(
      0.5,
    );
  });

  it("mischt ohne Zeichen-Fokus nur wenig Drill bei (unverändert)", () => {
    const intro = introducedUpTo(",");
    const lines = Array.from({ length: 40 }, () =>
      adaptiveRound({ lernweg: "de", introduced: intro, focus: ["n"], stufe: "teens", count: 12 }),
    ).flat();
    expect(corpusShare(lines)).toBeGreaterThan(0.7);
  });
});

describe("C — Drill-Vorlagen: vielfältig und immer tippbar", () => {
  it("nutzt für »,« mehrere echte Komma-Verwendungen", () => {
    // ★ D-1 (28.09.2026): „," kommt jetzt direkt nach ⇧ - dort fehlen noch
    // u und o, „und"/„oder" sind nicht tippbar. Die Vielfalt der Vorlagen
    // wird darum am Stand nach allen Buchstaben gemessen (wie vor D-1).
    const intro = introducedUpTo("ß");
    const drill = Array.from({ length: 80 }, () =>
      adaptiveRound({ lernweg: "de", introduced: intro, focus: [","], stufe: "teens", count: 12 }),
    )
      .flat()
      .filter((l) => l.source === null)
      .map((l) => l.text);

    expect(drill.some((t) => / und /.test(t))).toBe(true); // Aufzählung
    expect(drill.some((t) => / oder /.test(t))).toBe(true); // Alternative
    expect(drill.some((t) => /^erst /i.test(t))).toBe(true); // Abfolge
  });

  it("verlangt NIE eine Taste, die noch nicht freigeschaltet ist", () => {
    // Künstlich karger Tastenstand: wenige Buchstaben + Komma. Die festen Wörter
    // der Vorlagen (»und«, »oder«, »erst … dann«) sind hier NICHT tippbar — sie
    // müssen fallen gelassen werden statt gesperrte Tasten zu verlangen.
    const intro = ["f", "j", "d", "k", "a", ","];
    const erlaubt = new Set([...intro, " "]);
    const lines = Array.from({ length: 60 }, () =>
      adaptiveRound({ lernweg: "de", introduced: intro, focus: [","], stufe: "teens", count: 12 }),
    ).flat();

    expect(lines.length).toBeGreaterThan(0);
    for (const l of lines)
      for (const ch of l.text)
        expect(
          erlaubt.has(ch.toLowerCase()),
          `»${ch}« aus »${l.text}« ist noch nicht freigeschaltet`,
        ).toBe(true);
  });

  it("baut die Uhrzeit-Vorlage für »:« erst, wenn Ziffern dran sind", () => {
    // »:« kommt VOR den Ziffern — dann darf keine »9:15 Uhr«-Vorlage entstehen.
    const drill = Array.from({ length: 30 }, () =>
      adaptiveRound({ lernweg: "de", introduced: introducedUpTo(":"), focus: [":"], stufe: "teens", count: 12 }),
    )
      .flat()
      .filter((l) => l.source === null) // nur Drill-Zeilen; Korpus-Sätze dürfen »Uhr« sagen
      .map((l) => l.text);
    expect(drill.length).toBeGreaterThan(0);
    // Uhrzeit-Form ist »9:15 Uhr« (kein Leerzeichen am Doppelpunkt). »Uhr« als
    // gewöhnliches Übungswort ist dagegen völlig in Ordnung.
    expect(drill.some((t) => /\S:\S+ Uhr/.test(t))).toBe(false);
    for (const t of drill) expect(t).not.toMatch(/[0-9]/);
  });
});
