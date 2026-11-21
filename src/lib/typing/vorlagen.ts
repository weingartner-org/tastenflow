/**
 * ★★★★★ VORLAGEN - der Lehrgang als Angebot in „Eigene Übung" (E7, 19.09.2026).
 *
 * Johannes' Entscheidung (Entwurf-Dokument §7c Punkt 2): *„als eigenen
 * Bereich auflösen, nur noch Vorlagen in ‚Eigene Übung' - ja."* Die
 * Übungsart „Lektionen" (eigener Übungsbildschirm, siehe `trainerMode.ts`)
 * ist entfallen; die LEKTIONSDATEN selbst (`curriculum.ts`, `LESSONS`)
 * bleiben unverändert stehen - hier bekommen sie einen zweiten, neuen
 * Verwendungszweck.
 *
 * ── Welche Lektionen werden zu Vorlagen? ────────────────────────────────────
 * NUR die sechs mit `kind: "text"` (Erste ganze Sätze, Witze, Zungenbrecher,
 * Sprüche/Wortspiele, Wissenswertes, Ganze Sätze). Die übrigen 21 Lektionen
 * (Grundstellung, neue Buchstaben, Großschreibung, Satzzeichen, Zahlen,
 * Sonderzeichen) haben gar keinen FESTEN Text - sie sind Tasten-Drill mit
 * generierten Silben/Wörtern, kein Dokument, das eine Klasse gemeinsam
 * abtippen könnte. Als Antwort auf „und die Challenge, wenn die Texte
 * passen" (Auftrag): JA, dieselben sechs passen auch dort - es sind reale,
 * geprüfte Sätze wie die Prüfungstexte selbst, nur nach Kategorie statt nach
 * Niveau sortiert; `verbietenSs` unterscheidet wie beim Upload zwischen den
 * beiden Kästen.
 *
 * ── Woher der Text kommt ────────────────────────────────────────────────────
 * Eine „Text"-Lektion hatte nie einen festen Text - der Generator zog beim
 * Üben live aus dem Korpus (`corpusItemsFor`, nach `corpusKinds` gefiltert).
 * Für eine VORLAGE braucht es trotzdem ein FESTES Ergebnis (dieselbe Vorschau
 * für die Lehrkraft und für die Klasse, die daraus startet) - darum wird
 * hier einmal, deterministisch (keine Zufallsreihenfolge, siehe
 * `corpusItemsFor`), eine Zeilen-Liste gezogen und wie ein Upload durch
 * {@link verarbeiteEigenenText} geschickt. `allowed` ist bewusst
 * {@link zeichenVorrat}("alles") - der VOLLE Zeichenvorrat, nicht der
 * Tastenstand eines einzelnen Kindes: Genau wie bei einer hochgeladenen
 * Datei bestimmt die Vorlage selbst, welche Tasten drankommen
 * (`eigenerText.ts`, „Neue Tasten werden in der Übung nicht freigeschaltet").
 *
 * ── ★ 21.09.2026: zwei weitere Arten von Vorlagen ───────────────────────────
 * Johannes: *„Fremdwörterkunde als Vorlage für eigene Übungen - zuerst das
 * deutsche Wort (oder die Beschreibung), dann das Fremdwort, nur abtippen, in
 * drei Altersstufen, mit den häufigsten Fremdwörtern, auch für die
 * Tippchallenge - aber dann andere Dateien, anders geordnet, die Wörter
 * bleiben dieselben"* und *„Programmcode zum Abtippen gibt es schon für die
 * Tippchallenge, das soll es auch als Vorlage für die eigene Übung geben -
 * andere Codes als bei der Tippchallenge"*.
 *
 *  • **Fremdwörterkunde** (`fremd-*`, `fremdc-*`): Die Wörter stehen EINMAL in
 *    `vorlagenDaten/fremdwoerter.ts`, je Altersstufe. „Eigene Übung" bekommt
 *    sie nach Themen geordnet (vier Dateien); die Tippchallenge dieselben
 *    Wörter ALPHABETISCH nach der deutschen Seite, auf drei Dateien verteilt
 *    - eine Klasse, die das Thema geübt hat, schreibt in der Challenge also
 *    nicht dieselben Dateien und nicht in derselben Reihenfolge. Nur für
 *    deutsche Übungstexte (ein englisches Gegenstück gibt es nicht).
 *  • **Programmcode** (`code-*`): zehn Ausschnitte, je einer pro Sprache,
 *    NICHT die der Tippchallenge (`vorlagenDaten/programmcode.ts`; der Wächter
 *    `tests/typing-vorlagen-neu.test.ts` prüft, dass sie sich nicht
 *    überschneiden). Nur für „Eigene Übung" - die Tippchallenge hat ihr
 *    eigenes Niveau „Programmcode". Die Zeilen bleiben, wie sie sind
 *    ({@link verarbeiteFesteZeilen}): Einrückung ist Teil des Codes.
 */
import { migriereStufe, type KontoStufe, type Lang, type Stufe } from "./account";
import type { CorpusKind } from "./corpus";
import { corpusItemsFor } from "./corpus";
import type { Lernweg } from "./lernweg";
import type { BedienSprache } from "../bedienSprache/sprache";
import { LESSONS, lektionTitel } from "./curriculum";
import {
  verarbeiteEigenenText,
  verarbeiteFesteZeilen,
  type EigenerTextVorschau,
} from "./eigenerText";
import { zeichenVorrat } from "./schreibprobe";
import { FREMD_THEMEN, FREMDWOERTER, type FremdPaar } from "./vorlagenDaten/fremdwoerter";
import { CODE_VORLAGEN } from "./vorlagenDaten/programmcode";
import {
  WORD_ROOTS,
  WORD_ROOTS_ALPHABETISCH,
  WORD_ROOT_THEMEN,
  wordRootZeile,
  type WordRootStufe,
} from "./vorlagenDaten/wordRoots";
import {
  RACINES,
  RACINES_ALPHABETISCH,
  RACINES_THEMEN,
  racineZeile,
  type RacineStufe,
} from "./vorlagenDaten/racines";
import {
  RAICES,
  RAICES_ALPHABETISCH,
  RAICES_THEMEN,
  raizZeile,
  type RaizStufe,
} from "./vorlagenDaten/raices";
import {
  RADICI,
  RADICI_ALFABETICO,
  RADICI_TEMI,
  radiceZeile,
  type RadiceStufe,
} from "./vorlagenDaten/radiciIt";
import {
  KOKLER,
  KOKLER_ALFABETIK,
  KOKLER_TEMALAR,
  kokZeile,
  type KokStufe,
} from "./vorlagenDaten/kokler";
import {
  KORZENIE,
  KORZENIE_ALFABETYCZNIE,
  KORZENIE_TEMATY,
  korzenZeile,
  type KorzenStufe,
} from "./vorlagenDaten/korzeniePl";
import {
  KORENY,
  KORENY_ABECEDNE,
  KORENY_TEMATA,
  korenZeile,
  type KorenStufe,
} from "./vorlagenDaten/korenyCs";
// ★ G3c-VERTEILER (25.10.2026): die Wurzel-Vorlagen der neun Gerüst-Wege (`vorlagenDaten/wurzeln<Xx>.ts`, heute leer ⇒ keine Vorlage).
import { WURZELN_BG, WURZELN_BG_ALPHABETISCH, WURZEL_CHALLENGE_TITEL_BG, WURZEL_THEMEN_BG, wurzelZeileBg } from "./vorlagenDaten/wurzelnBg";
import { WURZELN_EL, WURZELN_EL_ALPHABETISCH, WURZEL_CHALLENGE_TITEL_EL, WURZEL_THEMEN_EL, wurzelZeileEl } from "./vorlagenDaten/wurzelnEl";
import { WURZELN_HU, WURZELN_HU_ALPHABETISCH, WURZEL_CHALLENGE_TITEL_HU, WURZEL_THEMEN_HU, wurzelZeileHu } from "./vorlagenDaten/wurzelnHu";
import { WURZELN_NL, WURZELN_NL_ALPHABETISCH, WURZEL_CHALLENGE_TITEL_NL, WURZEL_THEMEN_NL, wurzelZeileNl } from "./vorlagenDaten/wurzelnNl";
import { WURZELN_PT, WURZELN_PT_ALPHABETISCH, WURZEL_CHALLENGE_TITEL_PT, WURZEL_THEMEN_PT, wurzelZeilePt } from "./vorlagenDaten/wurzelnPt";
import { WURZELN_BR, WURZELN_BR_ALPHABETISCH, WURZEL_CHALLENGE_TITEL_BR, WURZEL_THEMEN_BR, wurzelZeileBr } from "./vorlagenDaten/wurzelnBr";
import { WURZELN_RO, WURZELN_RO_ALPHABETISCH, WURZEL_CHALLENGE_TITEL_RO, WURZEL_THEMEN_RO, wurzelZeileRo } from "./vorlagenDaten/wurzelnRo";
import { WURZELN_SV, WURZELN_SV_ALPHABETISCH, WURZEL_CHALLENGE_TITEL_SV, WURZEL_THEMEN_SV, wurzelZeileSv } from "./vorlagenDaten/wurzelnSv";
import { WURZELN_UK, WURZELN_UK_ALPHABETISCH, WURZEL_CHALLENGE_TITEL_UK, WURZEL_THEMEN_UK, wurzelZeileUk } from "./vorlagenDaten/wurzelnUk";
import type { GeruestSprache } from "./sprachRegister";

/** Wozu eine Vorlage angeboten wird: „Eigene Übung" oder Tippchallenge mit eigener Datei. */
export type VorlageFuer = "uebung" | "challenge";

/**
 * Woher der Text einer Vorlage kommt.
 *
 * ★ E8 (24.09.2026, Bauplan englischer Lehrgang §6.3): „wurzeln" ist die
 * englische Entsprechung von „fremd" - „Word roots" statt „Fremdwörterkunde".
 * Ein eigener Wert (statt Wiederverwendung von „fremd") - die Gruppen-
 * Überschrift in `EigenerTextQuelle.tsx` unterscheidet sich, und beide Arten
 * sind über `langs` ohnehin gegenseitig ausgeschlossen (nie beide für dieselbe
 * Klasse).
 *
 * ★ E10a (25.09.2026, Bauplan §6.6): „racines" ist das französische
 * Gegenstück - „D'où viennent les mots ?" statt „Fremdwörterkunde"/„Word
 * roots". Ein eigener Wert aus demselben Grund wie „wurzeln": eigene
 * Gruppen-Überschrift, eigener Weg („fr", nie „de"/„en").
 *
 * ★ ES-S (27.09.2026, Bauplan spanischer Lehrgang §5.1): „raices" ist das
 * spanische Gegenstück - „Raíces y préstamos", eigener Weg „es".
 *
 * ★ IT-S (03.10.2026): „radici" ist das italienische - „Radici e prestiti", eigener Weg „it".
 *
 * ★ TR-S (09.10.2026): „kokler" ist das türkische - „Kökler ve alıntılar", eigener Weg „tr".
 *
 * ★ PL-W (09.10.2026): „korzenie" ist das polnische - „Korzenie i zapożyczenia", eigener Weg „pl".
 *
 * ★ CS-W (09.10.2026): „koreny" ist das tschechische - „Původ slov", eigener Weg „cs".
 *
 * ★ G3c-VERTEILER (25.10.2026): „wortherkunft" ist die Wurzel-Vorlage der neun Gerüst-Wege (bg … uk) - EINE Art für alle neun, unterschieden über
 * `langs` (Daten `vorlagenDaten/wurzeln<Xx>.ts`, Liste `GERUEST_WURZELN`).
 */
export type VorlageArt = "lektion" | "fremd" | "code" | "wurzeln" | "racines" | "raices" | "radici" | "korzenie" | "kokler" | "koreny" | "wortherkunft";

/** Eine Vorlage - Titel in beiden Bedienungssprachen + woher ihr Text kommt. */
export interface VorlageDef {
  id: string;
  /** Deutscher Name (bei einer Lektion: ihr Titel im Lehrgang). */
  titel: string;
  /** Englischer Name - bei einer Lektion nimmt {@link vorlageTitel} die Tabelle des Lehrgangs. */
  titelEn: string;
  /**
   * ★ E11a-5 (26.09.2026): Französischer Name - Pflichtfeld, damit `tsc` jede
   * neue Vorlage ohne französischen Namen meldet (sonst zeigte die
   * französische Bedienung still den deutschen, Falle 30).
   */
  titelFr: string;
  /** ★ ES-O (27.09.2026): Spanischer Name - Pflichtfeld aus demselben Grund. */
  titelEs: string;
  /** ★ O-IT (02.10.2026): Italienischer Name - Pflichtfeld aus demselben Grund. */
  titelIt: string;
  /** ★ O-PL (02.10.2026): Polnischer Name - Pflichtfeld aus demselben Grund. */
  titelPl: string;
  /** ★ O-TR (02.10.2026): Türkischer Name - Pflichtfeld aus demselben Grund. */
  titelTr: string;
  /** ★ O-CS (03.10.2026): Tschechischer Name - Pflichtfeld aus demselben Grund. */
  titelCs: string;
  titelBg: string;
  titelEl: string;
  titelHu: string;
  titelNl: string;
  titelPt: string;
  titelBr: string;
  titelRo: string;
  titelSv: string;
  titelUk: string;
  art: VorlageArt;
  /** Nur bei `art === "lektion"`: die Korpus-Sorten dahinter. */
  kinds: readonly CorpusKind[];
  /** In welchen Kästen die Vorlage steht. */
  fuer: readonly VorlageFuer[];
  /** Für welche Sprachen der Übungstexte es sie gibt. */
  langs: readonly Lang[];
}

/**
 * Höchstens so viele Zeilen bekommt eine Lektions-Vorlage. Der Korpus einer
 * Sorte (z. B. alle Witze einer Altersstufe) kann mehrere hundert Zeilen
 * umfassen - ein Übungstext dieser Länge wäre kein Dokument mehr, sondern der
 * ganze Vorrat auf einmal. Zum Vergleich: Die längste Prüfungsstufe
 * (`schreibprobe.ts`, `MIND_ZEICHEN` = 6000 Zeichen) kommt bei rund
 * 40-Zeichen-Zeilen auf etwa 150 Zeilen für eine ganze Klassenrunde à
 * mehrere Prüfungen - eine EINZELNE Vorlage bleibt bewusst kleiner.
 */
export const VORLAGE_ZEILEN_GROESST = 30;

/** Die Tippchallenge-Dateien der Fremdwörterkunde: so viele, gleichmässig geteilt. */
export const FREMD_CHALLENGE_DATEIEN = 3;

/** Zeilenmass der Fremdwörter-Paare (Braillezeile: 40 Module) - kein Umbruch mitten im Paar. */
const FREMD_ZEILENLAENGE = 40;

/** Die englischen Namen der vier Themen (die deutschen stehen bei den Daten). */
const FREMD_THEMA_EN: Readonly<Record<string, string>> = {
  schule: "School and learning",
  alltag: "Everyday life and leisure",
  technik: "Nature and technology",
  miteinander: "Getting along and society",
};

/**
 * ★ E11a-5: die französischen Namen der Text-Lektionen des DEUTSCHEN und
 * ENGLISCHEN Wegs - für eine Lehrkraft mit französischer Bedienung, die eine
 * Klasse auf Weg „de"/„en" verwaltet. Fehlt eine, gilt der englische Name
 * (die französische Oberfläche fällt auf Englisch zurück, nie auf Deutsch).
 */
const LEKTION_TITEL_FR: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Premières phrases entières",
  "text-witze": "Textes : blagues à recopier",
  "text-zungenbrecher": "Textes : virelangues",
  "text-wortspiele": "Textes : dictons, proverbes et jeux de mots",
  "text-fakten": "Textes : faits étonnants",
  "text-saetze": "Textes : phrases entières",
};

/** ★ ES-O (27.09.2026): die spanischen Namen der sechs Text-Lektionen. */
const LEKTION_TITEL_ES: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Primeras frases enteras",
  "text-witze": "Textos: chistes para copiar",
  "text-zungenbrecher": "Textos: trabalenguas",
  "text-wortspiele": "Textos: dichos, refranes y juegos de palabras",
  "text-fakten": "Textos: datos sorprendentes",
  "text-saetze": "Textos: frases enteras",
};

/** ★ O-IT (02.10.2026): die italienischen Namen der sechs Text-Lektionen. */
const LEKTION_TITEL_IT: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Prime frasi intere",
  "text-witze": "Testi: barzellette da ricopiare",
  "text-zungenbrecher": "Testi: scioglilingua",
  "text-wortspiele": "Testi: detti, proverbi e giochi di parole",
  "text-fakten": "Testi: fatti sorprendenti",
  "text-saetze": "Testi: frasi intere",
};

/** ★ O-PL (02.10.2026): die polnischen Namen der sechs Text-Lektionen. */
const LEKTION_TITEL_PL: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Pierwsze całe zdania",
  "text-witze": "Teksty: żarty do przepisania",
  "text-zungenbrecher": "Teksty: łamańce językowe",
  "text-wortspiele": "Teksty: powiedzenia, przysłowia i gry słowne",
  "text-fakten": "Teksty: zaskakujące ciekawostki",
  "text-saetze": "Teksty: całe zdania",
};

/**
 * ★ O-TR (02.10.2026): die türkischen Namen der sechs Text-Lektionen (Lehrkraft
 * sieht sie; Hauptwörter, nur das erste Wort gross - Glossar Regel 9/10).
 */
const LEKTION_TITEL_TR: Readonly<Record<string, string>> = {
  "text-erste-saetze": "İlk tam cümleler",
  "text-witze": "Metinler: fıkralar",
  "text-zungenbrecher": "Metinler: tekerlemeler",
  "text-wortspiele": "Metinler: deyimler, atasözleri ve kelime oyunları",
  "text-fakten": "Metinler: şaşırtıcı bilgiler",
  "text-saetze": "Metinler: tam cümleler",
};

/**
 * ★ O-CS (03.10.2026): die tschechischen Namen der sechs Text-Lektionen
 * (Lehrkraft sieht sie; Hauptwörter, nur das erste Wort gross - Glossar Regel 9).
 */
