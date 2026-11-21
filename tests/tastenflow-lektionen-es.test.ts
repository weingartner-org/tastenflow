/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „es" (ES-S, 27.09.2026). Modell:
 * `tests/tastenflow-lektionen-fr.test.ts`. Geprüft auf BEIDEN Pflicht-
 * Tastaturen (Spanien ISO, Lateinamerika):
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("es")` -
 *     jede Einheit hat ihre Lektion, keine Lektion greift vor.
 *  2. Eigene Lektionen für ñ, die Totaste ´, Mayús, ¿ ? und ¡ ! (je als Paar).
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen.
 *  4. Kein deutsches, englisches oder französisches Wort in Titeln und
 *     Einführungen; kein Maus-Wort, kein vosotros, kein Halbgeviertstrich.
 *  5. Jedes Beispielwort (zwischen geraden Anführungszeichen) ist an der
 *     Stelle seiner Lektion tippbar.
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
import { ES_LEKTIONS_IDS, ES_LEKTIONS_VORSPANN } from "../src/lib/typing/curriculumEs";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { generateRound } from "../src/lib/typing/generator";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { fitText } from "../src/lib/typing/corpus";
import { isRealWord } from "../src/lib/typing/lexicon";
import { STUFE_VOCAB_ES, WORDS_ES } from "../src/lib/typing/wordsEs";

const ES_TASTATUREN: readonly LayoutId[] = ["es", "latam"];

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

/** á é í ó ú über ´, ü über ¨; Leerzeichen gibt es immer. */
const TOTASTE: Record<string, [string, string]> = {
  á: ["´", "a"], é: ["´", "e"], í: ["´", "i"], ó: ["´", "o"], ú: ["´", "u"], ü: ["¨", "u"],
};
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  for (const ch of wort) {
    const c = ch.toLowerCase();
    if (c === " " || stand.has(c)) continue;
    const tot = TOTASTE[c];
    if (tot && stand.has(tot[0]) && stand.has(tot[1])) continue;
    return false;
  }
  return /\p{Lu}/u.test(wort) ? stand.has(SHIFT_UNIT) || wort === wort.toLowerCase() : true;
}

/** Die Beispielwörter zwischen geraden Anführungszeichen - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „es“ - auf beiden Tastaturen", () => {
  for (const t of ES_TASTATUREN) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("es")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("es"), introOrder("es"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("es");
    const falsch = lektionenFuer("es").map((l) => (l.id === "es-frecuentes-1" ? { ...l, newKeys: ["e", "r"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("es")).length).toBeGreaterThan(0);
  });

  it("24 Lektionen auf beiden Tastaturen, IDs mit „es-“, eindeutig; Lateinamerika ohne „€“", () => {
    expect(ES_LEKTIONS_IDS).toHaveLength(24);
    expect(new Set(ES_LEKTIONS_IDS).size).toBe(24);
    for (const t of ES_TASTATUREN) {
      setLayout(t);
      expect(lektionenFuer("es").map((l) => l.id), t).toEqual([...ES_LEKTIONS_IDS]);
      expect(lektionenFuer("es")).toBe(lektionenFuer("es"));
    }
    expect(lessonById("es-especiales-1")?.newKeys).not.toContain("€");
    setLayout("es");
    expect(lessonById("es-especiales-1")?.newKeys).toContain("€");
  });

  it("eigene Lektionen: Ñ, die Tilde ´, Mayús, ¿ ? und ¡ ! je als Paar, ü, W", () => {
    setLayout("es");
    expect(lessonById("es-enye")?.newKeys).toEqual(["ñ"]);
    expect(lessonById("es-tilde")?.newKeys).toEqual(["´"]);
    expect(lessonById("es-mayus")?.enablesShift).toBe(true);
    expect(lessonById("es-interrogacion")?.newKeys).toEqual(["¿", "?"]);
    expect(lessonById("es-exclamacion")?.newKeys).toEqual(["¡", "!"]);
    expect(lessonById("es-dieresis")?.newKeys).toEqual(["¨"]);
    expect(lessonById("es-w")?.newKeys).toEqual(["w"]);
    expect(shiftUnlockedAt("es-tilde")).toBe(false);
    expect(shiftUnlockedAt("es-mayus")).toBe(true);
    for (const l of lektionenFuer("es")) expect(new Set(unlockedKeysWith(l.id, undefined, "es"))).toEqual(new Set(unlockedKeysAt(l.id)));
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of ES_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("es")) {
        stand = introducedThroughLesson(stand, l.id, "es");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "es").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "es", lang: "es", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) if (!z.text.trim() || fitText(z.text, erlaubt, "es") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
        }
      }
      expect(fehler).toEqual([]);
    });
  }
});

/** Ein halbes oder verdrehtes Paar ¿?/¡! (Bauplan §4.4): jedes öffnende Zeichen am Wortanfang, mit seinem Gegenstück danach. */
function halbesPaar(zeile: string): boolean {
  for (const [auf, zu] of [["¿", "?"], ["¡", "!"]] as const) {
    let offen = 0;
    for (let i = 0; i < zeile.length; i++) {
      if (zeile[i] === auf) {
        // Davor erlaubt: Zeilenanfang, Leerzeichen, ( " « und der Gesprächsstrich
        // („-¡Llegamos! -gritó Camila", Ende-Charge Kinder) - der machte den
        // Wächter bis 27.09. je nach gewürfelter Runde rot.
        if (i > 0 && !" (\"«“-".includes(zeile[i - 1])) return true;
        offen += 1;
      } else if (zeile[i] === zu) {
        if (offen === 0) return true;
        offen -= 1;
      }
    }
    if (offen !== 0) return true;
  }
  return false;
}

describe("★★★★ Harte Paare ¿?/¡! auch auf dem Weg durch die Lektionen (Bauplan §4.4)", () => {
  for (const t of ES_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes oder verdrehtes Paar`, () => {
      setLayout(t);
      const funde: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("es")) {
        stand = introducedThroughLesson(stand, l.id, "es");
        for (const stufe of ["kids", "teens", "erwachsen"] as const)
          for (let k = 0; k < 3; k++)
            for (const z of generateRound(l.id, { lernweg: "es", lang: "es", introduced: stand, stufe, count: 10 }))
              if (halbesPaar(z.text)) funde.push(`${l.id}/${stufe}: „${z.text}"`);
      }
      expect(funde).toEqual([]);
    });
  }

  it("Gegenprobe: „Estaban¿ dinero“, „As mío?“ und „¡Hola“ fallen auf, „¿Qué hora es?“ nicht", () => {
    expect(halbesPaar("-¡Llegamos! -gritó Camila.")).toBe(false);
    expect(halbesPaar("-¡Llegamos -gritó Camila.")).toBe(true);
    expect(["Estaban¿ dinero", "As mío?", "¡Hola", "¿Qué hora es?", "¡Gol! ¿Y ahora?"].filter(halbesPaar)).toEqual([
      "Estaban¿ dinero",
      "As mío?",
      "¡Hola",
    ]);
  });
});

