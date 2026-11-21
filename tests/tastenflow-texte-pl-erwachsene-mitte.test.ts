/**
 * ★★★ Wächter PL-T6 (03.10.2026): die mittleren pl-Texte für ERWACHSENE
 * (`corpusPlWegMitteErwachsene.ts`, Sprossen 23-39 auf der Tastatur `pl`: ⇧ bis q).
 * Kopiert und angepasst aus `tastenflow-texte-pl-teens-mitte.test.ts` (PL-T5, mit der Merge-Lehre: Vergleich gegen die
 * ROHE Sammelliste, eigene ID im Anker) und `tastenflow-texte-pl-erwachsene-frueh.test.ts` (PL-T3: Erwachsene, D-2,
 * „jestem" + Adjektiv). Befund `BEFUND-2026-10-02-PL-T6-ERWACHSENE-MITTE.md`, Leitfaden Fallen
 * 26/31/37/45/48/51/58/61/67/76/82-86.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie mit
 * `introOrder("pl").slice(0, n)` durchlässt, mindestens aber die ⇧-Sprosse. An Sprosse 39 zählt
 * „q ODER ein grosser polnischer Buchstabe" als neue Einheit (`grossAkzentAb: "q"`). Kein
 * Wörterbuch-Beleg für Polnisch (Falle 61): jedes Wort steht im Wortschatz oder ist von Hand mit
 * grammatischer Begründung belegt, und jede Zeile mit einem „Ogonek-Zwilling" ist gelesen.
 * Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import {
  fitText,
  corpusItemsFor,
  korpusFuer,
  hatGrossbuchstaben,
  CORPUS,
  CORPUS_EN,
  CORPUS_FR,
  CORPUS_IT,
  CORPUS_PL,
  CORPUS_TR,
  CORPUS_CS,
} from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_PL_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusPlWegMitteErwachsene";
import { CORPUS_PL_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusPlWegFruehErwachsene";
import { CORPUS_PL_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusPlWegFruehKids";
import { CORPUS_PL_WEG_MITTE_TEENS } from "../src/lib/typing/corpusPlWegMitteTeens";
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

const CHARGE = CORPUS_PL_WEG_MITTE_ERWACHSENE;
const ZEILEN = CHARGE.map((i) => i.text);
/** Die frühe Erwachsenen-Charge PL-T3 - dieselbe Stufe: das Wortbudget gilt über T3 + T6 zusammen (Falle 45). */
const FRUEHE_ERWACHSENE = CORPUS_PL_WEG_FRUEH_ERWACHSENE.map((i) => i.text);
const KINDERZEILEN = CORPUS_PL_WEG_FRUEH_KIDS.map((i) => i.text);
/**
 * Alle ANDEREN pl-Chargen (T1-T5 und jede spätere) - aus der ROHEN Sammelliste `corpusPl.ts` (nach Objekt), NICHT aus der
 * geladenen `CORPUS_PL` von corpus.ts: dort hat `mergeCorpus` eine wortgleiche Kopie schon still mit dem Original
 * verschmolzen, und sie fiele aus dem Vergleich (Lehre aus PL-T3 und PL-T5: 9 bzw. 3 Treffer erst am Anker).
 */
const ANDERE_PL = () => PL_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_PL_ZEILEN = ANDERE_PL().map((i) => i.text);
/** Punkt und Komma tragen keine eigene Zeile (weglassbar, D-1). */
const WEGLASSBAR = new Set([".", ","]);
/** Die grossen polnischen Buchstaben - erst ab `q` (`LernwegDef.grossAkzentAb`). */
const GROSS_PL = /[ĄĆĘŁŃÓŚŹŻ]/;
/** Die Sprosse von `r` (20): jede ⇧-Zeile trägt `r`, `p` oder `u` und rutscht über die Auto-Grossschreibung nie davor. */
const R_SPROSSE = 20;

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

/** Enthält der Text die Einheit? ⇧ zeigt sich an einem Grossbuchstaben; an `q` zählt auch Q oder ein grosser polnischer Buchstabe. */
function enthaeltEinheit(text: string, einheit: string): boolean {
  if (einheit === SHIFT_UNIT) return text !== text.toLowerCase();
  if (einheit === "q") return text.toLowerCase().includes("q") || GROSS_PL.test(text);
  return text.toLowerCase().includes(einheit);
}

