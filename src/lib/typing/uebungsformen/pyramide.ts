/**
 * Übungsform „Pyramidenwörter" - ein Wort wird Stufe für Stufe aufgebaut, jede
 * Stufe eine eigene Tippzeile:
 *
 *   K
 *   Ka
 *   Kas
 *   Kass
 *   Kasse
 *
 * Bei Pyramidensätzen wächst statt eines Wortes ein ganzer Satz, Wort für
 * Wort: „Die" / „Die Katze" / „Die Katze schläft".
 *
 * Herkunft: eine der Übungsformen aus Testerin Mail (Kollegin, dieselbe
 * Zielgruppe), am 01.09.2026 mit Johannes durchgesprochen
 * (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md` §4). Johannes hat den
 * BILDSCHIRM (die gemauerte Pyramide) am 01.09.2026 abgenommen - Wort von
 * Testerin: die Stufen sind „Steine". Der Bildschirm liegt NICHT in dieser Datei.
 *
 * ★★★ Die Regel dahinter: **die Grafik darf nie die Aufgabe tragen.** Die
 * gemauerte Pyramide ist eine kostenlose Dreingabe für Sehende - die Aufgabe
 * bleibt streng Zeile für Zeile lösbar, genau wie jede andere Runde. Deshalb
 * liefert `baue` ZEILEN wie jede andere Form, und den Schmuck (`pyramiden`)
 * getrennt daneben; `pyramiden.flat()` muss exakt `zeilen.map(z => z.text)`
 * ergeben - daran hängt der Bildschirm ab, welche Zeile zu welcher Stufe
 * gehört.
 *
 * ★ Entscheidung (hier getroffen, stand nicht im Auftrag): **Anzahl und
 * Größe der Pyramiden werden OHNE Zufall geplant** (`planPyramiden` unten) -
 * nur aus den Wort-/Satz-VORRÄTEN, die der Tastenstand hergibt. `ctx.zufall()`
 * entscheidet erst danach, WELCHES Wort/welcher Satz eine schon geplante
 * Größe füllt. Grund: `ankuendigung` nennt die Anzahl auf der Karte, BEVOR
 * `baue` überhaupt läuft - ohne diese Trennung könnte ein `ctx.zufall()`-
 * Aufruf in der Ankündigung den Zufallsstrom für `baue` verschieben und die
 * angesagte Zahl von der tatsächlich gebauten Pyramidenzahl abweichen lassen.
 * So bleibt die Zahl auf der Karte IMMER die Zahl, die am Ende steht.
 *
 * ★ Wortquelle: derselbe Wortschatz wie beim Wort-Drill des Generators
 * (`words.ts`/`corpusEn.ts` + der stufen-getaggte Bonus-Wortschatz aus
 * `corpusExtras.ts`/`corpusEn.ts`) - kein eigener Pyramiden-Wortschatz. Ein
 * Wort wird nur verwendet, wenn `fitText` JEDE seiner Stufen (jedes Präfix,
 * vom ersten Buchstaben bis zum ganzen Wort) gegen den Tastenstand bestehen
 * lässt - nicht nur das fertige Wort. Satzpyramiden kommen ausschließlich aus
 * dem geprüften Korpus (`kind: "satz"`), aus demselben Grund stufenweise
 * geprüft.
 *
 * ★ Großschreibung: Ein deutsches Nomen wird von der ersten Stufe an korrekt
 * großgeschrieben (Auto-Großschreibung, siehe `corpus.ts`/`fitText` - ein
 * Großbuchstabe ist immer tippbar, sobald seine Kleinbuchstaben-Taste frei
 * ist). Englische Wörter bleiben durchgehend klein, wie beim Generator.
 *
 * ★ Sehr kleiner Tastenstand (nur die Grundreihe): `taugt` rechnet die Frage
 * „gibt es ein passendes Wort mit 4-8 Stufen" tatsächlich aus - es wird nicht
 * geraten. Auf reiner Grundreihe (f j d k s l a ö) passt zum Beispiel „Fall"
 * (4 Stufen), auf noch kleineren Ständen kann der Vorrat leer sein - dann
 * taugt die Form nicht und wird nicht angeboten.
 */
