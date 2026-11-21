/**
 * ★★★★ WÄCHTER: „Word roots" ist in `vorlagen.ts` verdrahtet - genau wie die
 * deutsche Fremdwörterkunde (Bauplan englischer Lehrgang §6.3, E8,
 * 24.09.2026). Modell: `tests/typing-vorlagen-neu.test.ts` (Fremdwörterkunde).
 *
 * Word roots gehört zum ENGLISCHEN LEHRGANG (Weg „en"), nicht schon zu jeder
 * Klasse, die englisch übt (`lang === "en"`) - eine deutsche Klasse mit
 * Übungssprache Englisch (D1, bisheriger Weg) sieht darum weiterhin KEINE
 * „Word roots"-Vorlage, genau wie eine englische Klasse (Weg „en") weiterhin
 * KEINE Fremdwörterkunde sieht.
 */
import { describe, expect, it } from "vitest";
import {
  WORD_ROOTS,
  WORD_ROOTS_ALPHABETISCH,
  WORD_ROOT_THEMEN,
  wordRootZeile,
} from "@/lib/typing/vorlagenDaten/wordRoots";
import {
  WORTWURZELN_CHALLENGE_DATEIEN,
  vorlageTitel,
  vorlageVorschau,
  vorlagenFuer,
} from "@/lib/typing/vorlagen";

const STUFEN = ["kids", "teens", "erwachsen"] as const;

describe(`★ Wer bekommt Word roots: nur der englische Lehrgang (Weg „en")`, () => {
  it(`Eigene Übung, Weg „en": vier Themen-Vorlagen, mit den Kennungen aus WORD_ROOT_THEMEN`, () => {
    const ids = vorlagenFuer({ fuer: "uebung", lang: "en" }).map((v) => v.id);
    expect(ids.filter((i) => i.startsWith("wurzeln-"))).toEqual(
      WORD_ROOT_THEMEN.map((t) => `wurzeln-${t.id}`),
    );
  });

  it(`Tippchallenge, Weg „en": alphabetische Word-roots-Dateien, keine Themen-Dateien`, () => {
    const ids = vorlagenFuer({ fuer: "challenge", lang: "en" }).map((v) => v.id);
    expect(ids.filter((i) => i.startsWith("wurzelnc-"))).toEqual(
      Array.from({ length: WORTWURZELN_CHALLENGE_DATEIEN }, (_, i) => `wurzelnc-${i + 1}`),
    );
    expect(ids.filter((i) => i.startsWith("wurzeln-"))).toEqual([]);
  });

  it(`eine deutsche Klasse (lang „de") sieht NIE „Word roots"`, () => {
    const uebung = vorlagenFuer({ fuer: "uebung", lang: "de" }).map((v) => v.id);
    const challenge = vorlagenFuer({ fuer: "challenge", lang: "de" }).map((v) => v.id);
    expect(uebung.some((i) => i.startsWith("wurzeln"))).toBe(false);
    expect(challenge.some((i) => i.startsWith("wurzeln"))).toBe(false);
  });

  it.each(STUFEN)(
    `%s: eine Klasse, die zwar Englisch übt, aber auf Weg „de" ist (D1), bekommt bei Word roots null`,
    (s) => {
      // lang „en", aber KEIN lernweg „en" (Vorgabe „de") - der bisherige Weg,
      // die deutsche Reihenfolge mit englischer Übungssprache.
      const thema = WORD_ROOT_THEMEN[0];
      expect(
        vorlageVorschau(`wurzeln-${thema.id}`, { stufe: s, lang: "en", verbietenSs: false }),
      ).toBeNull();
      expect(
        vorlageVorschau(`wurzeln-${thema.id}`, {
          stufe: s,
          lang: "en",
          verbietenSs: false,
          lernweg: "de",
        }),
      ).toBeNull();
    },
  );

  it(`Weg „en", aber Übungssprache „de": auch dann null (beide Bedingungen zählen)`, () => {
    const thema = WORD_ROOT_THEMEN[0];
    expect(
      vorlageVorschau(`wurzeln-${thema.id}`, {
        stufe: "kids",
        lang: "de",
        verbietenSs: false,
        lernweg: "en",
      }),
    ).toBeNull();
  });
});

describe(`★ Die Vorschau von Word roots (Weg „en" UND Übungssprache „en")`, () => {
  it.each(STUFEN)("%s: jede Themen-Datei gibt ihre Paare unverändert als Zeilen", (s) => {
    for (const t of WORD_ROOTS[s]) {
      const v = vorlageVorschau(`wurzeln-${t.id}`, {
        stufe: s,
        lang: "en",
        verbietenSs: false,
        lernweg: "en",
      });
      expect(v?.zeilen, `${s}/${t.id}`).toEqual(t.paare.map(wordRootZeile));
    }
  });

  it.each(STUFEN)("%s: die Challenge-Dateien decken zusammen GENAU die alphabetische Liste ab", (s) => {
    const zusammen: string[] = [];
    for (let i = 0; i < WORTWURZELN_CHALLENGE_DATEIEN; i++) {
      const v = vorlageVorschau(`wurzelnc-${i + 1}`, {
        stufe: s,
        lang: "en",
        verbietenSs: true,
        lernweg: "en",
      });
      expect(v?.unbekannt).toEqual([]);
      zusammen.push(...(v?.zeilen ?? []));
    }
    expect(zusammen).toEqual(WORD_ROOTS_ALPHABETISCH[s]);
  });

  it("eine unbekannte Datei-Nummer liefert null, keinen Absturz", () => {
    expect(
      vorlageVorschau("wurzelnc-99", { stufe: "kids", lang: "en", verbietenSs: true, lernweg: "en" }),
    ).toBeNull();
  });
});

describe("★ Die Namen: Deutsch für eine deutsche Bedienung, Englisch für eine englische", () => {
  it("jede Word-roots-Vorlage hat einen deutschen UND einen englischen Namen", () => {
    for (const v of [
      ...vorlagenFuer({ fuer: "uebung", lang: "en" }).filter((v) => v.id.startsWith("wurzeln")),
      ...vorlagenFuer({ fuer: "challenge", lang: "en" }).filter((v) => v.id.startsWith("wurzeln")),
    ]) {
      expect(vorlageTitel(v, "de").length, v.id).toBeGreaterThan(3);
      expect(vorlageTitel(v, "en").length, v.id).toBeGreaterThan(3);
    }
    const numbers = vorlagenFuer({ fuer: "uebung", lang: "en" }).find((v) => v.id === "wurzeln-numbers")!;
    expect(vorlageTitel(numbers, "en")).toBe("Word roots: Numbers and size");
    expect(vorlageTitel(numbers, "de")).toMatch(/^Wortstämme: /);
  });
});
