/**
 * Lehrplan des 10-Finger-Trainers „Tastenflow".
 *
 * Reihenfolge nach dem im DACH-Raum etablierten Reihen- + Häufigkeitsprinzip
 * (TIPP10, Schweizer Lehrplan, Bayern, Calli Clever): Grundstellung zuerst,
 * Großschreibung früh, dann obere/untere Reihe „von der Mitte nach außen",
 * Umlaute/ß, Satzzeichen, Zahlen, Sonderzeichen. Belege: siehe
 * [[project_zehnfinger_trainer]].
 *
 * „unlocked" = alle Zeichen, die bis zu einer Lektion eingeführt wurden. Daraus
 * erzeugt der Generator (generator.ts) Übungen, die NUR bekannte Tasten nutzen.
 */
import type { CorpusKind } from "./corpus";
import { type TypingProgress } from "./progress";
import {
  INITIAL_LETTERS,
  SHIFT_UNIT,
  SYMBOL_ORDER,
  bridgeLearned,
  ensureIntroduced,
  introOrder,
} from "./letters";
import { activeLayoutId, onlyExistingKeys, type LayoutId } from "./layouts";
// ★ E1 (24.09.2026): Jede Funktion, die aus der Einführungsreihenfolge rechnet,
// bekommt den Lernweg des Kindes. ★ E6c (24.09.2026): Die LEKTIONEN sind seither
// KEINE zweite deutsche Reihenfolge mehr (Bauplan §4, Falle 5 behoben) - Weg
// „en" hat seine eigene Lektionsfolge ({@link EN_LESSONS}); welche Liste gilt,
// sagt {@link lektionenFuer}.
import { lernwegDef, type Lernweg } from "./lernweg";
import { wandleSchreibweise, type EnglischVariante } from "./schreibweise";
// ★ E10b-2 (26.09.2026): die Lektionen des Weges „fr" - eigene Datei, je
// Tastatur gebaut (siehe dort).
import { frLektionenFuerLayout } from "./curriculumFr";
// ★ ES-S (27.09.2026): die Lektionen des Weges „es" - eigene Datei, je Tastatur.
import { esLektionenFuerLayout } from "./curriculumEs";
// ★ IT-S (03.10.2026): die Lektionen des Weges „it" - eigene Datei, je Tastatur (it, it-qzerty).
import { itLektionenFuerLayout } from "./curriculumIt";
// ★ TR-S (09.10.2026): die Lektionen des Weges „tr" - eigene Datei, gerechnet mit der eingestellten Tastatur (tr-q, tr-f).
import { trLektionenFuerLayout } from "./curriculumTr";
// ★ PL-W (09.10.2026): die Lektionen des Weges „pl" - eigene Datei, eine Pflicht-Tastatur (`pl`).
import { plLektionenFuerLayout } from "./curriculumPl";
// ★ CS-W (09.10.2026): die Lektionen des Weges „cs" - eigene Datei, je Tastatur (cs, cs-qwerty).
import { csLektionenFuerLayout } from "./curriculumCs";
// ★ G3c-VERTEILER (25.10.2026): die Lektionen der neun Gerüst-Wege (`curriculum<Xx>.ts`, heute leer ⇒ die englischen).
import { bgLektionenFuerLayout } from "./curriculumBg";
import { elLektionenFuerLayout } from "./curriculumEl";
import { huLektionenFuerLayout } from "./curriculumHu";
import { nlLektionenFuerLayout } from "./curriculumNl";
import { ptLektionenFuerLayout } from "./curriculumPt";
import { brLektionenFuerLayout } from "./curriculumBr";
import { roLektionenFuerLayout } from "./curriculumRo";
import { svLektionenFuerLayout } from "./curriculumSv";
import { ukLektionenFuerLayout } from "./curriculumUk";
import { eigenOderEn } from "./geruestRueckfall";
import { GERUEST_SPRACHEN } from "./sprachRegister";

export type LessonKind =
  | "home" // Grundstellung
  | "letters" // neue Buchstaben
  | "shift" // Großschreibung
  | "punctuation" // Satzzeichen
  | "numbers" // Ziffern
  | "symbols" // Sonderzeichen
  | "text"; // zusammenhängende, kuratierte Texte

export interface Lesson {
  id: string;
  /** Anzeigename, in dem die neuen Tasten vorkommen. */
  title: string;
  kind: LessonKind;
  /** Neu eingeführte (Klein-)Zeichen dieser Lektion. */
  newKeys: string[];
  /** Schaltet diese Lektion die Großschreibung (Umschalt) frei? */
  enablesShift?: boolean;
  /** Bei kind "text": aus welchen Korpus-Sorten die Zeilen gezogen werden. */
  corpusKinds?: CorpusKind[];
  /** Einführungstext: Finger, Lage relativ zur Grundstellung, Tipp. */
  intro: string;
  /** Sachliche „Sie"-Fassung des Einführungstexts (Erwachsenen-Profil). */
  introErwachsen?: string;
  /**
   * ★ E6c (24.09.2026): Fassungen von {@link intro}, wo der GRIFF je Tastatur
   * verschieden ist (bisher nur `en-quote`: „"" liegt auf US unter dem Apostroph,
   * auf UK unter der 2 - siehe Bauplan §3.3/§5.1). Fehlt ein Layout hier, gilt
   * `intro`. Siehe {@link lessonIntroText}.
   */
  introByLayout?: Partial<Record<LayoutId, string>>;
}

