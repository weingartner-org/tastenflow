/**
 * ★★★ DER LERNWEG - welche Einführungsreihenfolge für ein Kind gilt
 * (★ E1, 24.09.2026).
 *
 * Bauplan: `apps/tastenflow/BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md`, §2.
 *
 * Heute gibt es EINEN Lehrgang, auf das Deutsche gebaut (`LETTER_ORDER` in
 * letters.ts). Neu entsteht ein zweiter Weg „en" mit eigener Reihenfolge,
 * eigenen Stufen, eigenen Texten. Der bisherige Weg heisst „de" und bleibt
 * **Byte für Byte, wie er ist** - der Wächter dafür ist
 * `tests/tastenflow-lernweg-de-unveraendert.test.ts`.
 *
 * ── DREI ACHSEN, NICHT ZWEI (§2.1) ──────────────────────────────────────────
 *  · Bedienungssprache (`lib/bedienSprache`) - wie die Schalter heissen.
 *  · Übungssprache `lang` (`account.ts`) - welche Wörter getippt werden.
 *  · **Lernweg** `lernweg` - in welcher Reihenfolge die Tasten kommen.
 * Der Name ist bewusst NICHT `lang`: Weg „de" mit `lang = "en"` ist ein echter,
 * erlaubter Fall (Entscheidung D1 - deutsche Bedienung, englische Übung).
 *
 * ── WIE DER WEG FEST WIRD (§2.2) ────────────────────────────────────────────
 * Beim ERSTEN Fortschritt (erste Übungszeile), aus der Bedienungssprache.
 * Danach nie wieder (D2) - sonst verlöre ein Kind freigeschaltete Tasten.
 * Die ganze Entscheidung steht in EINER reinen Funktion: {@link bestimmeLernweg}.
 * Fehlt der Weg (jedes heute bestehende Konto), gilt „de".
 *
 * ⚠️ FREIGABE (Johannes, 25.09.2026): Seit E10 ist der englische Lehrgang die
 * GRUNDEINSTELLUNG - {@link englischLehrgangProbeAn} liefert `true`, ausser er
 * wird ausdrücklich mit `?englisch-lehrgang=0` abgeschaltet (Not-Aus). Wer mit
 * englischer Bedienung anfängt, bekommt also wirklich Weg „en" (§2.2 D1) -
 * `?englisch-lehrgang=1` bleibt als Gegenstück nur zum ausdrücklichen
 * Wieder-Anschalten nach einem Not-Aus erhalten.
 *
 * ⚠️ ZIRKEL-FALLE: letters.ts liest diese Tabelle, und diese Tabelle liest die
 * deutschen Konstanten aus letters.ts. Darum wird sie erst beim ERSTEN Zugriff
 * gebaut ({@link lernwegDef}) - nie beim Laden des Moduls. Sonst hinge es an
 * der Lade-Reihenfolge, ob `LETTER_ORDER` schon da ist.
 */
import {
  DIGIT_ORDER,
  HOME_KEYS,
  HOME_ROW_LETTERS,
  INITIAL_LETTERS,
  INTRO_ORDER,
  LETTERS_BEFORE_SHIFT,
  LETTER_ORDER,
  PUNCT_ORDER,
  PUNKT_UND_KOMMA,
  STARTPUNKT_FOLGE,
  SYMBOL_ORDER,
  baueEinfuehrung,
  baueStartpunktFolge,
} from "./letters";
import type { BedienSprache } from "../bedienSprache/sprache";
import type { LayoutId } from "./layouts";

/**
 * Der Lernweg eines Kindes - die Einführungsreihenfolge, die für es gilt.
 *
 * ★ E2a (25.09.2026, Gerüst französischer Lehrgang): „fr" dazu - GERÜST NUR,
 * unsichtbar hinter {@link franzoesischLehrgangProbeAn}. Siehe
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §14 E2.
 *
 * ★ ES-F2 (27.09.2026, Gerüst spanischer Lehrgang): „es" dazu - GERÜST NUR,
 * unsichtbar hinter {@link spanischLehrgangProbeAn}. Siehe
 * `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §2/§9 ES-F2. Anders als „fr" in
 * E2a bekommt „es" hier noch KEINE eigene Reihenfolge (die kommt erst in
 * ES-F4, nach der Tastaturmessung ES-F3) - {@link lernwegDef} fällt für „es"
 * ausdrücklich auf den Weg „en" zurück (siehe {@link baueTabelle}).
 */
export type Lernweg = "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs" | "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";

export const LERNWEGE_LISTE: readonly Lernweg[] = ["de", "en", "fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];

/** Ist das ein gültiger Lernweg? (Für alles, was vom Server oder aus dem Speicher kommt.) */
export function istLernweg(x: unknown): x is Lernweg {
  // ★ G2a (02.10.2026, G1c §3 Nr. 2): aus der LISTE gelesen, nicht mehr als
  // handgeschriebene Kette - jeder Weg, der in `LERNWEGE_LISTE` steht, gilt.
  return typeof x === "string" && (LERNWEGE_LISTE as readonly string[]).includes(x);
}

/** Alles, was an der Einführungsreihenfolge eines Weges hängt. */
export interface LernwegDef {
  /** Die Buchstaben in Einführungsreihenfolge (ohne `⇧`). */
  letterOrder: readonly string[];
  /**
   * Die volle Reihenfolge: Buchstaben, `⇧`, `.` `,` (★ D-1), restliche
   * Buchstaben, übrige Satzzeichen, Ziffern, Sonderzeichen.
   */
  introOrder: readonly string[];
  /**
   * ★★★★★ D-1 (28.09.2026): die Folge, in der eine Startpunkt-ANZAHL
   * abgezählt wird - die Reihenfolge vor D-1 (Satzzeichen nach allen
   * Buchstaben). Dieselben Einheiten wie `introOrder`, nur Punkt und Komma
   * an ihrem alten Platz. Warum: `baueStartpunktFolge` (letters.ts).
   */
  startpunktFolge: readonly string[];
  /** So viele Buchstaben kommen vor der Umschalttaste. */
  lettersBeforeShift: number;
  /** So viele Buchstaben hat die Grundreihe (benannter Startpunkt). */
  homeRowLetters: number;
  /** Mit so vielen Einheiten beginnt ein totaler Anfänger (F und J). */
  initialLetters: number;
  punctOrder: readonly string[];
  digitOrder: readonly string[];
  /**
   * ★ E2 (24.09.2026): „£" steht für Weg „en" IMMER in dieser Liste - nicht
   * layout-abhängig gebaut. Die Tastatur-Filterung übernimmt wie bei jedem
   * anderen Zeichen ohne eigene Taste (siehe „ß" auf US/UK) `onlyExistingKeys`:
   * DE/CH/US führen „£" seither in ihrem `missing` (layouts.ts), UK nicht -
   * damit taucht „£" nur dort wirklich auf. Kein `symbolOrder(layout)` nötig.
   */
  symbolOrder: readonly string[];
  /** Kumulative Endindizes der Buchstaben-Stufen T0 … T3 in `letterOrder` (tiers.ts). */
  tierCuts: readonly number[];
  /** Die Heimattasten der Grundreihe (leichteste Anschläge). */
  homeKeys: ReadonlySet<string>;
  /**
   * ★★★★★ ES-P7a-Behebung (27.09.2026, M3, Bauplan §4.4 Punkt 1): Einheiten,
   * die NIE einzeln freigeschaltet werden dürfen, weil ihr Gegenstück ein
   * hartes Paar bildet (Spanisch: ein Fragesatz braucht „¿" UND „?" - lernt
   * ein Kind „¿" allein, entsteht neun Runden lang nur „Claro ¿ le" statt
   * eines echten Satzes). Schlüssel = öffnendes Zeichen, Wert = sein
   * Gegenstück; `advanceIntroduced` hängt bei so einem Schlüssel BEIDE an.
   * ★ D1 Nr. 19 (28.09.2026): dazu auf JEDEM Weg die Klammern ( ) [ ] { }
   * ({@link KLAMMER_PAARE}) - „Klammern als festes Paar" (Johannes).
   */
  paareGemeinsam?: Readonly<Record<string, string>>;
  /**
   * ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 S5): Welche Zeichen eine
   * Totasten-Einheit dieses Weges ergibt, wenn es WENIGER sind als alle, die
   * die Tastatur kennt. Die Freischalt-Feier stellt „¨" auf Weg „es" sonst
   * mit „ë, ï, ü, ÿ" vor - im Spanischen gibt es nur „ü". Fehlt ein Eintrag,
   * gelten alle Kombizeichen der Tastatur (so bleibt Französisch).
   */
  totastenZiele?: Readonly<Record<string, readonly string[]>>;
  /**
   * ★★★ DIE HAUPTSPRACHE DES WEGES (D1, 28.09.2026, Entscheidung Johannes
   * Nr. 18 - löst die vorläufige Bindung aus ES-M2 ab).
   *
   * Johannes (27.09.): „es gibt immer die hauptsprache und dazu die
   * möglichkeit englische texte zu schreiben die von den tasten eben nicht so
   * gut passen, so wie in deutsch. Englisch ist die weltsprache und alle
   * sollen sie zusätzlich üben können, die tastaturfolge der 1. Sprache hat
   * aber vorrang".
   *
   * Steht hier eine Sprache, ist sie die Hauptsprache: Vorgabe überall, und
   * die einzige ausser Englisch - Deutsch gibt es auf diesem Weg NIE (auf
   * Weg „fr" wird Französisch geübt oder Englisch, auf Weg „es" Spanisch oder
   * Englisch). Die Reihenfolge der Tasten bleibt die des Weges, auch bei
   * englischen Texten; Wörter, die noch nicht passen, filtert `fitText`
   * (wie auf Weg „de" mit Englisch). Fehlt das Feld (Weg „de"/„en"), sind
   * Deutsch und Englisch frei wählbar wie bisher (`LANGS` in account.ts).
   * Gelesen wird es NUR über `uebungsSprachenImWeg`/`uebungsSpracheImWeg`/
   * `hauptspracheDesWeges` (account.ts).
   */
  hauptsprache?: Hauptsprache;
  /**
   * ★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8 Punkt 2,
   * Johannes: „eigene späte Lektion nach ^, ¨ und AltGr"): ab welcher Einheit
   * Grossbuchstaben ÜBER EINE TOTASTE (Frankreich À È Ù Ê Î Ô Û Ë Ï, Belgien
   * dazu É, Schweiz-Französisch À È É …) in servierten Zeilen stehen dürfen -
   * die LETZTE Einheit des Weges, ein AltGr-Zeichen; danach kommt nur noch die
   * Text-Lektion „Les majuscules accentuées" (curriculumFr.ts). Gelesen in
   * `grossbuchstabeFrei` (corpus.ts). Fehlt das Feld, gibt es keine Schranke.
   */
  grossAkzentAb?: string;
  /**
   * ★★★ F4-it (02.10.2026, Bauplan italienischer Lehrgang I4, F3-Befund §5): die GROSSEN Akzentbuchstaben dieses
   * Weges (Italienisch `À È É Ì Ò Ù`), die auf der Tastatur keinen Griff haben, den eine frühe Lektion lehrt: am
   * Mac Option + Umschalt + Buchstabe, auf der Schweizer Belegung (Tessin) Totaste, dann Umschalt + Buchstabe. Sie
   * stehen in servierten Zeilen erst, wenn {@link grossAkzentAb} (Vorgabe: die letzte Einheit des Weges) gelernt
   * ist - `grossbuchstabeFrei` (corpus.ts). Unter Windows erzeugt die Tastatur sie auf keinem Weg (`grossFehlt`,
   * layouts.ts): dort kommen die Zeilen nie, ohne Rücksicht auf diese Liste. Fehlt das Feld, gibt es keine Schranke.
   */
  grossAkzentSpaet?: readonly string[];
  /**
   * ★★★ F4-it (02.10.2026): die ACHTE Grundtaste (rechter kleiner Finger) je Tastatur, wo sie nicht die des Weges ist
   * (`homeRowLetters`-te Einheit der Folge). Italienisch: `ò` auf Windows/Mac Pro, aber `m` auf der Mac-QZERTY, `é`
   * auf Schweiz-Französisch, `ö` (ein Fingeranker) auf der Schweizer Belegung. Der Wert ersetzt die Einheit; steht er
   * weiter hinten in der Folge, fällt er dort weg; die verdrängte Einheit kommt direkt NACH {@link verdraengtNach}
   * (gemessen, Befund F4-it §6: `ò` nach `ì`, nicht an die Stelle von `m`). Gelesen von `achteGrundtasteFuerLayout`
   * (letters.ts); die Ansage der Heimtaste (`fingers.ts`) trägt dieselben Werte - ein Wächter hält beide gleich.
   */
  achteGrundtasten?: Readonly<Partial<Record<LayoutId, string>>>;
  /** Wohin die vom Wert der Heimtaste verdrängte Einheit kommt (siehe {@link achteGrundtasten}). */
  verdraengtNach?: string;
  /**
   * ★★★ F4-cs (02.10.2026, Messbefund F4-cs §6): die Satzzeichen, die DIREKT nach `⇧` kommen (D-1: „ein Satz = Grossbuchstabe +
   * Punkt"). Vorgabe (Feld fehlt): {@link PUNKT_UND_KOMMA} (`. ,`) - auf jedem Weg bis hierher unverändert. Tschechisch hat
   * `?` als Drittes: es steht in 11,7 % (Originale) / 14,7 % (alle) der Sätze, und ohne `?` früh sind 90 % der Sätze erst bei
   * n = 44 schreibbar, mit ihm bei n = 36. Alle Einträge müssen in {@link punctOrder} stehen. Gelesen von `baueEinfuehrung`
   * (letters.ts), nie für die Startpunkt-Zählung ({@link startpunktFolge}: dort stehen alle Satzzeichen nach den Buchstaben).
   */
  punktNachShift?: readonly string[];
}

/**
 * Die dritte Stufengrenze des Weges „de" - die Erstleser-Grenze (T2 endet nach
 * `h o u c g m b w`). Stand bis E1 privat in tiers.ts als `T2_LETTER_END`.
 */
const DE_T2_LETTER_END = 21;

/**
 * ★★★ E2 (24.09.2026): Die englische Reihenfolge - Fassung A2, GEMESSEN
 * (Bauplan §3.3a): mit den Sprossen `u y w m` direkt nach `o` sind bei 17
 * Buchstaben 72 % der Oxford-Top-100 und 73 % der ursprünglichen Dolch-Liste
 * schreibbar (gegen 53 % der Fassung ohne diesen Schritt) - der grösste
 * einzelne Hebel der Messung. Nachrechnen: `scripts/messe-englische-
 * reihenfolge.mts`.
 *
 * `;` ist die 8. Grundtaste (F2: ein Fingeranker, kein Buchstabe eines echten
 * Wortes - auf DE/CH-Tastaturen ersetzt {@link achteGrundtasteFuerLayout} sie
 * durch die dort wirklich liegende Taste „ö", F3). Damit hat `letterOrder` 27
 * statt 26 Einträge (wie „de" mit 30 statt 26 - vier zusätzliche Buchstaben);
 * `;` taucht als SATZZEICHEN darum NICHT zusätzlich auf (§3.3a).
 */
const EN_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Fingeranker) - „;" ist die 8. Taste, kein Buchstabe.
  "f", "j", "d", "k", "s", "l", "a", ";",
  // häufigste englische Buchstaben zuerst (Norvig/Google Books, §3.2/§3.3)
  "e", "i", "n", "r", "t", "h", "o",
  // gemessener Hebel (§3.3a): du, your, my, was, with, what, when, why, way,
  // now, how, yes werden hier auf einen Schlag schreibbar.
  "u", "y", "w", "m",
  "c", "g", "p", "b",
  "v", "x", "q", "z",
];

/** Grundreihe (8) + `e i n r t h o` (7) - siehe „de"s `LETTERS_BEFORE_SHIFT`. */
const EN_LETTERS_BEFORE_SHIFT = 15;

/** T2-Grenze (§3.5): + `u y w m c g p b` (8 weitere) nach der Umschalttaste. */
const EN_T2_LETTER_END = 23;

/**
 * Satzzeichen des Weges „en" (§3.3, Zeile „dann"): `;` fehlt hier bewusst -
 * es steht schon in der Grundreihe. `'` und `"` sind hier Satzzeichen (nicht
 * Sonderzeichen wie im Deutschen) - auf US wie auf UK an derselben Stelle
 * erreichbar (don't, it's), darum früh.
 */
const EN_PUNCT_ORDER: readonly string[] = [".", ",", "'", "?", "!", "-", ":", "\""];

/**
 * Sonderzeichen des Weges „en" (§3.3 Zeile „dann"): wie `SYMBOL_ORDER`, aber
 * ohne `§ °` (auf US/UK-Tastaturen nicht vorhanden; `€` seit D1 am Ende, siehe
 * unten - UK hat es auf AltGr + 4) und ohne `' "`
 * (die sind jetzt Satzzeichen, siehe oben). `\` ist neu (auf US UND UK eine
 * eigene Taste, im Deutschen bisher kein Lernziel). `£` steht IMMER in der
 * Liste - nur UK hat sie nicht in `missing` (layouts.ts), darum taucht sie
 * nur dort wirklich auf (siehe {@link LernwegDef.symbolOrder}).
 */
const EN_SYMBOL_ORDER: readonly string[] = [
  "(", ")", "+", "*", "/", "\\", "=", "%", "&", "@", "#", "$", "£",
  "<", ">", "[", "]", "{", "}", "|", "^", "~",
  // ★ D1 Nr. 6 (28.09.2026, Didaktik-Recherche Englisch E7): „€" fehlte hier
  // mit der Begründung „auf US/UK-Tastaturen ohnehin nicht vorhanden" - auf
  // UK (und Irland) liegt es auf AltGr + 4 (layouts.ts, `UK.access`). Wie
  // „£" steht es IMMER in der Liste; US führt es in `missing`, dort taucht es
  // nicht auf. Bewusst ANS ENDE (Weg „en" ist live): jede Sprosse davor
  // bleibt, wo sie war - ein Startpunkt nach Anzahl trifft dieselben Tasten,
  // und wer schon weiter ist, bekommt „€" als nächste Taste dazu.
  "€",
];

