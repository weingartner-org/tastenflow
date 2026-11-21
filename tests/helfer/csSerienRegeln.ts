/**
 * Gemeinsame Regeln der TSCHECHISCHEN Serien (CS-S, 09.10.2026) - eine Stelle für die drei Wächter
 * `tastenflow-serien-cs-{kids,teens,erwachsen}-1.test.ts`. Jede Funktion nimmt ihre Eingabe als Parameter, damit jeder
 * Wächter sie mit einer Gegenprobe zeigen kann. Form wie `plSerienRegeln.ts` (Zweig `pl-serien-1`); nichts Polnisches.
 *
 * Herkunft der Regeln: `csTextRegeln.ts` (jede cs-Zeile), die Korpus-Wächter CS-T8/CS-T9 (Geschlecht der tippenden Person
 * auch mit „bych", Feiertage, Daten, Zahlformat, v/ve und z/ze vor Zahlen, Naht nach dem Kürzen, Wortbasis, Diakritik-Falle,
 * Paare, Jaccard, Kopien gegen alles) und die italienischen Serien-Wächter (Form der Serie, Öffnungs-Sprosse, Eigennamen der
 * Serie, Wortgrenze 8 je Charge, Servieren ohne verlorenes Wort).
 *
 * ⚠️ Serien-Zeilen sind KEINE Korpuszeilen: sie tragen keine Anker-ID (`erzeuge-korpus-anker.mts` liest nur den Korpus) und
 * kommen nicht in den Generator. Die Prüfung „die Stimme buchstabiert nichts" über `isRealWord` wäre hier ZIRKULÄR - das
 * Vorlese-Lexikon nimmt jedes Wort jeder Serie auf (`lexicon.ts`, Befund IT-S Erwachsene §3) -, sie wird darum durch die
 * Wortbasis ersetzt (Wortschatz + Tatoeba-Formen + jede cs-Korpuszeile + jede andere cs-Serie + die begründete Liste der
 * Charge). Tschechisch hat auf diesem Rechner kein Wörterbuch (Falle 61).
 */
import { setLayout, layoutById, toLayoutText, type KeyboardLayout, type LayoutId } from "../../src/lib/typing/layouts";
import { introOrder } from "../../src/lib/typing/letters";
import { fitText, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR } from "../../src/lib/typing/corpus";
import { CORPUS_ES } from "../../src/lib/typing/corpusEs";
import { CORPUS_CS as CS_ROH } from "../../src/lib/typing/corpusCs";
import { SERIEN, allowedFromIntroduced } from "../../src/lib/typing/serien";
import { bausteinKey } from "../../src/lib/typing/ledger";
import { kombizeichenZu } from "../../src/lib/typing/totasten";
import { gesperrtCs, istKernGesperrtCs } from "../../src/lib/typing/sperrlisteCs";
import { WORDS_CS, STUFE_VOCAB_CS } from "../../src/lib/typing/wordsCs";
import { NACHTRAG_CS, NACHTRAG_CS_ERGAENZT } from "../../src/lib/typing/lexikonNachtragCs";
import { KRAJE_CS, ZEME_CS, type SerieEntwurfCs, type KrajCs, type ZemeCs } from "../../src/lib/typing/serienCsTyp";
import { zeilenFehler } from "./csTextRegeln";

export { zeilenFehler, gesperrtCs, istKernGesperrtCs, KRAJE_CS };

export const TASTATUREN: readonly LayoutId[] = ["cs", "cs-qwerty"];
export const zeilenVon = (s: { etappen: { lines: string[] }[] }): string[] => s.etappen.flatMap((e) => e.lines);
export const woerter = (z: string): string[] => z.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

// ── Form ────────────────────────────────────────────────────────────────────

