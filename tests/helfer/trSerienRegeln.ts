/**
 * Gemeinsame Regeln der TÜRKISCHEN Serien (TR-S, 09.10.2026) - eine Stelle für die drei Wächter
 * `tastenflow-serien-tr-{kids,teens,erwachsen}-1.test.ts`. Jede Funktion nimmt ihre Eingabe als Parameter, damit jeder
 * Wächter sie mit einer Gegenprobe zeigen kann. Aufbau wie `plSerienRegeln.ts` (Zweig `pl-serien-1`), Inhalt türkisch.
 *
 * Herkunft der Regeln: `trTextRegeln.ts` (jede tr-Zeile: ı/İ, Apostroph nur am Namen, Anrede, Staatssymbole, Religion,
 * Etikett, Sperrwort-Kern), die Korpus-Wächter TR-T7/T8/T9 (Feste und Feiertage, Geschlecht der tippenden Person, Naht
 * nach dem Kürzen, Wortbasis mit Stamm + Endung und nachgerechneter Vokalharmonie, Sperrliste gefaltet, Paare, Jaccard,
 * Kopien gegen alles) und die italienischen Serien-Wächter (Form der Serie, Öffnungs-Sprosse, Eigennamen der Serie,
 * Wortgrenze 8 je Charge).
 *
 * ⚠️ Serien-Zeilen sind KEINE Korpuszeilen: sie tragen keine Anker-ID (`erzeuge-korpus-anker.mts` liest nur den Korpus) und
 * kommen nicht in den Generator. Die Prüfung „die Stimme buchstabiert nichts" über `isRealWord` wäre hier ZIRKULÄR - das
 * Vorlese-Lexikon nimmt jedes Wort jeder Serie auf (Befund IT-S Erwachsene §3) -, sie wird darum durch die Wortbasis
 * ersetzt (Wortschatz + jede tr-Korpuszeile T1-T9 + die belegten Grundformen und Formen in `trSerienBelege.ts`).
 */
import { layoutById, setLayout, TASTATUREN_DER_SPRACHE, type KeyboardLayout, type LayoutId } from "../../src/lib/typing/layouts";
import { introOrder } from "../../src/lib/typing/letters";
import { fitText, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_ES, CORPUS_IT, CORPUS_PL, CORPUS_CS } from "../../src/lib/typing/corpus";
import { CORPUS_TR as TR_ROH } from "../../src/lib/typing/corpusTr";
import { SERIEN, allowedFromIntroduced } from "../../src/lib/typing/serien";
import { bausteinKey } from "../../src/lib/typing/ledger";
import { kombizeichenZu } from "../../src/lib/typing/totasten";
import { gesperrtGefaltetTr, fuerWortlisteUngeeignetTr } from "../../src/lib/typing/sperrlisteTr";
import { WORDS_TR, STUFE_VOCAB_TR } from "../../src/lib/typing/wordsTr";
import { NACHTRAG_TR, NACHTRAG_TR_ERGAENZT } from "../../src/lib/typing/lexikonNachtragTr";
import { kleinFuer } from "../../src/lib/typing/sprachRegister";
import { BOELGELER_TR, type SerieEntwurfTr } from "../../src/lib/typing/serienTrTyp";
import { zeilenFehler } from "./trTextRegeln";
import { NEUE_GRUNDFORMEN, NEUE_FORMEN } from "./trSerienBelege";

export { zeilenFehler, BOELGELER_TR, NEUE_GRUNDFORMEN, NEUE_FORMEN };

export const klein = (t: string): string => kleinFuer(t, "tr");
export const zeilenVon = (s: { etappen: { lines: string[] }[] }): string[] => s.etappen.flatMap((e) => e.lines);
export const woerter = (z: string): string[] => z.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

// ── Form ────────────────────────────────────────────────────────────────────

