/**
 * ★★★ WÄCHTER: die Wortspiele auf Weg „cs" (CS-W, 09.10.2026) - Lückentext, Korrekturlesen, Hand-Schwerpunkte,
 * Buchstabensalat, Alphabet-Reihen, die Geläufigkeit, dazu „Der lange Satz" und „Was fehlt?" (lesen den tschechischen Korpus)
 * und die Pyramide (Themenwortschatz und erzeugte Stufen). Vorbild: `tastenflow-wortspiele-pl.test.ts` (PL-W).
 *
 * Geprüft wird
 *  1. der INHALT nach den Hausregeln: Form, die Regeln jeder tschechischen Textzeile (`helfer/csTextRegeln.ts`), kein Geschlecht
 *     der tippenden Person, keine Anrede pane/paní, kein Deutsch/Englisch/Französisch/Spanisch/Italienisch/Polnisch, nichts aus
 *     der Sperrliste (`sperrlisteCs.ts`, Kern UND Wortbasis), keine Kopie aus den Listen der anderen Sprachen, jedes Wort im
 *     tschechischen Lexikon oder in der von Hand geprüften Liste unten, hörbare Fehler beim Korrekturlesen, ganz Tschechien -
 *     jeweils mit Gegenprobe, dass die Prüfung etwas findet;
 *  2. ganze Runden jeder Form an echten Haltestellen der tschechischen Reihenfolge auf `cs` UND `cs-qwerty` - nie ein Zeichen, das
 *     das Kind noch nicht hat, kein Háček-/Čárka-Buchstabe vor seiner Taste (`ď ť ň` vor `ˇ`, `ó` vor `´`);
 *  3. jedes erzeugte Wort jeder Form ist kein Sperrwort (Pyramiden-Anfänge, Umkehrungen, Mischungen - Leitfaden Falle 88);
 *  4. die Fehlerklasse aus E10a (Falle 19) in beide Richtungen: keine Form liefert auf „cs" still den deutschen ODER den
 *     englischen Inhalt (der englische war bis CS-W der Rückfall, RÜCKFALL-EN G2a);
 *  5. dass die Oberfläche dieser Formen tschechisch spricht.
 */
import { readFileSync, existsSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { fitText, korpusFuer } from "@/lib/typing/corpus";
import { isRealWord, normalizeWord } from "@/lib/typing/lexicon";
import { WORDS_CS, STUFE_VOCAB_CS } from "@/lib/typing/wordsCs";
import { gesperrtCs } from "@/lib/typing/sperrlisteCs";
import { fingerForChar } from "@/lib/typing/fingers";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext, Uebungsform } from "@/lib/typing/uebungsformen/typen";
import { RAETSEL_DE, RAETSEL_EN } from "@/lib/typing/uebungsformen/lueckentext";
import { RAETSEL_FR } from "@/lib/typing/uebungsformen/lueckentextFr";
import { RAETSEL_ES } from "@/lib/typing/uebungsformen/lueckentextEs";
import { RAETSEL_IT } from "@/lib/typing/uebungsformen/lueckentextIt";
import { RAETSEL_PL } from "@/lib/typing/uebungsformen/lueckentextPl";
import { RAETSEL_CS } from "@/lib/typing/uebungsformen/lueckentextCs";
import { KORREKTUR_DE, KORREKTUR_EN } from "@/lib/typing/uebungsformen/korrekturlesen";
import { KORREKTUR_FR } from "@/lib/typing/uebungsformen/korrekturlesenFr";
import { KORREKTUR_ES } from "@/lib/typing/uebungsformen/korrekturlesenEs";
import { KORREKTUR_IT } from "@/lib/typing/uebungsformen/korrekturlesenIt";
import { KORREKTUR_PL } from "@/lib/typing/uebungsformen/korrekturlesenPl";
import { KORREKTUR_CS } from "@/lib/typing/uebungsformen/korrekturlesenCs";
import { WORTKETTEN_DE, WORTKETTEN_EN } from "@/lib/typing/uebungsformen/wortkettenThemen";
import { WORTKETTEN_FR } from "@/lib/typing/uebungsformen/wortkettenFr";
import { WORTKETTEN_ES } from "@/lib/typing/uebungsformen/wortkettenEs";
import { WORTKETTEN_IT } from "@/lib/typing/uebungsformen/wortkettenIt";
import { WORTKETTEN_PL } from "@/lib/typing/uebungsformen/wortkettenPl";
import { WORTKETTEN_CS } from "@/lib/typing/uebungsformen/wortkettenCs";
import { gelaeufigkeitsZeile } from "@/lib/typing/uebungsformen/gelaeufigkeit";
import { VERBINDUNGEN_CS } from "@/lib/typing/uebungsformen/gelaeufigkeitCs";
import { SALATWOERTER_FR } from "@/lib/typing/uebungsformen/buchstabensalatFr";
import { SALATWOERTER_ES } from "@/lib/typing/uebungsformen/buchstabensalatEs";
import { SALATWOERTER_IT } from "@/lib/typing/uebungsformen/buchstabensalatIt";
import { SALATWOERTER_PL } from "@/lib/typing/uebungsformen/buchstabensalatPl";
import { SALATWOERTER_CS } from "@/lib/typing/uebungsformen/buchstabensalatCs";
import {
  SALATWOERTER_DE,
  SALATWOERTER_EN,
  SALAT_ZIEL,
  pruefeSalatwort,
  salatBuchstaben,
  salatVorrat,
  waehleSalatwort,
} from "@/lib/typing/uebungsformen/buchstabensalat";
import { SALAT_KEINE_WOERTER, SALAT_NAMEN } from "@/lib/typing/uebungsformen/salatNamen";
import { erzeugtGesperrt, korpusQuelle } from "@/lib/typing/uebungsformen/hilfen";
import { saetze as langeSaetze } from "@/lib/typing/uebungsformen/langersatz";
import { zeilenFehler } from "./helfer/csTextRegeln";

afterEach(() => setLayout("de"));

/* ── Hilfen ─────────────────────────────────────────────────────────────── */

const TSCHECHISCH = /[áčďéěíňóřšťúůýž]/;
const TSCHECHISCH_GROSS = /^[ÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/;
const TASTATUREN: readonly LayoutId[] = ["cs", "cs-qwerty"];

function woerterAus(texte: readonly string[]): string[] {
  return [...new Set(texte.flatMap((t) => t.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean)))];
}
/** Die Wörter der Sperrliste in diesen Texten (Kern UND Wortbasis - Wortspiele laufen ab 8 Jahren). */
function gesperrteWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter((w) => gesperrtCs(w));
}

