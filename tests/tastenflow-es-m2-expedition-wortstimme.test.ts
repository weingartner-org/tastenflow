/**
 * ★★★★ WÄCHTER (ES-M2, 27.09.2026, Fund des Text-Prüfers): DAS GELÖSTE WORT
 * DER POLARSTATION SPRICHT DIE STIMME SEINER SPRACHE.
 *
 * Befund: `stationWordLang` (useExpedition.ts) stand auf
 * `lernweg === "de" ? "de" : "en"` - aus der Zeit, als Weg „fr" noch den
 * englischen Vorrat hatte. Seit E10b-2 (fr) und ES-S (es) hat jeder Weg
 * eigene Rate-Wörter; die englische Stimme las „pingüino" und « château ».
 *
 * Geprüft über die FEHLERKLASSE „Vorrat und Stimme laufen auseinander": Für
 * JEDEN Weg ist die Stimme die Sprache, deren Lexikon die meisten Wörter des
 * Vorrats kennt - gemessen, nicht aus einer Tabelle abgelesen. Gegenprobe:
 * die alte Regel fällt für fr und es durch.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { stationWordLang } from "../src/components/typing/expedition/useExpedition";
import {
  WORDS_EN,
  WORDS_CS_EXPEDITION,
  WORDS_ES_EXPEDITION,
  WORDS_FR_EXPEDITION,
  WORDS_IT_EXPEDITION,
  WORDS_PL_EXPEDITION,
  WORDS_TR_EXPEDITION,
  rateWortSprache,
} from "../src/lib/typing/expedition/words";
import { WORDS } from "../src/lib/typing/words";
import { isRealWord } from "../src/lib/typing/lexicon";
import { LERNWEGE_LISTE, type Lernweg } from "../src/lib/typing/lernweg";
import type { Lang } from "../src/lib/typing/account";
import { GERUEST_SPRACHEN, type GeruestSprache } from "../src/lib/typing/sprachRegister";
import { WORDS_BG_EXPEDITION } from "../src/lib/typing/expedition/wordsBg";
import { WORDS_EL_EXPEDITION } from "../src/lib/typing/expedition/wordsEl";
import { WORDS_HU_EXPEDITION } from "../src/lib/typing/expedition/wordsHu";
import { WORDS_NL_EXPEDITION } from "../src/lib/typing/expedition/wordsNl";
import { WORDS_PT_EXPEDITION } from "../src/lib/typing/expedition/wordsPt";
import { WORDS_BR_EXPEDITION } from "../src/lib/typing/expedition/wordsBr";
import { WORDS_RO_EXPEDITION } from "../src/lib/typing/expedition/wordsRo";
import { WORDS_SV_EXPEDITION } from "../src/lib/typing/expedition/wordsSv";
import { WORDS_UK_EXPEDITION } from "../src/lib/typing/expedition/wordsUk";
import { WORDS_BG, STUFE_VOCAB_BG } from "../src/lib/typing/wordsBg";
import { WORDS_EL, STUFE_VOCAB_EL } from "../src/lib/typing/wordsEl";
import { WORDS_HU, STUFE_VOCAB_HU } from "../src/lib/typing/wordsHu";
import { WORDS_NL, STUFE_VOCAB_NL } from "../src/lib/typing/wordsNl";
import { WORDS_PT, STUFE_VOCAB_PT } from "../src/lib/typing/wordsPt";
import { WORDS_BR, STUFE_VOCAB_BR } from "../src/lib/typing/wordsBr";
import { WORDS_RO, STUFE_VOCAB_RO } from "../src/lib/typing/wordsRo";
import { WORDS_SV, STUFE_VOCAB_SV } from "../src/lib/typing/wordsSv";
import { WORDS_UK, STUFE_VOCAB_UK } from "../src/lib/typing/wordsUk";

/** ★ O-INHALT (29.10.2026): der eigene Rate-Vorrat je Gerüst-Weg (leer = noch keiner ⇒ Englisch). */
const EXPEDITION_GERUEST: Readonly<Record<GeruestSprache, readonly string[]>> = {
  bg: WORDS_BG_EXPEDITION, el: WORDS_EL_EXPEDITION, hu: WORDS_HU_EXPEDITION, nl: WORDS_NL_EXPEDITION, pt: WORDS_PT_EXPEDITION,
  br: WORDS_BR_EXPEDITION, ro: WORDS_RO_EXPEDITION, sv: WORDS_SV_EXPEDITION, uk: WORDS_UK_EXPEDITION,
};
const eigenOderEn = (w: readonly string[]): readonly string[] => (w.length > 0 ? w : WORDS_EN);

/**
 * ★ O-INHALT (29.10.2026): das Vorlese-Lexikon kennt die neun Gerüst-Sprachen noch nicht (F8) - für sie misst der Wächter am
 * Übungswortschatz des Weges (`WORDS_<XX>` + `STUFE_VOCAB_<XX>`), wie viele Rate-Wörter der Sprache gehören. Gemessen bleibt es.
 */
