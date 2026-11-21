/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ DIE TEXTSTUFE EINER KLASSE - aus der Schulstufe, und sie wächst mit
 * ════════════════════════════════════════════════════════════════════════════
 * (Umbau 11.09.2026, B9/§2.2)
 *
 * Johannes: *„Jede Klasse hat also nur eine Textstufe."* Und: Die Lehrkraft
 * trägt die SCHULSTUFE ein, nicht die Textstufe - „7. Schulstufe" weiss sie
 * ohne nachzudenken, „11-15 Jahre" ist schon eine Übersetzung.
 *
 * ── Die Rechnung ───────────────────────────────────────────────────────────
 *     Alter ≈ Schulstufe + 6            (1. Schulstufe = 6 bis 7 Jahre)
 *     jetzige Schulstufe = eingetragene + (jetziges Schuljahr − Eintragsjahr)
 *
 * Schulstufe 7, eingetragen 2026/27 ⇒ 13 Jahre ⇒ „11-15 Jahre" (Johannes'
 * eigenes Beispiel). Im Schuljahr 2027/28 rechnet dieselbe Klasse 8. Stufe,
 * 14 Jahre - **ohne dass jemand etwas umstellt**. Genau das war der Auftrag:
 * *„und wächst mit"*.
 *
 * ⚠️ DIE GRENZEN 11 UND 16 STEHEN HIER NICHT. Sie stehen in
 * `account.stufeAusAlter` - derselben Regel, die auch das Geburtsjahr eines
 * selbstlernenden Kontos übersetzt. Zwei Fassungen wären zwei Stellen, die
 * voneinander nichts wissen
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ⚠️ NICHTS WIRD IN DAS KIND KOPIERT. Die Stufe wird beim Laden gerechnet
 * (`useTypingAuth`), nicht in jedes Konto geschrieben: Sonst hätte ein Kind,
 * das im Mai der Klasse beitritt, den Stand vom September, und die Klasse
 * hätte zwei Wahrheiten. Dasselbe gilt seit 11.09.2026 (Nacht) für das
 * Startniveau der Klasse ({@link startpunktMitKlasse}).
 */
import {
  VORGABE_STUFE,
  stufeAusAlter,
  type KlassenAnlage,
  type Stufe,
  type TypingClass,
} from "./account";
import { schuljahrVon } from "./jahreskarte";
import { SCHULJAHR_BEGINN_VORGABE, schuljahrBeginnVon } from "./schuljahrBeginn";
import { lernwegVon } from "./lernweg";
import type { BedienSprache } from "@/lib/bedienSprache";

/** Kleinste und grösste Schulstufe, die eingetragen werden kann. */
export const SCHULSTUFE_MIN = 1;
export const SCHULSTUFE_MAX = 13;

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ DIE SCHULSTUFE „ERWACHSEN" (11.09.2026, Nacht)
 * ════════════════════════════════════════════════════════════════════════════
 * Johannes, wörtlich: *„… aber auch die schulstufe soll der server für alle
 * kinder vorab dort speichern (und es soll eine Schulstufe "Erwachsen"
 * geben)"*.
 *
 * Gespeichert im VORHANDENEN Zahlenfeld `tt_classes.schulstufe` als 100 - kein
 * neues Feld. Warum so und nicht anders:
 *  • EIN Feld, EINE Wahrheit. Ein zusätzliches Häkchen „erwachsen" neben der
 *    Zahl erlaubte „7. Schulstufe UND erwachsen" zugleich - einen Zustand, den
 *    niemand meint und den jede lesende Stelle auflösen müsste.
 *  • 100 liegt weit AUSSERHALB von 1-13. Jede Stelle, die nur den Bereich
 *    kennt (ein älteres Bündel, `mapClass` vor diesem Tag), liest den Wert als
 *    „nicht gesetzt" - also die Vorgabe „11-15 Jahre", nie eine falsche
 *    Klassenstufe. Eine 14 dagegen läse sich als „14. Schulstufe", und der
 *    Deckel bei 13 machte daraus still eine 13.
 *  • Keine Schema-Änderung dafür. Kein Hook liest `tt_classes.schulstufe`
 *    (gesucht 11.09.2026 in `pocketbase/` - die übrigen `schulstufe`-Felder
 *    gehören dem Mathecoach und sind andere Sammlungen).
 *
 * ⚠️ „Erwachsen" WÄCHST NICHT MIT - es gibt nach „erwachsen" nichts mehr. Und
 * eine Zahl wird nie zu „Erwachsen": Der Deckel liegt bei 13
 * ({@link aktuelleSchulstufe}); die Textstufe einer 13. Schulstufe ist ohnehin
 * schon „erwachsen" (Alter 19).
 */
export const SCHULSTUFE_ERWACHSEN = 100;

/**
 * Die Wahl im Auswahlfeld „Schulstufe" - EINE Liste für beide Stellen (Anlegen
 * einer Klasse und „Einstellungen der Klasse"), damit dort nie zwei
 * verschiedene Wertebereiche stehen.
 */
