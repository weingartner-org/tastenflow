/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „uk" (F4-UK, 29.10.2026). Modell: `tests/tastenflow-lektionen-ro.test.ts`.
 * Geprüft auf BEIDEN Pflicht-Tastaturen (`ua` Українська розширена = Bezug, `ua-std`), die Reihenfolge-Regel zusätzlich auf
 * fremden Tastaturen:
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("uk")`; die erste Lektion bringt die Heimzeichen (Falle 41: а о).
 *     Auf `ua-std` fehlen Apostroph und `₴` (Bauplan U2) - die Lektion `uk-apostrof` bringt dort nur `ґ`.
 *  2. Eigene Lektionen für Shift (mit `. ,`), Apostroph und ґ, Satzzeichen, Ziffern, Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen.
 *  4. Hausregeln (Glossar uk): kein Maus-Wort, keine ви-Form, kein Geschlecht am Kind, keine Russismen, keine russischen
 *     Buchstaben, kein Gedankenstrich, kein „сліп", kein Wort aus gemischter Schrift, Apostroph nur U+0027; Kinder mit ти.
 *  5. Jedes Beispielwort (zwischen «…») ist an der Stelle seiner Lektion tippbar - auf beiden Tastaturen.
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet.
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
import { UK_LEKTIONS_IDS, ukLektionsVorspannFuer } from "../src/lib/typing/curriculumUk";
import { fitText } from "../src/lib/typing/corpus";
import { generateRound } from "../src/lib/typing/generator";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { halbePaareIn, halbesPaar } from "./helfer/paareNeueWege";
import { lernwegDef } from "../src/lib/typing/lernweg";

const UK_TASTATUREN: readonly LayoutId[] = ["ua", "ua-std"];

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

/** Ist das Wort mit diesem Tastenstand tippbar? Ein Grossbuchstabe braucht Shift; й ї sind eigene Buchstaben (NFC). */
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  for (const ch of wort.normalize("NFC")) {
    if (ch === " ") continue;
    const c = ch.toLocaleLowerCase("uk");
    if (ch !== c && !stand.has(SHIFT_UNIT)) return false;
    if (!stand.has(c)) return false;
  }
  return true;
}

/** Die Beispielwörter zwischen «…» - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/«([^»]+)»/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

const bis = (id: string): Set<string> => {
  const s = new Set(unlockedKeysAt(id));
  if (shiftUnlockedAt(id)) s.add(SHIFT_UNIT);
  return s;
};

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „uk“ - auf jeder Tastatur", () => {
  for (const t of [...UK_TASTATUREN, "de", "us"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("uk")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("uk"), introOrder("uk"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("ua");
    const falsch = lektionenFuer("uk").map((l) => (l.id === "uk-chasti-1" ? { ...l, newKeys: ["е", "я"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("uk")).length).toBeGreaterThan(0);
  });

  it("19 Lektionen auf jeder Tastatur, IDs mit „uk-“, eindeutig, gecacht", () => {
    expect(UK_LEKTIONS_IDS).toHaveLength(19);
    expect(new Set(UK_LEKTIONS_IDS).size).toBe(19);
    for (const id of UK_LEKTIONS_IDS) expect(id.startsWith("uk-"), id).toBe(true);
    for (const t of UK_TASTATUREN) {
      setLayout(t);
      expect(lektionenFuer("uk").map((l) => l.id), t).toEqual([...UK_LEKTIONS_IDS]);
      expect(lektionenFuer("uk")).toBe(lektionenFuer("uk"));
    }
  });

  it("★ Falle 41: die erste Lektion bringt а о (nicht f j); es sind keine englischen Lektionen mehr", () => {
    setLayout("ua");
    expect(lektionenFuer("uk")[0].newKeys).toEqual([...heimZeichenDesWeges("uk")]);
    expect(lektionenFuer("uk")[0].newKeys).toEqual(["а", "о"]);
    expect(lektionenFuer("uk")[0].id).toBe("uk-osnova-1");
    expect(lektionenFuer("uk").some((l) => l.id.startsWith("en-"))).toBe(false);
  });

  it("eigene Lektionen: Shift mit . , - Apostroph und ґ - Satzzeichen - Ziffern - Symbole", () => {
    setLayout("ua");
    expect(lessonById("uk-velyki")?.enablesShift).toBe(true);
    expect(lessonById("uk-velyki")?.newKeys).toEqual([".", ","]);
    expect(lessonById("uk-apostrof")?.newKeys).toEqual(["'", "ґ"]);
    expect(lessonById("uk-rozdilovi")?.newKeys).toEqual(["?", "!", "\"", ":", ";", "-", "(", ")"]);
    expect(lessonById("uk-tsyfry")?.newKeys.join("")).toBe("1234567890");
    expect(lessonById("uk-symvoly")?.newKeys).toEqual(["%", "/", "+", "=", "*", "_", "№", "₴"]);
    expect(shiftUnlockedAt("uk-chasti-2")).toBe(false);
    expect(shiftUnlockedAt("uk-velyki")).toBe(true);
    for (const t of UK_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("uk")) expect(new Set(unlockedKeysWith(l.id, undefined, "uk"))).toEqual(new Set(unlockedKeysAt(l.id)));
    }
  });

  it("★ Bauplan U2: auf `ua-std` kein Apostroph und kein ₴ - die Lektion bleibt, ihr Text sagt es", () => {
    setLayout("ua-std");
    expect(lessonById("uk-apostrof")?.newKeys).toEqual(["ґ"]);
    expect(lessonById("uk-symvoly")?.newKeys).not.toContain("₴");
    expect(lessonById("uk-apostrof")!.intro).toMatch(/На цій розкладці немає апострофа/);
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of UK_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("uk")) {
        stand = introducedThroughLesson(stand, l.id, "uk");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "uk").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "uk", lang: "uk", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) {
            if (!z.text.trim() || fitText(z.text, erlaubt, "uk") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
          }
        }
      }
      expect(fehler).toEqual([]);
    }, 120_000);
  }
});

// ★★★ GEN-HAUPTSPRACHE (29.10.2026): scharf geschaltet - die paarfesten Vorlagen (`generator.ts#MIT_ZEICHENVORLAGEN`) kennen „uk“.
// Die Paare sind die des Weges (`paareGemeinsam`, lernweg.ts) und `"` (eine Taste für beide Seiten). Helfer: `tests/helfer/paareNeueWege.ts`.
describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of UK_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      expect(halbePaareIn("uk", t)).toEqual([]);
    }, 120_000);
  }
  it("Gegenprobe: halbe Paare fallen auf, ein ganzes nicht", () => {
    const paare = lernwegDef("uk").paareGemeinsam ?? {};
    expect(["Дім( так","(дім","та \"не","(дім) та \"не\""].filter((z) => halbesPaar(z, paare))).toEqual(["Дім( так","(дім","та \"не"]);
  });
});