/**
 * Die Heimattasten des Weges „en" (F2: `a s d f j k l ;`). „ö" steht
 * ZUSÄTZLICH dabei - auf DE/CH ersetzt {@link achteGrundtasteFuerLayout} das
 * „;" der 8. Grundtaste durch „ö"; ohne diesen Eintrag würde `keyDifficulty`
 * diese Taste dort fälschlich als „Reichweite" statt als Grundreihe werten.
 * Auf US/UK kommt „ö" nie vor (`missing`, layouts.ts) - der Eintrag ist dort
 * wirkungslos.
 */
const EN_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", ";", "ö"]);

/**
 * ★★★ E3 (25.09.2026, Bauplan §5.3 Fassung A, §5.4, §3.1): die AZERTY-
 * Grundreihe ist jetzt ECHT (`q s d f j k l m` - Bauplan §3.1 „Grundreihen",
 * Auftrag E3 Punkt 4) - „m" ersetzt den E2a-Platzhalter „;" als 8. Taste, ein
 * echter, häufiger Buchstabe statt eines reinen Fingerankers (F2). Auf
 * Schweiz-Französisch/Kanada bringt {@link achteGrundtasteFuerLayout}
 * (letters.ts) diese AZERTY-Grundform auf die dort WIRKLICH liegenden Tasten
 * (`a … é` bzw. `a … ;`) - siehe dort.
 *
 * ⚠️ **ÜBERHOLT durch Fassung A2 (25.09. abends, siehe FR_LETTER_ORDER)** - „a" steht jetzt drin;
 * Schweiz/Kanada entdoppelt `achteGrundtasteFuerLayout`. Früher: „a" fehlte hier bewusst - AZERTY
 * hat es nicht in der Grundreihe (anders als Schweiz-Französisch/Kanada, wo
 * `achteGrundtasteFuerLayout` die erste Taste ohnehin zu „a" macht - dort
 * taucht „a" also gar nicht doppelt auf). Für die AZERTY-Belegungen selbst
 * (fr/be) bleibt „a" bis E5 ein fehlender Buchstabe im Lernweg - **nicht
 * improvisiert**: Wohin es in Fassung A gehört (Bauplan §5.3, Sprosse 12,
 * „e i u a n o t r"), hängt an der echten Messung (Bauplan §5.2), nicht an
 * einer Annahme aus E3.
 *
 * ★★★ E4 (25.09.2026, Bauplan §4.3 Punkt 2, §14 E4): Die Totaste `^` ist
 * jetzt eine EIGENE Lerneinheit, direkt nach `à è` (Bauplan §5.3, Sprosse 28:
 * „à è · ^ (Totaste)") - genau wie `⇧` ist sie einmal gelernt, danach frei:
 * `ê â î ô û` werden schreibbar, SOBALD ihr Grundvokal (`e a i o u`, alle
 * schon vor Sprosse 15 gelernt) ebenfalls frei ist (Wächter:
 * `tests/tastenflow-lernweg-fr-totaste.test.ts`, „fête passt erst nach ^").
 * `¨` steht GENAUSO danach (dieselbe Mechanik für `ë ï ü ÿ`) - **noch
 * vorläufig platziert**: Bauplan §5.3 setzt sie erst nach `x y z ç ù w k`
 * (Sprosse 36), die es im Lernweg noch nicht gibt (TODO FR: E5/E9 holt sie
 * nach und verschiebt `¨` dann an die richtige Stelle). `ü`/`ÿ` bleiben bis
 * dahin ohnehin unschreibbar, weil ihre Grundbuchstaben `u`/`y` fehlen (`y`:
 * TODO FR: E5/E9) bzw. `u` zwar frei ist, aber `ü` kein Lehrgang-Ziel vor E5
 * ist (kein Wort mit `ü` im Korpus vor E9). Ebenso fehlen weiterhin `ç ù` und
 * alles ab „x y z" (Bauplan §5.3, Rest der Tabelle) - TODO FR: E5/E9.
 */
const FR_LETTER_ORDER: readonly string[] = [
  // ★★★ FASSUNG A2 (25.09.2026 abends, Entscheidung des Chats nach E5 -
  // `BEFUND-2026-09-25-E5-REIHENFOLGE.md` §8, Nachtlauf §1): gemessen an Manulex
  // (Schulbuch-Formen CP/CE1/CE2-CM2) und 122.598 Tatoeba-Originalsätzen, mit den
  // Regeln der echten Übung (Auto-Grossschreibung vor Maj, Satzzeichen später).
  // Grundreihe (AZERTY-Form; Schweiz/Kanada: `achteGrundtasteFuerLayout`).
  // ★ 26.09.2026 abends: in der Folge des Bauplans §5.3 „f j · d k · s l · q m"
  // (die Fingeranker zuerst, wie „de"/„en") - bis dahin stand hier die
  // POSITIONS-Folge „q s d f j k l m", und `initialLetters` = 2 liess
  // Anfänger mit Q und S beginnen (gefunden beim Bau der Lektionen, E10b-2).
  "f", "j", "d", "k", "s", "l", "q", "m",
  // T1: die gemessene Folge - `t n` früh, Hände wechseln sich ab.
  "e", "t", "n", "u", "i", "a", "o", "r",
  // Die ersten ganzen Sätze entstehen mit `p c v`.
  "p", "c", "v",
  // Elision und é (Ziffernreihe links) - DANACH Maj (mit dem Punkt).
  "'", "é",
  // T2-Rest.
  "b", "g", "h",
  // Ziffernreihe rechts und die Totaste `^` (★ E4: eigene Lerneinheit).
  "à", "^", "è",
  // Seltene Buchstaben.
  "x", "z", "y", "ç", "ù", "w",
  // Trema-Totaste (Maj + ^) - ë ï ü ÿ.
  "¨",
];

/** Grundreihe (8) + `e t n u i a o r` (8) + `p c v` (3) + `' é` (2): Maj danach (Fassung A2). */
const FR_LETTERS_BEFORE_SHIFT = 21;

/** T1-Grenze (§5.4, A2): Grundreihe + `e t n u i a o r`. */
const FR_T1_LETTER_END = 16;

/** T2-Grenze (§5.4, A2): + `p c v ' é` + `b g h` (Maj zählt nicht als Buchstabe). */
const FR_T2_LETTER_END = 24;

/**
 * Satzzeichen des Weges „fr" (Bauplan §5.3, Zeile „dann") - ★ E9a
 * (26.09.2026): „;" NACHGETRAGEN. Der Kopf-Kommentar von E2a übernahm den
 * Satz aus der englischen Vorlage unbesehen - „;" steht dort wirklich in der
 * Grundreihe (`EN_LETTER_ORDER`), auf AZERTY (`FR_LETTER_ORDER`) dagegen
 * NICHT: die französische Grundreihe endet mit „m" (Bauplan §3.1/§5.3), „;"
 * ist auf FR/BE/CA eine EIGENE Taste ohne Umschalt (`layouts.ts`, Zeile 3 der
 * unteren Reihe: „, ; : !" alle direkt hintereinander ohne Modifikator), auf
 * ch-fr wie ihr Nachbar „:" über Umschalt (Komma-Taste + Umschalt, geerbt von
 * `CH.access`). Reihenfolge nach Bauplan §5.3 „dann"-Zeile: `, ; : ! ? " - ( )`.
 * `« »` fehlen weiter ganz (brauchen eine eigene Ersatz-Regel, F7, TODO FR: E9 Rest).
 */
const FR_PUNCT_ORDER: readonly string[] = [".", ",", ";", ":", "!", "?", "\"", "-", "(", ")"];

/**
 * Sonderzeichen des Weges „fr" (Bauplan §5.3, Zeile „dann") - ★ E9a
 * (26.09.2026): gegen `layouts.ts` (fr/be/ch-fr, die drei Pflicht-Tastaturen
 * F2) geprüft, statt wie zuvor die Bauplan-Reihenfolge unbesehen zu
 * übernehmen. Ergebnis: `& _ / % + = * < >` brauchen höchstens Umschalt (auf
 * FR/BE teils direkt, auf ch-fr über die geerbte Schweizer Belegung), die
 * restlichen acht (`@ € [ ] { } # |`) brauchen auf ALLEN drei Pflicht-
 * Tastaturen AltGr - darum jetzt ans Ende gestellt (schwerster Griff
 * zuletzt, wie überall im Lehrgang). Die relative Reihenfolge innerhalb jeder
 * der beiden Gruppen bleibt wie im Bauplan vorgeschlagen. Kein Zeichen dieser
 * Liste fehlt auf einer Pflicht-Tastatur ganz. ⚠️ Offen (nicht Teil dieser
 * Änderung, siehe Befund): auf Belgien ist die Umschalt-/AltGr-Form der
 * `Equal`-Taste (trägt dort `+`/`}`) laut `layouts.ts`-Kommentar UNGEMESSEN -
 * „=" selbst ist auf Belgien keine eigene Taste (der Bauplan §14 E3 verbietet
 * eine geratene Belegung; das gehört einer echten Gerätemessung, nicht E9a).
 */
const FR_SYMBOL_ORDER: readonly string[] = [
  "&", "_", "/", "%", "+", "=", "*", "<", ">", "@", "€", "[", "]", "{", "}", "#", "|",
];

/**
 * ★ E3 (25.09.2026): die Heimattasten des Weges „fr" - die UNION aller
 * physisch möglichen Grundreihen-Enden (Bauplan §3.1), weil `keyDifficulty`
 * (letters.ts) das bereits auf die aktive Tastatur GEBRACHTE Zeichen prüft
 * (nach {@link achteGrundtasteFuerLayout}): AZERTY liefert „q"/„m", Schweiz-
 * Französisch „a"/„é", Kanada „a"/„;" - und auf einer Übergangs-Tastatur ohne
 * französisches Layout (vor E5/E6) weiterhin „a"/„ö"/„;" wie beim E2a-
 * Platzhalter. Jedes davon muss als Grundreihen-Anschlag zählen, unabhängig
 * davon, welche Tastatur gerade eingestellt ist.
 */
const FR_HOME_KEYS: ReadonlySet<string> = new Set([
  "q", "a", "s", "d", "f", "j", "k", "l", "m", "é", ";", "ö",
]);

/**
 * ★★★ ES-F4 (27.09.2026, Bauplan spanischer Lehrgang §4.3 Fassung A): die
 * echte spanische Reihenfolge - GEMESSEN (Tatoeba spa, nur Originalsätze,
 * kurze Sätze als Ersatz für eine fehlende Kinderliste, siehe
 * `recherche-spanisch-2026-09-26/messung-mac-tastaturen-und-reihenfolge.md`
 * §2). Grundreihe wie Englisch/Französisch: F J (Fingeranker) - D K (Ring) -
 * S L (Mittel) - A Ñ (kleiner Finger) - auf BEIDEN Pflicht-Tastaturen (ES,
 * LatAm) physisch IDENTISCH (anders als Französisch: keine
 * `achteGrundtasteFuerLayout`-Abbildung nötig).
 *
 * Die Akzent-Totaste `´` (á é í ó ú) steht - anders als Französisch „^", das
 * erst spät kommt - schon nach dem ersten gemessenen Buchstabenblock: „der
 * Akzent kommt nach 10-11 Buchstaben und bringt dann den grössten Sprung
 * (+11 Punkte bei den 100 häufigsten Wörtern)" (Bauplan §4.2). Mayús folgt
 * DANACH (wie im Französischen nach é - Satzanfänge brauchen fast immer schon
 * Buchstaben der zweiten Stufe). Die Trema-Totaste `¨` (ü) steht spät, wie im
 * Französischen. `k` ist bereits die vierte Grundtaste (Ring rechts) - anders
 * als die Bauplan-Kurzformel "…¨ w k" am Ende glauben lässt: das gemessene
 * Ergebnis (§4.2) endet nach der Grundreihe nirgends erneut auf „k" (Tatoeba
 * zeigt seine Häufigkeit schon VOR der Grundreihe verbraucht) - hier daher
 * bewusst nur „w" als letzte Einheit, siehe
 * `BEFUND-2026-09-27-ES-F3F4-TASTATUREN-REIHENFOLGE.md` §2 für die Abwägung.
 */
const ES_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge, Bauplan §4.3).
  "f", "j", "d", "k", "s", "l", "a", "ñ",
  // gemessene Folge (kurze Sätze, §4.2, näher an Kindersprache).
  "e", "o", "n", "t", "u", "r", "c", "i", "m",
  // Akzent-Totaste - danach sind á é í ó ú frei (grösster Sprung, §4.2).
  "´",
  // (Mayús folgt hier - siehe ES_LETTERS_BEFORE_SHIFT - danach:)
  "p", "q", "b", "g", "h", "v", "y",
  // seltene Buchstaben.
  "z", "x",
  // Trema-Totaste - danach ist ü frei.
  "¨",
  "w",
];

/** Grundreihe (8) + `e o n t u r c i m` (9) + `´` (1): Mayús danach (Bauplan §4.3). */
const ES_LETTERS_BEFORE_SHIFT = 18;

/** T1-Grenze: Grundreihe + die neun gemessenen Buchstaben (vor dem Akzent). */
const ES_T1_LETTER_END = 17;

/** T2-Grenze: + Akzent + `p q b g h v y` (die zweite, nach Mayús gelernte Gruppe). */
const ES_T2_LETTER_END = 25;

/**
 * Satzzeichen des Weges „es" (Bauplan §4.3/§4.4): `¿ ?` und `¡ !` stehen als
 * PAAR nebeneinander - ihre Freischaltung GEMEINSAM regelt nicht diese Liste
 * (introOrder führt jede Einheit einzeln), sondern `fitText` (corpus.ts): eine
 * Zeile mit `¿`/`?` passt nur, wenn BEIDE gelernt sind (§4.4 Punkt 2, harte
 * Paare - wie der Apostroph, nie stillschweigend halbiert).
 */
const ES_PUNCT_ORDER: readonly string[] = [
  ".", ",", "¿", "?", "¡", "!", ";", ":", "\"", "-", "(", ")",
];

/**
 * Sonderzeichen des Weges „es" (Bauplan §4.3: „wie Französisch, je Tastatur gefiltert").
 *
 * ★ D1 Nr. 13 (28.09.2026, Entscheidung Johannes: „Apostroph sollen sie
 * lernen, späte Sprosse"): `'` als LETZTE Zeichen-Sprosse. Auf Spanien UND
 * Lateinamerika eine eigene Grundtaste (Scancode 0C, rechts neben der 0,
 * links neben ¡/¿ - layouts.ts, beide gemessen), kleiner Finger rechts. Im
 * Spanischen selten, aber in Wörtern mayasprachiger Herkunft (ma'alob,
 * tz'utujil, yuum bo'otik) - ohne die Sprosse blieben drei Serien für immer
 * draussen (`serienEs.ts`). Name/Ansage spanisch: „apóstrofo" (fingers.ts,
 * letters.ts), Erklärung tastenErklaerungEs.ts.
 */
const ES_SYMBOL_ORDER: readonly string[] = [
  "%", "€", "$", "@", "/", "&", "*", "+", "=", "_", "<", ">", "[", "]", "{", "}", "#", "|", "'",
];

/**
 * Die Heimattasten des Weges „es" - auf ES UND LatAm PHYSISCH IDENTISCH
 * (anders als Französisch), darum eine einzige, layout-unabhängige Menge.
 */
const ES_HOME_KEYS: ReadonlySet<string> = new Set(["f", "j", "d", "k", "s", "l", "a", "ñ"]);

/**
 * ★★★ F4-it (02.10.2026, Bauplan italienischer Lehrgang §1.2 I1-I6, Befund `BEFUND-2026-10-02-F4-IT-REIHENFOLGE.md`):
 * die italienische Reihenfolge - GEMESSEN an 205.769 Tatoeba-Originalsätzen (3-12 Wörter) und 33.523 Wortformen
 * (`scripts/messe-italienische-reihenfolge.mts`). Grundreihe der Tastatur `it` (Windows „Italiano" 141/142, Mac
 * „Italiano - Pro"): `a s d f j k l ò` - in der Lern-Folge `f j d k s l a ò` (F J zuerst, Falle 41).
 *
 * Danach die häufigsten Buchstaben in Blöcken (Häufigkeit im laufenden Text, Hände wechseln sich ab):
 *  · `i e o n r t c u` - acht Buchstaben, die ersten echten Wörter (Top-100-Wörter 53 %, Text 52 %),
 *  · `m v p` - dann Umschalt (mit Punkt und Komma, D-1), danach
 *  · `g h b z` - die vier Buchstaben, die die meisten weiteren Sätze sperren (38/33/24/20 % der Sätze),
 *  · `è à '` - die zwei häufigsten Akzentbuchstaben (11,6 %/11,1 % der Sätze) und der Apostroph der Elision (7,7 %),
 *  · `q é ì ù` - `q` (11,5 %), dann die seltenen Akzentbuchstaben (`é` 1,1 %, `ì` 2,2 %, `ù` 1,7 %), `é` NACH Umschalt:
 *    es ist auf `it` Umschalt + `è` (Bauplan §2),
 *  · `y w x` - Fremdwörter und Namen (`j k` stehen schon in der Grundreihe, `ç` ist kein Lernziel).
 * `à è é ì ò ù` sind EINHEITEN wie jeder Buchstabe (keine Totaste, Bauplan I3); der Apostroph ist ein Buchstabe der
 * Folge (wie im Französischen), keine Sonderzeichen-Stufe - er ist auf `it`, `it-qzerty`, `ch-fr` und `ch` eine
 * Taste ohne Umschalt.
 *
 * Auf der Mac-QZERTY sitzt `m` auf der achten Grundtaste, auf `ch-fr` `é`, auf `ch` `ö` (siehe
 * {@link LernwegDef.achteGrundtasten}); `letterOrder` ist die Folge der Tastatur `it` (Bezugsbelegung, I2).
 */
