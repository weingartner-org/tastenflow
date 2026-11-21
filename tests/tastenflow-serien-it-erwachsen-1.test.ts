/**
 * ★★★ Wächter IT-S (03.10.2026): die ersten ITALIENISCHEN Serien für Erwachsene (`serienItErwachsen1.ts`).
 *
 * Vorbilder: `tastenflow-serien-es-erwachsen-1.test.ts` (Form einer Serien-Charge), `tastenflow-serien-es-eingehaengt.test.ts`
 * (gegen den echten Weg: `validateSerie`, Griff auf jeder Pflicht-Tastatur, Öffnungs-Sprosse ausgerechnet) und
 * `tastenflow-texte-it-erwachsene-ende.test.ts` (IT-T9: Regeln des Weges „it", Zahlformat, Wortschatz, Kopien und Paare).
 *
 * Geprüft wird:
 *  1. die FORM jeder Zeile (Regeln aller it-Zeilen, ein Satz, 5-18 Wörter, höchstens 90 Zeichen, Zahl- und Adressformat,
 *     € nur in Italien und San Marino, keine grossen Akzentbuchstaben - unter Windows nie tippbar, I4),
 *  2. die FORM jeder Serie (20 Serien, je 2 Etappen und genau eine mit 3, 14-16 Zeilen je Etappe, Fortsetzung endet auf
 *     ? oder !, Slug, Titel, Stufe, Weg, Herkunft, `minTier` = `computeSerieMinTier(s, "it")`, `validateSerie`),
 *  3. Namen (jedes Grosswort mitten im Satz ist ein Eigenname der Serie, jeder Eigenname kommt vor),
 *  4. die Verteilung über den italienischen Sprachraum (Süden und Inseln je mindestens so stark wie der Norden, Tessin,
 *     Graubünden, Südtirol, San Marino),
 *  5. den Wortschatz (Wortbudget 8, Sperrliste Kern UND Wortbasis, jedes Wort im Vorlese-Lexikon, kein Akzentwort ohne
 *     Akzent),
 *  6. jedes Zeichen auf `it` UND `it-qzerty` greifbar,
 *  7. das SERVIEREN gegen den echten Weg (Öffnungs-Sprosse je Tastatur, dort keine Zeile verworfen oder halbiert, mit
 *     allen Tasten Zeichen für Zeichen; Erwachsene vor ⇧ bekommen keine; Kinder, Jugend, andere Wege nie),
 *  8. keine Kopie und kein Paar (untereinander, gegen jeden Korpus und alle anderen Serien, Text UND Ledger-Schlüssel),
 *  9. das Einhängen (`SERIEN_IT`, `SERIEN`) und den unberührten Korpus-Anker.
 * Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { SERIEN_IT_ERWACHSEN_1 } from "../src/lib/typing/serienItErwachsen1";
import { SERIEN_IT_KIDS_1 } from "../src/lib/typing/serienItKids1";
import { SERIEN_IT_TEENS_1 } from "../src/lib/typing/serienItTeens1";
import type { SerieEntwurfIt } from "../src/lib/typing/serienItTyp";
import { SERIEN_IT } from "../src/lib/typing/serienIt";
import { SERIEN, allowedFromIntroduced, unlockedSerien, serieTypeable } from "../src/lib/typing/serien";
import { computeSerieMinTier, validateSerie, type Serie } from "../src/lib/typing/serie";
import { setLayout, toLayoutText, layoutById, type KeyboardLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { kombizeichenZu } from "../src/lib/typing/totasten";
import { gesperrtIt, istKernGesperrtIt } from "../src/lib/typing/sperrlisteIt";
import { WORDS_IT, STUFE_VOCAB_IT } from "../src/lib/typing/wordsIt";
import { NACHTRAG_IT } from "../src/lib/typing/lexikonNachtragIt";
import { isRealWord, normalizeWord } from "../src/lib/typing/lexicon";
import { bausteinKey } from "../src/lib/typing/ledger";
import { corpusManifest } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { zeilenFehler } from "./helfer/itTextRegeln";

afterEach(() => setLayout("de"));

const SERIEN_E = SERIEN_IT_ERWACHSEN_1;
const zeilenVon = (s: { etappen: { lines: string[] }[] }): string[] => s.etappen.flatMap((e) => e.lines);
const ZEILEN = SERIEN_E.flatMap(zeilenVon);
const norm = (t: string) => t.replace(/\s+/g, " ").trim();
const kopie = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

// ── 1 · Form jeder Zeile ────────────────────────────────────────────────────

/** Verbotene Zeichen: Gedankenstriche, Auslassungszeichen, typografische Anführungen, º ª °, Tab, geschützte Leerzeichen. */
const VERBOTEN = /[–—…’‘`«»“”„ºª°\t  ]/;
/** Eine innere Satzgrenze: Satzzeichen, Leerzeichen, dann (nach " oder () ein Grossbuchstabe. */
const INNERE_GRENZE = /[.!?]"?\s+["(]*\p{Lu}/u;
const woerter = (z: string) => z.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

function formFehler(t: string): string[] {
  const f: string[] = [];
  if (VERBOTEN.test(t)) f.push("verbotenes Zeichen");
  if (/[ÀÈÉÌÒÙ]/.test(t)) f.push("grosser Akzentbuchstabe (unter Windows nie tippbar, I4)");
  if (/[[\]{}]/.test(t)) f.push("eckige oder geschweifte Klammer (fehlt auf einer der zwei Tastaturen)");
  if (t !== t.trim() || t.includes("  ")) f.push("Leerzeichen am Rand oder doppelt");
  if (/ [.,;:?!)]/.test(t)) f.push("Leerzeichen vor Satzzeichen");
  if (/,[^ ]/.test(t)) f.push("kein Leerzeichen nach Komma");
  const erster = t.match(/[\p{L}\d]/u)?.[0] ?? "";
  if (!/\d/.test(erster) && erster === erster.toLowerCase()) f.push("beginnt nicht gross");
  if (!/[.!?]"?$/.test(t)) f.push("kein Satzschluss am Ende");
  if (INNERE_GRENZE.test(t)) f.push("mehr als ein Satz");
  if ((t.match(/"/g) ?? []).length % 2) f.push("Anführungszeichen ungerade");
  if (t.split("(").length !== t.split(")").length) f.push("() ungleich");
  if (t.length > 90) f.push("länger als 90 Zeichen");
  // Ein Bindestrich IM Wort fiele auf Weg „it" vor seiner Sprosse weg und zerrisse das Wort (socio-sanitaria ⇒ socio sanitaria).
  if (/\p{L}-\p{L}/u.test(t)) f.push("Bindestrich im Wort");
  const n = woerter(t).length;
  if (n < 5 || n > 18) f.push(`${n} Wörter`);
  return f;
}

/**
 * Zahlformat (Bauplan I19, wie IT-T9): Serienzeilen werden auf Weg „it" nicht umgeschrieben - keine Tausender- und
 * Dezimaltrennzeichen, keine Zahl über vier Stellen, Prozent ohne Leerzeichen (`30%`), Euro nach der Zahl mit
 * Leerzeichen (`25 €`), Uhrzeiten als gültiges h:mm.
 */
function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d[.,]\d/.test(t)) f.push("Tausender- oder Dezimaltrenner");
  if (/\d{5,}/.test(t)) f.push("Zahl mit mehr als vier Stellen");
  if (/\d %/.test(t)) f.push("Leerzeichen vor %");
  if (/\d€|€\s?\d/.test(t)) f.push("€ nicht als „25 €“");
  for (const m of t.matchAll(/(\d{1,2}):(\d{2})/g)) {
    if (Number(m[1]) > 23 || Number(m[2]) > 59) f.push(`keine Uhrzeit: ${m[0]}`);
  }
  return f;
}

/** Mail-Adressen nur mit der Domäne `esempio` (erfunden, neutral), keine Webadresse. */
function adressFehler(t: string): string[] {
  const f: string[] = [];
  for (const m of t.matchAll(/\S+@\S+/g)) {
    if (!/@([a-z]+\.)*esempio\.[a-z]+$/.test(m[0].replace(/[.,;:!?]+$/, ""))) f.push(`Adresse ${m[0]}`);
  }
  if (/www\.|https?:/.test(t)) f.push("Webadresse");
  return f;
}

describe("IT-S Erwachsene: Form jeder Zeile", () => {
  it("jede Zeile besteht die Regeln aller italienischen Zeilen (`helfer/itTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Form: gross am Anfang, ein Satz, Satzschluss, Leerzeichen, paarige Zeichen, 5-18 Wörter, höchstens 90 Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlformat und Adressen", () => {
    const fehler = ZEILEN.flatMap((t) => [...zahlFehler(t), ...adressFehler(t)].map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("€ nur in Serien, die in Italien oder San Marino spielen - im Tessin und in Graubünden zahlt man in Franken", () => {
    const fehler = SERIEN_E.filter((s) => zeilenVon(s).some((l) => l.includes("€")) && !EURO_RAEUME.has(RAUM[s.land]));
    expect(fehler.map((s) => s.slug)).toEqual([]);
  });

  it("Gegenprobe: jede Form-, Zahl- und Adressregel schlägt an", () => {
    expect(formFehler("Arrivo – subito, dice Lucia.")).toContain("verbotenes Zeichen");
    expect(formFehler("Lucia dice «ciao» a tutti.")).toContain("verbotenes Zeichen");
    expect(formFehler("È tardi per il vaporetto delle sei.")).toContain("grosser Akzentbuchstabe (unter Windows nie tippbar, I4)");
    expect(formFehler("Il file si chiama dati[1] sul disco.")).toContain("eckige oder geschweifte Klammer (fehlt auf einer der zwei Tastaturen)");
    expect(formFehler("Arrivi domani a Bari ?")).toContain("Leerzeichen vor Satzzeichen");
    expect(formFehler("Sì,certo, arrivo domani a Bari.")).toContain("kein Leerzeichen nach Komma");
    expect(formFehler("il bus arriva alle sei in punto.")).toContain("beginnt nicht gross");
    expect(formFehler("Il bus arriva alle sei in punto")).toContain("kein Satzschluss am Ende");
    expect(formFehler("Il bus arriva. Poi parte di nuovo.")).toContain("mehr als ein Satz");
    expect(formFehler("Hai finito? Andiamo a casa adesso.")).toContain("mehr als ein Satz");
    expect(formFehler('Lucia dice "arrivo subito a casa.')).toContain("Anführungszeichen ungerade");
    expect(formFehler("Mia sorella (la grande arriva domani.")).toContain("() ungleich");
    expect(formFehler("La operatrice socio-sanitaria arriva alle otto.")).toContain("Bindestrich im Wort");
    expect(formFehler("Il bus arriva.")).toContain("3 Wörter");
    expect(formFehler(`${"Il bus arriva sempre ".repeat(5)}tardi.`)).toContain("21 Wörter");
    expect(formFehler(`Il bus ${"a".repeat(90)} arriva.`)).toContain("länger als 90 Zeichen");
    expect(formFehler('"Ci vediamo in piazza", mi scrive Salvatore.')).toEqual([]);
    expect(formFehler('"Dove vai?" chiede Leo dalla porta.')).toEqual([]);
    expect(zahlFehler("Costa 1.200 € al mese.")).toContain("Tausender- oder Dezimaltrenner");
    expect(zahlFehler("Il tasso è del 3,5%.")).toContain("Tausender- oder Dezimaltrenner");
    expect(zahlFehler("Abitano 12000 persone.")).toContain("Zahl mit mehr als vier Stellen");
    expect(zahlFehler("L'IVA è del 22 %.")).toContain("Leerzeichen vor %");
    expect(zahlFehler("Costa 14€.")).toContain("€ nicht als „25 €“");
    expect(zahlFehler("Costa € 14.")).toContain("€ nicht als „25 €“");
    expect(zahlFehler("Arrivo alle 25:10.")).toContain("keine Uhrzeit: 25:10");
    expect(zahlFehler("Alle 8:30 pago 15 € con lo sconto del 30%.")).toEqual([]);
    expect(adressFehler("Scrivete a anna@ditta.it.")).toHaveLength(1);
    expect(adressFehler("Vedi www.comune.it per i dettagli.")).toHaveLength(1);
    expect(adressFehler("Scrivete a anna@comune.esempio.it.")).toEqual([]);
  });
});

