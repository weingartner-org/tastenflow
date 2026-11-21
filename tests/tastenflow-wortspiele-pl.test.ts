/**
 * ★★★ WÄCHTER: die Wortspiele auf Weg „pl" (PL-W, 09.10.2026) - Lückentext, Korrekturlesen, Hand-Schwerpunkte,
 * Buchstabensalat, Alphabet-Reihen, die Geläufigkeit, dazu „Der lange Satz" und „Was fehlt?" (lesen den polnischen Korpus) und
 * die Pyramide (Themenwortschatz und erzeugte Stufen). Vorbild: `tastenflow-wortspiele-it.test.ts` (IT-W).
 *
 * Geprüft wird
 *  1. der INHALT nach den Hausregeln: Form, die Regeln jeder polnischen Textzeile (`helfer/plTextRegeln.ts`), kein Geschlecht
 *     der tippenden Person, keine Anrede Pan/Pani, kein Deutsch/Englisch/Französisch/Spanisch/Italienisch, nichts aus der
 *     Sperrliste (`sperrlistePl.ts`, Kern UND Wortbasis), keine Kopie aus den Listen der anderen Sprachen, jedes Wort im
 *     polnischen Lexikon oder in der von Hand geprüften Liste unten, hörbare Fehler beim Korrekturlesen, ganz Polen -
 *     jeweils mit Gegenprobe, dass die Prüfung etwas findet;
 *  2. ganze Runden jeder Form an echten Haltestellen der polnischen Reihenfolge auf `pl` - nie ein Zeichen, das das Kind noch
 *     nicht hat, kein polnischer Buchstabe vor seiner Taste, und nach den AltGr-Buchstaben kommen Wörter mit ihnen;
 *  3. jedes erzeugte Wort jeder Form ist kein Sperrwort (Pyramiden-Anfänge, Umkehrungen, Mischungen - Leitfaden Falle 88);
 *  4. die Fehlerklasse aus E10a (Falle 19) in beide Richtungen: keine Form liefert auf „pl" still den deutschen ODER den
 *     englischen Inhalt (der englische war bis PL-W der Rückfall, RÜCKFALL-EN G2a);
 *  5. dass die Oberfläche dieser Formen polnisch spricht.
 */
import { readFileSync, existsSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { fitText, korpusFuer } from "@/lib/typing/corpus";
import { isRealWord, normalizeWord } from "@/lib/typing/lexicon";
import { WORDS_PL, STUFE_VOCAB_PL } from "@/lib/typing/wordsPl";
import { gesperrtPl } from "@/lib/typing/sperrlistePl";
import { fingerForChar } from "@/lib/typing/fingers";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext, Uebungsform } from "@/lib/typing/uebungsformen/typen";
import { RAETSEL_DE, RAETSEL_EN } from "@/lib/typing/uebungsformen/lueckentext";
import { RAETSEL_FR } from "@/lib/typing/uebungsformen/lueckentextFr";
import { RAETSEL_ES } from "@/lib/typing/uebungsformen/lueckentextEs";
import { RAETSEL_IT } from "@/lib/typing/uebungsformen/lueckentextIt";
import { RAETSEL_PL } from "@/lib/typing/uebungsformen/lueckentextPl";
import { KORREKTUR_DE, KORREKTUR_EN } from "@/lib/typing/uebungsformen/korrekturlesen";
import { KORREKTUR_FR } from "@/lib/typing/uebungsformen/korrekturlesenFr";
import { KORREKTUR_ES } from "@/lib/typing/uebungsformen/korrekturlesenEs";
import { KORREKTUR_IT } from "@/lib/typing/uebungsformen/korrekturlesenIt";
import { KORREKTUR_PL } from "@/lib/typing/uebungsformen/korrekturlesenPl";
import { WORTKETTEN_DE, WORTKETTEN_EN } from "@/lib/typing/uebungsformen/wortkettenThemen";
import { WORTKETTEN_FR } from "@/lib/typing/uebungsformen/wortkettenFr";
import { WORTKETTEN_ES } from "@/lib/typing/uebungsformen/wortkettenEs";
import { WORTKETTEN_IT } from "@/lib/typing/uebungsformen/wortkettenIt";
import { WORTKETTEN_PL } from "@/lib/typing/uebungsformen/wortkettenPl";
import { gelaeufigkeitsZeile } from "@/lib/typing/uebungsformen/gelaeufigkeit";
import { VERBINDUNGEN_PL } from "@/lib/typing/uebungsformen/gelaeufigkeitPl";
import { SALATWOERTER_FR } from "@/lib/typing/uebungsformen/buchstabensalatFr";
import { SALATWOERTER_ES } from "@/lib/typing/uebungsformen/buchstabensalatEs";
import { SALATWOERTER_IT } from "@/lib/typing/uebungsformen/buchstabensalatIt";
import { SALATWOERTER_PL } from "@/lib/typing/uebungsformen/buchstabensalatPl";
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
import { zeilenFehler } from "./helfer/plTextRegeln";

afterEach(() => setLayout("de"));

/* ── Hilfen ─────────────────────────────────────────────────────────────── */