const IT_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge): Fingeranker zuerst, `ò` ist die achte Heimtaste.
  "f", "j", "d", "k", "s", "l", "a", "ò",
  // T1: die gemessene Folge - erste echte Wörter.
  "i", "e", "o", "n", "r", "t", "c", "u",
  // Die ersten ganzen Sätze entstehen mit `m v p` - danach Maj.
  "m", "v", "p",
  // T2-Rest: die vier grössten Sperren.
  "g", "h", "b", "z",
  // Akzente und Elision.
  "è", "à", "'",
  "q", "é", "ì", "ù",
  // Fremdwörter und Namen.
  "y", "w", "x",
];

/** Grundreihe (8) + `i e o n r t c u` (8) + `m v p` (3): Maj danach. */
const IT_LETTERS_BEFORE_SHIFT = 19;

/** T1-Grenze: Grundreihe + `i e o n r t c u`. */
const IT_T1_LETTER_END = 16;

/** T2-Grenze: + `m v p g h b z` (Maj zählt nicht als Buchstabe). */
const IT_T2_LETTER_END = 23;

/**
 * Satzzeichen des Weges „it": `. ,` zuerst (D-1: direkt nach ⇧), danach nach der Messung der Satzzeichen (nach allen
 * Buchstaben-Einheiten: `.` 49 %, `?` 80 %, `"` 89 %, `!` 96 %, `,` 100 % der Sätze - Befund §5.3): `? !` (Fragen und
 * Ausrufe), `"` (wörtliche Rede, Bauplan I7/I8: nie ein Dialogstrich), `: ;`, `-`, `( )`. Der Apostroph steht in der
 * Buchstabenfolge. `« »` fehlen auf `it` und werden zu `"` (layouts.ts, `ersatz`).
 */
const IT_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", "\"", ":", ";", "-", "(", ")"];

/**
 * Sonderzeichen des Weges „it": die Zeichen, die `it` mit höchstens Umschalt erreicht, zuerst; `€` (Preise stehen nach
 * der Zahl, I19) und die AltGr-Zeichen zuletzt (`@ # [ ]`). `{ } ~ \`` fehlen auf `it` (layouts.ts) und fallen in
 * `onlyExistingKeys` weg; `º ª °` sind kein Lernziel (I9).
 */
const IT_SYMBOL_ORDER: readonly string[] = [
  "%", "&", "/", "+", "*", "=", "_", "<", ">", "$", "|", "€", "@", "#", "[", "]", "{", "}",
];

/**
 * Die Heimtasten des Weges „it": die UNION der achten Grundtasten aller italienischen Tastaturen (`ò` it, `m`
 * QZERTY, `é` ch-fr, `ö` ch) - wie bei „fr" (FR_HOME_KEYS): `keyDifficulty` prüft das schon auf die Tastatur
 * gebrachte Zeichen und kennt die Tastatur nicht.
 */
const IT_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", "ò", "m", "é", "ö"]);

/** Die großen Akzentbuchstaben, die der italienische Weg erst spät serviert (siehe {@link LernwegDef.grossAkzentSpaet}). */
const IT_GROSS_AKZENT: readonly string[] = ["À", "È", "É", "Ì", "Ò", "Ù"];

/**
 * ★★★ F4-pl (02.10.2026, Befund `BEFUND-2026-10-02-F4-PL-REIHENFOLGE-MESSUNG.md`): die polnische Reihenfolge - GEMESSEN an
 * 122.780 Tatoeba-Sätzen (4.919 Originale) und 50.466 Wortformen (`scripts/messe-polnische-reihenfolge.mts`; die Wort-Suche
 * über 658.000 Wörter ist stabil: Originale gegen alle Sätze Rangkorrelation 0,993, ohne Tom/Mary identisch). Grundreihe der
 * Tastatur `pl` (Windows „Polski (programisty)", Mac „Polish - Pro", ANSI wie `us`): `a s d f j k l ;` - in der Lern-Folge
 * `f j d k s l a ;` (F J zuerst, Falle 41); `;` ist wie auf Weg „en" ein Fingeranker, kein Buchstabe (deckt nichts).
 *
 * Die neun polnischen Buchstaben sind je ein AltGr-Griff (AltGr + Grundbuchstabe, `ź` auf `x`) und stehen EINZELN nach ihrem
 * Nutzen, nie vor ihrem Grundbuchstaben - als Block ab Platz 16 sänken sie die Wortdeckung bei n = 24 von 70 auf 48 %, alle
 * zuletzt liessen bei n = 27 nur 11 % der Sätze schreibbar:
 *  · `w o n t e i m z` (Stufe 1, n = 16: 32 % der Wörter im Text),
 *  · `ę` als ERSTER AltGr-Griff (mit dem schon gelernten `e`; `się` ist die zweithäufigste Wortform), dann `c y r p u`,
 *  · Umschalt nach der 22. Einheit (Entscheidung, nicht gemessen: die Kennzahl ist für ⇧ blind) - nach dem ersten und vor
 *    dem zweiten AltGr-Griff, damit nie zwei neue Griffe in einer Lektion kommen; dann `. ,` (D-1),
 *  · `ł b`, danach `g ż ą ś ć h ó ń` (`ń` spät und nach dem NVDA-Hinweis: AltGr + N ist unter Windows mit der
 *    NVDA-Standardverknüpfung nicht tippbar, Falle 67),
 *  · `x ź v q`: `q v x` kommen nur in Fremdwörtern vor; `x` steht nur als Voraussetzung von `ź`.
 * 89 % aller Sätze enthalten einen polnischen Buchstaben: vor n = 17 gibt es keinen ganzen Satz, vor n = 23 weniger als 10 % -
 * frühe Zeilen sind Silben- und Wortreihen (Texte: F5, nicht diese Etappe).
 */
const PL_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge): Fingeranker zuerst; `;` ist die achte Heimtaste.
  "f", "j", "d", "k", "s", "l", "a", ";",
  // Stufe 1: der gemeinsame Kern aller gierigen Folgen und der Häufigkeit.
  "w", "o", "n", "t", "e", "i", "m", "z",
  // Der erste AltGr-Griff (ę) und die nächsten einfachen Buchstaben.
  "ę", "c", "y", "r", "p", "u",
  // (⇧ folgt hier, siehe PL_LETTERS_BEFORE_SHIFT.) Der zweite AltGr-Griff und der Rest nach Nutzen.
  "ł", "b", "g", "ż", "ą", "ś", "ć", "h", "ó", "ń",
  // Fremdwörter; `x` nur als Voraussetzung von `ź` (AltGr + x).
  "x", "ź", "v", "q",
];

/** Grundreihe (8) + `w o n t e i m z` (8) + `ę c y r p u` (6): ⇧ danach. */
const PL_LETTERS_BEFORE_SHIFT = 22;

/** T1-Grenze: Grundreihe + `w o n t e i m z` (n = 16: 32 % der Wörter, 37 % der Top-100-Formen). */
const PL_T1_LETTER_END = 16;

/** T2-Grenze: + `ę c y r p u` + `ł b` (n = 24: 70 % der Wörter, 73 % der Top-100-Formen). */
const PL_T2_LETTER_END = 24;

/**
 * Satzzeichen des Weges „pl" (Befund §7, gemessen): `.` macht 64 %, `,` 81 %, `?` 94,5 %, `!` 98 % der Sätze komplett; danach
 * nach Satzanteil `- " :`, dann `( )`, `'`. `;` fehlt hier bewusst: es steht in der Grundreihe. `„ ” « »` fallen auf `"` (layouts.ts,
 * `PL_ERSATZ`). Klammern als festes Paar (KLAMMER_PAARE).
 */
const PL_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", "-", "\"", ":", "(", ")", "'"];

/**
 * Sonderzeichen des Weges „pl": was `pl` mit höchstens Umschalt erreicht zuerst, `€` und die übrigen AltGr-Zeichen zuletzt.
 * `£ § ° ~ ä ö ü ß` fehlen auf `pl` (`PL_FEHLT`) und sind kein Lernziel; `^` ist auf `pl` Umschalt + 6.
 */
const PL_SYMBOL_ORDER: readonly string[] = [
  "%", "&", "/", "+", "*", "=", "_", "<", ">", "$", "|", "\\", "@", "#", "^", "[", "]", "{", "}", "€",
];

/**
 * Die Heimtasten des Weges „pl" (`a s d f j k l ;`) - `ö` steht ZUSÄTZLICH dabei wie auf Weg „en": auf deutscher oder
 * Schweizer Hardware ersetzt `achteGrundtasteFuerLayout` das `;` durch `ö`, und `keyDifficulty` soll diese Taste dort als
 * Grundreihe werten.
 */
const PL_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", ";", "ö"]);

/** Die grossen polnischen Buchstaben (AltGr + Umschalt + Buchstabe) - ein Dreiergriff, den der Weg erst spät lehrt. */
const PL_GROSS_AKZENT: readonly string[] = ["Ą", "Ć", "Ę", "Ł", "Ń", "Ó", "Ś", "Ź", "Ż"];

/**
 * ★★★ F4-tr (02.10.2026, Befund `BEFUND-2026-10-02-F4-TR-REIHENFOLGE-MESSUNG.md`): die türkische Reihenfolge auf der Q-Tastatur
 * (`tr-q`, Windows „Türkçe Q", Mac „Turkish - QWERTY - PC") - GEMESSEN an 42.138 Tatoeba-Originalsätzen (3-12 Wörter) und
 * 44.644 Wortformen (`scripts/messe-tuerkische-reihenfolge.mts`; stabil auf allen Teilmengen, ein lokales Optimum). Grundreihe
 * `a s d f | j k l ş` - in der Lern-Folge `f j d k s l a ş` (F J zuerst, Falle 41).
 *
 *  · `e i n` (in 87-88 % der Sätze), `m b r` (die häufigsten Funktionswörter: mi, ama, ben, bir), `ı t y`, `o u` -
 *    dann `⇧ . ,` (n = 19: 50 % der Wörter, 4,8 % der Sätze),
 *  · `e` VOR `i`: einzige Abweichung von der gemessenen Folge. Der Vorsprung von `i` bei n = 9 ist ein Namens-Artefakt (der Name
 *    „Ali" steht in 9,8 % der Originalsätze); `e` liegt auf dem linken Mittelfinger, `i` ist die Streckentaste rechts von `ş`.
 *  · `i` und `ı` sind GETRENNTE Einheiten auf zwei Tasten (i: Platz 10, ı: Platz 15, fünf Plätze auseinander); `I` und `İ` entstehen
 *    nur über `grossFuer`/`kleinFuer` mit dem Gebietsschema `tr` (sprachRegister.ts), nie über `toUpperCase()` ohne Sprache,
 *  · `z ç h`, `g ğ ü v`, `p c ö`: die seltenen Buchstaben am Ende (jeder sperrt 20-35 % der Sätze), `ü ğ ç ö` nach Satzabdeckung,
 *  · der Apostroph `'` an Platz 30 (nur mit Umschalt + 2 tippbar; Entscheidung des Chefs nach Befund §6.4: er kostet früher 2-9
 *    Punkte Satzabdeckung - die Texte schreiben bis dahin Eigennamen ohne Endung), danach die Zirkumflex-Totaste `^` (Umschalt + 3:
 *    â î û) und die Fremdwort-Buchstaben `w x q`.
 * Türkisch braucht rund drei Einheiten mehr als Französisch für dieselbe Abdeckung (50 % der Wörter bei 19, 50 % der Sätze bei 27):
 * Wortübungen, nicht Sätze, tragen die erste Hälfte des Weges.
 */
const TR_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge): Fingeranker zuerst; `ş` ist die achte Heimtaste.
  "f", "j", "d", "k", "s", "l", "a", "ş",
  // T1: `e i n` · `m b r` · `ı t y` · `o u` (die Hälfte der Wörter).
  "e", "i", "n", "m", "b", "r", "ı", "t", "y", "o", "u",
  // (⇧ folgt hier, siehe TR_LETTERS_BEFORE_SHIFT.) T2: z ç h · g ğ ü v.
  "z", "ç", "h", "g", "ğ", "ü", "v",
  // T3: p c ö, Apostroph (nur mit Umschalt), Totaste ^, Fremdwörter.
  "p", "c", "ö", "'", "^", "w", "x", "q",
];

/** Grundreihe (8) + `e i n m b r ı t y o u` (11): ⇧ danach (n = 19). */
const TR_LETTERS_BEFORE_SHIFT = 19;

/** T1-Grenze: ⇧ kommt hier (die Hälfte der Wörter im Text). */
const TR_T1_LETTER_END = 19;

/** T2-Grenze: + `z ç h g ğ ü v` (n = 26 mit ⇧ als 20.: 40 % der Sätze, 84 % der Wörter). */
const TR_T2_LETTER_END = 26;

/**
 * Satzzeichen des Weges „tr" (Befund §6.2, gemessen): `. , ? ! : "` in dieser Folge (Punkt allein macht 66,9 % der Originalsätze mit
 * Satzzeichen schreibbar, + Komma 76,1 %, + `?` 93,7 %, + `!` 95,5 %, + `:` 95,6 %, + `"` 100 %); danach `; -` und die Klammern
 * (nicht gemessen). Der Apostroph steht in der BUCHSTABEN-Folge.
 */
const TR_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", ":", "\"", ";", "-", "(", ")"];

/**
 * Sonderzeichen des Weges „tr": was `tr-q` mit höchstens Umschalt erreicht zuerst, die AltGr-Zeichen zuletzt. ★ F8-tr (03.10.2026):
 * `₺` (AltGr + T) und `½` (AltGr + 5) stehen jetzt am Ende, hinter `€` - die Türkische Lira ist die Währung des Landes und `₺150` das
 * Preisformat des Programms (`charDrillLine`); beide haben seit F3-tr in allen Bedienungssprachen einen Namen („Türk lirası", „yarım",
 * Falle 24). `'` und `^` stehen in der Buchstaben-Folge, `~ £ §` und die Typografie sind auf `tr-q` kein Lernziel.
 */
const TR_SYMBOL_ORDER: readonly string[] = [
  "%", "&", "/", "+", "*", "=", "_", ">", "<", "$", "@", "#", "[", "]", "{", "}", "\\", "|", "€", "₺", "½",
];

/** Die Heimtasten des Weges „tr" auf der Q-Tastatur: `a s d f | j k l ş`. */
const TR_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", "ş"]);

/**
 * ★★★ F4-cs (02.10.2026, Befund `BEFUND-2026-10-02-F4-CS-REIHENFOLGE-MESSUNG.md`): die tschechische Reihenfolge - GEMESSEN an
 * 82.801 Tatoeba-Sätzen (12.809 Originale; mit gestrichenen Namen: Tom und Mary stehen in 68 % der Originale) und 33.957 Wortformen
 * (`scripts/messe-tschechische-reihenfolge.mts`; Kreuzprobe über vier Korpora und zwei Hälften: dieselben Mengen je Stufe). Eine Folge
 * gilt für `cs` (QWERTZ) UND `cs-qwerty`: beide haben dieselbe Grundreihe `a s d f | j k l ů`, die Folge zählt je Tastenwert, nur `y` und
 * `z` wechseln die Taste (Tausch kostet höchstens 1,6 Punkte Wörter / 2,2 Punkte Sätze an einer Stelle) - anders als Französisch
 * braucht es keine Abbildung der achten Grundtaste.
 *
 * ★ Die Zahlenreihe ist PFLICHT-Alphabet, keine späte Reihe: `ě š č ř ž ý á í é` sind 13,1 % aller Buchstaben, 94 % der Sätze enthalten
 * einen. Sie stehen einzeln nach Nutzen: `ě` 16, `í` 19, `á` 23, `ž` 28, `š ř č é ý` 29-33 (Plätze mit ⇧ als 18.). „Zahlenreihe zuletzt"
 * kostet bei n = 28 25 Punkte Wortabdeckung und 27 Punkte Satzabdeckung. Die Ziffern bleiben ganz hinten (0,15 % der Sätze).
 *  · Háček `ˇ` VOR Čárka `´`, beide spät (34, 38): `ˇ` gibt `ď ť ň` frei (3,9 % der Sätze) und die grossen `Č Š Ř Ž Ě Ď Ť Ň`, `´` nur `ó`
 *    (0,14 %) und die seltenen `Á É Í Ú Ý Ó`. Beide früh kosten bei n = 28 die Hälfte der Sätze (17,5 statt 32,6 %). R1 §8 („Čárka zuerst")
 *    ist damit widerlegt.
 *  · ⇧ nach 17 Buchstaben, VOR den Totasten: Zeilen mit grossen Akzentbuchstaben fallen danach bis `ˇ`/`´` weg (`grossAkzentSpaet`)
 *    und kosten höchstens 2,0 Prozentpunkte (n = 32).
 *  · `?` gehört zu `. ,` direkt hinter ⇧ ({@link LernwegDef.punktNachShift}).
 * `ů` ist die achte Grundtaste (n = 8); `ú` kommt nach `ˇ`. Bis n = 17 gibt es nur 76 Originalsätze: die frühen Zeilen sind Wortreihen.
 */
const CS_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge): Fingeranker zuerst; `ů` ist die achte Heimtaste.
  "f", "j", "d", "k", "s", "l", "a", "ů",
  // T1: die neun Buchstaben mit dem grössten Zuwachs an Wortabdeckung, `ě` als erster Buchstabe der Zahlenreihe.
  "e", "m", "i", "n", "o", "t", "v", "ě", "u",
  // (⇧ folgt hier, siehe CS_LETTERS_BEFORE_SHIFT.) T2: nach Satzzuwachs; `í á ž` aus der Zahlenreihe.
  "í", "p", "c", "h", "á", "r", "z", "b", "y", "ž",
  // T3: die übrigen vier Zahlenreihen-Buchstaben, dann Háček, g, ú, x, Čárka, w, q, Trema.
  "š", "ř", "č", "é", "ý", "ˇ", "g", "ú", "x", "´", "w", "q", "¨",
];

/** Grundreihe (8) + `e m i n o t v ě u` (9): ⇧ danach (die 18. Einheit). */
const CS_LETTERS_BEFORE_SHIFT = 17;

/** T1-Grenze: ⇧ kommt hier (35,6 % der Wörter im Text, 46 der Top-100-Formen). */
const CS_T1_LETTER_END = 17;