const LEKTION_TITEL_CS: Readonly<Record<string, string>> = {
  "text-erste-saetze": "První celé věty",
  "text-witze": "Texty: vtipy k opsání",
  "text-zungenbrecher": "Texty: jazykolamy",
  "text-wortspiele": "Texty: rčení, přísloví a slovní hříčky",
  "text-fakten": "Texty: překvapivé zajímavosti",
  "text-saetze": "Texty: celé věty",
};

/** ★ O-CS: die tschechischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_CS: Readonly<Record<string, string>> = {
  schule: "Škola a učení",
  alltag: "Všední den a volný čas",
  technik: "Příroda a technika",
  miteinander: "Soužití a společnost",
};

/** ★ O-TR: die türkischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_TR: Readonly<Record<string, string>> = {
  schule: "Okul ve öğrenme",
  alltag: "Günlük yaşam ve boş zaman",
  technik: "Doğa ve teknoloji",
  miteinander: "Birlikte yaşam ve toplum",
};

/** ★ O-PL: die polnischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_PL: Readonly<Record<string, string>> = {
  schule: "Szkoła i nauka",
  alltag: "Codzienność i czas wolny",
  technik: "Przyroda i technika",
  miteinander: "Życie razem i społeczeństwo",
};

/** ★ O-IT: die italienischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_IT: Readonly<Record<string, string>> = {
  schule: "Scuola e apprendimento",
  alltag: "Vita quotidiana e tempo libero",
  technik: "Natura e tecnica",
  miteinander: "Convivenza e società",
};

/** ★ ES-O: die spanischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_ES: Readonly<Record<string, string>> = {
  schule: "Escuela y aprendizaje",
  alltag: "Vida diaria y tiempo libre",
  technik: "Naturaleza y técnica",
  miteinander: "Convivencia y sociedad",
};

/** ★ E11a-5: die französischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_FR: Readonly<Record<string, string>> = {
  schule: "École et apprentissage",
  alltag: "Vie quotidienne et loisirs",
  technik: "Nature et technique",
  miteinander: "Vivre ensemble et société",
};

/**
 * ★ G2b-2 (02.10.2026): die Sprachen, für die es Lektions- und Programmcode-Vorlagen gibt - EINE
 * Liste statt `["de", "en"]` an zwei Stellen. Eine Sprache, die hier fehlt (fr, es, it, pl, tr, cs),
 * sieht diese Vorlagen NICHT und bekommt nie eine Vorschau mit deutschem Inhalt oder deutscher
 * Einleitung (`vorlageVorschau` gibt `null`). Kommt eine Sprache dazu, trägt sie sich hier ein -
 * ihr Korpus, ihr Programmcode-Text und ihr Einleitungssatz müssen dann da sein.
 */
export const SPRACHEN_MIT_LEKTIONSVORLAGEN: readonly Lang[] = ["de", "en"];

/**
 * ★ O2-LIB (30.10.2026): die bulgarischen Namen der sechs Text-Lektionen
 * (Lehrkraft sieht sie; Hauptwörter, nur das erste Wort gross).
 */
const LEKTION_TITEL_BG: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Първите цели изречения",
  "text-witze": "Текстове: вицове за преписване",
  "text-zungenbrecher": "Текстове: скороговорки",
  "text-wortspiele": "Текстове: изрази, пословици и игри на думи",
  "text-fakten": "Текстове: изненадващи факти",
  "text-saetze": "Текстове: цели изречения",
};

/** ★ O2-LIB: die bulgarischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_BG: Readonly<Record<string, string>> = {
  schule: "Училище и учене",
  alltag: "Ежедневие и свободно време",
  technik: "Природа и техника",
  miteinander: "Заедно и общество",
};

/** ★ O2-LIB: die bulgarischen Namen der vier Word-roots-Themen (Weg „en"). */
const WORTWURZELN_THEMA_BG: Readonly<Record<string, string>> = {
  numbers: "Числа и големина",
  nature: "Природни науки и природа",
  people: "Хора и общество",
  words: "Думи от други езици",
};

/** ★ O2-LIB: dieselben Namen bulgarisch (Weg „fr"). */
const RACINES_THEMA_BG: Readonly<Record<string, string>> = {
  "racines-1": "Корени на думи: гръцки и латински (1)",
  "racines-2": "Корени на думи: гръцки и латински (2)",
  ailleurs: "Думи от други езици",
  "chez-nous": "Регионални думи във франкофонския свят",
};

/** ★ O2-LIB: die bulgarischen Namen der vier „Raíces"-Themen (Weg „es"). */
const RAICES_THEMA_BG: Readonly<Record<string, string>> = {
  "griego-latin": "Корени на думи: гръцки и латински",
  arabe: "Испански думи от арабски",
  america: "Думи от езиците на Америка",
  prestamos: "Заети думи от други езици",
};

/** ★ O2-LIB: die bulgarischen Namen der Themen (Weg „it"). */
const RADICI_TEMA_BG: Readonly<Record<string, string>> = {
  "greco-latino": "Корени на думи: гръцки и латински",
  arabo: "Италиански думи от арабски",
  germanico: "Италиански думи от германски езици",
  lontano: "Италиански думи от далечни езици",
  italia: "Думи, родени в Италия",
};

/** ★ O2-LIB: die bulgarischen Namen der Themen (Weg „tr"). */
const KOKLER_TEMA_BG: Readonly<Record<string, string>> = {
  "yunanca-latince": "Корени на думи: гръцки и латински",
  arapca: "Турски думи от арабски",
  farsca: "Турски думи от персийски",
  bati: "Турски думи от западни езици",
  aile: "Семейства думи: един корен и неговите наставки",
};

/** ★ O2-LIB: die bulgarischen Namen der Themen (Weg „pl"). */
const KORZENIE_TEMAT_BG: Readonly<Record<string, string>> = {
  "greka-lacina": "Корени на думи: гръцки и латински",
  niemiecki: "Полски думи от немски",
  francuski: "Полски думи от френски",
  dalekie: "Полски думи от английски и от далечни езици",
  slowotworstwo: "Как се образуват полските думи",
};

/** ★ O2-LIB: die bulgarischen Namen der Themen (Weg „cs"). */
const KORENY_TEMA_BG: Readonly<Record<string, string>> = {
  "recko-latina": "Корени на думи: гръцки и латински",
  nemcina: "Чешки думи от немски",
  romanske: "Чешки думи от френски и италиански",
  svet: "Чешки думи от английски и от далечни краища",
  rodiny: "Семейства думи",
};

/** ★ O-EL-LIB (30.10.2026): die griechischen Namen der sechs Text-Lektionen (nur das erste Wort groß, Glossar Regel 9). */
const LEKTION_TITEL_EL: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Οι πρώτες ολόκληρες προτάσεις",
  "text-witze": "Κείμενα: αστεία για αντιγραφή",
  "text-zungenbrecher": "Κείμενα: γλωσσοδέτες",
  "text-wortspiele": "Κείμενα: ιδιωματισμοί, παροιμίες και λογοπαίγνια",
  "text-fakten": "Κείμενα: εκπληκτικά στοιχεία",
  "text-saetze": "Κείμενα: ολόκληρες προτάσεις",
};

/** ★ O-EL-LIB: die griechischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_EL: Readonly<Record<string, string>> = {
  schule: "Σχολείο και μάθηση",
  alltag: "Καθημερινότητα και ελεύθερος χρόνος",
  technik: "Φύση και τεχνολογία",
  miteinander: "Συμβίωση και κοινωνία",
};

/** ★ O-EL-LIB: die griechischen Namen der vier Word-roots-Themen (Weg «en»). */
const WORTWURZELN_THEMA_EL: Readonly<Record<string, string>> = {
  numbers: "Αριθμοί και μέγεθος",
  nature: "Φυσικές επιστήμες και φύση",
  people: "Άνθρωποι και κοινωνία",
  words: "Λέξεις από άλλες γλώσσες",
};

/** ★ O-EL-LIB: dieselben Namen griechisch (Weg «fr»). */
const RACINES_THEMA_EL: Readonly<Record<string, string>> = {
  "racines-1": "Ρίζες λέξεων: Ελληνικά και Λατινικά (1)",
  "racines-2": "Ρίζες λέξεων: Ελληνικά και Λατινικά (2)",
  ailleurs: "Λέξεις από άλλες γλώσσες",
  "chez-nous": "Περιφερειακές λέξεις των γαλλόφωνων χωρών",
};

/** ★ O-EL-LIB: die griechischen Namen der vier «Raíces»-Themen (Weg «es»). */
const RAICES_THEMA_EL: Readonly<Record<string, string>> = {
  "griego-latin": "Ρίζες λέξεων: Ελληνικά και Λατινικά",
  arabe: "Ισπανικές λέξεις από τα Αραβικά",
  america: "Λέξεις από τις γλώσσες της Αμερικής",
  prestamos: "Δάνειες λέξεις από άλλες γλώσσες",
};

/** ★ O-EL-LIB: die griechischen Namen der fünf «Radici»-Themen (Weg «it»). */
const RADICI_TEMA_EL: Readonly<Record<string, string>> = {
  "greco-latino": "Ρίζες λέξεων: Ελληνικά και Λατινικά",
  arabo: "Ιταλικές λέξεις από τα Αραβικά",
  germanico: "Ιταλικές λέξεις από τις γερμανικές γλώσσες",
  lontano: "Ιταλικές λέξεις από μακρινές γλώσσες",
  italia: "Λέξεις που γεννήθηκαν στην Ιταλία",
};

/** ★ O-EL-LIB: die griechischen Namen der fünf «Kökler»-Themen (Weg «tr»). */
const KOKLER_TEMA_EL: Readonly<Record<string, string>> = {
  "yunanca-latince": "Ρίζες λέξεων: Ελληνικά και Λατινικά",
  arapca: "Τουρκικές λέξεις από τα Αραβικά",
  farsca: "Τουρκικές λέξεις από τα Περσικά",
  bati: "Τουρκικές λέξεις από δυτικές γλώσσες",
  aile: "Οικογένειες λέξεων: μία ρίζα και οι καταλήξεις της",
};

/** ★ O-EL-LIB: die griechischen Namen der fünf «Korzenie»-Themen (Weg «pl»). */
const KORZENIE_TEMAT_EL: Readonly<Record<string, string>> = {
  "greka-lacina": "Ρίζες λέξεων: Ελληνικά και Λατινικά",
  niemiecki: "Πολωνικές λέξεις από τα Γερμανικά",
  francuski: "Πολωνικές λέξεις από τα Γαλλικά",
  dalekie: "Πολωνικές λέξεις από τα Αγγλικά και από μακρινές γλώσσες",
  slowotworstwo: "Πώς σχηματίζονται οι πολωνικές λέξεις",
};

/** ★ O-EL-LIB: die griechischen Namen der fünf «Kořeny»-Themen (Weg «cs»). */
const KORENY_TEMA_EL: Readonly<Record<string, string>> = {
  "recko-latina": "Ρίζες λέξεων: Ελληνικά και Λατινικά",
  nemcina: "Τσεχικές λέξεις από τα Γερμανικά",
  romanske: "Τσεχικές λέξεις από τα Γαλλικά και τα Ιταλικά",
  svet: "Τσεχικές λέξεις από τα Αγγλικά και από μακρινές χώρες",
  rodiny: "Οικογένειες λέξεων",
};

/**
 * ★ O2-LIB (30.10.2026): die ungarischen Namen der sechs Text-Lektionen
 * (Lehrkraft sieht sie; nur das erste Wort gross - Glossar Regel 9).
 */
const LEKTION_TITEL_HU: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Az első egész mondatok",
  "text-witze": "Szövegek: másolandó viccek",
  "text-zungenbrecher": "Szövegek: nyelvtörők",
  "text-wortspiele": "Szövegek: szólások, közmondások és szójátékok",
  "text-fakten": "Szövegek: meglepő érdekességek",
  "text-saetze": "Szövegek: egész mondatok",
};

/** ★ O2-LIB: die ungarischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_HU: Readonly<Record<string, string>> = {
  schule: "Iskola és tanulás",
  alltag: "Mindennapok és szabadidő",
  technik: "Természet és technika",
  miteinander: "Együttélés és társadalom",
};

/** ★ O2-LIB: die ungarischen Namen der vier Word-roots-Themen (Weg „en"). */
const WORTWURZELN_THEMA_HU: Readonly<Record<string, string>> = {
  numbers: "Számok és méretek",
  nature: "Természettudományok és természet",
  people: "Emberek és társadalom",
  words: "Más nyelvekből származó szavak",
};

/** ★ O2-LIB: dieselben Namen ungarisch (Weg „fr"). */
const RACINES_THEMA_HU: Readonly<Record<string, string>> = {
  "racines-1": "Szótövek: görög és latin (1)",
  "racines-2": "Szótövek: görög és latin (2)",
  ailleurs: "Más nyelvekből származó szavak",
  "chez-nous": "A frankofón országok regionális szavai",
};

/** ★ O2-LIB: die ungarischen Namen der vier „Raíces"-Themen (Weg „es"). */
const RAICES_THEMA_HU: Readonly<Record<string, string>> = {
  "griego-latin": "Szótövek: görög és latin",
  arabe: "Spanyol szavak arabból",
  america: "Amerika nyelveiből származó szavak",
  prestamos: "Más nyelvekből átvett szavak",
};

/** ★ O2-LIB: die ungarischen Namen der fünf „Radici"-Themen (Weg „it"). */
const RADICI_TEMA_HU: Readonly<Record<string, string>> = {
  "greco-latino": "Szótövek: görög és latin",
  arabo: "Olasz szavak arabból",
  germanico: "Olasz szavak germán nyelvekből",
  lontano: "Olasz szavak távoli nyelvekből",
  italia: "Olaszországban született szavak",
};

/** ★ O2-LIB: die ungarischen Namen der fünf „Kökler"-Themen (Weg „tr"). */
const KOKLER_TEMA_HU: Readonly<Record<string, string>> = {
  "yunanca-latince": "Szótövek: görög és latin",
  arapca: "Török szavak arabból",
  farsca: "Török szavak perzsából",
  bati: "Török szavak nyugati nyelvekből",
  aile: "Szócsaládok: egy tő és a toldalékai",
};

/** ★ O2-LIB: die ungarischen Namen der fünf „Korzenie"-Themen (Weg „pl"). */
const KORZENIE_TEMAT_HU: Readonly<Record<string, string>> = {
  "greka-lacina": "Szótövek: görög és latin",
  niemiecki: "Lengyel szavak németből",
  francuski: "Lengyel szavak franciából",
  dalekie: "Lengyel szavak angolból és távoli nyelvekből",
  slowotworstwo: "Hogyan keletkeznek a lengyel szavak",
};

/** ★ O2-LIB: die ungarischen Namen der fünf „Kořeny"-Themen (Weg „cs"). */
const KORENY_TEMA_HU: Readonly<Record<string, string>> = {
  "recko-latina": "Szótövek: görög és latin",
  nemcina: "Cseh szavak németből",
  romanske: "Cseh szavak franciából és olaszból",
  svet: "Cseh szavak angolból és távoli vidékekről",
  rodiny: "Szócsaládok",
};

/**
 * ★ O2-LIB (29.10.2026): die niederländischen Namen der sechs Text-Lektionen (Lehrkraft sieht sie;
 * Hauptwörter, nur das erste Wort groß - Glossar nl Regel 10).
 */
const LEKTION_TITEL_NL: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Eerste hele zinnen",
  "text-witze": "Teksten: moppen om over te typen",
  "text-zungenbrecher": "Teksten: tongbrekers",
  "text-wortspiele": "Teksten: gezegden, spreekwoorden en woordspelingen",
  "text-fakten": "Teksten: verrassende weetjes",
  "text-saetze": "Teksten: hele zinnen",
};

/** ★ O2-LIB: die niederländischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_NL: Readonly<Record<string, string>> = {
  schule: "School en leren",
  alltag: "Dagelijks leven en vrije tijd",
  technik: "Natuur en techniek",
  miteinander: "Samenleven en samenleving",
};

/** ★ O2-LIB: die niederländischen Namen der vier Word-roots-Themen (Weg "en"). */
const WORTWURZELN_THEMA_NL: Readonly<Record<string, string>> = {
  numbers: "Getallen en grootte",
  nature: "Natuurwetenschappen en natuur",
  people: "Mensen en samenleving",
  words: "Woorden uit andere talen",
};

/** ★ O2-LIB: dieselben Namen niederländisch (Weg "fr"). */
const RACINES_THEMA_NL: Readonly<Record<string, string>> = {
  "racines-1": "Woordwortels: Grieks en Latijn (1)",
  "racines-2": "Woordwortels: Grieks en Latijn (2)",
  ailleurs: "Woorden uit andere talen",
  "chez-nous": "Regionale woorden uit Franstalige landen",
};

/** ★ O2-LIB: die niederländischen Namen der vier "Raíces"-Themen (Weg "es"). */
const RAICES_THEMA_NL: Readonly<Record<string, string>> = {
  "griego-latin": "Woordwortels: Grieks en Latijn",
  arabe: "Spaanse woorden uit het Arabisch",
  america: "Woorden uit talen van Amerika",
  prestamos: "Leenwoorden uit andere talen",
};

const RADICI_TEMA_NL: Readonly<Record<string, string>> = {
  "greco-latino": "Woordwortels: Grieks en Latijn",
  arabo: "Italiaanse woorden uit het Arabisch",
  germanico: "Italiaanse woorden uit Germaanse talen",
  lontano: "Italiaanse woorden uit verre talen",
  italia: "Woorden die in Italië zijn ontstaan",
};

const KOKLER_TEMA_NL: Readonly<Record<string, string>> = {
  "yunanca-latince": "Woordwortels: Grieks en Latijn",
  arapca: "Turkse woorden uit het Arabisch",
  farsca: "Turkse woorden uit het Perzisch",
  bati: "Turkse woorden uit westerse talen",
  aile: "Woordfamilies: één stam en zijn uitgangen",
};

const KORZENIE_TEMAT_NL: Readonly<Record<string, string>> = {
  "greka-lacina": "Woordwortels: Grieks en Latijn",
  niemiecki: "Poolse woorden uit het Duits",
  francuski: "Poolse woorden uit het Frans",
  dalekie: "Poolse woorden uit het Engels en uit verre talen",
  slowotworstwo: "Hoe Poolse woorden worden gevormd",
};

