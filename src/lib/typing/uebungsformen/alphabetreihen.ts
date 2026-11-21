/**
 * Übungsform „Alphabet-Reihen".
 *
 * Herkunft: eine der Übungsformen aus Testerin Mail (Kollegin, dieselbe
 * Zielgruppe), am 01.09.2026 mit Johannes durchgesprochen
 * (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md` §2, Punkt 2). Reine
 * ERZEUGUNG, kein Inhalt nötig: Der Buchstabenvorrat läuft alphabetisch durch
 * genau das, was ein Kind schon freigeschaltet hat, in fünf Anordnungen
 * (Muster a-e unten). Warum das übt: Zehnfingerschreiben ist am Ende
 * Bewegungsautomatik zwischen benachbarten Tasten - Alphabet-Reihen liefern
 * diese Übergänge dicht und ohne den Umweg über ein Wort, das „passen" muss.
 *
 * ★ Die Grundregel aus dem Auftrag: „Immer mindestens zweimal hintereinander,
 * damit sich die Lücken verschieben." Jede Zeile besteht bereits aus zwei
 * Gruppen (das IST das „zweimal"); zusätzlich wird, wenn ein Muster gewählt
 * wird, immer gleich ein ZWEITES Vorkommen desselben Musters direkt danach
 * gebaut - mit fortlaufendem Alphabet-Cursor, also verschobenem Startbuchstaben
 * ("abc def" gefolgt von "ghi jkl", nie zweimal dasselbe). Jedes Muster trägt
 * seinen eigenen Cursor über die ganze Runde weiter, damit auch ein drittes
 * oder viertes Vorkommen desselben Musters nie eine bereits gezeigte Gruppe
 * wiederholt.
 *
 * ★ Entscheidungen, die im Auftrag offen waren (hier getroffen):
 *  • Alphabetische Reihenfolge inkl. Umlaute/ß: a-z, danach ä ö ü ß - dieselbe
 *    Reihenfolge, in der `letters.ts` (`LETTER_ORDER`) sie ans Ende der
 *    Einführung stellt. Eine „echte" deutsche Wörterbuch-Sortierung (ä wie ae
 *    einsortiert) wäre für eine reine Tastenübung kein Gewinn und bräuchte
 *    eine eigene Zusatzregel ohne Nutzen.
 *  • Muster c (wechselnde Groß-/Kleinschreibung) startet JE ZEILE wieder mit
 *    Großbuchstabe (nicht fortlaufend über mehrere Zeilen alternierend) - so
 *    bleibt jede einzelne Zeile für sich lesbar/ansagbar, ohne dass die
 *    Groß-Klein-Folge von der vorherigen Zeile abhängt.
 *  • Jede Gruppe hat zwei Wiederholungen je Zeile (wie in allen Beispielen des
 *    Auftrags: „abc def" usw.) - eine dritte Gruppe pro Zeile stand nirgends
 *    im Auftrag und hätte die Zeilen ohne Not verlängert.
 *  • ß wird an Großbuchstaben-Positionen NIE großgeschrieben: JavaScripts
 *    `"ß".toUpperCase()` liefert „SS" (zwei Zeichen statt einer Taste), und
 *    für ein großes ß gibt es auf dieser Tastatur ohnehin keinen Tastenweg.
 *
 * ★ E6a (24.09.2026, Bauplan §6.3): Das gilt alles nur für Weg „de". Weg „en"
 * hat ein eigenes, kürzeres Alphabet OHNE ä ö ü ß ({@link ALPHABET_ORDER_EN}) -
 * das englische Alphabet kennt sie nicht.
 */
