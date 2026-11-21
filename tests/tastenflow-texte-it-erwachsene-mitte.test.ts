/**
 * ★★★ Wächter IT-T6 (03.10.2026): die mittleren it-Texte für Erwachsene
 * (`corpusItWegMitteErwachsene.ts`, Sprossen ⇧ bis x: auf `it` 20-36, auf
 * `it-qzerty` 19-36). Vorbilder: `tastenflow-texte-it-teens-mitte.test.ts`
 * (IT-T5), `tastenflow-texte-it-erwachsene-frueh.test.ts` (IT-T3) und
 * `tastenflow-texte-es-erwachsen-mitte.test.ts` (ES-T6); Bauplan
 * `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §3/§5, Befund IT-T1 §6,
 * Leitfaden Fallen 26/31/37/45/48/51/58/76.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie
 * mit `introOrder("it").slice(0, n)` durchlässt - auf BEIDEN Pflicht-Tastaturen
 * -, mindestens aber die ⇧-Sprosse. Anders als bei Kindern und Jugendlichen
 * (Auto-Grossschreibung) bekommen ERWACHSENE vor ⇧ keine Zeile mit
 * Grossbuchstaben (D-2, `nurKleinschrift`): die ⇧-Zeilen dieser Charge kommen
 * erst an ⇧ an - der Wächter prüft das am Weg, den der Generator nimmt.
 * Die zwei Tastaturen rechnen VERSCHIEDEN: auf der Mac-QZERTY fehlt `m` vor ⇧
 * (es ist dort Grundtaste), alles bis `ì` steht eine Sprosse früher, und `ò`
 * kommt erst nach `ì` (Nr. 32). Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { CORPUS_IT_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusItWegMitteErwachsene";
import { CORPUS_IT_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusItWegFruehKids";
import { CORPUS_IT_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusItWegFruehTeens";
import { CORPUS_IT_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusItWegFruehErwachsene";
import { CORPUS_IT_WEG_MITTE_KIDS } from "../src/lib/typing/corpusItWegMitteKids";
import { CORPUS_IT_WEG_MITTE_TEENS } from "../src/lib/typing/corpusItWegMitteTeens";
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
const ZEILEN = CORPUS_IT_WEG_MITTE_ERWACHSENE.map((i) => i.text);
/** Die frühe Erwachsenen-Charge IT-T3 - dieselbe Stufe: Wortbudget gilt über T3 + T6 (Falle 45). */
const FRUEHE_ERWACHSENE = CORPUS_IT_WEG_FRUEH_ERWACHSENE.map((i) => i.text);
/** Alle fünf fertigen it-Chargen (T1-T5), gegen die Kopien, Ledger-Schlüssel und Paare geprüft werden (Falle 31, 51). */
const ANDERE_IT_ZEILEN = [
  ...CORPUS_IT_WEG_FRUEH_KIDS,
  ...CORPUS_IT_WEG_FRUEH_TEENS,
  ...CORPUS_IT_WEG_FRUEH_ERWACHSENE,
  ...CORPUS_IT_WEG_MITTE_KIDS,
  ...CORPUS_IT_WEG_MITTE_TEENS,
].map((i) => i.text);
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

