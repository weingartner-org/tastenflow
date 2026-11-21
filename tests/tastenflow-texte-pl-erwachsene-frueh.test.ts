/**
 * ★★★ Wächter PL-T3 (03.10.2026): die frühen pl-Texte für ERWACHSENE
 * (`corpusPlWegFruehErwachsene.ts`, Sprossen 7-22 auf der Tastatur `pl` - bis zur
 * Sprosse vor ⇧). Kopiert und angepasst aus dem Wächter des Piloten
 * (`tastenflow-texte-pl-kids-frueh.test.ts`); Vorbild für Erwachsene:
 * `tastenflow-texte-it-erwachsene-frueh.test.ts`. Befund
 * `BEFUND-2026-10-02-PL-T3-ERWACHSENE-FRUEH.md`, Leitfaden Fallen 26/31/37/45/48/51/58/76.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText` sie mit
 * `introOrder("pl").slice(0, n)` durchlässt), nie aus einem Kommentar geglaubt.
 * Neu gegenüber PL-T1: keine Zeile gleicht einer Kinderzeile, keine bildet mit ihr ein
 * Paar oder ist ihr „fast gleich" (Falle 31); Erwachsene bekommen vor ⇧ nur Kleinschrift
 * (D-2, `umschalt: false`), Kinder keine Erwachsenenzeile. Es gibt KEINEN
 * Wörterbuch-Beleg für Polnisch (Falle 61): jedes Wort steht im Wortschatz oder in einer
 * Liste von Hand mit grammatischer Begründung, und jede Zeile mit einem
 * „Ogonek-Zwilling" (wolna/wolną, lek/lęk) ist gelesen. Jede Regel hat eine Gegenprobe.
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
import { CORPUS_PL_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusPlWegFruehKids";
import { CORPUS_PL_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusPlWegFruehErwachsene";
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

const CHARGE = CORPUS_PL_WEG_FRUEH_ERWACHSENE;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN pl-Zeilen (T1 und jede spätere Charge): gegen sie gibt es keine Kopie, kein Paar, nichts „fast gleich". */
/**
 * ★ Merge mit PL-T2 (03.10.2026): verglichen wird mit der ROHEN Sammelliste aus `corpusPl.ts` (die Datenblätter, nach
 * Objekt). `CORPUS_PL` aus corpus.ts ist die GELADENE Liste nach `mergeCorpus` - dort ist eine Kopie schon still mit dem
 * Original verschmolzen, und ein Vergleich nach Text hätte sie als „eigene Zeile" herausgefiltert. Genau so standen neun
 * Zeilen wortgleich in PL-T2 (*stan konta, to fakt, cisza nocna, zaraz wracam …*), und der Wächter war grün; gefunden
 * hat es erst der Anker („159 neu" bei 168 Zeilen).
 */
const ANDERE_PL = () => PL_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_PL_ZEILEN = (): string[] => ANDERE_PL().map((i) => i.text);
const KINDER = CORPUS_PL_WEG_FRUEH_KIDS.map((i) => i.text);
/** Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste (und vor `o` einzige) Vokal. */
const ERSTE_SPROSSE = 7;
/** Die Charge reicht bis zur Sprosse vor ⇧ (Wächter unten: = `letzteSprosse()`). */
const GEBAUT_BIS = 22;
/** Einheiten der Folge, die kein Buchstabe sind und darum keine eigene Zeile brauchen (W6): `;` ist der Fingeranker. */
const OHNE_ZEILE: ReadonlySet<string> = new Set([";"]);

/** Die Sprosse direkt vor ⇧ - aus der Reihenfolge gerechnet, nicht gezählt. */
function letzteSprosse(): number {
  setLayout("pl");
  return introOrder("pl").indexOf(SHIFT_UNIT);
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis vor ⇧). */
function sprosseAuf(text: string): number | null {
  setLayout("pl");
  const o = introOrder("pl");
  const bis = o.indexOf(SHIFT_UNIT);
  for (let n = 1; n <= bis; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "pl"), "pl") !== null) return n;
  }
  return null;
}