/** T2-Grenze: + `í p c h á r z b y ž` (79,4 % der Wörter, 91 der Top-100-Formen, 33 % der Sätze). */
const CS_T2_LETTER_END = 27;

/**
 * Satzzeichen des Weges „cs" (Befund §6, gemessen): `. , ?` kommen direkt hinter ⇧ ({@link LernwegDef.punktNachShift}); danach in der
 * gemessenen Häufigkeit `! " : ;`, dann `'` und der Bindestrich (nicht gemessen), die Klammern als festes Paar.
 */
const CS_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", "\"", ":", ";", "'", "-", "(", ")"];

/**
 * Sonderzeichen des Weges „cs": was `cs` mit höchstens Umschalt erreicht zuerst, die AltGr-Zeichen zuletzt. `{ } ~` fehlen: auf `cs-qwerty`
 * liegen sie auf Umschalt + AltGr (`KeyMod` kennt das nicht, F3-cs §2) - dort hätte die Einheit keinen Griff, und eine Folge gilt für
 * beide Tastaturen. `§ °`, `^` und die Typografie sind kein Lernziel.
 */
const CS_SYMBOL_ORDER: readonly string[] = [
  "%", "/", "+", "=", "_", "*", "&", "<", ">", "$", "|", "@", "#", "€", "[", "]",
];

/** Die Heimtasten des Weges „cs" auf beiden Tastaturen: `a s d f | j k l ů`. */
const CS_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", "ů"]);

/**
 * Die grossen Akzentbuchstaben des tschechischen Weges (`Č Š Ř Ž Ě Ď Ť Ň` über Háček, `Á É Í Ú Ý Ó` über Čárka; `Ů` fehlt: `grossFehlt`,
 * layouts.ts): Umschalt auf der Zahlenreihe gibt die Ziffer, nie den Grossbuchstaben - die Zeile kommt erst, wenn die Totaste gelernt ist.
 */
const CS_GROSS_AKZENT: readonly string[] = ["Č", "Š", "Ř", "Ž", "Ě", "Ď", "Ť", "Ň", "Á", "É", "Í", "Ú", "Ý", "Ó"];

// ═════════════════════════════════════════════════════════════════════════════
// ★★★ F4-KYR-GR (25.10.2026): die Wege OHNE lateinische Buchstaben - bg, uk, el. Messung
// `scripts/messe-{bulgarische,ukrainische,griechische}-reihenfolge.mts`, Befund `BEFUND-2026-10-25-F4-KYR-GR.md`. Jede Folge
// ist eine LERN-Folge (nicht die Tastenlage); die ersten zwei Einheiten sind die Zeichen auf KeyF/KeyJ der Haupttastatur des
// Weges (Falle 41, `heimtasten.ts`). Noch KEINE Hauptsprache (eigener Schritt, wenn Wortschatz da ist) - die Inhalte bleiben
// bis dahin die englischen, nur die Reihenfolge ist die eigene.
// ═════════════════════════════════════════════════════════════════════════════

/** Der Halbgeviertstrich (bg Bauplan B8) als Zeichencode - der Strich-Wächter erlaubt im Quelltext nur den Bindestrich. */
const HALBGEVIERT_STRICH = String.fromCharCode(0x2013);

/**
 * ★★★ F4-KYR-GR: die bulgarische Reihenfolge (Bezug Windows „Bulgarian" = BDS-2006, Tastatur `bg`) - GENAU der Bauplan B1
 * (`BAUPLAN-2026-10-25-BG.md` §1.3). Gemessen an Tatoeba `bul` (25.719 Sätze) und `bg_50k`: die gierige Folge zieht `е и с`
 * vor die Grundreihe und deckt nur bis n = 11 mehr Wörter, ab n = 16 sind beide gleichauf (n = 24: 90,2 %) - die Didaktik des
 * Landes (Grundreihe zuerst) gilt. Grundreihe OHNE `ь` (Rang 30 von 31, nur in „ьо"): der linke kleine Finger ruht auf ihm, der
 * Buchstabe kommt zuletzt vor `ѝ`. ⇧ nach `е и` (Stufe 4 des Bauplans: Umschalt, Komma auf Q, Punkt rechts der 0 - beide ohne
 * Umschalt, D-1 stellt sie direkt hinter ⇧). `ѝ` (ein anderes Wort als `и`, B4) ganz spät; auf `bg-schreibm` fehlt es
 * (`missing`) und fällt dort weg. EINE Folge für alle vier bulgarischen Tastaturen: die phonetischen haben andere Tasten
 * (Bauplan B2: eigene Folge je Phonetik - offen, Befund §5).
 */
const BG_LETTER_ORDER: readonly string[] = [
  // Stufe 1-2: Grundreihe ohne ь (о т auf KeyF/KeyJ mit den Fühlmarken, dann а н, в м, я).
  "о", "т", "а", "н", "в", "м", "я",
  // Stufe 3: die häufigen Vokale oben. (⇧ folgt hier, siehe BG_LETTERS_BEFORE_SHIFT.)
  "е", "и",
  // Stufe 5-6.
  "с", "д", "р", "к", "л", "п", "з", "г", "б", "ъ",
  // Stufe 7-9.
  "у", "ч", "ж", "ш", "щ", "й", "х", "ц", "ф", "ю", "ь",
  // Stufe 11: ѝ (eigene späte Lektion).
  "ѝ",
];

/** Grundreihe ohne ь (7) + `е и`: ⇧ danach (die 10. Einheit). */
const BG_LETTERS_BEFORE_SHIFT = 9;

/** Die Grundreihe des Weges „bg" als Startpunkt: `о т а н в м я` (7 - `ь` kommt spät). */
const BG_HOME_ROW_LETTERS = 7;

/** T1-Grenze: ⇧ (20,0 % der Wortvorkommen in Tatoeba). */
const BG_T1_LETTER_END = 9;

/** T2-Grenze: + Stufe 5-6 bis `ъ` (70,1 % der Wortvorkommen). */
const BG_T2_LETTER_END = 19;

/**
 * Satzzeichen des Weges „bg": `. ,` direkt nach ⇧ (D-1), dann Stufe 10 des Bauplans (`? ! : ;`, die bulgarischen
 * Anführungszeichen `„ “` als festes Paar - B7: eigene Texte setzen sie, `"` wird ebenso angenommen und ist auf jeder Tastatur;
 * Bindestrich, Halbgeviertstrich mit Leerzeichen erst hier (B8), Klammern als Paar). Auf `bg-schreibm` und `bg-phon-trad`
 * fehlen `„ “ –` (`missing`) und fallen dort weg.
 */
const BG_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", ":", ";", "\"", "„", "“", "-", HALBGEVIERT_STRICH, "(", ")"];

/**
 * Sonderzeichen des Weges „bg": nur, was auf allen vier bulgarischen Tastaturen einen Griff hat - dazu `€` (Preise seit 2026 in
 * Euro, B9), das auf der Schreibmaschine fehlt (B6: dort kommt die Zeile nicht). `@ # & * _ [ ] { } < >` liegen auf BDS nicht.
 */
const BG_SYMBOL_ORDER: readonly string[] = ["%", "/", "+", "=", "№", "§", "€"];

/** Die Heimtasten der Bezugsbelegung BDS: `ь я а о | т н в м`. */
const BG_HOME_KEYS: ReadonlySet<string> = new Set(["ь", "я", "а", "о", "т", "н", "в", "м"]);

/**
 * ★★★ F4-KYR-GR: die ukrainische Reihenfolge (Bezug Windows „Ukrainian (Enhanced)" = Tastatur `ua`). Der Bauplan U1 ist
 * ausdrücklich vorläufig („Ist die saubere Zählung anders, gilt sie - nur die Einheiten 1-6 sollen möglichst bleiben"):
 * die Einheiten 1-6 stehen wie dort (Grundreihe ohne die kleinen Finger `а о в л і д п р`, dann `е н т и` - `и` direkt
 * nach `і`), danach die gemessene Folge an Tatoeba `ukr` (188.903 Sätze; `uk_50k` ist mit Russisch verunreinigt und wird nicht
 * gelesen): an n = 18-26 je 3-10 Punkte mehr Wortvorkommen als die Fortsetzung des Bauplans. Der Apostroph `'` (eigene Taste
 * links der 1 auf `ua`, im Text U+0027) ist EINE Einheit; probiert direkt nach `ь` (Bauplan Einheit 9) kostet er an n = 26-30
 * bis 11 Punkte ganze Sätze - darum an seinem gemessenen Platz vor `ґ`. Auf `ua-std` fehlt er (`missing`, Bauplan U2) und fällt
 * dort weg. `ф ж` (kleine Finger) sind selten und kommen spät; `ґ` zuletzt.
 */
const UK_LETTER_ORDER: readonly string[] = [
  // Einheiten 1-4 des Bauplans: Grundreihe ohne die kleinen Finger (а о auf KeyF/KeyJ mit den Fühlmarken).
  "а", "о", "в", "л", "і", "д", "п", "р",
  // Einheiten 5-6: е н oben, т и unten. (⇧ folgt hier, siehe UK_LETTERS_BEFORE_SHIFT.)
  "е", "н", "т", "и",
  // Gemessen (gierig ab Einheit 6).
  "я", "м", "с", "к", "у", "б", "з", "ч", "г", "й", "ж", "ь",
  "ц", "ю", "щ", "ш", "х", "є", "ї", "ф",
  // Der Apostroph (gemessen), ґ zuletzt.
  "'", "ґ",
];

/** Einheiten 1-6 des Bauplans (12): ⇧ danach (Bauplan Einheit 7 „Umschalt, Punkt, Komma"). */
const UK_LETTERS_BEFORE_SHIFT = 12;

/** T1-Grenze: ⇧ (17,2 % der Wortvorkommen). */
const UK_T1_LETTER_END = 12;

/** T2-Grenze: + `я м с к у б з ч г й ж ь` (72,9 % der Wortvorkommen, 22,7 % der Sätze). */
const UK_T2_LETTER_END = 24;

/**
 * Satzzeichen des Weges „uk": `. ,` direkt nach ⇧ (D-1; das Komma ist auf `ua` Umschalt + Punkt-Taste, Bauplan U4), dann wie cs.
 * Typografische Anführungszeichen und Striche fehlen auf beiden Tastaturen (Ersatz `"`, Bauplan U10).
 */
const UK_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", "\"", ":", ";", "-", "(", ")"];

/** Sonderzeichen des Weges „uk": was beide ukrainischen Tastaturen mit Umschalt erreichen; `₴` zuletzt (auf `ua-std` fehlt es). */
const UK_SYMBOL_ORDER: readonly string[] = ["%", "/", "+", "=", "*", "_", "№", "₴"];

/** Die Heimtasten der Bezugsbelegung `ua`: `ф і в а | о л д ж`. */
const UK_HOME_KEYS: ReadonlySet<string> = new Set(["ф", "і", "в", "а", "о", "л", "д", "ж"]);

/** Tonos `΄` (U+0384) und Dialytika mit Tonos `΅` (U+0385) - zwei der drei Totasten-Einheiten des Weges „el" (dazu `¨`). */
const EL_TONOS = "΄";
const EL_DIALYTIKA_TONOS = "΅";

/**
 * ★★★ F4-KYR-GR: die griechische Reihenfolge (Bezug Windows „Greek" = Tastatur `el`, gleich für `el-220` und `el-319`). Bauplan
 * E1 („nachmessen und dann festschreiben"): Stufe 1-3 bleiben - Grundreihe `φ ξ δ κ σ λ α` (Fühlmarken auf φ ξ), `ε ο ι`, dann
 * der Tonos `΄` (die achte Heimtaste, rechter kleiner Finger; 11,7 % der Einheiten in Tatoeba `ell` - ohne ihn gibt es kaum
 * mehrsilbige Wörter). Danach gilt die Messung: `ν τ η υ μ π ρ ς γ ω` statt `τ ν ς π μ ρ η γ υ ω` (an n = 14-19 je 3-9 Punkte
 * mehr Wortvorkommen, bis 7 Punkte mehr Sätze), Schluss `θ χ β ζ ψ` wie der Bauplan. ⇧ nach ALLEN Buchstaben (Bauplan), dann
 * die Dialytika `¨` (ϊ ϋ) und `΅` (ΐ ΰ) zuletzt. Ein Buchstabe mit Tonos braucht `΄` UND seinen Grundbuchstaben
 * (Kombizeichen-Liste el aus G3a); Grossbuchstaben mit Tonos (Ά) sind auf allen drei Tastaturen tippbar (Totaste, dann
 * Umschalt + Vokal) und kommen mit ⇧.
 */
const EL_LETTER_ORDER: readonly string[] = [
  // Stufe 1-3 des Bauplans.
  "φ", "ξ", "δ", "κ", "σ", "λ", "α", "ε", "ο", "ι", EL_TONOS,
  // Gemessen (gierig ab Stufe 3).
  "ν", "τ", "η", "υ", "μ", "π", "ρ", "ς", "γ", "ω", "θ", "χ", "β", "ζ", "ψ",
  // (⇧ folgt hier, siehe EL_LETTERS_BEFORE_SHIFT.) Dialytika, dann Dialytika mit Tonos.
  "¨", EL_DIALYTIKA_TONOS,
];

/** Alle 25 Buchstaben und der Tonos: ⇧ danach (die 27. Einheit, Bauplan E1). */
const EL_LETTERS_BEFORE_SHIFT = 26;

/** Die Grundreihe des Weges „el" als Startpunkt: `φ ξ δ κ σ λ α` (7 - der Tonos kommt nach `ε ο ι`). */
const EL_HOME_ROW_LETTERS = 7;

/** T1-Grenze: Stufe 1-3 mit dem Tonos (8,3 % der Wortvorkommen). */
const EL_T1_LETTER_END = 11;

/** T2-Grenze: + `ν τ η υ μ π ρ ς γ ω` (82,5 % der Wortvorkommen, 34,9 % der Sätze). */
const EL_T2_LETTER_END = 21;

/**
 * Satzzeichen des Weges „el": `. , ; :` direkt nach ⇧ (Bauplan E1: Punkt, Komma, das Fragezeichen `;` - auf `el` die Taste Q,
 * auf `el-220`/`el-319` Umschalt + Komma -, Doppelpunkt), dann `! " ' -` und die Klammern. Das lateinische `?` ist im
 * Griechischen ein Fehler (E8) und KEINE Einheit; die Ano Teleia `·` hat auf `el`/`el-220` keine Taste (E5) und keine Einheit.
 */
const EL_PUNCT_ORDER: readonly string[] = [".", ",", ";", ":", "!", "\"", "'", "-", "(", ")"];

/** Sonderzeichen des Weges „el": was alle drei griechischen Tastaturen führen; `« »` als festes Paar zuletzt (E6: AltGr-Übung). */
const EL_SYMBOL_ORDER: readonly string[] = ["%", "/", "+", "=", "*", "_", "$", "€", "«", "»"];

/** Die Heimtasten aller drei griechischen Tastaturen: `α σ δ φ | ξ κ λ ΄`. */
const EL_HOME_KEYS: ReadonlySet<string> = new Set(["α", "σ", "δ", "φ", "ξ", "κ", "λ", EL_TONOS]);

// ── ★★★ F4-HU (25.10.2026): Weg „hu" ────────────────────────────────────────

/**
 * ★★★ F4-HU (25.10.2026, Bauplan `BAUPLAN-2026-10-25-HU.md` H1/H2/H7, Befund `BEFUND-2026-10-25-F4-HU-RO-NL.md` §2): die
 * ungarische Reihenfolge auf beiden Tastaturen (`hu` QWERTZ = Bezug, `hu-101` QWERTY) - EINE Folge am Wert: beide haben die
 * Grundreihe `a s d f | j k l é`, nur `y`/`z` und `í` wechseln die Taste. Alle neun Akzentbuchstaben `á é í ó ö ő ú ü ű` liegen
 * auf eigenen Tasten (H2): normale Einheiten, keine Totaste, kein Ersatz.
 *
 * Die STUFEN sind die des Bauplans (Grundreihe · `e i` · `t n` · ⇧ nach 20 Buchstaben · `v b u` · `c p` · `ö ó ő` · `ü í ú ű` ·
 * `w x q`, und dieselben 20 Buchstaben vor ⇧). GEMESSEN (`scripts/messe-ungarische-reihenfolge.mts`, 50.483 Einträge der
 * Häufigkeitsliste, 386.380 Tatoeba-Sätze) ist die Folge INNERHALB der Stufen 4-6: `z m · r o · g á · y h` statt
 * `g h á · o r m · z y` - `z` steht in `az`/`ez` (Artikel und „das"), `m` gehört zu den häufigsten Endungen. Das bringt an den
 * Sprossen 13-19 12-19 Punkte mehr schreibbare Wortvorkommen (n = 14: 33,1 statt 21,5 %), bei n = 20 (vor ⇧) gleich viel (63,8 %).
 * Nach ⇧ folgt der Bauplan Buchstabe für Buchstabe (gemessen höchstens 0,5 Punkte Abstand zur gierigen Folge).
 */
const HU_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge): Fingeranker zuerst, `é` ist die achte Heimtaste.
  "f", "j", "d", "k", "s", "l", "a", "é",
  // T1: Stufen 2-3 wie der Bauplan, dann 4-6 nach der Messung.
  "e", "i", "t", "n", "z", "m", "r", "o", "g", "á", "y", "h",
  // (⇧ folgt hier, siehe HU_LETTERS_BEFORE_SHIFT.) T2: v b u · c p · ö ó ő.
  "v", "b", "u", "c", "p", "ö", "ó", "ő",
  // T3: ü í ú ű, dann die Buchstaben der Namen und Fremdwörter.
  "ü", "í", "ú", "ű", "w", "x", "q",
];

/** Grundreihe (8) + 12 (Stufen 2-6): ⇧ danach (Bauplan H1 Stufe 7). */
const HU_LETTERS_BEFORE_SHIFT = 20;

/** T1-Grenze: ⇧ kommt hier (63,8 % der Wortvorkommen, 72 der Top-100-Formen). */
const HU_T1_LETTER_END = 20;

