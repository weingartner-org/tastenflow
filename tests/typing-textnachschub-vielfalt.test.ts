/**
 * TN-E13 (Rest-Charge): Vielfalt + die letzten Prüfbericht-Befunde.
 * Weichen von Johannes 27.07.: Dachdecker-Zungenbrecher BLEIBEN, das
 * Wein-Wortspiel wird ersetzt, Vielfalt/Multikulti kommt dazu.
 */
import { describe, expect, it } from "vitest";
import { CORPUS, CORPUS_EN } from "../src/lib/typing/corpus";
import { isDeactivated } from "../src/lib/typing/corpusDeactivated";
import { VIELFALT_KULTUREN_CORPUS } from "../src/lib/typing/corpusVielfaltKulturen";
import { EN_KORREKTUR2_CORPUS } from "../src/lib/typing/corpusEnKorrekturen2";
import { SERIEN } from "../src/lib/typing/serien";
import { validateHerkunft } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinKey } from "../src/lib/typing/ledger";

const aktivDe = CORPUS.filter((e) => !isDeactivated(e.kind, e.text));
const aktivEn = CORPUS_EN.filter((e) => !isDeactivated(e.kind, e.text));
const textDe = aktivDe.map((e) => e.text).join(" | ");

describe("TN-E13 Vielfalt: Namen", () => {
  it("Namen aus vielen Sprachräumen sind im Angebot", () => {
    for (const name of ["Amina", "Malik", "Ibrahim", "Zeynep", "Yusuf", "Priya", "Kwame", "Fatima", "Nguyen", "Marisol"])
      expect(textDe, name).toContain(name);
  });

  it("ein guter Teil davon ist schon für Anfänger tippbar", () => {
    // Sonst sähen gerade die Jüngsten sich am spätesten wieder.
    const fruehA = VIELFALT_KULTUREN_CORPUS.filter(
      (e) => e.stufen.includes("kids") && (minTierFor(e.text, "de") ?? 9) <= 2,
    );
    expect(fruehA.length).toBeGreaterThanOrEqual(18);
  });
});

describe("TN-E13 Vielfalt: Rollenbilder", () => {
  it("Frauen üben Berufe aus (vorher: 14 von 14 Frauenrollen häuslich)", () => {
    for (const beruf of [
      "Kranfahrerin",
      "Tischlerin",
      "Ärztin",
      "Busfahrerin",
      "Pilotin",
      "Forscherin",
      "Richterin",
      "Astronautin",
      "Elektrikerin",
      "Doktorin",
    ])
      expect(textDe, beruf).toContain(beruf);
  });

  it("Männer übernehmen Haushalt und Fürsorge", () => {
    for (const muster of [/Vater backt/, /Opa strickt/, /Papa singt beim Bügeln/, /wickelt das Baby/, /Onkel Ali kocht/])
      expect(textDe, String(muster)).toMatch(muster);
  });

  it("alle neuen Zeilen sauber: Herkunft, Länge, Zeichensatz", () => {
    for (const e of VIELFALT_KULTUREN_CORPUS) {
      expect(validateHerkunft(e.herkunft!), e.text).toEqual([]);
      expect(e.text.length, e.text).toBeLessThanOrEqual(85);
      expect(e.text, e.text).not.toMatch(/[„“”"«»…–—]/);
      expect(minTierFor(e.text, "de"), e.text).not.toBeNull();
    }
  });

  it("keine Dublette gegen den Bestand", () => {
    const meine = new Set(VIELFALT_KULTUREN_CORPUS.map((e) => bausteinKey("", e.text)));
    const z = new Map<string, number>();
    for (const e of aktivDe) {
      const k = bausteinKey("", e.text);
      if (meine.has(k)) z.set(k, (z.get(k) ?? 0) + 1);
    }
    expect([...z.entries()].filter(([, n]) => n > 1).map(([k]) => k)).toEqual([]);
  });
});

describe("TN-E13 Johannes-Weichen", () => {
  it("die Dachdecker-Zungenbrecher BLEIBEN (ausdrücklich gewünscht)", () => {
    expect(textDe).toMatch(/dicke Dachdecker deckt dir dein Dach/);
    expect(textDe).toMatch(/Drei dicke Damen donnern/);
  });

  it("das Wein-Wortspiel ist ersetzt, die Buchstaben-Pointe bleibt", () => {
    expect(isDeactivated("wortspiel", "Aus Wein wird mit einem B ein Bein.")).toBe(true);
    expect(textDe).toMatch(/Aus Eis wird mit einem R ein Reis/);
  });

  it("der Markenname ist raus, der Fakt bleibt", () => {
    expect(textDe).not.toMatch(/iPhone/);
    expect(textDe).toMatch(/Kleopatra lebte näher am ersten Smartphone/);
  });
});

describe("TN-E13 Englisch: Apostrophe und Schreibvarietät", () => {
  it("kein aktiver englischer Eintrag trägt noch einen Apostroph", () => {
    const mit = aktivEn.filter((e) => /['’]/.test(e.text));
    expect(mit.map((e) => e.text)).toEqual([]);
  });

  it("die Pointen sind dabei erhalten geblieben", () => {
    const t = aktivEn.map((e) => e.text).join(" | ");
    for (const muster of [/They do not have the guts/, /the flag is a big plus/, /They make up everything/, /crack each other up/])
      expect(t, String(muster)).toMatch(muster);
  });

  it("britische Schreibungen statt amerikanischer", () => {
    const t = aktivEn.map((e) => e.text).join(" | ");
    for (const brit of ["favourite", "colours", "metre", "litre", "holiday", "realised"])
      expect(t, brit).toContain(brit);
    for (const ame of ["favorite", "colors ", "centimeters", "milliliters", "elevator"])
      expect(t, ame).not.toContain(ame);
  });

  it("die Korrekturen liegen nicht höher im Tier als nötig", () => {
    for (const e of EN_KORREKTUR2_CORPUS) expect(minTierFor(e.text, "de"), e.text).not.toBeNull();
  });
});

describe("TN-E13 Geschichten: Vorbildwirkung entschärft", () => {
  const zeilen = (slug: string) =>
    SERIEN.find((s) => s.slug === slug)!.etappen.flatMap((e) => e.lines).join(" ");

  it("Ben nimmt kein Wildvogel-Ei mehr mit (in DE/AT verboten)", () => {
    const t = zeilen("ben-findet-ein-ei");
    expect(t).not.toMatch(/legt es warm in seine Tasche/);
    expect(t).toMatch(/Ein Ei im Wald bleibt liegen/);
    expect(t).toMatch(/holt Hilfe/);
  });

  it("Fische werden nicht mehr mit Brot gefüttert", () => {
    const t = zeilen("lena-und-der-kleine-fisch");
    expect(t).not.toMatch(/Brot als Futter/);
    expect(t).toMatch(/Futter aus dem Laden/);
  });

  it("das Kind holt keine Kohlen mehr aus dem Ofen", () => {
    const t = zeilen("der-kleine-schneemann");
    expect(t).not.toMatch(/Kohlen aus dem Ofen/);
    expect(t).toMatch(/Kohlen aus dem Korb/);
  });
});
