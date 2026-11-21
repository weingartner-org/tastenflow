/**
 * ★★★ E4 (25.09.2026, Bauplan französischer Lehrgang §3.2, §4.3 Punkte 3/5,
 * §14 E4): OBERFLÄCHENTEXTE RUND UM DIE TOTASTEN.
 *
 * ⚠️ Eigene, kleine Datei statt Einträgen in `bedienSprache/texte.ts` -
 * dieser Auftrag meidet diese Datei ausdrücklich (sie gehört einer
 * PARALLELEN Charge, E11a). Bauart wie überall: `texte({de, en, fr})`, `fr`
 * NEU geschrieben (nicht aus Deutsch/Englisch übertragen).
 */
import { texte } from "../bedienSprache/texte";
import type { BedienSprache } from "../bedienSprache/sprache";
import type { Kombizeichen } from "./totasten";
import { activeLayout, layoutPlattform, zugangFuer } from "./layouts";
import { hinweisPolskaLiteraPl } from "./tastenErklaerungPl";
import { eigenerBuchstabe } from "./sprachRegister";
import type { Lang } from "./account";
import {
  ALTGR_BUCHSTABE_NEUN,
  FESTSTELLTASTE_NEUN,
  TILDE_NEUN,
  TOTASTE_NAME_NEUN,
  TOTASTE_NAME_NEU_NEUN,
  TOTASTE_WARTET_NEUN,
  UMSCHALT_VOR_TILDE_NEUN,
  ZWEI_SCHRITTE_NEUN,
} from "./totastenTexteNeun";

/**
 * Feststelltaste-Hinweis (Bauplan §3.2, §14 E4 Punkt 5): gemessen, dass
 * Feststelltaste auf AZERTY bei `é è ç à` Ziffern statt Grossbuchstaben gibt
 * (BEFUND-2026-09-25-E1-TOTASTEN-WINDOWS.md §2) - sichtbar in der Hilfszeile,
 * Ton wie ein Fehlgriff, in die Live-Region nur bei „Buchstabieren an".
 */
const T_FESTSTELLTASTE = texte({
  de: { hinweis: "Feststelltaste ist an." },
  en: { hinweis: "Caps Lock is on." },
  fr: { hinweis: "Verr. Maj est activé." },
  // ★ ES-O (27.09.2026): Bauplan S13 - „Bloq Mayús".
  es: { hinweis: "Bloq Mayús está activado." },
  // ★ O-IT (02.10.2026): Tastennamen wie auf der italienischen Kappe (Glossar §2.9).
  it: { hinweis: "Bloc Maiusc è attivo." },
  // ★ O-PL (02.10.2026): „Caps Lock" wie auf der Kappe (Glossar §2.9).
  pl: { hinweis: "Caps Lock jest włączony." },
  // ★ O-TR (02.10.2026): „Caps Lock" wie auf der Kappe (Glossar §2.9).
  tr: { hinweis: "Caps Lock açık." },
  // ★ O-CS (03.10.2026): „klávesa Caps Lock" (Glossar §2.9, Regel 11) - nur ein Zustand, kein Fehler (Falle 14).
  cs: { hinweis: "Klávesa Caps Lock je zapnutá." },
  ...FESTSTELLTASTE_NEUN, // ★ O2-TASTATUR (30.10.2026): die neun Sprachen, auch in den Tabellen unten.
});

export function feststelltasteHinweisText(sprache: BedienSprache): string {
  return T_FESTSTELLTASTE[sprache].hinweis;
}

/**
 * ★★★ W2a (28.09.2026, SYNTHESE D-7, Recherche es E8): UMSCHALT VOR DER
 * TILDE-TASTE. Auf der spanischen Tastatur gibt die Taste rechts neben „ñ"
 * ohne Umschalt „´" (á é í ó ú), MIT Umschalt „¨" (ü). Wer die Umschalttaste
 * zu früh drückt - für „Á" liegt das nahe -, bekommt „ä" statt „á". Das ist
 * ein gewöhnlicher Fehlgriff (nicht mehr, nicht weniger); der Hinweis sagt,
 * woran es lag, damit das Kind nicht den Buchstaben sucht.
 *
 * Erkannt wird genau das: erwartet ein Vokal mit Akut, entstanden derselbe
 * Vokal mit Trema (auch gross: „Á" erwartet, „Ä" entstanden).
 */
