/**
 * ★★★ Wächter PL-T4 (03.10.2026): die mittleren pl-Texte für Kinder
 * (`corpusPlWegMitteKids.ts`, Sprossen 23-39 auf der Tastatur `pl` = ⇧ bis q).
 * Vorbilder: `tastenflow-texte-pl-kids-frueh.test.ts` (PL-T1) und
 * `tastenflow-texte-it-kids-mitte.test.ts` (IT-T4); Befund
 * `BEFUND-2026-10-02-PL-T4-KIDS-MITTE.md`, Leitfaden Fallen 26/31/37/45/48/51/58/61/67/76.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie mit
 * `introOrder("pl").slice(0, n)` durchlässt, mindestens aber ⇧ (23) - Grossbuchstaben
 * und `. ,` sind vorher nur über die Auto-Grossschreibung tippbar. Besonderheiten gegenüber
 * Italienisch: acht der neun polnischen Buchstaben sind AltGr-Griffe, die GROSSEN polnischen
 * Buchstaben (Ą Ć Ę Ł Ń Ó Ś Ź Ż) serviert der Weg erst ab `q` (39), es gibt KEINEN
 * Wörterbuch-Beleg (Falle 61) - jedes Wort steht im Wortschatz oder in einer Liste mit
 * Begründung -, und der Ledger-Schlüssel kennt die neun Buchstaben nicht. Jede Regel hat eine
 * Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR, CORPUS_CS } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_PL_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusPlWegFruehKids";
import { CORPUS_PL_WEG_MITTE_KIDS } from "../src/lib/typing/corpusPlWegMitteKids";
import { CORPUS_PL as PL_ROH } from "../src/lib/typing/corpusPl";
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { adaptiveRound } from "../src/lib/typing/generator";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtPl, istKernGesperrtPl, ohneOgonki } from "../src/lib/typing/sperrlistePl";
import { WORDS_PL, STUFE_VOCAB_PL } from "../src/lib/typing/wordsPl";
import { NACHTRAG_PL, NACHTRAG_PL_ERGAENZT } from "../src/lib/typing/lexikonNachtragPl";
import { isRealWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/plTextRegeln";

afterEach(() => setLayout("de"));

const ZEILEN = CORPUS_PL_WEG_MITTE_KIDS.map((i) => i.text);
const T1 = CORPUS_PL_WEG_FRUEH_KIDS.map((i) => i.text);
/**
 * Die anderen pl-Chargen, gegen die Kopien (Text und Ledger-Schlüssel) und Paare geprüft werden (Falle 31, 51).
 * ★ Merge mit `feat/tastenflow` (03.10.2026, nach PL-T2 und PL-T3): verglichen wird mit der ROHEN Sammelliste aus
 * `corpusPl.ts` (die Datenblätter, nach Objekt) - jede Charge ausser dieser, also T1, T2, T3 und jede spätere.
 * `CORPUS_PL` aus corpus.ts ist die GELADENE Liste nach `mergeCorpus`; dort wäre eine Kopie schon still mit dem Original
 * verschmolzen und fiele als „eigene Zeile" aus dem Vergleich (die Lehre aus PL-T3: neun wortgleiche T2-Zeilen fand erst
 * der Anker).
 */
const ANDERE_PL = () => PL_ROH.filter((i) => !CORPUS_PL_WEG_MITTE_KIDS.includes(i));
const ANDERE_PL_ZEILEN = ANDERE_PL().map((i) => i.text);
/** Die letzte Buchstaben-Einheit der Charge (danach kommen `? ! - " : ( ) '`). */
const LETZTE = "q";
/** Frühestens hier kommt eine Zeile über die Auto-Grossschreibung an (r p u sind 20-22): nie in die frühen Runden von PL-T1. */
const FRUEHESTE_BUCHSTABEN_SPROSSE = 20;

function grenzen(): { shift: number; letzte: number; o: string[] } {
  setLayout("pl");
  const o = introOrder("pl");
  return { shift: o.indexOf(SHIFT_UNIT) + 1, letzte: o.indexOf(LETZTE) + 1, o };
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis q). */
function buchstabenSprosse(text: string): number | null {
  const { letzte, o } = grenzen();
  for (let n = 1; n <= letzte; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "pl"), "pl") !== null) return n;
  }
  return null;
}

/** Die Sprosse der Zeile in dieser Charge: nie vor ⇧. */
function sprosseAuf(text: string): number | null {
  const s = buchstabenSprosse(text);
  return s === null ? null : Math.max(s, grenzen().shift);
}

/** Enthält der Text die Einheit? ⇧ zeigt sich an einem Grossbuchstaben. */
function enthaeltEinheit(text: string, einheit: string): boolean {
  if (einheit === SHIFT_UNIT) return text !== text.toLowerCase();
  return text.toLowerCase().includes(einheit);
}

/** Satzzeichen nach ⇧ (D-1): weglassbar, darum beginnt dort keine eigene Zeile. */
const WEGLASSBAR = new Set([".", ","]);

