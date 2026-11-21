/**
 * ★★★★ WÄCHTER: „D'où viennent les mots ?" ist in `vorlagen.ts` verdrahtet -
 * genau wie Fremdwörterkunde (Weg „de") und Word roots (Weg „en"), Modell:
 * `tests/tastenflow-vorlage-word-roots-wiring.test.ts` (E10a, 25.09.2026).
 *
 * „D'où viennent les mots ?" gehört zum FRANZÖSISCHEN LEHRGANG (Weg „fr"),
 * nicht schon zu jeder Klasse, die französisch übt (`lang === "fr"`) - eine
 * deutsche oder englische Klasse mit Übungssprache Französisch (falls es sie
 * je gäbe) sieht darum weiterhin KEINE Vorlage, genau wie eine französische
 * Klasse weiterhin KEINE Fremdwörterkunde/Word roots sieht.
 */
import { describe, expect, it } from "vitest";
import {
  RACINES,
  RACINES_ALPHABETISCH,
  RACINES_THEMEN,
  racineZeile,
} from "@/lib/typing/vorlagenDaten/racines";
import {
  RACINES_CHALLENGE_DATEIEN,
  vorlageTitel,
  vorlageVorschau,
  vorlagenFuer,
} from "@/lib/typing/vorlagen";

const STUFEN = ["kids", "teens", "erwachsen"] as const;

describe(`★ Wer bekommt "D'où viennent les mots ?": nur der französische Lehrgang (Weg „fr")`, () => {
  it(`Eigene Übung, Weg „fr": vier Themen-Vorlagen, mit den Kennungen aus RACINES_THEMEN`, () => {
    const ids = vorlagenFuer({ fuer: "uebung", lang: "fr" }).map((v) => v.id);
    expect(ids.filter((i) => i.startsWith("mots-"))).toEqual(
      RACINES_THEMEN.map((t) => `mots-${t.id}`),
    );
  });

  it(`Tippchallenge, Weg „fr": alphabetische Dateien, keine Themen-Dateien`, () => {
    const ids = vorlagenFuer({ fuer: "challenge", lang: "fr" }).map((v) => v.id);
    expect(ids.filter((i) => i.startsWith("motsc-"))).toEqual(
      Array.from({ length: RACINES_CHALLENGE_DATEIEN }, (_, i) => `motsc-${i + 1}`),
    );
    expect(ids.filter((i) => i.startsWith("mots-"))).toEqual([]);
  });

  it(`eine deutsche Klasse (lang „de") sieht NIE "D'où viennent les mots ?"`, () => {
    const uebung = vorlagenFuer({ fuer: "uebung", lang: "de" }).map((v) => v.id);
    const challenge = vorlagenFuer({ fuer: "challenge", lang: "de" }).map((v) => v.id);
    expect(uebung.some((i) => i.startsWith("mots"))).toBe(false);
    expect(challenge.some((i) => i.startsWith("mots"))).toBe(false);
  });

  it(`eine englische Klasse (lang „en") sieht NIE "D'où viennent les mots ?"`, () => {
    const uebung = vorlagenFuer({ fuer: "uebung", lang: "en" }).map((v) => v.id);
    const challenge = vorlagenFuer({ fuer: "challenge", lang: "en" }).map((v) => v.id);
    expect(uebung.some((i) => i.startsWith("mots"))).toBe(false);
    expect(challenge.some((i) => i.startsWith("mots"))).toBe(false);
  });

  it.each(STUFEN)(
    `%s: eine Klasse, die zwar Französisch übt, aber nicht auf Weg „fr" ist, bekommt null`,
    (s) => {
      const thema = RACINES_THEMEN[0];
      expect(
        vorlageVorschau(`mots-${thema.id}`, { stufe: s, lang: "fr", verbietenSs: false }),
      ).toBeNull(); // ohne lernweg-Angabe gilt die Vorgabe „de"
      expect(
        vorlageVorschau(`mots-${thema.id}`, {
          stufe: s,
          lang: "fr",
          verbietenSs: false,
          lernweg: "de",
        }),
      ).toBeNull();
      expect(
        vorlageVorschau(`mots-${thema.id}`, {
          stufe: s,
          lang: "fr",
          verbietenSs: false,
          lernweg: "en",
        }),
      ).toBeNull();
    },
  );

  it(`Weg „fr", aber Übungssprache nicht „fr": auch dann null (beide Bedingungen zählen)`, () => {
    const thema = RACINES_THEMEN[0];
    expect(
      vorlageVorschau(`mots-${thema.id}`, {
        stufe: "kids",
        lang: "de",
        verbietenSs: false,
        lernweg: "fr",
      }),
    ).toBeNull();
  });
});

