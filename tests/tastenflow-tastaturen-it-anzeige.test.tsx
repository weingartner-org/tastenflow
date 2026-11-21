/**
 * ★★★ F3-it (02.10.2026, Falle 15): DIE BILDSCHIRM-TASTATUR DER ITALIENISCHEN TASTATUREN.
 *
 * Falle 15 (Leitfaden): „Tastatur-Anzeige einer neuen Sprache immer mit echter Tastatur daneben
 * vergleichen: Klein/Gross, zweite Ebene". Die Soll-Werte unten sind aus der Recherche R1
 * (`recherche-italienisch-2026-10-02/tastaturen-und-zeichen.md` §2.1, §2.5, §6) abgeschrieben - nicht
 * aus dem Modell abgeleitet, sonst prüfte der Test das Modell gegen sich selbst.
 *
 * Geprüft wird die GEZEICHNETE Tastatur Taste für Taste (`textContent` jeder Kappe):
 *  · `it`: vier Reihen wie auf Windows „Italiano" / Mac „Italiano - Pro"; Buchstaben GROSS, aber
 *    `è ì ò à ù` KLEIN (die Grossform gibt es dort nicht - keine Kappe „È").
 *  · `it-qzerty`: z/w vertauscht, m rechts von l, Ziffernreihe ZWEISTUFIG (Ziffer oben, Grundzeichen unten).
 *  · de/en/fr/es bleiben, wie sie waren (Gegenprobe: ß, Grossbuchstaben).
 *  · die nächste Taste wird an der richtigen Stelle hervorgehoben (é = Umschalt + è).
 *  · der Ziffernblock trägt ein Dezimalkomma.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";

import { Keyboard } from "../src/components/typing/Keyboard";
import { useGrosseTastatur } from "../src/lib/typing/grosseTastatur";
import { layoutById, setLayout, type KeyboardLayout, type LayoutId } from "../src/lib/typing/layouts";

beforeEach(() => {
  localStorage.removeItem("tippen-ziffernblock-erkannt");
  localStorage.removeItem("tippen-grosse-tastatur");
  useGrosseTastatur.setState({ aktiv: false });
});
afterEach(() => {
  cleanup();
  useGrosseTastatur.setState({ aktiv: false });
  setLayout("de");
});

function zeichne(id: LayoutId, nextChar?: string) {
  setLayout(id);
  const layout = layoutById(id);
  const { container } = render(
    <Keyboard layout={layout} unlocked={new Set()} showFingerColors={false} nextChar={nextChar} />,
  );
  const reihen = [...container.firstElementChild!.firstElementChild!.children] as HTMLElement[];
  return { container, reihen, layout };
}

/** Die Beschriftungen jeder Tastenreihe, wie die Kappen sie tragen (ohne Rand- und Zusatztasten). */
function kappen(reihen: HTMLElement[], layout: KeyboardLayout): string[][] {
  return layout.rows.map((row, r) => {
    const offset = row.left ? 1 : 0;
    return row.keys.map((_, j) => (reihen[r].children[offset + j] as HTMLElement).textContent ?? "");
  });
}

// ── it: Windows „Italiano" (141) / Mac „Italiano - Pro" - R1 §2.1 und §6.1 ──────────────────────────────

