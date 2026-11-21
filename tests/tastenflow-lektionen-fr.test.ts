/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „fr" (E10b-2, 26.09.2026).
 *
 * Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §8.2, gebaut in
 * `src/lib/typing/curriculumFr.ts`. Geprüft wird auf JEDER französischen
 * Tastatur (Frankreich, Belgien, Schweiz-Französisch, zwei Kanada):
 *
 *  1. Jede Lektion führt nur Tasten ein, die in der Reihenfolge des Weges bis
 *     dahin dran sind - die Tasten aller Lektionen hintereinander SIND die
 *     Einführungsreihenfolge `introOrder("fr")` dieser Tastatur, Stück für
 *     Stück. (Anders als Weg „en", der innerhalb der Häufigkeitsbuchstaben
 *     umsortiert - für „fr" ausdrücklich verlangt.)
 *  2. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen (eine echte
 *     Generator-Runde, der Tastenstand eines Kindes, das den Lehrgang der
 *     Reihe nach geht).
 *  3. Keine deutschen und englischen Wörter in Titeln, Einführungen und
 *     Übungszeilen.
 *  4. Jedes Beispielwort einer Einführung (zwischen « ») ist an der Stelle
 *     der Lektion tippbar - auf jeder Tastatur.
 *
 * Mit Gegenproben: eine Lektion, die vorgreift, und ein Beispielwort, das zu
 * früh kommt, werden gefunden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, setzeLayoutPlattform, type LayoutId } from "../src/lib/typing/layouts";
import {
  EN_LESSONS,
  LESSONS,
  frLessons,
  introducedThroughLesson,
  lektionenFuer,
  lessonById,
  lessonDoneByStoff,
  lessonIntroText,
  lessonsDoneCount,
  shiftUnlockedAt,
  unlockedKeysAt,
  unlockedKeysWith,
  type Lesson,
} from "../src/lib/typing/curriculum";
import { FR_LEKTIONS_IDS, FR_LEKTIONS_VORSPANN, frLektionsVorspannFuer } from "../src/lib/typing/curriculumFr";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { generateRound } from "../src/lib/typing/generator";
import { CORPUS_FR, fitText } from "../src/lib/typing/corpus";
import { isRealWord } from "../src/lib/typing/lexicon";
import { STUFE_VOCAB_FR, WORDS_FR } from "../src/lib/typing/wordsFr";
import { emptyProgress, type LetterStat, type TypingProgress } from "../src/lib/typing/progress";

const FR_TASTATUREN: readonly LayoutId[] = ["fr", "be", "ch-fr", "ca-csa", "ca-fr"];

afterEach(() => setLayout("de"));

/** Die Einheiten einer Lektion, wie sie in den Tastenstand gehen (⇧ für Maj). */
function einheiten(l: Lesson): string[] {
  // ★ S2 (26.09.2026): „⇧" eröffnet seine Lektion - auf Kanada folgt ihm dort
  // der Apostroph (Maj + ,).
  return l.enablesShift ? [SHIFT_UNIT, ...l.newKeys] : [...l.newKeys];
}

/** Hintereinander gelegt: sind die Lektionen genau die Reihenfolge, Stück für Stück? */
function folgtDerReihenfolge(lektionen: readonly Lesson[], reihenfolge: readonly string[]): string[] {
  const fehler: string[] = [];
  let i = 0;
  for (const l of lektionen) {
    for (const u of einheiten(l)) {
      if (reihenfolge[i] !== u) fehler.push(`${l.id}: „${u}" an Stelle ${i + 1}, dran wäre „${reihenfolge[i]}"`);
      i += 1;
    }
  }
  if (i !== reihenfolge.length) fehler.push(`${i} Einheiten in den Lektionen, ${reihenfolge.length} in der Reihenfolge`);
  return fehler;
}

/** Ist ein Beispielwort mit diesen Einheiten tippbar? (Totasten-Buchstaben über ^ / ¨.) */
const TOTASTE: Record<string, [string, string]> = {
  ê: ["^", "e"], â: ["^", "a"], î: ["^", "i"], ô: ["^", "o"], û: ["^", "u"],
  ë: ["¨", "e"], ï: ["¨", "i"], ü: ["¨", "u"], ÿ: ["¨", "y"],
};
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  for (const ch of wort) {
    const c = ch.toLowerCase();
    if (stand.has(c)) continue;
    const tot = TOTASTE[c];
    if (tot && stand.has(tot[0]) && stand.has(tot[1])) continue;
    return false;
  }
  return true;
}