const KORENY_TEMA_NL: Readonly<Record<string, string>> = {
  "recko-latina": "Woordwortels: Grieks en Latijn",
  nemcina: "Tsjechische woorden uit het Duits",
  romanske: "Tsjechische woorden uit het Frans en Italiaans",
  svet: "Tsjechische woorden uit het Engels en uit verre landen",
  rodiny: "Woordfamilies",
};

/**
 * ★ O-LIB (30.10.2026): os nomes portugueses das seis lições de texto (quem ensina vê-os; substantivos,
 * só a primeira palavra em maiúscula - Glossar Regel 9).
 */
const LEKTION_TITEL_PT: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Primeiras frases completas",
  "text-witze": "Textos: anedotas para copiar",
  "text-zungenbrecher": "Textos: trava-línguas",
  "text-wortspiele": "Textos: provérbios, expressões e jogos de palavras",
  "text-fakten": "Textos: curiosidades surpreendentes",
  "text-saetze": "Textos: frases completas",
};

/** ★ O-LIB: os nomes portugueses dos quatro temas das (alemãs) palavras estrangeiras. */
const FREMD_THEMA_PT: Readonly<Record<string, string>> = {
  schule: "Escola e aprendizagem",
  alltag: "Dia a dia e tempo livre",
  technik: "Natureza e tecnologia",
  miteinander: "Convivência e sociedade",
};

/** ★ O-LIB: os nomes portugueses dos quatro temas das raízes das palavras inglesas (caminho "en"). */
const WORTWURZELN_THEMA_PT: Readonly<Record<string, string>> = {
  numbers: "Números e tamanho",
  nature: "Ciências naturais e natureza",
  people: "Pessoas e sociedade",
  words: "Palavras de outras línguas",
};

/** ★ O-LIB: os mesmos nomes em português (caminho "fr"). */
const RACINES_THEMA_PT: Readonly<Record<string, string>> = {
  "racines-1": "Raízes das palavras: grego e latim (1)",
  "racines-2": "Raízes das palavras: grego e latim (2)",
  ailleurs: "Palavras de outras línguas",
  "chez-nous": "Palavras regionais da Francofonia",
};

/** ★ O-LIB: os nomes portugueses dos quatro temas das "Raíces" (caminho "es"). */
const RAICES_THEMA_PT: Readonly<Record<string, string>> = {
  "griego-latin": "Raízes das palavras: grego e latim",
  arabe: "Palavras espanholas vindas do árabe",
  america: "Palavras das línguas das Américas",
  prestamos: "Empréstimos de outras línguas",
};

const RADICI_TEMA_PT: Readonly<Record<string, string>> = {
  "greco-latino": "Raízes das palavras: grego e latim",
  arabo: "Palavras italianas vindas do árabe",
  germanico: "Palavras italianas vindas das línguas germânicas",
  lontano: "Palavras italianas vindas de línguas distantes",
  italia: "Palavras nascidas em Itália",
};

const KOKLER_TEMA_PT: Readonly<Record<string, string>> = {
  "yunanca-latince": "Raízes das palavras: grego e latim",
  arapca: "Palavras turcas vindas do árabe",
  farsca: "Palavras turcas vindas do persa",
  bati: "Palavras turcas vindas das línguas ocidentais",
  aile: "Famílias de palavras: uma raiz e os seus sufixos",
};

const KORZENIE_TEMAT_PT: Readonly<Record<string, string>> = {
  "greka-lacina": "Raízes das palavras: grego e latim",
  niemiecki: "Palavras polacas vindas do alemão",
  francuski: "Palavras polacas vindas do francês",
  dalekie: "Palavras polacas vindas do inglês e de línguas distantes",
  slowotworstwo: "Como se formam as palavras polacas",
};

const KORENY_TEMA_PT: Readonly<Record<string, string>> = {
  "recko-latina": "Raízes das palavras: grego e latim",
  nemcina: "Palavras checas vindas do alemão",
  romanske: "Palavras checas vindas do francês e do italiano",
  svet: "Palavras checas vindas do inglês e de terras distantes",
  rodiny: "Famílias de palavras",
};

/** ★ O2-LIB (29.10.2026): die Namen der sechs Text-Lektionen, Portugiesisch (Brasilien) - nur das erste Wort groß (Glossar Regel 9). */
const LEKTION_TITEL_BR: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Primeiras frases completas",
  "text-witze": "Textos: piadas para copiar",
  "text-zungenbrecher": "Textos: trava-línguas",
  "text-wortspiele": "Textos: ditados, provérbios e jogos de palavras",
  "text-fakten": "Textos: curiosidades surpreendentes",
  "text-saetze": "Textos: frases completas",
};

/** ★ O2-LIB (29.10.2026): die Namen der vier Themen der (deutschen) Fremdwörterkunde, Portugiesisch (Brasilien). */
const FREMD_THEMA_BR: Readonly<Record<string, string>> = {
  schule: "Escola e aprendizagem",
  alltag: "Dia a dia e tempo livre",
  technik: "Natureza e tecnologia",
  miteinander: "Convivência e sociedade",
};

/** ★ O2-LIB (29.10.2026): die vier Word-roots-Themen (Weg "en"), Portugiesisch (Brasilien). */
const WORTWURZELN_THEMA_BR: Readonly<Record<string, string>> = {
  numbers: "Números e tamanho",
  nature: "Ciências naturais e natureza",
  people: "Pessoas e sociedade",
  words: "Palavras vindas de outras línguas",
};

/** ★ O2-LIB (29.10.2026): dieselben Namen für den Weg "fr", Portugiesisch (Brasilien). */
const RACINES_THEMA_BR: Readonly<Record<string, string>> = {
  "racines-1": "Radicais das palavras: grego e latim (1)",
  "racines-2": "Radicais das palavras: grego e latim (2)",
  ailleurs: "Palavras vindas de outras línguas",
  "chez-nous": "Palavras regionais da francofonia",
};

/** ★ O2-LIB (29.10.2026): die vier "Raíces"-Themen (Weg "es"), Portugiesisch (Brasilien). */
const RAICES_THEMA_BR: Readonly<Record<string, string>> = {
  "griego-latin": "Radicais das palavras: grego e latim",
  arabe: "Palavras do espanhol vindas do árabe",
  america: "Palavras vindas das línguas da América",
  prestamos: "Palavras emprestadas de outras línguas",
};

/** ★ O2-LIB (29.10.2026): die Themen der "Radici" (Weg "it"), Portugiesisch (Brasilien). */
const RADICI_TEMA_BR: Readonly<Record<string, string>> = {
  "greco-latino": "Radicais das palavras: grego e latim",
  arabo: "Palavras do italiano vindas do árabe",
  germanico: "Palavras do italiano vindas das línguas germânicas",
  lontano: "Palavras do italiano vindas de línguas distantes",
  italia: "Palavras nascidas na Itália",
};

/** ★ O2-LIB (29.10.2026): die Themen der "Kökler" (Weg "tr"), Portugiesisch (Brasilien). */
const KOKLER_TEMA_BR: Readonly<Record<string, string>> = {
  "yunanca-latince": "Radicais das palavras: grego e latim",
  arapca: "Palavras do turco vindas do árabe",
  farsca: "Palavras do turco vindas do persa",
  bati: "Palavras do turco vindas de línguas ocidentais",
  aile: "Famílias de palavras: uma raiz e seus sufixos",
};

/** ★ O2-LIB (29.10.2026): die Themen der "Korzenie" (Weg "pl"), Portugiesisch (Brasilien). */
const KORZENIE_TEMAT_BR: Readonly<Record<string, string>> = {
  "greka-lacina": "Radicais das palavras: grego e latim",
  niemiecki: "Palavras do polonês vindas do alemão",
  francuski: "Palavras do polonês vindas do francês",
  dalekie: "Palavras do polonês vindas do inglês e de línguas distantes",
  slowotworstwo: "Como as palavras do polonês são formadas",
};

/** ★ O2-LIB (29.10.2026): die Themen der "Kořeny" (Weg "cs"), Portugiesisch (Brasilien). */
const KORENY_TEMA_BR: Readonly<Record<string, string>> = {
  "recko-latina": "Radicais das palavras: grego e latim",
  nemcina: "Palavras do tcheco vindas do alemão",
  romanske: "Palavras do tcheco vindas do francês e do italiano",
  svet: "Palavras do tcheco vindas do inglês e de terras distantes",
  rodiny: "Famílias de palavras",
};

/**
 * ★ O2-LIB (29.10.2026): die rumänischen Namen der sechs Text-Lektionen
 * (Lehrkraft sieht sie; Hauptwörter, nur das erste Wort gross - Glossar Regel 9).
 */
const LEKTION_TITEL_RO: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Primele propoziții întregi",
  "text-witze": "Texte: glume de copiat",
  "text-zungenbrecher": "Texte: frământări de limbă",
  "text-wortspiele": "Texte: zicători, proverbe și jocuri de cuvinte",
  "text-fakten": "Texte: curiozități surprinzătoare",
  "text-saetze": "Texte: propoziții întregi",
};

/** ★ O2-LIB: die rumänischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_RO: Readonly<Record<string, string>> = {
  schule: "Școală și învățare",
  alltag: "Viața de zi cu zi și timpul liber",
  technik: "Natură și tehnică",
  miteinander: "Conviețuire și societate",
};

/** ★ O2-LIB: die rumänischen Namen der vier Word-roots-Themen (Weg „en“). */
const WORTWURZELN_THEMA_RO: Readonly<Record<string, string>> = {
  numbers: "Numere și mărime",
  nature: "Științele naturii și natura",
  people: "Oameni și societate",
  words: "Cuvinte din alte limbi",
};

/** ★ O2-LIB: dieselben Namen rumänisch (Weg „fr“). */
const RACINES_THEMA_RO: Readonly<Record<string, string>> = {
  "racines-1": "Rădăcini de cuvinte: greacă și latină (1)",
  "racines-2": "Rădăcini de cuvinte: greacă și latină (2)",
  ailleurs: "Cuvinte din alte limbi",
  "chez-nous": "Cuvinte regionale din țările francofone",
};

/** ★ O2-LIB: die rumänischen Namen der vier „Raíces“-Themen (Weg „es“). */
const RAICES_THEMA_RO: Readonly<Record<string, string>> = {
  "griego-latin": "Rădăcini de cuvinte: greacă și latină",
  arabe: "Cuvinte spaniole din arabă",
  america: "Cuvinte din limbile Americii",
  prestamos: "Împrumuturi din alte limbi",
};

const RADICI_TEMA_RO: Readonly<Record<string, string>> = {
  "greco-latino": "Rădăcini de cuvinte: greacă și latină",
  arabo: "Cuvinte italiene din arabă",
  germanico: "Cuvinte italiene din limbi germanice",
  lontano: "Cuvinte italiene din limbi îndepărtate",
  italia: "Cuvinte născute în Italia",
};

const KOKLER_TEMA_RO: Readonly<Record<string, string>> = {
  "yunanca-latince": "Rădăcini de cuvinte: greacă și latină",
  arapca: "Cuvinte turcești din arabă",
  farsca: "Cuvinte turcești din persană",
  bati: "Cuvinte turcești din limbi occidentale",
  aile: "Familii de cuvinte: o rădăcină și sufixele ei",
};

const KORZENIE_TEMAT_RO: Readonly<Record<string, string>> = {
  "greka-lacina": "Rădăcini de cuvinte: greacă și latină",
  niemiecki: "Cuvinte poloneze din germană",
  francuski: "Cuvinte poloneze din franceză",
  dalekie: "Cuvinte poloneze din engleză și din limbi îndepărtate",
  slowotworstwo: "Cum se formează cuvintele poloneze",
};

const KORENY_TEMA_RO: Readonly<Record<string, string>> = {
  "recko-latina": "Rădăcini de cuvinte: greacă și latină",
  nemcina: "Cuvinte cehe din germană",
  romanske: "Cuvinte cehe din franceză și italiană",
  svet: "Cuvinte cehe din engleză și din ținuturi îndepărtate",
  rodiny: "Familii de cuvinte",
};

/**
 * ★ O2-LIB (30.10.2026): die schwedischen Namen der sechs Text-Lektionen (Lehrkraft sieht sie;
 * Hauptwörter, nur das erste Wort groß - Glossar sv Regel 10).
 */
const LEKTION_TITEL_SV: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Första hela meningar",
  "text-witze": "Texter: skämt att skriva av",
  "text-zungenbrecher": "Texter: tungvrickare",
  "text-wortspiele": "Texter: talesätt, ordspråk och ordlekar",
  "text-fakten": "Texter: överraskande fakta",
  "text-saetze": "Texter: hela meningar",
};

/** ★ O2-LIB: die schwedischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_SV: Readonly<Record<string, string>> = {
  schule: "Skola och lärande",
  alltag: "Vardag och fritid",
  technik: "Natur och teknik",
  miteinander: "Att leva tillsammans och samhälle",
};

/** ★ O2-LIB: die schwedischen Namen der vier Word-roots-Themen (Weg "en"). */
const WORTWURZELN_THEMA_SV: Readonly<Record<string, string>> = {
  numbers: "Tal och storlek",
  nature: "Naturvetenskap och natur",
  people: "Människor och samhälle",
  words: "Ord från andra språk",
};

/** ★ O2-LIB: dieselben Namen schwedisch (Weg "fr"). */
const RACINES_THEMA_SV: Readonly<Record<string, string>> = {
  "racines-1": "Ordrötter: grekiska och latin (1)",
  "racines-2": "Ordrötter: grekiska och latin (2)",
  ailleurs: "Ord från andra språk",
  "chez-nous": "Regionala ord från frankofona länder",
};

/** ★ O2-LIB: die schwedischen Namen der vier "Raíces"-Themen (Weg "es"). */
const RAICES_THEMA_SV: Readonly<Record<string, string>> = {
  "griego-latin": "Ordrötter: grekiska och latin",
  arabe: "Spanska ord från arabiska",
  america: "Ord från språk i Amerika",
  prestamos: "Lånord från andra språk",
};

const RADICI_TEMA_SV: Readonly<Record<string, string>> = {
  "greco-latino": "Ordrötter: grekiska och latin",
  arabo: "Italienska ord från arabiska",
  germanico: "Italienska ord från germanska språk",
  lontano: "Italienska ord från avlägsna språk",
  italia: "Ord som föddes i Italien",
};

const KOKLER_TEMA_SV: Readonly<Record<string, string>> = {
  "yunanca-latince": "Ordrötter: grekiska och latin",
  arapca: "Turkiska ord från arabiska",
  farsca: "Turkiska ord från persiska",
  bati: "Turkiska ord från västliga språk",
  aile: "Ordfamiljer: en stam och dess ändelser",
};

const KORZENIE_TEMAT_SV: Readonly<Record<string, string>> = {
  "greka-lacina": "Ordrötter: grekiska och latin",
  niemiecki: "Polska ord från tyska",
  francuski: "Polska ord från franska",
  dalekie: "Polska ord från engelskan och avlägsna språk",
  slowotworstwo: "Hur polska ord bildas",
};

const KORENY_TEMA_SV: Readonly<Record<string, string>> = {
  "recko-latina": "Ordrötter: grekiska och latin",
  nemcina: "Tjeckiska ord från tyska",
  romanske: "Tjeckiska ord från franska och italienska",
  svet: "Tjeckiska ord från engelska och avlägsna länder",
  rodiny: "Ordfamiljer",
};

/**
 * ★ O2-LIB (30.10.2026): die ukrainischen Namen der sechs Text-Lektionen (Lehrkraft sieht sie;
 * Hauptwörter, nur das erste Wort gross - Glossar Regel 9).
 */
const LEKTION_TITEL_UK: Readonly<Record<string, string>> = {
  "text-erste-saetze": "Перші цілі речення",
  "text-witze": "Тексти: жарти для переписування",
  "text-zungenbrecher": "Тексти: скоромовки",
  "text-wortspiele": "Тексти: приказки, прислів'я та гра слів",
  "text-fakten": "Тексти: дивовижні факти",
  "text-saetze": "Тексти: цілі речення",
};

/** ★ O2-LIB: die ukrainischen Namen der vier Themen der (deutschen) Fremdwörterkunde. */
const FREMD_THEMA_UK: Readonly<Record<string, string>> = {
  schule: "Школа й навчання",
  alltag: "Повсякдення й дозвілля",
  technik: "Природа й техніка",
  miteinander: "Співжиття й суспільство",
};

/** ★ O2-LIB: die ukrainischen Namen der vier Word-roots-Themen (Weg „en"). */
const WORTWURZELN_THEMA_UK: Readonly<Record<string, string>> = {
  numbers: "Числа й розмір",
  nature: "Природничі науки й природа",
  people: "Люди й суспільство",
  words: "Слова з інших мов",
};

/** ★ O2-LIB: dieselben Namen ukrainisch (Weg „fr"). */
const RACINES_THEMA_UK: Readonly<Record<string, string>> = {
  "racines-1": "Корені слів: грецька й латина (1)",
  "racines-2": "Корені слів: грецька й латина (2)",
  ailleurs: "Слова з інших мов",
  "chez-nous": "Регіональні слова франкофонних країн",
};

/** ★ O2-LIB: die ukrainischen Namen der vier „Raíces"-Themen (Weg „es"). */
const RAICES_THEMA_UK: Readonly<Record<string, string>> = {
  "griego-latin": "Корені слів: грецька й латина",
  arabe: "Іспанські слова з арабської",
  america: "Слова з мов Америки",
  prestamos: "Запозичення з інших мов",
};

const RADICI_TEMA_UK: Readonly<Record<string, string>> = {
  "greco-latino": "Корені слів: грецька й латина",
  arabo: "Італійські слова з арабської",
  germanico: "Італійські слова з германських мов",
  lontano: "Італійські слова з далеких мов",
  italia: "Слова, що виникли в Італії",
};

const KOKLER_TEMA_UK: Readonly<Record<string, string>> = {
  "yunanca-latince": "Корені слів: грецька й латина",
  arapca: "Турецькі слова з арабської",
  farsca: "Турецькі слова з перської",
  bati: "Турецькі слова із західних мов",
  aile: "Родини слів: один корінь і його закінчення",
};