export function umschaltVorTilde(soll: string, eingegeben: string, sprache?: Lang): boolean {
  // ★ G3a-SCHRIFT (25.10.2026): ein eigener Buchstabe der Sprache (ungarisch „á" auf seiner Taste) entsteht nie über die
  // Akzent-Totaste - dann passt der Hinweis nicht. Ohne Sprache wie bisher.
  if (sprache !== undefined && eigenerBuchstabe(soll, sprache)) return false;
  const s = soll.normalize("NFD");
  const e = eingegeben.normalize("NFD");
  return (
    s.length === 2 && e.length === 2 &&
    s[1] === "\u0301" && e[1] === "\u0308" &&
    s[0] === e[0] && /[aeiouAEIOU]/.test(s[0])
  );
}

/** Der Hinweis dazu - in der Bedienungssprache, je Sprache eigens geschrieben. */
const T_UMSCHALT_VOR_TILDE = texte({
  // Auf Deutsch heisst „~" Tilde - darum hier die „Akzenttaste ´".
  de: { hinweis: "Zuerst die Akzenttaste ´ ohne Umschalttaste, danach den Buchstaben." },
  en: { hinweis: "Accent key ´ first, without Shift - then the letter." },
  fr: { hinweis: "D'abord la touche d'accent ´ sans Maj, ensuite la lettre." },
  // Spanisch: „tilde" ist der Akzentstrich (RAE), die Taste heisst so.
  es: { hinweis: "Primero la tecla de la tilde sin Mayús; después, la letra." },
  it: { hinweis: "Prima il tasto dell'accento ´ senza Maiusc, poi la lettera." },
  pl: { hinweis: "Najpierw klawisz akcentu ´ bez klawisza Shift, potem litera." },
  // ★ O-TR (02.10.2026): die Endung an „tuş" und „harf", nie an „´" (Glossar Regel 6).
  tr: { hinweis: "Önce Shift tuşuna basmadan ´ aksan tuşuna bas, sonra harfe." },
  // ★ O-CS (03.10.2026): auf der tschechischen Tastatur gibt dieselbe Taste mit Shift den Háček - „čárka nad
  // písmenem", nie „čárka" allein (Glossar §4 Falle 2), Shift mit „klávesa" davor (Regel 11).
  cs: { hinweis: "Nejdřív stiskni klávesu ´ (čárka nad písmenem) bez klávesy Shift, potom písmeno." },
  ...UMSCHALT_VOR_TILDE_NEUN,
});

export function umschaltVorTildeText(sprache: BedienSprache): string {
  return T_UMSCHALT_VOR_TILDE[sprache].hinweis;
}

/**
 * Name der Totaste selbst, für die Ansage der nächsten Taste (Bauplan §4.3
 * Punkt 4: „accent circonflexe, puis e" auf Französisch, „Zirkumflex, dann
 * e" / „circumflex, then e"). `¨` heisst je nach Sprache anders
 * (Trema/tréma/diaeresis).
 *
 * ★ E9a-2 (26.09.2026): „`" (Gravis, ch-fr/ca-fr) und „¸" (Cedille, ca-fr)
 * dazu - siehe `totasten.ts` `KOMBIZEICHEN`.
 * ★ F3-cs (02.10.2026): `ˇ` (Háček, Caron) der tschechischen Tastatur - nur neue Schlüssel, kein bestehender ändert sich.
 * ★ ES-P7a-Behebung (27.09.2026, M1): die Tilde-Taste „´" des spanischen
 * Lehrgangs (á é í ó ú, `layouts.ts` `hatLehrgangsTotasten`) heisst nur auf
 * Spanisch „tilde" - über `TOTASTE_NAME_ZUSATZ` unten; de/en/fr unverändert.
 */
