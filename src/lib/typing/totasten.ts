/**
 * ★★★ E4 (25.09.2026, Bauplan französischer Lehrgang §4, §4.3, §14 E4):
 * Zusammengesetzte Zeichen (Totaste + Grundbuchstabe) - EIN Datentyp für alle
 * Stellen, die einen Tastendruck gegen ein Lernziel prüfen (Übungszeile,
 * Schneerutsche, Klassenmatch, Wortspiele). Wirkt NUR auf den französischen
 * Tastaturen - jeder Aufrufer prüft das selbst über
 * {@link FRANZOESISCHE_LAYOUT_IDS} (`layouts.ts`), bevor er hier nachschlägt.
 * Wege „de"/„en" bleiben dadurch Byte für Byte, wie sie sind.
 *
 * ── Gemessen (BEFUND-2026-09-25-E1-TOTASTEN-MAC.md, -WINDOWS.md) ───────────
 * Der Browser liefert das fertige Zeichen im ZWEITEN `keydown` (Weg K1 - die
 * Übungs-Engine braucht KEINEN Umbau auf `compositionend`/`input`). Zwei
 * Fehlgriff-Formen NACH einer Totaste, wenn die Stelle keine erwartet:
 *  (a) `key` mit zwei Zeichen ("^p", Safari/Firefox) - heute still verschluckt
 *  (b) `key` nur der zweite Buchstabe ("p", Chrome/Edge) - ohne Prüfung ein
 *      falscher „Treffer", wenn zufällig „p" das Lernziel wäre.
 * Regel (Bauplan §4.3 Punkt 5): Kommt `Dead`, und die Stelle erwartet KEIN
 * Totasten-Zeichen, ist DAS der Fehlgriff - sofort, EINER (nicht zwei); der
 * folgende Anschlag (in welcher der beiden Formen auch immer) wird darum
 * verschluckt, nicht noch einmal gewertet. Erwartet die Stelle dagegen eine
 * Totaste (das Ziel selbst, z. B. „^", oder ein zusammengesetztes Zeichen wie
 * „ê"), ist `Dead` ein Zwischenzustand - kein Fehler, einfach abwarten.
 */
import { capsUpperFuer, grossFehltFuer, layoutSprache, zugangFuer, type KeyboardLayout } from "./layouts";
import { grossFuer, kleinFuer } from "./sprachRegister";
import type { Lang } from "./account";

/** Ein zusammengesetztes Zeichen: erst die Totaste, dann der Grundbuchstabe. */
export interface Kombizeichen {
  /** Das fertige Zeichen, z. B. „ê". */
  zeichen: string;
  /** Die Totaste, die zuerst gedrückt wird (das `access`-Zeichen mit `dead: true`), z. B. „^". */
  tot: string;
  /** Der Grundbuchstabe danach, z. B. „e". */
  dann: string;
  /**
   * ★ M3 (26.09.2026): Nur auf Tastaturen, auf denen das Zeichen KEINE eigene
   * Taste hat. Für die Lernziel-Buchstaben `à è ù ç` - sie sind eigene
   * Einheiten des Lehrgangs und liegen auf den meisten Tastaturen direkt; nur
   * wo sie fehlen (ca-fr: à è ù über Gravis, ç über Cedille; ch-fr: ù über
   * Gravis), kommen sie über die Totaste. Ohne dieses Feld würde ein „à" auf
   * ch-fr (eigene Taste, Gravis = Umschalt+^ gibt es dort AUCH) als
   * Zwei-Schritt-Zeichen angesagt und verbucht.
   */
  nurOhneEigeneTaste?: boolean;
}