const KORZENIE_TEMAT_UK: Readonly<Record<string, string>> = {
  "greka-lacina": "Корені слів: грецька й латина",
  niemiecki: "Польські слова з німецької",
  francuski: "Польські слова з французької",
  dalekie: "Польські слова з англійської та далеких мов",
  slowotworstwo: "Як утворюються польські слова",
};

const KORENY_TEMA_UK: Readonly<Record<string, string>> = {
  "recko-latina": "Корені слів: грецька й латина",
  nemcina: "Чеські слова з німецької",
  romanske: "Чеські слова з французької та італійської",
  svet: "Чеські слова з англійської та далеких країн",
  rodiny: "Родини слів",
};

/** Die sechs Text-Lektionen, in der Reihenfolge des Lehrgangs. */
const LEKTIONS_VORLAGEN: readonly VorlageDef[] = LESSONS.filter(
  (l) => l.kind === "text" && (l.corpusKinds?.length ?? 0) > 0,
).map((l) => ({
  id: l.id,
  titel: l.title,
  titelEn: lektionTitel({ id: l.id, title: l.title }, "en"),
  titelFr: LEKTION_TITEL_FR[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelEs: LEKTION_TITEL_ES[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelIt: LEKTION_TITEL_IT[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelPl: LEKTION_TITEL_PL[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelTr: LEKTION_TITEL_TR[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelCs: LEKTION_TITEL_CS[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelBg: LEKTION_TITEL_BG[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelEl: LEKTION_TITEL_EL[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelHu: LEKTION_TITEL_HU[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelNl: LEKTION_TITEL_NL[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelPt: LEKTION_TITEL_PT[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelBr: LEKTION_TITEL_BR[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelRo: LEKTION_TITEL_RO[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelSv: LEKTION_TITEL_SV[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  titelUk: LEKTION_TITEL_UK[l.id] ?? lektionTitel({ id: l.id, title: l.title }, "en"),
  art: "lektion" as const,
  kinds: l.corpusKinds as CorpusKind[],
  fuer: ["uebung", "challenge"] as const,
  langs: SPRACHEN_MIT_LEKTIONSVORLAGEN,
}));

/** „Fremdwörterkunde" für „Eigene Übung": eine Datei je Thema. */
const FREMD_UEBUNG: readonly VorlageDef[] = FREMD_THEMEN.map((t) => ({
  id: `fremd-${t.id}`,
  titel: `Fremdwörterkunde: ${t.titel}`,
  titelEn: `Foreign words: ${FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelFr: `Mots d'emprunt en allemand : ${FREMD_THEMA_FR[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelEs: `Palabras extranjeras en alemán: ${FREMD_THEMA_ES[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelIt: `Parole straniere in tedesco: ${FREMD_THEMA_IT[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelPl: `Wyrazy obce w języku niemieckim: ${FREMD_THEMA_PL[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelTr: `Almancada yabancı kökenli kelimeler: ${FREMD_THEMA_TR[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelCs: `Cizí slova v němčině: ${FREMD_THEMA_CS[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelBg: `Чужди думи в немския език: ${FREMD_THEMA_BG[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelEl: `Ξένες λέξεις στα Γερμανικά: ${FREMD_THEMA_EL[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelHu: `Idegen szavak németül: ${FREMD_THEMA_HU[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelNl: `Vreemde woorden in het Duits: ${FREMD_THEMA_NL[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelPt: `Palavras estrangeiras em alemão: ${FREMD_THEMA_PT[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelBr: `Palavras estrangeiras em alemão: ${FREMD_THEMA_BR[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelRo: `Cuvinte străine în germană: ${FREMD_THEMA_RO[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelSv: `Främmande ord i tyskan: ${FREMD_THEMA_SV[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  titelUk: `Іншомовні слова в німецькій: ${FREMD_THEMA_UK[t.id] ?? FREMD_THEMA_EN[t.id] ?? t.titel}`,
  art: "fremd" as const,
  kinds: [] as const,
  fuer: ["uebung"] as const,
  langs: ["de"] as const,
}));

/** „Fremdwörterkunde" für die Tippchallenge: dieselben Wörter, alphabetisch, anders verteilt. */
const FREMD_CHALLENGE: readonly VorlageDef[] = Array.from({ length: FREMD_CHALLENGE_DATEIEN }, (_, i) => ({
  id: `fremdc-${i + 1}`,
  titel: `Fremdwörterkunde, alphabetisch: Datei ${i + 1} von ${FREMD_CHALLENGE_DATEIEN}`,
  titelEn: `Foreign words, alphabetical: file ${i + 1} of ${FREMD_CHALLENGE_DATEIEN}`,
  titelFr: `Mots d'emprunt en allemand, par ordre alphabétique : fichier ${i + 1} sur ${FREMD_CHALLENGE_DATEIEN}`,
  titelEs: `Palabras extranjeras en alemán, por orden alfabético: archivo ${i + 1} de ${FREMD_CHALLENGE_DATEIEN}`,
  titelIt: `Parole straniere in tedesco, in ordine alfabetico: file ${i + 1} di ${FREMD_CHALLENGE_DATEIEN}`,
  titelPl: `Wyrazy obce w języku niemieckim, alfabetycznie: plik ${i + 1} z ${FREMD_CHALLENGE_DATEIEN}`,
  titelTr: `Almancada yabancı kökenli kelimeler, alfabetik sırayla: dosya ${i + 1}, toplam ${FREMD_CHALLENGE_DATEIEN}`,
  // ★ O-CS: „soubor 2/3" - Schrägstrich statt „z/ze" (Glossar Regel 13).
  titelCs: `Cizí slova v němčině, abecedně: soubor ${i + 1}/${FREMD_CHALLENGE_DATEIEN}`,
  titelBg: `Чужди думи в немския език, по азбучен ред: файл ${i + 1}/${FREMD_CHALLENGE_DATEIEN}`,
  titelEl: `Ξένες λέξεις στα Γερμανικά, αλφαβητικά: αρχείο ${i + 1}/${FREMD_CHALLENGE_DATEIEN}`,
  titelHu: `Idegen szavak németül, ábécérendben, fájl: ${i + 1}/${FREMD_CHALLENGE_DATEIEN}`,
  titelNl: `Vreemde woorden in het Duits, alfabetisch: bestand ${i + 1} van ${FREMD_CHALLENGE_DATEIEN}`,
  titelPt: `Palavras estrangeiras em alemão, por ordem alfabética: ficheiro ${i + 1} de ${FREMD_CHALLENGE_DATEIEN}`,
  titelBr: `Palavras estrangeiras em alemão, em ordem alfabética: arquivo ${i + 1} de ${FREMD_CHALLENGE_DATEIEN}`,
  titelRo: `Cuvinte străine în germană, în ordine alfabetică: fișierul ${i + 1}/${FREMD_CHALLENGE_DATEIEN}`,
  titelSv: `Främmande ord i tyskan, alfabetiskt: fil ${i + 1}/${FREMD_CHALLENGE_DATEIEN}`,
  titelUk: `Іншомовні слова в німецькій, за абеткою: файл ${i + 1}/${FREMD_CHALLENGE_DATEIEN}`,
  art: "fremd" as const,
  kinds: [] as const,
  fuer: ["challenge"] as const,
  langs: ["de"] as const,
}));

/**
 * ★ E8 (24.09.2026): die deutschen Namen der vier Word-roots-Themen - für eine
 * Lehrkraft mit deutscher Bedienung, die eine Klasse auf Weg „en" verwaltet
 * (D2: der Weg bleibt fest, auch wenn die Bedienung später wieder Deutsch
 * wird). Die englischen Namen stehen schon bei den Daten (`WORD_ROOT_THEMEN`).
 */
const WORTWURZELN_THEMA_DE: Readonly<Record<string, string>> = {
  numbers: "Zahlen und Grösse",
  nature: "Naturwissenschaft und Natur",
  people: "Menschen und Gesellschaft",
  words: "Wörter aus anderen Sprachen",
};

/** ★ E11a-5: die französischen Namen der vier Word-roots-Themen (Weg „en"). */
const WORTWURZELN_THEMA_FR: Readonly<Record<string, string>> = {
  numbers: "Nombres et grandeur",
  nature: "Sciences et nature",
  people: "Personnes et société",
  words: "Mots venus d'autres langues",
};

/** ★ ES-O (27.09.2026): die spanischen Namen der vier Word-roots-Themen (Weg „en"). */
const WORTWURZELN_THEMA_ES: Readonly<Record<string, string>> = {
  numbers: "Números y tamaño",
  nature: "Ciencias y naturaleza",
  people: "Personas y sociedad",
  words: "Palabras de otras lenguas",
};

/** „Word roots" für „Eigene Übung": eine Datei je Thema - das englische Gegenstück zu Fremdwörterkunde. */
const WORTWURZELN_THEMA_IT: Readonly<Record<string, string>> = {
  numbers: "Numeri e grandezza",
  nature: "Scienze e natura",
  people: "Persone e società",
  words: "Parole da altre lingue",
};

/** ★ O-TR (02.10.2026): die türkischen Namen der vier Word-roots-Themen (Weg "en"). */
const WORTWURZELN_THEMA_TR: Readonly<Record<string, string>> = {
  numbers: "Sayılar ve büyüklük",
  nature: "Fen bilimleri ve doğa",
  people: "İnsanlar ve toplum",
  words: "Başka dillerden kelimeler",
};

/** ★ O-CS (03.10.2026): die tschechischen Namen der vier Word-roots-Themen (Weg „en"). */
const WORTWURZELN_THEMA_CS: Readonly<Record<string, string>> = {
  numbers: "Čísla a velikost",
  nature: "Přírodní vědy a příroda",
  people: "Lidé a společnost",
  words: "Slova z jiných jazyků",
};

/** ★ O-PL (02.10.2026): die polnischen Namen der vier Word-roots-Themen (Weg „en"). */
const WORTWURZELN_THEMA_PL: Readonly<Record<string, string>> = {
  numbers: "Liczby i wielkość",
  nature: "Nauki przyrodnicze i przyroda",
  people: "Ludzie i społeczeństwo",
  words: "Słowa z innych języków",
};

const WORTWURZELN_UEBUNG: readonly VorlageDef[] = WORD_ROOT_THEMEN.map((t) => ({
  id: `wurzeln-${t.id}`,
  titel: `Wortstämme: ${WORTWURZELN_THEMA_DE[t.id] ?? t.titel}`,
  titelEn: `Word roots: ${t.titel}`,
  titelFr: `Racines anglaises : ${WORTWURZELN_THEMA_FR[t.id] ?? t.titel}`,
  titelEs: `Raíces inglesas: ${WORTWURZELN_THEMA_ES[t.id] ?? t.titel}`,
  titelIt: `Radici inglesi: ${WORTWURZELN_THEMA_IT[t.id] ?? t.titel}`,
  titelPl: `Angielskie rdzenie słów: ${WORTWURZELN_THEMA_PL[t.id] ?? t.titel}`,
  titelTr: `İngilizce kelime kökleri: ${WORTWURZELN_THEMA_TR[t.id] ?? t.titel}`,
  titelCs: `Anglické slovní kořeny: ${WORTWURZELN_THEMA_CS[t.id] ?? t.titel}`,
  titelBg: `Корени на английски думи: ${WORTWURZELN_THEMA_BG[t.id] ?? t.titel}`,
  titelEl: `Αγγλικές ρίζες λέξεων: ${WORTWURZELN_THEMA_EL[t.id] ?? t.titel}`,
  titelHu: `Angol szótövek: ${WORTWURZELN_THEMA_HU[t.id] ?? t.titel}`,
  titelNl: `Engelse woordwortels: ${WORTWURZELN_THEMA_NL[t.id] ?? t.titel}`,
  titelPt: `Raízes das palavras inglesas: ${WORTWURZELN_THEMA_PT[t.id] ?? t.titel}`,
  titelBr: `Radicais das palavras do inglês: ${WORTWURZELN_THEMA_BR[t.id] ?? t.titel}`,
  titelRo: `Rădăcini de cuvinte engleze: ${WORTWURZELN_THEMA_RO[t.id] ?? t.titel}`,
  titelSv: `Engelska ordrötter: ${WORTWURZELN_THEMA_SV[t.id] ?? t.titel}`,
  titelUk: `Англійські корені слів: ${WORTWURZELN_THEMA_UK[t.id] ?? t.titel}`,
  art: "wurzeln" as const,
  kinds: [] as const,
  fuer: ["uebung"] as const,
  langs: ["en"] as const,
}));

/** So viele Tippchallenge-Dateien bekommt „Word roots" - wie die deutsche Fremdwörterkunde. */
export const WORTWURZELN_CHALLENGE_DATEIEN = 3;

/** „Word roots" für die Tippchallenge: dieselben Wörter, alphabetisch, anders verteilt. */
const WORTWURZELN_CHALLENGE: readonly VorlageDef[] = Array.from(
  { length: WORTWURZELN_CHALLENGE_DATEIEN },
  (_, i) => ({
    id: `wurzelnc-${i + 1}`,
    titel: `Wortstämme, alphabetisch: Datei ${i + 1} von ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelEn: `Word roots, alphabetical: file ${i + 1} of ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelFr: `Racines anglaises, par ordre alphabétique : fichier ${i + 1} sur ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelEs: `Raíces inglesas, por orden alfabético: archivo ${i + 1} de ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelIt: `Radici inglesi, in ordine alfabetico: file ${i + 1} di ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelPl: `Angielskie rdzenie słów, alfabetycznie: plik ${i + 1} z ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelTr: `İngilizce kelime kökleri, alfabetik sırayla: dosya ${i + 1}, toplam ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelCs: `Anglické slovní kořeny, abecedně: soubor ${i + 1}/${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelBg: `Корени на английски думи, по азбучен ред: файл ${i + 1}/${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelEl: `Αγγλικές ρίζες λέξεων, αλφαβητικά: αρχείο ${i + 1}/${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelHu: `Angol szótövek, ábécérendben, fájl: ${i + 1}/${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelNl: `Engelse woordwortels, alfabetisch: bestand ${i + 1} van ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelPt: `Raízes das palavras inglesas, por ordem alfabética: ficheiro ${i + 1} de ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelBr: `Radicais das palavras do inglês, em ordem alfabética: arquivo ${i + 1} de ${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelRo: `Rădăcini de cuvinte engleze, în ordine alfabetică: fișierul ${i + 1}/${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelSv: `Engelska ordrötter, alfabetiskt: fil ${i + 1}/${WORTWURZELN_CHALLENGE_DATEIEN}`,
    titelUk: `Англійські корені слів, за абеткою: файл ${i + 1}/${WORTWURZELN_CHALLENGE_DATEIEN}`,
    art: "wurzeln" as const,
    kinds: [] as const,
    fuer: ["challenge"] as const,
    langs: ["en"] as const,
  }),
);

/**
 * ★ E10a (25.09.2026): die deutschen und englischen Namen der vier
 * „Racines"-Themen - für eine Lehrkraft, deren BEDIENUNG deutsch oder
 * englisch bleibt (Lehrkraft-Oberfläche gibt es nur in diesen beiden
 * Sprachen, siehe Bauplan §9.3 „nur für Kinder/Selbstlernende"), auch wenn
 * sie eine Klasse auf Weg „fr" verwaltet. Die französischen Namen stehen
 * schon bei den Daten (`RACINES_THEMEN`).
 */
const RACINES_THEMA_DE: Readonly<Record<string, string>> = {
  "racines-1": "Wortwurzeln: Griechisch und Latein (1)",
  "racines-2": "Wortwurzeln: Griechisch und Latein (2)",
  ailleurs: "Wörter aus anderen Sprachen",
  "chez-nous": "Regionale Wörter der Frankophonie",
};
/** ★ ES-O (27.09.2026): dieselben Namen spanisch (Weg „fr"). */
const RACINES_THEMA_ES: Readonly<Record<string, string>> = {
  "racines-1": "Raíces de las palabras: griego y latín (1)",
  "racines-2": "Raíces de las palabras: griego y latín (2)",
  ailleurs: "Palabras de otras lenguas",
  "chez-nous": "Palabras regionales de la francofonía",
};
const RACINES_THEMA_IT: Readonly<Record<string, string>> = {
  "racines-1": "Radici delle parole: greco e latino (1)",
  "racines-2": "Radici delle parole: greco e latino (2)",
  ailleurs: "Parole da altre lingue",
  "chez-nous": "Parole regionali della francofonia",
};
/** ★ O-TR (02.10.2026): dieselben Namen türkisch (Weg "fr"). */
const RACINES_THEMA_TR: Readonly<Record<string, string>> = {
  "racines-1": "Kelime kökleri: Yunanca ve Latince (1)",
  "racines-2": "Kelime kökleri: Yunanca ve Latince (2)",
  ailleurs: "Başka dillerden kelimeler",
  "chez-nous": "Fransızca konuşulan bölgelerden yöresel kelimeler",
};
/** ★ O-CS (03.10.2026): dieselben Namen tschechisch (Weg „fr"). */
const RACINES_THEMA_CS: Readonly<Record<string, string>> = {
  "racines-1": "Slovní kořeny: řečtina a latina (1)",
  "racines-2": "Slovní kořeny: řečtina a latina (2)",
  ailleurs: "Slova z jiných jazyků",
  "chez-nous": "Regionální slova frankofonních zemí",
};
/** ★ O-PL (02.10.2026): dieselben Namen polnisch (Weg „fr"). */
const RACINES_THEMA_PL: Readonly<Record<string, string>> = {
  "racines-1": "Rdzenie słów: greka i łacina (1)",
  "racines-2": "Rdzenie słów: greka i łacina (2)",
  ailleurs: "Słowa z innych języków",
  "chez-nous": "Regionalne słowa krajów francuskojęzycznych",
};
const RACINES_THEMA_EN: Readonly<Record<string, string>> = {
  "racines-1": "Word origins: Greek and Latin (1)",
  "racines-2": "Word origins: Greek and Latin (2)",
  ailleurs: "Words from other languages",
  "chez-nous": "Regional words of the Francophonie",
};

/** „D'où viennent les mots ?" für „Eigene Übung": eine Datei je Thema - das französische Gegenstück zu Fremdwörterkunde/Word roots. */
const RACINES_UEBUNG: readonly VorlageDef[] = RACINES_THEMEN.map((t) => ({
  id: `mots-${t.id}`,
  titel: RACINES_THEMA_DE[t.id] ?? t.titel,
  titelEn: RACINES_THEMA_EN[t.id] ?? t.titel,
  // ★ E11a-5: die französischen Namen stehen schon bei den Daten.
  titelFr: t.titel,
  titelEs: RACINES_THEMA_ES[t.id] ?? t.titel,
  titelIt: RACINES_THEMA_IT[t.id] ?? t.titel,
  titelPl: RACINES_THEMA_PL[t.id] ?? t.titel,
  titelTr: RACINES_THEMA_TR[t.id] ?? t.titel,
  titelCs: RACINES_THEMA_CS[t.id] ?? t.titel,
  titelBg: RACINES_THEMA_BG[t.id] ?? t.titel,
  titelEl: RACINES_THEMA_EL[t.id] ?? t.titel,
  titelHu: RACINES_THEMA_HU[t.id] ?? t.titel,
  titelNl: RACINES_THEMA_NL[t.id] ?? t.titel,
  titelPt: RACINES_THEMA_PT[t.id] ?? t.titel,
  titelBr: RACINES_THEMA_BR[t.id] ?? t.titel,
  titelRo: RACINES_THEMA_RO[t.id] ?? t.titel,
  titelSv: RACINES_THEMA_SV[t.id] ?? t.titel,
  titelUk: RACINES_THEMA_UK[t.id] ?? t.titel,
  art: "racines" as const,
  kinds: [] as const,
  fuer: ["uebung"] as const,
  langs: ["fr"] as const,
}));

/** So viele Tippchallenge-Dateien bekommt „D'où viennent les mots ?" - wie Fremdwörterkunde/Word roots. */
export const RACINES_CHALLENGE_DATEIEN = 3;

/** „D'où viennent les mots ?" für die Tippchallenge: dieselben Wörter, alphabetisch, anders verteilt. */
const RACINES_CHALLENGE: readonly VorlageDef[] = Array.from(
  { length: RACINES_CHALLENGE_DATEIEN },
  (_, i) => ({
    id: `motsc-${i + 1}`,
    titel: `Wortwurzeln, alphabetisch: Datei ${i + 1} von ${RACINES_CHALLENGE_DATEIEN}`,
    titelEn: `Word origins, alphabetical: file ${i + 1} of ${RACINES_CHALLENGE_DATEIEN}`,
    titelFr: `D'où viennent les mots, par ordre alphabétique : fichier ${i + 1} sur ${RACINES_CHALLENGE_DATEIEN}`,
    titelEs: `De dónde vienen las palabras, por orden alfabético: archivo ${i + 1} de ${RACINES_CHALLENGE_DATEIEN}`,
    titelIt: `Da dove vengono le parole francesi, in ordine alfabetico: file ${i + 1} di ${RACINES_CHALLENGE_DATEIEN}`,
    titelPl: `Skąd pochodzą słowa francuskie, alfabetycznie: plik ${i + 1} z ${RACINES_CHALLENGE_DATEIEN}`,
    titelTr: `Fransızca kelimelerin kökeni, alfabetik sırayla: dosya ${i + 1}, toplam ${RACINES_CHALLENGE_DATEIEN}`,
    titelCs: `Původ francouzských slov, abecedně: soubor ${i + 1}/${RACINES_CHALLENGE_DATEIEN}`,
    titelBg: `Произход на френските думи, по азбучен ред: файл ${i + 1}/${RACINES_CHALLENGE_DATEIEN}`,
    titelEl: `Προέλευση γαλλικών λέξεων, αλφαβητικά: αρχείο ${i + 1}/${RACINES_CHALLENGE_DATEIEN}`,
    titelHu: `A francia szavak eredete, ábécérendben, fájl: ${i + 1}/${RACINES_CHALLENGE_DATEIEN}`,
    titelNl: `Herkomst van Franse woorden, alfabetisch: bestand ${i + 1} van ${RACINES_CHALLENGE_DATEIEN}`,
    titelPt: `Origem das palavras francesas, por ordem alfabética: ficheiro ${i + 1} de ${RACINES_CHALLENGE_DATEIEN}`,
    titelBr: `Origem das palavras do francês, em ordem alfabética: arquivo ${i + 1} de ${RACINES_CHALLENGE_DATEIEN}`,
    titelRo: `Originea cuvintelor franceze, în ordine alfabetică: fișierul ${i + 1}/${RACINES_CHALLENGE_DATEIEN}`,
    titelSv: `Franska ords ursprung, alfabetiskt: fil ${i + 1}/${RACINES_CHALLENGE_DATEIEN}`,
    titelUk: `Походження французьких слів, за абеткою: файл ${i + 1}/${RACINES_CHALLENGE_DATEIEN}`,
    art: "racines" as const,
    kinds: [] as const,
    fuer: ["challenge"] as const,
    langs: ["fr"] as const,
  }),
);

/**
 * ★ ES-S (27.09.2026): die Namen der vier „Raíces y préstamos"-Themen in den
 * anderen Bedienungssprachen - die spanischen stehen bei den Daten
 * (`RAICES_THEMEN`), wie bei „racines".
 */
const RAICES_THEMA_DE: Readonly<Record<string, string>> = {
  "griego-latin": "Wortwurzeln: Griechisch und Latein",
  arabe: "Spanische Wörter aus dem Arabischen",
  america: "Wörter aus den Sprachen Amerikas",
  prestamos: "Lehnwörter aus anderen Sprachen",
};
const RAICES_THEMA_EN: Readonly<Record<string, string>> = {
  "griego-latin": "Word origins: Greek and Latin",
  arabe: "Spanish words from Arabic",
  america: "Words from the languages of the Americas",
  prestamos: "Loanwords from other languages",
};
const RAICES_THEMA_FR: Readonly<Record<string, string>> = {
  "griego-latin": "Racines grecques et latines",
  arabe: "Mots espagnols venus de l'arabe",
  america: "Mots des langues des Amériques",
  prestamos: "Emprunts à d'autres langues",
};

/** „Raíces y préstamos" für „Eigene Übung": eine Datei je Thema - nur Weg „es". */
const RAICES_THEMA_IT: Readonly<Record<string, string>> = {
  "griego-latin": "Radici delle parole: greco e latino",
  arabe: "Parole spagnole di origine araba",
  america: "Parole dalle lingue delle Americhe",
  prestamos: "Prestiti da altre lingue",
};

/** ★ O-TR (02.10.2026): die türkischen Namen der vier "Raíces"-Themen (Weg "es"). */
const RAICES_THEMA_TR: Readonly<Record<string, string>> = {
  "griego-latin": "Kelime kökleri: Yunanca ve Latince",
  arabe: "Arapçadan gelen İspanyolca kelimeler",
  america: "Amerika kıtasının dillerinden kelimeler",
  prestamos: "Başka dillerden alıntı kelimeler",
};

/** ★ O-CS (03.10.2026): die tschechischen Namen der vier „Raíces"-Themen (Weg „es"). */
const RAICES_THEMA_CS: Readonly<Record<string, string>> = {
  "griego-latin": "Slovní kořeny: řečtina a latina",
  arabe: "Španělská slova z arabštiny",
  america: "Slova z jazyků Ameriky",
  prestamos: "Přejatá slova z jiných jazyků",
};

/** ★ O-PL (02.10.2026): die polnischen Namen der vier „Raíces"-Themen (Weg „es"). */
const RAICES_THEMA_PL: Readonly<Record<string, string>> = {
  "griego-latin": "Rdzenie słów: greka i łacina",
  arabe: "Hiszpańskie słowa pochodzenia arabskiego",
  america: "Słowa z języków obu Ameryk",
  prestamos: "Zapożyczenia z innych języków",
};

const RAICES_UEBUNG: readonly VorlageDef[] = RAICES_THEMEN.map((t) => ({
  id: `palabras-${t.id}`,
  titel: RAICES_THEMA_DE[t.id] ?? t.titel,
  titelEn: RAICES_THEMA_EN[t.id] ?? t.titel,
  titelFr: RAICES_THEMA_FR[t.id] ?? t.titel,
  titelEs: t.titel,
  titelIt: RAICES_THEMA_IT[t.id] ?? t.titel,
  titelPl: RAICES_THEMA_PL[t.id] ?? t.titel,
  titelTr: RAICES_THEMA_TR[t.id] ?? t.titel,
  titelCs: RAICES_THEMA_CS[t.id] ?? t.titel,
  titelBg: RAICES_THEMA_BG[t.id] ?? t.titel,
  titelEl: RAICES_THEMA_EL[t.id] ?? t.titel,
  titelHu: RAICES_THEMA_HU[t.id] ?? t.titel,
  titelNl: RAICES_THEMA_NL[t.id] ?? t.titel,
  titelPt: RAICES_THEMA_PT[t.id] ?? t.titel,
  titelBr: RAICES_THEMA_BR[t.id] ?? t.titel,
  titelRo: RAICES_THEMA_RO[t.id] ?? t.titel,
  titelSv: RAICES_THEMA_SV[t.id] ?? t.titel,
  titelUk: RAICES_THEMA_UK[t.id] ?? t.titel,
  art: "raices" as const,
  kinds: [] as const,
  fuer: ["uebung"] as const,
  langs: ["es"] as const,
}));

/** So viele Reto-Dateien bekommt „Raíces y préstamos" - wie „racines". */
export const RAICES_CHALLENGE_DATEIEN = 3;

/** „Raíces y préstamos" für die Tippchallenge (Reto): dieselben Wörter, alphabetisch. */
const RAICES_CHALLENGE: readonly VorlageDef[] = Array.from(
  { length: RAICES_CHALLENGE_DATEIEN },
  (_, i) => ({
    id: `palabrasc-${i + 1}`,
    titel: `Spanische Wortherkunft, alphabetisch: Datei ${i + 1} von ${RAICES_CHALLENGE_DATEIEN}`,
    titelEn: `Spanish word origins, alphabetical: file ${i + 1} of ${RAICES_CHALLENGE_DATEIEN}`,
    titelFr: `Origine des mots espagnols, par ordre alphabétique : fichier ${i + 1} sur ${RAICES_CHALLENGE_DATEIEN}`,
    titelEs: `Raíces y préstamos, por orden alfabético: archivo ${i + 1} de ${RAICES_CHALLENGE_DATEIEN}`,
    titelIt: `Origine delle parole spagnole, in ordine alfabetico: file ${i + 1} di ${RAICES_CHALLENGE_DATEIEN}`,
    titelPl: `Pochodzenie słów hiszpańskich, alfabetycznie: plik ${i + 1} z ${RAICES_CHALLENGE_DATEIEN}`,
    titelTr: `İspanyolca kelimelerin kökeni, alfabetik sırayla: dosya ${i + 1}, toplam ${RAICES_CHALLENGE_DATEIEN}`,
    titelCs: `Původ španělských slov, abecedně: soubor ${i + 1}/${RAICES_CHALLENGE_DATEIEN}`,
    titelBg: `Произход на испанските думи, по азбучен ред: файл ${i + 1}/${RAICES_CHALLENGE_DATEIEN}`,
    titelEl: `Προέλευση ισπανικών λέξεων, αλφαβητικά: αρχείο ${i + 1}/${RAICES_CHALLENGE_DATEIEN}`,
    titelHu: `A spanyol szavak eredete, ábécérendben, fájl: ${i + 1}/${RAICES_CHALLENGE_DATEIEN}`,
    titelNl: `Herkomst van Spaanse woorden, alfabetisch: bestand ${i + 1} van ${RAICES_CHALLENGE_DATEIEN}`,
    titelPt: `Origem das palavras espanholas, por ordem alfabética: ficheiro ${i + 1} de ${RAICES_CHALLENGE_DATEIEN}`,
    titelBr: `Origem das palavras do espanhol, em ordem alfabética: arquivo ${i + 1} de ${RAICES_CHALLENGE_DATEIEN}`,
    titelRo: `Originea cuvintelor spaniole, în ordine alfabetică: fișierul ${i + 1}/${RAICES_CHALLENGE_DATEIEN}`,
    titelSv: `Spanska ords ursprung, alfabetiskt: fil ${i + 1}/${RAICES_CHALLENGE_DATEIEN}`,
    titelUk: `Походження іспанських слів, за абеткою: файл ${i + 1}/${RAICES_CHALLENGE_DATEIEN}`,
    art: "raices" as const,
    kinds: [] as const,
    fuer: ["challenge"] as const,
    langs: ["es"] as const,
  }),
);

/**
 * ★ IT-S (03.10.2026): die Namen der fünf „Radici e prestiti"-Themen in den anderen Bedienungssprachen - die
 * italienischen stehen bei den Daten (`RADICI_TEMI`), wie bei „raices".
 */
const RADICI_TEMA_DE: Readonly<Record<string, string>> = {
  "greco-latino": "Wortwurzeln: Griechisch und Latein",
  arabo: "Italienische Wörter aus dem Arabischen",
  germanico: "Italienische Wörter aus germanischen Sprachen",
  lontano: "Italienische Wörter aus fernen Sprachen",
  italia: "In Italien entstandene Wörter",
};
const RADICI_TEMA_EN: Readonly<Record<string, string>> = {
  "greco-latino": "Word origins: Greek and Latin",
  arabo: "Italian words from Arabic",
  germanico: "Italian words from Germanic languages",
  lontano: "Italian words from faraway languages",
  italia: "Words born in Italy",
};
const RADICI_TEMA_FR: Readonly<Record<string, string>> = {
  "greco-latino": "Racines grecques et latines",
  arabo: "Mots italiens venus de l'arabe",
  germanico: "Mots italiens venus des langues germaniques",
  lontano: "Mots italiens venus de loin",
  italia: "Mots nés en Italie",
};
const RADICI_TEMA_ES: Readonly<Record<string, string>> = {
  "greco-latino": "Raíces griegas y latinas",
  arabo: "Palabras italianas que vienen del árabe",
  germanico: "Palabras italianas de las lenguas germánicas",
  lontano: "Palabras italianas llegadas de lejos",
  italia: "Palabras nacidas en Italia",
};
const RADICI_TEMA_PL: Readonly<Record<string, string>> = {
  "greco-latino": "Rdzenie słów: greka i łacina",
  arabo: "Włoskie słowa pochodzenia arabskiego",
  germanico: "Włoskie słowa z języków germańskich",
  lontano: "Włoskie słowa z dalekich języków",
  italia: "Słowa zrodzone we Włoszech",
};
const RADICI_TEMA_TR: Readonly<Record<string, string>> = {
  "greco-latino": "Kelime kökleri: Yunanca ve Latince",
  arabo: "Arapçadan gelen İtalyanca kelimeler",
  germanico: "Cermen dillerinden gelen İtalyanca kelimeler",
  lontano: "Uzak dillerden gelen İtalyanca kelimeler",
  italia: "İtalya'da doğan kelimeler",
};
const RADICI_TEMA_CS: Readonly<Record<string, string>> = {
  "greco-latino": "Slovní kořeny: řečtina a latina",
  arabo: "Italská slova z arabštiny",
  germanico: "Italská slova z germánských jazyků",
  lontano: "Italská slova ze vzdálených jazyků",
  italia: "Slova vzniklá v Itálii",
};

/** „Radici e prestiti" für „Eigene Übung": eine Datei je Thema - nur Weg „it". */
const RADICI_UEBUNG: readonly VorlageDef[] = RADICI_TEMI.map((t) => ({
  id: `parole-${t.id}`,
  titel: RADICI_TEMA_DE[t.id] ?? t.titel,
  titelEn: RADICI_TEMA_EN[t.id] ?? t.titel,
  titelFr: RADICI_TEMA_FR[t.id] ?? t.titel,
  titelEs: RADICI_TEMA_ES[t.id] ?? t.titel,
  titelIt: t.titel,
  titelPl: RADICI_TEMA_PL[t.id] ?? t.titel,
  titelTr: RADICI_TEMA_TR[t.id] ?? t.titel,
  titelCs: RADICI_TEMA_CS[t.id] ?? t.titel,
  titelBg: RADICI_TEMA_BG[t.id] ?? t.titel,
  titelEl: RADICI_TEMA_EL[t.id] ?? t.titel,
  titelHu: RADICI_TEMA_HU[t.id] ?? t.titel,
  titelNl: RADICI_TEMA_NL[t.id] ?? t.titel,
  titelPt: RADICI_TEMA_PT[t.id] ?? t.titel,
  titelBr: RADICI_TEMA_BR[t.id] ?? t.titel,
  titelRo: RADICI_TEMA_RO[t.id] ?? t.titel,
  titelSv: RADICI_TEMA_SV[t.id] ?? t.titel,
  titelUk: RADICI_TEMA_UK[t.id] ?? t.titel,
  art: "radici" as const,
  kinds: [] as const,
  fuer: ["uebung"] as const,
  langs: ["it"] as const,
}));

/** So viele Sfida-Dateien bekommt „Radici e prestiti" - wie „raices". */
export const RADICI_CHALLENGE_DATEIEN = 3;

/** „Radici e prestiti" für die Tippchallenge (Sfida): dieselben Wörter, alphabetisch. */
const RADICI_CHALLENGE: readonly VorlageDef[] = Array.from(
  { length: RADICI_CHALLENGE_DATEIEN },
  (_, i) => ({
    id: `parolec-${i + 1}`,
    titel: `Italienische Wortherkunft, alphabetisch: Datei ${i + 1} von ${RADICI_CHALLENGE_DATEIEN}`,
    titelEn: `Italian word origins, alphabetical: file ${i + 1} of ${RADICI_CHALLENGE_DATEIEN}`,
    titelFr: `Origine des mots italiens, par ordre alphabétique : fichier ${i + 1} sur ${RADICI_CHALLENGE_DATEIEN}`,
    titelEs: `Origen de las palabras italianas, por orden alfabético: archivo ${i + 1} de ${RADICI_CHALLENGE_DATEIEN}`,
    titelIt: `Radici e prestiti, in ordine alfabetico: file ${i + 1} di ${RADICI_CHALLENGE_DATEIEN}`,
    titelPl: `Pochodzenie słów włoskich, alfabetycznie: plik ${i + 1} z ${RADICI_CHALLENGE_DATEIEN}`,
    titelTr: `İtalyanca kelimelerin kökeni, alfabetik sırayla: dosya ${i + 1}, toplam ${RADICI_CHALLENGE_DATEIEN}`,
    titelCs: `Původ italských slov, abecedně: soubor ${i + 1}/${RADICI_CHALLENGE_DATEIEN}`,
    titelBg: `Произход на италианските думи, по азбучен ред: файл ${i + 1}/${RADICI_CHALLENGE_DATEIEN}`,
    titelEl: `Προέλευση ιταλικών λέξεων, αλφαβητικά: αρχείο ${i + 1}/${RADICI_CHALLENGE_DATEIEN}`,
    titelHu: `Az olasz szavak eredete, ábécérendben, fájl: ${i + 1}/${RADICI_CHALLENGE_DATEIEN}`,
    titelNl: `Herkomst van Italiaanse woorden, alfabetisch: bestand ${i + 1} van ${RADICI_CHALLENGE_DATEIEN}`,
    titelPt: `Origem das palavras italianas, por ordem alfabética: ficheiro ${i + 1} de ${RADICI_CHALLENGE_DATEIEN}`,
    titelBr: `Origem das palavras do italiano, em ordem alfabética: arquivo ${i + 1} de ${RADICI_CHALLENGE_DATEIEN}`,
    titelRo: `Originea cuvintelor italiene, în ordine alfabetică: fișierul ${i + 1}/${RADICI_CHALLENGE_DATEIEN}`,
    titelSv: `Italienska ords ursprung, alfabetiskt: fil ${i + 1}/${RADICI_CHALLENGE_DATEIEN}`,
    titelUk: `Походження італійських слів, за абеткою: файл ${i + 1}/${RADICI_CHALLENGE_DATEIEN}`,
    art: "radici" as const,
    kinds: [] as const,
    fuer: ["challenge"] as const,
    langs: ["it"] as const,
  }),
);

/**
 * ★ TR-S (09.10.2026): die Namen der fünf „Kökler ve alıntılar"-Themen in den anderen Bedienungssprachen - die
 * türkischen stehen bei den Daten (`KOKLER_TEMALAR`), wie bei „radici".
 */
const KOKLER_TEMA_DE: Readonly<Record<string, string>> = {
  "yunanca-latince": "Wortwurzeln: Griechisch und Latein",
  arapca: "Türkische Wörter aus dem Arabischen",
  farsca: "Türkische Wörter aus dem Persischen",
  bati: "Türkische Wörter aus westlichen Sprachen",
  aile: "Wortfamilien: ein Stamm und seine Endungen",
};
const KOKLER_TEMA_EN: Readonly<Record<string, string>> = {
  "yunanca-latince": "Word origins: Greek and Latin",
  arapca: "Turkish words from Arabic",
  farsca: "Turkish words from Persian",
  bati: "Turkish words from Western languages",
  aile: "Word families: one stem and its endings",
};
const KOKLER_TEMA_FR: Readonly<Record<string, string>> = {
  "yunanca-latince": "Racines grecques et latines",
  arapca: "Mots turcs venus de l'arabe",
  farsca: "Mots turcs venus du persan",
  bati: "Mots turcs venus des langues occidentales",
  aile: "Familles de mots : un radical et ses suffixes",
};
const KOKLER_TEMA_ES: Readonly<Record<string, string>> = {
  "yunanca-latince": "Raíces griegas y latinas",
  arapca: "Palabras turcas que vienen del árabe",
  farsca: "Palabras turcas que vienen del persa",
  bati: "Palabras turcas de lenguas occidentales",
  aile: "Familias de palabras: una raíz y sus sufijos",
};
const KOKLER_TEMA_IT: Readonly<Record<string, string>> = {
  "yunanca-latince": "Radici greche e latine",
  arapca: "Parole turche che vengono dall'arabo",
  farsca: "Parole turche che vengono dal persiano",
  bati: "Parole turche delle lingue occidentali",
  aile: "Famiglie di parole: una radice e i suoi suffissi",
};
const KOKLER_TEMA_PL: Readonly<Record<string, string>> = {
  "yunanca-latince": "Rdzenie słów: greka i łacina",
  arapca: "Tureckie słowa pochodzenia arabskiego",
  farsca: "Tureckie słowa pochodzenia perskiego",
  bati: "Tureckie słowa z języków zachodnich",
  aile: "Rodziny wyrazów: jeden rdzeń i jego końcówki",
};
const KOKLER_TEMA_CS: Readonly<Record<string, string>> = {
  "yunanca-latince": "Slovní kořeny: řečtina a latina",
  arapca: "Turecká slova z arabštiny",
  farsca: "Turecká slova z perštiny",
  bati: "Turecká slova ze západních jazyků",
  aile: "Slovní rodiny: jeden kořen a jeho přípony",
};

/** „Kökler ve alıntılar" für „Eigene Übung": eine Datei je Thema - nur Weg „tr". */
const KOKLER_UEBUNG: readonly VorlageDef[] = KOKLER_TEMALAR.map((t) => ({
  id: `kokler-${t.id}`,
  titel: KOKLER_TEMA_DE[t.id] ?? t.titel,
  titelEn: KOKLER_TEMA_EN[t.id] ?? t.titel,
  titelFr: KOKLER_TEMA_FR[t.id] ?? t.titel,
  titelEs: KOKLER_TEMA_ES[t.id] ?? t.titel,
  titelIt: KOKLER_TEMA_IT[t.id] ?? t.titel,
  titelPl: KOKLER_TEMA_PL[t.id] ?? t.titel,
  titelTr: t.titel,
  titelCs: KOKLER_TEMA_CS[t.id] ?? t.titel,
  titelBg: KOKLER_TEMA_BG[t.id] ?? t.titel,
  titelEl: KOKLER_TEMA_EL[t.id] ?? t.titel,
  titelHu: KOKLER_TEMA_HU[t.id] ?? t.titel,
  titelNl: KOKLER_TEMA_NL[t.id] ?? t.titel,
  titelPt: KOKLER_TEMA_PT[t.id] ?? t.titel,
  titelBr: KOKLER_TEMA_BR[t.id] ?? t.titel,
  titelRo: KOKLER_TEMA_RO[t.id] ?? t.titel,
  titelSv: KOKLER_TEMA_SV[t.id] ?? t.titel,
  titelUk: KOKLER_TEMA_UK[t.id] ?? t.titel,
  art: "kokler" as const,
  kinds: [] as const,
  fuer: ["uebung"] as const,
  langs: ["tr"] as const,
}));

/** So viele Challenge-Dateien bekommt „Kökler ve alıntılar" - wie „radici". */
export const KOKLER_CHALLENGE_DATEIEN = 3;

/** „Kökler ve alıntılar" für die Tippchallenge: dieselben Wörter, alphabetisch. */
const KOKLER_CHALLENGE: readonly VorlageDef[] = Array.from(
  { length: KOKLER_CHALLENGE_DATEIEN },
  (_, i) => ({
    id: `kokc-${i + 1}`,
    titel: `Türkische Wortherkunft, alphabetisch: Datei ${i + 1} von ${KOKLER_CHALLENGE_DATEIEN}`,
    titelEn: `Turkish word origins, alphabetical: file ${i + 1} of ${KOKLER_CHALLENGE_DATEIEN}`,
    titelFr: `Origine des mots turcs, par ordre alphabétique : fichier ${i + 1} sur ${KOKLER_CHALLENGE_DATEIEN}`,
    titelEs: `Origen de las palabras turcas, por orden alfabético: archivo ${i + 1} de ${KOKLER_CHALLENGE_DATEIEN}`,
    titelIt: `Origine delle parole turche, in ordine alfabetico: file ${i + 1} di ${KOKLER_CHALLENGE_DATEIEN}`,
    titelPl: `Pochodzenie słów tureckich, alfabetycznie: plik ${i + 1} z ${KOKLER_CHALLENGE_DATEIEN}`,
    titelTr: `Kökler ve alıntılar, alfabetik sırayla: dosya ${i + 1}, toplam ${KOKLER_CHALLENGE_DATEIEN}`,
    titelCs: `Původ tureckých slov, abecedně: soubor ${i + 1}/${KOKLER_CHALLENGE_DATEIEN}`,
    titelBg: `Произход на турските думи, по азбучен ред: файл ${i + 1}/${KOKLER_CHALLENGE_DATEIEN}`,
    titelEl: `Προέλευση τουρκικών λέξεων, αλφαβητικά: αρχείο ${i + 1}/${KOKLER_CHALLENGE_DATEIEN}`,
    titelHu: `A török szavak eredete, ábécérendben, fájl: ${i + 1}/${KOKLER_CHALLENGE_DATEIEN}`,
    titelNl: `Herkomst van Turkse woorden, alfabetisch: bestand ${i + 1} van ${KOKLER_CHALLENGE_DATEIEN}`,
    titelPt: `Origem das palavras turcas, por ordem alfabética: ficheiro ${i + 1} de ${KOKLER_CHALLENGE_DATEIEN}`,
    titelBr: `Origem das palavras do turco, em ordem alfabética: arquivo ${i + 1} de ${KOKLER_CHALLENGE_DATEIEN}`,
    titelRo: `Originea cuvintelor turcești, în ordine alfabetică: fișierul ${i + 1}/${KOKLER_CHALLENGE_DATEIEN}`,
    titelSv: `Turkiska ords ursprung, alfabetiskt: fil ${i + 1}/${KOKLER_CHALLENGE_DATEIEN}`,
    titelUk: `Походження турецьких слів, за абеткою: файл ${i + 1}/${KOKLER_CHALLENGE_DATEIEN}`,
    art: "kokler" as const,
    kinds: [] as const,
    fuer: ["challenge"] as const,
    langs: ["tr"] as const,
  }),
);

/**
 * ★ PL-W (09.10.2026): die Namen der fünf „Korzenie i zapożyczenia"-Themen in den anderen Bedienungssprachen - die
 * polnischen stehen bei den Daten (`KORZENIE_TEMATY`), wie bei „radici".
 */
const KORZENIE_TEMAT_DE: Readonly<Record<string, string>> = {
  "greka-lacina": "Wortwurzeln: Griechisch und Latein",
  niemiecki: "Polnische Wörter aus dem Deutschen",
  francuski: "Polnische Wörter aus dem Französischen",
  dalekie: "Polnische Wörter aus dem Englischen und aus fernen Sprachen",
  slowotworstwo: "Wie polnische Wörter entstehen",
};
const KORZENIE_TEMAT_EN: Readonly<Record<string, string>> = {
  "greka-lacina": "Word origins: Greek and Latin",
  niemiecki: "Polish words from German",
  francuski: "Polish words from French",
  dalekie: "Polish words from English and faraway languages",
  slowotworstwo: "How Polish words are built",
};
const KORZENIE_TEMAT_FR: Readonly<Record<string, string>> = {
  "greka-lacina": "Racines grecques et latines",
  niemiecki: "Mots polonais venus de l'allemand",
  francuski: "Mots polonais venus du français",
  dalekie: "Mots polonais venus de l'anglais et de langues lointaines",
  slowotworstwo: "Comment se forment les mots polonais",
};
const KORZENIE_TEMAT_ES: Readonly<Record<string, string>> = {
  "greka-lacina": "Raíces griegas y latinas",
  niemiecki: "Palabras polacas que vienen del alemán",
  francuski: "Palabras polacas que vienen del francés",
  dalekie: "Palabras polacas del inglés y de lenguas lejanas",
  slowotworstwo: "Cómo se forman las palabras polacas",
};
const KORZENIE_TEMAT_IT: Readonly<Record<string, string>> = {
  "greka-lacina": "Radici greche e latine",
  niemiecki: "Parole polacche venute dal tedesco",
  francuski: "Parole polacche venute dal francese",
  dalekie: "Parole polacche dall'inglese e da lingue lontane",
  slowotworstwo: "Come nascono le parole polacche",
};
const KORZENIE_TEMAT_TR: Readonly<Record<string, string>> = {
  "greka-lacina": "Kelime kökleri: Yunanca ve Latince",
  niemiecki: "Almancadan gelen Lehçe kelimeler",
  francuski: "Fransızcadan gelen Lehçe kelimeler",
  dalekie: "İngilizceden ve uzak dillerden gelen Lehçe kelimeler",
  slowotworstwo: "Lehçe kelimeler nasıl oluşur",
};
const KORZENIE_TEMAT_CS: Readonly<Record<string, string>> = {
  "greka-lacina": "Slovní kořeny: řečtina a latina",
  niemiecki: "Polská slova z němčiny",
  francuski: "Polská slova z francouzštiny",
  dalekie: "Polská slova z angličtiny a ze vzdálených jazyků",
  slowotworstwo: "Jak vznikají polská slova",
};

/** „Korzenie i zapożyczenia" für „Eigene Übung": eine Datei je Thema - nur Weg „pl". */
const KORZENIE_UEBUNG: readonly VorlageDef[] = KORZENIE_TEMATY.map((t) => ({
  id: `slowa-${t.id}`,
  titel: KORZENIE_TEMAT_DE[t.id] ?? t.titel,
  titelEn: KORZENIE_TEMAT_EN[t.id] ?? t.titel,
  titelFr: KORZENIE_TEMAT_FR[t.id] ?? t.titel,
  titelEs: KORZENIE_TEMAT_ES[t.id] ?? t.titel,
  titelIt: KORZENIE_TEMAT_IT[t.id] ?? t.titel,
  titelPl: t.titel,
  titelTr: KORZENIE_TEMAT_TR[t.id] ?? t.titel,
  titelCs: KORZENIE_TEMAT_CS[t.id] ?? t.titel,
  titelBg: KORZENIE_TEMAT_BG[t.id] ?? t.titel,
  titelEl: KORZENIE_TEMAT_EL[t.id] ?? t.titel,
  titelHu: KORZENIE_TEMAT_HU[t.id] ?? t.titel,
  titelNl: KORZENIE_TEMAT_NL[t.id] ?? t.titel,
  titelPt: KORZENIE_TEMAT_PT[t.id] ?? t.titel,
  titelBr: KORZENIE_TEMAT_BR[t.id] ?? t.titel,
  titelRo: KORZENIE_TEMAT_RO[t.id] ?? t.titel,
  titelSv: KORZENIE_TEMAT_SV[t.id] ?? t.titel,
  titelUk: KORZENIE_TEMAT_UK[t.id] ?? t.titel,
  art: "korzenie" as const,
  kinds: [] as const,
  fuer: ["uebung"] as const,
  langs: ["pl"] as const,
}));

/** So viele Wyzwanie-Dateien bekommt „Korzenie i zapożyczenia" - wie „radici". */
export const KORZENIE_CHALLENGE_DATEIEN = 3;

/** „Korzenie i zapożyczenia" für die Tippchallenge (Wyzwanie): dieselben Wörter, alphabetisch. */
const KORZENIE_CHALLENGE: readonly VorlageDef[] = Array.from(
  { length: KORZENIE_CHALLENGE_DATEIEN },
  (_, i) => ({
    id: `slowac-${i + 1}`,
    titel: `Polnische Wortherkunft, alphabetisch: Datei ${i + 1} von ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelEn: `Polish word origins, alphabetical: file ${i + 1} of ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelFr: `Origine des mots polonais, par ordre alphabétique : fichier ${i + 1} sur ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelEs: `Origen de las palabras polacas, por orden alfabético: archivo ${i + 1} de ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelIt: `Origine delle parole polacche, in ordine alfabetico: file ${i + 1} di ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelPl: `Korzenie i zapożyczenia, alfabetycznie: plik ${i + 1} z ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelTr: `Lehçe kelimelerin kökeni, alfabetik sırayla: dosya ${i + 1}, toplam ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelCs: `Původ polských slov, abecedně: soubor ${i + 1}/${KORZENIE_CHALLENGE_DATEIEN}`,
    titelBg: `Произход на полските думи, по азбучен ред: файл ${i + 1}/${KORZENIE_CHALLENGE_DATEIEN}`,
    titelEl: `Προέλευση πολωνικών λέξεων, αλφαβητικά: αρχείο ${i + 1}/${KORZENIE_CHALLENGE_DATEIEN}`,
    titelHu: `A lengyel szavak eredete, ábécérendben, fájl: ${i + 1}/${KORZENIE_CHALLENGE_DATEIEN}`,
    titelNl: `Herkomst van Poolse woorden, alfabetisch: bestand ${i + 1} van ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelPt: `Origem das palavras polacas, por ordem alfabética: ficheiro ${i + 1} de ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelBr: `Origem das palavras do polonês, em ordem alfabética: arquivo ${i + 1} de ${KORZENIE_CHALLENGE_DATEIEN}`,
    titelRo: `Originea cuvintelor poloneze, în ordine alfabetică: fișierul ${i + 1}/${KORZENIE_CHALLENGE_DATEIEN}`,
    titelSv: `Polska ords ursprung, alfabetiskt: fil ${i + 1}/${KORZENIE_CHALLENGE_DATEIEN}`,
    titelUk: `Походження польських слів, за абеткою: файл ${i + 1}/${KORZENIE_CHALLENGE_DATEIEN}`,
    art: "korzenie" as const,
    kinds: [] as const,
    fuer: ["challenge"] as const,
    langs: ["pl"] as const,
  }),
);

/**
 * ★ CS-W (09.10.2026): die Namen der fünf „Původ slov"-Themen in den anderen Bedienungssprachen - die tschechischen stehen
 * bei den Daten (`KORENY_TEMATA`), wie bei „radici".
 */
const KORENY_TEMA_DE: Readonly<Record<string, string>> = {
  "recko-latina": "Wortwurzeln: Griechisch und Latein",
  nemcina: "Tschechische Wörter aus dem Deutschen",
  romanske: "Tschechische Wörter aus dem Französischen und Italienischen",
  svet: "Tschechische Wörter aus dem Englischen und aus fernen Ländern",
  rodiny: "Wortfamilien",
};
const KORENY_TEMA_EN: Readonly<Record<string, string>> = {
  "recko-latina": "Word origins: Greek and Latin",
  nemcina: "Czech words from German",
  romanske: "Czech words from French and Italian",
  svet: "Czech words from English and faraway lands",
  rodiny: "Word families",
};
const KORENY_TEMA_FR: Readonly<Record<string, string>> = {
  "recko-latina": "Racines grecques et latines",
  nemcina: "Mots tchèques venus de l'allemand",
  romanske: "Mots tchèques venus du français et de l'italien",
  svet: "Mots tchèques venus de l'anglais et de loin",
  rodiny: "Familles de mots",
};
const KORENY_TEMA_ES: Readonly<Record<string, string>> = {
  "recko-latina": "Raíces griegas y latinas",
  nemcina: "Palabras checas que vienen del alemán",
  romanske: "Palabras checas del francés y del italiano",
  svet: "Palabras checas del inglés y de tierras lejanas",
  rodiny: "Familias de palabras",
};
const KORENY_TEMA_IT: Readonly<Record<string, string>> = {
  "recko-latina": "Radici greche e latine",
  nemcina: "Parole ceche venute dal tedesco",
  romanske: "Parole ceche venute dal francese e dall'italiano",
  svet: "Parole ceche venute dall'inglese e da lontano",
  rodiny: "Famiglie di parole",
};
const KORENY_TEMA_PL: Readonly<Record<string, string>> = {
  "recko-latina": "Rdzenie słów: greka i łacina",
  nemcina: "Czeskie słowa z niemieckiego",
  romanske: "Czeskie słowa z francuskiego i włoskiego",
  svet: "Czeskie słowa z angielskiego i dalekich krajów",
  rodiny: "Rodziny wyrazów",
};
const KORENY_TEMA_TR: Readonly<Record<string, string>> = {
  "recko-latina": "Kelime kökleri: Yunanca ve Latince",
  nemcina: "Almancadan gelen Çekçe kelimeler",
  romanske: "Fransızca ve İtalyancadan gelen Çekçe kelimeler",
  svet: "İngilizceden ve uzak ülkelerden gelen Çekçe kelimeler",
  rodiny: "Kelime aileleri",
};

/** „Původ slov" für „Eigene Übung": eine Datei je Thema - nur Weg „cs". */
const KORENY_UEBUNG: readonly VorlageDef[] = KORENY_TEMATA.map((t) => ({
  id: `puvod-${t.id}`,
  titel: KORENY_TEMA_DE[t.id] ?? t.titel,
  titelEn: KORENY_TEMA_EN[t.id] ?? t.titel,
  titelFr: KORENY_TEMA_FR[t.id] ?? t.titel,
  titelEs: KORENY_TEMA_ES[t.id] ?? t.titel,
  titelIt: KORENY_TEMA_IT[t.id] ?? t.titel,
  titelPl: KORENY_TEMA_PL[t.id] ?? t.titel,
  titelTr: KORENY_TEMA_TR[t.id] ?? t.titel,
  titelCs: t.titel,
  titelBg: KORENY_TEMA_BG[t.id] ?? t.titel,
  titelEl: KORENY_TEMA_EL[t.id] ?? t.titel,
  titelHu: KORENY_TEMA_HU[t.id] ?? t.titel,
  titelNl: KORENY_TEMA_NL[t.id] ?? t.titel,
  titelPt: KORENY_TEMA_PT[t.id] ?? t.titel,
  titelBr: KORENY_TEMA_BR[t.id] ?? t.titel,
  titelRo: KORENY_TEMA_RO[t.id] ?? t.titel,
  titelSv: KORENY_TEMA_SV[t.id] ?? t.titel,
  titelUk: KORENY_TEMA_UK[t.id] ?? t.titel,
  art: "koreny" as const,
  kinds: [] as const,
  fuer: ["uebung"] as const,
  langs: ["cs"] as const,
}));

/** So viele Challenge-Dateien bekommt „Původ slov" - wie „radici". */
export const KORENY_CHALLENGE_DATEIEN = 3;

/** „Původ slov" für die Tippchallenge: dieselben Wörter, alphabetisch. */
const KORENY_CHALLENGE: readonly VorlageDef[] = Array.from(
  { length: KORENY_CHALLENGE_DATEIEN },
  (_, i) => ({
    id: `puvodc-${i + 1}`,
    titel: `Tschechische Wortherkunft, alphabetisch: Datei ${i + 1} von ${KORENY_CHALLENGE_DATEIEN}`,
    titelEn: `Czech word origins, alphabetical: file ${i + 1} of ${KORENY_CHALLENGE_DATEIEN}`,
    titelFr: `Origine des mots tchèques, par ordre alphabétique : fichier ${i + 1} sur ${KORENY_CHALLENGE_DATEIEN}`,
    titelEs: `Origen de las palabras checas, por orden alfabético: archivo ${i + 1} de ${KORENY_CHALLENGE_DATEIEN}`,
    titelIt: `Origine delle parole ceche, in ordine alfabetico: file ${i + 1} di ${KORENY_CHALLENGE_DATEIEN}`,
    titelPl: `Pochodzenie słów czeskich, alfabetycznie: plik ${i + 1} z ${KORENY_CHALLENGE_DATEIEN}`,
    titelTr: `Çekçe kelimelerin kökeni, alfabetik sırayla: dosya ${i + 1}, toplam ${KORENY_CHALLENGE_DATEIEN}`,
    titelCs: `Původ českých slov, abecedně: soubor ${i + 1}/${KORENY_CHALLENGE_DATEIEN}`,
    titelBg: `Произход на чешките думи, по азбучен ред: файл ${i + 1}/${KORENY_CHALLENGE_DATEIEN}`,
    titelEl: `Προέλευση τσεχικών λέξεων, αλφαβητικά: αρχείο ${i + 1}/${KORENY_CHALLENGE_DATEIEN}`,
    titelHu: `A cseh szavak eredete, ábécérendben, fájl: ${i + 1}/${KORENY_CHALLENGE_DATEIEN}`,
    titelNl: `Herkomst van Tsjechische woorden, alfabetisch: bestand ${i + 1} van ${KORENY_CHALLENGE_DATEIEN}`,
    titelPt: `Origem das palavras checas, por ordem alfabética: ficheiro ${i + 1} de ${KORENY_CHALLENGE_DATEIEN}`,
    titelBr: `Origem das palavras do tcheco, em ordem alfabética: arquivo ${i + 1} de ${KORENY_CHALLENGE_DATEIEN}`,
    titelRo: `Originea cuvintelor cehe, în ordine alfabetică: fișierul ${i + 1}/${KORENY_CHALLENGE_DATEIEN}`,
    titelSv: `Tjeckiska ords ursprung, alfabetiskt: fil ${i + 1}/${KORENY_CHALLENGE_DATEIEN}`,
    titelUk: `Походження чеських слів, за абеткою: файл ${i + 1}/${KORENY_CHALLENGE_DATEIEN}`,
    art: "koreny" as const,
    kinds: [] as const,
    fuer: ["challenge"] as const,
    langs: ["cs"] as const,
  }),
);

// ── ★ G3c-VERTEILER (25.10.2026): die Wurzel-Vorlagen der neun Gerüst-Wege ─────────────────────────────────────────────

type TitelSprache = "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs" | "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";

/** Was eine Gerüst-Sprache für ihre Wurzel-Vorlage liefert (aus `vorlagenDaten/wurzeln<Xx>.ts`). */
interface GeruestWurzelDaten {
  lang: GeruestSprache;
  themen: readonly { id: string; titel: string; titelJe?: Partial<Record<TitelSprache, string>> }[];
  stufen: Readonly<Record<KontoStufe, readonly { id: string; paare: readonly { indizio: string; parola: string }[] }[]>>;
  alphabetisch: Readonly<Record<KontoStufe, readonly string[]>>;
  challengeTitel: Partial<Record<TitelSprache, string>>;
  zeile: (p: { indizio: string; parola: string }) => string;
}

const GERUEST_WURZELN: readonly GeruestWurzelDaten[] = [
  { lang: "bg", themen: WURZEL_THEMEN_BG, stufen: WURZELN_BG, alphabetisch: WURZELN_BG_ALPHABETISCH, challengeTitel: WURZEL_CHALLENGE_TITEL_BG, zeile: wurzelZeileBg },
  { lang: "el", themen: WURZEL_THEMEN_EL, stufen: WURZELN_EL, alphabetisch: WURZELN_EL_ALPHABETISCH, challengeTitel: WURZEL_CHALLENGE_TITEL_EL, zeile: wurzelZeileEl },
  { lang: "hu", themen: WURZEL_THEMEN_HU, stufen: WURZELN_HU, alphabetisch: WURZELN_HU_ALPHABETISCH, challengeTitel: WURZEL_CHALLENGE_TITEL_HU, zeile: wurzelZeileHu },
  { lang: "nl", themen: WURZEL_THEMEN_NL, stufen: WURZELN_NL, alphabetisch: WURZELN_NL_ALPHABETISCH, challengeTitel: WURZEL_CHALLENGE_TITEL_NL, zeile: wurzelZeileNl },
  { lang: "pt", themen: WURZEL_THEMEN_PT, stufen: WURZELN_PT, alphabetisch: WURZELN_PT_ALPHABETISCH, challengeTitel: WURZEL_CHALLENGE_TITEL_PT, zeile: wurzelZeilePt },
  { lang: "br", themen: WURZEL_THEMEN_BR, stufen: WURZELN_BR, alphabetisch: WURZELN_BR_ALPHABETISCH, challengeTitel: WURZEL_CHALLENGE_TITEL_BR, zeile: wurzelZeileBr },
  { lang: "ro", themen: WURZEL_THEMEN_RO, stufen: WURZELN_RO, alphabetisch: WURZELN_RO_ALPHABETISCH, challengeTitel: WURZEL_CHALLENGE_TITEL_RO, zeile: wurzelZeileRo },
  { lang: "sv", themen: WURZEL_THEMEN_SV, stufen: WURZELN_SV, alphabetisch: WURZELN_SV_ALPHABETISCH, challengeTitel: WURZEL_CHALLENGE_TITEL_SV, zeile: wurzelZeileSv },
  { lang: "uk", themen: WURZEL_THEMEN_UK, stufen: WURZELN_UK, alphabetisch: WURZELN_UK_ALPHABETISCH, challengeTitel: WURZEL_CHALLENGE_TITEL_UK, zeile: wurzelZeileUk },
];

/** So viele Challenge-Dateien bekommt eine Gerüst-Wurzel-Vorlage - wie „radici". */
export const GERUEST_WURZEL_CHALLENGE_DATEIEN = 3;

/** Die acht Titel-Felder einer Vorlage aus einer Funktion je Bedienungssprache. */
function titelFelder(f: (s: TitelSprache) => string): Pick<VorlageDef, "titel" | "titelEn" | "titelFr" | "titelEs" | "titelIt" | "titelPl" | "titelTr" | "titelCs" | "titelBg" | "titelEl" | "titelHu" | "titelNl" | "titelPt" | "titelBr" | "titelRo" | "titelSv" | "titelUk"> {
  return { titel: f("de"), titelEn: f("en"), titelFr: f("fr"), titelEs: f("es"), titelIt: f("it"), titelPl: f("pl"), titelTr: f("tr"), titelCs: f("cs"), titelBg: f("bg"), titelEl: f("el"), titelHu: f("hu"), titelNl: f("nl"), titelPt: f("pt"), titelBr: f("br"), titelRo: f("ro"), titelSv: f("sv"), titelUk: f("uk") };
}

/** Eine Datei je Thema für „Eigene Übung" - nur für Weg und Übungssprache der Sprache. Heute keine (alle Themen-Listen leer). */
const GERUEST_WURZEL_UEBUNG: readonly VorlageDef[] = GERUEST_WURZELN.flatMap((w) =>
  w.themen.map((t) => ({
    id: `herkunft-${w.lang}-${t.id}`,
    ...titelFelder((s) => t.titelJe?.[s] ?? t.titelJe?.en ?? t.titel),
    art: "wortherkunft" as const,
    kinds: [] as const,
    fuer: ["uebung"] as const,
    langs: [w.lang],
  })),
);

/** Die Tippchallenge-Dateien: dieselben Wörter, alphabetisch. Nur, wenn die Sprache Paare hat. Heute keine. */
const GERUEST_WURZEL_CHALLENGE: readonly VorlageDef[] = GERUEST_WURZELN.filter((w) => Object.values(w.alphabetisch).some((l) => l.length > 0)).flatMap((w) =>
  Array.from({ length: GERUEST_WURZEL_CHALLENGE_DATEIEN }, (_, i) => ({
    id: `herkunftc-${w.lang}-${i + 1}`,
    ...titelFelder((s) =>
      (w.challengeTitel[s] ?? w.challengeTitel.en ?? "Word origins, alphabetical: file {i} of {n}")
        .replace("{i}", String(i + 1))
        .replace("{n}", String(GERUEST_WURZEL_CHALLENGE_DATEIEN)),
    ),
    art: "wortherkunft" as const,
    kinds: [] as const,
    fuer: ["challenge"] as const,
    langs: [w.lang],
  })),
);

/** Programmcode zum Abtippen - eine Vorlage je Sprache, nur für „Eigene Übung". */
const CODE_VORLAGE_DEFS: readonly VorlageDef[] = CODE_VORLAGEN.map((c) => ({
  id: c.id,
  titel: `Programmcode: ${c.sprache}`,
  titelEn: `Program code: ${c.sprache}`,
  titelFr: `Code informatique : ${c.sprache}`,
  titelEs: `Código informático: ${c.sprache}`,
  titelIt: `Codice informatico: ${c.sprache}`,
  titelPl: `Kod programu: ${c.sprache}`,
  titelTr: `Program kodu: ${c.sprache}`,
  titelCs: `Programový kód: ${c.sprache}`,
  titelBg: `Програмен код: ${c.sprache}`,
  titelEl: `Κώδικας προγραμματισμού: ${c.sprache}`,
  titelHu: `Programkód: ${c.sprache}`,
  titelNl: `Programmacode: ${c.sprache}`,
  titelPt: `Código de programação: ${c.sprache}`,
  titelBr: `Código de programação: ${c.sprache}`,
  titelRo: `Cod de program: ${c.sprache}`,
  titelSv: `Programkod: ${c.sprache}`,
  titelUk: `Програмний код: ${c.sprache}`,
  art: "code" as const,
  kinds: [] as const,
  fuer: ["uebung"] as const,
  langs: SPRACHEN_MIT_LEKTIONSVORLAGEN,
}));

/** ALLE Vorlagen - Lektionen zuerst, dann Fremdwörter/Word roots/Racines/Raíces/Radici, dann Programmcode. */
export const VORLAGEN: readonly VorlageDef[] = [
  ...LEKTIONS_VORLAGEN,
  ...FREMD_UEBUNG,
  ...FREMD_CHALLENGE,
  ...WORTWURZELN_UEBUNG,
  ...WORTWURZELN_CHALLENGE,
  ...RACINES_UEBUNG,
  ...RACINES_CHALLENGE,
  ...RAICES_UEBUNG,
  ...RAICES_CHALLENGE,
  ...RADICI_UEBUNG,
  ...RADICI_CHALLENGE,
  ...KOKLER_UEBUNG,
  ...KOKLER_CHALLENGE,
  ...KORZENIE_UEBUNG,
  ...KORZENIE_CHALLENGE,
  ...KORENY_UEBUNG,
  ...KORENY_CHALLENGE,
  ...GERUEST_WURZEL_UEBUNG,
  ...GERUEST_WURZEL_CHALLENGE,
  ...CODE_VORLAGE_DEFS,
];

export function vorlageById(id: string): VorlageDef | undefined {
  return VORLAGEN.find((v) => v.id === id);
}

/** Die Vorlagen, die ein Kasten anbietet - je Verwendungszweck und Sprache der Übungstexte. */
export function vorlagenFuer(opts: { fuer: VorlageFuer; lang: Lang }): VorlageDef[] {
  return VORLAGEN.filter((v) => v.fuer.includes(opts.fuer) && v.langs.includes(opts.lang));
}

/**
 * Der Name einer Vorlage in der Bedienungssprache der Lehrkraft. ★ E11a-5:
 * eine Auswahl über alle drei Felder statt einer Weiche auf „en".
 */
export function vorlageTitel(v: VorlageDef, sprache: BedienSprache): string {
  const je: Record<BedienSprache, string> = {
    de: v.titel,
    en: v.titelEn,
    fr: v.titelFr,
    es: v.titelEs,
    it: v.titelIt,
    pl: v.titelPl,
    tr: v.titelTr,
    cs: v.titelCs,
    // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
    bg: v.titelBg,
    el: v.titelEl,
    hu: v.titelHu,
    nl: v.titelNl,
    pt: v.titelPt,
    br: v.titelBr,
    ro: v.titelRo,
    sv: v.titelSv,
    uk: v.titelUk,
  };
  return je[sprache];
}

// ── Fremdwörterkunde ────────────────────────────────────────────────────────

/** Die Zeile eines Paares: zuerst das deutsche Wort (oder die Umschreibung), dann das Fremdwort. */
export function fremdZeile(p: FremdPaar): string {
  return `${p.de} - ${p.fremd}`;
}

function kontoStufe(stufe: Stufe): KontoStufe {
  const s = migriereStufe(stufe);
  return s === "kids" || s === "teens" || s === "erwachsen" ? s : "teens";
}

/**
 * Die Wörter der Challenge-Dateien: ALLE Paare der Stufe, alphabetisch nach
 * der deutschen Seite, in {@link FREMD_CHALLENGE_DATEIEN} gleich grosse
 * Stücke - deterministisch, damit alle Kinder einer Klasse dieselbe Datei
 * sehen.
 */
export function fremdChallengePaare(stufe: Stufe, nr: number): FremdPaar[] {
  const alle = FREMDWOERTER[kontoStufe(stufe)]
    .flatMap((t) => t.paare)
    .sort((a, b) => a.de.localeCompare(b.de, "de"));
  const von = Math.round((nr * alle.length) / FREMD_CHALLENGE_DATEIEN);
  const bis = Math.round(((nr + 1) * alle.length) / FREMD_CHALLENGE_DATEIEN);
  return alle.slice(von, bis);
}

/** Die Zeilen einer Fremdwörter-Vorlage, oder `null`, wenn die Kennung keine ist. */
function fremdZeilen(id: string, stufe: Stufe): string[] | null {
  if (id.startsWith("fremdc-")) {
    const nr = Number(id.slice("fremdc-".length)) - 1;
    if (!Number.isInteger(nr) || nr < 0 || nr >= FREMD_CHALLENGE_DATEIEN) return null;
    return fremdChallengePaare(stufe, nr).map(fremdZeile);
  }
  const thema = FREMDWOERTER[kontoStufe(stufe)].find((t) => `fremd-${t.id}` === id);
  return thema ? thema.paare.map(fremdZeile) : null;
}

/**
 * ★ E8 (24.09.2026): dieselbe Rechnung wie {@link fremdZeilen}, für „Word
 * roots" - `WORD_ROOTS_ALPHABETISCH` trägt die Challenge-Zeilen (alphabetisch
 * nach `clue`) schon fertig geformt, darum reicht hier ein Ausschnitt.
 */
function wurzelnZeilen(id: string, stufe: Stufe): string[] | null {
  const s: WordRootStufe = kontoStufe(stufe);
  if (id.startsWith("wurzelnc-")) {
    const nr = Number(id.slice("wurzelnc-".length)) - 1;
    if (!Number.isInteger(nr) || nr < 0 || nr >= WORTWURZELN_CHALLENGE_DATEIEN) return null;
    const alle = WORD_ROOTS_ALPHABETISCH[s];
    const von = Math.round((nr * alle.length) / WORTWURZELN_CHALLENGE_DATEIEN);
    const bis = Math.round(((nr + 1) * alle.length) / WORTWURZELN_CHALLENGE_DATEIEN);
    return alle.slice(von, bis);
  }
  const thema = WORD_ROOTS[s].find((t) => `wurzeln-${t.id}` === id);
  return thema ? thema.paare.map(wordRootZeile) : null;
}

/**
 * ★ E10a (25.09.2026): dieselbe Rechnung wie {@link wurzelnZeilen}, für
 * „D'où viennent les mots ?" - `RACINES_ALPHABETISCH` trägt die
 * Challenge-Zeilen (alphabetisch nach `indice`) schon fertig geformt.
 */
function racinesZeilen(id: string, stufe: Stufe): string[] | null {
  const s: RacineStufe = kontoStufe(stufe);
  if (id.startsWith("motsc-")) {
    const nr = Number(id.slice("motsc-".length)) - 1;
    if (!Number.isInteger(nr) || nr < 0 || nr >= RACINES_CHALLENGE_DATEIEN) return null;
    const alle = RACINES_ALPHABETISCH[s];
    const von = Math.round((nr * alle.length) / RACINES_CHALLENGE_DATEIEN);
    const bis = Math.round(((nr + 1) * alle.length) / RACINES_CHALLENGE_DATEIEN);
    return alle.slice(von, bis);
  }
  const thema = RACINES[s].find((t) => `mots-${t.id}` === id);
  return thema ? thema.paare.map(racineZeile) : null;
}

/** ★ ES-S (27.09.2026): „Raíces y préstamos" - dieselbe Bauart wie {@link racinesZeilen}. */
function raicesZeilen(id: string, stufe: Stufe): string[] | null {
  const s: RaizStufe = kontoStufe(stufe);
  if (id.startsWith("palabrasc-")) {
    const nr = Number(id.slice("palabrasc-".length)) - 1;
    if (!Number.isInteger(nr) || nr < 0 || nr >= RAICES_CHALLENGE_DATEIEN) return null;
    const alle = RAICES_ALPHABETISCH[s];
    const von = Math.round((nr * alle.length) / RAICES_CHALLENGE_DATEIEN);
    const bis = Math.round(((nr + 1) * alle.length) / RAICES_CHALLENGE_DATEIEN);
    return alle.slice(von, bis);
  }
  const thema = RAICES[s].find((t) => `palabras-${t.id}` === id);
  return thema ? thema.paare.map(raizZeile) : null;
}

/** ★ IT-S (03.10.2026): „Radici e prestiti" - dieselbe Bauart wie {@link raicesZeilen}. */
function radiciZeilen(id: string, stufe: Stufe): string[] | null {
  const s: RadiceStufe = kontoStufe(stufe);
  if (id.startsWith("parolec-")) {
    const nr = Number(id.slice("parolec-".length)) - 1;
    if (!Number.isInteger(nr) || nr < 0 || nr >= RADICI_CHALLENGE_DATEIEN) return null;
    const alle = RADICI_ALFABETICO[s];
    const von = Math.round((nr * alle.length) / RADICI_CHALLENGE_DATEIEN);
    const bis = Math.round(((nr + 1) * alle.length) / RADICI_CHALLENGE_DATEIEN);
    return alle.slice(von, bis);
  }
  const tema = RADICI[s].find((t) => `parole-${t.id}` === id);
  return tema ? tema.paare.map(radiceZeile) : null;
}

/** ★ TR-S (09.10.2026): „Kökler ve alıntılar" - dieselbe Bauart wie {@link radiciZeilen}. */
function koklerZeilen(id: string, stufe: Stufe): string[] | null {
  const s: KokStufe = kontoStufe(stufe);
  if (id.startsWith("kokc-")) {
    const nr = Number(id.slice("kokc-".length)) - 1;
    if (!Number.isInteger(nr) || nr < 0 || nr >= KOKLER_CHALLENGE_DATEIEN) return null;
    const alle = KOKLER_ALFABETIK[s];
    const von = Math.round((nr * alle.length) / KOKLER_CHALLENGE_DATEIEN);
    const bis = Math.round(((nr + 1) * alle.length) / KOKLER_CHALLENGE_DATEIEN);
    return alle.slice(von, bis);
  }
  const tema = KOKLER[s].find((t) => `kokler-${t.id}` === id);
  return tema ? tema.paare.map(kokZeile) : null;
}

/** ★ PL-W (09.10.2026): „Korzenie i zapożyczenia" - dieselbe Bauart wie {@link radiciZeilen}. */
function korzenieZeilen(id: string, stufe: Stufe): string[] | null {
  const s: KorzenStufe = kontoStufe(stufe);
  if (id.startsWith("slowac-")) {
    const nr = Number(id.slice("slowac-".length)) - 1;
    if (!Number.isInteger(nr) || nr < 0 || nr >= KORZENIE_CHALLENGE_DATEIEN) return null;
    const alle = KORZENIE_ALFABETYCZNIE[s];
    const von = Math.round((nr * alle.length) / KORZENIE_CHALLENGE_DATEIEN);
    const bis = Math.round(((nr + 1) * alle.length) / KORZENIE_CHALLENGE_DATEIEN);
    return alle.slice(von, bis);
  }
  const temat = KORZENIE[s].find((t) => `slowa-${t.id}` === id);
  return temat ? temat.paare.map(korzenZeile) : null;
}

/** ★ CS-W (09.10.2026): „Původ slov" - dieselbe Bauart wie {@link radiciZeilen}. */
function korenyZeilen(id: string, stufe: Stufe): string[] | null {
  const s: KorenStufe = kontoStufe(stufe);
  if (id.startsWith("puvodc-")) {
    const nr = Number(id.slice("puvodc-".length)) - 1;
    if (!Number.isInteger(nr) || nr < 0 || nr >= KORENY_CHALLENGE_DATEIEN) return null;
    const alle = KORENY_ABECEDNE[s];
    const von = Math.round((nr * alle.length) / KORENY_CHALLENGE_DATEIEN);
    const bis = Math.round(((nr + 1) * alle.length) / KORENY_CHALLENGE_DATEIEN);
    return alle.slice(von, bis);
  }
  const tema = KORENY[s].find((t) => `puvod-${t.id}` === id);
  return tema ? tema.paare.map(korenZeile) : null;
}

/** ★ G3c-VERTEILER (25.10.2026): die Zeilen einer Gerüst-Wurzel-Vorlage - dieselbe Bauart wie {@link korenyZeilen}. */
function geruestWurzelZeilen(w: GeruestWurzelDaten, id: string, stufe: Stufe): string[] | null {
  const s = kontoStufe(stufe);
  const c = `herkunftc-${w.lang}-`;
  if (id.startsWith(c)) {
    const nr = Number(id.slice(c.length)) - 1;
    if (!Number.isInteger(nr) || nr < 0 || nr >= GERUEST_WURZEL_CHALLENGE_DATEIEN) return null;
    const alle = w.alphabetisch[s];
    const von = Math.round((nr * alle.length) / GERUEST_WURZEL_CHALLENGE_DATEIEN);
    const bis = Math.round(((nr + 1) * alle.length) / GERUEST_WURZEL_CHALLENGE_DATEIEN);
    return alle.slice(von, bis);
  }
  const thema = w.stufen[s].find((t) => `herkunft-${w.lang}-${t.id}` === id);
  return thema ? thema.paare.map(w.zeile) : null;
}

/**
 * Die Vorschau einer Vorlage - genau wie {@link verarbeiteEigenenText} bei
 * einem Upload: Zeilen, geglättet, mit Zeichen-Bericht. `null`, wenn es die
 * Vorlage nicht gibt oder der Korpus für diese Stufe/Sprache nichts hergibt
 * (in der Praxis nicht zu erwarten - jede Sorte trägt Einträge für jede
 * Stufe, siehe `corpusData.ts`).
 */
export function vorlageVorschau(
  id: string,
  opts: {
    stufe: Stufe;
    lang: Lang;
    verbietenSs: boolean;
    /**
     * ★ E6a (24.09.2026, Bauplan §6.3), Prop seit E8: der Lernweg des Kindes/
     * der Klasse. OPTIONAL, Vorgabe „de" - ein Aufruf ohne dieses Feld (jeder
     * heutige Aufrufer ausserhalb `EigenerTextQuelle.tsx`) verhält sich wie
     * vor E6a. `EigenerTextQuelle.tsx` reicht seit E8 den Lernweg der Klasse
     * herein (`lernwegVon(cls)`).
     */
    lernweg?: Lernweg;
  },
): EigenerTextVorschau | null {
  const lernweg: Lernweg = opts.lernweg ?? "de";
  const def = vorlageById(id);
  if (!def) return null;
  if (def.art === "fremd") {
    // Fremdwörterkunde ist deutscher Inhalt - `langs: ["de"]` schliesst sie in
    // `vorlagenFuer` auf Weg „en" schon aus (dort ist `lang` immer „en"); die
    // Prüfung hier ist die zweite, ausdrückliche Sperre (Bauplan §6.3 „auf Weg
    // en ausblenden"), falls `vorlageVorschau` je mit einer ID ausserhalb der
    // gefilterten Liste aufgerufen wird.
    if (opts.lang !== "de" || lernweg !== "de") return null;
    const zeilen = fremdZeilen(id, opts.stufe);
    if (!zeilen || zeilen.length === 0) return null;
    return verarbeiteEigenenText(zeilen.join("\n"), {
      verbietenSs: opts.verbietenSs,
      zielZeilenlaenge: FREMD_ZEILENLAENGE,
      weg: lernweg,
    });
  }
  if (def.art === "wurzeln") {
    // ★ E8 (24.09.2026): das englische Gegenstück zur Sperre oben - „Word
    // roots" gehört zum ENGLISCHEN Lehrgang (Bauplan §6.3) und bleibt darum
    // an den Weg „en" gebunden, nicht schon an `lang === "en"` allein (eine
    // deutsche Klasse, die englisch übt, bleibt auf Weg „de" - D1 - und sieht
    // weiterhin gar keine „Word roots"-Vorlage).
    if (opts.lang !== "en" || lernweg !== "en") return null;
    const zeilen = wurzelnZeilen(id, opts.stufe);
    if (!zeilen || zeilen.length === 0) return null;
    return verarbeiteEigenenText(zeilen.join("\n"), {
      verbietenSs: opts.verbietenSs,
      zielZeilenlaenge: FREMD_ZEILENLAENGE,
      weg: lernweg,
    });
  }
  if (def.art === "racines") {
    // ★ E10a (25.09.2026): dieselbe Sperre wie bei „wurzeln" (Bauplan §6.6) -
    // „D'où viennent les mots ?" gehört zum FRANZÖSISCHEN Lehrgang und bleibt
    // an den Weg „fr" gebunden, nicht schon an `lang === "fr"` allein.
    if (opts.lang !== "fr" || lernweg !== "fr") return null;
    const zeilen = racinesZeilen(id, opts.stufe);
    if (!zeilen || zeilen.length === 0) return null;
    return verarbeiteEigenenText(zeilen.join("\n"), {
      verbietenSs: opts.verbietenSs,
      zielZeilenlaenge: FREMD_ZEILENLAENGE,
      weg: lernweg,
    });
  }
  if (def.art === "raices") {
    // ★ ES-S (27.09.2026): dieselbe Sperre - „Raíces y préstamos" gehört zum
    // SPANISCHEN Lehrgang, gebunden an Weg „es" UND Übungssprache „es".
    if (opts.lang !== "es" || lernweg !== "es") return null;
    const zeilen = raicesZeilen(id, opts.stufe);
    if (!zeilen || zeilen.length === 0) return null;
    return verarbeiteEigenenText(zeilen.join("\n"), {
      verbietenSs: opts.verbietenSs,
      zielZeilenlaenge: FREMD_ZEILENLAENGE,
      weg: lernweg,
    });
  }
  if (def.art === "radici") {
    // ★ IT-S (03.10.2026): dieselbe Sperre - „Radici e prestiti" gehört zum ITALIENISCHEN Lehrgang,
    // gebunden an Weg „it" UND Übungssprache „it".
    if (opts.lang !== "it" || lernweg !== "it") return null;
    const zeilen = radiciZeilen(id, opts.stufe);
    if (!zeilen || zeilen.length === 0) return null;
    return verarbeiteEigenenText(zeilen.join("\n"), {
      verbietenSs: opts.verbietenSs,
      zielZeilenlaenge: FREMD_ZEILENLAENGE,
      weg: lernweg,
    });
  }
  if (def.art === "kokler") {
    // ★ TR-S (09.10.2026): dieselbe Sperre - „Kökler ve alıntılar" gehört zum TÜRKISCHEN Lehrgang,
    // gebunden an Weg „tr" UND Übungssprache „tr".
    if (opts.lang !== "tr" || lernweg !== "tr") return null;
    const zeilen = koklerZeilen(id, opts.stufe);
    if (!zeilen || zeilen.length === 0) return null;
    return verarbeiteEigenenText(zeilen.join("\n"), {
      verbietenSs: opts.verbietenSs,
      zielZeilenlaenge: FREMD_ZEILENLAENGE,
      weg: lernweg,
    });
  }
  if (def.art === "korzenie") {
    // ★ PL-W (09.10.2026): dieselbe Sperre - „Korzenie i zapożyczenia" gehört zum POLNISCHEN Lehrgang,
    // gebunden an Weg „pl" UND Übungssprache „pl".
    if (opts.lang !== "pl" || lernweg !== "pl") return null;
    const zeilen = korzenieZeilen(id, opts.stufe);
    if (!zeilen || zeilen.length === 0) return null;
    return verarbeiteEigenenText(zeilen.join("\n"), {
      verbietenSs: opts.verbietenSs,
      zielZeilenlaenge: FREMD_ZEILENLAENGE,
      weg: lernweg,
    });
  }
  if (def.art === "koreny") {
    // ★ CS-W (09.10.2026): dieselbe Sperre - „Původ slov" gehört zum TSCHECHISCHEN Lehrgang,
    // gebunden an Weg „cs" UND Übungssprache „cs".
    if (opts.lang !== "cs" || lernweg !== "cs") return null;
    const zeilen = korenyZeilen(id, opts.stufe);
    if (!zeilen || zeilen.length === 0) return null;
    return verarbeiteEigenenText(zeilen.join("\n"), {
      verbietenSs: opts.verbietenSs,
      zielZeilenlaenge: FREMD_ZEILENLAENGE,
      weg: lernweg,
    });
  }
  if (def.art === "wortherkunft") {
    // ★ G3c-VERTEILER (25.10.2026): dieselbe Sperre wie „koreny" - die Vorlage gehört zum Lehrgang IHRER Sprache (Weg UND Übungssprache).
    const w = GERUEST_WURZELN.find((x) => def.langs.includes(x.lang));
    if (!w || opts.lang !== w.lang || lernweg !== w.lang) return null;
    const zeilen = geruestWurzelZeilen(w, id, opts.stufe);
    if (!zeilen || zeilen.length === 0) return null;
    return verarbeiteEigenenText(zeilen.join("\n"), {
      verbietenSs: opts.verbietenSs,
      zielZeilenlaenge: FREMD_ZEILENLAENGE,
      weg: lernweg,
    });
  }
  if (def.art === "code") {
    const code = CODE_VORLAGEN.find((c) => c.id === id);
    if (!code) return null;
    // ★ G2b-2: nur Deutsch und Englisch haben eine Einleitung - sonst wäre sie deutsch.
    if (!def.langs.includes(opts.lang)) return null;
    return verarbeiteFesteZeilen(
      [opts.lang === "en" ? code.introEn : code.introDe, ...code.zeilen],
      { verbietenSs: opts.verbietenSs, weg: lernweg },
    );
  }
  // ★ G2b-2: eine Lektions-Vorlage gibt es nur für ihre Sprachen (vorher: jede Sprache, die hier
  // ankam, bekam stillschweigend das, was `corpusItemsFor` lieferte).
  if (!def.langs.includes(opts.lang)) return null;
  const zeilen = corpusItemsFor({
    stufe: opts.stufe,
    // ★ E6a (24.09.2026): der Zeichenvorrat UND der Lernweg folgen jetzt
    // `opts.lernweg` (Vorgabe „de", siehe oben) statt eines festen „de".
    allowed: zeichenVorrat("alles", lernweg),
    kinds: [...def.kinds],
    lang: opts.lang,
    lernweg,
  }).slice(0, VORLAGE_ZEILEN_GROESST);
  if (zeilen.length === 0) return null;
  return verarbeiteEigenenText(zeilen.join("\n"), { verbietenSs: opts.verbietenSs, weg: lernweg });
}
