/**
 * ★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.3, F3/S3/F6):
 * KEIN DEUTSCHES WORT IN DER FRANZÖSISCHEN, SPANISCHEN ODER ENGLISCHEN
 * BEDIENUNG - Wächter über die FEHLERKLASSE „eine Bedienungssprache nennt
 * Zeichen über die deutsche Namensfunktion".
 *
 * Gemessen am 27.09. (NVDA-Lauf, Windows): „senkrechter Strich, index droit",
 * „großes D, majeur gauche + touche Majuscule droite", „Prochaine touche :
 * Punkt", spanisch „großes I, medio derecho". Die Sprachausgabe sagte es
 * richtig („barre verticale"), nur die Anzeige nicht. Geprüft wird jede
 * Bedienungssprache ausser Deutsch × jede Tastatur × jedes Zeichen, das auf
 * ihr vorkommt (Tasten, Griffe, Grossbuchstaben, Zeichen über Totasten) -
 * im Fingerhinweis über dem Tippfeld, im Totasten-Hinweis (F6) und in der
 * „nächsten Taste" der Stand-Zeile. Dazu die Gegenprobe mit der deutschen
 * Namensfunktion: sie muss anschlagen.
 */
import { afterEach, describe, expect, it } from "vitest";
import { SITZUNG_TEXTE, totastenHinweisFuer } from "../src/components/typing/TypingSession";
import { STAND_TEXTE } from "../src/components/typing/StandZeile";
import { LAYOUTS, setLayout } from "../src/lib/typing/layouts";
import {
  FINGERS,
  charLabel,
  fingerForChar,
  needsShift,
  shiftHandFor,
  spokenLabel,
} from "../src/lib/typing/fingers";
import { kombizeichenFuerLayout, kombizeichenZu } from "../src/lib/typing/totasten";
import { introOrder } from "../src/lib/typing/letters";
import type { BedienSprache } from "../src/lib/bedienSprache";

afterEach(() => setLayout("de"));

const SPRACHEN: Exclude<BedienSprache, "de">[] = ["en", "fr", "es"];

/** Alle Zeichen, die auf der eingestellten Tastatur einen Weg haben. */
function zeichenDerTastatur(): string[] {
  const lay = LAYOUTS.find((l) => l.id === (globalThis as { __id?: string }).__id)!;
  const set = new Set<string>();
  for (const r of lay.rows) for (const k of r.keys) set.add(k);
  for (const k of Object.keys(lay.access)) set.add(k);
  for (const k of [...set]) if (k.toUpperCase() !== k && k.toUpperCase().length === 1) set.add(k.toUpperCase());
  for (const k of kombizeichenFuerLayout(lay)) {
    set.add(k.zeichen);
    set.add(k.zeichen.toUpperCase());
  }
  return [...set].filter((c) => c.trim() !== "");
}

/** Deutsche Wörter, die ein Zeichen oder einen Finger benennen - nur die, die es in `sprache` NICHT gibt. */
function deutscheWoerter(zeichen: readonly string[], sprache: BedienSprache): string[] {
  const woerter = new Set<string>();
  for (const c of zeichen) {
    const de = charLabel(c);
    if (de.length < 2 || de.toLowerCase() === spokenLabel(c, sprache).toLowerCase()) continue;
    for (const w of de.split(/\s+/)) if (w.length >= 4 && !/^\p{Lu}$/u.test(w)) woerter.add(w);
  }
  for (const f of Object.values(FINGERS)) for (const w of f.name.split(/\s+/)) if (w.length >= 4) woerter.add(w);
  woerter.add("großes");
  woerter.add("Umschalttaste");
  // Wörter, die in der Zielsprache genauso heissen, sind kein Fund.
  const gleich: Record<string, readonly string[]> = {
    // ★ G3b (25.10.2026): die griechischen Akzentnamen „Tonos" und „Dialytika" heissen in allen Sprachen so.
    en: ["Tilde", "Dollar", "Euro", "Plus", "Finger", "Tonos", "Dialytika"],
    fr: ["Tilde", "Dollar", "Euro", "Plus", "Apostroph", "Tonos", "Dialytika"],
    es: ["Tilde", "Euro", "Plus", "Tonos", "Dialytika"],
  };
  return [...woerter].filter((w) => !(gleich[sprache] ?? []).some((g) => g.toLowerCase() === w.toLowerCase()));
}