const POLNISCH = /[ąćęłńóśźż]/;
const POLNISCH_GROSS = /^[ĄĆĘŁŃÓŚŹŻ]/;

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
  return woerterAus(texte).filter((w) => gesperrtPl(w));
}

/**
 * Wörter dieser Inhalte, die das polnische Lexikon (`lexicon.ts`, Fach „pl", aus Tatoeba-Formen) NICHT kennt - von Hand
 * geprüfte Standardwörter und Namen. ⚠️ Für Polnisch gibt es KEINEN Wörterbuch-Beleg (das macOS-Wörterbuch nimmt jedes
 * Wort an, Falle 61): belegt ist hier nur mein Sprachwissen. Beim Vorlesen werden sie buchstabiert, bis sie im Lexikon
 * stehen (Befund PL-W §4: gehören in `ERGAENZT_VON_HAND` von `scripts/erzeuge-lexikon-nachtrag-pl.mts`).
 */
const GEPRUEFT_HAND: readonly string[] = [];
/**
 * Namen und Ortsnamen, die das Lexikon nicht kennt (gebeugt, wie sie im Satz stehen): Maria Skłodowska-Curie, Nobel(preis),
 * Lublin, Tatry, Wawel, Motława (Fluss in Gdańsk), Wielka Krokiew (Sprungschanze in Zakopane), Małopolska.
 */
const GEPRUEFT_NAMEN: readonly string[] = ["maria"]; // bewusst NICHT im Lexikon: ein Name darf nicht in den Buchstabensalat

const PL_WOERTER = new Set<string>([
  ...WORDS_PL,
  ...Object.values(STUFE_VOCAB_PL).flat(),
  ...GEPRUEFT_HAND,
  ...GEPRUEFT_NAMEN,
  ...korpusFuer("pl").flatMap((c) => woerterAus([c.text])),
]);
/** Kennt das Lexikon oder die geprüfte Liste dieses Wort? */
function polnisch(wort: string): boolean {
  const w = wort.toLowerCase();
  return PL_WOERTER.has(w) || isRealWord(w, "pl");
}
function unbekannteWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter((w) => w.length >= 2 && !polnisch(w));
}
/** Ein Wort, das es im Deutschen, Englischen, Französischen, Spanischen oder Italienischen gibt, im Polnischen aber nicht. */
function fremdesWort(wort: string): boolean {
  const w = wort.toLowerCase();
  if (w.length < 3 || polnisch(w)) return false;
  return ["de", "en", "fr", "es", "it"].some((l) => isRealWord(w, l as "de"));
}
function fremdeWoerter(texte: readonly string[]): string[] {
  return woerterAus(texte).filter(fremdesWort);
}

/**
 * Geschlecht der tippenden Person (Glossar §1 Nr. 2): Vergangenheit/Konditional in der 1./2. Person trägt es
 * (zrobiłem/zrobiłam, zrobiłeś, chciałbym, zrobiliśmy/zrobiłyśmy), ebenso jestem/jesteś + Adjektiv und sam/sama/gotowy.
 */
const ICH_DU_VERGANGENHEIT = /\p{L}+(łem|łam|łeś|łaś|łbym|łabym|łbyś|łabyś|liśmy|łyśmy|liście|łyście)(?!\p{L})/u;
const SELBST_MIT_GESCHLECHT = /^(powinienem|powinnam|powinieneś|powinnaś|sam|sama|gotowy|gotowa|zadowolony|zadowolona|głodny|głodna|zmęczony|zmęczona)$/;
function geschlechtFehler(zeile: string): boolean {
  if (ICH_DU_VERGANGENHEIT.test(zeile)) return true;
  const w = zeile.toLowerCase().split(/[^\p{L}]+/u);
  if (w.some((x) => SELBST_MIT_GESCHLECHT.test(x))) return true;
  return w.some((x, i) => (x === "jestem" || x === "jesteś") && /(y|a)$/.test(w[i + 1] ?? "") && !/^(w|na|u)$/.test(w[i + 1] ?? ""));
}
const ANREDE = /(?<!\p{L})(pan|pani|panie|państwo|pana|panu)(?!\p{L})/iu;

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

const ALLE_SAETZE = [...RAETSEL_PL.map((r) => r.satz), ...KORREKTUR_PL.map((f) => f.satz)];

describe("★ Sperrliste, Wortprüfung, Textregeln selbst (Gegenproben)", () => {
  it("die Sperrliste fängt Kern UND Wortbasis - auch ohne Ogonki - und lässt harmlose Verwandte stehen", () => {
    expect(gesperrteWoerter(["Ale gówno.", "Kura znosi jaja.", "Ty głupi!"])).toEqual(["gówno", "jaja", "głupi"]);
    expect(gesperrteWoerter(["Kura znosi jajka.", "Kurczak i kurtka."])).toEqual([]);
  });
  it("ein deutscher, englischer oder italienischer Satz fiele auf", () => {
    expect(fremdeWoerter(["Die Katze fängt gerne Mäuse."]).length).toBeGreaterThan(0);
    expect(fremdeWoerter(["The children play outside."]).length).toBeGreaterThan(0);
    expect(fremdeWoerter(["Il gatto mangia la pizza."]).length).toBeGreaterThan(0);
  });
  it("ein erfundenes Wort fiele als unbekannt auf", () => {
    expect(unbekannteWoerter(["Kot je kwiżmołka."])).toEqual(["kwiżmołka"]);
  });
  it("Geschlecht und Anrede: die Prüfung findet, was sie finden soll", () => {
    for (const z of ["Wczoraj zrobiłem zadanie.", "Byłaś w kinie?", "Jestem głodny.", "Zrobiliśmy to sami.", "Chciałbym lody."])
      expect(geschlechtFehler(z), z).toBe(true);
    for (const z of ["Ania zrobiła zadanie.", "Jestem w szkole.", "Myję zęby.", "Louis Braille urodził się we Francji."])
      expect(geschlechtFehler(z), z).toBe(false);
    expect(ANREDE.test("Czy Pani ma czas?")).toBe(true);
    expect(ANREDE.test("Panda je bambus.")).toBe(false);
  });
});