describe("PL-T4: jede Zeile an ihrer Sprosse (Tastatur pl)", () => {
  it("die Folge 23-39: ⇧ . , ł b g ż ą ś ć h ó ń x ź v q", () => {
    const { shift, letzte, o } = grenzen();
    expect(shift).toBe(23);
    expect(letzte).toBe(39);
    expect(o.slice(22, 39).join(" ")).toBe(`${SHIFT_UNIT} . , ł b g ż ą ś ć h ó ń x ź v q`);
  });

  it("jede Zeile hat eine Sprosse von ⇧ bis q, und minTier stimmt", () => {
    const { shift, letzte } = grenzen();
    const fehler: string[] = [];
    for (const item of CORPUS_PL_WEG_MITTE_KIDS) {
      const s = sprosseAuf(item.text);
      if (s === null || s < shift || s > letzte) fehler.push(`"${item.text}": Sprosse ${s}`);
      const tier = minTierFor(item.text, "pl");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * Eine ⇧-Zeile aus Buchstaben bis `u` passt über die Auto-Grossschreibung schon vor ⇧ („Ala ma kota." kommt an
   * Sprosse 15 als „Ala ma kota"). Jede Zeile trägt darum ein `r`, `p` oder `u` (oder einen späteren Buchstaben) - so
   * kommt sie frühestens in den letzten drei Runden vor ⇧ an, nie in die frühen Runden von PL-T1.
   */
  it(`keine Zeile rutscht über die Auto-Grossschreibung vor Sprosse ${FRUEHESTE_BUCHSTABEN_SPROSSE}`, () => {
    const fehler = ZEILEN.filter((t) => (buchstabenSprosse(t) ?? 0) < FRUEHESTE_BUCHSTABEN_SPROSSE);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet", () => {
    expect(buchstabenSprosse("Ala ma kota.")).toBe(15); // Grossbuchstabe und Punkt fallen vorher weg
    expect(sprosseAuf("Ala ma kota.")).toBe(23);
    expect(sprosseAuf("Ala ma kota, a Ola ma psa.")).toBe(23);
    expect(buchstabenSprosse("Ala ma kota, a Ola ma psa.")).toBe(21);
    expect(sprosseAuf("Ola była w kinie.")).toBe(27); // był braucht b - die Vergangenheit von być kommt erst mit b
    expect(sprosseAuf("Mały kot.")).toBe(26);
    expect(sprosseAuf("Że tak.")).toBe(39); // grosses Ż am Satzanfang: erst mit q (grossAkzentAb)
    expect(sprosseAuf("Tak, że tak.")).toBe(29);
    expect(sprosseAuf("W Łodzi.")).toBe(39); // auch mitten im Satz
    expect(sprosseAuf("Dzień dobry.")).toBe(35);
    expect(sprosseAuf("Jest późno.")).toBe(37);
    expect(sprosseAuf("Latem chodzimy do aquaparku.")).toBe(39);
    // ? und ! kommen erst nach q - vorher lässt `fitText` sie weg; die Form-Regel unten hält sie aus dieser Charge.
    expect(sprosseAuf("Jak tak?")).toBe(23);
  });

  /** GEMESSEN am Ende von PL-T4 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    23: 31, 26: 25, 27: 28, 28: 27, 29: 30, 30: 38, 31: 25, 32: 27, 33: 27, 34: 29, 35: 9, 36: 6, 37: 14, 38: 5, 39: 5,
  };

  it("je Sprosse mindestens so viele Zeilen wie gemessen (. und , ohne eigene Zeile)", () => {
    const { shift, letzte, o } = grenzen();
    const anzahl = new Map<number, number>();
    for (const t of ZEILEN) {
      const s = sprosseAuf(t);
      if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (let n = shift; n <= letzte; n++) {
      if (WEGLASSBAR.has(o[n - 1])) continue;
      const soll = MINDESTENS_JE_SPROSSE[n] ?? 5;
      if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n} (${o[n - 1]}): ${anzahl.get(n) ?? 0} < ${soll}`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
  });

  it("an ż, ą und ó stehen mehr Zeilen als an ś, ć, h (die häufigsten Wörter), an ń höchstens 10 (Falle 67)", () => {
    const n = (einheit: string) => ZEILEN.filter((t) => sprosseAuf(t) === grenzen().o.indexOf(einheit) + 1).length;
    for (const viel of ["ż", "ą", "ó"]) expect(n(viel), viel).toBeGreaterThanOrEqual(n("ś"));
    expect(n("ą")).toBeGreaterThanOrEqual(35);
    expect(n("ń")).toBeLessThanOrEqual(10);
    expect(n("ń")).toBeGreaterThanOrEqual(5);
  });
});

describe("PL-T4: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[]): string[] {
    const { o } = grenzen();
    return zeilen
      .filter((z) => !enthaeltEinheit(z.text, o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  it("jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse", () => {
    const fehler = ohneNeueEinheit(ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text) ?? 0 })));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Einheit von ⇧ bis q (ausser . und ,) hat an ihrer Sprosse Zeilen (W6)", () => {
    const { shift, letzte, o } = grenzen();
    const fehlt: string[] = [];
    for (let n = shift; n <= letzte; n++) {
      if (WEGLASSBAR.has(o[n - 1])) continue;
      if (!ZEILEN.some((t) => sprosseAuf(t) === n && enthaeltEinheit(t, o[n - 1]))) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet, Grossbuchstabe gilt als ⇧", () => {
    expect(enthaeltEinheit("Ola ma psa.", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("ola ma psa.", SHIFT_UNIT)).toBe(false);
    expect(ohneNeueEinheit([{ text: "Mały kot.", sprosse: 27 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Mały kot.", sprosse: 26 }])).toEqual([]);
  });

  it("in echten Runden (Mein Training, Fokus ł, Kinder) kommen Korpuszeilen dieser Charge mit ł an", () => {
    const { o } = grenzen();
    const intro = o.slice(0, o.indexOf("ł") + 1);
    const echt = Math.random;
    let s = 2604;
    const texte: string[] = [];
    try {
      for (let r = 0; r < 10; r++) {
        let a = s++ >>> 0;
        Math.random = () => {
          a = (a + 0x6d2b79f5) | 0;
          let t = Math.imul(a ^ (a >>> 15), 1 | a);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        for (const z of adaptiveRound({ introduced: intro, focus: ["ł"], stufe: "kids", lang: "pl", lernweg: "pl", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    const eigene = new Set(ZEILEN.flatMap((t) => [t, fitText(t, allowedFromIntroduced(intro, "pl"), "pl") ?? t]));
    expect(texte.some((t) => eigene.has(t) && t.includes("ł")), texte.slice(0, 12).join(" / ")).toBe(true);
  });
});

// ── Form: Satzanfang gross, nur Punkt und Komma, Regeln des Weges ───────────

const ERLAUBTE_ZEICHEN = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ ,.]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t[0] === t[0].toLowerCase() || t !== t.trim() || t.includes("  ") || /[,.]\S/.test(t);

describe("PL-T4: Satzanfang gross, nur Punkt und Komma, Regeln aller pl-Zeilen", () => {
  it("jede Zeile beginnt gross und besteht nur aus Buchstaben, Punkt, Komma und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kleinschreibung am Anfang, ? ! : ; \", Bindestrich, Apostroph, Komma ohne Leerzeichen, doppeltes Leerzeichen", () => {
    for (const t of ["ola ma psa.", "Idziesz?", "Hura!", "Uwaga: pada.", "Tak; nie.", 'Mówi "cześć".', "Bielsko-Biała.", "Braille'a.", "Mamo,idziemy.", "Ola  ma psa."]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("Ala ma kota, a Ola ma psa.")).toBe(false);
  });

  it("jede Zeile endet mit Punkt, mindestens 30 Zeilen tragen ein Komma (gemessen 34)", () => {
    expect(ZEILEN.filter((t) => !t.endsWith("."))).toEqual([]);
    expect(ZEILEN.filter((t) => t.includes(",")).length).toBeGreaterThanOrEqual(30);
  });

  it("grosse polnische Buchstaben (Ą Ć Ę Ł Ń Ó Ś Ź Ż) nur an Sprosse 39 (q, grossAkzentAb) - und dort kommen sie vor", () => {
    const mit = ZEILEN.filter((t) => /[ĄĆĘŁŃÓŚŹŻ]/.test(t));
    expect(mit.filter((t) => sprosseAuf(t) !== 39)).toEqual([]);
    expect(mit.length).toBeGreaterThanOrEqual(2);
  });

  it("jede Zeile besteht die Regeln aller polnischen Zeilen (`helfer/plTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg pl, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_PL_WEG_MITTE_KIDS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("pl");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Geschlecht: Vergangenheit nur über benannte Personen ─────────────────────

/**
 * Formen, die das Geschlecht der LESENDEN Person festlegen (Glossar §1 Nr. 2): 1./2. Person der Vergangenheit
 * (`byłem/byłam`, `zrobiłeś`, `byliśmy/byłyśmy`) - erkennbar an den Endungen -łem/-łam/-łeś/-łaś/-liśmy/-łyśmy/-liście/-łyście
 * - und „jestem/jesteś" mit einem Adjektiv. Die Charge erzählt in der 3. Person mit Namen.
 */
const ENDUNG_ICH_DU = /(łem|łam|łeś|łaś|liśmy|łyśmy|liście|łyście)$/u;
/** Nomen mit derselben Endung (kein Verb): masłem (Instr. von masło), liście (Blätter). Wächst nur mit gelesenen Formen. */
const NOMEN_AUF_LEM = new Set(["masłem", "liście"]);
const JESTEM = new Set(["jestem", "jesteś", "jesteśmy", "jesteście"]);
function legtLesendeFest(zeile: string): boolean {
  const w = zeile.toLowerCase().split(/[\s,.]+/).filter(Boolean);
  if (w.some((x) => ENDUNG_ICH_DU.test(x) && !NOMEN_AUF_LEM.has(x))) return true;
  // „jestem/jesteś" + Adjektiv (Endung -y/-a/-i/-e): gotowy, gotowa, zmęczeni …
  return w.some((x, i) => JESTEM.has(x) && /(y|a|i|e)$/u.test(w[i + 1] ?? "") && w[i + 1] !== "w" && w[i + 1] !== "na");
}

describe("PL-T4: keine Zeile legt das Geschlecht der lesenden Person fest", () => {
  it("keine 1./2. Person der Vergangenheit, kein „jestem/jesteś“ + Adjektiv", () => {
    expect(ZEILEN.filter(legtLesendeFest)).toEqual([]);
    expect([...NOMEN_AUF_LEM].filter((w) => !ZEILEN.some((z) => z.toLowerCase().includes(w)))).toEqual([]);
  });

  it("Gegenprobe: „Byłam w kinie.“, „Zrobiłeś to.“, „Byliśmy tam.“, „Jestem gotowy.“ werden gefunden, „Kuba był w kinie.“ nicht", () => {
    for (const t of ["Byłam w kinie.", "Zrobiłeś to.", "Byliśmy tam.", "Jestem gotowy.", "Byłyście w Gdyni."]) {
      expect(legtLesendeFest(t), t).toBe(true);
    }
    expect(legtLesendeFest("Kuba był w kinie.")).toBe(false);
    expect(legtLesendeFest("Ola była w zamku w Malborku.")).toBe(false);
    expect(legtLesendeFest("Chleb z masłem i miodem.")).toBe(false);
  });
});

// ── Orte und Namen: jedes grossgeschriebene Wort ist bekannt; Regionen breit, keine gehäuft ──

type Raum =
  | "MAL" | "PODH" | "MAZ" | "WM" | "POM" | "KASZ" | "ZPOM" | "PDL" | "KUJ" | "WLK" | "LUB" | "PKR" | "SLA" | "DSL" | "OPO"
  | "SWI" | "LOD" | "LUBU" | "REGION";

/**
 * Orte, Landschaften, Gewässer (die Wortform, wie sie in der Zeile steht, klein) mit ihrem Raum. MAL Kraków und
 * Małopolska ohne Podhale · PODH Podhale, Tatry, Pieniny · KASZ Kaszuby (in Pomorze, eigene Kultur und Sprache) ·
 * ZPOM Zachodniopomorskie · REGION über mehrere Räume (Wisła, Odra, Warta, Bałtyk, Polska). Kleine Adjektive zählen
 * (`łowickie` Łowicz, `łódzkim` Łódź, `augustowskim` Kanał Augustowski) - die grossen Ł Ś Ż gibt es erst ab q.
 */
const ORTE: Readonly<Record<string, Raum>> = {
  krakowa: "MAL", krakowie: "MAL", kraków: "MAL", wawel: "MAL", wawelu: "MAL",
  zakopane: "PODH", tatrami: "PODH", tatrach: "PODH", morskiego: "PODH", oka: "PODH", giewont: "PODH", pieninach: "PODH", dunajcu: "PODH",
  warszawy: "MAZ", warszawie: "MAZ", warszawę: "MAZ",
  mazury: "WM", mazurach: "WM", mrągowo: "WM", fromborku: "WM",
  sopocie: "POM", malborku: "POM", gdyni: "POM", pomorza: "POM", helu: "POM", gdańsku: "POM",
  kaszub: "KASZ", kaszubach: "KASZ", kaszubsku: "KASZ",
  mielna: "ZPOM", mielnie: "ZPOM", kołobrzegu: "ZPOM", szczecin: "ZPOM",
  białowieży: "PDL", biebrzą: "PDL", wigrami: "PDL", augustowskim: "PDL", białystok: "PDL", podlasia: "PDL", suwałkach: "PDL",
  toruniu: "KUJ", toruń: "KUJ", biskupinie: "KUJ", ciechocinku: "KUJ",
  wielkopolsce: "WLK", gniezno: "WLK", rogalinie: "WLK", poznaniu: "WLK", kórniku: "WLK",
  lublinie: "LUB", kazimierz: "LUB", dolny: "LUB", zamość: "LUB", szczebrzeszynie: "LUB", roztoczu: "LUB",
  bieszczady: "PKR", bieszczadach: "PKR", przemyśl: "PKR", sanem: "PKR", rzeszów: "PKR", podkarpacia: "PKR",
  gliwic: "SLA", katowicach: "SLA", spodek: "SLA",
  legnicy: "DSL", karkonoszach: "DSL", wrocław: "DSL",
  opolem: "OPO", opolu: "OPO", opola: "OPO",
  kielcami: "SWI", kielc: "SWI", bałtowie: "SWI",
  łódzkim: "LOD", łowickie: "LOD",
  zielonej: "LUBU", górze: "LUBU",
  wisła: "REGION", wisłą: "REGION", odrą: "REGION", wartę: "REGION", bałtykiem: "REGION", polski: "REGION", polsce: "REGION",
};

/** Grossgeschriebene Wortteile von Orts- und Eigennamen, die selbst kein Ort sind (Kanał Augustowski, Krzywa Wieża …). */
const NAMENSTEILE = new Set(["kanale", "krzywa", "wieża", "centrum", "nauki", "dar", "oka"]);

/**
 * Menschen, Figuren und benannte Dinge (klein): Mädchen und Jungen gleichwertig, dazu Kinder mit Familien aus der Ukraine
 * (Taras, Daryna) und mit Namen anderer Länder (Alex, Mia); Sagengestalten (Syrenka, Liczyrzepa, Neptun), der Dzwon
 * Zygmunt, Kopernik, die Hunde Max und Rex, Felix, Net i Nika (Buchreihe), Vivaldi, Vincent van Gogh.
 */
const NAMEN = new Set(
  (
    "ala ola oli ali wiktor wiktoria marta kacper kacprowi ida ewa ewo szymon nina oskar kasi kasia kaśka wojtek antek antka " +
    "antku antoni tymek tymkowi wanda marek zuzia zuzi zuzią pola taras tarasa zosia zosię maja kamil paweł iwona ula iza kuba " +
    "basia bartek ada klara igor igora iga igi agata gosia grzegorz magda tola grzesiek janek natan filip staś mia daryna lena " +
    "hania michał hubert nikodem maks łukasz żaneta xawery alex max rex mikołaj kopernik syrenka liczyrzepa neptuna zygmunt " +
    "felix net nika vivaldiego vincent van gogh"
  ).split(" "),
);

/** Feste und Tage (gross geschrieben, kein Ort). */
const FESTE = new Set(["wigilię", "wielkanoc", "barbórka"]);

/** Abkürzungen, die gross stehen. */
const ABKUERZUNGEN = new Set(["tv"]);

/** Wörter einer Zeile, klein, ohne Satzzeichen. */
const woerterKlein = (zeile: string): string[] => zeile.toLowerCase().split(/[\s,.]+/).filter(Boolean);

/** Grossgeschriebene Wörter, die nicht am Satzanfang stehen und weder Ort, Name, Namensteil, Fest noch Abkürzung sind. */
function unbekannteGrosswoerter(zeile: string): string[] {
  const out: string[] = [];
  const w = zeile.split(/[\s,.]+/).filter(Boolean);
  for (let i = 1; i < w.length; i++) {
    const wort = w[i];
    if (wort[0] === wort[0].toLowerCase()) continue;
    const k = wort.toLowerCase();
    if (k in ORTE || NAMEN.has(k) || NAMENSTEILE.has(k) || FESTE.has(k) || ABKUERZUNGEN.has(k)) continue;
    out.push(wort);
  }
  return out;
}

function raeumeIn(zeile: string): Set<Raum> {
  return new Set(woerterKlein(zeile).filter((w) => w in ORTE).map((w) => ORTE[w]));
}

function verteilung(zeilen: string[]): Map<Raum | "verortet", number> {
  const v = new Map<Raum | "verortet", number>();
  for (const z of zeilen) {
    const r = [...raeumeIn(z)].filter((x) => x !== "REGION");
    if (r.length === 0) continue;
    v.set("verortet", (v.get("verortet") ?? 0) + 1);
    for (const x of r) v.set(x, (v.get(x) ?? 0) + 1);
  }
  return v;
}

/** Die 16 Woiwodschaften, über die Räume: Małopolska = MAL + PODH, Pomorskie = POM + KASZ. */
const WOIWODSCHAFTEN: Raum[][] = [
  ["MAL", "PODH"], ["MAZ"], ["WM"], ["POM", "KASZ"], ["ZPOM"], ["PDL"], ["KUJ"], ["WLK"], ["LUB"], ["PKR"], ["SLA"], ["DSL"],
  ["OPO"], ["SWI"], ["LOD"], ["LUBU"],
];

describe("PL-T4: Orte aus ganz Polen, keine Region gehäuft", () => {
  it("jedes grossgeschriebene Wort in der Zeile ist ein bekannter Ort, Name, Namensteil, Fest oder eine Abkürzung", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede der 16 Woiwodschaften kommt vor; kein Raum steht in mehr als 6 Zeilen; mindestens 70 Zeilen verortet", () => {
    const v = verteilung(ZEILEN);
    expect(WOIWODSCHAFTEN.filter((rs) => rs.every((r) => (v.get(r) ?? 0) === 0)).map((rs) => rs.join("+"))).toEqual([]);
    expect([...v].filter(([r, n]) => r !== "verortet" && n > 6).map(([r, n]) => `${r}: ${n}`)).toEqual([]);
    expect(v.get("verortet") ?? 0).toBeGreaterThanOrEqual(70);
  });

  it("die Regionen, die PL-T1 nicht abdecken konnte (Befund T1 §2), stehen hier: Wielkopolska, Lubelszczyzna, Podkarpacie je ≥ 5, oberek", () => {
    const v = verteilung(ZEILEN);
    for (const r of ["WLK", "LUB", "PKR"] as Raum[]) expect(v.get(r) ?? 0, r).toBeGreaterThanOrEqual(5);
    expect(ZEILEN.some((z) => woerterKlein(z).includes("oberek"))).toBe(true);
    expect(ZEILEN.some((z) => woerterKlein(z).includes("cebularze"))).toBe(true);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, ein Satzanfang nicht; sieben Krakau-Zeilen fallen durch", () => {
    expect(unbekannteGrosswoerter("Ola jedzie do Atlantydy.")).toEqual(["Atlantydy"]);
    expect(unbekannteGrosswoerter("Pada deszcz.")).toEqual([]);
    expect(raeumeIn("W Bieszczadach jest kolejka leśna.")).toEqual(new Set(["PKR"]));
    const v = verteilung(Array.from({ length: 7 }, (_, i) => `W Krakowie ${"abcdefg"[i]}.`));
    expect(v.get("MAL")).toBe(7);
  });
});

// ── Wortschatz: Wortgrenze 8 über T1 + T4, Sperrliste, Wortbasis, Ogonek-Zwillinge ──

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. Ab T4 dazu był, że, już, też, go … */
const FUNKTIONSWOERTER = new Set(
  (
    "a i w we z ze na do od o po za nad pod przed dla jak to ten ta te tak nie się mi mnie ja ty on ona ono my wy " +
    "oni one jest są ma mam masz mamy czy co oraz lub ale no był była było byli były że już też go jej jego ich mu ją " +
    "bo u przy przez bez nam nas mu"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(woerterKlein(z))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
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
 * Wörter dieser Charge, die NICHT im Wortschatz standen und weder Ort noch Name noch Fest sind (Tatoeba hat sie
 * seltener als zweimal; ein Wörterbuch-Beleg fehlt für Polnisch, Falle 61). Jedes ist eine gewöhnliche Form eines
 * Standardworts; die Begründung steht daneben. Über den Korpus kommen sie ins Vorlese-Lexikon.
 * ⚠️ Von keiner Person mit Polnisch als Erstsprache gelesen (Befund §5).
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  aquaparku: "Lok. Sg. von aquapark (do aquaparku = Gen.), in Polen übliche Schreibung neben akwapark",
  babkę: "Akk. Sg. von babka (Napfkuchen)",
  bazę: "Akk. Sg. von baza",
  bigos: "Nom./Akk. Sg. (Krautgericht)",
  bimba: "Posener Wort für Strassenbahn (mit Raumnennung: W Poznaniu)",
  bocianów: "Gen. Pl. von bocian",
  bohaterowie: "Nom. Pl. von bohater",
  brodzi: "3. Sg. von brodzić (waten)",
  bursztynu: "Gen. Sg. von bursztyn (Bernstein)",
  cebularze: "Akk. Pl. von cebularz (Lubliner Zwiebelfladen)",
  chrząszcza: "Gen. Sg. von chrząszcz (pomnik chrząszcza)",
  chóru: "Gen. Sg. von chór",
  fokarium: "Robbenstation (Hel), Nom. Sg.",
  fontanna: "Nom. Sg.",
  galaretką: "Instr. Sg. von galaretka",
  gofry: "Akk. Pl. von gofr (Waffel)",
  górale: "Nom. Pl. von góral",
  górników: "Gen. Pl. von górnik",
  jagodzianki: "Akk. Pl. von jagodzianka (Blaubeerbrötchen)",
  jajkiem: "Instr. Sg. von jajko",
  kajaki: "Nom. Pl. von kajak",
  kajakiem: "Instr. Sg. von kajak",
  karmnik: "Nom./Akk. Sg. (Futterhaus)",
  karnawału: "Gen. Sg. von karnawał",
  kałużach: "Lok. Pl. von kałuża",
  kompot: "Nom./Akk. Sg.",
  koniki: "Nom. Pl. von konik (koniki polskie, Rasse)",
  kotlet: "Nom. Sg.",
  kozice: "Nom. Pl. von kozica (Gämse)",
  koziołki: "Nom. Pl. von koziołek (Posener Böckchen)",
  kraina: "Nom. Sg.",
  krakowiak: "Tanz, Nom. Sg. (klein: der Tanz)",
  kujawiak: "Tanz, Nom. Sg.",
  mazur: "Tanz, Nom. Sg.",
  polonez: "Tanz, Nom. Sg.",
  oberek: "Tanz, Nom. Sg. (der fünfte Nationaltanz)",
  kreskę: "Akk. Sg. von kreska",
  krówki: "Nom. Pl. von krówka (Milchkaramell)",
  lampie: "Lok. Sg. von lampa",
  lany: "Adjektiv (lany poniedziałek = Ostermontag)",
  lepi: "3. Sg. von lepić",
  lepić: "Infinitiv (lepić pierogi, lepić bałwana)",
  leśna: "Adjektiv f. zu las (kolejka leśna)",
  liściu: "Lok. Sg. von liść",
  maki: "Nom. Pl. von mak (Mohnblumen; Zwilling mąki gelesen)",
  miauczą: "3. Pl. von miauczeć",
  molo: "Nom. Sg. (Seebrücke, unveränderlich)",
  mroźne: "Adjektiv n./Pl. (zimy są mroźne)",
  muszelki: "Akk. Pl. von muszelka",
  nagrywa: "3. Sg. von nagrywać",
  narysowała: "3. Sg. f. Präteritum von narysować (Ada)",
  odlatują: "3. Pl. von odlatywać",
  ogonki: "Nom. Pl. von ogonek (die Häkchen an ą ę)",
  osada: "Nom. Sg. (Siedlung)",
  owies: "Akk. Sg. (Hafer)",
  palmiarnia: "Nom. Sg. (Palmenhaus)",
  pełza: "3. Sg. von pełzać",
  pieje: "3. Sg. von piać (kogut pieje)",
  pieką: "3. Pl. von piec (backen)",
  pielęgniarzem: "Instr. Sg. von pielęgniarz",
  pikniki: "Akk. Pl. von piknik",
  pilotuje: "3. Sg. von pilotować",
  placki: "Akk. Pl. von placek",
  plasteliny: "Gen. Sg. von plastelina",
  poczytaj: "Imperativ 2. Sg. von poczytać",
  polewają: "3. Pl. von polewać",
  przywiozła: "3. Sg. f. Präteritum von przywieźć (babcia)",
  płyniemy: "1. Pl. von płynąć",
  pływackie: "Adjektiv Pl. zu pływanie (zawody pływackie)",
  rogale: "Akk. Pl. von rogal (rogale świętomarcińskie)",
  rosół: "Akk. Sg. (Brühe)",
  ruskie: "Adjektiv Pl. (pierogi ruskie, Name des Gerichts)",
  rycerz: "Nom. Sg. (Ritter)",
  rysujemy: "1. Pl. von rysować",
  rękawiczkę: "Akk. Sg. von rękawiczka",
  sadzi: "3. Sg. von sadzić (Zwilling sądzi gelesen)",
  sieją: "3. Pl. von siać (Möhren werden gesät, nicht gepflanzt)",
  sankach: "Lok. Pl. von sanki",
  smoku: "Lok. Sg. von smok",
  starówkę: "Akk. Sg. von starówka (Altstadt)",
  strumyku: "Lok. Sg. von strumyk",
  szarlotką: "Instr. Sg. von szarlotka",
  sznurowadła: "Akk. Pl. von sznurowadło",
  tamę: "Akk. Sg. von tama",
  terrarium: "Nom. Sg. (unveränderlich im Sg.)",
  tratwą: "Instr. Sg. von tratwa",
  trykają: "3. Pl. von trykać się (Böcke stossen mit den Hörnern)",
  trąbce: "Lok. Sg. von trąbka",
  trąbę: "Akk. Sg. von trąba (Rüssel)",
  tulipany: "Akk. Pl. von tulipan",
  tężnie: "Nom. Pl. von tężnia (Gradierwerk)",
  ulepił: "3. Sg. m. Präteritum von ulepić (Szymon)",
  vlog: "Lehnwort, Nom./Akk. Sg.",
  warkocz: "Akk. Sg. (Zopf)",
  wkleiła: "3. Sg. f. Präteritum von wkleić (Zuzia)",
  wkładamy: "1. Pl. von wkładać",
  wycinanki: "Nom. Pl. von wycinanka (Scherenschnitt)",
  zaczekała: "3. Sg. f. Präteritum von zaczekać (mama)",
  zaplotła: "3. Sg. f. Präteritum von zapleść (Pola)",
  zawiązuje: "3. Sg. von zawiązywać",
  zeszytu: "Gen. Sg. von zeszyt (do zeszytu)",
  ćma: "Nom. Sg. (Nachtfalter)",
  łosie: "Nom. Pl. von łoś",
  śpiewamy: "1. Pl. von śpiewać",
  świetlicy: "Lok./Gen. Sg. von świetlica (Hort in der Schule)",
  świnkę: "Akk. Sg. von świnka (świnka morska)",
  świętomarcińskie: "Adjektiv Pl. zum Martinstag (rogale świętomarcińskie, geschützte Bezeichnung)",
  żeglować: "Infinitiv (segeln)",
  żubry: "Nom. Pl. von żubr (Wisent)",
  żuk: "Nom. Sg. (Käfer)",
  żyrafę: "Akk. Sg. von żyrafa",
  tv: "Abkürzung (telewizja), gross geschrieben",
};

/** Buchstabenfolgen, die als NAMEN der Zeichen dastehen („Ch i h, rz i ż …", „przez rz") - kein Wort, kein Fehler. */
const ZEICHENNAMEN: ReadonlySet<string> = new Set(["ch", "rz"]);

const bekannt = (w: string): boolean =>
  BASIS.has(w) || w in VON_HAND_BELEGT || w in ORTE || NAMEN.has(w) || NAMENSTEILE.has(w) || FESTE.has(w) || ZEICHENNAMEN.has(w);

/** Wörter (ab zwei Buchstaben), die weder im Wortschatz standen noch belegt sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) for (const w of woerterKlein(z)) if (w.length >= 2 && !bekannt(w)) out.add(w);
  return [...out];
}

/**
 * „Ogonek-Zwillinge" (PL-T1 §4): Formen ohne Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist (mama/mamą, gra/grą,
 * sadzi/sądzi, maki/mąki, ze/że). Ein vergessenes Ogonek ergäbe ein ANDERES Wort, und das Lexikon kennt auch
 * Tippfehler-Formen - darum ist jede Zeile mit so einem Wort GELESEN (Befund §5) und hier eingetragen.
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
const mitZwilling = (zeile: string): boolean => woerterKlein(zeile).some((w) => ZWILLINGE.has(w));

const ZEILEN_MIT_ZWILLING_GELESEN: ReadonlySet<string> = new Set([
  "Ala ma kota, a Ola ma psa.", "Marta pisze list do cioci.", "Pada deszcz, a Ida ma parasol.", "Mama Oli jest weterynarzem.",
  "Ewa sadzi tulipany.", "Nina pije kompot z truskawek.", "Mama Kasi prowadzi tramwaj.", "Wojtek pisze opowiadanie o smoku.",
  "Syrenka pilnuje Warszawy.", "Ida, Ewa i Tymek to moi kuzyni.", "Ciocia Wanda mieszka pod Opolem.", "Antoni pisze do Tarasa.",
  "Nasza szkoła ma salę z komputerami.", "Maja pływa w morzu.", "Ciocia Iwona przysłała kartkę z Mielna.",
  "Wieczorem tata czytał nam opowiadanie.", "Mama Antka kupiła mu nowe kredki.", "Babcia Basia mieszka w Lublinie.",
  "Na obiad jest zupa i kotlet.", "Biblioteka jest obok szkoły.", "Babcia robi sweter dla Ali.", "Białystok to stolica Podlasia.",
  "W Biskupinie jest stara osada.", "Babcia przywiozła truskawki z Kaszub.", "Igor gra w piłkę na boisku.",
  "Mama Igi pilotuje samoloty.", "Tata Igora jest pielęgniarzem.", "Babcia gotuje bigos.", "Agata gra na gitarze.",
  "Pan Grzegorz jest ogrodnikiem.", "Na Wawelu wisi dzwon Zygmunt.", "Grzesiek gra z dziadkiem w warcaby.",
  "Tymek pisze, że już jest nad morzem.", "Każdy pisze w swoim tempie.", "Moja ciocia jest strażakiem.", "Litera ż ma kropkę.",
  "Antek poprosił, żeby mama zaczekała.", "Szymon gra z tatą w karty.", "Na łące rosną maki.", "Mama z Zuzią pieką babkę.",
  "Filip, Maja i Nina to nasi sąsiedzi.", "Natan zapytał panią o zadanie.", "W sadzie dziadka rosną wiśnie.",
  "Na śniadanie tata robi jajecznicę.", "Gdzieś tu jest moja gumka.", "Ida miała dziś wycieczkę.", "Pora spać.",
  "Babcia uczy nas lepić pierogi.", "Hubert chce zostać astronautą.", "Hubert gra w hokeja.", "Hania chce lecieć w kosmos.",
  "Rzeszów to stolica Podkarpacia.", "Tata ugotował rosół.", "Gra w klasy to zabawa na podwórku.", "Kończymy lekcje o pierwszej.",
  "Xawery pisze swoje imię przez x.", "Woda ze źródła jest zimna.", "Litera ź ma kreskę.", "Ola i Ala to bliźniaczki.",
  "Tata ogląda mecz w TV.",
]);

describe("PL-T4: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch über beide Kinder-Chargen (PL-T1 + PL-T4) zusammen steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    const fehler = zuHaeufig([...T1, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross und mit Punkt), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Las" : "Ten las"} ${"abcdefghi"[i]}. Już.`);
    expect(zuHaeufig(neun)).toEqual(['"las": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => woerterKlein(t).filter((w) => gesperrtPl(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), tłusty, Boże und gruba (Wortbasis) werden gefunden, babka und kluski nicht", () => {
    expect(istKernGesperrtPl("kurwa")).toBe(true);
    expect(gesperrtPl("tłusty")).toBe(true); // darum „ostatni czwartek karnawału", nicht „tłusty czwartek"
    expect(gesperrtPl("Boże")).toBe(true); // darum kein „Boże Narodzenie" - Wigilia und Wielkanoc stehen da
    expect(gesperrtPl("gruba")).toBe(true);
    expect(gesperrtPl("babka")).toBe(false);
    expect(gesperrtPl("kluski")).toBe(false);
  });

  it("jedes Wort stand im Wortschatz oder ist Ort, Name, Fest oder von Hand belegt - und die Listen tragen nur Benutztes", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    const benutzt = new Set(ZEILEN.flatMap(woerterKlein));
    expect(Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w))).toEqual([]);
    expect(Object.keys(ORTE).filter((w) => !benutzt.has(w))).toEqual([]);
    expect([...NAMEN, ...NAMENSTEILE, ...FESTE, ...ZEICHENNAMEN].filter((w) => !benutzt.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine Form ohne Ogonek, die es so nicht gibt, werden gemeldet", () => {
    expect(ungeprueft(["Ola ma psax.", "Kuba dziekuje mamie."])).toEqual(["psax", "dziekuje"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge ausser den Zeichennamen (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) =>
      z.split(/\s+/).some((w) => {
        const r = w.replace(/[,.]/g, "");
        return r.length >= 2 && !ZEICHENNAMEN.has(r.toLowerCase()) && !isRealWord(r, "pl");
      }),
    );
    expect(buchstabiert).toEqual([]);
  });

  it("jede Zeile mit einem Ogonek-Zwilling ist gelesen (mama/mamą, gra/grą, maki/mąki, ze/że) - und nur diese", () => {
    const mit = ZEILEN.filter(mitZwilling);
    expect(mit.filter((z) => !ZEILEN_MIT_ZWILLING_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_ZWILLING_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Ide z mama.“ (statt Idę z mamą) und „Kot jest sam ze soba.“ haben Zwillinge, „Ola ma psa.“ nicht", () => {
    expect(mitZwilling("Ide z mama.")).toBe(true);
    expect(ZWILLINGE.get("mama")).toContain("mamą");
    expect(mitZwilling("Kot jest sam ze soba.")).toBe(true);
    expect(mitZwilling("Ola ma psa.")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl grob gleichgesetzt: „Ola była …" / „Kuba był …" bleiben verschieden (Namen), „on/ona", Endvokal weg. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", one: "PRO" };
  return woerterKlein(zeile)
    .map((w) => pron[w] ?? w.replace(/[aeiouyąę]$/, "_").replace(/(ł_|ł|li)$/, "Ł"))
    .join(" ");
}

/** Paare unter `zeilen` und zwischen `zeilen` und den Vergleichszeilen `gegen`. */
function paare(zeilen: string[], gegen: string[] = []): string[] {
  const fremd = new Map<string, string>();
  for (const z of gegen) if (!fremd.has(paarForm(z))) fremd.set(paarForm(z), z);
  const gesehen = new Map<string, string>();
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f) ?? fremd.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

/** Ein Text ohne Satzzeichen und Grossschreibung - so kollidiert „Idę do kina." mit „idę do kina". */
const textForm = (t: string): string => woerterKlein(t).join(" ");

/** Zeilen dieser Charge, die einer Vergleichszeile gleichen - als Text (ohne Satzzeichen) oder Ledger-Schlüssel. */
function kopienGegen(zeilen: string[], gegen: string[]): string[] {
  const texte = new Set(gegen.map(textForm));
  const schluessel = new Set(gegen.map((t) => bausteinKey("satz", t)));
  return zeilen.filter((t) => texte.has(textForm(t)) || schluessel.has(bausteinKey("satz", t)));
}

const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_TR, ...CORPUS_CS];

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

describe("PL-T4: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der die neun polnischen Buchstaben NICHT kennt)", () => {
    expect(new Set(ZEILEN.map(textForm)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("Gegenprobe: der Ledger-Schlüssel macht aus ż und ą Trenner („Już jest.“ = „Ju jest“)", () => {
    expect(bausteinKey("satz", "Już jest.")).toBe(bausteinKey("satz", "Ju jest"));
    expect(kopienGegen(["Idę do kina."], ["idę do kina"])).toHaveLength(1);
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/tr/cs (Text oder Ledger-Schlüssel)", () => {
    const fremd = FREMDE_KORPORA();
    expect(kopienGegen(ZEILEN, fremd.map((i) => i.text))).toEqual([]);
  });

  it("keine Zeile gleicht einer Zeile einer anderen pl-Charge (ROHE Sammelliste: T1, T2, T3 …) - auch ohne Satzzeichen und Grossschreibung", () => {
    // T1 + T2 + T3 stehen in der Sammelliste (am Merge 03.10.2026 gezählt: 164 + 151 + 167).
    expect(ANDERE_PL_ZEILEN.length).toBeGreaterThanOrEqual(164 + 151 + 167);
    expect(kopienGegen(ZEILEN, ANDERE_PL_ZEILEN)).toEqual([]);
  });

  it("keine Zeile gleicht einer Zeile oder einem Satz der Serien (alle Wege) und der Tippchallenge-Banken", () => {
    const fremd = [
      ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
      ...bankZeilen(),
    ];
    expect(fremd.length).toBeGreaterThan(1000);
    const mitSaetzen = [...new Set(fremd.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
    expect(kopienGegen(ZEILEN, mitSaetzen)).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung mit einer Zeile irgendeines Korpus)", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_PL()].map((i) => bausteinId(i.kind, i.text)));
    expect(CORPUS_PL_WEG_MITTE_KIDS.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    expect(new Set(CORPUS_PL_WEG_MITTE_KIDS.map((i) => bausteinId(i.kind, i.text))).size).toBe(ZEILEN.length);
    // Anker-Zuwachs = Zeilenzahl: die letzten ZEILEN.length IDs des (nur anhängenden) Ankers sind genau die dieser Charge.
    // (Am Merge 03.10.2026 gemessen: 15.280 ⇒ 15.606, „326 neu".) Kommt später eine Charge dahinter, prüft dieser Test
    // weiter, dass jede eigene ID GENAU EINMAL im Anker steht.
    const eigeneIds = CORPUS_PL_WEG_MITTE_KIDS.map((i) => bausteinId(i.kind, i.text));
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(KORPUS_ANKER.slice(start, start + ZEILEN.length)).toEqual(eigeneIds);
    // Davor steht keine ID dieser Charge (sonst hätte sie sich an eine frühere Zeile gehängt).
    const eigen = new Set(eigeneIds);
    expect(KORPUS_ANKER.slice(0, start).filter((id) => eigen.has(id))).toEqual([]);
  });

  it("Gegenprobe: eine Zeile, deren Ledger-Schlüssel einer T2- oder T3-Zeile gleicht, hätte keine eigene ID", () => {
    const fremdeIds = new Set(ANDERE_PL().map((i) => bausteinId(i.kind, i.text)));
    const probe = ANDERE_PL()[200];
    expect(fremdeIds.has(bausteinId("satz", `${probe.text[0].toUpperCase()}${probe.text.slice(1)}.`))).toBe(true);
  });

  it("Gegenprobe: eine T1-Zeile, gross und mit Punkt, wäre Kopie UND Paar", () => {
    const t = T1[20];
    const gross = `${t[0].toUpperCase()}${t.slice(1)}.`;
    expect(kopienGegen([gross], ANDERE_PL_ZEILEN)).toEqual([gross]);
    expect(paare([gross], ANDERE_PL_ZEILEN)).toHaveLength(1);
  });

  it("keine Paare (nur Geschlecht oder Zahl getauscht) - weder untereinander noch mit PL-T1 (Falle 31)", () => {
    const fehler = paare(ZEILEN, ANDERE_PL_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: on/ona, był/była, kot/koty werden als Paar erkannt, Kuba/Ola nicht", () => {
    expect(paare(["On idzie do kina.", "Ona idzie do kina."])).toHaveLength(1);
    expect(paare(["Kot był w domu.", "Kot była w domu."])).toHaveLength(1);
    expect(paare(["Fajna lalka.", "Fajne lalki."])).toHaveLength(1);
    expect(paare(["Kuba był w kinie.", "Ola była w kinie."])).toEqual([]);
  });

  it("Gegenprobe: eine Zeile aus dem it-Korpus wäre als Kopie erkannt", () => {
    const it0 = CORPUS_IT.find((i) => i.stufen.includes("kids"));
    expect(it0).toBeDefined();
    expect(kopienGegen([(it0 as { text: string }).text], FREMDE_KORPORA().map((i) => i.text))).toHaveLength(1);
  });
});

describe("PL-T4: Korpus-Anker und Auslieferung", () => {
  /**
   * ★ Merge 03.10.2026: die Reihenfolge in der Sammelliste `corpusPl.ts` ist die der Merges (T1, T2, T3, dann diese
   * Charge) - der Anker ist nur anhängend, eine spätere Charge kommt HINTER diese. Gezählt wird an den Objekten der
   * ROHEN Liste, nicht an der geladenen (dort wären Kopien verschmolzen).
   */
  it("die Sammelliste trägt diese Charge als geschlossenen Block hinter T1, T2 und T3", () => {
    const start = PL_ROH.indexOf(CORPUS_PL_WEG_MITTE_KIDS[0]);
    expect(PL_ROH.slice(0, T1.length).map((i) => i.text)).toEqual(T1);
    expect(start).toBeGreaterThanOrEqual(164 + 151 + 167);
    expect(PL_ROH.slice(start, start + ZEILEN.length)).toEqual(CORPUS_PL_WEG_MITTE_KIDS);
    expect(PL_ROH.slice(0, start).every((i) => !CORPUS_PL_WEG_MITTE_KIDS.includes(i))).toBe(true);
  });

  it("korpusFuer(\"pl\") trägt jede Zeile dieser Charge (nichts still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("pl").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_PL_WEG_MITTE_KIDS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe pl t4.", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([
      ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe,
    ]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „pl“ bekommt an Sprosse q jede Zeile dieser Charge - und nur eigene pl-Kinderzeilen", () => {
    const { letzte, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, letzte), "pl");
    const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "pl", lernweg: "pl" });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    const eigeneKinder = new Set(
      CORPUS_PL.filter((i) => i.nurWeg === "pl" && i.stufen.includes("kids")).flatMap((i) => [i.text, fitText(i.text, allowed, "pl") ?? i.text]),
    );
    expect(geliefert.filter((t) => !eigeneKinder.has(t))).toEqual([]);
  });

  it("an der ⇧-Sprosse kommt keine Zeile mit einem Buchstaben nach ⇧ an - aber Zeilen dieser Charge kommen an", () => {
    const { shift, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, shift), "pl");
    const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "pl", lernweg: "pl" });
    expect(geliefert.filter((t) => /[łbgżąśćhóńxźvq]/i.test(t))).toEqual([]);
    expect(geliefert.some((t) => ZEILEN.some((z) => fitText(z, allowed, "pl") === t))).toBe(true);
  });

  it("Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const itO = introOrder("it");
    const it_ = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(itO, "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
