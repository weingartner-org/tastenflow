/**
 * ★★★★★ WÄCHTER M4 (ES-P7a-Behebung, 27.09.2026, Prüfbericht Fundament es):
 * Die Heimtaste des rechten kleinen Fingers hiess auf Weg „es" „;" statt
 * „ñ" - `achteGrundtasteHomeKey` (fingers.ts) kannte „es" nicht und fiel in
 * den `en`-Zweig. Betroffen: JEDE Ansage dieses Fingers (p, ñ, ¿ ?, ¡, ´ auf
 * es, 0, ', -), in Übung, Fingerdiktat und Expedition - „;" liegt auf beiden
 * spanischen Tastaturen an einer STELLE, DIE ES NICHT GIBT (Umschalt+Komma);
 * ein Kind mit Blindheit sucht dort vergeblich.
 *
 * Geprüft wird die FEHLERKLASSE (Prüfbericht §7 Vorschlag): für JEDEN Weg
 * liegt `homeKeyFor(f, weg)` jedes Fingers in `lernwegDef(weg).homeKeys`
 * UND auf einer Taste der Grundreihe - nicht nur für den rechten kleinen
 * Finger auf Weg „es", sondern für ALLE Finger auf ALLEN Wegen (deckt einen
 * künftigen Fehler derselben Art ab, nicht nur die reparierte Stelle).
 */
import { afterEach, describe, expect, it } from "vitest";
import { FINGERS, fingerGuide, homeKeyFor } from "@/lib/typing/fingers";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { lernwegDef, type Lernweg } from "@/lib/typing/lernweg";

afterEach(() => setLayout("de"));

const WEGE: Lernweg[] = ["de", "en", "fr", "es"];
const TASTATUR_JE_WEG: Record<Lernweg, LayoutId[]> = {
  de: ["de", "ch", "us", "uk"],
  en: ["de", "ch", "us", "uk"],
  fr: ["fr", "be", "ch-fr", "ca-csa", "ca-fr"],
  es: ["es", "latam"],
  // RÜCKFALL-EN (G2a): it, pl, tr, cs zeigen vorerst Englisch.
  it: ["de", "ch", "us", "uk"],
  pl: ["de", "ch", "us", "uk"],
  tr: ["de", "ch", "us", "uk"],
  cs: ["de", "ch", "us", "uk"],
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: ["de", "ch", "us", "uk"],
  el: ["de", "ch", "us", "uk"],
  hu: ["de", "ch", "us", "uk"],
  nl: ["de", "ch", "us", "uk"],
  pt: ["de", "ch", "us", "uk"],
  br: ["de", "ch", "us", "uk"],
  ro: ["de", "ch", "us", "uk"],
  sv: ["de", "ch", "us", "uk"],
  uk: ["de", "ch", "us", "uk"],
};

describe("★★★★★ M4: homeKeyFor liegt für JEDEN Finger und JEDEN Weg auf einer echten Grundreihen-Taste", () => {
  for (const weg of WEGE) {
    for (const layout of TASTATUR_JE_WEG[weg]) {
      it(`${weg} auf ${layout}: jeder Finger hat eine Heimattaste aus homeKeys`, () => {
        setLayout(layout);
        const homeKeys = lernwegDef(weg).homeKeys;
        for (const id of Object.keys(FINGERS) as (keyof typeof FINGERS)[]) {
          if (id === "daumen") continue; // Leertaste - kein Buchstabe der Grundreihe
          const key = homeKeyFor(FINGERS[id], weg);
          expect(homeKeys.has(key), `${weg}/${layout}/${id}: „${key}" nicht in homeKeys`).toBe(true);
        }
      });
    }
  }

  it('Weg „es": rechter kleiner Finger ist „ñ" - auf ES UND LatAm', () => {
    for (const l of ["es", "latam"] as const) {
      setLayout(l);
      expect(homeKeyFor(FINGERS["kleiner-rechts"], "es"), l).toBe("ñ");
    }
  });

  it('Weg „es": jeder andere Finger bleibt bei seiner gewöhnlichen Heimattaste', () => {
    setLayout("es");
    for (const id of Object.keys(FINGERS) as (keyof typeof FINGERS)[]) {
      if (id === "kleiner-rechts" || id === "kleiner-links") continue;
      expect(homeKeyFor(FINGERS[id], "es"), id).toBe(FINGERS[id].homeKey);
    }
  });

  it('Weg „es" auf ES: die Ansage nennt „Ñ", nicht „;"', () => {
    setLayout("es");
    const g = fingerGuide("p", false, "es");
    expect(g).toContain("Heimattaste Ñ");
    expect(g).not.toContain("Heimattaste ;");
  });

  it("andere Wege bleiben unverändert (de/en/fr unberührt von der es-Behebung)", () => {
    setLayout("de");
    expect(homeKeyFor(FINGERS["kleiner-rechts"], "de")).toBe("ö");
    setLayout("us");
    expect(homeKeyFor(FINGERS["kleiner-rechts"], "en")).toBe(";");
    setLayout("fr");
    expect(homeKeyFor(FINGERS["kleiner-rechts"], "fr")).toBe("m");
  });
});
