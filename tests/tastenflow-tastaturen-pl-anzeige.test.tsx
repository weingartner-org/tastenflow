/**
 * ★★★ F3-pl (02.10.2026, Falle 15): DIE BILDSCHIRM-TASTATUR DER POLNISCHEN TASTATUR.
 *
 * Falle 15 (Leitfaden): „Tastatur-Anzeige einer neuen Sprache immer mit echter Tastatur daneben
 * vergleichen: Klein/Gross, zweite Ebene". Die Soll-Werte unten sind aus der Recherche R1
 * (`recherche-polnisch-2026-10-02/tastaturen-und-zeichen.md` §2.2, §3.1, §5, §8.2) und R0 (P2: die Hardware
 * in Polen trägt meist die US-Beschriftung) abgeschrieben - nicht aus dem Modell abgeleitet.
 *
 * ZWEI Ebenen sind zu prüfen:
 *  · die ERSTE (was auf der Kappe steht): US-Aufdruck - Buchstaben GROSS, kein polnischer Buchstabe auf
 *    einer Kappe (auf der echten Tastatur steht keiner dort), Ziffernreihe einstufig;
 *  · die ZWEITE (die AltGr-Ebene, auf der Kappe nicht gedruckt): sie wird beim Üben als Hervorhebung
 *    gezeigt - die Taste des Grundbuchstabens (ź: X), die rechte Alt-Taste (Mac: Option) und bei
 *    Grossformen die Umschalttaste der GEGENHAND.
 *  · de/en/fr/es/it bleiben, wie sie waren (Gegenprobe).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";

import { Keyboard } from "../src/components/typing/Keyboard";
import { useGrosseTastatur } from "../src/lib/typing/grosseTastatur";
import {
  layoutById,
  setLayout,
  setzeLayoutPlattform,
  type KeyboardLayout,
  type LayoutId,
} from "../src/lib/typing/layouts";

beforeEach(() => {
  localStorage.removeItem("tippen-ziffernblock-erkannt");
  localStorage.removeItem("tippen-grosse-tastatur");
  useGrosseTastatur.setState({ aktiv: false });
});
afterEach(() => {
  cleanup();
  useGrosseTastatur.setState({ aktiv: false });
  setzeLayoutPlattform(null);
  setLayout("de");
});

function zeichne(id: LayoutId, nextChar?: string) {
  setLayout(id);
  const layout = layoutById(id);
  const { container } = render(
    <Keyboard layout={layout} unlocked={new Set()} showFingerColors={false} nextChar={nextChar} />,
  );
  const spalte = container.firstElementChild!.firstElementChild as HTMLElement;
  const reihen = [...spalte.children] as HTMLElement[]; // vier Tastenreihen + die Leertastenreihe
  return { container, reihen, layout };
}

/** Die Beschriftungen jeder Tastenreihe, wie die Kappen sie tragen (ohne Rand- und Zusatztasten). */
function kappen(reihen: HTMLElement[], layout: KeyboardLayout): string[][] {
  return layout.rows.map((row, r) => {
    const offset = row.left ? 1 : 0;
    return row.keys.map((_, j) => (reihen[r].children[offset + j] as HTMLElement).textContent ?? "");
  });
}

/** Alles, was gerade als „nächste Taste" markiert ist (Buchstaben-Kappen, Zusatztasten). */
function ziele(container: HTMLElement): string[] {
  return [...container.querySelectorAll(".tt-taste-ziel")].map((e) => e.textContent ?? "");
}

// ── Die erste Ebene: US-Aufdruck - R1 §8.2, R0 P2 ─────────────────────────────────────────────────────

/** R1 §8.2 `rows` - wörtlich (ANSI_ROWS wie `us`). */
const PL_ROWS: string[][] = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

/** Was auf den Kappen steht: Buchstaben GROSS wie auf der US-Tastatur, alles andere unverändert. */
const PL_KAPPEN: string[][] = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
];

