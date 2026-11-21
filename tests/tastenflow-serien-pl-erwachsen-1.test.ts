/**
 * ★★★ Wächter PL-S (09.10.2026): die ersten POLNISCHEN Serien für Erwachsene (`serienPlErwachsen1.ts`).
 *
 * Vorbild: `tastenflow-serien-it-erwachsen-1.test.ts` (Form einer Serien-Charge, Servieren gegen den echten Weg, D-2).
 * Die polnischen Regeln kommen aus dem gemeinsamen Helfer `helfer/plSerienRegeln.ts` (Regeln jeder pl-Zeile, Anrede,
 * Geschlecht der tippenden Person, Feiertage, Politik, Etikett, Naht nach dem Kürzen, Wortbasis, Ogonek-Zwillinge, Kopien,
 * Paare, „fast gleich", Woiwodschaften); hier stehen nur die Regeln, die NUR diese Charge hat (Zahlformat mit Ziffern,
 * Zahlwort-Rektion, € nur im Ausland, Mail-Adressen, Griff auf der Tastatur `pl`, Öffnungs-Sprosse als Tabelle).
 *
 * Geprüft wird:
 *  1. die FORM jeder Zeile (Regeln aller pl-Zeilen, ein Satz, 5-18 Wörter, höchstens 90 Zeichen, erlaubte Zeichen,
 *     Zahlformat polnisch, Rektion nach Zahlen, € nur mit Auslandsbezug, Adressen nur `.example`),
 *  2. die FORM jeder Serie (20 Serien, 19 mit 2 Etappen und genau eine mit 3, 14-16 Zeilen, jede Etappe endet auf ? oder !,
 *     Slug, Titel, Stufe, Weg, Herkunft, `minTier` = `computeSerieMinTier(s, "pl")`, `validateSerie`),
 *  3. Namen (jedes Grosswort mitten im Satz ist ein Eigenname DIESER Serie, auch in jeder gekürzten Fassung),
 *  4. die 16 Woiwodschaften (jede mindestens einmal, keine mehr als zweimal),
 *  5. keine Anrede Pan/Pani/Państwo, kein Geschlecht der tippenden Person, keine Feiertage, keine Politik, kein Etikett,
 *  6. den Wortschatz (Wortgrenze 8, Sperrliste Kern UND Wortbasis, jedes Wort in der Wortbasis oder von Hand belegt,
 *     Ogonek-Zwillinge gelesen),
 *  7. jedes Zeichen auf der Tastatur `pl` greifbar,
 *  8. das SERVIEREN gegen den echten Weg „pl" (Öffnungs-Einheit je Serie gemessen und als Tabelle `OEFFNET` eingetragen,
 *     dort kein Wort halbiert und keine Zahl zerrissen; mit allen Tasten Zeichen für Zeichen; Erwachsene vor ⇧ bekommen
 *     keine (D-2); Kinder, Jugend und die Wege „it" und „de" nie),
 *  9. keine Kopie, kein Paar, nichts „fast gleich" (untereinander, gegen jede pl-Zeile, gegen alles andere),
 * 10. das Einhängen (`SERIEN_PL`, `SERIEN`) und den unberührten Korpus-Anker.
 * Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { SERIEN_PL_ERWACHSEN_1 } from "../src/lib/typing/serienPlErwachsen1";
import { SERIEN_PL_KIDS_1 } from "../src/lib/typing/serienPlKids1";
import { SERIEN_PL_TEENS_1 } from "../src/lib/typing/serienPlTeens1";
import type { SerieEntwurfPl } from "../src/lib/typing/serienPlTyp";
import { SERIEN_PL } from "../src/lib/typing/serienPl";
import { SERIEN, allowedFromIntroduced, unlockedSerien, serieTypeable } from "../src/lib/typing/serien";
import { computeSerieMinTier, validateSerie, type Serie } from "../src/lib/typing/serie";
import { setLayout, layoutById, type KeyboardLayout } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { fitText } from "../src/lib/typing/corpus";
import { CORPUS_PL } from "../src/lib/typing/corpusPl";
import { kombizeichenZu } from "../src/lib/typing/totasten";
import { bausteinKey } from "../src/lib/typing/ledger";
import { corpusManifest } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import {
  zeilenVon,
  formFehler,
  serienFormFehler,
  type FormRegel,
  ANREDE,
  geschlechtFehler,
  feiertagIn,
  politikIn,
  etikettIn,
  ordnung,
  allowedAt,
  ersteSprosse,
  volleSprosse,
  oeffnet,
  oeffnetEinheit,
  namenVon,
  fremdeGrosswoerter,
  gekuerztFehler,
  zuHaeufig,
  pruefWoerter,
  gesperrtPl,
  BASIS,
  ungeprueft,
  ZWILLINGE,
  zwillingWoerter,
  paare,
  kopienGegen,
  anderePlZeilen,
  alleFremdenZeilen,
  fastGleich,
  fastGleichVoll,
  fastGleichUntereinander,
  proWoiwodschaft,
  WOIWODSCHAFTEN_PL,
} from "./helfer/plSerienRegeln";

afterEach(() => setLayout("de"));

const SERIEN_E = SERIEN_PL_ERWACHSEN_1;
const ZEILEN = SERIEN_E.flatMap(zeilenVon);
const EIGENE_SLUGS: ReadonlySet<string> = new Set(SERIEN_E.map((s) => s.slug));
const kopie = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const norm = (t: string) => t.replace(/\s+/g, " ").trim();

// ── 1 · Form jeder Zeile ────────────────────────────────────────────────────

/**
 * Erlaubt: Buchstaben des polnischen Alphabets (dazu q v x für Namen und Fremdwörter), Ziffern, Leerzeichen,
 * `. , ; : ? ! "` und `% / @ €`. Kein Bindestrich (er fiele auf Weg „pl" vor seiner Sprosse weg und zerrisse das Wort),
 * keine Klammern, kein Apostroph (die Charge braucht keine Form wie `Braille'a`).
 */
const REGEL: FormRegel = {
  erlaubt: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 .,;:?!"%/@€]+$/u,
  minWoerter: 5,
  maxWoerter: 18,
  maxZeichen: 90,
};

/**
 * Zahlformat polnisch (GLOSSAR-pl §1 Nr. 5, §2.10): Dezimalkomma, kein Tausenderpunkt, vierstellig ohne Trenner, ab fünf
 * Stellen ein Leerzeichen (`21 000`), Prozent ohne Leerzeichen (`35%`), Beträge NACH der Zahl (`23 zł`, `6 €`), Uhrzeit
 * `o 7:15` als gültiges h:mm, keine Ordnungszahl mit Punkt, nie „godz.".
 */
function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d\.\d/.test(t)) f.push("Punkt zwischen Ziffern (Tausenderpunkt oder Dezimalpunkt)");
  if (/\d{5,}/.test(t)) f.push("fünf oder mehr Stellen ohne Leerzeichen");
  if (/(?<!\d)\d \d{3}(?!\d)/.test(t)) f.push("vierstellige Zahl mit Leerzeichen");
  if (/\d %/.test(t)) f.push("Leerzeichen vor %");
  if (/\d(zł|€)/.test(t) || /(zł|€)\s?\d/.test(t)) f.push("Betrag nicht als „23 zł“ / „6 €“");
  if (/\d\.\s/.test(t)) f.push("Ordnungszahl mit Punkt");
  if (/\bgodz\./.test(t)) f.push("„godz.“ statt „o 8:00“");
  for (const m of t.matchAll(/(\d{1,2}):(\d{2})/g)) {
    if (Number(m[1]) > 23 || Number(m[2]) > 59) f.push(`keine Uhrzeit: ${m[0]}`);
  }
  return f;
}

