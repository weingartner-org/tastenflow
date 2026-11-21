/**
 * Übungsform „Spiegelwörter" - ein Wort, dann dasselbe Wort rückwärts.
 *
 *   Reiter
 *   retieR   ← dieselben Tasten, jede Automatik weg
 *
 * Herkunft: Vorschlag vom 02.09.2026, von Johannes ausgewählt
 * (`VORSCHLAG-2026-09-02-NEUE-UEBUNGSFORMEN.md`, Nr. 1).
 *
 * ★★★ Warum das übt: Vorwärts tippt die Hand SILBEN, die sie kennt - „ei",
 * „ter", „sch" laufen als ein Bewegungsstück durch. Rückwärts zerfällt genau
 * diese Automatik, und übrig bleibt die reine Zuordnung Buchstabe → Finger.
 * Das ist die Stelle, an der ein Kind sonst rät statt zu wissen. Und es ist
 * dieselbe Übung, die kein anderes Wortspiel bietet: Alphabet-Reihen üben
 * Nachbarschaft, Hand-Schwerpunkte eine Hand, hier geht es um die einzelne
 * Taste ohne Kontext.
 *
 * ★★★★ Die Messung, die die Form ihre Gestalt gab: Johannes fragte, ob es
 * überhaupt genug Umkehr-PAARE gibt („Regal"/„Lager"). Über den ganzen
 * Wortschatz gezählt (02.09.2026): **vier deutsche Paare** - `gas/sag`,
 * `eis/sie`, `egal/lage`, `rot/tor` - und **kein einziges englisches**. Als
 * Fundament trägt das nicht. Deshalb braucht diese Form KEIN Paar: Jedes Wort
 * lässt sich rückwärts tippen, und davon gibt es 650 deutsche und 743
 * englische. Die vier Paare stehen unten als seltene Zugabe - wenn eines
 * kommt, ist es eine Überraschung, keine Bedingung.
 */
import { fitText } from "../corpus";
import type { RoundLine } from "../generator";
import type { FormKontext, FormRunde, Uebungsform } from "./typen";
import { erzeugtGesperrt, mischen, nimm, tastenstand, wortpool } from "./hilfen";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";
import { FORM_NAMEN } from "./namen";
import type { Lang } from "../account";

/** Kürzer als vier Buchstaben ist rückwärts keine Übung, länger als acht zäh. */
const MIN_LAENGE = 4;
const MAX_LAENGE = 8;

/** Wie viele Wörter (also doppelt so viele Zeilen) eine Runde höchstens hat. */
const MAX_WOERTER = 8;

/**
 * Die vier deutschen Umkehr-Paare, am 02.09.2026 über den ganzen Wortschatz
 * gemessen - rückwärts ergeben sie wieder ein echtes Wort.
 *
 * Sie sind die Zugabe, nicht der Kern: Kommt eines, sagt die Ansage nichts
 * dazu (das Kind soll es SELBST merken, wenn es die zweite Zeile schreibt -
 * genau darin liegt die kleine Freude). Englisch gibt es keine; die Liste ist
 * deshalb bewusst nur deutsch und nicht nachgebaut.
 */
export const UMKEHR_PAARE_DE: readonly [string, string][] = [
  ["gas", "sag"],
  ["eis", "sie"],
  ["egal", "lage"],
  ["rot", "tor"],
];