import type { RoundLine } from "../generator";
import { corpusItemsFor, fitText, nurKleinschrift } from "../corpus";
import { grossFuer, kleinFuer } from "../sprachRegister";
import { toLayoutText } from "../layouts";
import { isNoun } from "../words";
import { STUFE_VOCAB_EN } from "../corpusEn";
import { STUFE_VOCAB } from "../corpusExtras";
import { STUFE_VOCAB_CS } from "../wordsCs";
import { STUFE_VOCAB_IT } from "../wordsIt";
import { STUFE_VOCAB_PL } from "../wordsPl";
import { contentStufenFor } from "../account";
import type { Lang, Stufe } from "../account";
import { wandleSchreibweise } from "../schreibweise";
import type { FormKontext, FormRunde, Uebungsform } from "./typen";
import { mehrzahl, texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";
import { FORM_NAMEN } from "./namen";
import { erzeugtGesperrt, wortquelle } from "./hilfen";
import { STUFE_VOCAB_TR } from "../wordsTr";
// ★ G3c-VERTEILER (25.10.2026): der Themenwortschatz der neun Gerüst-Wege (`words<Xx>.ts`) - leer ⇒ Englisch.
import { GERUEST_STUFE_VOCAB } from "../geruestWoerter";
import { stufenOderEn } from "../geruestRueckfall";
import { zahlwortFr } from "../zahlwort";

/** Wörter mit weniger Stufen sind zu kurz für eine Pyramide (kein Aufbau). */
const WORD_MIN = 4;
/** Wörter mit mehr Stufen langweilen (zu lange Pyramide). */
const WORD_MAX = 8;
/** Sätze mit weniger Wörtern sind kein richtiger Satzaufbau. */
const SATZ_MIN = 3;
/** Sätze mit mehr Wörtern sprengen die Runde. */
const SATZ_MAX = 6;

/* ── Wortschatz-Zugriff (derselbe wie im Generator, siehe Kopf-Kommentar) ──*/

/**
 * ★ E10b (25.09.2026, Bauplan französischer Lehrgang §2.3 Punkt 4): Tabellen
 * statt der Zwei-Wege-Ternäre (nur „en" oder sonst Deutsch) - beide gaben
 * für „fr" still den deutschen Wortschatz zurück. Die Grundliste kommt aus
 * `wortquelle()` (`hilfen.ts`); einen Stufen-Wortschatz hat Französisch noch
 * nicht (kommt mit den Texten, E8/E9) - bis dahin leer, nie Deutsch.
 */
const STUFEN_WORTSCHATZ: Record<Lang, Record<string, string[]>> = {
  de: STUFE_VOCAB,
  en: STUFE_VOCAB_EN,
  fr: {},
  es: {}, // es: LEER (ES-F2), aus demselben Grund wie "fr" oben.
  // ★ IT-W (03.10.2026): der italienische Themenwortschatz (`wordsIt.ts`) - vorher das Englische: die Pyramide von
  // `it` mischte italienische und englische Wörter (die Lücke, die Befund F5-F8-TR §4 Nr. 7 nannte).
  it: STUFE_VOCAB_IT,
  // ★ PL-W (09.10.2026): der polnische Themenwortschatz (`wordsPl.ts`) - vorher das Englische: die Pyramide von `pl`
  // mischte polnische (`wortquelle`) und englische Wörter.
  pl: STUFE_VOCAB_PL,
  // ★ F6-tr (03.10.2026): der türkische Themenwortschatz (`wordsTr.ts`) - vorher das Englische: die Pyramide von `tr` mischte türkische
  // und englische Wörter. (`it` hatte dieselbe Lücke - seit IT-W geschlossen, siehe oben.)
  tr: STUFE_VOCAB_TR,
  // ★ F6-cs (03.10.2026): der Themenwortschatz der Sprache (`wordsCs.ts`) - die Pyramide nimmt ihre Wörter aus `wortquelle()` UND hier; mit dem
  // englischen stünden englische Wörter in einer tschechischen Pyramide.
  cs: STUFE_VOCAB_CS,
  // ★ G3c-VERTEILER (25.10.2026): jede liest schon ihre eigene Datei (`words<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  bg: stufenOderEn(GERUEST_STUFE_VOCAB.bg, STUFE_VOCAB_EN),
  el: stufenOderEn(GERUEST_STUFE_VOCAB.el, STUFE_VOCAB_EN),
  hu: stufenOderEn(GERUEST_STUFE_VOCAB.hu, STUFE_VOCAB_EN),
  nl: stufenOderEn(GERUEST_STUFE_VOCAB.nl, STUFE_VOCAB_EN),
  pt: stufenOderEn(GERUEST_STUFE_VOCAB.pt, STUFE_VOCAB_EN),
  br: stufenOderEn(GERUEST_STUFE_VOCAB.br, STUFE_VOCAB_EN),
  ro: stufenOderEn(GERUEST_STUFE_VOCAB.ro, STUFE_VOCAB_EN),
  sv: stufenOderEn(GERUEST_STUFE_VOCAB.sv, STUFE_VOCAB_EN),
  uk: stufenOderEn(GERUEST_STUFE_VOCAB.uk, STUFE_VOCAB_EN),
};

function stufenWortschatz(lang: Lang, stufe: Stufe): string[] {
  const tabelle = STUFEN_WORTSCHATZ[lang];
  const etiketten = contentStufenFor(stufe);
  return [...new Set(etiketten.flatMap((e) => tabelle[e] ?? []))];
}

/* ── Stufen aus einem fertigen Wort/Satz bauen ─────────────────────────────*/

/** Die Stufen eines Wortpyramiden-Worts: „K", „Ka", „Kas" … bis zum ganzen Wort. */
function stufenEinesWorts(wort: string): string[] {
  const stufen: string[] = [];
  for (let n = 1; n <= wort.length; n++) stufen.push(wort.slice(0, n));
  return stufen;
}

/** Die Stufen eines Satzpyramiden-Satzes: „Die", „Die Katze" … der ganze Satz. */
function stufenEinesSatzes(satz: string): string[] {
  const woerter = satz.split(/\s+/).filter(Boolean);
  const stufen: string[] = [];
  for (let n = 1; n <= woerter.length; n++) stufen.push(woerter.slice(0, n).join(" "));
  return stufen;
}

/* ── Kandidaten-Vorräte, nach STUFENZAHL gruppiert (kein Zufall) ──────────*/

/**
 * ★ G2b-1 (02.10.2026, Befund G1c §3 Nr. 4): welche Wörter „reine Buchstabenwörter"
 * sind - je Sprache EIN Eintrag (`tsc` verlangt ihn für jede neue Sprache).
 * it, pl, tr, cs: JEDER Buchstabe (`\p{L}`), keine Liste von Sonderbuchstaben.
 * de, en, fr, es: die Klasse von vorher, Byte für Byte - die Golden-Tests
 * (`tastenflow-lernweg-inhalt-es-unveraendert`) halten die Pyramide fest.
 * ⚠️ BEFUND (nicht behoben, weil der Golden-Satz es verbietet): die Klasse für
 * „es" kennt ñ á í ó ú nicht - spanische Wörter mit ihnen fallen aus der
 * Pyramide (G1c §1.3 Nr. 8). Die Behebung ist `/^\p{L}+$/u` und ändert den
 * Golden-Satz „inhalt-es" bewusst; das entscheidet der Chat.
 */
const KLASSE_ALT = /^[a-zäöüßàâçéèêëïîôùû]+$/;
const KLASSE_ALLE = /^\p{L}+$/u;
const REINE_BUCHSTABEN: Record<Lang, RegExp> = {
  de: KLASSE_ALT, en: KLASSE_ALT, fr: KLASSE_ALT, es: KLASSE_ALT,
  it: KLASSE_ALLE, pl: KLASSE_ALLE, tr: KLASSE_ALLE, cs: KLASSE_ALLE,
  bg: KLASSE_ALLE,
  el: KLASSE_ALLE,
  hu: KLASSE_ALLE,
  nl: KLASSE_ALLE,
  pt: KLASSE_ALLE,
  br: KLASSE_ALLE,
  ro: KLASSE_ALLE,
  sv: KLASSE_ALLE,
  uk: KLASSE_ALLE /* G2-NEUN: jeder Buchstabe */,
};

/**
 * Wortpyramiden-Kandidaten, gruppiert nach Stufenzahl (= Wortlänge). Ein Wort
 * qualifiziert sich nur, wenn JEDE seiner Stufen den Tastenstand besteht -
 * `fitText` entscheidet, Stufe für Stufe, nie nur das fertige Wort.
 */
function wortPool(ctx: FormKontext, allowed: Set<string>): Map<number, string[]> {
  const roh = [...wortquelle(ctx.lang), ...stufenWortschatz(ctx.lang, ctx.stufe)];
  const gesehen = new Set<string>();
  const pool = new Map<number, string[]>();
  const varianteAn = ctx.lang === "en" && ctx.variante === "us";
  for (const eintrag of roh) {
    // ★ E10: Schreibweise VOR der Buchstaben-/Tastenprüfung (wie `wortpool` in
    // `hilfen.ts`) - jede Stufe der Pyramide baut dann auf der wirklich
    // gezeigten Form auf.
    const wortRoh = kleinFuer(eintrag, ctx.lang);
    const wort = toLayoutText(varianteAn ? wandleSchreibweise(wortRoh, "us") : wortRoh);
    // Nur reine Buchstabenwörter - mit den französischen Akzentbuchstaben
    // (E10b); für Deutsch und Englisch ändert das nichts, dort ist keiner
    // dieser Buchstaben je freigeschaltet (`fitText` unten).
    if (!REINE_BUCHSTABEN[ctx.lang].test(wort)) continue;
    if (wort.length < WORD_MIN || wort.length > WORD_MAX) continue;
    // ★ D-2 (28.09.2026): Erwachsene vor ⇧ - Nomen klein (`nurKleinschrift`).
    const angezeigt =
      ctx.lang === "de" && isNoun(wort) && !nurKleinschrift(ctx.stufe, ctx.shift)
        ? grossFuer(wort[0], ctx.lang) + wort.slice(1)
        : wort;
    if (gesehen.has(angezeigt)) continue;
    const stufen = stufenEinesWorts(angezeigt);
    if (!stufen.every((s) => fitText(s, allowed, undefined, ctx.lang) === s)) continue;
    // ★ F6-tr: JEDE Stufe der Pyramide ist eine erzeugte Zeichenfolge (`seksen` ⇒ `seks`, `çukur` ⇒ `çuk`, `ocak` ⇒ `oc`).
    if (stufen.some((s) => erzeugtGesperrt(ctx.lang, s))) continue;
    gesehen.add(angezeigt);
    const liste = pool.get(angezeigt.length) ?? [];
    liste.push(angezeigt);
    pool.set(angezeigt.length, liste);
  }
  return pool;
}

/**
 * Satzpyramiden-Kandidaten, gruppiert nach Stufenzahl (= Wortzahl) - nur echte
 * Sätze (`kind: "satz"`) aus dem geprüften Korpus, jede Stufe einzeln gegen
 * den Tastenstand geprüft (Satzzeichen mitten im Satz könnten sonst in einer
 * frühen Stufe auftauchen, bevor sie gelernt sind).
 */
function satzPool(ctx: FormKontext, allowed: Set<string>): Map<number, string[]> {
  const saetze = corpusItemsFor({
    stufe: ctx.stufe,
    allowed,
    kinds: ["satz"],
    lang: ctx.lang,
    // ★ E6a (24.09.2026): der Lernweg des Kindes - `FormKontext` kennt ihn
    // jetzt (Bauplan §6.3 "Wortspiele: Gate über den Weg"). Vorher stand hier
    // ausdrücklich „de" (E4a); auf Weg „en" hätte das sonst nurWeg-„en"-Sätze
    // NIE gezeigt und ihm stattdessen die falschen nurWeg-„de"-Sätze verweigert.
    lernweg: ctx.lernweg,
    // ★ E10: die Schreibweise wie überall über `corpusItemsFor` (§8.2) - dort
    // erst NACH `fitText` angewandt, dieselbe Reihenfolge wie im gewöhnlichen
    // Übungslauf.
    variante: ctx.variante,
    // ★ E10d (26.09.2026, Bauplan §10.1/§1.2 F8): dasselbe für die
    // französische Landesvariante - `ctx.franzVariante` ist bisher NUR im
    // Zahlendiktat gesetzt (siehe `typen.ts`), ein Aufruf ohne sie liefert
    // weiter unverändert die FR/BE/CH-Grundform.
    franzVariante: ctx.franzVariante,
    // ★ ES-F7 (27.09.2026): dieselbe Weitergabe für die spanische
    // Landesvariante (Falle 40 - ALLE Aufrufer, nicht nur die in generator.ts).
    esVariante: ctx.esVariante,
    // ★ D-2 (28.09.2026): Erwachsene vor ⇧ - nur Sätze ohne Grossbuchstaben.
    umschalt: ctx.shift,
  });
  const pool = new Map<number, string[]>();
  for (const satz of saetze) {
    const woerter = satz.split(/\s+/).filter(Boolean);
    if (woerter.length < SATZ_MIN || woerter.length > SATZ_MAX) continue;
    const stufen = stufenEinesSatzes(satz);
    if (!stufen.every((s) => fitText(s, allowed, undefined, ctx.lang) === s)) continue;
    const liste = pool.get(woerter.length) ?? [];
    liste.push(satz);
    pool.set(woerter.length, liste);
  }
  return pool;
}

/** Die beiden Vorräte für einen Tastenstand - einmal berechnet, zweimal gebraucht. */
function sammleQuellen(ctx: FormKontext): {
  woerter: Map<number, string[]>;
  saetze: Map<number, string[]>;
} {
  const allowed = new Set(ctx.introduced);
  return { woerter: wortPool(ctx, allowed), saetze: satzPool(ctx, allowed) };
}

/* ── Planung: WIE VIELE Pyramiden, WELCHE Größe - ohne Zufall ─────────────*/

interface PlanEintrag {
  art: "woerter" | "text";
  groesse: number;
}

/**
 * Sucht in `pool` die nächste verfügbare Größe zwischen `min` und `max`, bei
 * `index` beginnend (rotierend, für Abwechslung zwischen den Pyramiden einer
 * Runde) - `reserviert` zählt mit, wie viele Kandidaten dieser Größe der Plan
 * schon verplant hat, damit `baue` später garantiert einen freien findet.
 */
function naechsteGroesse(
  art: PlanEintrag["art"],
  pool: Map<number, string[]>,
  reserviert: Map<number, number>,
  min: number,
  max: number,
  index: number,
): PlanEintrag | null {
  const spanne = max - min + 1;
  for (let offset = 0; offset < spanne; offset++) {
    const groesse = min + ((index + offset) % spanne);
    const verfuegbar = pool.get(groesse)?.length ?? 0;
    const schon = reserviert.get(groesse) ?? 0;
    if (schon < verfuegbar) {
      reserviert.set(groesse, schon + 1);
      return { art, groesse };
    }
  }
  return null;
}

/**
 * OHNE Zufall geplant (siehe Kopf-Kommentar): wie viele Pyramiden werden es,
 * und welche Größe (Stufenzahl) hat jede. Jede dritte Pyramide wird ein Satz,
 * WENN der Vorrat das hergibt - sonst bleibt es bei Wortpyramiden.
 */
function planPyramiden(
  ctx: FormKontext,
  woerterNachGroesse: Map<number, string[]>,
  saetzeNachGroesse: Map<number, string[]>,
): PlanEintrag[] {
  const satzMoeglich = saetzeNachGroesse.size > 0;
  const wortReserviert = new Map<number, number>();
  const satzReserviert = new Map<number, number>();
  const plan: PlanEintrag[] = [];
  let summe = 0;
  let index = 0;
  // Wächter gegen eine Endlosschleife - bei leeren Vorräten bricht die
  // Schleife ohnehin über `!eintrag` ab, das hier ist nur ein zusätzliches Netz.
  while (summe < ctx.count && index < 200) {
    let eintrag: PlanEintrag | null = null;
    if (satzMoeglich && index % 3 === 2) {
      eintrag = naechsteGroesse("text", saetzeNachGroesse, satzReserviert, SATZ_MIN, SATZ_MAX, index);
    }
    if (!eintrag) {
      eintrag = naechsteGroesse("woerter", woerterNachGroesse, wortReserviert, WORD_MIN, WORD_MAX, index);
    }
    if (!eintrag && satzMoeglich) {
      eintrag = naechsteGroesse("text", saetzeNachGroesse, satzReserviert, SATZ_MIN, SATZ_MAX, index);
    }
    if (!eintrag) break; // Vorrat erschöpft - lieber weniger Pyramiden als Wiederholung
    plan.push(eintrag);
    summe += eintrag.groesse;
    index++;
  }
  return plan;
}

/* ── Realisierung: WELCHES Wort/welcher Satz - hier erst kommt der Zufall ──*/

/** Zieht ein noch nicht benutztes Element aus `liste`, per `zufall()` (0..1). */
function fuelleZufall<T>(liste: T[], benutzt: Set<T>, zufall: () => number): T | undefined {
  const frei = liste.filter((x) => !benutzt.has(x));
  if (frei.length === 0) return undefined;
  const i = Math.min(frei.length - 1, Math.floor(zufall() * frei.length));
  const wahl = frei[i];
  benutzt.add(wahl);
  return wahl;
}

function baueRunde(ctx: FormKontext): FormRunde | null {
  const { woerter, saetze } = sammleQuellen(ctx);
  const plan = planPyramiden(ctx, woerter, saetze);
  if (plan.length === 0) return null;

  const benutzteWoerter = new Set<string>();
  const benutzteSaetze = new Set<string>();
  const zeilen: RoundLine[] = [];
  const pyramiden: string[][] = [];

  for (const eintrag of plan) {
    if (eintrag.art === "woerter") {
      const wort = fuelleZufall(woerter.get(eintrag.groesse) ?? [], benutzteWoerter, ctx.zufall);
      if (!wort) continue; // sollte wegen der Planung (Reservierung) nicht vorkommen
      const stufen = stufenEinesWorts(wort);
      pyramiden.push(stufen);
      for (const text of stufen) zeilen.push({ text, source: null, art: "woerter" });
    } else {
      const satz = fuelleZufall(saetze.get(eintrag.groesse) ?? [], benutzteSaetze, ctx.zufall);
      if (!satz) continue;
      const stufen = stufenEinesSatzes(satz);
      pyramiden.push(stufen);
      for (const text of stufen) zeilen.push({ text, source: null, art: "text" });
    }
  }

  return pyramiden.length > 0 ? { zeilen, schmuck: { art: "pyramide", pyramiden } } : null;
}

/* ── Ankündigung: die Zahl kommt aus DERSELBEN Planung wie `baue` ─────────*/

const ZAHLWOERTER_DE = [
  "null", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun",
  "zehn", "elf", "zwölf",
];
const ZAHLWOERTER_EN = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve",
];

