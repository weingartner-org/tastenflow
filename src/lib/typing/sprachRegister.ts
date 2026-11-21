/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ DAS SPRACHREGISTER (G2a, 02.10.2026, Bauplan vier Sprachen §2.1)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * EINE Beschreibung je Sprache (de, en, fr, es, it, pl, tr, cs) mit den
 * EIGENSCHAFTEN, die der Code künftig fragt - STATT Sprach-IDs zu vergleichen
 * (`lang === "fr"`, `lernweg === "es"`). Das ist die Lehre aus Falle 50 des
 * Leitfadens: Mechanik, die an der ID einer Sprache klebt, trifft die nächste
 * Sprache nie; eine Mechanik, die eine Eigenschaft fragt, trifft jede Sprache,
 * die sie hat.
 *
 * ★ `sprachBeschreibung(lang)` WIRFT bei einem unbekannten Wert - nie still
 * Deutsch, nie still Englisch (Falle 50, G1c §3 Nr. 2). Wer eine neue Sprache
 * einführt, bekommt den Fehler am ersten Aufruf, nicht als falsche Sprache bei
 * einem Kind.
 *
 * ★ Dieses Gerüst (G2a) trägt NUR die Eigenschaften, die der Bauplan für die
 * vier neuen Sprachen schon kennt (Gebiet, Mehrzahl-Formen, Schuljahr,
 * Klassencode-Umschrift, Gross-/Kleinschreibung). Weitere Eigenschaften
 * (Totasten, AltGr, Zahlenreihe, Anführung, Stimmen …) kommen mit den
 * Etappen der jeweiligen Sprache HIERHER - nicht als neue Weiche.
 *
 * ⚠️ Dies ist ein BLATT: nur Typ-Importe (die zur Laufzeit verschwinden) und
 * eine Zahl aus `schuljahrBeginn.ts`. Darum darf `bedienSprache/texte.ts` die
 * Liste {@link ALLE_SPRACHEN} von hier holen, ohne einen Importkreis zu bauen.
 */
import type { Lang } from "./account";
import { SCHULJAHR_BEGINN_VORGABE } from "./schuljahrBeginn";

/** Die Mehrzahl-Kategorien von `Intl.PluralRules` (CLDR). */
export type PluralKategorie = "zero" | "one" | "two" | "few" | "many" | "other";

