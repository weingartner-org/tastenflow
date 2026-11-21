/**
 * ★★★ „WACKLIG" - wann eine gelernte Taste in der Liste „Wacklige Tasten"
 * steht (Schülerstatistik, Lehrkraft-Statistik, die wackligen Tasten je
 * Übungszeile). EINE Stelle für die Zahlen; jede Anzeige und jeder
 * Hilfe-/Handbuchtext liest sie von hier.
 *
 * Grundlage: `recherche-didaktik-2026-09-27/SYNTHESE-UND-ENTSCHEIDUNGEN.md`.
 *
 * ⚠️ NICHT die Freischalt-Logik: Ob die nächste Taste kommt, entscheidet
 * `letterLevel`/`canAdvance` in letters.ts (`TARGET_ACC`, `MIN_SAMPLES`) -
 * davon ist hier nichts berührt. Und NICHT die Tippchallenge: deren
 * „wacklig" gilt für eine einzige Probe (`schreibprobeAuswertung.ts`,
 * `WACKLIG_MIND_DRAN`/`WACKLIG_QUOTE`) und hat bewusst eigene Zahlen.
 */
import type { Stufe } from "./account";
import type { Lernweg } from "./lernweg";
import type { BedienSprache } from "../bedienSprache/sprache";
import { prozentMitZeichen } from "./sprachRegister";

/**
 * ★ D-4 (28.09.2026): „Wacklig" erst ab 20 Anschlägen dieser Taste (vorher 3).
 * Bei 3 Anschlägen macht EIN Vergreifer 67 % - das misst Zufall, keine
 * Schwäche; bei 20 ist ein Vergreifer noch 95 %. Recherche de E4, en E10
 * (West 1974: Fehlerzahlen kleiner Stichproben sind wenig zuverlässig).
 */
export const WACKLIG_MIND_ANSCHLAEGE = 20;

/** Die strenge Schwelle - de und es für alle, fr und en für Erwachsene. */
export const WACKLIG_SCHWELLE_STRENG = 0.95;

/** Die milde Schwelle - fr und en für Kinder und Jugendliche. */
export const WACKLIG_SCHWELLE_MILD = 0.9;

/**
 * ★ D-5 (28.09.2026): Auf welchem Weg gilt für Kinder und Jugendliche die
 * milde Schwelle? „Welcher Weg in diesem Land der bessere ist" (Johannes):
 *  · de: 95 % - Schweizer Kantone: 95 % ist in der 4./5. Klasse „genügend"
 *    (Typewriter-Leitfäden, amtlich).
 *  · es: 95 % - die häufigste Kurs-Schwelle (typingpractice.org, spanische
 *    Berufsbildung höchstens 5 % Fehler); für Kinder kein eigener Richtwert.
 *  · fr: 90 % - Tap'Touche: 6-11 J. 80-90 %, 12-16 J. 85-95 %.
 *  · en: 90 % - NSW (amtlich) endet für Kinder bei 90 %.
 * Eine Tabelle statt verstreuter Bedingungen - fehlt ein Weg, meldet es `tsc`.
 */
const MILD_FUER_JUNGE: Readonly<Record<Lernweg, boolean>> = {
  de: false,
  es: false,
  fr: true,
  en: true,
  // G2a: it, pl, tr, cs übernehmen die milde Schwelle wie en.
  it: true,
  pl: true,
  tr: true,
  cs: true,
  // ★ O2-LIB (30.10.2026): echte Werte (didaktische Vorgabe wie it, pl, tr, cs), keine Oberfläche.
  bg: true,
  el: true,
  hu: true,
  nl: true,
  pt: true,
  br: true,
  ro: true,
  sv: true,
  uk: true,
};

/**
 * ★★★ D-5: DIE Wacklig-Schwelle - eine Funktion von (Weg, Stufe). Unter ihr
 * (und ab {@link WACKLIG_MIND_ANSCHLAEGE} Anschlägen) steht eine Taste als
 * „wacklig" in der Liste.
 *
 * `stufe`: die Textstufe der Person (`stufeFuer`, bei Kindern einer Klasse
 * mit dem Vorrang der Klasse). „erwachsen" ⇒ streng; alles andere (kids,
 * teens, die Alt-Werte a/b/c, keine Angabe) zählt als Kind/Jugendlicher.
 */
export function wackligSchwelle(lernweg: Lernweg, stufe: Stufe | undefined): number {
  if (stufe === "erwachsen") return WACKLIG_SCHWELLE_STRENG;
  return MILD_FUER_JUNGE[lernweg] ? WACKLIG_SCHWELLE_MILD : WACKLIG_SCHWELLE_STRENG;
}