const T_TOTASTE_NAME = texte({
  de: { "^": "Zirkumflex", "¨": "Trema", "`": "Gravis", "¸": "Cedille", "ˇ": "Hatschek" },
  en: { "^": "circumflex", "¨": "diaeresis", "`": "grave accent", "¸": "cedilla", "ˇ": "caron" },
  fr: { "^": "accent circonflexe", "¨": "tréma", "`": "accent grave", "¸": "cédille", "ˇ": "caron" },
  // „´" (Tilde-Taste) nur für es - siehe TOTASTE_NAME_ZUSATZ unten; de/en/fr bleiben
  // Zeichen für Zeichen wie vorher (Merge ES-O + ES-P7a-Behebung, 27.09.).
  es: { "^": "acento circunflejo", "¨": "diéresis", "`": "acento grave", "¸": "cedilla", "ˇ": "caron" },
  it: { "^": "accento circonflesso", "¨": "dieresi", "`": "accento grave", "¸": "cediglia", "ˇ": "caron" },
  // ★ O-PL (02.10.2026): dieselben Namen wie `SPOKEN_PL` (Glossar §2.8: daszek, akcent).
  pl: { "^": "daszek", "¨": "umlaut", "`": "akcent", "¸": "cedylla", "ˇ": "haczek" },
  // ★ O-TR (02.10.2026): dieselben Namen wie `SPOKEN_TR` (Glossar §2.8: şapka, ters kesme).
  tr: { "^": "şapka", "¨": "umlaut", "`": "ters kesme", "¸": "çengel", "ˇ": "ters şapka" },
  // ★ O-CS (03.10.2026): dieselben Namen wie `SPOKEN_CS` (Glossar §2.8: háček, dvě tečky, stříška).
  cs: { "^": "stříška", "¨": "dvě tečky", "`": "obrácený apostrof", "¸": "ocásek", "ˇ": "háček" },
  ...TOTASTE_NAME_NEUN,
});

/**
 * ★ ES-O (27.09.2026): die spanische Tilde-Taste „´" (Lernweg „es", `totasten.ts`
 * á é í ó ú) hat in der Tabelle oben keinen Schlüssel - ohne diesen Zusatz
 * hiesse sie in der Ansage nur „´". Bewusst NUR für „es": de/en/fr bleiben
 * Zeichen für Zeichen wie vorher (dort nennt die Ansage weiter das Zeichen).
 */
const TOTASTE_NAME_ZUSATZ: Partial<Record<BedienSprache, Record<string, string>>> = {
  es: { "´": "tilde" },
  // ★ O-IT (02.10.2026): „´" ist auf den Schweizer Tastaturen (Tessin) eine Totaste.
  it: { "´": "accento acuto" },
  // ★ O-PL (02.10.2026): „´" auf Tastaturen anderer Länder (Glossar §2.1 „klawisz martwy").
  pl: { "´": "akcent ostry" },
  // ★ O-TR (02.10.2026): „´" auf Tastaturen anderer Länder (`SPOKEN_TR`).
  tr: { "´": "akut aksan" },
  // ★ O-CS (03.10.2026): „´" ist auf der tschechischen Tastatur die Čárka-Totaste (ó und die grossen Á É Í Ú Ý) -
  // „čárka nad písmenem", nie „čárka" allein (Glossar §4 Falle 2); dazu der Kroužek (Umschalt + Taste links der 1).
  cs: { "´": "čárka nad písmenem", "°": "kroužek" },
  // ★ O2-TASTATUR (30.10.2026): die Akzent-Totaste „´" der Tastaturen pt, br, sv, nl und fremder im selben Weg.
  bg: { "´": "остро ударение" },
  el: { "´": "οξεία" },
  hu: { "´": "éles ékezet" },
  nl: { "´": "accent aigu" },
  pt: { "´": "acento agudo", "~": "til" },
  br: { "´": "acento agudo", "~": "til" },
  ro: { "´": "accent ascuțit" },
  sv: { "´": "akut accent" },
  uk: { "´": "акут" },
};

/**
 * ★★★ G3a-SCHRIFT (25.10.2026): die Namen der Totasten der neun Sprachen des Gerüsts - nur Zeichen, die KEINE Tastatur
 * der acht Sprachen davor als Totaste führt (darum ändert sich dort keine Ansage). Deutsch, Englisch und (★ O2-TASTATUR, 30.10.2026)
 * die neun Sprachen selbst; it, pl, tr, cs, fr, es lesen weiter Englisch.
 * ⚠️ `~` (Tilde, pt/br ã õ) steht NICHT hier: sie ist auf vier bestehenden Tastaturen schon Totaste, ein Name änderte
 * dort die Ansage (`totasteWartetText` nennt sie über `T_TILDE` schon beim Namen).
 */