describe("★ Jeder Satz der Wortspiele besteht die Regeln jeder polnischen Textzeile", () => {
  it("zeilenFehler (Zeichen der Tastatur, Leerzeichen, Apostroph nur im Wort, Sperrwort-Kern)", () => {
    const fehler = ALLE_SAETZE.flatMap((s) => zeilenFehler(s).map((f) => `${s}: ${f}`));
    expect(fehler).toEqual([]);
  });
  it("kein Geschlecht der tippenden Person, keine Anrede Pan/Pani/Państwo", () => {
    expect(ALLE_SAETZE.filter(geschlechtFehler)).toEqual([]);
    expect(ALLE_SAETZE.filter((s) => ANREDE.test(s))).toEqual([]);
  });
});

/* ── 1. Lückentext ──────────────────────────────────────────────────────── */

describe("★ Lückentext (Uzupełnij zdania)", () => {
  const alleTexte = RAETSEL_PL.flatMap((r) => [r.satz, ...r.loesungen]);

  it("genug Rätsel, jedes mit genau einer Lücke und mindestens einer Lösung", () => {
    expect(RAETSEL_PL.length).toBeGreaterThanOrEqual(180);
    for (const r of RAETSEL_PL) {
      expect(r.satz.split("...").length - 1, r.satz).toBe(1);
      expect(r.loesungen.length, r.satz).toBeGreaterThan(0);
      expect(new Set(r.loesungen).size, r.satz).toBe(r.loesungen.length);
      expect(r.stufen.length, r.satz).toBeGreaterThan(0);
    }
  });

  it("jede Lösung ist EIN Wort aus polnischen Buchstaben - ohne Apostroph, ohne grossen polnischen Buchstaben am Anfang", () => {
    const pruefe = (l: string) => !/^[A-Za-ząćęłńóśźż]+$/.test(l) || POLNISCH_GROSS.test(l);
    expect(RAETSEL_PL.flatMap((r) => r.loesungen).filter(pruefe)).toEqual([]);
    expect(["Braille'a", "Łódź", "ö"].filter(pruefe)).toHaveLength(3); // Gegenprobe
  });

  it("jeder Satz ist nur einmal da, keiner stammt aus den Listen der anderen Sprachen", () => {
    const saetze = RAETSEL_PL.map((r) => r.satz);
    expect(saetze.filter((s, i) => saetze.indexOf(s) !== i)).toEqual([]);
    const fremd = new Set([...RAETSEL_DE, ...RAETSEL_EN, ...RAETSEL_FR, ...RAETSEL_ES, ...RAETSEL_IT].map((r) => r.satz));
    expect(saetze.filter((s) => fremd.has(s))).toEqual([]);
  });

  it("ganz Polen: Norden, Masuren, Podlasie, Grosspolen, Schlesien, Kleinpolen, Podhale, Osten, Westen", () => {
    const text = alleTexte.join(" ");
    for (const ort of [
      "Gdańsk", "Hel", "Kaszubach", "Mazurach", "Podlasiu", "Poznaniu", "Wielkopolsce", "Śląsku", "Krakowie", "Wieliczce",
      "Podhalu", "Zakopane", "Tatry", "Lublin", "Rzeszów", "Białystok", "Szczecin", "Wrocławiu", "Łodzi", "Toruń",
      "Malborku", "Warszawy", "Małopolsce",
    ])
      expect(text, ort).toContain(ort);
  });

  it("regionale Varianten: ALLE Formen zählen (ziemniaki/kartofle/pyry/grule, pole/dwór, kran/kurek …)", () => {
    const hat = (...formen: string[]) => RAETSEL_PL.some((r) => formen.every((f) => r.loesungen.includes(f)));
    expect(hat("kartofle", "pyry", "grule")).toBe(true);
    expect(hat("dwór", "pole", "podwórko")).toBe(true);
    expect(hat("kran", "kurek")).toBe(true);
    expect(hat("plecaku", "tornistrze")).toBe(true);
    expect(RAETSEL_PL.filter((r) => r.loesungen.length > 1).length).toBeGreaterThanOrEqual(40);
  });

  it("polnische Buchstaben in der Lösung: genug Rätsel, darunter die kleinen Wörter, die ohne sie ein anderes Wort sind", () => {
    const mit = RAETSEL_PL.filter((r) => r.loesungen.some((l) => POLNISCH.test(l)));
    expect(mit.length).toBeGreaterThanOrEqual(50);
    const loesungen = new Set(RAETSEL_PL.flatMap((r) => r.loesungen));
    for (const w of ["że", "ją", "są", "się", "też", "już", "mąki", "łóżka", "żaba", "śnieg", "pięćdziesiąt", "grudzień", "łabędź"])
      expect(loesungen.has(w), w).toBe(true);
    // jeder der neun Buchstaben kommt in mindestens einer Lösung vor
    for (const b of "ąćęłńóśźż") expect([...loesungen].some((l) => l.includes(b)), b).toBe(true);
  });

  it("keine Wörter der Sperrliste, keine fremden Wörter, jedes Wort polnisch", () => {
    expect(gesperrteWoerter(alleTexte)).toEqual([]);
    expect(fremdeWoerter(alleTexte)).toEqual([]);
    expect(unbekannteWoerter(alleTexte)).toEqual([]);
  });
});

