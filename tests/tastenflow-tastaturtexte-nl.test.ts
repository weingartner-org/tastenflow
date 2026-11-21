/**
 * ★ O2 (29.10.2026): Wächter über `LAYOUT_TEXTE_NL` (`src/lib/typing/tastaturTexteNl.ts`) - Name, Kurzname und Erklärung
 * JEDER Tastatur niederländisch. Vorbild: der Block „každá klávesnice má český název a popis" in
 * `tests/tastenflow-tschechisch-alles.test.tsx`. Die Tabelle wird DIREKT gelesen (nicht über `layoutTexteIn`), damit der
 * Wächter auch vor dem Eintrag im Verteiler greift.
 *
 * Mutationsprobe (29.10.): „AltGr" statt „Alt Gr", eine je-Form, ein englischer Rückfall (`layoutTexteEnglisch("nl-intl")`)
 * und ein Halbgeviert machen ihn rot.
 */
import { describe, expect, it } from "vitest";
import { LAYOUTS, layoutTexteEnglisch } from "../src/lib/typing/layouts";
import { LAYOUT_TEXTE_NL } from "../src/lib/typing/tastaturTexteNl";
import { deutscheWoerter } from "./helfer/deutschFaenger";

/** Englische Wörter der Vorlage (`layout.en`). Ohne „is", „in", „of", „a", „letter(s)", „accent", „grave", „tilde" (auch niederländisch). */
const ENGLISCH = [
  "the", "and", "key", "keys", "with", "then", "comes", "come", "from", "right", "left", "gives",
  "needs", "has", "have", "only", "works", "keyboard", "capital", "dead", "sign", "row", "number", "own", "where",
  "usually", "quotation", "marks", "typewriter", "phonetic", "enhanced", "standard", "programmers", "layout", "there",
  "texts", "words", "lines", "offered", "otherwise", "same", "without", "also", "first", "press", "space", "full",
  "stop", "apostrophe", "question", "hyphen", "dash", "double", "quote", "braces", "brackets", "diaeresis", "cedilla",
  "acute", "circumflex", "on", "to", "it", "for", "or", "no", "not",
];
const wort = (w: string) => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "iu");
const englischIn = (t: string) => ENGLISCH.filter((w) => wort(w).test(t));

const NEUE_IDS = [
  "bg", "bg-schreibm", "bg-phon", "bg-phon-trad", "el", "el-220", "el-319", "hu", "hu-101", "nl-intl", "nl-dutch",
  "pt", "br-abnt2", "ro", "ro-prog", "sv", "ua", "ua-std",
] as const;

function alles(id: string): string {
  const t = LAYOUT_TEXTE_NL[id as keyof typeof LAYOUT_TEXTE_NL];
  return `${t.label} ${t.kurz} ${t.hinweis ?? ""}`;
}

describe("★ O2 elk toetsenbord heeft een Nederlandse naam en uitleg (tastaturTexteNl.ts)", () => {
  it("jede der 36 Tastaturen hat einen Eintrag mit Name und Kurzname", () => {
    expect(LAYOUTS.length).toBeGreaterThanOrEqual(36);
    expect(Object.keys(LAYOUT_TEXTE_NL).sort()).toEqual(LAYOUTS.map((l) => l.id).sort());
    for (const l of LAYOUTS) {
      const t = LAYOUT_TEXTE_NL[l.id];
      expect(t, l.id).toBeTruthy();
      expect(t.label.length, l.id).toBeGreaterThan(3);
      // Kurzname steht nach „Toetsenbord:" - er nennt ein toetsenbord (Landesadjektive gross, wie im Niederländischen).
      expect(t.kurz, l.id).toMatch(/toetsenbord( \(\p{L}+\))?$/u);
    }
  });

  it("kein Englisch, kein Deutsch, nur Bindestrich, keine französischen Anführungszeichen, kein Maus-Wort", () => {
    for (const l of LAYOUTS) {
      const t = alles(l.id);
      expect(englischIn(t), l.id).toEqual([]);
      // „rechte" (rechte aanhalingstekens) ist auch niederländisch.
      expect(deutscheWoerter(t).filter((w) => w.length > 1 && w !== "rechte"), l.id).toEqual([]);
      expect(t, l.id).not.toMatch(/[–—«»…]/u);
      expect(t, l.id).not.toMatch(/(?<!\p{L})(klik\p{L}*|dubbelklik\p{L}*|tik|tikken|sleep|slepen|muis)(?!\p{L})/iu);
      // Unpersönlich: keine je/jij-Form (Kind und Lehrkraft lesen denselben Satz).
      expect(t, l.id).not.toMatch(/(?<!\p{L})(je|jij|jouw|jullie)(?!\p{L})/iu);
      // Glossar §2.9: „Alt Gr" mit Leerzeichen, nie „AltGr"; Totaste = „dode toets".
      expect(t, l.id).not.toMatch(/AltGr|rechter Alt/u);
      expect(t, l.id).not.toMatch(/stomme toets|accenttoets/u);
      // Eine Ziffer mit Punkt am Satzende liest die Stimme als Ordnungszahl.
      expect(t, l.id).not.toMatch(/\s\d+\.(\s|$)/u);
    }
  });

  it("die Tastaturen der neun neuen Sprachen sind übersetzt, nicht der englische Rückfall", () => {
    for (const id of NEUE_IDS) {
      const en = layoutTexteEnglisch(id);
      const nl = LAYOUT_TEXTE_NL[id];
      expect(nl.label, id).not.toBe(en.label);
      expect(nl.kurz, id).not.toBe(en.kurz);
      expect(nl.hinweis, id).toBeTruthy();
      expect(nl.hinweis, id).not.toBe(en.hinweis);
    }
    for (const l of LAYOUTS) expect(!!LAYOUT_TEXTE_NL[l.id].hinweis, l.id).toBe(!!l.en.hinweis);
  });

  it("Namen nach Glossar §2.9 und der Hinweis zu US-International nennt die dode toetsen", () => {
    expect(LAYOUT_TEXTE_NL["nl-intl"].label).toBe("Verenigde Staten (internationaal)");
    expect(LAYOUT_TEXTE_NL.be.label).toBe("Belgisch (punt)");
    expect(LAYOUT_TEXTE_NL["nl-dutch"].label).toBe("Nederlands");
    expect(LAYOUT_TEXTE_NL.us.label).toBe("Verenigde Staten");
    expect(LAYOUT_TEXTE_NL.de.label).toBe("Duits (Duitsland en Oostenrijk)");
    expect(LAYOUT_TEXTE_NL.uk.label).toBe("Engels (Verenigd Koninkrijk)");
    const h = LAYOUT_TEXTE_NL["nl-intl"].hinweis ?? "";
    expect(h).toMatch(/dode toetsen/u);
    expect(h).toMatch(/spatiebalk/u);
    expect(h).toMatch(/ë/u);
  });
});
