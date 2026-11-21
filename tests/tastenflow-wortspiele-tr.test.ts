/**
 * ★★★ WÄCHTER: die Wortspiele auf Weg „tr" (TR-W, 09.10.2026) - Lückentext, Korrekturlesen, Hand-Schwerpunkte,
 * Buchstabensalat, Alphabet-Reihen, die Geläufigkeit, dazu „Der lange Satz" und „Was fehlt?" (lesen den türkischen Korpus) und
 * die Pyramide (Themenwortschatz und erzeugte Stufen). Vorbild: `tastenflow-wortspiele-pl.test.ts` (PL-W).
 *
 * Geprüft wird
 *  1. der INHALT nach den Hausregeln: Form, die Regeln jeder türkischen Textzeile (`helfer/trTextRegeln.ts`: Zeichen, Apostroph,
 *     i/İ, ASCII-Ersatz, Staatssymbole, Religion, Maus-Wörter, Anredewörter, Person zuerst), nichts aus der Sperrliste
 *     (`sperrlisteTr.ts`, Kern UND Wortbasis, auch GEFALTET - `sık` wäre `sik`), kein Deutsch/Englisch/Französisch/Spanisch/
 *     Italienisch, keine Kopie aus den Listen der anderen Sprachen, jedes Wort im türkischen Lexikon oder in der von Hand
 *     geprüften Liste unten, hörbare Fehler beim Korrekturlesen, die ganze Türkei - jeweils mit Gegenprobe, dass die Prüfung
 *     etwas findet;
 *  2. ganze Runden jeder Form an echten Haltestellen der türkischen Reihenfolge auf `tr-q` (der einzigen Tastatur des Weges) -
 *     nie ein Zeichen, das das Kind noch nicht hat, kein `ç ğ ı ö ş ü` vor seiner Taste, und nach ihrer Taste kommen Wörter
 *     mit ihnen;
 *  3. jedes erzeugte Wort jeder Form ist kein Sperrwort, auch gefaltet (Pyramiden-Anfänge, Umkehrungen, Mischungen -
 *     Glossar §4 Nr. 5, Leitfaden Falle 88);
 *  4. die Fehlerklasse aus E10a (Falle 19) in beide Richtungen: keine Form liefert auf „tr" still den deutschen ODER den
 *     englischen Inhalt (der englische war bis TR-W der Rückfall, RÜCKFALL-EN G2a);
 *  5. dass die Oberfläche dieser Formen türkisch spricht.
 */
import { readFileSync, existsSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "@/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { fitText, korpusFuer } from "@/lib/typing/corpus";
import { isRealWord, normalizeWord } from "@/lib/typing/lexicon";
import { WORDS_TR, STUFE_VOCAB_TR } from "@/lib/typing/wordsTr";
import { faltenTr, fuerWortlisteUngeeignetTr, gesperrtGefaltetTr } from "@/lib/typing/sperrlisteTr";
import { kleinFuer } from "@/lib/typing/sprachRegister";
import { fingerForChar } from "@/lib/typing/fingers";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext, Uebungsform } from "@/lib/typing/uebungsformen/typen";
import { RAETSEL_DE, RAETSEL_EN } from "@/lib/typing/uebungsformen/lueckentext";
import { RAETSEL_FR } from "@/lib/typing/uebungsformen/lueckentextFr";
import { RAETSEL_ES } from "@/lib/typing/uebungsformen/lueckentextEs";
import { RAETSEL_IT } from "@/lib/typing/uebungsformen/lueckentextIt";
import { RAETSEL_PL } from "@/lib/typing/uebungsformen/lueckentextPl";
import { RAETSEL_TR } from "@/lib/typing/uebungsformen/lueckentextTr";
import { KORREKTUR_DE, KORREKTUR_EN } from "@/lib/typing/uebungsformen/korrekturlesen";
import { KORREKTUR_FR } from "@/lib/typing/uebungsformen/korrekturlesenFr";
import { KORREKTUR_ES } from "@/lib/typing/uebungsformen/korrekturlesenEs";
import { KORREKTUR_IT } from "@/lib/typing/uebungsformen/korrekturlesenIt";
import { KORREKTUR_PL } from "@/lib/typing/uebungsformen/korrekturlesenPl";
import { KORREKTUR_TR } from "@/lib/typing/uebungsformen/korrekturlesenTr";
import { WORTKETTEN_DE, WORTKETTEN_EN } from "@/lib/typing/uebungsformen/wortkettenThemen";
import { WORTKETTEN_FR } from "@/lib/typing/uebungsformen/wortkettenFr";
import { WORTKETTEN_ES } from "@/lib/typing/uebungsformen/wortkettenEs";
import { WORTKETTEN_IT } from "@/lib/typing/uebungsformen/wortkettenIt";
import { WORTKETTEN_PL } from "@/lib/typing/uebungsformen/wortkettenPl";
import { WORTKETTEN_TR } from "@/lib/typing/uebungsformen/wortkettenTr";
import { gelaeufigkeitsZeile } from "@/lib/typing/uebungsformen/gelaeufigkeit";
import { VERBINDUNGEN_TR } from "@/lib/typing/uebungsformen/gelaeufigkeitTr";
import { SALATWOERTER_FR } from "@/lib/typing/uebungsformen/buchstabensalatFr";
import { SALATWOERTER_ES } from "@/lib/typing/uebungsformen/buchstabensalatEs";
import { SALATWOERTER_IT } from "@/lib/typing/uebungsformen/buchstabensalatIt";
import { SALATWOERTER_PL } from "@/lib/typing/uebungsformen/buchstabensalatPl";
import { SALATWOERTER_TR } from "@/lib/typing/uebungsformen/buchstabensalatTr";
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
import { zeilenFehler } from "./helfer/trTextRegeln";

afterEach(() => setLayout("de"));

/* ── Hilfen ─────────────────────────────────────────────────────────────── */

const TUERKISCH = /[çğıöşü]/;
const ALFABE = "abcçdefgğhıijklmnoöprsştuüvyz";

