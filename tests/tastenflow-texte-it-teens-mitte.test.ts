/**
 * ★★★ Wächter IT-T5 (03.10.2026): die mittleren it-Texte für Jugendliche
 * (`corpusItWegMitteTeens.ts`, Sprossen ⇧ bis x: auf `it` 20-36, auf
 * `it-qzerty` 19-36). Vorbilder: `tastenflow-texte-it-kids-frueh.test.ts`
 * (IT-T1) und `tastenflow-texte-es-teens-mitte.test.ts` (ES-T5); Bauplan
 * `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §3/§5, Befund IT-T1 §6,
 * Leitfaden Fallen 26/31/37/45/48/51/58/76.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie
 * mit `introOrder("it").slice(0, n)` durchlässt - auf BEIDEN Pflicht-Tastaturen
 * -, mindestens aber die ⇧-Sprosse (Grossbuchstaben sind vor ⇧ nur über die
 * Auto-Grossschreibung tippbar, corpus.ts KERNREGEL; die Zeilen gehören zur
 * ⇧-Stufe). Die zwei Tastaturen rechnen VERSCHIEDEN: auf der Mac-QZERTY fehlt
 * `m` vor ⇧ (es ist dort Grundtaste), alles bis `ì` steht eine Sprosse früher,
 * und `ò` kommt erst nach `ì` (Nr. 32). Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { CORPUS_IT_WEG_MITTE_TEENS } from "../src/lib/typing/corpusItWegMitteTeens";
import { CORPUS_IT_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusItWegFruehKids";
import { CORPUS_IT_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusItWegFruehTeens";
import { CORPUS_IT_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusItWegFruehErwachsene";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { adaptiveRound } from "../src/lib/typing/generator";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtIt, istKernGesperrtIt } from "../src/lib/typing/sperrlisteIt";
import { WORDS_IT, STUFE_VOCAB_IT } from "../src/lib/typing/wordsIt";
import { NACHTRAG_IT } from "../src/lib/typing/lexikonNachtragIt";
import { isRealWord, normalizeWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/itTextRegeln";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["it", "it-qzerty"];
const ZEILEN = CORPUS_IT_WEG_MITTE_TEENS.map((i) => i.text);
/** Die frühe Kinder-Charge IT-T1 - keine Kopie, kein Paar mit ihr. */
const KINDERZEILEN = CORPUS_IT_WEG_FRUEH_KIDS.map((i) => i.text);
/** ★ Merge 03.10.2026: die parallel geschriebenen frühen Chargen IT-T2 (Jugend) und IT-T3 (Erwachsene). */
const FRUEHE_TEENS = CORPUS_IT_WEG_FRUEH_TEENS.map((i) => i.text);
const ERWACHSENENZEILEN = CORPUS_IT_WEG_FRUEH_ERWACHSENE.map((i) => i.text);
/** Alle anderen it-Chargen, gegen die Kopien, Ledger-Schlüssel und Paare geprüft werden (Falle 31, 51). */
const ANDERE_IT_ZEILEN = [...KINDERZEILEN, ...FRUEHE_TEENS, ...ERWACHSENENZEILEN];
/** Einheiten, die nie eine eigene Zeile tragen: Punkt und Komma sind weglassbar (D-1, `fitText`). */
const WEGLASSBAR = new Set([".", ","]);

/** ⇧-Sprosse und letzte Buchstaben-Sprosse (x) - aus der Reihenfolge der Tastatur gerechnet. */
function grenzen(layout: LayoutId): { shift: number; letzte: number; o: string[] } {
  setLayout(layout);
  const o = introOrder("it");
  return { shift: o.indexOf(SHIFT_UNIT) + 1, letzte: o.indexOf("x") + 1, o };
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis x). */
function buchstabenSprosse(text: string, layout: LayoutId): number | null {
  const { letzte, o } = grenzen(layout);
  for (let n = 1; n <= letzte; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "it"), "it") !== null) return n;
  }
  return null;
}

/** Die Sprosse der Zeile in dieser Charge: nie vor ⇧. */
function sprosseAuf(text: string, layout: LayoutId): number | null {
  const s = buchstabenSprosse(text, layout);
  return s === null ? null : Math.max(s, grenzen(layout).shift);
}

/** Enthält der Text die Einheit? ⇧ zeigt sich an einem Grossbuchstaben, alles andere am Zeichen selbst. */
function enthaeltEinheit(text: string, einheit: string): boolean {
  if (einheit === SHIFT_UNIT) return text !== text.toLowerCase();
  return text.toLowerCase().includes(einheit);
}

