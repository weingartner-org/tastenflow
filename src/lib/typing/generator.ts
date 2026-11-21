/**
 * Übungs-Generator: erzeugt Zeilen zum Tippen, die NUR aus bereits
 * freigeschalteten Tasten bestehen.
 *
 * Strategie (nach keybr/TIPP10, siehe [[project_zehnfinger_trainer]]):
 *   • wenige Buchstaben (Grundstellung) → aussprechbare Markov-Pseudowörter
 *     (Ordnung 3, aus echtem Deutsch gelernt) bzw. einfache Silben als Notfall,
 *   • genug Buchstaben → echte deutsche Wörter (Wortliste + stufen-getaggter
 *     Bonus-Wortschatz),
 *   • neue Tasten dieser Lektion werden bevorzugt eingebaut (Fehlerfokus),
 *   • Großschreibung sobald die Umschalt-Lektion erreicht ist,
 *   • Text-Lektionen (kind "text") ziehen alters-gestufte Zeilen aus dem
 *     geprüften Korpus (Witze, Zungenbrecher, Wortspiele, Sprüche, Fakten,
 *     ganze Sätze) — passend zur gewählten Altersstufe.
 */
import { lessonById, unlockedKeysWith, shiftUnlockedWith } from "./curriculum";
import { KLAMMER_PAARE, lernwegDef, type Lernweg } from "./lernweg";
import type { GezieltAnteil } from "./gezielt";
import { KOMBIZEICHEN, grossbuchstabeWeg, istTotasteDerListen } from "./totasten";
import { WORDS, isNoun } from "./words";
import { corpusEntriesFor, type CorpusEntry } from "./corpusManifest";
// ★★★★★ ES-P7a-Behebung (27.09.2026, M2): dieselbe Totasten-Prüfung wie
// `fitText` (`corpus.ts`) - EINE Quelle statt einer zweiten Kopie (Falle 32).
import { hatTotastenEinheit, nurKleinschrift, totastenBuchstabeFrei } from "./corpus";
import { seenHas } from "./ledger";
import { markovWord } from "./markov";
import { heimZeichenDesWeges } from "./heimtasten";
import { isRealWord, normalizeWord } from "./lexicon";
import { grossFuer, istBuchstabe, istGeruestSprache, kleinFuer, sprachBeschreibung } from "./sprachRegister";
import { activeLayout, toLayoutText } from "./layouts";
import { STUFE_VOCAB } from "./corpusExtras";
import { WORDS_EN, STUFE_VOCAB_EN } from "./corpusEn";
import { WORDS_FR, STUFE_VOCAB_FR } from "./wordsFr";
import { WORDS_ES, STUFE_VOCAB_ES } from "./wordsEs";
import { WORDS_IT, STUFE_VOCAB_IT } from "./wordsIt";
import { gesperrtIt } from "./sperrlisteIt";
import { WORDS_PL, STUFE_VOCAB_PL } from "./wordsPl";
import { gesperrtPl } from "./sperrlistePl";
import { WORDS_TR, STUFE_VOCAB_TR } from "./wordsTr";
import { gesperrtGefaltetTr } from "./sperrlisteTr";
import { WORDS_CS, STUFE_VOCAB_CS } from "./wordsCs";
import { gesperrtCs } from "./sperrlisteCs";
// ★ G3c-VERTEILER (25.10.2026): die Wörter der neun Gerüst-Wege (`words<Xx>.ts`) - leer ⇒ Englisch.
import { GERUEST_WORDS, GERUEST_STUFE_VOCAB } from "./geruestWoerter";
import { eigenOderEn, stufenOderEn } from "./geruestRueckfall";
import {
  DIGIT_ORDER,
  PUNCT_ORDER,
  SHIFT_UNIT,
  SYMBOL_ORDER,
  istTotastenEinheit,
} from "./letters";
import type { Lang, Stufe } from "./account";
import { VORGABE_STUFE, contentStufenFor } from "./account";
import { gelaeufigkeitsZeile } from "./uebungsformen/gelaeufigkeit";
import { wandleTypografie, type FranzVariante } from "./franzVariante";
import { esZahlGebiet, wandleFormatoNumerico, type EsVariante } from "./esVariante";
import { mitRueckfallEn } from "./sprachRegister";

/**
 * Eine erzeugte Übungszeile MIT Herkunft (Textwelt TW-E2): `source` ist der
 * stabile Manifest-Index des Bausteins, aus dem die Zeile stammt — oder `null`
 * für generierte Zeilen (Wort-/Silben-/Zeichen-Drill), die NICHT ins No-Repeat-
 * Ledger gehen. Der Aufrufer verbucht bei jeder getippten Zeile mit `source`
 * diesen Index (siehe TypingSession/AdaptiveTrainer).
 */
/**
 * Woraus eine Übungszeile BESTEHT - vom Generator vergeben, nicht vom
 * Bildschirm erraten.
 *
 * ★★ Anlass (Jens, 29.08.2026): „Hier waren es aber immer Non-Sense-Wörter,
 * obwohl richtige angekündigt waren. Außerdem wurden darunter auch Zahlen und
 * Temperaturangaben verstanden." Der Übungsbildschirm entschied die Ansage bis
 * dahin selbst - er sah den fertigen Text an und fragte das Lexikon, ob JEDES
 * Wort echt sei. Zwei Fehler folgten daraus zwangsläufig:
 *   • Ein einziger Zufallstreffer kippte die ganze Zeile. Gemessen an der
 *     Grundreihe trugen **57 % der als „echte Wörter" angesagten Zeilen
 *     trotzdem Unsinnwörter** („lös lad", „öl alal llöd ölö").
 *   • Eine Zeile ohne Buchstaben galt nie als Unsinn - „421 15 6" und
 *     „532° 817°" wurden als „echte Wörter" angekündigt (rund 55 % aller
 *     Ansagen auf den oberen Ständen).
 * Beides war dieselbe Doppelung: Der Generator WEISS, was er gebaut hat, und
 * daneben riet eine zweite Stelle dasselbe noch einmal - schlechter.
 */
export type ZeilenArt =
  /** Ein echter Satz aus Korpus oder Serie. */
  | "text"
  /** Echte Wörter ohne Zusammenhang (Wort-Drill, Zeichen-Übung im Mini-Kontext). */
  | "woerter"
  /** Pseudowörter/Übungssilben - Wörter, die es nicht gibt. */
  | "unsinn"
  /** Zahlen und Zeichen ohne Wort („421 15 6", „23 °C", „9:15"). */
  | "zahlen";

/**
 * Ist die Zeile eine reine Zahlen-/Zeichenzeile? Gefragt wird nach dem, was
 * DASTEHT, nicht nach Bedeutung: mindestens eine Ziffer und kein Wort (keine
 * zwei zusammenhängenden Buchstaben). „23 °C" zählt damit als Zahlenzeile - das
 * einzelne C ist eine Einheit, kein Wort -, „23 km/h" dagegen nicht.
 */
export function istZahlenzeile(text: string): boolean {
  if (!/[0-9]/.test(text)) return false;
  // ★ Mechanik-Prüfung fr (26.09.2026, K9): auch die französischen Akzent-
  // buchstaben sind Buchstaben - „été 12" ist keine Zahlenzeile. Deutsch und
  // Englisch: dieselbe Antwort wie vorher (dort steht kein é in einem Wort,
  // das erst mit ihm auf zwei Buchstaben kommt - gemessen im Befund).
  return !/\p{L}{2,}/u.test(text);
}

/** Besteht die Zeile AUSSCHLIESSLICH aus echten Wörtern dieser Sprache? */
function nurEchteWoerter(text: string, lang: Lang): boolean {
  const toks = text.split(/\s+/).filter((t) => normalizeWord(t, lang).length >= 2);
  return toks.length > 0 && toks.every((t) => isRealWord(t, lang));
}

/**
 * Die Art einer GENERIERTEN Zeile (Korpus-Zeilen sind immer „text").
 *
 * ⚠️ Die Pseudowort-Werkstatt trifft manchmal ein echtes Wort: Gemessen bestanden
 * **2,8 % der deutschen Unsinn-Zeilen** ausschließlich aus echten Wörtern
 * („fall das", „lass als", „dass als") - der deutsche Markov-Kern baut nun
 * einmal deutsch aussehende Silben, und aus der Grundreihe sind das oft Wörter.
 * Für das KIND ist so eine Zeile keine Unsinn-Zeile, also heißt sie auch nicht
 * so. Im Englischen kam es nicht vor (dort gibt es kein Markov, nur Silben).
 */
function artFuerDrill(text: string, unsinn = false, lang: Lang = "de"): ZeilenArt {
  if (unsinn && !nurEchteWoerter(text, lang)) return "unsinn";
  return istZahlenzeile(text) ? "zahlen" : "woerter";
}

export interface RoundLine {
  text: string;
  source: number | null;
  /** Woraus die Zeile besteht - Grundlage der Ansage („Achtung, jetzt …"). */
  art: ZeilenArt;
  /**
   * Gesetzt bei ÜBUNGSZEILEN aus Pseudowörtern: die Einheiten, die diese Zeile
   * gezielt übt. Die Oberfläche erklärt damit, warum hier Wörter stehen, die es
   * nicht gibt („damit du deine wackeligen Tasten übst").
   *
   * Warum es diese Zeilen überhaupt gibt: Gemessen am 28.08.2026 bekamen
   * wackelige Tasten im normalen Satz-Text KEINE nennenswerte Extra-Übung
   * (+11 % auf hakende, -0,7 % auf wackelige — `scripts/_fokuskontrolle.mts`).
   * Der Grund ist banal: In deutschen Sätzen kommen `m`, `w`, `b` nun einmal
   * selten vor, und die Sortierung „Zeile enthält die Taste" ändert daran wenig.
   * keybr und TIPP10 lösen dasselbe Problem gleich — mit Wort- statt Satzdiktat.
   */
  uebung?: string[];
}

/**
 * ★★★ Mechanik-Prüfung fr (26.09.2026, M1 - Leitfaden Falle 7, zum dritten
 * Mal): Buchstaben und Vokale ALLER Wege. Bis hierher kannten beide Listen nur
 * das Deutsche - `é à è ç ù` fielen in „Mein Training" aus dem Tastenstand,
 * die Runde enthielt sie nie (gemessen: 0 von 240 Zeilen, 0 Anschläge), und
 * die Einheit wurde trotzdem freigeschaltet. Wege „de"/„en": wirkungslos, dort
 * steht keiner der neuen Buchstaben im Tastenstand.
 *
 * ★★★ ES-F5/F6 (27.09.2026): ñ á é í ó ú dazu (é/ñ als Konsonant/Sonderfall
 * schon möglich, á í ó ú fehlten als Vokal) - dieselbe Fehlerklasse: ohne sie
 * wären á/í/ó/ú in `isVowel` weder Vokal noch (über `LETTER_RE` gefiltert)
 * überhaupt ein Buchstabe, und Pseudowort-Silben für Weg „es" hätten sie nie
 * gebildet. de/en/fr unverändert (keiner ihrer Texte enthält á/í/ó/ú/ñ).
 */
// ★★★ F5-F8 Italienisch (02.10.2026): ì ò dazu - beide fehlten (`î`/`ô` standen schon da): ohne sie wäre `ò`, die ACHTE
// Grundtaste des Weges „it", in der Silben-Werkstatt ein Konsonant gewesen (der Fingeranker `ò` bildet aber den Vokal in
// `andò`, `però`, `può`). à è é ù standen schon da. de/en/fr/es: wirkungslos - ihre Wörter tragen kein ì/ò (Golden-Tests).
// ★★★ F5-F8 Türkisch (03.10.2026): `ı` dazu - der Vokal der Heimreihe-Nachbarschaft (Einheit Nr. 15), der in keiner anderen Sprache
// steht: ohne ihn wäre `ı` in der Silben-Werkstatt ein Konsonant gewesen (`kalın` ⇒ `kaln`). `ö ü â î û` standen schon da.
// ★★★ F5-F8 Tschechisch (03.10.2026): ě ů ý dazu - `ů` ist die ACHTE Grundtaste des Weges „cs" (sie bildet den Vokal in `dům`, `kůl`,
// `sůl`), `ě` und `ý` stehen auf der Zahlenreihe; ohne sie wären sie in der Silben-Werkstatt Konsonanten gewesen. Das tschechische `y`
// ist auch ein Vokal - es bleibt in der Liste der anderen Wege ein Konsonant (Golden-Tests de/en/fr/es) und gilt nur für „cs"
// (`istVokal` in `wordDrillZeilen`). de/en/fr/es/it: wirkungslos - ihre Wörter tragen kein `ı`/ě/ů/ý (Golden-Tests).
const VOWELS = "aeiouäöüàâéèêëîïôùûÿáíóúìòıěůý";
// ★ G2b-1 (02.10.2026, Befund G1c §3 Nr. 4): KEINE Buchstaben-Liste mehr - `LETTER_RE`
// (`[a-zäöüßàâçéèêëîïôùûÿœñáíóú]`) kannte keinen Sonderbuchstaben einer neuen
// Sprache (ı ğ ş ł ą ę ś č ě ř ž ů ì ò …): sie zählten nicht als Buchstabe, die
// Konsonanten-Listen und `rundenEinheiten` blieben für sie leer. Jetzt fragt
// jede Stelle `istBuchstabe()` (Unicode `\p{L}`, sprachRegister.ts).
// ⚠️ OFFEN (Phase der jeweiligen Sprache): `VOWELS` oben ist eine Liste der
// VOKALE - Sprachdaten, nicht aus `\p{L}` ableitbar (tr ı i ö ü, pl ą ę ó y,
// cs á é ě í ó ú ů ý, it à è é ì ò ù). Sie kommt mit dem Generator der Sprache.

/**
 * Ab so vielen passenden ECHTEN Wörtern fallen Unsinnwörter komplett weg (Wunsch
 * Johannes). Darunter werden Unsinn-Zeilen anteilig beigemischt — aber NIE
 * innerhalb derselben Zeile mit echten Wörtern gemischt: eine Zeile ist entweder
 * ganz echt oder ganz Unsinn (das Mischen verwirrte die Kinder).
 */
export const REAL_WORD_FLOOR = 40;

/**
 * Steuerung des Drill-Anteils, wenn ein Satz-/Sonderzeichen im Fokus steht
 * (siehe `adaptiveRound`). Der Anteil richtet sich danach, wie viele ECHTE,
 * noch ungesehene Sätze mit genau diesem Zeichen der Korpus hergibt:
 *  • `CHAR_CORPUS_ENOUGH` ungesehene Treffer oder mehr ⇒ `CHAR_SHARE_SENSE`
 *    (Drill nur noch Beiwerk, geübt wird im sinnvollen Satz),
 *  • keine Treffer ⇒ `CHAR_SHARE_DRILL` (ohne Drill gäbe es gar keine Übung),
 *  • dazwischen linear.
 * `CHAR_CORPUS_ENOUGH` = 24 ≈ zwei volle Runden à 12 Zeilen, also genug Vorrat,
 * damit die Runde ohne Wiederholung aus echten Sätzen bestehen kann.
 */
export const CHAR_CORPUS_ENOUGH = 24;
export const CHAR_SHARE_DRILL = 0.78;
export const CHAR_SHARE_SENSE = 0.22;

/**
 * ★★★ F6-pl (03.10.2026): die Vokale des Polnischen - `ą ę ó y` dazu (`y` ist im Polnischen ein Vokal: `ryba`, `kot`/`koty`; in
 * `VOWELS` darf es NICHT stehen, sonst änderte sich die Silbenbildung für Deutsch und Englisch, deren Wörter ein `y` tragen -
 * Golden-Tests). Eine eigene Liste, die nur `wordDrillZeilen` für `lang = "pl"` benutzt.
 */
const VOWELS_PL = "aąeęioóuy";
/** Ist `c` in dieser Sprache ein Vokal? (Polnisch: {@link VOWELS_PL}, alle anderen: {@link VOWELS}, Byte für Byte wie vorher.) */
export function istVokalIn(c: string, lang: Lang): boolean {
  // ★ G3a-SCHRIFT (25.10.2026): die Vokale einer Sprache mit eigener Liste im Register (`vokale`, die neun des Gerüsts);
  // für alle anderen (Eigenschaft `null`) wie vorher.
  return (lang === "pl" ? VOWELS_PL : sprachBeschreibung(lang).vokale ?? VOWELS).includes(c);
}
/**
 * ★★★ F5-F8 Tschechisch (03.10.2026, Falle 75 in Neu): Ein BUCHSTABE, der in einem Wort stehen darf - nicht die Totaste. Der Háček `ˇ`
 * (U+02C7) hat die Unicode-Klasse `Lm` (Modifier Letter), `\p{L}` hielt ihn also für einen Buchstaben: ohne diese Zeile stünde er in
 * `rundenEinheiten` bei den Buchstaben, und die Silben-Werkstatt setzte ihn als Konsonant in ein Pseudowort („kˇa"). Die anderen Totasten
 * (`^ ´ ¨`) sind `Sk` und fielen nie auf. Für alle Wege ausser „cs" ändert sich nichts (nur dort ist `ˇ` eine Einheit).
 */