/**
 * Wörter dieser Inhalte, die das tschechische Lexikon (`lexicon.ts`, Fach „cs", aus Tatoeba-Formen und `lexikonNachtragCs.ts`)
 * NICHT kennt - von Hand geprüfte Standardwörter. ⚠️ Für Tschechisch gibt es KEINEN Wörterbuch-Beleg (das macOS-Wörterbuch nimmt
 * jedes Wort an, Falle 61): belegt ist hier nur mein Sprachwissen. Beim Vorlesen werden sie buchstabiert, bis sie im Lexikon
 * stehen (Befund CS-W §4: gehören in `ERGAENZT_VON_HAND` von `scripts/erzeuge-lexikon-nachtrag-cs.mts`).
 */
const GEPRUEFT_HAND: readonly string[] = [
  // Nur der Buchstabenname (Lückentext „Buchstabe ch"): bewusst NICHT im Lexikon - als Wort gesprochen wäre er falsch, die Stimme soll ihn buchstabieren.
  "ch",
];
/** Namen und Ortsnamen, die das Lexikon nicht kennt (gebeugt, wie sie im Satz stehen). */
const GEPRUEFT_NAMEN: readonly string[] = ["amos"]; // Jan Amos Komenský: bewusst NICHT im Lexikon (ein Name darf nicht in den Buchstabensalat)

const CS_WOERTER = new Set<string>([
  ...WORDS_CS,
  ...Object.values(STUFE_VOCAB_CS).flat(),
  ...GEPRUEFT_HAND,
  ...GEPRUEFT_NAMEN,
  ...korpusFuer("cs").flatMap((c) => woerterAus([c.text])),
]);
/** Kennt das Lexikon oder die geprüfte Liste dieses Wort? */
function tschechisch(wort: string): boolean {
  const w = wort.toLowerCase();
  return CS_WOERTER.has(w) || isRealWord(w, "cs");
}
function unbekannteWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter((w) => w.length >= 2 && !tschechisch(w));
}
/** Ein Wort, das es im Deutschen, Englischen, Französischen, Spanischen, Italienischen oder Polnischen gibt, im Tschechischen nicht. */
function fremdesWort(wort: string): boolean {
  const w = wort.toLowerCase();
  if (w.length < 3 || tschechisch(w)) return false;
  return ["de", "en", "fr", "es", "it", "pl"].some((l) => isRealWord(w, l as "de"));
}
function fremdeWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter(fremdesWort);
}

/**
 * Geschlecht der tippenden Person (Glossar §1 Nr. 2): das l-Partizip mit `jsem/jsi/jsme/jste` (udělal jsem / udělala jsem), der
 * Konditional (bych, bys, bychom, byste), `jsem/jsi` + Adjektiv (jsem unavený/unavená) und `rád/ráda`, `sám/sama`.
 */
const IMMER_MIT_GESCHLECHT = new Set(["bych", "bys", "bychom", "byste", "bysme", "rád", "ráda", "rádi", "rády", "sám", "sama", "sami", "samy"]);
const HILFSVERB = new Set(["jsem", "jsi", "jsme", "jste", "seš", "jsou"]);
function geschlechtFehler(zeile: string): boolean {
  const w = zeile.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
  if (w.some((x) => IMMER_MIT_GESCHLECHT.has(x))) return true;
  const ichDu = w.some((x) => HILFSVERB.has(x) && x !== "jsou");
  if (!ichDu) return false;
  if (w.some((x) => /^\p{L}{2,}(l|la|lo|li|ly)$/u.test(x) && !/^(stůl|kůl|sůl|dál|škola|škole)$/.test(x))) return true;
  return w.some((x, i) => HILFSVERB.has(x) && /(ý|á|í|é|ný|ná|ená|aná)$/.test(w[i + 1] ?? ""));
}
const ANREDE = /(?<!\p{L})(pan|pane|paní|slečno|slečna)(?!\p{L})/iu;

