/**
 * ★★★ Wächter IT-T4 (03.10.2026): die mittleren it-Texte für Kinder
 * (`corpusItWegMitteKids.ts`, Sprossen 20-36 auf `it` = Maiusc bis x, 19-36 auf
 * `it-qzerty`). Vorbilder: `tastenflow-texte-it-kids-frueh.test.ts` (IT-T1) und
 * `tastenflow-texte-es-kids-mitte.test.ts` (ES-T4); Bauplan
 * `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §3/§5, Leitfaden Fallen
 * 26/31/37/45/48/51/58/76, Befund `BEFUND-2026-10-02-IT-T4-KIDS-MITTE.md`.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie
 * mit `introOrder("it").slice(0, n)` durchlässt - auf BEIDEN Pflicht-Tastaturen
 * -, mindestens aber Maiusc (Grossbuchstaben sind vorher nur über die
 * Auto-Grossschreibung tippbar; die Zeilen dieser Charge gehören zur
 * Maiusc-Stufe). Auf der Mac-QZERTY liegt `ò` an 32 (nach `ì`, F4-it): eine
 * Zeile mit `ò` hat dort eine andere Sprosse als auf `it`. Jede Regel hat eine
 * Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { CORPUS_IT_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusItWegFruehKids";
import { CORPUS_IT_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusItWegFruehTeens";
import { CORPUS_IT_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusItWegFruehErwachsene";
import { CORPUS_IT_WEG_MITTE_TEENS } from "../src/lib/typing/corpusItWegMitteTeens";
import { CORPUS_IT_WEG_MITTE_KIDS } from "../src/lib/typing/corpusItWegMitteKids";
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
const ZEILEN = CORPUS_IT_WEG_MITTE_KIDS.map((i) => i.text);
const T1 = CORPUS_IT_WEG_FRUEH_KIDS.map((i) => i.text);
/**
 * ★ Merge 03.10.2026: die parallel geschriebenen it-Chargen IT-T2 (Jugend früh), IT-T3 (Erwachsene früh) und IT-T5
 * (Jugend Mitte). Gegen ALLE anderen it-Chargen werden Kopien (Text und Ledger-Schlüssel) und Paare geprüft
 * (Falle 31, 51); das Wortbudget gilt für die Kinder (T1 + T4).
 */
const ANDERE_IT_ZEILEN = [
  ...T1,
  ...CORPUS_IT_WEG_FRUEH_TEENS.map((i) => i.text),
  ...CORPUS_IT_WEG_FRUEH_ERWACHSENE.map((i) => i.text),
  ...CORPUS_IT_WEG_MITTE_TEENS.map((i) => i.text),
];
/** Die letzte Buchstaben-Einheit der Charge (danach kommen `? ! " : ; - ( )`). */
const LETZTE = "x";

/** Maiusc-Sprosse, letzte Sprosse (x) und die Folge - aus der Reihenfolge der Tastatur gerechnet, nicht gezählt. */
function grenzen(layout: LayoutId): { maiusc: number; letzte: number; o: string[] } {
  setLayout(layout);
  const o = introOrder("it");
  return { maiusc: o.indexOf(SHIFT_UNIT) + 1, letzte: o.indexOf(LETZTE) + 1, o };
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis x). */
function buchstabenSprosse(text: string, layout: LayoutId): number | null {
  const { letzte, o } = grenzen(layout);
  for (let n = 1; n <= letzte; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "it"), "it") !== null) return n;
  }
  return null;
}

/** Die Sprosse der Zeile in dieser Charge: nie vor Maiusc. */
function sprosseAuf(text: string, layout: LayoutId): number | null {
  const s = buchstabenSprosse(text, layout);
  return s === null ? null : Math.max(s, grenzen(layout).maiusc);
}

/** Enthält der Text die Einheit? ⇧ zeigt sich an einem Grossbuchstaben. */
function enthaeltEinheit(text: string, einheit: string): boolean {
  if (einheit === SHIFT_UNIT) return text !== text.toLowerCase();
  return text.toLowerCase().includes(einheit);
}

/** Satzzeichen nach Maiusc (D-1): weglassbar, darum beginnt dort keine eigene Zeile. */
const WEGLASSBAR = new Set([".", ","]);