export const LESSONS: Lesson[] = [
  {
    id: "home-fj",
    title: "Grundstellung: F und J",
    kind: "home",
    newKeys: ["f", "j"],
    intro:
      "Lege die Zeigefinger auf F und J. Auf diesen beiden Tasten spürst du kleine " +
      "Höcker (Striche) - daran findest du die Grundstellung auch ohne hinzusehen. " +
      "Von hier aus startet jede Bewegung, und hierhin kehren die Finger immer zurück.",
    introErwachsen:
      "Legen Sie die Zeigefinger auf F und J. Auf diesen beiden Tasten ertasten Sie kleine Höcker (Striche) - daran finden Sie die Grundstellung auch ohne hinzusehen. Von hier aus startet jede Bewegung, und hierhin kehren die Finger immer zurück.",
  },
  {
    id: "home-dk",
    title: "Grundstellung: D und K",
    kind: "home",
    newKeys: ["d", "k"],
    intro:
      "D liegt links neben F (linker Mittelfinger), K rechts neben J (rechter " +
      "Mittelfinger). Die Zeigefinger bleiben auf den Höckern von F und J liegen.",
    introErwachsen:
      "D liegt links neben F (linker Mittelfinger), K rechts neben J (rechter Mittelfinger). Die Zeigefinger bleiben dabei auf den Höckern von F und J liegen.",
  },
  {
    id: "home-sl",
    title: "Grundstellung: S und L",
    kind: "home",
    newKeys: ["s", "l"],
    intro:
      "S bedient der linke Ringfinger, L der rechte Ringfinger - jeweils die " +
      "nächste Taste nach außen. Nach jedem Anschlag zurück auf die Höcker.",
    introErwachsen:
      "S bedient der linke Ringfinger, L der rechte Ringfinger - jeweils die nächste Taste nach außen. Nach jedem Anschlag geht es zurück auf die Höcker.",
  },
  {
    id: "home-aoe",
    title: "Grundstellung vollständig: A und Ö",
    kind: "home",
    newKeys: ["a", "ö"],
    intro:
      "A (linker kleiner Finger) und Ö (rechter kleiner Finger) vervollständigen " +
      "die Grundreihe: A S D F und J K L Ö. Jetzt liegen alle acht Finger zu Hause.",
    introErwachsen:
      "A (linker kleiner Finger) und Ö (rechter kleiner Finger) vervollständigen die Grundreihe: A S D F und J K L Ö. Jetzt liegen alle acht Finger zu Hause.",
  },
  {
    id: "home-gh",
    title: "Die Reichweite: G und H",
    kind: "home",
    newKeys: ["g", "h"],
    intro:
      "G holt der linke Zeigefinger von F aus eine Taste nach rechts, H der rechte " +
      "Zeigefinger von J aus eine Taste nach links. Danach sofort zurück zum Höcker.",
    introErwachsen:
      "G holt der linke Zeigefinger von F aus eine Taste nach rechts, H der rechte Zeigefinger von J aus eine Taste nach links. Danach geht es sofort zurück zum Höcker.",
  },
  {
    id: "shift-gross",
    title: "Großschreibung mit der Umschalttaste",
    kind: "shift",
    newKeys: [],
    enablesShift: true,
    intro:
      "Für Großbuchstaben hältst du die Umschalttaste (Shift) - und zwar immer mit " +
      "der GEGENHAND: großes A (links) → rechte Umschalttaste, großes K (rechts) → " +
      "linke Umschalttaste. Beide kleinen Finger sind dafür zuständig. Nur die " +
      "richtige Umschalttaste zählt: die falsche Umschalttaste oder die " +
      "Feststelltaste schreiben einen kleinen Buchstaben und gelten als Fehler.",
    introErwachsen:
      "Für Großbuchstaben halten Sie die Umschalttaste (Shift) - und zwar stets mit der GEGENHAND: großes A (links) → rechte Umschalttaste, großes K (rechts) → linke Umschalttaste. Zuständig sind dafür beide kleinen Finger. Nur die richtige Umschalttaste wird angenommen; die falsche Umschalttaste oder die Feststelltaste (Caps Lock) erzeugen einen Kleinbuchstaben und gelten als Fehler - so trainieren Sie die Gegenhand von Anfang an. Schon die mechanische Schreibmaschine kannte dieses Prinzip: Die Umschalttaste hob den Wagen buchstäblich an, daher der Name.",
  },
  {
    id: "ober-ei",
    title: "Obere Reihe: E und I",
    kind: "letters",
    newKeys: ["e", "i"],
    intro:
      "E erreichst du, indem der linke Mittelfinger von D eine Reihe nach oben geht, " +
      "I der rechte Mittelfinger von K aus. E ist der häufigste Buchstabe im Deutschen " +
      "- jetzt entstehen schon echte Wörter.",
    introErwachsen:
      "E erreichen Sie, indem der linke Mittelfinger von D eine Reihe nach oben wandert, I der rechte Mittelfinger von K aus. E ist der häufigste Buchstabe im Deutschen - entsprechend entstehen jetzt schon echte Wörter.",
  },
  {
    id: "ober-ru",
    title: "Obere Reihe: R und U",
    kind: "letters",
    newKeys: ["r", "u"],
    intro:
      "R nimmt der linke Zeigefinger (von F schräg hoch), U der rechte Zeigefinger " +
      "(von J schräg hoch).",
    introErwachsen:
      "Das R übernimmt der linke Zeigefinger (von F schräg nach oben), das U der rechte Zeigefinger (von J schräg nach oben). Die Finger kehren danach stets auf die Grundreihe zurück.",
  },
  {
    id: "ober-tz",
    title: "Obere Reihe: T und Z",
    kind: "letters",
    newKeys: ["t", "z"],
    intro:
      "T ist die Reichweite des linken Zeigefingers nach innen-oben, Z die des " +
      "rechten. (Auf der deutschen Tastatur liegt Z hier - anders als bei englischen.)",
    introErwachsen:
      "Das T erreichen Sie mit dem linken Zeigefinger nach innen-oben, das Z mit dem rechten. Dass das Z hier liegt, ist eine deutsche Eigenheit: Auf englischen Tastaturen sitzt an dieser Stelle das Y.",
  },
  {
    id: "ober-wo",
    title: "Obere Reihe: W und O",
    kind: "letters",
    newKeys: ["w", "o"],
    intro:
      "W bedient der linke Ringfinger (über S), O der rechte Ringfinger (über L).",
    introErwachsen:
      "Das W bedient der linke Ringfinger (über S), das O der rechte Ringfinger (über L).",
  },
  {
    id: "ober-qp",
    title: "Obere Reihe: Q und P",
    kind: "letters",
    newKeys: ["q", "p"],
    intro:
      "Q ist die obere Taste des linken kleinen Fingers, P die des rechten. Damit ist " +
      "die obere Reihe komplett.",
    introErwachsen:
      "Das Q liegt auf der oberen Taste des linken kleinen Fingers, das P auf der des rechten. Damit haben Sie die obere Reihe vollständig im Griff.",
  },
  {
    id: "unter-mv",
    title: "Untere Reihe: M und V",
    kind: "letters",
    newKeys: ["m", "v"],
    intro:
      "M holt der rechte Zeigefinger von J nach unten-innen, V der linke Zeigefinger " +
      "von F nach unten-innen.",
    introErwachsen:
      "Das M holt der rechte Zeigefinger von J nach unten-innen, das V der linke Zeigefinger von F nach unten-innen.",
  },
  {
    id: "unter-c-komma",
    title: "Untere Reihe: C und Komma",
    kind: "letters",
    newKeys: ["c", ","],
    intro:
      "C nimmt der linke Mittelfinger (unter D), das Komma der rechte Mittelfinger " +
      "(unter K). Nach dem Komma folgt im Text ein Leerzeichen.",
    introErwachsen:
      "Das C übernimmt der linke Mittelfinger (unter D), das Komma der rechte Mittelfinger (unter K). Auf das Komma folgt im Fließtext immer ein Leerzeichen.",
  },
  {
    id: "unter-x-punkt",
    title: "Untere Reihe: X und Punkt",
    kind: "letters",
    newKeys: ["x", "."],
    intro:
      "X bedient der linke Ringfinger (unter S), den Punkt der rechte Ringfinger " +
      "(unter L). Jetzt kannst du ganze Sätze schreiben und beenden.",
    introErwachsen:
      "Das X bedient der linke Ringfinger (unter S), den Punkt der rechte Ringfinger (unter L). Damit verfügen Sie über alles, um vollständige Sätze zu schreiben und sauber abzuschließen.",
  },
  {
    id: "unter-y-minus",
    title: "Untere Reihe: Y und Bindestrich",
    kind: "letters",
    newKeys: ["y", "-"],
    intro:
      "Y liegt unter dem linken kleinen Finger (selten im Deutschen), der Bindestrich " +
      "ganz rechts unter dem rechten kleinen Finger.",
    introErwachsen:
      "Das Y liegt unter dem linken kleinen Finger - im Deutschen ein seltener Gast, weshalb es bis heute auf manchen Tastaturen weit unten geduldet wird. Der Bindestrich sitzt ganz rechts unter dem rechten kleinen Finger.",
  },
  {
    id: "unter-nb",
    title: "Untere Reihe: N und B",
    kind: "letters",
    newKeys: ["n", "b"],
    intro:
      "N und B sind die diagonalen Reichweiten der Zeigefinger nach unten - die " +
      "letzten und kniffligsten Buchstabentasten. Danach ist das Alphabet fast komplett.",
    introErwachsen:
      "N und B sind die diagonalen Reichweiten der Zeigefinger nach unten - die letzten und kniffligsten Buchstabentasten. Danach ist Ihr Alphabet so gut wie vollständig.",
  },
  {
    id: "text-erste-saetze",
    title: "Erste ganze Sätze",
    kind: "text",
    newKeys: [],
    corpusKinds: ["satz", "spruch", "sprichwort"],
    intro:
      "Jetzt kennst du fast alle Buchstaben - Zeit für echte Sätze! Hier kommen kurze " +
      "Sätze und Sprüche, die nur die bereits gelernten Tasten brauchen. Tippe ruhig und " +
      "achte auf Punkt und Komma. Über das Pulldown oben wählst du, wie schwer die Texte sind.",
    introErwachsen:
      "Sie kennen nun nahezu alle Buchstaben - Zeit für echte Sätze. Es folgen kurze Sätze und Sprüche, die ausschließlich die bereits gelernten Tasten verlangen; tippen Sie in Ruhe und achten Sie auf Punkt und Komma. Den Schwierigkeitsgrad wählen Sie über das Pulldown oben.",
  },
  {
    id: "umlaut-aeue",
    title: "Umlaute: Ä und Ü",
    kind: "letters",
    newKeys: ["ä", "ü"],
    intro:
      "Ä liegt rechts neben Ö (rechter kleiner Finger), Ü rechts neben P (rechter " +
      "kleiner Finger, obere Reihe). Beide bedient der rechte kleine Finger.",
    introErwachsen:
      "Das Ä liegt rechts neben dem Ö (rechter kleiner Finger), das Ü rechts neben dem P (rechter kleiner Finger, obere Reihe). Beide bedient der rechte kleine Finger - der damit zu den fleißigsten Fingern der deutschen Tastatur zählt.",
  },
  {
    id: "scharfes-s",
    title: "Das scharfe s: ß",
    kind: "letters",
    newKeys: ["ß"],
    intro:
      "ß liegt rechts neben der 0, ganz oben rechts - Reichweite des rechten kleinen " +
      "Fingers. Damit ist das ganze deutsche Alphabet beisammen.",
    introErwachsen:
      "Das ß liegt rechts neben der 0, ganz oben rechts, in Reichweite des rechten kleinen Fingers. Damit ist das gesamte deutsche Alphabet beisammen - ein Buchstabe übrigens, den nur das Deutsche kennt.",
  },
  {
    id: "satzzeichen",
    title: "Satzzeichen: ? ! : ;",
    kind: "punctuation",
    newKeys: ["?", "!", ":", ";"],
    intro:
      "Diese Zeichen brauchen die Umschalttaste der Gegenhand: Fragezeichen = Shift + ß, " +
      "Doppelpunkt = Shift + Punkt, Strichpunkt = Shift + Komma, Ausrufezeichen = Shift + 1.",
    introErwachsen:
      "Diese Zeichen verlangen die Umschalttaste der Gegenhand: Fragezeichen = Shift + ß, Doppelpunkt = Shift + Punkt, Strichpunkt = Shift + Komma, Ausrufezeichen = Shift + 1. Das Prinzip stammt noch aus der Schreibmaschinenzeit, als die Umschaltung buchstäblich den Wagen anhob.",
  },
  {
    id: "zahlen",
    title: "Die Zahlenreihe: 0-9",
    kind: "numbers",
    newKeys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    intro:
      "Jeder Finger greift seine eigene Spalte schräg nach oben in die Zahlenreihe: links " +
      "1 2 3 4 5, rechts 6 7 8 9 0. Sie liegt am weitesten weg - darum kommt sie zuletzt.",
    introErwachsen:
      "Jeder Finger greift seine eigene Spalte schräg nach oben in die Zahlenreihe: links 1 2 3 4 5, rechts 6 7 8 9 0. Sie liegt am weitesten entfernt - und kommt deshalb zu guter Letzt.",
  },
  {
    id: "satz-sonderzeichen",
    title: "Satz- & Sonderzeichen: ( ) @ € % & …",
    kind: "symbols",
    newKeys: [...SYMBOL_ORDER],
    intro:
      "Jetzt die Zeichen für E-Mails, Preise und Mathe: Klammern ( ), das @ für " +
      "E-Mail-Adressen, € und % beim Einkaufen, + * / fürs Rechnen. Viele liegen " +
      "oben und brauchen die Umschalt- oder die Alt-Gr-Taste. Lass dir Zeit - hier " +
      "zählt Genauigkeit mehr als Tempo, jedes Zeichen kommt oft genug zum Üben.",
    introErwachsen:
      "Nun die Zeichen für E-Mails, Preise und Mathematik: Klammern ( ), das @ für " +
      "Adressen, € und % beim Einkaufen, die Rechenzeichen + * /. Viele verlangen die " +
      "Umschalt- oder die Alt-Gr-Taste. Nehmen Sie sich Zeit - hier zählt Genauigkeit " +
      "mehr als Tempo.",
  },
  {
    id: "text-witze",
    title: "Texte: Witze zum Mitschreiben",
    kind: "text",
    newKeys: [],
    corpusKinds: ["witz"],
    intro:
      "Jetzt kannst du alle Tasten! Schreib dich durch lauter kleine Witze. Über das " +
      "Pulldown oben wählst du, für welches Alter die Witze passen.",
    introErwachsen:
      "Sie beherrschen nun alle Tasten und können sich durch eine Reihe kurzer Witze schreiben. Über das Pulldown oben wählen Sie, für welche Altersstufe die Witze passen sollen.",
  },
  {
    id: "text-zungenbrecher",
    title: "Texte: Zungenbrecher",
    kind: "text",
    newKeys: [],
    corpusKinds: ["zungenbrecher"],
    intro:
      "Zungenbrecher sind ein wunderbares Tipptraining: gleiche Buchstaben, immer wieder, " +
      "in kniffliger Reihenfolge. Sprich sie ruhig laut mit - wenn du dich nicht verhaspelst.",
    introErwachsen:
      "Zungenbrecher sind ein vorzügliches Tipptraining: gleiche Buchstaben, immer wieder, in kniffliger Reihenfolge. Sprechen Sie ruhig laut mit - sofern Sie sich nicht verhaspeln.",
  },
  {
    id: "text-wortspiele",
    title: "Texte: Sprüche, Sprichwörter und Wortspiele",
    kind: "text",
    newKeys: [],
    corpusKinds: ["wortspiel", "spruch", "sprichwort"],
    intro:
      "Sprüche, bekannte Sprichwörter, Palindrome und Wortspiele - Sprache zum Schmunzeln und " +
      "flüssig tippen. Die Auswahl richtet sich nach der eingestellten Altersstufe.",
    introErwachsen:
      "Sprüche, bekannte Sprichwörter, Palindrome und Wortspiele - Sprache zum Schmunzeln und zum flüssigen Tippen. Die Auswahl richtet sich nach der eingestellten Altersstufe.",
  },
  {
    id: "text-fakten",
    title: "Texte: Wissenswertes",
    kind: "text",
    newKeys: [],
    corpusKinds: ["fakt", "wissen"],
    intro:
      "Beim Tippen nebenbei etwas lernen: erstaunliche, wahre Fakten aus Natur, Technik und " +
      "Geschichte. Jede Zeile ist ein kleines Aha - und gutes Schreibtraining.",
    introErwachsen:
      "Beim Tippen ganz nebenbei etwas lernen: erstaunliche, wahre Fakten aus Natur, Technik und Geschichte. Jede Zeile ist ein kleines Aha - und zugleich gutes Schreibtraining.",
  },
  {
    id: "text-saetze",
    title: "Texte: Ganze Sätze",
    kind: "text",
    newKeys: [],
    corpusKinds: ["satz"],
    intro:
      "Längere, abwechslungsreiche Sätze für flüssiges Schreiben am Stück. So gewöhnst du " +
      "dich an echtes Schreiben mit Groß- und Kleinschreibung, Komma und Punkt.",
    introErwachsen:
      "Längere, abwechslungsreiche Sätze für flüssiges Schreiben am Stück. So gewöhnen Sie sich an echtes Schreiben mit Groß- und Kleinschreibung, Komma und Punkt.",
  },
];