const ES_WOERTER = new Set<string>([
  ...WORDS_ES,
  // Der Generator zieht je Altersstufe auch aus STUFE_VOCAB_ES - dieselbe
  // Lücke liess den französischen Zwilling zufällig anschlagen („science",
  // 27.09.); ohne diese Liste hinge das Ergebnis vom Würfel ab.
  ...Object.values(STUFE_VOCAB_ES).flat(),
  ...CORPUS_ES.flatMap((c) => c.text.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean)),
]);
function fremdesWort(wort: string): boolean {
  const w = wort.toLowerCase();
  if (w.length < 3 || ES_WOERTER.has(w) || isRealWord(w, "es")) return false;
  return isRealWord(w, "de") || isRealWord(w, "en") || isRealWord(w, "fr");
}

/** Häufige Wörter der deutschen, englischen und französischen Lektionstexte, die im Spanischen nie vorkommen. */
const NIE = new Set([
  "und", "der", "die", "mit", "ist", "nicht", "auf", "ein", "eine", "taste", "tasten", "finger", "zeigefinger",
  "reihe", "grundreihe", "umschalttaste", "links", "rechts", "the", "and", "with", "key", "keys", "row", "press",
  "hold", "shift", "left", "right", "your", "touche", "doigt", "rangée", "avec", "gauche", "droite", "clavier",
  "et", "une", "maj", "majuscule", "vous", "tu", "dans",
].filter((w) => w !== "tu"));

