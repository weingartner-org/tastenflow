/**
 * ★★★ G2a (02.10.2026): DER WÄCHTER „JEDE SPRACHE IST ÜBERALL EINGETRAGEN".
 *
 * Die Liste aller Sprachen wird NICHT von Hand geschrieben, sondern aus den
 * Schlüsseln der Register-Tabelle gelesen (`Object.keys(SPRACHREGISTER)`) -
 * kommt eine neunte Sprache dazu, prüft dieser Wächter sie sofort mit. Er
 * prüft je Sprache:
 *
 *  · `sprachBeschreibung` (Sprachregister)
 *  · `lernwegDef` (Lernweg, G2a: für it/pl/tr/cs ein bewusster ALIAS von „en“)
 *  · ein Sprachpaket (laden liefert die Form `SprachDaten`) und der Bedarf des Weges
 *  · einen Eintrag in einer `texte()`-Beispieltabelle
 *  · `SPRACH_TAG` und `GEBIET`
 *
 * Dazu die Schalter der vier neuen Lehrgänge (seit 10.10.2026 Vorgabe AN,
 * `=0` Not-Aus, `=1` wieder an, eigener Merker; `/it` usw. nur MIT Schalter) und die Weichen, die für einen
 * unbekannten Wert WERFEN statt still „de“ zu liefern (Falle 50).
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  ALLE_SPRACHEN,
  SPRACHREGISTER,
  altSpracheOderEn,
  mitRueckfallEn,
  sprachBeschreibung,
} from "../src/lib/typing/sprachRegister";
import {
  LERNWEGE,
  LERNWEGE_LISTE,
  bestimmeLernweg,
  istLernweg,
  lernwegDef,
  lernwegVon,
} from "../src/lib/typing/lernweg";
import {
  NEUE_LEHRGANG_SCHALTER,
  italienischLehrgangProbeAn,
  neueLehrgangProben,
  polnischLehrgangProbeAn,
  tschechischLehrgangProbeAn,
  tuerkischLehrgangProbeAn,
} from "../src/lib/typing/lehrgangSchalter";
import { ALLE_SPRACHPAKETE, _echterSprachpaketLader } from "../src/lib/typing/sprachpakete";
import { sprachPaketeFuer } from "../src/lib/typing/sprachpaketBedarf";
import { SPRACH_TAG } from "../src/lib/typing/vorlesen";
import { GEBIET, texte } from "../src/lib/bedienSprache/texte";
import {
  LANG_LABELS,
  LANG_LABELS_EN,
  LANG_LABELS_ES,
  LANG_LABELS_FR,
  uebungsSpracheImWeg,
  type Lang,
} from "../src/lib/typing/account";
import {
  adressWahlLesen,
  erkenneBedienSprache,
  istTastenflowMerker,
  type BedienSprache,
} from "../src/lib/bedienSprache/sprache";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";

const ALLE = Object.keys(SPRACHREGISTER) as Lang[];
const NEUE = ["it", "pl", "tr", "cs"] as const;
const FERTIG = ["de", "en", "fr", "es"] as const;
/** ★ G2-NEUN (25.10.2026): der Sprachteil des Gebiets - „br" ist Portugiesisch (Brasilien), Gebiet „pt-BR". */
const sprachcode = (s: Lang): string => (s === "br" ? "pt" : s);

beforeEach(() => localStorage.clear());