/** Die Wörter dieser Texte - klein in der Sprache des Textes (`İ ⇒ i`, `I ⇒ ı`), am Apostroph getrennt (`Rize'nin`). */
function woerterAus(texte: readonly string[]): string[] {
  return [
    ...new Set(
      texte.flatMap((t) =>
        kleinFuer(t, "tr")
          .split(/[^\p{L}']+/u)
          .flatMap((w) => w.split("'"))
          .filter(Boolean),
      ),
    ),
  ];
}
/** Die Wörter der Sperrliste in diesen Texten - Kern UND Wortbasis, auch GEFALTET (Wortspiele laufen ab 7 Jahren). */
function gesperrteWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter((w) => gesperrtGefaltetTr(w));
}

/**
 * Wörter dieser Inhalte, die das türkische Lexikon (`lexicon.ts`, Fach „tr": Tatoeba-Formen mit mindestens zwei Belegen, dazu
 * `WORDS_TR`, `STUFE_VOCAB_TR` und der Korpus) NICHT kennt - von Hand geprüfte Standardwörter in TDK-Schreibung, jedes vom
 * macOS-Wörterbuch für Türkisch in kleiner UND türkisch grosser Form angenommen (`scripts/woerterbuch-macos.js`, Vorsilbe `tr:`;
 * ⚠️ ein HALBES Wörterbuch, als Beleg taugt nur seine Ablehnung - abgelehnt hat es hier nur die zwei Regionalwörter *boyoz* und
 * *kartol* und die Eigennamen unten). ⚠️ Türkisch hängt Endungen an: das Fach hat keine Beugungsformen (Kopf von
 * `scripts/erzeuge-lexikon-nachtrag-tr.mts`), darum ist diese Liste lang. Beim Vorlesen werden diese Wörter buchstabiert, bis sie
 * im Lexikon stehen (Befund TR-W §4: gehören in `ERGAENZT_VON_HAND` des Nachtrag-Skripts).
 */
const GEPRUEFT_HAND: readonly string[] = [
  // bewusst NICHT im Lexikon: mır (Schnurren, Lautmalerei), boyozdur und kartol (Regionalwörter, das Wörterbuch lehnt sie ab), kas (Zufallstreffer der Start-Bank, die Stimme spräche es)
  "mır", "boyozdur", "kartol", "kas",
];
/** Eigennamen, die das Lexikon nicht kennt (wie sie im Satz stehen): Fırat, Dicle, Urfa, Efes, Keloğlan, die Taste Enter. */
const GEPRUEFT_NAMEN = ["fırat", "dicle", "urfa", "efes", "keloğlan", "enter", "shift"];

const TR_WOERTER = new Set<string>([
  ...WORDS_TR,
  ...Object.values(STUFE_VOCAB_TR).flat(),
  ...GEPRUEFT_HAND,
  ...GEPRUEFT_NAMEN,
  ...woerterAus(korpusFuer("tr").map((c) => c.text)),
]);
/** Kennt das Lexikon oder die geprüfte Liste dieses Wort? */
function tuerkisch(wort: string): boolean {
  const w = kleinFuer(wort, "tr");
  return TR_WOERTER.has(w) || isRealWord(w, "tr");
}
/** Bruchstücke hinter einem Apostroph (`Rize'nin`, `Dağı'dır`) - Endungen, keine Wörter. */
const ENDUNGEN = new Set(["dır", "dir", "dur", "dür", "nin", "nın", "nun", "nün", "daki", "dan", "den", "da", "de", "ı", "i", "a", "e"]);
function unbekannteWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter((w) => w.length >= 2 && !ENDUNGEN.has(w) && !tuerkisch(w));
}
/** Ein Wort, das es im Deutschen, Englischen, Französischen, Spanischen oder Italienischen gibt, im Türkischen aber nicht. */
function fremdesWort(wort: string): boolean {
  const w = kleinFuer(wort, "tr");
  if (w.length < 3 || tuerkisch(w)) return false;
  return ["de", "en", "fr", "es", "it"].some((l) => isRealWord(w, l as "de"));
}
function fremdeWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter(fremdesWort);
}

/** Tiernamen, die im Türkischen als Schimpfwort gegen Menschen dienen - nie in einer Wortreihe ohne Zusammenhang. */
const SCHIMPF_TIERE = ["eşek", "domuz", "öküz", "ayı", "inek", "keçi", "maymun", "köpek", "kaz", "tavuk", "koyun", "sığır", "dana", "katır", "manda", "çakal", "it", "hayvan", "fil", "balina", "zürafa"];

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

const ALLE_SAETZE = [...RAETSEL_TR.map((r) => r.satz), ...KORREKTUR_TR.map((f) => f.satz)];

describe("★ Sperrliste, Wortprüfung, Textregeln selbst (Gegenproben)", () => {
  it("die Sperrliste fängt Kern UND Wortbasis - auch gefaltet - und lässt harmlose Verwandte stehen", () => {
    expect(gesperrteWoerter(["Bu çok salak.", "Kuşlar sık sık öter.", "Kuşlar sıktı."])).toEqual(["salak", "sık", "sıktı"]);
    expect(gesperrteWoerter(["Kuşlar sıkı sıkı öter.", "Klasik bir küçük boks maçı."])).toEqual([]);
  });
  it("ein deutscher, englischer oder italienischer Satz fiele auf", () => {
    expect(fremdeWoerter(["Die Katze fängt gerne Mäuse."]).length).toBeGreaterThan(0);
    expect(fremdeWoerter(["The children play outside."]).length).toBeGreaterThan(0);
    expect(fremdeWoerter(["Il gatto mangia la pizza."]).length).toBeGreaterThan(0);
  });
  it("ein erfundenes Wort fiele als unbekannt auf - ein ASCII-Ersatz auch", () => {
    expect(unbekannteWoerter(["Kedi kıvzımlak yer."])).toEqual(["kıvzımlak"]);
    expect(zeilenFehler("Bu guzel bir cocuk.").length).toBeGreaterThan(0);
  });
});