/* ── 2. Korrekturlesen ──────────────────────────────────────────────────── */

/**
 * Ein grober LAUTSCHLÜSSEL für Polnisch: was hier gleich wird, hört eine Sprachausgabe nicht als verschieden - ó/u, rz/ż,
 * ch/h, si/ś, ci/ć, zi/ź, ni/ń, dzi/dź vor einem Vokal, ę am Wortende wie e, und die Auslautverhärtung (b/p, d/t, g/k,
 * w/f, z/s, ż/sz, dź/ć, dz/c am Wortende).
 */
function lautschluessel(wort: string): string {
  let w = wort.toLowerCase();
  w = w.replace(/ó/g, "u").replace(/rz/g, "ż").replace(/ch/g, "h");
  w = w.replace(/dzi(?=[aeouąęy])/g, "dź").replace(/si(?=[aeouąęy])/g, "ś").replace(/ci(?=[aeouąęy])/g, "ć");
  w = w.replace(/zi(?=[aeouąęy])/g, "ź").replace(/ni(?=[aeouąęy])/g, "ń");
  w = w.replace(/ę$/, "e");
  const hart: Record<string, string> = { b: "p", d: "t", g: "k", w: "f", z: "s", ż: "sz", ź: "ś", dź: "ć", dz: "c" };
  w = w.replace(/(dź|dz|[bdgwzżź])$/, (m) => hart[m]);
  return w;
}
function hoerbar(falsch: string, richtig: string): boolean {
  return lautschluessel(falsch) !== lautschluessel(richtig);
}

describe("★ Korrekturlesen (Korekta)", () => {
  it("genug Fälle; das falsche Wort steht im Satz, das richtige ist ein anderes", () => {
    expect(KORREKTUR_PL.length).toBeGreaterThanOrEqual(35);
    for (const f of KORREKTUR_PL) {
      expect(f.satz.split(/[^\p{L}]+/u), f.satz).toContain(f.falsch);
      expect(f.falsch).not.toBe(f.richtig);
      expect(f.richtig, f.satz).toMatch(/^[a-ząćęłńóśźż]+$/);
    }
  });

  it("der Fehler ist HÖRBAR - auch mit ó/u, rz/ż, ch/h, Auslautverhärtung und ę am Ende", () => {
    expect(KORREKTUR_PL.filter((f) => !hoerbar(f.falsch, f.richtig)).map((f) => `${f.falsch}/${f.richtig}`)).toEqual([]);
  });

  it("Gegenprobe: Gleichklang-Paare fielen auf, Paare mit anderem Laut nicht", () => {
    for (const [a, b] of [["gura", "góra"], ["może", "morze"], ["hart", "chart"], ["kod", "kot"], ["lud", "lut"], ["idę", "ide"], ["bób", "bup"]])
      expect(hoerbar(a, b), `${a}/${b}`).toBe(false);
    for (const [a, b] of [["ze", "że"], ["ja", "ją"], ["sad", "sąd"], ["stal", "stał"], ["piec", "pięć"], ["kot", "kit"]])
      expect(hoerbar(a, b), `${a}/${b}`).toBe(true);
  });

  it("einige Fälle üben die polnischen Buchstaben (ohne sie ein anderes Wort: że, ją, stał, pięć …)", () => {
    const nurBuchstabe = KORREKTUR_PL.filter(
      (f) => f.falsch.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l") === f.richtig.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l"),
    );
    expect(nurBuchstabe.length).toBeGreaterThanOrEqual(6);
  });

  it("das falsche Wort ist ein echtes polnisches Wort", () => {
    expect(KORREKTUR_PL.filter((f) => !polnisch(f.falsch)).map((f) => f.falsch)).toEqual([]);
  });

  it("keine Sperrwörter, keine fremden oder unbekannten Wörter, keine Kopie", () => {
    const texte = KORREKTUR_PL.flatMap((f) => [f.satz, f.richtig]);
    expect(gesperrteWoerter(texte)).toEqual([]);
    expect(fremdeWoerter(texte)).toEqual([]);
    expect(unbekannteWoerter(texte)).toEqual([]);
    const fremd = new Set([...KORREKTUR_DE, ...KORREKTUR_EN, ...KORREKTUR_FR, ...KORREKTUR_ES, ...KORREKTUR_IT].map((f) => f.satz));
    expect(KORREKTUR_PL.filter((f) => fremd.has(f.satz))).toEqual([]);
  });
});