describe("IT-T5: jede Zeile an ihrer Sprosse (it und it-qzerty)", () => {
  it("die Folge ab ⇧: it 20-36, it-qzerty 19-36 (ò dort nach ì) - gemessen, nicht geglaubt", () => {
    const it_ = grenzen("it");
    expect(it_.shift).toBe(20);
    expect(it_.letzte).toBe(36);
    expect(it_.o.slice(19, 36).join(" ")).toBe(`${SHIFT_UNIT} . , g h b z è à ' q é ì ù y w x`);
    const qz = grenzen("it-qzerty");
    expect(qz.shift).toBe(19);
    expect(qz.letzte).toBe(36);
    expect(qz.o.slice(18, 36).join(" ")).toBe(`${SHIFT_UNIT} . , g h b z è à ' q é ì ò ù y w x`);
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile hat eine Sprosse von ⇧ bis x, und minTier stimmt`, () => {
      const { shift, letzte } = grenzen(l);
      const fehler: string[] = [];
      for (const item of CORPUS_IT_WEG_MITTE_TEENS) {
        const s = sprosseAuf(item.text, l);
        if (s === null || s < shift || s > letzte) fehler.push(`"${item.text}": Sprosse ${s}`);
        const tier = minTierFor(item.text, "it");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    /**
     * Eine ⇧-Zeile (Buchstaben bis p) passt über die Auto-Grossschreibung schon
     * vor ⇧. Sie trägt darum ein `p` - die letzte Einheit vor ⇧ auf BEIDEN
     * Tastaturen - und rutscht so höchstens eine Sprosse vor, nie in die
     * frühen Runden der Jugend-Charge T2.
     */
    it(`${l}: keine Zeile rutscht über die Auto-Grossschreibung mehr als eine Sprosse vor ⇧`, () => {
      const { shift } = grenzen(l);
      const fehler = ZEILEN.filter((t) => (buchstabenSprosse(t, l) ?? 0) < shift - 1);
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  it("die Sprossen der zwei Tastaturen: bis ì eine früher auf der QZERTY, ab ù gleich, ò-Zeilen dort an 32", () => {
    const fehler: string[] = [];
    for (const t of ZEILEN) {
      const si = sprosseAuf(t, "it") as number;
      const sq = sprosseAuf(t, "it-qzerty") as number;
      const soll = t.includes("ò") ? Math.max(32, si >= 33 ? si : 0) : si <= 32 ? si - 1 : si;
      if (sq !== soll) fehler.push(`"${t}": it ${si}, it-qzerty ${sq}, erwartet ${soll}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet, eine ⇧-Zeile ohne p rutscht, Elision und è nicht vor ihrer Einheit", () => {
    expect(sprosseAuf("Marta prende il pullman per Napoli.", "it")).toBe(20);
    expect(buchstabenSprosse("Marta prende il pullman per Napoli.", "it")).toBe(19);
    expect(buchstabenSprosse("Marta prende il pullman per Napoli.", "it-qzerty")).toBe(18);
    expect(buchstabenSprosse("Marco corre a Torino.", "it")).toBe(17); // ohne p: rutscht zwei Sprossen vor
    expect(buchstabenSprosse("Marco corre a Torino.", "it-qzerty")).toBe(15);
    expect(sprosseAuf("Il sole è caldo.", "it")).toBe(27);
    expect(sprosseAuf("C'è il sole.", "it")).toBe(29);
    expect(sprosseAuf("C'è il sole.", "it-qzerty")).toBe(28);
    expect(sprosseAuf("Lunedì andrò.", "it")).toBe(32);
    expect(sprosseAuf("Lunedì andrò.", "it-qzerty")).toBe(32);
    expect(sprosseAuf("Ho un box.", "it")).toBe(36);
  });

  /**
   * GEMESSEN am Ende von IT-T5 (vom Code gezählt) - jede Grenze darf künftig
   * nur STEIGEN. Unter 12 nur, wo die Sprache wenig hergibt: `ò` (QZERTY 32)
   * kommt nur in den fünf ò+ì-Zeilen vor, `x` und `w` sind Lehnwort-Buchstaben.
   * Punkt und Komma tragen keine eigene Zeile (weglassbar).
   */
  const MINDESTENS_JE_SPROSSE: Record<string, Record<number, number>> = {
    it: { 20: 29, 23: 22, 24: 19, 25: 18, 26: 21, 27: 22, 28: 19, 29: 28, 30: 21, 31: 15, 32: 17, 33: 18, 34: 16, 35: 13, 36: 11 },
    "it-qzerty": { 19: 29, 22: 22, 23: 19, 24: 18, 25: 21, 26: 22, 27: 19, 28: 28, 29: 21, 30: 15, 31: 12, 32: 5, 33: 18, 34: 16, 35: 13, 36: 11 },
  };

  for (const l of TASTATUREN) {
    it(`${l}: je Sprosse mindestens so viele Zeilen wie gemessen`, () => {
      const { shift, letzte, o } = grenzen(l);
      const anzahl = new Map<number, number>();
      for (const t of ZEILEN) {
        const s = sprosseAuf(t, l);
        if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
      }
      const zuWenig: string[] = [];
      for (let n = shift; n <= letzte; n++) {
        if (WEGLASSBAR.has(o[n - 1])) continue;
        const soll = MINDESTENS_JE_SPROSSE[l][n] ?? 12;
        if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n} (${o[n - 1]}): ${anzahl.get(n) ?? 0} < ${soll}`);
      }
      expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    });
  }
});

describe("IT-T5: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[], layout: LayoutId): string[] {
    const { o } = grenzen(layout);
    return zeilen
      .filter((z) => !enthaeltEinheit(z.text, o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse`, () => {
      const zeilen = ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text, l) ?? 0 }));
      const fehler = ohneNeueEinheit(zeilen, l);
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it(`${l}: jede Einheit von ⇧ bis x (ohne . ,) hat an ihrer Sprosse Zeilen (W6)`, () => {
      const { shift, letzte, o } = grenzen(l);
      const fehlt: string[] = [];
      for (let n = shift; n <= letzte; n++) {
        if (WEGLASSBAR.has(o[n - 1])) continue;
        const treffer = ZEILEN.filter((t) => sprosseAuf(t, l) === n && enthaeltEinheit(t, o[n - 1]));
        if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
      }
      expect(fehlt, `${l}: Einheiten ohne Zeile`).toEqual([]);
    });
  }

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet, Grossbuchstabe gilt als ⇧", () => {
    expect(enthaeltEinheit("Marta prende", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("marta prende", SHIFT_UNIT)).toBe(false);
    expect(ohneNeueEinheit([{ text: "Il bus parte.", sprosse: 23 }], "it")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Il bus parte.", sprosse: 25 }], "it")).toEqual([]);
    expect(ohneNeueEinheit([{ text: "Il bus parte.", sprosse: 24 }], "it-qzerty")).toEqual([]);
  });
});

