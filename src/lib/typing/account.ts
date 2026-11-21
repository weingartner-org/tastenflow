/**
 * Konten für den Tipptrainer „Tastenflow" — eigenes, getrenntes System NUR
 * für dieses Programm (nicht die LMS-Konten), übernommen vom Braille-Trainer
 * [[project_braille_trainer]]. Lehrkraft: E-Mail + Passwort. Schüler:innen: von
 * der Lehrkraft angelegt, Login per Klassencode + Name + Passwort.
 *
 * Lokale Umsetzung (ein Browser, localStorage) mit schlankem Interface, damit
 * später PocketBase dahinter geschoben werden kann. SICHERHEIT: das lokale
 * Passwort ist nur ein nicht umkehrbarer Test-Hash, kein echter Schutz — die
 * sichere Auth kommt später über PocketBase. Siehe [[feedback_security_first]].
 */
import { LetterStat, TypingProgress, emptyProgress } from "./progress";
import {
  INITIAL_LETTERS,
  TempoLevel,
  startpunktEinheiten,
  letterAccuracy,
  letterSamples,
} from "./letters";
import { DEFAULT_GOAL_MINUTES, DEFAULT_GOAL_UNITS } from "./goals";
import { WACKLIG_MIND_ANSCHLAEGE, wackligSchwelle, type WackligRahmen } from "./wacklig";
import { naechsterKlassencodeVersuch } from "../lernwerkstatt/klassencode";
import { zeilenTempoPlausibel } from "./zeilenzeit";
import { gezieltAus, type Gezielt } from "./gezielt";
import { ersteWorte, type MeinTextEintrag } from "./meineTexte";
import {
  eigeneUebungReihe,
  reiheMitNeuer,
  reiheOhne,
  type EigeneUebungEintrag,
} from "./eigeneUebungReihe";
import type { SpendenBannerZustand } from "@/lib/spendenbanner";
// ★★★ Wochenziel NEU (W2, 18.09.2026) - reine Logik liegt in wochenziel.ts
// (W1, fertig); diese Datei schreibt nur die Felder. Siehe dort für die
// Begründung (Feld am Kind statt Ereignis-Marker, Montag-08:00-Grenze).
import {
  kindWochenzielAusFeldern,
  neuesKindVerlauf,
  zielAendern,
  type GesperrteZeit,
  type ZielAbschnitt,
} from "./wochenziel";

export type TypingRole = "lehrkraft" | "schueler";

// ★ E1 (24.09.2026): der Lernweg (Bauplan englischer Lehrgang §2.2).
import { istLernweg, lernwegDef, lernwegVon, type Hauptsprache, type Lernweg } from "./lernweg";
import { istEnglischVariante, type EnglischVariante } from "./schreibweise";
import { istSchuljahrBeginn } from "./schuljahrBeginn";
import type { BedienSprache } from "@/lib/bedienSprache";
export { lernwegVon };

/** Sprache der Übungswörter/-texte (die Tastatur wird getrennt eingestellt, siehe layouts.ts). */
import {
  ereignisAnhaengen, ereignisseNachtragen,
  unpackEvents,
  type PackedEvents,
} from "./eventPack";

/**
 * ★ E2a (25.09.2026, Gerüst französischer Lehrgang): „fr" dazu. Übungssprache
 * Französisch gibt es bisher NUR auf Weg „fr" selbst (Bauplan F15) - die
 * Erweiterung hier ist reines Gerüst, kein neues Angebot für Weg „de"/„en".
 *
 * ★ ES-F2 (27.09.2026, Gerüst spanischer Lehrgang): „es" dazu, aus demselben
 * Grund und mit derselben Einschränkung wie „fr" - siehe {@link LANGS}.
 */
export type Lang = "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs" | "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";

/**
 * ★★ E2a: bewusst NUR „de"/„en" - `LANGS` speist die sichtbaren Auswahlfelder
 * (Einrichtung, Klassen-Einstellungen). „fr" als Übungssprache anzubieten,
 * ohne dass ein einziges französisches Wort existiert, wäre eine sichtbare
 * Verhaltensänderung für heutige Nutzer (verboten für dieses Gerüst) - das
 * Angebot kommt mit den Inhalten (E8ff., Bauplan §6). `Lang` selbst ist
 * trotzdem auf drei Werte erweitert (siehe oben) - für alles, was einen
 * Lang-Wert nur SPEICHERT oder PRÜFT, nicht anbietet.
 *
 * ★ ES-F2: „es" bleibt aus demselben Grund draussen - kein spanisches Wort
 * existiert noch (ES-F5ff. bringt die Inhalte).
 */
export const LANGS: Lang[] = ["de", "en"];

/**
 * ★★★ DIE ÜBUNGSSPRACHEN, DIE AUF EINEM WEG MÖGLICH SIND.
 *
 * ES-M2 (27.09.2026, Prüfbericht ES-P2 M2, M3, S8): `LANGS` allein speiste
 * die Auswahl in der Einrichtung und im Zahnrad - auf Weg „es" standen dort
 * „Alemán | Inglés", keine davon gewählt, und ein Klick darauf gab dem Kind
 * deutsche Texte auf der spanischen Reihenfolge (´ ¿ ¡ nie als Anschlag).
 * Umgekehrt erzeugte Weg „de" mit Übungssprache „es" „¿ciudad?" auf einer
 * deutschen Tastatur.
 *
 * ★★★ D1 (28.09.2026, Entscheidung Johannes Nr. 18): ein Weg mit
 * Hauptsprache (`hauptsprache`, lernweg.ts) bietet sie UND Englisch an -
 * „Englisch ist die Weltsprache und alle sollen sie zusätzlich üben können,
 * die Tastaturfolge der 1. Sprache hat aber Vorrang". Deutsch nie. ES-M2
 * hatte die Sprache dort fest an den Weg gebunden (nur eine Wahl).
 *
 * Die Regel steht an der EIGENSCHAFT des Weges (`hauptsprache`), nicht an
 * seiner Kennung (Leitfaden Falle 50): alle anderen Wege haben `LANGS` wie
 * bisher (Weg „de"/„en" unverändert).
 */
export function uebungsSprachenImWeg(lernweg: Lernweg): readonly Lang[] {
  const haupt = lernwegDef(lernweg).hauptsprache;
  return haupt ? HAUPT_UND_ENGLISCH[haupt] : LANGS;
}

/** Feste Listen je Hauptsprache - dieselbe Referenz bei jedem Aufruf (React-Abhängigkeiten). */
const HAUPT_UND_ENGLISCH: Readonly<Record<Hauptsprache, readonly Lang[]>> = {
  fr: Object.freeze(["fr", "en"] as Lang[]),
  es: Object.freeze(["es", "en"] as Lang[]),
  // ★ F5-F8-it (02.10.2026): Italienisch wie Französisch und Spanisch - Hauptsprache und Englisch, Deutsch nie.
  it: Object.freeze(["it", "en"] as Lang[]),
  // ★ F5-F8-tr (03.10.2026): Türkisch ebenso - Hauptsprache und Englisch, Deutsch nie.
  tr: Object.freeze(["tr", "en"] as Lang[]),
  // ★ F5-F8-pl (03.10.2026): Polnisch ebenso - Hauptsprache und Englisch, Deutsch nie.
  pl: Object.freeze(["pl", "en"] as Lang[]),
  // ★ F5-F8-cs (03.10.2026): Tschechisch ebenso - Hauptsprache und Englisch, Deutsch nie.
  cs: Object.freeze(["cs", "en"] as Lang[]),
  // ★★★ GEN-HAUPTSPRACHE (29.10.2026): die neun neuen Wege ebenso - Hauptsprache und Englisch, Deutsch nie.
  bg: Object.freeze(["bg", "en"] as Lang[]),
  el: Object.freeze(["el", "en"] as Lang[]),
  hu: Object.freeze(["hu", "en"] as Lang[]),
  nl: Object.freeze(["nl", "en"] as Lang[]),
  pt: Object.freeze(["pt", "en"] as Lang[]),
  br: Object.freeze(["br", "en"] as Lang[]),
  ro: Object.freeze(["ro", "en"] as Lang[]),
  sv: Object.freeze(["sv", "en"] as Lang[]),
  uk: Object.freeze(["uk", "en"] as Lang[]),
};

/**
 * ★ D1 Nr. 18: die Hauptsprache des Weges - oder `undefined` (Weg „de"/„en",
 * dort sind Deutsch und Englisch gleichrangig wie bisher).
 */
export function hauptspracheDesWeges(lernweg: Lernweg): Lang | undefined {
  return lernwegDef(lernweg).hauptsprache;
}

/**
 * Die Übungssprache, die auf diesem Weg WIRKLICH gilt. Passt die gespeicherte
 * (Konto, Klasse, Gerät) zum Weg, bleibt sie; sonst gilt die Sprache des
 * Weges - auf Weg „de" Deutsch, auf „en" Englisch, auf „fr"/„es" die
 * Hauptsprache. Gespeichert wird dabei NICHTS: Ein Konto auf Weg „fr" mit
 * `lang: "de"` (angelegt, bevor es diese Regel gab) übt Französisch, und sein
 * Datensatz bleibt, wie er ist. Ein Konto auf Weg „fr" mit `lang: "en"` übt
 * seit D1 Englisch (auf der französischen Reihenfolge).
 */
export function uebungsSpracheImWeg(lang: Lang | undefined, lernweg: Lernweg): Lang {
  const erlaubt = uebungsSprachenImWeg(lernweg);
  if (lang && erlaubt.includes(lang)) return lang;
  return lernwegDef(lernweg).hauptsprache ?? WEG_GRUNDSPRACHE[lernweg];
}

/**
 * ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M3): die Übungssprache, die eine
 * NEUE Klasse vorgeschlagen bekommt - aus der Bedienung der Lehrkraft, passend
 * zum Weg der neuen Klasse. EINE Funktion für den Anfangswert UND das
 * Zurücksetzen nach dem Anlegen: Das Zurücksetzen stand bis hierher als
 * eigene Zeile da (`sprache === "en" ? "en" : "de"`), kannte fr/es nicht, und
 * die ZWEITE Klasse einer spanischen Lehrkraft wurde mit Weg „es" und
 * Übungssprache Deutsch gespeichert.
 */
export function neueKlassenSprache(bedienSprache: BedienSprache, klassenWeg: Lernweg): Lang {
  // ★ D1 Nr. 18: Auf einem Weg mit Hauptsprache beginnt die Klasse IMMER mit
  // ihr - auch wenn die Lehrkraft englisch bedient (Englisch ist dort der
  // Zusatz, den sie danach ausdrücklich wählen kann, nicht die Vorgabe).
  const haupt = hauptspracheDesWeges(klassenWeg);
  if (haupt) return haupt;
  return uebungsSpracheImWeg(bedienSprache, klassenWeg);
}

/**
 * ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M2/M3): die Übungssprache, die in
 * einer KLASSE wirklich gilt - für alles, was die Lehrkraft sieht und was für
 * die ganze Klasse gebaut wird (Tippchallenge, Eigene Übung, Kurzstand).
 * Eine Klasse auf Weg „fr" mit gespeichertem „de" (angelegt vor M3) zeigte
 * „Deutsch", während ihre Kinder Französisch üben.
 */
export function klassenUebungsSprache(cls: { lang?: Lang; lernweg?: unknown }): Lang {
  return uebungsSpracheImWeg(cls.lang ?? "de", lernwegVon(cls));
}

/** Ohne Hauptsprache: die Sprache, für die der Weg gebaut ist (Rückfall für fremde Werte). */
// ★ G2a: die vier neuen Wege sind bis zu ihrer eigenen Reihenfolge (F4) ein Alias von „en"
// (`lernwegDef`, ohne `hauptsprache`) und üben darum ENGLISCH - ausdrücklich, nie Deutsch.
// Passt zu `uebungsSprachenImWeg` (de/en wählbar): die wirksame Sprache liegt immer in der Liste.
// Sobald ein Weg seine `hauptsprache` bekommt, steht hier seine eigene Sprache (it seit F5-F8-it, 02.10.2026; pl seit F5-F8-pl, tr seit F5-F8-tr und cs seit F5-F8-cs, 03.10.2026).
const WEG_GRUNDSPRACHE: Record<Lernweg, Lang> = { de: "de", en: "en", fr: "fr", es: "es", it: "it", pl: "pl", tr: "tr", cs: "cs", /* ★ GEN-HAUPTSPRACHE (29.10.2026): die neun Wege üben ihre Hauptsprache - bis dahin ENGLISCH (G2-NEUN), nie Deutsch. */ bg: "bg", el: "el", hu: "hu", nl: "nl", pt: "pt", br: "br", ro: "ro", sv: "sv", uk: "uk" };

/**
 * ★ E2a (25.09.2026): die Übungssprache, die HEUTE wirklich mit Inhalten
 * hinterlegt ist - dieselbe Zweiteilung wie {@link AktiveBedienSprache}
 * (`lib/bedienSprache/sprache.ts`): viele Stellen (Sprachausgabe, `lang`-
 * Attribute, Anzeige-Texte) tippen lokal `"en" | "de"` statt `Lang` zu
 * importieren. `Lang` bleibt die dreiwertige Fassung, die ein Konto/einen
 * Fortschritt SPEICHERN kann (Bauplan-Wächter „fr fällt nie still auf de").
 */
export type AktivLang = "de" | "en";

export const LANG_LABELS: Record<Lang, string> = {
  de: "Deutsch",
  en: "English",
  fr: "Französisch",
  es: "Spanisch",
  // G2a: die Namen der neuen Sprachen sind echte Werte (wie „Spanisch").
  it: "Italienisch",
  pl: "Polnisch",
  tr: "Türkisch",
  cs: "Tschechisch",
  // ★ G2-NEUN (25.10.2026): die Namen der neun Sprachen sind echte Werte (Intl.DisplayNames).
  bg: "Bulgarisch",
  el: "Griechisch",
  hu: "Ungarisch",
  nl: "Niederländisch",
  pt: "Portugiesisch (Portugal)",
  br: "Portugiesisch (Brasilien)",
  ro: "Rumänisch",
  sv: "Schwedisch",
  uk: "Ukrainisch",
};

/**
 * ★ EN2 (19.09.2026): Die Namen der ÜBUNGSSPRACHEN in der englischen
 * Bedienung. Das Auswahlfeld fragt, in welcher Sprache geübt wird - wer die
 * Oberfläche englisch liest, sucht „German", nicht „Deutsch" (anders als beim
 * Sprachschalter der Kopfzeile, der die ZIELSPRACHE in ihr selbst benennt).
 */
export const LANG_LABELS_EN: Record<Lang, string> = {
  de: "German",
  en: "English",
  fr: "French",
  es: "Spanish",
  // G2a: die Namen der neuen Sprachen sind echte Werte.
  it: "Italian",
  pl: "Polish",
  tr: "Turkish",
  cs: "Czech",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Bulgarian",
  el: "Greek",
  hu: "Hungarian",
  nl: "Dutch",
  pt: "Portuguese (Portugal)",
  br: "Portuguese (Brazil)",
  ro: "Romanian",
  sv: "Swedish",
  uk: "Ukrainian",
};

/** ★ E11a-3 (26.09.2026): dieselben Namen der Übungssprachen französisch. */
export const LANG_LABELS_FR: Record<Lang, string> = {
  de: "Allemand",
  en: "Anglais",
  fr: "Français",
  es: "Espagnol",
  // G2a: die Namen der neuen Sprachen sind echte Werte.
  it: "Italien",
  pl: "Polonais",
  tr: "Turc",
  cs: "Tchèque",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Bulgare",
  el: "Grec",
  hu: "Hongrois",
  nl: "Néerlandais",
  pt: "Portugais (Portugal)",
  br: "Portugais (Brésil)",
  ro: "Roumain",
  sv: "Suédois",
  uk: "Ukrainien",
};

/** ★ ES-O (27.09.2026): dieselben Namen der Übungssprachen spanisch (klein, wie im Spanischen üblich). */
export const LANG_LABELS_ES: Record<Lang, string> = {
  de: "Alemán",
  en: "Inglés",
  fr: "Francés",
  es: "Español",
  // G2a: die Namen der neuen Sprachen sind echte Werte.
  it: "Italiano",
  pl: "Polaco",
  tr: "Turco",
  cs: "Checo",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Búlgaro",
  el: "Griego",
  hu: "Húngaro",
  nl: "Neerlandés",
  pt: "Portugués (Portugal)",
  br: "Portugués (Brasil)",
  ro: "Rumano",
  sv: "Sueco",
  uk: "Ucraniano",
};

/** ★ O-IT (02.10.2026): dieselben Namen der Übungssprachen italienisch (gross, weil sie allein im Auswahlfeld stehen). */
export const LANG_LABELS_IT: Record<Lang, string> = {
  de: "Tedesco",
  en: "Inglese",
  fr: "Francese",
  es: "Spagnolo",
  it: "Italiano",
  pl: "Polacco",
  tr: "Turco",
  cs: "Ceco",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Bulgaro",
  el: "Greco",
  hu: "Ungherese",
  nl: "Olandese",
  pt: "Portoghese (Portogallo)",
  br: "Portoghese (Brasile)",
  ro: "Rumeno",
  sv: "Svedese",
  uk: "Ucraino",
};

/** ★ O-PL (02.10.2026): dieselben Namen polnisch (gross, weil sie allein im Auswahlfeld stehen - Glossar Regel 10). */
export const LANG_LABELS_PL: Record<Lang, string> = {
  de: "Niemiecki",
  en: "Angielski",
  fr: "Francuski",
  es: "Hiszpański",
  it: "Włoski",
  pl: "Polski",
  tr: "Turecki",
  cs: "Czeski",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Bułgarski",
  el: "Grecki",
  hu: "Węgierski",
  nl: "Niderlandzki",
  pt: "Portugalski (Portugalia)",
  br: "Portugalski (Brazylia)",
  ro: "Rumuński",
  sv: "Szwedzki",
  uk: "Ukraiński",
};

/**
 * ★ O-TR (02.10.2026): dieselben Namen türkisch (gross, weil sie allein im
 * Auswahlfeld stehen und Sprachnamen im Türkischen ohnehin gross beginnen -
 * "İngilizce", "İspanyolca", "İtalyanca" mit İ).
 */
export const LANG_LABELS_TR: Record<Lang, string> = {
  de: "Almanca",
  en: "İngilizce",
  fr: "Fransızca",
  es: "İspanyolca",
  it: "İtalyanca",
  pl: "Lehçe",
  tr: "Türkçe",
  cs: "Çekçe",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Bulgarca",
  el: "Yunanca",
  hu: "Macarca",
  nl: "Felemenkçe",
  pt: "Portekizce (Portekiz)",
  br: "Portekizce (Brezilya)",
  ro: "Rumence",
  sv: "İsveççe",
  uk: "Ukraynaca",
};

/**
 * ★ O-CS (03.10.2026): dieselben Namen tschechisch - klein, wie Tschechisch
 * Sprachnamen schreibt (Glossar §2.5, gemessen `Intl.DisplayNames`).
 */
export const LANG_LABELS_CS: Record<Lang, string> = {
  de: "němčina",
  en: "angličtina",
  fr: "francouzština",
  es: "španělština",
  it: "italština",
  pl: "polština",
  tr: "turečtina",
  cs: "čeština",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "bulharština",
  el: "řečtina",
  hu: "maďarština",
  nl: "nizozemština",
  pt: "portugalština (Portugalsko)",
  br: "portugalština (Brazílie)",
  ro: "rumunština",
  sv: "švédština",
  uk: "ukrajinština",
};

/** ★ O2-LIB (29.10.2026): die Sprachnamen in der Bedienung bg. */
export const LANG_LABELS_BG: Record<Lang, string> = {
  de: "немски",
  en: "английски",
  fr: "френски",
  es: "испански",
  it: "италиански",
  pl: "полски",
  tr: "турски",
  cs: "чешки",
  bg: "български",
  el: "гръцки",
  hu: "унгарски",
  nl: "нидерландски",
  pt: "португалски (Португалия)",
  br: "португалски (Бразилия)",
  ro: "румънски",
  sv: "шведски",
  uk: "украински",
};

/** ★ O2-LIB (29.10.2026): die Sprachnamen in der Bedienung el. */
export const LANG_LABELS_EL: Record<Lang, string> = {
  de: "γερμανικά",
  en: "αγγλικά",
  fr: "γαλλικά",
  es: "ισπανικά",
  it: "ιταλικά",
  pl: "πολωνικά",
  tr: "τουρκικά",
  cs: "τσεχικά",
  bg: "βουλγαρικά",
  el: "ελληνικά",
  hu: "ουγγρικά",
  nl: "ολλανδικά",
  pt: "πορτογαλικά (Πορτογαλία)",
  br: "πορτογαλικά (Βραζιλία)",
  ro: "ρουμανικά",
  sv: "σουηδικά",
  uk: "ουκρανικά",
};

/** ★ O2-LIB (29.10.2026): die Sprachnamen in der Bedienung hu. */
export const LANG_LABELS_HU: Record<Lang, string> = {
  de: "német",
  en: "angol",
  fr: "francia",
  es: "spanyol",
  it: "olasz",
  pl: "lengyel",
  tr: "török",
  cs: "cseh",
  bg: "bolgár",
  el: "görög",
  hu: "magyar",
  nl: "holland",
  pt: "portugál (Portugália)",
  br: "portugál (Brazília)",
  ro: "román",
  sv: "svéd",
  uk: "ukrán",
};

/** ★ O2-LIB (29.10.2026): die Sprachnamen in der Bedienung nl. */
export const LANG_LABELS_NL: Record<Lang, string> = {
  de: "Duits",
  en: "Engels",
  fr: "Frans",
  es: "Spaans",
  it: "Italiaans",
  pl: "Pools",
  tr: "Turks",
  cs: "Tsjechisch",
  bg: "Bulgaars",
  el: "Grieks",
  hu: "Hongaars",
  nl: "Nederlands",
  pt: "Portugees (Portugal)",
  br: "Portugees (Brazilië)",
  ro: "Roemeens",
  sv: "Zweeds",
  uk: "Oekraïens",
};

/** ★ O2-LIB (29.10.2026): die Sprachnamen in der Bedienung pt. */
export const LANG_LABELS_PT: Record<Lang, string> = {
  de: "alemão",
  en: "inglês",
  fr: "francês",
  es: "espanhol",
  it: "italiano",
  pl: "polaco",
  tr: "turco",
  cs: "checo",
  bg: "búlgaro",
  el: "grego",
  hu: "húngaro",
  nl: "neerlandês",
  pt: "português (Portugal)",
  br: "português (Brasil)",
  ro: "romeno",
  sv: "sueco",
  uk: "ucraniano",
};

