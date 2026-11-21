/**
 * ★ WÄCHTER O2-TASTATUR-SV (29.10.2026): Name, Kurzname und Erklärung JEDER Tastatur auf Schwedisch -
 * `LAYOUT_TEXTE_SV` aus `tastaturTexteSv.ts`, direkt (der Verteiler `layoutTexteIn` hat seinen eigenen Wächter).
 * Vorbild: Block „každá klávesnice má český název a popis" in `tastenflow-tschechisch-alles.test.tsx`. Auch die
 * Tastaturen der neun neuen Wege tragen eine eigene Übersetzung - kein Text darf der englische sein.
 */
import { describe, expect, it } from "vitest";
import { LAYOUTS } from "../src/lib/typing/layouts";
import { LAYOUT_TEXTE_SV } from "../src/lib/typing/tastaturTexteSv";
import { DEUTSCHE_WOERTER } from "./helfer/deutschFaenger";

/** Englische Wörter der Vorlage (`layout.en`) - eines davon im Text heisst: hier steht noch Englisch. */
const ENGLISCH = ["the", "and", "key", "keys", "with", "letter", "letters", "press", "then", "first", "capital", "row", "left",
  "right", "of", "to", "is", "for", "from", "gives", "own", "keyboard", "dead", "sign", "digits", "has", "have", "where", "also",
  "works", "too", "comes", "needs", "same", "other", "only", "full", "stop", "quotation", "marks", "programmers", "enhanced",
  "typewriter", "phonetic", "otherwise", "there", "on"];
const woerterAus = (liste: readonly string[], text: string) =>
  liste.filter((w) => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "iu").test(text));
/** „dem" ist auch schwedisch (= ihnen); Umlaute fängt hier nichts - å ä ö sind schwedische Buchstaben. */
const FALSCHE_FREUNDE = new Set(["dem"]);
const deutsch = (text: string) =>
  (text.match(/\p{L}{2,}/gu) ?? []).filter((w) => DEUTSCHE_WOERTER.has(w.toLowerCase()) && !FALSCHE_FREUNDE.has(w.toLowerCase()));

/** Maus-Wörter, englische Tastennamen (Glossar sv §2.9: Skift, Alt Gr, Retur, Mac: Alternativ), „finskt tangentbord". */
const VERBOTEN =
  /(?<!\p{L})(klicka|klickar|klick|dra|musen|Shift|AltGr|Enter|Option|Space|finskt tangentbord)(?!\p{L})/iu;

describe("O2-TASTATUR sv · varje tangentbord har ett svenskt namn och en förklaring", () => {
  it("jede Tastatur: Name, Kurzname klein, Erklärung genau dann, wenn die englische eine hat - keine davon englisch", () => {
    for (const l of LAYOUTS) {
      const t = LAYOUT_TEXTE_SV[l.id];
      expect(t, l.id).toBeTruthy();
      expect(t.label.length, l.id).toBeGreaterThan(3);
      expect(t.kurz.length, l.id).toBeGreaterThan(3);
      expect(t.kurz[0], l.id).toBe(t.kurz[0].toLowerCase());
      expect(t.label, l.id).not.toBe(l.en.label);
      expect(t.kurz, l.id).not.toBe(l.en.kurz);
      expect(Boolean(t.hinweis), l.id).toBe(Boolean(l.en.hinweis));
      if (t.hinweis) expect(t.hinweis, l.id).not.toBe(l.en.hinweis);
    }
  });

  it("Hausregeln: nur Bindestrich, keine « », kein Englisch, kein Deutsch, keine Maus-Wörter, Tastennamen schwedisch", () => {
    for (const l of LAYOUTS) {
      const t = LAYOUT_TEXTE_SV[l.id];
      const alles = `${t.label} ${t.kurz} ${t.hinweis ?? ""}`;
      expect(alles, l.id).not.toMatch(/[–—«»]/u);
      expect(woerterAus(ENGLISCH, alles), l.id).toEqual([]);
      expect(deutsch(alles), l.id).toEqual([]);
      expect(alles.match(VERBOTEN)?.[0] ?? null, l.id).toBeNull();
    }
  });

  it("inhaltliche Anker: die schwedische Tastatur nennt å, ä und ö und die döda tangent; Name nach dem Glossar", () => {
    const sv = LAYOUT_TEXTE_SV.sv;
    expect(sv.label).toBe("Svenskt (Sverige och Finland)");
    expect(sv.kurz).toBe("svenskt tangentbord");
    for (const z of ["å", "ä", "ö"]) expect(sv.hinweis, z).toContain(z);
    expect(sv.hinweis).toMatch(/å till höger om p/u);
    expect(sv.hinweis).toMatch(/död[a]? tangent/u);
    expect(LAYOUT_TEXTE_SV.de.label).toBe("Tyskt (Tyskland och Österrike)");
    expect(LAYOUT_TEXTE_SV.it.hinweis).toMatch(/Alternativ \+ Skift/u);
  });
});