describe("★ Jeder Satz der Wortspiele besteht die Regeln jeder türkischen Textzeile", () => {
  it("zeilenFehler (Zeichen der Tastatur, Apostroph nur an Eigennamen, İ/I, ASCII-Ersatz, Staatssymbole, Religion, Maus, Anrede, Sperrwort-Kern)", () => {
    const fehler = ALLE_SAETZE.flatMap((s) => zeilenFehler(s).map((f) => `${s}: ${f}`));
    expect(fehler).toEqual([]);
  });
  it("Gegenprobe: ein Satz mit Anrede, Maus-Wort oder Staatssymbol fiele auf", () => {
    for (const z of ["Abla bana yardım etti.", "Düğmeye tıkla.", "Bayrak direkte.", "İnşallah gelir."]) expect(zeilenFehler(z).length, z).toBeGreaterThan(0);
  });
});

/* ── 1. Lückentext ──────────────────────────────────────────────────────── */

/** Eigennamen, die als Lösung grossgeschrieben stehen (sonst ist jede Lösung klein). */
const EIGENNAMEN_LOESUNG = new Set(["Ağrı", "Van", "Ankara", "İstanbul", "Ege", "Karadeniz", "Akdeniz", "Uludağ", "Hacivat", "Keloğlan", "Shift"]);

describe("★ Lückentext (Cümleyi tamamla)", () => {
  const alleTexte = RAETSEL_TR.flatMap((r) => [r.satz, ...r.loesungen]);

  it("genug Rätsel, jedes mit genau einer Lücke und mindestens einer Lösung", () => {
    expect(RAETSEL_TR.length).toBeGreaterThanOrEqual(250);
    for (const r of RAETSEL_TR) {
      expect(r.satz.split("...").length - 1, r.satz).toBe(1);
      expect(r.loesungen.length, r.satz).toBeGreaterThan(0);
      expect(new Set(r.loesungen).size, r.satz).toBe(r.loesungen.length);
      expect(r.stufen.length, r.satz).toBeGreaterThan(0);
    }
  });

  it("jede Lösung ist EIN Wort aus türkischen Buchstaben - ohne Apostroph, ohne â î û, gross nur an Eigennamen", () => {
    const pruefe = (l: string) =>
      !/^[a-zA-ZçğıöşüÇĞİÖŞÜ]+$/.test(l) || (/^[A-ZÇĞİÖŞÜ]/.test(l) && !EIGENNAMEN_LOESUNG.has(l)) || zeilenFehler(l).length > 0;
    expect(RAETSEL_TR.flatMap((r) => r.loesungen).filter(pruefe)).toEqual([]);
    expect(["Rize'de", "hâlâ", "Kedi", "Istanbul", "ä"].filter(pruefe)).toHaveLength(5); // Gegenprobe
  });

  it("jeder Satz ist nur einmal da, keiner stammt aus den Listen der anderen Sprachen", () => {
    const saetze = RAETSEL_TR.map((r) => r.satz);
    expect(saetze.filter((s, i) => saetze.indexOf(s) !== i)).toEqual([]);
    const fremd = new Set([...RAETSEL_DE, ...RAETSEL_EN, ...RAETSEL_FR, ...RAETSEL_ES, ...RAETSEL_IT, ...RAETSEL_PL].map((r) => r.satz));
    expect(saetze.filter((s) => fremd.has(s))).toEqual([]);
  });

  it("die ganze Türkei: Marmara, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu, Güneydoğu", () => {
    const text = alleTexte.join(" ");
    for (const ort of [
      "İstanbul", "Bursa", "Edirne", "İzmir", "Efes", "Isparta", "Pamukkale", "Antalya", "Mersin", "Hatay", "Anamur", "Ankara",
      "Kayseri", "Konya", "Kapadokya", "Eskişehir", "Tuz Gölü", "Trabzon", "Rize", "Giresun", "Amasya", "Safranbolu", "Erzurum",
      "Van", "Ağrı", "Malatya", "Antep", "Urfa", "Diyarbakır", "Mardin", "Karadeniz", "Ege", "Akdeniz",
    ])
      expect(text, ort).toContain(ort);
  });

  it("regionale Varianten: ALLE Formen zählen (simit/gevrek, patates/kartol, ayakkabı/pabuç, bilye/misket, nine …)", () => {
    const hat = (...formen: string[]) => RAETSEL_TR.some((r) => formen.every((f) => r.loesungen.includes(f)));
    expect(hat("simit", "gevrek")).toBe(true);
    expect(hat("patates", "kartol")).toBe(true);
    expect(hat("ayakkabı", "pabuç")).toBe(true);
    expect(hat("bilye", "misket")).toBe(true);
    expect(hat("musluğu", "çeşmeyi")).toBe(true);
    expect(hat("anneanne", "nine", "büyükanne")).toBe(true);
    expect(hat("kalemtıraş", "açacak")).toBe(true);
    // und die Regionalwörter selbst als Lösung
    const loesungen = new Set(RAETSEL_TR.flatMap((r) => r.loesungen));
    for (const w of ["gevrek", "boyoz", "kartol", "isot", "horon", "halay", "zeybek", "yayla", "dolmuş"]) expect(loesungen.has(w), w).toBe(true);
    expect(RAETSEL_TR.filter((r) => r.loesungen.length > 1).length).toBeGreaterThanOrEqual(70);
  });

  it("türkische Buchstaben in der Lösung: genug Rätsel, darunter kleine Wörter, die ohne sie ein anderes Wort sind", () => {
    const mit = RAETSEL_TR.filter((r) => r.loesungen.some((l) => TUERKISCH.test(l)));
    expect(mit.length).toBeGreaterThanOrEqual(100);
    const loesungen = new Set(RAETSEL_TR.flatMap((r) => r.loesungen));
    for (const w of ["için", "kuş", "süt", "çok", "üç", "kış", "ağ", "kök", "güneş", "şeker", "öğle", "gökkuşağı", "kuyruğunu", "dört"])
      expect(loesungen.has(w), w).toBe(true);
    // jeder der sechs Buchstaben kommt in mindestens fünf Lösungen vor
    for (const b of "çğıöşü") expect([...loesungen].filter((l) => l.includes(b)).length, b).toBeGreaterThanOrEqual(5);
  });

  it("keine Wörter der Sperrliste (auch gefaltet), keine fremden Wörter, jedes Wort türkisch", () => {
    expect(gesperrteWoerter(alleTexte)).toEqual([]);
    expect(fremdeWoerter(alleTexte)).toEqual([]);
    expect(unbekannteWoerter(alleTexte)).toEqual([]);
  });

  it("keine Farbe als Lösung (ein Kind mit Blindheit soll jede Lücke füllen können)", () => {
    const FARBEN = ["kırmızı", "mavi", "yeşil", "sarı", "beyaz", "siyah", "mor", "turuncu", "pembe", "gri", "kahverengi", "lacivert"];
    expect(RAETSEL_TR.filter((r) => r.loesungen.some((l) => FARBEN.includes(l))).map((r) => r.satz)).toEqual([]);
  });
});