describe(`★ Die Vorschau von "D'où viennent les mots ?" (Weg „fr" UND Übungssprache „fr")`, () => {
  it.each(STUFEN)("%s: jede Themen-Datei gibt ihre Paare unverändert als Zeilen", (s) => {
    for (const t of RACINES[s]) {
      const v = vorlageVorschau(`mots-${t.id}`, {
        stufe: s,
        lang: "fr",
        verbietenSs: false,
        lernweg: "fr",
      });
      expect(v?.zeilen, `${s}/${t.id}`).toEqual(t.paare.map(racineZeile));
    }
  });

  it.each(STUFEN)("%s: die Challenge-Dateien decken zusammen GENAU die alphabetische Liste ab", (s) => {
    // ⚠️ E10a (25.09.2026): anders als bei der englischen Fassung wird
    // `v?.unbekannt` hier NICHT auf `[]` geprüft. `verarbeiteEigenenText`
    // vergleicht gegen `zeichenVorrat("alles", "fr")`
    // (`schreibprobe.ts` -> `niveauDef` -> `lernweg.ts`, E4/E9-Gerüst) - jede
    // Zeile hier trägt echte französische Buchstaben (é è à ç ê ô œ …), die
    // das Niveau „alles" des Weges „fr" bis zum Abschluss des Gerüsts noch
    // nicht kennt. Das ist eine Lücke in der GERÜST-Zeichentabelle, keine in
    // diesem Inhalt - sobald sie geschlossen ist, wird `unbekannt` leer, ohne
    // dass sich an `RACINES`/`RACINES_ALPHABETISCH` etwas ändert. Die eigene
    // Zeicheninventur dieser Vorlage steht in `tests/tastenflow-vorlage-racines.test.ts`.
    const zusammen: string[] = [];
    for (let i = 0; i < RACINES_CHALLENGE_DATEIEN; i++) {
      const v = vorlageVorschau(`motsc-${i + 1}`, {
        stufe: s,
        lang: "fr",
        verbietenSs: true,
        lernweg: "fr",
      });
      zusammen.push(...(v?.zeilen ?? []));
    }
    expect(zusammen).toEqual(RACINES_ALPHABETISCH[s]);
  });

  it("eine unbekannte Datei-Nummer liefert null, keinen Absturz", () => {
    expect(
      vorlageVorschau("motsc-99", { stufe: "kids", lang: "fr", verbietenSs: true, lernweg: "fr" }),
    ).toBeNull();
  });
});

describe("★ Die Namen: Deutsch für eine deutsche Bedienung, Englisch für eine englische", () => {
  it(`jede "D'où viennent les mots ?"-Vorlage hat einen deutschen UND einen englischen Namen`, () => {
    for (const v of [
      ...vorlagenFuer({ fuer: "uebung", lang: "fr" }).filter((v) => v.id.startsWith("mots")),
      ...vorlagenFuer({ fuer: "challenge", lang: "fr" }).filter((v) => v.id.startsWith("mots")),
    ]) {
      expect(vorlageTitel(v, "de").length, v.id).toBeGreaterThan(3);
      expect(vorlageTitel(v, "en").length, v.id).toBeGreaterThan(3);
    }
    const erste = vorlagenFuer({ fuer: "uebung", lang: "fr" }).find(
      (v) => v.id === `mots-${RACINES_THEMEN[0].id}`,
    )!;
    expect(vorlageTitel(erste, "en")).toMatch(/^Word origins: /);
    expect(vorlageTitel(erste, "de")).toMatch(/^Wortwurzeln: /);
  });
});