/** T2-Grenze: + `v b u c p ö ó ő` (93,4 % der Wortvorkommen, 67,6 % der Sätze). */
const HU_T2_LETTER_END = 28;

/**
 * Satzzeichen des Weges „hu" (gemessen an 443.036 Tatoeba-Zeilen: `.` 76,8 %, `,` 25,9 %, `?` 16,6 %, `!` 9,3 %, `-` 2,4 %, `;` 0,45 %,
 * `:` 0,32 %, `"` 0,12 %, `'` 0,06 %): `. , ?` direkt nach ⇧ (wie cs, {@link LernwegDef.punktNachShift}), dann nach Häufigkeit; die
 * Klammern als festes Paar. `„ ”` gibt es auf keiner ungarischen Tastatur (Bauplan H6) - Texte schreiben `"`.
 */
const HU_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", "-", ";", ":", "\"", "'", "(", ")"];

/**
 * ★ Die Ziffern des Weges „hu" (Bauplan H7): die `0` liegt auf `hu` LINKS von der `1` - sie kommt zuerst, dann `1 … 9` in der Folge
 * der Zahlenreihe. Auf `hu-101` ist die `0` AltGr + í (eigene Lektion, Griffe aus den Daten der Tastatur).
 */
const HU_DIGIT_ORDER: readonly string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Sonderzeichen des Weges „hu": nur Zeichen mit Griff auf BEIDEN Tastaturen, ohne Totaste - die mit Umschalt zuerst, dann AltGr.
 * `^ ° ~ \`` sind auf `hu` AltGr-Totasten (Bauplan H8: kein Lernziel), `§` fehlt auf `hu-101`.
 */
const HU_SYMBOL_ORDER: readonly string[] = [
  "%", "/", "+", "=", "_", "*", "&", "<", ">", "$", "@", "#", "[", "]", "{", "}", "|", "\\", "€",
];

/** Die Heimtasten des Weges „hu" auf beiden Tastaturen: `a s d f | j k l é`. */
const HU_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", "é"]);

// ── ★★★ F4-RO (25.10.2026): Weg „ro" ────────────────────────────────────────

/**
 * ★★★ F4-RO (25.10.2026, Bauplan `BAUPLAN-2026-10-25-RO.md` R1-R3/R9, Befund `BEFUND-2026-10-25-F4-HU-RO-NL.md` §3): die
 * rumänische Reihenfolge, gezählt am Wert für `ro` (Standard, Bezug: `ă î â ș ț` auf eigenen Tasten, Grundreihe
 * `a s d f | j k l ș`) und `ro-prog` (Programmers: US-Grundebene, die fünf mit AltGr + Grundbuchstabe).
 *
 * Stufe 1 und 2 wie der Bauplan (`f j d k s l a ș` · `e i t u n r c o m ă p`), ⇧ danach (n = 19: 75 % der Wortvorkommen, 85 der
 * Top-100-Formen). GEMESSEN (`scripts/messe-rumaenische-reihenfolge.mts`, 52.483 Einträge der Liste in Komma-Form, 37.438 Tatoeba-
 * Sätze) ist die Folge INNERHALB der Stufe 3: `v b î ț g z â h` statt `v b g h î ț z â` - `î ț` stehen in `în`, `și`, `aici`-Formen,
 * `h` ist der seltenste (0,49 %): bei n = 24 61,7 statt 50,6 % der Sätze. Stufe 4 (`y x w q`) wie der Bauplan.
 *
 * Auf `ro-prog` ist die achte Heimtaste `;` ({@link LernwegDef.achteGrundtasten}): `ș` rückt dort direkt hinter `ă` - die zwei
 * ersten AltGr-Buchstaben stehen zusammen (Bauplan R2).
 */
const RO_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge): Fingeranker zuerst; `ș` ist die achte Heimtaste (auf `ro-prog`: `;`).
  "f", "j", "d", "k", "s", "l", "a", "ș",
  // T1 = Stufe 2 (Häufigkeit, gemessen deckungsgleich mit der gierigen Folge).
  "e", "i", "t", "u", "n", "r", "c", "o", "m", "ă", "p",
  // (⇧ folgt hier, siehe RO_LETTERS_BEFORE_SHIFT.) T2 = Stufe 3 in der gemessenen Folge.
  "v", "b", "î", "ț", "g", "z", "â", "h",
  // T3 = Stufe 4: Fremdwörter.
  "y", "x", "w", "q",
];

/** Grundreihe (8) + Stufe 2 (11): ⇧ danach. */
const RO_LETTERS_BEFORE_SHIFT = 19;

/** T1-Grenze: ⇧ kommt hier. */
const RO_T1_LETTER_END = 19;

/** T2-Grenze: + Stufe 3 (99,3 % der Wortvorkommen, 96,9 % der Sätze). */
const RO_T2_LETTER_END = 27;

/**
 * Satzzeichen des Weges „ro" (gemessen an 41.756 Tatoeba-Zeilen: `.` 83,8 %, `-` 19,4 %, `?` 13,3 %, `,` 10,0 %, `!` 3,9 %, `:` 0,37 %,
 * `„ ”` je 0,32 %, `;` 0,21 %): `. ,` und dazu `-` und `?` direkt nach ⇧ ({@link LernwegDef.punktNachShift}) - der Bindestrich steht IN
 * Wörtern (`s-a`, `într-o`, `n-am`), ohne ihn ist jeder fünfte Satz gesperrt. Anführungszeichen nach der Akademie `„ ”` (Bauplan R7) als
 * festes Paar; das gerade `"` fehlt auf `ro` (nur AltGr + Umschalt). Der Apostroph ist auf `ro` AltGr + ț.
 */
const RO_PUNCT_ORDER: readonly string[] = [".", ",", "-", "?", "!", ":", "„", "”", ";", "'", "(", ")"];

/**
 * Sonderzeichen des Weges „ro": nur Zeichen mit Griff auf BEIDEN Tastaturen (`{ } | ~` fehlen auf `ro`). Umschalt zuerst, AltGr zuletzt.
 */
const RO_SYMBOL_ORDER: readonly string[] = [
  "%", "/", "+", "=", "_", "*", "&", "$", "@", "#", "^", "<", ">", "[", "]", "\\", "€",
];

/** Die Heimtasten des Weges „ro": `a s d f | j k l ș` (Standard) und `;` (Programmers). */
const RO_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", "ș", ";"]);

/**
 * Die grossen rumänischen Buchstaben: auf `ro` Umschalt + eigene Taste (frei wie jeder Grossbuchstabe), auf `ro-prog` AltGr + Umschalt
 * + Grundbuchstabe - ein Dreiergriff (Bauplan R9: „eigene späte Einheit"), wie Polnisch erst mit der letzten Buchstaben-Einheit.
 */
const RO_GROSS_AKZENT: readonly string[] = ["Ă", "Â", "Î", "Ș", "Ț"];

// ── ★★★ F4-NL (25.10.2026): Weg „nl" ────────────────────────────────────────

/**
 * ★★★ F4-NL (25.10.2026, Bauplan `BAUPLAN-2026-10-25-NL.md` N1-N6, §2.2, Befund `BEFUND-2026-10-25-F4-HU-RO-NL.md` §4): die
 * niederländische Reihenfolge, AM WERT (N2) für `nl-intl` (US-International, Bezug Niederlande: Heimtasten `a s d f | j k l ;`),
 * `be` (Belgisch AZERTY, Bezug Flandern: achte Heimtaste `m`) und `nl-dutch` (Nebenweg: achte Heimtaste `+`).
 *
 * Buchstaben wie N1 (`e n · i t · o r · h g · m w · u v · b z · p c · y x q`, gemessen bis auf Zehntel wie die gierige Folge über
 * 50.539 Einträge der Liste und 184.493 Tatoeba-Sätze); ⇧ nach `h g` (16 mit `;`). Dann - vor den seltenen Buchstaben `y x q` - die
 * Pflichtzeichen des Bauplans in seiner Folge: der Apostroph (N4: `'s`, `'t`, `auto's`, `zo'n`; auf `nl-intl` die Totasten-Lektion:
 * `'` dann Leertaste bzw. `'` dann s), `ë ï` (N5: auf `nl-intl` `"` dann e/i, auf `be`/`nl-dutch` `¨` dann e/i) und `é` (auf `nl-intl`
 * AltGr + E, auf `be` eigene Taste, auf `nl-dutch` `´` dann e). Gemessen kostet diese Stelle gegen „ganz hinten" höchstens 0,7 Punkte.
 * `ë ï é` sind EINHEITEN (N5), nicht über eine Totasten-Einheit frei: ihre Totaste ist je Tastatur eine andere.
 */
const NL_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge): Fingeranker zuerst; `;` ist die achte Heimtaste (auf `be`: `m`, auf `nl-dutch`: `+`).
  "f", "j", "d", "k", "s", "l", "a", ";",
  // T1: e n · i t · o r · h g.
  "e", "n", "i", "t", "o", "r", "h", "g",
  // (⇧ folgt hier, siehe NL_LETTERS_BEFORE_SHIFT.) T2: m w · u v · b z · p c.
  "m", "w", "u", "v", "b", "z", "p", "c",
  // T3: Apostroph (Totasten-Lektion auf nl-intl), ë ï, é - dann die seltenen Buchstaben.
  "'", "ë", "ï", "é", "y", "x", "q",
];

/** Grundreihe (8, mit `;`) + `e n i t o r h g` (8): ⇧ danach. */
const NL_LETTERS_BEFORE_SHIFT = 16;

/** T1-Grenze: ⇧ kommt hier (50,5 % der Wortvorkommen, 51 der Top-100-Formen). */
const NL_T1_LETTER_END = 16;

/** T2-Grenze: + `m w u v b z p c` (98,6 % der Wortvorkommen, 94,6 % der Sätze). */
const NL_T2_LETTER_END = 24;

/**
 * Satzzeichen des Weges „nl" (gemessen an 201.410 Tatoeba-Zeilen: `.` 81,7 %, `?` 15,4 %, `,` 7,3 %, `!` 3,8 %, `'` 1,2 %, `-` 0,9 %,
 * `"` 0,8 %, `:` 0,3 %): `. , ?` direkt nach ⇧ ({@link LernwegDef.punktNachShift}), dann nach Häufigkeit. `;` fehlt bewusst (Grundreihe),
 * der Apostroph steht in der Buchstaben-Folge. `"` ist auf `nl-intl` die Trema-Totaste - als Zeichen erst nach allen Buchstaben (N20).
 */
const NL_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", "-", "\"", ":", "(", ")"];

/**
 * Sonderzeichen des Weges „nl": nur Zeichen mit Griff auf ALLEN DREI Tastaturen, ohne Totaste (`^ ~ \`` sind auf `nl-intl`/`nl-dutch`
 * Totasten, `§` fehlt auf `nl-intl`). Umschalt zuerst, AltGr zuletzt.
 */
const NL_SYMBOL_ORDER: readonly string[] = [
  "%", "/", "+", "=", "_", "*", "&", "<", ">", "$", "@", "#", "[", "]", "{", "}", "|", "\\", "€",
];

/** Die Heimtasten des Weges „nl": `a s d f | j k l ;` (nl-intl), `m` (be), `+` (nl-dutch). */
const NL_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", ";", "m", "+"]);

/**
 * Die grossen Akzentbuchstaben des niederländischen Weges: in niederländischen Texten kaum nötig (N6: Sätze mit `Eén` umstellen); auf
 * `be` nur über eine Totaste, auf `nl-intl` AltGr + Umschalt bzw. Totaste - Zeilen mit ihnen erst mit der letzten Buchstaben-Einheit.
 */
const NL_GROSS_AKZENT: readonly string[] = ["É", "Ë", "Ï"];

/**
 * ★★★ F4-PT-BR-SV (25.10.2026, Befund `BEFUND-2026-10-25-F4-PT-BR-SV.md` §2-3): die portugiesischen Reihenfolgen - ZWEI Wege
 * (Entscheidung Johannes), je eine Folge: „pt" (Portugal, Tastatur `pt`) und „br" (Brasilien, `br-abnt2`). Vorschlag: Bauplan
 * `BAUPLAN-2026-10-25-PT.md` I1 (Didaktik: Grundreihe mit `ç`, dann nach Häufigkeit, die Totasten nach Umschalt) - ⚠️ dort stand die
 * Taste K doppelt (in der Grundreihe UND bei `y k w`); hier steht sie einmal, in der Grundreihe. GEMESSEN
 * (`scripts/messe-portugiesische-reihenfolge.mts`) an den Wortlisten beider Länder GETRENNT (Untertitel, je 50.000 Wörter) und an
 * 395.400 Tatoeba-Sätzen (Portugal und Brasilien gemischt, Zuordnung über Merkwörter nur als Hinweis).
 *  · Grundreihe `a s d f | j k l ç` in der Lern-Folge `f j d k s l a ç` (F J zuerst, Falle 41); `ç` ist die achte Heimtaste.
 *  · T1 `e o r i m t n u` wie der Bauplan: dieselbe Wortabdeckung bei n = 16 wie die gierige Folge (PT 43,8 % gegen 43,3 %).
 *  · Umschalt nach 16 Buchstaben, VOR allen Totasten (Bauplan I1: „Totasten-Einheiten nach Umschalt und Komma/Punkt";
 *    `^` und `` ` `` brauchen Umschalt ohnehin).
 *  · Die vier Totasten je als EINE Einheit, in der Folge des Bauplans (Tilde `~` ã õ, Akut `´` á é í ó ú, Zirkumflex `^` â ê ô,
 *    Gravis `` ` `` à), aber ZWISCHEN den Buchstaben statt alle direkt hinter Umschalt: `~ c p v ´` gibt bei n = 20 62,7 % der
 *    Wortvorkommen (Bauplan-Folge `~ ´ c p v`: 59,6 %), die 1000 häufigsten Wörter 52,8 % (40,7 %).
 *  · Brasilien: der Zirkumflex FRÜH, direkt nach dem Akut (Bauplan I1: *você*; `ê` 0,59 % der Buchstaben gegen 0,22 % in Portugal).
 *    Portugal: `^` erst nach `z` (kostet dort nichts).
 *  · Das Trema `¨` ist KEINE Einheit (seit AO90 abgeschafft, Bauplan I9: in Brasilien Umschalt + 6, nie verlangen) - Zeilen mit `ü`
 *    kommen auf beiden Wegen nicht. `º ª` sind kein Lernziel (I8: Ordnungszahlen ausgeschrieben).
 */
const PT_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge): Fingeranker zuerst; `ç` ist die achte Heimtaste.
  "f", "j", "d", "k", "s", "l", "a", "ç",
  // T1: e o · r i · m t n u (Bauplan I1).
  "e", "o", "r", "i", "m", "t", "n", "u",
  // (⇧ folgt hier, siehe PT_LETTERS_BEFORE_SHIFT.) T2: Tilde, c p v, Akut, q h g b.
  "~", "c", "p", "v", "´", "q", "h", "g", "b",
  // T3: z, Zirkumflex, x, Gravis, die Fremdwort-Buchstaben y w.
  "z", "^", "x", "`", "y", "w",
];

/** Grundreihe (8) + `e o r i m t n u` (8): ⇧ danach (die 17. Einheit). */
const PT_LETTERS_BEFORE_SHIFT = 16;

/** T1-Grenze: ⇧ kommt hier (Portugal 43,8 % der Wortvorkommen, 57 der 100 häufigsten Wörter). */
const PT_T1_LETTER_END = 16;

/** T2-Grenze: + `~ c p v ´ q h g b` (Portugal 94,9 % der Wortvorkommen, 77 % der Sätze). */
const PT_T2_LETTER_END = 25;

/** Weg „br": dieselben Gruppen, der Zirkumflex direkt nach dem Akut (você). */
const BR_LETTER_ORDER: readonly string[] = [
  "f", "j", "d", "k", "s", "l", "a", "ç",
  "e", "o", "r", "i", "m", "t", "n", "u",
  // (⇧ folgt hier.) T2: Tilde, c p v, Akut, Zirkumflex, q h g b.
  "~", "c", "p", "v", "´", "^", "q", "h", "g", "b",
  // T3: z x, Gravis, y w.
  "z", "x", "`", "y", "w",
];

const BR_LETTERS_BEFORE_SHIFT = 16;
const BR_T1_LETTER_END = 16;

/** T2-Grenze: + `~ c p v ´ ^ q h g b` (Brasilien 96,3 % der Wortvorkommen). */
const BR_T2_LETTER_END = 26;

/**
 * Satzzeichen „pt" (Didaktik R0 §5 Punkt 4: Komma, Punkt, dann `? !`, der Bindestrich - *dá-me*, *chama-se* -, dann die
 * Anführungszeichen): `« »` sind in Portugal eine eigene Taste und die Anführungszeichen der eigenen Texte (Bauplan I6) - ein festes
 * Paar wie die Klammern; das gerade `"` kommt später dazu (es wird angenommen).
 */
const PT_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", "-", "«", "»", ":", ";", "\"", "'", "(", ")"];

/** Satzzeichen „br": wie „pt", aber `"` sind die Anführungszeichen des Landes (`« »` gibt es auf `br-abnt2` nicht). */
const BR_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", "-", "\"", ":", ";", "'", "(", ")"];

/**
 * Sonderzeichen „pt": was `pt` mit höchstens Umschalt erreicht zuerst, die AltGr-Zeichen danach, `€` als letzte eigene Einheit
 * (Bauplan I8). `¨ º ª` sind kein Lernziel.
 */
const PT_SYMBOL_ORDER: readonly string[] = [
  "%", "&", "/", "+", "*", "=", "_", "<", ">", "$", "#", "|", "\\", "@", "[", "]", "{", "}", "€",
];

/**
 * Sonderzeichen „br": KEIN `€` (die Tastatur hat es nicht, I8), `$` früh (R$). `/` liegt auf der Zusatztaste `IntlRo` oder AltGr + Q
 * (I10, am Wert geprüft). Umschalt + 6 (Totaste `¨`) wird nie verlangt (I9).
 */
const BR_SYMBOL_ORDER: readonly string[] = [
  "%", "&", "/", "+", "*", "=", "_", "<", ">", "$", "@", "#", "[", "]", "{", "}", "\\", "|",
];