function istWortBuchstabe(c: string): boolean {
  return istBuchstabe(c) && !istTotasteDerListen(c);
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function cap(s: string, lang: Lang): string {
  // ★ G2b-1: in der Sprache des Wortes gross - Türkisch „iş" ⇒ „İş", nicht „Iş".
  return s ? grossFuer(s[0], lang) + s.slice(1) : s;
}

/**
 * ★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8 Punkt 2): den
 * ZEILEN-/SATZANFANG gross schreiben - aber nur, wo die Tastatur den
 * Grossbuchstaben direkt erzeugt. Gemessen: auf Frankreich AZERTY stand
 * viermal an einem Tag in der ERSTEN Zeile ein erzeugtes „Ùk kdu" - Ù geht
 * dort nur über die Gravis-Totaste (AltGr + 7), und Grossbuchstaben mit Akzent
 * sind eine eigene, späte Lektion (Johannes). Darum:
 *  · „fehlt" (Windows Frankreich É/Ç, Belgien Ç): nie gross - auf jedem Weg;
 *  · „totaste" auf Weg „fr": nicht gross, die erzeugte Zeile bleibt klein
 *    (die Grossbuchstaben mit Akzent übt die letzte Lektion mit echten Sätzen).
 * Alles andere wie bisher (`cap`).
 */
/**
 * ★★★ F5-F8 Türkisch (03.10.2026, F4-Befund §3 „offen"): Wege, deren Grossbuchstaben mit Akzent über eine TOTASTE entstehen und die
 * der Generator darum nie an den Zeilenanfang setzt - Französisch (`À È Ù` über Gravis, W1) und Türkisch (`Â Î Û` über `^`: die
 * Zeile `âşık …` bliebe sonst bei jedem Wort mit Zirkumflex am Anfang unschaffbar, ohne dass ein Kind den Griff Totaste, dann
 * Umschalt + Buchstabe je geübt hat). Eine EIGENSCHAFT des Weges, tabelliert (Falle 50) - Spanisch gehört bewusst NICHT dazu
 * (`Á É …` am Zeilenanfang wie bisher, Golden-Test `es`).
 */
const GROSSE_TOTASTE_NIE_AM_ANFANG: ReadonlySet<Lang> = new Set<Lang>(["fr", "tr"]);

export function capAmAnfang(s: string, lang: Lang): string {
  if (!s) return s;
  const gross = grossFuer(s[0], lang);
  const weg = grossbuchstabeWeg(gross, activeLayout());
  if (weg === "fehlt" || (weg === "totaste" && GROSSE_TOTASTE_NIE_AM_ANFANG.has(lang))) return s;
  // ★★★ F5-F8 Italienisch (02.10.2026, F4-Befund §10 Punkt 8): ein Weg mit SPÄTEN grossen Akzentbuchstaben
  // (`LernwegDef.grossAkzentSpaet`: Italienisch À È É Ì Ò Ù) setzt sie nie an den Anfang einer ERZEUGTEN Zeile - am Mac
  // (Option + Umschalt) und in Tessin (Totaste, dann Umschalt) hat das Kind den Griff noch nicht gelernt, die Zeile
  // bliebe sonst bei jedem Wort mit è/à am Anfang („È …") unschaffbar. Die erzeugte Zeile bleibt klein; die grossen
  // Akzentbuchstaben übt die späte Einheit `#` mit echten Sätzen (`grossbuchstabeFrei`, corpus.ts). Unter Windows greift
  // `fehlt` schon oben. An der EIGENSCHAFT gelesen (Falle 50), nicht am Namen; de/en/fr/es tragen sie nicht.
  if (lernwegDef(lang).grossAkzentSpaet?.includes(gross)) return s;
  return cap(s, lang);
}

/**
 * Korrekte Groß-/Kleinschreibung eines Übungsworts, je Sprache.
 *  • Deutsch: sobald die Umschalttaste sitzt (`shift`), werden Nomen groß-,
 *    Verben/Adjektive/Artikel kleingeschrieben; ohne Umschalt alles klein.
 *  • Englisch UND Französisch: Übungswörter bleiben klein - in beiden Sprachen
 *    werden Wörter mitten im Satz NICHT großgeschrieben (Bauplan §6.5 Punkt 2:
 *    „im Französischen nur am Satzanfang und bei Namen, keine Nomen groß").
 *    Die Großschreib-Praxis kommt aus den Korpus-Sätzen und dem Satzanfang
 *    (siehe `wordDrillLines`, {@link SENTENCE_CAP}).
 *
 * ★ E10c (26.09.2026): Tabelle statt Ternäre - vorher fiel „fr" auf den
 * DEUTSCHEN Zweig (`shift && isNoun(word)`) zurück, weil nur „en" ausgenommen
 * war. `isNoun` prüft deutsche Substantiv-Muster; auf ein französisches Wort
 * angewandt wären falsche Großschreibungen die Folge gewesen.
 */
// es: wie en/fr - im Spanischen werden Wörter mitten im Satz nicht
// großgeschrieben (grammatische Tatsache, kein Platzhalter).
const CAPITALIZES_NOUNS: Record<Lang, boolean> = { de: true, en: false, fr: false, es: false, it: false, pl: false, tr: false, cs: false, bg: false, el: false, hu: false, nl: false, pt: false, br: false, ro: false, sv: false, uk: false /* G2-NEUN: grammatische Tatsache, kein Rückfall */ };

function caseWord(word: string, shift: boolean, lang: Lang): string {
  // ★★★ F5-F8 Türkisch (03.10.2026): ein Wort MIT Apostroph ist ein Eigenname mit Endung (`ankara'da`, `ali'nin`) - türkisch steht
  // der Apostroph nur dort - und wird gross geschrieben, sobald Grossbuchstaben tippbar sind (türkisch gerechnet: `istanbul'a ⇒
  // İstanbul'a`). Die Wortliste führt sie klein (der Filter prüft Kleinbuchstaben). Andere Sprachen: ein Apostroph ist dort
  // Teil eines gewöhnlichen Wortes (`l'amico`), die Zeile bleibt klein.
  if (lang === "tr" && word.includes("'")) return shift ? cap(word, lang) : word;
  if (!CAPITALIZES_NOUNS[lang]) return word;
  return shift && isNoun(word) ? cap(word, lang) : word;
}

/**
 * Satzanfang großschreiben, sobald die Umschalttaste sitzt? Deutsch braucht das
 * hier nicht (die Nomen-Großschreibung von {@link caseWord} deckt das ab, siehe
 * `autoCap`); Englisch und Französisch großschreiben nur den ersten Buchstaben
 * einer Zeile, sonst nichts (Bauplan §6.5 Punkt 2).
 */
// es: wie en/fr - nur der erste Buchstabe einer Zeile wird grossgeschrieben
// (grammatische Tatsache, kein Platzhalter).
const SENTENCE_CAP: Record<Lang, boolean> = { de: false, en: true, fr: true, es: true, it: true, pl: true, tr: true, cs: true, bg: true, el: true, hu: true, nl: true, pt: true, br: true, ro: true, sv: true, uk: true /* G2-NEUN: grammatische Tatsache, kein Rückfall */ };

const UNIQUE_WORDS = [...new Set(WORDS)];
const UNIQUE_WORDS_EN = [...new Set(WORDS_EN)];
const UNIQUE_WORDS_FR = [...new Set(WORDS_FR)];
const UNIQUE_WORDS_ES = [...new Set(WORDS_ES)];
const UNIQUE_WORDS_IT = [...new Set(WORDS_IT)];
const UNIQUE_WORDS_PL = [...new Set(WORDS_PL)];
const UNIQUE_WORDS_TR = [...new Set(WORDS_TR)];
const UNIQUE_WORDS_CS = [...new Set(WORDS_CS)];

/**
 * Grund-Wortschatz nach Sprache.
 *
 * ★ E10c (26.09.2026, Bauplan §2.3 Punkt 2): Tabelle statt Ternäre - vorher
 * lieferte `wordBase("fr")` still `UNIQUE_WORDS` (Deutsch), weil nur „en"
 * ausgenommen war (Falle 1/32 im Leitfaden). Fehlt künftig eine Sprache, meldet
 * es `tsc`, nicht ein stiller Rückfall.
 */
// ★ ES-F6 (27.09.2026): UNIQUE_WORDS_ES (wordsEs.ts) - vorher LEER (ES-F2),
// `wordBase("es")` lieferte bis dahin nie den deutschen/englischen/
// französischen Wortschatz (Falle 12/19/32), jetzt den echten spanischen.
const WORD_BASE: Record<Lang, string[]> = {
  de: UNIQUE_WORDS,
  en: UNIQUE_WORDS_EN,
  fr: UNIQUE_WORDS_FR,
  es: UNIQUE_WORDS_ES,
  // ★ F6-it (02.10.2026): der echte italienische Wortschatz (`wordsIt.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  it: UNIQUE_WORDS_IT,
  // ★ F6-pl (03.10.2026): der echte polnische Wortschatz (`wordsPl.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  pl: UNIQUE_WORDS_PL,
  // ★ F6-tr (03.10.2026): der echte türkische Wortschatz (`wordsTr.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  tr: UNIQUE_WORDS_TR,
  // ★ F6-cs (03.10.2026): der echte tschechische Wortschatz (`wordsCs.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  cs: UNIQUE_WORDS_CS,
  // ★ G3c-VERTEILER (25.10.2026): jede liest ihre eigene Datei (`words<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  // ★ GEN-HAUPTSPRACHE (29.10.2026): alle neun Dateien sind gefüllt (1.094 bis 1.200 Wörter) - kein Rückfall mehr in Kraft.
  bg: eigenOderEn([...new Set(GERUEST_WORDS.bg)], UNIQUE_WORDS_EN),
  el: eigenOderEn([...new Set(GERUEST_WORDS.el)], UNIQUE_WORDS_EN),
  hu: eigenOderEn([...new Set(GERUEST_WORDS.hu)], UNIQUE_WORDS_EN),
  nl: eigenOderEn([...new Set(GERUEST_WORDS.nl)], UNIQUE_WORDS_EN),
  pt: eigenOderEn([...new Set(GERUEST_WORDS.pt)], UNIQUE_WORDS_EN),
  br: eigenOderEn([...new Set(GERUEST_WORDS.br)], UNIQUE_WORDS_EN),
  ro: eigenOderEn([...new Set(GERUEST_WORDS.ro)], UNIQUE_WORDS_EN),
  sv: eigenOderEn([...new Set(GERUEST_WORDS.sv)], UNIQUE_WORDS_EN),
  uk: eigenOderEn([...new Set(GERUEST_WORDS.uk)], UNIQUE_WORDS_EN),
};

function wordBase(lang: Lang): string[] {
  return WORD_BASE[lang];
}

/**
 * Alters-gestufter Bonus-Wortschatz nach Sprache. Die deutsche Liste ist mit
 * den alten Etiketten (a/b/c/erwachsen) geführt; eine neue Konto-Stufe
 * vereinigt die Listen ihrer Etiketten (S1, `contentStufenFor`).
 *
 * ★ E10c (26.09.2026): Tabelle statt Ternäre - vorher gab `stufeVocab("fr", …)`
 * still den DEUTSCHEN Stufen-Wortschatz (`STUFE_VOCAB`) zurück.
 */
// ★ ES-F6 (27.09.2026): STUFE_VOCAB_ES (wordsEs.ts) - vorher LEER (ES-F2).
const STUFE_VOCAB_TABLE: Record<Lang, Record<string, string[]>> = {
  de: STUFE_VOCAB,
  en: STUFE_VOCAB_EN,
  fr: STUFE_VOCAB_FR,
  es: STUFE_VOCAB_ES,
  // ★ F6-it (02.10.2026): der Themenwortschatz (`wordsIt.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  it: STUFE_VOCAB_IT,
  // ★ F6-pl (03.10.2026): der Themenwortschatz (`wordsPl.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  pl: STUFE_VOCAB_PL,
  // ★ F6-tr (03.10.2026): der Themenwortschatz (`wordsTr.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  tr: STUFE_VOCAB_TR,
  // ★ F6-cs (03.10.2026): der Themenwortschatz (`wordsCs.ts`) - vorher das Englische (RÜCKFALL-EN, G2a).
  cs: STUFE_VOCAB_CS,
  // ★ G3c-VERTEILER (25.10.2026): jede liest ihre eigene Datei (`words<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  // ★ GEN-HAUPTSPRACHE (29.10.2026): alle neun Dateien sind gefüllt (1.094 bis 1.200 Wörter) - kein Rückfall mehr in Kraft.
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

function stufeVocab(lang: Lang, stufe: Stufe): string[] {
  const tabelle = STUFE_VOCAB_TABLE[lang];
  const etiketten = contentStufenFor(stufe);
  if (etiketten.length === 1) return tabelle[etiketten[0]] ?? [];
  return [...new Set(etiketten.flatMap((e) => tabelle[e] ?? []))];
}

/**
 * ★★★★★ ES-P7a-Behebung (27.09.2026, M2, Prüfbericht Fundament es): vorher
 * prüfte diese Funktion JEDEN Buchstaben nur gegen `allowed` - ein Wort mit
 * á é í ó ú ü war darum NIE benutzbar, weil diese Zeichen selbst nie zu
 * `allowed` gehören (sie kommen über die Totaste `´`/`¨`, siehe `letters.ts`).
 * 114 von 663 spanischen Wörtern waren so für IMMER gesperrt, darunter „más",
 * „está", „qué", „también" - die häufigsten Wörter der Sprache überhaupt.
 * Jetzt wie `fitText`: ein Totasten-Buchstabe zählt als erlaubt, sobald seine
 * Totaste UND sein Grundbuchstabe gelernt sind (`totastenBuchstabeFrei`,
 * dieselbe Quelle - Falle 32). Nur für Wege mit Lehrgangs-Totasten (fr/es);
 * de/en bleiben Byte für Byte, weil `lang` dort nie „fr"/„es" ist.
 */
function filterWords(
  allowed: Set<string>,
  source: string[] = UNIQUE_WORDS,
  lang?: Lang,
): string[] {
  // ★ F5-F8 Türkisch (03.10.2026, F4-Befund §3): an der EIGENSCHAFT des Weges („führt die Folge eine Totaste?"), nicht an
  // `lang === "fr" || "es"` - für Türkisch (`^` ⇒ â î û) wäre jedes Wort mit Zirkumflex an jeder Sprosse still herausgefallen
  // (Falle 50). fr und es: dieselbe Antwort wie vorher; de, en, it, pl: `false` wie vorher.
  const totastenWeg = hatTotastenEinheit(lang);
  // Erst in die Schreibweise der eingestellten Tastatur bringen (Schweiz:
  // „Straße" → „Strasse"), dann prüfen, ob alle Tasten freigeschaltet sind.
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of source) {
    const w = toLayoutText(raw);
    if (w.length < 2 || seen.has(w)) continue;
    if (
      ![...w].every(
        (c) => allowed.has(c) || (totastenWeg && totastenBuchstabeFrei(c, allowed, lang)),
      )
    )
      continue;
    seen.add(w);
    out.push(w);
  }
  return out;
}

export interface GenerateOptions {
  /** Großschreibung erzwingen/erlauben (sonst aus dem Lehrplan abgeleitet). */
  shift?: boolean;
  /** Anzahl Zeilen. */
  count?: number;
  /** Tasten, die bevorzugt vorkommen sollen (z. B. zuletzt verpatzte). */
  focusKeys?: string[];
  /** Altersstufe — steuert Wortschatz und (in Text-Lektionen) die Inhalte. */
  stufe?: Stufe;
  /** Sprache der Inhalte (Deutsch/Englisch). */
  lang?: Lang;
  /**
   * Themenstränge (TN-E2, arcEngine.ts): Manifest-Indizes, die der Aufrufer
   * dieser Runde SELBST beisteuert (fällige Arc-Zeilen) — die Auswahl meidet
   * sie, damit dieselbe Zeile nicht doppelt in der Runde landet.
   */
  exclude?: Set<number>;
  /**
   * Tasten, die das Kind ANDERSWO schon gelernt hat (`progress.introduced`).
   * Die Runde darf sie zusätzlich zu den Lektions-Tasten benutzen — verlangt
   * wird weiterhin nur Gelerntes (siehe `unlockedKeysWith`). Ohne das Feld
   * gilt der reine Lektions-Tastenstand.
   */
  introduced?: string[];
  /**
   * ★ E1 (24.09.2026): der Lernweg des Kindes - Pflicht, weil `introduced`
   * nur in seiner Reihenfolge gelesen werden darf (Bauplan §2.3).
   */
  lernweg: Lernweg;
  /**
   * ★ E10d (26.09.2026, Bauplan §10.1/§1.2 F8): die französische
   * Landesvariante - nur bei `lang === "fr"` von Bedeutung, optional (Vorgabe
   * „fr-FR" = unverändert, dasselbe Tor wie bei `variante`/Englisch). Ohne
   * dieses Feld liefert der Korpus weiter die FR/BE/CH-Grundform (byte-gleich
   * zu vor E10d) - erst ein Aufrufer, der die echte Kind-/Klassen-Variante aus
   * `franzVariante.ts` hereinreicht, sieht die Landes-Typografie/-Wortwahl.
   */
  franzVariante?: FranzVariante;
  /**
   * ★ ES-F7 (27.09.2026, Bauplan §1.2 S2): die spanische Landesvariante - nur
   * bei `lang === "es"` von Bedeutung, optional (Vorgabe „es-ES"). Wie
   * `franzVariante`: ohne dieses Feld liefert der Korpus weiter die
   * `es-ES`-Grundform (byte-gleich).
   */
  esVariante?: EsVariante;
}

export function generateItems(
  lessonId: string,
  opts: GenerateOptions,
): string[] {
  return generateRound(lessonId, opts).map((l) => l.text);
}

/**
 * Wie {@link generateItems}, aber mit Herkunft (`RoundLine`) fürs No-Repeat-Ledger
 * (TW-E2). Der wichtige Umbau betrifft die **Buchstaben-Lektionen** (`home`/
 * `letters`/`shift`): statt reinem Wort-/Silben-Drill (`wordDrillLines`) weben sie
 * jetzt — sobald der Zeichensatz der Lektion sinnvolle Zeilen zulässt — passende
 * KORPUS-Bausteine ein (ungesehen zuerst, `opts.seen`), sodass der Wortsalat auch
 * im klassischen Lehrgang verschwindet. Wort-/Silben-Zeilen bleiben Notnagel, bis
 * genug passt (früh: Grundreihe hat nur `a`/`ö` als Vokale → hier dauert es länger,
 * genau wie im Bauplan beschrieben). Die **Text-Lektionen** (kind "text") laufen
 * seit 27.07. ebenfalls übers Ledger (`textLessonRound`: ungesehene Bausteine
 * zuerst, `source` = Manifest-Index). Nur `numbers`/`punctuation`/`symbols`
 * bleiben generiert (Herkunft `null`).
 */
export function generateRound(
  lessonId: string,
  opts: GenerateOptions & { seen?: Uint8Array },
): RoundLine[] {
  const lang: Lang = opts.lang ?? "de";
  // ★ D1 Nr. 18 (28.09.2026): wie in `adaptiveRound` - übt ein Kind auf einem
  // Weg mit Hauptsprache (fr/es) Englisch und kommt eine neue Taste der
  // Lektion in der englischen Runde nicht vor (´ ^ ¨ ù, der Apostroph der
  // Elision), übt diese Lektion in der Hauptsprache. Weg „de"/„en" und die
  // Hauptsprache selbst: unverändert.
  let zeilen = generateRoundRoh(lessonId, opts);
  const haupt = lernwegDef(opts.lernweg).hauptsprache;
  if (haupt && lang !== haupt) {
    const neu = (lessonById(lessonId)?.newKeys ?? []).filter((k) => k !== SHIFT_UNIT);
    const fehlt = neu.some(
      (u) =>
        !zeilen.some((l) =>
          nurFocusZeichen([u]).some((c) => l.text.includes(c) || l.text.includes(grossFuer(c, lang))),
        ),
    );
    if (fehlt) return generateRound(lessonId, { ...opts, lang: haupt });
  }
  // ★ S4 (26.09.2026): erzeugte Zeilen auf Weg „fr" französisch setzen (siehe
  // `setzeFranzoesisch`); „de"/„en" bekommen dieselben Objekte zurück.
  // ★ ES-F7 (27.09.2026): Weg „es" ebenso - nur die Zahlenformat-Umwandlung
  // (`wandleFormatoNumerico`, keine Satzzeichen-Umstellung wie bei „fr").
  if (lang !== "fr" && lang !== "es") return zeilen;
  const shift = opts.shift ?? shiftUnlockedWith(lessonId, opts.introduced);
  return zeilen.map((l) => fertigeZeile(l, lang, shift, opts.franzVariante, opts.esVariante));
}

function generateRoundRoh(
  lessonId: string,
  opts: GenerateOptions & { seen?: Uint8Array },
): RoundLine[] {
  const lesson = lessonById(lessonId);
  if (!lesson) return [];

  // Lektions-Tasten PLUS anderswo Gelerntes (unlockedKeysWith): Wer mit mehr
  // Tasten aus „Mein Training" kommt, bekommt echte Sätze aus dem vollen
  // eigenen Vorrat statt Silben-Drill; für Lehrgangs-Geher ändert sich nichts.
  const allowedArr = unlockedKeysWith(lessonId, opts.introduced, opts.lernweg);
  const allowed = new Set(allowedArr);
  const shift = opts.shift ?? shiftUnlockedWith(lessonId, opts.introduced);
  const count = opts.count ?? 14;
  const stufe: Stufe = opts.stufe ?? VORGABE_STUFE;
  const lang: Lang = opts.lang ?? "de";
  const focus = (
    opts.focusKeys && opts.focusKeys.length ? opts.focusKeys : lesson.newKeys
  ).filter((k) => allowed.has(k));

  // Ziffern-, Satzzeichen- und Symbol-Lektionen: echte Wörter im Mini-Kontext
  // oder reine Zahlenzeilen - das Etikett entscheidet die Bauart der Zeile.
  const plain = (xs: string[]): RoundLine[] =>
    xs.map((text) => ({ text, source: null, art: artFuerDrill(text) }));

  if (lesson.kind === "text")
    return textLessonRound(
      lesson.corpusKinds,
      allowed,
      allowedArr,
      shift,
      stufe,
      count,
      lang,
      opts.lernweg,
      opts.seen,
      opts.exclude,
      opts.franzVariante,
      opts.esVariante,
    );
  if (lesson.kind === "numbers") return plain(numberItems(allowedArr, focus, count));
  if (lesson.kind === "punctuation")
    return plain(punctItems(lesson.newKeys, allowed, shift, count, lang));
  if (lesson.kind === "symbols")
    return plain(symbolItems(lesson.newKeys, allowedArr, shift, count, lang, stufe, opts.lernweg));

  // home / letters / shift — Bausteine (ungesehen zuerst) einweben, Rest mit
  // Wort-/Silben-Drill (ehrliches Fingertraining) auffüllen.
  return letterLessonRound(
    allowedArr,
    allowed,
    shift,
    stufe,
    focus,
    count,
    lang,
    opts.lernweg,
    lesson.kind === "shift",
    opts.seen,
    opts.exclude,
    opts.franzVariante,
    opts.esVariante,
  );
}

/**
 * Runde für die Buchstaben-Lektionen (home/letters/shift): passende Korpus-
 * Bausteine (ungesehen vor gesehen, Fokus-Buchstaben bevorzugt) füllen die Runde;
 * ist der Vorrat kleiner als die Rundenlänge, füllt Wort-/Silben-Drill den Rest.
 */
function letterLessonRound(
  allowedArr: string[],
  allowed: Set<string>,
  shift: boolean,
  stufe: Stufe,
  focus: string[],
  count: number,
  lang: Lang,
  lernweg: Lernweg,
  shiftDrill: boolean,
  seen: Uint8Array | undefined,
  exclude: Set<number> | undefined,
  franzVariante?: FranzVariante,
  esVariante?: EsVariante,
): RoundLine[] {
  // TN-E2: vom Aufrufer beigesteuerte Arc-Zeilen meiden (kein Doppel in der Runde).
  // ★ D-2: `umschalt` - Erwachsene vor ⇧ bekommen nur Zeilen ohne Grossbuchstaben.
  const corpusPool = corpusEntriesFor({ stufe, allowed, lang, lernweg, franzVariante, esVariante, umschalt: shift }).filter(
    (e) => !exclude?.has(e.index),
  );
  const focusSet = new Set(focus);
  const hasFocus = (s: string): boolean =>
    focusSet.size > 0 && [...kleinFuer(s, lang)].some((c) => focusSet.has(c));
  const isSeen = (e: CorpusEntry): boolean => (seen ? seenHas(seen, e.index) : false);
  const rank = (list: CorpusEntry[]): CorpusEntry[] =>
    focusSet.size > 0
      ? [
          ...shuffle(list.filter((e) => hasFocus(e.text))),
          ...shuffle(list.filter((e) => !hasFocus(e.text))),
        ]
      : shuffle(list);
  const order = [
    ...rank(corpusPool.filter((e) => !isSeen(e))),
    ...rank(corpusPool.filter(isSeen)),
  ];
  let ci = 0;
  const items: RoundLine[] = [];
  for (let n = 0; n < count; n++) {
    const e = ci < order.length ? order[ci++] : null;
    if (e) {
      items.push({ text: e.text, source: e.index, art: "text" });
    } else {
      const z = wordDrillZeilen(allowedArr, shift, stufe, focus, 1, shiftDrill, lang)[0];
      items.push({ text: z.text, source: null, art: artFuerDrill(z.text, z.unsinn, lang) });
    }
  }
  return shuffle(items);
}

/**
 * Wort-/Pseudowort-Übungszeilen aus einem erlaubten Buchstabensatz. Genutzt von
 * den Buchstaben-Lektionen UND von der adaptiven Lernumgebung. `focus` betont
 * bestimmte Buchstaben (neue Taste bzw. schwächste Buchstaben). `shiftDrill`
 * stellt für das Üben der Umschalttaste vermehrt Nomen zusammen — die werden
 * korrekt großgeschrieben und liefern so viel (richtige) Großschreib-Praxis.
 */
export interface DrillZeile {
  text: string;
  /** Besteht die Zeile aus Pseudowörtern? (Nie gemischt - ganz oder gar nicht.) */
  unsinn: boolean;
}

export function wordDrillZeilen(
  allowedArr: string[],
  shift: boolean,
  stufe: Stufe,
  focus: string[],
  count: number,
  shiftDrill = false,
  lang: Lang = "de",
  /**
   * Sind Großbuchstaben tippbar (Auto-Großschreibung bis zur Umschalttaste,
   * danach echt mit Umschalt)? In dieser App immer ja — daher werden deutsche
   * Nomen IMMER korrekt großgeschrieben, auch bevor die Umschalttaste „echt"
   * gelernt ist (das Kind tippt den kleinen Buchstaben, der große erscheint).
   * Pseudowörter bleiben klein.
   */
  autoCap = true,
  /**
   * Anteil reiner Pseudowort-Zeilen erzwingen (0..1). Ohne Angabe entscheidet
   * der Vorrat an passenden echten Wörtern (siehe {@link REAL_WORD_FLOOR}).
   * Die gezielte Tasten-Übung setzt hier 1 — dort SOLLEN es Pseudowörter sein,
   * weil nur sie die schwache Taste beliebig dicht unterbringen können.
   */
  pseudoAnteil?: number,
  /**
   * ★★★ F8-it (02.10.2026): Einheiten, die in ECHTEN Wörtern vorkommen, aber nie in Pseudowörtern stehen dürfen - der
   * Apostroph der Elision (`l'amico`, `un'ora`). Er ist keine Buchstaben-Einheit (`letterFocus`) und darf nicht in die Silben-
   * Werkstatt (`k'a`), soll aber in „Mein Training" geübt werden, solange es noch keinen Korpus mit Elision gibt. Wörter, die ihn
   * tragen, kommen darum zusätzlich in den Fokus-Pool der echten Wörter. Ohne passende Wörter (jede Sprache ausser it) bleibt
   * alles, wie es war - byte-gleich, auch im Zufall (Golden-Tests).
   */
  wortFokus: readonly string[] = [],
): DrillZeile[] {
  const allowed = new Set(allowedArr);
  // ★ F6-pl: Polnisch hat eigene Vokale (`VOWELS_PL`); alle anderen Sprachen die globale Liste - Byte für Byte wie vorher.
  const isVowel = (c: string): boolean => istVokalIn(c, lang);
  // Großbuchstaben sind tippbar, sobald die Umschalttaste gelernt ist ODER die
  // Auto-Großschreibung aktiv ist → deutsche Nomen dürfen korrekt groß stehen.
  // ★ D-2 (28.09.2026): Erwachsene vor ⇧ bekommen KEINE Auto-Grossschreibung -
  // echte Wörter stehen klein, auch Nomen (wie TIPP10 L1-5, `nurKleinschrift`).
  const caps = shift || (autoCap && !nurKleinschrift(stufe, shift));
  const stufeWords = stufeVocab(lang, stufe);
  const realWords = filterWords(allowed, [...wordBase(lang), ...stufeWords], lang);
  let focusWords = focus.length
    ? realWords.filter((w) => focus.some((k) => w.includes(k)))
    : realWords;
  if (wortFokus.length) {
    const mit = realWords.filter((w) => wortFokus.some((k) => w.includes(k)));
    // Ohne Buchstaben-Fokus ist `focusWords` der ganze Vorrat - dann sind es NUR die Wörter mit der Einheit, sonst die Vereinigung.
    if (mit.length) focusWords = focus.length ? [...new Set([...focusWords, ...mit])] : mit;
  }
  // Für den Umschalt-Drill bevorzugt Nomen (werden korrekt großgeschrieben).
  const nounWords = realWords.filter(isNoun);
  // ★ F5-F8 Tschechisch (03.10.2026): `y` ist im Tschechischen ein VOKAL (`byl`, `hlavy`, `kyvadlo`) - nur dort; für jede andere Sprache ist
  // `istVokal` dieselbe Funktion wie `isVowel` (byte-gleich, auch im Zufall). Und der Háček `ˇ` ist KEIN Buchstabe eines Wortes
  // (`istWortBuchstabe`), obwohl Unicode ihn als `Lm` führt.
  const istVokal = (c: string): boolean => isVowel(c) || (lang === "cs" && c === "y");
  const vowelsArr = allowedArr.filter(istVokal);
  const consArr = allowedArr.filter((c) => istWortBuchstabe(c) && !istVokal(c));
  const lettersArr = allowedArr.filter((c) => istWortBuchstabe(c));

  const syllable = (): string => {
    const len = 2 + Math.floor(Math.random() * 3); // 2–4
    let s = "";
    let wantVowel = Math.random() < 0.5 && vowelsArr.length > 0;
    for (let i = 0; i < len; i++) {
      const useFocus = focus.length > 0 && Math.random() < 0.45;
      if (useFocus) {
        s += pick(focus);
      } else if (wantVowel && vowelsArr.length) {
        s += pick(vowelsArr);
      } else if (consArr.length) {
        s += pick(consArr);
      } else {
        s += pick(lettersArr.length ? lettersArr : allowedArr);
      }
      if (vowelsArr.length && consArr.length) wantVowel = !wantVowel;
    }
    // Mindestens eine Fokus-Taste pro Silbe — aber NIE auf Kosten des Vokals.
    // Vorher wurde eine ZUFÄLLIGE Stelle ersetzt; aus „zog" wurde so „zmg",
    // und ein Kind bekam Fingersalat statt eines sprechbaren Wortes (aufgefallen
    // im Probelauf an Janos Stand, 28.08.2026). Jetzt weicht ein Konsonant einem
    // Konsonanten und ein Vokal einem Vokal; passt nichts, wird angehängt.
    if (focus.length && ![...s].some((c) => focus.includes(c))) {
      const neu = pick(focus);
      const suchtVokal = istVokal(neu);
      const stellen = [...s]
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => istVokal(c) === suchtVokal);
      if (stellen.length) {
        const { i } = pick(stellen);
        s = s.slice(0, i) + neu + s.slice(i + 1);
      } else {
        s += neu;
      }
    }
    return s;
  };

  /**
   * Ist das Pseudowort für ein Kind überhaupt sprechbar? Verlangt mindestens
   * einen Vokal und duldet höchstens zwei Konsonanten am Stück. „affml" und
   * „zmg" fallen damit durch — sie sind kein Übungswort, sondern eine Zumutung.
   */
  const aussprechbar = (w: string): boolean => {
    if (!w || ![...w].some(istVokal)) return false;
    let kette = 0;
    for (const c of w) {
      kette = istVokal(c) ? 0 : kette + 1;
      if (kette >= 3) return false;
    }
    return true;
  };

  /**
   * Typische französische Wortenden (Bauplan §2.3 Punkt 2: „typische Endungen
   * -e, -er, -on, -ez nur wo tippbar") - werden an eine generische Silbe
   * angehängt, wenn ihre Buchstaben schon freigeschaltet sind. Rein kosmetisch:
   * ohne passende Endung bleibt die Silbe wie sie ist.
   */
  const FR_ENDINGS = ["e", "er", "on", "ez"];
  /**
   * Deutsche Buchstabenfolgen, die in einem französischen Pseudowort nichts zu
   * suchen haben (Bauplan §2.3 Punkt 2: „keine deutschen Cluster wie sch, tz,
   * ck"). Die generische Silben-Werkstatt baut Buchstabe für Buchstabe auf und
   * bildet solche Cluster praktisch nie von selbst - der Filter ist trotzdem
   * ein Sicherheitsnetz, kein Vertrauensbeweis.
   */
  const FR_VERBOTENE_CLUSTER = ["sch", "tz", "ck"];
  const franzoesischeSilbe = (): string => {
    let s = syllable();
    if (FR_VERBOTENE_CLUSTER.some((c) => s.includes(c))) s = syllable();
    const ending = pick(FR_ENDINGS);
    const passtEnding =
      [...ending].every((c) => allowedArr.includes(c)) &&
      Math.random() < 0.4 &&
      s.length + ending.length <= 6;
    return passtEnding ? s + ending : s;
  };

  /**
   * ★ ES-F6 (27.09.2026, Bauplan §5, „Silben" - dasselbe Muster wie
   * `franzoesischeSilbe`): typische spanische Wortenden (-o -a -as -os -ar),
   * an die generische Silbe angehängt, wenn ihre Buchstaben schon
   * freigeschaltet sind. Rein kosmetisch: ohne passende Endung bleibt die
   * Silbe wie sie ist.
   */
  const ES_ENDINGS = ["o", "a", "as", "os", "ar"];
  /**
   * Buchstabenfolgen, die in einem spanischen Pseudowort nichts zu suchen
   * haben (dieselbe Vorsicht wie bei Französisch §2.3 Punkt 2 - keine
   * deutschen/englischen Cluster wie sch, tz, ck, sh, th, ph). Die generische
   * Silben-Werkstatt bildet solche Cluster praktisch nie von selbst - der
   * Filter ist trotzdem ein Sicherheitsnetz, kein Vertrauensbeweis.
   */
  const ES_VERBOTENE_CLUSTER = ["sch", "tz", "ck", "sh", "th", "ph"];
  /**
   * ★★★★★ ES-P7a-Behebung (27.09.2026, S1, Bauplan §4.3: „ñaña gibt es
   * nicht: nur echte Silben"): ñ steht im echten Spanisch NIE am Wortanfang
   * und NIE doppelt - beides baute die generische Silben-Werkstatt aber
   * gelegentlich (Fokus-Einfügung kennt die Nachbarn nicht). Gemessen (e11):
   * an Sprosse 8 enthielten 58 von 200 Fokus-Zeilen „ññ", 183 Pseudowörter
   * begannen mit ñ. Ohne echten Vokal danach (z. B. am Silbenende) fällt ñ
   * ebenfalls weg - lieber eine Silbe ohne ñ in DIESER Runde als eine
   * unsprechbare.
   */
  const korrigiereEnye = (s: string): string => {
    if (!s.includes("ñ")) return s;
    // ★ Mehr als zwei ñ hintereinander ("ñññ"): erst alle PAARE zusammenziehen
    // reicht bei einer ungeraden Kette nicht (ñññ → ññ, ein Rest bleibt) -
    // deshalb wiederholen, bis kein Paar mehr übrig ist.
    let ohneDoppel = s;
    while (ohneDoppel.includes("ññ")) ohneDoppel = ohneDoppel.replace(/ññ/g, "ñ");
    return [...ohneDoppel]
      .filter((c, i, arr) => {
        if (c !== "ñ") return true;
        // ⚠️ "".includes("") ist WAHR - `isVowel(arr[i + 1] ?? "")` hielte ein
        // ñ am STRING-ENDE fälschlich für "vor einem Vokal". Nur ein
        // WIRKLICH vorhandener, folgender Vokal zählt.
        const naechstes = arr[i + 1];
        return i > 0 && naechstes !== undefined && istVokal(naechstes);
      })
      .join("");
  };
  const spanischeSilbe = (): string => {
    let s = korrigiereEnye(syllable());
    if (ES_VERBOTENE_CLUSTER.some((c) => s.includes(c))) s = korrigiereEnye(syllable());
    if (!s) s = pick(vowelsArr.length ? vowelsArr : allowedArr); // Rand-Fall: alles herausgefiltert
    const ending = pick(ES_ENDINGS);
    const passtEnding =
      [...ending].every((c) => allowedArr.includes(c)) &&
      Math.random() < 0.4 &&
      s.length + ending.length <= 6;
    return passtEnding ? s + ending : s;
  };

  /**
   * ★★★ F6-it (02.10.2026): italienische Pseudowörter - die generische Silbe (abwechselnd Vokal und Konsonant) mit den
   * Eigenheiten des Italienischen: ein Wort ENDET fast immer auf einen Vokal (nie `kar`, `mit` - wer Italienisch hört,
   * hört darin ein Fremdwort), und es trägt keine Cluster aus anderen Sprachen (`sch`, `tz`, `ck`, `sh`, `th`, `ph`,
   * `kh`, `w`). Typische Endungen (-o -a -e -i, -are -ere -ino -ina -one -etto) werden angehängt, wenn ihre Buchstaben
   * schon freigeschaltet sind. Rein kosmetisch: ohne passende Endung bleibt die Silbe, wie sie ist (dann vokalisch geschlossen).
   * Die Sperrliste (`sperrlisteIt.ts`) prüft `pseudo()` unten - eine Silbenfolge wie `mona` ist ein Wort, kein Unsinn.
   */
  const IT_ENDINGS = ["o", "a", "e", "i", "are", "ere", "ino", "ina", "one", "etto"];
  const IT_VERBOTENE_CLUSTER = ["sch", "tz", "ck", "sh", "th", "ph", "kh", "ww", "yy"];
  /**
   * Im Italienischen steht ein Akzentbuchstabe NUR am Wortende (città, perché, così, più, andò, però) - ein `ò` mitten im
   * Wort („dòda") kennt keine Silbe der Sprache. Die generische Silbe setzt die freigeschalteten Vokale aber überall
   * ein; auf der Grundreihe `f j d k s l a ò` ist `ò` sogar der einzige zweite Vokal. Darum: jeder Akzentbuchstabe
   * ausser dem letzten wird zu seinem Grundbuchstaben (oder zu `a`, wenn dieser noch nicht frei ist: `o` kommt erst als
   * Nr. 11), und der letzte rückt ans Wortende. Enthielt die Silbe keinen Akzentbuchstaben, bleibt sie unverändert -
   * die Fokus-Taste (`ò`, `à` …) bleibt in der Zeile, nur an der richtigen Stelle.
   */
  const AKZENT_GRUND: Readonly<Record<string, string>> = { à: "a", è: "e", é: "e", ì: "i", ò: "o", ù: "u" };
  const akzentAmEnde = (wort: string): string => {
    const zeichen = [...wort];
    const letzter = [...zeichen].reverse().find((c) => c in AKZENT_GRUND);
    if (letzter === undefined) return wort;
    const kern = zeichen.map((c) => (c in AKZENT_GRUND ? (allowedArr.includes(AKZENT_GRUND[c]) ? AKZENT_GRUND[c] : "a") : c));
    if (istVokal(kern[kern.length - 1])) kern[kern.length - 1] = letzter;
    else kern.push(letzter);
    return kern.join("");
  };
  const italienischeSilbe = (): string => {
    let s = akzentAmEnde(syllable());
    if (IT_VERBOTENE_CLUSTER.some((c) => s.includes(c))) s = akzentAmEnde(syllable());
    // Endet die Silbe schon auf einen Akzentbuchstaben, ist sie fertig (nach dem Akzent steht nichts mehr).
    if (s && s[s.length - 1] in AKZENT_GRUND) return s;
    const ending = pick(IT_ENDINGS);
    const passtEnding =
      [...ending].every((c) => allowedArr.includes(c)) && Math.random() < 0.4 && s.length + ending.length <= 7;
    if (passtEnding) return s + ending;
    // Endet die Silbe auf einen Konsonanten, einen Vokal anhängen (wenn einer frei ist).
    if (s && !istVokal(s[s.length - 1]) && vowelsArr.length > 0 && s.length < 6) {
      const endVokale = vowelsArr.filter((v) => "aoei".includes(v));
      return s + pick(endVokale.length ? endVokale : vowelsArr);
    }
    return s;
  };

  /**
   * ★★★ F6-tr (03.10.2026): türkische Pseudowörter - Silben nach der VOKALHARMONIE und mit türkischer Lautfolge. Ein Wort trägt
   * entweder nur hintere Vokale (`a ı o u`) oder nur vordere (`e i ö ü`); nach dem ersten Vokal folgen nur `a ı` bzw. `e i`
   * (`o ö` stehen nur in der ersten Silbe, `u ü` nur nach einem gerundeten Vokal) - `kasal`, `elik`, `ürüt`, nie `kaşel`. Jede
   * Silbe beginnt (ausser vielleicht die erste) mit einem Konsonanten, eine Silbe endet auf höchstens einen Konsonanten, ein Wort hat
   * keine Konsonanten-Verdopplung durch Zufall (`kk` steht nur in echten Wörtern). `ğ` steht nie am Wortanfang und nie nach einem
   * Konsonanten; `w x q` (Fremdbuchstaben) kommen nur vor, wenn sie die Fokus-Einheit sind. Typische Endungen (`-lar -ler`, `-da -de`,
   * `-mak -mek`) werden angehängt, wenn ihre Buchstaben frei sind. Auch `j` bleibt (auf der Grundreihe `f j d k s l a ş` gibt es
   * kaum andere Konsonanten). Die Sperrliste (`sperrlisteTr.ts`, gefaltet) prüft `pseudo()` unten: `bok`, `göt`, `sik` sind ein Wort,
   * kein Unsinn.
   */
  const TR_HINTEN = "aıou";
  const TR_VORNE = "eiöü";
  const TR_GERUNDET = "ouöü";
  const trKons = (zulass: string[]): string[] => zulass.filter((c) => istBuchstabe(c) && !isVowel(c) && !("wxq".includes(c) && !focus.includes(c)));
  const tuerkischesWort = (): string => {
    const vokale = vowelsArr.filter((v) => TR_HINTEN.includes(v) || TR_VORNE.includes(v));
    const kons = trKons(allowedArr);
    if (vokale.length === 0 || kons.length === 0) return syllable();
    const fokusVokale = focus.filter((c) => vokale.includes(c));
    const fokusKons = focus.filter((c) => kons.includes(c));
    // Der erste Vokal bestimmt die Klasse; ein Fokus-Vokal bekommt die erste Stelle (er legt die Harmonie fest).
    const v1 = fokusVokale.length && Math.random() < 0.7 ? pick(fokusVokale) : pick(vokale);
    const hinten = TR_HINTEN.includes(v1);
    const klasse = vokale.filter((v) => (hinten ? TR_HINTEN : TR_VORNE).includes(v));
    const naechster = (vor: string): string => {
      const pool = klasse.filter((v) => {
        if (v === "o" || v === "ö") return false; // nur in der ersten Silbe
        if (v === "u" || v === "ü") return TR_GERUNDET.includes(vor); // gerundet nur nach gerundet
        return true;
      });
      const kandidaten = pool.length ? pool : klasse;
      const fok = kandidaten.filter((v) => focus.includes(v));
      return fok.length && Math.random() < 0.5 ? pick(fok) : pick(kandidaten);
    };
    const silben = 1 + Math.floor(Math.random() * 3); // 1-3 Silben
    const vs: string[] = [v1];
    for (let i = 1; i < silben; i++) vs.push(naechster(vs[i - 1]));
    // Konsonanten: Anlaut (Silben ab der zweiten immer, die erste mit 80 %), Auslaut (35 %).
    const ohneG = (l: string[]): string[] => l.filter((c) => c !== "ğ");
    const teile: string[][] = vs.map(() => ["", ""]);
    for (let i = 0; i < silben; i++) {
      if (i > 0 || Math.random() < 0.8) teile[i][0] = pick(ohneG(kons).length ? ohneG(kons) : kons);
      if (Math.random() < 0.35) teile[i][1] = pick(kons);
    }
    // Der Fokus-Konsonant steht an einer Stelle, wo er hingehört: `ğ` nur im Auslaut oder zwischen zwei Vokalen.
    if (fokusKons.length && Math.random() < 0.85) {
      const k = pick(fokusKons);
      const i = Math.floor(Math.random() * silben);
      if (k === "ğ") {
        if (i > 0 && teile[i - 1][1] === "") teile[i][0] = k;
        else teile[i][1] = k;
      } else if (Math.random() < 0.6 && (i > 0 || teile[0][0] !== "")) teile[i][0] = k;
      else teile[i][1] = k;
    }
    let w = "";
    for (let i = 0; i < silben; i++) {
      let anlaut = teile[i][0];
      // `ğ` nie am Wortanfang und nie nach einem Konsonanten; keine zufällige Verdopplung.
      if (anlaut === "ğ" && (i === 0 || teile[i - 1][1] !== "")) anlaut = "";
      if (anlaut !== "" && i > 0 && anlaut === teile[i - 1][1]) anlaut = "";
      if (i > 0 && anlaut === "" && teile[i - 1][1] === "") anlaut = pick(ohneG(kons).length ? ohneG(kons) : kons);
      w += anlaut + vs[i] + teile[i][1];
    }
    // Eine Endung, wenn ihre Buchstaben frei sind (nach der Harmonie des letzten Vokals).
    const letzter = vs[vs.length - 1];
    const endungen = TR_HINTEN.includes(letzter) ? ["lar", "da", "mak", "ı", "a"] : ["ler", "de", "mek", "i", "e"];
    const ending = pick(endungen);
    if ([...ending].every((c) => allowedArr.includes(c)) && Math.random() < 0.3 && w.length + ending.length <= 8) {
      // Endet das Wort auf einen Vokal, fällt der Vokal der Endung weg (`ı`/`a` hinter einem Vokal ist kein Türkisch).
      if (ending.length === 1 && isVowel(w[w.length - 1])) return w;
      w += ending;
    }
    return w;
  };

  /**
   * ★★★ F6-pl (03.10.2026): polnische Pseudowörter - die generische Silbe (abwechselnd Vokal und Konsonant, `y` zählt als Vokal,
   * siehe `VOWELS_PL`) mit den Eigenheiten der polnischen Schreibung, soweit sie sich ohne Wörterbuch sicher sagen lassen:
   *  · `ś ć ź ń` stehen nie vor einem Vokal - dort schreibt das Polnische `si ci zi ni` (siano, cicho, zima, nic): ein Vokal hinter
   *    ihnen wird zu einem Konsonanten (nie `śa`, `ćo`);
   *  · `ą ę ń ó y` stehen nicht am Wortanfang (kein polnisches Wort beginnt so, ausser `ósmy`): ein Konsonant davor;
   *  · `q v x` stehen nur in Fremdwörtern: ausser als geübte Einheit (Fokus) kommen sie in keinem Pseudowort vor;
   *  · keine doppelten Buchstaben und keine fremden Cluster (`sch tz ck sh th ph kh`), mindestens ein Vokal; die Sperrliste (`sperrlistePl.ts`) prüft
   *    `pseudo()` unten - eine Silbenfolge wie `dupa` ist ein Wort, kein Unsinn;
   *  · typische Endungen (-a -y -e -o -ka -ek -em -ie -ów) werden angehängt, wenn ihre Buchstaben schon freigeschaltet sind.
   * Ein Wort darf auf einen Konsonanten enden (anders als im Italienischen): `kot`, `dom`, `ser`. Rein kosmetisch - ohne
   * passende Endung bleibt die Silbe, wie sie ist.
   */
  const PL_ENDINGS = ["a", "y", "e", "o", "ka", "ek", "em", "ie", "ów"];
  const PL_VERBOTENE_CLUSTER = ["sch", "tz", "ck", "sh", "th", "ph", "kh"];
  const PL_WEICH = "śćźń";
  const PL_NIE_AM_ANFANG = "ąęńóy";
  // `q v x` kommen nur in Fremdwörtern vor: in einem Pseudowort stehen sie nur, wenn sie GEÜBT werden (Fokus).
  const PL_FREMD = "qvx";
  /** Steht kein `ś ć ź ń` vor einem Vokal? (Regel der polnischen Schreibung, siehe oben.) */
  const plWeichOk = (w: string): boolean => ![...w].some((c, i, a) => PL_WEICH.includes(c) && a[i + 1] !== undefined && isVowel(a[i + 1]));
  const polnischeSilbe = (): string => {
    const kons = consArr.filter((c) => !"ąęóśćźń".includes(c) && !PL_FREMD.includes(c));
    const z = [...syllable()];
    // 1 · `q v x` nur als geübte Einheit
    for (let i = 0; i < z.length; i++) {
      if (PL_FREMD.includes(z[i]) && !focus.includes(z[i]) && kons.length) z[i] = pick(kons);
    }
    // 2 · keine doppelten Buchstaben: die Fokus-Einfügung der generischen Silbe zieht gern denselben Buchstaben zweimal (`śś`, `ńńń`);
    //     das Doppelte weicht einem Buchstaben der anderen Klasse (hinter einem Vokal ein Konsonant, hinter einem Konsonanten ein Vokal)
    for (let i = 1; i < z.length; i++) {
      if (z[i] !== z[i - 1]) continue;
      const pool = (isVowel(z[i - 1]) ? kons : vowelsArr).filter((c) => c !== z[i]);
      if (pool.length) z[i] = pick(pool);
    }
    // 3 · `ś ć ź ń` + Vokal gibt es nicht: der Vokal wird ein Konsonant; ohne Vokal ist es kein Wort: einer kommt VOR den letzten
    //     weichen Buchstaben oder ans Ende (zweimal, weil das Einfügen die Regel wieder verletzen kann)
    for (let runde = 0; runde < 3; runde++) {
      for (let i = 0; i < z.length - 1; i++) {
        const frei = kons.filter((c) => c !== z[i]);
        if (PL_WEICH.includes(z[i]) && isVowel(z[i + 1]) && frei.length) z[i + 1] = pick(frei);
      }
      if (!vowelsArr.length || z.some(isVowel)) break;
      const v = pick(vowelsArr);
      if (PL_WEICH.includes(z[z.length - 1])) z.splice(z.length - 1, 0, v);
      else z.push(v);
    }
    // 4 · `ą ę ń ó y` am Wortanfang: ein Konsonant davor.
    if (z.length && PL_NIE_AM_ANFANG.includes(z[0]) && kons.length) z.unshift(pick(kons));
    let s = z.join("");
    const letzter = s.slice(-1);
    const ending = pick(PL_ENDINGS);
    const passtEnding =
      [...ending].every((c) => allowedArr.includes(c)) &&
      !(PL_WEICH.includes(letzter) && isVowel(ending[0])) &&
      Math.random() < 0.4 &&
      s.length + ending.length <= 7;
    if (passtEnding) s += ending;
    return s;
  };

  /**
   * ★★★ F6-cs (03.10.2026): tschechische Pseudowörter - die generische Silbe (abwechselnd Vokal und Konsonant) mit den Regeln, die
   * jedes Kind in der Schule hört und die ein Wort „tschechisch aussehen" lassen. Rein kosmetisch (ein Pseudowort wird nie bewertet),
   * aber wer Tschechisch hört, hört in „kěma" oder „šyba" ein Fehlwort:
   *  · `ě` steht nur hinter b p v d t n m (bě pě vě dě tě ně mě) und nie am Wortanfang - sonst bekommt es einen dieser Mitlaute davor; `ů`,
   *    `ý` und `y` stehen nie am Wortanfang (dort ein Konsonant davor, wenn einer frei ist, sonst `a`).
   *  · Hinter c č š ž ř j steht nie `y`/`ý` (ci, ši, ži …): der weiche Mitlaut wird durch einen neutralen ersetzt, nicht das `y` (die
   *    Fokus-Taste bleibt in der Zeile); ist keiner frei, wird es `i`/`í` (Nr. 11 kommt vor `y` Nr. 26, `í` 18 vor `ý` 32 - immer frei).
   *  · keine Cluster fremder Sprachen (`sch`, `tz`, `ck`, `sh`, `th`, `ph`, `kh`, `ww`, `xx`, `qq`); die Sperrliste (`sperrlisteCs.ts`)
   *    prüft `pseudo()` unten.
   *  · typische Endungen (-a -o -e -i -y -u -ek -ka -ou -ost) werden angehängt, wenn ihre Buchstaben schon frei sind.
   * Die Buchstaben der Zahlenreihe (`ě š č ř ž ý á í é`) stehen als ganze Zeichen im Wort (jede ist EINE Einheit).
   */
  const CS_ENDUNGEN = ["a", "o", "e", "i", "y", "u", "ek", "ka", "ou", "ost"];
  const CS_VERBOTENE_CLUSTER = ["sch", "tz", "ck", "sh", "th", "ph", "kh", "ww", "xx", "qq"];
  const CS_WEICH = "cčšžřj";
  const CS_VOR_E_CARON = "bpvdtnm";
  /**
   * Zwei Vokale hintereinander gibt es im Tschechischen nur als `ou au eu` und in Fremdwörtern als `ia ie io iu ua uo ui ai ei oi` (historie,
   * rádio, duo) - nie `yy`, `ee`, `ůa`, `ýu` (die generische Silbe mit einer Fokus-Taste, die ein Vokal ist, baut sonst „yyy"). Nur für „cs".
   */
  const CS_VOKALPAARE = new Set(["ou", "au", "eu", "ia", "ie", "io", "iu", "ua", "uo", "ui", "ai", "ei", "oi"]);
  // Die Fokus-Taste geht dabei NIE verloren: `ě` bekommt notfalls einen passenden Mitlaut davor (statt zu `e` zu werden), `y`/`ý` ersetzt den
  // weichen Mitlaut davor (statt selbst zu `i` zu werden) - sonst bliebe von der Übungszeile für `ě` und `y` nur „eee" und „iii" übrig.
  const korrigiereCs = (wort: string): string => {
    const z = [...wort];
    const aus: string[] = [];
    const vorE = [...CS_VOR_E_CARON].filter((k) => allowedArr.includes(k));
    const neutral = [..."bfklmpsvz"].filter((k) => allowedArr.includes(k) && !isVowel(k));
    const mitlaut = (): string => {
      const f = consArr.filter((k) => !CS_WEICH.includes(k));
      return pick(f.length ? f : consArr);
    };
    for (let i = 0; i < z.length; i++) {
      let c = z[i];
      const davor = aus[aus.length - 1];
      if (c === "ě" && (davor === undefined || !CS_VOR_E_CARON.includes(davor))) {
        if (vorE.length) aus.push(pick(vorE));
        else c = "e";
      }
      if ((c === "y" || c === "ý") && davor !== undefined && CS_WEICH.includes(davor)) {
        if (neutral.length) aus[aus.length - 1] = pick(neutral);
        else c = c === "y" ? "i" : "í";
      }
      if ((c === "ů" || c === "ý" || c === "y") && aus.length === 0) {
        const kons = consArr.filter((k) => !CS_WEICH.includes(k) && k !== "y");
        aus.push(kons.length ? pick(kons) : "a");
      }
      // Reparatur statt Verwerfen (die Fokus-Taste bleibt in der Zeile): derselbe Buchstabe zweimal ⇒ ein Mitlaut wird weggelassen, bei einem
      // Vokal kommt ein Mitlaut dazwischen; zwei Vokale, die kein Paar der Sprache sind (siehe CS_VOKALPAARE), bekommen ebenfalls einen Mitlaut.
      const letzter = aus[aus.length - 1];
      if (letzter !== undefined && letzter === c && !istVokal(c)) continue;
      if (
        letzter !== undefined && istVokal(letzter) && istVokal(c) && consArr.length &&
        (letzter === c || !CS_VOKALPAARE.has(letzter + c))
      ) {
        aus.push(mitlaut());
      }
      aus.push(c);
    }
    return aus.join("");
  };
  const csVokalfolgeOk = (w: string): boolean => {
    const z = [...w];
    for (let i = 1; i < z.length; i++) {
      // Derselbe Buchstabe zweimal nacheinander kommt in einer Silbe nicht vor („řř", „kk" - nur in Zusammensetzungen).
      if (z[i] === z[i - 1]) return false;
      if (!istVokal(z[i]) || !istVokal(z[i - 1])) continue;
      if (!CS_VOKALPAARE.has(z[i - 1] + z[i])) return false;
      if (i >= 2 && istVokal(z[i - 2])) return false; // keine drei Vokale
    }
    return true;
  };
  const tschechischeSilbe = (): string => {
    let s = korrigiereCs(syllable());
    if (CS_VERBOTENE_CLUSTER.some((c) => s.includes(c))) s = korrigiereCs(syllable());
    const ending = pick(CS_ENDUNGEN);
    const passtEnding =
      [...ending].every((c) => allowedArr.includes(c)) && Math.random() < 0.4 && s.length + ending.length <= 7;
    const wort = passtEnding ? korrigiereCs(s + ending) : s;
    // Jedes Pseudowort hat einen Vokal (`aussprechbar` verlangt es, die Notlösung nach acht Versuchen aber nicht).
    // Der angehängte Vokal ist ein einfacher (a e i o u): `ě`, `ů`, `ý`, `y` hätten Regeln der Stelle zu beachten (siehe `korrigiereCs`).
    if (!vowelsArr.length || [...wort].some(istVokal)) return wort;
    const einfach = vowelsArr.filter((v) => "aeiou".includes(v));
    return wort + pick(einfach.length ? einfach : vowelsArr);
  };

  // aussprechbares Pseudowort, je Sprache:
  //  • Deutsch: erst Markov (deutschnah), sonst einfache Silbe.
  //  • Englisch: kein deutsches Markov — dort nur Silben (reiner Finger-Drill).
  //  • Italienisch (seit F6-it): eigene Silbenform, endet auf einen Vokal, ohne Sperrwort.
  //  • Türkisch (seit F6-tr): Vokalharmonie, türkische Lautfolge, ohne Sperrwort (auch gefaltet).
  //  • Polnisch (seit F6-pl): eigene Silbenform (ś ć ź ń nie vor einem Vokal, kein ą ę ń ó am Anfang), ohne Sperrwort.
  //  • Französisch/Spanisch: KEIN deutsches Markov (das Modell ist
  //    untrennbar deutsch, `markov.ts` lernt aus deutschem Text) — eigene
  //    Silbenform mit typischen Endungen und einem Filter gegen fremde Cluster.
  // Es wird mehrfach versucht, bis das Wort sprechbar ist UND die geübte Taste
  // enthält; erst danach wird genommen, was da ist (kein Endlos-Versuchen).
  const pseudoRoh = (): string => {
    if (lang === "de") {
      const mk = markovWord(allowed, { focus, min: 3, max: 6 });
      return mk || syllable();
    }
    if (lang === "fr") return franzoesischeSilbe();
    if (lang === "es") return spanischeSilbe();
    if (lang === "it") return italienischeSilbe();
    if (lang === "tr") return tuerkischesWort();
    if (lang === "pl") return polnischeSilbe();
    if (lang === "cs") return tschechischeSilbe();
    return syllable(); // en
  };
  const hatFokus = (w: string): boolean =>
    focus.length === 0 || [...w].some((c) => focus.includes(c));
  const pseudo = (): string => {
    let letzte = "";
    for (let i = 0; i < 8; i++) {
      const w = pseudoRoh();
      letzte = w;
      const clusterFrei =
        (lang !== "fr" || !FR_VERBOTENE_CLUSTER.some((c) => w.includes(c))) &&
        (lang !== "es" || !ES_VERBOTENE_CLUSTER.some((c) => w.includes(c))) &&
        (lang !== "it" || (!IT_VERBOTENE_CLUSTER.some((c) => w.includes(c)) && !gesperrtIt(w))) &&
        (lang !== "tr" || !gesperrtGefaltetTr(w)) &&
        (lang !== "pl" || (!PL_VERBOTENE_CLUSTER.some((c) => w.includes(c)) && !/(.)\1/u.test(w) && plWeichOk(w) && !gesperrtPl(w))) &&
        (lang !== "cs" || (!CS_VERBOTENE_CLUSTER.some((c) => w.includes(c)) && !gesperrtCs(w) && csVokalfolgeOk(w)));
      if (aussprechbar(w) && hatFokus(w) && clusterFrei) return w;
    }
    // ★ F6-pl: auch der letzte Versuch darf kein Sperrwort sein und keine polnische Schreibregel verletzen - dann lieber ein neutrales
    // `ka`/`ta` aus den freien Buchstaben.
    if (lang === "pl" && (gesperrtPl(letzte) || !plWeichOk(letzte) || /(.)\1/u.test(letzte))) {
      const k = consArr.find((c) => "ktmnlsdp".includes(c));
      const v = vowelsArr.find((c) => "aoeiu".includes(c));
      if (k && v) return k + v;
    }
    return letzte;
  };

  const pickWord = (): string => {
    // Umschalt-Drill: überwiegend Nomen, damit viel (korrekte) Großschreibung übt.
    const w =
      shiftDrill && shift && nounWords.length && Math.random() < 0.75
        ? pick(nounWords)
        : pick(focusWords.length && Math.random() < 0.6 ? focusWords : realWords);
    // Echtes Wort gleich korrekt schreiben (dt. Nomen groß — immer tippbar).
    return caseWord(w, caps, lang);
  };

  // Anteil REINER Unsinn-Zeilen: 100 %, wenn (fast) keine echten Wörter passen,
  // 0 % ab REAL_WORD_FLOOR echten Wörtern. Innerhalb einer Zeile wird NIE gemischt
  // — jede Zeile ist entweder ganz echte Wörter oder ganz Unsinn (Wunsch Johannes).
  const pseudoLineShare =
    pseudoAnteil !== undefined
      ? Math.max(0, Math.min(1, pseudoAnteil))
      : !realWords.length
        ? 1
        : Math.max(
            0,
            Math.min(1, (REAL_WORD_FLOOR - realWords.length) / REAL_WORD_FLOOR),
          );

  // Gegen das „immer dieselben Wörter": zuletzt benutzte Tokens meiden — getrennt
  // je Sorte, damit sich echte Wörter und Pseudowörter nicht ständig wiederholen.
  const recentReal: string[] = [];
  const recentPseudo: string[] = [];
  const RECENT = 8;
  const freshFrom = (make: () => string, recent: string[]): string => {
    let t = make();
    for (let tries = 0; tries < 6 && recent.includes(t); tries++) t = make();
    recent.push(t);
    if (recent.length > RECENT) recent.shift();
    return t;
  };

  const items: DrillZeile[] = [];
  for (let n = 0; n < count; n++) {
    const tokens = 2 + Math.floor(Math.random() * 3); // 2–4 Wörter/Silben pro Zeile
    // Pro ZEILE entscheiden: ganz Unsinn ODER ganz echte Wörter (nie gemischt).
    const usePseudo = Math.random() < pseudoLineShare;
    const make = usePseudo ? pseudo : pickWord;
    const recent = usePseudo ? recentPseudo : recentReal;
    const parts: string[] = [];
    for (let t = 0; t < tokens; t++) parts.push(freshFrom(make, recent));
    // Tokens sind bereits korrekt geschrieben (echte dt. Nomen groß, Pseudo-
    // wörter klein). Englisch/Französisch: Wörter klein …
    let line = parts.join(" ");
    // … aber in beiden sorgt der Satzanfang-Großbuchstabe für Umschalt-Praxis,
    // sobald die Umschalttaste sitzt ({@link SENTENCE_CAP}).
    if (SENTENCE_CAP[lang] && shift) line = capAmAnfang(line, lang);
    // ★ Die Sorte kommt MIT heraus: Ob eine Zeile Unsinn ist, weiß nur diese
    // Stelle - sie hat es gerade entschieden. Wer es später am fertigen Text
    // nachrät, rät falsch (siehe {@link ZeilenArt}).
    items.push({ text: line, unsinn: usePseudo });
  }
  return items;
}

