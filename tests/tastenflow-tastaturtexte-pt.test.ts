/**
 * ★ WÄCHTER O2-TASTATUR-PT (29.10.2026): Name, Kurzname und Erklärung JEDER Tastatur in Portugiesisch (Portugal) -
 * `LAYOUT_TEXTE_PT` aus `tastaturTextePt.ts`, direkt (der Verteiler `layoutTexteIn` hat seinen eigenen Wächter).
 * Vorbild: Block „každá klávesnice má český název a popis" in `tastenflow-tschechisch-alles.test.tsx`. Anders als dort
 * tragen auch die Tastaturen der neun neuen Wege eine eigene Übersetzung - kein Text darf der englische sein.
 */
import { describe, expect, it } from "vitest";
import { LAYOUTS } from "../src/lib/typing/layouts";
import { LAYOUT_TEXTE_PT } from "../src/lib/typing/tastaturTextePt";
import { LAYOUT_TEXTE_BR } from "../src/lib/typing/tastaturTexteBr";
import { DEUTSCHE_WOERTER } from "./helfer/deutschFaenger";

/** Englische Wörter der Vorlage (`layout.en`) - eines davon im Text heisst: hier steht noch Englisch. „no" und „a" sind portugiesisch. */
const ENGLISCH = ["the", "and", "key", "keys", "with", "letter", "letters", "press", "then", "first", "capital", "row", "left",
  "right", "of", "to", "is", "for", "from", "gives", "own", "keyboard", "dead", "sign", "digits", "has", "have", "where", "also",
  "works", "too", "comes", "needs", "same", "other", "only", "full", "stop", "quotation", "marks", "programmers", "enhanced",
  "typewriter", "phonetic", "otherwise", "there"];
const woerterAus = (liste: readonly string[], text: string) =>
  liste.filter((w) => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "iu").test(text));
const deutsch = (text: string) => (text.match(/\p{L}{2,}/gu) ?? []).filter((w) => DEUTSCHE_WOERTER.has(w.toLowerCase()));

/** Maus-Wörter, „você" und brasilianische Wörter (Glossar pt §2, Wächter `tastenflow-tasten-erklaerung-pt-br-sv`). */
const VERBOTEN =
  /(?<!\p{L})(clica|clique|clicar|arrasta|arrastar|rato|você|tela|arquivo|aba|fileira|canadense|polonês|tcheco|embaixo|Option|AltGr)(?!\p{L})/iu;

describe("O2-TASTATUR pt · cada teclado tem nome e explicação em português (Portugal)", () => {
  it("jede Tastatur: Name, Kurzname klein, Erklärung genau dann, wenn die englische eine hat - keine davon englisch", () => {
    for (const l of LAYOUTS) {
      const t = LAYOUT_TEXTE_PT[l.id];
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

  it("Hausregeln: nur Bindestrich, keine « », kein Englisch, kein Deutsch, keine Maus- und Brasilien-Wörter, Alt Gr mit Leerzeichen", () => {
    for (const l of LAYOUTS) {
      const t = LAYOUT_TEXTE_PT[l.id];
      const alles = `${t.label} ${t.kurz} ${t.hinweis ?? ""}`;
      expect(alles, l.id).not.toMatch(/[–—«»]/u);
      expect(woerterAus(ENGLISCH, alles), l.id).toEqual([]);
      expect(deutsch(alles), l.id).toEqual([]);
      expect(alles.match(VERBOTEN)?.[0] ?? null, l.id).toBeNull();
    }
  });

  it("inhaltliche Anker: die portugiesische Tastatur nennt ç rechts von l und die Akzent-Taste; Mac heisst Opção", () => {
    const pt = LAYOUT_TEXTE_PT.pt;
    expect(pt.label).toBe("Portuguesa (Portugal)");
    expect(pt.hinweis).toMatch(/ç tem uma tecla própria à direita do l/u);
    expect(pt.hinweis).toMatch(/tecla de acento/u);
    // Glossar pt §2.9: Shift + 6 ist in Portugal &, der brasilianische Hinweis darf hier nie stehen.
    expect(pt.hinweis).not.toMatch(/Shift \+ 6/u);
    expect(LAYOUT_TEXTE_PT.it.hinweis).toMatch(/Opção \+ Shift/u);
    expect(LAYOUT_TEXTE_PT["tr-f"].hinweis).toMatch(/fila de base/u);
  });

  it("Portugal und Brasilien sind getrennte Fassungen (nicht byte-gleich, Namen nach dem jeweiligen Glossar)", () => {
    expect(JSON.stringify(LAYOUT_TEXTE_PT)).not.toBe(JSON.stringify(LAYOUT_TEXTE_BR));
    expect(LAYOUT_TEXTE_PT.de.label).toBe("Alemã (Alemanha e Áustria)");
    expect(LAYOUT_TEXTE_BR.de.label).toBe("Alemão (Alemanha e Áustria)");
    const verschieden = LAYOUTS.filter((l) => JSON.stringify(LAYOUT_TEXTE_PT[l.id]) !== JSON.stringify(LAYOUT_TEXTE_BR[l.id]));
    expect(verschieden.length).toBeGreaterThan(LAYOUTS.length / 2);
  });
});
