/**
 * ★★★ F3-cs (02.10.2026, Falle 15): DIE BILDSCHIRM-TASTATUR UND DIE EINGABE DER TSCHECHISCHEN TASTATUREN.
 *
 * Falle 15 (Leitfaden): „Tastatur-Anzeige einer neuen Sprache immer mit echter Tastatur daneben vergleichen:
 * Klein/Gross, zweite Ebene". Die Soll-Werte unten sind aus der Recherche R1
 * (`recherche-tschechisch-2026-10-02/tastaturen-und-zeichen.md` §2.1, §4, §7, §8) abgeschrieben - nicht aus dem Modell
 * abgeleitet. Eine tschechische Kappe trägt:
 *  · die Buchstaben GROSS (A-Z), ausser den elf Buchstaben, auf denen Umschalt NICHT den Grossbuchstaben gibt - `ě š č ř ž ý á
 *    í é ú ů` stehen klein;
 *  · die Zahlenreihe ZWEISTUFIG: unten der Buchstabe (`ě š č ř ž ý á í é`), oben klein die Ziffer (Umschalt); die Taste 1 trägt `+`.
 *
 * ZWEI Ebenen sind zu prüfen:
 *  · die ERSTE (was auf der Kappe steht): Klein/Gross, zweistufige Zahlenreihe, Tastmarken auf f und j;
 *  · die ZWEITE (Umschalt / AltGr / Totaste): sie wird beim Üben als Hervorhebung gezeigt - die Taste des Grundzeichens, die
 *    AltGr-Taste (Mac: Option), die Umschalttaste der GEGENHAND. Bei einem Zwei-Schritt-Zeichen (Č ď ó ...) leuchtet der ERSTE
 *    Schritt: die Totaste. „Č" über die Taste `4č` mit Umschalt zu zeigen, hiesse das Kind die Ziffer 4 tippen lassen.
 * Dazu die EINGABE (Totaste, dann Buchstabe; Zahlenreihe) auf beiden Tastaturen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, renderHook } from "@testing-library/react";

import { Keyboard } from "../src/components/typing/Keyboard";
import { useTypingItem } from "../src/components/typing/useTypingItem";
import { useGrosseTastatur } from "../src/lib/typing/grosseTastatur";
import {
  layoutById,
  setLayout,
  setzeLayoutPlattform,
  type KeyboardLayout,
  type LayoutId,
} from "../src/lib/typing/layouts";
import { kombizeichenZu } from "../src/lib/typing/totasten";

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

/** Die Kappen, die einen Tasthöcker tragen (der kleine Strich unten auf der Kappe). */
function tastmarken(reihen: HTMLElement[], layout: KeyboardLayout): string[] {
  const aus: string[] = [];
  layout.rows.forEach((row, r) => {
    const offset = row.left ? 1 : 0;
    row.keys.forEach((_, j) => {
      const taste = reihen[r].children[offset + j] as HTMLElement;
      if (taste.querySelector("span[aria-hidden]")) aus.push(taste.textContent ?? "");
    });
  });
  return aus;
}

/** Alles, was gerade als „nächste Taste" markiert ist (Buchstaben-Kappen, Zusatztasten). */
function ziele(container: HTMLElement): string[] {
  return [...container.querySelectorAll(".tt-taste-ziel")].map((e) => e.textContent ?? "");
}

/** Welche Umschalttaste leuchtet: die linke, die rechte, keine, beide. */
function umschaltLeuchtet(reihen: HTMLElement[]): "links" | "rechts" | "keine" | "beide" {
  const unten = reihen[3];
  const links = (unten.firstElementChild as HTMLElement).classList.contains("tt-taste-ziel");
  const rechts = (unten.lastElementChild as HTMLElement).classList.contains("tt-taste-ziel");
  return links && rechts ? "beide" : links ? "links" : rechts ? "rechts" : "keine";
}

// ── Die erste Ebene: R1 §8 (rows) und die Kappen ──────────────────────────────────────────────────────────────

/** R1 §8 `rows` von cs - wörtlich. */
const CS_ROWS: string[][] = [
  [";", "+", "ě", "š", "č", "ř", "ž", "ý", "á", "í", "é", "=", "´"],
  ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ú", ")"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ů", "§", "¨"],
  ["\\", "y", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
];
/** R1 §8 `rows` von cs-qwerty - nur y und z getauscht. */
const CSQ_ROWS: string[][] = [
  CS_ROWS[0],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "ú", ")"],
  CS_ROWS[2],
  ["\\", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
];

