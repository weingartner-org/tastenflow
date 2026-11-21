/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „pl" (PL-W, 09.10.2026). Modell: `tests/tastenflow-lektionen-it.test.ts`.
 * Geprüft auf der Pflicht-Tastatur `pl` (Windows „Polski (programisty)" / Mac „Polish - Pro", eine Belegung); die
 * Reihenfolge-Regel zusätzlich auf der deutschen, Schweizer, amerikanischen und britischen Hardware (dort fehlen oder
 * wandern Einheiten, die Regel „die Tasten aller Lektionen hintereinander SIND die Folge" gilt trotzdem):
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("pl")` - jede Einheit hat ihre Lektion, keine Lektion
 *     greift vor; die achte Grundtaste (`;` auf `pl`, `ö` auf deutscher Hardware).
 *  2. Eigene Lektionen für Umschalt, Punkt und Komma, jedes Paar polnischer Buchstaben (ę einzeln, ł b, g ż, ą ś, ć h, ó ń),
 *     x ź v q, die übrigen Satzzeichen, Ziffern, Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen; Klammern und Anführungszeichen paarweise.
 *  4. Kein deutsches, englisches oder italienisches Wort in Titeln und Einführungen; kein Maus-Wort, keine Anrede Pan/Pani,
 *     kein Geschlecht der tippenden Person, nie „na ślepo", kein Halbgeviertstrich.
 *  5. Jedes Beispielwort (zwischen geraden Anführungszeichen) ist an der Stelle seiner Lektion tippbar - nie ein grosser
 *     polnischer Buchstabe (der Dreiergriff kommt erst mit der letzten Buchstaben-Einheit).
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (AltGr-Buchstaben mit dem rechten Daumen, Zeichen mit Shift der
 *     anderen Hand), die Schlusslektion erklärt den Dreiergriff der grossen polnischen Buchstaben.
 *
 * Mit Gegenproben.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import {
  introducedThroughLesson,
  lektionenFuer,
  lessonById,
  shiftUnlockedAt,
  unlockedKeysAt,
  unlockedKeysWith,
  type Lesson,
} from "../src/lib/typing/curriculum";
import { PL_LEKTIONS_IDS, plLektionsVorspannFuer } from "../src/lib/typing/curriculumPl";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { generateRound } from "../src/lib/typing/generator";
import { CORPUS_PL } from "../src/lib/typing/corpusPl";
import { fitText } from "../src/lib/typing/corpus";
import { isRealWord } from "../src/lib/typing/lexicon";
import { STUFE_VOCAB_PL, WORDS_PL } from "../src/lib/typing/wordsPl";

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

/** Jeder polnische Buchstabe ist eine eigene Einheit (AltGr-Griff, keine Totaste); Leerzeichen gibt es immer. */
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  if (/[ĄĆĘŁŃÓŚŹŻ]/.test(wort)) return false; // der Dreiergriff kommt erst mit der letzten Buchstaben-Einheit
  for (const ch of wort) {
    const c = ch.toLowerCase();
    if (c === " " || stand.has(c)) continue;
    return false;
  }
  return /\p{Lu}/u.test(wort) ? stand.has(SHIFT_UNIT) : true;
}

/** Die Beispielwörter zwischen geraden Anführungszeichen - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „pl“ - auf jeder Tastatur", () => {
  for (const t of ["pl", "de", "ch", "us", "uk"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("pl")`, () => {
      setLayout(t as LayoutId);
      expect(folgtDerReihenfolge(lektionenFuer("pl"), introOrder("pl"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("pl");
    const falsch = lektionenFuer("pl").map((l) => (l.id === "pl-czeste-3" ? { ...l, newKeys: ["e", "m"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("pl")).length).toBeGreaterThan(0);
  });

  it("24 Lektionen, IDs mit „pl-“, eindeutig, gecacht", () => {
    expect(PL_LEKTIONS_IDS).toHaveLength(24);
    expect(new Set(PL_LEKTIONS_IDS).size).toBe(24);
    expect(PL_LEKTIONS_IDS.every((id) => id.startsWith("pl-"))).toBe(true);
    setLayout("pl");
    expect(lektionenFuer("pl").map((l) => l.id)).toEqual([...PL_LEKTIONS_IDS]);
    expect(lektionenFuer("pl")).toBe(lektionenFuer("pl"));
  });

  it("die achte Grundtaste: `;` auf `pl` (ein Fingeranker), `ö` auf deutscher Hardware - die ID bleibt", () => {
    setLayout("pl");
    expect(lessonById("pl-podstawowy-4")?.newKeys).toEqual(["a", ";"]);
    setLayout("de");
    expect(lessonById("pl-podstawowy-4")?.newKeys).toEqual(["a", "ö"]);
  });

  it("eigene Lektionen: Umschalt, . ,, jedes Paar polnischer Buchstaben, x ź v q, Satzzeichen, Ziffern, Symbole", () => {
    setLayout("pl");
    expect(lessonById("pl-shift")?.enablesShift).toBe(true);
    expect(lessonById("pl-kropka-przecinek")?.newKeys).toEqual([".", ","]);
    expect(lessonById("pl-e-ogonek")?.newKeys).toEqual(["ę"]);
    expect(lessonById("pl-l-b")?.newKeys).toEqual(["ł", "b"]);
    expect(lessonById("pl-g-z-kropka")?.newKeys).toEqual(["g", "ż"]);
    expect(lessonById("pl-a-s-ogonek")?.newKeys).toEqual(["ą", "ś"]);
    expect(lessonById("pl-c-h")?.newKeys).toEqual(["ć", "h"]);
    expect(lessonById("pl-o-n-ogonek")?.newKeys).toEqual(["ó", "ń"]);
    expect(lessonById("pl-xzvq")?.newKeys).toEqual(["x", "ź", "v", "q"]);
    expect(lessonById("pl-pytanie")?.newKeys).toEqual(["?", "!", "-", '"', ":", "(", ")", "'"]);
    expect(lessonById("pl-symbole-2")?.newKeys).toEqual(["|", "\\", "@", "#", "^", "[", "]", "{", "}", "€"]);
    expect(lessonById("pl-teksty")?.kind).toBe("text");
    expect(shiftUnlockedAt("pl-rpu")).toBe(false);
    expect(shiftUnlockedAt("pl-shift")).toBe(true);
    for (const l of lektionenFuer("pl")) expect(new Set(unlockedKeysWith(l.id, undefined, "pl"))).toEqual(new Set(unlockedKeysAt(l.id)));
  });

  it("nie zwei neue AltGr-Griffe vor ⇧, und die letzte Lektion zwischen zwei AltGr-Lektionen bringt nie mehr als ein Paar", () => {
    setLayout("pl");
    const vorShift = lektionenFuer("pl").slice(0, PL_LEKTIONS_IDS.indexOf("pl-shift"));
    expect(vorShift.flatMap((l) => l.newKeys).filter((u) => /[ąćęłńóśźż]/.test(u))).toEqual(["ę"]);
    for (const l of lektionenFuer("pl")) expect(l.newKeys.filter((u) => /[ąćęłńóśźż]/.test(u)).length, l.id).toBeLessThanOrEqual(2);
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  it("pl: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand", () => {
    setLayout("pl");
    const fehler: string[] = [];
    let stand: string[] | undefined;
    for (const l of lektionenFuer("pl")) {
      stand = introducedThroughLesson(stand, l.id, "pl");
      const erlaubt = new Set(unlockedKeysWith(l.id, stand, "pl").filter((u) => u !== SHIFT_UNIT));
      for (const stufe of ["kids", "teens", "erwachsen"] as const) {
        const runde = generateRound(l.id, { lernweg: "pl", lang: "pl", introduced: stand, stufe, count: 10 });
        if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
        for (const z of runde) if (!z.text.trim() || fitText(z.text, erlaubt, "pl") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
      }
    }
    expect(fehler).toEqual([]);
  });
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
  it("pl: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar", () => {
    setLayout("pl");
    const funde: string[] = [];
    let stand: string[] | undefined;
    for (const l of lektionenFuer("pl")) {
      stand = introducedThroughLesson(stand, l.id, "pl");
      for (const stufe of ["kids", "teens", "erwachsen"] as const)
        for (let k = 0; k < 3; k++)
          for (const z of generateRound(l.id, { lernweg: "pl", lang: "pl", introduced: stand, stufe, count: 10 }))
            if (halbesPaar(z.text)) funde.push(`${l.id}/${stufe}: „${z.text}"`);
    }
    expect(funde).toEqual([]);
  });

  it('Gegenprobe: „słowo( dom“, „(dom“ und „mówi "tak“ fallen auf, „(dom) i "tak"“ nicht', () => {
    expect(["słowo( dom", "(dom", 'mówi "tak', '(dom) i "tak"'].filter(halbesPaar)).toEqual(["słowo( dom", "(dom", 'mówi "tak']);
  });
});

const PL_WOERTER = new Set<string>([
  ...WORDS_PL,
  ...Object.values(STUFE_VOCAB_PL).flat(),
  ...CORPUS_PL.flatMap((c) => c.text.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean)),
]);
function fremdesWort(wort: string): boolean {
  const w = wort.toLowerCase();
  if (w.length < 3 || PL_WOERTER.has(w) || isRealWord(w, "pl")) return false;
  return isRealWord(w, "de") || isRealWord(w, "en") || isRealWord(w, "it");
}

/** Häufige Wörter der Lektionstexte anderer Wege, die im Polnischen nie vorkommen. */
const NIE = new Set([
  "und", "der", "die", "mit", "ist", "nicht", "taste", "tasten", "finger", "zeigefinger", "reihe", "grundreihe",
  "umschalttaste", "links", "rechts", "the", "and", "with", "key", "keys", "row", "press", "hold", "left", "right", "your",
  "tasto", "dito", "riga", "con", "premi", "tieni", "mano",
]);

/** Wortgrenzen mit Unicode-Buchstaben (`\b` kennt kein ś ł ó). */
const WORT = (muster: string) => `(?<![\\p{L}])(?:${muster})(?![\\p{L}])`;
const MAUS_ETC = new RegExp(`${WORT("klik\\p{L}*|dotknij|przeciągnij|najedź|mysz|myszk\\p{L}*|ślepy|niewidom\\p{L}*")}|na ślepo`, "iu");
const ANREDE = new RegExp(WORT("Pan|Pani"), "u");
const GESCHLECHT = new RegExp(`${WORT("\\p{L}+(?:łeś|łaś)|sam|sama|gotowy|gotowa")}`, "iu");

describe("★★★ Kein Deutsch, Englisch oder Italienisch; Hausregeln", () => {
  it("Titel und Einführungen: keine fremden Wörter, kein Maus-Wort, kein Pan/Pani, kein Geschlecht, nie „na ślepo“, kein – —", () => {
    const funde: string[] = [];
    setLayout("pl");
    for (const l of lektionenFuer("pl"))
      for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
        if (/[äßẞ–—’„”]/.test(text)) funde.push(`${l.id} ${feld}: Umlaut/ß/Strich/Anführung`);
        if (MAUS_ETC.test(text) || ANREDE.test(text)) funde.push(`${l.id} ${feld}: Hausregel`);
        // Geschlecht der tippenden Person: Vergangenheitsformen auf -łeś/-łaś und „sam“ / „sama“ (nur als Wort, nicht „samolot“).
        if (GESCHLECHT.test(text)) funde.push(`${l.id} ${feld}: Geschlecht`);
        for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${l.id} ${feld}: ${w}`);
      }
    expect(funde).toEqual([]);
  });

  it("Übungszeilen einer Runde je Lektion: kein deutsches, englisches oder italienisches Wort", () => {
    setLayout("pl");
    const funde = new Set<string>();
    let stand: string[] | undefined;
    for (const l of lektionenFuer("pl")) {
      stand = introducedThroughLesson(stand, l.id, "pl");
      for (const stufe of ["kids", "teens", "erwachsen"] as const)
        for (const z of generateRound(l.id, { lernweg: "pl", lang: "pl", introduced: stand, stufe, count: 10 })) {
          if (z.art === "unsinn") continue; // Übungssilben sind Kunstwörter
          for (const w of z.text.split(/[^\p{L}]+/u).filter(Boolean)) if (fremdesWort(w)) funde.add(`${l.id}: ${w}`);
        }
    }
    expect([...funde]).toEqual([]);
  }, 120_000); // ★ allein 7-27 s gemessen (10.10.), unter Volllast sonst Zeitüberschreitung

  it("Gegenprobe: eine deutsche, eine englische Zeile und eine Hausregel fallen auf", () => {
    expect("Der Hund und die Katze spielen".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect("The children play with their friends".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect(MAUS_ETC.test("Kliknij przycisk")).toBe(true);
    expect(MAUS_ETC.test("pisać na ślepo")).toBe(true);
    expect(MAUS_ETC.test("To jest ślepy zaułek")).toBe(true);
    expect(MAUS_ETC.test("Połóż palce na rzędzie podstawowym")).toBe(false);
    expect(ANREDE.test("Czy Pan wie")).toBe(true);
    expect(ANREDE.test("panierowany")).toBe(false);
    expect(GESCHLECHT.test("Dobrze to zrobiłeś")).toBe(true);
    expect(GESCHLECHT.test("piszesz sam")).toBe(true);
    expect(GESCHLECHT.test("samolot lata")).toBe(false);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("pl");
    expect(lektionenFuer("pl").flatMap((l) => beispielWoerter(plLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(120);
  });

  it("pl: jedes Wort zwischen Anführungszeichen passt zum Tastenstand der Lektion", () => {
    setLayout("pl");
    const fehler: string[] = [];
    for (const l of lektionenFuer("pl")) {
      const stand = new Set(unlockedKeysAt(l.id));
      if (shiftUnlockedAt(l.id)) stand.add(SHIFT_UNIT);
      for (const w of beispielWoerter(plLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, stand)) fehler.push(`${l.id}: "${w}"`);
    }
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: ein Wort mit einer späteren Taste, ein Grossbuchstabe vor Umschalt und ein grosses Ą fallen auf", () => {
    setLayout("pl");
    expect(wortTippbar("woda", new Set(unlockedKeysAt("pl-podstawowy-4")))).toBe(false);
    expect(wortTippbar("woda", new Set(unlockedKeysAt("pl-czeste-1")))).toBe(true);
    expect(wortTippbar("się", new Set(unlockedKeysAt("pl-czeste-4")))).toBe(false);
    expect(wortTippbar("się", new Set(unlockedKeysAt("pl-e-ogonek")))).toBe(true);
    expect(wortTippbar("Ania", new Set(unlockedKeysAt("pl-rpu")))).toBe(false);
    expect(wortTippbar("Ania", new Set([...unlockedKeysAt("pl-shift"), SHIFT_UNIT]))).toBe(true);
    expect(wortTippbar("Ą", new Set([...unlockedKeysAt("pl-teksty"), SHIFT_UNIT]))).toBe(false);
  });

  it("die Beispielwörter tragen nirgends ein Wort der Sperrliste", async () => {
    const { gesperrtPl } = await import("../src/lib/typing/sperrlistePl");
    setLayout("pl");
    const gesperrt = lektionenFuer("pl")
      .flatMap((l) => beispielWoerter(plLektionsVorspannFuer(l.id, l.newKeys)))
      .flatMap((s) => s.toLowerCase().split(/[^\p{L}]+/u))
      .filter((w) => w && gesperrtPl(w));
    expect(gesperrt).toEqual([]);
  });
});

describe("★★ Griffe (gerechnet, nicht geschrieben)", () => {
  it("ę: prawy Alt (Mac: Option) mit dem rechten Daumen und Klawisz E - der Hinweis steht schon in der Lektion", () => {
    setLayout("pl");
    const l = lessonById("pl-e-ogonek")!;
    expect(l.intro).toMatch(/Na klawiszu E stoi tylko E/);
    expect(l.intro).toMatch(
      /Litera ę: przytrzymaj prawy Alt \(na Macu: Option\) prawym kciukiem i naciśnij klawisz E \(lewy środkowy, w rzędzie górnym, nad klawiszem D\)\./,
    );
  });

  it("ź liegt auf X (nicht auf Z), ż auf Z", () => {
    setLayout("pl");
    expect(lessonById("pl-xzvq")!.intro).toMatch(/Litera ź: przytrzymaj prawy Alt \(na Macu: Option\) prawym kciukiem i naciśnij klawisz X/);
    expect(lessonById("pl-g-z-kropka")!.intro).toMatch(/Litera ż: przytrzymaj prawy Alt \(na Macu: Option\) prawym kciukiem i naciśnij klawisz Z/);
  });

  it("Zeichen mit Shift: Shift der anderen Hand und die Taste mit Namen; Ziffern ohne Shift", () => {
    setLayout("pl");
    expect(lessonById("pl-pytanie")!.intro).toMatch(/Wykrzyknik "!": przytrzymaj Shift drugą ręką i naciśnij klawisz 1/);
    expect(lessonById("pl-pytanie")!.intro).toMatch(/Cudzysłów \("\): przytrzymaj Shift drugą ręką i naciśnij klawisz apostrof/);
    expect(lessonById("pl-cyfry")!.intro).toMatch(/cyfry pisze się bez Shift/);
    expect(lessonById("pl-symbole-2")!.intro).toMatch(/Euro "€": przytrzymaj prawy Alt \(na Macu: Option\) i naciśnij klawisz U/);
  });

  it("das ń: der Hinweis auf NVDA steht in der Lektion, ohne eine Lösung zu raten", () => {
    setLayout("pl");
    const t = lessonById("pl-o-n-ogonek")!.intro;
    expect(t).toMatch(/NVDA/);
    expect(t).toMatch(/Ctrl \+ Alt \+ N/);
    expect(t).toMatch(/osobę prowadzącą klasę/);
  });

  it("die Schlusslektion erklärt den Dreiergriff der grossen polnischen Buchstaben; der Wächter kennt kein grosses Beispielwort", () => {
    setLayout("pl");
    const t = lessonById("pl-teksty")!;
    expect(t.kind).toBe("text");
    expect(t.intro).toMatch(/Wielkie polskie litery \(Ą Ć Ę Ł Ń Ó Ś Ź Ż\) to trzy klawisze naraz/);
    expect(beispielWoerter(plLektionsVorspannFuer("pl-teksty", []))).toEqual([]);
  });

  it("auf deutscher Hardware: keine Behauptung über die Dreiergriffe der grossen Buchstaben", () => {
    setLayout("de");
    expect(lessonById("pl-teksty")!.intro).not.toMatch(/Wielkie polskie litery \(/);
  });
});