export const SCHULSTUFEN_WAHL: readonly { wert: number; label: string }[] = [
  ...Array.from({ length: SCHULSTUFE_MAX - SCHULSTUFE_MIN + 1 }, (_, i) => ({
    wert: SCHULSTUFE_MIN + i,
    label: `${SCHULSTUFE_MIN + i}. Schulstufe`,
  })),
  { wert: SCHULSTUFE_ERWACHSEN, label: "Erwachsen" },
];

/**
 * ★ O2-LIB (30.10.2026, Glossar §2.6 „Schulstufe", §4 Falle 3): in der bulgarischen Bedienung
 * Wert „3. клас" (Ziffer mit Punkt), Feld „Клас в училище" - „Erwachsen" ⇒ „Възрастни".
 * Die Zählung deckt sich mit Österreich (Schulbeginn mit 7).
 */
export function schulstufeLabelBg(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Възрастни";
  return `${stufe}. клас`;
}

/**
 * ★ O-EL-LIB (30.10.2026, Glossar §2.6 «Schulstufe», §4 Falle 1): in der griechischen Bedienung die
 * TÁXI mit Schulart - nie «τμήμα» (das ist in Tastenflow die Klasse mit Code): Stufe 1-6 = «Α΄-ΣΤ΄
 * Δημοτικού», 7-9 = «Α΄-Γ΄ Γυμνασίου», 10-12 = «Α΄-Γ΄ Λυκείου» (Zählung wie in Österreich, Alter =
 * Stufe + 6); Stufe 13 gibt es in Griechenland nicht; «Erwachsen» ⇒ «Ενήλικες». Die Keraia ist U+0384
 * (wie im Glossar), als Escape geschrieben.
 */
export function schulstufeLabelEl(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Ενήλικες";
  const buchstaben = ["Α", "Β", "Γ", "Δ", "Ε", "ΣΤ"];
  if (stufe <= 6) return `${buchstaben[stufe - 1]}\u0384 Δημοτικού`;
  if (stufe <= 9) return `${buchstaben[stufe - 7]}\u0384 Γυμνασίου`;
  if (stufe <= 12) return `${buchstaben[stufe - 10]}\u0384 Λυκείου`;
  return `${stufe}η τάξη (μετά το Λύκειο)`;
}

/**
 * ★ O2-LIB (30.10.2026, Glossar §2.6 „Schulstufe", §4 Falle 2): in der ungarischen Bedienung
 * der ÉVFOLYAM - nie „osztály" (das ist in Tastenflow die Klasse mit Code). Ordnungszahl =
 * Ziffer mit Punkt (Regel 5); „Erwachsen" ⇒ „Felnőttek".
 */
export function schulstufeLabelHu(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Felnőttek";
  return `${stufe}. évfolyam`;
}

/**
 * ★ O2-LIB (29.10.2026): eine Schulstufe in der niederländischen Bedienung - als ALTER, nicht als Nummer
 * (die Zählung der Niederlande und Flanderns liegt verschieden; Glossar nl §2.6, §2.13). Alter = Schulstufe + 6;
 * "Erwachsen" ⇒ "Volwassenen". Gespeichert bleibt die Schulstufe - nur die Anzeige ist das Alter.
 */
export function schulstufeLabelNl(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Volwassenen";
  const alter = stufe + ALTER_IN_ERSTER_SCHULSTUFE - 1;
  return `Leeftijd ${alter - 1}-${alter}`;
}

/**
 * ★ O-LIB (30.10.2026, Glossar §2.6 "Schulstufe"): na interface portuguesa (Portugal) o "ano de
 * escolaridade" - a contagem coincide com a Áustria (1.º-12.º ano, a 13.ª etapa austríaca fica com o
 * mesmo formato); "Erwachsen" ⇒ "Pessoas adultas". Ordinal escrito "3.º ano" (Glossar Regel 7).
 */
export function schulstufeLabelPt(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Pessoas adultas";
  return `${stufe}.º ano`;
}

/**
 * ★ O2-LIB (29.10.2026, Glossar §2.6 "Schulstufe"): in der brasilianischen Bedienung der ANO ESCOLAR
 * mit Schulart - nie "série" (alte Zählung) und nie "classe": Schulstufe 1-9 = "1º-9º ano do ensino
 * fundamental", 10-12 = "1º-3º ano do ensino médio" (drei Jahre); "Erwachsen" ⇒ "Pessoas adultas".
 * Die Zählung deckt sich mit Österreich (Alter = Stufe + 5 am Jahresbeginn). Die 13. Schulstufe
 * hat in Brasilien keine Entsprechung - dort steht "Após o ensino médio". "º" = U+00BA, ohne Punkt.
 */
export function schulstufeLabelBr(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Pessoas adultas";
  if (stufe <= 9) return `${stufe}º ano do ensino fundamental`;
  if (stufe <= 12) return `${stufe - 9}º ano do ensino médio`;
  return "Após o ensino médio";
}