/** ★ O2-LIB (29.10.2026): die Sprachnamen in der Bedienung br. */
export const LANG_LABELS_BR: Record<Lang, string> = {
  de: "alemão",
  en: "inglês",
  fr: "francês",
  es: "espanhol",
  it: "italiano",
  pl: "polonês",
  tr: "turco",
  cs: "tcheco",
  bg: "búlgaro",
  el: "grego",
  hu: "húngaro",
  nl: "holandês",
  pt: "português (Portugal)",
  br: "português (Brasil)",
  ro: "romeno",
  sv: "sueco",
  uk: "ucraniano",
};

/** ★ O2-LIB (29.10.2026): die Sprachnamen in der Bedienung ro. */
export const LANG_LABELS_RO: Record<Lang, string> = {
  de: "germană",
  en: "engleză",
  fr: "franceză",
  es: "spaniolă",
  it: "italiană",
  pl: "poloneză",
  tr: "turcă",
  cs: "cehă",
  bg: "bulgară",
  el: "greacă",
  hu: "maghiară",
  nl: "neerlandeză",
  pt: "portugheză (Portugalia)",
  br: "portugheză (Brazilia)",
  ro: "română",
  sv: "suedeză",
  uk: "ucraineană",
};

/** ★ O2-LIB (29.10.2026): die Sprachnamen in der Bedienung sv. */
export const LANG_LABELS_SV: Record<Lang, string> = {
  de: "tyska",
  en: "engelska",
  fr: "franska",
  es: "spanska",
  it: "italienska",
  pl: "polska",
  tr: "turkiska",
  cs: "tjeckiska",
  bg: "bulgariska",
  el: "grekiska",
  hu: "ungerska",
  nl: "nederländska",
  pt: "portugisiska (Portugal)",
  br: "portugisiska (Brasilien)",
  ro: "rumänska",
  sv: "svenska",
  uk: "ukrainska",
};

/** ★ O2-LIB (29.10.2026): die Sprachnamen in der Bedienung uk. */
export const LANG_LABELS_UK: Record<Lang, string> = {
  de: "німецька",
  en: "англійська",
  fr: "французька",
  es: "іспанська",
  it: "італійська",
  pl: "польська",
  tr: "турецька",
  cs: "чеська",
  bg: "болгарська",
  el: "грецька",
  hu: "угорська",
  nl: "нідерландська",
  pt: "португальська (Португалія)",
  br: "португальська (Бразилія)",
  ro: "румунська",
  sv: "шведська",
  uk: "українська",
};

const LANG_LABELS_JE_SPRACHE: Record<BedienSprache, Record<Lang, string>> = {
  de: LANG_LABELS,
  en: LANG_LABELS_EN,
  fr: LANG_LABELS_FR,
  es: LANG_LABELS_ES,
  it: LANG_LABELS_IT,
  pl: LANG_LABELS_PL,
  tr: LANG_LABELS_TR,
  cs: LANG_LABELS_CS,
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: LANG_LABELS_BG,
  el: LANG_LABELS_EL,
  hu: LANG_LABELS_HU,
  nl: LANG_LABELS_NL,
  pt: LANG_LABELS_PT,
  br: LANG_LABELS_BR,
  ro: LANG_LABELS_RO,
  sv: LANG_LABELS_SV,
  uk: LANG_LABELS_UK,
};

/** Der Name einer Übungssprache in der Sprache der Bedienung (Vorgabe Deutsch). */
export function langLabel(l: Lang, sprache: BedienSprache = "de"): string {
  return LANG_LABELS_JE_SPRACHE[sprache][l];
}

/**
 * Alters-/Textstufe steuert Wortschatz, Witz-Niveau und Tonfall der Übungen.
 *
 * ── DREI STUFEN statt vier (S1, 15.08.2026) ─────────────────────────────────
 *
 * Bis 14.08. gab es vier Stufen `a` (7-9), `b` (10-12), `c` (13-15) und
 * `erwachsen`. Seit dem Bauplan vom 14.08. (§0.2 + Nachtrag §0b.2) sind es
 * DREI: `kids` (7-10), `teens` (11-15) und `erwachsen` (ab 16).
 *
 * Der Typ trägt weiterhin BEIDE Wertemengen — und das bleibt so:
 *
 *  • **Inhalte** sind seit Charge S3 (15.08.2026) sauber. Jede Korpus-Zeile,
 *    jede Serie, jeder Themenstrang trägt kids/teens/erwachsen; dafür gibt es
 *    den engeren Typ {@link InhaltsStufe}, und `tsc` meldet jeden Rückfall.
 *  • **Konten** dagegen (localStorage-Blobs und das PocketBase-Textfeld
 *    `tt_pupils.stufe`) enthalten die alten Werte noch monatelang — solange,
 *    bis jedes Kind sich einmal angemeldet hat. Sie bleiben LESBAR und werden
 *    beim Laden übersetzt ({@link migriereStufe}); beim nächsten Speichern
 *    steht der neue Wert drin. Diesen Typ zu verengen hieße, gespeicherte
 *    Konten für ungültig zu erklären.
 *
 * Wer die WÄHLBAREN Stufen meint, nimmt {@link KontoStufe} (drei Werte); wer
 * ein Inhalts-Etikett meint, {@link InhaltsStufe} (dieselben drei).
 */
export type Stufe = "a" | "b" | "c" | "erwachsen" | "kids" | "teens";

/**
 * Die Etiketten, mit denen INHALTE getaggt sind (Korpus, Serien, Bögen,
 * Podcasts) — seit Charge S3 (15.08.2026) dieselben drei Werte wie bei den
 * Konten. Inhalts-Etikett und Konto-Stufe sind damit ein und dasselbe;
 * {@link contentStufenFor} ist die Identität.
 *
 * Die alten Werte `a`/`b`/`c` gibt es hier NICHT mehr — 2060 Etiketten-Literale
 * sind in den Phasen 1 und 2 umgeschrieben worden, und `tsc` meldet seither
 * jeden vergessenen Rest. Im Typ {@link Stufe} leben sie weiter, weil
 * gespeicherte KONTEN sie noch monatelang tragen ({@link migriereStufe}).
 */
export type InhaltsStufe = KontoStufe;

/**
 * Die vier Etiketten der alten Einteilung. Sie stehen in keinem Inhalt mehr —
 * nur noch in gespeicherten Konten, wo {@link migriereStufe} sie übersetzt. Der
 * Wächter `typing-drei-stufen.test.ts` prüft beides.
 */
export const ALT_ETIKETTEN = ["a", "b", "c", "erwachsen"] as const;

export const INHALTS_STUFEN: InhaltsStufe[] = ["kids", "teens", "erwachsen"];

/**
 * Die Stufen, die ein Mensch WÄHLEN kann (Einrichtung, Zahnrad, Klasse) — die
 * drei neuen. `Stufe` bleibt weiter — auch nach Charge S3 — die größere Menge:
 * gespeicherte Konten tragen die alten Werte noch lange, {@link migriereStufe}
 * übersetzt sie beim Lesen.
 */
export type KontoStufe = "kids" | "teens" | "erwachsen";

export const STUFEN: KontoStufe[] = ["kids", "teens", "erwachsen"];

/**
 * Vorgabe für alle, die nichts gewählt haben — auch für anonyme Besucher
 * (Bauplan §4 S1: bisher `b`). Begründung: Ein 12-Jähriger mit Kinder-Ton ist
 * das gemeldete Problem; ein 10-Jähriger mit trockenem Ton nur nüchtern, und
 * die Lehrkraft kann je Kind korrigieren.
 */
export const VORGABE_STUFE: Stufe = "teens";

/**
 * Beschriftungen der drei Stufen (Spannen aus Bauplan §0b.2, nur einfacher
 * Bindestrich — [[feedback_nur_bindestrich]]).
 *
 * Die vier ALTEN Werte stehen hier nur noch, weil ein gespeichertes Konto sie
 * tragen kann, bevor {@link migriereStufe} es angefasst hat; sie zeigen darum
 * die Beschriftung ihrer NACHFOLGERIN, nicht mehr die alte Altersspanne. Nach
 * Charge S3 etikettiert kein Inhalt mehr mit a/b/c, also gibt es auch nichts
 * mehr, wofür „7-9 Jahre" die richtige Auskunft wäre.
 */
export const STUFE_LABELS: Record<Stufe, string> = {
  kids: "7-10 Jahre",
  teens: "11-15 Jahre",
  erwachsen: "ab 16 Jahren",
  a: "7-10 Jahre",
  b: "11-15 Jahre",
  c: "11-15 Jahre",
};

/**
 * ★ EN2 (19.09.2026): dieselben Stufen in der englischen Bedienung - Glossar
 * §3.4 („Textstufe" = *text age group*: *Ages 7-10* · *Ages 11-15* · *16 and
 * over*). Gross geschrieben, weil sie allein in einem Auswahlfeld stehen.
 */
export const STUFE_LABELS_EN: Record<Stufe, string> = {
  kids: "Ages 7-10",
  teens: "Ages 11-15",
  erwachsen: "16 and over",
  a: "Ages 7-10",
  b: "Ages 11-15",
  c: "Ages 11-15",
};

/**
 * ★ E11a-3 (26.09.2026, Bauplan §9.2 Glossar „Schulstufe"): dieselben Stufen
 * französisch - genau das Beispiel aus dem Glossar („7-10 ans").
 */
export const STUFE_LABELS_FR: Record<Stufe, string> = {
  kids: "7-10 ans",
  teens: "11-15 ans",
  erwachsen: "16 ans et plus",
  a: "7-10 ans",
  b: "11-15 ans",
  c: "11-15 ans",
};

/** ★ ES-O (27.09.2026): dieselben Stufen spanisch („7 a 10 años"). */
export const STUFE_LABELS_ES: Record<Stufe, string> = {
  kids: "7 a 10 años",
  teens: "11 a 15 años",
  erwachsen: "16 años o más",
  a: "7 a 10 años",
  b: "11 a 15 años",
  c: "11 a 15 años",
};

/** ★ O-IT (02.10.2026): dieselben Stufen italienisch („7-10 anni", Glossar §2.5). */
export const STUFE_LABELS_IT: Record<Stufe, string> = {
  kids: "7-10 anni",
  teens: "11-15 anni",
  erwachsen: "da 16 anni",
  a: "7-10 anni",
  b: "11-15 anni",
  c: "11-15 anni",
};

/** ★ O-PL (02.10.2026): dieselben Stufen polnisch („7-10 lat", Glossar §2.5). */
export const STUFE_LABELS_PL: Record<Stufe, string> = {
  kids: "7-10 lat",
  teens: "11-15 lat",
  erwachsen: "od 16 lat",
  a: "7-10 lat",
  b: "11-15 lat",
  c: "11-15 lat",
};

/** ★ O-TR (02.10.2026): dieselben Stufen türkisch ("7-10 yaş", Glossar §2.5). */
export const STUFE_LABELS_TR: Record<Stufe, string> = {
  kids: "7-10 yaş",
  teens: "11-15 yaş",
  erwachsen: "16 yaş ve üstü",
  a: "7-10 yaş",
  b: "11-15 yaş",
  c: "11-15 yaş",
};

/** ★ O-CS (03.10.2026): dieselben Stufen tschechisch („7-10 let", Glossar §2.5). */
export const STUFE_LABELS_CS: Record<Stufe, string> = {
  kids: "7-10 let",
  teens: "11-15 let",
  erwachsen: "od 16 let",
  a: "7-10 let",
  b: "11-15 let",
  c: "11-15 let",
};

/** ★ O2-LIB (29.10.2026): die Altersstufen in der Bedienung bg. */
export const STUFE_LABELS_BG: Record<Stufe, string> = {
  kids: "7-10 години",
  teens: "11-15 години",
  erwachsen: "от 16 години",
  a: "7-10 години",
  b: "11-15 години",
  c: "11-15 години",
};

/** ★ O2-LIB (29.10.2026): die Altersstufen in der Bedienung el. */
export const STUFE_LABELS_EL: Record<Stufe, string> = {
  kids: "7-10 ετών",
  teens: "11-15 ετών",
  erwachsen: "από 16 ετών",
  a: "7-10 ετών",
  b: "11-15 ετών",
  c: "11-15 ετών",
};

/** ★ O2-LIB (29.10.2026): die Altersstufen in der Bedienung hu. */
export const STUFE_LABELS_HU: Record<Stufe, string> = {
  kids: "7-10 évesek",
  teens: "11-15 évesek",
  erwachsen: "16 éves kortól",
  a: "7-10 évesek",
  b: "11-15 évesek",
  c: "11-15 évesek",
};

/** ★ O2-LIB (29.10.2026): die Altersstufen in der Bedienung nl. */
export const STUFE_LABELS_NL: Record<Stufe, string> = {
  kids: "7-10 jaar",
  teens: "11-15 jaar",
  erwachsen: "16 jaar en ouder",
  a: "7-10 jaar",
  b: "11-15 jaar",
  c: "11-15 jaar",
};

/** ★ O2-LIB (29.10.2026): die Altersstufen in der Bedienung pt. */
export const STUFE_LABELS_PT: Record<Stufe, string> = {
  kids: "7-10 anos",
  teens: "11-15 anos",
  erwachsen: "16 anos ou mais",
  a: "7-10 anos",
  b: "11-15 anos",
  c: "11-15 anos",
};

/** ★ O2-LIB (29.10.2026): die Altersstufen in der Bedienung br. */
export const STUFE_LABELS_BR: Record<Stufe, string> = {
  kids: "7 a 10 anos",
  teens: "11 a 15 anos",
  erwachsen: "16 anos ou mais",
  a: "7 a 10 anos",
  b: "11 a 15 anos",
  c: "11 a 15 anos",
};

/** ★ O2-LIB (29.10.2026): die Altersstufen in der Bedienung ro. */
export const STUFE_LABELS_RO: Record<Stufe, string> = {
  kids: "7-10 ani",
  teens: "11-15 ani",
  erwachsen: "de la 16 ani",
  a: "7-10 ani",
  b: "11-15 ani",
  c: "11-15 ani",
};

/** ★ O2-LIB (29.10.2026): die Altersstufen in der Bedienung sv. */
export const STUFE_LABELS_SV: Record<Stufe, string> = {
  kids: "7-10 år",
  teens: "11-15 år",
  erwachsen: "från 16 år",
  a: "7-10 år",
  b: "11-15 år",
  c: "11-15 år",
};

/** ★ O2-LIB (29.10.2026): die Altersstufen in der Bedienung uk. */
export const STUFE_LABELS_UK: Record<Stufe, string> = {
  kids: "7-10 років",
  teens: "11-15 років",
  erwachsen: "від 16 років",
  a: "7-10 років",
  b: "11-15 років",
  c: "11-15 років",
};

const STUFE_LABELS_JE_SPRACHE: Record<BedienSprache, Record<Stufe, string>> = {
  de: STUFE_LABELS,
  en: STUFE_LABELS_EN,
  fr: STUFE_LABELS_FR,
  es: STUFE_LABELS_ES,
  it: STUFE_LABELS_IT,
  pl: STUFE_LABELS_PL,
  tr: STUFE_LABELS_TR,
  cs: STUFE_LABELS_CS,
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: STUFE_LABELS_BG,
  el: STUFE_LABELS_EL,
  hu: STUFE_LABELS_HU,
  nl: STUFE_LABELS_NL,
  pt: STUFE_LABELS_PT,
  br: STUFE_LABELS_BR,
  ro: STUFE_LABELS_RO,
  sv: STUFE_LABELS_SV,
  uk: STUFE_LABELS_UK,
};

/** Die Beschriftung einer Textstufe in der Sprache der Bedienung (Vorgabe Deutsch). */
export function stufeLabel(s: Stufe, sprache: BedienSprache = "de"): string {
  return STUFE_LABELS_JE_SPRACHE[sprache][s];
}

/**
 * ALTEN Konto-Wert auf die neue Stufe übersetzen — die EINE Lese-Übersetzung
 * (Skizze §5 Schritt 2). Sie läuft an genau zwei Grenzen: beim Laden des
 * lokalen Speichers ({@link load}) und beim Lesen eines PocketBase-Datensatzes
 * (`pbBackend.mapPupil`).
 *
 *   a → kids · b → teens · c → teens · erwachsen → erwachsen
 *
 * Unbekanntes und Leeres wird zu `undefined` — „nichts gewählt", nicht
 * „teens gewählt". Das ist wichtig für das Vorrangmodell in {@link stufeFuer}:
 * nur eine AUSDRÜCKLICH gesetzte Stufe übersteuert das Geburtsjahr.
 */
export function migriereStufe(roh: unknown): Stufe | undefined {
  switch (roh) {
    case "a":
      return "kids";
    case "b":
    case "c":
      return "teens";
    case "kids":
    case "teens":
    case "erwachsen":
      return roh;
    default:
      return undefined;
  }
}

/**
 * Welche INHALTS-Etiketten darf diese Stufe servieren? Seit Charge S3 die
 * IDENTITÄT: `kids → kids`, `teens → teens`, `erwachsen → erwachsen`.
 *
 * Warum es die Funktion trotzdem noch gibt (und nicht ersatzlos verschwindet):
 * Sie ist die EINE Stelle, an der die Konto-Welt auf die Inhalts-Welt trifft —
 * Korpus, Serien, Themenstränge, Podcasts und der Wortschatz-Generator fragen
 * alle hier. Ein gespeichertes Konto trägt außerdem noch die ALTEN Werte
 * (`a`/`b`/`c`), falls es an {@link migriereStufe} vorbei hereinkommt; die
 * bilden hier auf ihre Nachfolgerin ab, damit niemand vor einer leeren
 * Textwelt sitzt.
 *
 * Der Weg dorthin (Bauplan §4 S3): Phase 0 servierte alte UND neue Etiketten
 * gleichzeitig, damit die Redaktion in unterbrechbaren Schritten laufen konnte;
 * Phase 1 und 2 haben Deutsch und Englisch umgeschrieben; Phase 3 hat die
 * Abbildung auf die Identität verengt.
 */
export function contentStufenFor(stufe: Stufe): InhaltsStufe[] {
  switch (stufe) {
    case "kids":
    case "teens":
    case "erwachsen":
      return [stufe];
    // Alt-Werte aus gespeicherten Konten (a → kids, b/c → teens), identisch zu
    // {@link migriereStufe}. Doppelt gemoppelt ist hier Absicht: ein Konto ohne
    // Migration soll Texte sehen, nicht eine leere Liste.
    case "a":
      return ["kids"];
    case "b":
    case "c":
      return ["teens"];
  }
}

/* ── Geburtsjahr: die Stufe wächst mit ─────────────────────────────────────*/

/**
 * Kleinste und größte Jahreszahl, die als Geburtsjahr durchgeht. Alles
 * außerhalb ist ein Tippfehler (2062 statt 2016) und wird behandelt, als wäre
 * nichts angegeben — lieber die Vorgabe als eine absurde Stufe.
 */
export const GEBURTSJAHR_MIN_ALTER = 3;
export const GEBURTSJAHR_MAX_ALTER = 120;

/** Das Alter, das jemand in DIESEM Kalenderjahr erreicht (nur das Jahr ist bekannt). */
export function alterImJahr(geburtsjahr: number, jetzt: number = Date.now()): number {
  return new Date(jetzt).getFullYear() - geburtsjahr;
}

/**
 * Eingabefeld-Text → Jahreszahl. Leer, unvollständig oder unplausibel ergibt
 * `undefined` = „noch keine brauchbare Zahl".
 *
 * ⚠️ Diese Funktion MELDET NICHTS. Sie läuft bei jedem Tastendruck mit, und
 * „20" auf dem Weg zu „2016" ist kein Fehler, sondern eine halb getippte Zahl.
 * Wer eine Meldung braucht (seit 30.08.2026 die Selbst-Anmeldung und das
 * Anlege-Formular der Lehrkraft), prüft BEIM ABSENDEN gegen dasselbe
 * `undefined` — eine Stelle, zwei Zeitpunkte, keine zweite Regel.
 */
export function geburtsjahrAusText(
  text: string,
  jetzt: number = Date.now(),
): number | undefined {
  const n = Number.parseInt(text.trim(), 10);
  return istPlausiblesGeburtsjahr(n, jetzt) ? n : undefined;
}

export function istPlausiblesGeburtsjahr(
  geburtsjahr: unknown,
  jetzt: number = Date.now(),
): geburtsjahr is number {
  if (typeof geburtsjahr !== "number" || !Number.isInteger(geburtsjahr)) return false;
  const alter = alterImJahr(geburtsjahr, jetzt);
  return alter >= GEBURTSJAHR_MIN_ALTER && alter <= GEBURTSJAHR_MAX_ALTER;
}

/**
 * Stufe aus dem Geburtsjahr (Bauplan §0b.3): unter 11 → kids, 11 bis 15 →
 * teens, ab 16 → erwachsen.
 *
 * Gerechnet wird mit dem Alter, das jemand IN DIESEM KALENDERJAHR erreicht —
 * mehr gibt ein blankes Geburtsjahr nicht her (Datenminimierung: der Tag wird
 * bewusst nicht erhoben). Ein 2015 geborenes Kind ist damit ab dem 1. Jänner
 * 2026 `teens`, auch wenn es erst im Herbst elf wird. Die Alternative wäre, es
 * ein ganzes Jahr zu jung einzustufen; die Lehrkraft kann jederzeit von Hand
 * übersteuern.
 *
 * `null` = unplausibles Jahr, also behandeln wie „nicht angegeben".
 */
export function stufeAusGeburtsjahr(
  geburtsjahr: unknown,
  jetzt: number = Date.now(),
): Stufe | null {
  if (!istPlausiblesGeburtsjahr(geburtsjahr, jetzt)) return null;
  return stufeAusAlter(alterImJahr(geburtsjahr, jetzt));
}

