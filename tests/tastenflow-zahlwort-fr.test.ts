/**
 * ★★★ WÄCHTER: DAS FRANZÖSISCHE ZAHLWORT (E10a, 25.09.2026, Bauplan §5.4).
 *
 * Quelle der Stichproben: selbst hergeleitet aus den Regeln der
 * Rechtschreibreform 1990 (Bauplan §6.8/§1 F4) und gegengeprüft an
 * https://fr.wikipedia.org/wiki/Nombres_en_français (WebFetch 25.09.2026:
 * 70 „soixante-dix", 71 „soixante et onze", 77 „soixante-dix-sept", 80
 * „quatre-vingts", 81 „quatre-vingt-un", 90 „quatre-vingt-dix", 91
 * „quatre-vingt-onze", 99 „quatre-vingt-dix-neuf", 100 „cent", 180 „cent
 * quatre-vingts"/„cent-quatre-vingts" (Reform), 200 „deux cents", 201 „deux
 * cent un", 1000 „mille", 1990 „mille neuf cent quatre-vingt-dix"; Belgien
 * „septante"/„nonante", Schweiz „septante"/„huitante"/„nonante") sowie an
 * einzelnen Wiktionnaire-Einträgen (soixante-et-onze, quatre-vingt-onze,
 * huitante) für die „et"-Sonderregel.
 *
 * Aufbau: `COMMUN` sind die Zahlen, bei denen alle vier Varianten dasselbe
 * Wort liefern (jede Zahl, deren Rest modulo 100 unter 70 liegt - dort greift
 * keine Landesvariante). `VARIANTE_FR`/`VARIANTE_BE`/`VARIANTE_CH` sind die
 * Zahlen im Bereich 70-99 (und Vielfache von hundert/tausend, die diesen
 * Bereich enthalten), wo sich die vier Varianten unterscheiden (Kanada zählt
 * wie Frankreich, Bauplan §10.1: „wie FR"). Jede Stufe hat damit weit über
 * 40 Stichproben, inklusive aller in der Aufgabe geforderten Werte (70, 71,
 * 77, 80, 81, 90, 91, 99, 100, 180, 200, 201, 1000, 1990).
 */
import { describe, expect, it } from "vitest";
import { zahlwort, zahlwortFr, MAX_ZAHL_FR } from "@/lib/typing/zahlwort";
import type { FranzVariante } from "@/lib/typing/franzVariante";

/** Gilt für ALLE vier Varianten (Rest modulo 100 liegt unter 70). */
const COMMUN: [number, string][] = [
  [0, "zéro"], [1, "un"], [5, "cinq"], [9, "neuf"], [10, "dix"], [11, "onze"],
  [16, "seize"], [17, "dix-sept"], [19, "dix-neuf"], [20, "vingt"],
  [21, "vingt-et-un"], [22, "vingt-deux"], [29, "vingt-neuf"], [30, "trente"],
  [31, "trente-et-un"], [39, "trente-neuf"], [40, "quarante"],
  [41, "quarante-et-un"], [50, "cinquante"], [51, "cinquante-et-un"],
  [60, "soixante"], [61, "soixante-et-un"], [69, "soixante-neuf"],
  [100, "cent"], [101, "cent-un"], [110, "cent-dix"], [111, "cent-onze"],
  [120, "cent-vingt"], [150, "cent-cinquante"], [169, "cent-soixante-neuf"],
  [200, "deux-cents"], [201, "deux-cent-un"], [220, "deux-cent-vingt"],
  [269, "deux-cent-soixante-neuf"], [300, "trois-cents"],
  [320, "trois-cent-vingt"], [369, "trois-cent-soixante-neuf"],
  [500, "cinq-cents"], [561, "cinq-cent-soixante-et-un"], [600, "six-cents"],
  [669, "six-cent-soixante-neuf"], [1000, "mille"], [1001, "mille-un"],
  [1010, "mille-dix"], [1020, "mille-vingt"], [1069, "mille-soixante-neuf"],
  [1100, "mille-cent"], [1169, "mille-cent-soixante-neuf"],
  [2000, "deux-mille"], [2001, "deux-mille-un"], [2069, "deux-mille-soixante-neuf"],
  [5000, "cinq-mille"], [5061, "cinq-mille-soixante-et-un"], [9000, "neuf-mille"],
  [9069, "neuf-mille-soixante-neuf"], [9969, "neuf-mille-neuf-cent-soixante-neuf"],
];

/** fr-FR und fr-CA (identisch, Bauplan §10.1 „wie FR"). */
const VARIANTE_FR: [number, string][] = [
  [70, "soixante-dix"], [71, "soixante-et-onze"], [72, "soixante-douze"],
  [77, "soixante-dix-sept"], [79, "soixante-dix-neuf"], [80, "quatre-vingts"],
  [81, "quatre-vingt-un"], [89, "quatre-vingt-neuf"], [90, "quatre-vingt-dix"],
  [91, "quatre-vingt-onze"], [99, "quatre-vingt-dix-neuf"],
  [180, "cent-quatre-vingts"], [190, "cent-quatre-vingt-dix"],
  [199, "cent-quatre-vingt-dix-neuf"], [270, "deux-cent-soixante-dix"],
  [280, "deux-cent-quatre-vingts"], [970, "neuf-cent-soixante-dix"],
  [1070, "mille-soixante-dix"], [1090, "mille-quatre-vingt-dix"],
  [1980, "mille-neuf-cent-quatre-vingts"], [1990, "mille-neuf-cent-quatre-vingt-dix"],
  [2090, "deux-mille-quatre-vingt-dix"],
  [9999, "neuf-mille-neuf-cent-quatre-vingt-dix-neuf"],
];

