/**
 * Gemeinsame Regeln der POLNISCHEN Serien (PL-S, 09.10.2026) - eine Stelle für die drei Wächter
 * `tastenflow-serien-pl-{kids,teens,erwachsen}-1.test.ts`. Jede Funktion nimmt ihre Eingabe als Parameter, damit jeder
 * Wächter sie mit einer Gegenprobe zeigen kann.
 *
 * Herkunft der Regeln: `plTextRegeln.ts` (jede pl-Zeile), die Korpus-Wächter PL-T7/T8/T9 (Anrede, Geschlecht, Feiertage,
 * Naht nach dem Kürzen, Wortbasis, Ogonek-Zwillinge, Paare, Jaccard, Kopien gegen alles) und die italienischen
 * Serien-Wächter (Form der Serie, Öffnungs-Sprosse, Eigennamen der Serie, Wortgrenze 8 je Charge).
 *
 * ⚠️ Serien-Zeilen sind KEINE Korpuszeilen: sie tragen keine Anker-ID (`erzeuge-korpus-anker.mts` liest nur den Korpus) und
 * kommen nicht in den Generator. Die Prüfung „die Stimme buchstabiert nichts" über `isRealWord` wäre hier ZIRKULÄR - das
 * Vorlese-Lexikon nimmt jedes Wort jeder Serie auf (Befund IT-S Erwachsene §3) -, sie wird darum durch die Wortbasis
 * ersetzt (Wortschatz + jede frühere pl-Korpuszeile + die von Hand belegte Liste der Charge).
 */
import { setLayout } from "../../src/lib/typing/layouts";
import { introOrder } from "../../src/lib/typing/letters";
import { fitText, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_ES, CORPUS_IT, CORPUS_TR, CORPUS_CS } from "../../src/lib/typing/corpus";
import { CORPUS_PL as PL_ROH } from "../../src/lib/typing/corpusPl";
import { SERIEN, allowedFromIntroduced } from "../../src/lib/typing/serien";
import { bausteinKey } from "../../src/lib/typing/ledger";
import { gesperrtPl, ohneOgonki } from "../../src/lib/typing/sperrlistePl";
import { WORDS_PL, STUFE_VOCAB_PL } from "../../src/lib/typing/wordsPl";
import { NACHTRAG_PL, NACHTRAG_PL_ERGAENZT } from "../../src/lib/typing/lexikonNachtragPl";
import { WOIWODSCHAFTEN_PL, type SerieEntwurfPl } from "../../src/lib/typing/serienPlTyp";
import { zeilenFehler } from "./plTextRegeln";

export { zeilenFehler, gesperrtPl, WOIWODSCHAFTEN_PL };

export const zeilenVon = (s: { etappen: { lines: string[] }[] }): string[] => s.etappen.flatMap((e) => e.lines);
export const woerter = (z: string): string[] => z.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

// ── Form ────────────────────────────────────────────────────────────────────

export interface FormRegel {
  /** Erlaubte Zeichen der Zeile (ganzer Ausdruck, z. B. Buchstaben + `. , ; : ? ! " '`). */
  erlaubt: RegExp;
  minWoerter: number;
  maxWoerter: number;
  /** Höchstens so viele Zeichen (undefined = keine Grenze). */
  maxZeichen?: number;
}