describe("IT-T6: jede Zeile an ihrer Sprosse (it und it-qzerty)", () => {
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
      for (const item of CORPUS_IT_WEG_MITTE_ERWACHSENE) {
        const s = sprosseAuf(item.text, l);
        if (s === null || s < shift || s > letzte) fehler.push(`"${item.text}": Sprosse ${s}`);
        const tier = minTierFor(item.text, "it");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
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

  it("jede Zeile mit ò vor ù trägt ein ì - sie steht auf beiden Tastaturen an Sprosse 32 (nie früh auf it, spät auf der QZERTY)", () => {
    const mitO = ZEILEN.filter((t) => t.includes("ò") && (sprosseAuf(t, "it") ?? 0) <= 32);
    expect(mitO.length).toBeGreaterThanOrEqual(7);
    expect(mitO.filter((t) => !t.includes("ì") || sprosseAuf(t, "it") !== 32 || sprosseAuf(t, "it-qzerty") !== 32)).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet, Elision und è nicht vor ihrer Einheit", () => {
    expect(sprosseAuf("Marta firma il contratto a Torino.", "it")).toBe(20);
    expect(sprosseAuf("Marta firma il contratto a Torino.", "it-qzerty")).toBe(19);
    expect(sprosseAuf("Il mio contratto è scaduto a gennaio.", "it")).toBe(27);
    expect(sprosseAuf("Ho la carta d'identità elettronica.", "it")).toBe(29);
    expect(sprosseAuf("Ho la carta d'identità elettronica.", "it-qzerty")).toBe(28);
    expect(sprosseAuf("Perciò lunedì andrò all'anagrafe.", "it")).toBe(32);
    expect(sprosseAuf("Perciò lunedì andrò all'anagrafe.", "it-qzerty")).toBe(32);
    // Eine ò-Zeile ohne ì läge auf `it` früh und auf der QZERTY erst an 32 - genau das vermeidet die Charge.
    expect(sprosseAuf("Però il turno cade di sabato.", "it")).toBe(25);
    expect(sprosseAuf("Però il turno cade di sabato.", "it-qzerty")).toBe(32);
    expect(sprosseAuf("Il fax non va.", "it")).toBe(36);
  });

  /**
   * GEMESSEN am Ende von IT-T6 (vom Code gezählt) - jede Grenze darf künftig
   * nur STEIGEN. Unter 12 nur, wo die Sprache wenig hergibt: `ò` (QZERTY 32)
   * kommt nur in den sieben ò+ì-Zeilen vor. Punkt und Komma tragen keine
   * eigene Zeile (weglassbar).
   */
  const MINDESTENS_JE_SPROSSE: Record<string, Record<number, number>> = {
    it: { 20: 28, 23: 27, 24: 26, 25: 26, 26: 23, 27: 28, 28: 23, 29: 38, 30: 22, 31: 18, 32: 25, 33: 18, 34: 13, 35: 16, 36: 12 },
    "it-qzerty": { 19: 28, 22: 27, 23: 26, 24: 26, 25: 23, 26: 28, 27: 23, 28: 38, 29: 22, 30: 18, 31: 18, 32: 7, 33: 18, 34: 13, 35: 16, 36: 12 },
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

describe("IT-T6: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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
    expect(enthaeltEinheit("Marta firma", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("marta firma", SHIFT_UNIT)).toBe(false);
    expect(ohneNeueEinheit([{ text: "Il bus parte.", sprosse: 23 }], "it")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Il bus parte.", sprosse: 25 }], "it")).toEqual([]);
    expect(ohneNeueEinheit([{ text: "Il bus parte.", sprosse: 24 }], "it-qzerty")).toEqual([]);
  });
});

// ── Die Apostroph-Sprosse: Elision (Pflicht, Befund IT-T1 §3a) ──────────────

/** Eine Elision: Buchstabe + Apostroph + Buchstabe (l'affitto, c'è, un'ora) oder `po'`. */
const ELISION = /\p{L}'\p{L}|\bpo'/iu;

describe("IT-T6: Elision an der Apostroph-Sprosse", () => {
  for (const l of TASTATUREN) {
    it(`${l}: an der '-Sprosse trägt JEDE Zeile eine Elision (gemessen 38) - und keine Zeile davor hat eine`, () => {
      const { o } = grenzen(l);
      const sApo = o.indexOf("'") + 1;
      const anDerSprosse = ZEILEN.filter((t) => sprosseAuf(t, l) === sApo);
      expect(anDerSprosse.filter((t) => !ELISION.test(t))).toEqual([]);
      expect(anDerSprosse.length).toBeGreaterThanOrEqual(30);
      expect(ZEILEN.filter((t) => t.includes("'") && (sprosseAuf(t, l) ?? 0) < sApo)).toEqual([]);
    });
  }

  it("auch nach der '-Sprosse kommt die Elision weiter vor (mindestens 25 Zeilen danach)", () => {
    const sApo = grenzen("it").o.indexOf("'") + 1;
    expect(ZEILEN.filter((t) => (sprosseAuf(t, "it") ?? 0) > sApo && ELISION.test(t)).length).toBeGreaterThanOrEqual(25);
  });

  it("Gegenprobe: l'affitto, c'è, un'ora, sessant'anni sind Elisionen - ein Wort ohne Apostroph nicht", () => {
    for (const t of ["L'affitto costa.", "C'è il sole.", "Un'ora.", "A sessant'anni."]) expect(ELISION.test(t), t).toBe(true);
    expect(ELISION.test("Il fax non va.")).toBe(false);
  });

  for (const l of TASTATUREN) {
    it(`${l}: mit echtem Korpus steht an der '-Sprosse in echten Runden für Erwachsene eine Elision dieser Charge`, () => {
      const { o } = grenzen(l);
      const intro = o.slice(0, o.indexOf("'") + 1);
      const echt = Math.random;
      let s = 7601;
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
          for (const z of adaptiveRound({ introduced: intro, focus: ["'"], stufe: "erwachsen", lang: "it", lernweg: "it", count: 12 })) {
            texte.push(z.text);
          }
        }
      } finally {
        Math.random = echt;
      }
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

describe("IT-T6: Form", () => {
  it("jede Zeile beginnt gross, endet mit Punkt, hat nur Buchstaben, Apostroph, Komma und Punkt", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("das Komma wird geübt (D-1: direkt nach ⇧) - mindestens 30 Zeilen tragen eins (gemessen 33)", () => {
    expect(ZEILEN.filter((t) => t.includes(",")).length).toBeGreaterThanOrEqual(30);
  });

  it("Gegenprobe: Kleinschreibung am Anfang, fehlender Punkt, ?, !, Anführung, Ziffer, È, Leerzeichen vor Komma", () => {
    for (const t of [
      "il bus parte.", "Il bus parte", "Parti?", "Basta!", 'Dice "ciao".', "Ho 60 anni.", "È tardi.",
      "Signora , tocca a lei.", "Signora,tocca a lei.", "Piove. resto a casa.", "Socio-sanitario.",
    ]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("Ormai è tardi, torno a casa.")).toBe(false);
    expect(formFehler("Mi serve l'IBAN, poi pago con un bonifico.")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller italienischen Zeilen (`helfer/itTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg it, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_IT_WEG_MITTE_ERWACHSENE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("it");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Orte und Namen: jedes Grosswort bekannt, Italien in seiner Breite ───────

/**
 * Orte, Landschaften und Bauwerke mit ihrem Raum - als WORTGRUPPE (längste zuerst),
 * damit „San Marino" nicht als „Marino" und „Valle dei Templi" als ein Ort zählt.
 * N Norden · M Mitte (Toskana, Umbrien, Marken, Latium) · S Süden (Abruzzen bis
 * Kalabrien, wie ISTAT) · I Inseln · CH Tessin und italienisches Graubünden ·
 * BZ Südtirol · RSM San Marino · AUSLAND (Familiengeschichten, Arbeit, EU).
 */
const ORTE: Record<string, string> = {
  // Norden
  Torino: "N", Milano: "N", Padova: "N", Como: "N", Cremona: "N", Trento: "N", Genova: "N", Trieste: "N",
  Aosta: "N", Brescia: "N", Ivrea: "N", Varese: "N", "Arena di Verona": "N", Verona: "N", Ravenna: "N", Langhe: "N",
  Forlì: "N", Cantù: "N", Courmayeur: "N", Gressoney: "N", Bra: "N", Piemonte: "N", Mestre: "N", Cortina: "N",
  Novara: "N", Piacenza: "N", Pavia: "N", Modena: "N",
  // Mitte
  Ancona: "M", Roma: "M", Ascoli: "M", "Ascoli Piceno": "M", Livorno: "M", Terni: "M", Perugia: "M", Viterbo: "M",
  Arezzo: "M", Pistoia: "M", Lazio: "M", Prato: "M", Firenze: "M", Quirinale: "M", Fiumicino: "M", Pisa: "M",
  Macerata: "M", Siena: "M", Viareggio: "M", Grosseto: "M", Assisi: "M", Rieti: "M", Orvieto: "M",
  // Süden
  Cosenza: "S", Napoli: "S", Pescara: "S", Matera: "S", Taranto: "S", Crotone: "S", Caserta: "S", Foggia: "S",
  Lecce: "S", Pompei: "S", Puglia: "S", Ostuni: "S", Bari: "S", Melfi: "S", Benevento: "S", Abruzzo: "S",
  Catanzaro: "S", Calabria: "S", "Gioia Tauro": "S", Irpinia: "S", Tropea: "S", Aquila: "S", Sud: "S",
  "Reggio Calabria": "S", Bitonto: "S", Salento: "S",
  // Inseln
  Catania: "I", Palermo: "I", Nuoro: "I", Siracusa: "I", Sassari: "I", Trapani: "I", Agrigento: "I", Cagliari: "I",
  Ragusa: "I", Acireale: "I", Sciacca: "I", "Tempio Pausania": "I", Olbia: "I", "Valle dei Templi": "I",
  Oristano: "I", Carbonia: "I", Pantelleria: "I", Sardegna: "I", Quartu: "I", Tortolì: "I", Cefalù: "I",
  Ballarò: "I", Barumini: "I", "Su Nuraxi": "I", "Teatro Massimo": "I",
  // Tessin und italienisches Graubünden
  Lugano: "CH", Mendrisio: "CH", Poschiavo: "CH", Chiasso: "CH", Locarno: "CH", Faido: "CH", Ticino: "CH",
  Grigioni: "CH", Biasca: "CH", Bellinzona: "CH", Svizzera: "CH", Roveredo: "CH", Ascona: "CH", Giubiasco: "CH",
  "Valle Maggia": "CH", Coira: "CH", Airolo: "CH",
  // Südtirol
  Merano: "BZ", Laives: "BZ", Vipiteno: "BZ", Silandro: "BZ", Ortisei: "BZ", "Alto Adige": "BZ", Brunico: "BZ",
  Bressanone: "BZ", Bolzano: "BZ", "Val Badia": "BZ", Brennero: "BZ",
  // San Marino
  "San Marino": "RSM", Serravalle: "RSM", "Borgo Maggiore": "RSM",
  // Ausland (Familiengeschichten, Arbeit, EU)
  Lima: "AUSLAND", Grecia: "AUSLAND", Argentina: "AUSLAND", Slovenia: "AUSLAND", "Monaco di Baviera": "AUSLAND",
  Albania: "AUSLAND", America: "AUSLAND", Londra: "AUSLAND", Uruguay: "AUSLAND", Bruxelles: "AUSLAND",
  Strasburgo: "AUSLAND",
};

/** Menschen, Einrichtungen, Feste, Marken, Abkürzungen und Werke - kein Ort. */
const NAMEN = new Set(
  (
    "Marta Rosario Antonio Carla Davide Nicola Elena Ivan Ana Matteo Silvia Rosa Fatima Mamadou Teresa Piero " +
    "Luca Cristina Lucia Monica Renato Concetta Simone Lisa Vito Nadia Remo Paola Marco Martina Giorgio Luigi Angela " +
    "Giulia Gianni Gaia Giovanna Agostino Giovanni Gregorio Giorgia Gino Greta Chiara Rocco Michela Michele Hannah " +
    "Fabiola Gianotti Olga Bruno Sebastiano Barbara Benedikt Fabio Bianca Enzo Stefan Pino Grazia Deledda Ervin " +
    "Paolo Maria Ylenia Yusuf Walter Wanda Werner Laura Monika Gloria Gaetano Debora Adriano Olivetti " +
    "IVA NVDA CERN UNESCO INPS IBAN ATA ISTAT Paralimpiadi Macchina Santa Tribunale Regione Accademia Crusca " +
    "Libertà Palazzo Pubblico Perdonanza Italia Parlamento Croce Rossa Slow Food Xylella Nobel Reggia Fiat Walser"
  ).split(" "),
);

/** Die Wörter einer Zeile ohne Satzzeichen, mit abgeschnittener Elision („dall'Albania" ⇒ „Albania"). */
function woerter(zeile: string): string[] {
  return zeile
    .replace(/[,.]/g, "")
    .split(" ")
    .map((w) => w.slice(w.lastIndexOf("'") + 1));
}

/** Orte einer Zeile (längste Wortgruppe zuerst) und die Wortstellen, die sie bedecken. */
function orteIn(zeile: string): { raeume: Set<string>; orte: string[]; bedeckt: Set<number> } {
  const w = woerter(zeile);
  const raeume = new Set<string>();
  const orte: string[] = [];
  const bedeckt = new Set<number>();
  for (let i = 0; i < w.length; i++) {
    for (const len of [3, 2, 1]) {
      const gruppe = w.slice(i, i + len).join(" ");
      if (i + len <= w.length && gruppe in ORTE) {
        raeume.add(ORTE[gruppe]);
        orte.push(gruppe);
        for (let k = i; k < i + len; k++) bedeckt.add(k);
        i += len - 1;
        break;
      }
    }
  }
  return { raeume, orte, bedeckt };
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

describe("IT-T6: Orte aus dem ganzen italienischen Sprachraum - der Norden nicht vorne", () => {
  it("jedes grossgeschriebene Wort in der Zeile ist Satzanfang, Teil eines bekannten Ortes oder ein Name", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Satzanfang, der ein Name oder Ort ist, steht in den Listen (kein ungeprüfter Name)", () => {
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
   * GEMESSEN am Ende von IT-T6: N 29 · M 27 · S 34 · I 35 · CH 30 · BZ 27 · RSM 9 · Ausland 10 (Zeilen je Raum;
   * eine Zeile kann zwei Räume tragen), 189 von 343 Zeilen verortet. Johannes: Süd und Inseln, Tessin und
   * Südtirol so stark wie der Norden - und gleichmässig (Auftrag T6): kein Raum über ein Viertel.
   */
  it("Süden, Inseln und Tessin/Graubünden je mindestens so oft wie der Norden; Mitte und Südtirol nah dran; San Marino da; kein Raum über ein Viertel", () => {
    const n = raumZahl(ZEILEN);
    const nord = n.get("N") ?? 0;
    const text = [...n].map(([r, k]) => `${r} ${k}`).join(" · ");
    expect(nord, text).toBeGreaterThan(0);
    for (const r of ["S", "I", "CH"]) expect(n.get(r) ?? 0, `${r}: ${text}`).toBeGreaterThanOrEqual(nord);
    for (const r of ["M", "BZ"]) expect((n.get(r) ?? 0) * 5, `${r}: ${text}`).toBeGreaterThanOrEqual(nord * 4);
    expect(n.get("RSM") ?? 0, text).toBeGreaterThanOrEqual(6);
    const verortet = ZEILEN.filter((z) => orteIn(z).raeume.size > 0).length;
    expect(verortet, text).toBeGreaterThanOrEqual(180);
    expect(nord * 5, `Norden höchstens ein Fünftel der verorteten Zeilen: ${text}`).toBeLessThanOrEqual(verortet);
    for (const [r, k] of n) expect(k * 4, `${r} über ein Viertel: ${text}`).toBeLessThanOrEqual(verortet);
  });

  it("kein einzelner Ort steht in mehr als 6 Zeilen (Orte gleichmässig, wie IT-T4)", () => {
    const je = new Map<string, number>();
    for (const z of ZEILEN) for (const o of new Set(orteIn(z).orte)) je.set(o, (je.get(o) ?? 0) + 1);
    expect([...je].filter(([, k]) => k > 6).map(([o, k]) => `${o}: ${k}`)).toEqual([]);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, Wortgruppen und Elision zählen richtig, ein Nord-Übergewicht fällt auf", () => {
    expect(unbekannteGrosswoerter("Marta vive a Atlantide.")).toEqual(["Atlantide"]);
    expect(unbekannteGrosswoerter("La famiglia di Ervin è arrivata dall'Albania.")).toEqual([]);
    expect(unbekannteGrosswoerter("Andiamo a San Leucio.")).toEqual(["San", "Leucio"]);
    expect(orteIn("Simone ripara auto a San Marino.").raeume).toEqual(new Set(["RSM"]));
    expect(orteIn("La Valle dei Templi è ad Agrigento.").orte).toEqual(["Valle dei Templi", "Agrigento"]);
    const n = raumZahl(["A Torino.", "A Milano.", "A Napoli."]);
    expect((n.get("S") ?? 0) >= (n.get("N") ?? 0)).toBe(false);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Lexikon, Akzent, è gegen e ───────

/**
 * Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. Wie IT-T5, dazu die Präpositions-
 * artikel vor Elision (`all'`, `dell'`, `dall'`, `nell'`, `sull'`) - sie sind dieselben Wörter wie `alla`, `della` ….
 */
const FUNKTIONSWOERTER = new Set(
  (
    "il lo la i le gli un uno una di a ad da in con su per tra fra " +
    "del dello della dei delle degli al allo alla ai alle agli dal dallo dalla dai dalle " +
    "nel nello nella nei nelle sul sullo sulla sui sulle " +
    "e ed o ma se non si mi ti ci vi ne io tu lui lei noi voi loro " +
    "mio mia miei mie tuo tua suo sua nostro nostra sono sei siamo siete era erano è ho ha hanno " +
    "fa fai sta sto stai tutto tutta tutti tutte che chi anche più perché così poi ora già " +
    "questo questa quest c l d un po all dell dall nell sull"
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
 * Vorsilbe `it:`, gemessen 03.10.2026; Gegenprobe `qwxz` und `napoli` abgelehnt). Abgelehnt wurden `grotto`,
 * `tiflodidattica`, `walser` (klein), `webinar`, `working` - sie stehen in keiner Zeile. Namen und Orte prüfen die
 * Listen oben, nicht das Wörterbuch.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set([
  "agriturismo", "agrumi", "alpino", "anticipata", "antiquaria", "approva", "assegno", "babysitter", "bagnino",
  "barra", "bilingue", "bilingui", "braille", "call", "cardiologo", "center", "clinica", "comincerò", "compilo",
  "congedo", "dattilografia", "dentistico", "dirige", "display", "elettricista", "emigrata", "emigrate", "export",
  "extravergine", "facchini", "fax", "federale", "frantoio", "frontaliere", "frontalieri", "geometra", "graduatorie",
  "libraia", "magazziniere", "michetta", "minatore", "monolocale", "navigo", "nuraghe", "parziale", "paternità",
  "polizza", "portuale", "pupi", "quattordicesima", "questionario", "quorum", "rata", "reggenti", "ricercatrice",
  "rinnovarlo", "rosetta", "sanitario", "scarseggia", "serale", "traghetti", "traghetto", "transumanza", "trasferita",
  "trasloca", "travertino", "ulivi", "welfare", "workshop", "zibibbo", "autogrill",
]);

/**
 * ★ Zwei Regionalwörter, die das macOS-Wörterbuch NICHT kennt und die trotzdem bleiben - jedes ist das Thema seiner
 * Zeile (Geosynonym, Bauplan D3) und trägt seinen Beleg: `mappina` (Neapel, Spültuch) steht als Geosynonym in
 * `recherche-italienisch-2026-10-02/texte-quellen.md` §3.1 (Wikipedia „Geosinonimia" + Crusca, [L]); `natel`
 * (Tessin, Mobiltelefon) steht dort §3.3 als [G], ungeprüft - im Befund als Zweifelsfall geführt. Nach dem
 * Einhängen kennt das Vorlese-Lexikon beide (Korpuswörter), die Stimme buchstabiert sie nicht (Wächter unten).
 */
const REGIONALWOERTER_MIT_BELEG: ReadonlySet<string> = new Set(["mappina", "natel"]);

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat(), ...NACHTRAG_IT].map((w) => normalizeWord(w, "it")),
);

/** Anfänge vor dem Apostroph (geschlossene Liste wie `ELISION_ANFAENGE_IT` in lexicon.ts, soweit hier gebraucht). */
const ELISIONS_ANFAENGE = new Set(["l", "un", "dell", "all", "dall", "nell", "sull", "c", "d", "quest", "sessant"]);

/** Ist das Wort (klein, Name/Ort ausgenommen) geprüft? Eine Elision gilt, wenn Anfang und Wort dahinter es sind. */
function wortGeprueft(w: string): boolean {
  const n = normalizeWord(w, "it");
  const bekannt = (x: string) => VORHER_BEKANNT.has(x) || VOM_WOERTERBUCH_BESTAETIGT.has(x) || REGIONALWOERTER_MIT_BELEG.has(x);
  if (n.length < 2 || bekannt(n)) return true;
  if (!n.includes("'")) return false;
  const anfang = n.slice(0, n.lastIndexOf("'"));
  const rest = n.slice(n.lastIndexOf("'") + 1);
  return ELISIONS_ANFAENGE.has(anfang) && (rest.length < 2 || bekannt(rest));
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
/** Namen und Orte bleiben aussen vor: „Como“ ist eine Stadt, nicht ein „comò“ (Kommode) ohne Akzent. */
const ohneAkzentFehler = (zeile: string): string[] =>
  zeile
    .replace(/[,.]/g, "")
    .split(/[ ']/)
    .filter((w) => !NAMEN.has(w) && !(w in ORTE))
    .map((w) => w.toLowerCase())
    .filter((w) => NUR_MIT_AKZENT.has(w));

/**
 * „e" (und) gegen „è" (ist): ab Sprosse 27 ist „è" schreibbar - ein fehlender Akzent wäre ein ANDERES Wort
 * (`il contratto e scaduto`). Jede Zeile mit einem allein stehenden „e" ist darum gelesen und hier eingetragen
 * (in jeder ist „e" = und); eine neue Zeile mit „e" muss hier stehen, sonst wird der Wächter rot.
 */
const ZEILEN_MIT_E_GELESEN: ReadonlySet<string> = new Set([
  "Ana viene da Lima e fa la cuoca a Roma.",
  "Luca e Cristina comprano casa ad Ascoli.",
  "Monica fa la pendolare tra Vipiteno e Trento.",
  "Nel modulo scrivo nome, cognome e codice fiscale.",
  "A Poschiavo Remo vende latte e miele.",
  "Laura abita a Como e insegna a Lugano.",
  "A marzo Milano e Cortina hanno ospitato le Paralimpiadi.",
  "A Lugano molti lavorano nelle banche e nelle assicurazioni.",
  "La guardia medica è aperta di notte, il sabato e la domenica.",
  "A Brunico ogni cartello è in italiano e in tedesco.",
  "All'anagrafe di Bari prendo il numero e aspetto.",
  "All'ospedale di Bolzano si parla italiano e tedesco.",
  "Domenica e lunedì si vota per il referendum.",
  "A Giubiasco Werner ripara computer e stampanti per le aziende.",
  "Il Parlamento europeo ha sede a Bruxelles e a Strasburgo.",
]);
const mitE = (z: string): boolean => /(^| )e( |$)/i.test(z.replace(/[,.]/g, ""));

describe("IT-T6: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * Falle 45: das Budget gilt je STUFE - auch über beide Erwachsenen-Chargen (IT-T3 früh + IT-T6 Mitte)
   * zusammen steht kein Inhaltswort in mehr als 8 Zeilen. T1/T4 (Kinder), T2/T5 (Jugend) sind andere Stufen.
   */
  it("auch über beide Erwachsenen-Chargen (T3 + T6) steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    const fehler = zuHaeufig([...FRUEHE_ERWACHSENE, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross am Satzanfang und nach Elision), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 3 === 0 ? "Affitto" : i % 3 === 1 ? "l'affitto" : "dell'affitto"} ${"abcdefghi"[i]}.`);
    expect(zuHaeufig(neun)).toEqual(['"affitto": 9 Zeilen']);
    expect(zuHaeufig(Array.from({ length: 9 }, () => "all'ufficio sì."))).toEqual(['"ufficio": 9 Zeilen', '"sì": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis, auch nicht hinter einer Elision", () => {
    const fehler = ZEILEN.flatMap((t) =>
      t.replace(/[,.]/g, "").split(" ").filter((w) => gesperrtIt(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: mona, passera (Kern), disabile, cieco (Wortbasis) und l'inferno werden gefunden, disabilità und monaco nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(istKernGesperrtIt("Passera")).toBe(true);
    expect(gesperrtIt("disabile")).toBe(true);
    expect(gesperrtIt("cieco")).toBe(true);
    expect(gesperrtIt("l'inferno")).toBe(true);
    expect(gesperrtIt("disabilità")).toBe(false);
    expect(gesperrtIt("monaco")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder ist vom Wörterbuch bestätigt (Namen und Orte: Listen oben)", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.toLowerCase().replace(/[,.]/g, "").split(/[ ']/)));
    expect([...VOM_WOERTERBUCH_BESTAETIGT].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
    expect([...REGIONALWOERTER_MIT_BELEG].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort, die abgelehnten grotto und webinar und eine Elision mit falschem Anfang werden gemeldet", () => {
    expect(ungeprueft(["Ho visto la casx.", "Un grotto in valle.", "Il webinar inizia.", "Xyz'affitto."])).toEqual(["casx", "grotto", "webinar", "xyz'affitto"]);
    expect(ungeprueft(["Un'impiegata del comune.", "La famiglia è arrivata dall'Albania."])).toEqual([]);
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

  it("Gegenprobe: „Ho gia pagato la tassa“ und „lunedi“ werden gemeldet, die richtigen Formen und ein Name nicht", () => {
    expect(ohneAkzentFehler("Ho gia pagato la tassa sui rifiuti.")).toContain("gia");
    expect(ohneAkzentFehler("Lunedi comincio in un nuovo reparto.")).toContain("lunedi");
    expect(ohneAkzentFehler("Ho già pagato la tassa sui rifiuti.")).toEqual([]);
    expect(ohneAkzentFehler("Gino vende scarpe.")).toEqual([]);
    expect(ohneAkzentFehler("Laura abita a Como.")).toEqual([]);
    expect(ohneAkzentFehler("Compro un como.")).toEqual(["como"]);
  });

  it("jede Zeile mit „e“ ist gelesen (e = und, nie das gemeinte è)", () => {
    const mit = ZEILEN.filter(mitE);
    expect(mit.filter((z) => !ZEILEN_MIT_E_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_E_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Il contratto e scaduto.“ wäre eine neue, ungelesene Zeile mit „e“", () => {
    expect(mitE("Il contratto e scaduto.")).toBe(true);
    expect(ZEILEN_MIT_E_GELESEN.has("Il contratto e scaduto.")).toBe(false);
    expect(mitE("Il mio contratto è scaduto a gennaio.")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl gleichgesetzt: „Mio figlio è infermiere" und „Mia figlia è infermiera" sind ein Paar. */
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

describe("IT-T6: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der keine Akzente kennt: aus „è“ wird nichts, aus „sì“ „s“)", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer früheren - weder it (andere Chargen) noch de/en/fr/es (Text oder Ledger-Schlüssel)", () => {
    const eigene = new Set(ZEILEN);
    const frueher = [...CORPUS_IT.filter((i) => !eigene.has(i.text)), ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES];
    const texte = new Set(frueher.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(frueher.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_IT_WEG_MITTE_ERWACHSENE.filter(
      (i) => texte.has(i.text.toLowerCase()) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("keine Zeile gleicht einer Zeile von IT-T1 bis IT-T5 (Text ohne Satzzeichen und Grossschreibung, Ledger-Schlüssel)", () => {
    const ohne = (t: string) => t.toLowerCase().replace(/[,.]/g, "");
    const texte = new Set(ANDERE_IT_ZEILEN.map(ohne));
    const schluessel = new Set(ANDERE_IT_ZEILEN.map((t) => bausteinKey("satz", t)));
    const fehler = ZEILEN.filter((t) => texte.has(ohne(t)) || schluessel.has(bausteinKey("satz", t)));
    expect(fehler).toEqual([]);
  });

  it("keine Paare - weder untereinander noch mit einer Zeile von IT-T1 bis IT-T5 (Falle 31)", () => {
    const fehler = paare(ZEILEN, ANDERE_IT_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie einer früheren Zeile mit anderer Grossschreibung, Paar und Ledger-Schlüssel werden erkannt", () => {
    expect(paare(["Mio figlio è infermiere.", "Mia figlia è infermiera."])).toHaveLength(1);
    // Der Ledger-Schlüssel kennt keine Akzente: „è“ fällt ganz weg - „Il mutuo è fisso.“ und „il mutuo fisso“ wären EIN Baustein.
    expect(bausteinKey("satz", "Il mutuo è fisso.")).toBe(bausteinKey("satz", "il mutuo fisso"));
    expect(paare(["Il bus parte.", "Il bus arriva."])).toEqual([]);
    // Je eine Zeile aus T1 bis T5, gross und mit Punkt geschrieben, wäre Kopie UND Paar.
    for (const charge of [CORPUS_IT_WEG_FRUEH_KIDS, CORPUS_IT_WEG_FRUEH_TEENS, CORPUS_IT_WEG_FRUEH_ERWACHSENE, CORPUS_IT_WEG_MITTE_KIDS, CORPUS_IT_WEG_MITTE_TEENS]) {
      const t = charge[0].text.replace(/\.$/, "");
      const gross = `${t[0].toUpperCase()}${t.slice(1)}.`;
      expect(paare([gross], ANDERE_IT_ZEILEN), gross).toHaveLength(1);
      expect(ANDERE_IT_ZEILEN.map((x) => bausteinKey("satz", x))).toContain(bausteinKey("satz", gross));
    }
  });
});

describe("IT-T6: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_IT trägt jede Zeile dieser Charge als geschlossenen Block HINTER allen fünf früheren it-Chargen", () => {
    const it_ = CORPUS_IT.map((i) => i.text);
    expect(ZEILEN.filter((t) => !it_.includes(t))).toEqual([]);
    const start = it_.indexOf(ZEILEN[0]);
    expect(it_.slice(start, start + ZEILEN.length)).toEqual(ZEILEN);
    for (const andere of [CORPUS_IT_WEG_FRUEH_KIDS, CORPUS_IT_WEG_FRUEH_TEENS, CORPUS_IT_WEG_FRUEH_ERWACHSENE, CORPUS_IT_WEG_MITTE_KIDS, CORPUS_IT_WEG_MITTE_TEENS]) {
      expect(start).toBeGreaterThanOrEqual(it_.indexOf(andere[andere.length - 1].text) + 1);
    }
  });

  it("korpusFuer(\"it\") trägt jede Zeile (nichts von `mergeCorpus` still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("it").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_IT_WEG_MITTE_ERWACHSENE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe it t6.", kind: "satz" as const, stufen: ["erwachsen" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „it“ bekommt für Erwachsene an Sprosse x jede Zeile vollständig - und nur eigene it-Erwachsenenzeilen`, () => {
      const { letzte, o } = grenzen(l);
      const allowed = allowedFromIntroduced(o.slice(0, letzte), "it");
      const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "it", lernweg: "it", umschalt: true });
      expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
      const eigeneErwachsene = new Set(
        CORPUS_IT.filter((i) => i.nurWeg === "it" && i.stufen.includes("erwachsen")).map((i) => fitText(i.text, allowed, "it")),
      );
      expect(geliefert.filter((t) => !eigeneErwachsene.has(t))).toEqual([]);
    });

    /**
     * ★ D-2: vor ⇧ bekommen Erwachsene keine Grossbuchstaben - die ⇧-Zeilen dieser Charge kommen dort nicht an,
     * weder über `corpusItemsFor` (mit `umschalt: false`, wie der Generator fragt) noch in echten Runden.
     * Gegenprobe: dieselben Zeilen GINGEN durch `fitText` (Auto-Grossschreibung) - es ist D-2, die sie fernhält.
     */
    it(`${l}: eine Sprosse vor ⇧ kommt für Erwachsene keine Zeile dieser Charge an (D-2) - auch nicht in echten Runden`, () => {
      const { shift, o } = grenzen(l);
      const vorher = o.slice(0, shift - 1);
      const allowed = allowedFromIntroduced(vorher, "it");
      const eigene = new Set(ZEILEN.map((t) => fitText(t, allowedFromIntroduced(o, "it"), "it")));
      const davor = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "it", lernweg: "it", umschalt: false });
      expect(davor.filter((t) => eigene.has(t) || ZEILEN.includes(t))).toEqual([]);
      expect(davor.filter((t) => t !== t.toLowerCase())).toEqual([]);
      // Gegenprobe: ohne D-2 (Jugend, Auto-Grossschreibung) passten mehrere ⇧-Zeilen schon hier.
      expect(ZEILEN.filter((t) => fitText(t, allowed, "it") !== null).length).toBeGreaterThan(5);
      const echt = Math.random;
      let s = 7651;
      const texte: string[] = [];
      try {
        for (let r = 0; r < 5; r++) {
          let a = s++ >>> 0;
          Math.random = () => {
            a = (a + 0x6d2b79f5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
          };
          for (const z of adaptiveRound({ introduced: vorher, stufe: "erwachsen", lang: "it", lernweg: "it", count: 12 })) texte.push(z.text);
        }
      } finally {
        Math.random = echt;
      }
      expect(texte.filter((t) => t !== t.toLowerCase())).toEqual([]);
    });
  }

  it("Kinder, Jugendliche und die Wege „de“/„es“ bekommen keine dieser Zeilen", () => {
    setLayout("it");
    const o = introOrder("it");
    const alle = allowedFromIntroduced(o, "it");
    for (const stufe of ["kids", "teens"] as const) {
      const g = corpusItemsFor({ stufe, allowed: alle, lang: "it", lernweg: "it" });
      expect(ZEILEN.filter((t) => g.includes(t)), stufe).toEqual([]);
    }
    setLayout("de");
    const de = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("es");
    const es = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(introOrder("es"), "es"), lang: "es", lernweg: "es" });
    expect(ZEILEN.filter((t) => es.includes(t))).toEqual([]);
  });
});
