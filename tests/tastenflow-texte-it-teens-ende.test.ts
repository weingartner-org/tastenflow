/**
 * ★★★ Wächter IT-T8 (03.10.2026): die it-Texte für Jugendliche (12-16) am ENDE
 * des Lernwegs (`corpusItWegEndeTeens.ts`) - Satzzeichen `? ! " : ; - ( )`,
 * Ziffern, Sonderzeichen `% & / + * = _ < > $ | € @ #` und das letzte Paar
 * (`[ ]` auf `it`, `{ }` auf `it-qzerty`). Vorbilder: der Mitte-Wächter derselben
 * Stufe (`tastenflow-texte-it-teens-mitte.test.ts`, IT-T5) und der spanische
 * Ende-Wächter (`tastenflow-texte-es-teens-ende.test.ts`, ES-T8); Bauplan
 * `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §1 I4/I7-I9/I19, §3, §5;
 * Leitfaden Fallen 26/31/37/45/48/51/58/76; Befund
 * `BEFUND-2026-10-02-IT-T8-TEENS-ENDE.md`.
 *
 * Zwei Sprossen je Zeile werden AUSGERECHNET, auf BEIDEN Pflicht-Tastaturen:
 *  - die VOLLE Sprosse: ab ihr erscheint die Zeile mit jedem ihrer Zeichen -
 *    sie trägt das Neue dieser Sprosse, sonst läge sie früher;
 *  - die BUCHSTABEN-Sprosse: ab ihr wird sie überhaupt serviert (`? ! " : ; -
 *    ( )` sind auf Weg „it" weglassbar, Befund IT-T4 §2). Sie liegt bei jeder
 *    Zeile bei `g` oder später - nie vor Maiusc, nie in den frühen Runden von T2.
 * Dazu: früh serviert kein fremder Grossbuchstabe mitten in der Zeile (Weg „it"
 * hat keine Frühfassungen), Zahlformat (I19), `€` nur in Italien und San Marino,
 * lange Zeilen für „Der lange Satz", Orte aus dem ganzen Sprachraum, Wortbudget
 * über alle Jugend-Chargen, Sperrliste, keine Kopie, kein Paar, nichts fast
 * gleich. Jede Regel hat eine Gegenprobe - ein Wächter, der nie anschlägt,
 * beweist nichts.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, toLayoutText, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { CORPUS_IT_WEG_ENDE_TEENS } from "../src/lib/typing/corpusItWegEndeTeens";
import { CORPUS_IT_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusItWegFruehKids";
import { CORPUS_IT_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusItWegFruehTeens";
import { CORPUS_IT_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusItWegFruehErwachsene";
import { CORPUS_IT_WEG_MITTE_TEENS } from "../src/lib/typing/corpusItWegMitteTeens";
import { CORPUS_IT_WEG_MITTE_KIDS } from "../src/lib/typing/corpusItWegMitteKids";
import { CORPUS_IT_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusItWegMitteErwachsene";
import { CORPUS_IT_WEG_ENDE_ERWACHSENE } from "../src/lib/typing/corpusItWegEndeErwachsene";
import { CORPUS_IT_WEG_ENDE_KIDS } from "../src/lib/typing/corpusItWegEndeKids";
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
const ZEILEN = CORPUS_IT_WEG_ENDE_TEENS.map((i) => i.text);
/**
 * Die anderen it-Chargen - Kopien, Ledger-Schlüssel, Paare und „fast gleich" werden gegen sie geprüft.
 * ★ Merge 03.10.2026 (`feat/tastenflow` `38387ca7`): dazu IT-T6 (Erwachsene Mitte) und IT-T9 (Erwachsene Ende).
 */
const ANDERE_CHARGEN = [
  CORPUS_IT_WEG_FRUEH_KIDS,
  CORPUS_IT_WEG_FRUEH_ERWACHSENE,
  CORPUS_IT_WEG_FRUEH_TEENS,
  CORPUS_IT_WEG_MITTE_TEENS,
  CORPUS_IT_WEG_MITTE_KIDS,
  CORPUS_IT_WEG_MITTE_ERWACHSENE,
  CORPUS_IT_WEG_ENDE_ERWACHSENE,
  CORPUS_IT_WEG_ENDE_KIDS, // ★ IT-T7 (03.10.2026, nach T8 gemergt): Kinder-Ende - steht in CORPUS_IT HINTER dieser Charge
];
const ANDERE_IT_ZEILEN = ANDERE_CHARGEN.flatMap((c) => c.map((i) => i.text));
/** Die früheren Jugend-Chargen - das Wortbudget gilt je STUFE (Falle 45): T2 + T5 + diese. */
const JUGEND_FRUEHER = [...CORPUS_IT_WEG_FRUEH_TEENS, ...CORPUS_IT_WEG_MITTE_TEENS].map((i) => i.text);
/** Paare, deren schliessende Hälfte die Zeile trägt: sie zählt an der schliessenden Sprosse. */
const PAAR: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
/** Öffnende Hälften - an ihrer Sprosse steht nie eine Zeile (Klammern sind ein festes Paar, D1 Nr. 19). */
const OEFFNEND = new Set(["(", "[", "{"]);
const mitEckig = (t: string) => /[[\]]/.test(t);
const mitGeschweift = (t: string) => /[{}]/.test(t);
/** Gibt es die Zeile auf dieser Tastatur überhaupt? `it` hat kein `{ }`, `it-qzerty` kein `[ ]` (`onlyExistingKeys`). */
const aufTastatur = (t: string, l: LayoutId) => (l === "it" ? !mitGeschweift(t) : !mitEckig(t));

const ordnung = new Map<LayoutId, string[]>();
function reihenfolge(layout: LayoutId): string[] {
  let o = ordnung.get(layout);
  if (!o) {
    setLayout(layout);
    o = introOrder("it");
    ordnung.set(layout, o);
  }
  setLayout(layout);
  return o;
}
const norm = (t: string) => t.replace(/\s+/g, " ").trim();
type Sprossen = { volle: number | null; buchst: number | null; frueh: string[] };
const cache = new Map<string, Sprossen>();
/** Volle Sprosse, Buchstaben-Sprosse und die früh servierten Fassungen einer Zeile. */
function sprossen(text: string, layout: LayoutId): Sprossen {
  const k = `${layout}|${text}`;
  const c = cache.get(k);
  if (c) {
    setLayout(layout);
    return c;
  }
  const o = reihenfolge(layout);
  const ziel = norm(toLayoutText(text));
  const r: Sprossen = { volle: null, buchst: null, frueh: [] };
  for (let n = 1; n <= o.length; n++) {
    const f = fitText(text, allowedFromIntroduced(o.slice(0, n), "it"), "it");
    if (f !== null && r.buchst === null) r.buchst = n;
    if (f !== null && f !== ziel && !r.frueh.includes(f)) r.frueh.push(f);
    if (f === ziel) {
      r.volle = n;
      break;
    }
  }
  cache.set(k, r);
  return r;
}
const einheitVon = (text: string, layout: LayoutId): string | null => {
  const v = sprossen(text, layout).volle;
  return v === null ? null : reihenfolge(layout)[v - 1];
};
/** Die Sprosse von `g` - die erste Buchstaben-Einheit nach Maiusc und `. ,` (it 23, it-qzerty 22). */
const gSprosse = (l: LayoutId) => reihenfolge(l).indexOf("g") + 1;

