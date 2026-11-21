/**
 * ★★★ Wächter CS-T8 (09.10.2026): die tschechischen Jugendtexte am Ende des Lernwegs
 * (`corpusCsWegEndeTeens.ts`, Sprossen 45-78 = `!` bis `]`, auf `cs` UND `cs-qwerty`).
 * Vorbilder: `tastenflow-texte-cs-teens-mitte.test.ts` (CS-T5: tschechische Prüfer, Wortbudget Jugend),
 * `tastenflow-texte-pl-teens-ende.test.ts` (PL-T8: Ende-Sprossen mit Zeichen und Ziffern, Naht-Regel) - nur als Form;
 * Befund `BEFUND-2026-10-09-CS-T8-TEENS-ENDE.md`, Leitfaden Fallen 26/31/37/45/48/51/58/61/76/92-100.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, an dem `fitText` sie UNGEKÜRZT liefert
 * (`introOrder("cs").slice(0, n)`), auf BEIDEN Pflicht-Tastaturen - nie aus einem Kommentar geglaubt.
 * `! " : ; - ( )` sind weglassbar: vor ihrer Sprosse kommt die Zeile gekürzt an - frühestens an `í` (22),
 * nie in die Runden von CS-T2, und gekürzt ohne grosses Wort mitten im Satz (Weg „cs" hat keine Frühfassungen,
 * `scripts/_fruehfassung.mts` kennt ihn nicht - die gemeinsame Datei bleibt unberührt). Ziffern, `'` und alles ab
 * `%` sind hart. Tschechisch hat KEIN Wörterbuch (Falle 61): jedes Wort steht im Wortschatz, in den Tatoeba-Formen,
 * in `OHNE_TATOEBA_BELEG` (mit Begründung) oder in `EIGENNAMEN`. Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import {
  fitText,
  corpusItemsFor,
  korpusFuer,
  CORPUS,
  CORPUS_EN,
  CORPUS_FR,
  CORPUS_IT,
  CORPUS_PL,
  CORPUS_TR,
  CORPUS_CS as CS_GELADEN,
} from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_CS as CS_ROH } from "../src/lib/typing/corpusCs";
import { CORPUS_CS_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusCsWegFruehKids";
import { CORPUS_CS_WEG_MITTE_TEENS } from "../src/lib/typing/corpusCsWegMitteTeens";
import { CORPUS_CS_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusCsWegMitteErwachsene";
import { CORPUS_CS_WEG_ENDE_TEENS } from "../src/lib/typing/corpusCsWegEndeTeens";
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { adaptiveRound } from "../src/lib/typing/generator";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtCs, istKernGesperrtCs } from "../src/lib/typing/sperrlisteCs";
import { WORDS_CS, STUFE_VOCAB_CS } from "../src/lib/typing/wordsCs";
import { NACHTRAG_CS } from "../src/lib/typing/lexikonNachtragCs";
import { isRealWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/csTextRegeln";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["cs", "cs-qwerty"];
const CHARGE = CORPUS_CS_WEG_ENDE_TEENS;
const ZEILEN = CHARGE.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Alle ANDEREN cs-Zeilen (T1 bis T6 und jede spätere Charge), aus der ROHEN Sammelliste - nicht aus der geladenen. */
const ANDERE_CS = () => CS_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_CS_ZEILEN = (): string[] => ANDERE_CS().map((i) => i.text);
/** Die anderen Jugend-Chargen (Wortbudget Jugend über T2 + T5 + T8 - Falle 45). */
const JUGEND_ANDERE = (): string[] => ANDERE_CS().filter((i) => i.stufen.includes("teens")).map((i) => i.text);
const T1 = CORPUS_CS_WEG_FRUEH_KIDS.map((i) => i.text);
const T5 = CORPUS_CS_WEG_MITTE_TEENS.map((i) => i.text);

// ── Sprossen ────────────────────────────────────────────────────────────────

const ordnung = (layout: LayoutId = "cs"): string[] => {
  setLayout(layout);
  return introOrder("cs");
};
const allowedCache = new Map<string, Set<string>>();
function allowedAt(n: number, layout: LayoutId = "cs"): Set<string> {
  const k = `${layout}|${n}`;
  let s = allowedCache.get(k);
  if (!s) {
    s = allowedFromIntroduced(ordnung(layout).slice(0, n), "cs");
    allowedCache.set(k, s);
  }
  return s;
}
const sprosseVon = (einheit: string, layout: LayoutId = "cs"): number => ordnung(layout).indexOf(einheit) + 1;
const norm = (t: string) => t.replace(/\s+/g, " ").trim();

/** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
const volleCache = new Map<string, number | null>();
function volleSprosse(text: string, layout: LayoutId = "cs"): number | null {
  const k = `${layout}|${text}`;
  if (volleCache.has(k)) return volleCache.get(k)!;
  const n0 = ordnung(layout).length;
  let erg: number | null = null;
  for (let n = 1; n <= n0; n++) {
    if (fitText(text, allowedAt(n, layout), "cs") === norm(text)) {
      erg = n;
      break;
    }
  }
  volleCache.set(k, erg);
  return erg;
}
/** Die Einheit der vollen Sprosse („!" für einen Ausruf, „7" für eine Zeile mit 7 …). */
function volleEinheit(text: string): string | null {
  const n = volleSprosse(text);
  return n === null ? null : ordnung()[n - 1];
}
/** Kleinste Sprosse, ab der die Zeile überhaupt (gekürzt) serviert wird. */
function ersteSprosse(text: string, layout: LayoutId = "cs"): number | null {
  const n0 = ordnung(layout).length;
  for (let n = 1; n <= n0; n++) if (fitText(text, allowedAt(n, layout), "cs") !== null) return n;
  return null;
}

/** Feste Paare: die öffnende Hälfte hat keine eigenen Zeilen, die Zeile zählt beim Gegenstück. */
const OHNE_EIGENE_ZEILEN = new Set(["(", "["]);

