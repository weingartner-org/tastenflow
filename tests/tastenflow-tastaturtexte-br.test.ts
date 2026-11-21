/**
 * ★ WÄCHTER O2-TASTATUR-BR (29.10.2026): Name, Kurzname und Erklärung JEDER Tastatur in Portugiesisch (Brasilien) -
 * `LAYOUT_TEXTE_BR` aus `tastaturTexteBr.ts`, direkt (der Verteiler `layoutTexteIn` hat seinen eigenen Wächter).
 * Vorbild: Block „každá klávesnice má český název a popis" in `tastenflow-tschechisch-alles.test.tsx`. Auch die
 * Tastaturen der neun neuen Wege tragen eine eigene Übersetzung - kein Text darf der englische sein.
 */
import { describe, expect, it } from "vitest";
import { LAYOUTS } from "../src/lib/typing/layouts";
import { LAYOUT_TEXTE_BR } from "../src/lib/typing/tastaturTexteBr";
import { LAYOUT_TEXTE_PT } from "../src/lib/typing/tastaturTextePt";
import { DEUTSCHE_WOERTER } from "./helfer/deutschFaenger";

/** Englische Wörter der Vorlage (`layout.en`). „no" und „a" sind portugiesisch, „Option" heisst die Mac-Taste in Brasilien. */
const ENGLISCH = ["the", "and", "key", "keys", "with", "letter", "letters", "press", "then", "first", "capital", "row", "left",
  "right", "of", "to", "is", "for", "from", "gives", "own", "keyboard", "dead", "sign", "digits", "has", "have", "where", "also",
  "works", "too", "comes", "needs", "same", "other", "only", "full", "stop", "quotation", "marks", "programmers", "enhanced",
  "typewriter", "phonetic", "otherwise", "there"];
const woerterAus = (liste: readonly string[], text: string) =>
  liste.filter((w) => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "iu").test(text));
const deutsch = (text: string) => (text.match(/\p{L}{2,}/gu) ?? []).filter((w) => DEUTSCHE_WOERTER.has(w.toLowerCase()));

/** Maus-Wörter, „você" (unpersönlich) und Wörter aus Portugal (Glossar pt-BR §2; „fila" ist in Brasilien die Warteschlange). */
const VERBOTEN =
  /(?<!\p{L})(clica|clique|clicar|arraste|arrastar|mouse|você|ecrã|ficheiro|separador|fila|canadiano|polaco|checo|chavetas|Opção|AltGr)(?!\p{L})/iu;

describe("O2-TASTATUR br · cada teclado tem nome e explicação em português do Brasil", () => {
  it("jede Tastatur: Name, Kurzname klein, Erklärung genau dann, wenn die englische eine hat - keine davon englisch", () => {
    for (const l of LAYOUTS) {
      const t = LAYOUT_TEXTE_BR[l.id];
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

  it("Hausregeln: nur Bindestrich, keine « », kein Englisch, kein Deutsch, keine Maus- und Portugal-Wörter, Alt Gr mit Leerzeichen", () => {
    for (const l of LAYOUTS) {
      const t = LAYOUT_TEXTE_BR[l.id];
      const alles = `${t.label} ${t.kurz} ${t.hinweis ?? ""}`;
      expect(alles, l.id).not.toMatch(/[–—«»]/u);
      expect(woerterAus(ENGLISCH, alles), l.id).toEqual([]);
      expect(deutsch(alles), l.id).toEqual([]);
      expect(alles.match(VERBOTEN)?.[0] ?? null, l.id).toBeNull();
    }
  });

  it("inhaltliche Anker: ABNT2 nennt die Akzent-Taste auf Shift + 6, Namen nach Windows pt-BR, Mac heisst Option", () => {
    const br = LAYOUT_TEXTE_BR["br-abnt2"];
    expect(br.label).toBe("Português (Brasil ABNT2)");
    // Glossar pt-BR §2.9 / Bauplan I9: Shift + 6 ist auf ABNT2 eine Akzent-Taste (¨).
    expect(br.hinweis).toMatch(/Shift \+ 6 é a tecla de acento ¨/u);
    expect(br.hinweis).toMatch(/ç tem uma tecla própria à direita do l/u);
    expect(LAYOUT_TEXTE_BR["nl-intl"].label).toBe("Holandês (Estados Unidos - Internacional)");
    expect(LAYOUT_TEXTE_BR.it.hinweis).toMatch(/Option \+ Shift/u);
    expect(LAYOUT_TEXTE_BR["tr-f"].hinweis).toMatch(/fileira central/u);
  });

  it("Brasilien und Portugal sind getrennte Fassungen (nicht byte-gleich)", () => {
    expect(JSON.stringify(LAYOUT_TEXTE_BR)).not.toBe(JSON.stringify(LAYOUT_TEXTE_PT));
    expect(LAYOUT_TEXTE_BR["br-abnt2"]).not.toEqual(LAYOUT_TEXTE_PT["br-abnt2"]);
    const verschieden = LAYOUTS.filter((l) => JSON.stringify(LAYOUT_TEXTE_BR[l.id]) !== JSON.stringify(LAYOUT_TEXTE_PT[l.id]));
    expect(verschieden.length).toBeGreaterThan(LAYOUTS.length / 2);
  });
});
