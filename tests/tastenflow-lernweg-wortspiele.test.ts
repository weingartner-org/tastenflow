/**
 * ★★★★★ WÄCHTER: die 13 WORTSPIELE (Übungsformen) auf Weg „en" (E6a, 24.09.2026).
 *
 * Bauplan: `BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md` §6.3 („Wortspiele: Gate
 * über den Weg; `alphabetreihen` ohne ä ö ü ß; Fingerdiktat über die englische
 * Reihenfolge; Spiegelwörter ohne deutsche Bonuspaare") und §11 Falle 6 (hart
 * verdrahtete deutsche Listen).
 *
 * ★ Was hier NICHT geprüft wird: Weg „de" - der bleibt Byte für Byte, wie er
 * war (eigenständige Wächter `tests/tastenflow-lernweg-de-unveraendert.test.ts`
 * und `tests/tastenflow-lernweg-inhalt-de-unveraendert.test.ts`). Dieser Wächter
 * prüft NUR Weg „en", auf der US-Tastatur (wie
 * `tests/tastenflow-lernweg-en-reihenfolge.test.ts`) - dort ersetzt keine
 * `achteGrundtasteFuerLayout`-Regel die 8. Grundtaste durch „ö", und die Prüfung
 * bleibt darum eindeutig.
 *
 * ── Die Regel, die für ALLE 13 Formen gilt ──────────────────────────────────
 * Was ein Kind auf Weg „en" TIPPT, darf nie ä/ö/ü/ß verlangen und nie eine
 * Taste, die noch nicht freigeschaltet ist - dieselbe Prüfung, die `fitText`/
 * `fitsKeys` (`corpus.ts`) für jede andere Stelle der App schon durchsetzen.
 * Vor E6a liefen zwei Formen daran vorbei, WEIL sie eine eigene, fest
 * deutsche Buchstabenliste mitbrachten statt den Weg zu fragen:
 * `alphabetreihen` (a-z dann ä ö ü ß) und `fingerdiktat` (Schleife über die
 * deutsche `LETTER_ORDER`, „;" kam darin nie vor). Beides ist hier eigens
 * nachgemessen, nicht nur über die allgemeine Schleife.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  UEBUNGSFORMEN,
  type FormKontext,
  type Uebungsform,
} from "@/lib/typing/uebungsformen";
import { alphabetreihen } from "@/lib/typing/uebungsformen/alphabetreihen";
import {
  fingerdiktatAufgaben,
  fingerdiktatTaugt,
} from "@/lib/typing/uebungsformen/fingerdiktatAufgaben";
import { waehleSalatwort } from "@/lib/typing/uebungsformen/buchstabensalat";
import { vorlagenFuer } from "@/lib/typing/vorlagen";
import { SHIFT_UNIT, introOrder, introducedUpTo } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { fitsKeys } from "@/lib/typing/corpus";

/** Kleiner deterministischer Zufallsgenerator - dieselbe Saat, dieselbe Folge. */
function seededZufall(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const UMLAUT_ODER_SS = /[äöüßÄÖÜẞ]/;

/** Ein FormKontext auf Weg „en" mit dem gegebenen Tastenstand. */
function ctxEnMit(introduced: readonly string[], overrides: Partial<FormKontext> = {}): FormKontext {
  return {
    lernweg: "en",
    introduced: [...introduced],
    shift: introduced.includes(SHIFT_UNIT),
    oneHand: false,
    stufe: "kids",
    lang: "en",
    sprache: "en",
    count: 12,
    zufall: seededZufall(1),
    ...overrides,
  };
}

/**
 * Alles, was ein Kind bei dieser Form wirklich TIPPT - nicht, was nur
 * angesagt/gelesen wird (bei den Rätsel-Formen ist die „frage" oft ein ganzer
 * Satz, der bloß vorgelesen wird; getippt wird allein `antworten`, siehe
 * `wasfehlt.ts`/`korrekturlesen.ts`/`zahlendiktat.ts`).
 */
function getippteTexte(form: Uebungsform, ctx: FormKontext): string[] {
  if (form.eigenerBildschirm === "raetsel") {
    return (form.fragen?.(ctx) ?? []).flatMap((a) => a.antworten);
  }
  if (form.eigenerBildschirm === "buchstabensalat") {
    const wort = waehleSalatwort(ctx);
    return wort ? [wort] : [];
  }
  const runde = form.baue?.(ctx) ?? null;
  return runde ? runde.zeilen.map((z) => z.text) : [];
}

describe('E6a: die 13 Wortspiele auf Weg "en"', () => {
  beforeEach(() => setLayout("us"));
  afterEach(() => setLayout("de"));

  // Zwei Stände: der frühe Meilenstein aus dem Bauplan (§3.3a: Grundreihe +
  // e i n r t h o + Umschalttaste, 16 Einheiten) und der volle Weg (alles frei) -
  // eine Form, die früh nichts liefert, kriegt so noch eine zweite Chance.
  const STAENDE: { name: string; introduced: () => string[] }[] = [
    { name: "früh (Grundreihe + e i n r t h o, introducedUpTo 16)", introduced: () => introducedUpTo(16, "en") },
    { name: "voll (introOrder)", introduced: () => [...introOrder("en")] },
  ];

  for (const stand of STAENDE) {
    describe(`Stand: ${stand.name}`, () => {
      for (const form of UEBUNGSFORMEN) {
        it(`"${form.id}" verlangt nie ä/ö/ü/ß oder eine gesperrte Taste`, () => {
          const introduced = stand.introduced();
          const ctx = ctxEnMit(introduced, { count: 12, zufall: seededZufall(3) });
          if (!form.taugt(ctx)) return; // diese Form ist auf diesem Stand noch nicht dran
          const allowed = new Set(ctx.introduced);
          const texte = getippteTexte(form, ctx);
          for (const text of texte) {
            expect(text, `${form.id}: "${text}" verlangt ä/ö/ü/ß`).not.toMatch(UMLAUT_ODER_SS);
            expect(
              fitsKeys(text, allowed),
              `${form.id}: "${text}" braucht eine Taste, die auf diesem Stand noch nicht frei ist`,
            ).toBe(true);
          }
        });
      }
    });
  }

  // ── Alphabet-Reihen: kein ä ö ü ß (Bauplan §6.3) ──────────────────────────

  describe('Alphabet-Reihen auf Weg "en"', () => {
    it("liefert mit dem VOLLEN Weg reine a-z-Zeilen, nie ä ö ü ß", () => {
      const ctx = ctxEnMit(introOrder("en"), { count: 20, zufall: seededZufall(11) });
      expect(alphabetreihen.taugt(ctx)).toBe(true);
      const runde = alphabetreihen.baue?.(ctx);
      expect(runde).toBeTruthy();
      expect(runde!.zeilen.length).toBeGreaterThan(0);
      for (const zeile of runde!.zeilen) {
        expect(zeile.text).not.toMatch(UMLAUT_ODER_SS);
      }
    });

    it("Gegenprobe: auf Weg \"de\" liefert derselbe volle Tastenstand weiter ä ö ü ß am Ende", () => {
      setLayout("de");
      const ctx = ctxEnMit(introOrder("de"), { lernweg: "de", lang: "de", count: 20, zufall: seededZufall(11) });
      const runde = alphabetreihen.baue?.(ctx);
      expect(runde).toBeTruthy();
      expect(runde!.zeilen.some((z) => UMLAUT_ODER_SS.test(z.text))).toBe(true);
    });

    it(
      'auf der DEUTSCHEN Tastatur ersetzt die 8. Grundtaste „;" durch „ö" (achteGrundtasteFuerLayout) - ' +
        'diese physische Taste ist kein Alphabet-Buchstabe und darf in der Reihe nie auftauchen',
      () => {
        setLayout("de");
        const introduced = [...introOrder("en")]; // enthält jetzt „ö" statt „;" an Position 8
        expect(introduced).toContain("ö");
        const ctx = ctxEnMit(introduced, { count: 20, zufall: seededZufall(11) });
        const runde = alphabetreihen.baue?.(ctx);
        if (!runde) return; // nicht genug ECHTE Buchstaben - dann gibt es ohnehin nichts zu prüfen
        for (const zeile of runde.zeilen) expect(zeile.text).not.toContain("ö");
      },
    );
  });

  // ── Fingerdiktat: folgt der ENGLISCHEN Reihenfolge (Bauplan §6.3) ─────────

  describe('Fingerdiktat auf Weg "en"', () => {
    it('kennt „;" als Grundreihen-Zeichen - die Form lief vorher über die deutsche LETTER_ORDER, in der „;" nirgends vorkommt', () => {
      const introduced = introducedUpTo(8, "en"); // genau die Grundreihe: f j d k s l a ;
      expect(introduced).toContain(";");
      const ctx = ctxEnMit(introduced, { count: 200, zufall: seededZufall(3) });
      expect(fingerdiktatTaugt(ctx)).toBe(true);
      const zeichenGesehen = new Set(fingerdiktatAufgaben(ctx).map((a) => a.zeichen));
      expect(zeichenGesehen.has(";")).toBe(true);
      for (const z of zeichenGesehen) expect(introduced).toContain(z);
    });

    it("fragt auf dem vollen Weg nie ä ö ü ß ab (die sind auf Weg \"en\" ohnehin nie eingeführt)", () => {
      const introduced = [...introOrder("en")];
      const ctx = ctxEnMit(introduced, { count: 300, zufall: seededZufall(9) });
      const zeichenGesehen = new Set(fingerdiktatAufgaben(ctx).map((a) => a.zeichen));
      for (const z of zeichenGesehen) {
        expect(z).not.toMatch(UMLAUT_ODER_SS);
        expect(introduced).toContain(z);
      }
    });
  });

  // ── Fremdwörterkunde: auf Weg "en" nicht im Angebot (Bauplan §6.3) ────────

  describe('Vorlagen "Eigene Übung": Fremdwörterkunde ist auf Weg "en" nicht dabei', () => {
    it('vorlagenFuer mit lang="en" enthält keine fremd-/fremdc-Vorlage', () => {
      for (const fuer of ["uebung", "challenge"] as const) {
        const ids = vorlagenFuer({ fuer, lang: "en" }).map((v) => v.id);
        expect(ids.some((id) => id.startsWith("fremd"))).toBe(false);
      }
    });

    it('Gegenprobe: mit lang="de" ist die Fremdwörterkunde weiter da', () => {
      expect(
        vorlagenFuer({ fuer: "uebung", lang: "de" }).some((v) => v.id.startsWith("fremd-")),
      ).toBe(true);
      expect(
        vorlagenFuer({ fuer: "challenge", lang: "de" }).some((v) => v.id.startsWith("fremdc-")),
      ).toBe(true);
    });
  });
});
