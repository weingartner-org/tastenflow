/**
 * ★★★ WÄCHTER O-INHALT-PT/BR/SV (29.10.2026): die Rate-Wörter der Polarstation auf den Wegen „pt", „br", „sv" (Vorbild
 * `tests/tastenflow-expedition-cs.test.ts`). Bis hierher zogen die drei Wege den ENGLISCHEN Vorrat mit englischer Stimme.
 * Geprüft wird die Liste selbst (Form, Hausregeln, Sperrliste, Herkunft aus dem Übungswortschatz des Weges) und der Weg, auf dem
 * die Station sie zieht (`stationGuessWords`), an JEDER Sprosse der Reihenfolge auf der Tastatur des Weges.
 */
import { afterEach, describe, expect, it } from "vitest";
import { WORDS_EN, rateWortSprache, stationGuessWords } from "@/lib/typing/expedition/words";
import { WORDS_PT_EXPEDITION } from "@/lib/typing/expedition/wordsPt";
import { WORDS_BR_EXPEDITION } from "@/lib/typing/expedition/wordsBr";
import { WORDS_SV_EXPEDITION } from "@/lib/typing/expedition/wordsSv";
import { WORDS_PT, STUFE_VOCAB_PT } from "@/lib/typing/wordsPt";
import { WORDS_BR, STUFE_VOCAB_BR } from "@/lib/typing/wordsBr";
import { WORDS_SV, STUFE_VOCAB_SV } from "@/lib/typing/wordsSv";
import { gesperrtPt } from "@/lib/typing/sperrlistePt";
import { gesperrtBr } from "@/lib/typing/sperrlisteBr";
import { gesperrtSv } from "@/lib/typing/sperrlisteSv";
import { lernwegDef, type Lernweg } from "@/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";

afterEach(() => setLayout("de"));

interface Weg {
  weg: Lernweg;
  liste: readonly string[];
  basis: ReadonlySet<string>;
  gesperrt: (w: string) => boolean;
  tastatur: LayoutId;
  rate: RegExp;
  form: RegExp;
  heikel: readonly string[];
  /** Sprossen, die weniger als drei eigene Wörter haben dürfen - mit Grund. */
  duenn: readonly string[];
}

const PT_HEIKEL = ["vaca", "burro", "porco", "macaco", "galinha", "cabra", "besta", "arma", "morte", "morto", "matar", "sangue",
  "vinho", "cerveja", "deus", "igreja", "guerra", "bruxa", "cobra"];
const SV_HEIKEL = ["gris", "ko", "höna", "åsna", "apa", "kossa", "svin", "vapen", "död", "döda", "blod", "krig", "öl", "vin", "gud",
  "kyrka", "häxa", "yxa", "kniv"];

const WEGE: readonly Weg[] = [
  {
    weg: "pt", liste: WORDS_PT_EXPEDITION, basis: new Set([...WORDS_PT, ...Object.values(STUFE_VOCAB_PT).flat()].map((w) => w.toLowerCase())),
    gesperrt: gesperrtPt, tastatur: "pt", rate: /^[a-zç]$/, form: /^[a-zç]{2,6}$/, heikel: PT_HEIKEL, duenn: [],
  },
  {
    weg: "br", liste: WORDS_BR_EXPEDITION, basis: new Set([...WORDS_BR, ...Object.values(STUFE_VOCAB_BR).flat()].map((w) => w.toLowerCase())),
    gesperrt: gesperrtBr, tastatur: "br-abnt2", rate: /^[a-zç]$/, form: /^[a-zç]{2,6}$/, heikel: PT_HEIKEL, duenn: [],
  },
  {
    weg: "sv", liste: WORDS_SV_EXPEDITION, basis: new Set([...WORDS_SV, ...Object.values(STUFE_VOCAB_SV).flat()].map((w) => w.toLowerCase())),
    gesperrt: gesperrtSv, tastatur: "sv", rate: /^[a-zåäö]$/, form: /^[a-zåäö]{2,6}$/, heikel: SV_HEIKEL,
    // `q`: einziges Wort mit q im schwedischen Übungswortschatz ist „quiz".
    duenn: ["q: 1"],
  },
];

