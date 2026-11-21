/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „it" (IT-S, 03.10.2026). Modell: `tests/tastenflow-lektionen-es.test.ts`.
 * Geprüft auf BEIDEN Pflicht-Tastaturen (`it` = Windows „Italiano" / Mac „Italiano - Pro", `it-qzerty` = Mac
 * „Italiano"), die Reihenfolge-Regel zusätzlich auf den Schweizer Tastaturen (Tessin, Graubünden):
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("it")` - jede Einheit hat ihre Lektion, keine
 *     Lektion greift vor; die achte Grundtaste je Tastatur (`ò` / `m`), das verdrängte `ò` nach `ì`.
 *  2. Eigene Lektionen für Maiusc, Punkt und Komma, è à, den Apostroph, é, ì ù, ? !.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen; Klammern und Anführungszeichen paarweise.
 *  4. Kein deutsches, englisches, französisches oder spanisches Wort in Titeln und Einführungen; kein
 *     Maus-Wort, kein „Lei", nie „alla cieca", kein Halbgeviertstrich.
 *  5. Jedes Beispielwort (zwischen geraden Anführungszeichen) ist an der Stelle seiner Lektion tippbar - nie
 *     ein grosser Akzentbuchstabe (Windows hat keinen).
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (é = Maiusc + è auf `it`, eigene Taste auf der QZERTY;
 *     Ziffern mit Maiuscole auf der QZERTY; Alt Gr / Opzione), die Schlusslektion sagt, was die Tastatur mit
 *     À È É Ì Ò Ù kann.
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
import { IT_LEKTIONS_IDS, itLektionsVorspannFuer } from "../src/lib/typing/curriculumIt";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { generateRound } from "../src/lib/typing/generator";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { fitText } from "../src/lib/typing/corpus";
import { isRealWord } from "../src/lib/typing/lexicon";
import { STUFE_VOCAB_IT, WORDS_IT } from "../src/lib/typing/wordsIt";

const IT_TASTATUREN: readonly LayoutId[] = ["it", "it-qzerty"];

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

/** Auf `it` und der QZERTY ist jeder kleine Akzentbuchstabe eine eigene Einheit (keine Totaste); Leerzeichen gibt es immer. */
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  if (/[ÀÈÉÌÒÙ]/.test(wort)) return false; // Windows hat keinen Weg zu ihnen
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

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „it“ - auf jeder Tastatur", () => {
  for (const t of [...IT_TASTATUREN, "ch-fr", "ch"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("it")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("it"), introOrder("it"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("it");
    const falsch = lektionenFuer("it").map((l) => (l.id === "it-frequenti-1" ? { ...l, newKeys: ["i", "r"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("it")).length).toBeGreaterThan(0);
  });

  it("24 Lektionen auf jeder Tastatur, IDs mit „it-“, eindeutig, gecacht", () => {
    expect(IT_LEKTIONS_IDS).toHaveLength(24);
    expect(new Set(IT_LEKTIONS_IDS).size).toBe(24);
    for (const t of IT_TASTATUREN) {
      setLayout(t);
      expect(lektionenFuer("it").map((l) => l.id), t).toEqual([...IT_LEKTIONS_IDS]);
      expect(lektionenFuer("it")).toBe(lektionenFuer("it"));
    }
  });

  it("die achte Grundtaste: `ò` auf `it`, `m` auf der QZERTY - dort kommt `ò` erst mit ì und ù", () => {
    setLayout("it");
    expect(lessonById("it-base-4")?.newKeys).toEqual(["a", "ò"]);
    expect(lessonById("it-mvp")?.newKeys).toEqual(["m", "v", "p"]);
    expect(lessonById("it-i-u-accentate")?.newKeys).toEqual(["ì", "ù"]);
    setLayout("it-qzerty");
    expect(lessonById("it-base-4")?.newKeys).toEqual(["a", "m"]);
    expect(lessonById("it-mvp")?.newKeys).toEqual(["v", "p"]);
    expect(lessonById("it-i-u-accentate")?.newKeys).toEqual(["ì", "ò", "ù"]);
    expect(lessonById("it-e-acuta")?.newKeys).toEqual(["é"]);
  });

  it("eigene Lektionen: Maiusc, . ,, è à, Apostroph, Q, é, ? !; Sonderzeichen je Tastatur", () => {
    setLayout("it");
    expect(lessonById("it-maiusc")?.enablesShift).toBe(true);
    expect(lessonById("it-punto-virgola")?.newKeys).toEqual([".", ","]);
    expect(lessonById("it-e-a-accentate")?.newKeys).toEqual(["è", "à"]);
    expect(lessonById("it-apostrofo")?.newKeys).toEqual(["'"]);
    expect(lessonById("it-q")?.newKeys).toEqual(["q"]);
    expect(lessonById("it-e-acuta")?.newKeys).toEqual(["é"]);
    expect(lessonById("it-domanda")?.newKeys).toEqual(["?", "!"]);
    expect(lessonById("it-simboli-2")?.newKeys).toEqual(["|", "€", "@", "#", "[", "]"]);
    expect(shiftUnlockedAt("it-mvp")).toBe(false);
    expect(shiftUnlockedAt("it-maiusc")).toBe(true);
    setLayout("it-qzerty");
    expect(lessonById("it-simboli-2")?.newKeys).toEqual(["|", "€", "@", "#", "{", "}"]);
    for (const t of IT_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("it")) expect(new Set(unlockedKeysWith(l.id, undefined, "it"))).toEqual(new Set(unlockedKeysAt(l.id)));
    }
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of IT_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("it")) {
        stand = introducedThroughLesson(stand, l.id, "it");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "it").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "it", lang: "it", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) if (!z.text.trim() || fitText(z.text, erlaubt, "it") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
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
  for (const t of IT_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      setLayout(t);
      const funde: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("it")) {
        stand = introducedThroughLesson(stand, l.id, "it");
        for (const stufe of ["kids", "teens", "erwachsen"] as const)
          for (let k = 0; k < 3; k++)
            for (const z of generateRound(l.id, { lernweg: "it", lang: "it", introduced: stand, stufe, count: 10 }))
              if (halbesPaar(z.text)) funde.push(`${l.id}/${stufe}: „${z.text}"`);
      }
      expect(funde).toEqual([]);
    });
  }

  it('Gegenprobe: „parola( casa“, „(casa“ und „dice "ciao“ fallen auf, „(casa) e "ciao"“ nicht', () => {
    expect(["parola( casa", "(casa", 'dice "ciao', '(casa) e "ciao"'].filter(halbesPaar)).toEqual(["parola( casa", "(casa", 'dice "ciao']);
  });
});

