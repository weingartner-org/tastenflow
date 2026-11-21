/**
 * ★★★ WÄCHTER: die Wortspiele auf Weg „it" (IT-W, 03.10.2026) - Lückentext, Korrekturlesen, Hand-Schwerpunkte,
 * Buchstabensalat, Alphabet-Reihen, die Geläufigkeit, dazu „Der lange Satz" und „Was fehlt?" (lesen `CORPUS_IT`) und
 * die Pyramide (Themenwortschatz und erzeugte Stufen). Vorbild: `tastenflow-wortspiele-es.test.ts` (ES-W).
 *
 * Geprüft wird
 *  1. der INHALT nach den Hausregeln: Form, Zeichen der Tastaturen `it`/`it-qzerty`, kein Deutsch/Englisch/
 *     Französisch/Spanisch, nichts aus der Sperrliste (`sperrlisteIt.ts`, Kern UND Wortbasis), keine Kopie aus den
 *     Listen der anderen Sprachen, jedes Wort im italienischen Lexikon oder vom macOS-Wörterbuch bestätigt (die Liste
 *     unten), hörbare Fehler beim Korrekturlesen, ganz Italien samt Tessin, Graubünden, Südtirol und San Marino -
 *     jeweils mit Gegenprobe, dass die Prüfung etwas findet;
 *  2. ganze Runden jeder Form an echten Haltestellen der italienischen Reihenfolge, auf `it`, `it-qzerty`, `ch-fr`
 *     (Tessin) und `ch` (Graubünden) - nie ein Zeichen, das das Kind noch nicht hat, kein Akzent vor seiner Taste, keine
 *     Elision vor dem Apostroph (Nr. 26);
 *  3. die Fehlerklasse aus E10a (Falle 19) in beide Richtungen: keine Form liefert auf „it" still den deutschen ODER
 *     den englischen Inhalt (der englische war bis IT-W der Rückfall, RÜCKFALL-EN G2a);
 *  4. dass die Oberfläche dieser Formen italienisch spricht.
 */
import { readFileSync, existsSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { fitText, CORPUS_IT } from "@/lib/typing/corpus";
import { isRealWord, normalizeWord } from "@/lib/typing/lexicon";
import { WORDS_IT, STUFE_VOCAB_IT } from "@/lib/typing/wordsIt";
import { gesperrtIt } from "@/lib/typing/sperrlisteIt";
import { fingerForChar } from "@/lib/typing/fingers";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext, Uebungsform } from "@/lib/typing/uebungsformen/typen";
import { RAETSEL_DE, RAETSEL_EN } from "@/lib/typing/uebungsformen/lueckentext";
import { RAETSEL_FR } from "@/lib/typing/uebungsformen/lueckentextFr";
import { RAETSEL_ES } from "@/lib/typing/uebungsformen/lueckentextEs";
import { RAETSEL_IT } from "@/lib/typing/uebungsformen/lueckentextIt";
import { KORREKTUR_DE, KORREKTUR_EN } from "@/lib/typing/uebungsformen/korrekturlesen";
import { KORREKTUR_FR } from "@/lib/typing/uebungsformen/korrekturlesenFr";
import { KORREKTUR_ES } from "@/lib/typing/uebungsformen/korrekturlesenEs";
import { KORREKTUR_IT } from "@/lib/typing/uebungsformen/korrekturlesenIt";
import { WORTKETTEN_DE, WORTKETTEN_EN } from "@/lib/typing/uebungsformen/wortkettenThemen";
import { WORTKETTEN_FR } from "@/lib/typing/uebungsformen/wortkettenFr";
import { WORTKETTEN_ES } from "@/lib/typing/uebungsformen/wortkettenEs";
import { WORTKETTEN_IT } from "@/lib/typing/uebungsformen/wortkettenIt";
import { VERBINDUNGEN_DE, VERBINDUNGEN_EN, gelaeufigkeitsZeile } from "@/lib/typing/uebungsformen/gelaeufigkeit";
import { VERBINDUNGEN_FR } from "@/lib/typing/uebungsformen/gelaeufigkeitFr";
import { VERBINDUNGEN_ES } from "@/lib/typing/uebungsformen/gelaeufigkeitEs";
import { VERBINDUNGEN_IT } from "@/lib/typing/uebungsformen/gelaeufigkeitIt";
import { SALATWOERTER_FR } from "@/lib/typing/uebungsformen/buchstabensalatFr";
import { SALATWOERTER_ES } from "@/lib/typing/uebungsformen/buchstabensalatEs";
import { SALATWOERTER_IT } from "@/lib/typing/uebungsformen/buchstabensalatIt";
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

afterEach(() => setLayout("de"));

/* ── Hilfen ─────────────────────────────────────────────────────────────── */