// ── Weg „en" (★ E6c, 24.09.2026) ─────────────────────────────────────────────
//
// Bauplan §4: eine EIGENE Lektionsfolge nach US/UK-Tastenreihen, aus der
// Reihenfolge des Weges gebaut (`lernwegDef("en")`) statt einer zweiten,
// abgeschriebenen Liste - ändert sich die Reihenfolge einmal (§3.3a war schon
// eine Messung, keine Setzung), zieht sie hier automatisch nach. Kein ä ö ü ß;
// „y"/"z" an ihrem eigenen (englischen) Platz; „'" steht neben „;" (siehe
// `EN_PUNCT_ORDER`, lernweg.ts); „"" braucht je Tastatur einen anderen Griff
// (US: Shift + Apostroph-Taste, UK: Shift + 2) - darum eine EIGENE Lektion mit
// {@link Lesson.introByLayout}, nicht in der Satzzeichen-Sammellektion.
//
// IDs tragen alle das Präfix „en-" - der Fortschritt hängt an der ID
// (`TypingProgress.lessons`), zwei Wege dürfen sich darum nie eine ID teilen.
const EN = lernwegDef("en");
const [enF, enJ, enD, enK, enS, enL, enA, enSemicolon] = EN.letterOrder.slice(0, 8);
const [enE, enI, enN, enR, enT, enH, enO] = EN.letterOrder.slice(8, 15);
const [enU, enY, enW, enM, enC, enG, enP, enB] = EN.letterOrder.slice(15, 23);
const [enV, enX, enQ, enZ] = EN.letterOrder.slice(23, 27);
const EN_PUNCT_NO_QUOTE = EN.punctOrder.filter((c) => c !== '"');
const EN_QUOTE = EN.punctOrder.find((c) => c === '"') ?? '"';

