/**
 * ★★★ G3a-SCHRIFT (25.10.2026, Leitfaden Falle 41): die Heimtasten eines Weges sind die Zeichen auf KeyF/KeyJ seiner
 * Haupttastatur - nicht die Buchstaben „f" und „j". Die Grundreihen der Wegwerf-Tastaturen unten stehen Zeichen für
 * Zeichen in der Windows-Tabelle (`pc-messung/DLL-TABELLEN-8-SPRACHEN.txt`: bg BG-BDS, el GR, uk UA-ENH).
 */
import { describe, expect, it } from "vitest";
import { HEIMZEICHEN_LATEIN, hauptTastaturDesWeges, heimZeichenDerTastatur, heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { LAYOUTS, type KeyboardLayout } from "../src/lib/typing/layouts";
import { LERNWEGE_LISTE } from "../src/lib/typing/lernweg";
import { adaptiveRound } from "../src/lib/typing/generator";
import { istGeruestSprache } from "../src/lib/typing/sprachRegister";

const US = LAYOUTS.find((l) => l.id === "us")!;
function mitGrundreihe(keys: string[]): KeyboardLayout {
  return { ...US, rows: [US.rows[0], US.rows[1], { ...US.rows[2], keys }, US.rows[3]] } as KeyboardLayout;
}

describe("Heimtasten einer Tastatur (KeyF, KeyJ)", () => {
  it.each([
    ["bg BDS", ["ь", "я", "а", "о", "ж", "г", "т", "н", "в", "м", "ч"], ["о", "т"]],
    ["el", ["α", "σ", "δ", "φ", "γ", "η", "ξ", "κ", "λ", "΄", "'"], ["φ", "ξ"]],
    ["uk", ["ф", "і", "в", "а", "п", "р", "о", "л", "д", "ж", "є"], ["а", "о"]],
  ] as const)("%s ⇒ %j", (_name, reihe, heim) => {
    expect(heimZeichenDerTastatur(mitGrundreihe([...reihe]))).toEqual(heim);
  });

  // ★ F4-KYR-GR (25.10.2026): seit G3b stehen die kyrillischen und griechischen Tastaturen in `LAYOUTS` - für sie gilt die
  // Tabelle unten (Windows-Tabelle; phonetisch liegen ф und й auf F und J), jede LATEINISCHE Tastatur hat weiter f j.
  const NICHT_FJ: Readonly<Record<string, readonly [string, string]>> = {
    "tr-f": ["a", "k"],
    bg: ["о", "т"],
    "bg-schreibm": ["о", "т"],
    "bg-phon": ["ф", "й"],
    "bg-phon-trad": ["ф", "й"],
    el: ["φ", "ξ"],
    "el-220": ["φ", "ξ"],
    "el-319": ["φ", "ξ"],
    ua: ["а", "о"],
    "ua-std": ["а", "о"],
  };
  it("jede lateinische Tastatur hat f j auf KeyF/KeyJ - ausser türkisch F (a k, kein Lernweg-Layout); kyrillisch/griechisch laut Tabelle", () => {
    for (const l of LAYOUTS) expect(heimZeichenDerTastatur(l), l.id).toEqual(NICHT_FJ[l.id] ?? ["f", "j"]);
  });

  it("★ F4-KYR-GR: die Wege bg, uk, el (eigene Reihenfolge, noch ohne Hauptsprache) nehmen die Heimtasten ihrer eigenen Tastatur", () => {
    expect(heimZeichenDesWeges("bg")).toEqual(["о", "т"]);
    expect(heimZeichenDesWeges("uk")).toEqual(["а", "о"]);
    expect(heimZeichenDesWeges("el")).toEqual(["φ", "ξ"]);
    expect(hauptTastaturDesWeges("bg")?.id).toBe("bg");
    expect(hauptTastaturDesWeges("uk")?.id).toBe("ua");
    expect(hauptTastaturDesWeges("el")?.id).toBe("el");
  });

  it("★ G4-NAHT: die Tastaturen der neun Wege - KeyF/KeyJ (G3a) sind die Zeigefinger-Tasten ihrer `heimtasten` (G3b)", () => {
    const neue = LAYOUTS.filter((x) => istGeruestSprache(x.sprache ?? "de"));
    expect(neue.length).toBe(18);
    for (const l of neue) {
      expect(l.heimtasten, l.id).toHaveLength(8);
      expect(heimZeichenDerTastatur(l), l.id).toEqual([l.heimtasten![3], l.heimtasten![4]]);
    }
    // gemessen (Befund G3a §2.4): bg о т, el φ ξ, uk а о
    expect(heimZeichenDerTastatur(LAYOUTS.find((l) => l.id === "bg")!)).toEqual(["о", "т"]);
    expect(heimZeichenDerTastatur(LAYOUTS.find((l) => l.id === "el")!)).toEqual(["φ", "ξ"]);
    expect(heimZeichenDerTastatur(LAYOUTS.find((l) => l.id === "ua")!)).toEqual(["а", "о"]);
  });
});

describe("Heimtasten eines Weges", () => {
  it("die acht Wege bis zum 25.10.2026: f j (aus ihrer Haupttastatur oder dem Rückfall)", () => {
    for (const w of LERNWEGE_LISTE.filter((x) => !istGeruestSprache(x))) {
      expect(heimZeichenDesWeges(w), w).toEqual(["f", "j"]);
    }
    expect(hauptTastaturDesWeges("fr")?.id).toBe("fr");
    expect(hauptTastaturDesWeges("de")).toBeNull();
  });
  it("die neun Wege, solange sie keine eigene Tastatur haben: der lateinische Rückfall", () => {
    for (const w of LERNWEGE_LISTE.filter(istGeruestSprache)) {
      if (hauptTastaturDesWeges(w) === null) expect(heimZeichenDesWeges(w), w).toEqual(HEIMZEICHEN_LATEIN);
    }
  });
});

describe("Generator: Rückfall ohne gelernte Buchstaben", () => {
  it("Weg de, nichts eingeführt: die Zeilen bestehen aus f und j (wie vorher)", () => {
    const runde = adaptiveRound({ introduced: [], lernweg: "de", count: 4, lang: "de" });
    const zeichen = new Set(runde.flatMap((l) => [...l.text.replace(/\s/g, "")]));
    expect([...zeichen].every((c) => c === "f" || c === "j")).toBe(true);
  });
});