function woerterAus(texte: readonly string[]): string[] {
  return [
    ...new Set(
      texte.flatMap((t) =>
        t
          .toLowerCase()
          .split(/[^\p{L}']+/u)
          .flatMap((w) => w.split("'"))
          .filter(Boolean),
      ),
    ),
  ];
}
/** Die Wörter der Sperrliste in diesen Texten (Kern UND Wortbasis - Wortspiele laufen ab 8 Jahren). */
function gesperrteWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter((w) => gesperrtIt(w));
}

/**
 * Wörter dieser Inhalte, die das italienische Lexikon (`lexicon.ts`, Fach „it") NICHT kennt und die darum vom
 * macOS-Wörterbuch bestätigt sind (`scripts/woerterbuch-macos.js`, Vorsilbe `it:`, 03.10.2026: klein UND gross
 * angenommen). ⚠️ Beim Vorlesen werden sie buchstabiert, bis sie im Lexikon stehen (Befund IT-W §4, offene Frage).
 */
const GEPRUEFT_WOERTERBUCH = [
  "abitiamo", "aculei", "alessandro", "alighieri", "annusare", "appendo", "arno", "arrostite", "balenottera", "bolla",
  "busso", "bussò", "canoa", "carapace", "carlo", "cartapesta", "collodi", "dolcissimo", "dritta", "duna",
  "frontaliero", "galilei", "galileo", "ghepardo", "guglielmo", "inventò", "limo", "limonata", "liutai", "louis",
  "lumino", "maiuscola", "marconi",
  "marionette", "mascarpone", "mummia", "munge", "nuraghi", "palline", "parmigiano", "pendente", "pinguino", "pinolo",
  "piolo", "piumino", "polipo", "portiere", "proboscide", "puntini", "rada", "ripiena", "savoiardi", "separano",
  "siciliane", "soglie", "spremuta", "spugna", "sterrata", "svegliò", "temperamatite", "tevere", "ventuno", "vivaldi",
  "voluminoso",
  // die Geläufigkeit (`gelaeufigkeitIt.ts`, F5-F8): dort mit dem Wörterbuch gewählt, aber nicht ins Lexikon gekommen
  "abbaiare", "barchetta", "borghi", "brusco", "centimetro", "frullato", "gemello", "giostra", "gradire", "grammo",
  "granchio", "grappolo", "grondaia", "maghi", "pagaia", "pioppo", "preferire", "prugna", "ruscello", "saetta",
  "scoppio", "sequoia", "serenata", "siepe", "strega", "stringa", "strisciare", "trombone", "trota",
];
/**
 * Namen und Regionalwörter, die weder das Lexikon noch das macOS-Wörterbuch kennt - von Hand geprüft, jedes mit Beleg
 * (Befund IT-W §5): `arrosticini` (Spiesse, Abruzzen), `carasau` (sardisches Brot), `geppetto` (Collodi, „Le avventure
 * di Pinocchio"), `lavaredo` (Tre Cime di Lavaredo, Dolomiten), `montessori` (Maria Montessori), `maiusc` und `natel`
 * (die Taste „Maiusc" unter Windows, Glossar §4; „Natel" = Mobiltelefon in der Schweiz).
 */
const GEPRUEFT_NAMEN = ["arrosticini", "carasau", "geppetto", "lavaredo", "montessori", "maiusc", "natel"];

const IT_WOERTER = new Set<string>([
  ...WORDS_IT,
  ...Object.values(STUFE_VOCAB_IT).flat(),
  ...GEPRUEFT_WOERTERBUCH,
  ...GEPRUEFT_NAMEN,
  ...CORPUS_IT.flatMap((c) => woerterAus([c.text])),
]);
/** Kennt das Lexikon oder die bestätigte Liste dieses Wort? */
function italienisch(wort: string): boolean {
  const w = wort.toLowerCase();
  return IT_WOERTER.has(w) || isRealWord(w, "it");
}
function unbekannteWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter((w) => w.length >= 2 && !italienisch(w));
}
/** Ein Wort, das es im Deutschen, Englischen, Französischen oder Spanischen gibt, im Italienischen aber nicht. */
function fremdesWort(wort: string): boolean {
  const w = wort.toLowerCase();
  if (w.length < 3 || italienisch(w)) return false;
  return isRealWord(w, "de") || isRealWord(w, "en") || isRealWord(w, "fr") || isRealWord(w, "es");
}
function fremdeWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter(fremdesWort);
}

