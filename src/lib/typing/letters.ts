/**
 * Individuelle (adaptive) Lernumgebung des 10-Finger-Trainers „Tastenflow":
 * Pro-Zeichen-Mastery + buchstabenweise Freischaltung im Stil von keybr.
 *
 * Idee: Das Programm misst für JEDES Kind jeden einzelnen Buchstaben (wie oft
 * richtig/falsch, wie schnell). Ein neuer Buchstabe kommt erst dazu, wenn die
 * bisherigen „sitzen" (treffsicher UND zügig). Die Übungen betonen automatisch
 * die schwächsten Buchstaben — so entsteht für jedes Kind ein eigener Lernweg.
 * Siehe [[project_zehnfinger_trainer]], [[feedback_data_transparency]].
 */
import type { LetterStat } from "./progress";
import { LEVEL_MAX, levelTargetCpm } from "./level";
import {
  baseKeyForChar,
  charAccess,
  charLabel,
  fingerForChar,
  fingerName,
  rowName,
  spokenLabel,
} from "./fingers";
import { activeLayoutId, layoutById, layoutSprache, onlyExistingKeys, type LayoutId } from "./layouts";
import { fingerWegFuer, richtungInWorten } from "./fingerWeg";
import type { Lang } from "./account";
// ★ E1 (24.09.2026): Jede Reihenfolge-Funktion bekommt den Lernweg des Kindes
// als PFLICHT-Parameter (Bauplan englischer Lehrgang §2.3). Die Tabelle liest
// umgekehrt die Konstanten hier - darum nur INNERHALB von Funktionen benutzen,
// nie auf oberster Ebene (Zirkel-Falle, siehe lernweg.ts).
import { lernwegDef, type Lernweg, type LernwegDef } from "./lernweg";
import { istTotasteDerListen, kombizeichenFuerLayout } from "./totasten";
import type { BedienSprache } from "@/lib/bedienSprache";
import { buchstabeDerSprache, grossFuer, istGeruestSprache, kleinFuer, mitRueckfallEn } from "./sprachRegister";

/**
 * Einführungs-Reihenfolge der Buchstaben für „Mein Training".
 *
 * Aufbau (recherchiert, siehe [[project_zehnfinger_trainer]]):
 *  1. GRUNDREIHE zuerst (f j d k s l a ö) — der tastbare Fingeranker (F/J-Noppen);
 *     aus diesen 8 Tasten gibt es kaum echte Wörter, hier sind Pseudowörter okay.
 *  2. Danach NACH HÄUFIGKEIT statt „Reihe für Reihe": die häufigsten deutschen
 *     Buchstaben zuerst (e n i r t h …, Duden/Wikipedia-Häufigkeit), damit schon
 *     nach 1–2 neuen Tasten echte Wörter entstehen (keybr-Prinzip auf Grundreihen-
 *     Fundament). Seltene Buchstaben + Umlaute/ß zuletzt.
 *  3. EINE bewusste Abweichung von der deutschen Häufigkeit: das `o` steht direkt
 *     hinter dem `h` und damit VOR `u c g m b w` (Charge O1, 21.08.2026). Nach
 *     reiner deutscher Häufigkeit stünde es auf Platz 19 (2,5 %); im ENGLISCHEN
 *     sind es 7,5 %, und an ihm hängen to, of, on, not, no, one, for. Gemessene
 *     Schreibbarkeit (Anteil der häufigsten Wörter, der bei n Tasten tippbar ist):
 *
 *              16 Tasten   17 Tasten   18 Tasten   ab 20 Tasten
 *       DE     44 → 44 %   52 → 51 %   53 → 62 %   74 → 74 %
 *       EN     31 → 42 %   32 → 47 %   33 → 49 %   61 → 61 %
 *
 *     Deutsch verliert an der Sprosse 17 einen Prozentpunkt und gewinnt an 18
 *     neun; Englisch gewinnt überall zweistellig. Ab 20 Tasten ist die
 *     Buchstabenmenge identisch — der Effekt lebt in den Sprossen 16 bis 19.
 *     Die T2-MENGE (`LETTERS_BEFORE_SHIFT` … `T2_LETTER_END`) ändert sich dabei
 *     NICHT: alt `h u c g m o b w`, neu `h o u c g m b w` — dieselben acht
 *     Buchstaben. Darum bleibt jedes `minTier` im Korpus unberührt.
 * Nur Buchstaben; Satzzeichen/Ziffern bleiben den Lektionen vorbehalten.
 */
export const LETTER_ORDER: string[] = [
  // Grundreihe (Fingeranker)
  "f", "j", "d", "k", "s", "l", "a", "ö",
  // häufigste Buchstaben zuerst → früh echte Wörter
  "e", "n", "i", "r", "t", "h",
  // das `o` VORGEZOGEN (Charge O1, 21.08.2026) — siehe den Absatz unten
  "o", "u",
  // mittlere Häufigkeit
  "c", "g", "m", "b", "w",
  // seltener
  "z", "v", "p",
  // Umlaute + seltenste Buchstaben + scharfes s
  "ä", "ü", "x", "y", "q", "ß",
];

/**
 * Sonder-„Einheit" für die Großschreibung. Sie ist keine eigene Taste, sondern
 * ein Lernschritt: Sobald sie freigeschaltet ist, kommen Großbuchstaben in den
 * Übungen vor; gemessen wird sie über die Umschalt-Anschläge (siehe
 * TypingSession). Steht in der Reihenfolge direkt nach dem Alphabet.
 */
export const SHIFT_UNIT = "⇧";

/** Satzzeichen, in adaptiver Einführungsreihenfolge (häufig → seltener). */
export const PUNCT_ORDER: string[] = [".", ",", "-", "?", "!", ":", ";"];

/** Ziffern der Zahlenreihe (NICHT der separate Ziffernblock). */
export const DIGIT_ORDER: string[] = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
];

/**
 * Sonderzeichen — die im Alltag/Beruf wichtigen, in sinnvoller Reihenfolge.
 * Am Ende die für Mathematik, Chemie und Technik wichtigen Klammern und Zeichen
 * (`{ } [ ] | ^ ~ °`) — fest verankert, weil ohne sie z. B. Mengen, Intervalle,
 * Beträge, Potenzen und Grad-Angaben nicht geschrieben werden können.
 */
export const SYMBOL_ORDER: string[] = [
  "(", ")", "\"", "'", "+", "*", "/", "=", "%", "&", "@", "€", "#", "$", "§", "<", ">",
  "[", "]", "{", "}", "|", "^", "~", "°",
];

/**
 * So viele Buchstaben kommen in „Mein Training" VOR der Umschalttaste. Die echte
 * Großschreibung kommt damit FRÜH — nicht erst nach dem ganzen Alphabet, sondern
 * sobald genug häufige Buchstaben sitzen, dass echte (groß zu schreibende) Nomen
 * entstehen. Das ist wichtig, weil die Umschalttaste nur an echten Großbuchstaben
 * geübt werden kann — mit zu wenig Buchstaben gäbe es keine Nomen und nichts zu
 * üben. Gewählt: Grundreihe (8) + die fünf häufigsten weiteren Buchstaben
 * (e n i r t) = 13. Davor erscheint Groß weiterhin über die Auto-Großschreibung.
 * (Wunsch Johannes: bald die echte Umschalttaste statt langer Auto-Hilfe.)
 */
export const LETTERS_BEFORE_SHIFT = 13;

/**
 * ★★★ D-1 (28.09.2026, Didaktik-Synthese `recherche-didaktik-2026-09-27/
 * SYNTHESE-UND-ENTSCHEIDUNGEN.md`): Punkt und Komma kommen auf JEDEM Weg
 * direkt NACH der Umschalttaste - „ein Satz = Grossbuchstabe + Punkt", beides
 * lernt das Kind zusammen. Bis hierher kamen sie erst nach allen Buchstaben;
 * diese Regel stand in keinem der gefundenen Lehrgänge (de: sechs von sechs
 * bringen `.` und `,` zwischen den Buchstaben; en: NSW mit der unteren Reihe;
 * es: mit der unteren Reihe; fr: der Punkt liegt auf AZERTY auf Maj + ;).
 * Die übrigen Satzzeichen bleiben, wo sie waren.
 */
export const PUNKT_UND_KOMMA: readonly string[] = [".", ","];

/**
 * Die Einführungsreihenfolge eines Weges aus seinen Bausteinen - EINE
 * Rechnung für alle vier Wege (lernweg.ts baut „en"/„fr"/„es" damit):
 * erste Buchstaben → `⇧` → `.` `,` (D-1) → restliche Buchstaben → übrige
 * Satzzeichen → Ziffern → Sonderzeichen.
 */
export function baueEinfuehrung(
  letters: readonly string[],
  vorShift: number,
  punct: readonly string[],
  digits: readonly string[],
  symbols: readonly string[],
  /**
   * ★ F4-cs (02.10.2026): welche Satzzeichen direkt nach `⇧` stehen (Vorgabe {@link PUNKT_UND_KOMMA}). Tschechisch: `. , ?`
   * (`LernwegDef.punktNachShift`). Ein Weg ohne dieses Feld ruft ohne den Parameter auf - Byte für Byte die Folge von vorher.
   */
  nachShift: readonly string[] = PUNKT_UND_KOMMA,
): string[] {
  const frueh = nachShift.filter((c) => punct.includes(c));
  return [
    ...letters.slice(0, vorShift),
    SHIFT_UNIT,
    ...frueh,
    ...letters.slice(vorShift),
    ...punct.filter((c) => !frueh.includes(c)),
    ...digits,
    ...symbols,
  ];
}

/**
 * ★★★★★ DIE STARTPUNKT-ZÄHLUNG (D-1, 28.09.2026) - die Einführungsreihenfolge,
 * wie sie VOR D-1 war: Satzzeichen erst nach allen Buchstaben.
 *
 * Warum es sie gibt: Ein Startpunkt ist eine ANZAHL (`startUnits` am Konto
 * und an der Klasse, `units` im Vermerk des Fortschritts, `units` in der
 * Excel-Vorlage) - „die ersten 31 Einheiten". Diese Zahlen stehen live am
 * Server. Wer die Reihenfolge ändert, ändert, WELCHE Tasten „die ersten 31"
 * sind: aus „alle Buchstaben mit Grossschreibung" würde „alle Buchstaben
 * ausser q und ß, dafür Punkt und Komma". Umschreiben lassen sich die
 * gespeicherten Zahlen nicht (kein Merkmal sagt, in welcher Zählung eine Zahl
 * geschrieben wurde).
 *
 * ⇒ Eine Startpunkt-Zahl wird darum IMMER in dieser Folge abgezählt - vorher
 * wie nachher. Die abgezählte Tastenmenge wird danach in die Lehrgangs-
 * Reihenfolge ({@link INTRO_ORDER}) gebracht. So bedeutet jeder gespeicherte
 * und jeder neu gewählte Startpunkt dieselben Tasten wie vor D-1 (Wächter
 * `tests/tastenflow-d1-punkt-komma.test.ts`). Gelesen wird sie NUR über
 * `startpunktFolge()` - für Startpunkte und die Niveaus der Tippchallenge.
 * Nie für die Frage, welche Taste als nächste kommt.
 */
export function baueStartpunktFolge(
  letters: readonly string[],
  vorShift: number,
  punct: readonly string[],
  digits: readonly string[],
  symbols: readonly string[],
): string[] {
  return [
    ...letters.slice(0, vorShift),
    SHIFT_UNIT,
    ...letters.slice(vorShift),
    ...punct,
    ...digits,
    ...symbols,
  ];
}

/**
 * Vollständige Einführungsreihenfolge der adaptiven Umgebung:
 * erste Buchstaben → Großschreibung (früh) → Punkt und Komma (D-1) →
 * restliche Buchstaben → übrige Satzzeichen → Zahlen → Sonderzeichen.
 * „introduced" enthält die bereits freigeschalteten Einheiten in dieser Folge.
 */
export const INTRO_ORDER: string[] = baueEinfuehrung(
  LETTER_ORDER,
  LETTERS_BEFORE_SHIFT,
  PUNCT_ORDER,
  DIGIT_ORDER,
  SYMBOL_ORDER,
);

/** Die Startpunkt-Zählung des Weges „de" - siehe {@link baueStartpunktFolge}. */
export const STARTPUNKT_FOLGE: readonly string[] = baueStartpunktFolge(
  LETTER_ORDER,
  LETTERS_BEFORE_SHIFT,
  PUNCT_ORDER,
  DIGIT_ORDER,
  SYMBOL_ORDER,
);

/**
 * Mit so vielen Einheiten startet die adaptive Umgebung „Mein Training" für einen
 * TOTALEN Anfänger: nur F und J — die beiden Zeigefinger-Tasten mit den tastbaren
 * Höckern. Jede weitere Taste kommt danach EINZELN dazu, sobald die vorige sitzt
 * (Zeichen für Zeichen, nicht die ganze Grundreihe auf einmal — Wunsch Johannes).
 * Eine Lehrkraft kann ein Kind über die Startpunkte (siehe {@link startPoints})
 * weiter vorn beginnen lassen.
 */
export const INITIAL_LETTERS = 2;

/** Die vollständige Grundreihe (f j d k s l a ö) — als benannter Startpunkt. */
export const HOME_ROW_LETTERS = 8;

/**
 * ★ G2b-1 (02.10.2026, Türkisch T7): ein Zeichen GROSS, wie die Sprache des WEGES
 * es schreibt - ohne Weg wie die eingestellte Tastatur (`KeyboardLayout.sprache`,
 * Vorgabe Deutsch = die gewöhnliche `toUpperCase()`). Türkisch: „i" ⇒ „İ",
 * „ı" ⇒ „I". Für de/en/fr/es Byte für Byte `toUpperCase()`.
 */
function grossImWeg(zeichen: string, lernweg?: Lernweg): string {
  return grossFuer(zeichen, lernweg ?? layoutSprache());
}

/**
 * ★ G2b-1 (02.10.2026): der SCHLÜSSEL, unter dem ein getipptes (oder erwartetes)
 * Zeichen in der Tasten-Statistik des Kindes zählt - der Kleinbuchstabe IN DER
 * SPRACHE der Übung. Türkisch: „I" ⇒ „ı", „İ" ⇒ „i" (ein Schlüssel, der in der
 * Buchstaben-Reihenfolge des Weges steht); die gewöhnliche `toLowerCase()` machte
 * aus „İ" zwei Zeichen („i" + Kombinationspunkt) - einen Schlüssel, den keine
 * Einheit trägt - und zählte jedes „I" auf „i". de/en/fr/es: Byte für Byte
 * `toLowerCase()`. EINE Stelle für `TypingSession` und den Wächter.
 */
export function statistikSchluessel(zeichen: string, sprache: Lang): string {
  return kleinFuer(zeichen, sprache);
}

/** Art einer Lern-Einheit (für Anzeige + Generator). */
export type UnitKind = "buchstabe" | "shift" | "satzzeichen" | "ziffer" | "sonderzeichen";

export function unitKind(unit: string): UnitKind {
  if (unit === SHIFT_UNIT) return "shift";
  if (DIGIT_ORDER.includes(unit)) return "ziffer";
  if (PUNCT_ORDER.includes(unit)) return "satzzeichen";
  if (SYMBOL_ORDER.includes(unit)) return "sonderzeichen";
  return "buchstabe";
}

/**
 * ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 S5): Ist diese Einheit auf dem Weg
 * eine TOTASTE, die als Lerneinheit für Akzent-Vokale steht (Spanisch „´" für
 * á é í ó ú und „¨" für ü; Französisch „^" und „¨")? An der EIGENSCHAFT
 * festgemacht (Leitfaden Falle 50): die Einheit steht in der
 * Buchstaben-Reihenfolge des Weges UND ist die Totaste eines Kombizeichens.
 * Auf Weg „de" steht „^" in den Sonderzeichen (allein getippt, dann die
 * Leertaste) - dort bleibt es ein Sonderzeichen.
 */
export function istTotastenEinheit(unit: string, lernweg: Lernweg): boolean {
  return (
    // ★ G3a-SCHRIFT (25.10.2026): mit dem Weg - dann zählen auch die Totasten seiner eigenen Liste (griechisch `΄`).
    lernwegDef(lernweg).letterOrder.includes(unit) && istTotasteDerListen(unit, lernweg)
  );
}

/**
 * Die Vokale, die eine Totasten-Einheit auf der EINGESTELLTEN Tastatur
 * ergibt (á é í ó ú für „´" auf es/latam). Leer, wenn die Tastatur die Totaste
 * nicht als Totaste kennt (z. B. „¨" auf ca-fr) - dann bleibt die Ansage bei
 * der gewöhnlichen Tippanleitung.
 */
export function totastenVokale(unit: string, lernweg: Lernweg): string[] {
  const nurDiese = lernwegDef(lernweg).totastenZiele?.[unit];
  const kombi = kombizeichenFuerLayout(layoutById(activeLayoutId())).filter((k) => k.tot === unit);
  const vokale = kombi
    .filter((k) => k.nurOhneEigeneTaste !== true)
    .map((k) => k.zeichen)
    .filter((z) => !nurDiese || nurDiese.includes(z));
  // ★★★ SPRACHEN-9 (30.10.2026): pt/br der Gravis ⇒ à steht in der Liste als „nur ohne eigene Taste" und nl `'` ⇒ é gar nicht - die Feier
  // nannte darum keinen Buchstaben („danach die Leertaste"), obwohl à im Korpus häufig ist. Kennt die Tastatur die Totaste, gelten
  // auf den neun Wegen die Ziele des Weges. Die acht davor bleiben, wie sie sind.
  if (vokale.length === 0 && nurDiese && kombi.length > 0 && istGeruestSprache(lernweg)) return [...nurDiese];
  return vokale;
}

/**
 * ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 S5): Art einer Einheit IM WEG. Die
 * Listen hinter {@link unitKind} sind die deutschen - ein Zeichen, das es nur
 * auf einem anderen Weg gibt („¿" „¡" „_"), fiel dort durch und hiess „die
 * Letra ¿". Hier ergänzen die Listen des Weges, was die deutschen nicht
 * kennen; ALLES, was `unitKind` schon einordnet, bleibt, wie es war (die
 * Namen auf Weg „de"/„en" ändern sich dadurch nicht).
 */