describe.each(WEGE)("Rate-Wörter Weg $weg: Form und Hausregeln", ({ weg, liste, basis, gesperrt, form, heikel }) => {
  it("mindestens 200 Wörter, jedes nur einmal, keine zwei aus denselben Buchstaben", () => {
    expect(liste.length).toBeGreaterThanOrEqual(200);
    expect(liste.filter((w, i) => liste.indexOf(w) !== i)).toEqual([]);
    const schluessel = new Map<string, string>();
    const doppelt: string[] = [];
    for (const w of liste) {
      const k = [...w].sort().join("");
      if (schluessel.has(k)) doppelt.push(`${schluessel.get(k)}/${w}`);
      schluessel.set(k, w);
    }
    expect(doppelt).toEqual([]);
  });

  it("klein, 2 bis 6 Zeichen, nur Rate-Buchstaben (keine Totasten-Buchstaben, kein Grossbuchstabe, kein Strich)", () => {
    expect(liste.filter((w) => !form.test(w))).toEqual([]);
  });

  it("keine Sperrwörter, kein Tier als Schimpfwort, nichts über Tod, Waffen, Rausch, Glaube", () => {
    expect(liste.filter((w) => gesperrt(w))).toEqual([]);
    expect(liste.filter((w) => heikel.includes(w))).toEqual([]);
  });

  it("jedes Wort steht im Übungswortschatz des Weges (das Vorlese-Lexikon kennt den Weg noch nicht)", () => {
    expect(liste.filter((w) => !basis.has(w))).toEqual([]);
  });

  it("Gegenprobe: Form und Herkunft fallen auf", () => {
    expect(["Casa", "pão", "ice-cream", "abcdefg"].filter((w) => !form.test(w))).toEqual(["Casa", "pão", "ice-cream", "abcdefg"]);
    expect(basis.has("zzqx")).toBe(false);
  });

  it("nicht der englische Vorrat, und die Stimme ist die des Weges", () => {
    expect(liste).not.toBe(WORDS_EN);
    expect(rateWortSprache(weg)).toBe(weg);
  });
});

describe.each(WEGE)("stationGuessWords auf Weg $weg - an jeder Sprosse", ({ weg, liste, tastatur, rate, duenn }) => {
  const eigen = new Set(liste);

  it("ab „e\" drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar", () => {
    setLayout(tastatur);
    const reihenfolge = introOrder(weg);
    const fehler: string[] = [];
    for (let n = reihenfolge.indexOf("e") + 1; n <= reihenfolge.length; n++) {
      const stand = reihenfolge.slice(0, n);
      const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
      for (const seed of [0, 5, 17]) {
        const woerter = stationGuessWords(stand, { lernweg: weg, seed });
        if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
        for (const w of woerter) {
          if (!eigen.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
          if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
        }
      }
    }
    expect(fehler).toEqual([]);
  });

  it("jede Sprosse mit neuem Rate-Buchstaben bringt mindestens drei eigene Wörter (benannte Ausnahmen)", () => {
    const buchstaben = lernwegDef(weg).introOrder.filter((u) => rate.test(u));
    const wenig: string[] = [];
    for (let i = buchstaben.indexOf("e"); i < buchstaben.length; i++) {
      const vorher = new Set(buchstaben.slice(0, i));
      const neu = buchstaben[i];
      const anzahl = liste.filter((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c))).length;
      if (anzahl < 3) wenig.push(`${neu}: ${anzahl}`);
    }
    expect(wenig).toEqual(duenn);
  });

  it("nichts wird grossgeschrieben", () => {
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...lernwegDef(weg).introOrder], { lernweg: weg, seed, shiftLearned: true })) expect(w).toBe(w.toLowerCase());
  });
});
