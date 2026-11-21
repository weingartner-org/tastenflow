/**
 * ★★★★★ EIN EIGENER TEXT IST EIN TEXT - SEINE WÖRTER WERDEN NICHT BUCHSTABIERT
 * (21.09.2026, Sarah, Schülerin mit Blindheit).
 *
 * Johannes: *„die Fremdwörter sind toll, aber eine blinde Schülerin (Sarah) sagt
 * mir, dass viele davon nur mit einzelnen Buchstaben angesagt werden, obwohl
 * Buchstabieren ausgeschaltet wurde. So kann man nicht schreiben."*
 *
 * ── Was gemessen wurde ──────────────────────────────────────────────────────
 * Mit Sarahs Einstellung (Vorlesen an, Wörter und Sätze an, Buchstabieren AUS)
 * wurden von den 240 Fremdwörter-Zeilen **218 (91 %)** mit Einzelbuchstaben
 * angesagt; von 4816 Anschlägen auf Buchstaben waren **2974 (62 %)** nur der
 * einzelne Buchstabe. 347 verschiedene Wörter kannte die App nicht -
 * „Nachschlagewerk", „Gasthaus", „Restaurant", „Hypothese".
 *
 * ── Warum ─────────────────────────────────────────────────────────────────────
 * `readPlanAt` (voice.ts) entscheidet je Wort: „echtes Wort?" (Lexikon) ⇒ ganz
 * sprechen; sonst gilt es als Übungssilbe und wird Buchstabe für Buchstabe
 * gelesen - **unabhängig vom Schalter „Buchstabieren"** (Wunsch für die
 * Grundreihe, 28.08.). Das Lexikon baut sich aber aus dem Übungs-Korpus und
 * den Serien: was dort nie vorkam, ist für die App „kein Wort". Bei einem
 * eigenen Text oder einer Vorlage ist das immer falsch - die Lehrkraft hat
 * Text geschrieben, keine Silben.
 *
 * ── Die Regel ─────────────────────────────────────────────────────────────────
 * Bei „Eigene Übung" und bei der Tippchallenge mit eigener Datei zählen alle
 * Wörter des Textes selbst als Wörter (`zusatzWoerter` an `TypingSession`, wie
 * es die Tippchallenge mit dem Wörterbuch schon tut). Nebenwirkung, gewollt:
 * eine Zeile, deren Wörter alle bekannt sind, wird am Zeilenanfang als GANZES
 * gelesen.
 *
 * ⚠️ AUSNAHME PROGRAMMCODE: Ein Text, der aussieht wie Quelltext, bekommt
 * KEINE Wörter - `lo`, `ValueError`, `memo` sind Bezeichner, keine Wörter, und
 * wer Code tippt, will die Zeichen hören. Erkannt an Einrückung und
 * Code-Zeichen (`{ } ; = _ < > [ ] # / *`) in mindestens einem Viertel der
 * Zeilen. Die Grundreihe (Übungssilben im Lehrgang) ist NICHT betroffen: Sie
 * kommt nicht aus einem eigenen Text und behält ihr Buchstabieren.
 */
import type { Lang } from "./account";
import { normalizeWord } from "./lexicon";

/** Anteil der Zeilen mit Code-Merkmalen, ab dem ein Text als Quelltext gilt. */
export const CODE_ANTEIL = 0.25;

const CODE_ZEICHEN = /[{};=_<>[\]#/*]/;

/** Sieht diese Zeile nach Quelltext aus? (Einrückung oder ein Code-Zeichen) */
function zeileSiehtAusWieCode(zeile: string): boolean {
  return /^\s{2,}\S/.test(zeile) || CODE_ZEICHEN.test(zeile);
}

/** Sieht der ganze Text nach Quelltext aus? */
export function textSiehtAusWieCode(zeilen: readonly string[]): boolean {
  const gefuellt = zeilen.filter((z) => z.trim().length > 0);
  if (gefuellt.length === 0) return false;
  return gefuellt.filter(zeileSiehtAusWieCode).length / gefuellt.length >= CODE_ANTEIL;
}

/**
 * Die Wörter eines eigenen Textes - klein, nur Buchstaben, mindestens zwei -,
 * als Menge für `zusatzWoerter`. Leer bei Quelltext (siehe Dateikopf).
 */
export function woerterAusEigenemText(zeilen: readonly string[], lang?: Lang): ReadonlySet<string> {
  const menge = new Set<string>();
  if (textSiehtAusWieCode(zeilen)) return menge;
  for (const zeile of zeilen) {
    for (const token of zeile.split(/\s+/)) {
      // ★ 26.09.2026: mit Sprache normalisieren - dieselbe Regel wie beim
      // Nachschlagen in `TypingSession` (sonst stünde „élève" als „lve" hier).
      const wort = normalizeWord(token, lang);
      if (wort.length >= 2) menge.add(wort);
    }
  }
  return menge;
}
