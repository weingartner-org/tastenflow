/**
 * TASTATUR-LAYOUTS für „Tastenflow".
 *
 * Bis 27.07.2026 war genau EINE Tastatur eingebaut: die deutsche/österreichische
 * QWERTZ-Tastatur. Wer eine Schweizer oder englische Tastatur vor sich hat, bekam
 * darum eine falsche Bildschirm-Tastatur, falsche Finger-Ansagen („die Taste ß" —
 * die es dort gar nicht gibt) und Texte, die sich schlicht nicht tippen lassen.
 *
 * Dieses Modul beschreibt jede unterstützte Tastatur EINMAL vollständig:
 *  • `rows`     — die vier Tastenreihen, so wie sie auf der Tastatur stehen;
 *                 daraus wird die Bildschirm-Tastatur GEZEICHNET und zugleich die
 *                 Finger-Zuordnung ABGELEITET (eine Quelle, kein Doppelpflegen).
 *  • `access`   — welche Zeichen über Umschalt/AltGr/Totaste erreicht werden.
 *  • `missing`  — Zeichen, die es auf dieser Tastatur NICHT gibt (Schweiz: ß;
 *                 englische Tastaturen: ä ö ü ß …). Sie werden weder freigeschaltet
 *                 noch geübt.
 *  • `ersatz`   — die übliche Ersatzschreibweise dafür (Schweiz: ß → ss, was dort
 *                 die RICHTIGE Rechtschreibung ist; englische Tastatur: ä → ae).
 *                 Ohne sie fielen z. B. 17 von 33 Geschichten für Schweizer Kinder
 *                 aus, weil eine einzige ß-Zeile die ganze Serie sperrt.
 *  • `capsUpper`— Zeichen, deren Großform die FESTSTELLTASTE braucht (Schweiz:
 *                 Umschalt+ä ergibt à, nicht Ä).
 *
 * Die Zuordnung Taste→Finger folgt in allen Layouts derselben Spaltenregel des
 * Zehnfingersystems, deshalb wird sie aus der Reihen-Position berechnet statt je
 * Layout abgetippt. Siehe [[project_zehnfinger_trainer]].
 */
import type { FingerId, KeyAccess } from "./fingers";
import type { Lang } from "./account";
import { altSpracheOderEn, grossFuer, istGeruestSprache, kleinFuer, type GeruestSprache } from "./sprachRegister";
// ★ O2-TASTATUR (30.10.2026): die Tabellen tragen nur Daten (`import type` zurück) - kein Kreis zur Laufzeit.
import { LAYOUT_TEXTE_BG } from "./tastaturTexteBg";
import { LAYOUT_TEXTE_EL } from "./tastaturTexteEl";
import { LAYOUT_TEXTE_HU } from "./tastaturTexteHu";
import { LAYOUT_TEXTE_NL } from "./tastaturTexteNl";
import { LAYOUT_TEXTE_PT } from "./tastaturTextePt";
import { LAYOUT_TEXTE_BR } from "./tastaturTexteBr";
import { LAYOUT_TEXTE_RO } from "./tastaturTexteRo";
import { LAYOUT_TEXTE_SV } from "./tastaturTexteSv";
import { LAYOUT_TEXTE_UK } from "./tastaturTexteUk";

/**
 * ★ E3 (25.09.2026, Bauplan französischer Lehrgang §3, §14 E3): fünf neue
 * Tastaturen für Weg „fr" - `fr` (Frankreich, AZERTY), `be` (Belgien, AZERTY),
 * `ch-fr` (Schweiz-Französisch, gilt auch für Luxemburg), `ca-csa` (Kanada,
 * „Canadien multilingue standard"), `ca-fr` (Kanada, Windows-Standard
 * „Français (Canada)"). **UNSICHTBAR ohne `?franzoesisch-lehrgang=1`** - siehe
 * {@link sichtbareLayouts}. `layoutById`/`LAYOUTS` kennen sie trotzdem immer,
 * sonst könnte ein Kind mit gesetztem Schalter sie nicht wirklich EINSTELLEN.
 */
export type LayoutId =
  | "de" | "ch" | "us" | "uk"
  | "fr" | "be" | "ch-fr" | "ca-csa" | "ca-fr"
  | "es" | "latam"
  | "it" | "it-qzerty"
  | "pl"
  | "tr-q" | "tr-f"
  | "cs" | "cs-qwerty"
  // ★★★ G3b (25.10.2026): uk
  | "ua" | "ua-std"
  // ★★★ G3b (25.10.2026): sv
  | "sv"
  // ★★★ G3b (25.10.2026): ro
  | "ro" | "ro-prog"
  // ★★★ G3b (25.10.2026): br
  | "br-abnt2"
  // ★★★ G3b (25.10.2026): pt
  | "pt"
  // ★★★ G3b (25.10.2026): nl
  | "nl-intl" | "nl-dutch"
  // ★★★ G3b (25.10.2026): hu
  | "hu" | "hu-101"
  // ★★★ G3b (25.10.2026): el
  | "el" | "el-220" | "el-319"
  // ★★★ G3b (25.10.2026): bg
  | "bg" | "bg-schreibm" | "bg-phon" | "bg-phon-trad";

/**
 * ★ E3: Die fünf französischen Tastaturen - für {@link sichtbareLayouts} und
 * alles, was „nur mit Schalter" gilt.
 */
export const FRANZOESISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set([
  "fr", "be", "ch-fr", "ca-csa", "ca-fr",
]);

/**
 * ★ ES-F3 (27.09.2026, Bauplan §3): die zwei spanischen Pflicht-Tastaturen -
 * Spanien (ISO, Windows „Spanisch") und Lateinamerika (Windows/Mac „Latin
 * American"). Dieselbe Bauart wie {@link FRANZOESISCHE_LAYOUT_IDS}.
 */
export const SPANISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["es", "latam"]);

/**
 * ★★★ F3-it (02.10.2026, Bauplan italienischer Lehrgang §2): die zwei ITALIENISCHEN Tastaturen -
 * `it` (Italien: Windows „Italiano" 141/142 und Mac „Italiano - Pro", gleiche Grundebene) und
 * `it-qzerty` (Mac „Italiano", Apple-QZERTY). Sie gibt es NUR hinter dem italienischen Schalter
 * (`?italienisch-lehrgang=1`, siehe {@link sichtbareLayouts}).
 */
export const ITALIENISCHE_EIGENE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["it", "it-qzerty"]);

/**
 * ★ F3-it: ALLE Tastaturen, die Weg „it" anbietet - die zwei italienischen und die Schweizer
 * Belegungen für das Tessin und Graubünden (es gibt keine Schweizer-italienische Belegung: im Tessin
 * tippt man auf `ch-fr`, seltener auf `ch`; `ì ò ù` liegen dort auf der Gravis-Totaste).
 * ⚠️ `ch-fr` steht damit in ZWEI Gruppen (französisch UND italienisch), `ch` ist die Standard-Tastatur
 * des deutschen Weges - {@link sichtbareLayouts} zählt deshalb "eine Gruppe ist an", nicht "alle".
 */
export const ITALIENISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["it", "it-qzerty", "ch-fr", "ch"]);

/**
 * ★★★ F3-pl (02.10.2026, Bauplan §0a, R1 `recherche-polnisch-2026-10-02/tastaturen-und-zeichen.md`
 * §8): die EINE polnische Tastatur - `pl` = Windows „Polski (programisty)" UND Mac „Polish - Pro"
 * (US-Grundebene, die neun Buchstaben auf AltGr bzw. Option + Grundbuchstabe). Die Schreibmaschinen-
 * Belegung „Polski (214)" und der Mac „Polish" sind KEINE Lerntastatur (R1 §8.2, Empfehlung): sie werden
 * nur erkannt und an die Programmierer-Belegung verwiesen (`tastaturErkennung.ts`, `pl-214`). Es gibt
 * sie nur hinter dem polnischen Schalter (`?polnisch-lehrgang=1`, siehe {@link sichtbareLayouts}).
 */
export const POLNISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["pl"]);

/**
 * ★★★ F3-tr (02.10.2026, Bauplan §0a, R0 `recherche-didaktik-2026-10-02/didaktik-tuerkisch.md` T1,
 * R1 `recherche-tuerkisch-2026-10-02/tastaturen-und-zeichen.md` §7): die ZWEI türkischen Tastaturen -
 * `tr-q` (Windows „Türkçe Q" und Mac „Turkish - QWERTY - PC": die Tastatur in Haushalten, Schulen und
 * im Handel, Windows-Voreinstellung) und `tr-f` (Windows „Türkçe F" und Mac „Turkish - Standard": die
 * amtliche Norm TS 2117, in MEB-Kursen und Behörden). Beide gibt es NUR hinter dem türkischen Schalter
 * (`?tuerkisch-lehrgang=1`, siehe {@link sichtbareLayouts}). Mac „Turkish" (Apple-eigener F-Entwurf) und
 * Mac „Turkish - QWERTY" (US-Grundebene mit Option) sind keine Lerntastaturen: die Erkennung sieht sie nicht
 * als App-Tastatur (`tastaturErkennung.ts`).
 */
export const TUERKISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["tr-q", "tr-f"]);

/**
 * ★ F3-tr: die Tastaturen, die Weg „tr" ANBIETET - heute nur Q (Entscheidung Johannes + Chat 02.10.2026,
 * „Hardware vor Ort": Q ist die Tastatur in Haushalten, Schulen, Handel; F ist die Norm und bekommt einen
 * EIGENEN zweiten Weg „tr-F" mit eigener Reihenfolge). `tr-f` ist als Daten da und wird erkannt, aber hier
 * NICHT eingetragen: ein Kind an einer F-Tastatur soll auf der Q-Reihenfolge (`a s d f | j k l ş`) nichts
 * falsch lernen - es bekommt, sobald Weg „tr" seine Hauptsprache trägt (F4), den Hinweis „dein Weg braucht
 * eine andere Tastatur" (`TastaturVorschlag`, `tastaturPasstZumWeg`). Wer `tr-f` NACHTRÄGT, wenn der Weg
 * „tr-F" gebaut ist, ergänzt diese Menge oder legt eine zweite für den neuen Weg an.
 */
export const TUERKISCHE_WEG_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["tr-q"]);

/**
 * ★★★ F3-cs (02.10.2026, Bauplan §0a, R0 `recherche-didaktik-2026-10-02/didaktik-tschechisch.md` §0 C1-C14, R1
 * `recherche-tschechisch-2026-10-02/tastaturen-und-zeichen.md` §2-§8): die ZWEI tschechischen Tastaturen -
 * `cs` (Windows „Čeština" / „Czech" = die Norm, QWERTZ, und Mac „Czech") und `cs-qwerty` (Windows „Čeština (QWERTY)" /
 * „Czech (QWERTY)" und Mac „Czech - QWERTY": dieselbe Grund- und Umschalt-Ebene, nur y und z stehen wie auf der
 * englischen Tastatur). Hardware vor Ort (Johannes 02.10.): die Norm ist QWERTZ, in einer (nicht repräsentativen)
 * Umfrage nutzen 60 % QWERTY - beide Weg-Tastaturen. Beide gibt es NUR hinter dem tschechischen Schalter
 * (`?tschechisch-lehrgang=1`, siehe {@link sichtbareLayouts}). „Czech Programmers" (Windows KBDCZ2: US-Grundebene, die
 * tschechischen Buchstaben auf AltGr + Zifferntaste) ist KEIN Lernweg-Layout: seine Grundebene ist die von `us` und per
 * `getLayoutMap` nicht von dort zu trennen (`tastaturErkennung.ts`).
 */
export const TSCHECHISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["cs", "cs-qwerty"]);

/**
 * ★★★ G3b (25.10.2026): die vier bulgarischen Tastaturen (Bauplan bg §1 D9, §2): BDS (Bezug), Schreibmaschine, phonetisch, phonetisch traditionell. Alle vier gehören zum Weg „bg" (die phonetischen bekommen eigene Folgen am Wert, Bauplan B2) und sind nur mit `?bulgarisch-lehrgang=1` sichtbar ({@link sichtbareLayouts}).
 */
export const BULGARISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["bg", "bg-schreibm", "bg-phon", "bg-phon-trad"]);

/**
 * ★★★ G3b (25.10.2026): die drei griechischen Tastaturen (Bauplan el §1 D9, §2): Windows „Greek" (Bezug Griechenland und Zypern), „Greek (220)", „Greek (319)" - gleiche Buchstaben, andere Satzzeichen. Nur mit `?griechisch-lehrgang=1` sichtbar.
 */
export const GRIECHISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["el", "el-220", "el-319"]);

/**
 * ★★★ G3b (25.10.2026): die zwei ungarischen Tastaturen (Bauplan hu §1 D9, §2): Windows „Hungarian" (QWERTZ, 105 Tasten, Bezug) und „Hungarian 101-key" (QWERTY). Nur mit `?ungarisch-lehrgang=1` sichtbar.
 */
export const UNGARISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["hu", "hu-101"]);

/**
 * ★★★ G3b (25.10.2026): die Tastaturen des Weges „nl" (Bauplan nl §1 D9, §2): US-International (Bezug Niederlande), die BESTEHENDE belgische `be` (Bezug Flandern, steht damit in zwei Gruppen wie `ch-fr`) und Windows „Dutch" (Nebenweg). Die zwei neuen nur mit `?niederlaendisch-lehrgang=1` sichtbar; `be` ausserdem wie bisher mit dem französischen Schalter.
 */
export const NIEDERLAENDISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["nl-intl", "be", "nl-dutch"]);

/**
 * ★★★ G3b (25.10.2026): die Tastatur des Weges „pt" (Portugal, Bauplan pt §2): Windows „Portuguese". Nur mit `?portugiesisch-lehrgang=1` sichtbar.
 */
export const PORTUGIESISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["pt"]);

/**
 * ★★★ G3b (25.10.2026): die Tastatur des Weges „br" (Brasilien, Bauplan pt §2): Windows „Portuguese (Brazilian ABNT2)" (= „ABNT", Wächter). Nur mit `?brasilianisch-lehrgang=1` sichtbar.
 */
export const BRASILIANISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["br-abnt2"]);

/**
 * ★★★ G3b (25.10.2026): die zwei rumänischen Lerntastaturen (Bauplan ro §1 R1-R3, §2): Windows „Romanian (Standard)" (Bezug) und „Romanian (Programmers)". „Romanian (Legacy)" ist kein Lernweg-Layout (nur erkannt: `{ fremd, ro-legacy }`). Nur mit `?rumaenisch-lehrgang=1` sichtbar.
 */
export const RUMAENISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["ro", "ro-prog"]);

/**
 * ★★★ G3b (25.10.2026): die schwedische Tastatur (Bauplan sv §2): Windows „Swedish" = „Finnish" (Taste für Taste gleich, Wächter) - Schweden und Finnland. Nur mit `?schwedisch-lehrgang=1` sichtbar.
 */
export const SCHWEDISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["sv"]);

/**
 * ★★★ G3b (25.10.2026): die zwei ukrainischen Tastaturen (Bauplan uk §2) - Kennungen `ua`/`ua-std`, weil `uk` die britische Tastatur ist: Windows „Ukrainian (Enhanced)" (Bezug, Windows-Vorgabe) und „Ukrainian" (Standard, ohne Apostroph). Nur mit `?ukrainisch-lehrgang=1` sichtbar.
 */
export const UKRAINISCHE_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["ua", "ua-std"]);

/**
 * ★ F3-tr: Tastaturen, die hinter dem Schalter einer Sprache stehen, aber (noch) in KEINER Tastatur-Menge
 * eines Weges ({@link TASTATUREN_DER_SPRACHE}) - sonst fiele `tr-f` in {@link sichtbareLayouts} unter
 * „steht in keiner Gruppe ⇒ für alle sichtbar".
 */
const NUR_MIT_SCHALTER_DER_SPRACHE: Readonly<Partial<Record<LayoutId, Lang>>> = { "tr-f": "tr" };

/**
 * ★ F3-it: die vier Tastaturen, die es OHNE jeden Lehrgangs-Schalter gibt (die bisherigen, Weg „de"
 * und „en", »Im Griff«). Auch wenn sie in der Tastatur-Menge eines Weges stehen (`ch` bei „it"),
 * werden sie dadurch nie unsichtbar.
 */
const IMMER_SICHTBAR_LAYOUT_IDS: ReadonlySet<LayoutId> = new Set(["de", "ch", "us", "uk"]);

/** Je Sprache eine EIGENE leere Menge - nie dieselbe geteilt (wer in eine einträgt, trifft keine andere). */
const keineLayouts = (): ReadonlySet<LayoutId> => new Set();

/**
 * ★ G2b-2 (02.10.2026): die Tastaturen, die zum LEHRGANG einer Sprache gehören - EIN Eintrag je
 * Sprache. Leer heisst: die Sprache hat (noch) keine eigenen, an einen Lehrgang gebundenen
 * Tastaturen (de und en: ihre vier Tastaturen sind für alle da; it, pl, tr, cs: ihre Tastaturen
 * kommen mit ihrer Etappe F3 und tragen sich HIER ein). `Record<Lang, …>`: eine neue Sprache
 * kompiliert erst mit einem Eintrag. Vorher gab es nur die zwei Mengen oben und je Sprache einen
 * eigenen Schalter-Parameter (`sichtbareLayouts(fr, es)`) - die nächste Sprache hätte ihre
 * Tastaturen sofort für ALLE sichtbar gemacht, weil sie in keiner der zwei Mengen stand.
 * ★ F3-it: it trägt seit heute seine vier ein ({@link ITALIENISCHE_LAYOUT_IDS}); pl, tr, cs folgen mit
 * ihrer Etappe F3. ★ F3-pl: pl trägt seine eine ein ({@link POLNISCHE_LAYOUT_IDS}); tr, cs folgen.
 * ★ F3-tr: tr trägt `tr-q` ein ({@link TUERKISCHE_WEG_LAYOUT_IDS}); cs folgt.
 * ★ F3-cs: cs trägt seine zwei ein ({@link TSCHECHISCHE_LAYOUT_IDS}) - alle Sprachen haben jetzt Tastaturen.
 */
export const TASTATUREN_DER_SPRACHE: Readonly<Record<Lang, ReadonlySet<LayoutId>>> = {
  de: keineLayouts(),
  en: keineLayouts(),
  fr: FRANZOESISCHE_LAYOUT_IDS,
  es: SPANISCHE_LAYOUT_IDS,
  it: ITALIENISCHE_LAYOUT_IDS,
  pl: POLNISCHE_LAYOUT_IDS,
  // ★ F3-tr: nur Q (siehe {@link TUERKISCHE_WEG_LAYOUT_IDS}); F ist erkannt, aber kein Lernweg-Layout von „tr".
  tr: TUERKISCHE_WEG_LAYOUT_IDS,
  // ★ F3-cs: beide Tastaturen gehören zum Weg „cs" ({@link TSCHECHISCHE_LAYOUT_IDS}).
  cs: TSCHECHISCHE_LAYOUT_IDS,
  // ★ G2-NEUN (25.10.2026): noch keine eigenen Tastaturen (kommen mit F3 der Sprache) - je Sprache eine EIGENE leere Menge.
  bg: BULGARISCHE_LAYOUT_IDS, // ★★★ G3b (25.10.2026)
  el: GRIECHISCHE_LAYOUT_IDS, // ★★★ G3b (25.10.2026)
  hu: UNGARISCHE_LAYOUT_IDS, // ★★★ G3b (25.10.2026)
  nl: NIEDERLAENDISCHE_LAYOUT_IDS, // ★★★ G3b (25.10.2026)
  pt: PORTUGIESISCHE_LAYOUT_IDS, // ★★★ G3b (25.10.2026)
  br: BRASILIANISCHE_LAYOUT_IDS, // ★★★ G3b (25.10.2026)
  ro: RUMAENISCHE_LAYOUT_IDS, // ★★★ G3b (25.10.2026)
  sv: SCHWEDISCHE_LAYOUT_IDS, // ★★★ G3b (25.10.2026)
  uk: UKRAINISCHE_LAYOUT_IDS, // ★★★ G3b (25.10.2026)
};

/**
 * ★ ES-P7a-Behebung (27.09.2026, Prüfbericht M1): Tastaturen, deren
 * Totasten-Mechanik („Totaste + Grundbuchstabe = EIN Anschlag") der Lehrgang
 * selbst lehrt - heute Französisch UND Spanisch. Vorher fragten sechs Stellen
 * einzeln `FRANZOESISCHE_LAYOUT_IDS.has(...)` und übersahen darum Spanisch
 * (´ und ¨ wurden auf es/latam nie als Anschlag verbucht). Jetzt EINE Stelle.
 * ⚠️ NICHT durch `kombizeichenFuerLayout(lay).length > 0` ersetzen: die
 * deutsche Tastatur hat `^` als Totaste (ê â î ô û) und gehört trotzdem NICHT
 * dazu - nur Layouts, deren Lernweg die Totaste als eigene Einheit führt.
 */
export function hatLehrgangsTotasten(layoutId: LayoutId): boolean {
  // ★ F3-cs: auch Tschechisch - der Weg lehrt Čárka ´ und Háček ˇ als eigene Einheiten (ď ť ň ó, alle Grossformen
  // mit Akzent); dazu gilt die Feststell-Meldung („Feststelltaste ist an"): mit Feststell gibt die Zahlenreihe
  // Ě Š Č Ř Ž Ý Á Í É statt der kleinen Buchstaben.
  // ★★ G3b (25.10.2026, Falle 50): an der EIGENSCHAFT der Tastatur (`lehrgangsTotasten`), nicht mehr an drei Kennungs-
  // Mengen - dieselben neun bisherigen Tastaturen tragen sie (Wächter), dazu die neuen mit Totasten im Lehrgang.
  // Eine unbekannte Kennung ist keine Tastatur mit Lehrgangs-Totasten (vorher: keine der Mengen kannte sie).
  return LAYOUTS.find((l) => l.id === layoutId)?.lehrgangsTotasten === true;
}

/**
 * ★ F3-cs (02.10.2026, R1 §7): braucht JEDE Ziffer dieser Tastatur die Umschalttaste? Dann trägt die Zahlenreihe auf der
 * Kappe Buchstaben oder Zeichen (Frankreich, Belgien `& é " ' ( ...`, italienische Mac-QZERTY, Tschechien `ě š č ř ž ...`)
 * und die Ziffer steht klein darüber. Abgeleitet aus `access` (Windows-Modell), keine Liste von Kennungen (Falle 50).
 */
export function ziffernNurMitUmschalt(layout: KeyboardLayout): boolean {
  return [..."0123456789"].every((d) => layout.access[d]?.mod === "shift");
}

/**
 * Die physischen Randtasten als `KeyboardEvent.code`. Die Tastatur markiert
 * damit die Taste, die GERADE GEDRÜCKT wurde (Tasten erkunden, 12.09.2026).
 */
export type RandTastenCode = "Backspace" | "Tab" | "CapsLock" | "Enter" | "ShiftLeft" | "ShiftRight";

/** Eine Zusatztaste am Reihenrand (Tab, Feststell, Umschalt, Enter, Rücktaste). */
export interface EdgeKey {
  label: string;
  /** Breite in em (die Buchstabentasten sind 2.1em breit). */
  w: string;
  /** Schriftgröße (die Symbole ⇥ ⇪ ⇧ ↵ brauchen mehr als die Wort-Beschriftungen). */
  fs?: string;
  /** Umschalttaste links/rechts — wird hervorgehoben, wenn sie dran ist. */
  shift?: "links" | "rechts";
  /**
   * Welche physische Taste das ist. Steht hier AUSDRÜCKLICH, statt aus der
   * Stelle erraten zu werden („rechter Rand der zweiten Reihe"): Der Enter
   * sitzt bei ISO in der oberen Reihe, bei ANSI in der Grundreihe - eine
   * Regel über die Position läge bei einer der beiden Formen daneben.
   */
  code: RandTastenCode;
  /**
   * Der untere Teil des zweiteiligen ISO-Enters. Er ist KEINE eigene Taste,
   * sondern dieselbe wie der obere Teil (`code: "Enter"`) und wird mit ihm
   * zusammen markiert.
   */
  unterteil?: true;
}

export interface KeyRow {
  keys: readonly string[];
  left?: EdgeKey;
  right?: EdgeKey;
}

export interface KeyboardLayout {
  id: LayoutId;
  /** Name im Auswahlfeld. */
  label: string;
  /** Kurzname für Sprachausgabe/Ansagen. */
  kurz: string;
  /** Die vier Tastenreihen (Zahlenreihe, obere Reihe, Grundreihe, untere Reihe). */
  rows: readonly KeyRow[];
  /** Beschriftungen der Leertastenreihe (links außen → rechts außen). */
  bottomLabels: readonly [string, string, string, string];
  /**
   * ★ F3-pl (02.10.2026): dieselben Beschriftungen für den MAC, wo sie abweichen. Polnisch: dieselbe
   * Tastatur („Polski (programisty)" und „Polish - Pro") steht auf Windows-PCs UND Macs; die Taste
   * rechts neben der Leertaste heisst dort „Alt", hier „Option". Fehlt das Feld (alle bisherigen
   * Tastaturen), gilt `bottomLabels` auf beiden Systemen. Lesen immer über {@link bottomLabelsFuer}.
   */
  bottomLabelsMac?: readonly [string, string, string, string];
  /** Zeichen, die eine Zusatztaste (Umschalt/AltGr) oder eine Totaste brauchen. */
  access: Readonly<Record<string, KeyAccess>>;
  /**
   * ★ F3-pl (02.10.2026): die Zugänge, die der MAC anders hat als `access` (das die Windows-Belegung
   * abbildet, Kopf „Mac gegen Windows"): Polnisch `€` = Windows AltGr + U, Mac „Polish - Pro" Option + 3
   * (Option + U ist dort eine Totaste). Fehlt das Feld, gilt `access` auf beiden Systemen. Gelesen wird
   * es NUR über {@link zugangFuer} (`charAccess`: Anzeige, Ansage, Hervorhebung) - die Stellen, die
   * `layout.access` direkt lesen (Lehrgangs-Reihenfolgen, Totasten), kennen es nicht; ein Zeichen, das
   * hier abweicht, darf also nie ein Lernziel eines Weges sein.
   */
  accessMac?: Readonly<Record<string, KeyAccess>>;
  /** Zeichen, die es auf dieser Tastatur nicht gibt. */
  missing: readonly string[];
  /** Ersatzschreibweise für fehlende Zeichen (wird beim Servieren angewandt). */
  ersatz: Readonly<Record<string, string>>;
  /**
   * Zeichen, deren GROSSform die Feststelltaste braucht - UNTER WINDOWS.
   *
   * ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2): Auf Windows
   * wirkt die Feststelltaste bei ä ö ü (Schweiz) und é à è (Schweiz-
   * Französisch) NICHT - die Tasten tragen in der Windows-Belegung kein
   * Feststell-Merkmal, gemessen: Feststell + é gibt é. Die Liste ist darum
   * dort leer; der Windows-Weg ist die Totaste (¨ bzw. ´/`), dann Umschalt.
   */
  capsUpper: readonly string[];
  /**
   * ★ W1: dieselbe Liste für den MAC (`layoutPlattform() === "mac"`), wo sie
   * von `capsUpper` abweicht - dort gibt die Feststelltaste die Grossform
   * (bisheriger, am Mac beschriebener Stand; nicht neu gemessen). Fehlt das
   * Feld, gilt `capsUpper` auf beiden Systemen.
   */
  capsUpperMac?: readonly string[];
  /**
   * ★ W1 (27.09.2026, BEFUND §3.8 Punkt 2, Johannes): GROSSBUCHSTABEN, die
   * diese Tastatur (Windows) auf KEINEM Weg erzeugt - Frankreich É und Ç,
   * Belgien und Schweiz-Französisch Ç. Sie werden weder ersetzt (É → E
   * lehrte falsches Französisch, Anhang C) noch geübt: Zeilen mit ihnen
   * werden nicht serviert (`fitText`), erzeugte Zeilen beginnen dort nicht
   * gross (`generator.ts`). Eigenes Feld, NICHT `missing` - das vergleicht
   * klein und würde das tippbare „é" mitsperren (Falle Bauplan §15.7).
   */
  grossFehlt?: readonly string[];
  /**
   * ★ F3-it (02.10.2026): dieselbe Liste für den MAC, wo sie von `grossFehlt` abweicht. Italienisch:
   * Windows „Italiano" erzeugt `À È É Ì Ò Ù` auf keinem Weg (nur Alt-Code), am Mac „Italiano - Pro"
   * geht es mit Option + Umschalt - dort ist die Liste LEER. Fehlt das Feld, gilt `grossFehlt` auf
   * beiden Systemen (alle bisherigen Tastaturen: unverändert). Lesen immer über {@link grossFehltFuer}.
   */
  grossFehltMac?: readonly string[];
  /** Erklärung für den Einstellungsbereich (immer sichtbar, wenn gewählt). */
  hinweis?: string;
  /**
   * ★ G2b-1 (02.10.2026, Türkisch T7): die Sprache, in der DIESE Tastatur Gross-
   * und Kleinbuchstaben rechnet. Fehlt sie (alle Tastaturen bis heute), gilt
   * Deutsch = die gewöhnliche `toLowerCase()`/`toUpperCase()`. Die türkischen
   * Tastaturen (`tr-q`, `tr-f`, kommen mit der Tastatur-Etappe) setzen `"tr"`:
   * dann ist „I" die Grossform von „ı" und „İ" die von „i" - für JEDE Funktion
   * (`baseKeyForChar`, `needsShift`, `keyExists`, `toLayoutText` …), ohne dass
   * jeder Aufrufer die Sprache durchreichen muss. Ein Aufrufer, der die Sprache
   * des WEGES kennt, übergibt sie trotzdem (sie schlägt diese Vorgabe).
   */
  sprache?: Lang;
  /**
   * ★★★ F3-tr (02.10.2026, R1 §7.3, Bauplan Teil C): die ACHT Heimtasten dieser Tastatur - links nach
   * rechts: linker kleiner, Ring-, Mittel-, Zeigefinger, dann rechter Zeige-, Mittel-, Ring-, kleiner
   * Finger. Die Tasten mit den Tastmarken (Tasthöckern) sind die beiden Zeigefinger-Tasten (Stelle 4 und 5).
   * Fehlt das Feld (alle Tastaturen bis heute), gilt die feste Reihe von {@link FINGERS} (`a s d f | j k l`)
   * mit der achten Taste des Weges (`homeKeyFor`) und die Tastmarken liegen auf F und J. Türkisch F hat eine
   * völlig andere Grundreihe (`u i e a | k m l y`, Tastmarken auf A und K - dieselbe STELLE, nicht derselbe
   * Buchstabe), Türkisch Q trägt `ş` als achte. Gelesen wird NUR die Eigenschaft der eingestellten Tastatur,
   * nie eine Sprach- oder Tastatur-Kennung (Falle 50). Ein Wächter vergleicht sie mit den Plätzen 0-3 und
   * 6-9 der Grundreihe (`rows[2]`, dieselben Plätze wie `grundstellung.ts`).
   */
  heimtasten?: readonly [string, string, string, string, string, string, string, string];
  /**
   * ★★ G3b (25.10.2026, Falle 50): lehrt der Lehrgang dieser Tastatur die Totasten-Mechanik als eigene Einheit
   * („Totaste + Grundbuchstabe = EIN Zeichen")? Bis hierher stand dafür in {@link hatLehrgangsTotasten} eine Liste von
   * Kennungen (fr, be, ch-fr, ca-csa, ca-fr, es, latam, cs, cs-qwerty) - jede neue Sprache hätte dort eine Zeile gebraucht.
   * Jetzt trägt die Tastatur es selbst; die bisherigen neun tragen `true`, alle anderen nichts (gleiches Ergebnis, Wächter).
   */
  lehrgangsTotasten?: true;
  /**
   * ★★ G3b (25.10.2026): zeigt die Bildschirm-Tastatur bei einem Zwei-Schritt-Zeichen (Totaste, dann Buchstabe) ZUERST
   * die Totaste? Seit F3-cs galt das an der Kennungs-Menge `TSCHECHISCHE_LAYOUT_IDS` (Begründung in `Keyboard.tsx`);
   * fr und es bleiben bewusst ohne (Byte-gleich-Regel). Die neuen Tastaturen mit Lehrgangs-Totasten tragen es von Anfang an.
   */
  zweiSchrittZeigen?: true;
  /**
   * ★★ G3b (25.10.2026): trägt der Ziffernblock dieser Tastatur ein Komma als Dezimaltrenner? Für die bisherigen
   * Tastaturen steht das als Liste in `Keyboard.tsx` (`KOMMA_LAYOUTS`, unverändert); die neuen tragen es hier.
   * ⚠️ Aus der Landesnorm (Dezimalkomma) abgeleitet, NICHT an einer Kappe gemessen (Falle 15).
   */
  ziffernblockKomma?: true;
  /**
   * ★★ G3b (25.10.2026, Falle 15): die Buchstaben, deren Kappe KLEIN bleibt, weil Umschalt auf ihrer Taste NICHT ihre
   * Grossform gibt - Bulgarisch BDS: Umschalt + ь = ѝ (eine Kappe „Ь" wäre eine falsche Auskunft); Griechisch: Umschalt + ς
   * = die Totaste ΅ (eine Kappe „Σ" zeigte das Zeichen der Taste daneben). Dieselbe Regel wie die festen Mengen der
   * bisherigen Tastaturen in `Keyboard.tsx` (fr, it, cs - unverändert); der Wächter leitet die Liste aus der Umschalt-
   * Spalte der Windows-Tabelle ab (Grossform ≠ Umschalt-Zeichen ⇒ klein).
   */
  kleineKappen?: readonly string[];
  /**
   * ★ EN2 (19.09.2026): Name, Kurzname und Erklärung in der ENGLISCHEN
   * Bedienung - nie direkt lesen, sondern über {@link layoutTexte}, damit
   * Deutsch der Weg ohne Angabe bleibt (dieselbe Bauart wie `NIVEAU_DEFS.en`
   * in `schreibprobe.ts`). Glossar §3.4.
   */
  en: { label: string; kurz: string; hinweis?: string };
}

// --- Finger-Zuordnung aus der Tastenposition --------------------------------
// Spaltenregel des Zehnfingersystems, für jede Reihe von links nach rechts. Die
// beiden Reihen-Formen unterscheiden sich nur darin, wo die Zusatztasten sitzen:
// ISO (Deutschland/Österreich, Schweiz, Großbritannien) hat eine Taste mehr in der
// Grund- und der unteren Reihe als ANSI (USA).

