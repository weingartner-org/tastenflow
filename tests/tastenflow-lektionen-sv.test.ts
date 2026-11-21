/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „sv" (Schwedisch, F4-SV, 29.10.2026). Modell: `tests/tastenflow-lektionen-cs.test.ts`.
 * Geprüft auf der Pflicht-Tastatur `sv`, die Reihenfolge-Regel zusätzlich auf fremden Tastaturen:
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("sv")`; die erste Lektion bringt die Heimzeichen (Falle 41).
 *  2. Eigene Lektionen für å ä ö (je in ihrer Stufe), Shift, `. ,`, den Akut (Totaste, Ziel é), die Ziffern, die Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen.
 *  4. Hausregeln: kein Maus-Wort, kein „Ni" als Höflichkeit, nie „skriva blint", keine Abkürzungen, å ä ö nie „a med ring", kein Gedankenstrich.
 *  5. Jedes Beispielwort (zwischen "…") ist an der Stelle seiner Lektion tippbar - gemessen mit `fitText`, also mit Totaste UND Vokal.
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (Totaste, Shift, Alt Gr).
 *
 * ⚠️ Die Übungszeilen kommen bis zum Wortschatz (Etappe D) aus dem englischen Rückfall - der Wächter „keine fremden Wörter in den
 * Zeilen" (cs §4) gehört zur Etappe D.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  introducedThroughLesson,
  lektionenFuer,
  lessonById,
  shiftUnlockedAt,
  unlockedKeysAt,
  unlockedKeysWith,
  type Lesson,
} from "../src/lib/typing/curriculum";
import { SV_LEKTIONS_IDS, svLektionsVorspannFuer } from "../src/lib/typing/curriculumSv";
import { fitText } from "../src/lib/typing/corpus";
import { generateRound } from "../src/lib/typing/generator";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { halbePaareIn, halbesPaar } from "./helfer/paareNeueWege";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { allowedFromIntroduced } from "../src/lib/typing/serien";

const WEG = "sv" as const;
const TASTATUREN: readonly LayoutId[] = ["sv"];

afterEach(() => setLayout("de"));

function einheiten(l: Lesson): string[] {
  return l.enablesShift ? [SHIFT_UNIT, ...l.newKeys] : [...l.newKeys];
}

function folgtDerReihenfolge(lektionen: readonly Lesson[], reihenfolge: readonly string[]): string[] {
  const fehler: string[] = [];
  let i = 0;
  for (const l of lektionen)
    for (const u of einheiten(l)) {
      if (reihenfolge[i] !== u) fehler.push(`${l.id}: „${u}" an Stelle ${i + 1}, dran wäre „${reihenfolge[i]}"`);
      i += 1;
    }
  if (i !== reihenfolge.length) fehler.push(`${i} Einheiten in den Lektionen, ${reihenfolge.length} in der Reihenfolge`);
  return fehler;
}

/** Der Tastenstand nach einer Lektion (mit ⇧, sobald freigeschaltet). */
const bis = (id: string): string[] => [...unlockedKeysAt(id), ...(shiftUnlockedAt(id) ? [SHIFT_UNIT] : [])];

/**
 * Ist das Wort an dieser Stelle tippbar? Wie das Programm selbst rechnet (`fitText`, Totaste + Vokal) - und ein Grossbuchstabe erst
 * mit ⇧ (vorher schreibt ihn Tastenflow für das Kind, `fitText` liesse ihn durch).
 */
const tippbar = (wort: string, stand: readonly string[]): boolean =>
  fitText(wort, allowedFromIntroduced([...stand], WEG), WEG, WEG) === wort && (wort === wort.toLocaleLowerCase(WEG) || stand.includes(SHIFT_UNIT));

/** Die Beispielwörter zwischen geraden Anführungszeichen - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „sv“ - auf jeder Tastatur", () => {
  for (const t of [...TASTATUREN, "de", "us"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("sv")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer(WEG), introOrder(WEG))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("sv");
    const falsch = lektionenFuer(WEG).map((l) => (l.id === "sv-vanliga-1" ? { ...l, newKeys: ["e", "r"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder(WEG)).length).toBeGreaterThan(0);
  });

  it("21 Lektionen, IDs mit „sv-“, eindeutig, gecacht; es sind keine englischen Lektionen mehr", () => {
    expect(SV_LEKTIONS_IDS).toHaveLength(21);
    expect(new Set(SV_LEKTIONS_IDS).size).toBe(21);
    for (const id of SV_LEKTIONS_IDS) expect(id.startsWith("sv-"), id).toBe(true);
    setLayout("sv");
    expect(lektionenFuer(WEG).map((l) => l.id)).toEqual([...SV_LEKTIONS_IDS]);
    expect(lektionenFuer(WEG)).toBe(lektionenFuer(WEG));
    expect(lektionenFuer(WEG).some((l) => l.id.startsWith("en-"))).toBe(false);
  });

  it("★ Falle 41: die erste Lektion bringt die Heimzeichen der Haupttastatur", () => {
    setLayout("sv");
    expect(lektionenFuer(WEG)[0].newKeys).toEqual([...heimZeichenDesWeges(WEG)]);
  });

  it("eigene Lektionen: ö in der Grundreihe, ä vor ⇧, å danach, Shift, . ,, der Akut, Ziffern, Symbole", () => {
    setLayout("sv");
    expect(lessonById("sv-grund-4")?.newKeys).toEqual(["a", "ö"]);
    expect(lessonById("sv-vanliga-2")?.newKeys).toEqual(["ä", "r"]);
    expect(lessonById("sv-versaler")?.enablesShift).toBe(true);
    expect(lessonById("sv-skiljetecken-1")?.newKeys).toEqual([".", ","]);
    expect(lessonById("sv-bokstaver-3")?.newKeys).toEqual(["å", "p"]);
    expect(lessonById("sv-accent")?.newKeys).toEqual(["´"]);
    expect(lessonById("sv-siffror")?.newKeys.join("")).toBe("1234567890");
    expect(shiftUnlockedAt("sv-vanliga-4")).toBe(false);
    expect(shiftUnlockedAt("sv-versaler")).toBe(true);
    for (const l of lektionenFuer(WEG)) expect(new Set(unlockedKeysWith(l.id, undefined, WEG))).toEqual(new Set(unlockedKeysAt(l.id)));
  });

  it("auf einer Tastatur ohne å ä ö (us) fallen sie weg - die IDs bleiben", () => {
    setLayout("us");
    expect(lektionenFuer(WEG).map((l) => l.id)).toEqual([...SV_LEKTIONS_IDS]);
    expect(lessonById("sv-grund-4")?.newKeys).toEqual(["a"]);
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer(WEG)) {
        stand = introducedThroughLesson(stand, l.id, WEG);
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, WEG).filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: WEG, lang: WEG, introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) if (!z.text.trim() || fitText(z.text, erlaubt, WEG) === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
        }
      }
      expect(fehler).toEqual([]);
    }, 120_000);
  }
});

// ★★★ GEN-HAUPTSPRACHE (29.10.2026): scharf geschaltet - die paarfesten Vorlagen (`generator.ts#MIT_ZEICHENVORLAGEN`) kennen „sv“.
// Die Paare sind die des Weges (`paareGemeinsam`, lernweg.ts) und `"` (eine Taste für beide Seiten). Helfer: `tests/helfer/paareNeueWege.ts`.
describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      expect(halbePaareIn("sv", t)).toEqual([]);
    }, 120_000);
  }
  it("Gegenprobe: halbe Paare fallen auf, ein ganzes nicht", () => {
    const paare = lernwegDef("sv").paareGemeinsam ?? {};
    expect(["Undrar( nära","(hus","det \"är","(hus) det \"är\""].filter((z) => halbesPaar(z, paare))).toEqual(["Undrar( nära","(hus","det \"är"]);
  });
});