/**
 * Wie {@link wordDrillZeilen}, aber nur die Texte - für Aufrufer, die die Sorte
 * nicht brauchen (Tests, Messskripte).
 */
export function wordDrillLines(
  allowedArr: string[],
  shift: boolean,
  stufe: Stufe,
  focus: string[],
  count: number,
  shiftDrill = false,
  lang: Lang = "de",
  autoCap = true,
  pseudoAnteil?: number,
): string[] {
  return wordDrillZeilen(
    allowedArr,
    shift,
    stufe,
    focus,
    count,
    shiftDrill,
    lang,
    autoCap,
    pseudoAnteil,
  ).map((z) => z.text);
}

export interface AdaptiveOptions {
  /** Bereits freigeschaltete Einheiten (Buchstaben, ⇧, Satzzeichen, Ziffern, Sonderzeichen). */
  introduced: string[];
  /** Einheiten, die bevorzugt geübt werden sollen (schwächste). */
  focus?: string[];
  /** Großschreibung erzwingen (sonst aus ⇧ in introduced abgeleitet). */
  shift?: boolean;
  stufe?: Stufe;
  count?: number;
  /** Sprache der Inhalte (Deutsch/Englisch). */
  lang?: Lang;
  /**
   * ★ E4a (24.09.2026): der Lernweg des Kindes - Pflicht, kein stiller
   * Rückfall (wie `GenerateOptions.lernweg`, Bauplan §2.3): `corpusEntriesFor`
   * braucht ihn, um Inhalt mit `nurWeg` (corpus.ts) auf den richtigen Weg zu
   * beschränken.
   */
  lernweg: Lernweg;
  /**
   * No-Repeat-Ledger (Textwelt TW-E2): Bitset der bereits getippten Baustein-
   * Indizes (siehe ledger.ts/corpusManifest.ts). Ist es gesetzt, bevorzugt die
   * Auswahl UNGESEHENE Bausteine und meidet Wiederholung. Fehlt es (Alt-Aufrufer/
   * Tests), verhält sich die Auswahl wie bisher (kein Ledger).
   */
  seen?: Uint8Array;
  /** Wie GenerateOptions.exclude: vom Aufrufer beigesteuerte Arc-Zeilen meiden. */
  exclude?: Set<number>;
  /**
   * So viele Zeilen der Runde werden gezielte ÜBUNGSZEILEN aus Pseudowörtern
   * (siehe {@link RoundLine.uebung}). Vorgabe 0 — echte Sätze bleiben die Regel.
   * Der Aufrufer leitet die Zahl aus den offenen Baustellen ab
   * ({@link uebungsZeilenFuer}), damit nur übt, wer es gerade braucht.
   */
  uebungsZeilen?: number;
  /**
   * GELÄUFIGKEITSSCHREIBEN (02.09.2026, Übungsform 1 aus Testerin Liste): So
   * viele Zeilen der Runde bestehen aus echten Wörtern mit DERSELBEN häufigen
   * Buchstabenverbindung (`immer besser Wasser` für `-er`).
   *
   * ★ Warum hier und nicht auf der Angebots-Karte wie die acht anderen Formen:
   * Sie ist kein Spiel, sondern der Kern des Zehnfingerschreibens - dieselbe
   * Fingerfolge mehrmals kurz hintereinander, bis sie sitzt. Sie gehört also in
   * den gewöhnlichen Übungslauf und nicht in ein Angebot, das man weglegen kann
   * (Entscheidung Johannes, 01.09.2026).
   *
   * Vorgabe 1 - eine Zeile je Runde, sobald der Tastenstand eine hergibt. Sie
   * geht vom Rest der Runde ab, die Runde wird also nicht länger.
   */
  gelaeufigkeitsZeilen?: number;
  /**
   * ★ E10d (26.09.2026): wie `GenerateOptions.franzVariante` - nur bei
   * `lang === "fr"` von Bedeutung, optional (Vorgabe „fr-FR").
   */
  franzVariante?: FranzVariante;
  /** ★ ES-F7 (27.09.2026): wie `GenerateOptions.esVariante` - nur bei `lang === "es"` von Bedeutung. */
  esVariante?: EsVariante;
  /**
   * ★ GEZIELT ÜBEN (13.11.2026, Bauplan §3): vom Kind oder der Lehrkraft gewählte Zeichen. Der Aufrufer reicht die Zeichen
   * schon auf der eingestellten Tastatur erreichbar herein und trägt noch nicht gelernte (vorgezogene) Einheiten in
   * `introduced` ein - nur für diesen Aufruf. Ohne die Option (oder mit leerer Liste) ist die Runde BYTE-GLEICH wie vorher.
   * `wenig`: mindestens ein Drittel (aufgerundet) der Zeilen trägt eines der Zeichen · `viel`: jede Zeile · `nur`: Zeilen
   * ausschliesslich aus den gewählten Zeichen und Leerzeichen.
   */
  gezielt?: { zeichen: string[]; anteil: GezieltAnteil };
}