/** Erlaubte Zeichen einer Serien-Zeile: die Buchstaben von `tr-q` (mit â î û über die Totaste), Leerzeichen, `. , ; : ? ! " '`. */
export const ERLAUBT = /^[A-Za-zÇĞİÖŞÜçğıöşüâîûÂÎÛ .,;:?!"']+$/u;

/** Alle Form-Verstösse EINER Zeile (leer = in Ordnung). */
export function formFehler(z: string, minWoerter = 4, maxWoerter = 16): string[] {
  const p: string[] = [...zeilenFehler(z)];
  if (!ERLAUBT.test(z)) p.push("Zeichen ausserhalb von Buchstaben und . , ; : ? ! \" '");
  if (!/^"?\p{Lu}/u.test(z)) p.push("kein Grossbuchstabe am Anfang");
  if (!/[.!?]"?$/.test(z)) p.push("kein Satzschluss am Ende");
  if (/[.!?]"?\s+"?\p{Lu}/u.test(z)) p.push("mehr als ein Satz");
  if (/[,;:](?=\S)/u.test(z)) p.push("kein Leerzeichen nach , ; :");
  if ((z.match(/"/g) ?? []).length % 2 !== 0) p.push("Anführungszeichen ungerade");
  if (/"\s*$/.test(z) && !/[.!?]"$/.test(z)) p.push("Anführung schliesst ohne Satzzeichen");
  const n = woerter(z).length;
  if (n < minWoerter || n > maxWoerter) p.push(`${n} Wörter`);
  return p;
}

/** Form der Serie: Stufe, Sprache, Herkunft, Region, Etappen-Zahl, Zeilen je Etappe, jede Etappe endet auf ? oder !. */
export function serienFormFehler(
  s: SerieEntwurfTr,
  stufe: "kids" | "teens" | "erwachsen",
  minZeilen: number,
  maxZeilen: number,
): string[] {
  const f: string[] = [];
  if (JSON.stringify(s.stufen) !== JSON.stringify([stufe])) f.push(`${s.slug}: stufen`);
  if (s.kind !== "geschichte") f.push(`${s.slug}: kind`);
  if (s.lang !== "tr" || s.nurWeg !== "tr") f.push(`${s.slug}: lang/nurWeg`);
  if (s.herkunft.quelle !== "Sensorik" || s.herkunft.lizenz !== "Eigenes Werk") f.push(`${s.slug}: herkunft`);
  if (!(BOELGELER_TR as readonly string[]).includes(s.land)) f.push(`${s.slug}: land ${s.land}`);
  if (s.etappen.length < 2 || s.etappen.length > 3) f.push(`${s.slug}: ${s.etappen.length} Etappen`);
  s.etappen.forEach((e, i) => {
    if (e.lines.length < minZeilen || e.lines.length > maxZeilen) f.push(`${s.slug} E${i + 1}: ${e.lines.length} Zeilen`);
    if (!/[?!]"?$/.test(e.lines[e.lines.length - 1] ?? "")) f.push(`${s.slug} E${i + 1}: endet ohne ? oder !`);
  });
  if (woerter(s.titel).length > 6) f.push(`${s.slug}: Titel zu lang`);
  if (!ERLAUBT.test(s.titel) || zeilenFehler(s.titel).length > 0) f.push(`${s.slug}: Titel-Zeichen oder Regel`);
  for (const n of s.eigennamen) if (!zeilenVon(s).some((l) => l.includes(n))) f.push(`${s.slug}: Eigenname ${n} kommt nicht vor`);
  return f;
}

// ── Feste, Politik, Geschlecht, Etikett (TR-T7/T9, Auftrag) ─────────────────

/**
 * Feste, Feiertage, Staat, Religion, Militär, Wahl - Wortanfänge, `İ`-sicher (Falle 89). Die Liste von TR-T9 und dazu, was
 * eine Serie (Erzählung, Familie, Kalender) eher streift: Kandil, Mevlit, Hacı, Hoca, Hutbe, Ezan, Zekât, Sünnet, Kına (Brauch
 * am Vorabend der Hochzeit), Düğün (Hochzeitsfest) - Feste gehören in eine eigene Charge mit Johannes' Ja (TR-T9 §6).
 */
const FEST =
  /(?<![\p{L}])(?:bayram|ramazan|kurban|kandil|nevruz|hıdrellez|cumhuriyet|yılbaşı|anıtkabir|atatürk|sevgililer|anneler günü|babalar günü|öğretmenler günü|seçim|milletvekil|bakanı|meclis|cumhurbaşkan|başbakan|cami|bayrak|asker|şehit|namaz|oruç|[iİ]ftar|sahur|arife|kilise|cemevi|resmî tatil|resmi tatil|mevlit|mevlid|hacı|hoca|hutbe|ezan|zekât|zekat|sünnet|kına|düğün|nişan|bayrağ)/iu;
export const festIn = (z: string): boolean => FEST.test(z);

/** Politik (Auftrag): Parteien, Regierung, Opposition, Wahl - eine Zeile darüber gehört nicht in eine Serie. */
const POLITIK = /(?<![\p{L}])(?:siyaset|siyasi|politika|politik|hükümet|muhalefet|iktidar|milletvekil|referandum|darbe|seçim|oy ver|siyasi parti)/iu;
export const politikIn = (z: string): boolean => POLITIK.test(z);

/**
 * Wörter, die ein Geschlecht der Person verraten, die tippt (TR-T6/T9) - auch in wörtlicher Rede, denn getippt wird sie
 * trotzdem. ⚠️ `koca\p{L}*` trifft auch „kocaman" (riesig): darum steht dort „büyük". Abweichung von TR-T9: `gelin\p{L}*`
 * traf auch „gelince" (wenn es kommt) und „gelinen" - hier nur „gelin" und seine Hauptwort-Formen (gelinim, geline, gelinler);
 * die Befehlsform „gelin!" bleibt gemeldet, weil sie wie „Braut" geschrieben wird (Gegenprobe im Wächter).
 */
const GESCHLECHT =
  /(?<![\p{L}])(?:koca(?!eli)\p{L}*|karım|karımla|karıma|karımı|hamile\p{L}*|gelin(?:im|imiz|in|e|i|ler|lik)?|damat\p{L}*|bey|beyefendi|hanım\p{L}*|abla|abi|eltim|bacanağ\p{L}*|bacanak|erkeğim|kadınım|anneyim|babayım)(?![\p{L}])/iu;
export const geschlechtIn = (z: string): boolean => GESCHLECHT.test(z);

/**
 * Behinderung ohne Etikett, Person zuerst (Glossar §1 Regel 3): eine Figur TUT etwas (Braille okuyor, beyaz bastonuyla
 * yürüyor, ekran okuyucu kullanıyor, tekerlekli sandalye kullanıyor) - nie „engelli", „görme engelli", „görmeyen",
 * „kör", „âmâ", „sağır", „sakat", „özürlü", „zavallı".
 */
const ETIKETT = /(?<![\p{L}])(?:engelli\p{L}*|görme engel\p{L}*|görmeyen\p{L}*|kör(?!\p{L})|körler\p{L}*|âmâ|sağır\p{L}*|sakat\p{L}*|özürlü\p{L}*|zavallı\p{L}*|topal\p{L}*|dilsiz\p{L}*)/iu;
export const etikettIn = (z: string): boolean => ETIKETT.test(z);

// ── Tastaturen und Sprossen ─────────────────────────────────────────────────

/** Die Tastaturen des Weges „tr" (heute nur `tr-q`; der Weg „tr-F" und die deutsche Tastatur mit Ersatzzeichen kommen später). */
export const WEG_TASTATUREN: LayoutId[] = [...TASTATUREN_DER_SPRACHE.tr];

/** Wie `hatGriff` in den IT-S-Wächtern (Taste · Umschalt/AltGr · Totaste). */
export function hatGriff(layout: KeyboardLayout, zeichen: string): boolean {
  if (zeichen === " ") return true;
  const k = klein(zeichen);
  if (layout.rows.some((r) => r.keys.includes(k))) return true;
  if (layout.access[k] !== undefined || layout.access[zeichen] !== undefined) return true;
  return kombizeichenZu(zeichen, layout) !== undefined;
}
export { layoutById };

const ordnungCache = new Map<LayoutId, string[]>();
export function ordnung(l: LayoutId = "tr-q"): string[] {
  let o = ordnungCache.get(l);
  setLayout(l);
  if (!o) {
    o = introOrder("tr");
    ordnungCache.set(l, o);
  }
  return o;
}
const allowedCache = new Map<string, Set<string>>();
export function allowedAt(n: number, l: LayoutId = "tr-q"): Set<string> {
  const o = ordnung(l);
  const k = `${l}:${n}`;
  let s = allowedCache.get(k);
  if (!s) {
    s = allowedFromIntroduced(o.slice(0, n), "tr");
    allowedCache.set(k, s);
  }
  return s;
}
const norm = (t: string) => t.replace(/\s+/g, " ").trim();
const ersteCache = new Map<string, number | null>();
/** Kleinste Sprosse, ab der die Zeile überhaupt (gekürzt) serviert wird. */
export function ersteSprosse(t: string, l: LayoutId = "tr-q"): number | null {
  const k = `${l}|${t}`;
  if (ersteCache.has(k)) return ersteCache.get(k)!;
  let erg: number | null = null;
  const n0 = ordnung(l).length;
  for (let n = 1; n <= n0; n++) if (fitText(t, allowedAt(n, l), "tr") !== null) { erg = n; break; }
  ersteCache.set(k, erg);
  return erg;
}
const volleCache = new Map<string, number | null>();
/** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
export function volleSprosse(t: string, l: LayoutId = "tr-q"): number | null {
  const k = `${l}|${t}`;
  if (volleCache.has(k)) return volleCache.get(k)!;
  let erg: number | null = null;
  const n0 = ordnung(l).length;
  for (let n = 1; n <= n0; n++) if (fitText(t, allowedAt(n, l), "tr") === norm(t)) { erg = n; break; }
  volleCache.set(k, erg);
  return erg;
}
/** Kleinste Sprosse, ab der JEDE Zeile der Serie serviert wird (null = eine Zeile nie). */
export function oeffnet(s: { etappen: { lines: string[] }[] }, l: LayoutId = "tr-q"): number | null {
  let max = 0;
  for (const z of zeilenVon(s)) {
    const b = ersteSprosse(z, l);
    if (b === null) return null;
    max = Math.max(max, b);
  }
  return max;
}
/** Die Einheit, an der die Serie öffnet („'", „ö" …). */
export const oeffnetEinheit = (s: { etappen: { lines: string[] }[] }, l: LayoutId = "tr-q"): string | null => {
  const n = oeffnet(s, l);
  return n === null ? null : ordnung(l)[n - 1];
};

// ── Wörter, Grosswörter, auch nach dem Kürzen ───────────────────────────────

/**
 * Die Wörter einer Zeile (klein nach `kleinFuer`, `İ`-sicher, Apostroph-Formen als Ganzes) mit Merker „Satzanfang"
 * (Zeilenanfang, nach . ? !, Anfang einer Anführung). Wie TR-T7, ohne technische Wörter (Serien tragen keine).
 */
export function woerterMitAnfang(zeile: string): { w: string; roh: string; anfang: boolean }[] {
  const out: { w: string; roh: string; anfang: boolean }[] = [];
  let naechsterAnfang = true;
  for (const roh of zeile.split(/\s+/)) {
    const kern = roh.replace(/^["(]+|[.,!?:;")]+$/gu, "");
    const w = kern.replace(/^[^\p{L}]+|[^\p{L}']+$/gu, "");
    if (w) out.push({ w: klein(w), roh: w, anfang: naechsterAnfang || roh.startsWith('"') });
    naechsterAnfang = /[.!?]"?\)?$/.test(roh);
  }
  return out;
}
export const woerterKlein = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w);

/**
 * Eigennamen und Wörter, die in JEDER Serie gross stehen dürfen: das Land, die Sprache (auch mit Endung ohne Apostroph, TDK:
 * „Türkçede"), andere Sprachen, die Brailleschrift.
 */
export const IMMER_GROSS: ReadonlySet<string> = new Set(
  "türkiye türkçe türkçede türkçeyi türkçeden almanca almancada arapça kürtçe lazca süryanice braille".split(" "),
);
/** Die Eigennamen einer Serie als Wortmenge (klein; mehrteilige Namen in ihre Wörter zerlegt). */
export const namenVon = (s: { eigennamen: string[] }): Set<string> =>
  new Set(s.eigennamen.flatMap((n) => klein(n).split(/\s+/)));
/** Sprachnamen stehen auch mit Endung ohne Apostroph gross (TDK: „Türkçede", „Almancayla"). */
const SPRACHEN_GROSS = ["türkçe", "almanca", "arapça", "kürtçe", "lazca", "süryanice", "ingilizce", "rusça"];
const istName = (w: string, namen: ReadonlySet<string>) =>
  namen.has(w) || IMMER_GROSS.has(w) || SPRACHEN_GROSS.some((s) => w.startsWith(s));
/** Grossgeschriebene Wörter, die weder am Satzanfang stehen noch ein Eigenname (+ Endung) sind. */
export function fremdeGrosswoerter(zeile: string, namen: ReadonlySet<string>): string[] {
  return woerterMitAnfang(zeile)
    .filter((x) => !x.anfang && /^\p{Lu}/u.test(x.roh) && !istName(x.w.split("'")[0], namen))
    .map((x) => x.roh);
}
/**
 * Weg „tr" lässt ungelernte `? ! : " ;` weg (TR-T7): eine Zeile kommt vor deren Sprosse GEKÜRZT. Fällt dabei eine
 * Satzgrenze weg (`seslendi: "Gel!"` ⇒ `seslendi Gel`), stünde ein Grosswort mitten im Satz (Naht-Regel). Darum steht
 * wörtliche Rede immer VORN (`"Gel!" diye seslendi Elif.`).
 */
export function gekuerztFehler(zeile: string, namen: ReadonlySet<string>, l: LayoutId = "tr-q"): string[] {
  const b = ersteSprosse(zeile, l);
  const v = volleSprosse(zeile, l);
  if (b === null || v === null) return [];
  const out = new Set<string>();
  for (let n = b; n < v; n++) {
    const s = fitText(zeile, allowedAt(n, l), "tr");
    if (s !== null) for (const w of fremdeGrosswoerter(s, namen)) out.add(`${n}:${w}`);
  }
  return [...out];
}

// ── Apostroph und Endungen (TR-T7) ──────────────────────────────────────────

const HINTEN = new Set(["a", "ı", "o", "u", "â", "û"]);
const VOKALE = new Set(["a", "e", "ı", "i", "o", "ö", "u", "ü", "â", "î", "û"]);
const STIMMLOS = new Set(["ç", "f", "h", "k", "p", "s", "ş", "t"]);
/**
 * Wörter mit hinterem Vokal, die HELLE Endungen nehmen (TDK, Ausnahmen der grossen Vokalharmonie: harf ⇒ harfi, saat ⇒
 * saati, rol ⇒ rolü). Nur, was die Serien brauchen (die Liste wächst nur mit Begründung im Befund).
 */
export const HELLE_ENDUNG: ReadonlySet<string> = new Set(["lokal", "mahsul", "kemal", "kefal", "harf", "saat", "rol", "kalp", "dikkat", "hayal", "kontrol", "gol", "festival", "metal", "petrol", "sinyal", "otel", "hal", "ihtimal", "hakikat", "seyahat", "kabul", "usul"]);
/** Erweichung vor einem Vokal: p ⇒ b, ç ⇒ c, t ⇒ d, k ⇒ ğ (nach n: g), g ⇒ ğ (biyolog ⇒ biyoloğa). */
export function erweicht(wort: string): string {
  const z = wort[wort.length - 1];
  const vor = wort[wort.length - 2];
  const neu = z === "p" ? "b" : z === "ç" ? "c" : z === "t" ? "d" : z === "g" ? "ğ" : z === "k" ? (vor === "n" ? "g" : "ğ") : z;
  return wort.slice(0, -1) + neu;
}
/**
 * Fehler einer Endung gegen die Vokalharmonie (zweifach a/e, vierfach ı/i/u/ü; das `o` von „-yor" ist fest) und gegen die
 * Angleichung des Anlauts (-da/-ta, -dan/-tan, -dı/-tı: `t` nach stimmlosem Laut ç f h k p s ş t). „-ki", „-ken" und
 * „-leyin" sind unveränderlich (`UNVERAENDERLICH`). `â î û` gelten als a i u. Aus TR-T7 (gerundet ⇒ ü nach o/u bei hellem
 * Stamm aus TR-T9).
 */
export function endungFehler(stamm: string, endungRoh: string): string[] {
  const fehler: string[] = [];
  let endung = endungRoh;
  for (const fest of UNVERAENDERLICH) {
    if (endung.endsWith(fest) && endung.length >= fest.length) {
      endung = endung.slice(0, -fest.length);
      break;
    }
  }
  let vorher = [...stamm].reverse().find((z) => VOKALE.has(z));
  if (HELLE_ENDUNG.has(stamm)) vorher = vorher === "o" || vorher === "u" ? "ö" : "e";
  if (vorher === "î") vorher = "i";
  for (let k = 0; k < endung.length; k++) {
    const v = endung[k];
    if (!VOKALE.has(v) || vorher === undefined) continue;
    if (v === "o") {
      vorher = v;
      continue;
    }
    // Hilfsverben in der Endung (TDK): „-(y)Abil-" (yapabilir) und „-(y)Iver-" (kapıverdi) - ihr eigener Vokal (bil, ver)
    // ist fest; danach richtet sich die Harmonie nach ihm.
    const hilfsverb = endung.slice(k - 1, k + 2);
    if ((hilfsverb === "bil" && "ae".includes(endung[k - 2] ?? "")) || (hilfsverb === "ver" && "ıiuü".includes(endung[k - 2] ?? ""))) {
      vorher = v;
      continue;
    }
    const hinten = HINTEN.has(vorher);
    const soll =
      v === "a" || v === "e"
        ? hinten ? "a" : "e"
        : vorher === "a" || vorher === "ı" || vorher === "â" ? "ı" : vorher === "e" || vorher === "i" ? "i" : vorher === "o" || vorher === "u" || vorher === "û" ? "u" : "ü";
    if (v !== soll) fehler.push(`„${v}" nach „${vorher}" (soll „${soll}")`);
    vorher = v;
  }
  const anlaut = endung[0];
  if (anlaut === "d" || anlaut === "t") {
    const soll = STIMMLOS.has(stamm[stamm.length - 1]) ? "t" : "d";
    if (anlaut !== soll) fehler.push(`Anlaut „${anlaut}" nach „${stamm[stamm.length - 1]}" (soll „${soll}")`);
  }
  return fehler;
}
/**
 * Endungen, die der Vokalharmonie nicht folgen (TDK): das angehängte „-ki" (bahçedeki), „-ken" (yaparken, giderken) und
 * „-leyin" (sabahleyin, geceleyin). Sie werden vor der Prüfung abgeschnitten; der Rest der Endung wird nachgerechnet.
 */
const UNVERAENDERLICH = ["leyin", "ken", "ki"];
/** Apostroph-Fehler einer Zeile: der Teil vor dem Apostroph ist kein Eigenname der Serie, oder die Endung passt nicht. */
export function apostrophFehler(zeile: string, namen: ReadonlySet<string>): string[] {
  const out: string[] = [];
  for (const w of woerterKlein(zeile).filter((x) => x.includes("'"))) {
    const [name, endung] = w.split("'");
    if (!istName(name, namen)) out.push(`${w}: kein Eigenname`);
    for (const f of endungFehler(name, endung ?? "")) out.push(`${w}: ${f}`);
  }
  return out;
}

// ── Wortschatz ──────────────────────────────────────────────────────────────

/**
 * Funktionswörter zählen nicht zur 8-Zeilen-Grenze: die Liste von TR-T4/T7 und - wie bei den italienischen Serien
 * essere/avere/stare - die Formen von „olmak" und „değil/var/yok", die Formen des Hilfsverbs „etmek" (teşekkür eder, ikram
 * etti; wie „fa/fai" bei IT), dazu Pronomen und ihre Fälle, Nachwörter (sonra, önce, göre, diye …) und die Ortswörter, die
 * wie Nachwörter stehen (üstünde, içinde, arasında - IT: sotto/sopra/dentro), Fragewörter, Satzadverbien und „bütün/tüm"
 * (IT: tutto). Alles andere zählt, als WORTFORM (dedi und diyor getrennt), klein.
 */
export const FUNKTIONSWOERTER: ReadonlySet<string> = new Set(
  (
    "bir bu şu o ben sen biz siz onlar bana sana beni seni benim senin bize ile da de ki mi mı mu mü ne en ama ya " +
    "kadar gibi için daha çok her hiç tam yine ve var yok değil " +
    "ona onu onun onlara onları onların bunu buna bunun bunlar bunları şunu şuna bize bizi bizim size sizi sizin " +
    "kendi kendine kendini kendisi hep hem bile ise sadece yalnızca artık hâlâ şimdi sonra önce hemen belki " +
    "diye göre beri karşı doğru olarak olan olur oldu olmuş olsun olacak olsa olunca olduğu olduğunu " +
    "nasıl neden niye nerede nereye nereden kim kime kimin hangi kaç neyse çünkü eğer veya ya da " +
    "burada orada şurada buraya oraya böyle şöyle öyle iki üç bütün tüm " +
    "üstünde üstüne üstünden altında altına altından içinde içine içinden önünde önüne arkasında arkasına arkasından " +
    "yanında yanına yanından arasında arasına arasından etrafında " +
    "ediyor eder etti ederek edecek etmiş etmek ediyorlar ettiler"
  ).split(" "),
);
export const inhaltswoerter = (z: string): Set<string> =>
  new Set(woerterKlein(z).filter((w) => !FUNKTIONSWOERTER.has(w)));
/** Inhaltswörter in mehr als `grenze` Zeilen (Eigennamen und Sprachnamen ausgenommen, auch mit Endung). */
export function zuHaeufig(zeilen: string[], namen: ReadonlySet<string>, grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltswoerter(z)) if (!istName(w.split("'")[0], namen)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Sperrliste: Kern, Wortbasis, gefaltet (ı→i ş→s …) und die unerwünschten Themenwörter - auf jedem Wort und jedem Teil. */
export function gesperrteWoerter(zeile: string): string[] {
  const ganz = woerterKlein(zeile);
  const teile = klein(zeile).split(/[^\p{L}]+/u).filter(Boolean);
  return [...new Set([...ganz, ...teile])].filter((w) => gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w));
}

/** Der geprüfte Wortschatz VOR den Serien: Übungswörter, Stufen-Wortschatz, Lexikon-Nachtrag und jede tr-Korpuszeile (T1-T9). */
export const BASIS: ReadonlySet<string> = new Set(
  [
    ...WORDS_TR,
    ...Object.values(STUFE_VOCAB_TR).flat(),
    ...NACHTRAG_TR,
    ...NACHTRAG_TR_ERGAENZT,
    ...TR_ROH.flatMap((i) => klein(i.text).split(/[^\p{L}]+/u)),
  ]
    .map((w) => klein(w))
    .filter(Boolean),
);

/** Ist ein Wort (klein, ohne Apostroph) belegt - Wortschatz, Grundform, Form, Name? */
export const belegt = (w: string, namen: ReadonlySet<string>): boolean =>
  w.length < 2 || BASIS.has(w) || w in NEUE_GRUNDFORMEN || w in NEUE_FORMEN || istName(w, namen);

/** Wörter (ohne Apostroph-Formen - die prüft der Apostroph-Test), die weder bekannt noch belegt sind. */
export function ungeprueft(zeilen: string[], namen: ReadonlySet<string>): string[] {
  const out = new Set<string>();
  for (const z of zeilen) for (const w of woerterKlein(z)) if (!w.includes("'") && !belegt(w, namen)) out.add(w);
  return [...out];
}

/**
 * Ein Stamm ist bekannt, wenn er im Wortschatz oder unter den Grundformen steht - oder wenn er ein Verbstamm ist, dessen
 * Infinitiv dort steht (`kaz` ⇐ `kazmak`): das Lexikon führt Verben als gebeugte Formen, kaum als nackten Stamm.
 */
export const stammBekannt = (w: string): boolean =>
  BASIS.has(w) || w in NEUE_GRUNDFORMEN || BASIS.has(`${w}mak`) || BASIS.has(`${w}mek`);
/**
 * Der Lautwandel zwischen Grundform und Stamm einer Form (drittes Feld in `NEUE_FORMEN`), TDK:
 *  · Erweichung vor Vokal: kitap ⇒ kitab-, ağaç ⇒ ağac-, fiyort ⇒ fiyord- (`erweicht`);
 *  · Vokalausfall vor vokalisch anlautender Endung: omuz ⇒ omz-una, burun ⇒ burn-u (nur Wörter in `VOKALAUSFALL`);
 *  · Verengung vor „-yor": anla ⇒ anl-ıyor, üfle ⇒ üfl-üyor (der Endvokal a/e des Verbstamms fällt, die Endung beginnt mit
 *    ı i u ü + „yor").
 */
export function lautwandel(grund: string, stamm: string, endung: string): boolean {
  if (erweicht(grund) === stamm) return true;
  const vokalAnfang = VOKALE.has(endung[0] ?? "");
  const letzter = [...grund].map((z, i) => [z, i] as const).filter(([z]) => VOKALE.has(z)).pop();
  if (VOKALAUSFALL.has(grund) && vokalAnfang && letzter && letzter[1] === grund.length - 2 && grund.slice(0, letzter[1]) + grund.slice(letzter[1] + 1) === stamm) return true;
  return /[ae]$/.test(grund) && grund.slice(0, -1) === stamm && /^[ıiuü]yor/.test(endung);
}

/** Wörter mit Vokalausfall vor vokalischer Endung (TDK „ünlü düşmesi") - eine geschlossene Liste, keine Regel. */
const VOKALAUSFALL: ReadonlySet<string> = new Set(
  "omuz ağız burun oğul alın boyun karın gönül isim resim şehir nehir beyin akıl fikir sabır zihin ömür şekil kısım metin bağır göğüs keyif hüküm kayıt vakit emir kahır nesil ritim".split(" "),
);

/**
 * Die Endungen des Türkischen als Archiphoneme (A = a/e, I = ı/i/u/ü, D = d/t, C = c/ç, K = k/ğ; Puffer in Klammern):
 * Mehrzahl, Besitz, Fälle, Personen, Zeiten und Modi, Partizipien und Konverben, Passiv/Kausativ/Reflexiv, die häufigen
 * Ableitungen (-lI, -sIz, -lIK, -CI, -lA, -lAn, -lAş). Eine belegte Endung muss sich GANZ in diese Stücke zerlegen lassen -
 * so fällt eine Zerlegung wie „kafe + s" auf (die Harmonie allein sähe nichts). Kein Morphologie-Programm, ein Netz.
 */
export const ENDUNGS_MUSTER: readonly string[] = (
  "lAr (I)m (I)n (s)I (I)mIz (I)nIz lArI (y)I nI (y)A nA DA nDA DAn nDAn (n)In (y)lA CA ki (y)Im sIn (y)Iz sInIz DIr " +
  "mA mI yor Iyor DI mIş (y)AcAK Ar Ir r mAz (y)sA mAlI (y)Abil (y)AmA (y)Ip (y)ArAk (y)IncA mAdAn (y)ken DIK (y)An " +
  "(y)AsI mAk (y)Iş Il In n Iş t lA lAş lAn lI sIz lIK CI CIK sAl (y)Iver DIkçA (y)AlIm (y)AyIm (y)In (y)InIz sInlAr " +
  "cAsInA DAş (I)msI cAğIz (y)IcI (y)AmAz mAksIzIn leyin (y)DI (y)mIş"
).split(" ");
const ERSATZ: Readonly<Record<string, string>> = { A: "ae", I: "ıiuü", D: "dt", C: "cç", K: "kğ" };
function ausfalten(muster: string): string[] {
  const teile = muster.match(/\([^)]*\)|[^()]/g) ?? [];
  let alle = [""];
  for (const t of teile) {
    let optionen: string[];
    if (t.startsWith("(")) {
      let innen = [""];
      for (const c of t.slice(1, -1)) innen = innen.flatMap((v) => [...(ERSATZ[c] ?? c)].map((x) => v + x));
      optionen = ["", ...innen];
    } else optionen = [...(ERSATZ[t] ?? t)];
    alle = alle.flatMap((v) => optionen.map((x) => v + x));
  }
  return alle;
}
const ENDUNGS_STUECKE: ReadonlySet<string> = new Set(ENDUNGS_MUSTER.flatMap(ausfalten).filter(Boolean));
const LAENGSTES_STUECK = Math.max(...[...ENDUNGS_STUECKE].map((x) => x.length));
const zerlegbarCache = new Map<string, boolean>();
/** Lässt sich die Endung ganz in Endungs-Stücke zerlegen? */
export function endungZerlegbar(e: string): boolean {
  if (e === "") return true;
  const c = zerlegbarCache.get(e);
  if (c !== undefined) return c;
  let ok = false;
  for (let i = 1; i <= Math.min(LAENGSTES_STUECK, e.length) && !ok; i++) ok = ENDUNGS_STUECKE.has(e.slice(0, i)) && endungZerlegbar(e.slice(i));
  zerlegbarCache.set(e, ok);
  return ok;
}

/** Jede belegte Form: Stamm + Endung ergibt das Wort, der Stamm ist bekannt (oder erweicht), Harmonie und Angleichung stimmen. */
export function formenFehler(formen: typeof NEUE_FORMEN = NEUE_FORMEN): string[] {
  const fehler: string[] = [];
  for (const [wort, [stamm, endung, grund]] of Object.entries(formen) as [string, readonly string[]][]) {
    if (stamm + endung !== wort) fehler.push(`${wort}: ${stamm} + ${endung} ergibt ${stamm + endung}`);
    const basis = grund ?? stamm;
    if (grund !== undefined && !lautwandel(grund, stamm, endung)) fehler.push(`${wort}: ${grund} wird nicht zu ${stamm}`);
    if (!stammBekannt(basis)) fehler.push(`${wort}: Stamm „${basis}" unbekannt`);
    for (const f of endungFehler(stamm, endung)) fehler.push(`${wort}: ${f}`);
    if (!endungZerlegbar(endung)) fehler.push(`${wort}: Endung „${endung}" lässt sich nicht in Endungs-Stücke zerlegen`);
  }
  return fehler;
}

// ── Kopien, Paare, fast gleich ──────────────────────────────────────────────

/** Person und Zahl gleichgesetzt: „Ben de geldim"/„Sen de geldin"-Paare und Einzahl/Mehrzahl (Muster TR-T4). */
export function paarForm(zeile: string): string {
  const pron: Record<string, string> = { ben: "PRO", sen: "PRO", o: "PRO", biz: "PRO", siz: "PRO", onlar: "PRO" };
  return woerterKlein(zeile)
    .map((w) => pron[w] ?? w.replace(/l[ae]r$/u, ""))
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

export const ohneSatzzeichen = (t: string): string => klein(t).replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
export function kopienGegen(zeilen: string[], gegen: string[]): string[] {
  const texte = new Set(gegen.map(ohneSatzzeichen));
  const schluessel = new Set(gegen.map((t) => bausteinKey("satz", t)));
  return zeilen.filter((t) => texte.has(ohneSatzzeichen(t)) || schluessel.has(bausteinKey("satz", t)));
}

/** Die Texte der Tippchallenge-Banken aller Wege: jede Datei `schreibproben/texte*.ts`. */
const BANKEN = import.meta.glob("../../src/lib/typing/schreibproben/texte*.ts", { eager: true }) as Record<string, Record<string, unknown>>;
export function bankZeilen(): string[] {
  const out: string[] = [];
  for (const modul of Object.values(BANKEN)) {
    for (const wert of Object.values(modul)) {
      if (!Array.isArray(wert)) continue;
      for (const t of wert) {
        const zeilen = (t as { zeilen?: unknown }).zeilen;
        if (Array.isArray(zeilen)) for (const z of zeilen) if (typeof z === "string") out.push(z);
      }
    }
  }
  return out;
}

/** Jede tr-Korpuszeile (die ROHE Sammelliste, T1-T9) und jede tr-Serie, die nicht zu `eigeneSlugs` gehört. */
export function andereTrZeilen(eigeneSlugs: ReadonlySet<string>): string[] {
  return [
    ...TR_ROH.map((i) => i.text),
    ...SERIEN.filter((s) => s.lang === "tr" && !eigeneSlugs.has(s.slug)).flatMap((s) => zeilenVon(s)),
  ];
}
/** Alles andere, was Text trägt: alle anderen Korpora, alle anderen Serien, alle Banken - Zeile für Zeile und Satz für Satz. */
export function alleFremdenZeilen(eigeneSlugs: ReadonlySet<string>): string[] {
  const roh = [
    ...[...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_CS].map((i) => i.text),
    ...SERIEN.filter((s) => s.lang !== "tr" && !eigeneSlugs.has(s.slug)).flatMap((s) => zeilenVon(s)),
    ...bankZeilen(),
  ];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}

const wortMenge = (t: string): Set<string> => new Set(ohneSatzzeichen(t).split(" ").filter(Boolean));
export function jaccard(a: string, b: string): number {
  const x = wortMenge(a);
  const y = wortMenge(b);
  let s = 0;
  for (const w of x) if (y.has(w)) s++;
  return s / (x.size + y.size - s);
}
/**
 * „Fast gleich" (Falle 31/51): Paare mit Jaccard ≥ grenze. Über 170 000 Vergleichszeilen mit Präfix-Filter (wie
 * `plSerienRegeln.ts`): ist J(A, B) ≥ g, enthält B mindestens eines der (|A| - ⌈g·|A|⌉ + 1) seltensten Wörter von A.
 */
export function fastGleich(zeilen: string[], gegen: string[], grenze: number): string[] {
  const mengen = gegen.map((g) => wortMenge(g));
  const index = new Map<string, number[]>();
  mengen.forEach((m, i) => {
    for (const w of m) {
      let l = index.get(w);
      if (!l) index.set(w, (l = []));
      l.push(i);
    }
  });
  const out: string[] = [];
  for (const z of zeilen) {
    const a = wortMenge(z);
    const sortiert = [...a].sort((x, y) => (index.get(x)?.length ?? 0) - (index.get(y)?.length ?? 0));
    const k = a.size - Math.ceil(grenze * a.size) + 1;
    const kandidaten = new Set<number>();
    for (const w of sortiert.slice(0, Math.max(k, 1))) for (const i of index.get(w) ?? []) kandidaten.add(i);
    for (const i of kandidaten) {
      if (gegen[i] === z) continue;
      const b = mengen[i];
      let s = 0;
      for (const w of a) if (b.has(w)) s++;
      if (s / (a.size + b.size - s) >= grenze) out.push(`"${z}" ~ "${gegen[i]}"`);
    }
  }
  return out;
}
/** Der volle Vergleich jede gegen jede - nur für die Gegenprobe des Präfix-Filters. */
export function fastGleichVoll(zeilen: string[], gegen: string[], grenze: number): string[] {
  const out: string[] = [];
  for (const z of zeilen) for (const g of gegen) if (g !== z && jaccard(z, g) >= grenze) out.push(`"${z}" ~ "${g}"`);
  return out;
}
/** Untereinander (jedes Paar einmal). */
export function fastGleichUntereinander(zeilen: string[], grenze: number): string[] {
  const out: string[] = [];
  const m = zeilen.map((z) => wortMenge(z));
  for (let i = 0; i < zeilen.length; i++) {
    for (let j = i + 1; j < zeilen.length; j++) {
      let s = 0;
      for (const w of m[i]) if (m[j].has(w)) s++;
      if (s / (m[i].size + m[j].size - s) >= grenze) out.push(`"${zeilen[i]}" ~ "${zeilen[j]}"`);
    }
  }
  return out;
}

// ── Regionen ────────────────────────────────────────────────────────────────

/** Serien je Region (jede der acht erscheint, auch mit 0). */
export function proBoelge(serien: readonly { land: string }[]): Map<string, number> {
  const m = new Map<string, number>(BOELGELER_TR.map((b) => [b, 0]));
  for (const s of serien) m.set(s.land, (m.get(s.land) ?? 0) + 1);
  return m;
}