/** Mail-Adressen nur mit der reservierten Endung `.example`; keine Webadresse, keine Telefonnummer. */
function adressFehler(t: string): string[] {
  const f: string[] = [];
  for (const m of t.matchAll(/\S+@\S+/g)) {
    if (!/^[a-z0-9.]+@([a-z0-9]+\.)*example$/.test(m[0].replace(/[.,;:!?"]+$/, ""))) f.push(`Adresse ${m[0]}`);
  }
  if (/www\.|https?:/.test(t)) f.push("Webadresse");
  if (/\+\d|\d{3} \d{3} \d{3}/.test(t)) f.push("Telefonnummer");
  return f;
}

/**
 * Rektion nach einer Ziffer (GLOSSAR-pl §2.10a): 1 ⇒ one, 2-4 und 22-24 … (nicht 12-14) ⇒ few, sonst many. Geprüft wird
 * nur, wo das Wort im Nominativ/Akkusativ stehen kann; nach einer Präposition mit Genitiv (`od 2 lat`, `około 3 tygodni`)
 * ist die many-Form richtig. Formen in anderen Fällen (`po 15 minutach`) stehen nicht in der Tabelle und werden nicht geprüft.
 */
const REKTION: readonly [string, string, string][] = [
  ["złoty", "złote", "złotych"], ["rok", "lata", "lat"], ["osoba", "osoby", "osób"], ["minuta", "minuty", "minut"],
  ["godzina", "godziny", "godzin"], ["tydzień", "tygodnie", "tygodni"], ["miesiąc", "miesiące", "miesięcy"],
  ["metr", "metry", "metrów"], ["kilometr", "kilometry", "kilometrów"], ["błąd", "błędy", "błędów"],
  ["kubek", "kubki", "kubków"], ["kontener", "kontenery", "kontenerów"], ["litr", "litry", "litrów"],
  ["punkt", "punkty", "punktów"], ["hektar", "hektary", "hektarów"], ["podpis", "podpisy", "podpisów"],
  ["karton", "kartony", "kartonów"], ["faktura", "faktury", "faktur"], ["kobieta", "kobiety", "kobiet"],
  ["piętro", "piętra", "pięter"], ["pytanie", "pytania", "pytań"], ["słowo", "słowa", "słów"], ["talerz", "talerze", "talerzy"],
];
const GENITIV_PRAEP = new Set(["od", "do", "z", "ze", "sprzed", "około", "bez", "dla", "u", "spod", "zza", "koło", "obok", "wokół"]);
function kategorie(n: number): 0 | 1 | 2 {
  if (n === 1) return 0;
  const e = n % 10;
  const z = n % 100;
  return e >= 2 && e <= 4 && !(z >= 12 && z <= 14) ? 1 : 2;
}
function rektionFehler(t: string): string[] {
  const f: string[] = [];
  for (const m of t.matchAll(/(?:(\p{L}+) )?(\d{1,3}(?: \d{3})*) (\p{L}+)/gu)) {
    const n = Number(m[2].replace(/ /g, ""));
    const wort = m[3].toLowerCase();
    const zeile = REKTION.find((r) => r.includes(wort));
    if (!zeile) continue;
    const ist = zeile.indexOf(wort);
    const soll = kategorie(n);
    if (zeile[1] === zeile[2] && ist >= 1 && soll >= 1) continue;
    const genitiv = GENITIV_PRAEP.has((m[1] ?? "").toLowerCase());
    if (ist === soll) continue;
    if (genitiv && ist === 2 && soll === 1) continue;
    f.push(`${m[2]} ${m[3]} (erwartet ${zeile[soll]})`);
  }
  return f;
}

/** € nur, wo im Ausland gezahlt oder verdient wird (die Zeile nennt den Ort ausserhalb Polens). */
const AUSLAND = /(Niemcz|Niemiec|Heringsdorf|Ahlbeck|Dortmund|Irlandi|Norwegi|Teksas)/u;
const euroFehler = (t: string): boolean => t.includes("€") && !AUSLAND.test(t);

describe("PL-S Erwachsene: Form jeder Zeile", () => {
  it("Form: Regeln aller pl-Zeilen, erlaubte Zeichen, gross am Anfang, ein Satz, 5-18 Wörter, höchstens 90 Zeichen", () => {
    const fehler = ZEILEN.flatMap((z) => formFehler(z, REGEL).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlformat, Adressen, Rektion nach Zahlen, € nur mit Auslandsbezug", () => {
    const fehler = ZEILEN.flatMap((z) => [...zahlFehler(z), ...adressFehler(z), ...rektionFehler(z)].map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.filter(euroFehler)).toEqual([]);
  });

  it("Gegenprobe: jede Form-, Zahl-, Adress-, Rektions- und €-Regel schlägt an", () => {
    expect(formFehler("Ewa jedzie do Bielsko-Białej autobusem.", REGEL).some((x) => x.startsWith("Bindestrich"))).toBe(true);
    expect(formFehler("Ewa jedzie do Monachium (Niemcy) autobusem.", REGEL)).toContain("Zeichen ausserhalb der erlaubten");
    expect(formFehler("Ewa mówi „dzień dobry” do sąsiadki.", REGEL).length).toBeGreaterThan(0);
    expect(formFehler("Kierowca pyta : dokąd jedziemy dzisiaj?", REGEL).length).toBeGreaterThan(0);
    expect(formFehler("Pociąg stoi. Ewa czeka na peronie.", REGEL)).toContain("mehr als ein Satz");
    expect(formFehler("\"Gotowe!\" Ewa zamyka laptopa w biurze.", REGEL)).toContain("mehr als ein Satz");
    expect(formFehler("ewa jedzie dziś do pracy autobusem.", REGEL)).toContain("kein Grossbuchstabe am Anfang");
    expect(formFehler("Ewa jedzie dziś do pracy autobusem", REGEL)).toContain("kein Satzschluss am Ende");
    expect(formFehler("Ewa jedzie dziś.", REGEL)).toContain("3 Wörter");
    expect(formFehler(`Ewa ${"bardzo ".repeat(18)}długo jedzie.`, REGEL).some((x) => x.endsWith("Wörter"))).toBe(true);
    expect(formFehler(`Ewa jedzie ${"a".repeat(85)} dziś.`, REGEL)).toContain("länger als 90 Zeichen");
    expect(formFehler("Powód jest prosty, to: brak czasu rano.", REGEL)).toContain("Doppelpunkt nach „to“ (im Polnischen ein Fehler)");
    expect(formFehler("\"Pociąg ma 20 minut opóźnienia!\" mówi konduktorka.", REGEL)).toEqual([]);
    expect(zahlFehler("Mieszkanie kosztuje 1.200 zł miesięcznie.")).toContain("Punkt zwischen Ziffern (Tausenderpunkt oder Dezimalpunkt)");
    expect(zahlFehler("Działka ma 2.5 hektara.")).toContain("Punkt zwischen Ziffern (Tausenderpunkt oder Dezimalpunkt)");
    expect(zahlFehler("Piła kosztuje 21000 zł.")).toContain("fünf oder mehr Stellen ohne Leerzeichen");
    expect(zahlFehler("Piła kosztuje 2 100 zł.")).toContain("vierstellige Zahl mit Leerzeichen");
    expect(zahlFehler("Rabat 20 % dziś.")).toContain("Leerzeichen vor %");
    expect(zahlFehler("Kawa kosztuje 9zł.")).toContain("Betrag nicht als „23 zł“ / „6 €“");
    expect(zahlFehler("Kawa kosztuje € 4 w Berlinie.")).toContain("Betrag nicht als „23 zł“ / „6 €“");
    expect(zahlFehler("Mieszka na 3. piętrze od roku.")).toContain("Ordnungszahl mit Punkt");
    expect(zahlFehler("Spotkanie o godz. 8 w biurze.")).toContain("„godz.“ statt „o 8:00“");
    expect(zahlFehler("Pociąg odjeżdża o 25:10.")).toContain("keine Uhrzeit: 25:10");
    expect(zahlFehler("O 7:15 płaci 21 000 zł i 23 zł, rabat 35%, w Berlinie 6 €.")).toEqual([]);
    expect(adressFehler("Napisz na ewa@gmail.com dzisiaj.")).toHaveLength(1);
    expect(adressFehler("Zajrzyj na www.urzad.pl dzisiaj.")).toHaveLength(1);
    expect(adressFehler("Zadzwoń pod 600 123 456 dzisiaj.")).toHaveLength(1);
    expect(adressFehler("Napisz na pomoc@faktury.example.")).toEqual([]);
    expect(rektionFehler("Bilet kosztuje 22 złotych.")).toHaveLength(1);
    expect(rektionFehler("Bilet kosztuje 25 złote.")).toHaveLength(1);
    expect(rektionFehler("Syn ma 5 lata.")).toHaveLength(1);
    expect(rektionFehler("Babcia ma 93 lat.")).toHaveLength(1);
    expect(rektionFehler("Kurs trwa 12 tygodnie.")).toHaveLength(1);
    expect(rektionFehler("Syn ma 22 lata, a córka 25 lat, od 2 lat w Lublinie, 2 dni i 5 dni, po 15 minutach.")).toEqual([]);
    expect(euroFehler("W Gdańsku kawa kosztuje 4 €.")).toBe(true);
    expect(euroFehler("W Heringsdorfie kawa kosztuje 4 €.")).toBe(false);
  });
});

// ── 2 · Form jeder Serie ────────────────────────────────────────────────────

function serienFehler(serien: SerieEntwurfPl[]): string[] {
  const p: string[] = [];
  const slugs = new Set<string>();
  const titel = new Set<string>();
  const fremde = [...SERIEN_PL_KIDS_1, ...SERIEN_PL_TEENS_1];
  const fremdeSlugs = new Set(fremde.map((s) => s.slug));
  const fremdeTitel = new Set(fremde.map((s) => s.titel.toLowerCase()));
  for (const s of serien) {
    p.push(...serienFormFehler(s, "erwachsen", 14, 16));
    if (!s.slug.startsWith("pl-erw-1-")) p.push(`${s.slug}: Slug-Vorsilbe`);
    if (!/^[a-z0-9-]+$/.test(s.slug)) p.push(`${s.slug}: Slug mit Sonderzeichen`);
    if (slugs.has(s.slug)) p.push(`${s.slug}: Slug doppelt`);
    if (titel.has(s.titel.toLowerCase())) p.push(`${s.slug}: Titel doppelt`);
    if (fremdeSlugs.has(s.slug) || fremdeTitel.has(s.titel.toLowerCase())) p.push(`${s.slug}: Slug oder Titel einer Kinder-/Jugend-Serie`);
    slugs.add(s.slug);
    titel.add(s.titel.toLowerCase());
    if (!s.topic || !s.ort) p.push(`${s.slug}: topic/ort leer`);
    if (!REGEL.erlaubt.test(s.titel)) p.push(`${s.slug}: Zeichen im Titel`);
    if (s.minTier === undefined) p.push(`${s.slug}: minTier fehlt`);
    else if (computeSerieMinTier(s as unknown as Serie, "pl") !== s.minTier) {
      p.push(`${s.slug}: minTier ${s.minTier}, gerechnet ${computeSerieMinTier(s as unknown as Serie, "pl")}`);
    }
  }
  return p;
}

describe("PL-S Erwachsene: Form jeder Serie", () => {
  it("die Serien haben keine Form-Probleme", () => {
    const p = serienFehler(SERIEN_E);
    expect(p, p.join("\n")).toEqual([]);
  });

  it("20 Serien, 19 mit 2 Etappen und genau eine mit 3", () => {
    expect(SERIEN_E.length).toBe(20);
    expect(SERIEN_E.filter((s) => s.etappen.length === 3).length).toBe(1);
    expect(SERIEN_E.filter((s) => s.etappen.length === 2).length).toBe(19);
  });

  it("jede Serie besteht `validateSerie(s, \"pl\")`", () => {
    for (const s of SERIEN_E) {
      const { ok, problems } = validateSerie(s as unknown as Serie, "pl");
      expect(ok, `${s.slug}: ${problems.join("; ")}`).toBe(true);
    }
  });

  it("mindestens 12 Serien üben Ziffern, mindestens 6 kommen ohne (sie öffnen früher); % € @ : / ? ! \" kommen vor", () => {
    const mit = SERIEN_E.filter((s) => zeilenVon(s).some((l) => /\d/.test(l))).length;
    expect(mit).toBeGreaterThanOrEqual(12);
    expect(SERIEN_E.length - mit).toBeGreaterThanOrEqual(6);
    const text = ZEILEN.join(" ");
    for (const z of ["%", "€", "@", ":", "/", "?", "!", '"']) expect(text, z).toContain(z);
  });

  it("Gegenprobe: falsche Etappenzahl, Zeilenzahl, Schluss ohne Spannung, minTier, Slug, Stufe, Herkunft, Woiwodschaft", () => {
    const b = (): SerieEntwurfPl => kopie(SERIEN_E[1]);
    const s1 = b();
    s1.etappen = s1.etappen.slice(0, 1);
    expect(serienFehler([s1]).some((x) => x.includes("1 Etappen"))).toBe(true);
    const s2 = b();
    s2.etappen[0].lines = s2.etappen[0].lines.slice(0, 13);
    expect(serienFehler([s2]).some((x) => x.includes("13 Zeilen"))).toBe(true);
    const s3 = b();
    s3.etappen[0].lines[s3.etappen[0].lines.length - 1] = "Zbigniew wraca spokojnie do domu.";
    expect(serienFehler([s3]).some((x) => x.includes("E1: endet ohne"))).toBe(true);
    const s4 = b();
    s4.minTier = 1;
    expect(serienFehler([s4]).some((x) => x.includes("minTier 1"))).toBe(true);
    const s5 = b();
    delete s5.minTier;
    expect(serienFehler([s5]).some((x) => x.includes("minTier fehlt"))).toBe(true);
    expect(serienFehler([b(), b()]).some((x) => x.includes("Slug doppelt"))).toBe(true);
    expect(serienFehler([{ ...b(), slug: "erwachsen-falsch" }]).some((x) => x.includes("Slug-Vorsilbe"))).toBe(true);
    expect(serienFehler([{ ...b(), stufen: ["teens"] }]).some((x) => x.includes("stufen"))).toBe(true);
    expect(serienFehler([{ ...b(), herkunft: { quelle: "Tatoeba", lizenz: "CC BY" } }]).some((x) => x.includes("herkunft"))).toBe(true);
    expect(serienFehler([{ ...b(), land: "bawarskie" as SerieEntwurfPl["land"] }]).some((x) => x.includes("land bawarskie"))).toBe(true);
    expect(serienFehler([{ ...b(), titel: "Bardzo długi tytuł tej serii o wycinankach" }]).some((x) => x.includes("Titel zu lang"))).toBe(true);
    const s6 = b();
    s6.minTier = (((s6.minTier as number) + 1) % 6) as SerieEntwurfPl["minTier"];
    expect(validateSerie(s6 as unknown as Serie, "pl").ok).toBe(false);
  });
});

// ── 3 · Namen, auch nach dem Kürzen ─────────────────────────────────────────

describe("PL-S Erwachsene: Namen", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein Eigenname DIESER Serie; jeder Eigenname kommt vor", () => {
    const fehler = SERIEN_E.flatMap((s) => {
      const namen = namenVon(s);
      return zeilenVon(s).flatMap((z) => fremdeGrosswoerter(z, namen).map((w) => `${s.slug}: "${z}": ${w}`));
    });
    expect(fehler, fehler.join("\n")).toEqual([]);
    const ungenutzt = SERIEN_E.flatMap((s) => s.eigennamen.filter((n) => !zeilenVon(s).some((l) => l.includes(n))).map((n) => `${s.slug}: ${n}`));
    expect(ungenutzt).toEqual([]);
  });

  it("auch in jeder GEKÜRZTEN Fassung (vor ? ! \" :) steht kein fremdes Grosswort mitten im Satz", () => {
    const fehler = SERIEN_E.flatMap((s) => {
      const namen = namenVon(s);
      return zeilenVon(s).flatMap((z) => gekuerztFehler(z, namen).map((w) => `${s.slug}: "${z}": ${w}`));
    });
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein fremder Name, eine Rede hinten, ein Grosswort nach dem Doppelpunkt werden gefunden", () => {
    const namen = new Set(["ewa"]);
    expect(fremdeGrosswoerter("Jutro przyjeżdża Marek z Lublina.", namen)).toEqual(["Marek", "Lublina"]);
    expect(fremdeGrosswoerter("Jutro przyjeżdża Ewa z pracy.", namen)).toEqual([]);
    expect(fremdeGrosswoerter("\"Gdzie jest dworzec?\" pyta Ewa.", namen)).toEqual([]);
    expect(gekuerztFehler("Kasjerka pyta: \"Gotówką czy kartą?\"", namen).length).toBeGreaterThan(0);
    expect(gekuerztFehler("Na drzwiach wisi kartka \"Zamknięte do jutra\".", namen).length).toBeGreaterThan(0);
    expect(gekuerztFehler("\"Gdzie jest dworzec?\" pyta Ewa w kolejce.", namen)).toEqual([]);
  });
});

// ── 4 · Polska w całości ────────────────────────────────────────────────────

describe("PL-S Erwachsene: alle 16 Woiwodschaften", () => {
  it("jede Woiwodschaft mindestens einmal, keine mehr als zweimal", () => {
    const m = proWoiwodschaft(SERIEN_E);
    const fehler = [...m].filter(([, n]) => n < 1 || n > 2).map(([w, n]) => `${w}: ${n}`);
    expect(fehler).toEqual([]);
    expect(m.size).toBe(WOIWODSCHAFTEN_PL.length);
  });

  it("Gegenprobe: eine fehlende und eine dreifache Woiwodschaft werden gemeldet", () => {
    const m = proWoiwodschaft([{ land: "łódzkie" }, { land: "łódzkie" }, { land: "łódzkie" }]);
    expect(m.get("łódzkie")).toBe(3);
    expect(m.get("podlaskie")).toBe(0);
  });
});

// ── 5 · Anrede, Geschlecht, Feiertage, Politik, Etikett ─────────────────────

/**
 * ⚠️ `politikIn` aus dem Helfer prüft `rząd(?!ek)` OHNE Wortanfang und trifft darum auch `zarząd` (der Vorstand einer
 * Genossenschaft), `porządek` und `urządzać` (gemessen 09.10.2026 an dieser Charge: sieben Zeilen, keine über Politik).
 * Umgangen, nicht geändert (der Helfer gehört allen drei Wächtern): diese drei Wortfamilien fallen vor der Prüfung weg -
 * `rząd`, `rządu`, `rządzie` usw. als eigenes Wort treffen weiter (Gegenprobe unten).
 */
const politikInHier = (z: string): boolean => politikIn(z.replace(/(?<!\p{L})(za|po|u)rząd\p{L}*/giu, " "));

describe("PL-S Erwachsene: keine Anrede, kein Geschlecht der tippenden Person, keine Feiertage, keine Politik, kein Etikett", () => {
  it("keine Zeile und kein Titel verstösst", () => {
    const texte = [...ZEILEN, ...SERIEN_E.map((s) => s.titel)];
    expect(texte.filter((z) => ANREDE.test(z))).toEqual([]);
    expect(texte.filter(geschlechtFehler)).toEqual([]);
    expect(texte.filter(feiertagIn)).toEqual([]);
    expect(texte.filter(politikInHier)).toEqual([]);
    expect(texte.filter(etikettIn)).toEqual([]);
  });

  it("Gegenprobe: jede Regel schlägt an, harmlose Zeilen nicht", () => {
    expect(ANREDE.test("Proszę pani, gdzie jest okienko?")).toBe(true);
    expect(ANREDE.test("\"Czy pan czeka na autobus?\" pyta Ewa.")).toBe(true);
    expect(ANREDE.test("Na panelu świeci się zielona lampka.")).toBe(false);
    expect(geschlechtFehler("Wczoraj byłam w urzędzie!")).toBe(true);
    expect(geschlechtFehler("\"Kupiliśmy już bilety\", mówi Ewa.")).toBe(true);
    expect(geschlechtFehler("\"Jestem zmęczona\", wzdycha Ewa.")).toBe(true);
    expect(geschlechtFehler("Marek był wczoraj w urzędzie gminy.")).toBe(false);
    expect(feiertagIn("Na Wigilię jedziemy do babci.")).toBe(true);
    expect(feiertagIn("W niedzielę idą do kościoła.")).toBe(true);
    expect(feiertagIn("Kielce leżą w województwie świętokrzyskim.")).toBe(false);
    expect(politikIn("Przed wyborami w Sejmie jest gorąco.")).toBe(true);
    expect(politikIn("Minister ogłasza nowe przepisy.")).toBe(true);
    expect(politikIn("W pierwszym rzędzie siedzi sołtys.")).toBe(false);
    expect(politikIn("Zarząd spółdzielni zaprasza na zebranie.")).toBe(true); // die Lücke im Helfer, gemessen
    expect(politikInHier("Zarząd spółdzielni zaprasza na zebranie.")).toBe(false);
    expect(politikInHier("Stolarnię urządza w oborze, a w hangarze panuje porządek.")).toBe(false);
    expect(politikInHier("Rząd ogłasza nowe przepisy.")).toBe(true);
    expect(politikInHier("Prezes zarządu krytykuje decyzję rządu.")).toBe(true);
    expect(politikInHier("Minister ogłasza nowe przepisy.")).toBe(true);
    expect(etikettIn("Niewidomy kolega czyta pismem Braille'a.")).toBe(true);
    expect(etikettIn("Hanna pracuje z czytnikiem ekranu.")).toBe(false);
  });
});

// ── 6 · Wortschatz ──────────────────────────────────────────────────────────

/**
 * Formen, die weder in der Wortbasis (`BASIS`: Wortschatz + jede pl-Korpuszeile) noch unter den Eigennamen ihrer Serie
 * stehen - je mit Grundform und Form (kein Wörterbuch für Polnisch auf diesem Rechner, Falle 61). Der Wächter prüft beide
 * Richtungen: jedes ungeprüfte Wort steht hier, und hier steht nichts, was nicht gebraucht wird oder ohnehin bekannt ist.
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  aerodynamiki: "aerodynamika, Gen. Sg.", albumu: "album, Gen. Sg.", angielce: "angielka (łódzkie Brot), Lok. Sg.",
  angielka: "angielka (Łódź: bułka paryska), Nom. Sg.", angielkę: "angielka, Akk. Sg.", aptece: "apteka, Lok. Sg.",
  areszt: "areszt, Nom. Sg. (areszt domowy)", argumentów: "argument, Gen. Pl.", asap: "asap, Anglizismus im Büro (Zitat der Handlung)",
  balkonikiem: "balkonik (Gehhilfe), Instr. Sg.", belek: "belka, Gen. Pl.", belkę: "belka, Akk. Sg.", belki: "belka, Akk. Pl.",
  bezwzrokowego: "bezwzrokowy, Gen. Sg. n. (pisanie bezwzrokowe, GLOSSAR §1 Nr. 4)", białoruskim: "białoruski, Instr. Sg. m.",
  biurowy: "biurowy, Akk. Sg. m. (unbelebt)", borówek: "borówka, Gen. Pl.", brajlowską: "brajlowski, Akk. Sg. f. (linijka brajlowska)",
  brygady: "brygada, Gen. Sg.", brygadzie: "brygada, Lok. Sg.", brygadzistą: "brygadzista, Instr. Sg.", brygadzistka: "brygadzistka, Nom. Sg.",
  budował: "budować, 3. Sg. m. Prät. (Dziadek)", bus: "bus, Nom. Sg. (Kleinbus)", busem: "bus, Instr. Sg.", busik: "busik, Nom. Sg. (Verkleinerung von bus)",
  buźkę: "buźka (Emoji), Akk. Sg.", ceramicy: "ceramik, Nom. Pl. m.-pers.", chałupie: "chałupa, Lok. Sg.", chętnych: "chętny, Gen. Pl. (substantiviert)",
  chmiel: "chmiel, Akk. Sg.", chodzeniu: "chodzenie, Lok. Sg.", chrząka: "chrząkać, 3. Sg.", ciągnik: "ciągnik, Akk. Sg.",
  ciekawością: "ciekawość, Instr. Sg.", cieśla: "cieśla, Nom. Sg.", ciśnieniomierza: "ciśnieniomierz, Gen. Sg.", cyfry: "cyfra, Akk. Pl.",
  cyrylicą: "cyrylica, Instr. Sg.", czcionką: "czcionka, Instr. Sg.", czterocyfrowy: "czterocyfrowy, Nom. Sg. m.", czysto: "czysto, Adverb",
  czytelni: "czytelnia, Lok. Sg.", czytelnik: "czytelnik, Nom. Sg.", ćwiczą: "ćwiczyć, 3. Pl.", ćwiczeniu: "ćwiczenie, Lok. Sg.",
  daily: "daily, Anglizismus im Büro (Zitat der Handlung)", dancingu: "dancing, Lok. Sg.", dekadę: "dekada, Akk. Sg.", deklaruje: "deklarować, 3. Sg.",
  dębowe: "dębowy, Akk. Pl. (schody)", dobiegają: "dobiegać, 3. Pl. (dobiegać końca)", dogada: "dogadać się, 3. Sg. Fut.", dokumentacja: "dokumentacja, Nom. Sg.",
  dolne: "dolny, Nom. Pl.", dołącza: "dołączać, 3. Sg.", dopisał: "dopisać, 3. Sg. m. Prät. (Adam)", dopisuje: "dopisywać, 3. Sg.",
  dopłacą: "dopłacić, 3. Pl. Fut.", dopytuje: "dopytywać, 3. Sg.", doradczyni: "doradczyni, Nom. Sg.", dorzuca: "dorzucać, 3. Sg.",
  dotacja: "dotacja, Nom. Sg.", dotacjach: "dotacja, Lok. Pl.", drabinie: "drabina, Lok. Sg.", druh: "druh, Nom. Sg. (Anrede in der OSP)",
  drukuj: "drukować, Imperativ 2. Sg. (Name eines Schalters)", dwunastoletnia: "dwunastoletni, Nom. Sg. f.", dyżury: "dyżur, Akk./Nom. Pl.",
  dziecięce: "dziecięcy, Akk. Pl.", dziennika: "dziennik (Bordbuch), Gen. Sg.", egzemplarze: "egzemplarz, Akk. Pl.", ekranów: "ekran, Gen. Pl.",
  elektronicznie: "elektronicznie, Adverb", emerytowany: "emerytowany, Nom. Sg. m.", esemes: "esemes, Nom. Sg. (wie esemesem in PL-T9)", etap: "etap, Akk. Sg.",
  fabryczna: "fabryczny, Nom. Sg. f.", fachowych: "fachowy, Gen. Pl.", fakturę: "faktura, Akk. Sg.", familok: "familok (śląskie Arbeiterhaus), Nom. Sg.",
  familoka: "familok, Gen. Sg.", famule: "famuła (łódzkie Arbeiterhaus), Lok. Sg.", famuła: "famuła, Nom. Sg.", farmaceutka: "farmaceutka, Nom. Sg.",
  feedback: "feedback, Anglizismus im Büro (Zitat der Handlung)", filii: "filia, Lok. Sg.", filtr: "filtr, Akk. Sg.", fizjoterapeutka: "fizjoterapeutka, Nom. Sg.",
  formatową: "formatowy, Akk. Sg. f. (piła formatowa)", fotografuje: "fotografować, 3. Sg.", garbi: "garbić się, 3. Sg.", gazetki: "gazetka, Gen. Sg.",
  gąbką: "gąbka, Instr. Sg.", gbur: "gbur, Nom. Sg. (kaszubisch: Bauer; Gegenstand der Zeile)", geodetą: "geodeta, Instr. Sg.", gestów: "gest, Gen. Pl.",
  gmin: "gmina, Gen. Pl.", gminą: "gmina, Instr. Sg.", gospodynie: "gospodyni, Nom. Pl.", gospodyń: "gospodyni, Gen. Pl. (koło gospodyń wiejskich)",
  gotowych: "gotowy, Gen. Pl.", górnicy: "górnik, Nom. Pl.", górnicze: "górniczy, Akk. Sg. n. (technikum)", górnika: "górnik, Gen. Sg.",
  gratulacjami: "gratulacje, Instr. Pl.", gratuluje: "gratulować, 3. Sg.", grochu: "groch, Gen. Sg.", grubej: "gruby, Lok. Sg. f. (koperta)",
  gwarach: "gwara, Lok. Pl.", hangarze: "hangar, Lok. Sg.", harmonogramu: "harmonogram, Gen. Sg.", hutnik: "hutnik, Nom. Sg.",
  informacyjną: "informacyjny, Akk. Sg. f. (karta informacyjna)", instalatora: "instalator, Gen. Sg.",
  instaluje: "instalować, 3. Sg.", instruktorką: "instruktorka, Instr. Sg.", jabłoniami: "jabłoń, Instr. Pl.", jednorodzinnym: "jednorodzinny, Lok. Sg. m.",
  jednostka: "jednostka (OSP), Nom. Sg.", kabina: "kabina, Nom. Sg.", kabinie: "kabina, Lok. Sg.", kalendarze: "kalendarz, Akk. Pl.",
  kaligrafii: "kaligrafia, Gen. Sg.", kamieniołomie: "kamieniołom, Lok. Sg.", kamieniołomu: "kamieniołom, Gen. Sg.", 
  kantorze: "kantor, Lok. Sg.", kartonów: "karton, Gen. Pl.", kartony: "karton, Akk. Pl.", kartuskim: "kartuski (aus Kartuzy), Lok. Sg. m.",
  kasuje: "kasować, 3. Sg.", kaszubskich: "kaszubski, Gen. Pl.", kaszubskie: "kaszubski, Akk. Pl.", kaszubskiego: "kaszubski, Gen. Sg. (Sprache)",
  kierowniczkę: "kierowniczka, Akk. Sg.", kijki: "kijek, Akk. Pl.", kinowej: "kinowy, Lok. Sg. f.", kiwa: "kiwać, 3. Sg. (kiwać głową)",
  kocem: "koc, Instr. Sg.", kodra: "kodra (łowicka wycinanka), Nom. Sg.", kodry: "kodra, Gen. Sg.",
  koleżankami: "koleżanka, Instr. Pl.", kolorowego: "kolorowy, Gen. Sg. m.", kołami: "koło, Instr. Pl.", kołnierze: "kołnierz, Akk. Pl.",
  kombinacji: "kombinacja, Gen. Pl.", konkretna: "konkretny, Nom. Sg. f.", konkurencji: "konkurencja, Gen. Sg.", konkurencyjnej: "konkurencyjny, Gen. Sg. f.",
  konstrukcji: "konstrukcja, Gen. Sg.", kontener: "kontener, Akk. Sg.", kontenerem: "kontener, Instr. Sg.", kontenerów: "kontener, Gen. Pl.",
  końcówkach: "końcówka, Lok. Pl.", kopał: "kopać, 3. Sg. m. Prät. (górnik)", kopiować: "kopiować, Infinitiv", korytarz: "korytarz, Akk. Sg.",
  krakowskie: "krakowski, Nom. Sg. n.", krańcówka: "krańcówka (Endhaltestelle), Nom. Sg.", krawężnikiem: "krawężnik, Instr. Sg.", kremowym: "kremowy, Lok. Sg. n.",
  kręgosłupa: "kręgosłup, Gen. Sg.", krosnach: "krosno, Lok. Pl.", kubków: "kubek, Gen. Pl.", kufer: "kufer, Nom. Sg.", kulami: "kula (Krücke), Instr. Pl.",
  kursant: "kursant, Nom. Sg.", kurtką: "kurtka, Instr. Sg.", kurzy: "kurzyć się, 3. Sg.", ladą: "lada, Instr. Sg. (za ladą)", lampki: "lampka, Akk. Pl.",
  laptopem: "laptop, Instr. Sg.", latarni: "latarnia, Gen. Sg.", leczyła: "leczyć, 3. Sg. f. Prät. (Iryna)", lepienia: "lepienie, Gen. Sg.", listą: "lista, Instr. Sg.",
  listonoszka: "listonoszka, Nom. Sg.", literówki: "literówka, Gen. Sg.", logistyczna: "logistyczny, Nom. Sg. f.", lotniczych: "lotniczy, Gen. Pl.",
  luźną: "luźny, Akk. Sg. f.", łacińskich: "łaciński, Gen. Pl.", ładowarki: "ładowarka, Gen. Sg.", łódzkich: "łódzki, Gen. Pl.", łubiankę: "łubianka (Obstkorb), Akk. Sg.",
  malarka: "malarka, Nom. Sg.", malarni: "malarnia, Lok. Sg.", manufakturę: "manufaktura, Akk. Sg.", manufaktury: "manufaktura, Gen. Sg.",
  marudzi: "marudzić, 3. Sg.", maszyn: "maszyna, Gen. Pl.", mechaników: "mechanik, Gen. Pl.", mieszały: "mieszać, 3. Pl. f./n. Prät. (dzieci)",
  mieszanką: "mieszanka, Instr. Sg.", mieszkanka: "mieszkanka, Nom. Sg.", mieszkanką: "mieszkanka, Instr. Sg.", mikrofonu: "mikrofon, Gen. Sg.",
  milknie: "milknąć, 3. Sg.", miną: "minąć, 3. Pl. Fut.", minutnikiem: "minutnik, Instr. Sg.", młodszymi: "młodszy, Instr. Pl.", mnóstwa: "mnóstwo, Gen. Sg.",
  mocniejszy: "mocniejszy, Akk. Sg. m. (unbelebt)", motorniczy: "motorniczy, Nom. Sg. (Straßenbahnfahrer)", murami: "mur, Instr. Pl.", nabrzeże: "nabrzeże, Akk. Sg.",
  naczelniczka: "naczelniczka, Nom. Sg.", naczelniczki: "naczelniczka, Gen. Sg.", nagrał: "nagrać, 3. Sg. m. Prät. im żeby-Satz (ojciec)", nagraniem: "nagranie, Instr. Sg.",
  najdłużej: "najdłużej, Superlativ des Adverbs", najpewniejsze: "najpewniejszy, Akk. Pl.", namawia: "namawiać, 3. Sg.", namiotem: "namiot, Instr. Sg.",
  napisem: "napis, Instr. Sg.", naprawiała: "naprawiać, 3. Sg. f. Prät. (Agata)", nauczycielki: "nauczycielka, Akk. Pl.", niedopalonych: "niedopalony, Gen. Pl.",
  niespodziewaną: "niespodziewany, Instr. Sg. f.", nieufnością: "nieufność, Instr. Sg.", norwesku: "po norwesku, Adverb", notuje: "notować, 3. Sg.",
  nożyc: "nożyce, Gen. Pl.", obiecuje: "obiecywać, 3. Sg.", obite: "obity, Akk. Pl.", objechać: "objechać, Infinitiv", oblicza: "obliczać, 3. Sg.",
  oborze: "obora, Lok. Sg.", obsługiwała: "obsługiwać, 3. Sg. f. Prät. (matka)", ochotniczej: "ochotniczy, Lok. Sg. f.", oczko: "oczko, Nom. Sg. (pawie oczko)",
  odczytuje: "odczytywać, 3. Sg.", oddziale: "oddział, Lok. Sg.", odmian: "odmiana, Gen. Pl.", odmianach: "odmiana, Lok. Pl.", odnowionej: "odnowiony, Lok. Sg. f.",
  odpisywać: "odpisywać, Infinitiv", odporne: "odporny, Akk. Pl.", odstawia: "odstawiać, 3. Sg.", odszkodowanie: "odszkodowanie, Nom. Sg.",
  ofertami: "oferta, Instr. Pl.", ogonkiem: "ogonek, Instr. Sg.", ogonków: "ogonek, Gen. Pl.", okiennic: "okiennica, Gen. Pl.", okiennice: "okiennica, Nom. Pl.",
  oknami: "okno, Instr. Pl.", okularami: "okulary, Instr. Pl.", onboarding: "onboarding, Anglizismus im Büro (Gegenstand der Serie)", opiekuna: "opiekun, Akk. Sg.",
  opisem: "opis, Instr. Sg.", opisu: "opis, Gen. Sg.", opisy: "opis, Nom./Akk. Pl.", oprowadza: "oprowadzać, 3. Sg.", opryskiwacz: "opryskiwacz, Akk. Sg.",
  ordynator: "ordynator, Nom. Sg.", osłabnie: "osłabnąć, 3. Sg. Fut.", osłonie: "osłona, Lok. Sg.", ośrodka: "ośrodek, Gen. Sg.", ośrodku: "ośrodek, Lok. Sg.",
  owinięte: "owinięty, Nom. Pl.", paleta: "paleta, Nom. Sg.", pamiątkowe: "pamiątkowy, Akk. Pl.", papierem: "papier, Instr. Sg.", parska: "parskać, 3. Sg.",
  parteru: "parter, Gen. Sg.", paryską: "paryski, Instr. Sg. f. (bułka paryska)", pawie: "pawi, Nom. Sg. n. (pawie oczko)", pawim: "pawi, Instr. Sg. n.",
  pewniej: "pewnie, Komparativ", pęka: "pękać, 3. Sg.", pieluchy: "pielucha, Nom. Pl.", pierogów: "pieróg, Gen. Pl.", pięćdziesiątką: "pięćdziesiątka, Instr. Sg.",
  pilnują: "pilnować, 3. Pl.", pilotów: "pilot, Gen. Pl.", piłę: "piła, Akk. Sg.", pisemny: "pisemny, Nom. Sg. m.", piszczy: "piszczeć, 3. Sg.",
  piżamie: "piżama, Lok. Sg.", planami: "plan, Instr. Pl.", płasko: "płasko, Adverb", pobliskiego: "pobliski, Gen. Sg. n.", pobocze: "pobocze, Akk. Sg.",
  podchwytliwych: "podchwytliwy, Gen. Pl.", podejmie: "podjąć się, 3. Sg. Fut.", podjeździe: "podjazd, Lok. Sg.", podłużna: "podłużny, Nom. Sg. f.",
  podnośnikiem: "podnośnik, Instr. Sg.", podpisuje: "podpisywać, 3. Sg.", podsumowuje: "podsumowywać, 3. Sg.", podsuwa: "podsuwać, 3. Sg.",
  podsuwają: "podsuwać, 3. Pl.", pogniótł: "pognieść się, 3. Sg. m. Prät. (papier)", pokryje: "pokryć, 3. Sg. Fut.", polisę: "polisa, Akk. Sg.",
  polonistka: "polonistka, Nom. Sg.", polską: "polski, Akk. Sg. f.", pomarańczowa: "pomarańczowy, Nom. Sg. f.", pomp: "pompa, Gen. Pl.", pompą: "pompa, Instr. Sg.",
  pompę: "pompa, Akk. Sg.", poprawnych: "poprawny, Gen. Pl.", postanawia: "postanawiać, 3. Sg.", postanawiają: "postanawiać, 3. Pl.", powierza: "powierzać, 3. Sg.",
  powtarzane: "powtarzany, Akk. Sg. n.", poznańską: "poznański, Instr. Sg. f.", pożarnej: "pożarny, Lok. Sg. f. (straż pożarna)", praktycznych: "praktyczny, Lok. Pl.",
  prasuje: "prasować, 3. Sg.", pretensji: "pretensja, Gen. Pl.", progów: "próg, Gen. Pl.", programistka: "programistka, Nom. Sg.", programistką: "programistka, Instr. Sg.",
  programistko: "programistka, Vokativ (im Esemes des Vaters)", promenadą: "promenada, Instr. Sg.", proponują: "proponować, 3. Pl.", prostokątna: "prostokątny, Nom. Sg. f.",
  proszą: "prosić, 3. Pl.", protokoły: "protokół, Akk. Pl.", przekłada: "przekładać (übersetzen), 3. Sg.", przeliczać: "przeliczać, Infinitiv",
  przeniesione: "przeniesiony, Nom. Sg. n.", przepisuje: "przepisywać, 3. Sg.", przepracowała: "przepracować, 3. Sg. f. Prät. (Bogusława)", przesuwa: "przesuwać się, 3. Sg.",
  przetnie: "przeciąć, 3. Sg. Fut.", przyciski: "przycisk, Akk. Pl.", przycisków: "przycisk, Gen. Pl.", przyjmą: "przyjąć, 3. Pl. Fut.", przykrywa: "przykrywać, 3. Sg.",
  pułapek: "pułapka, Gen. Pl.", pyłu: "pył, Gen. Sg.", redakcja: "redakcja, Nom. Sg.", redakcji: "redakcja, Gen. Sg.", regałami: "regał, Instr. Pl.",
  regionalizmach: "regionalizm, Lok. Pl.", reklamacja: "reklamacja, Nom. Sg.", rekruterka: "rekruterka, Nom. Sg.", relacjonuje: "relacjonować, 3. Sg.",
  remizy: "remiza, Gen. Sg.", remontowy: "remontowy, Nom. Sg. m.", resztą: "reszta, Instr. Sg. (gorzej z resztą)", robiły: "robić, 3. Pl. f. Prät. (palce, Vergleich)",
  robotniczy: "robotniczy, Nom. Sg. m.", rolniczych: "rolniczy, Gen. Pl.", rozbawił: "rozbawić, 3. Sg. m. Prät. (tekst)", rozgląda: "rozglądać się, 3. Sg.",
  rozładowuje: "rozładowywać, 3. Sg.", rozładunku: "rozładunek, Gen. Sg.", rozpisuje: "rozpisywać, 3. Sg.", rozwiązywał: "rozwiązywać, 3. Sg. m. Prät. (Tomasz)",
  rozwiesza: "rozwieszać, 3. Sg.", rozwijanie: "rozwijanie, Akk. Sg.", rupiecie: "rupieć, Akk. Pl.", rurę: "rura, Akk. Sg.", 
  rysunkom: "rysunek, Dat. Pl.", rysunków: "rysunek, Gen. Pl.", rzeczoznawca: "rzeczoznawca, Nom. Sg.", rzędami: "rząd (Reihe), Instr. Pl.", rzędów: "rząd (Reihe), Gen. Pl.",
  sadzić: "sadzić, Infinitiv", sadził: "sadzić, 3. Sg. m. Prät. (ojciec)", sąsiadki: "sąsiadka, Nom. Pl.", sąsiadkom: "sąsiadka, Dat. Pl.", sąsiedniej: "sąsiedni, Gen. Sg. f.",
  sąsiednim: "sąsiedni, Lok. Sg. m.", schodkiem: "schodek, Instr. Sg.", semestru: "semestr, Gen. Sg.", siatce: "siatka, Lok. Sg.", siedemdziesiątce: "siedemdziesiątka, Lok. Sg.",
  siedziba: "siedziba, Nom. Sg.", siedzibie: "siedziba, Lok. Sg.", silników: "silnik, Gen. Pl.", skanuje: "skanować, 3. Sg.",
  slot: "slot, Anglizismus im Büro (Zitat der Handlung)", słowniczek: "słowniczek, Akk. Sg.", słupek: "słupek, Nom. Sg.", solankowa: "solankowy, Nom. Sg. f.",
  sołtys: "sołtys, Nom. Sg.", spisała: "spisać, 3. Sg. f. Prät. im żeby-Satz (Bogusława)", spisuje: "spisywać, 3. Sg.", spodem: "spód, Instr. Sg. (pod spodem)",
  spółdzielni: "spółdzielnia, Gen. Sg.", spółgłosek: "spółgłoska, Gen. Pl.", sprawdzał: "sprawdzać, 3. Sg. m. Prät. (nikt)", spróchniałe: "spróchniały, Nom. Pl.",
  sprzedawczyni: "sprzedawczyni, Nom. Sg.", sprzęgło: "sprzęgło, Nom. Sg.", spychają: "spychać, 3. Pl.", stemplowany: "stemplowany, Nom. Sg. m.",
  stempluje: "stemplować, 3. Sg.", stodołę: "stodoła, Akk. Sg.", stolarni: "stolarnia, Gen./Dat. Sg.", stolarnię: "stolarnia, Akk. Sg.", stoper: "stoper, Akk. Sg.",
  straganie: "stragan, Lok. Sg.", straży: "straż, Lok. Sg.", streszcza: "streszczać, 3. Sg.", strzyżono: "strzyc, unpersönliche -no-Form",
  stuleciu: "stulecie, Lok. Sg.", susze: "susza, Akk. Pl.", swojomu: "po swojomu, Adverb (Podlasie)", synowej: "synowa, Gen. Sg.", syrenie: "syrena, Lok. Sg.",
  szablon: "szablon, Akk. Sg.", szacuje: "szacować, 3. Sg.", szarej: "szary, Lok. Sg. f.", szarpnięcia: "szarpnięcie, Gen. Sg.", szolka: "szolka (śląskie Tasse), Nom. Sg.",
  szolką: "szolka, Instr. Sg.", sztygara: "sztygar, Akk. Sg.", sztygarowi: "sztygar, Dat. Sg.", szukania: "szukanie, Gen. Sg.", szychcie: "szychta (śląskie Schicht), Lok. Sg.",
  szychta: "szychta, Nom. Sg.", szychtę: "szychta, Akk. Sg.", szyld: "szyld, Nom. Sg.", ścierkę: "ścierka, Akk. Sg.", ścinków: "ścinek, Gen. Pl.",
  śrubą: "śruba, Instr. Sg.", śrubę: "śruba, Akk. Sg.", świeczce: "świeczka, Lok. Sg.", tabletkach: "tabletka, Lok. Pl.",
  takk: "takk, norwegisch „danke“ im Mund eines Kindes (Zitat, ein Wort)", tanecznym: "taneczny, Lok. Sg. m.", tańcach: "taniec, Lok. Pl.",
  task: "task, Anglizismus im Büro (Zitat der Handlung)", tekstem: "tekst, Instr. Sg.", tekturę: "tektura, Akk. Sg.", teleporadę: "teleporada, Akk. Sg.",
  terminem: "termin, Instr. Sg.", testerką: "testerka, Instr. Sg.", testowych: "testowy, Gen. Pl.", tężni: "tężnia (Gradierwerk), Gen. Sg.",
  tkackiej: "tkacki, Gen. Sg. f.", tkaczką: "tkaczka, Instr. Sg.", tłoczenia: "tłoczenie, Gen. Sg.", tłocznia: "tłocznia, Nom. Sg.", tłoczy: "tłoczyć, 3. Sg.",
  traktor: "traktor, Nom. Sg.", traktora: "traktor, Gen. Sg.", traktory: "traktor, Nom. Pl.", tramwajach: "tramwaj, Lok. Pl.", transportowej: "transportowy, Lok. Sg. f.",
  ubezpieczeniowej: "ubezpieczeniowy, Gen. Sg. f.", ubezpieczyciela: "ubezpieczyciel, Gen. Sg.", udostępnia: "udostępniać, 3. Sg.", ukaże: "ukazać się, 3. Sg. Fut.",
  ukraińskiego: "ukraiński, Gen. Sg. (Sprache)", ulotkę: "ulotka, Akk. Sg.", uprawiał: "uprawiać, 3. Sg. m. Prät. (Wacław)", urządza: "urządzać, 3. Sg.",
  ustalają: "ustalać, 3. Pl.", ustawia: "ustawiać, 3. Sg.", usterkę: "usterka, Akk. Sg.", usuwa: "usuwać, 3. Sg.", uśmiechniętą: "uśmiechnięty, Akk. Sg. f.",
  walca: "walc, Gen. Sg.", warsztatem: "warsztat, Instr. Sg.", warsztatu: "warsztat, Gen. Sg.", ważniejszych: "ważniejszy, Gen. Pl.", wdrożenie: "wdrożenie, Nom. Sg.",
  wdychają: "wdychać, 3. Pl.", weekendów: "weekend, Gen. Pl.", wewnętrznych: "wewnętrzny, Gen. Pl. (choroby wewnętrzne)", wędzoną: "wędzony, Akk. Sg. f.",
  wgryza: "wgryzać się, 3. Sg.", wichurą: "wichura, Instr. Sg.", widłowe: "widłowy, Nom. Pl. (wózki widłowe)", wieczorku: "wieczorek, Lok. Sg.",
  wiejskich: "wiejski, Gen. Pl.", wierzch: "wierzch, Akk. Sg. (na wierzch)", wiezie: "wieźć, 3. Sg.", wjedzie: "wjechać, 3. Sg. Fut.", wjeździe: "wjazd, Lok. Sg.",
  włącza: "włączać, 3. Sg.", wnuczką: "wnuczka, Instr. Sg.", wnukom: "wnuk, Dat. Pl.", wózkami: "wózek, Instr. Pl.", wózki: "wózek, Nom. Pl.",
  współlokatora: "współlokator, Gen./Akk. Sg.", wstęgę: "wstęga, Akk. Sg.", wstępuje: "wstępować, 3. Sg.", wstrzymuje: "wstrzymywać, 3. Sg.",
  wybucha: "wybuchać, 3. Sg.", wychodzili: "wychodzić, 3. Pl. m.-pers. Prät. (jedni)", wyciera: "wycierać, 3. Sg.", wycinanek: "wycinanka, Gen. Pl.",
  wycinanka: "wycinanka, Nom. Sg.", wydobycie: "wydobycie, Akk. Sg.", wydruk: "wydruk, Akk. Sg.", wydrukowaną: "wydrukowany, Akk. Sg. f.", wyjmuje: "wyjmować, 3. Sg.",
  wyłapał: "wyłapać, 3. Sg. m. Prät. (test)", wymieniona: "wymieniony, Nom. Sg. f.", wypełnia: "wypełniać, 3. Sg.", wypis: "wypis, Akk. Sg.",
  wypisuje: "wypisywać, 3. Sg.", wypłynąć: "wypłynąć, Infinitiv", wyprostować: "wyprostować, Infinitiv", wypytuje: "wypytywać, 3. Sg.",
  wyrzucenia: "wyrzucenie, Gen. Sg.", wysiada: "wysiadać, 3. Sg.", wysokimi: "wysoki, Instr. Pl.", wysyłki: "wysyłka, Gen. Sg.", wyświetlaczu: "wyświetlacz, Lok. Sg.",
  wywiesza: "wywieszać, 3. Sg.", wywozi: "wywozić, 3. Sg.", zabezpiecza: "zabezpieczać, 3. Sg.", zacina: "zacinać się, 3. Sg.", zaglądają: "zaglądać, 3. Pl.",
  zakłada: "zakładać, 3. Sg.", zakładzie: "zakład, Lok. Sg.", zamontować: "zamontować, Infinitiv", zamontowana: "zamontowany, Nom. Sg. f.",
  zamówieniem: "zamówienie, Instr. Sg.", zapchany: "zapchany, Akk. Sg. m. (unbelebt)", zapisywał: "zapisywać, 3. Sg. m. Prät. (dziadek)", zaplecza: "zaplecze, Gen. Sg.",
  zaproszeniem: "zaproszenie, Instr. Sg.", zardzewiałe: "zardzewiały, Akk. Pl.", zarządem: "zarząd, Instr. Sg.", zasypia: "zasypiać, 3. Sg.",
  zatańczy: "zatańczyć, 3. Sg. Fut.", zauważa: "zauważać, 3. Sg.", zawiązki: "zawiązek, Akk. Pl.", zawisną: "zawisnąć, 3. Pl. Fut.", zawozi: "zawozić, 3. Sg.",
  zawyła: "zawyć, 3. Sg. f. Prät. (syrena)", zdają: "zdawać, 3. Pl.", zdobienia: "zdobienie, Akk./Nom. Pl.", zerwany: "zerwany, Akk. Sg. m. (unbelebt)",
  zeszytów: "zeszyt, Gen. Pl.", zgaduje: "zgadywać, 3. Sg.", zgłosi: "zgłosić się, 3. Sg. Fut.", zielonkawe: "zielonkawy, Nom. Sg. n.", zimowym: "zimowy, Lok. Sg. n.",
  zjechali: "zjechać, 3. Pl. m.-pers. Prät. (ludzie)", zjeżdża: "zjeżdżać, 3. Sg.", złotówkach: "złotówka, Lok. Pl.", złotówkami: "złotówka, Instr. Pl.",
  zwalona: "zwalony, Nom. Sg. f.",
};

/**
 * Ogonek-Zwillinge (PL-T1 §4): Wörter OHNE Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist. Jede Zeile mit einem davon
 * ist gelesen; hier steht, warum die geschriebene Form gemeint ist.
 */
const NOM = "Nominativ Sg. (Subjekt oder Apposition) gemeint, nicht der Instrumental auf -ą";
const DRITTE = "3. Sg. Präsens (Subjekt ist eine benannte Person oder Sache) gemeint, nicht die 1. Sg. auf -ę";
const ZWILLING_GELESEN: Readonly<Record<string, string>> = {
  babcia: NOM, burza: NOM, burze: "Akk. Pl. (zapowiada burze), nicht Akk. Sg. burzę", chce: DRITTE,
  ciekawa: "Prädikativ Nom. Sg. f. (Ola jest ciekawa), nicht Instr. ciekawą", daje: DRITTE, dawna: "Wendung „od dawna“, nicht dawną",
  dodaje: DRITTE, dostaje: DRITTE, dziewczyna: NOM, firma: NOM, fryzjerka: NOM, gra: "grać, 3. Sg. (gra zespół), nicht Instr. grą",
  gratuluje: DRITTE, grupa: NOM, gwiazda: NOM, inna: "Nom. Sg. f. (inna kostka), nicht Instr. inną",
  instrukcje: "Akk. Pl. (instrukcje bezpieczeństwa), nicht Akk. Sg. instrukcję", ja: "Pronomen Nom. „ja“ in der Rede, nicht ją",
  jedna: "Nom. Sg. f. (jako jedna z pierwszych), nicht jedną", jednostka: NOM, kamera: NOM, kanapa: "Prädikativ Nom. Sg. (dywan to kanapa)",
  karta: NOM, kierowca: NOM, kolega: NOM, kopalnia: NOM, kupuje: DRITTE, lekarka: NOM,
  maja: "maj, Gen. Sg. im Datum (18 maja), nicht mają", malarka: NOM, matka: NOM, mowie: "mowa, Lok. Sg. (o śląskiej mowie), nicht mówię",
  myje: DRITTE, najstarsza: NOM, napisze: "napisać, 3. Sg. Fut. (Bogusława), nicht 1. Sg. napiszę", nauczycielka: NOM, nowa: NOM, obiecuje: DRITTE,
  on: "Pronomen „on“ (Adam), die Form „ón“ ist kein Wort der Hochsprache", opiekunka: NOM, ostatnia: NOM,
  owce: "Akk. Pl. (strzyżono owce), nicht Akk. Sg. owcę", paczki: "paczka, Akk. Pl. (nosi paczki), nicht pączki", pakuje: DRITTE,
  piec: "piec (Ofen), nicht das Zahlwort pięć", pierwsza: NOM, pisze: DRITTE, pizza: NOM, planuje: DRITTE,
  pojawia: "pojawiać się, 3. Sg. Präsens, nicht 3. Pl. Fut. pojawią", pomoc: "Nomen pomoc (prosić o pomoc), nicht Infinitiv pomóc",
  potrzebuje: DRITTE, praca: NOM, prace: "praca, Akk. Pl. (oddaje prace), nicht Akk. Sg. pracę", pracuje: DRITTE, proponuje: DRITTE,
  prosta: "Nom. Sg. f. (mowa prosta), nicht Instr. prostą", przyznaje: DRITTE, robota: NOM, rozmowa: NOM, rozpoznaje: DRITTE, rysuje: DRITTE,
  sad: "sad (Obstgarten), nicht sąd (Gericht) - Gegenstand der Serie", sadu: "sad, Gen. Sg. (do sadu, z sadu), nicht sądu",
  sama: "Nom. Sg. f. über Gerda (3. Person), nicht Instr. samą", silna: NOM, sprawie: "sprawa, Lok. Sg. (w sprawie szkód), nicht sprawię",
  sprzedaje: DRITTE, sprzedawca: NOM, staje: DRITTE, stan: "stan (Zustand), nicht Imperativ stań", studiuje: DRITTE,
  szkole: "szkoła, Lok. Sg. (po szkole, w szkole), nicht Akk. szkołę", tajemnica: NOM, tata: NOM,
  te: "Nom. Pl. „te najlepsze“ (pyry), nicht Akk. Sg. f. tę", tylu: "po tylu latach, nicht z tyłu", winda: NOM, wstaje: DRITTE, wymiana: NOM,
  zadaje: DRITTE, zajmuje: DRITTE, zatrzymuje: DRITTE, zawsze: "Adverb zawsze", ze: "Präposition ze (ze śmiechem, ze zdjęciami), nicht że",
  zgaduje: DRITTE, znajduje: DRITTE, zostaje: DRITTE, zuzia: "Name Zuzia im Nominativ, nicht Instr. Zuzią",
};

describe("PL-S Erwachsene: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Eigennamen ausgenommen)", () => {
    const namen = new Set(SERIEN_E.flatMap((s) => [...namenVon(s)]));
    const fehler = zuHaeufig(ZEILEN, namen);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis, auch nicht im Titel", () => {
    const fehler = [...ZEILEN, ...SERIEN_E.map((s) => s.titel)].flatMap((z) => pruefWoerter(z).filter(gesperrtPl).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jedes Wort steht in der Wortbasis, ist ein Eigenname seiner Serie oder ist von Hand belegt (und die Liste trägt nur das)", () => {
    const fehler = SERIEN_E.flatMap((s) => ungeprueft(zeilenVon(s), VON_HAND_BELEGT, namenVon(s)).map((w) => `${s.slug}: ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    const benutzt = new Set(ZEILEN.flatMap(pruefWoerter));
    const ueberfluessig = Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w));
    expect(ueberfluessig).toEqual([]);
    expect(Object.entries(VON_HAND_BELEGT).filter(([, v]) => v.trim().length < 5).map(([w]) => w)).toEqual([]);
  });

  it("jeder Ogonek-Zwilling der Charge ist gelesen - die Liste ist genau die gemessene", () => {
    expect([...zwillingWoerter(ZEILEN)].sort()).toEqual(Object.keys(ZWILLING_GELESEN).sort());
  });

  it("Gegenprobe: Wortgrenze, Sperrliste, Wortbasis und Zwillinge schlagen an", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `Sad ${"abcdefghi"[i]} rośnie.`);
    expect(zuHaeufig(neun, new Set())).toEqual(['"sad": 9 Zeilen', '"rośnie": 9 Zeilen']);
    expect(zuHaeufig(neun.slice(0, 8), new Set())).toEqual([]);
    expect(zuHaeufig(neun, new Set(["sad", "rośnie"]))).toEqual([]);
    expect(gesperrtPl("niewidomy")).toBe(false);
    expect(gesperrtPl("szmatę")).toBe(true);
    expect(gesperrtPl("gruba")).toBe(true);
    expect(gesperrtPl("kurwa")).toBe(true);
    expect(ungeprueft(["Ewa kupuje szklankę xyzwq w sklepie."], {}, new Set(["ewa"]))).toEqual(["xyzwq"]);
    expect(ungeprueft(["Ewa kupuje szklankę xyzwq w sklepie."], { xyzwq: "erfunden, nur für die Gegenprobe" }, new Set(["ewa"]))).toEqual([]);
    expect(ungeprueft(["Harpreet kupuje chleb w sklepie."], {}, new Set())).toEqual(["harpreet"]);
    expect(ZWILLINGE.has("ze")).toBe(true);
    expect([...zwillingWoerter(["Ewa wie, ze to prawda."])]).toContain("ze");
  });
});

// ── 7 · Tastatur pl ─────────────────────────────────────────────────────────

/** Wie `hatGriff` im IT-Wächter (Taste · Umschalt/AltGr · Totaste). */
function hatGriff(layout: KeyboardLayout, zeichen: string): boolean {
  if (zeichen === " ") return true;
  const klein = zeichen.toLowerCase();
  if (zeichen !== klein && (layout.grossFehlt ?? []).includes(zeichen)) return false;
  if (layout.rows.some((r) => r.keys.includes(klein))) return true;
  if (layout.access[klein] !== undefined) return true;
  return kombizeichenZu(zeichen, layout) !== undefined;
}

describe("PL-S Erwachsene: jedes Zeichen auf der Tastatur pl greifbar", () => {
  it("jedes Zeichen jeder Zeile und jedes Titels hat einen Griff", () => {
    const l = layoutById("pl");
    const ohne = new Set<string>();
    for (const z of [...ZEILEN, ...SERIEN_E.map((s) => s.titel)]) for (const c of z) if (!hatGriff(l, c)) ohne.add(c);
    expect([...ohne]).toEqual([]);
  });

  it("Gegenprobe: ‰ und ë haben keinen Griff, ą und € schon", () => {
    const l = layoutById("pl");
    expect(hatGriff(l, "‰")).toBe(false);
    expect(hatGriff(l, "ë")).toBe(false);
    expect(hatGriff(l, "ą")).toBe(true);
    expect(hatGriff(l, "€")).toBe(true);
  });
});

// ── 8 · Servieren gegen den echten Weg ──────────────────────────────────────

/**
 * Öffnungs-Einheit je Serie, GEMESSEN (`oeffnetEinheit`, Tastatur `pl`, Weg `pl`): ab dieser Sprosse wird jede Zeile der
 * Serie serviert (vor `? ! " :` gekürzt), und die Serie ist für Erwachsene frei.
 */
const OEFFNET: Readonly<Record<string, string>> = {
  "pl-erw-1-klawiatura-po-siedemdziesiatce": "0",
  "pl-erw-1-wycinanki-dziadka-zbyszka": "q",
  "pl-erw-1-trzy-tygodnie-w-ciechocinku": "0",
  "pl-erw-1-przycisk-bez-nazwy": "@",
  "pl-erw-1-slownik-nowego-biura": "0",
  "pl-erw-1-warsztat-agaty": "ź",
  "pl-erw-1-operatorka-dzwigu": "0",
  "pl-erw-1-codziennie-przez-granice": "€",
  "pl-erw-1-litery-ktorych-brakuje": "q",
  "pl-erw-1-lekarka-ze-lwowa": "0",
  "pl-erw-1-dom-babci-pod-hajnowka": "ó",
  "pl-erw-1-recepta-w-telefonie-taty": "/",
  "pl-erw-1-mechaniczka-w-dolinie-lotniczej": "%",
  "pl-erw-1-na-polu-czy-na-dworze": "ń",
  "pl-erw-1-ostatnia-szychta-piotra": "q",
  "pl-erw-1-powrot-pod-krapkowice": "€",
  "pl-erw-1-pawie-oczko-z-boleslawca": "%",
  "pl-erw-1-naczelniczka-z-zaboru": "ń",
  "pl-erw-1-winda-na-czwarte-pietro": "0",
  "pl-erw-1-sad-po-tacie": "%",
};

/** Die Wörter einer Zeile, wie sie zu tippen sind: Satzzeichen nur am Wortrand weg (7:15, 140/90 und 35% bleiben ganz). */
const wortfolge = (t: string) =>
  t
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}%€]+$/gu, ""))
    .filter(Boolean)
    .join(" ");
/** Zeilen, die `fitText` an Sprosse `n` verwirft oder in anderen Wörtern serviert (halbiert, Zahl zerrissen). */
function verworfenOderHalbiert(s: { etappen: { lines: string[] }[] }, n: number): string[] {
  const allowed = allowedAt(n);
  setLayout("pl");
  return zeilenVon(s).filter((z) => {
    const f = fitText(z, allowed, "pl");
    return f === null || wortfolge(f) !== wortfolge(z);
  });
}

describe("PL-S Erwachsene: Servieren auf Weg „pl“", () => {
  it("die Öffnungs-Einheit jeder Serie ist gemessen und eingetragen", () => {
    const gemessen = Object.fromEntries(SERIEN_E.map((s) => [s.slug, oeffnetEinheit(s)]));
    expect(gemessen).toEqual(OEFFNET);
  });

  it("an der Öffnungs-Sprosse ist die Serie frei, eine Sprosse davor nicht; dort wird keine Zeile verworfen oder halbiert", () => {
    const fehler: string[] = [];
    for (const s of SERIEN_E) {
      const n = oeffnet(s);
      if (n === null) {
        fehler.push(`${s.slug}: öffnet nie`);
        continue;
      }
      setLayout("pl");
      if (!serieTypeable(s as unknown as Serie, allowedAt(n), "pl")) fehler.push(`${s.slug}: an ${n} nicht frei`);
      setLayout("pl");
      if (serieTypeable(s as unknown as Serie, allowedAt(n - 1), "pl")) fehler.push(`${s.slug}: schon an ${n - 1} frei`);
      for (const z of verworfenOderHalbiert(s, n)) fehler.push(`${s.slug} an Sprosse ${n}: "${z}"`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("mit allen Tasten kommt jede Zeile Zeichen für Zeichen, und alle 20 Serien sind für Erwachsene frei", () => {
    const n0 = ordnung().length;
    const alle = allowedAt(n0);
    setLayout("pl");
    expect(ZEILEN.filter((z) => fitText(z, alle, "pl") !== norm(z))).toEqual([]);
    expect(ZEILEN.filter((z) => volleSprosse(z) === null || ersteSprosse(z) === null)).toEqual([]);
    setLayout("pl");
    const gesamt = allowedFromIntroduced(introOrder("pl"), "pl");
    const offen = new Set(unlockedSerien(gesamt, "erwachsen", "pl", "pl").map((s) => s.slug));
    expect(SERIEN_E.filter((s) => !offen.has(s.slug)).map((s) => s.slug)).toEqual([]);
  });

  it("Erwachsene ohne ⇧ bekommen keine dieser Serien (D-2), Kinder und Jugend nie, die Wege „it“ und „de“ nie", () => {
    setLayout("pl");
    const gesamt = allowedFromIntroduced(introOrder("pl"), "pl");
    expect(unlockedSerien(gesamt, "erwachsen", "pl", "pl", false).filter((s) => EIGENE_SLUGS.has(s.slug))).toEqual([]);
    for (const stufe of ["kids", "teens"] as const) {
      expect(unlockedSerien(gesamt, stufe, "pl", "pl").filter((s) => EIGENE_SLUGS.has(s.slug)), stufe).toEqual([]);
    }
    setLayout("it");
    const it_ = unlockedSerien(allowedFromIntroduced(introOrder("it"), "it"), "erwachsen", "it", "it");
    expect(it_.filter((s) => EIGENE_SLUGS.has(s.slug))).toEqual([]);
    setLayout("de");
    const de = unlockedSerien(allowedFromIntroduced(introOrder("de"), "de"), "erwachsen", "de", "de");
    expect(de.filter((s) => EIGENE_SLUGS.has(s.slug))).toEqual([]);
  });

  it("Gegenprobe: eine Ziffer hält eine Serie ohne Ziffern zu, ein Bindestrich halbiert, ein falscher Tabelleneintrag fällt auf", () => {
    const ohne = SERIEN_E.find((s) => !zeilenVon(s).some((l) => /\d/.test(l)))!;
    const n = oeffnet(ohne)!;
    const z = kopie(ohne);
    z.etappen[0].lines[0] = "Wszyscy czekają na autobus numer 7 przy rynku.";
    expect(verworfenOderHalbiert(z, n)).toEqual(["Wszyscy czekają na autobus numer 7 przy rynku."]);
    expect(oeffnet(z)!).toBeGreaterThan(n);
    const h = kopie(ohne);
    h.etappen[0].lines[0] = "Wszyscy jadą razem do Bielsko-Białej autobusem.";
    const vorStrich = ordnung().indexOf("-");
    expect(verworfenOderHalbiert(h, Math.max(n, vorStrich))).toHaveLength(1);
    expect({ ...OEFFNET, [ohne.slug]: "€" }).not.toEqual(Object.fromEntries(SERIEN_E.map((s) => [s.slug, oeffnetEinheit(s)])));
  });
});

// ── 9 · Keine Kopien, keine Paare, nichts fast gleich ───────────────────────

describe("PL-S Erwachsene: keine Kopien, keine Paare, nichts fast gleich", () => {
  const PL_ANDERE = anderePlZeilen(EIGENE_SLUGS);
  const FREMD = alleFremdenZeilen(EIGENE_SLUGS);

  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Kopie einer pl-Zeile (Korpus T1-T9, andere pl-Serien) oder einer Zeile irgendeines anderen Textes", () => {
    expect(kopienGegen(ZEILEN, [...PL_ANDERE, ...FREMD])).toEqual([]);
  });

  it("keine Paare - weder untereinander noch mit einer pl-Zeile", () => {
    const fehler = paare(ZEILEN, PL_ANDERE);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich: 0,5 untereinander und gegen pl, 0,6 gegen alles andere", () => {
    const fehler = [
      ...fastGleichUntereinander(ZEILEN, 0.5),
      ...fastGleich(ZEILEN, PL_ANDERE, 0.5),
      ...fastGleich(ZEILEN, FREMD, 0.6),
    ];
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie mit anderem Satzzeichen, Kopie aus T9, Paar über Geschlecht, fast gleich; Präfix-Filter = voller Vergleich", () => {
    const t9 = CORPUS_PL[CORPUS_PL.length - 1].text;
    const anders = `${t9.replace(/[.!?]$/, "")}!`;
    expect(kopienGegen([anders], PL_ANDERE)).toEqual([anders]);
    expect(paare(["Kierowca był bardzo zmęczony po zmianie.", "Kierowca była bardzo zmęczona po zmianie."])).toHaveLength(1);
    expect(paare(["On czeka na autobus do Lublina.", "Ona czeka na autobus do Lublina."])).toHaveLength(1);
    expect(paare(["Pociąg odjeżdża o 7:15.", "Pociąg przyjeżdża o 7:15."])).toEqual([]);
    expect(fastGleichUntereinander(["Ewa jedzie rano autobusem do pracy w Lublinie.", "Ewa jedzie rano autobusem do szkoły w Lublinie."], 0.5)).toHaveLength(1);
    const probe = ZEILEN.filter((_, i) => i % 15 === 0);
    const gegen = PL_ANDERE.slice(0, 1500);
    for (const g of [0.3, 0.5]) expect(fastGleich(probe, gegen, g).sort()).toEqual(fastGleichVoll(probe, gegen, g).sort());
  });
});

// ── 10 · Eingehängt, Anker unberührt ────────────────────────────────────────

describe("PL-S Erwachsene: eingehängt über `SERIEN_PL`, Anker unberührt", () => {
  it("jede Serie steht genau einmal in `SERIEN_PL` und in `SERIEN`, als letzter Block hinter Kindern und Jugend", () => {
    const pl = SERIEN_PL.map((s) => s.slug);
    const alle = SERIEN.map((s) => s.slug);
    for (const s of SERIEN_E) {
      expect(pl.filter((x) => x === s.slug).length, s.slug).toBe(1);
      expect(alle.filter((x) => x === s.slug).length, s.slug).toBe(1);
    }
    expect(pl.slice(pl.length - SERIEN_E.length)).toEqual(SERIEN_E.map((s) => s.slug));
  });

  it("der Korpus-Anker ist aktuell und kennt keine Serienzeile (Serien tragen keine Anker-IDs)", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    expect(ZEILEN.filter((z) => CORPUS_PL.some((i) => i.text === z))).toEqual([]);
  });
});
