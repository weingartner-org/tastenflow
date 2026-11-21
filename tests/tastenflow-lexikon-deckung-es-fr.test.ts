/**
 * WÄCHTER: der Anteil der Korpuszeilen „es"/"fr" mit einem Wort, das das
 * Lexikon nicht kennt, bleibt unter einer Schwelle (27.09.2026, Auftrag
 * „Lexikon es/fr ergänzt").
 *
 * ── Der Befund dahinter ─────────────────────────────────────────────────────
 * Unabhängige Prüfung 27.09.2026: 49 % der spanischen und 45 % der
 * französischen Korpuszeilen enthielten ein Wort, das `isRealWord` nicht
 * kennt - es wurde buchstabiert statt ganz gesprochen. Ursache: `CORPUS_ES`/
 * `CORPUS_FR` werden (anders als `CORPUS`/`CORPUS_EN`) NICHT in
 * `buildLexicon` (`lexicon.ts`) verschleift - bewusst, siehe dort. Die
 * NACHTRÄGE `NACHTRAG_ES2`/`NACHTRAG_FR2` schliessen die Lücke, gegen das
 * ECHTE macOS-Wörterbuch geprüft (`scripts/erzeuge-lexikon-nachtrag-es-fr.mts`).
 * Volle Zahlen: `BEFUND-2026-09-27-LEXIKON-ES-FR.md`.
 *
 * ── Die Schwelle ist eine RATSCHE ────────────────────────────────────────────
 * Gemessen am 27.09.2026 nach den Nachträgen: 9,3 % (es) / 4,4 % (fr) der
 * Korpuszeilen. Die Schwellen unten liegen knapp darüber - wächst der Korpus
 * um Wörter, die weder Lexikon noch Wörterbuch kennen (Eigennamen,
 * Regionalwörter), bleibt etwas Luft; ein echter Rückschritt (z. B. ein neuer
 * Korpus-Text ohne Lexikon-Pflege) reisst die Schwelle trotzdem.
 *
 * ⚠️ Einbuchstabige Tokens („y", „a", „o" auf „es"; „y", „à" auf „fr") zählen
 * NICHT als unbekannt - `buildLexicon` nimmt sie nie auf (Länge ≥ 2), und ein
 * einzelnes Zeichen zu buchstabieren heisst nichts anderes, als es einmal zu
 * sprechen. Siehe `woerterAus`/`unbekannteWoerter` unten - dieselbe Regel wie
 * im Erzeugerskript.
 */
import { describe, expect, it } from "vitest";
import { isRealWord, normalizeWord } from "@/lib/typing/lexicon";
import { CORPUS_ES } from "@/lib/typing/corpusEs";
import { CORPUS_ES_APOSTROF } from "@/lib/typing/corpusEsApostrof";
import { CORPUS_FR } from "@/lib/typing/corpus";
import type { Lang } from "@/lib/typing/account";

/** Schwellen - Ratsche, siehe Kopf-Kommentar. */
const SCHWELLE_ES = 0.1;
const SCHWELLE_FR = 0.05;

function woerterAus(zeile: string): string[] {
  return zeile.split(/\s+/).filter((t) => t.length > 0);
}

/** Hat die Zeile ein Wort (Länge ≥ 2 normalisiert), das `isRealWord` nicht kennt? */
function hatUnbekanntesWort(zeile: string, lang: Lang): boolean {
  return woerterAus(zeile).some((w) => {
    const n = normalizeWord(w, lang);
    return n.length >= 2 && !isRealWord(n, lang);
  });
}

/**
 * ES-T10: Maya-Wörter ohne Apostroph, die in der Apostroph-Charge klein
 * stehen (Sprachnamen und Wörter werden im Spanischen klein geschrieben):
 * „balam" (Jaguar, INAH zu Ek' Balam), „mam" (eine der 22 Maya-Sprachen
 * Guatemalas, Academia de Lenguas Mayas).
 */