/* ── 2. Korrekturlesen ──────────────────────────────────────────────────── */

/**
 * Ein grober LAUTSCHLÜSSEL für Türkisch: was hier gleich wird, hört eine Sprachausgabe nicht als verschieden - das weiche `ğ`
 * (es dehnt nur den Vokal davor: *dağ* klingt wie „daa"), die Zirkumflex-Vokale (`â î û` wie `a i u`) und doppelte Vokale.
 */
function lautschluessel(wort: string): string {
  let w = kleinFuer(wort, "tr");
  w = w.replace(/ğ/g, "").replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u");
  w = w.replace(/([aeıioöuü])\1+/g, "$1");
  return w;
}
function hoerbar(falsch: string, richtig: string): boolean {
  return lautschluessel(falsch) !== lautschluessel(richtig);
}

describe("★ Korrekturlesen (Okuyup düzelt)", () => {
  it("genug Fälle; das falsche Wort steht im Satz, das richtige ist ein anderes", () => {
    expect(KORREKTUR_TR.length).toBeGreaterThanOrEqual(38);
    for (const f of KORREKTUR_TR) {
      expect(f.satz.split(/[^\p{L}]+/u), f.satz).toContain(f.falsch);
      expect(f.falsch).not.toBe(f.richtig);
      expect(f.richtig, f.satz).toMatch(/^[a-zçğıöşü]+$/);
    }
  });

  it("der Fehler ist HÖRBAR - auch mit weichem ğ, Zirkumflex und Doppelvokal", () => {
    expect(KORREKTUR_TR.filter((f) => !hoerbar(f.falsch, f.richtig)).map((f) => `${f.falsch}/${f.richtig}`)).toEqual([]);
  });

  it("Gegenprobe: Gleichklang-Paare fielen auf, Paare mit anderem Laut nicht", () => {
    for (const [a, b] of [["dağ", "daa"], ["kâr", "kar"], ["hâlâ", "hala"], ["saat", "sat"], ["yağmur", "yamur"]]) expect(hoerbar(a, b), `${a}/${b}`).toBe(false);
    for (const [a, b] of [["cam", "çam"], ["kir", "kır"], ["sis", "şiş"], ["on", "ön"], ["gol", "göl"], ["kul", "kül"]])
      expect(hoerbar(a, b), `${a}/${b}`).toBe(true);
  });

  it("einige Fälle üben die türkischen Buchstaben (ohne sie ein anderes Wort: çam, ön, kaş, başıma …)", () => {
    const nurBuchstabe = KORREKTUR_TR.filter((f) => faltenTr(f.falsch) === faltenTr(f.richtig));
    expect(nurBuchstabe.length).toBeGreaterThanOrEqual(12);
    const buchstaben = new Set(nurBuchstabe.flatMap((f) => [...`${f.falsch}${f.richtig}`].filter((c) => TUERKISCH.test(c))));
    for (const b of "çıöşü") expect(buchstaben.has(b), b).toBe(true);
  });

  it("das falsche Wort ist ein echtes türkisches Wort", () => {
    expect(KORREKTUR_TR.filter((f) => !tuerkisch(f.falsch)).map((f) => f.falsch)).toEqual([]);
  });

  it("keine Sperrwörter (auch gefaltet - darum kein sık/şık, kus/kuş), keine fremden oder unbekannten Wörter, keine Kopie", () => {
    const texte = KORREKTUR_TR.flatMap((f) => [f.satz, f.richtig]);
    expect(gesperrteWoerter(texte)).toEqual([]);
    expect(fremdeWoerter(texte)).toEqual([]);
    expect(unbekannteWoerter(texte)).toEqual([]);
    const fremd = new Set([...KORREKTUR_DE, ...KORREKTUR_EN, ...KORREKTUR_FR, ...KORREKTUR_ES, ...KORREKTUR_IT, ...KORREKTUR_PL].map((f) => f.satz));
    expect(KORREKTUR_TR.filter((f) => fremd.has(f.satz))).toEqual([]);
  });
});

/* ── 3. Hand-Schwerpunkte: die Wortketten ───────────────────────────────── */

