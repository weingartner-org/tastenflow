/**
 * ★★★ F3-tr (02.10.2026, Falle 15): DIE BILDSCHIRM-TASTATUR UND DIE EINGABE DER TÜRKISCHEN TASTATUREN.
 *
 * Falle 15 (Leitfaden): „Tastatur-Anzeige einer neuen Sprache immer mit echter Tastatur daneben vergleichen:
 * Klein/Gross, zweite Ebene". Die Soll-Werte unten sind aus der Recherche R1
 * (`recherche-tuerkisch-2026-10-02/tastaturen-und-zeichen.md` §2.1, §2.2, §2.3, §7) abgeschrieben - nicht aus dem
 * Modell abgeleitet. Türkische Tastaturen tragen auf den Kappen GROSSbuchstaben, auch İ und I.
 *
 * ZWEI Ebenen sind zu prüfen:
 *  · die ERSTE (was auf der Kappe steht): Buchstaben GROSS - `İ` auf der Taste mit dem i, `I` auf der mit dem ı -,
 *    Ziffernreihe einstufig, die Tastmarken auf den Zeigefinger-Tasten (Q: F und J, F: A und K);
 *  · die ZWEITE (AltGr / Umschalt): sie wird beim Üben als Hervorhebung gezeigt - die Taste des Grundzeichens, die
 *    AltGr-Taste (Mac: Option) und bei Umschalt-Zeichen die Umschalttaste der GEGENHAND.
 * Dazu die EINGABE der Probezeile „IŞIK İSTANBUL ıspanak" auf beiden Tastaturen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, renderHook } from "@testing-library/react";

import { Keyboard } from "../src/components/typing/Keyboard";
import { useTypingItem } from "../src/components/typing/useTypingItem";
import { fitText } from "../src/lib/typing/corpus";
import { FINGERS, fingerForChar, fingerGuide, type FingerId } from "../src/lib/typing/fingers";
import { useGrosseTastatur } from "../src/lib/typing/grosseTastatur";
import { kleinFuer } from "../src/lib/typing/sprachRegister";
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

// ── Die erste Ebene: R1 §7.1, §7.2 (rows) und die Kappen ──────────────────────────────────────────────────

/** R1 §7.1 `rows` von tr-q - wörtlich. */
const Q_ROWS: string[][] = [
  ["\"", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "-"],
  ["q", "w", "e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i", ","],
  ["<", "z", "x", "c", "v", "b", "n", "m", "ö", "ç", "."],
];
/** R1 §7.2 `rows` von tr-f - wörtlich. */
const F_ROWS: string[][] = [
  ["+", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "/", "-"],
  ["f", "g", "ğ", "ı", "o", "d", "r", "n", "h", "p", "q", "w"],
  ["u", "i", "e", "a", "ü", "t", "k", "m", "l", "y", "ş", "x"],
  ["<", "j", "ö", "v", "c", "ç", "z", "s", "b", ".", ","],
];