/* ── 3. Hand-Schwerpunkte: die Wortketten ───────────────────────────────── */

describe("★ Hand-Schwerpunkte: die Wortketten (Lewa ręka, prawa ręka)", () => {
  const alle = [...new Set(WORTKETTEN_PL.flatMap((k) => k.woerter))];

  it("jede Kette hat mindestens zwölf Wörter, klein, ohne Doppelte, ohne polnische Buchstaben", () => {
    expect(WORTKETTEN_PL.length).toBeGreaterThanOrEqual(14);
    for (const k of WORTKETTEN_PL) {
      expect(k.woerter.length, k.thema).toBeGreaterThanOrEqual(12);
      expect(new Set(k.woerter).size, k.thema).toBe(k.woerter.length);
      for (const w of k.woerter) expect(w, k.thema).toMatch(/^[a-z]+$/);
    }
  });

  for (const tastatur of ["pl", "us", "uk", "de"] as LayoutId[]) {
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
    expect(alle.filter((w) => ["krowa", "osiol", "baran", "malpa", "koza", "swinia"].includes(w))).toEqual([]);
    for (const k of WORTKETTEN_PL)
      for (const fremd of [...WORTKETTEN_DE, ...WORTKETTEN_EN, ...WORTKETTEN_FR, ...WORTKETTEN_ES, ...WORTKETTEN_IT]) {
        const gleich = k.woerter.filter((w) => fremd.woerter.map((x) => x.toLowerCase()).includes(w));
        expect(gleich.length, `${k.thema} ~ ${fremd.thema}: ${gleich.join(" ")}`).toBeLessThan(k.woerter.length / 2);
      }
  });
});

/* ── 4. Geläufigkeit ────────────────────────────────────────────────────── */

describe("★ Geläufigkeit: die Verbindungen (gelaeufigkeitPl.ts aus F5-F8)", () => {
  const alle = VERBINDUNGEN_PL.flatMap((v) => v.woerter);

  it("keine Sperrwörter, kein Tiername als Schimpfwort, keine fremden oder unbekannten Wörter", () => {
    expect(gesperrteWoerter(alle)).toEqual([]);
    expect(alle.filter((w) => ["świnia", "krowa", "osioł", "baran", "małpa"].includes(w))).toEqual([]);
    expect(fremdeWoerter(alle)).toEqual([]);
    expect(unbekannteWoerter(alle)).toEqual([]);
  });

  it("vor `ą` keine Zeile mit `ą`, vor `ń` keine mit `ń` - mit vollem Stand kommen beide, jede Zeile tippbar", () => {
    setLayout("pl");
    const reihenfolge = introOrder("pl");
    const zeilen = (bis: number) => {
      const erlaubt = new Set(reihenfolge.slice(0, bis).filter((u) => u !== SHIFT_UNIT));
      const out: string[] = [];
      for (let s = 1; s <= 300; s++) {
        const z = gelaeufigkeitsZeile(erlaubt, { stufe: "teens", lang: "pl", zufall: zufall(s), lernweg: "pl" });
        if (z) out.push(z.text);
      }
      return { erlaubt, out };
    };
    const vorA = zeilen(reihenfolge.indexOf("ą"));
    expect(vorA.out.length).toBeGreaterThan(0);
    expect(vorA.out.filter((t) => /[ąńóź]/.test(t))).toEqual([]);
    const voll = zeilen(reihenfolge.length);
    expect(voll.out.some((t) => /ą/.test(t)), "eine Zeile mit ą").toBe(true);
    expect(voll.out.some((t) => /ń/.test(t)), "eine Zeile mit ń").toBe(true);
    for (const t of voll.out) expect(fitText(t, voll.erlaubt, "pl"), t).toBe(t);
  });
});

/* ── 5. Buchstabensalat ─────────────────────────────────────────────────── */