describe("★★★ Kein Deutsch, Englisch oder Französisch; Hausregeln", () => {
  it("Titel und Einführungen (beide Tastaturen): keine fremden Wörter, kein Maus-Wort, kein vosotros, kein – —", () => {
    const funde: string[] = [];
    for (const t of ES_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("es"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          if (/[äößẞ–—]/.test(text)) funde.push(`${t} ${l.id} ${feld}: Umlaut/ß/Strich`);
          if (/\bclic\b|haz clic|con el ratón|\bvosotros\b|\bos\b|áis\b|éis\b/i.test(text)) funde.push(`${t} ${l.id} ${feld}: Hausregel`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("Übungszeilen einer Runde je Lektion: kein deutsches, englisches oder französisches Wort", () => {
    setLayout("es");
    const funde = new Set<string>();
    let stand: string[] | undefined;
    for (const l of lektionenFuer("es")) {
      stand = introducedThroughLesson(stand, l.id, "es");
      for (const stufe of ["kids", "teens", "erwachsen"] as const)
        for (const z of generateRound(l.id, { lernweg: "es", lang: "es", introduced: stand, stufe, count: 10 })) {
          if (z.art === "unsinn") continue; // Übungssilben sind Kunstwörter
          for (const w of z.text.split(/[^\p{L}]+/u).filter(Boolean)) if (fremdesWort(w)) funde.add(`${l.id}: ${w}`);
        }
    }
    expect([...funde]).toEqual([]);
  });

  it("Gegenprobe: eine deutsche, eine englische und eine Hausregel-Zeile fallen auf", () => {
    expect("Der Hund und die Katze spielen".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect("The children play with their friends".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect(/\bclic\b|haz clic|con el ratón|\bvosotros\b/i.test("Haz clic en el botón")).toBe(true);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    expect(ES_LEKTIONS_IDS.flatMap((id) => beispielWoerter(ES_LEKTIONS_VORSPANN[id])).length).toBeGreaterThan(100);
  });

  for (const t of ES_TASTATUREN) {
    it(`${t}: jedes Wort zwischen Anführungszeichen passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("es")) {
        const stand = new Set(unlockedKeysAt(l.id));
        if (shiftUnlockedAt(l.id)) stand.add(SHIFT_UNIT);
        for (const w of beispielWoerter(ES_LEKTIONS_VORSPANN[l.id])) if (!wortTippbar(w, stand)) fehler.push(`${l.id}: "${w}"`);
      }
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: ein Wort mit einer späteren Taste und ein Grossbuchstabe vor Mayús fallen auf", () => {
    setLayout("es");
    expect(wortTippbar("Bogotá", new Set(unlockedKeysAt("es-pqb")))).toBe(false);
    expect(wortTippbar("más", new Set(unlockedKeysAt("es-frecuentes-4")))).toBe(false);
    expect(wortTippbar("más", new Set(unlockedKeysAt("es-tilde")))).toBe(true);
    expect(wortTippbar("Ana", new Set(unlockedKeysAt("es-tilde")))).toBe(false);
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("die Tilde: auf Spanien in der fila guía rechts von Ñ, auf Lateinamerika oben", () => {
    setLayout("es");
    const es = lessonById("es-tilde")!;
    expect(es.intro).toMatch(/La tilde "´": meñique derecho, a la derecha de Ñ\. Es una tecla muerta/);
    setLayout("latam");
    const latam = lessonById("es-tilde")!;
    expect(latam.intro).toMatch(/La tilde "´": meñique derecho, arriba/);
    expect(lessonIntroText(es, "latam")).toBe(latam.intro);
  });

  it("¿ und ¡ sind vertauscht: Spanien ¿ mit Mayús, Lateinamerika ¡ mit Mayús", () => {
    setLayout("es");
    expect(lessonById("es-interrogacion")!.intro).toMatch(/interrogación "¿": mantén pulsada Mayús/);
    expect(lessonById("es-exclamacion")!.intro).not.toMatch(/exclamación "¡": mantén pulsada Mayús/);
    setLayout("latam");
    expect(lessonById("es-interrogacion")!.intro).not.toMatch(/interrogación "¿": mantén pulsada Mayús/);
    expect(lessonById("es-exclamacion")!.intro).toMatch(/exclamación "¡": mantén pulsada Mayús/);
  });
});