const kl: FingerId = "kleiner-links";
const rl: FingerId = "ring-links";
const ml: FingerId = "mittel-links";
const zl: FingerId = "zeige-links";
const zr: FingerId = "zeige-rechts";
const mr: FingerId = "mittel-rechts";
const rr: FingerId = "ring-rechts";
const kr: FingerId = "kleiner-rechts";

/** Zahlenreihe — bei ISO wie ANSI identisch aufgebaut. */
const NUM_ROW_FINGERS: readonly FingerId[] = [kl, kl, rl, ml, zl, zl, zr, zr, mr, rr, kr, kr, kr];
/** Obere/Grundreihe ohne führende Zusatztaste (q…, a…). */
const MAIN_ROW_FINGERS: readonly FingerId[] = [kl, rl, ml, zl, zl, zr, zr, mr, rr, kr, kr, kr, kr];
/** Untere Reihe MIT führender Extrataste (ISO: < bzw. \ links neben Y/Z). */
const ISO_BOTTOM_FINGERS: readonly FingerId[] = [kl, kl, rl, ml, zl, zl, zr, zr, mr, rr, kr];
/** Untere Reihe OHNE Extrataste (ANSI: die Umschalttaste reicht bis Y). */
const ANSI_BOTTOM_FINGERS: readonly FingerId[] = [kl, rl, ml, zl, zl, zr, zr, mr, rr, kr];

/**
 * Alle Reihen zusammen ~34 em breit, damit die rechten Kanten fluchten. Die
 * Zusatztasten am Rand füllen den Rest auf (Zahlen unten in `de`/`us` nachgerechnet).
 */
const ISO_ROWS = (r0: string[], r1: string[], r2: string[], r3: string[]): KeyRow[] => [
  { keys: r0, right: { label: "⌫", w: "2.8em", fs: "0.7em", code: "Backspace" } },
  {
    keys: r1,
    left: { label: "⇥", w: "3.3em", fs: "0.7em", code: "Tab" },
    right: { label: "↵", w: "1.6em", fs: "0.7em", code: "Enter" },
  },
  {
    keys: r2,
    left: { label: "⇪", w: "3.9em", fs: "0.7em", code: "CapsLock" },
    right: { label: "", w: "1.0em", code: "Enter", unterteil: true },
  },
  {
    keys: r3,
    left: { label: "⇧", w: "2.4em", fs: "0.7em", shift: "links", code: "ShiftLeft" },
    right: { label: "⇧", w: "4.9em", fs: "0.6em", shift: "rechts", code: "ShiftRight" },
  },
];

/**
 * ★ G4-NAHT (25.10.2026): eine ISO-Tastatur mit der Zusatztaste `IntlRo` rechts unten (brasilianisch ABNT2) - die untere
 * Reihe bekommt `taste` als zwölfte Taste, die Umschalttaste rechts die Breite `umschaltBreite`. `stelleFuerCode`
 * (anschlagDeuten.ts) erkennt die Zusatztaste an der Zahl der Tasten (eine mehr als die Codes der Reihe).
 */
const mitZusatztasteRechts = (rows: KeyRow[], taste: string, umschaltBreite: string): KeyRow[] =>
  rows.map((r, i) =>
    i === 3 ? { ...r, keys: [...r.keys, taste], right: r.right ? { ...r.right, w: umschaltBreite } : r.right } : r,
  );

const ANSI_ROWS = (r0: string[], r1: string[], r2: string[], r3: string[]): KeyRow[] => [
  { keys: r0, right: { label: "⌫", w: "2.8em", fs: "0.7em", code: "Backspace" } },
  { keys: r1, left: { label: "⇥", w: "2.8em", fs: "0.7em", code: "Tab" } },
  {
    keys: r2,
    left: { label: "⇪", w: "3.9em", fs: "0.7em", code: "CapsLock" },
    right: { label: "↵", w: "3.4em", fs: "0.7em", code: "Enter" },
  },
  {
    keys: r3,
    left: { label: "⇧", w: "4.5em", fs: "0.7em", shift: "links", code: "ShiftLeft" },
    right: { label: "⇧", w: "5.2em", fs: "0.6em", shift: "rechts", code: "ShiftRight" },
  },
];

// --- Die Layouts ------------------------------------------------------------