// ── Die Apostroph-Sprosse: Elision (Pflicht, Befund IT-T1 §3a) ──────────────

/** Eine Elision: Buchstabe + Apostroph + Buchstabe (l'estate, c'è, un'ora) oder `po'`. */
const ELISION = /\p{L}'\p{L}|\bpo'/iu;

describe("IT-T5: Elision an der Apostroph-Sprosse", () => {
  for (const l of TASTATUREN) {
    it(`${l}: an der '-Sprosse tragen mindestens 24 Zeilen eine Elision - und keine Zeile davor hat eine`, () => {
      const { o } = grenzen(l);
      const sApo = o.indexOf("'") + 1;
      const anDerSprosse = ZEILEN.filter((t) => sprosseAuf(t, l) === sApo && ELISION.test(t));
      expect(anDerSprosse.length).toBeGreaterThanOrEqual(24);
      expect(ZEILEN.filter((t) => t.includes("'") && (sprosseAuf(t, l) ?? 0) < sApo)).toEqual([]);
    });
  }

  it("auch nach der '-Sprosse kommt die Elision weiter vor (mindestens 25 Zeilen danach, gemessen 28)", () => {
    const sApo = grenzen("it").o.indexOf("'") + 1;
    expect(ZEILEN.filter((t) => (sprosseAuf(t, "it") ?? 0) > sApo && ELISION.test(t)).length).toBeGreaterThanOrEqual(25);
  });

  it("Gegenprobe: l'estate, c'è, un'ora, po' sind Elisionen - ein Wort ohne Apostroph nicht", () => {
    for (const t of ["L'estate.", "C'è il sole.", "Un'ora.", "Un po' di relax."]) expect(ELISION.test(t), t).toBe(true);
    expect(ELISION.test("Lo zaino pesa.")).toBe(false);
  });

  for (const l of TASTATUREN) {
    it(`${l}: mit echtem Korpus steht an der '-Sprosse in echten Runden für Jugendliche eine Elision`, () => {
      const { o } = grenzen(l);
      const intro = o.slice(0, o.indexOf("'") + 1);
      const echt = Math.random;
      let s = 7301;
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
          for (const z of adaptiveRound({ introduced: intro, focus: ["'"], stufe: "teens", lang: "it", lernweg: "it", count: 12 })) {
            texte.push(z.text);
          }
        }
      } finally {
        Math.random = echt;
      }
      // Mindestens eine Zeile DIESER Charge kommt mit ihrer Elision an (nicht nur der Wort-Drill).
      expect(texte.some((t) => ZEILEN.includes(t) && ELISION.test(t)), texte.slice(0, 12).join(" / ")).toBe(true);
    });
  }
});

// ── Form: Satzanfang gross, Punkt am Ende, nur Zeichen bis x, Hausregeln ────

