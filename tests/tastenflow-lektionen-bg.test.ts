/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „bg" (F4-BG, 29.10.2026). Modell: `tests/tastenflow-lektionen-ro.test.ts`.
 * Geprüft auf ALLEN vier Pflicht-Tastaturen (`bg` BDS, `bg-schreibm`, `bg-phon`, `bg-phon-trad`), die Reihenfolge-Regel zusätzlich
 * auf fremden Tastaturen:
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("bg")`; die erste Lektion bringt die Heimzeichen (Falle 41: о т).
 *     Auf `bg-schreibm` fehlen `ѝ „ “ € ` und der Halbgeviertstrich - sie fallen weg, die Lektion `bg-redki` bringt nur `ь`.
 *  2. Eigene Lektionen für Shift (mit `. ,`), die späten Buchstaben `ь ѝ`, Satzzeichen, Ziffern, Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen.
 *  4. Hausregeln (Glossar bg): kein Maus-Wort, keine Вие-Form, kein Geschlecht am Kind, kein Gedankenstrich, kein „слеп",
 *     keine russischen/ukrainischen Buchstaben, kein Wort aus gemischter Schrift, keine deutschen/englischen Wörter; Kinder mit ти.
 *  5. Jedes Beispielwort (zwischen „…“) ist an der Stelle seiner Lektion tippbar - auf jeder Tastatur.
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (BDS gegen Phonetik).
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  introducedThroughLesson,
  lektionenFuer,
  lessonById,
  lessonIntroText,
  shiftUnlockedAt,
  unlockedKeysAt,
  unlockedKeysWith,
  type Lesson,
} from "../src/lib/typing/curriculum";
import { BG_LEKTIONS_IDS, bgLektionsVorspannFuer } from "../src/lib/typing/curriculumBg";
import { fitText } from "../src/lib/typing/corpus";
import { generateRound } from "../src/lib/typing/generator";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { halbePaareIn, halbesPaar } from "./helfer/paareNeueWege";
import { lernwegDef } from "../src/lib/typing/lernweg";

const BG_TASTATUREN: readonly LayoutId[] = ["bg", "bg-schreibm", "bg-phon", "bg-phon-trad"];
const HALBGEVIERT = String.fromCharCode(0x2013);

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

/** Ist das Wort mit diesem Tastenstand tippbar? Ein Grossbuchstabe braucht Shift. */
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  for (const ch of wort) {
    if (ch === " ") continue;
    const c = ch.toLocaleLowerCase("bg");
    if (ch !== c && !stand.has(SHIFT_UNIT)) return false;
    if (!stand.has(c)) return false;
  }
  return true;
}

/** Die Beispielwörter zwischen „…“ - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/„([^“]+)“/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

const bis = (id: string): Set<string> => {
  const s = new Set(unlockedKeysAt(id));
  if (shiftUnlockedAt(id)) s.add(SHIFT_UNIT);
  return s;
};

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „bg“ - auf jeder Tastatur", () => {
  for (const t of [...BG_TASTATUREN, "de", "us"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("bg")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("bg"), introOrder("bg"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("bg");
    const falsch = lektionenFuer("bg").map((l) => (l.id === "bg-glasni" ? { ...l, newKeys: ["е", "с"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("bg")).length).toBeGreaterThan(0);
  });

  it("19 Lektionen auf jeder Tastatur, IDs mit „bg-“, eindeutig, gecacht; keine ID wie eine Tastatur", () => {
    expect(BG_LEKTIONS_IDS).toHaveLength(19);
    expect(new Set(BG_LEKTIONS_IDS).size).toBe(19);
    for (const id of BG_LEKTIONS_IDS) {
      expect(id.startsWith("bg-"), id).toBe(true);
      expect(BG_TASTATUREN, id).not.toContain(id);
    }
    for (const t of BG_TASTATUREN) {
      setLayout(t);
      expect(lektionenFuer("bg").map((l) => l.id), t).toEqual([...BG_LEKTIONS_IDS]);
      expect(lektionenFuer("bg")).toBe(lektionenFuer("bg"));
    }
  });

  it("★ Falle 41: die erste Lektion bringt о т (nicht f j); es sind keine englischen Lektionen mehr", () => {
    setLayout("bg");
    expect(lektionenFuer("bg")[0].newKeys).toEqual([...heimZeichenDesWeges("bg")]);
    expect(lektionenFuer("bg")[0].newKeys).toEqual(["о", "т"]);
    expect(lektionenFuer("bg")[0].id).toBe("bg-osnoven-1");
    expect(lektionenFuer("bg").some((l) => l.id.startsWith("en-"))).toBe(false);
  });

  it("eigene Lektionen: Shift mit . , - späte Buchstaben ь ѝ - Satzzeichen - Ziffern - Symbole", () => {
    setLayout("bg");
    expect(lessonById("bg-glavni")?.enablesShift).toBe(true);
    expect(lessonById("bg-glavni")?.newKeys).toEqual([".", ","]);
    expect(lessonById("bg-redki")?.newKeys).toEqual(["ь", "ѝ"]);
    expect(lessonById("bg-pripinatelni-1")?.newKeys).toEqual(["?", "!", ":", ";"]);
    expect(lessonById("bg-pripinatelni-2")?.newKeys).toEqual(["\"", "„", "“", "-", HALBGEVIERT, "(", ")"]);
    expect(lessonById("bg-cifri")?.newKeys.join("")).toBe("1234567890");
    expect(lessonById("bg-simvoli")?.newKeys).toEqual(["%", "/", "+", "=", "№", "§", "€"]);
    expect(shiftUnlockedAt("bg-glasni")).toBe(false);
    expect(shiftUnlockedAt("bg-glavni")).toBe(true);
    for (const t of BG_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("bg")) expect(new Set(unlockedKeysWith(l.id, undefined, "bg"))).toEqual(new Set(unlockedKeysAt(l.id)));
    }
  });

  it("★ Schreibmaschine: kein ѝ, keine „ “, kein тире, kein € - die Lektionen bleiben, nur die Tasten fallen weg", () => {
    setLayout("bg-schreibm");
    expect(lessonById("bg-redki")?.newKeys).toEqual(["ь"]);
    expect(lessonById("bg-pripinatelni-2")?.newKeys).toEqual(["\"", "-", "(", ")"]);
    expect(lessonById("bg-simvoli")?.newKeys).not.toContain("€");
    expect(lessonById("bg-redki")!.intro).toMatch(/няма клавиш за ѝ/);
    setLayout("bg-phon-trad");
    expect(lessonById("bg-pripinatelni-2")?.newKeys).toEqual(["\"", "-", "(", ")"]);
    expect(lessonById("bg-redki")?.newKeys).toEqual(["ь", "ѝ"]);
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of BG_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("bg")) {
        stand = introducedThroughLesson(stand, l.id, "bg");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "bg").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "bg", lang: "bg", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) {
            if (!z.text.trim() || fitText(z.text, erlaubt, "bg") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
          }
        }
      }
      expect(fehler).toEqual([]);
    }, 120_000);
  }
});

// ★★★ GEN-HAUPTSPRACHE (29.10.2026): scharf geschaltet - die paarfesten Vorlagen (`generator.ts#MIT_ZEICHENVORLAGEN`) kennen „bg“.
// Die Paare sind die des Weges (`paareGemeinsam`, lernweg.ts) und `"` (eine Taste für beide Seiten). Helfer: `tests/helfer/paareNeueWege.ts`.
describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of BG_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      expect(halbePaareIn("bg", t)).toEqual([]);
    }, 120_000);
  }
  it("Gegenprobe: halbe Paare fallen auf, ein ganzes nicht", () => {
    const paare = lernwegDef("bg").paareGemeinsam ?? {};
    expect(["Ти„ дом","(дом","ни \"да","„дом“ (ти)"].filter((z) => halbesPaar(z, paare))).toEqual(["Ти„ дом","(дом","ни \"да"]);
  });
});

