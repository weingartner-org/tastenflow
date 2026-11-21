/**
 * ★★★ Wächter IT-S Kinder (03.10.2026): die ersten ITALIENISCHEN Serien für Kinder 8-11 (`serienItKids1.ts`),
 * eingehängt über `serienIt.ts` → `SERIEN_IT` → `SERIEN`.
 *
 * Vorbilder: `tastenflow-serien-es-kids-1.test.ts` (Form, Wortgrenze, Paare), `tastenflow-serien-es-eingehaengt.test.ts`
 * (validateSerie, Griff auf jeder Tastatur, Sprossen ausgerechnet) und `tastenflow-texte-it-kids-ende.test.ts` (IT-T7: die
 * italienischen Zeilenregeln, Grosswörter nach dem Kürzen, Wörterbuch, è gegen e, fast gleich). Befund:
 * `BEFUND-2026-10-02-IT-SERIEN-KIDS-1.md`.
 *
 *  1. Form: ein Satz je Zeile, 4-16 Wörter, Grossbuchstabe am Anfang, Satzschluss am Ende, keine Ziffern, kein grosser
 *     Akzentbuchstabe (Windows, I4), die Regeln aller it-Zeilen (`helfer/itTextRegeln.ts`), 12-16 Zeilen je Etappe,
 *     2-3 Etappen, jede Etappe endet auf ? oder !.
 *  2. Eingehängt: `validateSerie(s, "it")`, `minTier` gerechnet == eingetragen, nur auf Weg „it" sichtbar.
 *  3. Tastaturen: jedes Zeichen hat auf `it`, `it-qzerty`, `ch-fr` und `ch` einen Griff; jede Zeile wird auf `it` und
 *     `it-qzerty` serviert (Öffnungs-Sprosse ausgerechnet).
 *  4. Gekürzt serviert: kein Grosswort mitten im Satz, das kein Eigenname der Serie ist (auch nicht vor „? ! : \"").
 *  5. Wortschatz: kein Inhaltswort in mehr als 8 Zeilen der Charge, Sperrliste (Kern + Wortbasis), jedes Wort im
 *     Wortschatz oder vom macOS-Wörterbuch bestätigt (oder als Fremd-/Dialektwort begründet), keine Wörter ohne ihren
 *     Akzent, kein verdächtiges „e" statt „è".
 *  6. Keine Kopien und keine Paare - untereinander, gegen `CORPUS_IT` und gegen jede andere Sprache (Text, ohne
 *     Satzzeichen, Ledger-Schlüssel); nichts fast gleich (Jaccard ≥ 0,6).
 *  7. Regionen: Süden und Inseln mindestens so stark wie der Norden, jede geforderte Region kommt vor.
 *
 * Jede Regel hat eine Gegenprobe - ein Wächter, der nie anschlägt, beweist nichts.
 */