/**
 * ★ O2-LIB (29.10.2026, Glossar §2.5 „Schulstufe“, §4 Falle 4): in der rumänischen Bedienung
 * die Klasse als „clasa a III-a“ mit römischer Zahl; die österreichische Schulstufe 1 (Alter 6-7)
 * ist die „clasa pregătitoare“, Stufe n (n ≥ 2) ist „clasa a (n-1)-a“ (Stufe 2 = clasa I);
 * „Erwachsen“ ⇒ „Adulți“. Das Feld selbst heisst „Anul de studiu“ (nie „Clasa“ - das ist die Klasse mit Code).
 */
export function schulstufeLabelRo(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Adulți";
  if (stufe <= 1) return "clasa pregătitoare";
  const k = stufe - 1;
  if (k === 1) return "clasa I";
  const roemisch = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return `clasa a ${k < roemisch.length ? roemisch[k] : String(k)}-a`;
}

/**
 * ★ O2-LIB (30.10.2026, Glossar sv §2.6 "Schulstufe", §4 Falle 3): in der schwedischen Bedienung die
 * schwedische ÅRSKURS - nie "klass" (das ist in Tastenflow die Klasse mit Code). Die Zählung deckt sich mit
 * Österreich (Alter = Stufe + 6), verschoben um eins: Schulstufe 1 = förskoleklass, 2-10 = årskurs 1-9,
 * 11-13 = gymnasiet år 1-3 (Kinder von 8 bis 11 Jahren = årskurs 2-5). "Erwachsen" ⇒ "Vuxna".
 */
export function schulstufeLabelSv(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Vuxna";
  if (stufe <= 1) return "Förskoleklass";
  if (stufe <= 10) return `årskurs ${stufe - 1}`;
  return `gymnasiet år ${stufe - 10}`;
}

/**
 * ★ O2-LIB (30.10.2026, Glossar §2.6 „Schulstufe", §4 Falle 3): in der ukrainischen Bedienung die Schulstufe als
 * „клас" mit Zahl („3 клас", „7 клас") - die Zählung deckt sich mit Österreich (Alter = Stufe + 6, Schulbeginn mit
 * sechs); „Erwachsen" ⇒ „Дорослі". Die Zahl ist eine Kardinalzahl ohne Punkt (Regel 5). Die Tastenflow-Klasse
 * heisst immer mit Name oder Code.
 */
export function schulstufeLabelUk(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Дорослі";
  return `${stufe} клас`;
}

/** „7. Schulstufe" · „Erwachsen" · „Schulstufe nicht gesetzt". */
export function schulstufeText(
  stufe: number | null,
  /** ★ EN6a (19.09.2026): ohne Angabe Deutsch, genau wie vorher. */
  sprache: BedienSprache = "de",
): string {
  // ★ O-CS (03.10.2026): der tschechische ročník (Glossar §2.6, §4 Falle 3: nie „třída").
  // ★ O2-LIB (30.10.2026): die neun Sprachen des Gerüsts mit eigenem Zweig - nie Englisch, nie Deutsch.
  if (sprache === "bg") return stufe === null ? "Класът в училище не е зададен" : schulstufeLabelBg(stufe);
  if (sprache === "el") return stufe === null ? "Δεν έχει οριστεί τάξη" : schulstufeLabelEl(stufe);
  if (sprache === "hu") return stufe === null ? "Az évfolyam nincs beállítva" : schulstufeLabelHu(stufe);
  // ★ O2-LIB (29.10.2026): das niederländische leerjaar - als LEEFTIJD, nicht als Nummer: NL zählt "groep 6", Flandern "4e leerjaar" (Glossar nl §2.6/§2.13).
  if (sprache === "nl") return stufe === null ? "Leerjaar niet ingesteld" : schulstufeLabelNl(stufe);
  // ★ O-LIB (30.10.2026): o ano de escolaridade português (Glossar §2.5/§2.6, §4 Nr. 3: nunca "classe" nem "série").
  if (sprache === "pt") return stufe === null ? "Ano de escolaridade não definido" : schulstufeLabelPt(stufe);
  if (sprache === "br") return stufe === null ? "Ano escolar não definido" : schulstufeLabelBr(stufe);
  if (sprache === "ro") return stufe === null ? "Anul de studiu nu este setat" : schulstufeLabelRo(stufe);
  // ★ O2-LIB (30.10.2026): die schwedische årskurs (Glossar sv §2.6, §4 Falle 3: nie "klass" für die Schulstufe).
  if (sprache === "sv") return stufe === null ? "Årskurs inte inställd" : schulstufeLabelSv(stufe);
  // ★ O2-LIB (30.10.2026): die ukrainische Schulstufe als „клас" mit Zahl (Glossar §2.6, §4 Falle 3: die Tastenflow-Klasse ist die mit Name/Code).
  if (sprache === "uk") return stufe === null ? "Рік навчання не вказано" : schulstufeLabelUk(stufe);
  if (sprache === "cs") return stufe === null ? "Ročník není nastavený" : schulstufeLabelCs(stufe);
  // ★ O-TR (02.10.2026): der türkische sınıf düzeyi (Glossar §2.6).
  if (sprache === "tr") return stufe === null ? "Sınıf düzeyi belirlenmedi" : schulstufeLabelTr(stufe);
  if (sprache === "it") return stufe === null ? "Classe non impostata" : schulstufeLabelIt(stufe);
  // ★ O-PL (02.10.2026): die polnische Klasse (Glossar §2.6).
  if (sprache === "pl") return stufe === null ? "Klasa nie jest ustawiona" : schulstufeLabelPl(stufe);
  if (sprache === "fr") return stufe === null ? "Niveau non défini" : schulstufeLabelFr(stufe);
  // ★ ES-O: „es" fiel hier still auf „7. Schulstufe" (Falle 30).
  if (sprache === "es") return stufe === null ? "Curso sin fijar" : schulstufeLabelEs(stufe);
  if (sprache === "en") return stufe === null ? "Year group not set" : schulstufeLabelEn(stufe);
  if (stufe === null) return "Schulstufe nicht gesetzt";
  return SCHULSTUFEN_WAHL.find((s) => s.wert === stufe)?.label ?? `${stufe}. Schulstufe`;
}