export function unitKindImWeg(unit: string, lernweg?: Lernweg): UnitKind {
  const k = unitKind(unit);
  if (!lernweg || k !== "buchstabe" || unit.toUpperCase() !== unit.toLowerCase()) return k;
  const def = lernwegDef(lernweg);
  if (def.digitOrder.includes(unit)) return "ziffer";
  if (def.punctOrder.includes(unit)) return "satzzeichen";
  if (def.symbolOrder.includes(unit)) return "sonderzeichen";
  return k;
}

/** Lesbarer Name einer Einheit (Anzeige + Sprachausgabe). */
export function unitLabel(unit: string, lernweg?: Lernweg): string {
  switch (unitKind(unit)) {
    case "shift":
      return "Großschreibung";
    case "ziffer":
      return `Ziffer ${unit}`;
    case "satzzeichen": {
      const map: Record<string, string> = {
        ".": "Punkt", ",": "Komma", "-": "Bindestrich", "?": "Fragezeichen",
        "!": "Ausrufezeichen", ":": "Doppelpunkt", ";": "Strichpunkt",
      };
      return map[unit] ?? unit;
    }
    case "sonderzeichen": {
      const map: Record<string, string> = {
        "(": "Klammer auf", ")": "Klammer zu", '"': "Anführungszeichen",
        "'": "Apostroph", "+": "Plus", "*": "Stern", "/": "Schrägstrich",
        "=": "Gleich", "%": "Prozent", "&": "Und-Zeichen", "@": "At-Zeichen",
        "€": "Euro", "#": "Raute", "$": "Dollar", "§": "Paragraf",
        "<": "Kleiner-als", ">": "Größer-als",
        "[": "eckige Klammer auf", "]": "eckige Klammer zu",
        "{": "geschweifte Klammer auf", "}": "geschweifte Klammer zu",
        "|": "senkrechter Strich", "^": "Dach (Hochzeichen)",
        "~": "Tilde", "°": "Grad",
      };
      return map[unit] ?? unit;
    }
    default:
      // ★ E4 (18.09.2026): dieselbe Falle wie bei `spokenKeyName` weiter unten -
      // „ß".toUpperCase() liefert „SS", und die Tabelle „Wacklige Tasten" der
      // Lehrkraft (`TastenflowReiter.tsx`) nennt gerade DIESE Taste im
      // Auftrags-Beispiel. Eigener Name statt der Falle, wie dort schon gelöst.
      // ★ G2b-1: in der Sprache des Weges gross (türkisch „i" ⇒ „İ"); ohne Weg wie bisher.
      return unit === "ß" ? "Eszett" : grossImWeg(unit, lernweg);
  }
}

/**
 * Kurze Anzeige einer Einheit auf einer Kachel (Buchstaben-Karte).
 * `uppercase` steuert, ob Buchstaben groß (Standard) oder klein dargestellt
 * werden — bis die Umschalttaste gelernt ist, sollen die Kacheln Kleinbuchstaben
 * zeigen, danach Großbuchstaben.
 */
export function unitGlyph(unit: string, uppercase = true, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "⇧";
  if (unit === "ß") return "ß"; // Großform wäre „SS" — hier die Taste zeigen
  if (unitKind(unit) === "buchstabe") return uppercase ? grossImWeg(unit, lernweg) : unit; // G2b-1: türkisch ı ⇒ I, i ⇒ İ
  return unit;
}

// --- Freischalt-Feier: Ansage „so wird's getippt" ----------------------------
// Wenn eine neue Einheit dazukommt, soll eine große Feier aufpoppen, ein Klang
// spielen und (bei Self-Voicing) eine altersgerechte Ansage erklären, WIE das
// Zeichen getippt wird — z. B. „… es wird mit Umschalt und Fünf geschrieben".

const DIGIT_WORDS: Record<string, string> = {
  "0": "Null", "1": "Eins", "2": "Zwei", "3": "Drei", "4": "Vier",
  "5": "Fünf", "6": "Sechs", "7": "Sieben", "8": "Acht", "9": "Neun",
};
/** Symbol-Grundtasten, die als Wort klarer klingen als ihr Zeichen. */
const BASE_KEY_WORDS: Record<string, string> = {
  "+": "Plus", "#": "Raute", "<": "Kleiner-als-Taste", "^": "Dach-Taste",
};

/** Eine (Grund-)Taste als gut sprechbares Wort: Ziffern ausgeschrieben, Buchstaben groß. */
function spokenKeyName(key: string, lernweg?: Lernweg): string {
  if (!key) return "";
  if (key === " ") return "Leertaste";
  if (DIGIT_WORDS[key]) return DIGIT_WORDS[key];
  if (BASE_KEY_WORDS[key]) return BASE_KEY_WORDS[key];
  // „ß".toUpperCase() liefert „SS" — die Tippanleitung sagte sonst „die Taste SS"
  // bzw. „Umschalt und SS" (falsch/verwirrend für blinde Kinder). Eigener Name.
  if (key === "ß") return "Eszett";
  // ★ G2b-1: die alte Klasse bleibt für de/en/fr/es; it/pl/tr/cs: jeder Buchstabe, in der Sprache des Weges gross.
  if (buchstabeDerSprache(key, lernweg ?? layoutSprache(), /^[a-zäöüß]$/)) return grossImWeg(key, lernweg);
  return charLabel(key); // „Komma", „Punkt", …
}

/**
 * ★★★ K3 (28.09.2026, Auftrag „vier Reste", Befund ES-M2 §4): Die Feier in
 * DEUTSCHER und ENGLISCHER Bedienung kannte den Weg nicht - auf Weg „es"
 * hiess „¿" „der Buchstabe umgekehrtes Fragezeichen" (Karte: „der Buchstabe
 * ¿"), die Totaste „´" „der Buchstabe Akzent … dann die Leertaste", auf Weg
 * „fr" „^" „das Sonderzeichen Dach … dann die Leertaste", auf Weg „en" „£"
 * „der Buchstabe Pfund". Seither rechnen alle vier Sprachen mit
 * {@link unitKindImWeg} und {@link istTotastenEinheit}; ohne Weg bleibt alles,
 * wie es war. Wächter: `tests/tastenflow-k3-feier-jede-bedienung-jeder-weg.test.tsx`.
 */
function istTotasteImWeg(unit: string, lernweg?: Lernweg): boolean {
  return !!lernweg && istTotastenEinheit(unit, lernweg);
}

/** Deutscher Name einer Einheit IM WEG (Anzeige + Ansage der Feier). */
function unitLabelImWeg(unit: string, lernweg?: Lernweg): string {
  // Was die deutschen Listen selbst einordnen, heisst wie bisher; ein Zeichen,
  // das nur ein anderer Weg kennt, und eine Totaste bekommen ihren Namen.
  if (unitKindImWeg(unit, lernweg) === unitKind(unit) && !istTotasteImWeg(unit, lernweg)) return unitLabel(unit, lernweg);
  return charLabel(unit);
}

/** Artikel + Gattungswort einer Einheit (für „das Sonderzeichen …"). */
function unitNoun(unit: string, lernweg?: Lernweg): { article: string; noun: string } {
  if (istTotasteImWeg(unit, lernweg)) return { article: "die", noun: "Taste" };
  switch (unitKindImWeg(unit, lernweg)) {
    case "shift":
      return { article: "die", noun: "Großschreibung" };
    case "ziffer":
      return { article: "die", noun: "Ziffer" };
    case "satzzeichen":
      return { article: "das", noun: "Satzzeichen" };
    case "sonderzeichen":
      return { article: "das", noun: "Sonderzeichen" };
    default:
      return { article: "der", noun: "Buchstabe" };
  }
}

/** Der Name der Einheit, gut vorlesbar (Ziffern als Wort, Umlaute ausgeschrieben). */
function unitSpokenName(unit: string, lernweg?: Lernweg): string {
  const k = unitKindImWeg(unit, lernweg);
  if (k === "shift") return "";
  if (k === "ziffer") return spokenKeyName(unit, lernweg);
  if (k === "buchstabe" && !istTotasteImWeg(unit, lernweg)) return spokenLabel(unit);
  return unitLabelImWeg(unit, lernweg); // „Prozent", „Komma", „Akzent" …
}

/** „die Taste Akzent", „die Dach-Taste" - ohne doppeltes „Taste". */
function dieTaste(base: string, lernweg?: Lernweg): string {
  const name = spokenKeyName(base, lernweg);
  return name.endsWith("-Taste") ? `die ${name}` : `die Taste ${name}`;
}

/**
 * „So wird's getippt" für eine Einheit — ein vollständiger Satz, der sowohl
 * vorgelesen als auch angezeigt werden kann (bewusst alters-neutral, ohne du/Sie).
 */
export function unitHowToType(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT)
    return "Damit schreibt man Großbuchstaben: die Umschalttaste der Gegenhand halten.";
  const acc = charAccess(unit);
  // ★ K3: eine Totasten-EINHEIT des Weges lehrt Totaste + Vokal (wie
  // `unitHowToTypeFr`/`-Es`), nicht Totaste + Leertaste.
  const vokale = acc?.dead && istTotasteImWeg(unit, lernweg) ? totastenVokale(unit, lernweg!) : [];
  if (acc && vokale.length > 0) {
    const zuerst = acc.mod === "shift" ? `Umschalt und ${dieTaste(acc.base, lernweg)}` : dieTaste(acc.base, lernweg);
    return `Erst ${zuerst}, dann der Vokal: ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift")
    return `Es wird mit Umschalt und ${spokenKeyName(acc.base, lernweg)} geschrieben.`;
  if (acc?.mod === "altgr")
    return `Es wird mit Alt Gr und ${spokenKeyName(acc.base, lernweg)} geschrieben.`;
  if (acc?.dead)
    return `Erst die ${spokenKeyName(acc.base, lernweg)}, dann die Leertaste.`;
  const f = fingerForChar(unit, lernweg);
  const key = spokenKeyName(baseKeyForChar(unit, lernweg), lernweg);
  // ★ 25.09.2026 (Testerin): Der Finger allein sagt nicht, WOHIN - beim neuen I
  // hörte ein Kind „rechter Mittelfinger" und suchte in der Grundreihe. Die
  // Reihe steht darum mit dabei, wie im Fingerdiktat.
  const reihe = rowName(unit, "de");
  // ★ 25.09.2026 abends (Johannes): und WOHIN der Finger geht - gerade, nach
  // rechts oder nach links („vom K aus nach vorne, fast gerade"). `fingerWeg.ts`.
  const weg = fingerWegFuer(unit);
  const richtung = weg && richtungInWorten(weg, "de");
  const wohin = weg && richtung ? `: vom ${spokenKeyName(weg.heim, lernweg)} aus ${richtung}` : "";
  return f
    ? `Es liegt auf der Taste ${key}, ${f.name}${reihe ? `, ${reihe}` : ""}${wohin}.`
    : `Es liegt auf der Taste ${key}.`;
}

/** Strukturierte Daten für die sichtbare Freischalt-Feier. */
export interface UnlockInfo {
  /** Großes Zeichen für die Kachel. */
  glyph: string;
  /** „das", „die", „der". */
  article: string;
  /** „Sonderzeichen", „Buchstabe", … */
  noun: string;
  /** Sichtbarer Name („Prozent", „F"); leer bei der Großschreibung. */
  name: string;
  /** „Es wird mit Umschalt und Fünf geschrieben." */
  howTo: string;
}

export function unlockInfo(unit: string, lernweg?: Lernweg): UnlockInfo {
  const { article, noun } = unitNoun(unit, lernweg);
  const k = unitKindImWeg(unit, lernweg);
  const visibleName = k === "shift" ? "" : k === "ziffer" ? unit : unitLabelImWeg(unit, lernweg);
  return {
    glyph: unitGlyph(unit),
    article,
    noun,
    name: visibleName,
    howTo: unitHowToType(unit, lernweg),
  };
}

/**
 * Kurze Freischalt-Meldung für die Braillezeile (und Screenreader), z. B.
 * „Neuer Buchstabe R", „Neue Ziffer 5", „Neues Sonderzeichen Prozent %" oder
 * „Neue Großschreibung". Das „Neu" stimmt im Geschlecht mit dem Artikel überein.
 *
 * Bei Satz- und Sonderzeichen ist der Name ein Wort („eckige Klammer auf") — das
 * EIGENTLICHE Zeichen fehlt dann auf der Braillezeile. Darum wird es bei diesen
 * beiden Arten hinten angehängt: erst beschreiben, dann das tastbare Zeichen
 * selbst zeigen (Wunsch Johannes), z. B. „Neues Sonderzeichen eckige Klammer auf [".
 * Bei Buchstaben/Ziffern IST der Name schon das Zeichen — da kommt nichts dazu.
 */
export function unlockBrailleLabel(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfo(unit, lernweg);
  const neu = i.article === "der" ? "Neuer" : i.article === "das" ? "Neues" : "Neue";
  if (!i.name) return `${neu} ${i.noun}`;
  const k = unitKindImWeg(unit, lernweg);
  const mitZeichen = k === "satzzeichen" || k === "sonderzeichen" || istTotasteImWeg(unit, lernweg);
  const zeichen = mitZeichen ? ` ${unitGlyph(unit)}` : "";
  return `${neu} ${i.noun} ${i.name}${zeichen}`;
}

/**
 * Vollständige, vorlesbare Ansage einer Freischaltung — altersgerecht: Kinder
 * werden bejubelt („Gratulation!"), Jugendliche und Erwachsene sachlich
 * informiert (`sober`, die Karte reicht ihn aus dem Profil durch). Die STIMME
 * selbst (Tempo, Auswahl) richtet sich nach den Self-Voicing-Einstellungen des
 * Kontos, die zur Altersstufe passen.
 */
export function unlockSpeech(
  unit: string,
  sober: boolean,
  lang: Lang = "de",
  /**
   * ★ ES-M2 (27.09.2026): der Weg des Kindes - Französisch und Spanisch
   * nennen damit Totasten-Einheiten und Zeichen, die nur ihr Weg kennt,
   * richtig (siehe {@link istTotastenEinheit}, {@link unitKindImWeg}).
   * Ohne Weg: wie bisher.
   */
  lernweg?: Lernweg,
): string {
  // ★ E11a-5 (26.09.2026): eine Tabelle je Sprache statt `lang === "en"` -
  // „fr" bekam hier bis dahin still die DEUTSCHE Ansage (Falle 30), obwohl
  // `unitHowToTypeFr` schon da war.
  const fremd = UNLOCK_SPEECH_FREMD[lang];
  if (fremd) return fremd(unit, sober, lernweg);
  const i = unlockInfo(unit, lernweg);
  const head = unlockKopfDe(unit, lernweg);
  const lead = sober
    ? `Freigeschaltet: ${head}.`
    : `Gratulation! ${head[0].toUpperCase()}${head.slice(1)} ist freigeschaltet.`;
  return `${lead} ${i.howTo}`;
}

/** „das Satzzeichen Komma", „die Großschreibung" - der Kopf der deutschen Ansage. */
function unlockKopfDe(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfo(unit, lernweg);
  const spokenName = unitSpokenName(unit, lernweg);
  return spokenName ? `${i.article} ${i.noun} ${spokenName}` : i.noun;
}

// --- Dieselbe Feier auf ENGLISCH ---------------------------------------------
// Sie wird mit der INHALTS-Stimme gesprochen (`speak`, nicht `speakUi`) - bei
// englischem Inhalt also mit einer englischen Stimme. Bis 29.08.2026 stand dort
// deutscher Text; genau das war Jens' Befund („Pankt"), nur an einer Stelle, die
// niemand nachgesehen hatte. Deshalb ist die englische Fassung ausgeschrieben und
// nicht Wort für Wort aus der deutschen zusammengesetzt: Artikel und Satzbau
// unterscheiden sich, und eine halb übersetzte Ansage klingt schlimmer als eine
// ganz deutsche.

const DIGIT_WORDS_EN: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
  "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
};

/** Grundtasten, die als Wort klarer klingen als ihr Zeichen (englisch). */
const BASE_KEY_WORDS_EN: Record<string, string> = {
  "+": "plus", "#": "hash", "<": "less-than key", "^": "caret key",
};

/** Eine (Grund-)Taste als gut sprechbares englisches Wort. */
function spokenKeyNameEn(key: string, lernweg?: Lernweg): string {
  if (!key) return "";
  if (key === " ") return "space bar";
  if (DIGIT_WORDS_EN[key]) return DIGIT_WORDS_EN[key];
  if (BASE_KEY_WORDS_EN[key]) return BASE_KEY_WORDS_EN[key];
  if (key === "ß") return "sharp s";
  if (buchstabeDerSprache(key, lernweg ?? layoutSprache(), /^[a-zäöüß]$/)) return grossImWeg(key, lernweg);
  return spokenLabel(key, "en");
}

/** Lesbarer englischer Name einer Einheit - NUR fürs Vorlesen. */
export function unitLabelEn(unit: string, lernweg?: Lernweg): string {
  switch (unitKind(unit)) {
    case "shift":
      return "capital letters";
    case "ziffer":
      return `digit ${unit}`;
    case "satzzeichen": {
      const map: Record<string, string> = {
        ".": "full stop", ",": "comma", "-": "hyphen", "?": "question mark",
        "!": "exclamation mark", ":": "colon", ";": "semicolon",
      };
      return map[unit] ?? unit;
    }
    case "sonderzeichen": {
      const map: Record<string, string> = {
        "(": "open bracket", ")": "close bracket", '"': "quotation mark",
        "'": "apostrophe", "+": "plus", "*": "asterisk", "/": "slash",
        "=": "equals", "%": "per cent", "&": "ampersand", "@": "at sign",
        "€": "euro", "#": "hash", $: "dollar", "§": "section sign",
        "<": "less than", ">": "greater than",
        "[": "open square bracket", "]": "close square bracket",
        "{": "open curly bracket", "}": "close curly bracket",
        "|": "vertical bar", "^": "caret",
        "~": "tilde", "°": "degrees",
      };
      return map[unit] ?? unit;
    }
    default:
      // ★ EN3 (19.09.2026): dieselbe Falle wie in `unitLabel` - „ß".toUpperCase()
      // ist „SS". Die englische Statistik nannte die Taste sonst „SS"
      // (Glossar §3.5: *sharp s (ß)*).
      return unit === "ß" ? "sharp s (ß)" : grossImWeg(unit, lernweg);
  }
}

/**
 * Lesbarer französischer Name einer Einheit - NUR fürs Vorlesen und für die
 * Anzeige in der Lehrkraft-Statistik (★ E11a-3, 26.09.2026, Oberfläche
 * `TastenflowReiter.tsx`). Nutzt dieselbe Zeichentabelle wie die
 * Sprachausgabe (`SPOKEN_FR` in `fingers.ts`, E12) - EIN Name, zwei
 * Verwendungen, statt einer zweiten, eigenen Übersetzung.
 */
export function unitLabelFr(unit: string, lernweg?: Lernweg): string {
  switch (unitKind(unit)) {
    case "shift":
      return "majuscules";
    case "ziffer":
      return `chiffre ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return spokenLabel(unit, "fr");
    default:
      // ★ E11a-5 (26.09.2026, Befund E15 §4): Zeichen ohne Gross-/Kleinform,
      // die in keiner der Listen oben stehen (`¨`, `_` auf den französischen
      // Tastaturen), bekamen hier das nackte Zeichen - jetzt ihren Namen aus
      // `SPOKEN_FR` (« tréma », « tiret bas »). Buchstaben bleiben, wie sie
      // waren.
      return unit.toUpperCase() !== unit.toLowerCase() ? grossImWeg(unit, lernweg) : spokenLabel(unit, "fr");
  }
}