// ── 2 · Form jeder Serie ────────────────────────────────────────────────────

const EIGEN = { quelle: "Sensorik", lizenz: "Eigenes Werk" };

function serienFehler(serien: SerieEntwurfIt[]): string[] {
  const p: string[] = [];
  const slugs = new Set<string>();
  const titel = new Set<string>();
  const fremdeSlugs = new Set([...SERIEN_IT_KIDS_1, ...SERIEN_IT_TEENS_1].map((s) => s.slug));
  const fremdeTitel = new Set([...SERIEN_IT_KIDS_1, ...SERIEN_IT_TEENS_1].map((s) => s.titel.toLowerCase()));
  for (const s of serien) {
    if (!s.slug.startsWith("it-erwachsen-1-")) p.push(`${s.slug}: Slug-Vorsilbe`);
    if (!/^[a-z0-9-]+$/.test(s.slug)) p.push(`${s.slug}: Slug mit Sonderzeichen`);
    if (slugs.has(s.slug)) p.push(`${s.slug}: Slug doppelt`);
    if (titel.has(s.titel.toLowerCase())) p.push(`${s.slug}: Titel doppelt`);
    if (fremdeSlugs.has(s.slug) || fremdeTitel.has(s.titel.toLowerCase())) p.push(`${s.slug}: Slug oder Titel einer Kinder-/Jugend-Serie`);
    slugs.add(s.slug);
    titel.add(s.titel.toLowerCase());
    if (s.kind !== "geschichte") p.push(`${s.slug}: kind`);
    if (s.lang !== "it" || s.nurWeg !== "it") p.push(`${s.slug}: lang/nurWeg nicht it`);
    if (s.stufen.length !== 1 || s.stufen[0] !== "erwachsen") p.push(`${s.slug}: Stufe nicht erwachsen`);
    if (JSON.stringify(s.herkunft) !== JSON.stringify(EIGEN)) p.push(`${s.slug}: herkunft nicht eigenes Werk`);
    if (!(s.land in RAUM)) p.push(`${s.slug}: unbekannter Raum ${s.land}`);
    if (!s.topic || !s.ort) p.push(`${s.slug}: topic/ort leer`);
    if (woerter(s.titel).length > 6 || formFehler(`${s.titel} arriva oggi a casa.`).includes("verbotenes Zeichen")) p.push(`${s.slug}: Titel`);
    if (/[ÀÈÉÌÒÙ]/.test(s.titel)) p.push(`${s.slug}: Titel mit grossem Akzentbuchstaben`);
    if (s.etappen.length < 2 || s.etappen.length > 3) p.push(`${s.slug}: ${s.etappen.length} Etappen`);
    s.etappen.forEach((e, i) => {
      if (e.lines.length < 14 || e.lines.length > 16) p.push(`${s.slug} E${i + 1}: ${e.lines.length} Zeilen`);
      const letzte = e.lines[e.lines.length - 1] ?? "";
      if (i < s.etappen.length - 1 && !/[?!]"?$/.test(letzte)) p.push(`${s.slug} E${i + 1}: endet ohne Frage/Spannung`);
    });
    if (s.minTier === undefined) p.push(`${s.slug}: minTier fehlt`);
    else if (computeSerieMinTier(s as unknown as Serie, "it") !== s.minTier) {
      p.push(`${s.slug}: minTier ${s.minTier}, gerechnet ${computeSerieMinTier(s as unknown as Serie, "it")}`);
    }
  }
  return p;
}

describe("IT-S Erwachsene: Form jeder Serie", () => {
  it("die Serien haben keine Form-Probleme", () => {
    const p = serienFehler(SERIEN_E);
    expect(p, p.join("\n")).toEqual([]);
  });

  it("20 Serien, je 2 Etappen und genau eine mit 3", () => {
    expect(SERIEN_E.length).toBe(20);
    expect(SERIEN_E.filter((s) => s.etappen.length === 3).length).toBe(1);
    expect(SERIEN_E.filter((s) => s.etappen.length === 2).length).toBe(19);
  });

  it("jede Serie besteht `validateSerie(s, \"it\")` - minTier deklariert = berechnet", () => {
    for (const s of SERIEN_E) {
      const { ok, problems } = validateSerie(s as unknown as Serie, "it");
      expect(ok, `${s.slug}: ${problems.join("; ")}`).toBe(true);
    }
  });

  it("mindestens 10 Serien üben Ziffern, mindestens 5 kommen ohne (sie öffnen früher); % € @ : / kommen vor", () => {
    const mit = SERIEN_E.filter((s) => zeilenVon(s).some((l) => /\d/.test(l))).length;
    expect(mit).toBeGreaterThanOrEqual(10);
    expect(SERIEN_E.length - mit).toBeGreaterThanOrEqual(5);
    const text = ZEILEN.join(" ");
    for (const z of ["%", "€", "@", ":", "/", "?", "!", '"']) expect(text, z).toContain(z);
  });

  it("Gegenprobe: falsche Etappenzahl, Zeilenzahl, Schluss ohne Spannung, minTier, Slug, Stufe, Herkunft, Raum", () => {
    const b = (): SerieEntwurfIt => kopie(SERIEN_E[1]);
    const s1 = b();
    s1.etappen = s1.etappen.slice(0, 1);
    expect(serienFehler([s1]).some((x) => x.includes("1 Etappen"))).toBe(true);
    const s2 = b();
    s2.etappen[0].lines = s2.etappen[0].lines.slice(0, 13);
    expect(serienFehler([s2]).some((x) => x.includes("13 Zeilen"))).toBe(true);
    const s3 = b();
    s3.etappen[0].lines[s3.etappen[0].lines.length - 1] = "Lucia torna a casa molto tranquilla.";
    expect(serienFehler([s3]).some((x) => x.includes("E1: endet ohne Frage"))).toBe(true);
    const s4 = b();
    s4.minTier = 2;
    expect(serienFehler([s4]).some((x) => x.includes("minTier 2"))).toBe(true);
    const s5 = b();
    delete s5.minTier;
    expect(serienFehler([s5]).some((x) => x.includes("minTier fehlt"))).toBe(true);
    expect(serienFehler([b(), b()]).some((x) => x.includes("Slug doppelt"))).toBe(true);
    expect(serienFehler([{ ...b(), slug: "erwachsen-falsch" }]).some((x) => x.includes("Slug-Vorsilbe"))).toBe(true);
    expect(serienFehler([{ ...b(), stufen: ["teens"] }]).some((x) => x.includes("Stufe"))).toBe(true);
    expect(serienFehler([{ ...b(), herkunft: { quelle: "Tatoeba", lizenz: "CC BY" } }]).some((x) => x.includes("herkunft"))).toBe(true);
    expect(serienFehler([{ ...b(), land: "Atlantide" }]).some((x) => x.includes("unbekannter Raum"))).toBe(true);
    const s6 = b();
    s6.minTier = (((s6.minTier as number) + 1) % 6) as SerieEntwurfIt["minTier"];
    expect(validateSerie(s6 as unknown as Serie, "it").ok).toBe(false);
  });
});

// ── 3 · Namen ───────────────────────────────────────────────────────────────

/** Darf hier ein Satz (oder ein Zitat) mit Grossbuchstaben beginnen? */
function satzanfang(zeile: string, stelle: number): boolean {
  const davor = zeile.slice(0, stelle);
  return /(^|[.!?:]\s+)["(]*$/.test(davor) || /(^|\s)"$/.test(davor);
}
/** Wörter einer Zeile mit Stelle; `kern` ist der Teil nach einer Elision (dell'Etna ⇒ Etna). */
function woerterMitStelle(zeile: string): { w: string; kern: string; i: number }[] {
  const out: { w: string; kern: string; i: number }[] = [];
  for (const m of zeile.matchAll(/[\p{L}']+/gu)) {
    const w = m[0].replace(/^'+|'+$/g, "");
    if (!w) continue;
    const ab = w.lastIndexOf("'") + 1;
    out.push({ w, kern: w.slice(ab), i: m.index! + m[0].indexOf(w) + ab });
  }
  return out;
}
/** Grossgeschriebene Wörter, die weder am Satzanfang stehen noch zu einem Eigennamen der Serie gehören. */
function unbekannteGrosswoerter(zeile: string, eigennamen: readonly string[]): string[] {
  const teile = new Set(eigennamen.flatMap((n) => n.split(/\s+/)));
  return woerterMitStelle(zeile)
    .filter(({ kern, i }) => kern[0] !== kern[0].toLowerCase() && !teile.has(kern) && !satzanfang(zeile, i))
    .map(({ kern }) => kern);
}
const kommtVor = (n: string, text: string) => new RegExp(`(^|[^\\p{L}])${n}([^\\p{L}]|$)`, "u").test(text);

describe("IT-S Erwachsene: Namen", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein Eigenname seiner Serie", () => {
    const fehler = SERIEN_E.flatMap((s) =>
      zeilenVon(s).flatMap((z) => unbekannteGrosswoerter(z, s.eigennamen).map((w) => `${s.slug}: "${z}": ${w}`)),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eigenname kommt in seiner Serie vor (sonst wächst die Liste still)", () => {
    const fehler = SERIEN_E.flatMap((s) => s.eigennamen.filter((n) => !kommtVor(n, zeilenVon(s).join("\n"))).map((n) => `${s.slug}: ${n}`));
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: ein unbekannter Name wird gefunden, Satzanfang, Zitat und Elision nicht", () => {
    expect(unbekannteGrosswoerter("Arriva Pietro con il treno.", [])).toEqual(["Pietro"]);
    expect(unbekannteGrosswoerter("Arriva Pietro con il treno.", ["Pietro"])).toEqual([]);
    expect(unbekannteGrosswoerter('Scrive "Duomo" sul quaderno.', [])).toEqual([]);
    expect(unbekannteGrosswoerter("La vista sull'Etna è bella.", ["Etna"])).toEqual([]);
    expect(unbekannteGrosswoerter("La vista sull'Etna è bella.", [])).toEqual(["Etna"]);
    expect(SERIEN_E[0].eigennamen.filter((n) => !kommtVor(n, "Atlantide"))).toEqual(SERIEN_E[0].eigennamen);
  });
});

// ── 4 · Italien in seiner Breite ────────────────────────────────────────────

/** Raum je Serie (`land`): N Norden · M Mitte · S Süden (Abruzzen bis Kalabrien, wie ISTAT) · I Inseln · CH-TI · CH-GR · BZ · RSM. */
const RAUM: Record<string, string> = {
  Lombardei: "N", Venetien: "N", "Emilia-Romagna": "N", "Friaul-Julisch Venetien": "N", Piemont: "N", Ligurien: "N",
  Toskana: "M", Umbrien: "M", Latium: "M", Marken: "M",
  Kampanien: "S", Apulien: "S", Basilikata: "S", Kalabrien: "S", Abruzzen: "S", Molise: "S",
  Sizilien: "I", Sardinien: "I",
  Tessin: "CH-TI", "Graubünden": "CH-GR", "Südtirol": "BZ", "San Marino": "RSM",
};
const EURO_RAEUME = new Set(["N", "M", "S", "I", "BZ", "RSM"]);

function verteilungFehler(serien: SerieEntwurfIt[]): string[] {
  const je = new Map<string, number>();
  for (const s of serien) je.set(RAUM[s.land], (je.get(RAUM[s.land]) ?? 0) + 1);
  const n = (r: string) => je.get(r) ?? 0;
  const p: string[] = [];
  if (n("S") < n("N")) p.push(`Süden ${n("S")} < Norden ${n("N")}`);
  if (n("I") < n("N")) p.push(`Inseln ${n("I")} < Norden ${n("N")}`);
  for (const r of ["M", "CH-TI", "CH-GR", "BZ", "RSM"]) if (n(r) < 1) p.push(`${r} fehlt`);
  if (n("N") * 4 > serien.length) p.push(`Norden mehr als ein Viertel (${n("N")})`);
  const regionen = new Map<string, number>();
  for (const s of serien) regionen.set(s.land, (regionen.get(s.land) ?? 0) + 1);
  for (const [r, k] of regionen) if (k > 2) p.push(`${r}: ${k} Serien`);
  return p;
}

describe("IT-S Erwachsene: der ganze italienische Sprachraum - der Norden nicht vorne", () => {
  it("Süden und Inseln je mindestens so stark wie der Norden; Mitte, Tessin, Graubünden, Südtirol, San Marino dabei; keine Region mehr als zweimal", () => {
    expect(verteilungFehler(SERIEN_E)).toEqual([]);
  });

  it("Gegenprobe: ein Nord-Übergewicht, eine fehlende Schweiz und eine Region dreimal werden gemeldet", () => {
    const b = SERIEN_E[0];
    const nord = Array.from({ length: 6 }, () => ({ ...b, land: "Lombardei" }));
    const p = verteilungFehler([...nord, { ...b, land: "Sizilien" }]);
    expect(p.some((x) => x.startsWith("Süden"))).toBe(true);
    expect(p.some((x) => x.startsWith("Inseln"))).toBe(true);
    expect(p).toContain("CH-GR fehlt");
    expect(p.some((x) => x.startsWith("Lombardei"))).toBe(true);
  });
});

// ── 5 · Wortschatz ──────────────────────────────────────────────────────────

/** Funktionswörter zählen nicht - die Liste des IT-T9-Wächters (dort begründet). */
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
/** Technik-Stücke (Adresse, Zahl mit Zeichen) - dort zählt kein Wort. */
const TECHNIK = /[@/_#=<>{}[\]*$|&+\d]/;
const EIGEN_TEILE = new Set(SERIEN_E.flatMap((s) => s.eigennamen.flatMap((n) => n.toLowerCase().split(/\s+/))));

/** Inhaltswörter einer Zeile (je Zeile einmal) - Funktionswörter, Eigennamen und Technik-Stücke zählen nicht. */
function inhaltsWoerter(t: string, namen: ReadonlySet<string> = EIGEN_TEILE): Set<string> {
  const ohneTechnik = t.split(/\s+/).filter((x) => !TECHNIK.test(x)).join(" ").toLowerCase();
  return new Set((ohneTechnik.match(/\p{L}+/gu) ?? []).filter((w) => !FUNKTIONSWOERTER.has(w) && !namen.has(w)));
}
function zuHaeufig(zeilen: string[], grenze = 8, namen?: ReadonlySet<string>): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltsWoerter(z, namen)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Wörter des Übungswortschatzes und des Vorlese-Lexikons (für die Akzent-Prüfung). */
const BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat(), ...NACHTRAG_IT].map((w) => normalizeWord(w, "it")),
);
/** Wörter, die es NUR mit Akzent gibt (Bauplan I6): ihre Form ohne Akzent ist kein Wort (`perche`, `citta`, `piu`). */
const NUR_MIT_AKZENT: ReadonlySet<string> = new Set(
  [...BEKANNT]
    .filter((w) => /[àèéìòù]$/.test(w))
    .map((w) => w.normalize("NFD").replace(/[̀-ͯ]/g, ""))
    .filter((ohne) => !BEKANNT.has(ohne)),
);
const ohneAkzentFehler = (zeile: string, namen: ReadonlySet<string> = EIGEN_TEILE): string[] =>
  (zeile.match(/\p{L}+/gu) ?? []).map((w) => w.toLowerCase()).filter((w) => !namen.has(w) && NUR_MIT_AKZENT.has(w));

/**
 * ⚠️ Das Vorlese-Lexikon (`isRealWord`) nimmt JEDES Wort jeder Serie auf (`lexicon.ts`, `buildLexicon`: „… und ebenso aus
 * den SERIEN") - die Stimme buchstabiert darum kein Wort dieser Charge, aber `isRealWord` beweist hier auch nichts
 * (gemessen: ein eingesetztes „Harpreet“ galt sofort als Wort). Geprüft wird deshalb wie in IT-T9 gegen den GEPRÜFTEN
 * Wortschatz: `WORDS_IT`, `STUFE_VOCAB_IT`, `NACHTRAG_IT` (alle gegen das macOS-Wörterbuch erzeugt) und die Wörter, die
 * das macOS-Wörterbuch für Italienisch hier bestätigt hat (`osascript -l JavaScript scripts/woerterbuch-macos.js`,
 * Vorsilbe `it:`, gemessen 03.10.2026: 244 bestätigt). Eigennamen prüft die Namensliste der Serie.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set([
  "abitati", "accorgerebbe", "addormenta", "afferra", "agraria", "agrume", "agrumeto", "algherese", "allacciato",
  "allagate", "allega", "allevato", "altopiano", "annota", "annuisce", "annusa", "appende", "applaude", "arde",
  "arrende", "attecchito", "auricolari", "bagnate", "banchina", "bassissima", "batterio", "bergamotti", "bergamotto",
  "bilingue", "bilinguismo", "bivio", "boati", "bollire", "bora", "bracci", "brevissima", "bussa", "buttarla",
  "cachemire", "cagliata", "caldaie", "calli", "cantone", "capannoni", "cartellino", "cassette", "caviglie",
  "cercherà", "cerimoniale", "collegata", "comasco", "comitiva", "compila", "compone", "compratore", "condomini",
  "confessa", "confida", "consonante", "contattarle", "cooperativa", "coperchio", "crepa", "creta", "cumulo",
  "curve", "cuscus", "dattilografia", "decennio", "didascalie", "direttrice", "distribuisce", "domandano",
  "dopoguerra", "emigrata", "escursionisti", "estraggono", "facchini", "fave", "filiera", "fischietto", "fissano",
  "foglietti", "foglioline", "frange", "friulano", "frontalieri", "frusta", "frutteti", "giubbotti", "giungono",
  "glicemia", "golfo", "grafia", "granuli", "gravina", "grembiule", "immateriale", "impagina", "impastando",
  "impilati", "inceppa", "infreddolite", "ingegnera", "innestare", "innestati", "innestato", "innesti", "innesto",
  "insediamento", "insegnargli", "intonano", "iscrive", "istruttrice", "latteria", "legano", "lunghissimo",
  "maestrale", "martelletto", "medicazioni", "medusa", "metronomo", "miscuglio", "mormora", "muretto", "muti",
  "muto", "nono", "pallido", "panificio", "pannelli", "paragrafo", "pastori", "patentino", "persiane", "pesava",
  "pizzica", "potature", "precipita", "presepi", "profumeria", "pulsanti", "quarantotto", "raffiche", "raffredda",
  "raffreddamento", "rallentamenti", "rapprenda", "rassicura", "reception", "regata", "registra", "riaccende",
  "riaccendere", "ricava", "riciclata", "riciclato", "ricompare", "ricontrolla", "rilegge", "rilievi", "rincorrono",
  "ripensa", "ripido", "riscrive", "rispettivi", "ritaglia", "ritirarlo", "romancio", "rumoroso", "rupestre",
  "salamoia", "salutarsi", "sardo", "sbarcato", "sbattono", "sbuffo", "scalone", "scambiano", "scaramanzia",
  "scavate", "scialle", "scivolose", "scoppiano", "scorciatoia", "scottature", "scuote", "sdraiare", "seccare",
  "separava", "serale", "serranda", "siede", "smonta", "soffio", "soprannome", "soprannomi", "sorsi", "sospiro",
  "spazza", "spazzaneve", "spuntate", "stagionato", "stagionerà", "stampatello", "statuina", "stonando",
  "stringergli", "strofa", "strofe", "stuzzicadenti", "sussurra", "svegliano", "svenuto", "svuotate", "temeva",
  "terracotta", "ticinese", "ticinesi", "tiepido", "timone", "tipografia", "tiratura", "tombini", "torce",
  "transenne", "trascritte", "trascrive", "trascriverle", "trasferirsi", "trasferita", "trattore", "trattori",
  "trentaquattro", "tutelata", "uliveto", "ulivi", "vaporetti", "veneziano", "ventidue", "ventisei", "vestitini",
  "videochiamata", "zuccheriere"
]);
/**
 * ⚠️ Drei Wörter, die das macOS-Wörterbuch ablehnt und die trotzdem stehen, weil die Zeile von ihnen handelt (Befund §6):
 * `casara` (die Käserin im Parmigiano - das Wörterbuch kennt nur `casaro`), `erbetta` (die „tortelli d'erbetta“ heissen in
 * Parma so) und `natel` (im Tessin das Mobiltelefon, wie in IT-T9).
 */
const OHNE_WOERTERBUCH: ReadonlySet<string> = new Set(["casara", "erbetta", "natel"]);
/** Anfänge vor dem Apostroph (geschlossene Liste, nur was hier gebraucht wird). */
const ELISIONS_ANFAENGE = new Set(["l", "un", "dell", "all", "dall", "nell", "sull", "c", "d", "quest", "quell", "trent", "cinquant", "vent", "mezz", "buon"]);

function wortGeprueft(w: string): boolean {
  const n = normalizeWord(w, "it");
  const ok = (x: string) => x.length < 2 || BEKANNT.has(x) || VOM_WOERTERBUCH_BESTAETIGT.has(x) || OHNE_WOERTERBUCH.has(x);
  if (ok(n)) return true;
  if (!n.includes("'")) return false;
  const ab = n.lastIndexOf("'");
  return ELISIONS_ANFAENGE.has(n.slice(0, ab)) && ok(n.slice(ab + 1));
}
/** Wörter, die weder im geprüften Wortschatz stehen noch vom Wörterbuch bestätigt noch Eigennamen der Serie sind. */
function ungeprueft(zeilen: string[], eigennamen: readonly string[] = []): string[] {
  const namen = new Set(eigennamen.flatMap((x) => x.split(/\s+/)));
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const stueck of z.split(/\s+/)) {
      if (TECHNIK.test(stueck)) continue;
      for (const m of stueck.matchAll(/[\p{L}']+/gu)) {
        const w = m[0].replace(/^'+|'+$/g, "");
        const kern = w.slice(w.lastIndexOf("'") + 1);
        if (!w || namen.has(kern)) continue;
        if (!wortGeprueft(w)) out.add(w.toLowerCase());
      }
    }
  }
  return [...out];
}

describe("IT-S Erwachsene: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Eigennamen und Funktionswörter ausgenommen)", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross und nach Elision), Eigennamen und Funktionswörter nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 3 === 0 ? "Ufficio" : i % 3 === 1 ? "l'ufficio" : "un ufficio"} ${"abcdefghi"[i]}?`);
    expect(zuHaeufig(neun)).toEqual(['"ufficio": 9 Zeilen']);
    expect(zuHaeufig(neun.slice(0, 8))).toEqual([]);
    expect(zuHaeufig(Array.from({ length: 9 }, (_, i) => `Dove ${"abcdefghi"[i]}?`))).toEqual([]);
    expect(zuHaeufig(Array.from({ length: 9 }, () => "Rosetta arriva."), 8, new Set(["rosetta"]))).toEqual(['"arriva": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis, auch nicht hinter einer Elision", () => {
    const fehler = ZEILEN.flatMap((t) =>
      (t.match(/[\p{L}']+/gu) ?? []).filter((w) => gesperrtIt(w.replace(/^'+|'+$/g, ""))).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
    const titel = SERIEN_E.flatMap((s) => (s.titel.match(/[\p{L}']+/gu) ?? []).filter((w) => gesperrtIt(w)));
    expect(titel).toEqual([]);
  });

  it("Gegenprobe: mona, passera (Kern), cieco, disabile, grasso, porca (Wortbasis) und dell'inferno werden gefunden, monaco nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(istKernGesperrtIt("Passera")).toBe(true);
    for (const w of ["cieco", "disabile", "grasso", "porca", "dell'inferno"]) expect(gesperrtIt(w), w).toBe(true);
    expect(gesperrtIt("monaco")).toBe(false);
  });

  it("jedes Wort steht im geprüften Wortschatz oder ist vom macOS-Wörterbuch bestätigt (Falle 58/61), Namen in der Namensliste", () => {
    const fehler = SERIEN_E.flatMap((s) => ungeprueft(zeilenVon(s), s.eigennamen).map((w) => `${s.slug}: ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird und nicht ohnehin bekannt ist (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => (z.toLowerCase().match(/[\p{L}]+/gu) ?? [])));
    expect([...VOM_WOERTERBUCH_BESTAETIGT, ...OHNE_WOERTERBUCH].filter((w) => !benutzt.has(w) || BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort, ein abgelehntes Wort und ein Name ausserhalb der Namensliste werden gemeldet", () => {
    expect(ungeprueft(["Lucia lavora il vetrx a Venezia."], ["Lucia", "Venezia"])).toEqual(["vetrx"]);
    expect(ungeprueft(["Abito in un bilocale a Bari."], ["Bari"])).toEqual(["bilocale"]);
    expect(ungeprueft(["Arriva Harpreet con il latte."])).toEqual(["harpreet"]);
    expect(ungeprueft(["Arriva Harpreet con il latte."], ["Harpreet"])).toEqual([]);
    expect(ungeprueft(["Scrivi a segnalazioni@comune.esempio.it subito, dall'ufficio."])).toEqual([]);
    // Das Vorlese-Lexikon dagegen kennt jedes Serienwort - darum taugt es nicht als Prüfung (siehe oben).
    expect(isRealWord("Mamadou", "it")).toBe(true);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da (perche, citta, piu, cosi …)", () => {
    const fehler = ZEILEN.flatMap((z) => ohneAkzentFehler(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Perche non c'e piu posto in citta?“ wird gemeldet, mit Akzenten nicht", () => {
    expect(ohneAkzentFehler("Perche non c'e piu posto in citta?")).toEqual(expect.arrayContaining(["perche", "piu", "citta"]));
    expect(ohneAkzentFehler("Perché non c'è più posto in città?")).toEqual([]);
  });
});

