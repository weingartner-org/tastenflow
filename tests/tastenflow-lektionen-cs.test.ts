/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „cs" (CS-W, 09.10.2026). Modell: `tests/tastenflow-lektionen-it.test.ts`.
 * Geprüft auf BEIDEN Pflicht-Tastaturen (`cs` = QWERTZ, `cs-qwerty` = QWERTY), die Reihenfolge-Regel zusätzlich auf
 * fremden Tastaturen (ein Kind mit deutscher oder amerikanischer Tastatur auf dem tschechischen Weg):
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("cs")` - jede Einheit hat ihre Lektion, keine
 *     Lektion greift vor.
 *  2. Eigene Lektionen für Shift, Tečka-čárka-otazník, den Háček, die Čárka nad písmenem, die Ziffern, die Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen; Klammern und Anführungszeichen paarweise.
 *  4. Kein deutsches, englisches, französisches, spanisches oder italienisches Wort in Titeln und Einführungen; kein
 *     Maus-Wort, kein „vy“, keine Vergangenheit der 2. Person, nie „naslepo“, kein Halbgeviertstrich.
 *  5. Jedes Beispielwort (zwischen „…“) ist an der Stelle seiner Lektion tippbar - ď ť ň ó über die Totaste, grosse
 *     Akzentbuchstaben erst mit Shift UND Totaste, nie ein grosses Ů.
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (Ziffern mit Shift, AltGr gegen Option, Totasten).
 *
 * Mit Gegenproben.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
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
import { CS_LEKTIONS_IDS, csLektionsVorspannFuer } from "../src/lib/typing/curriculumCs";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { generateRound } from "../src/lib/typing/generator";
import { CORPUS_CS } from "../src/lib/typing/corpusCs";
import { fitText } from "../src/lib/typing/corpus";
import { isRealWord } from "../src/lib/typing/lexicon";
import { STUFE_VOCAB_CS, WORDS_CS } from "../src/lib/typing/wordsCs";

const CS_TASTATUREN: readonly LayoutId[] = ["cs", "cs-qwerty"];

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

/** Mit Háček entstehen č š ř ž ě ď ť ň, mit Čárka á é í ó ú ý - als GROSSBUCHSTABE jeweils Totaste + Shift + Buchstabe. */
const HACEK_ZIEL: Readonly<Record<string, string>> = { č: "c", š: "s", ř: "r", ž: "z", ě: "e", ď: "d", ť: "t", ň: "n" };
const CARKA_ZIEL: Readonly<Record<string, string>> = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ý: "y" };

/**
 * Ist das Wort mit diesem Tastenstand tippbar? Kleine Buchstaben mit eigener Taste sind eigene Einheiten; ď ť ň und ó brauchen
 * Totaste + Buchstabe; ein Grossbuchstabe braucht Shift, ein grosser Akzentbuchstabe ausserdem die Totaste seines Zeichens;
 * Ů gibt es nie. Leerzeichen gibt es immer.
 */
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  for (const ch of wort) {
    if (ch === " ") continue;
    if (ch === "Ů") return false;
    const c = ch.toLowerCase();
    const gross = ch !== c;
    if (gross && !stand.has(SHIFT_UNIT)) return false;
    if (HACEK_ZIEL[c] && (c === "ď" || c === "ť" || c === "ň" || gross)) {
      if (!(stand.has("ˇ") && stand.has(HACEK_ZIEL[c]))) return false;
      continue;
    }
    if (CARKA_ZIEL[c] && gross) {
      if (!(stand.has("´") && stand.has(CARKA_ZIEL[c]))) return false;
      continue;
    }
    if (c === "ó") {
      if (!(stand.has("´") && stand.has("o"))) return false;
      continue;
    }
    if (!stand.has(c)) return false;
  }
  return true;
}

/** Die Beispielwörter zwischen „…“ - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/„([^“]+)“/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „cs“ - auf jeder Tastatur", () => {
  for (const t of [...CS_TASTATUREN, "de", "us"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("cs")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("cs"), introOrder("cs"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("cs");
    const falsch = lektionenFuer("cs").map((l) => (l.id === "cs-caste-2" ? { ...l, newKeys: ["i", "o"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("cs")).length).toBeGreaterThan(0);
  });

  it("24 Lektionen auf jeder Tastatur, IDs mit „cs-“, eindeutig, gecacht", () => {
    expect(CS_LEKTIONS_IDS).toHaveLength(24);
    expect(new Set(CS_LEKTIONS_IDS).size).toBe(24);
    for (const id of CS_LEKTIONS_IDS) expect(id.startsWith("cs-"), id).toBe(true);
    for (const t of CS_TASTATUREN) {
      setLayout(t);
      expect(lektionenFuer("cs").map((l) => l.id), t).toEqual([...CS_LEKTIONS_IDS]);
      expect(lektionenFuer("cs")).toBe(lektionenFuer("cs"));
    }
  });

  it("die achte Grundtaste ist auf beiden Tastaturen ů; y und z tauschen nur ihre Plätze, die Folge zählt den Wert", () => {
    for (const t of CS_TASTATUREN) {
      setLayout(t);
      expect(lessonById("cs-zaklad-4")?.newKeys, t).toEqual(["a", "ů"]);
      expect(lessonById("cs-z-b-y")?.newKeys, t).toEqual(["z", "b", "y"]);
    }
  });

  it("eigene Lektionen: Shift, . , ?, Zahlenreihen-Buchstaben, Háček, Čárka, Ziffern; Sonderzeichen", () => {
    setLayout("cs");
    expect(lessonById("cs-velka")?.enablesShift).toBe(true);
    expect(lessonById("cs-tecka-carka")?.newKeys).toEqual([".", ",", "?"]);
    expect(lessonById("cs-caste-4")?.newKeys).toEqual(["v", "ě", "u"]);
    expect(lessonById("cs-haceky-1")?.newKeys).toEqual(["ž", "š", "ř"]);
    expect(lessonById("cs-haceky-2")?.newKeys).toEqual(["č", "é", "ý"]);
    expect(lessonById("cs-hacek")?.newKeys).toEqual(["ˇ"]);
    expect(lessonById("cs-carka")?.newKeys).toEqual(["´", "w", "q", "¨"]);
    expect(lessonById("cs-cisla")?.newKeys).toHaveLength(10);
    expect(lessonById("cs-symboly-1")?.newKeys).toEqual(["%", "/", "+", "=", "_", "*", "&", "<", ">", "$"]);
    expect(lessonById("cs-symboly-2")?.newKeys).toEqual(["|", "@", "#", "€", "[", "]"]);
    expect(shiftUnlockedAt("cs-caste-4")).toBe(false);
    expect(shiftUnlockedAt("cs-velka")).toBe(true);
    for (const t of CS_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("cs")) expect(new Set(unlockedKeysWith(l.id, undefined, "cs"))).toEqual(new Set(unlockedKeysAt(l.id)));
    }
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of CS_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("cs")) {
        stand = introducedThroughLesson(stand, l.id, "cs");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "cs").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "cs", lang: "cs", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) if (!z.text.trim() || fitText(z.text, erlaubt, "cs") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
        }
      }
      expect(fehler).toEqual([]);
    });
  }
});

/** Ein halbes Paar: ( ohne ), ) ohne (, eine ungerade Zahl gerader Anführungszeichen. */
function halbesPaar(zeile: string): boolean {
  let offen = 0;
  for (const c of zeile) {
    if (c === "(") offen += 1;
    else if (c === ")") {
      if (offen === 0) return true;
      offen -= 1;
    }
  }
  return offen !== 0 || (zeile.match(/"/g)?.length ?? 0) % 2 === 1;
}

describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of CS_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      setLayout(t);
      const funde: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("cs")) {
        stand = introducedThroughLesson(stand, l.id, "cs");
        for (const stufe of ["kids", "teens", "erwachsen"] as const)
          for (let k = 0; k < 3; k++)
            for (const z of generateRound(l.id, { lernweg: "cs", lang: "cs", introduced: stand, stufe, count: 10 }))
              if (halbesPaar(z.text)) funde.push(`${l.id}/${stufe}: „${z.text}"`);
      }
      expect(funde).toEqual([]);
    });
  }

  it('Gegenprobe: „slovo( dům“, „(dům“ und „řekl "ahoj“ fallen auf, „(dům) a "ahoj"“ nicht', () => {
    expect(["slovo( dům", "(dům", 'řekl "ahoj', '(dům) a "ahoj"'].filter(halbesPaar)).toEqual(["slovo( dům", "(dům", 'řekl "ahoj']);
  });
});