import type { RoundLine } from "../generator";
import { fitText } from "../corpus";
import { grossFuer } from "../sprachRegister";
import type { Lang } from "../account";
import type { FormKontext, FormRunde, Uebungsform } from "./typen";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";
import { FORM_NAMEN } from "./namen";
import type { Lernweg } from "../lernweg";
// ★ G3c-VERTEILER (25.10.2026): das Alphabet der neun Gerüst-Wege (`alphabet<Xx>.ts`) - leer ⇒ das englische.
import { ALPHABET_ORDER_BG } from "./alphabetBg";
import { ALPHABET_ORDER_EL } from "./alphabetEl";
import { ALPHABET_ORDER_HU } from "./alphabetHu";
import { ALPHABET_ORDER_NL } from "./alphabetNl";
import { ALPHABET_ORDER_PT } from "./alphabetPt";
import { ALPHABET_ORDER_BR } from "./alphabetBr";
import { ALPHABET_ORDER_RO } from "./alphabetRo";
import { ALPHABET_ORDER_SV } from "./alphabetSv";
import { ALPHABET_ORDER_UK } from "./alphabetUk";
import { eigenOderEn } from "../geruestRueckfall";

/** Alphabetische Reihenfolge inkl. Umlaute/ß - siehe Kopf-Kommentar. Nur Weg „de". */
const ALPHABET_ORDER_DE = "abcdefghijklmnopqrstuvwxyzäöüß".split("");

/**
 * ★ E6a (24.09.2026, Bauplan §6.3): Weg „en" kennt kein ä ö ü ß im Alphabet -
 * das englische Alphabet hat 26 Buchstaben. Ohne diese eigene Liste würde ein
 * Kind auf Weg „en" mit deutscher Tastatur (dort ersetzt die 8. Grundtaste
 * „;" durch „ö", siehe `lernweg.ts`) ein „ö" ans Ende seiner Alphabet-Reihe
 * gehängt bekommen - ein Zeichen, das dort ein Fingeranker ist, kein
 * Alphabet-Buchstabe.
 */
const ALPHABET_ORDER_EN = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * ★ E10a (25.09.2026, Bauplan §8.1): das französische Alphabet hat wie das
 * englische 26 Buchstaben, a bis z - „Akzente gehören nicht zum Alphabet"
 * (Auftrag E10a Punkt 3): é è à ç ù ê î ô û ë ï werden beim Üben zu ihrem
 * Grundbuchstaben (e/e/a/c/u/e/i/o/u/e/i), genau wie ß auf Weg „de" NICHT
 * zwischen s und t einsortiert wird, sondern eine eigene Zusatztaste bleibt.
 */
const ALPHABET_ORDER_FR = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * ★ ES-W (27.09.2026): das spanische Abecedario (RAE 2010) hat 27 Buchstaben
 * - die ñ ist ein EIGENER Buchstabe und steht zwischen n und o. Akzente
 * gehören wie im Französischen nicht dazu (á é í ó ú ü sind Vokale mit
 * Zeichen, keine eigenen Buchstaben).
 */
const ALPHABET_ORDER_ES = "abcdefghijklmnñopqrstuvwxyz".split("");

/**
 * ★ IT-W (03.10.2026): das italienische Alfabeto hat 21 Buchstaben (`a b c d e f g h i l m n o p q r s t u v z`),
 * dazu fünf „lettere straniere" `j k w x y` (Recherche `tastaturen-und-zeichen.md` §1.1). Die Reihen laufen trotzdem
 * durch alle 26, und zwar an ihrem Platz im lateinischen Alphabet - so wie sie im Wörterbuch einsortiert sind
 * (*jeans* zwischen *iz…* und *la…*). Grund: Die Form übt die ÜBERGÄNGE zwischen benachbarten Tasten, und `j k` sind
 * auf Weg „it" Grundreihen-Tasten (Nr. 2 und 4) - ohne sie hätte ein Kind nach der Grundreihe nur `a d f l s` und
 * bekäme die Form erst mit dem `i` (Nr. 9) angeboten; `j` und `k` kämen in keiner einzigen Reihe vor. Akzente gehören
 * wie im Französischen und Spanischen nicht dazu (`à è é ì ò ù` sind Vokale mit Zeichen, keine eigenen Buchstaben).
 * Die Reihenfolge ist damit dieselbe wie im Englischen und Französischen - ausdrücklich, nicht als Rückfall.
 */