function funde(texte: readonly string[], woerter: readonly string[]): string[] {
  const out: string[] = [];
  for (const t of texte) {
    for (const w of woerter) {
      const re = new RegExp(`(?<!\\p{L})${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\p{L})`, "iu");
      if (re.test(t)) out.push(`„${w}" in „${t}"`);
    }
  }
  return out;
}

describe("★★★ W1 F3: jede Bedienungssprache nennt Zeichen und Finger in ihrer Sprache", () => {
  for (const sprache of SPRACHEN) {
    for (const lay of LAYOUTS) {
      it(`${sprache} × ${lay.id}: Fingerhinweis, Totasten-Hinweis und „nächste Taste" ohne deutsches Wort`, () => {
        setLayout(lay.id);
        (globalThis as { __id?: string }).__id = lay.id;
        const zeichen = zeichenDerTastatur();
        expect(zeichen.length).toBeGreaterThan(40); // der Wächter sieht wirklich etwas
        const st = SITZUNG_TEXTE[sprache];
        const texte: string[] = [];
        for (const c of zeichen) {
          const kombi = kombizeichenZu(c, lay);
          const seite = needsShift(c) ? shiftHandFor(c) : null;
          texte.push(st.fingerHinweis(c, fingerForChar(c), seite, needsShift(c)));
          if (kombi) texte.push(st.fingerHinweisTotaste(totastenHinweisFuer(kombi, sprache, st, seite, needsShift(c))));
        }
        for (const weg of ["de", "en", "fr", "es"] as const)
          for (const u of introOrder(weg)) texte.push(STAND_TEXTE[sprache].naechsteTasteName(u));
        const gefunden = funde(texte, deutscheWoerter(zeichen, sprache));
        expect(gefunden, gefunden.slice(0, 8).join("\n")).toEqual([]);
      });
    }
  }

  it("Gegenprobe: mit der deutschen Namensfunktion (so stand es bis W1) schlägt der Wächter an", () => {
    setLayout("fr");
    (globalThis as { __id?: string }).__id = "fr";
    const zeichen = zeichenDerTastatur();
    const wieBisher = zeichen.map((c) => `${charLabel(c)}, index droit`);
    expect(funde(wieBisher, deutscheWoerter(zeichen, "fr")).length).toBeGreaterThan(10);
    expect(funde(["Prochaine touche : Punkt"], deutscheWoerter(zeichen, "fr"))).not.toEqual([]);
  });

  it("F6: der Totasten-Hinweis nennt Totaste, Finger und Buchstaben - nicht mehr nur „ô,“", () => {
    setLayout("fr");
    const st = SITZUNG_TEXTE.fr;
    const ô = kombizeichenZu("ô", LAYOUTS.find((l) => l.id === "fr")!)!;
    expect(st.fingerHinweisTotaste(totastenHinweisFuer(ô, "fr", st, null, false))).toBe(
      "accent circonflexe (auriculaire droit), puis o, annulaire droit",
    );
    const À = kombizeichenZu("À", LAYOUTS.find((l) => l.id === "fr")!)!;
    expect(st.fingerHinweisTotaste(totastenHinweisFuer(À, "fr", st, "rechts", true))).toBe(
      "accent grave (index droit + AltGr), puis majuscule a, auriculaire gauche + touche Majuscule droite",
    );
    setLayout("ch");
    const Ä = kombizeichenZu("Ä", LAYOUTS.find((l) => l.id === "ch")!)!;
    expect(SITZUNG_TEXTE.de.fingerHinweisTotaste(totastenHinweisFuer(Ä, "de", SITZUNG_TEXTE.de, "rechts", true))).toBe(
      "Trema (rechter kleiner Finger), dann großes A, linker kleiner Finger + rechte Umschalttaste",
    );
  });
});
