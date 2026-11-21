/**
 * ★★★★ WÄCHTER (Punkt 2 „vier Reste", 28.09.2026): IN JEDER SPRACHE WIRD
 * JEDES WORT GANZ VORGELESEN - AUCH NACH ( [ { " „ « ¿ ¡ - * # ' @ UND VOR
 * ) ] } " “ ».
 *
 * Für Weg „es" am 27.09. behoben (ES-M2 S2), de/en/fr blieben offen: der
 * Wortanfang lag auf dem öffnenden Zeichen, an „B" von „"Bonjour," kam
 * nichts. Gemessen (`pruefstand/vier-reste/p2-woerter-nach-oeffnenden.mts`),
 * echte Wörter nie ganz gesprochen: fr Korpus 301, Serien 358, Tippchallenge
 * 1783; de Tippchallenge 230; en Tippchallenge 630. Jetzt eine Regel für alle
 * (`OEFFNEND_VOR_WORT`/`SCHLIESSEND_NACH_WORT` in voice.ts).
 *
 * Geprüft über die FEHLERKLASSE: jedes öffnende × jedes schliessende Zeichen
 * um ein bekanntes Wort jeder Sprache, dazu Korpus, Serien und
 * Tippchallenge-Texte aller vier Sprachen. Die Erwartung ist unabhängig vom
 * Code aufgeschrieben. Gegenprobe gemessen (alte voice.ts, Regel nur für
 * „es", unter den neuen Namen eingehängt): 10 von 15 rot - de/en/fr, jede
 * Zeichen-Matrix und die Tippchallenge-Texte; fr auch Korpus/Serien.
 */
import { describe, expect, it } from "vitest";

import { OEFFNEND_VOR_WORT, SCHLIESSEND_NACH_WORT, readPlanAt, type ReadModes } from "../src/lib/typing/voice";
import { isRealWord } from "../src/lib/typing/lexicon";
import { korpusFuer } from "../src/lib/typing/corpus";
import { SERIEN } from "../src/lib/typing/serien";
import { ladeTexte } from "../src/lib/typing/schreibproben";
import type { Lang } from "../src/lib/typing/account";

const SPRACHEN: Lang[] = ["de", "en", "fr", "es"];
const modus = (lang: Lang): ReadModes => ({ letters: false, words: true, sentences: true, shiftLearned: true, lang });
const istWortIn = (lang: Lang) => (t: string) => isRealWord(t, lang);

/** Unabhängig vom Code: die Zeichen, die ein Wort umschliessen dürfen. */
const AUF = `¿¡"(\\[{\\-*#'«»“”„‘’‚‹›@`;
const ZU = `)\\]}"'»«”“’‘‹›`;
const SATZ = `.,;:?!…`;
/** Ein Wort aus Text, nicht aus Programmcode (= $ & _ € [] … bleiben aussen vor). */
const PROSA = new RegExp(`^[${AUF}]*[\\p{L}\\p{N}'’\\-]+[${ZU}${SATZ}]*$`, "u");

function erwartet(t: string): string {
  const vorn = t.replace(new RegExp(`^[${AUF}]+`), "");
  const hinten = vorn.match(new RegExp(`[${ZU}${SATZ}]*$`))?.[0] ?? "";
  return vorn.slice(0, vorn.length - hinten.length) + hinten.replace(new RegExp(`[${ZU}]`, "g"), "");
}

/** Echte Wörter, die an keiner Stelle ihrer Zeile ganz gesprochen werden. */
function nieGanz(zeilen: readonly string[], lang: Lang): string[] {
  const istWort = istWortIn(lang);
  const out: string[] = [];
  for (const z of zeilen) {
    const g = new Set<string>();
    for (let i = 0; i < z.length; i++) for (const p of readPlanAt(z, i, modus(lang), istWort)) g.add(p);
    for (const t of z.split(" ")) {
      if (!PROSA.test(t) || t.replace(/[^\p{L}]/gu, "").length < 2 || !istWort(t)) continue;
      if (!g.has(erwartet(t))) out.push(t);
    }
  }
  return out;
}

