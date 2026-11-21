/**
 * ZAHL ↔ ZAHLWORT - „43" und „dreiundvierzig".
 *
 * Gebaut am 02.09.2026 für die Übungsform „Zahlendiktat"
 * (`uebungsformen/zahlendiktat.ts`), aber bewusst hier und nicht dort: Ein
 * Zahlwort ist keine Eigenschaft einer Übungsform, und die nächste Stelle, die
 * eines braucht, soll es nicht ein zweites Mal schreiben.
 *
 * ★★ Die deutsche Zahlwortstellung ist der eigentliche Lehrgegenstand: 43
 * heißt „dreiundvierzig" - erst der Einer, dann der Zehner, genau umgekehrt
 * zur Schreibweise. Kinder verschreiben sich daran auch noch in der vierten
 * Klasse, und wer die Ziffernreihe übt, übt die Stellung gleich mit.
 *
 * Gedeckt ist 0 bis 999 - mehr braucht keine Tippübung, und ab tausend werden
 * die Wörter so lang, dass sie die Zeile sprengen.
 */
import type { Lang } from "./account";
import type { FranzVariante } from "./franzVariante";

const EINER_DE = [
  "null",
  "eins",
  "zwei",
  "drei",
  "vier",
  "fünf",
  "sechs",
  "sieben",
  "acht",
  "neun",
];

/** In Zusammensetzungen heißt 1 „ein", nicht „eins" („einundzwanzig"). */
const EINER_VERBUNDEN_DE = ["", "ein", ...EINER_DE.slice(2)];

const ZEHN_BIS_ZWANZIG_DE = [
  "zehn",
  "elf",
  "zwölf",
  "dreizehn",
  "vierzehn",
  "fünfzehn",
  "sechzehn", // nicht „sechszehn"
  "siebzehn", // nicht „siebenzehn"
  "achtzehn",
  "neunzehn",
];

const ZEHNER_DE = [
  "",
  "zehn",
  "zwanzig",
  "dreißig", // mit ß, nicht „dreissig"
  "vierzig",
  "fünfzig",
  "sechzig", // nicht „sechszig"
  "siebzig", // nicht „siebenzig"
  "achtzig",
  "neunzig",
];