export const EN_LESSONS: Lesson[] = [
  {
    id: "en-home-fj",
    title: "Home row: F and J",
    kind: "home",
    newKeys: [enF, enJ],
    intro:
      "Rest your index fingers on F and J. Both keys have a small ridge you can " +
      "feel without looking - that is how you find the home position again every " +
      "time. Every movement starts here, and your fingers always return to these " +
      "two keys.",
  },
  {
    id: "en-home-dk",
    title: "Home row: D and K",
    kind: "home",
    newKeys: [enD, enK],
    intro:
      "D sits just left of F, for your left middle finger. K is its mirror, just " +
      "right of J, for your right middle finger. Your index fingers stay resting " +
      "on the ridges of F and J.",
  },
  {
    id: "en-home-sl",
    title: "Home row: S and L",
    kind: "home",
    newKeys: [enS, enL],
    intro:
      "S is one key further out, for your left ring finger. L is its mirror, for " +
      "your right ring finger.",
  },
  {
    id: "en-home-complete",
    title: "Home row complete: A and the semicolon key",
    kind: "home",
    newKeys: [enA, enSemicolon],
    intro:
      "A completes the home row for your left little finger. Its mirror on the " +
      "right is the semicolon key, one step right of L, for your right little " +
      "finger. All eight fingers are home now: A S D F and J K L ;.",
  },
  {
    id: "en-freq-ei",
    title: "Frequent letters: E and I",
    kind: "letters",
    newKeys: [enE, enI],
    intro:
      "E is one row up from D, for your left middle finger. I is one row up from " +
      "K, for your right middle finger. E is the most common letter in English - " +
      "real words start appearing already.",
  },
  {
    id: "en-freq-rt",
    title: "Frequent letters: R and T",
    kind: "letters",
    newKeys: [enR, enT],
    intro:
      "R and T both belong to your left index finger, one row up from F: R is " +
      "the inner key, T the one just to its right.",
  },
  {
    id: "en-freq-ho",
    title: "Frequent letters: H and O",
    kind: "letters",
    newKeys: [enH, enO],
    intro:
      "H stays on the home row, one key left of J, for your right index finger. " +
      "O is one row up from L, for your right ring finger.",
  },
  {
    id: "en-freq-n",
    title: "The last frequent letter: N",
    kind: "letters",
    newKeys: [enN],
    intro:
      "N is the trickiest reach so far: your right index finger goes one row " +
      "down from J. It is also the last of the most common letters - almost " +
      "every English sentence becomes typeable now.",
  },
  {
    id: "en-shift",
    title: "Capital letters with the Shift key",
    kind: "shift",
    newKeys: [],
    enablesShift: true,
    intro:
      "For capital letters you hold the Shift key - always with your OTHER " +
      "hand: a capital on the left half of the keyboard needs the right Shift " +
      "key, a capital on the right half needs the left Shift key. Both little " +
      "fingers are responsible. Only the correct Shift key counts: the wrong " +
      "Shift key or Caps Lock type a small letter and count as a mistake.",
  },
  {
    id: "en-more-uy",
    title: "More letters: U and Y",
    kind: "letters",
    newKeys: [enU, enY],
    intro:
      "U is one row up from J, for your right index finger. Y sits one column " +
      "further left in the same row, still your right index finger.",
  },
  {
    id: "en-more-wm",
    title: "More letters: W and M",
    kind: "letters",
    newKeys: [enW, enM],
    intro:
      "W is one row up from S, for your left ring finger. M is one row down " +
      "from J, for your right index finger.",
  },
  {
    id: "en-more-cg",
    title: "More letters: C and G",
    kind: "letters",
    newKeys: [enC, enG],
    intro:
      "C is one row down from D, for your left middle finger. G stays on the " +
      "home row, one key right of F, for your left index finger.",
  },
  {
    id: "en-more-pb",
    title: "More letters: P and B",
    kind: "letters",
    newKeys: [enP, enB],
    intro:
      "P is one row up from the semicolon key, for your right little finger. B " +
      "is one row down from F, for your left index finger.",
  },
  {
    id: "en-rare-vx",
    title: "The rarer letters: V and X",
    kind: "letters",
    newKeys: [enV, enX],
    intro:
      "V is one row down from F, for your left index finger - it shares that " +
      "finger with B, just one column over. X is one row down from S, for your " +
      "left ring finger.",
  },
  {
    id: "en-rare-qz",
    title: "The rarer letters: Q and Z",
    kind: "letters",
    newKeys: [enQ, enZ],
    intro:
      "Q is one row up from A, for your left little finger. Z is one row down " +
      "from A, for the same finger. That completes the whole alphabet.",
  },
  {
    id: "en-punctuation",
    title: "Punctuation: . , ' ? ! - :",
    kind: "punctuation",
    newKeys: [...EN_PUNCT_NO_QUOTE],
    intro:
      "Full stop and comma need no Shift key: full stop is under L for your " +
      "right ring finger, comma is under K for your right middle finger. The " +
      "apostrophe, one row up from the semicolon key, needs no Shift either. " +
      "Question mark, exclamation mark and colon all need the Shift key with " +
      "your other hand: question mark is Shift and the key right of the full " +
      "stop, exclamation mark is Shift and 1, colon is Shift and the semicolon " +
      "key. The hyphen sits at the far right of the top number row - no Shift " +
      "needed.",
  },
  {
    id: "en-quote",
    title: 'Punctuation: the quotation mark "',
    kind: "punctuation",
    newKeys: [EN_QUOTE],
    // ★ E6c: der einzige Griff, der sich zwischen US und UK unterscheidet
    // (Bauplan §3.3/§5.1) - darum eine eigene Lektion statt in der Sammlung
    // oben, mit {@link Lesson.introByLayout} für die beiden Tastaturen.
    intro:
      'The quotation mark " needs the Shift key. On a US keyboard, hold Shift ' +
      "and press the apostrophe key. On a UK keyboard, hold Shift and press " +
      "the 2 key, at the top of the number row.",
    introByLayout: {
      us:
        'The quotation mark " is Shift and the apostrophe key - the very key ' +
        "you already know, just held down with Shift.",
      uk:
        'The quotation mark " is Shift and the 2 key, at the top of the number ' +
        "row - not the apostrophe key here.",
    },
  },
  {
    id: "en-numbers",
    title: "The number row: 0-9",
    kind: "numbers",
    newKeys: [...EN.digitOrder],
    intro:
      "Each finger reaches its own column up into the number row: left hand " +
      "1 2 3 4 5, right hand 6 7 8 9 0. It is the row furthest from home - that " +
      "is why it comes last among the numbers.",
  },
  {
    id: "en-symbols",
    title: "Symbols: ( ) @ # $ % & ...",
    kind: "symbols",
    newKeys: [...EN.symbolOrder],
    intro:
      "Now the signs for emails, prices and maths: brackets ( ), the @ for " +
      "email addresses, # and $ for numbers and money, plus, star and slash " +
      "for calculations. Many need the Shift key or, on some keyboards, Alt " +
      "Gr. Take your time here - accuracy matters more than speed.",
  },
];