/**
 * Alle zusammengesetzten Zeichen des französischen Lehrgangs (Bauplan §4.3
 * Punkt 1) - layout-UNABHÄNGIG. Welche davon eine Tastatur wirklich
 * erreicht, entscheidet {@link kombizeichenFuerLayout} über ihre eigene
 * `access`-Tabelle (Kanada z. B. kennt bisher keine bestätigte „¨"-Totaste,
 * BEFUND-2026-09-25-E3-TASTATUREN.md).
 *
 * ★★★ E9a-2 (26.09.2026, GEMESSEN am Mac per UCKeyTranslate): „ù" und „ç"
 * sind auf fr/be/ca-csa EIGENE Tasten (kein Kombizeichen dort - `allowed`
 * lässt sie direkt zu, siehe `FR_LETTER_ORDER`), aber auf ch-fr/ca-fr kommen
 * sie NUR über eine Totaste - anders als bei ê/â & Co. sind „ù"/„ç" selbst
 * ganz normale Lernziel-Buchstaben des Lehrgangs (nicht bloss über ihre
 * Totaste erreichbar), darum stehen sie hier ZUSÄTZLICH, nicht ANSTELLE der
 * direkten Taste - `kombizeichenFuerLayout` filtert ohnehin nur die
 * Tastaturen heraus, deren `access[tot].dead === true` ist (also nur
 * ch-fr/ca-fr für diese zwei). Ein vorheriger Ersatz „ù" → „u" war
 * unvertretbar (Rückmeldung 26.09.): „où" (wo) wurde damit zu „ou" (oder) -
 * ein ANDERES Wort, nicht bloss ein Akzent-Verlust wie É → E.
 */
export const KOMBIZEICHEN: readonly Kombizeichen[] = [
  { zeichen: "ê", tot: "^", dann: "e" },
  { zeichen: "â", tot: "^", dann: "a" },
  { zeichen: "î", tot: "^", dann: "i" },
  { zeichen: "ô", tot: "^", dann: "o" },
  { zeichen: "û", tot: "^", dann: "u" },
  { zeichen: "ë", tot: "¨", dann: "e" },
  { zeichen: "ï", tot: "¨", dann: "i" },
  { zeichen: "ü", tot: "¨", dann: "u" },
  { zeichen: "ÿ", tot: "¨", dann: "y" },
  // ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2): Ä und Ö
  // (Schweiz, Windows: der Weg der LEHRE ist ¨, dann Umschalt + A/O; die
  // Feststelltaste geht gemessen am 02.10.2026 AUCH - nur bei Schweiz-Französisch nicht). Die kleinen ä/ö liegen auf eigenen Tasten und sind
  // darum nie ein Kombizeichen (`nurOhneEigeneTaste`); ü gilt schon oben.
  { zeichen: "ä", tot: "¨", dann: "a", nurOhneEigeneTaste: true },
  { zeichen: "ö", tot: "¨", dann: "o", nurOhneEigeneTaste: true },
  // ch-fr (Gravis = Umschalt+^) und ca-fr (eigene Taste „`"): siehe layouts.ts.
  { zeichen: "ù", tot: "`", dann: "u", nurOhneEigeneTaste: true },
  // ca-fr (eigene Taste „¸"): siehe layouts.ts.
  { zeichen: "ç", tot: "¸", dann: "c", nurOhneEigeneTaste: true },
  // ★★★ M3 (26.09.2026, GEMESSEN am Mac per UCKeyTranslate, „Canadian French -
  // PC"): Gravis-Totaste (Taste rechts neben der Grundreihe) + a ⇒ à, + e ⇒ è,
  // mit Umschalt À È Ù. Auf ca-fr gibt es à und è NUR so - vorher galten sie
  // dort als Einheiten ohne jeden Weg, die Totaste als Fehlgriff, und das Kind
  // kam aus 1713 bzw. 2139 Zeilen nicht heraus (Prüfbericht M3).
  // Windows: E14 A2.
  { zeichen: "à", tot: "`", dann: "a", nurOhneEigeneTaste: true },
  { zeichen: "è", tot: "`", dann: "e", nurOhneEigeneTaste: true },
  // ★★★ ES-F3 (27.09.2026, Bauplan spanischer Lehrgang §3): Akzent-Totaste
  // `´` (á é í ó ú - auf Spanien rechts von ñ, auf Lateinamerika rechts von p,
  // siehe layouts.ts) und Trema-Totaste `¨` (ü) - `ü` steht hier bereits für
  // Französisch, dieselbe Zuordnung gilt unverändert auch für Spanisch.
  { zeichen: "á", tot: "´", dann: "a" },
  { zeichen: "é", tot: "´", dann: "e" },
  { zeichen: "í", tot: "´", dann: "i" },
  { zeichen: "ó", tot: "´", dann: "o" },
  { zeichen: "ú", tot: "´", dann: "u" },
  // ★★★ F3-it (02.10.2026, R1 §6.3, Bauplan italienischer Lehrgang I10): Tessin und Graubünden - auf
  // der Schweizer Belegung (`ch-fr`, `ch`) liegen `ì` und `ò` NUR auf der Gravis-Totaste (Umschalt + ^,
  // dann i bzw. o), wie `ù`. Sie stehen ZUSÄTZLICH zu den eigenen Tasten der italienischen Tastaturen
  // (`nurOhneEigeneTaste`: dort sind sie nie ein Zwei-Schritt-Zeichen). Der Weg „fr" auf `ch-fr` ändert
  // sich dadurch nicht: kein französischer Text enthält ì oder ò, und der Gravis ist dort keine Einheit.
  // ⚠️ Windows: nur `ù` ist am Gerät gemessen; ob die Totaste auch `ì ò Ì Ò` bildet, steht auf der
  // Messliste (Bauplan §6, A5). Am Mac gemessen (Swiss French: Umschalt + ^-Taste ⇒ à è ì ò ù).
  { zeichen: "ì", tot: "`", dann: "i", nurOhneEigeneTaste: true },
  { zeichen: "ò", tot: "`", dann: "o", nurOhneEigeneTaste: true },
];