/**
 * ★ EN6a (19.09.2026): eine Schulstufe in der englischen Bedienung - als ALTER,
 * nicht als Nummer (Glossar §3.4, §3.15, §5 Nr 1): Die britische Zählung liegt
 * eine Stufe höher, „Year 7" hiesse dort etwas anderes. Alter = Schulstufe + 6
 * ({@link ALTER_IN_ERSTER_SCHULSTUFE} ist das Alter AM ENDE der ersten), die 7.
 * Schulstufe ist also *Age 12-13*, die 3. *Age 8-9*. „Erwachsen" ⇒ *Adults*.
 * Gespeichert bleibt die Schulstufe - nur die Anzeige ist das Alter.
 */
export function schulstufeLabelEn(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Adults";
  const alter = stufe + ALTER_IN_ERSTER_SCHULSTUFE - 1;
  return `Age ${alter - 1}-${alter}`;
}

/**
 * ★ E11a-3 (26.09.2026, Bauplan §9.2 Glossar „Schulstufe"): dieselbe Anzeige
 * als ALTER statt als Stufenname - in Frankreich, Belgien, der Schweiz und
 * Québec heissen die Schulstufen alle anders (CP-CM2, P1-P6, 1P-8P,
 * 1re-6e année); das Alter ist überall dasselbe. „Erwachsen" ⇒ *Adultes*.
 */
export function schulstufeLabelFr(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Adultes";
  const alter = stufe + ALTER_IN_ERSTER_SCHULSTUFE - 1;
  return `${alter - 1}-${alter} ans`;
}

/**
 * ★ ES-O (27.09.2026): dieselbe Anzeige als ALTER auf Spanisch - Spanien und
 * die Länder Amerikas zählen Klassen und Stufen ganz verschieden (1.º de
 * Primaria, 3.er grado, 5.º básico …); das Alter ist überall dasselbe.
 * „Erwachsen" ⇒ *Personas adultas* (geschlechtsneutral, Bauplan S10).
 */
export function schulstufeLabelIt(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Persone adulte";
  return SCHULSTUFE_IT[stufe] ?? `classe ${stufe}`;
}

/**
 * ★ O-IT (02.10.2026, Glossar §2.6 „Schulstufe", §4 Nr. 8): in der
 * italienischen Bedienung die italienische KLASSE, ausgeschrieben (Bauplan I9:
 * keine Ordnungszahl mit °/ª) - die Zählung deckt sich mit Österreich
 * (Schulstufe n = Alter n + 6): primaria 1-5, media 6-8, superiore 9-13.
 * Das Tessin zählt anders (scuola elementare 5 + scuola media 4) - offen.
 */
const SCHULSTUFE_IT: Readonly<Record<number, string>> = {
  1: "prima primaria",
  2: "seconda primaria",
  3: "terza primaria",
  4: "quarta primaria",
  5: "quinta primaria",
  6: "prima media",
  7: "seconda media",
  8: "terza media",
  9: "prima superiore",
  10: "seconda superiore",
  11: "terza superiore",
  12: "quarta superiore",
  13: "quinta superiore",
};

/**
 * ★ O-PL (02.10.2026, Glossar §2.6 „Schulstufe"): in der polnischen Bedienung
 * die polnische KLASSE mit Schulart, ohne Ordnungszahl (Regel 5): Schulstufe
 * 1-8 = „klasa 1-8 (szkoła podstawowa)", ab Stufe 9 neu gezählt „klasa 1
 * (szkoła ponadpodstawowa)" (liceum, technikum - Schulsystem seit 2017);
 * „Erwachsen" ⇒ „Osoby dorosłe". Die Zählung deckt sich mit Österreich
 * (Schulstufe n = Alter n + 6); polnische Kinder sind im Mittel einige Monate
 * älter - für die Textstufe ohne Belang.
 */