/** Was auf den Kappen steht: Buchstaben GROSS (türkisch: İ auf der i-Taste, I auf der ı-Taste), alles andere unverändert. */
const Q_KAPPEN: string[][] = [
  ["\"", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "-"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ", ","],
  ["<", "Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç", "."],
];
const F_KAPPEN: string[][] = [
  ["+", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "/", "-"],
  ["F", "G", "Ğ", "I", "O", "D", "R", "N", "H", "P", "Q", "W"],
  ["U", "İ", "E", "A", "Ü", "T", "K", "M", "L", "Y", "Ş", "X"],
  ["<", "J", "Ö", "V", "C", "Ç", "Z", "S", "B", ".", ","],
];

const TABELLE: ReadonlyArray<readonly [LayoutId, string[][], string[][], [string, string]]> = [
  ["tr-q", Q_ROWS, Q_KAPPEN, ["F", "J"]],
  ["tr-f", F_ROWS, F_KAPPEN, ["A", "K"]],
];

describe.each(TABELLE)("E · %s: die erste Ebene (Aufdruck) gegen die R1-Matrix", (id, rows, soll, hoecker) => {
  it("die Zeilen des Modells sind Zeichen für Zeichen die der Matrix", () => {
    expect(layoutById(id).rows.map((r) => [...r.keys])).toEqual(rows);
  });

  it("★ jede Kappe trägt, was die türkische Kappe trägt: Buchstaben GROSS, İ und I getrennt, Zeichen unverändert", () => {
    const { reihen, layout } = zeichne(id);
    expect(kappen(reihen, layout)).toEqual(soll);
  });

  it("★ GENAU eine Kappe „İ\" und GENAU eine Kappe „I\" - und kein „ı\" und kein „i\" in Kleinbuchstaben (Falle 15)", () => {
    const { reihen, layout } = zeichne(id);
    const alle = kappen(reihen, layout).flat();
    expect(alle.filter((k) => k === "İ")).toHaveLength(1);
    expect(alle.filter((k) => k === "I")).toHaveLength(1);
    expect(alle.filter((k) => k === "ı" || k === "i")).toHaveLength(0);
  });

  it("★ die Taste mit dem Punkt-i trägt „İ\", die mit dem punktlosen ı trägt „I\"", () => {
    const { reihen, layout } = zeichne(id);
    const k = kappen(reihen, layout);
    const stelle = (z: string) => {
      for (let r = 0; r < layout.rows.length; r++) {
        const j = layout.rows[r].keys.indexOf(z);
        if (j >= 0) return k[r][j];
      }
      return undefined;
    };
    expect(stelle("i")).toBe("İ");
    expect(stelle("ı")).toBe("I");
  });

  it("alle Sonderbuchstaben stehen auf Kappen: Ş Ğ Ç Ö Ü (jeder genau einmal)", () => {
    const { reihen, layout } = zeichne(id);
    const alle = kappen(reihen, layout).flat();
    for (const z of ["Ş", "Ğ", "Ç", "Ö", "Ü"]) expect(alle.filter((k) => k === z), z).toHaveLength(1);
  });

  it("die Ziffernreihe ist EINSTUFIG (Ziffern direkt, wie auf der Kappe der Türkei)", () => {
    const { container } = zeichne(id);
    expect(container.querySelector('[data-zweistufig="an"]')).toBeNull();
  });

  it("★ die Tastmarken (Tasthöcker) liegen auf den Zeigefinger-Tasten: Q auf F und J, F auf A und K", () => {
    const { reihen, layout } = zeichne(id);
    expect(tastmarken(reihen, layout)).toEqual(hoecker);
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

  it("der Ziffernblock trägt ein Dezimalkomma (die Türkei schreibt 15,2 - R1 §1.8)", () => {
    useGrosseTastatur.setState({ aktiv: true });
    const { container } = zeichne(id);
    expect(container.querySelector('[data-ziffernblock="an"]')!.textContent).toContain(",");
  });
});

// ── Die zweite Ebene: die Hervorhebung beim Üben - R1 §2.3 ────────────────────────────────────────────────

/**
 * Zeichen ⇒ was leuchten soll: die Kappe des Grundzeichens, die AltGr-Taste (Windows „Alt Gr", Mac „Option") und die
 * Umschalttaste der GEGENHAND (die Hand, die NICHT die Grundtaste greift). R1 §2.3, Finger aus §7.1/§7.2.
 */
type Erwartung = { kappe: string; altgr?: true; umschalt?: "links" | "rechts" };

const Q_ZWEITE_EBENE: Record<string, Erwartung> = {
  "₺": { kappe: "T", altgr: true },
  "€": { kappe: "E", altgr: true },
  "@": { kappe: "Q", altgr: true },
  "'": { kappe: "2", umschalt: "rechts" }, // linker Ringfinger ⇒ rechte Umschalttaste
  "\"": { kappe: "\"" }, // direkt links der 1 - KEIN Umschalt
  "İ": { kappe: "İ", umschalt: "links" }, // rechter kleiner Finger ⇒ linke Umschalttaste
  "I": { kappe: "I", umschalt: "links" }, // rechter Mittelfinger ⇒ linke Umschalttaste
  "ı": { kappe: "I" },
  "i": { kappe: "İ" },
  "Ş": { kappe: "Ş", umschalt: "links" },
  "Ğ": { kappe: "Ğ", umschalt: "links" },
  "Ç": { kappe: "Ç", umschalt: "links" },
  "Ö": { kappe: "Ö", umschalt: "links" },
  "Ü": { kappe: "Ü", umschalt: "links" },
  "A": { kappe: "A", umschalt: "rechts" },
  "?": { kappe: "*", umschalt: "links" }, // Umschalt + Taste „*" (rechter kleiner Finger)
  "!": { kappe: "1", umschalt: "rechts" },
  ":": { kappe: ".", umschalt: "links" },
  ";": { kappe: ",", umschalt: "links" },
  ".": { kappe: "." },
  ",": { kappe: "," },
};
const F_ZWEITE_EBENE: Record<string, Erwartung> = {
  "₺": { kappe: "T", altgr: true },
  "€": { kappe: "E", altgr: true },
  "@": { kappe: "F", altgr: true }, // die Taste mit dem Aufdruck F (links oben)
  "'": { kappe: "7", umschalt: "links" }, // rechter Zeigefinger ⇒ linke Umschalttaste
  "\"": { kappe: "2", umschalt: "rechts" }, // linker Ringfinger ⇒ rechte Umschalttaste
  "İ": { kappe: "İ", umschalt: "rechts" }, // linker Ringfinger ⇒ rechte Umschalttaste
  "I": { kappe: "I", umschalt: "rechts" }, // linker Zeigefinger ⇒ rechte Umschalttaste
  "ı": { kappe: "I" },
  "i": { kappe: "İ" },
  "Ş": { kappe: "Ş", umschalt: "links" },
  "Ğ": { kappe: "Ğ", umschalt: "rechts" },
  "Ç": { kappe: "Ç", umschalt: "rechts" },
  "Ö": { kappe: "Ö", umschalt: "rechts" },
  "Ü": { kappe: "Ü", umschalt: "rechts" },
  "A": { kappe: "A", umschalt: "rechts" },
  "?": { kappe: "/", umschalt: "links" }, // Umschalt + die Taste „/" (rechts neben der 0, rechter kleiner Finger)
  "!": { kappe: "1", umschalt: "rechts" },
  ":": { kappe: ".", umschalt: "links" },
  ";": { kappe: ",", umschalt: "links" },
  ".": { kappe: "." },
  ",": { kappe: "," },
};

describe.each([
  ["tr-q", Q_ZWEITE_EBENE],
  ["tr-f", F_ZWEITE_EBENE],
] as const)("E · %s: die zweite Ebene - nächste Taste, AltGr-Taste, Umschalt der Gegenhand", (id, tabelle) => {
  it.each(Object.entries(tabelle))("%s: leuchtet genau die erwartete Kappe, AltGr-Taste und Umschalttaste", (z, e) => {
    setzeLayoutPlattform("windows");
    const { container, reihen } = zeichne(id, z);
    const soll = [e.kappe, ...(e.altgr ? ["Alt Gr"] : []), ...(e.umschalt ? ["⇧"] : [])];
    expect(ziele(container).sort(), `${id}: ${z}`).toEqual(soll.sort());
    expect(umschaltLeuchtet(reihen), `${id}: ${z}`).toBe(e.umschalt ?? "keine");
  });

  it("am Mac leuchtet statt der Alt-Gr-Taste die Option-Taste (₺ € @)", () => {
    for (const z of ["₺", "€", "@"]) {
      setzeLayoutPlattform("mac");
      const { container } = zeichne(id, z);
      expect(ziele(container).sort(), `${id}: ${z}`).toEqual([tabelle[z].kappe, "Option"].sort());
      cleanup();
    }
  });
});

describe("E · tr-f am Mac: â î û = Option + a / i / u (Kappe A, İ, U), Grosse mit Umschalt der Gegenhand", () => {
  it.each([["â", "A"], ["î", "İ"], ["û", "U"]])("%s: Kappe %s und die Option-Taste", (z, kappe) => {
    setzeLayoutPlattform("mac");
    const { container } = zeichne("tr-f", z);
    expect(ziele(container).sort()).toEqual([kappe, "Option"].sort());
  });

  it.each([["Â", "A", "rechts"], ["Î", "İ", "rechts"], ["Û", "U", "rechts"]])(
    "%s: Kappe %s, Option-Taste UND die Umschalttaste der Gegenhand",
    (z, kappe, seite) => {
      setzeLayoutPlattform("mac");
      const { container, reihen } = zeichne("tr-f", z);
      expect(ziele(container).sort()).toEqual([kappe, "Option", "⇧"].sort());
      expect(umschaltLeuchtet(reihen)).toBe(seite);
    },
  );

  it("unter Windows ist es die Totaste: keine Taste leuchtet für das Zeichen selbst (die Totasten-Ansage steht an anderer Stelle)", () => {
    setzeLayoutPlattform("windows");
    const { container } = zeichne("tr-f", "â");
    expect(ziele(container)).toEqual([]);
  });
});

// ── Gegenprobe: die anderen Tastaturen zeigen weiter, was sie zeigten ───────────────────────────────────

describe("Gegenprobe: de, us, fr, pl unverändert", () => {
  it("Tasthöcker: de und us tragen sie auf F und J, fr (AZERTY) ebenfalls", () => {
    for (const id of ["de", "us", "fr", "es", "pl"] as const) {
      const { reihen, layout } = zeichne(id);
      expect(tastmarken(reihen, layout), id).toEqual(["F", "J"]);
      cleanup();
    }
  });

  it("de: ß bleibt „ß\" und kein ı/İ auf den Kappen; us: i bleibt „I\"", () => {
    const de = zeichne("de");
    expect(kappen(de.reihen, de.layout)[0][11]).toBe("ß");
    cleanup();
    const us = zeichne("us");
    expect(kappen(us.reihen, us.layout)[1][7]).toBe("I");
    expect(us.container.textContent).not.toMatch(/[İı]/);
  });

  it("Ziffernblock: us und pl tragen einen Punkt, de ein Komma (wie vorher)", () => {
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
  });
});

// ── Die Eingabe: die Probezeile auf BEIDEN Tastaturen ───────────────────────────────────────────────────────

const ZEILE = "IŞIK İSTANBUL ıspanak";

/** Ein Tastendruck, wie `handleKey` ihn erwartet. */
function taste(key: string): KeyboardEvent {
  return { key, preventDefault: () => {} } as unknown as KeyboardEvent;
}

function tippe(expected: string, getippt: string) {
  const onComplete = vi.fn();
  const { result } = renderHook(() =>
    useTypingItem({ expected, active: true, onComplete, acceptLowerForUpper: true, sprache: "tr" }),
  );
  for (const z of getippt) act(() => result.current.handleKey(taste(z)));
  return result.current;
}

describe.each([["tr-q"], ["tr-f"]] as const)("B · %s: die Probezeile „IŞIK İSTANBUL ıspanak\" - Eingabe, Kappe, Fingerhinweis", (id) => {
  it("★ Eingabe: mit den Kleinbuchstaben ı ş ı k … (Auto-Grossschreibung) - 0 Fehler, fertig", () => {
    setLayout(id);
    const stand = tippe(ZEILE, "ışık istanbul ıspanak");
    expect(stand.errors).toBe(0);
    expect(stand.done).toBe(true);
  });

  it("★ Eingabe: für „I\" gilt „ı\" - das gepunktete „i\" ist ein Fehler; für „İ\" gilt „i\" - das „ı\" ist ein Fehler", () => {
    setLayout(id);
    expect(tippe("I", "i").errors).toBe(1);
    expect(tippe("I", "ı").done).toBe(true);
    expect(tippe("İ", "ı").errors).toBe(1);
    expect(tippe("İ", "i").done).toBe(true);
  });

  it("★ fitText: die Zeile passt mit den Einheiten der Zeile - fehlt ı oder i, passt sie NICHT", () => {
    setLayout(id);
    const einheiten = new Set([..."ışk istanbul ıspanak"].filter((c) => c !== " "));
    expect(fitText(ZEILE, einheiten, "tr")).toBe(ZEILE);
    expect(fitText(ZEILE, new Set([...einheiten].filter((e) => e !== "ı")), "tr")).toBeNull();
    expect(fitText(ZEILE, new Set([...einheiten].filter((e) => e !== "i")), "tr")).toBeNull();
  });

  it("★ Tastenkappe: jedes Zeichen der Zeile hebt genau seine Kappe hervor (I ⇒ Kappe I, İ ⇒ Kappe İ, ı ⇒ I, i ⇒ İ)", () => {
    const erwartet: Record<string, string> = { I: "I", "İ": "İ", ı: "I", i: "İ", "Ş": "Ş", ş: "Ş", K: "K", k: "K", S: "S", T: "T", A: "A", N: "N", B: "B", U: "U", L: "L", P: "P" };
    for (const [z, kappe] of Object.entries(erwartet)) {
      const { container } = zeichne(id, z);
      const leuchtet = ziele(container).filter((t) => t !== "⇧");
      expect(leuchtet, `${id}: ${z}`).toEqual([kappe]);
      cleanup();
    }
  });

  it("★ Fingerhinweis: jedes Zeichen der Zeile nennt den Finger, der dort liegt (R1 §7.1, §7.2)", () => {
    const Q: Record<string, FingerId> = {
      ı: "mittel-rechts", ş: "kleiner-rechts", k: "mittel-rechts", i: "kleiner-rechts", s: "ring-links",
      t: "zeige-links", a: "kleiner-links", n: "zeige-rechts", b: "zeige-links", u: "zeige-rechts", l: "ring-rechts",
      p: "kleiner-rechts",
    };
    const F: Record<string, FingerId> = {
      ı: "zeige-links", ş: "kleiner-rechts", k: "zeige-rechts", i: "ring-links", s: "zeige-rechts",
      t: "zeige-rechts", a: "zeige-links", n: "mittel-rechts", b: "mittel-rechts", u: "kleiner-links", l: "ring-rechts",
      p: "kleiner-rechts",
    };
    const soll = id === "tr-q" ? Q : F;
    setLayout(id);
    for (const z of new Set([...ZEILE].filter((c) => c !== " "))) {
      const klein = kleinFuer(z, "tr");
      const erwartet = soll[klein];
      expect(erwartet, `${id}: ${z} hat keine Soll-Angabe`).toBeDefined();
      expect(fingerForChar(z)!.id, `${id}: ${z}`).toBe(erwartet);
      expect(fingerGuide(z, false, "tr"), `${id}: ${z}`).toContain(FINGERS[erwartet].name);
    }
    // die Grossformen brauchen die Umschalttaste der Gegenhand
    expect(fingerGuide("İ", false, "tr")).toContain(id === "tr-q" ? "linke Umschalttaste" : "rechte Umschalttaste");
    expect(fingerGuide("I", false, "tr")).toContain(id === "tr-q" ? "linke Umschalttaste" : "rechte Umschalttaste");
  });
});
