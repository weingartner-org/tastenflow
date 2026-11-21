/**
 * ★★★★★ WÄCHTER F8 Polnisch (03.10.2026): das Vorlese-Lexikon - ein echtes polnisches Wort wird GANZ gesprochen, nicht buchstabiert
 * (Leitfaden Falle 58: Lexikon VOR den Texten).
 *
 * Vorbild: `tests/tastenflow-it-lexikon.test.ts`. ⚠️ DER UNTERSCHIED: für Polnisch gibt es KEINEN Wörterbuch-Beleg (das macOS-Wörterbuch
 * nimmt jedes Wort an, Falle 61) - das Fach ist eine Menge aus Tatoeba-Wortformen (`scripts/erzeuge-lexikon-nachtrag-pl.mts`). Dieser
 * Wächter hält darum fest, WAS das Fach kann und was nicht: gewöhnliche Wörter mit allen neun polnischen Buchstaben, kein Rückfall
 * auf Deutsch oder Englisch, keine Namen, keine Sperrwörter - und eine gemessene Abdeckung an Sätzen, die NICHT aus Tatoeba stammen.
 */
import { describe, expect, it } from "vitest";
import { isRealWord, lexikonGroesse, lexikonWoerter, normalizeWord } from "../src/lib/typing/lexicon";
import { readPlanAt } from "../src/lib/typing/voice";
import { NACHTRAG_PL } from "../src/lib/typing/lexikonNachtragPl";
import { sprachDaten } from "../src/lib/typing/sprachpakete";
import { gesperrtPl } from "../src/lib/typing/sperrlistePl";
import { STUFE_VOCAB_PL, WORDS_PL } from "../src/lib/typing/wordsPl";

const echt = (w: string) => isRealWord(w, "pl");

describe("1 · normalizeWord(\"pl\"): die neun polnischen Buchstaben bleiben (Falle 7)", () => {
  it("klein, Satzzeichen und Ziffern fallen weg, Ogonki und Kreska bleiben", () => {
    expect(normalizeWord("Łódź,", "pl")).toBe("łódź");
    expect(normalizeWord("„Żółć”!", "pl")).toBe("żółć");
    expect(normalizeWord("Zażółć gęślą jaźń.", "pl")).toBe("zażółćgęśląjaźń");
    expect(normalizeWord("2026", "pl")).toBe("");
  });

  it("alle neun Buchstaben bleiben stehen - gross wie klein, und `Ł` wird `ł` (nicht `l`)", () => {
    for (const k of "ąćęłńóśźż") {
      expect(normalizeWord(`x${k}y`, "pl")).toBe(`x${k}y`);
      expect(normalizeWord(`X${k.toUpperCase()}Y`, "pl")).toBe(`x${k}y`);
    }
  });

  it("ohne Sprache und für de/en: dieselbe Antwort wie vorher (die Klasse für Deutsch lässt `ł` weg)", () => {
    expect(normalizeWord("Łódź")).toBe("d");
    expect(normalizeWord("Café")).toBe("caf");
  });
});

describe("2 · das polnische Fach: eigenes Fach, kein Rückfall auf de/en", () => {
  it("das Fach ist gross (Übungswortschatz + Nachtrag aus Tatoeba-Wortformen), lexikonWoerter(\"pl\") ist es selbst", () => {
    expect(lexikonGroesse().pl).toBeGreaterThan(20000);
    expect(lexikonWoerter("pl").length).toBe(lexikonGroesse().pl);
    // aus dem Sprachpaket (nur über `import()` geladen, nicht im Hauptbündel)
    expect(sprachDaten("pl")?.lexikon[0]).toBe(NACHTRAG_PL);
  });

  it("gewöhnliche Wörter mit allen neun Buchstaben sind echt", () => {
    for (const w of ["jest", "się", "książka", "dziękuję", "łódź", "żaba", "ćwiczenie", "mężczyzna", "źródło", "ośmiornica", "słońce", "dzień", "kościół", "ślimak", "wąż", "czerwony", "szkoła"]) {
      expect(echt(w), w).toBe(true);
    }
  });

  it("Unsinn, Tastenbrei und Wörter anderer Sprachen sind es nicht - kein Rückfall auf Deutsch oder Englisch", () => {
    for (const w of ["qwxz", "dfdf", "kdkd", "ptkaa", "house", "haus", "maison", "estacion", "hello", "danke", "scuola"]) {
      expect(echt(w), w).toBe(false);
    }
  });

  it("★ die Form OHNE Ogonki ist kein Treffer: „slonce“ und „dziekuje“ sind unbekannt, „słońce“ und „dziękuję“ bekannt (nie ein Ersatz)", () => {
    for (const [mit, ohne] of [["słońce", "slonce"], ["dziękuję", "dziekuje"], ["świat", "swiat"], ["piękny", "piekny"], ["mózg", "mozg"], ["łódź", "lodz"]]) {
      expect(echt(mit), mit).toBe(true);
      expect(echt(ohne), ohne).toBe(false);
    }
  });

  it("jedes Wort der Übungswortlisten ist echt", () => {
    const alle = [...WORDS_PL, ...Object.values(STUFE_VOCAB_PL).flat()];
    expect(alle.filter((w) => w.length >= 2 && !echt(w))).toEqual([]);
  });

  it("gesperrte Wörter stehen NICHT im Fach - die Stimme buchstabiert sie, statt sie ganz zu sprechen", () => {
    for (const w of ["kurwa", "dupa", "głupi", "gruby", "jaja", "bóg", "seks"]) expect(echt(w), w).toBe(false);
    expect(lexikonWoerter("pl").filter((w) => gesperrtPl(w))).toEqual([]);
  });

  it("Eigennamen aus Tatoeba stehen nicht im Fach (tom, mary, john, ziri …) - eine Namen-Liste und die Gross-Regel haben sie entfernt", () => {
    for (const w of ["tom", "mary", "john", "ziri", "tomek", "tatoeba"]) expect(echt(w), w).toBe(false);
  });

  it("Länder und Städte, die von Hand ergänzt sind (`ERGAENZT_VON_HAND`), sind ganz: Polska, Warszawie, Boże Narodzenie", () => {
    for (const w of ["polsce", "niemczech", "warszawie", "krakowie", "narodzenie", "europie"]) expect(echt(w), w).toBe(true);
  });

  it("de, en, fr, es kennen die polnischen Wörter nicht als ihre (jedes Fach ist ein eigenes)", () => {
    expect(isRealWord("szkoła", "de")).toBe(false);
    expect(isRealWord("szkoła", "en")).toBe(false);
    expect(isRealWord("szkoła", "fr")).toBe(false);
    expect(isRealWord("szkoła", "es")).toBe(false);
    expect(isRealWord("szkoła", "pl")).toBe(true);
  });
});

