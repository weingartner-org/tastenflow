/**
 * ★★★ Wächter CS-T7 (09.10.2026): die tschechischen Kindertexte am Ende des Lernwegs
 * (`corpusCsWegEndeKids.ts`, Sprossen 45-78 auf `cs` UND `cs-qwerty` = `!` bis `]`).
 * Vorbilder: `tastenflow-texte-cs-kids-mitte.test.ts` (CS-T4), `tastenflow-texte-cs-erwachsene-mitte.test.ts`
 * (CS-T6) und - nur als Form - `tastenflow-texte-pl-kids-ende.test.ts` (PL-T7); Befund
 * `BEFUND-2026-10-09-CS-T7-KIDS-ENDE.md`, Leitfaden Fallen 26/31/37/45/51/58/61/76/92-100.
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
import { CORPUS_CS_WEG_MITTE_KIDS } from "../src/lib/typing/corpusCsWegMitteKids";
import { CORPUS_CS_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusCsWegMitteErwachsene";
import { CORPUS_CS_WEG_ENDE_KIDS } from "../src/lib/typing/corpusCsWegEndeKids";
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
const CHARGE = CORPUS_CS_WEG_ENDE_KIDS;
const ZEILEN = CHARGE.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Alle ANDEREN cs-Zeilen aus der ROHEN Sammelliste (nach Objekt; die geladene hätte Kopien schon verschmolzen). */
const ANDERE_CS = () => CS_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_CS_ZEILEN = (): string[] => ANDERE_CS().map((i) => i.text);
/** Die anderen Kinder-Chargen (Wortbudget Kinder über T1 + T4 + T7 - Falle 45). */
const KINDER_ANDERE = (): string[] => ANDERE_CS().filter((i) => i.stufen.includes("kids")).map((i) => i.text);
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