/**
 * ★★★ DIE REGEL SELBST - Alter zu Textstufe, an EINER Stelle (11.09.2026, B9).
 *
 * Sie stand bis dahin ausgeschrieben in {@link stufeAusGeburtsjahr}. Seit die
 * Klasse ihre Textstufe aus der SCHULSTUFE bekommt (Alter = Schulstufe + 6,
 * `klassenEinstellungen.ts`), gibt es einen zweiten Weg zum selben Alter - und
 * zwei Fassungen der Grenzen 11 und 16 wären genau die Doppelung, die sich am
 * zweiten Tag auseinanderlebt
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export function stufeAusAlter(alter: number): Stufe {
  if (alter < 11) return "kids";
  if (alter < 16) return "teens";
  return "erwachsen";
}

/**
 * DAS VORRANGMODELL — welche Stufe gilt für dieses Konto?
 *
 * ★★★ IN EINEM SATZ (Johannes 30.08.2026, als das Geburtsjahr zur Bedingung
 * für eine Anmeldung wurde): **Ein von Hand gesetzter Wert ist ein
 * absichtlicher Eingriff und bleibt stehen; ohne ihn wächst die Stufe mit dem
 * Geburtsjahr mit.** Wörtlich: „wer geburtsjahr eingibt bekommt die stufe
 * automatisch, wer sie nachträglich in einstellungen ändert hat sie eben so
 * geändert wie er das möchte."
 *
 * Die beiden Zweige unten sind darum KEIN Widerspruch und keine Doppelung, die
 * einander nicht kennt: Der erste ist eine Entscheidung, der zweite ein
 * Automatismus - und eine Entscheidung schlägt einen Automatismus. Genau
 * deshalb sind am 30.08.2026 die vier Stufen-Schalter aus der EINRICHTUNG
 * verschwunden (dort standen sie neben dem Jahr und nahmen ihm still die
 * Wirkung), während die Auswahl im ZAHNRAD bleibt: Dort ist sie das, was sie
 * sein soll - eine Ausnahme, die jemand bewusst setzt.
 *
 *   1. Eine AUSDRÜCKLICH gesetzte `stufe` gewinnt immer. Wer im Zahnrad, in der
 *      Einrichtung oder in „Meine Klassen" eine Stufe wählt, hat entschieden;
 *      das Geburtsjahr redet danach nicht mehr hinein (es bleibt gespeichert,
 *      falls die Wahl später wieder aufgehoben wird).
 *   2. Sonst zählt das `geburtsjahr` — und zwar bei JEDEM Aufruf neu. So wandert
 *      ein Kind zum Jahreswechsel von selbst von kids nach teens, ohne dass
 *      jemand etwas umstellen müsste („die Texte wachsen mit dir mit").
 *   3. Sonst die {@link VORGABE_STUFE} (teens) — auch für anonyme Besucher.
 *
 * „Nicht gesetzt" heißt: `stufe` fehlt oder ist leer. Genau darum liefert
 * {@link migriereStufe} für Unbekanntes `undefined` statt eines Ersatzwertes —
 * ein automatisch eingesetzter Vorgabewert wäre von einer echten Wahl nicht
 * mehr zu unterscheiden und würde das Geburtsjahr für immer stumm schalten.
 */
export function stufeFuer(
  konto: { stufe?: Stufe; geburtsjahr?: number } | null | undefined,
  jetzt: number = Date.now(),
): Stufe {
  if (konto?.stufe) return konto.stufe;
  return stufeAusGeburtsjahr(konto?.geburtsjahr, jetzt) ?? VORGABE_STUFE;
}

/**
 * ★★★★★ GEHÖRT DIESE PERSON EINER KLASSE AN? (04.09.2026)
 *
 * Der eine Satz, aus dem folgt, wer seine Lern-Einstellungen selbst setzen darf
 * — Geburtsjahr, „Zeit lassen" (Tempo) und „Womit anfangen?" (Startpunkt).
 *
 * Johannes am 03.09.2026 abends:
 *
 *   „Alle, die nicht einer Klasse zugeordnet sind, müssen sich das selbst in
 *    den Einstellungen einstellen können, sowie auch Tempo. Nur Schüler einer
 *    Klasse können das nicht ändern."
 *
 * | Wer | in einer Klasse? | darf selbst setzen |
 * |---|---|---|
 * | Gast (nicht angemeldet) | nein | ja |
 * | Lehrkraft, die selbst übt | nein | ja |
 * | Selbstlernendes Konto | nein | ja |
 * | Kind einer Klasse | **ja** | nein — die Lehrkraft führt es |
 *
 * ⚠️ WARUM DAS EINE FUNKTION IST UND KEINE DREI AUSDRÜCKE. Genau diese Regel
 * stand in `TippenTrainerPage` dreimal ausgeschrieben, und zwei der drei
 * Fassungen fragten `!account` („ist niemand angemeldet?") statt nach der
 * Klasse. Eine Lehrkraft ist angemeldet und hat trotzdem keine Lehrkraft über
 * sich — sie fiel damit in die Sperre, die für Kinder einer Klasse gedacht
 * ist, und konnte weder Startpunkt noch Tempo für sich einstellen (gemeldet
 * von Johannes am 04.09.2026, nachdem Lehrkräfte seit dem 03.09. selbst üben).
 *
 * Wer diese Regel ändert, ändert seither alle Stellen zugleich — das ist der
 * Zweck. Wächter: `tests/tastenflow-selbst-einstellen.test.ts`.
 *
 * Am Server steht dieselbe Regel ein zweites Mal (`tt_pupils_field_guard`),
 * dort aber von der anderen Seite: Er schreibt gespeicherte Werte zurück,
 * solange das Konto nicht `selfManaged` ist — und fasst Lehrkräfte gar nicht
 * an, weil sie in `tt_pupils` keinen Datensatz haben.
 */
export function gehoertEinerKlasse(
  konto: { role?: TypingRole; selfManaged?: boolean } | null | undefined,
): boolean {
  return konto?.role === "schueler" && !konto.selfManaged;
}

export interface TypingAccount {
  id: string;
  role: TypingRole;
  name: string;
  email?: string; // Lehrkraft
  classCode?: string; // Schüler:in
  /**
   * Schüler:in — AUSDRÜCKLICH gewählte Textstufe (von Lehrkraft oder Kind
   * gesetzt, änderbar). Fehlt sie, entscheidet das {@link geburtsjahr}, sonst
   * die {@link VORGABE_STUFE} — siehe {@link stufeFuer}. Lies sie NIE direkt,
   * wenn du wissen willst, welche Texte jemand bekommt: dafür ist `stufeFuer`
   * da.
   */
  stufe?: Stufe;
  /**
   * Geburtsjahr — NUR die Jahreszahl (Datenminimierung, Bauplan §0b.3).
   *
   * ⚠️ SEIT 30.08.2026 KEINE FREIWILLIGE ANGABE MEHR. Wer sich selbst anmeldet,
   * gibt es an; für Kinder einer Klasse gibt es die Lehrkraft beim Anlegen an
   * (`KlasseUndKinder.tsx`). Der Grund steht bei {@link stufeFuer}: Ohne Jahr
   * wächst nichts mit, und die Texte bleiben für immer die vom ersten Tag.
   *
   * Im TYP bleibt es optional, und das ist Absicht: Es gibt Konten aus der Zeit
   * davor, und ein Gast ohne Anmeldung hat ohnehin keines. Der Typ beschreibt,
   * was vorkommen KANN, nicht, was die Formulare verlangen.
   *
   * Ist es gesetzt und wurde KEINE Stufe ausdrücklich gewählt, wächst die Stufe
   * von selbst mit ({@link stufeAusGeburtsjahr}).
   */
  geburtsjahr?: number;
  /**
   * ★ 25.09.2026 (Johannes): die eigene SCHULSTUFE dieses Kindes - gesetzt von
   * der Lehrkraft in „Meine Klassen", gilt statt der Schulstufe der Klasse
   * (`mitKlassenVorrang`). Werte wie {@link TypingClass.schulstufe}: fehlt/0 =
   * wie die Klasse, 1-13, 100 = Erwachsen. Mit {@link schulstufeSchuljahr}
   * wächst sie jedes Schuljahr mit.
   */
  schulstufe?: number;
  /** Schuljahr (Startjahr), in dem {@link schulstufe} eingetragen wurde. */
  schulstufeSchuljahr?: number;
  /** Sprache der Übungsinhalte (Deutsch/Englisch). */
  lang?: Lang;
  /** true → Lehrkraft hat die Sprache gesperrt; Schüler:in kann sie nicht mehr selbst ändern. */
  langLocked?: boolean;
  /**
   * ★ Zeilenende mit Enter (23.09.2026) - true = die Klasse dieses Kindes
   * verlangt, dass jede Übungszeile mit der Eingabetaste abgeschlossen wird
   * (siehe {@link TypingClass.zeilenEndeEnter}). Gerechnet beim Laden über
   * {@link mitKlassenVorrang} (`useTypingAuth.ts`), wie `lang`/`langLocked` -
   * ein selbstlernendes Konto hat nie eine Klasse und bleibt bei `undefined`
   * (wirkt als „aus").
   */
  zeilenEndeEnter?: boolean;
  /**
   * SELBSTLERNEND (09.08.2026): Dieses Konto hat sich selbst angelegt — keine
   * Klasse, keine Lehrkraft, dafür eine echte E-Mail-Adresse. Folgen: kein
   * Klassencode, keine Lehrkraft-Vorgaben (Wochenziel, Sprachsperre, Tempo),
   * eigener Wochenbericht per Mail und die Löschfrist nach einem ruhenden Jahr.
   */
  selfManaged?: boolean;
  /**
   * E-Mail-Adresse durch den Link in der Bestätigungs-Mail bewiesen
   * (09.08.2026). Solange das fehlt, geht KEIN Wochenbericht dorthin — sonst
   * schriebe ein Tippfehler wöchentlich an ein fremdes Postfach.
   */
  verified?: boolean;
  /**
   * true → der wöchentliche Übe-Bericht per E-Mail ist ABBESTELLT (23.08.2026).
   *
   * Warum ein AUS-Feld und kein AN-Feld: Ein fehlender Wert bedeutet so „Post
   * wie bisher". Ein `mailWeeklyOn` hätte beim ersten Speichern alle
   * Bestandskonten stillschweigend abgemeldet.
   *
   * Zwei Wege setzen es: der Ein-Klick-Link unten in jeder Wochenbericht-Mail
   * (Server-Route, ohne Anmeldung) und der Umschalter unter „Meine
   * Zugangsdaten" — der ihn auch wieder AUSschaltet. Nur selbstverwaltete
   * Konten bekommen diese Mail überhaupt; bei einem Kind einer Klasse steht das
   * Feld herum, ohne etwas zu bedeuten.
   */
  mailWeeklyOptOut?: boolean;
  /** Schüler:in — Anforderungs-Stufe (Tempo-Ziel beim Aufstieg). */
  tempo?: TempoLevel;
  /**
   * Schüler:in — VORKENNTNISSE: So viele Lern-Einheiten sind freigeschaltet,
   * ohne dass das Kind sie hier erarbeiten musste (die Lehrkraft trägt ein, was
   * es schon kann). Die benannten Stufen stehen in `letters.startPoints()`.
   *
   * ★ Der Wert ist ein WUNSCH, kein Zustand: Die Wahrheit über freigeschaltete
   * Tasten steht im Fortschritt (`introduced`). Angewandt wird er beim nächsten
   * Laden durch das Kind selbst (`letters.startpunktAnwenden`). Das ist kein
   * Umweg, sondern die Sicherheitsgrenze: Den Fortschritt darf nur das Kind
   * schreiben (Regel `lw_progress.update`), dieses Feld nur die Lehrkraft
   * (Server-Guard `tt_pupils_field_guard`) bzw. ein Konto ohne Lehrkraft
   * selbst.
   *
   * ★★★ SEIT 04.09.2026 GILT ER IN BEIDE RICHTUNGEN (Johannes: *„Lehrer dürfen
   * ihre Schüler auch downgraden"*, Anlass war ein zu hoch eingestellter
   * Startpunkt bei Said). Ein neu gesetzter Wert schaltet also auch zurück -
   * einmal, siehe {@link startUnitsAt}.
   */
  startUnits?: number;
  /**
   * Schüler:in — WANN der Startpunkt zuletzt eingestellt wurde (ms).
   *
   * ★★★ Das ist die Zeile, an der das Zurückstufen hängt: Sie unterscheidet
   * einen frischen BESCHLUSS von einem Wert, der seit Wochen dasteht. Ohne sie
   * müsste die Regel den Wert vergleichen - und eine Lehrkraft, die ein Kind
   * auf genau den Wert zurückstellt, den sie damals eingetragen hat, träfe auf
   * ein Bedienelement, das nichts tut.
   *
   * Additiv: Fehlt der Zeitpunkt (jedes Konto vor dem 04.09.2026), wird NICHTS
   * zurückgestuft - es läuft die alte, nur dazunehmende Angleichung.
   */
  startUnitsAt?: number;
  /**
   * ★ E1 (24.09.2026) - der LERNWEG: in welcher Reihenfolge die Tasten kommen
   * (`lernweg.ts`, Bauplan englischer Lehrgang §2.2). Fehlt er, gilt „de" -
   * das ist jedes heute bestehende Konto. Lies ihn nie direkt, sondern über
   * `lernwegVon(konto)`.
   *
   * ★★★ Wird beim ERSTEN Fortschritt festgelegt und springt danach nie mehr
   * um (D2) - am Server erzwungen: `tt_pupils_field_guard.pb.js` lässt das
   * Feld nur schreiben, solange es leer ist. Ein Kind einer Klasse erbt beim
   * Anlegen den Weg der Klasse ({@link TypingClass.lernweg}).
   *
   * ⚠️ `startUnits` ist eine ANZAHL und gilt nur zusammen mit diesem Weg (§2.4).
   */
  lernweg?: Lernweg;
  /**
   * Schüler:in — Beschlüsse der Lehrkraft für Plus (23.09.2026): eigene
   * Schulstufe und Einstufungen je Übung. Roh wie gespeichert - geprüft und
   * gedeutet wird er ausschliesslich in `lib/plus/beschluss.ts`
   * (`heileBeschluss`), damit dieses gemeinsame Modul nichts von Plus wissen
   * muss. Nur die Lehrkraft schreibt ihn (`tt_pupils_field_guard`, LOCKED).
   */
  plusBeschluss?: unknown;
  /** Schüler:in — Wochenziel: Mindest-Minuten je Übungseinheit. */
  goalMinutes?: number;
  /** Schüler:in — Wochenziel: Anzahl Übungseinheiten pro Woche. */
  goalUnits?: number;
  /** Schüler:in — Ziel-Kalenderwochen (ISO „2026-W25"). Leer = jede Woche. */
  goalWeeks?: string[];
  /** Schüler:in — verpasste Wochenziele müssen nachgeholt werden (Standard aus). */
  goalCatchUp?: boolean;
  /**
   * Schüler:in — Stichwoche eines „Überfällige zurücksetzen" (ISO „2026-W25"). Wochen
   * VOR dieser zählen nicht mehr als verpasste Ziel-Woche (Rückstand gestrichen, ab hier
   * frisch). Leer = nie zurückgesetzt. Von der Lehrkraft gesetzt (Johannes 15.07.).
   */
  goalResetWeek?: string;
  /**
   * Schüler:in — einzeln ERLASSENE Wochen (ISO „2026-W25", gleiches Format wie
   * {@link goalWeeks}). Eine hier genannte Woche zählt nie als versäumt oder
   * nachzuholen - unabhängig davon, ob sie eine Ziel-Woche war (Befund
   * 16.09.2026: Lehrkraft braucht das bei Krankheit eines Kindes, „Überfällige
   * zurücksetzen" trifft dafür zu grob, weil es ALLES vor einem Stichtag
   * streicht statt einer einzelnen Woche dazwischen). Die geübte Zeit bleibt
   * unangetastet - erlassen wird nur die WERTUNG der Woche.
   */
  goalExcusedWeeks?: string[];
  /**
   * ★★★ Schüler:in - der WOCHENZIEL-VERLAUF NEU (W2, 18.09.2026, `wochenziel.ts`):
   * Minuten je Woche, OHNE Einheiten - ersetzt {@link goalMinutes} ×
   * {@link goalUnits} als Rechengrundlage, sobald er nicht-leer ist. Nur die
   * LEHRKRAFT schreibt ihn (`setWochenziel`/`setKlassenWochenziel`), NIE ein
   * Kind selbst - geschützt in `tt_pupils_field_guard.pb.js`, wie `goalWeeks`.
   *
   * ⚠️ Additiv, KEIN Ereignis-Marker mehr (anders als früher geplant): Ist er
   * (noch) leer, rechnet {@link kindWochenzielAusFeldern} ihn verlustfrei aus
   * `goalMinutes`/`goalUnits` um (lazy, ohne zu schreiben) - siehe dort.
   */
  wochenzielVerlauf?: ZielAbschnitt[];
  /**
   * im Griff: Hilfsmittel-Profil des Kindes ("bildschirmlupe" | "nvda" | "jaws"
   * | "ohne" | ""). Freitext im Schema — die gültigen Werte stehen in
   * `lib/computer/profile.profileFuer()`, eine Migration braucht es nie.
   */
  toolProfile?: string;
  /** im Griff: Kompetenzstufe ("L1" | "L1plus" | "L2" | "L3" | ""). */
  skillLevel?: string;
  /**
   * Schüler:in — Kontakt-E-Mail, optional (14.09.2026). NICHT die Login-
   * Adresse (die ist bei Klassen-Kindern erfunden, siehe `synthEmail()`).
   * Ist sie gesetzt, bekommt sie nach jedem Zurücksetzen automatisch das
   * aktuelle Passwort zugeschickt - nur die Lehrkraft darf sie setzen.
   */
  contactEmail?: string;
  /**
   * true → „Einhand schreiben": Die Umschalt-Gegenhand-Regel ist für dieses Kind
   * AUS (Großbuchstaben mit beliebiger Umschalttaste/Feststelltaste). Von der
   * Lehrkraft gesetzt, Standard aus; ein Konto ohne Lehrkraft stellt es seit
   * 19.09.2026 selbst im Zahnrad um, Gäste und Lehrkräfte, die selbst üben,
   * auf dem Gerät (`einhand.ts`). Siehe [[project_zehnfinger_trainer]].
   */
  oneHand?: boolean;
  /**
   * ★ „Gezielt üben" (13.11.2026): einzelne Tasten/Zeichen, die gezielt geübt werden (höchstens 8; Modell und Regeln in
   * `gezielt.ts`). Bei einem Kind einer Klasse stellt die Lehrkraft es ein, bei Selbstlernenden sie selbst, Gäste auf
   * dem Gerät (`gezielt.ts`/`useDeviceGezielt`). `null`/fehlt = nicht gesetzt (bei einem Kind: wie die Klasse);
   * `{zeichen: []}` = für dieses Kind aus, auch wenn die Klasse etwas eingestellt hat. Gerechnet beim Laden über
   * `mitKlassenVorrang` (`gezieltFuerKind`).
   */
  gezielt?: Gezielt | null;
  /**
   * true → „Zeit lassen": Für dieses Kind zählt das TEMPO nirgends mehr —
   * keine Zeitfenster im Spiel, kein Tempo-Ziel bei den Sternen, kein Auf- oder
   * Abstieg der Leistungsstufe, und die Übezeit-Uhr rechnet mit langen Pausen.
   * Standard aus.
   *
   * Warum als Eigenschaft des KINDES und nicht der Leistungsstufe (14.08.2026):
   * Zeitdruckfreiheit hing bis dahin allein an Stufe 1 — nur war Stufe 1 kein
   * Ort, an dem ein Kind bleiben durfte. Drei saubere Runden hoben es hinauf
   * (das Tempo sah die Aufstiegsregel gar nicht an), oben scheiterte es am
   * Zeitfenster und fiel zurück: ein Pendel, ohne dass sich seine Leistung
   * änderte. Setzen darf ihn die Lehrkraft (wie „Einhand schreiben"); Konten
   * ohne Lehrkraft und Gäste stellen ihn selbst im Zahnrad um.
   * Siehe [[project_zehnfinger_trainer]].
   */
  noTimePressure?: boolean;
  /**
   * ★★★ „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): grösserer Abstand
   * zwischen JEDEM Zeichen beim Abschreiben - für Kinder mit zerebraler
   * Sehbehinderung (CVI), bei denen eng stehende Zeichen ineinanderlaufen
   * (Crowding). Der Rohwert ist der FAKTOR selbst (1 = aus, 2 = doppelt,
   * 3 = dreifach, 4 = vierfach, 5 = „einfach" - Verdunkelung,
   * Zeilenschaltung und Lesezeile bleiben, nur die Zeichen rücken nicht
   * auseinander, seit 22.09.2026) - siehe {@link zeichenabstandFaktor} für
   * die Normalisierung. Seit 19.09.2026 setzt ihn JEDES Kind selbst im Zahnrad,
   * auch eines einer Klasse (Johannes: *„Kinder dürfen es ändern wie sie
   * möchten"*), und die Lehrkraft je Kind in „Meine Klassen" - wer zuletzt
   * stellt, gilt (`tt_pupils_field_guard.pb.js` prüft nur den Wert). Fehlt
   * das Feld (Alt-Konten) → „aus".
   */
  zeichenabstand?: number;
  /**
   * ★★ „Bereit für die Tippchallenge" (10.09.2026): Das Gerät dieses Kindes
   * kennt den Plan der Challenge mit dieser Kennung - gemeldet zur Zeit `ms`
   * (vom Server gesetzt). Gelesen über `schreibprobe.bereitMeldungAus`.
   */
  probeBereit?: { probeId: string; ms: number };
  /**
   * ★★★ Spendenbanner (Nachbesserung 19.09.2026, `lib/spendenbanner.ts`):
   * wann zuletzt der Spendenbanner GEZEIGT wurde (ms) und bis zu welchem
   * 5-Stunden-Meilenstein - jetzt am KONTO selbst statt nur in
   * `localStorage`, appübergreifend (Tastenflow/»Im Griff« teilen sich das
   * Konto ohnehin, siehe `pbBackend.mapTeacher`/`mapPupil`). 0/fehlend =
   * noch nie gezeigt. Bei einer Lehrkraft gilt es für ALLE ihre Klassen
   * zusammen (siehe `SPENDENBANNER_MINDESTABSTAND_MONATE`); bei einem Kind
   * nur, wenn `selfManaged` ist - ein Kind einer Klasse bekommt den Banner
   * nie und dieses Feld bleibt bei ihm unbenutzt.
   */
  spendenAufrufAm?: number;
  spendenAufrufMeilenstein?: number;
  /**
   * ★★★★★ Eine BESTÄTIGTE Spende (19.09.2026, `lib/spendeBestaetigt.ts`):
   * wann dieses Konto über die Dankesseite zurückkam (ms). Gesetzt ⇒ der
   * Spendenbanner kommt nie wieder, in keinem Programm. Nur das Datum und
   * „hat gespendet" - kein Betrag, keine Zahlungsdaten. 0/fehlend = nie.
   */
  gespendetAm?: number;
  /**
   * ★★ „Was gibt's Neues" (Z3, 19.09.2026, `lib/typing/neuigkeiten.ts`): die
   * Fassung der Neuigkeiten, die diese LEHRKRAFT schon quittiert hat (z. B.
   * „2026-09-19"). Fehlend/leer = noch keine. Nur bei `tt_teachers`.
   */
  neuigkeitenGesehen?: string;
  /**
   * ★★ Der Rundgang beim ersten Betreten (Z4, 19.09.2026, `lib/typing/rundgang.ts`):
   * die Schlüssel der Rundgänge, die dieses KONTO schon gesehen hat (z. B.
   * `"tastenflow-ueben"`). Fehlend/leer = noch keiner. Bei `tt_pupils` UND
   * `tt_teachers` - jedes Konto schreibt seine eigene Liste.
   */
  rundgaengeGesehen?: string[];
  createdAt: number;
}