export function schulstufeLabelPl(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Osoby dorosłe";
  if (stufe <= 8) return `klasa ${stufe} (szkoła podstawowa)`;
  return `klasa ${stufe - 8} (szkoła ponadpodstawowa)`;
}

/**
 * ★ O-TR (02.10.2026, Glossar §2.6 "Schulstufe"): in der türkischen Bedienung
 * der türkische SINIF DÜZEYİ mit Schulart (4+4+4): Schulstufe 1-4 =
 * "İlkokul 1.-4. sınıf", 5-8 = "Ortaokul 5.-8. sınıf", 9-12 = "Lise 9.-12.
 * sınıf" - die Türkei zählt durch, Ordnungszahl nur mit Punkt (Regel 5).
 * Die Zählung deckt sich mit Österreich (Alter = Stufe + 6). Eine 13. Klasse
 * gibt es in der Türkei nicht: "13. sınıf (lise sonrası)". "Erwachsen" ⇒
 * "Yetişkin".
 */
export function schulstufeLabelTr(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Yetişkin";
  if (stufe <= 4) return `İlkokul ${stufe}. sınıf`;
  if (stufe <= 8) return `Ortaokul ${stufe}. sınıf`;
  if (stufe <= 12) return `Lise ${stufe}. sınıf`;
  return `${stufe}. sınıf (lise sonrası)`;
}

/**
 * ★ O-CS (03.10.2026, Glossar §2.6 „Schulstufe", §4 Falle 3): in der
 * tschechischen Bedienung der tschechische ROČNÍK mit Schulart - nie „třída"
 * (das ist in Tastenflow die Klasse mit Code): Schulstufe 1-9 = „1.-9. ročník
 * ZŠ" (základní škola, neun Jahre), ab Stufe 10 neu gezählt „1.-4. ročník SŠ"
 * (střední škola); „Erwachsen" ⇒ „Dospělí". Die Zählung deckt sich mit
 * Österreich (Alter = Stufe + 6). Ordnungszahl = Ziffer mit Punkt (Regel 5).
 */
export function schulstufeLabelCs(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Dospělí";
  if (stufe <= 9) return `${stufe}. ročník ZŠ`;
  return `${stufe - 9}. ročník SŠ`;
}

export function schulstufeLabelEs(stufe: number): string {
  if (stufe === SCHULSTUFE_ERWACHSEN) return "Personas adultas";
  const alter = stufe + ALTER_IN_ERSTER_SCHULSTUFE - 1;
  return `${alter - 1} a ${alter} años`;
}

/**
 * So alt ist ein Kind in der ersten Schulstufe (Österreich: Schuleintritt mit
 * sechs, im Lauf der ersten Klasse wird es sieben). Gerechnet wird mit dem
 * Alter, das im Kalenderjahr erreicht wird - dieselbe Grobheit wie beim
 * blanken Geburtsjahr (`account.alterImJahr`), und mehr braucht eine
 * Textstufe nicht.
 */
export const ALTER_IN_ERSTER_SCHULSTUFE = 7;

/**
 * Das Startjahr des Schuljahrs, in dem `jetztMs` liegt (2026 für 2026/27).
 *
 * ★ D2 (28.09.2026): `beginnMonat` (1-12) ist der Beginn des Schuljahres der
 * Klasse ({@link schuljahrBeginnVon}) - ohne Angabe August wie bisher. ⚠️
 * Schreiben und Lesen des Eintragsjahrs müssen DENSELBEN Monat nehmen, sonst
 * zählt die Schulstufe zwischen den zwei Beginn-Monaten eine Stufe zu viel
 * oder zu wenig.
 */
export function schuljahrStartjahr(
  jetztMs: number = Date.now(),
  beginnMonat: number = SCHULJAHR_BEGINN_VORGABE,
): number {
  return new Date(schuljahrVon(jetztMs, beginnMonat).vonMs).getFullYear();
}

/**
 * ★ D2 (28.09.2026): Die Klasse stellt ihren Beginn des Schuljahres um - das
 * gespeicherte Eintragsjahr der Schulstufe so umrechnen, dass die HEUTIGE
 * Schulstufe gleich bleibt.
 *
 * Beispiel: im Februar 2027 „7. Schulstufe" eingetragen, Beginn August ⇒
 * Eintragsjahr 2026 (das Schuljahr 2026/27 läuft noch). Stellt die Lehrkraft
 * danach auf Februar um, liegt „heute" schon im Schuljahr 2027 - ohne
 * Umrechnung stünde plötzlich die 8. Schulstufe da. Die Zahl der seither
 * VERGANGENEN Schuljahre bleibt darum, wie sie war.
 */
export function schulstufeSchuljahrUmrechnen(
  eingetragen: number,
  jetztMs: number,
  alterBeginn: number,
  neuerBeginn: number,
): number {
  const vergangen = schuljahrStartjahr(jetztMs, alterBeginn) - eingetragen;
  return schuljahrStartjahr(jetztMs, neuerBeginn) - vergangen;
}