describe("IT-T4: jede Zeile an ihrer Sprosse (it und it-qzerty)", () => {
  it("die Folge: it 20-36 = ⇧ . , g h b z è à ' q é ì ù y w x; it-qzerty 19-36 mit ò an 32 (nach ì)", () => {
    const it_ = grenzen("it");
    expect(it_.maiusc).toBe(20);
    expect(it_.letzte).toBe(36);
    expect(it_.o.slice(19, 36).join(" ")).toBe(`${SHIFT_UNIT} . , g h b z è à ' q é ì ù y w x`);
    const q = grenzen("it-qzerty");
    expect(q.maiusc).toBe(19);
    expect(q.letzte).toBe(36);
    expect(q.o.slice(18, 36).join(" ")).toBe(`${SHIFT_UNIT} . , g h b z è à ' q é ì ò ù y w x`);
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile hat eine Sprosse von Maiusc bis x, und minTier stimmt`, () => {
      const { maiusc, letzte } = grenzen(l);
      const fehler: string[] = [];
      for (const item of CORPUS_IT_WEG_MITTE_KIDS) {
        const s = sprosseAuf(item.text, l);
        if (s === null || s < maiusc || s > letzte) fehler.push(`"${item.text}": Sprosse ${s}`);
        const tier = minTierFor(item.text, "it");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  it("die Sprossen der zwei Tastaturen unterscheiden sich nur über ò (sonst auf der QZERTY genau eine früher)", () => {
    const fehler: string[] = [];
    for (const t of ZEILEN) {
      const si = sprosseAuf(t, "it") as number;
      const sq = sprosseAuf(t, "it-qzerty") as number;
      if (t.includes("ò")) {
        if (sq < 32) fehler.push(`"${t}": mit ò auf it-qzerty an ${sq} (vor 32)`);
        continue;
      }
      // Ohne ò: dieselbe Einheit, auf der QZERTY eine Sprosse früher (m sitzt dort in der Grundreihe); nach ì
      // kommt dort ò dazwischen - ab ù sind die Sprossen gleich.
      const soll = si >= 33 ? si : si - 1;
      if (sq !== soll) fehler.push(`"${t}": it ${si}, it-qzerty ${sq}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * Eine Maiusc-Zeile (nur Buchstaben bis p) passt über die Auto-Grossschreibung schon vor Maiusc. Sie braucht
   * darum ein „v" oder „p" - so kommt sie frühestens an Sprosse 17, auf beiden Tastaturen, nie in die frühen Runden
   * von IT-T1 (dort ist auf der QZERTY schon `m` an 8).
   */
  it("keine Zeile rutscht über die Auto-Grossschreibung vor Sprosse 17 (it und it-qzerty)", () => {
    const fehler = ZEILEN.filter((t) => TASTATUREN.some((l) => (buchstabenSprosse(t, l) ?? 0) < 17));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet", () => {
    expect(buchstabenSprosse("Ciao, nonna.", "it")).toBe(15); // Grossbuchstabe und Satzzeichen fallen vorher weg
    expect(sprosseAuf("Ciao, nonna.", "it")).toBe(20);
    expect(sprosseAuf("Marco va a Napoli.", "it")).toBe(20);
    expect(sprosseAuf("Marco va a Napoli.", "it-qzerty")).toBe(19);
    expect(sprosseAuf("Giulia gioca.", "it")).toBe(23);
    expect(sprosseAuf("C'è il sole.", "it")).toBe(29);
    expect(sprosseAuf("C'è il sole.", "it-qzerty")).toBe(28);
    expect(sprosseAuf("Nicolò ha detto di sì.", "it")).toBe(32);
    expect(sprosseAuf("Nicolò andò via.", "it")).toBe(20);
    expect(sprosseAuf("Nicolò andò via.", "it-qzerty")).toBe(32);
    expect(sprosseAuf("Un taxi.", "it")).toBe(36);
    expect(sprosseAuf("È tardi.", "it")).toBeNull(); // È ist unter Windows nicht tippbar (I4)
    // ? und ! kommen erst nach x - vorher lässt `fitText` sie weg wie . und , (weglassbar); die Form-Regel unten
    // hält sie trotzdem aus dieser Charge heraus.
    expect(sprosseAuf("Perché? Così!", "it")).toBe(32);
  });

  /** GEMESSEN am Ende von IT-T4 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. */
  const MINDESTENS_JE_SPROSSE: Record<string, Record<number, number>> = {
    it: { 20: 35, 23: 28, 24: 27, 25: 29, 26: 28, 27: 29, 28: 22, 29: 35, 30: 22, 31: 16, 32: 17, 33: 16, 34: 12, 35: 10, 36: 8 },
    "it-qzerty": { 19: 33, 22: 26, 23: 27, 24: 28, 25: 27, 26: 28, 27: 22, 28: 35, 29: 22, 30: 16, 31: 15, 32: 9, 33: 16, 34: 12, 35: 10, 36: 8 },
  };

  for (const l of TASTATUREN) {
    it(`${l}: je Sprosse mindestens so viele Zeilen wie gemessen (nie unter 8; . und , ohne eigene Zeile)`, () => {
      const { maiusc, letzte, o } = grenzen(l);
      const anzahl = new Map<number, number>();
      for (const t of ZEILEN) {
        const s = sprosseAuf(t, l);
        if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
      }
      const zuWenig: string[] = [];
      for (let n = maiusc; n <= letzte; n++) {
        if (WEGLASSBAR.has(o[n - 1])) continue;
        const soll = Math.max(8, MINDESTENS_JE_SPROSSE[l][n] ?? 8);
        if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n} (${o[n - 1]}): ${anzahl.get(n) ?? 0} < ${soll}`);
      }
      expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    });
  }
});

describe("IT-T4: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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

    it(`${l}: jede Einheit von ⇧ bis x hat an ihrer Sprosse Zeilen (W6)`, () => {
      const { maiusc, letzte, o } = grenzen(l);
      const fehlt: string[] = [];
      for (let n = maiusc; n <= letzte; n++) {
        if (WEGLASSBAR.has(o[n - 1])) continue;
        const treffer = ZEILEN.filter((t) => sprosseAuf(t, l) === n && enthaeltEinheit(t, o[n - 1]));
        if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
      }
      expect(fehlt, `${l}: Einheiten ohne Zeile`).toEqual([]);
    });
  }

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet, Grossbuchstabe gilt als ⇧", () => {
    expect(enthaeltEinheit("Marta parte.", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("marta parte.", SHIFT_UNIT)).toBe(false);
    expect(ohneNeueEinheit([{ text: "Il sole è caldo.", sprosse: 28 }], "it")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Il sole è caldo.", sprosse: 27 }], "it")).toEqual([]);
    expect(ohneNeueEinheit([{ text: "Nicolò andò via.", sprosse: 32 }], "it-qzerty")).toEqual([]);
  });
});

// ── Pflicht aus IT-T1 §3a: der Apostroph wird an seiner Sprosse wirklich geübt ──

/** Eine Elision: Buchstabe(n) + ' + Buchstabe (l'uva, un'amica, c'è, dell'Abruzzo, po' zählt nicht). */
const ELISION = /\p{L}'\p{L}/u;

describe("IT-T4: Elision ab der Apostroph-Sprosse (Pflicht aus IT-T1 §3a)", () => {
  for (const l of TASTATUREN) {
    it(`${l}: an der Apostroph-Sprosse tragen mindestens 30 Zeilen eine Elision - und jede Zeile dort hat eine`, () => {
      const { o } = grenzen(l);
      const s = o.indexOf("'") + 1;
      const dort = ZEILEN.filter((t) => sprosseAuf(t, l) === s);
      expect(dort.filter((t) => !ELISION.test(t))).toEqual([]);
      expect(dort.length).toBeGreaterThanOrEqual(30);
    });
  }

  it("vor der Apostroph-Sprosse steht kein Apostroph (fitText sperrt ihn hart) - und danach kommt er weiter vor (gemessen 22)", () => {
    expect(ZEILEN.filter((t) => t.includes("'") && (sprosseAuf(t, "it") ?? 0) < 29)).toEqual([]);
    expect(ZEILEN.filter((t) => ELISION.test(t) && (sprosseAuf(t, "it") ?? 0) > 29).length).toBeGreaterThanOrEqual(22);
  });

  for (const l of TASTATUREN) {
    it(`${l}: mit echtem Korpus steht der Apostroph an seiner Sprosse in echten Runden (Mein Training, Fokus ')`, () => {
      const { o } = grenzen(l);
      const intro = o.slice(0, o.indexOf("'") + 1);
      const echt = Math.random;
      let s = 2904;
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
          for (const z of adaptiveRound({ introduced: intro, focus: ["'"], stufe: "kids", lang: "it", lernweg: "it", count: 12 })) {
            texte.push(z.text);
          }
        }
      } finally {
        Math.random = echt;
      }
      // Gemessen wird, dass Korpus-Zeilen MIT Elision ankommen - nicht nur Wort-Drill.
      const eigene = new Set(ZEILEN.flatMap((t) => [t, fitText(t, allowedFromIntroduced(intro, "it"), "it") ?? t]));
      expect(texte.some((t) => eigene.has(t) && t.includes("'")), texte.slice(0, 12).join(" / ")).toBe(true);
    });
  }

  it("Gegenprobe: eine Zeile ohne Elision und „po'“ werden nicht als Elision gezählt", () => {
    expect(ELISION.test("Il sole è caldo.")).toBe(false);
    expect(ELISION.test("Un po' di relax.")).toBe(false);
    expect(ELISION.test("L'uva è matura.")).toBe(true);
    expect(ELISION.test("Elisa ha un'amica.")).toBe(true);
  });
});

// ── Form: Satzanfang gross, nur Punkt und Komma, Regeln des Weges ───────────

const ERLAUBTE_ZEICHEN = /^[A-Za-zàèéìòù' ,.]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t[0] === t[0].toLowerCase() || t !== t.trim() || t.includes("  ") || /[,.]\S/.test(t);

describe("IT-T4: Satzanfang gross, nur Punkt und Komma, Regeln aller it-Zeilen", () => {
  it("jede Zeile beginnt gross und besteht nur aus Buchstaben, Apostroph, Punkt, Komma und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kleinschreibung am Anfang, ? ! : ; \", Bindestrich, Komma ohne Leerzeichen, doppeltes Leerzeichen", () => {
    for (const t of ["il sole.", "Vieni?", "Evviva!", "Nota: oggi.", "Sì; no.", 'Dice "ciao".', "Anna-Maria.", "Ciao,Emma.", "Il  sole."]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("Ciao, Davide. Ciao, Emma.")).toBe(false);
  });

  it("ganze Sätze enden mit Punkt (mindestens 90 % der Zeilen), mindestens 25 Zeilen tragen ein Komma", () => {
    expect(ZEILEN.filter((t) => t.endsWith(".")).length * 10).toBeGreaterThanOrEqual(ZEILEN.length * 9);
    expect(ZEILEN.filter((t) => t.includes(",")).length).toBeGreaterThanOrEqual(25);
  });

  it("kein grosser Akzentbuchstabe (È À É Ì Ò Ù sind unter Windows nicht tippbar, I4)", () => {
    expect(ZEILEN.filter((t) => /[ÀÈÉÌÒÙ]/.test(t))).toEqual([]);
  });

  it("jede Zeile besteht die Regeln aller italienischen Zeilen (`helfer/itTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg it, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_IT_WEG_MITTE_KIDS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("it");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Orte: jedes grossgeschriebene Wort ist bekannt; Süden, Inseln, Tessin, Südtirol stark ──

type Raum = "N" | "M" | "S" | "I" | "CH" | "BZ" | "RSM" | "REGION";

/**
 * Orte, Landschaften, Gewässer mit ihrem Raum: N Norden (ohne Südtirol), M Mitte, S Süden, I Inseln, CH Tessin und
 * italienischsprachiges Graubünden, BZ Südtirol, RSM San Marino, REGION = über mehrere Räume (Italia, Alpi …).
 * Abruzzo zählt zum Süden (ISTAT: Italia meridionale).
 */
const ORTE: Record<string, Raum> = {
  // Norden
  Trento: "N", Trentino: "N", Trieste: "N", Cremona: "N", Cortina: "N", Aosta: "N", Torino: "N", Genova: "N",
  Milano: "N", Camogli: "N", Bologna: "N", Gorizia: "N", Venezia: "N", Rimini: "N", Verona: "N", Como: "N",
  Treviso: "N", Chioggia: "N", Garda: "N", Maggiore: "N", Po: "N", Adige: "N", Paradiso: "N", Bianco: "N",
  Dolomiti: "N",
  // Mitte
  Siena: "M", Toscana: "M", Firenze: "M", Roma: "M", Ancona: "M", Latina: "M", Livorno: "M", Elba: "M",
  Trasimeno: "M", Umbria: "M", Urbino: "M", Maremma: "M", Trevi: "M", Colosseo: "M", Marche: "M",
  // Süden
  Napoli: "S", Vesuvio: "S", Matera: "S", Pescara: "S", Taranto: "S", Procida: "S", Gallipoli: "S", Puglia: "S",
  Foggia: "S", Lecce: "S", Ischia: "S", Bari: "S", Calabria: "S", Altamura: "S", Brindisi: "S", Campania: "S",
  Potenza: "S", Basilicata: "S", Cosenza: "S", Abruzzo: "S", Aquila: "S", Pompei: "S", Capri: "S", Pulcinella: "S",
  // Inseln
  Palermo: "I", Oristano: "I", Lampedusa: "I", Siracusa: "I", Sassari: "I", Catania: "I", Trapani: "I",
  Cagliari: "I", Sardegna: "I", Ragusa: "I", Agrigento: "I", Alghero: "I", Olbia: "I", Stromboli: "I", Bronte: "I",
  Nuoro: "I", Etna: "I", Sicilia: "I", Sartiglia: "I",
  // Tessin, Graubünden
  Locarno: "CH", Mendrisio: "CH", Ticino: "CH", Lugano: "CH", Maggia: "CH", Ascona: "CH", Chiasso: "CH",
  Poschiavo: "CH", Biasca: "CH", Gottardo: "CH", Bellinzona: "CH", Ambrì: "CH",
  // Südtirol
  Merano: "BZ", Gardena: "BZ", Vipiteno: "BZ", Bressanone: "BZ", Brunico: "BZ", Bolzano: "BZ", Bozen: "BZ",
  Walther: "BZ",
  // San Marino
  Marino: "RSM",
  // über mehrere Räume
  Italia: "REGION", Alpi: "REGION", Europa: "REGION", Mediterraneo: "REGION",
};

/** Menschen (und zwei Tiere: Pepe der Hund, Chicco der Hamster) - aus allen Räumen und Familien. */
const NAMEN = new Set(
  (
    "Agata Alessia Alex Amir Andrea Anna Arianna Beatrice Benedetta Bianca Bruno Chiara Chicco Ciro Concetta " +
    "Davide Efisio Elena Elia Elias Elisa Emma Enzo Ezio Francesco Gabriele Gaia Gavino Gemma Gianna Giacomo " +
    "Giada Ginevra Gioele Giorgia Giorgio Giovanni Giulia Greta Hannah Ilaria Irene Jonas Lea Lena Leo Leonardo " +
    "Lisa Lorenzo Luca Lucia Lukas Margherita Marta Matilde Matteo Mattia Max Mei Michela Michele Nicola Nicolò " +
    "Noah Noemi Omar Ottavia Pepe Pietro Renzo Riccardo Rocco Rosalia Salvatore Samir Samuele Sara Sofia Tecla " +
    "Tiziana Tommaso Totò Ugo Valentina Viola Vittoria Walter Wanda Yasmin Yuri Zoe"
  ).split(" "),
);

/**
 * Teile von Ortsnamen (Val Gardena, Valle Maggia, Gran Paradiso, Monte Bianco, Bari Vecchia, Ponte Vecchio,
 * San Marino, L'Aquila).
 */
const PARTIKEL = new Set(["Val", "Valle", "Gran", "Monte", "Vecchia", "Ponte", "Vecchio", "San", "L"]);

/** Feste - grossgeschrieben, aber kein Ort. */
const FESTE = new Set(["Carnevale", "Natale", "Pasqua", "Halloween", "Palio"]);

/** Die Wörter einer Zeile ohne Satzzeichen; Elision getrennt (L'Aquila ⇒ L, Aquila). */
const woerterRoh = (zeile: string): string[] => zeile.split(/[\s,.']+/).filter(Boolean);

/** Grossgeschriebene Wörter, die nicht am Satzanfang stehen und weder Ort, Name, Partikel noch Fest sind. */
function unbekannteGrosswoerter(zeile: string): string[] {
  const out: string[] = [];
  // Satzanfang: erstes Wort und jedes Wort nach einem Punkt.
  const saetze = zeile.split(/\.\s+/);
  for (const satz of saetze) {
    const w = woerterRoh(satz);
    for (let i = 0; i < w.length; i++) {
      const wort = w[i];
      if (wort[0] === wort[0].toLowerCase()) continue;
      const amAnfang = i === 0 || (i === 1 && satz.startsWith(`${w[0]}'`)); // „L'Etna": L am Anfang
      if (wort in ORTE || NAMEN.has(wort) || PARTIKEL.has(wort) || FESTE.has(wort)) continue;
      if (amAnfang) continue;
      out.push(wort);
    }
  }
  return out;
}

/** Die Räume einer Zeile (auch das erste Wort kann ein Ort sein: „Napoli è …"). */
function raeumeIn(zeile: string): Set<Raum> {
  return new Set(woerterRoh(zeile).filter((w) => w in ORTE).map((w) => ORTE[w]));
}

function verteilung(zeilen: string[]): Record<Raum | "verortet", number> {
  const v: Record<Raum | "verortet", number> = { verortet: 0, N: 0, M: 0, S: 0, I: 0, CH: 0, BZ: 0, RSM: 0, REGION: 0 };
  for (const z of zeilen) {
    const r = [...raeumeIn(z)].filter((x) => x !== "REGION");
    if (r.length === 0) continue;
    v.verortet++;
    for (const x of new Set(r)) v[x]++;
  }
  return v;
}

describe("IT-T4: Orte aus allen Räumen, in denen Italienisch gesprochen wird", () => {
  it("jedes grossgeschriebene Wort in der Zeile ist ein bekannter Ort, Name, Teil eines Ortsnamens oder ein Fest", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("verortet sind mindestens 130 Zeilen; der Norden (ohne Südtirol) trägt höchstens 30 %, Süden + Inseln mindestens 35 %", () => {
    const v = verteilung(ZEILEN);
    expect(v.verortet).toBeGreaterThanOrEqual(130);
    expect(v.N * 10, `Norden ${v.N} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet * 3);
    expect((v.S + v.I) * 100, `Süden + Inseln ${v.S + v.I} von ${v.verortet}`).toBeGreaterThanOrEqual(v.verortet * 35);
  });

  it("Tessin/Graubünden und Südtirol je mindestens 10 % der verorteten Zeilen, Mitte mindestens 6 %, San Marino kommt vor", () => {
    const v = verteilung(ZEILEN);
    expect(v.CH * 10, `Tessin ${v.CH} von ${v.verortet}`).toBeGreaterThanOrEqual(v.verortet);
    expect(v.BZ * 10, `Südtirol ${v.BZ} von ${v.verortet}`).toBeGreaterThanOrEqual(v.verortet);
    expect(v.M * 100, `Mitte ${v.M} von ${v.verortet}`).toBeGreaterThanOrEqual(v.verortet * 6);
    expect(v.RSM).toBeGreaterThanOrEqual(1);
  });

  it("kein einzelner Ort steht in mehr als 6 Zeilen (die Orte sind verteilt, nicht gehäuft)", () => {
    const n = new Map<string, number>();
    for (const z of ZEILEN) for (const w of new Set(woerterRoh(z).filter((x) => x in ORTE && ORTE[x] !== "REGION"))) n.set(w, (n.get(w) ?? 0) + 1);
    expect([...n].filter(([, k]) => k > 6).map(([w, k]) => `${w}: ${k}`)).toEqual([]);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, ein Satzanfang nicht; eine Charge nur aus dem Norden fällt durch", () => {
    expect(unbekannteGrosswoerter("Anna vive a Atlantide.")).toEqual(["Atlantide"]);
    expect(unbekannteGrosswoerter("Oggi piove. Domani no.")).toEqual([]);
    expect(unbekannteGrosswoerter("L'Etna è alto.")).toEqual([]);
    expect(raeumeIn("Il golfo di Napoli è azzurro.")).toEqual(new Set(["S"]));
    const v = verteilung(["A Milano.", "A Torino.", "A Napoli."]);
    expect(v.N * 10 > v.verortet * 3).toBe(true);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Lexikon, Akzent, è gegen e ────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. Ab Maiusc dazu è, ha, che, gli, più … */
const FUNKTIONSWOERTER = new Set(
  (
    "il lo la i le l un uno una di d a ad da in con su per tra fra " +
    "del dello della dei delle dell al allo alla ai alle all dal dallo dalla dai dalle dall " +
    "nel nello nella nei nelle nell sul sullo sulla sui sulle sull gli agli degli negli sugli dagli " +
    "e ed o ma se non si mi ti ci c vi ne io tu lui lei noi voi loro mio mia miei mie tuo tua suo sua " +
    "sono sei siamo siete era erano è ho hai ha hanno fa fai sta sto stai che chi " +
    "tutto tutta tutti tutte anche perché più così già qui là lì sì né"
  ).split(" "),
);

/** Wörter einer Zeile für die Zählung: klein, ohne Satzzeichen, Elision getrennt (l'uva ⇒ l, uva). */
const woerterKlein = (zeile: string): string[] => woerterRoh(zeile).map((w) => w.toLowerCase());

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(woerterKlein(z))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/**
 * Wörter dieser Charge, die NICHT in `WORDS_IT`, `STUFE_VOCAB_IT` oder `NACHTRAG_IT` standen und die das
 * macOS-Wörterbuch für Italienisch bestätigt hat (`osascript -l JavaScript scripts/woerterbuch-macos.js`, Vorsilbe
 * `it:`, gemessen 03.10.2026; Namen und Orte wie im Text gross geprüft - klein lehnt es „napoli" ab). Über den Korpus
 * kommen sie ins Vorlese-Lexikon (lexicon.ts: Korpus-Wörter), die Stimme spricht sie ganz.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set(
  (
    // Inhaltswörter
    "anguria annaffia applaude arancina arancine arancino ascolana bergamotto bora bussa cacciucco cantone capriole " +
    "coltivano esulta frazioni golfo mercatino mettilo milanese nuota nuotiamo panchine pastori portici pungono " +
    "scavate scoiattoli scuolabus stambecchi tartarughe telecomandata traghetto travestiamo ulivi vicoli " +
    // Orte und Landschaften
    "abruzzo adige agrigento alghero altamura ancona aosta bari basilicata bellinzona bologna bolzano bressanone " +
    "bronte brunico cagliari calabria campania capri catania chioggia colosseo como cortina cosenza cremona dolomiti " +
    "elba etna europa firenze foggia gallipoli garda gardena genova gorizia gottardo ischia italia lampedusa lecce " +
    "livorno locarno lugano maremma matera merano milano napoli nuoro olbia oristano palermo pescara pompei " +
    "procida puglia ragusa rimini roma sardegna sassari sicilia siena siracusa stromboli taranto ticino torino " +
    "trapani trasimeno trento trevi treviso trieste umbria urbino venezia verona vesuvio vipiteno walther " +
    // Namen, Feste, Figuren
    "agata alessia alex amir andrea anna arianna beatrice chicco ciro davide elena elia elias emma enzo ezio " +
    "francesco gabriele gaia gavino giada gianna ginevra gioele giorgia giorgio giovanni giulia greta hannah " +
    "halloween ilaria irene jonas lea lena leo leonardo lisa lorenzo lucia lukas marta matilde matteo mattia max " +
    "mei michela michele nicola nicolò noah noemi omar ottavia palio pietro pulcinella renzo riccardo rocco rosalia " +
    "salvatore samir samuele sara sofia tecla tiziana tommaso totò ugo valentina walter wanda yasmin yuri zoe"
  ).split(" "),
);

/**
 * Eigennamen, die das macOS-Wörterbuch NICHT kennt (gemessen 03.10.2026: „nein") - richtig geschrieben und belegt:
 * Gemeinden des Kantons Tessin bzw. Graubünden (Amtliches Gemeindeverzeichnis der Schweiz: Ascona, Biasca,
 * Mendrisio, Poschiavo; Ambrì ist ein Ortsteil von Quinto, Heimat des HC Ambrì-Piotta), Camogli (Gemeinde in
 * Ligurien), Bozen (deutscher Name von Bolzano, amtlich zweisprachig), Efisio (sardischer Vorname, Sant'Efisio in
 * Cagliari), Sartiglia (Reiterfest in Oristano zu Carnevale). Die Liste wächst nur mit Begründung.
 */
const EIGENNAMEN_OHNE_WOERTERBUCH: ReadonlySet<string> = new Set([
  "ambrì", "ascona", "biasca", "bozen", "camogli", "efisio", "mendrisio", "poschiavo", "sartiglia",
]);

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat(), ...NACHTRAG_IT].map((w) => normalizeWord(w, "it")),
);

/**
 * Die Inhaltsteile einer Zeile für die Wortprüfung: klein, ohne Satzzeichen; bei einer Elision nur das Wort HINTER
 * dem Apostroph (`dell'Abruzzo` ⇒ `abruzzo`) - der Anfang (`l`, `dell`, `sull`, `c` …) ist eine geschlossene Liste
 * (`lexicon.ts`, `ELISION_ANFAENGE_IT`), die `isRealWord` selbst prüft (Test „die Stimme buchstabiert kein Wort").
 */
const inhaltsTeile = (zeile: string): string[] =>
  zeile
    .split(/[\s,.]+/)
    .filter(Boolean)
    .map((t) => t.split("'").pop()!.toLowerCase());

/** Wörter (ab zwei Buchstaben), die weder vorher im Wortschatz standen noch bestätigt sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of inhaltsTeile(z)) {
      if (w.length >= 2 && !VORHER_BEKANNT.has(w) && !VOM_WOERTERBUCH_BESTAETIGT.has(w) && !EIGENNAMEN_OHNE_WOERTERBUCH.has(w)) {
        out.add(w);
      }
    }
  }
  return [...out];
}

/**
 * Wörter, die es NUR mit Akzent gibt (Bauplan I6, §5 Nr. 4): ihre Form ohne Akzent ist kein Wort und darf nie in
 * einer Zeile stehen (`citta` statt `città`, `perche` statt `perché`). Gebaut aus dem Wortschatz.
 */
const NUR_MIT_AKZENT: ReadonlySet<string> = new Set(
  [...VORHER_BEKANNT, ...VOM_WOERTERBUCH_BESTAETIGT]
    .filter((w) => /[àèéìòù]$/.test(w))
    .map((w) => w.normalize("NFD").replace(/[̀-ͯ]/g, ""))
    .filter((ohne) => !VORHER_BEKANNT.has(ohne)),
);
/** Namen und Orte sind ausgenommen: „Sara" ist ein Name (nicht „sarà"), „Como" eine Stadt (nicht „comò"). */
const ohneAkzentFehler = (zeile: string): string[] =>
  woerterRoh(zeile)
    .filter((w) => !NAMEN.has(w) && !(w in ORTE))
    .map((w) => w.toLowerCase())
    .filter((w) => NUR_MIT_AKZENT.has(w));

/**
 * ★ „e" gegen „è" (Befund IT-T1 §6 Schritt 7): ab Sprosse 27 ist „è" (ist) schreibbar - ein vergessener Akzent
 * ergibt das Wort „e" (und), und die Zeile bleibt scheinbar richtig. Zwei Prüfungen:
 *  1. JEDE Zeile mit „e" ist gelesen und hier eingetragen (eine neue Zeile mit „e" muss eingetragen werden);
 *  2. „e" vor einem Wort, das fast nur nach „è" steht (Adjektiv/Partizip/Ortsangabe), ist verdächtig.
 */
const ZEILEN_MIT_E_GELESEN: ReadonlySet<string> = new Set([
  "Andrea e Sara vanno a Trento in treno.",
  "A Merano Lukas parla tedesco a casa e italiano a scuola.",
  "Amir e Viola corrono al parco.",
  "A Bolzano Lisa e Luca giocano in piazza.",
  "Anna e Lea vanno a sciare a Cortina.",
  "Pane, olio e pomodoro.",
  "Giacomo e Giorgia giocano a carte.",
  "Pietro e Omar contano le conchiglie.",
  "Gabriele e Benedetta fanno una torta.",
  "Papà e io andiamo a pescare.",
  "D'estate l'anguria è fresca e dolce.",
  "Su e giù per le scale.",
]);

/** Wörter, die nach „è" stehen, nach „e" (und) aber kaum - ein Hinweis auf einen vergessenen Akzent. */
const NACH_E_VERDAECHTIG = new Set(
  (
    "molto tanto troppo già qui là lì ancora sempre appena pronto pronta pronti pronte nato nata finito finita " +
    "arrivato arrivata caldo calda freddo fredda bello bella buono buona nuovo nuova grande piccolo piccola " +
    "contento contenta stanco stanca felice vicino lontano chiuso chiusa aperto aperta in a di"
  ).split(" "),
);
const eVerdaechtig = (zeile: string): boolean => {
  const w = woerterKlein(zeile);
  return w.some((x, i) => x === "e" && NACH_E_VERDAECHTIG.has(w[i + 1] ?? ""));
};

describe("IT-T4: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch über beide Kinder-Chargen (IT-T1 + IT-T4) zusammen steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    const fehler = zuHaeufig([...T1, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die abgenutzten Wörter der frühen Charge bleiben draussen (sala, salsa, falò, sale)", () => {
    expect(ZEILEN.filter((z) => woerterKlein(z).some((w) => ["sala", "salsa", "falò", "sale"].includes(w)))).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross und mit Punkt), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Luna" : "La luna"} ${"abcdefghi"[i]}. Già.`);
    expect(zuHaeufig(neun)).toEqual(['"luna": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis (auch nicht hinter einer Elision)", () => {
    const fehler = ZEILEN.flatMap((t) => woerterKlein(t).filter((w) => gesperrtIt(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: mona, passera (Kern), piselli, banane (Wortbasis) und dell'uccello werden gefunden, palla nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(istKernGesperrtIt("passera")).toBe(true);
    expect(gesperrtIt("piselli")).toBe(true);
    expect(gesperrtIt("banane")).toBe(true);
    expect(woerterKlein("Il nido dell'uccello.").some((w) => gesperrtIt(w))).toBe(true);
    expect(gesperrtIt("palla")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder ist vom Wörterbuch bestätigt (Eigennamen ohne Wörterbuch: Liste mit Beleg)", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap(inhaltsTeile));
    expect([...VOM_WOERTERBUCH_BESTAETIGT].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
    expect([...EIGENNAMEN_OHNE_WOERTERBUCH].filter((w) => !benutzt.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und ein erfundener Ort werden gemeldet", () => {
    expect(ungeprueft(["La pizzx.", "A Atlantide."])).toEqual(["pizzx", "atlantide"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) =>
      z.split(/\s+/).some((w) => w.replace(/[,.]/g, "").length >= 2 && !isRealWord(w, "it")),
    );
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da (citta, perche, piu, papa ist erlaubt: Papst)", () => {
    const fehler = ZEILEN.flatMap((z) => ohneAkzentFehler(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „La citta è piu bella perche ...“ wird dreimal gemeldet, „La città“ und der Name „Sara“ nicht", () => {
    expect(ohneAkzentFehler("La citta è piu bella perche piove.")).toEqual(["citta", "piu", "perche"]);
    expect(ohneAkzentFehler("La città è più bella.")).toEqual([]);
    expect(ohneAkzentFehler("Sara va a Como.")).toEqual([]);
    expect(ohneAkzentFehler("Domani sara bello.")).toEqual(["sara"]);
  });

  it("jede Zeile mit „e“ ist gelesen (e = und, nie das vergessene è) - und keine steht vor einem verdächtigen Wort", () => {
    const mitE = ZEILEN.filter((z) => woerterKlein(z).includes("e"));
    expect(mitE.filter((z) => !ZEILEN_MIT_E_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_E_GELESEN].filter((z) => !mitE.includes(z))).toEqual([]);
    expect(ZEILEN.filter(eVerdaechtig)).toEqual([]);
  });

  it("Gegenprobe: „Il tè e caldo“, „Anna e di Palermo“ sind verdächtig, „Pane, olio e pomodoro“ nicht", () => {
    expect(eVerdaechtig("Il tè e caldo.")).toBe(true);
    expect(eVerdaechtig("Anna e di Palermo.")).toBe(true);
    expect(eVerdaechtig("Pane, olio e pomodoro.")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl gleichgesetzt: „Il nonno ride." und „La nonna ride." sind ein Paar. */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", gli: "ART", le: "ART", l: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  return woerterKlein(zeile)
    .map((w) => art[w] ?? pron[w] ?? w.replace(/[oaei]$/, "_"))
    .join(" ");
}

/** Paare unter `zeilen` und zwischen `zeilen` und den Vergleichszeilen `gegen` (Paare innerhalb `gegen` zählen nicht). */
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

/** Ein Text ohne Satzzeichen und Grossschreibung - so kollidiert „Il nonno ride." mit „il nonno ride". */
const textForm = (t: string): string => t.toLowerCase().replace(/[,.]/g, "").replace(/\s+/g, " ").trim();

/** Zeilen dieser Charge, die einer Vergleichszeile gleichen - als Text (ohne Satzzeichen) oder Ledger-Schlüssel. */
function kopienGegen(zeilen: string[], gegen: string[]): string[] {
  const texte = new Set(gegen.map(textForm));
  const schluessel = new Set(gegen.map((t) => bausteinKey("satz", t)));
  return zeilen.filter((t) => texte.has(textForm(t)) || schluessel.has(bausteinKey("satz", t)));
}

describe("IT-T4: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (Akzentbuchstaben werden dort zu Trennern)", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es oder einer früheren it-Charge (Text oder Ledger-Schlüssel)", () => {
    const eigene = new Set(ZEILEN);
    const frueher = [...CORPUS_IT.filter((i) => !eigene.has(i.text)), ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES];
    const texte = new Set(frueher.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(frueher.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_IT_WEG_MITTE_KIDS.filter(
      (i) => texte.has(i.text.toLowerCase()) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("keine Zeile gleicht einer Zeile von IT-T1, IT-T2, IT-T3 oder IT-T5 - auch ohne Satzzeichen und Grossschreibung", () => {
    expect(ANDERE_IT_ZEILEN.length).toBeGreaterThan(T1.length);
    expect(kopienGegen(ZEILEN, ANDERE_IT_ZEILEN)).toEqual([]);
  });

  it("Gegenprobe: eine Zeile aus T1, T2, T3 und T5 - gross und mit Punkt - wäre Kopie UND Paar", () => {
    for (const quelle of [CORPUS_IT_WEG_FRUEH_KIDS, CORPUS_IT_WEG_FRUEH_TEENS, CORPUS_IT_WEG_FRUEH_ERWACHSENE, CORPUS_IT_WEG_MITTE_TEENS]) {
      const t = quelle[5].text;
      const gross = `${t[0].toUpperCase()}${t.slice(1).replace(/\.$/, "")}.`;
      expect(kopienGegen([gross], ANDERE_IT_ZEILEN), gross).toEqual([gross]);
      expect(paare([gross], ANDERE_IT_ZEILEN), gross).toHaveLength(1);
    }
    expect(kopienGegen(["Il nonno ride."], ["il nonno ride"])).toHaveLength(1);
    expect(kopienGegen(["Il nonno ride."], ["il nonno canta"])).toEqual([]);
  });

  /**
   * GEMESSEN (03.10.2026): `bausteinKey` macht aus jedem Zeichen ausser a-z äöüß 0-9 einen Trenner - ein
   * Akzentbuchstabe verschwindet also, er wird nicht zum Grundbuchstaben. „è/e" und „là/la" stossen darum NICHT
   * zusammen (Befund IT-T1 §4 vermutete das), wohl aber zwei Zeilen, die sich nur um ein „è" oder einen
   * Akzentbuchstaben unterscheiden („Oggi è festa." / „Oggi festa.", „Papà" / „Pap"). Darum prüft der Test oben
   * die Schlüssel, nicht nur die Texte.
   */
  it("Gegenprobe: Ledger-Schlüssel - „è“ verschwindet, „e“ bleibt; zwei Zeilen, die sich nur um „è“ unterscheiden, stossen zusammen", () => {
    expect(bausteinKey("satz", "Oggi è festa.")).toBe(bausteinKey("satz", "Oggi festa."));
    expect(bausteinKey("satz", "Oggi è festa.")).not.toBe(bausteinKey("satz", "Oggi e festa."));
    expect(bausteinKey("satz", "Guarda là.")).toBe(bausteinKey("satz", "Guarda l."));
    expect(new Set(["Oggi è festa.", "Oggi festa."].map((t) => bausteinKey("satz", t))).size).toBe(1);
  });

  it("keine Paare (nur Geschlecht oder Zahl getauscht) - weder untereinander noch mit IT-T1, IT-T2, IT-T3, IT-T5 (Falle 31)", () => {
    const fehler = paare(ZEILEN, ANDERE_IT_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: nonno/nonna, lui/lei, Grossschreibung und Einzahl/Mehrzahl werden als Paar erkannt", () => {
    expect(paare(["La nonna ride."], ["il nonno ride"])).toHaveLength(1);
    expect(paare(["Il nonno ride.", "La nonna ride."])).toHaveLength(1);
    expect(paare(["Lui canta.", "Lei canta."])).toHaveLength(1);
    expect(paare(["La rosa rossa.", "le rose rosse"])).toHaveLength(1);
    expect(paare(["La sala.", "La salsa."])).toEqual([]);
  });
});

describe("IT-T4: Korpus-Anker und Auslieferung", () => {
  /**
   * ★ Merge 03.10.2026: die Reihenfolge in `CORPUS_IT` ist die der Merges (T1, T3, T2, T5, dann diese Charge) - der
   * Anker ist nur anhängend, eine spätere Charge kommt HINTER diese.
   */
  it("CORPUS_IT trägt diese Charge als geschlossenen Block direkt hinter T1, T3, T2 und T5", () => {
    const it_ = CORPUS_IT.map((i) => i.text);
    const davor = [CORPUS_IT_WEG_FRUEH_KIDS, CORPUS_IT_WEG_FRUEH_ERWACHSENE, CORPUS_IT_WEG_FRUEH_TEENS, CORPUS_IT_WEG_MITTE_TEENS];
    expect(it_.slice(0, davor.reduce((n, c) => n + c.length, 0))).toEqual(davor.flat().map((i) => i.text));
    const start = it_.indexOf(ZEILEN[0]);
    expect(start).toBe(davor.reduce((n, c) => n + c.length, 0));
    expect(it_.slice(start, start + ZEILEN.length)).toEqual(ZEILEN);
  });

  it("korpusFuer(\"it\") trägt jede Zeile dieser Charge (nichts still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("it").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_IT_WEG_MITTE_KIDS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe it t4.", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „it" bekommt an Sprosse x jede Zeile dieser Charge - und nur eigene it-Kinderzeilen`, () => {
      const { letzte, o } = grenzen(l);
      const allowed = allowedFromIntroduced(o.slice(0, letzte), "it");
      const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "it", lernweg: "it" });
      expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
      // Eigen ist der Rohtext ODER seine servierte Fassung bei diesem Stand (spätere Chargen kommen ohne ihre
      // noch nicht gelernten Satzzeichen an).
      const eigeneKinder = new Set(
        CORPUS_IT.filter((i) => i.nurWeg === "it" && i.stufen.includes("kids")).flatMap((i) => [
          i.text,
          fitText(i.text, allowed, "it") ?? i.text,
        ]),
      );
      expect(geliefert.filter((t) => !eigeneKinder.has(t))).toEqual([]);
    });

    it(`${l}: an der Maiusc-Sprosse kommt keine Zeile mit g h b z oder Akzent/Apostroph nach Maiusc an`, () => {
      const { maiusc, o } = grenzen(l);
      const allowed = allowedFromIntroduced(o.slice(0, maiusc), "it");
      const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "it", lernweg: "it" });
      expect(geliefert.filter((t) => /[ghbzèàéìùyqwx']/i.test(t))).toEqual([]);
      expect(geliefert.some((t) => ZEILEN.some((z) => fitText(z, allowed, "it") === t))).toBe(true);
    });
  }

  it("Weg „de“ und Weg „es“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("es");
    const esO = introOrder("es");
    const es = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(esO, "es"), lang: "es", lernweg: "es" });
    expect(ZEILEN.filter((t) => es.includes(t))).toEqual([]);
  });
});