/**
 * Wie viele Pseudowort-Übungszeilen gehören bei so vielen offenen Baustellen in
 * eine Runde? Eine Zeile je drei Baustellen, höchstens {@link MAX_UEBUNGSZEILEN}
 * — echte Texte sollen die Regel bleiben, nicht die Ausnahme (Grundsatz Johannes:
 * sinnvolle Texte so früh wie möglich).
 */
export const MAX_UEBUNGSZEILEN = 4;
export function uebungsZeilenFuer(offeneBaustellen: number): number {
  if (offeneBaustellen <= 2) return 0; // läuft rund — kein Drill nötig
  return Math.min(MAX_UEBUNGSZEILEN, Math.floor(offeneBaustellen / 3));
}

/**
 * ★★★ F5-F8 Italienisch (02.10.2026): Sprachen, deren Satz- und Sonderzeichen-Lektionen über die paarfesten Vorlagen von
 * {@link charDrillLine} laufen (nie `mot( mot`, nie ein halbes Paar, die Ersatzzeile zeigt das Fokuszeichen). Französisch
 * seit S4 (26.09.), Spanisch seit ES-F5 (27.09.), Italienisch seit F5-it: sonst machte die einfache Form in `punctItems`
 * aus `" ( ) -` der Lektion „Satzzeichen" Zeilen wie „casa( mela" und „casa" mela" (an Französisch gemessen). Eine
 * EIGENSCHAFT des Weges, keine Weiche: de/en bleiben Byte für Byte (Golden-Test).
 * ★★★ GEN-HAUPTSPRACHE (29.10.2026): die neun neuen Sprachen ebenso - gemessen machte die einfache Form in jeder ihrer
 * Satzzeichen-Lektionen 17 bis 45 halbe Paare je drei Runden („Талк( дъжд", „Desse« tentar", „Putea” dura").
 */