/** Wessen Liste wird gerechnet? Weg und Stufe der Person. */
export interface WackligRahmen {
  lernweg: Lernweg;
  stufe: Stufe | undefined;
}

/** Die Schwelle als ganze Prozentzahl (95, 90) - für Anzeigen. */
export function wackligProzent(r: WackligRahmen): number {
  return Math.round(wackligSchwelle(r.lernweg, r.stufe) * 100);
}

/** „95 %" in der Schreibweise der Bedienungssprache (Englisch ohne Leerzeichen). */
// ★ O-CS (03.10.2026): Tschechisch „95 %" fällt auf " %"; den Abstand schützt das Register (`prozentAbstandGeschuetzt`, U+00A0).
export function prozentText(zahl: number, sprache: BedienSprache): string {
  // ★ O-IT (02.10.2026): Italienisch wie Englisch ohne Leerzeichen („95%", Glossar Regel 5).
  // ★ O-PL (02.10.2026): Polnisch ebenso („95%", Glossar Regel 5 - Intl und PWN).
  // ★ O-TR (02.10.2026): Türkisch „%95" - Stellung aus dem Sprachregister (`prozentVorDerZahl`).
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, uk „95%" ohne Abstand (Glossare); ro und sv „95 %" fallen auf " %" (Abstand schützt das Register).
  const ohneAbstand: readonly BedienSprache[] = ["en", "it", "pl", "tr", "bg", "el", "hu", "nl", "pt", "br", "uk"];
  return prozentMitZeichen(zahl, ohneAbstand.includes(sprache) ? "%" : " %", sprache);
}

const JE_STUFE: Record<BedienSprache, (jung: string, erw: string) => string> = {
  de: (jung, erw) => `${jung} (Kinder und Jugendliche) bzw. ${erw} (Erwachsene)`,
  en: (jung, erw) => `${jung} (children and teenagers) or ${erw} (adults)`,
  fr: (jung, erw) => `${jung} (enfants et adolescents) ou ${erw} (adultes)`,
  es: (jung, erw) => `${jung} (niños y adolescentes) o ${erw} (adultos)`,
  it: (jung, erw) => `${jung} (bambini e ragazzi) o ${erw} (persone adulte)`,
  // ★ O-PL (02.10.2026): nur der Wortlaut der Oberfläche - die Schwelle des Weges „pl" selbst kommt mit F4.
  pl: (jung, erw) => `${jung} (dzieci i młodzież) albo ${erw} (osoby dorosłe)`,
  // ★ O-TR (02.10.2026): nur der Wortlaut der Oberfläche („%90 (çocuklar ve gençler) veya %95 (yetişkinler)").
  tr: (jung, erw) => `${jung} (çocuklar ve gençler) veya ${erw} (yetişkinler)`,
  // ★ O-CS (03.10.2026): nur der Wortlaut der Oberfläche („90 % (děti a mládež) nebo 95 % (dospělí)").
  cs: (jung, erw) => `${jung} (děti a mládež) nebo ${erw} (dospělí)`,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: (jung, erw) => `${jung} (деца и младежи) или ${erw} (възрастни)`,
  el: (jung, erw) => `${jung} (παιδιά και έφηβοι) ή ${erw} (ενήλικες)`,
  hu: (jung, erw) => `${jung} (gyerekek és fiatalok) vagy ${erw} (felnőttek)`,
  nl: (jung, erw) => `${jung} (kinderen en jongeren) of ${erw} (volwassenen)`,
  pt: (jung, erw) => `${jung} (crianças e jovens) ou ${erw} (pessoas adultas)`,
  br: (jung, erw) => `${jung} (crianças e adolescentes) ou ${erw} (pessoas adultas)`,
  ro: (jung, erw) => `${jung} (copii și tineri) sau ${erw} (adulți)`,
  sv: (jung, erw) => `${jung} (barn och ungdomar) eller ${erw} (vuxna)`,
  uk: (jung, erw) => `${jung} (діти й молодь) або ${erw} (дорослі)`,
};

/**
 * Die Schwelle eines WEGES in Worten - für Hilfe und Handbuch, die keine
 * einzelne Person vor sich haben: „95 %" (de, es) oder „90 % (Kinder und
 * Jugendliche) bzw. 95 % (Erwachsene)" (fr, en). Gerechnet aus
 * {@link wackligSchwelle}, nie hingeschrieben.
 */
export function wackligSchwelleText(sprache: BedienSprache, lernweg: Lernweg): string {
  const jung = prozentText(wackligProzent({ lernweg, stufe: "kids" }), sprache);
  const erw = prozentText(wackligProzent({ lernweg, stufe: "erwachsen" }), sprache);
  return jung === erw ? erw : JE_STUFE[sprache](jung, erw);
}