/**
 * ★ Abnahme 02.09.2026 (Probelauf): Die Ankündigung hiess zuerst
 * „Jetzt kommen vier Pyramidenwörter." - in derselben Runde stand aber eine
 * SATZpyramide (`Kajal` · `Kajal sah` · `Kajal sah Ada`). Gesagt und gebaut
 * liefen auseinander, und genau das ist in dieser App schon einmal teuer
 * geworden (Jens, 29.08.: angesagte „echte Wörter", die keine waren).
 *
 * Jetzt heisst es „Pyramiden" - und der zweite Satz sagt, was daran wächst.
 * Für ein Kind mit Blindheit ist diese Ankündigung die ganze Information über
 * das, was kommt.
 */
/**
 * ★ EN4: Bedienung in beiden Sprachen, Deutsch wortgleich wie vorher. „ein
 * Stück" heisst bei einer Wortpyramide ein Buchstabe, bei einer Satzpyramide
 * ein Wort - das Englische sagt dasselbe mit „piece", ohne sich festzulegen.
 */
/** ★ ES-O (27.09.2026): die kleinen Zahlwörter spanisch, für die Ankündigung. */
/** ★ O-IT (02.10.2026): „due piramidi" - weiblich wie „piramide". */
const ZAHLWOERTER_IT = [
  "zero", "una", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "undici", "dodici",
];