describe("3 · Vorlesen: der Plan spricht das ganze Wort an seinem Anfang", () => {
  const m = { letters: false, words: true, sentences: false, lang: "pl" as const };
  const ganz = (zeile: string, index: number) => readPlanAt(zeile, index, m, (t) => isRealWord(t, "pl"));

  it("Wörter mit polnischen Buchstaben am Wortanfang: ganz gesprochen (nicht „ł, ó, d, ź“)", () => {
    expect(ganz("łódź płynie", 0)).toEqual(["łódź"]);
    expect(ganz("mała żaba skacze", 5)).toEqual(["żaba"]);
    expect(ganz("źródło jest tu", 0)).toEqual(["źródło"]);
  });

  it("ein Pseudowort wird Buchstabe für Buchstabe gesprochen - ein Buchstabe mit Ogonek bekommt seinen Namen", () => {
    expect(ganz("łąfsa kodo", 0)).toEqual(["eł"]);
    expect(ganz("łąfsa kodo", 1)).toEqual(["a z ogonkiem"]);
  });
});

describe("4 · Abdeckung: typische Sätze sind bis auf Eigennamen vollständig im Fach (Falle 58 - Lexikon vor den Texten)", () => {
  // Eigene Sätze (nicht aus Tatoeba: sie messen, was das Fach an UNBEKANNTEN Sätzen trägt).
  const SAETZE = [
    "Mam młodszą siostrę i starszego brata.",
    "Dzisiaj świeci słońce, a dzieci grają w piłkę na boisku.",
    "Po szkole idziemy do parku z naszymi kolegami.",
    "Moja babcia gotuje zupę z marchewką i pietruszką.",
    "Nauczycielka czyta nam opowiadanie o górach i morzu.",
    "Dlaczego niebo jest niebieskie? Bo światło rozprasza się w powietrzu.",
    "Pociąg odjeżdża o ósmej i przyjeżdża do miasta za godzinę.",
    "Na karnawał dzieci zakładają maski i śpiewają wesołe piosenki.",
    "W poniedziałek i w piątek chodzę do biblioteki, żeby się uczyć.",
    "W klasie stoi duży stół i cztery czerwone krzesła.",
    "Nie ma nic lepszego niż lody w upalne lato.",
    "W tym roku nasza drużyna wygrała mistrzostwa.",
    "Lekarz powiedział, że mam pić dużo wody i więcej spać.",
    "Uczniowie piszą pracę o klimacie i środowisku.",
    "Firma szuka osoby, która potrafi pracować w zespole.",
    "Urząd otworzył nowe biuro dla mieszkańców miasta.",
    "Do umowy najmu dochodzi też rachunek za prąd.",
    "Musimy zbudować sprawiedliwszą przyszłość dla wszystkich ludzi.",
    "Muzeum jest otwarte od wtorku do niedzieli, także wieczorem.",
    "Zimą wszyscy lubimy gorącą herbatę i ciepły sweter.",
  ];

  const mitteGross = (tok: string, i: number) => i > 0 && /^[A-ZĄĆĘŁŃÓŚŹŻ]/.test(tok);

  it("Messwert: über 90 % aller Wörter der Beispielsätze stehen im Fach (Tatoeba-Wortformen mit mindestens zwei Belegen, ohne Wörterbuch-Beleg)", () => {
    let gesamt = 0;
    let gedeckt = 0;
    const fehlend: string[] = [];
    for (const satz of SAETZE) {
      satz.split(/\s+/).forEach((tok, i) => {
        if (normalizeWord(tok, "pl").length < 2 || mitteGross(tok, i)) return;
        gesamt++;
        if (isRealWord(tok, "pl")) gedeckt++;
        else fehlend.push(tok);
      });
    }
    expect(gesamt).toBeGreaterThan(120);
    // Gemessen an Tatoeba-Originalen: 84,6 % der laufenden Wörter (ein Fach nur aus den Übersetzungen); diese Sätze sind einfacher
    expect(gedeckt / gesamt, `fehlend: ${fehlend.join(" ")}`).toBeGreaterThan(0.9);
  });

  it("die Prüfung findet etwas: ein Satz mit einem Unwort wird gemeldet", () => {
    const woerter = "Mały kot qwxzk śpi w domu".split(" ").filter((w) => w.length >= 2);
    expect(woerter.filter((w) => !isRealWord(w, "pl"))).toEqual(["qwxzk"]);
  });
});