describe("★ Buchstabensalat (Pomieszane litery)", () => {
  it(`jedes Quellwort gibt mindestens ${SALAT_ZIEL} echte Wörter her und steht selbst im Lexikon`, () => {
    expect(SALATWOERTER_PL.length).toBeGreaterThanOrEqual(90);
    for (const sw of SALATWOERTER_PL) {
      expect(sw.wort).toMatch(/^[a-ząćęłńóśźż]+$/);
      expect(isRealWord(sw.wort, "pl"), sw.wort).toBe(true);
      expect(salatVorrat(sw.wort, "pl").length, sw.wort).toBeGreaterThanOrEqual(SALAT_ZIEL);
    }
  });

  it("kurze Wörter für alle, lange (ab 8 Buchstaben) erst ab den Jugendlichen", () => {
    for (const sw of SALATWOERTER_PL) expect(sw.stufen.includes("kids"), sw.wort).toBe(sw.wort.length <= 7);
  });

  it("kein Quellwort aus den Listen der anderen Sprachen, keines doppelt, keines gesperrt", () => {
    const woerter = SALATWOERTER_PL.map((s) => s.wort);
    expect(new Set(woerter).size).toBe(woerter.length);
    const fremd = new Set(
      [...SALATWOERTER_DE, ...SALATWOERTER_EN, ...SALATWOERTER_FR, ...SALATWOERTER_ES, ...SALATWOERTER_IT].map((s) => s.wort.toLowerCase()),
    );
    expect(woerter.filter((w) => fremd.has(w))).toEqual([]);
    expect(gesperrteWoerter(woerter)).toEqual([]);
  });

  it("kein Name, keine Abkürzung und kein Sperrwort unter den Funden", () => {
    const funde = new Set(SALATWOERTER_PL.flatMap((sw) => salatVorrat(sw.wort, "pl")));
    for (const n of [...SALAT_NAMEN.pl, ...SALAT_KEINE_WOERTER.pl]) expect(funde.has(n), n).toBe(false);
    expect([...funde].filter((w) => gesperrtPl(w))).toEqual([]);
  });

  it("Gegenprobe: ohne die Listen stünden Doppelsinn, Namen und Schreibungen ohne Ogonki unter den Funden", () => {
    expect(SALAT_KEINE_WOERTER.pl.has("loda")).toBe(true);
    expect(pruefeSalatwort("loda", "dolina", [], "pl").ok).toBe(false);
    expect(pruefeSalatwort("sie", "piasek", [], "pl").ok).toBe(false);
    expect(pruefeSalatwort("Olek", "kotlet", [], "pl")).toEqual({ ok: false, grund: "name" });
    expect(pruefeSalatwort("pies", "piasek", [], "pl").ok).toBe(true);
    expect(pruefeSalatwort("sok", "koszyk", [], "pl").ok).toBe(true);
    // Ein polnischer Buchstabe ist ein eigener Buchstabe: „sąd" passt nicht in einen Vorrat ohne „ą".
    expect(pruefeSalatwort("sąd", "dywans", [], "pl").ok).toBe(false);
    expect(SALAT_NAMEN.pl).not.toBe(SALAT_NAMEN.en);
    expect(SALAT_KEINE_WOERTER.pl).not.toBe(SALAT_KEINE_WOERTER.en);
  });

  it("die Buchstaben-Anzeige ist das Quellwort, sortiert - die polnischen Buchstaben bleiben stehen", () => {
    expect(salatBuchstaben("trąbka", "pl")).toBe("abkrtą");
    expect(salatBuchstaben("jabłko", "pl")).toContain("ł");
  });
});

/** Namen aus der macOS-Liste, die unter den Funden stehen und trotzdem gewöhnliche polnische Wörter sind. */
const ERLAUBT_PL: readonly string[] = ["herb", "kim", "mat", "no", "nora", "norm", "norma", "pilot", "po", "raj", "sam", "stu", "tor"];
const NAMENSLISTE = "/usr/share/dict/propernames";
describe.skipIf(!existsSync(NAMENSLISTE))("★ Buchstabensalat: kein neuer Name im Vorrat", () => {
  it("jeder Treffer aus der Namensliste ist bewusst erlaubt", () => {
    const namen = new Set(readFileSync(NAMENSLISTE, "utf8").split("\n").map((w) => normalizeWord(w)));
    const funde = new Set(SALATWOERTER_PL.flatMap((sw) => salatVorrat(sw.wort, "pl")));
    expect([...funde].filter((w) => namen.has(w) && !ERLAUBT_PL.includes(w))).toEqual([]);
  });
});

/* ── 6. Alphabet-Reihen ─────────────────────────────────────────────────── */

describe("★ Alphabet-Reihen auf „pl“: die neun polnischen Buchstaben gehören dazu", () => {
  const form = UEBUNGSFORMEN.find((f) => f.id === "alphabetreihen")!;
  const ctx = (bis: number, shift = false): FormKontext => ({
    lernweg: "pl", introduced: introOrder("pl").slice(0, bis), shift, oneHand: false, stufe: "kids", lang: "pl",
    count: 40, zufall: zufall(3),
  });

  it("nach der Grundreihe (f j d k s l a ;) läuft die Form schon - ohne polnische Buchstaben", () => {
    setLayout("pl");
    expect(form.taugt(ctx(8))).toBe(true);
    const text = form.baue!(ctx(8))!.zeilen.map((z) => z.text).join(" ");
    expect(text).not.toMatch(POLNISCH);
    expect(text).toContain("adf");
  });

  it("mit allen Buchstaben: die polnischen Buchstaben stehen hinter ihrem Grundbuchstaben (aąb, ćde, łmn …)", () => {
    setLayout("pl");
    const voll = introOrder("pl").length;
    const runde = form.baue!(ctx(voll, true))!;
    expect(runde.zeilen.length).toBeGreaterThanOrEqual(20);
    const text = runde.zeilen.map((z) => z.text).join(" ").toLowerCase();
    for (const b of ["aąb", "deę", "łmn", "ńoó", "sśt"]) expect(text, b).toContain(b);
    const erlaubt = new Set(introOrder("pl"));
    for (const z of runde.zeilen) expect(fitText(z.text, erlaubt, undefined, "pl"), z.text).toBe(z.text);
  });

  it("vor `ą` steht in den Reihen kein `ą` - die Reihe läuft dann a b c", () => {
    setLayout("pl");
    const bis = introOrder("pl").indexOf("ą");
    const text = form.baue!(ctx(bis))!.zeilen.map((z) => z.text).join(" ");
    expect(text).not.toMatch(/ą/);
  });
});