/**
 * ★ O-PL (02.10.2026): „dwie piramidy" - weiblich wie „piramida"; die Form des Nomens
 * (piramida · piramidy · piramid) wählt `mehrzahl` nach der Zahl, das Zahlwort steht hier.
 */
const ZAHLWOERTER_PL = [
  "zero", "jedna", "dwie", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć", "dziesięć",
  "jedenaście", "dwanaście",
];

/**
 * ★ O-TR (02.10.2026): "üç piramit" - nach einer Zahl steht das Nomen in der Einzahl
 * (Glossar Regel 5), darum kein `mehrzahl`; das Zahlwort steht hier.
 */
const ZAHLWOERTER_TR = [
  "sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on", "on bir", "on iki",
];

const ZAHLWOERTER_ES = [
  "cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce",
];

/** ★ O2-LIB (29.10.2026): Zahlwörter für die Ankündigung, Portugiesisch (Brasilien) - weiblich, passend zu "pirâmides". */
const ZAHLWOERTER_BR = [
  "zero", "uma", "duas", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
  "dez", "onze", "doze",
];

const TEXTE = texte({
  de: {
    ankuendigung: (anzahl: number) =>
      `${
        anzahl === 1
          ? "Jetzt kommt eine Pyramide."
          : `Jetzt kommen ${anzahl < ZAHLWOERTER_DE.length ? ZAHLWOERTER_DE[anzahl] : String(anzahl)} Pyramiden.`
      } Jede Zeile wächst um ein Stück.`,
  },
  en: {
    ankuendigung: (anzahl: number) =>
      `${
        anzahl === 1
          ? "Now for a pyramid."
          : `Now for ${anzahl < ZAHLWOERTER_EN.length ? ZAHLWOERTER_EN[anzahl] : String(anzahl)} pyramids.`
      } Each line adds one more piece.`,
  },
  // ★ E11a-5 (26.09.2026): Französisch neu geschrieben. Die Zahl kommt aus
  // `zahlwortFr` (`zahlwort.ts`) - bis zwölf ist sie in allen Landesvarianten
  // gleich, darum reicht „fr-FR". Ab 13 Ziffern wie in den anderen Sprachen.
  fr: {
    ankuendigung: (anzahl: number) =>
      `${
        anzahl === 1
          ? "Voici une pyramide."
          : `Voici ${anzahl < ZAHLWOERTER_DE.length ? zahlwortFr(anzahl, "fr-FR") : String(anzahl)} pyramides.`
      } Chaque ligne a un morceau de plus.`,
  },
  // ★ ES-O (27.09.2026): spanisch - die Zahl bis zwölf als Wort (wie in den anderen Sprachen).
  es: {
    ankuendigung: (anzahl: number) =>
      `${
        anzahl === 1
          ? "Aquí tienes una pirámide."
          : `Aquí tienes ${anzahl < ZAHLWOERTER_ES.length ? ZAHLWOERTER_ES[anzahl] : String(anzahl)} pirámides.`
      } Cada línea tiene un trozo más.`,
  },
  it: {
    ankuendigung: (anzahl: number) =>
      `${
        anzahl === 1
          ? "Ora tocca a una piramide."
          : `Ora tocca a ${anzahl < ZAHLWOERTER_IT.length ? ZAHLWOERTER_IT[anzahl] : String(anzahl)} piramidi.`
      } Ogni riga cresce di un pezzo.`,
  },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: {
    ankuendigung: (anzahl: number) => {
      const wort = anzahl < ZAHLWOERTER_PL.length ? ZAHLWOERTER_PL[anzahl] : String(anzahl);
      const satz = mehrzahl(anzahl, "pl", {
        one: () => "Teraz kolej na: jedna piramida.",
        few: () => `Teraz kolej na: ${wort} piramidy.`,
        many: () => `Teraz kolej na: ${wort} piramid.`,
        other: () => `Teraz kolej na: ${wort} piramidy.`,
      });
      return `${satz} Każdy wiersz rośnie o jeden kawałek.`;
    },
  },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: {
    ankuendigung: (anzahl: number) =>
      `${
        anzahl === 1
          ? "Sırada: bir piramit."
          : `Sırada: ${anzahl < ZAHLWOERTER_TR.length ? ZAHLWOERTER_TR[anzahl] : String(anzahl)} piramit.`
      } Her satır bir parça büyür.`,
  },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  // Die Zahl als Ziffer (Glossar Regel 5), das Nomen in allen vier Formen (§2.11).
  cs: {
    ankuendigung: (anzahl: number) => {
      const satz = mehrzahl(anzahl, "cs", {
        one: () => "Teď: jedna pyramida.",
        few: (z) => `Teď: ${z} pyramidy.`,
        many: (z) => `Teď: ${z} pyramidy.`,
        other: (z) => `Teď: ${z} pyramid.`,
      });
      return `${satz} Každý řádek vyroste o jeden kousek.`;
    },
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: (anzahl: number) => {
      const satz = mehrzahl(anzahl, "bg", {
        one: () => "Сега: една пирамида.",
        other: (z) => `Сега: ${z} пирамиди.`,
      });
      return `${satz} Всеки ред расте с по едно парче.`;
    },
  },
  el: {
    ankuendigung: (anzahl: number) => {
      const satz = mehrzahl(anzahl, "el", {
        one: () => "Τώρα: μία πυραμίδα.",
        other: (z) => `Τώρα: ${z} πυραμίδες.`,
      });
      return `${satz} Κάθε γραμμή μεγαλώνει κατά ένα κομμάτι.`;
    },
  },
  hu: {
    ankuendigung: (anzahl: number) => {
      const satz = mehrzahl(anzahl, "hu", {
        one: () => "Most: egy piramis.",
        other: (z) => `Most: ${z} piramis.`,
      });
      return `${satz} Minden sor egy darabbal nő.`;
    },
  },
  nl: {
    ankuendigung: (anzahl: number) => {
      const satz = mehrzahl(anzahl, "nl", {
        one: () => "Nu: een woordpiramide.",
        other: (z) => `Nu: ${z} woordpiramides.`,
      });
      return `${satz} Elke regel wordt een stukje langer.`;
    },
  },
  pt: {
    ankuendigung: (anzahl: number) => {
      const satz = mehrzahl(anzahl, "pt", {
        one: () => "Agora: uma pirâmide.",
        other: (z) => `Agora: ${z} pirâmides.`,
        many: (z) => `Agora: ${z} de pirâmides.`,
      });
      return `${satz} Cada linha cresce um bocadinho.`;
    },
  },
  br: {
    ankuendigung: (anzahl: number) => {
      const satz =
        anzahl === 1
          ? "Agora: uma pirâmide."
          : `Agora: ${anzahl < ZAHLWOERTER_BR.length ? ZAHLWOERTER_BR[anzahl] : String(anzahl)} pirâmides.`;
      return `${satz} Cada linha cresce um pedaço.`;
    },
  },
  ro: {
    ankuendigung: (anzahl: number) => {
      const satz = mehrzahl(anzahl, "ro", {
        one: () => "Acum: o piramidă de cuvinte.",
        few: (z) => `Acum: ${z} piramide de cuvinte.`,
        other: (z) => `Acum: ${z} de piramide de cuvinte.`,
      });
      return `${satz} Fiecare rând crește cu o bucățică.`;
    },
  },
  sv: {
    ankuendigung: (anzahl: number) => {
      const satz = mehrzahl(anzahl, "sv", {
        one: () => "Nu: en ordpyramid.",
        other: (z) => `Nu: ${z} ordpyramider.`,
      });
      return `${satz} Varje rad blir ett stycke längre.`;
    },
  },
  uk: {
    ankuendigung: (anzahl: number) => {
      const satz = mehrzahl(anzahl, "uk", {
        one: () => "Далі: одна піраміда.",
        few: (z) => `Далі: ${z} піраміди.`,
        many: (z) => `Далі: ${z} пірамід.`,
        other: (z) => `Далі: ${z} піраміди.`,
      });
      return `${satz} Кожен рядок збільшується на один шматочок.`;
    },
  },
});

export const pyramide: Uebungsform = {
  id: "pyramide",
  name: FORM_NAMEN.de.pyramide,
  ankuendigung: (ctx) => {
    const { woerter, saetze } = sammleQuellen(ctx);
    const anzahl = Math.max(1, planPyramiden(ctx, woerter, saetze).length);
    return TEXTE[bedienSpracheVon(ctx)].ankuendigung(anzahl);
  },
  taugt: (ctx) => sammleQuellen(ctx).woerter.size > 0,
  baue: baueRunde,
};