/**
 * Was auf den Kappen steht: Buchstaben GROSS, die elf (ě š č ř ž ý á í é ú ů) KLEIN, die Zahlenreihe zweistufig - `textContent`
 * einer zweistufigen Kappe ist die Ziffer (oben) gefolgt vom Zeichen (unten).
 */
const CS_KAPPEN: string[][] = [
  [";", "1+", "2ě", "3š", "4č", "5ř", "6ž", "7ý", "8á", "9í", "0é", "=", "´"],
  ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "ú", ")"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "ů", "§", "¨"],
  ["\\", "Y", "X", "C", "V", "B", "N", "M", ",", ".", "-"],
];
const CSQ_KAPPEN: string[][] = [
  CS_KAPPEN[0],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "ú", ")"],
  CS_KAPPEN[2],
  ["\\", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "-"],
];

const TABELLE: ReadonlyArray<readonly [LayoutId, string[][], string[][]]> = [
  ["cs", CS_ROWS, CS_KAPPEN],
  ["cs-qwerty", CSQ_ROWS, CSQ_KAPPEN],
];

describe.each(TABELLE)("E · %s: die erste Ebene (Aufdruck) gegen die R1-Matrix", (id, rows, soll) => {
  it("die Zeilen des Modells sind Zeichen für Zeichen die der Matrix", () => {
    expect(layoutById(id).rows.map((r) => [...r.keys])).toEqual(rows);
  });

  it("★ jede Kappe trägt, was die tschechische Kappe trägt: Buchstaben GROSS ausser den elf, Zahlenreihe zweistufig", () => {
    const { reihen, layout } = zeichne(id);
    expect(kappen(reihen, layout)).toEqual(soll);
  });

  it("★ die elf Buchstaben ě š č ř ž ý á í é ú ů stehen KLEIN auf den Kappen - Umschalt gibt dort nie den Grossbuchstaben (Falle 15)", () => {
    const { reihen, layout } = zeichne(id);
    const alle = kappen(reihen, layout).flat().join("");
    for (const z of [..."ěščřžýáíéúů"]) {
      expect(alle, z).toContain(z);
      expect(alle, z.toUpperCase()).not.toContain(z.toUpperCase());
    }
    // und kein Grossbuchstabe Ě Š Č Ř Ž Ý Á Í É Ú Ů, auch nicht in der Zahlenreihe
    expect(alle).not.toMatch(/[ĚŠČŘŽÝÁÍÉÚŮ]/);
  });

  it("★ ZWEISTUFIG ist genau die Zahlenreihe: die Tasten 1 bis 0 (zehn Kappen) - oben klein die Ziffer, unten das Zeichen", () => {
    const { container, reihen, layout } = zeichne(id);
    const zwei = [...container.querySelectorAll('[data-zweistufig="an"]')];
    expect(zwei).toHaveLength(10);
    // die zehn Kappen stehen in der Zahlenreihe, in der Reihenfolge der Ziffern 1 bis 9, 0
    const reihe0 = kappen(reihen, layout)[0];
    expect(reihe0.slice(1, 11)).toEqual(["1+", "2ě", "3š", "4č", "5ř", "6ž", "7ý", "8á", "9í", "0é"]);
    // die Ziffer steht OBEN (erstes Kind), das Zeichen UNTEN (zweites)
    for (const z of zwei) {
      const [oben, unten] = [...z.children].map((c) => c.textContent ?? "");
      expect(oben).toMatch(/^\d$/);
      expect(unten).not.toMatch(/^\d$/);
    }
    // die übrigen Reihen sind einstufig
    for (const r of [1, 2, 3]) expect(reihen[r].querySelector('[data-zweistufig="an"]')).toBeNull();
  });

  it("★ GENAU eine Kappe je Buchstabe y und z, und die Kappe ú und ů je einmal", () => {
    const { reihen, layout } = zeichne(id);
    const alle = kappen(reihen, layout).flat();
    for (const z of ["Y", "Z", "ú", "ů"]) expect(alle.filter((k) => k === z), z).toHaveLength(1);
  });

  it("★ die Totaste (letzte Taste der Zahlenreihe) trägt `´`, die Trema-Totaste am Ende der Grundreihe `¨`", () => {
    const { reihen, layout } = zeichne(id);
    const k = kappen(reihen, layout);
    expect(k[0].at(-1)).toBe("´");
    expect(k[2].at(-1)).toBe("¨");
  });

  it("★ die Tastmarken (Tasthöcker) liegen auf f und j", () => {
    const { reihen, layout } = zeichne(id);
    expect(tastmarken(reihen, layout)).toEqual(["F", "J"]);
  });

  it("★ die Leertastenreihe: Windows „Ctrl · Alt · Leertaste · Alt Gr · Ctrl\", am Mac „Ctrl · Option · … · Option · Ctrl\"", () => {
    const lesen = () => {
      const { reihen } = zeichne(id);
      const unten = reihen[reihen.length - 1];
      return [...unten.children].map((k) => k.textContent ?? "");
    };
    setzeLayoutPlattform("windows");
    expect(lesen()).toEqual(["Ctrl", "Alt", "Leertaste", "Alt Gr", "Ctrl"]);
    cleanup();
    setzeLayoutPlattform("mac");
    expect(lesen()).toEqual(["Ctrl", "Option", "Leertaste", "Option", "Ctrl"]);
  });

  it("der Ziffernblock trägt ein Dezimalkomma (Tschechien schreibt 2,18 km - R1 §1.4)", () => {
    useGrosseTastatur.setState({ aktiv: true });
    const { container } = zeichne(id);
    expect(container.querySelector('[data-ziffernblock="an"]')!.textContent).toContain(",");
  });
});