/* ── 7. Der lange Satz / Was fehlt? lesen den polnischen Korpus ─────────── */

describe("★ Der lange Satz und Was fehlt? lesen den polnischen Korpus", () => {
  it("korpusQuelle('pl') ist der polnische Korpus", () => {
    expect(korpusQuelle("pl")).toEqual(korpusFuer("pl"));
    expect(korpusQuelle("pl").length).toBeGreaterThan(0);
  });

  it("„Der lange Satz“ nimmt nur polnische Zeilen", () => {
    setLayout("pl");
    const ctx: FormKontext = { lernweg: "pl", introduced: introOrder("pl"), shift: true, oneHand: false, stufe: "erwachsen", lang: "pl", count: 8, zufall: zufall(1) };
    const eigene = new Set(korpusFuer("pl").map((c) => c.text));
    expect(langeSaetze(ctx).filter((s) => !eigene.has(s))).toEqual([]);
  });
});

/* ── 8. Pyramide und alle erzeugten Wörter: polnisch, nie gesperrt ──────── */

const FORMEN = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "langersatz", "wasfehlt", "alphabetreihen"];
const PFLICHT = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "alphabetreihen"];

/** Alle Texte einer Runde: Frage, Frageteile, Antworten, Zeilen, Salat-Quellwort. */
function texteDerRunde(form: Uebungsform, c: FormKontext): string[] {
  const texte: string[] = [];
  if (!form.taugt(c)) return texte;
  if (form.eigenerBildschirm === "buchstabensalat") {
    const q = waehleSalatwort(c);
    if (q) texte.push(q, ...salatVorrat(q, "pl"));
  } else if (form.fragen) {
    for (const a of form.fragen(c)) texte.push(a.frage, ...(a.frageTeile?.map((t) => t.text) ?? []), ...a.antworten);
  } else if (form.baue) {
    for (const z of form.baue(c)?.zeilen ?? []) texte.push(z.text);
  }
  return texte;
}

describe("★ Pyramide auf „pl“ und jedes erzeugte Wort jeder Form", () => {
  it("jedes Wort einer Pyramide ist polnisch (vier Samen, zwei Stufen)", () => {
    setLayout("pl");
    const pyramide = UEBUNGSFORMEN.find((f) => f.id === "pyramide")!;
    const quelle = new Set([...WORDS_PL, ...Object.values(STUFE_VOCAB_PL).flat()].map((w) => w.toLowerCase()));
    const fehler: string[] = [];
    for (const stufe of ["kids", "teens"] as const)
      for (const samen of [1, 7, 42, 99]) {
        const runde = pyramide.baue!({ lernweg: "pl", introduced: introOrder("pl"), shift: true, oneHand: false, stufe, lang: "pl", count: 8, zufall: zufall(samen) });
        for (const z of runde?.zeilen ?? [])
          for (const w of z.text.toLowerCase().split(/\s+/).map((x) => x.replace(/[.,!?]/g, "")).filter(Boolean))
            if (z.art !== "text" && !quelle.has(w) && ![...quelle].some((q) => q.startsWith(w))) fehler.push(`fremd: ${w}`);
      }
    expect(fehler).toEqual([]);
  });

  it("kein erzeugtes Wort irgendeiner Form ist ein Sperrwort (viele Stände, Stufen, Samen)", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const fehler = new Set<string>();
    for (const bis of [12, 19, 22, 26, 30, 35, 45, o.length]) {
      const introduced = o.slice(0, bis);
      for (const stufe of ["kids", "teens", "erwachsen"] as const)
        for (const samen of [1, 2, 3, 5, 8, 13]) {
          const c: FormKontext = { lernweg: "pl", introduced, shift: introduced.includes(SHIFT_UNIT), oneHand: false, stufe, lang: "pl", count: 10, zufall: zufall(samen * 100 + bis) };
          for (const form of UEBUNGSFORMEN)
            for (const w of woerterAus(texteDerRunde(form, c))) if (w.length >= 2 && gesperrtPl(w)) fehler.add(`${form.id}: ${w}`);
        }
    }
    expect([...fehler]).toEqual([]);
  });

  it("erzeugtGesperrt kennt Polnisch - und nur dort (die anderen Wege bleiben Byte für Byte)", () => {
    expect(erzeugtGesperrt("pl", "jaja")).toBe(true);
    expect(erzeugtGesperrt("pl", "jajka")).toBe(false);
    for (const l of ["de", "en", "fr", "es", "cs"] as const) expect(erzeugtGesperrt(l, "jaja"), l).toBe(false);
  });
});