const ALPHABET_ORDER_IT = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * ★ PL-W (09.10.2026): das polnische Alfabet hat 32 Buchstaben - die neun mit Ogonek, Kreska, Kropka oder Strich (`ą ć ę
 * ł ń ó ś ź ż`) sind EIGENE Buchstaben und stehen gleich hinter ihrem Grundbuchstaben (a ą b c ć d e ę … z ź ż; Glossar
 * §3 Nr. 10: „sie gehören zum Alphabet", Nr. 11: Sortierung wie `localeCompare(…, "pl")`). Anders als die Akzente im
 * Französischen, Spanischen und Italienischen gehören sie darum IN die Reihen. `q v x` kommen nur in Fremdwörtern vor und
 * stehen an ihrem lateinischen Platz (so sortiert jedes polnische Wörterbuch; `x` ist auf `pl` die Taste von `ź`).
 * Die Reihen nehmen nur, was freigeschaltet ist: vor `ą` (Nr. 30 auf Weg „pl") läuft `a b c`, danach `a ą b`. Grosse
 * polnische Buchstaben (Dreiergriff) prüft `fitText` wie jeden anderen - ein Paar, das ihn noch nicht besteht, wird
 * nicht gebaut (Wächter `tests/tastenflow-wortspiele-pl.test.ts`).
 */
const ALPHABET_ORDER_PL = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż".split("");

/**
 * ★ TR-W (09.10.2026): das türkische Alfabe hat 29 Buchstaben (TDK) - `ç ğ ı ö ş ü` sind EIGENE Buchstaben und stehen gleich
 * hinter ihrem Grundbuchstaben (a b c ç d e f g ğ h ı i j …, Glossar §1 Nr. 9: `ı` VOR `i`, wie `localeCompare(…, "tr")`).
 * `q w x` gehören NICHT zum Alfabe - anders als im Polnischen, wo jedes Wörterbuch sie an ihrem lateinischen Platz führt: ein
 * türkisches Kind lernt 29 Buchstaben, und „q r s" oder „v w x" wäre eine Reihe, die es so nie gehört hat. (Auf Weg „tr" kommen
 * `w x q` ohnehin als letzte Buchstaben, Platz 32-34.) `â î û` sind keine eigenen Buchstaben (Zirkumflex über die Totaste).
 * Grossbuchstaben über `grossFuer(…, "tr")` (wie schon seit G2b-1): aus `i` wird `İ`, aus `ı` wird `I` - die Gruppe „ıij" heisst
 * gross-klein-gross „IiJ", nie „Iij" mit falschem Punkt.
 * Die Reihen nehmen nur, was freigeschaltet ist: vor `ı` (Nr. 15 auf Weg „tr") läuft `h i j`, danach `h ı i`.
 */
const ALPHABET_ORDER_TR = "abcçdefgğhıijklmnoöprsştuüvyz".split("");

/**
 * ★ CS-W (09.10.2026): die tschechische Abeceda, so wie sie SORTIERT (ČSN 97 6030; gemessen: `Intl.Collator("cs")` ordnet
 * genau so, Wächter `tests/tastenflow-wortspiele-cs.test.ts`): `č ř š ž` sind eigene Buchstaben hinter ihrem Grundbuchstaben,
 * und **`ch` ist ein eigener Buchstabe hinter `h`** - „h, ch, i" lernt jedes Kind in der ersten Klasse; eine Reihe „fgh ijk"
 * fiele ihm als Lücke auf, genau wie Johannes' „man erwartet ein m … und es geht von vorne los" (20.09.). `ch` wird mit zwei
 * Tasten geschrieben (c, h) und gross als `Ch` (wie am Satzanfang: *Chleba*), nie `CH`. Die Vokale mit Čárka/Kroužek
 * (`á é í ó ú ů ý`) und `ď ť ň` sortieren dagegen wie ihr Grundbuchstabe - sie gehören, wie die Akzente im Französischen, nicht
 * in die Reihe (`ů` hätte ohnehin kein `Ů`, `ď ť ň ó` laufen über eine Totaste). `q w x` stehen an ihrem lateinischen Platz.
 */
const ALPHABET_ORDER_CS = ["a", "b", "c", "č", "d", "e", "f", "g", "h", "ch", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "ř", "s", "š", "t", "u", "v", "w", "x", "y", "z", "ž"];

/**
 * ★ E10a (25.09.2026, Bauplan §8.1 Punkt 3): eine WEG-TABELLE statt einer
 * (weiteren) verschachtelten Bedingung - der Weichen-Zähler
 * (`tests/tastenflow-sprach-weichen.test.ts`) darf nicht steigen, und eine
 * dritte, verschachtelte Fassung wäre genau die neue stille Weiche, vor der
 * der Bauplan warnt (Falle 1). TypeScript verlangt hier von selbst alle drei
 * Schlüssel - eine vergessene Sprache fiele beim Bauen auf, nicht erst zur
 * Laufzeit.
 */
// ★ ES-W (27.09.2026): „es" hat sein Abecedario (siehe
// {@link ALPHABET_ORDER_ES}) - vorher LEER (ES-F2), die Form wurde nicht
// angeboten.
const ALPHABET_ORDER_BY_LERNWEG: Record<Lernweg, string[]> = {
  de: ALPHABET_ORDER_DE,
  en: ALPHABET_ORDER_EN,
  fr: ALPHABET_ORDER_FR,
  es: ALPHABET_ORDER_ES,
  // ★ IT-W (03.10.2026): „it" hat sein Alfabeto (siehe {@link ALPHABET_ORDER_IT}).
  it: ALPHABET_ORDER_IT,
  // ★ PL-W (09.10.2026): „pl" hat sein Alfabet mit den neun polnischen Buchstaben (siehe {@link ALPHABET_ORDER_PL}).
  pl: ALPHABET_ORDER_PL,
  // ★ TR-W (09.10.2026): „tr" hat sein Alfabe mit 29 Buchstaben, ohne q w x (siehe {@link ALPHABET_ORDER_TR}).
  tr: ALPHABET_ORDER_TR,
  // ★ CS-W (09.10.2026): „cs" hat seine Abeceda mit `č ř š ž` und `ch` (siehe {@link ALPHABET_ORDER_CS}).
  cs: ALPHABET_ORDER_CS,
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  // ★ G3c-VERTEILER (25.10.2026): jede liest schon ihre eigene Datei (`alphabet<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  bg: eigenOderEn(ALPHABET_ORDER_BG, ALPHABET_ORDER_EN),
  el: eigenOderEn(ALPHABET_ORDER_EL, ALPHABET_ORDER_EN),
  hu: eigenOderEn(ALPHABET_ORDER_HU, ALPHABET_ORDER_EN),
  nl: eigenOderEn(ALPHABET_ORDER_NL, ALPHABET_ORDER_EN),
  pt: eigenOderEn(ALPHABET_ORDER_PT, ALPHABET_ORDER_EN),
  br: eigenOderEn(ALPHABET_ORDER_BR, ALPHABET_ORDER_EN),
  ro: eigenOderEn(ALPHABET_ORDER_RO, ALPHABET_ORDER_EN),
  sv: eigenOderEn(ALPHABET_ORDER_SV, ALPHABET_ORDER_EN),
  uk: eigenOderEn(ALPHABET_ORDER_UK, ALPHABET_ORDER_EN),
};

/** Die alphabetische Reihenfolge DES LERNWEGS. */
function alphabetOrderFuer(lernweg: FormKontext["lernweg"]): string[] {
  return ALPHABET_ORDER_BY_LERNWEG[lernweg];
}

/** Wie eine einzelne Gruppe innerhalb der Zeile aussieht. */
type Muster = {
  /** Buchstaben je Gruppe. */
  groupSize: number;
  /** Braucht die echte Umschalttaste (Großbuchstaben müssen ERKENNBAR groß sein). */
  brauchtShift: boolean;
  /** Braucht den gelernten Punkt. */
  brauchtPunkt: boolean;
  /** Wie ein Buchstabe an Position `posInGroup` einer Gruppe geschrieben wird. */
  casing: (posInGroup: number) => "gross" | "klein";
  /** Punkt direkt hinter jeder Gruppe? */
  punktHinterGruppe: boolean;
};

/** (a) Dreiergruppen klein: „abc def". */
const MUSTER_DREIER_KLEIN: Muster = {
  groupSize: 3,
  brauchtShift: false,
  brauchtPunkt: false,
  casing: () => "klein",
  punktHinterGruppe: false,
};

/** (b) Dreiergruppen, erster Buchstabe der Gruppe groß: „Abc Def". */
const MUSTER_DREIER_ANFANG_GROSS: Muster = {
  groupSize: 3,
  brauchtShift: true,
  brauchtPunkt: false,
  casing: (pos) => (pos === 0 ? "gross" : "klein"),
  punktHinterGruppe: false,
};

/** (c) Dreiergruppen, wechselnde Groß-/Kleinschreibung: „AbC dEf". */
const MUSTER_DREIER_WECHSELND: Muster = {
  groupSize: 3,
  brauchtShift: true,
  brauchtPunkt: false,
  casing: (pos) => (pos % 2 === 0 ? "gross" : "klein"),
  punktHinterGruppe: false,
};

/** (d) Vierergruppen klein: „abcd efgh". */
const MUSTER_VIERER_KLEIN: Muster = {
  groupSize: 4,
  brauchtShift: false,
  brauchtPunkt: false,
  casing: () => "klein",
  punktHinterGruppe: false,
};

/** (e) Dreiergruppen mit Punkt dahinter: „abc. def.". */
const MUSTER_DREIER_PUNKT: Muster = {
  groupSize: 3,
  brauchtShift: false,
  brauchtPunkt: true,
  casing: () => "klein",
  punktHinterGruppe: true,
};

/** Alle fünf Muster in fester Reihenfolge (für reproduzierbare Auswahl). */
const ALLE_MUSTER: Muster[] = [
  MUSTER_DREIER_KLEIN,
  MUSTER_DREIER_ANFANG_GROSS,
  MUSTER_DREIER_WECHSELND,
  MUSTER_VIERER_KLEIN,
  MUSTER_DREIER_PUNKT,
];

/** Zwei Gruppen je Zeile - so wie in jedem Beispiel des Auftrags. */
const GRUPPEN_JE_ZEILE = 2;

/** Ab so vielen freigeschalteten Buchstaben taugt die Form. */
const MINDEST_BUCHSTABEN = 6;

/**
 * Die freigeschalteten BUCHSTABEN aus `ctx.introduced`, alphabetisch sortiert
 * (nach dem Alphabet DES LERNWEGS - siehe {@link alphabetOrderFuer}).
 * `introduced` trägt daneben auch ⇧, Ziffern und Satz-/Sonderzeichen - die
 * fallen hier heraus, weil das Alphabet nur Buchstaben enthält.
 */
function freigeschalteteBuchstaben(introduced: string[], lernweg: FormKontext["lernweg"]): string[] {
  const bekannt = new Set(introduced);
  // ★ CS-W (09.10.2026): ein Buchstabe aus zwei Zeichen (`ch` auf Weg „cs") ist da, sobald JEDES seiner Zeichen da ist. Für
  // einen Buchstaben aus einem Zeichen ist das dieselbe Frage wie vorher (`bekannt.has(b)`) - de/en/fr/es/it/pl/tr Byte für Byte.
  return alphabetOrderFuer(lernweg).filter((b) => [...b].every((z) => bekannt.has(z)));
}

/** Welche der fünf Muster taugen mit diesem Tastenstand? */
function taugendeMuster(ctx: FormKontext): Muster[] {
  return ALLE_MUSTER.filter((m) => {
    if (m.brauchtShift && !ctx.shift) return false;
    if (m.brauchtPunkt && !ctx.introduced.includes(".")) return false;
    return true;
  });
}

/**
 * Eine Zeile aus zwei Gruppen bauen, ab `cursor` im Alphabet-Vorrat.
 * Gibt den fertigen Text und den Cursor NACH der Zeile zurück (für das
 * verschobene nächste Vorkommen desselben Musters).
 */
function baueZeile(
  muster: Muster,
  buchstaben: string[],
  cursorStart: number,
  // ★ G2b-1: Sprache der Buchstaben (türkisch i ⇒ İ); ohne Angabe wie bisher.
  lang: Lang = "de",
): { text: string; cursor: number } {
  let cursor = cursorStart;
  const gruppen: string[] = [];
  for (let g = 0; g < GRUPPEN_JE_ZEILE; g++) {
    /*
     * ★★ KEINE GRUPPE BRICHT MITTEN IM ALPHABET UM (20.09.2026).
     *
     * Johannes, nach dem Durchgang seines Schülers, wörtlich: *„Die
     * Alphabetreihen brechen manchmal wieder mittendrin ab. … Man erwartet ein
     * m oder so und es geht von vorne los. Das wirkt etwas willenlos."*
     *
     * Der Vorrat sind die FREIGESCHALTETEN Buchstaben - er endet dort, wo das
     * Kind gerade steht. Bisher lief der Zeiger stur weiter und begann
     * innerhalb einer Gruppe von vorn: aus „klm" wurde „kla". Für ein Kind,
     * das die Reihe mitdenkt, ist das kein Muster mehr, sondern ein Patzer des
     * Programms.
     *
     * Jetzt beginnt eine Gruppe, die nicht mehr ganz in den Rest passt, gleich
     * vorne - der Sprung liegt damit IMMER zwischen zwei Gruppen, nie in einer.
     * Jede Gruppe ist ein zusammenhängendes Stück Alphabet.
     */
    const rest = buchstaben.length - (cursor % buchstaben.length);
    if (rest < muster.groupSize) cursor += rest;
    let gruppe = "";
    for (let pos = 0; pos < muster.groupSize; pos++) {
      const buchstabe = buchstaben[cursor % buchstaben.length];
      cursor++;
      // „ß".toUpperCase() liefert in JS „SS" (zwei Zeichen, keine eigene
      // Taste) - dafür gibt es auf dieser Tastatur keinen richtigen
      // Tastenweg. ß bleibt darum an Großbuchstaben-Positionen klein.
      const gross = muster.casing(pos) === "gross" && buchstabe !== "ß";
      // ★ CS-W (09.10.2026): gross wird nur das ERSTE Zeichen - `ch` ⇒ `Ch` (wie am Satzanfang), nie `CH`. Für einen
      // Buchstaben aus einem Zeichen ist `slice(1)` leer: de/en/fr/es/it/pl/tr Byte für Byte wie vorher.
      gruppe += gross ? grossFuer(buchstabe.slice(0, 1), lang) + buchstabe.slice(1) : buchstabe;
    }
    if (muster.punktHinterGruppe) gruppe += ".";
    gruppen.push(gruppe);
  }
  return { text: gruppen.join(" "), cursor };
}

/**
 * Baut die Runde: mindestens `ctx.count` Zeilen, jedes verwendete Muster
 * immer im Paar (zweimal hintereinander, verschobener Startbuchstabe).
 */
function baueRunde(ctx: FormKontext): FormRunde | null {
  const buchstaben = freigeschalteteBuchstaben(ctx.introduced, ctx.lernweg);
  if (buchstaben.length < MINDEST_BUCHSTABEN) return null;
  const muster = taugendeMuster(ctx);
  if (muster.length === 0) return null;

  const allowed = new Set(ctx.introduced);
  const cursorJeMuster = new Map<Muster, number>(muster.map((m) => [m, 0]));
  const zeilen: RoundLine[] = [];

  // Obergrenze gegen eine Endlosschleife, falls `fitText` je eine gebaute
  // Zeile ablehnt (sollte bei korrektem Vorrat nie vorkommen) - dann bricht
  // der Aufbau lieber mit dem bisherigen Bestand ab, als hängen zu bleiben.
  let versuche = 0;
  const maxVersuche = Math.max(ctx.count, GRUPPEN_JE_ZEILE) * 20 + 40;

  while (zeilen.length < ctx.count && versuche < maxVersuche) {
    versuche++;
    const gewaehlt = muster[Math.min(muster.length - 1, Math.floor(ctx.zufall() * muster.length))];
    let cursor = cursorJeMuster.get(gewaehlt)!;
    const paar: RoundLine[] = [];
    let paarGueltig = true;
    for (let i = 0; i < 2; i++) {
      const { text, cursor: naechsterCursor } = baueZeile(gewaehlt, buchstaben, cursor, ctx.lang);
      cursor = naechsterCursor;
      // ★ PL-W (09.10.2026): MIT dem Weg - sonst kennt `fitText` die späten Grossbuchstaben des Weges nicht
      // (`grossAkzentSpaet`, auf „pl" der Dreiergriff Ą Ć Ę Ł Ń Ó Ś Ź Ż): gemessen bot die Form auf „pl" ab Nr. 29
      // „Łmn Opr" und „AbC DeĘ" an, lange bevor ein Kind Ł oder Ę tippen kann. Für de/en/fr/es/it byte-gleich: ihre
      // Alphabete tragen keinen Buchstaben, der über einen Totasten- oder späten Grossgriff läuft.
      if (fitText(text, allowed, ctx.lernweg, ctx.lang) !== text) {
        paarGueltig = false;
        break;
      }
      paar.push({ text, source: null, art: "unsinn" });
    }
    if (!paarGueltig) continue;
    cursorJeMuster.set(gewaehlt, cursor);
    zeilen.push(...paar);
  }

  return zeilen.length > 0 ? { zeilen } : null;
}

/** Die Ankündigung in beiden Bedienungssprachen (EN4) - Deutsch wortgleich wie vorher. */
const TEXTE = texte({
  de: { ankuendigung: "Jetzt kommen Alphabet-Reihen." },
  en: { ankuendigung: "Now for some alphabet runs." },
  // ★ E11a-5 (26.09.2026): Französisch aus der Funktion neu geschrieben (tu, kurz).
  fr: { ankuendigung: "Voici des suites de l'alphabet." },
  es: { ankuendigung: "Aquí tienes series del alfabeto." },
  // ★ O-IT (02.10.2026): ein Muster für alle 13 - „Ora tocca a …" (Glossar §2.2).
  it: { ankuendigung: "Ora tocca alle serie dell'alfabeto." },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: { ankuendigung: "Teraz kolej na: Ciągi alfabetu." },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: { ankuendigung: "Sırada: Alfabe dizileri." },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: { ankuendigung: "Teď: abecední řady." },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: азбучни редици.",
  },
  el: {
    ankuendigung: "Τώρα: γράμματα με τη σειρά.",
  },
  hu: {
    ankuendigung: "Most: ABC-sorok.",
  },
  nl: {
    ankuendigung: "Nu: alfabetreeksen.",
  },
  pt: {
    ankuendigung: "Agora: sequências do alfabeto.",
  },
  br: {
    ankuendigung: "Agora: sequências do alfabeto.",
  },
  ro: {
    ankuendigung: "Acum: seriile alfabetului.",
  },
  sv: {
    ankuendigung: "Nu: alfabetet i ordning.",
  },
  uk: {
    ankuendigung: "Далі: абеткові ряди.",
  },
});

export const alphabetreihen: Uebungsform = {
  id: "alphabetreihen",
  name: FORM_NAMEN.de.alphabetreihen,
  ankuendigung: (ctx) => TEXTE[bedienSpracheVon(ctx)].ankuendigung,
  taugt: (ctx) => freigeschalteteBuchstaben(ctx.introduced, ctx.lernweg).length >= MINDEST_BUCHSTABEN,
  baue: baueRunde,
};