export interface TypingClass {
  code: string;
  name: string;
  teacherId: string;
  /** Wöchentlicher E-Mail-Bericht an die Lehrkraft (Standard aus). */
  weeklyReport?: boolean;
  /** Zusätzliche Lehrkräfte mit vollen Rechten (Co-Lehrkräfte) — nur lokal/Mock. */
  coTeacherIds?: string[];
  /**
   * Welche Lernprogramme diese Klasse nutzt (Schlüssel wie im Programm-Katalog:
   * "tippen" | "braille" | "klangpunkte" | "computer"). REIN eine Anzeige-
   * Einstellung für „Meine Klassen" (MK-E2): sie steuert, welche Reiter und
   * Spalten die Lehrkraft sieht — sie sperrt NICHTS für das Kind
   * ([[feedback_programme_nicht_einschraenken]]).
   * Leer oder fehlend = alle Programme anzeigen (Bestandsklassen bleiben, wie
   * sie waren).
   */
  programs?: string[];
  /**
   * ★★★ N6 (01.09.2026), ABGESCHAFFT 19.09.2026: Lern-Einstellungen der
   * Klasse - bis dahin liess sich hier ein eigener Wochenrhythmus eintragen
   * („Unterricht am Donnerstag" ⇒ Abgabeschluss Mittwoch 22:00, F27/F29).
   * Johannes (Bauplan §„W · Wochenziel neu"): *„wir bleiben bei Minuten pro
   * Woche ohne Einheiten"* - die Wochengrenze ist seither für ALLE Klassen
   * fest Montag 08:00 (`WOCHENZIEL_GRENZE` in `wochenziel.ts`), nicht mehr
   * einstellbar.
   *
   * ⚠️ KEINE SCHEMA-ÄNDERUNG NÖTIG: `tt_classes.settings` gibt es am Server
   * seit dem 02.07.2026 als JSON-Feld. Ein neues Feld hätte die Deploy-Art
   * »Update LMS (komplett)« erzwungen; so ist es ein gewöhnlicher Deploy.
   */
  settings?: {
    /**
     * ★ LEGACY (bis 19.09.2026): Wochentag der Unterrichtsstunde, Mo=0 …
     * So=6. Wird nirgends mehr gelesen oder geschrieben - bestehende Werte
     * auf alten Klassen bleiben stehen (kein Datenwechsel), sie wirken nur
     * nicht mehr.
     */
    unterrichtstag?: number;
    /** ★ LEGACY - siehe {@link unterrichtstag}. */
    unterrichtstagAbMs?: number;
    /** ★ LEGACY - siehe {@link unterrichtstag}. */
    unterrichtsende?: number;
    /**
     * ★★★ Die gestartete SCHREIBPROBE der Klasse (09.09.2026) - Niveau,
     * Startzeitpunkt, Prüfungszeit, Textnummer und Startzeile, Zeitzuschlag.
     * `null` oder fehlend = keine gestartet, und das ist der Normalfall.
     *
     * Roh vom Server, hier bewusst schwach typisiert: Geprüft wird in
     * `schreibprobe.planAusEinstellungen()`. Ein kaputter Wert darf einem Kind
     * keine Prüfung vor die Nase setzen.
     */
    schreibprobe?: unknown;
    /**
     * ★ Welche Prüfungstexte diese Klasse je Niveau schon geschrieben hat -
     * damit die nächste Schreibprobe einen anderen nimmt. Form:
     * `{ "satz": [0, 3, 7] }`. Gelesen über
     * `schreibprobe.verbrauchtAusEinstellungen()`. Wird nur noch gelesen - für
     * Niveaus ohne Zeiger.
     */
    schreibprobeVerbraucht?: unknown;
    /**
     * ★★ Je Niveau: wo die letzte Challenge begann und welche es war (Texte
     * sparen, 10.09.2026). Form: `{ "satz": { "textNr": 1, "zeile": 57,
     * "probeId": "sp…" } }`. Gelesen über `schreibprobe.zeigerAusEinstellungen()`.
     */
    schreibprobeZeiger?: unknown;
    /**
     * ★ LEGACY (17.09. bis 19.09.2026): der EINE Zeiger auf die „Eigene
     * Übung" der Klasse. Form: `{ textId: "…", angelegtMs: 173… }`. Seit Z1
     * (19.09.2026) gilt {@link TypingClass.eigeneUebungen} - der alte Zeiger
     * wird nur noch gelesen, solange die Reihe leer ist (faules Umziehen,
     * `eigeneUebungReihe.ts`), und beim nächsten Start/Beenden geleert.
     */
    eigeneUebung?: unknown;
    /**
     * ★ D2 (28.09.2026): der Monat (1 = Januar … 12 = Dezember), an dessen
     * Erstem das Schuljahr der Klasse beginnt - Cono Sur Februar,
     * Mittelamerika Januar, DACH August (`schuljahrBeginn.ts`). Fehlend = 1.
     * August wie vor D2. Hier und nicht als eigene Spalte: keine
     * Schema-Änderung, und die Zahl kostet rund 20 der 2000 Byte (gemessen im
     * Befund D2). Gelesen wird IMMER über `schuljahrBeginnVon(cls)`.
     */
    schuljahrBeginn?: number;
  } | null;
  /**
   * ★★★ KLASSEN-EINSTELLUNGEN (11.09.2026) - echte Felder an `tt_classes`,
   * nicht in `settings` (2000 Bytes, siehe `pocketbase/setup.mjs`).
   *
   * Johannes: *„Jede Klasse hat also nur eine Textstufe … Auch oben für die
   * ganze Klasse kann man die Sprache einstellen und ob man sie sperrt."*
   * Bis dahin hingen Textstufe, Geburtsjahr, Sprache und Sperre an jedem
   * Kind einzeln; für ein Kind, das einer Klasse gehört, gilt seit diesem
   * Umbau die KLASSE (gerechnet beim Laden, nicht in jedes Kind kopiert -
   * so gilt sie auch für Kinder, die später beitreten). Die Kind-Felder
   * bleiben für Selbstlernende ohne Klasse.
   */
  /**
   * Schulstufe 1-13 beim Eintragen; 0 oder fehlend = nicht gesetzt;
   * 100 = „Erwachsen" (`SCHULSTUFE_ERWACHSEN` in `klassenEinstellungen.ts`,
   * 11.09.2026 Nacht - wächst nicht mit).
   */
  schulstufe?: number;
  /**
   * Startjahr des Schuljahrs, in dem die Schulstufe eingetragen wurde
   * (2026 für 2026/27). Die App zählt jedes Schuljahr eine Stufe weiter -
   * ohne dieses Jahr wüsste niemand, wie oft.
   */
  schulstufeSchuljahr?: number;
  /** Inhaltssprache der Klasse; fehlend = Vorgabe (Deutsch). */
  lang?: Lang;
  /** Sprache für die Kinder der Klasse gesperrt. */
  langLocked?: boolean;
  /**
   * true = Lehrkraft hat das Klassenmatch abgeschaltet. Bewusst „aus" und
   * nicht „erlaubt": ein neues Bool-Feld ist am Server immer false, und die
   * Vorgabe soll „erlaubt" sein - keine Bestandsklasse braucht Nachpflege.
   */
  klassenmatchAus?: boolean;
  /**
   * ★★★ Startniveau der Klasse als VORGABE (11.09.2026, Nacht - Johannes:
   * „Startniveau als Vorgabe an der Klasse speichern"). So viele
   * Lern-Einheiten sind für jedes Kind der Klasse frei - auch für eines, das
   * später beitritt. Fehlend = keine Vorgabe. Gleicher Name wie am Kind
   * ({@link TypingAccount.startUnits}); gerechnet beim Laden
   * (`startpunktMitKlasse`), nichts wird ins Kind kopiert.
   */
  startUnits?: number;
  /**
   * Wann die Vorgabe zuletzt gesetzt wurde (ms). Wie am Kind macht erst der
   * Zeitstempel aus dem Wert einen Beschluss: Ein Kind mit einem EIGENEN,
   * neueren Beschluss behält ihn.
   */
  startUnitsAt?: number;
  /**
   * ★ E1 (24.09.2026) - der Lernweg für NEUE Kinder dieser Klasse (wie
   * `startUnits` eine Vorgabe). ★★★ Wird NIE auf ein bestehendes Kind
   * angewandt - dessen Weg steht fest (D2). Fehlend = „de".
   */
  lernweg?: Lernweg;
  /**
   * ★ E9 (24.09.2026, Bauplan §8.2) - die Schreibweise-VORGABE der Klasse für
   * ALLE ihre Kinder (anders als `lernweg`: gilt sofort, auch für Kinder, die
   * schon üben - an der Schreibweise hängt keine Taste). Fehlend = „automatisch"
   * (die Erkennung entscheidet, {@link englischVariante}). Nur bei englischer
   * Übungssprache von Bedeutung; nur hinter dem Probe-Schalter des englischen
   * Lehrgangs überhaupt sichtbar/wirksam.
   */
  schreibweise?: EnglischVariante;
  /**
   * ★★★ Wochenziel-VORGABE der Klasse (W2, 18.09.2026, `wochenziel.ts`) -
   * „für die Klasse einstellen" schreibt dieselben drei Werte JEDEM Kind
   * (siehe {@link setKlassenWochenziel}) UND merkt sie hier, damit ein
   * SPÄTER beitretendes Kind sie automatisch bekommt (Johannes, §7g: „alles
   * was für die Klasse gilt, gilt auch für das neue Kind") - siehe
   * {@link addPupil}. `am` ist der Zeitpunkt der Einstellung, nur zur Anzeige.
   */
  wochenzielVorgabe?: { minuten: number; wochen: string[]; nachholen: boolean; am: number };
  /**
   * ★★★ „Eine Stunde sperren" (W2, `wochenziel.ts`) - Zeiträume, in denen
   * Übung dieser Klasse überall sonst zählt, nur NICHT fürs Wochenziel. Siehe
   * {@link GesperrteZeit}, {@link stundeSperren}, {@link sperreAufheben}.
   * Kinder LESEN das Feld über die viewRule ihrer eigenen Klasse.
   */
  gesperrteZeiten?: GesperrteZeit[];
  /**
   * ★★★★★ Die REIHE der „Eigenen Übungen" (Z1, 19.09.2026) - älteste zuerst,
   * höchstens 20. „Eigene Übung starten" hängt an, statt zu ersetzen; jedes
   * Kind arbeitet sie der Reihe nach ab. Eigenes Feld an `tt_classes`
   * (nicht `settings`, 2000 Bytes). Gelesen wird IMMER über
   * `eigeneUebungReihe(cls)` - die kennt auch den alten Zeiger.
   */
  eigeneUebungen?: EigeneUebungEintrag[];
  /**
   * ★★★ „Kapitel mit der Klasse starten" für »Im Griff« (29.09.2026) - die
   * rohe Reihe aus `tt_classes.imgriffKapitel`. Roh, weil nur »Im Griff« sie
   * versteht: gelesen wird IMMER über `kapitelAusRoh` in
   * `lib/computer/klassenKapitel.ts`.
   */
  imgriffKapitel?: unknown;
  /**
   * ★ Zeilenende mit Enter (23.09.2026) - true = jedes Kind der Klasse
   * schliesst jede Übungszeile mit der Eingabetaste ab (Anlass: eine 3. Klasse
   * HAS, die für die Büroarbeit lernt). Eigenes Bool-Feld, nicht `settings` -
   * derselbe Grund wie bei `klassenmatchAus`: ein neues Bool-Feld ist am
   * Server immer `false`, und die Vorgabe soll „aus" sein - keine
   * Bestandsklasse braucht Nachpflege. Gilt NUR in `TypingSession` (Mein
   * Training, Geschichten, Eigene Übung, Tippchallenge, Klassenmatch,
   * Zeilen-Wortspiele) - siehe `useTypingItem.ts`.
   */
  zeilenEndeEnter?: boolean;
  /** ★ „Gezielt üben" für die ganze Klasse (13.11.2026) - siehe {@link TypingAccount.gezielt}; Vorrang hat das Feld am Kind. */
  gezielt?: Gezielt | null;
  createdAt: number;
}

/** Eine Lehrkraft einer Klasse (Eigentümer:in oder Co-Lehrkraft) für die Anzeige. */
export interface ClassTeacher {
  id: string;
  name: string;
  email: string;
  /** true = Eigentümer:in der Klasse (lässt sich nicht entfernen). */
  owner: boolean;
}

/** Telemetrie je Übung — Grundlage für Statistik + Eigenständigkeits-Check. */
export interface TaskEvent {
  ts: number;
  lesson: string;
  chars: number; // Anzahl Soll-Zeichen der Übung
  errors: number; // Fehlanschläge
  ms: number; // Bearbeitungszeit (Wanduhr, inkl. Pausen — für das Tempo)
  /**
   * Reine Tipp-Zeit ohne lange Pausen: Summe der Anschlag-Abstände, lange
   * Untätigkeit herausgerechnet (siehe TypingSession). Grundlage für die
   * angezeigte „geübte Zeit" (Wunsch: die Übezeit stoppt bei Untätigkeit).
   * Optional — fehlt bei alten Ständen (dann zählt `ms`).
   */
  activeMs?: number;
  pasted?: boolean;
  blurred?: boolean;
  /**
   * ★ Die Zeile wurde mit eingeschalteter Melodie getippt (19.10.2026,
   * Johannes). Wer rhythmisch zur Melodie tippt, ist nicht so schnell wie ohne
   * - das darf kein Nachteil sein: {@link tempoOhneBremsendeMelodie}.
   */
  melodie?: boolean;
  /**
   * Sprache der Übungsinhalte dieser Zeile (Deutsch/Englisch). Damit die geübte
   * Zeit getrennt nach Sprache ausgewertet werden kann. Fehlt bei alten Ständen
   * (dann als Deutsch gezählt).
   */
  lang?: Lang;
  /**
   * ★ LEGACY (bis 18.09.2026): Nur bei Ziel-Änderungs-Marker-Events
   * (lesson === GOAL_CHANGE_LESSON) - der goalMinutes-Wert, der bis zu
   * diesem Zeitpunkt galt. Dieser Marker wird seit dem Umbau auf
   * `wochenziel.ts` NICHT MEHR geschrieben (der neue Zielverlauf liegt am
   * Kind-Datensatz, `wochenzielVerlauf`, siehe dort) - das Feld bleibt hier
   * nur, damit ALTE, bereits gespeicherte Marker-Events weiterhin gepackt/
   * entpackt werden können (`eventPack.ts`).
   */
  minutesGoal?: number;

  // ── Messungen je Zeile für den Eigenständigkeits-Check (Schritt M, 19.09.2026)
  // Nur gemessen, nirgends angezeigt - bewertet wird seit Z5 (19.09.2026) nur
  // `unechteTasten` (`suspicionScore`), die übrigen warten auf die Prüfung je
  // Hilfsmittel-Gruppe (MESSUNG §11/§13). Was sie heissen und warum
  // sie fehlen können: `zeilenMessung.ts`. Nur bei Kindern einer Klasse
  // gespeichert (`ohneZeilenMessung`), gepackt in `eventPack.ts` Feld 8-14.
  /** Tastendrücke mit `isTrusted === false` (ein Skript im Browser). Fehlt = 0. */
  unechteTasten?: number;
  /** ms, in denen das Fenster während der Zeile nicht vorne war. Fehlt = 0. */
  wegMs?: number;
  /** Variationskoeffizient der Anschlag-Abstände (2 Stellen). Fehlt = nicht messbar. */
  rhythmusVk?: number;
  /** Median Taste runter → hoch in ms. Fehlt = nicht messbar. */
  haltezeitMs?: number;
  /** Anteil Anschläge bei noch gehaltener Vortaste, 0..1 (2 Stellen). Fehlt = nicht messbar. */
  ueberlappung?: number;
  /** Treffer auf den zu Zeilenbeginn wackligen Tasten. Fehlt = keine kam vor. */
  wackeligTreffer?: number;
  /** Versuche auf den zu Zeilenbeginn wackligen Tasten. Fehlt = keine kam vor. */
  wackeligVersuche?: number;
}

/**
 * Sonderlektion, die einen Ziel-Änderungs-Marker-Event kennzeichnet.
 * Kein echter Übungsevent — von `buildSessions()`/`buildDayPractice()`
 * übersprungen. Seit dem Umbau auf `wochenziel.ts` (18.09.2026) wird KEIN
 * neuer Marker dieser Art mehr geschrieben (der Zielverlauf liegt jetzt am
 * Kind, `wochenzielVerlauf`) - die Konstante bleibt, weil alte Konten noch
 * Marker-Events dieser Art in ihrer Geschichte tragen, die weiterhin aus der
 * Übezeit herausgefiltert werden müssen.
 */
export const GOAL_CHANGE_LESSON = "__goal__";

interface StoreData {
  accounts: Record<string, TypingAccount>;
  classes: Record<string, TypingClass>;
  secrets: Record<string, string>;
  progress: Record<string, TypingProgress>;
  /**
   * Ereignisse je Konto - seit 29.08.2026 {@link PackedEvents}, davor eine
   * blanke Liste. Beides kann im Speicher liegen; gelesen wird ueber
   * `unpackEvents`, geschrieben immer gepackt.
   */
  events: Record<string, TaskEvent[] | PackedEvents>;
  /**
   * ★ Ergebnisse der Schreibproben (09.09.2026) - je Kind eine Liste, jüngste
   * zuerst. Am Server ist das eine eigene Sammlung (`tt_schreibproben`); lokal
   * genügt ein Fach im selben Blob.
   */
  schreibproben?: Record<string, unknown[]>;
  /**
   * Ausstehende Co-Lehrkraft-Einladungen (14.09.2026) - lokales Gegenstück zur
   * Server-Sammlung `tt_class_teacher_invites` (siehe `tt_coteacher_lib.pb.js`).
   * Schlüssel ist der Token. Ohne echten Mailversand: die Landeplatz-Seite
   * `/lernwerkstatt-einladung` liest die Einladung direkt über ihn.
   */
  classTeacherInvites?: Record<string, ClassTeacherInvite>;
  /**
   * ★ Hochgeladene eigene Texte (17.09.2026) - für „Eigene Übung" und die
   * Tippchallenge mit eigener Datei. Am Server eine eigene Sammlung
   * (`tt_eigene_texte`, siehe `pocketbase/setup.mjs`); lokal genügt ein Fach
   * im selben Blob, Schlüssel ist die Text-Id.
   */
  eigeneTexte?: Record<string, EigenerTextRecord>;
  /**
   * ★ Meine Texte (E8, 19.09.2026) - die Textablage EINER Lehrkraft, für
   * Kinder und andere Lehrkräfte unsichtbar (`meineTexte.ts`). Am Server eine
   * eigene Sammlung (`tt_meine_texte`, siehe `pocketbase/setup.mjs`).
   */
  meineTexte?: Record<string, MeinTextRecord>;
}

/** Siehe `StoreData.eigeneTexte`. */
interface EigenerTextRecord {
  id: string;
  classCode: string;
  teacherId: string;
  dateiname: string;
  zeilen: string[];
  erstelltMs: number;
}

/** Siehe `StoreData.meineTexte`. */
interface MeinTextRecord {
  id: string;
  teacherId: string;
  dateiname: string;
  zeilen: string[];
  erstelltMs: number;
}

/** Siehe `StoreData.classTeacherInvites`. */
interface ClassTeacherInvite {
  token: string;
  classCode: string;
  email: string;
  /** Leer, bis eine Lehrkraft die Einladung einlöst. */
  teacherUid: string;
  aktiv: boolean;
  eingeladenAtMs: number;
  eingeloestAtMs: number;
}

const KEY = "tippen-trainer:store:v1";

function emptyStore(): StoreData {
  return {
    accounts: {},
    classes: {},
    secrets: {},
    progress: {},
    events: {},
    schreibproben: {},
    classTeacherInvites: {},
  };
}

/**
 * DIE Lese-Übersetzung des lokalen Speichers (Skizze §5 Schritt 2): Jedes Konto,
 * das aus dem Blob kommt, trägt danach den NEUEN Stufen-Wert. Weil jeder
 * Schreibvorgang auf einem geladenen Stand aufsetzt, wandern die alten Werte
 * beim nächsten `save()` von selbst mit — ohne eigene Migrations-Runde.
 *
 * Ein leerer/unbekannter Wert bleibt leer (siehe {@link migriereStufe}).
 */
function migriereKonten(accounts: Record<string, TypingAccount>): Record<string, TypingAccount> {
  const out: Record<string, TypingAccount> = {};
  for (const [id, acc] of Object.entries(accounts ?? {})) {
    const neu = migriereStufe(acc?.stufe);
    out[id] = neu === acc?.stufe ? acc : { ...acc, stufe: neu };
  }
  return out;
}

function load(): StoreData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const data = { ...emptyStore(), ...(JSON.parse(raw) as Partial<StoreData>) };
    data.accounts = migriereKonten(data.accounts);
    return data;
  } catch {
    return emptyStore();
  }
}

function save(data: StoreData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* localStorage nicht verfügbar */
  }
}

function hashSecret(pw: string): string {
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h + pw.charCodeAt(i)) >>> 0;
  return "h" + h.toString(36);
}