/** Die Heimtasten beider portugiesischen Wege: `a s d f | j k l ç`. */
const PT_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", "ç"]);

/** Was die vier Totasten auf den portugiesischen Wegen ergeben (ã õ · á é í ó ú · â ê ô · à). */
const PT_TOTASTEN_ZIELE: Readonly<Record<string, readonly string[]>> = {
  "~": ["ã", "õ"],
  "´": ["á", "é", "í", "ó", "ú"],
  "^": ["â", "ê", "ô"],
  "`": ["à"],
};

/**
 * ★★★ F4-PT-BR-SV (25.10.2026, Befund §4): die schwedische Reihenfolge (Weg „sv", Tastatur `sv` - Schweden und Finnland). Vorschlag:
 * Bauplan `BAUPLAN-2026-10-25-SV.md` §1.3 (Stufen 1-9). GEMESSEN (`scripts/messe-schwedische-reihenfolge.mts`) an der Wortliste
 * (Untertitel, 50.000 Wörter) und 52.605 Tatoeba-Sätzen: der Bauplan hält. Bei n = 16 (vor ⇧) 48,2 % der Wortvorkommen (gierige
 * Folge 49,2 %), 39,4 % der 1000 häufigsten Wörter (38,4 %), 3,7 % der Sätze (2,8 %).
 *  · Grundreihe `a s d f | j k l ö` in der Lern-Folge `f j d k s l a ö` - `ö` ist die achte Heimtaste, auch wenn es seltener ist als
 *    `ä` (Bauplan Falle 4).
 *  · `e i ä` · `r t n` · `g h` (die Grundreihe ist dann ganz), Umschalt nach 16, dann `o m v u` · `å p` · `b c y` · `x w z q`.
 *  · `å ä ö` sind gewöhnliche Buchstaben-Einheiten auf eigenen Tasten (S2), keine Totaste, kein Ersatz.
 *  · Die Totaste `´` (é: idé, café, armé) zuletzt (S3) - 0,01 % der Buchstaben, 0,3 % der Sätze. `¨ ` ^ ~` sind kein Lernziel (S19).
 */
const SV_LETTER_ORDER: readonly string[] = [
  // Grundreihe (Lern-Folge): Fingeranker zuerst; `ö` ist die achte Heimtaste.
  "f", "j", "d", "k", "s", "l", "a", "ö",
  // T1: e i ä · r t n · g h.
  "e", "i", "ä", "r", "t", "n", "g", "h",
  // (⇧ folgt hier, siehe SV_LETTERS_BEFORE_SHIFT.) T2: o m v u · å p.
  "o", "m", "v", "u", "å", "p",
  // T3: b c y · x w z q · die Totaste ´ (é).
  "b", "c", "y", "x", "w", "z", "q", "´",
];

/** Grundreihe (8) + `e i ä r t n g h` (8): ⇧ danach (die 17. Einheit). */
const SV_LETTERS_BEFORE_SHIFT = 16;

/** T1-Grenze: ⇧ kommt hier (48,2 % der Wortvorkommen, 51 der 100 häufigsten Wörter). */
const SV_T1_LETTER_END = 16;

/** T2-Grenze: + `o m v u å p` (89,5 % der Wortvorkommen, 56 % der Sätze). */
const SV_T2_LETTER_END = 22;

/** Satzzeichen „sv": `. ,` nach ⇧ (D-1), dann `? !` (Umschalt + `+` / Umschalt + 1), der Bindestrich, `: ;`, `"` (S6), `'`, Klammern. */
const SV_PUNCT_ORDER: readonly string[] = [".", ",", "?", "!", "-", ":", ";", "\"", "'", "(", ")"];

/**
 * Sonderzeichen „sv": was `sv` mit höchstens Umschalt erreicht zuerst, dann die AltGr-Zeichen mit `@` vorn (S20, Mail-Adressen).
 * `¤ ½ §` und die Typografie sind kein Lernziel.
 */
const SV_SYMBOL_ORDER: readonly string[] = [
  "%", "&", "/", "+", "*", "=", "_", "<", ">", "#", "@", "$", "€", "[", "]", "{", "}", "\\", "|",
];

/** Die Heimtasten des Weges „sv": `a s d f | j k l ö`. */
const SV_HOME_KEYS: ReadonlySet<string> = new Set(["a", "s", "d", "f", "j", "k", "l", "ö"]);

/**
 * ★★★ D1 Nr. 19 (28.09.2026, Entscheidung Johannes: „Klammern als festes
 * Paar - ja"): runde, eckige und geschweifte Klammern sind auf JEDEM Weg ein
 * festes Paar, wie ¿?/¡! auf Weg „es". Sie werden gemeinsam freigeschaltet
 * (`paareGemeinsam`, `advanceIntroduced`), und `fitText` (corpus.ts) streicht
 * nie eine Hälfte - an der Sprosse von „(" wurde bis hierher „)" gestrichen,
 * und ein Kind tippte „… en La Paz (Bolivia en julio.". Anführungszeichen
 * brauchen keinen Eintrag: `"` ist EINE Taste für beide Seiten, und „ " « »
 * “ ” sind auf keinem Weg eine eigene Einheit - sie fallen immer zusammen
 * weg (gemessen im Befund D1).
 */
export const KLAMMER_PAARE: Readonly<Record<string, string>> = Object.freeze({
  "(": ")",
  "[": "]",
  "{": "}",
});

/**
 * Die Sprachen, die Hauptsprache eines Weges sein können. ★★★ GEN-HAUPTSPRACHE (29.10.2026): dazu die neun neuen Wege - jeder hat
 * seit F4 seine Reihenfolge, seit F6/K eigenen Wortschatz und Korpus (Charge 1).
 */
export type Hauptsprache = "fr" | "es" | "it" | "pl" | "tr" | "cs" | "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";

let tabelle: Readonly<Record<Lernweg, LernwegDef>> | null = null;