describe("★★★ Hausregeln in Titeln und Einführungen", () => {
  const NIE = new Set(["und", "der", "die", "the", "and", "key", "press", "taste", "lesson"]);
  const MUSTER: readonly (readonly [RegExp, string])[] = [
    [/[–—]/, "Gedankenstrich"],
    [/щрак|кликн|мишк|докосн|плъзн/iu, "Maus"],
    [/(?<!\p{L})(натиснете|изберете|опитайте|задръжте|сложете|напишете|вашия|вашата|вашите)(?!\p{L})/iu, "Вие-Form statt ти"],
    [/(?<!\p{L})(написал|написала|готов|готова|сигурен|сигурна|сам|сама|шампион|победител|начинаещ)(?!\p{L})/iu, "Geschlecht am Kind"],
    [/(?<!\p{L})слеп/iu, "„слеп“ (Person zuerst, Regel 3/4)"],
    [/[ыэёіїєґ]/iu, "kein bulgarischer Buchstabe"],
  ];
  /** Jedes Wort ganz kyrillisch oder ganz lateinisch (Regel 15). */
  const gemischt = (text: string): string[] =>
    text.split(/[^\p{L}]+/u).filter((w) => w && !/^\p{Script=Cyrillic}+$/u.test(w) && !/^\p{Script=Latin}+$/u.test(w));

  it("alle Tastaturen: kein Maus-Wort, keine Вие-Form, kein Geschlecht, kein Gedankenstrich, kein Mischwort, keine fremden Wörter", () => {
    const funde: string[] = [];
    for (const t of BG_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("bg"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          for (const [m, was] of MUSTER) if (m.test(text)) funde.push(`${t} ${l.id} ${feld}: ${was}`);
          for (const w of gemischt(text)) funde.push(`${t} ${l.id} ${feld}: Mischwort „${w}"`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("★ Kinder-Anrede ти: die Einführungen sprechen das Kind im Imperativ Einzahl oder in der 2. Person an", () => {
    setLayout("bg");
    const ti = /(?<!\p{L})(натисни|задръж|опитай|сложи|напиши|пишеш|започваш|намираш|можеш|ти|теб|твоята|твоя)(?!\p{L})/iu;
    // Die Lektionen mit einer Anweisung; die übrigen nennen nur Buchstaben, Wörter und Griffe (ohne Verb).
    for (const id of ["bg-osnoven-1", "bg-glavni", "bg-pripinatelni-1", "bg-tekstove"]) expect(ti.test(lessonById(id)!.intro), id).toBe(true);
  });

  it("Gegenprobe: die Muster schlagen an", () => {
    const treffer = (s: string) => MUSTER.filter(([m]) => m.test(s)).map(([, was]) => was);
    expect(treffer("Щракни върху бутона")).toContain("Maus");
    expect(treffer("Натиснете Enter")).toContain("Вие-Form statt ти");
    expect(treffer("Ти си готов")).toContain("Geschlecht am Kind");
    expect(treffer("слепо писане")).toContain("„слеп“ (Person zuerst, Regel 3/4)");
    expect(treffer("a – b")).toContain("Gedankenstrich");
    expect(treffer("Ёж")).toContain("kein bulgarischer Buchstabe");
    expect(treffer("Сложи пръстите на основния ред, натисни клавиша.")).toEqual([]);
    expect(gemischt("тaм")).toEqual(["тaм"]); // lateinisches a mitten im Wort
    expect(gemischt("задръж Shift и натисни Enter")).toEqual([]);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("bg");
    expect(lektionenFuer("bg").flatMap((l) => beispielWoerter(bgLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(70);
  });

  for (const t of BG_TASTATUREN) {
    it(`${t}: jedes Wort zwischen „…“ passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("bg"))
        for (const w of beispielWoerter(bgLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, bis(l.id))) fehler.push(`${l.id}: „${w}“`);
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: ein Wort mit einer späteren Taste, ѝ auf der Schreibmaschine und ein Grossbuchstabe vor Shift fallen auf", () => {
    setLayout("bg");
    expect(wortTippbar("път", bis("bg-bukvi-3"))).toBe(false);
    expect(wortTippbar("път", bis("bg-bukvi-4"))).toBe(true);
    expect(wortTippbar("Мая", bis("bg-glasni"))).toBe(false);
    expect(wortTippbar("Мая", bis("bg-glavni"))).toBe(true);
    expect(wortTippbar("дай ѝ", bis("bg-redki"))).toBe(true);
    setLayout("bg-schreibm");
    expect(wortTippbar("дай ѝ", bis("bg-redki"))).toBe(false);
    expect(beispielWoerter(bgLektionsVorspannFuer("bg-redki", ["ь"]))).not.toContain("дай ѝ");
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("BDS: Komma auf Q (linkes кутре, горен ред), Punkt rechts in der Ziffernreihe - beide ohne Shift", () => {
    setLayout("bg");
    const l = lessonById("bg-glavni")!;
    expect(l.intro).toMatch(/Запетая \(,\): лявото кутре, на горния ред/);
    expect(l.intro).toMatch(/Точка \(\.\): дясното кутре, на реда с цифрите/);
    expect(l.intro).not.toMatch(/Запетая \(,\): задръж Shift/);
  });

  it("Fühlmarken: auf BDS auf О und Т, auf der Phonetik auf Ф und Й - die Texte unterscheiden sich (introByLayout)", () => {
    setLayout("bg");
    const bds = lessonById("bg-osnoven-1")!;
    expect(bds.intro).toMatch(/На клавишите О и Т има малки издатини/);
    expect(bds.intro).toMatch(/О: левият показалец, в изходна позиция/);
    setLayout("bg-phon");
    const phon = lessonById("bg-osnoven-1")!;
    expect(phon.intro).toMatch(/издатините са на клавишите Ф и Й/);
    expect(lessonIntroText(bds, "bg-phon")).toBe(phon.intro);
  });

  it("ѝ: auf BDS die ISO-Taste links unten; Satz- und Sonderzeichen mit Shift aus den Daten; тире nur als Name", () => {
    setLayout("bg");
    expect(lessonById("bg-redki")!.intro).toMatch(/Ѝ \(и с ударение\): лявото кутре, на долния ред/);
    expect(lessonById("bg-pripinatelni-1")!.intro).toMatch(/Въпросителен знак \(\?\): задръж Shift с другата ръка и натисни клавиша 2/);
    expect(lessonById("bg-pripinatelni-2")!.intro).toMatch(/Тире: задръж Shift с другата ръка и натисни клавиша 9/);
    expect(lessonById("bg-simvoli")!.intro).toMatch(/Евро \(€\): задръж Shift с другата ръка и натисни клавиша \./);
    setLayout("bg-phon");
    expect(lessonById("bg-pripinatelni-1")!.intro).toMatch(/Въпросителен знак \(\?\): задръж Shift с другата ръка и натисни клавиша \//);
  });
});