// ── 6 · Tastaturen ──────────────────────────────────────────────────────────

const TASTATUREN: LayoutId[] = ["it", "it-qzerty"];

/** Wie `hatGriff` in `tastenflow-serien-es-eingehaengt.test.ts` (Taste · Umschalt/AltGr · Totaste). */
function hatGriff(layout: KeyboardLayout, zeichen: string): boolean {
  if (zeichen === " ") return true;
  const klein = zeichen.toLowerCase();
  if (zeichen !== klein && (layout.grossFehlt ?? []).includes(zeichen)) return false;
  if (layout.rows.some((r) => r.keys.includes(klein))) return true;
  if (layout.access[klein] !== undefined) return true;
  return kombizeichenZu(zeichen, layout) !== undefined;
}

describe("IT-S Erwachsene: jedes Zeichen auf it und it-qzerty greifbar", () => {
  for (const id of TASTATUREN) {
    it(`${id}: jedes Zeichen jeder Zeile und jedes Titels hat einen Griff (Grossbuchstaben ohne Windows-Lücke)`, () => {
      const l = layoutById(id);
      const ohne = new Set<string>();
      for (const z of [...ZEILEN, ...SERIEN_E.map((s) => s.titel)]) for (const c of z) if (!hatGriff(l, c)) ohne.add(c);
      expect([...ohne]).toEqual([]);
    });
  }

  it("Gegenprobe: ‰ hat keinen Griff, È fehlt unter Windows (grossFehlt), [ fehlt auf der QZERTY", () => {
    expect(hatGriff(layoutById("it"), "‰")).toBe(false);
    expect(hatGriff(layoutById("it"), "È")).toBe(false);
    expect(hatGriff(layoutById("it"), "è")).toBe(true);
    expect(hatGriff(layoutById("it-qzerty"), "[")).toBe(false);
    expect(hatGriff(layoutById("it-qzerty"), "€")).toBe(true);
  });
});