/** Eine eingetragene Schulstufe - oder `null`, wenn keine (brauchbare) dasteht. */
function eingetragen(cls: KlassenWerte | null | undefined): number | null {
  const s = cls?.schulstufe;
  if (typeof s !== "number" || !Number.isFinite(s)) return null;
  const ganz = Math.round(s);
  if (ganz === SCHULSTUFE_ERWACHSEN) return SCHULSTUFE_ERWACHSEN;
  if (ganz < SCHULSTUFE_MIN || ganz > SCHULSTUFE_MAX) return null;
  return ganz;
}

/** Nur die Felder, die hier gebraucht werden - so ist die Funktion prüfbar. */
export type KlassenWerte = Pick<TypingClass, "schulstufe" | "schulstufeSchuljahr"> & {
  /** ★ D2: nur `settings.schuljahrBeginn` wird gelesen - fehlt es, gilt August. */
  settings?: TypingClass["settings"];
};

/**
 * ★ 25.09.2026 (Johannes): Hat die Lehrkraft diesem Kind eine EIGENE
 * Schulstufe gegeben (1-13 oder Erwachsen)? Dann gilt sie statt der der
 * Klasse - siehe `mitKlassenVorrang` (useTypingAuth.ts).
 */
export function hatEigeneSchulstufe(
  konto: { schulstufe?: number } | null | undefined,
): boolean {
  return eingetragen(konto) !== null;
}

/**
 * Die HEUTIGE Schulstufe der Klasse - eingetragene Stufe plus die
 * Schuljahre, die seither vergangen sind. `null` = keine eingetragen;
 * {@link SCHULSTUFE_ERWACHSEN} = „Erwachsen" (zählt nicht weiter).
 *
 * ⚠️ Gedeckelt bei {@link SCHULSTUFE_MAX}. Ein Klassen-Datensatz, den niemand
 * mehr anfasst, würde sonst Jahr für Jahr weiterzählen und irgendwann eine
 * 27. Schulstufe behaupten. Auf die Textstufe wirkt sich das nicht aus - ab
 * 16 Jahren ist ohnehin „erwachsen" - aber der Satz, der neben dem Feld
 * steht, soll nichts Unsinniges sagen. ⚠️ Der Deckel ist zugleich die
 * Zusicherung, dass eine Zahl NIE zu „Erwachsen" hochzählt (11.09.2026).
 *
 * ⚠️ Ein fehlendes oder späteres Eintragsjahr zählt NICHT rückwärts: Ohne
 * `schulstufeSchuljahr` gilt die Stufe so, wie sie dasteht.
 */
export function aktuelleSchulstufe(
  cls: KlassenWerte | null | undefined,
  jetztMs: number = Date.now(),
): number | null {
  const stufe = eingetragen(cls);
  if (stufe === null) return null;
  // ★ „Erwachsen" wächst nicht mit - nach „erwachsen" kommt nichts mehr.
  if (stufe === SCHULSTUFE_ERWACHSEN) return SCHULSTUFE_ERWACHSEN;
  const eingetragenesJahr = cls?.schulstufeSchuljahr;
  const jahre =
    typeof eingetragenesJahr === "number" && Number.isFinite(eingetragenesJahr)
      ? Math.max(
          0,
          schuljahrStartjahr(jetztMs, schuljahrBeginnVon(cls)) - Math.round(eingetragenesJahr),
        )
      : 0;
  return Math.min(SCHULSTUFE_MAX, stufe + jahre);
}

/**
 * Das ungefähre Alter der Kinder dieser Klasse. `null` = keine Schulstufe
 * eingetragen (dann gilt die Vorgabe, siehe {@link klassenStufe}) - oder
 * „Erwachsen": Dafür gibt es kein aus einer Schulstufe gerechnetes Alter, und
 * eine erfundene Zahl stünde sonst im Satz neben dem Feld.
 */
export function klassenAlter(
  cls: KlassenWerte | null | undefined,
  jetztMs: number = Date.now(),
): number | null {
  const stufe = aktuelleSchulstufe(cls, jetztMs);
  if (stufe === null || stufe === SCHULSTUFE_ERWACHSEN) return null;
  return stufe + ALTER_IN_ERSTER_SCHULSTUFE - 1;
}

/**
 * Die Textstufe, die für ALLE Kinder dieser Klasse gilt.
 *
 * Ohne eingetragene Schulstufe bleibt es bei {@link VORGABE_STUFE} („11-15
 * Jahre") - dieselbe Vorgabe wie für ein Konto ohne Geburtsjahr. Ein
 * Ladefehler nimmt damit niemandem etwas weg. „Erwachsen" ergibt die
 * vorhandene Textstufe `erwachsen` („ab 16 Jahren") - keine neue.
 */
export function klassenStufe(
  cls: KlassenWerte | null | undefined,
  jetztMs: number = Date.now(),
): Stufe {
  if (aktuelleSchulstufe(cls, jetztMs) === SCHULSTUFE_ERWACHSEN) return "erwachsen";
  const alter = klassenAlter(cls, jetztMs);
  if (alter === null) return VORGABE_STUFE;
  return stufeAusAlter(alter);
}