const MIT_ZEICHENVORLAGEN: ReadonlySet<Lang> = new Set<Lang>(["fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"]);

/**
 * ★★★ GEN-HAUPTSPRACHE (29.10.2026): die Anführungszeichen-PAARE der neun neuen Sprachen, die eigene Zeichen sind (nicht `"`):
 * öffnend ⇒ schliessend, wie `paareGemeinsam` ihrer Wege (lernweg.ts) - bg „ “, ro „ ”, el und pt « ». Gelesen nur von
 * {@link charDrillLine}; die acht alten Sprachen haben keines dieser Zeichen als Einheit (gemessen), für sie ändert sich nichts.
 */
const ANFUEHRUNG_PAAR: Readonly<Partial<Record<Lang, readonly [string, string]>>> = {
  bg: ["„", "“"],
  ro: ["„", "”"],
  el: ["«", "»"],
  pt: ["«", "»"],
};

/**
 * ★★★ GEN-HAUPTSPRACHE (29.10.2026, Bauplan nl N3, Regel W-NL1): Sprachen, in deren Übungszeilen `'` und `"` NIE direkt vor einem
 * Selbstlaut stehen (und `'` nie vor `c`): auf `nl-intl` (US-International) sind beide Totasten, aus `"a` wird `ä`, aus `'e` wird
 * `é` - das Kind tippt, was dasteht, und bekommt ein anderes Zeichen. Eine EIGENSCHAFT der Sprache: die Vorlagen von
 * {@link charDrillLine} verwerfen solche Zeilen.
 */
const TOTASTEN_ANFUEHRUNG: ReadonlySet<Lang> = new Set<Lang>(["nl"]);
const W_NL1 = /["'][aeiouyAEIOUY]|'[cC]/;

/** ★ GEN-HAUPTSPRACHE: die neun neuen Sprachen, deren Ersatzzeile paarfest ist (die sechs älteren mit Vorlagen bleiben Byte für Byte). */
const PAARFESTER_ERSATZ: ReadonlySet<Lang> = new Set<Lang>(["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"]);

/** Das Paar (auf, zu), zu dem ein Zeichen gehört: Klammern, `"` und die Anführungszeichen der Sprache ({@link ANFUEHRUNG_PAAR}). */
function ersatzPaar(unit: string, lang: Lang): readonly [string, string] | null {
  for (const [auf, zu] of Object.entries(KLAMMER_PAARE)) if (unit === auf || unit === zu) return [auf, zu];
  if (unit === '"') return ['"', '"'];
  const paar = ANFUEHRUNG_PAAR[lang];
  return paar && paar.includes(unit) ? paar : null;
}

/**
 * ★ F7-pl (03.10.2026, Glossar §1 Nr. 5 und 8): Sprachen mit POLNISCHER Typografie in den Zeichen-Zeilen: das Prozentzeichen OHNE
 * Leerzeichen („95%", Intl pl-PL und PWN sagen dasselbe) und der Apostroph nur IM Wort (`Braille'a`), nie als Anführung. Eine
 * EIGENSCHAFT der Sprache, keine Weiche: de/en/fr/es/it bleiben Byte für Byte („5 %" und `'wort'` wie bisher).
 */
const POLNISCHE_TYPOGRAFIE: ReadonlySet<Lang> = new Set<Lang>(["pl"]);

/**
 * Eine Übungszeile, die ein bestimmtes Satz-/Sonderzeichen bzw. eine Ziffer
 * betont — in einem REALISTISCHEN Mini-Kontext (E-Mail, Preis, Mathe, Zeit,
 * Hashtag, Paragraf, Grad …). Je Zeichen gibt es mehrere Vorlagen, aus denen
 * zufällig eine gewählt wird, damit das Üben abwechslungsreich und lebensnah
 * ist (Wunsch Johannes: „neue, echte Texte zum Üben der Sonderzeichen").
 *
 * Sicherheit: Jede Vorlage nutzt NUR das Fokuszeichen selbst plus Wörter/Ziffern
 * und früh gelernte Zeichen (. , - sind vor allen Sonderzeichen dran) — nie eine
 * Taste, die in der adaptiven Reihenfolge noch nicht freigeschaltet wäre.
 * `stufe` blendet für jüngere Kinder die „erwachsenen" Kontexte (E-Mail-Domain,
 * Paragraf mit Wort, Datum/Tempo) auf einfachere Formen zurück.
 * `lang` macht die festen Füllwörter der Vorlagen sprachabhängig — im Englisch-
 * Modus stand sonst deutsches „und/oder/erst/dann/Uhr" in der Zeile („brown,
 * camera und king" — Prüfbericht 27.07., Teil 0 Punkt 5).
 */
function charDrillLine(
  unit: string,
  word: () => string,
  digitGroup: () => string,
  cap: boolean,
  stufe: Stufe = VORGABE_STUFE,
  allowed?: Set<string>,
  lang: Lang = "de",
): string {
  const w = word;
  const d = digitGroup;
  // „Jung" = einfachere Kontexte (kein E-Mail-Domain, kein Paragraf mit Wort,
  // kein Datum/Tempo). S1: `kids` (7-10) gehört dazu, `teens` (11-15) nicht.
  // Die ALTEN Werte a und b bleiben jung, damit sich für direkt hineingereichte
  // INHALTS-Etiketten (Skripte, Tests) nichts ändert — b liegt damit bewusst
  // anders als in skin.ts, wo b als KONTO-Wert schon zur Jugend zählt. Die
  // Inhalts-Zuordnung stellt erst Charge S3 um.
  const young = stufe === "kids" || stufe === "a" || stufe === "b";
  // Sprachabhängige Füllwörter — laufen unten durchs selbe Sicherheits-Netz wie
  // die deutschen (Buchstaben gegen den Tastenstand geprüft).
  //
  // ★ E10c (26.09.2026): Tabelle statt Ternäre - vorher gab es nur „en"/sonst
  // Deutsch, „fr" bekam „und/oder/erst/dann" mitten in den Satz („brown, camera
  // und king" — derselbe Fehler, der für Englisch schon einmal behoben wurde,
  // Prüfbericht 27.07.). `zeitOhneWort`: Deutsch hängt „Uhr" an die Uhrzeit,
  // Englisch und Französisch keinen Zusatz (Bauplan macht dazu keine Vorgabe -
  // bis zu einer Entscheidung gilt dieselbe Regel wie Englisch).
  const FILLER: Record<Lang, { und: string; oder: string; erst: string; dann: string; zeitOhneWort: boolean }> = mitRueckfallEn({
    de: { und: "und", oder: "oder", erst: "erst", dann: "dann", zeitOhneWort: false },
    en: { und: "and", oder: "or", erst: "first", dann: "then", zeitOhneWort: true },
    fr: { und: "et", oder: "ou", erst: "d'abord", dann: "puis", zeitOhneWort: true },
    // ★ ES-F6 (27.09.2026): echte spanische Füllwörter statt „vorerst wie en"
    // (ES-F2) - „y/o/primero/después", wie Englisch/Französisch ohne Zusatz
    // an der Uhrzeit (Bauplan macht dazu keine Vorgabe für „es").
    es: { und: "y", oder: "o", erst: "primero", dann: "después", zeitOhneWort: true },
    // ★ F6-it (02.10.2026): echte italienische Füllwörter - „e/o/prima/poi", wie Englisch/Französisch/Spanisch ohne
    // Zusatz an der Uhrzeit (Italienisch schreibt „alle 9:15" - das Wort davor steht in den Texten, nicht in der Vorlage).
    it: { und: "e", oder: "o", erst: "prima", dann: "poi", zeitOhneWort: true },
    // ★ F6-pl (03.10.2026): echte polnische Füllwörter - „i/lub/najpierw/potem", wie Englisch/Französisch/Spanisch/Italienisch
    // ohne Zusatz an der Uhrzeit (Polnisch schreibt „o 9:15" - das Wort davor steht in den Texten, nicht in der Vorlage).
    // Das Sicherheitsnetz unten verwirft eine Vorlage, deren Füllwort einen noch ungelernten Buchstaben braucht (`lub` ohne `u`).
    pl: { und: "i", oder: "lub", erst: "najpierw", dann: "potem", zeitOhneWort: true },
    // ★ F6-tr (03.10.2026): echte türkische Füllwörter - „ile" (Ali, Ayşe ile Can: „und"; kein `ve`, dessen `v` erst als
    // Nr. 26 kommt, die Vorlagen mit Komma aber schon bei Nr. 20), „ya da" („oder"), „önce"/„sonra", ohne Zusatz an der Uhrzeit.
    tr: { und: "ile", oder: "ya da", erst: "önce", dann: "sonra", zeitOhneWort: true },
    // ★ F6-cs (03.10.2026): echte tschechische Füllwörter - „a/nebo/nejdřív/pak", ohne Zusatz an der Uhrzeit (Tschechisch schreibt „v 9:15").
    // „a" steht vor jedem Komma-Buchstaben frei (Nr. 7); `nebo` und `nejdřív` fallen am Sicherheitsnetz unten heraus, bis b, ř, í frei sind.
    cs: { und: "a", oder: "nebo", erst: "nejdřív", dann: "pak", zeitOhneWort: true },
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): die neun neuen Sprachen mit eigenen Füllwörtern statt des englischen Rückfalls - je Sprache
    // „und / oder / zuerst / dann", ohne Zusatz an der Uhrzeit (wie it/pl/tr/cs: das Wort davor steht in den Texten). Das
    // Sicherheitsnetz unten verwirft eine Vorlage, deren Füllwort einen noch ungelernten Buchstaben braucht.
    bg: { und: "и", oder: "или", erst: "първо", dann: "после", zeitOhneWort: true },
    el: { und: "και", oder: "ή", erst: "πρώτα", dann: "μετά", zeitOhneWort: true },
    hu: { und: "és", oder: "vagy", erst: "először", dann: "aztán", zeitOhneWort: true },
    nl: { und: "en", oder: "of", erst: "eerst", dann: "dan", zeitOhneWort: true },
    pt: { und: "e", oder: "ou", erst: "primeiro", dann: "depois", zeitOhneWort: true },
    br: { und: "e", oder: "ou", erst: "primeiro", dann: "depois", zeitOhneWort: true },
    ro: { und: "și", oder: "sau", erst: "întâi", dann: "apoi", zeitOhneWort: true },
    sv: { und: "och", oder: "eller", erst: "först", dann: "sedan", zeitOhneWort: true },
    uk: { und: "і", oder: "або", erst: "спочатку", dann: "потім", zeitOhneWort: true },
  });
  const { und, oder, erst, dann, zeitOhneWort } = FILLER[lang];
  // Sind ZIFFERN schon dran? Satzzeichen kommen in der adaptiven Reihenfolge VOR
  // den Ziffern — ohne diese Prüfung würde aus „9:15 Uhr" ein „hund:katze Uhr"
  // (digitGroup weicht ohne Ziffern auf Wörter aus).
  const digitsOk = allowed ? DIGIT_ORDER.some((c) => allowed.has(c)) : true;
  const variants = ((): string[] => {
    if (DIGIT_ORDER.includes(unit)) {
      // Ziffern in Gruppen, die gewählte Ziffer betont.
      return [`${d()} ${unit}${d()} ${d()}`, `${unit}${d()} ${d()}${unit}`];
    }
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): die eigenen Anführungszeichen der neun neuen Sprachen (bg „ “, ro „ ”, el/pt « ») - immer
    // BEIDE Hälften, egal welche gerade geübt wird (sie werden über `paareGemeinsam` ohnehin gemeinsam freigeschaltet).
    const paar = ANFUEHRUNG_PAAR[lang];
    if (paar && paar.includes(unit)) {
      const [auf, zu] = paar;
      return [`${auf}${w()}${zu} ${w()}`, `${w()}: ${auf}${w()}${zu}`, `${w()} ${auf}${w()} ${w()}${zu}`];
    }
    // ★ GEN-HAUPTSPRACHE: im Griechischen ist `;` das Fragezeichen (erotimatiko) - es steht am Satzende, nie mitten im Satz.
    if (unit === ";" && lang === "el") return [`${w()} ${w()};`, `${w()} ${oder} ${w()};`, `${w()}, ${w()} ${oder} ${w()};`];
    switch (unit) {
      // --- Satzzeichen: ECHTE Verwendungen statt Zeichen-Stakkato (Wunsch
      // Johannes 21.07.). Mit zufällig gezogenen Wörtern lässt sich keine volle
      // Grammatik garantieren — darum bewusst nur Muster, die mit BELIEBIGEN
      // Wörtern tragen: Aufzählung, Kopplung, Alternative, Uhrzeit, Zahlenbereich.
      case ".": return [`${w()} ${w()}.`, `${w()}. ${w()} ${w()}.`, `${w()} ${w()} ${w()}.`];
      case ",": return [
        `${w()}, ${w()} ${und} ${w()}`,
        `${w()}, ${w()}, ${w()} ${und} ${w()}`,
        `${w()}, ${w()} ${oder} ${w()}`,
        `${erst} ${w()}, ${dann} ${w()}`,
      ];
      case "-": return digitsOk
        ? [`${w()}-${w()}`, `${w()}-${w()}-${w()}`, `${d()}-${d()}`]
        : [`${w()}-${w()}`, `${w()}-${w()}-${w()}`];
      // ★★★★★ ES-P7a-Behebung (27.09.2026, M3, Bauplan §4.4 Punkt 1): auf
      // Weg „es" ist ein Fragesatz ein HARTES Paar - „¿" UND „?" gehören in
      // JEDE Vorlage, egal ob gerade „¿" oder „?" die neu geübte Einheit ist
      // (sie werden seit `paareGemeinsam` ohnehin gemeinsam freigeschaltet).
      // Vorher fiel „¿" mangels eigenem `case` in den `default`-Zweig
      // (`${w()} ${unit} ${w()}"`) - ein halbes Paar wie „Claro ¿ le"
      // (Prüfbericht M3: 60,7 % der Fokus-Zeilen). de/en/fr unverändert.
      case "¿":
      case "?":
        return lang === "es"
          ? [
              `¿${w()} ${w()}?`,
              `¿${w()} ${oder} ${w()}?`,
              `¿${w()}?`,
              `¿${w()}, ${w()} ${oder} ${w()}?`,
            ]
          : [
              `${w()} ${w()}?`,
              `${w()} ${oder} ${w()}?`,
              `${w()}? ${w()} ${w()}.`,
              `${w()}, ${w()} ${oder} ${w()}?`,
            ];
      case "¡":
      case "!":
        return lang === "es"
          ? [`¡${w()}!`, `¡${w()} ${w()}!`, `¡${w()}, ${w()}!`]
          : [`${w()}!`, `${w()} ${w()}!`, `${w()}, ${w()}!`];
      // Uhrzeit: deutsch „9:15 Uhr"; englisch/französisch OHNE Zusatzwort
      // („9:15" — im Englischen steht kein Wort hinter der Uhrzeit,
      // Prüfbericht 27.07.; für Französisch macht der Bauplan keine Vorgabe,
      // bis dahin dieselbe Regel wie Englisch, siehe FILLER.zeitOhneWort).
      case ":": return digitsOk
        ? [`${w()}: ${w()}, ${w()} ${und} ${w()}`, `${w()}: ${w()}`, zeitOhneWort ? `${d()}:${d()}` : `${d()}:${d()} Uhr`]
        : [`${w()}: ${w()}, ${w()} ${und} ${w()}`, `${w()}: ${w()}`, `${w()}: ${w()}, ${w()}`];
      case ";": return [
        `${w()}; ${w()}`,
        `${w()} ${und} ${w()}; ${w()} ${und} ${w()}`,
        `${w()}, ${w()}; ${w()}, ${w()}`,
      ];
      // --- Sonderzeichen in lebensnahen Kontexten ---
      case "(": case ")": return [`${w()} (${w()})`, `(${w()}) ${w()}`, `${w()} (${w()} ${w()})`];
      case '"': return [`"${w()}" ${w()}`, `${w()}: "${w()}"`];
      // ★ F7-pl (03.10.2026): im Polnischen ist der Apostroph KEIN Anführungszeichen (das sind „…” bzw. tippbar `"…"`), er steht im
      // Wort: die Endung an einem fremden Namen (Braille'a, Glossar §1 Nr. 8). Eine Zeile `'wort'` übte etwas, das es nicht gibt.
      case "'":
        return POLNISCHE_TYPOGRAFIE.has(lang)
          ? [`${w()}'a`, `${w()}'a ${w()}`]
          : [`'${w()}'`, `${w()} '${w()}' ${w()}`];
      case "+": return [`${d()} + ${d()}`, `${d()} + ${d()} + ${d()}`];
      case "*": return [`${d()} * ${d()}`, `${d()} * ${d()} * ${d()}`];
      case "/": return young ? [`${w()}/${w()}`] : [`${d()}/${d()}/${d()}`, `${w()}/${w()}`, `${d()} km/h`];
      case "=": return [`${d()} + ${d()} = ${d()}`, `${d()} = ${d()}`]; // „+" ist vor „=" dran → sicher
      // ★ F5-F8 Türkisch: das Prozentzeichen steht VOR der Zahl (`%95`, TDK; `prozentVorDerZahl` im Sprachregister).
      // ★ F7-pl: Polnisch schreibt „95%" (ohne Leerzeichen); alle anderen „95 %".
      case "%":
        return sprachBeschreibung(lang).prozentVorDerZahl
          ? [`%${d()}`, `%${d()} ${w()}`]
          : POLNISCHE_TYPOGRAFIE.has(lang)
            ? [`${d()}%`, `${d()}% ${w()}`]
            : [`${d()} %`, `${d()} % ${w()}`];
      case "&": return [`${w()} & ${w()}`, `${w()} & ${w()} & ${w()}`];
      // ★ 26.09.2026: „_" kommt nur auf Weg „fr" als Einheit vor (Dateinamen).
      case "_": return digitsOk ? [`${w()}_${w()}`, `${w()}_${d()}`] : [`${w()}_${w()}`];
      case "@": return young ? [`${w()}@${w()}`] : lang === "tr" ? [`${w()}.${w()}@${w()}.com.tr`, `${w()}@${w()}.com`] : [`${w()}.${w()}@${w()}.at`, `${w()}@${w()}.de`];
      // ★★★★★ ES-P7a-Behebung (27.09.2026, M8): auf Weg „es" OHNE Dezimal-
      // stellen - die Zeile hat keinen Ort (Prüfbericht §5.3: „variantenneutrale
      // Zeilen haben keine Dezimalzahlen und keine Währung"), und ein
      // Dezimalbetrag mit „€" gehört ohnehin nur nach Spanien; auf es-419
      // (Lateinamerika) wäre „12,50 €" nach `wandleFormatoNumerico` ein
      // Dezimalpunkt-Betrag in einer Währung, die dort niemand benutzt.
      case "€":
        // ★ F5-F8 Türkisch: die Währung steht VOR der Zahl (`€5`, `₺150`; Glossar §1 Regel 5), ohne Dezimalen (variantenneutral).
        if (sprachBeschreibung(lang).waehrungVorDerZahl) return [`€${d()}`, `€${d()} ${w()}`];
        return lang === "es" || lang === "it" || lang === "cs"
          ? [`${d()} €`, `${d()} € ${w()}`]
          : [`${d()} €`, `${d()},${d()} €`, `${d()} € ${w()}`];
      case "₺": return [`₺${d()}`, `₺${d()} ${w()}`];
      case "½": return [`½ ${w()}`, `${d()}½ ${w()}`];
      case "#": return [`#${w()}`, `#${w()} #${w()}`];
      case "$": return sprachBeschreibung(lang).waehrungVorDerZahl ? [`$${d()}`, `$${d()} ${w()}`] : [`${d()} $`, `$${d()}`];
      // ★ D1 Nr. 6 (28.09.2026): „£" (UK) wie der Preis steht - vor der Zahl.
      // Bis hierher kam „£" in „Mein Training" gar nicht vor (siehe
      // `rundenEinheiten`); ohne eigene Vorlage stünde es mitten zwischen zwei
      // Wörtern. Der Backslash bleibt beim Standard („wort \ wort", ein Pfadtrenner).
      case "£": return digitsOk ? [`£${d()}`, `£${d()} ${w()}`] : [`${w()} £ ${w()}`];
      case "§": return young ? [`§ ${d()}`] : [`§ ${d()}`, `§ ${d()} ${w()}`];
      case "<": return [`${d()} < ${d()}`, `${w()} < ${w()}`];
      case ">": return [`${d()} > ${d()}`, `${w()} > ${w()}`];
      // Mathematik / Chemie: Mengen, Intervalle, Betrag, Grad (alle Klammern/„=" sind
      // in der Reihenfolge nach diesen Zeichen NICHT nötig → kontextsicher).
      // ★ 26.09.2026: auf Französisch zusätzlich das halboffene Intervall
      // „[2 ; 5[" (französische Schreibweise) - damit hat „[" eine Zeile,
      // bevor „]" gelernt ist (Wächter M1: jede Einheit steht in ihrer Runde).
      case "[": case "]": return lang === "fr"
        ? [`[${d()}, ${d()}]`, `[${w()}]`, `${unit}${d()} ; ${d()}${unit}`]
        : [`[${d()}, ${d()}]`, `[${w()}]`];
      case "{": case "}": return [`{${d()}, ${d()}, ${d()}}`, `{${w()}}`];
      case "|": return [`|${d()}| = ${d()}`, `${w()} | ${w()}`];
      // ^ ist eine Totaste — zur sicheren Eingabe mit Leerzeichen umgeben.
      case "^": return [`${d()} ^ ${d()}`];
      case "~": return [`~${d()}`, `${w()} ~ ${w()}`];
      case "°": return [`${d()} °C`, `${d()}° ${d()}°`];
      default: return [`${w()} ${unit} ${w()}`];
    }
  })();
  // Sicherheits-Netz: Vorlagen verwerfen, die ein noch NICHT freigeschaltetes
  // Zeichen verlangen würden — etwa „)", solange erst „(" dran ist (Klammern
  // werden EINZELN eingeführt). Das Fokuszeichen selbst ist immer erlaubt.
  // BUCHSTABEN werden mitgeprüft: die Vorlagen enthalten feste, sprachabhängige
  // Füllwörter (de „und/oder/erst/dann/Uhr", en „and/or/first/then"), die sonst
  // eine ungelernte Taste verlangen könnten. Bleibt keine Vorlage übrig, eine
  // reine Wort-Zeile.
  //
  // ★★★★★ ES-P7a-Behebung (27.09.2026, M2): dasselbe Sicherheitsnetz verwarf
  // bis dahin JEDE Zeile mit einem Totasten-Buchstaben (á é í ó ú ü) - selbst
  // wenn `filterWords` ihn schon zugelassen hatte (Totaste UND Grundbuchstabe
  // gelernt), weil hier `allowed.has(c.toLowerCase())` allein prüfte. Dieselbe
  // Erweiterung wie dort (`totastenBuchstabeFrei`, Falle 32 - EINE Quelle).
  // ★ F5-F8 Türkisch: Eigenschaft des Weges statt Name (siehe `filterWords`).
  const totastenWeg = hatTotastenEinheit(lang);
  const safe = allowed
    ? variants.filter((v) =>
        [...v].every(
          (c) =>
            c === " " ||
            c === unit ||
            (c >= "0" && c <= "9") ||
            (istBuchstabe(kleinFuer(c, lang))
              ? allowed.has(kleinFuer(c, lang)) ||
                (totastenWeg && totastenBuchstabeFrei(kleinFuer(c, lang), allowed, lang))
              : allowed.has(c)),
        ),
      )
    : variants;
  // ★★★ GEN-HAUPTSPRACHE (W-NL1): auf einer Sprache mit Totasten-Anführung keine Zeile mit `"a` oder `'e`.
  const tippbar = TOTASTEN_ANFUEHRUNG.has(lang) ? safe.filter((v) => !W_NL1.test(v)) : safe;
  // ★ 26.09.2026 (Weg „fr"): Bleibt keine Vorlage übrig, übt die Ersatzzeile
  // wenigstens das Zeichen selbst („mot { mot") - vorher stand dort eine
  // Zeile OHNE das Zeichen, und „{" kam in seiner Runde nie vor (Wächter M1).
  // Deutsch/Englisch unverändert (Golden-Test).
  // ★★★ ES-F5 (27.09.2026): dieselbe Falle, hier zum ersten Mal für Weg „es"
  // GEMESSEN (nicht nur vermutet): „(" ist die erste Einheit des spanischen
  // Wegs, deren EINZIGE Vorlagen alle das noch ungelernte Gegenstück „)"
  // brauchen (§4.3 - Klammern werden einzeln eingeführt, wie Französisch bei
  // „{"/„["). `safe` wird darum bei „(" IMMER leer, und ohne diese Erweiterung
  // hätte „Mein Training" auf Weg „es" die Einheit „(" nie geübt (0 von N
  // Zeilen, dieselbe Fehlerklasse wie M1/Falle 37) - exakt der Fall, den der
  // neue Wächter `tests/tastenflow-lernweg-es-textauswahl.test.ts` (Abschnitt
  // 2b) beim ersten Lauf gefunden hat.
  // (Nur bauen, wenn gebraucht - jedes `word()` verbraucht Zufall.)
  // ★★★★★ ES-P7a-Behebung (M3): auch der Notnagel bleibt paarfest - „¿"/„?"
  // bzw. „¡"/„!" nie ohne ihr Gegenstück, selbst wenn ALLE Vorlagen oben aus
  // einem anderen Grund verworfen wurden.
  const ersatz = (): string => {
    if (lang === "es" && (unit === "¿" || unit === "?")) return `¿${word()}?`;
    if (lang === "es" && (unit === "¡" || unit === "!")) return `¡${word()}!`;
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): auf den neun neuen Sprachen auch der Notnagel paarfest - eine Klammer oder ein
    // Anführungszeichen des Weges kommt nur mit seinem Gegenstück; auf nl (W-NL1) nie vor einem Selbstlaut.
    if (PAARFESTER_ERSATZ.has(lang)) {
      const paarVon = ersatzPaar(unit, lang);
      if (paarVon) {
        for (let i = 0; i < 12; i++) {
          const z = `${paarVon[0]}${word()}${paarVon[1]}`;
          if (!TOTASTEN_ANFUEHRUNG.has(lang) || !W_NL1.test(z)) return z;
        }
        return `${word()} ${word()}`;
      }
    }
    return MIT_ZEICHENVORLAGEN.has(lang) ? `${word()} ${unit} ${word()}` : `${word()} ${word()}`;
  };
  const line = pick(tippbar.length ? tippbar : [ersatz()]);
  return cap ? capAmAnfang(line, lang) : line;
}


