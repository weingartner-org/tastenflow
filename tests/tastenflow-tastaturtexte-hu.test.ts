/**
 * ★ O2 (29.10.2026): Wächter über `LAYOUT_TEXTE_HU` (`src/lib/typing/tastaturTexteHu.ts`) - Name, Kurzname und Erklärung
 * JEDER Tastatur ungarisch. Vorbild: der Block „každá klávesnice má český název a popis" in
 * `tests/tastenflow-tschechisch-alles.test.tsx`. Die Tabelle wird DIREKT gelesen (nicht über `layoutTexteIn`), damit der
 * Wächter auch vor dem Eintrag im Verteiler greift.
 *
 * Mutationsprobe (29.10.): ein englischer Rückfall (`layoutTexteEnglisch("bg")`), „Alt Gr" statt „AltGr", ein Halbgeviert
 * und ein Satzende „AltGr + 5." machen ihn rot.
 */
import { describe, expect, it } from "vitest";
import { LAYOUTS, layoutTexteEnglisch } from "../src/lib/typing/layouts";
import { LAYOUT_TEXTE_HU } from "../src/lib/typing/tastaturTexteHu";
import { DEUTSCHE_WOERTER } from "./helfer/deutschFaenger";

/** Englische Wörter der Vorlage (`layout.en`). Ohne „is" (ungarisch „auch") und „a" (ungarischer Artikel). */
const ENGLISCH = [
  "the", "and", "key", "keys", "with", "letter", "letters", "then", "comes", "come", "from", "right", "left", "gives",
  "needs", "has", "have", "only", "works", "keyboard", "capital", "dead", "sign", "row", "number", "own", "where",
  "usually", "accent", "quotation", "marks", "typewriter", "phonetic", "enhanced", "standard", "programmers", "layout",
  "there", "texts", "words", "lines", "offered", "otherwise", "same", "without", "also", "first", "press", "space",
  "full", "stop", "apostrophe", "question", "hyphen", "dash", "double", "quote", "braces", "brackets", "diaeresis",
  "tilde", "cedilla", "grave", "acute", "circumflex", "on", "of", "to", "it", "for", "or", "in", "no", "not",
];
const wort = (w: string) => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "iu");
const englischIn = (t: string) => ENGLISCH.filter((w) => wort(w).test(t));
const deutschIn = (t: string) => (t.match(/\p{L}+/gu) ?? []).filter((w) => DEUTSCHE_WOERTER.has(w.toLowerCase()));

/** Die neun neuen Sprachen - ihre Tastaturen bekommen eine ECHTE Übersetzung, keinen englischen Rückfall. */
const NEUE_IDS = [
  "bg", "bg-schreibm", "bg-phon", "bg-phon-trad", "el", "el-220", "el-319", "hu", "hu-101", "nl-intl", "nl-dutch",
  "pt", "br-abnt2", "ro", "ro-prog", "sv", "ua", "ua-std",
] as const;

function alles(id: string): string {
  const t = LAYOUT_TEXTE_HU[id as keyof typeof LAYOUT_TEXTE_HU];
  return `${t.label} ${t.kurz} ${t.hinweis ?? ""}`;
}

describe("★ O2 minden billentyűzetnek magyar neve és leírása van (tastaturTexteHu.ts)", () => {
  it("jede der 36 Tastaturen hat einen Eintrag mit Name und Kurzname", () => {
    expect(LAYOUTS.length).toBeGreaterThanOrEqual(36);
    expect(Object.keys(LAYOUT_TEXTE_HU).sort()).toEqual(LAYOUTS.map((l) => l.id).sort());
    for (const l of LAYOUTS) {
      const t = LAYOUT_TEXTE_HU[l.id];
      expect(t, l.id).toBeTruthy();
      expect(t.label.length, l.id).toBeGreaterThan(3);
      expect(t.kurz.length, l.id).toBeGreaterThan(3);
      // Kurzname klein - er steht nach „Billentyűzet:"; endet auf „billentyűzet" (ggf. mit Klammerzusatz).
      expect(t.kurz[0], l.id).toBe(t.kurz[0].toLowerCase());
      expect(t.kurz, l.id).toMatch(/billentyűzet( \(\p{L}+\))?$/u);
    }
  });

  it("kein Englisch, kein Deutsch, nur Bindestrich, keine französischen Anführungszeichen, kein Maus-Wort", () => {
    for (const l of LAYOUTS) {
      const t = alles(l.id);
      expect(englischIn(t), l.id).toEqual([]);
      expect(deutschIn(t), l.id).toEqual([]);
      expect(t, l.id).not.toMatch(/[–—«»…]/u);
      expect(t, l.id).not.toMatch(/kattint|koppint|egér|húzd/iu);
      // Unpersönlich: keine te-Befehlsform (Kind und Lehrkraft lesen denselben Satz).
      expect(t, l.id).not.toMatch(/(?<!\p{L})(nyomd|írd|gépeld|használd|kapcsold)(?!\p{L})/iu);
      // Glossar §2.9: „AltGr" in einem Wort; Regel 11: Tastenname mit Kopfwort, nie mit Endung.
      expect(t, l.id).not.toMatch(/Alt Gr/u);
      expect(t, l.id).not.toMatch(/(Shift|Enter|AltGr)(tel|rel|et|el|t)(?!\p{L})/u);
      // Eine Ziffer mit Punkt am Satzende liest die Stimme als Ordnungszahl.
      expect(t, l.id).not.toMatch(/\s\d+\.(\s|$)/u);
    }
  });

  it("die Tastaturen der neun neuen Sprachen sind übersetzt, nicht der englische Rückfall", () => {
    for (const id of NEUE_IDS) {
      const en = layoutTexteEnglisch(id);
      const hu = LAYOUT_TEXTE_HU[id];
      expect(hu.label, id).not.toBe(en.label);
      expect(hu.kurz, id).not.toBe(en.kurz);
      expect(hu.hinweis, id).toBeTruthy();
      expect(hu.hinweis, id).not.toBe(en.hinweis);
    }
    // Jede Tastatur mit englischer Erklärung hat auch eine ungarische (und umgekehrt).
    for (const l of LAYOUTS) expect(!!LAYOUT_TEXTE_HU[l.id].hinweis, l.id).toBe(!!l.en.hinweis);
  });

  it("Namen nach Glossar §2.9 und der ungarische Hinweis nennt ő und ű (und die 0 vor der 1)", () => {
    expect(LAYOUT_TEXTE_HU.hu.label).toBe("Magyar (QWERTZ)");
    expect(LAYOUT_TEXTE_HU["hu-101"].label).toBe("Magyar (101 billentyűs, QWERTY)");
    expect(LAYOUT_TEXTE_HU.de.label).toBe("Német (Németország és Ausztria)");
    expect(LAYOUT_TEXTE_HU.us.label).toBe("Angol (USA)");
    expect(LAYOUT_TEXTE_HU.uk.label).toBe("Angol (Egyesült Királyság)");
    const h = LAYOUT_TEXTE_HU.hu.hinweis ?? "";
    // Als eigene Buchstaben genannt (nicht nur in Wörtern wie „billentyűzet").
    expect(h).toMatch(/(?<!\p{L})ő(?!\p{L})/u);
    expect(h).toMatch(/(?<!\p{L})ű(?!\p{L})/u);
    expect(h).toMatch(/a 0 az 1 bal oldalán/u);
    expect(LAYOUT_TEXTE_HU.cs.hinweis ?? "").toMatch(/holtbillentyű/u);
  });
});