/** Die Akzentbuchstaben des Weges - auf `it` eigene Tasten (Einheiten der Reihenfolge), keine Totasten. */
const AKZENTE = /[àèéìòùÀÈÉÌÒÙ]/;
/** Was auf `it`/`it-qzerty` tippbar ist (Buchstaben, Akzente, ASCII-Satzzeichen) - nie ’ « » “ ” – —. */
const ZEICHEN_IT = /^[A-Za-zàèéìòùÀÈÉÌÒÙ0-9 '.,;:!?"()-]+$/;

/** Deterministischer Zufall (mulberry32) - auch der ERSTE Wert streut über den ganzen Bereich (ein einfacher LCG mit
 *  kleinen Samen läge beim ersten Wert in einem schmalen Band und wählte immer dieselben Verbindungen). */
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

describe("★ Sperrliste und Wortprüfung selbst (Gegenproben)", () => {
  it("die Sperrliste fängt Kern UND Wortbasis - und lässt harmlose Verwandte stehen", () => {
    expect(gesperrteWoerter(["Il culo del vaso.", "Un uccello sul ramo."])).toEqual(["culo", "uccello"]);
    expect(gesperrteWoerter(["Il monaco va al monastero con la scopa."])).toEqual([]);
    expect(gesperrteWoerter(["Il passero vola."])).toEqual([]);
  });
  it("ein deutscher, englischer oder spanischer Satz fiele auf", () => {
    expect(fremdeWoerter(["Die Katze fängt gerne Mäuse."]).length).toBeGreaterThan(0);
    expect(fremdeWoerter(["The children play outside."]).length).toBeGreaterThan(0);
    expect(fremdeWoerter(["Los niños juegan en la calle."]).length).toBeGreaterThan(0);
  });
  it("ein erfundenes Wort fiele als unbekannt auf", () => {
    expect(unbekannteWoerter(["Il gatto mangia la pizzottola."])).toEqual(["pizzottola"]);
  });
});

/* ── 1. Lückentext ──────────────────────────────────────────────────────── */

describe("★ Lückentext (Frasi da completare)", () => {
  const alleTexte = RAETSEL_IT.flatMap((r) => [r.satz, ...r.loesungen]);

  it("genug Rätsel, jedes mit genau einer Lücke und mindestens einer Lösung", () => {
    expect(RAETSEL_IT.length).toBeGreaterThanOrEqual(150);
    for (const r of RAETSEL_IT) {
      expect(r.satz.split("...").length - 1, r.satz).toBe(1);
      expect(r.loesungen.length, r.satz).toBeGreaterThan(0);
      expect(r.stufen.length, r.satz).toBeGreaterThan(0);
    }
  });

  it("jede Lösung ist EIN Wort aus italienischen Buchstaben - ohne Apostroph, ohne grossen Akzentbuchstaben am Anfang", () => {
    const falsch = RAETSEL_IT.flatMap((r) => r.loesungen).filter((l) => !/^[A-Za-zàèéìòù]+$/.test(l) || /^[ÀÈÉÌÒÙ]/.test(l));
    expect(falsch).toEqual([]);
    // Gegenprobe
    expect(["l'acqua", "È"].filter((l) => !/^[A-Za-zàèéìòù]+$/.test(l) || /^[ÀÈÉÌÒÙ]/.test(l))).toHaveLength(2);
  });

  it("nur Zeichen der italienischen Tastatur (gerader Apostroph, keine Gedankenstriche), keine Elision vor der Lücke", () => {
    expect(RAETSEL_IT.filter((r) => !ZEICHEN_IT.test(r.satz)).map((r) => r.satz)).toEqual([]);
    expect(RAETSEL_IT.filter((r) => /'\.\.\./.test(r.satz)).map((r) => r.satz)).toEqual([]);
    expect(ZEICHEN_IT.test("L’elefante – beve")).toBe(false);
  });

  it("jeder Satz ist nur einmal da, keiner stammt aus den Listen der anderen Sprachen", () => {
    const saetze = RAETSEL_IT.map((r) => r.satz);
    expect(saetze.filter((s, i) => saetze.indexOf(s) !== i)).toEqual([]);
    const fremd = new Set([...RAETSEL_DE, ...RAETSEL_EN, ...RAETSEL_FR, ...RAETSEL_ES].map((r) => r.satz));
    expect(saetze.filter((s) => fremd.has(s))).toEqual([]);
  });

  it("ganz Italien gleich stark: Norden, Mitte, Süden, Inseln - und Tessin, Graubünden, Südtirol, San Marino", () => {
    const text = alleTexte.join(" ");
    for (const ort of [
      "Milano", "Venezia", "Genova", "Bologna", "Trieste", "Roma", "Firenze", "Siena", "Napoli", "Puglia", "Calabria",
      "Matera", "Abruzzo", "Sicilia", "Sardegna", "Ticino", "Bellinzona", "Lugano", "Locarno", "Grigioni",
      "Alto Adige", "Bolzano", "San Marino",
    ])
      expect(text, ort).toContain(ort);
  });

  it("regionale Varianten: ALLE Formen zählen (arancina/arancino, anguria/cocomero, gruccia/stampella …)", () => {
    const hat = (...formen: string[]) => RAETSEL_IT.some((r) => formen.every((f) => r.loesungen.includes(f)));
    expect(hat("arancina", "arancino")).toBe(true);
    expect(hat("anguria", "cocomero", "mellone")).toBe(true);
    expect(hat("gruccia", "stampella")).toBe(true);
    expect(hat("pantofole", "ciabatte")).toBe(true);
    expect(hat("parcheggio", "posteggio")).toBe(true);
    expect(hat("papà", "babbo")).toBe(true);
    expect(hat("telefono", "cellulare", "natel")).toBe(true);
    expect(RAETSEL_IT.filter((r) => r.loesungen.length > 1).length).toBeGreaterThanOrEqual(25);
  });

  it("Akzent in der Lösung: genug Rätsel, darunter die Wörter, die ohne Akzent ein anderes Wort sind", () => {
    const mitAkzent = RAETSEL_IT.filter((r) => r.loesungen.some((l) => AKZENTE.test(l)));
    expect(mitAkzent.length).toBeGreaterThanOrEqual(15);
    const loesungen = new Set(RAETSEL_IT.flatMap((r) => r.loesungen));
    for (const w of ["è", "dà", "là", "Sì", "tè", "più", "perché", "metà", "papà", "città", "lunedì", "giù"])
      expect(loesungen.has(w), w).toBe(true);
  });

  it("keine Wörter der Sperrliste, keine fremden Wörter", () => {
    expect(gesperrteWoerter(alleTexte)).toEqual([]);
    expect(fremdeWoerter(alleTexte)).toEqual([]);
  });

  it("jedes Wort steht im Lexikon oder ist vom macOS-Wörterbuch bestätigt", () => {
    expect(unbekannteWoerter(alleTexte)).toEqual([]);
  });
});

/* ── 2. Korrekturlesen ──────────────────────────────────────────────────── */

/**
 * Ein grober LAUTSCHLÜSSEL für Italienisch: was hier gleich wird, hört eine Sprachausgabe nicht als verschieden -
 * stummes h, ci/c und gi/g vor e, sci/sc vor e, cu/qu vor Vokal, gn/ni, und die Doppelkonsonanten (die Länge allein
 * verschluckt eine Sprachausgabe oft). Ein Akzent wird zum GROSSBUCHSTABEN seines Vokals - er markiert die betonte
 * Silbe; offenes und geschlossenes e (è/é) fallen dabei zusammen.
 */
function lautschluessel(wort: string): string {
  return wort
    .toLowerCase()
    .replace(/à/g, "A")
    .replace(/[èé]/g, "E")
    .replace(/ì/g, "I")
    .replace(/[òó]/g, "O")
    .replace(/ù/g, "U")
    .replace(/ch/g, "k")
    .replace(/gh/g, "g")
    .replace(/h/g, "")
    .replace(/sci(?=[aeouAEOU])/g, "§")
    .replace(/sc(?=[eiEI])/g, "§")
    .replace(/ci(?=[aeouAEOU])/g, "ç")
    .replace(/c(?=[eiEI])/g, "ç")
    .replace(/gi(?=[aeouAEOU])/g, "ǧ")
    .replace(/g(?=[eiEI])/g, "ǧ")
    .replace(/gli(?=[aeouAEOU])/g, "λ")
    .replace(/gn/g, "ɲ")
    .replace(/cq?u(?=[aeioAEIO])/g, "kw")
    .replace(/qu/g, "kw")
    .replace(/c/g, "k")
    .replace(/(.)\1/g, "$1");
}
/** Silben grob gezählt (Vokalgruppen). */
function silben(wort: string): number {
  return (wort.toLowerCase().match(/[aeiouàèéìòù]+/g) ?? []).length;
}
/** Hörbar verschieden? Nur der Akzent verschieden: hörbar, wenn er die Betonung auf eine andere Silbe legt. */
function hoerbar(falsch: string, richtig: string): boolean {
  const a = lautschluessel(falsch);
  const b = lautschluessel(richtig);
  if (a === b) return false;
  if (a.toLowerCase() === b.toLowerCase()) return silben(richtig) >= 2;
  return true;
}

describe("★ Korrekturlesen (Rilettura)", () => {
  it("genug Fälle; das falsche Wort steht im Satz, das richtige ist ein anderes", () => {
    expect(KORREKTUR_IT.length).toBeGreaterThanOrEqual(30);
    for (const f of KORREKTUR_IT) {
      expect(f.satz.split(/[^\p{L}]+/u), f.satz).toContain(f.falsch);
      expect(f.falsch).not.toBe(f.richtig);
      expect(f.richtig, f.satz).toMatch(/^[a-zàèéìòù]+$/);
      expect(ZEICHEN_IT.test(f.satz), f.satz).toBe(true);
    }
  });

  it("der Fehler ist HÖRBAR - auch mit stummem h, ci/c, Doppelkonsonanten und Akzent ohne Betonungswechsel", () => {
    const unhoerbar = KORREKTUR_IT.filter((f) => !hoerbar(f.falsch, f.richtig)).map((f) => `${f.falsch}/${f.richtig}`);
    expect(unhoerbar).toEqual([]);
  });

  it("Gegenprobe: Gleichklang-Paare fielen auf, Betonungs-Paare und echte Wechsel nicht", () => {
    for (const [a, b] of [["anno", "hanno"], ["o", "ho"], ["celo", "cielo"], ["pala", "palla"], ["nono", "nonno"], ["e", "è"], ["la", "là"], ["da", "dà"], ["perchè", "perché"], ["scenza", "scienza"]])
      expect(hoerbar(a, b), `${a}/${b}`).toBe(false);
    for (const [a, b] of [["papa", "papà"], ["pero", "però"], ["meta", "metà"], ["cosa", "casa"], ["male", "mare"]])
      expect(hoerbar(a, b), `${a}/${b}`).toBe(true);
  });

  it("einige Fälle üben den Akzent, der die Betonung verschiebt (papà, però, metà …)", () => {
    expect(KORREKTUR_IT.filter((f) => AKZENTE.test(f.richtig) && !AKZENTE.test(f.falsch)).length).toBeGreaterThanOrEqual(6);
  });

  it("das falsche Wort ist ein echtes italienisches Wort", () => {
    expect(KORREKTUR_IT.filter((f) => !italienisch(f.falsch)).map((f) => f.falsch)).toEqual([]);
  });

  it("keine Sperrwörter, keine fremden oder unbekannten Wörter, keine Kopie", () => {
    const texte = KORREKTUR_IT.flatMap((f) => [f.satz, f.richtig]);
    expect(gesperrteWoerter(texte)).toEqual([]);
    expect(fremdeWoerter(texte)).toEqual([]);
    expect(unbekannteWoerter(texte)).toEqual([]);
    const fremd = new Set([...KORREKTUR_DE, ...KORREKTUR_EN, ...KORREKTUR_FR, ...KORREKTUR_ES].map((f) => f.satz));
    expect(KORREKTUR_IT.filter((f) => fremd.has(f.satz))).toEqual([]);
  });
});

/* ── 3. Hand-Schwerpunkte: die Wortketten ───────────────────────────────── */

describe("★ Hand-Schwerpunkte: die Wortketten (Mano sinistra, mano destra)", () => {
  const alle = [...new Set(WORTKETTEN_IT.flatMap((k) => k.woerter))];

  it("jede Kette hat mindestens zwölf Wörter, klein, ohne Doppelte, ohne Akzent und Apostroph", () => {
    expect(WORTKETTEN_IT.length).toBeGreaterThanOrEqual(13);
    for (const k of WORTKETTEN_IT) {
      expect(k.woerter.length, k.thema).toBeGreaterThanOrEqual(12);
      expect(new Set(k.woerter).size, k.thema).toBe(k.woerter.length);
      for (const w of k.woerter) expect(w, k.thema).toMatch(/^[a-z]+$/);
    }
  });

  for (const tastatur of ["it", "it-qzerty", "ch-fr", "ch", "de", "us", "uk"] as LayoutId[]) {
    it(`${tastatur}: für beide Hände je mindestens zwölf einhändige Wörter`, () => {
      setLayout(tastatur);
      for (const hand of ["links", "rechts"] as const) {
        const einhaendig = alle.filter((w) => [...w].every((c) => fingerForChar(c)?.hand === hand));
        expect(einhaendig.length, `${tastatur} ${hand}: ${einhaendig.join(" ")}`).toBeGreaterThanOrEqual(12);
      }
    });
  }

  it("keine Sperrwörter, keine fremden oder unbekannten Wörter, kein Thema aus einer anderen Sprache kopiert", () => {
    expect(gesperrteWoerter(alle)).toEqual([]);
    expect(fremdeWoerter(alle)).toEqual([]);
    expect(unbekannteWoerter(alle)).toEqual([]);
    // Doppelsinn je Region, ohne auf der Sperrliste zu stehen (Kopf von wortkettenIt.ts)
    expect(alle.filter((w) => ["vacca", "fava"].includes(w))).toEqual([]);
    for (const k of WORTKETTEN_IT)
      for (const fremd of [...WORTKETTEN_DE, ...WORTKETTEN_EN, ...WORTKETTEN_FR, ...WORTKETTEN_ES]) {
        const gleich = k.woerter.filter((w) => fremd.woerter.map((x) => x.toLowerCase()).includes(w));
        expect(gleich.length, `${k.thema} ~ ${fremd.thema}: ${gleich.join(" ")}`).toBeLessThan(k.woerter.length / 2);
      }
  });
});

/* ── 4. Geläufigkeit ────────────────────────────────────────────────────── */

describe("★ Geläufigkeit: die Verbindungen (gelaeufigkeitIt.ts aus F5-F8)", () => {
  const alle = VERBINDUNGEN_IT.flatMap((v) => v.woerter);

  it("genug Verbindungen; jedes Wort trägt seine Verbindung an der genannten Stelle, klein, ohne Doppelte", () => {
    expect(VERBINDUNGEN_IT.length).toBeGreaterThanOrEqual(25);
    const falsch: string[] = [];
    for (const v of VERBINDUNGEN_IT) {
      expect(v.woerter.length, v.folge).toBeGreaterThanOrEqual(6);
      expect(new Set(v.woerter).size, v.folge).toBe(v.woerter.length);
      for (const w of v.woerter) {
        const ok = v.stelle === "anfang" ? w.startsWith(v.folge) : v.stelle === "ende" ? w.endsWith(v.folge) : w.includes(v.folge);
        if (!ok) falsch.push(`${v.folge}/${v.stelle}: ${w}`);
        if (!/^[a-zàèéìòù']+$/.test(w)) falsch.push(`${v.folge}: ${w} (Form)`);
      }
    }
    expect(falsch).toEqual([]);
  });

  it("keine Sperrwörter, keine fremden oder unbekannten Wörter, keine übernommene Liste", () => {
    expect(gesperrteWoerter(alle)).toEqual([]);
    expect(fremdeWoerter(alle)).toEqual([]);
    expect(unbekannteWoerter(alle)).toEqual([]);
    const fremd = new Set(
      [...VERBINDUNGEN_DE, ...VERBINDUNGEN_EN, ...VERBINDUNGEN_FR, ...VERBINDUNGEN_ES].flatMap((v) => v.woerter.map((w) => w.toLowerCase())),
    );
    expect(alle.filter((w) => fremd.has(w)).length).toBeLessThan(alle.length / 10);
  });

  it("vor `à` keine „-tà“-Zeile, vor dem Apostroph keine Elision - danach kommen beide", () => {
    setLayout("it");
    const reihenfolge = introOrder("it");
    const zeilen = (bis: number) => {
      const erlaubt = new Set(reihenfolge.slice(0, bis).filter((u) => u !== SHIFT_UNIT));
      const out: string[] = [];
      for (let s = 1; s <= 300; s++) {
        const z = gelaeufigkeitsZeile(erlaubt, { stufe: "teens", lang: "it", zufall: zufall(s), lernweg: "it" });
        if (z) out.push(z.text);
      }
      return { erlaubt, out };
    };
    const vorA = zeilen(reihenfolge.indexOf("à"));
    expect(vorA.out.length).toBeGreaterThan(0);
    expect(vorA.out.filter((t) => /à/.test(t) || /'/.test(t))).toEqual([]);
    const voll = zeilen(reihenfolge.length);
    // (Kein `\b`: es kennt nur ASCII-Wortzeichen, hinter „à" gäbe es keine Wortgrenze - Falle 89.)
    expect(voll.out.some((t) => /tà(?!\p{L})/u.test(t)), "eine -tà-Zeile").toBe(true);
    expect(voll.out.some((t) => /(?<!\p{L})\p{L}+'\p{L}/u.test(t)), "eine Zeile mit Elision").toBe(true);
    for (const t of voll.out) expect(fitText(t, voll.erlaubt, "it"), t).toBe(t);
  });
});

/* ── 5. Buchstabensalat ─────────────────────────────────────────────────── */

describe("★ Buchstabensalat (Lettere mescolate)", () => {
  it(`jedes Quellwort gibt mindestens ${SALAT_ZIEL} echte Wörter her, keines trägt einen Akzent`, () => {
    expect(SALATWOERTER_IT.length).toBeGreaterThanOrEqual(75);
    for (const sw of SALATWOERTER_IT) {
      expect(sw.wort).toMatch(/^[a-z]+$/);
      expect(salatVorrat(sw.wort, "it").length, sw.wort).toBeGreaterThanOrEqual(SALAT_ZIEL);
    }
  });

  it("kurze Wörter für alle, lange (ab 8 Buchstaben) erst ab den Jugendlichen", () => {
    for (const sw of SALATWOERTER_IT)
      expect(sw.stufen.includes("kids"), sw.wort).toBe(sw.wort.length <= 7);
  });

  it("kein Quellwort aus den Listen der anderen Sprachen, keines doppelt, keines unbekannt oder gesperrt", () => {
    const woerter = SALATWOERTER_IT.map((s) => s.wort);
    expect(new Set(woerter).size).toBe(woerter.length);
    const fremd = new Set([...SALATWOERTER_DE, ...SALATWOERTER_EN, ...SALATWOERTER_FR, ...SALATWOERTER_ES].map((s) => s.wort.toLowerCase()));
    expect(woerter.filter((w) => fremd.has(w))).toEqual([]);
    expect(unbekannteWoerter(woerter)).toEqual([]);
    expect(gesperrteWoerter(woerter)).toEqual([]);
  });

  it("kein Name, keine Abkürzung und kein Sperrwort unter den Funden", () => {
    const funde = new Set(SALATWOERTER_IT.flatMap((sw) => salatVorrat(sw.wort, "it")));
    for (const n of [...SALAT_NAMEN.it, ...SALAT_KEINE_WOERTER.it]) expect(funde.has(n), n).toBe(false);
    expect([...funde].filter((w) => gesperrtIt(w))).toEqual([]);
  });

  it("Gegenprobe: ohne die Listen stünden Vulgäres, Namen und Bruchstücke unter den Funden", () => {
    expect(SALAT_KEINE_WOERTER.it.has("cagata")).toBe(true);
    expect(pruefeSalatwort("cagata", "castagna", [], "it").ok).toBe(false);
    expect(pruefeSalatwort("pene", "pennello", [], "it").ok).toBe(false);
    expect(pruefeSalatwort("Luca", "lumaca", [], "it")).toEqual({ ok: false, grund: "name" });
    expect(pruefeSalatwort("casta", "castagna", [], "it").ok).toBe(true);
    expect(pruefeSalatwort("tasca", "castagna", [], "it").ok).toBe(true);
    // Die Listen sind nicht mehr die englischen (RÜCKFALL-EN bis IT-W).
    expect(SALAT_NAMEN.it).not.toBe(SALAT_NAMEN.en);
    expect(SALAT_KEINE_WOERTER.it).not.toBe(SALAT_KEINE_WOERTER.en);
  });

  it("die Buchstaben-Anzeige ist das Quellwort, sortiert (keine Akzente, nichts fällt weg)", () => {
    expect(salatBuchstaben("castagna", "it")).toBe("aaacgnst");
  });
});

/** Namen aus der macOS-Liste, die unter den Funden stehen und trotzdem gewöhnliche italienische Wörter sind. */
const ERLAUBT_IT = ["al", "ami", "del", "don", "ed", "ira", "lana", "lui", "nate", "no", "per", "santa", "ti"];
const NAMENSLISTE = "/usr/share/dict/propernames";
describe.skipIf(!existsSync(NAMENSLISTE))("★ Buchstabensalat: kein neuer Name im Vorrat", () => {
  it("jeder Treffer aus der Namensliste ist bewusst erlaubt", () => {
    const namen = new Set(readFileSync(NAMENSLISTE, "utf8").split("\n").map((w) => normalizeWord(w)));
    const funde = new Set(SALATWOERTER_IT.flatMap((sw) => salatVorrat(sw.wort, "it")));
    const neu = [...funde].filter((w) => namen.has(w) && !ERLAUBT_IT.includes(w));
    expect(neu).toEqual([]);
  });
});

/* ── 6. Alphabet-Reihen ─────────────────────────────────────────────────── */

describe("★ Alphabet-Reihen auf „it“", () => {
  const form = UEBUNGSFORMEN.find((f) => f.id === "alphabetreihen")!;
  const ctx = (bis: number): FormKontext => ({
    lernweg: "it", introduced: introOrder("it").slice(0, bis), shift: false, oneHand: false, stufe: "kids", lang: "it",
    count: 40, zufall: zufall(3),
  });

  it("nach der Grundreihe (f j d k s l a ò) läuft die Form schon - mit j und k an ihrem Platz, ohne ò", () => {
    setLayout("it");
    expect(form.taugt(ctx(8))).toBe(true);
    const text = form.baue!(ctx(8))!.zeilen.map((z) => z.text).join(" ");
    expect(text).toMatch(/j/);
    expect(text).toMatch(/k/);
    expect(text).not.toMatch(/ò/);
    // Gegenprobe: dieselbe Grundreihe ohne j und k gäbe nur a d f l s - zu wenig für die Form.
    expect(form.taugt({ ...ctx(8), introduced: ctx(8).introduced.filter((u) => u !== "j" && u !== "k") })).toBe(false);
  });

  it("mit allen Buchstaben: das lateinische Alphabet mit j k w x an ihrem Platz, kein Akzent darin", () => {
    setLayout("it");
    const text = form.baue!(ctx(introOrder("it").length))!.zeilen.map((z) => z.text).join(" ");
    expect(text).not.toMatch(AKZENTE);
    // (`y z` bleiben bei 26 Buchstaben am Ende stehen: eine Gruppe bricht nie mitten im Alphabet um - die Regel
    // vom 20.09.2026 in `alphabetreihen.ts`, dieselbe auf „en" und „fr".)
    for (const b of ["ijk", "jkl", "vwx"]) expect(text, b).toContain(b);
  });
});

/* ── 7. Der lange Satz / Was fehlt? lesen CORPUS_IT ─────────────────────── */

describe("★ Der lange Satz und Was fehlt? lesen den italienischen Korpus", () => {
  it("korpusQuelle('it') ist CORPUS_IT", () => {
    expect(korpusQuelle("it")).toBe(CORPUS_IT);
  });

  it("„Der lange Satz“ bietet sich an, sobald der Korpus lange Sätze hat - und nur mit italienischen", () => {
    setLayout("it");
    const ctx: FormKontext = { lernweg: "it", introduced: introOrder("it"), shift: true, oneHand: false, stufe: "erwachsen", lang: "it", count: 8, zufall: zufall(1) };
    const lang = langeSaetze(ctx);
    const eigene = new Set(CORPUS_IT.map((c) => c.text));
    expect(lang.filter((s) => !eigene.has(s))).toEqual([]);
    const form = UEBUNGSFORMEN.find((f) => f.id === "langersatz")!;
    expect(form.taugt(ctx)).toBe(lang.length > 0);
  });
});

/* ── 8. Pyramide: italienischer Themenwortschatz, keine gesperrte Stufe ─── */

describe("★ Pyramide auf „it“: italienische Wörter, keine gesperrte Stufe", () => {
  it("erzeugtGesperrt kennt Italienisch - und nur dort (die anderen Wege bleiben Byte für Byte)", () => {
    expect(erzeugtGesperrt("it", "matti")).toBe(true);
    expect(erzeugtGesperrt("it", "mona")).toBe(true);
    expect(erzeugtGesperrt("it", "mattin")).toBe(false);
    for (const l of ["de", "en", "fr", "es", "pl", "cs"] as const) expect(erzeugtGesperrt(l, "matti"), l).toBe(false);
  });

  it("jedes Wort und jede Stufe einer Pyramide ist italienisch und nicht gesperrt (vier Samen, zwei Stufen)", () => {
    setLayout("it");
    const pyramide = UEBUNGSFORMEN.find((f) => f.id === "pyramide")!;
    const quelle = new Set([...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat()].map((w) => w.toLowerCase()));
    const fehler: string[] = [];
    for (const stufe of ["kids", "teens"] as const)
      for (const samen of [1, 7, 42, 99]) {
        const runde = pyramide.baue!({ lernweg: "it", introduced: introOrder("it"), shift: true, oneHand: false, stufe, lang: "it", count: 8, zufall: zufall(samen) });
        for (const z of runde?.zeilen ?? [])
          for (const w of z.text.toLowerCase().split(/\s+/)) {
            if (gesperrtIt(w)) fehler.push(`gesperrt: ${w}`);
            if (z.art !== "text" && !quelle.has(w) && ![...quelle].some((q) => q.startsWith(w))) fehler.push(`fremd: ${w}`);
          }
      }
    expect(fehler).toEqual([]);
  });
});

/* ── 9. Ganze Runden an Haltestellen der italienischen Reihenfolge ──────── */

const FORMEN = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "langersatz", "wasfehlt", "alphabetreihen"];
/** Diese Formen MÜSSEN sich im Lauf der Reihenfolge anbieten. */
const PFLICHT = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "alphabetreihen"];

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

describe("★★★ Eine Runde je Form: nie ein Zeichen, das das Kind noch nicht hat", () => {
  for (const tastatur of ["it", "it-qzerty", "ch-fr", "ch"] as LayoutId[]) {
    it(`${tastatur}: jede angebotene Form liefert Aufgaben, alles Getippte ist tippbar, kein Akzent vor seiner Taste`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("it");
      const ab = (u: string) => reihenfolge.indexOf(u) + 1;
      const fehler: string[] = [];
      const angeboten = new Set<string>();
      let akzentGesehen = false;
      for (const bis of [8, 12, 16, 19, 23, ab("è"), ab("à"), ab("'"), 30, 36, 45, reihenfolge.length]) {
        const introduced = reihenfolge.slice(0, bis);
        const erlaubt = new Set(introduced.filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens"] as const) {
          for (const form of UEBUNGSFORMEN.filter((f) => FORMEN.includes(f.id))) {
            const ctx: FormKontext = {
              lernweg: "it", introduced, shift: introduced.includes(SHIFT_UNIT), oneHand: false,
              stufe, lang: "it", count: 8, zufall: zufall(bis),
            };
            if (!form.taugt(ctx)) continue;
            angeboten.add(form.id);
            const wo = `${form.id} ${bis}/${stufe}`;
            const texte = getippt(form, { ...ctx, zufall: zufall(bis + 1) }, fehler, wo);
            if (texte.length === 0) fehler.push(`${wo}: nichts zu tippen`);
            for (const t of texte) {
              if (fitText(t, erlaubt, "it") === null) fehler.push(`${wo}: „${t}"`);
              for (const ch of t.toLowerCase()) if (AKZENTE.test(ch) && !erlaubt.has(ch)) fehler.push(`${wo}: ${ch} vor seiner Taste „${t}"`);
              if (/'/.test(t) && !erlaubt.has("'")) fehler.push(`${wo}: Elision vor dem Apostroph „${t}"`);
              if (AKZENTE.test(t)) akzentGesehen = true;
            }
          }
        }
      }
      expect(fehler).toEqual([]);
      for (const id of PFLICHT) expect([...angeboten], id).toContain(id);
      expect(akzentGesehen, "nach den Akzenttasten kommen auch Wörter mit Akzent").toBe(true);
    });
  }
});

/* ── 10. Die Fehlerklasse: keine Form liefert auf „it" still Deutsch oder Englisch ── */

/** Alle Buchstaben der italienischen Tastatur, die Akzente, der Apostroph, Ziffern, Satzzeichen, Umschalt. */
const ALLE_TASTEN = [
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."àèéìòù",
  "'",
  ..."0123456789",
  ".", ",", "?", "!", ";", ":", "-", '"', "(", ")",
  SHIFT_UNIT,
];
function ctxVoll(lang: "de" | "en" | "it", samen: number): FormKontext {
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
  const it_ = inhaltsWoerter(form, ctxVoll("it", samen));
  const fremd = inhaltsWoerter(form, ctxVoll(andere, samen));
  if (it_.size === 0) return false;
  return it_.size === fremd.size && [...it_].every((w) => fremd.has(w));
}
/** Formen, die mit Recht dasselbe liefern - mit Grund. */
const SPRACHNEUTRAL: Record<string, string> = {
  alphabetreihen: "dasselbe Alphabet a-z wie Englisch (ausdrücklich, siehe ALPHABET_ORDER_IT)",
};

describe("★★★ Keine Übungsform liefert auf Weg „it“ still den deutschen oder den englischen Inhalt", () => {
  for (const form of UEBUNGSFORMEN) {
    if (SPRACHNEUTRAL[form.id]) continue;
    it(form.id, () => {
      setLayout("it");
      for (const samen of [1, 7, 42]) {
        expect(faelltAuf(form, "de", samen), `Deutsch, Samen ${samen}`).toBe(false);
        expect(faelltAuf(form, "en", samen), `Englisch, Samen ${samen}`).toBe(false);
      }
    });
  }

  it("Gegenprobe: eine Form, die die Sprache überhört, wird gefunden (Deutsch UND Englisch)", () => {
    setLayout("it");
    const lueckentext = UEBUNGSFORMEN.find((f) => f.id === "lueckentext")!;
    const taubDe: Uebungsform = { ...lueckentext, fragen: (c) => lueckentext.fragen!({ ...c, lang: "de", lernweg: "de" }) };
    const taubEn: Uebungsform = { ...lueckentext, fragen: (c) => lueckentext.fragen!({ ...c, lang: "en", lernweg: "en" }) };
    expect(faelltAuf(taubDe, "de", 7)).toBe(true);
    expect(faelltAuf(taubEn, "en", 7)).toBe(true);
  });

  it("die sieben Inhaltsformen liefern auf „it“ wirklich Inhalt (der Wächter ist nicht leer)", () => {
    setLayout("it");
    for (const id of FORMEN) {
      const form = UEBUNGSFORMEN.find((f) => f.id === id)!;
      expect(inhaltsWoerter(form, ctxVoll("it", 1)).size, id).toBeGreaterThan(0);
    }
  });

  it("die Oberfläche dieser Formen spricht Italienisch (kein deutsches oder englisches Wort in Ankündigung, Frage, Auflösung)", () => {
    setLayout("it");
    const texte: string[] = [];
    for (const form of UEBUNGSFORMEN.filter((f) => FORMEN.includes(f.id))) {
      const c = ctxVoll("it", 1);
      if (!form.taugt(c)) continue;
      texte.push(form.ankuendigung(c));
      if (form.fragen) for (const a of form.fragen(c)) texte.push(a.frage, a.aufloesung ?? "");
    }
    expect(texte.length).toBeGreaterThan(5);
    const fremd = woerterAus(texte).filter(
      (w) => w.length >= 3 && !italienisch(w) && (isRealWord(w, "de") || isRealWord(w, "en")),
    );
    expect(fremd).toEqual([]);
    // Gegenprobe: eine deutsche Ankündigung fiele auf.
    expect(woerterAus(["Jetzt kommen Rätselsätze."]).filter((w) => w.length >= 3 && !italienisch(w) && isRealWord(w, "de")).length).toBeGreaterThan(0);
  });
});
