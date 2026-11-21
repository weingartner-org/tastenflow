/**
 * Wort-Lexikon des Tipptrainers — beantwortet „ist dieser Token ein echtes
 * Wort?" für die Sprachausgabe.
 *
 * Hintergrund (Wunsch von Johannes): In der Grundreihe (und überall, wo
 * Übungssilben/Pseudowörter vorkommen) soll die App NICHT die unaussprechliche
 * Silbe als „Wort" vorlesen, sondern Buchstabe für Buchstabe — echte Wörter
 * dagegen als ganzes Wort. Dafür vereint das Lexikon den Übungs-Wortschatz, den
 * Markov-Saat-Wortschatz UND alle Wörter aus den Korpus-Texten (Witze, Sätze, …),
 * deutsch + englisch. Pseudowörter (Markov-/Silben-Ausgabe) stehen NICHT darin
 * und werden daher buchstabiert; echte Korpus-Wörter dagegen nie.
 *
 * ★★ 29.08.2026 - DIE SERIEN GEHÖREN DAZU (Rückmeldung Jens): Bis dahin kannte
 * das Lexikon nur den KORPUS, nicht die Geschichten und Wissens-Serien. Gemessen
 * (`scripts/_englisch.mts`) wurden dadurch **11,6 % der englischen und 13,9 % der
 * deutschen Serien-Wörter buchstabiert** - nicht die schweren, sondern die
 * unbekannten: „belonged", „aunt", „salty", „Diese", „Mitte" und **jeder
 * Eigenname** (Nell, Marta, Sofie). Aus „The house had belonged to my aunt."
 * wurde „The · house · had · b-e-l-o-n-g-e-d · to · my · a-u-n-t". Für ein Kind
 * war da keine Regel zu hören, weil es keine gab. Johannes' Entscheidung:
 * Serien hinein, **Eigennamen ganz vorlesen** - wer buchstabiert haben will,
 * schaltet „Wort und dann buchstabieren" ein.
 *
 * Lazy + gecacht: erst beim ersten Vorlesen aufgebaut. Siehe
 * [[project_zehnfinger_trainer]].
 */
import { WORDS } from "./words";
import { STUFE_VOCAB, MARKOV_SEED } from "./corpusExtras";
import { WORDS_EN, STUFE_VOCAB_EN } from "./corpusEn";
import { WORDS_FR } from "./wordsFr";
// ★ F8-it (02.10.2026): der italienische Übungswortschatz gehört ins italienische Fach (Lexikon VOR den Texten, Falle 58).
import { WORDS_IT, STUFE_VOCAB_IT } from "./wordsIt";
import { gesperrtIt } from "./sperrlisteIt";
// ★ F8-pl (03.10.2026): dasselbe für Polnisch - der Übungswortschatz gehört ins polnische Fach (Lexikon VOR den Texten, Falle 58).
import { WORDS_PL, STUFE_VOCAB_PL } from "./wordsPl";
import { gesperrtPl } from "./sperrlistePl";
// ★ F8-tr (03.10.2026): dasselbe für Türkisch (Lexikon VOR den Texten, Falle 58).
import { WORDS_TR, STUFE_VOCAB_TR } from "./wordsTr";
import { gesperrtTr } from "./sperrlisteTr";
// ★ F8-cs (03.10.2026): dasselbe für Tschechisch - aber ohne Wörterbuch (Falle 61), nur mit der KERN-Sperrliste (siehe `addCs`).
import { WORDS_CS, STUFE_VOCAB_CS } from "./wordsCs";
import { istKernGesperrtCs } from "./sperrlisteCs";
import {
  CORPUS,
  CORPUS_EN,
  CORPUS_IT,
  CORPUS_PL,
  CORPUS_TR,
  CORPUS_CS,
  CORPUS_BG,
  CORPUS_EL,
  CORPUS_HU,
  CORPUS_NL,
  CORPUS_PT,
  CORPUS_BR,
  CORPUS_RO,
  CORPUS_SV,
  CORPUS_UK,
  type CorpusItem,
} from "./corpus";
// ★ F58 (29.10.2026): die neun Wege des Gerüsts - Wörter, Themenwortschatz und KERN-Sperrliste über den Verteiler (eine Zeile statt neun).
import { GERUEST_KERN_GESPERRT, GERUEST_STUFE_VOCAB, GERUEST_WORDS } from "./geruestWoerter";
import { GERUEST_SPRACHEN, istGeruestSprache, type GeruestSprache } from "./sprachRegister";
import { SERIEN } from "./serien";
// ★ 28.09.2026: Die Nachträge kommen mit dem Sprachpaket ihrer Sprache.
import { beiSprachpaket, fehlZugriff, sprachDaten, sprachpaketGeladen } from "./sprachpakete";
import { serieLines } from "./serie";
import type { Lang } from "./account";
import { kleinFuer } from "./sprachRegister";

/**
 * ★★★ F58 (29.10.2026): der Korpus je Gerüst-Weg - `export let` in `corpus.ts`, darum als FUNKTION gelesen (der Wert ändert sich, wenn
 * das Sprachpaket geladen ist; ein Objekt mit den Werten von heute wäre beim Laden des Moduls eingefroren und bliebe leer).
 */
