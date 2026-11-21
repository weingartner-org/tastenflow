/**
 * ★ O2 (29.10.2026): Wächter über `LAYOUT_TEXTE_RO` (`src/lib/typing/tastaturTexteRo.ts`) - Name, Kurzname und Erklärung
 * JEDER Tastatur rumänisch. Vorbild: der Block „každá klávesnice má český název a popis" in
 * `tests/tastenflow-tschechisch-alles.test.tsx`. Die Tabelle wird DIREKT gelesen (nicht über `layoutTexteIn`), damit der
 * Wächter auch vor dem Eintrag im Verteiler greift.
 *
 * Mutationsprobe (29.10.): ş/ţ mit Cedille im rumänischen Hinweis, „AltGr" statt „Alt Gr", ein englischer Rückfall
 * (`layoutTexteEnglisch("ro")`) und ein Halbgeviert machen ihn rot.
 */
import { describe, expect, it } from "vitest";
import { LAYOUTS, layoutTexteEnglisch } from "../src/lib/typing/layouts";
import { LAYOUT_TEXTE_RO } from "../src/lib/typing/tastaturTexteRo";
import { deutscheWoerter } from "./helfer/deutschFaenger";

/** Englische Wörter der Vorlage (`layout.en`). Ohne „a" (rumänisch „a cu căciulă"), „standard", „accent", „tilde", „circumflex". */
const ENGLISCH = [
  "the", "and", "key", "keys", "with", "letter", "letters", "then", "comes", "come", "from", "right", "left", "gives",
  "needs", "has", "have", "only", "works", "keyboard", "capital", "dead", "sign", "row", "number", "own", "where",
  "usually", "quotation", "marks", "typewriter", "phonetic", "enhanced", "programmers", "layout", "there", "texts",
  "words", "lines", "offered", "otherwise", "same", "without", "also", "first", "press", "space", "full", "stop",
  "apostrophe", "question", "hyphen", "dash", "double", "quote", "braces", "brackets", "diaeresis", "cedilla", "grave",
  "acute", "on", "of", "to", "is", "it", "for", "or", "in", "no", "not",
];
const wort = (w: string) => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "iu");
const englischIn = (t: string) => ENGLISCH.filter((w) => wort(w).test(t));

const NEUE_IDS = [
  "bg", "bg-schreibm", "bg-phon", "bg-phon-trad", "el", "el-220", "el-319", "hu", "hu-101", "nl-intl", "nl-dutch",
  "pt", "br-abnt2", "ro", "ro-prog", "sv", "ua", "ua-std",
] as const;
/** Nur hier ist das ş mit Cedille der Buchstabe selbst (Türkisch). */
const TUERKISCH = new Set(["tr-q", "tr-f"]);

function alles(id: string): string {
  const t = LAYOUT_TEXTE_RO[id as keyof typeof LAYOUT_TEXTE_RO];
  return `${t.label} ${t.kurz} ${t.hinweis ?? ""}`;
}

describe("★ O2 fiecare tastatură are nume și descriere în română (tastaturTexteRo.ts)", () => {
  it("jede der 36 Tastaturen hat einen Eintrag mit Name und Kurzname", () => {
    expect(LAYOUTS.length).toBeGreaterThanOrEqual(36);
    expect(Object.keys(LAYOUT_TEXTE_RO).sort()).toEqual(LAYOUTS.map((l) => l.id).sort());
    for (const l of LAYOUTS) {
      const t = LAYOUT_TEXTE_RO[l.id];
      expect(t, l.id).toBeTruthy();
      expect(t.label.length, l.id).toBeGreaterThan(3);
      // Kurzname klein - er steht nach „Tastatură:"; beginnt mit „tastatură".
      expect(t.kurz, l.id).toMatch(/^tastatură /u);
    }
  });

  it("kein Englisch, kein Deutsch, nur Bindestrich, ș ț mit Komma, kein Maus-Wort", () => {
    for (const l of LAYOUTS) {
      const t = alles(l.id);
      expect(englischIn(t), l.id).toEqual([]);
      // „taste" ist rumänisch die Mehrzahl von „tastă", kein deutsches Wort.
      expect(deutscheWoerter(t).filter((w) => w.length > 1 && w !== "taste"), l.id).toEqual([]);
      expect(t, l.id).not.toMatch(/[–—«»…]/u);
      expect(t, l.id).not.toMatch(/clic|click|mouse|atinge|trage/iu);
      // ș und ț mit Komma: ţ (Cedille) nie, ş (Cedille) nur als türkischer Buchstabe.
      expect(t, l.id).not.toMatch(/[ţŢ]/u);
      if (!TUERKISCH.has(l.id)) expect(t, l.id).not.toMatch(/[şŞ]/u);
      // Unpersönlich: keine tu-Form (Kind und Lehrkraft lesen denselben Satz); „se apasă" ist unpersönlich.
      expect(t, l.id).not.toMatch(/(?<!\p{L})(?<!se )(apasă|scrii|tastezi|alege)(?!\p{L})/iu);
      // Glossar §2.9: „Alt Gr" mit Leerzeichen, nie „AltGr" oder „Alt dreapta".
      expect(t, l.id).not.toMatch(/AltGr|Alt dreapta/u);
      // Glossar §4 Falle 3: Reihe = „șir", nie „rând de bază"/„rândul de cifre" (rând = Übungszeile).
      expect(t, l.id).not.toMatch(/rândul (de bază|de cifre)/u);
      // Eine Ziffer mit Punkt am Satzende liest die Stimme als Ordnungszahl.
      expect(t, l.id).not.toMatch(/\s\d+\.(\s|$)/u);
    }
  });

  it("die Tastaturen der neun neuen Sprachen sind übersetzt, nicht der englische Rückfall", () => {
    for (const id of NEUE_IDS) {
      const en = layoutTexteEnglisch(id);
      const ro = LAYOUT_TEXTE_RO[id];
      expect(ro.label, id).not.toBe(en.label);
      expect(ro.kurz, id).not.toBe(en.kurz);
      expect(ro.hinweis, id).toBeTruthy();
      expect(ro.hinweis, id).not.toBe(en.hinweis);
    }
    for (const l of LAYOUTS) expect(!!LAYOUT_TEXTE_RO[l.id].hinweis, l.id).toBe(!!l.en.hinweis);
  });

  it("Namen nach Glossar §2.9 und der rumänische Hinweis nennt ș und ț mit Komma", () => {
    expect(LAYOUT_TEXTE_RO.ro.label).toBe("Română (standard)");
    expect(LAYOUT_TEXTE_RO["ro-prog"].label).toBe("Română (programatori)");
    expect(LAYOUT_TEXTE_RO.de.label).toBe("Germană (Germania și Austria)");
    expect(LAYOUT_TEXTE_RO.us.label).toBe("Engleză (SUA)");
    expect(LAYOUT_TEXTE_RO.uk.label).toBe("Engleză (Regatul Unit)");
    const h = LAYOUT_TEXTE_RO.ro.hinweis ?? "";
    // Als eigene Buchstaben genannt (nicht nur im Wort „și").
    expect(h).toMatch(/(?<!\p{L})ș(?!\p{L})/u);
    expect(h).toMatch(/(?<!\p{L})ț(?!\p{L})/u);
    expect(h).toMatch(/virgulă dedesubt/u);
    expect(LAYOUT_TEXTE_RO["ro-prog"].hinweis ?? "").toMatch(/Alt Gr/u);
    expect(LAYOUT_TEXTE_RO.cs.hinweis ?? "").toMatch(/tasta moartă/u);
  });
});
