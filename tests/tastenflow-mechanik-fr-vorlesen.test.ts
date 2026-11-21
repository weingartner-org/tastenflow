/**
 * ★★★★ WÄCHTER M2 (Mechanik-Prüfung des französischen Lehrgangs, 26.09.2026):
 * Der Vorlese-Plan (`readPlanAt`, voice.ts) spricht französische Wörter mit
 * Akzent GANZ - und benennt Akzentbuchstaben mitten im Wort nicht einzeln,
 * solange der Buchstaben-Schalter aus ist.
 *
 * Der Fund: `isAlpha` kannte nur `[a-zA-Z0-9äöüÄÖÜß]`. Ein „é" galt als
 * Satzzeichen - an „élèves", „été", „écrit" hörte das Kind nur „e accent
 * aigu", nie das Wort; mitten im Wort („mère") kam JEDER Akzentbuchstabe
 * einzeln, auch mit ausgeschaltetem Schalter. Kein Test hatte `readPlanAt` je
 * mit französischem Text aufgerufen. Leitfaden Falle 7, zum dritten Mal.
 *
 * Der Wächter läuft über den GANZEN französischen Korpus (Fehlerklasse, nicht
 * die drei gemeldeten Wörter).
 */
import { describe, expect, it } from "vitest";
import { readPlanAt, type ReadModes } from "../src/lib/typing/voice";
import { isRealWord } from "../src/lib/typing/lexicon";
import { CORPUS_FR } from "../src/lib/typing/corpus";

const istWort = (t: string) => isRealWord(t, "fr");
const WOERTER: ReadModes = { letters: false, words: true, sentences: true, shiftLearned: true, lang: "fr" };

describe("★★★★ M2: französische Wörter mit Akzent werden ganz gesprochen", () => {
  it.each([
    ["Les élèves vont à l'école en été.", 4, "élèves"],
    ["Les élèves vont à l'école en été.", 29, "été."],
    ["Il écrit une lettre à sa mère.", 3, "écrit"],
    ["Tu viens où ?", 9, "où"],
    ["Joyeux Noël à tous", 7, "Noël"],
    ["Le garçon joue", 3, "garçon"],
    ["Ça va bien, merci.", 0, "Ça"],
  ])("%s - an Stelle %i: %s", (zeile, i, wort) => {
    expect(readPlanAt(zeile, i, WOERTER, istWort)).toContain(wort);
  });

  it("mitten im Wort: Akzentbuchstaben werden bei ausgeschaltetem Schalter NICHT benannt", () => {
    const zeile = "Noël, garçon, mère, élèves, où";
    for (let i = 0; i < zeile.length; i++) {
      const vorher = zeile[i - 1];
      if (i === 0 || vorher === " ") continue; // Wortanfang
      if (!/[àâçéèêëîïôùûüÿ]/.test(zeile[i])) continue;
      expect(readPlanAt(zeile, i, WOERTER, istWort), `Stelle ${i} (${zeile[i]})`).toEqual([]);
    }
  });

  it("mit Buchstaben-Schalter: der Akzentbuchstabe wird benannt", () => {
    const plan = readPlanAt("mère", 1, { ...WOERTER, letters: true }, istWort);
    expect(plan.length).toBe(1);
    expect(plan[0]).toMatch(/accent grave/);
  });

  it("GANZER Korpus fr: jedes echte Wort wird an seinem Anfang ganz gesprochen", () => {
    let geprueft = 0;
    const fehlt: string[] = [];
    for (const c of CORPUS_FR) {
      const zeile = c.text;
      for (let i = 0; i < zeile.length; i++) {
        if (i > 0 && zeile[i - 1] !== " ") continue;
        if (zeile[i] === " ") continue;
        let ende = i;
        while (ende < zeile.length && zeile[ende] !== " ") ende++;
        const token = zeile.slice(i, ende);
        if (!/^[\p{L}]/u.test(token) || !istWort(token)) continue;
        geprueft++;
        // ★ Punkt 2 „vier Reste" (28.09.2026): gesprochen wird das Wort OHNE
        // schliessende Klammer/Anführungszeichen, Satzzeichen bleiben
        // („ans","" ⇒ „ans,", „mer)" ⇒ „mer") - seit 27.09. auf „es", jetzt überall.
        const hinten = token.match(/[)\]}"'»«”“’‘‹›.,;:?!…]*$/)?.[0] ?? "";
        const erwartet = token.slice(0, token.length - hinten.length) + hinten.replace(/[)\]}"'»«”“’‘‹›]/g, "");
        if (!readPlanAt(zeile, i, WOERTER, istWort).includes(erwartet)) fehlt.push(token);
      }
    }
    expect(geprueft).toBeGreaterThan(10000);
    expect(fehlt.slice(0, 20), `${fehlt.length} Wörter nie ganz gesprochen`).toEqual([]);
  });

  it("Deutsch unverändert: ein é in deutschem Text bleibt beim alten Muster", () => {
    // Weg „de": dieselbe Antwort wie vor M2 - é zählt dort weiter nicht als
    // Buchstabe und wird beim Namen genannt (nicht still übergangen).
    const de = readPlanAt("Café", 3, { letters: false, words: true, sentences: false, lang: "de" });
    expect(de).toHaveLength(1);
    expect(de[0]).not.toBe("Café");
    expect(readPlanAt("Café", 3, { letters: false, words: true, sentences: false, lang: "fr" })).toEqual([]);
  });
});
