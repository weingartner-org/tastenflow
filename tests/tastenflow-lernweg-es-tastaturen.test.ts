/**
 * ★★★ ES-F3/F4 (27.09.2026): DIE ZWEI SPANISCHEN TASTATUREN UND DIE ECHTE
 * REIHENFOLGE.
 *
 * Bauplan `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §3 (Tastaturen), §4
 * (Reihenfolge, §4.4 die harten Paare ¿?/¡!). Was hier geprüft wird:
 *
 *  1. F und J zuerst - auf BEIDEN Tastaturen (W4, Falle 41).
 *  2. Jede Einheit von `LERNWEGE.es.introOrder` kommt genau einmal vor.
 *  3. Jedes Zeichen des spanischen Inventars hat auf BEIDEN Pflicht-
 *     Tastaturen einen Griff (Taste, Umschalt/AltGr oder Totaste) - die
 *     "Kind-Simulation" aus `pruefstand/kind-simulation/m1-folge.mts",
 *     sinngemäss für "es" nachgebaut, aber als echter, automatisch
 *     laufender Wächter statt eines Wegwerf-Skripts.
 *  4. `ersatz` ist auf beiden Tastaturen leer (Bauplan §3, Falle 2/36).
 *  5. ¿/¡ liegen auf den zwei Tastaturen VERTAUSCHT (gemessen).
 *  6. Die harten Paare ¿?/¡! in `fitText` (§4.4) - inkl. der Gegenprobe aus
 *     dem Bauplan-Wortlaut selbst: "¿Qué hora es?" bei nur ¿ gelernt ⇒ nicht
 *     erlaubt.
 */
import { afterEach, describe, expect, it } from "vitest";
import { layoutById, setLayout, type KeyboardLayout } from "../src/lib/typing/layouts";
import { LERNWEGE, lernwegDef } from "../src/lib/typing/lernweg";
import { introOrder, layoutLetterOrder } from "../src/lib/typing/letters";
import { kombizeichenZu } from "../src/lib/typing/totasten";
import { fitText } from "../src/lib/typing/corpus";

afterEach(() => setLayout("de"));

const ES = layoutById("es");
const LATAM = layoutById("latam");

/**
 * Hat diese Tastatur einen Griff für `zeichen`? - dieselbe Prüfung wie die
 * `reach()`-Funktion in `pruefstand/kind-simulation/m1-folge.mts` (Taste ·
 * Umschalt/AltGr · Totaste), hier als echter Wächter statt eines Wegwerf-
 * Skripts.
 */
function hatGriff(layout: KeyboardLayout, zeichen: string): boolean {
  if (zeichen === "⇧") return true;
  const klein = zeichen.toLowerCase();
  if (layout.rows.some((r) => r.keys.includes(klein))) return true;
  if (layout.access[klein] !== undefined) return true;
  if (kombizeichenZu(zeichen, layout) !== undefined) return true;
  return false;
}

// ── 1 · F und J zuerst, auf BEIDEN Tastaturen ───────────────────────────────

describe("1 · F und J zuerst (W4, Falle 41)", () => {
  it("LERNWEGE.es.letterOrder beginnt mit f, j", () => {
    expect(LERNWEGE.es.letterOrder.slice(0, 2)).toEqual(["f", "j"]);
  });

  it("auf der spanischen Tastatur (ES) beginnt die Lernfolge mit f, j", () => {
    setLayout("es");
    expect(layoutLetterOrder("es").slice(0, 2)).toEqual(["f", "j"]);
  });

  it("auf der lateinamerikanischen Tastatur (LatAm) beginnt die Lernfolge mit f, j", () => {
    setLayout("latam");
    expect(layoutLetterOrder("es").slice(0, 2)).toEqual(["f", "j"]);
  });

  it("ñ ist die achte Grundtaste, auf beiden Tastaturen physisch gleich (keine Abbildung nötig)", () => {
    setLayout("es");
    expect(layoutLetterOrder("es")[7]).toBe("ñ");
    setLayout("latam");
    expect(layoutLetterOrder("es")[7]).toBe("ñ");
  });
});

// ── 2 · Jede Einheit genau einmal ────────────────────────────────────────────

describe("2 · jede Einheit von introOrder(\"es\") kommt genau einmal vor", () => {
  it("keine doppelte Einheit", () => {
    const o = introOrder("es");
    const doppelt = o.filter((u, i) => o.indexOf(u) !== i);
    expect(doppelt).toEqual([]);
  });

  it("Mayús steht NACH der Akzent-Totaste (Bauplan §4.3)", () => {
    const o = LERNWEGE.es.introOrder;
    expect(o.indexOf("⇧")).toBeGreaterThan(o.indexOf("´"));
  });
});

// ── 3 · Kein Zeichen ohne Griff (Kind-Simulation, sinngemäss) ───────────────