/**
 * ★ E6c: die richtige Lektionsfolge für einen Lernweg - Weg „de" bleibt exakt
 * {@link LESSONS} (keine zweite Liste, siehe Wächter
 * `tests/tastenflow-lernweg-de-unveraendert.test.ts`), Weg „en" bekommt
 * {@link EN_LESSONS}. JEDER Verbraucher der Lektionsliste (Abzeichen, Vorlagen,
 * Statistik, Hilfe) ruft diese Funktion statt `LESSONS` direkt zu lesen.
 */
export function lektionenFuer(lernweg: Lernweg): readonly Lesson[] {
  // ★ E10b-2 (26.09.2026): Weg „fr" hat seine eigene Folge, je Tastatur
  // gebaut (Schweiz-Französisch und Kanada haben eine andere Grundreihe -
  // `curriculumFr.ts`). Eine Tabelle statt der Zwei-Wege-Ternäre, damit ein
  // vierter Weg sich melden muss.
  return LEKTIONEN_JE_WEG[lernweg]();
}

const LEKTIONEN_JE_WEG: Record<Lernweg, () => readonly Lesson[]> = {
  de: () => LESSONS,
  en: () => EN_LESSONS,
  fr: () => frLektionenFuerLayout(activeLayoutId()),
  // ★ ES-S (27.09.2026): Weg „es" hat seine eigene Folge (vorher LEER seit ES-F2).
  es: () => esLektionenFuerLayout(activeLayoutId()),
  // ★ IT-S (03.10.2026): Weg „it" hat seine eigene Folge (vorher der englische Rückfall seit G2a).
  it: () => itLektionenFuerLayout(activeLayoutId()),
  // ★ PL-W (09.10.2026): Weg „pl" hat seine eigene Folge.
  pl: () => plLektionenFuerLayout(activeLayoutId()),
  // ★ TR-S (09.10.2026): Weg „tr" hat seine eigene Folge.
  tr: () => trLektionenFuerLayout(activeLayoutId()),
  // ★ CS-W (09.10.2026): Weg „cs" hat seine eigene Folge.
  cs: () => csLektionenFuerLayout(activeLayoutId()),
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: () => eigenOderEn(bgLektionenFuerLayout(activeLayoutId()), EN_LESSONS),
  el: () => eigenOderEn(elLektionenFuerLayout(activeLayoutId()), EN_LESSONS),
  hu: () => eigenOderEn(huLektionenFuerLayout(activeLayoutId()), EN_LESSONS),
  nl: () => eigenOderEn(nlLektionenFuerLayout(activeLayoutId()), EN_LESSONS),
  pt: () => eigenOderEn(ptLektionenFuerLayout(activeLayoutId()), EN_LESSONS),
  br: () => eigenOderEn(brLektionenFuerLayout(activeLayoutId()), EN_LESSONS),
  ro: () => eigenOderEn(roLektionenFuerLayout(activeLayoutId()), EN_LESSONS),
  sv: () => eigenOderEn(svLektionenFuerLayout(activeLayoutId()), EN_LESSONS),
  uk: () => eigenOderEn(ukLektionenFuerLayout(activeLayoutId()), EN_LESSONS),
};