/**
 * ★★★ F3-cs (02.10.2026, R1 §7 Punkt 6): die zusammengesetzten Zeichen des TSCHECHISCHEN Weges - Háček `ˇ` (ď ť ň) und
 * die Zeichen, die NUR wegen ihrer Grossformen hier stehen: `č š ř ž ě` (Háček) und `ý` (Čárka) liegen auf eigenen Tasten
 * (`hatEigeneTaste` sperrt sie als Kleinbuchstaben, sie sind nie ein Zwei-Schritt-Zeichen), ihre GROSSformen Č Š Ř Ž Ě Ý
 * dagegen schon: Totaste, dann Umschalt + Buchstabe (Umschalt auf der Zahlenreihe gibt die Ziffer). `á é í ó ú` mit `´`
 * stehen in {@link KOMBIZEICHEN} (Spanisch), `Ů` hat keinen Eintrag (nur Feststelltaste, `grossFehlt`).
 *
 * ⚠️ EIGENE Liste, nicht in {@link KOMBIZEICHEN}: dort griffe `ý` mit `´` auch auf es, latam, ch und be, und die drei
 * Stellen, die {@link KOMBIZEICHEN} DIREKT lesen (`corpus.ts` `totastenBuchstabeFrei`, `generator.ts` Totasten-Wörter,
 * `letters.ts` `istTotastenEinheit`), würden dort neue Zeichen sehen. Sie sehen für Tschechisch nur {@link KOMBIZEICHEN}
 * (F4: dort `ˇ` als Einheit des Weges nachziehen); alles Layout-Bezogene (`kombizeichenFuerLayout`, `kombizeichenZu`,
 * `grossbuchstabeWeg`, `fingerGuide`) liest über {@link kombizeichenListe} beide.
 */
