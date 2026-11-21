/**
 * ★★★ G2a (02.10.2026): DAS SPRACHREGISTER (`src/lib/typing/sprachRegister.ts`).
 *
 * EINE Beschreibung je Sprache; der Code fragt Eigenschaften, nie die ID
 * (Leitfaden Falle 50). Ein unbekannter Wert WIRFT - nie still Deutsch.
 */
import { describe, expect, it } from "vitest";
import {
  ALLE_SPRACHEN,
  SPRACHREGISTER,
  grossFuer,
  istBuchstabe,
  istSprache,
  kleinFuer,
  klassencodeUmschreiben,
  sprachBeschreibung,
} from "../src/lib/typing/sprachRegister";
import { GEBIET } from "../src/lib/bedienSprache/texte";
import { SCHULJAHR_BEGINN_VORGABE } from "../src/lib/typing/schuljahrBeginn";
import { klassencodeVorschlag } from "../src/lib/lernwerkstatt/klassencode";
import type { Lang } from "../src/lib/typing/account";

// ★ G2-NEUN (25.10.2026): dazu die neun Sprachen des Gerüsts (eigene Prüfungen in `tastenflow-g2neun-sprachregister.test.ts`).
const ALLE: readonly Lang[] = ["de", "en", "fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];

describe("Sprachregister: Vollständigkeit", () => {
  it("jede Sprache der Liste hat einen Eintrag - und es sind genau siebzehn", () => {
    expect([...ALLE_SPRACHEN]).toEqual([...ALLE]);
    for (const s of ALLE_SPRACHEN) {
      const b = sprachBeschreibung(s);
      expect(b.id).toBe(s);
      expect(b.locale).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
      expect(b.pluralKategorien).toContain("other");
      expect(b.schuljahrMonat).toBeGreaterThanOrEqual(1);
      expect(b.schuljahrMonat).toBeLessThanOrEqual(12);
    }
  });

  it("ein unbekannter Wert WIRFT (nie still Deutsch)", () => {
    expect(() => sprachBeschreibung("xx" as Lang)).toThrow(/Unbekannte Sprache/);
    expect(() => sprachBeschreibung(undefined as unknown as Lang)).toThrow();
    expect(() => sprachBeschreibung("" as Lang)).toThrow();
    // Schlüssel der Objekt-Kette sind keine Sprachen
    expect(() => sprachBeschreibung("constructor" as Lang)).toThrow();
    expect(() => sprachBeschreibung("toString" as Lang)).toThrow();
    expect(() => grossFuer("a", "xx" as Lang)).toThrow();
    expect(() => kleinFuer("A", "xx" as Lang)).toThrow();
    expect(() => klassencodeUmschreiben("a", "xx" as Lang)).toThrow();
    expect(istSprache("it")).toBe(true);
    expect(istSprache("xx")).toBe(false);
    expect(istSprache("constructor")).toBe(false);
    expect(istSprache(3)).toBe(false);
  });

  it("de/en/fr/es: dieselben Werte wie der Code heute (Gebiet, Schuljahr)", () => {
    for (const s of ["de", "en", "fr", "es"] as const) {
      expect(SPRACHREGISTER[s].locale).toBe(GEBIET[s]);
      expect(SPRACHREGISTER[s].schuljahrMonat).toBe(SCHULJAHR_BEGINN_VORGABE);
      expect(SPRACHREGISTER[s].grossKleinLocale).toBeNull();
    }
  });

  it("it/pl/tr/cs: Gebiet und Schuljahr (September)", () => {
    expect(SPRACHREGISTER.it.locale).toBe("it-IT");
    expect(SPRACHREGISTER.pl.locale).toBe("pl-PL");
    expect(SPRACHREGISTER.tr.locale).toBe("tr-TR");
    expect(SPRACHREGISTER.cs.locale).toBe("cs-CZ");
    for (const s of ["it", "pl", "tr", "cs"] as const) expect(SPRACHREGISTER[s].schuljahrMonat).toBe(9);
  });
});

describe("Sprachregister: Mehrzahl-Formen (aus Intl.PluralRules)", () => {
  const formen = (s: Lang) => [...sprachBeschreibung(s).pluralKategorien].sort();
  it("pl = one/few/many/other, cs = one/few/many/other", () => {
    expect(formen("pl")).toEqual(["few", "many", "one", "other"]);
    expect(formen("cs")).toEqual(["few", "many", "one", "other"]);
  });
  it("tr = one/other, it = one/many/other", () => {
    expect(formen("tr")).toEqual(["one", "other"]);
    expect(formen("it")).toEqual(["many", "one", "other"]);
  });
  it("de und en = one/other", () => {
    expect(formen("de")).toEqual(["one", "other"]);
    expect(formen("en")).toEqual(["one", "other"]);
  });
});

describe("Sprachregister: Gross-/Kleinschreibung", () => {
  it("Türkisch: i ↔ İ und ı ↔ I", () => {
    expect(grossFuer("istanbul", "tr")).toBe("İSTANBUL");
    expect(grossFuer("ışık", "tr")).toBe("IŞIK");
    expect(kleinFuer("IŞIK", "tr")).toBe("ışık");
    expect(kleinFuer("İSTANBUL", "tr")).toBe("istanbul");
    // Einzelnes Zeichen
    expect(grossFuer("i", "tr")).toBe("İ");
    expect(kleinFuer("I", "tr")).toBe("ı");
  });

  it("Beispiel aus dem Auftrag: der erste Buchstabe von „istanbul\" wird İ", () => {
    expect(grossFuer("i", "tr") + "stanbul").toBe("İstanbul");
  });

  it("alle anderen Sprachen: EXAKT toUpperCase()/toLowerCase() (byte-gleich)", () => {
    const proben = ["istanbul", "IŞIK", "Straße", "ǅ", "ß", "ﬁsh", "İ", "ı", "łódź", "ŘEKA", "ñandú", "été", "Œuvre", "ÀÈÌÒÙ"];
    for (const s of ["de", "en", "fr", "es", "it", "pl", "cs"] as const) {
      for (const p of proben) {
        expect(grossFuer(p, s)).toBe(p.toUpperCase());
        expect(kleinFuer(p, s)).toBe(p.toLowerCase());
      }
    }
    expect(grossFuer("istanbul", "de")).toBe("ISTANBUL");
    expect(kleinFuer("IŞIK", "de")).toBe(kleinFuer("IŞIK", "en"));
  });
});

describe("Sprachregister: istBuchstabe (\\p{L})", () => {
  it("jeder Sonderbuchstabe aller acht Sprachen ist ein Buchstabe", () => {
    for (const z of "aZäöüßéèàçùâêîôûëïÿœñáíóúìòąćęłńóśźżıİğşčďěňřšťůýž") expect(istBuchstabe(z)).toBe(true);
  });
  it("Ziffern, Satzzeichen, Leerzeichen, mehrere Zeichen sind keiner", () => {
    for (const z of ["1", ".", " ", "¿", "€", "'", "-", "", "ab"]) expect(istBuchstabe(z)).toBe(false);
  });
});

describe("Sprachregister: Klassencode-Umschrift", () => {
  const u = (t: string, s: Lang) => klassencodeUmschreiben(t, s);
  it("Italienisch: à è é ì ò ù", () => {
    expect(u("àèéìòù", "it")).toBe("AEEIOU");
    expect(u("ÀÈÉÌÒÙ", "it")).toBe("AEEIOU");
  });
  it("Polnisch: ą ć ę ł ń ó ś ź ż", () => {
    expect(u("ąćęłńóśźż", "pl")).toBe("ACELNOSZZ");
    // Zeichen ohne Eintrag (d) bleiben unverändert; gross wird erst im Klassencode
    expect(u("Łódź", "pl")).toBe("LOdZ");
    expect(u("ĄĆĘŁŃÓŚŹŻ", "pl")).toBe("ACELNOSZZ");
  });
  it("Türkisch: ç ğ ı ö ş ü İ", () => {
    expect(u("çğıöşü", "tr")).toBe("CGIOSU");
    expect(u("İİ", "tr")).toBe("II");
    expect(u("ÇĞÖŞÜ", "tr")).toBe("CGOSU");
  });
  it("Tschechisch: á č ď é ě í ň ó ř š ť ú ů ý ž", () => {
    expect(u("áčďéěíňóřšťúůýž", "cs")).toBe("ACDEEINORSTUUYZ");
    expect(u("ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ", "cs")).toBe("ACDEEINORSTUUYZ");
  });
  it("de behält Ä → AE, Ö → OE, Ü → UE, ß/ẞ → SS; es Ñ → NI", () => {
    expect(u("äöüßẞ", "de")).toBe("AEOEUESSSS");
    expect(u("ÄÖÜ", "de")).toBe("AEOEUE");
    expect(u("Año", "es")).toBe("ANIo");
  });
  it("en und fr haben keine eigene Umschrift", () => {
    expect(u("École", "fr")).toBe("École");
    expect(u("Class", "en")).toBe("Class");
  });
  it("klassencodeVorschlag OHNE Sprache: wie bisher; MIT Sprache: Umschrift der Sprache", () => {
    // wie vor G2a
    expect(klassencodeVorschlag("MS-Wein")).toBe("MSWEIN");
    expect(klassencodeVorschlag("Año 5")).toBe("ANIO5");
    expect(klassencodeVorschlag("École")).toBe("ECOLE");
    expect(klassencodeVorschlag("Ärger 5")).toBe("AERGER5");
    // neu, mit Sprache
    expect(klassencodeVorschlag("Łódź 5A", "pl")).toBe("LODZ5A");
    expect(klassencodeVorschlag("Özlem 3", "tr")).toBe("OZLEM3");
    expect(klassencodeVorschlag("Şule 3", "tr")).toBe("SULE3");
    expect(klassencodeVorschlag("İlker 3", "tr")).toBe("ILKER3");
    expect(klassencodeVorschlag("Třída 5", "cs")).toBe("TRIDA5");
    expect(klassencodeVorschlag("Città 2", "it")).toBe("CITTA2");
    // Deutsch mit Sprache = Deutsch ohne
    expect(klassencodeVorschlag("Ärger 5", "de")).toBe("AERGER5");
  });
});