// ── 7 · Servieren gegen den echten Weg ──────────────────────────────────────

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
  let e = erlaubtCache.get(k);
  if (!e) {
    setLayout(l);
    e = allowedFromIntroduced(ordnung(l).slice(0, n), "it");
    erlaubtCache.set(k, e);
  }
  setLayout(l);
  return e;
}
/**
 * Die Wörter einer Zeile, wie sie zu tippen sind: an Leerzeichen getrennt, Satzzeichen nur am Wortrand weg. Ein Bindestrich
 * IM Wort bleibt Teil des Wortes - wird er weggelassen, zerfällt das Wort und die Folge ist eine andere (halbiert).
 */
const wortfolge = (t: string) =>
  t
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}%]+$/gu, ""))
    .filter(Boolean)
    .join(" ");

/** Kleinste Sprosse, ab der die Serie für Erwachsene (mit ⇧) offen ist - `null`, wenn nie. */
function oeffnet(s: SerieEntwurfIt, l: LayoutId): number | null {
  const o = ordnung(l);
  // Erst ab ⇧ (D-2); danach wächst die Menge der Tasten nur - `serieTypeable` ist darin monoton: Halbierungssuche.
  const offen = (n: number) => serieTypeable(s as unknown as Serie, erlaubt(l, n), "it");
  let lo = o.indexOf(SHIFT_UNIT) + 1;
  let hi = o.length;
  if (!offen(hi)) return null;
  while (lo < hi) {
    const mitte = Math.floor((lo + hi) / 2);
    if (offen(mitte)) hi = mitte;
    else lo = mitte + 1;
  }
  return lo;
}
/** Zeilen, die `fitText` an Sprosse `n` verwirft oder in anderen Wörtern serviert. */
function verworfenOderHalbiert(s: SerieEntwurfIt, l: LayoutId, n: number): string[] {
  const allowed = erlaubt(l, n);
  setLayout(l);
  return zeilenVon(s).filter((z) => {
    const f = fitText(z, allowed, "it");
    return f === null || wortfolge(f) !== wortfolge(toLayoutText(z));
  });
}

