/**
 * WÄCHTER über die spanische Wortliste der Tippchallenge (27.09.2026).
 *
 * ★★★★★ Vorher: `ladeWoerter(niveau, "es")` hatte KEINEN eigenen Zweig und
 * fiel still auf die DEUTSCHE Liste zurück - eine spanische Klasse hätte
 * unbekannte Wörter entweder buchstabiert ODER (schlimmer) an der deutschen
 * Liste vorbeigeprüft bekommen, je nachdem, ob die Normalform zufällig
 * übereinstimmt. Siehe `BEFUND-2026-09-27-ES-RETO-CODE.md` §9 Punkt 3 und
 * `BEFUND-2026-09-27-ES-RETO-WOERTER-SPERRLISTE.md`.
 *
 * Was dieser Wächter hält:
 *  1. Jede gefüllte spanische Bank (buchstaben/satz/zahlen/alles/code) hat
 *     eine eigene, nicht-leere Wortliste - erzeugt gegen das Wörterbuch von
 *     macOS (`scripts/erzeuge-schreibproben-woerter-es.mts`).
 *  2. Ein gängiges Wort mit Akzent (á é í ó ú) oder ñ aus der jeweiligen
 *     Liste wird beim Vorlesen GANZ gesprochen, nicht buchstabiert - die
 *     Gegenprobe (nur das Lexikon, ohne Liste) zeigt, dass der Test den
 *     gemeldeten Fehler wirklich sehen kann.
 *  3. `ladeWoerter` scheitert LAUT bei einem Lernweg ohne eigenen Zweig -
 *     nie mehr ein stiller Rückfall auf Deutsch (die Fehlerklasse von §9.3).
 *  4. „start" (die Grundreihe) hat auf Weg „es" ABSICHTLICH KEINE Liste -
 *     ihre Übungssilben werden buchstabiert, wie bei „de" (`woerter.ts` hat
 *     dort gar keinen Schlüssel). „gross" hat seit ES-R0 (27.09.2026)
 *     EBENFALLS eine echte Bank und darum eine eigene Liste (Namen wie
 *     „amaru"/„daniela", die das Lexikon nicht kennt).
 */
import { describe, expect, it } from "vitest";
import { ladeWoerter } from "@/lib/typing/schreibproben";
import { WOERTER_ES } from "@/lib/typing/schreibproben/woerterEs";
import { isRealWord, normalizeWord } from "@/lib/typing/lexicon";
import { readPlanAt } from "@/lib/typing/voice";
import type { ProbenNiveau } from "@/lib/typing/schreibprobe";
import type { Lernweg } from "@/lib/typing/lernweg";

const MIT_LISTE = ["gross", "buchstaben", "satz", "zahlen", "alles", "code"] as const satisfies readonly ProbenNiveau[];

describe('ladeWoerter(niveau, "es") liefert die spanische Liste, nicht die deutsche', () => {
  for (const niveau of MIT_LISTE) {
    it(`"${niveau}": nicht-leer und identisch mit WOERTER_ES`, async () => {
      const s = await ladeWoerter(niveau, "es");
      expect(s.size).toBeGreaterThan(0);
      expect(s).toEqual(new Set(WOERTER_ES[niveau] ?? []));
    });
  }

  it('"start" hat auf Weg „es" keine Liste (Grundreihe, wie „de")', async () => {
    expect(await ladeWoerter("start", "es")).toEqual(new Set());
  });

  it("die deutsche Liste bleibt unberührt (Gegenprobe gegen den alten stillen Rückfall)", async () => {
    const de = await ladeWoerter("buchstaben", "de");
    const es = await ladeWoerter("buchstaben", "es");
    // Vorher (Rückfall auf „de") wären das dieselben Wörter gewesen.
    expect(es).not.toEqual(de);
  });

  it('ein Lernweg ohne eigenen Zweig scheitert LAUT (Gegenprobe: nie stiller Rückfall auf Deutsch)', async () => {
    // ⚠️ Nur über eine Typ-Umgehung erreichbar (der `switch` ist für die vier
    // echten Wege erschöpfend - `tsc --noEmit` schlägt sonst schon beim
    // Bauen an). Genau das prüft, dass die Laufzeit-Wache wirklich greift.
    // ★ G2-NEUN (25.10.2026): „pt" ist seither ein Weg (Portugal) - die Probe nimmt „xx".
    const unbekannt = "xx" as unknown as Lernweg;
    await expect(ladeWoerter("buchstaben", unbekannt)).rejects.toThrow(
      /kein eigener Zweig für Lernweg/,
    );
  });
});