let counter = 0;
function genId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // ohne I/O/0/1
function genClassCode(taken: Record<string, unknown>): string {
  for (let tries = 0; tries < 50; tries++) {
    let c = "";
    for (let i = 0; i < 6; i++)
      c += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    if (!taken[c]) return c;
  }
  return "K" + Date.now().toString(36).toUpperCase();
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

// --- Lehrkraft ---------------------------------------------------------------
export function registerTeacher(
  name: string,
  email: string,
  password: string,
): Result<TypingAccount> {
  const data = load();
  const mail = email.trim().toLowerCase();
  if (!name.trim()) return { ok: false, error: "Bitte einen Namen angeben." };
  if (!mail.includes("@")) return { ok: false, error: "Bitte eine gültige E-Mail angeben." };
  if (password.length < 6)
    return { ok: false, error: "Das Passwort braucht mindestens 6 Zeichen." };
  if (Object.values(data.accounts).some((a) => a.role === "lehrkraft" && a.email === mail))
    return { ok: false, error: "Für diese E-Mail gibt es schon ein Konto." };
  const acc: TypingAccount = {
    id: genId("le"),
    role: "lehrkraft",
    name: name.trim(),
    email: mail,
    createdAt: Date.now(),
  };
  data.accounts[acc.id] = acc;
  data.secrets[acc.id] = hashSecret(password);
  save(data);
  return { ok: true, value: acc };
}

export function loginTeacher(email: string, password: string): Result<TypingAccount> {
  const data = load();
  const mail = email.trim().toLowerCase();
  const acc = Object.values(data.accounts).find(
    (a) => a.role === "lehrkraft" && a.email === mail,
  );
  if (!acc || data.secrets[acc.id] !== hashSecret(password))
    return { ok: false, error: "E-Mail oder Passwort stimmt nicht." };
  return { ok: true, value: acc };
}

// --- Klassen -----------------------------------------------------------------
const CLASS_CODE_RE = /^[A-Z0-9.-]{2,12}$/;

export function createClass(
  teacherId: string,
  name: string,
  code?: string,
  /**
   * ★ Die Einstellungen der Klasse gleich mit (11.09.2026, Nacht) - in
   * DEMSELBEN Speichervorgang wie das Anlegen, wie am Server
   * (`pbBackend.createClass`). `startUnitsAt` wird hier gestempelt.
   */
  einstellungen?: KlassenAnlage,
  /**
   * ★ Nachbesserung 20.09.2026 (Johannes: „Das Programm kann ja eine Nummer
   * vergeben und damit arbeiten"). `true`, wenn `code` der aus dem Namen
   * VORGESCHLAGENE Code ist (`codeSelbst === false` in `KlasseUndKinder.tsx`)
   * - dann weicht ein belegter Code von selbst aus ("TEST" → "TEST2" …), statt
   * die Lehrkraft mit einer Absage aufzuhalten. Hat sie den Code SELBST
   * getippt, bleibt er stehen (Standard: `false`/`undefined`).
   */
  codeAutoVorschlag?: boolean,
): Result<TypingClass> {
  const data = load();
  if (!name.trim()) return { ok: false, error: "Bitte einen Klassennamen angeben." };

  /*
    ★ Klassenname nur JE KONTO eindeutig, nicht global (20.09.2026, Testerin
    Punkt 1 - Johannes' Testklasse: „Test" war schon vergeben, allerdings
    nicht von ihm). Global bleibt allein der KLASSENCODE eindeutig (unten,
    dieselbe Regel wie am Server, `idx_tt_class_code` in `setup.mjs`) - er ist
    der Anmelde-Schlüssel der Kinder. Diese Prüfung spiegelt die
    Server-Prüfung in `tt_klasse.pb.js` für den lokalen/Offline-Modus
    (`LocalTypingBackend`, der diese Funktion direkt aufruft) - ohne sie
    kennte nur der Server die Regel, und der lokale Modus liesse zwei
    gleichnamige Klassen DESSELBEN Kontos klaglos zu.
  */
  const wunschName = name.trim().toLowerCase();
  const schonEigen = Object.values(data.classes).some(
    (k) => k.teacherId === teacherId && k.name.trim().toLowerCase() === wunschName,
  );
  if (schonEigen)
    return {
      ok: false,
      error: "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.",
    };

  let finalCode: string;
  const wish = (code ?? "").trim().toUpperCase();
  if (wish) {
    if (!CLASS_CODE_RE.test(wish))
      return {
        ok: false,
        error:
          "Der Code darf 2-12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.",
      };
    if (data.classes[wish]) {
      /*
        ★ Nachbesserung 20.09.2026: NUR beim vorgeschlagenen Code (nicht bei
        einem selbst getippten) weicht das Programm von selbst aus - Johannes'
        eigener Vorschlag. Höchstens 20 Versuche (mehr als genug: bei 20
        Lehrkräften mit derselben "TEST"-Klasse ist ohnehin eine Rückfrage
        fälliger als noch ein Versuch).
      */
      let ausweichCode: string | null = null;
      if (codeAutoVorschlag) {
        for (let versuch = 2; versuch <= 20; versuch++) {
          const kandidat = naechsterKlassencodeVersuch(wish, versuch);
          if (!data.classes[kandidat]) {
            ausweichCode = kandidat;
            break;
          }
        }
      }
      if (!ausweichCode)
        return {
          ok: false,
          error:
            "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).",
        };
      finalCode = ausweichCode;
    } else {
      finalCode = wish;
    }
  } else {
    finalCode = genClassCode(data.classes);
  }

  const cls: TypingClass = {
    code: finalCode,
    name: name.trim(),
    teacherId,
    weeklyReport: false,
    createdAt: Date.now(),
  };
  if (einstellungen) {
    const e = einstellungen;
    if (e.schulstufe !== undefined && e.schulstufe > 0) {
      cls.schulstufe = Math.round(e.schulstufe);
      if (e.schulstufeSchuljahr !== undefined) cls.schulstufeSchuljahr = e.schulstufeSchuljahr;
    }
    if (e.lang !== undefined) cls.lang = e.lang;
    if (e.langLocked !== undefined) cls.langLocked = e.langLocked;
    if (e.klassenmatchAus !== undefined) cls.klassenmatchAus = e.klassenmatchAus;
    // Wert und Beschluss-Zeitpunkt gehören zusammen (wie `setStartUnits`).
    if (e.startUnits !== undefined && e.startUnits > 0) {
      cls.startUnits = Math.round(e.startUnits);
      cls.startUnitsAt = Date.now();
    }
    // ★ Zeilenende mit Enter (23.09.2026), siehe TypingClass.zeilenEndeEnter.
    if (e.zeilenEndeEnter !== undefined) cls.zeilenEndeEnter = e.zeilenEndeEnter;
    if (e.gezielt !== undefined) cls.gezielt = e.gezielt ? gezieltAus(e.gezielt) : null;
    // ★ E1 (24.09.2026): der Lernweg für neue Kinder - nur „en" wird eingetragen.
    // ★ E11c (26.09.2026): ebenso „fr", wie `pbBackend.createClass`.
    // ★ ES-M (27.09.2026): jeder gültige Weg ausser „de" - damit auch „es".
    if (istLernweg(e.lernweg) && e.lernweg !== "de") cls.lernweg = e.lernweg;
    // ★ E9 (24.09.2026): die Schreibweise-Vorgabe - nur „gb"/„us" wird
    // eingetragen, siehe TypingClass.schreibweise.
    if (e.schreibweise === "gb" || e.schreibweise === "us") cls.schreibweise = e.schreibweise;
    // ★ D2 (28.09.2026): der Beginn des Schuljahres - in `settings`.
    if (istSchuljahrBeginn(e.schuljahrBeginn))
      cls.settings = { ...(cls.settings ?? {}), schuljahrBeginn: e.schuljahrBeginn };
  }
  data.classes[cls.code] = cls;
  save(data);
  return { ok: true, value: cls };
}

/**
 * Klasse nachträglich bearbeiten: Klassenname und/oder Klassencode (nur eigene
 * Klasse). Beim Code-Wechsel wandert der neue Code auf ALLE Schüler:innen dieser
 * Klasse mit (sie melden sich danach mit dem neuen Code an). Lokal hängt der
 * Login nur an `classCode` — es genügt, dieses Feld nachzuziehen.
 */
export function updateClass(
  code: string,
  teacherId: string,
  changes: { name?: string; code?: string },
): Result<TypingClass> {
  const data = load();
  const cls = data.classes[code];
  if (!cls) return { ok: false, error: "Diese Klasse gibt es nicht." };
  if (cls.teacherId !== teacherId)
    return { ok: false, error: "Diese Klasse gehört einer anderen Lehrkraft." };

  let newName = cls.name;
  if (changes.name !== undefined) {
    const n = changes.name.trim();
    if (!n) return { ok: false, error: "Bitte einen Klassennamen angeben." };
    /*
      ★ Nachbesserung 20.09.2026 (offener Punkt aus der ersten Fassung):
      Umbenennen prüft jetzt genauso wie das Anlegen - je KONTO eindeutig,
      die eigene Klasse (`cls.code`) ausgenommen (Umbenennen auf den EIGENEN,
      unveränderten Namen bleibt also erlaubt).
    */
    const wunschName = n.toLowerCase();
    const schonAnderswoEigen = Object.values(data.classes).some(
      (k) => k.code !== cls.code && k.teacherId === teacherId && k.name.trim().toLowerCase() === wunschName,
    );
    if (schonAnderswoEigen)
      return {
        ok: false,
        error: "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.",
      };
    newName = n;
  }

  let newCode = cls.code;
  if (changes.code !== undefined) {
    const wish = changes.code.trim().toUpperCase();
    if (!wish)
      return {
        ok: false,
        error: "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.",
      };
    if (!CLASS_CODE_RE.test(wish))
      return {
        ok: false,
        error:
          "Der Code darf 2-12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.",
      };
    if (wish !== cls.code && data.classes[wish])
      return { ok: false, error: "Diesen Code gibt es schon, bitte einen anderen wählen." };
    newCode = wish;
  }

  const updated: TypingClass = { ...cls, name: newName, code: newCode };
  if (newCode !== cls.code) {
    delete data.classes[cls.code];
    data.classes[newCode] = updated;
    // Beitritts-Code aller Schüler:innen dieser Klasse mitziehen.
    for (const acc of Object.values(data.accounts))
      if (acc.role === "schueler" && acc.classCode === code) acc.classCode = newCode;
  } else {
    data.classes[newCode] = updated;
  }
  save(data);
  return { ok: true, value: updated };
}

/** Wöchentlichen E-Mail-Bericht einer Klasse an-/ausschalten (nur eigene Klasse). */
export function setClassWeeklyReport(
  code: string,
  teacherId: string,
  on: boolean,
): TypingClass | null {
  const data = load();
  const cls = data.classes[code];
  if (!cls || cls.teacherId !== teacherId) return null;
  cls.weeklyReport = on;
  data.classes[code] = cls;
  save(data);
  return cls;
}

/**
 * „Programme dieser Klasse" setzen (MK-E2). Leere Liste = alle anzeigen.
 * Wie `setClassWeeklyReport` nur für die eigene Klasse (lokaler Mock; auf dem
 * Server entscheiden die Regeln, dort dürfen auch Co-Lehrkräfte).
 */
export function setClassPrograms(
  code: string,
  teacherId: string,
  programs: string[],
): TypingClass | null {
  const data = load();
  const cls = data.classes[code];
  if (!cls || cls.teacherId !== teacherId) return null;
  cls.programs = [...programs];
  data.classes[code] = cls;
  save(data);
  return cls;
}

/**
 * ★ F8 (11.09.2026): Das Klassenmatch für diese Klasse abschalten oder wieder
 * erlauben. Wie `setClassWeeklyReport` nur für die eigene Klasse (lokaler
 * Mock; am Server entscheiden die Regeln, dort dürfen auch Co-Lehrkräfte).
 *
 * ⚠️ Das Feld heisst „Aus", nicht „Erlaubt" - siehe `setup.mjs:1246`: Ein
 * neues Bool-Feld ist immer `false`, und die Vorgabe soll „erlaubt" sein.
 */
export function setClassKlassenmatchAus(
  code: string,
  teacherId: string,
  aus: boolean,
): TypingClass | null {
  const data = load();
  const cls = data.classes[code];
  if (!cls || cls.teacherId !== teacherId) return null;
  cls.klassenmatchAus = aus;
  data.classes[code] = cls;
  save(data);
  return cls;
}

/* ══════════════════════════════════════════════════════════════════════════
 * ★★★ E3 (11.09.2026): DIE KLASSENEINSTELLUNGEN - Schulstufe, Sprache, Sperre
 * ══════════════════════════════════════════════════════════════════════════ */

/** Was `setClassEinstellungen` ändern kann. Fehlt ein Feld, bleibt es stehen. */
export interface KlassenEinstellungenAenderung {
  /** 1-13; `0` löscht die Schulstufe wieder („nicht gesetzt"). */
  schulstufe?: number;
  /** Startjahr des Schuljahrs beim Eintragen (2026 für 2026/27). */
  schulstufeSchuljahr?: number;
  lang?: Lang;
  langLocked?: boolean;
  /**
   * ★ Startniveau der Klasse als Vorgabe (11.09.2026, Nacht). `0` löscht die
   * Vorgabe. Den Zeitstempel `startUnitsAt` setzt das Backend SELBST - wie
   * `setStartUnits` am Kind: Wert und Beschluss-Zeitpunkt gehören untrennbar
   * zusammen, und wer den Wert ohne ihn schriebe, hätte keinen Beschluss.
   */
  startUnits?: number;
  /**
   * ★ Zeilenende mit Enter (23.09.2026) - siehe {@link TypingClass.zeilenEndeEnter}.
   */
  zeilenEndeEnter?: boolean;
  /** ★ „Gezielt üben" für die Klasse (13.11.2026); `null` löscht es. */
  gezielt?: Gezielt | null;
  /**
   * ★ E1 (24.09.2026) - der Lernweg für NEUE Kinder der Klasse (siehe
   * {@link TypingClass.lernweg}). ⚠️ Ändert kein bestehendes Kind.
   */
  lernweg?: Lernweg;
  /**
   * ★ E9 (24.09.2026, Bauplan §8.2) - die Schreibweise-VORGABE der Klasse
   * (siehe {@link TypingClass.schreibweise}). Anders als `lernweg` gilt sie
   * SOFORT für alle Kinder der Klasse. `""` löscht die Vorgabe wieder
   * (zurück auf „automatisch") - nur `undefined` heisst „unverändert lassen".
   */
  schreibweise?: EnglischVariante | "";
  /**
   * ★ D2 (28.09.2026) - der Beginn des Schuljahres (Monat 1-12), siehe
   * {@link TypingClass.settings}. Liegt in `settings`, nicht in einer Spalte.
   */
  schuljahrBeginn?: number;
}

/**
 * ★★★ Was beim ANLEGEN einer Klasse gleich mitgeht (11.09.2026, Nacht -
 * Johannes: „Alles was im Bereich ‚Einstellungen der Klasse' vorkommt muss beim
 * Erstellen einer neuen Klasse abgefragt werden").
 *
 * ⚠️ `klassenmatchAus` steht hier, obwohl es beim ÄNDERN einen eigenen Weg hat
 * ({@link setClassKlassenmatchAus}): Das Anlegen ist EIN Datensatz in EINEM
 * Aufruf - ein zweiter Aufruf danach wäre genau der Zwischenzustand „Klasse
 * da, Einstellung noch nicht", den es beim Anlegen nicht geben soll.
 */
export interface KlassenAnlage extends KlassenEinstellungenAenderung {
  klassenmatchAus?: boolean;
}

/**
 * ★★★ Die Lern-Einstellungen der KLASSE setzen (B8, 11.09.2026).
 *
 * Sie gelten für alle Kinder der Klasse - auch für die, die später dazukommen
 * (gerechnet beim Laden, nicht in jedes Konto kopiert; siehe
 * `klassenEinstellungen.ts` und `useTypingAuth.ts`).
 *
 * ⚠️ EIN Aufruf für alle vier Felder, nicht vier. Ein Zwischenzustand
 * („Schulstufe gesetzt, Eintragsjahr noch nicht") würde die Textstufe der
 * ganzen Klasse für einen Augenblick falsch rechnen.
 *
 * ⚠️ `klassenmatchAus` gehört NICHT hierher: Dafür gibt es
 * {@link setClassKlassenmatchAus} (E6). Zwei Wege zum selben Feld wären genau
 * die Doppelung, die sich am zweiten Tag auseinanderlebt.
 */
export function setClassEinstellungen(
  code: string,
  teacherId: string,
  aenderung: KlassenEinstellungenAenderung,
): TypingClass | null {
  const data = load();
  const cls = data.classes[code];
  if (!cls || cls.teacherId !== teacherId) return null;
  if (aenderung.schulstufe !== undefined) {
    // 0 = „nicht gesetzt": Das Feld und sein Eintragsjahr fallen zusammen weg,
    // sonst bliebe ein Jahr stehen, zu dem es keine Stufe mehr gibt.
    if (aenderung.schulstufe <= 0) {
      cls.schulstufe = undefined;
      cls.schulstufeSchuljahr = undefined;
    } else {
      cls.schulstufe = aenderung.schulstufe;
      if (aenderung.schulstufeSchuljahr !== undefined)
        cls.schulstufeSchuljahr = aenderung.schulstufeSchuljahr;
    }
  } else if (aenderung.schulstufeSchuljahr !== undefined) {
    cls.schulstufeSchuljahr = aenderung.schulstufeSchuljahr;
  }
  if (aenderung.lang !== undefined) cls.lang = aenderung.lang;
  if (aenderung.langLocked !== undefined) cls.langLocked = aenderung.langLocked;
  // ★ Startniveau der Klasse (11.09.2026, Nacht): Wert UND Zeitpunkt, nie
  // eins ohne das andere (Begründung am Typ). 0 löscht beide.
  if (aenderung.startUnits !== undefined) {
    const units = Math.max(0, Math.round(aenderung.startUnits));
    cls.startUnits = units > 0 ? units : undefined;
    cls.startUnitsAt = units > 0 ? Date.now() : undefined;
  }
  // ★ Zeilenende mit Enter (23.09.2026), siehe TypingClass.zeilenEndeEnter.
  if (aenderung.zeilenEndeEnter !== undefined) cls.zeilenEndeEnter = aenderung.zeilenEndeEnter;
  // ★ „Gezielt üben" (13.11.2026): `null` löscht, sonst gesäubert (höchstens 8 Zeichen).
  if (aenderung.gezielt !== undefined) cls.gezielt = aenderung.gezielt ? gezieltAus(aenderung.gezielt) : null;
  // ★ E1 (24.09.2026): nur die VORGABE für neue Kinder. ★★★ Kein bestehendes
  // Kind wird angefasst - dessen Weg steht fest (D2, Bauplan §2.2).
  // ★ E2a: „de" bleibt der stille Normalfall (Feld leer) - jeder ANDERE
  // gültige Weg (jetzt auch „fr") wird geschrieben. Vorher stand hier
  // `=== "en" ? "en" : undefined` - das hätte „fr" still verworfen.
  if (aenderung.lernweg !== undefined)
    cls.lernweg = aenderung.lernweg === "de" ? undefined : aenderung.lernweg;
  // ★ E9 (24.09.2026): die Schreibweise-Vorgabe - `""` löscht sie wieder
  // (zurück auf „automatisch"), siehe TypingClass.schreibweise.
  if (aenderung.schreibweise !== undefined)
    cls.schreibweise = istEnglischVariante(aenderung.schreibweise)
      ? aenderung.schreibweise
      : undefined;
  // ★ D2 (28.09.2026): der Beginn des Schuljahres - in `settings`, alles
  // andere dort bleibt stehen (Plan, Zeiger der Tippchallenge …).
  if (istSchuljahrBeginn(aenderung.schuljahrBeginn))
    cls.settings = { ...(cls.settings ?? {}), schuljahrBeginn: aenderung.schuljahrBeginn };
  data.classes[code] = cls;
  save(data);
  return cls;
}

/**
 * Ein Schreibproben-Ergebnis lokal ablegen (Mock-Betrieb ohne Server).
 *
 * ⚠️ **Ein Ergebnis wird nie überschrieben.** Liegt zu derselben Probe schon
 * eines, bleibt das erste stehen. Das ist dieselbe Regel, die am Server die
 * Schreibrechte durchsetzen: Wer eine Prüfung zweimal abgeben darf, hat keine
 * geschrieben.
 */
export function speichereProbenergebnis(
  pupilId: string,
  probeId: string,
  ergebnis: unknown,
): boolean {
  const data = load();
  const alle = data.schreibproben ?? {};
  const meine = alle[pupilId] ?? [];
  if (meine.some((e) => (e as { probeId?: string })?.probeId === probeId)) return false;
  alle[pupilId] = [ergebnis, ...meine].slice(0, 100);
  data.schreibproben = alle;
  save(data);
  return true;
}

/** Alle Schreibproben-Ergebnisse eines Kindes, jüngste zuerst. */
export function leseProbenergebnisse(pupilId: string): unknown[] {
  return load().schreibproben?.[pupilId] ?? [];
}

/** Alle Ergebnisse einer Klasse (Lehrkraft-Sicht) - je Kind seine Liste. */
export function leseKlassenProbenergebnisse(
  classCode: string,
): Record<string, unknown[]> {
  const data = load();
  const out: Record<string, unknown[]> = {};
  for (const acc of Object.values(data.accounts)) {
    if (acc.role !== "schueler" || acc.classCode !== classCode) continue;
    out[acc.id] = data.schreibproben?.[acc.id] ?? [];
  }
  return out;
}

/**
 * ★★★ Die SCHREIBPROBE einer Klasse starten oder absagen (09.09.2026).
 *
 * `plan === null` sagt sie ab. Mit dem Plan geht der ZEIGER in denselben
 * Schreibvorgang (Texte sparen, 10.09.2026): wo diese Challenge beginnt und
 * welche es ist. Beides ist eine Entscheidung und darf nicht in zwei Schritte
 * zerfallen.
 *
 * ⚠️ Die alte Verbrauchsliste (`schreibprobeVerbraucht`) bleibt unberührt
 * stehen: Sie gilt für jedes Niveau, das noch keinen Zeiger hat.
 */
export function setClassSchreibprobe(
  code: string,
  teacherId: string,
  plan: unknown | null,
  zeiger: unknown,
  // ★ E7a (24.09.2026): welcher Weg dieser Zeiger ist (`schreibprobeZeiger`
  // für „de", `schreibprobeZeigerEn` für „en" - siehe `zeigerSchluessel` in
  // `schreibprobe.ts`). Fehlt es, gilt „de" - der alte Schlüssel.
  lernweg: Lernweg = "de",
): TypingClass | null {
  const data = load();
  const cls = data.classes[code];
  if (!cls || !isClassStaff(cls, teacherId)) return null;
  // ★ E2a: BEWUSST nicht um „fr" erweitert (dritter Zeigername) - Auftrag E2a
  // Punkt 7 / Bauplan §15.6: `tt_classes.settings` hat 2.000 Byte, ein
  // dritter Zeiger passt vermutlich nicht (E1 gemessen: 2.145 Byte). Gehört
  // zu E13. „fr" teilt sich bis dahin den Zeiger von „de" (harmlos: der
  // Lernweg „fr" ist ohne Inhalte ohnehin nicht erreichbar).
  const zeigerFeld = lernweg === "en" ? "schreibprobeZeigerEn" : "schreibprobeZeiger";
  cls.settings = {
    ...(cls.settings ?? {}),
    schreibprobe: plan ?? undefined,
    [zeigerFeld]: zeiger ?? undefined,
  };
  data.classes[code] = cls;
  save(data);
  return cls;
}

/**
 * ★ Einen hochgeladenen eigenen Text ablegen (17.09.2026) - für „Eigene
 * Übung" und die Tippchallenge mit eigener Datei. Ein Upload legt IMMER eine
 * NEUE Zeile an (kein Überschreiben) - die Reihe der Klasse
 * (`TypingClass.eigeneUebungen`) bekommt danach einen Eintrag mit ihrer Id,
 * ältere Zeilen bleiben unverändert liegen.
 */
export function speichereEigenenText(
  classCode: string,
  teacherId: string,
  dateiname: string,
  zeilen: string[],
): string | null {
  const data = load();
  const cls = data.classes[classCode];
  if (!cls || !isClassStaff(cls, teacherId)) return null;
  const id = zufallsToken();
  data.eigeneTexte = {
    ...(data.eigeneTexte ?? {}),
    [id]: { id, classCode, teacherId, dateiname, zeilen, erstelltMs: Date.now() },
  };
  save(data);
  return id;
}

/** Einen hochgeladenen eigenen Text lesen (Kind UND Lehrkraft - kein Geheimnis). */
export function leseEigenenText(
  id: string,
): { dateiname: string; zeilen: string[] } | null {
  const rec = load().eigeneTexte?.[id];
  return rec ? { dateiname: rec.dateiname, zeilen: rec.zeilen } : null;
}

/**
 * ★★★★★ „Eigene Übung starten" (Z1, 19.09.2026): HINTEN an die Reihe der
 * Klasse hängen, statt die laufende zu ersetzen (siehe
 * `eigeneUebungReihe.ts`). Der alte Zeiger in `settings` wird im selben
 * Schreibvorgang geleert - ab jetzt gilt allein die Reihe.
 */
export function starteEigeneUebung(
  code: string,
  teacherId: string,
  eintrag: { textId: string; dateiname: string },
  vonAllenFertig: readonly string[] = [],
): TypingClass | null {
  const data = load();
  const cls = data.classes[code];
  if (!cls || !isClassStaff(cls, teacherId)) return null;
  cls.eigeneUebungen = reiheMitNeuer(
    eigeneUebungReihe(cls),
    { ...eintrag, gestartetAm: Date.now(), von: teacherId },
    vonAllenFertig,
  );
  cls.settings = { ...(cls.settings ?? {}), eigeneUebung: undefined };
  data.classes[code] = cls;
  save(data);
  return cls;
}

/**
 * Eine Übung aus der Reihe nehmen („Beenden", Z1). Kinder, die sie noch nicht
 * angefangen haben, bekommen sie nicht mehr; wer gerade darin schreibt, darf
 * sie fertig schreiben (`useEigeneUebung`, „festgehalten").
 */
export function beendeEigeneUebung(
  code: string,
  teacherId: string,
  textId: string,
): TypingClass | null {
  const data = load();
  const cls = data.classes[code];
  if (!cls || !isClassStaff(cls, teacherId)) return null;
  cls.eigeneUebungen = reiheOhne(eigeneUebungReihe(cls), textId);
  cls.settings = { ...(cls.settings ?? {}), eigeneUebung: undefined };
  data.classes[code] = cls;
  save(data);
  return cls;
}

/**
 * ★★★ »Im Griff«: die Kapitel-Reihe der Klasse neu schreiben (29.09.2026,
 * `lib/computer/klassenKapitel.ts`). `aendern` bekommt die rohe alte Reihe.
 */
export function schreibeImGriffKapitel(
  code: string,
  teacherId: string,
  aendern: (roh: unknown) => unknown[],
): TypingClass | null {
  const data = load();
  const cls = data.classes[code];
  if (!cls || !isClassStaff(cls, teacherId)) return null;
  cls.imgriffKapitel = aendern(cls.imgriffKapitel);
  data.classes[code] = cls;
  save(data);
  return cls;
}

/**
 * ★★★ Meine Texte (E8, 19.09.2026) - einen Text in die eigene Ablage der
 * Lehrkraft legen. Anders als {@link speichereEigenenText} gibt es hier
 * KEINEN `classCode` - der Pool gehört dem KONTO, nicht der Klasse
 * (Johannes: „die Dateien gehören aber zu den Konten und nicht zur Klasse").
 */
export function speichereMeinenText(
  teacherId: string,
  dateiname: string,
  zeilen: string[],
): string | null {
  const data = load();
  const id = zufallsToken();
  data.meineTexte = {
    ...(data.meineTexte ?? {}),
    [id]: { id, teacherId, dateiname, zeilen, erstelltMs: Date.now() },
  };
  save(data);
  return id;
}

/** Alle eigenen Texte einer Lehrkraft, jüngste zuerst - für die Liste „Meine Texte". */
export function listeMeineTexte(teacherId: string): MeinTextEintrag[] {
  return Object.values(load().meineTexte ?? {})
    .filter((r) => r.teacherId === teacherId)
    .sort((a, b) => b.erstelltMs - a.erstelltMs)
    .map((r) => ({
      id: r.id,
      dateiname: r.dateiname,
      erstelltMs: r.erstelltMs,
      ersteWorte: ersteWorte(r.zeilen),
    }));
}

/** Einen Text aus der eigenen Ablage lesen (zum Starten in einer Klasse - kopiert nach `tt_eigene_texte`). */
export function leseMeinenText(id: string): { dateiname: string; zeilen: string[] } | null {
  const rec = load().meineTexte?.[id];
  return rec ? { dateiname: rec.dateiname, zeilen: rec.zeilen } : null;
}

/**
 * Einen Text aus der eigenen Ablage löschen. `false`, wenn es ihn nicht
 * (mehr) gibt oder er einer ANDEREN Lehrkraft gehört - „kein Teilen" gilt
 * auch beim Löschen.
 */
export function loescheMeinenText(id: string, teacherId: string): boolean {
  const data = load();
  const rec = data.meineTexte?.[id];
  if (!rec || rec.teacherId !== teacherId) return false;
  const rest = { ...data.meineTexte };
  delete rest[id];
  data.meineTexte = rest;
  save(data);
  return true;
}

/**
 * ★★★ N6: Eine Klasse an ihrem Beitritts-Code lesen - AUCH als Kind.
 *
 * Der Grund ist nicht Bequemlichkeit, sondern eine Fehlerklasse: Einstellungen
 * der KLASSE (z. B. die gesperrten Zeiten, `useGesperrteZeiten.ts`) müssen für
 * die Lehrkraft-Sicht UND die Kind-Sicht dieselbe Antwort geben. Rechnete die
 * eine damit und die andere ohne, sähen beide verschiedene Wochen - dieselbe
 * Frage, zwei Antworten, keine Fehlermeldung
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ⚠️ Nur LESEN. Die Serverregel erlaubt einem Kind `list`/`view` auf die
 * eigene Klasse seit dem 02.07.2026 ohnehin; geschrieben wird weiterhin nur
 * von der Lehrkraft.
 */
export function getClass(code: string): TypingClass | null {
  return load().classes[code] ?? null;
}

export function listClasses(teacherId: string): TypingClass[] {
  return Object.values(load().classes)
    .filter(
      (c) =>
        c.teacherId === teacherId ||
        (c.coTeacherIds ?? []).includes(teacherId),
    )
    .sort((a, b) => a.createdAt - b.createdAt);
}

// --- Co-Lehrkräfte (mehrere Lehrkräfte pro Klasse) ---------------------------
/** Eigentümer:in + alle Co-Lehrkräfte einer Klasse (für die Anzeige). */
export function listClassTeachers(classCode: string): ClassTeacher[] {
  const data = load();
  const cls = data.classes[classCode];
  if (!cls) return [];
  const out: ClassTeacher[] = [];
  const owner = data.accounts[cls.teacherId];
  if (owner)
    out.push({ id: owner.id, name: owner.name, email: owner.email ?? "", owner: true });
  for (const id of cls.coTeacherIds ?? []) {
    const t = data.accounts[id];
    if (t && t.role === "lehrkraft")
      out.push({ id: t.id, name: t.name, email: t.email ?? "", owner: false });
  }
  return out;
}

function isClassStaff(cls: TypingClass, teacherId: string): boolean {
  return cls.teacherId === teacherId || (cls.coTeacherIds ?? []).includes(teacherId);
}

/** Ein Zufallstoken - `crypto.randomUUID`, wo es das gibt (Einladungen!). */
function zufallsToken(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID().replace(/-/g, "");
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

/**
 * Eine weitere Lehrkraft (per E-Mail) zu einer Klasse hinzufügen — volle
 * Rechte. Kennt keine Lehrkraft diese E-Mail, wird statt eines Fehlers eine
 * Einladung angelegt (`invitedEmail` in der Antwort) - Gegenstück zum
 * Server-Pfad in `tt_coteacher_lib.pb.js` (dort inklusive Mailversand; lokal
 * ohne, siehe `StoreData.classTeacherInvites`).
 */
export function addClassTeacher(
  classCode: string,
  email: string,
  requesterId: string,
): Result<{ teachers: ClassTeacher[]; invitedEmail?: string }> {
  const data = load();
  const cls = data.classes[classCode];
  if (!cls) return { ok: false, error: "Diese Klasse gibt es nicht." };
  if (!isClassStaff(cls, requesterId))
    return { ok: false, error: "Diese Klasse gehört einer anderen Lehrkraft." };
  const mail = email.trim().toLowerCase();
  if (!mail.includes("@"))
    return { ok: false, error: "Bitte eine gültige E-Mail angeben." };
  const teacher = Object.values(data.accounts).find(
    (a) => a.role === "lehrkraft" && a.email === mail,
  );
  if (!teacher) {
    const invites = data.classTeacherInvites ?? {};
    const bestehend = Object.values(invites).find(
      (i) => i.classCode === classCode && i.email === mail,
    );
    const token = bestehend?.token ?? zufallsToken();
    invites[token] = {
      token,
      classCode,
      email: mail,
      teacherUid: "",
      aktiv: true,
      eingeladenAtMs: Date.now(),
      eingeloestAtMs: 0,
    };
    data.classTeacherInvites = invites;
    save(data);
    return { ok: true, value: { teachers: listClassTeachers(classCode), invitedEmail: mail } };
  }
  if (teacher.id === cls.teacherId)
    return { ok: false, error: "Diese Lehrkraft ist bereits Eigentümer:in der Klasse." };
  const ids = new Set(cls.coTeacherIds ?? []);
  ids.add(teacher.id);
  cls.coTeacherIds = [...ids];
  data.classes[classCode] = cls;
  save(data);
  return { ok: true, value: { teachers: listClassTeachers(classCode) } };
}

/** Eine Co-Lehrkraft wieder von einer Klasse entfernen (die Eigentümer:in nicht). */
export function removeClassTeacher(
  classCode: string,
  teacherId: string,
  requesterId: string,
): Result<ClassTeacher[]> {
  const data = load();
  const cls = data.classes[classCode];
  if (!cls) return { ok: false, error: "Diese Klasse gibt es nicht." };
  if (!isClassStaff(cls, requesterId))
    return { ok: false, error: "Diese Klasse gehört einer anderen Lehrkraft." };
  if (teacherId === cls.teacherId)
    return { ok: false, error: "Die Eigentümer:in lässt sich nicht entfernen." };
  cls.coTeacherIds = (cls.coTeacherIds ?? []).filter((id) => id !== teacherId);
  data.classes[classCode] = cls;
  save(data);
  return { ok: true, value: listClassTeachers(classCode) };
}

/** Vorschau einer Einladung ohne Anmeldung - Gegenstück zu `invite-vorschau`. */
export function previewCoteacherInvite(
  token: string,
): Result<{ klasseName: string; email: string; eingeloest: boolean }> {
  const data = load();
  const invite = (data.classTeacherInvites ?? {})[token];
  if (!invite || !invite.aktiv)
    return { ok: false, error: "Diese Einladung gibt es nicht." };
  const klasseName = data.classes[invite.classCode]?.name ?? invite.classCode;
  return {
    ok: true,
    value: { klasseName, email: invite.email, eingeloest: invite.eingeloestAtMs > 0 },
  };
}

/** Einladung einlösen - Gegenstück zu `invite-annehmen`. Braucht `requesterId`. */
export function acceptCoteacherInvite(
  token: string,
  requesterId: string,
): Result<{ classCode: string; klasseName: string }> {
  const data = load();
  const invite = (data.classTeacherInvites ?? {})[token];
  if (!invite || !invite.aktiv)
    return { ok: false, error: "Diese Einladung gibt es nicht." };
  if (invite.eingeloestAtMs > 0 && invite.teacherUid !== requesterId)
    return { ok: false, error: "Diese Einladung wurde bereits von einem anderen Konto eingelöst." };
  const cls = data.classes[invite.classCode];
  if (!cls) return { ok: false, error: "Diese Klasse gibt es nicht mehr." };
  if (invite.eingeloestAtMs === 0) {
    invite.teacherUid = requesterId;
    invite.eingeloestAtMs = Date.now();
    if (requesterId !== cls.teacherId) {
      const ids = new Set(cls.coTeacherIds ?? []);
      ids.add(requesterId);
      cls.coTeacherIds = [...ids];
      data.classes[invite.classCode] = cls;
    }
    data.classTeacherInvites = { ...(data.classTeacherInvites ?? {}), [token]: invite };
    save(data);
  }
  return { ok: true, value: { classCode: invite.classCode, klasseName: cls.name } };
}

// --- Schüler:innen -----------------------------------------------------------
export function addPupil(
  classCode: string,
  name: string,
  password: string,
  stufe: Stufe = VORGABE_STUFE,
  tempo: TempoLevel = "normal",
  startUnits: number = INITIAL_LETTERS,
  geburtsjahr?: number,
): Result<TypingAccount> {
  const data = load();
  const cls = data.classes[classCode];
  if (!cls) return { ok: false, error: "Diese Klasse gibt es nicht." };
  if (!name.trim()) return { ok: false, error: "Bitte einen Namen angeben." };
  if (password.length < 4)
    return { ok: false, error: "Das Passwort braucht mindestens 4 Zeichen." };
  const wantName = name.trim();
  // Namensvergleich ohne Groß-/Kleinschreibung — sonst ließen sich „Anna" und
  // „anna" beide anlegen, aber die Anmeldung (die kleinschreibt) könnte sie
  // nicht mehr auseinanderhalten → eine/r käme nicht mehr hinein.
  const exists = Object.values(data.accounts).some(
    (a) =>
      a.role === "schueler" &&
      a.classCode === classCode &&
      a.name.toLowerCase() === wantName.toLowerCase(),
  );
  if (exists) return { ok: false, error: "Diesen Namen gibt es in der Klasse schon." };
  // ★ E1 (24.09.2026): ein neues Kind erbt den Lernweg der Klasse (Bauplan
  // §2.2). Nur ein Weg AUSSER „de" wird eingetragen - fehlend heisst „de",
  // wie bei jedem Bestandskonto. Bestehende Kinder bekommt diese Vorgabe NIE.
  const lernweg = lernwegVon(cls);
  const acc: TypingAccount = {
    id: genId("sc"),
    role: "schueler",
    name: name.trim(),
    classCode,
    // Ein angegebenes Geburtsjahr steuert die Stufe (sie wächst dann mit); nur
    // ohne Jahr wird die Stufe fest eingetragen. Siehe stufeFuer().
    ...(istPlausiblesGeburtsjahr(geburtsjahr) ? { geburtsjahr } : { stufe }),
    lang: "de",
    tempo,
    // Die Vorkenntnisse bleiben am Konto stehen, nicht nur im Fortschritt: Sonst
    // könnte die Lehrkraft nach dem Anlegen nicht mehr sehen, was sie eingetragen
    // hat, und das Auswahlfeld stünde beim nächsten Öffnen wieder auf „Anfänger".
    startUnits,
    ...(lernweg === "de" ? {} : { lernweg }),
    goalMinutes: DEFAULT_GOAL_MINUTES,
    goalUnits: DEFAULT_GOAL_UNITS,
    goalWeeks: [],
    goalCatchUp: false,
    createdAt: Date.now(),
  };
  // ★★★ Wochenziel-Vorgabe der Klasse übernehmen (W2, Johannes §7g: „alles
  // was für die Klasse gilt, gilt auch für das neue Kind") - ab der NÄCHSTEN
  // Woche, nie rückwirkend ({@link neuesKindVerlauf}). Ohne Vorgabe bleibt
  // das Kind ohne Ziel, wie bisher.
  if (cls.wochenzielVorgabe) {
    acc.wochenzielVerlauf = neuesKindVerlauf(cls.wochenzielVorgabe.minuten, Date.now());
    acc.goalWeeks = cls.wochenzielVorgabe.wochen;
    acc.goalCatchUp = cls.wochenzielVorgabe.nachholen;
  }
  data.accounts[acc.id] = acc;
  data.secrets[acc.id] = hashSecret(password);
  // Startlevel: Geübtere beginnen weiter vorn (mehr Zeichen schon freigeschaltet).
  if (startUnits > INITIAL_LETTERS)
    data.progress[acc.id] = {
      ...emptyProgress(),
      introduced: startpunktEinheiten(startUnits, lernweg), // ★ D-1: Startpunkt-Zählung
      ...(lernweg === "de" ? {} : { lernweg }),
    };
  save(data);
  return { ok: true, value: acc };
}

export function loginPupil(
  classCode: string,
  name: string,
  password: string,
): Result<TypingAccount> {
  const data = load();
  const acc = Object.values(data.accounts).find(
    (a) =>
      a.role === "schueler" &&
      a.classCode === classCode.trim().toUpperCase() &&
      a.name.toLowerCase() === name.trim().toLowerCase(),
  );
  if (!acc || data.secrets[acc.id] !== hashSecret(password))
    return { ok: false, error: "Klassencode, Name oder Passwort stimmt nicht." };
  return { ok: true, value: acc };
}

export function listPupils(classCode: string): TypingAccount[] {
  return Object.values(load().accounts)
    .filter((a) => a.role === "schueler" && a.classCode === classCode)
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

export function getAccount(id: string): TypingAccount | null {
  return load().accounts[id] ?? null;
}

/**
 * Eine/n Schüler:in samt allem Zubehör löschen (Konto, Passwort, Spielstand,
 * Telemetrie). Endgültig — die Lehrkraft bestätigt das vorher in der Oberfläche.
 */
export function deletePupil(accountId: string): Result<true> {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc || acc.role !== "schueler")
    return { ok: false, error: "Dieses Konto gibt es nicht." };
  delete data.accounts[accountId];
  delete data.secrets[accountId];
  delete data.progress[accountId];
  delete data.events[accountId];
  // ★ 12.09.2026: auch die Tippchallenge-Ergebnisse. Bis dahin blieben sie
  // nach dem Löschen liegen - die Datenschutzerklärung sagt „samt
  // Tippchallenge-Ergebnissen", und beide Wege (lokal und Server) müssen das halten.
  if (data.schreibproben) delete data.schreibproben[accountId];
  save(data);
  return { ok: true, value: true };
}

/**
 * ★★ „Bereit für die Tippchallenge" melden (10.09.2026) - die LOKALE Fassung.
 * Am Server setzt die Zeit der Hook (`tt_pupils_field_guard.pb.js`); lokal
 * gibt es nur eine Uhr, und die gilt.
 */
export function setProbeBereit(
  accountId: string,
  probeId: string,
  ms: number = Date.now(),
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc || acc.role !== "schueler") return null;
  acc.probeBereit = { probeId, ms };
  save(data);
  return acc;
}

/** Was nach dem Verschieben eines Kindes gilt - für die Statuszeile. */
export interface KindVerschoben {
  /** Der Klassencode der neuen Klasse, so wie er gespeichert ist. */
  zielCode: string;
  zielName: string;
  /**
   * Mathecoach führt seine Klassen SELBST (`ma_classes`). Die Freischaltung
   * wandert nur mit, wenn es die neue Klasse dort auch gibt
   * (`pocketbase/pb_hooks/tt_klasse_lib.pb.js`).
   */
  mathecoach: "mitgewandert" | "bleibt" | "keine";
}

/**
 * ★★★ Ein Kind in eine andere Klasse verschieben (10.09.2026, Wunsch Johannes)
 * - die LOKALE Fassung des Server-Wegs `/api/tt/kind-verschieben`
 * (`pocketbase/pb_hooks/tt_klasse_lib.pb.js`), mit denselben Prüfungen in
 * derselben Reihenfolge und denselben Sätzen.
 *
 * Lokal hängt am Klassencode nur das Konto selbst (Fortschritt und Ereignisse
 * liegen je Konto), darum ändert sich hier nur `classCode`.
 */
export function movePupil(
  pupilId: string,
  zielCode: string,
  teacherId: string,
): Result<KindVerschoben> {
  const data = load();
  const kind = data.accounts[pupilId];
  // Nicht gefunden und nicht erlaubt klingen gleich - wie am Server.
  const nichtIhres = "Dieses Kind gehört nicht zu einer Ihrer Klassen.";
  if (!kind || kind.role !== "schueler" || !kind.classCode)
    return { ok: false, error: nichtIhres };
  const bisher = data.classes[kind.classCode];
  const darf =
    !!bisher &&
    (bisher.teacherId === teacherId || (bisher.coTeacherIds ?? []).includes(teacherId));
  if (!darf) return { ok: false, error: nichtIhres };

  const ziel = zielCode.trim().toUpperCase();
  if (!ziel) return { ok: false, error: "Bitte den Klassencode der neuen Klasse eingeben." };
  if (ziel === kind.classCode.toUpperCase())
    return { ok: false, error: "Das Kind ist schon in der Klasse mit diesem Klassencode." };
  const zielKlasse = data.classes[ziel];
  if (!zielKlasse)
    return {
      ok: false,
      error: `Eine Klasse mit dem Klassencode „${ziel}“ gibt es nicht. Bitte den Code prüfen.`,
    };
  const dort = Object.values(data.accounts).filter(
    (a) => a.role === "schueler" && a.classCode === ziel,
  );
  // Dieselbe Grenze wie `tt_grenzen.pb.js`.
  if (dort.length >= 30)
    return {
      ok: false,
      error: `In der Klasse „${zielKlasse.name}“ sind bereits ${dort.length} Kinder. Mehr als 30 sind je Klasse nicht vorgesehen.`,
    };
  if (dort.some((a) => a.name.trim().toLowerCase() === kind.name.trim().toLowerCase()))
    return {
      ok: false,
      error: `In der neuen Klasse gibt es schon ein Kind mit dem Namen „${kind.name}“. Ändern Sie zuerst den Namen eines der beiden Kinder.`,
    };

  kind.classCode = ziel;
  save(data);
  return {
    ok: true,
    value: { zielCode: ziel, zielName: zielKlasse.name, mathecoach: "keine" },
  };
}

/**
 * Eine ganze Klasse löschen — mit ALLEN Schüler:innen dieser Klasse (samt deren
 * Spielständen und Telemetrie). Endgültig; vorher wird in der Oberfläche
 * bestätigt. Nur die eigene Klasse der Lehrkraft (teacherId) lässt sich löschen.
 */
export function deleteClass(code: string, teacherId: string): Result<true> {
  const data = load();
  const cls = data.classes[code];
  if (!cls) return { ok: false, error: "Diese Klasse gibt es nicht." };
  if (cls.teacherId !== teacherId)
    return { ok: false, error: "Diese Klasse gehört einer anderen Lehrkraft." };
  for (const acc of Object.values(data.accounts)) {
    if (acc.role === "schueler" && acc.classCode === code) {
      delete data.accounts[acc.id];
      delete data.secrets[acc.id];
      delete data.progress[acc.id];
      delete data.events[acc.id];
      if (data.schreibproben) delete data.schreibproben[acc.id];
    }
  }
  delete data.classes[code];
  save(data);
  return { ok: true, value: true };
}

/**
 * Textstufe einer/eines Schüler:in setzen (Lehrkraft oder Schüler:in selbst).
 * Eine so gesetzte Stufe ÜBERSTEUERT ein hinterlegtes Geburtsjahr (Vorrangmodell
 * in {@link stufeFuer}); das Jahr bleibt gespeichert, wirkt aber nicht mehr.
 */
export function setStufe(accountId: string, stufe: Stufe): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.stufe = stufe;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * Geburtsjahr setzen (nur die Jahreszahl) — oder mit `undefined` löschen.
 *
 * Ein gültiges Jahr LÖSCHT zugleich eine ausdrücklich gesetzte Stufe: Wer sein
 * Alter angibt, will, dass die Texte mitwachsen; bliebe die alte Wahl stehen,
 * hätte das Jahr nach dem Vorrangmodell keinerlei Wirkung und die Eingabe wäre
 * eine Attrappe.
 */
export function setGeburtsjahr(
  accountId: string,
  geburtsjahr: number | undefined,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  if (istPlausiblesGeburtsjahr(geburtsjahr)) {
    acc.geburtsjahr = geburtsjahr;
    acc.stufe = undefined;
  } else {
    acc.geburtsjahr = undefined;
  }
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/** Sprache der Übungsinhalte setzen (Lehrkraft oder Schüler:in selbst). */
export function setLang(accountId: string, lang: Lang): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.lang = lang;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * „Einhand schreiben" setzen - Umschalt-Gegenhand-Regel aus/an. Die Lehrkraft
 * setzt es für ihre Kinder; ein Konto OHNE Lehrkraft (selbstlernend) legt es
 * seit 19.09.2026 selbst um (wie {@link setNoTimePressure}).
 */
/**
 * ★ 25.09.2026: die eigene Schulstufe eines Kindes setzen (0 = wie die Klasse).
 * Nur die Lehrkraft - siehe {@link TypingAccount.schulstufe}.
 */
export function setSchulstufe(
  accountId: string,
  schulstufe: number,
  schulstufeSchuljahr: number,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.schulstufe = schulstufe;
  acc.schulstufeSchuljahr = schulstufe ? schulstufeSchuljahr : 0;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

export function setOneHand(accountId: string, oneHand: boolean): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.oneHand = oneHand;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * ★ „Gezielt üben" setzen (13.11.2026) - siehe {@link TypingAccount.gezielt}. `null` = nicht gesetzt (Kind: wie die Klasse).
 * Wer es setzen darf (Lehrkraft für ihr Kind, Konto ohne Lehrkraft für sich), entscheidet der Server-Wächter
 * `tt_pupils_field_guard.pb.js`.
 */
export function setGezielt(accountId: string, gezielt: Gezielt | null): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.gezielt = gezielt ? gezieltAus(gezielt) : null;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * „Zeit lassen" setzen — für dieses Kind zählt das Tempo nirgends mehr (siehe
 * {@link TypingAccount.noTimePressure}). Die Lehrkraft setzt ihn für ihre
 * Kinder; ein Konto OHNE Lehrkraft (selbstlernend) darf ihn selbst umlegen.
 */
export function setNoTimePressure(
  accountId: string,
  noTimePressure: boolean,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.noTimePressure = noTimePressure;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * „Zeichenabstand groß (CVI)" setzen - siehe {@link TypingAccount.zeichenabstand}.
 * Seit 19.09.2026 setzt ihn JEDES Kind selbst (auch eines einer Klasse) und
 * die Lehrkraft je Kind - wer zuletzt stellt, gilt. Wie am Server
 * (`tt_pupils_field_guard.pb.js`) zählt nur ein gültiger Wert (1-5); alles
 * andere lässt den gespeicherten stehen.
 */
export function setZeichenabstand(
  accountId: string,
  zeichenabstand: number,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  if (![1, 2, 3, 4, 5].includes(zeichenabstand)) return acc;
  acc.zeichenabstand = zeichenabstand;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * Wochenbericht per E-Mail abbestellen (`true`) oder wieder einschalten
 * (`false`) — siehe {@link TypingAccount.mailWeeklyOptOut}.
 *
 * Das Konto setzt das SELBST; es ist keine Lehrkraft-Einstellung, sondern die
 * Antwort auf die Frage, wer Post haben möchte. Ohne Server (lokaler Rückfall)
 * gibt es ohnehin keine Mail — der Wert wird trotzdem gemerkt, damit der
 * Umschalter im Mock-Betrieb nicht bei jedem Neuladen zurückspringt.
 */
export function setMailWeeklyOptOut(
  accountId: string,
  optOut: boolean,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.mailWeeklyOptOut = optOut;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * „im Griff": Hilfsmittel-Profil eines Kindes setzen (Lehrkraft ODER die App
 * selbst, wenn das Kind in „im Griff" umstellt). Leerer Wert = nicht gesetzt.
 * Seit MK-E3 auch im lokalen Mock gespeichert — vorher konnte der Reiter
 * „im Griff" von „Meine Klassen" ohne Server gar nichts merken.
 */
export function setToolProfile(
  accountId: string,
  toolProfile: string,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.toolProfile = toolProfile;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/** „im Griff": Kompetenzstufe eines Kindes setzen. Leerer Wert = nicht gesetzt. */
export function setSkillLevel(
  accountId: string,
  skillLevel: string,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.skillLevel = skillLevel;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * Spendenbanner-Zustand EINES Kontos lesen (Nachbesserung 19.09.2026) - das
 * lokale/Mock-Gegenstück zu `tt_teachers`/`tt_pupils.spendenAufrufAm`/
 * `spendenAufrufMeilenstein` am echten Server. `null`, solange der Banner
 * noch nie gezeigt wurde oder das Konto nicht existiert.
 */
export function getSpendenbannerZustand(accountId: string): SpendenBannerZustand | null {
  const acc = load().accounts[accountId];
  if (!acc) return null;
  const gespendetMs = (acc.gespendetAm ?? 0) > 0 ? acc.gespendetAm : undefined;
  // ★ 19.09.2026: Eine bestätigte Spende zählt auch dann, wenn der Banner
  // selbst noch nie gezeigt wurde.
  if (!acc.spendenAufrufMeilenstein && !gespendetMs) return null;
  return {
    meilensteinH: acc.spendenAufrufMeilenstein ?? 0,
    zuletztGezeigtMs: acc.spendenAufrufAm ?? 0,
    ...(gespendetMs ? { gespendetMs } : {}),
  };
}

/** Spendenbanner-Zustand EINES Kontos schreiben - siehe {@link getSpendenbannerZustand}. */
export function setSpendenbannerZustand(
  accountId: string,
  meilensteinH: number,
  zuletztGezeigtMs: number,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.spendenAufrufMeilenstein = meilensteinH;
  acc.spendenAufrufAm = zuletztGezeigtMs;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * ★★★★★ Eine BESTÄTIGTE Spende am Konto merken (19.09.2026) - das
 * lokale/Mock-Gegenstück zu `tt_teachers`/`tt_pupils.gespendetAm`. Danach
 * liefert {@link getSpendenbannerZustand} `gespendetMs`, und der Banner kommt
 * nie wieder (`spendenBannerFaellig`).
 */
export function setGespendetAm(accountId: string, gespendetMs: number): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.gespendetAm = gespendetMs;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * „Was gibt's Neues" (Z3, 19.09.2026) - das lokale/Mock-Gegenstück zu
 * `tt_teachers.neuigkeitenGesehen` und `createdAtMs` am echten Server.
 * `null`, wenn es das Konto nicht gibt (dann ist nichts zu entscheiden).
 */
export function getNeuigkeitenStand(
  accountId: string,
): { gesehen: string; erstelltMs: number } | null {
  const acc = load().accounts[accountId];
  if (!acc) return null;
  return { gesehen: acc.neuigkeitenGesehen ?? "", erstelltMs: acc.createdAt ?? 0 };
}

/** Die quittierte Fassung am Konto speichern - siehe {@link getNeuigkeitenStand}. */
export function setNeuigkeitenGesehen(accountId: string, fassung: string): boolean {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return false;
  acc.neuigkeitenGesehen = fassung;
  data.accounts[accountId] = acc;
  save(data);
  return true;
}

/**
 * Der Rundgang (Z4, 19.09.2026) - das lokale/Mock-Gegenstück zu
 * `rundgaengeGesehen` an `tt_pupils`/`tt_teachers`. `null`, wenn es das Konto
 * nicht gibt.
 */
export function getRundgaengeGesehen(accountId: string): string[] | null {
  const acc = load().accounts[accountId];
  if (!acc) return null;
  return Array.isArray(acc.rundgaengeGesehen) ? [...acc.rundgaengeGesehen] : [];
}

/** Die Liste der gesehenen Rundgänge am Konto speichern - siehe {@link getRundgaengeGesehen}. */
export function setRundgaengeGesehen(accountId: string, liste: string[]): boolean {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return false;
  acc.rundgaengeGesehen = [...liste];
  data.accounts[accountId] = acc;
  save(data);
  return true;
}

// (Bis 11.09.2026 stand hier `setTempo()` - Anforderungs-Stufe nachträglich
// ändern -, entfernt weil ungenutzt: die Oberfläche kann das Tempo eines
// bestehenden Kontos nirgends ändern, nur beim Anlegen setzen. Das Feld
// `tempo`/`TempoLevel` selbst bleibt, es wird aktiv gelesen.)

/**
 * Vorkenntnisse setzen: ab welchen Tasten das Kind beginnt (Lehrkraft; ein
 * Konto ohne Lehrkraft setzt es selbst).
 *
 * Der Wert wird NUR am Konto vermerkt. Angewandt wird er beim nächsten Laden
 * durch das Kind ({@link startpunktAnwenden}) — hier wie am Server derselbe
 * Weg, damit es nicht zwei Rechnungen gibt, die voneinander nichts wissen.
 *
 * ★★★ Der Zeitstempel gehört UNTRENNBAR dazu (04.09.2026): Er macht aus dem
 * Wert einen BESCHLUSS, und nur ein Beschluss darf zurückstufen. Wer hier den
 * Wert ohne den Zeitpunkt schreibt, baut das Zurückstufen still wieder aus.
 */
export function setStartUnits(
  accountId: string,
  startUnits: number,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.startUnits = Math.max(0, Math.round(startUnits));
  acc.startUnitsAt = Date.now();
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * Beschlüsse der Lehrkraft für Plus setzen (23.09.2026). Wie beim Startpunkt
 * schreibt das NUR das Konto; übernommen wird er beim nächsten Öffnen von Plus
 * durch das Kind selbst (`lib/plus/beschluss.ts`, `wendeBeschluesseAn`).
 */
export function setPlusBeschluss(
  accountId: string,
  beschluss: unknown,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.plusBeschluss = beschluss;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * ★ E1 (24.09.2026): den Lernweg eines Kontos festlegen - EINMAL (D2, Bauplan
 * englischer Lehrgang §2.2). Steht schon einer da, bleibt er; dieselbe Regel,
 * die am Server `tt_pupils_field_guard.pb.js` erzwingt.
 */
export function setLernweg(accountId: string, lernweg: Lernweg): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  // ★ ES-M (27.09.2026): JEDER gültige Weg bleibt - vorher nur „de"/„en", ein
  // „fr"- oder „es"-Konto liess sich im lokalen Speicher also noch umschreiben
  // (am Server verhinderte es der Wächter). An der Eigenschaft statt an einer
  // Liste (Leitfaden neue Sprache, Falle 50).
  if (istLernweg(acc.lernweg)) return acc;
  acc.lernweg = lernweg;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * ★ W2b (28.09.2026, Weg je Kind): die Lehrkraft stellt den Lernweg eines
 * Kindes um - im lokalen Speicher (Mock) dieselbe Regel wie am Server
 * (`tt_pupils_field_guard.pb.js`): nur ein gültiger Weg, nie leer. Der
 * Fortschritt bleibt unberührt; das Kind parkt ihn beim nächsten Öffnen
 * (`wegWechsel.ts`).
 */
export function setLernwegDurchLehrkraft(accountId: string, lernweg: Lernweg): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc || !istLernweg(lernweg)) return null;
  acc.lernweg = lernweg;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * Überfällige (aufgelaufene) Wochenziel-Einheiten eines Kindes zurücksetzen (nur
 * Lehrkraft, Johannes 15.07.): merkt sich die Stich-Woche `resetWeek` (ISO-Schlüssel).
 * Wochen davor zählen nicht mehr als verpasste Ziel-Woche — der Rückstand ist gestrichen,
 * ab dieser Woche zählt das Wochenziel wieder frisch. Berührt weder geübte Zeit noch die
 * Statistik-Rohdaten. Der Aufrufer liefert die Woche (aktuelle KW) — kein Import aus goals.ts
 * (Zyklus-Vermeidung).
 */
export function resetGoalOverdue(
  accountId: string,
  resetWeek: string,
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.goalResetWeek = resetWeek;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * Einzelne Wochen erlassen (nur Lehrkraft, Befund 16.09.2026 - z. B. bei
 * Krankheit): schreibt die vollständige Liste der erlassenen Wochen
 * (ISO-Schlüssel wie `goalWeeks`) - der Aufrufer entscheidet, welche Woche
 * dazukommt oder wegfällt. Berührt weder geübte Zeit noch die Statistik-
 * Rohdaten, nur die Wertung dieser Wochen.
 */
export function setGoalExcusedWeeks(
  accountId: string,
  weeks: string[],
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  acc.goalExcusedWeeks = weeks;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

// --- Wochenziel NEU (W2, 18.09.2026, `wochenziel.ts`) ------------------------

/**
 * ★★★ Das Wochenziel EINES Kindes ändern (nur Lehrkraft) - Minuten je Woche,
 * Ziel-Kalenderwochen, Nachholen. Hat das frühere `setGoal` (Minuten je
 * Einheit + Einheiten je Woche) ersetzt (W3, 18.09.2026) - `goalMinutes`/
 * `goalUnits` bleiben unberührt, sie werden nur noch lazy umgerechnet
 * gelesen ({@link kindWochenzielAusFeldern}).
 *
 * Die BASIS ist der vorhandene Verlauf ({@link kindWochenzielAusFeldern} -
 * liest den echten Verlauf, sonst die lazy KW-38-Umrechnung aus den alten
 * Feldern, OHNE sie zu schreiben) - so verliert ein noch nicht umgestelltes
 * Kind seinen umgerechneten Abschnitt nicht, der neue Abschnitt setzt
 * darauf auf. {@link zielAendern} setzt ihn immer erst ab der NÄCHSTEN Woche.
 */
export function setWochenziel(
  accountId: string,
  ziel: { minuten: number; wochen: string[]; nachholen: boolean },
): TypingAccount | null {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return null;
  const basis = kindWochenzielAusFeldern(acc).verlauf;
  acc.wochenzielVerlauf = zielAendern(basis, ziel.minuten, Date.now());
  acc.goalWeeks = ziel.wochen;
  acc.goalCatchUp = ziel.nachholen;
  data.accounts[accountId] = acc;
  save(data);
  return acc;
}

/**
 * „Für die Klasse einstellen" (W2, Entwurf §7g - eine BEQUEMLICHKEIT, kein
 * eigener Klassen-Datensatz): schreibt dieselbe Vorgabe JEDEM Kind der Klasse
 * über {@link setWochenziel}, sequentiell, UND merkt sie an der Klasse selbst
 * ({@link TypingClass.wochenzielVorgabe}) - so bekommt ein SPÄTER
 * beitretendes Kind sie automatisch ({@link addPupil}). Gibt zurück, wie
 * vielen Kindern es gelungen ist, und die Namen derer, bei denen nicht (im
 * Mock kommt das praktisch nie vor - die Liste kommt ja aus derselben Klasse).
 */
export function setKlassenWochenziel(
  classCode: string,
  ziel: { minuten: number; wochen: string[]; nachholen: boolean },
): { ok: number; fehler: string[] } {
  const data = load();
  const cls = data.classes[classCode];
  if (!cls) return { ok: 0, fehler: [] };
  cls.wochenzielVorgabe = {
    minuten: ziel.minuten,
    wochen: ziel.wochen,
    nachholen: ziel.nachholen,
    am: Date.now(),
  };
  data.classes[classCode] = cls;
  save(data);

  let ok = 0;
  const fehler: string[] = [];
  for (const kind of listPupils(classCode)) {
    if (setWochenziel(kind.id, ziel)) ok++;
    else fehler.push(kind.name);
  }
  return { ok, fehler };
}

/**
 * 60 Minuten - „eine Stunde sperren" (Johannes, Entwurf §7f/§7e). Exportiert,
 * damit `pbBackend.ts` DIESELBE Zahl verwendet statt sie ein zweites Mal
 * hinzuschreiben ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export const SPERR_DAUER_MS = 60 * 60_000;
/**
 * Wie lange ein abgelaufener Sperr-Zeitraum aufbewahrt wird, bevor
 * {@link stundeSperren} ihn beim nächsten Sperren wegwirft - grosszügig
 * bemessen (mehr als ein Schuljahr), damit ein rückwirkender Wochen-Bericht
 * nie auf eine schon entsorgte Sperre trifft.
 */
export const SPERR_AUFBEWAHREN_MS = 400 * 86_400_000;

/**
 * ★★★ „Eine Stunde sperren" (W2, `wochenziel.ts` Kopf-Kommentar) - 60 Minuten
 * für die GANZE Klasse, als Zeitraum (nicht als Ereignis-Bit, siehe dort).
 * Läuft schon eine Sperre, bleibt die Klasse UNVERÄNDERT (keine zwei
 * überlappenden Zeiträume) - die Lehrkraft sieht dann weiter „gesperrt bis…".
 * Abgelaufene Zeiträume älter als {@link SPERR_AUFBEWAHREN_MS} werden beim
 * Anlegen einer neuen Sperre entsorgt.
 */
export function stundeSperren(classCode: string): TypingClass | null {
  const data = load();
  const cls = data.classes[classCode];
  if (!cls) return null;
  const jetzt = Date.now();
  const zeiten = cls.gesperrteZeiten ?? [];
  const laeuft = zeiten.some((z) => z.abMs <= jetzt && z.bisMs > jetzt);
  if (laeuft) return cls;
  const bereinigt = zeiten.filter((z) => z.bisMs >= jetzt - SPERR_AUFBEWAHREN_MS);
  cls.gesperrteZeiten = [...bereinigt, { abMs: jetzt, bisMs: jetzt + SPERR_DAUER_MS }];
  data.classes[classCode] = cls;
  save(data);
  return cls;
}

/**
 * Eine LAUFENDE Sperre vorzeitig beenden (`bisMs = jetzt`) - der Zeitraum
 * bleibt in der Vergangenheit unverändert gültig (siehe Kopf-Kommentar
 * „Eine Stunde sperren" in `wochenziel.ts`: rückwirkend zählt er weiter).
 * Läuft keine Sperre, ändert sich nichts.
 */
export function sperreAufheben(classCode: string): TypingClass | null {
  const data = load();
  const cls = data.classes[classCode];
  if (!cls) return null;
  const jetzt = Date.now();
  cls.gesperrteZeiten = (cls.gesperrteZeiten ?? []).map((z) =>
    z.abMs <= jetzt && z.bisMs > jetzt ? { ...z, bisMs: jetzt } : z,
  );
  data.classes[classCode] = cls;
  save(data);
  return cls;
}

// --- Passwörter ändern -------------------------------------------------------
/**
 * Eigenes Passwort ändern (Lehrkraft ODER Schüler:in): das AKTUELLE Passwort muss
 * stimmen, das neue die Mindestlänge der Rolle erfüllen (Lehrkraft 6, Kind 4).
 */
export function changePassword(
  accountId: string,
  oldPassword: string,
  newPassword: string,
): Result<true> {
  const data = load();
  const acc = data.accounts[accountId];
  if (!acc) return { ok: false, error: "Konto nicht gefunden." };
  if (data.secrets[accountId] !== hashSecret(oldPassword))
    return { ok: false, error: "Das aktuelle Passwort stimmt nicht." };
  const min = acc.role === "lehrkraft" ? 6 : 4;
  if (newPassword.length < min)
    return { ok: false, error: `Das neue Passwort braucht mindestens ${min} Zeichen.` };
  data.secrets[accountId] = hashSecret(newPassword);
  save(data);
  return { ok: true, value: true };
}

/**
 * Passwort einer/eines Schüler:in NEU setzen (Lehrkraft, ohne das alte zu kennen —
 * für vergessene Kinder-Passwörter). Mindestlänge 4. (Im Server-Backend schützt die
 * PocketBase-`manageRule`, dass nur die eigene Lehrkraft das darf.)
 */
export function setPupilPassword(
  pupilId: string,
  newPassword: string,
): Result<true> {
  const data = load();
  const acc = data.accounts[pupilId];
  if (!acc || acc.role !== "schueler")
    return { ok: false, error: "Dieses Konto gibt es nicht." };
  if (newPassword.length < 4)
    return { ok: false, error: "Das neue Passwort braucht mindestens 4 Zeichen." };
  data.secrets[pupilId] = hashSecret(newPassword);
  save(data);
  return { ok: true, value: true };
}

// --- Klassencode auf dem Gerät merken ----------------------------------------
const LAST_CODE_KEY = "tippen-trainer:lastClassCode";

export function rememberClassCode(code: string): void {
  try {
    localStorage.setItem(LAST_CODE_KEY, code.trim().toUpperCase());
  } catch {
    /* localStorage nicht verfügbar */
  }
}

export function getRememberedClassCode(): string {
  try {
    return localStorage.getItem(LAST_CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function forgetClassCode(): void {
  try {
    localStorage.removeItem(LAST_CODE_KEY);
  } catch {
    /* localStorage nicht verfügbar */
  }
}

// --- Fortschritt + Telemetrie ------------------------------------------------
export function getProgress(accountId: string): TypingProgress {
  return load().progress[accountId] ?? emptyProgress();
}

export function saveAccountProgress(accountId: string, progress: TypingProgress): void {
  const data = load();
  data.progress[accountId] = progress;
  save(data);
}

/**
 * Ein Ereignis anhaengen. Seit 29.08.2026 wird GEPACKT gespeichert
 * ({@link eventPack}) - 6.500 statt 1.000 Ereignisse bei gleicher Last. Der
 * Speicher haelt beide Formate aus: Was noch als Liste dasteht, wird beim
 * naechsten Schreiben von selbst umgestellt.
 */
export function recordEvent(accountId: string, event: TaskEvent): void {
  const data = load();
  data.events[accountId] = ereignisAnhaengen(data.events[accountId], event);
  save(data);
}

/**
 * ★ 27.09.2026: mehrere Ereignisse nachtragen (Warteschlange im Gerät) - eine
 * schon gespeicherte Zeile (gleicher Zeitstempel, gleiche Lektion) wird nicht
 * doppelt gezählt. Dieselbe Regel wie am Server (`ereignisseNachtragen`).
 */
export function recordEvents(accountId: string, events: readonly TaskEvent[]): void {
  const data = load();
  const { gepackt } = ereignisseNachtragen(data.events[accountId], events);
  if (!gepackt) return;
  data.events[accountId] = gepackt;
  save(data);
}

export function getEvents(accountId: string): TaskEvent[] {
  return unpackEvents(load().events[accountId]);
}

// --- Statistik + Eigenständigkeits-Check (KI-Erkennung) ----------------------
export interface PupilStats {
  tasks: number; // abgeschlossene Übungszeilen
  chars: number;
  errors: number;
  accuracy: number; // 0..1
  avgCpm: number; // ⌀ Anschläge/Minute
  bestCpm: number; // bestes Tempo
  wpm: number; // ⌀ Wörter/Minute (= cpm / 5)
  totalMs: number; // reine Tippzeit (Summe der Bearbeitungszeiten)
  totalMsDe: number; // davon mit deutschen Inhalten geübt
  totalMsEn: number; // davon mit englischen Inhalten geübt
  totalMsFr: number; // davon mit französischen Inhalten geübt (★ 26.09.2026)
  totalMsEs: number; // davon mit spanischen Inhalten geübt (★ ES-O 27.09.2026)
  days: number; // an wie vielen verschiedenen Tagen geübt
  firstActive: number | null;
  lastActive: number | null;
  suspicion: { score: number; reasons: string[] };
}

/**
 * Woran ein Ereignis als WORTSPIEL zu erkennen ist.
 *
 * ★★★★★ Johannes am 02.09.2026: *„es darf nicht sein dass ein kind seine
 * anschlagsgeschwindigkeit verliert weil es konzentriert korrigiert oder
 * andere dinge bei den übungen macht. bitte bei allen wortspielen die
 * anschlaggeschwindigkeit rausnehmen. genauigkeit zählt."*
 *
 * Der Gedanke dahinter: Ein Wortspiel misst etwas anderes als eine Abschrift.
 * Wer im Lückentext nachdenkt, im Buchstabensalat sucht oder im Fingerdiktat
 * den richtigen Finger tastet, tippt langsam - und zwar RICHTIG langsam. Wird
 * diese Zeit als Tempo verbucht, bestraft das Programm genau das Verhalten,
 * das es beibringen will. Deshalb zählen Wortspiele voll bei Genauigkeit,
 * Übezeit, Tagen und Aufgaben - nur beim TEMPO zählen sie nicht mit.
 *
 * Die Kennung ist `form:<id>`; sie wird an genau einer Stelle je Bildschirm
 * gesetzt (AdaptiveTrainer) und hier an genau einer Stelle
 * gelesen. Zwei Stellen, die dieselbe Frage getrennt beantworten, sind in
 * diesem Projekt schon oft genug auseinandergelaufen
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export const WORTSPIEL_PRAEFIX = "form:";

export function istWortspiel(lesson: string): boolean {
  return lesson.startsWith(WORTSPIEL_PRAEFIX);
}

/**
 * Die Lektions-Kennung einer SCHREIBPROBE (09.09.2026).
 *
 * ⚠️ Sie beginnt bewusst NICHT mit `form:` - eine Schreibprobe ist kein
 * Wortspiel, und die beiden Regeln sollen sich getrennt ändern lassen.
 */
export const SCHREIBPROBE_LESSON = "schreibprobe";

/**
 * Gehört diese Zeile zu einer TIPPCHALLENGE?
 *
 * ★★★ Sie zählt GANZ NORMAL in die Statistik - Übezeit, Zeichen, Fehler, Tage
 * UND Tempo (Johannes, 10.09.2026: *„nimm es auf alle fälle ganz normal in die
 * statistik auf, niveau für die klasse passt"*).
 *
 * In der Nacht davor war sie vom Tempo ausgenommen, mit der Sorge: Das Niveau
 * wählt die Lehrkraft für die ganze Klasse, es könnte über oder unter dem Stand
 * eines Kindes liegen und ihm damit sein persönliches Tempo-Ziel verstellen.
 * Johannes' Antwort darauf ist die einfachere: Dann wählt man eben ein Niveau,
 * das zur Klasse passt - und eine Tippchallenge ist geschriebene Zeit wie jede
 * andere.
 *
 * Die Funktion bleibt, weil man die Zeilen einer Challenge weiterhin ERKENNEN
 * können muss (Auswertung, Anzeige). Sie sortiert nur nichts mehr aus.
 */
export function istSchreibprobe(lesson: string): boolean {
  return lesson === SCHREIBPROBE_LESSON;
}

function cpmOf(e: TaskEvent): number {
  if (e.ms <= 0) return 0;
  return (e.chars / e.ms) * 60000;
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ EINE GESPEICHERTE `ms` IST NICHT AUTOMATISCH EIN TEMPO (Bauplan F1/F1b,
 * Messung 18.09.2026, MESSUNG-2026-09-18-EIGENSTAENDIGKEITS-CHECK.md §11/§12)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Die Behebung in TypingSession.tsx (zeilenzeit.ts) gilt erst für NEUE Zeilen.
 * In der gespeicherten Geschichte (und aus jeder anderen Quelle von `ms`, z. B.
 * einer Tippchallenge-Zeile) stehen weiterhin Zeilen, deren Tempo nicht
 * plausibel ist:
 *
 *  - zu SCHNELL: schneller als {@link MIN_KEYSTROKE_MS} je Zeichen
 *    (> 1.500 Anschläge/Min) - gemessen bis 15.909 Anschläge/Min (§11), fast
 *    ausschliesslich bei Kindern mit Hilfsmittel (die abgezogene
 *    Vorlese-Wartezeit schrumpfte die Zeile fast auf null).
 *  - zu LANGSAM: langsamer als {@link TEMPO_MAX_MS_JE_ZEICHEN} je Zeichen -
 *    keine Tippzeit mehr, sondern eine liegen gelassene Zeile (§12, gemessen
 *    bis 29 Std. für 10 Zeichen).
 *
 * Eine implausible Zeile zählt für die Übe-ZEIT weiterhin ganz normal
 * (`activeMs`/`totalMs`, siehe `computePupilStats`) - nur nicht für ein
 * TEMPO, das aus ihrer `ms` gerechnet wird. EINE Regel für alle Stellen, die
 * aus Zeilen ein Tempo machen (`avgCpm`, `bestesTempo`, der Schnell-Anteil von
 * `suspicionScore`) - vorher hatte keine von ihnen eine Grenze.
 */
// ★ Die Regel selbst (`zeilenTempoPlausibel`, `TEMPO_MAX_MS_JE_ZEICHEN`) steht
// in `zeilenzeit.ts` - ohne Abhängigkeiten, damit auch `jahreskarte.ts` und
// `veraenderung.ts` sie ohne Kreis-Import nutzen. Hier nur benutzt, nicht
// weitergegeben (sonst gäben zwei Sammel-Exporte in `index.ts` denselben Namen).

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ „BESTES TEMPO" IST DAS TEMPO EINES LAUFES, NICHT EINER ZEILE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 01.09.2026: *„bestes Tempo wird aus zu wenigen Anschlägen
 * berechnet, nimm das beste Tempo für einen ganzen Lauf (12 Zeilen) auch wenn
 * die unterschiedlich lange sind, das beste Tempo nimmt den besten Wert eines
 * Laufes."*
 *
 * Bis dahin war es das Maximum über EINZELNE Zeilen. Eine kurze Zeile ist aber
 * schnell zufällig schnell: Bei „fff jjj" reichen zwei glückliche Sekunden für
 * 300 Anschläge/Min, und dieser Ausreisser stand dann für immer als
 * persönliche Bestleistung da - eine Zahl, die das Kind nie wieder erreicht
 * und die nichts über sein Können sagt.
 *
 * ── Warum ein SCHIEBENDES Fenster und keine Rundengrenzen ──────────────────
 * Eine Runde ist seit dem 29.08. keine feste Grösse mehr: Ein langsames Kind
 * bekommt 5 Zeilen, ein schnelles 12 (`rundenlaenge.ts`), und im Ereignis
 * steht nicht, wo eine Runde anfing. Statt diese Grenze zu RATEN - und damit
 * eine zweite, stille Annahme in die Zahl zu bauen - wird über je zwölf
 * aufeinanderfolgende Zeilen gerechnet und das beste Fenster genommen. Das
 * misst genau das Gefragte: das beste Tempo, das jemand über einen ganzen Lauf
 * DURCHGEHALTEN hat.
 *
 * ⚠️ Gewichtet über Zeichen und Zeit, nicht als Mittel der Zeilen-Tempi -
 * sonst zählte eine Zeile mit drei Zeichen so viel wie eine mit sechzig.
 *
 * ⚠️ Wer noch keine zwölf Zeilen hat, bekommt sein Fenster über alles, was da
 * ist. Sonst stünde bei den Jüngsten wochenlang eine Null, und eine Null sieht
 * aus wie ein gemessener Wert.
 */
export const BESTES_TEMPO_ZEILEN = 12;

export function bestesTempo(
  ev: readonly TaskEvent[],
  fenster: number = BESTES_TEMPO_ZEILEN,
): number {
  // ★ Bauplan F1/F1b: implausible Zeilen (siehe zeilenTempoPlausibel) raus,
  // BEVOR sie ins schiebende Fenster einfliessen - eine einzige Zeile mit
  // kaum-null oder Stunden-`ms` würde sonst das ganze Fenster verzerren, in
  // dem sie liegt (Summe, nicht Mittel).
  const gueltig = ev.filter(zeilenTempoPlausibel);
  if (gueltig.length === 0) return 0;
  const n = Math.min(fenster, gueltig.length);
  let chars = 0;
  let ms = 0;
  for (let i = 0; i < n; i += 1) {
    chars += gueltig[i].chars;
    ms += gueltig[i].ms;
  }
  let bestes = ms > 0 ? (chars / ms) * 60000 : 0;
  for (let i = n; i < gueltig.length; i += 1) {
    chars += gueltig[i].chars - gueltig[i - n].chars;
    ms += gueltig[i].ms - gueltig[i - n].ms;
    if (ms > 0) bestes = Math.max(bestes, (chars / ms) * 60000);
  }
  return bestes;
}

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * ★★★ MELODIE BREMST DAS TEMPO NIE (19.10.2026, Johannes: „wer mit melodie
 * spielt darf in der geschwindigkeit nicht sinken, nur steigen. Weil wer
 * rythmisch spielen möchte ist nicht so schnell wie ohne musik. Das darf aber
 * nie ein nachteil sein. Die genauigkeit zählt weiter wie immer.")
 *
 * Zeilen mit Melodie zählen für das TEMPO nur, wenn sie mindestens so schnell
 * sind wie das Tempo der Zeilen ohne Melodie - dann heben sie es an. Langsamere
 * bleiben aus der Tempo-Rechnung heraus. Zeichen, Fehler (Genauigkeit), Übezeit
 * und Tage rechnen weiter über ALLE Zeilen. Hat jemand noch keine Zeile ohne
 * Melodie, gibt es nichts, was sinken könnte: Dann zählen alle.
 *
 * Reihenfolge-unabhängig: Der Massstab ist das Tempo der Zeilen ohne Melodie
 * im ganzen Zeitraum, nicht der Stand zum Zeitpunkt der Zeile.
 */
export function tempoOhneBremsendeMelodie(zeilen: readonly TaskEvent[]): TaskEvent[] {
  const ohne = zeilen.filter((e) => !e.melodie && zeilenTempoPlausibel(e));
  const ms = ohne.reduce((s, e) => s + e.ms, 0);
  if (ms <= 0) return [...zeilen];
  const basis = (ohne.reduce((s, e) => s + e.chars, 0) / ms) * 60000;
  return zeilen.filter((e) => !e.melodie || (e.ms > 0 && (e.chars / e.ms) * 60000 >= basis));
}

export function pupilStats(accountId: string): PupilStats {
  return computePupilStats(getEvents(accountId));
}

/**
 * Reine Statistik-Berechnung aus bereits geladenen Übungs-Ereignissen.
 *
 * ⚠️ Der Ziel-Wechsel-Marker (`GOAL_CHANGE_LESSON`) ist KEINE Übung - er hält
 * nur fest, dass die Lehrkraft das Wochenziel geändert hat. `todayActiveMs`
 * und `buildDayPractice` lassen ihn seit jeher weg; hier wurde er mitgezählt.
 * Für die ZEIT war das folgenlos (er trägt `ms: 0` und kein `activeMs`), für
 * `tasks` nicht: Ein Kind, dem nur das Ziel geändert wurde, sah in der Tabelle
 * „0:00" statt „-", galt also als hätte es schon geübt. Gefunden am 01.09.2026
 * beim Bau von `tests/tastenflow-eine-uebezeit.test.ts` - eine Stelle von
 * dreien wusste nichts von der Regel der anderen beiden
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export function computePupilStats(alleEreignisse: TaskEvent[]): PupilStats {
  const ev = alleEreignisse.filter((e) => e.lesson !== GOAL_CHANGE_LESSON);
  const tasks = ev.length;
  const chars = ev.reduce((s, e) => s + e.chars, 0);
  const errors = ev.reduce((s, e) => s + e.errors, 0);
  const accuracy = chars + errors > 0 ? chars / (chars + errors) : 0;
  // ★★★★★ TEMPO ohne Wortspiele (02.09.2026, siehe `istWortspiel`). Alles
  // andere - Genauigkeit, Zeichen, Fehler, Übezeit, Tage - rechnet weiter über
  // ALLE Ereignisse: Ein Wortspiel ist Übung, nur eben keine Tempo-Messung.
  //
  // ⚠️ Die TIPPCHALLENGE ist hier bewusst NICHT ausgenommen (Johannes,
  // 10.09.2026: *„nimm es auf alle fälle ganz normal in die statistik auf,
  // niveau für die klasse passt"*). In der Nacht davor war sie es - aus Sorge,
  // ein Niveau über oder unter dem Stand des Kindes könnte sein persönliches
  // Tempo-Ziel verstellen. Johannes hat entschieden: Das Niveau wählt die
  // Lehrkraft passend zur Klasse, und dann ist eine Tippchallenge dasselbe wie
  // jede andere geschriebene Zeile. Siehe `istSchreibprobe` - die Funktion gibt
  // es weiter, sie wird nur nicht mehr zum Aussortieren benutzt.
  const tempoEv = tempoOhneBremsendeMelodie(ev.filter((e) => !istWortspiel(e.lesson)));
  // ★★★★★ Bauplan F1b (Messung 18.09., §12): GEWICHTET wie die Tippchallenge
  // (Zeichen gesamt ÷ Zeit gesamt), nicht mehr das ungewichtete Mittel der
  // Zeilen-Tempi - sonst zählt eine 3-Zeichen-Zeile so viel wie eine mit 60,
  // und `zeilenTempoPlausibel` nimmt implausible Zeilen vorher raus (eine
  // liegen gelassene Zeile mit Stunden statt Sekunden kippte sonst allein die
  // ganze Rechnung, gemessen bis auf einen Bruchteil des echten Tempos).
  const tempoLines = tempoEv.filter(zeilenTempoPlausibel);
  const tempoChars = tempoLines.reduce((s, e) => s + e.chars, 0);
  const tempoMs = tempoLines.reduce((s, e) => s + e.ms, 0);
  const avgCpm = tempoMs > 0 ? (tempoChars / tempoMs) * 60000 : 0;
  const bestCpm = bestesTempo(tempoEv);
  // „Geübte Zeit" = reine Tipp-Zeit ohne lange Pausen (activeMs), wo vorhanden;
  // für alte Ereignisse ohne activeMs zählt die Bearbeitungszeit (ms).
  const msOf = (e: TaskEvent) => Math.max(0, e.activeMs ?? e.ms);
  const totalMs = ev.reduce((s, e) => s + msOf(e), 0);
  // Getrennt nach Sprache: englische und französische Inhalte separat, alles
  // andere (auch alte Stände ohne `lang`) zählt als Deutsch.
  // ★ Mechanik-Behebung fr (26.09.2026, Bug aus dem Feinschliff): vorher
  // `totalMs - totalMsEn` - französische Übezeit erschien in „Mes progrès"
  // als „Temps exercé en allemand".
  const totalMsEn = ev.reduce((s, e) => s + (e.lang === "en" ? msOf(e) : 0), 0);
  const totalMsFr = ev.reduce((s, e) => s + (e.lang === "fr" ? msOf(e) : 0), 0);
  // ★ ES-O (27.09.2026): derselbe Fehler drohte für „es" - spanische Übezeit
  // wäre als deutsche gezählt worden.
  const totalMsEs = ev.reduce((s, e) => s + (e.lang === "es" ? msOf(e) : 0), 0);
  const totalMsDe = totalMs - totalMsEn - totalMsFr - totalMsEs;
  const days = new Set(ev.map((e) => dayKey(e.ts))).size;
  const lastActive = tasks ? Math.max(...ev.map((e) => e.ts)) : null;
  const firstActive = tasks ? Math.min(...ev.map((e) => e.ts)) : null;
  return {
    tasks,
    chars,
    errors,
    accuracy,
    avgCpm,
    bestCpm,
    wpm: avgCpm / 5,
    totalMs,
    totalMsDe,
    totalMsEn,
    totalMsFr,
    totalMsEs,
    days,
    firstActive,
    lastActive,
    suspicion: suspicionScore(ev),
  };
}

/**
 * Die schwächsten freigeschalteten Tasten eines Spielstands - die Liste
 * „Wacklige Tasten" (Lehrkraft, Schülerstatistik, je Übungszeile).
 *
 * @param rahmen ★ D-5 (28.09.2026): Weg und Stufe der Person - PFLICHT, denn
 *   die Schwelle hängt an beiden (`wackligSchwelle`, wacklig.ts). Kein stiller
 *   Rückfall auf 95 %: sonst sähe eine Lehrkraft eine andere Liste als das Kind.
 */
export function weakestKeys(
  letters: Record<string, LetterStat> | undefined,
  introduced: string[],
  rahmen: WackligRahmen,
  n = 6,
): { unit: string; acc: number; samples: number }[] {
  if (!letters) return [];
  const schwelle = wackligSchwelle(rahmen.lernweg, rahmen.stufe);
  return introduced
    .map((unit) => {
      const s = letters[unit];
      const samples = letterSamples(s);
      const acc = samples > 0 ? letterAccuracy(s) : 1;
      return { unit, acc, samples };
    })
    // ★ D-4 (28.09.2026): erst ab WACKLIG_MIND_ANSCHLAEGE (20) Anschlägen - bei
    // dreien machte ein einziger Vergreifer 67 % (wacklig.ts).
    // ★ D-5: die Schwelle je Weg und Stufe (de/es 95 %; fr/en Kinder und
    // Jugendliche 90 %, Erwachsene 95 %).
    .filter((x) => x.samples >= WACKLIG_MIND_ANSCHLAEGE && x.acc < schwelle)
    .sort((a, b) => a.acc - b.acc)
    .slice(0, n);
}

/**
 * Eigenständigkeits-/KI-Verdacht 1–10 aus Signalen. Hoch = auffällig.
 * Beim Tippen: Einfügen, Fokuswechsel, unplausibel hohes Tempo (eingefügter
 * statt getippter Text), fehlerfreies Höchsttempo ohne Lernverlauf.
 */
export function suspicionScore(events: readonly TaskEvent[]): {
  score: number;
  reasons: string[];
} {
  if (events.length < 5) return { score: 1, reasons: ["Noch zu wenige Daten."] };
  const reasons: string[] = [];
  let score = 1;

  const pastes = events.filter((e) => e.pasted).length;
  if (pastes > 0) {
    score += Math.min(4, pastes);
    reasons.push(`${pastes}× Einfügen (Paste) erkannt.`);
  }

  // ★ Z5/E10 (19.09.2026): PROGRAMM-TASTEN - Tastendrücke mit `isTrusted ===
  // false`, seit Schritt M je Zeile gezählt (`zeilenMessung.ts`). Die App
  // selbst erzeugt nie solche Tasten; Braillezeilen, Screenreader und die
  // Bildschirmtastatur des Systems liefern echte (MESSUNG §13). Übrig bleibt
  // ein Skript im Browser - genau der Weg, den Johannes' KI-Test vom 18.09.
  // ging (*„ich kann ja Claude Code in Chrome bitten … den Text zu tippen"*),
  // oder eine Browser-Erweiterung. Darum ein sicheres Zeichen und keine
  // Statistik: eine oder zwei Zeilen ⇒ „auffällig" (4), ab drei ⇒ „stark
  // auffällig" (7) - Johannes: *„mittel orange und rot für stark"*.
  // ⚠️ Eine Bildschirmtastatur als BROWSER-ERWEITERUNG kann solche Tasten
  // auch erzeugen - der Grund sagt es darum selbst, für die Lehrkraft, die
  // ihr Kind kennt ([[feedback_nie_gegen_das_kind]]).
  const programmZeilen = events.filter((e) => (e.unechteTasten ?? 0) > 0).length;
  if (programmZeilen > 0) {
    score += programmZeilen >= 3 ? 6 : 3;
    reasons.push(
      `In ${programmZeilen} ${programmZeilen === 1 ? "Zeile" : "Zeilen"} kamen Tasten von einem Programm im Browser statt von der Tastatur (ein Skript oder eine Browser-Erweiterung - auch eine Bildschirmtastatur als Erweiterung kann das auslösen).`,
    );
  }

  const blurs = events.filter((e) => e.blurred).length;
  const blurRate = blurs / events.length;
  if (blurRate > 0.2) {
    score += 2;
    reasons.push(`Häufiger Fokus-/Fensterwechsel (${Math.round(blurRate * 100)} %).`);
  }

  // Unplausibel schnell: über 700 Anschläge/Min (≈ 140 WPM) ist für Lernende
  // praktisch nie echt getippt.
  // ★ Bauplan F1 (Messung 18.09., §11): NUR unter Zeilen mit plausibler `ms`
  // (`zeilenTempoPlausibel`) - eine Zeile mit kaputt gemessenem, fast-null
  // `ms` (gemessen bis 15.909 Anschläge/Min, fast nur Hilfsmittel-Kinder)
  // ist kein Verdachtsmoment, sondern ein Messfehler und würde sonst
  // ausgerechnet diese Kinder überproportional treffen (§11 D).
  const fast = events.filter((e) => zeilenTempoPlausibel(e) && cpmOf(e) > 700).length;
  const fastRate = fast / events.length;
  if (fastRate > 0.3) {
    score += 3;
    reasons.push(`Sehr viele unplausibel schnelle Übungen (${Math.round(fastRate * 100)} %).`);
  }

  const totalChars = events.reduce((s, e) => s + e.chars, 0);
  const totalErr = events.reduce((s, e) => s + e.errors, 0);
  const acc = totalChars + totalErr > 0 ? totalChars / (totalChars + totalErr) : 0;
  if (acc > 0.99 && fastRate > 0.2) {
    score += 1;
    reasons.push("Makellose Genauigkeit bei hohem Tempo, kein Lernverlauf.");
  }

  if (reasons.length === 0) reasons.push("Unauffällig.");
  return { score: Math.max(1, Math.min(10, score)), reasons };
}
