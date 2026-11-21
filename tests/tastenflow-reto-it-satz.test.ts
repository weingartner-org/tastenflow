/**
 * Wächter für die italienische Sfida (Tippchallenge), Niveau „Con
 * punteggiatura" (`satz`), 03.10.2026 - `texteSatzItA.ts` und
 * `texteSatzItB.ts`, zusammengefügt in `texteSatzIt.ts`.
 *
 * ★ IT-RETO-VERDRAHTEN (03.10.2026): inzwischen EINGEHÄNGT (`IT_NIVEAUS_GEFUELLT`, `ladeTexte`, Prüfskript für
 *   Weg „it" scharf) - der folgende Satz beschreibt den Stand davor. Befund: BEFUND-2026-10-02-IT-RETO-VERDRAHTET.md.
 * Die Bank ist NICHT eingehängt (Auftrag: nur Bank, Wächter, Befund);
 * `scripts/pruefe-schreibproben.mts` führt Weg „it" unter
 * `WEGE_OHNE_EIGENE_BANK` und prüft sie darum noch nicht. Dieser Wächter
 * baut die Prüfung bis dahin nach - wie `tastenflow-reto-es-satz.test.ts` für
 * Spanisch: Zeichenvorrat (gemessen an `zeichenVorrat("satz", "it")`, nicht
 * abgeschrieben), Zeilenlänge und Mindestlänge, die gemeinsamen Regeln jeder
 * italienischen Zeile (`tests/helfer/itTextRegeln.ts`), die Sperrliste
 * (`sperrlisteIt.ts`, hier Kern UND Wortbasis), Person zuerst, die Räume
 * (Norden höchstens drei Texte), keine Kopie aus den Korpora aller Wege und
 * aus den Prüfungstexten der anderen Sprachen, keine Paare mit dem
 * italienischen Korpus, und die Vergleichbarkeit der fünfzehn Texte wie im
 * Prüfskript (Regel 10).
 *
 * Jede Regel hat eine GEGENPROBE: eine falsche Zeile muss rot werden. Ein
 * Wächter, der beim ersten Lauf grün ist, beweist sonst nichts.
 */