describe("★ Hand-Schwerpunkte: die Wortketten (Sol el, sağ el)", () => {
  const alle = [...new Set(WORTKETTEN_TR.flatMap((k) => k.woerter))];

  it("jede Kette hat mindestens zwölf Wörter, klein, ohne Doppelte, ohne â î û und ohne Apostroph", () => {
    expect(WORTKETTEN_TR.length).toBeGreaterThanOrEqual(15);
    for (const k of WORTKETTEN_TR) {
      expect(k.woerter.length, k.thema).toBeGreaterThanOrEqual(12);
      expect(new Set(k.woerter).size, k.thema).toBe(k.woerter.length);
      for (const w of k.woerter) expect(w, k.thema).toMatch(/^[a-zçğıöşü]+$/);
    }
  });

  it("tr-q: für beide Hände je mindestens zwölf einhändige Wörter - die rechte trägt auch ç ğ ı ö ş ü", () => {
    setLayout("tr-q");
    for (const hand of ["links", "rechts"] as const) {
      const einhaendig = alle.filter((w) => [...w].every((c) => fingerForChar(c)?.hand === hand));
      expect(einhaendig.length, `${hand}: ${einhaendig.join(" ")}`).toBeGreaterThanOrEqual(12);
      if (hand === "rechts") expect(einhaendig.filter((w) => TUERKISCH.test(w)).length, einhaendig.join(" ")).toBeGreaterThanOrEqual(4);
    }
  });

  it("keine Sperrwörter, nichts Unerwünschtes, keine fremden oder unbekannten Wörter, kein Tiername als Schimpfwort, kein Thema kopiert", () => {
    expect(alle.filter((w) => fuerWortlisteUngeeignetTr(w))).toEqual([]);
    expect(fremdeWoerter(alle)).toEqual([]);
    expect(unbekannteWoerter(alle)).toEqual([]);
    expect(alle.filter((w) => SCHIMPF_TIERE.includes(w))).toEqual([]);
    for (const k of WORTKETTEN_TR)
      for (const fremd of [...WORTKETTEN_DE, ...WORTKETTEN_EN, ...WORTKETTEN_FR, ...WORTKETTEN_ES, ...WORTKETTEN_IT, ...WORTKETTEN_PL]) {
        const gleich = k.woerter.filter((w) => fremd.woerter.map((x) => x.toLowerCase()).includes(w));
        expect(gleich.length, `${k.thema} ~ ${fremd.thema}: ${gleich.join(" ")}`).toBeLessThan(k.woerter.length / 2);
      }
  });

  it("die Form bietet auf tr-q beide Hände an, und jede Zeile ist einhändig und tippbar", () => {
    setLayout("tr-q");
    const form = UEBUNGSFORMEN.find((f) => f.id === "handschwerpunkte")!;
    const o = introOrder("tr");
    const gesehen = new Set<string>();
    for (let samen = 1; samen <= 40; samen++) {
      const c: FormKontext = { lernweg: "tr", introduced: o, shift: true, oneHand: false, stufe: "kids", lang: "tr", count: 4, zufall: zufall(samen) };
      const runde = form.baue!(c);
      if (!runde) continue;
      const haende = new Set(runde.zeilen.flatMap((z) => [...z.text.replace(/ /g, "")].map((ch) => fingerForChar(ch)?.hand)));
      expect(haende.size, runde.zeilen.map((z) => z.text).join(" | ")).toBe(1);
      gesehen.add([...haende][0] ?? "");
    }
    expect([...gesehen].sort()).toEqual(["links", "rechts"]);
  });
});

/* ── 4. Geläufigkeit ────────────────────────────────────────────────────── */

describe("★ Geläufigkeit: die Verbindungen (gelaeufigkeitTr.ts aus F5-F8)", () => {
  const alle = VERBINDUNGEN_TR.flatMap((v) => v.woerter);

  it("keine Sperrwörter, nichts Unerwünschtes, kein Tiername als Schimpfwort, kein Alkohol, keine fremden oder unbekannten Wörter", () => {
    expect(alle.filter((w) => fuerWortlisteUngeeignetTr(w))).toEqual([]);
    expect(alle.filter((w) => SCHIMPF_TIERE.includes(w) || ["şarap", "çıplak", "göğüs", "bira", "rakı"].includes(w))).toEqual([]);
    expect(fremdeWoerter(alle)).toEqual([]);
    expect(unbekannteWoerter(alle)).toEqual([]);
  });

  it("vor `ö` keine Zeile mit `ö`, vor `ç` keine mit `ç` - mit vollem Stand kommen alle sechs, jede Zeile tippbar", () => {
    setLayout("tr-q");
    const reihenfolge = introOrder("tr");
    const zeilen = (bis: number) => {
      const erlaubt = new Set(reihenfolge.slice(0, bis).filter((u) => u !== SHIFT_UNIT));
      const out: string[] = [];
      for (let s = 1; s <= 300; s++) {
        const z = gelaeufigkeitsZeile(erlaubt, { stufe: "teens", lang: "tr", zufall: zufall(s), lernweg: "tr" });
        if (z) out.push(z.text);
      }
      return { erlaubt, out };
    };
    const vorC = zeilen(reihenfolge.indexOf("ç"));
    expect(vorC.out.length).toBeGreaterThan(0);
    expect(vorC.out.filter((t) => /[çğüö]/.test(t))).toEqual([]);
    const vorOe = zeilen(reihenfolge.indexOf("ö"));
    expect(vorOe.out.filter((t) => /ö/.test(t))).toEqual([]);
    const voll = zeilen(reihenfolge.length);
    for (const b of "çğıöşü") expect(voll.out.some((t) => t.includes(b)), `eine Zeile mit ${b}`).toBe(true);
    for (const t of voll.out) expect(fitText(t, voll.erlaubt, "tr", "tr"), t).toBe(t);
  });
});

/* ── 5. Buchstabensalat ─────────────────────────────────────────────────── */

