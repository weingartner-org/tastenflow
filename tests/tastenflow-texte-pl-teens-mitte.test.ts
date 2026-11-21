/**
 * ★★★ Wächter PL-T5 (03.10.2026): die mittleren pl-Texte für Jugendliche
 * (`corpusPlWegMitteTeens.ts`, Sprossen 23-39 auf der Tastatur `pl`: ⇧ bis q).
 * Vorbilder: `tastenflow-texte-pl-kids-frueh.test.ts` (PL-T1) und
 * `tastenflow-texte-it-teens-mitte.test.ts` (IT-T5); Befund
 * `BEFUND-2026-10-02-PL-T5-TEENS-MITTE.md`, Leitfaden Fallen 26/31/37/45/48/51/58/61/67/76.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie mit
 * `introOrder("pl").slice(0, n)` durchlässt, mindestens aber die ⇧-Sprosse (Grossbuchstaben
 * sind vor ⇧ nur über die Auto-Grossschreibung tippbar; die Zeilen gehören zur ⇧-Stufe).
 * Besonderheiten des Polnischen: neun neue Buchstaben in dieser Strecke, acht davon AltGr-Griffe;
 * die GROSSEN polnischen Buchstaben (Ą Ć Ę Ł Ń Ó Ś Ź Ż, ein Dreiergriff) kommen erst mit `q`
 * (`grossAkzentAb`) - an Sprosse 39 zählt darum „q ODER ein grosser polnischer Buchstabe" als
 * neue Einheit. Kein Wörterbuch-Beleg (Falle 61): jedes Wort steht im Wortschatz oder ist von
 * Hand mit Begründung belegt, und jede Zeile mit einem „Ogonek-Zwilling" ist gelesen.
 * Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR, CORPUS_CS } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_PL_WEG_MITTE_TEENS } from "../src/lib/typing/corpusPlWegMitteTeens";
import { CORPUS_PL_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusPlWegFruehKids";
import { CORPUS_PL_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusPlWegFruehTeens";
import { CORPUS_PL as PL_ROH } from "../src/lib/typing/corpusPl";
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtPl, istKernGesperrtPl, ohneOgonki } from "../src/lib/typing/sperrlistePl";
import { WORDS_PL, STUFE_VOCAB_PL } from "../src/lib/typing/wordsPl";
import { NACHTRAG_PL, NACHTRAG_PL_ERGAENZT } from "../src/lib/typing/lexikonNachtragPl";
import { isRealWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/plTextRegeln";

afterEach(() => setLayout("de"));

const ZEILEN = CORPUS_PL_WEG_MITTE_TEENS.map((i) => i.text);
/** Die frühe Kinder-Charge PL-T1 - keine Kopie, kein Paar, kein gleicher Ledger-Schlüssel mit ihr (Befund PL-T1 §4). */
const KINDERZEILEN = CORPUS_PL_WEG_FRUEH_KIDS.map((i) => i.text);
/** Die frühe Jugend-Charge PL-T2 - dieselbe Stufe: das Wortbudget gilt über T2 + T5 zusammen (Falle 45). */
const FRUEHE_TEENS = CORPUS_PL_WEG_FRUEH_TEENS.map((i) => i.text);
/**
 * Alle ANDEREN pl-Chargen (T1, T2, T3, T4 und jede spätere) - aus der ROHEN Sammelliste `corpusPl.ts` (nach Objekt).
 * ★ Merge mit `feat/tastenflow` (03.10.2026): `CORPUS_PL` aus corpus.ts ist die GELADENE Liste nach `mergeCorpus`; dort
 * wäre eine Kopie schon still mit dem Original verschmolzen und fiele aus dem Vergleich. Genau das ist hier passiert:
 * drei T5-Zeilen waren wortgleich mit T4-Zeilen - erst der Anker („323 neu" statt 326) hat es gezeigt.
 */
const ANDERE_PL = () => PL_ROH.filter((i) => !CORPUS_PL_WEG_MITTE_TEENS.includes(i));
const ANDERE_PL_ZEILEN = ANDERE_PL().map((i) => i.text);
/** Punkt und Komma tragen keine eigene Zeile (weglassbar, D-1). */
const WEGLASSBAR = new Set([".", ","]);
/** Die grossen polnischen Buchstaben - erst ab `q` (`LernwegDef.grossAkzentAb`). */
const GROSS_PL = /[ĄĆĘŁŃÓŚŹŻ]/;

/** ⇧-Sprosse und letzte Sprosse (q) - aus der Reihenfolge gerechnet. */
function grenzen(): { shift: number; letzte: number; o: string[] } {
  setLayout("pl");
  const o = introOrder("pl");
  return { shift: o.indexOf(SHIFT_UNIT) + 1, letzte: o.indexOf("q") + 1, o };
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis q). Gemerkt: die Rechnung ist teuer. */
const SPROSSEN = new Map<string, number | null>();
function buchstabenSprosse(text: string): number | null {
  const gemerkt = SPROSSEN.get(text);
  if (gemerkt !== undefined) return gemerkt;
  const { letzte, o } = grenzen();
  let s: number | null = null;
  for (let n = 1; n <= letzte && s === null; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "pl"), "pl") !== null) s = n;
  }
  SPROSSEN.set(text, s);
  return s;
}

/** Die Sprosse der Zeile in dieser Charge: nie vor ⇧. */
function sprosseAuf(text: string): number | null {
  const s = buchstabenSprosse(text);
  return s === null ? null : Math.max(s, grenzen().shift);
}

/** Enthält der Text die Einheit? ⇧ zeigt sich an einem Grossbuchstaben; an `q` zählt auch ein grosser polnischer Buchstabe. */
function enthaeltEinheit(text: string, einheit: string): boolean {
  if (einheit === SHIFT_UNIT) return text !== text.toLowerCase();
  if (einheit === "q") return text.includes("q") || GROSS_PL.test(text);
  return text.toLowerCase().includes(einheit);
}