/** Deterministischer Zufall (mulberry32). */
function zufall(saat: number): () => number {
  let a = (saat * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ALLE_SAETZE = [...RAETSEL_CS.map((r) => r.satz), ...KORREKTUR_CS.map((f) => f.satz)];

describe("★ Sperrliste, Wortprüfung, Textregeln selbst (Gegenproben)", () => {
  it("die Sperrliste fängt Kern UND Wortbasis und lässt harmlose Verwandte stehen", () => {
    expect(gesperrteWoerter(["To je hovno.", "Je to blbost.", "Ty jsi hloupý!"])).toEqual(["hovno", "blbost", "hloupý"]);
    expect(gesperrteWoerter(["Kniha leží v knihovně.", "Sedím na židli."])).toEqual([]);
  });
  it("ein deutscher, englischer oder polnischer Satz fiele auf", () => {
    expect(fremdeWoerter(["Die Katze fängt gerne Mäuse."]).length).toBeGreaterThan(0);
    expect(fremdeWoerter(["The children play outside."]).length).toBeGreaterThan(0);
    expect(fremdeWoerter(["Dzieci bawią się na podwórku."]).length).toBeGreaterThan(0);
  });
  it("ein erfundenes Wort fiele als unbekannt auf", () => {
    expect(unbekannteWoerter(["Kočka jí kvížmrdlík."])).toEqual(["kvížmrdlík"]);
  });
  it("Geschlecht und Anrede: die Prüfung findet, was sie finden soll", () => {
    for (const z of ["Včera jsem to udělal.", "Byla jsi v kině?", "Jsem unavená.", "Chtěl bych zmrzlinu.", "Mám ho rád.", "Udělali jsme to sami."])
      expect(geschlechtFehler(z), z).toBe(true);
    for (const z of ["Anička to udělala.", "Jsem ve škole.", "Myju si ruce.", "Louis Braille se narodil ve Francii.", "Babička peče koláč."])
      expect(geschlechtFehler(z), z).toBe(false);
    expect(ANREDE.test("Paní učitelko, mám otázku.")).toBe(true);
    expect(ANREDE.test("Panenka spí v posteli.")).toBe(false);
  });
});

describe("★ Die Handliste ist genau die Liste für den Lexikon-Nachtrag", () => {
  it("jedes Wort der Handliste kommt im Inhalt vor und fehlt wirklich im Lexikon (keine Leiche, kein Doppel)", () => {
    const inhalt = new Set(
      woerterAus([
        ...RAETSEL_CS.flatMap((r) => [r.satz, ...r.loesungen]),
        ...KORREKTUR_CS.flatMap((f) => [f.satz, f.richtig]),
        ...WORTKETTEN_CS.flatMap((k) => k.woerter),
        ...VERBINDUNGEN_CS.flatMap((v) => v.woerter),
        "napíšeš", // Oberfläche (Ankündigung einer Form) - geprüft im letzten Block
      ]),
    );
    expect([...GEPRUEFT_HAND, ...GEPRUEFT_NAMEN].filter((w) => !inhalt.has(w))).toEqual([]);
    expect([...GEPRUEFT_HAND, ...GEPRUEFT_NAMEN].filter((w) => isRealWord(w, "cs"))).toEqual([]);
    expect(new Set([...GEPRUEFT_HAND, ...GEPRUEFT_NAMEN]).size).toBe(GEPRUEFT_HAND.length + GEPRUEFT_NAMEN.length);
  });
});

describe("★ Jeder Satz der Wortspiele besteht die Regeln jeder tschechischen Textzeile", () => {
  it("zeilenFehler (Zeichen der Tastatur, Leerzeichen, kein Ů, kein ů am Wortanfang, Sperrwort-Kern)", () => {
    // Die Lücke „..." ist kein getippter Text (die Anzeige macht sie) - geprüft wird der Satz mit einem Wort an ihrer Stelle.
    const fehler = ALLE_SAETZE.flatMap((s) => zeilenFehler(s.replace("...", "slovo")).map((f) => `${s}: ${f}`));
    expect(fehler).toEqual([]);
  });
  it("kein Geschlecht der tippenden Person, keine Anrede pane/paní/slečno", () => {
    expect(ALLE_SAETZE.filter(geschlechtFehler)).toEqual([]);
    expect(ALLE_SAETZE.filter((s) => ANREDE.test(s))).toEqual([]);
  });
});

/* ── 1. Lückentext ──────────────────────────────────────────────────────── */

describe("★ Lückentext (Doplň slovo)", () => {
  const alleTexte = RAETSEL_CS.flatMap((r) => [r.satz, ...r.loesungen]);

  it("genug Rätsel, jedes mit genau einer Lücke und mindestens einer Lösung", () => {
    expect(RAETSEL_CS.length).toBeGreaterThanOrEqual(200);
    for (const r of RAETSEL_CS) {
      expect(r.satz.split("...").length - 1, r.satz).toBe(1);
      expect(r.loesungen.length, r.satz).toBeGreaterThan(0);
      expect(new Set(r.loesungen).size, r.satz).toBe(r.loesungen.length);
      expect(r.stufen.length, r.satz).toBeGreaterThan(0);
    }
  });

  it("jede Lösung ist EIN Wort aus tschechischen Buchstaben - ohne grossen Akzentbuchstaben am Anfang, ohne ů am Anfang, ohne Ů", () => {
    const pruefe = (l: string) => !/^[A-Za-záčďéěíňóřšťúůýž]+$/.test(l) || TSCHECHISCH_GROSS.test(l) || /^ů/.test(l);
    expect(RAETSEL_CS.flatMap((r) => r.loesungen).filter(pruefe)).toEqual([]);
    expect(["Česko", "ůl", "Ů", "dva slova", "Łódź"].filter(pruefe)).toHaveLength(5); // Gegenprobe
  });

  it("jeder Satz ist nur einmal da, keiner stammt aus den Listen der anderen Sprachen", () => {
    const saetze = RAETSEL_CS.map((r) => r.satz);
    expect(saetze.filter((s, i) => saetze.indexOf(s) !== i)).toEqual([]);
    const fremd = new Set([...RAETSEL_DE, ...RAETSEL_EN, ...RAETSEL_FR, ...RAETSEL_ES, ...RAETSEL_IT, ...RAETSEL_PL].map((r) => r.satz));
    expect(saetze.filter((s) => fremd.has(s))).toEqual([]);
  });

  it("ganz Tschechien: Böhmen, Mähren und Schlesien", () => {
    const text = alleTexte.join(" ");
    for (const ort of [
      // Böhmen
      "Praha", "Krkonoších", "Šumavě", "Liberec", "Jičín", "Karlovy Vary", "Krumlov", "Třeboně", "Kutné Hoře", "Chodsku",
      "Pardubicích", "Hradec Králové", "Mělníka",
      // Mähren
      "Brno", "Brně", "Olomouci", "Hané", "Valašsku", "Slovácku", "Lednici", "Moravském krasu", "Zlín", "Vysočině", "Beskydech",
      // Schlesien
      "Ostrava", "Slezsku", "Opava", "Jeseníků", "Ostravsku",
    ])
      expect(text, ort).toContain(ort);
  });

  it("regionale Varianten: ALLE Formen zählen (brambory/zemáky/erteple, autobus/tramvaj/šalinu, děvče/cérka …)", () => {
    const hat = (...formen: string[]) => RAETSEL_CS.some((r) => formen.every((f) => r.loesungen.includes(f)));
    expect(hat("brambory", "zemáky", "erteple")).toBe(true);
    expect(hat("autobus", "tramvaj", "šalinu")).toBe(true);
    expect(hat("děvče", "cérka")).toBe(true);
    expect(hat("nohou", "nohách")).toBe(true);
    expect(hat("vitamínů", "vitaminů")).toBe(true);
    expect(hat("rybníce", "rybníku")).toBe(true);
    // die Regionalwörter selbst als Lösung
    const loesungen = new Set(RAETSEL_CS.flatMap((r) => r.loesungen));
    for (const w of ["šalina", "zemáky", "rožek", "paradajka", "ogar", "frgály"]) expect(loesungen.has(w), w).toBe(true);
    expect(RAETSEL_CS.filter((r) => r.loesungen.length > 1).length).toBeGreaterThanOrEqual(60);
  });

  it("Háček und Čárka in der Lösung: genug Rätsel, darunter die kleinen Wörter, die ohne sie ein anderes Wort sind", () => {
    const mit = RAETSEL_CS.filter((r) => r.loesungen.some((l) => TSCHECHISCH.test(l)));
    expect(mit.length).toBeGreaterThanOrEqual(80);
    const loesungen = new Set(RAETSEL_CS.flatMap((r) => r.loesungen));
    for (const w of ["že", "už", "teď", "kůň", "má", "spí", "pět", "čtyři", "řeka", "úterý", "září", "loďka", "gól", "labuť"])
      expect(loesungen.has(w), w).toBe(true);
    // jeder der fünfzehn Buchstaben kommt in mindestens einer Lösung vor
    for (const b of "áčďéěíňóřšťúůýž") expect([...loesungen].some((l) => l.includes(b)), b).toBe(true);
  });

  it("keine Wörter der Sperrliste, keine fremden Wörter, jedes Wort tschechisch", () => {
    expect(gesperrteWoerter(alleTexte)).toEqual([]);
    expect(fremdeWoerter(alleTexte)).toEqual([]);
    expect(unbekannteWoerter(alleTexte)).toEqual([]);
  });
});

/* ── 2. Korrekturlesen ──────────────────────────────────────────────────── */

/**
 * Ein grober LAUTSCHLÜSSEL für Tschechisch: was hier gleich wird, hört eine Sprachausgabe nicht als verschieden - i/y, í/ý,
 * ú/ů, dě tě ně = ďe ťe ňe, di ti ni = ďi ťi ňi, mě = mňe, bě pě vě fě = bje pje vje fje, und die Stimmangleichung: am Wortende
 * und vor einem stimmlosen Mitlaut wird b d ď g h v z ž zu p t ť k ch f s š (vor einem stimmhaften umgekehrt, ausser vor v).
 */
const STIMMHAFT: Record<string, string> = { b: "p", d: "t", ď: "ť", g: "k", h: "χ", v: "f", z: "s", ž: "š" };
const STIMMLOS: Record<string, string> = Object.fromEntries(Object.entries(STIMMHAFT).map(([a, b]) => [b, a]));
function lautschluessel(wort: string): string {
  let w = wort.toLowerCase();
  w = w.replace(/ch/g, "χ").replace(/y/g, "i").replace(/ý/g, "í").replace(/ů/g, "ú");
  w = w.replace(/dě/g, "ďe").replace(/tě/g, "ťe").replace(/ně/g, "ňe").replace(/mě/g, "mňe").replace(/([bpvf])ě/g, "$1je");
  w = w.replace(/d(?=[ií])/g, "ď").replace(/t(?=[ií])/g, "ť").replace(/n(?=[ií])/g, "ň");
  const z = [...w];
  for (let i = z.length - 1; i >= 0; i--) {
    const naechster = z[i + 1];
    if (naechster === undefined || STIMMLOS[naechster] !== undefined || ["c", "č", "s", "š", "k", "p", "t", "ť", "f", "χ"].includes(naechster)) {
      if (STIMMHAFT[z[i]]) z[i] = STIMMHAFT[z[i]];
    } else if (STIMMHAFT[naechster] !== undefined && naechster !== "v" && STIMMLOS[z[i]]) {
      z[i] = STIMMLOS[z[i]];
    }
  }
  return z.join("");
}
function hoerbar(falsch: string, richtig: string): boolean {
  return lautschluessel(falsch) !== lautschluessel(richtig);
}

describe("★ Korrekturlesen (Oprav chybu)", () => {
  it("genug Fälle; das falsche Wort steht im Satz, das richtige ist ein anderes", () => {
    expect(KORREKTUR_CS.length).toBeGreaterThanOrEqual(38);
    for (const f of KORREKTUR_CS) {
      expect(f.satz.split(/[^\p{L}]+/u), f.satz).toContain(f.falsch);
      expect(f.falsch).not.toBe(f.richtig);
      expect(f.richtig, f.satz).toMatch(/^[a-záčďéěíňóřšťúůýž]+$/);
    }
  });

  it("der Fehler ist HÖRBAR - auch mit i/y, ú/ů, dě/ďe und Stimmangleichung", () => {
    expect(KORREKTUR_CS.filter((f) => !hoerbar(f.falsch, f.richtig)).map((f) => `${f.falsch}/${f.richtig}`)).toEqual([]);
  });

  it("Gegenprobe: Gleichklang-Paare fielen auf, Paare mit anderem Laut nicht", () => {
    for (const [a, b] of [["byl", "bil"], ["mi", "my"], ["výr", "vír"], ["led", "let"], ["had", "hat"], ["loďka", "loťka"], ["kůl", "kúl"], ["dělo", "ďelo"], ["vůz", "vůs"], ["pod", "pot"]])
      expect(hoerbar(a, b), `${a}/${b}`).toBe(false);
    for (const [a, b] of [["ze", "že"], ["mys", "myš"], ["pas", "pás"], ["vila", "víla"], ["být", "byt"], ["ruce", "řece"], ["dal", "dál"], ["kos", "koš"]])
      expect(hoerbar(a, b), `${a}/${b}`).toBe(true);
  });

  it("einige Fälle üben Háček und Čárka (ohne sie ein anderes Wort: že, myš, pás, víla, byt …)", () => {
    const ohne = (w: string) => w.normalize("NFD").replace(/[̀-ͯ]/g, "");
    const nurZeichen = KORREKTUR_CS.filter((f) => ohne(f.falsch) === ohne(f.richtig));
    expect(nurZeichen.length).toBeGreaterThanOrEqual(6);
  });

  it("das falsche Wort ist ein echtes tschechisches Wort", () => {
    expect(KORREKTUR_CS.filter((f) => !tschechisch(f.falsch)).map((f) => f.falsch)).toEqual([]);
  });

  it("keine Sperrwörter, keine fremden oder unbekannten Wörter, keine Kopie", () => {
    const texte = KORREKTUR_CS.flatMap((f) => [f.satz, f.richtig]);
    expect(gesperrteWoerter(texte)).toEqual([]);
    expect(fremdeWoerter(texte)).toEqual([]);
    expect(unbekannteWoerter(texte)).toEqual([]);
    const fremd = new Set([...KORREKTUR_DE, ...KORREKTUR_EN, ...KORREKTUR_FR, ...KORREKTUR_ES, ...KORREKTUR_IT, ...KORREKTUR_PL].map((f) => f.satz));
    expect(KORREKTUR_CS.filter((f) => fremd.has(f.satz))).toEqual([]);
  });
});

/* ── 3. Hand-Schwerpunkte: die Wortketten ───────────────────────────────── */

const SCHIMPF_TIERE = ["kráva", "prase", "osel", "opice", "husa", "slepice", "krysa", "koza", "kozel", "tele", "beran", "hroch", "velryba", "vůl", "dobytek", "vepř"];

describe("★ Hand-Schwerpunkte: die Wortketten (Levá ruka, pravá ruka)", () => {
  const alle = [...new Set(WORTKETTEN_CS.flatMap((k) => k.woerter))];

  it("jede Kette hat mindestens zwölf Wörter, klein, ohne Doppelte, ohne Totasten-Buchstaben (ď ť ň ó)", () => {
    expect(WORTKETTEN_CS.length).toBeGreaterThanOrEqual(14);
    for (const k of WORTKETTEN_CS) {
      expect(k.woerter.length, k.thema).toBeGreaterThanOrEqual(12);
      expect(new Set(k.woerter).size, k.thema).toBe(k.woerter.length);
      for (const w of k.woerter) expect(w, k.thema).toMatch(/^[a-záčéěířšúůýž]+$/);
    }
  });

  for (const tastatur of TASTATUREN) {
    it(`${tastatur}: für beide Hände je mindestens zwölf einhändige Wörter`, () => {
      setLayout(tastatur);
      for (const hand of ["links", "rechts"] as const) {
        const einhaendig = alle.filter((w) => [...w].every((c) => fingerForChar(c)?.hand === hand));
        expect(einhaendig.length, `${tastatur} ${hand}: ${einhaendig.join(" ")}`).toBeGreaterThanOrEqual(12);
      }
    });
  }

  it("keine Sperrwörter, keine fremden oder unbekannten Wörter, kein Tiername als Schimpfwort, kein Thema kopiert", () => {
    expect(gesperrteWoerter(alle)).toEqual([]);
    expect(fremdeWoerter(alle)).toEqual([]);
    expect(unbekannteWoerter(alle)).toEqual([]);
    expect(alle.filter((w) => SCHIMPF_TIERE.includes(w))).toEqual([]);
    for (const k of WORTKETTEN_CS)
      for (const fremd of [...WORTKETTEN_DE, ...WORTKETTEN_EN, ...WORTKETTEN_FR, ...WORTKETTEN_ES, ...WORTKETTEN_IT, ...WORTKETTEN_PL]) {
        const gleich = k.woerter.filter((w) => fremd.woerter.map((x) => x.toLowerCase()).includes(w));
        expect(gleich.length, `${k.thema} ~ ${fremd.thema}: ${gleich.join(" ")}`).toBeLessThan(k.woerter.length / 2);
      }
  });
});

/* ── 4. Geläufigkeit ────────────────────────────────────────────────────── */

describe("★ Geläufigkeit: die Verbindungen (gelaeufigkeitCs.ts aus F5-F8)", () => {
  const alle = VERBINDUNGEN_CS.flatMap((v) => v.woerter);

  it("keine Sperrwörter, kein Tiername als Schimpfwort, keine fremden oder unbekannten Wörter", () => {
    expect(gesperrteWoerter(alle)).toEqual([]);
    expect(alle.filter((w) => SCHIMPF_TIERE.includes(w))).toEqual([]);
    expect(fremdeWoerter(alle)).toEqual([]);
    expect(unbekannteWoerter(alle)).toEqual([]);
  });

  for (const tastatur of TASTATUREN) {
    it(`${tastatur}: vor ř keine Zeile mit ř, vor ˇ keine mit ď ť ň - mit vollem Stand kommen sie, jede Zeile tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("cs");
      const zeilen = (bis: number) => {
        const erlaubt = new Set(reihenfolge.slice(0, bis).filter((u) => u !== SHIFT_UNIT));
        const out: string[] = [];
        for (let s = 1; s <= 300; s++) {
          const z = gelaeufigkeitsZeile(erlaubt, { stufe: "teens", lang: "cs", zufall: zufall(s), lernweg: "cs" });
          if (z) out.push(z.text);
        }
        return { erlaubt, out };
      };
      const vorR = zeilen(reihenfolge.indexOf("ř"));
      expect(vorR.out.length).toBeGreaterThan(0);
      expect(vorR.out.filter((t) => /[řďťňó]/.test(t))).toEqual([]);
      const voll = zeilen(reihenfolge.length);
      expect(voll.out.some((t) => /ř/.test(t)), "eine Zeile mit ř").toBe(true);
      expect(voll.out.some((t) => /ž/.test(t)), "eine Zeile mit ž").toBe(true);
      for (const t of voll.out) expect(fitText(t, voll.erlaubt, "cs"), t).toBe(t);
    });
  }
});

/* ── 5. Buchstabensalat ─────────────────────────────────────────────────── */

describe("★ Buchstabensalat (Přeházená písmena)", () => {
  it(`jedes Quellwort gibt mindestens ${SALAT_ZIEL} echte Wörter her und steht selbst im Lexikon`, () => {
    expect(SALATWOERTER_CS.length).toBeGreaterThanOrEqual(100);
    for (const sw of SALATWOERTER_CS) {
      expect(sw.wort).toMatch(/^[a-záčďéěíňóřšťúůýž]+$/);
      expect(isRealWord(sw.wort, "cs"), sw.wort).toBe(true);
      expect(salatVorrat(sw.wort, "cs").length, sw.wort).toBeGreaterThanOrEqual(SALAT_ZIEL);
    }
  });

  it("kurze Wörter für alle, lange (ab 8 Buchstaben) erst ab den Jugendlichen", () => {
    for (const sw of SALATWOERTER_CS) expect(sw.stufen.includes("kids"), sw.wort).toBe(sw.wort.length <= 7);
  });

  it("kein Quellwort aus den Listen der anderen Sprachen, keines doppelt, keines gesperrt, kein Schimpf-Tiername", () => {
    const woerter = SALATWOERTER_CS.map((s) => s.wort);
    expect(new Set(woerter).size).toBe(woerter.length);
    const fremd = new Set(
      [...SALATWOERTER_DE, ...SALATWOERTER_EN, ...SALATWOERTER_FR, ...SALATWOERTER_ES, ...SALATWOERTER_IT, ...SALATWOERTER_PL].map((s) => s.wort.toLowerCase()),
    );
    expect(woerter.filter((w) => fremd.has(w))).toEqual([]);
    expect(gesperrteWoerter(woerter)).toEqual([]);
    expect(woerter.filter((w) => SCHIMPF_TIERE.includes(w))).toEqual([]);
  });

  it("kein Name, keine Abkürzung und kein Sperrwort unter den Funden", () => {
    const funde = new Set(SALATWOERTER_CS.flatMap((sw) => salatVorrat(sw.wort, "cs")));
    for (const n of [...SALAT_NAMEN.cs, ...SALAT_KEINE_WOERTER.cs]) expect(funde.has(n), n).toBe(false);
    expect([...funde].filter((w) => gesperrtCs(w))).toEqual([]);
    expect([...funde].filter((w) => SCHIMPF_TIERE.includes(w))).toEqual([]);
  });

  it("Gegenprobe: ohne die Listen stünden Namen, Schreibungen ohne Čárka und Ausrufe unter den Funden", () => {
    expect(SALAT_KEINE_WOERTER.cs.has("ja")).toBe(true);
    expect(pruefeSalatwort("ja", "jablko", [], "cs")).toEqual({ ok: false, grund: "kein-wort" });
    expect(pruefeSalatwort("ted", "deštník", [], "cs").ok).toBe(false);
    expect(pruefeSalatwort("Ema", "medaile", [], "cs")).toEqual({ ok: false, grund: "name" });
    expect(pruefeSalatwort("les", "postel", [], "cs").ok).toBe(true);
    expect(pruefeSalatwort("oko", "kohout", [], "cs").ok).toBe(true);
    // Háček und Čárka machen einen eigenen Buchstaben: „pás" passt nicht in einen Vorrat ohne „á".
    expect(pruefeSalatwort("pás", "pastelky", [], "cs").ok).toBe(false);
    expect(pruefeSalatwort("pes", "pastelky", [], "cs").ok).toBe(true);
    expect(SALAT_NAMEN.cs).not.toBe(SALAT_NAMEN.en);
    expect(SALAT_KEINE_WOERTER.cs).not.toBe(SALAT_KEINE_WOERTER.en);
  });

  it("die Buchstaben-Anzeige ist das Quellwort, sortiert - Háček und Čárka bleiben stehen", () => {
    expect(salatBuchstaben("hruška", "cs")).toContain("š");
    expect(salatBuchstaben("polštář", "cs")).toContain("ř");
    expect(salatBuchstaben("polštář", "cs")).toContain("á");
  });
});

/** Namen aus der macOS-Liste, die unter den Funden stehen und trotzdem gewöhnliche tschechische Wörter sind. */
const ERLAUBT_CS: readonly string[] = ["tran", "kari", "lana", "len", "les", "mat", "no", "pat", "po", "rod", "stan", "ti", "tom", "van"];
const NAMENSLISTE = "/usr/share/dict/propernames";
describe.skipIf(!existsSync(NAMENSLISTE))("★ Buchstabensalat: kein neuer Name im Vorrat", () => {
  it("jeder Treffer aus der Namensliste ist bewusst erlaubt", () => {
    const namen = new Set(readFileSync(NAMENSLISTE, "utf8").split("\n").map((w) => normalizeWord(w)));
    const funde = new Set(SALATWOERTER_CS.flatMap((sw) => salatVorrat(sw.wort, "cs")));
    expect([...funde].filter((w) => namen.has(w) && !ERLAUBT_CS.includes(w))).toEqual([]);
  });
});

/* ── 6. Alphabet-Reihen ─────────────────────────────────────────────────── */

describe("★ Alphabet-Reihen auf „cs“: č ř š ž und ch gehören dazu", () => {
  const form = UEBUNGSFORMEN.find((f) => f.id === "alphabetreihen")!;
  const ctx = (bis: number, shift = false): FormKontext => ({
    lernweg: "cs", introduced: introOrder("cs").slice(0, bis), shift, oneHand: false, stufe: "kids", lang: "cs",
    count: 40, zufall: zufall(3),
  });

  it("die Reihenfolge ist die, nach der Tschechisch sortiert (Intl.Collator „cs“: ch hinter h, Háček-Buchstaben eigene)", () => {
    const abeceda = ["a", "b", "c", "č", "d", "e", "f", "g", "h", "ch", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "ř", "s", "š", "t", "u", "v", "w", "x", "y", "z", "ž"];
    const sortiert = [...abeceda].reverse().sort(new Intl.Collator("cs").compare);
    expect(sortiert).toEqual(abeceda);
    // Gegenprobe: die Čárka-Vokale und ď ť ň sortieren mit ihrem Grundbuchstaben (darum nicht in der Reihe)
    expect(new Intl.Collator("cs", { sensitivity: "base" }).compare("á", "a")).toBe(0);
    expect(new Intl.Collator("cs", { sensitivity: "base" }).compare("ď", "d")).toBe(0);
    expect(new Intl.Collator("cs", { sensitivity: "base" }).compare("č", "c")).not.toBe(0);
  });

  for (const tastatur of TASTATUREN) {
    it(`${tastatur}: nach der Grundreihe läuft die Form schon - ohne Háček-Buchstaben`, () => {
      setLayout(tastatur);
      expect(form.taugt(ctx(8))).toBe(true);
      const text = form.baue!(ctx(8))!.zeilen.map((z) => z.text).join(" ");
      expect(text).not.toMatch(TSCHECHISCH);
      expect(text).toContain("adf");
    });

    it(`${tastatur}: mit allen Buchstaben stehen č ř š ž hinter ihrem Grundbuchstaben und ch hinter h - gross „Ch“, nie „CH“`, () => {
      setLayout(tastatur);
      const voll = introOrder("cs").length;
      const runde = form.baue!(ctx(voll, true))!;
      expect(runde.zeilen.length).toBeGreaterThanOrEqual(20);
      const roh = runde.zeilen.map((z) => z.text).join(" ");
      const text = roh.toLowerCase();
      for (const b of ["čde", "chij", "sšt", "qrř"]) expect(text, b).toContain(b);
      expect(roh).toMatch(/Ch/);
      expect(roh).not.toMatch(/CH/);
      const erlaubt = new Set(introOrder("cs"));
      for (const z of runde.zeilen) expect(fitText(z.text, erlaubt, "cs", "cs"), z.text).toBe(z.text);
    });

    it(`${tastatur}: vor č steht in den Reihen kein č, vor h kein ch`, () => {
      setLayout(tastatur);
      const o = introOrder("cs");
      const vorC = form.baue!(ctx(o.indexOf("č")))!.zeilen.map((z) => z.text).join(" ");
      expect(vorC).not.toMatch(/č/i);
      const vorH = form.baue?.(ctx(o.indexOf("h")))?.zeilen.map((z) => z.text).join(" ") ?? "";
      expect(vorH).not.toMatch(/ch/i);
      const mitH = form.baue!(ctx(o.indexOf("h") + 1))!.zeilen.map((z) => z.text).join(" ");
      expect(mitH).toMatch(/hch|h ch/);
    });
  }
});

/* ── 7. Der lange Satz / Was fehlt? lesen den tschechischen Korpus ─────────── */

describe("★ Der lange Satz und Was fehlt? lesen den tschechischen Korpus", () => {
  it("korpusQuelle('cs') ist der tschechische Korpus", () => {
    expect(korpusQuelle("cs")).toEqual(korpusFuer("cs"));
    expect(korpusQuelle("cs").length).toBeGreaterThan(0);
  });

  it("„Der lange Satz“ nimmt nur tschechische Zeilen", () => {
    setLayout("cs");
    const ctx: FormKontext = { lernweg: "cs", introduced: introOrder("cs"), shift: true, oneHand: false, stufe: "erwachsen", lang: "cs", count: 8, zufall: zufall(1) };
    const eigene = new Set(korpusFuer("cs").map((c) => c.text));
    expect(langeSaetze(ctx).filter((s) => !eigene.has(s))).toEqual([]);
  });
});

/* ── 8. Pyramide und alle erzeugten Wörter: tschechisch, nie gesperrt ──────── */

const FORMEN = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "langersatz", "wasfehlt", "alphabetreihen"];
const PFLICHT = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "alphabetreihen"];

/** Alle Texte einer Runde: Frage, Frageteile, Antworten, Zeilen, Salat-Quellwort. */
function texteDerRunde(form: Uebungsform, c: FormKontext): string[] {
  const texte: string[] = [];
  if (!form.taugt(c)) return texte;
  if (form.eigenerBildschirm === "buchstabensalat") {
    const q = waehleSalatwort(c);
    if (q) texte.push(q, ...salatVorrat(q, "cs"));
  } else if (form.fragen) {
    for (const a of form.fragen(c)) texte.push(a.frage, ...(a.frageTeile?.map((t) => t.text) ?? []), ...a.antworten);
  } else if (form.baue) {
    for (const z of form.baue(c)?.zeilen ?? []) texte.push(z.text);
  }
  return texte;
}

describe("★ Pyramide auf „cs“ und jedes erzeugte Wort jeder Form", () => {
  it("jedes Wort einer Pyramide ist tschechisch (vier Samen, zwei Stufen)", () => {
    setLayout("cs");
    const pyramide = UEBUNGSFORMEN.find((f) => f.id === "pyramide")!;
    const quelle = new Set([...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat()].map((w) => w.toLowerCase()));
    const fehler: string[] = [];
    for (const stufe of ["kids", "teens"] as const)
      for (const samen of [1, 7, 42, 99]) {
        const runde = pyramide.baue!({ lernweg: "cs", introduced: introOrder("cs"), shift: true, oneHand: false, stufe, lang: "cs", count: 8, zufall: zufall(samen) });
        for (const z of runde?.zeilen ?? [])
          for (const w of z.text.toLowerCase().split(/\s+/).map((x) => x.replace(/[.,!?]/g, "")).filter(Boolean))
            if (z.art !== "text" && !quelle.has(w) && ![...quelle].some((q) => q.startsWith(w))) fehler.push(`fremd: ${w}`);
      }
    expect(fehler).toEqual([]);
  });

  for (const tastatur of TASTATUREN) {
    it(`${tastatur}: kein erzeugtes Wort irgendeiner Form ist ein Sperrwort (viele Stände, Stufen, Samen)`, () => {
      setLayout(tastatur);
      const o = introOrder("cs");
      const fehler = new Set<string>();
      for (const bis of [12, 17, 22, 26, 31, 34, 37, 41, 45, o.length]) {
        const introduced = o.slice(0, bis);
        for (const stufe of ["kids", "teens", "erwachsen"] as const)
          for (const samen of [1, 2, 3, 5, 8, 13]) {
            const c: FormKontext = { lernweg: "cs", introduced, shift: introduced.includes(SHIFT_UNIT), oneHand: false, stufe, lang: "cs", count: 10, zufall: zufall(samen * 100 + bis) };
            for (const form of UEBUNGSFORMEN)
              for (const w of woerterAus(texteDerRunde(form, c))) if (w.length >= 2 && gesperrtCs(w)) fehler.add(`${form.id}: ${w}`);
          }
      }
      expect([...fehler]).toEqual([]);
    });
  }

  it("erzeugtGesperrt kennt Tschechisch - und nur dort (die anderen Wege bleiben Byte für Byte)", () => {
    expect(erzeugtGesperrt("cs", "blbec")).toBe(true);
    expect(erzeugtGesperrt("cs", "hovno")).toBe(true);
    expect(erzeugtGesperrt("cs", "knihovna")).toBe(false);
    for (const l of ["de", "en", "fr", "es"] as const) expect(erzeugtGesperrt(l, "hovno"), l).toBe(false);
  });
});

/* ── 9. Ganze Runden an Haltestellen der tschechischen Reihenfolge ─────────── */

function getippt(form: Uebungsform, c: FormKontext, fehler: string[], wo: string): string[] {
  if (form.eigenerBildschirm === "buchstabensalat") {
    const q = waehleSalatwort(c);
    return q ? [q] : [];
  }
  if (form.fragen) {
    const aufgaben = form.fragen(c);
    if (aufgaben.length < 5) fehler.push(`${wo}: nur ${aufgaben.length} Aufgaben`);
    return aufgaben.flatMap((a) => a.antworten);
  }
  return form.baue?.(c)?.zeilen.map((z) => z.text) ?? [];
}

/** Welche Einheit(en) ein Buchstabe braucht: ď ť ň die Totaste ˇ, ó die Totaste ´, alle anderen sich selbst. */
function brauchtEinheiten(ch: string): string[] {
  if ("ďťň".includes(ch)) return ["ˇ", { ď: "d", ť: "t", ň: "n" }[ch]!];
  if (ch === "ó") return ["´", "o"];
  return [ch];
}

describe("★★★ Eine Runde je Form: nie ein Zeichen, das das Kind noch nicht hat", () => {
  for (const tastatur of TASTATUREN) {
    it(`${tastatur}: jede angebotene Form liefert Aufgaben, alles Getippte ist tippbar, kein Háček-/Čárka-Buchstabe vor seiner Taste`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("cs");
      const ab = (u: string) => reihenfolge.indexOf(u) + 1;
      const fehler: string[] = [];
      const angeboten = new Set<string>();
      const gesehen = new Set<string>();
      const stellen = [8, 12, 17, ab("ě"), ab("í"), ab("á"), ab("ž"), ab("š"), ab("ř"), ab("č"), ab("é"), ab("ý"), ab("ˇ"), ab("ú"), ab("´"), 45, reihenfolge.length];
      for (const bis of stellen) {
        const introduced = reihenfolge.slice(0, bis);
        const erlaubt = new Set(introduced.filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens"] as const) {
          for (const form of UEBUNGSFORMEN.filter((f) => FORMEN.includes(f.id))) {
            const ctx: FormKontext = {
              lernweg: "cs", introduced, shift: introduced.includes(SHIFT_UNIT), oneHand: false, stufe, lang: "cs", count: 8, zufall: zufall(bis),
            };
            if (!form.taugt(ctx)) continue;
            angeboten.add(form.id);
            const wo = `${form.id} ${bis}/${stufe}`;
            const texte = getippt(form, { ...ctx, zufall: zufall(bis + 1) }, fehler, wo);
            if (texte.length === 0) fehler.push(`${wo}: nichts zu tippen`);
            for (const t of texte) {
              if (fitText(t, erlaubt, "cs", "cs") === null) fehler.push(`${wo}: „${t}"`);
              if (/Ů/.test(t)) fehler.push(`${wo}: Ů „${t}"`);
              for (const ch of t.toLowerCase()) {
                if (!TSCHECHISCH.test(ch)) continue;
                gesehen.add(ch);
                if (!brauchtEinheiten(ch).every((u) => erlaubt.has(u))) fehler.push(`${wo}: ${ch} vor seiner Taste „${t}"`);
              }
            }
          }
        }
      }
      expect(fehler).toEqual([]);
      for (const id of PFLICHT) expect([...angeboten], id).toContain(id);
      for (const b of "áčéěířšúůýž") expect([...gesehen], `nach seiner Taste kommt auch ${b}`).toContain(b);
    });
  }
});