describe("PL-T3: jede Zeile an ihrer Sprosse (Tastatur pl)", () => {
  it("die Folge vor ⇧: 22 Einheiten (Grundreihe mit ;, w o n t e i m z, ę, c y r p u)", () => {
    setLayout("pl");
    expect(introOrder("pl").slice(0, 22).join(" ")).toBe("f j d k s l a ; w o n t e i m z ę c y r p u");
    expect(letzteSprosse()).toBe(GEBAUT_BIS);
  });

  it(`jede Zeile passt an einer Sprosse ${ERSTE_SPROSSE}-${GEBAUT_BIS}, nicht früher, und minTier stimmt`, () => {
    const fehler: string[] = [];
    for (const item of CHARGE) {
      const s = sprosseAuf(item.text);
      if (s === null || s < ERSTE_SPROSSE || s > GEBAUT_BIS) fehler.push(`"${item.text}": Sprosse ${s}`);
      const tier = minTierFor(item.text, "pl");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ó, ł, ż, ą, h (nach ⇧) passen nie - auch nicht „wspólnota“, „urząd“, „chory“; ę an 17, u an 22", () => {
    for (const t of ["wspólnota mieszkaniowa", "urząd pracy", "chory", "zasiłek", "dowód osobisty"]) {
      expect(sprosseAuf(t), t).toBeNull();
    }
    expect(sprosseAuf("kasa lada skala")).toBe(7);
    expect(sprosseAuf("walka klas")).toBe(9);
    expect(sprosseAuf("wezmę wolne")).toBe(17);
    expect(sprosseAuf("umowa najmu")).toBe(22);
  });

  it("vor Sprosse 7 gibt es keinen Vokal, und Sprosse 8 (;) trägt keine Zeile", () => {
    setLayout("pl");
    const o = introOrder("pl");
    expect(o.slice(0, ERSTE_SPROSSE - 1).filter((u) => "aąeęioóuy".includes(u))).toEqual([]);
    expect(o[7]).toBe(";");
    expect(ZEILEN.filter((t) => sprosseAuf(t) === 8)).toEqual([]);
    expect(ZEILEN.filter((t) => t.includes(";"))).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von PL-T3 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. Wo sie unter 6
   * liegt, geben die Buchstaben für Erwachsene nicht mehr her (Befund §2): an 7 nur Wörter mit „a" (kasa, lada, skala),
   * an 9-11 nur „a" und „o" als Vokale; die Kinderwörter dort (las, sad, kawa dla was, sok) sind vergeben.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    7: 1, 8: 0, 9: 2, 10: 2, 11: 4, 12: 6, 13: 7, 14: 7, 15: 5, 16: 8, 17: 8, 18: 10, 19: 13, 20: 27, 21: 31, 22: 36,
  };

  it("je Sprosse mindestens so viele Zeilen wie gemessen (gerechnete Sprosse)", () => {
    const anzahl = new Map<number, number>();
    for (const t of ZEILEN) {
      const s = sprosseAuf(t);
      if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
      const soll = MINDESTENS_JE_SPROSSE[n] ?? 6;
      if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n}: ${anzahl.get(n) ?? 0} < ${soll}`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
  });
});

describe("PL-T3: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[]): string[] {
    setLayout("pl");
    const o = introOrder("pl");
    return zeilen
      .filter((z) => !z.text.includes(o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  it("jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse", () => {
    const zeilen = ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text) })).filter(
      (z): z is { text: string; sprosse: number } => z.sprosse !== null,
    );
    const fehler = ohneNeueEinheit(zeilen);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Einheit von a bis u (ausser dem Fingeranker ;) hat an ihrer Sprosse mindestens eine Erwachsenenzeile (W6)", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const fehlt: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
      if (OHNE_ZEILE.has(o[n - 1])) continue;
      const erlaubt = allowedFromIntroduced(o.slice(0, n), "pl");
      const treffer = ZEILEN.filter((t) => fitText(t, erlaubt, "pl") !== null && t.includes(o[n - 1]));
      if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet", () => {
    expect(ohneNeueEinheit([{ text: "walka klas", sprosse: 10 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "walka klas", sprosse: 9 }])).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor ⇧: genau die Buchstaben der Folge bis `u` (ę ist der einzige polnische) und einfache Leerzeichen. */
const ERLAUBTE_ZEICHEN = /^[acdefijklmnoprstuwyzę ]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t !== t.toLowerCase() || t !== t.trim() || t.includes("  ");

describe("PL-T3: vor ⇧ nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile ist klein geschrieben und besteht nur aus gelernten Buchstaben und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Punkt, ó, ą, Bindestrich und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["Umowa najmu", "umowa najmu.", "wspólnota", "urząd", "umowa-zlecenie", "umowa  najmu"]) {
      expect(formFehler(t), t).toBe(true);
    }
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
});

// ── Kein Geschlecht raten (Präsens 1. Person ist neutral, ein Prädikatsadjektiv nicht) ─────

/**
 * „jestem" + Adjektiv/Partizip verrät das Geschlecht der Person, die tippt (jestem zmęczony/zmęczona). Erlaubt ist nur
 * „jestem" + Präposition (jestem na diecie). Ohne `ł` gibt es keine Vergangenheit; sie prüft schon die Sprosse.
 */
const geschlechtFehler = (zeile: string): boolean => {
  const w = zeile.split(" ");
  const i = w.indexOf("jestem");
  return i >= 0 && i + 1 < w.length && !["na", "w", "we", "z", "ze", "do", "po", "u", "od", "przy", "nad", "pod", "za"].includes(w[i + 1]);
};

describe("PL-T3: keine Zeile legt das Geschlecht der tippenden Person fest", () => {
  it("kein „jestem“ mit Adjektiv oder Partizip", () => {
    expect(ZEILEN.filter(geschlechtFehler)).toEqual([]);
  });

  it("Gegenprobe: „jestem zmęczony“ und „jestem zajęta“ werden gefunden, „jestem na diecie“ nicht", () => {
    expect(geschlechtFehler("jestem zmęczony")).toBe(true);
    expect(geschlechtFehler("dziś jestem zajęta")).toBe(true);
    expect(geschlechtFehler("jestem na diecie")).toBe(false);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Wortbasis, Ogonek-Zwillinge ────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. */
const FUNKTIONSWOERTER = new Set(
  (
    "a i w we z ze na do od o po za nad pod przed dla jak to ten ta te tak nie się mi mnie ja ty on ona ono my wy " +
    "oni one jest są ma mam masz mamy czy co oraz lub ale no"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(z.split(" "))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
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
 * für Polnisch, Falle 61). Jedes ist eine gewöhnliche Form eines Standardworts; die Begründung steht daneben. Über den
 * Korpus kommen sie ins Vorlese-Lexikon, die Stimme spricht sie ganz.
 * ⚠️ Von keiner Person mit Polnisch als Erstsprache gelesen (Befund §4a).
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  sodowa: "Adjektiv zu soda, Nom. Sg. f. (woda sodowa)",
  notatka: "Nom. Sg. (Notiz)",
  lokata: "Nom. Sg. (Festgeld bei der Bank)",
  zdalnie: "Adverb zu zdalny (aus der Ferne, Homeoffice)",
  nocna: "Adjektiv zu noc, Nom. Sg. f. (nocna zmiana, cisza nocna)",
  senne: "Adjektiv zu sen, Nom. Sg. n. (senne miasteczko)",
  kamienicy: "Lok. Sg. von kamienica (Mietshaus)",
  rejestracja: "Nom. Sg. (Anmeldung in der Arztpraxis)",
  kontrolna: "Adjektiv, Nom. Sg. f. (wizyta kontrolna)",
  kierowniczka: "Nom. Sg. (Leiterin)",
  cerkwie: "Nom. Pl. von cerkiew (orthodoxe Kirche)",
  redyk: "Nom. Sg. (Schafauftrieb und -abtrieb, Podhale)",
  stoczni: "Lok. Sg. von stocznia (Werft)",
  remizie: "Lok. Sg. von remiza (Feuerwehrhaus)",
  emerytalny: "Adjektiv zu emerytura, Nom. Sg. m. (wiek emerytalny)",
  kapliczki: "Nom. Pl. von kapliczka (Wegkapelle, Bildstock)",
  siatka: "Nom. Sg. (Netz, Einkaufstasche)",
  zrywka: "Nom. Sg. (Krakauer Wort für die Plastiktüte)",
  miejscownik: "Nom. Sg. (Lokativ)",
  narzędnik: "Nom. Sg. (Instrumental)",
  syntezator: "Nom. Sg. (syntezator mowy)",
  zwolnienie: "Nom. Sg. (zwolnienie lekarskie: Krankschreibung)",
  skierowanie: "Nom. Sg. (Überweisung zum Facharzt)",
  pozytywna: "Adjektiv, Nom. Sg. f. (decyzja pozytywna)",
  kartofle: "Nom. Pl. von kartofel",
  pyry: "Nom. Pl. von pyra (Posener Wort für Kartoffel)",
  familoki: "Nom. Pl. von familok (schlesisches Arbeiterhaus)",
  kopalnie: "Nom. Pl. von kopalnia (Bergwerk)",
  korespondencji: "Gen. Sg. von korespondencja",
  zapiekanka: "Nom. Sg. (überbackenes Baguette)",
  pieczarkami: "Instr. Pl. von pieczarka (Champignon)",
  szanowna: "Adjektiv, Nom. Sg. f. (Briefanrede szanowna pani)",
  przelewu: "Gen. Sg. von przelew (Überweisung)",
  osiedla: "Gen. Sg. von osiedle (Wohnsiedlung)",
  spacja: "Nom. Sg. (Leerzeichen, Leertaste)",
  przędzalnia: "Nom. Sg. (Spinnerei)",
  podatku: "Gen. Sg. von podatek",
  trzynasta: "Ordinalzahl, Nom. Sg. f. (trzynasta emerytura)",
  najmu: "Gen. Sg. von najem (Miete)",
  dyktando: "Nom. Sg. (Diktat)",
  drukuje: "3. Sg. von drukować",
  rata: "Nom. Sg. (Rate)",
  zaoczne: "Adjektiv, Nom. Pl. (studia zaoczne: Wochenendstudium)",
  czytnik: "Nom. Sg. (czytnik ekranu: Screenreader)",
  wypoczynkowy: "Adjektiv, Nom. Sg. m. (urlop wypoczynkowy)",
  przesunięte: "Partizip Perfekt passiv von przesunąć, Nom. Sg. n.",
};

/** Wörter (ab zwei Buchstaben), die weder im Wortschatz standen noch von Hand belegt sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of z.split(" ")) if (w.length >= 2 && !BASIS.has(w) && !(w in VON_HAND_BELEGT)) out.add(w);
  }
  return [...out];
}

/** „Ogonek-Zwillinge" (wie PL-T1): Formen ohne Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist (wolna/wolną, lek/lęk). */
const ZWILLINGE: ReadonlyMap<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const v of BASIS) {
    if (!/[ąćęłńóśźż]/.test(v)) continue;
    const k = ohneOgonki(v);
    if (k !== v) m.set(k, [...(m.get(k) ?? []), v]);
  }
  return m;
})();
const mitZwilling = (zeile: string): boolean => zeile.split(" ").some((w) => ZWILLINGE.has(w));

/**
 * Jede Zeile mit einem Zwilling ist GELESEN (Befund §4a): gemeint ist die geschriebene Form - fast immer ein Nominativ
 * Sg. f. (wolna kasa, nie „wolną"), „lek na sen" (Arznei, nicht „lęk"), „wydaje mi się" (3. Sg., nicht „wydaję" = ich
 * gebe aus), „kieliszek wina" (Gen. von wino, nicht „winą"), „klient nasz pan" (nicht „pań").
 */
const ZEILEN_MIT_ZWILLING_GELESEN: ReadonlySet<string> = new Set([
  "kasa lada skala", "kawa jak kawa", "walka klas", "woda sodowa", "wolna kasa", "nowa wanna", "nowa data",
  "taka stawka", "lek na sen", "to inna kwestia", "minimalna stawka", "zmiana nazwiska", "kawa z mlekiem",
  "kieliszek wina", "nocna zmiana", "kolacja we dwoje", "winda jest nieczynna", "wydaje mi się",
  "rozmowa kwalifikacyjna", "rejestracja telefoniczna", "wizyta kontrolna", "cena za metr", "nowa kierowniczka",
  "spokojna dzielnica", "decyzja pozytywna", "klient nasz pan", "opieka nad rodzicami", "praca od zaraz",
  "kopia dokumentu", "trzynasta emerytura", "wizyta u dentysty", "zupa dnia", "ulica zamknięta",
  // ★ nach dem Merge mit PL-T2 neu (Ersatz für wortgleiche Zeilen, Befund §3c), gelesen: Nominativ gemeint
  "mocna kawa", "wizyta domowa", "rozmowa o awans",
]);

describe("PL-T3: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Wortbudget Erwachsene, F45)", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `jest umowa ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"umowa": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => t.split(" ").filter((w) => gesperrtPl(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), kartacze und pijany (Wortbasis) werden gefunden, kasa und kopalnie nicht", () => {
    expect(istKernGesperrtPl("kurwa")).toBe(true);
    expect(gesperrtPl("kartacze")).toBe(true);
    expect(gesperrtPl("pijany")).toBe(true);
    expect(gesperrtPl("kasa")).toBe(false);
    expect(gesperrtPl("kopalnie")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz (WORDS_PL, STUFE_VOCAB_PL, NACHTRAG_PL) oder ist von Hand belegt", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Liste trägt nur, was wirklich gebraucht wird und nicht ohnehin bekannt ist (sonst wächst sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    expect(Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine Form ohne Ogonek, die es so nicht gibt, werden gemeldet", () => {
    expect(ungeprueft(["umowa najmux", "dziekuje za kontakt"])).toEqual(["najmux", "dziekuje"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "pl")));
    expect(buchstabiert).toEqual([]);
  });

  it("jede Zeile mit einem Ogonek-Zwilling ist gelesen - und nur diese", () => {
    const mit = ZEILEN.filter(mitZwilling);
    expect(mit.filter((z) => !ZEILEN_MIT_ZWILLING_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_ZWILLING_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „lek na sen“ hat einen Zwilling (lęk), „prosze o kontakt“ (statt proszę) auch, „umowa najmu“ nicht", () => {
    expect(mitZwilling("lek na sen")).toBe(true);
    expect(ZWILLINGE.get("lek")).toContain("lęk");
    expect(mitZwilling("prosze o kontakt")).toBe(true);
    expect(mitZwilling("umowa najmu")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich, Anker ─────────────────────

/** Geschlecht und Zahl grob gleichgesetzt: „nowy szef" / „nowa szef…", „umowa najmu" / „umowy najmu" (Endvokal weg). */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", one: "PRO" };
  return zeile
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/[aeiouyąę]$/, "_"))
    .join(" ");
}

function paare(zeilen: string[], fremde: string[] = []): string[] {
  const gesehen = new Map<string, string>(fremde.map((z) => [paarForm(z), z]));
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

/**
 * „Fast gleich" (T1 §4a: *daj jajka* neben *daj dwa jajka*): zwei Zeilen teilen mindestens die Hälfte ihrer Wörter
 * (Jaccard der Wortmengen ≥ 0,5). Gemessen gegen die eigene Charge UND jede andere pl-Zeile.
 */
function fastGleich(zeilen: string[], fremde: string[]): string[] {
  const out: string[] = [];
  const alle = [...fremde, ...zeilen];
  for (const z of zeilen) {
    const a = new Set(z.split(" "));
    for (const y of alle) {
      if (y === z) continue;
      const b = new Set(y.toLowerCase().split(" "));
      const schnitt = [...a].filter((w) => b.has(w)).length;
      if (schnitt / new Set([...a, ...b]).size >= 0.5) out.push(`"${z}" ~ "${y}"`);
    }
  }
  return out;
}

const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_TR, ...CORPUS_CS];

describe("PL-T3: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der die neun polnischen Buchstaben NICHT kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    const schluessel = ZEILEN.map((t) => bausteinKey("satz", t));
    expect(new Set(schluessel).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/tr/cs oder einer anderen pl-Charge (Text oder Ledger-Schlüssel)", () => {
    const fremd = [...FREMDE_KORPORA(), ...ANDERE_PL()];
    const texte = new Set(fremd.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CHARGE.filter((i) => texte.has(i.text) || schluessel.has(bausteinKey(i.kind, i.text))).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: eine PL-T1-Zeile wäre erkannt, und „umowa o pracą“ hat den Schlüssel von „umowa o pracę“", () => {
    const t1 = new Set(ANDERE_PL().map((i) => bausteinKey(i.kind, i.text)));
    expect(t1.has(bausteinKey("satz", KINDER[0]))).toBe(true);
    expect(bausteinKey("satz", "umowa o pracą")).toBe(bausteinKey("satz", "umowa o pracę"));
  });

  it("keine Paare in der Charge und keines mit einer anderen pl-Zeile (nur Geschlecht oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_PL_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „umowa najmu“/„umowy najmu“ und eine Kinderzeile mit getauschter Zahl werden als Paar erkannt", () => {
    expect(paare(["umowa najmu", "umowy najmu"])).toHaveLength(1);
    expect(paare(["fajne lalki"], KINDER)).toHaveLength(1);
    expect(paare(["kredyt na remont"], ["dom do remontu"])).toEqual([]);
  });

  it("keine Zeile ist einer anderen (eigen oder pl) fast gleich - die Hälfte der Wörter geteilt", () => {
    const fehler = fastGleich(ZEILEN, ANDERE_PL_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „przelew na konto“ neben „atak na konto“ und „czas na kawę“ neben „czas na kolację“ (T1) sind fast gleich", () => {
    expect(fastGleich(["przelew na konto"], ["atak na konto"])).toHaveLength(1);
    expect(fastGleich(["czas na kawę"], KINDER)).toHaveLength(1);
    // Beim Schreiben gefunden (Befund §4a): „jeszcze nie wiem“ neben „nie wiem“, „jutro mam wolne“ neben „jutro mam urodziny“.
    expect(fastGleich(["jeszcze nie wiem", "jutro mam wolne"], KINDER)).toHaveLength(2);
    expect(fastGleich(["kredyt na remont"], ["dom do remontu"])).toEqual([]);
  });
});

/**
 * ★ Merge mit PL-T2, TR-T1, CS-T1 und Italienisch komplett (03.10.2026): Kopien und „fast gleich" auch gegen ALLES, was
 * sonst Text trägt - alle Korpora, alle Serien aller Sprachen und alle Prüfungstext-Banken (`schreibproben/texte*.ts`,
 * auch die italienischen Sfida-Banken), Zeile für Zeile und Satz für Satz (Muster: TR-T1, Jaccard ≥ 0,6 wie Falle 51).
 */
const BANKEN = import.meta.glob("../src/lib/typing/schreibproben/texte*.ts", { eager: true }) as Record<
  string,
  Record<string, unknown>
>;
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
function alleFremdenZeilen(): string[] {
  const roh = [
    ...FREMDE_KORPORA().map((i) => i.text),
    ...ANDERE_PL_ZEILEN(),
    ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ...bankZeilen(),
  ];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}
const ohneZeichen = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
const wortMenge = (t: string) => new Set(ohneZeichen(t).split(" ").filter(Boolean));
function fastGleich06(a: Set<string>, b: Set<string>): boolean {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s) >= 0.6;
}

describe("PL-T3: keine Kopie und nichts fast gleich - gegen Korpora, Serien und Prüfungstext-Banken aller Sprachen", () => {
  it("die Vergleichsmenge ist voll (Serien und Banken geladen, auch tr/cs und die it-Sfida)", () => {
    expect(Object.keys(BANKEN).some((p) => /It[AB]?\.ts$/.test(p))).toBe(true);
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(CORPUS_TR.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(ANDERE_PL().length).toBeGreaterThan(CORPUS_PL_WEG_FRUEH_KIDS.length);
  });

  it("keine Zeile gleicht einer fremden Zeile oder einem fremden Satz (ohne Satzzeichen, klein) oder ihrem Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    const fehler = ZEILEN.filter((t) => texte.has(ohneZeichen(t)) || schluessel.has(bausteinKey("satz", t)));
    expect(fehler).toEqual([]);
  });

  it("nichts fast gleich gegen fremde Zeilen (Wortmenge, Jaccard ≥ 0,6)", () => {
    const fremd = alleFremdenZeilen().map((t) => [t, wortMenge(t)] as const);
    const fehler: string[] = [];
    for (const z of ZEILEN) {
      const m = wortMenge(z);
      for (const [t, f] of fremd) if (fastGleich06(m, f)) fehler.push(`"${z}" ~ "${t}"`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: eine Serienzeile, ein Banken-Satz und eine PL-T2-Zeile werden als Kopie erkannt", () => {
    const fremd = new Set(alleFremdenZeilen().map(ohneZeichen));
    expect(fremd.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    // „stan konta" stand vor dem Merge in PL-T3 UND in PL-T2 (Befund §3c).
    expect(fremd.has("stan konta")).toBe(true);
    expect(fastGleich06(wortMenge("umowa o pracę"), wortMenge("pracę o umowa"))).toBe(true);
  });
});

describe("PL-T3: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_PL und korpusFuer(\"pl\") tragen jede Zeile dieser Charge (nichts still verschmolzen), HINTER PL-T1", () => {
    const roh = new Set(CORPUS_PL.map((i) => i.text));
    const geladen = new Set(korpusFuer("pl").map((i) => i.text));
    expect(ZEILEN.filter((t) => !roh.has(t))).toEqual([]);
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
    expect(PL_ROH.indexOf(CHARGE[0])).toBeGreaterThan(PL_ROH.indexOf(CORPUS_PL_WEG_FRUEH_KIDS[CORPUS_PL_WEG_FRUEH_KIDS.length - 1]));
    expect(PL_ROH.slice(PL_ROH.indexOf(CHARGE[0]), PL_ROH.indexOf(CHARGE[0]) + CHARGE.length)).toEqual(CHARGE);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung mit einer anderen Zeile irgendeines Korpus)", () => {
    const fremdeIds = new Set(
      [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_TR, ...CORPUS_CS, ...ANDERE_PL()].map((i) =>
        bausteinId(i.kind, i.text),
      ),
    );
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "zzz probe pl t3", kind: "satz" as const, stufen: ["erwachsen" as const] };
    const ids = manifestFor([
      ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe,
    ]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „pl“ bekommt vor ⇧ für Erwachsene (D-2, umschalt: false) alle Zeilen dieser Charge - nur eigene, nur Kleinschrift", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "pl");
    const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "pl", lernweg: "pl", umschalt: false });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    const eigeneErwachsene = new Set(
      CORPUS_PL.filter((i) => i.nurWeg === "pl" && i.stufen.includes("erwachsen")).map((i) => i.text),
    );
    expect(geliefert.filter((t) => !eigeneErwachsene.has(t))).toEqual([]);
    expect(geliefert.filter(hatGrossbuchstaben)).toEqual([]);
  });

  it("Kinder auf Weg „pl“ bekommen keine Erwachsenenzeile", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const kids = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "pl"), lang: "pl", lernweg: "pl" });
    expect(ZEILEN.filter((t) => kids.includes(t))).toEqual([]);
  });

  it("Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const itO = introOrder("it");
    const it_ = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(itO, "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