/** Die Beispielwörter zwischen « » - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/«\s*([^»]+?)\s*»/g)].map((m) => m[1].trim()).filter((w) => /\p{L}/u.test(w));
}

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „fr“ - auf jeder Tastatur", () => {
  for (const tastatur of FR_TASTATUREN) {
    it(`${tastatur}: die Tasten aller Lektionen hintereinander sind introOrder("fr")`, () => {
      setLayout(tastatur);
      expect(folgtDerReihenfolge(lektionenFuer("fr"), introOrder("fr"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("fr");
    const echt = lektionenFuer("fr");
    const vorgreifend = echt.map((l) => (l.id === "fr-frequentes-1" ? { ...l, newKeys: ["e", "r"] } : l));
    expect(folgtDerReihenfolge(vorgreifend, introOrder("fr")).length).toBeGreaterThan(0);
  });

  it("AZERTY: 24 Lektionen, ohne die Lektion „q m“; Schweiz und Kanada: 25, mit ihr", () => {
    setLayout("fr");
    expect(lektionenFuer("fr").map((l) => l.id)).toEqual(FR_LEKTIONS_IDS.filter((id) => id !== "fr-q-m"));
    for (const t of ["ch-fr", "ca-csa", "ca-fr"] as const) {
      setLayout(t);
      const ids = lektionenFuer("fr").map((l) => l.id);
      expect(ids, t).toEqual([...FR_LEKTIONS_IDS]);
      // ★ S1 (26.09.2026): „m" kommt dort direkt nach „p" (E5 §8.2) - in „p c v".
      expect(lessonById("fr-q-m")?.newKeys, t).toEqual(["q"]);
      expect(lessonById("fr-pcv")?.newKeys, t).toEqual(["p", "m", "c", "v"]);
      // Die Grundreihe dieser Tastatur: erste Taste „a", kein „a" mehr bei den Häufigen.
      expect(lessonById("fr-base-1")?.newKeys, t).toEqual(["f", "j"]);
      expect(lessonById("fr-frequentes-3")?.newKeys, t).toEqual(["i"]);
    }
  });

  it("frLessons() ist die AZERTY-Grundform und lektionenFuer liefert je Tastatur dieselbe Liste", () => {
    setLayout("fr");
    expect(lektionenFuer("fr")).toBe(frLessons());
    expect(lektionenFuer("fr")).toBe(lektionenFuer("fr"));
    expect(lektionenFuer("de")).toBe(LESSONS);
    expect(lektionenFuer("en")).toBe(EN_LESSONS);
  });
});

describe("★★★ IDs: eigenes Präfix, disjunkt zu „de“ und „en“", () => {
  it("jede ID trägt „fr-“, keine kommt doppelt oder in einer anderen Liste vor", () => {
    expect(new Set(FR_LEKTIONS_IDS).size).toBe(FR_LEKTIONS_IDS.length);
    const andere = new Set([...LESSONS, ...EN_LESSONS].map((l) => l.id));
    for (const id of FR_LEKTIONS_IDS) {
      expect(id.startsWith("fr-"), id).toBe(true);
      expect(andere.has(id), id).toBe(false);
    }
  });

  it("die Tastenstand-Funktionen finden die französischen Lektionen an der ID", () => {
    setLayout("fr");
    expect(new Set(unlockedKeysAt("fr-base-1"))).toEqual(new Set(["f", "j"]));
    expect(shiftUnlockedAt("fr-elision")).toBe(false);
    expect(shiftUnlockedAt("fr-maj")).toBe(true);
    for (const l of lektionenFuer("fr"))
      expect(new Set(unlockedKeysWith(l.id, undefined, "fr"))).toEqual(new Set(unlockedKeysAt(l.id)));
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const tastatur of ["fr", "ch-fr", "ca-csa"] as const) {
    it(`${tastatur}: eine ganze Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(tastatur);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("fr")) {
        stand = introducedThroughLesson(stand, l.id, "fr");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "fr").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "fr", lang: "fr", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) {
            if (!z.text.trim()) fehler.push(`${l.id}/${stufe}: leere Zeile`);
            if (fitText(z.text, erlaubt, "fr") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
          }
        }
      }
      expect(fehler).toEqual([]);
    });
  }
});

/**
 * Der französische Wortschatz, aus dem die Runden schöpfen: der Korpus „fr",
 * `WORDS_FR` und das Lexikon. Ein Wort gilt als „fremd", wenn Deutsch oder
 * Englisch es kennen, dieser Wortschatz aber nicht - so fällt eine Zeile aus
 * einer falschen Quelle auf, ohne dass ein französisches Wort wie „talent"
 * (auch englisch) oder ein Name wie „Nadia" anschlägt.
 */