/* ── 10. Die Fehlerklasse: keine Form liefert auf „cs" still Deutsch oder Englisch ── */

const ALLE_TASTEN = [...new Set([...introOrder("cs"), ..."abcdefghijklmnopqrstuvwxyz", ..."äöüß", SHIFT_UNIT])];
function ctxVoll(lang: "de" | "en" | "cs", samen: number): FormKontext {
  return { lernweg: lang, introduced: ALLE_TASTEN, shift: true, oneHand: false, stufe: "teens", lang, count: 8, zufall: zufall(samen) };
}
function inhaltsWoerter(form: Uebungsform, c: FormKontext): Set<string> {
  const texte: string[] = [];
  if (!form.taugt(c)) return new Set();
  if (form.fragen) {
    for (const aufgabe of form.fragen(c)) {
      const teile = aufgabe.frageTeile?.filter((t) => t.inhalt).map((t) => t.text);
      texte.push(...(teile ?? [aufgabe.frage]), ...aufgabe.antworten);
    }
  } else if (form.baue) {
    for (const zeile of form.baue(c)?.zeilen ?? []) texte.push(zeile.text);
  } else if (form.eigenerBildschirm === "buchstabensalat") {
    const q = waehleSalatwort(c);
    if (q) texte.push(q);
  }
  return new Set(texte.join(" ").toLowerCase().split(/[\s.,;:!?"'()…-]+/).filter(Boolean));
}
function faelltAuf(form: Uebungsform, andere: "de" | "en", samen: number): boolean {
  const cs = inhaltsWoerter(form, ctxVoll("cs", samen));
  const fremd = inhaltsWoerter(form, ctxVoll(andere, samen));
  if (cs.size === 0) return false;
  return cs.size === fremd.size && [...cs].every((w) => fremd.has(w));
}

describe("★★★ Keine Übungsform liefert auf Weg „cs“ still den deutschen oder den englischen Inhalt", () => {
  for (const form of UEBUNGSFORMEN) {
    it(form.id, () => {
      setLayout("cs");
      for (const samen of [1, 7, 42]) {
        expect(faelltAuf(form, "de", samen), `Deutsch, Samen ${samen}`).toBe(false);
        expect(faelltAuf(form, "en", samen), `Englisch, Samen ${samen}`).toBe(false);
      }
    });
  }

  it("Gegenprobe: eine Form, die die Sprache überhört, wird gefunden (Deutsch UND Englisch)", () => {
    setLayout("cs");
    const lueckentext = UEBUNGSFORMEN.find((f) => f.id === "lueckentext")!;
    const taubDe: Uebungsform = { ...lueckentext, fragen: (c) => lueckentext.fragen!({ ...c, lang: "de", lernweg: "de" }) };
    const taubEn: Uebungsform = { ...lueckentext, fragen: (c) => lueckentext.fragen!({ ...c, lang: "en", lernweg: "en" }) };
    expect(faelltAuf(taubDe, "de", 7)).toBe(true);
    expect(faelltAuf(taubEn, "en", 7)).toBe(true);
  });

  it("die sieben Inhaltsformen liefern auf „cs“ wirklich Inhalt (der Wächter ist nicht leer)", () => {
    setLayout("cs");
    for (const id of FORMEN) {
      const form = UEBUNGSFORMEN.find((f) => f.id === id)!;
      expect(inhaltsWoerter(form, ctxVoll("cs", 1)).size, id).toBeGreaterThan(0);
    }
  });

  it("die Oberfläche dieser Formen spricht Tschechisch (kein deutsches oder englisches Wort in Ankündigung, Frage, Auflösung)", () => {
    setLayout("cs");
    const texte: string[] = [];
    for (const form of UEBUNGSFORMEN.filter((f) => FORMEN.includes(f.id))) {
      const c = ctxVoll("cs", 1);
      if (!form.taugt(c)) continue;
      texte.push(form.ankuendigung(c));
      if (form.fragen) for (const a of form.fragen(c)) texte.push(a.frage, a.aufloesung ?? "");
    }
    expect(texte.length).toBeGreaterThan(5);
    const fremd = woerterAus(texte).filter((w) => w.length >= 3 && !tschechisch(w) && (isRealWord(w, "de") || isRealWord(w, "en")));
    expect(fremd).toEqual([]);
    expect(woerterAus(["Jetzt kommen Rätselsätze."]).filter((w) => w.length >= 3 && !tschechisch(w) && isRealWord(w, "de")).length).toBeGreaterThan(0);
  });
});
