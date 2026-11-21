/**
 * ★★★★★ WÄCHTER: die Lektionsfolge des Weges „en" (E6c, 24.09.2026).
 *
 * Bauplan `apps/tastenflow/BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md` §4 - eine
 * EIGENE Lektionsfolge nach US/UK-Tastenreihen für Weg „en"
 * ({@link EN_LESSONS}, `curriculum.ts`). Dieser Wächter spiegelt für Weg „en"
 * dieselben Eigenschaften, die für Weg „de" gelten (Deckung der Reihenfolge,
 * Tastenstand-Funktionen), UND prüft die drei Punkte, die nur „en" betreffen:
 * kein ä ö ü ß, eigene IDs, und der layout-abhängige Griff des
 * Anführungszeichens (US: Shift + Apostroph-Taste, UK: Shift + 2).
 *
 * Die Wächter der Expedition (§6.3) stehen hier ebenfalls: kein deutsches
 * Stationswort auf Weg „en", keine deutsche Höhlenwesen-Stimme dort, das
 * gelöste Funkspruch-Wort in der Übungssprache.
 *
 * Der deutsche Weg bleibt unangetastet - siehe
 * `tests/tastenflow-lernweg-de-unveraendert.test.ts` (Golden-Datei) und
 * `tests/typing-lektion-tastenstand.test.ts` (unverändert grün).
 */
import { describe, expect, it } from "vitest";
import {
  EN_LESSONS,
  LESSONS,
  type Lesson,
  lektionenFuer,
  lessonById,
  lessonDoneByStoff,
  lessonIntroText,
  lessonOpen,
  lessonsDoneCount,
  unlockedKeysAt,
  unlockedKeysWith,
  introducedThroughLesson,
} from "../src/lib/typing/curriculum";
import { SHIFT_UNIT } from "../src/lib/typing/letters";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { emptyProgress, type LetterStat, type TypingProgress } from "../src/lib/typing/progress";
import { stationGuessWords, WORDS_EN } from "../src/lib/typing/expedition/words";
import { WORDS } from "../src/lib/typing/words";
import { caveAnnouncement, stationWordLang } from "../src/components/typing/expedition/useExpedition";

const UMLAUT_ESZETT = /[äöüßÄÖÜẞ]/;

/**
 * Wie oft jede Einheit einer Reihenfolge in den `newKeys` (plus `enablesShift`
 * ⇒ {@link SHIFT_UNIT}) der übergebenen Lektionen vorkommt - Grundlage der
 * „genau einmal"-Prüfung (mirror für „de" und „en").
 */
function unitCounts(lessons: readonly Lesson[]): Map<string, number> {
  const zaehler = new Map<string, number>();
  for (const l of lessons) {
    const einheiten = l.enablesShift ? [...l.newKeys, SHIFT_UNIT] : l.newKeys;
    for (const u of einheiten) zaehler.set(u, (zaehler.get(u) ?? 0) + 1);
  }
  return zaehler;
}

function deckungGenauEinmal(lessons: readonly Lesson[], order: readonly string[]) {
  const zaehler = unitCounts(lessons);
  const fehlend = order.filter((u) => !zaehler.has(u));
  const doppelt = order.filter((u) => (zaehler.get(u) ?? 0) > 1);
  const ueberzaehlig = [...zaehler.keys()].filter((u) => !order.includes(u));
  return { fehlend, doppelt, ueberzaehlig };
}

describe("★★★★★ Weg „en\" - die Lektionsfolge deckt introOrder(\"en\") genau einmal", () => {
  // ⚠️ Verglichen wird gegen die KANONISCHE Reihenfolge (`lernwegDef(...).introOrder`),
  // nicht gegen die layout-gefilterte `introOrder(lernweg)` aus letters.ts: die
  // ersetzt auf Weg „en" die 8. Grundtaste „;" durch „ö", sobald eine DE/CH-
  // Tastatur aktiv ist (`achteGrundtasteFuerLayout`, F3) - das ist eine Frage
  // der AKTIVEN Tastatur zur Laufzeit, nicht der Lektionsdaten selbst.
  it("wie beim deutschen Weg (Spiegel-Probe, damit der Massstab stimmt)", () => {
    const r = deckungGenauEinmal(LESSONS, lernwegDef("de").introOrder);
    expect(r).toEqual({ fehlend: [], doppelt: [], ueberzaehlig: [] });
  });

  it("jede Einheit der kanonischen Reihenfolge von Weg \"en\" kommt in EN_LESSONS genau einmal vor", () => {
    const r = deckungGenauEinmal(EN_LESSONS, lernwegDef("en").introOrder);
    expect(r).toEqual({ fehlend: [], doppelt: [], ueberzaehlig: [] });
  });

  it("lektionenFuer gibt die richtige Liste - keine zweite Kopie", () => {
    expect(lektionenFuer("de")).toBe(LESSONS);
    expect(lektionenFuer("en")).toBe(EN_LESSONS);
  });
});