describe("E · pl: die erste Ebene (Aufdruck) gegen die R1-Matrix", () => {
  it("die Zeilen des Modells sind Zeichen für Zeichen die der Matrix (R1 §8.2)", () => {
    expect(layoutById("pl").rows.map((r) => [...r.keys])).toEqual(PL_ROWS);
  });

  it("★ jede Kappe trägt, was die US-Kappe trägt: Buchstaben gross, Zeichen unverändert - kein polnischer Buchstabe", () => {
    const { reihen, layout } = zeichne("pl");
    expect(kappen(reihen, layout)).toEqual(PL_KAPPEN);
  });

  it("★ keine Kappe zeigt einen polnischen Buchstaben, klein oder gross - die stehen auf der echten Taste nicht", () => {
    const { container } = zeichne("pl");
    expect(container.textContent).not.toMatch(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/);
  });

  it("die Ziffernreihe ist EINSTUFIG (Ziffern direkt, wie auf der US-Kappe)", () => {
    const { container } = zeichne("pl");
    expect(container.querySelector('[data-zweistufig="an"]')).toBeNull();
  });

  it("die acht Heimtasten (Grundreihe ohne g und h, mit ;): a s d f j k l ;", () => {
    const heim = layoutById("pl").rows[2].keys.filter((k) => !["g", "h", "'"].includes(k));
    expect(heim).toEqual(["a", "s", "d", "f", "j", "k", "l", ";"]);
  });

  it("★ die Leertastenreihe: Windows „Ctrl · Alt · Leertaste · Alt · Ctrl\", am Mac „Ctrl · Option · … · Option · Ctrl\"", () => {
    const lesen = (id: LayoutId) => {
      const { reihen } = zeichne(id);
      const unten = reihen[reihen.length - 1];
      return [...unten.children].map((k) => k.textContent ?? "");
    };
    setzeLayoutPlattform("windows");
    expect(lesen("pl")).toEqual(["Ctrl", "Alt", "Leertaste", "Alt", "Ctrl"]);
    cleanup();
    setzeLayoutPlattform("mac");
    expect(lesen("pl")).toEqual(["Ctrl", "Option", "Leertaste", "Option", "Ctrl"]);
  });

  it("der Ziffernblock der US-Hardware trägt einen Punkt (Dezimalkomma gilt für die Texte, nicht für die Kappe)", () => {
    useGrosseTastatur.setState({ aktiv: true });
    const { container } = zeichne("pl");
    expect(container.querySelector('[data-ziffernblock="an"]')!.textContent).toContain(".");
  });
});

// ── Die zweite Ebene: die Hervorhebung beim Üben - R1 §5, §3.1 ─────────────────────────────────────────

/** R1 §5 / §2.2: Zeichen ⇒ Kappe des Grundbuchstabens. */
const KAPPE_DES_GRUNDBUCHSTABENS: Record<string, string> = {
  "ą": "A", "ć": "C", "ę": "E", "ł": "L", "ń": "N", "ó": "O", "ś": "S", "ź": "X", "ż": "Z",
};
/** Liegt der Grundbuchstabe links, steht die Umschalttaste der Gegenhand RECHTS - und umgekehrt (R0 §4.2). */
const GRUNDBUCHSTABE_LINKS = new Set(["A", "C", "E", "S", "X", "Z"]);