const T_TOTASTE_NAME_NEU = texte({
  de: {
    "΄": "Tonos", "΅": "Dialytika mit Tonos", "'": "Akut-Taste Apostroph", "\"": "Trema-Taste Anführungszeichen",
    "˘": "Breve", "˝": "Doppelakut", "˛": "Ogonek", "˙": "Punkt darüber",
  },
  en: {
    "΄": "tonos", "΅": "dialytika tonos", "'": "apostrophe accent key", "\"": "quotation mark diaeresis key",
    "˘": "breve", "˝": "double acute", "˛": "ogonek", "˙": "dot above",
  },
  ...TOTASTE_NAME_NEU_NEUN,
});

/** ★ G3a-SCHRIFT: alle Totasten-Namen einer Bedienung - die bisherigen gewinnen (keine Ansage ändert sich). */
function totastenNamen(sprache: BedienSprache): Record<string, string> {
  return {
    ...T_TOTASTE_NAME_NEU[sprache],
    ...T_TOTASTE_NAME[sprache],
    ...(TOTASTE_NAME_ZUSATZ[sprache] ?? {}),
  };
}

/**
 * Die ZWEI-SCHRITTE-Ansage für ein zusammengesetztes Zeichen (Bauplan §4.3
 * Punkt 4): „<Totaste>, dann <Grundbuchstabe>" - die Hilfszeile und die
 * Bildschirm-Tastatur zeigen dieselben zwei Schritte (erst die Totaste,
 * nach ihrem Anschlag den Vokal).
 */
/**
 * ★ E11a-5 (26.09.2026): die zwei Schritte als TABELLE statt der Kette
 * `if (sprache === "fr") … if (sprache === "en") … sonst Deutsch` - eine
 * vierte Sprache fiele sonst still auf Deutsch (Leitfaden, Falle 30); jetzt
 * meldet `tsc` die fehlende Fassung.
 */
const T_ZWEI_SCHRITTE = texte({
  de: { satz: (totName: string, dann: string) => `${totName}, dann ${dann}` },
  en: { satz: (totName: string, dann: string) => `${totName}, then ${dann}` },
  fr: { satz: (totName: string, dann: string) => `${totName}, puis ${dann}` },
  es: { satz: (totName: string, dann: string) => `${totName}, después ${dann}` },
  it: { satz: (totName: string, dann: string) => `${totName}, poi ${dann}` },
  pl: { satz: (totName: string, dann: string) => `${totName}, potem ${dann}` },
  tr: { satz: (totName: string, dann: string) => `${totName}, sonra ${dann}` }, // ★ O-TR (02.10.2026)
  cs: { satz: (totName: string, dann: string) => `${totName}, potom ${dann}` }, // ★ O-CS (03.10.2026)
  ...ZWEI_SCHRITTE_NEUN,
});

/** Name einer Totaste in der Bedienungssprache - `null`, wenn es keinen gibt. */
export function totasteName(tot: string, sprache: BedienSprache): string | null {
  const namen = totastenNamen(sprache);
  return namen[tot] ?? null;
}

/**
 * ★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8 Punkt 2, Anhang
 * C): der WARTEZUSTAND einer Totaste, für Kinder, die nicht sehen. Gemessen:
 * Windows und NVDA sagen beim Drücken einer Totaste NICHTS - wer blind
 * schreibt, weiss sonst nicht, ob sie angekommen ist. „Zirkumflex wartet" in
 * der Bedienungssprache. Kennt das Modell die Taste nicht (`tot` = `null`),
 * heisst sie einfach „Akzent".
 *
 * ⚠️ „´" heisst hier auf Deutsch „Akut" (nicht „Akzent" wie im Tastennamen
 * `charLabel`): „Akzent wartet" wäre für ´ und für eine unbekannte Totaste
 * dasselbe Wort.
 */