/* ══════════════════════════════════════════════════════════════════════════
 * ★★★★★ DAS STARTNIVEAU DER KLASSE (11.09.2026, Nacht)
 * ══════════════════════════════════════════════════════════════════════════ */

/** Nur die zwei Felder, um die es geht - an Kind UND Klasse gleich benannt. */
export interface StartpunktWerte {
  startUnits?: number;
  startUnitsAt?: number;
  /**
   * ★ E1 (24.09.2026): der Lernweg - `startUnits` ist eine ANZAHL und gilt
   * nur in ihm (Bauplan englischer Lehrgang §2.4). Fehlend = „de".
   */
  lernweg?: unknown;
}

/**
 * Der Startpunkt, der für ein Kind gilt - mit der Vorgabe seiner Klasse.
 *
 * Johannes wählte am 11.09.2026 nachts „Startniveau als Vorgabe an der Klasse
 * speichern". Bis dahin war das Startniveau der Klasse nur ein Beschluss, der
 * einmal auf die VORHANDENEN Kinder geschrieben wurde - ein Kind, das später
 * dazukam, begann bei „Anfänger".
 *
 * ── Die Regel ─────────────────────────────────────────────────────────────
 *  1. Ohne Vorgabe der Klasse bleibt das Konto, wie es ist.
 *  2. Hat das Kind einen EIGENEN Beschluss, der mindestens so neu ist wie der
 *     der Klasse (`startUnitsAt`), gilt der eigene - auch wenn er niedriger
 *     ist. So bleibt „Womit anfangen?" je Kind wirksam, und „Alle einstufen"
 *     (schreibt die Kinder NACH der Klasse) stuft wirklich zurück.
 *  3. Sonst gilt das Höhere von beiden - die Vorgabe NIMMT NUR DAZU.
 *
 * ⚠️ Der Zeitstempel des KINDES bleibt stehen. `startpunktAnwenden`
 * (`letters.ts`) erkennt einen Beschluss am Zeitstempel, nicht am Wert
 * (Übergabe 04.09.2026 nachmittags §2) - ein von der Klasse geerbter Wert soll
 * dort als AUTOMATIK ankommen, die nur dazunimmt, nie als Beschluss, der einem
 * Kind wegnimmt, was es sich erübt hat.
 *
 * ⚠️ Ein Beschluss ohne Zeitpunkt (Alt-Konto, `startUnitsAt` fehlt) ist kein
 * „neuerer" Beschluss: Dann greift Regel 3.
 *
 * ★ E1 (24.09.2026): 0. Steht das Kind auf einem ANDEREN Lernweg als seine
 * Klasse (gemischte Klasse), gilt die Vorgabe nicht - ihre Zahl ist eine
 * Anzahl im Weg der Klasse und hiesse für das Kind etwas anderes (Bauplan
 * §2.4). Solange alle auf „de" stehen, ändert das nichts.
 */
export function startpunktMitKlasse<T extends StartpunktWerte>(
  konto: T,
  cls: StartpunktWerte | null | undefined,
): T {
  const vorgabe = cls?.startUnits;
  if (typeof vorgabe !== "number" || !Number.isFinite(vorgabe) || vorgabe <= 0) return konto;
  if (lernwegVon(konto) !== lernwegVon(cls)) return konto;
  const kindAm = konto.startUnitsAt ?? 0;
  const klasseAm = cls?.startUnitsAt ?? 0;
  // ⚠️ `>=`: Die Kinder werden unmittelbar NACH der Klasse geschrieben - in
  // derselben Millisekunde gewinnt das Kind, sonst hebe die Klasse ein eben
  // zurückgestuftes Kind im selben Zug wieder an.
  if (kindAm > 0 && kindAm >= klasseAm) return konto;
  const eigen = konto.startUnits ?? 0;
  if (eigen >= vorgabe) return konto;
  return { ...konto, startUnits: Math.round(vorgabe) };
}