/** Was eine Sprache für den Code ausmacht. */
export interface SprachBeschreibung {
  /** Die Kennung der Sprache (dieselbe wie der Schlüssel im Register). */
  readonly id: Lang;
  /**
   * BCP-47 für `Intl.*` und Zahl/Datum. Für de/en/fr/es DIESELBEN Werte wie
   * `GEBIET` (`bedienSprache/texte.ts`) - nichts ändert sich; neu it-IT, pl-PL,
   * tr-TR, cs-CZ.
   */
  readonly locale: string;
  /**
   * Das Gebietsschema, mit dem Gross-/Kleinschreibung gerechnet wird, oder
   * `null` = die gewöhnliche `toUpperCase()`/`toLowerCase()`. NUR Türkisch hat
   * einen Wert: `i` ↔ `İ` und `ı` ↔ `I` (sonst wird aus „istanbul" ein
   * „ISTANBUL" statt „İSTANBUL").
   */
  readonly grossKleinLocale: string | null;
  /**
   * ★ G2b-1 (02.10.2026): `true` = die Zeichenklassen dieser Sprache sind ALLE
   * Buchstaben (Unicode `\p{L}`) - keine Liste von Sonderbuchstaben (it, pl, tr,
   * cs). `false` (de, en, fr, es) = die engen Klassen von vor G2b-1 bleiben, wo
   * Golden-Tests sie Byte für Byte festhalten (z. B. „Café" ⇒ „caf" auf de/en).
   * Gelesen von {@link buchstabeDerSprache}; wer eine neue Sprache ergänzt,
   * setzt `true` und bekommt jede Klasse ohne weitere Arbeit.
   */
  readonly alleBuchstaben: boolean;
  /** Die Formen, die `Intl.PluralRules(locale)` für diese Sprache kennt. */
  readonly pluralKategorien: readonly PluralKategorie[];
  /**
   * Der Monat (1-12), in dem das Schuljahr dieser Sprache gewöhnlich beginnt,
   * wenn kein Land bekannt ist. de/en/fr/es: der heutige Vorgabewert
   * (`SCHULJAHR_BEGINN_VORGABE`, August); it/pl/tr/cs: September.
   */
  readonly schuljahrMonat: number;
  /**
   * Zeichen → Ersatz für den Klassencode-Vorschlag (`klassencodeVorschlag`).
   * Schlüssel sind einzelne Zeichen (klein UND gross), Werte GROSSE ASCII-
   * Buchstaben. Ein Zeichen, das hier fehlt, wird vom allgemeinen Verfahren
   * (Unicode-Zerlegung, dann streichen) behandelt.
   */
  readonly klassencodeUmschrift: Readonly<Record<string, string>>;
  /**
   * ★ G3a-SCHRIFT (25.10.2026): die Regeln der amtlichen Umschrift, die ein Zeichen nicht ALLEIN entscheidet - Formen am
   * Wortanfang oder Wortende und Zeichenfolgen (ukrainisch „є" am Wortanfang YE, sonst IE; bulgarisch „-ия" am Wortende
   * IA; griechisch „αυ" vor einem stimmhaften Laut AV, sonst AF; „μπ" am Rand B, innen MB). Sie gehen der Tabelle
   * {@link klassencodeUmschrift} vor, die erste passende gilt. Leer für alle Sprachen in lateinischer Schrift.
   */
  readonly klassencodeRegeln: readonly UmschriftRegel[];
  /**
   * ★ O-TR (02.10.2026): `true` = das Prozentzeichen steht VOR der Zahl („%95",
   * Türkisch nach TDK; `Intl.NumberFormat("tr-TR", { style: "percent" })` schreibt
   * es ebenso). `false` = dahinter, mit oder ohne Abstand nach der Tabelle des
   * Aufrufers (de/fr/es „95 %", en/it/pl „95%") - für diese Sprachen ändert sich
   * nichts. Gelesen von {@link prozentMitZeichen}.
   */
  readonly prozentVorDerZahl: boolean;
  /**
   * ★ O-TR (02.10.2026): `true` = nach einer Zahl steht das Hauptwort in der
   * EINZAHL („5 hata", „12 öğrenci", nie „5 hatalar"). `Intl.PluralRules("tr")`
   * kennt zwar `one`/`other`, beide tragen im Türkischen aber dasselbe Wort -
   * `mehrzahl` (bedienSprache/texte.ts) nimmt darum für eine solche Sprache
   * IMMER die Form `one`, auch bei 0, 5 oder 1,5. `false` für alle anderen
   * Sprachen (Ergebnis unverändert).
   */
  readonly einzahlNachZahl: boolean;
  /**
   * ★ F5-F8-tr (03.10.2026): `true` = die Währung steht VOR der Zahl („€5", „₺150", „$5", Türkisch nach Glossar §1 Regel 5,
   * `Intl.NumberFormat("tr-TR", { style: "currency" })` schreibt es ebenso: „₺1.234,50"). `false` = dahinter („5 €", de/fr/es/it, oder
   * „5 $" je nach Zeichen - die Vorlagen des Generators entscheiden dort selbst, nichts ändert sich). Gelesen von `charDrillLine`
   * (generator.ts).
   */
  readonly waehrungVorDerZahl: boolean;
  /**
   * ★ O-CS (03.10.2026): `true` = zwischen Zahl und Prozentzeichen steht ein
   * GESCHÜTZTES Leerzeichen (U+00A0, „95 %"): Tschechisch nach IJP und Microsoft
   * (ohne Leerzeichen wäre „95%" ein Adjektiv, „95% roztok"); gemessen mit `Intl`
   * „cs-CZ" (`style: "percent"` ⇒ „95 %"). Das geschützte Leerzeichen hält Zahl
   * und Zeichen auf der Braillezeile und beim Umbruch zusammen. Nur für ANZEIGEN -
   * nie in einem Übungstext, den ein Kind abtippt (Glossar §4 Falle 9). `false`
   * für alle anderen Sprachen (Ergebnis unverändert).
   */
  readonly prozentAbstandGeschuetzt: boolean;
  /**
   * ★ G3a-SCHRIFT (25.10.2026): `true` = der Baustein- und Entdopplungs-Schlüssel eines Textes dieser Sprache
   * (`bausteinKey` in ledger.ts, `dedupKey` in corpus.ts) behält JEDEN Buchstaben (Unicode `\p{L}`, dazu `\p{M}`
   * und Ziffern). `false` = die alte Klasse `[^a-zäöüß0-9]` bleibt - für die acht Sprachen vor dem 25.10.2026
   * (de, en, fr, es, it, pl, tr, cs), deren Baustein-IDs im Anker (`corpusAnker.ts`) und im Ledger jedes Kindes
   * stehen und sich NIE ändern dürfen. Mit der alten Klasse würde ein kyrillischer oder griechischer Satz leer
   * („то е" ⇒ „") und jede Zeile hätte dieselbe ID; „szőr" und „szűr" fielen zusammen. Wahr für die neun Sprachen
   * des Gerüsts G2-NEUN.
   */
  readonly schluesselAlleBuchstaben: boolean;
  /**
   * ★ G3a-SCHRIFT (25.10.2026): die VOKALE der Sprache (klein, mit jedem Akzent), für die Silben-Werkstatt und die
   * Pseudowörter des Generators (`istVokalIn`, generator.ts). `null` = die gemeinsame Liste `VOWELS` des Generators
   * (de, en, fr, es, it, tr, cs - Byte für Byte wie vorher; pl hat dort seine eigene). Vokale sind Sprachdaten und
   * nicht aus `\p{L}` ableitbar (Befund G2b-1 §4 Nr. 4): Bulgarisch „ъ", Schwedisch „y", Griechisch „η ω".
   */
  readonly vokale: string | null;
  /**
   * ★ G3a-SCHRIFT (25.10.2026): `true` = auf der Tastenkappe steht JEDER Buchstabe der Sprache gross (kyrillische und
   * griechische Kappen, „Ő", „Ă", „Å", „Ç"). `false` = nur a-z gross, Buchstaben mit Zeichen so, wie die Lektionen
   * von fr, es, it, pl, cs sie bisher schreiben. Gelesen von {@link kappeFuer}.
   */
  readonly kappenAlleGross: boolean;
  /**
   * ★ G3a-SCHRIFT (25.10.2026): Buchstaben (klein), die in dieser Sprache EIN Buchstabe mit eigener Taste sind, obwohl
   * Unicode sie zerlegt (NFD): bulgarisch/ukrainisch „й" ist kein „и" + Breve, „ї" kein „і" + Trema, ungarisch „ő" kein
   * „o" + Doppelakut. Für solche Zeichen ist „Totaste + Grundbuchstabe" nie der Weg (`eigenerBuchstabe`). Leer für die
   * acht Sprachen vor dem 25.10.2026 (dort ändert sich nichts) und für Sprachen, deren Zeichen wirklich über eine Totaste
   * kommen (Griechisch ά: Tonos, dann α; Niederländisch é: `'`, dann e).
   */
  readonly eigeneBuchstabenMitZeichen: string;
  /**
   * ★ G3a-SCHRIFT (25.10.2026): Kleinbuchstaben, deren gewöhnliche Grossform MEHR als ein Zeichen ist, und die EINE
   * Grossform, die {@link grossFuer} für sie schreibt. Griechisch: `"ΐ".toUpperCase()` = Ι + U+0308 + U+0301 (drei
   * Code-Punkte, gemessen Node 24) - jede Stelle, die „Grossform = ein Zeichen" annimmt (Kappe, Einheit, Vergleich
   * Zeichen für Zeichen), hätte daran gebrochen. ΐ ΰ stehen nie am Wortanfang (das Trema trennt vom VORIGEN Vokal);
   * gross kommen sie nur in ganz gross geschriebenen Wörtern vor, und dort fällt der Tonos weg: Ϊ, Ϋ. Leer = keine.
   */
  readonly grossSonderformen: Readonly<Record<string, string>>;
  /**
   * ★ G3a-SCHRIFT (25.10.2026): das Gebietsschema für GANZ gross geschriebene Wörter ({@link ganzGrossFuer}), oder
   * `null` = wie {@link grossFuer}. Griechisch „el": ganze Wörter in Grossbuchstaben tragen keinen Tonos
   * („άλογο" ⇒ „ΑΛΟΓΟ", „άυπνος" ⇒ „ΑΫΠΝΟΣ" - ICU setzt das Trema, wo der Tonos einen Doppellaut trennte), der
   * Wortanfang aber schon („Άλογο", darum bleibt `grossKleinLocale` für el `null`, Befund G2-NEUN §4).
   */
  readonly ganzGrossLocale: string | null;
}

/**
 * ★ G3a-SCHRIFT (25.10.2026): eine Regel der Umschrift. `folge` ist KLEIN geschrieben (verglichen wird mit dem klein
 * geschriebenen Text, „Є", „ΑΥ", „Μπ" treffen also auch), `ersatz` GROSSE ASCII-Buchstaben.
 *  · `wo: "anfang"` - nur am Wortanfang, `wo: "ende"` - nur am Wortende (Grenze: {@link WORTGRENZE});
 *  · `danach` - nur, wenn danach eines dieser Zeichen (klein) folgt.
 * ⚠️ Der Server rechnet dieselben Regeln (`SYNTH_REGELN` in `pocketbase/pb_hooks/tt_klasse_lib.pb.js`) - ein Wächter
 * hält beide gleich.
 */
export interface UmschriftRegel {
  readonly folge: string;
  readonly ersatz: string;
  readonly wo?: "anfang" | "ende";
  readonly danach?: string;
}

/**
 * ★ G3a-SCHRIFT: was ein Wort beendet - Leerraum, Bindestriche, Satzzeichen, Klammern, Schrägstrich, Unterstrich,
 * Ziffern, Anführungszeichen. NICHT der Apostroph: ukrainisch „Мар'яна" ist EIN Wort (KMU: Mariana, nicht Mar-Yana).
 * Als feste Klasse ohne `\p{…}`, damit der Server (PocketBase) GENAU so rechnet (dieselbe Zeichenfolge steht dort).
 */