const T_TOTASTE_WARTET = texte({
  de: {
    akut: "Akut",
    unbekannt: "Akzent",
    satz: (name: string) => `${name} wartet`,
  },
  en: {
    akut: "acute accent",
    unbekannt: "accent",
    satz: (name: string) => `${name} waiting`,
  },
  fr: {
    akut: "accent aigu",
    unbekannt: "accent",
    satz: (name: string) => `${name} en attente`,
  },
  es: {
    akut: "tilde",
    unbekannt: "acento",
    satz: (name: string) => `${name} en espera`,
  },
  it: {
    akut: "accento acuto",
    unbekannt: "accento",
    satz: (name: string) => `${name} in attesa`,
  },
  // ★ O-PL (02.10.2026): der Name als Subjekt im Nominativ - „tylda czeka".
  pl: {
    akut: "akcent ostry",
    unbekannt: "akcent",
    satz: (name: string) => `${name} czeka`,
  },
  // ★ O-TR (02.10.2026): der Name als Subjekt, ohne Endung - „şapka bekliyor".
  tr: {
    akut: "akut aksan",
    unbekannt: "aksan",
    satz: (name: string) => `${name} bekliyor`,
  },
  // ★ O-CS (03.10.2026): der Name als Subjekt im Nominativ, das Verb im Präsens - „háček čeká".
  cs: {
    akut: "čárka nad písmenem",
    unbekannt: "znaménko",
    satz: (name: string) => `${name} čeká`,
  },
  ...TOTASTE_WARTET_NEUN,
});

/** Zusätzliche Totasten-Namen nur für die Wartezustand-Ansage (Tilde `~`). */
const T_TILDE = texte({
  de: { name: "Tilde" },
  en: { name: "tilde" },
  fr: { name: "tilde" },
  es: { name: "virgulilla" },
  it: { name: "tilde" }, // ★ O-IT: italienisch ebenfalls „tilde".
  pl: { name: "tylda" }, // ★ O-PL: auf „Polski (programisty)" die einzige Totaste (R1 §2.2).
  tr: { name: "tilde işareti" }, // ★ O-TR: wie „soru işareti" - „tilde bekliyor" allein ist kein Satz (Glossar §2.8).
  cs: { name: "vlnovka" }, // ★ O-CS: wie `SPOKEN_CS` (Glossar §2.8).
  ...TILDE_NEUN,
});

export function totasteWartetText(tot: string | null, sprache: BedienSprache): string {
  const t = T_TOTASTE_WARTET[sprache];
  let name: string | null = null;
  if (tot === "´") name = TOTASTE_NAME_ZUSATZ[sprache]?.["´"] ?? t.akut;
  else if (tot === "~") name = T_TILDE[sprache].name;
  else if (tot !== null) name = totasteName(tot, sprache);
  return t.satz(name ?? t.unbekannt);
}

export function totasteAnsage(k: Kombizeichen, sprache: BedienSprache): string {
  const namen = totastenNamen(sprache);
  const totName = namen[k.tot] ?? k.tot;
  return T_ZWEI_SCHRITTE[sprache].satz(totName, k.dann);
}

/**
 * ★★★ F8-pl (03.10.2026, Glossar `GLOSSAR-pl.md` §3 Falle 1, R0 P12): „a" für „ą" ist ein FEHLER, kein Ersatz - aber die
 * Rückmeldung nennt den WEG („prawy Alt + A"), nie „Źle!". Ein polnisches Kind, das ą, ę, ł … nicht gefunden hat, schreibt den
 * Grundbuchstaben; ohne diesen Hinweis bliebe ihm der Fehler stumm. Erkannt wird genau das: erwartet ein polnischer Buchstabe,
 * eingegeben dessen Grundbuchstabe (bei `ź` auch `z`: es liegt auf der Taste X, ein Kind schreibt aber das Z mit Strich).
 * Die Texte dazu stehen für Polnisch in `tastenErklaerungPl.ts` (`hinweisPolskaLiteraPl`, seit O-PL), hier die Fassung je
 * Bedienungssprache - dieselbe Bauart wie der Hinweis zur Tilde-Taste oben (`umschaltVorTilde`).
 */
const OHNE_OGONEK: Readonly<Record<string, readonly string[]>> = {
  ą: ["a"], ć: ["c"], ę: ["e"], ł: ["l"], ń: ["n"], ó: ["o"], ś: ["s"], ź: ["z", "x"], ż: ["z"],
};