/**
 * ★ E10b-2: die französischen Lektionen auf der AZERTY-Tastatur Frankreichs -
 * die Grundform (wie `FR_LETTER_ORDER`). Auf anderen Tastaturen gilt
 * `lektionenFuer("fr")`.
 */
export function frLessons(): readonly Lesson[] {
  return frLektionenFuerLayout("fr");
}

/**
 * Welche Liste eine Lektions-ID trägt - an ihrem Präfix erkannt (`en-…"), nicht
 * am `lernweg`-Parameter des Aufrufers: IDs sind zwischen den Wegen disjunkt
 * (siehe oben), darum findet jede Funktion, die nur eine ID entgegennimmt
 * (`lessonById`, `unlockedKeysAt`, `shiftUnlockedAt`, `lessonOpen`, …), ihre
 * Lektion darüber - ohne einen zusätzlichen Pflicht-Parameter, der bei jedem
 * bestehenden Aufruf (`unlockedKeysAt("home-fj")`, ohne Weg) hätte nachgezogen
 * werden müssen. Eine ID aus der falschen Liste gibt es nicht: `lektionenFuer`
 * ist der einzige Ort, der eine Liste allein am `lernweg` wählt.
 */
function listeFuerLektion(id: string): readonly Lesson[] {
  // ★ E10b-2: „fr-" liest die Liste der AKTIVEN Tastatur (wie `lektionenFuer`).
  if (id.startsWith("fr-")) return lektionenFuer("fr");
  // ★ ES-S: „es-" ebenso (IDs disjunkt zu allen anderen Wegen).
  if (id.startsWith("es-")) return lektionenFuer("es");
  // ★ IT-S: „it-" ebenso (IDs disjunkt zu allen anderen Wegen).
  if (id.startsWith("it-")) return lektionenFuer("it");
  // ★ TR-S: „tr-" ebenso (Lektions-IDs wie „tr-temel-1"; die Tastatur-IDs „tr-q"/„tr-f" sind keine Lektionen).
  if (id.startsWith("tr-")) return lektionenFuer("tr");
  // ★ PL-W: „pl-" ebenso (IDs disjunkt zu allen anderen Wegen).
  if (id.startsWith("pl-")) return lektionenFuer("pl");
  // ★ CS-W: „cs-" ebenso (IDs disjunkt zu allen anderen Wegen).
  if (id.startsWith("cs-")) return lektionenFuer("cs");
  // ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Wege ebenso (`bg-` … `uk-`; gemessen: keine bestehende Lektions-ID beginnt so).
  for (const s of GERUEST_SPRACHEN) if (id.startsWith(`${s}-`)) return lektionenFuer(s);
  return id.startsWith("en-") ? EN_LESSONS : LESSONS;
}

/**
 * Der Einführungstext für die AKTIVE Tastatur - meist `lesson.intro`, aber wo
 * {@link Lesson.introByLayout} eine Fassung für dieses Layout trägt (bisher nur
 * „en-quote"), gilt die.
 */
export function lessonIntroText(
  lesson: Pick<Lesson, "intro" | "introByLayout">,
  layout: LayoutId,
  variante?: EnglischVariante,
): string {
  const text = lesson.introByLayout?.[layout] ?? lesson.intro;
  // ★ E9 (24.09.2026, Bauplan §8.2): die Schreibweise ganz zuletzt - der
  // Lektionstext trägt keine Ledger-Kennung, eine Ersetzung hier ist darum
  // gefahrlos. Optional (Vorgabe „gb" = unverändert, wie bei allen anderen
  // `variante`-Parametern seit E9).
  return variante === "us" ? wandleSchreibweise(text, "us") : text;
}

export const LESSON_IDS: string[] = LESSONS.map((l) => l.id);

export function lessonById(id: string): Lesson | undefined {
  return listeFuerLektion(id).find((l) => l.id === id);
}

export function lessonIndex(id: string): number {
  return listeFuerLektion(id).findIndex((l) => l.id === id);
}

/**
 * Die neuen Tasten einer Lektion, soweit es sie auf der eingestellten Tastatur
 * GIBT. Auf der Schweizer Tastatur fällt so das ß weg, auf englischen Tastaturen
 * ä ö ü ß — geübt werden kann nur, was vorhanden ist.
 */
export function lessonNewKeys(lesson: Lesson): string[] {
  return onlyExistingKeys(lesson.newKeys);
}

/**
 * Lektion, die auf dieser Tastatur nichts mehr zu lehren hat, weil es ALLE ihre
 * Tasten dort nicht gibt (z. B. „Das scharfe s: ß" auf der Schweizer Tastatur).
 * Sie wird im Lehrgang übersprungen — nicht als Lücke, sondern weil es nichts zu
 * üben gibt.
 */
export function lessonSkipped(lesson: Lesson): boolean {
  return lesson.newKeys.length > 0 && lessonNewKeys(lesson).length === 0;
}

/**
 * Alle Einheiten, die eine Lektion voraussetzt (ihre eigenen neuen Tasten UND
 * alles davor) — in der Reihenfolge DIESER Tastatur, samt Umschalt-Einheit.
 * Grundlage der Gleichstellung beider Lernwege (siehe {@link lessonsDoneCount}).
 */
function lessonRequiredUnits(id: string, lernweg: Lernweg): string[] {
  const order = introOrder(lernweg);
  const set = new Set(unlockedKeysAt(id).filter((k) => order.includes(k)));
  if (shiftUnlockedAt(id) && order.includes(SHIFT_UNIT)) set.add(SHIFT_UNIT);
  return order.filter((u) => set.has(u));
}