export const KOMBIZEICHEN_CS: readonly Kombizeichen[] = [
  { zeichen: "ď", tot: "ˇ", dann: "d" },
  { zeichen: "ť", tot: "ˇ", dann: "t" },
  { zeichen: "ň", tot: "ˇ", dann: "n" },
  // nur für die Grossformen (kleine Zeichen mit eigener Taste):
  { zeichen: "č", tot: "ˇ", dann: "c" },
  { zeichen: "š", tot: "ˇ", dann: "s" },
  { zeichen: "ř", tot: "ˇ", dann: "r" },
  { zeichen: "ž", tot: "ˇ", dann: "z" },
  { zeichen: "ě", tot: "ˇ", dann: "e" },
  { zeichen: "ý", tot: "´", dann: "y" },
];

/**
 * ★ F4-cs (02.10.2026): Ist `unit` die Totaste (`^ ´ ¨ \` ˇ …) mindestens eines Kombizeichens - einer der Listen {@link KOMBIZEICHEN}
 * und {@link KOMBIZEICHEN_CS}? Der Test, ob eine Einheit eines Weges eine Totasten-Einheit ist (`istTotastenEinheit`, letters.ts;
 * `totastenWeg`, corpus.ts), muss den Háček `ˇ` kennen - er steht nur in der tschechischen Liste. Layout-UNABHÄNGIG, wie die Listen selbst;
 * ein Weg, dessen Folge keine dieser Einheiten enthält (de, en, it, pl), bekommt weiter `false`.
 */
export function istTotasteDerListen(unit: string, sprache?: Lang): boolean {
  if (KOMBIZEICHEN.some((k) => k.tot === unit) || KOMBIZEICHEN_CS.some((k) => k.tot === unit)) return true;
  // ★ G3a-SCHRIFT (25.10.2026): mit Sprache auch die Totasten ihrer eigenen Liste (griechisch `΄ ΅`, niederländisch
  // `' "`, portugiesisch `~`). Ohne Sprache - und für die acht Sprachen vor dem 25.10.2026 - dieselbe Antwort wie vorher.
  return sprache !== undefined && kombizeichenTabelle(sprache).eigene.some((k) => k.tot === unit);
}

/*
 * ★★★ G3a-SCHRIFT (25.10.2026, Falle 50/69): die Kombizeichen der neun Sprachen des Gerüsts - aus den Windows-Tabellen
 * (`pc-messung/DLL-TABELLEN-8-SPRACHEN.txt`, Abschnitte „Totaste x") und den Bauplänen §2, NUR die Zeichen, die der Weg
 * lehrt oder die in seinen Texten stehen. Die Grossformen (Ά, Ã, É …) ergeben sich wie bisher aus `kombizeichenZu`.
 */
/** Griechisch: Tonos `΄` (U+0384, Taste rechts von L), Dialytika `¨` (Umschalt + dieselbe), Dialytika mit Tonos `΅` (U+0385). */
export const KOMBIZEICHEN_EL: readonly Kombizeichen[] = [
  { zeichen: "ά", tot: "΄", dann: "α" },
  { zeichen: "έ", tot: "΄", dann: "ε" },
  { zeichen: "ή", tot: "΄", dann: "η" },
  { zeichen: "ί", tot: "΄", dann: "ι" },
  { zeichen: "ό", tot: "΄", dann: "ο" },
  { zeichen: "ύ", tot: "΄", dann: "υ" },
  { zeichen: "ώ", tot: "΄", dann: "ω" },
  { zeichen: "ϊ", tot: "¨", dann: "ι" },
  { zeichen: "ϋ", tot: "¨", dann: "υ" },
  { zeichen: "ΐ", tot: "΅", dann: "ι" },
  { zeichen: "ΰ", tot: "΅", dann: "υ" },
];
/** Portugiesisch (Portugal und Brasilien): die Tilde `~` (ã õ) - Akut, Gravis, Zirkumflex, Trema stehen schon in {@link KOMBIZEICHEN}. */
export const KOMBIZEICHEN_PT: readonly Kombizeichen[] = [
  { zeichen: "ã", tot: "~", dann: "a" },
  { zeichen: "õ", tot: "~", dann: "o" },
];
/**
 * Niederländisch auf US-International (`nl-intl`): Apostroph `'` und Anführungszeichen `"` SIND Totasten (`'` + e = é,
 * `"` + e = ë, Bauplan NL N3). Gravis und Zirkumflex stehen in {@link KOMBIZEICHEN}. `'` + c = ç gibt Windows auch -
 * kein niederländisches Lernziel, darum nicht hier.
 */
