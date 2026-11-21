/**
 * ★★★ Wächter IT-T9 (03.10.2026): die it-Texte für Erwachsene am ENDE des
 * Lernwegs (`corpusItWegEndeErwachsene.ts`) - Sprossen 37-70: Satzzeichen
 * `? ! " : ; - ( )`, Ziffern `1`…`9` `0`, Sonderzeichen
 * `% & / + * = _ < > $ | € @ #` und zuletzt `[ ]` (nur `it`) bzw. `{ }` (nur
 * `it-qzerty`). Vorbilder: `tastenflow-texte-it-teens-mitte.test.ts` (IT-T5) und
 * `tastenflow-texte-es-erwachsen-ende.test.ts` (ES-T9); Bauplan
 * `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §3/§5/I19, Befund IT-T1 §6,
 * Leitfaden Fallen 26/31/37/45/48/51/58/76.
 *
 * ZWEI SPROSSEN je Zeile, AUSGERECHNET auf BEIDEN Pflicht-Tastaturen:
 *  - die VOLLE Sprosse: ab ihr erscheint die Zeile mit jedem ihrer Zeichen;
 *  - die BUCHSTABEN-Sprosse: ab ihr wird sie überhaupt serviert (auf Weg „it"
 *    lässt `fitText` `? ! " : ; - ( )` bis dahin weg - `? !` sind hier NICHT
 *    hart, Befund IT-T4 §2 -, Ziffern und Sonderzeichen nicht).
 * Dazu: Erwachsene bekommen vor ⇧ keine Grossbuchstaben (D-2), keine Zeile mit
 * zwei Sätzen vor ihren Satzzeichen (Weg „it" hat keine Frühfassungen),
 * Zahlformat, Adressen nur mit `esempio`, € nur mit Ort in Italien oder San
 * Marino, der Norden nicht vorne, Wortbudget über die Erwachsenen-Chargen,
 * keine Kopie, kein Paar. Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, toLayoutText, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { CORPUS_IT_WEG_ENDE_ERWACHSENE } from "../src/lib/typing/corpusItWegEndeErwachsene";
import { CORPUS_IT_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusItWegFruehKids";
import { CORPUS_IT_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusItWegFruehTeens";
import { CORPUS_IT_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusItWegFruehErwachsene";
import { CORPUS_IT_WEG_MITTE_KIDS } from "../src/lib/typing/corpusItWegMitteKids";
import { CORPUS_IT_WEG_MITTE_TEENS } from "../src/lib/typing/corpusItWegMitteTeens";
import { CORPUS_IT_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusItWegMitteErwachsene";
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
const ZEILEN = CORPUS_IT_WEG_ENDE_ERWACHSENE.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Die fertigen it-Chargen IT-T1 … IT-T6 - keine Kopie, kein Paar mit ihnen (Falle 31, 51; T6 seit dem Merge 03.10.). */
const ANDERE_IT_ZEILEN = [
  ...CORPUS_IT_WEG_FRUEH_KIDS,
  ...CORPUS_IT_WEG_FRUEH_TEENS,
  ...CORPUS_IT_WEG_FRUEH_ERWACHSENE,
  ...CORPUS_IT_WEG_MITTE_KIDS,
  ...CORPUS_IT_WEG_MITTE_TEENS,
  ...CORPUS_IT_WEG_MITTE_ERWACHSENE,
].map((i) => i.text);
/** Die anderen Erwachsenen-Chargen (IT-T3 früh, IT-T6 Mitte) - das Wortbudget gilt je STUFE (Falle 45). */
const FRUEHERE_ERWACHSENE = [...CORPUS_IT_WEG_FRUEH_ERWACHSENE, ...CORPUS_IT_WEG_MITTE_ERWACHSENE].map((i) => i.text);
const norm = (t: string) => t.replace(/\s+/g, " ").trim();

// ── Sprossen ────────────────────────────────────────────────────────────────

const ordnungCache = new Map<LayoutId, string[]>();
function ordnung(l: LayoutId): string[] {
  let o = ordnungCache.get(l);
  if (!o) {
    setLayout(l);
    o = introOrder("it");
    ordnungCache.set(l, o);
  }
  return o;
}
const erlaubtCache = new Map<string, Set<string>>();
function erlaubt(l: LayoutId, n: number): Set<string> {
  const k = `${l}:${n}`;
  let s = erlaubtCache.get(k);
  if (!s) {
    setLayout(l);
    s = allowedFromIntroduced(ordnung(l).slice(0, n), "it");
    erlaubtCache.set(k, s);
  }
  return s;
}
interface Sprossen {
  /** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
  voll: number | null;
  /** Kleinste Sprosse, ab der die Zeile überhaupt serviert wird (null = nie). */
  buchstaben: number | null;
}
const sprossenCache = new Map<string, Sprossen>();
function sprossen(text: string, l: LayoutId): Sprossen {
  const k = `${l}|${text}`;
  const fertig = sprossenCache.get(k);
  if (fertig) return fertig;
  const o = ordnung(l);
  setLayout(l);
  const ziel = norm(toLayoutText(text));
  let voll: number | null = null;
  let buchstaben: number | null = null;
  for (let n = 1; n <= o.length; n++) {
    const f = fitText(text, erlaubt(l, n), "it");
    if (f !== null && buchstaben === null) buchstaben = n;
    if (f === ziel) {
      voll = n;
      break;
    }
  }
  const s = { voll, buchstaben };
  sprossenCache.set(k, s);
  return s;
}
/** Die Einheit der vollen Sprosse (`"?"`, `"7"`, `"€"` …) - null, wenn nie vollständig. */
function einheit(text: string, l: LayoutId): string | null {
  const v = sprossen(text, l).voll;
  return v === null ? null : ordnung(l)[v - 1];
}
const stelle = (l: LayoutId, e: string) => ordnung(l).indexOf(e) + 1;
/** Die Einheiten dieser Charge: alles nach `x` (Nr. 37-70). */
const einheitenDerCharge = (l: LayoutId) => ordnung(l).slice(ordnung(l).indexOf("x") + 1);
/** Je Tastatur die Klammern, die es dort NICHT gibt (F4-Befund §7: `{ }` fehlen auf `it`, `[ ]` auf der QZERTY). */
const FEHLENDE_KLAMMERN: Record<string, RegExp> = { it: /[{}]/, "it-qzerty": /[[\]]/ };

