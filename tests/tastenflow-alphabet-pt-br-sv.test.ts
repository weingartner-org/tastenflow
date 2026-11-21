/**
 * ★ WÄCHTER O-INHALT-PT/BR/SV (29.10.2026): die Alphabet-Reihen auf den Wegen „pt", „br", „sv" (Vorbild `tastenflow-wortspiele-cs`
 * §6). pt/br: 26 Buchstaben, die Buchstaben mit Zeichen sortieren mit dem Grundbuchstaben und stehen nicht in der Reihe. sv: 29
 * Buchstaben, `å ä ö` am Ende, nach z - so sortiert `Intl.Collator("sv")`.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { introOrder } from "@/lib/typing/letters";
import { fitText } from "@/lib/typing/corpus";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import type { Lernweg } from "@/lib/typing/lernweg";
import { ALPHABET_ORDER_PT } from "@/lib/typing/uebungsformen/alphabetPt";
import { ALPHABET_ORDER_BR } from "@/lib/typing/uebungsformen/alphabetBr";
import { ALPHABET_ORDER_SV } from "@/lib/typing/uebungsformen/alphabetSv";

function zufall(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

afterEach(() => setLayout("de"));

const form = UEBUNGSFORMEN.find((f) => f.id === "alphabetreihen")!;

const WEGE: readonly (readonly [Lernweg, string, LayoutId, readonly string[]])[] = [
  ["pt", "pt-PT", "pt", ALPHABET_ORDER_PT],
  ["br", "pt-BR", "br-abnt2", ALPHABET_ORDER_BR],
  ["sv", "sv", "sv", ALPHABET_ORDER_SV],
];

describe.each(WEGE)("Alphabet-Reihen auf %s", (weg, locale, tastatur, alfabet) => {
  const ctx = (bis: number, shift = false): FormKontext => ({
    lernweg: weg, introduced: introOrder(weg).slice(0, bis), shift, oneHand: false, stufe: "kids", lang: weg,
    count: 40, zufall: zufall(3),
  });

  it("die Reihenfolge ist die, nach der die Sprache sortiert; Buchstaben mit Zeichen, die mit dem Grundbuchstaben sortieren, fehlen", () => {
    const sortiert = [...alfabet].reverse().sort(new Intl.Collator(locale).compare);
    expect(sortiert).toEqual([...alfabet]);
    const basis = new Intl.Collator(locale, { sensitivity: "base" });
    for (const b of alfabet) for (const c of alfabet) if (b !== c) expect(basis.compare(b, c), `${b} ${c}`).not.toBe(0);
    for (const zeichen of weg === "sv" ? ["é"] : ["á", "ã", "ç", "é", "ê", "õ"]) {
      expect(alfabet).not.toContain(zeichen);
      expect(alfabet.some((b) => basis.compare(b, zeichen) === 0), zeichen).toBe(true);
    }
    expect(alfabet.length).toBe(weg === "sv" ? 29 : 26);
  });

  it("mit allen Buchstaben läuft die Form, jede Zeile ist mit dem Lernstand tippbar", () => {
    setLayout(tastatur);
    const voll = introOrder(weg).length;
    const runde = form.baue!(ctx(voll, true))!;
    expect(runde.zeilen.length).toBeGreaterThanOrEqual(10);
    const erlaubt = new Set(introOrder(weg));
    for (const z of runde.zeilen) expect(fitText(z.text, erlaubt, weg, weg), z.text).toBe(z.text);
    const text = runde.zeilen.map((z) => z.text).join(" ").toLowerCase();
    if (weg === "sv") expect(text).toMatch(/[xyz]å|åä|äö/);
    else expect(text).not.toMatch(/[áãçéêõ]/);
  });
});