describe("IT-S Erwachsene: Servieren auf Weg „it“", () => {
  for (const l of TASTATUREN) {
    it(`${l}: jede Serie öffnet an einer Sprosse, und dort serviert fitText jede Zeile ganz (nichts verworfen, nichts halbiert)`, () => {
      const fehler: string[] = [];
      for (const s of SERIEN_E) {
        const n = oeffnet(s, l);
        if (n === null) {
          fehler.push(`${s.slug}: öffnet nie`);
          continue;
        }
        for (const z of verworfenOderHalbiert(s, l, n)) fehler.push(`${s.slug} an Sprosse ${n}: "${z}"`);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it(`${l}: mit allen Tasten kommt jede Zeile Zeichen für Zeichen, und alle 20 Serien sind offen`, () => {
      const alle = erlaubt(l, ordnung(l).length);
      setLayout(l);
      const anders = ZEILEN.filter((z) => fitText(z, alle, "it") !== norm(toLayoutText(z)));
      expect(anders).toEqual([]);
      expect(ZEILEN.filter((z) => toLayoutText(z) !== z)).toEqual([]);
      const offen = new Set(unlockedSerien(alle, "erwachsen", "it", "it").map((s) => s.slug));
      expect(SERIEN_E.filter((s) => !offen.has(s.slug)).map((s) => s.slug)).toEqual([]);
    });

    it(`${l}: Erwachsene ohne ⇧ bekommen keine dieser Serien (D-2), Kinder und Jugend nie`, () => {
      const alle = erlaubt(l, ordnung(l).length);
      setLayout(l);
      const eigene = new Set(SERIEN_E.map((s) => s.slug));
      expect(unlockedSerien(alle, "erwachsen", "it", "it", false).filter((s) => eigene.has(s.slug))).toEqual([]);
      for (const stufe of ["kids", "teens"] as const) {
        expect(unlockedSerien(alle, stufe, "it", "it").filter((s) => eigene.has(s.slug)), stufe).toEqual([]);
      }
    });
  }

  it("die Wege „de“ und „es“ bekommen keine dieser Serien", () => {
    const eigene = new Set(SERIEN_E.map((s) => s.slug));
    setLayout("de");
    const de = unlockedSerien(allowedFromIntroduced(introOrder("de"), "de"), "erwachsen", "de", "de");
    expect(de.filter((s) => eigene.has(s.slug))).toEqual([]);
    setLayout("es");
    const es = unlockedSerien(allowedFromIntroduced(introOrder("es"), "es"), "erwachsen", "es", "es");
    expect(es.filter((s) => eigene.has(s.slug))).toEqual([]);
  });

  it("Gegenprobe: eine Zeile mit Bindestrich im Wort wird vor „-“ halbiert, eine Ziffer hält die Serie zu, ein Name ohne Grossschrift-Griff verwirft", () => {
    const l: LayoutId = "it";
    const vorStrich = ordnung(l).indexOf("-");
    const s = kopie(SERIEN_E[1]);
    s.etappen[0].lines[0] = "Lucia è una operatrice socio-sanitaria a Venezia.";
    expect(verworfenOderHalbiert(s, l, vorStrich).length).toBe(1);
    const z = kopie(SERIEN_E[1]);
    z.etappen[0].lines[0] = "Lucia prende il vaporetto numero 7 per il Lido.";
    const nOhne = oeffnet(SERIEN_E[1], l)!;
    expect(verworfenOderHalbiert(z, l, nOhne)).toEqual(["Lucia prende il vaporetto numero 7 per il Lido."]);
    setLayout(l);
    expect(fitText("Èlena arriva domani.", erlaubt(l, ordnung(l).length), "it")).toBeNull();
  });
});

// ── 8 · Keine Kopien, keine Paare ───────────────────────────────────────────

/** Satzzeichen weg, Geschlecht und Zahl gleichgesetzt: „Il mio collega è…" und „La mia collega è…" sind ein Paar (IT-T9). */
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
/** Alle Zeilen fremder Herkunft: jeder Korpus und jede andere Serie (auch die it-Kinder- und Jugend-Serien). */
const FREMDE_ZEILEN = (): string[] => [
  ...[...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT].map((i) => i.text),
  ...SERIEN.filter((s) => !s.slug.startsWith("it-erwachsen-1-")).flatMap(zeilenVon),
  ...[...SERIEN_IT_KIDS_1, ...SERIEN_IT_TEENS_1].flatMap(zeilenVon),
];

describe("IT-S Erwachsene: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der Akzente und Satzzeichen nicht kennt)", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer Zeile eines Korpus (de/en/fr/es/it) oder einer anderen Serie - Text oder Ledger-Schlüssel", () => {
    const fremd = FREMDE_ZEILEN();
    const texte = new Set(fremd.map((t) => t.toLowerCase()));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(ZEILEN.filter((t) => texte.has(t.toLowerCase()) || schluessel.has(bausteinKey("satz", t)))).toEqual([]);
  });

  it("keine Paare - weder untereinander noch mit einer it-Zeile (Korpus und Serien)", () => {
    const itFremd = [...CORPUS_IT.map((i) => i.text), ...[...SERIEN_IT_KIDS_1, ...SERIEN_IT_TEENS_1].flatMap(zeilenVon)];
    const fehler = paare(ZEILEN, itFremd);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie mit anderen Satzzeichen, Kopie aus dem Korpus, Paar über Geschlecht werden erkannt", () => {
    const t = CORPUS_IT[CORPUS_IT.length - 1].text;
    const anders = `${t.replace(/[.!?]$/, "")}!`;
    expect(new Set(FREMDE_ZEILEN().map((x) => bausteinKey("satz", x)))).toContain(bausteinKey("satz", anders));
    expect(paare([anders], [t])).toHaveLength(1);
    expect(paare(["Il collega arriva da Bari?", "La collega arriva da Bari!"])).toHaveLength(1);
    expect(paare(["Il bus parte alle 8.", "Il bus arriva alle 8."])).toEqual([]);
    expect(bausteinKey("satz", "Più tardi arriva.")).toBe(bausteinKey("satz", "pi tardi arriva"));
  });
});