const CS_WOERTER = new Set<string>([
  ...WORDS_CS,
  ...Object.values(STUFE_VOCAB_CS).flat(),
  ...CORPUS_CS.flatMap((c) => c.text.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean)),
]);
function fremdesWort(wort: string): boolean {
  const w = wort.toLowerCase();
  if (w.length < 3 || CS_WOERTER.has(w) || isRealWord(w, "cs")) return false;
  return isRealWord(w, "de") || isRealWord(w, "en") || isRealWord(w, "fr") || isRealWord(w, "es") || isRealWord(w, "it");
}

/** Häufige Wörter der Lektionstexte anderer Wege, die im Tschechischen nie vorkommen. */
const NIE = new Set([
  "und", "der", "die", "mit", "ist", "nicht", "taste", "tasten", "finger", "zeigefinger", "reihe", "grundreihe",
  "umschalttaste", "links", "rechts", "the", "and", "with", "key", "keys", "row", "press", "hold", "left", "right", "your",
  "touche", "doigt", "rangée", "avec", "gauche", "droite", "clavier", "majuscule", "tecla", "dedo", "izquierda", "derecha",
  "teclado", "mayús", "pulsa", "tasto", "tasti", "dito", "riga", "maiusc", "sinistra", "destra",
]);

describe("★★★ Keine fremde Sprache; Hausregeln (Glossar Regel 1 bis 8)", () => {
  it("Titel und Einführungen (beide Tastaturen): keine fremden Wörter, kein Maus-Wort, kein „vy“, kein Geschlecht, nie „naslepo“, kein – —", () => {
    const funde: string[] = [];
    for (const t of CS_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("cs"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          if (/[äöüßẞ–—’]/.test(text)) funde.push(`${t} ${l.id} ${feld}: Umlaut/ß/Strich/Apostroph`);
          // Maus (Regel 8) und die vy-Form der Lehrkraft-Texte (Regel 1) haben in Kinder-Lektionen nichts verloren.
          if (/\bklikn|\bklik|ťukn|přetáhn|\bmyší\b|\bmyš\b|stiskněte|podržte|zkuste|vyberte/i.test(text)) funde.push(`${t} ${l.id} ${feld}: Maus oder vy-Form`);
          // Person zuerst, nie „naslepo“ (Regel 3/4).
          if (/naslepo|slepé psaní|\bslepý|\bslepá|\bslepé|\bslepí\b|nevidom|postižen/i.test(text)) funde.push(`${t} ${l.id} ${feld}: Person zuerst`);
          // Kein Geschlecht der tippenden Person: l-Partizip in der 2. Person (Regel 2).
          if (/\bjsi\b|\bbys\b|\w+(l|la)\s+jsi\b/i.test(text)) funde.push(`${t} ${l.id} ${feld}: 2. Person Vergangenheit`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("Übungszeilen einer Runde je Lektion: kein deutsches, englisches, französisches, spanisches oder italienisches Wort", () => {
    setLayout("cs");
    const funde = new Set<string>();
    let stand: string[] | undefined;
    for (const l of lektionenFuer("cs")) {
      stand = introducedThroughLesson(stand, l.id, "cs");
      for (const stufe of ["kids", "teens", "erwachsen"] as const)
        for (const z of generateRound(l.id, { lernweg: "cs", lang: "cs", introduced: stand, stufe, count: 10 })) {
          if (z.art === "unsinn") continue; // Übungssilben sind Kunstwörter
          for (const w of z.text.split(/[^\p{L}]+/u).filter(Boolean)) if (fremdesWort(w)) funde.add(`${l.id}: ${w}`);
        }
    }
    expect([...funde]).toEqual([]);
  }, 120_000); // ★ allein 7-27 s gemessen (10.10.), unter Volllast sonst Zeitüberschreitung

  it("Gegenprobe: eine deutsche, eine englische Zeile und die Hausregeln fallen auf", () => {
    expect("Der Hund und die Katze spielen".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect("The children play with their friends".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect(/\bklikn|\bklik|ťukn|přetáhn/i.test("Klikni na tlačítko")).toBe(true);
    expect(/stiskněte|podržte|zkuste/i.test("Stiskněte klávesu")).toBe(true);
    expect(/naslepo|slepé psaní/i.test("psaní naslepo")).toBe(true);
    expect(/\bjsi\b/i.test("Dnes jsi psal rychle")).toBe(true);
    expect(/\bjsi\b|\bbys\b/i.test("Zkus to znovu, píšeš rychleji")).toBe(false);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("cs");
    expect(lektionenFuer("cs").flatMap((l) => beispielWoerter(csLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(150);
  });

  for (const t of CS_TASTATUREN) {
    it(`${t}: jedes Wort zwischen „…“ passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("cs")) {
        const stand = new Set(unlockedKeysAt(l.id));
        if (shiftUnlockedAt(l.id)) stand.add(SHIFT_UNIT);
        for (const w of beispielWoerter(csLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, stand)) fehler.push(`${l.id}: „${w}“`);
      }
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: ein Wort mit einer späteren Taste, ein Grossbuchstabe vor Shift, ď ohne Háček, Č ohne Totaste und Ů fallen auf", () => {
    setLayout("cs");
    const bis = (id: string) => {
      const s = new Set(unlockedKeysAt(id));
      if (shiftUnlockedAt(id)) s.add(SHIFT_UNIT);
      return s;
    };
    expect(wortTippbar("zima", bis("cs-caste-4"))).toBe(false);
    expect(wortTippbar("Anna", bis("cs-caste-4"))).toBe(false);
    expect(wortTippbar("Anna", bis("cs-velka"))).toBe(true);
    expect(wortTippbar("teď", bis("cs-g-u-x"))).toBe(true);
    expect(wortTippbar("teď", bis("cs-haceky-2"))).toBe(false);
    expect(wortTippbar("Česko", bis("cs-haceky-2"))).toBe(false);
    expect(wortTippbar("Česko", bis("cs-hacek"))).toBe(true);
    expect(wortTippbar("gól", bis("cs-g-u-x"))).toBe(false);
    expect(wortTippbar("gól", bis("cs-carka"))).toBe(true);
    expect(wortTippbar("Ústí", bis("cs-carka"))).toBe(true);
    expect(wortTippbar("Ůžasné", bis("cs-texty"))).toBe(false);
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("ě und die Zahlenreihe: Finger und Lage aus den Daten, mit dem Namen „e s háčkem“", () => {
    setLayout("cs");
    const l = lessonById("cs-caste-4")!;
    expect(l.intro).toMatch(/Klávesa ě \(e s háčkem\): levý prsteníček, v číselné řadě, přímo nad klávesou S/);
  });

  it("y und z: auf der QWERTZ liegt z oben und y unten, auf der QWERTY umgekehrt - die Griffe unterscheiden sich", () => {
    setLayout("cs");
    const qwertz = lessonById("cs-z-b-y")!;
    setLayout("cs-qwerty");
    const qwerty = lessonById("cs-z-b-y")!;
    expect(qwertz.intro).toMatch(/Klávesa Z: pravý ukazováček, nahoře/);
    expect(qwertz.intro).toMatch(/Klávesa Y: levý malíček, přímo pod klávesou A/);
    expect(qwerty.intro).toMatch(/Klávesa Z: levý malíček, přímo pod klávesou A/);
    expect(qwerty.intro).toMatch(/Klávesa Y: pravý ukazováček, nahoře/);
    expect(lessonIntroText(qwertz, "cs-qwerty")).toBe(qwerty.intro);
  });

  it("Ziffern: nur mit Shift (1 = Shift + plus, 2 = Shift + e s háčkem)", () => {
    for (const t of CS_TASTATUREN) {
      setLayout(t);
      expect(lessonById("cs-cisla")!.intro, t).toMatch(/1 = Shift \+ plus, 2 = Shift \+ e s háčkem/);
      expect(lessonById("cs-cisla")!.intro, t).toMatch(/bez ní píšou tytéž klávesy písmena/);
    }
  });

  it("Háček und Čárka: Totaste mit Shift bzw. ohne, mit dem Satz über die mrtvá klávesa", () => {
    setLayout("cs");
    expect(lessonById("cs-hacek")!.intro).toMatch(/Mrtvá klávesa háček: podrž klávesu Shift druhé ruky a stiskni klávesu čárka nad písmenem/);
    expect(lessonById("cs-hacek")!.intro).toMatch(/sama nic nenapíše/);
    expect(lessonById("cs-carka")!.intro).toMatch(/Mrtvá klávesa čárka nad písmenem: pravý malíček, v číselné řadě/);
  });

  it("dritte Ebene: AltGr (QWERTZ: € = AltGr + E), am Mac Option - und wo der Mac anders liegt, steht die Mac-Taste", () => {
    setLayout("cs");
    const s2 = lessonById("cs-symboly-2")!.intro;
    expect(s2).toMatch(/Znak euro \(€\): podrž klávesu AltGr a stiskni klávesu E/);
    expect(s2).toMatch(/Na Macu: podrž klávesu Option a stiskni klávesu R/);
    expect(lessonById("cs-symboly-1")!.intro).toMatch(/Na Macu místo AltGr klávesa Option/);
  });

  it("die Schlusslektion: grosse Buchstaben mit Totaste, Ů nur mit Caps Lock", () => {
    setLayout("cs");
    const texty = lessonById("cs-texty")!;
    expect(texty.kind).toBe("text");
    expect(texty.intro).toMatch(/nejdřív mrtvá klávesa/);
    expect(texty.intro).toMatch(/Velké Ů jde napsat jen s klávesou Caps Lock/);
  });
});