const WORTSCHATZ_GERUEST: Readonly<Record<GeruestSprache, ReadonlySet<string>>> = Object.fromEntries(
  (
    [
      ["bg", WORDS_BG, STUFE_VOCAB_BG], ["el", WORDS_EL, STUFE_VOCAB_EL], ["hu", WORDS_HU, STUFE_VOCAB_HU],
      ["nl", WORDS_NL, STUFE_VOCAB_NL], ["pt", WORDS_PT, STUFE_VOCAB_PT], ["br", WORDS_BR, STUFE_VOCAB_BR],
      ["ro", WORDS_RO, STUFE_VOCAB_RO], ["sv", WORDS_SV, STUFE_VOCAB_SV], ["uk", WORDS_UK, STUFE_VOCAB_UK],
    ] as const
  ).map(([s, w, v]) => [s, new Set([...w, ...Object.values(v).flat()].map((x) => x.toLowerCase()))]),
) as unknown as Record<GeruestSprache, ReadonlySet<string>>;

const VORRAT: Record<Lernweg, readonly string[]> = {
  de: WORDS,
  en: WORDS_EN,
  fr: WORDS_FR_EXPEDITION,
  es: WORDS_ES_EXPEDITION,
  // ★ IT-S (03.10.2026): „it" hat seinen eigenen Vorrat.
  it: WORDS_IT_EXPEDITION,
  // ★ PL-W (09.10.2026): „pl" hat seinen eigenen Vorrat.
  pl: WORDS_PL_EXPEDITION,
  // ★ TR-S (09.10.2026): „tr" hat seinen eigenen Vorrat.
  tr: WORDS_TR_EXPEDITION,
  // ★ CS-W (09.10.2026): „cs" hat seinen eigenen Vorrat.
  cs: WORDS_CS_EXPEDITION,
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  // ★ O-INHALT (29.10.2026): jede liest ihre eigene Datei `expedition/words<Xx>.ts` - leer ⇒ der englische Vorrat (wie der Verteiler).
  ...(Object.fromEntries(GERUEST_SPRACHEN.map((s) => [s, eigenOderEn(EXPEDITION_GERUEST[s])])) as Record<GeruestSprache, readonly string[]>),
};
// ★ IT-S (03.10.2026): „it" dazu - sonst könnte die Messung die italienische Stimme gar nicht finden.
// ★ PL-W / TR-S (09.10.2026): „pl" und „tr" dazu - aus demselben Grund.
const SPRACHEN: readonly Lang[] = ["de", "en", "fr", "es", "it", "pl", "tr", "cs"];

/** Die Sprache, deren Lexikon die meisten Wörter des Vorrats kennt. */
function gemesseneSprache(woerter: readonly string[]): { sprache: Lang; anteil: Record<Lang, number> } {
  const anteil = Object.fromEntries([
    ...SPRACHEN.map((l) => [l, woerter.filter((w) => isRealWord(w, l)).length / woerter.length]),
    // ★ O-INHALT: die Gerüst-Sprachen am Übungswortschatz (siehe WORTSCHATZ_GERUEST).
    ...GERUEST_SPRACHEN.map((l) => [l, woerter.filter((w) => WORTSCHATZ_GERUEST[l].has(w)).length / woerter.length]),
  ]) as Record<Lang, number>;
  const sprache = [...SPRACHEN, ...GERUEST_SPRACHEN].sort((a, b) => anteil[b] - anteil[a])[0];
  return { sprache, anteil };
}

describe("das gelöste Wort der Polarstation", () => {
  for (const weg of LERNWEGE_LISTE) {
    it(`Weg ${weg}: die Stimme ist die Sprache der Rate-Wörter (gemessen am Lexikon)`, () => {
      const { sprache, anteil } = gemesseneSprache(VORRAT[weg]);
      expect(stationWordLang(weg), JSON.stringify(anteil)).toBe(sprache);
      expect(rateWortSprache(weg)).toBe(sprache);
    });
  }

  it("GEGENPROBE: die alte Regel (de ⇒ de, sonst en) liegt auf fr, es, it, pl, tr und cs daneben", () => {
    const alt = (w: Lernweg) => (w === "de" ? "de" : "en");
    const daneben = LERNWEGE_LISTE.filter((w) => alt(w) !== gemesseneSprache(VORRAT[w]).sprache);
    // ★ O-INHALT (29.10.2026): dazu jeder Gerüst-Weg mit eigenem Vorrat (bg, el, uk …).
    const geruestEigen = GERUEST_SPRACHEN.filter((s) => EXPEDITION_GERUEST[s].length > 0);
    expect(daneben).toEqual(["fr", "es", "it", "pl", "tr", "cs", ...geruestEigen]);
  });

  it("der Hook liest die Stimme über stationWordLang (keine zweite Regel daneben)", () => {
    const q = readFileSync(resolve(__dirname, "../src/components/typing/expedition/useExpedition.ts"), "utf-8");
    expect(q).toContain("speakQueued(isAdult ? `${word}.` : `${word}!`, stationWordLang(lernweg))");
    expect(q).not.toMatch(/lernweg === "de" \? "de" : "en"/);
  });
});
