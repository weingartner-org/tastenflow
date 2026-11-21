/**
 * ★★★ Wächter IT-T7 (03.10.2026): die it-Texte für Kinder am ENDE des
 * Lernwegs (`corpusItWegEndeKids.ts`) - alle Sprossen nach „x":
 * Satzzeichen `? ! " : ; - ( )`, Ziffern `1-9 0`, Sonderzeichen
 * `% & / + * = _ < > $ | € @ #` und `[ ]` (nur `it`) bzw. `{ }` (nur `it-qzerty`).
 * Vorbilder: `tastenflow-texte-it-kids-mitte.test.ts` (IT-T4) und
 * `tastenflow-texte-es-kids-ende.test.ts` (ES-T7); Bauplan
 * `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §1 (I19), §3, Leitfaden Fallen
 * 26/31/37/45/48/51/58/76, Befund `BEFUND-2026-10-02-IT-T7-KIDS-ENDE.md`.
 *
 * Zwei Sprossen je Zeile werden AUSGERECHNET, auf `it` UND `it-qzerty`:
 *  - die VOLLE Sprosse: ab ihr erscheint die Zeile mit jedem ihrer Zeichen -
 *    ihre Einheit ist das, was die Zeile übt;
 *  - die BUCHSTABEN-Sprosse: ab ihr wird sie überhaupt serviert. Auf Weg „it"
 *    sind `? ! " : ; - ( )` weglassbar (Befund IT-T4 §2) - eine Frage kommt vor
 *    der Sprosse von „?" als Aussage. Jede Zeile trägt darum einen Buchstaben ab
 *    `g`: gekürzt kommt sie frühestens, wenn Punkt und Komma gelernt sind.
 * Jede Regel hat eine Gegenprobe - ein Wächter, der nie anschlägt, beweist nichts.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { CORPUS_IT_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusItWegFruehKids";
import { CORPUS_IT_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusItWegFruehTeens";
import { CORPUS_IT_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusItWegFruehErwachsene";
import { CORPUS_IT_WEG_MITTE_TEENS } from "../src/lib/typing/corpusItWegMitteTeens";
import { CORPUS_IT_WEG_MITTE_KIDS } from "../src/lib/typing/corpusItWegMitteKids";
import { CORPUS_IT_WEG_ENDE_KIDS } from "../src/lib/typing/corpusItWegEndeKids";
import { CORPUS_IT_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusItWegMitteErwachsene";
import { CORPUS_IT_WEG_ENDE_TEENS } from "../src/lib/typing/corpusItWegEndeTeens";
import { CORPUS_IT_WEG_ENDE_ERWACHSENE } from "../src/lib/typing/corpusItWegEndeErwachsene";
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
const ZEILEN = CORPUS_IT_WEG_ENDE_KIDS.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Die früheren Kinder-Chargen (Wortbudget gilt über alle drei - Falle 45). */
const T1 = CORPUS_IT_WEG_FRUEH_KIDS.map((i) => i.text);
const T4 = CORPUS_IT_WEG_MITTE_KIDS.map((i) => i.text);
/** Alle anderen it-Zeilen (Kopien, Paare, Ledger-Schlüssel, fast gleich - Falle 31, 51): T1-T6, T8, T9 (Merge 03.10.2026). */
const ANDERE_IT = CORPUS_IT.map((i) => i.text).filter((t) => !EIGENE.has(t));

/** Eckige Klammern gibt es nur auf `it`, geschweifte nur auf `it-qzerty` (F4: `onlyExistingKeys`). */
const NUR_AUF: Record<string, LayoutId> = { "[": "it", "]": "it", "{": "it-qzerty", "}": "it-qzerty" };
/** Gibt es die Zeile auf dieser Tastatur? (Nein, wenn sie eine Klammer trägt, die die Tastatur nicht hat.) */
const gibtEsAuf = (t: string, l: LayoutId): boolean => ![...t].some((ch) => NUR_AUF[ch] !== undefined && NUR_AUF[ch] !== l);

const ordnungCache = new Map<LayoutId, string[]>();
function ordnung(layout: LayoutId): string[] {
  let o = ordnungCache.get(layout);
  if (!o) {
    setLayout(layout);
    o = introOrder("it");
    ordnungCache.set(layout, o);
  }
  setLayout(layout);
  return o;
}
const allowedCache = new Map<string, Set<string>>();
function allowedAt(layout: LayoutId, n: number): Set<string> {
  const k = `${layout}:${n}`;
  let s = allowedCache.get(k);
  if (!s) {
    s = allowedFromIntroduced(ordnung(layout).slice(0, n), "it");
    allowedCache.set(k, s);
  }
  setLayout(layout);
  return s;
}
const norm = (t: string) => t.replace(/\s+/g, " ").trim();

/** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
function volleSprosse(text: string, layout: LayoutId): number | null {
  const o = ordnung(layout);
  for (let n = 1; n <= o.length; n++) if (fitText(text, allowedAt(layout, n), "it") === norm(text)) return n;
  return null;
}
/** Die Einheit dieser Sprosse („?" für eine Frage, „7" für eine Zeile mit 7 …). */
function volleEinheit(text: string, layout: LayoutId): string | null {
  const n = volleSprosse(text, layout);
  return n === null ? null : ordnung(layout)[n - 1];
}
/** Kleinste Sprosse, ab der die Zeile überhaupt serviert wird. */
function buchstabenSprosse(text: string, layout: LayoutId): number | null {
  const o = ordnung(layout);
  for (let n = 1; n <= o.length; n++) if (fitText(text, allowedAt(layout, n), "it") !== null) return n;
  return null;
}
const sprosseVon = (einheit: string, layout: LayoutId) => ordnung(layout).indexOf(einheit) + 1;

// ── Sprossen ────────────────────────────────────────────────────────────────