/** Englischer Name einer Einheit IM WEG - wie {@link unitLabelImWeg}. */
function unitLabelEnImWeg(unit: string, lernweg?: Lernweg): string {
  if (unitKindImWeg(unit, lernweg) === unitKind(unit) && !istTotasteImWeg(unit, lernweg)) return unitLabelEn(unit, lernweg);
  return spokenLabel(unit, "en");
}

/** Gattungswort englisch (K3: mit Weg). */
function gattungEn(unit: string, lernweg?: Lernweg): string {
  if (istTotasteImWeg(unit, lernweg)) return "dead key";
  const k = unitKindImWeg(unit, lernweg);
  return k === "shift"
    ? "capital letters"
    : k === "ziffer"
      ? "digit"
      : k === "satzzeichen"
        ? "punctuation mark"
        : k === "sonderzeichen"
          ? "special character"
          : "letter";
}

/**
 * Das Gattungswort, wie es VOR dem Namen steht - bei Satzzeichen keines
 * (Johannes 28.09.2026): „the question mark", nicht „the punctuation mark
 * question mark". Der Name sagt dort schon, was es ist. Hat das Zeichen keinen
 * englischen Namen (nacktes Zeichen), bleibt das Gattungswort stehen.
 */
function nomenVorNameEn(unit: string, lernweg?: Lernweg): string {
  if (unitKindImWeg(unit, lernweg) === "satzzeichen" && !istTotasteImWeg(unit, lernweg)) {
    const name = unitLabelEnImWeg(unit, lernweg);
    if (name && name !== unit) return "";
  }
  return gattungEn(unit, lernweg);
}

/** „the acute accent key", „the caret key" - ohne doppeltes „key". */
function theKey(base: string, lernweg?: Lernweg): string {
  const name = spokenKeyNameEn(base, lernweg);
  return name.endsWith(" key") ? `the ${name}` : `the ${name} key`;
}

/** „So wird's getippt" auf Englisch. */
export function unitHowToTypeEn(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT)
    return "This is how you write capital letters: hold the Shift key with the other hand.";
  const acc = charAccess(unit);
  // ★ K3: Totasten-EINHEIT des Weges - Totaste + Vokal, wie fr/es.
  const vokale = acc?.dead && istTotasteImWeg(unit, lernweg) ? totastenVokale(unit, lernweg!) : [];
  if (acc && vokale.length > 0) {
    const zuerst = acc.mod === "shift" ? `shift and ${theKey(acc.base, lernweg)}` : theKey(acc.base, lernweg);
    return `First ${zuerst}, then the vowel: ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift")
    return `It is written with shift and ${spokenKeyNameEn(acc.base, lernweg)}.`;
  if (acc?.mod === "altgr")
    return `It is written with Alt Gr and ${spokenKeyNameEn(acc.base, lernweg)}.`;
  if (acc?.dead)
    return `First the ${spokenKeyNameEn(acc.base, lernweg)}, then the space bar.`;
  const f = fingerForChar(unit, lernweg);
  const key = spokenKeyNameEn(baseKeyForChar(unit, lernweg), lernweg);
  const reihe = rowName(unit, "en"); // ★ 25.09.2026, siehe `unitHowToType`
  const weg = fingerWegFuer(unit);
  const richtung = weg && richtungInWorten(weg, "en");
  const wohin = weg && richtung ? `: from ${spokenKeyNameEn(weg.heim, lernweg)}, ${richtung}` : "";
  return f
    ? `It is on the ${key} key, ${fingerName(f, "en")}${reihe ? `, ${reihe}` : ""}${wohin}.`
    : `It is on the ${key} key.`;
}

/** „the letter R", „capital letters" - der Kopf der englischen Ansage. */
function unlockKopfEn(unit: string, lernweg?: Lernweg): string {
  if (unitKind(unit) === "shift") return "capital letters";
  const name =
    unitKindImWeg(unit, lernweg) === "ziffer" ? DIGIT_WORDS_EN[unit] ?? unit : unitLabelEnImWeg(unit, lernweg);
  return `the ${[nomenVorNameEn(unit, lernweg), name].filter(Boolean).join(" ")}`;
}

function unlockSpeechEn(unit: string, sober: boolean, lernweg?: Lernweg): string {
  const howTo = unitHowToTypeEn(unit, lernweg);
  if (unitKind(unit) === "shift") {
    const lead = sober
      ? "Unlocked: capital letters."
      : "Congratulations! Capital letters are unlocked.";
    return `${lead} ${howTo}`;
  }
  const kopf = unlockKopfEn(unit, lernweg);
  const lead = sober
    ? `Unlocked: ${kopf}.`
    : `Congratulations! ${kopf[0].toUpperCase()}${kopf.slice(1)} is unlocked.`;
  return `${lead} ${howTo}`;
}

/**
 * Die SICHTBARE Freischalt-Feier auf Englisch - für die englische BEDIENUNG
 * (Probestück 12.09.2026). Das Gegenstück zu {@link unlockInfo}; die Sprache
 * wählt die Karte (`UnlockCelebration`), nicht die Übungssprache: Die Karte ist
 * Beschriftung. Gesprochen wird weiter über {@link unlockSpeech}.
 */
export function unlockInfoEn(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  return {
    glyph: unitGlyph(unit),
    article: "the",
    noun: nomenVorNameEn(unit, lernweg),
    name: k === "shift" ? "" : k === "ziffer" ? unit : unitLabelEnImWeg(unit, lernweg),
    howTo: unitHowToTypeEn(unit, lernweg),
  };
}

// --- Dieselbe Feier auf FRANZÖSISCH ------------------------------------------
// ★ E10a (25.09.2026, Bauplan §8.3 Punkt 1 „Die Freischalt-Karte nennt die
// Reihe"): `unitHowToTypeFr` nach demselben Muster wie `unitHowToType`/
// `unitHowToTypeEn` - Finger, Reihe (`rowName(unit, "fr")`) UND die
// Zusatztaste (Umschalt/AltGr/Totaste). Auf AZERTY besonders wichtig, weil
// `é è ç à '` Buchstaben der ZIFFERNREIHE sind - hier bekommt ein Kind zum
// ersten Mal „Es liegt auf der Taste É, linker Ringfinger, Zahlenreihe" statt
// eines Fingers ohne Ortsangabe. ★ Nur `unitHowToTypeFr` selbst gehört zu
// E10a (Auftrag Punkt 6) - die volle Feier (`unlockInfoFr`/`unlockSpeechFr`)
// bräuchte französische Satzbausteine (`texte()`-Tabellen) und ist bewusst
// NICHT Teil dieser Etappe (E11a-Gebiet, siehe Auftrag „Diese Dateien meiden").

const DIGIT_WORDS_FR: Record<string, string> = {
  "0": "zéro", "1": "un", "2": "deux", "3": "trois", "4": "quatre",
  "5": "cinq", "6": "six", "7": "sept", "8": "huit", "9": "neuf",
};

/** Grundtasten, die als Wort klarer klingen als ihr Zeichen (französisch). */
const BASE_KEY_WORDS_FR: Record<string, string> = {
  "+": "plus", "#": "dièse", "<": "touche inférieur à", "^": "accent circonflexe",
};

/**
 * Satzzeichen und Sonderzeichen, die auf dem französischen Lehrweg vorkommen
 * (Bauplan §5.3/§8.2) - eigene, kleine Tabelle statt eines Umwegs über
 * {@link charLabel} (deutsch) oder {@link spokenLabelEn}: beide kennen kein
 * Französisch, ein Rückgriff auf sie wäre der stille Rückfall, vor dem der
 * Bauplan warnt (§2.3 Punkt 4).
 */
const PONCTUATION_FR: Record<string, string> = {
  ".": "point", ",": "virgule", "-": "trait d'union", "?": "point d'interrogation",
  "!": "point d'exclamation", ":": "deux-points", ";": "point-virgule",
  "'": "apostrophe", "(": "parenthèse ouvrante", ")": "parenthèse fermante",
  "\"": "guillemet", "¨": "tréma", "ç": "cédille", "%": "pourcent",
  "&": "esperluette", "€": "euro", "@": "arobase", "*": "étoile",
  "/": "barre oblique", "=": "égal",
};

/** Eine (Grund-)Taste als gut sprechbares französisches Wort. */
function spokenKeyNameFr(key: string, lernweg?: Lernweg): string {
  if (!key) return "";
  if (key === " ") return "espace";
  if (DIGIT_WORDS_FR[key]) return DIGIT_WORDS_FR[key];
  if (BASE_KEY_WORDS_FR[key]) return BASE_KEY_WORDS_FR[key];
  if (PONCTUATION_FR[key]) return PONCTUATION_FR[key];
  if (buchstabeDerSprache(key, lernweg ?? layoutSprache(), /^[a-zàâäçéèêëîïôöùûüÿœ]$/)) return grossImWeg(key, lernweg);
  return key;
}

/** „So wird's getippt" auf Französisch. */
export function unitHowToTypeFr(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT)
    return "C'est ainsi qu'on écrit les majuscules : tenir la touche Maj de l'autre main.";
  const acc = charAccess(unit);
  // ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 S5): Eine Totasten-EINHEIT des
  // Weges („^" für â ê î ô û, „¨" für ë ï ü ÿ) lehrt Totaste + Voyelle - nicht
  // Totaste + Leertaste: allein getippt kommt „^" im Lehrgang nie vor.
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const taste = spokenKeyNameFr(acc.base, lernweg);
    const zuerst = acc.mod === "shift" ? `Maj et la touche ${taste}` : `la touche ${taste}`;
    return `D'abord ${zuerst}, puis la voyelle : ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift")
    return `Ça s'écrit avec Maj et ${spokenKeyNameFr(acc.base, lernweg)}.`;
  if (acc?.mod === "altgr")
    return `Ça s'écrit avec Alt Gr et ${spokenKeyNameFr(acc.base, lernweg)}.`;
  if (acc?.dead)
    return `D'abord la touche ${spokenKeyNameFr(acc.base, lernweg)}, puis la touche espace.`;
  const f = fingerForChar(unit, lernweg);
  const key = spokenKeyNameFr(baseKeyForChar(unit, lernweg), lernweg);
  const reihe = rowName(unit, "fr"); // ★ E10a (25.09.2026), siehe `unitHowToType`
  return f
    ? `C'est sur la touche ${key}, ${fingerName(f, "fr")}${reihe ? `, ${reihe}` : ""}.`
    : `C'est sur la touche ${key}.`;
}

/**
 * ★ E11a-5 (26.09.2026): DIE FREISCHALT-FEIER FRANZÖSISCH - Karte
 * ({@link unlockInfoFr}), Braillezeile ({@link unlockBrailleLabelFr}) und
 * Ansage ({@link unlockSpeechFr}). Ausgeschrieben, nicht aus deutschen
 * Bausteinen zusammengesetzt: Artikel und Geschlecht folgen dem französischen
 * Nomen (« la lettre », « le chiffre », « le signe de ponctuation », « le
 * caractère spécial », « les majuscules »), und das Partizip gleicht sich
 * daran an. Die Namen kommen aus {@link unitLabelFr} (dieselbe Tabelle wie
 * die Sprachausgabe), der Weg zur Taste aus {@link unitHowToTypeFr}.
 */
function gattungFr(
  unit: string,
  lernweg?: Lernweg,
): { artikel: "la" | "le" | "les"; nomen: string; weiblich: boolean } {
  // ★ ES-M2: die Totaste ist eine TOUCHE (« la touche accent circonflexe »),
  // keine « lettre tréma ».
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { artikel: "la", nomen: "touche", weiblich: true };
  switch (unitKindImWeg(unit, lernweg)) {
    case "shift":
      return { artikel: "les", nomen: "majuscules", weiblich: true };
    case "ziffer":
      return { artikel: "le", nomen: "chiffre", weiblich: false };
    case "satzzeichen":
      return { artikel: "le", nomen: "signe de ponctuation", weiblich: false };
    case "sonderzeichen":
      return { artikel: "le", nomen: "caractère spécial", weiblich: false };
    default:
      return { artikel: "la", nomen: "lettre", weiblich: true };
  }
}

