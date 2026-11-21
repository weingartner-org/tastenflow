/**
 * ★ E9-kids (26.09.2026): Totasten-Buchstaben (ê â î ô û ë ï ü ÿ) passen im
 * Weg „fr" zu einer Zeile, sobald ihre Totaste (`^` bzw. `¨`) UND ihr
 * Grundbuchstabe gelernt sind - so, wie es `lernweg.ts` (Kopf-Kommentar zu
 * E4) seit E4 behauptet: „ê â î ô û werden schreibbar, SOBALD ihr
 * Grundvokal … frei ist".
 *
 * Vor dieser Änderung stand „ê" nie im erlaubten Zeichensatz (die Einheit
 * heisst „^", nicht „ê") - `fitText("fête", …)` gab darum an JEDER Sprosse
 * `null`, auch mit allen Buchstaben. Keine Korpus- oder Serienzeile mit
 * Zirkumflex oder Trema konnte je serviert werden.
 *
 * Wege „de"/„en" bleiben unberührt (Gegenproben unten): dort gibt es die
 * Einheit „^" als Buchstaben nicht, und die Regel greift nur mit `lernweg
 * === "fr"`.
 */
import { afterEach, describe, it, expect } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { fitText } from "../src/lib/typing/corpus";
import { minTierFor } from "../src/lib/typing/tiers";
import { layoutLetterOrder } from "../src/lib/typing/letters";
import { CORPUS_FR_MITTE_KIDS } from "../src/lib/typing/corpusFrMitteKids";

setLayout("fr");
const ORDER = lernwegDef("fr").letterOrder;
function bis(einheit: string): Set<string> {
  return new Set(ORDER.slice(0, ORDER.indexOf(einheit) + 1));
}
function vor(einheit: string): Set<string> {
  return new Set(ORDER.slice(0, ORDER.indexOf(einheit)));
}

describe("fitText kennt Totasten-Buchstaben im Weg „fr“", () => {
  it("„fête“ passt erst MIT der Totaste ^ - vorher nicht", () => {
    expect(fitText("La fête", vor("^"), "fr")).toBeNull();
    expect(fitText("La fête", bis("^"), "fr")).toBe("La fête");
  });

  it("â ô ê und das grosse Ê gehen über ^", () => {
    expect(fitText("Un gâteau tout chaud", bis("^"), "fr")).toBe("Un gâteau tout chaud");
    expect(fitText("Il est drôle", bis("^"), "fr")).toBe("Il est drôle");
    // ★ W1 (27.09.2026, Windows-Messung §3.2/§3.8): Ê GIBT es auf Windows-
    // AZERTY (^, dann Umschalt + E) - bis W1 wurde es zu „E" ersetzt.
    // ★ W2a (28.09.2026, Punkt 7): frei, sobald die Einheit da ist, über die
    // es entsteht - hier ^ (bis W2a: erst mit der letzten Einheit des Weges).
    expect(fitText("Être là", vor("^"), "fr")).toBeNull();
    expect(fitText("Être là", bis("^"), "fr")).toBe("Être là");
    const alles = new Set(lernwegDef("fr").introOrder.map((u) => u.toLowerCase()));
    expect(fitText("Être là", alles, "fr")).toBe("Être là");
  });

  it("ë ï gehen erst über ¨, nicht schon über ^", () => {
    expect(fitText("Le maïs de Haïti", vor("¨"), "fr")).toBeNull();
    expect(fitText("Le maïs de Haïti", bis("¨"), "fr")).toBe("Le maïs de Haïti");
    expect(fitText("Maëlle", bis("¨"), "fr")).toBe("Maëlle");
  });

  it("der Grundbuchstabe muss auch frei sein (ÿ braucht y)", () => {
    const ohneY = new Set([...bis("¨")].filter((c) => c !== "y"));
    expect(fitText("ÿ", ohneY, "fr")).toBeNull();
  });

  it("minTierFor stuft eine Zeile mit ê auf Tier 3 (die ^-Sprosse)", () => {
    expect(minTierFor("La fête", "fr")).toBe(3);
  });

  it("Gegenprobe: ohne Lernweg „fr“ bleibt alles wie vorher (null)", () => {
    expect(fitText("La fête", bis("^"))).toBeNull();
    expect(fitText("La fête", bis("^"), "de")).toBeNull();
    expect(fitText("La fête", bis("^"), "en")).toBeNull();
  });
});

