/**
 * ★★ S3 (28.09.2026, Schlussprüfung Nachtlauf): jedes Zeichen, das ein Kind
 * mit englischer Stimme tippt, hat einen englischen Namen.
 *
 * `SPOKEN_EN` (`fingers.ts`) kannte `" ( ) % & # < > € _ « » ¿ ¡` nicht - die
 * Stimme las das nackte Zeichen, und was sie daraus machte, war Zufall je
 * Stimme. `" ( ) % & # < >` sind Einheiten des Weges en, `€` ist die letzte
 * Sprosse auf UK, und seit D1 Nr. 18 üben Kinder auf fr/es mit Übungssprache
 * Englisch (Vorlese-Sprache en).
 *
 * Der Wächter deckt die Fehlerklasse: JEDE Einheit JEDER Reihenfolge (alle
 * vier Wege auf allen ihren Tastaturen), dazu die Zeichen, die in fr/es-Texten
 * ohne eigene Einheit vorkommen (« » ¿ ¡). Ein Satz- oder Sonderzeichen, das
 * `spokenLabel(…, "en")` unverändert zurückgibt, hat keinen Namen.
 */
import { afterEach, describe, expect, it } from "vitest";
import { spokenLabel } from "../src/lib/typing/fingers";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { setLayout } from "../src/lib/typing/layouts";
import type { Lernweg } from "../src/lib/typing/lernweg";

const WEGE: [Lernweg, string[]][] = [
  ["de", ["de", "ch", "us", "uk"]],
  ["en", ["us", "uk", "de", "ch"]],
  ["fr", ["fr", "be", "ch-fr", "ca-fr", "ca-csa"]],
  ["es", ["es", "latam"]],
];
const IN_TEXTEN = ["«", "»", "¿", "¡", '"', " "];

afterEach(() => setLayout("de"));

describe("S3: englische Namen für jedes Zeichen jeder Reihenfolge", () => {
  for (const [weg, tastaturen] of WEGE) {
    for (const lay of tastaturen) {
      it(`${weg}/${lay}: kein Satz- oder Sonderzeichen ohne englischen Namen`, () => {
        setLayout(lay);
        const zeichen = new Set<string>([...introOrder(weg).filter((u) => u !== SHIFT_UNIT), ...IN_TEXTEN]);
        const ohne = [...zeichen].filter((c) => !/[\p{L}\p{N}]/u.test(c) && spokenLabel(c, "en") === c);
        expect(ohne).toEqual([]);
      });
    }
  }

  it("die Namen sind britisch und dieselben wie in der englischen Tasten-Liste", () => {
    expect(spokenLabel("%", "en")).toBe("per cent");
    expect(spokenLabel("#", "en")).toBe("hash");
    expect(spokenLabel("(", "en")).toBe("open bracket");
    expect(spokenLabel('"', "en")).toBe("quotation mark");
    expect(spokenLabel("€", "en")).toBe("euro");
    expect(spokenLabel("¿", "en")).toBe("inverted question mark");
  });

  it("Gegenprobe: ein Zeichen ohne Eintrag fiele auf", () => {
    // ★ G3b (25.10.2026): „¤" hat seit den schwedischen Tastaturen einen Namen (currency sign) - die Probe nimmt „‰".
    expect(spokenLabel("‰", "en")).toBe("‰");
  });
});