/** Die SICHTBARE Freischalt-Feier französisch - Gegenstück zu {@link unlockInfoEn}. */
export function unlockInfoFr(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const g = gattungFr(unit, lernweg);
  return {
    glyph: unitGlyph(unit),
    // Bei den Majuscules steht der Artikel im Nomen selbst (die Karte setzt
    // ohne Namen nur das Nomen, siehe `UnlockCelebration`).
    article: g.artikel,
    noun: k === "shift" ? "les majuscules" : g.nomen,
    name: k === "shift" ? "" : k === "ziffer" ? unit : unitLabelFr(unit, lernweg),
    howTo: unitHowToTypeFr(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung zu {@link unlockInfoFr} - « Nouvelle lettre R », « Nouveau caractère spécial arobase @ ». */
export function unlockBrailleLabelFr(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoFr(unit, lernweg);
  if (!i.name) return `Nouveau : ${i.noun}`;
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `Nouvelle touche : ${i.name} ${unit}`;
  const neu = gattungFr(unit, lernweg).weiblich ? "Nouvelle" : "Nouveau";
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${neu} ${i.noun} ${i.name}${zeichen}`;
}

/** « la lettre R », « le chiffre cinq », « la touche accent circonflexe » - der Kopf der Ansage. */
function unlockKopfFr(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "les majuscules";
  const g = gattungFr(unit, lernweg);
  const name = unitKindImWeg(unit, lernweg) === "ziffer" ? DIGIT_WORDS_FR[unit] ?? unit : unitLabelFr(unit, lernweg);
  return `${g.artikel} ${g.nomen} ${name}`;
}

/** Die gesprochene Feier französisch - Kinder bejubelt, ab 11 sachlich (`sober`). */
function unlockSpeechFr(unit: string, sober: boolean, lernweg?: Lernweg): string {
  const howTo = unitHowToTypeFr(unit, lernweg);
  if (unitKind(unit) === "shift") {
    const lead = sober
      ? "Nouveau : les majuscules."
      : "Bravo ! Les majuscules sont débloquées.";
    return `${lead} ${howTo}`;
  }
  const g = gattungFr(unit, lernweg);
  const kopf = unlockKopfFr(unit, lernweg);
  const lead = sober
    ? `Nouvelle touche débloquée : ${kopf}.`
    : `Bravo ! ${kopf[0].toUpperCase()}${kopf.slice(1)} est débloqué${g.weiblich ? "e" : ""}.`;
  return `${lead} ${howTo}`;
}

// --- Dieselbe Feier auf SPANISCH ---------------------------------------------
// ★ ES-O (27.09.2026): wie die französische Fassung ausgeschrieben, nicht aus
// Bausteinen einer anderen Sprache zusammengesetzt - Artikel und Geschlecht
// folgen dem spanischen Nomen (« la letra », « el número », « el signo de
// puntuación », « el carácter especial », « las mayúsculas »). Die Namen der
// Zeichen kommen aus `SPOKEN_ES` (`fingers.ts`, ES-F8), Finger und Reihe aus
// `fingerName`/`rowName` mit „es". tú (Bauplan S9).

const DIGIT_WORDS_ES: Record<string, string> = {
  "0": "cero", "1": "uno", "2": "dos", "3": "tres", "4": "cuatro",
  "5": "cinco", "6": "seis", "7": "siete", "8": "ocho", "9": "nueve",
};

/** Grundtasten, die als Wort klarer klingen als ihr Zeichen (spanisch). */
const BASE_KEY_WORDS_ES: Record<string, string> = {
  "+": "más", "<": "menor que", "´": "acento", "`": "acento grave", "'": "apóstrofo",
  "º": "indicador ordinal", "¡": "signo de apertura de exclamación",
};

/** Eine (Grund-)Taste als gut sprechbares spanisches Wort. */
function spokenKeyNameEs(key: string, lernweg?: Lernweg): string {
  if (!key) return "";
  if (key === " ") return "barra espaciadora";
  if (DIGIT_WORDS_ES[key]) return DIGIT_WORDS_ES[key];
  if (BASE_KEY_WORDS_ES[key]) return BASE_KEY_WORDS_ES[key];
  if (key.length === 1 && key.toUpperCase() !== key.toLowerCase()) return grossImWeg(key, lernweg);
  return spokenLabel(key, "es");
}

/** Lesbarer spanischer Name einer Einheit (Anzeige + Sprachausgabe). */
export function unitLabelEs(unit: string, lernweg?: Lernweg): string {
  switch (unitKind(unit)) {
    case "shift":
      return "mayúsculas";
    case "ziffer":
      return `número ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return spokenLabel(unit, "es");
    default:
      return unit.toUpperCase() !== unit.toLowerCase() ? grossImWeg(unit, lernweg) : spokenLabel(unit, "es");
  }
}

/** „So wird's getippt" auf Spanisch. */
export function unitHowToTypeEs(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT)
    return "Así se escriben las mayúsculas: mantén pulsada la tecla Mayús con la otra mano.";
  const acc = charAccess(unit);
  // ★ ES-M2 (27.09.2026, Prüfbericht ES-P2 S5): Die Totasten-EINHEIT „´"
  // (á é í ó ú) bzw. „¨" (ü) lehrt Akzent + Vokal. Bis hierher hiess es
  // „luego la barra espaciadora" - so kommt „´" im Lehrgang nie vor.
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const taste = spokenKeyNameEs(acc.base, lernweg);
    const zuerst = acc.mod === "shift" ? `Mayús y la tecla ${taste}` : `la tecla ${taste}`;
    return `Primero ${zuerst}, luego la vocal: ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift") return `Se escribe con Mayús y ${spokenKeyNameEs(acc.base, lernweg)}.`;
  if (acc?.mod === "altgr") return `Se escribe con Alt Gr y ${spokenKeyNameEs(acc.base, lernweg)}.`;
  if (acc?.dead) return `Primero la tecla ${spokenKeyNameEs(acc.base, lernweg)}, luego la barra espaciadora.`;
  const f = fingerForChar(unit, lernweg);
  const key = spokenKeyNameEs(baseKeyForChar(unit, lernweg), lernweg);
  const reihe = rowName(unit, "es");
  return f
    ? `Está en la tecla ${key}, ${fingerName(f, "es")}${reihe ? `, ${reihe}` : ""}.`
    : `Está en la tecla ${key}.`;
}

function gattungEs(
  unit: string,
  lernweg?: Lernweg,
): { artikel: "la" | "el" | "las"; nomen: string; weiblich: boolean } {
  // ★ ES-M2: die Totaste ist eine TECLA (« la tecla tilde »), keine « letra tilde ».
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { artikel: "la", nomen: "tecla", weiblich: true };
  switch (unitKindImWeg(unit, lernweg)) {
    case "shift":
      return { artikel: "las", nomen: "mayúsculas", weiblich: true };
    case "ziffer":
      return { artikel: "el", nomen: "número", weiblich: false };
    case "satzzeichen":
      return { artikel: "el", nomen: "signo de puntuación", weiblich: false };
    case "sonderzeichen":
      return { artikel: "el", nomen: "carácter especial", weiblich: false };
    default:
      return { artikel: "la", nomen: "letra", weiblich: true };
  }
}

/**
 * ★★★ K5 (28.09.2026, Auftrag „vier Reste"; Ansage schon in ES-M2): Trägt der
 * Name das Gattungswort schon („signo de apertura de interrogación"), steht es
 * nur EINMAL - die Karte sagte „el signo de puntuación signo de apertura de
 * interrogación", die Braillezeile „Signo de puntuación nuevo signo de …".
 * EINE Regel für Karte, Braillezeile und Ansage. Geprüft für alle vier
 * Bedienungen: nur Spanisch hat Namen, die mit dem Gattungswort beginnen
 * (fr „point d'interrogation", de „Fragezeichen", en „question mark").
 * Wächter: `tests/tastenflow-k5-gattung-nur-einmal.test.ts`.
 */
function nameTraegtGattungEs(nomen: string, name: string): boolean {
  const gattung = nomen.split(" ")[0];
  return name.startsWith(`${gattung} `);
}

/** Die SICHTBARE Freischalt-Feier spanisch - Gegenstück zu {@link unlockInfoFr}. */
export function unlockInfoEs(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const g = gattungEs(unit, lernweg);
  const name = k === "shift" ? "" : k === "ziffer" ? unit : unitLabelEs(unit, lernweg);
  // K5: „el signo | de apertura de interrogación" - die Karte setzt Artikel,
  // Nomen und Namen hintereinander, das Gattungswort steht so nur einmal.
  if (name && nameTraegtGattungEs(g.nomen, name)) {
    const gattung = g.nomen.split(" ")[0];
    return {
      glyph: unitGlyph(unit),
      article: g.artikel,
      noun: gattung,
      name: name.slice(gattung.length + 1),
      howTo: unitHowToTypeEs(unit, lernweg),
    };
  }
  return {
    glyph: unitGlyph(unit),
    article: g.artikel,
    noun: k === "shift" ? "las mayúsculas" : g.nomen,
    name,
    howTo: unitHowToTypeEs(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung zu {@link unlockInfoEs} - « Letra nueva R », « Carácter especial nuevo arroba @ ». */
export function unlockBrailleLabelEs(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoEs(unit, lernweg);
  if (!i.name) return `Nuevo: ${i.noun}`;
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `Tecla nueva: ${i.name} ${unit}`;
  const g = gattungEs(unit, lernweg);
  // K5: „Nuevo: signo de apertura de interrogación ¿" statt „Signo de
  // puntuación nuevo signo de apertura de interrogación ¿".
  if (i.noun !== g.nomen) return `Nuevo: ${i.noun} ${i.name} ${unitGlyph(unit)}`;
  const nomen = `${g.nomen[0].toUpperCase()}${g.nomen.slice(1)}`;
  const neu = g.weiblich ? "nueva" : "nuevo";
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${nomen} ${neu} ${i.name}${zeichen}`;
}

/** « la letra Ñ », « el número cinco », « la tecla tilde » - der Kopf der Ansage. */
function unlockKopfEs(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "las mayúsculas";
  const g = gattungEs(unit, lernweg);
  const name = unitKindImWeg(unit, lernweg) === "ziffer" ? DIGIT_WORDS_ES[unit] ?? unit : unitLabelEs(unit, lernweg);
  // ★ ES-M2 (Prüfbericht ES-P2 K5): „el signo de puntuación signo de cierre
  // de interrogación" - trägt der Name das Gattungswort schon, nur einmal
  // (seit 28.09. dieselbe Regel wie Karte und Braillezeile).
  if (nameTraegtGattungEs(g.nomen, name)) return `${g.artikel} ${name}`;
  return `${g.artikel} ${g.nomen} ${name}`;
}

/** Die gesprochene Feier spanisch - Kinder bejubelt, ab 11 sachlich (`sober`). */
function unlockSpeechEs(unit: string, sober: boolean, lernweg?: Lernweg): string {
  const howTo = unitHowToTypeEs(unit, lernweg);
  if (unitKind(unit) === "shift") {
    const lead = sober ? "Nuevo: las mayúsculas." : "¡Muy bien! Has desbloqueado las mayúsculas.";
    return `${lead} ${howTo}`;
  }
  const kopf = unlockKopfEs(unit, lernweg);
  const lead = sober ? `Tecla nueva desbloqueada: ${kopf}.` : `¡Muy bien! Has desbloqueado ${kopf}.`;
  return `${lead} ${howTo}`;
}

/** Die Freischalt-Ansage je Vorlese-Sprache - Deutsch bleibt oben im Rumpf ({@link unlockSpeech}). */
const UNLOCK_SPEECH_FREMD: Record<
  Lang,
  ((unit: string, sober: boolean, lernweg?: Lernweg) => string) | null
> = {
  de: null,
  en: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  fr: (unit, sober, lernweg) => unlockSpeechFr(unit, sober, lernweg),
  es: (unit, sober, lernweg) => unlockSpeechEs(unit, sober, lernweg),
  // RÜCKFALL-EN (G2a): it, pl, tr, cs zeigen vorerst Englisch.
  it: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  pl: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  tr: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  cs: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  el: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  hu: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  nl: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  pt: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  br: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  ro: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  sv: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
  uk: (unit, sober, lernweg) => unlockSpeechEn(unit, sober, lernweg),
};

/**
 * ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M1): DIE FEIER FÜR MEHRERE
 * EINHEITEN AUF EINMAL. Seit ¿/? und ¡/! gemeinsam kommen
 * (`paareGemeinsam`), wachsen an einer Sprosse ZWEI Einheiten - die Trainer
 * reichten aber nur die letzte weiter, und das Kind hörte nie, wo „¿" liegt
 * (auf es und latam VERTAUSCHT). Ein Satz nennt jetzt alle, danach je Einheit
 * ihr Griff, in der Reihenfolge der Freischaltung (das öffnende Zeichen
 * zuerst). Mit EINER Einheit ist das Ergebnis Zeichen für Zeichen
 * {@link unlockSpeech} - nichts ändert sich an einer gewöhnlichen Sprosse.
 */
export function unlockSpeechAlle(
  units: readonly string[],
  sober: boolean,
  lang: Lang = "de",
  lernweg?: Lernweg,
): string {
  if (units.length <= 1) return unlockSpeech(units[0] ?? "", sober, lang, lernweg);
  const t = MEHRERE_TEXTE[lang];
  const koepfe = units.map((u) => t.kopf(u, lernweg));
  const liste = aufzaehlen(koepfe, t.und);
  const weiblich = lang === "fr" && units.every((u) => gattungFr(u, lernweg).weiblich);
  const lead = sober ? t.sachlich(liste) : t.jubel(grossAnfang(liste), weiblich);
  const griffe = units.map((u) => `${grossAnfang(t.name(u, lernweg))}${t.doppelpunkt}${t.griff(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}

/** „a y b", „a, b y c" - eine Aufzählung mit dem Bindewort der Sprache. */
function aufzaehlen(teile: readonly string[], und: string): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} ${und} ${teile[teile.length - 1]}`;
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
}

/** Der Griff hinter dem Doppelpunkt: im Deutschen bleibt der Satz gross, sonst klein. */
function kleinAnfang(s: string): string {
  return s ? `${s[0].toLowerCase()}${s.slice(1)}` : s;
}

interface MehrereTexte {
  kopf: (unit: string, lernweg?: Lernweg) => string;
  name: (unit: string, lernweg?: Lernweg) => string;
  griff: (unit: string, lernweg?: Lernweg) => string;
  und: string;
  doppelpunkt: string;
  sachlich: (liste: string) => string;
  jubel: (liste: string, weiblich: boolean) => string;
}

const MEHRERE_TEXTE: Record<Lang, MehrereTexte> = mitRueckfallEn(/* RÜCKFALL-EN (G2a) */ {
  de: {
    kopf: (u, w) => unlockKopfDe(u, w),
    name: (u, w) => unitLabelImWeg(u, w),
    griff: (u, w) => unitHowToType(u, w),
    und: "und",
    doppelpunkt: ": ",
    sachlich: (l) => `Freigeschaltet: ${l}.`,
    jubel: (l) => `Gratulation! ${l} sind freigeschaltet.`,
  },
  en: {
    kopf: (u, w) => unlockKopfEn(u, w),
    name: (u, w) => unitLabelEnImWeg(u, w),
    griff: (u, w) => kleinAnfang(unitHowToTypeEn(u, w)),
    und: "and",
    doppelpunkt: ": ",
    sachlich: (l) => `Unlocked: ${l}.`,
    jubel: (l) => `Congratulations! ${l} are unlocked.`,
  },
  fr: {
    kopf: (u, w) => unlockKopfFr(u, w),
    name: (u, lernweg) => unitLabelFr(u, lernweg),
    griff: (u, w) => kleinAnfang(unitHowToTypeFr(u, w)),
    und: "et",
    doppelpunkt: " : ",
    sachlich: (l) => `Nouvelles touches débloquées : ${l}.`,
    jubel: (l, weiblich) => `Bravo ! ${l} sont débloqué${weiblich ? "es" : "s"}.`,
  },
  es: {
    kopf: (u, w) => unlockKopfEs(u, w),
    name: (u, lernweg) => unitLabelEs(u, lernweg),
    griff: (u, w) => kleinAnfang(unitHowToTypeEs(u, w)),
    und: "y",
    doppelpunkt: ": ",
    sachlich: (l) => `Teclas nuevas desbloqueadas: ${l}.`,
    jubel: (l) => `¡Muy bien! Has desbloqueado ${kleinAnfang(l)}.`,
  },
});

/** Die Braillezeilen-Meldung zu {@link unlockInfoEn} - „New letter R", „New special character per cent %". */
export function unlockBrailleLabelEn(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoEn(unit, lernweg);
  if (!i.name) return `New: ${i.noun}`;
  const k = unitKindImWeg(unit, lernweg);
  const mitZeichen = k === "satzzeichen" || k === "sonderzeichen" || istTotasteImWeg(unit, lernweg);
  const zeichen = mitZeichen ? ` ${unitGlyph(unit)}` : "";
  // Satzzeichen ohne Gattungswort: „New: question mark ?".
  if (!i.noun) return `New: ${i.name}${zeichen}`;
  return `New ${i.noun} ${i.name}${zeichen}`;
}

// Schwellen — bewusst sanft (Lernende mit Sehbeeinträchtigung, Treffsicherheit
// vor Tempo). „Sitzt" = genug Übung, treffsicher und zügig.
export const MIN_SAMPLES = 5; // Anschläge, bevor geurteilt wird
export const TARGET_ACC = 0.9; // Treffsicherheit zum „Sitzen"
export const TARGET_MS = 900; // Durchschnitts-Anschlagszeit zum „Sitzen" (~67/min)
export const STRUGGLE_ACC = 0.8; // darunter: „hakt"
export const STRUGGLE_MS = 1800; // darüber: „hakt"

// --- Schwierigkeits-Faktor pro Zeichen ---------------------------------------
// Ein AltGr-Sonderzeichen oder eine Totaste braucht objektiv länger als ein
// kleiner Grundreihen-Buchstabe (Pinky-Stretch, Umschalt/AltGr-Griff, Total-
// taste). Darum wird das ZEIT-Ziel zum „Sitzen" je Zeichen skaliert: gleiche
// Treffsicherheit, aber mehr erlaubte Zeit für die schwereren Tasten. So gilt ein
// zügig getipptes „@" als „sitzt" und gute Tippende bekommen dort nicht mehr
// dauerhaft „sitzt noch nicht". Die Werte sind bewusst tunbar (nach echten
// Schülerdaten nachjustierbar). Siehe [[project_zehnfinger_trainer]].

/** Die acht Heimattasten der Grundreihe — leichteste Anschläge (Faktor 1,0). */
export const HOME_KEYS = new Set(["a", "s", "d", "f", "j", "k", "l", "ö"]);

export const DIFF_HOME = 1.0; // Grundreihen-Buchstabe
// ★ E2 (24.09.2026): Die Grundreihe des Weges „en" hat ANDERE Heimattasten
// (a s d f j k l ; statt … ö - Bauplan §3.3a) - `keyDifficulty` braucht darum
// den Lernweg als Pflicht-Parameter, um `lernwegDef(lernweg).homeKeys` statt
// blind `HOME_KEYS` zu lesen (Bauplan §11 Falle 6: „hart verdrahtete deutsche
// Listen"). Kein stiller Rückfall auf „de".
export const DIFF_REACH = 1.15; // Buchstabe/Direkt-Zeichen außerhalb der Grundreihe
export const DIFF_SHIFT_UNIT = 1.5; // die ⇧-Einheit (Umschalt-Griff)
export const DIFF_DIGIT = 1.4; // Ziffer der Zahlenreihe
/**
 * ★ E3 (25.09.2026, Bauplan §3.2, code-bestand.md §D.3 Punkt 1): AZERTY
 * (fr/be) braucht für JEDE Ziffer die Umschalttaste (`é` statt `2` und so
 * fort) - schwerer als eine gewöhnliche Ziffer, aber leichter als ein
 * AltGr-Sonderzeichen. Auf de/ch/us/uk (und ch-fr/ca, „Ziffern ohne
 * Umschalt") hat keine Ziffer einen `access`-Eintrag mit `mod: "shift"` -
 * dort bleibt {@link DIFF_DIGIT} darum unverändert wirksam (Wächter:
 * `tests/typing-layouts-franzoesisch.test.ts`, „de/ch/us/uk unverändert").
 */
export const DIFF_DIGIT_SHIFT = 1.6; // Ziffer mit Umschalt (AZERTY)
export const DIFF_PUNCT = 1.35; // Satzzeichen ohne Umschalt (. , -)
export const DIFF_PUNCT_SHIFT = 1.5; // Satzzeichen mit Umschalt (? ! : ;)
export const DIFF_SYMBOL = 1.3; // Sonderzeichen auf eigener Taste (+ # <)
export const DIFF_SYMBOL_SHIFT = 1.6; // Sonderzeichen mit Umschalt (* ' ° > …)
export const DIFF_ALTGR = 2.2; // AltGr-Sonderzeichen (@ € { } [ ] ~ |)
export const DIFF_DEAD = 2.6; // Totaste (^ — erst Taste, dann Leertaste)

/**
 * Schwierigkeits-Faktor einer Lern-Einheit. Leitet sich aus dem Zugangsweg der
 * Taste ab ({@link charAccess}: Umschalt/AltGr/Totaste) und der Zeichenart.
 */
export function keyDifficulty(unit: string, lernweg: Lernweg): number {
  if (unit === SHIFT_UNIT) return DIFF_SHIFT_UNIT;
  // ★ E2: die Grundreihe wird ZUERST geprüft, VOR `unitKind`. Grund: Weg „en"
  // nimmt „;" als 8. Grundtaste (Bauplan §3.3a) - ein Zeichen, das
  // `unitKind` (auf den DEUTSCHEN Konstanten `PUNCT_ORDER` gebaut, siehe
  // dort) immer als Satzzeichen einstuft. Ein Fingeranker ist aber IMMER so
  // leicht wie die anderen sieben Grundreihen-Tasten, unabhängig davon, was
  // für ein Zeichen sonst dort steht (bei „de" ändert die Reihenfolge nichts,
  // weil „ö" ohnehin auf keiner der drei Listen steht).
  if (lernwegDef(lernweg).homeKeys.has(unit)) return DIFF_HOME;
  const acc = charAccess(unit);
  if (acc?.dead) return DIFF_DEAD;
  if (acc?.mod === "altgr") return DIFF_ALTGR;
  switch (unitKind(unit)) {
    case "ziffer":
      return acc?.mod === "shift" ? DIFF_DIGIT_SHIFT : DIFF_DIGIT;
    case "satzzeichen":
      return acc?.mod === "shift" ? DIFF_PUNCT_SHIFT : DIFF_PUNCT;
    case "sonderzeichen":
      return acc?.mod === "shift" ? DIFF_SYMBOL_SHIFT : DIFF_SYMBOL;
    default: // Buchstabe
      return DIFF_REACH;
  }
}

/**
 * Anforderungs-Stufe (von der Lehrkraft je Schüler:in einstellbar). Sie steuert
 * NUR das Tempo-Ziel beim Aufstieg — die Treffsicherheit bleibt gleich. So
 * bleiben motorisch langsame Kinder, die zwar genau, aber nicht schnell tippen,
 * NICHT ewig bei den ersten Buchstaben hängen.
 *  • normal       – Standard (zügig + treffsicher),
 *  • gemaechlich  – großzügigeres Tempo-Ziel,
 *  • nurgenau     – Tempo zählt gar nicht; Aufstieg allein über Treffsicherheit.
 */
export type TempoLevel = "normal" | "gemaechlich" | "nurgenau";

// (Bis 11.09.2026 standen hier `TEMPO_LEVELS`/`TEMPO_LABELS`, entfernt weil
// ungenutzt - `TempoLevel` selbst bleibt, es wird an neun Stellen gelesen.)

export interface Mastery {
  minSamples: number;
  targetAcc: number;
  struggleAcc: number;
  targetMs: number;
  struggleMs: number;
  /** Tempo gar nicht bewerten (Aufstieg allein über Treffsicherheit). */
  ignoreSpeed: boolean;
  /**
   * AUTOMATISCHE Schwierigkeits-Anpassung: Hat ein Kind eine Taste so oft sauber
   * getippt (≥ patienceSamples Anschläge im Fenster, Treffsicherheit erreicht),
   * gilt sie als „sitzt" — auch wenn sie (noch) langsam ist. So bleiben langsame,
   * aber genaue Kinder NICHT ewig hängen, sondern kommen im Programm weiter und
   * können trotzdem 3 Sterne erreichen. (Wunsch #7.)
   */
  patienceSamples: number;
}

/**
 * Anschläge im Fenster, ab denen eine treffsichere Taste auch ohne Tempo als
 * „sitzt" zählt — die Regel, die langsame, aber genaue Kinder nicht hängen lässt.
 *
 * Stand bei einem Fenster von 20 „knapp darunter". Seit das Fenster 60 fasst
 * (28.08.2026), ist der Wert BEWUSST bei 16 geblieben und NICHT mitgewachsen:
 * Er ist die Schwelle, ab der Tempo nicht mehr zählt, und die soll früh greifen.
 * Mitzuwachsen (48 von 60) hieße, ein langsames Kind dreimal so lange am
 * Tempo-Maßstab zu messen — das Gegenteil des Zwecks.
 */
export const PATIENCE_SAMPLES = 16;

/**
 * Satz- und Sonderzeichen sind objektiv mühsamer (Umschalt/AltGr/Totaste, weiter
 * Weg) UND kommen in echten Texten selten vor. Damit auch gute Tippende dort nicht
 * ewig hängen, gelten sie schon nach DEUTLICH weniger sauberen Anschlägen als
 * „sitzt" (das Tempo zählt dann nicht mehr) — Wunsch Johannes: „toleranter, es
 * macht keinen Spaß, ewig auf ein weiteres Zeichen zu warten". Buchstaben bleiben
 * streng (PATIENCE_SAMPLES), die Grundlage muss sicher sitzen.
 */
export const EXTRA_PATIENCE_SAMPLES = 9;

/** Ist die Einheit ein Satz- oder Sonderzeichen (die „toleranten" Zeichen)? */
export function isExtraUnit(unit: string): boolean {
  const k = unitKind(unit);
  return k === "satzzeichen" || k === "sonderzeichen";
}

/**
 * Anteil der Leerzeichen am Übungstext — gemessen an 300 erzeugten Runden
 * (`scripts/_massstab.mts`, 28.08.2026): 15,7 %.
 *
 * WARUM das hier steht: Die Runde zeigt dem Kind eine Treffsicherheit über ALLE
 * Zeichen, Leerzeichen eingerechnet. Die Tasten-Statistik ließ Leerzeichen
 * hingegen weg (`mergeLetters` überspringt sie) — und AN IHR hängt das Tor zur
 * nächsten Taste. Beide Zahlen liefen deshalb auseinander: Janos Konto zeigte
 * 94,9 % und wurde bei 90,6 % gemessen. Einem Kind wurde „95 %, super" gesagt,
 * während es längst an der Kante stand, wo das Tor nur noch in 2 % der Runden
 * aufgeht (`scripts/_torrechnung.mts`).
 *
 * Entscheidung Johannes 28.08.2026: Das TOR zählt die Leerzeichen mit — nicht
 * die Anzeige wird strenger. Die gewohnte Zahl bleibt, das Tor wird milder.
 *
 * ⚠️ Es reicht NICHT, die Schwellen um diesen Anteil zu senken: Bei einem
 * Fenster von 20 Anschlägen wäre jede Quote ein Vielfaches von 5 % gewesen —
 * eine Schwelle von 90 % auf 88,1 % zu verschieben hätte kein einziges Urteil
 * geändert (gemessen, `_torrechnung.mts` lieferte identische Zahlen). Deshalb
 * kommen die Leerzeichen in den NENNER, und deshalb ist {@link RECENT_WINDOW}
 * am selben Tag auf 60 gewachsen: Erst dort ist die Auflösung fein genug.
 */
export const LEERZEICHEN_ANTEIL = 0.157;

/**
 * Wie viele (so gut wie immer richtige) Leerzeichen kommen rechnerisch auf so
 * viele Tasten-Anschläge? Bei 20 Anschlägen sind das 3,7 freie Treffer.
 */
export function leerzeichenGutschrift(anschlaege: number): number {
  return (anschlaege * LEERZEICHEN_ANTEIL) / (1 - LEERZEICHEN_ANTEIL);
}

/** Schwellen für eine Anforderungs-Stufe. */
export function masteryFor(tempo: TempoLevel = "normal"): Mastery {
  const base = {
    minSamples: MIN_SAMPLES,
    targetAcc: TARGET_ACC,
    struggleAcc: STRUGGLE_ACC,
    patienceSamples: PATIENCE_SAMPLES,
  };
  if (tempo === "nurgenau")
    return { ...base, targetMs: TARGET_MS, struggleMs: STRUGGLE_MS, ignoreSpeed: true };
  if (tempo === "gemaechlich")
    return { ...base, targetMs: 1500, struggleMs: 2800, ignoreSpeed: false };
  return { ...base, targetMs: TARGET_MS, struggleMs: STRUGGLE_MS, ignoreSpeed: false };
}

/**
 * Verhältnis von „hakt"-Schwelle zu Ziel-Anschlagszeit. ~1,9 entspricht dem
 * bisherigen Normal-Profil (900 → 1800 ms) und gilt jetzt für jede Stufe.
 */
export const STRUGGLE_MS_FACTOR = 1.9;

/**
 * Mastery-Schwellen für eine numerische Leistungsstufe (1..{@link LEVEL_MAX}).
 * Das Tempo-Ziel wächst geometrisch mit der Stufe (siehe level.ts); Stufe 1
 * ignoriert Tempo ganz (Aufstieg allein über Treffsicherheit). Treffsicherheit
 * und Geduld (patienceSamples) bleiben stufenübergreifend gleich — so bleiben
 * langsame, genaue Kinder NICHT hängen und kommen trotzdem weiter.
 */
export function masteryForLevel(level: number, zeitLassen = false): Mastery {
  const L = Math.max(1, Math.min(LEVEL_MAX, Math.round(level || 1)));
  const base = {
    minSamples: MIN_SAMPLES,
    targetAcc: TARGET_ACC,
    struggleAcc: STRUGGLE_ACC,
    patienceSamples: PATIENCE_SAMPLES,
  };
  // „Zeit lassen" (14.08.2026) ist eine Eigenschaft des KINDES, nicht der
  // Stufe: Wer ihn gesetzt hat, wird nirgends nach Tempo beurteilt — auf jeder
  // Leistungsstufe. Vorher hing Zeitdruckfreiheit allein an Stufe 1, und aus
  // Stufe 1 hob die Aufstiegsregel jedes sorgfältige Kind wieder heraus.
  if (zeitLassen || L <= 1)
    return { ...base, targetMs: TARGET_MS, struggleMs: STRUGGLE_MS, ignoreSpeed: true };
  const targetMs = 60000 / levelTargetCpm(L);
  return {
    ...base,
    targetMs,
    struggleMs: targetMs * STRUGGLE_MS_FACTOR,
    ignoreSpeed: false,
  };
}

const NORMAL = masteryFor("normal");

/** Bewertungsstufe eines Buchstabens für die Anzeige. */
export type LetterLevel = "neu" | "hakt" | "wackelig" | "sitzt";

export function emptyLetterStat(): LetterStat {
  return { hits: 0, misses: 0, sumMs: 0, timed: 0, recent: [] };
}

/**
 * Wie viele der letzten Anschläge in die Bewertung einfließen.
 *
 * ★ 28.08.2026 von 20 auf 60 erhöht (Entscheidung Johannes) — der eigentliche
 * Hebel hinter Janos 14 offenen Baustellen. Gemessen (`scripts/_fenstergroesse.mts`):
 *
 *   Ein Kind tippt mit gleichbleibend 93 % Treffsicherheit, alle Tasten gleich gut.
 *     Fenster 20 → 3,9 Tasten sehen wackelig aus, Tor offen in 40 % der Runden
 *     Fenster 60 → 1,7 Tasten,                    Tor offen in 91 % der Runden
 *
 * Beide Male DASSELBE Kind. Der Unterschied ist reiner Zufall: Bei 20 Anschlägen
 * und 8 % wahrer Fehlerquote zeigt eine Taste in gut jedem fünften Fenster drei
 * oder mehr Fehler — das Programm hielt Pech für Unvermögen. Bei 24 Tasten waren
 * so IMMER ein paar „wackelig", ohne dass sich am Können etwas geändert hätte.
 *
 * Erst bei 60 wird das Urteil außerdem fein genug (Auflösung 1,7 statt 5 Punkte),
 * dass die Leerzeichen-Gutschrift ({@link LEERZEICHEN_ANTEIL}) überhaupt eine
 * Grenze überschreiten kann — bei 20 war sie rechnerisch wirkungslos.
 *
 * ⚠️ Der Preis: Eine Taste braucht dreimal so viele Anschläge, bis ein alter
 * Fehler aus dem Fenster fällt. Für seltene Tasten (m, w, b) ist das lang —
 * dagegen arbeiten die gezielten Übungszeilen (`uebungsZeilenFuer`).
 *
 * ⚠️ Für BESTEHENDE Konten wächst das Fenster erst mit dem Üben: Gespeichert
 * sind 20 Einträge, `statView` rechnet mit `recent.length`. Es gibt also keinen
 * Sprung, sondern ein Einschwingen.
 */
export const RECENT_WINDOW = 60;

/** Aus Anschlägen zusammengefasste Sicht (Fenster, sonst Lebenszeit-Fallback). */
interface StatView {
  n: number;
  hits: number;
  ms: number | null;
}

/**
 * Bewertungs-Sicht eines Zeichens: bevorzugt das gleitende Fenster der letzten
 * Anschläge; nur für Altstände ohne Fenster wird auf die Lebenszeit-Summen
 * zurückgegriffen. So spiegelt „sitzt/wackelig" die AKTUELLE Fertigkeit wider.
 */
function statView(s: LetterStat | undefined): StatView {
  if (!s) return { n: 0, hits: 0, ms: null };
  const r = s.recent;
  if (r && r.length > 0) {
    let hits = 0;
    let sumMs = 0;
    let timed = 0;
    for (const x of r) {
      if (x < 0) continue; // Fehler
      hits += 1;
      if (x > 0) {
        sumMs += x;
        timed += 1;
      }
    }
    return { n: r.length, hits, ms: timed > 0 ? sumMs / timed : null };
  }
  const n = s.hits + s.misses;
  return { n, hits: s.hits, ms: s.timed > 0 ? s.sumMs / s.timed : null };
}

export function letterSamples(s: LetterStat | undefined): number {
  return statView(s).n;
}

/**
 * Treffsicherheit eines Zeichens — auf DEMSELBEN Maßstab wie die Runden-Anzeige,
 * also mit den anteiligen Leerzeichen im Nenner (siehe {@link LEERZEICHEN_ANTEIL}).
 *
 * Bewusst NUR hier und nicht in {@link letterSamples}: Die Gutschrift korrigiert
 * den Maßstab, sie ist aber keine Übung an dieser Taste — die Geduld-Regel
 * (`patienceSamples`) muss weiterhin echte Anschläge zählen.
 */
export function letterAccuracy(s: LetterStat | undefined): number {
  const v = statView(s);
  if (v.n <= 0) return 0;
  const frei = leerzeichenGutschrift(v.n);
  return (v.hits + frei) / (v.n + frei);
}

/** Durchschnittliche Anschlagszeit in ms (oder null, wenn ungemessen). */
export function letterMs(s: LetterStat | undefined): number | null {
  return statView(s).ms;
}

/**
 * Effektive Zeit-Schwellen (ms) eines Zeichens. Sie kombinieren:
 *  • das Eigen-Tempo des Kindes (`baseMs`, sein Grundreihen-Schnitt — sonst das
 *    nominelle Tempo-Ziel `m.targetMs`),
 *  • die Tempo-Stufe der Lehrkraft (über `m.targetMs / TARGET_MS`, damit
 *    „gemächlich" auch bei Eigen-Tempo-Normierung großzügiger bleibt),
 *  • den Schwierigkeits-Faktor des Zeichens ({@link keyDifficulty}).
 *
 * Wichtig: Das „sitzt"-Ziel (`targetMs`) skaliert voll mit dem Eigen-Tempo (fordert
 * schnelle Kinder, entlastet langsame). Die „hakt"-Schwelle (`struggleMs`) geht
 * dagegen NIE unter das nominelle Ziel — so wird eine objektiv ordentlich getippte
 * Taste bei schnellen Kindern nicht fälschlich als Problem markiert.
 */
function effectiveThresholds(
  m: Mastery,
  unit: string | undefined,
  lernweg: Lernweg,
  baseMs?: number,
): { targetMs: number; struggleMs: number } {
  const diff = unit ? keyDifficulty(unit, lernweg) : 1;
  const tempoScale = m.targetMs / TARGET_MS; // 1 = normal, >1 = gemächlich
  const targetRef = baseMs != null ? baseMs * tempoScale : m.targetMs;
  const struggleRef =
    baseMs != null ? Math.max(baseMs, TARGET_MS) * tempoScale : m.targetMs;
  return {
    targetMs: targetRef * diff,
    struggleMs: struggleRef * diff * STRUGGLE_MS_FACTOR,
  };
}

/**
 * @param lernweg ★ E2 (24.09.2026): Pflicht - `keyDifficulty` braucht die
 *   Heimattasten DES WEGES (Bauplan §11 Falle 6). Kein stiller Rückfall auf
 *   „de": Wege ohne echten Bezug (z. B. `ChordDojo`s Kürzel-Mastery, die keine
 *   Lernweg-Reihenfolge kennt) übergeben ausdrücklich „de" - siehe dort.
 */
export function letterLevel(
  s: LetterStat | undefined,
  m: Mastery = NORMAL,
  lernweg: Lernweg,
  unit?: string,
  baseMs?: number,
): LetterLevel {
  const samples = letterSamples(s);
  if (samples < m.minSamples) return "neu";
  const acc = letterAccuracy(s);
  // Satz-/Sonderzeichen sind „tolerant": schon nach weniger sauberen Anschlägen
  // „sitzt", und reine Langsamkeit macht sie NICHT „hakt" (nur echte Unsicherheit).
  const extra = unit ? isExtraUnit(unit) : false;
  const patience = extra
    ? Math.min(m.patienceSamples, EXTRA_PATIENCE_SAMPLES)
    : m.patienceSamples;
  // Automatische Anpassung: viel geübt + treffsicher → „sitzt", auch wenn langsam
  // (langsame, genaue Kinder bleiben so nicht hängen, siehe Mastery.patienceSamples).
  if (samples >= patience && acc >= m.targetAcc) return "sitzt";
  const ms = m.ignoreSpeed ? null : letterMs(s);
  const { targetMs, struggleMs } = effectiveThresholds(m, unit, lernweg, baseMs);
  // „hakt" = echte Unsicherheit (zu niedrige Treffsicherheit). Bei Satz-/Sonderzeichen
  // zählt reine Langsamkeit NICHT als „hakt" — sonst hängt man ewig an einem zähen
  // Zeichen; bei Buchstaben bremst zu langsames Tempo weiterhin (Grundlage).
  if (acc < m.struggleAcc || (!extra && ms !== null && ms > struggleMs)) return "hakt";
  if (acc >= m.targetAcc && (ms === null || ms <= targetMs)) return "sitzt";
  return "wackelig";
}

export function isMastered(
  s: LetterStat | undefined,
  m: Mastery = NORMAL,
  lernweg: Lernweg,
  unit?: string,
  baseMs?: number,
): boolean {
  return letterLevel(s, m, lernweg, unit, baseMs) === "sitzt";
}

/**
 * Treffsicherheit zum „solide gelernt" für die BRÜCKE zu den Lektionen.
 * Bewusst milder als das normale Ziel: zum Aufsperren einer Lektion genügt es,
 * das Zeichen treffsicher zu beherrschen — auf das Tempo kommt es hier nicht an.
 */
export const BRIDGE_ACC = 0.75;

/**
 * Hat die/der Lernende dieses Zeichen im adaptiven Training schon SOLIDE drauf —
 * über die gesamte Übungszeit, unabhängig vom Tempo?
 *
 * Eigens für die Brücke zwischen „Mein Training" und „Lektionen" (siehe
 * curriculum.ts). Drei bewusste Unterschiede zu {@link isMastered}:
 *  • LEBENSZEIT statt gleitendem Fenster — ein früher gut gelerntes Zeichen zählt
 *    weiter, auch wenn es zuletzt selten vorkam (das adaptive Training übt vor
 *    allem die schwachen Zeichen; alte, sitzende kommen seltener dran und würden
 *    aus dem Fenster fallen).
 *  • TEMPO egal — zum Freischalten einer Lektion reicht Treffsicherheit.
 *  • milder Schwellenwert ({@link BRIDGE_ACC}).
 * So öffnet „wer in Mein Training alle Buchstaben frei hat" auch die passenden
 * Lektionen, ohne dass ein frisch geschenkter (aber ungeübter) Grundreihen-Stand
 * schon Lektionen aufsperrt.
 */
export function bridgeLearned(s: LetterStat | undefined): boolean {
  if (!s) return false;
  const n = s.hits + s.misses;
  if (n < MIN_SAMPLES) return false;
  return s.hits / n >= BRIDGE_ACC;
}

/**
 * „Übungsbedarf" 0..1 (höher = dringender üben). Berücksichtigt Treffsicherheit
 * und Tempo; Buchstaben mit noch wenig Daten bekommen mäßigen Bedarf, damit sie
 * drankommen, aber gut sitzende Buchstaben fast keinen.
 */
/** @param lernweg ★ E2: Pflicht, siehe {@link letterLevel}. */
export function needScore(
  s: LetterStat | undefined,
  m: Mastery = NORMAL,
  lernweg: Lernweg,
  unit?: string,
  baseMs?: number,
): number {
  const n = letterSamples(s);
  if (n === 0) return 0.7; // noch nie geübt → soll vorkommen
  if (n < m.minSamples) return 0.6;
  const acc = letterAccuracy(s);
  const ms = m.ignoreSpeed ? null : letterMs(s);
  const { targetMs, struggleMs } = effectiveThresholds(m, unit, lernweg, baseMs);
  const accNeed = Math.min(
    1,
    Math.max(0, (m.targetAcc - acc) / m.targetAcc) +
      (acc < m.struggleAcc ? 0.3 : 0),
  );
  const msNeed =
    ms === null
      ? 0
      : Math.min(1, Math.max(0, (ms - targetMs) / (struggleMs - targetMs)));
  return Math.min(1, 0.6 * accNeed + 0.4 * msNeed);
}

/** Unter-/Obergrenze für das normierte Grundtempo (ms). */
export const BASE_MS_FLOOR = 450;
export const BASE_MS_CEIL = 1300;
/** So viele „sitzende" Grundreihen-Tasten braucht es, bevor normiert wird. */
export const BASE_MS_MIN_KEYS = 3;

/**
 * Eigen-Tempo eines Kindes als Referenz für die faire Zeitwertung (keybr-Prinzip):
 * der Median der Anschlagszeiten seiner schon „sitzenden" Grundreihen-Buchstaben
 * (Faktor 1,0). Daran wird das Zeit-Ziel jedes Zeichens skaliert
 * ({@link effectiveTargetMs}) — schnelle Kinder werden anspruchsvoller bewertet,
 * langsam-genaue nie blockiert. Zu wenig Daten (< {@link BASE_MS_MIN_KEYS}
 * gemessene Tasten) → Rückgabe des nominellen Ziels `m.targetMs` (kein Eingriff).
 */
/**
 * @param lernweg ★ E2 (24.09.2026): Pflicht - die Grundreihe (und damit die
 *   Referenz-Tasten) unterscheidet sich je Weg (Bauplan §3.3a: `;` statt `ö`).
 */
export function personalBaseMs(
  introduced: string[],
  letters: Record<string, LetterStat> | undefined,
  lernweg: Lernweg,
  m: Mastery = NORMAL,
): number {
  const homeKeys = lernwegDef(lernweg).homeKeys;
  const samples: number[] = [];
  for (const c of introduced) {
    if (!homeKeys.has(c)) continue;
    const s = letters?.[c];
    if (!s || letterSamples(s) < m.minSamples) continue;
    const ms = letterMs(s);
    // nur sicher sitzende Grundreihen-Tasten zählen (ohne Eigen-Tempo bewertet).
    if (ms !== null && letterLevel(s, m, lernweg, c) === "sitzt") samples.push(ms);
  }
  if (samples.length < BASE_MS_MIN_KEYS) return m.targetMs;
  samples.sort((a, b) => a - b);
  const mid = Math.floor(samples.length / 2);
  const median =
    samples.length % 2 === 0 ? (samples[mid - 1] + samples[mid]) / 2 : samples[mid];
  return Math.max(BASE_MS_FLOOR, Math.min(BASE_MS_CEIL, median));
}

export interface KeyEvent {
  /** getipptes Soll-Zeichen (kleingeschrieben). */
  char: string;
  correct: boolean;
  /** Anschlagszeit in ms (nur bei sauberen, gemessenen Treffern gesetzt). */
  ms?: number;
}

/** Eine Charge Anschlags-Ereignisse in die Zeichen-Statistik einrechnen (immutabel). */
export function mergeLetters(
  prev: Record<string, LetterStat> | undefined,
  events: readonly KeyEvent[],
): Record<string, LetterStat> {
  const out: Record<string, LetterStat> = { ...(prev ?? {}) };
  for (const ev of events) {
    const c = ev.char;
    if (!c || c === " ") continue;
    const prevS = out[c];
    const s: LetterStat = prevS
      ? { ...prevS, recent: prevS.recent ? [...prevS.recent] : [] }
      : emptyLetterStat();
    if (ev.correct) {
      s.hits += 1;
      const ms = typeof ev.ms === "number" && ev.ms > 0 ? ev.ms : 0;
      if (ms > 0) {
        s.sumMs += ms;
        s.timed += 1;
      }
      s.recent!.push(ms); // ms>0 = getakteter Treffer, 0 = Treffer ohne Zeit
    } else {
      s.misses += 1;
      s.recent!.push(-1); // Fehler
    }
    if (s.recent!.length > RECENT_WINDOW) {
      s.recent = s.recent!.slice(-RECENT_WINDOW);
    }
    out[c] = s;
  }
  return out;
}

/**
 * ★ E2 (24.09.2026): die 8. Grundtaste des Weges „en" auf einer DEUTSCHEN
 * oder SCHWEIZER Tastatur (Bauplan §1.2 F3, §3.3a).
 *
 * Auf US/UK ist diese Taste „;" - ein reiner Fingeranker unter dem kleinen
 * Finger rechts, kein Buchstabe eines echten Wortes (F2: „der Finger lernt,
 * wo er ruht"). AUF EINER DEUTSCHEN/SCHWEIZER TASTATUR SITZT DORT PHYSISCH
 * EINE ANDERE TASTE: „ö" - „;" läge dort unter dem Ringfinger, an einer
 * völlig anderen Stelle. F3 erlaubt den englischen Weg ausdrücklich auf einer
 * deutschen Tastatur (Englischsprachige in Österreich); die Grundreihe muss
 * darum die TASTE nennen, die dort wirklich liegt.
 *
 * Ersetzt wird NUR diese eine Position (Index {@link LernwegDef.homeRowLetters}
 * minus 1) - das Satzzeichen „;" weiter hinten in der Reihenfolge (§3.3a: „;"
 * gehört NICHT zu den englischen Satzzeichen, es steht ja schon vorn) bleibt
 * unberührt; auf Weg „de" oder auf US/UK ändert sich nichts.
 *
 * ★ E3 (25.09.2026, Bauplan §3.1): Weg „fr" hat jetzt eine ECHTE AZERTY-
 * Grundreihe (`q s d f j k l m`, `lernweg.ts#FR_LETTER_ORDER` - die
 * „Grundform" nach Bauplan §10.1). Auf Schweiz-Französisch/Kanada liegen
 * ERSTE und ACHTE Grundtaste physisch anders (`a … é`/`a … ;`) - anders als
 * bei „en" reicht ein Austausch an EINER Stelle darum nicht mehr, siehe
 * {@link FR_GRUNDREIHE_ENDEN}. Ohne gewählte französische Tastatur (Übergang
 * vor E5/E6) gilt weiter die alte, geliehene Regel (de/ch ⇒ „ö", sonst „;").
 */
const FR_GRUNDREIHE_ENDEN: Partial<Record<LayoutId, { erste: string; achte: string }>> = {
  fr: { erste: "q", achte: "m" },
  be: { erste: "q", achte: "m" },
  "ch-fr": { erste: "a", achte: "é" },
  "ca-csa": { erste: "a", achte: ";" },
  "ca-fr": { erste: "a", achte: ";" },
};

/**
 * ★★★ F4-it (02.10.2026, Bauplan italienischer Lehrgang I2, Befund F4-it §6): die achte Grundtaste nach der TABELLE
 * des Weges ({@link LernwegDef.achteGrundtasten}) - eine EIGENSCHAFT des Weges, keine Sprach-Kennung (Falle 50).
 *
 * Der Wert der Tastatur (`m` auf der Mac-QZERTY, `é` auf Schweiz-Französisch, `ö` auf der Schweizer Belegung)
 * ersetzt die Einheit an der achten Stelle (`ò`); steht er weiter hinten in der Folge, fällt er dort weg; die
 * verdrängte Einheit kommt direkt nach {@link LernwegDef.verdraengtNach}. Gemessen (Befund §6): so bleibt die
 * Abdeckung der Sätze auf der QZERTY auf der Höhe der gierigen Suche, ein einfaches Vertauschen von `m` und `ò`
 * kostet an den Sprossen 17-21 rund 10 Punkte. Eine Tastatur ohne Eintrag (die Bezugsbelegung `it` und jede
 * andere) ändert nichts.
 */
function achteGrundtasteNachTabelle(order: readonly string[], def: LernwegDef, layout: LayoutId): string[] {
  const ziel = def.achteGrundtasten?.[layout];
  if (ziel === undefined) return [...order];
  const stamm = def.letterOrder[def.homeRowLetters - 1]; // die achte Einheit des Weges selbst (Italienisch: ò)
  const i = order.indexOf(stamm);
  if (i < 0 || i >= def.homeRowLetters) return [...order]; // auf dieser Tastatur gibt es sie nicht - nichts zu tauschen
  const gesehen = new Set<string>();
  const ohneDoppelte = order
    .map((u, j) => (j === i ? ziel : u))
    .filter((u) => (gesehen.has(u) ? false : (gesehen.add(u), true)));
  const nach = def.verdraengtNach === undefined ? -1 : ohneDoppelte.indexOf(def.verdraengtNach);
  const stelle = nach >= 0 ? nach + 1 : ohneDoppelte.length;
  return [...ohneDoppelte.slice(0, stelle), stamm, ...ohneDoppelte.slice(stelle)];
}

export function achteGrundtasteFuerLayout(
  order: readonly string[],
  lernweg: Lernweg,
  layout: LayoutId,
): string[] {
  if (lernweg === "de") return [...order];
  // ★ F4-it: Wege mit eigener Tabelle der achten Grundtaste (Italienisch) - an der Eigenschaft, nicht am Namen.
  if (lernwegDef(lernweg).achteGrundtasten) return achteGrundtasteNachTabelle(order, lernwegDef(lernweg), layout);
  if (lernweg === "fr") {
    const ziel = FR_GRUNDREIHE_ENDEN[layout] ?? {
      erste: "a",
      achte: layout === "de" || layout === "ch" ? "ö" : ";",
    };
    const idx8 = lernwegDef(lernweg).homeRowLetters - 1;
    const verdraengt: string[] = [];
    const gemappt = order.map((u, i) => {
      // ★ 26.09.2026: „q" steht seit der Anker-Folge (f j d k s l q m) nicht
      // mehr vorne - am WERT erkannt, innerhalb der Grundreihe.
      if (i < idx8 && (u === "q" || u === "a")) {
        if (u !== ziel.erste) verdraengt.push(u);
        return ziel.erste;
      }
      if (i === idx8 && (u === "m" || u === ";" || u === "é")) {
        if (u !== ziel.achte) verdraengt.push(u);
        return ziel.achte;
      }
      return u;
    });
    // ★ Fassung A2 (25.09.2026): Auf Schweiz-Französisch/Kanada stehen „a" und
    // „é" schon in der Grundreihe - ihr späterer Platz in der AZERTY-Folge fällt
    // weg (keine Einheit doppelt). Die verdrängten AZERTY-Grundtasten „q m"
    // kommen dort nach „h" (E5-Messung, Befund §8.2: Schweiz/Kanada setzen „q"
    // nach „h"). Auf fr/be ändert sich nichts.
    const gesehen = new Set<string>();
    const ohneDoppelte = gemappt.filter((u) => (gesehen.has(u) ? false : (gesehen.add(u), true)));
    const fehlend = verdraengt.filter((u) => u !== ";" && !gesehen.has(u));
    let folge = ohneDoppelte;
    // ★ S1 (Mechanik-Prüfung fr, 26.09.2026): E5 (§8.2) hat für Schweiz und
    // Kanada NUR „q" nach „h" gemessen - „m" gehört direkt nach „p". Gemessen
    // (m12, ch-fr): an den Sprossen 17-24 dadurch +60-90 % passende Zeilen.
    const einfuegen = (liste: string[], u: string, nach: string): string[] => {
      const i = liste.indexOf(nach);
      const stelle = i >= 0 ? i + 1 : liste.length;
      return [...liste.slice(0, stelle), u, ...liste.slice(stelle)];
    };
    for (const u of fehlend.filter((x) => x === "m")) folge = einfuegen(folge, u, "p");
    const nachH = fehlend.filter((x) => x !== "m");
    if (nachH.length) {
      const i = folge.indexOf("h");
      const stelle = i >= 0 ? i + 1 : folge.length;
      folge = [...folge.slice(0, stelle), ...nachH, ...folge.slice(stelle)];
    }
    // ★ S2 (26.09.2026): Wo der Apostroph die Umschalttaste braucht (Kanada:
    // Umschalt + Komma, Mac gemessen), kommt er direkt NACH „⇧" - vorher
    // verlangte er die Umschalttaste samt Gegenhand-Regel, bevor sie erklärt war.
    const apo = folge.indexOf("'");
    const maj = folge.indexOf(SHIFT_UNIT);
    if (apo >= 0 && maj > apo && layoutById(layout).access["'"]?.mod === "shift") {
      const ohne = folge.filter((u) => u !== "'");
      folge = einfuegen(ohne, "'", SHIFT_UNIT);
    }
    return folge;
  }
  // Weg „en" (unverändert wie zuvor).
  if (layout !== "de" && layout !== "ch") return [...order];
  const idx = lernwegDef(lernweg).homeRowLetters - 1;
  return order.map((u, i) => (i === idx && u === ";" ? "ö" : u));
}

/**
 * Die Einführungsreihenfolge auf der EINGESTELLTEN Tastatur: Einheiten, die es
 * dort nicht gibt (Schweiz: ß; englische Tastaturen: ä ö ü ß …), fallen heraus —
 * sie können weder freigeschaltet noch geübt werden. Beim deutschen Layout ist
 * das Ergebnis auf Weg „de" mit {@link INTRO_ORDER} identisch.
 *
 * ★ E1 (24.09.2026): `lernweg` ist Pflicht - der Weg DES KINDES, auch wenn eine
 * Lehrkraft auf seinen Stand schaut. Kein stiller Rückfall auf „de" in der
 * Signatur, sonst übersieht man eine Stelle.
 *
 * ★ E2: danach noch {@link achteGrundtasteFuerLayout} - siehe dort.
 */
export function introOrder(lernweg: Lernweg): string[] {
  const gefiltert = onlyExistingKeys(lernwegDef(lernweg).introOrder);
  return achteGrundtasteFuerLayout(gefiltert, lernweg, activeLayoutId());
}

/**
 * ★★★★★ D-1 (28.09.2026): die Startpunkt-Zählung des Weges auf der
 * EINGESTELLTEN Tastatur - dieselbe Filterung und Grundreihen-Abbildung wie
 * {@link introOrder}, nur aus `startpunktFolge` (Punkt und Komma an ihrem
 * Platz vor D-1). Dieselben Einheiten wie `introOrder(lernweg)`, andere
 * Reihenfolge. Nur zum ABZÄHLEN einer Startpunkt-Zahl
 * ({@link introducedUpTo}, {@link startPoints}, Tippchallenge-Niveaus) -
 * nie für „welche Taste kommt als nächste". Warum: `baueStartpunktFolge`.
 */
export function startpunktFolge(lernweg: Lernweg): string[] {
  const gefiltert = onlyExistingKeys(lernwegDef(lernweg).startpunktFolge);
  return achteGrundtasteFuerLayout(gefiltert, lernweg, activeLayoutId());
}

/**
 * ★ D-1: Wie weit reicht ein Stand in der Startpunkt-Zählung? Die grösste
 * Anzahl `n`, deren erste `n` Einheiten der {@link startpunktFolge} alle
 * freigeschaltet sind. Für ein Kind, das der Folge vor D-1 gefolgt ist, ist
 * das genau `introduced.length`; für eines, das Punkt und Komma schon direkt
 * nach ⇧ bekommen hat, zählen sie erst dort, wo die Startpunkte sie zählen -
 * sonst zeigte das Feld „Womit anfangen?" einen Startpunkt, dessen Tasten dem
 * Kind noch fehlen.
 */
export function startpunktStand(introduced: string[] | undefined, lernweg: Lernweg): number {
  const haben = new Set(ensureIntroduced(introduced, lernweg));
  const folge = startpunktFolge(lernweg);
  let n = 0;
  while (n < folge.length && haben.has(folge[n])) n++;
  return n;
}

/**
 * NUR die Buchstaben (ohne `⇧`, Satzzeichen, Ziffern, Sonderzeichen) - für
 * Anzeigen wie die Hilfe-Fenster, die „die Buchstabenreihenfolge" zeigen
 * wollen, keine ganze Einführungsreihenfolge. Auf der eingestellten Tastatur
 * (wie {@link introOrder}) UND mit der 8. Grundtaste des Weges (siehe
 * {@link achteGrundtasteFuerLayout}) - eine deutsche Hilfe für einen
 * englischen Weg auf österreichischer Tastatur würde sonst „;" versprechen,
 * wo physisch „ö" liegt.
 */
export function layoutLetterOrder(lernweg: Lernweg): string[] {
  const gefiltert = onlyExistingKeys(lernwegDef(lernweg).letterOrder);
  return achteGrundtasteFuerLayout(gefiltert, lernweg, activeLayoutId());
}

/** Die anfänglich freigeschalteten Einheiten (Grundstellung). */
export function defaultIntroduced(lernweg: Lernweg): string[] {
  return introOrder(lernweg).slice(0, lernwegDef(lernweg).initialLetters);
}

/** Vorhandene Freischaltung absichern (Altstände/leere Stände). */
export function ensureIntroduced(introduced: string[] | undefined, lernweg: Lernweg): string[] {
  if (!introduced || introduced.length === 0) return defaultIntroduced(lernweg);
  // nur bekannte Einheiten, in kanonischer Reihenfolge — und nur solche, die es
  // auf dieser Tastatur überhaupt gibt (sonst stünde ein ß im Stand eines Kindes
  // mit Schweizer Tastatur und würde als Übung serviert).
  const order = introOrder(lernweg);
  const set = new Set(introduced.filter((c) => order.includes(c)));
  const ordered = order.filter((c) => set.has(c));
  return ordered.length >= lernwegDef(lernweg).initialLetters
    ? ordered
    : defaultIntroduced(lernweg);
}

/** Nächste noch nicht freigeschaltete Einheit (oder null = alles gelernt). */
export function nextLetter(introduced: string[], lernweg: Lernweg): string | null {
  const set = new Set(introduced);
  return introOrder(lernweg).find((c) => !set.has(c)) ?? null;
}

/**
 * Die nächsten `anzahl` noch nicht freigeschalteten Einheiten, in der
 * Reihenfolge, in der sie kommen - leer, wenn alles gelernt ist.
 *
 * ★ 25.09.2026 (Testerin, Entscheidung Johannes): Die Lehrkraft sieht in „Meine
 * Klassen" die nächsten ZWEI Tasten je Kind. Für Kinder mit Autismus ist es
 * wichtig zu wissen, was als Nächstes kommt - die Lehrkraft kann es ihnen so
 * vorher sagen.
 */
export function naechsteTasten(introduced: string[], lernweg: Lernweg, anzahl: number): string[] {
  const set = new Set(introduced);
  return introOrder(lernweg).filter((c) => !set.has(c)).slice(0, anzahl);
}

/**
 * Die ersten `count` Einheiten der Einführungsreihenfolge - der Stand an
 * SPROSSE `count` des Lehrgangs (Messskripte, Wächter, Handbücher).
 *
 * ⚠️ `count` ist eine ANZAHL (Bauplan §2.4, die Zahlen-Falle): „22" heisst auf
 * jedem Weg etwas anderes. Darum nur mit dem Weg des Kindes lesen.
 *
 * ★★★★★ D-1 (28.09.2026): NICHT für einen STARTPUNKT - eine gespeicherte
 * Startpunkt-Zahl zählt in der Folge vor D-1, siehe {@link startpunktEinheiten}.
 */
export function introducedUpTo(count: number, lernweg: Lernweg): string[] {
  const order = introOrder(lernweg);
  return order.slice(
    0,
    Math.max(lernwegDef(lernweg).initialLetters, Math.min(count, order.length)),
  );
}

/**
 * ★★★★★ D-1 (28.09.2026): die Tasten eines STARTPUNKTS (`startUnits` am Konto
 * oder an der Klasse, `units` eines benannten Startpunkts, der Vermerk im
 * Fortschritt). Abgezählt in der STARTPUNKT-ZÄHLUNG (Reihenfolge vor D-1,
 * {@link startpunktFolge}), damit jede gespeicherte Zahl dieselben Tasten
 * meint wie vorher; zurück kommt die Menge in der Lehrgangs-Reihenfolge
 * (`introOrder`), so wie `ensureIntroduced` sie ordnet. Wächter:
 * `tests/tastenflow-d1-punkt-komma.test.ts`.
 */
export function startpunktEinheiten(count: number, lernweg: Lernweg): string[] {
  const zaehlung = startpunktFolge(lernweg);
  const n = Math.max(lernwegDef(lernweg).initialLetters, Math.min(count, zaehlung.length));
  const menge = new Set(zaehlung.slice(0, n));
  return introOrder(lernweg).filter((c) => menge.has(c));
}

/**
 * Der Startpunkt, angewandt auf ein Kind, das SCHON ÜBT - die DAZUNEHMENDE
 * Hälfte der Regel.
 *
 * ★★★★★ VON SELBST WIRD NIE WEGGENOMMEN.
 *
 * Anlass (Testerin, 01.09.2026): *„Klassiker bei uns ist, dass Schüler zwar die
 * Buchstaben können, aber nicht die Ziffern. Das hätte ich gern zum
 * Auswählen."* Der Startpunkt beschreibt VORKENNTNISSE. Ein Wert, der bei
 * jedem Laden neu angewandt wird, darf deshalb nur dazunehmen: Stünde ein Kind
 * schon weiter, als einmal eingetragen wurde, verlöre es sonst bei jedem
 * Öffnen Tasten, die es längst gelernt hat - und mit ihnen den Sinn seiner
 * Anschlag-Statistik, an der das Tor zur nächsten Taste hängt.
 *
 * ⚠️ ZURÜCKSTUFEN GIBT ES TROTZDEM - aber nur auf ausdrücklichen Beschluss und
 * genau EINMAL je Beschluss: {@link startpunktAnwenden}. Diese Funktion hier
 * ist die Automatik, und eine Automatik nimmt nichts weg.
 *
 * @returns die neue Liste - oder `null`, wenn nichts dazukommt (der Normalfall;
 *          der Aufrufer spart sich dann das Speichern).
 */
export function startpunktAngleichen(
  introduced: string[] | undefined,
  startUnits: number | undefined,
  lernweg: Lernweg,
): string[] | null {
  if (!startUnits || startUnits <= lernwegDef(lernweg).initialLetters) return null;
  const haben = new Set(ensureIntroduced(introduced ?? [], lernweg));
  let neu = false;
  for (const c of startpunktEinheiten(startUnits, lernweg))
    if (!haben.has(c)) {
      haben.add(c);
      neu = true;
    }
  if (!neu) return null;
  // Über `introOrder()` gefiltert, damit die Reihenfolge die Lehrgangs-Ordnung
  // bleibt und keine Taste auftaucht, die es auf dieser Tastatur nicht gibt.
  return introOrder(lernweg).filter((c) => haben.has(c));
}

/** Was ein Kind vom Startpunkt zuletzt übernommen hat (steht im Fortschritt). */
export interface StartpunktVermerk {
  /** Der übernommene Wert. `undefined` = noch nie etwas übernommen. */
  units?: number;
  /** Der übernommene Beschluss-Zeitpunkt (ms). 0/`undefined` = keiner. */
  am?: number;
}

export interface StartpunktErgebnis {
  /** Die neue Freischaltung - `null`, wenn sie unverändert bleibt. */
  introduced: string[] | null;
  /** Was sich der Fortschritt merken muss, damit es EINMAL geschieht. */
  vermerk: { units: number; am: number };
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ DER STARTPUNKT, WIE IHN DAS KIND BEIM LADEN ÜBERNIMMT
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Anlass (Johannes, 04.09.2026): *„Lehrer dürfen ihre Schüler auch
 * downgraden … wer sich sein Startlevel einstellen kann, soll es auch wieder
 * weniger hoch stellen können - hatten gerade das Problem mit dem Schüler Said,
 * das Startlevel war zu hoch eingestellt."*
 *
 * Bis heute konnte der Startpunkt nur STEIGEN. Ein zu hoch eingetragener Wert
 * war damit unumkehrbar: Das Kind bekam Tasten geschenkt, die es nicht kann,
 * und niemand konnte sie zurücknehmen.
 *
 * ── DIE ZWEI HÄLFTEN, DIE NICHT VERWECHSELT WERDEN DÜRFEN ──────────────────
 *
 *  • **Automatik** (bei jedem Laden): nimmt nur DAZU ({@link startpunktAngleichen}).
 *    Sie muss das, weil sie sich wiederholt - eine Zuweisung, die bei jedem
 *    Öffnen läuft, würde ein Kind für immer auf seinem Startpunkt festnageln:
 *    Jede Taste, die es sich danach erübt hat, wäre beim nächsten Start weg.
 *  • **Beschluss** (jemand stellt den Startpunkt ein): gilt in BEIDE
 *    Richtungen - und wird genau EINMAL angewandt.
 *
 * ★ WORAN EIN NEUER BESCHLUSS ERKANNT WIRD: am Zeitpunkt (`gesetztAm`), den das
 *   Konto beim Einstellen mitschreibt. Das Kind vermerkt in seinem Fortschritt,
 *   welchen Beschluss es übernommen hat. **Der Wert allein genügt nicht:** Eine
 *   Lehrkraft, die ein Kind auf denselben Wert zurückstellt, den sie damals
 *   eingetragen hat, träfe sonst auf ein Bedienelement, das nichts tut - die
 *   schlimmste Sorte Schalter.
 *
 * ★ ALT-KONTEN (Startpunkt ohne Zeitpunkt, vor dem 04.09.2026 eingetragen):
 *   Es wird NICHTS zurückgestuft. Ohne Beschluss-Zeitpunkt ist nicht
 *   unterscheidbar, ob der Wert gerade gewählt wurde oder seit Monaten
 *   dasteht - und ein Kind, das sich weit geübt hat, darf das nicht bezahlen.
 *   Es läuft die Automatik, und der Vermerk wird nachgetragen; ab dem nächsten
 *   Beschluss greift die volle Regel.
 *
 * ⚠️ WAS DAS ZURÜCKSTUFEN NICHT ANFASST: Anschlag-Statistik, Zeitstempel der
 *    Freischaltungen, Abzeichen, Übezeit, Sterne. Zurückgestuft wird nur, was
 *    gerade als Übungsstoff SERVIERT wird. Johannes ausdrücklich: *„bestehende
 *    Abzeichen können bleiben."* Wer später wieder hochstellt, findet seine
 *    Zahlen unverändert vor.
 *
 * @param introduced  Stand des Kindes (freigeschaltete Einheiten).
 * @param startUnits  Der eingestellte Startpunkt.
 * @param gesetztAm   Wann er eingestellt wurde (ms) - 0 bei Alt-Konten.
 * @param vermerk     Was das Kind zuletzt übernommen hat.
 * @param lernweg     ★ E1: der Weg des Kindes - `startUnits` ist eine Anzahl
 *                    und gilt nur in ihm (Bauplan §2.4).
 * @returns was zu tun ist - oder `null`, wenn nichts zu tun ist (der Normalfall;
 *          der Aufrufer spart sich dann das Speichern).
 */
export function startpunktAnwenden(
  introduced: string[] | undefined,
  startUnits: number | undefined,
  gesetztAm: number | undefined,
  vermerk: StartpunktVermerk | undefined,
  lernweg: Lernweg,
): StartpunktErgebnis | null {
  const units = Math.max(0, Math.round(startUnits ?? 0));
  const am = Math.max(0, Math.round(gesetztAm ?? 0));
  const gemerktAm = Math.max(0, Math.round(vermerk?.am ?? 0));
  const schonVermerkt = vermerk?.units === units && gemerktAm === am;

  // Ein Beschluss, den dieses Kind noch nicht übernommen hat. Ohne Zeitpunkt
  // (Alt-Konto) gibt es keinen Beschluss - siehe Kopf.
  const neuerBeschluss = am > 0 && am !== gemerktAm;

  if (neuerBeschluss) {
    const stand = ensureIntroduced(introduced ?? [], lernweg);
    const gewollt = startpunktEinheiten(units, lernweg);
    const gleich =
      gewollt.length === stand.length && gewollt.every((c, i) => stand[i] === c);
    return { introduced: gleich ? null : gewollt, vermerk: { units, am } };
  }

  // Sonst die Automatik: nur dazunehmen.
  const dazu = startpunktAngleichen(introduced, units, lernweg);
  if (!dazu && schonVermerkt) return null;
  return { introduced: dazu, vermerk: { units, am } };
}

/** Benannte Startpunkte im Lernstoff (Lehrkraft wählt beim Anlegen). */
export interface StartPoint {
  key: string;
  label: string;
  /** So viele Einheiten sind beim Start schon freigeschaltet. */
  units: number;
}

/**
 * @param sprache ★ EN2 (19.09.2026): die Sprache der Bedienung für die
 *   BESCHRIFTUNG - Glossar §3.4 (*starting point*), dieselben Wörter wie die
 *   Tastaturniveaus der Tippchallenge (`NIVEAU_DEFS.en`). Schlüssel und
 *   Einheiten sind in beiden Sprachen gleich.
 * @param lernweg ★ E1 (24.09.2026): der Weg, dessen Landmarken gemeint sind -
 *   PFLICHT. Die `units` sind ANZAHLEN und gelten nur in diesem Weg (Bauplan
 *   §2.4). Bei einem Kind sein Weg, bei einer Klasse der Weg der Klasse. Die
 *   Sprache ist darum ebenfalls Pflicht geworden: Beide Parameter haben
 *   dieselben Werte („de"/„en"), und ein vergessener zweiter wäre sonst nicht
 *   von einem vertauschten zu unterscheiden.
 */
export function startPoints(sprache: BedienSprache, lernweg: Lernweg): StartPoint[] {
  const weg = lernwegDef(lernweg);
  // ★ M4 (Mechanik-Prüfung fr, 27.09.2026): Die Landmarken werden AM WERT in
  // der Folge DER EINGESTELLTEN TASTATUR abgelesen (`introOrder(lernweg)`:
  // gefiltert UND mit der Grundreihe dieser Tastatur). Vorher kamen sie aus
  // der Weg-Folge (`weg.introOrder`, AZERTY) und wurden nur gezählt - auf
  // Schweiz-Französisch/Kanada schoben `a é`/`a ;` in der Grundreihe alles um
  // eine Stelle: „Premières lettres" nahm dort das „b" (ch-fr) bzw. den
  // Apostroph (Kanada) mit, „Toutes les lettres" liess auf Kanada das „¨"
  // weg. Auf de/en (dort wird nur an Ort und Stelle getauscht) und auf
  // AZERTY rechnerisch dieselben Zahlen - Wächter `tastenflow-defi-fr-tastaturen`.
  // ★★★★★ D-1 (28.09.2026): die Landmarken werden in der STARTPUNKT-ZÄHLUNG
  // abgezählt (Reihenfolge vor D-1) - die Zahlen stehen live an Konten und
  // Klassen und müssen dieselben Tasten meinen wie vorher. In der neuen Folge
  // stünde die erste Satzzeichen-Stelle direkt nach ⇧, und „Alle Buchstaben"
  // wäre auf „Erste Buchstaben + Punkt" geschrumpft.
  const order = startpunktFolge(lernweg);
  const homeRow = onlyExistingKeys(weg.introOrder.slice(0, weg.homeRowLetters)).length;
  const punkt = new Set(weg.punctOrder);
  const ziffer = new Set(weg.digitOrder);
  /** Stelle NACH der letzten Einheit einer Menge (ausserhalb der Grundreihe - Kanada: „;"). */
  const nachLetzter = (menge: ReadonlySet<string>): number => {
    let i = -1;
    order.forEach((u, j) => {
      if (j >= homeRow && menge.has(u)) i = j;
    });
    return i + 1;
  };
  const afterShift = order.indexOf(SHIFT_UNIT) + 1; // erste Buchstaben + ⇧
  const lettersDone = order.findIndex((u, j) => j >= homeRow && punkt.has(u)); // alle Buchstaben + ⇧
  const reihe = order.slice(0, homeRow).join(" ");
  // ★ E11a-3 (26.09.2026): Tabelle statt Ternäre - dieselben sieben
  // Landmarken in allen drei Bedienungssprachen (Glossar §9.2: la position
  // de départ, la rangée de base).
  const LABELS: Record<BedienSprache, [string, string, string, string, string, string, string]> = mitRueckfallEn(/* RÜCKFALL-EN (G2a) */ {
    de: [
      "Anfänger: nur F und J",
      `Grundstellung (ganze Grundreihe ${reihe})`,
      "Erste Buchstaben + Großschreibung",
      "Alle Buchstaben (mit Großschreibung)",
      "+ Satzzeichen",
      "+ Zahlen",
      "Alles (auch Sonderzeichen)",
    ],
    en: [
      "Beginner: just F and J",
      `Home position (whole home row ${reihe})`,
      "First letters + capitals",
      "All letters (with capitals)",
      "+ punctuation",
      "+ numbers",
      "Everything (symbols too)",
    ],
    fr: [
      "Débutant : seulement F et J",
      `Position de départ (toute la rangée de base ${reihe})`,
      "Premières lettres + majuscules",
      "Toutes les lettres (avec majuscules)",
      "+ ponctuation",
      "+ chiffres",
      "Tout (aussi les caractères spéciaux)",
    ],
    // ★ ES-O (27.09.2026): Glossar Bauplan §7 (fila guía, posición inicial).
    es: [
      "Principiante: solo F y J",
      `Posición inicial (toda la fila guía ${reihe})`,
      "Primeras letras + mayúsculas",
      "Todas las letras (con mayúsculas)",
      "+ signos de puntuación",
      "+ números",
      "Todo (también caracteres especiales)",
    ],
  });
  const l = LABELS[sprache];
  return [
    { key: "anfaenger", label: l[0], units: weg.initialLetters },
    { key: "start", label: l[1], units: homeRow },
    { key: "gross", label: l[2], units: afterShift },
    { key: "buchstaben", label: l[3], units: lettersDone },
    { key: "satz", label: l[4], units: nachLetzter(punkt) },
    { key: "zahlen", label: l[5], units: nachLetzter(ziffer) },
    { key: "alles", label: l[6], units: order.length },
  ];
}

/**
 * Sitzen ALLE freigeschalteten Einheiten (treffsicher + zügig + genug Übung)?
 * @param lernweg ★ E2: Pflicht, siehe {@link personalBaseMs}.
 */
export function allMastered(
  introduced: string[],
  letters: Record<string, LetterStat> | undefined,
  lernweg: Lernweg,
  m: Mastery = NORMAL,
): boolean {
  const base = personalBaseMs(introduced, letters, lernweg, m);
  return introduced.every((c) => isMastered(letters?.[c], m, lernweg, c, base));
}

/**
 * So viele freigeschaltete Einheiten dürfen noch „wackelig" (oder frisch „neu")
 * sein, ohne den nächsten Buchstaben zu blockieren. Wunsch von Johannes: neue
 * Buchstaben sollen schon kommen, wenn bis zu 3 der bisherigen noch wackeln —
 * man muss nicht warten, bis ausnahmslos alle perfekt „sitzen". Ein klar
 * HAKENDER Buchstabe blockiert aber weiterhin (sonst überfordert es).
 */
export const MAX_WOBBLY = 3;

/**
 * Darf der nächste Buchstabe dazukommen? Ja, wenn höchstens {@link MAX_WOBBLY}
 * der freigeschalteten Einheiten noch nicht „sitzen" (also „wackelig"/„neu") UND
 * keine davon richtig „hakt". So bleiben langsame Lernende nicht an einem
 * einzelnen zähen Buchstaben hängen, ohne dass sich offene Baustellen stapeln.
 */
/**
 * Über so viele Runden OHNE neue Taste gleitet das Tor von voller Strenge auf
 * ganz offen. Danach kommt die nächste Taste in jedem Fall.
 *
 * Warum es das gibt (Entscheidung Johannes 28.08.2026): „Es darf nicht sein,
 * dass ein Kind ewig keine neuen Tasten bekommt." Gemessen (`_torrechnung.mts`)
 * war das Tor kein sanfter Anstieg, sondern eine Klippe: Bei 95 % Treffsicherheit
 * geht es in 83 % der Runden auf, bei 90 % nur noch in 2 %, ab 88 % faktisch nie
 * — und zwar unabhängig davon, wie fleißig geübt wird. Ein Kind auf der falschen
 * Seite dieser Klippe stand vorher endgültig.
 *
 * 40 Runden sind bei üblichem Übungsverhalten rund eine bis zwei Wochen. Wer gut
 * tippt, merkt von der Regel nie etwas — sein Zähler wird ständig zurückgesetzt.
 */
export const GEDULD_SPANNE = 40;

/**
 * Wie weit ist das Tor nach `runden` ohne neue Taste schon aufgeglitten?
 * 0 = volle Strenge, 1 = ganz offen.
 */
export function geduldsFaktor(runden: number | undefined): number {
  if (!runden || runden <= 0) return 0;
  return Math.min(1, runden / GEDULD_SPANNE);
}

/**
 * Die nachgelassenen Schwellen nach `runden` ohne neue Taste — die beiden
 * Regeln, die Johannes gewählt hat, in EINER Rechnung:
 *  • „Deckel wächst mit": die erlaubten offenen Baustellen steigen von
 *    {@link MAX_WOBBLY} bis auf alle freigeschalteten Einheiten.
 *  • „Maßstab sinkt langsam": die Sperr-Quote sinkt von `struggleAcc` auf 0 —
 *    am Ende hakt keine Taste mehr.
 * Beides GLEICHZEITIG, damit nicht eine der beiden Bedingungen allein weiter
 * zumacht (genau daran wäre die Regel sonst wirkungslos geblieben).
 */
export function nachgelassen(
  m: Mastery,
  anzahlEinheiten: number,
  runden: number | undefined,
): { maxWobbly: number; struggleAcc: number } {
  const g = geduldsFaktor(runden);
  return {
    maxWobbly: Math.round(MAX_WOBBLY + g * (anzahlEinheiten - MAX_WOBBLY)),
    struggleAcc: m.struggleAcc * (1 - g),
  };
}

/**
 * MINDEST-ÜBUNG je Taste (Entscheidung Johannes 28.08.2026: „es gibt auch ein zu
 * früh, Genauigkeit vor Geschwindigkeit").
 *
 * Vorher gab es gar keine Untergrenze: `canAdvance` wird nach JEDER Runde
 * geprüft, und gemessen (`scripts/_tempo.mts`) bekam ein Kind mit 95 %
 * Treffsicherheit eine neue Taste pro Runde — 18 Tasten in EINER Stunde. Mit
 * 10 Runden Mindestübung sind es rund 12 Stunden, und das entspricht in etwa
 * dem, was ein echtes Kind ohnehin braucht (Jano: 26 min je Taste gemessen).
 *
 * Die Regel greift ZUSÄTZLICH zur Freischalt-Bedingung, nie statt ihrer: Wer
 * lange übt, aber noch nicht so weit ist, bekommt trotzdem keine Taste — dafür
 * ist die Geduld-Regel ({@link GEDULD_SPANNE}) da, die von der anderen Seite kommt.
 */
export const MINDEST_RUNDEN_JE_TASTE = 8;

/**
 * Die Untergrenze WÄCHST MIT: {@link MINDEST_RUNDEN_START} Runde am Anfang,
 * {@link MINDEST_RUNDEN_JE_TASTE} ab {@link MINDEST_RUNDEN_BIS} Einheiten.
 *
 * Warum nicht fest (gemessen, `scripts/_untergrenze.mts`): Eine Runde mit zwei
 * Tasten hat nur 109 Zeichen statt 480, und ein Anfänger tippt langsam. Bei
 * einer festen Grenze von 10 Runden säße ein Kind **24 Minuten lang auf f und
 * j** — zwei Tasten, sonst nichts. Das ist keine Übung, das ist Warten.
 *
 *   Runden je Taste:  2 → 1 · 4 → 2 · 6 → 4 · 8 → 5 · 10 → 7 · ab 12 → 8
 *
 * ★ 29.08.2026 FLACHER gestellt (START 4 → 1, Plateau erst ab 12 statt ab 8).
 * Anlass: `scripts/_langsam.mts` hat zum ersten Mal die GRUNDREIHE in Minuten
 * gemessen, für Kinder verschiedenen Tempos. Sie kostete 182 Minuten bei
 * 30 Anschlägen/min und 75 bei 190. Entscheidung Johannes: „75 min ist bei 190
 * zu lange, ca. 40 min wären gut - und 183 bei 30 ist viel zu lange, ca. 100."
 * Nachgemessen mit dieser Rampe: **108 min bei 30/min · 45 bei 100 · 41 bei 190.**
 *
 * Dass die Rampe jetzt ÜBER die Grundreihe hinausläuft, ist Absicht: Die
 * Festigung wird nicht gestrichen, sondern verschoben - dorthin, wo es echte
 * Wörter gibt („dass", „Saal", „Fall") und das Üben nicht mehr öd ist. Die
 * Summe der Rampe über die Grundreihe (2 bis 7 Tasten) ist von 34 auf 17
 * gefallen; die Ratsche im Test hält sie unten.
 *
 * ⚠️ Das ist nur die UNTERE Schranke. Zusätzlich muss die zuletzt dazugekommene
 * Taste sitzen (Können statt Uhr), und von der anderen Seite lässt die
 * Geduld-Regel ({@link GEDULD_SPANNE}) nach. Die Zahlen oben sind das Minimum,
 * nicht die Wirklichkeit — Janos gemessener Schnitt liegt bei 26 min je Taste.
 */
export const MINDEST_RUNDEN_START = 1;

/** Bis zu so vielen Einheiten steigt die Rampe; danach gilt das Plateau. */
export const MINDEST_RUNDEN_BIS = 12;

export function mindestRundenFuer(
  anzahlEinheiten: number,
  /** Nur fuers Messen: `scripts/_langsam.mts` probiert andere Rampen durch. */
  start: number = MINDEST_RUNDEN_START,
  bis: number = MINDEST_RUNDEN_BIS,
  plateau: number = MINDEST_RUNDEN_JE_TASTE,
): number {
  if (anzahlEinheiten >= bis) return plateau;
  const anteil =
    Math.max(0, anzahlEinheiten - INITIAL_LETTERS) / (bis - INITIAL_LETTERS);
  return Math.round(start + anteil * (plateau - start));
}

/** @param lernweg ★ E2: Pflicht, siehe {@link personalBaseMs}. */
export function canAdvance(
  introduced: string[],
  letters: Record<string, LetterStat> | undefined,
  lernweg: Lernweg,
  m: Mastery = NORMAL,
  rundenOhneTaste?: number,
): boolean {
  // Untergrenze: nie zu früh. Beim allerersten Start (noch kein Zähler) gilt sie
  // nicht, sonst hinge ein neues Konto zehn Runden in der Grundstellung fest.
  if (rundenOhneTaste !== undefined && rundenOhneTaste < mindestRundenFuer(introduced.length))
    return false;
  // Zusätzlich muss die ZULETZT dazugekommene Taste wirklich sitzen - das koppelt
  // das Tempo ans Können statt an die Uhr (Genauigkeit vor Geschwindigkeit).
  const basis = personalBaseMs(introduced, letters, lernweg, m);
  const juengste = introduced[introduced.length - 1];
  if (
    rundenOhneTaste !== undefined &&
    juengste &&
    letters?.[juengste] &&
    letterLevel(letters[juengste], m, lernweg, juengste, basis) !== "sitzt" &&
    geduldsFaktor(rundenOhneTaste) < 1 // die Geduld-Regel hebt auch diese Hürde auf
  )
    return false;
  const base = personalBaseMs(introduced, letters, lernweg, m);
  const nach = nachgelassen(m, introduced.length, rundenOhneTaste);
  let notReady = 0;
  for (const c of introduced) {
    const lvl = letterLevel(letters?.[c], m, lernweg, c, base);
    if (lvl === "sitzt") continue;
    // Ein hakender BUCHSTABE blockiert weiterhin (die Grundlage muss sitzen). Ein
    // hakendes Satz-/Sonderzeichen blockiert NICHT komplett — sonst friert ein
    // einzelnes zähes Zeichen den ganzen Fortschritt ein (Wunsch Johannes). Es zählt
    // aber als offene Baustelle, damit sich nicht beliebig viele stapeln.
    // Die Sperre wird mit jeder Runde ohne neue Taste milder (siehe nachgelassen).
    if (lvl === "hakt" && !isExtraUnit(c) && letterAccuracy(letters?.[c]) < nach.struggleAcc)
      return false;
    notReady++; // „neu", „wackelig" oder ein (toleriertes) hakendes Sonderzeichen
  }
  return notReady <= nach.maxWobbly;
}

/**
 * Freischaltung fortschreiben: Ist genug gefestigt (siehe {@link canAdvance}),
 * kommt die nächste Einheit dazu. Gibt die (ggf. erweiterte) Liste zurück.
 */
export function advanceIntroduced(
  introduced: string[],
  letters: Record<string, LetterStat> | undefined,
  /** ★ E1 (24.09.2026): der Weg des Kindes - er bestimmt, welche Taste als nächste kommt. */
  lernweg: Lernweg,
  m: Mastery = NORMAL,
  rundenOhneTaste?: number,
): string[] {
  if (!canAdvance(introduced, letters, lernweg, m, rundenOhneTaste)) return introduced;
  const next = nextLetter(introduced, lernweg);
  if (!next) return introduced;
  // ★★★★★ ES-P7a-Behebung (M3, Bauplan §4.4 Punkt 1): bildet die nächste
  // Einheit ein hartes Paar (¿/?, ¡/! auf Weg „es"), kommt ihr Gegenstück
  // GLEICH MIT - sonst übt das Kind neun Runden lang nur das öffnende
  // Zeichen allein, ohne je einen echten Fragesatz zu sehen (Prüfbericht M3).
  // ★ D1 Nr. 19 (28.09.2026): seit die Klammern auf JEDEM Weg ein Paar sind,
  // kommt das Gegenstück nur mit, wenn es auf dieser Tastatur existiert
  // (`introOrder` ist nach der Tastatur gefiltert) und noch fehlt.
  const partner = lernwegDef(lernweg).paareGemeinsam?.[next];
  const mit =
    partner !== undefined && !introduced.includes(partner) && introOrder(lernweg).includes(partner);
  return mit ? [...introduced, next, partner] : [...introduced, next];
}

/**
 * ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M1): ALLE Einheiten, die in dieser
 * Runde neu dazugekommen sind, in der Reihenfolge der Freischaltung. Die
 * Trainer nahmen bis hierher `grown[grown.length - 1]` - bei einem Paar
 * (¿ mit ?) ging so das öffnende Zeichen verloren. EINE Funktion für beide
 * Trainer; die Feier bekommt, was sie liefert.
 */
export function neuFreigeschaltet(vorher: readonly string[], nachher: readonly string[]): string[] {
  const alt = new Set(vorher);
  return nachher.filter((u) => !alt.has(u));
}

/**
 * Den Freischalt-Zeitpunkt jeder NEU dazugekommenen Einheit festhalten.
 *
 * Reine Funktion (`now` wird hereingereicht, nie hier gelesen) — die Trainer
 * haben ihren Rundenzeitpunkt ohnehin schon. Bestehende Einträge bleiben
 * unangetastet: ein Zeitpunkt wird EINMAL vergeben und nie überschrieben, sonst
 * verschöbe ein späterer Lauf die Geschichte. Gibt dieselbe Referenz zurück,
 * wenn nichts dazukam — dann bleibt auch der Spielstand unverändert.
 */
export function stampUnlocks(
  vorher: readonly string[],
  nachher: readonly string[],
  bisher: Record<string, number> | undefined,
  now: number,
): Record<string, number> | undefined {
  const alt = new Set(vorher);
  const neue = nachher.filter((u) => !alt.has(u));
  if (neue.length === 0) return bisher;
  const out = { ...(bisher ?? {}) };
  for (const u of neue) if (out[u] === undefined) out[u] = now;
  return out;
}

/**
 * Welche freigeschalteten Einheiten tragen (noch) keinen Zeitpunkt? Das sind die
 * vor dem 28.08.2026 freigeschalteten — für sie gibt es keinen, und es darf auch
 * keiner erfunden werden. Wer eine Auswertung baut, muss sie ausweisen statt sie
 * stillschweigend wegzulassen (siehe [[feedback_pruefstand_lernen_dokumentieren]]:
 * stilles Weglassen ist die schlimmste Antwort).
 */
export function ohneZeitstempel(
  introduced: readonly string[],
  at: Record<string, number> | undefined,
): string[] {
  return introduced.filter((u) => at?.[u] === undefined);
}

/**
 * Die n Buchstaben mit dem höchsten Übungsbedarf (für gezielte Wiederholung).
 * Der zuletzt freigeschaltete Buchstabe kommt bevorzugt vor, solange er nicht
 * sitzt — neue Tasten bekommen so von Anfang an Aufmerksamkeit.
 */
/**
 * @param lernweg ★ E2: Pflicht, siehe {@link personalBaseMs}. Wird diese
 *   Funktion für ein Mastery-System OHNE Lernweg benutzt (z. B. `ChordDojo`s
 *   Tastenkürzel-Kompetenz, die keine Buchstaben-Reihenfolge kennt), übergibt
 *   der Aufrufer ausdrücklich „de" - dort greift `homeKeys` ohnehin nie, weil
 *   die „Einheiten" keine echten Zeichen sind.
 */
export function weakestLetters(
  introduced: string[],
  letters: Record<string, LetterStat> | undefined,
  lernweg: Lernweg,
  n = 3,
  m: Mastery = NORMAL,
): string[] {
  const base = personalBaseMs(introduced, letters, lernweg, m);
  const ranked = [...introduced].sort(
    (a, b) =>
      needScore(letters?.[b], m, lernweg, b, base) - needScore(letters?.[a], m, lernweg, a, base),
  );
  const out: string[] = [];
  const newest = introduced[introduced.length - 1];
  if (newest && !isMastered(letters?.[newest], m, lernweg, newest, base)) out.push(newest);
  for (const c of ranked) {
    if (out.length >= n) break;
    if (!out.includes(c) && needScore(letters?.[c], m, lernweg, c, base) > 0.05) out.push(c);
  }
  return out;
}

/**
 * Ab diesem Übungsbedarf bekommt ein Satz-/Sonderzeichen (oder eine Ziffer) einen
 * EIGENEN Fokus-Platz (siehe {@link focusUnits}). Bewusst deutlich über dem
 * „sitzt"-Bereich: gut sitzende Zeichen (hohe Treffsicherheit, flottes Tempo)
 * landen unter ~0,25 und lösen den Zusatzplatz nicht aus.
 */
export const EXTRA_FOCUS_NEED = 0.35;

/**
 * So viele Buchstaben-Plätze hat der Übungs-Schwerpunkt einer Runde „Mein
 * Training" ({@link focusUnits} kann EINEN Platz für ein hartnäckiges Satz-/
 * Sonderzeichen dazulegen). Liegt hier statt im Trainer, weil die Statistik
 * („Übt gerade: …", Lehrkraft + Schüler-Selbstsicht) denselben Wert braucht —
 * sonst zeigte die Auswertung etwas anderes an, als tatsächlich geübt wird.
 */
export const FOCUS_COUNT = 3;

/**
 * Wie viele Einheiten darf der Fokus umfassen? Er wächst mit den offenen
 * Baustellen — sonst soll ein Kind 14 Baustellen durch eine 3 Zeichen breite Tür
 * räumen (Befund an Janos Konto 28.08.2026: der Trainer übte ⇧ m w, während a, g
 * und neun wackelige Tasten unbeachtet weiter abrutschten).
 */
export const MAX_FOCUS = 6;
export function fokusBreiteFuer(offeneBaustellen: number): number {
  return Math.max(FOCUS_COUNT, Math.min(MAX_FOCUS, Math.ceil(offeneBaustellen / 2)));
}

/**
 * Die Fokus-Einheiten für eine Runde „Mein Training" — {@link weakestLetters},
 * aber mit einem GARANTIERTEN Zusatzplatz für ein hartnäckiges Satz-/Sonder-
 * zeichen bzw. eine Ziffer.
 *
 * Hintergrund (Wunsch Johannes 21.07.): Wer gleichzeitig an Buchstaben UND an
 * „?"/"," hakt, dem fielen die Satzzeichen bisher aus den Top-3 — genau die
 * Zeichen, die das Kind am dringendsten braucht, wurden dann NICHT verstärkt
 * geübt. Der Zusatzplatz kommt OBEN DRAUF: er verdrängt keinen wackeligen
 * Buchstaben, sondern ergänzt ihn. Ist ohnehin schon ein Nicht-Buchstabe unter
 * den Schwächsten, bleibt es bei den n Plätzen (kein doppelter Schwerpunkt).
 */
/** @param lernweg ★ E2: Pflicht, siehe {@link weakestLetters}. */
export function focusUnits(
  introduced: string[],
  letters: Record<string, LetterStat> | undefined,
  lernweg: Lernweg,
  n = 3,
  m: Mastery = NORMAL,
): string[] {
  const out = weakestLetters(introduced, letters, lernweg, n, m);
  const isExtra = (u: string): boolean => {
    const k = unitKind(u);
    return k === "satzzeichen" || k === "ziffer" || k === "sonderzeichen";
  };
  if (out.some(isExtra)) return out;
  const base = personalBaseMs(introduced, letters, lernweg, m);
  let best: string | null = null;
  let bestNeed = EXTRA_FOCUS_NEED;
  for (const u of introduced) {
    if (!isExtra(u)) continue;
    const need = needScore(letters?.[u], m, lernweg, u, base);
    if (need > bestNeed) {
      best = u;
      bestNeed = need;
    }
  }
  return best ? [...out, best] : out;
}

/**
 * Wie viele freigeschaltete Einheiten sitzen NOCH NICHT? Das ist die Zahl, an der
 * das Tor hängt (`canAdvance`), an der die Fokus-Breite wächst
 * ({@link fokusBreiteFuer}) und aus der sich die Zahl der Übungszeilen ergibt
 * (`uebungsZeilenFuer`). EINE Quelle für alle drei — sonst driften sie
 * auseinander.
 */
/** @param lernweg ★ E2: Pflicht, siehe {@link masteredCount}. */
export function offeneBaustellen(
  introduced: string[],
  letters: Record<string, LetterStat> | undefined,
  lernweg: Lernweg,
  m: Mastery = NORMAL,
): number {
  return introduced.length - masteredCount(introduced, letters, lernweg, m);
}

/**
 * Wie viele freigeschaltete Einheiten sitzen schon?
 * @param lernweg ★ E2: Pflicht, siehe {@link personalBaseMs}.
 */
export function masteredCount(
  introduced: string[],
  letters: Record<string, LetterStat> | undefined,
  lernweg: Lernweg,
  m: Mastery = NORMAL,
): number {
  const base = personalBaseMs(introduced, letters, lernweg, m);
  return introduced.filter((c) => isMastered(letters?.[c], m, lernweg, c, base)).length;
}