describe("★ Buchstabensalat (Karışık harfler)", () => {
  it(`jedes Quellwort gibt mindestens ${SALAT_ZIEL} echte Wörter her und steht selbst im Lexikon`, () => {
    expect(SALATWOERTER_TR.length).toBeGreaterThanOrEqual(100);
    for (const sw of SALATWOERTER_TR) {
      expect(sw.wort).toMatch(/^[a-zçğıöşü]+$/);
      expect(isRealWord(sw.wort, "tr"), sw.wort).toBe(true);
      expect(salatVorrat(sw.wort, "tr").length, sw.wort).toBeGreaterThanOrEqual(SALAT_ZIEL);
    }
  });

  it("kurze Wörter für alle, lange (ab 8 Buchstaben) erst ab den Jugendlichen", () => {
    for (const sw of SALATWOERTER_TR) expect(sw.stufen.includes("kids"), sw.wort).toBe(sw.wort.length <= 7);
  });

  it("kein Quellwort aus den Listen der anderen Sprachen, keines doppelt, keines gesperrt oder unerwünscht", () => {
    const woerter = SALATWOERTER_TR.map((s) => s.wort);
    expect(new Set(woerter).size).toBe(woerter.length);
    const fremd = new Set(
      [...SALATWOERTER_DE, ...SALATWOERTER_EN, ...SALATWOERTER_FR, ...SALATWOERTER_ES, ...SALATWOERTER_IT, ...SALATWOERTER_PL].map((s) =>
        s.wort.toLowerCase(),
      ),
    );
    expect(woerter.filter((w) => fremd.has(w))).toEqual([]);
    expect(woerter.filter((w) => fuerWortlisteUngeeignetTr(w))).toEqual([]);
  });

  it("türkische Buchstaben im Quellwort: jeder der sechs kommt vor - und früh gibt es Quellwörter ohne sie", () => {
    const woerter = SALATWOERTER_TR.map((s) => s.wort);
    for (const b of "çğıöşü") expect(woerter.filter((w) => w.includes(b)).length, b).toBeGreaterThanOrEqual(3);
    setLayout("tr-q");
    const nachU = introOrder("tr").slice(0, introOrder("tr").indexOf("u") + 1);
    const c: FormKontext = { lernweg: "tr", introduced: nachU, shift: false, oneHand: false, stufe: "kids", lang: "tr", count: 8, zufall: zufall(3) };
    expect(waehleSalatwort(c)).not.toBeNull();
  });

  it("kein Name, keine Abkürzung und kein Sperrwort unter den Funden", () => {
    const funde = new Set(SALATWOERTER_TR.flatMap((sw) => salatVorrat(sw.wort, "tr")));
    for (const n of [...SALAT_NAMEN.tr, ...SALAT_KEINE_WOERTER.tr]) expect(funde.has(n), n).toBe(false);
    expect([...funde].filter((w) => gesperrtGefaltetTr(w))).toEqual([]);
  });

  it("Gegenprobe: ohne die Listen stünden Namen, Anredewörter und gefaltete Sperrwörter unter den Funden", () => {
    expect(pruefeSalatwort("Burak", "kurabiye", [], "tr")).toEqual({ ok: false, grund: "name" });
    expect(pruefeSalatwort("anan", "mandalina", [], "tr").ok).toBe(false);
    expect(pruefeSalatwort("sık", "fıstık", [], "tr").ok).toBe(false);
    expect(pruefeSalatwort("bal", "balık", [], "tr").ok).toBe(true);
    expect(pruefeSalatwort("kaş", "kaşık", [], "tr").ok).toBe(true);
    // `ı` und `i` sind zwei Buchstaben: „ilk" passt nicht in „balık" (nur ı), „ağ" nicht in einen Vorrat ohne „ğ".
    expect(pruefeSalatwort("ilk", "balık", [], "tr").ok).toBe(false);
    expect(pruefeSalatwort("ağ", "kalem", [], "tr").ok).toBe(false);
    // Grossgeschrieben zählt mit dem türkischen Gebietsschema: „IŞIK" ist „ışık", nie „işik".
    expect(normalizeWord("IŞIK", "tr")).toBe("ışık");
    expect(SALAT_NAMEN.tr).not.toBe(SALAT_NAMEN.en);
    expect(SALAT_KEINE_WOERTER.tr).not.toBe(SALAT_KEINE_WOERTER.en);
  });

  it("die Buchstaben-Anzeige ist das Quellwort, sortiert - die türkischen Buchstaben bleiben stehen", () => {
    expect(salatBuchstaben("kaşık", "tr")).toContain("ş");
    expect(salatBuchstaben("kaşık", "tr")).toContain("ı");
    expect(salatBuchstaben("bıçak", "tr")).toContain("ç");
  });
});

/**
 * Namen aus der macOS-Liste, die unter den Funden stehen und trotzdem gewöhnliche türkische Wörter sind (der Abgleich läuft über
 * `normalizeWord(_, "tr")`: aus „Ira" wird „ıra"): adam (Mann), al (nimm), alan (Feld), art (hinten), ben (ich), dana (Kalb),
 * don (Frost), eli (seine Hand), erik (Pflaume), gene (wieder), kay (rutsch), kent (Stadt), kim (wer), murat (Wunsch), ozan
 * (Dichter), ray (Schiene), roman, sal (Floss), son (Ende).
 */
const ERLAUBT_TR: readonly string[] = [
  "adam", "al", "alan", "art", "ben", "dana", "don", "eli", "erik", "gene", "kay", "kent", "kim", "murat", "ozan", "ray", "roman",
  "sal", "son",
];
const NAMENSLISTE = "/usr/share/dict/propernames";
describe.skipIf(!existsSync(NAMENSLISTE))("★ Buchstabensalat: kein neuer Name im Vorrat", () => {
  it("jeder Treffer aus der Namensliste ist bewusst erlaubt", () => {
    const namen = new Set(readFileSync(NAMENSLISTE, "utf8").split("\n").map((w) => normalizeWord(w, "tr")));
    const funde = new Set(SALATWOERTER_TR.flatMap((sw) => salatVorrat(sw.wort, "tr")));
    expect([...funde].filter((w) => namen.has(w) && !ERLAUBT_TR.includes(w))).toEqual([]);
  });
});

/* ── 6. Alphabet-Reihen ─────────────────────────────────────────────────── */

describe("★ Alphabet-Reihen auf „tr“: das Alfabe mit 29 Buchstaben, ohne q w x", () => {
  const form = UEBUNGSFORMEN.find((f) => f.id === "alphabetreihen")!;
  const ctx = (bis: number, shift = false, samen = 3): FormKontext => ({
    lernweg: "tr", introduced: introOrder("tr").slice(0, bis), shift, oneHand: false, stufe: "kids", lang: "tr",
    count: 40, zufall: zufall(samen),
  });
  const gruppen = (bis: number, shift = false, samen = 3) =>
    form.baue!(ctx(bis, shift, samen))!.zeilen.flatMap((z) => z.text.split(" ").map((g) => g.replace(/\.$/, "")));

  it("nach der Grundreihe (f j d k s l a ş) läuft die Form schon - ohne die übrigen türkischen Buchstaben", () => {
    setLayout("tr-q");
    expect(form.taugt(ctx(8))).toBe(true);
    const text = gruppen(8).join(" ");
    expect(text).not.toMatch(/[çğıöü]/);
    expect(text).toContain("adf");
  });

  it("mit allen Buchstaben: jede Gruppe ist ein Stück des Alfabe - ç ğ ı ö ş ü an ihrem Platz, nie q w x, İ und I richtig", () => {
    setLayout("tr-q");
    const voll = introOrder("tr").length;
    const alle: string[] = [];
    for (const samen of [1, 2, 3, 4, 5, 6]) alle.push(...gruppen(voll, true, samen));
    expect(alle.length).toBeGreaterThanOrEqual(100);
    // jede Gruppe, türkisch kleingeschrieben, steht so im Alfabe (ein „I" für „İ" ergäbe „ı" und fiele heraus)
    expect(alle.filter((g) => !ALFABE.includes(kleinFuer(g, "tr")))).toEqual([]);
    const text = alle.join(" ");
    expect(text).not.toMatch(/[qwxQWX]/);
    for (const b of "çğıöşü") expect(kleinFuer(text, "tr"), b).toContain(b);
    expect(text).toMatch(/İ/); // ein grosses i mit Punkt kommt vor
    const erlaubt = new Set(introOrder("tr"));
    for (const z of form.baue!(ctx(voll, true))!.zeilen) expect(fitText(z.text, erlaubt, "tr", "tr"), z.text).toBe(z.text);
  });

  it("Gegenprobe: dieselbe Prüfung fände ein falsches I (toUpperCase ohne Sprache) und eine englische Reihe", () => {
    expect(ALFABE.includes(kleinFuer("Ijk", "tr"))).toBe(false); // „Ijk" ⇒ „ıjk" - kein Stück des Alfabe
    expect(ALFABE.includes(kleinFuer("İjk", "tr"))).toBe(true);
    expect(ALFABE.includes("pqr")).toBe(false);
  });

  it("vor `ı` steht in den Reihen kein `ı` - die Reihe läuft dann h i j", () => {
    setLayout("tr-q");
    const bis = introOrder("tr").indexOf("ı");
    const text = gruppen(bis).join(" ");
    expect(text).not.toMatch(/ı/);
  });
});