function korpusDerNeun(lang: GeruestSprache): readonly CorpusItem[] {
  const tabelle: Record<GeruestSprache, readonly CorpusItem[]> = {
    bg: CORPUS_BG,
    el: CORPUS_EL,
    hu: CORPUS_HU,
    nl: CORPUS_NL,
    pt: CORPUS_PT,
    br: CORPUS_BR,
    ro: CORPUS_RO,
    sv: CORPUS_SV,
    uk: CORPUS_UK,
  };
  return tabelle[lang];
}

/**
 * ★ F58 (29.10.2026, Glossar ro §4, Hausregel „ș ț mit Komma"): Rumänisch schreibt ș ț mit KOMMA (U+0219, U+021B). Ältere Tastaturen und
 * Texte aus Word liefern die Cedille-Formen ş ţ (U+015F, U+0163) - dasselbe Wort hätte sonst zwei Formen, und ein eigener Text mit
 * Cedille würde an jedem dieser Wörter buchstabiert. Nur für die Prüfung „echtes Wort?", die Anzeige bleibt, wie sie ist.
 */
const RUMAENISCH_CEDILLE: Readonly<Record<string, string>> = { "ş": "ș", "ţ": "ț", "Ş": "Ș", "Ţ": "Ț" };

/**
 * Auf reine Buchstaben reduzieren (umgebende Satzzeichen/Ziffern weg, klein).
 *
 * ★★★★ E12 (26.09.2026, Bauplan §5.2 Punkt 3, §15 Falle 7): OHNE `lang`
 * bleibt das Verhalten BYTE-IDENTISCH zu vorher (`[^a-zäöüß]`) - jeder der
 * tausenden bestehenden Aufrufe (deutsch, englisch) normalisiert weiter genau
 * gleich. NUR mit `lang: "fr"` gilt eine WEITERE Zeichenklasse, die Akzente
 * und den Apostroph stehen lässt: Die alte Regel hätte „élève" zu „lve"
 * verstümmelt (Bauplan-Falle 7, `lexicon.ts:37`) - kein Wort mit é/è/ê/à/ç/œ
 * hätte je ins Lexikon gefunden, und „ganzes Wort statt buchstabieren" wäre
 * für Französisch von Anfang an falsch aufgebaut gewesen.
 *
 * ★ E9a (26.09.2026, Rückmeldung Défi-Auftrag E13b-2): der BINDESTRICH gehört
 * für „fr" ebenso dazu - anders als im Deutschen/Englischen ist er im
 * Französischen Teil ganz gewöhnlicher Wörter (est-ce, peut-être,
 * qu'est-ce-que, Wortzahlen wie dix-huit), nicht nur eine Trennung
 * zusammengesetzter Wörter. Ohne ihn zerfällt „peut-être" beim Normalisieren
 * in „peutre" - ein Wort, das im Lexikon nie vorkommt, darum buchstabiert
 * die Sprachausgabe „peut-être" IMMER, obwohl die Zeile selbst schon lange
 * lauffähig ist (E8b Block 1b macht den Bindestrich beim TIPPEN „hart" -
 * dieselbe Falle beim VORLESEN war bis hierher nicht behoben). Deutsch/
 * Englisch bleiben unverändert (Bindestrich dort weiterhin kein Wortzeichen).
 */