function baueTabelle(): Readonly<Record<Lernweg, LernwegDef>> {
  // Weg „de" - AUS den bestehenden Konstanten, keine zweite Liste.
  const de: LernwegDef = {
    letterOrder: LETTER_ORDER,
    introOrder: INTRO_ORDER,
    startpunktFolge: STARTPUNKT_FOLGE,
    lettersBeforeShift: LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS,
    initialLetters: INITIAL_LETTERS,
    punctOrder: PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, LETTERS_BEFORE_SHIFT, DE_T2_LETTER_END, LETTER_ORDER.length],
    homeKeys: HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
  };
  // ★ E2 (24.09.2026): die echte englische Reihenfolge (Bauplan §3.3a, Fassung
  // A2) - ersetzt die Kopie aus E1. Ziffern wie „de" (F7, keine Belege für
  // Paare). `initialLetters` bleibt 2 (F + J, derselbe Fingeranker-Gedanke).
  // ★ D-1 (28.09.2026): `.` `,` direkt nach ⇧ (baueEinfuehrung, letters.ts).
  const enIntroOrder: readonly string[] = baueEinfuehrung(EN_LETTER_ORDER, EN_LETTERS_BEFORE_SHIFT, EN_PUNCT_ORDER, DIGIT_ORDER, EN_SYMBOL_ORDER);
  const enStartpunktFolge: readonly string[] = baueStartpunktFolge(
    EN_LETTER_ORDER,
    EN_LETTERS_BEFORE_SHIFT,
    EN_PUNCT_ORDER,
    DIGIT_ORDER,
    EN_SYMBOL_ORDER,
  );
  const en: LernwegDef = {
    letterOrder: EN_LETTER_ORDER,
    introOrder: enIntroOrder,
    startpunktFolge: enStartpunktFolge,
    lettersBeforeShift: EN_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8, wie „de" (F2)
    initialLetters: INITIAL_LETTERS, // 2, wie „de"
    punctOrder: EN_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER, // F7: wie „de"
    symbolOrder: EN_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, EN_LETTERS_BEFORE_SHIFT, EN_T2_LETTER_END, EN_LETTER_ORDER.length],
    homeKeys: EN_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
  };
  // ★ E2a (25.09.2026, Gerüst): VORLÄUFIGE Fassung, siehe Kopf-Kommentar von
  // FR_LETTER_ORDER - E5 misst nach, E3 baut die echte AZERTY-Grundreihe.
  // ★ D-1 (28.09.2026): `.` `,` direkt nach ⇧ (baueEinfuehrung, letters.ts).
  const frIntroOrder: readonly string[] = baueEinfuehrung(FR_LETTER_ORDER, FR_LETTERS_BEFORE_SHIFT, FR_PUNCT_ORDER, DIGIT_ORDER, FR_SYMBOL_ORDER);
  const frStartpunktFolge: readonly string[] = baueStartpunktFolge(
    FR_LETTER_ORDER,
    FR_LETTERS_BEFORE_SHIFT,
    FR_PUNCT_ORDER,
    DIGIT_ORDER,
    FR_SYMBOL_ORDER,
  );
  const fr: LernwegDef = {
    // ★ D1 Nr. 18: Hauptsprache Französisch, Englisch zusätzlich (siehe LernwegDef).
    hauptsprache: "fr",
    letterOrder: FR_LETTER_ORDER,
    introOrder: frIntroOrder,
    startpunktFolge: frStartpunktFolge,
    lettersBeforeShift: FR_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8, wie „de"/„en" (Platzhalter, siehe Kopf)
    initialLetters: INITIAL_LETTERS, // 2, wie „de"/„en"
    punctOrder: FR_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER, // wie „de"/„en" (F7 im englischen Bauplan: keine Belege für Ziffernpaare)
    symbolOrder: FR_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, FR_T1_LETTER_END, FR_T2_LETTER_END, FR_LETTER_ORDER.length],
    homeKeys: FR_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
    // ★ W1 (27.09.2026): Grossbuchstaben über eine Totaste erst mit der
    // letzten Einheit („|", AltGr) - siehe LernwegDef.grossAkzentAb.
    grossAkzentAb: frIntroOrder[frIntroOrder.length - 1],
  };
  // ★★★ ES-F4 (27.09.2026, Bauplan §4.3 Fassung A): die echte spanische
  // Reihenfolge - ersetzt den ES-F2/F3-Platzhalter (Alias von „en"). Ziffern
  // wie „de"/„en"/„fr" (F7: keine Belege für Ziffernpaare).
  // ★ D-1 (28.09.2026): `.` `,` direkt nach ⇧ (baueEinfuehrung, letters.ts).
  const esIntroOrder: readonly string[] = baueEinfuehrung(ES_LETTER_ORDER, ES_LETTERS_BEFORE_SHIFT, ES_PUNCT_ORDER, DIGIT_ORDER, ES_SYMBOL_ORDER);
  const esStartpunktFolge: readonly string[] = baueStartpunktFolge(
    ES_LETTER_ORDER,
    ES_LETTERS_BEFORE_SHIFT,
    ES_PUNCT_ORDER,
    DIGIT_ORDER,
    ES_SYMBOL_ORDER,
  );
  const es: LernwegDef = {
    // ★ D1 Nr. 18: Hauptsprache Spanisch, Englisch zusätzlich (siehe LernwegDef).
    hauptsprache: "es",
    letterOrder: ES_LETTER_ORDER,
    introOrder: esIntroOrder,
    startpunktFolge: esStartpunktFolge,
    lettersBeforeShift: ES_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8, wie jeder andere Weg
    initialLetters: INITIAL_LETTERS, // 2 (F + J), wie jeder andere Weg
    punctOrder: ES_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: ES_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, ES_T1_LETTER_END, ES_T2_LETTER_END, ES_LETTER_ORDER.length],
    homeKeys: ES_HOME_KEYS,
    // ★★★★★ ES-P7a-Behebung (M3, Bauplan §4.4 Punkt 1): ¿/? und ¡/! sind je
    // EINE Stufe mit zwei Einheiten - siehe `paareGemeinsam` oben.
    // ★ D1 Nr. 19: dazu die Klammern, wie auf jedem Weg (KLAMMER_PAARE).
    paareGemeinsam: { "¿": "?", "¡": "!", ...KLAMMER_PAARE },
    // ★ ES-M2: „¨" ergibt im Spanischen nur „ü" (pingüino, cigüeña).
    totastenZiele: { "¨": ["ü"] },
  };
  // ★★★ F4-it (02.10.2026): die echte italienische Reihenfolge - ersetzt den G2a-Alias von „en". Ziffern wie
  // „de"/„en"/„fr"/„es". ★ D-1: `.` `,` direkt nach ⇧ (baueEinfuehrung, letters.ts).
  // ★★★ F5-F8-it (02.10.2026): jetzt MIT Hauptsprache „it" (Wortschatz `wordsIt.ts`, Generator, Lexikon, Sprachausgabe).
  // Der Korpus (`CORPUS_IT`) ist bis zu den Text-Chargen leer - der Weg übt dann mit dem Wort-Drill, nie mit fremden Sätzen;
  // der Lehrgang bleibt hinter `?italienisch-lehrgang=1` unsichtbar (Schalter AUS).
  const itIntroOrder: readonly string[] = baueEinfuehrung(IT_LETTER_ORDER, IT_LETTERS_BEFORE_SHIFT, IT_PUNCT_ORDER, DIGIT_ORDER, IT_SYMBOL_ORDER);
  const itStartpunktFolge: readonly string[] = baueStartpunktFolge(
    IT_LETTER_ORDER,
    IT_LETTERS_BEFORE_SHIFT,
    IT_PUNCT_ORDER,
    DIGIT_ORDER,
    IT_SYMBOL_ORDER,
  );
  const it: LernwegDef = {
    // ★ F5-F8-it: Hauptsprache Italienisch, Englisch zusätzlich (siehe LernwegDef).
    hauptsprache: "it",
    letterOrder: IT_LETTER_ORDER,
    introOrder: itIntroOrder,
    startpunktFolge: itStartpunktFolge,
    lettersBeforeShift: IT_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8, wie jeder andere Weg
    initialLetters: INITIAL_LETTERS, // 2 (F + J)
    punctOrder: IT_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: IT_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, IT_T1_LETTER_END, IT_T2_LETTER_END, IT_LETTER_ORDER.length],
    homeKeys: IT_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
    // ★ F4-it: große Akzentbuchstaben erst mit einer SPÄTEN Einheit (Mac: Option + Umschalt, Tessin: Totaste). Nicht die
    // letzte der Folge (`}`): die gibt es auf `it` nicht (`missing`), sie käme dort nie in `allowed` - die Grossformen
    // würden am Mac nie serviert. `#` (AltGr-Zeichen, 4. von hinten) liegt auf allen vier Tastaturen (Wächter).
    grossAkzentSpaet: IT_GROSS_AKZENT,
    grossAkzentAb: "#",
    // ★ F4-it: die achte Heimtaste je Tastatur (siehe LernwegDef.achteGrundtasten); `ò` kommt nach `ì`.
    achteGrundtasten: { "it-qzerty": "m", "ch-fr": "é", ch: "ö" },
    verdraengtNach: "ì",
  };
  // ★★★ F4-pl (02.10.2026): die echte polnische Reihenfolge - ersetzt den G2a-Alias von „en".
  // ★★★ F5-F8-pl (03.10.2026): jetzt MIT Hauptsprache „pl" (Wortschatz `wordsPl.ts`, Generator, Lexikon, Sprachausgabe). Der Korpus
  // (`CORPUS_PL`) ist bis zu den Text-Chargen leer - der Weg übt dann mit dem Wort-Drill, nie mit fremden Sätzen; der Lehrgang
  // bleibt hinter `?polnisch-lehrgang=1` unsichtbar (Schalter AUS).
  const plIntroOrder: readonly string[] = baueEinfuehrung(PL_LETTER_ORDER, PL_LETTERS_BEFORE_SHIFT, PL_PUNCT_ORDER, DIGIT_ORDER, PL_SYMBOL_ORDER);
  const plStartpunktFolge: readonly string[] = baueStartpunktFolge(
    PL_LETTER_ORDER,
    PL_LETTERS_BEFORE_SHIFT,
    PL_PUNCT_ORDER,
    DIGIT_ORDER,
    PL_SYMBOL_ORDER,
  );
  const pl: LernwegDef = {
    // ★ F5-F8-pl: Hauptsprache Polnisch, Englisch zusätzlich (siehe LernwegDef).
    hauptsprache: "pl",
    letterOrder: PL_LETTER_ORDER,
    introOrder: plIntroOrder,
    startpunktFolge: plStartpunktFolge,
    lettersBeforeShift: PL_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8, wie jeder andere Weg (`;` zählt als achte Einheit)
    initialLetters: INITIAL_LETTERS, // 2 (F + J)
    punctOrder: PL_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: PL_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, PL_T1_LETTER_END, PL_T2_LETTER_END, PL_LETTER_ORDER.length],
    homeKeys: PL_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
    // ★ F4-pl: die grossen polnischen Buchstaben sind ein Dreiergriff (AltGr + Umschalt + Buchstabe, Mac: Option + Umschalt):
    // 1,3 % der Sätze beginnen mit einem, fast nie mitten im Satz (Befund §6). Sobald ⇧ gelernt ist (nach der 22. Einheit),
    // würden sie sonst als Zeilenanfang serviert, ohne dass ein Kind den Griff geübt hat - darum erst mit der letzten
    // Buchstaben-Einheit (`q`: auf jeder Tastatur vorhanden). Vorher nimmt die Auto-Grossschreibung den kleinen Buchstaben.
    grossAkzentSpaet: PL_GROSS_AKZENT,
    grossAkzentAb: "q",
  };
  // ★★★ F4-tr (02.10.2026): die echte türkische Reihenfolge auf der Q-Tastatur - ersetzt den G2a-Alias von „en". `tr-f` hat
  // keinen Weg (`TUERKISCHE_WEG_LAYOUT_IDS`).
  // ★★★ F5-F8-tr (03.10.2026): jetzt MIT Hauptsprache „tr" (Wortschatz `wordsTr.ts`, Generator, Lexikon, Sprachausgabe). Der Korpus
  // (`CORPUS_TR`) ist bis zur Etappe T leer - der Weg übt dann mit dem Wort-Drill, nie mit fremden Sätzen; der Lehrgang bleibt
  // unsichtbar (Schalter AUS).
  const trIntroOrder: readonly string[] = baueEinfuehrung(TR_LETTER_ORDER, TR_LETTERS_BEFORE_SHIFT, TR_PUNCT_ORDER, DIGIT_ORDER, TR_SYMBOL_ORDER);
  const trStartpunktFolge: readonly string[] = baueStartpunktFolge(
    TR_LETTER_ORDER,
    TR_LETTERS_BEFORE_SHIFT,
    TR_PUNCT_ORDER,
    DIGIT_ORDER,
    TR_SYMBOL_ORDER,
  );
  const tr: LernwegDef = {
    // ★ F5-F8-tr: Hauptsprache Türkisch, Englisch zusätzlich (siehe LernwegDef).
    hauptsprache: "tr",
    letterOrder: TR_LETTER_ORDER,
    introOrder: trIntroOrder,
    startpunktFolge: trStartpunktFolge,
    lettersBeforeShift: TR_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8, wie jeder andere Weg
    initialLetters: INITIAL_LETTERS, // 2 (F + J)
    punctOrder: TR_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: TR_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, TR_T1_LETTER_END, TR_T2_LETTER_END, TR_LETTER_ORDER.length],
    homeKeys: TR_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
    // ★ F4-tr: `^` ist Totaste (â î û): sein Ziel sind nur diese drei (`ê ô` gibt es im Türkischen nicht, TDK).
    totastenZiele: { "^": ["â", "î", "û"] },
  };
  // ★★★ F4-cs (02.10.2026): die echte tschechische Reihenfolge - ersetzt den G2a-Alias von „en". EINE Folge für `cs` und
  // `cs-qwerty`; noch KEINE Hauptsprache (Texte: F5). `. , ?` direkt nach ⇧ (`punktNachShift`, Befund §6).
  const csPunktNachShift: readonly string[] = [...PUNKT_UND_KOMMA, "?"];
  const csIntroOrder: readonly string[] = baueEinfuehrung(
    CS_LETTER_ORDER,
    CS_LETTERS_BEFORE_SHIFT,
    CS_PUNCT_ORDER,
    DIGIT_ORDER,
    CS_SYMBOL_ORDER,
    csPunktNachShift,
  );
  const csStartpunktFolge: readonly string[] = baueStartpunktFolge(
    CS_LETTER_ORDER,
    CS_LETTERS_BEFORE_SHIFT,
    CS_PUNCT_ORDER,
    DIGIT_ORDER,
    CS_SYMBOL_ORDER,
  );
  const cs: LernwegDef = {
    // ★ F5-F8-cs (03.10.2026): Hauptsprache Tschechisch, Englisch zusätzlich (siehe LernwegDef). Wortschatz `wordsCs.ts`, Generator, Lexikon,
    // Sprachausgabe stehen; der Korpus (`CORPUS_CS`) ist bis zu den Text-Chargen leer - der Weg übt dann mit dem Wort-Drill, nie mit
    // fremden Sätzen; der Lehrgang bleibt hinter `?tschechisch-lehrgang=1` unsichtbar (Schalter AUS).
    hauptsprache: "cs",
    letterOrder: CS_LETTER_ORDER,
    introOrder: csIntroOrder,
    startpunktFolge: csStartpunktFolge,
    lettersBeforeShift: CS_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8, wie jeder andere Weg (`ů` ist die achte Heimtaste beider Tastaturen)
    initialLetters: INITIAL_LETTERS, // 2 (F + J)
    punctOrder: CS_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: CS_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, CS_T1_LETTER_END, CS_T2_LETTER_END, CS_LETTER_ORDER.length],
    homeKeys: CS_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
    punktNachShift: csPunktNachShift,
    // ★ F4-cs: Háček gibt ď ť ň (die kleinen Zeichen mit eigener Taste stehen nicht hier), Čárka gibt ó (á é í ú ý haben eigene Tasten).
    totastenZiele: { "ˇ": ["ď", "ť", "ň"], "´": ["ó"] },
    // ★ F4-cs: Umschalt auf der Zahlenreihe gibt die Ziffer, nie den Grossbuchstaben - Zeilen mit Č Š Ř Ž Ě Ď Ť Ň (Háček) und
    // Á É Í Ú Ý Ó (Čárka) kommen erst, wenn `ˇ` bzw. `´` gelernt ist (`grossAkzentEinheiten`, corpus.ts: die Totaste des Zeichens).
    // Messung §5.3: höchstens 2,0 Prozentpunkte der Sätze. `¨` (die letzte Buchstaben-Einheit, auf beiden Tastaturen vorhanden)
    // gilt nur als Rückfall für ein Zeichen ohne Totaste im Modell - es gibt keines (`Ů` fehlt: `grossFehlt`).
    grossAkzentSpaet: CS_GROSS_AKZENT,
    grossAkzentAb: "¨",
  };
  // ★★★ F4-KYR-GR (25.10.2026): bg, uk, el mit eigener Reihenfolge - kein Alias von „en" mehr, aber noch OHNE Hauptsprache
  // (die Inhalte bleiben die englischen, bis Wortschatz da ist). Ziffern wie jeder Weg.
  const bgIntroOrder: readonly string[] = baueEinfuehrung(BG_LETTER_ORDER, BG_LETTERS_BEFORE_SHIFT, BG_PUNCT_ORDER, DIGIT_ORDER, BG_SYMBOL_ORDER);
  const bg: LernwegDef = {
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): Hauptsprache gesetzt (Wortschatz, Korpus Charge 1 da) - Übungssprache = sie + Englisch.
    hauptsprache: "bg",
    letterOrder: BG_LETTER_ORDER,
    introOrder: bgIntroOrder,
    startpunktFolge: baueStartpunktFolge(BG_LETTER_ORDER, BG_LETTERS_BEFORE_SHIFT, BG_PUNCT_ORDER, DIGIT_ORDER, BG_SYMBOL_ORDER),
    lettersBeforeShift: BG_LETTERS_BEFORE_SHIFT,
    homeRowLetters: BG_HOME_ROW_LETTERS, // 7: die Grundreihe ohne `ь`
    initialLetters: INITIAL_LETTERS, // 2: о т (KeyF/KeyJ)
    punctOrder: BG_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: BG_SYMBOL_ORDER,
    tierCuts: [BG_HOME_ROW_LETTERS, BG_T1_LETTER_END, BG_T2_LETTER_END, BG_LETTER_ORDER.length],
    homeKeys: BG_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar; dazu die bulgarischen Anführungszeichen „ “ (nie eine Hälfte allein).
    paareGemeinsam: { ...KLAMMER_PAARE, "„": "“" },
  };
  const ukIntroOrder: readonly string[] = baueEinfuehrung(UK_LETTER_ORDER, UK_LETTERS_BEFORE_SHIFT, UK_PUNCT_ORDER, DIGIT_ORDER, UK_SYMBOL_ORDER);
  const uk: LernwegDef = {
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): Hauptsprache gesetzt (Wortschatz, Korpus Charge 1 da) - Übungssprache = sie + Englisch.
    hauptsprache: "uk",
    letterOrder: UK_LETTER_ORDER,
    introOrder: ukIntroOrder,
    startpunktFolge: baueStartpunktFolge(UK_LETTER_ORDER, UK_LETTERS_BEFORE_SHIFT, UK_PUNCT_ORDER, DIGIT_ORDER, UK_SYMBOL_ORDER),
    lettersBeforeShift: UK_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8: а о в л і д п р (die Grundreihe ohne die kleinen Finger)
    initialLetters: INITIAL_LETTERS, // 2: а о (KeyF/KeyJ)
    punctOrder: UK_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: UK_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, UK_T1_LETTER_END, UK_T2_LETTER_END, UK_LETTER_ORDER.length],
    homeKeys: UK_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
  };
  // ★ el: `. , ; :` direkt nach ⇧ (Bauplan E1 - `;` ist das griechische Fragezeichen).
  const elPunktNachShift: readonly string[] = [...PUNKT_UND_KOMMA, ";", ":"];
  const elIntroOrder: readonly string[] = baueEinfuehrung(
    EL_LETTER_ORDER,
    EL_LETTERS_BEFORE_SHIFT,
    EL_PUNCT_ORDER,
    DIGIT_ORDER,
    EL_SYMBOL_ORDER,
    elPunktNachShift,
  );
  const el: LernwegDef = {
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): Hauptsprache gesetzt (Wortschatz, Korpus Charge 1 da) - Übungssprache = sie + Englisch.
    hauptsprache: "el",
    letterOrder: EL_LETTER_ORDER,
    introOrder: elIntroOrder,
    startpunktFolge: baueStartpunktFolge(EL_LETTER_ORDER, EL_LETTERS_BEFORE_SHIFT, EL_PUNCT_ORDER, DIGIT_ORDER, EL_SYMBOL_ORDER),
    lettersBeforeShift: EL_LETTERS_BEFORE_SHIFT,
    homeRowLetters: EL_HOME_ROW_LETTERS, // 7: φ ξ δ κ σ λ α (der Tonos kommt nach ε ο ι)
    initialLetters: INITIAL_LETTERS, // 2: φ ξ (KeyF/KeyJ)
    punctOrder: EL_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: EL_SYMBOL_ORDER,
    tierCuts: [EL_HOME_ROW_LETTERS, EL_T1_LETTER_END, EL_T2_LETTER_END, EL_LETTER_ORDER.length],
    homeKeys: EL_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar; dazu « » (nie eine Hälfte allein).
    paareGemeinsam: { ...KLAMMER_PAARE, "«": "»" },
    punktNachShift: elPunktNachShift,
    // ★ Die drei Totasten ergeben genau diese Zeichen (Kombizeichen-Liste el, G3a).
    totastenZiele: {
      [EL_TONOS]: ["ά", "έ", "ή", "ί", "ό", "ύ", "ώ"],
      "¨": ["ϊ", "ϋ"],
      [EL_DIALYTIKA_TONOS]: ["ΐ", "ΰ"],
    },
  };
  // ★★★ F4-HU (25.10.2026): die eigene ungarische Reihenfolge - ersetzt den G2-NEUN-Alias von „en". EINE Folge für `hu` und `hu-101`;
  // noch KEINE Hauptsprache (kommt mit dem Wortschatz). `. , ?` direkt nach ⇧ (wie cs). Keine Totaste, keine späten Grossformen:
  // jeder Akzentbuchstabe hat eine eigene Taste, mit Umschalt seinen Grossbuchstaben (Bauplan H3).
  const huPunktNachShift: readonly string[] = [...PUNKT_UND_KOMMA, "?"];
  const huIntroOrder: readonly string[] = baueEinfuehrung(
    HU_LETTER_ORDER,
    HU_LETTERS_BEFORE_SHIFT,
    HU_PUNCT_ORDER,
    HU_DIGIT_ORDER,
    HU_SYMBOL_ORDER,
    huPunktNachShift,
  );
  const hu: LernwegDef = {
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): Hauptsprache gesetzt (Wortschatz, Korpus Charge 1 da) - Übungssprache = sie + Englisch.
    hauptsprache: "hu",
    letterOrder: HU_LETTER_ORDER,
    introOrder: huIntroOrder,
    startpunktFolge: baueStartpunktFolge(HU_LETTER_ORDER, HU_LETTERS_BEFORE_SHIFT, HU_PUNCT_ORDER, HU_DIGIT_ORDER, HU_SYMBOL_ORDER),
    lettersBeforeShift: HU_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8 (`é` ist die achte Heimtaste beider Tastaturen)
    initialLetters: INITIAL_LETTERS, // 2 (F + J - die Zeichen auf KeyF/KeyJ von `hu`)
    punctOrder: HU_PUNCT_ORDER,
    digitOrder: HU_DIGIT_ORDER,
    symbolOrder: HU_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, HU_T1_LETTER_END, HU_T2_LETTER_END, HU_LETTER_ORDER.length],
    homeKeys: HU_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
    punktNachShift: huPunktNachShift,
  };
  // ★★★ F4-RO (25.10.2026): die eigene rumänische Reihenfolge - ersetzt den G2-NEUN-Alias von „en". EINE Folge am Wert für `ro`
  // und `ro-prog`; noch KEINE Hauptsprache. `. , - ?` direkt nach ⇧ (Bindestrich in Wörtern, gemessen).
  const roPunktNachShift: readonly string[] = [...PUNKT_UND_KOMMA, "-", "?"];
  const roIntroOrder: readonly string[] = baueEinfuehrung(
    RO_LETTER_ORDER,
    RO_LETTERS_BEFORE_SHIFT,
    RO_PUNCT_ORDER,
    DIGIT_ORDER,
    RO_SYMBOL_ORDER,
    roPunktNachShift,
  );
  const ro: LernwegDef = {
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): Hauptsprache gesetzt (Wortschatz, Korpus Charge 1 da) - Übungssprache = sie + Englisch.
    hauptsprache: "ro",
    letterOrder: RO_LETTER_ORDER,
    introOrder: roIntroOrder,
    startpunktFolge: baueStartpunktFolge(RO_LETTER_ORDER, RO_LETTERS_BEFORE_SHIFT, RO_PUNCT_ORDER, DIGIT_ORDER, RO_SYMBOL_ORDER),
    lettersBeforeShift: RO_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8 (`ș` auf `ro`, `;` auf `ro-prog`)
    initialLetters: INITIAL_LETTERS, // 2 (F + J)
    punctOrder: RO_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: RO_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, RO_T1_LETTER_END, RO_T2_LETTER_END, RO_LETTER_ORDER.length],
    homeKeys: RO_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar; dazu die rumänischen Anführungszeichen „ ” (Bauplan R7) - nie nur eine Hälfte.
    paareGemeinsam: { "„": "”", ...KLAMMER_PAARE },
    punktNachShift: roPunktNachShift,
    // ★ F4-RO (Bauplan R2): auf `ro-prog` ist die achte Heimtaste `;` (US-Grundebene); `ș` kommt dort direkt nach `ă` - beide sind
    // AltGr + Grundbuchstabe, die zwei ersten AltGr-Griffe zusammen.
    achteGrundtasten: { "ro-prog": ";" },
    verdraengtNach: "ă",
    // ★ F4-RO (Bauplan R9): `Ă Â Î Ș Ț` sind auf `ro-prog` AltGr + Umschalt + Buchstabe (`KeyAccess.buchstabe`) - erst mit der letzten
    // Buchstaben-Einheit (`q`, auf beiden Tastaturen). Auf `ro` Umschalt + eigene Taste: dort greift die Schranke nicht (`grossbuchstabeFrei`).
    grossAkzentSpaet: RO_GROSS_AKZENT,
    grossAkzentAb: "q",
  };
  // ★★★ F4-NL (25.10.2026): die eigene niederländische Reihenfolge - ersetzt den G2-NEUN-Alias von „en". EINE Folge am Wert für
  // `nl-intl`, `be` und `nl-dutch` (N2); noch KEINE Hauptsprache. `. , ?` direkt nach ⇧.
  const nlPunktNachShift: readonly string[] = [...PUNKT_UND_KOMMA, "?"];
  const nlIntroOrder: readonly string[] = baueEinfuehrung(
    NL_LETTER_ORDER,
    NL_LETTERS_BEFORE_SHIFT,
    NL_PUNCT_ORDER,
    DIGIT_ORDER,
    NL_SYMBOL_ORDER,
    nlPunktNachShift,
  );
  const nl: LernwegDef = {
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): Hauptsprache gesetzt (Wortschatz, Korpus Charge 1 da) - Übungssprache = sie + Englisch.
    hauptsprache: "nl",
    letterOrder: NL_LETTER_ORDER,
    introOrder: nlIntroOrder,
    startpunktFolge: baueStartpunktFolge(NL_LETTER_ORDER, NL_LETTERS_BEFORE_SHIFT, NL_PUNCT_ORDER, DIGIT_ORDER, NL_SYMBOL_ORDER),
    lettersBeforeShift: NL_LETTERS_BEFORE_SHIFT,
    homeRowLetters: HOME_ROW_LETTERS, // 8 (`;` auf nl-intl, `m` auf be, `+` auf nl-dutch)
    initialLetters: INITIAL_LETTERS, // 2 (F + J - auf allen drei Tastaturen KeyF/KeyJ)
    punctOrder: NL_PUNCT_ORDER,
    digitOrder: DIGIT_ORDER,
    symbolOrder: NL_SYMBOL_ORDER,
    tierCuts: [HOME_ROW_LETTERS, NL_T1_LETTER_END, NL_T2_LETTER_END, NL_LETTER_ORDER.length],
    homeKeys: NL_HOME_KEYS,
    // ★ D1 Nr. 19: Klammern als festes Paar (siehe KLAMMER_PAARE).
    paareGemeinsam: KLAMMER_PAARE,
    punktNachShift: nlPunktNachShift,
    // ★ F4-NL (Bauplan N2): die achte Heimtaste am Wert - `m` auf Belgisch AZERTY, `+` auf Windows „Dutch"; das verdrängte `;` kommt
    // dort hinter `:` (beide Zeichen der Satzzeichen-Folge).
    achteGrundtasten: { be: "m", "nl-dutch": "+" },
    verdraengtNach: ":",
    // ★ F4-NL (Bauplan N3): der Apostroph ist auf `nl-intl` die Akut-Totaste - sein Ziel im Lehrgang ist nur `é` (auf `be` und
    // `nl-dutch` ist `'` keine Totaste, dort sagt die Feier nichts dazu).
    totastenZiele: { "'": ["é"] },
    // ★ F4-NL (Bauplan N6): grosse Akzentbuchstaben erst mit der letzten Buchstaben-Einheit (`q`, auf allen drei Tastaturen).
    grossAkzentSpaet: NL_GROSS_AKZENT,
    grossAkzentAb: "q",
  };

  // ★★★ F4-PT-BR-SV (25.10.2026): die eigenen Reihenfolgen von „pt", „br" und „sv" - ersetzen den G2-NEUN-Alias von „en". Noch
  // KEINE Hauptsprache (eigener Schritt, wenn Wortschatz da ist): die Inhalte kommen bis dahin aus „en", die Tastenfolge ist die des
  // Weges. `. ,` direkt nach ⇧ (D-1, Vorgabe von `baueEinfuehrung`). Ziffern wie jeder Weg.
  const wegMitFolge = (
    letters: readonly string[],
    vorShift: number,
    punct: readonly string[],
    symbole: readonly string[],
    t1: number,
    t2: number,
    homeKeys: ReadonlySet<string>,
    mehr: Partial<LernwegDef>,
  ): LernwegDef => ({
    letterOrder: letters,
    introOrder: baueEinfuehrung(letters, vorShift, punct, DIGIT_ORDER, symbole),
    startpunktFolge: baueStartpunktFolge(letters, vorShift, punct, DIGIT_ORDER, symbole),
    lettersBeforeShift: vorShift,
    homeRowLetters: HOME_ROW_LETTERS, // 8 (die achte Heimtaste ist ç bzw. ö)
    initialLetters: INITIAL_LETTERS, // 2 (F + J: auf `pt`, `br-abnt2` und `sv` liegen f und j auf KeyF/KeyJ)
    punctOrder: punct,
    digitOrder: DIGIT_ORDER,
    symbolOrder: symbole,
    tierCuts: [HOME_ROW_LETTERS, t1, t2, letters.length],
    homeKeys,
    ...mehr,
  });
  // ★★★ GEN-HAUPTSPRACHE (29.10.2026): pt, br, sv mit Hauptsprache (Wortschatz, Korpus Charge 1 da).
  // ★ F4-PT-BR-SV: `« »` (Portugal) als festes Paar wie die Klammern; die vier Totasten mit ihren Zielen.
  const pt = wegMitFolge(PT_LETTER_ORDER, PT_LETTERS_BEFORE_SHIFT, PT_PUNCT_ORDER, PT_SYMBOL_ORDER, PT_T1_LETTER_END, PT_T2_LETTER_END,
    PT_HOME_KEYS, { hauptsprache: "pt", paareGemeinsam: { "«": "»", ...KLAMMER_PAARE }, totastenZiele: PT_TOTASTEN_ZIELE });
  const br = wegMitFolge(BR_LETTER_ORDER, BR_LETTERS_BEFORE_SHIFT, BR_PUNCT_ORDER, BR_SYMBOL_ORDER, BR_T1_LETTER_END, BR_T2_LETTER_END,
    PT_HOME_KEYS, { hauptsprache: "br", paareGemeinsam: KLAMMER_PAARE, totastenZiele: PT_TOTASTEN_ZIELE });
  // ★ F4-PT-BR-SV: die Totaste ´ gibt auf Weg „sv" nur é (S3).
  const sv = wegMitFolge(SV_LETTER_ORDER, SV_LETTERS_BEFORE_SHIFT, SV_PUNCT_ORDER, SV_SYMBOL_ORDER, SV_T1_LETTER_END, SV_T2_LETTER_END,
    SV_HOME_KEYS, { hauptsprache: "sv", paareGemeinsam: KLAMMER_PAARE, totastenZiele: { "´": ["é"] } });
  return Object.freeze({
    de,
    en,
    fr,
    es,
    it,
    pl,
    tr,
    cs,
    // ★ G2-NEUN (25.10.2026): die neun Wege des Gerüsts sind bis zu ihrer eigenen Reihenfolge (F4 der Sprache) ein
    // bewusster ALIAS von „en" (wie it/pl/tr/cs in G2a) - eine eigene Kopie je Weg, damit niemand „en" über sie ändert.
    // ★★★ Seit F4 (25.10.2026) hat jeder der neun Wege seine eigene Reihenfolge, noch ohne Hauptsprache.
    bg, // F4-KYR-GR
    el, // F4-KYR-GR
    hu, // F4-HU
    nl, // F4-NL
    pt, // F4-PT-BR-SV
    br, // F4-PT-BR-SV
    ro, // F4-RO
    sv, // F4-PT-BR-SV
    uk, // F4-KYR-GR
  });
}

