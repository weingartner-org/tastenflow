/**
 * ★★★ Wächter CS-T9 (09.10.2026): die tschechischen Erwachsenentexte am Ende des Lernwegs
 * (`corpusCsWegEndeErwachsene.ts`, Sprossen 45-78 auf `cs` UND `cs-qwerty` = `!` bis `]`).
 * Vorbilder: `tastenflow-texte-cs-kids-ende.test.ts` (CS-T7, gleiche Sprossen), `tastenflow-texte-cs-erwachsene-mitte.test.ts`
 * (CS-T6: D-2, Ehe-Rolle, Wortbudget Erwachsene) und - nur als Form - `tastenflow-texte-pl-erwachsene-ende.test.ts` (PL-T9:
 * Feiertage, E-Mail nur `.example`); Befund `BEFUND-2026-10-09-CS-T9-ERWACHSENE-ENDE.md`, Leitfaden Fallen 26/31/37/45/51/58/61/76/92-100.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, an dem `fitText` sie UNGEKÜRZT liefert
 * (`introOrder("cs").slice(0, n)`). `! " : ; - ( )` sind auf Weg „cs" weglassbar - vor ihrer Sprosse kommt
 * die Zeile gekürzt an; darum trägt jede Zeile einen Buchstaben ab `í` (22) oder ein hartes Zeichen, und keine
 * gekürzte Fassung hat ein grosses Wort mitten im Satz (Weg „cs" hat keine Frühfassungen, `scripts/_fruehfassung.mts`
 * kennt nur de/fr/es - darum dieselbe Regel wie PL-T7, die gemeinsame Datei bleibt unberührt).
 * `'`, die Ziffern (auf cs nur mit Umschalt, F3-cs) und die Zeichen ab `%` sind hart.
 * Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
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
import { CORPUS_CS_WEG_MITTE_KIDS } from "../src/lib/typing/corpusCsWegMitteKids";
import { CORPUS_CS_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusCsWegMitteErwachsene";
import { CORPUS_CS_WEG_ENDE_KIDS } from "../src/lib/typing/corpusCsWegEndeKids";
import { CORPUS_CS_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusCsWegFruehErwachsene";
import { CORPUS_CS_WEG_ENDE_TEENS } from "../src/lib/typing/corpusCsWegEndeTeens";
import { CORPUS_CS_WEG_ENDE_ERWACHSENE } from "../src/lib/typing/corpusCsWegEndeErwachsene";
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
const CHARGE = CORPUS_CS_WEG_ENDE_ERWACHSENE;
const ZEILEN = CHARGE.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Alle ANDEREN cs-Zeilen aus der ROHEN Sammelliste (nach Objekt; die geladene hätte Kopien schon verschmolzen). */
const ANDERE_CS = () => CS_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_CS_ZEILEN = (): string[] => ANDERE_CS().map((i) => i.text);
/** Die anderen Erwachsenen-Chargen (Wortbudget Erwachsene über T3 + T6 + T9 - Falle 45, CS-T6 §6). */
const ERWACHSENE_ANDERE = (): string[] => ANDERE_CS().filter((i) => i.stufen.includes("erwachsen")).map((i) => i.text);
const T3 = CORPUS_CS_WEG_FRUEH_ERWACHSENE.map((i) => i.text);
const T7 = CORPUS_CS_WEG_ENDE_KIDS.map((i) => i.text);
const T8 = CORPUS_CS_WEG_ENDE_TEENS.map((i) => i.text);
const T1 = CORPUS_CS_WEG_FRUEH_KIDS.map((i) => i.text);

// ── Sprossen ────────────────────────────────────────────────────────────────

const ordnung = (layout: LayoutId = "cs"): string[] => {
  setLayout(layout);
  return introOrder("cs");
};
const allowedCache = new Map<string, Set<string>>();
function allowedAt(n: number, layout: LayoutId = "cs"): Set<string> {
  const k = `${layout}:${n}`;
  let s = allowedCache.get(k);
  if (!s) {
    s = allowedFromIntroduced(ordnung(layout).slice(0, n), "cs");
    allowedCache.set(k, s);
  }
  setLayout(layout);
  return s;
}
const sprosseVon = (einheit: string): number => ordnung().indexOf(einheit) + 1;
const norm = (t: string) => t.replace(/\s+/g, " ").trim();

/** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
const volleCache = new Map<string, number | null>();
function volleSprosse(text: string, layout: LayoutId = "cs"): number | null {
  const k = `${layout}:${text}`;
  if (volleCache.has(k)) return volleCache.get(k)!;
  const n0 = ordnung(layout).length;
  let erg: number | null = null;
  for (let n = 1; n <= n0; n++) if (fitText(text, allowedAt(n, layout), "cs") === norm(text)) { erg = n; break; }
  volleCache.set(k, erg);
  return erg;
}
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

describe("CS-T9: jede Zeile an ihrer Sprosse (cs und cs-qwerty)", () => {
  it("die Folge nach ¨ auf beiden Tastaturen: ! \" : ; ' - ( ) 1-9 0 % / + = _ * & < > $ | @ # € [ ] (45-78)", () => {
    for (const l of TASTATUREN) {
      const o = ordnung(l);
      expect(o.indexOf("¨") + 1, l).toBe(44);
      expect(o.length, l).toBe(78);
      expect(o.slice(44).join(" "), l).toBe("! \" : ; ' - ( ) 1 2 3 4 5 6 7 8 9 0 % / + = _ * & < > $ | @ # € [ ]");
    }
  });

  it("jede Zeile erscheint vollständig NACH ¨, kommt nie vor í (22) überhaupt an, und minTier stimmt", () => {
    const fehler: string[] = [];
    for (const item of CHARGE) {
      const v = volleSprosse(item.text);
      const e = ersteSprosse(item.text);
      if (v === null || v <= 44) fehler.push(`"${item.text}": volle Sprosse ${v}`);
      if (e === null || e < 22) fehler.push(`"${item.text}": schon an Sprosse ${e} serviert (vor í)`);
      const tier = minTierFor(item.text, "cs");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.slice(0, 12).join("\n")).toEqual([]);
  });

  it("jede Zeile hat auf cs-qwerty dieselbe volle und erste Sprosse wie auf cs", () => {
    const fehler = ZEILEN.filter(
      (t) => volleSprosse(t, "cs") !== volleSprosse(t, "cs-qwerty") || ersteSprosse(t, "cs") !== ersteSprosse(t, "cs-qwerty"),
    );
    expect(fehler).toEqual([]);
  });

  it("die Datei ist nach Sprosse sortiert", () => {
    const s = ZEILEN.map((t) => volleSprosse(t) ?? 0);
    expect(s.every((x, i) => i === 0 || s[i - 1] <= x)).toBe(true);
  });

  it("Gegenprobe: Sprossen und Einheiten werden richtig gerechnet", () => {
    expect(volleEinheit("Hurá, prázdniny!")).toBe("!");
    expect(ersteSprosse("Teta Ema je doma!")!).toBeLessThan(22); // ohne Buchstaben ab í: viel zu früh
    expect(volleEinheit('"Pojď," volá Ema.')).toBe('"');
    expect(volleEinheit("Kocour (šedý) spí.")).toBe(")");
    expect(volleEinheit("Jméno d'Artagnan.")).toBe("'");
    expect(ersteSprosse("Jméno d'Artagnan.")).toBe(sprosseVon("'")); // der Apostroph ist hart
    expect(volleEinheit("Je mi 12 let.")).toBe("2");
    expect(volleEinheit("V 7:15 odchází.")).toBe("7");
    expect(volleEinheit("V 8:00 začíná škola.")).toBe("0");
    expect(volleEinheit("Je to 1,5 litru.")).toBe("5");
    expect(volleEinheit("Platíme 2 €.")).toBe("€");
    expect(volleEinheit("Poznámka [1] je dole.")).toBe("]");
    // Vor 50 wird der Bindestrich zur Lücke: „Frýdek Místek" (ein Ort, zwei grosse Wörter - erlaubt).
    expect(fitText("Frýdek-Místek leží pod Beskydami.", allowedAt(44), "cs")).toBe("Frýdek Místek leží pod Beskydami.");
  });

  /**
   * GEMESSEN am Ende von CS-T9 (vom Code gezählt, Einheit der vollen Sprosse) - darf künftig nur STEIGEN, nie unter 6.
   * `(` und `[` haben keine eigenen Zeilen.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "!": 32, '"': 16, ":": 18, ";": 8, "'": 6, "-": 16, ")": 13,
    "1": 10, "2": 11, "3": 10, "4": 10, "5": 11, "6": 10, "7": 10, "8": 10, "9": 11, "0": 14,
    "%": 7, "/": 8, "+": 7, "=": 6, _: 7, "*": 6, "&": 7, "<": 6, ">": 6, $: 6, "|": 6, "@": 7, "#": 6, "€": 7, "]": 6,
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

describe("CS-T9: jede Zeile übt die Einheit ihrer Sprosse (W6, Falle 37)", () => {
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

  it("Gegenprobe: ein Ausruf ohne ! gehört nicht zur Sprosse von !", () => {
    expect(volleEinheit("Hurá, prázdniny.")).not.toBe("!");
  });

  it("in echten Runden (Erwachsene) kommen an der Sprosse von ! Ausrufe dieser Charge an (Fokus !)", () => {
    const intro = ordnung().slice(0, sprosseVon("!"));
    const echt = Math.random;
    let s = 4509;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["!"], stufe: "erwachsen", lang: "cs", lernweg: "cs", count: 12 })) {
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

describe("CS-T9: Klammern und Anführungszeichen nie halb", () => {
  it("jede Zeile schliesst, was sie öffnet", () => {
    const fehler = ZEILEN.flatMap((t) => paarFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: halbe Paare werden gefunden; fitText serviert eine Klammer nie halb", () => {
    expect(paarFehler("Kocour (šedý spí.")).toHaveLength(1);
    expect(paarFehler('Volá "pojď.')).toHaveLength(1);
    expect(paarFehler("Seznam [1, 2.")).toHaveLength(1);
    expect(paarFehler('"Pojď!" volá Ema (tiše).')).toEqual([]);
    const nurAuf = new Set([...allowedAt(sprosseVon("(") - 1), "("]);
    expect(fitText("Kocour (šedý) spí.", nurAuf, "cs")).toBeNull();
  });
});

// ── Form und Zahlen ─────────────────────────────────────────────────────────

/** Form-Verstösse einer Zeile (Satzanfang, Satzschluss, Leerzeichen; die Zeichen prüft `zeilenFehler`). */
function formFehler(t: string): string[] {
  const f: string[] = [];
  if (/ {2}/.test(t) || t !== t.trim()) f.push("Leerzeichen");
  if (!/^"?\p{Lu}/u.test(t)) f.push("beginnt nicht mit einem Grossbuchstaben");
  if (!/[.!?]"?$/.test(t) && !/[.!?][)\]]$/.test(t) && !/[.][)]$/.test(t)) f.push("kein Satzschluss am Ende");
  // Klammern, die ein Zeichen erwähnen („[ ]", „[ a ]"), sind Gegenstand, kein Satzzeichen.
  const u = t.replace(/\[ ?\S? ?\]/g, "X");
  if (/ [.,:;?!](?=\s|$)/.test(u) || / [)\]]/.test(u)) f.push("Leerzeichen vor Satzzeichen");
  if (/[([] /.test(u)) f.push("Leerzeichen nach öffnender Klammer");
  if (/,[^ "]/.test(t.replace(/\d,\d/g, "0"))) f.push("kein Leerzeichen nach Komma (Dezimalkomma 1,5 ausgenommen)");
  return f;
}

/**
 * Zahlformat (Glossar §1 Nr. 5, §4 Falle 4 und 5): Dezimalkomma (1,5), Tausender mit Leerzeichen (1 603), vierstellig
 * ohne Trenner nur als Jahreszahl, Prozent als Adjektiv ohne Leerzeichen (70% čokoláda), Währung NACH der Zahl mit
 * Leerzeichen (35 Kč, 2 €, 3 $), Uhrzeit 7:30 (Minuten zweistellig), NIE eine Zahl mit Punkt am Satzende
 * (Ordnungszahl für die Sprachausgabe), „ve" vor 2, 3, 4, 12-14, 20-29, „ze" vor 2, 3, 4, 6, 7, 12-14, 16, 17, 20-49.
 */
function zahlFehler(roh: string): string[] {
  // Ein fester Bezug in Excel ($A$1) ist kein Geldbetrag.
  const t = roh.replace(/\$[A-Z]+\$\d+/g, "X");
  const f: string[] = [];
  if (/\d %/.test(t)) f.push("Leerzeichen vor % (in einer Übungszeile nur die Adjektivform 70% čokoláda)");
  if (/\d(Kč|€|\$)|[€$] ?\d/.test(t)) f.push("Währung nicht als „35 Kč“ / „2 €“");
  if (/\d\.\d/.test(t)) f.push("Dezimal- oder Tausenderpunkt");
  if (/\d\.["')\]]?$/.test(t) || /\d\.["')\]]? \p{Lu}/u.test(t.replace(/\d\. [AB] /g, "X "))) f.push("Zahl mit Punkt am Satzende");
  for (const m of t.matchAll(/\d{5,}/g)) f.push(`Zahl ${m[0]} ohne Leerzeichen-Trenner`);
  for (const m of t.matchAll(/(?<!\d)\d{4}(?!\d)/g)) if (!/^(19|20)\d\d$/.test(m[0])) f.push(`vierstellig ${m[0]} ohne Trenner`);
  for (const m of t.matchAll(/\b(\d{1,2}):(\d+)\b/g)) {
    if (/\b(v|ve|od|do)$/i.test(t.slice(0, m.index).trim()) && (m[2].length !== 2 || Number(m[1]) > 23 || Number(m[2]) > 59)) {
      f.push(`Uhrzeit ${m[0]}`);
    }
  }
  if (/(^|\s)v (2|3|4|1[2-4]|2\d)(?!\d)/i.test(t)) f.push("„v“ statt „ve“ vor der Zahl");
  if (/(^|\s)ve (1|[5-9]|1[01]|1[5-9])(?!\d)/i.test(t)) f.push("„ve“ statt „v“ vor der Zahl");
  if (/(^|\s)z (2|3|4|6|7|1[2-4]|1[67]|[2-4]\d)(?!\d)/i.test(t)) f.push("„z“ statt „ze“ vor der Zahl");
  return f;
}

describe("CS-T9: Form und Zahlen", () => {
  it("Satzanfang gross, Satzschluss am Ende, Leerzeichen richtig", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlen im Landesbrauch: 1,5 · 7:30 · 70% čokoláda · 35 Kč · 2 € · keine Zahl mit Punkt am Satzende · ve/ze", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.some((t) => /\d,5\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\bv \d{1,2}:\d\d\b/i.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d Kč(?!\p{L})/u.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d \d{3} /.test(t))).toBe(true);
  });

  it("jede Zeile besteht die Regeln aller tschechischen Zeilen (`helfer/csTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg cs, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("cs");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("Gegenprobe: jede Form- und Zahlregel schlägt an", () => {
    for (const t of ["ema volá.", "Ema volá", "Ema volá .", "Raz,dva.", "Kocour ( šedý) spí."]) {
      expect(formFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(formFehler("Do [ ] napiš i, nebo y: m[ ]š.")).toEqual([]);
    expect(formFehler("Karlštejn (hrad u Berouna) nechal postavit Karel IV.")).toEqual([]);
    for (const t of [
      "Mléko je 95 % tučné.", "Stojí 35Kč.", "Stojí € 2.", "Váží 1.5 kila.", "Je tu 12345 lidí.", "Sněžka měří 1603 metrů.",
      "Vstáváme v 7:5 ráno.", "Tramvaj číslo 22.", "Oběd je v 12 hodin.", "Ve 8 hodin.", "Upeče z 4 jablek štrúdl.", "Platí se $5 předem.",
    ]) {
      expect(zahlFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(zahlFehler("V 7:30, ve 12 hodin, ze 4 jablek, 35 Kč, 2 €, 1,5 litru, 1 603 metrů, rok 2024, 70% čokoláda, do 4. B jde Ema.")).toEqual([]);
    expect(zahlFehler("Pevný odkaz $A$1 se nemění.")).toEqual([]);
  });
});

// ── Geschlecht, Feiertage, Daten (Glossar §1 Regel 2; Auftrag CS-T9) ───────────

const W_ENDE = "(?=[\\s,.?!:;\"')\\]]|$)";
const GEGENDERTES_DU = new RegExp(
  `(^|\\s)\\p{L}+(l|la|li|ly) jsi${W_ENDE}|(^|\\s)jsi (\\p{L}+(l|la|li|ly|ý|á)|sám|sama|rád|ráda)${W_ENDE}`,
  "iu",
);
/** „ich bin" mit hartem Adjektiv, l-Partizip oder rád/ráda legt das Geschlecht der tippenden Person fest; ebenso „bych" + l-Form. */
const GEGENDERTES_ICH = new RegExp(
  `(^|\\s)\\p{L}+(l|la) (jsem|bych)${W_ENDE}|(^|\\s)(jsem|bych) (\\p{L}+(l|la|ý|á)|sám|sama|rád|ráda)${W_ENDE}`,
  "iu",
);
/** Die Rolle „Ehemann/Ehefrau" legt es über das Gegenüber fest (wie CS-T6). */
const ROLLE = /(^|\s)(manžel\p{L}*|žena|ženou|muž|mužem)(?=[\s,.?!:;")]|$)/iu;

/**
 * Feiertage, ihre Bräuche, Speisen und Termine gehören EINER Charge, die Johannes erst freigeben muss (Auftrag CS-T9, Form
 * wie PL-T9). Auch die Termine der Staatsfeiertage (1. ledna, 8. května, 28. října, 17. listopadu …), weil jede Charge
 * sonst zu genau diesen Ziffern-Tatsachen greift (Falle 51). Namenstage (svátek, jmeniny) ebenso.
 */
const FEIERTAG =
  /(vánoc|vánočn|velikonoc|velikonočn|silvest|nový rok|nového roku|svát|jmenin|mikuláš|pomlázk|kraslic|dušičk|masopust|čarodějnic|posvícen|(^|\s)hody(?=[\s,.!?]|$)|štědr|cukroví|betlém|koled|advent|den matek|valentýn|boží hod|velký pátek|velkého pátku|den vítězství|státnost|cyril|metoděj|jana husa|upálení|svat(ý|ého|ém|ému) václav|(?<!\d)(1\. ledna|1\. května|8\. května|5\. července|6\. července|28\. září|28\. října|17\. listopadu|2[4-6]\. prosince|31\. prosince|1\. máje))/iu;

/** Personenbezogene Daten: E-Mail nur mit `.example`, keine Kontonummer (…/0800), kein rodné číslo (123456/7890), keine Rufnummer. */
function datenFehler(t: string): string[] {
  const f: string[] = [];
  for (const m of t.matchAll(/\S+@\S+/g)) if (!/@[\w.-]+\.example[.,!?]?$/.test(m[0])) f.push(`E-Mail ohne .example: ${m[0]}`);
  if (/\d{2,10}\/\d{4}(?!\d)/.test(t) && !/\b(19|20)\d\d\/(19|20)\d\d\b/.test(t) && !/\/20\d\d(?!\d)/.test(t)) f.push("Kontonummer?");
  if (/\b\d{6}\/\d{3,4}\b/.test(t)) f.push("rodné číslo?");
  if (/\b\d{3} \d{3} \d{3}\b/.test(t)) f.push("Rufnummer?");
  if (/(číslo účtu|rodné číslo)/i.test(t)) f.push("Kontonummer oder rodné číslo genannt");
  return f;
}

describe("CS-T9: keine Zeile legt das Geschlecht der tippenden Person fest; keine Feiertage; keine echten Daten", () => {
  it("kein gegendertes „du“, kein gegendertes „ich“ (auch „bych“), keine Ehe-Rolle (auch nicht vor ! : ; oder Anführung)", () => {
    expect(ZEILEN.filter((z) => GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z) || ROLLE.test(z))).toEqual([]);
  });

  it("Gegenprobe: „Podepsal jsem smlouvu!“, „Jsem rád.“, „Chtěla bych volno.“, „Dostal jsi výplatu?“, „Manžel je doma.“ gefunden; die Mehrzahl nicht", () => {
    for (const z of ["Podepsal jsem smlouvu!", "Jsem rád.", "Chtěla bych volno.", "Jsem unavená: konec směny."]) expect(GEGENDERTES_ICH.test(z), z).toBe(true);
    for (const z of ["Dostal jsi výplatu?", "Jsi sama?"]) expect(GEGENDERTES_DU.test(z), z).toBe(true);
    expect(ROLLE.test("Manžel je doma.")).toBe(true);
    for (const z of ["Konečně jsme splatili úvěr!", "Lékař vypsal neschopenku na 10 dní.", "Ostravo, ty jsi ale krásně zelená!"]) {
      expect(GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z) || ROLLE.test(z), z).toBe(false);
    }
  });

  it("kein Feiertag, kein Feiertagsbrauch, kein Feiertagstermin, kein Namenstag", () => {
    expect(ZEILEN.filter((z) => FEIERTAG.test(z))).toEqual([]);
  });

  it("Gegenprobe: Feiertage werden gefunden - Monate, Schichten und Václav als Vorname nicht", () => {
    for (const t of [
      "Na Vánoce jedeme do Brna.", "Úřad je zavřený 28. října.", "Pomlázka z Hané!", "Na Silvestra je v Ostravě ohňostroj.",
      "Do 17. listopadu je hotovo.", "Svátek má dnes Ivana.", "Na Štědrý den se nepracuje.", "Hody v Kyjově jsou slavné.",
    ]) {
      expect(FEIERTAG.test(t), t).toBe(true);
    }
    for (const t of ["Do 31. května musí majitelé zaplatit daň z nemovitostí.", "Václav pracuje na směny.", "Hodnocení hotelu: ****."]) {
      expect(FEIERTAG.test(t), t).toBe(false);
    }
  });

  it("E-Mail nur mit .example, keine Kontonummer, kein rodné číslo, keine Rufnummer", () => {
    const fehler = ZEILEN.flatMap((t) => datenFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.filter((t) => t.includes("@") && /\.example/.test(t)).length).toBeGreaterThanOrEqual(5);
  });

  it("Gegenprobe: echte Adresse, Kontonummer, rodné číslo, Rufnummer werden gefunden; Aktenzeichen und Hausnummer nicht", () => {
    for (const t of ["Pište na jana@seznam.cz.", "Platba na účet 1234567/0800.", "Rodné číslo 850101/1234.", "Volejte 602 123 456."]) {
      expect(datenFehler(t).length, t).toBeGreaterThan(0);
    }
    for (const t of ["Pište na ucetni@firma.example.", "Číslo jednací OD/456/2026 je nahoře.", "Lipová 125/7 v Jihlavě.", "Školní rok 2026/2027."]) {
      expect(datenFehler(t), t).toEqual([]);
    }
  });
});

// ── Orte, Namen und Grosswörter ─────────────────────────────────────────────

/** Technische Wörter (Adressen, Pfade, Rechnungen, Lückenwörter) - sie werden nicht als Wörter geprüft, die Stimme liest Zeichen. */
const TECHNISCH = /[@_/#=<>|*+&$%€\\^\d[\]{}]/;

/** Wörter einer Zeile mit Merker „Satzanfang" (Zeilenanfang, nach . ? !, Anfang einer Anführung); technische Wörter fallen weg. */
function woerterMitAnfang(zeile: string): { w: string; anfang: boolean }[] {
  const out: { w: string; anfang: boolean }[] = [];
  let naechsterAnfang = true;
  for (const roh of zeile.split(/\s+/)) {
    const kern = roh.replace(/^["(]+|[.,!?:;")]+$/g, "");
    if (!TECHNISCH.test(kern)) {
      for (const [i, teil] of kern.split("-").entries()) {
        const w = teil.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
        if (w) out.push({ w, anfang: i === 0 && (naechsterAnfang || roh.startsWith('"')) });
      }
    }
    naechsterAnfang = /[.!?]"?\)?$/.test(roh);
  }
  return out;
}
const woerterKlein = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w.toLowerCase());

/**
 * Eigennamen der Charge (klein), die weder im Wortschatz noch in einer anderen cs-Charge stehen - Personen, Firmen auf
 * Schildern, Orte, Landschaften, Abkürzungen. Jedes grosse Wort mitten im Satz steht hier oder in
 * {@link BEKANNTE_GROSSWOERTER}; sie sind belegt, weil sie Namen sind. Nur Benutztes, nur noch nicht Bekanntes.
 */
const EIGENNAMEN: Readonly<Record<string, string>> = {
  // Personen (Frauen und Männer gleichwertig; Seán O'Brien aus Irland, pan Nguyen aus Vietnam, D'Angelo aus Rom)
  alena: "Vorname", janu: "Akk. von Jana", libor: "Vorname", romana: "Akk. von Roman",
  radka: "Vorname", pavlovi: "Dat. von Pavel", seán: "Vorname (irisch)", "o'brien": "Familienname (irisch)",
  nguyena: "Gen. von Nguyen (Familienname, vietnamesisch)", "d'angelo": "Familienname (italienisch)", králová: "Familienname (f.)",
  bartošových: "Gen. Pl. von Bartošovi (Familie)", horákových: "Gen. Pl. von Horákovi (Familie)",
  // Firmen, Läden, Marken auf Schildern
  novák: "Familienname (Kanzlei Novák & partneři)", kovář: "Familienname (Autoservis Kovář & Pospíšil)", šebela: "Familienname (Weinkeller)",
  kadeřnictví: "Friseursalon (Teil des Ladennamens)", "o'reilly's": "Name eines Irish Pub", škodovce: "Lok. von Škodovka (Škoda Auto, hovorově)",
  excel: "Tabellenprogramm", brňáci: "Einwohner von Brno (Pl.)",
  // Abkürzungen
  bozp: "bezpečnost a ochrana zdraví při práci (Arbeitsschutz)", czk: "Währungscode der Krone", mhd: "městská hromadná doprava (ÖPNV)",
  sms: "Kurznachricht", svj: "společenství vlastníků jednotek (Eigentümergemeinschaft)",
  // Orte, Landschaften, Strassen
  bavorsku: "Lok. von Bavorsko (Bayern)", budějovic: "Gen. von (České) Budějovice",
  bílovice: "Velké Bílovice (Weinort)", chrudimi: "Lok. von Chrudim", hodoníně: "Lok. von Hodonín",
  hoře: "Lok. von Kutná Hora", kutné: "Lok./Gen. von Kutná (Hora)", jablonci: "Lok. von Jablonec nad Nisou", jeseník: "Lázně Jeseník",
  krumlově: "Lok. von Český Krumlov",
  lipová: "Lipová (Strasse)", lovosic: "Gen. von Lovosice", mikulov: "Mikulov (Weinort)",
  sokolova: "Gen. von Sokolov", mácháče: "Gen. von Mácháč (Máchovo jezero, hovorově)", mělníku: "Lok. von Mělník", náchodě: "Lok. von Náchod", ostravo: "Vok. von Ostrava",
  pavlovicích: "Lok. von Velké Pavlovice", pelhřimova: "Gen. von Pelhřimov", porubě: "Lok. von Poruba (Ostrava)", pradědu: "Lok. von Praděd",
  pražském: "Pražský okruh (Name der Ringautobahn)", prčice: "Sedlec-Prčice", sedlce: "Gen. von Sedlec (-Prčice)", přerově: "Lok. von Přerov",
  strakonice: "Strakonice", třeboni: "Lok. von Třeboň", třebíče: "Gen. von Třebíč", valtice: "Valtice (Weinort)",
  vltavy: "Gen. von Vltava (Moldau)", vítkovice: "Dolní Vítkovice (Ostrava)", zábřehu: "Lok. von Zábřeh",
  šumperku: "Lok. von Šumperk", žatce: "Gen. von Žatec", žďáru: "Gen. von Žďár nad Sázavou",
};

/**
 * Grossgeschriebene Wörter mitten im Satz, die schon im Wortschatz oder in einer anderen cs-Charge stehen (Orte, Namen,
 * Abkürzungen) - und die Kürzel der Schichtpläne (R ranní, O odpolední, N noční) und der Führerscheingruppe (B).
 */
const BEKANNTE_GROSSWOERTER = new Set([
  "b", "r", "o", "n",
  // seit dem Merge mit CS-T8 dort schon belegt
  "kristýně", "gb", "chorvatsku", "chomutově", "jihlavě", "karviné", "klatovech", "krkonoše", "lounech", "teplicích", "vyškova",
  "beskydech", "boleslavi", "brna", "brně", "chléb", "dph", "dvořák", "eva", "excelu", "hana", "hory", "hradci", "hradišti", "iva", "ivana",
  "jana", "ještědu", "jihlavy", "jičína", "kanadě", "karlových", "kladně", "klatov", "kolína", "kolíně", "kopřivnici", "krejčí",
  "krkonoších", "kroměříži", "káva", "kč", "labe", "lednici", "lenka", "liberci", "luhačovicích", "lázních", "malá", "marek",
  "mariánských", "mikulova", "mladé", "moravě", "mostě", "new", "německa", "olena", "olomouce", "olomouci", "opavě", "ostrava",
  "ostravě", "pardubicích", "petra", "plzeň", "plzni", "pospíšil", "praha", "prahy", "praze", "prostějova", "prostějově", "písku",
  "slovensko", "slovensku", "sázavou", "teams", "telči", "tomáš", "táboře", "uherském", "usa", "varech", "velké", "velkých",
  "vysočiny", "vysočině", "vídni", "yorku", "zlíně", "ústí", "čechách", "česku", "českém", "čssz", "říma", "šumavě",
]);

const istBekanntesGrosswort = (w: string): boolean => {
  const k = w.toLowerCase();
  return k in EIGENNAMEN || BEKANNTE_GROSSWOERTER.has(k);
};

/** Grossgeschriebene Wörter, die weder Satzanfang noch bekannter Name sind. */
function unbekannteGrosswoerter(zeile: string): string[] {
  return woerterMitAnfang(zeile)
    .filter((x) => !x.anfang && /^\p{Lu}/u.test(x.w) && !istBekanntesGrosswort(x.w))
    .map((x) => x.w);
}

/** Die vierzehn Kraje - erkannt an Wortformen der Zeilen (klein). */
const KRAJE: Readonly<Record<string, readonly string[]>> = {
  "Praha": ["praha", "praze", "prahy", "pražském"],
  "Středočeský": ["kladně", "kolína", "kolíně", "boleslavi", "škodovce", "sedlce", "prčice", "mělníku", "kutné", "hoře", "hory"],
  "Jihočeský": ["krumlově", "písku", "šumavě", "táboře", "třeboni", "budějovic", "strakonice"],
  "Plzeňský": ["plzni", "plzeň", "klatov", "klatovech"],
  "Karlovarský": ["karlových", "varech", "mariánských", "sokolova"],
  "Ústecký": ["ústí", "žatce", "chomutově", "mostě", "teplicích", "lounech", "lovosic"],
  "Liberecký": ["ještědu", "liberci", "jablonci", "mácháče"],
  "Královéhradecký": ["krkonoše", "krkonoších", "hradci", "náchodě", "jičína"],
  "Pardubický": ["pardubicích", "chrudimi"],
  "Vysočina": ["vysočině", "vysočiny", "pelhřimova", "třebíče", "jihlavě", "jihlavy", "jihlavské", "žďáru"],
  "Jihomoravský": ["brně", "brna", "brňáci", "mikulov", "mikulova", "valtice", "bílovice", "pavlovicích", "hodoníně", "lednici", "vyškova"],
  "Olomoucký": ["olomouci", "olomouce", "prostějova", "prostějově", "zábřehu", "šumperku", "jeseník", "přerově"],
  "Zlínský": ["zlíně", "luhačovicích", "hradišti", "kroměříži"],
  "Moravskoslezský": ["ostravo", "ostravě", "ostrava", "porubě", "kopřivnici", "beskydech", "vítkovice", "karviné", "opavě", "pradědu"],
};
const MAEHREN_SCHLESIEN = ["Jihomoravský", "Olomoucký", "Zlínský", "Moravskoslezský"];
/** GEMESSEN am Ende von CS-T9 - Obergrenze je Kraj, Mindestzahl je Kraj und Mähren/Schlesien. */
const HOECHSTENS_JE_KRAJ = 12;
const MINDESTENS_JE_KRAJ = 2;
const MINDESTENS_MAEHREN = 40;

function zeilenJeKraj(zeilen: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [kraj, formen] of Object.entries(KRAJE)) out[kraj] = zeilen.filter((z) => woerterKlein(z).some((w) => formen.includes(w))).length;
  return out;
}

describe("CS-T9: Orte und Namen", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein Name der Liste oder ein bekanntes Grosswort", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it(`alle vierzehn Kraje haben mindestens ${MINDESTENS_JE_KRAJ} Zeilen, keiner mehr als ${HOECHSTENS_JE_KRAJ}; Mähren und Schlesien mindestens ${MINDESTENS_MAEHREN}`, () => {
    const je = zeilenJeKraj(ZEILEN);
    expect(Object.entries(je).filter(([, n]) => n < MINDESTENS_JE_KRAJ)).toEqual([]);
    expect(Object.entries(je).filter(([, n]) => n > HOECHSTENS_JE_KRAJ)).toEqual([]);
    expect(MAEHREN_SCHLESIEN.reduce((s, k) => s + je[k], 0)).toBeGreaterThanOrEqual(MINDESTENS_MAEHREN);
  });

  it("€ steht nur in Zeilen über das Ausland oder den Kurs - nie mit einem Ort in Tschechien", () => {
    const euro = ZEILEN.filter((z) => z.includes("€"));
    expect(euro.length).toBeGreaterThanOrEqual(7);
    const ortCz = (z: string) => Object.values(zeilenJeKraj([z])).some((n) => n > 0);
    expect(euro.filter(ortCz)).toEqual([]);
  });

  it("Gegenprobe: unbekannte Grosswörter, Bindestrich-Orte, Anführung und Satzanfänge werden richtig gelesen", () => {
    expect(unbekannteGrosswoerter("Kolega jede do Atlantidy.")).toEqual(["Atlantidy"]);
    expect(unbekannteGrosswoerter("Byt v Ostravě-Porubě je volný.")).toEqual([]);
    expect(unbekannteGrosswoerter('"Kde je pošta?" ptá se turistka.')).toEqual([]);
    expect(unbekannteGrosswoerter("Teplota > 38 stupňů? Volejte lékaře.")).toEqual([]);
    expect(unbekannteGrosswoerter("Prší a Zítra ne.")).toEqual(["Zítra"]);
    expect(zeilenJeKraj(["V Třeboni je rybník.", "Petr spí."])["Jihočeský"]).toBe(1);
    expect(["Káva v Brně stojí 4 €."].filter((z) => Object.values(zeilenJeKraj([z])).some((n) => n > 0))).toHaveLength(1);
  });
});

// ── Gekürzt serviert: kein grosses Wort mitten im Satz ─────────────────────

/**
 * Wird eine Zeile vor ihrer vollen Sprosse gekürzt serviert, fällt mit `! " : ;` auch die Satzgrenze weg - ein Wort,
 * das danach gross steht, stünde mitten im Satz. Darum steht dort nur ein Name oder Ort (Naht-Regel wie PL-T7).
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

describe("CS-T9: gekürzt serviert - kein Grossbuchstabe mitten im Satz", () => {
  it("jede Zeile, die vor ihrer Sprosse gekürzt kommt, liest sich ohne Grosswort mitten im Satz", () => {
    const fehler = ZEILEN.flatMap((z) => fruehNahtFehler(z).map((f) => `"${z}" @ ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Šéf píše: \"Porada odpadá!\"“ würde vor „:“ zu „Šéf píše Porada“; ein Ausruf mitten in der Zeile ebenso", () => {
    expect(fruehNahtFehler('Šéf píše: "Porada odpadá!"').length).toBeGreaterThan(0);
    expect(fruehNahtFehler("Hurá! Výplata dorazila.").length).toBeGreaterThan(0);
    expect(fruehNahtFehler('"Kde je tady pošta?" ptá se turistka v Českém Krumlově.')).toEqual([]);
    expect(fitText("Moravské vinařské obce: Mikulov, Valtice a Velké Bílovice.", allowedAt(sprosseVon(":") - 1), "cs")).toBe(
      "Moravské vinařské obce Mikulov, Valtice a Velké Bílovice.",
    );
  });
});

// ── Wortschatz: Wortgrenze, Bewegungsverben, Sperrliste, Belege, Diakritik ──────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste wie CS-T1/T4). */
const FUNKTIONSWOERTER = new Set(
  (
    "a i ani ale nebo s se si k ke v ve na do od o u z ze po pro za nad pod " +
    "je jsou jsem jsme jsi jste to ten ta ty tu tam sem tak jak kde kam jen ne ano jo " +
    "mi mě mně tě ho mu můj moje moji tvůj tvoje náš naše dnes"
  ).split(" "),
);
/** Inhaltswörter einer Zeile, klein, nur Buchstabenfolgen (Ziffern und Zeichen fallen weg). */
const inhaltswoerter = (z: string): Set<string> => new Set((z.toLowerCase().match(/\p{L}+/gu) ?? []).filter((w) => !FUNKTIONSWOERTER.has(w)));

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltswoerter(z)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** CS-T1 §4: Bewegungsverben (jet, jít) und les - hier gemessen 3 (jde podat, vyjde ×2), Grenze 3. */
const BEWEGUNG =
  /(^|\s)(ne)?(u|od|do|při|pře|vy|za|s|po)?(jet|jedu|jedeš|jede|jedeme|jedete|jedou|jel|jela|jeli|jely|jít|jdu|jdeš|jde|jdeme|jdete|jdou|jdi|jděte|šel|šla|šli|půjdeme|les|lesa|lese|lesem|lesy|lesů)(?=[\s,.?!:;")]|$)/iu;
const BEWEGUNG_GRENZE = 3;

describe("CS-T9: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ Wortbudget Erwachsene: kein Inhaltswort in mehr als 8 Zeilen über alle Erwachsenen-Chargen (T3 + T6 + T9, CS-T6 §6)", () => {
    expect(ERWACHSENE_ANDERE()).toEqual(expect.arrayContaining(T3));
    expect(ERWACHSENE_ANDERE()).toEqual(expect.arrayContaining(CORPUS_CS_WEG_MITTE_ERWACHSENE.map((i) => i.text)));
    // CS-T6 §6: „deset" und „má" standen dort schon auf 6 - hier höchstens 2.
    for (const w of ["deset", "má"]) expect(ZEILEN.filter((z) => inhaltswoerter(z).has(w)).length, w).toBeLessThanOrEqual(2);
    const fehler = zuHaeufig([...ZEILEN, ...ERWACHSENE_ANDERE()]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (gross, mit Satzzeichen, nach Ziffer), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Pes" : "Ten 9 pes"} ${"abcdefghi"[i]}! Ano.`);
    expect(zuHaeufig(neun)).toEqual(['"pes": 9 Zeilen']);
  });

  it(`Bewegungsverben und „les“ sparsam: höchstens ${BEWEGUNG_GRENZE} Zeilen (CS-T1 §4)`, () => {
    const treffer = ZEILEN.filter((z) => BEWEGUNG.test(z));
    expect(treffer.length, treffer.join("\n")).toBeLessThanOrEqual(BEWEGUNG_GRENZE);
  });

  it("Gegenprobe: „Jedeme!“, „Jdu ven.“ und „V lese:“ werden erkannt; „Jezdí na kole.“ nicht", () => {
    for (const z of ["Jedeme!", "Jdu ven.", "V lese: houby."]) expect(BEWEGUNG.test(z), z).toBe(true);
    expect(BEWEGUNG.test("Jezdí na kole.")).toBe(false);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => woerterKlein(t).filter((w) => gesperrtCs(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurva (Kern) und vole (Wortbasis) gefunden; knihovně, sekunda, přestávce, zavináč nicht", () => {
    expect(istKernGesperrtCs("kurva")).toBe(true);
    expect(gesperrtCs("vole")).toBe(true);
    for (const w of ["knihovně", "sekunda", "přestávce", "zavináč"]) expect(gesperrtCs(w), w).toBe(false);
  });
});

/**
 * Wörter dieser Charge, die weder in `WORDS_CS`, `STUFE_VOCAB_CS`, `NACHTRAG_CS` (Tatoeba-Formen mit mindestens zwei
 * Belegen) noch in einer anderen cs-Charge stehen (deren Wächter führen sie; Muster PL-T9) und keine Eigennamen sind - mit
 * Begründung, weil es für Tschechisch kein Wörterbuch gibt (Falle 61/98). Alle sind gewöhnliche Wörter bzw. regelmässige
 * Formen [G: eigenes Sprachwissen]; sie gehören in die Lese-Abnahme durch eine Person mit Tschechisch als Erstsprache (P7).
 * Über den Korpus kommen sie ins Vorlese-Lexikon.
 */
const OHNE_TATOEBA_BELEG: Readonly<Record<string, string>> = {
  absolventů: "Gen. Pl. von absolvent", adres: "Gen. Pl. von adresa", advokátní: "Adj. (Anwalts-)",
  ar: "Ar (Flächenmass)", automat: "Automat (m.)", autoservis: "Autowerkstatt (m.)", balkon: "Balkon (m.)", balkonem: "Instr. von balkon",
  benzinka: "Tankstelle (f., hovorově)", blokují: "3. Pl. von blokovat",
  byty: "Nom. Pl. von byt", "c'est": "franz. „c'est“ (Beispiel für den Apostroph)", ceduli: "Lok. von cedule (Schild)",
  cest: "Gen. Pl. von cesta (dýchací cesty)", chaty: "Gen. von chata", citace: "Zitat (f.)", citovaný: "Part. (zitiert)",
  cm: "Abk. von centimetr", cyklisty: "Akk. Pl. von cyklista", dat: "Gen. Pl. von data (mobilní data)", datovku: "Akk. von datovka (Datenbox, hovorově)",
  datovou: "Akk./Instr. f. von datový", decibelů: "Gen. Pl. von decibel", deska: "Arbeitsplatte (f.)", diktování: "Diktieren (n.)",
  dlužíme: "1. Pl. von dlužit (schulden)", dodavatel: "Lieferant (m.)", "doesn't": "engl. Beispiel für den Apostroph", dojíždění: "Pendeln (n.)",
  doktorky: "Gen. von doktorka", dolní: "Adj. (unterer; Dolní Vítkovice)", doložit: "belegen, nachweisen (Inf.)", doly: "Nom. Pl. von důl (Bergwerk)",
  domluvy: "Gen. von domluva (Absprache)", dorazilo: "l-Part. n. von dorazit (eintreffen)",
  dovoláte: "2. Pl. Futur von dovolat se (durchkommen)", dvanáctihodinové: "Adj. Pl. (zwölfstündig)", dvougenerační: "Adj. (Zweigenerationen-)",
  dálnic: "Gen. Pl. von dálnice", dýchacích: "Gen. Pl. von dýchací (Atem-)", elektrárna: "Kraftwerk (f.)", fabriky: "Gen. von fabrika (Fabrik, hovorově)",
  fakturu: "Akk. von faktura (Rechnung)", fakturuje: "3. Sg. von fakturovat", fixace: "Zinsbindung (f.)", fond: "Fonds (fond oprav)",
  formuláři: "Lok. von formulář", fotografy: "Akk. Pl. von fotograf", hasicí: "Adj. (Lösch-)", hasičárně: "Lok. von hasičárna (Feuerwehrhaus)",
  havarijní: "Adj. (Kasko-)", hlasový: "Adj. (hlasový výstup = Sprachausgabe)", hlásíme: "1. Pl. von hlásit se (sich anmelden)",
  hodinová: "Adj. f. (Stunden-)", hodnocení: "Bewertung (n.)", hokna: "Arbeit (Brünner hantec)", home: "engl. (home office, in Büros üblich; bei CS-T8 nur in einem technischen Wort)",
  hradí: "3. Sg. von hradit (erstatten)", hrubá: "Adj. f. (brutto)", hutě: "Nom. Pl. von huť (Hüttenwerk)",
  hypotéky: "Gen. von hypotéka", infolinka: "Hotline (f.)", inzeráty: "Akk. Pl. von inzerát (Anzeige)", irský: "irisch (Adj.)",
  jednací: "Adj. (číslo jednací = Aktenzeichen)", jihlavské: "Lok. f. von jihlavský",
  jídelny: "Gen. von jídelna (Kantine)", kamiony: "Nom. Pl. von kamion (Lastwagen)", kapsáře: "Akk. Pl. von kapsář (Taschendieb)",
  katastru: "Lok. von katastr (Kataster)", klientem: "Instr. von klient", klientům: "Dat. Pl. von klient", klouže: "3. Sg. von klouzat (glatt sein)",
  kolaudace: "Bauabnahme (f.)", kolegu: "Akk. von kolega", kolonky: "Nom. Pl. von kolonka (Formularfeld)",
  kolonáda: "Kolonnade (f.)", kolárny: "Gen. von kolárna (Fahrradraum)", kopírování: "Kopieren (n.)",
  kreditu: "Gen. von kredit (Guthaben)", kubík: "Kubikmeter (hovorově)", kultury: "Gen. von kultura",
  kuse: "Lok. von kus (v kuse = am Stück)", kvalita: "Qualität (f.)", kwh: "Abk. von kilowatthodina", "l'amour": "franz. Beispiel für den Apostroph",
  lekcí: "Gen. Pl. von lekce", litinový: "Adj. (gusseisern)", litiny: "Gen. von litina (Gusseisen)", logistika: "Logistik (f.)",
  lyžaře: "Akk. Pl. von lyžař (Skifahrer, generisch)", lákají: "3. Pl. von lákat (locken)", láká: "3. Sg. von lákat", lázně: "Kurort (Pl., Lázně Jeseník)",
  lékárnice: "Apothekerin (f.)", mateřství: "Mutterschaft (n.)", mobilem: "Instr. von mobil (Handy)",
  mzdové: "Lok. f. von mzdový (Lohn-)", násobí: "3. Sg. von násobit (multiplizieren)", přiletěl: "l-Part. von přiletět (anfliegen)", zadává: "3. Sg. von zadávat (vergeben)", nabral: "l-Part. von nabrat (Verspätung aufnehmen)", nabídek: "Gen. Pl. von nabídka",
  nabírá: "3. Sg. von nabírat", nastupuje: "3. Sg. von nastupovat (eine Stelle antreten)", natírá: "3. Sg. von natírat (streichen)",
  navýšení: "Erhöhung (n.)", nemocenskou: "Akk. von nemocenská (Krankengeld)", neordinuji: "1. Sg. verneint von ordinovat (Sprechstunde halten)",
  neparkujte: "Imp. Pl. verneint von parkovat", nepoteče: "3. Sg. Futur verneint von téct (fliessen)", neschopenka: "Krankschreibung (f., hovorově)",
  neschopnost: "Unfähigkeit (pracovní neschopnost = Arbeitsunfähigkeit)", neseme: "1. Pl. von nést (tragen)", neurčitou: "Akk. f. von neurčitý (unbefristet)",
  nevyřízeno: "Part. n. verneint (unerledigt)", neznámých: "Gen. Pl. von neznámý", nástup: "Einstieg; Stellenantritt (m.)",
  názvy: "Akk. Pl. von název", obce: "Nom. Pl. von obec (Gemeinde)", obory: "Nom. Pl. von obor (Branche)", obsahovat: "enthalten (Inf.)",
  odborném: "Lok. von odborný (Fach-)", odběratel: "Abnehmer (m.)", odběry: "Akk. Pl. von odběr (Blutabnahme)", odeslané: "Part. n. von odeslat (abgeschickt)",
  odečítají: "3. Pl. von odečítat (ablesen)", odkazem: "Instr. von odkaz (Verweis)", odkazuje: "3. Sg. von odkazovat (verweisen)",
  odpolední: "Adj. (Nachmittags-)", odpracované: "Part. Pl. von odpracovat (geleistet)", odtahujeme: "1. Pl. von odtahovat (abschleppen)",
  odvody: "Nom. Pl. von odvod (Abgaben)", odvádí: "3. Sg. von odvádět (abführen)", office: "engl. (home office, in Büros üblich)",
  okresní: "Adj. (Bezirks-)", okresu: "Gen. von okres (Bezirk)", okruhu: "Lok. von okruh (Ring)", ordinace: "Arztpraxis (f.)",
  osvč: "Abk. von osoba samostatně výdělečně činná (Selbständige)", označíme: "1. Pl. Futur von označit (markieren)", ošetřovné: "Pflegegeld bei Krankheit des Kindes (n.)",
  papírová: "Adj. f. (Papier-)", paráda: "prima (hovorově)", patička: "Fusszeile (f.)", patro: "Stockwerk (n.)", patry: "Instr. Pl. von patro",
  peněžitá: "Adj. f. (Geld-, peněžitá pomoc v mateřství)", platby: "Akk. Pl. von platba", plánku: "Lok. von plánek (Plan)", pobočka: "Filiale (f.)",
  pobočky: "Gen. von pobočka", podatelna: "Poststelle eines Amts (f.)", podepsaná: "Part. f. von podepsat", podklady: "Unterlagen (Pl.)",
  pojistky: "Akk. Pl. von pojistka (Polizze)", popisné: "Adj. n. (číslo popisné = Konskriptionsnummer)", poplatníka: "Gen. von poplatník (Steuerpflichtige, sleva na poplatníka)",
  porady: "Gen. von porada", porouchaný: "Adj. (kaputt)", povinná: "Adj. f. (Pflicht-)", povinně: "Adv. (verpflichtend)",
  pozdravujte: "Imp. Pl. von pozdravovat (grüssen)", pořadí: "Reihenfolge (n.)", prašanu: "Gen. von prašan (Pulverschnee)", preventivní: "Adj. (Vorsorge-)",
  prohlídka: "Besichtigung, Führung (f.)", prohlídky: "Akk. Pl. von prohlídka (Untersuchung)", pronajímá: "3. Sg. von pronajímat (vermieten)",
  pruh: "Fahrstreifen (m.)", pružná: "Adj. f. (flexibel; pružná pracovní doba = Gleitzeit)", prémie: "Prämie (f.)", prémií: "Gen. Pl. von prémie",
  pub: "Pub (m.)", pumpě: "Lok. von pumpa (Tankstelle, hovorově)", páska: "Absperrband (f.)",
  předávají: "3. Pl. von předávat (übergeben)", přepisu: "Lok. von přepis (Mitschrift)", příkazovém: "Lok. von příkazový (Befehls-)",
  přílohy: "Akk. Pl. von příloha (Anhang)", radí: "3. Sg. von radit (raten)", rakouská: "Adj. f. (österreichisch)", revize: "Revision, Prüfung (f.)",
  režim: "Modus (m.)", rožni: "Imp. von rožnout (mährisch: Licht anmachen)", ručení: "Haftung (n., povinné ručení = Kfz-Haftpflicht)",
  ryje: "3. Sg. von rýt (umgraben)", saldo: "Saldo (n.)", samostatně: "Adv. (selbständig)", sazba: "Satz (Steuersatz, f.)", schránkou: "Instr. von schránka",
  schránku: "Akk. von schránka", schvaluje: "3. Sg. von schvalovat (genehmigen)", schválili: "l-Part. Pl. von schválit", segedín: "Szegediner Gulasch (hovorově)",
  serverovně: "Lok. von serverovna (Serverraum)", sklep: "Keller (m.)", slovenské: "Gen. f. von slovenský",
  složila: "l-Part. f. von složit (ablegen)", složka: "Ordner (f.)", slévárně: "Lok. von slévárna (Giesserei)", smlouvě: "Lok. von smlouva",
  směnách: "Lok. Pl. von směna", soutoku: "Lok. von soutok (Zusammenfluss)",
  splatili: "l-Part. Pl. von splatit (abbezahlen)", splatnost: "Fälligkeit (f.)", splácí: "3. Sg. von splácet (abzahlen)", spotřeba: "Verbrauch (f.)",
  spotřebiče: "Nom. Pl. von spotřebič (Haushaltsgerät)", spálí: "3. Sg. Futur von spálit (verbrauchen)", startuje: "3. Sg. von startovat",
  stočné: "Abwassergebühr (n.)", stravenky: "Essensbons (Pl.)", státnice: "Staatsprüfung (Pl.)", stávkuje: "3. Sg. von stávkovat (streiken; scherzhaft)",
  střídá: "3. Sg. von střídat (ablösen)", sídlí: "3. Sg. von sídlit (seinen Sitz haben)", tabulkách: "Lok. Pl. von tabulka",
  turistka: "Touristin (f.)", uchazečů: "Gen. Pl. von uchazeč (Bewerber, generisch)", uf: "Lautwort der Erleichterung",
  ukládáme: "1. Pl. von ukládat (speichern)", uživatelské: "Adj. n. (Benutzer-)", vchody: "Instr. Pl. von vchod (Eingang)", večerka: "kleiner Laden mit langen Öffnungszeiten (f.)",
  večerky: "Gen. von večerka", vinařské: "Adj. Pl. (Wein-)", vjezdem: "Instr. von vjezd (Einfahrt)", vodné: "Wassergebühr (n.)", vodoměry: "Nom. Pl. von vodoměr (Wasserzähler)",
  volných: "Gen. Pl. von volný", vychovává: "3. Sg. von vychovávat (erziehen)", vyprodání: "Ausverkauf (n.)", vypsal: "l-Part. von vypsat (ausstellen)",
  vyslání: "Entsendung (n.)", vytápí: "3. Sg. von vytápět (heizen)", vyřízeno: "Part. n. (erledigt)", vyřízení: "Erledigung (n.)",
  vztahuje: "3. Sg. von vztahovat se (gelten für)", výběrovým: "Instr. von výběrový (výběrové řízení = Ausschreibung)", výdělečně: "Adv. (erwerbs-)",
  výhoda: "Vorteil (f.)", výpisy: "Akk. Pl. von výpis (Kontoauszug)", výplatní: "Adj. (výplatní páska = Lohnzettel)", výplatě: "Lok. von výplata",
  "won't": "engl. Beispiel für den Apostroph", zakázky: "Nom. Pl. von zakázka (Auftrag)",
  zamyká: "3. Sg. von zamykat (abschliessen)", zaměstnavateli: "Dat. von zaměstnavatel", zapít: "nachtrinken (Inf.)", zasedačce: "Lok. von zasedačka (Besprechungsraum, hovorově)",
  zasedačka: "Besprechungsraum (f., hovorově)", zaškrtněte: "Imp. Pl. von zaškrtnout (ankreuzen)", zkrácený: "Adj. (verkürzt; zkrácený úvazek = Teilzeit)",
  změn: "Gen. Pl. von změna", značí: "3. Sg. von značit (bezeichnen)", ztěžka: "Adv. (mühsam)", záhlaví: "Kopfzeile (n.)", zápisu: "Lok. von zápis (Protokoll)",
  úrokem: "Instr. von úrok (Zins)", úzký: "schmal (Adj.)", úřadem: "Instr. von úřad", častý: "häufig (Adj.)", čerpá: "3. Sg. von čerpat (Urlaub nehmen)",
  činná: "Adj. f. (tätig)", čtverečních: "Gen. Pl. von čtvereční (Quadrat-)", čtvrtletí: "Quartal (n.)", částkou: "Instr. von částka (Betrag)",
  částky: "Nom. Pl. von částka", řádek: "Zeile (m.)", šichta: "Schicht (f., hovorově)", školení: "Schulung (n.)",
  šlape: "3. Sg. von šlapat (in die Pedale treten)", žurnálu: "Gen. von žurnál (jako ze žurnálu = wie aus dem Modeheft)",
};

/** Was der Wortschatz und die Tatoeba-Formen schon kennen (gegen diese Menge prüft „überflüssig"). */
const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat(), ...NACHTRAG_CS].map((w) => w.toLowerCase()),
);
/** Wörter der anderen cs-Chargen (rohe Liste ohne diese Charge) - sie gelten als belegt, ihr Wächter führt sie (Muster PL-T9). */
const AUS_ANDEREN_CS = (): Set<string> => new Set(ANDERE_CS_ZEILEN().flatMap(woerterKlein));

/** Wörter (ab zwei Buchstaben), die weder vorher bekannt waren noch begründet in einer der zwei Listen stehen. */
function ungeprueft(zeilen: string[]): string[] {
  const andere = AUS_ANDEREN_CS();
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of woerterKlein(z)) {
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

/** Die Diakritik-Falle (CS-T1): ein Wort ausserhalb des kuratierten Wortschatzes, dessen Form MIT Haken/Strich dort steht. */
function diakritikVerdacht(zeilen: string[]): string[] {
  const out: string[] = [];
  for (const w of new Set(zeilen.flatMap(woerterKlein))) {
    if (KURATIERT.has(w) || w in EIGENNAMEN) continue;
    let formen = [""];
    for (const ch of w) formen = formen.flatMap((f) => [ch, ...(AKZENT_VARIANTEN[ch] ?? [])].map((x) => f + x));
    const treffer = formen.filter((v) => v !== w && KURATIERT.has(v));
    if (treffer.length > 0) out.push(`${w} (gemeint ${treffer.join("/")}?)`);
  }
  return out;
}
/** Gelesen (Befund §4): hier ist die Form OHNE Haken gemeint. */
const DIAKRITIK_GELESEN: ReadonlySet<string> = new Set<string>(["dat"]); // „10 GB dat“: Gen. Pl. von data, nicht dát

/** Die Stimme liest Leerzeichen-Wörter; technische Wörter (Adressen, Rechnungen, Lückenwörter) liest sie als Zeichen. */
const stimmWoerter = (zeile: string): string[] =>
  zeile
    .split(/\s+/)
    .map((roh) => roh.replace(/^["(]+|[.,!?:;")]+$/g, ""))
    .filter((w) => w.length >= 2 && !TECHNISCH.test(w));

describe("CS-T9: Belege, Stimme, Diakritik", () => {
  it("jedes Wort stand schon im Wortschatz oder in den Tatoeba-Formen - oder steht begründet in einer der zwei Listen", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    const benutzt = new Set(ZEILEN.flatMap(woerterKlein));
    const ueberfluessig = [...Object.keys(OHNE_TATOEBA_BELEG), ...Object.keys(EIGENNAMEN)].filter(
      (w) => !benutzt.has(w) || VORHER_BEKANNT.has(w),
    );
    expect(ueberfluessig).toEqual([]);
    expect(Object.keys(OHNE_TATOEBA_BELEG).filter((w) => w in EIGENNAMEN)).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine falsche Endung werden gemeldet, ein Name der Liste und eine Adresse nicht", () => {
    expect(ungeprueft(["Ema má zavináčx!", "Dva bobrové."])).toEqual(["zavináčx", "bobrové"]);
    expect(ungeprueft(["Ema je v Brně: piš na ema@skola.example."])).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) => stimmWoerter(z).some((w) => !isRealWord(w, "cs")));
    expect(buchstabiert).toEqual([]);
    expect(stimmWoerter('Frýdek-Místek, "Čtyřlístek" a 2:1!')).toEqual(["Frýdek-Místek", "Čtyřlístek"]);
  });

  it("kein Wort ohne den Haken oder Strich, den es braucht (Diakritik-Falle) - ausser gelesenen", () => {
    expect(diakritikVerdacht(ZEILEN).filter((v) => !DIAKRITIK_GELESEN.has(v.split(" ")[0]))).toEqual([]);
  });

  it("Gegenprobe: „Mam hlad!“ und „Muze to byt.“ werden gemeldet, „Mám hlad!“ nicht", () => {
    expect(diakritikVerdacht(["Mam hlad!"]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["Muze to byt."]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["Mám hlad!"])).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich ─────────────────────────────

const ohneSatzzeichen = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
const wortMenge = (t: string) => new Set(ohneSatzzeichen(t).split(" ").filter(Boolean));
function jaccard(a: Set<string>, b: Set<string>): number {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s);
}

/** Geschlecht und Zahl gleichgesetzt (wie CS-T4), auf der Fassung ohne Satzzeichen und klein. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", ony: "PRO" };
  return ohneSatzzeichen(zeile)
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
const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR];
/** Alles, was sonst Text trägt: alle Korpora (cs ROH), alle Serien, alle Prüfungstext-Banken - Zeile UND Satz. */
function alleFremdenZeilen(): string[] {
  const roh = [
    ...FREMDE_KORPORA().map((i) => i.text),
    ...ANDERE_CS_ZEILEN(),
    ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ...bankZeilen(),
  ];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}

/** Nähe 0,5 bis unter 0,6 zu anderen cs-Zeilen: gelesen (Befund §4). Eine NEUE Nähe muss hier eingetragen werden. */
const NAH_AN_ANDEREN_CS: Readonly<Record<string, string>> = {};

describe("CS-T9: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("die Vergleichsmenge ist voll (rohe cs-Liste mit T1-T8, Serien und Banken geladen)", () => {
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(T1));
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(T3));
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(T7));
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(T8));
    expect(ANDERE_CS().filter((i) => CORPUS_CS_WEG_MITTE_ERWACHSENE.includes(i)).length).toBe(CORPUS_CS_WEG_MITTE_ERWACHSENE.length);
    expect(ANDERE_CS().some((i) => i.stufen.includes("teens"))).toBe(true);
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    for (const k of [CORPUS_IT, CORPUS_PL, CORPUS_TR]) expect(k.length).toBeGreaterThan(0);
  });

  it("keine Zeile doppelt - auch nicht ohne Satzzeichen oder nach dem Ledger-Schlüssel (der Háček, Čárka und Zeichen nicht kennt)", () => {
    expect(new Set(ZEILEN.map(ohneSatzzeichen)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer fremden Zeile, einer anderen cs-Zeile oder einem Satz (ohne Satzzeichen, klein) - auch nicht im Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneSatzzeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(ZEILEN.filter((t) => texte.has(ohneSatzzeichen(t)) || schluessel.has(bausteinKey("satz", t)))).toEqual([]);
  });

  it("Gegenprobe: eine T1-Zeile gross mit Ausruf, eine Serienzeile und ein Banken-Satz werden erkannt", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneSatzzeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(texte.has(ohneSatzzeichen("Jedeme lesem!"))).toBe(true);
    expect(schluessel.has(bausteinKey("satz", "Dal sál!"))).toBe(true);
    expect(texte.has(ohneSatzzeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(texte.has(ohneSatzzeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    expect(bausteinKey("satz", "3 + 4 = 7.")).toBe(bausteinKey("satz", "3 * 4 = 7.")); // Zeichen sind Trenner
  });

  it("keine Paare in der Charge und keines mit einer anderen cs-Zeile (nur Geschlecht oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_CS_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Ema vyhrála/Ema vyhrál und on/ona werden als Paar erkannt", () => {
    expect(paare(["Ema vyhrála závod!", "Ema vyhrál závod!"])).toHaveLength(1);
    expect(paare(["On jde domů!", "Ona jde domů!"])).toHaveLength(1);
    expect(paare(["Pes + kočka = kamarádi?"], T1)).toEqual([]);
  });

  it("innerhalb der Charge nichts fast gleich (die Hälfte der Wörter geteilt)", () => {
    const fehler: string[] = [];
    for (let i = 0; i < ZEILEN.length; i++) {
      for (let j = i + 1; j < ZEILEN.length; j++) {
        if (jaccard(wortMenge(ZEILEN[i]), wortMenge(ZEILEN[j])) >= 0.5) fehler.push(`"${ZEILEN[i]}" ~ "${ZEILEN[j]}"`);
      }
    }
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

  it("Gegenprobe: beim Schreiben verworfene Zeilen wären fast gleich (Befund §4)", () => {
    const andere = ANDERE_CS_ZEILEN().map((t) => wortMenge(t));
    const nahAnCs = (z: string) => andere.some((m) => jaccard(wortMenge(z), m) >= 0.5);
    expect(nahAnCs("Daň z nemovitostí se platí do 31. května.")).toBe(true); // CS-T6
    expect(nahAnCs("V Ostravě bylo ráno -6 stupňů.")).toBe(true); // CS-T7
    expect(nahAnCs("V Brně se práci říká \"hokna\".")).toBe(true); // CS-T5
    expect(jaccard(wortMenge("Saldo > 0 znamená přeplatek."), wortMenge("Saldo < 0 znamená, že dlužíme."))).toBeGreaterThanOrEqual(0.5);
  });
});

// ── Anker und Auslieferung ────────────────────────────────────────────────

describe("CS-T9: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als geschlossenen Block HINTER CS-T8, die geladene und korpusFuer(\"cs\") jede Zeile", () => {
    const ab = CS_ROH.indexOf(CHARGE[0]);
    expect(CS_ROH.slice(ab, ab + CHARGE.length)).toEqual(CHARGE);
    const letzteT8 = Math.max(...CORPUS_CS_WEG_ENDE_TEENS.map((i) => CS_ROH.indexOf(i)));
    expect(ab).toBeGreaterThan(letzteT8);
    expect(CS_ROH.slice(0, ab).some((i) => CORPUS_CS_WEG_MITTE_KIDS.includes(i))).toBe(true);
    const geladen = new Set(CS_GELADEN.map((i) => i.text));
    const fuer = new Set(korpusFuer("cs").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t) || !fuer.has(t))).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker, als geschlossener Block hinter dem Stand nach TR-T9 (21.273)", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_CS()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    const eigeneIds = CHARGE.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(eigeneIds).size).toBe(ZEILEN.length);
    // gemessen 09.10.2026 auf 429ebb4f: 20.212 ⇒ 20.526; nach Merge feat/tastenflow 58e1d587: 21.273 ⇒ 21.587, „314 neu".
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(start).toBeGreaterThanOrEqual(21273);
    expect(KORPUS_ANKER.slice(start, start + ZEILEN.length)).toEqual(eigeneIds);
    const eigen = new Set(eigeneIds);
    expect(KORPUS_ANKER.slice(0, start).filter((id) => eigen.has(id))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    expect(CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr), eine gross geschriebene T1-Zeile nicht", () => {
    const alle = [...FREMDE_KORPORA(), ...CS_GELADEN];
    const probe = { text: "Zzz probe cs t9!", kind: "satz" as const, stufen: ["erwachsen" as const] };
    expect(manifestFor([...alle, probe]).ids.length).toBe(KORPUS_ANKER.length + 1);
    const kopie = { text: "Jedeme lesem!", kind: "satz" as const, stufen: ["erwachsen" as const], nurWeg: "cs" as const };
    expect(manifestFor([...alle, kopie]).ids.length).toBe(KORPUS_ANKER.length);
  });

  for (const l of TASTATUREN) {
    it(`${l}: am Ende des Lernwegs bekommen Erwachsene jede Zeile vollständig, vor í keine, an ¨ nur gekürzte (ohne ! " : ; - ( ), Ziffern, Zeichen)`, () => {
      const o = ordnung(l);
      const alles = allowedAt(o.length, l);
      const geliefert = new Set(corpusItemsFor({ stufe: "erwachsen", allowed: alles, lang: "cs", lernweg: "cs" }));
      expect(ZEILEN.filter((t) => !geliefert.has(t))).toEqual([]);
      const vorI = allowedAt(o.indexOf("í"), l);
      expect(ZEILEN.filter((t) => fitText(t, vorI, "cs") !== null)).toEqual([]);
      const anTrema = allowedAt(44, l);
      const gekuerzt = ZEILEN.map((z) => fitText(z, anTrema, "cs")).filter((s): s is string => s !== null);
      expect(gekuerzt.filter((t) => /[^\p{L} .,?]/u.test(t))).toEqual([]);
      expect(gekuerzt.length).toBeGreaterThan(80);
      const lieferung = corpusItemsFor({ stufe: "erwachsen", allowed: anTrema, lang: "cs", lernweg: "cs" });
      expect(lieferung.some((t) => gekuerzt.includes(t))).toBe(true);
      // D-2 (`nurKleinschrift`): vor ⇧ bekommen Erwachsene keine dieser Zeilen, auch nicht gekürzt.
      const vorShift = allowedAt(o.indexOf(SHIFT_UNIT), l);
      const frueh = corpusItemsFor({ stufe: "erwachsen", allowed: vorShift, lang: "cs", lernweg: "cs", umschalt: false });
      const servierte = new Set(ZEILEN.flatMap((t) => [t, fitText(t, vorShift, "cs") ?? t]));
      expect(frueh.filter((t) => servierte.has(t))).toEqual([]);
    });
  }

  it("Kinder und Jugendliche bekommen keine dieser Zeilen; Weg „de“ und Weg „it“ auch nicht", () => {
    const alles = allowedAt(ordnung().length);
    for (const stufe of ["kids", "teens"] as const) {
      const g = corpusItemsFor({ stufe, allowed: alles, lang: "cs", lernweg: "cs" });
      expect(g.length, stufe).toBeGreaterThan(0);
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