export const KOMBIZEICHEN_NL: readonly Kombizeichen[] = [
  { zeichen: "á", tot: "'", dann: "a" },
  { zeichen: "é", tot: "'", dann: "e" },
  { zeichen: "í", tot: "'", dann: "i" },
  { zeichen: "ó", tot: "'", dann: "o" },
  { zeichen: "ú", tot: "'", dann: "u" },
  { zeichen: "ä", tot: "\"", dann: "a" },
  { zeichen: "ë", tot: "\"", dann: "e" },
  { zeichen: "ï", tot: "\"", dann: "i" },
  { zeichen: "ö", tot: "\"", dann: "o" },
  { zeichen: "ü", tot: "\"", dann: "u" },
];

/** ★ G3a-SCHRIFT: welche Kombizeichen eine Sprache kennt. */
export interface TotastenDerSprache {
  /** Gilt die gemeinsame Liste {@link KOMBIZEICHEN} (^ ¨ ` ´ ¸ mit lateinischen Vokalen) für diese Sprache mit? */
  readonly grundliste: boolean;
  /** Die eigenen Kombizeichen der Sprache (cs: Háček; el: Tonos; pt/br: Tilde; nl: `'` und `"`). */
  readonly eigene: readonly Kombizeichen[];
  /**
   * `true` = „Eigene Übung" (eigenerText.ts) prüft ein Totasten-Zeichen an DIESER Liste (Totaste im Zeichenvorrat des
   * Weges, Grundbuchstabe bekannt); `false` = die alte Rechnung über vier Akzente, Byte für Byte (die acht Sprachen vor
   * dem 25.10.2026 - für cs hiesse die Liste sonst, dass ď ť ň in einer eigenen Übung plötzlich tippbar wären).
   */
  readonly eigeneUebungNachListe: boolean;
}

/**
 * ★★★ G3a-SCHRIFT (25.10.2026, Falle 50): die Kombizeichen-Liste JE SPRACHE - eine Tabelle über ALLE Sprachen (`tsc`
 * verlangt einen Eintrag für jede neue), statt `layoutSprache(layout) === "cs"`. Die acht Sprachen vor dem 25.10.2026
 * liefern Zeichen für Zeichen dieselbe Liste wie vorher (cs: {@link KOMBIZEICHEN} + {@link KOMBIZEICHEN_CS}, alle
 * anderen {@link KOMBIZEICHEN}; Wächter `tastenflow-g3a-schrift-totasten`).
 *  · bg, uk: keine Totaste auf den Bezugstastaturen (Baupläne §2) - keine Liste, auch nicht die gemeinsame.
 *  · hu: zehn Totasten nur auf AltGr, kein Lernziel (Bauplan HU H8) - keine Liste; jeder Buchstabe hat eine Taste.
 *  · ro: die Standard-Belegung hat zwölf Totasten auf AltGr (~ ˇ ^ ˘ ° ˛ ` ˙ ´ ˝ ¨ ¸), alle Buchstaben ă â î ș ț liegen
 *    direkt - Totasten nie lehren (Bauplan RO R3, §5 Nr. 2: die Cedille-Totaste bildet ş ţ statt ș ț).
 *  · sv: ´ ` ¨ ^ ~ - é (´), à (`), ü (¨) stehen in der gemeinsamen Liste; å ä ö haben eigene Tasten.
 *  · el: NUR die eigene Liste (die griechischen Totasten bilden keine lateinischen Buchstaben).
 */