/** Die Definition eines Weges (beim ersten Zugriff gebaut, siehe Kopf). */
export function lernwegDef(lernweg: Lernweg): LernwegDef {
  if (!tabelle) tabelle = baueTabelle();
  return tabelle[lernweg];
}

/**
 * Die Tabelle aller Wege. Die Einträge sind Getter, damit das Modul beim
 * Laden nichts aus letters.ts anfasst (Zirkel-Falle, siehe Kopf).
 */
export const LERNWEGE: Readonly<Record<Lernweg, LernwegDef>> = Object.freeze({
  get de() {
    return lernwegDef("de");
  },
  get en() {
    return lernwegDef("en");
  },
  get fr() {
    return lernwegDef("fr");
  },
  get es() {
    return lernwegDef("es");
  },
  get it() {
    return lernwegDef("it");
  },
  get pl() {
    return lernwegDef("pl");
  },
  get tr() {
    return lernwegDef("tr");
  },
  get cs() {
    return lernwegDef("cs");
  },
  // ★ G2-NEUN (25.10.2026): die neun Wege des Gerüsts (Alias von „en", siehe `baueTabelle`).
  get bg() {
    return lernwegDef("bg");
  },
  get el() {
    return lernwegDef("el");
  },
  get hu() {
    return lernwegDef("hu");
  },
  get nl() {
    return lernwegDef("nl");
  },
  get pt() {
    return lernwegDef("pt");
  },
  get br() {
    return lernwegDef("br");
  },
  get ro() {
    return lernwegDef("ro");
  },
  get sv() {
    return lernwegDef("sv");
  },
  get uk() {
    return lernwegDef("uk");
  },
});

/**
 * Der Lernweg eines Kontos oder eines Fortschritts. Fehlt er oder ist er
 * ungültig, gilt „de" - das ist die Regel für jedes heute bestehende Konto
 * (§2.2 „Bestand": niemand, der heute übt, merkt etwas).
 *
 * Nimmt alles, was ein Feld `lernweg` tragen kann (Konto, Fortschritt,
 * Klasse), damit es für alle EINE Regel gibt.
 */
export function lernwegVon(x: { lernweg?: unknown } | null | undefined): Lernweg {
  const w = x?.lernweg;
  // Fehlt der Weg (kein Feld, leerer Wert), gilt „de" - das ist der Bestand.
  if (w === undefined || w === null || w === "") return "de";
  if (istLernweg(w)) return w;
  // ★ G2a (G1c §3 Nr. 2): ein Wert, der da ist und KEIN Lernweg ist, fällt nicht
  // mehr still auf „de" - ein Kind würde sonst unbemerkt auf dem falschen Weg
  // üben (Falle 50). Der Fehler zeigt sich am ersten Aufruf.
  const meldung = `Unbekannter Lernweg: ${JSON.stringify(w)} (bekannt: ${LERNWEGE_LISTE.join(", ")})`;
  // ⚠️ Im ausgelieferten Programm stürzt die Seite eines Kindes NICHT ab: ein Wert aus dem
  // Gerätespeicher oder vom Server kann von einem neueren oder älteren Stand stammen (nach
  // einem Zurückrollen kennt der alte Stand die neue Sprache nicht). Dort laut melden und auf
  // „de" zurückfallen; in Entwicklung und Tests wirft es (Falle 50 bleibt bewacht).
  if (import.meta.env.PROD) {
    console.error(meldung);
    return "de";
  }
  throw new Error(meldung);
}

/**
 * Der Lernweg eines KINDES aus Konto und Fortschritt: das Konto gewinnt (dort
 * steht die Wahrheit, am Server einmal schreibbar), sonst die Kopie im
 * Fortschritt (Gast, Offline, Mock), sonst „de".
 */
export function lernwegAus(
  konto: { lernweg?: unknown } | null | undefined,
  fortschritt: { lernweg?: unknown } | null | undefined,
): Lernweg {
  if (istLernweg(konto?.lernweg)) return konto.lernweg;
  return lernwegVon(fortschritt);
}

/**
 * Was ein FORTSCHRITT über den Weg sagt: seine Kopie, wenn er eine trägt.
 * Sonst - wenn in ihm schon geübt wurde - „de": Der erste Fortschritt ist
 * dann längst entstanden, und zwar auf dem einzigen Weg, den es davor gab
 * (§2.2 „Bestand": wer heute übt, bleibt auf „de", auch mit Probe-Schalter
 * und englischer Bedienung). `null` heisst: noch nichts festgelegt.
 */
export function fortschrittsLernweg(
  fortschritt: { lernweg?: unknown } | null | undefined,
  schonGeuebt: boolean,
): Lernweg | null {
  if (istLernweg(fortschritt?.lernweg)) return fortschritt.lernweg;
  return schonGeuebt ? "de" : null;
}

// ── Die Schalter der Lehrgänge ──────────────────────────────────────────────
// Stehen seit 28.09.2026 in `lehrgangSchalter.ts` (Grund dort) und werden hier
// unverändert weitergereicht - jeder bisherige Import aus `lernweg` gilt.
export {
  LEHRGANG_PROBE_ADRESSE,
  LEHRGANG_PROBE_ADRESSE_ES,
  LEHRGANG_PROBE_ADRESSE_FR,
  LEHRGANG_PROBE_MERKER,
  LEHRGANG_PROBE_MERKER_ES,
  LEHRGANG_PROBE_MERKER_FR,
  LEHRGANG_PROBE_ADRESSE_CS,
  LEHRGANG_PROBE_ADRESSE_IT,
  LEHRGANG_PROBE_ADRESSE_PL,
  LEHRGANG_PROBE_ADRESSE_TR,
  LEHRGANG_PROBE_MERKER_CS,
  LEHRGANG_PROBE_MERKER_IT,
  LEHRGANG_PROBE_MERKER_PL,
  LEHRGANG_PROBE_MERKER_TR,
  SPANISCHE_EINSTIEGSADRESSE,
  // ★ G2-NEUN (25.10.2026): die neun Schalter des Gerüsts.
  GERUEST_EINSTIEGSADRESSEN,
  GERUEST_EINSTIEGSPFADE,
  GERUEST_LEHRGAENGE,
  GERUEST_LEHRGANG_SCHALTER,
  geruestLehrgangProbeAn,
  geruestLehrgangProben,
  type GeruestLehrgang,
  englischLehrgangProbeAn,
  franzoesischLehrgangProbeAn,
  italienischLehrgangProbeAn,
  neueLehrgangProben,
  polnischLehrgangProbeAn,
  spanischLehrgangProbeAn,
  tschechischLehrgangProbeAn,
  tuerkischLehrgangProbeAn,
} from "./lehrgangSchalter";
import {
  englischLehrgangProbeAn,
  franzoesischLehrgangProbeAn,
  neueLehrgangProben,
  spanischLehrgangProbeAn,
} from "./lehrgangSchalter";
import { istGeruestSprache, istSprache } from "./sprachRegister";
import type { GeruestLehrgang as GeruestLehrgangTyp } from "./lehrgangSchalter";

// ── Gäste ohne Konto ─────────────────────────────────────────────────────────

/** Der Lernweg eines Gastes ohne Konto - je Gerät. */
export const GAST_SCHLUESSEL = "tastenflow-lernweg";

/** Der gemerkte Weg eines Gastes, oder `null`, wenn noch keiner feststeht. */
export function gastLernwegLesen(): Lernweg | null {
  try {
    const w = window.localStorage.getItem(GAST_SCHLUESSEL);
    return istLernweg(w) ? w : null;
  } catch {
    return null;
  }
}

/** Den Weg eines Gastes merken. Ein schon gemerkter Weg wird NIE überschrieben (D2). */
export function gastLernwegMerken(lernweg: Lernweg): void {
  try {
    if (istLernweg(window.localStorage.getItem(GAST_SCHLUESSEL))) return;
    window.localStorage.setItem(GAST_SCHLUESSEL, lernweg);
  } catch {
    /* Speicher gesperrt - dann gilt der Weg eben nur bis zum Neuladen */
  }
}

// ── Die Entscheidung ─────────────────────────────────────────────────────────

/**
 * ★★★ WELCHER WEG GILT - die ganze Regel an EINER Stelle (§2.2, D1, D2).
 *
 *  1. Ein gespeicherter Weg gewinnt IMMER - er springt nie um, auch nicht,
 *     wenn die Bedienung später umgeschaltet wird.
 *  2. Französische Bedienung UND der französische Schalter an ⇒ „fr" (Bauplan
 *     französischer Lehrgang, D1/F16). ★ E2a: OHNE den Schalter ändert eine
 *     französische Bedienung HIER nichts - sie fällt weiter durch zu Regel 3
 *     wie jede andere nicht-englische Bedienung (heutiges Verhalten,
 *     unverändert: `erkenneBedienSprache` liefert bislang ohnehin nie „fr").
 *  3. Ohne englischen Probe-Schalter: „de". Bis E10 (englisch) durfte ein
 *     halber Lehrgang kein Kind erreichen - dieselbe Regel gilt für „fr" bis
 *     E14.
 *  4. Sonst aus der Bedienungssprache: englische Bedienung ⇒ „en", alles
 *     andere ⇒ „de". (Deutsche Bedienung + Übungssprache Englisch bleibt „de" -
 *     die Übungssprache fragt diese Funktion darum gar nicht.)
 *
 * Rein: liest nichts, schreibt nichts. WANN das Ergebnis gespeichert wird
 * (beim ersten Fortschritt), entscheidet der Aufrufer.
 */
export function bestimmeLernweg(opts: {
  gespeichert: Lernweg | null | undefined;
  bedienSprache: BedienSprache;
  lehrgangProbeAn: boolean;
  /** ★ E2a: optional, damit kein bestehender Aufrufer sich ändern muss - fehlt er, gilt „aus". */
  franzoesischLehrgangProbeAn?: boolean;
  /** ★ ES-F2: optional, aus demselben Grund - fehlt er, gilt „aus". */
  spanischLehrgangProbeAn?: boolean;
  /**
   * ★ G2a (02.10.2026): die Schalter der vier neuen Sprachen - alle optional,
   * fehlt einer, gilt „aus" (ohne ihn verhält sich die Bedienung wie jede
   * andere ohne Lehrgang: „de").
   */
  italienischLehrgangProbeAn?: boolean;
  polnischLehrgangProbeAn?: boolean;
  tuerkischLehrgangProbeAn?: boolean;
  tschechischLehrgangProbeAn?: boolean;
  /**
   * ★ G2-NEUN (25.10.2026): die neun Schalter des Gerüsts (Vorgabe aus) - optional; fehlt einer, gilt „aus"
   * (die Bedienung verhält sich dann wie jede andere ohne Lehrgang: „de").
   */
  geruestLehrgangAn?: Partial<Record<GeruestLehrgangTyp, boolean>>;
}): Lernweg {
  if (istLernweg(opts.gespeichert)) return opts.gespeichert;
  // ★ G2a (G1c §3 Nr. 2): eine unbekannte Bedienungssprache wirft - sie fiel
  // bisher still auf „de".
  if (!istSprache(opts.bedienSprache)) {
    throw new Error(`Unbekannte Bedienungssprache: ${JSON.stringify(opts.bedienSprache)}`);
  }
  if (opts.bedienSprache === "fr") return opts.franzoesischLehrgangProbeAn ? "fr" : "de";
  if (opts.bedienSprache === "es") return opts.spanischLehrgangProbeAn ? "es" : "de";
  if (opts.bedienSprache === "it") return opts.italienischLehrgangProbeAn ? "it" : "de";
  if (opts.bedienSprache === "pl") return opts.polnischLehrgangProbeAn ? "pl" : "de";
  if (opts.bedienSprache === "tr") return opts.tuerkischLehrgangProbeAn ? "tr" : "de";
  if (opts.bedienSprache === "cs") return opts.tschechischLehrgangProbeAn ? "cs" : "de";
  // ★ G2-NEUN (25.10.2026): eine Eigenschaft statt neun Zeilen - die Bedienung einer Sprache des Gerüsts führt nur
  // mit ihrem eigenen Schalter auf ihren Weg.
  if (istGeruestSprache(opts.bedienSprache)) {
    return opts.geruestLehrgangAn?.[opts.bedienSprache] ? opts.bedienSprache : "de";
  }
  if (!opts.lehrgangProbeAn) return "de";
  return opts.bedienSprache === "en" ? "en" : "de";
}

/**
 * Der Weg für ein Konto, das sich GERADE selbst anlegt (Selbstanmeldung).
 *
 *  · `lernweg` - der Weg, in dem die Startpunkte des Formulars gerechnet
 *    werden (`startPoints(sprache, lernweg)`): Ihre Zahlen gelten nur in ihm.
 *  · `mitgeben` - was beim Anlegen ans Konto geht. Ein Gast, der schon geübt
 *    hat, bringt seinen festen Weg mit. Mit Probe-Schalter wird der Weg beim
 *    Anlegen fest, weil der gewählte Startpunkt eine Anzahl in ihm ist.
 *    Sonst `undefined` - das Feld bleibt leer (= „de").
 */
export function lernwegBeimAnlegen(bedienSprache: BedienSprache): {
  lernweg: Lernweg;
  mitgeben: Lernweg | undefined;
} {
  const gespeichert = gastLernwegLesen();
  const lehrgangProbeAn = englischLehrgangProbeAn();
  const franzProbeAn = franzoesischLehrgangProbeAn();
  const spanProbeAn = spanischLehrgangProbeAn();
  const neue = neueLehrgangProben();
  const lernweg = bestimmeLernweg({
    gespeichert,
    bedienSprache,
    lehrgangProbeAn,
    franzoesischLehrgangProbeAn: franzProbeAn,
    spanischLehrgangProbeAn: spanProbeAn,
    ...neue,
  });
  const eineNeueAn =
    neue.italienischLehrgangProbeAn ||
    neue.polnischLehrgangProbeAn ||
    neue.tuerkischLehrgangProbeAn ||
    neue.tschechischLehrgangProbeAn ||
    // ★ G2-NEUN (25.10.2026): ebenso jeder der neun Schalter des Gerüsts.
    Object.values(neue.geruestLehrgangAn).some(Boolean);
  return {
    lernweg,
    mitgeben:
      gespeichert ?? (lehrgangProbeAn || franzProbeAn || spanProbeAn || eineNeueAn ? lernweg : undefined),
  };
}