const FR_WOERTER = new Set<string>([
  ...WORDS_FR,
  // Der Generator zieht je Altersstufe auch aus STUFE_VOCAB_FR („science",
  // teens) - ohne diese Liste schlug der Wächter zufällig an, je nachdem, ob
  // die gewürfelte Runde ein solches Wort traf (60 Runden gemessen 27.09.:
  // nur „science"/„Science", beide aus dieser Liste).
  ...Object.values(STUFE_VOCAB_FR).flat(),
  ...CORPUS_FR.flatMap((c) => c.text.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean)),
]);
function fremdesWort(wort: string): boolean {
  const w = wort.toLowerCase();
  if (w.length < 3) return false;
  if (FR_WOERTER.has(w) || isRealWord(w, "fr")) return false;
  // Ein grosser Anfangsbuchstabe mit Akzent wird auf Windows-AZERTY per Ersatz
  // ohne Akzent gezeigt (É → E, F5): „Énergie" steht dort als „Energie" - ein
  // französisches Wort, kein deutsches. Mit Akzent gegenprüfen.
  if (/^[A-Z]/.test(wort) && ["é", "è", "ê", "à", "â", "î", "ô", "û", "ç"].some((a) => isRealWord(a + w.slice(1), "fr"))) {
    return false;
  }
  return isRealWord(w, "de") || isRealWord(w, "en");
}

/**
 * Wörter, die in einer französischen Einführung nie stehen dürfen - die
 * häufigsten deutschen und englischen Wörter der Lektionstexte beider Wege
 * (Taste, Finger, Reihe …). Die Einführungen sind aus Schablonen gebaut; ein
 * Rest der deutschen oder englischen Schablone fiele hier auf.
 */
const NIE_IN_EINER_EINFUEHRUNG = new Set([
  "und", "der", "die", "das", "mit", "ist", "nicht", "auf", "ein", "eine", "taste", "tasten",
  "finger", "zeigefinger", "mittelfinger", "reihe", "grundreihe", "umschalttaste", "links", "rechts",
  "the", "and", "with", "key", "keys", "row", "press", "hold", "shift", "left", "right", "your",
]);

describe("★★★ Kein Deutsch und kein Englisch in den französischen Lektionen", () => {
  it("Titel und Einführungen: keine Umlaute/ß, keine deutschen oder englischen Wörter", () => {
    const funde: string[] = [];
    for (const t of FR_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("fr")) {
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          // „ü" steht als Beispiel des Trémas im Titel („ë, ï, ü") - Französisch.
          if (/[äößÄÖẞ]/.test(text)) funde.push(`${t} ${l.id} ${feld}: Umlaut/ß`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean))
            if (NIE_IN_EINER_EINFUEHRUNG.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
      }
    }
    expect(funde).toEqual([]);
  });

  it("Übungszeilen einer Runde je Lektion: kein deutsches oder englisches Wort", () => {
    setLayout("fr");
    const funde = new Set<string>();
    let stand: string[] | undefined;
    for (const l of lektionenFuer("fr")) {
      stand = introducedThroughLesson(stand, l.id, "fr");
      for (const stufe of ["kids", "teens", "erwachsen"] as const) {
        for (const z of generateRound(l.id, { lernweg: "fr", lang: "fr", introduced: stand, stufe, count: 10 })) {
          // Übungssilben („unsinn") sind Kunstwörter - dass eine zufällig ein
          // deutsches oder englisches Wort ergibt („fee", „men"), ist kein
          // Rückfall auf eine fremde Quelle. Geprüft wird jede ECHTE Zeile.
          if (z.art === "unsinn") continue;
          for (const w of z.text.split(/[^\p{L}]+/u).filter(Boolean)) if (fremdesWort(w)) funde.add(`${l.id}: ${w}`);
        }
      }
    }
    // Die Grundreihe hat keinen Vokal: dort gibt es nur Silben, auch ohne Etikett.
    const echt = [...funde].filter((f) => !/^fr-base-\d: [qsdfjklm]{1,3}$/.test(f));
    expect(echt).toEqual([]);
  });

  it("Gegenprobe: eine deutsche und eine englische Zeile fallen auf", () => {
    const de = "Der Hund und die Katze spielen".split(" ").filter(fremdesWort);
    const en = "The children play with their friends".split(" ").filter(fremdesWort);
    expect(de.length).toBeGreaterThan(1);
    expect(en.length).toBeGreaterThan(1);
  });
  it("Gegenprobe Ersatz: „Energie\" (aus „Énergie\", Windows-AZERTY) ist französisch, „Hund\" bleibt deutsch", () => {
    expect(fremdesWort("Energie")).toBe(false);
    expect(fremdesWort("Hund")).toBe(true);
    // „science" steht nur in STUFE_VOCAB_FR (nicht im Lexikon) - der Grund des Wackelns bis 27.09.
    expect(fremdesWort("Science")).toBe(false);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    const alle = FR_LEKTIONS_IDS.flatMap((id) => beispielWoerter(FR_LEKTIONS_VORSPANN[id]));
    expect(alle.length).toBeGreaterThan(80);
  });

  for (const tastatur of FR_TASTATUREN) {
    it(`${tastatur}: jedes Wort zwischen « » passt zum Tastenstand der Lektion`, () => {
      setLayout(tastatur);
      const fehler: string[] = [];
      for (const l of lektionenFuer("fr")) {
        const stand = new Set(unlockedKeysAt(l.id));
        // ★ S1/S2: der Absatz, den DIESE Tastatur zeigt (Kanada: Apostroph erst bei Maj).
        for (const w of beispielWoerter(frLektionsVorspannFuer(l.id, l.newKeys)))
          if (!wortTippbar(w, stand)) fehler.push(`${l.id}: « ${w} »`);
      }
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: ein Wort mit einer späteren Taste fällt auf", () => {
    setLayout("fr");
    expect(wortTippbar("bon", new Set(unlockedKeysAt("fr-pcv")))).toBe(false);
    expect(wortTippbar("fête", new Set(unlockedKeysAt("fr-a-grave")))).toBe(false);
    expect(wortTippbar("fête", new Set(unlockedKeysAt("fr-circonflexe")))).toBe(true);
  });
});