/**
 * Die Einheiten eines Tastenstands, aufgeteilt nach dem, was der Generator mit
 * ihnen tut: Buchstaben (Wörter, Silben), Satzzeichen/Ziffern/Sonderzeichen
 * (Zeichen-Zeilen) und Einheiten, die nur ERLAUBT werden.
 */
export interface RundenEinheiten {
  letters: string[];
  puncts: string[];
  digits: string[];
  symbols: string[];
  /**
   * Einheiten, die der Korpus braucht, die aber keine eigene Zeichen-Zeile
   * bekommen: auf Weg „fr" die Totasten `^ ¨` (allein im Text wären sie ein
   * Zirkumflex/Trema ohne Buchstaben - „Janvier ^ janvier", Prüfbericht S4)
   * und der Apostroph (er gehört in die Elision „l'ami" des Korpus, nicht in
   * eine Zeile „'safari'" als Anführungszeichen).
   */
  nurErlaubt: string[];
}

/**
 * Welche Listen teilen die Zeichen-Einheiten eines Weges ein?
 *  · „fr": die EIGENEN Listen des Weges (`lernwegDef("fr")`) - mit den
 *    deutschen fielen `_` und `¨` ganz heraus (auf keiner deutschen Liste),
 *    und `' ^` wurden als deutsche Sonderzeichen gedrillt.
 *  · „de": die deutschen Listen SIND die Listen des Weges - gleich.
 *  · „en": bleibt bei den deutschen Listen (Golden-Test `tastenflow-generator-
 *    de-en-unveraendert`, Auftrag „um kein Byte"). ⚠️ Bekannte Lücke derselben
 *    Klasse, für Johannes im Befund `BEFUND-2026-09-26-MECHANIK-BEHEBUNG-FR.md`:
 *    Backslash und `£` (nur US/UK) stehen auf keiner deutschen Liste und
 *    fallen in „Mein Training" aus dem Tastenstand.
 *  · „es" (seit ES-F5): wie „fr" die EIGENEN Listen - `ES_PUNCT_ORDER` kennt
 *    „¿ ¡" (auf keiner deutschen Liste), sonst fielen sie aus dem Tastenstand.
 */
// ★★★ ES-F5 (27.09.2026, Falle 12/19 - derselbe Fund wie bei Französisch M1):
// „es" bekommt jetzt ECHTE eigene Listen (`lernwegDef("es")`, seit ES-F4 kein
// Alias von „en" mehr - `ES_PUNCT_ORDER` kennt „¿ ¡", `ES_SYMBOL_ORDER` steht
// eigens). Der Kommentar hier stand seit ES-F2 auf „false" und war seit ES-F4
// STILL VERALTET: „Mein Training" (`rundenEinheiten`/`adaptiveRound`) und die
// Sonderzeichen-Lektion (`symbolItems`) teilten den Tastenstand eines Kindes
// auf Weg „es" weiterhin über die DEUTSCHEN Listen ein - „¿"/„¡" kamen darin
// nicht vor (auf keiner deutschen Liste) und wurden nie geübt, obwohl sie
// längst freigeschaltet waren. Genau die Fehlerklasse, die der Leitfaden für
// Französisch (M1) beschreibt, hier an einer eigenen, unabhängigen Stelle.
// ★★★ F5-F8 Italienisch (02.10.2026): „it" bekommt seine EIGENEN Listen (`IT_PUNCT_ORDER`, `IT_SYMBOL_ORDER`). Mit den
// deutschen wäre der Apostroph - bei Italienisch Einheit Nr. 26 der LETTER-Folge (Elision l'amico), kein
// Anführungszeichen - als deutsches Sonderzeichen gedrillt worden („'safari'"), `_` und `{ }` auf keiner Liste. Jetzt
// steht er in `nurErlaubt` (er gehört in die Elision des Korpus), wie auf Weg „fr".
// ★ F5-F8 Polnisch (03.10.2026): „pl" ebenso - `PL_PUNCT_ORDER` kennt `'` (Braille'a), `PL_SYMBOL_ORDER` kein `£ § ° ~` (nicht auf `pl`).
// ★★★ F5-F8 Türkisch (03.10.2026): „tr" ebenso - die eigenen Listen (`TR_PUNCT_ORDER`, `TR_SYMBOL_ORDER`) führen `₺ ½`; der Apostroph (Einheit
// Nr. 30, nur an Eigennamen: `Ankara'da`) und die Totaste `^` (â î û) stehen dann in `nurErlaubt` und werden nicht als deutsche
// Sonderzeichen gedrillt (`'wort'`, `wort ^ wort`). Mit den deutschen Listen wäre der Apostroph des Weges für „Mein Training"
// unerreichbar gewesen (er steht auf keiner deutschen Liste und wäre aus dem Tastenstand gefallen).
// ★ F5-F8 Tschechisch (03.10.2026): „cs" ebenso - `CS_PUNCT_ORDER` kennt `'` (nur als Anführung geübt), die Totasten `ˇ ´ ¨` stehen in `nurErlaubt`.
const EIGENE_LISTEN: Record<Lernweg, boolean> = { de: false, en: false, fr: true, es: true, it: true, pl: true, tr: true, cs: true, bg: true, el: true, hu: true, nl: true, pt: true, br: true, ro: true, sv: true, uk: true /* ★ GEN-HAUPTSPRACHE (29.10.2026): eigene Listen - bis dahin (G2-NEUN) die deutschen, als Alias von „en" */ };

/**
 * ★★★ M1 (Mechanik-Prüfung fr, 26.09.2026): EINE Stelle, die einen Tastenstand
 * für „Mein Training" (und das Klassenmatch, dieselbe Funktion) einteilt.
 * Auf Weg „fr" ergibt `letters + puncts + digits + symbols + nurErlaubt` genau
 * den Tastenstand von `allowedFromIntroduced` (serien.ts) - Wächter
 * `tests/tastenflow-mechanik-fr-generator.test.ts`.
 */
export function rundenEinheiten(intro: readonly string[], lernweg: Lernweg): RundenEinheiten {
  // ★ F5-F8 Tschechisch: nicht die Totaste `ˇ` (Unicode `Lm`) - sie steht bei „nur erlaubt" (`istWortBuchstabe`).
  const letters = intro.filter((c) => istWortBuchstabe(c));
  const eigene = EIGENE_LISTEN[lernweg] === true;
  const def = eigene ? lernwegDef(lernweg) : null;
  const punct = def ? def.punctOrder : PUNCT_ORDER;
  const digit = def ? def.digitOrder : DIGIT_ORDER;
  const symbol = def ? def.symbolOrder : SYMBOL_ORDER;
  const puncts = intro.filter((c) => punct.includes(c));
  const digits = intro.filter((c) => digit.includes(c));
  const symbols = intro.filter((c) => symbol.includes(c));
  // ★★★ D1 Nr. 6 (28.09.2026, Entscheidung Johannes): Wege mit den DEUTSCHEN
  // Listen (Weg „en" - Golden-Test „um kein Byte") verloren jedes Zeichen, das
  // auf keiner deutschen Liste steht: „\" und „£" (und seit D1 „€" nicht,
  // das steht dort) wurden auf Weg „en" nie geübt, obwohl freigeschaltet.
  // Jetzt kommt, was die EIGENEN Listen des Weges kennen und die deutschen
  // nicht, zu den Sonderzeichen - in der Reihenfolge des Tastenstands. Weg
  // „de": die Listen sind dieselben, es kommt nichts dazu (byte-gleich).
  if (!eigene) {
    const weg = lernwegDef(lernweg);
    const schon = new Set([...letters, ...puncts, ...digits, ...symbols]);
    for (const c of intro) {
      if (schon.has(c) || c === SHIFT_UNIT) continue;
      if (weg.punctOrder.includes(c) || weg.symbolOrder.includes(c)) symbols.push(c);
    }
  }
  // ★★★ SPRACHEN-9 (30.10.2026, Fund Johannes): eine Einheit, die weder Buchstabe noch auf einer Liste ist und auch nicht im Wort
  // oder in einem Akzentbuchstaben steckt - das `;` als achte Grundtaste auf Weg „nl" - blieb in `nurErlaubt` und war in „Mein
  // Training" nie zu üben. Sie wird ein Satzzeichen wie auf Weg „en" (dort über die deutsche Liste). „pl" ebenso (Johannes
  // 30.10.2026, Golden-Aufnahme bewusst neu). Unter den anderen Wegen mit eigenen Listen trifft die Regel gemessen nichts.
  if (eigene) {
    const vorhanden = new Set([...letters, ...puncts, ...digits, ...symbols]);
    for (const c of intro) {
      if (!vorhanden.has(c) && c !== SHIFT_UNIT && c !== "'" && !istTotastenEinheit(c, lernweg)) puncts.push(c);
    }
  }
  const erfasst = new Set([SHIFT_UNIT, ...letters, ...puncts, ...digits, ...symbols]);
  const nurErlaubt = eigene ? intro.filter((c) => !erfasst.has(c)) : [];
  return { letters, puncts, digits, symbols, nurErlaubt };
}

/**
 * Die Zeichen, an denen man eine Fokus-Einheit im Text ERKENNT: sie selbst und
 * - bei einer Totaste - jedes zusammengesetzte Zeichen, das mit ihr beginnt
 * („^" ⇒ ê â î ô û, „¨" ⇒ ë ï ü ÿ).
 */
function nurFocusZeichen(units: readonly string[]): string[] {
  const out: string[] = [];
  for (const u of units) {
    out.push(u);
    for (const k of KOMBIZEICHEN) if (k.tot === u) out.push(k.zeichen);
    // ★ F5-F8 Tschechisch: der Háček gibt `ď ť ň` (die Zeichen, die er LERNT - `č š ř ž ě` haben eigene Tasten und kommen nicht über ihn);
    // er steht nur in der tschechischen Liste, darum ist das für jede andere Einheit wirkungslos.
    if (!KOMBIZEICHEN.some((k) => k.tot === u)) out.push(...(zieleCs()[u] ?? []));
  }
  return out;
}
/**
 * Was eine Totaste im tschechischen Weg LERNT (`totastenZiele` von „cs": `ˇ` ⇒ ď ť ň, `´` ⇒ ó) - aus den Daten des Weges, keine zweite Liste.
 * Der Wort-Drill zieht damit Wörter mit diesen Zeichen in den Fokus (`wortFokus`): ohne das hätte der Fokus auf `ˇ` oder `´` im Wort-Weg
 * nie ein `ď` oder `ó` geübt (die Totaste selbst steht in keinem Wort).
 */
function zieleCs(): Readonly<Record<string, readonly string[]>> {
  return lernwegDef("cs").totastenZiele ?? {};
}

/**
 * ★ S4 (Mechanik-Prüfung fr, 26.09.2026): Eine ERZEUGTE französische Zeile nach
 * französischer Typografie setzen - wie die Korpuszeilen in ihrer Grundform:
 *  · Leerzeichen vor `; : ! ?` (nur nach einem Buchstaben - „9:15" bleibt),
 *  · nach einem Satzende gross weiter, sobald die Umschalttaste sitzt
 *    („Ouest. Fruit manger." statt „Ouest. fruit manger."),
 *  · danach die Landes-Typografie (`wandleTypografie`: Kanada ohne Leerzeichen
 *    vor `; ! ?`), wie jede Korpuszeile.
 * Wege „de"/„en": unverändert zurück.
 */