const IT_WOERTER = new Set<string>([
  ...WORDS_IT,
  ...Object.values(STUFE_VOCAB_IT).flat(),
  ...CORPUS_IT.flatMap((c) => c.text.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean)),
]);
function fremdesWort(wort: string): boolean {
  const w = wort.toLowerCase();
  if (w.length < 3 || IT_WOERTER.has(w) || isRealWord(w, "it")) return false;
  return isRealWord(w, "de") || isRealWord(w, "en") || isRealWord(w, "fr") || isRealWord(w, "es");
}

/** Häufige Wörter der Lektionstexte anderer Wege, die im Italienischen nie vorkommen. */
const NIE = new Set([
  "und", "der", "die", "mit", "ist", "nicht", "taste", "tasten", "finger", "zeigefinger", "reihe", "grundreihe",
  "umschalttaste", "links", "rechts", "the", "and", "with", "key", "keys", "row", "press", "hold", "shift", "left",
  "right", "your", "touche", "doigt", "rangée", "avec", "gauche", "droite", "clavier", "majuscule", "tecla", "dedo",
  "izquierda", "derecha", "teclado", "mayús", "pulsa", "mano izquierda",
]);

describe("★★★ Kein Deutsch, Englisch, Französisch oder Spanisch; Hausregeln", () => {
  it("Titel und Einführungen (beide Tastaturen): keine fremden Wörter, kein Maus-Wort, kein Lei, nie „alla cieca“, kein – —", () => {
    const funde: string[] = [];
    for (const t of IT_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("it"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          if (/[äößẞ–—’]/.test(text)) funde.push(`${t} ${l.id} ${feld}: Umlaut/ß/Strich/Apostroph`);
          // „Lei" (Höflichkeitsform) gross geschrieben - das Beispielwort „lei" (sie) ist erlaubt.
          if (/\bclic|\bclicca|\btocca|\btrascina|\bmouse\b|\bpremete\b|alla cieca|\bciechi\b|\bnon vedent/i.test(text) || /\bLei\b/.test(text))
            funde.push(`${t} ${l.id} ${feld}: Hausregel`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("Übungszeilen einer Runde je Lektion: kein deutsches, englisches, französisches oder spanisches Wort", () => {
    setLayout("it");
    const funde = new Set<string>();
    let stand: string[] | undefined;
    for (const l of lektionenFuer("it")) {
      stand = introducedThroughLesson(stand, l.id, "it");
      for (const stufe of ["kids", "teens", "erwachsen"] as const)
        for (const z of generateRound(l.id, { lernweg: "it", lang: "it", introduced: stand, stufe, count: 10 })) {
          if (z.art === "unsinn") continue; // Übungssilben sind Kunstwörter
          for (const w of z.text.split(/[^\p{L}]+/u).filter(Boolean)) if (fremdesWort(w)) funde.add(`${l.id}: ${w}`);
        }
    }
    expect([...funde]).toEqual([]);
  });

  it("Gegenprobe: eine deutsche, eine englische Zeile und eine Hausregel fallen auf", () => {
    expect("Der Hund und die Katze spielen".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect("The children play with their friends".split(" ").filter(fremdesWort).length).toBeGreaterThan(1);
    expect(/\bclic|\bclicca|\btocca/i.test("Fai clic sul pulsante")).toBe(true);
    expect(/alla cieca/i.test("scrivere alla cieca")).toBe(true);
    expect(/\bLei\b/.test("Lei può premere Invio")).toBe(true);
    expect(/\bLei\b/.test('"lei", "sei"')).toBe(false);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("it");
    expect(lektionenFuer("it").flatMap((l) => beispielWoerter(itLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(100);
  });

  for (const t of IT_TASTATUREN) {
    it(`${t}: jedes Wort zwischen Anführungszeichen passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("it")) {
        const stand = new Set(unlockedKeysAt(l.id));
        if (shiftUnlockedAt(l.id)) stand.add(SHIFT_UNIT);
        for (const w of beispielWoerter(itLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, stand)) fehler.push(`${l.id}: "${w}"`);
      }
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: ein Wort mit einer späteren Taste, ò vor ì auf der QZERTY, ein Grossbuchstabe vor Maiusc und È fallen auf", () => {
    setLayout("it");
    expect(wortTippbar("Genova", new Set(unlockedKeysAt("it-mvp")))).toBe(false);
    expect(wortTippbar("città", new Set(unlockedKeysAt("it-ghbz")))).toBe(false);
    expect(wortTippbar("città", new Set(unlockedKeysAt("it-e-a-accentate")))).toBe(true);
    expect(wortTippbar("Anna", new Set(unlockedKeysAt("it-mvp")))).toBe(false);
    expect(wortTippbar("È", new Set([...unlockedKeysAt("it-testi"), SHIFT_UNIT]))).toBe(false);
    expect(wortTippbar("falò", new Set(unlockedKeysAt("it-base-4")))).toBe(true);
    setLayout("it-qzerty");
    expect(wortTippbar("falò", new Set(unlockedKeysAt("it-base-4")))).toBe(false);
    expect(wortTippbar("però", new Set(unlockedKeysAt("it-i-u-accentate")))).toBe(true);
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("é: auf `it` Maiusc + è, auf der QZERTY eine eigene Taste", () => {
    setLayout("it");
    const it_ = lessonById("it-e-acuta")!;
    expect(it_.intro).toMatch(/La é: tieni premuto il tasto Maiusc dell'altra mano e premi è \(mignolo destro/);
    setLayout("it-qzerty");
    const qz = lessonById("it-e-acuta")!;
    expect(qz.intro).toMatch(/La é: mignolo destro, nella riga dei numeri/);
    expect(lessonIntroText(it_, "it-qzerty")).toBe(qz.intro);
  });

  it("Ziffern: auf `it` ohne Maiusc, auf der QZERTY mit Maiuscole (1 = Maiuscole + &)", () => {
    setLayout("it");
    expect(lessonById("it-numeri")!.intro).toMatch(/si scrivono senza Maiusc/);
    setLayout("it-qzerty");
    expect(lessonById("it-numeri")!.intro).toMatch(/1 = Maiuscole \+ &/);
  });

  it("dritte Ebene: `it` nennt Alt Gr und Opzione, die QZERTY nur Opzione", () => {
    setLayout("it");
    expect(lessonById("it-simboli-2")!.intro).toMatch(/"€": tieni premuto Alt Gr \(sul Mac: Opzione\) e premi E/);
    setLayout("it-qzerty");
    expect(lessonById("it-simboli-2")!.intro).toMatch(/"€": tieni premuto Opzione e premi I/);
    expect(lessonById("it-simboli-2")!.intro).not.toMatch(/Alt Gr/);
  });

  it("die Schlusslektion: Windows nie, Mac Opzione + Maiuscole", () => {
    setLayout("it");
    const testi = lessonById("it-testi")!;
    expect(testi.kind).toBe("text");
    expect(testi.intro).toMatch(/Su Windows la tastiera italiana non ha le maiuscole accentate/);
    expect(testi.intro).toMatch(/Opzione e Maiuscole/);
    setLayout("it-qzerty");
    expect(lessonById("it-testi")!.intro).not.toMatch(/Windows/);
    expect(lessonById("it-testi")!.intro).toMatch(/Opzione \+ 9 e Opzione \+ 0/);
  });
});