describe("IT-T9: jede Zeile an ihrer Sprosse (it und it-qzerty)", () => {
  it("die Folge ab Nr. 37 - gemessen, nicht geglaubt (auf it [ ], auf der QZERTY { } als letzte)", () => {
    const rest = "? ! \" : ; - ( ) 1 2 3 4 5 6 7 8 9 0 % & / + * = _ < > $ | € @ #";
    expect(ordnung("it").length).toBe(70);
    expect(ordnung("it").slice(36).join(" ")).toBe(`${rest} [ ]`);
    expect(ordnung("it-qzerty").length).toBe(70);
    expect(ordnung("it-qzerty").slice(36).join(" ")).toBe(`${rest} { }`);
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile erscheint vollständig an einer Sprosse ab „?“ (37) - ausser Zeilen mit Klammern, die ${l} nicht hat`, () => {
      const fehler: string[] = [];
      for (const t of ZEILEN) {
        const s = sprossen(t, l);
        if (FEHLENDE_KLAMMERN[l].test(t)) {
          if (s.voll !== null || s.buchstaben !== null) fehler.push(`"${t}": auf ${l} serviert, obwohl die Klammer fehlt`);
        } else if (s.voll === null || s.voll < stelle(l, "?")) fehler.push(`"${t}": volle Sprosse ${s.voll}`);
      }
      expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
    });
  }

  it("minTier = minTierFor (nie von Hand)", () => {
    const fehler = CORPUS_IT_WEG_ENDE_ERWACHSENE.filter((i) => minTierFor(i.text, "it") !== i.minTier).map(
      (i) => `"${i.text}": ${i.minTier}, gerechnet ${minTierFor(i.text, "it")}`,
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die zwei Tastaturen geben jeder Zeile dieselbe Einheit - ausser den Klammer-Zeilen [ ] / { }", () => {
    const fehler: string[] = [];
    for (const t of ZEILEN) {
      if (/[[\]{}]/.test(t)) continue;
      if (einheit(t, "it") !== einheit(t, "it-qzerty")) fehler.push(`"${t}": it ${einheit(t, "it")}, QZERTY ${einheit(t, "it-qzerty")}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von IT-T9 (vom Code gezählt, volle Sprosse) - darf künftig nur STEIGEN, nie unter 6.
   * `(` trägt keine eigene Zeile (die Klammern sind ein festes Paar, `)` kommt eine Sprosse später); `[` auf `it`
   * und `{` auf der QZERTY ebenso.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "?": 39, "!": 32, '"': 21, ":": 25, ";": 18, "-": 18, ")": 19,
    "1": 11, "2": 10, "3": 10, "4": 9, "5": 9, "6": 8, "7": 9, "8": 8, "9": 11, "0": 20,
    "%": 10, "&": 8, "/": 10, "+": 8, "*": 7, "=": 8, "_": 8, "<": 8, ">": 8, "$": 7, "|": 8,
    "€": 11, "@": 9, "#": 7, "]": 7, "}": 7,
  };
  const OHNE_EIGENE_ZEILE = ["(", "[", "{"];

  for (const l of TASTATUREN) {
    it(`${l}: je Einheit von 37 bis 70 mindestens so viele Zeilen wie gemessen (nie unter 6), ( [ { ohne eigene`, () => {
      const anzahl = new Map<string, number>();
      for (const t of ZEILEN) {
        const e = einheit(t, l);
        if (e !== null) anzahl.set(e, (anzahl.get(e) ?? 0) + 1);
      }
      const zuWenig: string[] = [];
      for (const e of einheitenDerCharge(l)) {
        if (OHNE_EIGENE_ZEILE.includes(e)) {
          if (anzahl.has(e)) zuWenig.push(`„${e}“ hat eigene Zeilen?`);
          continue;
        }
        const soll = Math.max(6, MINDESTENS_JE_EINHEIT[e] ?? 6);
        if ((anzahl.get(e) ?? 0) < soll) zuWenig.push(`„${e}“: ${anzahl.get(e) ?? 0} < ${soll}`);
      }
      expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    });
  }

  it("jede Zeile enthält die Einheit ihrer vollen Sprosse (W6, Falle 37)", () => {
    const fehler: string[] = [];
    for (const l of TASTATUREN) {
      for (const t of ZEILEN) {
        const e = einheit(t, l);
        if (e !== null && !t.includes(e)) fehler.push(`${l}: "${t}" ohne „${e}“`);
      }
    }
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet, ? und ! sind weglassbar, Ziffern und Sonderzeichen hart", () => {
    expect(einheit("Dove abiti?", "it")).toBe("?");
    expect(einheit("Che bello!", "it-qzerty")).toBe("!");
    expect(einheit("Il bus (quello rosso) parte.", "it")).toBe(")");
    expect(einheit("Pago 15 € al mese.", "it")).toBe("€");
    expect(einheit("Il 25 aprile.", "it")).toBe("5");
    expect(einheit("In Python [1] è una lista.", "it-qzerty")).toBeNull();
    expect(einheit("In matematica {1} è un insieme.", "it")).toBeNull();
    expect(einheit("In matematica {1} è un insieme.", "it-qzerty")).toBe("}");
    // ? ist weglassbar: die Zeile kommt schon früher, nur ohne Fragezeichen.
    const f = sprossen("Scusi, dov'è la posta?", "it");
    expect(f.buchstaben).toBeLessThan(f.voll!);
    // Eine Ziffer ist hart: vor ihrer Sprosse kommt die Zeile nie.
    const z = sprossen("Il bus 23 passa dal porto.", "it");
    expect(z.buchstaben).toBe(z.voll);
  });
});

// ── Erwachsene vor ⇧, Satzgrenzen ───────────────────────────────────────────

/** Eine innere Satzgrenze: Satzzeichen, Leerzeichen, dann (nach " oder () ein Grossbuchstabe. */
const INNERE_GRENZE = /[.!?]"?\s+["(]*\p{Lu}/u;
/** Eine Zeile mit zwei Sätzen darf erst serviert werden, wenn jedes ihrer Satzendzeichen gelernt ist. */
function mehrsatzZuFrueh(t: string, l: LayoutId): boolean {
  if (!INNERE_GRENZE.test(t)) return false;
  const b = sprossen(t, l).buchstaben;
  if (b === null) return false;
  return [".", "?", "!"].some((z) => t.includes(z) && b < stelle(l, z));
}

describe("IT-T9: Erwachsene vor ⇧ und Satzgrenzen", () => {
  it("jede Zeile trägt einen Grossbuchstaben - vor ⇧ bekommen Erwachsene sie darum nie (D-2)", () => {
    expect(ZEILEN.filter((t) => !/\p{Lu}/u.test(t))).toEqual([]);
    for (const l of TASTATUREN) {
      const o = ordnung(l);
      setLayout(l);
      // Alle Tasten, nur ⇧ nicht gelernt: keine servierte Fassung trägt einen Grossbuchstaben.
      const ohneShift = corpusItemsFor({
        stufe: "erwachsen", allowed: erlaubt(l, o.length), lang: "it", lernweg: "it", umschalt: false,
      });
      expect(ohneShift.filter((t) => /\p{Lu}/u.test(t)), l).toEqual([]);
      expect(ohneShift.filter((t) => EIGENE.has(t)), l).toEqual([]);
    }
  });

  for (const l of TASTATUREN) {
    it(`${l}: keine Zeile mit zwei Sätzen wird serviert, bevor ihre Satzzeichen gelernt sind`, () => {
      expect(ZEILEN.filter((t) => mehrsatzZuFrueh(t, l))).toEqual([]);
    });
  }

  it("Gegenprobe: eine zu früh servierte Zweisatz-Zeile wird gefunden, eine mit Ziffer nicht", () => {
    expect(mehrsatzZuFrueh("Hai finito? Andiamo a casa.", "it")).toBe(true);
    expect(mehrsatzZuFrueh("Sono le 8. Apre lo sportello.", "it")).toBe(false);
    expect(mehrsatzZuFrueh("Andiamo a casa a Bari.", "it")).toBe(false);
  });
});

// ── Form, Typografie, Zahlen, Adressen ──────────────────────────────────────

/** Verbotene Zeichen: Gedankenstriche, Auslassungszeichen, typografische Anführungen, º ª °, Tab, geschützte Leerzeichen. */
const VERBOTEN = /[–—…’‘`«»“”„ºª°\t  ]/;

function formFehler(t: string): string[] {
  const f: string[] = [];
  if (VERBOTEN.test(t)) f.push("verbotenes Zeichen");
  if (/[ÀÈÉÌÒÙ]/.test(t)) f.push("grosser Akzentbuchstabe (unter Windows nie tippbar, I4)");
  if (t !== t.trim() || t.includes("  ")) f.push("Leerzeichen am Rand oder doppelt");
  if (/ [.,;:?!)]/.test(t)) f.push("Leerzeichen vor Satzzeichen");
  if (/,[^ ]/.test(t)) f.push("kein Leerzeichen nach Komma");
  const erster = t.match(/[\p{L}\d]/u)?.[0] ?? "";
  if (!/\d/.test(erster) && erster === erster.toLowerCase()) f.push("beginnt nicht gross");
  if (!/[.!?]"?$/.test(t)) f.push("kein Satzschluss am Ende");
  if ((t.match(/"/g) ?? []).length % 2) f.push("Anführungszeichen ungerade");
  for (const [a, z] of [["(", ")"], ["[", "]"], ["{", "}"]]) {
    if (t.split(a).length !== t.split(z).length) f.push(`${a}${z} ungleich`);
  }
  if (t.length > 90) f.push("länger als 90 Zeichen");
  return f;
}

/**
 * Zahlformat (Bauplan I19): Korpuszeilen werden auf Weg „it" nicht umgeschrieben (`corpus.ts` `wandleVariante`) -
 * darum keine Tausender- und Dezimaltrennzeichen und keine Zahl über vier Stellen. Prozent ohne Leerzeichen (`22%`,
 * italienischer Gebrauch), Euro nach der Zahl mit Leerzeichen (`15 €`), Uhrzeiten als gültiges h:mm.
 */
function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d[.,]\d/.test(t)) f.push("Tausender- oder Dezimaltrenner");
  if (/\d{5,}/.test(t)) f.push("Zahl mit mehr als vier Stellen");
  if (/\d %/.test(t)) f.push("Leerzeichen vor %");
  if (/\d€|€\s?\d/.test(t)) f.push("€ nicht als „15 €“");
  for (const m of t.matchAll(/(\d{1,2}):(\d{2})/g)) {
    if (Number(m[1]) > 23 || Number(m[2]) > 59) f.push(`keine Uhrzeit: ${m[0]}`);
  }
  return f;
}

/** Mail-Adressen nur mit der Domäne `esempio` (erfunden, neutral). */
function adressFehler(t: string): string[] {
  const f: string[] = [];
  for (const m of t.matchAll(/\S+@\S+/g)) {
    if (!/@([a-z]+\.)*esempio\.[a-z]+$/.test(m[0].replace(/[.,;:!?]+$/, ""))) f.push(`Adresse ${m[0]}`);
  }
  if (/www\./.test(t)) f.push("Webadresse");
  return f;
}

describe("IT-T9: Form, Typografie, Zahlen, Adressen", () => {
  it("Form und Typografie: gross am Anfang, Satzschluss, Leerzeichen, Klammern und Anführungszeichen paarig, ≤ 90 Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Zeile besteht die Regeln aller italienischen Zeilen (`helfer/itTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlformat: keine Trennzeichen, keine Zahl über vier Stellen, % und € und Uhrzeiten richtig", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Mail-Adressen nur mit der Domäne „esempio“ (gemessen 8 Adressen), keine Webadresse", () => {
    const fehler = ZEILEN.flatMap((t) => adressFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.filter((t) => /\S@\S/.test(t)).length).toBeGreaterThanOrEqual(7);
  });

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg it, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_IT_WEG_ENDE_ERWACHSENE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("it");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("Gegenprobe: jede Form-, Zahl- und Adressregel schlägt an", () => {
    expect(formFehler("Arrivo – subito.")).toContain("verbotenes Zeichen");
    expect(formFehler("Dice «ciao».")).toContain("verbotenes Zeichen");
    expect(formFehler("Abito al 1° piano.")).toContain("verbotenes Zeichen");
    expect(formFehler("Arrivi ?")).toContain("Leerzeichen vor Satzzeichen");
    expect(formFehler("Sì,certo.")).toContain("kein Leerzeichen nach Komma");
    expect(formFehler("il bus arriva.")).toContain("beginnt nicht gross");
    expect(formFehler("Il bus arriva")).toContain("kein Satzschluss am Ende");
    expect(formFehler('Dice "arrivo.')).toContain("Anführungszeichen ungerade");
    expect(formFehler("Mia sorella (la grande arriva.")).toContain("() ungleich");
    expect(formFehler("È tardi.")).toContain("grosser Akzentbuchstabe (unter Windows nie tippbar, I4)");
    expect(formFehler('"Ci vediamo in piazza", mi scrive Salvatore.')).toEqual([]);
    expect(formFehler("*Offerta valida fino al 31 dicembre.")).toEqual([]);
    expect(zahlFehler("Costa 1.200 € al mese.")).toContain("Tausender- oder Dezimaltrenner");
    expect(zahlFehler("Il tasso è del 3,5%.")).toContain("Tausender- oder Dezimaltrenner");
    expect(zahlFehler("Abitano 12000 persone.")).toContain("Zahl mit mehr als vier Stellen");
    expect(zahlFehler("L'IVA è del 22 %.")).toContain("Leerzeichen vor %");
    expect(zahlFehler("Costa 14€.")).toContain("€ nicht als „15 €“");
    expect(zahlFehler("Costa € 14.")).toContain("€ nicht als „15 €“");
    expect(zahlFehler("Arrivo alle 25:10.")).toContain("keine Uhrzeit: 25:10");
    expect(zahlFehler("Alle 8:30 pago 15 € con l'IVA al 22%.")).toEqual([]);
    expect(adressFehler("Scrivete a anna@ditta.it.")).toHaveLength(1);
    expect(adressFehler("Vedi www.comune.it.")).toHaveLength(1);
    expect(adressFehler("Scrivete a anna@comune.esempio.it.")).toEqual([]);
    expect(adressFehler("In chat con @Marta.")).toEqual([]);
  });
});

