/**
 * ★★★ G2b-1 (02.10.2026, Befund G1c §3 Nr. 4, Bauplan §2.2, Leitfaden Falle 7 -
 * „zum vierten Mal"): EINE Zeichenklasse für alle Buchstaben, keine Liste.
 *
 * Bis G2b-1 stand in `corpus.ts` und `generator.ts` je ein `LETTER_RE`
 * (`[a-zäöüßéèàçùâêîôûëïÿœñáíóú]`), in `lexicon.ts#normalizeWord` eine Klasse
 * `[^a-zäöüß]`, in `voice.ts` je Sprache eine Klasse. Ein Sonderbuchstabe der
 * neuen Sprachen (ı ł ğ č ì ě ů ť …) war für sie KEIN Buchstabe:
 *   - `fitText` verwarf die ganze Zeile,
 *   - `rundenEinheiten` ließ ihn aus dem Tastenstand von „Mein Training" fallen,
 *   - `normalizeWord` STRICH ihn aus dem Wort („łódź" ⇒ „d"),
 *   - der Vorlese-Plan nannte ihn „Satzzeichen".
 * Jetzt fragt jede dieser Stellen `istBuchstabe()` (Unicode `\p{L}`). Dieser
 * Wächter hält ein Beispielwort je Sonderbuchstabe durch alle Stellen - und
 * hält fest, dass de/en/fr/es dieselbe Antwort wie vorher geben.
 */
import { describe, expect, it } from "vitest";

import type { Lang } from "../src/lib/typing/account";
import { fitText } from "../src/lib/typing/corpus";
import { istZahlenzeile, rundenEinheiten } from "../src/lib/typing/generator";
import { normalizeWord } from "../src/lib/typing/lexicon";
import { buchstabeDerSprache, grossFuer, istBuchstabe } from "../src/lib/typing/sprachRegister";
import { readPlanAt } from "../src/lib/typing/voice";

/** Je ein Wort mit dem Sonderbuchstaben, die Sprache, in der es steht. */
const WOERTER: readonly { sonder: string; wort: string; sprache: Lang }[] = [
  { sonder: "ı", wort: "ışık", sprache: "tr" },
  { sonder: "ğ", wort: "dağ", sprache: "tr" },
  { sonder: "ş", wort: "kuş", sprache: "tr" },
  { sonder: "ł", wort: "łódź", sprache: "pl" },
  { sonder: "ą", wort: "mąka", sprache: "pl" },
  { sonder: "č", wort: "čeština", sprache: "cs" },
  { sonder: "ě", wort: "věž", sprache: "cs" },
  { sonder: "ů", wort: "dům", sprache: "cs" },
  { sonder: "ť", wort: "ťuhýk", sprache: "cs" },
  { sonder: "ì", wort: "così", sprache: "it" },
];

describe("istBuchstabe erkennt jeden Sonderbuchstaben - und nur Buchstaben", () => {
  it.each(WOERTER)("$wort ($sprache): jedes Zeichen ist ein Buchstabe", ({ wort }) => {
    for (const z of wort) expect(istBuchstabe(z), z).toBe(true);
  });

  it("Ziffern, Satzzeichen, Leerzeichen sind keine Buchstaben; mehrere Zeichen auch nicht", () => {
    for (const z of ["1", ".", " ", "'", "-", "€", "⇧", "^"]) expect(istBuchstabe(z), z).toBe(false);
    expect(istBuchstabe("ab")).toBe(false);
    expect(istBuchstabe("")).toBe(false);
  });

  it("buchstabeDerSprache: für de/en/fr/es gilt die alte Klasse BYTE für BYTE, für it/pl/tr/cs jeder Buchstabe", () => {
    const alt = /^[a-zäöüß]$/;
    for (const sprache of ["de", "en", "fr", "es"] as const) {
      expect(buchstabeDerSprache("ł", sprache, alt)).toBe(false);
      expect(buchstabeDerSprache("ı", sprache, alt)).toBe(false);
      expect(buchstabeDerSprache("é", sprache, alt)).toBe(false); // wie bisher: nicht in der alten de-Klasse
      expect(buchstabeDerSprache("ä", sprache, alt)).toBe(true);
    }
    for (const sprache of ["it", "pl", "tr", "cs"] as const) {
      expect(buchstabeDerSprache("ł", sprache, alt)).toBe(true);
      expect(buchstabeDerSprache("ı", sprache, alt)).toBe(true);
      expect(buchstabeDerSprache("1", sprache, alt)).toBe(false);
    }
    // ohne Sprache (jeder Alt-Aufruf): nur die alte Klasse
    expect(buchstabeDerSprache("ł", undefined, alt)).toBe(false);
    expect(buchstabeDerSprache("a", undefined, alt)).toBe(true);
  });
});