const VARIANTE_BE: [number, string][] = [
  [70, "septante"], [71, "septante-et-un"], [72, "septante-deux"],
  [77, "septante-sept"], [79, "septante-neuf"], [80, "quatre-vingts"],
  [81, "quatre-vingt-un"], [89, "quatre-vingt-neuf"], [90, "nonante"],
  [91, "nonante-et-un"], [99, "nonante-neuf"], [180, "cent-quatre-vingts"],
  [190, "cent-nonante"], [199, "cent-nonante-neuf"],
  [270, "deux-cent-septante"], [280, "deux-cent-quatre-vingts"],
  [970, "neuf-cent-septante"], [1070, "mille-septante"], [1090, "mille-nonante"],
  [1980, "mille-neuf-cent-quatre-vingts"], [1990, "mille-neuf-cent-nonante"],
  [2090, "deux-mille-nonante"], [9999, "neuf-mille-neuf-cent-nonante-neuf"],
];

const VARIANTE_CH: [number, string][] = [
  [70, "septante"], [71, "septante-et-un"], [72, "septante-deux"],
  [77, "septante-sept"], [79, "septante-neuf"], [80, "huitante"],
  [81, "huitante-et-un"], [89, "huitante-neuf"], [90, "nonante"],
  [91, "nonante-et-un"], [99, "nonante-neuf"], [180, "cent-huitante"],
  [190, "cent-nonante"], [199, "cent-nonante-neuf"],
  [270, "deux-cent-septante"], [280, "deux-cent-huitante"],
  [970, "neuf-cent-septante"], [1070, "mille-septante"], [1090, "mille-nonante"],
  [1980, "mille-neuf-cent-huitante"], [1990, "mille-neuf-cent-nonante"],
  [2090, "deux-mille-nonante"], [9999, "neuf-mille-neuf-cent-nonante-neuf"],
];

const TABELLE: Record<FranzVariante, [number, string][]> = {
  "fr-FR": [...COMMUN, ...VARIANTE_FR],
  "fr-CA": [...COMMUN, ...VARIANTE_FR],
  "fr-BE": [...COMMUN, ...VARIANTE_BE],
  "fr-CH": [...COMMUN, ...VARIANTE_CH],
};

const VARIANTEN: FranzVariante[] = ["fr-FR", "fr-BE", "fr-CH", "fr-CA"];

describe("★ zahlwortFr: mindestens 40 Stichproben je Variante", () => {
  it.each(VARIANTEN)("%s hat mindestens 40 geprüfte Stichproben", (v) => {
    expect(TABELLE[v].length).toBeGreaterThanOrEqual(40);
  });

  it.each(VARIANTEN)("%s: jede Stichprobe stimmt", (v) => {
    for (const [n, erwartet] of TABELLE[v]) {
      expect(zahlwortFr(n, v), `${v} ${n}`).toBe(erwartet);
    }
  });

  it("die Pflichtwerte aus dem Auftrag stehen in jeder Tabelle", () => {
    const pflicht = [70, 71, 77, 80, 81, 90, 91, 99, 100, 180, 200, 201, 1000, 1990];
    for (const v of VARIANTEN) {
      const zahlen = TABELLE[v].map(([n]) => n);
      for (const p of pflicht) expect(zahlen, `${v} fehlt ${p}`).toContain(p);
    }
  });
});

describe("★ zahlwortFr: Rechtschreibreform 1990 (nur Bindestriche, kein Leerzeichen)", () => {
  it.each(VARIANTEN)("%s: kein Zahlwort trägt ein Leerzeichen", (v) => {
    for (const [n] of TABELLE[v]) {
      expect(zahlwortFr(n, v), String(n)).not.toMatch(/ /);
    }
  });
});

describe("★ zahlwortFr: Grenzen", () => {
  it("0 bis MAX_ZAHL_FR ist erlaubt, ausserhalb wirft es", () => {
    expect(MAX_ZAHL_FR).toBe(9999);
    expect(() => zahlwortFr(-1, "fr-FR")).toThrow();
    expect(() => zahlwortFr(10000, "fr-FR")).toThrow();
    expect(() => zahlwortFr(1.5, "fr-FR")).toThrow();
  });
});

describe("★ zahlwort(n, \"fr\") gibt es nicht - fr fällt nie still auf de (Bauplan §2.3 Punkt 4)", () => {
  it("wirft, statt deutsche Zahlwörter zurückzugeben", () => {
    // „fr" ist typseitig ein gültiger Lang-Wert (Gerüst, `account.ts`), aber
    // diese Funktion kennt ihn absichtlich nicht (siehe Kopfkommentar dort).
    expect(() => zahlwort(21, "fr")).toThrow();
  });
});
