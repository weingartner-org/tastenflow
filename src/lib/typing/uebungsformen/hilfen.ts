/**
 * Kleine Helfer, die MEHRERE Übungsformen brauchen.
 *
 * ⚠️ Die Formen der ersten Charge (Alphabet-Reihen, Pyramide, Wandernder
 * Großbuchstabe, Hand-Schwerpunkte) tragen jede ihre eigene Kopie von
 * `tastenstand`/`mischen`. Das ist historisch: Sie entstanden alle am selben
 * Abend, jede für sich. Diese Datei ist NICHT die zweite Stelle daneben,
 * sondern der Ort, an dem die neuen Formen sie EINMAL haben - wer die alten
 * anfasst, zieht sie hierher nach.
 */
import { fitText, korpusFuer, type CorpusItem } from "../corpus";
import { kleinFuer } from "../sprachRegister";
import { SHIFT_UNIT } from "../letters";
import { WORDS } from "../words";
import { WORDS_EN } from "../corpusEn";
import { WORDS_FR } from "../wordsFr";
import { WORDS_ES } from "../wordsEs";
import { WORDS_IT } from "../wordsIt";
import { WORDS_PL } from "../wordsPl";
import { WORDS_TR } from "../wordsTr";
import { gesperrtGefaltetTr } from "../sperrlisteTr";
import { gesperrtIt } from "../sperrlisteIt";
import { gesperrtPl } from "../sperrlistePl";
import { gesperrtCs } from "../sperrlisteCs";
import { WORDS_CS } from "../wordsCs";
// ★ G3c-VERTEILER (25.10.2026): Wörter und Sperrlisten der neun Gerüst-Wege (leer ⇒ Englisch bzw. keine Sperre).
import { GERUEST_GESPERRT, GERUEST_WORDS } from "../geruestWoerter";
import { eigenOderEn } from "../geruestRueckfall";
import { wandleSchreibweise } from "../schreibweise";
import type { Lang } from "../account";
import type { FormKontext } from "./typen";

/**
 * Sind alle zehn Ziffern frei? Vorher darf keine Form Ziffern verlangen - und
 * seit dem 11.09.2026 auch keine Ziffern ZEIGEN, wo verglichen wird (Johannes:
 * „ja, erst ab Ziffernreihe" für „Was fehlt hier?"). Kam aus `zahlendiktat.ts`
 * hierher, weil jetzt zwei Formen dieselbe Frage stellen.
 */
export function ziffernFrei(ctx: FormKontext): boolean {
  const stand = new Set(ctx.introduced);
  return "0123456789".split("").every((z) => stand.has(z));
}

/**
 * Ab so vielen möglichen Aufgaben bietet sich eine Rätsel-Form an. Johannes
 * 11.09.2026: „auf 5" - gemessen liefert jede Form auf jedem Stand mindestens
 * fünf; die Schwelle soll etwas bedeuten, nicht nur dastehen. Eine Runde aus
 * drei Aufgaben wäre kurz, aus einer eine Schleife (Testerin, 04.09.2026).
 */
export const MINDEST_AUFGABEN = 5;

/** Die freigeschalteten Tasten OHNE die Umschalt-Einheit. */
export function tastenstand(ctx: FormKontext): Set<string> {
  return new Set(ctx.introduced.filter((einheit) => einheit !== SHIFT_UNIT));
}