describe("★ Vorlesen: gängige spanische Wörter mit Akzent/ñ werden GANZ gesprochen", () => {
  const MODI = { letters: false, words: true, sentences: false, shiftLearned: true, lang: "es" as const };
  const nurLexikon = (t: string) => isRealWord(t, "es");
  const mitListe = (niveau: ProbenNiveau) => {
    const ja = new Set(WOERTER_ES[niveau] ?? []);
    return (t: string) => nurLexikon(t) || ja.has(normalizeWord(t, "es"));
  };

  // ★ ES-R0 (27.09.2026): „gross" bleibt hier AUSSEN VOR - seine Liste hat
  // (gemessen) KEIN ñ-Wort, das das Lexikon nicht selbst schon kennt (die
  // Namen/Adjektive des Niveaus brauchen kein ñ; „montaña" & Co. stehen im
  // Lexikon und werden darum nie zum Kandidaten). Ein eigener, kleinerer
  // Test dafür steht unten.
  const MIT_TILDE_BEISPIEL = ["buchstaben", "satz", "zahlen", "alles", "code"] as const satisfies readonly ProbenNiveau[];

  /** Je Niveau ein Wort mit ñ UND eins mit Akzent, das WIRKLICH in der Liste steht. */
  const BEISPIELE: Record<(typeof MIT_TILDE_BEISPIEL)[number], { nMitTilde: string; mitAkzent: string }> = {
    buchstaben: { nMitTilde: "acompañan", mitAkzent: "agarró" },
    satz: { nMitTilde: "españa", mitAkzent: "américa" },
    zahlen: { nMitTilde: "castañas", mitAkzent: "acordeón" },
    alles: { nMitTilde: "acompañan", mitAkzent: "advirtió" },
    code: { nMitTilde: "añadidos", mitAkzent: "acentuación" },
  };

  // ★ 27.09.2026 (Merge nach T5/ES-W): das Lexikon kennt „españa" jetzt
  // selbst, und JEDES ñ-Wort der Liste „satz" ebenso (gemessen) - dort ist die
  // Gegenprobe nicht mehr möglich; die übrigen vier Niveaus tragen sie weiter.
  // ★ ES-P2 (27.09.2026, Auftrag „Lexikon es/fr ergänzt"): NACHTRAG_ES2 hat
  // „américa"/„acordeón"/„nicolás" ebenfalls ins allgemeine Lexikon geholt
  // (aus CORPUS_ES/Serien/Raíces, gegen das macOS-Wörterbuch geprüft) - die
  // Gegenprobe für diese drei entfällt aus demselben Grund wie bei „españa".
  const LEXIKON_KENNT_ES = new Set(["españa", "américa", "acordeón", "nicolás"]);
  it("Gegenprobe bleibt: mindestens vier Niveaus haben ein ñ-Wort, das NUR die Liste kennt", () => {
    const mitGegenprobe = MIT_TILDE_BEISPIEL.filter((n) => !LEXIKON_KENNT_ES.has(BEISPIELE[n].nMitTilde));
    expect(mitGegenprobe.length).toBeGreaterThanOrEqual(4);
  });

  it('gross: "nicolás" (mit Akzent) steht in der Liste und wird ganz gesprochen', () => {
    expect(WOERTER_ES.gross).toContain("nicolás");
    const zeile = "La clase escribe el nombre nicolás hoy.";
    const i = zeile.indexOf("nicolás");
    // Gegenprobe: mit dem Lexikon allein bleibt das Wort buchstabiert -
    // ausser das Lexikon hat es inzwischen selbst (benannt, siehe oben).
    if (LEXIKON_KENNT_ES.has("nicolás")) expect(nurLexikon("nicolás")).toBe(true);
    else expect(readPlanAt(zeile, i, MODI, nurLexikon)).not.toEqual(["nicolás"]);
    expect(readPlanAt(zeile, i, MODI, mitListe("gross"))).toEqual(["nicolás"]);
  });

  for (const niveau of MIT_TILDE_BEISPIEL) {
    const { nMitTilde, mitAkzent } = BEISPIELE[niveau];

    it(`${niveau}: "${nMitTilde}" (mit ñ) steht in der Liste und wird ganz gesprochen`, () => {
      expect(WOERTER_ES[niveau]).toContain(nMitTilde);
      const zeile = `La clase escribe la palabra ${nMitTilde} hoy.`;
      const i = zeile.indexOf(nMitTilde);
      // Gegenprobe: mit dem Lexikon allein bleibt das Wort buchstabiert -
      // ausser das Lexikon hat es inzwischen selbst (benannt, siehe unten).
      if (LEXIKON_KENNT_ES.has(nMitTilde)) expect(nurLexikon(nMitTilde)).toBe(true);
      else expect(readPlanAt(zeile, i, MODI, nurLexikon)).not.toEqual([nMitTilde]);
      expect(readPlanAt(zeile, i, MODI, mitListe(niveau))).toEqual([nMitTilde]);
    });

    it(`${niveau}: "${mitAkzent}" (mit Akzent) steht in der Liste und wird ganz gesprochen`, () => {
      expect(WOERTER_ES[niveau]).toContain(mitAkzent);
      const zeile = `La clase escribe la palabra ${mitAkzent} hoy.`;
      const i = zeile.indexOf(mitAkzent);
      // Gegenprobe: mit dem Lexikon allein bleibt das Wort buchstabiert -
      // ausser das Lexikon hat es inzwischen selbst (benannt, siehe oben).
      if (LEXIKON_KENNT_ES.has(mitAkzent)) expect(nurLexikon(mitAkzent)).toBe(true);
      else expect(readPlanAt(zeile, i, MODI, nurLexikon)).not.toEqual([mitAkzent]);
      expect(readPlanAt(zeile, i, MODI, mitListe(niveau))).toEqual([mitAkzent]);
    });
  }
});