describe("3 · jedes Zeichen des spanischen Inventars hat auf BEIDEN Tastaturen einen Griff", () => {
  const BUCHSTABEN = "abcdefghijklmnopqrstuvwxyzñ".split("");
  const AKZENTE = "áéíóúü".split("");
  const GROSS = [...BUCHSTABEN, ...AKZENTE].map((c) => c.toUpperCase());
  const SATZZEICHEN = [".", ",", ";", ":", "¿", "?", "¡", "!", "\"", "-", "(", ")"];
  const ZIFFERN = "0123456789".split("");
  const INVENTAR = [...BUCHSTABEN, ...AKZENTE, ...GROSS, ...SATZZEICHEN, ...ZIFFERN];

  it.each(INVENTAR)("Spanien (ES): %s hat einen Griff", (z) => {
    expect(hatGriff(ES, z)).toBe(true);
  });

  it.each(INVENTAR)("Lateinamerika (LatAm): %s hat einen Griff", (z) => {
    expect(hatGriff(LATAM, z)).toBe(true);
  });

  it("keine Einheit von introOrder(\"es\") ist auf einer der beiden Pflicht-Tastaturen unerreichbar (ausser den bekannten `missing`-Lücken)", () => {
    // ★ P9 (Bauplan §3): „€" ist auf LatAm bewusst NICHT gemessen/bestätigt
    // und steht darum in `LATAM.missing` - das ist keine Lücke dieses
    // Wächters, sondern dieselbe, downstream (`onlyExistingKeys`) bereits
    // behandelte Ausnahme wie „£" bei US/UK (layouts.ts).
    const einheiten = lernwegDef("es").introOrder;
    for (const layout of [ES, LATAM]) {
      const missing = new Set(layout.missing.map((c) => c.toLowerCase()));
      const unerreichbar = einheiten.filter(
        (u) => !hatGriff(layout, u) && !missing.has(u.toLowerCase()),
      );
      expect(unerreichbar, `unerreichbar auf ${layout.id}`).toEqual([]);
    }
  });
});

// ── 4 · ersatz bleibt leer (Bauplan §3, Falle 2/36) ─────────────────────────

describe("4 · kein Ersatz auf den spanischen Tastaturen", () => {
  it("ES.ersatz und LATAM.ersatz sind leer", () => {
    expect(Object.keys(ES.ersatz)).toEqual([]);
    expect(Object.keys(LATAM.ersatz)).toEqual([]);
  });
});

// ── 5 · ¿/¡ liegen vertauscht (gemessen) ────────────────────────────────────

describe("5 · ¿/¡ liegen auf den zwei Tastaturen VERTAUSCHT (gemessen)", () => {
  it("Spanien: ¡ direkt (eigene Taste), ¿ mit Umschalt", () => {
    expect(ES.rows.some((r) => r.keys.includes("¡"))).toBe(true);
    expect(ES.access["¿"]).toEqual({ base: "¡", mod: "shift" });
  });

  it("Lateinamerika: ¿ direkt (eigene Taste), ¡ mit Umschalt - umgekehrt", () => {
    expect(LATAM.rows.some((r) => r.keys.includes("¿"))).toBe(true);
    expect(LATAM.access["¡"]).toEqual({ base: "¿", mod: "shift" });
  });
});

// ── 6 · Harte Paare ¿?/¡! in fitText (Bauplan §4.4) ─────────────────────────

describe("6 · ¿?/¡! sind ein hartes Paar in fitText - nie halb ausgeliefert", () => {
  // dieselbe Zeile wie im Bauplan-Wortlaut (§4.4 Punkt 2).
  const ZEILE = "¿Qué hora es?";
  const BUCHSTABEN_DER_ZEILE = new Set(["q", "u", "é", "h", "o", "r", "a", "e", "s", " "]);

  it("nur ¿ gelernt (kein ?) ⇒ die Zeile passt NICHT", () => {
    const allowed = new Set([...BUCHSTABEN_DER_ZEILE, "¿"]);
    expect(fitText(ZEILE, allowed)).toBeNull();
  });

  it("nur ? gelernt (kein ¿) ⇒ die Zeile passt NICHT", () => {
    const allowed = new Set([...BUCHSTABEN_DER_ZEILE, "?"]);
    expect(fitText(ZEILE, allowed)).toBeNull();
  });

  it("¿ UND ? gelernt ⇒ die Zeile passt, unverändert", () => {
    const allowed = new Set([...BUCHSTABEN_DER_ZEILE, "¿", "?"]);
    expect(fitText(ZEILE, allowed)).toBe(ZEILE);
  });

  it("dasselbe gilt für ¡/! (eigene Zeile, ohne Fragezeichen-Buchstaben)", () => {
    const zeile = "¡Vamos ya!";
    const buchstaben = new Set(["v", "a", "m", "o", "s", "y", " "]);
    expect(fitText(zeile, new Set([...buchstaben, "¡"]))).toBeNull();
    expect(fitText(zeile, new Set([...buchstaben, "!"]))).toBeNull();
    expect(fitText(zeile, new Set([...buchstaben, "¡", "!"]))).toBe(zeile);
  });

  it("de/en/fr: ein gewöhnliches ? oder ! ohne ¿/¡ bleibt normales, weglassbares Satzzeichen", () => {
    // Regressions-Gegenprobe zur ersten (zu strengen) Fassung dieser Sperre -
    // siehe Commit „ES-F4: harte Paare ¿?/¡! in fitText": eine erste Fassung
    // prüfte auch am SCHLIESSENDEN Zeichen und sperrte damit jede gewöhnliche
    // deutsche/englische/französische Frage- oder Ausrufezeile.
    const buchstaben = new Set(["w", "i", "e", "g", "h", "t", "s", "d", "r", " "]);
    expect(fitText("Wie geht es dir?", buchstaben)).toBe("Wie geht es dir");
  });
});