describe("CS-T7: jede Zeile an ihrer Sprosse (cs und cs-qwerty)", () => {
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
   * GEMESSEN am Ende von CS-T7 (vom Code gezählt, Einheit der vollen Sprosse) - darf künftig nur STEIGEN, nie unter 5.
   * `(` und `[` haben keine eigenen Zeilen.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "!": 36, '"': 17, ":": 17, ";": 8, "'": 5, "-": 16, ")": 11,
    "1": 10, "2": 10, "3": 10, "4": 10, "5": 11, "6": 9, "7": 9, "8": 10, "9": 9, "0": 15,
    "%": 6, "/": 7, "+": 7, "=": 6, _: 7, "*": 6, "&": 7, "<": 6, ">": 6, $: 6, "|": 5, "@": 6, "#": 6, "€": 7, "]": 6,
  };

  it("je Einheit mindestens so viele Zeilen wie gemessen, jede Einheit mindestens 5, ( [ ohne eigene Zeilen", () => {
    const anzahl = new Map<string, number>();
    for (const t of ZEILEN) {
      const e = volleEinheit(t);
      if (e !== null) anzahl.set(e, (anzahl.get(e) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (const [e, min] of Object.entries(MINDESTENS_JE_EINHEIT)) {
      if ((anzahl.get(e) ?? 0) < Math.max(5, min)) zuWenig.push(`„${e}": ${anzahl.get(e) ?? 0} < ${Math.max(5, min)}`);
    }
    for (const [e, n] of anzahl) if (n < 5) zuWenig.push(`„${e}": nur ${n}`);
    for (const e of OHNE_EIGENE_ZEILEN) expect(anzahl.has(e), e).toBe(false);
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    expect([...anzahl.values()].reduce((a, b) => a + b, 0)).toBe(ZEILEN.length);
  });
});

describe("CS-T7: jede Zeile übt die Einheit ihrer Sprosse (W6, Falle 37)", () => {
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

  it("in echten Runden (Kinder) kommen an der Sprosse von ! Ausrufe dieser Charge an (Fokus !)", () => {
    const intro = ordnung().slice(0, sprosseVon("!"));
    const echt = Math.random;
    let s = 4507;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["!"], stufe: "kids", lang: "cs", lernweg: "cs", count: 12 })) {
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

describe("CS-T7: Klammern und Anführungszeichen nie halb", () => {
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
function zahlFehler(t: string): string[] {
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

describe("CS-T7: Form und Zahlen", () => {
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

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg cs, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
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
      "Vstáváme v 7:5 ráno.", "Tramvaj číslo 22.", "Oběd je v 12 hodin.", "Ve 8 hodin.", "Upeče z 4 jablek štrúdl.",
    ]) {
      expect(zahlFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(zahlFehler("V 7:30, ve 12 hodin, ze 4 jablek, 35 Kč, 2 €, 1,5 litru, 1 603 metrů, rok 2024, 70% čokoláda, do 4. B jde Ema.")).toEqual([]);
  });
});

// ── Geschlecht (Glossar §1 Regel 2) ─────────────────────────────────────────

const W_ENDE = "(?=[\\s,.?!:;\"')]|$)";
const GEGENDERTES_DU = new RegExp(
  `(^|\\s)\\p{L}+(l|la|li|ly) jsi${W_ENDE}|(^|\\s)jsi (\\p{L}+(l|la|li|ly|ý|á)|sám|sama)${W_ENDE}`,
  "iu",
);
const GEGENDERTES_ICH = new RegExp(
  `(^|\\s)\\p{L}+(l|la) jsem${W_ENDE}|(^|\\s)jsem (\\p{L}+(l|la|ý|á)|sám|sama|rád|ráda)${W_ENDE}`,
  "iu",
);

describe("CS-T7: keine Zeile legt das Geschlecht des Kindes oder der tippenden Person fest", () => {
  it("kein gegendertes „du“ und kein gegendertes „ich“ (auch nicht vor ! : ; oder Anführung)", () => {
    expect(ZEILEN.filter((z) => GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z))).toEqual([]);
  });

  it("Gegenprobe: „Vyhrál jsi!“, „Jsi připravená?“, „Byla jsem v Brně: hurá!“, „Jsem rád!“ werden gefunden; „Je mi 9 let.“ nicht", () => {
    for (const z of ["Vyhrál jsi!", "Jsi připravená?", '"Kde jsi byla?" ptá se máma.']) expect(GEGENDERTES_DU.test(z), z).toBe(true);
    for (const z of ["Byla jsem v Brně: hurá!", "Jsem rád!", "Dojedl jsem; můžu ven?"]) expect(GEGENDERTES_ICH.test(z), z).toBe(true);
    for (const z of ["Je mi 9 let a chodím do 3. třídy.", "Už se těším na tábor!", "Na Lipně jsme viděli 27 plachetnic."]) {
      expect(GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z), z).toBe(false);
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
 * Eigennamen der Charge (klein) - Personen, Figuren, Vereine, Orte, Landschaften, Titel, Abkürzungen der Wochentage.
 * Jedes grosse Wort mitten im Satz steht hier oder in {@link BEKANNTE_GROSSWOERTER}; sie sind belegt, weil sie Namen sind.
 * Nur Benutztes, nur noch nicht Bekanntes.
 */
const EIGENNAMEN: Readonly<Record<string, string>> = {
  // Vornamen (Mädchen und Jungen gleichwertig; Linh: Familie aus Vietnam)
  ema: "Vorname", klárka: "Vorname (Klára)", matyáš: "Vorname", vojta: "Vorname (Vojtěch)", vojtovi: "Dat. von Vojta",
  dominik: "Vorname", zuzka: "Vorname (Zuzana)", nela: "Vorname", marek: "Vorname", ota: "Vorname (Otakar)", linh: "Vorname (vietnamesisch)",
  eliška: "Vorname", ondra: "Vorname (Ondřej)", bára: "Vorname (Barbora)", anička: "Vorname (Anna)", mia: "Vorname", adam: "Vorname",
  jonáš: "Vorname", matěj: "Vorname", natálie: "Vorname", šimon: "Vorname", jakub: "Vorname", filip: "Vorname",
  jaromír: "Vorname (Jaromír Jágr)", jágr: "Familienname (Eishockeyspieler aus Kladno)",   iv: "römische Vier (Karel IV.)", "d'artagnan": "Romanfigur (Tři mušketýři)", "d'artagnanovi": "Dat. von d'Artagnan",
  // Tiere und Figuren
  mourek: "Katername (tschechisch üblich)", pepík: "Name des Hamsters (Josef)", micce: "Dat. von Micka (Katzenname)",   fifinka: "Figur aus Čtyřlístek", myšpulín: "Figur aus Čtyřlístek", bobík: "Figur aus Čtyřlístek", pinďa: "Figur aus Čtyřlístek",
  spejbla: "Akk. von Spejbl (Marionette, Plzeň)", hurvínka: "Akk. von Hurvínek",
  pat: "Pat a Mat (Trickfilm)", mat: "Pat a Mat (Trickfilm)", krtkovi: "Lok. von Krtek (Zdeněk Miler)", vlčata: "Name eines Skautenoddíls (Wölflinge)",
  člověče: "Člověče, nezlob se (Brettspiel)", scratchi: "Lok. von Scratch (Programmiersprache für Kinder)",
  // Vereine
  kometa: "HC Kometa Brno (Eishockey)", kometo: "Vok. von Kometa", slavia: "SK Slavia Praha", slavie: "Gen. von Slavia",
  sparta: "AC Sparta Praha", spartu: "Akk. von Sparta", dynamo: "HC Dynamo Pardubice", baníku: "Dat. von Baník Ostrava",
  // Läden und Kurse in den &-Zeilen (Namen auf Schildern)
      // Orte, Landschaften, Berge, Flüsse
  česko: "Tschechien", prostějova: "Gen. von Prostějov", klínovci: "Lok. von Klínovec (Krušné hory)", sněžce: "Lok. von Sněžka",
  sněžka: "Schneekoppe (1 603 m)", hradci: "Lok. von Hradec Králové", brno: "Brno", brna: "Gen. von Brno", brně: "Lok. von Brno",
  ostrava: "Ostrava", ostravě: "Lok. von Ostrava", beskydech: "Lok. von Beskydy", beskydami: "Instr. von Beskydy",
  jizerských: "Lok. von Jizerské hory", frýdek: "Frýdek-Místek", místek: "Frýdek-Místek", brandýs: "Brandýs nad Labem-Stará Boleslav",
  labem: "Instr. von Labe", labe: "Elbe", boleslav: "Stará Boleslav", šumavy: "Gen. von Šumava", šumavě: "Lok. von Šumava",
  úpa: "Malá Úpa (Krkonoše)", krkonoších: "Lok. von Krkonoše", polskem: "Instr. von Polsko", svatém: "Svatý Kopeček",
  kopečku: "Lok. von Svatý Kopeček (Zoo Olomouc)", olomouce: "Gen. von Olomouc", olomouci: "Dat. von Olomouc (Sigma Olomouc)",
  valašsku: "Lok. von Valašsko", rožnově: "Lok. von Rožnov pod Radhoštěm", bratislavy: "Gen. von Bratislava", bratislavě: "Lok. von Bratislava",
  telče: "Gen. von Telč", vysočině: "Lok. von Vysočina", vysočiny: "Gen. von Vysočina", jihlavy: "Gen. von Jihlava", ústí: "Ústí nad Labem",
  berouna: "Gen. von Beroun", karlštejn: "Burg Karlštejn", říp: "Berg Říp", lipové: "Lok. von Lipová (Strasse)",
  liberce: "Gen. von Liberec", jablonce: "Gen. von Jablonec nad Nisou", pardubice: "Pardubice", pražského: "Gen. von Pražský hrad",
  kladno: "Rytíři Kladno (Eishockey)", litvínov: "HC Litvínov (Eishockey)", jeseníku: "Lok. von Jeseník", brdech: "Lok. von Brdy",
  třinec: "HC Oceláři Třinec", vítkovicím: "Dat. von Vítkovice (HC Vítkovice Ostrava)", kroměříže: "Gen. von Kroměříž",
  mikulova: "Gen. von Mikulov", lipně: "Lok. von Lipno", lysou: "Akk. von Lysá hora", lysá: "Lysá hora (Beskydy, 1 323 m)",
  chebu: "Gen. von Cheb", kolíně: "Lok. von Kolín", kolín: "Kolín", zahradní: "Zahradní (Strasse)", prahu: "Akk. von Praha",
  litomyšli: "Lok. von Litomyšl", plzni: "Lok. von Plzeň", praděd: "Praděd (1 491 m)", vltava: "Moldau", vídně: "Gen. von Vídeň (Wien)",
  alpách: "Lok. von Alpy",   // Abkürzungen der Wochentage im Stundenplan (Po Út St Čt Pá)
  út: "úterý (Abk.)", st: "středa (Abk.)", čt: "čtvrtek (Abk.)", pá: "pátek (Abk.)",
};

/** Grossgeschriebene Wörter mitten im Satz, die schon im Wortschatz stehen (Orte, Namen, Po im Stundenplan, Kč). */
const BEKANNTE_GROSSWOERTER = new Set([
  "praha", "praze", "prahy", "písku", "tábora", "kč", "po", "anna", "ameriky", "evropě", "česka", "česku", "slovensku", "rakousku",
  "králové", "stará", "malá", "a", "b", "klára",
  // Namen, die als Wort schon bekannt sind (Karel IV., Hund Ben, Comic Čtyřlístek, Schilder Buchta & Koláč, Věda & technika, Papír & barvy)
  "karel", "ben", "čtyřlístek", "buchta", "koláč", "věda", "papír", "vietnamu", "usa", "new", "yorku", "kanady",
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
  "Praha": ["praha", "praze", "prahy", "prahu", "pražského"],
  "Středočeský": ["brdech", "kladno", "karlštejn", "berouna", "kolíně", "kolín", "brandýs", "říp"],
  "Jihočeský": ["písku", "šumavě", "šumavy", "lipně", "tábora"],
  "Plzeňský": ["plzni"],
  "Karlovarský": ["chebu", "klínovci", "karlovarské"],
  "Ústecký": ["ústí", "litvínov"],
  "Liberecký": ["liberce", "jablonce", "jizerských"],
  "Královéhradecký": ["hradci", "krkonoších", "úpa"],
  "Pardubický": ["pardubice", "pardubický", "litomyšli"],
  "Vysočina": ["telče", "jihlavy", "vysočině", "vysočiny"],
  "Jihomoravský": ["brno", "brna", "brně", "mikulova", "kometa", "kometo"],
  "Olomoucký": ["olomouce", "olomouci", "kopečku", "prostějova", "jeseníku"],
  "Zlínský": ["kroměříže", "valašsku", "rožnově"],
  "Moravskoslezský": ["ostrava", "ostravě", "frýdek", "beskydech", "beskydami", "lysou", "lysá", "baníku", "třinec", "vítkovicím"],
};
const MAEHREN_SCHLESIEN = ["Jihomoravský", "Olomoucký", "Zlínský", "Moravskoslezský"];
/** GEMESSEN am Ende von CS-T7 - Obergrenze je Kraj, Mindestzahl Mähren/Schlesien. */
const HOECHSTENS_JE_KRAJ = 12;
const MINDESTENS_MAEHREN = 21;

function zeilenJeKraj(zeilen: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [kraj, formen] of Object.entries(KRAJE)) out[kraj] = zeilen.filter((z) => woerterKlein(z).some((w) => formen.includes(w))).length;
  return out;
}

describe("CS-T7: Orte und Namen", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein Name der Liste oder ein bekanntes Grosswort", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it(`alle vierzehn Kraje haben eine Zeile, keiner mehr als ${HOECHSTENS_JE_KRAJ}; Mähren und Schlesien mindestens ${MINDESTENS_MAEHREN}`, () => {
    const je = zeilenJeKraj(ZEILEN);
    expect(Object.entries(je).filter(([, n]) => n === 0)).toEqual([]);
    expect(Object.entries(je).filter(([, n]) => n > HOECHSTENS_JE_KRAJ)).toEqual([]);
    expect(MAEHREN_SCHLESIEN.reduce((s, k) => s + je[k], 0)).toBeGreaterThanOrEqual(MINDESTENS_MAEHREN);
  });

  it("€ steht nur in Zeilen über das Ausland oder das Zeichen - nie mit einem Ort in Tschechien", () => {
    const euro = ZEILEN.filter((z) => z.includes("€"));
    expect(euro.length).toBeGreaterThanOrEqual(6);
    const ortCz = (z: string) => Object.values(zeilenJeKraj([z])).some((n) => n > 0);
    expect(euro.filter(ortCz)).toEqual([]);
  });

  it("Gegenprobe: unbekannte Grosswörter, Bindestrich-Orte, Anführung und Satzanfänge werden richtig gelesen", () => {
    expect(unbekannteGrosswoerter("Ema jede do Atlantidy.")).toEqual(["Atlantidy"]);
    expect(unbekannteGrosswoerter("Frýdek-Místek je město.")).toEqual([]);
    expect(unbekannteGrosswoerter('"Pojď!" volá Ema.')).toEqual([]);
    expect(unbekannteGrosswoerter("Prší? Zítra ne.")).toEqual([]);
    expect(unbekannteGrosswoerter("Prší a Zítra ne.")).toEqual(["Zítra"]);
    expect(zeilenJeKraj(["V Brně je hrad.", "Ema spí."])["Jihomoravský"]).toBe(1);
    expect(["V Brně stojí káva 2 €."].filter((z) => Object.values(zeilenJeKraj([z])).some((n) => n > 0))).toHaveLength(1);
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

describe("CS-T7: gekürzt serviert - kein Grossbuchstabe mitten im Satz", () => {
  it("jede Zeile, die vor ihrer Sprosse gekürzt kommt, liest sich ohne Grosswort mitten im Satz", () => {
    const fehler = ZEILEN.flatMap((z) => fruehNahtFehler(z).map((f) => `"${z}" @ ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Máma volá: \"Večeře!\"“ würde vor „:“ zu „Máma volá Večeře“; ein Ausruf mitten in der Zeile ebenso", () => {
    expect(fruehNahtFehler('Máma volá: "Večeře je hotová!"').length).toBeGreaterThan(0);
    expect(fruehNahtFehler("Hurá! Prázdniny začínají.").length).toBeGreaterThan(0);
    expect(fruehNahtFehler('"Pojď ven," volá Matyáš z dvorku.')).toEqual([]);
    expect(fitText("Tři největší města Česka: Praha, Brno a Ostrava.", allowedAt(sprosseVon(":") - 1), "cs")).toBe(
      "Tři největší města Česka Praha, Brno a Ostrava.",
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

/** CS-T1 §4: Bewegungsverben (jet, jít) und les - hier gemessen 1, Grenze 3. */
const BEWEGUNG =
  /(^|\s)(ne)?(u|od|do|při|pře|vy|za|s|po)?(jet|jedu|jedeš|jede|jedeme|jedete|jedou|jel|jela|jeli|jely|jít|jdu|jdeš|jde|jdeme|jdete|jdou|jdi|jděte|šel|šla|šli|půjdeme|les|lesa|lese|lesem|lesy|lesů)(?=[\s,.?!:;")]|$)/iu;
const BEWEGUNG_GRENZE = 3;

describe("CS-T7: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Wortbudget Kinder: kein Inhaltswort in mehr als 8 Zeilen über alle Kinder-Chargen (T1 + T4 + T7 + spätere)", () => {
    const fehler = zuHaeufig([...ZEILEN, ...KINDER_ANDERE()]);
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

  it("Gegenprobe: kurva (Kern) und vole (Wortbasis) gefunden; knihovně, sekunda, přestávce nicht", () => {
    expect(istKernGesperrtCs("kurva")).toBe(true);
    expect(gesperrtCs("vole")).toBe(true);
    for (const w of ["knihovně", "sekunda", "přestávce", "zavináč"]) expect(gesperrtCs(w), w).toBe(false);
  });
});

/**
 * Wörter dieser Charge, die NICHT in `WORDS_CS`, `STUFE_VOCAB_CS` oder `NACHTRAG_CS` (Tatoeba-Formen mit mindestens zwei
 * Belegen) stehen und keine Eigennamen sind - mit Begründung, weil es für Tschechisch kein Wörterbuch gibt (Falle 61/98).
 * Alle sind gewöhnliche Wörter bzw. regelmässige Formen [G: eigenes Sprachwissen]; sie gehören in die Lese-Abnahme durch
 * eine Person mit Tschechisch als Erstsprache (P7). Über den Korpus kommen sie ins Vorlese-Lexikon.
 */
const OHNE_TATOEBA_BELEG: Readonly<Record<string, string>> = {
  náledí: "Glatteis (n.)", pst: "Lautwort: leise!", kočárku: "Lok. von kočárek (Kinderwagen)", dřímá: "3. Sg. von dřímat (schlummern)",
  kopřivy: "Nom. Pl. von kopřiva (Brennnessel)", nezakopneš: "2. Sg. Futur verneint von zakopnout (stolpern)", keřem: "Instr. von keř (Strauch)",
  průvan: "Durchzug (m.)", brankář: "Torwart (m.)", penaltu: "Akk. von penalta (Elfmeter)", koukej: "Imp. von koukat (schau!)",
  rybníkem: "Instr. von rybník (Teich)", klene: "3. Sg. von klenout se (sich wölben)", tábor: "Ferienlager (m.)",
  gratulujeme: "1. Pl. von gratulovat", křeček: "Hamster (m.)", písemka: "Klassenarbeit (f.)", matiky: "Gen. von matika (Mathe, hovorově)",
  dopadla: "l-Part. f. von dopadnout (ausgehen)", zmrzlinový: "Adj. (Eis-)", pohár: "Becher, Pokal (m.)", spíme: "1. Pl. von spát",
  štiku: "Akk. von štika (Hecht)", pardubický: "Adj. zu Pardubice (pardubický perník)", karlovarské: "Adj. Pl. zu Karlovy Vary (oplatky)",
  oplatky: "Oblaten (Pl.), Kurort-Waffeln", dobroty: "Nom. Pl. von dobrota (Leckerei)", kakao: "Kakao (n.)", komiks: "Comic (m.)",
  hrnečku: "Vok. von hrneček (Töpfchen; „Hrnečku, vař!“)", vař: "Imp. von vařit (koche!)", pohádce: "Lok. von pohádka (Märchen)",
  skautský: "Adj. (Pfadfinder-)", oddíl: "Gruppe der Pfadfinder (m.)", šeptá: "3. Sg. von šeptat (flüstern)", povel: "Befehl, Kommando (m.)",
  tenisky: "Turnschuhe (Pl.)", předsíně: "Gen. von předsíň (Flur)", neotvírat: "Inf. verneint (nicht öffnen)", modrooká: "Adj. f. (blauäugig)",
  lidová: "Adj. f. (Volks-)", kočičkou: "Instr. von kočička (Kätzchen)", vařili: "l-Part. Pl. von vařit", potřetí: "zum dritten Mal",
  povzdechne: "3. Sg. Futur von povzdechnout si (seufzen)", limonáda: "Limonade (f.)", batohu: "Gen. von batoh (Rucksack)",
  svačina: "Pausenbrot (f.)", pláštěnka: "Regencape (f.)", vlajky: "Gen. von vlajka (Fahne)", kompas: "Kompass (m.)",
  dalekohled: "Fernglas (m.)", knedlíky: "Knödel (Pl.)", klubovny: "Gen. von klubovna (Klubraum)", vyjmenovaná: "Adj. n. Pl. (vyjmenovaná slova)",
  bydlit: "wohnen (Inf.)", blýskat: "blitzen (Inf., blýskat se)", polykat: "schlucken (Inf.)", chalupě: "Lok. von chalupa (Wochenendhaus)",
  celer: "Sellerie (m.)", řepa: "Rübe (f.)", lega: "Gen. von lego", mušketýrovi: "Dat. von mušketýr", babičkou: "Instr. von babička",
  "rock'n'roll": "Rock 'n' Roll (Tanz)", apostrof: "Apostroph (m.)", jméně: "Lok. von jméno", jezevčík: "Dackel (m.)",
  hřebeni: "Lok. von hřeben (Kamm, Bergkamm)", lyžák: "Skikurs der Schule (m., hovorově)", bílých: "Lok. Pl. von bílý",
  dresech: "Lok. Pl. von dres (Trikot)", dědou: "Instr. von děda", fandí: "3. Sg. von fandit (Fan sein)", nevynechá: "3. Sg. Futur verneint von vynechat",
  pravítko: "Lineal (n.)", aktovce: "Lok. von aktovka (Schulranzen)", chalupy: "Nom. Pl. von chalupa", skanzenu: "Lok. von skanzen (Freilichtmuseum)",
  vodníci: "Nom. Pl. von vodník (Wassermann)", víly: "Nom. Pl. von víla (Fee)", hejkalové: "Nom. Pl. von hejkal (Waldgeist)",
  mrkví: "Instr. von mrkev (Karotte)", mákem: "Instr. von mák (Mohn)", brácha: "Bruder (hovorově)", florbal: "Unihockey (m.)",
  šedý: "grau (Adj. m.)", chováme: "1. Pl. von chovat (halten)", strejda: "Onkel (hovorově)", krajské: "Adj. n. (Kreis-, krajské město)",
  bramboračka: "Kartoffelsuppe (f.)", vylezeme: "1. Pl. Futur von vylézt (hinaufsteigen)", nastoupí: "3. Sg. Futur von nastoupit (eintreten)",
  aktovkou: "Instr. von aktovka", dresu: "Lok. von dres", bodují: "3. Pl. von bodovat (punkten)", sídliště: "Gen. von sídliště (Siedlung)",
  postoupila: "l-Part. f. von postoupit (aufrücken)", prodloužení: "Verlängerung (n.)", hrnky: "Akk. Pl. von hrnek (Becher)",
  hradu: "Gen. von hrad (Burg)", kroužek: "Nachmittags-AG; Ring über ů (m.)", čárkou: "Instr. von čárka (Strich über ú)", robotiky: "Gen. von robotika", přihlásilo: "l-Part. n. von přihlásit se",
  klubovně: "Lok. von klubovna", těsta: "Gen. von těsto (Teig)", lívance: "Akk. Pl. von lívanec (Pfannkuchen)", nájezdy: "Akk. Pl. von nájezd (Penaltyschiessen)",
  upeče: "3. Sg. Futur von upéct (backen)", štrúdl: "Strudel (m.)", paneláku: "Lok. von panelák (Plattenbau)", kornout: "Waffeltüte (m.)",
  lízátko: "Lutscher (n.)", přestupuje: "3. Sg. von přestupovat (wechseln)", bramboráky: "Akk. Pl. von bramborák (Kartoffelpuffer)",
  oloupeme: "1. Pl. Futur von oloupat (schälen)", keramiky: "Gen. von keramika", prospí: "3. Sg. von prospat (verschlafen)",
  gólů: "Gen. Pl. von gól", hrnce: "Gen. von hrnec (Topf)", nalijeme: "1. Pl. Futur von nalít (eingiessen)", litru: "Gen. von litr",
  vstáváme: "1. Pl. von vstávat", brouci: "Nom. Pl. von brouk (Käfer)", hrací: "Adj. (Spiel-, hrací kostka)", stěn: "Gen. Pl. von stěna (Seite, Fläche)",
  hřibů: "Gen. Pl. von hřib (Steinpilz)", bráškovi: "Dat. von bráška (Brüderchen)", vyrážejí: "3. Pl. von vyrážet (aufbrechen)",
  rajčat: "Gen. Pl. von rajče (Tomate)", plachetnic: "Gen. Pl. von plachetnice (Segelboot)", nohách: "Lok. Pl. von noha",
  pastelek: "Gen. Pl. von pastelka (Buntstift)", penálu: "Lok. von penál (Federmäppchen)", celých: "Gen. Pl. von celý (ganze)",
  šlapeme: "1. Pl. von šlapat (stapfen, wandern; hovorově)", dojíždí: "3. Sg. von dojíždět (pendeln)", přestávce: "Lok. von přestávka (Pause)",
  svačíme: "1. Pl. von svačit (Pausenbrot essen)", záchranka: "Rettungsdienst (f., hovorově)", vře: "3. Sg. von vřít (kochen, sieden)",
  nasbíráme: "1. Pl. Futur von nasbírat", kaštanů: "Gen. Pl. von kaštan (Kastanie)", hokeji: "Lok. von hokej", tričku: "Lok. von tričko (T-Shirt)",
  cedulka: "Schildchen, Etikett (f.)", papírnictví: "Schreibwarenladen (n.)", sleva: "Rabatt (f.)", výprodej: "Ausverkauf (m.)",
  brusle: "Schlittschuhe (Pl.)", povolená: "Part. f. von povolit (erlaubt)", rychlost: "Geschwindigkeit (f.)", pendolino: "Pendolino (Zug, n.)",
  uhání: "3. Sg. von uhánět (rasen)", zlomku: "Lok. von zlomek (Bruch)", čitatel: "Zähler (m.)", jmenovatel: "Nenner (m.)",
  šikmá: "schräg (Adj. f.)", lomítko: "Schrägstrich (n.)", plechu: "Gen. von plech (Backblech)", pečeme: "1. Pl. von péct",
  tvarohem: "Instr. von tvaroh (Quark)", spočítá: "3. Sg. Futur von spočítat", sčítání: "Addition (n.)", plusko: "Pluspunkt (Schulsprache, n.)",
  aktovky: "Gen. von aktovka", předvolbou: "Instr. von předvolba (Vorwahl)", prvňáček: "Erstklässler (m., generisch)", km: "Abk. von kilometr",
  rovnítko: "Gleichheitszeichen (n.)", kartička: "Kärtchen (f.)", doplň: "Imp. von doplnit (ergänze!)", podtržítko: "Unterstrich (n.)",
  názvech: "Lok. Pl. von název", souborů: "Gen. Pl. von soubor (Datei)", kaštany: "Akk. Pl. von kaštan", fotkami: "Instr. Pl. von fotka",
  zvídavé: "Adj. Pl. (wissbegierig)", hesla: "Gen. von heslo (Passwort)", čarou: "Instr. von čára (pod čarou)", hvězdičkou: "Instr. von hvězdička (Stern)",
  tajence: "Lok. von tajenka (Rätsellösung)", recepty: "Nom. Pl. von recept", kuchařce: "Lok. von kuchařka (Kochbuch)", označené: "Part. Pl. von označit",
  kalkulačce: "Lok. von kalkulačka", ampersand: "Name des Zeichens & (Lehnwort)", míří: "3. Sg. von mířit (unterwegs sein)", technika: "Technik (f.)",
  nápis: "Aufschrift (m.)", zve: "3. Sg. von zvát (einladen)", druháček: "Zweitklässler (m., generisch)", znaménko: "Zeichen (Rechenzeichen, n.)",
  zamrzne: "3. Sg. Futur von zamrznout (gefrieren)", šipka: "Pfeil (f.)", obrazovce: "Lok. von obrazovka (Bildschirm)", zobáček: "Schnäbelchen (m.)",
  znaků: "Gen. Pl. von znak", menšímu: "Dat. von menší", číslu: "Dat. von číslo", turisté: "Nom. Pl. von turista", měnili: "l-Part. Pl. von měnit (wechseln)",
  koruny: "Akk. Pl. von koruna (Krone)", bankovku: "Akk. von bankovka (Geldschein)", svislá: "senkrecht (Adj. f.)", čára: "Strich, Linie (f.)",
  tyčku: "Akk. von tyčka (Stab)", kreslíme: "1. Pl. von kreslit", kompot: "Kompott (m.)", rychlík: "Schnellzug (m.)",
  zavináč: "Zeichen @ (wörtlich: Rollmops)", mailové: "Adj. f. Gen. (e-mailové adresy)", adresy: "Gen. von adresa", rolka: "Rolle (f.)",
  rybou: "Instr. von ryba", posíláme: "1. Pl. von posílat", babiččina: "Adj. f. (Grossmutters)", kroužku: "Dat. von kroužek", znaku: "Gen. von znak",
  mřížka: "Gitter; Name des Zeichens # (f.)", zmáčkni: "Imp. von zmáčknout (drücke!)", piškvorkách: "Lok. von piškvorky (Kreis und Kreuz)",
  mřížku: "Akk. von mřížka", nástěnce: "Lok. von nástěnka (Pinnwand)", notách: "Lok. Pl. von nota", křížek: "Kreuz; Kreuz in der Musik (m.)",
  tónu: "Gen. von tón", školním: "Lok. von školní", časopise: "Lok. von časopis (Zeitschrift)", štítek: "Etikett, Schlagwort (m.)",
  korunami: "Instr. Pl. von koruna", euru: "Dat. von euro", závorek: "Gen. Pl. von závorka (Klammer)", hranaté: "eckig (Adj. Pl.)",
  závorky: "Nom. Pl. von závorka", branky: "Nom. Pl. von branka (kleines Tor)", kč: "Abk. von koruna česká (Krone)", obchodem: "Instr. von obchod (nad obchodem)",
};

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat(), ...NACHTRAG_CS].map((w) => w.toLowerCase()),
);

/** Wörter (ab zwei Buchstaben), die weder vorher bekannt waren noch begründet in einer der zwei Listen stehen. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of woerterKlein(z)) {
      if (w.length >= 2 && !VORHER_BEKANNT.has(w) && !(w in OHNE_TATOEBA_BELEG) && !(w in EIGENNAMEN)) out.add(w);
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
const DIAKRITIK_GELESEN: ReadonlySet<string> = new Set<string>([]);

/** Die Stimme liest Leerzeichen-Wörter; technische Wörter (Adressen, Rechnungen, Lückenwörter) liest sie als Zeichen. */
const stimmWoerter = (zeile: string): string[] =>
  zeile
    .split(/\s+/)
    .map((roh) => roh.replace(/^["(]+|[.,!?:;")]+$/g, ""))
    .filter((w) => w.length >= 2 && !TECHNISCH.test(w));

describe("CS-T7: Belege, Stimme, Diakritik", () => {
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

describe("CS-T7: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("die Vergleichsmenge ist voll (rohe cs-Liste mit T1-T6, Serien und Banken geladen)", () => {
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(T1));
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
    expect(nahAnCs("Ticho, v kočárku spí miminko!")).toBe(true);
    expect(nahAnCs("Vltava je dlouhá 430 kilometrů.")).toBe(true);
    expect(jaccard(wortMenge("Znak / se jmenuje lomítko."), wortMenge("Znak + se jmenuje plus."))).toBeGreaterThanOrEqual(0.5);
  });
});

// ── Anker und Auslieferung ────────────────────────────────────────────────

describe("CS-T7: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als geschlossenen Block HINTER CS-T6, die geladene und korpusFuer(\"cs\") jede Zeile", () => {
    const ab = CS_ROH.indexOf(CHARGE[0]);
    expect(CS_ROH.slice(ab, ab + CHARGE.length)).toEqual(CHARGE);
    const letzteT6 = Math.max(...CORPUS_CS_WEG_MITTE_ERWACHSENE.map((i) => CS_ROH.indexOf(i)));
    expect(ab).toBeGreaterThan(letzteT6);
    expect(CS_ROH.slice(0, ab).some((i) => CORPUS_CS_WEG_MITTE_KIDS.includes(i))).toBe(true);
    const geladen = new Set(CS_GELADEN.map((i) => i.text));
    const fuer = new Set(korpusFuer("cs").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t) || !fuer.has(t))).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker, als geschlossener Block hinter dem Stand nach CS-T6 (18.853)", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_CS()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    const eigeneIds = CHARGE.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(eigeneIds).size).toBe(ZEILEN.length);
    // gemessen 09.10.2026 auf db21015e: 18.853 ⇒ 19.160, „307 neu".
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(start).toBeGreaterThanOrEqual(18853);
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
    const probe = { text: "Zzz probe cs t7!", kind: "satz" as const, stufen: ["kids" as const] };
    expect(manifestFor([...alle, probe]).ids.length).toBe(KORPUS_ANKER.length + 1);
    const kopie = { text: "Jedeme lesem!", kind: "satz" as const, stufen: ["kids" as const], nurWeg: "cs" as const };
    expect(manifestFor([...alle, kopie]).ids.length).toBe(KORPUS_ANKER.length);
  });

  for (const l of TASTATUREN) {
    it(`${l}: am Ende des Lernwegs bekommen Kinder jede Zeile vollständig, vor í keine, an ¨ nur gekürzte (ohne ! " : ; - ( ), Ziffern, Zeichen)`, () => {
      const o = ordnung(l);
      const alles = allowedAt(o.length, l);
      const geliefert = new Set(corpusItemsFor({ stufe: "kids", allowed: alles, lang: "cs", lernweg: "cs" }));
      expect(ZEILEN.filter((t) => !geliefert.has(t))).toEqual([]);
      const vorI = allowedAt(o.indexOf("í"), l);
      expect(ZEILEN.filter((t) => fitText(t, vorI, "cs") !== null)).toEqual([]);
      const anTrema = allowedAt(44, l);
      const gekuerzt = ZEILEN.map((z) => fitText(z, anTrema, "cs")).filter((s): s is string => s !== null);
      expect(gekuerzt.filter((t) => /[^\p{L} .,?]/u.test(t))).toEqual([]);
      expect(gekuerzt.length).toBeGreaterThan(80);
      const lieferung = corpusItemsFor({ stufe: "kids", allowed: anTrema, lang: "cs", lernweg: "cs" });
      expect(lieferung.some((t) => gekuerzt.includes(t))).toBe(true);
    });
  }

  it("Jugendliche und Erwachsene bekommen keine dieser Zeilen; Weg „de“ und Weg „it“ auch nicht", () => {
    const alles = allowedAt(ordnung().length);
    for (const stufe of ["teens", "erwachsen"] as const) {
      const g = new Set(corpusItemsFor({ stufe, allowed: alles, lang: "cs", lernweg: "cs" }));
      expect(ZEILEN.filter((t) => g.has(t)), stufe).toEqual([]);
    }
    setLayout("de");
    const de = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