/** Mischt eine Liste mit dem hereingereichten Zufall (nie mit `Math.random`). */
export function mischen<T>(arr: readonly T[], zufall: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(zufall() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Der Wortvorrat je Sprache - dieselbe Quelle wie in den übrigen Formen.
 *
 * ★ E10b (25.09.2026, Bauplan französischer Lehrgang §2.3 Punkt 4): eine
 * TABELLE statt der Zwei-Wege-Ternäre (`WORDS_EN` für „en", sonst `WORDS`) -
 * die Ternäre gab für „fr" still die deutsche Liste zurück. Fehlt künftig
 * eine Sprache, meldet es `tsc`.
 */
// ★ ES-F6 (27.09.2026): WORDS_ES (wordsEs.ts) - vorher LEER (ES-F2), die Form
// bot sich für Weg "es" darum gar nicht an, statt Deutsch/Englisch zu zeigen
// (Falle 19).
const WORTQUELLE: Record<Lang, readonly string[]> = {
  de: WORDS,
  en: WORDS_EN,
  fr: WORDS_FR,
  es: WORDS_ES,
  // ★ F6-it (02.10.2026): der echte italienische Wortschatz (`wordsIt.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  it: WORDS_IT,
  // ★ F6-pl (03.10.2026): der echte polnische Wortschatz (`wordsPl.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  pl: WORDS_PL,
  // ★ F6-tr (03.10.2026): der echte türkische Wortschatz (`wordsTr.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  tr: WORDS_TR,
  // ★ F6-cs (03.10.2026): der echte tschechische Wortschatz (`wordsCs.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  cs: WORDS_CS,
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  // ★ G3c-VERTEILER (25.10.2026): jede liest schon ihre eigene Datei (`words<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  bg: eigenOderEn(GERUEST_WORDS.bg, WORDS_EN),
  el: eigenOderEn(GERUEST_WORDS.el, WORDS_EN),
  hu: eigenOderEn(GERUEST_WORDS.hu, WORDS_EN),
  nl: eigenOderEn(GERUEST_WORDS.nl, WORDS_EN),
  pt: eigenOderEn(GERUEST_WORDS.pt, WORDS_EN),
  br: eigenOderEn(GERUEST_WORDS.br, WORDS_EN),
  ro: eigenOderEn(GERUEST_WORDS.ro, WORDS_EN),
  sv: eigenOderEn(GERUEST_WORDS.sv, WORDS_EN),
  uk: eigenOderEn(GERUEST_WORDS.uk, WORDS_EN),
};

export function wortquelle(lang: Lang): readonly string[] {
  return WORTQUELLE[lang];
}

/**
 * Der Korpus je Sprache für die Formen, die ganze Sätze nehmen („Lang und
 * Ersatz", „Was fehlt?"). ★ E10b: vorher stand in beiden Formen
 * die Zwei-Wege-Ternäre (`CORPUS_EN` für „en", sonst `CORPUS`) - für „fr"
 * still der deutsche Korpus. ★ E10b-2 (26.09.2026): die französischen Texte
 * stehen (E8/E9) - „fr" liest jetzt `CORPUS_FR`.
 */
// ★ ES-F5 (27.09.2026): CORPUS_ES vorbereitet.
// ★★ 28.09.2026: Hier stand eine DRITTE Kopie der Sprach-Tabelle - und zwar auf
// oberster Ebene: Sie hielt die Listen des Ladezeitpunkts fest. Seit die Texte
// nachgeladen werden (`sprachpakete.ts`), wären das leere Listen gewesen.
// Jetzt fragt sie dieselbe Weiche wie `corpusItemsFor` und `corpusEntriesFor`.
export function korpusQuelle(lang: Lang): readonly CorpusItem[] {
  return korpusFuer(lang, "korpusQuelle");
}

/**
 * ★★★ F6-tr (03.10.2026, Glossar Türkisch §4 Nr. 5/6, Leitfaden Falle 88): ist diese ERZEUGTE Zeichenfolge in der Übungssprache
 * gesperrt? Eine Wortliste ohne Sperrwort garantiert nicht, dass ein Anfang (Pyramide: `göt` aus `götürmek`), eine Umkehrung
 * (Spiegelwörter: `kıs` ⇒ `sık`) oder eine Mischung eines ihrer Wörter keines ist. Eine TABELLE je Sprache (Falle 50): heute trägt nur
 * Türkisch eine Prüfung (richtig UND gefaltet: `ı→i ş→s …`); alle anderen Sprachen liefern `false`, ihre Formen bleiben Byte für Byte.
 * ★ IT-W (03.10.2026): dazu Italienisch (`gesperrtIt`, Kern UND Wortbasis - eine Pyramidenstufe ist ein Wort in einer
 * Übungsreihe wie in einer Wortliste): gemessen an `WORDS_IT` + `STUFE_VOCAB_IT` (03.10.2026) zeigte die Pyramide sonst
 * `matti` (aus `mattina`, `mattino`) und `matto` (aus `mattone`) als eigene Stufe; keine Umkehrung traf (Befund IT-W §2).
 * Ein künftiges `monaco` fiele ebenso (`mona`).
 * ★ PL-W (09.10.2026): dazu Polnisch (`gesperrtPl`, Kern UND Wortbasis, mit und ohne Ogonki verglichen). Gemessen über alle
 * Formen, acht Stände, drei Stufen und sechs Samen (Wächter `tests/tastenflow-wortspiele-pl.test.ts`): heute trifft KEIN erzeugtes
 * Wort - die Prüfung steht als Netz da, für die Wörter, die die Text-Chargen noch in `WORDS_PL`/`STUFE_VOCAB_PL` bringen
 * (ein künftiges `jajami` gäbe sonst die Pyramidenstufe `jaja`).
 * ★ CS-W (09.10.2026): dazu Tschechisch (`gesperrtCs`, Kern UND Wortbasis, MIT Háček und Čárka verglichen). Gemessen OHNE dieses
 * Netz über alle Formen, zehn Stände, drei Stufen, sechs Samen und beide Tastaturen (Wächter `tests/tastenflow-wortspiele-cs.test.ts`):
 * heute trifft KEIN erzeugtes Wort - die Prüfung steht als Netz für künftige Wortlisten da.
 */
// ★ G3c-VERTEILER (25.10.2026): dazu die neun Gerüst-Wege mit ihrer eigenen Sperrliste (`sperrliste<Xx>.ts`) - heute leer, also für jedes
// Wort `false`, genau wie vorher ohne Eintrag.
const ERZEUGT_GESPERRT: Readonly<Partial<Record<Lang, (text: string) => boolean>>> = { tr: gesperrtGefaltetTr, it: gesperrtIt, pl: gesperrtPl, cs: gesperrtCs, ...GERUEST_GESPERRT };

export function erzeugtGesperrt(lang: Lang, text: string): boolean {
  const pruefung = ERZEUGT_GESPERRT[lang];
  return pruefung !== undefined && pruefung(text);
}

/**
 * Kleingeschriebene, mit diesem Tastenstand tippbare Wörter einer Länge.
 *
 * Ohne `ß`: Auf englischen und Schweizer Tastaturen wird es ersetzt, und eine
 * Form, die Buchstaben zählt oder umdreht, käme dabei durcheinander.
 */
export function wortpool(
  ctx: FormKontext,
  min: number,
  max: number,
): string[] {
  const allowed = tastenstand(ctx);
  const gesehen = new Set<string>();
  const out: string[] = [];
  for (const roh of wortquelle(ctx.lang)) {
    const wortGb = kleinFuer(roh, ctx.lang);
    // ★ E9 (24.09.2026, Bauplan §8.2): die Schreibweise VOR der Längen-/
    // Tastenprüfung anwenden - anders als beim Korpus (siehe corpus.ts) gibt
    // es hier kein Ledger, das an der britischen Form hängen könnte. Ein
    // Wortspiel darf darum das WIRKLICH SERVIERTE Wort prüfen.
    const wort =
      ctx.lang === "en" && ctx.variante === "us"
        ? wandleSchreibweise(wortGb, "us")
        : wortGb;
    if (wort.length < min || wort.length > max) continue;
    if (wort.includes("ß") || wort.includes(" ") || wort.includes("-")) continue;
    if (erzeugtGesperrt(ctx.lang, wort)) continue;
    if (gesehen.has(wort)) continue;
    if (fitText(wort, allowed) === null) continue;
    gesehen.add(wort);
    out.push(wort);
  }
  return out;
}

/**
 * Nimmt so lange aus dem Vorrat, bis `anzahl` Stück beisammen sind - und
 * mischt neu, wenn er leer wird.
 *
 * Warum kein einfaches `slice`: Eine Runde kann länger sein als der Vorrat
 * (ein Kind mit wenigen Tasten hat vielleicht acht Wörter). Ohne Nachfüllen
 * käme dann eine zu kurze Runde heraus - und eine zu kurze Runde sieht aus
 * wie ein Fehler, nicht wie ein knapper Tastenstand.
 */
export function nimm(vorrat: readonly string[], anzahl: number, zufall: () => number): string[] {
  if (vorrat.length === 0) return [];
  const out: string[] = [];
  let topf = mischen(vorrat, zufall);
  let i = 0;
  while (out.length < anzahl) {
    if (i >= topf.length) {
      topf = mischen(vorrat, zufall);
      i = 0;
    }
    out.push(topf[i]);
    i += 1;
  }
  return out;
}