describe("PL-T5: jede Zeile an ihrer Sprosse (Tastatur pl)", () => {
  it("die Folge ab ⇧: 23-39 (⇧ . , ł b g ż ą ś ć h ó ń x ź v q) - gemessen, nicht geglaubt", () => {
    const { shift, letzte, o } = grenzen();
    expect(shift).toBe(23);
    expect(letzte).toBe(39);
    expect(o.slice(22, 39).join(" ")).toBe(`${SHIFT_UNIT} . , ł b g ż ą ś ć h ó ń x ź v q`);
  });

  it("jede Zeile hat eine Sprosse von ⇧ bis q, und minTier stimmt", () => {
    const { shift, letzte } = grenzen();
    const fehler: string[] = [];
    for (const item of CORPUS_PL_WEG_MITTE_TEENS) {
      const s = sprosseAuf(item.text);
      if (s === null || s < shift || s > letzte) fehler.push(`"${item.text}": Sprosse ${s}`);
      const tier = minTierFor(item.text, "pl");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * Eine ⇧-Zeile (Buchstaben bis u) passt über die Auto-Grossschreibung schon vor ⇧. Sie trägt darum ein `u` - die
   * letzte Einheit vor ⇧ - und rutscht so höchstens eine Sprosse vor (22), nie in die frühen Runden der Jugend-Charge T2.
   */
  it("keine Zeile rutscht über die Auto-Grossschreibung mehr als eine Sprosse vor ⇧", () => {
    const { shift } = grenzen();
    const fehler = ZEILEN.filter((t) => (buchstabenSprosse(t) ?? 0) < shift - 1);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die grossen polnischen Buchstaben stehen nur in Zeilen an q (39) - und dort kommen sie an", () => {
    const { letzte } = grenzen();
    const mit = ZEILEN.filter((t) => GROSS_PL.test(t));
    expect(mit.length).toBeGreaterThanOrEqual(10);
    expect(mit.filter((t) => sprosseAuf(t) !== letzte)).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet, eine ⇧-Zeile ohne u rutscht, Ł am Satzanfang erst an q", () => {
    expect(sprosseAuf("Ksawery kupuje nowe trampki.")).toBe(23);
    expect(buchstabenSprosse("Ksawery kupuje nowe trampki.")).toBe(22);
    expect(buchstabenSprosse("Kot jest na stole.")).toBe(13); // ohne u: rutscht weit vor ⇧
    expect(sprosseAuf("Olek zaspał na sprawdzian.")).toBe(26);
    expect(sprosseAuf("Lubię rap.")).toBe(27);
    expect(sprosseAuf("Ola idzie do sklepu, bo jest głodna.")).toBe(28); // g in „głodna"
    expect(sprosseAuf("To jest już koniec.")).toBe(29);
    expect(sprosseAuf("Wisła płynie przez Polskę.")).toBe(26);
    expect(sprosseAuf("Łódź jest duża.")).toBe(39);
    expect(sprosseAuf("Lodz jest duza.")).toBe(23); // ohne Ogonek ein anderer (falscher) Text - der Zwillings-Wächter unten
  });

  /**
   * GEMESSEN am Ende von PL-T5 (vom Code gezählt) - jede Grenze darf künftig nur STEIGEN. Am meisten an `ż`, `ą`, `ó`
   * (dort werden die häufigsten Wörter schreibbar), wenig an `ń` (unter Windows mit NVDA nicht tippbar, Falle 67) und an
   * den Fremdwort-Buchstaben `x`, `v`. Punkt und Komma tragen keine eigene Zeile (weglassbar).
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    23: 29, 26: 25, 27: 24, 28: 24, 29: 32, 30: 33, 31: 23, 32: 19, 33: 24, 34: 31, 35: 12, 36: 8, 37: 16, 38: 9, 39: 17,
  };

  it("je Sprosse mindestens so viele Zeilen wie gemessen; ż, ą und ó tragen am meisten, ń nicht mehr als 14", () => {
    const { shift, letzte, o } = grenzen();
    const anzahl = new Map<number, number>();
    for (const t of ZEILEN) {
      const s = sprosseAuf(t);
      if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (let n = shift; n <= letzte; n++) {
      if (WEGLASSBAR.has(o[n - 1])) continue;
      const soll = MINDESTENS_JE_SPROSSE[n] ?? 8;
      if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n} (${o[n - 1]}): ${anzahl.get(n) ?? 0} < ${soll}`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    const buchstaben = [...anzahl].filter(([n]) => n > shift).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => o[n - 1]);
    expect(new Set(buchstaben)).toEqual(new Set(["ż", "ą", "ó"]));
    expect(anzahl.get(o.indexOf("ń") + 1) ?? 0).toBeLessThanOrEqual(14);
  });
});

describe("PL-T5: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[]): string[] {
    const { o } = grenzen();
    return zeilen
      .filter((z) => !enthaeltEinheit(z.text, o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  it("jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse", () => {
    const zeilen = ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text) ?? 0 }));
    const fehler = ohneNeueEinheit(zeilen);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Einheit von ⇧ bis q (ohne . ,) hat an ihrer Sprosse Zeilen (W6)", () => {
    const { shift, letzte, o } = grenzen();
    const fehlt: string[] = [];
    for (let n = shift; n <= letzte; n++) {
      if (WEGLASSBAR.has(o[n - 1])) continue;
      const treffer = ZEILEN.filter((t) => sprosseAuf(t) === n && enthaeltEinheit(t, o[n - 1]));
      if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
    // An q tragen auch echte q-Wörter Zeilen (quiz, aquapark, squash), nicht nur die grossen Buchstaben.
    expect(ZEILEN.filter((t) => t.includes("q")).length).toBeGreaterThanOrEqual(5);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet, Grossbuchstabe gilt als ⇧, Ł gilt an q", () => {
    expect(enthaeltEinheit("Ola", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("ola", SHIFT_UNIT)).toBe(false);
    expect(enthaeltEinheit("Łódź słynie z murali.", "q")).toBe(true);
    expect(enthaeltEinheit("Lodz.", "q")).toBe(false);
    expect(ohneNeueEinheit([{ text: "Olek zaspał na sprawdzian.", sprosse: 27 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Olek zaspał na sprawdzian.", sprosse: 26 }])).toEqual([]);
  });
});

// ── Form: Satzanfang gross, Punkt am Ende, nur Zeichen bis q, Hausregeln ────

/** Buchstaben (auch die polnischen, klein und gross), Komma, Punkt, Leerzeichen. */
const ERLAUBTE_ZEICHEN = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ ,.]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) ||
  t[0] === t[0].toLowerCase() ||
  !t.endsWith(".") ||
  t !== t.trim() ||
  t.includes("  ") ||
  /[,.](?=\S)/.test(t) ||
  / [,.]/.test(t) ||
  /\. \p{Ll}/u.test(t);

describe("PL-T5: Form", () => {
  it("jede Zeile beginnt gross, endet mit Punkt, hat nur Buchstaben, Komma und Punkt", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kleinschreibung am Anfang, fehlender Punkt, ?, !, Anführung, Ziffer, Apostroph, Leerzeichen vor Komma", () => {
    for (const t of ["ola idzie.", "Ola idzie", "Idziesz?", "Gol!", 'Mówi "cześć".', "Mam 16 lat.", "Pismo Braille'a.", "Ola , Kuba."]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("Myślę, że to dobry pomysł.")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller polnischen Zeilen (`helfer/plTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg pl, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_PL_WEG_MITTE_TEENS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("pl");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Kein Geschlecht raten (Glossar §1 Nr. 2) ────────────────────────────────

/**
 * Die Vergangenheit und der Konditional der ersten und zweiten Person Einzahl verraten das Geschlecht der lesenden
 * Person (byłem/byłam, zrobiłeś/zrobiłaś, chciałbym/chciałabym). In dieser Charge stehen sie nie: die Vergangenheit
 * steht in der dritten Person mit Namen oder unpersönlich.
 */
const ICH_DU_VERGANGENHEIT = /\p{L}+(łem|łam|łeś|łaś|łbym|łabym|łbyś|łabyś)(?!\p{L})/u;
/** Wörter mit derselben Endung, die kein Verb sind (finałem = Instr. von finał). */
const KEIN_VERB: ReadonlySet<string> = new Set(["finałem"]);
const ichDuVergangenheit = (zeile: string): boolean =>
  woerter(zeile.toLowerCase()).some((w) => !KEIN_VERB.has(w) && ICH_DU_VERGANGENHEIT.test(w));

describe("PL-T5: kein Satz legt das Geschlecht der lesenden Person fest", () => {
  it("keine Vergangenheit oder kein Konditional in der ersten/zweiten Person Einzahl", () => {
    const fehler = ZEILEN.filter(ichDuVergangenheit);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: byłem, zrobiłaś, chciałbym werden gefunden, była und zrobili nicht", () => {
    for (const t of ["Wczoraj byłem w kinie.", "Zrobiłaś to.", "Chciałbym grać."]) expect(ichDuVergangenheit(t), t).toBe(true);
    for (const t of ["Ola była w kinie.", "Wszyscy zrobili zadanie.", "Właśnie zaczyna się przerwa.", "Przed finałem."]) expect(ichDuVergangenheit(t), t).toBe(false);
  });
});

// ── Orte und Namen: jedes Grosswort bekannt, Polen in seiner Breite ─────────

/**
 * Orte mit ihrer Woiwodschaft - als WORTFORM, wie sie in der Zeile steht (Polnisch beugt: „w Krakowie", „do Opola"),
 * und als Wortgruppe (längste zuerst). PL = ganz Polen (Meer, Flüsse, das Land), AUSLAND = Polonia und Nachbarn.
 */
const ORTE: Record<string, string> = {
  // dolnośląskie
  Sudety: "DS", Wrocławia: "DS", Wrocławiu: "DS", Legnicy: "DS", Karkonoszach: "DS", Wałbrzychu: "DS", Książ: "DS",
  Śnieżka: "DS", Karkonoszy: "DS",
  // kujawsko-pomorskie
  Kruszwicy: "KP", Torunia: "KP", Bydgoszczy: "KP", Biskupinie: "KP", Grudziądzu: "KP", Toruń: "KP",
  // lubelskie
  "Kazimierzu Dolnym": "LU", Kraśniku: "LU", Zamość: "LU", Lublinie: "LU",
  // lubuskie
  Gorzowie: "LB", Słubic: "LB", "Zieloną Górą": "LB", Gorzów: "LB", Łagów: "LB",
  // łódzkie
  Kutnie: "LD", Spale: "LD", Łódź: "LD", Łodzi: "LD", Piotrkowska: "LD", Łowiczu: "LD",
  // małopolskie
  Tatry: "MA", Wieliczce: "MA", Mariackiej: "MA", Zakopanem: "MA", Tarnów: "MA", Krakowie: "MA",
  // mazowieckie
  Warszawie: "MZ", Płocku: "MZ", Radomiu: "MZ", "Żelazowej Woli": "MZ",
  // opolskie
  Opolu: "OP", Nysy: "OP", Opola: "OP", Opole: "OP",
  // podkarpackie
  Bieszczady: "PK", Przemyśl: "PK", Przemyśla: "PK", Rzeszowie: "PK", Rzeszów: "PK", Łańcucie: "PK",
  // podlaskie
  Suwałki: "PD", Białymstoku: "PD", Białowieży: "PD", Kruszynianach: "PD", Biebrzą: "PD", Łomża: "PD", Narwią: "PD",
  // pomorskie
  Ustce: "PM", Słupsku: "PM", Gdyni: "PM", Kartuz: "PM", Gdańsku: "PM",
  // śląskie
  Cieszynie: "SL", Tychach: "SL", Rybnika: "SL", Zabrze: "SL", "Baraniej Górze": "SL", Śląsku: "SL",
  // świętokrzyskie
  Kielc: "SK", Chęcinach: "SK", Sandomierzu: "SK", Kielcach: "SK", Kielcami: "SK", Łysica: "SK", "Górach Świętokrzyskich": "SK",
  // warmińsko-mazurskie
  Mazury: "WN", Fromborku: "WN", Grunwaldem: "WN", Giżycku: "WN", "Kanale Elbląskim": "WN", Żywkowie: "WN",
  // wielkopolskie
  Leszna: "WP", Gniezno: "WP", Kaliszu: "WP", Poznaniu: "WP", Poznań: "WP", Gnieźnie: "WP",
  // zachodniopomorskie
  Szczecinie: "ZP", Koszalina: "ZP", Kołobrzegu: "ZP", Mielnie: "ZP", Szczecina: "ZP", Świnoujścia: "ZP",
  // ganz Polen: Meer, Flüsse, das Land
  Bałtyku: "PL", Odry: "PL", Wartą: "PL", Wisła: "PL", Polski: "PL", Polsce: "PL", Polska: "PL",
  // Ausland: Polonia und Nachbarn
  "Czeskim Cieszynie": "AUSLAND", Ukrainy: "AUSLAND", Ukrainą: "AUSLAND", Frankfurtu: "AUSLAND", Paryżu: "AUSLAND",
  Londynu: "AUSLAND", Tokio: "AUSLAND", Londynie: "AUSLAND", Niemczech: "AUSLAND", Szwecji: "AUSLAND", Wilna: "AUSLAND",
  Norwegii: "AUSLAND",
};
const WOIWODSCHAFTEN = ["DS", "KP", "LU", "LB", "LD", "MA", "MZ", "OP", "PK", "PD", "PM", "SL", "SK", "WN", "WP", "ZP"];

/** Menschen, Vereine, Feste, Werke, Marken, Abkürzungen - kein Ort. Nur Namen ohne grossen polnischen Buchstaben am Anfang (ausser an q). */
const NAMEN = new Set(
  (
    "Julia Mateusz Zuzanna Zuzanny Antek Antka Oliwia Kacper Laura Laury Wiktor Wiktora Wiktoria Natalia Natalii Ola Oli " +
    "Olek Olkiem Tymon Tymek Paulina Dawid Nikola Zofia Kasia Klara Filip Patryk Patryka Kornelia Ksawery Aleksandry " +
    "Mikołaj Kamil Piotr Weronika Adam Martyna Lena Leny Marcel Ania Kuba Igor Iga Igi Zosia Magda Gosia Marta Leon Maja " +
    "Daria Szymon Szymona Bruno Kuby Krystian Alex Antoni Daryna Max Felix Antonina Bartek Hubert Franek Pawła Joanna Mazur " +
    "Mateusz Michalski Mikołaj Kopernik Kopernika Fryderyk Chopin Aleksandra Kamińskiego Kamienie " +
    "Dzień Edukacji Narodowej Wielkanoc Wigilię Konkurs Chopinowski Piastach Górnikowi Carnaval Sztukmistrzów " +
    "Linuxa Xboxa Excelu VR"
  ).split(" "),
);

const woerter = (zeile: string): string[] => zeile.replace(/[,.]/g, "").split(" ");

/** Orte einer Zeile (längste Wortgruppe zuerst) und die Wortstellen, die sie bedecken. */
function orteIn(zeile: string): { raeume: Set<string>; bedeckt: Set<number> } {
  const w = woerter(zeile);
  const raeume = new Set<string>();
  const bedeckt = new Set<number>();
  for (let i = 0; i < w.length; i++) {
    for (const len of [3, 2, 1]) {
      const gruppe = w.slice(i, i + len).join(" ");
      if (i + len <= w.length && gruppe in ORTE) {
        raeume.add(ORTE[gruppe]);
        for (let k = i; k < i + len; k++) bedeckt.add(k);
        i += len - 1;
        break;
      }
    }
  }
  return { raeume, bedeckt };
}

/** Grossgeschriebene Wörter, die weder Satzanfang noch Teil eines Ortes noch ein Name sind. */
function unbekannteGrosswoerter(zeile: string): string[] {
  const { bedeckt } = orteIn(zeile);
  const roh = zeile.split(" ");
  return woerter(zeile).filter(
    (x, i) => x[0] !== x[0].toLowerCase() && !(i === 0 || roh[i - 1].endsWith(".")) && !bedeckt.has(i) && !NAMEN.has(x),
  );
}

function raumZahl(zeilen: string[]): Map<string, number> {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const r of orteIn(z).raeume) n.set(r, (n.get(r) ?? 0) + 1);
  return n;
}

describe("PL-T5: Orte aus ganz Polen - jede Woiwodschaft, keine vorne", () => {
  it("jedes grossgeschriebene Wort in der Zeile ist Satzanfang, Teil eines bekannten Ortes oder ein Name", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von PL-T5: jede der 16 Woiwodschaften in 5 oder 6 Zeilen (Johannes: Polen in seiner Breite, nicht
   * Warschau-zentriert; Auftrag: jede Region höchstens in rund 6 Zeilen). Dazu ganz Polen 9, Ausland 12.
   */
  it("jede der 16 Woiwodschaften steht in 5 bis 6 Zeilen; mindestens 90 Zeilen sind verortet", () => {
    const n = raumZahl(ZEILEN);
    const text = [...n].map(([r, k]) => `${r} ${k}`).join(" · ");
    for (const w of WOIWODSCHAFTEN) {
      expect(n.get(w) ?? 0, `${w}: ${text}`).toBeGreaterThanOrEqual(5);
      expect(n.get(w) ?? 0, `${w}: ${text}`).toBeLessThanOrEqual(6);
    }
    expect(ZEILEN.filter((z) => orteIn(z).raeume.size > 0).length, text).toBeGreaterThanOrEqual(90);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, Wortgruppen zählen richtig, ein Übergewicht fällt auf", () => {
    expect(unbekannteGrosswoerter("Marta mieszka w Atlantydzie.")).toEqual(["Atlantydzie"]);
    expect(unbekannteGrosswoerter("W Kazimierzu Dolnym jest pełno malarzy.")).toEqual([]);
    expect(orteIn("Łysica leży w Górach Świętokrzyskich.").raeume).toEqual(new Set(["SK"]));
    const n = raumZahl(Array.from({ length: 7 }, (_, i) => `W Warszawie ${"abcdefg"[i]}.`));
    expect((n.get("MZ") ?? 0) <= 6).toBe(false);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Wortbasis, Ogonek-Zwillinge ────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. */
const FUNKTIONSWOERTER = new Set(
  (
    "a i w we z ze na do od o po za nad pod przed przy dla jak to ten ta te tak nie się mi mnie ja ty on ona ono my wy " +
    "oni one jest są ma mam masz mamy czy co oraz lub ale no że już też by bo go mu jej ich nas nam was u"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(woerter(z).map((x) => x.toLowerCase()))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Der Wortschatz VOR dieser Charge (Übungswörter, Stufen-Wortschatz, Lexikon-Nachtrag aus Tatoeba ≥ 2 Belegen). */
const BASIS: ReadonlySet<string> = new Set([
  ...WORDS_PL,
  ...Object.values(STUFE_VOCAB_PL).flat(),
  ...NACHTRAG_PL,
  ...NACHTRAG_PL_ERGAENZT,
]);

/**
 * Wörter dieser Charge, die NICHT im Wortschatz standen (Tatoeba hat sie seltener als zweimal; ein Wörterbuch-Beleg
 * fehlt für Polnisch, Falle 61). Jedes ist eine gewöhnliche Form eines Standardworts oder ein gebräuchliches Lehnwort;
 * die Begründung steht daneben. Namen und Orte prüfen die Listen oben. Über den Korpus kommen die Wörter ins
 * Vorlese-Lexikon (die Stimme spricht sie ganz). ⚠️ Von keiner Person mit Polnisch als Erstsprache gelesen (Befund §5).
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  agroturystyczne: "Adj. zu agroturystyka, Nom. Sg. n. (gospodarstwo agroturystyczne)",
  obejrzymy: "1. Pl. Futur von obejrzeć",
  hali: "Lok. Sg. von hala (hala sportowa)",
  sportowej: "Adj. sportowy, Lok. Sg. f.",
  szachowy: "Adj. szachowy, Nom. Sg. m. (turniej szachowy)",
  krakowski: "Adj. zu Kraków, Nom. Sg. m. (klein: Adjektiv; gross nur am Satzanfang)",
  obwarzanek: "Nom. Sg. (Krakauer Hefekringel)",
  ulicznym: "Adj. uliczny, Lok. Sg. m.",
  apele: "Akk. Pl. von apel (Schulversammlung)",
  aquaparku: "Lok. Sg. von aquapark (Lehnwort, so geschrieben)",
  avatara: "Akk. Sg. von avatar (belebt gebeugt: -a)",
  basie: "Lok. Sg. von bas (grać na basie)",
  biwaku: "Lok. Sg. von biwak",
  bocianów: "Gen. Pl. von bocian",
  bramce: "Lok. Sg. von bramka (stać na bramce)",
  bursztynu: "Gen. Sg. von bursztyn",
  czacie: "Lok. Sg. von czat",
  czternastego: "Ordinalzahl, Gen. Sg. m. (Datum: czternastego października)",
  dawną: "Adj. dawny, Akk. Sg. f.",
  doradztwie: "Lok. Sg. von doradztwo (doradztwo zawodowe, Schulfach)",
  dyżur: "Nom./Akk. Sg. (Dienst in der Klasse)",
  dyżuru: "Gen. Sg. von dyżur",
  elektrykiem: "Instr. Sg. von elektryk (zostać elektrykiem)",
  filmowy: "Adj. zu film, Nom. Sg. m.",
  finałem: "Instr. Sg. von finał (przed finałem)",
  gastronomicznym: "Adj. gastronomiczny, Lok. Sg. n. (technikum gastronomiczne)",
  gimnastykę: "Akk. Sg. von gimnastyka",
  goglach: "Lok. Pl. von gogle (Pluraletantum)",
  golu: "Lok. Sg. von gol (po golu)",
  grabimy: "1. Pl. von grabić (liście)",
  grafiki: "Akk. Pl. von grafika",
  gwarą: "Instr. Sg. von gwara (mówić gwarą)",
  górali: "Gen. Pl. von góral (wielu górali)",
  gęślą: "Instr. Sg. von gęśl (Pangramm: zażółć gęślą jaźń)",
  harcerzami: "Instr. Pl. von harcerz (Pfadfinder)",
  hejcie: "Lok. Sg. von hejt (Jugendwort: Hass im Netz)",
  hejnał: "Nom./Akk. Sg. (Trompetensignal vom Marienturm)",
  hulajnogą: "Instr. Sg. von hulajnoga",
  informatyce: "Lok. Sg. von informatyka (Schulfach: na informatyce)",
  jaźń: "Nom./Akk. Sg. f. (Pangramm)",
  jeździectwo: "Nom./Akk. Sg. n. (Reitsport)",
  kajakarstwo: "Nom./Akk. Sg. n. (Kanusport)",
  kibicuje: "3. Sg. von kibicować",
  kiermasz: "Akk. Sg. (Basar)",
  kieszonkowe: "Akk. Sg. n., substantiviert (Taschengeld)",
  kiszonym: "Partizip/Adj. kiszony, Instr. Sg. m. (kiszony ogórek)",
  klasowej: "Adj. klasowy, Lok. Sg. f.",
  klawiaturę: "Akk. Sg. von klawiatura",
  klawiszowych: "Adj. klawiszowy, Gen. Pl. (skróty klawiszowe)",
  koleją: "Instr. Sg. von kolej (podróże koleją)",
  komunikator: "Akk. Sg. (Messenger-Programm)",
  konduktor: "Nom. Sg. (Zugbegleiter)",
  kopalnię: "Akk. Sg. von kopalnia",
  kosmosem: "Instr. Sg. von kosmos",
  kotach: "Lok. Pl. von kot",
  koziołków: "Gen. Pl. von koziołek (Poznańer Böckchen)",
  kraulem: "Instr. Sg. von kraul (pływać kraulem)",
  kryminalny: "Adj., Nom./Akk. Sg. m.",
  kręcono: "unpersönliche -no-Form von kręcić (Film drehen)",
  kurpiowskie: "Adj. zu Kurpie, Akk. Pl. (klein: Adjektiv)",
  kąpiemy: "1. Pl. von kąpać (się)",
  laptopie: "Lok. Sg. von laptop",
  level: "Akk. Sg. (Jugendwort aus Spielen, unflektiert)",
  logo: "Akk. Sg. n., unflektiert",
  losujemy: "1. Pl. von losować",
  matura: "Nom. Sg. (Abitur)",
  maturze: "Lok. Sg. von matura",
  maturę: "Akk. Sg. von matura",
  medale: "Akk. Pl. von medal",
  medyczna: "Adj. medyczny, Nom. Sg. f.",
  mikołajki: "Akk. Pl. (Nikolaustag, klein)",
  motocykle: "Akk. Pl. von motocykl",
  mural: "Akk. Sg. (Wandbild)",
  murali: "Gen. Pl. von mural",
  młodzieżowej: "Adj. młodzieżowy, Gen. Sg. f.",
  nagrywa: "3. Sg. von nagrywać",
  nakrycie: "Akk. Sg. n. (Gedeck)",
  nakręciła: "3. Sg. f. Prät. von nakręcić (Film)",
  namalowała: "3. Sg. f. Prät. von namalować",
  obchodzimy: "1. Pl. von obchodzić (Fest begehen)",
  odrabianiu: "Lok. Sg. des Verbalsubstantivs odrabianie (lekcji)",
  odtwarza: "3. Sg. von odtwarzać (odtwarza się bitwę)",
  ogólnopolski: "Adj., Akk. Sg. m. unbelebt",
  ogórkiem: "Instr. Sg. von ogórek",
  osadę: "Akk. Sg. von osada",
  osiedlu: "Lok. Sg. von osiedle",
  palimy: "1. Pl. von palić (ognisko)",
  paralimpijskich: "Adj. paralimpijski, Lok. Pl. (Schreibung des PKPar: igrzyska paralimpijskie)",
  patent: "Akk. Sg. (patent żeglarski: Segelschein)",
  perkusji: "Lok. Sg. von perkusja",
  perła: "Nom. Sg. (Perle)",
  pierników: "Gen. Pl. von piernik",
  planszowe: "Adj. planszowy, Akk. Pl. (gry planszowe)",
  plastyce: "Lok. Sg. von plastyka (Schulfach Kunst)",
  podcast: "Akk. Sg. (Lehnwort, so geschrieben)",
  podróżach: "Lok. Pl. von podróż",
  podstawówce: "Lok. Sg. von podstawówka (Grundschule, umgangssprachlich)",
  poloneza: "Akk. Sg. von polonez (Tanz, belebt gebeugt: tańczyć poloneza)",
  polonista: "Nom. Sg. (Polnischlehrer)",
  porcie: "Lok. Sg. von port",
  potrawą: "Instr. Sg. von potrawa",
  powiadomienia: "Gen. Sg. von powiadomienie (Benachrichtigung)",
  programować: "Infinitiv",
  projektujemy: "1. Pl. von projektować",
  promy: "Nom. Pl. von prom (Fähre)",
  przemierza: "3. Sg. von przemierzać (durchqueren)",
  przesuwamy: "1. Pl. von przesuwać (verschieben)",
  przytuliska: "Gen. Sg. von przytulisko (kleines Tierheim)",
  płyną: "3. Pl. von płynąć",
  quizie: "Lok. Sg. von quiz",
  rafinerii: "Lok. Sg. von rafineria",
  rajd: "Akk. Sg. (rajd rowerowy: Radtour)",
  raperki: "Gen. Sg. von raperka (Rapperin)",
  rapowych: "Adj. rapowy, Gen. Pl.",
  ratowniczka: "Nom. Sg. f. von ratownik (Rettungssanitäterin)",
  rekrutacji: "Gen. Sg. von rekrutacja (Aufnahmeverfahren ins Lyzeum)",
  remix: "Nom. Sg. (Lehnwort, so geschrieben)",
  renesansu: "Gen. Sg. von renesans",
  reprezentacji: "Lok. Sg. von reprezentacja (Schulauswahl)",
  robotyki: "Gen. Sg. von robotyka",
  rockowe: "Adj. rockowy, Nom. Pl. (piosenki rockowe)",
  rowerowa: "Adj. rowerowy, Nom. Sg. f.",
  rowerowy: "Adj. rowerowy, Akk. Sg. m. unbelebt",
  rozciągające: "Partizip/Adj. rozciągający, Akk. Pl. (ćwiczenia rozciągające)",
  ruskie: "Adj. ruski, Nom. Pl. (pierogi ruskie: aus Rotreussen, nicht russisch)",
  samorządu: "Gen. Sg. von samorząd (samorząd uczniowski)",
  segregujemy: "1. Pl. von segregować (Müll trennen)",
  seriale: "Akk. Pl. von serial",
  serialu: "Lok. Sg. von serial",
  siatkarki: "Nom. Pl. von siatkarka",
  siatkarze: "Nom. Pl. von siatkarz",
  siatkarzy: "Gen. Pl. von siatkarz",
  skatepark: "Akk. Sg. (Lehnwort, so geschrieben)",
  skateparku: "Lok. Sg. von skatepark",
  skrótów: "Gen. Pl. von skrót (skróty klawiszowe)",
  squasha: "Akk. Sg. von squash (grać w squasha)",
  stocznię: "Akk. Sg. von stocznia (Werft)",
  strażackiej: "Adj. strażacki, Gen. Sg. f.",
  studniówce: "Lok. Sg. von studniówka (Ball hundert Tage vor der Matura)",
  szaniec: "Akk. Sg. (Buchtitel Kamienie na szaniec)",
  szatni: "Lok. Sg. von szatnia (Garderobe)",
  szkolna: "Adj. szkolny, Nom. Sg. f.",
  słuchawek: "Gen. Pl. von słuchawki",
  tabelę: "Akk. Sg. von tabela",
  tablecie: "Lok. Sg. von tablet",
  technikum: "Lok. Sg. n., unflektiert im Sg. (Fachoberschule)",
  tenisistki: "Gen. Sg. von tenisistka",
  trampki: "Akk. Pl. (Turnschuhe)",
  trenują: "3. Pl. von trenować",
  trybunach: "Lok. Pl. von trybuna",
  trąbce: "Lok. Sg. von trąbka (grać na trąbce)",
  tłoczno: "Adverb (gedrängt voll)",
  uczniowskiego: "Adj. uczniowski, Gen. Sg. m.",
  utwory: "Akk. Pl. von utwór",
  vlog: "Nom. Sg. (Lehnwort, so geschrieben)",
  vloga: "Akk. Sg. von vlog (nagrywać vloga, wie bloga)",
  vloger: "Nom. Sg. (Lehnwort)",
  vlogi: "Akk. Pl. von vlog",
  warsztaty: "Akk. Pl. von warsztat (Workshop)",
  winorośle: "Nom. Pl. von winorośl",
  wstydziła: "3. Sg. f. Prät. von wstydzić się",
  wtorki: "Akk. Pl. von wtorek",
  wuefie: "Lok. Sg. von wuef (Sportunterricht, umgangssprachlich)",
  wuefy: "Akk. Pl. von wuef",
  wulkanach: "Lok. Pl. von wulkan",
  wychowawczej: "Adj. wychowawczy, Lok. Sg. f. (godzina wychowawcza)",
  wycina: "3. Sg. von wycinać",
  wymawiano: "unpersönliche -no-Form von wymawiać",
  wymienia: "3. Sg. von wymieniać (się) - Lautwechsel ó/o, ż/g, ch/sz",
  wyprowadza: "3. Sg. von wyprowadzać (psy na spacer)",
  wyrównany: "Partizip/Adj. wyrównany, Nom. Sg. m. (ausgeglichen)",
  wystawę: "Akk. Sg. von wystawa",
  wyśpię: "1. Sg. Futur von wyspać się",
  wzmacniacz: "Akk. Sg. (Verstärker)",
  wzwyż: "Adverb (skok wzwyż: Hochsprung)",
  zainstalował: "3. Sg. m. Prät. von zainstalować",
  zaprojektowała: "3. Sg. f. Prät. von zaprojektować",
  zażółć: "Imperativ 2. Sg. von zażółcić (Pangramm)",
  zdawać: "Infinitiv (maturę zdawać)",
  zjeżdżalnie: "Nom. Pl. von zjeżdżalnia (Rutsche)",
  zostawiamy: "1. Pl. von zostawiać",
  zwiedzamy: "1. Pl. von zwiedzać",
  zwiedziła: "3. Sg. f. Prät. von zwiedzić",
  ósmoklasisty: "Gen. Sg. von ósmoklasista (egzamin ósmoklasisty)",
  łańcuch: "Akk. Sg. (Kette)",
  świetlicy: "Lok. Sg. von świetlica (Schulhort)",
  żeglarski: "Adj., Akk. Sg. m. unbelebt (patent żeglarski)",
  żubra: "Akk. Sg. von żubr (belebt: -a)",
  żużla: "Gen. Sg. von żużel (Speedway)",
  żużlowcom: "Dat. Pl. von żużlowiec",
};

/** Buchstabenfolgen, die als NAMEN der Zeichen dastehen (ch, sz in der Rechtschreib-Zeile) - kein Wort, kein Fehler. */
const ZEICHENNAMEN: ReadonlySet<string> = new Set(["ch", "sz"]);

/** Ist dieses Wort (an Stelle i der Zeile) ein Name oder Teil eines Ortes? */
function istNameOderOrt(zeile: string, i: number): boolean {
  return orteIn(zeile).bedeckt.has(i) || NAMEN.has(woerter(zeile)[i]);
}

/** Wörter (ab zwei Buchstaben, klein), die weder im Wortschatz standen noch von Hand belegt noch Name/Ort sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    woerter(z).forEach((roh, i) => {
      const w = roh.toLowerCase();
      if (w.length < 2 || istNameOderOrt(z, i) || BASIS.has(w) || w in VON_HAND_BELEGT || ZEICHENNAMEN.has(w)) return;
      out.add(w);
    });
  }
  return [...out];
}

/**
 * „Ogonek-Zwillinge": Formen ohne Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist (pisze/piszę, klasa/klasą,
 * ze/że, zadania/żądania). Ein fehlender Ogonek ergäbe hier ein ANDERES Wort - und das Lexikon kennt auch Tippfehler-
 * Formen (Befund PL-T1 §4). Jede Zeile mit so einem Wort ist GELESEN (Befund §5): die geschriebene Form ist gemeint.
 */
const ZWILLINGE: ReadonlyMap<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const v of BASIS) {
    if (!/[ąćęłńóśźż]/.test(v)) continue;
    const k = ohneOgonki(v);
    if (k !== v) m.set(k, [...(m.get(k) ?? []), v]);
  }
  return m;
})();
const mitZwilling = (zeile: string): boolean => woerter(zeile).some((w) => ZWILLINGE.has(w.toLowerCase()));

const ZEILEN_MIT_ZWILLING_GELESEN: ReadonlySet<string> = new Set([
  "Wyraz który zawsze piszemy przez ó.",
  "Krakowski obwarzanek kupuje się na ulicznym wózku.",
  "Julia trenuje kajakarstwo w Szczecinie.",
  "Zuzanna pisze teksty piosenek.",
  "Kacper pisze z kumplem aplikacje na telefon.",
  "Latem Tymon pracuje w porcie w Ustce.",
  "Dawid interesuje się kosmosem.",
  "Olek z Koszalina pisze nam na czacie o turnieju.",
  "Siostra Patryka studiuje medycynę w Opolu.",
  "Ksawery kupuje nowe trampki.",
  "Mama Aleksandry pracuje jako ratowniczka medyczna.",
  "Mikołaj trenuje piłkę w klubie w Słupsku.",
  "Na koncert do Wrocławia jedzie cała klasa.",
  "Martyna namalowała mural przy szkole.",
  "Słowo spoko pasuje prawie wszędzie.",
  "Tata Wiktora pracuje w Płocku w rafinerii.",
  "Klasa Laury zwiedziła kopalnię soli w Wieliczce.",
  "W Kazimierzu Dolnym zawsze jest pełno malarzy.",
  "Suwałki to polski biegun zimna.",
  "Nasza szkoła ma nowe laboratorium.",
  "Na wycieczkę w Bieszczady zapisała się prawie cała klasa.",
  "Woda w Bałtyku była w lipcu bardzo zimna.",
  "W Białymstoku mieszka moja kuzynka.",
  "Jutro będzie lekcja w terenie.",
  "Babcia Laury piecze najlepszy sernik w okolicy.",
  "Ze Słubic do Frankfurtu idzie się przez most.",
  "Bruno gra na perkusji w piwnicy.",
  "Kacper gra wieczorami w gry planszowe.",
  "Zosia trenuje gimnastykę w klubie w Gorzowie.",
  "W grupie klasowej trwa dyskusja o wycieczce.",
  "Gramy w kosza na boisku przy szkole.",
  "Tymek gotuje dla całej rodziny w niedzielę.",
  "W wakacje Marta pracuje w kawiarni w Kołobrzegu.",
  "Nasza drużyna wygrała turniej w Radomiu.",
  "Mamy na weekend dużo zadania domowego.",
  "Maja mieszka na dużym osiedlu.",
  "Na Wielkanoc cała rodzina je żurek.",
  "Piszemy ż, gdy wymienia się na g, jak w odważny i odwaga.",
  "W piątek pociąg do Szczecina jest zawsze pełny.",
  "Wieczorem cała rodzina ogląda mecz siatkarzy.",
  "Rozwiązanie tego zadania zajęło nam godzinę.",
  "W szkole przez godzinę nie było prądu.",
  "Antek pisze lewą ręką.",
  "Dziś mamy tylko cztery lekcje.",
  "Kasia zawsze ma coś do powiedzenia.",
  "W wakacje nikt nie wstaje wcześnie.",
  "Moja ciocia uczy w szkole w Kraśniku.",
  "Fajnie byłoby mieć w szkole basen.",
  "Krystian planuje zostać elektrykiem.",
  "Po maturze Natalia planuje studiować w Poznaniu.",
  "W Tychach Patryk trenuje hokej.",
  "W słowach mucha i musze ch przechodzi w sz.",
  "Mój brat gra w zespole rockowym.",
  "Babcia Igi z Kartuz mówi po kaszubsku.",
  "Egzamin ósmoklasisty pisze się w maju.",
  "Podróż nocnym pociągiem do Przemyśla to przygoda.",
  "Lekcje zaczynamy o ósmej.",
  "Mama Szymona wróci z dyżuru w szpitalu rano.",
  "Dzień sportu w naszej szkole trwa do wieczora.",
  "Max gra w zespole na basie.",
  "Weź ze sobą ładowarkę.",
  "Antonina trenuje jeździectwo pod Kielcami.",
  "W quizie wiedzy o Polsce nasza drużyna zajęła drugie miejsce.",
  "W Łodzi ulica Piotrkowska ma ponad cztery kilometry.",
  "Ze Świnoujścia płyną promy do Szwecji.",
  "Dziadek Zuzanny też pisze wiersze.",
  "Klasa zbiera karmę dla bezdomnych zwierząt.",
  "W mieście powstaje nowa ścieżka rowerowa.",
  "Olek planuje zdawać maturę z informatyki.",
  "Biblioteka szkolna jest otwarta do szesnastej.",
  "Tata Leny wrócił po latach pracy w Norwegii.",
]);

describe("PL-T5: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (gemessen: höchstens 6)", () => {
    expect(zuHaeufig(ZEILEN)).toEqual([]);
    expect(zuHaeufig(ZEILEN, 6)).toEqual([]);
  });

  /**
   * ★ Merge 03.10.2026 (Falle 45: das Budget gilt je STUFE): über beide Jugend-Chargen (PL-T2 früh + PL-T5 Mitte)
   * steht kein Inhaltswort in mehr als 8 Zeilen (gemessen beim Merge: höchstens 7, „wakacje"; „razem" von 8 auf 6 gesenkt).
   */
  it("auch über beide Jugend-Chargen (T2 + T5) steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    expect(FRUEHE_TEENS.length).toBeGreaterThan(100);
    const fehler = zuHaeufig([...FRUEHE_TEENS, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross am Satzanfang), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Trener" : "Nasz trener"} jest ${"abcdefghi"[i]}.`);
    expect(zuHaeufig(neun)).toEqual(['"trener": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => woerter(t).filter((w) => gesperrtPl(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), tłusty und Boże (Wortbasis) werden gefunden, tłusto-freies pączki und Bóbr nicht", () => {
    expect(istKernGesperrtPl("Kurwa")).toBe(true);
    expect(gesperrtPl("tłusty")).toBe(true); // „W tłusty czwartek" ginge nicht (gesperrte Wortbasis)
    expect(gesperrtPl("Boże")).toBe(true); // darum „W Wigilię", nicht „Boże Narodzenie"
    expect(gesperrtPl("pączki")).toBe(false);
    expect(gesperrtPl("Bóbr")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder ist von Hand belegt (Namen und Orte: Listen oben)", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Liste trägt nur, was wirklich gebraucht wird und nicht ohnehin bekannt ist (sonst wächst sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => woerter(z).map((w) => w.toLowerCase())));
    expect(Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w))).toEqual([]);
    expect([...ZEICHENNAMEN].filter((w) => !benutzt.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine Form ohne Ogonek, die es so nicht gibt, werden gemeldet", () => {
    expect(ungeprueft(["Ola lubi plaxe.", "Kasia mowi po polsku."])).toEqual(["plaxe", "mowi"]);
    expect(ungeprueft(["Olek z Koszalina pisze."])).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge ausser den Zeichennamen (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) =>
      woerter(z).some((w) => w.length >= 2 && !ZEICHENNAMEN.has(w.toLowerCase()) && !isRealWord(w, "pl")),
    );
    expect(buchstabiert).toEqual([]);
  });

  it("jede Zeile mit einem Ogonek-Zwilling ist gelesen (pisze/piszę, klasa/klasą, ze/że) - und nur diese", () => {
    const mit = ZEILEN.filter(mitZwilling);
    expect(mit.filter((z) => !ZEILEN_MIT_ZWILLING_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_ZWILLING_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Kasia napisala, ze jest w drodze.“ hat Zwillinge (ze/że), „Ola idzie do kina.“ nicht", () => {
    expect(mitZwilling("Kasia napisala, ze jest w drodze.")).toBe(true);
    expect(ZWILLINGE.get("ze")).toContain("że");
    expect(mitZwilling("Ola idzie do kina.")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl grob gleichgesetzt: „ona była …" / „on był …", „kot" / „koty" (Endvokal weg, jedes Wort mit „_"). */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", one: "PRO" };
  return woerter(zeile.toLowerCase())
    .map((w) => pron[w] ?? w.replace(/[aeiouyąę]?$/, "_"))
    .join(" ");
}

/** Paare unter `zeilen` und zwischen `zeilen` und den Vergleichszeilen `gegen`. */
function paare(zeilen: string[], gegen: string[] = []): string[] {
  const gesehen = new Map<string, string>();
  for (const z of gegen) gesehen.set(paarForm(z), `früher: ${z}`);
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_TR, ...CORPUS_CS];
/** Klein, ohne Satz- und Sonderzeichen: so kollidiert „Idę do kina." mit „idę do kina". */
const ohneSatzzeichen = (t: string): string => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();

/** Zeilen, die einer Vergleichszeile gleichen - als Text (ohne Satzzeichen, klein) oder als Ledger-Schlüssel. */
function kopienGegen(zeilen: string[], gegen: string[]): string[] {
  const texte = new Set(gegen.map(ohneSatzzeichen));
  const schluessel = new Set(gegen.map((t) => bausteinKey("satz", t)));
  return zeilen.filter((t) => texte.has(ohneSatzzeichen(t)) || schluessel.has(bausteinKey("satz", t)));
}

/** Die Texte der Tippchallenge-Banken aller Wege (Sfida, Reto, Défi …): jede Datei `schreibproben/texte*.ts`. */
const BANKEN = import.meta.glob("../src/lib/typing/schreibproben/texte*.ts", { eager: true }) as Record<string, Record<string, unknown>>;
function bankZeilen(): string[] {
  const out: string[] = [];
  for (const modul of Object.values(BANKEN)) {
    for (const wert of Object.values(modul)) {
      if (!Array.isArray(wert)) continue;
      for (const t of wert) {
        const zeilen = (t as { zeilen?: unknown }).zeilen;
        if (Array.isArray(zeilen)) for (const z of zeilen) if (typeof z === "string") out.push(z);
      }
    }
  }
  return out;
}
/** Alles, was sonst Text trägt: alle Korpora, alle Serien, alle Prüfungstext-Banken - Zeile für Zeile und Satz für Satz. */
function alleFremdenZeilen(): string[] {
  const roh = [
    ...FREMDE_KORPORA().map((i) => i.text),
    ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ...bankZeilen(),
  ];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}

const wortMenge = (t: string): Set<string> => new Set(ohneSatzzeichen(t).split(" ").filter(Boolean));
function jaccard(a: Set<string>, b: Set<string>): number {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s);
}
/**
 * „Fast gleich" (Falle 31/51, Muster PL-T3): zwei Zeilen teilen einen grossen Teil ihrer Wörter (Jaccard der Wortmengen).
 * Gegen die eigene Charge und jede andere pl-Zeile ab 0,5, gegen alles andere (Korpora, Serien, Banken) ab 0,6.
 */
function fastGleich(zeilen: string[], gegen: string[], grenze: number): string[] {
  const out: string[] = [];
  const mengen = gegen.map((g) => [g, wortMenge(g)] as const);
  for (const z of zeilen) {
    const a = wortMenge(z);
    for (const [g, b] of mengen) if (g !== z && jaccard(a, b) >= grenze) out.push(`"${z}" ~ "${g}"`);
  }
  return out;
}

describe("PL-T5: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der die neun polnischen Buchstaben NICHT kennt)", () => {
    expect(new Set(ZEILEN.map(ohneSatzzeichen)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("die Vergleichsmengen sind voll: T1-T4 in der rohen Sammelliste, tr/cs-Korpus, Serien und Banken (auch die it-Sfida)", () => {
    expect(ANDERE_PL_ZEILEN.length).toBeGreaterThanOrEqual(164 + 151 + 167 + 326);
    expect(CORPUS_TR.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(Object.keys(BANKEN).some((p) => /It[AB]?\.ts$/.test(p))).toBe(true);
  });

  it("keine Zeile gleicht einer Zeile oder einem Satz der Korpora, Serien und Banken aller Wege (Text oder Ledger-Schlüssel)", () => {
    expect(kopienGegen(ZEILEN, alleFremdenZeilen())).toEqual([]);
  });

  it("keine Zeile gleicht einer anderen pl-Charge (ROHE Sammelliste T1-T4 …), kein Paar", () => {
    expect(kopienGegen(ZEILEN, ANDERE_PL_ZEILEN)).toEqual([]);
    const fehler = paare(ZEILEN, ANDERE_PL_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich: gegen die eigene Charge und jede pl-Zeile (Jaccard ≥ 0,5), gegen alles andere (≥ 0,6)", () => {
    const fehler = [...fastGleich(ZEILEN, [...ZEILEN, ...ANDERE_PL_ZEILEN], 0.5), ...fastGleich(ZEILEN, alleFremdenZeilen(), 0.6)];
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: die beim Merge ersetzten Zeilen wären Kopie bzw. fast gleich mit PL-T4", () => {
    expect(kopienGegen(["Na Helu jest fokarium.", "We wtorek mamy próbę chóru."], ANDERE_PL_ZEILEN)).toHaveLength(2);
    expect(fastGleich(["W słowie stół piszemy ó, bo w stoły jest o."], ANDERE_PL_ZEILEN, 0.5)).not.toEqual([]);
    expect(fastGleich(["W ostatni czwartek karnawału każdy je pączki."], ANDERE_PL_ZEILEN, 0.5)).not.toEqual([]);
    expect(fastGleich(["Kuba robi zdjęcia."], ["Ola pisze list."], 0.5)).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung), und der Zuwachs ist die Zeilenzahl", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_PL()].map((i) => bausteinId(i.kind, i.text)));
    expect(CORPUS_PL_WEG_MITTE_TEENS.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    const eigeneIds = CORPUS_PL_WEG_MITTE_TEENS.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(eigeneIds).size).toBe(ZEILEN.length);
    // Anker nur anhängend: die IDs dieser Charge stehen als geschlossener Block im Anker, keine davor (am Merge gemessen:
    // 15.606 ⇒ 15.932, „326 neu").
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(KORPUS_ANKER.slice(start, start + ZEILEN.length)).toEqual(eigeneIds);
    const eigen = new Set(eigeneIds);
    expect(KORPUS_ANKER.slice(0, start).filter((id) => eigen.has(id))).toEqual([]);
  });

  it("Gegenprobe: eine T1-Zeile gross und mit Punkt ist Kopie UND Paar; ę fällt im Ledger-Schlüssel weg; Ola/Olek-Paar", () => {
    expect(KINDERZEILEN).toContain("idę do kina");
    expect(paare(["Idę do kina."], KINDERZEILEN)).toHaveLength(1);
    expect(ANDERE_PL_ZEILEN.map((t) => bausteinKey("satz", t))).toContain(bausteinKey("satz", "Idę do kina."));
    expect(bausteinKey("satz", "Już jest.")).toBe(bausteinKey("satz", "ju jest"));
    expect(paare(["Ona była w kinie.", "On był w kinie."])).toHaveLength(1);
    expect(paare(["Ola jest w kinie.", "Ola jest w domu."])).toEqual([]);
  });
});

describe("PL-T5: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt diese Charge als geschlossenen Block hinter T1, T2, T3 und T4", () => {
    const start = PL_ROH.indexOf(CORPUS_PL_WEG_MITTE_TEENS[0]);
    expect(start).toBeGreaterThanOrEqual(164 + 151 + 167 + 326);
    expect(PL_ROH.slice(start, start + ZEILEN.length)).toEqual(CORPUS_PL_WEG_MITTE_TEENS);
    expect(PL_ROH.slice(0, start).every((i) => !CORPUS_PL_WEG_MITTE_TEENS.includes(i))).toBe(true);
  });

  it("korpusFuer(\"pl\") trägt jede Zeile (nichts von `mergeCorpus` still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("pl").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_PL_WEG_MITTE_TEENS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe pl t5.", kind: "satz" as const, stufen: ["teens" as const] };
    const ids = manifestFor([
      ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe,
    ]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „pl“ bekommt für Jugendliche an q jede Zeile vollständig - und nur eigene pl-Jugendzeilen", () => {
    const { letzte, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, letzte), "pl");
    const geliefert = corpusItemsFor({ stufe: "teens", allowed, lang: "pl", lernweg: "pl" });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    const eigeneJugend = new Set(
      CORPUS_PL.filter((i) => i.nurWeg === "pl" && i.stufen.includes("teens")).map((i) => fitText(i.text, allowed, "pl")),
    );
    expect(geliefert.filter((t) => !eigeneJugend.has(t))).toEqual([]);
  });

  it("eine Sprosse vor ⇧ kommen von dieser Charge nur ⇧-Zeilen an (servierte Fassung, ohne Punkt), zwei davor keine", () => {
    const { shift, o } = grenzen();
    const vor = allowedFromIntroduced(o.slice(0, shift - 1), "pl");
    const serviert = new Map(ZEILEN.map((t) => [fitText(t, vor, "pl"), t] as const).filter(([s]) => s !== null));
    const davor = corpusItemsFor({ stufe: "teens", allowed: vor, lang: "pl", lernweg: "pl" });
    const vonHier = davor.filter((t) => serviert.has(t));
    expect(vonHier.length).toBeGreaterThan(0);
    expect(vonHier.filter((t) => /[.,]/.test(t) || !t.toLowerCase().includes("u"))).toEqual([]);
    expect(vonHier.map((t) => sprosseAuf(serviert.get(t) as string)).filter((s) => s !== shift)).toEqual([]);
    const zweiDavor = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(o.slice(0, shift - 2), "pl"), lang: "pl", lernweg: "pl" });
    const eigeneKlein = new Set(ZEILEN.map((t) => ohneSatzzeichen(t)));
    expect(zweiDavor.filter((t) => eigeneKlein.has(t.toLowerCase()))).toEqual([]);
  });

  it("Kinder, Erwachsene und die Wege „de“/„it“ bekommen keine dieser Zeilen", () => {
    const { o } = grenzen();
    const alle = allowedFromIntroduced(o, "pl");
    for (const stufe of ["kids", "erwachsen"] as const) {
      const g = corpusItemsFor({ stufe, allowed: alle, lang: "pl", lernweg: "pl" });
      expect(ZEILEN.filter((t) => g.includes(t)), stufe).toEqual([]);
    }
    setLayout("de");
    const de = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