// ── Sprossen ─────────────────────────────────────────────────────────────

describe("IT-T8: jede Zeile an ihrer Sprosse (it und it-qzerty)", () => {
  it("die Folge ab Sprosse 37 - gemessen, nicht geglaubt: auf it endet sie mit [ ], auf it-qzerty mit { }", () => {
    const vorn = `? ! " : ; - ( ) 1 2 3 4 5 6 7 8 9 0 % & / + * = _ < > $ | € @ #`;
    expect(reihenfolge("it")[35]).toBe("x");
    expect(reihenfolge("it").slice(36).join(" ")).toBe(`${vorn} [ ]`);
    expect(reihenfolge("it-qzerty")[35]).toBe("x");
    expect(reihenfolge("it-qzerty").slice(36).join(" ")).toBe(`${vorn} { }`);
    expect(gSprosse("it")).toBe(23);
    expect(gSprosse("it-qzerty")).toBe(22);
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile erscheint vollständig ab Sprosse 37, wird nie vor „g" serviert, minTier stimmt`, () => {
      const fehler: string[] = [];
      for (const item of CORPUS_IT_WEG_ENDE_TEENS) {
        if (!aufTastatur(item.text, l)) continue; // eigener Test unten
        const s = sprossen(item.text, l);
        if (s.volle === null || s.volle < 37) fehler.push(`"${item.text}": volle Sprosse ${s.volle}`);
        if (s.buchst === null || s.buchst < gSprosse(l)) fehler.push(`"${item.text}": schon an Sprosse ${s.buchst} serviert`);
        const tier = minTierFor(item.text, "it");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
      expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
    });
  }

  it("`[ ]`-Zeilen gibt es nur auf it, `{ }`-Zeilen nur auf it-qzerty - auf der anderen Tastatur an KEINER Sprosse", () => {
    const eckig = ZEILEN.filter(mitEckig);
    const geschweift = ZEILEN.filter(mitGeschweift);
    expect(eckig.length).toBeGreaterThanOrEqual(6);
    expect(geschweift.length).toBeGreaterThanOrEqual(6);
    for (const t of eckig) {
      expect(sprossen(t, "it-qzerty").buchst, t).toBeNull();
      expect(einheitVon(t, "it"), t).toBe("]");
    }
    for (const t of geschweift) {
      expect(sprossen(t, "it").buchst, t).toBeNull();
      expect(einheitVon(t, "it-qzerty"), t).toBe("}");
    }
    expect(ZEILEN.filter((t) => mitEckig(t) && mitGeschweift(t))).toEqual([]);
  });

  it("it und it-qzerty ergeben für jede Zeile (ausser den Klammer-Paaren der letzten Sprosse) dieselbe Einheit", () => {
    const fehler = ZEILEN.filter((t) => !mitEckig(t) && !mitGeschweift(t) && einheitVon(t, "it") !== einheitVon(t, "it-qzerty"));
    expect(fehler).toEqual([]);
  });

  /** Enthält die Zeile die Einheit ihrer Sprosse? Bei einem Paar zählt das schliessende Zeichen mit seinem Gegenstück. */
  const traegtEinheit = (t: string, u: string) => t.includes(u) && (PAAR[u] === undefined || t.includes(PAAR[u]));

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile trägt die Einheit ihrer Sprosse (bei Klammern beide Hälften)`, () => {
      const fehler = ZEILEN.filter((t) => aufTastatur(t, l))
        .filter((t) => !traegtEinheit(t, einheitVon(t, l) ?? "∅"))
        .map((t) => `"${t}" an ${einheitVon(t, l)}`);
      expect(fehler).toEqual([]);
    });
  }

  /**
   * GEMESSEN am Ende von IT-T8 (vom Code gezählt, auf beiden Tastaturen gleich) -
   * darf künftig nur STEIGEN. Die öffnenden Hälften ( [ { haben keine eigenen
   * Zeilen (festes Paar); jede andere Sprosse hat mindestens 6.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "?": 32, "!": 28, '"': 18, ":": 20, ";": 15, "-": 14, ")": 16,
    "1": 8, "2": 10, "3": 7, "4": 8, "5": 9, "6": 8, "7": 9, "8": 7, "9": 9, "0": 19,
    "%": 8, "&": 7, "/": 8, "+": 7, "*": 7, "=": 7, _: 7, "<": 7, ">": 7, $: 7, "|": 7, "€": 9, "@": 8, "#": 8,
    "]": 8, "}": 8,
  };
  for (const l of TASTATUREN) {
    it(`${l}: je Einheit ab 37 mindestens so viele Zeilen wie gemessen, nie unter 6 - an ( [ { keine`, () => {
      const o = reihenfolge(l);
      const anzahl = new Map<string, number>();
      for (const t of ZEILEN) {
        const u = einheitVon(t, l);
        if (u !== null) anzahl.set(u, (anzahl.get(u) ?? 0) + 1);
      }
      const zuWenig: string[] = [];
      for (const u of o.slice(36)) {
        if (OEFFNEND.has(u)) {
          expect(anzahl.get(u) ?? 0, u).toBe(0);
          continue;
        }
        const soll = Math.max(6, MINDESTENS_JE_EINHEIT[u] ?? 6);
        if ((anzahl.get(u) ?? 0) < soll) zuWenig.push(`${u}: ${anzahl.get(u) ?? 0} < ${soll}`);
      }
      expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    });
  }

  it("Gegenprobe: Sprossen werden richtig gerechnet, eine Zeile ohne Buchstaben ab g käme zu früh, eine Klammer nie halb", () => {
    expect(einheitVon("Chi ha preso il mio quaderno di chimica?", "it")).toBe("?");
    expect(einheitVon("Hai visto? Che gol!", "it-qzerty")).toBe("!");
    expect(einheitVon("Ho 14 anni e suono il sassofono.", "it")).toBe("4");
    expect(einheitVon("Il mio telefono è al 10%.", "it")).toBe("%");
    expect(einheitVon("Bressanone (in tedesco Brixen) è bella.", "it")).toBe(")");
    // Klammern als festes Paar: an ( ist ) noch nicht gelernt - die Zeile passt dort nicht, auch nicht halb.
    const o = reihenfolge("it");
    expect(fitText("Bressanone (in tedesco Brixen) è bella.", allowedFromIntroduced(o.slice(0, 43), "it"), "it")).toBeNull();
    // „Alcuni amano il rap; io ascolto solo musica elettronica." hat keinen Buchstaben ab g: schon vor Maiusc serviert.
    expect(sprossen("Alcuni amano il rap; io ascolto solo musica elettronica.", "it").buchst!).toBeLessThan(gSprosse("it"));
    expect(traegtEinheit("Ciao (Marco).", ")")).toBe(true);
    expect(traegtEinheit("Ciao Marco).", ")")).toBe(false);
  });
});

// ── Satzzeichen, Form, Zahlen ───────────────────────────────────────────

/** Satzanfang, Satzschluss, gerade Anführung, Klammern vollständig, Leerzeichen wie im Italienischen. */
function formFehler(t: string): string[] {
  const f: string[] = [];
  if (!/^"?[A-Z]/.test(t)) f.push("Anfang nicht gross");
  if (!/[.?!]["')\]}]?$/.test(t)) f.push("kein Satzschluss");
  if ((t.match(/"/g) ?? []).length % 2) f.push("Anführungszeichen ungerade");
  for (const [a, z] of ["()", "[]", "{}"]) {
    if (t.split(a).length - 1 !== t.split(z).length - 1) f.push(`${a}${z} ungleich`);
  }
  if (/ [.,;)]/.test(t)) f.push("Leerzeichen vor Satzzeichen");
  if (/[,;][^ \d]/.test(t.replace(/\[[^\]]*\]|\{[^}]*\}/g, ""))) f.push("kein Leerzeichen nach , oder ;");
  if (/[?!][^ "')\]]/.test(t.replace(/[?!]$/, ""))) f.push("kein Leerzeichen nach ? oder !");
  return f;
}

/**
 * Zahlen (I19): keine Dezimalzahl, kein Tausender ausser Jahreszahlen (1900-2099), `%` direkt an der Zahl,
 * `€` nach der Zahl mit Leerzeichen, `$` direkt vor der Zahl, Uhrzeit mit Doppelpunkt.
 */
function zahlFehler(z: string): string[] {
  const f: string[] = [];
  if (/\d,\d/.test(z)) f.push("Dezimalzahl");
  for (const m of z.matchAll(/\d{4,}/g)) if (!/^(19|20)\d\d$/.test(m[0])) f.push(`Zahl ${m[0]} ohne Tausenderpunkt / kein Jahr`);
  if (/\d\.\d{3}(?!\d)/.test(z)) f.push("Tausenderpunkt (vermeiden)");
  if (/\d %/.test(z)) f.push("% mit Leerzeichen (italienisch: 10%)");
  if (/\d€|€ ?\d/.test(z)) f.push("€ nicht nachgestellt mit Leerzeichen");
  if (/\$ \d|\d\$/.test(z)) f.push("$ nicht direkt vor der Zahl");
  if (/\b\d{1,2}\.\d\d\b/.test(z)) f.push("Uhrzeit mit Punkt (hier: Doppelpunkt)");
  return f;
}

describe("IT-T8: Satzzeichen, Form und Zahlen", () => {
  it("Form: gross am Anfang, Satzschluss, Anführung und Klammern vollständig, Leerzeichen richtig", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kleinschreibung, fehlender Schluss, offene Klammer, ungerade Anführung, Leerzeichen davor werden gefunden", () => {
    expect(formFehler("hai visto?")).toContain("Anfang nicht gross");
    expect(formFehler("Hai visto")).toContain("kein Satzschluss");
    expect(formFehler("Bolzano (Bozen è bella.")).toContain("() ungleich");
    expect(formFehler('Dice "ciao.')).toContain("Anführungszeichen ungerade");
    expect(formFehler("Ciao , Marta.")).toContain("Leerzeichen vor Satzzeichen");
    expect(formFehler("Sei pronta?Andiamo.")).toContain("kein Leerzeichen nach ? oder !");
    expect(formFehler('"Ci sei?", mi scrive Ilaria.')).toEqual([]);
    expect(formFehler("L'insieme A = {1, 2, 3} ha tre elementi.")).toEqual([]);
  });

  it("jede Zeile besteht die Regeln aller italienischen Zeilen (`helfer/itTextRegeln.ts`: kein Leerzeichen vor ? ! : ;)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlen nach I19: keine Dezimalzahl, Tausender nur als Jahr, 10%, 3 €, $3, 16:45", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: 1,40 €, 12500, 2.000, 10 %, 5€, € 5, $ 3 und 16.45 werden gefunden, 2026 und 16:45 nicht", () => {
    expect(zahlFehler("Costa 1,40 €.")).toContain("Dezimalzahl");
    expect(zahlFehler("Siamo 12500.")).toContain("Zahl 12500 ohne Tausenderpunkt / kein Jahr");
    expect(zahlFehler("Sono 2.000 metri.")).toContain("Tausenderpunkt (vermeiden)");
    expect(zahlFehler("Al 10 %.")).toContain("% mit Leerzeichen (italienisch: 10%)");
    expect(zahlFehler("Costa 5€.")).toContain("€ nicht nachgestellt mit Leerzeichen");
    expect(zahlFehler("Costa € 5.")).toContain("€ nicht nachgestellt mit Leerzeichen");
    expect(zahlFehler("Costa $ 3.")).toContain("$ nicht direkt vor der Zahl");
    expect(zahlFehler("Parte alle 16.45.")).toContain("Uhrzeit mit Punkt (hier: Doppelpunkt)");
    expect(zahlFehler("Nel 2026, alle 16:45, costa 3 € o $3.")).toEqual([]);
  });

  /**
   * ERSATZ FÜR FRÜHFASSUNGEN (Weg „it" hat keine in `fruehFassungen.ts`): vor ihrer Sprosse wird eine Zeile ohne
   * ihre Satzzeichen serviert. Steht dann mitten in der Zeile ein Grossbuchstabe, muss er zu einem Namen oder Ort
   * gehören - sonst sähe der Anfang des zweiten Satzes wie ein Fehler aus („Sei pronta Partiamo").
   */
  for (const l of TASTATUREN) {
    it(`${l}: früh serviert steht kein fremder Grossbuchstabe mitten in der Zeile`, () => {
      const fehler: string[] = [];
      for (const t of ZEILEN.filter((z) => aufTastatur(z, l))) {
        for (const fr of sprossen(t, l).frueh) {
          const g = fremdeGrosse(fr);
          if (g.length) fehler.push(`${g.join(",")} in "${fr}"`);
        }
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  it("Gegenprobe: in „Sei pronta? Partiamo alle otto.“ stünde früh ein fremdes „Partiamo“ mitten in der Zeile", () => {
    const fr = sprossen("Sei pronta? Partiamo alle otto da Bari.", "it").frueh;
    expect(fr.some((f) => fremdeGrosse(f).includes("Partiamo"))).toBe(true);
    expect(fremdeGrosse("Sei pronta Ilaria ti aspetta")).toEqual([]);
  });

  /** „Der lange Satz" (`uebungsformen/langersatz.ts`) nimmt Zeilen ab 60 Zeichen, die vollständig tippbar sind. */
  it("mindestens 40 Zeilen mit 60-80 Zeichen, keine über 80 - am Ende vollständig tippbar (it und it-qzerty)", () => {
    expect(ZEILEN.filter((t) => t.length > 80)).toEqual([]);
    for (const l of TASTATUREN) {
      const alle = allowedFromIntroduced(reihenfolge(l), "it");
      const lang = ZEILEN.filter((t) => t.length >= 60 && fitText(t, alle, "it") === t);
      expect(lang.length, l).toBeGreaterThanOrEqual(40);
    }
  });
});

// ── Orte und Namen ───────────────────────────────────────────────────────

/**
 * Orte, Landschaften und Bauwerke mit ihrem Raum - als WORTGRUPPE (längste zuerst),
 * damit „San Marino" nicht als „Marino" und „Val Venosta" als ein Ort zählt.
 * N Norden · M Mitte (Toskana, Umbrien, Marken, Latium) · S Süden (Abruzzen bis
 * Kalabrien, wie ISTAT) · I Inseln · CH Tessin und italienisches Graubünden ·
 * BZ Südtirol · RSM San Marino · AUSLAND.
 */
const ORTE: Record<string, string> = {
  // Norden
  Torino: "N", Milano: "N", "Milano Cortina": "N", Cortina: "N", Liguria: "N", Recco: "N", Bologna: "N",
  Ferrara: "N", Ravenna: "N", Rimini: "N", Riccione: "N", Parma: "N", Lido: "N", Bergamo: "N", Lecco: "N",
  Livigno: "N", Bormio: "N", Udine: "N", Trento: "N", Arco: "N", Canazei: "N", "Val di Non": "N",
  Aosta: "N", Sanremo: "N", "Mole Antonelliana": "N",
  // Mitte
  Roma: "M", Firenze: "M", Siena: "M", Pisa: "M", Lucca: "M", Arezzo: "M", Viareggio: "M", Piombino: "M",
  Elba: "M", Grosseto: "M", Maremma: "M", Perugia: "M", Gubbio: "M", Spoleto: "M", Umbria: "M", Bolsena: "M",
  Viterbo: "M", Ancona: "M", Pesaro: "M", Urbino: "M", Macerata: "M", Ascoli: "M",
  // Süden
  Napoli: "S", Salerno: "S", Positano: "S", Agerola: "S", Palinuro: "S", Avellino: "S", Benevento: "S",
  Caserta: "S", Bari: "S", Brindisi: "S", Lecce: "S", Otranto: "S", Ostuni: "S", Polignano: "S", Taranto: "S",
  Vieste: "S", Tremiti: "S", Foggia: "S", Pescara: "S", Chieti: "S", Teramo: "S", Sulmona: "S",
  "Gran Sasso": "S", Campobasso: "S", Potenza: "S", Cosenza: "S", Catanzaro: "S", Soverato: "S",
  Diamante: "S", "Reggio Calabria": "S", Calabria: "S", Tropea: "S", Pizzo: "S", Scilla: "S", Sila: "S",
  // Inseln
  Palermo: "I", Ballarò: "I", Ortigia: "I", Catania: "I", Etna: "I", Messina: "I", Siracusa: "I", Noto: "I", Modica: "I",
  Ragusa: "I", Enna: "I", Agrigento: "I", Trapani: "I", Marsala: "I", Egadi: "I", Pantelleria: "I",
  Lampedusa: "I", Lipari: "I", Stromboli: "I", Cefalù: "I", Taormina: "I", Bronte: "I", Sicilia: "I",
  Cagliari: "I", Sassari: "I", Alghero: "I", Fertilia: "I", Olbia: "I", Nuoro: "I", Oristano: "I",
  Iglesias: "I", Siniscola: "I", Buggerru: "I", Sardegna: "I",
  // Tessin und italienisches Graubünden
  Lugano: "CH", Locarno: "CH", Gordola: "CH", Tenero: "CH", Bellinzona: "CH", Giubiasco: "CH", Biasca: "CH",
  Airolo: "CH", Mendrisio: "CH", Chiasso: "CH", "Monte Generoso": "CH", "Monte Brè": "CH",
  "Valle di Blenio": "CH", "Val Verzasca": "CH", Lavertezzo: "CH", Verbano: "CH", Maggiore: "CH",
  Poschiavo: "CH", Roveredo: "CH", "San Bernardino": "CH", Ticino: "CH", Svizzera: "CH",
  // Südtirol
  Bolzano: "BZ", Bozen: "BZ", Merano: "BZ", Bressanone: "BZ", Brixen: "BZ", Brunico: "BZ", Vipiteno: "BZ",
  Ortisei: "BZ", "Val Badia": "BZ", "Val Venosta": "BZ", "Val Pusteria": "BZ", Braies: "BZ",
  "Plan de Corones": "BZ", "Alto Adige": "BZ",
  // San Marino
  "San Marino": "RSM",
  // Ausland (Paralympics, Familie)
  Londra: "AUSLAND", Parigi: "AUSLAND", Tunisia: "AUSLAND", "New York": "AUSLAND", Toronto: "AUSLAND",
  "Stati Uniti": "AUSLAND",
};

/** Menschen, Einrichtungen, Werke, Namen von Läden und Gruppen, Programmiersprachen und Befehle - kein Ort. */
const NAMEN = new Set(
  (
    "Chiara Nadia Martina Federica Ilaria Marco Matteo Samir Asia Marta Omar Giorgio Lukas Luca Davide " +
    "Assunta Legnante Samantha Cristoforetti Fabiola Gianotti Paralimpiadi Italia Festival Frecciarossa " +
    "Guaita Cesta Montale Ponte Salti Rubik Python Excel Linux JavaScript Na Home Chi Contatti " +
    "Vinili Caffè Linea Colore Sabbia Sole Onde Rocce Rap Poesia A B AltGr"
  ).split(" "),
);
const NAMENSWORT = new Set<string>([...NAMEN, ...Object.keys(ORTE).flatMap((o) => o.split(" "))]);

/** Ist ein Wort mit Grossbuchstaben erlaubt (Name, Ort, Abkürzung wie CERN/PHP/R&B, Hashtag, Erwähnung)? */
function grossOk(w: string): boolean {
  if (w.startsWith("#") || w.startsWith("@")) return true;
  const b = w.replace(/^[^\p{L}]+/u, "").replace(/[^\p{L}]+$/u, "");
  if (!b || b[0] === b[0].toLowerCase()) return true;
  if (b.length > 1 && b === b.toUpperCase()) return true; // CERN, UNESCO, PHP, CSS, HOME, SOMMA, MEDIA
  const kern = b.slice(b.lastIndexOf("'") + 1);
  return kern.split(/[-&]/).every((t) => t === "" || NAMENSWORT.has(t) || (t.length > 1 && t === t.toUpperCase()));
}
/** Grossgeschriebene Wörter mitten in einer (früh servierten) Zeile, die kein Name sind. */
function fremdeGrosse(t: string): string[] {
  return t.split(" ").filter((w, i) => i > 0 && !grossOk(w));
}
/** Im vollen Text: nach Satzgrenze, Doppelpunkt, `|` oder öffnender Anführung ist ein Grossbuchstabe normal. */
function fremdeGrosseVoll(t: string): string[] {
  const w = t.split(" ");
  return w.filter((x, i) => i > 0 && !/[.?!:|]["')]?$/.test(w[i - 1]) && !/^["(]/.test(x) && !grossOk(x));
}

/** Orte einer Zeile (längste Wortgruppe zuerst, Satz- und Sonderzeichen weg, Elision abgeschnitten). */
function orteListe(zeile: string): string[] {
  const w = zeile
    .replace(/[.,;:?!"()[\]{}|#@_/*+=<>%€$&]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((x) => x.slice(x.lastIndexOf("'") + 1));
  const out: string[] = [];
  for (let i = 0; i < w.length; i++) {
    for (const len of [3, 2, 1]) {
      const g = w.slice(i, i + len).join(" ");
      if (i + len <= w.length && g in ORTE) {
        out.push(g);
        i += len - 1;
        break;
      }
    }
  }
  return out;
}
const raeumeIn = (z: string) => new Set(orteListe(z).map((o) => ORTE[o]).filter((r) => r !== "AUSLAND"));
function raumZahl(zeilen: string[]): Map<string, number> {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const r of raeumeIn(z)) n.set(r, (n.get(r) ?? 0) + 1);
  return n;
}

describe("IT-T8: Orte aus dem ganzen italienischen Sprachraum - der Norden nicht vorne", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist Name, Ort oder Abkürzung", () => {
    const fehler = ZEILEN.flatMap((z) => fremdeGrosseVoll(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von IT-T8 (nach dem Merge mit T6/T9): N 23 · M 23 · S 40 · I 41 · CH 31 · BZ 22 · RSM 3, 180 von 357 verortet
   * (Zeilen je Raum; eine Zeile kann zwei Räume tragen). Johannes: Süd und Inseln, Tessin und Südtirol so stark
   * wie der Norden. Viele Zeilen der Sonderzeichen-Sprossen (Excel, Python, Adressen) haben keinen Ort.
   */
  it("Süden, Inseln und Tessin/Graubünden je mindestens so oft wie der Norden; Mitte und Südtirol nah dran; San Marino da", () => {
    const n = raumZahl(ZEILEN);
    const nord = n.get("N") ?? 0;
    const text = [...n].map(([r, k]) => `${r} ${k}`).join(" · ");
    expect(nord, text).toBeGreaterThan(0);
    for (const r of ["S", "I", "CH"]) expect(n.get(r) ?? 0, `${r}: ${text}`).toBeGreaterThanOrEqual(nord);
    for (const r of ["M", "BZ"]) expect((n.get(r) ?? 0) * 5, `${r}: ${text}`).toBeGreaterThanOrEqual(nord * 4);
    expect(n.get("RSM") ?? 0, text).toBeGreaterThanOrEqual(3);
    const verortet = ZEILEN.filter((z) => raeumeIn(z).size > 0).length;
    expect(verortet, text).toBeGreaterThanOrEqual(170);
    expect(nord * 5, `Norden höchstens ein Fünftel der verorteten Zeilen: ${text}`).toBeLessThanOrEqual(verortet);
  });

  it("kein Ort steht in mehr als 6 Zeilen (gemessen höchstens 5: Lugano, Locarno, Bressanone)", () => {
    const n = new Map<string, number>();
    for (const z of ZEILEN) for (const o of new Set(orteListe(z))) n.set(o, (n.get(o) ?? 0) + 1);
    expect([...n].filter(([, k]) => k > 6)).toEqual([]);
  });

  it("€ nur in Zeilen, die in Italien oder San Marino spielen - nie im Tessin (dort gilt der Franken)", () => {
    const euro = ZEILEN.filter((t) => t.includes("€"));
    expect(euro.length).toBeGreaterThanOrEqual(7);
    const fehler = euro.filter((t) => {
      const r = raeumeIn(t);
      return r.size === 0 || r.has("CH");
    });
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, Wortgruppen und Elision zählen richtig, € im Tessin fällt auf", () => {
    expect(fremdeGrosseVoll("Marta vive ad Atlantide.")).toEqual(["Atlantide."]);
    expect(fremdeGrosseVoll("Il volo Olbia-Torino dura un'ora.")).toEqual([]);
    expect(fremdeGrosseVoll("Studio molto. Domani ho la verifica.")).toEqual([]);
    expect(raeumeIn("A San Marino si paga in euro.")).toEqual(new Set(["RSM"]));
    expect(raeumeIn("Hai visto il tramonto dalla rocca di Cefalù?")).toEqual(new Set(["I"]));
    expect(raeumeIn("Un'escursione all'isola d'Elba.")).toEqual(new Set(["M"]));
    expect(raeumeIn("A Lugano un panino costa 8 €.").has("CH")).toBe(true);
    const n = raumZahl(["A Torino.", "A Milano.", "A Napoli."]);
    expect((n.get("S") ?? 0) >= (n.get("N") ?? 0)).toBe(false);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Lexikon, Akzent, è gegen e ───────

/**
 * Funktionswörter wie im Mitte-Wächter (IT-T5), dazu - wie im spanischen und französischen Ende-Wächter -
 * Fragewörter (an `?` steht in fast jeder Zeile eines), Satzverbinder, Präpositionen und Adverbien, Formen
 * von avere/andare, die Präpositionen vor einem Apostroph (all', dell' …) und die Technik-Wörter der
 * Beispiel-Adressen. Ohne die Erweiterung stünden „abbiamo, ogni, all" über alle Jugend-Chargen über 8.
 */
const FUNKTIONSWOERTER = new Set(
  (
    "il lo la i le gli un uno una di a ad da in con su per tra fra " +
    "del dello della dei delle degli al allo alla ai alle agli dal dallo dalla dai dalle " +
    "nel nello nella nei nelle sul sullo sulla sui sulle " +
    "e ed o ma se non si mi ti ci vi ne io tu lui lei noi voi loro " +
    "mio mia miei mie tuo tua suo sua nostro nostra sono sei siamo siete era erano è ho ha hanno " +
    "fa fai sta sto stai tutto tutta tutti tutte che chi anche più perché così poi ora già " +
    "questo questa quest c l d un po " +
    "come dove quando quanto quanti quanta quante quale quali cosa " +
    "però quindi invece mentre adesso sopra sotto dopo prima fino verso senza davanti dietro " +
    "abbiamo hai avete va vai vado vanno andiamo ogni ancora sempre molto poco tanto troppo " +
    "all dell nell sull dall www it org ch example"
  ).split(" "),
);

const woerterVon = (t: string) => (t.toLowerCase().match(/\p{L}+/gu) ?? []).filter((w) => w.length > 1);
function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of new Set(woerterVon(z))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/**
 * Wörter dieser Charge, die NICHT in `WORDS_IT`, `STUFE_VOCAB_IT` oder `NACHTRAG_IT` standen und die das
 * macOS-Wörterbuch für Italienisch bestätigt hat (`osascript -l JavaScript scripts/woerterbuch-macos.js`,
 * Vorsilbe `it:`, gemessen 03.10.2026; Gegenprobe `qwxz` und `dfdf` abgelehnt). Abgelehnt wurden `beach`,
 * `breakdance`, `skatepark`, `trap`, `ping` (ping-pong) - sie stehen in keiner Zeile mehr. Namen und Orte prüft die Liste oben.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set([
  "allenarsi", "apnea", "ascoltatori", "asterischi", "asterisco", "avvisarlo", "barra", "bilinguismo", "borraccia",
  "buonissime", "campestre", "cantautori", "cartellone", "chiocciola", "clan", "colorare", "cuscus", "daje",
  "flessioni", "grassetto", "hip", "hop", "ione", "irregolari", "ladino", "lavoretto", "lido", "mandorla",
  "mercatino", "noleggio", "olimpionica", "ostetrica", "palazzetto", "pedalato", "pedaliamo", "pendenza", "piegamenti",
  "playlist", "podio", "postato", "prof", "reggae", "rimonta", "ripescate", "rocca", "rovesciata",
  "sarda", "sardo", "scarponi", "segnatelo", "skate", "slalom", "sommare", "spilla", "staffetta",
  "supplementari", "tag", "tastierino", "terminale", "torcia", "traghetto", "trancio", "trekking", "trimestre",
  "ulivi", "vaporetto", "veneziano",
]);

/**
 * Wörter, die das Wörterbuch NICHT kennt und die trotzdem stehen - jedes mit Beleg (Befund §2). Die Stimme
 * spricht sie (nach dem Einhängen stehen sie im Lexikon), das Wörterbuch kennt sie nur nicht:
 *  - Wörter aus den Regionen, als Thema in Anführungszeichen: talìa (Sizilianisch „guarda"), guagliò
 *    (Neapolitanisch, Anrede an einen Jungen), ajò (Sardisch „andiamo"), natel (Tessin, R3 §3.3), servus
 *    (Gruss in Südtirol), autopostale (Tessin: der Postbus);
 *  - cancelletto: Treccani, „il simbolo #" (Verkleinerung von cancello); vom Wörterbuch abgelehnt.
 */
const MIT_BELEG_OHNE_WOERTERBUCH: ReadonlySet<string> = new Set(["talìa", "guagliò", "ajò", "natel", "servus", "autopostale", "cancelletto"]);
/** Code und Formeln (CSS, Python, Excel) - englische Schlüsselwörter in Programmzeilen, keine Wörter des Satzes. */
const CODE_WOERTER: ReadonlySet<string> = new Set(["if", "red", "color", "k-way"]);

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat(), ...NACHTRAG_IT].map((w) => normalizeWord(w, "it")),
);
/** Anfänge vor dem Apostroph (geschlossene Liste wie `ELISION_ANFAENGE_IT` in lexicon.ts, soweit hier gebraucht). */
const ELISIONS_ANFAENGE = new Set(["l", "un", "dell", "all", "dall", "nell", "sull", "c", "d"]);

/** Ein Wort (klein) ist geprüft, wenn es bekannt, bestätigt oder belegt ist - eine Elision, wenn Anfang und Rest es sind. */
function wortGeprueft(w: string): boolean {
  const n = normalizeWord(w, "it");
  const ok = (x: string) =>
    x.length < 2 || VORHER_BEKANNT.has(x) || VOM_WOERTERBUCH_BESTAETIGT.has(x) || MIT_BELEG_OHNE_WOERTERBUCH.has(x) || CODE_WOERTER.has(x);
  if (ok(n)) return true;
  if (!n.includes("'")) return false;
  return ELISIONS_ANFAENGE.has(n.slice(0, n.lastIndexOf("'"))) && ok(n.slice(n.lastIndexOf("'") + 1));
}

/**
 * Die Wörter einer Zeile, die der Satz trägt: Satzzeichen und Klammern am Rand weg; ein Wort mit Ziffer,
 * `# @ _ / . = $ * & + < > |` mitten darin ist Technik (Adresse, Hashtag, Formel, Datei) und zählt nicht;
 * ein Bindestrich-Paar (Bolzano-Merano) zählt als zwei Wörter.
 */
function satzWoerter(zeile: string): string[] {
  const out: string[] = [];
  for (const roh of zeile.split(/\s+/)) {
    const w = roh.replace(/^[^\p{L}#@]+/u, "").replace(/[^\p{L}]+$/u, "");
    if (!w || /[^\p{L}'-]/u.test(w) || CODE_WOERTER.has(w.toLowerCase())) continue;
    out.push(...w.split("-").filter(Boolean));
  }
  return out;
}

/**
 * Die Wörter einer Zeile so, wie die Stimme sie nimmt: an Leerzeichen getrennt, ohne Rand-Satzzeichen, ein
 * Bindestrich-Paar als EIN Wort (das Lexikon nimmt Korpus-Wörter genauso auf, `lexicon.ts`), Technik ausgenommen.
 */
function stimmWoerter(zeile: string): string[] {
  return zeile
    .split(/\s+/)
    .map((roh) => roh.replace(/^[^\p{L}#@]+/u, "").replace(/[^\p{L}]+$/u, ""))
    .filter((w) => w && !/[^\p{L}'-]/u.test(w) && !CODE_WOERTER.has(w.toLowerCase()));
}

/** Wörter (ab zwei Buchstaben), die weder bekannt noch bestätigt noch belegt noch Name/Ort sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of satzWoerter(z)) {
      const kern = w.slice(w.lastIndexOf("'") + 1);
      if (kern[0] !== kern[0].toLowerCase() && NAMENSWORT.has(kern)) continue;
      if (w.length > 1 && w === w.toUpperCase()) continue; // CERN, UNESCO, PHP
      if (!wortGeprueft(w)) out.add(w.toLowerCase());
    }
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
const ohneAkzentFehler = (zeile: string): string[] =>
  satzWoerter(zeile)
    .flatMap((w) => w.split("'"))
    .filter((w) => !NAMENSWORT.has(w))
    .map((w) => w.toLowerCase())
    .filter((w) => NUR_MIT_AKZENT.has(w));

/**
 * „e" (und) gegen „è" (ist): „è" ist ab Sprosse 27 schreibbar - ein fehlender Akzent wäre ein ANDERES Wort
 * (`il bus e in ritardo`). Jede Zeile mit einem allein stehenden „e" ist gelesen und hier eingetragen (in jeder
 * ist „e" = und, in der Mengen-Zeile der Vokal); eine neue Zeile mit „e" muss hier stehen, sonst wird der Wächter rot.
 */
const ZEILEN_MIT_E_GELESEN: ReadonlySet<string> = new Set([
  "Dai, ancora un giro di corsa e poi andiamo a casa!",
  "Il mio zaino per il campeggio: tenda, sacco a pelo e torcia.",
  "Le cose che non dimentico mai: chiavi, cuffie e abbonamento del bus.",
  "Il programma del weekend a Lipari: spiaggia, trekking e granita.",
  "La mia playlist ha un po' di tutto: rap, indie e cantautori.",
  "Le regole della nostra chat sono semplici: rispetto e niente spoiler.",
  "A Bressanone ho comprato tutto per la montagna: scarponi, zaino e borraccia.",
  "A Pantelleria ho assaggiato due cose buonissime: il cuscus e i capperi.",
  "Ogni sabato a Pesaro faccio le stesse cose: basket e pizza con gli amici.",
  "Al mercato di Ortigia compro sempre le stesse cose: pane, olive e ricotta.",
  "Sulla tastiera italiana il cancelletto # si fa con AltGr e à.",
  "Dalla terrazza di Ostuni si vede tutto: ulivi, case bianche e mare.",
  "Le tappe del nostro viaggio in Calabria: Tropea, Pizzo e Scilla.",
  "Marta suona il basso; Omar canta e scrive i testi.",
  "Domani ho due ore di laboratorio (chimica e fisica).",
  "Ho finito il libro (finalmente) e stasera guardo il film.",
  "Le torri di San Marino (Guaita, Cesta e Montale) si vedono da lontano.",
  "Sono le 12 e la mensa è già piena.",
  "Ho 14 anni e suono il sassofono nella banda di Sulmona.",
  "Ho 15 anni e la domenica aiuto mio zio nella sua pasticceria di Modica.",
  "Ho 16 anni e sto imparando a riparare le biciclette.",
  "Mia sorella ha 17 anni e si allena per la maratona di Firenze.",
  "La mia nonna di Nuoro ha 77 primavere e balla ancora il ballo sardo.",
  "Mia cugina di Lecco ha 18 anni e ha appena preso la patente.",
  "Ho 8 cugini in Calabria e 3 in Svizzera.",
  "Il mio bisnonno è del 1939 e usa lo smartphone meglio di me.",
  "In pagella ho 9 in inglese e 8 in scienze!",
  "Scrivo i voti in una tabella: 7/10 in storia e 8/10 in arte.",
  "A Pescara con 10 € prendo pizza e bibita.",
  "Nella mappa del gioco [A] è la partenza e [B] l'arrivo.",
  "Nella ricerca ho messo le fonti tra parentesi quadre, come [1] e [2].",
  "In JavaScript un blocco di codice va tra { e }.",
  "In matematica le vocali si scrivono come insieme: {a, e, i, o, u}.",
]);
const mitE = (z: string): boolean => /(^| )e( |$)/i.test(z.replace(/[,.;:!?"()[\]{}]/g, " ").replace(/\s+/g, " "));

describe("IT-T8: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /** Falle 45: das Budget gilt je STUFE - über T2 (früh) + T5 (Mitte) + T8 (Ende) zusammen. */
  it("über alle Jugend-Chargen (T2 + T5 + T8) steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    const fehler = zuHaeufig([...JUGEND_FRUEHER, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gefunden (gross, mit Satzzeichen, nach Elision), ein Fragewort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 3 === 0 ? "Torneo" : i % 3 === 1 ? "Quale torneo" : "Dell'torneo"} ${"abcdefghi"[i]}${i % 2 ? "?" : "!"}`);
    expect(zuHaeufig(neun)).toEqual(['"torneo": 9 Zeilen']);
    // Die Jugend-Chargen davor tragen „treno" schon in 8 Zeilen - eine einzige weitere reisst die Grenze.
    expect(zuHaeufig([...JUGEND_FRUEHER, "Il treno per Bari?"])).toContain('"treno": 9 Zeilen');
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis, auch nicht hinter einer Elision oder in Anführung", () => {
    const fehler = ZEILEN.flatMap((t) =>
      t.split(/[\s,.;:!?"()[\]{}|/_@#*+=<>%€$&-]+/).filter((w) => w && gesperrtIt(w)).map((w) => `"${t}": ${w}`),
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

  it("jedes Wort stand schon im Wortschatz, ist vom Wörterbuch bestätigt oder belegt (Namen und Orte: Listen oben)", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => satzWoerter(z).flatMap((w) => w.toLowerCase().split("'"))));
    expect([...VOM_WOERTERBUCH_BESTAETIGT, ...MIT_BELEG_OHNE_WOERTERBUCH].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort, das abgelehnte skatepark und eine Elision mit falschem Anfang werden gemeldet - Adressen nicht", () => {
    expect(ungeprueft(["Ho visto la salsx?", "Che forte lo skatepark!", "Xyz'estate."])).toEqual(["salsx", "skatepark", "xyz'estate"]);
    expect(ungeprueft(["Scrivimi a luca.skate@example.it!", "Uso #musicadalvivo e torre_nera."])).toEqual([]);
    expect(satzWoerter("La ciclabile Bolzano-Merano è bella.")).toEqual(["La", "ciclabile", "Bolzano", "Merano", "è", "bella"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => stimmWoerter(z).some((w) => normalizeWord(w, "it").length >= 2 && !isRealWord(w, "it")));
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da (perche, citta, piu, cosi …)", () => {
    const fehler = ZEILEN.flatMap((z) => ohneAkzentFehler(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Esco perche c'e il sole?“ wird gemeldet (perche), „Esco perché c'è il sole?“ nicht", () => {
    expect(ohneAkzentFehler("Esco perche c'e il sole?")).toContain("perche");
    expect(ohneAkzentFehler("Esco perché c'è il sole?")).toEqual([]);
  });

  it("jede Zeile mit „e“ ist gelesen (e = und, nie das gemeinte è)", () => {
    const mit = ZEILEN.filter(mitE);
    expect(mit.filter((z) => !ZEILEN_MIT_E_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_E_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Il bus e in ritardo!“ wäre eine neue, ungelesene Zeile mit „e“ - „{a, e, i}“ wird erkannt", () => {
    expect(mitE("Il bus e in ritardo!")).toBe(true);
    expect(ZEILEN_MIT_E_GELESEN.has("Il bus e in ritardo!")).toBe(false);
    expect(mitE("Le vocali: {a, e, i}.")).toBe(true);
    expect(mitE("Il bus è in ritardo!")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich ────────────────────────

/** Geschlecht und Zahl gleichgesetzt, Satzzeichen weg, Zahlen bleiben: „Il mio amico è…?" und „La mia amica è…!" sind ein Paar. */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", gli: "ART", le: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  const w = (zeile.toLowerCase().match(/\p{L}+/gu) ?? []).map((x) => art[x] ?? pron[x] ?? x.replace(/[oaei]$/, "_"));
  return `${w.join(" ")}|${(zeile.match(/\d+/g) ?? []).join(",")}`;
}
function paare(zeilen: string[], gegen: string[] = []): string[] {
  const gesehen = new Map<string, string>();
  for (const z of gegen) gesehen.set(paarForm(z), `anderswo: ${z}`);
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}
/** Wortmenge mit Zahlen; fast gleich ab Jaccard 0,6 (Muster fr-/es-Ende, Falle 51). */
const menge = (t: string) => new Set([...(t.toLowerCase().match(/\p{L}+/gu) ?? []), ...(t.match(/\d+/g) ?? [])]);
function fastGleich(a: Set<string>, b: Set<string>): boolean {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s) >= 0.6;
}

/** Wo die Charge in CORPUS_IT steht - die anderen it-Zeilen werden nach dem EINTRAG ausgeschlossen, nicht nach dem Text. */
const START = CORPUS_IT.map((i) => i.text).indexOf(ZEILEN[0]);
const ANDERE_IT_EINTRAEGE = CORPUS_IT.filter((_, k) => k < START || k >= START + ZEILEN.length);

describe("IT-T8: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der keine Akzente kennt: aus „è“ wird nichts)", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer anderen - weder it (alle anderen Chargen) noch de/en/fr/es (Text oder Ledger-Schlüssel)", () => {
    const andere = [...ANDERE_IT_EINTRAEGE, ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES];
    const ohne = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}' ]/gu, " ").replace(/\s+/g, " ").trim();
    const texte = new Set(andere.map((i) => ohne(i.text)));
    const schluessel = new Set(andere.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_IT_WEG_ENDE_TEENS.filter((i) => texte.has(ohne(i.text)) || schluessel.has(bausteinKey(i.kind, i.text))).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("keine Paare - weder untereinander noch mit einer Zeile von T1-T6 oder T9 (Falle 31)", () => {
    const fehler = paare(ZEILEN, ANDERE_IT_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich - weder untereinander noch mit einer Zeile von T1-T6 oder T9", () => {
    const eigene = ZEILEN.map((t) => [t, menge(t)] as const);
    const andere = ANDERE_IT_ZEILEN.map((t) => [t, menge(t)] as const);
    const fehler: string[] = [];
    for (let i = 0; i < eigene.length; i++) {
      for (const [t, m] of andere) if (fastGleich(eigene[i][1], m)) fehler.push(`"${eigene[i][0]}" ~ "${t}"`);
      for (let j = i + 1; j < eigene.length; j++) {
        if (fastGleich(eigene[i][1], eigene[j][1])) fehler.push(`"${eigene[i][0]}" ~ "${eigene[j][0]}"`);
      }
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie einer T5-Zeile mit ?, Paar, Ledger-Schlüssel und fast gleiche Zeilen werden erkannt", () => {
    expect(ANDERE_IT_ZEILEN).toContain("Assunta Legnante, di Napoli, ha vinto l'oro nel peso.");
    expect(paare(["Assunta Legnante, di Napoli, ha vinto l'oro nel peso!"], ANDERE_IT_ZEILEN)).toHaveLength(1);
    expect(paare(["Il mio amico è di Bari?", "La mia amica è di Bari!"])).toHaveLength(1);
    expect(paare(["Ho 14 anni.", "Ho 15 anni."])).toEqual([]);
    expect(bausteinKey("satz", "Hai visto?")).toBe(bausteinKey("satz", "hai visto"));
    expect(fastGleich(menge("Nel 2012 Assunta Legnante, di Napoli, ha vinto l'oro."), menge("Assunta Legnante, di Napoli, ha vinto l'oro nel peso."))).toBe(true);
    expect(fastGleich(menge("In italiano il simbolo # si chiama cancelletto."), menge("In italiano il simbolo @ si chiama chiocciola."))).toBe(true);
  });
});

// ── Anker und Auslieferung ───────────────────────────────────────────────

describe("IT-T8: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_IT trägt die Charge als geschlossenen Block hinter T1-T6 und T9", () => {
    const it_ = CORPUS_IT.map((i) => i.text);
    expect(START).toBeGreaterThanOrEqual(0);
    expect(it_.slice(START, START + ZEILEN.length)).toEqual(ZEILEN);
    // IT-T7 wurde NACH dieser Charge gemergt und steht dahinter - die Regel „davor" gilt für die übrigen.
    for (const c of ANDERE_CHARGEN.filter((x) => x !== CORPUS_IT_WEG_ENDE_KIDS)) {
      expect(START).toBeGreaterThanOrEqual(it_.indexOf(c[c.length - 1].text) + 1);
    }
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg it, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_IT_WEG_ENDE_TEENS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("it");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("korpusFuer(\"it\") trägt jede Zeile (nichts von `mergeCorpus` still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("it").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    expect(CORPUS_IT_WEG_ENDE_TEENS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe it t8?", kind: "satz" as const, stufen: ["teens" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: am Ende des Lernwegs bekommt Weg „it" für Jugendliche jede Zeile dieser Tastatur - und nur it-Jugendzeilen`, () => {
      const o = reihenfolge(l);
      const geliefert = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(o, "it"), lang: "it", lernweg: "it" });
      const erwartet = ZEILEN.filter((t) => aufTastatur(t, l));
      expect(erwartet.filter((t) => !geliefert.includes(t))).toEqual([]);
      expect(geliefert.filter((t) => ZEILEN.includes(t) && !aufTastatur(t, l))).toEqual([]);
      const jugend = new Set(CORPUS_IT.filter((i) => i.nurWeg === "it" && i.stufen.includes("teens")).map((i) => i.text));
      expect(geliefert.filter((t) => !jugend.has(t))).toEqual([]);
    });

    it(`${l}: eine Sprosse vor „g" kommt keine Zeile dieser Charge an - an „g" einige, ohne ungelernte Zeichen`, () => {
      const o = reihenfolge(l);
      const g = gSprosse(l);
      const an = (n: number) => ZEILEN.map((t) => fitText(t, allowedFromIntroduced(o.slice(0, n), "it"), "it"));
      expect(an(g - 1).filter((t) => t !== null)).toEqual([]);
      const anG = an(g).filter((t): t is string => t !== null);
      expect(anG.length).toBeGreaterThan(0);
      expect(anG.filter((t) => /[?!":;()'\d]/.test(t))).toEqual([]);
    });

    it(`${l}: in echten Runden für Jugendliche an der Sprosse von „?" kommt eine Frage dieser Charge vollständig an`, () => {
      const o = reihenfolge(l);
      const intro = o.slice(0, o.indexOf("?") + 1);
      const echt = Math.random;
      let s = 3708;
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
          for (const z of adaptiveRound({ introduced: intro, focus: ["?"], stufe: "teens", lang: "it", lernweg: "it", count: 12 })) {
            texte.push(z.text);
          }
        }
      } finally {
        Math.random = echt;
      }
      expect(texte.some((t) => ZEILEN.includes(t) && t.includes("?")), texte.slice(0, 12).join(" / ")).toBe(true);
    });
  }

  it("Kinder, Erwachsene und die Wege „de“/„es“ bekommen keine dieser Zeilen", () => {
    const o = reihenfolge("it");
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