// ── Die zweite Ebene: die Hervorhebung beim Üben - R1 §2.1, §4, §7 ───────────────────────────────────────────

/**
 * Zeichen ⇒ was leuchten soll: die Kappe, die AltGr-Taste (Windows „Alt Gr", Mac „Option") und die Umschalttaste der GEGENHAND
 * (die Hand, die NICHT die Taste greift). Finger aus der Spaltenregel: Zahlenreihe 1 = linker kleiner, 2 Ring, 3 Mittel, 4 und 5
 * Zeigefinger links, 6 und 7 Zeigefinger rechts, 8 Mittel, 9 Ring, 0, `=`, `´` rechter kleiner.
 */
type Erwartung = { kappe: string; altgr?: true; umschalt?: "links" | "rechts" };

/** Für BEIDE Tastaturen gleich. */
const GEMEINSAM: Record<string, Erwartung> = {
  // die ZIFFERN: die Taste der Zahlenreihe MIT Umschalt (R1 §2.1)
  "1": { kappe: "1+", umschalt: "rechts" }, // linker kleiner Finger
  "2": { kappe: "2ě", umschalt: "rechts" }, // linker Ringfinger
  "3": { kappe: "3š", umschalt: "rechts" },
  "5": { kappe: "5ř", umschalt: "rechts" },
  "6": { kappe: "6ž", umschalt: "links" }, // rechter Zeigefinger
  "8": { kappe: "8á", umschalt: "links" },
  "0": { kappe: "0é", umschalt: "links" }, // rechter kleiner Finger
  // die Buchstaben der Zahlenreihe: dieselbe Kappe, OHNE Umschalt
  "ě": { kappe: "2ě" },
  "š": { kappe: "3š" },
  "č": { kappe: "4č" },
  "ř": { kappe: "5ř" },
  "ž": { kappe: "6ž" },
  "ý": { kappe: "7ý" },
  "á": { kappe: "8á" },
  "í": { kappe: "9í" },
  "é": { kappe: "0é" },
  "+": { kappe: "1+" },
  // ú und ů: eigene Tasten
  "ú": { kappe: "ú" },
  "ů": { kappe: "ů" },
  // Umschalt-Zeichen: die Taste des Grundzeichens, Umschalt der Gegenhand
  "?": { kappe: ",", umschalt: "links" },
  "!": { kappe: "§", umschalt: "links" },
  ":": { kappe: ".", umschalt: "links" },
  "_": { kappe: "-", umschalt: "links" },
  "\"": { kappe: "ů", umschalt: "links" }, // Umschalt + ů (Windows und Mac gleich)
  "'": { kappe: "¨", umschalt: "links" }, // Umschalt + die Trema-Taste (Windows)
  "(": { kappe: ")", umschalt: "links" },
  "/": { kappe: "ú", umschalt: "links" },
  "%": { kappe: "=", umschalt: "links" },
  "|": { kappe: "\\", umschalt: "rechts" }, // die Taste links von Y/Z: linker kleiner Finger
  // direkte Zeichen
  ".": { kappe: "." },
  ",": { kappe: "," },
  "-": { kappe: "-" },
  "=": { kappe: "=" },
  ")": { kappe: ")" },
  "§": { kappe: "§" },
  ";": { kappe: ";" }, // Windows: direkt auf der Taste links der 1
  "\\": { kappe: "\\" },
  // AltGr
  "€": { kappe: "E", altgr: true },
  // Grossbuchstaben A-Z: Umschalt der Gegenhand
  "A": { kappe: "A", umschalt: "rechts" },
  "L": { kappe: "L", umschalt: "links" },
  // die TOTASTEN selbst
  "´": { kappe: "´" },
  "ˇ": { kappe: "´", umschalt: "links" }, // Háček: Umschalt (links) + letzte Taste der Zahlenreihe (rechter kleiner Finger)
  // ★ ZWEI-SCHRITT-ZEICHEN: leuchtet der erste Schritt, die Totaste
  "ď": { kappe: "´", umschalt: "links" },
  "ť": { kappe: "´", umschalt: "links" },
  "ň": { kappe: "´", umschalt: "links" },
  "ó": { kappe: "´" },
  "Č": { kappe: "´", umschalt: "links" }, // NICHT die Taste 4č mit Umschalt: das gäbe die Ziffer 4
  "Š": { kappe: "´", umschalt: "links" },
  "Ř": { kappe: "´", umschalt: "links" },
  "Ž": { kappe: "´", umschalt: "links" },
  "Ě": { kappe: "´", umschalt: "links" },
  "Ď": { kappe: "´", umschalt: "links" },
  "Á": { kappe: "´" }, // Čárka (ohne Umschalt), dann Umschalt + a
  "É": { kappe: "´" },
  "Í": { kappe: "´" },
  "Ú": { kappe: "´" }, // NICHT die Taste ú mit Umschalt: das gäbe `/`
  "Ý": { kappe: "´" },
  "Ó": { kappe: "´" },
};