const FRANZOESISCHE_ZEICHEN = /[^a-zàâäçèéêëîïôöùûüÿœ'-]/g;

/**
 * ★★★ ES-F8 (27.09.2026, Bauplan spanischer Lehrgang §4, Auftrag Punkt 5):
 * dieselbe Erweiterung fuer SPANISCH - Akzente (á é í ó ú), Trema (ü) und ñ
 * bleiben stehen. ANDERS als bei Franzoesisch/E9a braucht Spanisch KEINEN
 * Bindestrich und KEINEN Apostroph in der Normalisierung: die spanischen
 * Entwuerfe (serienEs*.ts, schreibproben/*Es*.ts) enthalten keine echten
 * bindestrich- oder apostrophgebundenen Woerter (gemessen per grep - nur
 * Zeilenumbrueche in mehrzeiligem Text erzeugen scheinbare Bindestrich-Woerter,
 * keine echten). ñ bleibt ñ (Falle 4 des spanischen Bauplans: normalizeWord
 * darf ñ nicht zu n machen).
 */
const SPANISCHE_ZEICHEN = /[^a-zñáéíóúü]/g;

/**
 * ★★★ G2b-1 (02.10.2026, Befund G1c §3 Nr. 4 und 5, Leitfaden Falle 7): für
 * die Sprachen OHNE eigene, enge Klasse (it, pl, tr, cs) zählt JEDER Buchstabe
 * (Unicode `\p{L}`) - keine Liste von Sonderbuchstaben. Die alte Klasse
 * `[^a-zäöüß]` hätte „łódź" zu „d", „ışık" zu „k" und „čeština" zu „eština"
 * zerschnitten; kein Wort mit Sonderbuchstaben wäre je im Lexikon gefunden worden.
 */
const ALLE_BUCHSTABEN = /[^\p{L}]/gu;

/**
 * ★ G3a-SCHRIFT (25.10.2026, Falle 7/43): Ukrainisch schreibt den Apostroph IM Wort (`сім'я`, `м'ясо`, `пам'ять`) - als
 * U+0027, als U+2019 oder als U+02BC (MODIFIER LETTER APOSTROPHE). U+02BC ist für Unicode ein BUCHSTABE (`Lm`): mit
 * {@link ALLE_BUCHSTABEN} bliebe „сімʼя" stehen, „сім'я" würde „сімя" - dasselbe Wort hätte zwei Formen, und
 * `isRealWord` fände die eine nie. Hier fallen alle drei weg.
 */
const UKRAINISCHE_ZEICHEN = /[^\p{L}]|ʼ/gu;

/**
 * ★★★ F8-it (02.10.2026, Falle 7): Italienisch behält den APOSTROPH im Wort - die Elision (`l'amico`, `un'ora`,
 * `dell'acqua`, `c'è`) und die Verkürzung (`po'`) sind Teil des Wortes, nicht Satzzeichen. Mit der Klasse oben (G2b-1)
 * wäre aus `l'amico` das Nicht-Wort `lamico` geworden; `isRealWord` hätte jede Elision (rund 8 % der Sätze, Befund F4)
 * buchstabiert. Ein führender oder schliessender Apostroph (ein Anführungszeichen, das so geschrieben wurde) stört die
 * Prüfung nicht: {@link istElisionIt} schneidet ihn ab. Wie bei Französisch (E12/E9a).
 */
const ITALIENISCHE_ZEICHEN = /[^\p{L}']/gu;

/**
 * ★★★ F8-tr (03.10.2026, Falle 7/75): Türkisch behält den APOSTROPH im Wort - er steht nur an Eigennamen mit Endung (`Ankara'da`,
 * `Ali'nin`, `Türkiye'ye`) und ist dort Teil des Wortes. Mit der Klasse davor (G2b-1: alle Buchstaben, sonst nichts) wäre aus
 * `Ali'nin` das Nicht-Wort `alinin` geworden und jede Namens-Endung der Stimme eine Buchstabenfolge. Ein führender oder
 * schliessender Apostroph (ein Anführungszeichen, das so geschrieben wurde) stört die Prüfung nicht: {@link istApostrofFormTr}
 * schneidet ihn ab. Gross-/Kleinschreibung bleibt die türkische (`kleinFuer(…, "tr")`, in {@link normalizeWord}).
 */
const TUERKISCHE_ZEICHEN = /[^\p{L}']/gu;
const DEUTSCHE_ZEICHEN = /[^a-zäöüß]/g;

/**
 * Welche Zeichen ein Wort einer Sprache ausmachen. Eine TABELLE über alle Sprachen
 * (`tsc` verlangt für jede neue Sprache einen Eintrag), keine Kette mit einem
 * Standard-Zweig (Falle 50). de, en, fr, es: dieselben Klassen wie vor G2b-1 -
 * Byte für Byte („Café" bleibt auf de/en „caf", der Test `tastenflow-e12-…`).
 */
const WORT_ZEICHENKLASSE: Record<Lang, RegExp> = {
  de: DEUTSCHE_ZEICHEN,
  en: DEUTSCHE_ZEICHEN,
  fr: FRANZOESISCHE_ZEICHEN,
  es: SPANISCHE_ZEICHEN,
  it: ITALIENISCHE_ZEICHEN,
  pl: ALLE_BUCHSTABEN,
  tr: TUERKISCHE_ZEICHEN,
  cs: ALLE_BUCHSTABEN,
  // ★ G2-NEUN (25.10.2026): jeder Buchstabe (Register `alleBuchstaben`), wie pl und cs.
  bg: ALLE_BUCHSTABEN,
  el: ALLE_BUCHSTABEN,
  hu: ALLE_BUCHSTABEN,
  nl: ALLE_BUCHSTABEN,
  pt: ALLE_BUCHSTABEN,
  br: ALLE_BUCHSTABEN,
  ro: ALLE_BUCHSTABEN,
  sv: ALLE_BUCHSTABEN,
  uk: UKRAINISCHE_ZEICHEN,
};

export function normalizeWord(token: string, lang?: Lang): string {
  // Ohne Sprache wie bisher die deutsche Klasse (jeder Alt-Aufruf). Klein wird
  // in der Sprache des Wortes geschrieben: türkisch „IŞIK" ⇒ „ışık", nicht „işik".
  const sprache: Lang = lang ?? "de";
  const t = sprache === "ro" ? token.replace(/[şţŞŢ]/g, (z) => RUMAENISCH_CEDILLE[z]) : token;
  return kleinFuer(t, sprache).replace(WORT_ZEICHENKLASSE[sprache], "");
}

interface Lexika {
  de: Set<string>;
  en: Set<string>;
  /** ★ E12 (26.09.2026): eigenes Fach, wie im Bauplan gefordert (§15 Falle
   *  „isRealWord fiele für fr sonst still in den beide-Rückfalltopf"). */
  fr: Set<string>;
  /** ★ ES-F8 (27.09.2026): eigenes Fach wie bei "fr" - dieselbe Begruendung
   *  (isRealWord faellt fuer "es" sonst still in den de+en-Rueckfalltopf). */
  es: Set<string>;
  /** ★ F8-it (02.10.2026): eigenes Fach wie bei „fr"/„es" - dieselbe Begründung (`isRealWord` fiele für „it" sonst
   *  still in den de+en-Rückfalltopf). */
  it: Set<string>;
  /** ★ F8-pl (03.10.2026): eigenes Fach wie bei „fr"/„es"/„it" - dieselbe Begründung (`isRealWord` fiele für „pl" sonst
   *  still in den de+en-Rückfalltopf, und jedes polnische Wort würde buchstabiert). */
  pl: Set<string>;
  /** ★ F8-tr (03.10.2026): eigenes Fach wie bei „fr"/„es"/„it" - dieselbe Begründung (`isRealWord` fiele für „tr" sonst
   *  still in den de+en-Rückfalltopf). */
  tr: Set<string>;
  /** ★ F8-cs (03.10.2026): eigenes Fach wie bei „fr"/„es"/„it" - dieselbe Begründung (`isRealWord` fiele für „cs" sonst still in den
   *  de+en-Rückfalltopf, und `lexikonWoerter("cs")` lieferte das französische Fach). */
  cs: Set<string>;
  /** ★ F58 (29.10.2026): je ein eigenes Fach für die neun Wege des Gerüsts (bg el hu nl pt br ro sv uk) - vorher fiel `isRealWord` für
   *  sie in den de+en-Topf (gemessen: 0 % der bulgarischen, griechischen, ukrainischen Korpus-Wörter echt, jedes wurde buchstabiert)
   *  und `lexikonWoerter` lieferte das französische Fach. */
  neun: Record<GeruestSprache, Set<string>>;
  /** Beide zusammen — der Rückfall für Aufrufer ohne Sprachangabe (nur de+en,
   *  wie vor E12 - „fr" bekommt sein eigenes Fach, siehe {@link isRealWord}). */
  beide: Set<string>;
}

let CACHE: Lexika | null = null;

function buildLexicon(): Lexika {
  const de = new Set<string>();
  const en = new Set<string>();
  const fr = new Set<string>();
  const es = new Set<string>();
  const itFach = new Set<string>();
  const plFach = new Set<string>();
  const trFach = new Set<string>();
  const csFach = new Set<string>();
  const neun = Object.fromEntries(GERUEST_SPRACHEN.map((l) => [l, new Set<string>()])) as Record<GeruestSprache, Set<string>>;
  const fuege = (set: Set<string>, lang?: Lang) => (w: string) => {
    const n = normalizeWord(w, lang);
    if (n.length >= 2) set.add(n);
  };
  const addDe = fuege(de);
  const addEn = fuege(en);
  const addFr = fuege(fr, "fr");
  const addEs = fuege(es, "es");
  // ★ F8-it: ein gesperrtes Wort (`sperrlisteIt.ts`) kommt nie ins Fach - die Stimme buchstabiert es, statt es ganz zu sprechen.
  const addItRoh = fuege(itFach, "it");
  const addIt = (w: string) => {
    if (!gesperrtIt(w)) addItRoh(w);
  };
  // ★ F8-pl: ein gesperrtes Wort (`sperrlistePl.ts`, mit und ohne Ogonki verglichen) kommt nie ins Fach.
  const addPlRoh = fuege(plFach, "pl");
  const addPl = (w: string) => {
    if (!gesperrtPl(w)) addPlRoh(w);
  };
  // ★ F8-tr: ein gesperrtes Wort (`sperrlisteTr.ts`, Kern und Wortbasis, richtige Schreibung) kommt nie ins Fach - die Stimme
  // buchstabiert es, statt es ganz zu sprechen. Nicht gefaltet (`sık` ist ein gewöhnliches Wort und wird ganz gelesen).
  const addTrRoh = fuege(trFach, "tr");
  const addTr = (w: string) => {
    if (!gesperrtTr(w)) addTrRoh(w);
  };
  // ★ F8-cs: nur ein KERN-gesperrtes Wort (Schimpfwort, `sperrlisteCs.ts`) kommt nie ins Fach - die Stimme buchstabiert es. Die Wortbasis
  // (zemřel, zabil, sex …) darf hinein: sie sperrt Übungswortlisten und Pseudowörter, nicht das Vorlesen eines Textes, der sie braucht.
  const addCsRoh = fuege(csFach, "cs");
  const addCs = (w: string) => {
    if (!istKernGesperrtCs(w)) addCsRoh(w);
  };
  // ★ F58 (29.10.2026): die neun Wege wie „cs" - nur die KERN-Sperrliste bleibt draussen (Schimpfwörter buchstabiert die Stimme), die
  // Wortbasis darf hinein (Falle 99: sie sperrt Wortlisten und Pseudowörter, nicht das Vorlesen eines Textes, der sie braucht).
  const addNeun = Object.fromEntries(
    GERUEST_SPRACHEN.map((l) => {
      const roh = fuege(neun[l], l);
      const kern = GERUEST_KERN_GESPERRT[l];
      return [l, (w: string) => (kern(w) ? undefined : roh(w))];
    }),
  ) as Record<GeruestSprache, (w: string) => void>;

  WORDS.forEach(addDe);
  MARKOV_SEED.forEach(addDe);
  for (const v of Object.values(STUFE_VOCAB)) v.forEach(addDe);
  WORDS_EN.forEach(addEn);
  for (const v of Object.values(STUFE_VOCAB_EN)) v.forEach(addEn);
  // ★ E12: der französische Übungswortschatz (E10b) - echte, geprüfte Wörter.
  WORDS_FR.forEach(addFr);
  // ★ F8-it: der italienische Übungswortschatz (F6) - dazu die Elisionen (`l'amico`), die er trägt.
  WORDS_IT.forEach(addIt);
  for (const v of Object.values(STUFE_VOCAB_IT)) v.forEach(addIt);
  // ★ F8-pl: der polnische Übungswortschatz (F6).
  WORDS_PL.forEach(addPl);
  for (const v of Object.values(STUFE_VOCAB_PL)) v.forEach(addPl);
  // ★ F8-tr: der türkische Übungswortschatz (F6) - dazu die Namen mit Endung (`ankara'da`), die er trägt.
  WORDS_TR.forEach(addTr);
  for (const v of Object.values(STUFE_VOCAB_TR)) v.forEach(addTr);
  // ★ F8-cs: der tschechische Übungswortschatz (F6).
  WORDS_CS.forEach(addCs);
  for (const v of Object.values(STUFE_VOCAB_CS)) v.forEach(addCs);
  // ★ F58: der Übungswortschatz der neun Wege (D-LERNDATEN, über `geruestWoerter.ts`).
  for (const l of GERUEST_SPRACHEN) {
    GERUEST_WORDS[l].forEach(addNeun[l]);
    for (const v of Object.values(GERUEST_STUFE_VOCAB[l])) v.forEach(addNeun[l]);
  }
  // Alle Wörter aus den Korpus-Texten — so wird ein echtes Korpus-Wort beim
  // Vorlesen NIE buchstabiert (sonst bräche das gelobte Wort+Satz-Verhalten).
  for (const it of CORPUS) for (const tok of it.text.split(/\s+/)) addDe(tok);
  for (const it of CORPUS_EN) for (const tok of it.text.split(/\s+/)) addEn(tok);
  // ★ F8-it: der italienische Korpus (leer bis zu den Text-Chargen; dann füllt sich das Fach von selbst).
  for (const z of CORPUS_IT) for (const tok of z.text.split(/\s+/)) addIt(tok);
  // ★ F8-pl: der polnische Korpus (leer bis zu den Text-Chargen; dann füllt sich das Fach von selbst).
  for (const z of CORPUS_PL) for (const tok of z.text.split(/\s+/)) addPl(tok);
  // ★ F8-tr: der türkische Korpus (leer bis zur Etappe T; dann füllt sich das Fach von selbst, auch mit Eigennamen).
  for (const z of CORPUS_TR) for (const tok of z.text.split(/\s+/)) addTr(tok);
  // ★ F8-cs: der tschechische Korpus (leer bis zu den Text-Chargen; dann füllt sich das Fach von selbst).
  for (const z of CORPUS_CS) for (const tok of z.text.split(/\s+/)) addCs(tok);
  // ★ F58: der Korpus der neun Wege (Charge 1 seit 29.10.2026) - jede Zeile in das Fach IHRES Weges.
  for (const l of GERUEST_SPRACHEN) for (const z of korpusDerNeun(l)) for (const tok of z.text.split(/\s+/)) addNeun[l](tok);
  // (Noch kein CORPUS_FR - E8/E9 folgen; NACHTRAG_FR trägt das Wortfach bis dahin.)
  // … und ebenso aus den SERIEN (Geschichten + Wissen), jede in ihr eigenes Fach.
  for (const s of SERIEN) {
    // ★ ES-F8: "es" noch nicht in SERIEN eingehaengt (die Entwuerfe
    // serienEsKids1.ts/serienEsTeens1.ts/serienEsErwachsen1.ts sind bewusst
    // NICHT angefasst worden - siehe BEFUND-ES-F8), aber vorbereitet: sobald
    // eine kuenftige Etappe "es" dort eintraegt, landet ihr Inhalt richtig.
    const lang = s.lang ?? "de";
    // ★ F58: eine Serie der neun Wege (`lang: "bg"` …) gehört in deren Fach - vorher wäre sie in das DEUTSCHE gefallen.
    const add = istGeruestSprache(lang)
      ? addNeun[lang]
      : lang === "en" ? addEn : lang === "fr" ? addFr : lang === "es" ? addEs : lang === "it" ? addIt : lang === "pl" ? addPl : lang === "tr" ? addTr : lang === "cs" ? addCs : addDe;
    for (const line of serieLines(s)) for (const tok of line.split(/\s+/)) add(tok);
  }
  // Die Nachträge je Sprache (NACHTRAG_DE; NACHTRAG_EN; NACHTRAG_FR,
  // _FR_BINDESTRICH, _FR2; NACHTRAG_ES, _ES2) - dieselbe Reihenfolge wie vor
  // dem 28.09.2026, jetzt aus dem Sprachpaket.
  const nachtrag = (lang: Lang, add: (w: string) => void) => {
    for (const liste of sprachDaten(lang)?.lexikon ?? []) liste.forEach(add);
  };
  nachtrag("de", addDe);
  nachtrag("en", addEn);
  nachtrag("fr", addFr);
  nachtrag("es", addEs);
  nachtrag("it", addIt);
  nachtrag("pl", addPl);
  nachtrag("tr", addTr);
  nachtrag("cs", addCs);
  // ★ F58: die Nachträge der neun Wege (`lexikonNachtrag<Xx>.ts`, erzeugt von `scripts/erzeuge-lexikon-nachtrag-neun.mts`).
  for (const l of GERUEST_SPRACHEN) nachtrag(l, addNeun[l]);
  return { de, en, fr, es, it: itFach, pl: plFach, tr: trFach, cs: csFach, neun, beide: new Set([...de, ...en]) };
}

/**
 * ★ 28.09.2026: Das Lexikon wird aus dem gebaut, was an Sprachpaketen da ist.
 * Kommt eines dazu, wird es beim nächsten Zugriff neu gebaut.
 */
beiSprachpaket(() => {
  CACHE = null;
});

/** Fehlt das Paket einer Sprache, deren Fach gefragt ist? (ohne Sprache: de + en) */
function pruefePaket(lang: Lang | undefined, wo: string): void {
  for (const l of lang ? [lang] : (["de", "en"] as const)) {
    if (!sprachpaketGeladen(l)) fehlZugriff(l, wo);
  }
}

// Die NACHTRÄGE (Wortlisten je Sprache, mit ihrer Entstehungsgeschichte) stehen
// seit 28.09.2026 in `lexikonNachtragDe/En/Fr/Es.ts` - Inhalt unverändert. Grund:
// Als reine Daten-Blätter liegen sie im Datenpaket ihrer Sprache
// (`scripts/buendel-aufteilung.ts`); ein spanischer Nachtrag lädt damit bei
// einem Kind mit Französisch nichts neu.

function lexika(): Lexika {
  return (CACHE ??= buildLexicon());
}

/**
 * Ist `token` ein echtes Wort (kein Silben-/Pseudowort, kein Einzelzeichen)?
 * Reine Vorlese-Hilfe für `readPlanAt`.
 *
 * ★★ 29.08.2026 - DAS LEXIKON KENNT JETZT SPRACHEN. Vorher war es EIN Topf aus
 * Deutsch und Englisch, und im Englisch-Modus entschieden deutsche Wörter mit:
 * Gemessen an der Grundreihe waren **43 % aller Treffer nur im deutschen
 * Lexikon** - „öl", „ja", „da", „lad", „das". Eine englische Übungszeile bekam
 * dadurch mitten im Silben-Drill ein deutsches Wort als ganzes Wort vorgelesen,
 * und die Ansage „echte Wörter" kippte gleich mit. Ohne `lang` bleibt es beim
 * gemeinsamen Topf - so verhalten sich alle Alt-Aufrufer und Tests unverändert.
 *
 * ★ E12 (26.09.2026, Bauplan §15 Falle „isRealWord fiele für fr sonst still
 * in den beide-Rückfalltopf"): „fr" bekommt sein EIGENES Fach (`l.fr`), nicht
 * den de+en-Rückfall - und normalisiert MIT Akzenten/Apostroph
 * ({@link normalizeWord}), sonst fände „élève" nie hinein.
 */
export function isRealWord(token: string, lang?: Lang): boolean {
  const n = normalizeWord(token, lang);
  if (n.length < 2) return false;
  pruefePaket(lang, "isRealWord");
  const l = lexika();
  const fach = istGeruestSprache(lang)
    ? l.neun[lang] // ★ F58 (29.10.2026): eigenes Fach, nie der de+en-Topf
    : lang === "de"
      ? l.de
      : lang === "en"
        ? l.en
        : lang === "fr"
          ? l.fr
          : lang === "es"
            ? l.es
            : lang === "it"
              ? l.it
              : lang === "pl"
                ? l.pl
                : lang === "tr"
                  ? l.tr
                  : lang === "cs"
                    ? l.cs
                    : l.beide;
  if (fach.has(n)) return true;
  // ★ F8-it: eine Elision (`l'amico`) ist ein echtes Wort, wenn ihr Wortanfang ein bekannter ist und das Wort dahinter echt.
  if (lang === "it") return n.includes("'") && istElisionIt(n, fach);
  // ★ F8-tr: ein Eigenname mit Endung (`Ankara'da`) ist ein echtes Wort, wenn hinter dem Apostroph eine türkische Endung steht.
  return lang === "tr" && n.includes("'") && istApostrofFormTr(n, fach);
}

// ── Türkisch: Eigennamen mit Endung (`Ankara'da`) ──────────────────────────────────────────────────────────────
/**
 * ★★★ F8-tr (03.10.2026): die ENDUNGEN, die in der türkischen Schreibung hinter einem Apostroph stehen (TDK „Kesme işareti": nur an
 * Eigennamen, `Ankara'da`, `Ali'nin`, `Türkiye'ye`). Eine GESCHLOSSENE Menge, aus den Bausteinen der Morphologie gebaut: Mehrzahl
 * (`lar ler`) × Besitz (`ım … ları leri`) × Fall und Hilfswort (`a e da de dan den ın in nın nin la le yla yle ki dır …`), jede Form
 * mit ihren Vokalvarianten (`ı i u ü`) und Pufferlauten (`y n s`). Eine offene Regel („alles hinter dem Apostroph") nähme auch
 * `xyz'qwe` als Wort - die Menge hält nur türkische Endungsfolgen. Der Name davor wird NICHT geprüft: ein Eigenname steht in keinem
 * Wörterbuch, und ein Name mit Endung buchstabiert zu hören (`A-l-i-n-i-n`) wäre falsch; der Apostroph ist dort ein sicheres Zeichen
 * für „Name" (kein anderes türkisches Wort trägt ihn).
 */
function baueApostrophEndungenTr(): ReadonlySet<string> {
  const plural = ["", "lar", "ler"];
  const besitz = [
    "", "ım", "im", "um", "üm", "ın", "in", "un", "ün", "ı", "i", "u", "ü", "sı", "si", "su", "sü", "mız", "miz", "muz", "müz", "nız",
    "niz", "nuz", "nüz", "ları", "leri",
  ];
  const fall = [
    "", "a", "e", "ya", "ye", "na", "ne", "ı", "i", "u", "ü", "yı", "yi", "yu", "yü", "nı", "ni", "nu", "nü", "da", "de", "ta", "te",
    "nda", "nde", "dan", "den", "tan", "ten", "ndan", "nden", "ın", "in", "un", "ün", "nın", "nin", "nun", "nün", "la", "le", "yla", "yle",
    "ca", "ce", "daki", "deki", "taki", "teki", "ndaki", "ndeki", "dır", "dir", "dur", "dür", "tır", "tir", "tur", "tür", "ydı", "ydi",
    "ydu", "ydü", "ymış", "ymiş", "ymuş", "ymüş", "yım", "yim", "yum", "yüm", "sın", "sin", "sun", "sün", "ki", "yken", "ysa", "yse",
  ];
  const aus = new Set<string>();
  for (const p of plural) for (const b of besitz) for (const f of fall) if (p + b + f !== "") aus.add(p + b + f);
  return aus;
}

const APOSTROPH_ENDUNGEN_TR: ReadonlySet<string> = baueApostrophEndungenTr();

/**
 * ★ F8-tr (03.10.2026): die SCHWÄNZE, die hinter einer Endung stehen dürfen - Kopula in der Vergangenheit (`Tom'du`, `Berlin'deydi`),
 * Personenendung (`İstanbul'dayım`, `Ankara'dasın`) und Ableitung auf `-lı` (`Kanada'lı`, `Almanya'lılar`). Gemessen an den
 * Tatoeba-Sätzen (apostrophe Tokens): ohne sie fehlten 1,9 % der Eigennamen-Formen (`Tom'du`, `Berlin'deydi`, `Kanada'lı` …). Eine kleine,
 * GESCHLOSSENE Menge (Stamm × Person), kein Freibrief: vor dem Schwanz muss `""` oder eine Endung aus {@link APOSTROPH_ENDUNGEN_TR} stehen.
 */
const APOSTROPH_SCHWAENZE_TR: ReadonlySet<string> = (() => {
  const stamm = ["dı", "di", "du", "dü", "tı", "ti", "tu", "tü", "ydı", "ydi", "ydu", "ydü", "ymış", "ymiş", "ymuş", "ymüş"];
  const person = ["", "m", "n", "k", "nız", "niz", "nuz", "nüz", "lar", "ler"];
  const aus = new Set<string>();
  for (const st of stamm) for (const pe of person) aus.add(st + pe);
  for (const x of [
    "yım", "yim", "yum", "yüm", "sın", "sin", "sun", "sün", "yız", "yiz", "yuz", "yüz", "sınız", "siniz", "sunuz", "sünüz", "lar", "ler",
    "lı", "li", "lu", "lü", "lılar", "liler", "lılık", "lilik",
  ]) aus.add(x);
  return aus;
})();

function istTuerkischeEndung(endung: string): boolean {
  if (APOSTROPH_ENDUNGEN_TR.has(endung) || APOSTROPH_SCHWAENZE_TR.has(endung)) return true;
  for (let i = 1; i < endung.length; i++) {
    if (APOSTROPH_ENDUNGEN_TR.has(endung.slice(0, i)) && APOSTROPH_SCHWAENZE_TR.has(endung.slice(i))) return true;
  }
  return false;
}

/**
 * Ist `n` (schon normalisiert: türkisch klein, Apostroph bleibt) ein Eigenname mit Endung - ein Name mit mindestens zwei Buchstaben,
 * ein Apostroph, eine Endung aus {@link APOSTROPH_ENDUNGEN_TR}? Führende und schliessende Apostrophe (ein als Anführungszeichen
 * benutzter) fallen vorher weg: `'merhaba'` zählt wie `merhaba`. Rein, ohne Zustand - getestet in `tests/tastenflow-tr-lexikon.test.ts`.
 */
export function istApostrofFormTr(n: string, fach: ReadonlySet<string>): boolean {
  const kern = n.replace(/^'+/, "").replace(/'+$/, "");
  if (kern.length === 0) return false;
  if (!kern.includes("'")) return n !== kern && kern.length >= 2 && fach.has(kern);
  const teile = kern.split("'");
  if (teile.length !== 2) return false;
  const [name, endung] = teile;
  return name.length >= 2 && istTuerkischeEndung(endung);
}

/**
 * ★★★ F8-it (02.10.2026): Wortanfänge, die vor einem Vokal mit Apostroph stehen (Elision) - eine GESCHLOSSENE Liste:
 * Artikel und Präpositionsartikel (`l'`, `un'`, `dell'`, `all'`, `dall'`, `nell'`, `sull'`, `coll'`), Demonstrativa und
 * Adjektive (`quell'`, `quest'`, `bell'`, `sant'`, `buon'`, `nessun'`, `tutt'`, `nient'`, `mezz'`, `senz'`, `quant'`,
 * `anch'`, `com'`, `dov'`, `cos'`, `dev'`), Pronomen und Partikel (`c'`, `d'`, `s'`, `m'`, `t'`, `v'`, `n'`, `gl'`, `gliel'`)
 * und Zahlwörter vor `anni`/`ora` (`vent'`, `trent'` … `novant'`, `cent'`). Eine offene Regel („jeder Anfang + ' + Wort")
 * würde auch `xyz'amico` als Wort nehmen.
 */
const ELISION_ANFAENGE_IT: ReadonlySet<string> = new Set([
  "l", "un", "dell", "all", "dall", "nell", "sull", "coll", "quell", "quest", "bell", "sant", "buon", "nessun",
  "tutt", "nient", "mezz", "senz", "quant", "anch", "com", "dov", "cos", "dev", "c", "d", "s", "m", "t", "v", "n", "gl",
  "gliel", "glien", "cent", "vent", "trent", "quarant", "cinquant", "sessant", "settant", "ottant", "novant",
]);

/** Einbuchstabige Wörter, die hinter dem Apostroph stehen dürfen (`c'è`, `d'a`…): sie sind zu kurz für das Fach. */
const ELISION_EINBUCHSTABIG_IT: ReadonlySet<string> = new Set(["è", "e", "a", "o", "i"]);

/**
 * Ist `n` (schon normalisiert: klein, Apostroph bleibt) eine Elision aus bekanntem Anfang + Apostroph + echtem Wort?
 * Führende Apostrophe (ein als Anführungszeichen benutzter) und ein schliessender fallen vorher weg; `po'` steht
 * selbst im Fach. Rein, ohne Zustand - getestet in `tests/tastenflow-it-lexikon.test.ts`.
 */
export function istElisionIt(n: string, fach: ReadonlySet<string>): boolean {
  const kern = n.replace(/^'+/, "").replace(/'+$/, "");
  if (kern.length === 0) return false;
  // `ciao'` oder `'ciao'` (ein als Anführungszeichen benutzter Apostroph): das Wort ohne ihn zählt.
  if (!kern.includes("'")) return n !== kern && kern.length >= 2 && fach.has(kern);
  const teile = kern.split("'");
  const letztes = teile[teile.length - 1];
  if (letztes.length === 0) return false;
  if (letztes.length < 2 ? !ELISION_EINBUCHSTABIG_IT.has(letztes) : !fach.has(letztes)) return false;
  return teile.slice(0, -1).every((anfang) => ELISION_ANFAENGE_IT.has(anfang));
}

/**
 * ★ E9a (26.09.2026): Nachschlagen in einer ZUSATZLISTE (`WOERTER_FR` &
 * Co., `ladeWoerter`) - abwärtskompatibel zur alten Normalisierung.
 *
 * Vor dieser Änderung warf `normalizeWord(_, "fr")` den Bindestrich weg;
 * die schon erzeugten Listen `woerterFr.ts` (§13b-2/§13b-3, von Hand UND per
 * Skript gepflegt) führen Bindestrich-Wörter deshalb in der
 * ZUSAMMENGEZOGENEN Form („dixsept" für „dix-sept", „peutêtre" für
 * „peut-être" - siehe deren eigener Kopf-Kommentar). Jetzt bleibt der
 * Bindestrich stehen (Aufgabe 6), darum zuerst die NEUE, mit Bindestrich
 * normalisierte Form versuchen - und nur wenn die fehlt, zur alten,
 * zusammengezogenen Form zurückfallen. Neue Zusatzlisten dürfen den
 * Bindestrich künftig einfach mitschreiben; alte bleiben gültig, ohne dass
 * sie jemand nachträglich umschreiben müsste.
 */
export function inZusatzliste(
  zusatz: ReadonlySet<string> | undefined,
  token: string,
  lang?: Lang,
): boolean {
  if (!zusatz) return false;
  const n = normalizeWord(token, lang);
  if (zusatz.has(n)) return true;
  if (lang === "fr" && n.includes("-")) return zusatz.has(n.replace(/-/g, ""));
  return false;
}

/**
 * Alle Wörter, die das Lexikon kennt - als Liste.
 *
 * ★★★★ Gebaut am 02.09.2026 gegen genau die Falle, die uns schon mehrfach
 * erwischt hat: zwei Stellen, die dieselbe Frage getrennt beantworten
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]). Der
 * Buchstabensalat NAHM eine Eingabe über `isRealWord` an (7952 deutsche
 * Wörter), ZÄHLTE die möglichen Lösungen aber über eine eigene, viel engere
 * Liste (531 Wörter). Gemessen über alle 28 Quellwörter: gezählt 574,
 * angenommen 4783 - **Faktor 8,3**. Wer die Zahl las, bekam ein Spiel
 * angeboten, das viel kleiner aussah, als es ist.
 *
 * Die Liste ist der Cache selbst - nicht kopieren, nur lesen.
 */
export function lexikonWoerter(lang: Lang): readonly string[] {
  pruefePaket(lang, "lexikonWoerter");
  const l = lexika();
  // ★ F58 (29.10.2026): die neun Wege bekommen ihr eigenes Fach - vorher lieferte der letzte Zweig unten das FRANZÖSISCHE.
  if (istGeruestSprache(lang)) return [...l.neun[lang]];
  return [
    ...(lang === "de"
      ? l.de
      : lang === "en"
        ? l.en
        : lang === "es"
          ? l.es
          : lang === "it"
            ? l.it
            : lang === "pl"
              ? l.pl
              : lang === "tr"
                ? l.tr
                : lang === "cs"
                  ? l.cs
                  : l.fr),
  ];
}

/** Wie viele Wörter das Lexikon je Sprache kennt (Messskripte, Wächter-Test). */
export function lexikonGroesse(): {
  de: number;
  en: number;
  fr: number;
  es: number;
  it: number;
  pl: number;
  tr: number;
  cs: number;
  beide: number;
} {
  const l = lexika();
  return { de: l.de.size, en: l.en.size, fr: l.fr.size, es: l.es.size, it: l.it.size, pl: l.pl.size, tr: l.tr.size, cs: l.cs.size, beide: l.beide.size };
}