export function setzeFranzoesisch(
  text: string,
  lang: Lang,
  shift: boolean,
  variante: FranzVariante | undefined,
): string {
  if (lang !== "fr") return text;
  let t = text.replace(/(\p{L}) *([;:!?])/gu, "$1 $2");
  // ★ W1: nur, wo die Tastatur den Grossbuchstaben direkt erzeugt (`capAmAnfang`).
  if (shift)
    t = t.replace(/([.!?]) (\p{Ll})/gu, (_m, z: string, b: string) => `${z} ${capAmAnfang(b, lang)}`);
  // Zuletzt in die Schreibweise der Tastatur (Œ → Oe, « » → "). ★ W1: ein
  // gross gewordenes „é" entsteht hier gar nicht mehr (`capAmAnfang`); bis W1
  // wurde es zu „E" ersetzt - falsches Französisch (Befund Anhang C).
  return toLayoutText(wandleTypografie(t, variante ?? "fr-FR"));
}

/**
 * Eine ERZEUGTE Zeile (ohne Korpus-Herkunft) für die Ausgabe fertig machen -
 * auf Weg „fr" über {@link setzeFranzoesisch}, auf Weg „es" über
 * {@link wandleFormatoNumerico} (ES-F7 - nur die Zahlenschreibung, „es" hat
 * keine der französischen Satzzeichen-Sonderregeln), sonst dieselbe Zeile
 * (dasselbe Objekt, kein Zufall verbraucht - „de"/„en" bleiben Byte für
 * Byte). Korpus-Zeilen (`l.source !== null`) sind schon in `corpusEntriesFor`
 * über `wandleVariante` gewandelt - hier NICHT ein zweites Mal.
 */
function fertigeZeile(
  l: RoundLine,
  lang: Lang,
  shift: boolean,
  variante: FranzVariante | undefined,
  esVar?: EsVariante,
): RoundLine {
  if (l.source !== null) return l;
  if (lang === "fr") return { ...l, text: setzeFranzoesisch(l.text, lang, shift, variante) };
  // ★ D1 (28.09.2026, Nr. 15): nicht mehr „es-419 ⇒ Punkt", sondern das Land
  // der Browsersprache (`esZahlGebiet`) - wie die Oberfläche. Ohne Variante
  // (Aufrufer ausserhalb des Weges „es") bleibt die Zeile, wie sie ist.
  if (lang === "es" && esVar !== undefined) {
    const text = wandleFormatoNumerico(l.text, esZahlGebiet());
    return text === l.text ? l : { ...l, text };
  }
  return l;
}

/**
 * Übungszeilen für die adaptive Lernumgebung „Mein Training": Wörter/Pseudowörter
 * aus den freigeschalteten Buchstaben (mit Betonung der schwächsten) UND — sobald
 * freigeschaltet — Großschreibung, Satzzeichen, Zahlen und Sonderzeichen. Es
 * werden ausschließlich bereits freigeschaltete Zeichen verlangt.
 */
export function adaptiveItems(opts: AdaptiveOptions): string[] {
  return adaptiveRound(opts).map((l) => l.text);
}

/**
 * Wie {@link adaptiveItems}, aber gibt Zeilen MIT Herkunft (`RoundLine`) zurück —
 * die Grundlage fürs No-Repeat-Ledger (TW-E2). Kernumbau gegen „Wortsalat +
 * Wiederholung":
 *  • **Sinnvolle Bausteine zuerst:** passende Korpuszeilen (über `minTier`/`fitText`)
 *    füllen die Runde; ungesehene (laut `opts.seen`) kommen VOR gesehenen.
 *  • **Wortsalat nur Notnagel:** Wort-/Silben-Zeilen erscheinen nur, wenn KEIN
 *    passender Baustein (auch kein gesehener) mehr übrig ist — praktisch nur ganz
 *    früh (T0) oder wenn ein Satz-/Sonderzeichen gezielt geübt wird.
 *  • **Keine Wiederholung:** innerhalb der Runde jeder Baustein höchstens einmal;
 *    über Runden hinweg meidet das Ledger Gesehenes (der Aufrufer verbucht
 *    `source`). Ist der ganze passende Vorrat gesehen, werden gesehene Bausteine
 *    wieder zugelassen (Eimer-Reset) — immer noch Sinn statt Silbensalat.
 */
export function adaptiveRound(opts: AdaptiveOptions): RoundLine[] {
  if (opts.gezielt && opts.gezielt.zeichen.length > 0) return gezielteRunde(opts, opts.gezielt);
  return adaptiveRoundOhneGezielt(opts);
}

/**
 * ★ GEZIELT ÜBEN (13.11.2026): die Runde mit gewählten Zeichen. Zuerst die gewöhnliche Runde mit den Zeichen im Fokus (der
 * Korpus-Rang zieht Zeilen mit dem Zeichen nach vorn - echte Sätze vor Drill); fehlen so Zeilen mit dem Zeichen (Sonderzeichen
 * wie `§ @ €` stehen kaum im Korpus), ersetzen Drill-Zeilen die Zeilen ohne Zeichen - dieselben Vorlagen wie bei einer neuen
 * Taste (`charDrillLine`, `wordDrillZeilen`). Die Runde wird dadurch nie kürzer oder leer. Bei `nur` besteht jede Zeile aus
 * den gewählten Zeichen und Leerzeichen.
 */
function gezielteRunde(opts: AdaptiveOptions, g: NonNullable<AdaptiveOptions["gezielt"]>): RoundLine[] {
  const lang: Lang = opts.lang ?? "de";
  const count = opts.count ?? 12;
  const zeichen = [...new Set(g.zeichen.map((z) => kleinFuer(z, lang)).filter((z) => [...z].length === 1))];
  if (zeichen.length === 0) return adaptiveRoundOhneGezielt(opts);
  const ctx = gezielteZeilenBauer(opts, lang, zeichen);
  const hatZeichen = (t: string): boolean => [...kleinFuer(t, lang)].some((c) => zeichen.includes(c));
  if (g.anteil === "nur") {
    return Array.from({ length: count }, (_, i) => {
      const text = ctx.nur(i);
      return { text, source: null, art: artFuerDrill(text) } as RoundLine;
    });
  }
  // Die Zeilen mit gewähltem Zeichen werden REIHUM auf die Zeichen verteilt (Zeile 1 trägt A, Zeile 2 B, ...): jedes Zeichen kommt
  // etwa gleich oft vor, nicht das häufigste im Korpus (das `?`) auf Kosten der seltenen (ß, ö). Der Fokus-Rang des gewöhnlichen
  // Rundenbaus bleibt AUS - er überschwemmte die Runde mit dem häufigsten Zeichen.
  const basis = g.anteil === "viel" ? [] : adaptiveRoundOhneGezielt({ ...opts, gezielt: undefined });
  const gesamt = Math.max(1, g.anteil === "viel" ? count : basis.length || count);
  const ziel = g.anteil === "viel" ? gesamt : Math.min(gesamt, Math.ceil(gesamt / 3));
  const benutzt = new Set<number>();
  const gezielte: RoundLine[] = [];
  for (let k = 0; k < ziel; k++) gezielte.push(ctx.zeile(zeichen[k % zeichen.length], benutzt));
  // Der Rest der Runde (nur „wenig"): gewöhnliche Zeilen, solche ohne gewähltes Zeichen zuerst.
  const rest = [...basis.filter((l) => !hatZeichen(l.text)), ...basis.filter((l) => hatZeichen(l.text))].slice(0, gesamt - ziel);
  const runde = [...gezielte, ...rest];
  while (runde.length < gesamt) runde.push(ctx.zeile(zeichen[runde.length % zeichen.length], benutzt));
  return shuffle(runde);
}

/** Drill-Zeilen für gewählte Zeichen: mit dem Zeichen (`mit`) oder nur aus den gewählten Zeichen (`nur`). */
function gezielteZeilenBauer(opts: AdaptiveOptions, lang: Lang, zeichen: string[]) {
  const intro = opts.introduced;
  const { letters, puncts, digits, symbols, nurErlaubt } = rundenEinheiten(intro, opts.lernweg);
  const allowedLetters = letters.length ? letters : [...heimZeichenDesWeges(opts.lernweg)];
  const extras = [...puncts, ...digits, ...symbols];
  const hasShift = opts.shift ?? intro.includes(SHIFT_UNIT);
  const stufe: Stufe = opts.stufe ?? VORGABE_STUFE;
  const allowedAll = new Set([...allowedLetters, ...extras, ...nurErlaubt]);
  const wordPool = filterWords(allowedAll, [...wordBase(lang), ...stufeVocab(lang, stufe)], lang).filter((w) => w.length <= 7);
  const word = (): string => caseWord(wordPool.length ? pick(wordPool) : pick(allowedLetters) + pick(allowedLetters), hasShift, lang);
  const digitGroup = (): string => {
    if (!digits.length) return word();
    let s = "";
    for (let i = 0, len = 1 + Math.floor(Math.random() * 3); i < len; i++) s += pick(digits);
    return s;
  };
  const hat = (t: string, c: string): boolean => [...kleinFuer(t, lang)].includes(c);
  const mit = (c: string): string => {
    if (!extras.includes(c)) {
      // Buchstabe, Totaste oder ein Zeichen, das eine Totaste ergibt (á, ê): Wörter mit dem Zeichen (Wort-Fokus).
      const istBuchstabe = letters.includes(c);
      for (let v = 0; v < 6; v++) {
        const z = wordDrillZeilen([...allowedAll], hasShift, stufe, istBuchstabe ? [c] : [], 1, false, lang, true, v < 3 ? undefined : 1, istBuchstabe ? [] : [c])[0];
        if (z?.text && hat(z.text, c)) return z.text;
      }
    } else {
      for (let v = 0; v < 6; v++) {
        const t = charDrillLine(c, word, digitGroup, hasShift, stufe, allowedAll, lang);
        if (hat(t, c)) return t;
      }
    }
    return `${word()} ${c}${c} ${word()}`; // letzter Ausweg: das Zeichen kommt auf jeden Fall vor
  };
  /** Zeile nur aus den gewählten Zeichen: 3-5 Gruppen zu 1-3 Zeichen; ab zwei Zeichen kommt jedes reihum dran. */
  const nur = (i: number): string => {
    const gruppen = 3 + Math.floor(Math.random() * 3);
    const teile: string[] = [];
    for (let k = 0; k < gruppen; k++) {
      const len = 1 + Math.floor(Math.random() * 3);
      let t = "";
      for (let j = 0; j < len; j++) t += zeichen.length > 1 && j === 0 ? zeichen[(i + k) % zeichen.length] : pick(zeichen);
      teile.push(t);
    }
    return teile.join(" ");
  };
  const korpus = corpusEntriesFor({
    stufe,
    allowed: allowedAll,
    lang,
    lernweg: opts.lernweg,
    franzVariante: opts.franzVariante,
    esVariante: opts.esVariante,
    umschalt: hasShift,
  }).filter((e) => !opts.exclude?.has(e.index));
  const gesehen = (e: CorpusEntry): boolean => (opts.seen ? seenHas(opts.seen, e.index) : false);
  /** Eine Zeile für das Zeichen `c`: erst ein echter Korpus-Satz mit ihm (ungesehen vor gesehen, nie doppelt), sonst Drill. */
  const zeile = (c: string, benutzt: Set<number>): RoundLine => {
    const passend = korpus.filter((e) => !benutzt.has(e.index) && hat(e.text, c));
    const e = [...shuffle(passend.filter((x) => !gesehen(x))), ...shuffle(passend.filter(gesehen))][0];
    if (e) {
      benutzt.add(e.index);
      return { text: e.text, source: e.index, art: "text" };
    }
    const text = mit(c);
    return { text, source: null, art: artFuerDrill(text) };
  };
  return { mit, nur, zeile };
}

function adaptiveRoundOhneGezielt(opts: AdaptiveOptions): RoundLine[] {
  const runde = adaptiveRoundInSprache(opts);
  // ★★★ D1 Nr. 18 (28.09.2026, Entscheidung Johannes): „die Tastaturfolge der
  // 1. Sprache hat Vorrang". Übt ein Kind auf einem Weg mit Hauptsprache
  // (fr/es) ENGLISCH, und eine Fokus-Einheit kommt in der englischen Runde
  // gar nicht vor (Totasten ´ ^ ¨, ¿ ¡, der französische Apostroph - im
  // Englischen gibt es sie nicht oder erst mit viel mehr Buchstaben), dann
  // übt DIESE Runde in der Hauptsprache. Sonst würde die neue Taste nie
  // getippt, bliebe „neu" und hielte irgendwann den Fortschritt an
  // (gemessen: pruefstand/d1/m18-englisch-auf-weg.mts). Auf Weg „de"/„en",
  // in der Hauptsprache selbst und ohne Fokus ändert sich nichts.
  const lang: Lang = opts.lang ?? "de";
  const haupt = lernwegDef(opts.lernweg).hauptsprache;
  if (!haupt || lang === haupt || !opts.focus?.length) return runde;
  const fehlt = opts.focus.some(
    (u) =>
      u !== SHIFT_UNIT &&
      !runde.some((l) => nurFocusZeichen([u]).some((c) => l.text.includes(c) || l.text.includes(grossFuer(c, lang)))),
  );
  return fehlt ? adaptiveRoundInSprache({ ...opts, lang: haupt }) : runde;
}