describe("★★★ kein ä ö ü ß in der englischen Lektionsfolge", () => {
  it("weder in newKeys, title, intro noch introByLayout", () => {
    const funde: string[] = [];
    for (const l of EN_LESSONS) {
      for (const k of l.newKeys) if (UMLAUT_ESZETT.test(k)) funde.push(`${l.id} newKeys:${k}`);
      if (UMLAUT_ESZETT.test(l.title)) funde.push(`${l.id} title`);
      if (UMLAUT_ESZETT.test(l.intro)) funde.push(`${l.id} intro`);
      for (const [layout, text] of Object.entries(l.introByLayout ?? {}))
        if (UMLAUT_ESZETT.test(text)) funde.push(`${l.id} introByLayout.${layout}`);
    }
    expect(funde).toEqual([]);
  });

  it("y und z stehen an ihrem eigenen (englischen) Platz, nicht am deutschen", () => {
    // Deutsch: y kommt spät (nach x, vor q, vor ß); Englisch: y ist Teil der
    // gemessenen Sprosse 17-19 (§3.3a), deutlich früher als im deutschen Weg.
    const enOrder = lernwegDef("en").letterOrder;
    const deOrder = lernwegDef("de").letterOrder;
    expect(enOrder.indexOf("y")).toBeLessThan(deOrder.indexOf("y"));
    expect(enOrder.includes("z")).toBe(true);
  });
});

describe("★★★ Lektions-IDs: eindeutig und disjunkt zwischen den Wegen", () => {
  it("alle en-IDs tragen das Präfix „en-\" und sind untereinander eindeutig", () => {
    const ids = EN_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith("en-")).toBe(true);
  });

  it("keine en-ID kommt auch in der deutschen Liste vor (und umgekehrt)", () => {
    const deIds = new Set(LESSONS.map((l) => l.id));
    for (const l of EN_LESSONS) expect(deIds.has(l.id)).toBe(false);
    const enIds = new Set(EN_LESSONS.map((l) => l.id));
    for (const l of LESSONS) expect(enIds.has(l.id)).toBe(false);
  });

  it("lessonById findet jede Lektion in ihrer eigenen Liste, an der ID erkannt", () => {
    expect(lessonById("home-fj")?.title).toContain("F");
    expect(lessonById("en-home-fj")?.title).toBe("Home row: F and J");
    expect(lessonById("en-nichts-da")).toBeUndefined();
  });
});

describe("★★★ das Anführungszeichen: US und UK greifen verschieden zu", () => {
  const quote = EN_LESSONS.find((l) => l.id === "en-quote")!;

  it("die Lektion existiert und führt genau \" ein", () => {
    expect(quote).toBeDefined();
    expect(quote.newKeys).toEqual(['"']);
  });

  it("die Einführungstexte für US und UK unterscheiden sich", () => {
    const us = lessonIntroText(quote, "us");
    const uk = lessonIntroText(quote, "uk");
    expect(us).not.toBe(uk);
    expect(us.toLowerCase()).toContain("apostrophe");
    expect(uk).toMatch(/\b2\b/);
    expect(us).not.toMatch(/\b2\b/);
  });

  it("ein Layout ohne eigene Fassung (z. B. de) bekommt den allgemeinen Text", () => {
    expect(lessonIntroText(quote, "de")).toBe(quote.intro);
  });
});

describe("★★★ Tastenstand-Funktionen tragen auch für Weg „en\" (Spiegel der de-Prüfung)", () => {
  it("unlockedKeysWith ohne introduced identisch mit unlockedKeysAt", () => {
    for (const l of EN_LESSONS) {
      expect(new Set(unlockedKeysWith(l.id, undefined, "en"))).toEqual(
        new Set(unlockedKeysAt(l.id)),
      );
    }
  });

  it("unlockedKeysAt wächst kumulativ mit der englischen Reihenfolge", () => {
    expect(new Set(unlockedKeysAt("en-home-fj"))).toEqual(new Set(["f", "j"]));
    const nachGrundreihe = new Set(unlockedKeysAt("en-home-complete"));
    for (const k of ["f", "j", "d", "k", "s", "l", "a", ";"]) expect(nachGrundreihe.has(k)).toBe(true);
    expect(nachGrundreihe.has("e")).toBe(false); // e kommt erst danach
  });

  it("lessonOpen: die erste Lektion ist immer offen, die Reihenfolge sperrt danach", () => {
    expect(lessonOpen(emptyProgress(), "en-home-fj")).toBe(true);
    const nachFj = introducedThroughLesson(undefined, "en-home-fj", "en");
    const p: TypingProgress = { ...emptyProgress(), introduced: nachFj };
    // Frisch aus introducedThroughLesson - ohne Anschlag-Statistik gilt das
    // Start-Geschenk (INITIAL_LETTERS) nicht als „gelernt" (siehe curriculum.ts).
    expect(lessonOpen(p, "en-home-dk")).toBe(false);
  });
});

/** Für jede Einheit eine solide (bridgeLearned-taugliche) Anschlag-Statistik. */
function geuebt(units: readonly string[]): Record<string, LetterStat> {
  const out: Record<string, LetterStat> = {};
  for (const u of units) out[u] = { hits: 10, misses: 0, sumMs: 0, timed: 0 };
  return out;
}