describe("PL-T6: jede Zeile an ihrer Sprosse (Tastatur pl)", () => {
  it("die Folge ab ⇧: 23-39 (⇧ . , ł b g ż ą ś ć h ó ń x ź v q) - gemessen, nicht geglaubt; der Bindestrich erst an 42", () => {
    const { shift, letzte, o } = grenzen();
    expect(shift).toBe(23);
    expect(letzte).toBe(39);
    expect(o.slice(22, 39).join(" ")).toBe(`${SHIFT_UNIT} . , ł b g ż ą ś ć h ó ń x ź v q`);
    // Darum steht „umowa-zlecenie" (PWN: mit Bindestrich) NICHT in dieser Charge - sie gehört nach PL-T9.
    expect(o.indexOf("-") + 1).toBe(42);
  });

  it("jede Zeile hat eine Sprosse von ⇧ bis q, und minTier stimmt", () => {
    const { shift, letzte } = grenzen();
    const fehler: string[] = [];
    for (const item of CHARGE) {
      const s = sprosseAuf(item.text);
      if (s === null || s < shift || s > letzte) fehler.push(`"${item.text}": Sprosse ${s}`);
      const tier = minTierFor(item.text, "pl");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * Eine ⇧-Zeile (Buchstaben bis u) passt über die Auto-Grossschreibung schon vor ⇧. Sie trägt darum `r`, `p` oder `u`
   * und rutscht so höchstens bis Sprosse 20 vor, nie in die frühen Runden (Muster PL-T4).
   */
  it("keine Zeile rutscht über die Auto-Grossschreibung vor Sprosse 20 (jede ⇧-Zeile trägt r, p oder u)", () => {
    const fehler = ZEILEN.filter((t) => (buchstabenSprosse(t) ?? 0) < R_SPROSSE);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die grossen polnischen Buchstaben stehen nur in Zeilen an q (39) - und dort kommen sie an", () => {
    const { letzte } = grenzen();
    const mit = ZEILEN.filter((t) => GROSS_PL.test(t));
    expect(mit.length).toBeGreaterThanOrEqual(10);
    expect(mit.filter((t) => sprosseAuf(t) !== letzte)).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet, eine ⇧-Zeile ohne r/p/u rutscht, Ł erst an q, „się“ ist kein ś", () => {
    expect(sprosseAuf("Czynsz podniesiono od stycznia.")).toBe(23);
    expect(buchstabenSprosse("Czynsz podniesiono od stycznia.")).toBe(21); // p
    expect(buchstabenSprosse("Kot jest na stole.")).toBe(13); // ohne r/p/u: rutscht weit vor ⇧
    expect(sprosseAuf("Mieszkanie jest na ostatnim piętrze, a winda często się psuje.")).toBe(23); // się = s + i + ę
    expect(sprosseAuf("Ewa wynajęła mieszkanie w Opolu.")).toBe(26);
    expect(sprosseAuf("Zebranie rady osiedla jest we wtorek.")).toBe(27); // b in „zebranie"
    expect(sprosseAuf("Muszę zadzwonić do urzędu skarbowego.")).toBe(32);
    expect(sprosseAuf("Łazienkę remontujemy w lipcu.")).toBe(39);
    expect(sprosseAuf("Lazienke remontujemy w lipcu.")).toBe(23); // ohne Ogonek ein anderer (falscher) Text
  });

  /**
   * GEMESSEN am Ende von PL-T6 (vom Code gezählt) - jede Grenze darf künftig nur STEIGEN. Wenig an `ń` (unter Windows
   * mit NVDA nicht tippbar, Falle 67) und an den Fremdwort-Buchstaben `x`, `v`. Punkt und Komma tragen keine eigene Zeile.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    23: 39, 26: 26, 27: 26, 28: 30, 29: 23, 30: 31, 31: 20, 32: 21, 33: 33, 34: 25, 35: 11, 36: 6, 37: 12, 38: 8, 39: 19,
  };

  it("je Sprosse mindestens so viele Zeilen wie gemessen (mindestens 6 je Einheit); ń nicht mehr als 14", () => {
    const { shift, letzte, o } = grenzen();
    const anzahl = new Map<number, number>();
    for (const t of ZEILEN) {
      const s = sprosseAuf(t);
      if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (let n = shift; n <= letzte; n++) {
      if (WEGLASSBAR.has(o[n - 1])) continue;
      const soll = Math.max(MINDESTENS_JE_SPROSSE[n] ?? 6, 6);
      if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n} (${o[n - 1]}): ${anzahl.get(n) ?? 0} < ${soll}`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    expect(anzahl.get(o.indexOf("ń") + 1) ?? 0).toBeLessThanOrEqual(14);
  });
});

describe("PL-T6: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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

  it("jede Einheit von ⇧ bis q (ohne . ,) hat an ihrer Sprosse Zeilen (W6); an q tragen auch echte q-Wörter", () => {
    const { shift, letzte, o } = grenzen();
    const fehlt: string[] = [];
    for (let n = shift; n <= letzte; n++) {
      if (WEGLASSBAR.has(o[n - 1])) continue;
      const treffer = ZEILEN.filter((t) => sprosseAuf(t) === n && enthaeltEinheit(t, o[n - 1]));
      if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
    expect(ZEILEN.filter((t) => t.toLowerCase().includes("q")).length).toBeGreaterThanOrEqual(5);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet, Grossbuchstabe gilt als ⇧, Ł und Q gelten an q", () => {
    expect(enthaeltEinheit("Ola", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("ola", SHIFT_UNIT)).toBe(false);
    expect(enthaeltEinheit("Łódzka Manufaktura.", "q")).toBe(true);
    expect(enthaeltEinheit("Quo vadis.", "q")).toBe(true);
    expect(enthaeltEinheit("Lodz.", "q")).toBe(false);
    expect(ohneNeueEinheit([{ text: "Ewa wynajęła mieszkanie w Opolu.", sprosse: 27 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Ewa wynajęła mieszkanie w Opolu.", sprosse: 26 }])).toEqual([]);
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

describe("PL-T6: Form", () => {
  it("jede Zeile beginnt gross, endet mit Punkt, hat nur Buchstaben, Komma und Punkt", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kleinschreibung, fehlender Punkt, ?, Anführung, Ziffer, Bindestrich, Leerzeichen vor Komma", () => {
    for (const t of ["umowa najmu.", "Umowa najmu", "Gotówka czy karta?", 'Mówi "dzień dobry".', "Mamy 112.", "Umowa-zlecenie.", "Ola , Kuba."]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("Jeśli masz pytania, napisz do działu kadr.")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller polnischen Zeilen (`helfer/plTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg pl, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("pl");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("keine Anrede mit Pan/Pani/Państwo (du oder unpersönlich)", () => {
    const anrede = /(?<!\p{L})(pan|pani|panie|państwo|pana|panu|panią)(?!\p{L})/iu;
    expect(ZEILEN.filter((z) => anrede.test(z))).toEqual([]);
    expect(anrede.test("Proszę pani, gdzie jest okienko.")).toBe(true);
    expect(anrede.test("Pod Grójcem sadownicy zbierają jabłka.")).toBe(false);
  });
});

// ── Kein Geschlecht raten (Glossar §1 Nr. 2) ────────────────────────────────

/**
 * Die Vergangenheit und der Konditional der ersten und zweiten Person verraten das Geschlecht der Person, die tippt
 * (byłem/byłam, zrobiłeś/zrobiłaś, chciałbym/chciałabym), in der Mehrzahl das der Gruppe (kupiliśmy/kupiłyśmy).
 * Dazu „jestem/jesteś" + Adjektiv (jestem zmęczony/zmęczona) und Wörter mit festem Geschlecht über die eigene Person
 * (powinienem/powinnam, sam/sama, gotowy/gotowa, zadowolony/zadowolona).
 */
const ICH_DU_VERGANGENHEIT = /\p{L}+(łem|łam|łeś|łaś|łbym|łabym|łbyś|łabyś|liśmy|łyśmy)(?!\p{L})/u;
/** Wörter mit derselben Endung, die kein Verb sind (kanałem = Instr. von kanał). */
const KEIN_VERB: ReadonlySet<string> = new Set(["kanałem", "finałem", "działem", "upałem"]);
const SELBST_MIT_GESCHLECHT = /^(powinienem|powinnam|powinieneś|powinnaś|sam|sama|gotowy|gotowa|zadowolony|zadowolona)$/;
const PRAEPOSITION_NACH_JESTEM = new Set(["na", "w", "we", "z", "ze", "do", "po", "u", "od", "przy", "nad", "pod", "za", "już", "tu", "teraz"]);
function geschlechtFehler(zeile: string): boolean {
  const w = woerter(zeile.toLowerCase());
  if (w.some((x) => !KEIN_VERB.has(x) && ICH_DU_VERGANGENHEIT.test(x))) return true;
  if (w.some((x) => SELBST_MIT_GESCHLECHT.test(x))) return true;
  const i = w.findIndex((x) => x === "jestem" || x === "jesteś");
  return i >= 0 && i + 1 < w.length && !PRAEPOSITION_NACH_JESTEM.has(w[i + 1]);
}

describe("PL-T6: keine Zeile legt das Geschlecht der tippenden Person fest", () => {
  it("keine l-Form der 1./2. Person (auch nicht Mehrzahl), kein „jestem“ + Adjektiv, kein powinienem/sama", () => {
    const fehler = ZEILEN.filter(geschlechtFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: byłam, kupiliśmy, chciałbym, jestem zmęczony, powinnam, sama werden gefunden - Marta podpisała, Kanałem, jesteśmy w drodze nicht", () => {
    for (const t of ["Wczoraj byłam w urzędzie.", "Kupiliśmy mieszkanie.", "Chciałbym zmienić pracę.", "Jestem zmęczony.", "Powinnam zadzwonić.", "Mieszkam sama."]) {
      expect(geschlechtFehler(t), t).toBe(true);
    }
    for (const t of ["Marta podpisała umowę najmu na rok.", "Kanałem Augustowskim pływają statki.", "Jesteśmy w drodze do urzędu.", "Jestem w pracy."]) {
      expect(geschlechtFehler(t), t).toBe(false);
    }
  });
});

// ── Orte und Namen: jedes Grosswort bekannt, Polen in seiner Breite ─────────

/**
 * Orte mit ihrer Woiwodschaft - als WORTFORM, wie sie in der Zeile steht (Polnisch beugt), und als Wortgruppe (längste
 * zuerst). PL = ganz Polen (Meer, Flüsse, das Land), AUSLAND = Polonia, Nachbarn, Herkunft.
 */
const ORTE: Record<string, string> = {
  // dolnośląskie
  Wrocławiu: "DS", "Kotlinie Kłodzkiej": "DS", Wrocławiem: "DS", "Jeleniej Góry": "DS", Karkonosze: "DS", Lubina: "DS",
  Ślęża: "DS", Wrocławia: "DS",
  // kujawsko-pomorskie
  Toruniu: "KP", Bydgoszcz: "KP", Brdą: "KP", Ciechocinku: "KP", Kujawach: "KP", Toruń: "KP",
  // lubelskie
  Lublina: "LU", Zamościu: "LU", Chełmie: "LU", Lublinie: "LU",
  // lubuskie
  Międzyrzeczem: "LB", Kostrzyn: "LB", "Zielona Góra": "LB", "Nowa Sól": "LB",
  // łódzkie
  Kutnie: "LD", Sieradzem: "LD", Bełchatowie: "LD", "Łódzka Manufaktura": "LD",
  // małopolskie
  zakopianka: "MA", Tarnowem: "MA", Krynicy: "MA", Podhala: "MA", Kraków: "MA", Podhalu: "MA",
  // mazowieckie
  Mokotowie: "MZ", Radomiu: "MZ", Modlinie: "MZ", Grójcem: "MZ", Warszawy: "MZ", Żyrardów: "MZ",
  // opolskie
  Opolu: "OP", Nysie: "OP", Kędzierzynie: "OP", Opolszczyźnie: "OP", Brzegu: "OP",
  // podkarpackie
  Rzeszowie: "PK", Mielcu: "PK", Bieszczadach: "PK", Przemyśl: "PK", Rzeszowa: "PK", "Dolina Lotnicza": "PK", Krosno: "PK",
  // podlaskie
  Tykocinie: "PD", Podlasia: "PD", "Kanałem Augustowskim": "PD", Podlasiu: "PD",
  // pomorskie
  Gdyni: "PM", Kaszubski: "PM", Malborku: "PM", Gdańsku: "PM", "Długim Targu": "PM", Łeby: "PM", Żuławy: "PM",
  // śląskie
  Rybniku: "SL", Zabrzu: "SL", Katowic: "SL", Śląska: "SL", Żywiec: "SL", Beskidach: "SL",
  // świętokrzyskie
  Kielcach: "SK", Chęcin: "SK", "Świętokrzyski Park Narodowy": "SK", Ćmielowie: "SK",
  // warmińsko-mazurskie
  Olsztynie: "WN", Mrągowo: "WN", Elbląg: "WN", "Zalewem Wiślanym": "WN", Mazurach: "WN", Śniardwy: "WN",
  // wielkopolskie
  Poznania: "WP", Lesznie: "WP", Wielkopolski: "WP", Poznań: "WP", Poznaniu: "WP",
  // zachodniopomorskie
  Szczecina: "ZP", Kołobrzegu: "ZP", Darłowa: "ZP", Międzyzdrojach: "ZP",
  // ganz Polen: Meer, Flüsse, das Land
  Bałtykiem: "PL", Odrą: "PL", Wartą: "PL", Polski: "PL", Polsce: "PL",
  // Ausland: Polonia, Nachbarn, Herkunft
  Oslo: "AUSLAND", Niemiec: "AUSLAND", Irlandii: "AUSLAND", Szwecji: "AUSLAND", Kanady: "AUSLAND", Charkowa: "AUSLAND",
  Europie: "AUSLAND", "Unii Europejskiej": "AUSLAND",
};
const WOIWODSCHAFTEN = ["DS", "KP", "LU", "LB", "LD", "MA", "MZ", "OP", "PK", "PD", "PM", "SL", "SK", "WN", "WP", "ZP"];

/** Menschen, Werke, Marken, Behörden und Abkürzungen - kein Ort. */
const NAMEN = new Set(
  (
    "Oksana Marta Tomasz Kamil Ewa Marek Anna Paweł Iwona Teresa Jan Karol Dorota Ryszard Krzysztof Robert Taras " +
    "Agnieszka Grzegorz Magda Iryna Danuta Jadwiga Alex Ivan Henryk Sienkiewicz Quo Krzyżacy Piastów Śląskich Raj Guido Miasto " +
    "CV ZUS NFZ PESEL UNESCO BHP OLX Excel Excela Express InterCity Netflixie VAT NIP TVP Visa"
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

describe("PL-T6: Orte aus ganz Polen - jede Woiwodschaft, keine vorne", () => {
  it("jedes grossgeschriebene Wort in der Zeile ist Satzanfang, Teil eines bekannten Ortes oder ein Name", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von PL-T6: jede der 16 Woiwodschaften in 4 bis 6 Zeilen (Auftrag: höchstens 6 je Region; Johannes:
   * Polen in seiner Breite, nicht Warschau-zentriert). Die ORTE-Liste trägt nur benutzte Formen (Test unten).
   */
  it("jede der 16 Woiwodschaften steht in 4 bis 6 Zeilen; mindestens 80 Zeilen sind verortet", () => {
    const n = raumZahl(ZEILEN);
    const text = [...n].map(([r, k]) => `${r} ${k}`).join(" · ");    for (const w of WOIWODSCHAFTEN) {
      expect(n.get(w) ?? 0, `${w}: ${text}`).toBeGreaterThanOrEqual(4);
      expect(n.get(w) ?? 0, `${w}: ${text}`).toBeLessThanOrEqual(6);
    }
    expect(ZEILEN.filter((z) => orteIn(z).raeume.size > 0).length, text).toBeGreaterThanOrEqual(80);
  });

  it("ORTE und NAMEN tragen nur, was in den Zeilen steht (sonst wachsen sie still)", () => {
    const text = ZEILEN.join(" ");
    expect(Object.keys(ORTE).filter((o) => !text.includes(o))).toEqual([]);
    const alle = new Set(ZEILEN.flatMap(woerter));
    expect([...NAMEN].filter((n) => !alle.has(n))).toEqual([]);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, Wortgruppen zählen richtig, ein Übergewicht fällt auf", () => {
    expect(unbekannteGrosswoerter("Marta mieszka w Atlantydzie.")).toEqual(["Atlantydzie"]);
    expect(unbekannteGrosswoerter("W Kotlinie Kłodzkiej jest wiele uzdrowisk.")).toEqual([]);
    expect(orteIn("Świętokrzyski Park Narodowy chroni puszczę jodłową.").raeume).toEqual(new Set(["SK"]));
    const n = raumZahl(Array.from({ length: 7 }, (_, i) => `W Radomiu ${"abcdefg"[i]}.`));
    expect((n.get("MZ") ?? 0) <= 6).toBe(false);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Wortbasis, Ogonek-Zwillinge ────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste wie PL-T5). */
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
 * Wörter dieser Charge, die NICHT im Wortschatz standen (Tatoeba hat sie seltener als zweimal; ein Wörterbuch-Beleg fehlt
 * für Polnisch, Falle 61 - das macOS-Wörterbuch nimmt jedes Wort an). Jedes ist eine gewöhnliche Form eines Standardworts,
 * ein Fachwort der Erwachsenenwelt oder ein gebräuchliches Lehnwort; die Begründung steht daneben. Namen und Orte prüfen
 * die Listen oben. Über den Korpus kommen die Wörter ins Vorlese-Lexikon (die Stimme spricht sie ganz).
 * ⚠️ Von keiner Person mit Polnisch als Erstsprache gelesen (Befund §5).
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  // ⇧ (23)
  przesunięto: "unpersönliche -no/-to-Form von przesunąć (Termin verschoben)",
  paczkomacie: "Lok. Sg. von paczkomat (Paketautomat)",
  wynajmę: "1. Sg. Futur von wynająć (vermieten; Kleinanzeige)",
  kawalerkę: "Akk. Sg. von kawalerka (Einzimmerwohnung)",
  esemesem: "Instr. Sg. von esemes (SMS, eingedeutscht geschrieben)",
  weekendem: "Instr. Sg. von weekend (przed weekendem)",
  zeznanie: "Nom. Sg. n. (zeznanie podatkowe: Steuererklärung)",
  podatkowe: "Adj. podatkowy, Nom. Sg. n.",
  wtorki: "Akk. Pl. von wtorek (we wtorki: dienstags)",
  czynna: "Adj. czynny, Nom. Sg. f. (geöffnet)",
  administrator: "Nom. Sg. (Hausverwalter)",
  zamykanie: "Akk. Sg. des Verbalsubstantivs zamykanie (Schliessen)",
  odczyt: "Nom. Sg. (Zählerablesung)",
  licznika: "Gen. Sg. von licznik (Zähler)",
  zmianowym: "Adj. zmianowy, Lok. Sg. m. (system zmianowy: Schichtbetrieb)",
  fryzjerka: "Nom. Sg. f. (pracować jako + Nom.)",
  najmu: "Gen. Sg. von najem (umowa najmu: Mietvertrag)",
  przypominamy: "1. Pl. von przypominać",
  podniesiono: "unpersönliche -no-Form von podnieść (Miete erhöht)",
  remontujemy: "1. Pl. von remontować",
  zakorkowana: "Partizip/Adj. zakorkowany, Nom. Sg. f. (verstopft, Stau)",
  zostawiamy: "1. Pl. von zostawiać",
  dyrektorka: "Nom. Sg. f. von dyrektor (gebräuchliche Form)",
  zaprasza: "3. Sg. von zapraszać",
  kwartalny: "Adj. kwartalny, Akk. Sg. m. unbelebt (raport kwartalny)",
  oddajemy: "1. Pl. von oddawać (abgeben)",
  utrudnienia: "Akk. Pl. von utrudnienie (feste Formel: Przepraszamy za utrudnienia)",
  zakręcili: "3. Pl. m.-pers. Prät. von zakręcić (unbestimmtes „sie“: Wasser abgedreht)",
  okienko: "Nom. Sg. n. (okienko podawcze: Annahmeschalter)",
  podawcze: "Adj. podawczy, Nom. Sg. n. (Amtssprache)",
  skierowanie: "Nom. Sg. n. (Überweisung zum Arzt, zur Kur)",
  sanatorium: "Gen. Sg., im Singular unflektiert (do sanatorium)",
  wystawia: "3. Sg. von wystawiać (ein Dokument ausstellen)",
  // ł (26)
  osiedlu: "Lok. Sg. von osiedle (Wohnsiedlung)",
  podpisała: "3. Sg. f. Prät. von podpisać (mit Namen: Marta)",
  zaliczka: "Nom. Sg. (Vorschuss, Anzahlung)",
  wpłynęła: "3. Sg. f. Prät. von wpłynąć (Geld ist eingegangen)",
  zwolnienie: "Akk. Sg. n. (zwolnienie lekarskie: Krankschreibung)",
  zainstalowała: "3. Sg. f. Prät. von zainstalować (mit Subjekt: wnuczka)",
  komunikator: "Akk. Sg. (Messenger-Programm)",
  ortopedy: "Gen. Sg. von ortopeda (u ortopedy)",
  konsultant: "Nom. Sg. (Callcenter-Mitarbeiter)",
  kurierskiej: "Adj. kurierski, Gen. Sg. f. (firma kurierska)",
  fryzjerski: "Adj. fryzjerski, Akk. Sg. m. unbelebt (salon fryzjerski)",
  emerytury: "Gen. Sg. von emerytura (do emerytury)",
  warsztat: "Akk. Sg. (Werkstatt)",
  odprowadza: "3. Sg. von odprowadzać (Beiträge abführen)",
  składki: "Akk. Pl. von składka (Sozialbeiträge)",
  uzdrowisk: "Gen. Pl. von uzdrowisko (Kurort)",
  wnuczek: "Nom. Sg. (Enkel, Verkleinerung)",
  // b (27)
  osiedla: "Gen. Sg. von osiedle (rada osiedla)",
  seniorem: "Instr. Sg. von senior (opieka nad seniorem)",
  rolada: "Nom. Sg. (Rinderroulade, schlesisches Sonntagsessen)",
  kluskami: "Instr. Pl. von kluska (Klösse)",
  czynne: "Adj. czynny, Nom. Sg. n. (biuro czynne)",
  trzynastej: "Ordinalzahl, Lok. Sg. f. (o trzynastej: um 13 Uhr)",
  miesięczny: "Adj. miesięczny, Akk. Sg. m. unbelebt (bilet miesięczny: Monatskarte)",
  odnawiamy: "1. Pl. von odnawiać (Versicherung erneuern)",
  okresowe: "Adj. okresowy, Akk. Pl. (badania okresowe: arbeitsmedizinische Untersuchung)",
  audiobooki: "Nom. Pl. von audiobook (Lehnwort, so geschrieben)",
  wnuczkę: "Akk. Sg. von wnuczka",
  mlecznym: "Adj. mleczny, Lok. Sg. m. (bar mleczny: Milchbar)",
  zaufany: "Adj. zaufany, Akk. Sg. m. unbelebt (profil zaufany: staatliche E-ID)",
  zakładamy: "1. Pl. von zakładać (ein Profil anlegen)",
  zamawiamy: "1. Pl. von zamawiać",
  szybowcowe: "Adj. szybowcowy, Nom. Sg. n. (lotnisko szybowcowe: Segelflugplatz)",
  // g (28)
  oddaje: "3. Sg. von oddawać (krew oddawać: Blut spenden)",
  porcie: "Lok. Sg. von port",
  agencja: "Nom. Sg. (agencja zatrudnienia: Arbeitsvermittlung)",
  księgowa: "Nom. Sg. f., substantiviertes Adj. (Buchhalterin)",
  faktury: "Akk. Pl. von faktura (Rechnung)",
  licznik: "Nom. Sg. (Zähler)",
  wymieniono: "unpersönliche -no-Form von wymienić",
  szczepienie: "Nom. Sg. n. (Impfung)",
  grypie: "Dat. Sg. von grypa (przeciw grypie)",
  lekarski: "Adj. lekarski, Nom. Sg. m. (gabinet lekarski)",
  naborze: "Lok. Sg. von nabór (Stellenausschreibung)",
  nadgodziny: "Akk. Pl. (Überstunden, Pluraletantum)",
  samoobsługowa: "Adj. samoobsługowy, Nom. Sg. f. (kasa samoobsługowa: Selbstbedienungskasse)",
  pyry: "Nom. Pl. von pyra (Kartoffel, großpolnisch; Befund PL-T3)",
  gzikiem: "Instr. Sg. von gzik (Quark mit Zwiebeln, Posen; pyry z gzikiem)",
  syntezator: "Nom. Sg. (syntezator mowy: Sprachausgabe)",
  składamy: "1. Pl. von składać (einen Antrag stellen)",
  gminie: "Lok. Sg. von gmina (Gemeinde)",
  zapisuje: "3. Sg. von zapisywać (się: sich anmelden)",
  kardiologa: "Gen. Sg. von kardiolog (u kardiologa)",
  czytnika: "Gen. Sg. von czytnik (czytnik ekranu: Screenreader)",
  // ż (29)
  kuracjuszy: "Gen. Pl. von kuracjusz (Kurgast)",
  podziemnym: "Adj. podziemny, Lok. Sg. m. (garaż podziemny: Tiefgarage)",
  zażalenie: "Akk. Sg. n. (Beschwerde, Rechtsmittel)",
  wysyłamy: "1. Pl. von wysyłać",
  listem: "Instr. Sg. von list (listem poleconym: per Einschreiben)",
  służbowy: "Adj. służbowy, Nom. Sg. m. (dienstlich)",
  zaplanowano: "unpersönliche -no-Form von zaplanować",
  dyżurna: "Adj. dyżurny, Nom. Sg. f. (apteka dyżurna: Notdienstapotheke)",
  żłobku: "Lok. Sg. von żłobek (Kinderkrippe)",
  sękacz: "Nom. Sg. (Baumkuchen aus Podlasie)",
  rożnie: "Lok. Sg. von rożen (Bratspiess)",
  trzymamy: "1. Pl. von trzymać",
  segregatorze: "Lok. Sg. von segregator (Aktenordner)",
  rejestrowany: "Partizip/Adj. rejestrowany, Nom. Sg. m. (bagaż rejestrowany: Aufgabegepäck)",
  kawalerka: "Nom. Sg. (Einzimmerwohnung)",
  piwnicę: "Akk. Sg. von piwnica",
  przedłużono: "unpersönliche -no-Form von przedłużyć",
  planowano: "unpersönliche -no-Form von planować (niż planowano)",
  // ą (30)
  wymieniają: "3. Pl. von wymieniać (unbestimmtes „sie“)",
  podziemne: "Adj. podziemny, Nom. Pl. nicht-mannpersonal (podziemne bunkry)",
  bunkry: "Nom. Pl. von bunkier",
  skarbowy: "Adj. skarbowy, Nom. Sg. m. (urząd skarbowy: Finanzamt)",
  kąpielisko: "Nom. Sg. n. (Freibad, Badestelle)",
  zawodowy: "Adj. zawodowy, Nom. Sg. m. (związek zawodowy: Gewerkschaft)",
  rybacy: "Nom. Pl. von rybak",
  wypływają: "3. Pl. von wypływać (w morze: auslaufen)",
  mineralną: "Adj. mineralny, Akk. Sg. f. (woda mineralna)",
  brajlowski: "Adj. zu brajl, Nom. Sg. m. (monitor brajlowski: Braillezeile)",
  linijkę: "Akk. Sg. von linijka (Zeile)",
  zastępstwa: "Gen. Sg. von zastępstwo (szukać + Gen.: Vertretung)",
  przelew: "Akk. Sg. (Überweisung)",
  biurowi: "Adj. biurowy, Nom. Pl. m.-pers. (pracownicy biurowi)",
  elastyczne: "Adj. elastyczny, Akk. Pl. (elastyczne godziny: Gleitzeit)",
  sadzimy: "1. Pl. von sadzić (pflanzen; Zwilling sądzimy gelesen)",
  rozpatruje: "3. Sg. von rozpatrywać (się: unpersönlich, Anträge bearbeiten)",
  // ś (31)
  kadr: "Gen. Pl. von kadry (dział kadr: Personalabteilung)",
  zdalnie: "Adverb (aus der Ferne: pracować zdalnie)",
  cyfr: "Gen. Pl. von cyfra",
  otwartą: "Partizip/Adj. otwarty, Akk. Sg. f.",
  księgową: "Instr. Sg. f. von księgowa (z księgową)",
  kiełbasę: "Akk. Sg. von kiełbasa",
  śląską: "Adj. śląski, Akk. Sg. f. (kiełbasa śląska, klein: Adjektiv)",
  niepełnosprawnością: "Instr. Sg. von niepełnosprawność (osoby z niepełnosprawnością - Person zuerst)",
  opłatę: "Akk. Sg. von opłata",
  kwartał: "Akk. Sg. (co kwartał: vierteljährlich)",
  // ć (32)
  rodzicielski: "Adj. rodzicielski, Nom. Sg. m. (urlop rodzicielski: Elternzeit)",
  skarbowego: "Adj. skarbowy, Gen. Sg. m. (do urzędu skarbowego)",
  podpisaniem: "Instr. Sg. des Verbalsubstantivs podpisanie (przed podpisaniem)",
  nocnej: "Adj. nocny, Lok. Sg. f. (po nocnej zmianie)",
  dostawcę: "Akk. Sg. von dostawca (Anbieter)",
  brajlu: "Lok. Sg. von brajl (Brailleschrift: książki w brajlu)",
  tyfloinformatyk: "Nom. Sg. (Fachkraft für Hilfsmittel bei Blindheit; Beruf technik tyfloinformatyk)",
  dobrać: "Infinitiv (passend auswählen)",
  kaloryfery: "Akk. Pl. von kaloryfer (Heizkörper)",
  // h (33)
  parkingowych: "Adj. parkingowy, Gen. Pl. (brakuje + Gen.)",
  działki: "Gen. Sg. von działka (Grundstück; nach Verneinung Gen.)",
  przychodni: "Lok. Sg. von przychodnia (Ambulanz)",
  spłacamy: "1. Pl. von spłacać (abzahlen)",
  kopalnię: "Akk. Sg. von kopalnia (zamienić w + Akk.: dawna kopalnia Guido)",
  dawną: "Adj. dawny, Akk. Sg. f.",
  zamieniono: "unpersönliche -no-Form von zamienić",
  zwiedzamy: "1. Pl. von zwiedzać",
  podziemia: "Akk. Pl. n. (Untergrund, Stollen)",
  kredowe: "Adj. kredowy, Akk. Pl. n. (podziemia kredowe: Kreidestollen in Chełm)",
  wynajmujemy: "1. Pl. von wynajmować (mieten)",
  wywozu: "Gen. Sg. von wywóz (wywóz śmieci: Müllabfuhr)",
  gminy: "Gen. Sg. von gmina",
  chorobowe: "Adj. chorobowy, Nom. Sg. n. (zwolnienie chorobowe)",
  stresie: "Lok. Sg. von stres",
  kuracjusze: "Nom. Pl. von kuracjusz",
  spacerują: "3. Pl. von spacerować",
  tężniach: "Lok. Pl. von tężnia (Gradierwerk)",
  spala: "3. Sg. von spalać (verbrennen; Zwilling spała gelesen)",
  brunatny: "Adj. brunatny, Akk. Sg. m. unbelebt (węgiel brunatny: Braunkohle)",
  połoninach: "Lok. Pl. von połonina (Bergweide in den Bieszczady)",
  zakłady: "Nom. Pl. von zakład (zakłady chemiczne: Chemiewerke)",
  orientacji: "Gen. Sg. von orientacja (kurs orientacji przestrzennej, verkürzt)",
  laską: "Instr. Sg. von laska (biała laska: Langstock)",
  promenada: "Nom. Sg. (Strandpromenade)",
  buraki: "Akk. Pl. von burak",
  cukrowe: "Adj. cukrowy, Akk. Pl. (buraki cukrowe: Zuckerrüben)",
  // ó (34)
  budowlane: "Adj. budowlany, Nom. Pl. (firmy budowlane)",
  spawaczy: "Gen. Pl. von spawacz (Schweisser; szukać + Gen.)",
  elektryków: "Gen. Pl. von elektryk",
  twierdza: "Nom. Sg. (Festung; Twierdza Przemyśl)",
  dorabia: "3. Sg. von dorabiać (dazuverdienen)",
  mieszkaniowa: "Adj. mieszkaniowy, Nom. Sg. f. (wspólnota/spółdzielnia mieszkaniowa)",
  spółdzielnia: "Nom. Sg. (Genossenschaft)",
  remontuje: "3. Sg. von remontować",
  winobrania: "Gen. Sg. von winobranie (Weinlese, Fest in Zielona Góra)",
  grule: "Nom./Akk. Pl. von grula (Kartoffel, goralisch; Recherche §3.1)",
  dopłaca: "3. Sg. von dopłacać (bezuschussen)",
  pieców: "Gen. Pl. von piec (Ofen)",
  sadownicy: "Nom. Pl. von sadownik (Obstbauer)",
  mobywatel: "Name der staatlichen App mObywatel (so geschrieben, klein verglichen)",
  wyrobów: "Gen. Pl. von wyrób (Erzeugnis)",
  kiszone: "Partizip/Adj. kiszony, Akk. Pl. (ogórki kiszone)",
  białorusku: "Adverb-Form po białorusku (auf Belarussisch)",
  // ń (35)
  deklarację: "Akk. Sg. von deklaracja",
  podpisy: "Akk. Pl. von podpis (Unterschriften sammeln)",
  wtórnego: "Adj. wtórny, Gen. Sg. m. (rynek wtórny: Gebrauchtwohnungsmarkt)",
  przysługuje: "3. Sg. von przysługiwać (zustehen)",
  piętnastej: "Ordinalzahl, Lok. Sg. f. (o piętnastej: um 15 Uhr)",
  ośrodek: "Nom. Sg. (Zentrum)",
  targowy: "Adj. targowy, Nom. Sg. m. (ośrodek targowy: Messestandort)",
  uniwersyteckim: "Adj. uniwersytecki, Instr. Sg. n. (miastem uniwersyteckim)",
  // x (36)
  zapisujemy: "1. Pl. von zapisywać (speichern)",
  księgowych: "Gen. Pl. von księgowy (dla księgowych)",
  rozwozi: "3. Sg. von rozwozić (ausliefern)",
  // ź (37)
  grzewczy: "Adj. grzewczy, Nom. Sg. m. (sezon grzewczy: Heizperiode)",
  kopalniach: "Lok. Pl. von kopalnia",
  wichurze: "Lok. Sg. von wichura (Sturm; po wichurze)",
  wsie: "Nom. Pl. von wieś",
  dwujęzycznymi: "Adj. dwujęzyczny, Instr. Pl. (zweisprachige Ortstafeln)",
  tablicami: "Instr. Pl. von tablica",
  służbowym: "Adj. służbowy, Lok. Sg. m. (na wyjeździe służbowym)",
  // v (38)
  fakturze: "Lok. Sg. von faktura",
  voucher: "Akk. Sg. (Lehnwort, so geschrieben)",
  spa: "Gen. Sg., unflektiert (Lehnwort: do spa)",
  volvo: "Instr. Sg., unflektiert (Automarke als Gattungswort, klein: jeździ starym volvo)",
  // q (39)
  vadis: "Teil des Buchtitels Quo vadis (lateinisch, so geschrieben)",
  quadem: "Instr. Sg. von quad (Lehnwort, so geschrieben)",
  wnukami: "Instr. Pl. von wnuk",
  aquaparku: "Gen. Sg. von aquapark (Lehnwort, so geschrieben)",
  pubie: "Lok. Sg. von pub",
  fitness: "unflektiertes Lehnwort (klub fitness)",
  squasha: "Akk. Sg. von squash (grać w squasha, belebt gebeugt)",
  dawnej: "Adj. dawny, Lok. Sg. f.",
  godka: "Nom. Sg. (schlesisch: Sprache, Rede - śląska godka)",
  jodłową: "Adj. jodłowy, Akk. Sg. f. (Puszcza Jodłowa)",
  wędrują: "3. Pl. von wędrować (Wanderdünen)",
  ruchome: "Adj. ruchomy, Nom. Pl. (ruchome wydmy)",
  wydmy: "Nom. Pl. von wydma (Düne)",
  porcelanę: "Akk. Sg. von porcelana",
  spotkań: "Gen. Pl. von spotkanie (bez spotkań)",
};

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
      if (w.length < 2 || istNameOderOrt(z, i) || BASIS.has(w) || w in VON_HAND_BELEGT) return;
      out.add(w);
    });
  }
  return [...out];
}

/**
 * „Ogonek-Zwillinge": Formen ohne Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist (pracuje/pracuję, umowa/umową,
 * ze/że, sadzimy/sądzimy, traci/trąci). Ein fehlender Ogonek ergäbe hier ein ANDERES Wort - und das Lexikon kennt auch
 * Tippfehler-Formen. Jede Zeile mit so einem Wort ist GELESEN (Befund §5): die geschriebene Form ist gemeint.
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
  "Kurier zostawia paczki w paczkomacie.", // paczki = Pakete, nicht pączki
  "Pensja wpada na konto przed weekendem.",
  "Dentysta przyjmuje we wtorki i czwartki.",
  "Oksana pracuje w Rzeszowie jako fryzjerka.", // jako + Nom.
  "Kopia umowy najmu jest w teczce.",
  "Mama od roku mieszka w domu opieki.",
  "Pisma przyjmuje okienko podawcze na parterze.",
  "Mieszkanie jest na ostatnim piętrze, a winda często się psuje.",
  "We Wrocławiu Anna znalazła pracę w firmie z Niemiec.",
  "Teresa do emerytury uczyła w szkole w Kutnie.",
  "Umowa o dzieło nie daje prawa do urlopu.", // nie daje + Gen. prawa
  "Biblioteka miejska ma nowe audiobooki.",
  "Babcia odbiera wnuczkę z przedszkola.",
  "Wizyta u lekarza na NFZ jest bezpłatna.",
  "W Gdyni wielu ludzi pracuje w porcie.",
  "Kolega z biura pomaga nam w przeprowadzce.",
  "Agnieszka pracuje jako pielęgniarka w Lesznie.",
  "Magda pisze kod dla firmy z Kanady.",
  "Druga zmiana zaczyna o czternastej.",
  "Na kurs angielskiego zapisuje się cała rodzina.",
  "W zespole każdy ma swoje zadania.", // zadania = Aufgaben, nicht żądania
  "Tata leży w szpitalu w Radomiu.",
  "Laptop służbowy zostaje w biurze.",
  "Każdy wniosek dostaje numer sprawy.",
  "Sprawa w sądzie rodzinnym trwa od roku.",
  "Z lotniska w Modlinie latają tanie linie.", // linie = Fluglinien (Nom. Pl.)
  "Wiosną w ogrodzie sadzimy pomidory.", // sadzimy = pflanzen, nicht sądzimy
  "Po zwolnieniu pracodawca wydaje świadectwo pracy.",
  "Płaca minimalna rośnie co roku.",
  "Nasza firma zatrudnia też osoby z niepełnosprawnością.",
  "Dziadek nie chce sprzedać działki.",
  "Kierownik choruje od poniedziałku.",
  "Iryna pochodzi z Charkowa i pracuje w Lublinie.",
  "Rozmowa z psychologiem pomaga w stresie.",
  "Elektrownia w Bełchatowie spala węgiel brunatny.", // spala = verbrennt, nicht spała
  "Twierdza Przemyśl przyciąga turystów z całej Polski.",
  "Mój dowód osobisty traci ważność w maju.", // traci = verliert, nicht trąci
  "Wokół Rzeszowa działa Dolina Lotnicza.",
  "Zielona Góra słynie z winobrania.",
  "Danuta pracuje na pół etatu w bibliotece.",
  "Córka studiuje w Lublinie.",
  "Nowa Sól wzięła nazwę od handlu solą.",
  "Krosno słynie z wyrobów ze szkła.", // ze vor szk-, nicht że
  "W Gdańsku na Długim Targu zawsze jest tłum.",
  "Ceny mieszkań rosną szybciej niż pensje.", // pensje = Nom. Pl.
  "Alex rozwozi paczki po Poznaniu.",
  "Na urodziny siostra dostała voucher do spa.",
]);

describe("PL-T6: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (gemessen: höchstens 5)", () => {
    expect(zuHaeufig(ZEILEN)).toEqual([]);
    expect(zuHaeufig(ZEILEN, 5)).toEqual([]);
  });

  /**
   * Falle 45 (das Budget gilt je STUFE): über beide Erwachsenen-Chargen (PL-T3 früh + PL-T6 Mitte) steht kein Inhaltswort
   * in mehr als 8 Zeilen (gemessen: höchstens 7, „mieszkanie"; „pracy" 6, „pracę" 6 - PL-T9 hält diese knapp).
   */
  it("auch über beide Erwachsenen-Chargen (T3 + T6) steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    expect(FRUEHE_ERWACHSENE.length).toBeGreaterThan(150);
    const fehler = zuHaeufig([...FRUEHE_ERWACHSENE, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross am Satzanfang), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Umowa" : "Nowa umowa"} jest ${"abcdefghi"[i]}.`);
    expect(zuHaeufig(neun)).toEqual(['"umowa": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => woerter(t).filter((w) => gesperrtPl(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), kartacze, pijany und inwalidzki (Wortbasis) werden gefunden, gotówka und urząd nicht", () => {
    expect(istKernGesperrtPl("Kurwa")).toBe(true);
    expect(gesperrtPl("kartacze")).toBe(true);
    expect(gesperrtPl("pijany")).toBe(true);
    expect(gesperrtPl("inwalidzki")).toBe(true); // darum „pies przewodnik", „biała laska" - nie „wózek inwalidzki"
    expect(gesperrtPl("gotówką")).toBe(false);
    expect(gesperrtPl("Urząd")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder ist von Hand belegt (Namen und Orte: Listen oben)", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Liste trägt nur, was wirklich gebraucht wird und nicht ohnehin bekannt ist (sonst wächst sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => woerter(z).map((w) => w.toLowerCase())));
    expect(Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine Form ohne Ogonek, die es so nicht gibt, werden gemeldet", () => {
    expect(ungeprueft(["Ewa lubi plaxe.", "Urzad wyslal pismo."])).toEqual(["plaxe", "urzad", "wyslal"]);
    expect(ungeprueft(["Ewa wynajęła mieszkanie w Opolu."])).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => woerter(z).some((w) => w.length >= 2 && !isRealWord(w, "pl")));
    expect(buchstabiert).toEqual([]);
  });

  it("jede Zeile mit einem Ogonek-Zwilling ist gelesen (pracuje/pracuję, umowa/umową, ze/że) - und nur diese", () => {
    const mit = ZEILEN.filter(mitZwilling);
    expect(mit.filter((z) => !ZEILEN_MIT_ZWILLING_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_ZWILLING_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Urzad wyslal nam pismo, ze to pilne.“ hat Zwillinge (ze/że), „Ewa wynajęła mieszkanie w Opolu.“ nicht", () => {
    expect(mitZwilling("Urzad wyslal nam pismo, ze to pilne.")).toBe(true);
    expect(ZWILLINGE.get("ze")).toContain("że");
    expect(mitZwilling("Ewa wynajęła mieszkanie w Opolu.")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich, Anker ────────────────────

/** Geschlecht und Zahl grob gleichgesetzt: „ona była …" / „on był …", „umowa" / „umowy" (Endvokal weg). */
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
/** Klein, ohne Satz- und Sonderzeichen: so kollidiert „Umowa najmu." mit „umowa najmu". */
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

describe("PL-T6: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der die neun polnischen Buchstaben NICHT kennt)", () => {
    expect(new Set(ZEILEN.map(ohneSatzzeichen)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("die Vergleichsmengen sind voll: T1-T5 in der rohen Sammelliste, tr/cs-Korpus, Serien und Banken (auch die it-Sfida)", () => {
    expect(ANDERE_PL_ZEILEN.length).toBeGreaterThanOrEqual(164 + 151 + 167 + 326 + 326);
    expect(ANDERE_PL().filter((i) => CORPUS_PL_WEG_MITTE_TEENS.includes(i)).length).toBe(CORPUS_PL_WEG_MITTE_TEENS.length);
    expect(CORPUS_TR.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(Object.keys(BANKEN).some((p) => /It[AB]?\.ts$/.test(p))).toBe(true);
  });

  it("keine Zeile gleicht einer Zeile oder einem Satz der Korpora, Serien und Banken aller Wege (Text oder Ledger-Schlüssel)", () => {
    expect(kopienGegen(ZEILEN, alleFremdenZeilen())).toEqual([]);
  });

  it("keine Zeile gleicht einer anderen pl-Charge (ROHE Sammelliste T1-T5 …), kein Paar", () => {
    expect(kopienGegen(ZEILEN, ANDERE_PL_ZEILEN)).toEqual([]);
    const fehler = paare(ZEILEN, ANDERE_PL_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich: gegen die eigene Charge und jede pl-Zeile (Jaccard ≥ 0,5), gegen alles andere (≥ 0,6)", () => {
    const fehler = [...fastGleich(ZEILEN, [...ZEILEN, ...ANDERE_PL_ZEILEN], 0.5), ...fastGleich(ZEILEN, alleFremdenZeilen(), 0.6)];
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: beim Schreiben verworfene Zeilen wären fast gleich mit PL-T5 bzw. einer pl-Zeile", () => {
    // „Pracę zaczynamy o ósmej." ~ T5 „Lekcje zaczynamy o ósmej." (3/5); „Na molo w Sopocie …" ~ „W Sopocie jest molo."
    expect(fastGleich(["Pracę zaczynamy o ósmej."], ANDERE_PL_ZEILEN, 0.5)).not.toEqual([]);
    expect(fastGleich(["Na molo w Sopocie latem wstęp jest płatny."], ANDERE_PL_ZEILEN, 0.5)).not.toEqual([]);
    expect(fastGleich(["Kuba robi zdjęcia."], ["Ola pisze list."], 0.5)).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung), und der Zuwachs ist die Zeilenzahl", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_PL()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    const eigeneIds = CHARGE.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(eigeneIds).size).toBe(ZEILEN.length);
    // Anker nur anhängend: die IDs dieser Charge stehen als geschlossener Block im Anker, keine davor (gemessen:
    // 15.932 ⇒ 16.262, „330 neu"; nach dem Merge mit TR-T2, CS-T2, TR-T3: 16.311 ⇒ 16.641, „330 neu").
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(start).toBeGreaterThanOrEqual(15932);
    expect(KORPUS_ANKER.slice(start, start + ZEILEN.length)).toEqual(eigeneIds);
    const eigen = new Set(eigeneIds);
    expect(KORPUS_ANKER.slice(0, start).filter((id) => eigen.has(id))).toEqual([]);
  });

  it("Gegenprobe: eine T1-Zeile gross und mit Punkt ist Kopie UND Paar; ą fällt im Ledger-Schlüssel weg; Paar über die Zahl", () => {
    expect(KINDERZEILEN).toContain("idę do kina");
    expect(paare(["Idę do kina."], KINDERZEILEN)).toHaveLength(1);
    expect(ANDERE_PL_ZEILEN.map((t) => bausteinKey("satz", t))).toContain(bausteinKey("satz", "Idę do kina."));
    // Der Schlüssel macht aus jedem der neun Buchstaben einen Trenner: „przyjdą pocztą" = „przyjdę pocztę".
    expect(bausteinKey("satz", "Wyniki przyjdą pocztą.")).toBe(bausteinKey("satz", "Wyniki przyjdę pocztę."));
    expect(paare(["Umowa najmu jest w teczce.", "Umowy najmu jest w teczce."])).toHaveLength(1);
    expect(paare(["Ola jest w pracy.", "Ola jest w domu."])).toEqual([]);
  });
});

describe("PL-T6: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt diese Charge als geschlossenen Block hinter T1-T5", () => {
    const start = PL_ROH.indexOf(CHARGE[0]);
    expect(start).toBeGreaterThanOrEqual(164 + 151 + 167 + 326 + 326);
    expect(start).toBeGreaterThan(PL_ROH.indexOf(CORPUS_PL_WEG_MITTE_TEENS[CORPUS_PL_WEG_MITTE_TEENS.length - 1]));
    expect(PL_ROH.slice(start, start + ZEILEN.length)).toEqual(CHARGE);
    expect(PL_ROH.slice(0, start).every((i) => !CHARGE.includes(i))).toBe(true);
  });

  it("korpusFuer(\"pl\") trägt jede Zeile (nichts von `mergeCorpus` still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("pl").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe pl t6.", kind: "satz" as const, stufen: ["erwachsen" as const] };
    const ids = manifestFor([
      ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe,
    ]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „pl“ bekommt für Erwachsene an q jede Zeile vollständig - und nur eigene pl-Erwachsenenzeilen", () => {
    const { letzte, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, letzte), "pl");
    const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "pl", lernweg: "pl", umschalt: true });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    const eigeneErwachsene = new Set(
      CORPUS_PL.filter((i) => i.nurWeg === "pl" && i.stufen.includes("erwachsen")).map((i) => fitText(i.text, allowed, "pl")),
    );
    expect(geliefert.filter((t) => !eigeneErwachsene.has(t))).toEqual([]);
  });

  it("an ⇧ kommen nur die ⇧-Zeilen an; vor ⇧ (D-2, umschalt: false) kommt von dieser Charge NICHTS an", () => {
    const { shift, o } = grenzen();
    const an = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(o.slice(0, shift), "pl"), lang: "pl", lernweg: "pl", umschalt: true });
    const serviertAnShift = ZEILEN.filter((t) => sprosseAuf(t) === shift).map((t) => fitText(t, allowedFromIntroduced(o.slice(0, shift), "pl"), "pl"));
    expect(serviertAnShift.filter((t) => t === null || !an.includes(t))).toEqual([]);
    const vor = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(o.slice(0, shift - 1), "pl"), lang: "pl", lernweg: "pl", umschalt: false });
    expect(vor.filter(hatGrossbuchstaben)).toEqual([]);
    const eigeneKlein = new Set(ZEILEN.map((t) => ohneSatzzeichen(t)));
    expect(vor.filter((t) => eigeneKlein.has(t.toLowerCase()))).toEqual([]);
  });

  it("Kinder, Jugendliche und die Wege „de“/„it“ bekommen keine dieser Zeilen", () => {
    const { o } = grenzen();
    const alle = allowedFromIntroduced(o, "pl");
    for (const stufe of ["kids", "teens"] as const) {
      const g = corpusItemsFor({ stufe, allowed: alle, lang: "pl", lernweg: "pl" });
      expect(ZEILEN.filter((t) => g.includes(t)), stufe).toEqual([]);
    }
    setLayout("de");
    const de = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