describe("jede Sprache der Register-Liste ist überall eingetragen", () => {
  // ★ G2-NEUN (25.10.2026): siebzehn - die acht und die neun des Gerüsts.
  it("die Liste hat siebzehn Sprachen und ist die Liste des Codes", () => {
    expect(ALLE).toHaveLength(17);
    expect([...ALLE_SPRACHEN]).toEqual(ALLE);
    expect([...LERNWEGE_LISTE].sort()).toEqual([...ALLE].sort());
    expect([...ALLE_SPRACHPAKETE].sort()).toEqual([...ALLE].sort());
  });

  for (const s of ALLE) {
    describe(`Sprache „${s}"`, () => {
      it("Sprachregister: Beschreibung vorhanden", () => {
        const b = sprachBeschreibung(s);
        expect(b.id).toBe(s);
        expect(b.locale.toLowerCase().startsWith(sprachcode(s))).toBe(true);
      });

      it("Lernweg: gültig und mit Definition (Reihenfolge, Tasten)", () => {
        expect(istLernweg(s)).toBe(true);
        const d = lernwegDef(s);
        expect(d.letterOrder.length).toBeGreaterThan(8);
        // W4: die beiden Heimtasten der Zeigefinger zuerst - lateinisch f j; ★ SPRACHEN-9 (29.10.2026): kyrillisch/griechisch die
        // Zeichen auf KeyF/KeyJ der eigenen Tastatur (bg о т, uk а о, el φ ξ).
        expect(d.letterOrder.slice(0, 2)).toEqual(heimZeichenDesWeges(s));
        expect(d.introOrder.length).toBeGreaterThan(d.letterOrder.length);
        expect(LERNWEGE[s]).toBe(d);
      });

      it("Sprachpaket: lädt und hat die Form SprachDaten", async () => {
        const daten = await _echterSprachpaketLader(s)();
        expect(daten).toBeDefined();
        expect(Array.isArray(daten?.korpus)).toBe(true);
        expect(typeof daten?.serien).toBe("object");
        expect(Array.isArray(daten?.lexikon)).toBe(true);
      });

      it("Bedarf des Weges: seine Übungssprache UND Englisch", () => {
        const pakete = sprachPaketeFuer(s);
        expect(pakete).toContain("en");
        expect(pakete).toContain(uebungsSpracheImWeg(undefined, s));
        // Deutsch kommt nur auf Weg „de“ mit - nie auf dem Weg einer anderen Sprache.
        if (s !== "de") expect(pakete).not.toContain("de");
      });

      it("texte(): ein Eintrag in der Beispiel-Tabelle, nie undefined", () => {
        const t = texte({ de: { a: "Hallo" }, en: { a: "Hello" } });
        expect(t[s as BedienSprache].a).toBeTypeOf("string");
      });

      it("SPRACH_TAG, GEBIET und die Namen der Sprache", () => {
        expect(SPRACH_TAG[s]).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
        expect(GEBIET[s as BedienSprache]).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
        expect(SPRACH_TAG[s].startsWith(sprachcode(s))).toBe(true);
        expect(GEBIET[s as BedienSprache].startsWith(sprachcode(s))).toBe(true);
        for (const tabelle of [LANG_LABELS, LANG_LABELS_EN, LANG_LABELS_FR, LANG_LABELS_ES]) {
          expect(tabelle[s]).toBeTypeOf("string");
          expect(tabelle[s].length).toBeGreaterThan(2);
        }
      });
    });
  }
});