export interface FormRegel {
  /** Erlaubte Zeichen der Zeile (ganzer Ausdruck). */
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
  if (/[.!?]"?\s+["(]*\p{Lu}/u.test(z)) p.push("mehr als ein Satz");
  if (/[,;:](?=[^\s\d"])/u.test(z)) p.push("kein Leerzeichen nach , ; :");
  if ((z.match(/"/g) ?? []).length % 2 !== 0) p.push("Anführungszeichen ungerade");
  if (z.split("(").length !== z.split(")").length) p.push("Klammern ungleich");
  if (/-/.test(z)) p.push("Bindestrich (vor seiner Sprosse fiele er weg und zerrisse das Wort oder den Einschub)");
  if (r.maxZeichen !== undefined && z.length > r.maxZeichen) p.push(`länger als ${r.maxZeichen} Zeichen`);
  const n = woerter(z).length;
  if (n < r.minWoerter || n > r.maxWoerter) p.push(`${n} Wörter`);
  return p;
}

/** Form der Serie: Stufe, Weg, Herkunft, Kraj und Land, Etappen-Zahl, Zeilen je Etappe, Fortsetzung endet auf ? oder !. */
export function serienFormFehler(
  s: SerieEntwurfCs,
  stufe: "kids" | "teens" | "erwachsen",
  minZeilen: number,
  maxZeilen: number,
): string[] {
  const f: string[] = [];
  if (!s.slug.startsWith(`cs-${stufe}-1-`)) f.push(`${s.slug}: Slug-Vorsilbe`);
  if (!/^[a-z0-9-]+$/.test(s.slug)) f.push(`${s.slug}: Slug mit Sonderzeichen`);
  if (JSON.stringify(s.stufen) !== JSON.stringify([stufe])) f.push(`${s.slug}: stufen`);
  if (s.kind !== "geschichte") f.push(`${s.slug}: kind`);
  if (s.lang !== "cs" || s.nurWeg !== "cs") f.push(`${s.slug}: lang/nurWeg`);
  if (s.herkunft.quelle !== "Sensorik" || s.herkunft.lizenz !== "Eigenes Werk") f.push(`${s.slug}: herkunft`);
  if (!(KRAJE_CS as readonly string[]).includes(s.land)) f.push(`${s.slug}: land ${s.land}`);
  else if (!ZEME_JE_KRAJ[s.land].includes(s.zeme)) f.push(`${s.slug}: zeme ${s.zeme} passt nicht zu ${s.land}`);
  if (!s.topic || !s.ort) f.push(`${s.slug}: topic/ort leer`);
  if (s.etappen.length < 2 || s.etappen.length > 3) f.push(`${s.slug}: ${s.etappen.length} Etappen`);
  s.etappen.forEach((e, i) => {
    if (e.lines.length < minZeilen || e.lines.length > maxZeilen) f.push(`${s.slug} E${i + 1}: ${e.lines.length} Zeilen`);
    if (i < s.etappen.length - 1 && !/[?!]"?$/.test(e.lines[e.lines.length - 1] ?? "")) f.push(`${s.slug} E${i + 1}: endet ohne ? oder !`);
  });
  if (woerter(s.titel).length > 6 || /[-\d"]/.test(s.titel) || s.titel.includes("Ů")) f.push(`${s.slug}: Titel`);
  for (const n of s.eigennamen) if (!kommtVor(n, zeilenVon(s).join("\n"))) f.push(`${s.slug}: Eigenname ${n} kommt nicht vor`);
  return f;
}
export const kommtVor = (n: string, text: string): boolean =>
  new RegExp(`(^|[^\\p{L}])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}]|$)`, "u").test(text);

// ── Zahlen und Daten (CS-T8/CS-T9) ──────────────────────────────────────────

/**
 * Zahlformat (Glossar §1 Nr. 5): Dezimalkomma („1,2"), kein Tausenderpunkt, Tausender mit EINEM normalen Leerzeichen
 * („2 400"; fünfstellig nie ohne), Uhrzeit „7:15" (Minuten zweistellig), Prozent nur als Adjektiv ohne Leerzeichen
 * („20% sleva" - in Übungszeilen nie U+00A0, das zeigt nur die Oberfläche), Kč/€ nach der Zahl mit Leerzeichen, keine Zeile
 * endet mit Ziffer und Punkt (die Stimme läse eine Ordnungszahl - Glossar §4 Falle 4).
 */
export function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d %/.test(t)) f.push("Leerzeichen vor % (nur das Adjektiv „20% sleva“)");
  if (/\d(Kč|€|\$)|(€|\$) ?\d/.test(t)) f.push("Währung nicht als „5 €“ / „40 Kč“");
  if (/\d\.\d/.test(t)) f.push("Dezimal- oder Tausenderpunkt");
  if (/\d\.$/.test(t)) f.push("Ziffer und Punkt am Zeilenende (Ordnungszahl)");
  if (/\d\. \p{Lu}\p{L}/u.test(t)) f.push("Ziffer und Punkt vor grossem Wort");
  for (const m of t.matchAll(/\d{5,}/g)) f.push(`Zahl ${m[0]} ohne Leerzeichen-Trenner`);
  for (const m of t.matchAll(/\b(\d{1,2}):(\d+)\b/g)) {
    if (/\b(v|ve|do|od|po|kolem|před)$/u.test(t.slice(0, m.index).trim())) {
      if (m[2].length !== 2 || Number(m[1]) > 23 || Number(m[2]) > 59) f.push(`Uhrzeit ${m[0]}`);
    }
  }
  return f;
}

/** v/ve und z/ze vor Zahlen nach dem GESPROCHENEN Zahlwort (Glossar Regel 13, wie CS-T8). */
export function praepositionFehler(t: string): string[] {
  const f: string[] = [];
  for (const m of t.matchAll(/(?<![\p{L}])(v|ve|V|Ve|z|ze|Z|Ze) (\d+)(?=[:.\s,%])/gu)) {
    const p = m[1].toLowerCase();
    const n = Number(m[2]);
    const veZahl = [2, 3, 4, 12, 13, 14].includes(n) || (n >= 20 && n <= 24);
    const zeZahl = [2, 3, 4, 6, 7, 12, 13, 14, 17, 100].includes(n) || (n >= 20 && n <= 29);
    if (p === "v" && veZahl) f.push(`„${m[0]}“ - gesprochen „ve …“`);
    if (p === "ve" && !veZahl) f.push(`„${m[0]}“ - gesprochen „v …“`);
    if (p === "z" && zeZahl) f.push(`„${m[0]}“ - gesprochen „ze …“`);
    if (p === "ze" && !zeZahl) f.push(`„${m[0]}“ - gesprochen „z …“`);
  }
  return f;
}

/** Personenbezogene Daten (CS-T9): E-Mail nur mit `.example`, keine Kontonummer, kein rodné číslo, keine Rufnummer, keine Webadresse. */
export function datenFehler(t: string): string[] {
  const f: string[] = [];
  for (const m of t.matchAll(/\S+@\S+/g)) if (!/@[\w.]+\.example[.,!?"]?$/.test(m[0])) f.push(`E-Mail ohne .example: ${m[0]}`);
  if (/\d{2,10}\/\d{4}(?!\d)/.test(t) && !/\b(19|20)\d\d\/(19|20)\d\d\b/.test(t)) f.push("Kontonummer?");
  if (/\b\d{6}\/\d{3,4}\b/.test(t)) f.push("rodné číslo?");
  if (/\b\d{3} \d{3} \d{3}\b/.test(t)) f.push("Rufnummer?");
  if (/(www\.|https?:)/i.test(t)) f.push("Webadresse");
  return f;
}

/** Orte im Ausland (Wortformen klein) - nur in einer Zeile mit einem davon darf € stehen (in Tschechien zahlt man Kč). */
export const AUSLAND: ReadonlySet<string> = new Set(
  (
    "vídeň vídni vídně rakousko rakousku rakouska slovensko slovensku slovenska bratislava bratislavě bratislavy " +
    "německo německu německa berlín berlíně drážďany drážďanech drážďan polsko polsku polska krakov krakově " +
    "chorvatsko chorvatsku chorvatska itálie itálii francie francii španělsko španělsku řecko řecku eurech euro eura"
  ).split(" "),
);
export const euroOhneAusland = (z: string): boolean =>
  z.includes("€") && !pruefWoerter(z).some((w) => AUSLAND.has(w) && !/^eur/.test(w));

// ── Geschlecht der tippenden Person, Feiertage, Politik, Religion, Staatssymbole, Etikett ──

const W_ENDE = "(?=[\\s,.?!:;\"')\\]]|$)";
/** „du" mit l-Partizip, hartem Adjektiv oder sám/sama/rád/ráda (wie CS-T9), dazu das Sie-Singular „byl jste". */
const GEGENDERTES_DU = new RegExp(
  `(^|[\\s"(])\\p{L}+(l|la) (jsi|jste)${W_ENDE}|(^|[\\s"(])(jsi|jste) (\\p{L}+(l|la|ý|á)|sám|sama|rád|ráda)${W_ENDE}|(^|[\\s"(])\\p{L}+(l|la) bys${W_ENDE}`,
  "iu",
);
/** „ich bin" mit l-Partizip, hartem Adjektiv oder rád/ráda; ebenso „bych" + l-Form (wie CS-T9). */
const GEGENDERTES_ICH = new RegExp(
  `(^|[\\s"(])\\p{L}+(l|la) (jsem|bych)${W_ENDE}|(^|[\\s"(])(jsem|bych) (\\p{L}+(l|la|ý|á)|sám|sama|rád|ráda)${W_ENDE}`,
  "iu",
);
/** Ein Hilfswort der 1./2. Person Einzahl IRGENDWO in der Zeile (der Klitik steht im Tschechischen an zweiter Stelle). */
const HILFSWORT_EINZAHL = /(^|[^\p{L}])(jsem|jsi|bych|bys|nejsem|nejsi)(?!\p{L})/iu;
/** rád/ráda, sám/sama - mit einem Hilfswort der 1./2. Person, mit „mám/máš" davor oder in wörtlicher Rede. */
const MIT_GESCHLECHT = /(^|[^\p{L}])(rád|ráda|sám|sama)(?!\p{L})/iu;
const MAM_RAD = /(^|[^\p{L}])(mám|máš|nemám|nemáš)( \p{L}+)? (rád|ráda)(?!\p{L})/iu;
/**
 * Wörter auf -l/-la, die KEIN l-Partizip sind (Hauptwörter) - nur sie dürfen neben „jsem/jsi/bych/bys" stehen. Namen der
 * Serie zählen ohnehin nicht. Wächst nur mit gelesenen Formen.
 */
export const KEIN_PARTIZIP: ReadonlySet<string> = new Set(
  "škola kola pila síla víla hala stůl cíl hotel učitel přítel anděl dál pedál sál ital motýl kozel orel uhel sokol pytel kotel fotbal festival kanál".split(" "),
);
/** Ein l-Partizip (Einzahl) neben einem Hilfswort der 1./2. Person - auch getrennt („Včera jsem tam byl."). */
function partizipMitHilfswort(zeile: string, namen: ReadonlySet<string>): boolean {
  if (!HILFSWORT_EINZAHL.test(zeile)) return false;
  const w = zeile.toLowerCase().match(/\p{L}+/gu) ?? [];
  return w.some((x) => x.length >= 3 && /(l|la)$/u.test(x) && !KEIN_PARTIZIP.has(x) && !namen.has(x));
}
/** Die eigene Ehe-Rolle legt das Geschlecht über das Gegenüber fest (CS-T6/T9): „můj manžel", „moje žena". */
const EIGENE_EHE = /(^|[^\p{L}])(můj|moje|mého|mému|mým|mou|mojí) (manžel\p{L}*|žen\p{L}*|muž\p{L}*)/iu;
/** Der Text in Anführungszeichen (wörtliche Rede - getippt wird sie trotzdem, PL-T9). */
const inAnfuehrung = (z: string): string => (z.match(/"[^"]*"/g) ?? []).join(" ");

/**
 * Legt die Zeile das Geschlecht der tippenden Person fest (Glossar §1 Regel 2)? Vergangenheit und Konditional der 1./2.
 * Person Einzahl, harte Adjektive und rád/ráda/sám/sama über die eigene Person - auch in wörtlicher Rede. Erzählt wird in
 * der 3. Person (dort verrät die Vergangenheit nur das Geschlecht der FIGUR) oder in der 1. Person Mehrzahl.
 */
export function geschlechtFehler(zeile: string, namen: ReadonlySet<string> = new Set()): boolean {
  if (GEGENDERTES_DU.test(zeile) || GEGENDERTES_ICH.test(zeile) || EIGENE_EHE.test(zeile) || MAM_RAD.test(zeile)) return true;
  if (HILFSWORT_EINZAHL.test(zeile) && MIT_GESCHLECHT.test(zeile)) return true;
  if (MIT_GESCHLECHT.test(inAnfuehrung(zeile))) return true;
  return partizipMitHilfswort(zeile, namen);
}

/**
 * Feiertage, ihre Bräuche, Speisen und Termine gehören EINER Charge, die Johannes erst freigeben muss (CS-T9, wörtlich
 * übernommen). Namenstage (svátek, jmeniny) ebenso.
 */
const FEIERTAG =
  /(vánoc|vánočn|velikonoc|velikonočn|silvest|nový rok|nového roku|svát|jmenin|mikuláš|pomlázk|kraslic|dušičk|masopust|čarodějnic|posvícen|(^|\s)hody(?=[\s,.!?]|$)|štědr|cukroví|betlém|koled|advent|den matek|valentýn|boží hod|velký pátek|velkého pátku|den vítězství|státnost|cyril|metoděj|jana husa|upálení|svat(ý|ého|ém|ému) václav|(?<!\d)(1\. ledna|1\. května|8\. května|5\. července|6\. července|28\. září|28\. října|17\. listopadu|2[4-6]\. prosince|31\. prosince|1\. máje))/iu;
export const feiertagIn = (z: string): boolean => FEIERTAG.test(z);

/** Politik (Auftrag): Parteien, Wahlen, Ämter des Staates. */
const POLITIK = /((^|[^\p{L}])(volb|voleb|volič)|politi|poslan|senát|senátor|sněmovn|parlament|prezident|premiér|ministr|(^|[^\p{L}])vlád[auyě](?!\p{L})|(^|[^\p{L}])vládn|komunis|komunist|okupac|invaz|revoluc|totalit|demonstrac)/iu;
/** Religion (Auftrag): Kirche, Gottesdienst, Gebet, Heilige, Klöster. */
const RELIGION = /(kostel|kaple|kapl[ie]|chrám|katedrál|bazilik|klášter|mnich|jeptiš|farář|kněz|kněž|modlit|modlí|mše(?!\p{L})|mši(?!\p{L})|(^|[^\p{L}])(bůh|boha|bohu|bohem|bohové|bohy|bohům)(?!\p{L})|(^|[^\p{L}])bož(e|í|ího|ská|ský|ské)(?!\p{L})|svat[ýáéíoéhm]|poutn|synagog|mešit|církev|církv|biskup|papež|bible|ježíš|andělíč|ráj(?!\p{L})(?<!český ráj))/iu;
/** Staatssymbole (Auftrag): Fahne, Hymne, Staatswappen, Kronjuwelen. */
const STAATSSYMBOL = /(vlajk|vlajek|prapor|hymn|státní znak|státního znaku|korunovační|kde domov můj)/iu;
export const politikIn = (z: string): boolean => POLITIK.test(z);
export const religionIn = (z: string): boolean => RELIGION.test(z.replace(/český ráj|českém ráji|českého ráje/giu, ""));
export const staatssymbolIn = (z: string): boolean => STAATSSYMBOL.test(z);

/**
 * Erblindung (und jede Behinderung) ohne Etikett, Person zuerst (Glossar §1 Regel 3): die Figur TUT etwas (čte Braillovo
 * písmo, chodí s bílou holí, poslouchá hlasový výstup, jezdí na vozíku) - nie „slepý/slepec", „nevidomý" (ausser im Namen
 * SONS), „postižený" als Eigenschaft, „invalida", „mrzák", „hluchý"; kein „naslepo" (Regel 4), kein Mitleid („chudák").
 */
const ETIKETT = /((^|[^\p{L}])slep(?!ic|ičk)|nevidom|postižen(ý|á|é|í|ého|ému|ých|ým)(?!\p{L})|invalid|mrzák|kripl|(^|[^\p{L}])hluch(?!olaz)|naslepo|chudák|chudink|ubožá)/iu;
export const etikettIn = (z: string): boolean => ETIKETT.test(z);

// ── Tastaturen, Sprossen (Weg cs, Tastaturen cs und cs-qwerty) ──────────────

/** Wie `hatGriff` in den IT-Serien-Wächtern (Taste · Umschalt/AltGr · Totaste), mit `grossFehlt` (Ů). */
export function hatGriff(layout: KeyboardLayout, zeichen: string): boolean {
  if (zeichen === " ") return true;
  const klein = zeichen.toLowerCase();
  if (zeichen !== klein && (layout.grossFehlt ?? []).includes(zeichen)) return false;
  if (layout.rows.some((r) => r.keys.includes(klein))) return true;
  if (layout.access[klein] !== undefined) return true;
  return kombizeichenZu(zeichen, layout) !== undefined;
}
export const griffFehler = (zeilen: string[], id: LayoutId): string[] => {
  const l = layoutById(id);
  return [...new Set(zeilen.join(""))].filter((c) => !hatGriff(l, c));
};

const ordnungCache = new Map<LayoutId, string[]>();
export function ordnung(l: LayoutId = "cs"): string[] {
  let o = ordnungCache.get(l);
  if (!o) {
    setLayout(l);
    o = introOrder("cs");
    ordnungCache.set(l, o);
  }
  setLayout(l);
  return o;
}
const allowedCache = new Map<string, Set<string>>();
export function allowedAt(n: number, l: LayoutId = "cs"): Set<string> {
  const k = `${l}|${n}`;
  let s = allowedCache.get(k);
  if (!s) {
    s = allowedFromIntroduced(ordnung(l).slice(0, n), "cs");
    allowedCache.set(k, s);
  }
  setLayout(l);
  return s;
}
export const sprosseVon = (einheit: string, l: LayoutId = "cs"): number => ordnung(l).indexOf(einheit) + 1;
const norm = (t: string) => t.replace(/\s+/g, " ").trim();
const ersteCache = new Map<string, number | null>();
/** Kleinste Sprosse, ab der die Zeile überhaupt (gekürzt) serviert wird. */
export function ersteSprosse(t: string, l: LayoutId = "cs"): number | null {
  const k = `${l}|${t}`;
  if (ersteCache.has(k)) return ersteCache.get(k)!;
  let erg: number | null = null;
  const n0 = ordnung(l).length;
  for (let n = 1; n <= n0; n++) if (fitText(t, allowedAt(n, l), "cs") !== null) { erg = n; break; }
  ersteCache.set(k, erg);
  return erg;
}
const volleCache = new Map<string, number | null>();
/** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
export function volleSprosse(t: string, l: LayoutId = "cs"): number | null {
  const k = `${l}|${t}`;
  if (volleCache.has(k)) return volleCache.get(k)!;
  let erg: number | null = null;
  const n0 = ordnung(l).length;
  for (let n = 1; n <= n0; n++) if (fitText(t, allowedAt(n, l), "cs") === norm(t)) { erg = n; break; }
  volleCache.set(k, erg);
  return erg;
}
/** Kleinste Sprosse, ab der JEDE Zeile der Serie serviert wird (null = eine Zeile nie). */
export function oeffnet(s: { etappen: { lines: string[] }[] }, l: LayoutId = "cs"): number | null {
  let max = 0;
  for (const z of zeilenVon(s)) {
    const b = ersteSprosse(z, l);
    if (b === null) return null;
    max = Math.max(max, b);
  }
  return max;
}
/** Die Einheit, an der die Serie öffnet („ˇ", „g" …). */
export const oeffnetEinheit = (s: { etappen: { lines: string[] }[] }, l: LayoutId = "cs"): string | null => {
  const n = oeffnet(s, l);
  return n === null ? null : ordnung(l)[n - 1];
};
/** Die Wortfolge einer Fassung (nur Buchstaben und Ziffern, klein) - eine servierte Fassung darf KEIN Wort verlieren. */
export const wortfolge = (t: string): string => (t.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).join(" ");
/** Sprossen, an denen `fitText` die Zeile in ANDEREN Wörtern serviert als die volle Zeile (gekürzt darf nur Satzzeichen verlieren). */
export function wortVerlust(zeile: string, l: LayoutId = "cs"): number[] {
  const b = ersteSprosse(zeile, l);
  const v = volleSprosse(zeile, l);
  if (b === null || v === null) return [];
  const voll = wortfolge(toLayoutText(zeile));
  const out: number[] = [];
  for (let n = b; n < v; n++) {
    const f = fitText(zeile, allowedAt(n, l), "cs");
    if (f !== null && wortfolge(f) !== voll) out.push(n);
  }
  return out;
}

// ── Grosswörter, auch nach dem Kürzen ───────────────────────────────────────

const TECHNISCH = /[@_/#=<>|*+&$%€\\^\d[\]{}]/;
/** Wörter einer Zeile mit Merker „Satzanfang" (Zeilenanfang, nach . ? !, Anfang einer Anführung); technische fallen weg. */
export function woerterMitAnfang(zeile: string): { w: string; anfang: boolean }[] {
  const out: { w: string; anfang: boolean }[] = [];
  let naechsterAnfang = true;
  for (const roh of zeile.split(/\s+/)) {
    const kern = roh.replace(/^["('[]+|[.,!?:;")'\]]+$/g, "");
    if (kern && !TECHNISCH.test(kern)) {
      for (const [i, teil] of kern.split("-").entries()) {
        const w = teil.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
        if (w) out.push({ w, anfang: i === 0 && (naechsterAnfang || roh.startsWith('"')) });
      }
    }
    naechsterAnfang = /[.!?]"?\)?$/.test(roh);
  }
  return out;
}
/** Die Eigennamen einer Serie als Wortmenge (klein; mehrteilige Namen in ihre Wörter zerlegt). */
export const namenVon = (s: { eigennamen: string[] }): Set<string> =>
  new Set(s.eigennamen.flatMap((n) => n.toLowerCase().split(/\s+/)));
/** Grossgeschriebene Wörter, die weder am Satzanfang stehen noch ein Eigenname der Serie sind. */
/** Abkürzungen, die mitten im Satz gross stehen und kein Name sind (Glossar: „2 400 Kč"). */
const ABKUERZUNGEN: ReadonlySet<string> = new Set(["Kč"]);
export function fremdeGrosswoerter(zeile: string, namen: ReadonlySet<string>): string[] {
  return woerterMitAnfang(zeile)
    .filter((x) => !x.anfang && /^\p{Lu}/u.test(x.w) && !namen.has(x.w.toLowerCase()) && !ABKUERZUNGEN.has(x.w))
    .map((x) => x.w);
}
/**
 * Weg „cs" lässt ungelernte `! " : ; ( )` weg und hat keine Frühfassungen (CS-T7/T8): eine Zeile kommt vor deren Sprosse
 * GEKÜRZT. Fällt dabei eine Satzgrenze weg (`volá: "Pojď!"` ⇒ `volá Pojď`), stünde ein Grosswort mitten im Satz (Naht-Regel
 * nach `? ! :`). Darum steht wörtliche Rede VORN (`"Pojď!" volá Ema.`) oder beginnt mit einem Namen.
 */
export function gekuerztFehler(zeile: string, namen: ReadonlySet<string>, l: LayoutId = "cs"): string[] {
  const b = ersteSprosse(zeile, l);
  const v = volleSprosse(zeile, l);
  if (b === null || v === null) return [];
  const out = new Set<string>();
  for (let n = b; n < v; n++) {
    const s = fitText(zeile, allowedAt(n, l), "cs");
    if (s !== null) for (const w of fremdeGrosswoerter(s, namen)) out.add(`${n}:${w}`);
  }
  return [...out];
}

// ── Wortschatz ──────────────────────────────────────────────────────────────

/**
 * Funktionswörter zählen nicht zur 8-Zeilen-Grenze: die Liste von CS-T5/T8 und - wie bei den italienischen Serien
 * essere/avere/stare - alle Formen von být und mít, dazu Pronomen in allen Fällen, Fragewörter, Konjunktionen, Präpositionen
 * und Partikeln. Alles andere zählt, als WORTFORM (jde und šla getrennt), klein geschrieben.
 */
export const FUNKTIONSWOERTER: ReadonlySet<string> = new Set(
  (
    "a i ani ale nebo anebo s se si k ke v ve na do od o u z ze po pro za nad pod před přes při mezi bez kolem podle " +
    "kvůli místo vedle blízko naproti " +
    "je jsou jsem jsme jsi jste byl byla bylo byli byly být bude budou budu budeš budeme budete bych bys by bychom byste " +
    "není nejsou nejsem nejsi nebyl nebyla nebylo nebyli nebude " +
    "má mají mám máš máme máte měl měla mělo měli měly mít nemá nemají nemám nemáš nemáme " +
    "to ten ta ty tu tam sem tak jak kde kam jen ne ano jo mi mě mně tě ti ho mu mu jí ji je jim jich jimi nám nás vám vás " +
    "já my vy on ona ono oni ony něj něho němu ním ní nich nimi jeho její jejich " +
    "můj moje moji mého mé mou mým mými tvůj tvoje tvoji tvého tvé náš naše našeho naši našich našim vaše váš " +
    "svůj svoje svoji svého své svou svým svými svých svému " +
    "tento tato toto tyto toho tomu tom tím tou těch těm těmi ten tě " +
    "který která které kteří kterého kterou kterým kterých kde kdo co kdy proč jaký jaká jaké kolik čí čím čeho čemu koho komu kým " +
    "že když protože aby ať než až jestli zda tedy však jenže proto potom pak už ještě také taky též jenom asi snad prý " +
    "dnes teď tady zde všechno všichni všechny celý celá celé každý každá každé nic nikdo něco někdo nikdy vždycky vždy " +
    "moc hodně velmi docela trochu skoro zase opět spolu sám sama jako tohle tahle tenhle tuhle tyhle " +
    // Anrede vor einem Namen (pan Hrubý, paní Hedvika) trägt wie ein Artikel keine Bedeutung der Zeile.
    "pan paní pana panu panem pane"
  ).split(" "),
);
export const inhaltswoerter = (z: string): Set<string> =>
  new Set(woerterMitAnfang(z).map((x) => x.w.toLowerCase()).filter((w) => !FUNKTIONSWOERTER.has(w)));
/** Inhaltswörter in mehr als `grenze` Zeilen (Eigennamen ausgenommen). */
export function zuHaeufig(zeilen: string[], namen: ReadonlySet<string>, grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltswoerter(z)) if (!namen.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Die Wörter einer Zeile für Sperrliste und Wortbasis (klein; technische fallen weg). */
export const pruefWoerter = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w.toLowerCase());

/** Der kuratierte Wortschatz (von Hand gelesen): Übungswörter und Stufen-Wortschatz. */
export const KURATIERT: ReadonlySet<string> = new Set([...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat()].map((w) => w.toLowerCase()));
/** Wortschatz + Tatoeba-Formen (je mindestens zwei Belege), ohne Korpus. */
export const WORTSCHATZ: ReadonlySet<string> = new Set(
  [...KURATIERT, ...NACHTRAG_CS, ...NACHTRAG_CS_ERGAENZT].map((w) => w.toLowerCase()),
);
/** Die geprüfte Wortbasis VOR den Serien: Wortschatz + jede cs-Korpuszeile (ROH, T1 bis heute) - jede von ihrem Wächter belegt. */
export const BASIS: ReadonlySet<string> = new Set([...WORTSCHATZ, ...CS_ROH.flatMap((i) => pruefWoerter(i.text))]);
/**
 * Wörter (ab zwei Buchstaben), die weder in der Basis noch unter den Namen ihrer Serie noch in `belegt` stehen. Die Serien
 * belegen einander NICHT gegenseitig (ein Wort, das nur zwei Serien tragen, wäre sonst von niemandem belegt) - alle drei
 * Chargen prüfen gegen dieselbe Liste `BELEGE_CS_SERIEN` (`csSerienBelege.ts`).
 */
export function ungeprueft(zeilen: string[], belegt: Readonly<Record<string, string>>, namen: ReadonlySet<string>): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of pruefWoerter(z)) {
      if (w.length >= 2 && !BASIS.has(w) && !(w in belegt) && !namen.has(w)) out.add(w);
    }
  }
  return [...out];
}
/** Einträge der begründeten Liste, die nicht (mehr) gebraucht werden oder im kuratierten Wortschatz/Tatoeba-Formen stehen. */
export const ueberfluessig = (zeilen: string[], belegt: Readonly<Record<string, string>>): string[] => {
  const benutzt = new Set(zeilen.flatMap(pruefWoerter));
  return Object.keys(belegt).filter((w) => !benutzt.has(w) || WORTSCHATZ.has(w));
};

const AKZENT_VARIANTEN: Readonly<Record<string, readonly string[]>> = {
  a: ["á"], e: ["é", "ě"], i: ["í"], o: ["ó"], u: ["ú", "ů"], y: ["ý"], c: ["č"], s: ["š"], r: ["ř"], z: ["ž"],
  d: ["ď"], t: ["ť"], n: ["ň"],
};
/** Die Diakritik-Falle (CS-T1/T8): ein Wort ausserhalb des kuratierten Wortschatzes, dessen Form MIT Haken oder Strich dort steht. */
export function diakritikVerdacht(zeilen: string[], namen: ReadonlySet<string> = new Set()): string[] {
  const out: string[] = [];
  for (const w of new Set(zeilen.flatMap(pruefWoerter))) {
    if (KURATIERT.has(w) || namen.has(w)) continue;
    let formen = [""];
    for (const ch of w) formen = formen.flatMap((f) => [ch, ...(AKZENT_VARIANTEN[ch] ?? [])].map((x) => f + x));
    const treffer = formen.filter((v) => v !== w && KURATIERT.has(v));
    if (treffer.length > 0) out.push(`${w} (gemeint ${treffer.join("/")}?)`);
  }
  return out;
}

// ── Kopien, Paare, fast gleich ──────────────────────────────────────────────

export const ohneSatzzeichen = (t: string): string => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
/** Geschlecht und Zahl gleichgesetzt (wie CS-T8): on/ona, Endung weg. */
export function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", ony: "PRO" };
  return ohneSatzzeichen(zeile)
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/(ou|em|ům|ech|[aeiouyáéíýěů])$/u, ""))
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

/** Jede cs-Korpuszeile (die ROHE Sammelliste) und jede cs-Serie, die nicht zu `eigeneSlugs` gehört. */
export function andereCsZeilen(eigeneSlugs: ReadonlySet<string>): string[] {
  return [...CS_ROH.map((i) => i.text), ...SERIEN.filter((s) => s.lang === "cs" && !eigeneSlugs.has(s.slug)).flatMap(zeilenVon)];
}
/** Alles andere, was Text trägt: alle anderen Korpora, alle anderen Serien, alle Banken - Zeile für Zeile und Satz für Satz. */
export function alleFremdenZeilen(eigeneSlugs: ReadonlySet<string>): string[] {
  const roh = [
    ...[...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR].map((i) => i.text),
    ...andereCsZeilen(eigeneSlugs),
    ...SERIEN.filter((s) => s.lang !== "cs").flatMap(zeilenVon),
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
 * „Fast gleich" (Falle 31/51): Paare mit Jaccard ≥ grenze. Über 170 000 Vergleichszeilen nicht jede gegen jede: Ist
 * J(A, B) ≥ g, enthält B mindestens eines der (|A| - ⌈g·|A|⌉ + 1) SELTENSTEN Wörter von A (Präfix-Filter, wie PL-S; die
 * Gegenprobe vergleicht mit dem vollen Vergleich).
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

// ── Regionen: Böhmen, Mähren, Schlesien ─────────────────────────────────────

/** Welche historischen Länder ein Kraj berührt (Vysočina und Jihočeský reichen nach Mähren, Olomoucký und Moravskoslezský nach Schlesien). */
export const ZEME_JE_KRAJ: Readonly<Record<KrajCs, readonly ZemeCs[]>> = {
  Praha: ["Čechy"], Středočeský: ["Čechy"], Jihočeský: ["Čechy", "Morava"], Plzeňský: ["Čechy"], Karlovarský: ["Čechy"],
  Ústecký: ["Čechy"], Liberecký: ["Čechy"], Královéhradecký: ["Čechy"], Pardubický: ["Čechy", "Morava"],
  Vysočina: ["Čechy", "Morava"], Jihomoravský: ["Morava"], Olomoucký: ["Morava", "Slezsko"], Zlínský: ["Morava"],
  Moravskoslezský: ["Morava", "Slezsko"],
};

/**
 * Tschechien in seiner Breite: jeder der 14 Kraje mindestens einmal, keiner mehr als zweimal, Prag höchstens einmal (die
 * Hauptstadt nicht vorne, wie „der Norden nicht vorne" bei Italienisch), Mähren und Schlesien zusammen mindestens 7 von 20,
 * Schlesien mindestens einmal.
 */
export function verteilungFehler(serien: readonly { land: string; zeme: string }[]): string[] {
  const p: string[] = [];
  const je = new Map<string, number>(KRAJE_CS.map((k) => [k, 0]));
  for (const s of serien) je.set(s.land, (je.get(s.land) ?? 0) + 1);
  for (const [k, n] of je) {
    if (!(KRAJE_CS as readonly string[]).includes(k)) p.push(`unbekannter Kraj ${k}`);
    else if (n < 1) p.push(`${k} fehlt`);
    if (n > 2) p.push(`${k}: ${n} Serien`);
  }
  if ((je.get("Praha") ?? 0) > 1) p.push("Praha mehr als einmal");
  const zeme = (z: string) => serien.filter((s) => s.zeme === z).length;
  if (zeme("Morava") + zeme("Slezsko") < 7) p.push(`Mähren + Schlesien nur ${zeme("Morava") + zeme("Slezsko")}`);
  if (zeme("Slezsko") < 1) p.push("Schlesien fehlt");
  for (const s of serien) if (!(ZEME_CS as readonly string[]).includes(s.zeme)) p.push(`unbekanntes Land ${s.zeme}`);
  return p;
}