describe("normalizeWord zerschneidet keinen Sonderbuchstaben mehr", () => {
  it.each(WOERTER)("$wort: bleibt als Wort stehen (nur klein)", ({ wort, sprache }) => {
    expect(normalizeWord(wort, sprache)).toBe(wort.toLowerCase());
    // groß geschrieben und mit Satzzeichen dahinter: dasselbe Wort
    expect(normalizeWord(grossFuer(wort[0], sprache) + wort.slice(1) + "!", sprache)).toBe(wort.toLowerCase());
  });

  it("türkisch: IŞIK ⇒ ışık (nicht işik), umgebende Satzzeichen und Ziffern fallen weg", () => {
    expect(normalizeWord("IŞIK", "tr")).toBe("ışık");
    expect(normalizeWord("İstanbul,", "tr")).toBe("istanbul");
    expect(normalizeWord("(dağ) 12", "tr")).toBe("dağ");
  });

  it("de/en/fr/es: die alten Klassen, Byte für Byte (Café bleibt auf de/en „caf“)", () => {
    expect(normalizeWord("Café")).toBe("caf");
    expect(normalizeWord("Café", "de")).toBe("caf");
    expect(normalizeWord("Café", "en")).toBe("caf");
    expect(normalizeWord("Café", "fr")).toBe("café");
    expect(normalizeWord("Año", "es")).toBe("año");
    // ohne Sprache = deutsche Klasse: der Sonderbuchstabe fällt wie bisher heraus
    expect(normalizeWord("ışık")).toBe("k");
    expect(normalizeWord("łódź")).toBe("d");
  });
});

describe("fitText (früher LETTER_RE in corpus.ts) kennt jeden Sonderbuchstaben", () => {
  it.each(WOERTER)("$wort ($sprache): passt, sobald seine Einheiten frei sind - und nur dann", ({ wort, sprache }) => {
    const einheiten = [...new Set([...wort])];
    expect(fitText(wort, new Set(einheiten), sprache)).toBe(wort);
    // fehlt der Sonderbuchstabe, passt die Zeile NICHT (nicht „still weggelassen")
    const ohne = new Set(einheiten.filter((e) => e !== WOERTER.find((w) => w.wort === wort)!.sonder));
    expect(fitText(wort, ohne, sprache)).toBeNull();
  });

  it.each(WOERTER)("$wort ($sprache): am Satzanfang GROSS geschrieben passt die Zeile ebenso (die alte Klasse kannte nur die Kleinbuchstaben der Liste)", ({ wort, sprache }) => {
    // der Grossbuchstabe wird über seinen Kleinbuchstaben gefunden: „Ł“ ⇒ „ł“ - und bleibt gross
    const gross = grossFuer(wort[0], sprache) + wort.slice(1);
    // ★ F4-pl/-cs (02.10.2026): die Grossformen mit Dreiergriff (pl: erst mit `q`) und über eine Totaste (cs: `ˇ` `´`, auf einer Tastatur ohne diese Totasten der Rückfall `¨`) kommen erst, wenn
    // diese Einheit gelernt ist (`LernwegDef.grossAkzentSpaet`) - sie stehen hier zusätzlich in der Menge; die Schranke selbst prüfen
    // `tastenflow-lernweg-pl-reihenfolge` und `-cs-reihenfolge`.
    expect(fitText(gross, new Set([...wort, "q", "ˇ", "´", "¨"]), sprache)).toBe(gross);
  });
});

describe("rundenEinheiten (früher LETTER_RE in generator.ts) zählt den Sonderbuchstaben als Buchstaben", () => {
  it.each(WOERTER)("$wort ($sprache): alle Einheiten des Wortes landen in `letters`", ({ wort, sprache }) => {
    const einheiten = [...new Set([...wort])];
    expect(rundenEinheiten(einheiten, sprache).letters.sort()).toEqual([...einheiten].sort());
  });

  it("Ziffern und Satzzeichen bleiben draußen", () => {
    const r = rundenEinheiten(["ł", "ó", "1", "."], "pl");
    expect(r.letters).toEqual(["ł", "ó"]);
  });

  it("istZahlenzeile: ein Wort mit Sonderbuchstaben ist keine Zahlenzeile", () => {
    expect(istZahlenzeile("ışık 12")).toBe(false);
    expect(istZahlenzeile("łódź 5")).toBe(false);
    expect(istZahlenzeile("12 34")).toBe(true);
    expect(istZahlenzeile("23 °C")).toBe(true); // das einzelne C ist eine Einheit, kein Wort - wie bisher
  });
});

describe("der Vorlese-Plan (voice.ts) nennt einen Sonderbuchstaben nicht „Satzzeichen“", () => {
  const modi = (lang: Lang) => ({ letters: false, words: true, sentences: false, lang });

  it.each(WOERTER)("$wort ($sprache): am Wortanfang wird das GANZE Wort gesprochen", ({ wort, sprache }) => {
    const plan = readPlanAt(`${wort} ${wort}`, 0, modi(sprache), () => true);
    expect(plan).toContain(wort);
  });

  it("mitten im türkischen Wort: kein Name wie „Satzzeichen“ für das ı (es ist Teil des Wortes)", () => {
    const plan = readPlanAt("ışık", 2, { letters: false, words: true, sentences: false, lang: "tr" }, () => true);
    // ein Buchstabe mitten im Wort wird bei ausgeschaltetem Buchstaben-Schalter nicht einzeln gesprochen
    expect(plan).toEqual([]);
  });
});