/** Buchstaben, kleine Akzente (Grossformen nie: unter Windows nicht tippbar), Apostroph, Komma, Punkt, Leerzeichen. */
const ERLAUBTE_ZEICHEN = /^[A-Za-zàèéìòù' ,.]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) ||
  t[0] === t[0].toLowerCase() ||
  !t.endsWith(".") ||
  t !== t.trim() ||
  t.includes("  ") ||
  /[,.](?=\S)/.test(t) || // nach Komma und Punkt ein Leerzeichen (der Schlusspunkt steht am Ende)
  / [,.]/.test(t) || // kein Leerzeichen vor Komma und Punkt
  /\. \p{Ll}/u.test(t); // nach einem Satzpunkt beginnt der nächste Satz gross

describe("IT-T5: Form", () => {
  it("jede Zeile beginnt gross, endet mit Punkt, hat nur Buchstaben, Apostroph, Komma und Punkt", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kleinschreibung am Anfang, fehlender Punkt, ?, !, Anführung, Ziffer, È, Leerzeichen vor Komma", () => {
    for (const t of [
      "il bus parte.", "Il bus parte", "Parti?", "Gol!", 'Dice "ciao".', "Ho 16 anni.", "È tardi.",
      "Ciao , Marta.", "Ciao,Marta.", "Piove. resto a casa.", "Hip-hop.",
    ]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("Sono le quattro. Il bus arriva tra poco.")).toBe(false);
    expect(formFehler("D'accordo, ci vediamo all'ingresso.")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller italienischen Zeilen (`helfer/itTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg it, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_IT_WEG_MITTE_TEENS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("it");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Orte und Namen: jedes Grosswort bekannt, Italien in seiner Breite ───────

/**
 * Orte, Landschaften und Feste mit ihrem Raum - als WORTGRUPPE (längste zuerst),
 * damit „San Marino" nicht als „Marino" und „Val Gardena" als ein Ort zählt.
 * N Norden · M Mitte (Toskana, Umbrien, Marken, Latium) · S Süden (Abruzzen bis
 * Kalabrien, wie ISTAT) · I Inseln · CH Tessin und italienisches Graubünden ·
 * BZ Südtirol · RSM San Marino · AUSLAND.
 */
const ORTE: Record<string, string> = {
  // Norden
  Torino: "N", Po: "N", Genova: "N", Padova: "N", Bologna: "N", Ferrara: "N", Venezia: "N", Chioggia: "N",
  Trieste: "N", Milano: "N", Bergamo: "N", Bormio: "N", Trento: "N", Trentino: "N", Marmolada: "N",
  "Gran Paradiso": "N", Forlì: "N", Cantù: "N", Rovigo: "N", Garda: "N", Tirano: "N",
  // Mitte
  Roma: "M", Ostia: "M", Latina: "M", Ponza: "M", Rieti: "M", Siena: "M", "Piazza del Campo": "M", Pisa: "M",
  Lucca: "M", Prato: "M", Pistoia: "M", Livorno: "M", Maremma: "M", Toscana: "M", Perugia: "M", Orvieto: "M",
  Urbino: "M", Senigallia: "M",
  // Süden
  Napoli: "S", Positano: "S", Ischia: "S", Bari: "S", Barletta: "S", Brindisi: "S", Lecce: "S", Gallipoli: "S",
  Salento: "S", Taranto: "S", Altamura: "S", Foggia: "S", Matera: "S", Potenza: "S", Cosenza: "S", Crotone: "S",
  Pescara: "S", Aquila: "S", Abruzzo: "S", Sud: "S",
  // Inseln
  Palermo: "I", Trapani: "I", Mazara: "I", Lampedusa: "I", Siracusa: "I", Catania: "I", Messina: "I", Etna: "I",
  Cefalù: "I", Lipari: "I", Sicilia: "I", Cagliari: "I", Sassari: "I", Olbia: "I", Nuoro: "I", Alghero: "I",
  Sardegna: "I",
  // Tessin und italienisches Graubünden
  Locarno: "CH", Ascona: "CH", Mendrisio: "CH", Chiasso: "CH", Lugano: "CH", Ceresio: "CH", Bellinzona: "CH",
  Biasca: "CH", Airolo: "CH", Ambrì: "CH", Leventina: "CH", Gottardo: "CH", "Valle Maggia": "CH", Ticino: "CH",
  Svizzera: "CH", Poschiavo: "CH", Bernina: "CH", "Bernina Express": "CH", Mesolcina: "CH",
  // Südtirol
  Bolzano: "BZ", Merano: "BZ", Bressanone: "BZ", Brunico: "BZ", Vipiteno: "BZ", Fortezza: "BZ", Silandro: "BZ",
  "San Candido": "BZ", Ortisei: "BZ", "Val Gardena": "BZ", "Val Pusteria": "BZ", "Val Venosta": "BZ",
  "Alto Adige": "BZ",
  // San Marino
  "San Marino": "RSM", "Monte Titano": "RSM",
  // Ausland (Familiengeschichten)
  Romania: "AUSLAND", Perù: "AUSLAND",
};

/** Menschen, Vereine, Feste, Marken und Werke - kein Ort. */
const NAMEN = new Set(
  (
    "Achille Agata Ahmed Alessia Alex Ambra Amira Anna Asia Assunta Azzurra Beatrice Bebe Bertagnolli Bianca " +
    "Carla Chiara Cristoforetti Dario Davide Diego Edoardo Elena Elisa Elsa Enrico Fabrizio Fatima Federico Felix " +
    "Giacomo Giada Ginevra Giorgia Giulia Greta Ilaria Irene Ivan Karim Legnante Lena Leonie Lorenzo Luca Lucia " +
    "Marco Marta Martina Mattia Matteo Max Michela Michele Mohamed Nicola Nina Noemi Oney Pietro Riccardo Samantha " +
    "Sami Sara Silvia Sofia Tapia Teresa Tommaso Vincenzo Vio Viola Werner Wolfgang Yasmine Yuri " +
    "Frecciarossa Palio Paralimpiadi Linux Acquario A"
  ).split(" "),
);

/** Die Wörter einer Zeile ohne Satzzeichen, mit abgeschnittener Elision („Dall'Alto" ⇒ „Alto"). */
function woerter(zeile: string): string[] {
  return zeile
    .replace(/[,.]/g, "")
    .split(" ")
    .map((w) => w.slice(w.lastIndexOf("'") + 1));
}

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
  const w = woerter(zeile);
  return w.filter(
    (x, i) =>
      x !== "" &&
      x[0] !== x[0].toLowerCase() &&
      !(i === 0 || roh[i - 1].endsWith(".")) &&
      !bedeckt.has(i) &&
      !NAMEN.has(x),
  );
}

function raumZahl(zeilen: string[]): Map<string, number> {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const r of orteIn(z).raeume) n.set(r, (n.get(r) ?? 0) + 1);
  return n;
}

describe("IT-T5: Orte aus dem ganzen italienischen Sprachraum - der Norden nicht vorne", () => {
  it("jedes grossgeschriebene Wort in der Zeile ist Satzanfang, Teil eines bekannten Ortes oder ein Name", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Satzanfang, der ein Name oder Ort ist, steht in den Listen (kein ungeprüfter Name)", () => {
    // Grosswörter am Satzanfang sind gewöhnliche Wörter (Il, Ho …) ODER Namen/Orte - nie etwas Drittes.
    const fehler: string[] = [];
    for (const z of ZEILEN) {
      const roh = z.replace(/[,.]/g, "").split(" ")[0];
      const w = woerter(z)[0];
      const istOrt = orteIn(z).bedeckt.has(0);
      if (!wortGeprueft(roh) && !istOrt && !NAMEN.has(w)) fehler.push(`"${z}": ${roh}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von IT-T5: N 24 · M 21 · S 35 · I 32 · CH 26 · BZ 21 · RSM 3 (Zeilen je Raum; eine Zeile
   * kann zwei Räume tragen). Johannes: Süd und Inseln, Tessin und Südtirol so stark wie der Norden.
   */
  it("Süden, Inseln und Tessin/Graubünden je mindestens so oft wie der Norden; Mitte und Südtirol nah dran; San Marino da", () => {
    const n = raumZahl(ZEILEN);
    const nord = n.get("N") ?? 0;
    const text = [...n].map(([r, k]) => `${r} ${k}`).join(" · ");
    expect(nord, text).toBeGreaterThan(0);
    for (const r of ["S", "I", "CH"]) expect(n.get(r) ?? 0, `${r}: ${text}`).toBeGreaterThanOrEqual(nord);
    for (const r of ["M", "BZ"]) expect((n.get(r) ?? 0) * 5, `${r}: ${text}`).toBeGreaterThanOrEqual(nord * 4);
    expect(n.get("RSM") ?? 0, text).toBeGreaterThanOrEqual(3);
    const verortet = ZEILEN.filter((z) => orteIn(z).raeume.size > 0).length;
    expect(verortet, text).toBeGreaterThanOrEqual(150);
    expect(nord * 5, `Norden höchstens ein Fünftel der verorteten Zeilen: ${text}`).toBeLessThanOrEqual(verortet);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, Wortgruppen und Elision zählen richtig, ein Nord-Übergewicht fällt auf", () => {
    expect(unbekannteGrosswoerter("Marta vive a Atlantide.")).toEqual(["Atlantide"]);
    expect(unbekannteGrosswoerter("Dall'Alto Adige arrivano tre compagni nuovi.")).toEqual([]);
    expect(unbekannteGrosswoerter("Andiamo a San Remo.")).toEqual(["San", "Remo"]);
    expect(orteIn("Mio fratello è a San Marino.").raeume).toEqual(new Set(["RSM"]));
    expect(orteIn("L'inverno a San Candido è lungo.").raeume).toEqual(new Set(["BZ"]));
    const n = raumZahl(["A Torino.", "A Milano.", "A Napoli."]);
    expect((n.get("S") ?? 0) >= (n.get("N") ?? 0)).toBe(false);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Lexikon, Akzent, è gegen e ───────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. */
const FUNKTIONSWOERTER = new Set(
  (
    "il lo la i le gli un uno una di a ad da in con su per tra fra " +
    "del dello della dei delle degli al allo alla ai alle agli dal dallo dalla dai dalle " +
    "nel nello nella nei nelle sul sullo sulla sui sulle " +
    "e ed o ma se non si mi ti ci vi ne io tu lui lei noi voi loro " +
    "mio mia miei mie tuo tua suo sua nostro nostra sono sei siamo siete era erano è ho ha hanno " +
    "fa fai sta sto stai tutto tutta tutti tutte che chi anche più perché così poi ora già " +
    "questo questa quest c l d un po"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    const ws = z
      .toLowerCase()
      .replace(/[,.]/g, "")
      .split(/[ ']/)
      .filter(Boolean);
    for (const w of new Set(ws)) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/**
 * Wörter dieser Charge, die NICHT in `WORDS_IT`, `STUFE_VOCAB_IT` oder `NACHTRAG_IT` standen und die das
 * macOS-Wörterbuch für Italienisch bestätigt hat (`osascript -l JavaScript scripts/woerterbuch-macos.js`,
 * Vorsilbe `it:`, gemessen 03.10.2026; Gegenprobe `qwxz` abgelehnt). Abgelehnt wurde `youtuber` - es steht in
 * keiner Zeile. Namen und Orte prüft die Liste oben, nicht das Wörterbuch.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set([
  "alberghiero", "alleno", "arrampica", "babysitter", "bora", "boxe", "bucata", "coltivano", "coltiviamo",
  "contrade", "cosplay", "cyberbullismo", "derby", "download", "frontalieri", "geologa", "graffiti", "hip", "hop",
  "incendi", "inquinata", "installa", "ladino", "lavoretto", "lido", "lunghissimo", "milanese", "modellini", "nuotiamo",
  "pallanuoto", "patentino", "pedaliamo", "pescherecci", "pizzica", "playlist", "portici", "prof", "pulcini",
  "rinviata", "ripassa", "sarda", "sardo", "skate", "spray", "tartarughe", "techno", "traghetto", "vaporetto",
  "windsurf", "workshop",
]);

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat(), ...NACHTRAG_IT].map((w) => normalizeWord(w, "it")),
);

/** Anfänge vor dem Apostroph (geschlossene Liste wie `ELISION_ANFAENGE_IT` in lexicon.ts, soweit hier gebraucht). */
const ELISIONS_ANFAENGE = new Set(["l", "un", "dell", "all", "dall", "nell", "sull", "c", "d", "anch", "dov", "quest"]);

/** Ist das Wort (klein, Name/Ort ausgenommen) geprüft? Eine Elision gilt, wenn Anfang und Wort dahinter es sind. */
function wortGeprueft(w: string): boolean {
  const n = normalizeWord(w, "it");
  if (n.length < 2 || VORHER_BEKANNT.has(n) || VOM_WOERTERBUCH_BESTAETIGT.has(n)) return true;
  if (!n.includes("'")) return false;
  const anfang = n.slice(0, n.lastIndexOf("'"));
  const rest = n.slice(n.lastIndexOf("'") + 1);
  return ELISIONS_ANFAENGE.has(anfang) && (rest.length < 2 || VORHER_BEKANNT.has(rest) || VOM_WOERTERBUCH_BESTAETIGT.has(rest));
}

/** Wörter (ab zwei Buchstaben), die weder vorher im Wortschatz standen noch vom Wörterbuch bestätigt noch Name/Ort sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    const { bedeckt } = orteIn(z);
    z.replace(/[,.]/g, "")
      .split(" ")
      .forEach((roh, i) => {
        const kern = roh.slice(roh.lastIndexOf("'") + 1);
        if (bedeckt.has(i) || NAMEN.has(kern)) return;
        if (!wortGeprueft(roh)) out.add(roh.toLowerCase());
      });
  }
  return [...out];
}

/** Wörter, die es NUR mit Akzent gibt (Bauplan I6): ihre Form ohne Akzent ist kein Wort (`perche`, `citta`, `piu`). */
const NUR_MIT_AKZENT: ReadonlySet<string> = new Set(
  [...VORHER_BEKANNT, ...VOM_WOERTERBUCH_BESTAETIGT]
    .filter((w) => /[àèéìòù]$/.test(w))
    .map((w) => w.normalize("NFD").replace(/[̀-ͯ]/g, ""))
    .filter((ohne) => !VORHER_BEKANNT.has(ohne)),
);
/** Namen bleiben aussen vor: „Sara“ ist ein Name, nicht ein „sarà“ ohne Akzent (ebenso „Bebe“). */
const ohneAkzentFehler = (zeile: string): string[] =>
  zeile
    .replace(/[,.]/g, "")
    .split(/[ ']/)
    .filter((w) => !NAMEN.has(w))
    .map((w) => w.toLowerCase())
    .filter((w) => NUR_MIT_AKZENT.has(w));

/**
 * „e" (und) gegen „è" (ist): ab Sprosse 27 ist „è" schreibbar - ein fehlender Akzent wäre ein ANDERES Wort
 * (`il treno e in ritardo`). Jede Zeile mit einem allein stehenden „e" ist darum gelesen und hier eingetragen
 * (Befund §4: in jeder ist „e" = und); eine neue Zeile mit „e" muss hier stehen, sonst wird der Wächter rot.
 */
const ZEILEN_MIT_E_GELESEN: ReadonlySet<string> = new Set([
  "Marco e Nina partono per Airolo.",
  "Sami ha sedici anni e vive a Pistoia.",
  "Abito a Bressanone e parlo tre lingue.",
  "A Bolzano Lena parla tedesco con la nonna e italiano con gli amici.",
  "Ahmed e suo papà lavorano al porto di Livorno.",
  "Ho un'ora di matematica e un'ora di inglese.",
  "Mi piace un po' di rap e un po' di jazz.",
  "In Val Gardena c'è chi parla ladino, tedesco e italiano.",
  "Bevo acqua del rubinetto e non compro bottiglie.",
  "Cinque amici, un pallone e la piazza.",
  "Mia madre è nata in Perù e parla spagnolo.",
  "Wolfgang di Silandro mi scrive in italiano e io gli rispondo in tedesco.",
]);
const mitE = (z: string): boolean => /(^| )e( |$)/i.test(z.replace(/[,.]/g, ""));

describe("IT-T5: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * ★ Merge 03.10.2026 (Falle 45: das Budget gilt je STUFE): auch über beide Jugend-Chargen (IT-T2 früh + IT-T5
   * Mitte) zusammen steht kein Inhaltswort in mehr als 8 Zeilen. T1 (Kinder) und T3 (Erwachsene) sind andere Stufen.
   */
  it("auch über beide Jugend-Chargen (T2 + T5) steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    const fehler = zuHaeufig([...FRUEHE_TEENS, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross am Satzanfang und nach Elision), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 3 === 0 ? "Treno" : i % 3 === 1 ? "il treno" : "dell'treno"} ${"abcdefghi"[i]}.`);
    expect(zuHaeufig(neun)).toEqual(['"treno": 9 Zeilen']);
    expect(zuHaeufig(Array.from({ length: 9 }, () => "perché sì."))).toEqual(['"sì": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis, auch nicht hinter einer Elision", () => {
    const fehler = ZEILEN.flatMap((t) =>
      t.replace(/[,.]/g, "").split(" ").filter((w) => gesperrtIt(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: mona, passera (Kern), disabile (Wortbasis) und l'inferno werden gefunden, monaco nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(istKernGesperrtIt("Passera")).toBe(true);
    expect(gesperrtIt("disabile")).toBe(true);
    expect(gesperrtIt("l'inferno")).toBe(true);
    expect(gesperrtIt("monaco")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder ist vom Wörterbuch bestätigt (Namen und Orte: Listen oben)", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Liste trägt nur, was wirklich gebraucht wird (sonst wächst sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.toLowerCase().replace(/[,.]/g, "").split(/[ ']/)));
    expect([...VOM_WOERTERBUCH_BESTAETIGT].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort, das abgelehnte youtuber und eine Elision mit falschem Anfang werden gemeldet", () => {
    expect(ungeprueft(["Ho visto la salsx.", "Sara fa la youtuber.", "Xyz'estate."])).toEqual(["salsx", "youtuber", "xyz'estate"]);
    expect(ungeprueft(["Un'amica di Lecce.", "Dall'Alto Adige."])).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) =>
      z.replace(/[,.]/g, "").split(" ").some((w) => normalizeWord(w, "it").length >= 2 && !isRealWord(w, "it")),
    );
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da (perche, citta, piu, cosi …)", () => {
    const fehler = ZEILEN.flatMap((z) => ohneAkzentFehler(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Esco perche c'e il sole“ wird gemeldet (perche), „Esco perché c'è il sole“ nicht, der Name Sara nicht", () => {
    expect(ohneAkzentFehler("Esco perche c'e il sole.")).toContain("perche");
    expect(ohneAkzentFehler("Esco perché c'è il sole.")).toEqual([]);
    expect(ohneAkzentFehler("La gita sara a maggio.")).toEqual(["sara"]);
    expect(ohneAkzentFehler("Sara va in gita.")).toEqual([]);
  });

  it("jede Zeile mit „e“ ist gelesen (e = und, nie das gemeinte è)", () => {
    const mit = ZEILEN.filter(mitE);
    expect(mit.filter((z) => !ZEILEN_MIT_E_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_E_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Il treno e in ritardo.“ wäre eine neue, ungelesene Zeile mit „e“", () => {
    expect(mitE("Il treno e in ritardo.")).toBe(true);
    expect(ZEILEN_MIT_E_GELESEN.has("Il treno e in ritardo.")).toBe(false);
    expect(mitE("Il treno è in ritardo di venti minuti.")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl gleichgesetzt: „Il mio amico è…" und „La mia amica è…" sind ein Paar. */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", gli: "ART", le: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  return zeile
    .toLowerCase()
    .replace(/[,.]/g, "")
    .split(" ")
    .map((w) => art[w] ?? pron[w] ?? w.replace(/[oaei]$/, "_"))
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

describe("IT-T5: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der keine Akzente kennt: aus „è“ wird nichts, aus „sì“ „s“)", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer früheren - weder it (andere Chargen) noch de/en/fr/es (Text oder Ledger-Schlüssel)", () => {
    const eigene = new Set(ZEILEN);
    const frueher = [...CORPUS_IT.filter((i) => !eigene.has(i.text)), ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES];
    const texte = new Set(frueher.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(frueher.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_IT_WEG_MITTE_TEENS.filter(
      (i) => texte.has(i.text.toLowerCase()) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("keine Zeile gleicht einer Zeile von IT-T1, IT-T2 oder IT-T3 (Text ohne Satzzeichen und Grossschreibung, Ledger-Schlüssel)", () => {
    const ohne = (t: string) => t.toLowerCase().replace(/[,.]/g, "");
    const texte = new Set(ANDERE_IT_ZEILEN.map(ohne));
    const schluessel = new Set(ANDERE_IT_ZEILEN.map((t) => bausteinKey("satz", t)));
    const fehler = ZEILEN.filter((t) => texte.has(ohne(t)) || schluessel.has(bausteinKey("satz", t)));
    expect(fehler).toEqual([]);
  });

  it("keine Paare - weder untereinander noch mit einer Zeile von IT-T1, IT-T2 oder IT-T3 (Falle 31)", () => {
    const fehler = paare(ZEILEN, ANDERE_IT_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie einer Kinderzeile mit anderer Grossschreibung, Paar und Ledger-Schlüssel werden erkannt", () => {
    expect(KINDERZEILEN).toContain("il nonno ride");
    expect(paare(["Il nonno ride."], KINDERZEILEN)).toHaveLength(1);
    expect(paare(["Il mio amico è di Bari.", "La mia amica è di Bari."])).toHaveLength(1);
    // Der Ledger-Schlüssel kennt keine Akzente: „è“ fällt ganz weg - „Il sole è caldo.“ und „il sole caldo“ wären EIN Baustein.
    expect(bausteinKey("satz", "Il sole è caldo.")).toBe(bausteinKey("satz", "il sole caldo"));
    expect(paare(["Il bus parte.", "Il bus arriva."])).toEqual([]);
    // ★ Merge: eine Zeile aus T2 bzw. T3, gross und mit Punkt geschrieben, wäre Kopie UND Paar.
    for (const t of [FRUEHE_TEENS[0], ERWACHSENENZEILEN[0]]) {
      const gross = `${t[0].toUpperCase()}${t.slice(1)}.`;
      expect(paare([gross], ANDERE_IT_ZEILEN), gross).toHaveLength(1);
      expect(ANDERE_IT_ZEILEN.map((x) => bausteinKey("satz", x))).toContain(bausteinKey("satz", gross));
    }
  });
});

describe("IT-T5: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_IT trägt jede Zeile dieser Charge als geschlossenen Block (Reihenfolge wie in der Datei)", () => {
    const it_ = CORPUS_IT.map((i) => i.text);
    expect(ZEILEN.filter((t) => !it_.includes(t))).toEqual([]);
    const start = it_.indexOf(ZEILEN[0]);
    expect(it_.slice(start, start + ZEILEN.length)).toEqual(ZEILEN);
    // Hinter T1, T3 und T2 (Anker nur anhängend; Merge 03.10.2026).
    for (const andere of [KINDERZEILEN, ERWACHSENENZEILEN, FRUEHE_TEENS]) {
      expect(start).toBeGreaterThanOrEqual(it_.indexOf(andere[andere.length - 1]) + 1);
    }
  });

  it("korpusFuer(\"it\") trägt jede Zeile (nichts von `mergeCorpus` still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("it").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_IT_WEG_MITTE_TEENS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe it t5.", kind: "satz" as const, stufen: ["teens" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „it“ bekommt für Jugendliche an Sprosse x jede Zeile vollständig - und nur eigene it-Jugendzeilen`, () => {
      const { letzte, o } = grenzen(l);
      const allowed = allowedFromIntroduced(o.slice(0, letzte), "it");
      const geliefert = corpusItemsFor({ stufe: "teens", allowed, lang: "it", lernweg: "it" });
      expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
      const eigeneJugend = new Set(
        CORPUS_IT.filter((i) => i.nurWeg === "it" && i.stufen.includes("teens")).map((i) => fitText(i.text, allowed, "it")),
      );
      expect(geliefert.filter((t) => !eigeneJugend.has(t))).toEqual([]);
    });

    it(`${l}: eine Sprosse vor ⇧ kommen von dieser Charge nur ⇧-Zeilen an (ohne Punkt), zwei davor keine`, () => {
      const { shift, o } = grenzen(l);
      const eigene = new Set(ZEILEN.map((t) => t.replace(/\.$/, "")));
      const davor = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(o.slice(0, shift - 1), "it"), lang: "it", lernweg: "it" });
      const vonHier = davor.filter((t) => eigene.has(t));
      expect(vonHier.length).toBeGreaterThan(0);
      expect(vonHier.filter((t) => /[ghbzèà'qéìùywx]/i.test(t) || !t.toLowerCase().includes("p"))).toEqual([]);
      const zweiDavor = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(o.slice(0, shift - 2), "it"), lang: "it", lernweg: "it" });
      expect(zweiDavor.filter((t) => eigene.has(t))).toEqual([]);
    });
  }

  it("Kinder, Erwachsene und die Wege „de“/„es“ bekommen keine dieser Zeilen", () => {
    setLayout("it");
    const o = introOrder("it");
    const alle = allowedFromIntroduced(o, "it");
    for (const stufe of ["kids", "erwachsen"] as const) {
      const g = corpusItemsFor({ stufe, allowed: alle, lang: "it", lernweg: "it" });
      expect(ZEILEN.filter((t) => g.includes(t)), stufe).toEqual([]);
    }
    setLayout("de");
    const de = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("es");
    const es = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("es"), "es"), lang: "es", lernweg: "es" });
    expect(ZEILEN.filter((t) => es.includes(t))).toEqual([]);
  });
});