/** Deutschland/Österreich (QWERTZ) — die bisherige, unveränderte Belegung. */
const DE: KeyboardLayout = {
  id: "de",
  label: "Deutsch (Deutschland/Österreich)",
  kurz: "deutsche Tastatur",
  en: { label: "German (Germany and Austria)", kurz: "German keyboard" },
  rows: ISO_ROWS(
    ["^", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ß", "´"],
    ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ü", "+"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä", "#"],
    ["<", "y", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Strg", "Alt", "AltGr", "Strg"],
  access: {
    // Umschalt-Sonderzeichen (Zahlenreihe + rechter/unterer Rand)
    "!": { base: "1", mod: "shift" }, '"': { base: "2", mod: "shift" }, "§": { base: "3", mod: "shift" },
    $: { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "&": { base: "6", mod: "shift" },
    "/": { base: "7", mod: "shift" }, "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "=": { base: "0", mod: "shift" }, "?": { base: "ß", mod: "shift" },
    "*": { base: "+", mod: "shift" }, "'": { base: "#", mod: "shift" },
    ";": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" }, _: { base: "-", mod: "shift" },
    ">": { base: "<", mod: "shift" }, "°": { base: "^", mod: "shift" },
    // AltGr-Zeichen (Mathematik/Chemie/Technik)
    "@": { base: "q", mod: "altgr" }, "€": { base: "e", mod: "altgr" },
    "{": { base: "7", mod: "altgr" }, "[": { base: "8", mod: "altgr" }, "]": { base: "9", mod: "altgr" },
    "}": { base: "0", mod: "altgr" }, "\\": { base: "ß", mod: "altgr" },
    "~": { base: "+", mod: "altgr" }, "|": { base: "<", mod: "altgr" },
    // direkt erreichbar (eigene Taste, keine Zusatztaste)
    "+": { base: "+" }, "#": { base: "#" }, "<": { base: "<" },
    // Akzent-/Totaste (erst die Taste, dann die Leertaste)
    "^": { base: "^", dead: true },
  },
  // ★ E2 (24.09.2026): „£" gibt es auf der deutschen Tastatur nicht - für
  // deutsche Inhalte ohne Bedeutung, filtert aber Weg „en"s Sonderzeichen
  // (Bauplan §3.3) auf dieser Tastatur richtig heraus.
  missing: ["£"],
  ersatz: {},
  capsUpper: [],
};

/**
 * Schweiz (Schweizer Tastatur, QWERTZ). Buchstaben wie in Deutschland — ä ö ü
 * liegen an denselben Stellen. Zwei Unterschiede sind für den Trainer wichtig:
 *  1. Es gibt KEIN ß (die Schweiz schreibt „ss" — das ist dort korrekt, nicht
 *     etwa ein Notbehelf). Darum ß → ss.
 *  2. Umschalt + ä/ö/ü ergibt à/é/è. Die Großbuchstaben Ä Ö Ü kommen über die
 *     FESTSTELLTASTE.
 * Außerdem liegen die Sonderzeichen anders: @ = AltGr+2, # = AltGr+3, die
 * Klammern auf AltGr + ü/¨/ä/$, und ' ist eine eigene Taste (gut für Englisch).
 */
const CH: KeyboardLayout = {
  id: "ch",
  label: "Schweiz (Schweizer Tastatur)",
  kurz: "Schweizer Tastatur",
  en: {
    label: "Swiss (Switzerland)",
    kurz: "Swiss keyboard",
    hinweis:
      "The Swiss keyboard has no ß key, so German words with ß are written with " +
      "ss here - the Swiss way. Capital Ä, Ö and Ü come from the ¨ dead key " +
      "(right of ü), then Shift and the letter (Shift on ä, ö and ü gives à, é " +
      "and è). Caps Lock works too.",
  },
  rows: ISO_ROWS(
    ["§", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "^"],
    ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ü", "¨"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä", "$"],
    ["<", "y", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Strg", "Alt", "AltGr", "Strg"],
  access: {
    "°": { base: "§", mod: "shift" }, "+": { base: "1", mod: "shift" },
    '"': { base: "2", mod: "shift" }, "*": { base: "3", mod: "shift" },
    "%": { base: "5", mod: "shift" }, "&": { base: "6", mod: "shift" },
    "/": { base: "7", mod: "shift" }, "(": { base: "8", mod: "shift" },
    ")": { base: "9", mod: "shift" }, "=": { base: "0", mod: "shift" },
    "?": { base: "'", mod: "shift" }, "!": { base: "¨", mod: "shift" },
    ";": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" },
    _: { base: "-", mod: "shift" }, ">": { base: "<", mod: "shift" },
    "@": { base: "2", mod: "altgr" }, "#": { base: "3", mod: "altgr" },
    "€": { base: "e", mod: "altgr" }, "|": { base: "7", mod: "altgr" },
    "\\": { base: "<", mod: "altgr" },
    "[": { base: "ü", mod: "altgr" }, "]": { base: "¨", mod: "altgr" },
    "{": { base: "ä", mod: "altgr" }, "}": { base: "$", mod: "altgr" },
    // ★ W1 (27.09.2026, Windows KBDSG, BEFUND-2026-09-27-WINDOWS-MESSUNG
    // §3.2 + vergleich.json): „~" ist unter Windows eine TOTASTE (AltGr + ^,
    // dann Leertaste), kein Zeichen.
    "~": { base: "^", mod: "altgr", dead: true },
    "'": { base: "'" }, "§": { base: "§" }, $: { base: "$" },
    "^": { base: "^", dead: true },
    // ★ W1: die Totasten der Schweizer Belegung (Windows): ¨ ist eine EIGENE
    // Taste rechts neben ü (für Ä Ö Ü: ¨, dann Umschalt + Buchstabe), ´ liegt
    // auf AltGr + ', ` auf Umschalt + ^.
    "¨": { base: "¨", dead: true },
    "´": { base: "'", mod: "altgr", dead: true },
    "`": { base: "^", mod: "shift", dead: true },
    // ★ W1: Umschalt + ü/ö/ä ergibt è/é/à (gemessen, vergleich.json) - jetzt
    // als Zugang eingetragen, damit klar ist: die Umschalt-Ebene dieser Tasten
    // ist BELEGT, Ä Ö Ü kommen nicht über Umschalt.
    "è": { base: "ü", mod: "shift" }, "é": { base: "ö", mod: "shift" },
    "à": { base: "ä", mod: "shift" },
    // ★ W1: „£" ist Umschalt + $ (Windows KBDSG, vergleich.json) - stand in `missing`.
    "£": { base: "$", mod: "shift" },
    // ★ F3-it (02.10.2026, R1 §6.3): „ç" (Fremdwörter und Namen im Tessin) ist Umschalt + 4 - wie auf
    // `ch-fr` (dort schon eingetragen, KBDSF); auf KBDSG nach KBDSF abgeleitet, nicht aus der DLL.
    "ç": { base: "4", mod: "shift" },
  },
  missing: ["ß"],
  ersatz: { "ß": "ss" },
  // ★ W1 (27.09.): der Weg der LEHRE unter Windows ist die Totaste ¨ (dann Umschalt), nicht die
  // Feststelltaste. ⚠️ KORREKTUR 02.10.2026 (BEFUND-2026-10-02-WINDOWS-MESSUNG §2 Z1-SG, am PC in Edge und
  // Chrome 154 gemessen): die Annahme „Tabelle KBDSG: Feststell + ä = ä" vom 27.09. (damals nur aus der DLL
  // gelesen, Schweizerdeutsch war nicht installiert) war FALSCH - Feststell + ä ö ü gibt unter Windows
  // `Ä Ö Ü` (und Feststell + Umschalt dazu `À É È`). Beide Wege führen zum Zeichen und werden angenommen
  // (es zählt das fertige Zeichen). Der Hinweistext nennt beide. Die Lehre bleibt bei der Totaste (die
  // Schweizer Lehrmittel lehren sie, `capsUpper` bleibt unter Windows leer); am Mac ist die Feststelltaste
  // der beschriebene Weg. Schweiz-FRANZÖSISCH ist anders: dort bleibt é à è unter Windows klein (gemessen).
  capsUpper: [],
  capsUpperMac: ["ä", "ö", "ü"],
  hinweis:
    "Auf der Schweizer Tastatur gibt es kein ß - Wörter wie »Straße« werden hier " +
    "richtig als »Strasse« geschrieben. Die Grossbuchstaben Ä Ö Ü tippt man über " +
    "die Totaste ¨ rechts neben ü, dann Umschalt und den Buchstaben (Umschalt auf " +
    "ä ö ü ergibt à é è). Es geht auch mit der Feststelltaste.",
};

/** Gemeinsame Umschalt-/Direkt-Belegung von US- und UK-Tastatur. */
const QWERTY_BASE: Record<string, KeyAccess> = {
  "!": { base: "1", mod: "shift" }, $: { base: "4", mod: "shift" },
  "%": { base: "5", mod: "shift" }, "^": { base: "6", mod: "shift" },
  "&": { base: "7", mod: "shift" }, "*": { base: "8", mod: "shift" },
  "(": { base: "9", mod: "shift" }, ")": { base: "0", mod: "shift" },
  _: { base: "-", mod: "shift" }, "+": { base: "=", mod: "shift" },
  "{": { base: "[", mod: "shift" }, "}": { base: "]", mod: "shift" },
  ":": { base: ";", mod: "shift" },
  "<": { base: ",", mod: "shift" }, ">": { base: ".", mod: "shift" },
  "?": { base: "/", mod: "shift" },
  "-": { base: "-" }, "=": { base: "=" }, "[": { base: "[" }, "]": { base: "]" },
  ";": { base: ";" }, "'": { base: "'" }, "/": { base: "/" },
};

/**
 * USA (ANSI, QWERTY). Keine Umlaute, kein ß, kein € § °. Für englische Texte ist
 * diese Tastatur genau richtig; deutsche Texte erscheinen in der Ersatzschreibweise
 * (ä → ae), die man auf englischen Tastaturen seit jeher verwendet.
 */
const US: KeyboardLayout = {
  id: "us",
  label: "Englisch (USA, QWERTY)",
  kurz: "amerikanische Tastatur",
  en: {
    label: "English (US, QWERTY)",
    kurz: "US keyboard",
    hinweis:
      "English keyboards have no ä, ö, ü or ß. German texts therefore use the " +
      "usual substitutes (ä → ae, ß → ss) - for English, this keyboard is just right.",
  },
  rows: ANSI_ROWS(
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt", "Ctrl"],
  access: {
    ...QWERTY_BASE,
    '"': { base: "'", mod: "shift" },
    "@": { base: "2", mod: "shift" }, "#": { base: "3", mod: "shift" },
    "~": { base: "`", mod: "shift" }, "|": { base: "\\", mod: "shift" },
    "\\": { base: "\\" },
  },
  // ★ E2 (24.09.2026): „£" gibt es auf der US-Tastatur nicht (nur auf UK,
  // siehe dort) - Weg „en"s Sonderzeichen (Bauplan §3.3) filtern sich damit
  // von selbst über `onlyExistingKeys`.
  missing: ["ä", "ö", "ü", "ß", "€", "§", "°", "£"],
  ersatz: { "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss", "Ä": "Ae", "Ö": "Oe", "Ü": "Ue" },
  capsUpper: [],
  hinweis:
    "Auf englischen Tastaturen gibt es ä ö ü ß nicht. Deutsche Texte erscheinen " +
    "deshalb in der Ersatzschreibweise (ä → ae, ß → ss) - für Englisch ist diese " +
    "Tastatur genau richtig.",
};

/**
 * Großbritannien/Irland (ISO, QWERTY). Wie die amerikanische, aber mit zwei
 * zusätzlichen Tasten (# neben dem Apostroph, \ neben dem Y) und einer anderen
 * Belegung: " = Umschalt+2, £ = Umschalt+3, @ = Umschalt+', € = AltGr+4.
 */
const UK: KeyboardLayout = {
  id: "uk",
  label: "Englisch (Großbritannien, QWERTY)",
  kurz: "britische Tastatur",
  en: {
    label: "English (UK, QWERTY)",
    kurz: "UK keyboard",
    hinweis:
      "English keyboards have no ä, ö, ü or ß. German texts therefore use the " +
      "usual substitutes (ä → ae, ß → ss) - for English, this keyboard is just right.",
  },
  rows: ISO_ROWS(
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "#"],
    ["\\", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ),
  bottomLabels: ["Ctrl", "Alt", "AltGr", "Ctrl"],
  access: {
    ...QWERTY_BASE,
    '"': { base: "2", mod: "shift" }, "£": { base: "3", mod: "shift" },
    "@": { base: "'", mod: "shift" }, "~": { base: "#", mod: "shift" },
    "|": { base: "\\", mod: "shift" },
    "#": { base: "#" }, "\\": { base: "\\" },
    "€": { base: "4", mod: "altgr" },
  },
  missing: ["ä", "ö", "ü", "ß", "§", "°"],
  ersatz: { "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss", "Ä": "Ae", "Ö": "Oe", "Ü": "Ue" },
  capsUpper: [],
  hinweis:
    "Auf englischen Tastaturen gibt es ä ö ü ß nicht. Deutsche Texte erscheinen " +
    "deshalb in der Ersatzschreibweise (ä → ae, ß → ss) - für Englisch ist diese " +
    "Tastatur genau richtig.",
};

// --- Französische Tastaturen (★ E3, 25.09.2026) -----------------------------
//
// ★ MAC GEGEN WINDOWS (Bauplan §14 E3, Falle 11): De/Ch/Us/Uk kennen HEUTE
// KEINE Mac/Windows-Unterscheidung - ein Layout deckt beide Plattformen ab,
// nur die BESCHRIFTUNG der dritten Ebene wechselt ausserhalb dieser Datei
// (`tastenErklaerung.ts`: „Option" am Mac, „AltGr" unter Windows). Für
// Französisch bestätigen die Messungen (BEFUND-2026-09-25-E1-TOTASTEN-MAC.md,
// -WINDOWS.md) aber ECHTE Unterschiede im ZEICHEN, nicht nur im Namen: Mac
// „French" hat É, œ und « » direkt (Feststelltaste, Option+o, Option+7),
// Windows-AZERTY keins davon; Mac Taste 24 gibt „-", Windows an derselben
// Stelle „=". Dasselbe Muster wie bisher (EIN Layout je Tastatur-FAMILIE, so
// wenig neue `LayoutId`s wie möglich) reicht dafür nicht mehr aus - eine
// eigene Mac-Kennung wäre aber ein grösserer Umbau (`plattform`-Erkennung
// müsste in `layouts.ts` selbst einziehen), den der Bauplan für E3 nicht
// verlangt. Entscheidung: **`fr`/`be`/`ch-fr` bilden die WINDOWS-Belegung ab**
// (Bauplan §4.2: „Windows... die wichtigste Plattform in Schulen"; F5-F7
// gehen ausdrücklich von der fehlenden É/œ/«» auf Windows-AZERTY aus). Ein
// Kind an einem Mac mit französischer Tastatur bekommt dieselbe (leicht zu
// grosszügige) Ersatzschreibweise wie unter Windows - nicht falsch, nur nicht
// optimal ausgenutzt; das ist derselbe Kompromiss, den DE/CH/US/UK für die
// Option/AltGr-Beschriftung längst eingehen. Nachgezogen werden könnte das
// erst, wenn `layouts.ts` grundsätzlich plattformbewusst würde - kein E3-Auftrag.

/** Eine Zugangs-Tabelle ohne ein Zeichen (für Belegungen, die eine geerbte Zeile nicht haben). */
function ohneTaste(access: Record<string, KeyAccess>, zeichen: string): Record<string, KeyAccess> {
  const kopie = { ...access };
  delete kopie[zeichen];
  return kopie;
}

/** Punkt-3-Ziffernreihe (Frankreich/Belgien AZERTY) - Ziffern NUR mit Umschalt. */
const AZERTY_ROW0_ACCESS: Record<string, KeyAccess> = {
  "1": { base: "&", mod: "shift" }, "2": { base: "é", mod: "shift" },
  "3": { base: "\"", mod: "shift" }, "4": { base: "'", mod: "shift" },
  "5": { base: "(", mod: "shift" }, "6": { base: "-", mod: "shift" },
  "7": { base: "è", mod: "shift" }, "8": { base: "_", mod: "shift" },
  "9": { base: "ç", mod: "shift" }, "0": { base: "à", mod: "shift" },
  "°": { base: ")", mod: "shift" }, "+": { base: "=", mod: "shift" },
  // AltGr-Reihe (Standard-AZERTY, BEFUND-WINDOWS §3 bestätigt 0⇒@, e⇒€):
  "#": { base: "\"", mod: "altgr" }, "{": { base: "'", mod: "altgr" },
  "[": { base: "(", mod: "altgr" }, "|": { base: "-", mod: "altgr" },
  "\\": { base: "_", mod: "altgr" }, "]": { base: ")", mod: "altgr" },
  "}": { base: "=", mod: "altgr" }, "€": { base: "e", mod: "altgr" },
};

/** Satzzeichen der AZERTY-Grundreihe/unteren Reihe (Frankreich/Belgien/Kanada teilen sie nicht - nur FR/BE hier). */
const AZERTY_PUNCT_ACCESS: Record<string, KeyAccess> = {
  ".": { base: ";", mod: "shift" }, "?": { base: ",", mod: "shift" },
  "/": { base: ":", mod: "shift" }, "§": { base: "!", mod: "shift" },
  ">": { base: "<", mod: "shift" }, "%": { base: "ù", mod: "shift" },
  "µ": { base: "*", mod: "shift" },
  // Totasten: ^ (eigene Taste, rechts neben p) und ¨ (Maj+^) - Bauplan §4,
  // Auftrag E3 Punkt 2. Nur DIESE zwei - die zusammengesetzten Zeichen
  // (ê â î ô û ë ï) sind E4 (Bauplan §4.3), hier nicht improvisiert.
  "¨": { base: "^", mod: "shift", dead: true },
};

/**
 * Frankreich (AZERTY, Windows-Belegung - siehe Kopf-Kommentar „Mac gegen
 * Windows"). Quelle: BEFUND-2026-09-25-E1-TOTASTEN-WINDOWS.md §1 und §3
 * (é=Taste2, '=4, è=7, ç=9, à=0, ù eigene Taste, Feststelltaste-Falle) sowie
 * die allgemein dokumentierte AZERTY-AltGr-Reihe (kbdlayout.info „French",
 * durch die Windows-Messung an den Punkten 0⇒@/e⇒€ bestätigt - als
 * „nicht einzeln gemessen" markiert, wo die Messung selbst schwieg).
 */
const FR: KeyboardLayout = {
  id: "fr",
  // ★ G3b (25.10.2026): die Eigenschaft statt der Kennungs-Liste in `hatLehrgangsTotasten` (Falle 50).
  lehrgangsTotasten: true,
  label: "Französisch (Frankreich, AZERTY)",
  kurz: "französische Tastatur",
  en: {
    label: "French (France, AZERTY)",
    kurz: "French keyboard",
    hinweis:
      "The French AZERTY keyboard (Windows) has no É, Ç, Œ or « » - texts with É " +
      "or Ç are left out, Œ and « » use the usual substitutes (Œ → Oe, « » → \"). " +
      "À, È and Ù come from the grave-accent dead key (AltGr + 7), Ê, Î, Ô and Û " +
      "from ^ - each followed by Shift and the letter.",
  },
  rows: ISO_ROWS(
    ["²", "&", "é", "\"", "'", "(", "-", "è", "_", "ç", "à", ")", "="],
    ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "^", "$"],
    ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "ù", "*"],
    ["<", "w", "x", "c", "v", "b", "n", ",", ";", ":", "!"],
  ),
  // ★ 26.09.2026: französische Tastaturen tragen „Ctrl", nicht „Strg" (auf dem
  // Plakatbild der französischen Oberfläche gesehen).
  bottomLabels: ["Ctrl", "Alt", "AltGr", "Ctrl"],
  access: {
    ...AZERTY_ROW0_ACCESS,
    ...AZERTY_PUNCT_ACCESS,
    "@": { base: "à", mod: "altgr" }, // BEFUND-WINDOWS §3
    "^": { base: "^", dead: true }, // rechts neben p (BEFUND-MAC/-WINDOWS §1)
    // ★ W1 (27.09.2026, Windows KBDFR, BEFUND-2026-09-27-WINDOWS-MESSUNG
    // Anhang A): die Totaste GRAVIS liegt auf AltGr + è (Taste 7) - der Weg zu
    // À È Ù (Totaste, dann Umschalt + Buchstabe). Vorher kannte das Modell sie
    // nicht und nannte für Ù „Umschalt + ù" - das gibt unter Windows „%".
    "`": { base: "è", mod: "altgr", dead: true },
    // AltGr + é ist die Totaste Tilde (danach die Leertaste für „~").
    "~": { base: "é", mod: "altgr", dead: true },
    "£": { base: "$", mod: "shift" }, // KBDFR: Umschalt + $
  },
  // ★ W1 (27.09.2026, Johannes §3.8): nur, was die Tastatur unter Windows
  // WIRKLICH nicht kann. Ê/À/È/Ù sind tippbar (^ bzw. Gravis, dann Umschalt +
  // Buchstabe) und stehen darum weder hier noch im Ersatz - vorher übten Kinder
  // sie nie. Œ œ « » gibt es nicht: Ersatzschreibweise bleibt. É und Ç gibt es
  // als Grossbuchstaben nicht: KEIN Ersatz (É → E lehrte falsches Französisch,
  // Anhang C), sondern `grossFehlt` - Zeilen mit ihnen kommen nicht vor.
  // ⚠️ Grossbuchstaben NIE in `missing` (vergleicht klein, sperrte „é" mit -
  // Bauplan §15.7).
  missing: ["Œ", "œ", "«", "»"],
  ersatz: {
    "Œ": "Oe", "œ": "oe",
    // F7: zwei Zeichen ⇒ eins, OHNE Innenabstand (« mot » ⇒ "mot"); die
    // einzelnen Anführungszeichen bleiben als Rückfall, falls kein Leerzeichen
    // danebensteht (z. B. am Zeilenende).
    "« ": "\"", " »": "\"", "«": "\"", "»": "\"",
  },
  grossFehlt: ["É", "Ç"],
  capsUpper: [],
  hinweis:
    "Auf der französischen Tastatur (AZERTY, Windows) gibt es É, Ç, Œ und « » nicht - " +
    "Texte mit É oder Ç kommen darum nicht vor, Œ und « » erscheinen in der " +
    "üblichen Ersatzschreibweise (Œ → Oe, « mot » → \"mot\"). À È Ù tippt man über " +
    "die Totaste Gravis (AltGr + 7), Ê Î Ô Û über ^ - jeweils dann Umschalt und den " +
    "Buchstaben. ⚠️ Die Feststelltaste gibt bei é/è/à/ç Ziffern statt Großbuchstaben.",
};

/**
 * Belgien (AZERTY). ★ E3 (gemessen, Windows, KLID 0000080C - siehe
 * BEFUND-2026-09-25-E3-TASTATUREN.md): **echt anders als angenommen** - nicht
 * nur `@` (Bauplan §3.2), sondern auch drei Tasten am rechten Rand: die
 * Taste, die auf Frankreich „*"/„µ" gibt, gibt auf Belgien „µ"/„£"; die
 * Taste rechts von „!" gibt „="/„+" statt „!"/„§" (das „!" ist auf Belgien
 * darum vorerst **nicht gemessen** - keine Ersatz-Improvisation, siehe
 * `missing`); `$`/`£` statt `$`/`£`… nein: `$` bleibt, nur die UMSCHALT-Form
 * ändert sich (`£` statt `*`, das „*" liegt jetzt auf der µ-Taste). AltGr+7
 * ist auf Belgien KEINE Totaste (Windows-Befund §3) - für uns ohne Wirkung,
 * weil dieser Griff ausserhalb des Pflicht-Zeichensatzes liegt.
 */
const BE: KeyboardLayout = {
  id: "be",
  // ★ G3b (25.10.2026): die Eigenschaft statt der Kennungs-Liste in `hatLehrgangsTotasten` (Falle 50).
  lehrgangsTotasten: true,
  label: "Französisch (Belgien, AZERTY)",
  kurz: "belgische Tastatur",
  en: {
    label: "French (Belgium, AZERTY)",
    kurz: "Belgian keyboard",
    hinweis:
      "The Belgian AZERTY keyboard (Windows) has no capital Ç, no Œ and no « » - " +
      "texts with Ç are left out, Œ and « » use the usual substitutes. É comes " +
      "from the acute-accent dead key (AltGr + ù), À, È and Ù from the " +
      "grave-accent dead key (AltGr + µ), Ê, Î, Ô and Û from ^ - each followed by " +
      "Shift and the letter.",
  },
  // ★★★ M5 (26.09.2026, GEMESSEN am Mac per UCKeyTranslate, „Belgian", alle
  // Tasten in vier Ebenen - `BEFUND-2026-09-26-MECHANIK-BEHEBUNG-FR.md` §M5):
  // die Ziffernreihe ist & é " ' ( § è ! ç à ) - (Umschalt 1 2 3 4 5 6 7 8 9
  // 0 ° _). Bis hierher trugen `Digit6` und `Digit8` die Werte von Frankreich
  // („-" und „_"): „-" stand doppelt, „!" fehlte im Lehrgang ganz (das
  // Satzzeichen, mit dem Kinder am liebsten schreiben), die Hinweise für „-"
  // und „_" nannten den falschen Finger. `Equal` = „-" war schon unter Windows
  // gemessen (25.09., Schritt „0D+E") und stimmt mit dem Mac überein.
  // ⚠️ Windows für `Digit6`/`Digit8`/Umschalt+`Equal`: E14 A6.
  // Wächter: tests/typing-layouts-franzoesisch.test.ts, „Belgien".
  rows: ISO_ROWS(
    ["²", "&", "é", "\"", "'", "(", "§", "è", "!", "ç", "à", ")", "-"],
    ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "^", "$"],
    ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "ù", "µ"],
    ["<", "w", "x", "c", "v", "b", "n", ",", ";", ":", "="],
  ),
  bottomLabels: FR.bottomLabels,
  access: {
    // ★ M5 (26.09.2026): ohne „\\" von Frankreich - dort AltGr + „_"-Taste,
    // auf Belgien gibt es die „_"-Taste nicht (Umschalt + „-"). Wo „\\" auf
    // Belgien liegt, ist unter Windows ungemessen (E14 A6) - Lücke statt Raten,
    // siehe `missing`. Kein Zeichen des Lehrgangs.
    ...ohneTaste(AZERTY_ROW0_ACCESS, "\\"),
    "°": { base: ")", mod: "shift" },
    ".": { base: ";", mod: "shift" }, "?": { base: ",", mod: "shift" },
    "/": { base: ":", mod: "shift" }, ">": { base: "<", mod: "shift" },
    "%": { base: "ù", mod: "shift" },
    "¨": { base: "^", mod: "shift", dead: true },
    "^": { base: "^", dead: true },
    "£": { base: "µ", mod: "shift" }, // gemessen: Backslash-Taste (µ) + Umschalt
    "*": { base: "$", mod: "shift" }, // gemessen: BracketRight-Taste ($) + Umschalt
    "+": { base: "=", mod: "shift" }, // gemessen: Slash-Taste (=) + Umschalt
    "@": { base: "é", mod: "altgr" }, // Bauplan §3.2, jetzt durch die Windows-Messung bestätigt
    // ★ M5 (26.09.2026, Mac gemessen, siehe `rows`): Umschalt-Formen von
    // Digit6/Digit8 und Equal - überschreiben die Frankreich-Werte aus
    // `AZERTY_ROW0_ACCESS` („6" war dort Umschalt + „-", „8" Umschalt + „_").
    "6": { base: "§", mod: "shift" },
    "8": { base: "!", mod: "shift" },
    "_": { base: "-", mod: "shift" },
    // ★★★ W1 (27.09.2026, Windows KBDBE, BEFUND-2026-09-27-WINDOWS-MESSUNG
    // §3.2, echt getippt): die AltGr-Ebene war von Frankreich kopiert und an
    // drei Stellen falsch - „|" ist AltGr + 1 (nicht AltGr + „-"), „]" AltGr +
    // $ (nicht AltGr + „)"), „}" AltGr + 0 (auf „=" liegt die Totaste ~).
    // Getippt wurde es auch vorher, nur die Anleitung und der Finger stimmten
    // nicht („auriculaire droit" statt linker kleiner Finger).
    "|": { base: "&", mod: "altgr" },
    "]": { base: "$", mod: "altgr" },
    "}": { base: "à", mod: "altgr" },
    "\\": { base: "<", mod: "altgr" }, // KBDBE: AltGr + < (stand in `missing`)
    // Die drei Totasten der AltGr-Ebene: Akut (AltGr + ù) - der Weg zu É;
    // Gravis (AltGr + µ) - zu À È Ù; Tilde (AltGr + =).
    "´": { base: "ù", mod: "altgr", dead: true },
    "`": { base: "µ", mod: "altgr", dead: true },
    "~": { base: "=", mod: "altgr", dead: true },
  },
  // ★ M5 (26.09.2026): „!" und „§" sind jetzt gemessen (Mac) und liegen auf
  // eigenen Tasten der Ziffernreihe - keine Lücke mehr.
  // ★ W1 (27.09.2026): „\\" ist AltGr + < (Windows) - keine Lücke mehr. É ist
  // hier über die Akut-Totaste tippbar; nur Ç fehlt als Grossbuchstabe.
  missing: FR.missing,
  ersatz: FR.ersatz,
  grossFehlt: ["Ç"],
  capsUpper: [],
  hinweis:
    "Auf der belgischen Tastatur (AZERTY, Windows) gibt es Ç (groß), Œ und « » nicht - " +
    "Texte mit Ç kommen darum nicht vor, Œ und « » erscheinen in der üblichen " +
    "Ersatzschreibweise. É tippt man über die Totaste Akut (AltGr + ù), À È Ù über " +
    "die Totaste Gravis (AltGr + µ), Ê Î Ô Û über ^ - jeweils dann Umschalt und " +
    "den Buchstaben.",
};

/**
 * Schweiz-Französisch (auch Luxemburg, KBDSF-Treiber). **Dieselben Tastenkappen
 * wie {@link CH}** (Bauplan §3.1/§3.2) - nur DREI Tasten wechseln ihre Rolle:
 * die (ö/é)-, (ä/à)- und (ü/è)-Taste geben hier unbeschaltet é/à/è, mit
 * Umschalt ö/ä/ü (statt umgekehrt). `ç` = Maj+4 (eigene Angabe im Bauplan),
 * Ziffern bleiben wie auf {@link CH} ohne Umschalt. `¨` ist hier eine EIGENE
 * Taste (wie auf {@link CH}), nicht Maj+^ wie bei AZERTY - jetzt zusätzlich
 * als Totaste markiert (Auftrag E3 Punkt 2; auf {@link CH} bisher unmarkiert,
 * siehe `code-bestand.md` §D.1 - hier bewusst korrekt, weil neu gebaut).
 */
const CH_FR: KeyboardLayout = {
  id: "ch-fr",
  // ★ G3b (25.10.2026): die Eigenschaft statt der Kennungs-Liste in `hatLehrgangsTotasten` (Falle 50).
  lehrgangsTotasten: true,
  label: "Französisch (Schweiz/Luxemburg)",
  kurz: "Schweizer Tastatur (Französisch)",
  en: {
    label: "Swiss French (Switzerland/Luxembourg)",
    kurz: "Swiss French keyboard",
    hinweis:
      "The Swiss French keyboard has no capital Ç, no Œ and no « » - texts with Ç " +
      "are left out, Œ and « » use the usual substitutes. É comes from the " +
      "acute-accent dead key (AltGr + '), À, È and Ù from the grave-accent dead " +
      "key (Shift + ^) - each followed by Shift and the letter. Shift on é, à " +
      "and è gives ö, ä and ü. On a Mac, Caps Lock works for É, À and È too.",
  },
  // ★ QWERTZ wie CH (Bauplan §3.2: „ist KEINE AZERTY-Variante") - NUR die drei
  // Tasten ö/ä/ü tauschen ihre Rolle (siehe `access` unten); row0/row3 sind
  // BUCHSTABENGLEICH mit CH.
  rows: ISO_ROWS(
    ["§", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "^"],
    ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "è", "¨"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "é", "à", "$"],
    ["<", "y", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  // ★ 26.09.2026: Schweizer Tastaturen für die Romandie tragen „Ctrl".
  bottomLabels: ["Ctrl", "Alt", "AltGr", "Ctrl"],
  access: {
    // Ziffern, @, #, €, Klammern, ~ ´ ` ¨ £ usw. - wie CH (Windows KBDSF gegen
    // KBDSG: dieselbe Belegung bis auf die drei getauschten Tasten).
    // ★ W1: OHNE die drei Umschalt-Zugänge è/é/à von CH - hier sind es eigene
    // Tasten; geerbt hätten sie „è" auf Umschalt + ü gelegt, eine Taste, die
    // es auf ch-fr gar nicht gibt (und die Gegenhand-Regel hätte für è
    // Umschalt verlangt).
    ...ohneTaste(ohneTaste(ohneTaste(CH.access, "è"), "é"), "à"),
    "ö": { base: "é", mod: "shift" },
    "ä": { base: "à", mod: "shift" },
    "ü": { base: "è", mod: "shift" },
    "ç": { base: "4", mod: "shift" }, // Bauplan §3.1: „ç = Maj + 4"
    "¨": { base: "¨", dead: true }, // eigene Taste (nicht Maj+^) - E3 Punkt 2
    "^": { base: "^", dead: true }, // unverändert wie CH
    // ★★★ E9a-2 (26.09.2026, GEMESSEN am Mac per UCKeyTranslate, 26.09.):
    // Taste 24 (rechts neben 0, die „^"-Taste) ist unbeschaltet die Totaste
    // „^" (24+u → û) und mit UMSCHALT die Totaste GRAVIS (Umschalt+24+u → ù) -
    // dieselbe physische Taste wie „¨" bei FR/BE (Maj+^ ⇒ Trema), hier eben
    // Maj+^ ⇒ Gravis. „`" ist damit KEINE eigene Zeile in `rows` (wie „¨" bei
    // FR/BE auch keine ist), sondern nur über `access` erreichbar.
    // ⚠️ Windows (dieselbe Tastenlage laut Microsoft-Belegung) ist NOCH NICHT
    // am Gerät gemessen - gehört auf die Liste für E14.
    "`": { base: "^", mod: "shift", dead: true },
    // ★ Die drei getauschten Tasten (é/à/è statt ö/ä/ü) tragen auf CH auch
    // AltGr-Zeichen - die müssen ihre `base` auf die NEUEN Zeichen umstellen,
    // sonst zeigt „{"/„[" auf eine Taste, die es auf ch-fr gar nicht mehr gibt.
    "[": { base: "è", mod: "altgr" }, // war „ü" auf CH
    "{": { base: "à", mod: "altgr" }, // war „ä" auf CH
  },
  // ⚠️ „Ç" ABSICHTLICH NICHT hier - dieselbe Falle wie bei FR/BE (siehe dort):
  // sein Kleinbuchstabe „ç" ist eine echte, tippbare Taste (Maj+4).
  //
  // ★ E9a-2 (26.09.2026): „ù" ist NICHT mehr fehlend - die Gravis-Totaste ist
  // jetzt gemessen (siehe `access` oben) und in `KOMBIZEICHEN` (totasten.ts)
  // als zusammengesetztes Zeichen eingetragen (Gravis + u ⇒ ù, K1-Pfad wie
  // ê/â). Der vorherige Ersatz „ù" → „u" war unvertretbar - „où" (wo) wurde
  // damit zu „ou" (oder), ein ANDERES Wort, nicht bloss ein Akzent-Verlust
  // wie É → E (Rückmeldung 26.09.).
  missing: ["Œ", "œ", "«", "»"],
  // ★ W1 (27.09.2026): „Ç" wird nicht mehr zu „C" gemacht - die Tastatur
  // erzeugt es unter Windows nicht (KBDSF hat keine Cedille-Totaste,
  // vergleich.json), also kommen Zeilen mit Ç nicht vor (`grossFehlt`).
  ersatz: {
    "Œ": "Oe", "œ": "oe",
    "« ": "\"", " »": "\"", "«": "\"", "»": "\"",
  },
  grossFehlt: ["Ç"],
  // ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2, in der App
  // gemessen: „À Genève …" war unlösbar): unter Windows gibt Feststell + é
  // „é" - der Weg ist die Totaste Akut (AltGr + ') bzw. Gravis (Umschalt + ^),
  // dann Umschalt + E/A. Am Mac bleibt die Feststelltaste (nicht neu gemessen).
  capsUpper: [],
  capsUpperMac: ["é", "à", "è"],
  hinweis:
    "Auf der Schweizer Tastatur (Französisch) gibt es Ç (groß), Œ und « » nicht - " +
    "Texte mit Ç kommen darum nicht vor, Œ und « » erscheinen in der üblichen " +
    "Ersatzschreibweise. É tippt man über die Totaste Akut (AltGr + '), À È Ù " +
    "über die Totaste Gravis (Umschalt + ^), jeweils dann Umschalt und den " +
    "Buchstaben; ù über Gravis, dann u. Umschalt auf é à è ergibt ö ä ü. Am Mac " +
    "gehen É À È auch über die Feststelltaste.",
};

/**
 * Kanada, „Canadien multilingue standard" (CSA). **Zweite Welle** (Bauplan
 * §3.1, F2), aber jetzt VOLL GEMESSEN (Windows, KLID 00011009) - anders als
 * angenommen sind É À È Ç Ù hier direkt mit UMSCHALT erreichbar (keine
 * Ersatzschreibweise nötig, siehe `access`) - besser ausgestattet als
 * fr/be/ch-fr. Grundreihe `a s d f j k l ;` (Bauplan §3.1). Ganz links (statt
 * `` ` ``) liegt „/" (Umschalt „\"), rechts von „p" die Totaste „^"
 * (BEFUND-WINDOWS §3), rechts davon „ç"/„Ç".
 */
const CA_CSA: KeyboardLayout = {
  id: "ca-csa",
  // ★ G3b (25.10.2026): die Eigenschaft statt der Kennungs-Liste in `hatLehrgangsTotasten` (Falle 50).
  lehrgangsTotasten: true,
  label: "Französisch (Kanada, Canadien multilingue standard)",
  kurz: "kanadische Tastatur (CSA)",
  en: {
    label: "Canadian French (Canadian Multilingual Standard)",
    kurz: "Canadian keyboard (CSA)",
    hinweis:
      "The Canadian keyboard (CSA) has no Œ - texts use the usual substitute " +
      "(Œ → Oe). É, À, È, Ç and Ù type directly with Shift, Ê, Î, Ô and Û via ^ " +
      "(then Shift and the letter), « » with AltGr + Z and AltGr + X, € with " +
      "AltGr + E.",
  },
  rows: ISO_ROWS(
    ["/", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "^", "ç"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "è", "à"],
    ["ù", "z", "x", "c", "v", "b", "n", "m", ",", ".", "é"],
  ),
  bottomLabels: ["Ctrl", "Alt", "AltGr", "Ctrl"],
  access: {
    "!": { base: "1", mod: "shift" }, "@": { base: "2", mod: "shift" },
    "#": { base: "3", mod: "shift" },
    ":": { base: ";", mod: "shift" }, "\"": { base: ".", mod: "shift" },
    "'": { base: ",", mod: "shift" }, // BEFUND-WINDOWS §3: „Apostroph = Maj + ,"
    "\\": { base: "/", mod: "shift" },
    // ★ gemessen: É/È/À/Ç/Ù sind auf CSA GROSS direkt mit Umschalt erreichbar -
    // anders als auf jeder anderen Tastatur dieses Lehrgangs (kein Ersatz nötig).
    "É": { base: "é", mod: "shift" }, "È": { base: "è", mod: "shift" },
    "À": { base: "à", mod: "shift" }, "Ç": { base: "ç", mod: "shift" },
    "Ù": { base: "ù", mod: "shift" },
    "^": { base: "^", dead: true }, // rechts von p (BEFUND-WINDOWS §3)
    // ★★★ M3 (26.09.2026, GEMESSEN am Mac per UCKeyTranslate, „Canadian -
    // CSA", alle Tasten in vier Ebenen - `BEFUND-2026-09-26-MECHANIK-BEHEBUNG-
    // FR.md` §M3). Umschalt-Ebene (auf Mac und Windows dieselbe Norm CSA
    // Z243.200): die Satz- und Sonderzeichen, die im Lehrgang standen, aber
    // keinen Griff hatten - das Kind blieb an „?" (einer Kerntaste) stecken.
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "?": { base: "6", mod: "shift" }, "&": { base: "7", mod: "shift" },
    "*": { base: "8", mod: "shift" }, "(": { base: "9", mod: "shift" },
    ")": { base: "0", mod: "shift" }, "_": { base: "-", mod: "shift" },
    "+": { base: "=", mod: "shift" },
    // Trema = Umschalt + ^-Taste (Totaste): ¨ + e ⇒ ë, + i ⇒ ï (gemessen).
    "¨": { base: "^", mod: "shift", dead: true },
    // AltGr-Ebene (CSA-Norm). ★★ W1 (27.09.2026, Windows KBDCAN, echt
    // getippt - BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2 CSA-4): | { } [ ] < >
    // stimmen. „€" ist AltGr + E (AltGr + 4 gibt „¤"), „~" ist eine TOTASTE
    // (AltGr + ç, dann Leertaste), « » liegen auf AltGr + Z / X, und AltGr +
    // ^ ist die Totaste Gravis (CSA-3: AltGr + ^, dann u ⇒ ù).
    "€": { base: "e", mod: "altgr" }, "|": { base: "/", mod: "altgr" },
    "{": { base: "7", mod: "altgr" }, "}": { base: "8", mod: "altgr" },
    "[": { base: "9", mod: "altgr" }, "]": { base: "0", mod: "altgr" },
    "<": { base: ",", mod: "altgr" }, ">": { base: ".", mod: "altgr" },
    "~": { base: "ç", mod: "altgr", dead: true },
    "«": { base: "z", mod: "altgr" }, "»": { base: "x", mod: "altgr" },
    "`": { base: "^", mod: "altgr", dead: true },
    "°": { base: ";", mod: "altgr" },
  },
  // ★ M3 (26.09.2026): `< > [ ] { } ~` sind gemessen (Mac).
  // ★ W1 (27.09.2026, Windows): Ê ist tippbar (^, dann Umschalt + E) und « »
  // liegen auf AltGr + Z / X - beide nicht mehr ersetzt. Nur Œ fehlt.
  missing: ["Œ", "œ"],
  ersatz: { "Œ": "Oe", "œ": "oe" },
  capsUpper: [],
  hinweis:
    "Auf der kanadischen Tastatur (CSA) gibt es Œ nicht - Texte erscheinen darum " +
    "in der Ersatzschreibweise (Œ → Oe). É À È Ç Ù tippt man hier direkt mit der " +
    "Umschalttaste, Ê Î Ô Û über ^ (dann Umschalt und den Buchstaben), « » mit " +
    "AltGr + Z und AltGr + X, € mit AltGr + E.",
};

/**
 * Kanada, Windows-Standardbelegung „Français (Canada)", KLID 00001009 - Windows-
 * gemessen mit ZWEI eigenen Totasten neben `^` (`BracketRight` und `Quote`
 * melden `key: "Dead"`); welches Zeichen sie liefern, war bis E9a-2
 * unbestätigt (vermutlich Cedille/Gravis, Bauplan §3.2).
 *
 * ★★★ E9a-2 (26.09.2026, GEMESSEN am Mac per UCKeyTranslate, 26.09.): jetzt
 * bestätigt - „¸" (rechts von p, `BracketRight`) ist die Totaste CEDILLE
 * (30+u → kombiniertes ¸u, 30+c → ç), „`" (rechts von l, `Quote`) ist die
 * Totaste GRAVIS (39+u → ù). Beide gehören zwar nicht zum Pflicht-Paar `^`/`¨`
 * (Auftrag E3 Punkt 2), sind aber jetzt genauso echte, gemessene Totasten -
 * die Zeichen, die sie liefern (`ç`, `ù`), sind darum nicht mehr `missing`.
 * ⚠️ Windows (dieselbe Tastenlage laut Microsoft-Belegung) ist NOCH NICHT am
 * Gerät gemessen - gehört auf die Liste für E14.
 */
const CA_FR: KeyboardLayout = {
  id: "ca-fr",
  // ★ G3b (25.10.2026): die Eigenschaft statt der Kennungs-Liste in `hatLehrgangsTotasten` (Falle 50).
  lehrgangsTotasten: true,
  // ★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2, F7): Dieses
  // Modell IST die Windows-Standardbelegung für fr-CA, „Français (Canada)" /
  // „Kanadisch-Französisch" (KBDCA, 00001009) - die Mac-Erwartungen passen
  // genau zu ihr. Der frühere Zusatz „ältere/ancienne disposition" führte in
  // die Irre: Windows nennt die ANDERE Belegung (KBDFC) „Legacy"; wer
  // „ancienne" las, wählte vermutlich die falsche. Der Name ist jetzt genau
  // der, den Windows in der Sprachleiste zeigt.
  label: "Französisch (Kanada, „Français (Canada)\")",
  kurz: "kanadische Tastatur (Français)",
  en: {
    label: "Canadian French (\"Français (Canada)\", Windows standard)",
    kurz: "Canadian French keyboard",
    hinweis:
      "The standard Windows keyboard for French in Canada. It has no Œ - texts " +
      "use the usual substitute. É is direct with Shift; ç and Ç come from the " +
      "cedilla dead key (then c or Shift + C), à, è and ù from the grave-accent " +
      "dead key, Ê, Î, Ô and Û from ^. « » have their own key.",
  },
  rows: ISO_ROWS(
    ["#", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    // „¸" (rechts von p) ist jetzt die GEMESSENE Cedille-Totaste (E9a-2).
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "^", "¸"],
    // „`" (rechts von l) ist jetzt die GEMESSENE Gravis-Totaste (E9a-2).
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "`", "<"],
    ["«", "z", "x", "c", "v", "b", "n", "m", ",", ".", "é"],
  ),
  bottomLabels: ["Ctrl", "Alt", "AltGr", "Ctrl"],
  access: {
    "!": { base: "1", mod: "shift" }, "\"": { base: "2", mod: "shift" },
    "/": { base: "3", mod: "shift" },
    "'": { base: ",", mod: "shift" },
    "|": { base: "#", mod: "shift" },
    ">": { base: "<", mod: "shift" }, // gemessen: Backslash-Taste (<) + Umschalt
    "»": { base: "«", mod: "shift" },
    "É": { base: "é", mod: "shift" },
    "^": { base: "^", dead: true }, // rechts von p (BEFUND-WINDOWS §3)
    // ★★★ E9a-2 (26.09.2026, GEMESSEN am Mac per UCKeyTranslate, 26.09.):
    // „¸" (rechts von p, dieselbe Reihe wie „^") ist die Totaste CEDILLE
    // (¸ + c ⇒ ç), „`" (rechts von l) ist die Totaste GRAVIS (` + u ⇒ ù).
    // ⚠️ Windows (dieselbe Tastenlage laut Microsoft-Belegung) ist noch NICHT
    // am Gerät gemessen - gehört auf die Liste für E14.
    "¸": { base: "¸", dead: true },
    "`": { base: "`", dead: true },
    // ★★★ M3 (26.09.2026, GEMESSEN am Mac per UCKeyTranslate, „Canadian French
    // - PC", alle Tasten in vier Ebenen - Befund Mechanik-Behebung §M3):
    // Umschalt + Cedille-Taste ist die Totaste TREMA (¨ + e ⇒ ë, + i ⇒ ï).
    // Die Gravis-Totaste gibt auch à/è (`KOMBIZEICHEN`, totasten.ts).
    "¨": { base: "¸", mod: "shift", dead: true },
    // Umschalt-Ebene der Ziffernreihe und „:" (vorher ohne Griff - „:" und „?"
    // sind Kerntasten des Lehrgangs).
    ":": { base: ";", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "?": { base: "6", mod: "shift" }, "&": { base: "7", mod: "shift" },
    "*": { base: "8", mod: "shift" }, "(": { base: "9", mod: "shift" },
    ")": { base: "0", mod: "shift" }, "_": { base: "-", mod: "shift" },
    "+": { base: "=", mod: "shift" },
    // Option-Ebene des Mac, hier als AltGr eingetragen (die Mac-Belegung „- PC"
    // bildet die Windows-Belegung nach). ⚠️ Windows NICHT gemessen - E14.
    "@": { base: "2", mod: "altgr" }, "€": { base: "e", mod: "altgr" },
    "[": { base: "^", mod: "altgr" }, "]": { base: "¸", mod: "altgr" },
    "{": { base: "`", mod: "altgr" }, "}": { base: "<", mod: "altgr" },
    "\\": { base: "#", mod: "altgr" }, "~": { base: ";", mod: "altgr" },
    // ★ W1 (27.09.2026, Windows KBDCA, Anhang A): die ganze AltGr-Ebene
    // stimmt mit dem Mac überein; dazu AltGr + é = Totaste Akut, AltGr + 3 = £,
    // AltGr + O = §, AltGr + « = °.
    "´": { base: "é", mod: "altgr", dead: true },
    "£": { base: "3", mod: "altgr" }, "§": { base: "o", mod: "altgr" },
    "°": { base: "«", mod: "altgr" },
  },
  // „ç"/„ù" sind seit E9a-2 KEINE Lücke mehr (siehe `access`/Kopf-Kommentar) -
  // beide kommen über ihre gemessene Totaste, wie ê/â über „^". Der vorherige
  // Ersatz „ù" → „u" war unvertretbar - „où" (wo) wurde damit zu „ou" (oder),
  // ein ANDERES Wort (Rückmeldung 26.09.). „«"/„»" sind hier DIREKT tippbar
  // (gemessen) - anders als auf jeder anderen Tastatur dieses Lehrgangs.
  //
  // ⚠️ „Ç" (Grossform) steht ABSICHTLICH NICHT in `missing` - dieselbe Falle
  // wie bei É/À/È/Ç auf FR (Bauplan §15.7, siehe dort): `missing`/`keyExists`
  // vergleichen KLEIN geschrieben, „Ç" hier einzutragen würde das ECHTE,
  // jetzt über die Cedille-Totaste tippbare „ç" als „fehlt" melden. Die
  // Ersatzschreibweise für die Grossform „Ç" wirkt trotzdem (`ersatz` unten,
  // unabhängig von `missing` geprüft).
  // ★ M3 (26.09.2026): `[ ] { } ~` sind jetzt gemessen (Mac, siehe `access`).
  // ★ W1 (27.09.2026, Windows): Ê (^, dann Umschalt + E) und Ç (Cedille, dann
  // Umschalt + C) sind tippbar - nicht mehr ersetzt. Nur Œ fehlt.
  missing: ["Œ", "œ"],
  ersatz: { "Œ": "Oe", "œ": "oe" },
  capsUpper: [],
  hinweis:
    "Die Windows-Standardtastatur für Französisch in Kanada. Œ gibt es nicht - " +
    "Texte erscheinen darum in der Ersatzschreibweise (Œ → Oe). É tippt man direkt " +
    "mit Umschalt, ç und Ç über die Cedille-Totaste (dann c bzw. Umschalt + C), " +
    "à è ù über die Gravis-Totaste, Ê Î Ô Û über ^. « » liegen auf einer eigenen Taste.",
};

/**
 * ★★★ ES-F3 (27.09.2026, Bauplan spanischer Lehrgang §3, gemessen am Mac per
 * UCKeyTranslate - `recherche-spanisch-2026-09-26/messung-mac-tastaturen-und-
 * reihenfolge.md` §1, mit Vorrang vor den Windows-Sekundärquellen, siehe dort
 * „Widerspruch zur Recherche"). Spanien (ISO) - entspricht der Windows-
 * Belegung „Spanisch". `ñ` ist die achte Grundtaste (rechts von `l`), der
 * Akzent `´` liegt DANEBEN in der Grundreihe (rechts von `ñ`) - anders als auf
 * {@link LATAM}, wo er in der oberen Reihe (rechts von `p`) liegt (Bauplan
 * Falle 8). `ç` existiert physisch (Katalanisch), ist aber KEIN spanischer
 * Buchstabe und darum kein Lernziel (Bauplan S7) - unbeschaltet mitgeführt,
 * wie das deutsche Layout sein `´` mitführt, ohne es zu lehren.
 */
const ES: KeyboardLayout = {
  id: "es",
  // ★ G3b (25.10.2026): die Eigenschaft statt der Kennungs-Liste in `hatLehrgangsTotasten` (Falle 50).
  lehrgangsTotasten: true,
  label: "Spanisch (Spanien, ISO)",
  kurz: "spanische Tastatur",
  en: {
    label: "Spanish (Spain, ISO)",
    kurz: "Spanish keyboard",
    hinweis:
      "On the Spanish keyboard, the acute accent (á é í ó ú) is a dead key " +
      "right of ñ; Shift on the same key gives the diaeresis (ü). ¡ is " +
      "direct, ¿ needs Shift - the OPPOSITE way round from the Latin " +
      "American keyboard.",
  },
  rows: ISO_ROWS(
    ["º", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "¡"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "`", "+"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ", "´", "ç"],
    ["<", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "ª": { base: "º", mod: "shift" }, "!": { base: "1", mod: "shift" },
    "\"": { base: "2", mod: "shift" }, "·": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "&": { base: "6", mod: "shift" }, "/": { base: "7", mod: "shift" },
    "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "=": { base: "0", mod: "shift" }, "?": { base: "'", mod: "shift" },
    // ★ Bauplan §3: auf Spanien liegt ¡ DIREKT, ¿ mit Umschalt - gemessen (Mac
    // „Spanish - ISO"), umgekehrt zu Lateinamerika.
    "¿": { base: "¡", mod: "shift" },
    "\\": { base: "º", mod: "altgr" }, "|": { base: "1", mod: "altgr" },
    "@": { base: "2", mod: "altgr" }, "#": { base: "3", mod: "altgr" },
    "€": { base: "e", mod: "altgr" },
    "*": { base: "+", mod: "shift" },
    "^": { base: "`", mod: "shift", dead: true },
    "`": { base: "`", dead: true },
    "[": { base: "`", mod: "altgr" }, "]": { base: "+", mod: "altgr" },
    // Akzent-Totaste (rechts von ñ) - á é í ó ú, Umschalt ¨ (ü).
    "´": { base: "´", dead: true },
    "¨": { base: "´", mod: "shift", dead: true },
    "{": { base: "´", mod: "altgr" }, "}": { base: "ç", mod: "altgr" },
    ">": { base: "<", mod: "shift" },
    ";": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" },
    "_": { base: "-", mod: "shift" },
  },
  // Bauplan §3 „Ersatz (F36)": beide Pflicht-Tastaturen haben alle Zeichen -
  // kein Ersatz nötig, `missing`/`ersatz` bleiben leer.
  missing: [],
  ersatz: {},
  capsUpper: [],
  hinweis:
    "Auf der spanischen Tastatur ist der Akzent (á é í ó ú) eine Totaste " +
    "rechts von ñ - Umschalt auf derselben Taste ergibt die Diärese (ü). ¡ " +
    "liegt direkt, ¿ braucht Umschalt - auf der lateinamerikanischen " +
    "Tastatur ist es GENAU UMGEKEHRT.",
};

/**
 * ★★★ ES-F3 (27.09.2026, gemessen am Mac, siehe Kopf-Kommentar von {@link ES}).
 * Lateinamerika - Akzent-Totaste liegt OBEN (rechts von `p`), nicht in der
 * Grundreihe; `¿`/`¡` liegen VERTAUSCHT gegenüber Spanien (Bauplan §3,
 * gemessen). `€` ist auf dieser Tastatur laut den Microsoft-Tabellen NICHT
 * gefunden (`recherche-spanisch-2026-09-26/tastaturen-und-zeichen.md` §3.2/§7,
 * P9) - **nicht geraten**: `missing`, ohne Ersatz (wie „£" auf US, layouts.ts).
 */
const LATAM: KeyboardLayout = {
  id: "latam",
  // ★ G3b (25.10.2026): die Eigenschaft statt der Kennungs-Liste in `hatLehrgangsTotasten` (Falle 50).
  lehrgangsTotasten: true,
  label: "Spanisch (Lateinamerika)",
  kurz: "lateinamerikanische Tastatur",
  en: {
    label: "Spanish (Latin America)",
    kurz: "Latin American keyboard",
    hinweis:
      "On the Latin American keyboard, the acute accent (á é í ó ú) is a " +
      "dead key right of p; Shift on the same key gives the diaeresis (ü). " +
      "¿ is direct, ¡ needs Shift - the OPPOSITE way round from the Spanish " +
      "(Spain) keyboard. The euro sign is not confirmed on this layout.",
  },
  rows: ISO_ROWS(
    ["|", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "¿"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "´", "+"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ", "{", "}"],
    ["<", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "°": { base: "|", mod: "shift" }, "!": { base: "1", mod: "shift" },
    "\"": { base: "2", mod: "shift" }, "#": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "&": { base: "6", mod: "shift" }, "/": { base: "7", mod: "shift" },
    "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "=": { base: "0", mod: "shift" }, "?": { base: "'", mod: "shift" },
    // ★ Bauplan §3: auf Lateinamerika liegt ¿ DIREKT, ¡ mit Umschalt -
    // gemessen (Mac „Latin American"), umgekehrt zu Spanien.
    "¡": { base: "¿", mod: "shift" },
    "\\": { base: "'", mod: "altgr" },
    "@": { base: "q", mod: "altgr" },
    "*": { base: "+", mod: "shift" },
    // Akzent-Totaste (rechts von p) - á é í ó ú, Umschalt ¨ (ü).
    "´": { base: "´", dead: true },
    "¨": { base: "´", mod: "shift", dead: true },
    "[": { base: "{", mod: "shift" }, "]": { base: "}", mod: "shift" },
    ">": { base: "<", mod: "shift" },
    ";": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" },
    "_": { base: "-", mod: "shift" },
  },
  // ★ P9 (Bauplan §3): „€" ist auf dieser Tastatur NICHT gemessen/gefunden -
  // Lücke statt Raten (Falle 6/44); wie „£" auf US bleibt es ohne Ersatz.
  missing: ["€"],
  ersatz: {},
  capsUpper: [],
  hinweis:
    "Auf der lateinamerikanischen Tastatur ist der Akzent (á é í ó ú) eine " +
    "Totaste rechts von p - Umschalt auf derselben Taste ergibt die " +
    "Diärese (ü). ¿ liegt direkt, ¡ braucht Umschalt - auf der spanischen " +
    "Tastatur (Spanien) ist es GENAU UMGEKEHRT. Das Eurozeichen ist auf " +
    "dieser Tastatur nicht bestätigt.",
};

// --- Italienische Tastaturen (★ F3-it, 02.10.2026) --------------------------
//
// ★★★ F3-it (02.10.2026, Bauplan italienischer Lehrgang §2, R1 `recherche-italienisch-2026-10-02/
// tastaturen-und-zeichen.md` §2-§6): zwei Tastaturen. Quellen: Windows „Italiano" (141) nach der
// Microsoft-Tabelle KBDIT - ⚠️ am Gerät NICHT gemessen (Messliste A1-A5 im Bauplan §6); Mac „Italiano -
// Pro" und Mac „Italiano" (QZERTY) per UCKeyTranslate gemessen
// (`pruefstand/werkzeug-totasten/messung-mac-2026-10-02-it-pl-tr-cs.txt`).
//
// ★ KEINE Totasten: `à è é ì ò ù` liegen auf allen drei italienischen Belegungen auf EIGENEN Tasten
// (`é` ist auf 141/Pro Umschalt + `è`). Darum kein Akzent-Ersatz (`ersatz` kennt nur Zeichen, die es
// gar nicht gibt und die kein Wort ändern): neun Wortpaare ergeben ohne Akzent ein ANDERES Wort
// (è/e, dà/da, dì/di, là/la, lì/li, né/ne, sé/se, sì/si, tè/te - Falle 36).
//
// ★ GROSSE Akzentbuchstaben `À È É Ì Ò Ù`: Windows 141/142 erzeugt sie auf KEINEM Weg (kein Umschalt-,
// kein Feststell-, kein Totasten-Weg; nur der Alt-Code) - `grossFehlt`, wie Französisch É und Ç: Zeilen
// mit ihnen werden unter Windows nicht serviert (`fitText`), erzeugte Zeilen beginnen dort nicht gross.
// Am Mac (Pro: Option + Umschalt + W/E/R/T/U und V; QZERTY: Option + Umschalt + E/I/Ziffer, À und É über
// die Totasten Option + 9 / Option + 0) gehen sie - `grossFehltMac` ist leer.
// ⚠️ Das Modell kennt Option + Umschalt nicht (`KeyMod` hat nur shift und altgr): die Griffe der Grossen
// am Mac stehen in den Hinweisen, nicht in `access` - F4 (späte eigene Lektion) baut sie.
//
// Plattform: dieselbe Regel wie bei den übrigen Layouts (Kopf „Mac gegen Windows"): `it` bildet die
// WINDOWS-Belegung ab; was am Mac abweicht, trägt ein eigenes Feld (`grossFehltMac`).

/**
 * Was es auf der italienischen Windows-Tastatur nicht gibt und der Weg nicht übt (klein verglichen):
 * 141 kennt weder ~ noch ` noch ´; { } liegen auf AltGr + Umschalt (`KeyMod` kennt das nicht);
 * í ó ú sind die Einaudi-Schreibung, keine Lernziele (R1 §1.2); die Typografie-Zeichen liegen nur am
 * Mac auf Option.
 */
const IT_FEHLT: readonly string[] = [
  "~", "`", "´", "{", "}",
  "í", "ó", "ú",
  "«", "»", "“", "”", "‘", "’", "…", "º", "ª",
];

/**
 * ★ Ersatz NUR für Zeichen, die es nicht gibt UND kein Wort ändern (R1 §4.3 Punkt 3): « » und “ ” ⇒ ",
 * ‘ ’ ⇒ ', … ⇒ ..., º ⇒ ° (Treccani schreibt 1°). KEIN Akzent-Ersatz. Zwei-Zeichen-Schlüssel wie bei
 * Französisch: « Wort » ⇒ "Wort" (ohne Innenabstand), einzeln bleibt der Rückfall.
 */
const IT_ERSATZ: Readonly<Record<string, string>> = {
  "« ": "\"", " »": "\"", "«": "\"", "»": "\"",
  "“": "\"", "”": "\"",
  "‘": "'", "’": "'",
  "…": "...",
  "º": "°",
};

/**
 * Italien - Windows „Italiano" (141, KBDIT) und Mac „Italiano - Pro" (gleiche Grundebene und gleiche
 * Umschalt-Ebene). 142 unterscheidet sich nur auf AltGr (`@ # [ ]` wandern) und ist nicht trennbar.
 * Grundreihe `a s d f g h j k l ò à ù`: die achte Heimtaste (rechter kleiner Finger) ist `ò`.
 */
const IT: KeyboardLayout = {
  id: "it",
  label: "Italienisch (Italien, Windows Italiano / Mac Italiano - Pro)",
  kurz: "italienische Tastatur",
  en: {
    label: "Italian (Italy, Windows Italiano / Mac Italiano - Pro)",
    kurz: "Italian keyboard",
    hinweis:
      "On the Italian keyboard à, è, ì, ò and ù have keys of their own; é is Shift + è. " +
      "Capital À È É Ì Ò Ù do not exist on Windows (only through an Alt code), so texts with " +
      "them are left out there; on a Mac they come from Option + Shift.",
  },
  rows: ISO_ROWS(
    ["\\", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "ì"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "è", "+"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ò", "à", "ù"],
    ["<", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    // Umschalt-Ebene (R1 §2.1; Mac Pro gemessen: gleich)
    "|": { base: "\\", mod: "shift" }, "!": { base: "1", mod: "shift" },
    "\"": { base: "2", mod: "shift" }, "£": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "&": { base: "6", mod: "shift" }, "/": { base: "7", mod: "shift" },
    "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "=": { base: "0", mod: "shift" }, "?": { base: "'", mod: "shift" },
    "^": { base: "ì", mod: "shift" }, // ein gewöhnliches Zeichen, KEINE Totaste (141 hat keine)
    "é": { base: "è", mod: "shift" },
    "*": { base: "+", mod: "shift" },
    "ç": { base: "ò", mod: "shift" }, // Fremdwort - kein Lernziel
    "°": { base: "à", mod: "shift" }, "§": { base: "ù", mod: "shift" },
    ">": { base: "<", mod: "shift" },
    ";": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" },
    "_": { base: "-", mod: "shift" },
    // AltGr (Windows 141; Mac Pro: Option) - auf 142 liegen @ # [ ] anderswo (nicht erkennbar, R1 §5.2)
    "€": { base: "e", mod: "altgr" },
    "@": { base: "ò", mod: "altgr" }, "#": { base: "à", mod: "altgr" },
    "[": { base: "è", mod: "altgr" }, "]": { base: "+", mod: "altgr" },
  },
  missing: IT_FEHLT,
  ersatz: IT_ERSATZ,
  // Weder Windows noch Mac: die Feststelltaste gibt keinen Grossbuchstaben mit Akzent (Caps + è = è).
  capsUpper: [],
  grossFehlt: ["À", "È", "É", "Ì", "Ò", "Ù"],
  grossFehltMac: [],
  hinweis:
    "Auf der italienischen Tastatur liegen à è ì ò ù auf eigenen Tasten, é ist Umschalt + è. " +
    "Die Großbuchstaben mit Akzent (À È É Ì Ò Ù) gibt es unter Windows nur über den Alt-Code - " +
    "Texte mit ihnen kommen dort darum nicht vor. Am Mac (Italiano - Pro) gehen sie mit " +
    "Option + Umschalt.",
};

/**
 * Italien - Mac „Italiano" (nicht „Pro"; `com.apple.keylayout.Italian`), die QZERTY-Belegung der
 * Apple-Hardware. Gemessen (UCKeyTranslate): `z` und `w` vertauscht, `m` rechts von `l` (die ACHTE
 * Heimtaste ist `m`, nicht `ò`), **die Ziffern nur mit Umschalt** (die Ziffernreihe trägt
 * `& " ' ( ç è ) £ à é`), `.` = Umschalt + `;`-Taste. Alle sechs kleinen Akzentbuchstaben sind eigene Tasten.
 * Nur am Mac - nie in der Windows-Erkennung.
 *
 * ⚠️ `[ ] \ ~ \`` brauchen Option + Umschalt bzw. Totasten, die das Modell nicht kennt: `missing`.
 * Die Totasten Gravis/Akut (Option + 9 / Option + 0) sind absichtlich NICHT in `access`: für die
 * Grossbuchstaben `Ò Ù` über Gravis + Umschalt + Buchstabe zeigt die Messung zerlegte Zeichen -
 * eingetragen wird nur, was gemessen heil ist (Falle 36/44).
 */
const IT_QZERTY: KeyboardLayout = {
  id: "it-qzerty",
  label: "Italienisch (Mac Italiano, QZERTY)",
  kurz: "italienische Mac-Tastatur (QZERTY)",
  en: {
    label: "Italian (Mac Italiano, QZERTY)",
    kurz: "Italian Mac keyboard (QZERTY)",
    hinweis:
      "The Mac keyboard \"Italiano\" is QZERTY: z and w are swapped, m sits right of l, and the " +
      "digits need Shift (the number row shows & \" ' ( ç è ) £ à é). à, è, é, ì, ò and ù " +
      "have keys of their own.",
  },
  rows: ISO_ROWS(
    ["@", "&", "\"", "'", "(", "ç", "è", ")", "£", "à", "é", "-", "="],
    ["q", "z", "e", "r", "t", "y", "u", "i", "o", "p", "ì", "$"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "m", "ù", "§"],
    ["<", "w", "x", "c", "v", "b", "n", ",", ";", ":", "ò"],
  ),
  // Mac: Ctrl · Option („alt") · Option · Ctrl - die dritte Kappe ist KEIN „Alt Gr".
  bottomLabels: ["Ctrl", "Alt", "Alt", "Ctrl"],
  access: {
    // Ziffern NUR mit Umschalt (gemessen: Ziffern+S = # 1 2 3 4 5 6 7 8 9 0 _ +)
    "1": { base: "&", mod: "shift" }, "2": { base: "\"", mod: "shift" },
    "3": { base: "'", mod: "shift" }, "4": { base: "(", mod: "shift" },
    "5": { base: "ç", mod: "shift" }, "6": { base: "è", mod: "shift" },
    "7": { base: ")", mod: "shift" }, "8": { base: "£", mod: "shift" },
    "9": { base: "à", mod: "shift" }, "0": { base: "é", mod: "shift" },
    "#": { base: "@", mod: "shift" }, "_": { base: "-", mod: "shift" },
    "+": { base: "=", mod: "shift" },
    // obere Reihe: Umschalt + ì ist die Totaste Zirkumflex (gemessen: `[†]`), Umschalt + $ = *
    "^": { base: "ì", mod: "shift", dead: true }, "*": { base: "$", mod: "shift" },
    // Grundreihe
    "%": { base: "ù", mod: "shift" }, "°": { base: "§", mod: "shift" },
    // untere Reihe: `.` ist Umschalt + `;`-Taste, `?` Umschalt + `,`-Taste, `!` Umschalt + ò
    ">": { base: "<", mod: "shift" }, "?": { base: ",", mod: "shift" },
    ".": { base: ";", mod: "shift" }, "/": { base: ":", mod: "shift" },
    "!": { base: "ò", mod: "shift" },
    // Option-Ebene (Option = „altgr" im Modell)
    "€": { base: "i", mod: "altgr" },
    "{": { base: "(", mod: "altgr" }, "}": { base: ")", mod: "altgr" },
    "|": { base: ":", mod: "altgr" },
  },
  missing: [
    "~", "`", "´", "[", "]", "\\",
    "í", "ó", "ú",
    "«", "»", "“", "”", "‘", "’", "…", "º", "ª",
  ],
  ersatz: IT_ERSATZ,
  capsUpper: [], // gemessen: Caps + è = è
  hinweis:
    "Der Mac „Italiano“ (nicht „Italiano - Pro“) ist eine QZERTY-Tastatur: z und w sind " +
    "vertauscht, m liegt rechts von l, und die Ziffern brauchen die Umschalttaste (die Ziffernreihe " +
    "zeigt & \" ' ( ç è ) £ à é). à è é ì ò ù liegen auf eigenen Tasten; die Großbuchstaben " +
    "mit Akzent gehen mit Option + Umschalt (À und É über die Totasten Option + 9 und Option + 0).",
};


// --- Die polnische Tastatur (★ F3-pl, 02.10.2026) ---------------------------
//
// ★★★ F3-pl (02.10.2026, Bauplan §0a, R1 `recherche-polnisch-2026-10-02/tastaturen-und-zeichen.md`,
// R0 `recherche-didaktik-2026-10-02/didaktik-polnisch.md`): EIN Eintrag für Windows „Polski
// (programisty)" (`KBDPL1`, die Standard-Belegung in Polen) und Mac „Polish - Pro". Beide haben die
// Grundebene und die Umschalt-Ebene der US-Tastatur; die neun polnischen Buchstaben liegen auf AltGr
// (Mac: Option) + der Taste ihres Grundbuchstabens. Quellen: Windows aus der Microsoft-Tabelle
// (⚠️ am Gerät NICHT gemessen - Messliste im Befund F3-pl), Mac „Polish - Pro" per UCKeyTranslate
// gemessen (`pruefstand/werkzeug-totasten/messung-mac-2026-10-02-it-pl-tr-cs.txt`).
//
// ★ NEUE ZUGRIFFSART „AltGr-Buchstabe" (`KeyAccess.buchstabe`, siehe `fingers.ts`): `ą ć ę ł ń ó ś ź ż`
// und `Ą Ć Ę Ł Ń Ó Ś Ź Ż` sind je ein EIGENER Eintrag (der Großbuchstabe ist nicht „Umschalt + die
// ą-Taste" - es gibt keine). Kleine: AltGr + Grundbuchstabe (ź: AltGr + X); grosse: dazu Umschalt
// (`mitUmschalt`; Feststell + AltGr + Buchstabe geht auf Windows auch, ist aber kein Weg der Lehre).
//
// ★ KEIN ERSATZ für die neun Buchstaben, kein `missing`: alle 18 Zeichen sind auf beiden Plattformen
// tippbar. Ein Ersatz („ą" ⇒ „a") wäre in 27 gemessenen Paaren ein ANDERES Wort (że/ze, ją/ja, chcę/chce,
// mają/maja, stał/stal, nić/nic, sąd/sad …, R1 §6) und überall sonst ein Nichtwort (Falle 36).
//
// ★ `~` IST AUF WINDOWS EINE TOTASTE (Umschalt + `, dann Leertaste; zugleich ein zweiter Weg zu den
// neun Buchstaben: `~` dann a = ą) - auf dem Mac „Polish - Pro" ein gewöhnliches Zeichen. Wie die
// italienischen Tastaturen ohne `~` (R1 §5) steht es in `missing`: kein Lernziel, nie geübt, keine Ansage
// mit einem unvollständigen Weg. Angenommen wird, was entsteht: der Anschlag wird gedeutet
// (`anschlagDeuten.ts`), eine unbekannte Totaste ist kein Fehler - `~` dann a ergibt `ą` und zählt.
//
// Plattform: dieselbe Regel wie bei den übrigen Layouts (Kopf „Mac gegen Windows"): `pl` bildet die
// WINDOWS-Belegung ab; was am Mac abweicht, tragen eigene Felder (`bottomLabelsMac`, `accessMac`).

/** Die neun polnischen Buchstaben, klein: Zeichen ⇒ Grundbuchstabe (die Taste, auf der sie liegen). */
const PL_BUCHSTABEN: Readonly<Record<string, string>> = {
  "ą": "a", "ć": "c", "ę": "e", "ł": "l", "ń": "n", "ó": "o", "ś": "s", "ź": "x", "ż": "z",
};

/** Die 18 AltGr-Buchstaben als `access`-Einträge: klein ohne, gross mit Umschalt. */
const PL_ALTGR_BUCHSTABEN: Record<string, KeyAccess> = (() => {
  const a: Record<string, KeyAccess> = {};
  for (const [klein, base] of Object.entries(PL_BUCHSTABEN)) {
    a[klein] = { base, mod: "altgr", buchstabe: true };
    a[klein.toUpperCase()] = { base, mod: "altgr", buchstabe: true, mitUmschalt: true };
  }
  return a;
})();

/**
 * Was es auf „Polski (programisty)" nicht gibt und der Weg nicht übt: die deutschen Zeichen (wie `us`),
 * `~` (Totaste, siehe oben), die Typografie (Anführungszeichen „ ” « », Striche, Auslassungspunkte -
 * unter Windows nur über Alt-Codes, am Mac auf Option) und `§ °` (nur am Mac).
 */
// ⚠️ Halb- und Geviertstrich als Zeichencode, nicht als Zeichen im Quelltext: der Strich-Wächter
// (`tests/typing-striche.test.ts`) zählt jede Zeichenkette mit einem Gedankenstrich - hier ist das Zeichen
// die SACHE selbst (es wird als nicht tippbar benannt), kein vorgelesener Text.
const HALBGEVIERT = String.fromCharCode(0x2013);
const GEVIERT = String.fromCharCode(0x2014);
const PL_FEHLT: readonly string[] = [
  "ä", "ö", "ü", "ß", "£", "§", "°", "~",
  "„", "”", "“", "«", "»", "‚", "‘", "’", "…", HALBGEVIERT, GEVIERT,
];

/**
 * ★ Ersatz NUR für Zeichen, die es nicht gibt UND kein Wort ändern: „ ” “ « » ⇒ `"` (R1 §1.3: das
 * gerade `"` ist dort erlaubt, wo `„…”` nicht auf der Tastatur liegt - genau das ist bei programisty der
 * Fall), ‚ ‘ ’ ⇒ `'`, … ⇒ `...`, – — ⇒ `-` (Hausregel R1 §1.4: der Gedankenstrich ist ein Bindestrich),
 * und für deutsche Inhalte wie auf `us` ä ö ü ß. KEIN Ersatz für `ą ć ę ł ń ó ś ź ż`.
 */
const PL_ERSATZ: Readonly<Record<string, string>> = {
  "„": "\"", "”": "\"", "“": "\"", "«": "\"", "»": "\"",
  "‚": "'", "‘": "'", "’": "'",
  "…": "...",
  [HALBGEVIERT]: "-", [GEVIERT]: "-",
  // ★ F7-pl (03.10.2026, Glossar §3 Fallen 8): das GESCHÜTZTE Leerzeichen (U+00A0, so schreibt `Intl` „12 345" und „20 zł", und so
  // setzt PWN den Abstand vor „zł") und das schmale (U+202F) sind für das Kind ein gewöhnliches Leerzeichen - die Tastatur hat nur
  // eines. Ohne diesen Ersatz fiele jede Zeile mit einem solchen Zeichen aus `fitText` heraus (nie serviert, auch aus einem
  // hochgeladenen Text, den jemand aus Word oder einer PDF kopiert hat). Ein Ersatz, der kein Wort ändert.
  "\u00A0": " ", "\u202F": " ",
  "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss", "Ä": "Ae", "Ö": "Oe", "Ü": "Ue",
};

/**
 * Polen - Windows „Polski (programisty)" (`KBDPL1`, KLID 00000415) und Mac „Polish - Pro". ANSI-Reihen
 * wie `us` (die Beschriftung der Hardware in Polen ist meist die US-Beschriftung, R0 P2). Die acht
 * Heimtasten sind die der US-Tastatur: `a s d f j k l ;`. Die Taste rechts neben der Leertaste heisst
 * auf Windows „Alt" (rechtes Alt = AltGr), am Mac „Option".
 */
const PL: KeyboardLayout = {
  id: "pl",
  label: "Polnisch (Programmierer, QWERTY)",
  kurz: "polnische Programmierer-Tastatur",
  en: {
    label: "Polish (Programmers, QWERTY)",
    kurz: "Polish programmers keyboard",
    hinweis:
      "On the Polish programmers keyboard (Windows \"Polski (programisty)\", Mac \"Polish - Pro\") " +
      "you type the Polish letters with the right Alt key (Mac: Option) and the base letter: " +
      "ą = a, ć = c, ę = e, ł = l, ń = n, ó = o, ś = s, ź = x, ż = z. For a capital letter add Shift. " +
      "With NVDA on Windows, Right Alt + N (ń) restarts NVDA, because Ctrl + Alt + N is its shortcut: " +
      "switch that shortcut off in NVDA, or use Shift + Caps Lock + Right Alt + N.",
  },
  rows: ANSI_ROWS(
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt", "Ctrl"],
  bottomLabelsMac: ["Ctrl", "Option", "Option", "Ctrl"],
  access: {
    ...QWERTY_BASE,
    '"': { base: "'", mod: "shift" },
    "@": { base: "2", mod: "shift" }, "#": { base: "3", mod: "shift" },
    "|": { base: "\\", mod: "shift" },
    "\\": { base: "\\" },
    // Windows: AltGr + U (R1 §2.2). Mac Pro: Option + 3 (`accessMac`).
    "€": { base: "u", mod: "altgr" },
    ...PL_ALTGR_BUCHSTABEN,
  },
  accessMac: {
    "€": { base: "3", mod: "altgr" },
  },
  missing: PL_FEHLT,
  ersatz: PL_ERSATZ,
  // Umschalt + AltGr + Buchstabe ist der Weg; Feststell + AltGr + Buchstabe ergibt auf Windows
  // ebenfalls die Grossform, ist aber kein Weg der Lehre (kein Eintrag).
  capsUpper: [],
  hinweis:
    "Auf der polnischen Programmierer-Tastatur tippst du die polnischen Buchstaben mit der rechten " +
    "Alt-Taste (am Mac: Option) und dem Buchstaben: ą = a, ć = c, ę = e, ł = l, ń = n, ó = o, ś = s, " +
    "ź = x, ż = z. Für einen Großbuchstaben kommt die Umschalttaste dazu. Auf der Taste steht nur " +
    "der Grundbuchstabe. Mit NVDA unter Windows startet rechte Alt-Taste + N (ń) NVDA neu, weil Strg + Alt + N " +
    "dessen Tastenkürzel ist: das Kürzel in NVDA ausschalten, oder Umschalt + Feststelltaste + rechte " +
    "Alt-Taste + N drücken.",
};

// --- Die türkischen Tastaturen (★ F3-tr, 02.10.2026) ------------------------
//
// ★★★ F3-tr (02.10.2026, Bauplan §0a, R0 `recherche-didaktik-2026-10-02/didaktik-tuerkisch.md` T1,
// R1 `recherche-tuerkisch-2026-10-02/tastaturen-und-zeichen.md` §2-§7): ZWEI Tastaturen als Daten.
//  · `tr-q` = Windows „Türkçe Q" (KBDTUQ) UND Mac „Turkish - QWERTY - PC" (Grund- und Umschalt-Ebene Zeichen
//    für Zeichen gleich, per UCKeyTranslate gemessen): die Tastatur in Haushalten, Schulen und im Handel
//    (Hauptweg „tr"). Ein ISO-Layout - es passt auch auf deutsche und Schweizer Hardware mit eingeschaltetem
//    „Türkçe Q" (dieselben Tasten, nur y/z und die Sonderbuchstaben sind anders beschriftet, R1 §3.2).
//  · `tr-f` = Windows „Türkçe F" (KBDTUF) UND Mac „Turkish - Standard": die amtliche Norm TS 2117 (MEB-Kurse,
//    Behörden). Völlig andere Grundreihe `u i e a ü t k m l y ş`, Tastmarken auf `a` und `k`. Daten und Erkennung
//    ja, aber NICHT in der Tastatur-Menge von Weg „tr" ({@link TUERKISCHE_WEG_LAYOUT_IDS}): F bekommt später
//    einen eigenen Weg „tr-F" mit eigener Reihenfolge.
// Quellen: Windows aus der Microsoft-Tabelle (⚠️ am Gerät NICHT gemessen - Messliste im Befund F3-tr), Mac per
// UCKeyTranslate (`pruefstand/werkzeug-totasten/messung-mac-2026-10-02-it-pl-tr-cs.txt`, Abschnitte
// `Turkish-QWERTY-PC` und `Turkish-Standard`). Der Mac „Turkish" (Apple-eigener F-Entwurf) und „Turkish-QWERTY"
// (US-Grundebene mit Option) sind keine Lerntastaturen.
//
// ★ VIER i-BUCHSTABEN, ZWEI TASTEN: `i` und `ı` liegen auf zwei Tasten, ihre Grossformen sind `İ` und `I`
// (Umschalt ODER Feststell). `sprache: "tr"` lässt jede Funktion (`baseKeyForChar`, `needsShift`, `keyExists`,
// `toLayoutText` …) türkisch rechnen; `I` und `İ` stehen zusätzlich AUSDRÜCKLICH in `access` (Umschalt + ı bzw.
// Umschalt + i), damit keine Stelle sie über `toLowerCase()` falsch auflöst (R1 §5.3).
//  · Windows: Feststell + `i` ⇒ `İ`, Feststell + `ı` ⇒ `I`; Feststell + Umschalt kehrt wieder um (⇒ klein).
//  · Mac (gemessen): Feststell = Umschalt, Feststell + Umschalt bleibt GROSS - anders als Windows. Kein Weg der
//    Lehre: gelehrt wird Umschalt (`capsUpper` leer, wie bei den übrigen Tastaturen, deren Umschalt-Weg trägt).
//
// ★ KEIN ERSATZ für ı ş ğ ç ö ü İ Ş Ğ Ç Ö Ü â î û (Falle 36): ohne sie ergeben die Wörter oft ein ANDERES
// (sık/şık ⇒ sik, kıl ⇒ kil, şu ⇒ su, baş ⇒ bas, iş ⇒ is, çam ⇒ cam, kör ⇒ kor, ön ⇒ on, kâr ⇒ kar, hâlâ ⇒ hala
// …, R1 §4). Ersatz nur für Typografie (`“ ” „ « »` ⇒ `"`, `‘ ’` ⇒ `'`, `…` ⇒ `...`, Halb-/Geviertstrich ⇒ `-`).
// Das gerade `"` liegt auf Q DIREKT links der 1, auf F ist es Umschalt + 2; der Apostroph `'` ist auf Q
// Umschalt + 2, auf F Umschalt + 7 (TDK: Eigennamen mit Endung, Ankara'da).
//
// ★ Totaste Zirkumflex `^` (Umschalt + 3, beide Windows-Belegungen): `â î û` (auch `ê ô`) nur so, dann der
// Vokal. Die weiteren Totasten (`¨` AltGr + ğ, `~` AltGr + ü, `´` AltGr + ş, Gravis AltGr + `,` bzw. auf F
// AltGr + q/w/y/x-Taste) sind kein Lernziel und stehen NICHT in `access` (wie `~` bei `pl`): angenommen wird,
// was entsteht (`anschlagDeuten`: eine unbekannte Totaste ist kein Fehler).
// Mac `tr-q`: dieselbe Totaste `^` (Umschalt + 3, gemessen); `^` + `i`-Taste ⇒ `î` am Mac ist UNGEMESSEN (die
// Messung schickte nur die `ı`-Taste: `^ı`, keine Komposition) - Messliste M9.
// Mac `tr-f` („Turkish - Standard") hat KEINE Totaste: `â î û` = Option + a / i / u (die Taste mit dem
// Buchstaben selbst), mit Umschalt `Â Î Û`; `^` ist dort ein gewöhnliches Zeichen. Das trägt `accessMac`.
//
// Plattform: dieselbe Regel wie bei den übrigen Layouts (Kopf „Mac gegen Windows"): `tr-q` und `tr-f`
// bilden die WINDOWS-Belegung ab; was am Mac abweicht, tragen eigene Felder (`bottomLabelsMac`, `accessMac`).

/**
 * Was es auf den türkischen Windows-Tastaturen nicht gibt und der Weg nicht übt: die Typografie
 * (Anführungszeichen, Striche, Auslassungspunkte - nur über Alt-Codes; `« »` liegen auf F zwar auf AltGr, sind
 * aber kein Lernziel). Halb- und Geviertstrich als Zeichencode (Strich-Wächter, siehe `PL_FEHLT`).
 * ⚠️ `missing` vergleicht klein: `ı İ I i` und alle türkischen Buchstaben NIE hier eintragen.
 */
const TR_FEHLT: readonly string[] = [
  "“", "”", "„", "‘", "’", "…", "«", "»", HALBGEVIERT, GEVIERT,
];

/**
 * ★ Ersatz NUR für Zeichen, die es nicht gibt UND kein Wort ändern (R1 §4.3 Punkt 3): `“ ” „ « »` ⇒ `"`,
 * `‘ ’` ⇒ `'` (das typografische `’` der Verlage und des TDK ist auf keiner türkischen Tastatur tippbar),
 * `…` ⇒ `...`, Halb-/Geviertstrich ⇒ `-` (Hausregel). KEIN Ersatz für Buchstaben.
 */
const TR_ERSATZ: Readonly<Record<string, string>> = {
  "“": "\"", "”": "\"", "„": "\"", "«": "\"", "»": "\"",
  "‘": "'", "’": "'",
  "…": "...",
  [HALBGEVIERT]: "-", [GEVIERT]: "-",
};

/**
 * Türkei - Windows „Türkçe Q" (`KBDTUQ`, KLID 0000041f) und Mac „Turkish - QWERTY - PC". ISO-Reihen.
 * Grundreihe `a s d f g h j k l ş i ,`: die acht Heimtasten sind `a s d f | j k l ş` (Tastmarken auf f und j).
 */
const TR_Q: KeyboardLayout = {
  id: "tr-q",
  label: "Türkisch Q (Türkçe Q)",
  kurz: "türkische Q-Tastatur",
  sprache: "tr",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "ş"],
  en: {
    label: "Turkish Q (Türkçe Q)",
    kurz: "Turkish Q keyboard",
    hinweis:
      "On the Turkish Q keyboard ı, ğ, ş, ç, ö and ü have keys of their own, right of p, l and m. ı and i " +
      "are two keys: i sits right of ş, ı where the German keyboard has i. The apostrophe is Shift + 2, " +
      "the double quote sits left of the 1, ₺ is AltGr + T (Mac: Option + T). â, î and û come from the " +
      "^ dead key (Shift + 3), then the vowel.",
  },
  rows: ISO_ROWS(
    ["\"", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "-"],
    ["q", "w", "e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i", ","],
    ["<", "z", "x", "c", "v", "b", "n", "m", "ö", "ç", "."],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  bottomLabelsMac: ["Ctrl", "Option", "Option", "Ctrl"],
  access: {
    // Umschalt-Ebene (R1 §2.1; Mac „Turkish-QWERTY-PC" gemessen: gleich)
    "!": { base: "1", mod: "shift" }, "'": { base: "2", mod: "shift" },
    "^": { base: "3", mod: "shift", dead: true }, // Totaste: â î û
    "+": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "&": { base: "6", mod: "shift" }, "/": { base: "7", mod: "shift" },
    "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "=": { base: "0", mod: "shift" }, "?": { base: "*", mod: "shift" },
    "_": { base: "-", mod: "shift" },
    ":": { base: ".", mod: "shift" }, ";": { base: ",", mod: "shift" },
    ">": { base: "<", mod: "shift" },
    "é": { base: "\"", mod: "shift" },
    // die zwei i-Grossformen ausdrücklich (R1 §5.3): İ = Umschalt + i, I = Umschalt + ı
    "I": { base: "ı", mod: "shift" }, "İ": { base: "i", mod: "shift" },
    // AltGr (Windows; Mac: Option - gemessen: dieselben Tasten)
    "@": { base: "q", mod: "altgr" }, "€": { base: "e", mod: "altgr" }, "₺": { base: "t", mod: "altgr" },
    "£": { base: "2", mod: "altgr" }, "#": { base: "3", mod: "altgr" }, "$": { base: "4", mod: "altgr" },
    "½": { base: "5", mod: "altgr" },
    "{": { base: "7", mod: "altgr" }, "[": { base: "8", mod: "altgr" }, "]": { base: "9", mod: "altgr" },
    "}": { base: "0", mod: "altgr" },
    "\\": { base: "*", mod: "altgr" }, "|": { base: "-", mod: "altgr" },
  },
  missing: TR_FEHLT,
  ersatz: TR_ERSATZ,
  // Umschalt erzeugt jeden Grossbuchstaben; Feststell geht auch (Windows: Feststell + Umschalt ⇒ klein, Mac: bleibt
  // gross), ist aber kein Weg der Lehre - die Meldung „Feststelltaste an?" sagt es einem Kind, das sie anhat.
  capsUpper: [],
  hinweis:
    "Auf der türkischen Q-Tastatur liegen ı, ğ, ş, ç, ö und ü auf eigenen Tasten rechts von p, l und m. " +
    "ı und i sind zwei Tasten: i sitzt rechts von ş, ı dort, wo auf der deutschen Tastatur i steht. Der " +
    "Apostroph steht auf Umschalt + 2, das Anführungszeichen links neben der 1, ₺ liegt auf AltGr + T " +
    "(am Mac: Option + T). â, î und û kommen über die Totaste ^ (Umschalt + 3), dann den Vokal.",
};

/**
 * Türkei - Windows „Türkçe F" (`KBDTUF`, KLID 0001041f) und Mac „Turkish - Standard" (F wie Windows). ISO-Reihen.
 * Grundreihe `u i e a ü t k m l y ş x`: die acht Heimtasten sind `u i e a | k m l y`, die Tastmarken liegen auf
 * `a` und `k` (dieselbe STELLE wie F und J auf der US-Tastatur, nicht derselbe Buchstabe).
 */
const TR_F: KeyboardLayout = {
  id: "tr-f",
  label: "Türkisch F (Türkçe F)",
  kurz: "türkische F-Tastatur",
  sprache: "tr",
  heimtasten: ["u", "i", "e", "a", "k", "m", "l", "y"],
  en: {
    label: "Turkish F (Türkçe F)",
    kurz: "Turkish F keyboard",
    hinweis:
      "On the Turkish F keyboard the home row is u i e a ü t k m l y ş (left u i e a, right k m l y). The keys " +
      "with the tactile marks are a (left) and k (right). ı, ğ, ş, ç, ö and ü have keys of their own. The " +
      "apostrophe is Shift + 7, the double quote Shift + 2, ₺ is AltGr + T (Mac: Option + T). â, î and û come " +
      "from the ^ dead key (Shift + 3) on Windows; on a Mac they are Option + a, i or u.",
  },
  rows: ISO_ROWS(
    ["+", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "/", "-"],
    ["f", "g", "ğ", "ı", "o", "d", "r", "n", "h", "p", "q", "w"],
    ["u", "i", "e", "a", "ü", "t", "k", "m", "l", "y", "ş", "x"],
    ["<", "j", "ö", "v", "c", "ç", "z", "s", "b", ".", ","],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  bottomLabelsMac: ["Ctrl", "Option", "Option", "Ctrl"],
  access: {
    // Umschalt-Ebene (R1 §2.2; Mac „Turkish-Standard" gemessen: gleich)
    "*": { base: "+", mod: "shift" }, "!": { base: "1", mod: "shift" },
    "\"": { base: "2", mod: "shift" },
    "^": { base: "3", mod: "shift", dead: true }, // Totaste: â î û (Windows)
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "&": { base: "6", mod: "shift" }, "'": { base: "7", mod: "shift" },
    "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "=": { base: "0", mod: "shift" }, "?": { base: "/", mod: "shift" },
    "_": { base: "-", mod: "shift" },
    ":": { base: ".", mod: "shift" }, ";": { base: ",", mod: "shift" },
    ">": { base: "<", mod: "shift" },
    "I": { base: "ı", mod: "shift" }, "İ": { base: "i", mod: "shift" },
    // AltGr (Windows; Mac: Option): `@` liegt auf der Taste mit dem Aufdruck f (rechts von der Zahlenreihe)
    "@": { base: "f", mod: "altgr" }, "€": { base: "e", mod: "altgr" }, "₺": { base: "t", mod: "altgr" },
    "#": { base: "3", mod: "altgr" },
    "{": { base: "7", mod: "altgr" }, "[": { base: "8", mod: "altgr" }, "]": { base: "9", mod: "altgr" },
    "}": { base: "0", mod: "altgr" },
    "\\": { base: "/", mod: "altgr" }, "|": { base: "-", mod: "altgr" },
  },
  accessMac: {
    // „Turkish - Standard" hat keine Totaste (gemessen): `^` ist ein gewöhnliches Zeichen, `â î û` sind
    // Option + Buchstabe (die Taste mit dem Buchstaben selbst), mit Umschalt die Grossformen.
    "^": { base: "3", mod: "shift" },
    "â": { base: "a", mod: "altgr", buchstabe: true },
    "î": { base: "i", mod: "altgr", buchstabe: true },
    "û": { base: "u", mod: "altgr", buchstabe: true },
    "Â": { base: "a", mod: "altgr", buchstabe: true, mitUmschalt: true },
    "Î": { base: "i", mod: "altgr", buchstabe: true, mitUmschalt: true },
    "Û": { base: "u", mod: "altgr", buchstabe: true, mitUmschalt: true },
  },
  missing: TR_FEHLT,
  ersatz: TR_ERSATZ,
  capsUpper: [],
  hinweis:
    "Auf der türkischen F-Tastatur steht die Grundreihe u i e a ü t k m l y ş (links u i e a, rechts k m l y). " +
    "Die Tasten mit den Tastmarken sind a (links) und k (rechts). ı, ğ, ş, ç, ö und ü haben eigene Tasten. " +
    "Der Apostroph steht auf Umschalt + 7, das Anführungszeichen auf Umschalt + 2, ₺ liegt auf AltGr + T " +
    "(am Mac: Option + T). â, î und û kommen unter Windows über die Totaste ^ (Umschalt + 3), am Mac über " +
    "Option + a, i oder u.",
};

// --- Die tschechischen Tastaturen (★ F3-cs, 02.10.2026) ---------------------
//
// ★★★ F3-cs (02.10.2026, Bauplan §0a, R0 `recherche-didaktik-2026-10-02/didaktik-tschechisch.md` §0 C1-C14, R1
// `recherche-tschechisch-2026-10-02/tastaturen-und-zeichen.md` §2-§8): ZWEI Tastaturen als Daten.
//  · `cs` = Windows „Čeština" (KBDCZ, QWERTZ, die Norm) UND Mac „Czech" (Grund- und Umschalt-Ebene Zeichen für
//    Zeichen gleich, per UCKeyTranslate gemessen).
//  · `cs-qwerty` = Windows „Čeština (QWERTY)" (KBDCZ1) UND Mac „Czech - QWERTY": Grund-, Umschalt- und Feststell-Ebene
//    wie `cs`, NUR y und z stehen auf den Plätzen der englischen Tastatur (y rechts neben t, z unten links);
//    verschieden ist die AltGr-Ebene (dort die US-Zeichen auf den Zifferntasten).
// Quellen: Windows aus den Microsoft-Tabellen (⚠️ am Gerät NICHT gemessen - Messliste im Befund F3-cs), Mac per
// UCKeyTranslate (`pruefstand/werkzeug-totasten/messung-mac-2026-10-02-it-pl-tr-cs.txt`, Abschnitte `Czech` und
// `Czech-QWERTY`). Beide sind ISO-Tastaturen.
//
// ★ DIE ZAHLENREIHE TRÄGT BUCHSTABEN (Falle: „Zahlenreihe = Ziffern"): auf den Tasten 2 bis 0 stehen
// `ě š č ř ž ý á í é`, die Taste 1 trägt `+`. Die ZIFFERN kommen NUR mit Umschalt (`access["2"]` = ě + Umschalt ...) -
// derselbe Fall wie bei Frankreich (`AZERTY_ROW0_ACCESS`), nur mit neun statt vier Buchstaben. Das hat zwei Folgen:
//  · UMSCHALT GIBT AUF DIESEN TASTEN NIE DEN GROSSBUCHSTABEN: Umschalt + š = 3, Umschalt + ú = `/`, Umschalt + ů = `"`.
//    Č Š Ř Ž Ě Ý Á Í É entstehen mit der Totaste (Háček bzw. Čárka, dann Umschalt + Buchstabe) ODER mit der
//    FESTSTELLTASTE (dann gibt die Zahlenreihe Ě Š Č Ř Ž Ý Á Í É, NICHT die Ziffern - bei AZERTY ist es umgekehrt).
//  · `capsUpper` bleibt LEER: der Weg lehrt die Grossformen über die Totaste (Entscheidung Johannes, T1: kein
//    Feststell-Zustand, den ein Kind mit Blindheit nur über den Screenreader merkt, und derselbe Griff für Ď Ť Ň Ó).
//    Die Anschlag-Prüfung nimmt trotzdem jedes richtig entstandene Zeichen an, auch über die Feststelltaste.
//
// ★ TOTASTEN (Čárka `´` und Háček `ˇ`): beide liegen auf der LETZTEN Taste der Zahlenreihe (rechts neben `=`): ohne
// Umschalt die Čárka (`´`: á é í ó ú ý), mit Umschalt der Háček (`ˇ`: č ď ě ň ř š ť ž). Ohne eigene Taste sind nur
// `ď ť ň` (Háček + d / t / n) und `ó` (Čárka + o); `ú` und `ů` liegen auf eigenen Tasten (rechts von p und rechts von l).
// Die Grossformen Č Š Ř Ž Ě Á É Í Ú Ý Ď Ť Ň Ó sind Totaste + Umschalt + Buchstabe (`totasten.ts`, `KOMBIZEICHEN_CS`).
// `Ů` ist die Ausnahme: nur mit der Feststelltaste zu schreiben (Windows: Ring-Totaste, Mac: Háček) - wie `È` auf
// Italienisch `grossFehlt`, Zeilen mit ihm werden nicht serviert (`Ů` beginnt kein Wort, R1 §2.4).
//
// ★ KEIN ERSATZ für tschechische Buchstaben (Falle 36): rund 45 Paare ergeben ohne Zeichen ein ANDERES Wort (být/byt,
// že/ze, ji/jí, pán/pan, rád/rad ...). Ersatz nur für Typografie (`„ “ ” ‚ ‘ ’ » «` ⇒ gerade Zeichen, `…` ⇒ `...`,
// Halb-/Geviertstrich ⇒ `-`): unter Windows hat `„ “` keine Taste, das gerade `"` (Umschalt + ů) ist dort der Alltag.
//
// ★ ISO-Reihen: `\` (die Taste links von Y/Z) steht vorn in der unteren Reihe; die Trema-Totaste `¨` (Umschalt `'`) am
// Ende der Grundreihe (ISO-Stelle von `#` auf der deutschen Tastatur, ungemessen, Messliste). Die Heimtasten sind
// `a s d f | j k l ů` (Tastmarken auf f und j) - die achte ist `ů`.
//
// ★ MAC GEGEN WINDOWS (Kopf „Mac gegen Windows"): `cs` und `cs-qwerty` bilden die WINDOWS-Belegung ab. Gleich sind
// Buchstaben, Ziffern, Umschalt-Ebene und beide Totasten. Am Mac anders (gemessen): die Taste links von der 1 trägt `<`
// und `>` (Windows `;` und die Ring-Totaste); die dritte Ebene heisst Option und liegt völlig anders (`@` Option + 2,
// `€` Option + r, `;` Option + ů, `'` Option + §); `^` ist dort ein gewöhnliches Zeichen (Option + 6). Das trägt
// `accessMac`. Die Zeichnung der Bildschirm-Tastatur zeigt am Mac auf der ersten Taste weiter `;` (Windows) - kein
// Lernziel, Messliste.

/** Die Zahlenreihe: Ziffern NUR mit Umschalt (R1 §2.1) - dieselbe Bauart wie `AZERTY_ROW0_ACCESS`. */
const CS_ROW0_ACCESS: Record<string, KeyAccess> = {
  "1": { base: "+", mod: "shift" }, "2": { base: "ě", mod: "shift" }, "3": { base: "š", mod: "shift" },
  "4": { base: "č", mod: "shift" }, "5": { base: "ř", mod: "shift" }, "6": { base: "ž", mod: "shift" },
  "7": { base: "ý", mod: "shift" }, "8": { base: "á", mod: "shift" }, "9": { base: "í", mod: "shift" },
  "0": { base: "é", mod: "shift" },
};

/**
 * Umschalt-Ebene und Totasten - auf `cs` und `cs-qwerty` GLEICH (R1 §2.2). Direkt (ohne Eintrag): `. , - + = ) § ; \`.
 * Das `°` ist die Ring-Totaste (Windows: Umschalt + Taste links der 1): kein Lernziel, aber ein Zeichen im Text („20 °C").
 */
const CS_UMSCHALT_ACCESS: Record<string, KeyAccess> = {
  "%": { base: "=", mod: "shift" },
  "?": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" }, "_": { base: "-", mod: "shift" },
  "!": { base: "§", mod: "shift" }, "\"": { base: "ů", mod: "shift" }, "'": { base: "¨", mod: "shift" },
  "(": { base: ")", mod: "shift" }, "/": { base: "ú", mod: "shift" },
  "|": { base: "\\", mod: "shift" },
  // Totasten: Čárka (letzte Taste der Zahlenreihe), Háček (Umschalt + dieselbe Taste), Trema (eigene Taste), Ring
  "´": { base: "´", dead: true },
  "ˇ": { base: "´", mod: "shift", dead: true },
  "¨": { base: "¨", dead: true },
  "°": { base: ";", mod: "shift", dead: true },
};

/** Die dritte Ebene des Mac (Option), gemessen für „Czech" UND „Czech-QWERTY" (gleich). `^` ist dort KEINE Totaste. */
const CS_ACCESS_MAC: Record<string, KeyAccess> = {
  "@": { base: "ě", mod: "altgr" }, "#": { base: "š", mod: "altgr" }, "$": { base: "č", mod: "altgr" },
  "~": { base: "ř", mod: "altgr" }, "^": { base: "ž", mod: "altgr" }, "&": { base: "ý", mod: "altgr" },
  "*": { base: "á", mod: "altgr" }, "{": { base: "í", mod: "altgr" }, "}": { base: "é", mod: "altgr" },
  "€": { base: "r", mod: "altgr" }, "[": { base: "ú", mod: "altgr" }, "]": { base: ")", mod: "altgr" },
  ";": { base: "ů", mod: "altgr" }, "'": { base: "§", mod: "altgr" },
  "<": { base: ",", mod: "altgr" }, ">": { base: ".", mod: "altgr" },
  "°": { base: "=", mod: "altgr", dead: true },
};

/**
 * Was es auf den tschechischen Tastaturen nicht gibt und der Weg nicht übt: die Typografie (Anführungszeichen,
 * Striche, Auslassungspunkte - unter Windows nur über Alt-Codes). Halb- und Geviertstrich als Zeichencode (Strich-Wächter,
 * siehe `PL_FEHLT`). ⚠️ `missing` vergleicht klein: KEINEN tschechischen Buchstaben hier eintragen.
 */
const CS_FEHLT: readonly string[] = [
  "„", "“", "”", "‚", "‘", "’", "»", "«", "…", HALBGEVIERT, GEVIERT,
];

/**
 * ★ Ersatz NUR für Zeichen, die es nicht gibt UND kein Wort ändern: `„ “ ” » «` ⇒ `"` (die IJP nennt das gerade
 * Zeichen fehlerhaft, auf der Tastatur ist es aber der Alltag, R1 §1.5), `‚ ‘ ’` ⇒ `'`, `…` ⇒ `...`, Halb-/Geviertstrich
 * ⇒ `-` (Hausregel). KEIN Ersatz für Buchstaben (R1 §5: být/byt, že/ze, ji/jí ...).
 */
const CS_ERSATZ: Readonly<Record<string, string>> = {
  "„": "\"", "“": "\"", "”": "\"", "»": "\"", "«": "\"",
  "‚": "'", "‘": "'", "’": "'",
  "…": "...",
  [HALBGEVIERT]: "-", [GEVIERT]: "-",
};

/** `Ů` entsteht nur mit der Feststelltaste - wie `È` auf Italienisch nicht serviert. */
const CS_GROSS_FEHLT: readonly string[] = ["Ů"];

/**
 * Tschechien - Windows „Čeština" (`KBDCZ`, KLID 00000405) und Mac „Czech". QWERTZ, ISO. Die Zahlenreihe
 * `; + ě š č ř ž ý á í é = ´`, die Grundreihe `a s d f g h j k l ů § ¨`: die acht Heimtasten sind `a s d f | j k l ů`.
 */
const CS: KeyboardLayout = {
  id: "cs",
  // ★ G3b (25.10.2026): die Eigenschaft statt der Kennungs-Liste in `hatLehrgangsTotasten` (Falle 50).
  lehrgangsTotasten: true,
  // ★ G3b: die Bildschirm-Tastatur zeigt bei einem Zwei-Schritt-Zeichen zuerst die Totaste (bis hierher an `TSCHECHISCHE_LAYOUT_IDS`).
  zweiSchrittZeigen: true,
  label: "Tschechisch (QWERTZ)",
  kurz: "tschechische Tastatur",
  sprache: "cs",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "ů"],
  en: {
    label: "Czech (QWERTZ)",
    kurz: "Czech keyboard",
    hinweis:
      "On the Czech keyboard ě š č ř ž ý á í é stand on the number row; the digits come with Shift. Shift on those " +
      "keys gives the digit, never the capital: capital Č Š Ř Ž Á É Í Ý Ě come from the háček or čárka dead key " +
      "(right of the = key; háček is Shift + the same key), then Shift and the letter - or with Caps Lock. " +
      "ď ť ň are háček + d, t or n, ó is čárka + o. ú and ů have keys of their own. Capital Ů only works with Caps Lock.",
  },
  rows: ISO_ROWS(
    [";", "+", "ě", "š", "č", "ř", "ž", "ý", "á", "í", "é", "=", "´"],
    ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ú", ")"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ů", "§", "¨"],
    ["\\", "y", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  bottomLabelsMac: ["Ctrl", "Option", "Option", "Ctrl"],
  access: {
    ...CS_ROW0_ACCESS,
    ...CS_UMSCHALT_ACCESS,
    // AltGr (Windows „Čeština", R1 §2.1). `^` ist dort eine Totaste (AltGr + 3), am Mac ein gewöhnliches Zeichen.
    "@": { base: "v", mod: "altgr" }, "#": { base: "x", mod: "altgr" }, "&": { base: "c", mod: "altgr" },
    "€": { base: "e", mod: "altgr" }, "[": { base: "f", mod: "altgr" }, "]": { base: "g", mod: "altgr" },
    "{": { base: "b", mod: "altgr" }, "}": { base: "n", mod: "altgr" },
    "<": { base: ",", mod: "altgr" }, ">": { base: ".", mod: "altgr" },
    "*": { base: "-", mod: "altgr" }, "~": { base: "+", mod: "altgr" },
    "$": { base: "ů", mod: "altgr" },
    "^": { base: "š", mod: "altgr", dead: true },
  },
  accessMac: CS_ACCESS_MAC,
  missing: CS_FEHLT,
  ersatz: CS_ERSATZ,
  // Umschalt gibt auf der Zahlenreihe die Ziffer, auf ú und ů `/` und `"`: die Grossformen kommen über die Totaste
  // (Entscheidung T1). Die Feststelltaste geht auch (Windows und Mac gleich), ist aber kein Weg der Lehre.
  capsUpper: [],
  grossFehlt: CS_GROSS_FEHLT,
  hinweis:
    "Auf der tschechischen Tastatur stehen ě š č ř ž ý á í é in der Zahlenreihe, die Ziffern kommen mit " +
    "Umschalt. Umschalt auf diesen Tasten gibt die Ziffer, nie den Großbuchstaben: große Č Š Ř Ž Á É Í Ý Ě " +
    "tippst du mit der Totaste (rechts neben der Taste =: Čárka ´, mit Umschalt Háček ˇ), dann Umschalt und " +
    "den Buchstaben - oder mit der Feststelltaste. ď ť ň sind Háček + d, t oder n, ó ist Čárka + o. ú und ů " +
    "haben eigene Tasten. Das große Ů gibt es nur mit der Feststelltaste.",
};

/**
 * Tschechien - Windows „Čeština (QWERTY)" (`KBDCZ1`, KLID 00010405) und Mac „Czech - QWERTY". Wie {@link CS}, nur `y` und
 * `z` auf den Plätzen der englischen Tastatur (y rechts neben t, z unten links); die AltGr-Ebene trägt die US-Zeichen auf
 * den Zifferntasten (`@` AltGr + 2, `#` AltGr + 3, `$` AltGr + 4 ...).
 */
const CS_QWERTY: KeyboardLayout = {
  id: "cs-qwerty",
  // ★ G3b (25.10.2026): die Eigenschaft statt der Kennungs-Liste in `hatLehrgangsTotasten` (Falle 50).
  lehrgangsTotasten: true,
  // ★ G3b: die Bildschirm-Tastatur zeigt bei einem Zwei-Schritt-Zeichen zuerst die Totaste (bis hierher an `TSCHECHISCHE_LAYOUT_IDS`).
  zweiSchrittZeigen: true,
  label: "Tschechisch (QWERTY)",
  kurz: "tschechische QWERTY-Tastatur",
  sprache: "cs",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "ů"],
  en: {
    label: "Czech (QWERTY)",
    kurz: "Czech QWERTY keyboard",
    hinweis:
      "The Czech QWERTY keyboard has y and z where the English keyboard has them, otherwise it is the Czech " +
      "keyboard: ě š č ř ž ý á í é stand on the number row, the digits come with Shift, and Shift on those keys never " +
      "gives the capital. Capital Č Š Ř Ž Á É Í Ý Ě come from the háček or čárka dead key (right of the = key; háček " +
      "is Shift + the same key), then Shift and the letter - or with Caps Lock. ď ť ň are háček + d, t or n, ó is " +
      "čárka + o. Capital Ů only works with Caps Lock.",
  },
  rows: ISO_ROWS(
    [";", "+", "ě", "š", "č", "ř", "ž", "ý", "á", "í", "é", "=", "´"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "ú", ")"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ů", "§", "¨"],
    ["\\", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  bottomLabelsMac: ["Ctrl", "Option", "Option", "Ctrl"],
  access: {
    ...CS_ROW0_ACCESS,
    ...CS_UMSCHALT_ACCESS,
    // AltGr (Windows „Čeština (QWERTY)", R1 §2.2): die US-Zeichen auf den Zifferntasten. `~ { } _ + :` liegen auf
    // Umschalt + AltGr (`KeyMod` kennt das nicht): nicht geführt, kein Lernziel.
    "@": { base: "ě", mod: "altgr" }, "#": { base: "š", mod: "altgr" }, "$": { base: "č", mod: "altgr" },
    "&": { base: "ý", mod: "altgr" }, "^": { base: "ž", mod: "altgr" }, "*": { base: "á", mod: "altgr" },
    "€": { base: "e", mod: "altgr" }, "[": { base: "ú", mod: "altgr" }, "]": { base: ")", mod: "altgr" },
    "<": { base: ",", mod: "altgr" }, ">": { base: ".", mod: "altgr" },
  },
  accessMac: CS_ACCESS_MAC,
  missing: CS_FEHLT,
  ersatz: CS_ERSATZ,
  capsUpper: [],
  grossFehlt: CS_GROSS_FEHLT,
  hinweis:
    "Die tschechische QWERTY-Tastatur hat y und z wie die englische, sonst ist sie die tschechische: ě š č ř ž ý " +
    "á í é stehen in der Zahlenreihe, die Ziffern kommen mit Umschalt, und Umschalt auf diesen Tasten gibt nie den " +
    "Großbuchstaben. Große Č Š Ř Ž Á É Í Ý Ě tippst du mit der Totaste (rechts neben der Taste =: Čárka ´, mit " +
    "Umschalt Háček ˇ), dann Umschalt und den Buchstaben - oder mit der Feststelltaste. ď ť ň sind Háček + d, t " +
    "oder n, ó ist Čárka + o. Das große Ů gibt es nur mit der Feststelltaste.",
};

// --- Die bulgarischen Tastaturen (★★★ G3b, 25.10.2026) -----------------------
//
// ★★★ G3b (25.10.2026, Bauplan `BAUPLAN-2026-10-25-BG.md` §1 D9, §2; Recherche `recherche-bg/tastaturen-und-zeichen.md`
// §3, §6): VIER Tastaturen - die erste nicht-lateinische Schrift in Tastenflow.
//  · `bg`           = Windows „Bulgarian" (KBDBULG, KLID 00030402), die BDS-Norm 2006 und Windows-Vorgabe für bg-BG (Bezug).
//  · `bg-schreibm`  = Windows „Bulgarian (Typewriter)" (KBDBU, 00000402): dieselben Buchstaben, andere Satzzeichen, kein ѝ.
//  · `bg-phon`      = Windows „Bulgarian (Phonetic)" (KBDBGPH, 00020402): die Buchstaben auf den Plätzen der lateinischen
//                     Laute (а auf A, с auf S ...), Satzzeichen wie auf der US-Tastatur.
//  · `bg-phon-trad` = Windows „Bulgarian (Phonetic Traditional)" (KBDBGPH1, 00040402): die ältere phonetische Belegung.
// Quelle: die Windows-Tabellen (`pruefstand/werkzeug-totasten/dll-tabellen-windows-2026-10-25.txt`) UND die Edge-Messung
// desselben Tages (`messung-edge-2026-10-25-teil.md`): ★ GEMESSEN in Edge 156 (Grund, Umschalt, AltGr, Feststell). Die
// Messung weicht an GENAU einer Stelle von der Tabelle ab, und sie gilt: Feststell + ь gibt in Edge „Ь" (die Tabelle sagt
// „ь"). Darum steht `ь` in `capsUpper` (das grosse Ь entsteht nur mit der Feststelltaste) statt in `grossFehlt` (Bauplan B3
// nahm die Tabelle). Chrome und Firefox: ungemessen. Mac: ungemessen (kein `accessMac`, kein `bottomLabelsMac`).
//
// ★ KEIN ERSATZ für Buchstaben (Falle 36). Ersatz nur für Typografie, die dasselbe Wort lässt (Bauplan B6/B7): `…` ⇒ `...`,
// Geviert ⇒ Halbgeviert (wo es den gibt), `« » ”` ⇒ die bulgarischen `„ “` (wo es sie gibt) bzw. das gerade `"`.
// ⚠️ `missing` vergleicht klein: KEINEN bulgarischen Buchstaben eintragen - Ausnahme `ѝ` auf der Schreibmaschine (Bauplan B4:
// dort gar nicht servieren). Lateinische Buchstaben stehen NICHT in `missing` (sie sind auf keiner bulgarischen Belegung
// tippbar; ein lateinisches Wort in einem bulgarischen Text fängt der Text-Wächter der Etappe Texte, nicht `missing`).
//
// ★ Umschalt + Q gibt auf BDS und Schreibmaschine „ы", Umschalt + `-` auf der Schreibmaschine „І" und Umschalt + `.` dort ein
// lateinisches „V" - so steht es in der Tabelle (und in `access`), kein Lernziel (Bauplan B5).

/** Die Typografie, die auf keiner bulgarischen Belegung liegt (Halb- und Geviertstrich als Zeichencode, Strich-Wächter). */
const BG_GEMEINSAM_FEHLT: readonly string[] = ["…", "«", "»", "‚", "‘", "’", "”", "·", GEVIERT];

/** Das schmale und das geschützte Leerzeichen sind für das Kind ein gewöhnliches (wie `PL_ERSATZ`). */
const LEERZEICHEN_ERSATZ: Readonly<Record<string, string>> = { " ": " ", " ": " " };

/**
 * Bulgarien - Windows „Bulgarian" (BDS-2006). ISO. Grundreihe `ь я а о ж г т н в м ч „`: Heimtasten `ь я а о | т н в м`.
 * Das Komma liegt auf Q, der Punkt ganz rechts in der Zahlenreihe; ѝ auf der Taste links von ю (Umschalt: Ѝ) und auf
 * Umschalt + ь.
 */
const BG: KeyboardLayout = {
  id: "bg",
  label: "Bulgarisch (BDS)",
  kurz: "bulgarische Tastatur",
  sprache: "bg",
  heimtasten: ["ь", "я", "а", "о", "т", "н", "в", "м"],
  ziffernblockKomma: true,
  // Umschalt + ь gibt ѝ (nicht Ь): die Kappe bleibt klein (Falle 15).
  kleineKappen: ["ь"],
  en: {
    label: "Bulgarian (BDS)",
    kurz: "Bulgarian keyboard",
    hinweis:
      "On the Bulgarian BDS keyboard the home row is ь я а о ж г т н в м ч. The comma is on the key where Q is on an English " +
      "keyboard, the full stop at the far right of the number row; the digits need no Shift. ѝ is left of ю (with Shift: Ѝ) " +
      "and also Shift + ь. Capital Ь only comes with Caps Lock.",
  },
  rows: ISO_ROWS(
    ["(", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "."],
    [",", "у", "е", "и", "ш", "щ", "к", "с", "д", "з", "ц", ";"],
    ["ь", "я", "а", "о", "ж", "г", "т", "н", "в", "м", "ч", "„"],
    ["ѝ", "ю", "й", "ъ", "э", "ф", "х", "п", "р", "л", "б"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt", "Ctrl"],
  access: {
    ")": { base: "(", mod: "shift" }, "!": { base: "1", mod: "shift" }, "?": { base: "2", mod: "shift" },
    "+": { base: "3", mod: "shift" }, "\"": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "=": { base: "6", mod: "shift" }, ":": { base: "7", mod: "shift" }, "/": { base: "8", mod: "shift" },
    [HALBGEVIERT]: { base: "9", mod: "shift" }, "№": { base: "0", mod: "shift" }, "$": { base: "-", mod: "shift" },
    "€": { base: ".", mod: "shift" }, "ы": { base: ",", mod: "shift" }, "§": { base: ";", mod: "shift" },
    "“": { base: "„", mod: "shift" },
  },
  missing: [
    ...BG_GEMEINSAM_FEHLT,
    "@", "#", "&", "*", "_", "[", "]", "{", "}", "|", "\\", "~", "`", "^", "<", ">", "'",
  ],
  ersatz: { "…": "...", [GEVIERT]: HALBGEVIERT, "«": "„", "»": "“", "”": "“", ...LEERZEICHEN_ERSATZ },
  // ★ GEMESSEN (Edge 25.10.2026): Feststell + ь = Ь (Tabelle: ь). Umschalt gibt dort ѝ.
  capsUpper: ["ь"],
  grossFehlt: [],
  hinweis:
    "Auf der bulgarischen BDS-Tastatur ist die Grundreihe ь я а о ж г т н в м ч. Das Komma liegt auf der Taste, wo auf " +
    "der englischen Tastatur Q ist, der Punkt ganz rechts in der Zahlenreihe; die Ziffern brauchen keine Umschalttaste. ѝ " +
    "liegt links neben ю (mit Umschalt Ѝ) und auf Umschalt + ь. Das große Ь gibt es nur mit der Feststelltaste.",
};

/**
 * Bulgarien - Windows „Bulgarian (Typewriter)". Dieselben Buchstaben wie {@link BG}; links der 1 „`", am Ende der Grundreihe
 * die Klammer, links von ю „\". KEIN ѝ (Bauplan B4: Zeilen mit ѝ werden nicht serviert), kein €, kein Halbgeviert, keine
 * `„ “`. Umschalt + ь gibt hier das grosse Ь.
 */
const BG_SCHREIBM: KeyboardLayout = {
  id: "bg-schreibm",
  label: "Bulgarisch (Schreibmaschine)",
  kurz: "bulgarische Schreibmaschinen-Tastatur",
  sprache: "bg",
  heimtasten: ["ь", "я", "а", "о", "т", "н", "в", "м"],
  ziffernblockKomma: true,
  en: {
    label: "Bulgarian (typewriter)",
    kurz: "Bulgarian typewriter keyboard",
    hinweis:
      "The Bulgarian typewriter keyboard has the letters of the BDS keyboard (home row ь я а о ж г т н в м), the comma on " +
      "the Q key and the full stop at the far right of the number row. It has no ѝ, no euro sign and no Bulgarian " +
      "quotation marks: lines with them are not offered.",
  },
  rows: ISO_ROWS(
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "."],
    [",", "у", "е", "и", "ш", "щ", "к", "с", "д", "з", "ц", ";"],
    ["ь", "я", "а", "о", "ж", "г", "т", "н", "в", "м", "ч", "("],
    ["\\", "ю", "й", "ъ", "э", "ф", "х", "п", "р", "л", "б"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt", "Ctrl"],
  access: {
    "~": { base: "`", mod: "shift" }, "!": { base: "1", mod: "shift" }, "?": { base: "2", mod: "shift" },
    "+": { base: "3", mod: "shift" }, "\"": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "=": { base: "6", mod: "shift" }, ":": { base: "7", mod: "shift" }, "/": { base: "8", mod: "shift" },
    "_": { base: "9", mod: "shift" }, "№": { base: "0", mod: "shift" }, "І": { base: "-", mod: "shift" },
    "V": { base: ".", mod: "shift" }, "ы": { base: ",", mod: "shift" }, "§": { base: ";", mod: "shift" },
    ")": { base: "(", mod: "shift" }, "|": { base: "\\", mod: "shift" },
  },
  missing: [
    ...BG_GEMEINSAM_FEHLT,
    "ѝ", "€", "„", "“", HALBGEVIERT,
    "@", "#", "&", "*", "[", "]", "{", "}", "^", "<", ">", "'",
  ],
  // Bauplan B6: Halb- und Geviertstrich NICHT ersetzen (der Bindestrich lehrte eine andere Typografie) - die Zeile kommt nicht.
  ersatz: { "…": "...", "„": "\"", "“": "\"", "«": "\"", "»": "\"", "”": "\"", ...LEERZEICHEN_ERSATZ },
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Die bulgarische Schreibmaschinen-Tastatur hat die Buchstaben der BDS-Tastatur (Grundreihe ь я а о ж г т н в м), das " +
    "Komma auf der Taste Q und den Punkt ganz rechts in der Zahlenreihe. ѝ, das Euro-Zeichen und die bulgarischen " +
    "Anführungszeichen gibt es auf ihr nicht: Zeilen damit kommen nicht.",
};

/**
 * Bulgarien - Windows „Bulgarian (Phonetic)". Die Buchstaben liegen auf den Plätzen ihrer lateinischen Laute: Grundreihe
 * `а с д ф г х й к л ; '` (Heimtasten `а с д ф | й к л ;`), ь rechts aussen (Umschalt: ѝ), ѝ zusätzlich links von з.
 */
const BG_PHON: KeyboardLayout = {
  id: "bg-phon",
  label: "Bulgarisch (phonetisch)",
  kurz: "bulgarische phonetische Tastatur",
  sprache: "bg",
  heimtasten: ["а", "с", "д", "ф", "й", "к", "л", ";"],
  ziffernblockKomma: true,
  kleineKappen: ["ь"],
  en: {
    label: "Bulgarian (phonetic)",
    kurz: "Bulgarian phonetic keyboard",
    hinweis:
      "On the Bulgarian phonetic keyboard the letters sit where their Latin sounds are: а on A, с on S, д on D, ф on F and so " +
      "on; ч is on Q, ш on W, я and щ right of п. Comma, full stop and the other punctuation are where they are on the " +
      "English keyboard. Capital Ь only comes with Caps Lock.",
  },
  rows: ISO_ROWS(
    ["ю", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["ч", "ш", "е", "р", "т", "ъ", "у", "и", "о", "п", "я", "щ"],
    ["а", "с", "д", "ф", "г", "х", "й", "к", "л", ";", "'", "ь"],
    ["ѝ", "з", "ж", "ц", "в", "б", "н", "м", ",", ".", "/"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt", "Ctrl"],
  access: {
    "!": { base: "1", mod: "shift" }, "@": { base: "2", mod: "shift" }, "№": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "€": { base: "6", mod: "shift" },
    "§": { base: "7", mod: "shift" }, "*": { base: "8", mod: "shift" }, "(": { base: "9", mod: "shift" },
    ")": { base: "0", mod: "shift" }, [HALBGEVIERT]: { base: "-", mod: "shift" }, "+": { base: "=", mod: "shift" },
    ":": { base: ";", mod: "shift" }, "\"": { base: "'", mod: "shift" }, "„": { base: ",", mod: "shift" },
    "“": { base: ".", mod: "shift" }, "?": { base: "/", mod: "shift" },
  },
  missing: [
    ...BG_GEMEINSAM_FEHLT,
    "ы", "э", "#", "&", "_", "[", "]", "{", "}", "|", "\\", "~", "`", "^", "<", ">",
  ],
  ersatz: { "…": "...", [GEVIERT]: HALBGEVIERT, "«": "„", "»": "“", "”": "“", ...LEERZEICHEN_ERSATZ },
  // ★ GEMESSEN (Edge 25.10.2026): Feststell + ь = Ь (Tabelle: ь).
  capsUpper: ["ь"],
  grossFehlt: [],
  hinweis:
    "Auf der bulgarischen phonetischen Tastatur liegen die Buchstaben dort, wo ihr lateinischer Laut liegt: а auf A, с auf " +
    "S, д auf D, ф auf F und so weiter; ч liegt auf Q, ш auf W, я und щ rechts neben п. Komma, Punkt und die übrigen " +
    "Satzzeichen liegen wie auf der englischen Tastatur. Das große Ь gibt es nur mit der Feststelltaste.",
};

/**
 * Bulgarien - Windows „Bulgarian (Phonetic Traditional)". Wie {@link BG_PHON} in der Grundreihe, aber я auf Q, в auf W, ч
 * links der 1, ю zweimal (rechts aussen in der Grundreihe UND links von з), ь auf X (Umschalt: ѝ). KEIN grosses Ѝ (nur
 * Feststell + Umschalt + X, gemessen - kein Weg der Lehre), kein Halbgeviert, keine `„ “`.
 */
const BG_PHON_TRAD: KeyboardLayout = {
  id: "bg-phon-trad",
  label: "Bulgarisch (phonetisch, traditionell)",
  kurz: "traditionelle bulgarische phonetische Tastatur",
  sprache: "bg",
  heimtasten: ["а", "с", "д", "ф", "й", "к", "л", ";"],
  ziffernblockKomma: true,
  kleineKappen: ["ь"],
  en: {
    label: "Bulgarian (phonetic, traditional)",
    kurz: "traditional Bulgarian phonetic keyboard",
    hinweis:
      "The traditional Bulgarian phonetic keyboard has the home row а с д ф г х й к л like the newer phonetic one, but я is " +
      "on Q, в on W, ч left of 1 and ь on X (with Shift: ѝ). It has no dash and no Bulgarian quotation marks: lines with " +
      "them are not offered. Capital Ь only comes with Caps Lock.",
  },
  rows: ISO_ROWS(
    ["ч", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["я", "в", "е", "р", "т", "ъ", "у", "и", "о", "п", "ш", "щ"],
    ["а", "с", "д", "ф", "г", "х", "й", "к", "л", ";", "'", "ю"],
    ["ю", "з", "ь", "ц", "ж", "б", "н", "м", ",", ".", "/"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "!": { base: "1", mod: "shift" }, "@": { base: "2", mod: "shift" }, "№": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "€": { base: "6", mod: "shift" },
    "§": { base: "7", mod: "shift" }, "*": { base: "8", mod: "shift" }, "(": { base: "9", mod: "shift" },
    ")": { base: "0", mod: "shift" }, "_": { base: "-", mod: "shift" }, "+": { base: "=", mod: "shift" },
    ":": { base: ";", mod: "shift" }, "\"": { base: "'", mod: "shift" }, "ѝ": { base: "ь", mod: "shift" },
    "<": { base: ",", mod: "shift" }, ">": { base: ".", mod: "shift" }, "?": { base: "/", mod: "shift" },
  },
  missing: [
    ...BG_GEMEINSAM_FEHLT,
    "„", "“", HALBGEVIERT, "ы", "э", "#", "&", "[", "]", "{", "}", "|", "\\", "~", "`", "^",
  ],
  // Bauplan B6: Striche nicht ersetzen (die Zeile kommt nicht); Anführungszeichen ⇒ das gerade `"` (Umschalt + ').
  ersatz: { "…": "...", "„": "\"", "“": "\"", "«": "\"", "»": "\"", "”": "\"", ...LEERZEICHEN_ERSATZ },
  // ★ GEMESSEN (Edge 25.10.2026): Feststell + ь = Ь (Tabelle: ь).
  capsUpper: ["ь"],
  // Ѝ: Umschalt + ь gibt ѝ, das grosse Ѝ nur Feststell + Umschalt + X (gemessen) - kein Weg der Lehre.
  grossFehlt: ["Ѝ"],
  hinweis:
    "Die traditionelle bulgarische phonetische Tastatur hat wie die neuere die Grundreihe а с д ф г х й к л, aber я liegt " +
    "auf Q, в auf W, ч links neben der 1 und ь auf X (mit Umschalt ѝ). Gedankenstrich und bulgarische Anführungszeichen " +
    "gibt es auf ihr nicht: Zeilen damit kommen nicht. Das große Ь gibt es nur mit der Feststelltaste.",
};

// --- Die griechischen Tastaturen (★★★ G3b, 25.10.2026) ----------------------
//
// ★★★ G3b (25.10.2026, Bauplan `BAUPLAN-2026-10-25-EL.md` §1 D9, E1-E3, §2, §5; Recherche `recherche-el/tastaturen-und-zeichen.md`
// §2, §6, §7): DREI Tastaturen, gleiche Buchstaben (die Lage der lateinischen Laute: α auf A, β auf B …), andere Satzzeichen.
//  · `el`     = Windows „Greek" (KBDHE, KLID 00000408) - Bezug für Griechenland UND Zypern.
//  · `el-220` = Windows „Greek (220)" (KBDHE220, 00010408): `;` (U+037E, griechisches Fragezeichen) auf Q, Dialytika auch auf der
//               Taste rechts von ΄, `'` und `-` anders.
//  · `el-319` = Windows „Greek (319)" (KBDHE319, 00020408): `·` (Ano Teleia) auf Q, `’ ‘` auf der Taste rechts von ΄, das
//               Fragezeichen `;` nur mit Umschalt + Komma; kein `? @ # & ^ ~ { } < > \ |`.
// ★ GEMESSEN in Edge 156 (25.10.2026) - Grund, Umschalt, AltGr, Feststell: deckungsgleich mit der Windows-Tabelle. Chrome und
// Firefox: ungemessen. Mac „Greek": ungemessen (kein `accessMac`).
//
// ★ TOTASTEN (Lehrgang, Bauplan E2): der Tonos `΄` (U+0384, NICHT `´` U+00B4) liegt OHNE Umschalt auf der Taste rechts von λ
// (die achte Heimtaste, rechter kleiner Finger): `΄` dann α ⇒ ά (ά έ ή ί ό ύ ώ und gross Ά Έ Ή Ί Ό Ύ Ώ - Totaste, dann Umschalt +
// Vokal). Umschalt + dieselbe Taste: Dialytika `¨` (ϊ ϋ Ϊ Ϋ); `΅` (Dialytika + Tonos, ΐ ΰ) auf Umschalt + ς (el), sonst AltGr + ΄.
// ⚠️ Die eigene Kombizeichen-Liste der Tonos-Buchstaben (`΄` + α = ά) und der kombinierende Akut (U+0301) in `anschlagDeuten`
// gehören der Etappe G3a (`totasten.ts`, `anschlagDeuten.ts`) - bis dahin kennt `kombizeichenZu` die griechischen Zeichen nicht.
//
// ★ ς (Schlusssigma) liegt auf W; Umschalt + ς gibt NICHT Σ, sondern die Totaste ΅ (el) bzw. ~ (220) bzw. ¦ (319) - die Kappe bleibt
// klein (`kleineKappen`). Feststell lässt ς ς (Tabelle und Edge). Das grosse Σ ist Umschalt + σ.
//
// ★ KEIN ERSATZ für Buchstaben oder Akzente (Falle 36: πού/που, πώς/πως, ή/η sind verschiedene Wörter). Ersatz nur für Typografie,
// die dasselbe Wort lässt: “ ” „ ⇒ ", ‘ ’ ⇒ ' (wo sie fehlen), … ⇒ ..., Halb- und Geviertstrich ⇒ -. Die Ano Teleia `·` hat auf
// `el` und `el-220` keine Taste und KEINEN Ersatz (ein `;` oder `.` wäre ein anderes Satzzeichen): Zeilen damit kommen dort nicht.

/**
 * ★ G3b: das griechische Fragezeichen U+037E (Taste Q auf „Greek (220)", gemessen in Edge). Als Zeichencode, nicht als Zeichen im
 * Quelltext: es hat eine kanonische Zerlegung - jedes Werkzeug, das den Quelltext nach NFC normalisiert, machte daraus „;" (U+003B).
 */
export const GRIECHISCHES_FRAGEZEICHEN = String.fromCharCode(0x037e);

const EL_FEHLT: readonly string[] = ["“", "”", "„", "‘", "’", "‚", "…", HALBGEVIERT, GEVIERT, "·"];
const EL_ERSATZ: Readonly<Record<string, string>> = {
  "“": "\"", "”": "\"", "„": "\"", "‘": "'", "’": "'", "‚": "'", "…": "...", [HALBGEVIERT]: "-", [GEVIERT]: "-",
  ...LEERZEICHEN_ERSATZ,
};

/** Die Grundreihe aller drei: `α σ δ φ γ η ξ κ λ ΄ …` - Heimtasten `α σ δ φ | ξ κ λ ΄` (Tastmarken auf φ und ξ). */
const EL_HEIMTASTEN: readonly [string, string, string, string, string, string, string, string] = ["α", "σ", "δ", "φ", "ξ", "κ", "λ", "΄"];

/**
 * Griechenland und Zypern - Windows „Greek". ISO. Q = `;` (das Fragezeichen), W = ς, rechts von λ die Tonos-Totaste.
 */
const EL: KeyboardLayout = {
  id: "el",
  label: "Griechisch",
  kurz: "griechische Tastatur",
  sprache: "el",
  heimtasten: EL_HEIMTASTEN,
  lehrgangsTotasten: true,
  zweiSchrittZeigen: true,
  ziffernblockKomma: true,
  kleineKappen: ["ς"],
  en: {
    label: "Greek",
    kurz: "Greek keyboard",
    hinweis:
      "On the Greek keyboard the letters sit where their Latin sounds are: α on A, β on B and so on. The final sigma ς is on " +
      "W, the question mark ; on Q. The tonos ΄ is a dead key right of λ: first the tonos, then the vowel (ά). With Shift the " +
      "same key gives the dialytika ¨ (ϊ). For a capital with tonos: tonos, then Shift and the vowel (Ά).",
  },
  rows: ISO_ROWS(
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    [";", "ς", "ε", "ρ", "τ", "υ", "θ", "ι", "ο", "π", "[", "]"],
    ["α", "σ", "δ", "φ", "γ", "η", "ξ", "κ", "λ", "΄", "'", "\\"],
    ["<", "ζ", "χ", "ψ", "ω", "β", "ν", "μ", ",", ".", "/"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "΄": { base: "΄", dead: true }, "~": { base: "`", mod: "shift" }, "!": { base: "1", mod: "shift" },
    "@": { base: "2", mod: "shift" }, "#": { base: "3", mod: "shift" }, "$": { base: "4", mod: "shift" },
    "%": { base: "5", mod: "shift" }, "^": { base: "6", mod: "shift" }, "&": { base: "7", mod: "shift" },
    "*": { base: "8", mod: "shift" }, "(": { base: "9", mod: "shift" }, ")": { base: "0", mod: "shift" },
    "_": { base: "-", mod: "shift" }, "+": { base: "=", mod: "shift" }, ":": { base: ";", mod: "shift" },
    "΅": { base: "ς", mod: "shift", dead: true }, "{": { base: "[", mod: "shift" }, "}": { base: "]", mod: "shift" },
    "¨": { base: "΄", mod: "shift", dead: true }, "\"": { base: "'", mod: "shift" }, "|": { base: "\\", mod: "shift" },
    ">": { base: "<", mod: "shift" }, "?": { base: "/", mod: "shift" },
    "€": { base: "ε", mod: "altgr" }, "«": { base: "[", mod: "altgr" }, "»": { base: "]", mod: "altgr" },
  },
  missing: EL_FEHLT,
  ersatz: EL_ERSATZ,
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der griechischen Tastatur liegen die Buchstaben dort, wo ihr lateinischer Laut liegt: α auf A, β auf B und so " +
    "weiter. Das Schlusssigma ς liegt auf W, das Fragezeichen ; auf Q. Der Tonos ΄ ist eine Totaste rechts neben λ: erst " +
    "den Tonos, dann den Selbstlaut (ά). Mit Umschalt gibt dieselbe Taste die Dialytika ¨ (ϊ). Großbuchstabe mit Tonos: " +
    "Tonos, dann Umschalt und den Selbstlaut (Ά).",
};

/**
 * Griechenland - Windows „Greek (220)". Q = `;` (U+037E, das griechische Fragezeichen - in Texten nach NFC dasselbe wie `;`), die
 * Dialytika-Totaste ¨ zusätzlich rechts neben ΄, `'` und `?` rechts der 0, `-` unten rechts.
 */
const EL_220: KeyboardLayout = {
  id: "el-220",
  label: "Griechisch (220)",
  kurz: "griechische Tastatur 220",
  sprache: "el",
  heimtasten: EL_HEIMTASTEN,
  lehrgangsTotasten: true,
  zweiSchrittZeigen: true,
  ziffernblockKomma: true,
  kleineKappen: ["ς"],
  en: {
    label: "Greek (220)",
    kurz: "Greek 220 keyboard",
    hinweis:
      "The Greek 220 keyboard has the letters of the Greek keyboard (α on A, ς on W) and the tonos dead key ΄ right of λ. The " +
      "dialytika ¨ has its own dead key right of it; the apostrophe is right of 0, the hyphen at the bottom right, the " +
      "question mark ; on Q.",
  },
  rows: ISO_ROWS(
    ["½", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "]"],
    [GRIECHISCHES_FRAGEZEICHEN, "ς", "ε", "ρ", "τ", "υ", "θ", "ι", "ο", "π", "+", "}"],
    ["α", "σ", "δ", "φ", "γ", "η", "ξ", "κ", "λ", "΄", "¨", "#"],
    ["<", "ζ", "χ", "ψ", "ω", "β", "ν", "μ", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "΄": { base: "΄", dead: true }, "¨": { base: "¨", dead: true }, "±": { base: "½", mod: "shift" },
    "!": { base: "1", mod: "shift" }, "\"": { base: "2", mod: "shift" }, "£": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "&": { base: "6", mod: "shift" },
    "/": { base: "7", mod: "shift" }, "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "=": { base: "0", mod: "shift" }, "?": { base: "'", mod: "shift" }, "[": { base: "]", mod: "shift" },
    ":": { base: GRIECHISCHES_FRAGEZEICHEN, mod: "shift" }, "~": { base: "ς", mod: "shift" }, "*": { base: "+", mod: "shift" },
    "{": { base: "}", mod: "shift" }, "΅": { base: "¨", mod: "shift", dead: true }, "@": { base: "#", mod: "shift" },
    ">": { base: "<", mod: "shift" }, ";": { base: ",", mod: "shift" }, "_": { base: "-", mod: "shift" },
    "€": { base: "ε", mod: "altgr" }, "«": { base: "+", mod: "altgr" }, "»": { base: "}", mod: "altgr" },
  },
  missing: EL_FEHLT,
  ersatz: EL_ERSATZ,
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Die griechische Tastatur 220 hat die Buchstaben der griechischen Tastatur (α auf A, ς auf W) und die Tonos-Totaste ΄ " +
    "rechts neben λ. Die Dialytika ¨ hat rechts daneben eine eigene Totaste; der Apostroph liegt rechts neben der 0, der " +
    "Bindestrich unten rechts, das Fragezeichen ; auf Q.",
};

/**
 * Griechenland - Windows „Greek (319)". Q = `·` (Ano Teleia), rechts von ΄ die Taste `’` (Umschalt `‘`), das Fragezeichen `;` nur
 * Umschalt + Komma. Feststell + ς gibt `¦`, Feststell + Q `―` (Tabelle, Bauplan §5 Falle 9: nie als Kinderfehler werten).
 */
const EL_319: KeyboardLayout = {
  id: "el-319",
  label: "Griechisch (319)",
  kurz: "griechische Tastatur 319",
  sprache: "el",
  heimtasten: EL_HEIMTASTEN,
  lehrgangsTotasten: true,
  zweiSchrittZeigen: true,
  ziffernblockKomma: true,
  kleineKappen: ["ς"],
  en: {
    label: "Greek (319)",
    kurz: "Greek 319 keyboard",
    hinweis:
      "The Greek 319 keyboard has the letters of the Greek keyboard (α on A, ς on W) and the tonos dead key ΄ right of λ. The " +
      "ano teleia · is on Q, the question mark ; is Shift + comma, the typographic apostrophe ’ is right of the tonos key. It " +
      "has no @, #, &, braces or angle brackets.",
  },
  rows: ISO_ROWS(
    ["½", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "+"],
    ["·", "ς", "ε", "ρ", "τ", "υ", "θ", "ι", "ο", "π", "[", "]"],
    ["α", "σ", "δ", "φ", "γ", "η", "ξ", "κ", "λ", "΄", "’", "²"],
    ["§", "ζ", "χ", "ψ", "ω", "β", "ν", "μ", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "΄": { base: "΄", dead: true }, "±": { base: "½", mod: "shift" }, "!": { base: "1", mod: "shift" },
    "\"": { base: "2", mod: "shift" }, "£": { base: "3", mod: "shift" }, "$": { base: "4", mod: "shift" },
    "%": { base: "5", mod: "shift" }, "¬": { base: "6", mod: "shift" }, "/": { base: "7", mod: "shift" },
    "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" }, "=": { base: "0", mod: "shift" },
    "°": { base: "'", mod: "shift" }, "*": { base: "+", mod: "shift" }, "―": { base: "·", mod: "shift" },
    "¦": { base: "ς", mod: "shift" }, "«": { base: "[", mod: "shift" }, "»": { base: "]", mod: "shift" },
    "¨": { base: "΄", mod: "shift", dead: true }, "‘": { base: "’", mod: "shift" }, "³": { base: "²", mod: "shift" },
    "©": { base: "§", mod: "shift" }, ";": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" },
    "_": { base: "-", mod: "shift" }, "€": { base: "ε", mod: "altgr" },
    // ΅ (für ΐ ΰ) gibt es auf 319 nur mit AltGr + ΄.
    "΅": { base: "΄", mod: "altgr", dead: true },
  },
  missing: [
    "“", "”", "„", "‚", "…", HALBGEVIERT, GEVIERT,
    "?", "@", "#", "&", "^", "~", "{", "}", "<", ">", "\\", "|", "`",
  ],
  ersatz: { "“": "\"", "”": "\"", "„": "\"", "…": "...", [HALBGEVIERT]: "-", [GEVIERT]: "-", ...LEERZEICHEN_ERSATZ },
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Die griechische Tastatur 319 hat die Buchstaben der griechischen Tastatur (α auf A, ς auf W) und die Tonos-Totaste ΄ " +
    "rechts neben λ. Die Ano Teleia · liegt auf Q, das Fragezeichen ; ist Umschalt + Komma, der typografische Apostroph ’ " +
    "liegt rechts neben der Tonos-Taste. @, #, &, geschweifte und spitze Klammern gibt es auf ihr nicht.",
};

// --- Die ungarischen Tastaturen (★★★ G3b, 25.10.2026) -----------------------
//
// ★★★ G3b (25.10.2026, Bauplan `BAUPLAN-2026-10-25-HU.md` §1 D9, H1-H9, §2; Recherche `recherche-hu/tastaturen-und-zeichen.md`
// §2, §5, §6; Rezept F3.3 „Durchgerechnet: Ungarisch"): ZWEI Tastaturen.
//  · `hu`     = Windows „Hungarian" (KBDHU, KLID 0000040E), 105 Tasten, QWERTZ - Bezug („virtually everyone uses QWERTZ").
//  · `hu-101` = Windows „Hungarian 101-key" (KBDHU1, 0001040E), QWERTY, ANSI (keine Taste links von Z): links der 1 liegt í,
//               die 0 ist AltGr + í; KEINE Totasten (die Zeichen auf AltGr + Ziffer sind gewöhnliche Zeichen).
// ★ GEMESSEN in Edge 156 (25.10.2026): deckungsgleich mit der Windows-Tabelle. Chrome, Firefox, Mac: ungemessen.
//
// ★ Die 0 liegt auf `hu` LINKS von der 1 (dort, wo auf der deutschen Tastatur ^ ist); auf dem gewohnten 0-Platz liegt ö. Alle neun
// Akzentbuchstaben `á é í ó ö ő ú ü ű` haben eigene Tasten - KEINE Totaste im Lehrgang (H2, H8). Grossformen mit Umschalt UND
// Feststell (`capsUpper` leer, `grossFehlt` leer, H3).
// ★ Zehn Totasten auf AltGr + Ziffer (ˇ ^ ˘ ° ˛ ˙ ´ ˝ ¨ ¸): geführt sind nur `^` und `°` (Zeichen im Text, kein Lernziel, wie cs);
// die übrigen stehen nicht in `access` - ein versehentliches `Dead` meldet die Anschlag-Prüfung freundlich (H8, Etappe G3a/F4).
// ★ `<` liegt doppelt (AltGr + í und AltGr + M), `>` doppelt (AltGr + y und AltGr + .): geführt die Taste mit dem Aufdruck
// (Rezept F3.3); `\` doppelt auf hu-101 (AltGr + Q und AltGr + ű): AltGr + Q wie auf `hu`.
// ★ KEIN ERSATZ für Akzente (H4: kör/kor, hát/hat, kérek/kerek). `õ û` (Latin-1-Falle H5) gibt es nicht: missing ohne Ersatz.

const HU_FEHLT: readonly string[] = ["„", "”", "“", "»", "«", "‚", "‘", "’", "…", HALBGEVIERT, GEVIERT, "õ", "û"];
const HU_ERSATZ: Readonly<Record<string, string>> = {
  "„": "\"", "”": "\"", "“": "\"", "»": "\"", "«": "\"", "…": "...", [HALBGEVIERT]: "-", [GEVIERT]: "-",
  "‚": "'", "‘": "'", "’": "'",
  ...LEERZEICHEN_ERSATZ,
};

/** Die AltGr-Ebene, die beide ungarischen Belegungen gleich haben (Windows-Tabelle). */
const HU_ALTGR: Record<string, KeyAccess> = {
  "~": { base: "1", mod: "altgr" }, "`": { base: "7", mod: "altgr" }, "\\": { base: "q", mod: "altgr" },
  "|": { base: "w", mod: "altgr" }, "€": { base: "u", mod: "altgr" }, "[": { base: "f", mod: "altgr" },
  "]": { base: "g", mod: "altgr" }, "$": { base: "é", mod: "altgr" }, "#": { base: "x", mod: "altgr" },
  "&": { base: "c", mod: "altgr" }, "@": { base: "v", mod: "altgr" }, "{": { base: "b", mod: "altgr" },
  "}": { base: "n", mod: "altgr" }, ";": { base: ",", mod: "altgr" }, "*": { base: "-", mod: "altgr" },
};

/** Umschalt-Ebene der Zahlenreihe und der Satzzeichen - auf beiden gleich (ausser der Taste links der 1). */
const HU_UMSCHALT: Record<string, KeyAccess> = {
  "'": { base: "1", mod: "shift" }, "\"": { base: "2", mod: "shift" }, "+": { base: "3", mod: "shift" },
  "!": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "/": { base: "6", mod: "shift" },
  "=": { base: "7", mod: "shift" }, "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
  "?": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" }, "_": { base: "-", mod: "shift" },
};

/**
 * Ungarn - Windows „Hungarian" (105 Tasten, QWERTZ). ISO. Zahlenreihe `0 1 … 9 ö ü ó`, Grundreihe `a s d f g h j k l é á ű`
 * (Heimtasten `a s d f | j k l é`), í links von y.
 */
const HU: KeyboardLayout = {
  id: "hu",
  label: "Ungarisch (QWERTZ)",
  kurz: "ungarische Tastatur",
  sprache: "hu",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "é"],
  ziffernblockKomma: true,
  en: {
    label: "Hungarian (QWERTZ)",
    kurz: "Hungarian keyboard",
    hinweis:
      "On the Hungarian keyboard 0 is left of 1; where 0 usually is, there is ö, then ü and ó. ő and ú are right of p, é á ű " +
      "right of l, í left of y. Every accented letter has its own key, with Shift its capital. ; @ € and the brackets come " +
      "with AltGr.",
  },
  rows: ISO_ROWS(
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "ö", "ü", "ó"],
    ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ő", "ú"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "é", "á", "ű"],
    ["í", "y", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "AltGr", "Ctrl"],
  access: {
    "§": { base: "0", mod: "shift" },
    ...HU_UMSCHALT,
    ...HU_ALTGR,
    "<": { base: "í", mod: "altgr" }, ">": { base: "y", mod: "altgr" },
    // Totasten (AltGr + 3, AltGr + 5): Zeichen im Text, kein Lernziel (wie cs `^`).
    "^": { base: "3", mod: "altgr", dead: true }, "°": { base: "5", mod: "altgr", dead: true },
  },
  missing: HU_FEHLT,
  ersatz: HU_ERSATZ,
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der ungarischen Tastatur liegt die 0 links neben der 1; wo sonst die 0 ist, liegt ö, danach ü und ó. ő und ú " +
    "liegen rechts neben p, é á ű rechts neben l, í links neben y. Jeder Akzentbuchstabe hat eine eigene Taste, mit " +
    "Umschalt seinen Großbuchstaben. ; @ € und die Klammern kommen mit AltGr.",
};

/**
 * Ungarn - Windows „Hungarian 101-key" (QWERTY). ANSI: links der 1 liegt í (die 0 ist AltGr + diese Taste), ű liegt über der
 * Eingabetaste, keine Taste links von z. Keine Totasten.
 */
const HU_101: KeyboardLayout = {
  id: "hu-101",
  label: "Ungarisch (QWERTY, 101 Tasten)",
  kurz: "ungarische QWERTY-Tastatur",
  sprache: "hu",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "é"],
  ziffernblockKomma: true,
  en: {
    label: "Hungarian (QWERTY, ANSI)",
    kurz: "Hungarian QWERTY keyboard",
    hinweis:
      "The Hungarian 101-key keyboard has y and z like the English keyboard. í is left of 1, the 0 is AltGr + that key; where " +
      "0 usually is, there is ö. ő and ú are right of p, ű above Enter, é and á right of l.",
  },
  rows: ANSI_ROWS(
    ["í", "1", "2", "3", "4", "5", "6", "7", "8", "9", "ö", "ü", "ó"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "ő", "ú", "ű"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "é", "á"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "AltGr", "Ctrl"],
  access: {
    ...HU_UMSCHALT,
    "0": { base: "í", mod: "altgr" },
    ...HU_ALTGR,
    "<": { base: "m", mod: "altgr" }, ">": { base: "z", mod: "altgr" },
    // Auf der 101-Tasten-Belegung sind diese AltGr-Zeichen GEWÖHNLICHE Zeichen (keine Totasten).
    "^": { base: "3", mod: "altgr" }, "°": { base: "5", mod: "altgr" },
  },
  missing: [...HU_FEHLT, "ô", "ç"],
  ersatz: HU_ERSATZ,
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Die ungarische Tastatur mit 101 Tasten hat y und z wie die englische. í liegt links neben der 1, die 0 ist AltGr + " +
    "diese Taste; wo sonst die 0 ist, liegt ö. ő und ú liegen rechts neben p, ű über der Eingabetaste, é und á rechts " +
    "neben l.",
};

// --- Die niederländischen Tastaturen (★★★ G3b, 25.10.2026) ------------------
//
// ★★★ G3b (25.10.2026, Bauplan `BAUPLAN-2026-10-25-NL.md` §1 D9, N3-N9, §2; Recherche `recherche-nl/tastaturen-und-zeichen.md`
// §2, §6, §7): Weg „nl" bietet DREI Tastaturen an - zwei neue und die bestehende belgische.
//  · `nl-intl`  = Windows „United States-International" (KBDUSX, KLID 00020409): die Windows-Vorgabe für nl-NL, Suriname und
//                 Caribisch Nederland (Bezug Niederlande). US-Grundebene, ANSI wie `us`; `'` und `"` (Taste rechts von ;) sind
//                 TOTASTEN, ebenso ` ~ ^ - jedes `'s`, `auto's` braucht Totaste + Leertaste (N3, N4).
//  · `be`       = die BESTEHENDE belgische Tastatur (Windows „Belgian (Period)", Bezug Flandern) - unverändert, nur zusätzlich
//                 in der Menge des Weges „nl" (sichtbar mit dem französischen ODER dem niederländischen Schalter).
//  · `nl-dutch` = Windows „Dutch" (KBDNE, 00000413), kaum verbreitet (Nebenweg): ISO, `'` und `"` direkt (Umschalt + 0 / 2),
//                 Totasten ¨ ´ (eigene Tasten) und ^ ` ~ (Umschalt).
// ★ `nl-intl` und `be` sind GEMESSEN (Edge 25.10.2026 US-International: deckungsgleich mit der Tabelle bis auf Umschalt + die
// Taste links von Z, die ANSI nicht hat); `nl-dutch` ungemessen in der Feststell-Spalte (Werkzeugfehler der Messung, LIESMICH),
// sonst gemessen. Mac: ungemessen.
//
// ★ é auf `nl-intl`: AltGr + E (ein Anschlag, `buchstabe`, Grossform AltGr + Umschalt + E) - ODER Totaste ' + e; das Modell
// lehrt AltGr + E, angenommen wird jedes richtig entstandene é (`anschlagDeuten`). ë ï nur über die Totaste " (Umschalt + ').
// ⚠️ Die Kombizeichen der Totasten ' und " (US-International: ' + e = é, " + e = ë) kennt `totasten.ts` noch nicht - Etappe G3a.
// ★ KEIN ERSATZ für é ë ï (N7: anderes Wort bzw. falsche Schreibung). Typografie ⇒ gerade Zeichen; die Ligatur ĳ ⇒ ij (dasselbe Wort).

const NL_FEHLT: readonly string[] = ["“", "”", "„", "«", "»", "‘", "’", "‚", "…", HALBGEVIERT, GEVIERT, "ĳ"];
const NL_ERSATZ: Readonly<Record<string, string>> = {
  "“": "\"", "”": "\"", "„": "\"", "«": "\"", "»": "\"", "‘": "'", "’": "'", "‚": "'", "…": "...",
  [HALBGEVIERT]: "-", [GEVIERT]: "-", "ĳ": "ij", "Ĳ": "IJ",
  ...LEERZEICHEN_ERSATZ,
};

/**
 * Niederlande - Windows „United States-International". ANSI wie `us`: Heimtasten `a s d f | j k l ;`. Totasten: `'` (Taste rechts
 * von ;) und mit Umschalt `"`, `` ` `` (links der 1) und mit Umschalt `~`, Umschalt + 6 `^`.
 */
const NL_INTL: KeyboardLayout = {
  id: "nl-intl",
  label: "Niederländisch (US-International)",
  kurz: "US-International-Tastatur",
  sprache: "nl",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", ";"],
  lehrgangsTotasten: true,
  zweiSchrittZeigen: true,
  en: {
    label: "Dutch (US International)",
    kurz: "US International keyboard",
    hinweis:
      "On the US International keyboard ' and \" (the key right of ;) are dead keys: for the sign itself press the space bar " +
      "after it. ë is \" then e, ï is \" then i. é is AltGr + E (or ' then e), the euro sign AltGr + 5.",
  },
  rows: ANSI_ROWS(
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "`": { base: "`", dead: true }, "'": { base: "'", dead: true }, "~": { base: "`", mod: "shift", dead: true },
    "!": { base: "1", mod: "shift" }, "@": { base: "2", mod: "shift" }, "#": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "^": { base: "6", mod: "shift", dead: true },
    "&": { base: "7", mod: "shift" }, "*": { base: "8", mod: "shift" }, "(": { base: "9", mod: "shift" },
    ")": { base: "0", mod: "shift" }, "_": { base: "-", mod: "shift" }, "+": { base: "=", mod: "shift" },
    "{": { base: "[", mod: "shift" }, "}": { base: "]", mod: "shift" }, "|": { base: "\\", mod: "shift" },
    ":": { base: ";", mod: "shift" }, "\"": { base: "'", mod: "shift", dead: true }, "<": { base: ",", mod: "shift" },
    ">": { base: ".", mod: "shift" }, "?": { base: "/", mod: "shift" },
    "€": { base: "5", mod: "altgr" },
    "é": { base: "e", mod: "altgr", buchstabe: true }, "É": { base: "e", mod: "altgr", buchstabe: true, mitUmschalt: true },
  },
  missing: NL_FEHLT,
  ersatz: NL_ERSATZ,
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der US-International-Tastatur sind ' und \" (die Taste rechts neben ;) Totasten: Für das Zeichen selbst drückst " +
    "du danach die Leertaste. ë ist \" und dann e, ï ist \" und dann i. é ist AltGr + E (oder ' und dann e), das " +
    "Euro-Zeichen AltGr + 5.",
};

/**
 * Niederlande - Windows „Dutch" (Nebenweg). ISO: links der 1 `@`, Grundreihe `a s d f g h j k l + ´ <` (Heimtasten
 * `a s d f | j k l +`), `'` = Umschalt + 0, `"` = Umschalt + 2, Totasten ¨ (rechts von p) und ´ (rechts von +).
 */
const NL_DUTCH: KeyboardLayout = {
  id: "nl-dutch",
  label: "Niederländisch (Dutch)",
  kurz: "niederländische Tastatur",
  sprache: "nl",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "+"],
  lehrgangsTotasten: true,
  zweiSchrittZeigen: true,
  ziffernblockKomma: true,
  en: {
    label: "Dutch (Dutch layout)",
    kurz: "Dutch keyboard",
    hinweis:
      "On the Dutch keyboard @ is left of 1, ' is Shift + 0 and \" is Shift + 2. ë and ï come from the dead key ¨ right of p, " +
      "é from the dead key ´ right of +: first the dead key, then the letter.",
  },
  rows: ISO_ROWS(
    ["@", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "/", "°"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "¨", "*"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "+", "´", "<"],
    ["]", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "¨": { base: "¨", dead: true }, "´": { base: "´", dead: true }, "§": { base: "@", mod: "shift" },
    "!": { base: "1", mod: "shift" }, "\"": { base: "2", mod: "shift" }, "#": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "&": { base: "6", mod: "shift" },
    "_": { base: "7", mod: "shift" }, "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "'": { base: "0", mod: "shift" }, "?": { base: "/", mod: "shift" }, "~": { base: "°", mod: "shift", dead: true },
    "^": { base: "¨", mod: "shift", dead: true }, "|": { base: "*", mod: "shift" }, "±": { base: "+", mod: "shift" },
    "`": { base: "´", mod: "shift", dead: true }, ">": { base: "<", mod: "shift" }, "[": { base: "]", mod: "shift" },
    ";": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" }, "=": { base: "-", mod: "shift" },
    "€": { base: "e", mod: "altgr" }, "\\": { base: "/", mod: "altgr" }, "{": { base: "8", mod: "altgr" },
    "}": { base: "9", mod: "altgr" },
  },
  missing: NL_FEHLT,
  ersatz: NL_ERSATZ,
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der niederländischen Tastatur liegt @ links neben der 1, ' ist Umschalt + 0 und \" ist Umschalt + 2. ë und ï " +
    "kommen über die Totaste ¨ rechts neben p, é über die Totaste ´ rechts neben +: erst die Totaste, dann den Buchstaben.",
};

// --- Die portugiesischen Tastaturen (★★★ G3b, 25.10.2026) -------------------
//
// ★★★ G3b (25.10.2026, Bauplan `BAUPLAN-2026-10-25-PT.md` §1 I1-I10, I22, §2; Recherche `recherche-pt/tastaturen-und-zeichen.md`
// §2, §5, §6): ZWEI Wege, je EINE Tastatur.
//  · `pt`       = Windows „Portuguese" (KBDPO, KLID 00000816) - Bezug Portugal (Weg „pt"). ISO.
//  · `br-abnt2` = Windows „Portuguese (Brazilian ABNT2)" (KBDBR, 00010416; „ABNT" 00000416 hat Zeile für Zeile dieselben Tasten,
//                 Wächter) - Bezug Brasilien (Weg „br"). ★ G4-NAHT (25.10.2026): Die Zusatztaste rechts unten (`IntlRo`:
//                 `/` `?`) ist die zwölfte Taste der unteren Reihe; `REIHEN_CODES` kennt sie seither (`zusatzRechts`). `/`
//                 und `?` stehen darum dort (Lehre, Anzeige, Finger: rechter kleiner Finger). AltGr + Q / W (der Weg auf
//                 Geräten ohne die Taste, Bauplan I10) gibt Windows auch - das fertige Zeichen zählt, geführt wird die Taste.
// ★ Beide UNGEMESSEN im Browser (nur Windows-Tabelle vom 25.10.2026, Falle 65); Mac ungemessen.
//
// ★ TOTASTEN (Lehrgang, I2): `pt` - Akut ´ rechts neben + (Umschalt: Gravis `), Tilde ~ rechts neben º (Umschalt: Zirkumflex ^),
// Trema ¨ AltGr + +; `br-abnt2` - Akut ´ rechts neben p (Umschalt `), Tilde ~ rechts neben ç (Umschalt ^), Trema ¨ = Umschalt + 6
// (I9: nie Umschalt + 6 für eine Ziffern-Übung verlangen). ç hat auf beiden eine eigene Taste (achte Heimtaste).
// ⚠️ Die Kombizeichen der Tilde (ã õ) kennt `totasten.ts` noch nicht - Etappe G3a.
// ★ KEIN ERSATZ für Buchstaben (I4: é/e, está/esta, avô/avó). `br-abnt2` hat kein €: `€` fehlt (I8).

/**
 * Portugal - Windows „Portuguese". ISO. Grundreihe `a s d f g h j k l ç º ~` (Heimtasten `a s d f | j k l ç`); « » direkt rechts
 * neben dem Apostroph, ª = Umschalt + º.
 */
const PT: KeyboardLayout = {
  id: "pt",
  label: "Portugiesisch (Portugal)",
  kurz: "portugiesische Tastatur",
  sprache: "pt",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "ç"],
  lehrgangsTotasten: true,
  zweiSchrittZeigen: true,
  ziffernblockKomma: true,
  // Umschalt auf º gibt ª (kein Buchstabe im Sinn einer Grossform): die Kappe bleibt klein.
  kleineKappen: ["º"],
  en: {
    label: "Portuguese (Portugal)",
    kurz: "Portuguese keyboard",
    hinweis:
      "On the Portuguese keyboard ç has its own key right of l. The acute accent ´ is a dead key right of + (with Shift the " +
      "grave `), the tilde ~ a dead key right of º (with Shift the circumflex ^): first the dead key, then the vowel (á, ã, " +
      "ê). « and » have their own key right of the apostrophe.",
  },
  rows: ISO_ROWS(
    ["\\", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "'", "«"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "+", "´"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ç", "º", "~"],
    ["<", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "´": { base: "´", dead: true }, "~": { base: "~", dead: true }, "|": { base: "\\", mod: "shift" },
    "!": { base: "1", mod: "shift" }, "\"": { base: "2", mod: "shift" }, "#": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "&": { base: "6", mod: "shift" },
    "/": { base: "7", mod: "shift" }, "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "=": { base: "0", mod: "shift" }, "?": { base: "'", mod: "shift" }, "»": { base: "«", mod: "shift" },
    "*": { base: "+", mod: "shift" }, "`": { base: "´", mod: "shift", dead: true }, "ª": { base: "º", mod: "shift" },
    "^": { base: "~", mod: "shift", dead: true }, ">": { base: "<", mod: "shift" }, ";": { base: ",", mod: "shift" },
    ":": { base: ".", mod: "shift" }, "_": { base: "-", mod: "shift" },
    "@": { base: "2", mod: "altgr" }, "€": { base: "e", mod: "altgr" }, "{": { base: "7", mod: "altgr" },
    "[": { base: "8", mod: "altgr" }, "]": { base: "9", mod: "altgr" }, "}": { base: "0", mod: "altgr" },
    "¨": { base: "+", mod: "altgr", dead: true },
  },
  missing: ["“", "”", "„", "‘", "’", "‚", "…", HALBGEVIERT, GEVIERT],
  ersatz: {
    "“": "\"", "”": "\"", "„": "\"", "‘": "'", "’": "'", "‚": "'", "…": "...", [HALBGEVIERT]: "-", [GEVIERT]: "-",
    ...LEERZEICHEN_ERSATZ,
  },
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der portugiesischen Tastatur hat ç eine eigene Taste rechts neben l. Der Akut ´ ist eine Totaste rechts neben + " +
    "(mit Umschalt der Gravis `), die Tilde ~ eine Totaste rechts neben º (mit Umschalt der Zirkumflex ^): erst die " +
    "Totaste, dann den Selbstlaut (á, ã, ê). « und » haben eine eigene Taste rechts neben dem Apostroph.",
};

/**
 * Brasilien - Windows „Portuguese (Brazilian ABNT2)". ISO MIT der Zusatztaste `IntlRo` (`/`, siehe oben). Grundreihe
 * `a s d f g h j k l ç ~ ]` (Heimtasten `a s d f | j k l ç`); links der 1 `'` (Umschalt `"`); `;` unten rechts (Umschalt `:`).
 */
const BR_ABNT2: KeyboardLayout = {
  id: "br-abnt2",
  label: "Portugiesisch (Brasilien, ABNT2)",
  kurz: "brasilianische Tastatur",
  sprache: "br",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "ç"],
  lehrgangsTotasten: true,
  zweiSchrittZeigen: true,
  ziffernblockKomma: true,
  en: {
    label: "Portuguese (Brazil, ABNT2)",
    kurz: "Brazilian keyboard",
    hinweis:
      "On the Brazilian ABNT2 keyboard ç has its own key right of l. The acute accent ´ is a dead key right of p (with Shift " +
      "the grave `), the tilde ~ a dead key right of ç (with Shift the circumflex ^). Shift + 6 is the dead key ¨, not a " +
      "sign. ' is left of 1 (with Shift \"), ; is at the bottom right. / and ? are on the extra key right of ; or AltGr + Q " +
      "and AltGr + W.",
  },
  // ★ G4-NAHT: zwölf Tasten unten (die letzte ist `IntlRo`); die Umschalttaste rechts ist dafür eine Taste schmaler
  // (2,1em Taste + 0,3em Abstand), damit die Reihe so breit bleibt wie die anderen.
  rows: mitZusatztasteRechts(ISO_ROWS(
    ["'", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "´", "["],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ç", "~", "]"],
    ["\\", "z", "x", "c", "v", "b", "n", "m", ",", ".", ";"],
  ), "/", "2.5em"),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "´": { base: "´", dead: true }, "~": { base: "~", dead: true }, "\"": { base: "'", mod: "shift" },
    "!": { base: "1", mod: "shift" }, "@": { base: "2", mod: "shift" }, "#": { base: "3", mod: "shift" },
    "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "¨": { base: "6", mod: "shift", dead: true },
    "&": { base: "7", mod: "shift" }, "*": { base: "8", mod: "shift" }, "(": { base: "9", mod: "shift" },
    ")": { base: "0", mod: "shift" }, "_": { base: "-", mod: "shift" }, "+": { base: "=", mod: "shift" },
    "`": { base: "´", mod: "shift", dead: true }, "{": { base: "[", mod: "shift" }, "^": { base: "~", mod: "shift", dead: true },
    "}": { base: "]", mod: "shift" }, "|": { base: "\\", mod: "shift" }, "<": { base: ",", mod: "shift" },
    ">": { base: ".", mod: "shift" }, ":": { base: ";", mod: "shift" },
    // ★ G4-NAHT: ? = Umschalt + die Zusatztaste `IntlRo` (vorher AltGr + W, als die Code-Tabelle die Taste nicht kannte).
    "?": { base: "/", mod: "shift" }, "°": { base: "e", mod: "altgr" },
    "ª": { base: "[", mod: "altgr" }, "º": { base: "]", mod: "altgr" },
  },
  missing: ["€", "“", "”", "„", "«", "»", "‘", "’", "‚", "…", HALBGEVIERT, GEVIERT],
  ersatz: {
    "“": "\"", "”": "\"", "„": "\"", "«": "\"", "»": "\"", "‘": "'", "’": "'", "‚": "'", "…": "...",
    [HALBGEVIERT]: "-", [GEVIERT]: "-",
    ...LEERZEICHEN_ERSATZ,
  },
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der brasilianischen ABNT2-Tastatur hat ç eine eigene Taste rechts neben l. Der Akut ´ ist eine Totaste rechts " +
    "neben p (mit Umschalt der Gravis `), die Tilde ~ eine Totaste rechts neben ç (mit Umschalt der Zirkumflex ^). " +
    "Umschalt + 6 ist die Totaste ¨, kein Zeichen. ' liegt links neben der 1 (mit Umschalt \"), ; unten rechts. / und ? " +
    "liegen auf der Zusatztaste rechts neben ; oder auf AltGr + Q und AltGr + W.",
};

// --- Die rumänischen Tastaturen (★★★ G3b, 25.10.2026) -----------------------
//
// ★★★ G3b (25.10.2026, Bauplan `BAUPLAN-2026-10-25-RO.md` §1 R1-R9, R21, §2; Recherche `recherche-ro/tastaturen-und-zeichen.md`
// §2, §6, §7): ZWEI Lerntastaturen, eine dritte nur erkannt.
//  · `ro`      = Windows „Romanian (Standard)" (KBDROST, KLID 00010418) - Bezug. ă î â ș ț auf eigenen Tasten (KEINE Totaste im
//                Lehrgang, R3), ș ț mit KOMMA (U+0219, U+021B). ANSI wie `us` (die Hardware trägt in Rumänien meist den US-Aufdruck,
//                Bauplan §2): â über der Eingabetaste.
//  · `ro-prog` = Windows „Romanian (Programmers)" (KBDROPR, 00020418): US-Grundebene, die fünf Buchstaben auf AltGr + a / q / i /
//                s / t (Grossform mit Umschalt) - dieselbe Bauart wie `pl`. ⚠️ Per `getLayoutMap` NICHT von `us` zu trennen.
//  · Windows „Romanian (Legacy)" (KBDRO, 00000418, QWERTZ, ş ţ mit CEDILLE, kein ț): KEIN Lernweg-Layout - die Erkennung meldet es
//    als `{ fremd, ro-legacy }` (die Einrichtung soll die Umstellung anbieten, R21).
// ★ UNGEMESSEN im Browser (nur Windows-Tabelle vom 25.10.2026, Falle 65); Mac ungemessen.
//
// ★ KEIN ERSATZ für ă â î ș ț (R5: că/ca, să/sa, și/si). Die Cedille-Formen ş ţ Ş Ţ (alte Texte, Legacy-Tastatur) werden beim
// Servieren zur Komma-Form - DASSELBE Wort in der richtigen Schreibung (R4), kein anderes. Typografie: „ ” sind auf `ro` direkt
// (Taste links der 1, mit Umschalt), auf `ro-prog` AltGr + [ ]; « » auf `ro-prog` AltGr + , .; das gerade " gibt es auf `ro` nur
// mit AltGr + Umschalt (nicht geführt, `KeyMod` kennt das nicht) - Zeilen mit " kommen dort nicht.

const RO_CEDILLE_ERSATZ: Readonly<Record<string, string>> = { "ş": "ș", "ţ": "ț", "Ş": "Ș", "Ţ": "Ț" };

/**
 * Rumänien - Windows „Romanian (Standard)". ANSI. Links der 1 „ (Umschalt ”); obere Reihe `… p ă î â`, Grundreihe
 * `a s d f g h j k l ș ț` (Heimtasten `a s d f | j k l ș`).
 */
const RO: KeyboardLayout = {
  id: "ro",
  label: "Rumänisch (Standard)",
  kurz: "rumänische Tastatur",
  sprache: "ro",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "ș"],
  ziffernblockKomma: true,
  en: {
    label: "Romanian (standard)",
    kurz: "Romanian keyboard",
    hinweis:
      "On the Romanian standard keyboard ă and î are right of p, â above Enter, ș and ț right of l - ș and ț with a comma below, " +
      "as they should be. The quotation marks „ and ” are left of 1 (” with Shift). The apostrophe is AltGr + ț, the euro " +
      "sign AltGr + E.",
  },
  rows: ANSI_ROWS(
    ["„", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "ă", "î", "â"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ș", "ț"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "”": { base: "„", mod: "shift" }, "!": { base: "1", mod: "shift" }, "@": { base: "2", mod: "shift" },
    "#": { base: "3", mod: "shift" }, "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "^": { base: "6", mod: "shift" }, "&": { base: "7", mod: "shift" }, "*": { base: "8", mod: "shift" },
    "(": { base: "9", mod: "shift" }, ")": { base: "0", mod: "shift" }, "_": { base: "-", mod: "shift" },
    "+": { base: "=", mod: "shift" }, ";": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" },
    "?": { base: "/", mod: "shift" },
    "€": { base: "e", mod: "altgr" }, "[": { base: "ă", mod: "altgr" }, "]": { base: "î", mod: "altgr" },
    "'": { base: "ț", mod: "altgr" }, "\\": { base: "â", mod: "altgr" }, "<": { base: ",", mod: "altgr" },
    ">": { base: ".", mod: "altgr" }, "`": { base: "„", mod: "altgr" },
  },
  missing: ["\"", "“", "«", "»", "‚", "‘", "’", "…", HALBGEVIERT, GEVIERT, "{", "}", "|", "~", "ş", "ţ"],
  ersatz: {
    "“": "„", "«": "„", "»": "”", "‚": "'", "‘": "'", "’": "'", "…": "...", [HALBGEVIERT]: "-", [GEVIERT]: "-",
    ...RO_CEDILLE_ERSATZ,
    ...LEERZEICHEN_ERSATZ,
  },
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der rumänischen Standard-Tastatur liegen ă und î rechts neben p, â über der Eingabetaste, ș und ț rechts neben l " +
    "- ș und ț mit dem Komma darunter, wie es richtig ist. Die Anführungszeichen „ und ” liegen links neben der 1 (” mit " +
    "Umschalt). Der Apostroph ist AltGr + ț, das Euro-Zeichen AltGr + E.",
};

/**
 * Rumänien - Windows „Romanian (Programmers)". ANSI wie `us`; ă â î ș ț = AltGr + a / q / i / s / t (Grossform mit Umschalt).
 * Heimtasten `a s d f | j k l ;`.
 */
const RO_PROG: KeyboardLayout = {
  id: "ro-prog",
  label: "Rumänisch (Programmierer, QWERTY)",
  kurz: "rumänische Programmierer-Tastatur",
  sprache: "ro",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", ";"],
  ziffernblockKomma: true,
  en: {
    label: "Romanian (programmers, QWERTY)",
    kurz: "Romanian programmers keyboard",
    hinweis:
      "On the Romanian programmers keyboard you type the Romanian letters with the right Alt key (AltGr) and the base letter: " +
      "ă = a, â = q, î = i, ș = s, ț = t; for a capital add Shift. Otherwise it is the English (US) keyboard.",
  },
  rows: ANSI_ROWS(
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "~": { base: "`", mod: "shift" }, "!": { base: "1", mod: "shift" }, "@": { base: "2", mod: "shift" },
    "#": { base: "3", mod: "shift" }, "$": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    "^": { base: "6", mod: "shift" }, "&": { base: "7", mod: "shift" }, "*": { base: "8", mod: "shift" },
    "(": { base: "9", mod: "shift" }, ")": { base: "0", mod: "shift" }, "_": { base: "-", mod: "shift" },
    "+": { base: "=", mod: "shift" }, "{": { base: "[", mod: "shift" }, "}": { base: "]", mod: "shift" },
    "|": { base: "\\", mod: "shift" }, ":": { base: ";", mod: "shift" }, "\"": { base: "'", mod: "shift" },
    "<": { base: ",", mod: "shift" }, ">": { base: ".", mod: "shift" }, "?": { base: "/", mod: "shift" },
    "€": { base: "e", mod: "altgr" }, "„": { base: "[", mod: "altgr" }, "”": { base: "]", mod: "altgr" },
    "«": { base: ",", mod: "altgr" }, "»": { base: ".", mod: "altgr" },
    "ă": { base: "a", mod: "altgr", buchstabe: true }, "â": { base: "q", mod: "altgr", buchstabe: true },
    "î": { base: "i", mod: "altgr", buchstabe: true }, "ș": { base: "s", mod: "altgr", buchstabe: true },
    "ț": { base: "t", mod: "altgr", buchstabe: true },
    "Ă": { base: "a", mod: "altgr", buchstabe: true, mitUmschalt: true }, "Â": { base: "q", mod: "altgr", buchstabe: true, mitUmschalt: true },
    "Î": { base: "i", mod: "altgr", buchstabe: true, mitUmschalt: true }, "Ș": { base: "s", mod: "altgr", buchstabe: true, mitUmschalt: true },
    "Ț": { base: "t", mod: "altgr", buchstabe: true, mitUmschalt: true },
  },
  missing: ["“", "‚", "‘", "’", "…", HALBGEVIERT, GEVIERT, "ş", "ţ"],
  ersatz: {
    "“": "\"", "‚": "'", "‘": "'", "’": "'", "…": "...", [HALBGEVIERT]: "-", [GEVIERT]: "-",
    ...RO_CEDILLE_ERSATZ,
    ...LEERZEICHEN_ERSATZ,
  },
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der rumänischen Programmierer-Tastatur tippst du die rumänischen Buchstaben mit der rechten Alt-Taste (AltGr) und " +
    "dem Grundbuchstaben: ă = a, â = q, î = i, ș = s, ț = t; für einen Großbuchstaben kommt die Umschalttaste dazu. Sonst " +
    "ist sie die englische (US-)Tastatur.",
};

// --- Die schwedische Tastatur (★★★ G3b, 25.10.2026) -------------------------
//
// ★★★ G3b (25.10.2026, Bauplan `BAUPLAN-2026-10-25-SV.md` §1 S1-S5, S19-S20, §2; Recherche `recherche-sv/tastaturen-und-zeichen.md`
// §2, §5, §6): EINE Tastatur für Schweden UND Finnland - Windows „Swedish" (KBDSW, KLID 0000041D) und Windows „Finnish" (KBDFI,
// 0000040B) haben Taste für Taste dieselbe Belegung (Wächter vergleicht beide Tabellen Zelle für Zelle).
// ★ UNGEMESSEN im Browser (nur Windows-Tabelle vom 25.10.2026, Falle 65); Mac ungemessen.
//
// ★ å ä ö auf eigenen Tasten (rechts von p, rechts von l) - keine Totaste, kein Ersatz (S2). é = Totaste ´ (rechts neben +), dann e
// (S3: späte eigene Einheit) - darum `lehrgangsTotasten`. Die übrigen Totasten (` ¨ ^ ~) sind kein Lernziel (S19).
// ★ `capsUpper` LEER: Umschalt gibt Å Ä Ö (der Weg der Lehre); die Feststelltaste gibt sie AUCH (Tabelle) - Bauplan S4 nannte
// `capsUpper = ["å","ä","ö"]`, das Feld heisst aber „die Grossform braucht die Feststelltaste", und das tut sie hier nicht.
// ★ AltGr (S20, eine späte Einheit): @ $ € { [ ] } \ | - `€` auf AltGr + E (auch AltGr + 5 in der Tabelle).

const SV: KeyboardLayout = {
  id: "sv",
  label: "Schwedisch (Schweden, Finnland)",
  kurz: "schwedische Tastatur",
  sprache: "sv",
  heimtasten: ["a", "s", "d", "f", "j", "k", "l", "ö"],
  lehrgangsTotasten: true,
  zweiSchrittZeigen: true,
  ziffernblockKomma: true,
  en: {
    label: "Swedish (Sweden, Finland)",
    kurz: "Swedish keyboard",
    hinweis:
      "On the Swedish keyboard å is right of p, ö and ä are right of l - each has its own key, with Shift its capital. é is the " +
      "dead key ´ (right of +), then e. @ is AltGr + 2, € AltGr + E. The Finnish keyboard is the same.",
  },
  rows: ISO_ROWS(
    ["§", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "´"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å", "¨"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä", "'"],
    ["<", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "´": { base: "´", dead: true }, "¨": { base: "¨", dead: true }, "½": { base: "§", mod: "shift" },
    "!": { base: "1", mod: "shift" }, "\"": { base: "2", mod: "shift" }, "#": { base: "3", mod: "shift" },
    "¤": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, "&": { base: "6", mod: "shift" },
    "/": { base: "7", mod: "shift" }, "(": { base: "8", mod: "shift" }, ")": { base: "9", mod: "shift" },
    "=": { base: "0", mod: "shift" }, "?": { base: "+", mod: "shift" }, "`": { base: "´", mod: "shift", dead: true },
    "^": { base: "¨", mod: "shift", dead: true }, "*": { base: "'", mod: "shift" }, ">": { base: "<", mod: "shift" },
    ";": { base: ",", mod: "shift" }, ":": { base: ".", mod: "shift" }, "_": { base: "-", mod: "shift" },
    "@": { base: "2", mod: "altgr" }, "$": { base: "4", mod: "altgr" }, "€": { base: "e", mod: "altgr" },
    "{": { base: "7", mod: "altgr" }, "[": { base: "8", mod: "altgr" }, "]": { base: "9", mod: "altgr" },
    "}": { base: "0", mod: "altgr" }, "\\": { base: "+", mod: "altgr" }, "|": { base: "<", mod: "altgr" },
  },
  missing: ["“", "”", "„", "«", "»", "‘", "’", "‚", "…", HALBGEVIERT, GEVIERT],
  ersatz: {
    "“": "\"", "”": "\"", "„": "\"", "«": "\"", "»": "\"", "‘": "'", "’": "'", "‚": "'", "…": "...",
    [HALBGEVIERT]: "-", [GEVIERT]: "-",
    ...LEERZEICHEN_ERSATZ,
  },
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der schwedischen Tastatur liegt å rechts neben p, ö und ä rechts neben l - jeder hat eine eigene Taste, mit Umschalt " +
    "seinen Großbuchstaben. é ist die Totaste ´ (rechts neben +), dann e. @ ist AltGr + 2, € AltGr + E. Die finnische " +
    "Tastatur ist dieselbe.",
};

// --- Die ukrainischen Tastaturen (★★★ G3b, 25.10.2026) ----------------------
//
// ★★★ G3b (25.10.2026, Bauplan `BAUPLAN-2026-10-25-UK.md` §1 U2-U10, §2, §2.1; Recherche `recherche-uk/tastaturen-und-zeichen.md`
// §2, §5, §6): ZWEI Tastaturen. ⚠️ Die Kennungen heissen `ua` und `ua-std`, NICHT `uk`: `uk` ist seit jeher die BRITISCHE
// Tastatur (LayoutId) - der Weg heisst trotzdem „uk" (Sprache Ukrainisch, ISO 639-1).
//  · `ua`     = Windows „Ukrainian (Enhanced)" (KBDUR1, KLID 00020422) - Windows-Vorgabe für uk-UA (Bezug). Links der 1 der
//               Apostroph ' (Umschalt ₴).
//  · `ua-std` = Windows „Ukrainian" (KBDUR, 00000422): links der 1 das russische ё - KEIN Apostroph (U2: Wörter mit Apostroph
//               werden dort nicht serviert).
// ★ UNGEMESSEN im Browser (nur Windows-Tabelle vom 25.10.2026, Falle 65); Mac ungemessen.
// ★ ґ liegt auf der ISO-Taste links von я (Umschalt Ґ) und auf AltGr + г (für ANSI-Hardware ohne diese Taste - das Modell zeigt
// die ISO-Taste, eine ANSI-Variante ist offen). Komma = Umschalt + die Taste mit dem Punkt (unten rechts, U4).
// ★ KEIN ERSATZ für Buchstaben (U10). Typografie ⇒ gerade Zeichen; der typografische Apostroph ’ und der Modifikator-Apostroph ʼ
// (U+02BC, U3) ⇒ ' auf `ua` (dasselbe Wort); auf `ua-std` gibt es keinen Apostroph.

const UA_FEHLT: readonly string[] = [
  "@", "#", "$", "&", "<", ">", "[", "]", "{", "}", "|", "~", "^", "€", "`",
  "«", "»", "„", "“", "”", "‚", "‘", "’", "ʼ", "…", HALBGEVIERT, GEVIERT,
];
const UA_ERSATZ: Readonly<Record<string, string>> = {
  "«": "\"", "»": "\"", "„": "\"", "“": "\"", "”": "\"", "…": "...",
  ...LEERZEICHEN_ERSATZ,
};
const UA_HEIMTASTEN: readonly [string, string, string, string, string, string, string, string] = ["ф", "і", "в", "а", "о", "л", "д", "ж"];

/**
 * Ukraine - Windows „Ukrainian (Enhanced)". ISO. Grundreihe `ф і в а п р о л д ж є \` (Heimtasten `ф і в а | о л д ж`); obere Reihe
 * `й ц у к е н г ш щ з х ї`; unten `ґ я ч с м и т ь б ю .`.
 */
const UA: KeyboardLayout = {
  id: "ua",
  label: "Ukrainisch (erweitert)",
  kurz: "ukrainische Tastatur",
  sprache: "uk",
  heimtasten: UA_HEIMTASTEN,
  ziffernblockKomma: true,
  en: {
    label: "Ukrainian (enhanced)",
    kurz: "Ukrainian keyboard",
    hinweis:
      "On the Ukrainian keyboard the home row is ф і в а п р о л д ж є. The apostrophe ' is left of 1 (with Shift the hryvnia " +
      "sign ₴). The full stop is at the bottom right, the comma is Shift + the same key. ґ is left of я, or AltGr + г.",
  },
  rows: ISO_ROWS(
    ["'", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ї"],
    ["ф", "і", "в", "а", "п", "р", "о", "л", "д", "ж", "є", "\\"],
    ["ґ", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "."],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "₴": { base: "'", mod: "shift" }, "!": { base: "1", mod: "shift" }, "\"": { base: "2", mod: "shift" },
    "№": { base: "3", mod: "shift" }, ";": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" },
    ":": { base: "6", mod: "shift" }, "?": { base: "7", mod: "shift" }, "*": { base: "8", mod: "shift" },
    "(": { base: "9", mod: "shift" }, ")": { base: "0", mod: "shift" }, "_": { base: "-", mod: "shift" },
    "+": { base: "=", mod: "shift" }, "/": { base: "\\", mod: "shift" }, ",": { base: ".", mod: "shift" },
  },
  missing: UA_FEHLT,
  ersatz: { ...UA_ERSATZ, "‘": "'", "’": "'", "‚": "'", "ʼ": "'" },
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Auf der ukrainischen Tastatur ist die Grundreihe ф і в а п р о л д ж є. Der Apostroph ' liegt links neben der 1 (mit " +
    "Umschalt das Hrywnja-Zeichen ₴). Der Punkt liegt unten rechts, das Komma ist Umschalt + dieselbe Taste. ґ liegt " +
    "links neben я, oder AltGr + г.",
};

/** Ukraine - Windows „Ukrainian" (Standard). Wie {@link UA}, aber links der 1 das russische ё (Umschalt Ё) und KEIN Apostroph. */
const UA_STD: KeyboardLayout = {
  id: "ua-std",
  label: "Ukrainisch (Standard)",
  kurz: "ukrainische Standard-Tastatur",
  sprache: "uk",
  heimtasten: UA_HEIMTASTEN,
  ziffernblockKomma: true,
  en: {
    label: "Ukrainian (standard)",
    kurz: "Ukrainian standard keyboard",
    hinweis:
      "The Ukrainian standard keyboard is the Ukrainian keyboard without the apostrophe: left of 1 there is the Russian ё. " +
      "Words with an apostrophe are not offered - the enhanced Ukrainian keyboard has it.",
  },
  rows: ISO_ROWS(
    ["ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ї"],
    ["ф", "і", "в", "а", "п", "р", "о", "л", "д", "ж", "є", "\\"],
    ["ґ", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "."],
  ),
  bottomLabels: ["Ctrl", "Alt", "Alt Gr", "Ctrl"],
  access: {
    "!": { base: "1", mod: "shift" }, "\"": { base: "2", mod: "shift" }, "№": { base: "3", mod: "shift" },
    ";": { base: "4", mod: "shift" }, "%": { base: "5", mod: "shift" }, ":": { base: "6", mod: "shift" },
    "?": { base: "7", mod: "shift" }, "*": { base: "8", mod: "shift" }, "(": { base: "9", mod: "shift" },
    ")": { base: "0", mod: "shift" }, "_": { base: "-", mod: "shift" }, "+": { base: "=", mod: "shift" },
    "/": { base: "\\", mod: "shift" }, ",": { base: ".", mod: "shift" },
  },
  missing: [...UA_FEHLT, "'", "₴"],
  ersatz: UA_ERSATZ,
  capsUpper: [],
  grossFehlt: [],
  hinweis:
    "Die ukrainische Standard-Tastatur ist die ukrainische Tastatur ohne Apostroph: links neben der 1 liegt das russische " +
    "ё. Wörter mit Apostroph kommen auf ihr nicht - die erweiterte ukrainische Tastatur hat ihn.",
};

export const LAYOUTS: readonly KeyboardLayout[] = [
  DE, CH, US, UK, FR, BE, CH_FR, CA_CSA, CA_FR, ES, LATAM, IT, IT_QZERTY, PL, TR_Q, TR_F, CS, CS_QWERTY,
  // ★★★ G3b (25.10.2026): bg
  BG, BG_SCHREIBM, BG_PHON, BG_PHON_TRAD,
  // ★★★ G3b (25.10.2026): el
  EL, EL_220, EL_319,
  // ★★★ G3b (25.10.2026): hu
  HU, HU_101,
  // ★★★ G3b (25.10.2026): nl
  NL_INTL, NL_DUTCH,
  // ★★★ G3b (25.10.2026): pt
  PT,
  // ★★★ G3b (25.10.2026): br
  BR_ABNT2,
  // ★★★ G3b (25.10.2026): ro
  RO, RO_PROG,
  // ★★★ G3b (25.10.2026): sv
  SV,
  // ★★★ G3b (25.10.2026): uk
  UA, UA_STD,
];
// (Bis 11.09.2026 stand hier `LAYOUT_IDS`, entfernt weil ungenutzt.)

/**
 * ★ E3 (25.09.2026): Die SICHTBARE Tastatur-Auswahl (Einrichtung, Einstellungen)
 * - dieselbe Bauart wie `LANGS` in `bedienSprache/sprache.ts` (Auftrag: „ohne
 * Schalter: Tastenwahl … exakt wie heute"). `LAYOUTS` selbst bleibt die VOLLE
 * Liste (für `layoutById`/`layoutIndex`/Tests) - ein Kind mit gesetztem
 * Schalter muss `setLayout("fr")` weiterhin wirklich erreichen können.
 */
export function sichtbareLayouts(
  franzoesischLehrgangAn: boolean,
  // ★ ES-F3 (27.09.2026): dieselbe Bauart, zweiter (optionaler) Schalter -
  // ohne ihn (jeder Alt-Aufrufer) bleibt das Verhalten unverändert.
  spanischLehrgangAn = false,
  // ★ G2b-2 (02.10.2026): die Schalter der weiteren Sprachen (it, pl, tr, cs …). Eine Sprache
  // OHNE Eintrag gilt als AUS: ihre Tastaturen (`TASTATUREN_DER_SPRACHE`) bleiben unsichtbar.
  weitereLehrgaengeAn: Readonly<Partial<Record<Lang, boolean>>> = {},
): readonly KeyboardLayout[] {
  const lehrgangAn = (sprache: Lang): boolean =>
    sprache === "fr" ? franzoesischLehrgangAn : sprache === "es" ? spanischLehrgangAn : weitereLehrgaengeAn[sprache] === true;
  const gruppen = Object.entries(TASTATUREN_DER_SPRACHE) as [Lang, ReadonlySet<LayoutId>][];
  // ★ F3-it (02.10.2026): ein Layout, das in MEHREREN Gruppen steht (`ch-fr`: französisch und
  // italienisch), ist sichtbar, sobald EINE seiner Gruppen an ist - vorher "alle", das hätte
  // `ch-fr` für beide Wege unsichtbar gemacht. Die vier Standard-Tastaturen (`ch` steht auch in
  // der italienischen Gruppe) sind immer da. Für jedes Layout, das nur in EINER Gruppe oder in
  // keiner steht, ist das Ergebnis dasselbe wie die alte Formel.
  return LAYOUTS.filter((l) => {
    if (IMMER_SICHTBAR_LAYOUT_IDS.has(l.id)) return true;
    const meine = gruppen.filter(([, ids]) => ids.has(l.id));
    // ★ F3-tr: `tr-f` steht in keiner Menge eines Weges, gehört aber hinter den türkischen Schalter.
    const nurSchalter = NUR_MIT_SCHALTER_DER_SPRACHE[l.id];
    if (nurSchalter !== undefined) return lehrgangAn(nurSchalter) || meine.some(([sprache]) => lehrgangAn(sprache));
    return meine.length === 0 || meine.some(([sprache]) => lehrgangAn(sprache));
  });
}

/**
 * ★★ E11a-5 (26.09.2026, F18: alles auf Französisch): Name, Kurzname und
 * Erklärung jeder Tastatur in der FRANZÖSISCHEN Bedienung. Eine eigene Tabelle
 * je `LayoutId` statt eines `fr`-Feldes an jedem Layout-Objekt: `tsc` verlangt
 * so für jede Tastatur einen Eintrag, und die Layout-Objekte selbst (Tasten,
 * Zugänge) bleiben unberührt. Die Namen sind die des französischen Handbuchs
 * (E15, Anhang), die Erklärungen neu auf Französisch geschrieben - derselbe
 * Inhalt wie die englische Fassung. Bis E11a-5 zeigte die französische
 * Bedienung hier die ENGLISCHEN Namen (`Einrichtung.tsx`/`TypingSettings.tsx`
 * kappten `layoutSprache` auf „en", Befund E11a-4 §3).
 */
const LAYOUT_TEXTE_FR: Record<LayoutId, { label: string; kurz: string; hinweis?: string }> = {
  de: { label: "Allemand (Allemagne et Autriche)", kurz: "Clavier allemand" },
  ch: {
    label: "Allemand (Suisse)",
    kurz: "Clavier suisse allemand",
    hinweis:
      "Le clavier suisse allemand n'a pas de touche ß : les mots allemands avec ß " +
      "s'écrivent donc ici avec ss, comme en Suisse. Ä, Ö et Ü majuscules " +
      "s'obtiennent avec la touche morte ¨ (à droite de ü), puis Maj et la lettre " +
      "(Maj sur ä, ö et ü donne à, é et è). Sur Mac, Verr. Maj fonctionne aussi.",
  },
  us: {
    label: "Anglais (États-Unis, QWERTY)",
    kurz: "Clavier américain",
    hinweis:
      "Les claviers anglais n'ont ni ä, ö, ü ni ß. Les textes allemands utilisent " +
      "donc les remplacements habituels (ä → ae, ß → ss) - pour l'anglais, ce " +
      "clavier convient parfaitement.",
  },
  uk: {
    label: "Anglais (Royaume-Uni, QWERTY)",
    kurz: "Clavier britannique",
    hinweis:
      "Les claviers anglais n'ont ni ä, ö, ü ni ß. Les textes allemands utilisent " +
      "donc les remplacements habituels (ä → ae, ß → ss) - pour l'anglais, ce " +
      "clavier convient parfaitement.",
  },
  fr: {
    label: "Français (France, AZERTY)",
    kurz: "Clavier français",
    hinweis:
      "Le clavier AZERTY français (Windows) n'a ni É, ni Ç, ni Œ, ni « » : les textes " +
      "avec É ou Ç ne sont pas proposés, Œ et « » sont remplacés comme d'habitude " +
      "(Œ → Oe, « » → \"). À, È et Ù s'obtiennent avec la touche morte accent grave " +
      "(Alt Gr + 7), Ê, Î, Ô et Û avec ^ - puis Maj et la lettre.",
  },
  be: {
    label: "Français (Belgique, AZERTY)",
    kurz: "Clavier belge",
    hinweis:
      "Le clavier AZERTY belge (Windows) n'a ni Ç majuscule, ni Œ, ni « » : les textes " +
      "avec Ç ne sont pas proposés, Œ et « » sont remplacés comme d'habitude. É " +
      "s'obtient avec la touche morte accent aigu (Alt Gr + ù), À, È et Ù avec la " +
      "touche morte accent grave (Alt Gr + µ), Ê, Î, Ô et Û avec ^ - puis Maj et la lettre.",
  },
  "ch-fr": {
    label: "Français (Suisse/Luxembourg)",
    kurz: "Clavier suisse romand",
    hinweis:
      "Le clavier suisse romand n'a ni Ç majuscule, ni Œ, ni « » : les textes avec Ç " +
      "ne sont pas proposés, Œ et « » sont remplacés comme d'habitude. É s'obtient " +
      "avec la touche morte accent aigu (Alt Gr + '), À, È et Ù avec la touche morte " +
      "accent grave (Maj + ^) - puis Maj et la lettre. Maj sur é, à et è donne ö, ä " +
      "et ü. Sur Mac, Verr. Maj fonctionne aussi pour É, À et È.",
  },
  "ca-csa": {
    label: "Français (Canada, Canadien multilingue standard)",
    kurz: "Clavier canadien multilingue (CSA)",
    hinweis:
      "Le clavier canadien multilingue n'a pas de Œ : il est remplacé comme " +
      "d'habitude (Œ → Oe). É, À, È, Ç et Ù se tapent directement avec Maj, Ê, Î, Ô " +
      "et Û avec ^ (puis Maj et la lettre), « » avec Alt Gr + Z et Alt Gr + X, € " +
      "avec Alt Gr + E.",
  },
  "ca-fr": {
    // ★ W1 (27.09.2026): genau der Name aus der Windows-Sprachleiste - nicht
    // mehr „ancienne disposition" (Windows nennt die ANDERE Belegung „Legacy").
    label: "Français (Canada)",
    kurz: "Clavier canadien français",
    hinweis:
      "Le clavier standard de Windows pour le français au Canada. Il n'a pas de Œ : " +
      "il est remplacé comme d'habitude (Œ → Oe). É se tape directement avec Maj ; " +
      "ç et Ç s'obtiennent avec la touche morte cédille (puis c ou Maj + C), à, è et " +
      "ù avec la touche morte accent grave, Ê, Î, Ô et Û avec ^. « » ont leur propre touche.",
  },
  // ★ ES-F3 (27.09.2026): die spanischen Tastaturen sind hinter dem
  // spanischen Schalter sichtbar, unabhängig von der Bedienungssprache - für
  // die FRANZÖSISCHE Bedienung gibt es noch keine eigene Übersetzung (kein
  // Auftrag dafür), darum vorerst wie überall sonst auf Englisch (`ES.en`/
  // `LATAM.en`), nicht auf Deutsch (dieselbe Regel wie `layoutTexte` unten).
  es: ES.en,
  latam: LATAM.en,
  // ★ F3-it (02.10.2026): wie es/latam - für die französische Bedienung gibt es keine eigene
  // Übersetzung der italienischen Tastaturen (kein Auftrag), darum Englisch, nicht Deutsch.
  it: IT.en,
  "it-qzerty": IT_QZERTY.en,
  // ★ F3-pl (02.10.2026): ebenso - keine eigene französische Übersetzung der polnischen Tastatur.
  pl: PL.en,
  // ★ F3-tr (02.10.2026): ebenso - keine eigene französische Übersetzung der türkischen Tastaturen.
  "tr-q": TR_Q.en,
  "tr-f": TR_F.en,
  // ★ F3-cs (02.10.2026): ebenso - ohne eigene Übersetzung der tschechischen Tastaturen Englisch.
  cs: CS.en,
  "cs-qwerty": CS_QWERTY.en,
  // RÜCKFALL-EN (G3b): die bg-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "bg": BG.en,
  "bg-schreibm": BG_SCHREIBM.en,
  "bg-phon": BG_PHON.en,
  "bg-phon-trad": BG_PHON_TRAD.en,
  // RÜCKFALL-EN (G3b): die el-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "el": EL.en,
  "el-220": EL_220.en,
  "el-319": EL_319.en,
  // RÜCKFALL-EN (G3b): die hu-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "hu": HU.en,
  "hu-101": HU_101.en,
  // RÜCKFALL-EN (G3b): die nl-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "nl-intl": NL_INTL.en,
  "nl-dutch": NL_DUTCH.en,
  // RÜCKFALL-EN (G3b): die pt-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "pt": PT.en,
  // RÜCKFALL-EN (G3b): die br-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "br-abnt2": BR_ABNT2.en,
  // RÜCKFALL-EN (G3b): die ro-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "ro": RO.en,
  "ro-prog": RO_PROG.en,
  // RÜCKFALL-EN (G3b): die sv-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "sv": SV.en,
  // RÜCKFALL-EN (G3b): die uk-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "ua": UA.en,
  "ua-std": UA_STD.en,
};

/**
 * ★ ES-O (27.09.2026): Name, Kurzname und Erklärung jeder Tastatur SPANISCH -
 * eine Tabelle je `LayoutId` wie {@link LAYOUT_TEXTE_FR}, damit `tsc` für jede
 * Tastatur einen Eintrag verlangt. Tastennamen nach Bauplan S13 (Mayús,
 * Bloq Mayús, Alt Gr); die Erklärungen sagen dasselbe wie die englischen.
 */
const LAYOUT_TEXTE_ES: Record<LayoutId, { label: string; kurz: string; hinweis?: string }> = {
  de: { label: "Alemán (Alemania y Austria)", kurz: "Teclado alemán" },
  ch: {
    label: "Alemán (Suiza)",
    kurz: "Teclado suizo alemán",
    hinweis:
      "El teclado suizo alemán no tiene tecla ß: por eso las palabras alemanas con ß " +
      "se escriben aquí con ss, como en Suiza. Ä, Ö y Ü mayúsculas se consiguen " +
      "con la tecla muerta ¨ (a la derecha de la ü), después Mayús y la letra " +
      "(Mayús sobre ä, ö y ü da à, é y è). En Mac también funciona Bloq Mayús.",
  },
  us: {
    label: "Inglés (Estados Unidos, QWERTY)",
    kurz: "Teclado estadounidense",
    hinweis:
      "Los teclados ingleses no tienen ä, ö, ü ni ß. Por eso los textos alemanes " +
      "usan las sustituciones habituales (ä → ae, ß → ss) - para el inglés, este " +
      "teclado va perfectamente.",
  },
  uk: {
    label: "Inglés (Reino Unido, QWERTY)",
    kurz: "Teclado británico",
    hinweis:
      "Los teclados ingleses no tienen ä, ö, ü ni ß. Por eso los textos alemanes " +
      "usan las sustituciones habituales (ä → ae, ß → ss) - para el inglés, este " +
      "teclado va perfectamente.",
  },
  fr: {
    label: "Francés (Francia, AZERTY)",
    kurz: "Teclado francés",
    hinweis:
      "El teclado AZERTY francés (Windows) no tiene É, Ç, Œ ni « »: los textos con É " +
      "o Ç no se proponen, Œ y « » usan las sustituciones habituales (Œ → Oe, « » → \"). " +
      "À, È y Ù se consiguen con la tecla muerta del acento grave (Alt Gr + 7), Ê, Î, " +
      "Ô y Û con ^ - después Mayús y la letra.",
  },
  be: {
    label: "Francés (Bélgica, AZERTY)",
    kurz: "Teclado belga",
    hinweis:
      "El teclado AZERTY belga (Windows) no tiene Ç mayúscula, Œ ni « »: los textos con " +
      "Ç no se proponen, Œ y « » usan las sustituciones habituales. É se consigue con " +
      "la tecla muerta del acento agudo (Alt Gr + ù), À, È y Ù con la del acento grave " +
      "(Alt Gr + µ), Ê, Î, Ô y Û con ^ - después Mayús y la letra.",
  },
  "ch-fr": {
    label: "Francés (Suiza/Luxemburgo)",
    kurz: "Teclado suizo francés",
    hinweis:
      "El teclado suizo francés no tiene Ç mayúscula, Œ ni « »: los textos con Ç no se " +
      "proponen, Œ y « » usan las sustituciones habituales. É se consigue con la tecla " +
      "muerta del acento agudo (Alt Gr + '), À, È y Ù con la del acento grave (Mayús + ^) " +
      "- después Mayús y la letra. Mayús sobre é, à y è da ö, ä y ü. En Mac también " +
      "funciona Bloq Mayús para É, À y È.",
  },
  "ca-csa": {
    label: "Francés (Canadá, Canadien multilingue standard)",
    kurz: "Teclado canadiense multilingüe (CSA)",
    hinweis:
      "El teclado canadiense multilingüe no tiene Œ: se sustituye como de costumbre " +
      "(Œ → Oe). É, À, È, Ç y Ù se escriben directamente con Mayús, Ê, Î, Ô y Û con ^ " +
      "(después Mayús y la letra), « » con Alt Gr + Z y Alt Gr + X, € con Alt Gr + E.",
  },
  "ca-fr": {
    // ★ W1: der Name aus der Windows-Sprachleiste, siehe LAYOUT_TEXTE_FR.
    label: "Francés (Canadá, «Français (Canada)»)",
    kurz: "Teclado canadiense francés",
    hinweis:
      "El teclado estándar de Windows para el francés en Canadá. No tiene Œ: se " +
      "sustituye como de costumbre (Œ → Oe). É se escribe directamente con Mayús; ç y " +
      "Ç se consiguen con la tecla muerta de la cedilla (después c o Mayús + C), à, è " +
      "y ù con la del acento grave, Ê, Î, Ô y Û con ^. « » tienen su propia tecla.",
  },
  es: {
    label: "Español (España, ISO)",
    kurz: "Teclado español",
    hinweis:
      "En el teclado español, la tilde (á é í ó ú) es una tecla muerta a la " +
      "derecha de la ñ; con Mayús, la misma tecla da la diéresis (ü). ¡ es " +
      "directo y ¿ necesita Mayús - justo AL REVÉS que en el teclado " +
      "latinoamericano.",
  },
  latam: {
    label: "Español (Latinoamérica)",
    kurz: "Teclado latinoamericano",
    hinweis:
      "En el teclado latinoamericano, la tilde (á é í ó ú) es una tecla muerta " +
      "a la derecha de la p; con Mayús, la misma tecla da la diéresis (ü). " +
      "¿ es directo y ¡ necesita Mayús - justo AL REVÉS que en el teclado " +
      "español (España). El signo del euro no se practica con este teclado.",
  },
  // ★ F3-it (02.10.2026): ohne eigene spanische Übersetzung der italienischen Tastaturen - Englisch.
  it: IT.en,
  "it-qzerty": IT_QZERTY.en,
  // ★ F3-pl (02.10.2026): ebenso - ohne eigene spanische Übersetzung Englisch.
  pl: PL.en,
  // ★ F3-tr (02.10.2026): ebenso - ohne eigene spanische Übersetzung Englisch.
  "tr-q": TR_Q.en,
  "tr-f": TR_F.en,
  // ★ F3-cs (02.10.2026): ebenso - ohne eigene Übersetzung der tschechischen Tastaturen Englisch.
  cs: CS.en,
  "cs-qwerty": CS_QWERTY.en,
  // RÜCKFALL-EN (G3b): die bg-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "bg": BG.en,
  "bg-schreibm": BG_SCHREIBM.en,
  "bg-phon": BG_PHON.en,
  "bg-phon-trad": BG_PHON_TRAD.en,
  // RÜCKFALL-EN (G3b): die el-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "el": EL.en,
  "el-220": EL_220.en,
  "el-319": EL_319.en,
  // RÜCKFALL-EN (G3b): die hu-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "hu": HU.en,
  "hu-101": HU_101.en,
  // RÜCKFALL-EN (G3b): die nl-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "nl-intl": NL_INTL.en,
  "nl-dutch": NL_DUTCH.en,
  // RÜCKFALL-EN (G3b): die pt-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "pt": PT.en,
  // RÜCKFALL-EN (G3b): die br-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "br-abnt2": BR_ABNT2.en,
  // RÜCKFALL-EN (G3b): die ro-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "ro": RO.en,
  "ro-prog": RO_PROG.en,
  // RÜCKFALL-EN (G3b): die sv-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "sv": SV.en,
  // RÜCKFALL-EN (G3b): die uk-Tastaturen ohne eigene Übersetzung - Englisch (Etappe O übersetzt).
  "ua": UA.en,
  "ua-std": UA_STD.en,
};

const LAYOUT_TEXTE_NEUN: Readonly<Record<GeruestSprache, Record<LayoutId, { label: string; kurz: string; hinweis?: string }>>> = {
  bg: LAYOUT_TEXTE_BG,
  el: LAYOUT_TEXTE_EL,
  hu: LAYOUT_TEXTE_HU,
  nl: LAYOUT_TEXTE_NL,
  pt: LAYOUT_TEXTE_PT,
  br: LAYOUT_TEXTE_BR,
  ro: LAYOUT_TEXTE_RO,
  sv: LAYOUT_TEXTE_SV,
  uk: LAYOUT_TEXTE_UK,
};

/**
 * ★ EN2 (19.09.2026): Name, Kurzname und Erklärung einer Tastatur in der
 * Sprache der Bedienung. Ohne Angabe Deutsch - genau die Felder von vorher.
 * ★ E11a-5: dazu Französisch ({@link LAYOUT_TEXTE_FR}).
 */
export function layoutTexte(
  layout: KeyboardLayout,
  sprache: Lang = "de",
): { label: string; kurz: string; hinweis?: string } {
  // ★ O2-TASTATUR (30.10.2026): die neun Bedienungen aus ihrer eigenen Tabelle; bis hierher fielen sie auf Englisch.
  if (istGeruestSprache(sprache)) return LAYOUT_TEXTE_NEUN[sprache][layout.id];
  const s = altSpracheOderEn(sprache); // RÜCKFALL-EN (G2a): it, pl, tr, cs, wenn sie nicht über `layoutTexteIn` kommen.
  if (s === "fr") return LAYOUT_TEXTE_FR[layout.id];
  // ★ ES-O (27.09.2026): eigene spanische Namen ({@link LAYOUT_TEXTE_ES}).
  if (s === "es") return LAYOUT_TEXTE_ES[layout.id];
  if (s === "en") return layout.en;
  return { label: layout.label, kurz: layout.kurz, hinweis: layout.hinweis };
}

/**
 * ★★ G3b (25.10.2026): die ENGLISCHEN Texte einer Tastatur - für die Tabellen anderer Bedienungssprachen (`tastaturTexteIt.ts`
 * …), die eine Tastatur noch nicht übersetzt haben (Marke `RÜCKFALL-EN (G3b)`). Eine unbekannte Kennung wirft (nie still Deutsch).
 */
export function layoutTexteEnglisch(id: LayoutId): { label: string; kurz: string; hinweis?: string } {
  const l = LAYOUTS.find((x) => x.id === id);
  if (!l) throw new Error(`Unbekannte Tastatur ${JSON.stringify(id)}`);
  return l.en;
}

export function layoutById(id: string): KeyboardLayout {
  return LAYOUTS.find((l) => l.id === id) ?? DE;
}

// --- Abgeleitete Nachschlagewerke je Layout ---------------------------------

interface LayoutIndex {
  /** Taste → zuständiger Finger. */
  finger: Map<string, FingerId>;
  /** Zeichen, die es auf dieser Tastatur nicht gibt (klein geschrieben). */
  missing: Set<string>;
  /** Zeichen, deren Großform die Feststelltaste braucht. */
  caps: Set<string>;
}

const INDEX_CACHE = new Map<LayoutId, LayoutIndex>();

function buildIndex(layout: KeyboardLayout): LayoutIndex {
  const finger = new Map<string, FingerId>();
  const isAnsiBottom = layout.rows[3].keys.length === 10;
  const patterns: readonly (readonly FingerId[])[] = [
    NUM_ROW_FINGERS,
    MAIN_ROW_FINGERS,
    MAIN_ROW_FINGERS,
    isAnsiBottom ? ANSI_BOTTOM_FINGERS : ISO_BOTTOM_FINGERS,
  ];
  layout.rows.forEach((row, i) => {
    const pattern = patterns[i];
    row.keys.forEach((key, j) => {
      const f = pattern[Math.min(j, pattern.length - 1)];
      if (!finger.has(key)) finger.set(key, f);
    });
  });
  finger.set(" ", "daumen");
  return {
    finger,
    missing: new Set(layout.missing.map((c) => kleinFuer(c, layoutSprache(layout)))),
    caps: new Set(layout.capsUpper.map((c) => kleinFuer(c, layoutSprache(layout)))),
  };
}

/** Die Sprache, in der die Tastatur Gross-/Klein rechnet (Vorgabe Deutsch = `toLowerCase()`). */
export function layoutSprache(layout: KeyboardLayout = activeLayout()): Lang {
  return layout.sprache ?? "de";
}

export function layoutIndex(layout: KeyboardLayout): LayoutIndex {
  let idx = INDEX_CACHE.get(layout.id);
  if (!idx) {
    idx = buildIndex(layout);
    INDEX_CACHE.set(layout.id, idx);
  }
  return idx;
}

// --- Gewähltes Layout (geräte-lokal gemerkt) --------------------------------
// Bewusst OHNE Zustandsbibliothek gehalten (wie sound.ts): das Layout wird von
// reinen Funktionen wie `fingerForChar` gebraucht, die kein React kennen. Für die
// Oberfläche gibt es `subscribeLayout` — die Einstellungsleiste hängt sich daran.

const STORAGE_KEY = "tippen-layout";

let current: KeyboardLayout = DE;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded(): void {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) current = layoutById(raw);
  } catch {
    /* localStorage nicht verfügbar — dann eben deutsches Standard-Layout */
  }
}

/** Das aktuell eingestellte Tastatur-Layout. */
export function activeLayout(): KeyboardLayout {
  ensureLoaded();
  return current;
}

/** Kennung des eingestellten Layouts (für Auswahlfelder). */
export function activeLayoutId(): LayoutId {
  return activeLayout().id;
}

/** Hat auf diesem Gerät schon jemand eine Tastatur gewählt? */
export function hatGemerktesLayout(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/** Die erste Browsersprache der Sprache `sprache` (`nl-BE`, `pt-BR` …) - oder `null`. */
function ersteSpracheVon(sprachen: readonly string[], sprache: string): string | null {
  const re = new RegExp(`^${sprache}(?:[-_]|$)`, "i");
  return sprachen.map((x) => x.trim()).find((x) => re.test(x)) ?? null;
}

/**
 * ★★★ G3b (25.10.2026): die Vorwahl der Tastatur je NEUER Bedienungssprache - immer die Bezugsbelegung des Bauplans (§2 der
 * Sprache, „Hardware vor Ort"); nur Niederländisch unterscheidet das Land (nl-BE ⇒ Belgien). Eine Sprache trägt sich hier mit
 * ihrer Tastatur-Etappe ein.
 */
const VORSCHLAG_DER_NEUEN_SPRACHEN: Readonly<Partial<Record<Lang, (sprachen: readonly string[]) => LayoutId>>> = {
  bg: () => "bg",
  el: () => "el",
  hu: () => "hu",
  nl: (sprachen) => (/^nl[-_]BE\b/i.test(ersteSpracheVon(sprachen, "nl") ?? "") ? "be" : "nl-intl"),
  pt: () => "pt",
  br: () => "br-abnt2",
  ro: () => "ro",
  sv: () => "sv",
  uk: () => "ua",
};

/**
 * ★ Die VORWAHL der Tastatur für die englische Bedienung (23.09.2026).
 *
 * Bis hierher stand bei jedem neuen Gerät die deutsche Tastatur vorgewählt -
 * auch für eine Lehrkraft in Toronto, Chicago oder Sydney, die über
 * `tastenflow.org/en` kommt. Die Tastatur dort ist fast immer die US-Tastatur
 * (auch in Kanada und Australien); die britische gilt in Grossbritannien und
 * Irland. Entschieden wird an der ersten englischen Sprache des Browsers:
 * `en-GB`/`en-IE` ⇒ UK, jede andere ⇒ US.
 *
 * ⚠️ In der DEUTSCHEN Bedienung ändert sich nichts: Vorwahl bleibt „de".
 * ⚠️ Nur ein VORSCHLAG in der Einrichtung, wo die Tastatur ohnehin gefragt
 *    wird - und nur, wenn auf dem Gerät noch keine gemerkt ist.
 */
export function vorschlagLayout(
  bedienSprache: Lang,
  sprachen: readonly string[],
): LayoutId {
  // ★ G2a (02.10.2026): it/pl/tr/cs bekommen bis zu ihrer eigenen Tastatur
  // (F3) den Vorschlag der englischen Bedienung - NIE die deutsche Tastatur,
  // auf die die Kette sonst am Ende fiele (Falle 30).
  // ★ F3-it (02.10.2026): Weg „it" hat jetzt eigene Tastaturen - sonst schlüge die Vorwahl hier
  // `us` vor, die auf Weg „it" gar nicht angeboten wird (Falle 52: eine unpassende Wahl ist keine
  // schützenswerte Wahl, die Einrichtung würde dann zwischen beiden hin- und herspringen).
  // `it-CH` ⇒ Schweizer Belegung für das Tessin (R1 §6.3: `ch-fr`, laut [E] in Tessiner Schulen),
  // jede andere italienische Sprache und „nichts gefunden" ⇒ Italien. Mac „Italiano" (QZERTY) gibt es
  // nur als Wahl: am Browser nicht zu erkennen.
  if (bedienSprache === "it") {
    for (const s of sprachen) {
      const code = s.trim();
      if (!/^it(?:[-_]|$)/i.test(code)) continue;
      return /^it[-_]CH\b/i.test(code) ? "ch-fr" : "it";
    }
    return "it";
  }
  // ★★★ F3-pl (02.10.2026, R1 §7.4, §8): Weg „pl" hat EINE Lerntastatur - `pl` (Windows „Polski
  // (programisty)" UND Mac „Polish - Pro", ein Eintrag für beide). Jede Browsersprache - `pl-PL`, `pl`, das
  // Deutsch eines Kindes in Wien - und „nichts gefunden" ergibt `pl`: es gibt nichts zu unterscheiden. Die
  // Browsersprache ist hier nur eine Vorwahl; ob die eingestellte Windows-Belegung wirklich „programisty"
  // ist, lässt sich NICHT aus `getLayoutMap` lesen (dieselbe Grundebene wie `us`, siehe
  // `tastaturErkennung.ts`) - das entscheidet erst die Probe-Taste „AltGr + A" der Einrichtung
  // (`bestaetigtPolnischProgrammierer`).
  if (bedienSprache === "pl") return "pl";
  // ★★★ F3-tr (02.10.2026, Johannes „Hardware vor Ort", R0 T1/T2): Weg „tr" läuft auf der Q-Tastatur - in
  // der Türkei (`tr-TR`, `tr`), auf Zypern und in der türkischen Gemeinde in DACH, wo die Windows-Voreinstellung
  // „Türkçe Q" ist. Jede Browsersprache - auch das Deutsch eines Kindes in Wien, das „Türkçe Q" eingeschaltet
  // hat (deutsche oder Schweizer ISO-Hardware: dieselben Tasten, nur anders beschriftet, y und z vertauscht;
  // R1 §3.2) - und „nichts gefunden" ergibt `tr-q`: ein Layout reicht für alle. Windows UND Mac (Mac „Turkish -
  // QWERTY - PC" hat dieselbe Grund- und Umschalt-Ebene). Die F-Tastatur wird NIE vorgeschlagen (Weg „tr-F",
  // später): wer sie hat, wird von der Erkennung gemeldet (`erkenneTastatur` ⇒ `tr-f`).
  if (bedienSprache === "tr") return "tr-q";
  // ★★★ F3-cs (02.10.2026, Johannes „Hardware vor Ort", R1 §5/§8): Weg „cs" läuft auf der NORM - Windows „Čeština" / Mac
  // „Czech" (QWERTZ, `cs`). In Tschechien (`cs-CZ`, `cs`) und überall sonst - auch das Deutsch eines Kindes in Wien, das die
  // tschechische Tastatur eingeschaltet hat - und bei „nichts gefunden" ergibt es `cs`; Mac ebenso (dieselbe Grund- und
  // Umschalt-Ebene). Die QWERTY-Belegung (laut Umfrage 60 %, nicht repräsentativ) wird NIE vorgeschlagen, aber erkannt
  // (`erkenneTastatur` ⇒ `cs-qwerty`, KeyY = „y"): wer sie hat, bekommt sie vorgeschlagen. „Czech Programmers" ist nicht
  // zu erkennen (Grundebene = `us`) und wird nicht vorgewählt.
  if (bedienSprache === "cs") return "cs";
  // ★★★ G3b (25.10.2026): die neun Sprachen des Gerüsts - eine Tabelle je Bedienungssprache (Falle 50: keine Kette von
  // `if (bedienSprache === …)`). Erreichbar nur mit dem Schalter der Sprache: ohne ihn gibt es die Bedienung nicht, und die
  // vorgeschlagene Tastatur ist mit demselben Schalter sichtbar (Falle 52).
  const neu = VORSCHLAG_DER_NEUEN_SPRACHEN[bedienSprache];
  if (neu !== undefined) return neu(sprachen);
  const bedien = altSpracheOderEn(bedienSprache); // RÜCKFALL-EN (G2a)
  // ★ ES-F3 (27.09.2026, Bauplan §3 S2): dieselbe Bauart wie „fr" - `es-ES`
  // ⇒ Spanien, jede andere spanische Sprache (`es-419`, `es-MX`, `es-AR` …)
  // ⇒ Lateinamerika (S2: Wortschatz/Zahlenschreibung unterscheiden sich, die
  // Tastatur folgt derselben Zweiteilung). ⚠️ Eine Unterscheidung „ES"/„LatAm"
  // AM ANSCHLAG (wie {@link erkenneFranzoesischesLayoutAmAnschlag}) bräuchte
  // eine GEMESSENE `KeyboardEvent.code`-Tabelle für beide Tastaturen - die
  // gibt es noch nicht (nur die abstrakte Zeichenlage, keine Scancodes,
  // `recherche-spanisch-2026-09-26/`); ungeraten gelassen (Falle 6/44), gehört
  // auf die Liste für eine spätere Etappe (wie P9 für Windows).
  if (bedien === "es") {
    for (const s of sprachen) {
      const code = s.trim();
      if (!/^es(?:[-_]|$)/i.test(code)) continue;
      // Blosses „es" ⇒ Spanien (wie `erkenneEsVarianteAusSprachen`).
      return /^es(?:[-_]ES\b|$)/i.test(code) ? "es" : "latam";
    }
    return "es";
  }
  if (bedien === "en") {
    for (const s of sprachen) {
      const code = s.trim();
      if (!/^en(?:[-_]|$)/i.test(code)) continue;
      return /^en[-_](GB|IE)\b/i.test(code) ? "uk" : "us";
    }
    return "us";
  }
  // ★ E3 (25.09.2026, Bauplan §3.3): dieselbe Bauart wie oben, für Weg „fr" -
  // fr-FR/fr-* (auch Afrika) ⇒ AZERTY Frankreich, fr-BE ⇒ Belgien, fr-CH/fr-LU
  // ⇒ Schweiz-Französisch, fr-CA ⇒ Kanada (seit W2b „Français (Canada)",
  // siehe unten; bis dahin CSA nach Bauplan §1.2 F2). Nur ein VORSCHLAG (wie oben bei „en") - noch
  // nicht in der Einrichtung verdrahtet, weil `bedienSprache` bis E11 nie
  // wirklich „fr" liefert (siehe `lernweg.ts`).
  if (bedien === "fr") {
    for (const s of sprachen) {
      const code = s.trim();
      if (!/^fr(?:[-_]|$)/i.test(code)) continue;
      if (/^fr[-_](CH|LU)\b/i.test(code)) return "ch-fr";
      // ★ W2b (28.09.2026, Windows-Befund W1): fr-CA ⇒ „Français (Canada)"
      // (KBDCA, `ca-fr`) - die STANDARDBELEGUNG von Windows für fr-CA, nicht
      // die CSA (so bis dahin, Bauplan §1.2 F2). Wer CSA hat, stellt es in der
      // Einrichtung/im Zahnrad um - oder die Erkennung schlägt es vor.
      if (/^fr[-_]CA\b/i.test(code)) return "ca-fr";
      if (/^fr[-_]BE\b/i.test(code)) return "be";
      return "fr";
    }
    return "fr";
  }
  return "de";
}

/**
 * ★ E3 (25.09.2026, Bauplan §3.3): Prüfung am ERSTEN Tastendruck - dieselbe
 * Idee wie die Ziffernblock-Erkennung (`grosseTastaturErkennung.ts`,
 * 25.09.2026): EIN echter Anschlag ist verlässlicher als jede
 * Browser-Abfrage. `code: "KeyQ"` mit `key: "a"` ⇒ AZERTY (Frankreich/
 * Belgien - zwischen den beiden entscheidet dieser eine Anschlag nicht,
 * darum wird die BISHERIGE Wahl bevorzugt, wenn sie schon zur AZERTY-Familie
 * gehört); `code: "Semicolon"` mit `key: "é"` ⇒ Schweiz-Französisch.
 * `null` heisst: kein eindeutiger Treffer - nichts wird umgestellt.
 *
 * ⚠️ Reine, testbare Funktion - noch OHNE eigenen `document`-Horcher
 * (anders als die Ziffernblock-Erkennung): Ein Anschlag darf die Tastatur
 * nur wechseln, während Weg „fr" wirklich läuft (Schalter), UND der Bauplan
 * sieht dafür eine einmalige Rückfrage vor („fragt das Programm einmal nach"),
 * keinen stillen Sprung - das UI-Verdrahten (samt der Frage) gehört zur
 * Einrichtung/E5, wenn echte Inhalte den ersten Anschlag überhaupt auslösen.
 */
export function erkenneFranzoesischesLayoutAmAnschlag(
  code: string | null | undefined,
  key: string | null | undefined,
  bisherige: LayoutId,
): LayoutId | null {
  if (!code || !key) return null;
  if (code === "KeyQ" && key === "a") {
    return bisherige === "fr" || bisherige === "be" ? bisherige : "fr";
  }
  if (code === "Semicolon" && key === "é") return "ch-fr";
  return null;
}

/** Layout umstellen (wird im Browser gemerkt). */
export function setLayout(id: LayoutId | string): void {
  ensureLoaded();
  const next = layoutById(id);
  if (next.id === current.id) return;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next.id);
  } catch {
    /* ignore */
  }
  for (const fn of listeners) fn();
}

/** Auf Layout-Wechsel horchen (für React-Komponenten). */
export function subscribeLayout(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// --- Fehlende Zeichen + Ersatzschreibweise ----------------------------------

/** Gibt es dieses Zeichen auf der eingestellten Tastatur? */
export function keyExists(ch: string): boolean {
  if (!ch) return false;
  return !layoutIndex(activeLayout()).missing.has(kleinFuer(ch, layoutSprache()));
}

// --- Windows oder Mac? (★ W1, 27.09.2026) ------------------------------------
//
// Die Modelle bilden die WINDOWS-Belegung ab (Kopf-Kommentar „Mac gegen
// Windows" oben; Schulen arbeiten meist unter Windows, und die Windows-
// Tabellen sind seit dem 27.09. vollständig gelesen, Befund Anhang A). Wo der
// Mac davon abweicht UND es bekannt ist, trägt das Layout ein eigenes Feld
// (`capsUpperMac`). Die kleinste saubere Lösung: EINE Erkennung hier, am
// selben Merkmal wie die Vorgabe der Tastenansage (`a11y.ts`,
// `appleSystem`): `navigator.userAgent` nennt Mac/iPhone/iPad. Angenommen
// wird ohnehin jedes richtig entstandene Zeichen (`anschlagDeuten.ts`) - die
// Plattform bestimmt nur, welcher Weg ERKLÄRT wird und ob die Feststelltaste
// als Weg gilt.

export type LayoutPlattform = "windows" | "mac";

let plattformFest: LayoutPlattform | null = null;

/** Windows oder Mac - aus dem Browser erkannt (ohne `navigator`: Windows). */
export function layoutPlattform(): LayoutPlattform {
  if (plattformFest) return plattformFest;
  if (typeof navigator === "undefined") return "windows";
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) ? "mac" : "windows";
}

/** Nur für Tests: die Plattform festlegen (`null` = wieder erkennen). */
export function setzeLayoutPlattform(p: LayoutPlattform | null): void {
  plattformFest = p;
}

/**
 * ★ F3-pl (02.10.2026): die Beschriftung der Leertastenreihe auf DIESER Plattform - `bottomLabelsMac`
 * am Mac, wenn die Tastatur eine eigene hat (Polnisch: „Alt" unter Windows, „Option" am Mac), sonst
 * `bottomLabels`. Alle bisherigen Tastaturen tragen kein `bottomLabelsMac` und zeigen auf beiden
 * Systemen wie vorher.
 */
export function bottomLabelsFuer(layout: KeyboardLayout): readonly [string, string, string, string] {
  return layoutPlattform() === "mac" && layout.bottomLabelsMac ? layout.bottomLabelsMac : layout.bottomLabels;
}

/**
 * ★ F3-pl (02.10.2026): der Zugang zu `ch` auf DIESER Plattform - `accessMac` am Mac, wenn es das Zeichen
 * dort anders führt (Polnisch `€`), sonst `access`. Siehe {@link KeyboardLayout.accessMac}.
 */
export function zugangFuer(layout: KeyboardLayout, ch: string): KeyAccess | undefined {
  if (layoutPlattform() === "mac" && layout.accessMac && ch in layout.accessMac) return layout.accessMac[ch];
  return layout.access[ch];
}

/** Die Feststell-Liste der Tastatur auf DIESER Plattform. */
export function capsUpperFuer(layout: KeyboardLayout): readonly string[] {
  return layoutPlattform() === "mac" && layout.capsUpperMac ? layout.capsUpperMac : layout.capsUpper;
}

/** Braucht die GROSSform dieses Zeichens die Feststelltaste statt Umschalt? */
export function needsCapsLock(ch: string): boolean {
  if (ch.length !== 1) return false;
  const klein = kleinFuer(ch, layoutSprache());
  if (ch === klein) return false; // kein Großbuchstabe
  return capsUpperFuer(activeLayout()).includes(klein);
}

/**
 * ★ W1: Erzeugt diese Tastatur den Grossbuchstaben auf KEINEM Weg (Windows)?
 * Siehe {@link KeyboardLayout.grossFehlt}.
 */
export function grossFehlt(ch: string, layout: KeyboardLayout = activeLayout()): boolean {
  return grossFehltFuer(layout).includes(ch);
}

/**
 * ★ F3-it (02.10.2026): die Liste der Grossbuchstaben, die diese Tastatur auf DIESER Plattform auf
 * keinem Weg erzeugt - `grossFehltMac` am Mac, wenn die Tastatur eine eigene hat (Italienisch: Windows
 * ja, Mac „Italiano - Pro" nein, dort geht Option + Umschalt), sonst `grossFehlt`. Alle bisherigen
 * Tastaturen tragen kein `grossFehltMac` und rechnen daher auf beiden Systemen wie vorher.
 */
export function grossFehltFuer(layout: KeyboardLayout): readonly string[] {
  return layoutPlattform() === "mac" && layout.grossFehltMac ? layout.grossFehltMac : (layout.grossFehlt ?? []);
}

/**
 * Text in die Schreibweise der eingestellten Tastatur bringen: fehlende Zeichen
 * durch ihre Ersatzschreibweise ersetzen (Schweiz ß → ss, englisch ä → ae).
 * Beim deutschen Layout unverändert — dort fehlt nichts.
 *
 * ★ E3 (25.09.2026, Bauplan F7): `ersatz` kann jetzt auch ZWEI-Zeichen-Folgen
 * als Schlüssel tragen («  » mit dem Leerzeichen davor/danach ⇒ EIN gerades
 * Anführungszeichen, ohne Innenabstand: „« mot »" ⇒ „\"mot\""). Geprüft wird
 * an JEDER Stelle ZUERST die Zwei-Zeichen-Folge, erst wenn die nicht greift
 * die bisherige Ein-Zeichen-Regel — für de/ch/us/uk, deren `ersatz` nur
 * Ein-Zeichen-Schlüssel kennt, ändert sich dadurch NICHTS (Wächter:
 * `tests/typing-layouts-franzoesisch.test.ts`, „de/ch/us/uk Byte für Byte
 * unverändert").
 */
export function toLayoutText(text: string): string {
  const layout = activeLayout();
  const ersatz = layout.ersatz;
  if (!text || layout.missing.length === 0) return text;
  const sprache = layoutSprache(layout);
  const zeichen = [...text]; // codepoint-sicher, wie das bisherige `for…of`
  let out = "";
  for (let i = 0; i < zeichen.length; i++) {
    const zwei = i + 1 < zeichen.length ? zeichen[i] + zeichen[i + 1] : "";
    if (zwei && ersatz[zwei] !== undefined) {
      out += ersatz[zwei];
      i += 1; // die zweite Stelle ist verbraucht
      continue;
    }
    const ch = zeichen[i];
    const rep = ersatz[ch] ?? ersatz[kleinFuer(ch, sprache)];
    if (rep !== undefined) {
      // Großbuchstabe ohne eigenen Eintrag (z. B. „ẞ") sinnvoll großschreiben.
      out += ersatz[ch] !== undefined ? rep : grossFuer(rep.charAt(0), sprache) + rep.slice(1);
    } else {
      out += ch;
    }
  }
  return out;
}

/** Einheiten (Tasten/Zeichen) aussortieren, die es auf dieser Tastatur nicht gibt. */
export function onlyExistingKeys<T extends string>(units: readonly T[]): T[] {
  const missing = layoutIndex(activeLayout()).missing;
  if (missing.size === 0) return [...units];
  const sprache = layoutSprache();
  return units.filter((u) => !missing.has(kleinFuer(u, sprache)));
}