describe("IT-T7: jede Zeile an ihrer Sprosse (it und it-qzerty)", () => {
  it("nach „x\" kommen genau die Satzzeichen, Ziffern und Sonderzeichen - [ ] nur auf it, { } nur auf it-qzerty", () => {
    const it_ = ordnung("it");
    const q = ordnung("it-qzerty");
    expect(sprosseVon("x", "it")).toBe(36);
    expect(sprosseVon("x", "it-qzerty")).toBe(36);
    expect(it_.slice(36).join(" ")).toBe('? ! " : ; - ( ) 1 2 3 4 5 6 7 8 9 0 % & / + * = _ < > $ | € @ # [ ]');
    expect(q.slice(36).join(" ")).toBe('? ! " : ; - ( ) 1 2 3 4 5 6 7 8 9 0 % & / + * = _ < > $ | € @ # { }');
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile erscheint vollständig NACH „x\", nie vor „g\" überhaupt, minTier stimmt`, () => {
      const fehler: string[] = [];
      const g = sprosseVon("g", l);
      for (const item of CORPUS_IT_WEG_ENDE_KIDS) {
        const v = volleSprosse(item.text, l);
        const b = buchstabenSprosse(item.text, l);
        if (!gibtEsAuf(item.text, l)) {
          if (v !== null || b !== null) fehler.push(`"${item.text}": Klammer, die ${l} nicht hat - trotzdem serviert (${b}/${v})`);
          continue;
        }
        if (v === null || v <= sprosseVon("x", l)) fehler.push(`"${item.text}": volle Sprosse ${v}`);
        if (b === null || b < g) fehler.push(`"${item.text}": schon an Sprosse ${b} serviert (vor g = ${g})`);
        const tier = minTierFor(item.text, "it");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
      expect(fehler, fehler.slice(0, 12).join("\n")).toEqual([]);
    });
  }

  it("it und it-qzerty ergeben für jede Zeile ohne [ ] { } dieselbe Einheit", () => {
    const fehler = ZEILEN.filter((t) => !/[[\]{}]/.test(t) && volleEinheit(t, "it") !== volleEinheit(t, "it-qzerty"));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von IT-T7 (vom Code gezählt, Einheit der vollen Sprosse; „]" auf `it`, „}" auf `it-qzerty`) -
   * darf künftig nur STEIGEN, nie unter 6. „(", „[" und „{" haben keine eigenen Zeilen: sie stehen immer mit ihrem
   * Gegenstück, und die Zeile zählt bei „)", „]" und „}".
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "?": 41, "!": 38, '"': 20, ":": 20, ";": 12, "-": 17, ")": 13,
    "1": 12, "2": 12, "3": 12, "4": 12, "5": 12, "6": 12, "7": 12, "8": 12, "9": 14, "0": 16,
    "%": 7, "&": 7, "/": 7, "+": 7, "*": 7, "=": 7, "_": 7, "<": 7, ">": 7, "$": 7, "|": 7, "€": 9, "@": 8, "#": 8,
    "]": 9, "}": 9,
  };
  for (const l of TASTATUREN) {
    it(`${l}: je Einheit mindestens so viele Zeilen wie gemessen, jede vorhandene Einheit mindestens 6`, () => {
      const anzahl = new Map<string, number>();
      for (const t of ZEILEN) {
        const e = volleEinheit(t, l);
        if (e !== null) anzahl.set(e, (anzahl.get(e) ?? 0) + 1);
      }
      const zuWenig: string[] = [];
      for (const [e, min] of Object.entries(MINDESTENS_JE_EINHEIT)) {
        if (NUR_AUF[e] !== undefined && NUR_AUF[e] !== l) continue;
        if ((anzahl.get(e) ?? 0) < Math.max(6, min)) zuWenig.push(`„${e}": ${anzahl.get(e) ?? 0} < ${Math.max(6, min)}`);
      }
      for (const [e, n] of anzahl) if (n < 6) zuWenig.push(`„${e}": nur ${n}`);
      for (const e of ["(", "[", "{"]) expect(anzahl.has(e), e).toBe(false);
      expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    });

    it(`${l}: jede Zeile enthält die Einheit ihrer vollen Sprosse, jede Einheit ab „?" hat Zeilen (W6, Falle 37)`, () => {
      const o = ordnung(l);
      const ohne = ZEILEN.filter((t) => gibtEsAuf(t, l)).filter((t) => {
        const e = volleEinheit(t, l);
        return e === null || !t.includes(e);
      });
      expect(ohne, ohne.join("\n")).toEqual([]);
      const fehlt: string[] = [];
      for (let n = sprosseVon("x", l) + 1; n <= o.length; n++) {
        const e = o[n - 1];
        if (e === "(" || e === "[" || e === "{") continue; // feste Paare: die Zeile zählt beim Gegenstück
        if (!ZEILEN.some((t) => volleSprosse(t, l) === n && t.includes(e))) fehlt.push(`${n}:${e}`);
      }
      expect(fehlt, `${l}: Einheiten ohne Zeile`).toEqual([]);
    });
  }

  it("Gegenprobe: Sprossen und Einheiten werden richtig gerechnet", () => {
    expect(volleEinheit("Vieni al parco?", "it")).toBe("?");
    expect(buchstabenSprosse("Vieni al parco?", "it")!).toBeLessThan(sprosseVon("g", "it")); // ohne späten Buchstaben: zu früh
    expect(buchstabenSprosse("Vieni a giocare?", "it")).toBe(sprosseVon("g", "it"));
    expect(volleEinheit("Che bello, nevica!", "it-qzerty")).toBe("!");
    expect(volleEinheit("Il gatto (piccolo) dorme.", "it")).toBe(")");
    expect(volleEinheit("Ho 12 anni.", "it")).toBe("2");
    expect(volleEinheit("Ho 10 anni.", "it")).toBe("0");
    expect(volleEinheit("Costa 2 €.", "it-qzerty")).toBe("€");
    expect(volleEinheit("La lista = [pane, latte].", "it")).toBe("]");
    expect(volleSprosse("La lista = [pane, latte].", "it-qzerty")).toBeNull();
    expect(volleSprosse("Le vocali = {a, e}.", "it")).toBeNull();
    expect(volleEinheit("Le vocali = {a, e}.", "it-qzerty")).toBe("}");
  });
});

// ── Paare: ( ) [ ] { } und "" nie halb ───────────────────────────────────────