const WORT: Record<Lang, [string, string]> = {
  de: ["Wir sehen %s im Garten.", "Katze"],
  en: ["My dog %s barks.", "puppy"],
  fr: ["Mon chien %s aboie.", "caniche"],
  es: ["Mi mascota %s se llama Luna.", "tortuga"],
  // RÜCKFALL-EN (G2a): it, pl, tr, cs zeigen vorerst Englisch.
  it: ["My dog %s barks.", "puppy"],
  pl: ["My dog %s barks.", "puppy"],
  tr: ["My dog %s barks.", "puppy"],
  cs: ["My dog %s barks.", "puppy"],
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: ["My dog %s barks.", "puppy"],
  el: ["My dog %s barks.", "puppy"],
  hu: ["My dog %s barks.", "puppy"],
  nl: ["My dog %s barks.", "puppy"],
  pt: ["My dog %s barks.", "puppy"],
  br: ["My dog %s barks.", "puppy"],
  ro: ["My dog %s barks.", "puppy"],
  sv: ["My dog %s barks.", "puppy"],
  uk: ["My dog %s barks.", "puppy"],
};

describe("Punkt 2: Wörter nach öffnenden und vor schliessenden Zeichen - jede Sprache", () => {
  for (const lang of SPRACHEN) {
    it(`${lang}: jedes öffnende × jedes schliessende Zeichen - das Wort ganz und ohne Zeichen`, () => {
      const [rahmen, wort] = WORT[lang];
      expect(isRealWord(wort, lang), `${wort} im Lexikon ${lang}`).toBe(true);
      for (const o of [...OEFFNEND_VOR_WORT, ""])
        for (const c of [...SCHLIESSEND_NACH_WORT, ""]) {
          const zeile = rahmen.replace("%s", `${o}${wort}${c}`);
          expect(readPlanAt(zeile, zeile.indexOf(wort), modus(lang), istWortIn(lang)), zeile).toEqual([wort]);
        }
    });

    it(`${lang}: Korpus und Serien - kein echtes Wort bleibt ungesprochen`, () => {
      const zeilen = [
        ...korpusFuer(lang).map((c) => c.text),
        ...SERIEN.filter((s) => (s.lang ?? "de") === lang).flatMap((s) => s.etappen.flatMap((e) => e.lines)),
      ];
      expect(zeilen.length).toBeGreaterThan(1000);
      expect(nieGanz(zeilen, lang).slice(0, 12)).toEqual([]);
    }, 60_000);

    it(`${lang}: Tippchallenge-Texte - kein echtes Wort bleibt ungesprochen`, async () => {
      const zeilen: string[] = [];
      for (const n of ["start", "gross", "buchstaben", "satz", "zahlen", "alles", "code"] as const)
        for (const t of await ladeTexte(n, lang)) zeilen.push(...t.zeilen);
      expect(zeilen.length).toBeGreaterThan(1000);
      expect(nieGanz(zeilen, lang).slice(0, 12)).toEqual([]);
    }, 60_000);
  }

  it("Satzzeichen hinter der Klammer bleiben, ein gewöhnliches Wort bleibt Zeichen für Zeichen", () => {
    const z = "Er wohnt im Haus (bei der Oma), und spielt.";
    const m = modus("de");
    expect(readPlanAt(z, z.indexOf("Oma"), m, istWortIn("de"))).toEqual(["Oma,"]);
    expect(readPlanAt(z, z.indexOf("Haus"), m, istWortIn("de"))).toEqual(["Haus"]);
    expect(readPlanAt(z, z.indexOf("spielt"), m, istWortIn("de"))).toEqual(["spielt."]);
  });

  it("deutsche Anführungszeichen „…“ und »…« werden abgestreift", () => {
    const m = modus("de");
    for (const z of ["Sie rief „Hallo“ laut.", "Sie rief »Hallo« laut.", "Sie rief ‚Hallo‘ laut."])
      expect(readPlanAt(z, z.indexOf("Hallo"), m, istWortIn("de")), z).toEqual(["Hallo"]);
  });

  it("die Erwartung ist unabhängig vom Code aufgeschrieben", () => {
    expect(erwartet('"Bonjour,')).toBe("Bonjour,");
    expect(erwartet("tortuga).")).toBe("tortuga.");
    expect(erwartet("»Hallo«")).toBe("Hallo");
    // Mit der alten voice.ts (Regel nur für „es") meldet diese Zeile „"Hallo"".
    expect(nieGanz(['Er sagte "Hallo" laut.'], "de")).toEqual([]);
  });
});