export const WORTGRENZE = /[\s\-\u2010-\u2015.,;:!?()[\]\/_0-9"\u201E\u201C\u201D\u00AB\u00BB]/;

/** ★ G3a-SCHRIFT (25.10.2026): die Schrift-Eigenschaften einer Sprache, Vorgabe = wie vor dem 25.10.2026. */
interface SchriftAngaben {
  schluesselAlleBuchstaben?: boolean;
  vokale?: string;
  kappenAlleGross?: boolean;
  eigeneBuchstabenMitZeichen?: string;
  grossSonderformen?: Readonly<Record<string, string>>;
  ganzGrossLocale?: string;
  klassencodeRegeln?: readonly UmschriftRegel[];
}

/** Aus einer Liste „klein → Ersatz" eine Tabelle mit kleinen UND grossen Schlüsseln. */
function umschrift(kleinZuErsatz: Readonly<Record<string, string>>, extra: Readonly<Record<string, string>> = {}): Readonly<Record<string, string>> {
  const t: Record<string, string> = {};
  for (const [klein, ersatz] of Object.entries(kleinZuErsatz)) {
    t[klein] = ersatz;
    const zeichen = [...klein];
    if (zeichen.length > 1) {
      // ★ G2-NEUN (25.10.2026): ein ZEICHENPAAR (Griechisch „ου" → „OU", Ukrainisch „зг" → „ZGH") bekommt
      // seine Grossform („ΟΥ") und die Form am Wortanfang („Ου") dazu. Bis G2-NEUN gab es nur einzelne Zeichen.
      const ganzGross = klein.toUpperCase();
      const titel = zeichen[0].toUpperCase() + zeichen.slice(1).join("");
      if (ganzGross !== klein) t[ganzGross] = ersatz;
      if (titel !== klein) t[titel] = ersatz;
      continue;
    }
    const gross = klein.toUpperCase();
    // Ein Zeichen, dessen Grossform ein einfacher Buchstabe ist (ı → I), braucht
    // keinen eigenen Eintrag: das allgemeine Verfahren schreibt es schon so.
    if (gross !== klein && [...gross].length === 1 && !/^[A-Z]$/.test(gross)) t[gross] = ersatz;
  }
  return Object.freeze({ ...t, ...extra });
}

/*
 * ★ G2-NEUN (25.10.2026): die amtlichen Umschriften der drei Sprachen, die NICHT in lateinischer Schrift
 * schreiben - als Tabelle „kleiner Buchstabe → GROSSE ASCII-Buchstaben". Ohne sie fiele ein kyrillischer oder
 * griechischer Klassenname beim Klassencode-Vorschlag GANZ weg (NFD + `[^A-Z0-9]` lässt nichts übrig), und
 * jeder kyrillische Kindername würde in `synthEmail` (pbBackend.ts) zu „x".
 *
 * ★ G3a-SCHRIFT (25.10.2026): die Tabellen gelten Zeichen für Zeichen; die Sonderregeln am WORTANFANG (Ukrainisch
 * є ї й ю я → YE YI Y YU YA), am Wortende (Bulgarisch „-ия" → IA), die Zeichenfolgen (Ukrainisch „зг", Griechisch
 * ου γγ γξ γχ) und die griechischen Lautregeln (αυ/ευ/ηυ AV/AF, μπ B/MB) stehen als REGELN daneben
 * (`klassencodeRegeln`, REGELN_UK/BG/EL). ντ bleibt NT (ELOT 743). Grundlage: bulgarisches Transliterationsgesetz 2009
 * („Streamlined System"); Beschluss des Ministerkabinetts der Ukraine Nr. 55 vom 27.01.2010; ELOT 743 (2. Ausgabe
 * 2001). Aus dem Gedächtnis aufgeschrieben, mit bekannten Beispielen geprüft (Юлія YULIIA, Згорани ZGHORANY, София
 * SOFIA; der Landesname „Bulgaria" ist eine überlieferte Ausnahme, die Regel gibt BALGARIA) - NICHT gegen den Gesetzestext gelesen.
 */
/** Bulgarisch, Streamlined System (2009). */
const UMSCHRIFT_BG: Readonly<Record<string, string>> = {
  а: "A", б: "B", в: "V", г: "G", д: "D", е: "E", ж: "ZH", з: "Z", и: "I", й: "Y", к: "K", л: "L", м: "M",
  н: "N", о: "O", п: "P", р: "R", с: "S", т: "T", у: "U", ф: "F", х: "H", ц: "TS", ч: "CH", ш: "SH", щ: "SHT",
  ъ: "A", ь: "Y", ю: "YU", я: "YA",
  // ★ G3a-SCHRIFT (25.10.2026): ѝ (и mit Gravis, eigene Taste) ist im Gesetz ein „и" ⇒ I.
  ѝ: "I",
};
/** Ukrainisch, KMU-Beschluss Nr. 55 (2010) - die Formen NICHT am Wortanfang (є → IE, ї → I, й → I, ю → IU, я → IA). */
const UMSCHRIFT_UK: Readonly<Record<string, string>> = {
  а: "A", б: "B", в: "V", г: "H", ґ: "G", д: "D", е: "E", є: "IE", ж: "ZH", з: "Z", и: "Y", і: "I", ї: "I",
  й: "I", к: "K", л: "L", м: "M", н: "N", о: "O", п: "P", р: "R", с: "S", т: "T", у: "U", ф: "F", х: "KH",
  ц: "TS", ч: "CH", ш: "SH", щ: "SHCH", ь: "", ю: "IU", я: "IA",
  // ★ G3a-SCHRIFT (25.10.2026): der Apostroph entfällt (KMU 2010: „Мар'яна" ⇒ Mariana) - U+02BC ist für Unicode ein
  // Buchstabe und stünde sonst als „-" in der Login-Adresse. (' und ’ fallen im Klassencode ohnehin weg.)
  "\u02BC": "",
  // Das Zeichenpaar „зг" (ZGH) und die Formen am Wortanfang stehen seit G3a-SCHRIFT in {@link REGELN_UK}.
};
/**
 * ★ G3a-SCHRIFT (25.10.2026): Ukrainisch, KMU-Beschluss Nr. 55 (2010) - am WORTANFANG є ї й ю я ⇒ YE YI Y YU YA
 * („Юлія" ⇒ YULIIA, „Їжак" ⇒ YIZHAK, „Йосип" ⇒ YOSYP); „зг" ⇒ ZGH („Згорани" ⇒ ZGHORANY, damit es nicht wie ж aussieht).
 */
const REGELN_UK: readonly UmschriftRegel[] = [
  { folge: "є", ersatz: "YE", wo: "anfang" },
  { folge: "ї", ersatz: "YI", wo: "anfang" },
  { folge: "й", ersatz: "Y", wo: "anfang" },
  { folge: "ю", ersatz: "YU", wo: "anfang" },
  { folge: "я", ersatz: "YA", wo: "anfang" },
  { folge: "зг", ersatz: "ZGH" },
];
/** ★ G3a-SCHRIFT (25.10.2026): Bulgarisch, Streamlined System (2009) - „-ия" am Wortende ⇒ IA („България" ⇒ BALGARIA). */
const REGELN_BG: readonly UmschriftRegel[] = [{ folge: "ия", ersatz: "IA", wo: "ende" }];
/** Griechisch, ELOT 743: Buchstaben mit Tonos und Trema auf ihren Grundbuchstaben. */
const UMSCHRIFT_EL: Readonly<Record<string, string>> = {
  α: "A", ά: "A", β: "V", γ: "G", δ: "D", ε: "E", έ: "E", ζ: "Z", η: "I", ή: "I", θ: "TH", ι: "I", ί: "I",
  ϊ: "I", ΐ: "I", κ: "K", λ: "L", μ: "M", ν: "N", ξ: "X", ο: "O", ό: "O", π: "P", ρ: "R", σ: "S", ς: "S",
  τ: "T", υ: "Y", ύ: "Y", ϋ: "Y", ΰ: "Y", φ: "F", χ: "CH", ψ: "PS", ω: "O", ώ: "O",
  // Die Zeichenpaare (ου γγ γξ γχ) und die Lautregeln stehen seit G3a-SCHRIFT in {@link REGELN_EL}.
};
/** Stimmhafte Laute nach ELOT 743: alle Vokale (mit Tonos/Dialytika) und β γ δ ζ λ μ ν ρ. */
const STIMMHAFT_EL = "αεηιουωάέήίόύώϊϋΐΰβγδζλμνρ";
/**
 * ★ G3a-SCHRIFT (25.10.2026): Griechisch, ELOT 743 - αυ ευ ηυ (auch mit Tonos auf υ) vor einem stimmhaften Laut AV EV IV,
 * sonst (vor θ κ ξ π σ τ φ χ ψ und am Wortende) AF EF IF („αυτός" ⇒ AFTOS, „Ευαγγελία" ⇒ EVANGELIA); μπ am Wortanfang
 * und -ende B, innen MB („Μπάμπης" ⇒ BAMBIS); ου OU, γγ NG, γξ NX, γχ NCH. Ein Trema trennt den Doppellaut
 * („αϋπνία" ⇒ AYPNIA, über die Tabelle).
 */
const REGELN_EL: readonly UmschriftRegel[] = [
  { folge: "μπ", ersatz: "B", wo: "anfang" },
  { folge: "μπ", ersatz: "B", wo: "ende" },
  { folge: "μπ", ersatz: "MB" },
  ...(["αυ", "αύ", "ευ", "εύ", "ηυ", "ηύ"] as const).flatMap((paar): UmschriftRegel[] => {
    const v = paar[0] === "α" ? "A" : paar[0] === "ε" ? "E" : "I";
    return [
      { folge: paar, ersatz: `${v}V`, danach: STIMMHAFT_EL },
      { folge: paar, ersatz: `${v}F` },
    ];
  }),
  { folge: "ου", ersatz: "OU" },
  { folge: "ού", ersatz: "OU" },
  { folge: "γγ", ersatz: "NG" },
  { folge: "γξ", ersatz: "NX" },
  { folge: "γχ", ersatz: "NCH" },
];
/** Portugiesisch (Portugal und Brasilien): Buchstabe mit Zeichen ⇒ Grundbuchstabe. */
const UMSCHRIFT_PT: Readonly<Record<string, string>> = {
  á: "A", à: "A", â: "A", ã: "A", ç: "C", é: "E", ê: "E", í: "I", ó: "O", ô: "O", õ: "O", ú: "U", ü: "U",
};

/*
 * ★ G3a-SCHRIFT (25.10.2026): die Schrift-Eigenschaften der neun Sprachen des Gerüsts. Jede Mechanik, die
 * Buchstaben, Vokale, Totasten oder Gross-/Kleinschreibung braucht, fragt HIER - nie `lang === "bg"` (Falle 50).
 */
// Bulgarisch: а е и о у ъ ю я (ѝ ist и mit Gravis)
const SCHRIFT_BG: SchriftAngaben = { klassencodeRegeln: REGELN_BG, eigeneBuchstabenMitZeichen: "йѝ", schluesselAlleBuchstaben: true, vokale: "аеиоуъюяѝ", kappenAlleGross: true };
// Griechisch: α ε η ι ο υ ω mit Tonos und Dialytika
const SCHRIFT_EL: SchriftAngaben = { klassencodeRegeln: REGELN_EL, grossSonderformen: { ΐ: "Ϊ", ΰ: "Ϋ" }, ganzGrossLocale: "el", schluesselAlleBuchstaben: true, vokale: "αεηιουωάέήίόύώϊϋΐΰ", kappenAlleGross: true };
// Ungarisch: a á e é i í o ó ö ő u ú ü ű
const SCHRIFT_HU: SchriftAngaben = { eigeneBuchstabenMitZeichen: "áéíóöőúüű", schluesselAlleBuchstaben: true, vokale: "aáeéiíoóöőuúüű", kappenAlleGross: true };
// Niederländisch: a e i o u mit ihren Akzenten (y und ij bleiben Konsonant bzw. zwei Buchstaben)
const SCHRIFT_NL: SchriftAngaben = { schluesselAlleBuchstaben: true, vokale: "aeiouáàéèêëíïóôöúûü", kappenAlleGross: true };
// Portugiesisch: a e i o u mit Akut, Gravis, Zirkumflex, Tilde (ü in alten Texten)
const SCHRIFT_PT: SchriftAngaben = { eigeneBuchstabenMitZeichen: "ç", schluesselAlleBuchstaben: true, vokale: "aeiouáàâãéêíóôõúü", kappenAlleGross: true };
// wie Portugal
const SCHRIFT_BR: SchriftAngaben = { eigeneBuchstabenMitZeichen: "ç", schluesselAlleBuchstaben: true, vokale: "aeiouáàâãéêíóôõúü", kappenAlleGross: true };
// Rumänisch: a ă â e i î o u
const SCHRIFT_RO: SchriftAngaben = { eigeneBuchstabenMitZeichen: "ăâîșțşţ", schluesselAlleBuchstaben: true, vokale: "aăâeiîou", kappenAlleGross: true };
// Schwedisch: y IST ein Vokal (by, flyga), dazu å ä ö é
const SCHRIFT_SV: SchriftAngaben = { eigeneBuchstabenMitZeichen: "åäö", schluesselAlleBuchstaben: true, vokale: "aeiouyåäöé", kappenAlleGross: true };
// Ukrainisch: а е є и і ї о у ю я
const SCHRIFT_UK: SchriftAngaben = { klassencodeRegeln: REGELN_UK, eigeneBuchstabenMitZeichen: "йї", schluesselAlleBuchstaben: true, vokale: "аеєиіїоуюя", kappenAlleGross: true };

/** `Intl.PluralRules` einmal fragen - die Tabelle unten bleibt so kurz und kann nicht abweichen. */
function pluralKategorienVon(locale: string): readonly PluralKategorie[] {
  return new Intl.PluralRules(locale).resolvedOptions().pluralCategories as PluralKategorie[];
}

/** Baut einen Eintrag; das Gebiet legt die Mehrzahl-Formen fest. */
function beschreibe(
  id: Lang,
  locale: string,
  schuljahrMonat: number,
  klassencodeUmschrift: Readonly<Record<string, string>>,
  grossKleinLocale: string | null = null,
  alleBuchstaben = false,
  // ★ O-TR (02.10.2026): zwei Eigenschaften der Schreibweise, Vorgabe = wie bisher.
  // ★ O-CS (03.10.2026): dazu `prozentAbstandGeschuetzt` (Vorgabe aus); ★ F5-F8-tr (03.10.2026): dazu `waehrungVorDerZahl` (Vorgabe aus).
  zahlUndWort: { prozentVorDerZahl?: boolean; einzahlNachZahl?: boolean; prozentAbstandGeschuetzt?: boolean; waehrungVorDerZahl?: boolean } = {},
  // ★ G3a-SCHRIFT (25.10.2026): die Schrift-Eigenschaften (Vorgabe: wie vorher).
  schrift: SchriftAngaben = {},
): SprachBeschreibung {
  return Object.freeze({
    id,
    locale,
    grossKleinLocale,
    alleBuchstaben,
    pluralKategorien: Object.freeze(pluralKategorienVon(locale)),
    schuljahrMonat,
    klassencodeUmschrift,
    klassencodeRegeln: Object.freeze([...(schrift.klassencodeRegeln ?? [])]),
    prozentVorDerZahl: zahlUndWort.prozentVorDerZahl ?? false,
    einzahlNachZahl: zahlUndWort.einzahlNachZahl ?? false,
    waehrungVorDerZahl: zahlUndWort.waehrungVorDerZahl ?? false,
    prozentAbstandGeschuetzt: zahlUndWort.prozentAbstandGeschuetzt ?? false,
    schluesselAlleBuchstaben: schrift.schluesselAlleBuchstaben ?? false,
    vokale: schrift.vokale ?? null,
    kappenAlleGross: schrift.kappenAlleGross ?? false,
    eigeneBuchstabenMitZeichen: schrift.eigeneBuchstabenMitZeichen ?? "",
    grossSonderformen: Object.freeze({ ...(schrift.grossSonderformen ?? {}) }),
    ganzGrossLocale: schrift.ganzGrossLocale ?? null,
  });
}

/**
 * DAS REGISTER. `Record<Lang, …>` zwingt `tsc`, bei jeder neuen Sprache einen
 * Eintrag zu schreiben - eine Sprache ohne Beschreibung kompiliert nicht.
 */
export const SPRACHREGISTER: Readonly<Record<Lang, SprachBeschreibung>> = {
  // Die Vorgaben der vier fertigen Sprachen sind die Werte, die der Code heute
  // benutzt (Gebiet: `GEBIET`; Schuljahr: August).
  de: beschreibe("de", "de-AT", SCHULJAHR_BEGINN_VORGABE, umschrift({ ä: "AE", ö: "OE", ü: "UE", ß: "SS" }, { ẞ: "SS" })),
  en: beschreibe("en", "en-GB", SCHULJAHR_BEGINN_VORGABE, umschrift({})),
  fr: beschreibe("fr", "fr-FR", SCHULJAHR_BEGINN_VORGABE, umschrift({})),
  es: beschreibe("es", "es-ES", SCHULJAHR_BEGINN_VORGABE, umschrift({ ñ: "NI" })),
  // Neu (G2a): September; Umschrift: jeder Buchstabe mit Zeichen auf seinen
  // Grundbuchstaben (Bauplan §0a / Auftrag G2a Teil C).
  it: beschreibe("it", "it-IT", 9, umschrift({ à: "A", è: "E", é: "E", ì: "I", ò: "O", ù: "U" }), null, true),
  pl: beschreibe("pl", "pl-PL", 9, umschrift({ ą: "A", ć: "C", ę: "E", ł: "L", ń: "N", ó: "O", ś: "S", ź: "Z", ż: "Z" }), null, true),
  tr: beschreibe(
    "tr",
    "tr-TR",
    9,
    umschrift({ ç: "C", ğ: "G", ı: "I", ö: "O", ş: "S", ü: "U" }, { İ: "I" }),
    "tr",
    true,
    // ★ O-TR (02.10.2026): „%95" und „5 hata" (Glossar Türkisch §1 Regel 5, TDK, gemessen mit Intl „tr-TR").
    // ★ F5-F8-tr (03.10.2026): dazu „₺150" und „€5" (Währung vor der Zahl).
    { prozentVorDerZahl: true, einzahlNachZahl: true, waehrungVorDerZahl: true },
  ),
  cs: beschreibe(
    "cs",
    "cs-CZ",
    9,
    umschrift({
      á: "A", č: "C", ď: "D", é: "E", ě: "E", í: "I", ň: "N", ó: "O", ř: "R",
      š: "S", ť: "T", ú: "U", ů: "U", ý: "Y", ž: "Z",
    }),
    null,
    true,
    // ★ O-CS (03.10.2026): „95 %" mit geschütztem Leerzeichen (Glossar Tschechisch §1 Regel 5, gemessen mit Intl „cs-CZ").
    { prozentAbstandGeschuetzt: true },
  ),
  // ★ G2-NEUN (25.10.2026): die neun Lernwege des Gerüsts - alle unsichtbar hinter ihrem Schalter (Vorgabe AUS).
  // Schuljahr aus `recherche-xx/didaktik.md` (iCloud `sprachen-2026-10-25`), BELEGT für alle neun: bg 15.9., el Mitte
  // September, hu 1.9., nl Mitte bis Ende August (Niederlande; Flandern 1.9.), pt 11.-15.9., br Anfang Februar, ro 7.9.,
  // sv Mitte August, uk 1.9. Gross-/Kleinschreibung: für alle neun die gewöhnliche (`null`), AUCH für Griechisch
  // (Befund G2-NEUN §4): `toLocaleUpperCase("el")` STREICHT den Tonos („άλογο" ⇒ „ΑΛΟΓΟ") und machte aus einem
  // Wortanfang „Άλογο" ein falsches „Αλογο"; `toLowerCase()` setzt das Schluss-Sigma schon selbst („ΟΔΟΣ" ⇒ „οδος"
  // mit ς, gemessen mit Node 24). Prozent, Währung, Einzahl nach Zahl: Vorgabe (kommt mit der Etappe O der Sprache).
  // Umschrift der lateinisch schreibenden Sprachen: Buchstabe mit Zeichen ⇒ Grundbuchstabe, wie bei cs/pl.
  bg: beschreibe("bg", "bg-BG", 9, umschrift(UMSCHRIFT_BG), null, true, {}, SCHRIFT_BG),
  el: beschreibe("el", "el-GR", 9, umschrift(UMSCHRIFT_EL), null, true, {}, SCHRIFT_EL),
  hu: beschreibe("hu", "hu-HU", 9, umschrift({ á: "A", é: "E", í: "I", ó: "O", ö: "O", ő: "O", ú: "U", ü: "U", ű: "U" }), null, true, {}, SCHRIFT_HU),
  nl: beschreibe("nl", "nl-NL", 8, umschrift({ á: "A", é: "E", è: "E", ë: "E", í: "I", ï: "I", ó: "O", ö: "O", ú: "U", ü: "U" }), null, true, {}, SCHRIFT_NL),
  pt: beschreibe("pt", "pt-PT", 9, umschrift(UMSCHRIFT_PT), null, true, {}, SCHRIFT_PT),
  br: beschreibe("br", "pt-BR", 2, umschrift(UMSCHRIFT_PT), null, true, {}, SCHRIFT_BR),
  // Rumänisch: Komma-Zeichen ș ț UND die alten Cedille-Zeichen ş ţ (in Namenslisten noch häufig).
  ro: beschreibe("ro", "ro-RO", 9, umschrift({ ă: "A", â: "A", î: "I", ș: "S", ş: "S", ț: "T", ţ: "T" }), null, true, {}, SCHRIFT_RO),
  // Schwedisch: Grundbuchstabe (å ä ö → A A O), wie Adressen und Benutzernamen es meist halten (nicht ICAO AA/AE/OE).
  sv: beschreibe("sv", "sv-SE", 8, umschrift({ å: "A", ä: "A", ö: "O", é: "E" }), null, true, {}, SCHRIFT_SV),
  uk: beschreibe("uk", "uk-UA", 9, umschrift(UMSCHRIFT_UK), null, true, {}, SCHRIFT_UK),
};

/**
 * ALLE Sprachen, die der Code kennt - in fester Reihenfolge (die vier fertigen
 * zuerst). Aus dem Register gelesen, nie von Hand geschrieben: eine Sprache,
 * die im Register steht, steht automatisch hier.
 */
export const ALLE_SPRACHEN: readonly Lang[] = Object.freeze(Object.keys(SPRACHREGISTER) as Lang[]);

/**
 * ★ O-TR (02.10.2026): eine Prozentzahl mit dem Zeichen der Sprache. `zeichen`
 * ist das, was der Aufrufer bisher HINTER die Zahl schrieb (`" %"` oder `"%"`,
 * aus seiner eigenen Tabelle - so bleibt jede bestehende Schreibweise Byte für
 * Byte). Eine Sprache mit {@link SprachBeschreibung.prozentVorDerZahl} setzt das
 * Zeichen ohne Abstand DAVOR („%95", Türkisch).
 *
 * ★ O-CS (03.10.2026): eine Sprache mit
 * {@link SprachBeschreibung.prozentAbstandGeschuetzt} schreibt IMMER Zahl,
 * geschütztes Leerzeichen (U+00A0), Zeichen („95 %", Tschechisch) - gleich, was
 * der Aufrufer als Abstand mitgibt.
 */
export function prozentMitZeichen(zahl: string | number, zeichen: string, lang: Lang): string {
  const b = sprachBeschreibung(lang);
  if (b.prozentVorDerZahl) return `${zeichen.trim()}${zahl}`;
  if (b.prozentAbstandGeschuetzt) return `${zahl}\u00A0${zeichen.trim()}`;
  return `${zahl}${zeichen}`;
}

/** Ist das eine Sprache des Registers? (Für alles, was von aussen kommt.) */
export function istSprache(x: unknown): x is Lang {
  return typeof x === "string" && Object.hasOwn(SPRACHREGISTER, x);
}

/**
 * Die Beschreibung einer Sprache. ⚠️ WIRFT bei einem unbekannten Wert - das ist
 * Absicht (Falle 50): nie still Deutsch.
 */
export function sprachBeschreibung(lang: Lang): SprachBeschreibung {
  if (!istSprache(lang)) {
    throw new Error(`Unbekannte Sprache: ${JSON.stringify(lang)} (bekannt: ${ALLE_SPRACHEN.join(", ")})`);
  }
  return SPRACHREGISTER[lang];
}

/**
 * Der Text in GROSSBUCHSTABEN, wie die Sprache ihn schreibt. Für alle Sprachen
 * ausser Türkisch EXAKT `toUpperCase()` (byte-gleich zu heute); Türkisch rechnet
 * mit dem Gebietsschema („istanbul" → „İSTANBUL").
 */
export function grossFuer(text: string, lang: Lang): string {
  const b = sprachBeschreibung(lang);
  const l = b.grossKleinLocale;
  // ★ G3a-SCHRIFT (25.10.2026): Buchstaben mit einer Grossform aus EINEM Zeichen (griechisch ΐ ⇒ Ϊ, ΰ ⇒ Ϋ), siehe
  // `grossSonderformen`. Für jede Sprache ohne solche Formen (alle ausser el) genau die Rechnung von vorher.
  const t = Object.keys(b.grossSonderformen).length ? [...text].map((z) => b.grossSonderformen[z] ?? z).join("") : text;
  return l ? t.toLocaleUpperCase(l) : t.toUpperCase();
}

/**
 * ★ G3a-SCHRIFT (25.10.2026): ein GANZES Wort (oder ein Text) in Grossbuchstaben, wie die Sprache es schreibt -
 * Griechisch ohne Tonos („άλογο" ⇒ „ΑΛΟΓΟ", `ganzGrossLocale`). Für jede andere Sprache {@link grossFuer}.
 * Für den Wortanfang (ein Buchstabe gross) immer {@link grossFuer}: dort bleibt der Tonos („Άλογο").
 */
export function ganzGrossFuer(text: string, lang: Lang): string {
  const l = sprachBeschreibung(lang).ganzGrossLocale;
  return l ? text.toLocaleUpperCase(l) : grossFuer(text, lang);
}

/** Der Text in Kleinbuchstaben, wie die Sprache ihn schreibt (Türkisch: „IŞIK" → „ışık"). */
export function kleinFuer(text: string, lang: Lang): string {
  const l = sprachBeschreibung(lang).grossKleinLocale;
  return l ? text.toLocaleLowerCase(l) : text.toLowerCase();
}

/**
 * Ist `zeichen` EIN Buchstabe (Unicode-Eigenschaft `\p{L}`) - jeder Sprache,
 * mit jedem Sonderzeichen? Für die Zeichenklassen, die bisher Buchstaben von
 * Hand aufzählten (`[a-zäöüß…]`); umgestellt seit G2b-1 (02.10.2026).
 */
export function istBuchstabe(zeichen: string): boolean {
  return /^\p{L}$/u.test(zeichen);
}

/**
 * ★ G2b-1: Ist `zeichen` ein Buchstabe DIESER Sprache? Für Stellen, an denen die
 * alte, enge Klasse (`alteKlasse`, z. B. `/^[a-zäöüß]$/`) für de/en/fr/es
 * Byte für Byte bleiben muss: dort gilt die alte Klasse; für Sprachen mit
 * `alleBuchstaben` (it, pl, tr, cs) zählt JEDER Buchstabe. Ohne Sprache: nur die
 * alte Klasse (jeder Alt-Aufruf).
 */
export function buchstabeDerSprache(zeichen: string, lang: Lang | undefined, alteKlasse: RegExp): boolean {
  if (alteKlasse.test(zeichen)) return true;
  return lang !== undefined && sprachBeschreibung(lang).alleBuchstaben && istBuchstabe(zeichen);
}

/**
 * ★ G3a-SCHRIFT (25.10.2026): wie eine Taste in einem Lektionstext steht - so, wie auf ihrer Kappe. Ein Buchstabe
 * gross (Sprache mit {@link SprachBeschreibung.kappenAlleGross}: JEDER Buchstabe, sonst nur a-z), alles andere so,
 * wie es ist. Ersetzt die feste Klasse `/^[a-z]$/` der `kappe`-Funktionen in `curriculumXx.ts` für die neuen
 * Sprachen (die bestehenden behalten ihre). Eine Grossform aus MEHR als einem Zeichen (griechisch „ΐ" ⇒ drei
 * Code-Punkte) gibt es auf keiner Kappe: dann bleibt das Zeichen klein.
 *
 * ★ G4-NAHT (25.10.2026, G3b Falle 15 „kleine Kappen"): in einer Sprache mit `kappenAlleGross` nur dann gross, wenn die
 * Grossform zu DIESER Taste gehört (klein gerechnet wieder `taste` ergibt) - das griechische Schluss-Sigma `ς` hat die
 * Grossform Σ, die gehört aber der Taste σ; die Kappe von `ς` zeigt `ς`. Für die acht Sprachen vor dem 25.10.2026
 * (nur a-z, türkisch i ⇒ İ ⇒ i) ändert das nichts. `kleineKappen` (wahlweise, das Feld der Tastatur aus `layouts.ts`): Tasten,
 * deren Kappe den Kleinbuchstaben zeigt (bg `ь` - Ь ist dort nur über die Feststelltaste zu haben), bleiben klein.
 */
export function kappeFuer(taste: string, lang: Lang, kleineKappen?: readonly string[]): string {
  if (kleineKappen?.includes(taste)) return taste;
  const b = sprachBeschreibung(lang);
  const istKappenBuchstabe = b.kappenAlleGross ? istBuchstabe(taste) : /^[a-z]$/.test(taste);
  if (!istKappenBuchstabe) return taste;
  const gross = grossFuer(taste, lang);
  if ([...gross].length !== 1) return taste;
  return b.kappenAlleGross && kleinFuer(gross, lang) !== taste && !(b.grossSonderformen[taste] === gross) ? taste : gross;
}

/**
 * ★ G3a-SCHRIFT (25.10.2026): ist `zeichen` (klein oder gross) in dieser Sprache EIN Buchstabe mit eigener Taste, den
 * Unicode trotzdem zerlegt (й, ї, ő, ă, å, ç …)? Siehe {@link SprachBeschreibung.eigeneBuchstabenMitZeichen}.
 */
export function eigenerBuchstabe(zeichen: string, lang: Lang): boolean {
  const k = kleinFuer(zeichen.normalize("NFC"), lang);
  return [...k].length === 1 && sprachBeschreibung(lang).eigeneBuchstabenMitZeichen.includes(k);
}

/**
 * ★ G3a-SCHRIFT (25.10.2026): ein Zeichen in Grundbuchstabe und Zeichen daran zerlegt (NFD) - AUSSER es ist in der
 * Sprache ein eigener Buchstabe ({@link eigenerBuchstabe}): dann bleibt es EIN Teil („й" bleibt „й", „ά" wird α + U+0301).
 * Ohne Sprache die gewöhnliche Zerlegung.
 */
export function zerlegeZeichen(zeichen: string, lang?: Lang): string[] {
  if (lang !== undefined && eigenerBuchstabe(zeichen, lang)) return [zeichen.normalize("NFC")];
  return [...zeichen.normalize("NFD")];
}

/**
 * Schreibt die Zeichen eines Namens nach der Umschrift der Sprache um
 * (Klassencode). Zeichen ohne Eintrag bleiben unverändert.
 */
export function klassencodeUmschreiben(text: string, lang: Lang): string {
  const b = sprachBeschreibung(lang);
  return umschreibenMit(text, b.klassencodeUmschrift, b.klassencodeRegeln);
}

/**
 * ★ G3a-SCHRIFT (25.10.2026): passt die Regel an der Stelle `i` von `z`? Dann die Zahl der Zeichen, die sie nimmt,
 * sonst 0. ⚠️ Der Server rechnet Zeichen für Zeichen gleich (`regelPasst` in `tt_klasse_lib.pb.js`).
 */
function regelPasst(z: readonly string[], i: number, r: UmschriftRegel): number {
  const n = [...r.folge].length;
  if (i + n > z.length) return 0;
  if (z.slice(i, i + n).join("").toLowerCase() !== r.folge) return 0;
  const vor = z[i - 1];
  const nach = z[i + n];
  if (r.wo === "anfang" && vor !== undefined && !WORTGRENZE.test(vor)) return 0;
  if (r.wo === "ende" && nach !== undefined && !WORTGRENZE.test(nach)) return 0;
  if (r.danach !== undefined && (nach === undefined || !r.danach.includes(nach.toLowerCase()))) return 0;
  return n;
}

/**
 * Schreibt `text` mit einer Umschrift-Tabelle um: ★ G2-NEUN (25.10.2026) zuerst ein ZEICHENPAAR (Griechisch „ου",
 * Ukrainisch „зг"), sonst das einzelne Zeichen; ein Zeichen ohne Eintrag bleibt. Für Tabellen ohne Zeichenpaare
 * (de, en, fr, es, it, pl, tr, cs) genau die Rechnung von vorher.
 */
function umschreibenMit(
  text: string,
  tabelle: Readonly<Record<string, string>>,
  regeln: readonly UmschriftRegel[] = [],
): string {
  const z = [...text];
  let aus = "";
  for (let i = 0; i < z.length; i++) {
    // ★ G3a-SCHRIFT (25.10.2026): zuerst die Regeln (Wortanfang, Wortende, Zeichenfolge) - ohne Regeln wie vorher.
    let genommen = 0;
    for (const r of regeln) {
      genommen = regelPasst(z, i, r);
      if (genommen) {
        aus += r.ersatz;
        break;
      }
    }
    if (genommen) {
      i += genommen - 1;
      continue;
    }
    const paar = i + 1 < z.length ? z[i] + z[i + 1] : "";
    if (paar && Object.hasOwn(tabelle, paar)) {
      aus += tabelle[paar];
      i++;
    } else {
      aus += Object.hasOwn(tabelle, z[i]) ? tabelle[z[i]] : z[i];
    }
  }
  return aus;
}

/** Ein Buchstabe in kyrillischer oder griechischer Schrift? */
const FREMDE_SCHRIFT = /[\p{Script=Cyrillic}\p{Script=Greek}]/u;

/**
 * ★ G2-NEUN (25.10.2026): die Umschrift ALLER Sprachen des Registers für Buchstaben in kyrillischer und griechischer
 * Schrift, in EINER Tabelle. Ein Zeichen, das zwei Sprachen verschieden umschreiben (kyrillisch „и": bg „I", uk „Y"),
 * nimmt die SPÄTERE Sprache des Registers - also Ukrainisch. Für Stellen, die die Sprache nicht kennen (Klassencode
 * ohne passende Sprache, Dateiname der Teilnehmerliste): vorher fielen diese Buchstaben ganz weg, jetzt kommt die
 * Umschrift. Lateinische Buchstaben stehen NICHT darin - für sie ändert sich nichts.
 */
export const FREMDSCHRIFT_UMSCHRIFT: Readonly<Record<string, string>> = (() => {
  const t: Record<string, string> = {};
  for (const b of Object.values(SPRACHREGISTER)) {
    for (const [zeichen, ersatz] of Object.entries(b.klassencodeUmschrift)) {
      if (FREMDE_SCHRIFT.test(zeichen)) t[zeichen] = ersatz;
    }
  }
  return Object.freeze(t);
})();

/**
 * ★ G3a-SCHRIFT (25.10.2026): die Regeln für {@link fremdschriftUmschreiben} - je Schrift die der SPÄTEREN Sprache des
 * Registers, wie bei {@link FREMDSCHRIFT_UMSCHRIFT} (kyrillisch: Ukrainisch, griechisch: Griechisch). Die bulgarische
 * Regel „-ия" gilt darum nur mit der Sprache bg. Dieselben Regeln rechnet `synthEmail` (pbBackend.ts).
 */
export const FREMDSCHRIFT_REGELN: readonly UmschriftRegel[] = (() => {
  const jeSchrift = new Map<string, readonly UmschriftRegel[]>();
  for (const b of Object.values(SPRACHREGISTER)) {
    if (b.klassencodeRegeln.some((r) => /\p{Script=Cyrillic}/u.test(r.folge))) jeSchrift.set("kyrillisch", b.klassencodeRegeln);
    if (b.klassencodeRegeln.some((r) => /\p{Script=Greek}/u.test(r.folge))) jeSchrift.set("griechisch", b.klassencodeRegeln);
  }
  return Object.freeze([...jeSchrift.values()].flat());
})();

/** ★ G2-NEUN: kyrillische und griechische Buchstaben mit {@link FREMDSCHRIFT_UMSCHRIFT} umschreiben (der Rest bleibt). */
export function fremdschriftUmschreiben(text: string): string {
  return FREMDE_SCHRIFT.test(text) ? umschreibenMit(text, FREMDSCHRIFT_UMSCHRIFT, FREMDSCHRIFT_REGELN) : text;
}

/** ★ G3a-SCHRIFT: für die Login-Adresse (`synthEmail`) - dieselbe Rechnung mit einer anderen Tabelle. */
export function umschreibenMitRegeln(
  text: string,
  tabelle: Readonly<Record<string, string>>,
  regeln: readonly UmschriftRegel[],
): string {
  return umschreibenMit(text, tabelle, regeln);
}

/** Die vier Sprachen, die vor G2a fertig waren - jede Tabelle MUSS sie tragen. */
type FertigeSprache = "de" | "en" | "fr" | "es";
/** Die vier Sprachen aus G2a - ihr Eintrag ist in einer Tabelle (noch) freiwillig. */
type NeueSprache = "it" | "pl" | "tr" | "cs";
/** ★ G2-NEUN (25.10.2026): die neun Sprachen des Gerüsts vom 25.10.2026 - ihr Eintrag ist ebenso freiwillig. */
export type GeruestSprache = "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";

/** ★ G2-NEUN: die neun Sprachen des Gerüsts als Liste (Reihenfolge wie im Register). */
export const GERUEST_SPRACHEN: readonly GeruestSprache[] = Object.freeze(["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"]);

/** ★ G2-NEUN: eine der neun Sprachen des Gerüsts? */
export function istGeruestSprache(x: unknown): x is GeruestSprache {
  return typeof x === "string" && (GERUEST_SPRACHEN as readonly string[]).includes(x);
}

/** Die vier Sprachen aus G2a als Liste - ★ G2-NEUN: dazu die neun des Gerüsts (alle fallen auf Englisch). */
const NEUE_SPRACHEN: readonly (NeueSprache | GeruestSprache)[] = ["it", "pl", "tr", "cs", ...GERUEST_SPRACHEN];

/**
 * ★ G2a: füllt die Einträge von it, pl, tr, cs, die eine Tabelle noch nicht
 * hat, mit dem ENGLISCHEN Wert - AUSDRÜCKLICH Englisch, nie Deutsch (Bauplan
 * §2.1: „Bis ein Text da ist, fällt eine neue Sprache ausdrücklich auf
 * Englisch zurück"). Für Tabellen mit GROSSEN Werten, wo vier Kopien des
 * englischen Textes die Datei aufblähen würden; kleine Tabellen tragen die
 * Einträge `it: …` usw. ausgeschrieben, beide mit dem Kommentar
 * `RÜCKFALL-EN (G2a)`. Wer eine Sprache übersetzt, schreibt ihren Eintrag in
 * die Tabelle - dann gilt er, und die Marke verschwindet.
 *
 * Gibt eine Tabelle mit allen acht Schlüsseln zurück; die Werte der vier
 * fertigen Sprachen bleiben dieselben Objekte.
 */
export function mitRueckfallEn<V>(
  t: Readonly<Record<FertigeSprache, V>> & Partial<Readonly<Record<NeueSprache | GeruestSprache, V>>>,
): Record<Lang, V> {
  const aus = { ...t } as Record<Lang, V>;
  for (const s of NEUE_SPRACHEN) aus[s] = t[s] ?? t.en;
  return aus;
}

/** Die vier Sprachen, die vor G2a fertig waren (de, en, fr, es). */
export type AltSprache = FertigeSprache;

/**
 * ★ G2a: für Funktionen mit einer Kette `if (fr) … if (es) … if (en) … Deutsch`
 * (und für gemeinsame Teile, die nur de/en/fr/es kennen): eine der vier neuen
 * Sprachen wird AUSDRÜCKLICH zu Englisch - nie zum Deutsch am Ende der Kette
 * (Falle 30). Die vier fertigen Sprachen kommen unverändert zurück.
 *
 * ⚠️ Eine Stelle, die das aufruft, ist eine `RÜCKFALL-EN (G2a)`-Stelle: sie
 * bekommt mit der Sprache einen eigenen Zweig und verliert den Aufruf.
 */
export function altSpracheOderEn(sprache: Lang): AltSprache {
  // ★ G2-NEUN (25.10.2026): ebenso die neun Sprachen des Gerüsts - AUSDRÜCKLICH Englisch, nie Deutsch.
  return sprache === "de" || sprache === "en" || sprache === "fr" || sprache === "es" ? sprache : "en";
}

/** Die vier fertigen Sprachen und Italienisch (seit O-IT, 02.10.2026). */
export type AltSpracheOderIt = AltSprache | "it";

/**
 * ★ O-IT (02.10.2026): wie {@link altSpracheOderEn}, aber Italienisch bleibt
 * Italienisch - für Ketten, die seit der Etappe O einen eigenen `it`-Zweig
 * haben. pl, tr, cs werden weiter AUSDRÜCKLICH zu Englisch (Marke
 * `RÜCKFALL-EN (G2a)` bleibt für sie an der Aufrufstelle).
 */
export function altSpracheItOderEn(sprache: Lang): AltSpracheOderIt {
  // ★ G2-NEUN (25.10.2026): als Kette über die engere Fassung - die neun Sprachen des Gerüsts werden Englisch.
  return sprache === "it" ? "it" : altSpracheOderEn(sprache);
}

/** ★ G2-NEUN (25.10.2026): die acht Sprachen, die vor dem Gerüst vom 25.10.2026 fertig waren. */
export type VorG2NeunSprache = Exclude<Lang, GeruestSprache>;

/**
 * ★ G2-NEUN (25.10.2026): für Tabellen und gemeinsame Teile, die die acht fertigen Sprachen (de … cs) kennen:
 * eine der neun Sprachen des Gerüsts wird AUSDRÜCKLICH Englisch - nie Deutsch. Die acht kommen unverändert zurück.
 * ⚠️ Eine Stelle, die das aufruft, ist eine `RÜCKFALL-EN (G2-NEUN)`-Stelle.
 */
export function geruestAufEn(sprache: Lang): VorG2NeunSprache {
  return istGeruestSprache(sprache) ? "en" : sprache;
}

/** Die vier fertigen Sprachen, Italienisch und Polnisch (seit O-PL, 02.10.2026). */
export type AltSpracheOderItPl = AltSpracheOderIt | "pl";

/**
 * ★ O-PL (02.10.2026): wie {@link altSpracheItOderEn}, aber auch Polnisch bleibt
 * Polnisch - für Ketten, die seit der Etappe O Polnisch einen eigenen `pl`-Zweig
 * haben. tr und cs werden weiter AUSDRÜCKLICH zu Englisch (Marke
 * `RÜCKFALL-EN (G2a)` bleibt für sie an der Aufrufstelle).
 */
export function altSpracheItPlOderEn(sprache: Lang): AltSpracheOderItPl {
  return sprache === "pl" ? "pl" : altSpracheItOderEn(sprache);
}

/** Die vier fertigen Sprachen, Italienisch, Polnisch und Türkisch (seit O-TR, 02.10.2026). */
export type AltSpracheOderItPlTr = AltSpracheOderItPl | "tr";

/**
 * ★ O-TR (02.10.2026): wie {@link altSpracheItPlOderEn}, aber auch Türkisch bleibt
 * Türkisch - für Ketten, die seit der Etappe O Türkisch einen eigenen `tr`-Zweig
 * haben. cs wird weiter AUSDRÜCKLICH zu Englisch (Marke `RÜCKFALL-EN (G2a)`
 * bleibt für cs an der Aufrufstelle).
 */
export function altSpracheItPlTrOderEn(sprache: Lang): AltSpracheOderItPlTr {
  return sprache === "tr" ? "tr" : altSpracheItPlOderEn(sprache);
}