/** Erwartet ein polnischer Buchstabe, eingegeben sein Grundbuchstabe (gross oder klein)? */
export function polnischerBuchstabeOhneOgonek(soll: string, eingegeben: string): boolean {
  const grund = OHNE_OGONEK[soll.toLowerCase()];
  return grund !== undefined && grund.includes(eingegeben.toLowerCase());
}

/** Der Hinweis zum Weg eines AltGr-Buchstabens: Name der Zusatztaste (Windows: AltGr, Mac: Option) und die Taste, je Sprache. */
const T_ALTGR_BUCHSTABE = texte({
  de: { hinweis: (zeichen: string, alt: string, taste: string) => `Buchstabe ${zeichen}: ${alt} + ${taste}.`, alt: "rechte Alt-Taste (AltGr)", option: "Optionstaste", shift: "Umschalttaste" },
  en: { hinweis: (zeichen: string, alt: string, taste: string) => `Letter ${zeichen}: ${alt} + ${taste}.`, alt: "right Alt (AltGr)", option: "Option key", shift: "Shift" },
  fr: { hinweis: (zeichen: string, alt: string, taste: string) => `Lettre ${zeichen} : ${alt} + ${taste}.`, alt: "Alt droite (AltGr)", option: "touche Option", shift: "Maj" },
  es: { hinweis: (zeichen: string, alt: string, taste: string) => `Letra ${zeichen}: ${alt} + ${taste}.`, alt: "Alt derecha (AltGr)", option: "tecla Opción", shift: "Mayús" },
  it: { hinweis: (zeichen: string, alt: string, taste: string) => `Lettera ${zeichen}: ${alt} + ${taste}.`, alt: "Alt destro (AltGr)", option: "tasto Opzione", shift: "Maiusc" },
  // Polnisch: der Satz steht in `hinweisPolskaLiteraPl` (O-PL), diese Zeile wird dort nicht gebraucht - sie hält die Tabelle vollständig.
  pl: { hinweis: (zeichen: string, alt: string, taste: string) => `Litera ${zeichen}: ${alt} + ${taste}.`, alt: "prawy Alt", option: "Option", shift: "Shift" },
  tr: { hinweis: (zeichen: string, alt: string, taste: string) => `${zeichen} harfi: ${alt} + ${taste}.`, alt: "sağ Alt (AltGr)", option: "Option tuşu", shift: "Shift" },
  // Tschechisch: Tastennamen englisch wie auf der Kappe, „klávesa" davor (Glossar §4, Namen bleiben ungebeugt).
  cs: { hinweis: (zeichen: string, alt: string, taste: string) => `Písmeno ${zeichen}: ${alt} + klávesa ${taste}.`, alt: "pravý Alt (AltGr)", option: "klávesa Option", shift: "Shift" },
  ...ALTGR_BUCHSTABE_NEUN,
});

/**
 * Der Hinweis „Buchstabe ą: rechte Alt-Taste (AltGr) + A." - oder `null`, wenn es nicht genau diese Verwechslung ist, oder wenn
 * die EINGESTELLTE Tastatur den Buchstaben nicht über AltGr/Option liefert (der Hinweis folgt der Eigenschaft `buchstabe` an der
 * Tastatur, nicht dem Namen des Weges - Falle 50). Auf dem Mac heisst die Zusatztaste Option.
 */
export function polnischerBuchstabeHinweis(sprache: BedienSprache, soll: string, eingegeben: string): string | null {
  if (!polnischerBuchstabeOhneOgonek(soll, eingegeben)) return null;
  const zugang = zugangFuer(activeLayout(), soll);
  if (!zugang?.buchstabe) return null;
  const mac = layoutPlattform() === "mac";
  if (sprache === "pl") return hinweisPolskaLiteraPl(soll, mac ? "macos" : "windows");
  const t = T_ALTGR_BUCHSTABE[sprache];
  const alt = mac ? t.option : t.alt;
  const taste = zugang.base.toUpperCase();
  return t.hinweis(soll, zugang.mitUmschalt ? `${alt} + ${t.shift}` : alt, taste);
}