describe("★★ Einführungen je Tastatur", () => {
  it("lessonIntroText liefert für jede Tastatur deren eigene Einführung", () => {
    setLayout("fr");
    const azerty = lektionenFuer("fr").find((l) => l.id === "fr-ponctuation-1")!;
    setLayout("ch-fr");
    const schweiz = lektionenFuer("fr").find((l) => l.id === "fr-ponctuation-1")!;
    expect(lessonIntroText(azerty, "ch-fr")).toBe(schweiz.intro);
    expect(lessonIntroText(azerty, "fr")).toBe(azerty.intro);
    // AZERTY: der Punkt braucht Maj, auf der Schweizer Tastatur nicht.
    expect(azerty.intro).toMatch(/Le point « \. » : garde Maj/);
    expect(schweiz.intro).not.toMatch(/Le point « \. » : garde Maj/);
  });

  it("die Ziffern: auf AZERTY mit Maj, auf Schweiz/Kanada ohne", () => {
    setLayout("fr");
    expect(lessonById("fr-chiffres")!.intro).toMatch(/AVEC Maj/);
    setLayout("ch-fr");
    expect(lessonById("fr-chiffres")!.intro).toMatch(/sans Maj/);
  });

  it("★ W1: Les majuscules accentuées - je Tastatur der Windows-Weg, nichts ersetzt", () => {
    // ★ W1 (27.09.2026, Johannes §3.8): die späte, eigene Lektion. Auf AZERTY
    // Frankreich À È Ù über die Gravis-Totaste (Alt Gr + 7), É und Ç gibt es
    // nicht (keine Texte damit) - bis W1: „Tastenflow écrit E".
    setzeLayoutPlattform("windows");
    setLayout("fr");
    const fr = lessonById("fr-typographie")!;
    expect(fr.title).toBe("Les majuscules accentuées, œ et « »");
    expect(fr.intro).toMatch(/À, È et Ù : la touche morte accent grave \(Alt Gr \+ 7\)/);
    expect(fr.intro).toMatch(/É et Ç n'existent pas sur ce clavier/);
    expect(fr.intro).not.toMatch(/écrit E /);
    setLayout("be");
    expect(lessonById("fr-typographie")!.intro).toMatch(/É : la touche morte accent aigu \(Alt Gr \+ ù\)/);
    setLayout("ch-fr");
    expect(lessonById("fr-typographie")!.intro).toMatch(/É : la touche morte accent aigu \(Alt Gr \+ '\)/);
    setLayout("ca-csa");
    expect(lessonById("fr-typographie")!.intro).toMatch(/À, É, È, Ù et Ç : Maj de l'autre main et la lettre/);
    setzeLayoutPlattform(null);
  });
});

describe("★★ Abzeichen-Zählung: die Lektionen des Weges „fr“", () => {
  function sitzt(): LetterStat {
    return { hits: 40, misses: 0, sumMs: 40 * 300, timed: 40, recent: Array(20).fill(300) };
  }
  it("wer alle Einheiten solide geübt hat, hat alle französischen Lektionen über den Stoff", () => {
    setLayout("fr");
    const alle = introOrder("fr");
    const letters: Record<string, LetterStat> = {};
    for (const u of alle) letters[u] = sitzt();
    const p: TypingProgress = { ...emptyProgress(), introduced: alle, letters };
    expect(lessonsDoneCount(p, "fr")).toBe(lektionenFuer("fr").length);
    expect(lessonDoneByStoff(p, "fr-typographie", "fr")).toBe(true);
    expect(lessonsDoneCount(emptyProgress(), "fr")).toBe(0);
  });
});