/**
 * ★★★ E9a-2 (26.09.2026): DIE 26 ç-ZEILEN AUF ca-fr - E9-kids hatte
 * gemeldet, dass keine der 26 Korpuszeilen mit „ç" (Sprosse 31) auf ca-fr je
 * serviert wurde. Ursache war NICHT `totastenBuchstabeFrei` (das betrifft nur
 * über eine Totaste ERST ENTSTEHENDE Zeichen wie ê/â - „ç" ist dagegen ein
 * ganz normaler `FR_LETTER_ORDER`-Buchstabe, überall gleich eingeführt),
 * sondern dass ca-fr „ç" von Anfang an in `missing` führte (layouts.ts) -
 * mit einer zusätzlichen Falle: die dort ebenfalls stehende GROSSFORM „Ç"
 * hätte, wäre sie stehen geblieben, wegen der kleingeschriebenen
 * `missing`-Prüfung (Bauplan §15.7) dieselbe Sperre erneut ausgelöst.
 *
 * Getestet mit `layoutLetterOrder` (layout-BEWUSst, wie die echte
 * Freischaltung eines Kindes über `onlyExistingKeys` läuft) - nicht mit dem
 * layout-unabhängigen `lernwegDef("fr").letterOrder` der Tests oben.
 */
describe("ç auf ca-fr - die Cedille-Totaste macht die 26 Zeilen wieder tippbar", () => {
  afterEach(() => setLayout("de"));

  function allowedAufLayout(id: LayoutId, einheit: string): Set<string> {
    setLayout(id);
    const order = layoutLetterOrder("fr");
    return new Set(order.slice(0, order.indexOf(einheit) + 1));
  }

  it("eine ECHTE Korpuszeile mit ç (Sprosse 31, Kids) passt jetzt auf ca-fr", () => {
    const zeile = CORPUS_FR_MITTE_KIDS.find((it) => it.text === "Le petit garçon joue dehors");
    expect(zeile, "die Zeile muss im echten Korpus stehen").toBeDefined();
    const allowed = allowedAufLayout("ca-fr", "ç");
    expect(fitText(zeile!.text, allowed, "fr")).toBe("Le petit garçon joue dehors");
  });

  it("dieselbe Zeile passt auch auf fr/be/ch-fr/ca-csa (ç ist dort keine Totaste, aber ebenso frei)", () => {
    for (const id of ["fr", "be", "ch-fr", "ca-csa"] as const) {
      const allowed = allowedAufLayout(id, "ç");
      expect(fitText("Le petit garçon joue dehors", allowed, "fr"), id).toBe(
        "Le petit garçon joue dehors",
      );
    }
  });

  it("eine ECHTE où-Zeile (Sprosse 32, Kids) passt auf ca-fr UND ch-fr (Gravis-Totaste)", () => {
    const zeile = CORPUS_FR_MITTE_KIDS.find((it) => it.text === "Je ne vois pas où est la tortue");
    expect(zeile, "die Zeile muss im echten Korpus stehen").toBeDefined();
    for (const id of ["ch-fr", "ca-fr"] as const) {
      const allowed = allowedAufLayout(id, "ù");
      expect(fitText(zeile!.text, allowed, "fr"), id).toBe("Je ne vois pas où est la tortue");
    }
  });

  it("VOR ihrer Sprosse (ç/ù noch nicht frei) passt die Zeile auf KEINER Tastatur", () => {
    for (const id of ["fr", "be", "ch-fr", "ca-csa", "ca-fr"] as const) {
      setLayout(id);
      const order = layoutLetterOrder("fr");
      const vorC = new Set(order.slice(0, order.indexOf("ç")));
      expect(fitText("Le petit garçon joue dehors", vorC, "fr"), id).toBeNull();
    }
  });
});