describe("die vier neuen Sprachen: echte Werte", () => {
  it("SPRACH_TAG und GEBIET: it-IT, pl-PL, tr-TR, cs-CZ - gleich dem Register", () => {
    expect([SPRACH_TAG.it, SPRACH_TAG.pl, SPRACH_TAG.tr, SPRACH_TAG.cs]).toEqual(["it-IT", "pl-PL", "tr-TR", "cs-CZ"]);
    for (const s of NEUE) {
      expect(GEBIET[s]).toBe(SPRACH_TAG[s]);
      expect(GEBIET[s]).toBe(SPRACHREGISTER[s].locale);
      expect(SPRACHREGISTER[s].schuljahrMonat).toBe(9);
    }
  });

  it("die Namen der Sprachen (kein Rückfall auf „English\")", () => {
    expect(LANG_LABELS.it).toBe("Italienisch");
    expect(LANG_LABELS_EN.pl).toBe("Polish");
    expect(LANG_LABELS_FR.tr).toBe("Turc");
    expect(LANG_LABELS_ES.cs).toBe("Checo");
  });

  it("★ F4 (02.10.2026): kein Weg einer neuen Sprache ist mehr ein ALIAS von „en“ - it, pl, tr, cs haben je eine EIGENE Reihenfolge", () => {
    // Die Wächter je Sprache: `tastenflow-lernweg-{it,pl,tr,cs}-reihenfolge.test.ts` (Reihenfolge, Stufen, Tastaturen, Zeugen).
    // Bis F4 war pl, tr, cs hier ein Alias (`{ ...en }`); jetzt darf es keinen mehr geben, sonst übte ein Kind „Polnisch“ mit der
    // englischen Tastenfolge.
    for (const s of NEUE) {
      expect(LERNWEGE[s].letterOrder, s).not.toEqual(LERNWEGE.en.letterOrder);
      expect(LERNWEGE[s].introOrder, s).not.toEqual(LERNWEGE.en.introOrder);
    }
    // Die achte Heimtaste ist je Weg die der Sprache: ò, ;, ş, ů.
    expect(NEUE.map((s) => LERNWEGE[s].letterOrder[7])).toEqual(["ò", ";", "ş", "ů"]);
  });

  it("★ F4-it: Weg „it“ hat eine eigene Reihenfolge (nicht mehr die von „en“); ★ F5-F8: seit 02./03.10. mit Hauptsprache „it“, „pl“, „tr“ und „cs“ - jede neue Sprache", () => {
    expect(LERNWEGE.it.letterOrder).not.toEqual(LERNWEGE.en.letterOrder);
    expect(LERNWEGE.it.letterOrder.slice(0, 8)).toEqual(["f", "j", "d", "k", "s", "l", "a", "ò"]);
    expect(LERNWEGE.it.hauptsprache).toBe("it");
    expect(LERNWEGE.pl.hauptsprache).toBe("pl");
    expect(LERNWEGE.tr.hauptsprache).toBe("tr");
    expect(LERNWEGE.cs.hauptsprache).toBe("cs");
    // Der Alias auf „en“ gilt damit für KEINE neue Sprache mehr.
    for (const s of NEUE.filter((x) => x !== "it" && x !== "pl" && x !== "tr" && x !== "cs") as (typeof NEUE)[number][]) expect(LERNWEGE[s].hauptsprache).toBeUndefined();
  });

  it("der Weg einer neuen Sprache übt bis zu seiner eigenen Reihenfolge ENGLISCH (Alias) - NIE Deutsch; Italienisch, Polnisch und Türkisch seit F5-F8 ihre eigene Sprache", () => {
    expect(uebungsSpracheImWeg(undefined, "it")).toBe("it");
    expect(sprachPaketeFuer("it")).toEqual(["it", "en"]);
    // ★ F5-F8-pl/-tr/-cs (03.10.2026): Polnisch, Türkisch und Tschechisch ebenso - Hauptsprache und Englisch, Deutsch nie.
    expect(uebungsSpracheImWeg(undefined, "pl")).toBe("pl");
    expect(sprachPaketeFuer("pl")).toEqual(["pl", "en"]);
    expect(uebungsSpracheImWeg(undefined, "tr")).toBe("tr");
    expect(sprachPaketeFuer("tr")).toEqual(["tr", "en"]);
    expect(uebungsSpracheImWeg(undefined, "cs")).toBe("cs");
    expect(sprachPaketeFuer("cs")).toEqual(["cs", "en"]);
    for (const s of NEUE.filter((x) => x !== "it" && x !== "pl" && x !== "tr" && x !== "cs") as (typeof NEUE)[number][]) {
      expect(uebungsSpracheImWeg(undefined, s)).toBe("en");
      expect(sprachPaketeFuer(s)).toEqual(["en"]);
    }
    expect(sprachPaketeFuer("de")).toEqual(["de", "en"]);
    expect(sprachPaketeFuer("es")).toEqual(["es", "en"]);
  });
});

describe("mitRueckfallEn und altSpracheOderEn: ausdrücklich Englisch, nie Deutsch", () => {
  it("mitRueckfallEn füllt nur, was fehlt, mit dem ENGLISCHEN Wert", () => {
    const t = mitRueckfallEn({ de: "Hallo", en: "Hello", fr: "Salut", es: "Hola", pl: "Cześć" });
    expect(t.de).toBe("Hallo");
    expect(t.fr).toBe("Salut");
    expect(t.pl).toBe("Cześć");
    expect(t.it).toBe("Hello");
    expect(t.tr).toBe("Hello");
    expect(t.cs).toBe("Hello");
    expect(Object.keys(t).sort()).toEqual([...ALLE].sort());
  });

  it("altSpracheOderEn: vier fertige unverändert, vier neue → en", () => {
    for (const s of FERTIG) expect(altSpracheOderEn(s)).toBe(s);
    for (const s of NEUE) expect(altSpracheOderEn(s)).toBe("en");
  });
});