// ── 9 · Eingehängt, Anker unberührt ─────────────────────────────────────────

/** Die Erwachsenen-Serien stehen in `SERIEN_IT` genau einmal, in ihrer Reihenfolge und als letzter Block (append-only). */
function blockFehler(slugs: string[]): string[] {
  const eigene = SERIEN_E.map((s) => s.slug);
  const start = slugs.length - eigene.length;
  const p: string[] = [];
  if (start < 0 || JSON.stringify(slugs.slice(start)) !== JSON.stringify(eigene)) p.push("nicht der letzte Block in Reihenfolge");
  if (slugs.slice(0, Math.max(0, start)).some((x) => x.startsWith("it-erwachsen-1-"))) p.push("Erwachsenen-Serie vor dem Block");
  return p;
}

describe("IT-S Erwachsene: eingehängt über `SERIEN_IT`, Anker unberührt", () => {
  it("jede Serie steht genau einmal in `SERIEN_IT` und in `SERIEN`, als geschlossener Block hinter Kindern und Jugend", () => {
    const it_ = SERIEN_IT.map((s) => s.slug);
    const alle = SERIEN.map((s) => s.slug);
    for (const s of SERIEN_E) {
      expect(it_.filter((x) => x === s.slug).length, s.slug).toBe(1);
      expect(alle.filter((x) => x === s.slug).length, s.slug).toBe(1);
    }
    expect(blockFehler(it_)).toEqual([]);
  });

  it("der Korpus-Anker ist aktuell und kennt keine Serienzeile (Serien tragen keine Anker-IDs)", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    expect(ZEILEN.filter((z) => CORPUS_IT.some((i) => i.text === z))).toEqual([]);
  });

  it("Gegenprobe: eine fehlende, eine doppelte und eine vorgezogene Serie brechen den Block", () => {
    const eigene = SERIEN_E.map((s) => s.slug);
    expect(blockFehler(["it-kids-1-x", ...eigene.slice(1)]).length).toBeGreaterThan(0);
    expect(blockFehler(["it-kids-1-x", ...eigene, eigene[0]]).length).toBeGreaterThan(0);
    expect(blockFehler([eigene[0], "it-teens-1-x", ...eigene.slice(1)]).length).toBeGreaterThan(0);
    expect(blockFehler(["it-kids-1-x", "it-teens-1-x", ...eigene])).toEqual([]);
  });
});