/* ── 9. Ganze Runden an Haltestellen der polnischen Reihenfolge ─────────── */

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
  it("pl: jede angebotene Form liefert Aufgaben, alles Getippte ist tippbar, kein polnischer Buchstabe vor seiner Taste", () => {
    setLayout("pl");
    const reihenfolge = introOrder("pl");
    const ab = (u: string) => reihenfolge.indexOf(u) + 1;
    const fehler: string[] = [];
    const angeboten = new Set<string>();
    const gesehen = new Set<string>();
    for (const bis of [8, 12, 16, 19, 22, ab("ę"), ab("ł"), ab("ż"), ab("ą"), ab("ś"), ab("ć"), ab("ó"), ab("ń"), ab("ź"), 45, reihenfolge.length]) {
      const introduced = reihenfolge.slice(0, bis);
      const erlaubt = new Set(introduced.filter((u) => u !== SHIFT_UNIT));
      for (const stufe of ["kids", "teens"] as const) {
        for (const form of UEBUNGSFORMEN.filter((f) => FORMEN.includes(f.id))) {
          const ctx: FormKontext = {
            lernweg: "pl", introduced, shift: introduced.includes(SHIFT_UNIT), oneHand: false, stufe, lang: "pl", count: 8, zufall: zufall(bis),
          };
          if (!form.taugt(ctx)) continue;
          angeboten.add(form.id);
          const wo = `${form.id} ${bis}/${stufe}`;
          const texte = getippt(form, { ...ctx, zufall: zufall(bis + 1) }, fehler, wo);
          if (texte.length === 0) fehler.push(`${wo}: nichts zu tippen`);
          for (const t of texte) {
            if (fitText(t, erlaubt, "pl") === null) fehler.push(`${wo}: „${t}"`);
            for (const ch of t.toLowerCase()) {
              if (POLNISCH.test(ch) && !erlaubt.has(ch)) fehler.push(`${wo}: ${ch} vor seiner Taste „${t}"`);
              if (POLNISCH.test(ch)) gesehen.add(ch);
            }
          }
        }
      }
    }
    expect(fehler).toEqual([]);
    for (const id of PFLICHT) expect([...angeboten], id).toContain(id);
    for (const b of "ąćęłńóśż") expect([...gesehen], `nach seiner Taste kommt auch ${b}`).toContain(b);
  });
});

/* ── 10. Die Fehlerklasse: keine Form liefert auf „pl" still Deutsch oder Englisch ── */

const ALLE_TASTEN = [
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."ąćęłńóśźż",
  "'",
  ..."0123456789",
  ".", ",", "?", "!", ";", ":", "-", '"', "(", ")",
  SHIFT_UNIT,
];
function ctxVoll(lang: "de" | "en" | "pl", samen: number): FormKontext {
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
  const pl = inhaltsWoerter(form, ctxVoll("pl", samen));
  const fremd = inhaltsWoerter(form, ctxVoll(andere, samen));
  if (pl.size === 0) return false;
  return pl.size === fremd.size && [...pl].every((w) => fremd.has(w));
}

describe("★★★ Keine Übungsform liefert auf Weg „pl“ still den deutschen oder den englischen Inhalt", () => {
  for (const form of UEBUNGSFORMEN) {
    it(form.id, () => {
      setLayout("pl");
      for (const samen of [1, 7, 42]) {
        expect(faelltAuf(form, "de", samen), `Deutsch, Samen ${samen}`).toBe(false);
        expect(faelltAuf(form, "en", samen), `Englisch, Samen ${samen}`).toBe(false);
      }
    });
  }

  it("Gegenprobe: eine Form, die die Sprache überhört, wird gefunden (Deutsch UND Englisch)", () => {
    setLayout("pl");
    const lueckentext = UEBUNGSFORMEN.find((f) => f.id === "lueckentext")!;
    const taubDe: Uebungsform = { ...lueckentext, fragen: (c) => lueckentext.fragen!({ ...c, lang: "de", lernweg: "de" }) };
    const taubEn: Uebungsform = { ...lueckentext, fragen: (c) => lueckentext.fragen!({ ...c, lang: "en", lernweg: "en" }) };
    expect(faelltAuf(taubDe, "de", 7)).toBe(true);
    expect(faelltAuf(taubEn, "en", 7)).toBe(true);
  });

  it("die sieben Inhaltsformen liefern auf „pl“ wirklich Inhalt (der Wächter ist nicht leer)", () => {
    setLayout("pl");
    for (const id of FORMEN) {
      const form = UEBUNGSFORMEN.find((f) => f.id === id)!;
      expect(inhaltsWoerter(form, ctxVoll("pl", 1)).size, id).toBeGreaterThan(0);
    }
  });

  it("die Oberfläche dieser Formen spricht Polnisch (kein deutsches oder englisches Wort in Ankündigung, Frage, Auflösung)", () => {
    setLayout("pl");
    const texte: string[] = [];
    for (const form of UEBUNGSFORMEN.filter((f) => FORMEN.includes(f.id))) {
      const c = ctxVoll("pl", 1);
      if (!form.taugt(c)) continue;
      texte.push(form.ankuendigung(c));
      if (form.fragen) for (const a of form.fragen(c)) texte.push(a.frage, a.aufloesung ?? "");
    }
    expect(texte.length).toBeGreaterThan(5);
    const fremd = woerterAus(texte).filter((w) => w.length >= 3 && !polnisch(w) && (isRealWord(w, "de") || isRealWord(w, "en")));
    expect(fremd).toEqual([]);
    expect(woerterAus(["Jetzt kommen Rätselsätze."]).filter((w) => w.length >= 3 && !polnisch(w) && isRealWord(w, "de")).length).toBeGreaterThan(0);
  });
});