/** Verstösse gegen die Paar-Regel: jedes öffnende Zeichen vor seinem schliessenden, Anführungszeichen gerade Zahl. */
function paarFehler(t: string): string[] {
  const f: string[] = [];
  for (const [auf, zu] of [["(", ")"], ["[", "]"], ["{", "}"]] as const) {
    let offen = 0;
    for (const ch of t) {
      if (ch === auf) offen++;
      if (ch === zu) {
        if (offen === 0) f.push(`„${zu}" ohne „${auf}"`);
        else offen--;
      }
    }
    if (offen > 0) f.push(`„${auf}" ohne „${zu}"`);
  }
  if ((t.match(/"/g) ?? []).length % 2) f.push('„"" ungerade');
  return f;
}

describe("IT-T7: Klammern und Anführungszeichen nie halb", () => {
  it("jede Zeile schliesst, was sie öffnet", () => {
    const fehler = ZEILEN.flatMap((t) => paarFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: halbe Paare werden gefunden; fitText serviert eine Klammer nie halb", () => {
    expect(paarFehler("Il gatto (piccolo dorme.")).toHaveLength(1);
    expect(paarFehler('Dice "ciao.')).toHaveLength(1);
    expect(paarFehler("La lista [pane.")).toHaveLength(1);
    expect(paarFehler('"Ciao!" dice Ada (piano).')).toEqual([]);
    const nurAuf = new Set([...allowedAt("it", sprosseVon("(", "it") - 1), "("]);
    expect(fitText("Il gatto (piccolo) dorme.", nurAuf, "it")).toBeNull();
  });
});

// ── Form und Zahlen ─────────────────────────────────────────────────────────

const ERLAUBT = /^[A-Za-zàèéìòù0-9 .,;:?!"'()\-[\]{}%&/+*=_<>$|€@#]+$/;

/** Form-Verstösse einer Zeile (Zeichen, Satzanfang, Satzschluss, Leerzeichen). */
function formFehler(t: string): string[] {
  const f: string[] = [];
  if (!ERLAUBT.test(t)) f.push("Zeichen ausserhalb des Satzes");
  if (/ {2}/.test(t) || t !== t.trim()) f.push("Leerzeichen");
  if (!/^"?[A-Z0-9]/.test(t)) f.push("beginnt nicht gross (oder mit einer Zahl)");
  if (!/[.!?]"?$/.test(t)) f.push("kein Satzschluss am Ende");
  if (/(?<![[{]) [.,;:?!)\]}]/.test(t)) f.push("Leerzeichen vor Satzzeichen");
  if (/[([{] (?![\]}])/.test(t)) f.push("Leerzeichen nach öffnender Klammer");
  if (/[,;][^ ]/.test(t)) f.push("kein Leerzeichen nach , oder ;");
  if (/[ÀÈÉÌÒÙ]/.test(t)) f.push("grosser Akzentbuchstabe (unter Windows nicht tippbar, I4)");
  if (/[°ºª]/.test(t)) f.push("Ordnungszeichen (I9)");
  return f;
}

/**
 * Zahlformat (Bauplan I19, Glossar §1 Nr. 5; corpus.ts M8: Korpus-Zahlen werden nicht umgeschrieben):
 * Prozent ohne Leerzeichen (95%), Euro NACH der Zahl mit Leerzeichen (2 €), keine Dezimalzahlen, keine
 * Tausenderpunkte, höchstens vier Stellen nur als Jahreszahl, Uhrzeit 15:45.
 */
function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d %/.test(t)) f.push("Leerzeichen vor % (it: 95%)");
  if (/\d€|€ ?\d/.test(t)) f.push("€ nicht als „2 €\"");
  if (/\d[.,]\d/.test(t)) f.push("Dezimal- oder Tausenderzeichen");
  for (const m of t.matchAll(/\d{4,}/g)) if (!/^(19|20)\d\d$/.test(m[0])) f.push(`Zahl ${m[0]} (nur Jahreszahlen vierstellig)`);
  for (const m of t.matchAll(/\b(\d{1,2}):(\d+)/g)) if (m[2].length !== 2 || Number(m[1]) > 23 || Number(m[2]) > 59) f.push(`Uhrzeit ${m[0]}`);
  return f;
}

describe("IT-T7: Form und Zahlen", () => {
  it("Satzanfang gross, Satzschluss am Ende, Leerzeichen richtig, nur erlaubte Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlen im Landesbrauch: 95%, 2 €, 15:45, keine Dezimalen, keine Tausenderpunkte", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Zeile besteht die Regeln aller italienischen Zeilen (`helfer/itTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg it, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_IT_WEG_ENDE_KIDS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("it");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("Gegenprobe: jede Form- und Zahlregel schlägt an", () => {
    for (const t of ["oggi piove.", "Oggi piove", "Oggi piove .", "Oggi \u2013 piove.", "Uno,due e tre.", "Il gatto ( piccolo) dorme.", "Ormai È tardi.", "Il 1° maggio."]) {
      expect(formFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(formFehler('"Ciao!" dice Ada.')).toEqual([]);
    expect(formFehler("3 < 5.")).toEqual([]);
    expect(formFehler("Le graffe: { }.")).toEqual([]);
    for (const t of ["Il 50 % della torta.", "Costa 2€.", "Costa € 2.", "Pesa 1,5 chili.", "Siamo 1.200.", "Sono 12345 metri.", "Alle 8:5."]) {
      expect(zahlFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(zahlFehler("Alle 15:45, nel 2026, il 95% costa 2 €.")).toEqual([]);
  });
});

// ── Orte und Grosswörter ────────────────────────────────────────────────────

type Raum = "N" | "M" | "S" | "I" | "CH" | "BZ" | "RSM" | "REGION" | "AUSLAND";

/**
 * Orte, Landschaften, Gewässer mit ihrem Raum - als WORTGRUPPE (längste Gruppe gewinnt: „Reggio Calabria",
 * „Mazara del Vallo", „Monte Titano"). N Norden (ohne Südtirol), M Mitte, S Süden (mit Abruzzo und Molise, ISTAT),
 * I Inseln, CH Tessin/Schweiz, BZ Südtirol, RSM San Marino, REGION mehrere Räume, AUSLAND.
 */
const ORTE: Record<string, Raum> = {
  // Norden
  Venezia: "N", Bergamo: "N", "Bergamo Alta": "N", Ivrea: "N", Bormio: "N", Rimini: "N", Bologna: "N",
  "Emilia-Romagna": "N", Udine: "N", "Friuli-Venezia Giulia": "N", Gorizia: "N", Milano: "N", Domodossola: "N",
  Como: "N", Verona: "N", Cortina: "N", Trento: "N", Cervinia: "N", Carso: "N", Trieste: "N", "mar Ligure": "N",
  Genova: "N",
  // Mitte
  Urbino: "M", Pisa: "M", Viareggio: "M", Firenze: "M", Ancona: "M", Gubbio: "M", Roma: "M", Perugia: "M",
  Assisi: "M", Siena: "M", Pesaro: "M", Elba: "M",
  // Süden
  Alberobello: "S", Bari: "S", Napoli: "S", Vesuvio: "S", Tropea: "S", Ercolano: "S", Castellana: "S",
  Otranto: "S", Sud: "S", Lecce: "S", Gargano: "S", Puglia: "S", Matera: "S", Andria: "S", "Reggio Calabria": "S",
  Cosenza: "S", Positano: "S", Ostuni: "S", Sorrento: "S", Altamura: "S", Pescara: "S", Campobasso: "S",
  Brindisi: "S", Pompei: "S", Salerno: "S", Capri: "S", Amalfi: "S", Avellino: "S", Monopoli: "S", Foggia: "S",
  Caserta: "S",
  // Inseln
  Pantelleria: "I", Favignana: "I", Catania: "I", Sardegna: "I", Cagliari: "I", Sicilia: "I", Etna: "I",
  Stromboli: "I", Vulcano: "I", Eolie: "I", Lipari: "I", Salina: "I", Panarea: "I", Filicudi: "I", Alicudi: "I",
  Palermo: "I", Siracusa: "I", Olbia: "I", Trapani: "I", Agrigento: "I", Taormina: "I", Sassari: "I",
  "Mazara del Vallo": "I", Messina: "I", Cefalù: "I", Nuoro: "I", Noto: "I", Modica: "I",
  // Tessin und Schweiz
  Bellinzona: "CH", Lugano: "CH", "Valle Verzasca": "CH", Tesserete: "CH", "Monte Generoso": "CH", Mendrisio: "CH",
  Svizzera: "CH", Chiasso: "CH", Locarno: "CH", Centovalli: "CH", Ascona: "CH", Ticino: "CH", Biasca: "CH",
  Brissago: "CH", Zurigo: "CH",
  // Südtirol
  Corvara: "BZ", Merano: "BZ", Bressanone: "BZ", Brunico: "BZ", "Val Gardena": "BZ", "Val Badia": "BZ",
  Vipiteno: "BZ", "Trentino-Alto Adige": "BZ", "Alto Adige": "BZ", Silandro: "BZ", Ortisei: "BZ", Bolzano: "BZ",
  // So kommen die Regionsnamen vor „-" (Sprosse 42) an: der Bindestrich wird zum Leerzeichen (amtlich ist
  // „Friuli Venezia Giulia" ohnehin auch ohne Bindestrich üblich).
  "Emilia Romagna": "N", "Friuli Venezia Giulia": "N", "Trentino Alto Adige": "BZ",
  // San Marino
  "San Marino": "RSM", "Monte Titano": "RSM",
  // über mehrere Räume, Ausland
  Italia: "REGION", Alpi: "REGION", "Stati Uniti": "AUSLAND", "New York": "AUSLAND", Grecia: "AUSLAND",
};

/** Menschen, Tiere mit Namen, Masken, ein Buch, ein Sportfest, eine Taste. */
const NAMEN = new Set(
  (
    "Ada Agnese Arlecchino Aurora Batuffolo Bea Bianca Biscotto Bruno Ciro Colombina Concetta Davide Diego Elia " +
    "Eleonora Gabriele Gina Giulia Greta Ilaria Kevin Leo Lia Lorenzo Luca Matilde Nina Nuvola Pallino Pantalone " +
    "Pietro Pina Pinocchio Rocco Rosa Rosalia Teo Zeno Paralimpiadi Maiusc"
  ).split(" "),
);
/** Feste - grossgeschrieben, aber kein Ort. „San"/„Santa" nur vor dem Namen des Festes. */
const FESTE = new Set(
  ["Natale", "Befana", "Carnevale", "Ferragosto", "Pasqua", "Halloween", "Ceri", "Candelieri", "Rabadan",
    "Santa Lucia", "San Martino", "San Nicolò", "San Lorenzo"],
);

/** Wörter einer Zeile mit Merker „Satzanfang" (Zeilenanfang, nach . ? !, Anfang einer Anführung). */
function woerterMitAnfang(zeile: string): { w: string; anfang: boolean }[] {
  const out: { w: string; anfang: boolean }[] = [];
  let naechsterAnfang = true;
  for (const roh of zeile.split(/\s+/)) {
    const oeffnet = roh.startsWith('"');
    roh.split(/'/).forEach((teil, i) => {
      const w = teil.replace(/^[^\p{L}\d]+|[^\p{L}\d-]+$/gu, "");
      if (w) out.push({ w, anfang: (i === 0 && (naechsterAnfang || oeffnet)) || (i === 1 && out.length === 1 && naechsterAnfang) });
    });
    naechsterAnfang = /[.!?]"?$/.test(roh);
  }
  return out;
}

/** Räume einer Zeile (längste Wortgruppe zuerst) und die Wortstellen, die Orte, Namen oder Feste bedecken. */
function orteIn(zeile: string): { raeume: Raum[]; orte: string[]; bedeckt: Set<number> } {
  const w = woerterMitAnfang(zeile).map((x) => x.w);
  const raeume: Raum[] = [];
  const orte: string[] = [];
  const bedeckt = new Set<number>();
  for (let i = 0; i < w.length; i++) {
    let treffer = false;
    for (const len of [4, 3, 2, 1]) {
      if (i + len > w.length) continue;
      const g = w.slice(i, i + len).join(" ");
      // Ein Bindestrich-Wort, das kein Ort ist („Napoli-Palermo"): seine Teile zählen einzeln.
      const teile = len === 1 && !(g in ORTE) && g.includes("-") ? g.split("-") : [g];
      const gefunden = teile.filter((x) => x in ORTE || NAMEN.has(x) || FESTE.has(x));
      if (gefunden.length > 0 && gefunden.length === teile.length) {
        for (const x of gefunden) if (x in ORTE) { raeume.push(ORTE[x]); orte.push(x); }
        for (let k = i; k < i + len; k++) bedeckt.add(k);
        i += len - 1;
        treffer = true;
        break;
      }
    }
    if (!treffer) continue;
  }
  return { raeume, orte, bedeckt };
}

/** Grossgeschriebene Wörter, die weder Satzanfang noch Ort, Name oder Fest sind. */
function unbekannteGrosswoerter(zeile: string): string[] {
  const { bedeckt } = orteIn(zeile);
  return woerterMitAnfang(zeile)
    .filter((x, i) => !x.anfang && /^\p{Lu}/u.test(x.w) && !bedeckt.has(i))
    .map((x) => x.w);
}

function verteilung(zeilen: string[]): Record<Raum | "verortet", number> {
  const v: Record<Raum | "verortet", number> = { verortet: 0, N: 0, M: 0, S: 0, I: 0, CH: 0, BZ: 0, RSM: 0, REGION: 0, AUSLAND: 0 };
  for (const z of zeilen) {
    const r = new Set(orteIn(z).raeume.filter((x) => x !== "REGION"));
    if (r.size === 0) continue;
    v.verortet++;
    for (const x of r) v[x]++;
  }
  return v;
}

describe("IT-T7: Orte aus allen Räumen, in denen Italienisch gesprochen wird", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein bekannter Ort, Name oder ein Fest", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("verortet sind mindestens 145 Zeilen; der Norden (ohne Südtirol) trägt höchstens 25 %, Süden + Inseln mindestens 40 %", () => {
    const v = verteilung(ZEILEN);
    expect(v.verortet).toBeGreaterThanOrEqual(145); // gemessen 150 von 407
    expect(v.N * 4, `Norden ${v.N} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet);
    expect((v.S + v.I) * 10, `Süden + Inseln ${v.S + v.I} von ${v.verortet}`).toBeGreaterThanOrEqual(v.verortet * 4);
  });

  it("Tessin mindestens 15 %, Südtirol mindestens 10 %, Mitte mindestens 6 %, San Marino in mindestens 3 Zeilen", () => {
    const v = verteilung(ZEILEN);
    expect(v.CH * 100, `Tessin ${v.CH} von ${v.verortet}`).toBeGreaterThanOrEqual(v.verortet * 15);
    expect(v.BZ * 10, `Südtirol ${v.BZ} von ${v.verortet}`).toBeGreaterThanOrEqual(v.verortet);
    expect(v.M * 100, `Mitte ${v.M} von ${v.verortet}`).toBeGreaterThanOrEqual(v.verortet * 6);
    expect(v.RSM).toBeGreaterThanOrEqual(3);
  });

  it("kein einzelner Ort steht in mehr als 6 Zeilen (die Orte sind verteilt, nicht gehäuft)", () => {
    const n = new Map<string, number>();
    for (const z of ZEILEN) for (const o of new Set(orteIn(z).orte)) if (ORTE[o] !== "REGION") n.set(o, (n.get(o) ?? 0) + 1);
    expect([...n].filter(([, k]) => k > 6).map(([w, k]) => `${w}: ${k}`)).toEqual([]);
  });

  /**
   * Euro nur, wo man mit Euro zahlt (Bauplan I19: eine Zeile ohne Ort trägt keine Währung). Im Tessin zahlt man
   * mit Franken - eine €-Zeile nennt darum immer einen Ort in Italien oder San Marino.
   */
  it("€ steht nur in Zeilen mit einem Ort in Italien oder San Marino", () => {
    const euro = ZEILEN.filter((z) => z.includes("€"));
    expect(euro.length).toBeGreaterThan(0);
    const inEuroland = (z: string) => orteIn(z).raeume.some((r) => ["N", "M", "S", "I", "BZ", "RSM"].includes(r));
    expect(euro.filter((z) => !inEuroland(z))).toEqual([]);
  });

  it("Gegenprobe: unbekannte Grosswörter, Wortgruppen, Bindestrich, Anführung und Satzanfänge werden richtig gelesen", () => {
    expect(unbekannteGrosswoerter("Anna vive ad Atlantide.")).toEqual(["Atlantide"]);
    expect(unbekannteGrosswoerter("Il traghetto Napoli-Palermo parte.")).toEqual([]);
    expect(unbekannteGrosswoerter("Il traghetto Napoli-Atlantide parte.")).toEqual(["Napoli-Atlantide"]);
    expect(unbekannteGrosswoerter('"Che fame!" dice Pietro.')).toEqual([]);
    expect(unbekannteGrosswoerter("Piove? Domani no.")).toEqual([]);
    expect(unbekannteGrosswoerter("Piove e Domani no.")).toEqual(["Domani"]);
    expect(orteIn("Ho 3 cugini a Reggio Calabria.").raeume).toEqual(["S"]);
    expect(orteIn("Bressanone è in Trentino-Alto Adige.").raeume).toEqual(["BZ", "BZ"]);
    const v = verteilung(["A Milano.", "A Torino non c'è.", "A Como.", "A Bari."]);
    expect(v.N * 4 > v.verortet).toBe(true);
    expect(["A Lugano costa 2 €."].filter((z) => !orteIn(z).raeume.some((r) => r !== "CH"))).toHaveLength(1);
  });
});

// ── Frühe Fassungen: vor „? ! :" kein Grossbuchstabe mitten in der Zeile ────

/**
 * Für Weg „it" gibt es KEINE frühen Fassungen (`scripts/_fruehfassung.mts` kennt den it-Korpus nicht). Wird eine
 * Zeile vor ihrer vollen Sprosse gekürzt serviert, fällt mit „?", „!" oder dem Anführungszeichen auch die
 * Satzgrenze weg - ein Wort, das danach gross steht, stünde dann mitten im Satz. Darum steht dort nur ein Name,
 * ein Ort oder ein Fest (wie „Pinocchio" in „legge Pinocchio ad alta voce").
 */
function fruehNahtFehler(zeile: string, l: LayoutId): string[] {
  const b = buchstabenSprosse(zeile, l);
  const v = volleSprosse(zeile, l);
  if (b === null || v === null) return [];
  const out = new Set<string>();
  for (let n = b; n < v; n++) {
    const s = fitText(zeile, allowedAt(l, n), "it");
    if (s !== null) for (const w of unbekannteGrosswoerter(s)) out.add(`${n}:${w}`);
  }
  return [...out];
}

describe("IT-T7: gekürzt serviert - kein Grossbuchstabe mitten im Satz", () => {
  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile, die vor ihrer Sprosse gekürzt kommt, liest sich ohne Grosswort mitten im Satz`, () => {
      const fehler = ZEILEN.flatMap((z) => fruehNahtFehler(z, l).map((f) => `"${z}" @ ${f}`));
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  it("Gegenprobe: „Dove vai? Domani a Bari.\" würde vor „?\" zu „Dove vai Domani a Bari\"", () => {
    expect(fruehNahtFehler("Dove vai? Domani a Bari.", "it").length).toBeGreaterThan(0);
    expect(fruehNahtFehler("Chi viene? Ilaria e Zeno.", "it")).toEqual([]);
    // Und so sieht die gekürzte Frage aus: ohne „?" (weglassbar auf Weg „it").
    expect(fitText("Vieni a giocare a nascondino con noi?", allowedAt("it", sprosseVon("x", "it")), "it")).toBe(
      "Vieni a giocare a nascondino con noi",
    );
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Lexikon, Akzent, è gegen e ────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. Dazu die Fragewörter (wie es-T7). */
const FUNKTIONSWOERTER = new Set(
  (
    "il lo la i le l un uno una di d a ad da in con su per tra fra " +
    "del dello della dei delle dell al allo alla ai alle all dal dallo dalla dai dalle dall " +
    "nel nello nella nei nelle nell sul sullo sulla sui sulle sull gli agli degli negli sugli dagli " +
    "e ed o ma se non si mi ti ci c vi ne io tu lui lei noi voi loro mio mia miei mie tuo tua suo sua " +
    "sono sei siamo siete era erano è ho hai ha hanno fa fai sta sto stai che chi " +
    "tutto tutta tutti tutte anche perché più così già qui là lì sì né " +
    "come dove quando quanto quanta quanti quante cosa quale quali ecco ogni"
  ).split(" "),
);

/** Inhaltswörter einer Zeile für die Zählung: klein, nur Buchstabenfolgen (Elision getrennt, Ziffern weg). */
const inhaltswoerter = (z: string): Set<string> =>
  new Set((z.toLowerCase().match(/\p{L}+/gu) ?? []).filter((w) => !FUNKTIONSWOERTER.has(w)));

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltswoerter(z)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Technische Wörter (Adressen, Dateinamen, Rechnungen) werden nicht als Wörter geprüft - die Stimme liest Zeichen. */
const TECHNISCH = /[@_/#=<>|*+&$%€\d]/;
/** Die Wörter einer Zeile für Sperrliste, Wörterbuch und Stimme (ohne technische Wörter; Elision bleibt am Wort). */
const pruefWoerter = (zeile: string): string[] =>
  zeile
    .split(/\s+/)
    .filter((t) => !TECHNISCH.test(t))
    .flatMap((t) => t.split(/[^\p{L}']+/u))
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter(Boolean);
/** Der Inhaltsteil eines Wortes: bei Elision nur das Wort hinter dem Apostroph (`dell'Alto` ⇒ `alto`). */
const inhaltsTeile = (zeile: string): string[] =>
  pruefWoerter(zeile)
    .map((w) => w.split("'").pop()!.toLowerCase())
    .filter((w) => w.length >= 2);

/**
 * Wörter dieser Charge, die NICHT in `WORDS_IT`, `STUFE_VOCAB_IT` oder `NACHTRAG_IT` standen und die das
 * macOS-Wörterbuch für Italienisch bestätigt hat (`osascript -l JavaScript scripts/woerterbuch-macos.js`, Vorsilbe
 * `it:`, gemessen 03.10.2026; Namen und Orte wie im Text gross geprüft). Über den Korpus kommen sie ins
 * Vorlese-Lexikon (lexicon.ts: Korpus-Wörter), die Stimme spricht sie ganz.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set(
  (
    "accarezzare ada adige agnese agrigento allenatrice altamura alveare amalfi ancona andria appendiamo " +
    "arlecchino arrampica asterisco aurora avellino badia bari barra bea bellinzona bentornato bergamo " +
    "bibliotecaria bologna bolzano bormio borraccia bressanone brillano brunico bulloni cagliari calabria " +
    "calcolatrice campobasso candelieri canestri cannolo cantoni capri carso caserta cassata castellana catania " +
    "cefalù cervinia chiocciola cimosa cinquina ciro colombina como consonante cortina corvara cosenza cuculo " +
    "dado davide diego dispari dollaro domodossola dozzina duo elba eleonora elia emilia eolie ercolano esclama " +
    "etna favignana filicudi fioriscono firenze foggia fornaia fratellino friuli funicolare gabriele gardena " +
    "gargano gelataio gelsi genova gina giornalino giraffe giulia gorizia graffe grammi grecia greta gubbio " +
    "halloween ilaria impasta impostazioni incrociano italia ivrea kevin ladino lanciano lecce leo lia lipari " +
    "locarno lorenzo lucia lugano martino matera matilde mazara merano mercatino messina miagola modica monopoli " +
    "muretto napoli nascondino nicolò nina nuoro nuraghe olbia orecchiette orsetto ortisei ostuni otranto palermo " +
    "pallino panarea pandoro pantelleria pastelli pastiera pastori pecorelle pedala pedalò perugia pesaro pescara " +
    "pesciolini piantine pietro pina pinocchio pisa polpo pompei portone positano premo premuto puglia pulmino " +
    "quadrifoglio reggia reggio riempi rimini rocco roma romagna romancio rosalia salerno salvadanaio sardegna " +
    "sassari scaricando schiacciata sciatori sfilano sfogliatelle sicilia siena siracusa sorrento speck sperone " +
    "spugnetta statuine stromboli sussurra tabellina taormina tentacoli teo ticino titano traghetto trapani " +
    "trento trieste tris tropea trulli udine urbino vecchietta venezia verona vesuvio viareggio vipiteno york " +
    "zeno zeppole zerbino zurigo"
  ).split(" "),
);

/**
 * Wörter, die das macOS-Wörterbuch NICHT kennt (gemessen 03.10.2026: „nein") - richtig geschrieben und belegt:
 *  · Gemeinden und Täler im Tessin: Ascona, Biasca, Mendrisio (wie IT-T4), Brissago (Bezirk Locarno), Centovalli
 *    (Tal und Gemeinde; Bahn Locarno-Domodossola), Verzasca (Valle Verzasca, Gemeinde seit 2020);
 *  · Silandro (Gemeinde im Vinschgau, deutsch Schlanders - auch IT-T5); Alberobello (Gemeinde bei Bari, die Trulli
 *    sind UNESCO-Welterbe); Alicudi (eine der sieben Äolischen Inseln);
 *  · Rabadan (der Carnevale von Bellinzona) [G];
 *  · paralimpiadi (Treccani; Milano Cortina 2026, `recherche-italienisch-2026-10-02/texte-quellen.md` §2);
 *  · cancelletto (Treccani: auch das Zeichen #; Glossar-Zeichennamen `SPOKEN_IT`); Maiusc (die Umschalttaste unter
 *    Windows, Glossar I15).
 * Die Liste wächst nur mit Begründung.
 */
const EIGENNAMEN_OHNE_WOERTERBUCH: ReadonlySet<string> = new Set([
  "alberobello", "alicudi", "ascona", "biasca", "brissago", "cancelletto", "centovalli", "maiusc",
  "mendrisio", "paralimpiadi", "rabadan", "silandro", "verzasca",
]);

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat(), ...NACHTRAG_IT].map((w) => normalizeWord(w, "it")),
);

/** Wörter (ab zwei Buchstaben), die weder vorher im Wortschatz standen noch bestätigt sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of inhaltsTeile(z)) {
      if (!VORHER_BEKANNT.has(w) && !VOM_WOERTERBUCH_BESTAETIGT.has(w) && !EIGENNAMEN_OHNE_WOERTERBUCH.has(w)) out.add(w);
    }
  }
  return [...out];
}

/** Wörter, die es NUR mit Akzent gibt (Bauplan I6): ihre Form ohne Akzent darf nie stehen (`citta`, `perche`). */
const NUR_MIT_AKZENT: ReadonlySet<string> = new Set(
  [...VORHER_BEKANNT, ...VOM_WOERTERBUCH_BESTAETIGT]
    .filter((w) => /[àèéìòù]$/.test(w))
    .map((w) => w.normalize("NFD").replace(/[̀-ͯ]/g, ""))
    .filter((ohne) => !VORHER_BEKANNT.has(ohne)),
);
/** Namen und Orte sind ausgenommen („Rosa", „Como"). */
const ohneAkzentFehler = (zeile: string): string[] =>
  pruefWoerter(zeile)
    .flatMap((w) => w.split("'"))
    .filter((w) => !NAMEN.has(w) && !(w in ORTE))
    .map((w) => w.toLowerCase())
    .filter((w) => NUR_MIT_AKZENT.has(w));

/**
 * ★ „e" gegen „è": ein vergessener Akzent ergibt das Wort „e" (und), und die Zeile bleibt scheinbar richtig.
 * JEDE Zeile mit „e" ist gelesen und hier eingetragen (in allen ist „e" = und, oder der Buchstabe e) - eine neue
 * Zeile mit „e" muss eingetragen werden; dazu ist „e" vor einem typischen Prädikatswort verdächtig.
 */
const ZEILEN_MIT_E_GELESEN: ReadonlySet<string> = new Set([
  "Nello zaino ho tutto: quaderni, astuccio e diario.",
  "Le stagioni sono quattro: primavera, estate, autunno e inverno.",
  "I colori della bandiera italiana sono tre: verde, bianco e rosso.",
  "A Merano i cartelli sono scritti in due lingue: tedesco e italiano.",
  "In Svizzera si parlano quattro lingue: tedesco, francese, italiano e romancio.",
  "Per la pizza margherita servono tre cose: pomodoro, mozzarella e basilico.",
  "Il menù della mensa: pasta al pomodoro, zucchine e frutta fresca.",
  "In Sicilia ci sono vulcani attivi: Etna, Stromboli e Vulcano.",
  "Le isole Eolie sono sette: Lipari, Salina, Vulcano, Stromboli, Panarea, Filicudi e Alicudi.",
  "Le doppie cambiano il significato: \"pala\" e \"palla\", \"caro\" e \"carro\".",
  "A Carnevale a Venezia vediamo tante maschere: Arlecchino, Colombina e Pantalone.",
  "Le fermate prima di Lugano: Como, Chiasso e Mendrisio.",
  "Gli animali delle Alpi: marmotta, camoscio, stambecco e aquila.",
  "In Val Badia i bambini imparano tre lingue: ladino, tedesco e italiano.",
  "A Napoli, a dicembre, compriamo le statuine del presepe: pastori e pecore.",
  "La ricetta di zia Concetta: farina, uova, zucchero e tanta pazienza.",
  "Il nostro criceto - piccolo e curioso - ha un nome buffo: Biscotto.",
  "Il mio zaino - rosso e blu - è nuovo di zecca.",
  "Il pandoro (un dolce di Verona) è morbido e soffice come una nuvola.",
  "Ho 2 conigli: Batuffolo e Nuvola.",
  "Gennaio, marzo e maggio hanno 31 giorni.",
  "Il quadrifoglio ha 4 foglie e porta fortuna.",
  "Ho 6 anni e vado in prima.",
  "Alle 7 e mezza facciamo colazione.",
  "In 7 giorni abbiamo visto Perugia, Assisi e Gubbio.",
  "Ho 9 anni e faccio la quarta.",
  "La e commerciale si scrive così: &.",
  "\"Più\" e \"meno\" si scrivono + e -.",
  "Sulla calcolatrice premo 7 + 2 e leggo 9.",
  "Riempi lo spazio: il _ abbaia e il gatto miagola.",
  "Scrivi < tra 4 e 9.",
  "Scrivi > o < tra 8 e 3.",
  "Sul quaderno: 20 > 12 e 12 < 20.",
  "Per scrivere $ tengo premuto Maiusc e premo 4.",
  "Sul quaderno disegno una chiocciola vera e una @.",
  "Le vocali sono {a, e, i, o, u}.",
]);
const woerterKlein = (z: string): string[] => (z.toLowerCase().match(/[\p{L}\d]+/gu) ?? []);
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

describe("IT-T7: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch über alle drei Kinder-Chargen (IT-T1 + IT-T4 + IT-T7) zusammen nicht (Falle 45)", () => {
    const fehler = zuHaeufig([...T1, ...T4, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (gross, mit Satzzeichen, nach Ziffer), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Luna?" : `La luna (${i})`} ${"abcdefghi"[i]}!`);
    expect(zuHaeufig(neun)).toEqual(['"luna": 9 Zeilen']);
    expect(zuHaeufig(Array.from({ length: 9 }, () => "Dove? Quando? Perché?"))).toEqual([]);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis (auch nicht hinter einer Elision)", () => {
    const fehler = ZEILEN.flatMap((t) => pruefWoerter(t).filter((w) => gesperrtIt(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: mona, passera (Kern), Madonna, banane (Wortbasis) und dell'uccello werden gefunden, palla nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(istKernGesperrtIt("passera")).toBe(true);
    expect(pruefWoerter("A Matera si festeggia la Madonna!").some((w) => gesperrtIt(w))).toBe(true);
    expect(gesperrtIt("banane")).toBe(true);
    expect(pruefWoerter("Il nido dell'uccello?").some((w) => gesperrtIt(w))).toBe(true);
    expect(gesperrtIt("palla")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder ist vom Wörterbuch bestätigt (ohne Wörterbuch: Liste mit Beleg)", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap(inhaltsTeile));
    expect([...VOM_WOERTERBUCH_BESTAETIGT].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
    expect([...EIGENNAMEN_OHNE_WOERTERBUCH].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und ein erfundener Ort werden gemeldet - eine Mail-Adresse nicht", () => {
    expect(ungeprueft(["La pizzx?", "A Atlantide!", "Mi scrive a luca@famiglia.example."])).toEqual(["pizzx", "atlantide"]);
  });

  /**
   * Die Stimme nimmt ein Wort so, wie es zwischen zwei Leerzeichen steht (voice.ts: `wordAt`, öffnende und
   * schliessende Zeichen weg) - „Emilia-Romagna" ist dort EIN Wort, wie im Lexikon (lexicon.ts: Korpus-Wörter).
   */
  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) =>
      z
        .split(/\s+/)
        .filter((t) => !TECHNISCH.test(t))
        .some((t) => normalizeWord(t, "it").length >= 2 && !isRealWord(t.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ""), "it")),
    );
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da (citta, perche, piu)", () => {
    const fehler = ZEILEN.flatMap((z) => ohneAkzentFehler(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „La citta è piu bella perche ...?“ wird dreimal gemeldet, „La città“ und der Name „Rosa“ nicht", () => {
    expect(ohneAkzentFehler("La citta è piu bella perche piove?")).toEqual(["citta", "piu", "perche"]);
    expect(ohneAkzentFehler("La città è più bella!")).toEqual([]);
    expect(ohneAkzentFehler("Il gattino di Rosa ha 9 mesi.")).toEqual([]);
  });

  it("jede Zeile mit „e“ ist gelesen (e = und, nie das vergessene è) - und keine steht vor einem verdächtigen Wort", () => {
    const mitE = ZEILEN.filter((z) => woerterKlein(z).includes("e"));
    expect(mitE.filter((z) => !ZEILEN_MIT_E_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_E_GELESEN].filter((z) => !mitE.includes(z))).toEqual([]);
    expect(ZEILEN.filter(eVerdaechtig)).toEqual([]);
  });

  it("Gegenprobe: „Il tè e caldo!“, „Anna e di Palermo?“ sind verdächtig, „Ho 2 conigli: Batuffolo e Nuvola.“ nicht", () => {
    expect(eVerdaechtig("Il tè e caldo!")).toBe(true);
    expect(eVerdaechtig("Anna e di Palermo?")).toBe(true);
    expect(eVerdaechtig("Ho 2 conigli: Batuffolo e Nuvola.")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare ───────────────────────────────────────────────

/** Geschlecht und Zahl gleichgesetzt, Satzzeichen weg: „Il nonno ride?" und „La nonna ride!" sind ein Paar. */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", gli: "ART", le: "ART", l: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  return zeile
    .toLowerCase()
    .split(/[\s,.;:!?"()[\]{}']+/)
    .filter(Boolean)
    .map((w) => art[w] ?? pron[w] ?? w.replace(/[oaei]$/, "_"))
    .join(" ");
}
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
/** Ein Text ohne Satzzeichen und Grossschreibung - so kollidiert „Vieni al parco?" mit „vieni al parco". */
const textForm = (t: string): string => t.toLowerCase().replace(/[,.;:!?"()\-[\]{}]/g, " ").replace(/\s+/g, " ").trim();

/** Wörter und Zahlen einer Zeile; „fast gleich" ab einer Jaccard-Überdeckung von 0,6 (dieselbe Regel wie IT-T8). */
const menge = (t: string) => new Set([...(t.toLowerCase().match(/\p{L}+/gu) ?? []), ...(t.match(/\d+/g) ?? [])]);
function fastGleich(a: Set<string>, b: Set<string>): boolean {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s) >= 0.6;
}

describe("IT-T7: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("keine Zeile doppelt - auch nicht ohne Satzzeichen oder nach dem Ledger-Schlüssel (Zeichen werden dort Trenner)", () => {
    expect(new Set(ZEILEN.map(textForm)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es oder einer anderen it-Charge (Text, ohne Satzzeichen, Ledger-Schlüssel)", () => {
    const fremd = [...CORPUS_IT.filter((i) => !EIGENE.has(i.text)), ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES];
    expect(fremd.length).toBeGreaterThan(ANDERE_IT.length);
    const texte = new Set(fremd.map((i) => textForm(i.text)));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_IT_WEG_ENDE_KIDS.filter((i) => texte.has(textForm(i.text)) || schluessel.has(bausteinKey(i.kind, i.text))).map(
      (i) => i.text,
    );
    expect(fehler).toEqual([]);
  });

  it("keine Paare (nur Geschlecht oder Zahl getauscht) - weder untereinander noch mit einer anderen it-Charge (Falle 31)", () => {
    const acht = [
      CORPUS_IT_WEG_FRUEH_KIDS, CORPUS_IT_WEG_FRUEH_TEENS, CORPUS_IT_WEG_FRUEH_ERWACHSENE, CORPUS_IT_WEG_MITTE_TEENS,
      CORPUS_IT_WEG_MITTE_KIDS, CORPUS_IT_WEG_MITTE_ERWACHSENE, CORPUS_IT_WEG_ENDE_TEENS, CORPUS_IT_WEG_ENDE_ERWACHSENE,
    ];
    expect(ANDERE_IT).toEqual(expect.arrayContaining(acht.flat().map((i) => i.text)));
    const fehler = paare(ZEILEN, ANDERE_IT);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * ★ Merge 03.10.2026 (Falle 51): „fast gleich" - dieselbe Wortmenge (Wörter und Zahlen, Jaccard ≥ 0,6), wie im
   * Wächter von IT-T8. Beim Merge fand er u. a. *Il 15 maggio a Gubbio c'è la corsa dei Ceri.* (T9) und *Il volo
   * Cagliari-Milano dura poco più di un'ora.* (T8) - ersetzt an derselben Sprosse (Befund §10).
   */
  it("nichts fast gleich - weder untereinander noch mit einer Zeile von T1-T6, T8, T9", () => {
    const eigene = ZEILEN.map((t) => [t, menge(t)] as const);
    const andere = ANDERE_IT.map((t) => [t, menge(t)] as const);
    const fehler: string[] = [];
    for (let i = 0; i < eigene.length; i++) {
      for (const [t, m] of andere) if (fastGleich(eigene[i][1], m)) fehler.push(`"${eigene[i][0]}" ~ "${t}"`);
      for (let j = i + 1; j < eigene.length; j++) if (fastGleich(eigene[i][1], eigene[j][1])) fehler.push(`"${eigene[i][0]}" ~ "${eigene[j][0]}"`);
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie mit anderen Satzzeichen, Paare und Ledger-Schlüssel werden erkannt", () => {
    expect(fastGleich(menge("Il 15 maggio a Gubbio c'è la corsa dei Ceri."), menge("Il 15 maggio a Gubbio si corre la Corsa dei Ceri."))).toBe(true);
    expect(fastGleich(menge("Un anno ha 12 mesi."), menge("Un giorno ha 24 ore."))).toBe(false);
    const t4 = T4[3];
    const alsFrage = `${t4.replace(/\.$/, "")}?`;
    expect(textForm(alsFrage)).toBe(textForm(t4));
    expect(paare([alsFrage], ANDERE_IT)).toHaveLength(1);
    expect(paare(["Il nonno ride?", "La nonna ride!"])).toHaveLength(1);
    expect(paare(["La pala.", "La palla."])).toEqual([]);
    expect(bausteinKey("satz", "3 + 4 = 7.")).toBe(bausteinKey("satz", "3 * 4 = 7.")); // darum prüft der Test die Schlüssel
    expect(paare(["Ho 7 anni.", "Ho 8 anni."])).toEqual([]);
  });
});

// ── Der lange Satz ─────────────────────────────────────────────────────────

describe("IT-T7: lange Zeilen für „La frase lunga\" (60-70 Zeichen)", () => {
  it("mindestens 30 Zeilen mit 60-70 Zeichen, jede am Ende des Lernwegs vollständig tippbar", () => {
    const lang = ZEILEN.filter((t) => t.length >= 60 && t.length <= 70);
    expect(lang.length).toBeGreaterThanOrEqual(30); // gemessen 35
    const fehler = lang.filter((t) => !TASTATUREN.some((l) => gibtEsAuf(t, l) && fitText(t, allowedAt(l, ordnung(l).length), "it") === t));
    expect(fehler).toEqual([]);
  });
});

// ── Korpus-Anker und Auslieferung ──────────────────────────────────────────

describe("IT-T7: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_IT trägt diese Charge als geschlossenen Block hinter IT-T4 (seit dem Merge 03.10.2026 hinter T8; Anker nur anhängend)", () => {
    const it_ = CORPUS_IT.map((i) => i.text);
    const start = it_.indexOf(ZEILEN[0]);
    expect(it_.slice(start, start + ZEILEN.length)).toEqual(ZEILEN);
    const letzteT4 = Math.max(...T4.map((t) => it_.indexOf(t)));
    expect(start).toBeGreaterThan(letzteT4);
    // Dahinter kommen nur noch Chargen, die nach dieser gemergt werden (T6, T8, T9) - keine Zeile einer früheren.
    const frueher = new Set(ANDERE_IT.slice(0, start));
    expect(it_.slice(start + ZEILEN.length).filter((t) => frueher.has(t))).toEqual([]);
  });

  it("korpusFuer(\"it\") trägt jede Zeile dieser Charge (nichts still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("it").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_IT_WEG_ENDE_KIDS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe it t7?", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: am Ende des Lernwegs bekommen Kinder jede Zeile vollständig, die es auf ${l} gibt - Jugend und Erwachsene keine`, () => {
      const alles = allowedAt(l, ordnung(l).length);
      const geliefert = new Set(corpusItemsFor({ stufe: "kids", allowed: alles, lang: "it", lernweg: "it" }));
      const soll = ZEILEN.filter((t) => gibtEsAuf(t, l));
      expect(soll.length).toBeLessThan(ZEILEN.length);
      expect(soll.filter((t) => !geliefert.has(t))).toEqual([]);
      expect([...geliefert].filter((g) => [...g].some((ch) => NUR_AUF[ch] !== undefined && NUR_AUF[ch] !== l))).toEqual([]);
      for (const stufe of ["teens", "erwachsen"] as const) {
        const andere = new Set(corpusItemsFor({ stufe, allowed: alles, lang: "it", lernweg: "it" }));
        expect(ZEILEN.filter((t) => andere.has(t)), stufe).toEqual([]);
      }
    });

    it(`${l}: vor „g\" kommt keine dieser Zeilen; an „x\" kommen sie nur gekürzt (ohne ? ! " : ; - ( ), ohne Ziffern und Zeichen)`, () => {
      const vorG = allowedAt(l, sprosseVon("g", l) - 1);
      expect(ZEILEN.filter((t) => fitText(t, vorG, "it") !== null)).toEqual([]);
      const anX = allowedAt(l, sprosseVon("x", l));
      const geliefert = corpusItemsFor({ stufe: "kids", allowed: anX, lang: "it", lernweg: "it" });
      expect(geliefert.filter((t) => /[^\p{L} .,']/u.test(t))).toEqual([]);
      const gekuerzt = ZEILEN.map((z) => fitText(z, anX, "it")).filter((s): s is string => s !== null);
      expect(gekuerzt.length).toBeGreaterThan(100);
      expect(geliefert.some((t) => gekuerzt.includes(t))).toBe(true);
    });

    it(`${l}: in echten Runden (Mein Training) kommen an der Sprosse von „?" Fragen dieser Charge an (Fokus ?)`, () => {
      const intro = ordnung(l).slice(0, sprosseVon("?", l));
      const echt = Math.random;
      let s = 3707;
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
          for (const z of adaptiveRound({ introduced: intro, focus: ["?"], stufe: "kids", lang: "it", lernweg: "it", count: 12 })) {
            texte.push(z.text);
          }
        }
      } finally {
        Math.random = echt;
      }
      expect(texte.some((t) => EIGENE.has(t) && t.endsWith("?")), texte.slice(0, 12).join(" / ")).toBe(true);
    });
  }

  it("Weg „de“ und Weg „es“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const de = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("es");
    const es = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(introOrder("es"), "es"), lang: "es", lernweg: "es" });
    expect(ZEILEN.filter((t) => es.includes(t))).toEqual([]);
  });
});