const CS_ZWEITE_EBENE: Record<string, Erwartung> = {
  ...GEMEINSAM,
  "@": { kappe: "V", altgr: true }, // AltGr + v
  "#": { kappe: "X", altgr: true },
  "&": { kappe: "C", altgr: true },
  "Z": { kappe: "Z", umschalt: "links" }, // obere Reihe, rechter Zeigefinger
  "Y": { kappe: "Y", umschalt: "rechts" }, // untere Reihe, linker kleiner Finger
};
const CSQ_ZWEITE_EBENE: Record<string, Erwartung> = {
  ...GEMEINSAM,
  "@": { kappe: "2ě", altgr: true }, // AltGr + 2
  "#": { kappe: "3š", altgr: true },
  "&": { kappe: "7ý", altgr: true },
  "Y": { kappe: "Y", umschalt: "links" },
  "Z": { kappe: "Z", umschalt: "rechts" },
};

describe.each([
  ["cs", CS_ZWEITE_EBENE],
  ["cs-qwerty", CSQ_ZWEITE_EBENE],
] as const)("E · %s: die zweite Ebene - nächste Taste, Totaste, AltGr-Taste, Umschalt der Gegenhand", (id, tabelle) => {
  it.each(Object.entries(tabelle))("%s: leuchtet genau die erwartete Kappe, AltGr-Taste und Umschalttaste", (z, e) => {
    setzeLayoutPlattform("windows");
    const { container, reihen } = zeichne(id, z);
    const soll = [e.kappe, ...(e.altgr ? ["Alt Gr"] : []), ...(e.umschalt ? ["⇧"] : [])];
    expect(ziele(container).sort(), `${id}: ${z}`).toEqual(soll.sort());
    expect(umschaltLeuchtet(reihen), `${id}: ${z}`).toBe(e.umschalt ?? "keine");
  });

  it("★ jedes Zwei-Schritt-Zeichen leuchtet auf der TOTASTE - nie auf einer Taste, die mit Umschalt etwas anderes gibt", () => {
    for (const z of [..."ďťňó", ..."ČŠŘŽĚÁÉÍÚÝĎŤŇÓ"]) {
      const kombi = kombizeichenZu(z, layoutById(id));
      expect(kombi, `${id}: ${z}`).toBeDefined();
      setzeLayoutPlattform("windows");
      const { container } = zeichne(id, z);
      expect(ziele(container).filter((t) => t !== "⇧"), `${id}: ${z}`).toEqual(["´"]);
      cleanup();
    }
  });

  it("★ Mac: statt der Alt-Gr-Taste leuchtet die Option-Taste - und die Zeichen liegen auf den Tasten der Messung (@ Option + 2, € Option + r, ; Option + ů)", () => {
    const MAC: Record<string, string> = { "@": "2ě", "€": "R", ";": "ů", "#": "3š", "$": "4č" };
    for (const [z, kappe] of Object.entries(MAC)) {
      setzeLayoutPlattform("mac");
      const { container } = zeichne(id, z);
      expect(ziele(container).sort(), `${id}: ${z}`).toEqual([kappe, "Option"].sort());
      cleanup();
    }
  });

  it("Windows: `;` ist die Taste links der 1 direkt, `@` hat AltGr", () => {
    setzeLayoutPlattform("windows");
    const { container } = zeichne(id, ";");
    expect(ziele(container)).toEqual([";"]);
  });
});