describe("CS-T8: jede Zeile an ihrer Sprosse (cs und cs-qwerty)", () => {
  it("die Folge nach ¨ auf beiden Tastaturen: ! \" : ; ' - ( ) 1-9 0 % / + = _ * & < > $ | @ # € [ ] (45-78)", () => {
    for (const l of TASTATUREN) {
      const o = ordnung(l);
      expect(sprosseVon("¨", l), l).toBe(44);
      expect(o.length, l).toBe(78);
      expect(o.slice(44).join(" "), l).toBe("! \" : ; ' - ( ) 1 2 3 4 5 6 7 8 9 0 % / + = _ * & < > $ | @ # € [ ]");
    }
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile erscheint vollständig NACH ¨, kommt nie vor í (22) überhaupt an, und minTier stimmt`, () => {
      const fehler: string[] = [];
      for (const item of CHARGE) {
        const v = volleSprosse(item.text, l);
        const e = ersteSprosse(item.text, l);
        if (v === null || v <= sprosseVon("¨", l)) fehler.push(`"${item.text}": volle Sprosse ${v}`);
        if (e === null || e < sprosseVon("í", l)) fehler.push(`"${item.text}": schon an Sprosse ${e} serviert (vor í)`);
        const tier = minTierFor(item.text, "cs");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
      expect(fehler, fehler.slice(0, 12).join("\n")).toEqual([]);
    });
  }

  it("jede Zeile hat auf cs und cs-qwerty DIESELBE volle Sprosse, und die Datei ist danach sortiert", () => {
    expect(ZEILEN.filter((t) => volleSprosse(t, "cs") !== volleSprosse(t, "cs-qwerty"))).toEqual([]);
    const s = ZEILEN.map((t) => volleSprosse(t) ?? 0);
    expect(s.every((x, i) => i === 0 || s[i - 1] <= x)).toBe(true);
  });

  it("Gegenprobe: Sprossen und Einheiten werden richtig gerechnet", () => {
    expect(volleEinheit("Hurá, máme volno!")).toBe("!");
    expect(ersteSprosse("Jdeme ven!")!).toBeLessThan(sprosseVon("í")); // ohne Buchstaben ab í: viel zu früh
    expect(volleEinheit("\"Kdy je trénink?\" ptá se Eliška.")).toBe("\"");
    expect(volleEinheit("Venku prší; trénink je v hale.")).toBe(";");
    expect(volleEinheit("Kapela hraje rock'n'roll.")).toBe("'");
    expect(ersteSprosse("Kapela hraje rock'n'roll.")).toBe(sprosseVon("'")); // der Apostroph ist hart
    expect(volleEinheit("Ondra (basa) zkouší.")).toBe(")");
    expect(volleEinheit("Je mi 15 let.")).toBe("5");
    expect(volleEinheit("Sraz v 7:45 u školy.")).toBe("7");
    expect(volleEinheit("Test začíná v 8:00 ráno.")).toBe("0");
    expect(volleEinheit("Je tu 20% sleva.")).toBe("%");
    expect(volleEinheit("Seznam v Pythonu: [1, 2, 3].")).toBe("]");
    expect(volleEinheit("Na Slovensku stojí vlek 40 €.")).toBe("€");
    // Vor 50 wird der Bindestrich zur Lücke: „Frýdku Místku" (ein Ort, zwei grosse Wörter - erlaubt).
    expect(fitText("Kapela pochází z Frýdku-Místku.", allowedAt(sprosseVon("¨")), "cs")).toBe("Kapela pochází z Frýdku Místku.");
  });

  /**
   * GEMESSEN am Ende von CS-T8 (vom Code gezählt, Einheit der vollen Sprosse) - darf künftig nur STEIGEN, nie unter 6.
   * `(` und `[` haben keine eigenen Zeilen.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "!": 24, '"': 16, ":": 16, ";": 10, "'": 8, "-": 16, ")": 13,
    "1": 9, "2": 10, "3": 11, "4": 9, "5": 10, "6": 9, "7": 10, "8": 10, "9": 9, "0": 19,
    "%": 8, "/": 7, "+": 7, "=": 7, "_": 7, "*": 7, "&": 7, "<": 7, ">": 7, $: 7, "|": 7, "@": 8, "#": 8, "€": 7, "]": 7,
  };

  it("je Einheit mindestens so viele Zeilen wie gemessen, jede Einheit mindestens 6, ( [ ohne eigene Zeilen", () => {
    const anzahl = new Map<string, number>();
    for (const t of ZEILEN) {
      const e = volleEinheit(t);
      if (e !== null) anzahl.set(e, (anzahl.get(e) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (const [e, min] of Object.entries(MINDESTENS_JE_EINHEIT)) {
      if ((anzahl.get(e) ?? 0) < Math.max(6, min)) zuWenig.push(`„${e}": ${anzahl.get(e) ?? 0} < ${Math.max(6, min)}`);
    }
    for (const [e, n] of anzahl) if (n < 6) zuWenig.push(`„${e}": nur ${n}`);
    for (const e of OHNE_EIGENE_ZEILEN) expect(anzahl.has(e), e).toBe(false);
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    expect([...anzahl.values()].reduce((a, b) => a + b, 0)).toBe(ZEILEN.length);
  });
});

describe("CS-T8: jede Zeile übt die Einheit ihrer Sprosse (W6, Falle 37)", () => {
  it("jede Zeile enthält die Einheit ihrer vollen Sprosse, jede Einheit ab ! hat Zeilen", () => {
    const ohne = ZEILEN.filter((t) => {
      const e = volleEinheit(t);
      return e === null || !t.includes(e);
    });
    expect(ohne, ohne.join("\n")).toEqual([]);
    const o = ordnung();
    const fehlt: string[] = [];
    for (let n = sprosseVon("!"); n <= o.length; n++) {
      if (OHNE_EIGENE_ZEILEN.has(o[n - 1])) continue;
      if (!ZEILEN.some((t) => volleSprosse(t) === n && t.includes(o[n - 1]))) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
  });

  it("Gegenprobe: eine Zeile ohne ihre Einheit (Ausruf ohne !) wird gemeldet", () => {
    expect(volleEinheit("Hurá, máme volno.")).not.toBe("!");
  });

  it("in echten Runden (Mein Training, Jugend) kommen an der Sprosse von ! Ausrufe dieser Charge an (Fokus !)", () => {
    const intro = ordnung().slice(0, sprosseVon("!"));
    const echt = Math.random;
    let s = 4508;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["!"], stufe: "teens", lang: "cs", lernweg: "cs", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    expect(texte.some((t) => EIGENE.has(t) && t.endsWith("!")), texte.slice(0, 12).join(" / ")).toBe(true);
  });
});

// ── Paare: ( ) [ ] und "" nie halb ───────────────────────────────────────────

function paarFehler(t: string): string[] {
  const f: string[] = [];
  for (const [auf, zu] of [["(", ")"], ["[", "]"]] as const) {
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

describe("CS-T8: Klammern und Anführungszeichen nie halb", () => {
  it("jede Zeile schliesst, was sie öffnet", () => {
    const fehler = ZEILEN.flatMap((t) => paarFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: halbe Paare werden gefunden; fitText serviert eine Klammer nie halb", () => {
    expect(paarFehler("Ondra (basa zkouší.")).toHaveLength(1);
    expect(paarFehler('Píše "dobrou.')).toHaveLength(1);
    expect(paarFehler("Seznam [1, 2.")).toHaveLength(1);
    expect(paarFehler("Smajlík =) od babičky.")).toHaveLength(1);
    expect(paarFehler('"Dáš to!" píše Ema (potichu).')).toEqual([]);
    const nurAuf = new Set([...allowedAt(sprosseVon("(") - 1), "("]);
    expect(fitText("Ondra (basa) zkouší.", nurAuf, "cs")).toBeNull();
  });
});

// ── Form und Zahlen ─────────────────────────────────────────────────────────

/** Form-Verstösse einer Zeile (Satzanfang, Satzschluss, Leerzeichen um Satzzeichen). Die Zeichen prüft `zeilenFehler`. */
function formFehler(t: string): string[] {
  const f: string[] = [];
  if (/ {2}/.test(t) || t !== t.trim()) f.push("Leerzeichen");
  if (!/^"?\p{Lu}/u.test(t)) f.push("beginnt nicht mit einem Grossbuchstaben");
  if (!/[.!?]$/.test(t)) f.push("kein Satzschluss am Ende");
  // Zwei allein stehende Klammern sind eine Erwähnung der Tasten („[ a ]", „[ ]"), kein Satzzeichen.
  const u = t.replace(/\[ (\S+ )?\]/g, "X");
  if (/ [.,:;?!](?=\s|$)/.test(u) || / [)\]](?!\s)/.test(u)) f.push("Leerzeichen vor Satzzeichen");
  if (/[([] /.test(u)) f.push("Leerzeichen nach öffnender Klammer");
  if (/,[^ "]/.test(t.replace(/\d,\d/g, "0").replace(/\[[\d, ]+\]/g, "L"))) f.push("kein Leerzeichen nach Komma (Dezimalkomma 1,2 ausgenommen)");
  return f;
}

/**
 * Zahlformat (Glossar §1 Nr. 5, §2.10): Dezimalkomma („1,2"), kein Tausenderpunkt, Tausender mit EINEM normalen
 * Leerzeichen („2 400", „116 111"; fünfstellig nie ohne), Uhrzeit „7:15" (Minuten zweistellig), Prozent nur als
 * Adjektiv ohne Leerzeichen („20% sleva"), Kč/€/$ nach der Zahl mit Leerzeichen, und KEINE Zeile endet mit Ziffer und
 * Punkt (die Stimme läse „2." als Ordnungszahl - Glossar §4 Falle 4); eine Ordnungszahl steht nur mitten im Satz
 * („v 9. třídě", „4. B").
 */
function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d %/.test(t)) f.push("Leerzeichen vor % (in Übungszeilen nur das Adjektiv „20% sleva“)");
  if (/\d(Kč|€|\$)|(€|\$) ?\d/.test(t.replace(/\$[A-Z]+\$\d+/g, "ADR"))) f.push("Währung nicht als „5 €“");
  if (/\d\.\d/.test(t)) f.push("Dezimal- oder Tausenderpunkt");
  if (/\d\.$/.test(t)) f.push("Ziffer und Punkt am Zeilenende (Ordnungszahl)");
  if (/\d\. \p{Lu}\p{L}/u.test(t)) f.push("Ziffer und Punkt vor grossem Wort (Satzende hinter Zahl)");
  for (const m of t.matchAll(/\d{5,}/g)) f.push(`Zahl ${m[0]} ohne Leerzeichen-Trenner`);
  for (const m of t.matchAll(/\b(\d{1,2}):(\d+)\b/g)) {
    if (/\b(v|ve|do|od|po)$/u.test(t.slice(0, m.index).trim())) {
      if (m[2].length !== 2 || Number(m[1]) > 23 || Number(m[2]) > 59) f.push(`Uhrzeit ${m[0]}`);
    }
  }
  return f;
}

/**
 * Präposition vor Uhrzeit oder Zahl nach dem GESPROCHENEN Zahlwort (Glossar Regel 13): „ve" vor 2, 3, 4, 12, 13, 14,
 * 20-24 (dvě, tři, čtyři, dvanáct, třináct, čtrnáct, dvacet), sonst „v"; „ze" vor 2, 3, 4, 6, 7 und 12-14, 17, 20-29
 * (Genitiv dvou, tří, čtyř, šesti, sedmi, dvanácti …), sonst „z".
 */
function praepositionFehler(t: string): string[] {
  const f: string[] = [];
  for (const m of t.matchAll(/(?<![\p{L}])(v|ve|V|Ve|z|ze|Z|Ze) (\d+)(?=[:.\s,%])/gu)) {
    const p = m[1].toLowerCase();
    const n = Number(m[2]);
    const veZahl = [2, 3, 4, 12, 13, 14].includes(n) || (n >= 20 && n <= 24);
    const zeZahl = [2, 3, 4, 6, 7, 12, 13, 14, 17, 100].includes(n) || (n >= 20 && n <= 29);
    if (p === "v" && veZahl) f.push(`„${m[0]}“ - gesprochen „ve …“`);
    if (p === "ve" && !veZahl) f.push(`„${m[0]}“ - gesprochen „v …“`);
    if (p === "z" && zeZahl) f.push(`„${m[0]}“ - gesprochen „ze …“`);
    if (p === "ze" && !zeZahl) f.push(`„${m[0]}“ - gesprochen „z …“`);
  }
  return f;
}

describe("CS-T8: Form und Zahlen", () => {
  it("Satzanfang gross, Satzschluss am Ende, Leerzeichen richtig", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlen im Landesbrauch: 1,2 · 7:15 · 2 400 Kč · 20% sleva · 5 € · keine Ziffer mit Punkt am Satzende", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.some((t) => /\d,\d\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\bve? \d{1,2}:\d\d\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d \d{3} Kč/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d% \p{Ll}/u.test(t))).toBe(true);
  });

  it("v/ve und z/ze vor Zahlen nach dem gesprochenen Zahlwort (Glossar Regel 13)", () => {
    const fehler = ZEILEN.flatMap((t) => praepositionFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Zeile besteht die Regeln aller tschechischen Zeilen (`helfer/csTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg cs, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("cs");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("Gegenprobe: jede Form-, Zahl- und Präpositionsregel schlägt an - die Excel-Adresse $B$2 und „[ a ]“ nicht", () => {
    for (const t of ["ondra hraje.", "Ondra hraje", "Ondra hraje .", "Raz,dva.", "Ondra ( basa) hraje.", "Ondra  hraje."]) {
      expect(formFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(formFehler('"Dáš to!" píše Ema.')).toEqual([]);
    expect(formFehler("Hranaté závorky [ a ] dává pravý Alt.")).toEqual([]);
    expect(formFehler("Seznam: [1, 2, 3].")).toEqual([]);
    for (const t of ["Baterie má 50 %.", "Stojí 2€.", "Stojí € 2.", "Stojí $5.", "Váží 1.5 kila.", "Je tu 12345 lidí.", "Sraz v 7:5 ráno.", "Hrajeme na 2.", "Vyhráli 2:1. Pak se slavilo."]) {
      expect(zahlFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(zahlFehler("V 7:15, za 2 400 Kč, 20% sleva, průměr 1,2, 3. A, 5 €, 12 $ a $B$2 v Excelu.")).toEqual([]);
    for (const t of ["Sraz v 2:00 ráno.", "Sraz ve 7:15 ráno.", "Ze 5 lidí.", "Z 3 lidí.", "V 13 hodin."]) {
      expect(praepositionFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(praepositionFehler("Ve 4 ráno, v 7:15, ve 20:30, v 19:45, ze 22 lidí, ze 3. A, ze 100% bavlny a ve 12 hodin.")).toEqual([]);
  });
});

// ── Geschlecht (Glossar §1 Regel 2) ─────────────────────────────────────────

const W_ENDE = "(?=[\\s,.?!:;\"')]|$)";
const GEGENDERTES_DU = new RegExp(
  `(^|[\\s"(])\\p{L}+(l|la|li|ly) jsi${W_ENDE}|(^|[\\s"(])jsi (\\p{L}+(l|la|li|ly|ý|á)|sám|sama)${W_ENDE}`,
  "iu",
);
/** „ich bin" mit hartem Adjektiv oder l-Partizip legt das Geschlecht der tippenden Person fest; ebenso rád/ráda + jsem. */
const GEGENDERTES_ICH = new RegExp(
  `(^|[\\s"(])\\p{L}+(l|la) jsem${W_ENDE}|(^|[\\s"(])jsem (\\p{L}+(l|la|ý|á)|sám|sama|rád|ráda)${W_ENDE}`,
  "iu",
);

describe("CS-T8: keine Zeile legt das Geschlecht der Jugendlichen oder der tippenden Person fest", () => {
  it("kein gegendertes „du“ und kein gegendertes „ich“ (auch nicht vor ! oder in Anführung)", () => {
    expect(ZEILEN.filter((z) => GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z))).toEqual([]);
  });

  it("Gegenprobe: „Byl jsi tam?“, „\"Jsi hotová!\"“, „Usnul jsem!“, „Jsem připravený.“ gefunden; „Jsem z Chebu“ und „Vyhráli jsme 2:1.“ nicht", () => {
    for (const z of ["Byl jsi tam?", '"Jsi hotová!" volá Ema.', "Kde jsi byla?"]) expect(GEGENDERTES_DU.test(z), z).toBe(true);
    for (const z of ["Usnul jsem!", "Jsem připravený.", '"Jsem sama," píše Ema.']) expect(GEGENDERTES_ICH.test(z), z).toBe(true);
    for (const z of ['"Ahoj, jsem Mai a bydlím v Sokolově," píše.', "Vyhráli jsme 2:1.", "Teď nemůžu, jsem na tréninku!"]) {
      expect(GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z), z).toBe(false);
    }
  });
});

// ── Wörter, Grosswörter, Orte ───────────────────────────────────────────────

/** Technische Wörter (Adressen, Dateien, Formeln, Spielstände, Beträge) - sie werden nicht als Wörter geprüft. */
const TECHNISCH = /[@_/#=<>|*+&$%€\\\d[\]]/;

/** Wörter einer Zeile mit Merker „Satzanfang" (Zeilenanfang, nach . ? !, Anfang einer Anführung); technische fallen weg. */
function woerterMitAnfang(zeile: string): { w: string; anfang: boolean }[] {
  const out: { w: string; anfang: boolean }[] = [];
  let naechsterAnfang = true;
  for (const roh of zeile.split(/\s+/)) {
    const kern = roh.replace(/^["('[]+|[.,!?:;")'\]]+$/g, "");
    if (kern && !TECHNISCH.test(kern)) {
      for (const [i, teil] of kern.split("-").entries()) {
        const w = teil.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
        if (w) out.push({ w, anfang: i === 0 && (naechsterAnfang || roh.startsWith('"')) });
      }
    }
    naechsterAnfang = /[.!?]"?\)?$/.test(roh);
  }
  return out;
}
const kleinWoerter = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w.toLowerCase());

/**
 * Eigennamen der Charge (klein): Personen, Orte, Landschaften, Vereine, Werke, Programme, Abkürzungen. Jedes grosse
 * Wort mitten im Satz steht hier; sie sind belegt, weil sie Namen sind. Nur Benutztes, nur noch nicht Bekanntes.
 */
const EIGENNAMEN: Readonly<Record<string, string>> = {
  // Vornamen (Mädchen und Jungen gleichwertig; Mai und Duc: Familien aus Vietnam, Darina: aus der Ukraine)
  adam: "Vorname", adamovi: "Dat. von Adam", adéla: "Vorname", adélo: "Vok. von Adéla", anežka: "Vorname",
  barbora: "Vorname", bára: "Vorname (Barbora)", dan: "Vorname", daniel: "Vorname", danielovi: "Dat. von Daniel",
  darina: "Vorname (ukrainisch)", dominika: "Vorname", duc: "Vorname (vietnamesisch)", ema: "Vorname", filip: "Vorname",
  hana: "Vorname", jakub: "Vorname", jindřich: "Vorname", jonáš: "Vorname", jonášovi: "Dat. von Jonáš", julie: "Vorname",
  kateřina: "Vorname", klára: "Vorname", kristýna: "Vorname", kristýně: "Dat. von Kristýna", kryštof: "Vorname",
  kuba: "Vorname (Jakub)", linda: "Vorname", lindu: "Akk. von Linda", lindy: "Gen. von Linda", lukáš: "Vorname",
  mai: "Vorname (vietnamesisch)", matyáš: "Vorname", matěj: "Vorname", michaela: "Vorname", michal: "Vorname",
  natálie: "Vorname", nela: "Vorname", nikola: "Vorname", ondra: "Vorname (Ondřej)", patrik: "Vorname", petr: "Vorname",
  radek: "Vorname", rozálie: "Vorname", rozálii: "Dat. von Rozálie", sabiny: "Gen. von Sabina", sára: "Vorname",
  šárka: "Vorname", šimon: "Vorname", tereza: "Vorname", tobiáš: "Vorname", veronika: "Vorname", viktor: "Vorname",
  viktorie: "Vorname", vojta: "Vorname (Vojtěch)", vítek: "Vorname", vítka: "Gen. von Vítek", žofie: "Vorname",
  // Personen, Werke, Vereine, Marken
  karel: "Karel IV. (Kaiser, gründete 1348 die Prager Universität)", iv: "IV. (römische Ordnungszahl: Karel IV.)",
  ledecká: "Ester Ledecká (Olympiasiegerin im Skilauf und Snowboard)", krejčíková: "Barbora Krejčíková (Tennis, Wimbledon 2024)",
  wimbledon: "Wimbledon (Tennisturnier)", newtonův: "Possessiv zu Newton (Newtonův zákon)", ohmův: "Possessiv zu Ohm (Ohmův zákon)",
  braillově: "Lok. von Braillovo (písmo; Louis Braille)", mirai: "Mirai (Band aus Frýdek-Místek)",
  "o'brienových": "Gen. Pl. von O'Brienovi (irische Gastfamilie)", "assassin's": "Assassin's Creed (Computerspiel)",
  creed: "Assassin's Creed (Computerspiel)", "baldur's": "Baldur's Gate (Computerspiel)", gate: "Baldur's Gate (Computerspiel)",
  stop: "Don't Stop Me Now (Lied von Queen)", me: "Don't Stop Me Now (Lied von Queen)", now: "Don't Stop Me Now (Lied von Queen)",
  gb: "GB (Gigabyte)", hollywood: "Hollywood",
  sparta: "AC Sparta Praha (Fussball)", slavia: "SK Slavia Praha (Fussball)", baníku: "Gen. von Baník Ostrava (Fussball)",
  slovanu: "Gen. von Slovan Liberec (Fussball)", oceláři: "Oceláři Třinec (Eishockey)", junáka: "Gen. von Junák (Pfadfinder)",
  pekař: "Pekař & syn (Name einer Bäckerei)", folk: "Folk & Country (Name eines Abends)", country: "Folk & Country",
  work: "Work and Travel (Programm)", travel: "Work and Travel (Programm)", vlog: "Vlog (Teil eines Videotitels)",
  lucerně: "Lok. von Lucerna (Konzertsaal in Praha)", bakalářích: "Lok. von Bakaláři (Schul-Informationssystem)",
  seznamu: "Lok. von Seznam (tschechisches Portal und Mail)", wikipedii: "Lok. von Wikipedie",
  // Programme, Dienste, Abkürzungen
  excelu: "Lok. von Excel", pythonu: "Lok. von Python", bashi: "Lok. von Bash", linuxu: "Lok. von Linux",
  latexu: "Lok. von LaTeX", markdownu: "Lok. von Markdown", discordu: "Lok. von Discord", instagramu: "Lok. von Instagram",
  messengeru: "Lok. von Messenger", steamu: "Lok. von Steam", html: "HTML", css: "CSS", php: "PHP", sql: "SQL",
  isic: "ISIC (Schülerausweis)", soč: "SOČ (Středoškolská odborná činnost, Schülerforschung)",
  zuš: "ZUŠ (Základní umělecká škola, Musikschule)", am: "AM (Führerscheingruppe für Mopeds)", usa: "USA",
  kč: "Kč (koruna česká)", gymnázium: "Gymnázium Cheb (Name einer Schule)", alt: "Alt (Taste)", altem: "Instr. von Alt (Taste)",
  f: "Taste F", g: "Taste G", v: "Taste V", w: "Taste W", x: "Taste X", i: "I (Stromstärke)", u: "U (Spannung)", r: "R (Widerstand)",
  // Orte, Landschaften, Gewässer, Berge in Tschechien
  prahy: "Gen. von Praha", praze: "Lok. von Praha",
  berouně: "Lok. von Beroun", kolíně: "Lok. von Kolín", sázava: "Sázava (Fluss)", brandýsa: "Gen. von Brandýs nad Labem",
  labem: "Instr. von Labe (nad Labem)", staré: "Stará Boleslav (Gen./Lok.)", boleslavi: "Lok. von Boleslav",
  boleslav: "Mladá Boleslav", písku: "Lok. von Písek", třeboně: "Gen. von Třeboň", rožmberku: "Dat. von Rožmberk (Teich)",
  kvildy: "Gen. von Kvilda", šumavě: "Lok. von Šumava", vltava: "Vltava (Moldau)", táboritech: "Lok. Pl. von Tábor(ité) (Hussiten)",
  plzeň: "Plzeň", plzni: "Lok. von Plzeň", klatovy: "Klatovy", klatovech: "Lok. von Klatovy", domažlicích: "Lok. von Domažlice",
  sokolově: "Lok. von Sokolov", cheb: "Cheb", chebu: "Gen. von Cheb", klínovci: "Lok. von Klínovec", ostrově: "Lok. von Ostrov",
  teplicích: "Lok. von Teplice", chomutově: "Lok. von Chomutov", lounech: "Lok. von Louny", ústí: "Ústí nad Labem",
  liberec: "Liberec", liberce: "Gen. von Liberec", liberci: "Lok. von Liberec",
  ještědu: "Gen. von Ještěd", turnov: "Turnov", hradce: "Gen. von Hradec Králové",
  hradci: "Lok. von Hradec Králové", špindlu: "Lok. von Špindl (Špindlerův Mlýn)", sněžce: "Lok. von Sněžka",
  peci: "Lok. von Pec pod Sněžkou", krkonoše: "Krkonoše (Riesengebirge)", pardubic: "Gen. von Pardubice",
  pardubicích: "Lok. von Pardubice", jihlavě: "Lok. von Jihlava", jihlavy: "Gen. von Jihlava", telči: "Lok. von Telč",
  vysočiny: "Gen. von Vysočina", polné: "Gen. von Polná", brno: "Brno", brna: "Gen. von Brno", brně: "Lok. von Brno",
  vyškova: "Gen. von Vyškov", břeclavi: "Gen. von Břeclav", pernštejn: "Pernštejn (Burg)", lednicko: "Lednicko-valtický areál",
  olomouci: "Lok. von Olomouc", prostějova: "Gen. von Prostějov", zlíně: "Lok. von Zlín", vsetín: "Vsetín",
  vsetíně: "Lok. von Vsetín", kroměříži: "Lok. von Kroměříž", rožnova: "Gen. von Rožnov pod Radhoštěm",
  radhošť: "Radhošť (Berg)", karviné: "Lok. von Karviná", frýdku: "Gen. von Frýdek(-Místek)", místku: "Gen. von (Frýdek-)Místek",
  ostravy: "Gen. von Ostrava", kopřivnici: "Lok. von Kopřivnice", třinec: "Třinec", třincem: "Instr. von Třinec",
  beskydech: "Lok. von Beskydy", česku: "Dat. von Česko", českého: "Český ráj (Gen.)",
  českém: "Český ráj (Lok.)", rakousko: "Rakousko(-Uhersko)", uhersko: "(Rakousko-)Uhersko",
  // Ausland
  berlíně: "Lok. von Berlín", bratislavy: "Gen. von Bratislava", vídni: "Lok. von Vídeň", vídně: "Gen. von Vídeň",
  slovensku: "Lok./Dat. von Slovensko", německu: "Lok. von Německo", rakousku: "Lok. von Rakousko",
  chorvatsku: "Lok. von Chorvatsko", kanadě: "Lok. von Kanada", dublinu: "Lok. von Dublin", finska: "Gen. von Finsko",
  polska: "Gen. von Polsko", portugalska: "Gen. von Portugalsko", kyjiva: "Gen. von Kyjiv", hanoje: "Gen. von Hanoj",
  drážďan: "Gen. von Drážďany (Dresden)", evropě: "Lok. von Evropa (střední Evropa)",
};

/** Die vierzehn Kraje - erkannt an Wortformen der Zeilen (klein). */
const KRAJE: Readonly<Record<string, readonly string[]>> = {
  "Praha": ["lucerně", "prahy", "praze", "sparta", "slavia", "karlův"],
  "Středočeský": ["berouně", "kolíně", "sázava", "brandýsa", "boleslavi", "boleslav"],
  "Jihočeský": ["písku", "třeboně", "rožmberku", "kvildy", "šumavě"],
  "Plzeňský": ["plzni", "plzeň", "klatovy", "klatovech", "domažlicích"],
  "Karlovarský": ["sokolově", "chebu", "cheb", "klínovci", "ostrově"],
  "Ústecký": ["teplicích", "chomutově", "lounech", "ústí"],
  "Liberecký": ["liberci", "liberce", "liberec", "ještědu", "slovanu", "jablonec", "turnov"],
  "Královéhradecký": ["hradci", "hradce", "špindlu", "sněžce", "peci", "krkonoše"],
  "Pardubický": ["pardubicích", "pardubic"],
  "Vysočina": ["jihlavě", "jihlavy", "telči", "vysočiny", "polné"],
  "Jihomoravský": ["brně", "brna", "brno", "vyškova", "břeclavi", "pernštejn", "lednicko"],
  "Olomoucký": ["olomouci", "prostějova"],
  "Zlínský": ["zlínské", "zlíně", "vsetíně", "vsetín", "kroměříži", "rožnova", "radhošť"],
  "Moravskoslezský": ["karviné", "frýdku", "místku", "ostravy", "baníku", "kopřivnici", "třincem", "třinec", "beskydech", "oceláři"],
};
const MAEHREN_SCHLESIEN = ["Jihomoravský", "Olomoucký", "Zlínský", "Moravskoslezský"];
/** Orte im Ausland (klein) - nur dort steht €. */
const AUSLAND: ReadonlySet<string> = new Set([
  "berlíně", "bratislavy", "vídni", "vídně", "slovensku", "německu", "rakousku", "chorvatsku", "kanadě", "usa", "dublinu",
  "finska", "polska", "portugalska", "kyjiva", "hanoje", "drážďan",
]);
/** GEMESSEN am Ende von CS-T8: Obergrenze je Kraj und Mindestzahl Mähren/Schlesien. */
const HOECHSTENS_JE_KRAJ = 10; // gemessen: Moravskoslezský 10, Jihomoravský 9, Zlínský 8, Vysočina 7
const MINDESTENS_JE_KRAJ = 3; // gemessen: Pardubický 3, Plzeňský 4
const MINDESTENS_MAEHREN = 32; // gemessen: 9 + 5 + 8 + 10

function zeilenJeKraj(zeilen: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [kraj, formen] of Object.entries(KRAJE)) {
    out[kraj] = zeilen.filter((z) => kleinWoerter(z).some((w) => formen.includes(w))).length;
  }
  return out;
}
const tschechischerOrt = (z: string): boolean => kleinWoerter(z).some((w) => Object.values(KRAJE).some((f) => f.includes(w)));

/** Wörter eines Werktitels, die gross mitten im Satz stehen, aber auch gewöhnlich vorkommen (darum in `OHNE_TATOEBA_BELEG`). */
const TITELWOERTER: ReadonlySet<string> = new Set(["don't"]); // „Don't Stop Me Now" (Lied)

function unbekannteGrosswoerter(zeile: string): string[] {
  return woerterMitAnfang(zeile)
    .filter((x) => !x.anfang && /^\p{Lu}/u.test(x.w) && !(x.w.toLowerCase() in EIGENNAMEN) && !TITELWOERTER.has(x.w.toLowerCase()))
    .map((x) => x.w);
}

describe("CS-T8: Orte und Namen", () => {
  it("jedes grosse Wort mitten im Satz ist ein Eigenname der Liste", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it(`alle vierzehn Kraje mit mindestens ${MINDESTENS_JE_KRAJ} Zeilen, keiner mehr als ${HOECHSTENS_JE_KRAJ}; Mähren und Schlesien mindestens ${MINDESTENS_MAEHREN}`, () => {
    const je = zeilenJeKraj(ZEILEN);
    expect(Object.entries(je).filter(([, n]) => n < MINDESTENS_JE_KRAJ)).toEqual([]);
    expect(Object.entries(je).filter(([, n]) => n > HOECHSTENS_JE_KRAJ)).toEqual([]);
    expect(MAEHREN_SCHLESIEN.reduce((s, k) => s + je[k], 0)).toBeGreaterThanOrEqual(MINDESTENS_MAEHREN);
  });

  it("€ steht nur in Zeilen über das Ausland - nie mit einem Ort in Tschechien", () => {
    const euro = ZEILEN.filter((z) => z.includes("€"));
    expect(euro.length).toBeGreaterThanOrEqual(6);
    expect(euro.filter(tschechischerOrt)).toEqual([]);
    expect(euro.filter((z) => !kleinWoerter(z).some((w) => AUSLAND.has(w)))).toEqual([]);
  });

  it("Gegenprobe: unbekannte Grosswörter, Bindestrich-Orte, Anführung und Satzanfänge werden richtig gelesen", () => {
    expect(unbekannteGrosswoerter("Ema jede do Atlantidy.")).toEqual(["Atlantidy"]);
    expect(unbekannteGrosswoerter('"Dáš to!" píše Ema.').includes("Dáš")).toBe(false);
    expect(unbekannteGrosswoerter("Prší? Zítra ne.")).toEqual([]);
    expect(unbekannteGrosswoerter("Prší a Zítra ne.")).toEqual(["Zítra"]);
    expect(zeilenJeKraj(["Ema vidí sovu.", "V Brně je hrad."])["Jihomoravský"]).toBe(1);
    expect(["V Brně stojí kebab 5 €."].filter(tschechischerOrt)).toHaveLength(1);
  });
});

// ── Gekürzt serviert: kein grosses Wort mitten im Satz ─────────────────────

/**
 * Für Weg „cs" gibt es keine Frühfassungen. Wird eine Zeile vor ihrer vollen Sprosse gekürzt serviert, fällt mit
 * `! : "` auch die Satzgrenze weg - ein Wort, das danach gross steht, stünde mitten im Satz. Darum steht dort nur ein
 * Name oder ein kleines Wort.
 */
function fruehNahtFehler(zeile: string): string[] {
  const b = ersteSprosse(zeile);
  const v = volleSprosse(zeile);
  if (b === null || v === null) return [];
  const out = new Set<string>();
  for (let n = b; n < v; n++) {
    const s = fitText(zeile, allowedAt(n), "cs");
    if (s !== null) for (const w of unbekannteGrosswoerter(s)) out.add(`${n}:${w}`);
  }
  return [...out];
}

describe("CS-T8: gekürzt serviert - kein Grossbuchstabe mitten im Satz", () => {
  it("jede Zeile, die vor ihrer Sprosse gekürzt kommt, liest sich ohne Grosswort mitten im Satz", () => {
    const fehler = ZEILEN.flatMap((z) => fruehNahtFehler(z).map((f) => `"${z}" @ ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Trenér volá: \"Rychleji!\"“ würde vor „:“ zu „Trenér volá Rychleji“ - „Kdo hraje? Ema a Duc.“ nicht", () => {
    expect(fruehNahtFehler('Trenér volá: "Rychleji!"').length).toBeGreaterThan(0);
    expect(fruehNahtFehler("Pozor! Zítra je test z chemie.").length).toBeGreaterThan(0);
    expect(fruehNahtFehler("Kdo hraje? Ema a Duc.")).toEqual([]);
  });
});

// ── Wortschatz: Wortgrenze, Bewegungsverben, Sperrliste, Belege, Diakritik ──────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste wie CS-T5). */
const FUNKTIONSWOERTER = new Set(
  (
    "a i ani ale nebo s se si k ke v ve na do od o u z ze po pro za nad pod " +
    "je jsou jsem jsme jsi jste to ten ta ty tu tam sem tak jak kde kam jen ne ano jo " +
    "mi mě mně tě ho mu můj moje moji tvůj tvoje náš naše dnes"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(kleinWoerter(z))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** CS-T1 §2/§4: Bewegungsverben (jet, jít) und les - hier GEMESSEN (6 von 317, auch „vyjde“ = kostet), Grenze unten. */
const BEWEGUNG =
  /(^|[\s"(])(ne)?(u|od|do|při|pře|vy|za|s|po)?(jet|jedu|jedeš|jede|jedeme|jedete|jedou|jel|jela|jeli|jely|jít|jdu|jdeš|jde|jdeme|jdete|jdou|jdi|jděte|šel|šla|šli|půjdeme|les|lesa|lese|lesem|lesy|lesů)(?=[\s,.?!:;")]|$)/iu;
const BEWEGUNG_GRENZE = 6; // gemessen 6 (darunter dreimal „vyjde“ = kostet)

describe("CS-T8: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Wortbudget Jugend: kein Inhaltswort in mehr als 8 Zeilen über alle Jugend-Chargen (T2 + T5 + T8 - Falle 45)", () => {
    expect(JUGEND_ANDERE()).toEqual(expect.arrayContaining(T5));
    const fehler = zuHaeufig([...ZEILEN, ...JUGEND_ANDERE()]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (gross, mit Satzzeichen, nach Ziffer), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Kapela" : "Ta 9 kapela"} ${"abcdefghi"[i]}! Je.`);
    expect(zuHaeufig(neun)).toEqual(['"kapela": 9 Zeilen']);
  });

  it(`Bewegungsverben und „les“ sparsam: höchstens ${BEWEGUNG_GRENZE} Zeilen (CS-T1 §4)`, () => {
    const treffer = ZEILEN.filter((z) => BEWEGUNG.test(z));
    expect(treffer.length, treffer.join("\n")).toBeLessThanOrEqual(BEWEGUNG_GRENZE);
  });

  it("Gegenprobe: jede!, Jdeme, \"Půjdeme\" werden erkannt; jezdí, odjíždí, Jednou nicht", () => {
    for (const z of ["Autobus jede!", "Jdeme ven.", '"Půjdeme?" ptá se Ema.']) expect(BEWEGUNG.test(z), z).toBe(true);
    for (const z of ["Tramvaj jezdí k hradu.", "V 6:45 odjíždí autobus.", "Jednou týdně."]) expect(BEWEGUNG.test(z), z).toBe(false);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => kleinWoerter(t).filter((w) => gesperrtCs(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurva (Kern), vole (Wortbasis) gefunden; knihovně, sekundy, přestávky nicht (Falle 93)", () => {
    expect(istKernGesperrtCs("kurva")).toBe(true);
    expect(gesperrtCs("vole")).toBe(true);
    for (const w of ["knihovně", "sekundy", "přestávky", "trapas", "revizoři"]) expect(gesperrtCs(w), w).toBe(false);
  });
});

/**
 * Wörter dieser Charge, die NICHT in `WORDS_CS`, `STUFE_VOCAB_CS` oder `NACHTRAG_CS` (Tatoeba-Formen mit mindestens zwei
 * Belegen) stehen und keine Eigennamen sind - mit Begründung, weil es für Tschechisch kein Wörterbuch gibt (Falle 61).
 * Alle sind gewöhnliche Wörter bzw. regelmässige Formen [G: eigenes Sprachwissen]; sie gehören in die Lese-Abnahme durch
 * eine Person mit Tschechisch als Erstsprache (P7). Über den Korpus kommen sie ins Vorlese-Lexikon.
 */
const OHNE_TATOEBA_BELEG: Readonly<Record<string, string>> = {
  // Schule, Prüfungen, Unterricht
  finále: "Finale (n., unveränderlich)", krajského: "Gen. m. von krajský (Kreis-, Landes-)", přeboru: "Gen. von přebor (Meisterschaft)",
  zeměpisné: "Gen. f. von zeměpisný (Geografie-)",
  olympiády: "Gen. von olympiáda (Schulwettbewerb)", olympiádě: "Lok. von olympiáda",
  opakujeme: "1. Pl. von opakovat (wiederholen)",
  talentovky: "Akk. Pl. von talentovka (Aufnahmeprüfung an Kunst- und Musikschulen, hovorové)", konzervatoř: "Konservatorium (f.)",
  maturanti: "Nom. Pl. von maturant (Abschlussklasse)", maturitou: "Instr. von maturita", maturitu: "Akk. von maturita",
  přijímačkách: "Lok. Pl. von přijímačky (Aufnahmeprüfung)", přijímaček: "Gen. Pl. von přijímačky",
  pětce: "Dat. von pětka (Note 5)", spolužačka: "Mitschülerin (f.)", stužkováku: "Gen. von stužkovák (Bandverleihung der Maturaklasse)",
  deváťáci: "Nom. Pl. von deváťák (Neuntklässler, hovorové)",
  občanky: "Gen. von občanka (Fach Staatsbürgerkunde, hovorové)", přestávkách: "Lok. Pl. von přestávka (Pause)",
  gympl: "Gymnasium (m., hovorové)", průmyslovku: "Akk. von průmyslovka (technische Mittelschule, hovorové)",
  průmyslovce: "Lok. von průmyslovka", dějepise: "Lok. von dějepis (Geschichte)",
  matice: "Lok. von matika (na matice)", okresním: "Lok. n. von okresní (Bezirks-)", recitace: "Gen. von recitace (Rezitation)",
  stupni: "Lok. von stupeň (2. stupeň: Klassen 6-9)", průměrem: "Instr. von průměr (Notendurchschnitt)",
  vyznamenání: "Auszeichnung im Zeugnis (n.)", zdravotce: "Lok. von zdravotka (Gesundheitsschule, hovorové)",
  seminárku: "Akk. von seminárka (Seminararbeit, hovorové)", seminárka: "Seminararbeit (f., hovorové)",
  seminárce: "Lok. von seminárka", zpracovává: "3. Sg. von zpracovávat (bearbeiten)", nultá: "f. von nultý (nultá hodina: Stunde vor der ersten)",
  praktická: "f. von praktický (praktická maturita)", odevzdává: "3. Sg. von odevzdávat (abgeben)",
  opakování: "Wiederholung (n.)", postoupilo: "l-Partizip n. von postoupit (weiterkommen)", stovka: "Feier 100 Tage vor der Matura (f.)",
  bonusové: "Akk. Pl. f. von bonusový (Bonus-)", pochvalu: "Akk. von pochvala (Lob)", termínech: "Lok. Pl. von termín (Termin)",
  přibývá: "3. Sg. von přibývat (hinzukommen)", zlomek: "Bruch (m.)", rovnici: "Akk. von rovnice (Gleichung)",
  řešíme: "1. Pl. von řešit (lösen)", převod: "Umrechnung (m.)", přiřazení: "Zuweisung (n.)", násobení: "Multiplikation (n.)",
  sčítá: "3. Sg. von sčítat (addieren)", maturáku: "Lok. von maturák (Maturaball, hovorové)", lyžáku: "Lok. von lyžák (Skikurs)",
  // Sport
  koupališti: "Lok. von koupaliště (Freibad)", lyžích: "Lok. Pl. von lyže (Ski)", snowboardu: "Lok. von snowboard",
  házenou: "Instr. von házená (Handball)", házenkáři: "Nom. Pl. von házenkář (Handballspieler)", vteřině: "Lok. von vteřina (Sekunde)",
  hala: "Halle (f.)", haly: "Gen. von hala", fanoušci: "Nom. Pl. von fanoušek (Fan)", fanynka: "Fan (f.)", šály: "Akk. Pl. von šála (Schal)",
  derby: "Derby (n., unveränderlich)", florbalisty: "Akk. Pl. von florbalista", florbalu: "Gen. von florbal",
  basket: "Basketball (m., hovorové)", setu: "Lok. von set (Satz im Volleyball)",
  soupeř: "Gegner (m.)", oddechový: "m. von oddechový (oddechový čas: Auszeit)", hokejka: "Eishockeyschläger (f.)",
  hokejová: "f. von hokejový", nájezdech: "Lok. Pl. von nájezd (Penaltyschiessen)",
  plavecký: "m. von plavecký (Schwimm-)", drah: "Gen. Pl. von dráha (Bahn)", půlmaraton: "Halbmarathon (m.)",
  desítku: "Akk. von desítka (10-km-Lauf, hovorové)", srovnali: "l-Partizip Pl. von srovnat (ausgleichen)", minutě: "Lok. von minuta",
  kopané: "Gen. von kopaná (malá kopaná: Kleinfeldfussball)", týmů: "Gen. Pl. von tým",
  šachový: "m. von šachový (Schach-)", kol: "Gen. Pl. von kolo (Runde)", stolního: "Gen. m. von stolní (stolní tenis)",
  závodu: "Gen. von závod (Wettkampf)", lezecké: "Lok. f. von lezecký (lezecká stěna: Kletterwand)", slavili: "l-Partizip Pl. von slavit",
  utkání: "Nom. Pl. von utkání (Spiel)",
  // Musik, Kultur, Netz, Technik
  neskutečný: "m. von neskutečný (unglaublich, hovorové)", majáles: "Studentenfest im Mai (m.)", bubeníka: "Akk. von bubeník (Schlagzeuger)",
  zkušebna: "Proberaum (f.)", basák: "Bassist (m., hovorové)", basa: "Bass (f., hovorové für baskytara)", kapelu: "Akk. von kapela",
  zakládají: "3. Pl. von zakládat (gründen)", orchestru: "Lok. von orchestr", bigband: "Bigband (m.)", vystoupí: "3. Sg. Futur von vystoupit (auftreten)",
  vystupuje: "3. Sg. von vystupovat (auftreten)", promítá: "3. Sg. von promítat (Film zeigen)", stream: "Livestream (m.)",
  youtubera: "Gen. von youtuber", youtuber: "YouTuber (m.)", oblíbeného: "Gen. m. von oblíbený (beliebt)",
  rádia: "Gen. von rádio", žebříčku: "Lok. von žebříček (Hitparade)", redaktory: "Akk. Pl. von redaktor",
  historické: "Akk. Pl. f. von historický",
  "don't": "englisch don't (Beispiel für den Apostroph)", "it's": "englisch it's (Beispiel)",
  its: "englisch its (Beispiel)", apostrofů: "Gen. Pl. von apostrof",
  wifina: "WLAN (f., hovorové)", wi: "wi-fi (WLAN; erstes Glied)", sci: "sci-fi (erstes Glied)", hopové: "Lok. f. von hip-hopový (zweites Glied)",
  kódu: "Lok. von kód (Programmcode)", středník: "Semikolon (m.)", programovat: "programmieren (Inf.)", sečte: "3. Sg. Futur von sečíst (summieren)",
  sloupec: "Spalte (m.)", souboru: "Gen./Lok. von soubor (Datei)",
  proměnné: "Nom. Pl. von proměnná (Variable)", proměnná: "Variable (f.)", píšou: "3. Pl. von psát (hovorové für píší)",
  podtržítkem: "Instr. von podtržítko (Unterstrich)", mezery: "Nom. Pl. von mezera (Leerzeichen)", názvu: "Lok. von název (Name)",
  nahrazuje: "3. Sg. von nahrazovat (ersetzen)", účtem: "Instr. von účet (Konto)", hvězdička: "Sternchen (f.)",
  hvězdičky: "Akk. Pl. von hvězdička", kurzíva: "Kursivschrift (f.)", označuje: "3. Sg. von označovat (kennzeichnen)",
  zapisujeme: "1. Pl. von zapisovat (notieren)", přihlašovací: "Anmelde- (Adj.)",
  srdíčko: "Herzchen (n.)", podmínka: "Bedingung (f.)", pokusů: "Gen. Pl. von pokus (Versuch)", šipky: "Akk. Pl. von šipka",
  shopu: "Lok. von e-shop (zweites Glied)", špičkou: "Instr. von špička (Spitze)", značkou: "Instr. von značka (Tag)",
  řádku: "Gen. von řádek (Zeile)", citaci: "Akk. von citace (Zitat)", tučný: "m. von tučný (fett)", terminálu: "Lok. von terminál",
  výstup: "Ausgabe (m.)", přesměruje: "3. Sg. Futur von přesměrovat (umleiten)", zamkne: "3. Sg. Futur von zamknout (sperren)",
  buňku: "Akk. von buňka (Zelle)", tabulce: "Lok. von tabulka", vzorce: "Akk. Pl. von vzorec (Formel)", znaky: "Akk. Pl. von znak (Zeichen)",
  bio: "Profiltext (n., unveränderlich)", svislítko: "senkrechter Strich (n.)", oddělují: "3. Pl. von oddělovat (trennen)",
  sloupce: "Akk. Pl. von sloupec", svislé: "Nom. Pl. f. von svislý (senkrecht)", čáry: "Nom. Pl. von čára (Strich)",
  sjednocení: "Vereinigung (n.; Mengen)", množin: "Gen. Pl. von množina (Menge)", vyvolá: "3. Sg. Futur von vyvolat (hervorrufen)",
  klávesou: "Instr. von klávesa (Taste)", hlavička: "Kopfzeile (f.)", aktuality: "Nom. Pl. von aktualita (Neuigkeit)",
  upozorní: "3. Sg. Futur von upozornit (benachrichtigen)", označí: "3. Sg. Futur von označit (markieren)",
  přidává: "3. Sg. von přidávat (hinzufügen)", loga: "Gen. von logo",
  nehotový: "m. von nehotový (unerledigt)", čísly: "Instr. Pl. von číslo", hranatých: "Lok. Pl. von hranatý (eckig)",
  závorkách: "Lok. Pl. von závorka (Klammer)",
  spojí: "3. Sg. Futur von spojit (verbinden)", adrese: "Lok. von adresa", předvolba: "Vorwahl (f.)",
  hmatové: "Nom. Pl. f. von hmatový (tastbar)",
  // Alltag, Freizeit, Brigáda, Ehrenamt
  trapas: "Peinlichkeit (m., hovorové)", revizoři: "Nom. Pl. von revizor (Fahrkartenkontrolleur)", pořádná: "f. von pořádný (ordentlich)",
  šílí: "3. Sg. von šílet (ausflippen)", útulek: "Tierheim (m.)", kapitánka: "Kapitänin (f.)", povzbuzuje: "3. Sg. von povzbuzovat (ermutigen)",
  brigáda: "Ferien- oder Nebenjob (f.)", brigády: "Gen. von brigáda",
  helmy: "Gen. von helma (Helm)", nesedej: "Imperativ Sg. von nesedat (sich nicht setzen)",
  svačiny: "Gen. von svačina (Jause)",
  kánoe: "Kanu (f.)", stany: "Nom. Pl. von stan (Zelt)", ankety: "Gen. von anketa (Umfrage)", letošního: "Gen. m. von letošní (diesjährig)",
  sítích: "Lok. Pl. von síť (sociální sítě)", spacák: "Schlafsack (m., hovorové)", baterka: "Taschenlampe (f.)",
  ešus: "Kochgeschirr (m.)", repelent: "Mückenschutz (m.)", sýrem: "Instr. von sýr", ráje: "Gen. von ráj (Český ráj)",
  ráji: "Lok. von ráj", přesouvá: "3. Sg. von přesouvat (verlegen)", mapy: "Gen./Nom. Pl. von mapa", zásadně: "grundsätzlich (Adv.)",
  odpočinku: "Dat. von odpočinek (Erholung)", bezvětří: "Windstille (n.)", výměně: "Lok. von výměna (Austausch)",
  výměnný: "m. von výměnný (výměnný pobyt: Austausch)", výměnném: "Lok. m. von výměnný", slovenská: "f. von slovenský (česko-slovenská)",
  půjčuje: "3. Sg. von půjčovat (verleihen)", valtický: "m. von valtický (zu Valtice)",
  areál: "Areal (m.)", soutěži: "Lok. von soutěž (Wettbewerb)", soutěže: "Gen. von soutěž", sedmák: "Siebtklässler (m., hovorové)",
  výstaviště: "Messegelände (n.)", deskovky: "Nom. Pl. von deskovka (Brettspiel, hovorové)",
  přihlásili: "l-Partizip Pl. von přihlásit se",
  odvážných: "Gen. Pl. von odvážný (mutig)", skále: "Lok. von skála (Fels)",
  mladšími: "Instr. Pl. von mladší (jünger)", vyráží: "3. Sg. von vyrážet (aufbrechen)",
  kolona: "Stau (f.)", koláčků: "Gen. Pl. von koláček (mährisches Gebäck)", skútr: "Motorroller (m.)", skútru: "Lok. von skútr",
  podkrovní: "Dachgeschoss- (Adj.)", morče: "Meerschweinchen (n.)", zlínské: "n. von zlínský", čísle: "Lok. von číslo",
  nonstop: "rund um die Uhr (Adv.)", autoškole: "Lok. von autoškola", pekárny: "Gen. von pekárna", vznikla: "l-Partizip f. von vzniknout",
  dobrovolných: "Gen. Pl. von dobrovolný (sbor dobrovolných hasičů: freiwillige Feuerwehr)", hasičů: "Gen. Pl. von hasič",
  darovat: "spenden (Inf.)", vbíhá: "3. Sg. von vbíhat (hineinrennen)", vybírá: "3. Sg. von vybírat (einsammeln)", korun: "Gen. Pl. von koruna",
  korunách: "Lok. Pl. von koruna", stovek: "Gen. Pl. von stovka (Hunderter)", kraje: "Gen. von kraj (Region)", oddílu: "Gen. von oddíl (Gruppe)",
  kinem: "Instr. von kino", mikiny: "Akk. Pl. von mikina (Kapuzenpulli)", kakaa: "Gen. von kakao",
  víkendovou: "Akk. f. von víkendový (Wochenend-)", příplatek: "Zuschlag (m.)", roztok: "Lösung (m.; Chemie)",
  nejvýš: "höchstens (Adv.)", provozem: "Instr. von provoz (Betrieb)", spoleh: "Verlass (m.)", pětatřicet: "fünfunddreissig",
  pizzerii: "Akk. von pizzerie", mapách: "Lok. Pl. von mapa (na mapách: Kartendienst)", klub: "Klub (m.)", výletu: "Gen. von výlet",
  pizze: "Lok. von pizza", radaru: "Lok. von radar", červeně: "rot (Adv.)",
  permanentka: "Saisonkarte (f.)", vlek: "Skilift (m.)", kebab: "Kebab (m.)", kapesné: "Taschengeld (n.)", eurech: "Lok. Pl. von euro",
  letáku: "Lok. von leták (Prospekt)", dvouhodinovka: "Doppelstunde (f., hovorové)", víkendy: "Akk. Pl. von víkend",
  prezentaci: "Akk. von prezentace (Präsentation)", brankářka: "Torhüterin (f.)", čajovně: "Lok. von čajovna (Teestube)",
  tarif: "Mobilfunktarif (m.)",
};

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat(), ...NACHTRAG_CS].map((w) => w.toLowerCase()),
);
/**
 * ★ Neu in CS-T8: Wörter, die eine ANDERE cs-Charge schon trägt, sind dort von ihrem eigenen Wächter belegt (jede Charge
 * verlangt für jedes Wort Wortschatz, Tatoeba-Form oder eine begründete Liste) - hier nicht noch einmal. Gezählt aus der
 * ROHEN Sammelliste ohne diese Charge (nach Objekt), mit derselben Wortzerlegung.
 */
const ANDERE_CS_WOERTER = (): ReadonlySet<string> => new Set(ANDERE_CS_ZEILEN().flatMap(kleinWoerter));

/** Wörter (ab zwei Buchstaben), die weder vorher bekannt waren noch begründet in einer der zwei Listen stehen. */
function ungeprueft(zeilen: string[]): string[] {
  const andere = ANDERE_CS_WOERTER();
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of kleinWoerter(z)) {
      if (w.length >= 2 && !VORHER_BEKANNT.has(w) && !andere.has(w) && !(w in OHNE_TATOEBA_BELEG) && !(w in EIGENNAMEN)) out.add(w);
    }
  }
  return [...out];
}

/** Der kuratierte Wortschatz (von Hand gelesen) - gegen ihn prüft die Diakritik-Falle. */
const KURATIERT: ReadonlySet<string> = new Set([...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat()].map((w) => w.toLowerCase()));
const AKZENT_VARIANTEN: Readonly<Record<string, readonly string[]>> = {
  a: ["á"], e: ["é", "ě"], i: ["í"], o: ["ó"], u: ["ú", "ů"], y: ["ý"], c: ["č"], s: ["š"], r: ["ř"], z: ["ž"],
  d: ["ď"], t: ["ť"], n: ["ň"],
};

/** Die Diakritik-Falle (CS-T1): ein Wort ausserhalb des Wortschatzes, dessen Form MIT Haken oder Strich dort steht. */
function diakritikVerdacht(zeilen: string[]): string[] {
  const out: string[] = [];
  for (const w of new Set(zeilen.flatMap(kleinWoerter))) {
    if (KURATIERT.has(w) || w in EIGENNAMEN) continue;
    let formen = [""];
    for (const ch of w) formen = formen.flatMap((f) => [ch, ...(AKZENT_VARIANTEN[ch] ?? [])].map((x) => f + x));
    const treffer = formen.filter((v) => v !== w && KURATIERT.has(v));
    if (treffer.length > 0) out.push(`${w} (gemeint ${treffer.join("/")}?)`);
  }
  return out;
}
/** Diakritik-Verdachtsfälle, die gelesen sind und richtig bleiben (Befund §4). Eine NEUE muss hier eingetragen werden. */
const DIAKRITIK_GELESEN: ReadonlySet<string> = new Set([
  "stěně", // „na lezecké stěně" (Kletterwand), nicht „štěně" (Welpe) - gelesen
]);

/** Die Stimme liest Leerzeichen-Wörter (das Fach `cs` streicht Bindestrich und Apostroph); technische liest sie als Zeichen. */
const stimmWoerter = (zeile: string): string[] =>
  zeile
    .split(/\s+/)
    .map((roh) => roh.replace(/^["('[]+|[.,!?:;")'\]]+$/g, ""))
    .filter((w) => w.length >= 2 && !TECHNISCH.test(w));

describe("CS-T8: Belege, Stimme, Diakritik", () => {
  it("jedes Wort stand schon im Wortschatz oder in den Tatoeba-Formen - oder steht begründet in einer der zwei Listen", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    const benutzt = new Set(ZEILEN.flatMap(kleinWoerter));
    // ★ CS-T9 (09.10.2026): „überflüssig" nur gegen die Chargen VOR dieser in der rohen Liste - eine spätere Charge (CS-T9
    // nutzt it's, don't, sloupec …) darf einen hier geführten Beleg nicht überflüssig machen; sie streicht ihn bei sich.
    const ab = CS_ROH.indexOf(CHARGE[0]);
    const andere = new Set(CS_ROH.slice(0, ab).map((i) => i.text).flatMap(kleinWoerter));
    const ueberfluessig = [...Object.keys(OHNE_TATOEBA_BELEG), ...Object.keys(EIGENNAMEN)].filter(
      (w) => !benutzt.has(w) || ((VORHER_BEKANNT.has(w) || andere.has(w)) && w in OHNE_TATOEBA_BELEG),
    );
    expect(ueberfluessig).toEqual([]);
    expect(Object.keys(OHNE_TATOEBA_BELEG).filter((w) => w in EIGENNAMEN)).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine falsche Endung werden gemeldet - eine Adresse und eine Formel nicht", () => {
    expect(ungeprueft(["Ema má florbalx!", "Dva brigádové.", "Piš na jmeno@seznam.cz a =SUMA(B2:B9)."])).toEqual([
      "florbalx",
      "brigádové",
    ]);
    // Ein Wort, das nur eine andere cs-Charge trägt (CS-T5: „přijímačky"), gilt als dort belegt.
    expect(ANDERE_CS_WOERTER().has("přijímačky")).toBe(true);
    expect(VORHER_BEKANNT.has("přijímačky")).toBe(false);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) => stimmWoerter(z).some((w) => !isRealWord(w, "cs")));
    expect(buchstabiert).toEqual([]);
    expect(stimmWoerter('Frýdek-Místek, "koule" a 2:1.')).toEqual(["Frýdek-Místek", "koule"]);
  });

  it("kein Wort ohne den Haken oder Strich, den es braucht (Diakritik-Falle) - ausser den gelesenen", () => {
    expect(diakritikVerdacht(ZEILEN).filter((v) => !DIAKRITIK_GELESEN.has(v.split(" ")[0]))).toEqual([]);
    expect([...DIAKRITIK_GELESEN].filter((w) => !diakritikVerdacht(ZEILEN).some((v) => v.startsWith(`${w} `)))).toEqual([]);
  });

  it("Gegenprobe: „Mam hlad!“ und „Muze to byt.“ werden gemeldet, „Mám hlad!“ nicht", () => {
    expect(diakritikVerdacht(["Mam hlad!"]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["Muze to byt."]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["Mám hlad!"])).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich ─────────────────────────────

const ohneZeichen = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
const wortMenge = (t: string) => new Set(ohneZeichen(t).split(" ").filter(Boolean));
function jaccard(a: Set<string>, b: Set<string>): number {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s);
}

/** Geschlecht und Zahl gleichgesetzt (wie CS-T1/T2/T5), auf der Fassung ohne Satzzeichen und klein. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", ony: "PRO" };
  return ohneZeichen(zeile)
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/(ou|em|ům|ech|[aeiouyáéíýěů])$/u, ""))
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

function fastGleichEigen(zeilen: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < zeilen.length; i++) {
    for (let j = i + 1; j < zeilen.length; j++) {
      if (jaccard(wortMenge(zeilen[i]), wortMenge(zeilen[j])) >= 0.5) out.push(`"${zeilen[i]}" ~ "${zeilen[j]}"`);
    }
  }
  return out;
}

/**
 * Die Schwester-Charge CS-T7 (Kinder, dieselben Sprossen 45-78) entstand parallel auf `cs-t7-kids-ende` und liegt auf der
 * Basis dieses Zweigs noch nicht. Sobald sie gemergt ist, liefert der Glob sie - dann gilt gegen sie schon Jaccard ≥ 0,4
 * (Falle 51, Lehre PL-T8: dieselben Zeichen verleiten zu denselben Sätzen). Beim Bau gegen ihren Commit `88f9fcac` gemessen: höchstens 0,38.
 */
const T7_MODUL = import.meta.glob("../src/lib/typing/corpusCsWegEndeKids.ts", { eager: true }) as Record<
  string,
  Record<string, unknown>
>;
const T7_ZEILEN = (): string[] =>
  Object.values(T7_MODUL).flatMap((m) =>
    Object.values(m).flatMap((v) => (Array.isArray(v) ? v.map((i) => (i as { text: string }).text) : [])),
  );

/** Nähe 0,5 bis unter 0,6 zu anderen cs-Zeilen: gelesen (Befund §4). Eine NEUE Nähe muss hier eingetragen werden. */
const NAH_AN_ANDEREN_CS: Readonly<Record<string, string>> = {};

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
const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR];
/** Alles, was sonst Text trägt: alle Korpora (cs ROH), alle Serien aller Sprachen, alle Prüfungstext-Banken - Zeile UND Satz. */
function alleFremdenZeilen(): string[] {
  const roh = [
    ...FREMDE_KORPORA().map((i) => i.text),
    ...ANDERE_CS_ZEILEN(),
    ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ...bankZeilen(),
  ];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}

describe("CS-T8: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("die Vergleichsmenge ist voll (rohe cs-Liste mit T1 bis T6, Serien und Banken geladen)", () => {
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(T1));
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(T5));
    for (const stufe of ["kids", "teens", "erwachsen"] as const) expect(ANDERE_CS().some((i) => i.stufen.includes(stufe)), stufe).toBe(true);
    expect(ANDERE_CS()).toEqual(expect.arrayContaining(CORPUS_CS_WEG_MITTE_ERWACHSENE)); // CS-T6
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    for (const k of [CORPUS_IT, CORPUS_PL, CORPUS_TR]) expect(k.length).toBeGreaterThan(0);
  });

  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der Háček und Čárka nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer fremden Zeile, einer anderen cs-Zeile oder einem Satz (ohne Satzzeichen, klein) - auch nicht im Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(ZEILEN.filter((t) => texte.has(ohneZeichen(t)) || schluessel.has(bausteinKey("satz", t)))).toEqual([]);
  });

  it("Gegenprobe: eine T1-Zeile gross mit Ausrufezeichen, eine Serienzeile und ein Banken-Satz werden erkannt", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(texte.has(ohneZeichen("Jedeme lesem!"))).toBe(true);
    expect(schluessel.has(bausteinKey("satz", "Dal sál!"))).toBe(true); // T1 „dal sůl": ů und á werden Trenner
    expect(texte.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(texte.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
  });

  it("keine Paare in der Charge und keines mit einer anderen cs-Zeile (nur Geschlecht oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_CS_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: vyhrál/vyhrála, on/ona und eine T1-Zeile mit getauschtem Geschlecht werden als Paar erkannt", () => {
    expect(paare(["Šimon vyhrál krajské kolo!", "Šimon vyhrála krajské kolo!"])).toHaveLength(1);
    expect(paare(["On hraje 2:1.", "Ona hraje 2:1."])).toHaveLength(1);
    expect(paare(["Jedla med!"], T1)).toHaveLength(1);
    expect(paare(["Ema vidí sovu."], T1)).toEqual([]);
  });

  it("innerhalb der Charge nichts fast gleich (die Hälfte der Wörter geteilt)", () => {
    const fehler = fastGleichEigen(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich gegen fremde Zeilen und andere cs-Zeilen (Wortmenge, Jaccard ≥ 0,6)", () => {
    const fremd = alleFremdenZeilen().map((t) => [t, wortMenge(t)] as const);
    const fehler: string[] = [];
    for (const z of ZEILEN) {
      const m = wortMenge(z);
      for (const [t, f] of fremd) if (jaccard(m, f) >= 0.6) fehler.push(`"${z}" ~ "${t}"`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Nähe zu anderen cs-Zeilen (Jaccard 0,5 bis unter 0,6) ist genau die gelesene Liste", () => {
    const nah: Record<string, string> = {};
    for (const z of ZEILEN) {
      for (const t of ANDERE_CS_ZEILEN()) {
        const j = jaccard(wortMenge(z), wortMenge(t));
        if (j >= 0.5 && j < 0.6) nah[z] = t;
      }
    }
    expect(nah).toEqual(NAH_AN_ANDEREN_CS);
  });

  it("gegen die Schwester-Charge CS-T7 (Kinder, Ende) nichts ab Jaccard 0,4 - sobald sie im Baum liegt", () => {
    const t7 = T7_ZEILEN();
    if (t7.length > 0) expect(t7.length).toBeGreaterThan(250);
    const fehler: string[] = [];
    for (const z of ZEILEN) for (const t of t7) if (jaccard(wortMenge(z), wortMenge(t)) >= 0.4) fehler.push(`"${z}" ~ "${t}"`);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Jaccard rechnet richtig, ein Fast-Duplikat in der Charge wird gefunden", () => {
    expect(jaccard(wortMenge("Dnes je pondělí!"), wortMenge("dnes je neděle"))).toBe(0.5);
    expect(jaccard(wortMenge("Na stole je bábovka!"), wortMenge("na stole je atlas"))).toBeGreaterThanOrEqual(0.6);
    expect(fastGleichEigen(["V bufetu je 20% sleva na bagety.", "V bufetu je 30% sleva na bagety."])).toHaveLength(1);
  });
});

// ── Anker und Auslieferung ────────────────────────────────────────────────

describe("CS-T8: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als Block HINTER CS-T6, die geladene und korpusFuer(\"cs\") jede Zeile", () => {
    const ab = CS_ROH.indexOf(CHARGE[0]);
    expect(ab).toBeGreaterThan(CS_ROH.indexOf(CORPUS_CS_WEG_MITTE_ERWACHSENE[CORPUS_CS_WEG_MITTE_ERWACHSENE.length - 1]));
    expect(CS_ROH.slice(ab, ab + CHARGE.length)).toEqual(CHARGE);
    const geladen = new Set(CS_GELADEN.map((i) => i.text));
    const fuer = new Set(korpusFuer("cs").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t) || !fuer.has(t))).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung mit einer Zeile irgendeines Korpus)", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_CS()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    expect(new Set(CHARGE.map((i) => bausteinId(i.kind, i.text))).size).toBe(CHARGE.length);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr), eine gross geschriebene T1-Zeile nicht", () => {
    const alle = [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CS_GELADEN];
    const probe = { text: "Zzz probe cs t8!", kind: "satz" as const, stufen: ["teens" as const] };
    expect(manifestFor([...alle, probe]).ids.length).toBe(KORPUS_ANKER.length + 1);
    const kopie = { text: "Jedeme lesem!", kind: "satz" as const, stufen: ["teens" as const], nurWeg: "cs" as const };
    expect(manifestFor([...alle, kopie]).ids.length).toBe(KORPUS_ANKER.length);
  });

  for (const l of TASTATUREN) {
    it(`${l}: am Ende des Lernwegs bekommen Jugendliche jede Zeile vollständig - Kinder und Erwachsene keine`, () => {
      const alles = allowedAt(ordnung(l).length, l);
      const geliefert = new Set(corpusItemsFor({ stufe: "teens", allowed: alles, lang: "cs", lernweg: "cs" }));
      expect(ZEILEN.filter((t) => !geliefert.has(t))).toEqual([]);
      for (const stufe of ["kids", "erwachsen"] as const) {
        const andere = new Set(corpusItemsFor({ stufe, allowed: alles, lang: "cs", lernweg: "cs" }));
        expect(ZEILEN.filter((t) => andere.has(t)), stufe).toEqual([]);
      }
    });

    it(`${l}: vor í kommt keine dieser Zeilen; an ¨ kommen sie nur gekürzt (nur Buchstaben und . , ?)`, () => {
      const vorI = allowedAt(sprosseVon("í", l) - 1, l);
      expect(ZEILEN.filter((t) => fitText(t, vorI, "cs") !== null)).toEqual([]);
      const anU = allowedAt(sprosseVon("¨", l), l);
      const geliefert = corpusItemsFor({ stufe: "teens", allowed: anU, lang: "cs", lernweg: "cs" });
      expect(geliefert.filter((t) => /[^\p{L} .,?]/u.test(t))).toEqual([]);
      const gekuerzt = ZEILEN.map((z) => fitText(z, anU, "cs")).filter((s): s is string => s !== null);
      expect(gekuerzt.length).toBeGreaterThan(60);
      expect(geliefert.some((t) => gekuerzt.includes(t))).toBe(true);
    });
  }

  it("Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const de = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