// ── Orte und Namen: jedes Grosswort bekannt, Italien in seiner Breite ───────

/**
 * Orte, Landschaften und Länder mit ihrem Raum - als WORTGRUPPE (längste zuerst).
 * N Norden · M Mitte (Toskana, Umbrien, Marken, Latium) · S Süden (Abruzzen bis
 * Kalabrien, wie ISTAT) · I Inseln · CH Tessin und italienisches Graubünden ·
 * BZ Südtirol · RSM San Marino · IT ganz Italien oder mehrere Räume · AUSLAND.
 */
const ORTE: Record<string, string> = {
  // Norden
  Torino: "N", "Porta Palazzo": "N", Milano: "N", "Milano Cortina": "N", Mestre: "N", Bergamo: "N", Brescia: "N",
  Como: "N", Udine: "N", Trieste: "N", Trento: "N", "Emilia-Romagna": "N", Liguria: "N", Taggia: "N", Friuli: "N",
  Ravenna: "N",
  // Mitte
  Roma: "M", Firenze: "M", Perugia: "M", Gubbio: "M", Viterbo: "M", Pisa: "M", Montalcino: "M", Siena: "M",
  Arezzo: "M", Grosseto: "M", Ancona: "M", Pesaro: "M", Macerata: "M", Appennino: "M",
  // Süden
  Napoli: "S", Bari: "S", Lecce: "S", Taranto: "S", Brindisi: "S", Foggia: "S", Matera: "S", "Sassi di Matera": "S",
  Potenza: "S", Cosenza: "S", Crotone: "S", Catanzaro: "S", Lamezia: "S", Tropea: "S", "Reggio Calabria": "S",
  Calabria: "S", Salerno: "S", Avellino: "S", Caserta: "S", Nola: "S", Pescara: "S", Campobasso: "S",
  // Inseln
  Palermo: "I", Ballarò: "I", Catania: "I", Messina: "I", Siracusa: "I", Ragusa: "I", Trapani: "I", Agrigento: "I",
  Enna: "I", Marsala: "I", Bronte: "I", Caltagirone: "I", Lampedusa: "I", Sicilia: "I", Cagliari: "I", Sassari: "I", Nuoro: "I",
  Oristano: "I", Olbia: "I", Iglesias: "I", Sardegna: "I",
  // Tessin und italienisches Graubünden
  Lugano: "CH", Bellinzona: "CH", Locarno: "CH", Mendrisio: "CH", Chiasso: "CH", Biasca: "CH", Poschiavo: "CH",
  Coira: "CH", Ticino: "CH", Svizzera: "CH", "Svizzera italiana": "CH", Gottardo: "CH",
  // Südtirol
  Bolzano: "BZ", Merano: "BZ", Bressanone: "BZ", Brunico: "BZ", Laives: "BZ", Vipiteno: "BZ", Ortisei: "BZ",
  "Val Badia": "BZ", "Val Gardena": "BZ", "Alto Adige": "BZ",
  // San Marino
  "San Marino": "RSM", "Borgo Maggiore": "RSM", Titano: "RSM",
  // ganz Italien / mehrere Räume / Ausland
  Italia: "IT", "Trentino-Alto Adige": "IT", Londra: "AUSLAND", Rio: "AUSLAND",
};

