/**
 * „Tasten finden" in Tastenflow: „Meine Tasten" oder „Alle Tasten".
 *
 * ★ 25.09.2026, Johannes: „beim Tasten erkunden sollen alle Tasten kommen,
 * aber beim Finden nur die, die das Kind schon kann, oder alle (Umschalter)".
 * Auf Rückfrage entschieden:
 *  · **Meine Tasten** = die Zeichen, die das Kind im Lehrgang schon hat
 *    (`introduced`), dazu die Sondertasten der bisherigen Runde (Tab, Enter,
 *    Pfeile, Strg …).
 *  · **Alle Tasten** = jede Taste der eingestellten Tastatur (Buchstaben,
 *    Ziffern, Satzzeichen, seit 28.09. auch die Zeichen mit Shift und AltGr
 *    wie ( ) % @) und die Sondertasten - ohne die Windows-Taste.
 *  · Beide Male **20 zufällige** aus dem Vorrat (bei weniger: alle).
 *
 * Bis dahin suchte die Runde nur Sondertasten, in Lehr-Reihenfolge
 * (`suchbareTasten`) - so bleibt es in »Im Griff«, das diese Datei nicht
 * benutzt. Die Sätze der Sondertasten sind Wort für Wort die von
 * `suchSchritt` (`lib/computer/tastenSuche.ts`) und `suchSatzEn`; ein Wächter
 * hält das fest (`tests/tastenflow-finden-meine-alle.test.ts`).
 *
 * Zeichen heissen, wie „Tasten erkunden" sie nennt: Buchstaben gross wie auf
 * der Kappe („Finde A."), Satzzeichen mit Namen („Finde Punkt."). Braucht ein
 * Zeichen Shift oder AltGr, sagt der Auftrag es dazu („Finde Fragezeichen.
 * Mit Shift.").
 *
 * ★★ Die Falle aus der Schneerutsche (20.09.2026): Für `?` kommt zuerst ein
 * eigenes Ereignis mit `key === "Shift"`. Wäre das ein Fehlgriff, bliebe jedes
 * Umschalt-Zeichen unschaffbar. Darum: Wird ein ZEICHEN gesucht, sind die
 * Tasten, die andere verändern (Shift, AltGr, Strg, Alt, Wahltaste …), stumm.
 */
import type { KeyEventLike } from "../computer/chord";
import type { Plattform } from "../computer/model";
import {
  ANSAGE_UNBEKANNT,
  ansageBestaetigt,
  ansageGefunden,
  ansageSuchauftrag,
  suchbareTasten,
  tasteFuerEreignis,
  tastenNennung,
  tastenNennungKurz,
} from "../computer/tastenNamen";
import type { TastenName } from "../computer/tastenNamen";
import type { SuchSchritt } from "../computer/tastenSuche";
import type { BedienSprache } from "../bedienSprache";
import { shiftHandFor, spokenLabel, type Hand, type KeyMod } from "./fingers";
import { layoutSprache, type KeyboardLayout } from "./layouts";
import { SHIFT_UNIT } from "./letters";
import { erklaerungFuerSprache, feststellZustand, zeichenName } from "./tastenErklaerung";
import {
  ANSAGE_UNBEKANNT_EN,
  ansageBestaetigtEn,
  ansageGefundenEn,
  ansageSuchauftragEn,
  tastenLageEn,
  tastenNennungEn,
} from "./tastenErklaerungEn";
import {
  ANSAGE_UNBEKANNT_FR,
  ansageBestaetigtFr,
  ansageGefundenFr,
  ansageSuchauftragFr,
  tastenLageFr,
  tastenNennungFr,
} from "./tastenErklaerungFr";
import {
  ANSAGE_UNBEKANNT_ES,
  ansageBestaetigtEs,
  ansageGefundenEs,
  ansageSuchauftragEs,
  tastenLageEs,
  tastenNennungEs,
} from "./tastenErklaerungEs";
import {
  ANSAGE_UNBEKANNT_IT,
  ansageBestaetigtIt,
  ansageGefundenIt,
  ansageSuchauftragIt,
  tastenLageIt,
  tastenNennungIt,
} from "./tastenErklaerungIt";
import {
  ANSAGE_UNBEKANNT_PL,
  alleGefundenPl,
  ansageBestaetigtPl,
  ansageGefundenPl,
  ansageSuchauftragPl,
  tastenLagePl,
  tastenNennungPl,
} from "./tastenErklaerungPl";
import {
  ANSAGE_UNBEKANNT_TR,
  alleGefundenTr,
  ansageBestaetigtTr,
  ansageGefundenTr,
  ansageSuchauftragTr,
  grossAnfangTr,
  tastenLageTr,
  tastenNennungTr,
} from "./tastenErklaerungTr";
import {
  ANSAGE_UNBEKANNT_CS,
  alleGefundenCs,
  ansageBestaetigtCs,
  ansageGefundenCs,
  ansageSuchauftragCs,
  tastenLageCs,
  tastenNennungCs,
} from "./tastenErklaerungCs";
import { grossFuer, istBuchstabe, istGeruestSprache, kleinFuer } from "./sprachRegister";
import { FINDEN_SAETZE_NEUN, ZEICHEN_IM_SATZ_NEUN } from "./findenSaetzeNeun";

/** Welche Tasten die Runde sucht. */
export type FindenAuswahl = "meine" | "alle";

/** So viele Tasten hat eine Runde (Johannes 25.09.2026: „20 zufällige"). */
export const FINDEN_RUNDE_LAENGE = 20;

/** Eine Taste, die gesucht wird: eine Sondertaste oder ein Zeichen. */
export type FindenZiel =
  | { art: "sonder"; taste: TastenName }
  /** `zeichen` klein bei Buchstaben; `mod`, wenn Shift oder AltGr dazugehört. */
  | { art: "zeichen"; zeichen: string; mod?: KeyMod };

/**
 * Totasten erzeugen kein Zeichen (`key === "Dead"`) - suchen liessen sie sich
 * nur über die Kappe, und die Stimme hätte keinen Namen. Sie bleiben dem
 * Erkunden.
 */
const TOTASTEN = new Set(["^", "´", "`", "¨"]);

// ★ G2b-1: die Buchstabenklasse ist `istBuchstabe` (sprachRegister.ts) - eine Quelle statt einer Kopie.

/** Die Tasten, die Shift, AltGr & Co. sind - beim Suchen eines Zeichens stumm. */
const VERAENDERER = new Set(["Shift", "Control", "Alt", "AltGraph", "Meta", "OS", "Fn", "CapsLock"]);

/**
 * ★ 28.09.2026, Johannes: „finde die Windows-Taste" öffnet unter Windows das
 * Startmenü - das kann keine Seite abfangen (auch nicht mit preventDefault),
 * und das Kind landet ausserhalb des Browsers. Die Runde fragt sie nicht.
 * »Im Griff« lehrt sie weiter im Tasten-Dojo (eigene Runde, nicht diese Datei).
 */