/** Was das Feld „Womit anfangen?" der Lehrkraft zeigen soll - siehe {@link startAnzeige}. */
export interface StartAnzeige {
  /** Die Einheiten-Zahl, aus der die Lehrkraft-Ansicht den benannten Startpunkt sucht. */
  stand: number;
  /**
   * Ein eigener Beschluss dieses Kindes ist wirksam, aber das Kind hat
   * Tastenflow seither noch nicht geöffnet - der Beschluss steht am Konto,
   * `introduced` ist aber noch nicht nachgezogen (siehe Kopf der Funktion).
   */
  ausstehend: boolean;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ★★★★★ WAS „WOMIT ANFANGEN?" DER LEHRKRAFT ZEIGT - AUCH GLEICH NACH EINEM
 * ZURÜCKSTUFEN (18.09.2026, Befund).
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Johannes testete: Ein Zurückstufen WIRKT - das Kind bekommt beim nächsten
 * Öffnen wirklich weniger. Nur die ANZEIGE hinkte hinterher: Sie nimmt die
 * höchste Stufe aus `progress.introduced` (`ensureIntroduced(...).length`),
 * und `introduced` schrumpft erst, wenn das Kind die Seite lädt
 * (`startpunktAnwenden`, `letters.ts`, aufgerufen aus `TippenTrainerPage`).
 * Bis dahin zeigte das Auswahlfeld also weiter den ALTEN, höheren Stand.
 *
 * ── Die Regel ────────────────────────────────────────────────────────────
 * Ist der EIGENE Beschluss des Kindes der wirksame - dieselbe Bedingung wie
 * Regel 2 von {@link startpunktMitKlasse} (`kindAm > 0 && kindAm >= klasseAm`)
 * - UND hat das Kind ihn noch nicht übernommen (`kindAm > startAngewandtAm`),
 * zeigt das Feld den BESCHLOSSENEN Wert (`pupil.startUnits`) - noch bevor
 * `introduced` nachgezogen ist. Sonst gilt weiter der wirkliche Stand: das
 * Höhere aus `introduced` und der (ggf. geerbten) Vorgabe, wie bisher.
 *
 * ⚠️ Der Zeitpunkt entscheidet, nicht der Wert (wie bei `startpunktMitKlasse`
 * und `startpunktAnwenden`): Auch ein Beschluss auf DIESELBE Stufe gilt als
 * ausstehend, bis er vermerkt ist - sonst bliebe „ausstehend" nach einem
 * zweiten, gleich hohen Beschluss fälschlich stehen.
 */
export function startAnzeige(
  pupil: StartpunktWerte,
  klasse: StartpunktWerte | null | undefined,
  eingefuehrt: number,
  startAngewandtAm: number | undefined,
): StartAnzeige {
  const kindAm = pupil.startUnitsAt ?? 0;
  const klasseAm = klasse?.startUnitsAt ?? 0;
  const eigenerBeschlussGilt = kindAm > 0 && kindAm >= klasseAm;
  if (eigenerBeschlussGilt && kindAm > (startAngewandtAm ?? 0)) {
    return { stand: pupil.startUnits ?? 0, ausstehend: true };
  }
  return {
    stand: Math.max(eingefuehrt, startpunktMitKlasse(pupil, klasse).startUnits ?? 0),
    ausstehend: false,
  };
}

/**
 * Was beim Anlegen gewünscht war, am Server aber NICHT angekommen ist - als
 * Wörter für einen Satz („Schulstufe", „Startniveau" …). Leer = alles da.
 *
 * ★ Warum es das braucht (11.09.2026): PocketBase übergeht ein Feld, das es im
 * Schema nicht kennt, OHNE Fehler. Ein Server ohne die neuen Felder legte die
 * Klasse also an und liesse die Einstellungen still fallen - eine halb
 * eingerichtete Klasse, von der niemand weiss. Verglichen wird der WIRKSAME
 * Wert: Fehlt ein Feld, dessen Vorgabe ohnehin gewünscht war (Deutsch, frei,
 * erlaubt), ist nichts verloren.
 */
export function nichtGespeicherteEinstellungen(
  gewuenscht: KlassenAnlage,
  klasse: TypingClass,
): string[] {
  const fehlt: string[] = [];
  if (gewuenscht.schulstufe !== undefined && gewuenscht.schulstufe > 0) {
    if (klasse.schulstufe !== Math.round(gewuenscht.schulstufe)) fehlt.push("Schulstufe");
  }
  if (gewuenscht.lang !== undefined && (klasse.lang ?? "de") !== gewuenscht.lang)
    fehlt.push("Sprache");
  if (gewuenscht.langLocked !== undefined && !!klasse.langLocked !== gewuenscht.langLocked)
    fehlt.push("Sprach-Sperre");
  if (gewuenscht.startUnits !== undefined && gewuenscht.startUnits > 0) {
    if (klasse.startUnits !== Math.round(gewuenscht.startUnits)) fehlt.push("Startniveau");
  }
  if (
    gewuenscht.klassenmatchAus !== undefined &&
    !!klasse.klassenmatchAus !== gewuenscht.klassenmatchAus
  )
    fehlt.push("Klassenmatch");
  // ★ Zeilenende mit Enter (23.09.2026), siehe TypingClass.zeilenEndeEnter.
  if (
    gewuenscht.zeilenEndeEnter !== undefined &&
    !!klasse.zeilenEndeEnter !== gewuenscht.zeilenEndeEnter
  )
    fehlt.push("Zeilenende mit Enter");
  // ★ D2 (28.09.2026): der Beginn des Schuljahres - verglichen wird der
  // WIRKSAME Wert (fehlt er und war August gewünscht, ist nichts verloren).
  if (
    gewuenscht.schuljahrBeginn !== undefined &&
    schuljahrBeginnVon(klasse) !== schuljahrBeginnVon({ settings: { schuljahrBeginn: gewuenscht.schuljahrBeginn } })
  )
    fehlt.push("Beginn des Schuljahres");
  return fehlt;
}