/** Menschen, Einrichtungen, Feste, Werke, Abkürzungen und Bedienwörter - kein Ort. */
const NAMEN = new Set(
  (
    "Gennaro Rosaria Esposito Giuseppina Karim Leonardo Sciascia Salvatore Matteo Concetta Pinna Melis Samantha " +
    "Cristoforetti Fabiola Gianotti Assunta Legnante Anna Moretti Fontana De Luca Russo Associati Figli Carta Penna " +
    "Dante Totò Rinaldi Provincia Poste Pro Loco Politecnico Comune INPS ATA CERN UNESCO IVA Repubblica Festa Liberazione Giorno Memoria " +
    "Unità Costituzione Polizia Stato Unione Ferragosto Epifania Primo Maggio Santo Stefano Lucia Ambrogio Europa " +
    "Cinque Paralimpiadi Stazione Opera Corsa Ceri Frecciarossa Nuovo Cinema Paradiso Invio AltGr Menu Impostazioni " +
    "Accessibilità File Salva Notizie Servizi Contatti Python Markdown JSON HTML Windows L M N B"
  ).split(" "),
);

/** Technik-Stücke (Adresse, Formel, Dateiname, Hashtag, Zahl) - dort gilt Gross/Klein nicht als Name. */
const TECHNIK = /[@/_#=<>{}[\]*$|&+\d]/;
/** Wörter mit Bindestrich, die zu einem Ortsnamen gehören (Emilia-Romagna, Trentino-Alto Adige). */
const BINDESTRICH_ORTE = new Set(Object.keys(ORTE).flatMap((k) => k.split(" ")).filter((w) => w.includes("-")));
/** Jedes Wort eines Ortsnamens (für Ausnahmen: „Como“ ist kein „comò“ ohne Akzent). */
const ORTSWORT = new Set(Object.keys(ORTE).flatMap((k) => k.split(/[ -]/)));

/**
 * Die Wörter einer Zeile mit Stelle: `w` ist das ganze Wort samt Elision (`dell'Alto`), `kern` der Teil nach dem
 * Apostroph (`Alto`) - an ihm hängen Orte, Namen und Grossschreibung; `i` zeigt auf den Kern.
 */
function woerterMitStelle(zeile: string): { w: string; kern: string; i: number; technik: boolean }[] {
  const out: { w: string; kern: string; i: number; technik: boolean }[] = [];
  for (const stueck of zeile.matchAll(/\S+/g)) {
    const technik = TECHNIK.test(stueck[0]);
    for (const m of stueck[0].matchAll(/[\p{L}'-]+/gu)) {
      const ganz = m[0].replace(/^['-]+|['-]+$/g, "");
      if (!ganz) continue;
      const start = stueck.index! + m.index! + m[0].indexOf(ganz);
      // Ein Bindestrich-Wort bleibt eins, wenn es Teil eines Ortsnamens ist (Emilia-Romagna); sonst zählt jeder Teil
      // für sich (Laives-Bolzano, socio-sanitaria).
      const teile = BINDESTRICH_ORTE.has(ganz) ? [ganz] : ganz.split("-");
      let pos = start;
      for (const w of teile) {
        if (w) {
          const ab = w.lastIndexOf("'") + 1;
          out.push({ w, kern: w.slice(ab), i: pos + ab, technik });
        }
        pos += w.length + 1;
      }
    }
  }
  return out;
}
/** Orte einer Zeile (längste Wortgruppe zuerst) und die Wortstellen, die sie bedecken. */
function orteIn(zeile: string): { raeume: Set<string>; bedeckt: Set<number> } {
  const w = woerterMitStelle(zeile);
  const raeume = new Set<string>();
  const bedeckt = new Set<number>();
  for (let i = 0; i < w.length; i++) {
    for (const len of [3, 2, 1]) {
      if (i + len > w.length) continue;
      const gruppe = w.slice(i, i + len).map((x) => x.kern).join(" ");
      if (gruppe in ORTE) {
        raeume.add(ORTE[gruppe]);
        for (let k = i; k < i + len; k++) bedeckt.add(k);
        i += len - 1;
        break;
      }
    }
  }
  return { raeume, bedeckt };
}
/** Darf hier ein Satz (oder ein Zitat, ein Titel) mit Grossbuchstaben beginnen? */
function satzanfang(zeile: string, stelle: number): boolean {
  const davor = zeile.slice(0, stelle);
  return /(^|[.!?]\s+)["(*]*$/.test(davor) || /(^|\s)"$/.test(davor);
}
/** Grossgeschriebene Wörter, die weder am Satzanfang stehen noch Ort, Name oder Technik sind. */
function unbekannteGrosswoerter(zeile: string): string[] {
  const { bedeckt } = orteIn(zeile);
  return woerterMitStelle(zeile)
    .filter(({ kern, i, technik }, k) =>
      kern[0] !== kern[0].toLowerCase() && !technik && !bedeckt.has(k) && !NAMEN.has(kern) && !satzanfang(zeile, i))
    .map(({ kern }) => kern);
}
function raumZahl(zeilen: string[]): { verortet: number; je: Map<string, number> } {
  const je = new Map<string, number>();
  let verortet = 0;
  for (const z of zeilen) {
    const r = orteIn(z).raeume;
    if ([...r].some((x) => x !== "IT" && x !== "AUSLAND")) verortet++;
    for (const x of r) je.set(x, (je.get(x) ?? 0) + 1);
  }
  return { verortet, je };
}

describe("IT-T9: Orte aus dem ganzen italienischen Sprachraum - der Norden nicht vorne", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist Teil eines bekannten Ortes, ein Name oder Technik", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Listen tragen nur, was wirklich vorkommt (sonst wachsen sie still)", () => {
    const text = ZEILEN.join(" ");
    expect(Object.keys(ORTE).filter((o) => !new RegExp(`(^|[^\\p{L}])${o}([^\\p{L}]|$)`, "u").test(text))).toEqual([]);
    const woerter = new Set(ZEILEN.flatMap((z) => woerterMitStelle(z).map((x) => x.kern)));
    expect([...NAMEN].filter((n) => !woerter.has(n))).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von IT-T9: S 38 · I 36 · CH 23 · M 21 · BZ 20 · N 17 · RSM 5 (Zeilen je Raum), 157 von 408
   * Zeilen verortet (die Zeichen-Zeilen - Formeln, Dateinamen - sind absichtlich ohne Ort). Johannes: Süd und
   * Inseln, Tessin und Südtirol so stark wie der Norden.
   */
  it("Süden, Inseln und Tessin/Graubünden je mindestens so oft wie der Norden; Mitte und Südtirol nah dran; San Marino da", () => {
    const { verortet, je } = raumZahl(ZEILEN);
    const nord = je.get("N") ?? 0;
    const text = [...je].map(([r, k]) => `${r} ${k}`).join(" · ");
    expect(nord, text).toBeGreaterThan(0);
    for (const r of ["S", "I", "CH"]) expect(je.get(r) ?? 0, `${r}: ${text}`).toBeGreaterThanOrEqual(nord);
    for (const r of ["M", "BZ"]) expect((je.get(r) ?? 0) * 5, `${r}: ${text}`).toBeGreaterThanOrEqual(nord * 4);
    expect(je.get("RSM") ?? 0, text).toBeGreaterThanOrEqual(3);
    expect(verortet, text).toBeGreaterThanOrEqual(150);
    expect(nord * 5, `Norden höchstens ein Fünftel der verorteten Zeilen: ${text}`).toBeLessThanOrEqual(verortet);
  });

  it("€ nur mit Ort in Italien oder San Marino - nie im Tessin (dort zahlt man in Franken), nie ohne Ort", () => {
    const fehler: string[] = [];
    for (const z of ZEILEN) {
      if (!z.includes("€")) continue;
      const r = orteIn(z).raeume;
      const italien = [...r].some((x) => ["N", "M", "S", "I", "BZ", "RSM", "IT"].includes(x));
      if (!italien || r.has("CH")) fehler.push(z);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: unbekannter Ort, Wortgruppen, Zitat am Anfang, Technik, € im Tessin und ein Nord-Übergewicht", () => {
    expect(unbekannteGrosswoerter("Abito a Atlantide.")).toEqual(["Atlantide"]);
    expect(unbekannteGrosswoerter("Vado a Reggio.")).toEqual(["Reggio"]);
    expect(orteIn("Il treno per Reggio Calabria.").raeume).toEqual(new Set(["S"]));
    expect(orteIn("Abito in Val Badia.").raeume).toEqual(new Set(["BZ"]));
    expect(unbekannteGrosswoerter('Il libro è "Il giorno della civetta".')).toEqual([]);
    expect(unbekannteGrosswoerter("Scrivo =SOMMA(B2:B9) qui.")).toEqual([]);
    expect(unbekannteGrosswoerter("Arriva Pietro Rossi.")).toEqual(["Pietro", "Rossi"]);
    const ticino = "A Lugano ho pagato 5 €.";
    expect(orteIn(ticino).raeume.has("CH")).toBe(true);
    const n = raumZahl(["A Torino.", "A Milano.", "A Napoli."]).je;
    expect((n.get("S") ?? 0) >= (n.get("N") ?? 0)).toBe(false);
  });
});

// ── Wortschatz ──────────────────────────────────────────────────────────────

/**
 * Funktionswörter zählen nicht - die Liste des Mitte-Wächters (IT-T5), dazu (erst ab hier nötig, weil erst jetzt
 * Fragen und Nebensätze stehen) Fragewörter, Konjunktionen, Präpositionen und einige Begleiter/Adverbien - dieselbe
 * Art, die der spanische Ende-Wächter (ES-T9 §7) ausnimmt. ⚠️ Eine Erweiterung der Zählregel; der Chat nimmt sie ab.
 */
const FUNKTIONSWOERTER = new Set(
  (
    "il lo la i le gli un uno una di a ad da in con su per tra fra " +
    "del dello della dei delle degli al allo alla ai alle agli dal dallo dalla dai dalle " +
    "nel nello nella nei nelle sul sullo sulla sui sulle " +
    "e ed o ma se non si mi ti ci vi ne io tu lui lei noi voi loro " +
    "mio mia miei mie tuo tua suo sua nostro nostra sono sei siamo siete era erano è ho ha hanno " +
    "fa fai sta sto stai tutto tutta tutti tutte che chi anche più perché così poi ora già " +
    "questo questa quest c l d po dell all dall nell sull " +
    "come quando dove quanto quanta quanti quante quale quali cosa però quindi mentre oppure " +
    "dopo prima senza sopra sotto verso entro contro durante presso " +
    "ancora sempre mai molto poco meno solo ogni qui lì quello quella quelli quelle"
  ).split(" "),
);
/** Inhaltswörter einer Zeile (je Zeile einmal) - Technik-Stücke (Adresse, Formel, Dateiname) zählen nicht. */
function inhaltsWoerter(t: string): Set<string> {
  const ohneTechnik = t.split(/\s+/).filter((x) => !TECHNIK.test(x)).join(" ").toLowerCase();
  return new Set((ohneTechnik.match(/\p{L}+/gu) ?? []).filter((w) => !FUNKTIONSWOERTER.has(w)));
}
function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltsWoerter(z)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/**
 * Wörter dieser Charge, die NICHT in `WORDS_IT`, `STUFE_VOCAB_IT` oder `NACHTRAG_IT` standen und die das
 * macOS-Wörterbuch für Italienisch bestätigt hat (`osascript -l JavaScript scripts/woerterbuch-macos.js`,
 * Vorsilbe `it:`, gemessen 03.10.2026). Abgelehnt und darum ersetzt: `bilocale`, `taggiasche`, `gate`, `echo`,
 * `paralimpico`, `grotto`. Namen und Orte prüfen die Listen oben, Technik-Stücke (Formeln, Dateinamen,
 * Adressen) niemand.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set([
  "affaccia", "antinfluenzale", "aliquota", "barra", "bentornato", "bilingui", "bollo", "bora", "bozza", "call", "cancelleria", "cardiologia",
  "cantonale", "caponata", "caricamento", "cartellino", "center", "chiocciola", "civica", "collocamento", "colpì",
  "compila", "compilato", "condominiali", "configurazione", "congedo", "consolato", "consultorio", "cooperativa",
  "dattilografia", "decolla", "dietologa", "digitare", "direttrice", "dolomitiche", "dottor", "elettricista", "federale", "ferroviere",
  "frontalieri", "gentilissima", "graduatorie", "grep", "immateriale", "impostazioni", "inaugura", "inaugurato",
  "infermieristica", "inserisca", "italo", "iva", "ladino", "ls", "master", "mediatrice", "michetta",
  "moltiplicazione", "operatrice", "ordinaria", "ottennero", "paragrafo", "parziale", "pediatrico", "policlinico",
  "portinaia", "pre", "prefisso", "pupi", "rata", "registrata", "residente", "rimanda", "rinnovino", "rinominato",
  "rinviata", "riaprirà", "rosetta", "rovesciata", "sardo", "scelsero", "script", "separo", "serale", "socia", "sommare", "sostituisci", "tutelata", "patrono",
  "stampatello", "tag", "targa", "telelavoro", "terminale", "traghetto", "transfer", "tributi", "trilingui", "vicoli",
]);
/**
 * ⚠️ Zwei Wörter, die das macOS-Wörterbuch NICHT kennt und die trotzdem stehen, weil die Zeile von ihnen handelt
 * (Bezug zur Sprache): `cancelletto` (so heisst `#` auf italienischen Telefonen und Tastaturen) und `natel` (im
 * Tessin für das Mobiltelefon). Beleg: Allgemeinwissen [G], ohne Netz nicht nachgeschlagen - Befund §6 Zweifelsfälle.
 */
const OHNE_WOERTERBUCH: ReadonlySet<string> = new Set(["cancelletto", "natel"]);

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat(), ...NACHTRAG_IT].map((w) => normalizeWord(w, "it")),
);
/** Anfänge vor dem Apostroph (geschlossene Liste wie `ELISION_ANFAENGE_IT` in lexicon.ts, soweit hier gebraucht). */
const ELISIONS_ANFAENGE = new Set(["l", "un", "dell", "all", "dall", "nell", "sull", "c", "d", "quest", "ottant", "mezz", "sant"]);

function wortGeprueft(w: string): boolean {
  const n = normalizeWord(w, "it");
  const bekannt = (x: string) => x.length < 2 || VORHER_BEKANNT.has(x) || VOM_WOERTERBUCH_BESTAETIGT.has(x) || OHNE_WOERTERBUCH.has(x);
  if (bekannt(n)) return true;
  if (!n.includes("'")) return false;
  return ELISIONS_ANFAENGE.has(n.slice(0, n.lastIndexOf("'"))) && bekannt(n.slice(n.lastIndexOf("'") + 1));
}
/** Wörter, die weder vorher im Wortschatz standen noch vom Wörterbuch bestätigt noch Name/Ort/Technik sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    const { bedeckt } = orteIn(z);
    woerterMitStelle(z).forEach(({ w, kern, technik }, k) => {
      if (technik || bedeckt.has(k) || NAMEN.has(kern)) return;
      if (!wortGeprueft(w)) out.add(w.toLowerCase());
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
/** Namen und Orte bleiben aussen vor: „Como“ ist ein Ort, nicht ein „comò“ ohne Akzent. */
const ohneAkzentFehler = (zeile: string): string[] =>
  (zeile.match(/\p{L}+/gu) ?? [])
    .filter((w) => !NAMEN.has(w) && !ORTSWORT.has(w))
    .map((w) => w.toLowerCase())
    .filter((w) => NUR_MIT_AKZENT.has(w));

/**
 * „e" (und) gegen „è" (ist): jede Zeile mit einem allein stehenden „e" ist gelesen und hier eingetragen - in
 * jeder ist „e" = und (in „evito "&" al posto di "e"" das Wort selbst). Eine neue Zeile mit „e" muss hier
 * stehen, sonst wird der Wächter rot.
 */
const ZEILEN_MIT_E_GELESEN: ReadonlySet<string> = new Set([
  "Ha portato la ricetta e la tessera sanitaria?",
  "Forza, l'ultimo carico e poi si stacca!",
  "Coraggio, ancora quattro settimane e poi si va al mare!",
  "Ogni mattina prendo il 16 alle sette e un quarto.",
  'La dietologa mi ha detto "meno sale e più verdura".',
  "Orario dello sportello: lunedì, mercoledì e venerdì mattina.",
  "Documenti da portare: carta d'identità, codice fiscale e due foto.",
  "Ordine del giorno: bilancio, nuovi turni e varie ed eventuali.",
  "Lista della spesa: pane, latte, pomodori e caffè.",
  "La mia lista per la caponata: melanzane, sedano, capperi, olive e cipolla.",
  "Il mio consiglio per il colloquio: arrivare in anticipo e ascoltare bene.",
  "Tre cose da fare oggi: banca, posta e farmacia.",
  "Il Trentino-Alto Adige è formato da due province autonome, Trento e Bolzano.",
  "La mia collega è italo-argentina e parla anche spagnolo.",
  "A Pesaro il lungomare è pieno di bici e monopattini - soprattutto la sera.",
  "La mediatrice (parla arabo e francese) aiuta le famiglie a scuola.",
  "Le olive di Taggia (in Liguria) sono piccole e saporite.",
  "Il tirocinio dura 12 settimane, con lezioni il martedì e il giovedì.",
  "Abito all'ultimo piano: 125 gradini e niente ascensore!",
  "Il codice fiscale ha 16 caratteri, tra lettere e numeri.",
  "Il 26 dicembre è Santo Stefano e anche in Ticino si fa festa.",
  "La nuova sede ha 7 sale riunioni e una mensa.",
  "Il negozio di Laives apre alle 7 e chiude alle 12.",
  "Siamo 27 inquilini e c'è un solo ascensore.",
  "Assunta Legnante ha vinto l'oro alle Paralimpiadi di Londra nel 2012 e di Rio nel 2016.",
  "In Italia all'università il voto va da 18 a 30 e lode.",
  "Sul pane e sul latte l'IVA è del 4%.",
  'Nei messaggi ufficiali evito "&" al posto di "e".',
  "Il bus 5/A collega la stazione e il policlinico.",
  "Biglietto per 2 adulti + 1 bambino, andata e ritorno.",
  "La password deve avere almeno 8 caratteri e un simbolo, per esempio *.",
  "Nel programma scrivo prezzo = 25 e poi stampo il risultato.",
  "Le foto si chiamano IMG_2045 e IMG_2046.",
  "In HTML il tag <p> apre un paragrafo e </p> lo chiude.",
  "Per confermare, digitare il codice e premere il tasto #.",
  "Su molte tastiere italiane @ e # si scrivono con AltGr, sui tasti ò e à.",
  "Il modello del contratto usa {datore} e {lavoratore}.",
]);
const mitE = (z: string): boolean => /(^| )e( |$)/i.test(z.replace(/[,.;:!?"()]/g, " "));

describe("IT-T9: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * Falle 45: das Budget gilt je STUFE - über alle drei Erwachsenen-Chargen IT-T3 (früh) + IT-T6 (Mitte) + IT-T9
   * (Ende). ★ Merge 03.10.2026: vorher über T3 + T9 höchstens 6; mit T6 rissen 34 Wörter die Grenze, die Zeilen
   * dieser Charge sind darum umgeschrieben (Befund §10).
   */
  it("auch über alle Erwachsenen-Chargen (T3 + T6 + T9) steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    const fehler = zuHaeufig([...FRUEHERE_ERWACHSENE, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross und nach Elision), Technik-Stücke und Funktionswörter nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 3 === 0 ? "Ufficio" : i % 3 === 1 ? "l'ufficio" : "un ufficio"} ${"abcdefghi"[i]}?`);
    expect(zuHaeufig(neun)).toEqual(['"ufficio": 9 Zeilen']);
    expect(zuHaeufig(Array.from({ length: 9 }, (_, i) => `Dove ${"abcdefghi"[i]}?`))).toEqual([]);
    expect(zuHaeufig(Array.from({ length: 9 }, (_, i) => `A ${"abcdefghi"[i]}@esempio.it.`))).toEqual([]);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis, auch nicht hinter einer Elision oder in Technik-Stücken", () => {
    const fehler = ZEILEN.flatMap((t) =>
      (t.match(/[\p{L}']+/gu) ?? []).filter((w) => gesperrtIt(w.replace(/^'+|'+$/g, ""))).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: mona, passera (Kern), disabile, patate (Wortbasis) und l'inferno werden gefunden, monaco nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(istKernGesperrtIt("Passera")).toBe(true);
    expect(gesperrtIt("disabile")).toBe(true);
    expect(gesperrtIt("patate")).toBe(true);
    expect(gesperrtIt("l'inferno")).toBe(true);
    expect(gesperrtIt("monaco")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder ist vom Wörterbuch bestätigt (Namen, Orte, Technik: Listen oben)", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => woerterMitStelle(z).filter((x) => !x.technik).flatMap((x) => x.w.toLowerCase().split(/['-]/))));
    expect([...VOM_WOERTERBUCH_BESTAETIGT].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
    expect([...OHNE_WOERTERBUCH].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort, die abgelehnten bilocale und gate werden gemeldet, Name, Ort und Technik nicht", () => {
    expect(ungeprueft(["Ho visto la casx.", "Abito in un bilocale.", "Parto dal gate 11."])).toEqual(["casx", "bilocale", "gate"]);
    expect(ungeprueft(["Gennaro abita a Bari.", "Scrivo =SOMMA(B2:B9) qui.", "Dall'Alto Adige arrivo."])).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0; Technik-Stücke ausgenommen)", () => {
    const buchstabiert = ZEILEN.filter((z) =>
      z.split(/\s+/).filter((w) => !TECHNIK.test(w)).some((w) => normalizeWord(w, "it").length >= 2 && !isRealWord(w, "it")),
    );
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da (perche, citta, piu, cosi …)", () => {
    const fehler = ZEILEN.flatMap((z) => ohneAkzentFehler(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Perche non c'e piu posto?“ wird gemeldet, „Perché non c'è più posto?“ nicht", () => {
    expect(ohneAkzentFehler("Perche non c'e piu posto?")).toEqual(expect.arrayContaining(["perche", "piu"]));
    expect(ohneAkzentFehler("Perché non c'è più posto?")).toEqual([]);
  });

  it("jede Zeile mit „e“ ist gelesen (e = und, nie das gemeinte è)", () => {
    const mit = ZEILEN.filter(mitE);
    expect(mit.filter((z) => !ZEILEN_MIT_E_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_E_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Il treno e in ritardo?“ wäre eine neue, ungelesene Zeile mit „e“", () => {
    expect(mitE("Il treno e in ritardo?")).toBe(true);
    expect(ZEILEN_MIT_E_GELESEN.has("Il treno e in ritardo?")).toBe(false);
    expect(mitE("Il treno è in ritardo?")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare ───────────────────────────────────────────────

/** Satzzeichen weg, Geschlecht und Zahl gleichgesetzt: „Il mio collega è…" und „La mia collega è…" sind ein Paar. */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", gli: "ART", le: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  return (zeile.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [])
    .map((w) => art[w] ?? pron[w] ?? w.replace(/[oaei]$/, "_"))
    .join(" ");
}
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

describe("IT-T9: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der Akzente und Satzzeichen nicht kennt)", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer anderen - weder it (alle anderen Chargen) noch de/en/fr/es (Text oder Ledger-Schlüssel)", () => {
    const frueher = [...CORPUS_IT.filter((i) => !EIGENE.has(i.text)), ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES];
    const texte = new Set(frueher.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(frueher.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_IT_WEG_ENDE_ERWACHSENE.filter(
      (i) => texte.has(i.text.toLowerCase()) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("keine Zeile gleicht einer Zeile von IT-T1 … IT-T6 (Text ohne Satzzeichen und Grossschreibung, Ledger-Schlüssel)", () => {
    const ohne = (t: string) => norm(t.toLowerCase().replace(/[,.;:!?"()-]/g, " "));
    const texte = new Set(ANDERE_IT_ZEILEN.map(ohne));
    const schluessel = new Set(ANDERE_IT_ZEILEN.map((t) => bausteinKey("satz", t)));
    expect(ZEILEN.filter((t) => texte.has(ohne(t)) || schluessel.has(bausteinKey("satz", t)))).toEqual([]);
  });

  it("keine Paare - weder untereinander noch mit einer Zeile von IT-T1 … IT-T6 (Falle 31)", () => {
    const fehler = paare(ZEILEN, ANDERE_IT_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie mit anderen Satzzeichen, Paar über Geschlecht und Ledger-Schlüssel werden erkannt", () => {
    const t3 = FRUEHERE_ERWACHSENE[0];
    const gross = `${t3[0].toUpperCase()}${t3.slice(1)}?`;
    expect(paare([gross], ANDERE_IT_ZEILEN), gross).toHaveLength(1);
    expect(ANDERE_IT_ZEILEN.map((x) => bausteinKey("satz", x))).toContain(bausteinKey("satz", gross));
    expect(paare(["Il collega è di Bari?", "La collega è di Bari!"])).toHaveLength(1);
    expect(paare(["Il bus parte alle 8.", "Il bus arriva alle 8."])).toEqual([]);
    expect(bausteinKey("satz", "Dov'è la posta?")).toBe(bausteinKey("satz", "dov la posta"));
  });
});

// ── Anker, Auslieferung, echte Runden ───────────────────────────────────────

describe("IT-T9: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_IT trägt jede Zeile dieser Charge als geschlossenen Block hinter den Chargen IT-T1 … IT-T6", () => {
    const it_ = CORPUS_IT.map((i) => i.text);
    expect(ZEILEN.filter((t) => !it_.includes(t))).toEqual([]);
    const start = it_.indexOf(ZEILEN[0]);
    expect(it_.slice(start, start + ZEILEN.length)).toEqual(ZEILEN);
    for (const andere of [CORPUS_IT_WEG_FRUEH_KIDS, CORPUS_IT_WEG_FRUEH_TEENS, CORPUS_IT_WEG_FRUEH_ERWACHSENE, CORPUS_IT_WEG_MITTE_KIDS, CORPUS_IT_WEG_MITTE_TEENS, CORPUS_IT_WEG_MITTE_ERWACHSENE]) {
      expect(start).toBeGreaterThan(it_.indexOf(andere[andere.length - 1].text));
    }
  });

  it("korpusFuer(\"it\") trägt jede Zeile (nichts von `mergeCorpus` still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("it").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_IT_WEG_ENDE_ERWACHSENE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe it t9?", kind: "satz" as const, stufen: ["erwachsen" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: mit allen Tasten bekommt Weg „it“ für Erwachsene jede Zeile dieser Charge (ohne die fehlenden Klammern) - nur eigene it-Erwachsenenzeilen`, () => {
      const o = ordnung(l);
      setLayout(l);
      const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed: erlaubt(l, o.length), lang: "it", lernweg: "it" });
      const erwartet = ZEILEN.filter((t) => !FEHLENDE_KLAMMERN[l].test(t));
      expect(erwartet.filter((t) => !geliefert.includes(t))).toEqual([]);
      expect(geliefert.filter((t) => FEHLENDE_KLAMMERN[l].test(t))).toEqual([]);
      const eigeneErwachsene = new Set(
        CORPUS_IT.filter((i) => i.nurWeg === "it" && i.stufen.includes("erwachsen")).map((i) => i.text),
      );
      expect(geliefert.filter((t) => !eigeneErwachsene.has(t))).toEqual([]);
    });

    it(`${l}: in echten Runden für Erwachsene an der ?-Sprosse kommen ganze Fragen dieser Charge`, () => {
      const o = ordnung(l);
      setLayout(l);
      const intro = o.slice(0, stelle(l, "?"));
      const echt = Math.random;
      let s = 9901;
      const texte: string[] = [];
      try {
        for (let r = 0; r < 8; r++) {
          let a = s++ >>> 0;
          Math.random = () => {
            a = (a + 0x6d2b79f5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
          };
          for (const z of adaptiveRound({ introduced: intro, focus: ["?"], stufe: "erwachsen", lang: "it", lernweg: "it", count: 12 })) {
            texte.push(z.text);
          }
        }
      } finally {
        Math.random = echt;
      }
      expect(texte.some((t) => EIGENE.has(t) && t.endsWith("?")), texte.slice(0, 12).join(" / ")).toBe(true);
    });
  }

  it("Kinder, Jugendliche und die Wege „de“/„es“ bekommen keine dieser Zeilen", () => {
    setLayout("it");
    const alle = erlaubt("it", ordnung("it").length);
    setLayout("it");
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

  it("⇧ ist die Umschalt-Einheit des Weges (Voraussetzung des D-2-Tests oben)", () => {
    expect(ordnung("it")).toContain(SHIFT_UNIT);
  });
});