const KOMBIZEICHEN_JE_SPRACHE: Readonly<Record<Lang, TotastenDerSprache>> = {
  de: { grundliste: true, eigene: [], eigeneUebungNachListe: false },
  en: { grundliste: true, eigene: [], eigeneUebungNachListe: false },
  fr: { grundliste: true, eigene: [], eigeneUebungNachListe: false },
  es: { grundliste: true, eigene: [], eigeneUebungNachListe: false },
  it: { grundliste: true, eigene: [], eigeneUebungNachListe: false },
  pl: { grundliste: true, eigene: [], eigeneUebungNachListe: false },
  tr: { grundliste: true, eigene: [], eigeneUebungNachListe: false },
  cs: { grundliste: true, eigene: KOMBIZEICHEN_CS, eigeneUebungNachListe: false },
  bg: { grundliste: false, eigene: [], eigeneUebungNachListe: true },
  el: { grundliste: false, eigene: KOMBIZEICHEN_EL, eigeneUebungNachListe: true },
  hu: { grundliste: false, eigene: [], eigeneUebungNachListe: true },
  nl: { grundliste: true, eigene: KOMBIZEICHEN_NL, eigeneUebungNachListe: true },
  pt: { grundliste: true, eigene: KOMBIZEICHEN_PT, eigeneUebungNachListe: true },
  br: { grundliste: true, eigene: KOMBIZEICHEN_PT, eigeneUebungNachListe: true },
  ro: { grundliste: false, eigene: [], eigeneUebungNachListe: true },
  sv: { grundliste: true, eigene: [], eigeneUebungNachListe: true },
  uk: { grundliste: false, eigene: [], eigeneUebungNachListe: true },
};

/** ★ G3a-SCHRIFT: der Eintrag einer Sprache - wirft bei einem unbekannten Wert (nie still eine Vorgabe, Falle 50). */
export function kombizeichenTabelle(lang: Lang): TotastenDerSprache {
  const t = KOMBIZEICHEN_JE_SPRACHE[lang];
  if (!t) throw new Error(`Keine Kombizeichen-Liste für die Sprache ${JSON.stringify(lang)}`);
  return t;
}

/** ★ G3a-SCHRIFT: alle Kombizeichen einer Sprache (die gemeinsame Liste, wo sie gilt, dann die eigene). */
export function kombizeichenDerSprache(lang: Lang): readonly Kombizeichen[] {
  const t = kombizeichenTabelle(lang);
  if (!t.grundliste) return t.eigene;
  return t.eigene.length ? [...KOMBIZEICHEN, ...t.eigene] : KOMBIZEICHEN;
}

/**
 * Die zusammengesetzten Zeichen, die für DIESES Layout in Frage kommen: die Liste der Sprache der Tastatur
 * ({@link kombizeichenDerSprache}). ★ G3a-SCHRIFT (25.10.2026): aus der Tabelle je Sprache statt `=== "cs"` - für jede
 * Tastatur der acht Sprachen vor dem 25.10.2026 DIESELBE Liste wie bisher (Falle 50: an der Eigenschaft `sprache` der
 * Tastatur, nicht an ihrer Kennung).
 */
function kombizeichenListe(layout: KeyboardLayout): readonly Kombizeichen[] {
  return kombizeichenDerSprache(layoutSprache(layout));
}

/** Liegt `zeichen` auf diesem Layout auf einer eigenen Taste (ohne Totaste)? */
function hatEigeneTaste(layout: KeyboardLayout, zeichen: string): boolean {
  if (layout.rows.some((r) => r.keys.includes(zeichen))) return true;
  const a = layout.access[zeichen];
  return a !== undefined && a.dead !== true;
}

/**
 * Die auf DIESEM Layout wirklich erreichbaren Kombizeichen - ihre Totaste
 * muss dort in `access` als `dead: true` stehen.
 */