const MAYA_WOERTER = new Set(["balam", "mam"]);
/** Unbekannte Wörter einer ES-T10-Zeile, die weder Apostroph-Wort, Name, Code noch benanntes Maya-Wort sind. */
function fremdOhneGrund(zeile: string): string[] {
  const code = /\b(Python|JavaScript|SQL)\b/.test(zeile);
  return woerterAus(zeile)
    .filter((w) => {
      const n = normalizeWord(w, "es");
      if (n.length < 2 || isRealWord(n, "es")) return false;
      if (w.includes("'") || code) return false;
      if (/^["¿¡(]*\p{Lu}/u.test(w)) return false;
      return !MAYA_WOERTER.has(n);
    })
    .map((w) => normalizeWord(w, "es"));
}

function anteilUnbekannt(zeilen: readonly string[], lang: Lang): number {
  if (zeilen.length === 0) return 0;
  const treffer = zeilen.filter((z) => hatUnbekanntesWort(z, lang)).length;
  return treffer / zeilen.length;
}

describe("Lexikon-Deckung des Korpus (es/fr) bleibt unter der Ratschen-Schwelle", () => {
  /**
   * ★ ES-T10 (28.09.2026): die Apostroph-Charge (30 Zeilen) steht AUSSERHALB
   * der Ratsche. Der Apostroph kommt im Spanischen nur in Namen (O'Higgins)
   * und Wörtern indigener Sprachen (Q'eswachaka, k'iche', mba'éichapa) vor -
   * JEDE ihrer Zeilen trägt darum per Bauart ein Wort, das kein Wörterbuch
   * kennt, und hätte die Ratsche allein von 9,2 % auf 10,2 % geschoben (nach
   * der Lexikon-Pflege, gemessen). Für sie gilt stattdessen die strengere
   * Regel darunter: jedes unbekannte Wort ist ein Name oder ein belegtes
   * fremdes Wort - kein vergessenes spanisches.
   */
  it(`"es": Anteil der CORPUS_ES-Zeilen (ohne ES-T10) mit unbekanntem Wort < ${SCHWELLE_ES * 100} %`, () => {
    const apostrof = new Set(CORPUS_ES_APOSTROF.map((it) => it.text));
    const zeilen = CORPUS_ES.map((it) => it.text).filter((t) => !apostrof.has(t));
    expect(zeilen.length).toBeGreaterThan(0);
    const anteil = anteilUnbekannt(zeilen, "es");
    expect(anteil).toBeLessThan(SCHWELLE_ES);
  });

  it('"es", ES-T10: jedes unbekannte Wort ist Apostroph-Wort, Name (gross), Code - oder ein benanntes Maya-Wort', () => {
    const fehler = CORPUS_ES_APOSTROF.flatMap((it) => fremdOhneGrund(it.text).map((w) => `${w}: ${it.text}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it('Gegenprobe "es", ES-T10: ein vergessenes spanisches Wort fällt auf, ein Name nicht', () => {
    expect(fremdOhneGrund("En Cusco tejen un flurzimplonio de ch'ullu.")).toEqual(["flurzimplonio"]);
    expect(fremdOhneGrund("Bernardo O'Higgins llegó a Rancagua.")).toEqual([]);
  });

  it(`"fr": Anteil der CORPUS_FR-Zeilen mit unbekanntem Wort < ${SCHWELLE_FR * 100} %`, () => {
    const zeilen = CORPUS_FR.map((it) => it.text);
    expect(zeilen.length).toBeGreaterThan(0);
    const anteil = anteilUnbekannt(zeilen, "fr");
    expect(anteil).toBeLessThan(SCHWELLE_FR);
  });

  it('Gegenprobe "es": eine erfundene Zeile mit Pseudowort wird als unbekannt erkannt', () => {
    expect(hatUnbekanntesWort("esto es un flurzimplonio inventado", "es")).toBe(true);
  });

  it('Gegenprobe "fr": eine erfundene Zeile mit Pseudowort wird als unbekannt erkannt', () => {
    expect(hatUnbekanntesWort("ceci est un flurzimplonio inventé", "fr")).toBe(true);
  });

  it('Gegenprobe: ein einzelnes bekanntes Wort ("es") zählt nicht als unbekannt', () => {
    expect(hatUnbekanntesWort("la casa es grande", "es")).toBe(false);
  });

  it('Gegenprobe: ein einzelnes bekanntes Wort ("fr") zählt nicht als unbekannt', () => {
    expect(hatUnbekanntesWort("la maison est grande", "fr")).toBe(false);
  });
});