const EINER_EN = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const ZEHN_BIS_ZWANZIG_EN = [
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const ZEHNER_EN = [
  "",
  "ten",
  "twenty",
  "thirty",
  "forty", // nicht „fourty"
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

/** Die größte Zahl, für die es hier ein Wort gibt. */
export const MAX_ZAHL = 999;

function unter100De(n: number): string {
  if (n < 10) return EINER_DE[n];
  if (n < 20) return ZEHN_BIS_ZWANZIG_DE[n - 10];
  const zehner = Math.floor(n / 10);
  const einer = n % 10;
  if (einer === 0) return ZEHNER_DE[zehner];
  // Die Umkehrung, um die es geht: erst der Einer, dann „und", dann der Zehner.
  return `${EINER_VERBUNDEN_DE[einer]}und${ZEHNER_DE[zehner]}`;
}

function unter100En(n: number): string {
  if (n < 10) return EINER_EN[n];
  if (n < 20) return ZEHN_BIS_ZWANZIG_EN[n - 10];
  const zehner = Math.floor(n / 10);
  const einer = n % 10;
  return einer === 0 ? ZEHNER_EN[zehner] : `${ZEHNER_EN[zehner]}-${EINER_EN[einer]}`;
}

/**
 * Das Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL}.
 *
 * Deutsch in EINEM Wort („dreihundertvierundzwanzig"), englisch mit Bindestrich
 * und „and" wie im britischen Gebrauch („three hundred and twenty-four") -
 * beides so, wie es ein Kind schreiben lernt.
 */
export function zahlwort(n: number, lang: Lang): string {
  // ★ E10a (25.09.2026, Bauplan §2.3 Punkt 4 „fr fällt nie still auf de"):
  // Französisch hat eine EIGENE Funktion ({@link zahlwortFr}), weil 70-99
  // unregelmässig sind und weil es vier Landesvarianten gibt (kein einzelner
  // Rückgabewert je Zahl, siehe dort). Ein Aufruf hier mit „fr" wäre sonst
  // eine stille Falle - er liefe unten in den deutschen Zweig und lieferte
  // deutsche Zahlwörter für eine französische Zeile. Darum: laut scheitern.
  if (lang === "fr")
    throw new Error('zahlwort(n, "fr") gibt es nicht - benutze zahlwortFr(n, variante).');
  // ★★★★★ ES-P7a-Behebung (27.09.2026, M6, Prüfbericht Fundament es): „es"
  // fiel bisher still in den DEUTSCHEN Zweig unten („Type it in digits:
  // einundvierzig.") - derselbe Fehler, den „fr" seit E10a nicht mehr machen
  // darf (Bauplan §2.3 Punkt 4: „fr fällt nie still auf de"), gilt jetzt auch
  // für „es": laut scheitern statt stillem Deutsch. Benutze {@link zahlwortEs}.
  if (lang === "es")
    throw new Error('zahlwort(n, "es") gibt es nicht - benutze zahlwortEs(n).');
  // ★ F8-it (02.10.2026): Italienisch hat seine EIGENE Funktion ({@link zahlwortIt}, bis 1.000.000, Akzent in `tré`,
  // Elision vor uno/otto) - ein Aufruf hier mit „it" lief sonst in den allgemeinen Fehler unten; die Meldung nennt jetzt den Weg.
  if (lang === "it")
    throw new Error('zahlwort(n, "it") gibt es nicht - benutze zahlwortIt(n).');
  // ★ F8-tr (03.10.2026): Türkisch hat ebenfalls seine EIGENE Funktion ({@link zahlwortTr}, bis 1.000.000, getrennt geschrieben,
  // `bin` ohne `bir`) - ein Aufruf hier mit „tr" lief sonst in den allgemeinen Fehler unten; die Meldung nennt jetzt den Weg.
  if (lang === "tr")
    throw new Error('zahlwort(n, "tr") gibt es nicht - benutze zahlwortTr(n).');
  // ★ F8-pl (03.10.2026): Polnisch hat seine EIGENE Funktion ({@link zahlwortPl}, bis 1.000.000, Nominativ, `tysiąc/tysiące/tysięcy`) -
  // ein Aufruf hier mit „pl" lief sonst in den allgemeinen Fehler unten; die Meldung nennt jetzt den Weg.
  if (lang === "pl")
    throw new Error('zahlwort(n, "pl") gibt es nicht - benutze zahlwortPl(n).');
  // ★ F8-cs (03.10.2026): Tschechisch hat seine EIGENE Funktion ({@link zahlwortCs}, bis 1.000.000, Grundform) - die Meldung nennt den Weg.
  if (lang === "cs")
    throw new Error('zahlwort(n, "cs") gibt es nicht - benutze zahlwortCs(n).');
  // ★ G2b-2 (02.10.2026, G1c §1.2 Nr. 8): jede andere Sprache als Deutsch und Englisch WIRFT -
  // vorher lief „it", „pl", „tr", „cs" (und jeder Unsinn) in den deutschen Zweig unten
  // („einundvierzig" für eine italienische Zeile). Dieselbe Regel wie für „fr" und „es": wer
  // eine neue Sprache anbindet, schreibt `zahlwort<S>` - und trägt sie in `ZAHLWORT_SPRACHEN`
  // (`uebungsformen/zahlendiktat.ts`) ein. Bis dahin bietet sich das Zahlendiktat nicht an.
  if (lang !== "de" && lang !== "en")
    throw new Error(`zahlwort(n, ${JSON.stringify(lang)}) gibt es nicht - die Sprache hat noch keine Zahlwörter.`);
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL)
    throw new RangeError(`Zahlwort nur für 0 bis ${MAX_ZAHL}, nicht ${n}`);

  if (lang === "en") {
    if (n < 100) return unter100En(n);
    const hundert = Math.floor(n / 100);
    const rest = n % 100;
    const kopf = `${EINER_EN[hundert]} hundred`;
    return rest === 0 ? kopf : `${kopf} and ${unter100En(rest)}`;
  }

  if (n < 100) return unter100De(n);
  const hundert = Math.floor(n / 100);
  const rest = n % 100;
  // „einhundert", nicht „einshundert"
  const kopf = `${EINER_VERBUNDEN_DE[hundert]}hundert`;
  return rest === 0 ? kopf : `${kopf}${unter100De(rest)}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// ★★★ FRANZÖSISCH (E10a, 25.09.2026, Bauplan §5.4/§8.1/§10.1) - EIGENE
// FUNKTION, KEINE TABELLE: 70 bis 99 sind auf keine der 26 Ausgangsformen
// (Einer/Zehner/Zehn-bis-Zwanzig wie oben) reduzierbar - „soixante-dix-sept"
// (77) setzt sich aus „soixante" + „dix-sept" zusammen, „quatre-vingt-un"
// (81) aus „quatre-vingt" + „un", OHNE „et" (anders als „soixante-et-onze").
// Dazu VIER Landesvarianten (§10.1): septante/nonante (BE, CH) statt
// soixante-dix/quatre-vingt-dix, huitante (CH) statt quatre-vingts. Jede
// Rechenregel unten ist an der Wikipédia-Seite „Nombres en français"
// (fr.wikipedia.org/wiki/Nombres_en_français) und an Wiktionnaire-Einträgen
// einzelner Zahlen (soixante-et-onze, quatre-vingt-onze, huitante …)
// gegengeprüft - Test-Tabelle: `tests/tastenflow-zahlwort-fr.test.ts`.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ★ Plus (10.11.2026, Recherche FR §E.2 Rang 1a): die Schweiz zählt nicht überall
 * gleich - huitante gilt nur in VD, VS, FR; GE, NE, BE, JU sagen quatre-vingts.
 * `fr-CH` bleibt wie es war (immer huitante, Tastenflow Byte-gleich); die
 * zusätzliche Zählweise `fr-CH-quatre-vingts` (septante, quatre-vingts, nonante)
 * ist nur für Plus. Sie ist KEINE `FranzVariante` (die gilt für Tastatur und
 * Typografie) - nur ein weiterer erlaubter Wert für {@link zahlwortFr}.
 */
export type FranzZaehlweise = FranzVariante | "fr-CH-quatre-vingts";

/** Null bis seize (16) - danach folgt „dix-sept, dix-huit, dix-neuf" aus diesen Bausteinen. */
const UNITE_FR = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
];

/**
 * Die drei „unregelmässigen" Zehner, je nach Landesvariante (§10.1):
 * FR/CA zählen 70/90 als Fortsetzung von soixante/quatre-vingt
 * (soixante-dix, quatre-vingt-dix); BE/CH benutzen für 70 und 90 eigene,
 * „regelmässige" Zehnerwörter (septante, nonante); CH benutzt zusätzlich
 * „huitante" für 80 (Vorgabe E10a: fr-CH IMMER septante/huitante/nonante,
 * ohne die kantonale Doppelform quatre-vingts/nonante aus dem Bauplan-Text
 * §10.1 - dort als offene Variante genannt, hier zugunsten einer klaren,
 * testbaren Regel entschieden).
 */
function zehnerRegime(variante: FranzZaehlweise): { s70: "composite" | "septante"; s80: "quatre-vingt" | "huitante"; s90: "composite" | "nonante" } {
  // BE und die Schweizer Kantone GE, NE, BE, JU: septante, quatre-vingts, nonante.
  if (variante === "fr-BE" || variante === "fr-CH-quatre-vingts") return { s70: "septante", s80: "quatre-vingt", s90: "nonante" };
  if (variante === "fr-CH") return { s70: "septante", s80: "huitante", s90: "nonante" };
  // fr-FR und fr-CA: dieselbe Fassung (§10.1: „70/80/90 … wie FR").
  return { s70: "composite", s80: "quatre-vingt", s90: "composite" };
}

/** 0 bis 19 - reine Bausteine, ohne Bindestrich-Logik (die kommt vom Aufrufer). */
function unter20Fr(n: number): string {
  if (n <= 16) return UNITE_FR[n];
  return `dix-${UNITE_FR[n - 10]}`; // dix-sept, dix-huit, dix-neuf
}

/**
 * 0 bis 99, nach Landesvariante. Die „et"-Regel (Bauplan §5.1: „mit et un …
 * aber 81, 91 ohne et"): ein „einfacher" Zehner (vingt/trente/…/soixante,
 * dazu septante/huitante/nonante ausserhalb von FR/CA) verbindet sich mit
 * „un" über „et" - AUSSER „quatre-vingt", das nie ein „et" nimmt (weder bei
 * „un" noch, in FR/CA, bei „onze" = 91). Einzige Ausnahme in die andere
 * Richtung: „soixante" nimmt bei „onze" (= 71 in FR/CA) ebenfalls „et" -
 * „soixante-et-onze", nicht „soixante-onze" (Wiktionnaire, siehe Kopfkommentar).
 */
function unter100Fr(n: number, variante: FranzZaehlweise): string {
  if (n < 20) return unter20Fr(n);
  const regime = zehnerRegime(variante);
  const dizaine = Math.floor(n / 10);
  const unite = n % 10;

  // Ein „einfacher" Zehner: vingt(2) trente(3) quarante(4) cinquante(5)
  // soixante(6) - und, je nach Variante, septante(7)/huitante(8)/nonante(9).
  const EINFACH: Record<number, string> = { 2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante" };
  if (regime.s70 === "septante") EINFACH[7] = "septante";
  if (regime.s80 === "huitante") EINFACH[8] = "huitante";
  if (regime.s90 === "nonante") EINFACH[9] = "nonante";

  const einfachesWort = EINFACH[dizaine];
  if (einfachesWort) {
    if (unite === 0) return einfachesWort;
    if (unite === 1) return `${einfachesWort}-et-un`;
    return `${einfachesWort}-${UNITE_FR[unite]}`;
  }

  // Ab hier: die zusammengesetzten Formen (immer in FR/CA; in BE nur bei 80;
  // in CH gar nicht, dort ist auch 80 „einfach" = huitante, siehe oben).
  if (dizaine === 7) {
    // 70-79 (nur FR/CA, composite): soixante + [dix..dix-neuf], „et" NUR bei
    // onze (71 = soixante-et-onze - die einzige „et"-Ausnahme neben den
    // einfachen Zehnern oben).
    const rest = 10 + unite;
    return rest === 11 ? "soixante-et-onze" : `soixante-${unter20Fr(rest)}`;
  }
  if (dizaine === 8) {
    // 80-89 (FR/BE/CA: quatre-vingt-Form): „quatre-vingts" NUR allein (s am
    // Ende, Bauplan §1 F1), sonst „quatre-vingt-…" OHNE „et", auch nicht bei
    // „un" (81 = quatre-vingt-un, nicht quatre-vingt-et-un).
    if (unite === 0) return "quatre-vingts";
    return `quatre-vingt-${UNITE_FR[unite]}`;
  }
  // 90-99 (nur FR/CA, composite): quatre-vingt-dix … quatre-vingt-dix-neuf,
  // NIE „et" (auch 91 = quatre-vingt-onze nicht „et").
  const rest = 10 + unite;
  return `quatre-vingt-${unter20Fr(rest)}`;
}

/** Die grösste Zahl, für die {@link zahlwortFr} ein Wort liefert. */
export const MAX_ZAHL_FR = 9999;

/**
 * Das französische Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL_FR}, nach
 * Landesvariante (§10.1). ALLE Bestandteile mit echtem Bindestrich verbunden
 * (Rechtschreibreform 1990, Vorgabe F4 - „vingt-et-un", „deux-cent-trois",
 * „mille-neuf-cent-quatre-vingt-dix") - vor 1990 stand dort ein Leerzeichen.
 *
 * „cent" (100) bleibt OHNE „un" davor („cent", nicht „un-cent") und bekommt
 * ein „s" NUR im Plural OHNE Folgezahl („deux-cents" = 200, aber
 * „deux-cent-trois" = 203). „mille" (1000) ist IMMER unveränderlich (nie
 * „milles", nie „un-mille").
 */
export function zahlwortFr(n: number, variante: FranzZaehlweise): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_FR)
    throw new RangeError(`zahlwortFr nur für 0 bis ${MAX_ZAHL_FR}, nicht ${n}`);
  if (n === 0) return "zéro";

  // 1 bis 999 - „cent" mit seinen zwei Sonderregeln (kein „un-cent", „s" nur
  // ohne Folgezahl).
  const unter1000 = (m: number): string => {
    if (m < 100) return unter100Fr(m, variante);
    const centaine = Math.floor(m / 100);
    const rest = m % 100;
    const kopf = centaine === 1 ? "cent" : `${UNITE_FR[centaine]}-cent`;
    if (rest === 0) return centaine === 1 ? kopf : `${kopf}s`;
    return `${kopf}-${unter100Fr(rest, variante)}`;
  };

  if (n < 1000) return unter1000(n);

  const mille = Math.floor(n / 1000);
  const rest = n % 1000;
  const kopf = mille === 1 ? "mille" : `${unter1000(mille)}-mille`;
  return rest === 0 ? kopf : `${kopf}-${unter1000(rest)}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// ★★★★★ ES-P7a-Behebung (27.09.2026, M6, Bauplan spanischer Lehrgang) -
// SPANISCH, nach RAE (Real Academia Española), einheitlich für es-ES UND
// es-419 (die ZahlWÖRTER selbst unterscheiden sich zwischen den spanisch-
// sprachigen Ländern nicht - anders als bei Französisch/soixante-dix; nur
// die SCHREIBWEISE von Ziffern/Dezimalzahlen ist verortet, siehe
// `esVariante.ts`). Quelle: RAE „Ortografía de la lengua española", Kapitel
// über Zahlwörter (16-19 „dieci-", 21-29 „veinti-", ab 31 mit „y").
// 16 bis 19 werden zusammengezogen geschrieben („dieciséis", nicht
// „diez y seis" - das ist die ALTE, heute falsche Schreibweise), ebenso
// 21 bis 29 („veintiuno", nicht „veinte y uno"). Ab 31 steht „y" als eigenes
// Wort („treinta y uno"). 100 heisst allein „cien", nur MIT Folgezahl
// „ciento" („ciento uno" = 101). Test-Tabelle: `tests/tastenflow-zahlwort-es.test.ts`.
// ═══════════════════════════════════════════════════════════════════════════

const EINER_ES = [
  "cero",
  "uno",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
];

/** 10 bis 15 - keine Zusammenziehung nötig, die Wörter sind eigenständig. */
const DIEZ_A_QUINCE_ES = ["diez", "once", "doce", "trece", "catorce", "quince"];

/** 16 bis 19 - zusammengezogen („diez y seis" ⇒ „dieciséis", RAE-Norm). */
const DIECI_ES = ["dieciséis", "diecisiete", "dieciocho", "diecinueve"];

/** 21 bis 29 - ebenso zusammengezogen („veinte y uno" ⇒ „veintiuno"). */
const VEINTI_ES = [
  "veintiuno",
  "veintidós",
  "veintitrés",
  "veinticuatro",
  "veinticinco",
  "veintiséis",
  "veintisiete",
  "veintiocho",
  "veintinueve",
];

/** Zehner ab 30 - eigene Wörter, ab hier verbindet „y" als eigenes Wort. */
const DECENAS_ES = [
  "",
  "diez", // ungenutzt (10-19 laufen über DIEZ_A_QUINCE_ES/DIECI_ES)
  "veinte", // ungenutzt (20-29 laufen über VEINTE_ES/VEINTI_ES)
  "treinta",
  "cuarenta",
  "cincuenta",
  "sesenta",
  "setenta",
  "ochenta",
  "noventa",
];

/** Hunderter 100-900 - 100 selbst ist ein Sonderfall (siehe {@link zahlwortEs}). */
const CENTENAS_ES = [
  "",
  "ciento", // nur MIT Folgezahl (101-199) - 100 allein heisst „cien"
  "doscientos",
  "trescientos",
  "cuatrocientos",
  "quinientos", // unregelmässig, nicht „cincocientos"
  "seiscientos",
  "setecientos",
  "ochocientos",
  "novecientos",
];

function unter100Es(n: number): string {
  if (n < 10) return EINER_ES[n];
  if (n < 16) return DIEZ_A_QUINCE_ES[n - 10];
  if (n < 20) return DIECI_ES[n - 16];
  if (n === 20) return "veinte";
  if (n < 30) return VEINTI_ES[n - 21];
  const decena = Math.floor(n / 10);
  const unidad = n % 10;
  return unidad === 0 ? DECENAS_ES[decena] : `${DECENAS_ES[decena]} y ${EINER_ES[unidad]}`;
}

/**
 * Das spanische Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL} - EINE
 * Fassung für es-ES und es-419 (siehe Kopf-Kommentar oben).
 */
export function zahlwortEs(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL)
    throw new RangeError(`zahlwortEs nur für 0 bis ${MAX_ZAHL}, nicht ${n}`);
  if (n < 100) return unter100Es(n);
  if (n === 100) return "cien"; // NICHT "ciento" ohne Folgezahl
  const centena = Math.floor(n / 100);
  const resto = n % 100;
  const kopf = CENTENAS_ES[centena];
  return resto === 0 ? kopf : `${kopf} ${unter100Es(resto)}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// ★★★ ITALIENISCH (F8-it, 02.10.2026, Bauplan italienischer Lehrgang §5 Nr. 5, Glossar §2.10) - EIGENE FUNKTION
// bis 1.000.000. Die Zahlwörter werden ZUSAMMENGESCHRIEBEN (`trecentoventitré`), nur „un milione" steht getrennt.
// Die Regeln, die ein Kind beim Schreiben verwechselt - und die diese Funktion einhält:
//  · **Elision vor „uno" und „otto":** ein Zehner verliert seinen Endvokal: `ventuno`, `trentuno`, `ventotto`, `novantotto`
//    (nicht *ventiuno*, *ventiotto*); `cento` verliert sein `o` vor `otto` und `ottanta…`: `centotto`, `centottanta`,
//    `duecentottantotto`. Alles andere bleibt ganz: `centouno`, `centodue`, `milleotto`, `duemilaotto`.
//  · **`tré` mit Akzent**, wenn `tre` am Ende einer Zusammensetzung steht: `ventitré`, `trentatré`, `centotré`, `milletré`
//    (das Wort `tre` allein und `tre` in `trecento`, `tremila`, `ventitremila` bleiben ohne Akzent - der Akzent
//    kennzeichnet die betonte letzte Silbe).
//  · **Tausender:** `mille` (1.000), ab 2.000 `duemila`, `ventunomila`, `centomila` (immer `mila`, nie *mille*).
//  · Kein „e" zwischen den Teilen (`centouno`, nicht *cento e uno*).
// Gemessen am macOS-Wörterbuch (Italienisch, `scripts/woerterbuch-macos.js`): es bestätigt `ventuno`, `ventotto`,
// `trentotto`, `novantotto`, `ottantotto`, `settantotto`, `ventitré`, `trentatré`, `quarantatré`, `centodue`, `centoventi`,
// `centottanta`, `centomila`, `duemila`, `milione`, `milioni` und lehnt `ventitre` ab. Lange Zusammensetzungen kennt es
// nicht (Falle 61: ein Wörterbuch beweist hier nichts) - dort gilt die Regel oben. ⚠️ UNGEMESSEN, Schreibvarianten, die das
// Italienische zulässt: `centouno`/`centuno`, `centootto`/`centotto` (gewählt: centouno, centotto), `ventunomila`/`ventunmila`
// (gewählt: ventunomila). Test-Tabelle: `tests/tastenflow-zahlwort-it.test.ts`.
// ═══════════════════════════════════════════════════════════════════════════

const EINER_IT = ["zero", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove"];
const ZEHN_BIS_NEUNZEHN_IT = [
  "dieci", "undici", "dodici", "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove",
];
const ZEHNER_IT = ["", "", "venti", "trenta", "quaranta", "cinquanta", "sessanta", "settanta", "ottanta", "novanta"];

/** 1 bis 99, ohne Akzent auf `tre` (der Akzent kommt erst am fertigen Wort, siehe {@link zahlwortIt}). */
function unter100It(n: number): string {
  if (n < 10) return EINER_IT[n];
  if (n < 20) return ZEHN_BIS_NEUNZEHN_IT[n - 10];
  const zehner = ZEHNER_IT[Math.floor(n / 10)];
  const einer = n % 10;
  if (einer === 0) return zehner;
  // Elision: vor „uno" und „otto" fällt der Endvokal des Zehners weg (ventuno, trentotto).
  const stamm = einer === 1 || einer === 8 ? zehner.slice(0, -1) : zehner;
  return stamm + EINER_IT[einer];
}

/** 1 bis 999. `cento` verliert sein `o` vor `otto` und `ottanta…` (centotto, centottanta). */
function unter1000It(n: number): string {
  if (n < 100) return unter100It(n);
  const hunderter = Math.floor(n / 100);
  const rest = n % 100;
  const kopf = hunderter === 1 ? "cento" : `${EINER_IT[hunderter]}cento`;
  if (rest === 0) return kopf;
  const nachfolger = unter100It(rest);
  return (nachfolger.startsWith("ott") ? kopf.slice(0, -1) : kopf) + nachfolger;
}

/** Die grösste Zahl, für die {@link zahlwortIt} ein Wort liefert. */
export const MAX_ZAHL_IT = 1_000_000;

/**
 * Das italienische Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL_IT} - EINE Fassung für Italien, die Schweiz und
 * San Marino (die Zahlwörter unterscheiden sich dort nicht; nur die Schreibung der Ziffern, siehe `zahl()` in
 * `bedienSprache/texte.ts`).
 */
export function zahlwortIt(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_IT)
    throw new RangeError(`zahlwortIt nur für 0 bis ${MAX_ZAHL_IT}, nicht ${n}`);
  if (n === 0) return "zero";
  if (n === MAX_ZAHL_IT) return "un milione";
  const tausender = Math.floor(n / 1000);
  const rest = n % 1000;
  const kopf = tausender === 0 ? "" : tausender === 1 ? "mille" : `${unter1000It(tausender)}mila`;
  const wort = kopf + (rest > 0 ? unter1000It(rest) : "");
  // `tré`: der Akzent steht, wenn `tre` am ENDE einer Zusammensetzung steht (ventitré, centotré, milletré) - nicht beim Wort `tre` selbst.
  return wort.length > 3 && wort.endsWith("tre") ? `${wort.slice(0, -3)}tré` : wort;
}

// ═══════════════════════════════════════════════════════════════════════════
// ★★★ TÜRKISCH (F8-tr, 03.10.2026, Glossar §2.10, Bauplan vier Sprachen) - EIGENE FUNKTION bis 1.000.000. Die Zahlwörter werden
// GETRENNT geschrieben (TDK „Sayıların yazılışı": `yüz yirmi üç`, `bin iki yüz otuz dört`; nur auf Schecks und Quittungen zusammen).
// Die Regeln, die ein Kind beim Schreiben verwechselt - und die diese Funktion einhält:
//  · **`bin` und `yüz` ohne `bir`:** 1.000 ist `bin` (NIE `bir bin`), 100 ist `yüz` (nie `bir yüz`), 1.100 `bin yüz`, 100.000 `yüz bin`.
//    Ab 2 steht die Zahl davor: `iki bin`, `iki yüz`, `yüz on bin`. Nur `milyon` braucht das `bir`: 1.000.000 ist `bir milyon`.
//  · **Keine Verbindungswörter:** `yirmi bir`, nicht *yirmi ve bir*; `yüz bir`, `bin bir` (1.001).
//  · **Die Zehner** `on yirmi otuz kırk elli altmış yetmiş seksen doksan`, die Einer `bir iki üç dört beş altı yedi sekiz dokuz`, Null `sıfır`.
//  · **Die Mehrzahl bleibt Einzahl** (Glossar: `5 hata`, nie `5 hatalar`) - die Funktion liefert nur das Zahlwort.
// Gemessen am macOS-Wörterbuch (Türkisch, `scripts/woerterbuch-macos.js` mit `tr:`): es bestätigt jedes Einzelwort (`sıfır`, `dört`, `altmış`,
// `yetmiş`, `milyon`); Zusammensetzungen sind zwei Wörter und nicht Gegenstand eines Wörterbuchs - dort gilt die Regel oben.
// Test-Tabelle: `tests/tastenflow-zahlwort-tr.test.ts`.
// ═══════════════════════════════════════════════════════════════════════════

const EINER_TR = ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
const ZEHNER_TR = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];

/** 1 bis 99: Zehner, dann Einer, durch ein Leerzeichen getrennt (`yirmi üç`). */
function unter100Tr(n: number): string {
  if (n < 10) return EINER_TR[n];
  const zehner = ZEHNER_TR[Math.floor(n / 10)];
  const einer = n % 10;
  return einer === 0 ? zehner : `${zehner} ${EINER_TR[einer]}`;
}

/** 1 bis 999. `yüz` steht allein (100), ab 200 mit der Zahl davor (`iki yüz`). */
function unter1000Tr(n: number): string {
  if (n < 100) return unter100Tr(n);
  const hunderter = Math.floor(n / 100);
  const rest = n % 100;
  const kopf = hunderter === 1 ? "yüz" : `${EINER_TR[hunderter]} yüz`;
  return rest === 0 ? kopf : `${kopf} ${unter100Tr(rest)}`;
}

/** Die grösste Zahl, für die {@link zahlwortTr} ein Wort liefert. */
export const MAX_ZAHL_TR = 1_000_000;

/**
 * Das türkische Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL_TR} - EINE Fassung für die Türkei und Nordzypern (die Zahlwörter
 * unterscheiden sich dort nicht). Getrennt geschrieben, `bin`/`yüz` ohne `bir`, `bir milyon` für 1.000.000.
 */
export function zahlwortTr(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_TR)
    throw new RangeError(`zahlwortTr nur für 0 bis ${MAX_ZAHL_TR}, nicht ${n}`);
  if (n === 0) return "sıfır";
  if (n === MAX_ZAHL_TR) return "bir milyon";
  const tausender = Math.floor(n / 1000);
  const rest = n % 1000;
  const kopf = tausender === 0 ? "" : tausender === 1 ? "bin" : `${unter1000Tr(tausender)} bin`;
  return [kopf, rest > 0 ? unter1000Tr(rest) : ""].filter((t) => t.length > 0).join(" ");
}

// ════════════════════════════════════════════════════════════════
// ★★★ POLNISCH (F8-pl, 03.10.2026, Bauplan vier Sprachen, Glossar `GLOSSAR-pl.md` §2.10) - EIGENE FUNKTION bis 1.000.000,
// Nominativ, so wie man eine Zahl ansagt oder diktiert („dwadzieścia jeden", „sto dwadzieścia trzy").
// Die Regeln, die ein Kind beim Schreiben verwechselt - und die diese Funktion einhält:
//  · Zahlwörter werden GETRENNT geschrieben („dwadzieścia jeden", „sto dwadzieścia trzy", „dwa tysiące pięćset"), nie zusammen.
//  · **Tausender hat drei Formen** (wie das Wort „Mehrzahl" im Polnischen vier Formen hat): `tysiąc` für genau 1.000 (nie „jeden
//    tysiąc"), `tysiące` wenn die Zahl der Tausender auf 2, 3, 4 endet, aber nicht auf 12, 13, 14 (dwa tysiące, trzy tysiące,
//    dwadzieścia dwa tysiące, sto trzy tysiące), sonst `tysięcy` (pięć tysięcy, dwanaście tysięcy, dwadzieścia jeden tysięcy,
//    sto tysięcy).
//  · **Million:** `milion` (genau 1.000.000, nie „jeden milion"), die Obergrenze dieser Funktion.
//  · Die Einer stehen in der Form des Zählens (`dwa`, nicht `dwie`/`dwóch`): „dwadzieścia dwa", „dwa tysiące".
//  · Die Hunderter sind EIN Wort mit eigener Form (`dwieście`, `trzysta`, `czterysta`, `pięćset` … `dziewięćset`), nicht `dwa sta`.
// Gemessen: `Intl` hat für Polnisch keine Zahlwörter, das macOS-Wörterbuch nimmt jedes Wort an (Falle 61) - die Regeln stammen aus
// der Grammatik (RJP/PWN: „Zapis liczebników") und sind in `tests/tastenflow-zahlwort-pl.test.ts` Zahl für Zahl festgehalten.
// ⚠️ UNGEMESSEN: Fälle ausserhalb des Nominativs (Genitiv „dwudziestu"), die männlich-personale Form („dwóch uczniów") - ein
// Zahlendiktat schreibt die Zahl allein. Von keiner Muttersprachlerin gelesen (Prüfbericht P7).
// ═══════════════════════════════════════════════════════════════════════════

const EINER_PL = ["zero", "jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć"];
const ZEHN_BIS_NEUNZEHN_PL = [
  "dziesięć", "jedenaście", "dwanaście", "trzynaście", "czternaście", "piętnaście", "szesnaście", "siedemnaście", "osiemnaście", "dziewiętnaście",
];
const ZEHNER_PL = ["", "", "dwadzieścia", "trzydzieści", "czterdzieści", "pięćdziesiąt", "sześćdziesiąt", "siedemdziesiąt", "osiemdziesiąt", "dziewięćdziesiąt"];
const HUNDERTER_PL = ["", "sto", "dwieście", "trzysta", "czterysta", "pięćset", "sześćset", "siedemset", "osiemset", "dziewięćset"];

/** 1 bis 999 (ohne „zero"), Wörter durch ein Leerzeichen getrennt. */
function unter1000Pl(n: number): string {
  const aus: string[] = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h > 0) aus.push(HUNDERTER_PL[h]);
  if (rest >= 10 && rest < 20) {
    aus.push(ZEHN_BIS_NEUNZEHN_PL[rest - 10]);
  } else {
    const z = Math.floor(rest / 10);
    const e = rest % 10;
    if (z > 0) aus.push(ZEHNER_PL[z]);
    if (e > 0) aus.push(EINER_PL[e]);
  }
  return aus.join(" ");
}

/**
 * Das Wort `tysiąc` in der Form, die zu der Zahl der Tausender gehört (siehe Kopf): 1 ⇒ `tysiąc`, endet auf 2-4 (nicht 12-14) ⇒
 * `tysiące`, sonst `tysięcy`.
 */
function tausenderFormPl(tausender: number): string {
  if (tausender === 1) return "tysiąc";
  const e = tausender % 10;
  const z = tausender % 100;
  return e >= 2 && e <= 4 && !(z >= 12 && z <= 14) ? "tysiące" : "tysięcy";
}

/** Die grösste Zahl, für die {@link zahlwortPl} ein Wort liefert. */
export const MAX_ZAHL_PL = 1_000_000;

/**
 * Das polnische Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL_PL}, im Nominativ, getrennt geschrieben.
 * EINE Fassung für Polen und alle Orte, die Polnisch lehren (es gibt keine Landesvarianten der Zahlwörter).
 */
export function zahlwortPl(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_PL)
    throw new RangeError(`zahlwortPl nur für 0 bis ${MAX_ZAHL_PL}, nicht ${n}`);
  if (n === 0) return "zero";
  if (n === MAX_ZAHL_PL) return "milion";
  const tausender = Math.floor(n / 1000);
  const rest = n % 1000;
  const aus: string[] = [];
  if (tausender > 0) {
    // „tysiąc" allein für 1.000, sonst die Zahl der Tausender davor („dwa tysiące", „sto tysięcy").
    if (tausender > 1) aus.push(unter1000Pl(tausender));
    aus.push(tausenderFormPl(tausender));
  }
  if (rest > 0) aus.push(unter1000Pl(rest));
  return aus.join(" ");
}

// ★★★ TSCHECHISCH (F8-cs, 03.10.2026, Bauplan vier Sprachen §4, Glossar Tschechisch §2.10) - EIGENE FUNKTION bis 1.000.000.
// Die Zahlwörter werden GETRENNT geschrieben („dvacet jedna", „sto dvacet tři", „dva tisíce"), nicht in einem Wort wie im Deutschen
// und nicht mit Bindestrich wie im Französischen. Es steht EINE Fassung da - die ZÄHLFORM, wie ein Kind laut zählt:
//  · **Geschlecht (die Falle der Sprache):** 1 und 2 haben je Geschlecht eine eigene Form (jeden/jedna/jedno, dva/dvě/dvě). Gewählt ist
//    die Zählform „jedna" und das Maskulinum „dva" („dvacet jedna", „dvacet dva") - Nominativ, ohne Nomen davor. Die feste Ausnahme steht
//    im Wort selbst: 200 heisst immer „dvě stě" (nie *dva sta*). Vor „tisíc" (ein Maskulinum) steht „jeden" („dvacet jeden tisíc",
//    „sto jeden tisíc"), vor „milion" ebenso; „tisíc" und „milion" stehen allein, ohne „jeden" („tisíc", „milion" - beide Formen sind
//    gültig, gewählt ist die kürzere).
//  · **Hunderter:** sto · dvě stě · tři sta · čtyři sta · pět set · šest set · sedm set · osm set · devět set (stě/sta/set sind
//    gebeugte Formen von „sto": 2 ⇒ stě, 3-4 ⇒ sta, ab 5 ⇒ set).
//  · **Tausender:** „tisíc" (1.000) · „dva/tři/čtyři tisíce" (2-4 Tausend, einfach, Nominativ Plural) · ab 5 und bei jeder
//    ZUSAMMENGESETZTEN Zahl „tisíc" (Genitiv Plural): „pět tisíc", „dvacet dva tisíc", „sto dva tisíc", „dvě stě tisíc". Nur das
//    einfache 2, 3, 4 bekommt „tisíce".
//  · Zehner: dvacet · třicet · čtyřicet · padesát · šedesát · sedmdesát · osmdesát · devadesát; 11-19 sind eigene Wörter
//    (jedenáct … devatenáct). Die Reihenfolge „jedenadvacet" (Einer vor Zehner, ein Wort) ist die zweite gültige Form und hier NICHT
//    gewählt (die Zehner-vor-Einer-Folge ist die der Zählform und der Ziffernfolge, die das Kind tippt).
// ⚠️ UNGEPRÜFT von einer Person mit Tschechisch als Erstsprache (Glossar §5: [G] bis jemand prüft); kein Wörterbuch belegt die langen
// Zusammensetzungen (Falle 61). Die Regeln stehen in `tests/tastenflow-zahlwort-cs.test.ts` als Tabelle - die Prüfung kann sie gegenlesen.
// ═══════════════════════════════════════════════════════════════════════════

const EINER_CS = ["nula", "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět"];
const ZEHN_BIS_NEUNZEHN_CS = [
  "deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct",
];
const ZEHNER_CS = ["", "", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát"];
const HUNDERTER_CS = ["", "sto", "dvě stě", "tři sta", "čtyři sta", "pět set", "šest set", "sedm set", "osm set", "devět set"];

/** 1 bis 99 in der Zählform; `maskulin`: vor „tisíc" steht „jeden" statt „jedna" (nur der Einer 1 ändert sich). */
function unter100Cs(n: number, maskulin: boolean): string {
  if (n < 10) return n === 1 && maskulin ? "jeden" : EINER_CS[n];
  if (n < 20) return ZEHN_BIS_NEUNZEHN_CS[n - 10];
  const zehner = ZEHNER_CS[Math.floor(n / 10)];
  const einer = n % 10;
  return einer === 0 ? zehner : `${zehner} ${unter100Cs(einer, maskulin)}`;
}

/** 1 bis 999 in der Zählform (Hunderter, dann der Rest). */
function unter1000Cs(n: number, maskulin: boolean): string {
  if (n < 100) return unter100Cs(n, maskulin);
  const hunderter = HUNDERTER_CS[Math.floor(n / 100)];
  const rest = n % 100;
  return rest === 0 ? hunderter : `${hunderter} ${unter100Cs(rest, maskulin)}`;
}

/** Die grösste Zahl, für die {@link zahlwortCs} ein Wort liefert. */
export const MAX_ZAHL_CS = 1_000_000;

/**
 * Das tschechische Zahlwort zu einer Zahl von 0 bis {@link MAX_ZAHL_CS} - EINE Fassung (Zählform, Maskulinum bei 2) für Tschechien und
 * alle Tastaturen (`cs`, `cs-qwerty`); siehe den Kopf dieses Abschnitts für jede Entscheidung.
 */
export function zahlwortCs(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_CS)
    throw new RangeError(`zahlwortCs nur für 0 bis ${MAX_ZAHL_CS}, nicht ${n}`);
  if (n === 0) return "nula";
  if (n === MAX_ZAHL_CS) return "milion";
  const tausender = Math.floor(n / 1000);
  const rest = n % 1000;
  let kopf = "";
  if (tausender === 1) kopf = "tisíc";
  else if (tausender >= 2 && tausender <= 4) kopf = `${EINER_CS[tausender]} tisíce`;
  else if (tausender > 4) kopf = `${unter1000Cs(tausender, true)} tisíc`;
  return rest === 0 ? kopf : kopf ? `${kopf} ${unter1000Cs(rest, false)}` : unter1000Cs(rest, false);
}
