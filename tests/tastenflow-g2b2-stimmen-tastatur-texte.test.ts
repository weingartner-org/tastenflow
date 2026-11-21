/**
 * ★ G2b-2 (02.10.2026), Teil 5: Stimmenwahl und die Texte mit Sprachnamen.
 *
 * 1. Eine Übungssprache ausser Deutsch sucht eine Stimme IHRER Sprache - bis hierher nur en/fr/es,
 *    sonst „automatisch (deutsch)": ein deutsche Stimme las italienischen Text.
 * 2. „Dieser Lehrgang lehrt die Tastatur seines Landes - darum stehen nur ___ Tastaturen zur Wahl":
 *    aus EINER Tabelle über alle Sprachen, nicht `weg === "fr" ? … : "spanische"`.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { T as EinrichtungT } from "@/components/typing/Einrichtung";
import { T as EinstellungenT } from "@/components/typing/TypingSettings";
import { TASTATUR_DES_LANDES, tastaturDesLandes } from "@/lib/typing/landesTastatur";
import { ALLE_SPRACHEN } from "@/lib/typing/sprachRegister";
import { firstVoiceURIForLang } from "@/lib/typing/voice";

const stimme = (name: string, lang: string) =>
  ({ name, lang, voiceURI: name, default: false, localService: true }) as SpeechSynthesisVoice;

const GERAET = [
  stimme("Anna", "de-DE"),
  stimme("Daniel", "en-GB"),
  stimme("Thomas", "fr-FR"),
  stimme("Mónica", "es-ES"),
  stimme("Alice", "it-IT"),
  stimme("Zosia", "pl-PL"),
  stimme("Yelda", "tr-TR"),
  stimme("Zuzana", "cs-CZ"),
];

function setzeStimmen(liste: SpeechSynthesisVoice[]) {
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: { getVoices: () => liste, speaking: false, cancel() {}, speak() {}, onvoiceschanged: null },
  });
}
afterEach(() => {
  Reflect.deleteProperty(window, "speechSynthesis");
});

describe("★ Stimme je Übungssprache: jede Sprache bekommt ihre eigene", () => {
  it.each([
    ["en", "Daniel"],
    ["fr", "Thomas"],
    ["es", "Mónica"],
    ["it", "Alice"],
    ["pl", "Zosia"],
    ["tr", "Yelda"],
    ["cs", "Zuzana"],
  ])("%s ⇒ %s (nie die deutsche Anna)", (lang, name) => {
    setzeStimmen(GERAET);
    expect(firstVoiceURIForLang(lang)).toBe(name);
  });

  it("ohne Stimme der Sprache: null (die Seite zeigt dann „Stimme installieren“), nie eine deutsche", () => {
    setzeStimmen([stimme("Anna", "de-DE"), stimme("Daniel", "en-GB")]);
    for (const l of ["it", "pl", "tr", "cs"]) expect(firstVoiceURIForLang(l), l).toBeNull();
  });

  it("die Seite fragt `l !== \"de\"` statt der Aufzählung en/fr/es (Quelltext-Wächter - die Seite ist für einen Rendertest zu gross)", () => {
    const q = readFileSync(resolve(process.cwd(), "src/features/public/TippenTrainerPage.tsx"), "utf8");
    expect(q).not.toMatch(/l === "en" \|\| l === "fr" \|\| l === "es"/);
    expect(q).toContain('if (l !== "de") {\n      const uri = firstVoiceURIForLang(l);');
  });
});

describe("★ „die Tastatur seines Landes“: eine Tabelle über alle Sprachen", () => {
  it("jede Bedienung hat für jede Sprache einen nicht leeren Eintrag", () => {
    for (const b of ["de", "en", "fr", "es"] as const) {
      for (const s of ALLE_SPRACHEN) {
        expect(tastaturDesLandes(b, s).length, `${b}/${s}`).toBeGreaterThan(2);
      }
      expect(Object.keys(TASTATUR_DES_LANDES[b]).sort()).toEqual([...ALLE_SPRACHEN].sort());
    }
  });

  it("ein Wert, den es nicht gibt, wirft - nie still „spanisch“", () => {
    expect(() => tastaturDesLandes("de", "xx" as never)).toThrow(/Keine Tastatur-Bezeichnung/);
    expect(() => tastaturDesLandes("de", "constructor" as never)).toThrow();
  });

  it("★ fr und es: die Sätze sind WORTGLEICH wie vorher (Einrichtung und Zahnrad, vier Sprachen)", () => {
    expect(EinrichtungT.de.tastaturNichtImWeg("fr", "X")).toBe(
      'Dieser Lehrgang lehrt die Tastatur seines Landes - darum stehen nur französische Tastaturen zur Wahl. Die eingestellte Tastatur „X" passt nicht dazu. Wähle eine der Tastaturen hier.',
    );
    expect(EinrichtungT.de.tastaturNichtImWeg("es", "X")).toContain("nur spanische Tastaturen");
    expect(EinrichtungT.en.tastaturNichtImWeg("fr", "X")).toContain("so only French keyboards are offered");
    expect(EinrichtungT.en.tastaturNichtImWeg("es", "X")).toContain("so only Spanish keyboards are offered");
    expect(EinrichtungT.fr.tastaturNichtImWeg("fr", "X")).toContain("seuls les claviers français sont proposés");
    expect(EinrichtungT.fr.tastaturNichtImWeg("es", "X")).toContain("seuls les claviers espagnols sont proposés");
    expect(EinrichtungT.es.tastaturNichtImWeg("fr", "X")).toContain("solo se ofrecen teclados franceses.");
    expect(EinrichtungT.es.tastaturNichtImWeg("es", "X")).toContain("solo se ofrecen teclados de España y de Latinoamérica.");

    expect(EinstellungenT.de.tastaturNichtImWeg("fr", "X")).toContain("nur französische Tastaturen zur Wahl");
    expect(EinstellungenT.de.tastaturNichtImWeg("es", "X")).toContain("nur spanische Tastaturen zur Wahl");
    expect(EinstellungenT.en.tastaturNichtImWeg("es", "X")).toContain("only Spanish keyboards are offered");
    expect(EinstellungenT.fr.tastaturNichtImWeg("fr", "X")).toContain("seuls les claviers français");
    expect(EinstellungenT.es.tastaturNichtImWeg("fr", "X")).toContain("teclados franceses.");
  });

  it("eine dritte Hauptsprache heisst NICHT „spanische“ (Falle 50): jede Sprache nennt sich selbst", () => {
    for (const s of ALLE_SPRACHEN) {
      if (s === "es") continue;
      expect(EinrichtungT.de.tastaturNichtImWeg(s, "X"), s).not.toContain("spanische");
      expect(EinstellungenT.en.tastaturNichtImWeg(s, "X"), s).not.toContain("Spanish");
    }
    expect(EinrichtungT.de.tastaturNichtImWeg("it", "X")).toContain("nur italienische Tastaturen");
    expect(EinrichtungT.de.tastaturNichtImWeg("pl", "X")).toContain("nur polnische Tastaturen");
    expect(EinrichtungT.de.tastaturNichtImWeg("tr", "X")).toContain("nur türkische Tastaturen");
    expect(EinrichtungT.de.tastaturNichtImWeg("cs", "X")).toContain("nur tschechische Tastaturen");
  });

  // ★ O-CS (03.10.2026): Tschechisch hat seit Etappe O eigene Texte - keine Bedienung liest mehr die englische Tabelle.
  it("Tschechisch liest die tschechische Tabelle", () => {
    expect(EinrichtungT.cs.tastaturNichtImWeg("fr", "X")).toContain("jen francouzské klávesnice");
  });

  // ★ O-TR (02.10.2026): Türkisch hat seit Etappe O eigene Texte.
  it("Türkisch liest die türkische Tabelle", () => {
    expect(EinrichtungT.tr.tastaturNichtImWeg("fr", "X")).toContain("yalnızca Fransızca klavyeler");
  });

  // ★ O-PL (02.10.2026): Polnisch hat seit Etappe O eigene Texte.
  it("Polnisch liest die polnische Tabelle", () => {
    expect(EinrichtungT.pl.tastaturNichtImWeg("fr", "X")).toContain("tylko klawiatury francuskie");
  });

  // ★ O-IT (02.10.2026): Italienisch hat seit Etappe O eigene Texte.
  it("Italienisch liest die italienische Tabelle", () => {
    expect(EinrichtungT.it.tastaturNichtImWeg("fr", "X")).toContain("solo tastiere francesi");
  });
});