describe("★★★ Hausregeln in Titeln und Einführungen", () => {
  const NIE = new Set(["und", "der", "die", "the", "and", "key", "press", "taste", "lesson"]);
  const MUSTER: readonly (readonly [RegExp, string])[] = [
    [/[–—]/, "Gedankenstrich"],
    [/клацн|мишк|мишею|торкн|перетягн/iu, "Maus"],
    [/(?<!\p{L})(натисніть|виберіть|спробуйте|тримайте|покладіть|друкуйте|ваш|ваша|вашу|ваші)(?!\p{L})/iu, "ви-Form statt ти"],
    [/(?<!\p{L})(зробив|зробила|готовий|готова|радий|переможець|переможниця|початківець|учень|учениця)(?!\p{L})/iu, "Geschlecht am Kind"],
    [/(?<!\p{L})(настройк\p{L}*|слідуюч\p{L}*|являється|вірно|задача|відмінити|получити)(?!\p{L})/iu, "Russismus (Regel 14)"],
    [/(?<!\p{L})сліп/iu, "„сліп“ (Person zuerst, Regel 3/4)"],
    [/[ыэёъ]/iu, "russischer Buchstabe"],
    [/[ʼ’]/u, "Apostroph nicht U+0027"],
  ];
  /** Jedes Wort ganz kyrillisch oder ganz lateinisch; der Apostroph gehört zum Wort (м'яч). */
  const gemischt = (text: string): string[] =>
    text.split(/[^\p{L}']+/u).map((w) => w.replace(/^'+|'+$/g, "")).filter((w) => w && !/^[\p{Script=Cyrillic}']+$/u.test(w) && !/^\p{Script=Latin}+$/u.test(w));

  it("beide Tastaturen: kein Maus-Wort, keine ви-Form, kein Geschlecht, kein Russismus, kein Mischwort, keine fremden Wörter", () => {
    const funde: string[] = [];
    for (const t of UK_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("uk"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          for (const [m, was] of MUSTER) if (m.test(text)) funde.push(`${t} ${l.id} ${feld}: ${was}`);
          for (const w of gemischt(text)) funde.push(`${t} ${l.id} ${feld}: Mischwort „${w}"`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("★ Kinder-Anrede ти: die Einführungen sprechen das Kind im Imperativ Einzahl oder in der 2. Person an", () => {
    setLayout("ua");
    const ty = /(?<!\p{L})(натисни|тримай|поклади|спробуй|вибери|друкуєш|починаєш|знаходиш|ти|тебе|твоя|твоїй)(?!\p{L})/iu;
    // Die Lektionen mit einer Anweisung; die übrigen nennen nur Buchstaben, Wörter und Griffe (ohne Verb).
    for (const id of ["uk-osnova-1", "uk-velyki", "uk-rozdilovi", "uk-teksty"]) expect(ty.test(lessonById(id)!.intro), id).toBe(true);
  });

  it("Gegenprobe: die Muster schlagen an", () => {
    const treffer = (s: string) => MUSTER.filter(([m]) => m.test(s)).map(([, was]) => was);
    expect(treffer("Клацни на кнопку")).toContain("Maus");
    expect(treffer("Натисніть Enter")).toContain("ви-Form statt ти");
    expect(treffer("Ти готовий?")).toContain("Geschlecht am Kind");
    expect(treffer("Відкрий настройки")).toContain("Russismus (Regel 14)");
    expect(treffer("сліпий друк")).toContain("„сліп“ (Person zuerst, Regel 3/4)");
    expect(treffer("Ёлка")).toContain("russischer Buchstabe");
    expect(treffer("мʼяч")).toContain("Apostroph nicht U+0027");
    expect(treffer("a – b")).toContain("Gedankenstrich");
    expect(treffer("Поклади пальці на основний ряд, натисни клавішу.")).toEqual([]);
    expect(gemischt("мaма")).toEqual(["мaма"]); // lateinisches a mitten im Wort
    expect(gemischt("м'яч, тримай клавішу Shift")).toEqual([]);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("ua");
    expect(lektionenFuer("uk").flatMap((l) => beispielWoerter(ukLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(60);
  });

  for (const t of UK_TASTATUREN) {
    it(`${t}: jedes Wort zwischen «…» passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("uk"))
        for (const w of beispielWoerter(ukLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, bis(l.id))) fehler.push(`${l.id}: «${w}»`);
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: ein Wort mit einer späteren Taste, der Apostroph auf `ua-std` und ein Grossbuchstabe vor Shift fallen auf", () => {
    setLayout("ua");
    expect(wortTippbar("кіт", bis("uk-litery-1"))).toBe(false);
    expect(wortTippbar("кіт", bis("uk-litery-2"))).toBe(true);
    expect(wortTippbar("Олена", bis("uk-chasti-2"))).toBe(false);
    expect(wortTippbar("Олена", bis("uk-velyki"))).toBe(true);
    expect(wortTippbar("м'яч", bis("uk-apostrof"))).toBe(true);
    setLayout("ua-std");
    expect(wortTippbar("м'яч", bis("uk-apostrof"))).toBe(false);
    expect(beispielWoerter(ukLektionsVorspannFuer("uk-apostrof", ["ґ"]))).not.toContain("м'яч");
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("а и о sind die Heimtasten der Zeigefinger; П und Р gleich daneben", () => {
    setLayout("ua");
    expect(lessonById("uk-osnova-1")!.intro).toMatch(/А: лівий вказівний палець, основне положення/);
    expect(lessonById("uk-osnova-4")!.intro).toMatch(/П: лівий вказівний палець, праворуч від клавіші А/);
  });

  it("Komma: Shift + Punkt-Taste (Bauplan U4), der Punkt rechts unten ohne Shift", () => {
    setLayout("ua");
    const l = lessonById("uk-velyki")!;
    expect(l.intro).toMatch(/Крапка \(\.\): правий мізинець, у нижньому ряду/);
    expect(l.intro).toMatch(/Кома \(,\): тримай клавішу Shift другою рукою і натисни клавішу \./);
  });

  it("Apostroph: auf `ua` die Taste links der 1; auf `ua-std` steht ein anderer Text (introByLayout)", () => {
    setLayout("ua");
    const ua = lessonById("uk-apostrof")!;
    expect(ua.intro).toMatch(/Апостроф \('\): лівий мізинець, у ряду цифр/);
    setLayout("ua-std");
    const std = lessonById("uk-apostrof")!;
    expect(std.intro).not.toMatch(/Апостроф \('\):/);
    expect(lessonIntroText(ua, "ua-std")).toBe(std.intro);
  });
});