import { describe, it, expect } from "vitest";
import { MIND_ZEICHEN, PROBEN_JE_NIVEAU, niveauDef, zeichenVorrat, endetMitSatz } from "../src/lib/typing/schreibprobe";
import { zeichenZahl, type Probentext } from "../src/lib/typing/schreibproben/index";
import { TEXTE_A, ORTE_A, type ProbenOrtIt, type RaumIt } from "../src/lib/typing/schreibproben/texteSatzItA";
import { TEXTE_B, ORTE_B } from "../src/lib/typing/schreibproben/texteSatzItB";
import { TEXTE as TEXTE_IT } from "../src/lib/typing/schreibproben/texteSatzIt";
import { TEXTE as SATZ_DE } from "../src/lib/typing/schreibproben/texteSatz";
import { TEXTE as SATZ_EN } from "../src/lib/typing/schreibproben/texteSatzEn";
import { TEXTE as SATZ_FR } from "../src/lib/typing/schreibproben/texteSatzFr";
import { TEXTE as SATZ_ES } from "../src/lib/typing/schreibproben/texteSatzEs";
import { TEXTE as BUCHSTABEN_DE } from "../src/lib/typing/schreibproben/texteBuchstaben";
import { TEXTE as BUCHSTABEN_EN } from "../src/lib/typing/schreibproben/texteBuchstabenEn";
import { TEXTE as BUCHSTABEN_FR } from "../src/lib/typing/schreibproben/texteBuchstabenFr";
import { TEXTE as BUCHSTABEN_ES } from "../src/lib/typing/schreibproben/texteBuchstabenEs";
import { TEXTE as ZAHLEN_DE } from "../src/lib/typing/schreibproben/texteZahlen";
import { TEXTE as ZAHLEN_EN } from "../src/lib/typing/schreibproben/texteZahlenEn";
import { TEXTE as ZAHLEN_FR } from "../src/lib/typing/schreibproben/texteZahlenFr";
import { TEXTE as ZAHLEN_ES } from "../src/lib/typing/schreibproben/texteZahlenEs";
import { TEXTE as ALLES_DE } from "../src/lib/typing/schreibproben/texteAlles";
import { TEXTE as ALLES_EN } from "../src/lib/typing/schreibproben/texteAllesEn";
import { TEXTE as ALLES_FR } from "../src/lib/typing/schreibproben/texteAllesFr";
import { TEXTE as ALLES_ES } from "../src/lib/typing/schreibproben/texteAllesEs";
import { CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { gesperrtIt } from "../src/lib/typing/sperrlisteIt";
import { zeilenFehler } from "./helfer/itTextRegeln";

const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
const ORTE: Record<number, ProbenOrtIt> = { ...ORTE_A, ...ORTE_B };
const SATZ = niveauDef("satz", "it")!;

/**
 * Der Zeichenvorrat des Niveaus „Con punteggiatura" auf Weg „it" - GEMESSEN,
 * nicht abgeschrieben: was `zeichenVorrat` liefert (Kleinbuchstaben, à è é ì
 * ò ù, Apostroph, . , ? ! " : ; - ( ), Leerzeichen), dazu die Grossbuchstaben
 * A-Z (das Niveau hat die Umschalttaste). Grosse Akzentbuchstaben gehören
 * NICHT dazu: auf Windows „Italiano" gibt es sie nicht (Bauplan I4).
 */
const VORRAT = new Set([...zeichenVorrat("satz", "it"), ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]);

/** Ausdrücklich verboten - doppelt zum Vorrat, damit die Meldung sagt, WARUM. */
const VERBOTENE_ZEICHEN: ReadonlyArray<[string, string]> = [
  ["À", "grosser Akzentbuchstabe (Windows: nicht tippbar)"],
  ["È", "grosser Akzentbuchstabe (Windows: nicht tippbar)"],
  ["É", "grosser Akzentbuchstabe (Windows: nicht tippbar)"],
  ["Ì", "grosser Akzentbuchstabe (Windows: nicht tippbar)"],
  ["Ò", "grosser Akzentbuchstabe (Windows: nicht tippbar)"],
  ["Ù", "grosser Akzentbuchstabe (Windows: nicht tippbar)"],
  ["«", "Guillemet (gerade Anführung nehmen)"],
  ["»", "Guillemet (gerade Anführung nehmen)"],
  ["“", "typografisches Anführungszeichen"],
  ["”", "typografisches Anführungszeichen"],
  ["’", "typografischer Apostroph"],
  ["‘", "typografischer Apostroph"],
  ["–", "Halbgeviertstrich (nur Bindestrich)"],
  ["—", "Geviertstrich (nur Bindestrich)"],
  ["…", "Auslassungszeichen"],
  ["º", "Ordnungszeichen"],
  ["ª", "Ordnungszeichen"],
  ["°", "Gradzeichen"],
];

/** Das Satzzeichen-Repertoire dieses Niveaus: jedes muss in JEDEM Text vorkommen (gleiche Prüfung für alle). */
const SATZZEICHEN = [".", ",", "'", "?", "!", '"', ":", ";", "-", "(", ")"] as const;

/** Person zuerst (Glossar it §1 Nr. 3): diese Bezeichnungen für Menschen nie. */
const NICHT_PERSON_ZUERST = /\b(non vedent[ei]|ciech[ie]|ciec[oa]|disabil[ei]|handicappat[oaie]|diversamente abil[ei])\b/iu;

/** Die Wörter einer Zeile (Elision bleibt am Wort, Bindestrich-Wörter getrennt). */
const woerter = (zeile: string): string[] =>
  zeile
    .split(/[\s\-]+/)
    .map((w) => w.replace(/^[^\p{L}]+|[^\p{L}']+$/gu, "").replace(/'+$/, (m, i, s: string) => (/^po$/i.test(s.slice(0, i)) ? m : "")))
    .filter(Boolean);

/** Alle Probleme EINER gespeicherten Zeile. Leer heisst: in Ordnung. */
export function zeilenProbleme(zeile: string): string[] {
  const p: string[] = [];
  if (zeile.length < SATZ.zeileVon || zeile.length > SATZ.zeileBis) p.push(`Länge ${zeile.length}`);
  for (const [z, warum] of VERBOTENE_ZEICHEN) if (zeile.includes(z)) p.push(`verbotenes Zeichen ${z} (${warum})`);
  for (const c of zeile) {
    if (/\d/.test(c)) p.push(`Ziffer ${c}`);
    else if (!VORRAT.has(c) && !VERBOTENE_ZEICHEN.some(([z]) => z === c)) p.push(`Zeichen ${c} nicht im Vorrat`);
  }
  for (const f of zeilenFehler(zeile)) p.push(f);
  for (const w of woerter(zeile)) if (gesperrtIt(w)) p.push(`Sperrliste: ${w}`);
  const pz = NICHT_PERSON_ZUERST.exec(zeile);
  if (pz) p.push(`Person zuerst: ${pz[0]}`);
  if (zeile !== zeile.trim() || / {2,}/.test(zeile)) p.push("Leerraum");
  if (/ [,.)]|\( /.test(zeile)) p.push("Leerzeichen an Satzzeichen");
  if (/^-/.test(zeile)) p.push("Zeile beginnt mit dem Gedankenstrich");
  if (/\.\.\./.test(zeile)) p.push("Auslassungspunkte");
  // „po'" (poco) hat einen Apostroph, nie einen Akzent - die Zeichen sind erlaubt, die Form nicht.
  if (/(?<!\p{L})pò(?!\p{L})/iu.test(zeile)) p.push("pò statt po'");
  return p;
}

/**
 * Probleme eines GANZEN Textes: Klammern gehen auf und nie verschachtelt,
 * Anführungszeichen paarweise, jedes Satzzeichen des Niveaus kommt vor,
 * genug Satzanfänge für einen Start mitten im Text, Mindestlänge, Titel.
 */
export function textProbleme(t: Probentext): string[] {
  const p: string[] = [];
  const voll = t.zeilen.join(" ");
  let offen = 0;
  for (const c of voll) {
    if (c === "(") {
      if (offen > 0) p.push("Klammer in Klammer");
      offen++;
    }
    if (c === ")") {
      if (offen === 0) p.push("Klammer zu ohne auf");
      else offen--;
    }
  }
  if (offen !== 0) p.push("Klammern gehen nicht auf");
  if ((voll.match(/"/g) ?? []).length % 2 !== 0) p.push("Anführungszeichen ungerade");
  for (const z of SATZZEICHEN) if (!voll.includes(z)) p.push(`Satzzeichen ${z} fehlt`);
  // Eine Challenge beginnt am Satzanfang (`anfangAb`): Zeile 1 oder nach einer Zeile mit Satzende.
  const satzEnden = t.zeilen.filter(endetMitSatz).length;
  if (satzEnden < 12) p.push(`nur ${satzEnden} Zeilen mit Satzende`);
  if (zeichenZahl(t) < MIND_ZEICHEN) p.push(`${zeichenZahl(t)} Zeichen, mindestens ${MIND_ZEICHEN}`);
  if (!t.titel || t.titel.trim().length < 3) p.push("Titel fehlt");
  for (const q of zeilenProbleme(t.titel)) if (!q.startsWith("Länge")) p.push(`Titel: ${q}`);
  return p;
}

/**
 * Wo spielen die Texte? Bauplan D3 und Johannes: Süden und Inseln, Tessin,
 * Graubünden und Südtirol mindestens so stark wie der Norden. Der Norden hat
 * höchstens drei Texte, jeder Raum mindestens einen, kein Ort zweimal, und
 * der Ort steht wörtlich im Text.
 */
export function orteProbleme(texte: Probentext[], orte: Record<number, ProbenOrtIt>): string[] {
  const p: string[] = [];
  const je = new Map<RaumIt, number>();
  const gesehen = new Set<string>();
  for (const t of texte) {
    const o = orte[t.nr];
    if (!o) {
      p.push(`Text ${t.nr}: kein Ort`);
      continue;
    }
    je.set(o.raum, (je.get(o.raum) ?? 0) + 1);
    if (gesehen.has(o.ort)) p.push(`Ort doppelt: ${o.ort}`);
    gesehen.add(o.ort);
    if (!t.zeilen.join(" ").includes(o.ort)) p.push(`Text ${t.nr}: Ort ${o.ort} kommt nicht vor`);
  }
  const n = (r: RaumIt) => je.get(r) ?? 0;
  const RAEUME: RaumIt[] = ["nord", "centro", "sud", "isole", "ticino", "grigioni", "altoadige", "sanmarino"];
  for (const r of RAEUME) if (n(r) === 0) p.push(`kein Text im Raum ${r}`);
  if (n("nord") > 3) p.push("mehr als drei Texte im Norden");
  if (n("sud") + n("isole") < n("nord")) p.push("Süden und Inseln schwächer als der Norden");
  if (n("ticino") + n("grigioni") < n("nord")) p.push("Tessin und Graubünden schwächer als der Norden");
  if (n("altoadige") < 2) p.push("weniger als zwei Texte in Südtirol");
  return p;
}

// ── Kopien und Paare ────────────────────────────────────────────────────────

/** Klein, ohne Satzzeichen: so kollidiert „Vieni al parco?" mit „vieni al parco". */
const textForm = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\d' ]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Die Sätze eines Textes (an . ! ? getrennt, Anführung und Klammer weg). */
export function saetze(t: Probentext): string[] {
  return t.zeilen
    .join(" ")
    .split(/(?<=[.!?]["')]*)\s+/)
    .map((s) => s.replace(/^["(]+|["')]+$/g, "").trim())
    .filter(Boolean);
}

/** Geschlecht und Zahl gleichgesetzt, Satzzeichen weg: „Il nonno ride?" und „La nonna ride!" sind ein Paar (wie IT-T7). */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", gli: "ART", le: "ART", l: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  return zeile
    .toLowerCase()
    .split(/[\s,.;:!?"()[\]{}'-]+/)
    .filter(Boolean)
    .map((w) => art[w] ?? pron[w] ?? w.replace(/[oaei]$/, "_"))
    .join(" ");
}

/** Wörter eines Satzes als Menge - „fast gleich" ab einer Jaccard-Überdeckung von 0,6 (wie IT-T7/T8). */
const menge = (t: string) => new Set(t.toLowerCase().match(/\p{L}+/gu) ?? []);
function fastGleich(a: Set<string>, b: Set<string>): boolean {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s) >= 0.6;
}

/** Titel eindeutig, keine Zeile doppelt (auch nicht ohne Satzzeichen). */
export function bankProbleme(texte: Probentext[]): string[] {
  const p: string[] = [];
  const titel = new Set<string>();
  const zeilen = new Map<string, number>();
  for (const t of texte) {
    if (titel.has(t.titel)) p.push(`Titel doppelt: ${t.titel}`);
    titel.add(t.titel);
    for (const z of t.zeilen) {
      const n = textForm(z);
      if (zeilen.has(n)) p.push(`Zeile doppelt (Text ${zeilen.get(n)} und ${t.nr}): ${z}`);
      zeilen.set(n, t.nr);
    }
  }
  return p;
}

/**
 * Keine Kopie aus fremdem Material: keine Zeile und kein Satz ist (ohne
 * Satzzeichen) eine Zeile von dort, und keine fremde Zeile ab 25 Zeichen
 * steht als Teilstück im Text - nicht nur Zeile gegen Zeile.
 */
export function kopieProbleme(texte: Probentext[], fremd: string[]): string[] {
  const p: string[] = [];
  const formen = new Set(fremd.map(textForm).filter((f) => f.length >= 12));
  const lange = [...new Set(fremd.map(textForm).filter((f) => f.length >= 25))];
  for (const t of texte) {
    for (const z of t.zeilen) if (formen.has(textForm(z))) p.push(`Text ${t.nr}: Zeile steht schon anderswo: ${z}`);
    for (const s of saetze(t)) if (formen.has(textForm(s))) p.push(`Text ${t.nr}: Satz steht schon anderswo: ${s}`);
    const voll = ` ${textForm(t.zeilen.join(" "))} `;
    for (const f of lange) if (voll.includes(` ${f} `)) p.push(`Text ${t.nr}: enthält fremdes Stück: ${f}`);
  }
  return p;
}

/** Keine Paare und nichts fast gleich mit dem italienischen Korpus (Sätze ab fünf Wörtern). */
export function paarProbleme(texte: Probentext[], korpus: string[]): string[] {
  const p: string[] = [];
  const lang = (s: string) => (s.match(/\p{L}+/gu) ?? []).length >= 5;
  const paare = new Map(korpus.filter(lang).map((k) => [paarForm(k), k] as const));
  const mengen = korpus.filter(lang).map((k) => [k, menge(k)] as const);
  for (const t of texte) {
    for (const s of saetze(t).filter(lang)) {
      const k = paare.get(paarForm(s));
      if (k !== undefined) p.push(`Text ${t.nr}: "${s}" ist ein Paar zu "${k}"`);
      const m = menge(s);
      for (const [k2, m2] of mengen) if (fastGleich(m, m2)) p.push(`Text ${t.nr}: "${s}" ~ "${k2}"`);
    }
  }
  return p;
}

// ── Vergleichbarkeit ───────────────────────────────────────────────────────

const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/**
 * Vergleichbarkeit wie `scripts/pruefe-schreibproben.mts` Regel 10: Länge,
 * Zeilenzahl und mittlere Wortlänge je höchstens 18 % vom Median, Anteil
 * Grossbuchstaben und Satzzeichen höchstens 60 % - sonst hinge die Note am Los.
 */
export function vergleichProbleme(texte: Probentext[]): string[] {
  const p: string[] = [];
  const kz = texte.map((t) => {
    const voll = t.zeilen.join(" ");
    const b = [...voll].filter((c) => /\p{L}/u.test(c));
    const w = voll.split(/\s+/).filter(Boolean).length;
    return {
      zeichen: zeichenZahl(t),
      zeilen: t.zeilen.length,
      wortLaenge: b.length / w,
      gross: b.filter((c) => c === c.toUpperCase() && c !== c.toLowerCase()).length / b.length,
      sonder: [...voll].filter((c) => !/\p{L}/u.test(c) && c !== " ").length / voll.length,
    };
  });
  const grenzen = { zeichen: 0.18, zeilen: 0.18, wortLaenge: 0.18, gross: 0.6, sonder: 0.6 } as const;
  for (const feld of Object.keys(grenzen) as (keyof typeof grenzen)[]) {
    const m = median(kz.map((k) => k[feld]));
    kz.forEach((k, i) => {
      if (Math.abs(k[feld] - m) / m > grenzen[feld]) p.push(`Text ${texte[i].nr}: ${feld} ${k[feld].toFixed(3)} gegen Median ${m.toFixed(3)}`);
    });
  }
  return p;
}

// ── Akzente ─────────────────────────────────────────────────────────────────

/**
 * Wörter, die es NUR mit Akzent gibt (Bauplan I6, Falle 36): ihre Form ohne
 * Akzent darf nie stehen. Die neun Paare, bei denen beide Formen Wörter sind
 * (è/e, dà/da, dì/di, là/la, lì/li, né/ne, sé/se, sì/si, tè/te), prüft der
 * Leser - und für „e" gegen „è" die Stichprobe unten.
 */
const NUR_MIT_AKZENT = new Set(
  "citta perche piu gia puo cosi poiche affinche cioe pero percio giu cio caffe tiramisu menu ventitre trentatre universita liberta societa qualita meta lunedi martedi mercoledi giovedi venerdi".split(" "),
);
export const ohneAkzent = (zeile: string): string[] => woerter(zeile).flatMap((w) => w.toLowerCase().split("'")).filter((w) => NUR_MIT_AKZENT.has(w));

/** „e" vor einem Wort, das fast immer hinter „è" steht, ist verdächtig (vergessener Akzent). */
const NACH_E_VERDAECHTIG = new Set(
  "molto tanto troppo già qui là lì ancora sempre appena pronto pronta nato nata finito finita arrivato arrivata caldo calda freddo fredda bello bella buono buona nuovo nuova grande piccolo piccola contento contenta stanco stanca felice vicino lontano chiuso chiusa aperto aperta vero vera giusto giusta facile difficile possibile importante normale".split(" "),
);
/** Gelesen: hier ist „e" wirklich „und". */
const E_GELESEN: ReadonlySet<string> = new Set([
  "e qui", // Text 6: „è rimasto alla scuola media, e qui, l'ho capito oggi, …"
  "e ancora", // Text 8: das Beispiel der d eufonica „e ancora, a Empoli"
]);
export function eVerdaechtig(zeile: string): string[] {
  const w = zeile.toLowerCase().match(/[\p{L}']+/gu) ?? [];
  return w.flatMap((x, i) => (x === "e" && NACH_E_VERDAECHTIG.has(w[i + 1] ?? "") ? [`e ${w[i + 1]}`] : []));
}

// ── Fremdes Material ────────────────────────────────────────────────────────

const ANDERE_BANKEN: Probentext[] = [
  ...SATZ_DE, ...SATZ_EN, ...SATZ_FR, ...SATZ_ES,
  ...BUCHSTABEN_DE, ...BUCHSTABEN_EN, ...BUCHSTABEN_FR, ...BUCHSTABEN_ES,
  ...ZAHLEN_DE, ...ZAHLEN_EN, ...ZAHLEN_FR, ...ZAHLEN_ES,
  ...ALLES_DE, ...ALLES_EN, ...ALLES_FR, ...ALLES_ES,
];
const FREMD: string[] = [
  ...[...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT].map((i) => i.text),
  ...ANDERE_BANKEN.flatMap((t) => t.zeilen),
];
const KORPUS_IT = CORPUS_IT.map((i) => i.text);

// ---------------------------------------------------------------------------

describe("Sfida it, Niveau Con punteggiatura - die Bank", () => {
  it("fünfzehn Texte, Nummern 0 bis 14, A trägt 0-7 und B 8-14, der Sammler alle in Reihenfolge", () => {
    expect(TEXTE.length).toBe(PROBEN_JE_NIVEAU);
    expect(TEXTE.map((t) => t.nr)).toEqual([...Array(PROBEN_JE_NIVEAU).keys()]);
    expect(TEXTE_A.every((t) => t.nr <= 7)).toBe(true);
    expect(TEXTE_B.every((t) => t.nr >= 8)).toBe(true);
    expect(TEXTE_IT).toEqual(TEXTE);
  });

  it("der Vorrat ist gemessen: das Niveau hat genau . , ? ! \" : ; - ( ) und den Apostroph, Zeilen 30-40, Umschalttaste", () => {
    const sonder = [...zeichenVorrat("satz", "it")].filter((c) => !/\p{L}/u.test(c) && c !== " ").sort();
    expect(sonder).toEqual([...SATZZEICHEN].sort());
    expect([SATZ.zeileVon, SATZ.zeileBis, SATZ.shift]).toEqual([30, 40, true]);
  });

  it("keine Zeile hat Form-Probleme (Vorrat, Länge, it-Regeln, Sperrliste, Person zuerst)", () => {
    const p = TEXTE.flatMap((t) => t.zeilen.flatMap((z, i) => zeilenProbleme(z).map((q) => `Text ${t.nr} Zeile ${i}: ${q} - ${z}`)));
    expect(p).toEqual([]);
  });

  it("kein Text hat Probleme (Klammern, Anführung, alle Satzzeichen, Satzanfänge, Länge, Titel)", () => {
    expect(TEXTE.flatMap((t) => textProbleme(t).map((q) => `Text ${t.nr}: ${q}`))).toEqual([]);
  });

  it("Räume: Norden höchstens drei, Süden/Inseln und Tessin/Graubünden nicht schwächer, Südtirol zwei, jeder Raum dabei", () => {
    expect(orteProbleme(TEXTE, ORTE)).toEqual([]);
  });

  it("Titel eindeutig, keine Zeile doppelt", () => {
    expect(bankProbleme(TEXTE)).toEqual([]);
  });

  it("keine Kopie aus den Korpora aller Wege (de/en/fr/es/it) und aus den Prüfungstexten der anderen Sprachen", () => {
    expect(FREMD.length).toBeGreaterThan(5000);
    expect(kopieProbleme(TEXTE, FREMD)).toEqual([]);
  });

  it("keine Paare und nichts fast gleich mit dem italienischen Korpus", () => {
    expect(KORPUS_IT.length).toBeGreaterThan(1000);
    const p = paarProbleme(TEXTE, KORPUS_IT);
    expect(p, p.slice(0, 10).join("\n")).toEqual([]);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da; „e“ vor einem Prädikatswort ist gelesen", () => {
    expect(TEXTE.flatMap((t) => t.zeilen.flatMap((z) => ohneAkzent(z).map((w) => `Text ${t.nr}: ${w} - ${z}`)))).toEqual([]);
    const e = TEXTE.flatMap((t) => t.zeilen.flatMap((z) => eVerdaechtig(z).filter((f) => !E_GELESEN.has(f)).map((f) => `Text ${t.nr}: ${f} - ${z}`)));
    expect(e).toEqual([]);
  });

  it("die fünfzehn Texte sind vergleichbar", () => {
    expect(vergleichProbleme(TEXTE)).toEqual([]);
  });
});

describe("Gegenproben - jede Regel muss anschlagen", () => {
  it("gute Zeilen sind grün (Elision, po', Akzent, Klammer, Rede, Gedankenstrich)", () => {
    expect(zeilenProbleme('"C\'è un po\' di pane?" chiede Luca.')).toEqual([]);
    expect(zeilenProbleme("L'amica di Gaia (la più alta) ride.")).toEqual([]);
    expect(zeilenProbleme("Perché no? La città - dice - è lì.")).toEqual([]);
  });

  it.each([
    ["È tardi, dice Luca, andiamo a casa ora.", "verbotenes Zeichen È (grosser Akzentbuchstabe (Windows: nicht tippbar))"],
    ["Luca arriva alle 8, con due amiche ora.", "Ziffer 8"],
    ["Luca dice «ciao» a tutti, poi va via.", "verbotenes Zeichen « (Guillemet (gerade Anführung nehmen))"],
    ["Luca dice ciao – poi va via con Anna.", "verbotenes Zeichen – (Halbgeviertstrich (nur Bindestrich))"],
    ["Luca paga cinque € per un gelato buono.", "Zeichen € nicht im Vorrat"],
    ["Luca arriva tardi.", "Länge 18"],
    ["Luca arriva tardi alla stazione con due amiche.", "Länge 47"],
    ["Luca chiede : vieni anche tu al mare?", "Leerzeichen vor ? ! : ; (im Italienischen kein Leerzeichen, GLOSSAR §1 Nr. 7)"],
    ["Luca arriva alla stazione , con Anna.", "Leerzeichen an Satzzeichen"],
    ["Luca arriva alla stazione  con Anna ora.", "Leerraum"],
    ["E' tardi, dice Luca, andiamo a casa ora.", "„E'“ statt „È“ (I5)"],
    ["Luca non sa qual'è la strada per casa.", "„qual'è“ ist falsch - es heisst „qual è“ (Crusca)"],
    ["Luca saluta un'amico alla stazione ora.", "„un'“ vor einem männlichen Wort (un'amico ⇒ un amico)"],
    ["Luca mangia un pò di pane alla stazione.", "pò statt po'"],
    ["Luca dice che perche' piove resta qui.", "Buchstabe + Apostroph statt Akzent (perche' ⇒ perché; Crusca: grafischer Fehler)"],
    ["- Vieni anche tu? chiede Luca ad Anna.", "Dialogstrich am Anfang (I8: wörtliche Rede mit \"…\")"],
    ["Luca aiuta i ciechi ad attraversare.", "Person zuerst: ciechi"],
    ["Luca saluta i non vedenti del circolo.", "Person zuerst: non vedenti"],
    ["Luca dice che la mona del paese ride.", "Sperrliste: mona"],
    ["Luca compra piselli e patate al mercato.", "Sperrliste: piselli"],
    ["Luca scrive in fretta... e poi esce ora.", "Auslassungspunkte"],
  ])("%s", (zeile, erwartet) => {
    const p = zeilenProbleme(zeile);
    if (erwartet === "") expect(p).toEqual([]);
    else expect(p).toContain(erwartet);
  });

  it("ein Wort ohne Akzent und „e“ statt „è“ fallen auf", () => {
    expect(ohneAkzent("La citta è piu bella perche piove?")).toEqual(["citta", "piu", "perche"]);
    expect(ohneAkzent("La città è più bella perché piove?")).toEqual([]);
    expect(eVerdaechtig("Il tè e caldo, Luca e pronto.")).toEqual(["e caldo", "e pronto"]);
    expect(eVerdaechtig("Luca e Anna sono qui.")).toEqual([]);
  });

  const text = (zeilen: string[], titel = "Una prova"): Probentext => ({ nr: 0, titel, zeilen });

  it("Klammer in Klammer, halbe Klammer, ungerade Anführung, fehlendes Satzzeichen, wenige Satzanfänge, kurzer Text, Titel", () => {
    const p = textProbleme(text(['Luca (la (prima) dice "ciao'], "Una prova di È"));
    expect(p).toContain("Klammer in Klammer");
    expect(p).toContain("Klammern gehen nicht auf");
    expect(p).toContain("Anführungszeichen ungerade");
    expect(p).toContain("Satzzeichen ; fehlt");
    expect(p).toContain("nur 0 Zeilen mit Satzende");
    expect(p).toContain(`27 Zeichen, mindestens ${MIND_ZEICHEN}`);
    expect(p.some((q) => q.startsWith("Titel: verbotenes Zeichen È"))).toBe(true);
    expect(textProbleme(text(["Luca ride) e va."]))).toContain("Klammer zu ohne auf");
  });

  it("Räume: vier Texte im Norden, kein Südtirol, ein fehlender und ein doppelter Ort schlagen an", () => {
    const t = [0, 1, 2, 3, 4].map((nr) => ({ nr, titel: "x", zeilen: ["A Torino piove."] }));
    const o: Record<number, ProbenOrtIt> = {};
    for (const nr of [0, 1, 2, 3]) o[nr] = { raum: "nord", ort: "Torino" };
    const p = orteProbleme(t, o);
    expect(p).toContain("mehr als drei Texte im Norden");
    expect(p).toContain("Süden und Inseln schwächer als der Norden");
    expect(p).toContain("weniger als zwei Texte in Südtirol");
    expect(p).toContain("kein Text im Raum grigioni");
    expect(p).toContain("Text 4: kein Ort");
    expect(p).toContain("Ort doppelt: Torino");
    expect(orteProbleme([t[0]], { 0: { raum: "isole", ort: "Cagliari" } })).toContain("Text 0: Ort Cagliari kommt nicht vor");
  });

  it("doppelter Titel und doppelte Zeile (auch mit anderen Satzzeichen) schlagen an", () => {
    const a = text(["La nonna prepara le orecchiette."], "Uguale");
    const b = { ...text(["La nonna prepara le orecchiette!"], "Uguale"), nr: 1 };
    const p = bankProbleme([a, b]);
    expect(p).toContain("Titel doppelt: Uguale");
    expect(p.some((q) => q.startsWith("Zeile doppelt"))).toBe(true);
  });

  it("Kopie: eine Korpus-Zeile als Zeile, als Satz über zwei Zeilen und als Teilstück wird gefunden", () => {
    const k = KORPUS_IT.find((s) => textForm(s).length >= 30)!;
    expect(kopieProbleme([text([k])], FREMD).length).toBeGreaterThan(0);
    const w = k.split(" ");
    const halb = Math.ceil(w.length / 2);
    const ueberZwei = text([`Poi dice: ${w.slice(0, halb).join(" ")}`, `${w.slice(halb).join(" ")} E va.`]);
    expect(kopieProbleme([ueberZwei], FREMD).some((q) => q.includes("fremdes Stück"))).toBe(true);
    expect(kopieProbleme([text(["Una riga che nessuno ha mai scritto prima."])], FREMD)).toEqual([]);
  });

  it("Paare und fast gleiche Sätze werden gefunden, verschiedene nicht", () => {
    expect(paarProbleme([text(["Il nonno di Luca ride sempre a tavola."])], ["La nonna di Luca ride sempre a tavola!"]).some((q) => q.includes("ist ein Paar"))).toBe(true);
    expect(paarProbleme([text(["Oggi Luca porta il pane fresco a casa."])], ["Oggi Luca porta il pane caldo a casa."]).length).toBeGreaterThan(0);
    expect(paarProbleme([text(["Domani Anna parte per Bari con il treno."])], ["Il gatto dorme sul divano tutto il giorno."])).toEqual([]);
  });

  it("ein viel zu langer Text fällt aus dem Vergleich", () => {
    const echt = TEXTE.slice(0, 5);
    const lang = { ...echt[0], nr: 99, zeilen: [...echt[0].zeilen, ...echt[1].zeilen] };
    expect(vergleichProbleme([...echt, lang]).some((q) => q.startsWith("Text 99: zeichen"))).toBe(true);
  });
});
