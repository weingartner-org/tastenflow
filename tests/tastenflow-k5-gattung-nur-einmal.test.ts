/**
 * ★★★ WÄCHTER K5 (28.09.2026, Auftrag „vier Reste", Befund ES-M2 §4): DAS
 * GATTUNGSWORT STEHT IN DER FEIER NUR EINMAL - Karte, Braillezeile, Ansage.
 *
 * Befund: Die Ansage war seit ES-M2 behoben, die sichtbare Karte sagte weiter
 * „el signo de puntuación signo de apertura de interrogación" und die
 * Braillezeile „Signo de puntuación nuevo signo de apertura de …" - der
 * spanische Name trägt das Gattungswort „signo" selbst.
 *
 * Geprüft über die FEHLERKLASSE: jede Bedienungssprache × jeder Weg × jede
 * Tastatur × jede Einheit. Das erste Wort jedes Gattungsworts der Sprache
 * (signo/signe/Satzzeichen/punctuation …) kommt in Kartenkopf, Braillezeile
 * und Ansage-Kopf höchstens einmal vor. Gemessen vor der Behebung: nur
 * Spanisch hat die Doppelung (¿ ? ¡ !); fr „le signe de ponctuation point
 * d'interrogation", de „das Satzzeichen Fragezeichen", en „the punctuation
 * mark question mark" doppeln das Gattungswort nicht.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  introOrder,
  unlockBrailleLabel,
  unlockBrailleLabelEn,
  unlockBrailleLabelEs,
  unlockBrailleLabelFr,
  unlockInfo,
  unlockInfoEn,
  unlockInfoEs,
  unlockInfoFr,
  unlockSpeech,
  unitLabelEs,
  type UnlockInfo,
} from "@/lib/typing";
import { FRANZOESISCHE_LAYOUT_IDS, SPANISCHE_LAYOUT_IDS, setLayout, type LayoutId } from "@/lib/typing/layouts";
import { LERNWEGE_LISTE, type Lernweg } from "@/lib/typing/lernweg";

type Sprache = "de" | "en" | "fr" | "es";
const BEDIENUNG: Sprache[] = ["de", "en", "fr", "es"];
const TASTATUREN: Record<Lernweg, readonly LayoutId[]> = {
  de: ["de", "ch", "us", "uk"],
  en: ["us", "uk", "de", "ch"],
  fr: [...FRANZOESISCHE_LAYOUT_IDS],
  es: [...SPANISCHE_LAYOUT_IDS],
  // RÜCKFALL-EN (G2a): it, pl, tr, cs zeigen vorerst Englisch.
  it: ["us", "uk", "de", "ch"],
  pl: ["us", "uk", "de", "ch"],
  tr: ["us", "uk", "de", "ch"],
  cs: ["us", "uk", "de", "ch"],
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: ["us", "uk", "de", "ch"],
  el: ["us", "uk", "de", "ch"],
  hu: ["us", "uk", "de", "ch"],
  nl: ["us", "uk", "de", "ch"],
  pt: ["us", "uk", "de", "ch"],
  br: ["us", "uk", "de", "ch"],
  ro: ["us", "uk", "de", "ch"],
  sv: ["us", "uk", "de", "ch"],
  uk: ["us", "uk", "de", "ch"],
};
const INFO: Record<Sprache, (u: string, w?: Lernweg) => UnlockInfo> = {
  de: unlockInfo,
  en: unlockInfoEn,
  fr: unlockInfoFr,
  es: unlockInfoEs,
};
const BRAILLE: Record<Sprache, (u: string, w?: Lernweg) => string> = {
  de: unlockBrailleLabel,
  en: unlockBrailleLabelEn,
  fr: unlockBrailleLabelFr,
  es: unlockBrailleLabelEs,
};
/** Das erste Wort jedes Gattungsworts der Sprache. */
const GATTUNG: Record<Sprache, string[]> = {
  de: ["Satzzeichen", "Sonderzeichen", "Buchstabe", "Ziffer", "Taste"],
  en: ["punctuation", "special", "letter", "digit", "dead"],
  fr: ["signe", "caractère", "lettre", "chiffre", "touche"],
  es: ["signo", "carácter", "letra", "número", "tecla"],
};

/** Wie `UnlockCelebration` den Kopf der Karte setzt. */
const kartenKopf = (i: UnlockInfo) => (i.name ? `${i.article} ${i.noun} ${i.name}` : i.noun);
/** Der Kopf der sachlichen Ansage: nach dem ersten Doppelpunkt bis zum Satzende. */
const ansageKopf = (s: string) => s.slice(s.indexOf(":") + 1).split(/\. /)[0];

function doppelt(text: string, b: Sprache): string[] {
  return GATTUNG[b].filter((w) => (text.match(new RegExp(`(^|[^\\p{L}])${w}(?![\\p{L}])`, "giu")) ?? []).length > 1);
}

function fehler(u: string, b: Sprache, weg: Lernweg): string[] {
  const out: string[] = [];
  const karte = kartenKopf(INFO[b](u, weg));
  const braille = BRAILLE[b](u, weg);
  const ansage = ansageKopf(unlockSpeech(u, true, b, weg));
  for (const [wo, t] of [["Karte", karte], ["Braille", braille], ["Ansage", ansage]] as const)
    if (doppelt(t, b).length) out.push(`${b}/${weg} ${u} ${wo}: „${t}"`);
  return out;
}

afterEach(() => setLayout("de"));

describe("K5: das Gattungswort nur einmal - jede Bedienung × jeder Weg", () => {
  for (const b of BEDIENUNG)
    it(`Bedienung ${b}`, () => {
      const alle: string[] = [];
      let geprueft = 0;
      for (const weg of LERNWEGE_LISTE)
        for (const lay of TASTATUREN[weg]) {
          setLayout(lay);
          for (const u of introOrder(weg)) {
            geprueft++;
            alle.push(...fehler(u, b, weg));
          }
        }
      expect(geprueft).toBeGreaterThan(500);
      expect(alle.slice(0, 10), `${alle.length} Funde`).toEqual([]);
    });

  it("die gemeldete Karte, jetzt (es und latam)", () => {
    for (const l of SPANISCHE_LAYOUT_IDS) {
      setLayout(l);
      expect(kartenKopf(unlockInfoEs("¿", "es"))).toBe("el signo de apertura de interrogación");
      expect(kartenKopf(unlockInfoEs("!", "es"))).toBe("el signo de cierre de exclamación");
      expect(unlockBrailleLabelEs("¿", "es")).toBe("Nuevo: signo de apertura de interrogación ¿");
      // Die Karte zeigt den ganzen Namen (Wächter M1 sucht ihn dort).
      expect(kartenKopf(unlockInfoEs("¿", "es"))).toContain(unitLabelEs("¿"));
      // Unverändert, wo nichts doppelt war:
      expect(kartenKopf(unlockInfoEs(",", "es"))).toBe("el signo de puntuación coma");
    }
  });

  it("Gegenprobe: der Wächter sieht die alte Karte", () => {
    expect(doppelt("el signo de puntuación signo de apertura de interrogación", "es")).toEqual(["signo"]);
    expect(doppelt("Signo de puntuación nuevo signo de cierre de exclamación !", "es")).toEqual(["signo"]);
    expect(doppelt("le signe de ponctuation point d'interrogation", "fr")).toEqual([]);
  });
});
