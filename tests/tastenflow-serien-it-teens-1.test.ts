/**
 * ★★★ Wächter IT-S Jugend (03.10.2026): die ITALIENISCHEN Serien für Jugendliche (12-16), Charge 1
 * (`src/lib/typing/serienItTeens1.ts`). Vorbilder: der spanische Jugend-Wächter
 * (`tastenflow-serien-es-teens-1.test.ts`: Form, Wortgrenze, Paare, Verteilung) und der Einhänge-Wächter
 * (`tastenflow-serien-es-eingehaengt.test.ts`: `validateSerie`, Griff je Tastatur, Sprossen), dazu die Regeln aller
 * italienischen Zeilen (`helfer/itTextRegeln.ts`) und Teile des IT-T8-Wächters (Ledger-Schlüssel, Paarform,
 * „fast gleich", Funktionswörter). Befund: `BEFUND-2026-10-02-IT-SERIEN-TEENS-1.md`.
 *
 * Geprüft wird:
 *  1. die Form jeder Zeile (Zeichen, die die Tastaturen `it` und `it-qzerty` können; ein Satz; 4-18 Wörter;
 *     Grossbuchstabe am Anfang; mitten im Satz gross nur ein Eigenname der Serie; Sperrliste `gesperrtIt`; Zahlformat),
 *  2. die Form der Datei (20 Serien, 2 Etappen, genau eine mit 3, je Etappe 14-16 Zeilen, offenes Ende, Slug-Vorsilbe,
 *     Titel, Eigennamen kommen vor, kein Inhaltswort in mehr als 8 Zeilen, keine Kopie, kein Paar, nichts fast gleich -
 *     auch nicht gegen `CORPUS_IT`, die anderen italienischen Serien und die Texte aller anderen Sprachen),
 *  3. die Verteilung (Süden und Inseln je mindestens so stark wie der Norden; Tessin, Graubünden, Südtirol und San
 *     Marino dabei; `€` nur in Italien und San Marino),
 *  4. den Weg „it": `minTier` stimmt (`validateSerie`), jedes Zeichen hat auf `it` und `it-qzerty` einen Griff, jede
 *     Zeile wird an einer Sprosse serviert und am Ende vollständig, und keine servierte Fassung verliert ein Wort.
 *
 * Jede Regel hat eine GEGENPROBE: eine falsche Zeile oder Serie muss rot werden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { SERIEN_IT_TEENS_1 } from "../src/lib/typing/serienItTeens1";
import { SERIEN_IT_KIDS_1 } from "../src/lib/typing/serienItKids1";
import { SERIEN_IT_ERWACHSEN_1 } from "../src/lib/typing/serienItErwachsen1";
import type { SerieEntwurfIt } from "../src/lib/typing/serienItTyp";
import { SERIEN_IT } from "../src/lib/typing/serienIt";
import { SERIEN, allowedFromIntroduced, unlockedSerien } from "../src/lib/typing/serien";
import { computeSerieMinTier, validateSerie, serieLines, type Serie } from "../src/lib/typing/serie";
import { CORPUS, CORPUS_EN, CORPUS_FR, fitText } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { setLayout, toLayoutText, layoutById, type KeyboardLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { kombizeichenZu } from "../src/lib/typing/totasten";
import { bausteinKey } from "../src/lib/typing/ledger";
import { gesperrtIt, istKernGesperrtIt } from "../src/lib/typing/sperrlisteIt";
import { zeilenFehler } from "./helfer/itTextRegeln";

afterEach(() => setLayout("de"));

const VORSILBE = "it-teens-1-";
const WORT_GRENZE = 8;
const TASTATUREN: LayoutId[] = ["it", "it-qzerty"];

/**
 * Erlaubte Zeichen: was `it` UND `it-qzerty` ohne Umweg können und was eine Geschichte braucht. Bewusst NICHT:
 *  · `-` (auf Weg „it" weglassbar: vor seiner Sprosse würde aus „Coca-Cola" ein „Coca Cola" - ein Wort verändert),
 *  · `; ( ) [ ] { }` (brauchen die Geschichten nicht; `[ ]` fehlt auf `it-qzerty`, `{ }` auf `it`),
 *  · grosse Akzentbuchstaben `À È É Ì Ò Ù` (serviert erst ganz spät, `grossAkzentSpaet`; unter Windows nie am Zeilenanfang),
 *  · typografische Zeichen, `º ª °`, Akzente anderer Sprachen (`helfer/itTextRegeln.ts`).
 */