/**
 * ★ E10a (25.09.2026, Bauplan §8.1 Punkt 4): dieselbe Zugabe auf Französisch -
 * echte Umkehr-PAARE (zwei verschiedene, echte Wörter), einzeln an
 * Wiktionnaire (fr.wiktionary.org) geprüft am 25.09.2026:
 *  - `les`/`sel` (Artikel Plural / „Salz") - https://fr.wiktionary.org/wiki/les, https://fr.wiktionary.org/wiki/sel
 *  - `mur`/`rum` („Mauer" / Variante von „rhum") - https://fr.wiktionary.org/wiki/mur, https://fr.wiktionary.org/wiki/rum
 *  - `cor`/`roc` (Jagdhorn / Fels) - https://fr.wiktionary.org/wiki/cor, https://fr.wiktionary.org/wiki/roc
 *  - `port`/`trop` (Hafen / „zu viel") - https://fr.wiktionary.org/wiki/port, https://fr.wiktionary.org/wiki/trop
 * Andere Kandidaten aus dem Bauplan-Text (`tel`/`let`) wurden GEPRÜFT und
 * verworfen: „let" ist kein französisches Wort. Reine PALINDROME (été, ici,
 * non, elle, radar, kayak - vorwärts und rückwärts dasselbe Wort) sind hier
 * bewusst NICHT gelistet: Die Grundform der Übung (Wort, dann dasselbe Wort
 * rückwärts) zeigt ein Palindrom ohnehin schon als zwei gleiche Zeilen - ein
 * eigener Eintrag in dieser Zugabe-Liste (die ausdrücklich von ZWEI
 * VERSCHIEDENEN Wörtern handelt, siehe Kopfkommentar) brächte nichts
 * Neues und würde den Unterschied zwischen Palindrom und Umkehrpaar verwischen.
 */
export const UMKEHR_PAARE_FR: readonly [string, string][] = [
  ["les", "sel"],
  ["mur", "rum"],
  ["cor", "roc"],
  ["port", "trop"],
];

/** Ein Wort rückwärts - zeichenweise, damit Umlaute heil bleiben. */
export function rueckwaerts(wort: string): string {
  return [...wort].reverse().join("");
}

/** Bedienung (EN4) - Deutsch wortgleich wie vorher. */
const TEXTE = texte({
  de: { ankuendigung: `Jetzt kommen Spiegelwörter. Erst das Wort, dann dasselbe Wort rückwärts.` },
  en: { ankuendigung: `Now for some backwards words. First the word, then the same word backwards.` },
  // ★ E11a-5 (26.09.2026): Französisch aus der Funktion neu geschrieben (tu, kurz).
  fr: { ankuendigung: `Voici des mots à l'envers. D'abord le mot, puis le même mot à l'envers.` },
  es: { ankuendigung: `Aquí tienes palabras al revés. Primero la palabra, después la misma palabra al revés.` },
  it: { ankuendigung: `Ora tocca alle parole al contrario. Prima la parola, poi la stessa parola al contrario.` },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: { ankuendigung: `Teraz kolej na: Słowa wspak. Najpierw słowo, potem to samo słowo wspak.` },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: { ankuendigung: `Sırada: Ayna kelimeler. Önce kelime, sonra aynı kelime tersten.` },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: { ankuendigung: `Teď: slova pozpátku. Nejdřív slovo, pak stejné slovo pozpátku.` },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: думи наобратно. Първо думата, после същата дума отзад напред.",
  },
  el: {
    ankuendigung: "Τώρα: λέξεις ανάποδα. Πρώτα η λέξη, μετά η ίδια λέξη ανάποδα.",
  },
  hu: {
    ankuendigung: "Most: szavak visszafelé. Először a szó, aztán ugyanaz a szó visszafelé.",
  },
  nl: {
    ankuendigung: "Nu: achterstevoren. Eerst het woord, dan hetzelfde woord achterstevoren.",
  },
  pt: {
    ankuendigung: "Agora: palavras ao contrário. Primeiro a palavra, depois a mesma palavra ao contrário.",
  },
  br: {
    ankuendigung: "Agora: palavras ao contrário. Primeiro a palavra, depois a mesma palavra ao contrário.",
  },
  ro: {
    ankuendigung: "Acum: cuvinte în oglindă. Întâi cuvântul, apoi același cuvânt de la coadă la cap.",
  },
  sv: {
    ankuendigung: "Nu: baklängesord. Först ordet, sedan samma ord baklänges.",
  },
  uk: {
    ankuendigung: "Далі: слова навпаки. Спочатку слово, потім те саме слово задом наперед.",
  },
});

function ankuendigung(ctx: FormKontext): string {
  return TEXTE[bedienSpracheVon(ctx)].ankuendigung;
}