/* ── 7. Der lange Satz / Was fehlt? lesen den türkischen Korpus ─────────── */

describe("★ Der lange Satz und Was fehlt? lesen den türkischen Korpus", () => {
  it("korpusQuelle('tr') ist der türkische Korpus", () => {
    expect(korpusQuelle("tr")).toEqual(korpusFuer("tr"));
    expect(korpusQuelle("tr").length).toBeGreaterThan(0);
  });

  it("„Der lange Satz“ nimmt nur türkische Zeilen", () => {
    setLayout("tr-q");
    const ctx: FormKontext = { lernweg: "tr", introduced: introOrder("tr"), shift: true, oneHand: false, stufe: "erwachsen", lang: "tr", count: 8, zufall: zufall(1) };
    const eigene = new Set(korpusFuer("tr").map((c) => c.text));
    expect(langeSaetze(ctx).filter((s) => !eigene.has(s))).toEqual([]);
  });
});

/* ── 8. Pyramide und alle erzeugten Wörter: türkisch, nie gesperrt ──────── */

const FORMEN = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "langersatz", "wasfehlt", "alphabetreihen"];
const PFLICHT = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "alphabetreihen"];

/** Alle Texte einer Runde: Frage, Frageteile, Antworten, Zeilen, Salat-Quellwort. */
function texteDerRunde(form: Uebungsform, c: FormKontext): string[] {
  const texte: string[] = [];
  if (!form.taugt(c)) return texte;
  if (form.eigenerBildschirm === "buchstabensalat") {
    const q = waehleSalatwort(c);
    if (q) texte.push(q, ...salatVorrat(q, "tr"));
  } else if (form.fragen) {
    for (const a of form.fragen(c)) texte.push(a.frage, ...(a.frageTeile?.map((t) => t.text) ?? []), ...a.antworten);
  } else if (form.baue) {
    for (const z of form.baue(c)?.zeilen ?? []) texte.push(z.text);
  }
  return texte;
}

describe("★ Pyramide auf „tr“ und jedes erzeugte Wort jeder Form", () => {
  it("jedes Wort einer Pyramide ist türkisch (vier Samen, zwei Stufen)", () => {
    setLayout("tr-q");
    const pyramide = UEBUNGSFORMEN.find((f) => f.id === "pyramide")!;
    const quelle = new Set([...WORDS_TR, ...Object.values(STUFE_VOCAB_TR).flat()].map((w) => kleinFuer(w, "tr")));
    const fehler: string[] = [];
    for (const stufe of ["kids", "teens"] as const)
      for (const samen of [1, 7, 42, 99]) {
        const runde = pyramide.baue!({ lernweg: "tr", introduced: introOrder("tr"), shift: true, oneHand: false, stufe, lang: "tr", count: 8, zufall: zufall(samen) });
        for (const z of runde?.zeilen ?? [])
          for (const w of kleinFuer(z.text, "tr").split(/\s+/).map((x) => x.replace(/[.,!?]/g, "")).filter(Boolean))
            if (z.art !== "text" && !quelle.has(w) && ![...quelle].some((q) => q.startsWith(w) || q.split("'")[0].startsWith(w))) fehler.push(`fremd: ${w}`);
      }
    expect(fehler).toEqual([]);
  });

  it("kein erzeugtes Wort irgendeiner Form ist ein Sperrwort, auch gefaltet (viele Stände, Stufen, Samen)", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const fehler = new Set<string>();
    for (const bis of [12, 15, 19, 22, 26, 30, 35, 45, o.length]) {
      const introduced = o.slice(0, bis);
      for (const stufe of ["kids", "teens", "erwachsen"] as const)
        for (const samen of [1, 2, 3, 5, 8, 13]) {
          const c: FormKontext = { lernweg: "tr", introduced, shift: introduced.includes(SHIFT_UNIT), oneHand: false, stufe, lang: "tr", count: 10, zufall: zufall(samen * 100 + bis) };
          for (const form of UEBUNGSFORMEN.filter((f) => FORMEN.includes(f.id)))
            for (const w of woerterAus(texteDerRunde(form, c))) if (w.length >= 2 && gesperrtGefaltetTr(w)) fehler.add(`${form.id}: ${w}`);
        }
    }
    expect([...fehler]).toEqual([]);
  });

  it("erzeugtGesperrt kennt Türkisch (gefaltet) - und nur dort", () => {
    expect(erzeugtGesperrt("tr", "sık")).toBe(true);
    expect(erzeugtGesperrt("tr", "sıkı")).toBe(false);
    for (const l of ["de", "en", "fr", "es", "cs"] as const) expect(erzeugtGesperrt(l, "sık"), l).toBe(false);
  });
});