export function kombizeichenFuerLayout(layout: KeyboardLayout): readonly Kombizeichen[] {
  // ★ W1 (27.09.2026): „ohne eigene Taste" gilt jetzt für JEDES Kombizeichen,
  // nicht nur für die mit `nurOhneEigeneTaste` - seit W1 kennen mehr Modelle
  // mehr Totasten (Windows-Tabellen): Belgien und Schweiz-Französisch den Akut
  // (´ + e = é, aber é hat dort eine eigene Taste), die Schweizer Tastatur ¨
  // (ü eigene Taste), Schweiz-Französisch ü = Umschalt + è. Ein Zeichen mit
  // eigenem Griff wird nie als Zwei-Schritt-Zeichen angesagt oder verbucht.
  return kombizeichenListe(layout).filter(
    (k) => zugangFuer(layout, k.tot)?.dead === true && !hatEigeneTaste(layout, k.zeichen),
  );
}

/**
 * Erwartet diese Stelle einen Totasten-Anschlag? Wahr, wenn `ziel` selbst nur
 * über eine Totaste erreichbar ist (z. B. „^" allein - Totaste, dann
 * Leertaste, wie im Deutschen der Zirkumflex) ODER ein zusammengesetztes
 * Zeichen dieses Layouts ist (z. B. „ê"). Beides macht ein `Dead`-Ereignis
 * zum ZWISCHENZUSTAND, nicht zum Fehlgriff (Bauplan §4.3 Punkt 5).
 */
export function erwartetTotaste(ziel: string, layout: KeyboardLayout): boolean {
  if (zugangFuer(layout, ziel)?.dead === true) return true;
  return kombizeichenZu(ziel, layout) !== undefined;
}

/**
 * Das zusammengesetzte Zeichen DIESES Layouts, das `ziel` ist - auch als
 * GROSSBUCHSTABE („Î" = Totaste „^", dann „I"). `undefined`, wenn `ziel` kein
 * Kombizeichen ist.
 *
 * ★ S3 (Mechanik-Prüfung fr, 26.09.2026): Bis hierher verglich jede Stelle
 * `k.zeichen === ziel` - also nur klein. „Être", „Ôter", „Ça" … (Eigene Übung,
 * eigene Datei, Freies Schreiben) werteten die Totaste darum als FEHLGRIFF,
 * der nächste Anschlag wurde verschluckt, und das Kind kam aus der Zeile nicht
 * heraus. EINE Funktion für alle Stellen (Übung, Schneerutsche, Ansage,
 * Verbuchung), Wächter `tests/tastenflow-mechanik-fr-totasten.test.ts`.
 */
export function kombizeichenZu(ziel: string, layout: KeyboardLayout): Kombizeichen | undefined {
  // ★ G2b-1: in der Sprache der Tastatur (türkisch „İ" ⇒ „i", nicht „i̇").
  const sprache = layoutSprache(layout);
  const klein = kleinFuer(ziel, sprache);
  if (klein === ziel) {
    // ★ W1 (27.09.2026): ein Kleinbuchstabe mit EIGENER Taste (oder eigenem
    // Umschalt-/AltGr-Griff) ist nie ein Kombizeichen - auch ohne
    // `nurOhneEigeneTaste`: „ü" liegt auf der Schweizer Tastatur (Weg „de")
    // auf einer eigenen Taste, seit W1 kennt dieses Modell aber auch die
    // ¨-Totaste. Auf Schweiz-Französisch ist ü seit W1 Umschalt + è (Windows
    // KBDSF), nicht mehr ¨ + u.
    return kombizeichenFuerLayout(layout).find((z) => z.zeichen === klein);
  }
  /*
   * ★★★ W1 (27.09.2026, BEFUND §3.2, Johannes §3.8 Punkt 2): der GROSSE
   * Buchstabe kommt über die Totaste, wenn die Tastatur ihn nicht direkt
   * erzeugt - Frankreich À È Ù (Gravis über AltGr + 7, dann Umschalt + A/E/U),
   * Schweiz-Französisch À È (Gravis) und É (Akut), Schweiz Ä Ö Ü (¨). Dafür
   * gilt `nurOhneEigeneTaste` NICHT: „à" hat auf Frankreich eine eigene
   * Taste, „À" aber nicht (Umschalt + à gibt „0").
   */
  if (grossDirekt(layout, ziel)) return undefined;
  const k = kombizeichenListe(layout).find((z) => z.zeichen === klein && zugangFuer(layout, z.tot)?.dead === true);
  if (!k) return undefined;
  return { zeichen: ziel, tot: k.tot, dann: grossFuer(k.dann, sprache) };
}