function pool(ctx: FormKontext): string[] {
  // ★ F6-tr (03.10.2026): auch die UMKEHRUNG ist eine erzeugte Zeichenfolge (`kıs` ⇒ `sık`) - Glossar Türkisch §4 Nr. 5.
  return wortpool(ctx, MIN_LAENGE, MAX_LAENGE).filter((w) => !erzeugtGesperrt(ctx.lang, rueckwaerts(w)));
}

function taugt(ctx: FormKontext): boolean {
  return pool(ctx).length >= 3;
}

/**
 * ★ E10a (25.09.2026, Bauplan §8.1 Punkt 3/§2.3 Punkt 3): eine WEG-TABELLE
 * statt der bisherigen Einzel-Abfrage - Englisch hat (gemessen 02.09.2026,
 * siehe Kopfkommentar) KEIN einziges Umkehrpaar und bleibt darum weiter mit
 * einer leeren Liste; „fr" fällt NIE still auf „de" (Bauplan §2.3 Punkt 4) -
 * ohne diesen Eintrag bekäme ein Kind mit Übungssprache Französisch unbemerkt
 * DEUTSCHE Umkehrpaare (`gas`/`sag` …) vorgesetzt, ein Fehler genau der
 * Klasse, vor der der Bauplan warnt. Schlüssel ist bewusst `ctx.lang` (die
 * ÜBUNGSSPRACHE dieser Runde), NICHT `ctx.lernweg` - unverändert gegenüber
 * der bisherigen Abfrage (`ctx.lang === "en"`), denn ein Kind auf Weg „de",
 * das gerade englisch übt (D1), soll weiterhin keine deutschen Umkehrpaare
 * bekommen, obwohl sein Lernweg „de" ist.
 */
const UMKEHR_PAARE_JE_SPRACHE: Record<Lang, readonly [string, string][]> = {
  de: UMKEHR_PAARE_DE,
  en: [],
  fr: UMKEHR_PAARE_FR,
  es: [], // es: LEER (ES-F2) - keine spanischen Umkehrpaare.
  // RÜCKFALL-EN (G2a): it, pl, tr, cs zeigen vorerst Englisch.
  it: [],
  pl: [],
  tr: [],
  cs: [],
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: [],
  el: [],
  hu: [],
  nl: [],
  pt: [],
  br: [],
  ro: [],
  sv: [],
  uk: [],
};

/**
 * Die Paare, die mit diesem Tastenstand vollständig tippbar sind - beide
 * Richtungen, sonst stünde die zweite Zeile mit einer fehlenden Taste da.
 */
function passendePaare(ctx: FormKontext): [string, string][] {
  const allowed = tastenstand(ctx);
  return UMKEHR_PAARE_JE_SPRACHE[ctx.lang]
    .filter(([a, b]) => fitText(a, allowed) === a && fitText(b, allowed) === b)
    .map(([a, b]) => [a, b] as [string, string]);
}

function zeile(text: string): RoundLine {
  return { text, source: null, art: "woerter" };
}

function baue(ctx: FormKontext): FormRunde | null {
  const vorrat = pool(ctx);
  if (vorrat.length < 3) return null;

  // Zwei Zeilen je Wort - deshalb halb so viele Wörter wie gewünschte Zeilen.
  const anzahl = Math.max(2, Math.min(MAX_WOERTER, Math.ceil(ctx.count / 2)));

  // Höchstens EIN Paar je Runde: Es ist die Zugabe, nicht das Thema.
  const paare = mischen(passendePaare(ctx), ctx.zufall);
  const gesetzt = paare.length > 0 && ctx.zufall() < 0.5 ? [paare[0][0]] : [];

  const rest = nimm(
    vorrat.filter((w) => !gesetzt.includes(w)),
    anzahl - gesetzt.length,
    ctx.zufall,
  );

  const zeilen: RoundLine[] = [];
  for (const wort of [...gesetzt, ...rest]) {
    zeilen.push(zeile(wort));
    zeilen.push(zeile(rueckwaerts(wort)));
  }
  return { zeilen };
}

export const spiegelwoerter: Uebungsform = {
  id: "spiegelwoerter",
  name: FORM_NAMEN.de.spiegelwoerter,
  ankuendigung,
  taugt,
  baue,
};