import { afterEach, describe, expect, it } from "vitest";
import { layoutById, setLayout, type KeyboardLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { fitText, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { kombizeichenZu } from "../src/lib/typing/totasten";
import { SERIEN_IT_KIDS_1 } from "../src/lib/typing/serienItKids1";
import type { SerieEntwurfIt } from "../src/lib/typing/serienItTyp";
import { SERIEN_IT } from "../src/lib/typing/serienIt";
import { SERIEN, allowedFromIntroduced } from "../src/lib/typing/serien";
import { computeSerieMinTier, serieLines, validateSerie, type Serie } from "../src/lib/typing/serie";
import { bausteinKey } from "../src/lib/typing/ledger";
import { gesperrtIt, istKernGesperrtIt } from "../src/lib/typing/sperrlisteIt";
import { WORDS_IT, STUFE_VOCAB_IT } from "../src/lib/typing/wordsIt";
import { NACHTRAG_IT } from "../src/lib/typing/lexikonNachtragIt";
import { normalizeWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/itTextRegeln";

afterEach(() => setLayout("de"));

const SERIEN_K = SERIEN_IT_KIDS_1;
const zeilenVon = (s: { etappen: { lines: string[] }[] }) => s.etappen.flatMap((e) => e.lines);
const ZEILEN = SERIEN_K.flatMap(zeilenVon);
const EIGENE = new Set(ZEILEN);

// ── 1 · Form ────────────────────────────────────────────────────────────────

const woerter = (z: string): string[] => z.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

/** Alle Form-Verstösse EINER Zeile (leer = in Ordnung). */
export function zeilenProbleme(z: string): string[] {
  const p: string[] = [...zeilenFehler(z)];
  if (!/^[A-Za-zàèéìòù .,;:?!"']+$/.test(z)) p.push("Zeichen ausserhalb von Buchstaben und . , ; : ? ! \" '");
  if (/[ÀÈÉÌÒÙ]/.test(z)) p.push("grosser Akzentbuchstabe (unter Windows nicht tippbar, I4)");
  if (!/^"?[A-Z]/.test(z)) p.push("kein Grossbuchstabe am Anfang");
  if (!/[.!?]"?$/.test(z)) p.push("kein Satzschluss am Ende");
  if (/[.!?]"?\s+"?\p{Lu}/u.test(z)) p.push("mehr als ein Satz");
  if (/[,;:][^ ]/.test(z)) p.push("kein Leerzeichen nach , ; :");
  if ((z.match(/"/g) ?? []).length % 2 !== 0) p.push("Anführungszeichen ungerade");
  const n = woerter(z).length;
  if (n < 4 || n > 16) p.push(`${n} Wörter`);
  return p;
}

describe("1 · Form jeder Zeile, jeder Etappe, jeder Serie", () => {
  it("jede Zeile besteht die Form-Regeln", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenProbleme(z).map((f) => `${f}: ${z}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("20 Serien, alle für Kinder, 19 mit zwei Etappen und eine mit drei, 12-16 Zeilen je Etappe, jede endet auf ? oder !", () => {
    expect(SERIEN_K.length).toBe(20);
    const fehler: string[] = [];
    for (const s of SERIEN_K) {
      if (JSON.stringify(s.stufen) !== '["kids"]') fehler.push(`${s.slug}: stufen`);
      if (s.kind !== "geschichte") fehler.push(`${s.slug}: kind`);
      if (s.etappen.length < 2 || s.etappen.length > 3) fehler.push(`${s.slug}: ${s.etappen.length} Etappen`);
      s.etappen.forEach((e, i) => {
        if (e.lines.length < 12 || e.lines.length > 16) fehler.push(`${s.slug} E${i + 1}: ${e.lines.length} Zeilen`);
        if (!/[?!]"?$/.test(e.lines[e.lines.length - 1] ?? "")) fehler.push(`${s.slug} E${i + 1}: endet ohne ? oder !`);
      });
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(SERIEN_K.filter((s) => s.etappen.length === 3).length).toBe(1);
  });

  it("Slugs eindeutig mit Vorsilbe it-kids-1-, Titel höchstens 6 Wörter, Herkunft eigenes Werk, jeder Eigenname kommt vor", () => {
    const fehler: string[] = [];
    const slugs = new Set<string>();
    for (const s of SERIEN_K) {
      if (!s.slug.startsWith("it-kids-1-")) fehler.push(`${s.slug}: Vorsilbe`);
      if (slugs.has(s.slug)) fehler.push(`${s.slug}: doppelt`);
      slugs.add(s.slug);
      if (woerter(s.titel).length > 6) fehler.push(`${s.slug}: Titel zu lang`);
      if (/[ÀÈÉÌÒÙ]/.test(s.titel)) fehler.push(`${s.slug}: Titel mit grossem Akzentbuchstaben`);
      if (s.herkunft.quelle !== "Sensorik" || s.herkunft.lizenz !== "Eigenes Werk") fehler.push(`${s.slug}: herkunft`);
      for (const n of s.eigennamen) if (!zeilenVon(s).some((l) => l.includes(n))) fehler.push(`${s.slug}: Eigenname ${n} kommt nicht vor`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it.each([
    ["Il gatto dorme.", "3 Wörter"],
    ["il gatto dorme sul divano.", "kein Grossbuchstabe am Anfang"],
    ["Il gatto dorme sul divano", "kein Satzschluss am Ende"],
    ["Il gatto dorme sul divano. Poi si sveglia.", "mehr als ein Satz"],
    ["Il gatto dorme sul divano! Poi si sveglia.", "mehr als ein Satz"],
    ["Il gatto dorme sul divano,tutto il giorno.", "kein Leerzeichen nach , ; :"],
    ["Il gatto ha 3 anni e dorme.", "Zeichen ausserhalb von Buchstaben und . , ; : ? ! \" '"],
    ["Il gatto dorme - poi si sveglia.", "Zeichen ausserhalb von Buchstaben und . , ; : ? ! \" '"],
    ["Ormai È tardi per il gatto.", "grosser Akzentbuchstabe (unter Windows nicht tippbar, I4)"],
    ['Il gatto dice "miao a tutti.', "Anführungszeichen ungerade"],
    ["Il gatto dorme sul divano rosso della nonna e sogna un topo grigio molto veloce anche oggi.", "17 Wörter"],
  ])("Gegenprobe Zeile rot: %s", (zeile, erwartet) => {
    expect(zeilenProbleme(zeile)).toContain(erwartet);
  });

  it("Gegenprobe: gute Zeilen mit Anführung, Elision und Akzent sind grün", () => {
    for (const z of ['"Che bello!" esclama Pietro.', "Perché il gatto non c'è più?", "Ho un'idea: andiamo al porto."]) {
      expect(zeilenProbleme(z), z).toEqual([]);
    }
  });
});

// ── 2 · Eingehängt ──────────────────────────────────────────────────────────

describe("2 · eingehängt: validateSerie, minTier gerechnet, nur auf Weg it", () => {
  it("jede Serie besteht validateSerie(s, \"it\") und trägt ihr gerechnetes minTier", () => {
    const fehler: string[] = [];
    for (const s of SERIEN_K) {
      const serie = s as unknown as Serie;
      const { ok, problems } = validateSerie(serie, "it");
      if (!ok) fehler.push(`${s.slug}: ${problems.join("; ")}`);
      if (s.minTier === undefined || computeSerieMinTier(serie, "it") !== s.minTier) fehler.push(`${s.slug}: minTier`);
      if (s.lang !== "it" || s.nurWeg !== "it") fehler.push(`${s.slug}: lang/nurWeg`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Serie steht genau einmal in SERIEN_IT und in SERIEN, keine unter einer anderen Sprache", () => {
    for (const s of SERIEN_K) {
      expect(SERIEN_IT.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
      expect(SERIEN.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
    }
    const slugs = new Set(SERIEN_K.map((s) => s.slug));
    expect(SERIEN.filter((s) => s.lang !== "it" && slugs.has(s.slug))).toEqual([]);
  });

  it("Gegenprobe: ein falsch eingetragenes minTier wird abgelehnt", () => {
    const s = SERIEN_K[0] as unknown as Serie;
    const falsch = { ...s, minTier: (((s.minTier as number) + 1) % 6) as Serie["minTier"] };
    expect(validateSerie(falsch, "it").problems.some((p) => p.includes("minTier"))).toBe(true);
  });
});

// ── 3 · Tastaturen und Sprossen ─────────────────────────────────────────────

/** Wie `hatGriff` in `tastenflow-serien-es-eingehaengt.test.ts` (Taste · Umschalt/AltGr · Totaste). */
function hatGriff(layout: KeyboardLayout, zeichen: string): boolean {
  if (zeichen === " ") return true;
  const klein = zeichen.toLowerCase();
  if (layout.rows.some((r) => r.keys.includes(klein))) return true;
  if (layout.access[klein] !== undefined) return true;
  return kombizeichenZu(zeichen, layout) !== undefined;
}

const TASTATUREN: LayoutId[] = ["it", "it-qzerty"];
const ordnungCache = new Map<LayoutId, string[]>();
function ordnung(l: LayoutId): string[] {
  let o = ordnungCache.get(l);
  if (!o) {
    setLayout(l);
    o = introOrder("it");
    ordnungCache.set(l, o);
  }
  setLayout(l);
  return o;
}
const allowedCache = new Map<string, Set<string>>();
function allowedAt(l: LayoutId, n: number): Set<string> {
  const k = `${l}:${n}`;
  let s = allowedCache.get(k);
  if (!s) {
    s = allowedFromIntroduced(ordnung(l).slice(0, n), "it");
    allowedCache.set(k, s);
  }
  setLayout(l);
  return s;
}
const norm = (t: string) => t.replace(/\s+/g, " ").trim();
function buchstabenSprosse(t: string, l: LayoutId): number | null {
  const o = ordnung(l);
  for (let n = 1; n <= o.length; n++) if (fitText(t, allowedAt(l, n), "it") !== null) return n;
  return null;
}
function volleSprosse(t: string, l: LayoutId): number | null {
  const o = ordnung(l);
  for (let n = 1; n <= o.length; n++) if (fitText(t, allowedAt(l, n), "it") === norm(t)) return n;
  return null;
}
/** Kleinste Sprosse, ab der JEDE Zeile der Serie serviert wird. */
export function oeffnet(s: { etappen: { lines: string[] }[] }, l: LayoutId): number | null {
  let max = 0;
  for (const z of zeilenVon(s)) {
    const b = buchstabenSprosse(z, l);
    if (b === null) return null;
    max = Math.max(max, b);
  }
  return max;
}

describe("3 · jedes Zeichen hat einen Griff, jede Zeile wird serviert", () => {
  it("jedes Zeichen jeder Zeile ist auf it, it-qzerty, ch-fr und ch greifbar", () => {
    const fehler: string[] = [];
    for (const id of ["it", "it-qzerty", "ch-fr", "ch"]) {
      const lay = layoutById(id);
      for (const ch of new Set(ZEILEN.join(""))) if (!hatGriff(lay, ch)) fehler.push(`„${ch}" fehlt auf ${id}`);
    }
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: ein Zeichen ohne Griff wird gefunden", () => {
    expect(hatGriff(layoutById("it"), "ñ")).toBe(false);
    expect(hatGriff(layoutById("it"), "ò")).toBe(true);
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Serie öffnet (jede Zeile wird irgendwann serviert, spätestens am Ende vollständig)`, () => {
      const fehler: string[] = [];
      for (const s of SERIEN_K) if (oeffnet(s, l) === null) fehler.push(s.slug);
      for (const z of ZEILEN) if (volleSprosse(z, l) === null) fehler.push(`nie vollständig: ${z}`);
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  /**
   * Öffnungs-Einheit je Serie, GEMESSEN am 03.10.2026 (Befund §3). Auf `it-qzerty` kommt „ò" erst nach „ì" (die achte
   * Heimtaste ist dort „m") - eine Serie mit „ò" und ohne „ù y w x" öffnet dort darum später. Die Tabelle ist die
   * Erwartung; ändert sich eine Zeile, muss die Öffnung neu gelesen und hier eingetragen werden.
   */
  const OEFFNET: Record<string, [string, string]> = {
    "it-kids-1-la-spada-di-orlando": ["ù", "ù"],
    "it-kids-1-parole-dal-mare": ["y", "y"],
    "it-kids-1-il-fiato-di-efisio": ["é", "ò"], // „perché" öffnet bei „é"; „però" auf it-qzerty erst bei „ò" (dort nach „ì")
    "it-kids-1-la-gente-rossa": ["ù", "ù"],
    "it-kids-1-kalimera": ["ù", "ù"],
    "it-kids-1-il-frutto-a-strisce": ["ù", "ù"],
    "it-kids-1-una-statuina-per-assunta": ["ù", "ù"],
    "it-kids-1-il-fischietto-dei-sassi": ["ù", "ù"],
    "it-kids-1-un-orso-nel-frutteto": ["q", "q"],
    "it-kids-1-la-gondola-di-cartone": ["ù", "ù"],
    "it-kids-1-il-mortaio-di-nonna-bice": ["ù", "ù"],
    "it-kids-1-sotto-i-portici": ["ù", "ù"],
    "it-kids-1-il-cappello-e-la-bora": ["q", "q"],
    "it-kids-1-la-lingua-segreta-di-firenze": ["ì", "ì"],
    "it-kids-1-il-gatto-cesare": ["ù", "ù"],
    "it-kids-1-la-scopa-con-la-stella": ["ù", "ù"],
    "it-kids-1-il-natel-nel-castello": ["ù", "ù"],
    "it-kids-1-allegra": ["ù", "ù"],
    "it-kids-1-fieno-nelle-scarpe": ["ù", "ù"],
    "it-kids-1-due-capitani": ["ù", "ù"],
  };
  it("jede Serie öffnet an der gemessenen Einheit (it / it-qzerty)", () => {
    const ist = Object.fromEntries(
      SERIEN_K.map((s) => [s.slug, [ordnung("it")[oeffnet(s, "it")! - 1], ordnung("it-qzerty")[oeffnet(s, "it-qzerty")! - 1]]]),
    );
    expect(ist).toEqual(OEFFNET);
  });

  it("Gegenprobe: eine Zeile mit Ziffer kommt erst mit der Ziffer vollständig, mit ñ nie", () => {
    expect(volleSprosse("Ho 7 anni.", "it")).toBe(ordnung("it").indexOf("7") + 1);
    expect(buchstabenSprosse("Mañana piove.", "it")).toBeNull();
  });
});

// ── 4 · Grosswörter, auch nach dem Kürzen ───────────────────────────────────

/** Wörter einer Zeile mit Merker „Satzanfang" (Zeilenanfang, nach . ? !, Anfang einer Anführung) - wie IT-T7. */
function woerterMitAnfang(zeile: string): { w: string; anfang: boolean }[] {
  const out: { w: string; anfang: boolean }[] = [];
  let naechsterAnfang = true;
  for (const roh of zeile.split(/\s+/)) {
    const oeffnet = roh.startsWith('"');
    roh.split(/'/).forEach((teil, i) => {
      const w = teil.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
      if (w) out.push({ w, anfang: (i === 0 && (naechsterAnfang || oeffnet)) || (i === 1 && out.length === 1 && naechsterAnfang) });
    });
    naechsterAnfang = /[.!?]"?$/.test(roh);
  }
  return out;
}
/** Grossgeschriebene Wörter, die weder am Satzanfang stehen noch ein Eigenname der Serie sind. */
export function fremdeGrosswoerter(zeile: string, namen: ReadonlySet<string>): string[] {
  return woerterMitAnfang(zeile)
    .filter((x) => !x.anfang && /^\p{Lu}/u.test(x.w) && !namen.has(x.w))
    .map((x) => x.w);
}
const namenVon = (s: SerieEntwurfIt) => new Set(s.eigennamen.flatMap((n) => n.split(/\s+/)));

/**
 * Weg „it" lässt ungelernte `? ! " : ;` weg (Befund IT-T4 §2): eine Serie kommt vor der Sprosse dieser Zeichen
 * GEKÜRZT. Fällt dabei eine Satzgrenze weg (`dice: "Andiamo"` ⇒ `dice Andiamo`), stünde ein Grosswort mitten im Satz.
 */
function gekuerztFehler(zeile: string, namen: ReadonlySet<string>, l: LayoutId): string[] {
  const b = buchstabenSprosse(zeile, l);
  const v = volleSprosse(zeile, l);
  if (b === null || v === null) return [];
  const out = new Set<string>();
  for (let n = b; n < v; n++) {
    const s = fitText(zeile, allowedAt(l, n), "it");
    if (s !== null) for (const w of fremdeGrosswoerter(s, namen)) out.add(`${n}:${w}`);
  }
  return [...out];
}

describe("4 · Grosswörter mitten im Satz sind Eigennamen der Serie - auch gekürzt", () => {
  it("vollständig", () => {
    const fehler = SERIEN_K.flatMap((s) => zeilenVon(s).flatMap((z) => fremdeGrosswoerter(z, namenVon(s)).map((w) => `${s.slug}: ${w} in ${z}`)));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  for (const l of TASTATUREN) {
    it(`${l}: gekürzt serviert`, () => {
      const fehler = SERIEN_K.flatMap((s) => zeilenVon(s).flatMap((z) => gekuerztFehler(z, namenVon(s), l).map((f) => `${s.slug}: ${z} @ ${f}`)));
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  it("Gegenprobe: „dice: \"Andiamo\"\" wird gekürzt zu einem Grosswort mitten im Satz, ein Name nicht", () => {
    const namen = new Set(["Pietro"]);
    expect(fremdeGrosswoerter('"Andiamo al mare!" dice Pietro.', namen)).toEqual([]);
    expect(fremdeGrosswoerter("Pietro dice Andiamo al mare.", namen)).toEqual(["Andiamo"]);
    expect(gekuerztFehler('Pietro dice: "Andiamo al mare."', namen, "it").length).toBeGreaterThan(0);
    expect(gekuerztFehler('"Andiamo al mare", dice Pietro.', namen, "it")).toEqual([]);
  });
});

// ── 5 · Wortschatz ──────────────────────────────────────────────────────────

/**
 * Funktionswörter zählen nicht zur 8-Zeilen-Grenze: die Liste von IT-T7 (Artikel, Präpositionen, Pronomen, Konjunktionen,
 * Fragewörter, anche/perché/più/così/già/qui/là/lì/sì/né) und - wie bei den spanischen Serien haber/ser/estar - alle Formen
 * von essere, avere und stare, dazu Demonstrativ- und Indefinitpronomen und die Präpositionen sotto/sopra/dentro/fuori/
 * dietro/davanti/senza/verso. Alles andere zählt, als WORTFORM (dice und disse getrennt), klein geschrieben.
 */
const FUNKTIONSWOERTER = new Set(
  (
    "il lo la i le l un uno una di d a ad da in con su per tra fra col " +
    "del dello della dei delle dell al allo alla ai alle all dal dallo dalla dai dalle dall " +
    "nel nello nella nei nelle nell sul sullo sulla sui sulle sull gli agli degli negli sugli dagli " +
    "e ed o ma se non si mi ti ci c vi ne io tu lui lei noi voi loro mio mia miei mie tuo tua tuoi tue suo sua suoi sue " +
    "nostro nostra nostri nostre vostro vostra vostri vostre me te sé li " +
    "sono sei siamo siete era erano ero fu fosse fossero sia sarà saranno essere stato stata stati state " +
    "è ho hai ha abbiamo avete hanno aveva avevano avere avuto sta sto stai stanno stava stavano fa fai che chi cui " +
    "tutto tutta tutti tutte anche perché più così già qui là lì sì né " +
    "come dove quando quanto quanta quanti quante cosa quale quali ecco ogni " +
    "questo questa questi queste quest quello quella quelli quelle quell quel quei " +
    "altro altra altri altre stesso stessa stessi stesse nessuno niente qualcosa qualcuno qualche " +
    "sotto sopra dentro fuori dietro davanti senza verso"
  ).split(" "),
);
const inhaltswoerter = (z: string): Set<string> => new Set((z.toLowerCase().match(/\p{L}+/gu) ?? []).filter((w) => !FUNKTIONSWOERTER.has(w)));
const NAMEN_KLEIN = new Set(SERIEN_K.flatMap((s) => s.eigennamen.flatMap((n) => n.toLowerCase().split(/\s+/))));

export function zuHaeufig(zeilen: string[], namen: ReadonlySet<string> = NAMEN_KLEIN, grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltswoerter(z)) if (!namen.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Die Wörter einer Zeile für Sperrliste und Wörterbuch (Elision bleibt am Wort, `po'` wird `po`). */
const pruefWoerter = (zeile: string): string[] =>
  zeile
    .split(/[^\p{L}']+/u)
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter(Boolean);
/** Der Inhaltsteil eines Wortes: bei Elision nur das Wort hinter dem Apostroph (`dell'arabo` ⇒ `arabo`). */
const inhaltsTeile = (zeile: string): string[] =>
  pruefWoerter(zeile)
    .map((w) => w.split("'").pop()!.toLowerCase())
    .filter((w) => w.length >= 2);

/**
 * Wörter dieser Charge, die weder in `WORDS_IT`, `STUFE_VOCAB_IT`, `NACHTRAG_IT` noch im Korpus `CORPUS_IT` standen und die
 * das macOS-Wörterbuch für Italienisch bestätigt hat (`osascript -l JavaScript scripts/woerterbuch-macos.js`, Vorsilbe
 * `it:`, gemessen 03.10.2026; klein UND gross angenommen). Namen und Orte sind darin mitgeprüft.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set(
  (
    "abitate acca acuta addormenta afferra afferrano affondasse affonderà aggancia agitando aisha aiuola animatore " +
    "animatori animatrice annota annusa antichissima antioco appende appendono applaudono appoggiata approvano " +
    "armature arno arrende arrossisce asciutti aspromonte atterra australia austria avvisano bagnarsi bagnate " +
    "bagnini bice binocolo bonaria borbotta botteghe bova bronzi brusio burattino calle calli cantori carruggi " +
    "cascate caterina cavalieri cecità cede chiassosi chinandosi cinquemila ciotole confessa consultano coperchio " +
    "crepa creta curiosissima difficilissimo ditale domenico dotta duello elastico eleggere escursionisti feltro " +
    "filippo fisarmoniche fischietti fischietto flavia foglietti foglietto fondali fori fornai fortezze francia " +
    "fruscio frutteto galleggiare garbare ghiacciai ghiacciato giulio giusi goffo gomitoli gondoliere gonfie " +
    "gorgia grecanico grembiule grembo imbottitura imitarla immobili impolverato impronta incartando incartata " +
    "inciso ingiù intervistano iscrive ladina launeddas leandro limpide livio lucrezia ludovica mandarini mantello " +
    "margaret marsica marsicano melbourne metallici miagolio micio millimetro minuscoli modellino mormora mortai " +
    "mortaio muovendo muoverli nino nonnina nora orsacchiotto paladino paludi panche passerelle paul peppe " +
    "pescasseroli pestano pestare pestava pestello pezzetto piantina piccolissime piuma plana popone porge portico " +
    "posteriori profumate promettono pronunce proporresti raffica rallenta regata reggente respirazione retino " +
    "ribatte ricamate ricamati ridacchia rigira rimbalza ripensa ripesca risalgono ritornerà riuniva robuste " +
    "rosanna rotolano rumoroso saggina sagrato sandro santuario sapiente sbadiglia sbircia sbuffa scalinate " +
    "schiacciano scialli scioglilingua scolari scorge scriversi scudo scuote sdraia segatura selciato senato " +
    "senegal sfogliano sgranati significano soddisfatte soffiando soffio sollevano somigliano soprannome spago " +
    "spalancati sparisce spazzaneve spezzate spoglio statuina stiracchia stonata stormo stradine strofina sub " +
    "taccuino tamburi tenendosi terracotta timide tito tombini tombino torsoli trattenendo tritano trofeo velista " +
    "veneziani viadotto"
  ).split(" "),
);

/**
 * Wörter, die das macOS-Wörterbuch NICHT kennt (gemessen 03.10.2026: „nein") - richtig geschrieben, mit Grund
 * (Befund §4). Die Liste wächst nur mit Begründung.
 *  · Fremd- und Dialektwörter, die die Geschichte selbst erklärt (Sprache als Thema): sukkar (arabisch, Zucker),
 *    arrubia (sardisch, in „sa genti arrubia"), assaje (neapolitanisch, „grazie assaje"), kalimera (Grecanico/Griechisch,
 *    guten Morgen), burja (slowenisch, die Bora), heu (deutsch, Heu), cattus (lateinisch, Katze), hasa/hamicia/harota
 *    (die Gorgia toscana - so KLINGT casa/camicia/carota in Florenz), mellone (südital. Regionalwort für Wassermelone),
 *    pasquella (Lied der Marken/Umbriens am Vorabend der Epiphanie), cuccù (die Tonpfeife von Matera), puparo (der
 *    Puppenspieler der Opera dei pupi, Treccani);
 *  · Namen und Orte, die das Wörterbuch nicht führt: Bepi (venezianisch für Giuseppe), Duccio, Riace, Similaun,
 *    Sarentino (Val Sarentino, Sarntal), Sarrabus, Molentargius (Stagno di Molentargius, Cagliari), Urbania (Marken),
 *    Engadina, Pontresina, Corbaro (Castello di Sasso Corbaro, Bellinzona), Barcolana (Regatta in Triest), Camargue,
 *    SPQR (Senatus Populusque Romanus).
 */
const OHNE_WOERTERBUCH: ReadonlySet<string> = new Set(
  (
    "sukkar arrubia assaje kalimera burja heu cattus hasa hamicia harota mellone pasquella cuccù puparo " +
    "bepi duccio riace similaun sarentino sarrabus molentargius urbania engadina pontresina corbaro barcolana camargue spqr"
  ).split(" "),
);

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [
    ...WORDS_IT,
    ...Object.values(STUFE_VOCAB_IT).flat(),
    ...NACHTRAG_IT,
    ...CORPUS_IT.flatMap((i) => i.text.split(/[^\p{L}]+/u)),
  ]
    .map((w) => normalizeWord(w, "it"))
    .filter(Boolean),
);

export function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) for (const w of inhaltsTeile(z)) if (!VORHER_BEKANNT.has(w) && !VOM_WOERTERBUCH_BESTAETIGT.has(w) && !OHNE_WOERTERBUCH.has(w)) out.add(w);
  return [...out];
}

/** Wörter, die es NUR mit Akzent gibt (Bauplan I6): ihre Form ohne Akzent darf nie stehen (`citta`, `perche`). */
const NUR_MIT_AKZENT: ReadonlySet<string> = new Set(
  [...VORHER_BEKANNT, ...VOM_WOERTERBUCH_BESTAETIGT]
    .filter((w) => /[àèéìòù]$/.test(w))
    .map((w) => w.normalize("NFD").replace(/[̀-ͯ]/g, ""))
    .filter((ohne) => !VORHER_BEKANNT.has(ohne)),
);
const ohneAkzentFehler = (zeile: string): string[] =>
  pruefWoerter(zeile)
    .flatMap((w) => w.split("'"))
    .map((w) => w.toLowerCase())
    .filter((w) => NUR_MIT_AKZENT.has(w));

/** ★ „e" gegen „è" (IT-T7): „e" vor einem typischen Prädikatswort ist verdächtig. */
const NACH_E_VERDAECHTIG = new Set(
  (
    "molto tanto troppo già qui là lì ancora sempre appena pronto pronta pronti pronte nato nata finito finita " +
    "arrivato arrivata caldo calda freddo fredda bello bella buono buona nuovo nuova grande piccolo piccola " +
    "contento contenta stanco stanca felice vicino lontano chiuso chiusa aperto aperta vuoto vuota pieno piena " +
    "in a di"
  ).split(" "),
);
export const eVerdaechtig = (zeile: string): boolean => {
  const w = zeile.toLowerCase().match(/[\p{L}]+/gu) ?? [];
  return w.some((x, i) => x === "e" && NACH_E_VERDAECHTIG.has(w[i + 1] ?? ""));
};
/**
 * Zeilen, in denen „e" vor einem dieser Wörter steht und dennoch „und" heisst - gelesen am 03.10.2026. Jede neue
 * verdächtige Zeile muss gelesen und hier eingetragen werden.
 */
const E_GELESEN: ReadonlySet<string> = new Set<string>([
  "Dietro le quinte si sente odore di colla, di vernice e di segatura.",
  "Gennaro abita a Napoli, in una strada stretta e sempre affollata.",
  "Giacomo vive a Genova, una città di porti, di vicoli e di salite.",
  "All'arrivo c'è una gran confusione di vele, di voci e di fischietti.",
  "\"Manca da ieri sera, e di solito non salta mai la cena\", sospira lei.",
  "Quando i cantori se ne vanno, la casa profuma di arance e di cannella.",
  "Si chiama Ladina, e in famiglia usa il romancio.",
  "Ladina e Nora si abbracciano un po' timide, e in un attimo ridono insieme.",
  "Il primo ottobre la piazza si riempie di gente, di tamburi e di bandiere.",
]);

describe("5 · Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Eigennamen ausgenommen)", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort und ein Name nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `La luna ${"abcdefghi"[i]} è sopra di noi, Pietro?`);
    expect(zuHaeufig(neun, new Set(["pietro"]))).toEqual(['"luna": 9 Zeilen']);
    expect(zuHaeufig(neun.slice(0, 8), new Set(["pietro"]))).toEqual([]);
    expect(zuHaeufig(neun, new Set())).toContain('"pietro": 9 Zeilen');
  });

  it("kein Wort aus der Sperrliste - Kern und Wortbasis, auch hinter einer Elision", () => {
    const fehler = ZEILEN.flatMap((z) => pruefWoerter(z).filter((w) => gesperrtIt(w)).map((w) => `${w}: ${z}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: mona, passera (Kern), uccelli, banane (Wortbasis) und dell'uccello werden gefunden, palla nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(istKernGesperrtIt("passera")).toBe(true);
    expect(pruefWoerter("Sul ramo cantano gli uccelli.").some((w) => gesperrtIt(w))).toBe(true);
    expect(gesperrtIt("banane")).toBe(true);
    expect(pruefWoerter("Il nido dell'uccello è vuoto.").some((w) => gesperrtIt(w))).toBe(true);
    expect(gesperrtIt("palla")).toBe(false);
  });

  it("jedes Wort steht im Wortschatz oder ist vom Wörterbuch bestätigt oder begründet - und die Listen tragen nur Gebrauchtes", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    const benutzt = new Set(ZEILEN.flatMap(inhaltsTeile));
    expect([...VOM_WOERTERBUCH_BESTAETIGT].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
    expect([...OHNE_WOERTERBUCH].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein Tippfehler und ein erfundener Ort werden gemeldet", () => {
    expect(ungeprueft(["Il gattto dorme ad Atlantide."])).toEqual(["gattto", "atlantide"]);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da - und kein „e\" steht verdächtig für „è\"", () => {
    const fehler = ZEILEN.flatMap((z) => ohneAkzentFehler(z).map((w) => `${w}: ${z}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.filter(eVerdaechtig).filter((z) => !E_GELESEN.has(z))).toEqual([]);
    expect([...E_GELESEN].filter((z) => !EIGENE.has(z) || !eVerdaechtig(z))).toEqual([]);
  });

  it("Gegenprobe: „La citta è piu bella perche piove?\" dreimal, „Il tè e caldo!\" und „Anna e di Palermo?\" verdächtig", () => {
    expect(ohneAkzentFehler("La citta è piu bella perche piove?")).toEqual(["citta", "piu", "perche"]);
    expect(ohneAkzentFehler("La città è più bella!")).toEqual([]);
    expect(eVerdaechtig("Il tè e caldo!")).toBe(true);
    expect(eVerdaechtig("Anna e di Palermo?")).toBe(true);
    expect(eVerdaechtig("Marta e Nicola vanno al parco.")).toBe(false);
  });
});

// ── 6 · Keine Kopien, keine Paare, nichts fast gleich ───────────────────────

/** Geschlecht und Zahl gleichgesetzt, Satzzeichen weg: „Il nonno ride?" und „La nonna ride!" sind ein Paar (IT-T7). */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", gli: "ART", le: "ART", l: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  return zeile
    .toLowerCase()
    .split(/[\s,.;:!?"()']+/)
    .filter(Boolean)
    .map((w) => art[w] ?? pron[w] ?? w.replace(/[oaei]$/, "_"))
    .join(" ");
}
export function paare(zeilen: string[], gegen: string[] = []): string[] {
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
const textForm = (t: string): string => t.toLowerCase().replace(/[,.;:!?"()\-[\]{}]/g, " ").replace(/\s+/g, " ").trim();
const menge = (t: string) => new Set([...(t.toLowerCase().match(/\p{L}+/gu) ?? []), ...(t.match(/\d+/g) ?? [])]);
function fastGleich(a: Set<string>, b: Set<string>): boolean {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s) >= 0.6;
}

/** Alle Zeilen anderer Herkunft: jeder Korpus (de/en/fr/es/it) und jede Serie, die nicht zu dieser Charge gehört. */
const FREMD: string[] = [
  ...[...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT].map((i) => i.text),
  ...SERIEN.filter((s) => !SERIEN_K.some((k) => k.slug === s.slug)).flatMap((s) => serieLines(s)),
];
const ANDERE_IT: string[] = [
  ...CORPUS_IT.map((i) => i.text),
  ...SERIEN.filter((s) => s.lang === "it" && !SERIEN_K.some((k) => k.slug === s.slug)).flatMap((s) => serieLines(s)),
];

describe("6 · keine Kopien, keine Paare, nichts fast gleich", () => {
  it("keine Zeile doppelt - auch nicht ohne Satzzeichen oder nach dem Ledger-Schlüssel", () => {
    expect(new Set(ZEILEN.map(textForm)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer Zeile eines Korpus oder einer anderen Serie (Text, ohne Satzzeichen, Ledger-Schlüssel)", () => {
    expect(FREMD.length).toBeGreaterThan(1000);
    const texte = new Set(FREMD.map(textForm));
    const schluessel = new Set(FREMD.map((t) => bausteinKey("satz", t)));
    expect(ZEILEN.filter((z) => texte.has(textForm(z)) || schluessel.has(bausteinKey("satz", z)))).toEqual([]);
  });

  it("keine Paare (nur Geschlecht oder Zahl getauscht) - untereinander und gegen jede andere it-Zeile", () => {
    const fehler = paare(ZEILEN, ANDERE_IT);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich - untereinander und gegen jede andere it-Zeile", () => {
    const eigene = ZEILEN.map((t) => [t, menge(t)] as const);
    const andere = ANDERE_IT.map((t) => [t, menge(t)] as const);
    const fehler: string[] = [];
    for (let i = 0; i < eigene.length; i++) {
      for (const [t, m] of andere) if (fastGleich(eigene[i][1], m)) fehler.push(`"${eigene[i][0]}" ~ "${t}"`);
      for (let j = i + 1; j < eigene.length; j++) if (fastGleich(eigene[i][1], eigene[j][1])) fehler.push(`"${eigene[i][0]}" ~ "${eigene[j][0]}"`);
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie mit anderen Satzzeichen, Paar und fast gleich werden erkannt", () => {
    const z = ZEILEN[0];
    expect(textForm(`${z.replace(/[.!?]$/, "")}?`)).toBe(textForm(z));
    expect(paare(["Il nonno ride?", "La nonna ride!"])).toHaveLength(1);
    expect(paare(["La pala.", "La palla."])).toEqual([]);
    expect(fastGleich(menge("Il gatto rosso dorme sulla colonna."), menge("Il gatto rosso dorme sulla colonna alta."))).toBe(true);
    expect(fastGleich(menge("Un anno ha dodici mesi."), menge("Un giorno ha ventiquattro ore."))).toBe(false);
    expect(bausteinKey("satz", "Perché piove?")).toBe(bausteinKey("satz", "perch piove")); // darum prüft der Test die Schlüssel
  });
});

// ── 7 · Regionen ────────────────────────────────────────────────────────────

type Raum = "N" | "M" | "S" | "I" | "CH" | "BZ" | "RSM";
/** Die Räume wie IT-T7 (Süden mit Abruzzo und Molise, ISTAT; Südtirol und Tessin eigens). */
const RAUM: Record<string, Raum> = {
  Veneto: "N", Liguria: "N", "Emilia-Romagna": "N", "Friuli-Venezia Giulia": "N", Lombardia: "N", Piemonte: "N",
  "Valle d'Aosta": "N", Trentino: "N",
  Toscana: "M", Lazio: "M", Marche: "M", Umbria: "M",
  Campania: "S", Puglia: "S", Calabria: "S", Basilicata: "S", Abruzzo: "S", Molise: "S",
  Sicilia: "I", Sardegna: "I",
  Ticino: "CH", Grigioni: "CH",
  "Alto Adige": "BZ",
  "San Marino": "RSM",
};
function raeume(serien: readonly { land: string }[]): Record<Raum | "unbekannt", number> {
  const r: Record<Raum | "unbekannt", number> = { N: 0, M: 0, S: 0, I: 0, CH: 0, BZ: 0, RSM: 0, unbekannt: 0 };
  for (const s of serien) r[RAUM[s.land] ?? "unbekannt"]++;
  return r;
}
const PFLICHT = ["Sicilia", "Sardegna", "Calabria", "Puglia", "Campania", "Basilicata", "Ticino", "Grigioni", "Alto Adige", "San Marino"];

describe("7 · Italien in seiner Breite", () => {
  it("jede Region ist bekannt; Süden + Inseln mindestens 8 und mehr als der Norden; Mitte, Tessin/Graubünden, Südtirol, San Marino vertreten", () => {
    const r = raeume(SERIEN_K);
    expect(r.unbekannt).toBe(0);
    expect(r.S + r.I).toBeGreaterThanOrEqual(8);
    expect(r.S + r.I).toBeGreaterThan(r.N);
    expect(r.M).toBeGreaterThanOrEqual(2);
    expect(r.CH).toBeGreaterThanOrEqual(2);
    expect(r.BZ).toBeGreaterThanOrEqual(1);
    expect(r.RSM).toBeGreaterThanOrEqual(1);
  });

  it("jede geforderte Region kommt vor, keine mehr als zweimal", () => {
    const n = new Map<string, number>();
    for (const s of SERIEN_K) n.set(s.land, (n.get(s.land) ?? 0) + 1);
    expect(PFLICHT.filter((p) => !n.has(p))).toEqual([]);
    expect([...n].filter(([, k]) => k > 2)).toEqual([]);
  });

  it("Gegenprobe: zehn Serien im Norden und eine unbekannte Region schlagen an", () => {
    const r = raeume([...Array.from({ length: 10 }, () => ({ land: "Veneto" })), { land: "Atlantide" }]);
    expect(r.S + r.I > r.N).toBe(false);
    expect(r.unbekannt).toBe(1);
  });
});