/* ── 9. Ganze Runden an Haltestellen der türkischen Reihenfolge ─────────── */

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
  it("tr-q: jede angebotene Form liefert Aufgaben, alles Getippte ist tippbar, kein türkischer Buchstabe vor seiner Taste", () => {
    setLayout("tr-q");
    const reihenfolge = introOrder("tr");
    const ab = (u: string) => reihenfolge.indexOf(u) + 1;
    const fehler: string[] = [];
    const angeboten = new Set<string>();
    const gesehen = new Set<string>();
    const stopps = [8, 12, ab("ı"), 19, ab(SHIFT_UNIT), ab("z"), ab("ç"), ab("h"), ab("g"), ab("ğ"), ab("ü"), ab("v"), ab("p"), ab("c"), ab("ö"), ab("'"), ab("^"), 45, reihenfolge.length];
    for (const bis of stopps) {
      const introduced = reihenfolge.slice(0, bis);
      const erlaubt = new Set(introduced.filter((u) => u !== SHIFT_UNIT));
      for (const stufe of ["kids", "teens"] as const) {
        for (const form of UEBUNGSFORMEN.filter((f) => FORMEN.includes(f.id))) {
          const ctx: FormKontext = {
            lernweg: "tr", introduced, shift: introduced.includes(SHIFT_UNIT), oneHand: false, stufe, lang: "tr", count: 8, zufall: zufall(bis),
          };
          if (!form.taugt(ctx)) continue;
          angeboten.add(form.id);
          const wo = `${form.id} ${bis}/${stufe}`;
          const texte = getippt(form, { ...ctx, zufall: zufall(bis + 1) }, fehler, wo);
          if (texte.length === 0) fehler.push(`${wo}: nichts zu tippen`);
          for (const t of texte) {
            if (fitText(t, erlaubt, "tr", "tr") === null) fehler.push(`${wo}: „${t}"`);
            for (const ch of kleinFuer(t, "tr")) {
              if (TUERKISCH.test(ch) && !erlaubt.has(ch)) fehler.push(`${wo}: ${ch} vor seiner Taste „${t}"`);
              if (TUERKISCH.test(ch)) gesehen.add(ch);
            }
          }
        }
      }
    }
    expect(fehler).toEqual([]);
    for (const id of PFLICHT) expect([...angeboten], id).toContain(id);
    for (const b of "çğıöşü") expect([...gesehen], `nach seiner Taste kommt auch ${b}`).toContain(b);
  });
});

/* ── 10. Die Fehlerklasse: keine Form liefert auf „tr" still Deutsch oder Englisch ── */

const ALLE_TASTEN = [
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."çğıöşü",
  "'", "^",
  ..."0123456789",
  ".", ",", "?", "!", ";", ":", "-", '"', "(", ")",
  SHIFT_UNIT,
];
function ctxVoll(lang: "de" | "en" | "tr", samen: number): FormKontext {
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
  // Beide Seiten mit DERSELBEN Kleinschreibung (türkisch) - sonst unterschiede sich ein deutsches „Im" (⇒ „ım") von sich selbst.
  return new Set(kleinFuer(texte.join(" "), "tr").split(/[\s.,;:!?"'()…-]+/).filter(Boolean));
}
function faelltAuf(form: Uebungsform, andere: "de" | "en", samen: number): boolean {
  setLayout("tr-q");
  const tr = inhaltsWoerter(form, ctxVoll("tr", samen));
  const fremd = inhaltsWoerter(form, ctxVoll(andere, samen));
  if (tr.size === 0) return false;
  return tr.size === fremd.size && [...tr].every((w) => fremd.has(w));
}

describe("★★★ Keine Übungsform liefert auf Weg „tr“ still den deutschen oder den englischen Inhalt", () => {
  for (const form of UEBUNGSFORMEN) {
    it(form.id, () => {
      for (const samen of [1, 7, 42]) {
        expect(faelltAuf(form, "de", samen), `Deutsch, Samen ${samen}`).toBe(false);
        expect(faelltAuf(form, "en", samen), `Englisch, Samen ${samen}`).toBe(false);
      }
    });
  }

  it("Gegenprobe: eine Form, die die Sprache überhört, wird gefunden (Deutsch UND Englisch)", () => {
    const lueckentext = UEBUNGSFORMEN.find((f) => f.id === "lueckentext")!;
    const taubDe: Uebungsform = { ...lueckentext, fragen: (c) => lueckentext.fragen!({ ...c, lang: "de", lernweg: "de" }) };
    const taubEn: Uebungsform = { ...lueckentext, fragen: (c) => lueckentext.fragen!({ ...c, lang: "en", lernweg: "en" }) };
    expect(faelltAuf(taubDe, "de", 7)).toBe(true);
    expect(faelltAuf(taubEn, "en", 7)).toBe(true);
  });

  it("die sieben Inhaltsformen liefern auf „tr“ wirklich Inhalt (der Wächter ist nicht leer)", () => {
    setLayout("tr-q");
    for (const id of FORMEN) {
      const form = UEBUNGSFORMEN.find((f) => f.id === id)!;
      expect(inhaltsWoerter(form, ctxVoll("tr", 1)).size, id).toBeGreaterThan(0);
    }
  });

  it("die Oberfläche dieser Formen spricht Türkisch (kein deutsches oder englisches Wort in Ankündigung, Frage, Auflösung)", () => {
    setLayout("tr-q");
    const texte: string[] = [];
    for (const form of UEBUNGSFORMEN.filter((f) => FORMEN.includes(f.id))) {
      const c = ctxVoll("tr", 1);
      if (!form.taugt(c)) continue;
      texte.push(form.ankuendigung(c));
      if (form.fragen) for (const a of form.fragen(c)) texte.push(a.frage, a.aufloesung ?? "");
    }
    expect(texte.length).toBeGreaterThan(5);
    const fremd = woerterAus(texte).filter((w) => w.length >= 3 && !tuerkisch(w) && (isRealWord(w, "de") || isRealWord(w, "en")));
    expect(fremd).toEqual([]);
    expect(woerterAus(["Jetzt kommen Rätselsätze."]).filter((w) => w.length >= 3 && !tuerkisch(w) && isRealWord(w, "de")).length).toBeGreaterThan(0);
  });
});