/**
 * ★ W1: Erzeugt die Tastatur diesen GROSSbuchstaben OHNE Totaste - mit
 * Umschalt auf der Taste des Kleinbuchstabens, über einen eigenen Griff
 * (`access`, z. B. Kanada CSA „É" = Umschalt + é) oder die Feststelltaste?
 * Nicht, wenn die Umschalt-Ebene der Taste schon anders belegt ist
 * (Frankreich: Umschalt + à = „0", Schweiz: Umschalt + ä = „à").
 */
export function grossDirekt(layout: KeyboardLayout, gross: string): boolean {
  const a = zugangFuer(layout, gross);
  if (a) return a.dead !== true;
  const klein = kleinFuer(gross, layoutSprache(layout));
  if (klein === gross) return false;
  if (capsUpperFuer(layout).includes(klein)) return true;
  if (!layout.rows.some((r) => r.keys.includes(klein))) return false;
  return !Object.values(layout.access).some((z) => z.base === klein && z.mod === "shift");
}

/**
 * ★ W1: Wie entsteht dieser Grossbuchstabe auf der Tastatur? „direkt"
 * (Umschalt, eigener Griff, Feststelltaste), „totaste" (Totaste, dann
 * Umschalt + Buchstabe) oder „fehlt" (Windows erzeugt ihn nicht -
 * `grossFehlt`). `null` für alles, was kein Grossbuchstabe ist oder keinen
 * bekannten Weg hat.
 */
export function grossbuchstabeWeg(
  gross: string,
  layout: KeyboardLayout,
): "direkt" | "totaste" | "fehlt" | null {
  if (gross.length !== 1 || gross === kleinFuer(gross, layoutSprache(layout))) return null;
  if (grossFehltFuer(layout).includes(gross)) return "fehlt";
  if (grossDirekt(layout, gross)) return "direkt";
  return kombizeichenZu(gross, layout) ? "totaste" : null;
}

/**
 * Benannte Sondertasten (`KeyboardEvent.key`-Werte wie „Shift", „ArrowLeft",
 * „F5", „CapsLock", „Dead" …) bestehen nur aus ASCII-Buchstaben/-Ziffern und
 * beginnen mit einem Grossbuchstaben (UI-Events-Spezifikation). Ein
 * Totasten-Artefakt nach einem Fehlgriff (Safari/Firefox: „^p") beginnt
 * dagegen mit dem Akzentzeichen selbst und fällt aus diesem Muster.
 */
const BENANNTE_TASTE = /^[A-Za-z][A-Za-z0-9]*$/;

/**
 * Ein `key`, der weder eine einzelne Taste (Länge 1) noch eine benannte
 * Sondertaste ist - das Zwei-oder-mehr-Zeichen-Artefakt eines Fehlgriffs nach
 * einer Totaste. `"Dead"` selbst zählt NICHT dazu (eigene Prüfung überall,
 * wo diese Funktion aufgerufen wird - siehe Kopf-Kommentar).
 */
export function istTotastenArtefakt(key: string): boolean {
  return key.length > 1 && !BENANNTE_TASTE.test(key);
}