/**
 * Gilt diese Lektion über den STOFF als geschafft? Das ist die Gleichstellung
 * beider Lernwege (Johannes 09.08.2026): Wer in „Mein Training" übt, schließt
 * nie eine Lektion ab — und konnte darum die Abzeichen-Familie „Lektionen" nie
 * bekommen, obwohl er denselben Stoff lernt. Jetzt zählt eine Lektion auch dann,
 * wenn ALLE Zeichen bis zu ihr freigeschaltet UND solide gelernt sind
 * ({@link bridgeLearned} — dieselbe milde, tempo-unabhängige Messlatte, mit der
 * „Mein Training" schon heute die Lektionen aufsperrt).
 *
 * Bewusst „bis zu ihr" statt „ihre neuen Tasten": Die späten Text-Lektionen
 * bringen gar keine neuen Tasten mehr — über die neuen Tasten allein bliebe
 * „Lehrgangs-Legende" in „Mein Training" unerreichbar.
 */
export function lessonDoneByStoff(p: TypingProgress, id: string, lernweg: Lernweg): boolean {
  const noetig = lessonRequiredUnits(id, lernweg);
  if (noetig.length === 0) return false;
  const frei = new Set(ensureIntroduced(p.introduced, lernweg));
  return noetig.every((u) => frei.has(u) && bridgeLearned(p.letters?.[u]));
}

/**
 * Wie viele Lektionen gelten als geschafft? Abgeschlossene PLUS die auf dieser
 * Tastatur übersprungenen — sonst bliebe das Abzeichen „alle Lektionen" für
 * Schweizer und englische Tastaturen für immer unerreichbar — PLUS die, deren
 * Stoff in „Mein Training" erarbeitet wurde ({@link lessonDoneByStoff}).
 */
export function lessonsDoneCount(p: TypingProgress, lernweg: Lernweg): number {
  let done = 0;
  for (const l of lektionenFuer(lernweg)) {
    if (lessonSkipped(l)) {
      done += 1;
      continue;
    }
    if (p.lessons[l.id]?.completed || lessonDoneByStoff(p, l.id, lernweg)) done += 1;
  }
  return done;
}

/**
 * Lektionen mit DREI Sternen (für „Lehrgangs-Meister"). Im Lehrgang zählt der
 * Bestwert der Lektion; in „Mein Training" gibt es keine Lektions-Sterne — dort
 * zählt der gleichwertige Stoff-Stand, sofern zusätzlich schon mindestens eine
 * Runde mit drei Sternen gelungen ist (sonst wäre es allein Fleiß).
 */
export function lessonsWithThreeStars(p: TypingProgress, lernweg: Lernweg): number {
  const dreiImTraining = (p.rounds ?? []).some((r) => r.stars >= 3);
  let done = 0;
  for (const l of lektionenFuer(lernweg)) {
    if (lessonSkipped(l)) {
      done += 1;
      continue;
    }
    if ((p.lessons[l.id]?.bestStars ?? 0) >= 3) done += 1;
    else if (dreiImTraining && lessonDoneByStoff(p, l.id, lernweg)) done += 1;
  }
  return done;
}

/** Alle (Klein-)Zeichen, die bis einschließlich dieser Lektion verfügbar sind. */
export function unlockedKeysAt(lessonId: string): string[] {
  const liste = listeFuerLektion(lessonId);
  const upto = lessonIndex(lessonId);
  if (upto < 0) return [];
  const set = new Set<string>();
  for (let i = 0; i <= upto; i++)
    for (const k of lessonNewKeys(liste[i])) set.add(k);
  return [...set];
}

/** Ist die Großschreibung bis zu dieser Lektion freigeschaltet? */
export function shiftUnlockedAt(lessonId: string): boolean {
  const liste = listeFuerLektion(lessonId);
  const upto = lessonIndex(lessonId);
  if (upto < 0) return false;
  for (let i = 0; i <= upto; i++) if (liste[i].enablesShift) return true;
  return false;
}

/**
 * Tastenstand der Lektion PLUS alles, was das Kind anderswo („Mein Training",
 * spätere Lektionen) nachweislich schon gelernt hat (`progress.introduced`).
 *
 * Eine Lektion darf nie eine ungelernte Taste VERLANGEN — aber sie darf alle
 * gelernten BENUTZEN: Wer mit 16 Tasten aus „Mein Training" eine frühe Lektion
 * (wieder) übt, bekommt so echte Sätze aus dem vollen eigenen Vorrat statt
 * Silben-Drill. (Befund 07.08.2026: „Großschreibung mit der Umschalttaste"
 * rechnete nur mit ihren 10 Lehrgangs-Buchstaben — für Stufe c gab das genau
 * 4 Sätze her, der Rest der Runde war Wortsalat.) Wer den Lehrgang der Reihe
 * nach geht, merkt keinen Unterschied: sein `introduced` enthält nie mehr als
 * die Lektions-Tasten. Gemerkte Tasten, die es auf der AKTUELLEN Tastatur
 * nicht gibt (Tastatur gewechselt), bleiben draußen (`introOrder` filtert).
 */
export function unlockedKeysWith(
  lessonId: string,
  introduced: string[] | undefined,
  lernweg: Lernweg,
): string[] {
  const set = new Set(unlockedKeysAt(lessonId));
  if (introduced?.length) {
    const known = new Set(introduced);
    for (const k of introOrder(lernweg)) if (k !== SHIFT_UNIT && known.has(k)) set.add(k);
  }
  return [...set];
}

/** Wie {@link shiftUnlockedAt}, zählt aber anderswo gelernte Großschreibung mit. */
export function shiftUnlockedWith(
  lessonId: string,
  introduced: string[] | undefined,
): boolean {
  return shiftUnlockedAt(lessonId) || (introduced?.includes(SHIFT_UNIT) ?? false);
}

// --- Brücke zwischen „Lektionen" und „Mein Training" -------------------------
// Beide Modi teilen sich denselben Spielstand. Damit der LERNSTAND zwischen
// ihnen mitwandert (Wunsch: „wer im Mein Training bei den Zahlen ist, hat das
// Niveau auch bei den Lektionen"), wird die Freischaltung der Lektionen nicht
// nur an abgeschlossene Lektionen geknüpft, sondern auch daran, ob die nötigen
// Tasten in „Mein Training" schon sitzen — und umgekehrt schiebt eine
// abgeschlossene Lektion die adaptive Freischaltung nach.