describe("★★★ lessonsDoneCount liest die Liste DES WEGES, nicht immer LESSONS", () => {
  it("ohne Fortschritt bleibt die Zahl innerhalb der jeweils eigenen Liste", () => {
    const leer = emptyProgress();
    expect(lessonsDoneCount(leer, "de")).toBeLessThanOrEqual(LESSONS.length);
    expect(lessonsDoneCount(leer, "en")).toBeLessThanOrEqual(EN_LESSONS.length);
  });

  it("solide geübte Grundreihe + Häufigkeitsbuchstaben zählt die englischen Lektionen mit, nicht die deutschen", () => {
    // Bewusst nur ASCII-Einheiten (f j d k s l a ; e i n r t h o), die es auf
    // JEDER Tastatur gibt (layouts.ts `missing` nennt nie „;" oder die
    // englischen Buchstaben) - unabhängig vom aktiven Testlayout.
    const bisShift = lernwegDef("en").letterOrder.slice(0, 15); // vor der Umschalttaste
    const p: TypingProgress = {
      ...emptyProgress(),
      introduced: [...bisShift],
      letters: geuebt(bisShift),
    };
    // Die vier Grundreihen- + drei Häufigkeits-Lektionen (en-home-* × 4,
    // en-freq-ei/rt/ho) gelten als Stoff-erledigt - „en-freq-n" (n) NICHT,
    // weil „n" nicht in `bisShift` steckt... aber n IST in bisShift (15
    // Einheiten enthalten n). Alle 8 Lektionen bis vor Shift sind also fertig.
    expect(lessonDoneByStoff(p, "en-home-fj", "en")).toBe(true);
    expect(lessonDoneByStoff(p, "en-freq-n", "en")).toBe(true);
    expect(lessonDoneByStoff(p, "en-shift", "en")).toBe(false); // Shift selbst fehlt
    const anzahlEn = lessonsDoneCount(p, "en");
    expect(anzahlEn).toBeGreaterThanOrEqual(8);
    expect(anzahlEn).toBeLessThanOrEqual(EN_LESSONS.length);
    // Dieselben (deutschen) Einheiten sagen für den DEUTSCHEN Weg nichts -
    // die Lektionen sind andere IDs mit anderen Tastenpaaren.
    expect(lessonsDoneCount({ ...emptyProgress() }, "de")).toBeLessThan(anzahlEn);
  });
});

describe("★★★ Expedition auf Weg „en\": nie ein deutsches Stationswort", () => {
  it("stationGuessWords liefert bei lernweg \"en\" ausschliesslich Wörter aus WORDS_EN", () => {
    // ⚠️ NICHT gegen die deutsche Liste ausschliessen: einzelne Wörter (z. B.
    // „wind") schreiben sich in beiden Sprachen zufällig gleich - das ist kein
    // Fehler. Die eigentliche Prüfung: JEDES gelieferte Wort kommt aus
    // WORDS_EN, nie aus einer anderen Quelle (also auch nicht aus WORDS).
    const enWordSet = new Set(WORDS_EN.map((w) => w.toLowerCase()));
    const introduced = [...lernwegDef("en").letterOrder];
    for (let seed = 0; seed < 12; seed++) {
      const words = stationGuessWords(introduced, { count: 3, seed, lernweg: "en" });
      for (const w of words) {
        expect(enWordSet.has(w.toLowerCase()), `„${w}" nicht in WORDS_EN`).toBe(true);
      }
    }
  });

  it("ohne lernweg (Alt-Verhalten) bleibt es bei den deutschen Wörtern", () => {
    const introduced = [...lernwegDef("de").letterOrder];
    const words = stationGuessWords(introduced, { count: 3, seed: 0 });
    const deWordSet = new Set(WORDS.map((w) => w.toLowerCase()));
    for (const w of words) expect(deWordSet.has(w.toLowerCase())).toBe(true);
  });
});

describe("★★★ Höhlenwesen auf Weg „en\": kein deutsches Sample/keine deutsche Stimme", () => {
  it("caveAnnouncement verlangt auf Weg \"en\" IMMER einen Ton statt der Monster-Stimme", () => {
    for (const unit of ["f", "j", "e", "n", "o", SHIFT_UNIT]) {
      const { tone, text } = caveAnnouncement(unit, "en");
      expect(tone).toBe(true);
      expect(text.length).toBeGreaterThan(0); // die Live-Region bleibt nie leer
    }
  });

  it("Weg \"de\" bleibt unverändert (EN3): weiter die deutsche Stimme/Aufnahme, kein Ton", () => {
    for (const unit of ["f", "j", "ö", SHIFT_UNIT]) {
      const { tone } = caveAnnouncement(unit, "de");
      expect(tone).toBe(false);
    }
  });
});

describe("★★★ das gelöste Funkspruch-Wort folgt der Übungssprache (Weg), nicht fest „de\"", () => {
  it("stationWordLang", () => {
    expect(stationWordLang("en")).toBe("en");
    expect(stationWordLang("de")).toBe("de");
  });
});