describe("★★★ Hausregeln in Titeln und Einführungen", () => {
  const NIE = new Set(["und", "der", "die", "the", "and", "key", "press", "touche", "tecla", "tasto", "klávesa", "taste"]);
  const MUSTER: readonly (readonly [RegExp, string])[] = [
    [/[–—]/, "Gedankenstrich"],
    [/(?<!\p{L})(klicka|klickar|dra|peka|mus)(?!\p{L})/iu, "Maus"],
    [/(?<!\p{L})(Ni|Er|Eder)(?!\p{L})/u, "„Ni“ als Höflichkeitsform"],
    [/skriva blint|blindskriv|(?<!\p{L})(de blinda|synskadad)(?!\p{L})/iu, "„blind“ für das Zehnfingersystem oder die Person"],
    [/(?<!\p{L})(t\.ex|bl\.a|o\.s\.v|m\.m|kl)\./iu, "Abkürzung"],
    [/med ring|med prickar|omljud/iu, "å ä ö als „a mit Zeichen“"],
  ];

  it("kein Maus-Wort, kein „Ni“, nie „skriva blint“, keine Abkürzungen, kein Gedankenstrich, keine fremden Wörter", () => {
    const funde: string[] = [];
    for (const t of TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer(WEG))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          for (const [m, was] of MUSTER) if (m.test(text)) funde.push(`${t} ${l.id} ${feld}: ${was}`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("Gegenprobe: die Muster schlagen an", () => {
    const treffer = (s: string) => MUSTER.filter(([m]) => m.test(s)).map(([, was]) => was);
    expect(treffer("Klicka på knappen")).toContain("Maus");
    expect(treffer("Ni kan välja")).toContain("„Ni“ als Höflichkeitsform");
    expect(treffer("lär dig skriva blint")).toContain("„blind“ für das Zehnfingersystem oder die Person");
    expect(treffer("till exempel t.ex. så")).toContain("Abkürzung");
    expect(treffer("a med ring")).toContain("å ä ö als „a mit Zeichen“");
    expect(treffer("a – b")).toContain("Gedankenstrich");
    expect(treffer("Tryck på Skift med andra handen.")).toEqual([]);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("sv");
    expect(lektionenFuer(WEG).flatMap((l) => beispielWoerter(svLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(70);
  });

  for (const t of TASTATUREN) {
    it(`${t}: jedes Wort zwischen "…" passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer(WEG))
        for (const w of beispielWoerter(svLektionsVorspannFuer(l.id, l.newKeys))) if (!tippbar(w, bis(l.id))) fehler.push(`${l.id}: "${w}"`);
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: é vor dem Akut, å vor seiner Lektion und ein Grossbuchstabe vor Shift fallen auf", () => {
    setLayout("sv");
    expect(tippbar("idé", bis("sv-ovanliga"))).toBe(false);
    expect(tippbar("idé", bis("sv-accent"))).toBe(true);
    expect(tippbar("på", bis("sv-bokstaver-2"))).toBe(false);
    expect(tippbar("på", bis("sv-bokstaver-3"))).toBe(true);
    expect(tippbar("Anna", bis("sv-vanliga-4"))).toBe(false);
    expect(tippbar("Anna", bis("sv-versaler"))).toBe(true);
  });
});

describe("★★ Griffe (gerechnet, nicht geschrieben)", () => {
  it("ö ist die achte Grundtaste; ä liegt rechts daneben", () => {
    setLayout("sv");
    expect(lessonById("sv-grund-4")!.intro).toMatch(/Ö: höger lillfinger, grundställning/);
    expect(lessonById("sv-vanliga-2")!.intro).toMatch(/Ä: höger lillfinger, till höger om tangenten Ö/);
  });

  it("der Akut: eigene Taste in der Sifferraden, „död tangent“, Ziel é", () => {
    setLayout("sv");
    expect(lessonById("sv-accent")!.intro).toMatch(/akut accent \(´\): höger lillfinger, sifferraden.*Det är en död tangent/);
    expect(lessonById("sv-accent")!.intro).toMatch(/\(é\)/);
  });

  it("Satz- und Sonderzeichen: der Name vor dem Zeichen; Skift bzw. Alt Gr aus den Daten", () => {
    setLayout("sv");
    expect(lessonById("sv-skiljetecken-2")!.intro).toMatch(/frågetecken \(\?\): håll ned Skift med andra handen och tryck på tangenten \+/);
    expect(lessonById("sv-tecken-2")!.intro).toMatch(/snabel-a \(@\): håll ned Alt Gr och tryck på tangenten 2/);
  });
});