function adaptiveRoundInSprache(opts: AdaptiveOptions): RoundLine[] {
  const intro = opts.introduced;
  const { letters, puncts, digits, symbols, nurErlaubt } = rundenEinheiten(intro, opts.lernweg);
  // ★ G3a-SCHRIFT (25.10.2026, Falle 41): die Heimtasten des Weges (KeyF/KeyJ seiner Haupttastatur) - f j auf jeder
  // lateinischen Tastatur, о т auf der bulgarischen, φ ξ auf der griechischen (heimtasten.ts).
  const allowedLetters = letters.length ? letters : [...heimZeichenDesWeges(opts.lernweg)];
  const hasShift = opts.shift ?? intro.includes(SHIFT_UNIT);
  const extras = [...puncts, ...digits, ...symbols];
  const stufe: Stufe = opts.stufe ?? VORGABE_STUFE;
  const lang: Lang = opts.lang ?? "de";
  const count = opts.count ?? 12;
  const focusAll = opts.focus ?? [];
  const letterFocus = focusAll.filter((c) => allowedLetters.includes(c));
  const extraFocus = focusAll.filter((c) => extras.includes(c));
  // ★ M1 (26.09.2026): Fokus auf eine Einheit, die nur ERLAUBT ist (Totaste,
  // Apostroph auf Weg „fr") - sie bekommt keine Drill-Zeile, aber die Zeilen,
  // in denen sie vorkommt, kommen zuerst. Eine Totaste steckt dabei in ihren
  // zusammengesetzten Zeichen („^" in fête, „¨" in Noël) - im Text steht sie
  // nie allein. Wege „de"/„en": leer, nichts ändert sich.
  const nurFocus = focusAll.filter((c) => nurErlaubt.includes(c));
  // ★ F8-it: davon die Einheiten, die in einem WORT selbst stehen (der Apostroph) - Totasten (^ ¨) stecken nur in ihren
  // zusammengesetzten Zeichen und haben darum keinen Platz in einem Wort-Fokus.
  // ★ F8-tr (03.10.2026): eine Totaste, deren Wege-Ziele der Weg kennt (`LernwegDef.totastenZiele`: tr `^` ⇒ â î û), zieht die Wörter
  // mit diesen Buchstaben in den Fokus - solange es keinen Korpus gibt, der sie trägt (T), wäre `^` in „Mein Training" nie zu üben
  // (die Einheit hat keine Zeichen-Zeile und steckt im Text nur in â î û). Wege ohne `totastenZiele` (fr) bleiben, wie sie waren.
  const totastenZielBuchstaben = nurFocus.flatMap((u) => lernwegDef(opts.lernweg).totastenZiele?.[u] ?? []);
  const wortZeichenFokus = [...nurFocus.filter((u) => !KOMBIZEICHEN.some((k) => k.tot === u)), ...totastenZielBuchstaben];
  const capEmphasis = hasShift && focusAll.includes(SHIFT_UNIT);
  const seen = opts.seen;

  // Korpus-EINTRÄGE (mit Ledger-Index), die vollständig zu den freigeschalteten
  // Tasten passen — sinnvolle Texte so früh wie möglich, ohne je eine ungelernte
  // Taste zu verlangen (fitText). Passt noch nichts (ganz früh, T0), bleibt der
  // Pool leer → es wird mit Wörtern/Pseudowörtern geübt (ehrliches Fingertraining).
  const allowedAll = new Set([...allowedLetters, ...extras, ...nurErlaubt]);
  // TN-E2: vom Aufrufer beigesteuerte Arc-Zeilen meiden (kein Doppel in der Runde).
  const corpusPool = corpusEntriesFor({
    stufe,
    allowed: allowedAll,
    lang,
    lernweg: opts.lernweg,
    franzVariante: opts.franzVariante,
    esVariante: opts.esVariante,
    umschalt: hasShift, // ★ D-2
  }).filter((e) => !opts.exclude?.has(e.index));
  // Texte, die eine gerade schwache/neue Taste enthalten, kommen zuerst — Wackeliges
  // wird WEITER geübt, aber im sinnvollen Satz. Und: UNGESEHENES vor Gesehenem
  // (No-Repeat). Reihenfolge: [ungesehen+Fokus, ungesehen, gesehen+Fokus, gesehen].
  const focusSet = new Set([...letterFocus, ...extraFocus, ...nurFocusZeichen(nurFocus)]);
  const hasFocusChar = (s: string): boolean =>
    focusSet.size > 0 && [...kleinFuer(s, lang)].some((c) => focusSet.has(c));
  // Zeilen, die das schwache SATZ-/Sonderzeichen wirklich enthalten („Wo ist der
  // Hund?" statt „Hund Katze?"). Sie kommen vor allen anderen — so wird das
  // Zeichen im SINNVOLLEN Satz geübt statt im mechanischen Drill.
  const hasFocusExtra = (s: string): boolean =>
    extraFocus.length > 0 && extraFocus.some((u) => s.includes(u));
  const isSeen = (e: CorpusEntry): boolean => (seen ? seenHas(seen, e.index) : false);
  const rank = (list: CorpusEntry[]): CorpusEntry[] => {
    if (focusSet.size === 0) return shuffle(list);
    const withExtra = list.filter((e) => hasFocusExtra(e.text));
    const rest = list.filter((e) => !hasFocusExtra(e.text));
    return [
      ...shuffle(withExtra),
      ...shuffle(rest.filter((e) => hasFocusChar(e.text))),
      ...shuffle(rest.filter((e) => !hasFocusChar(e.text))),
    ];
  };
  const unseenPool = rank(corpusPool.filter((e) => !isSeen(e)));
  const seenPool = rank(corpusPool.filter(isSeen));
  // Reihum durch die Bausteine — erst alle ungesehenen (kein Doppel in der Runde),
  // dann als Eimer-Reset die gesehenen. `null`, sobald alles verbraucht ist.
  const corpusOrder = [...unseenPool, ...seenPool];
  let ci = 0;
  const nextCorpus = (): CorpusEntry | null =>
    ci < corpusOrder.length ? corpusOrder[ci++] : null;

  const wordLine = (): RoundLine => {
    // ★★★★★ ES-P7a-Behebung (27.09.2026, M2): `allowedAll` statt `allowedLetters`
    // - Totasten-Buchstaben (á é í ó ú) landen NIE in `allowedLetters` (die
    // Einheit heisst „´", nicht „á"), darum konnte `filterWords` sie über
    // diesen Aufruf nie erkennen, selbst mit der Totasten-Prüfung. `allowedAll`
    // enthält die Totaste zusätzlich (`nurErlaubt`); Ziffern/Satzzeichen darin
    // stören nicht - sie matchen ohnehin kein Wort-Zeichen.
    // ★ F8-it: der Apostroph (nur erlaubt, keine Silben-Einheit) zieht echte Wörter mit Elision in den Fokus-Pool.
    const z = wordDrillZeilen(
      [...allowedAll], hasShift, stufe, letterFocus, 1, capEmphasis, lang, true, undefined, wortZeichenFokus,
    )[0];
    return { text: z.text, source: null, art: artFuerDrill(z.text, z.unsinn, lang) };
  };
  const corpusLine = (e: CorpusEntry): RoundLine => ({
    text: e.text,
    source: e.index,
    art: "text",
  });
  // ★★★ SPRACHEN-9 (30.10.2026): übt die Runde eine Einheit ohne eigene Zeile (Totaste, Apostroph), kommen ihre Wörter sonst nur
  // dran, wenn der Korpus erschöpft ist. Trägt der Korpus den Buchstaben kaum (el ϊ, sv é, nl é), sah das Kind ihn gemessen nie.
  // Dann ersetzt eine Wortzeile die letzte Textzeile. Nur die neun neuen Wege - die acht davor bleiben Byte für Byte.
  const mitZielZeile = (zeilen: RoundLine[]): RoundLine[] => {
    if (!istGeruestSprache(opts.lernweg) || wortZeichenFokus.length === 0) return zeilen;
    const traegtZiel = (l: RoundLine): boolean => [...kleinFuer(l.text, lang)].some((c) => wortZeichenFokus.includes(c));
    if (zeilen.some(traegtZiel)) return zeilen;
    const ersatz = wordLine();
    if (!traegtZiel(ersatz)) return zeilen; // der Tastenstand gibt kein Wort her - dann bleibt die Runde, wie sie ist
    const stelle = zeilen.map((l) => l.art === "text").lastIndexOf(true);
    if (stelle < 0) return zeilen;
    return zeilen.map((l, i) => (i === stelle ? ersatz : l));
  };

  // Gezielte Tasten-Übung (28.08.2026): reine Pseudowort-Zeilen, in denen die
  // schwachen Tasten so dicht vorkommen, wie deutscher Satztext das nie hergibt.
  // Sie ersetzen einen TEIL der Runde — der Rest bleiben echte Texte.
  const uebungsZeilenAnzahl = Math.max(
    0,
    Math.min(count, Math.floor(opts.uebungsZeilen ?? 0)),
  );
  // JE ÜBUNGSZEILE GENAU EINE TASTE — reihum durch den Fokus.
  //
  // Der Umweg über „alle Fokus-Tasten in jede Zeile" war gemessen schlechter:
  // Bei 6 Fokus-Tasten teilten sich diese dieselben 4 Zeilen, und die Wirkung
  // fiel von +28 % auf +9 %. Eine Zeile, eine Taste gibt jeder Taste in ihrer
  // Runde die volle Dichte; über mehrere Runden kommen alle dran.
  //
  // Die UMSCHALTTASTE bekommt statt Pseudowörtern einen Nomen-Drill: Pseudo-
  // wörter bleiben klein geschrieben, der ⇧-Griff käme darin SELTENER dran als
  // im normalen Text (gemessen 0,80x — die Übung hätte ausgerechnet die
  // schwächste Einheit benachteiligt).
  const uebungsLines: RoundLine[] = [];
  const uebungsZeile = (unit: string, istShift: boolean): void => {
    // ★★★★★ ES-P7a-Behebung (M2): `allowedAll` wie bei `wordLine` oben - der
    // Nomen-Drill (⇧-Griff, pseudoAnteil 0) braucht echte Wörter und darf
    // dafür auch Totasten-Buchstaben benutzen, sobald sie gelernt sind.
    const z = wordDrillZeilen(
      [...allowedAll],
      hasShift,
      stufe,
      istShift ? [] : [unit],
      1,
      istShift, // Nomen-Drill nur für den Umschalt-Griff
      lang,
      true,
      istShift ? 0 : 1, // ⇧: echte Nomen (groß) · sonst reine Pseudowörter
    )[0];
    // Der ⇧-Drill baut echte Nomen (pseudoAnteil 0), alle anderen Pseudowörter -
    // die Zeile selbst sagt, was sie geworden ist.
    if (z?.text)
      uebungsLines.push({
        text: z.text,
        source: null,
        uebung: [unit],
        art: artFuerDrill(z.text, z.unsinn, lang),
      });
  };
  if (uebungsZeilenAnzahl > 0 && focusAll.length > 0) {
    // Die Umschalttaste steht AUSSERHALB der Reihum-Auswahl: Sie ist keine
    // Buchstabentaste, und wenn sie eine Runde aussetzt, drücken die übrigen
    // (klein geschriebenen) Pseudowort-Zeilen den ⇧-Anteil sogar unter den des
    // normalen Textes (gemessen 0,87x). Sie bekommt daher immer ihre eigene Zeile.
    // EINE Zeile reicht ihr nicht: Der ⇧-Griff kommt in JEDER Zeile vor (überall
    // dort, wo ein Großbuchstabe steht), die klein geschriebenen Pseudowort-
    // Zeilen drücken seinen Anteil also mit jeder Zeile. Gemessen: mit einer
    // Nomen-Zeile 0,90x, erst mit der Hälfte der Übungszeilen kommt er über den
    // Anteil im normalen Text.
    const shiftZeilen = capEmphasis ? Math.ceil(uebungsZeilenAnzahl / 2) : 0;
    for (let i = 0; i < shiftZeilen; i++) uebungsZeile(SHIFT_UNIT, true);
    const buchstaben = shuffle(letterFocus.filter((u) => allowedLetters.includes(u)));
    for (let i = 0; uebungsLines.length < uebungsZeilenAnzahl; i++) {
      if (!buchstaben.length) break;
      uebungsZeile(buchstaben[i % buchstaben.length], false);
    }
  }
  // GELÄUFIGKEITSSCHREIBEN: eine Zeile aus echten Wörtern mit derselben
  // häufigen Buchstabenverbindung. Sie ersetzt eine Zeile der Runde, sie hängt
  // keine an - und sie fällt still aus, wenn der Tastenstand keine hergibt.
  const gelaeufigAnzahl = Math.max(
    0,
    Math.min(count - uebungsLines.length, Math.floor(opts.gelaeufigkeitsZeilen ?? 1)),
  );
  for (let i = 0; i < gelaeufigAnzahl; i++) {
    // ★ ES-W (27.09.2026): mit dem Weg - auf „es" dürfen die Wörter Akzente
    // tragen (Totaste ´), sonst fiele z. B. jede „-ción"-Zeile still aus.
    const g = gelaeufigkeitsZeile(allowedAll, {
      stufe,
      lang,
      zufall: Math.random,
      lernweg: opts.lernweg,
      umschalt: hasShift, // ★ D-2
    });
    if (!g) break;
    // Bewusst OHNE `uebung`: Das Feld erklärt Pseudowort-Zeilen („damit du
    // deine wackeligen Tasten übst"). Hier stehen echte Wörter - dieselbe
    // Erklärung wäre schlicht falsch.
    uebungsLines.push({ text: g.text, source: null, art: "woerter" });
  }

  const restCount = count - uebungsLines.length;

  // Reines Buchstaben-/Fingertraining, solange noch keine Zeichen/Ziffern dran sind
  // — jetzt aber mit Bausteinen zuerst (sobald welche passen); leerer Pool ⇒ wie
  // bisher reines Wort-/Silben-Üben (ehrliches „Fingertraining", v. a. T0).
  if (extras.length === 0) {
    const items: RoundLine[] = [...uebungsLines];
    for (let n = 0; n < restCount; n++) {
      const e = nextCorpus();
      items.push(e ? corpusLine(e) : wordLine());
    }
    return shuffle(mitZielZeile(items)).map((l) => fertigeZeile(l, lang, hasShift, opts.franzVariante, opts.esVariante));
  }

  // Wort- und Ziffern-Bausteine für die Zeichen-Zeilen (nur erlaubte Zeichen).
  const stufeWords = stufeVocab(lang, stufe);
  // ★★★★★ ES-P7a-Behebung (M2): `allowedAll` statt `allowedLetters` - siehe
  // `wordLine` oben, derselbe Grund (die Totaste steht nur in `allowedAll`).
  const allowedSet = new Set(allowedAll);
  const wordPool = filterWords(allowedSet, [...wordBase(lang), ...stufeWords], lang).filter(
    (w) => w.length <= 7,
  );
  const word = (): string => {
    const w = wordPool.length
      ? pick(wordPool)
      : pick(allowedLetters) + pick(allowedLetters);
    return caseWord(w, hasShift, lang); // dt. Nomen groß (ab Umschalt); engl. klein
  };
  const digitGroup = (): string => {
    if (!digits.length) return word();
    const len = 1 + Math.floor(Math.random() * 3);
    let s = "";
    for (let i = 0; i < len; i++) s += pick(digits);
    return s;
  };
  const charLine = (): RoundLine => {
    const unit =
      extraFocus.length && Math.random() < 0.7 ? pick(extraFocus) : pick(extras);
    const text = charDrillLine(unit, word, digitGroup, hasShift, stufe, allowedAll, lang);
    return { text, source: null, art: artFuerDrill(text) };
  };

  // Anteil gezielter „Zeichen-Zeilen" (Drill). Nicht mehr pauschal, sondern nach
  // dem, was der KORPUS wirklich hergibt (Wunsch Johannes 21.07., „Sinn vor Drill"):
  //   • „," (123–194 echte Sätze), „?" (85–124), „!", „." → es gibt reichlich
  //     sinnvolle Sätze mit genau diesem Zeichen ⇒ Drill fast ganz zurück
  //     ({@link CHAR_SHARE_SENSE}), die Runde füllen echte Sätze, die das Zeichen
  //     enthalten (siehe `rank`/`hasFocusExtra` oben).
  //   • „;" (0–4), „-", „:" und ALLE Sonderzeichen („@ § € % ( \"" = 0 Treffer im
  //     Korpus) → ohne Drill ließe sich das Zeichen gar nicht üben ⇒ Drill bleibt
  //     hoch ({@link CHAR_SHARE_DRILL}).
  // Dazwischen linear. Gezählt werden nur UNGESEHENE Zeilen: was das Kind schon
  // getippt hat, hilft ihm heute nicht mehr weiter.
  const focusOnExtra = extraFocus.length > 0;
  const charSupply = focusOnExtra
    ? corpusPool.filter((e) => !isSeen(e) && hasFocusExtra(e.text)).length
    : 0;
  const charShare = !focusOnExtra
    ? 0.14
    : CHAR_SHARE_DRILL +
      (CHAR_SHARE_SENSE - CHAR_SHARE_DRILL) *
        Math.min(1, charSupply / CHAR_CORPUS_ENOUGH);
  const items: RoundLine[] = [...uebungsLines];
  for (let n = 0; n < restCount; n++) {
    if (Math.random() < charShare) {
      items.push(charLine());
      continue;
    }
    const e = nextCorpus();
    items.push(e ? corpusLine(e) : wordLine());
  }
  return shuffle(mitZielZeile(items)).map((l) => fertigeZeile(l, lang, hasShift, opts.franzVariante, opts.esVariante));
}

/**
 * Runde für die Text-Lektionen (kind "text"): alters-gestufte Korpus-Bausteine
 * MIT Ledger-Index (`source`), damit der Aufrufer Getipptes verbucht und es
 * nicht wiederkehrt (No-Repeat-Ledger; Prüfbericht 27.07., Teil 0 Punkt 1 —
 * vorher liefen diese Lektionen mit `source: null` am Ledger vorbei und
 * wiederholten sich bei kleinem Pool sogar innerhalb der Runde).
 *
 * Auswahl wie in `letterLessonRound`: UNGESEHENE Bausteine (laut `seen`) zuerst;
 * ist alles gesehen, dienen gesehene als Eimer-Reset — aber nie ein Baustein
 * doppelt in derselben Runde. Erst wenn der GANZE Pool kleiner als die Runde
 * ist, füllen einfache Wort-Sätze auf (`source: null`, nur erlaubte Tasten).
 */
function textLessonRound(
  kinds: import("./corpus").CorpusKind[] | undefined,
  allowed: Set<string>,
  allowedArr: string[],
  shift: boolean,
  stufe: Stufe,
  count: number,
  lang: Lang,
  lernweg: Lernweg,
  seen: Uint8Array | undefined,
  exclude: Set<number> | undefined,
  franzVariante?: FranzVariante,
  esVariante?: EsVariante,
): RoundLine[] {
  // TN-E2: vom Aufrufer beigesteuerte Arc-Zeilen meiden (kein Doppel in der Runde).
  const pool = corpusEntriesFor({ stufe, allowed, kinds, lang, lernweg, franzVariante, esVariante, umschalt: shift }).filter(
    (e) => !exclude?.has(e.index),
  );
  const isSeen = (e: CorpusEntry): boolean => (seen ? seenHas(seen, e.index) : false);
  const order = [
    ...shuffle(pool.filter((e) => !isSeen(e))),
    ...shuffle(pool.filter(isSeen)),
  ];
  const items: RoundLine[] = order
    .slice(0, count)
    .map((e) => ({ text: e.text, source: e.index, art: "text" as const }));
  // Notfall-Füllung (z. B. sehr früh, wenn noch kaum etwas passt): einfache
  // Wort-Sätze aus erlaubten Tasten.
  if (items.length < count) {
    const words = filterWords(allowed, [...wordBase(lang), ...stufeVocab(lang, stufe)], lang);
    const w = () => (words.length ? pick(words) : pick(allowedArr));
    const dot = allowed.has(".");
    for (let n = items.length; n < count; n++) {
      const len = 4 + Math.floor(Math.random() * 4);
      const parts: string[] = [];
      for (let t = 0; t < len; t++) parts.push(w());
      // echter Satz (mit Punkt): Satzanfang groß; im Deutschen zusätzlich Nomen groß.
      let line = (shift ? parts.map((p) => caseWord(p, true, lang)) : parts).join(" ");
      if (dot) line += ".";
      if (shift) line = capAmAnfang(line, lang);
      // Notfall-Füllung: echte Wörter, aber kein Korpus-Satz.
      items.push({ text: line, source: null, art: artFuerDrill(line) });
    }
  }
  return shuffle(items);
}

function numberItems(
  allowedArr: string[],
  focus: string[],
  count: number,
): string[] {
  const digits = allowedArr.filter((c) => c >= "0" && c <= "9");
  const focusD = focus.filter((c) => c >= "0" && c <= "9");
  const pool = digits.length
    ? digits
    : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const items: string[] = [];
  for (let n = 0; n < count; n++) {
    const groups = 2 + Math.floor(Math.random() * 2); // 2–3 Zahlengruppen
    const parts: string[] = [];
    for (let g = 0; g < groups; g++) {
      const len = 2 + Math.floor(Math.random() * 3);
      let s = "";
      for (let i = 0; i < len; i++)
        s += focusD.length && Math.random() < 0.5 ? pick(focusD) : pick(pool);
      parts.push(s);
    }
    items.push(parts.join(" "));
  }
  return items;
}

function punctItems(
  newKeys: string[],
  allowed: Set<string>,
  shift: boolean,
  count: number,
  lang: Lang = "de",
): string[] {
  const words = filterWords(allowed, wordBase(lang), lang);
  // ★ E10c (26.09.2026): Tabelle statt Ternäre - vorher fiel „fr" auf den
  // DEUTSCHEN Notnagel zurück, wenn (sehr früh) noch keine passenden Wörter
  // frei waren.
  const FALLBACK_WORDS: Record<Lang, string[]> = {
    de: ["das", "ist", "gut", "wer", "wie"],
    en: ["the", "is", "good", "who", "how"],
    fr: ["le", "et", "bon", "qui", "vite"],
    // ★ ES-F6 (27.09.2026): echte spanische Wörter statt „vorerst Englisch"
    // (ES-F2) - `pick()` unten braucht mindestens ein Wort, eine leere Liste
    // wie bei WORD_BASE würde hier abstürzen. Ohne Akzent (auch ganz früh
    // tippbar, bevor die Akzent-Totaste gelernt ist - dieselbe Vorsicht wie
    // bei „quien" statt „quién").
    es: ["el", "es", "bien", "quien", "como"],
    // ★ F6-it (02.10.2026): echte italienische Wörter, ohne Akzent und ohne `h` (auch ganz früh und vor `g h b z` tippbar).
    it: ["il", "la", "bene", "come", "sono"],
    // ★ F6-pl (03.10.2026): echte polnische Wörter aus der Grundreihe `f j d k s l a` (auch ganz früh tippbar: `jak`, `dla`, `da`).
    pl: ["jak", "dla", "ja", "daj", "da"],
    // ★ F6-tr (03.10.2026): echte türkische Wörter, nur mit Buchstaben bis zum `u` der Reihenfolge (die Satzzeichen-Lektionen kommen nach
    // den ersten 19 Buchstaben und ⇧, aber vor `v p c ö`) - und ohne `ı`/`ş`, deren Einheit nicht jeder Stand hat.
    tr: ["bir", "bu", "ne", "iyi", "ben"],
    // ★ F6-cs (03.10.2026): echte tschechische Wörter, nur aus der Grundreihe `f j d k s l a ů` (auch ganz früh schreibbar).
    cs: ["dal", "jak", "sada", "kasa", "sůl"],
    // ★★★ GEN-HAUPTSPRACHE (29.10.2026): eigene Wörter statt des englischen Rückfalls (G2-NEUN) - jedes steht im Wortschatz der
    // Sprache (`words<Xx>.ts`) und ist mit den Buchstaben VOR der Umschalttaste des Weges schreibbar (gemessen), also in jeder
    // Satzzeichen-Lektion. Ohne Akzent, wo die Sprache eine Totaste dafür braucht.
    bg: ["то", "на", "не", "ние", "има"],
    el: ["και", "να", "το", "τι", "δεν"],
    hu: ["az", "és", "nem", "igen", "itt"],
    nl: ["de", "en", "het", "is", "dat"],
    pt: ["de", "um", "sim", "mas", "tudo"],
    br: ["de", "um", "sim", "mas", "tudo"],
    ro: ["și", "de", "nu", "cu", "un"],
    sv: ["det", "är", "en", "inte", "ska"],
    uk: ["та", "не", "він", "до", "і"],
  };
  const fallback = FALLBACK_WORDS[lang];
  const w = () =>
    caseWord(words.length ? pick(words) : pick(fallback), shift, lang);
  const marks = newKeys.length ? newKeys : ["?", "!", ".", ","];
  const items: string[] = [];
  // ★ S4 (26.09.2026): Französisch nimmt die Vorlagen von `charDrillLine` -
  // die einfache Form unten machte aus `" ( ) -` der Lektion
  // „fr-ponctuation-2" Zeilen wie „mot( mot" und „mot" mot". Deutsch/Englisch
  // unverändert (Golden-Test).
  // ★ ES-S (27.09.2026): Spanisch ebenso - seit es Lektionen für Weg „es"
  // gibt, lief die Lektion „es-interrogacion" durch die einfache Form unten
  // und machte „Estaban¿ dinero" (halbes Paar, ¿ am Wortende); die Vorlagen
  // von `charDrillLine` sind paarfest (ES-P7a M3).
  if (MIT_ZEICHENVORLAGEN.has(lang)) {
    for (let n = 0; n < count; n++)
      items.push(charDrillLine(pick(marks), w, w, shift, VORGABE_STUFE, allowed, lang));
    return shuffle(items);
  }
  for (let n = 0; n < count; n++) {
    const m = pick(marks);
    let line: string;
    if (m === "?") line = `${w()} ${w()}?`;
    else if (m === "!") line = `${w()}!`;
    else if (m === ":") line = `${w()}: ${w()}`;
    else if (m === ";") line = `${w()}; ${w()}`;
    else line = `${w()}${m} ${w()}`;
    items.push(shift ? capAmAnfang(line, lang) : line);
  }
  return shuffle(items);
}

/**
 * Zeilen für die Lektion „Satz- & Sonderzeichen" (kind "symbols"): gezieltes Üben
 * der Sonderzeichen in den realistischen Mini-Kontexten ({@link charDrillLine}),
 * aufgelockert mit den schon gelernten Satzzeichen. Betont die NEUEN Zeichen der
 * Lektion; nutzt für Wörter/Ziffern nur erlaubte Tasten.
 */
function symbolItems(
  newKeys: string[],
  allowedArr: string[],
  shift: boolean,
  count: number,
  lang: Lang,
  stufe: Stufe,
  lernweg?: Lernweg,
): string[] {
  const allowed = new Set(allowedArr);
  // ★ M1 (26.09.2026): die Listen des Weges (siehe {@link EIGENE_LISTEN}) - auf
  // Weg „fr" fiel „_" der Lektion „fr-speciaux-1" sonst heraus.
  const def = lernweg && EIGENE_LISTEN[lernweg] === true ? lernwegDef(lernweg) : null;
  const punct = (def ? def.punctOrder : PUNCT_ORDER).filter((c) => allowed.has(c));
  const symbolListe = def ? def.symbolOrder : SYMBOL_ORDER;
  const symbols = newKeys.filter((c) => symbolListe.includes(c) && allowed.has(c));
  // Schwerpunkt auf den Sonderzeichen (doppelt gewichtet), Satzzeichen beimischen.
  const marks = symbols.length ? [...symbols, ...symbols, ...punct] : punct;
  const pool = marks.length ? marks : [".", ",", "?", "!"];

  const letters = allowedArr.filter((c) => istWortBuchstabe(c));
  const allowedLetters = new Set(letters);
  const stufeWords = stufeVocab(lang, stufe);
  const wordPool = filterWords(allowedLetters, [
    ...wordBase(lang),
    ...stufeWords,
  ], lang).filter((w) => w.length <= 8);
  const digits = allowedArr.filter((c) => c >= "0" && c <= "9");
  const fallbackLetter = letters.length ? letters : ["a"];
  const word = (): string =>
    caseWord(
      wordPool.length ? pick(wordPool) : pick(fallbackLetter) + pick(fallbackLetter),
      shift,
      lang,
    );
  const digitGroup = (): string => {
    if (!digits.length) return word();
    const len = 1 + Math.floor(Math.random() * 3);
    let s = "";
    for (let i = 0; i < len; i++) s += pick(digits);
    return s;
  };

  const items: string[] = [];
  for (let n = 0; n < count; n++)
    items.push(charDrillLine(pick(pool), word, digitGroup, shift, stufe, allowed, lang));
  return shuffle(items);
}