describe("E · pl: die zweite Ebene - nächste Taste, AltGr-Taste, Umschalt der Gegenhand", () => {
  it.each(Object.entries(KAPPE_DES_GRUNDBUCHSTABENS))("%s: die Kappe %s und die rechte Alt-Taste leuchten - keine Umschalttaste", (z, kappe) => {
    setzeLayoutPlattform("windows");
    const { container } = zeichne("pl", z);
    expect(ziele(container).sort()).toEqual([kappe, "Alt"].sort());
  });

  it.each(Object.entries(KAPPE_DES_GRUNDBUCHSTABENS))("%s: am Mac leuchtet die Option-Taste statt der Alt-Taste", (z, kappe) => {
    setzeLayoutPlattform("mac");
    const { container } = zeichne("pl", z);
    expect(ziele(container).sort()).toEqual([kappe, "Option"].sort());
  });

  it.each(Object.entries(KAPPE_DES_GRUNDBUCHSTABENS))("%s grossgeschrieben: Kappe, Alt-Taste UND die Umschalttaste der Gegenhand", (z, kappe) => {
    setzeLayoutPlattform("windows");
    const { container, reihen } = zeichne("pl", z.toUpperCase());
    expect(ziele(container).sort()).toEqual([kappe, "Alt", "⇧"].sort());
    // welche Umschalttaste: Grundbuchstabe links ⇒ rechte, rechts ⇒ linke (die untere Tastenreihe trägt beide)
    const untereReihe = reihen[3];
    const links = untereReihe.firstElementChild as HTMLElement;
    const rechts = untereReihe.lastElementChild as HTMLElement;
    const leuchtet = (el: HTMLElement) => el.classList.contains("tt-taste-ziel");
    if (GRUNDBUCHSTABE_LINKS.has(kappe)) {
      expect(leuchtet(rechts), `${z.toUpperCase()}: rechte Umschalttaste`).toBe(true);
      expect(leuchtet(links), `${z.toUpperCase()}: linke Umschalttaste`).toBe(false);
    } else {
      expect(leuchtet(links), `${z.toUpperCase()}: linke Umschalttaste`).toBe(true);
      expect(leuchtet(rechts), `${z.toUpperCase()}: rechte Umschalttaste`).toBe(false);
    }
  });

  it("€: Windows AltGr + U (Kappe U), am Mac Option + 3 (Kappe 3)", () => {
    setzeLayoutPlattform("windows");
    expect(ziele(zeichne("pl", "€").container).sort()).toEqual(["Alt", "U"]);
    cleanup();
    setzeLayoutPlattform("mac");
    expect(ziele(zeichne("pl", "€").container).sort()).toEqual(["3", "Option"]);
  });

  it("ein gewöhnlicher Buchstabe lässt die Alt-Taste dunkel: „a\" ⇒ nur A; „A\" ⇒ A und die rechte Umschalttaste", () => {
    expect(ziele(zeichne("pl", "a").container)).toEqual(["A"]);
    cleanup();
    expect(ziele(zeichne("pl", "A").container).sort()).toEqual(["A", "⇧"]);
  });
});

// ── Gegenprobe: die anderen Tastaturen zeigen weiter, was sie zeigten ───────────────────────────────────

describe("Gegenprobe: de, en, fr, es, it unverändert", () => {
  it("die Leertastenreihe: de „Strg Alt … AltGr Strg\", us „Ctrl Alt … Alt Ctrl\", es „… Alt Gr …\" - auch am Mac", () => {
    const unten = (id: LayoutId): string[] => {
      const { reihen } = zeichne(id);
      const z = reihen[reihen.length - 1];
      return [...z.children].map((k) => k.textContent ?? "");
    };
    for (const p of ["windows", "mac"] as const) {
      setzeLayoutPlattform(p);
      expect(unten("de"), `de ${p}`).toEqual(["Strg", "Alt", "Leertaste", "AltGr", "Strg"]);
      cleanup();
      expect(unten("us"), `us ${p}`).toEqual(["Ctrl", "Alt", "Leertaste", "Alt", "Ctrl"]);
      cleanup();
      expect(unten("es"), `es ${p}`).toEqual(["Ctrl", "Alt", "Leertaste", "Alt Gr", "Ctrl"]);
      cleanup();
    }
  });

  it("de: ß bleibt „ß\" und die AltGr-Taste leuchtet für „@\" wie bisher; es: ñ gross, keine zweistufige Kappe", () => {
    const de = zeichne("de", "@");
    expect(kappen(de.reihen, de.layout)[0][11]).toBe("ß");
    expect(ziele(de.container).sort()).toEqual(["AltGr", "Q"]);
    cleanup();
    const es = zeichne("es");
    expect(kappen(es.reihen, es.layout)[2][9]).toBe("Ñ");
    expect(es.container.querySelector('[data-zweistufig="an"]')).toBeNull();
  });

  it("fr: AZERTY bleibt zweistufig, é klein; it: è ì ò à ù klein", () => {
    const fr = zeichne("fr");
    expect(kappen(fr.reihen, fr.layout)[0][2]).toBe("2é");
    cleanup();
    const it = zeichne("it");
    expect(kappen(it.reihen, it.layout)[2].slice(9)).toEqual(["ò", "à", "ù"]);
  });
});