// ── Gegenprobe: die anderen Tastaturen zeigen weiter, was sie zeigten ───────────────────────────────────

describe("Gegenprobe: de, us, fr, es, tr unverändert", () => {
  it("Tasthöcker: alle anderen tragen sie auf F und J (ausser türkisch F)", () => {
    for (const id of ["de", "us", "fr", "es", "pl", "tr-q"] as const) {
      const { reihen, layout } = zeichne(id);
      expect(tastmarken(reihen, layout), id).toEqual(["F", "J"]);
      cleanup();
    }
  });

  it("★ die zweistufige Zahlenreihe tragen genau fr, be, it-qzerty und die tschechischen - alle anderen einstufig", () => {
    const zweistufig = (id: LayoutId) => {
      const { container } = zeichne(id);
      const n = container.querySelectorAll('[data-zweistufig="an"]').length;
      cleanup();
      return n;
    };
    // Zahlen wie vor F3-cs: AZERTY 10 Kappen (alle Ziffern), die anderen keine
    for (const id of ["de", "ch", "us", "uk", "ch-fr", "ca-csa", "ca-fr", "es", "latam", "it", "pl", "tr-q", "tr-f"] as const) {
      expect(zweistufig(id), id).toBe(0);
    }
    for (const id of ["fr", "be", "it-qzerty", "cs", "cs-qwerty"] as const) expect(zweistufig(id), id).toBeGreaterThan(0);
  });

  it("★ fr: ein Zwei-Schritt-Zeichen (ê) lässt die Zeichnung wie vorher - keine Kappe leuchtet (das Verhalten der tschechischen gilt NUR für cs)", () => {
    setzeLayoutPlattform("windows");
    const { container } = zeichne("fr", "ê");
    expect(ziele(container).filter((t) => t !== "⇧")).toEqual([]);
  });

  it("de: ß bleibt „ß\" und die Kappen sind GROSS; kein Háček auf den Kappen", () => {
    const de = zeichne("de");
    expect(kappen(de.reihen, de.layout)[0][11]).toBe("ß");
    expect(de.container.textContent).not.toMatch(/[ěščřžˇ]/);
  });

  it("Ziffernblock: us und pl tragen einen Punkt, de und cs ein Komma (wie vorher bzw. R1 §1.4)", () => {
    useGrosseTastatur.setState({ aktiv: true });
    const block = (id: LayoutId) => {
      const { container } = zeichne(id);
      const t = container.querySelector('[data-ziffernblock="an"]')!.textContent ?? "";
      cleanup();
      return t;
    };
    expect(block("us")).toContain(".");
    expect(block("pl")).toContain(".");
    expect(block("de")).toContain(",");
    expect(block("cs")).toContain(",");
  });
});

// ── Die Eingabe: Totaste, Zahlenreihe, Grossbuchstaben ─────────────────────────────────────────────────────────

/** Ein Tastendruck, wie `handleKey` ihn erwartet. */
function taste(key: string): KeyboardEvent {
  return { key, preventDefault: () => {} } as unknown as KeyboardEvent;
}