const ERLAUBT = /^[a-zA-Zàèéìòù0-9 .,?!":'%@#€]+$/u;

/** Regionen (Feld `land`) und ihr Raum: Nord, Mitte, Süd, Inseln, Tessin, Graubünden, Südtirol, San Marino. */
const RAUM: Record<string, "N" | "M" | "S" | "I" | "TI" | "GR" | "BZ" | "RSM"> = {
  Piemont: "N", Aostatal: "N", Lombardei: "N", Ligurien: "N", Venetien: "N", "Friaul-Julisch Venetien": "N",
  Trentino: "N", "Emilia-Romagna": "N",
  Toskana: "M", Umbrien: "M", Marken: "M", Latium: "M",
  Abruzzen: "S", Molise: "S", Kampanien: "S", Apulien: "S", Basilikata: "S", Kalabrien: "S",
  Sizilien: "I", Sardinien: "I",
  Tessin: "TI", Graubünden: "GR", Südtirol: "BZ", "San Marino": "RSM",
};
const MAX_JE_LAND = 3;

/**
 * Funktionswörter, die nicht unter die 8-Zeilen-Grenze fallen: die Liste des IT-T8-Wächters
 * (`tastenflow-texte-it-teens-ende.test.ts`), dazu - wie im spanischen Serien-Wächter (haber/ser/estar) - weitere
 * Formen von essere/avere/stare und die Kurzformen vor dem Apostroph (`l'`, `un'`, `c'`, `d'`, `s'`, `n'`, `quest'`).
 */
const FUNKTIONSWOERTER = new Set(
  (
    "il lo la i le gli un uno una di a ad da in con su per tra fra " +
    "del dello della dei delle degli al allo alla ai alle agli dal dallo dalla dai dalle " +
    "nel nello nella nei nelle sul sullo sulla sui sulle " +
    "e ed o ma se non si mi ti ci vi ne io tu lui lei noi voi loro " +
    "mio mia miei mie tuo tua suo sua suoi sue nostro nostra sono sei siamo siete era erano è ho ha hanno " +
    "fa fai sta sto stai tutto tutta tutti tutte che chi anche più perché così poi ora già " +
    "questo questa questi queste quest quel quello quella quelli quelle c l d s n un po " +
    "come dove quando quanto quanti quanta quante quale quali cosa " +
    "però quindi invece mentre adesso sopra sotto dopo prima fino verso senza davanti dietro " +
    "abbiamo hai avete va vai vado vanno andiamo ogni ancora sempre molto poco tanto troppo " +
    "all dell nell sull dall " +
    "essere avere stato stata stati aveva avevano fosse fossero sia siano sarà saranno " +
    "gliela glielo gliene gli lo li le la"
  ).split(/\s+/),
);

// ── Hilfen ───────────────────────────────────────────────────────────────

const woerter = (zeile: string) => zeile.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
/** Wortformen ab zwei Buchstaben, klein; Elision getrennt („l'amico" ⇒ „amico"). */
const woerterVon = (t: string) => (t.toLowerCase().match(/\p{L}+/gu) ?? []).filter((w) => w.length > 1);
/** Grossgeschriebene Wörter nach dem ersten: Rand-Satzzeichen weg, Elision abgeschnitten („dell'Etna" ⇒ „Etna"). */
function grosseMitten(zeile: string): string[] {
  const out: string[] = [];
  zeile.split(/\s+/).forEach((roh, i) => {
    if (i === 0) return;
    if (/^[@#]/.test(roh) || /\d/.test(roh)) return; // Handle, Hashtag, „3D"
    const w = roh.replace(/^[^\p{L}]+/u, "").replace(/[^\p{L}\p{N}]+$/u, "");
    const kern = w.slice(w.lastIndexOf("'") + 1);
    if (!kern || kern[0] === kern[0].toLowerCase()) return;
    if (kern.length > 1 && kern === kern.toUpperCase()) return; // UNESCO
    out.push(kern);
  });
  return out;
}

/** Alle Form-Probleme EINER Zeile. Leer heisst: in Ordnung. `namen` = die Eigennamen der Serie. */
export function zeilenProbleme(zeile: string, namen: readonly string[] = [], land = ""): string[] {
  const p: string[] = [];
  if (!ERLAUBT.test(zeile)) {
    const fremd = [...new Set([...zeile].filter((c) => !ERLAUBT.test(c)))].join(" ");
    p.push(`Zeichen ausserhalb der Liste: ${fremd}`);
  }
  for (const f of zeilenFehler(zeile)) p.push(`itTextRegeln: ${f}`);
  for (const w of zeile.split(/[\s,.:!?"%@#€]+/)) if (w && gesperrtIt(w)) p.push(`Sperrwort ${w}`);
  if (/\d[.,]\d/.test(zeile)) p.push("Dezimalzahl oder Tausenderpunkt");
  if (/\d\s+%/.test(zeile) || /%\d/.test(zeile)) p.push("Prozent nach I19: 10%");
  if (/€\s*\d/.test(zeile) || /\d€/.test(zeile)) p.push("Euro nach I19: 3 €");
  if (zeile.includes("€") && land !== "" && RAUM[land] !== undefined && !["N", "M", "S", "I", "BZ", "RSM"].includes(RAUM[land])) {
    p.push("€ ausserhalb von Italien und San Marino");
  }
  if (/[@#](?![\p{L}\p{N}])/u.test(zeile)) p.push("@ oder # ohne Namen");
  if ((zeile.match(/"/g) ?? []).length % 2 !== 0) p.push("Anführungszeichen ungerade");
  const erster = zeile.replace(/^"+/, "").charAt(0);
  if (!/\p{Lu}/u.test(erster)) p.push("kein Grossbuchstabe am Anfang");
  if (!/[.!?]"?$/.test(zeile)) p.push("kein Satzende");
  if (/[.!?]"?\s+"*\p{Lu}/u.test(zeile)) p.push("mehr als ein Satz");
  for (const g of grosseMitten(zeile)) if (!namen.includes(g)) p.push(`gross mitten im Satz, kein Eigenname der Serie: ${g}`);
  const n = woerter(zeile).length;
  if (n < 4 || n > 18) p.push(`${n} Wörter`);
  return p;
}

/** Geschlecht und Zahl gleichgesetzt, Satzzeichen weg, Zahlen bleiben (Paarform des IT-T8-Wächters). */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", gli: "ART", le: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  const w = (zeile.toLowerCase().match(/\p{L}+/gu) ?? []).map((x) => art[x] ?? pron[x] ?? x.replace(/[oaei]$/, "_"));
  return `${w.join(" ")}|${(zeile.match(/\d+/g) ?? []).join(",")}`;
}
/** Wortmenge mit Zahlen; „fast gleich" ab Jaccard 0,6 (IT-T8, Falle 51). */
const menge = (t: string) => new Set([...(t.toLowerCase().match(/\p{L}+/gu) ?? []), ...(t.match(/\d+/g) ?? [])]);
function fastGleich(a: Set<string>, b: Set<string>): boolean {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s) >= 0.6;
}
const ohne = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}' ]/gu, " ").replace(/\s+/g, " ").trim();
const slugRest = (slug: string) => slug.replace(/^it-(kids|teens|erwachsen)-\d+-/, "");

/** Die Zeilen, gegen die Kopien und Paare geprüft werden: alles Italienische ausser dieser Charge. */
const ANDERE_IT = [
  ...CORPUS_IT.map((i) => i.text),
  ...[...SERIEN_IT_KIDS_1, ...SERIEN_IT_ERWACHSEN_1].flatMap((s) => s.etappen.flatMap((e) => e.lines)),
];
/** Texte anderer Sprachen (Korpus und Serien): Kopie nach Text oder nach Ledger-Schlüssel. */
const ANDERE_SPRACHEN = [
  ...[...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES].map((i) => i.text),
  ...SERIEN.filter((s) => s.lang !== "it").flatMap((s) => serieLines(s)),
];

/** Alle Probleme der ganzen Datei. `andereIt`/`andereSprachen` lassen sich für die Gegenproben ersetzen. */
export function dateiProbleme(
  serien: SerieEntwurfIt[],
  andereIt: readonly string[] = ANDERE_IT,
  andereSprachen: readonly string[] = ANDERE_SPRACHEN,
): string[] {
  const p: string[] = [];
  const slugs = new Set<string>();
  const namen = new Set<string>();
  for (const s of serien) for (const n of s.eigennamen) for (const t of woerterVon(n)) namen.add(t);
  const fremdeTitel = new Set([...SERIEN_IT_KIDS_1, ...SERIEN_IT_ERWACHSEN_1].map((s) => s.titel.toLowerCase()));
  const fremdeSlugs = new Set([...SERIEN_IT_KIDS_1, ...SERIEN_IT_ERWACHSEN_1].map((s) => slugRest(s.slug)));
  const zeilenJeWort = new Map<string, number>();
  const paarSchon = new Map<string, string>();
  for (const z of andereIt) paarSchon.set(paarForm(z), `anderswo: ${z}`);
  const fremdText = new Set([...andereIt, ...andereSprachen].map(ohne));
  const fremdKey = new Set([...andereIt, ...andereSprachen].map((t) => bausteinKey("satz", t)));
  const eigeneKeys = new Map<string, string>();
  const mengen: [string, Set<string>][] = [];

  for (const s of serien) {
    if (!s.slug.startsWith(VORSILBE)) p.push(`${s.slug}: Slug-Vorsilbe`);
    if (slugs.has(s.slug)) p.push(`${s.slug}: Slug doppelt`);
    slugs.add(s.slug);
    if (fremdeSlugs.has(slugRest(s.slug))) p.push(`${s.slug}: Slug wie in einer anderen it-Charge`);
    if (fremdeTitel.has(s.titel.toLowerCase())) p.push(`${s.slug}: Titel wie in einer anderen it-Charge`);
    if (RAUM[s.land] === undefined) p.push(`${s.slug}: unbekannte Region ${s.land}`);
    if (s.lang !== "it" || s.nurWeg !== "it") p.push(`${s.slug}: lang/nurWeg nicht it`);
    if (s.kind !== "geschichte") p.push(`${s.slug}: kind nicht geschichte`);
    if (s.stufen.length !== 1 || s.stufen[0] !== "teens") p.push(`${s.slug}: stufen nicht teens`);
    if (s.minTier === undefined) p.push(`${s.slug}: minTier fehlt`);
    if (!ERLAUBT.test(s.titel) || /\d/.test(s.titel)) p.push(`${s.slug}: Titel mit fremdem Zeichen`);
    if (woerter(s.titel).length > 6) p.push(`${s.slug}: Titel zu lang`);
    if (s.etappen.length < 2 || s.etappen.length > 3) p.push(`${s.slug}: ${s.etappen.length} Etappen`);

    s.etappen.forEach((e, i) => {
      if (e.lines.length < 14 || e.lines.length > 16) p.push(`${s.slug} E${i + 1}: ${e.lines.length} Zeilen`);
      const letzte = e.lines[e.lines.length - 1] ?? "";
      if (!/[?!]"?$/.test(letzte)) p.push(`${s.slug} E${i + 1}: endet ohne Frage/Spannung`);
      for (const zeile of e.lines) {
        for (const q of zeilenProbleme(zeile, s.eigennamen, s.land)) p.push(`${s.slug} E${i + 1}: ${q} - ${zeile}`);
        const pf = paarForm(zeile);
        if (paarSchon.has(pf)) p.push(`Paar/Kopie: "${zeile}" ~ "${paarSchon.get(pf)}"`);
        else paarSchon.set(pf, zeile);
        const k = bausteinKey("satz", zeile);
        if (eigeneKeys.has(k)) p.push(`Ledger-Schlüssel doppelt: "${zeile}" ~ "${eigeneKeys.get(k)}"`);
        eigeneKeys.set(k, zeile);
        if (fremdText.has(ohne(zeile)) || fremdKey.has(k)) p.push(`Kopie eines anderen Textes: "${zeile}"`);
        mengen.push([zeile, menge(zeile)]);
        for (const w of new Set(woerterVon(zeile))) {
          if (FUNKTIONSWOERTER.has(w) || namen.has(w)) continue;
          zeilenJeWort.set(w, (zeilenJeWort.get(w) ?? 0) + 1);
        }
      }
    });
    for (const n of s.eigennamen) {
      if (!s.etappen.some((e) => e.lines.some((l) => l.includes(n)))) p.push(`${s.slug}: Eigenname ${n} kommt nicht vor`);
    }
  }
  if (serien.filter((s) => s.etappen.length === 3).length > 1) p.push("mehr als eine Serie mit 3 Etappen");
  for (const [w, n] of zeilenJeWort) if (n > WORT_GRENZE) p.push(`Wort "${w}" in ${n} Zeilen`);
  const andereMengen = andereIt.map((t) => [t, menge(t)] as const);
  for (let i = 0; i < mengen.length; i++) {
    for (const [t, m] of andereMengen) if (fastGleich(mengen[i][1], m)) p.push(`fast gleich: "${mengen[i][0]}" ~ "${t}"`);
    for (let j = i + 1; j < mengen.length; j++) {
      if (fastGleich(mengen[i][1], mengen[j][1])) p.push(`fast gleich: "${mengen[i][0]}" ~ "${mengen[j][0]}"`);
    }
  }
  const proLand = new Map<string, number>();
  for (const s of serien) proLand.set(s.land, (proLand.get(s.land) ?? 0) + 1);
  for (const [l, n] of proLand) if (n > MAX_JE_LAND) p.push(`mehr als ${MAX_JE_LAND} Serien in ${l}`);
  return p;
}

/** Serien je Raum. */
function raeume(serien: SerieEntwurfIt[]): Map<string, number> {
  const n = new Map<string, number>();
  for (const s of serien) n.set(RAUM[s.land], (n.get(RAUM[s.land]) ?? 0) + 1);
  return n;
}
/** Verteilungs-Probleme: Süden und Inseln je mindestens so stark wie der Norden; TI, GR, BZ, RSM je mindestens einmal. */
export function verteilungsProbleme(serien: SerieEntwurfIt[]): string[] {
  const n = raeume(serien);
  const p: string[] = [];
  const nord = n.get("N") ?? 0;
  for (const r of ["S", "I"]) if ((n.get(r) ?? 0) < nord) p.push(`${r} schwächer als der Norden`);
  for (const r of ["TI", "GR", "BZ", "RSM"]) if ((n.get(r) ?? 0) < 1) p.push(`${r} fehlt`);
  if ((n.get("M") ?? 0) < 1) p.push("M fehlt");
  return p;
}

/** Serien mit Ziffern und die Sonderzeichen, die vorkommen. */
export function ziffernUndZeichen(serien: SerieEntwurfIt[]): { mitZiffern: number; zeichen: string[] } {
  let mitZiffern = 0;
  const zeichen = new Set<string>();
  for (const s of serien) {
    const text = s.etappen.flatMap((e) => e.lines).join("\n");
    if (/\d/.test(text)) mitZiffern++;
    for (const z of ["@", "#", "%", "€"]) if (text.includes(z)) zeichen.add(z);
    if (/\d:\d\d/.test(text)) zeichen.add(":");
  }
  return { mitZiffern, zeichen: [...zeichen].sort() };
}

// ── 1 · Form ─────────────────────────────────────────────────────────────

describe("1 · italienische Serien für Jugendliche, Teil 1 - Form", () => {
  it("die Datei hat keine Form-Probleme", () => {
    const p = dateiProbleme(SERIEN_IT_TEENS_1);
    expect(p, p.slice(0, 30).join("\n")).toEqual([]);
  });

  it("20 Serien, alle für Jugendliche, je 2 Etappen und genau eine mit 3", () => {
    expect(SERIEN_IT_TEENS_1.length).toBe(20);
    for (const s of SERIEN_IT_TEENS_1) expect(s.stufen).toEqual(["teens"]);
    expect(SERIEN_IT_TEENS_1.filter((s) => s.etappen.length === 3).length).toBe(1);
    expect(SERIEN_IT_TEENS_1.filter((s) => s.etappen.length === 2).length).toBe(19);
  });

  it("Verteilung: Süden und Inseln je mindestens so stark wie der Norden; Tessin, Graubünden, Südtirol, San Marino", () => {
    expect(verteilungsProbleme(SERIEN_IT_TEENS_1)).toEqual([]);
  });

  it("mindestens 4 Serien mit Ziffern; @ # % € und eine Uhrzeit h:mm kommen vor", () => {
    const { mitZiffern, zeichen } = ziffernUndZeichen(SERIEN_IT_TEENS_1);
    expect(mitZiffern).toBeGreaterThanOrEqual(4);
    expect(zeichen).toEqual(["#", "%", ":", "@", "€"]);
  });
});

// ── Gegenproben ──────────────────────────────────────────────────────────

describe("Gegenproben - jede Regel muss anschlagen", () => {
  const basis = (): SerieEntwurfIt => JSON.parse(JSON.stringify(SERIEN_IT_TEENS_1[0]));

  it("gute Zeilen sind grün", () => {
    expect(zeilenProbleme("Giulia carica il video alle 21:30 con #musicadalvivo.")).toEqual([]);
    expect(zeilenProbleme("\"Vieni anche tu al concerto?\", chiede Marco.", ["Marco"])).toEqual([]);
    expect(zeilenProbleme("L'amica di Sara ha comprato un po' di pane.", ["Sara"])).toEqual([]);
    expect(zeilenProbleme("Il biglietto costa 3 € e lo sconto è del 10%.", [], "Sizilien")).toEqual([]);
  });

  it.each([
    ["Giulia corre - e salta il muretto.", "Zeichen ausserhalb"],
    ["Giulia corre; poi salta il muretto.", "Zeichen ausserhalb"],
    ["Giulia legge (piano) la lettera.", "Zeichen ausserhalb"],
    ["Giulia dice «ciao» a tutti.", "Zeichen ausserhalb"],
    ["Giulia ascolta Knödel alla radio.", "Zeichen ausserhalb"],
    ["Ormai È tardi per tutti noi.", "Zeichen ausserhalb"],
    ["Non so perche' non viene oggi.", "itTextRegeln"],
    ["Ho visto un'amico al parco ieri.", "itTextRegeln"],
    ["Che cazzo fai qui stasera?", "Sperrwort"],
    ["Mia sorella ha visto una passera sul ramo.", "Sperrwort"],
    ["Il ragazzo sordo ride con gli amici.", "Sperrwort"],
    ["Il record è di 12,5 secondi esatti.", "Dezimalzahl"],
    ["Il biglietto costa €3 alla cassa.", "Euro nach I19"],
    ["Lo sconto oggi è del 10 % su tutto.", "Prozent nach I19"],
    ["Scrivimi su @ quando arrivi a casa.", "@ oder # ohne Namen"],
    ["giulia carica il video sul canale.", "kein Grossbuchstabe"],
    ["Giulia carica il video sul canale", "kein Satzende"],
    ["Giulia carica il video. Poi esce.", "mehr als ein Satz"],
    ["Giulia ride molto.", "3 Wörter"],
    [
      "Giulia carica sul canale della scuola il video lungo della festa del quartiere con un testo in italiano e in inglese.",
      "21 Wörter",
    ],
    ["Giulia dice: \"ciao a tutti nel gruppo.", "Anführungszeichen ungerade"],
    ["Giulia grida: \"Corri più veloce!\"", "gross mitten im Satz"],
    ["Marco aspetta Giulia davanti alla scuola.", "gross mitten im Satz, kein Eigenname der Serie: Giulia"],
  ])("rot: %s", (zeile, erwartet) => {
    expect(zeilenProbleme(zeile, ["Marco"]).join(" | ")).toContain(erwartet);
  });

  it("rot: € im Tessin oder in Graubünden, grün in San Marino", () => {
    expect(zeilenProbleme("Il panino costa 8 € al bar.", [], "Tessin").join(" ")).toContain("€ ausserhalb");
    expect(zeilenProbleme("Il panino costa 8 € al bar.", [], "Graubünden").join(" ")).toContain("€ ausserhalb");
    expect(zeilenProbleme("Il panino costa 8 € al bar.", [], "San Marino")).toEqual([]);
  });

  it("rot: eine Etappe mit 13 oder 17 Zeilen", () => {
    const s = basis();
    s.etappen[0].lines = s.etappen[0].lines.slice(0, 13);
    expect(dateiProbleme([s], [], []).some((x) => x.includes("13 Zeilen"))).toBe(true);
    const t = basis();
    while (t.etappen[0].lines.length < 17) t.etappen[0].lines.unshift(`Questa riga numero ${t.etappen[0].lines.length} riempie lo spazio.`);
    expect(dateiProbleme([t], [], []).some((x) => x.includes("17 Zeilen"))).toBe(true);
  });

  it("rot: eine Serie mit 1 oder 4 Etappen, zwei Serien mit 3 Etappen", () => {
    const s = basis();
    s.etappen = s.etappen.slice(0, 1);
    expect(dateiProbleme([s], [], []).some((x) => x.includes("1 Etappen"))).toBe(true);
    const t = basis();
    t.etappen = [t.etappen[0], t.etappen[1], t.etappen[0], t.etappen[1]];
    expect(dateiProbleme([t], [], []).some((x) => x.includes("4 Etappen"))).toBe(true);
    const drei = SERIEN_IT_TEENS_1.find((x) => x.etappen.length === 3)!;
    const a = JSON.parse(JSON.stringify(drei)) as SerieEntwurfIt;
    const b = { ...JSON.parse(JSON.stringify(drei)), slug: `${VORSILBE}zweite-mit-drei` } as SerieEntwurfIt;
    expect(dateiProbleme([a, b], [], [])).toContain("mehr als eine Serie mit 3 Etappen");
  });

  it("rot: eine Etappe ohne offenes Ende", () => {
    const s = basis();
    s.etappen[0].lines[s.etappen[0].lines.length - 1] = "Giorgia torna a casa e fa i compiti.";
    expect(dateiProbleme([s], [], []).some((x) => x.includes("endet ohne Frage"))).toBe(true);
  });

  it("rot: Paar (lui/lei, amico/amica), Kopie, Ledger-Schlüssel, Kopie aus CORPUS_IT und aus einer anderen Sprache", () => {
    const s = basis();
    s.etappen[0].lines[1] = "Lui mette il telefono nello zaino blu.";
    s.etappen[0].lines[2] = "Lei mette il telefono nello zaino blu.";
    expect(dateiProbleme([s], [], []).some((x) => x.startsWith("Paar/Kopie"))).toBe(true);
    const t = basis();
    t.etappen[0].lines[1] = "Il mio amico apre la porta della palestra.";
    t.etappen[0].lines[2] = "La mia amica apre la porta della palestra.";
    expect(dateiProbleme([t], [], []).some((x) => x.startsWith("Paar/Kopie"))).toBe(true);
    const u = basis();
    // Der Ledger-Schlüssel kennt keine Akzente: aus „è" wird nichts - zwei verschiedene Zeilen, EIN Schlüssel.
    u.etappen[0].lines[1] = "Giorgia è qui con la sua classe.";
    u.etappen[0].lines[2] = "Giorgia qui con la sua classe!";
    expect(bausteinKey("satz", u.etappen[0].lines[1])).toBe(bausteinKey("satz", u.etappen[0].lines[2]));
    expect(dateiProbleme([u], [], []).some((x) => x.startsWith("Ledger-Schlüssel doppelt"))).toBe(true);
    const v = basis();
    v.etappen[0].lines[0] = CORPUS_IT[0].text;
    expect(dateiProbleme([v]).some((x) => x.includes("anderswo:") || x.startsWith("Kopie"))).toBe(true);
    const w = basis();
    w.etappen[0].lines[0] = "Giorgia abita a Palermo vicino al mare.";
    expect(dateiProbleme([w], [], ["Giorgia abita a Palermo, vicino al mare!"]).some((x) => x.startsWith("Kopie eines anderen"))).toBe(true);
  });

  it("rot: zwei fast gleiche Zeilen (Jaccard ab 0,6)", () => {
    const s = basis();
    s.etappen[0].lines[1] = "Giorgia guarda il mare dalla finestra della classe.";
    s.etappen[0].lines[2] = "Salvo guarda il mare dalla finestra della classe.";
    expect(dateiProbleme([s], [], []).some((x) => x.startsWith("fast gleich"))).toBe(true);
  });

  it("rot: ein Inhaltswort in 9 Zeilen, grün in 8 - nach Elision und gross am Anfang mitgezählt", () => {
    const neun = [
      "Il biglietto del treno costa troppo.",
      "Biglietto in tasca, zaino in spalla, si parte.",
      "Al biglietto del concerto pensa da settimane.",
      "Dell'altro biglietto nessuno sa niente di preciso.",
      "Quel biglietto vecchio è ancora valido?",
      "Un biglietto cade dalla tribuna sul campo.",
      "Il biglietto della lotteria di classe vince una torta.",
      "Qualche biglietto dimenticato resta sul sedile.",
      "Un altro biglietto spunta dalla tasca della giacca.",
    ];
    expect(SERIEN_IT_TEENS_1[0].etappen.some((e) => e.lines.some((l) => /biglietto/i.test(l)))).toBe(false);
    const s = basis();
    s.etappen[0].lines.splice(0, 9, ...neun);
    expect(dateiProbleme([s], [], [])).toContain('Wort "biglietto" in 9 Zeilen');
    const t = basis();
    t.etappen[0].lines.splice(0, 8, ...neun.slice(0, 8));
    expect(dateiProbleme([t], [], []).some((x) => x.includes('"biglietto"'))).toBe(false);
  });

  it("rot: Eigenname, der nicht vorkommt; Region unbekannt; mehr als 3 Serien in einer Region", () => {
    const s = { ...basis(), eigennamen: [...basis().eigennamen, "Agrigento"] };
    expect(dateiProbleme([s], [], []).some((x) => x.includes("Eigenname Agrigento"))).toBe(true);
    const t = { ...basis(), land: "Atlantide" };
    expect(dateiProbleme([t], [], []).some((x) => x.includes("unbekannte Region"))).toBe(true);
    const viele = Array.from({ length: 4 }, (_, i) => ({ ...basis(), slug: `${VORSILBE}probe-${i}` }));
    expect(dateiProbleme(viele, [], []).some((x) => x.includes("mehr als 3 Serien in Sizilien"))).toBe(true);
  });

  it("rot: Verteilung - der Norden stärker als der Süden, Tessin fehlt", () => {
    const nord = SERIEN_IT_TEENS_1.map((s) => ({ ...s, land: RAUM[s.land] === "S" ? "Lombardei" : s.land }));
    expect(verteilungsProbleme(nord)).toContain("S schwächer als der Norden");
    const ohneTi = SERIEN_IT_TEENS_1.filter((s) => s.land !== "Tessin");
    expect(verteilungsProbleme(ohneTi)).toContain("TI fehlt");
  });

  it("rot: doppelter Slug, falsche Vorsilbe, falsche Stufe, kein minTier, falscher Weg", () => {
    expect(dateiProbleme([basis(), basis()], [], []).some((x) => x.includes("Slug doppelt"))).toBe(true);
    expect(dateiProbleme([{ ...basis(), slug: "it-kids-1-falsch" }], [], []).some((x) => x.includes("Slug-Vorsilbe"))).toBe(true);
    expect(dateiProbleme([{ ...basis(), stufen: ["kids"] }], [], []).some((x) => x.includes("stufen nicht teens"))).toBe(true);
    const ohneTier = basis();
    delete ohneTier.minTier;
    expect(dateiProbleme([ohneTier], [], []).some((x) => x.includes("minTier fehlt"))).toBe(true);
    const es = { ...basis(), nurWeg: "es" } as unknown as SerieEntwurfIt;
    expect(dateiProbleme([es], [], []).some((x) => x.includes("nurWeg nicht it"))).toBe(true);
  });

  it("rot: zu wenig Ziffern und Zeichen", () => {
    const ohneZ = { ...basis(), etappen: [{ lines: ["Senza numeri si scrive benissimo lo stesso."] }] };
    const r = ziffernUndZeichen([ohneZ, ohneZ, ohneZ, ohneZ]);
    expect(r.mitZiffern).toBe(0);
    expect(r.zeichen).toEqual([]);
  });

  it("Sperrliste: Kern und Wortbasis greifen, auch hinter einer Elision - monaco nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(gesperrtIt("l'inferno")).toBe(true);
    expect(gesperrtIt("cieca")).toBe(true);
    expect(gesperrtIt("monaco")).toBe(false);
  });
});

// ── 2 · Weg „it": minTier, Griff, Sprossen ───────────────────────────────

/** Wie `hatGriff` im spanischen Einhänge-Wächter: Taste, Umschalt/AltGr-Griff oder Totaste. */
function hatGriff(layout: KeyboardLayout, zeichen: string): boolean {
  if (zeichen === " ") return true;
  const klein = zeichen.toLowerCase();
  if (layout.rows.some((r) => r.keys.includes(klein))) return true;
  if (layout.access[klein] !== undefined) return true;
  if (kombizeichenZu(zeichen, layout) !== undefined) return true;
  return false;
}

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
/**
 * Die Wörter einer Fassung, nur an Leerzeichen getrennt, Satzzeichen am Rand weg - eine servierte Fassung darf KEIN
 * Wort verlieren oder ändern (ein Bindestrich, der vor seiner Sprosse zu einem Leerzeichen wird, ändert eines).
 */
const wortFolge = (t: string) =>
  t
    .split(/\s+/)
    .map((w) => w.replace(/^[.,?!":;()]+|[.,?!":;()]+$/g, ""))
    .filter(Boolean)
    .join(" ");
type Sprossen = { volle: number | null; buchst: number | null; verloren: string[] };
/** Erste Sprosse, an der die Zeile serviert wird, die, an der sie vollständig ist, und Fassungen mit verlorenen Wörtern. */
function sprossen(text: string, layout: LayoutId): Sprossen {
  const o = reihenfolge(layout);
  const ziel = norm(toLayoutText(text));
  const r: Sprossen = { volle: null, buchst: null, verloren: [] };
  for (let n = 1; n <= o.length; n++) {
    const f = fitText(text, allowedFromIntroduced(o.slice(0, n), "it"), "it");
    if (f === null) continue;
    if (r.buchst === null) r.buchst = n;
    if (wortFolge(f) !== wortFolge(ziel)) r.verloren.push(`n=${n}: ${f}`);
    if (f === ziel) {
      r.volle = n;
      break;
    }
  }
  return r;
}

const ALLE_ZEILEN = SERIEN_IT_TEENS_1.flatMap((s) => s.etappen.flatMap((e) => e.lines.map((l) => [s.slug, l] as const)));

describe("2 · Weg it: minTier, Griff auf it und it-qzerty, Sprossen", () => {
  it("jede Serie besteht validateSerie(s, \"it\") - minTier deklariert == berechnet", () => {
    for (const s of SERIEN_IT_TEENS_1) {
      const { ok, problems } = validateSerie(s as unknown as Serie, "it");
      expect(ok, `${s.slug}: ${problems.join("; ")}`).toBe(true);
    }
  });

  it("Gegenprobe: ein falsch deklariertes minTier und eine Zeile mit „ç\" werden abgelehnt", () => {
    const s = SERIEN_IT_TEENS_1[0] as unknown as Serie;
    const falsch = { ...s, minTier: (((s.minTier as number) + 1) % 6) as Serie["minTier"] };
    expect(validateSerie(falsch, "it").ok).toBe(false);
    const fremd: Serie = { ...s, etappen: [{ lines: ["Il garçon arriva in ritardo alla stazione.", ...s.etappen[0].lines.slice(1)] }, s.etappen[1]] };
    expect(computeSerieMinTier(fremd, "it")).toBeNull();
  });

  it.each(TASTATUREN)("auf %s hat jedes Zeichen jeder Zeile einen Griff", (l) => {
    const layout = layoutById(l);
    const fehlt = ALLE_ZEILEN.flatMap(([slug, z]) => [...z].filter((c) => !hatGriff(layout, c)).map((c) => `${slug}: „${c}"`));
    expect([...new Set(fehlt)]).toEqual([]);
  });

  it("Gegenprobe: „[\" fehlt auf it-qzerty, „{\" auf it, „ñ\" auf beiden", () => {
    expect(hatGriff(layoutById("it-qzerty"), "[")).toBe(false);
    expect(hatGriff(layoutById("it"), "{")).toBe(false);
    expect(hatGriff(layoutById("it"), "ñ")).toBe(false);
    expect(hatGriff(layoutById("it-qzerty"), "ñ")).toBe(false);
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile wird serviert, ist am Ende vollständig, und keine servierte Fassung verliert ein Wort`, () => {
      const fehler: string[] = [];
      for (const [slug, z] of ALLE_ZEILEN) {
        const s = sprossen(z, l);
        if (s.buchst === null) fehler.push(`${slug}: nie serviert - ${z}`);
        if (s.volle === null) fehler.push(`${slug}: nie vollständig - ${z}`);
        for (const v of s.verloren) fehler.push(`${slug}: Wort verloren ${v}`);
      }
      expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
    });
  }

  it("Gegenprobe: ein Bindestrich wird vor seiner Sprosse zu einem Leerzeichen (Wort verändert), ç wird nie serviert", () => {
    const mitStrich = sprossen("Giorgia beve una Coca-Cola al bar.", "it");
    expect(mitStrich.verloren.length).toBeGreaterThan(0);
    expect(sprossen("Il garçon arriva in ritardo.", "it").buchst).toBeNull();
  });

  it("jede Serie öffnet auf it und it-qzerty an derselben Sprosse oder höchstens eine daneben (die achte Grundtaste)", () => {
    const offen = (s: SerieEntwurfIt, l: LayoutId) =>
      Math.max(...s.etappen.flatMap((e) => e.lines).map((z) => sprossen(z, l).buchst ?? Infinity));
    const fehler = SERIEN_IT_TEENS_1.filter((s) => Math.abs(offen(s, "it") - offen(s, "it-qzerty")) > 1).map((s) => s.slug);
    expect(fehler).toEqual([]);
  });
});

// ── 3 · eingehängt ───────────────────────────────────────────────────────

describe("3 · eingehängt: SERIEN_IT und SERIEN tragen jede Serie genau einmal, nur auf Weg it", () => {
  it("jede Serie steht genau einmal in SERIEN_IT und in SERIEN, mit lang it", () => {
    for (const s of SERIEN_IT_TEENS_1) {
      expect(SERIEN_IT.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
      const inSerien = SERIEN.filter((t) => t.slug === s.slug);
      expect(inSerien.length, s.slug).toBe(1);
      expect(inSerien[0].lang).toBe("it");
    }
  });

  it("mit allen Einheiten des Weges sind alle 20 für Jugendliche freigeschaltet - für Kinder und auf Weg es keine", () => {
    setLayout("it");
    const alle = allowedFromIntroduced(introOrder("it"), "it");
    const teens = new Set(unlockedSerien(alle, "teens", "it", "it").map((s) => s.slug));
    for (const s of SERIEN_IT_TEENS_1) expect(teens.has(s.slug), s.slug).toBe(true);
    const kids = new Set(unlockedSerien(alle, "kids", "it", "it").map((s) => s.slug));
    expect(SERIEN_IT_TEENS_1.filter((s) => kids.has(s.slug))).toEqual([]);
    const es = new Set(unlockedSerien(alle, "teens", "it", "es").map((s) => s.slug));
    expect(SERIEN_IT_TEENS_1.filter((s) => es.has(s.slug))).toEqual([]);
  });

  it("Gegenprobe: mit der Grundreihe allein ist keine dieser Serien frei", () => {
    setLayout("it");
    const wenig = allowedFromIntroduced(introOrder("it").slice(0, 8), "it");
    const frei = unlockedSerien(wenig, "teens", "it", "it").map((s) => s.slug);
    expect(SERIEN_IT_TEENS_1.filter((s) => frei.includes(s.slug))).toEqual([]);
  });
});