/** R1 §6.1 `rows` - wörtlich. */
const IT_ROWS: string[][] = [
  ["\\", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "ì"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "è", "+"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ò", "à", "ù"],
  ["<", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
];

/** Was auf den Kappen steht: Buchstaben gross, Akzentbuchstaben klein, Zeichen unverändert. */
const IT_KAPPEN: string[][] = [
  ["\\", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "ì"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "è", "+"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "ò", "à", "ù"],
  ["<", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "-"],
];

describe("E · it (Windows Italiano / Mac Italiano - Pro): die Anzeige gegen die R1-Matrix", () => {
  it("die Zeilen des Modells sind Zeichen für Zeichen die der Matrix (R1 §6.1)", () => {
    expect(layoutById("it").rows.map((r) => [...r.keys])).toEqual(IT_ROWS);
  });

  it("★ jede Kappe trägt, was die echte Kappe trägt: Buchstaben gross, è ì ò à ù klein - nie „È\"", () => {
    const { reihen, layout } = zeichne("it");
    expect(kappen(reihen, layout)).toEqual(IT_KAPPEN);
  });

  it("keine Kappe zeigt einen Grossbuchstaben mit Akzent (der ist auf Windows nicht tippbar)", () => {
    const { container } = zeichne("it");
    expect(container.textContent).not.toMatch(/[ÀÈÉÌÒÙ]/);
  });

  it("die acht Heimtasten (Grundreihe ohne g und h): a s d f j k l ò", () => {
    const heim = layoutById("it").rows[2].keys.filter((k) => !["g", "h", "à", "ù"].includes(k));
    expect(heim).toEqual(["a", "s", "d", "f", "j", "k", "l", "ò"]);
  });

  it("die ziffernreihe ist EINSTUFIG (Ziffern direkt, wie auf der echten Tastatur) - nur AZERTY/QZERTY zeigen zwei Zeichen", () => {
    const { container } = zeichne("it");
    expect(container.querySelector('[data-zweistufig="an"]')).toBeNull();
  });

  it("★ die nächste Taste für „é\" ist die è-Taste (é = Umschalt + è), die linke Umschalttaste leuchtet (Gegenhand)", () => {
    const { container } = zeichne("it", "é");
    const ziele = [...container.querySelectorAll(".tt-taste-ziel")].map((e) => e.textContent);
    expect(ziele).toContain("è");
    expect(ziele).toContain("⇧"); // eine der beiden Umschalttasten
    expect(ziele.filter((z) => z === "⇧")).toHaveLength(1); // genau eine: die gegenüberliegende
  });

  it("die nächste Taste für „ì\" ist die ì-Taste (rechts von 0 und dem Apostroph), ohne Umschalt", () => {
    const { container } = zeichne("it", "ì");
    const ziele = [...container.querySelectorAll(".tt-taste-ziel")].map((e) => e.textContent);
    expect(ziele).toEqual(["ì"]);
  });
});

// ── it-qzerty: Mac „Italiano" - R1 §2.5 und §6.2 ───────────────────────────────────────────────────────

const QZ_ROWS: string[][] = [
  ["@", "&", "\"", "'", "(", "ç", "è", ")", "£", "à", "é", "-", "="],
  ["q", "z", "e", "r", "t", "y", "u", "i", "o", "p", "ì", "$"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "m", "ù", "§"],
  ["<", "w", "x", "c", "v", "b", "n", ",", ";", ":", "ò"],
];

/** Ziffernreihe zweistufig: die Ziffer (mit Umschalt) oben, das Grundzeichen unten - `textContent` = Ziffer + Zeichen. */
const QZ_KAPPEN: string[][] = [
  ["@", "1&", "2\"", "3'", "4(", "5ç", "6è", "7)", "8£", "9à", "0é", "-", "="],
  ["Q", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "ì", "$"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "M", "ù", "§"],
  ["<", "W", "X", "C", "V", "B", "N", ",", ";", ":", "ò"],
];

describe("E · it-qzerty (Mac Italiano): die Anzeige gegen die gemessene Belegung", () => {
  it("die Zeilen des Modells sind Zeichen für Zeichen die der Messung (R1 §2.5)", () => {
    expect(layoutById("it-qzerty").rows.map((r) => [...r.keys])).toEqual(QZ_ROWS);
  });

  it("★ jede Kappe: z und w vertauscht, m rechts von l, Ziffern ZWEISTUFIG (Ziffer oben, Zeichen unten), Akzente klein", () => {
    const { reihen, layout } = zeichne("it-qzerty");
    expect(kappen(reihen, layout)).toEqual(QZ_KAPPEN);
  });

  it("die zweistufigen Kappen tragen ihr Kennzeichen (Ziffer oben) - die übrigen Tasten nicht", () => {
    const { container } = zeichne("it-qzerty");
    expect(container.querySelectorAll('[data-zweistufig="an"]')).toHaveLength(10); // 1 2 3 4 5 6 7 8 9 0
  });

  it("die achte Heimtaste ist m (nicht ò): Grundreihe a s d f j k l m", () => {
    const heim = layoutById("it-qzerty").rows[2].keys.filter((k) => !["g", "h", "ù", "§"].includes(k));
    expect(heim).toEqual(["a", "s", "d", "f", "j", "k", "l", "m"]);
  });

  it("★ die nächste Taste für die Ziffer „1\" ist die &-Taste (Ziffer nur mit Umschalt), Umschalt gegenüber", () => {
    const { container } = zeichne("it-qzerty", "1");
    const ziele = [...container.querySelectorAll(".tt-taste-ziel")].map((e) => e.textContent);
    expect(ziele).toContain("1&");
    expect(ziele).toContain("⇧");
  });

  it("die nächste Taste für „z\" ist die Taste neben q (z und w sind vertauscht)", () => {
    const { container, reihen, layout } = zeichne("it-qzerty", "z");
    const ziele = [...container.querySelectorAll(".tt-taste-ziel")];
    expect(ziele.map((e) => e.textContent)).toEqual(["Z"]);
    const taste = reihen[1].children[1 + 1] as HTMLElement; // Reihe 1 hat links ⇥: Spalte 1 = z
    expect(taste.textContent).toBe("Z");
    expect(layout.rows[1].keys[1]).toBe("z");
  });
});

// ── Ziffernblock und Gegenprobe ───────────────────────────────────────────────────────────────────────

describe("E · Ziffernblock: Dezimalkomma wie in Italien; Gegenprobe de/en/fr/es", () => {
  it.each(["it", "it-qzerty"] as const)("%s: der Ziffernblock trägt ein Komma", (id) => {
    useGrosseTastatur.setState({ aktiv: true });
    const { container } = zeichne(id);
    const block = container.querySelector('[data-ziffernblock="an"]')!;
    expect(block.textContent).toContain(",");
    expect(block.textContent).not.toContain(".");
  });

  it("us: der Ziffernblock trägt weiter einen Punkt (unverändert)", () => {
    useGrosseTastatur.setState({ aktiv: true });
    const { container } = zeichne("us");
    expect(container.querySelector('[data-ziffernblock="an"]')!.textContent).toContain(".");
  });

  it("de: ß bleibt „ß\", Buchstaben gross, keine zweistufige Kappe; es: ñ bleibt gross wie bisher", () => {
    const de = zeichne("de");
    expect(kappen(de.reihen, de.layout)[0][11]).toBe("ß");
    expect(de.container.querySelector('[data-zweistufig="an"]')).toBeNull();
    cleanup();
    const es = zeichne("es");
    const zeile = kappen(es.reihen, es.layout)[2];
    expect(zeile[9]).toBe("Ñ");
    expect(es.container.querySelector('[data-zweistufig="an"]')).toBeNull();
  });

  it("fr: AZERTY bleibt zweistufig, é klein (unverändert durch F3-it)", () => {
    const fr = zeichne("fr");
    const kap = kappen(fr.reihen, fr.layout);
    expect(kap[0][2]).toBe("2é");
    expect(fr.container.querySelectorAll('[data-zweistufig="an"]').length).toBeGreaterThan(0);
  });
});