describe("die Schalter der vier neuen Lehrgänge", () => {
  const schalter = [
    ["it", italienischLehrgangProbeAn, "italienisch-lehrgang", "tastenflow-italienisch-lehrgang"],
    ["pl", polnischLehrgangProbeAn, "polnisch-lehrgang", "tastenflow-polnisch-lehrgang"],
    ["tr", tuerkischLehrgangProbeAn, "tuerkisch-lehrgang", "tastenflow-tuerkisch-lehrgang"],
    ["cs", tschechischLehrgangProbeAn, "tschechisch-lehrgang", "tastenflow-tschechisch-lehrgang"],
  ] as const;

  for (const [s, fn, adresse, merker] of schalter) {
    it(`${s}: Vorgabe AN, ?${adresse}=0 Not-Aus (gemerkt), =1 wieder an`, () => {
      expect(NEUE_LEHRGANG_SCHALTER[s]).toEqual({ adresse, merker });
      expect(localStorage.getItem(merker)).toBeNull();
      expect(fn("")).toBe(true);
      // Ein Merker mit irgendeinem Wert ausser "0" heisst AN - nur "0" ist der Not-Aus.
      localStorage.setItem(merker, "irgendwas");
      expect(fn("")).toBe(true);
      localStorage.clear();
      expect(fn(`?${adresse}=0`)).toBe(false);
      expect(localStorage.getItem(merker)).toBe("0");
      expect(fn("")).toBe(false);
      expect(fn(`?${adresse}=1`)).toBe(true);
      expect(localStorage.getItem(merker)).toBe("1");
      expect(fn("")).toBe(true);
    });

    it(`${s}: der Merker zählt NICHT als „Gerät kennt Tastenflow"`, () => {
      expect(istTastenflowMerker(merker)).toBe(false);
    });

    it(`${s}: ein anderer Schalter schaltet diesen nie mit (und nie aus)`, () => {
      const andere = schalter.filter(([x]) => x !== s);
      for (const [, f2, a2] of andere) f2(`?${a2}=0`);
      expect(fn("")).toBe(true);
      expect(localStorage.getItem(merker)).toBeNull();
      localStorage.setItem(merker, "0");
      for (const [, f2, a2] of andere) f2(`?${a2}=1`);
      expect(fn("")).toBe(false);
    });
  }

  it("neueLehrgangProben liefert genau die vier Felder von bestimmeLernweg", () => {
    expect(neueLehrgangProben("")).toEqual({
      italienischLehrgangProbeAn: true,
      polnischLehrgangProbeAn: true,
      tuerkischLehrgangProbeAn: true,
      tschechischLehrgangProbeAn: true,
      // ★ G2-NEUN (25.10.2026): die neun Schalter des Gerüsts - alle aus (Vorgabe).
      geruestLehrgangAn: { bg: true, el: true, hu: true, nl: true, pt: true, br: true, ro: true, sv: true, uk: true },
    });
    expect(neueLehrgangProben("?polnisch-lehrgang=0").polnischLehrgangProbeAn).toBe(false);
    expect(neueLehrgangProben("").italienischLehrgangProbeAn).toBe(true);
  });

  it("gesperrter Speicher: kein Absturz, Vorgabe an; der Not-Aus der Adresse wirkt trotzdem", () => {
    const echt = window.localStorage;
    const kaputt = {
      getItem: () => {
        throw new Error("gesperrt");
      },
      setItem: () => {
        throw new Error("gesperrt");
      },
      removeItem: () => {
        throw new Error("gesperrt");
      },
    };
    Object.defineProperty(window, "localStorage", { value: kaputt, configurable: true });
    try {
      expect(italienischLehrgangProbeAn("")).toBe(true);
      expect(italienischLehrgangProbeAn("?italienisch-lehrgang=0")).toBe(false);
      expect(italienischLehrgangProbeAn("?italienisch-lehrgang=1")).toBe(true);
    } finally {
      Object.defineProperty(window, "localStorage", { value: echt, configurable: true });
    }
  });
});