/**
 * Tippt `getippt` in eine Zeile `expected`: ein Zwei-Schritt-Zeichen mit EINEM `Dead`-Ereignis davor (wie der Browser es meldet:
 * erst die Totaste, dann das fertige Zeichen im zweiten keydown).
 */
function tippe(expected: string, getippt: string, layoutId: LayoutId = "cs") {
  const onComplete = vi.fn();
  const onWrong = vi.fn();
  const { result } = renderHook(() =>
    useTypingItem({ expected, active: true, onComplete, onWrong, sprache: "cs" }),
  );
  for (const z of getippt) {
    if (kombizeichenZu(z, layoutById(layoutId))) act(() => result.current.handleKey(taste("Dead")));
    act(() => result.current.handleKey(taste(z)));
  }
  return { stand: result.current, onWrong };
}

describe.each([["cs"], ["cs-qwerty"]] as const)("B · %s: die Eingabe - Totaste und Zahlenreihe", (id) => {
  it("★ ď ť ň ó: Totaste (Dead), dann das fertige Zeichen ⇒ 0 Fehler, fertig", () => {
    setLayout(id);
    for (const z of ["ď", "ť", "ň", "ó"]) {
      const { stand } = tippe(z, z, id);
      expect(stand.errors, z).toBe(0);
      expect(stand.done, z).toBe(true);
    }
  });

  it("★ Grossformen über die Totaste: Č Š Ř Ž Ě Á É Í Ú Ý Ď Ť Ň Ó - Dead, dann das fertige Zeichen ⇒ 0 Fehler", () => {
    setLayout(id);
    for (const z of [..."ČŠŘŽĚÁÉÍÚÝĎŤŇÓ"]) {
      const { stand } = tippe(z, z, id);
      expect(stand.errors, z).toBe(0);
      expect(stand.done, z).toBe(true);
    }
  });

  it("★ ein Wort mit Totaste in der Mitte: „žluťoučký\" und „Čech\" - 0 Fehler", () => {
    setLayout(id);
    const a = tippe("žluťoučký", "žluťoučký", id);
    expect(a.stand.errors).toBe(0);
    expect(a.stand.done).toBe(true);
    const b = tippe("Čech", "Čech", id);
    expect(b.stand.errors).toBe(0);
    expect(b.stand.done).toBe(true);
  });

  it("★ die Zahlenreihe: der Buchstabe (ě) und die Ziffer (2, mit Umschalt: `key` = 2) sind getrennte Ziele - der falsche zählt als Fehler", () => {
    setLayout(id);
    expect(tippe("ě", "ě").stand.done).toBe(true);
    expect(tippe("2", "2").stand.done).toBe(true);
    expect(tippe("ě", "2").stand.errors).toBe(1); // Umschalt vergessen? nein: Ziffer statt Buchstabe
    expect(tippe("2", "ě").stand.errors).toBe(1);
  });

  it("★ Feststelltaste an: die Zahlenreihe gibt „Ě\" statt „ě\" - das ist ein Fehler (die App meldet „Feststelltaste an\"); ein erwartetes „Ě\" über Feststell wird angenommen", () => {
    setLayout(id);
    const falsch = tippe("ě", "Ě");
    expect(falsch.stand.errors).toBe(1);
    expect(falsch.stand.done).toBe(false);
    // „Ě\" erwartet, per Feststelltaste entstanden: der Browser meldet das Zeichen - jeder richtig entstandene Weg zählt
    const gross = renderHook(() =>
      useTypingItem({ expected: "Ě", active: true, onComplete: vi.fn(), onWrong: vi.fn(), sprache: "cs" }),
    );
    act(() => gross.result.current.handleKey(taste("Ě")));
    expect(gross.result.current.errors).toBe(0);
    expect(gross.result.current.done).toBe(true);
  });

  it("★ ein Háček + o (Mac: ô, ein slowakischer Buchstabe) an der Stelle von ó ist ein falsches Zeichen - kein Treffer", () => {
    setLayout(id);
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "ó", active: true, onComplete: vi.fn(), onWrong, sprache: "cs" }),
    );
    act(() => result.current.handleKey(taste("Dead")));
    act(() => result.current.handleKey(taste("ô")));
    expect(result.current.errors).toBe(1);
    expect(result.current.done).toBe(false);
    act(() => result.current.handleKey(taste("Dead")));
    act(() => result.current.handleKey(taste("ó")));
    expect(result.current.done).toBe(true);
  });
});