const NICHT_FRAGEN = new Set(["windows-taste"]);

function istTotaste(ch: string, layout: KeyboardLayout): boolean {
  return TOTASTEN.has(ch) || layout.access[ch]?.dead === true;
}

/** Ein Zeichen als Ziel - mit dem Weg (Shift/AltGr), den die Tastatur verlangt. */
function zeichenZiel(ch: string, layout: KeyboardLayout): FindenZiel {
  const mod = layout.access[ch]?.mod;
  return mod ? { art: "zeichen", zeichen: ch, mod } : { art: "zeichen", zeichen: ch };
}

/** Fisher-Yates mit wählbarem Zufall (Tests). */
function mische<T>(liste: T[], zufall: () => number): T[] {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Die Tasten einer Runde: aus dem Vorrat gemischt, höchstens
 * {@link FINDEN_RUNDE_LAENGE}.
 *
 * @param gelernt die freigeschalteten Einheiten des Kindes (`introduced`);
 *                nur für „meine" gelesen. `⇧` ist dort ein Lernschritt, keine
 *                Taste - die Umschalttaste steht ohnehin bei den Sondertasten.
 */
export function findenZiele(opts: {
  auswahl: FindenAuswahl;
  gelernt: readonly string[];
  plattform: Plattform;
  layout: KeyboardLayout;
  /** ★ 18.10.2026 (Testerin): Laptop-Tastatur - ohne Pos1, Ende, Bild auf/ab. Vorgabe: Computer. */
  tastaturArt?: "computer" | "laptop";
  zufall?: () => number;
}): FindenZiel[] {
  const { auswahl, gelernt, plattform, layout, tastaturArt = "computer", zufall = Math.random } = opts;
  const aufDerTastatur = new Set(layout.rows.flatMap((r) => r.keys));
  // ★ G2b-1: Gross-/Klein in der Sprache der Tastatur (türkisch i İ ı I).
  const sprache = layoutSprache(layout);
  const gibtEs = (ch: string) =>
    !layout.missing.includes(ch) &&
    (aufDerTastatur.has(kleinFuer(ch, sprache)) || layout.access[ch] !== undefined);

  // ★ 28.09.2026, Johannes: „frage auch die Sondertasten wie Klammer, %" -
  // „Alle" heisst auch die Zeichen mit Shift und AltGr, nicht nur die Kappen.
  const quelle =
    auswahl === "meine"
      ? gelernt
      : [...layout.rows.flatMap((r) => r.keys), ...Object.keys(layout.access)];
  const zeichen = [
    ...new Set(
      quelle
        .filter((ch) => ch !== SHIFT_UNIT && ch.length === 1 && ch.trim() !== "")
        .map((ch) => (istBuchstabe(ch) ? kleinFuer(ch, sprache) : ch))
        .filter((ch) => gibtEs(ch) && !istTotaste(ch, layout)),
    ),
  ];
  const vorrat: FindenZiel[] = [
    ...zeichen.map((ch) => zeichenZiel(ch, layout)),
    ...suchbareTasten(plattform, tastaturArt)
      .filter((taste) => !NICHT_FRAGEN.has(taste.id))
      .map((taste): FindenZiel => ({ art: "sonder", taste })),
  ];
  return mische(vorrat, zufall).slice(0, FINDEN_RUNDE_LAENGE);
}

/* ══ Sätze ══════════════════════════════════════════════════════════════════ */

/** „A", „Ä", „Punkt", „Fragezeichen" - wie „Tasten erkunden" das Zeichen nennt. */
export function zeichenNennung(ch: string, sprache: BedienSprache = "de"): string {
  if (istBuchstabe(ch)) {
    const gross = grossFuer(ch, layoutSprache());
    // „ß".toUpperCase() ist „SS" - dann lieber der Name.
    return gross.length === 1 ? gross : zeichenName(ch, sprache);
  }
  return zeichenName(ch, sprache);
}

type Fall = "akkusativ" | "nominativ" | "dativ";

/**
 * ★ E11a-5 (26.09.2026): ein Zeichen IM SATZ. Deutsch und Englisch sagen den
 * Namen allein („Finde Fragezeichen.", wie bisher). Französisch braucht vor
 * einem Namen ein Wort - „Trouve apostrophe." ist kein Satz; „le signe"
 * trägt jeden Namen, ohne sein Geschlecht zu kennen („Trouve le signe
 * apostrophe.", „Ça, c'est le signe virgule."). Buchstaben und Ziffern
 * bleiben, wie sie auf der Kappe stehen („Trouve R.").
 */
const ZEICHEN_IM_SATZ: Record<BedienSprache, (ch: string, nennung: string) => string> = {
  de: (_ch, n) => n,
  en: (_ch, n) => n,
  fr: (ch, n) => (istBuchstabe(ch) || /^\d$/.test(ch) ? n : `le signe ${n}`),
  // ★ ES-O: Spanisch mit Artikel - Buchstaben sind weiblich („Busca la A."),
  // Ziffern männlich („el 5"), Zeichen tragen „el signo", ausser ihr Name
  // beginnt schon damit („el signo de cierre de interrogación").
  es: (ch, n) =>
    istBuchstabe(ch)
      ? `la ${n}`
      : /^\d$/.test(ch)
        ? `el ${n}`
        : n.startsWith("signo ")
          ? `el ${n}`
          : `el signo ${n}`,
  // ★ O-IT (02.10.2026): Italienisch mit Artikel - Buchstaben weiblich („Trova
  // la A."), Ziffern „il 5" / „l'1" / „l'8" / „lo 0", Zeichen nach dem
  // Geschlecht ihres Namens („la virgola", „il punto", „l'apostrofo").
  it: (ch, n) => (istBuchstabe(ch) ? `la ${n}` : /^\d$/.test(ch) ? zifferMitArtikelIt(n) : zeichenMitArtikelIt(n)),
  // ★ O-PL (02.10.2026): der Name bleibt hier ungebeugt - den Fall setzt
  // {@link zeichenImSatz} (`zeichenImSatzPl`), weil Polnisch ihn braucht.
  pl: (_ch, n) => n,
  // ★ O-TR (02.10.2026): ebenso ungebeugt - die Endung setzt {@link zeichenImSatz}
  // (`zeichenImSatzTr`) an ein festes Wort („A harfini", „nokta işaretini").
  tr: (_ch, n) => n,
  // ★ O-CS (03.10.2026): ebenso ungebeugt - den Fall setzt {@link zeichenImSatz}
  // (`zeichenImSatzCs`) mit einem Kopfwort („písmeno A", „číslici 5") oder der Form des Namens („tečku").
  cs: (_ch, n) => n,
  // ★ O2-TASTATUR (30.10.2026): ebenso ungebeugt - das Kopfwort setzt {@link zeichenImSatz} (`ZEICHEN_IM_SATZ_NEUN`).
  bg: (_ch, n) => n,
  el: (_ch, n) => n,
  hu: (_ch, n) => n,
  nl: (_ch, n) => n,
  pt: (_ch, n) => n,
  br: (_ch, n) => n,
  ro: (_ch, n) => n,
  sv: (_ch, n) => n,
  uk: (_ch, n) => n,
};

/** ★ O-IT: „lo 0", „l'1", „l'8", sonst „il 5". */
function zifferMitArtikelIt(z: string): string {
  return z === "0" ? "lo 0" : z === "1" || z === "8" ? `l'${z}` : `il ${z}`;
}

/**
 * ★ O-IT: der Artikel vor dem italienischen Zeichennamen (`SPOKEN_IT`,
 * `fingers.ts`) - nach dem ersten Wort. Namen ohne eigenes Hauptwort („più",
 * „minore", „percento") stehen hinter „il simbolo di"; unbekannte hinter
 * „il segno".
 */
const ARTIKEL_IT: Readonly<Record<string, string>> = {
  punto: "il ", virgola: "la ", trattino: "il ", due: "i ", apostrofo: "l'", virgolette: "le ",
  parentesi: "la ", barra: "la ", chiocciola: "la ", cancelletto: "il ", e: "la ",
  asterisco: "l'", accento: "l'", tilde: "la ", dieresi: "la ", ordinale: "l'",
  dollaro: "il simbolo del ", sterlina: "il simbolo della ", euro: "il simbolo dell'",
  paragrafo: "il simbolo di ", grado: "il simbolo di ", percento: "il simbolo di ",
  minore: "il simbolo di ", maggiore: "il simbolo di ", uguale: "il simbolo di ", "più": "il simbolo di ",
  micro: "il simbolo di ", elevato: "il simbolo di ", simbolo: "il ", segno: "il ", caron: "il ",
  un: "il simbolo di ",
};
function zeichenMitArtikelIt(n: string): string {
  const erstes = n.split(" ")[0];
  return `${ARTIKEL_IT[erstes] ?? "il segno "}${n}`;
}

/**
 * Die Nennung eines Zeichens, wie sie in einem Satz der Runde steht.
 * ★ 28.09.2026: Deutsch im vierten Fall - „Finde umgekehrten Schrägstrich",
 * aber „Das ist umgekehrter Schrägstrich". Betrifft nur Namen mit einem
 * männlichen Eigenschaftswort vorne („kleiner als" bleibt: kein Hauptwort).
 */
function zeichenImSatz(ch: string, sprache: BedienSprache, fall: Fall = "akkusativ"): string {
  const nennung = ZEICHEN_IM_SATZ[sprache](ch, zeichenNennung(ch, sprache));
  if (sprache === "pl") return zeichenImSatzPl(ch, nennung, fall);
  if (sprache === "tr") return zeichenImSatzTr(ch, nennung, fall);
  if (sprache === "cs") return zeichenImSatzCs(ch, nennung, fall);
  if (istGeruestSprache(sprache)) {
    const t = ZEICHEN_IM_SATZ_NEUN[sprache];
    const nom = fall === "nominativ";
    if (istBuchstabe(ch)) return t.buchstabe(nennung, nom);
    // Die Ziffer selbst, nie ihr Name: sie steht vor einem Ort, damit der Satz nicht mit „5." endet (die Stimme läse eine Ordnungszahl).
    return /^\d$/.test(ch) ? t.ziffer(ch, nom) : t.zeichen(nennung, nom);
  }
  if (sprache !== "de" || fall === "nominativ") return nennung;
  return nennung.replace(/^(\p{Ll}+)er (?=\p{Lu})/u, fall === "dativ" ? "$1em " : "$1en ");
}

/**
 * ★ O-PL (02.10.2026, Glossar Regel 11): ein Zeichen im polnischen Satz.
 * Nach „Znajdź"/„Naciśnij" (Akkusativ) mit einem Hauptwort davor, das sich
 * richtig beugt - „literę A", „cyfrę 5" -, Zeichen nach einem Doppelpunkt
 * („znak: kropka"), weil „kropkę", „małpę", „równa się" sonst je eigene
 * Formen bräuchten. Im Nominativ („Naciśnięto: …") steht der Name allein.
 * Namen, die selbst mit „znak" beginnen („znak zapytania"), bekommen kein
 * zweites.
 */
function zeichenImSatzPl(ch: string, nennung: string, fall: Fall): string {
  if (fall === "nominativ") return nennung;
  if (istBuchstabe(ch)) return `literę ${nennung}`;
  if (/^\d$/.test(ch)) return `cyfrę ${nennung}`;
  return nennung.startsWith("znak ") ? nennung : `znak: ${nennung}`;
}

/**
 * ★ O-TR (02.10.2026, Glossar §1 Regel 6): ein Zeichen im türkischen Satz.
 * Die Endung hängt NIE am Zeichen oder seinem Namen, sondern an einem festen
 * Wort dahinter: „A harfini bul", „5 rakamını bul", „nokta işaretini bul";
 * nach „Bu," ohne Endung („Bu, A harfi."). Namen, die schon auf „işareti"
 * enden („soru işareti"), bekommen kein zweites. ★ i und ı heissen mit ihrem
 * Namen („noktalı i harfini bul") - „İ" und „I" klängen sonst gleich
 * (Glossar §4 Nr. 1).
 */
function zeichenImSatzTr(ch: string, nennung: string, fall: Fall): string {
  const nom = fall === "nominativ";
  if (istBuchstabe(ch)) {
    const klein = kleinFuer(ch, "tr");
    const name = klein === "i" || klein === "ı" ? zeichenName(klein, "tr") : nennung;
    return `${name} ${nom ? "harfi" : "harfini"}`;
  }
  if (/^\d$/.test(ch)) return `${nennung} ${nom ? "rakamı" : "rakamını"}`;
  if (nennung.endsWith(" işareti")) return nom ? nennung : `${nennung}ni`;
  return `${nennung} ${nom ? "işareti" : "işaretini"}`;
}

/**
 * ★ O-CS (03.10.2026): der Akkusativ der weiblichen Zeichennamen aus `SPOKEN_CS` (`fingers.ts`, Glossar §2.8) -
 * „Najdi tečku", „Najdi levou závorku". Männliche und sächliche Namen („otazník", „lomítko") und die Mehrzahl
 * („uvozovky", „dvě tečky") bleiben gleich und stehen darum nicht hier. Eine feste Liste statt einer Endungsregel:
 * „rovná se" ist kein Hauptwort und darf nicht zu „rovnou se" werden.
 */
const AKKUSATIV_CS: Readonly<Record<string, string>> = {
  tečka: "tečku",
  čárka: "čárku",
  dvojtečka: "dvojtečku",
  mezera: "mezeru",
  hvězdička: "hvězdičku",
  mřížka: "mřížku",
  stříška: "stříšku",
  vlnovka: "vlnovku",
  libra: "libru",
  "levá závorka": "levou závorku",
  "pravá závorka": "pravou závorku",
  "levá hranatá závorka": "levou hranatou závorku",
  "pravá hranatá závorka": "pravou hranatou závorku",
  "levá složená závorka": "levou složenou závorku",
  "pravá složená závorka": "pravou složenou závorku",
  "svislá čára": "svislou čáru",
  "čárka nad písmenem": "čárku nad písmenem",
  "jedna polovina": "jednu polovinu",
  "tečka uprostřed": "tečku uprostřed",
  "turecká lira": "tureckou liru",
};

/**
 * ★ O-CS (03.10.2026, Glossar Regel 11/12): ein Zeichen im tschechischen Satz. Nach „Najdi"/„Stiskni" (Akkusativ)
 * mit einem Kopfwort, das sich selbst beugt: „písmeno A" (sächlich, gleich), „číslici 5 na číselné řadě" - die Ziffer
 * endet nie den Satz, sonst läse die Stimme eine Ordnungszahl (Glossar §4 Falle 4). Die Buchstaben mit Zeichen beim
 * Namen („písmeno e s háčkem") - „Ě" stünde auf keiner Kappe, und e, é, ě klingen sonst gleich. Zeichen beim Namen,
 * weibliche im Akkusativ ({@link AKKUSATIV_CS}). Im Nominativ („Stisknuto: ...") der Name allein.
 */
function zeichenImSatzCs(ch: string, nennung: string, fall: Fall): string {
  const nom = fall === "nominativ";
  if (istBuchstabe(ch)) {
    const klein = kleinFuer(ch, "cs");
    const gesprochen = spokenLabel(klein, "cs");
    return `písmeno ${gesprochen !== klein ? gesprochen : nennung}`;
  }
  // Die Ziffer selbst (`ch`), nicht `nennung` - die heisst seit dem Eintrag in `ZEICHEN_CS` schon „číslice 5".
  if (/^\d$/.test(ch)) return nom ? `číslice ${ch}` : `číslici ${ch} na číselné řadě`;
  return nom ? nennung : (AKKUSATIV_CS[nennung] ?? nennung);
}

/**
 * ★★ E11a-5 (26.09.2026, Leitfaden Falle 30): DIE SÄTZE DER RUNDE JE SPRACHE.
 *
 * Bis hierher stand in jeder Funktion `sprache === "en" ? … : Deutsch` - für
 * „fr" also still „Finde A." und „Gefunden! Drück noch einmal …". Jetzt eine
 * Tabelle: `tsc` meldet eine fehlende Sprache, und Deutsch und Englisch sind
 * Zeichen für Zeichen die Sätze von vorher (Abzug vor/nach verglichen).
 *
 * Französisch mit „tu", Glossar §9.2 (Maj, Alt Gr, Retour arrière …); die
 * Namen und Lagen der Sondertasten stehen in `tastenErklaerungFr.ts` (E12).
 * Buchstaben heissen wie auf der Kappe („Trouve A."), Zeichen mit Namen
 * (`zeichenName(ch, "fr")`, „Trouve point d'interrogation.").
 */
interface FindenSaetze {
  /** „Finde …" - das Verb des Auftrags. */
  finde: (ziel: string) => string;
  /** „Mit Shift." - der Weg zu einem Zeichen. */
  mit: (taste: string) => string;
  /** Wie eine Sondertaste im Satz heisst (Deutsch mit Fall). */
  sonderNennung: (t: TastenName, fall: Fall, plattform: Plattform) => string;
  /** Wie eine Sondertaste auf dem Schirm heisst (Deutsch: die lange Nennung). */
  sonderNennungSchirm: (t: TastenName, plattform: Plattform) => string;
  sonderLage: (t: TastenName, plattform: Plattform) => string;
  sonderAuftrag: (t: TastenName, plattform: Plattform) => string;
  sonderGefunden: (t: TastenName, plattform: Plattform) => string;
  sonderBestaetigt: (t: TastenName, plattform: Plattform) => string;
  zeichenGefunden: (n: string) => string;
  zeichenBestaetigt: string;
  unbekannt: string;
  dasIst: (das: string, ziel: string, nachsatz: string) => string;
  fertig: (sitzt: string, anzahl: number) => string;
}

const FINDEN_SAETZE: Record<BedienSprache, FindenSaetze> = {
  // ★ O2-TASTATUR (30.10.2026): die neun Sprachen aus `findenSaetzeNeun.ts` - bis hierher `mitRueckfallEn`, also „Find A.".
  ...FINDEN_SAETZE_NEUN,
  de: {
    finde: (ziel) => `Finde ${ziel}.`,
    mit: (taste) => `Mit ${taste}.`,
    sonderNennung: (t, fall) => tastenNennungKurz(t, fall),
    sonderNennungSchirm: (t) => tastenNennung(t, "akkusativ"),
    sonderLage: (t) => t.lage,
    sonderAuftrag: (t) => ansageSuchauftrag(t),
    sonderGefunden: (t) => ansageGefunden(t),
    sonderBestaetigt: (t) => ansageBestaetigt(t),
    zeichenGefunden: (n) => `Gefunden! Drück eine andere Taste, dann noch einmal ${n}.`,
    zeichenBestaetigt: "Sitzt!",
    unbekannt: ANSAGE_UNBEKANNT,
    dasIst: (das, ziel, nachsatz) => `Das ist ${das}. Finde ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} Alle ${n} Tasten gefunden. Stark!`,
  },
  en: {
    finde: (ziel) => `Find ${ziel}.`,
    mit: (taste) => `With ${taste}.`,
    sonderNennung: (t, _fall, p) => tastenNennungEn(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungEn(t, p),
    sonderLage: (t, p) => tastenLageEn(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragEn(t, p),
    sonderGefunden: (t, p) => ansageGefundenEn(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtEn(t, p),
    zeichenGefunden: (n) => `Found it! Press another key, then ${n} again.`,
    zeichenBestaetigt: "Got it!",
    unbekannt: ANSAGE_UNBEKANNT_EN,
    dasIst: (das, ziel, nachsatz) => `That's ${das}. Find ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} All ${n} keys found. Brilliant!`,
  },
  fr: {
    finde: (ziel) => `Trouve ${ziel}.`,
    mit: (taste) => `Avec ${taste}.`,
    sonderNennung: (t, _fall, p) => tastenNennungFr(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungFr(t, p),
    sonderLage: (t, p) => tastenLageFr(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragFr(t, p),
    sonderGefunden: (t, p) => ansageGefundenFr(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtFr(t, p),
    zeichenGefunden: (n) => `Trouvé ! Appuie sur une autre touche, puis encore sur ${n}.`,
    zeichenBestaetigt: "C'est ça !",
    unbekannt: ANSAGE_UNBEKANNT_FR,
    dasIst: (das, ziel, nachsatz) => `Ça, c'est ${das}. Trouve ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} Les ${n} touches sont trouvées. Bravo !`,
  },
  // ★ ES-O (27.09.2026): Spanisch mit „tú" (Bauplan S9), Tastennamen aus
  // `tastenErklaerungEs.ts` (Bauplan S13).
  es: {
    finde: (ziel) => `Busca ${ziel}.`,
    mit: (taste) => `Con ${taste}.`,
    sonderNennung: (t, _fall, p) => tastenNennungEs(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungEs(t, p),
    sonderLage: (t, p) => tastenLageEs(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragEs(t, p),
    sonderGefunden: (t, p) => ansageGefundenEs(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtEs(t, p),
    zeichenGefunden: (n) => `¡Ahí está! Pulsa otra tecla, luego otra vez ${n}.`,
    zeichenBestaetigt: "¡Eso es!",
    unbekannt: ANSAGE_UNBEKANNT_ES,
    dasIst: (das, ziel, nachsatz) => `Has pulsado ${das}. Busca ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} Has encontrado las ${n} teclas. ¡Muy bien!`,
  },
  // ★ O-IT (02.10.2026): Italienisch mit „tu", Tastennamen aus
  // `tastenErklaerungIt.ts` (Glossar §2.9); höchstens ein Ausrufezeichen je
  // Satz (Glossar Regel 1), „Ci sei" passt zu jedem Geschlecht.
  it: {
    finde: (ziel) => `Trova ${ziel}.`,
    mit: (taste) => `Con ${taste}.`,
    sonderNennung: (t, _fall, p) => tastenNennungIt(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungIt(t, p),
    sonderLage: (t, p) => tastenLageIt(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragIt(t, p),
    sonderGefunden: (t, p) => ansageGefundenIt(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtIt(t, p),
    zeichenGefunden: (n) => `Ci sei! Premi un altro tasto, poi di nuovo ${n}.`,
    zeichenBestaetigt: "Esatto!",
    unbekannt: ANSAGE_UNBEKANNT_IT,
    dasIst: (das, ziel, nachsatz) => `Questo è ${das}. Trova ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} Hai trovato tutti i ${n} tasti, ottimo lavoro.`,
  },
  // ★ O-PL (02.10.2026): Polnisch mit „ty", Tastennamen aus
  // `tastenErklaerungPl.ts` (Glossar §2.9). Die Fälle: „Znajdź" und „Naciśnij"
  // verlangen den Akkusativ (`tastenNennungPl`), „Naciśnięto:" den Nominativ
  // nach einem Doppelpunkt (-no-Form, kein Geschlecht). „Jest!" und „Dobrze!"
  // passen zu jeder Taste und jedem Kind (Glossar §2.11).
  pl: {
    finde: (ziel) => `Znajdź ${ziel}.`,
    // Der Weg zu einem Zeichen: „Przytrzymaj klawisz Shift." / „Przytrzymaj prawy Alt."
    mit: (taste) => (taste.startsWith("prawy ") ? `Przytrzymaj ${taste}.` : `Przytrzymaj klawisz ${taste}.`),
    sonderNennung: (t, fall, p) => tastenNennungPl(t, p, fall === "nominativ" ? "nominativ" : "akkusativ"),
    sonderNennungSchirm: (t, p) => tastenNennungPl(t, p),
    sonderLage: (t, p) => tastenLagePl(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragPl(t, p),
    sonderGefunden: (t, p) => ansageGefundenPl(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtPl(t, p),
    zeichenGefunden: (n) => `Jest! Naciśnij inny klawisz, potem jeszcze raz ${n}.`,
    zeichenBestaetigt: "Dobrze!",
    unbekannt: ANSAGE_UNBEKANNT_PL,
    dasIst: (das, ziel, nachsatz) => `Naciśnięto: ${das}. Znajdź ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} ${alleGefundenPl(n)}`,
  },
  // ★ O-TR (02.10.2026): Türkisch mit „sen", Tastennamen aus
  // `tastenErklaerungTr.ts` (Glossar §2.9). Die Endung hängt an „tuş"/„harf",
  // nie an den Namen: „Tab tuşunu bul", „Tab tuşuna bas", „Bu, Tab tuşu."
  // „Buldun!" und „Doğru!" passen zu jeder Taste (Glossar §2.11); höchstens
  // ein „!" je Meldung.
  tr: {
    finde: (ziel) => `${grossAnfangTr(ziel)} bul.`,
    // Der Weg zu einem Zeichen: „Shift tuşunu basılı tut." / „Alt Gr tuşunu basılı tut."
    mit: (taste) => `${taste} tuşunu basılı tut.`,
    sonderNennung: (t, fall, p) => tastenNennungTr(t, p, fall === "nominativ" ? "nom" : fall === "dativ" ? "dat" : "akk"),
    sonderNennungSchirm: (t, p) => tastenNennungTr(t, p),
    sonderLage: (t, p) => tastenLageTr(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragTr(t, p),
    sonderGefunden: (t, p) => ansageGefundenTr(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtTr(t, p),
    // Das Zeichen bräuchte hier den Dativ („A harfine") - die Taste ist dieselbe, darum ohne Namen.
    zeichenGefunden: () => "Buldun! Başka bir tuşa bas, sonra aynı tuşa bir kez daha bas.",
    zeichenBestaetigt: "Doğru!",
    unbekannt: ANSAGE_UNBEKANNT_TR,
    dasIst: (das, ziel, nachsatz) => `Bu, ${das}. ${grossAnfangTr(ziel)} bul.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} ${alleGefundenTr(n)}`,
  },
  // ★ O-CS (03.10.2026): Tschechisch mit „ty", Tastennamen aus
  // `tastenErklaerungCs.ts` (Glossar §2.9), jede Taste mit „klávesa" davor. „Najdi"
  // und „Stiskni" verlangen den Akkusativ (`tastenNennungCs`), „Stisknuto:" den
  // Nominativ nach einem Doppelpunkt (Passiv der Sache, kein Geschlecht). „Tady je!"
  // und „Správně!" passen zu jeder Taste und jedem Kind; höchstens ein „!" je Meldung.
  cs: {
    finde: (ziel) => `Najdi ${ziel}.`,
    // Der Weg zu einem Zeichen: „Podrž klávesu Shift." / „Podrž klávesu AltGr."
    mit: (taste) => `Podrž klávesu ${taste}.`,
    sonderNennung: (t, fall, p) => tastenNennungCs(t, p, fall === "nominativ" ? "nominativ" : "akkusativ"),
    sonderNennungSchirm: (t, p) => tastenNennungCs(t, p),
    sonderLage: (t, p) => tastenLageCs(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragCs(t, p),
    sonderGefunden: (t, p) => ansageGefundenCs(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtCs(t, p),
    zeichenGefunden: (n) => `Tady je! Stiskni jinou klávesu, pak ještě jednou ${n}.`,
    zeichenBestaetigt: "Správně!",
    unbekannt: ANSAGE_UNBEKANNT_CS,
    // Endet das Gedrückte mit einer Ziffer („číslice 5"), kein Punkt dahinter (Glossar §4 Falle 4).
    dasIst: (das, ziel, nachsatz) => `Stisknuto: ${das}${/\d$/.test(das) ? ", najdi" : ". Najdi"} ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} ${alleGefundenCs(n)}`,
  },
};

/**
 * Wie die Veränderer-Taste im Weg zu einem Zeichen heisst - Deutsch und
 * Englisch „Shift"/„AltGr" wie bisher, Französisch „Maj"/„Alt Gr" wie auf der
 * AZERTY-Kappe (Glossar §9.2, dieselben Wörter wie in `erkundeTaste`).
 * „Option" (Mac) heisst überall gleich.
 */
const SHIFT_WORT: Record<BedienSprache, string> = {
  de: "Shift",
  en: "Shift",
  fr: "Maj",
  es: "Mayús",
  it: "Maiusc",
  pl: "Shift", // ★ O-PL (02.10.2026, Glossar §2.9)
  tr: "Shift", // ★ O-TR (02.10.2026, Glossar §2.9)
  cs: "Shift", // ★ O-CS (03.10.2026, Glossar §2.9) - wie auf der Kappe, gilt auch für cs.
  // ★ O2-TASTATUR (30.10.2026): dieselben Wörter wie `tastenErklaerung.ts` (Glossare §2.9): nur Schwedisch „Skift".
  bg: "Shift",
  el: "Shift",
  hu: "Shift",
  nl: "Shift",
  pt: "Shift",
  br: "Shift",
  ro: "Shift",
  sv: "Skift",
  uk: "Shift",
};
const ALTGR_WORT: Record<BedienSprache, string> = {
  de: "AltGr",
  en: "AltGr",
  fr: "Alt Gr",
  es: "Alt Gr",
  it: "Alt Gr",
  pl: "prawy Alt", // ★ O-PL (02.10.2026): auf US-Kappen steht rechts nur „Alt" (Glossar §2.9).
  tr: "Alt Gr", // ★ O-TR (02.10.2026): wie auf der türkischen Kappe (Glossar §2.9).
  cs: "AltGr", // ★ O-CS (03.10.2026): „AltGr", nie „Alt Gr" (Glossar §2.9) - gilt auch für cs.
  // ★ O2-TASTATUR (30.10.2026): die Schreibweise der Glossare §2.9.
  bg: "AltGr",
  el: "Alt Gr",
  hu: "AltGr",
  nl: "Alt Gr",
  pt: "Alt Gr",
  br: "Alt Gr",
  ro: "Alt Gr",
  sv: "Alt Gr",
  uk: "AltGr",
};

/** „Mit Shift." / „Mit AltGr." (Mac: „Option") - oder nichts. */
// ★ O-TR (02.10.2026): türkisch bleibt die Mac-Taste „Option" wie auf der Kappe (Glossar §2.9) - geprüft.
// ★ O-CS (03.10.2026): tschechisch ebenso „Option" (Glossar §2.9) - gilt auch für cs.
function wegZumZeichen(mod: KeyMod | undefined, plattform: Plattform, sprache: BedienSprache): string {
  if (!mod) return "";
  // ★ O-IT (02.10.2026): am Mac heisst die Taste italienisch „Opzione" (Glossar §2.9).
  // ★ O-PL (02.10.2026): polnisch bleibt sie „Option" wie auf der Kappe (Glossar §2.9) - geprüft.
  const taste =
    mod === "shift"
      ? SHIFT_WORT[sprache]
      : plattform === "macos"
        ? sprache === "it"
          ? "Opzione"
          : "Option"
        : ALTGR_WORT[sprache];
  return FINDEN_SAETZE[sprache].mit(taste);
}

/** Wie das Ziel im Satz heisst - knapp, wie seit 23.09. in der ganzen Runde. */
export function nennungKurz(z: FindenZiel, fall: Fall, plattform: Plattform, sprache: BedienSprache): string {
  if (z.art === "zeichen") return zeichenImSatz(z.zeichen, sprache, fall);
  return FINDEN_SAETZE[sprache].sonderNennung(z.taste, fall, plattform);
}

/** Der Auftrag mit der Lage bzw. dem Weg: „Finde Tab, die Tabulatortaste. Ganz links …" */
export function findenAuftrag(z: FindenZiel, plattform: Plattform, sprache: BedienSprache = "de"): string {
  const t = FINDEN_SAETZE[sprache];
  if (z.art === "sonder") return t.sonderAuftrag(z.taste, plattform);
  const weg = wegZumZeichen(z.mod, plattform, sprache);
  const kopf = t.finde(zeichenImSatz(z.zeichen, sprache));
  return weg ? `${kopf} ${weg}` : kopf;
}

/** Der Auftrag für den Schirm - ohne Lage (die steht im Popup). */
export function findenAuftragKurz(z: FindenZiel, plattform: Plattform, sprache: BedienSprache = "de"): string {
  const t = FINDEN_SAETZE[sprache];
  if (z.art === "sonder") return t.finde(t.sonderNennungSchirm(z.taste, plattform));
  return t.finde(zeichenImSatz(z.zeichen, sprache));
}

/**
 * ★ 23.10.2026 (Testerin): „die Funktion gehört für mich dazu" - nach dem
 * Treffer sagt die Runde auch, WAS die Sondertaste tut: der erste Satz aus den
 * Tabellen von „Tasten erkunden" („Enter: Bestätigt und schickt ab."). Nur ein
 * Satz - die Zeile auf der Braillezeile bleibt kurz. Bei Zeichen leer.
 */
export function funktionsSatz(
  z: FindenZiel,
  plattform: Plattform,
  layoutId: KeyboardLayout["id"],
  sprache: BedienSprache = "de",
): string {
  if (z.art !== "sonder") return "";
  const e = erklaerungFuerSprache(z.taste.id, plattform, layoutId, sprache);
  const erster = e?.was[0];
  if (!e || !erster) return "";
  const lang = sprache as Parameters<typeof grossFuer>[1];
  return `${e.kurz ?? e.name}: ${grossFuer(erster.slice(0, 1), lang)}${erster.slice(1)}`;
}

/** „Gefunden! Drück eine andere Taste, dann noch einmal A." */
export function findenGefunden(z: FindenZiel, plattform: Plattform, sprache: BedienSprache = "de"): string {
  const t = FINDEN_SAETZE[sprache];
  if (z.art === "sonder") return t.sonderGefunden(z.taste, plattform);
  return t.zeichenGefunden(zeichenImSatz(z.zeichen, sprache));
}

function bestaetigt(z: FindenZiel, plattform: Plattform, sprache: BedienSprache): string {
  const t = FINDEN_SAETZE[sprache];
  if (z.art === "sonder") return t.sonderBestaetigt(z.taste, plattform);
  return t.zeichenBestaetigt;
}

/* ══ Tasten mit zwei Seiten ═════════════════════════════════════════════════ */

/**
 * ★ Testerin 04.11.2026 (Meldungen bc0s8jpbsggd5ks, axenotumo3z7k39): „Man soll
 * Shift links und rechts finden, aber das erste Shift zählt schon als
 * gefunden. Hier ist man erst fertig, wenn man beide gedrückt hat." - und
 * dasselbe für Strg. Johannes hat es freigegeben.
 *
 * Welche Tasten es zweimal gibt: Umschalt überall; unter Windows Strg; am Mac
 * Befehls- und Wahltaste. NICHT dabei: Alt unter Windows (rechts sitzt AltGr,
 * eine eigene Taste), ctrl am Mac (nur links), die Windows-Taste (fragt die
 * Runde nicht). ⚠️ Strg rechts nur an der Computer-Tastatur: Viele neue
 * Laptops tragen dort die Copilot-Taste - ein Kind dürfte nie suchen müssen,
 * was seine Tastatur nicht hat.
 *
 * Die Seite kommt aus `e.code` (`ShiftLeft`/`ShiftRight`). Ohne Code (alte
 * Browser, Bildschirmtastatur) bleibt es beim alten Weg mit einem Druck.
 */
export type Seite = "links" | "rechts";

function zweiseitig(id: string, plattform: Plattform, tastaturArt: "computer" | "laptop"): boolean {
  if (id === "umschalt") return true;
  if (plattform === "macos") return id === "befehlstaste" || id === "wahltaste";
  return id === "strg" && tastaturArt === "computer";
}

function seiteAus(e: KeyEventLike): Seite | null {
  const code = e.code ?? "";
  if (code.endsWith("Left")) return "links";
  if (code.endsWith("Right")) return "rechts";
  return null;
}

/** „Links gefunden. Jetzt die rechte." - nach der ERSTEN Seite (gefunden ist `seite`). */
const SEITE_SAETZE: Record<BedienSprache, Record<Seite, string>> = {
  de: { links: "Links gefunden. Jetzt die rechte.", rechts: "Rechts gefunden. Jetzt die linke." },
  en: { links: "Left one found. Now the right one.", rechts: "Right one found. Now the left one." },
  fr: { links: "Celle de gauche, trouvée ! Maintenant celle de droite.", rechts: "Celle de droite, trouvée ! Maintenant celle de gauche." },
  es: { links: "¡La de la izquierda, encontrada! Ahora la de la derecha.", rechts: "¡La de la derecha, encontrada! Ahora la de la izquierda." },
  it: { links: "Quello a sinistra, trovato! Ora quello a destra.", rechts: "Quello a destra, trovato! Ora quello a sinistra." },
  pl: { links: "Lewy znaleziony! Teraz prawy.", rechts: "Prawy znaleziony! Teraz lewy." },
  tr: { links: "Soldaki bulundu! Şimdi sağdakini bul.", rechts: "Sağdaki bulundu! Şimdi soldakini bul." },
  cs: { links: "Levá je nalezená! Teď najdi pravou.", rechts: "Pravá je nalezená! Teď najdi levou." },
  bg: { links: "Левият е намерен. Сега намери десния.", rechts: "Десният е намерен. Сега намери левия." },
  el: { links: "Βρήκες το αριστερό. Τώρα βρες το δεξί.", rechts: "Βρήκες το δεξί. Τώρα βρες το αριστερό." },
  hu: { links: "Megvan a bal oldali. Most keresd meg a jobb oldalit.", rechts: "Megvan a jobb oldali. Most keresd meg a bal oldalit." },
  nl: { links: "De linker gevonden. Nu de rechter.", rechts: "De rechter gevonden. Nu de linker." },
  pt: { links: "Encontraste a da esquerda. Agora a da direita.", rechts: "Encontraste a da direita. Agora a da esquerda." },
  br: { links: "Você achou a da esquerda. Agora a da direita.", rechts: "Você achou a da direita. Agora a da esquerda." },
  ro: { links: "Ai găsit-o pe cea din stânga. Acum pe cea din dreapta.", rechts: "Ai găsit-o pe cea din dreapta. Acum pe cea din stânga." },
  sv: { links: "Den vänstra hittad. Nu den högra.", rechts: "Den högra hittad. Nu den vänstra." },
  uk: { links: "Ліву знайдено. Тепер знайди праву.", rechts: "Праву знайдено. Тепер знайди ліву." },
};

/** Der Satz nach der ersten Seite - auch für den Schirm. */
export function seitenSatz(seite: Seite, sprache: BedienSprache = "de"): string {
  return SEITE_SAETZE[sprache][seite];
}

/** Was `findenSchritt` sagt: die Schritte der Suchrunde, dazu „eine Seite gefunden". */
export type FindenSchritt = SuchSchritt | { art: "seite"; seite: Seite; ansage: string; neu: boolean };

/* ══ Ein Schritt ════════════════════════════════════════════════════════════ */

/** Welche Taste gedrückt wurde - Sondertaste, Zeichen oder keine bekannte. */
type Gedrueckt =
  | { art: "sonder"; taste: TastenName }
  | { art: "zeichen"; zeichen: string }
  | { art: "veraenderer" }
  | null;

/** Shift, AltGr, Strg … - nicht die Feststelltaste, die ist eine eigene Aufgabe. */
function istStummerVeraenderer(e: KeyEventLike, taste: TastenName | null): boolean {
  return VERAENDERER.has(e.key) && taste?.id !== "feststell";
}

function gedruecktAus(e: KeyEventLike, plattform: Plattform): Gedrueckt {
  const taste = tasteFuerEreignis(e, plattform);
  if (taste) return { art: "sonder", taste };
  if (istStummerVeraenderer(e, null)) return { art: "veraenderer" };
  if (e.key.length === 1) return { art: "zeichen", zeichen: e.key };
  return null;
}

/** Trifft das gedrückte Zeichen das gesuchte? Buchstaben auch mit Shift. */
function trifftZeichen(gedrueckt: string, ziel: string, layout: KeyboardLayout): boolean {
  if (gedrueckt === ziel) return true;
  if (istBuchstabe(ziel) && kleinFuer(gedrueckt, layoutSprache(layout)) === ziel) return true;
  // Eine Taste ohne Zusatz (Ziffer, Punkt …) gilt auch mit Shift gedrückt:
  // gesucht ist die TASTE, und die war richtig.
  return layout.access[ziel]?.mod === undefined && layout.access[gedrueckt]?.base === ziel;
}

/**
 * Ein Tastendruck in der Runde - dieselben vier Schritte wie `suchSchritt`.
 * `null`: nichts zu tun (Runde vorbei, oder ein stummer Veränderer, während
 * ein Zeichen gesucht wird).
 */
export function findenSchritt(opts: {
  e: KeyEventLike;
  ziele: readonly FindenZiel[];
  index: number;
  bestaetigt: boolean;
  /** Nach dem ersten Treffer kam eine andere Taste (D1, Testerin 18.10.2026). */
  dazwischen?: boolean;
  plattform: Plattform;
  layout: KeyboardLayout;
  sprache?: BedienSprache;
  /** Bei Tasten mit zwei Seiten: die Seite, die schon gefunden ist. */
  seite?: Seite;
  /** Computer oder Laptop - Strg rechts zählt nur an der Computer-Tastatur. */
  tastaturArt?: "computer" | "laptop";
  /** `getModifierState("CapsLock")` nach dem Druck der Feststelltaste. */
  feststellAn?: boolean;
  /**
   * ★ Testerin 09.11.2026 (m5osk1wp8nsf8x6), Johannes 11.11.: Wie im Schreibtrainer gehört zu einem
   * Zeichen mit Umschalttaste die Umschalttaste der GEGENHAND. Gilt nur mit `gegenhand`
   * (aus bei „Einhand schreiben") und nur, wenn die gehaltene Seite bekannt ist.
   */
  gegenhand?: boolean;
  /** Welche Umschalttaste gerade gehalten wird (aus `ShiftLeft`/`ShiftRight` gemerkt). */
  shiftGehalten?: Hand | null;
}): FindenSchritt | null {
  const { e, ziele, index, plattform, layout, sprache = "de", tastaturArt = "computer" } = opts;
  const gesucht = ziele[index];
  if (!gesucht) return null;
  const g = gedruecktAus(e, plattform);

  let treffer: boolean;
  if (gesucht.art === "zeichen") {
    // Die Schneerutschen-Falle: Shift & Co. sind hier nur der halbe Weg.
    if (g?.art === "veraenderer" || (g?.art === "sonder" && istStummerVeraenderer(e, g.taste))) {
      // ★ Testerin 08.11.2026: Nach dem ersten Treffer ist Shift (links) eine gültige „andere Taste
      // dazwischen" - vorher kam keine Antwort, die Runde blieb stehen. Gilt nur, wenn das Ziel
      // selbst kein Shift braucht (sonst wäre Shift + D immer schon „dazwischen").
      const alsDazwischen = opts.bestaetigt && !opts.dazwischen && !gesucht.mod;
      if (!alsDazwischen) return null;
    }
    treffer = g?.art === "zeichen" && trifftZeichen(g.zeichen, gesucht.zeichen, layout);
    if (treffer && opts.gegenhand && gesucht.mod === "shift" && opts.shiftGehalten) {
      const verlangt = shiftHandFor(gesucht.zeichen, layoutSprache(layout));
      if (verlangt && verlangt !== opts.shiftGehalten) {
        const ziel = nennungKurz(gesucht, "akkusativ", plattform, sprache);
        const seite = sprache === "de" ? (verlangt === "links" ? "linke" : "rechte") : verlangt === "links" ? "left" : "right";
        return {
          art: "daneben",
          ansage:
            sprache === "de"
              ? `Fast. Für ${ziel} nimmst du die ${seite} Umschalttaste, die der anderen Hand.`
              : `Almost. For ${ziel} use the ${seite} Shift key, the one on the other hand.`,
        };
      }
    }
  } else {
    treffer = g?.art === "sonder" && g.taste.id === gesucht.taste.id;
  }

  const t = FINDEN_SAETZE[sprache];
  if (!treffer) {
    const ziel = nennungKurz(gesucht, "akkusativ", plattform, sprache);
    const lage =
      gesucht.art === "sonder"
        ? t.sonderLage(gesucht.taste, plattform)
        : wegZumZeichen(gesucht.mod, plattform, sprache);
    const nachsatz = lage ? ` ${lage}` : "";
    if (!g || g.art === "veraenderer") {
      return { art: "daneben", ansage: `${t.unbekannt} ${t.finde(ziel)}` };
    }
    const das =
      g.art === "zeichen"
        ? zeichenImSatz(g.zeichen, sprache, "nominativ")
        : t.sonderNennung(g.taste, "nominativ", plattform);
    return { art: "daneben", ansage: t.dasIst(das, ziel, nachsatz) };
  }

  // ★ Testerin 04.11.2026: eine Taste mit zwei Seiten ist erst gefunden, wenn
  // BEIDE gedrückt sind. Die andere Seite ist selbst schon die „andere Taste
  // dazwischen" - der zweite Druck bestätigt, wie sonst die Wiederholung.
  const seite = gesucht.art === "sonder" && zweiseitig(gesucht.taste.id, plattform, tastaturArt) ? seiteAus(e) : null;
  let sitztSchon = false;
  if (seite) {
    if (!opts.seite || opts.seite === seite) {
      const satz = seitenSatz(seite, sprache);
      const funktion = opts.seite ? "" : funktionsSatz(gesucht, plattform, layout.id, sprache);
      return { art: "seite", seite, neu: !opts.seite, ansage: funktion ? `${satz} ${funktion}` : satz };
    }
    sitztSchon = true;
  }

  // ★ Testerin 04.11.2026 (Meldung p20iv0clc9c0tph): „Schreibt jetzt alles groß?"
  // kann ein Kind im laufenden Programm nicht feststellen. Die Feststelltaste
  // sagt, ob sie an ist und wie man wieder klein schreibt (seit 28.10. weiss
  // das Fenster es: `getModifierState("CapsLock")`).
  const zustand =
    gesucht.art === "sonder" && gesucht.taste.id === "feststell" && opts.feststellAn !== undefined
      ? feststellZustand(sprache, opts.feststellAn)
      : "";

  // D1: Der zweite Treffer zählt erst, wenn dazwischen eine andere Taste kam.
  if (!sitztSchon && (!opts.bestaetigt || !opts.dazwischen)) {
    const gefunden = findenGefunden(gesucht, plattform, sprache);
    // Die Funktion nur beim ERSTEN Treffer - derselbe Druck noch einmal wiederholt sie nicht.
    // Bei der Feststelltaste sagt der Zustand schon, was sie tut.
    const funktion = opts.bestaetigt || zustand ? "" : funktionsSatz(gesucht, plattform, layout.id, sprache);
    const dazu = [funktion, zustand].filter(Boolean).join(" ");
    return { art: "gefunden", ansage: dazu ? `${gefunden} ${dazu}` : gefunden };
  }

  const naechste = index + 1;
  const sitzt = zustand ? `${t.zeichenBestaetigt} ${zustand}` : bestaetigt(gesucht, plattform, sprache);
  if (naechste >= ziele.length) {
    return { art: "fertig", ansage: t.fertig(sitzt, ziele.length) };
  }
  return {
    art: "weiter",
    naechste,
    ansage: `${sitzt} ${findenAuftrag(ziele[naechste]!, plattform, sprache)}`,
  };
}