/** Alle Form-Verstösse EINER Zeile (leer = in Ordnung). */
export function formFehler(z: string, r: FormRegel): string[] {
  const p: string[] = [...zeilenFehler(z)];
  if (!r.erlaubt.test(z)) p.push("Zeichen ausserhalb der erlaubten");
  if (!/^"?\p{Lu}/u.test(z)) p.push("kein Grossbuchstabe am Anfang");
  if (!/[.!?]"?$/.test(z)) p.push("kein Satzschluss am Ende");
  if (/[.!?]"?\s+"?\p{Lu}/u.test(z)) p.push("mehr als ein Satz");
  if (/[,;:](?=[^\s\d])/u.test(z)) p.push("kein Leerzeichen nach , ; :");
  if ((z.match(/"/g) ?? []).length % 2 !== 0) p.push("Anführungszeichen ungerade");
  if (/-/.test(z)) p.push("Bindestrich (vor seiner Sprosse fiele er weg und zerrisse das Wort oder den Einschub)");
  if (/\bto:/iu.test(z)) p.push("Doppelpunkt nach „to“ (im Polnischen ein Fehler)");
  if (r.maxZeichen !== undefined && z.length > r.maxZeichen) p.push(`länger als ${r.maxZeichen} Zeichen`);
  const n = woerter(z).length;
  if (n < r.minWoerter || n > r.maxWoerter) p.push(`${n} Wörter`);
  return p;
}

/** Form der Serie: Etappen-Zahl, Zeilen je Etappe, jede Etappe endet auf ? oder !. */
export function serienFormFehler(
  s: SerieEntwurfPl,
  stufe: "kids" | "teens" | "erwachsen",
  minZeilen: number,
  maxZeilen: number,
): string[] {
  const f: string[] = [];
  if (JSON.stringify(s.stufen) !== JSON.stringify([stufe])) f.push(`${s.slug}: stufen`);
  if (s.kind !== "geschichte") f.push(`${s.slug}: kind`);
  if (s.lang !== "pl" || s.nurWeg !== "pl") f.push(`${s.slug}: lang/nurWeg`);
  if (s.herkunft.quelle !== "Sensorik" || s.herkunft.lizenz !== "Eigenes Werk") f.push(`${s.slug}: herkunft`);
  if (!(WOIWODSCHAFTEN_PL as readonly string[]).includes(s.land)) f.push(`${s.slug}: land ${s.land}`);
  if (s.etappen.length < 2 || s.etappen.length > 3) f.push(`${s.slug}: ${s.etappen.length} Etappen`);
  s.etappen.forEach((e, i) => {
    if (e.lines.length < minZeilen || e.lines.length > maxZeilen) f.push(`${s.slug} E${i + 1}: ${e.lines.length} Zeilen`);
    if (!/[?!]"?$/.test(e.lines[e.lines.length - 1] ?? "")) f.push(`${s.slug} E${i + 1}: endet ohne ? oder !`);
  });
  if (woerter(s.titel).length > 6) f.push(`${s.slug}: Titel zu lang`);
  for (const n of s.eigennamen) if (!zeilenVon(s).some((l) => l.includes(n))) f.push(`${s.slug}: Eigenname ${n} kommt nicht vor`);
  return f;
}

// ── Anrede, Geschlecht der tippenden Person, Feiertage (PL-T9) ───────────────

export const ANREDE = /(?<!\p{L})(pan|pani|panie|państwo|pana|panu|panią|państwa|państwu)(?!\p{L})/iu;

/**
 * Vergangenheit und Konditional der 1./2. Person verraten das Geschlecht der Person, die tippt (byłem/byłam,
 * zrobiłeś/zrobiłaś, chciałbym/chciałabym, kupiliśmy/kupiłyśmy) - auch in wörtlicher Rede, denn getippt wird sie trotzdem.
 * Dazu „jestem/jesteś" + Adjektiv und Wörter mit festem Geschlecht über die eigene Person.
 */
const ICH_DU_VERGANGENHEIT = /\p{L}+(łem|łam|łeś|łaś|łbym|łabym|łbyś|łabyś|liśmy|łyśmy|liście|łyście)(?!\p{L})/u;
/** Wörter mit derselben Endung, die kein Verb sind (hasłem = Instr. von hasło). Wächst nur mit gelesenen Formen. */
const KEIN_VERB: ReadonlySet<string> = new Set(["hasłem", "masłem", "skrzydłem", "kołem", "mydłem", "szkłem", "światłem", "dołem", "stołem", "piórem", "wiosłem", "krzesłem", "żagłem", "węzłem", "kościołem", "popiołem", "aniołem", "orłem", "osłem"]);
const SELBST_MIT_GESCHLECHT = /^(powinienem|powinnam|powinieneś|powinnaś|sam|sama|gotowy|gotowa|zadowolony|zadowolona|pewien|pewna|zmęczony|zmęczona|głodny|głodna|szczęśliwy|szczęśliwa)$/;
const NACH_JESTEM_ERLAUBT = new Set(["na", "w", "we", "z", "ze", "do", "po", "u", "od", "przy", "nad", "pod", "za", "już", "tu", "tutaj", "teraz", "jeszcze", "tylko", "też", "tam"]);
export function geschlechtFehler(zeile: string): boolean {
  const w = zeile.toLowerCase().match(/\p{L}+/gu) ?? [];
  if (w.some((x) => !KEIN_VERB.has(x) && ICH_DU_VERGANGENHEIT.test(x))) return true;
  // „sam/sama" nur in der ersten/zweiten Person: „Jestem sama", „Zrobisz to sam?" - grob: jedes Vorkommen wird gelesen.
  if (w.some((x, i) => SELBST_MIT_GESCHLECHT.test(x) && ["jestem", "jesteś", "jesteśmy", "jesteście", "czuję", "czujesz", "byłbym"].includes(w[i - 1] ?? ""))) return true;
  if (w.some((x) => /^(powinienem|powinnam|powinieneś|powinnaś)$/.test(x))) return true;
  const i = w.findIndex((x) => x === "jestem" || x === "jesteś");
  return i >= 0 && i + 1 < w.length && !NACH_JESTEM_ERLAUBT.has(w[i + 1]);
}

/**
 * Feiertage, ihre Bräuche und Speisen gehören EINER Charge, die Johannes erst freigeben muss (PL-T9 §6).
 * `świętokrzysk-` (die Woiwodschaft) ist kein Feiertag und wird vorher entfernt.
 */
const FEIERTAG =
  /(wigili|boże narodzeni|bożego narodzeni|wielkanoc|święt|sylwest|nowy rok|andrzejk|zaduszk|tłusty czwartek|śmigus|majówk|11 listopada|3 maja|1 maja|boże ciało|bożego ciała|walentynk|dzień matki|dzień ojca|dzień kobiet|dzień dziecka|imienin|mikołaj|opłat(?!a|ę|y|ą)|pisank|kolęd|choink|pączk|zmartwychwst|wniebowst|trzech króli|popielec|wielki piątek|niepodległoś|odpust|komuni|bierzmowa|kości(ół|oł|ele)|ksiądz|księdz|modli|msza|mszy|parafi)/iu;
export const feiertagIn = (z: string): boolean => FEIERTAG.test(z.replace(/świętokrzysk/giu, ""));

/** Politik und Bekenntnis (Auftrag): Parteien, Wahlen, Kirche - eine Zeile darüber gehört nicht in eine Serie. */
const POLITIK = /(wybor(y|ach|ów)|partii|partia|polityk|sejm|senat|prezydent|premier|rząd(?!ek)|rządu|minister|kampani[aię] wyborcz|głosowa)/iu;
export const politikIn = (z: string): boolean => POLITIK.test(z);

/**
 * Erblindung (und jede Behinderung) ohne Etikett, Person zuerst: die Figur TUT etwas (czyta pismem Braille'a, chodzi z białą
 * laską, słucha czytnika ekranu, jeździ na wózku) - nie „niewidomy/niewidoma", „ślepy", „głuchy", „kaleka", „inwalida".
 */
const ETIKETT = /(niewidom|ociemnia|ślep|głuch|kalek|inwalid|upośledz|niepełnosprawn(y|a|e|i)(?!\p{L}))/iu;
export const etikettIn = (z: string): boolean => ETIKETT.test(z);

// ── Sprossen (Tastatur pl, Weg pl) ──────────────────────────────────────────

export const ordnung = (): string[] => {
  setLayout("pl");
  return introOrder("pl");
};
const allowedCache = new Map<number, Set<string>>();
export function allowedAt(n: number): Set<string> {
  const o = ordnung();
  let s = allowedCache.get(n);
  if (!s) {
    s = allowedFromIntroduced(o.slice(0, n), "pl");
    allowedCache.set(n, s);
  }
  return s;
}
const norm = (t: string) => t.replace(/\s+/g, " ").trim();
const ersteCache = new Map<string, number | null>();
/** Kleinste Sprosse, ab der die Zeile überhaupt (gekürzt) serviert wird. */
export function ersteSprosse(t: string): number | null {
  if (ersteCache.has(t)) return ersteCache.get(t)!;
  let erg: number | null = null;
  const n0 = ordnung().length;
  for (let n = 1; n <= n0; n++) if (fitText(t, allowedAt(n), "pl") !== null) { erg = n; break; }
  ersteCache.set(t, erg);
  return erg;
}
const volleCache = new Map<string, number | null>();
/** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
export function volleSprosse(t: string): number | null {
  if (volleCache.has(t)) return volleCache.get(t)!;
  let erg: number | null = null;
  const n0 = ordnung().length;
  for (let n = 1; n <= n0; n++) if (fitText(t, allowedAt(n), "pl") === norm(t)) { erg = n; break; }
  volleCache.set(t, erg);
  return erg;
}
/** Kleinste Sprosse, ab der JEDE Zeile der Serie serviert wird (null = eine Zeile nie). */
export function oeffnet(s: { etappen: { lines: string[] }[] }): number | null {
  let max = 0;
  for (const z of zeilenVon(s)) {
    const b = ersteSprosse(z);
    if (b === null) return null;
    max = Math.max(max, b);
  }
  return max;
}
/** Die Einheit, an der die Serie öffnet („ź", „?" …). */
export const oeffnetEinheit = (s: { etappen: { lines: string[] }[] }): string | null => {
  const n = oeffnet(s);
  return n === null ? null : ordnung()[n - 1];
};

// ── Grosswörter, auch nach dem Kürzen ───────────────────────────────────────

const TECHNISCH = /[@_/#=<>|*+&$%€\\^\d[\]{}]/;
/** Wörter einer Zeile mit Merker „Satzanfang" (Zeilenanfang, nach . ? !, Anfang einer Anführung); Ziffern-Wörter fallen weg. */
export function woerterMitAnfang(zeile: string): { w: string; anfang: boolean }[] {
  const out: { w: string; anfang: boolean }[] = [];
  let naechsterAnfang = true;
  for (const roh of zeile.split(/\s+/)) {
    const kern = roh.replace(/^["(]+|[.,;!?:")]+$/g, "");
    if (!TECHNISCH.test(kern)) {
      const w = kern.replace(/^[^\p{L}]+|[^\p{L}']+$/gu, "");
      if (w) out.push({ w, anfang: naechsterAnfang || roh.startsWith('"') });
    }
    naechsterAnfang = /[.!?]"?\)?$/.test(roh);
  }
  return out;
}
/** Die Eigennamen einer Serie als Wortmenge (klein; mehrteilige Namen in ihre Wörter zerlegt, Apostroph-Formen ganz). */
export const namenVon = (s: { eigennamen: string[] }): Set<string> =>
  new Set(s.eigennamen.flatMap((n) => n.toLowerCase().split(/\s+/)));
/** Grossgeschriebene Wörter, die weder am Satzanfang stehen noch ein Eigenname der Serie sind. */
export function fremdeGrosswoerter(zeile: string, namen: ReadonlySet<string>): string[] {
  return woerterMitAnfang(zeile)
    .filter((x) => !x.anfang && /^\p{Lu}/u.test(x.w) && !namen.has(x.w.toLowerCase()))
    .map((x) => x.w);
}
/**
 * Weg „pl" lässt ungelernte `? ! " :` weg (PL-T7 §1): eine Zeile kommt vor deren Sprosse GEKÜRZT. Fällt dabei eine
 * Satzgrenze weg (`woła: "Chodź!"` ⇒ `woła Chodź`), stünde ein Grosswort mitten im Satz (Naht-Regel PL-T7).
 */
export function gekuerztFehler(zeile: string, namen: ReadonlySet<string>): string[] {
  const b = ersteSprosse(zeile);
  const v = volleSprosse(zeile);
  if (b === null || v === null) return [];
  const out = new Set<string>();
  for (let n = b; n < v; n++) {
    const s = fitText(zeile, allowedAt(n), "pl");
    if (s !== null) for (const w of fremdeGrosswoerter(s, namen)) out.add(`${n}:${w}`);
  }
  return [...out];
}

// ── Wortschatz ──────────────────────────────────────────────────────────────

/**
 * Funktionswörter zählen nicht zur 8-Zeilen-Grenze: die Liste von PL-T7 und - wie bei den italienischen Serien
 * essere/avere/stare - alle Formen von być und mieć, dazu Pronomen, Fragewörter, Konjunktionen und Präpositionen.
 * Alles andere zählt, als WORTFORM (idzie und szła getrennt), klein geschrieben.
 */
export const FUNKTIONSWOERTER: ReadonlySet<string> = new Set(
  (
    "a i w we z ze na do od o po za nad pod przed dla jak to ten ta te tak nie się mi mnie ja ty on ona ono my wy " +
    "oni one jest są ma mam masz mamy macie mają czy co oraz lub ale no był była było byli były że już też go jej jego ich mu ją " +
    "bo u przy przez bez nam nas was wam im nim nią niego niej nich nimi je jestem jesteś jesteśmy jesteście być będzie będą " +
    "będę będziesz będziemy miał miała miało mieli miały mieć sobie siebie sobą swój swoja swoje swoich swoim swoją swojej swojego " +
    "mój moja moje mojego mojej moim moją twój twoja twoje nasz nasza nasze naszej naszego naszym wasz wasza wasze " +
    "który która które którzy których którym którą którego kto kogo komu kim czego czym gdzie kiedy dlaczego ile jaki jaka jakie " +
    "każdy każda każde cały cała całe wszystko wszyscy wszystkie tam tu tutaj teraz potem jeszcze bardzo także albo ani więc gdy " +
    "jeśli żeby aby niż ku między obok koło wokół około tego tej tym tych temu tą tę tamten tamta tamto ten sam sama samo tylko " +
    "nawet zawsze nigdy coś ktoś nic nikt czyli przecież chyba może"
  ).split(" "),
);
export const inhaltswoerter = (z: string): Set<string> =>
  new Set((z.toLowerCase().match(/[\p{L}']+/gu) ?? []).filter((w) => !FUNKTIONSWOERTER.has(w)));
/** Inhaltswörter in mehr als `grenze` Zeilen (Eigennamen ausgenommen). */
export function zuHaeufig(zeilen: string[], namen: ReadonlySet<string>, grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltswoerter(z)) if (!namen.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Die Wörter einer Zeile für Sperrliste und Wortbasis (klein; Apostroph-Formen wie „braille'a" ganz). */
export const pruefWoerter = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w.toLowerCase());

/** Der geprüfte Wortschatz VOR den Serien: Übungswörter, Stufen-Wortschatz, Lexikon-Nachtrag und jede pl-Korpuszeile (T1-T9). */
export const BASIS: ReadonlySet<string> = new Set(
  [
    ...WORDS_PL,
    ...Object.values(STUFE_VOCAB_PL).flat(),
    ...NACHTRAG_PL,
    ...NACHTRAG_PL_ERGAENZT,
    ...PL_ROH.flatMap((i) => woerterMitAnfang(i.text).map((x) => x.w)),
  ].map((w) => w.toLowerCase()),
);

/**
 * Wörter, die weder in der BASIS noch unter den Eigennamen der Serie stehen und nicht in `belegt` (Form ⇒ Grundform und
 * Begründung; für Polnisch gibt es kein Wörterbuch auf diesem Rechner, Falle 61).
 */
export function ungeprueft(zeilen: string[], belegt: Readonly<Record<string, string>>, namen: ReadonlySet<string>): string[] {
  const out = new Set<string>();
  for (const z of zeilen) for (const w of pruefWoerter(z)) if (w.length >= 2 && !BASIS.has(w) && !(w in belegt) && !namen.has(w)) out.add(w);
  return [...out];
}

/** „Ogonek-Zwillinge" (PL-T1 §4): Formen ohne Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist (ze/że, lata/łata). */
export const ZWILLINGE: ReadonlyMap<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const v of BASIS) {
    if (!/[ąćęłńóśźż]/.test(v)) continue;
    const k = ohneOgonki(v);
    if (k !== v) m.set(k, [...(m.get(k) ?? []), v]);
  }
  return m;
})();
export const mitZwilling = (zeile: string): boolean => pruefWoerter(zeile).some((w) => w.length >= 2 && ZWILLINGE.has(w));
/**
 * Die Zwillings-Wörter, die in diesen Zeilen stehen (die Form OHNE Ogonek, deren Form mit Ogonek auch ein Wort ist). Die
 * Serien-Wächter führen sie als WORTLISTE mit Begründung (gelesen: hier ist die geschriebene Form gemeint) statt als
 * Zeilenliste wie die Korpus-Wächter - dieselbe Lesepflicht, ohne jede Zeile ein zweites Mal abzuschreiben.
 */
export const zwillingWoerter = (zeilen: string[]): Set<string> =>
  new Set(zeilen.flatMap((z) => pruefWoerter(z).filter((w) => w.length >= 2 && ZWILLINGE.has(w))));

// ── Kopien, Paare, fast gleich ──────────────────────────────────────────────

/** Geschlecht und Zahl grob gleichgesetzt: „on/ona", Endvokal weg (Muster PL-T6). */
export function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", one: "PRO" };
  return (zeile.toLowerCase().match(/[\p{L}\d]+/gu) ?? []).map((w) => pron[w] ?? w.replace(/[aeiouyąę]?$/, "_")).join(" ");
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

export const ohneSatzzeichen = (t: string): string => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
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

/** Jede pl-Korpuszeile (die ROHE Sammelliste, T1-T9) und jede pl-Serie, die nicht zu `eigeneSlugs` gehört. */
export function anderePlZeilen(eigeneSlugs: ReadonlySet<string>): string[] {
  return [
    ...PL_ROH.map((i) => i.text),
    ...SERIEN.filter((s) => s.lang === "pl" && !eigeneSlugs.has(s.slug)).flatMap((s) => zeilenVon(s)),
  ];
}
/** Alles andere, was Text trägt: alle anderen Korpora, alle anderen Serien, alle Banken - Zeile für Zeile und Satz für Satz. */
export function alleFremdenZeilen(eigeneSlugs: ReadonlySet<string>): string[] {
  const roh = [
    ...[...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_TR, ...CORPUS_CS].map((i) => i.text),
    ...SERIEN.filter((s) => s.lang !== "pl" && !eigeneSlugs.has(s.slug)).flatMap((s) => zeilenVon(s)),
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
 * „Fast gleich" (Falle 31/51): Paare mit Jaccard ≥ grenze (eine Zeile mit sich selbst zählt nicht).
 * Über 170 000 Vergleichszeilen nicht jede gegen jede: Ist J(A, B) ≥ g, dann fehlen B höchstens |A| - ⌈g·|A|⌉ Wörter von A -
 * B enthält also mindestens eines der (|A| - ⌈g·|A|⌉ + 1) SELTENSTEN Wörter von A. Nur diese Kandidaten werden genau gerechnet
 * (Präfix-Filter; die Gegenprobe im Wächter vergleicht das Ergebnis mit dem vollen Vergleich).
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

/** Serien je Woiwodschaft (jede der 16 erscheint, auch mit 0). */
export function proWoiwodschaft(serien: readonly { land: string }[]): Map<string, number> {
  const m = new Map<string, number>(WOIWODSCHAFTEN_PL.map((w) => [w, 0]));
  for (const s of serien) m.set(s.land, (m.get(s.land) ?? 0) + 1);
  return m;
}