describe("Freigabe 10.10.2026: keine Browsersprache wählt eine neue Sprache; Adresse und Wahl nur MIT Schalter", () => {
  it("erkenneBedienSprache: auch mit allen Schaltern an wird aus it/pl/tr/cs-Browser nie „it/pl/tr/cs\"", () => {
    for (const b of ["it-IT", "pl-PL", "tr-TR", "cs-CZ", "it", "pl", "tr", "cs"]) {
      expect(erkenneBedienSprache([b], true, true), b).toBe("en");
    }
  });

  it("?bedienung=it … und /it … wirken OHNE den Schalter der Sprache nicht (Not-Aus; Vorgabe der Funktion: aus)", () => {
    for (const s of NEUE) {
      expect(adressWahlLesen(`?bedienung=${s}`, "/", true, true), s).toBeNull();
      expect(adressWahlLesen("", `/${s}`, true, true), s).toBeNull();
      expect(adressWahlLesen("", `/${s}/`, true, true), s).toBeNull();
    }
  });
});

describe("Weichen: ein unbekannter Wert WIRFT, nie still „de“ (Falle 50)", () => {
  it("lernwegVon: fehlend ⇒ de (Bestand); vorhanden aber unbekannt ⇒ Fehler", () => {
    expect(lernwegVon(undefined)).toBe("de");
    expect(lernwegVon(null)).toBe("de");
    expect(lernwegVon({})).toBe("de");
    expect(lernwegVon({ lernweg: "" })).toBe("de");
    expect(lernwegVon({ lernweg: undefined })).toBe("de");
    expect(() => lernwegVon({ lernweg: "xx" })).toThrow(/Unbekannter Lernweg/);
    expect(() => lernwegVon({ lernweg: 3 })).toThrow(/Unbekannter Lernweg/);
    expect(() => lernwegVon({ lernweg: "constructor" })).toThrow();
    for (const s of ALLE) expect(lernwegVon({ lernweg: s })).toBe(s);
  });

  it("istLernweg: aus der Liste, nicht von Hand", () => {
    for (const s of ALLE) expect(istLernweg(s)).toBe(true);
    for (const x of ["xx", "", "DE", "toString", undefined, null, 3, {}]) expect(istLernweg(x)).toBe(false);
  });

  it("bestimmeLernweg: unbekannte Bedienungssprache wirft; ein gespeicherter Weg gewinnt trotzdem", () => {
    expect(() =>
      bestimmeLernweg({ gespeichert: null, bedienSprache: "xx" as BedienSprache, lehrgangProbeAn: true }),
    ).toThrow(/Unbekannte Bedienungssprache/);
    expect(bestimmeLernweg({ gespeichert: "pl", bedienSprache: "de", lehrgangProbeAn: false })).toBe("pl");
  });

  it("bestimmeLernweg: neue Sprache NUR mit ihrem Schalter, sonst „de“ wie bei jeder Bedienung ohne Lehrgang", () => {
    const flag = {
      it: "italienischLehrgangProbeAn",
      pl: "polnischLehrgangProbeAn",
      tr: "tuerkischLehrgangProbeAn",
      cs: "tschechischLehrgangProbeAn",
    } as const;
    for (const s of NEUE) {
      expect(bestimmeLernweg({ gespeichert: null, bedienSprache: s, lehrgangProbeAn: true }), `${s} ohne Schalter`).toBe("de");
      expect(
        bestimmeLernweg({ gespeichert: null, bedienSprache: s, lehrgangProbeAn: true, [flag[s]]: true }),
        `${s} mit Schalter`,
      ).toBe(s);
      // der Schalter einer ANDEREN Sprache hilft nicht
      const anderer = NEUE.find((x) => x !== s)!;
      expect(
        bestimmeLernweg({ gespeichert: null, bedienSprache: s, lehrgangProbeAn: true, [flag[anderer]]: true }),
        `${s} mit fremdem Schalter`,
      ).toBe("de");
    }
  });

  it("de/en/fr/es: bestimmeLernweg wie vor G2a", () => {
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "de", lehrgangProbeAn: true })).toBe("de");
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "en", lehrgangProbeAn: true })).toBe("en");
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "en", lehrgangProbeAn: false })).toBe("de");
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "fr", lehrgangProbeAn: true })).toBe("de");
    expect(
      bestimmeLernweg({ gespeichert: null, bedienSprache: "fr", lehrgangProbeAn: true, franzoesischLehrgangProbeAn: true }),
    ).toBe("fr");
    expect(
      bestimmeLernweg({ gespeichert: null, bedienSprache: "es", lehrgangProbeAn: false, spanischLehrgangProbeAn: true }),
    ).toBe("es");
  });
});