/**
 * Ist eine Lektion erreichbar? Klassisch, wenn die vorige abgeschlossen ist —
 * ODER wenn die Tasten der vorigen Lektion anderswo bereits GELERNT sind. Das
 * zählt auf zwei Wegen:
 *
 *  1. `introduced` — die ausdrückliche Freischaltung: von der Lehrkraft beim
 *     Anlegen gesetzt (Startpunkt), im Zahnrad gewählt („Womit anfangen?") oder
 *     in „Mein Training" Taste für Taste verdient. (Befund 07.08.2026: Ein Kind
 *     mit Startpunkt „Alle Buchstaben" hatte noch KEINE Anschlag-Statistik —
 *     alle Lektionen außer der ersten waren zu, es wurde zur Grundreihe
 *     zurückgeschickt. Genau das verspricht dieser Kommentar seit jeher nicht
 *     zu tun.) WICHTIG: Das Start-GESCHENK zählt nicht — ein frischer Stand
 *     trägt `INITIAL_LETTERS` Einheiten (F und J), ohne dass je eine Taste
 *     gedrückt wurde. Erst ein Stand DARÜBER ist eine echte Aussage (verdient
 *     oder bewusst gesetzt); sonst spränge ein blutiger Anfänger sofort in
 *     Lektion 2.
 *  2. `bridgeLearned` — die Anschlag-Statistik aus „Mein Training": SOLIDE
 *     geübt (treffsicher über die gesamte Übungszeit, Tempo egal). Bewusst
 *     tempo-/stufen-UNABHÄNGIG, damit der Wechsel auch dann greift, wenn das
 *     aktuelle Leistungs-Tempo hoch steht und alte, längst gelernte Tasten
 *     zuletzt selten drankamen.
 *
 * So findet sich eine Person, die schon alle Buchstaben frei hat, im
 * Lektionsweg an der passenden Stelle wieder — und verlangt wird in der Lektion
 * ohnehin nur Gelerntes (`unlockedKeysWith`).
 */
export function lessonOpen(p: TypingProgress, id: string): boolean {
  const liste = listeFuerLektion(id);
  const idx = lessonIndex(id);
  if (idx <= 0) return true;
  // Übersprungene Lektionen (Tasten gibt es auf dieser Tastatur nicht) dürfen den
  // Weg nicht versperren — sie sind nie „abgeschlossen". Also so weit zurück, bis
  // eine Lektion kommt, die hier wirklich geübt werden kann.
  let prevIdx = idx - 1;
  while (prevIdx > 0 && lessonSkipped(liste[prevIdx])) prevIdx--;
  const prev = liste[prevIdx].id;
  if (p.lessons[prev]?.completed === true) return true;
  const letters = p.letters ?? {};
  // Nur ein Stand ÜBER dem Start-Geschenk (F und J) zählt als gelernt.
  const intro = p.introduced ?? [];
  const known =
    intro.length > INITIAL_LETTERS ? new Set(intro) : new Set<string>();
  for (const k of unlockedKeysAt(prev))
    if (!known.has(k) && !bridgeLearned(letters[k])) return false;
  if (
    shiftUnlockedAt(prev) &&
    !known.has(SHIFT_UNIT) &&
    !bridgeLearned(letters[SHIFT_UNIT])
  )
    return false;
  return true;
}

/**
 * Die adaptive Freischaltung (`introduced`) so erweitern, dass sie alle Tasten
 * bis einschließlich dieser Lektion (plus Großschreibung, falls dort schon
 * freigeschaltet) enthält. Wird beim Abschluss einer Lektion angewandt, damit
 * „Mein Training" nahtlos dort weitergeht.
 */
export function introducedThroughLesson(
  introduced: string[] | undefined,
  id: string,
  lernweg: Lernweg,
): string[] {
  // Gerechnet wird in der Reihenfolge DIESER Tastatur — sonst käme über den
  // Lehrgang ein ß in den Stand eines Kindes mit Schweizer Tastatur zurück.
  const order = introOrder(lernweg);
  const set = new Set(ensureIntroduced(introduced, lernweg));
  for (const k of unlockedKeysAt(id)) if (order.includes(k)) set.add(k);
  if (shiftUnlockedAt(id)) set.add(SHIFT_UNIT);
  return order.filter((c) => set.has(c));
}

/**
 * ★ Die Namen der Lektionen englisch (EN3, 19.09.2026; seit EN7 hier statt in
 * `PupilStatsPanel.tsx`, weil auch das englische Handbuch sie nennt). Die
 * Liste „Lektionen" der Statistik und Anhang A des Handbuchs zeigen jede
 * Lektion mit Nummer und Namen. Die Tasten darin bleiben die der deutschen
 * Tastatur. Glossar: Grundstellung ⇒ *home position*, obere/untere Reihe ⇒
 * *top/bottom row*, Satzzeichen ⇒ *punctuation*, Sonderzeichen ⇒ *symbols*
 * (§3.5). Fehlt eine ID (neue Lektion), steht der deutsche Name - die Wächter
 * `tests/tastenflow-englisch-statistik.test.tsx` und
 * `tests/tastenflow-englisch-hilfe-handbuch.test.tsx` melden das.
 */
export const LEKTION_TITEL_EN: Readonly<Record<string, string>> = {
  "home-fj": "Home position: F and J",
  "home-dk": "Home position: D and K",
  "home-sl": "Home position: S and L",
  "home-aoe": "Home position complete: A and Ö",
  "home-gh": "The stretch: G and H",
  "shift-gross": "Capital letters with the Shift key",
  "ober-ei": "Top row: E and I",
  "ober-ru": "Top row: R and U",
  "ober-tz": "Top row: T and Z",
  "ober-wo": "Top row: W and O",
  "ober-qp": "Top row: Q and P",
  "unter-mv": "Bottom row: M and V",
  "unter-c-komma": "Bottom row: C and comma",
  "unter-x-punkt": "Bottom row: X and full stop",
  "unter-y-minus": "Bottom row: Y and hyphen",
  "unter-nb": "Bottom row: N and B",
  "text-erste-saetze": "First whole sentences",
  "umlaut-aeue": "Umlauts: Ä and Ü",
  "scharfes-s": "The sharp s: ß",
  satzzeichen: "Punctuation: ? ! : ;",
  zahlen: "The number row: 0-9",
  "satz-sonderzeichen": "Punctuation and symbols: ( ) @ € % & …",
  "text-witze": "Texts: jokes to type along",
  "text-zungenbrecher": "Texts: tongue twisters",
  "text-wortspiele": "Texts: sayings, proverbs and wordplay",
  "text-fakten": "Texts: interesting facts",
  "text-saetze": "Texts: whole sentences",
};

/** Der Name einer Lektion in der Bedienungssprache - ohne Angabe Deutsch. */
export function lektionTitel(l: Pick<Lesson, "id" | "title">, sprache: "de" | "en" = "de"): string {
  return sprache === "en" ? (LEKTION_TITEL_EN[l.id] ?? l.title) : l.title;
}
