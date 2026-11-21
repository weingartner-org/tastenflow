/**
 * ★★★ DIE SCHREIBWEISE - britisch oder amerikanisch (★ E9, 24.09.2026).
 *
 * Bauplan: `apps/tastenflow/BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md`, §8.
 *
 * ★★★ GRUNDSATZ (§8.1): „Amerikanisch ist EIN Lehrgang, ZWEI Schreibweisen."
 * Reihenfolge, Stufen, Tippchallenge und Lektionen (`lernweg.ts`) sind für
 * „gb" und „us" GLEICH. Verschieden sind nur Wortformen, Anführungszeichen
 * und ein paar Tastengriffe. Die Schreibweise ist darum KEIN Lernweg - sie
 * darf jederzeit wechseln (anders als `Lernweg`, D2), weil an ihr keine
 * einzige Taste hängt.
 *
 * ── ZWEI VERSCHIEDENE ANWENDUNGEN, ZWEI KARTEN ──────────────────────────────
 *  · {@link WOERTER_GB_ZU_US} - für ÜBUNGSTEXTE (Korpus, Serien, Wortspiele,
 *    Lektions-Einführungen): nur, wo `lang === "en"`. Angewandt NACH der
 *    Ledger-Kennung (`bausteinId` liest immer den britischen Rohtext) und
 *    NACH `fitText` (dessen Freischalt-Prüfung bleibt gegen den britischen
 *    Text - siehe {@link wandleSchreibweise}).
 *  · {@link WOERTER_UI_GB_ZU_US} - für die BEDIENUNG (Schalter, Hinweise,
 *    Menüs): eine dünne Überlagerung der englischen Texttabelle
 *    (`bedienSprache/texte.ts`), unabhängig von der Übungssprache.
 *
 * ── WOMIT DIE SCHREIBWEISE FESTGESTELLT WIRD (§1.2 F5) ──────────────────────
 *  1. eine gemerkte Wahl (Schalter, `localStorage`),
 *  2. sonst die Vorgabe der Klasse (`tt_classes.schreibweise`),
 *  3. sonst die Sprachliste des Browsers: `en-US` ⇒ amerikanisch, jede andere
 *     `en-*` (GB, IE, AU, NZ, ZA, CA, IN …) ⇒ britisch, keine ⇒ britisch.
 * Reine Entscheidung: {@link bestimmeSchreibweise}. Nur relevant, wenn die
 * BEDIENUNGSSPRACHE Englisch ist - eine deutsche Bedienung fragt nie danach.
 *
 * ★★★★★ DAS TOR (Review 24.09.2026, Lead-Rückmeldung zu E9): Die UI-Über-
 * lagerung (`bedienSprache/texte.ts`) trifft SOFORT jede englische Seite der
 * Plattform - auch Seiten, die mit dem englischen Lehrgang nichts zu tun
 * haben (Meine Klasse, Rechtstexte, Lernwerkstatt). Ein gemeinsames Bauteil
 * darf sein Verhalten nicht ändern, ohne dass das vorher entschieden wurde.
 * Darum steht VOR jeder Erkennung dasselbe Tor wie vor dem ganzen englischen
 * Lehrgang: der Schalter {@link englischLehrgangProbeAn} aus `lernweg.ts`
 * (derselbe Merker, keine zweite Kopie). Ist er AUS, liefert
 * {@link englischVariante} immer „gb" - unbesehen jeder gespeicherten Wahl,
 * jeder Klassen-Vorgabe und jeder Browser-Sprache. Die REINE Funktion
 * {@link bestimmeSchreibweise} kennt das Tor bewusst NICHT - sie bleibt ohne
 * Seiteneffekt testbar; das Tor steht einzig in der LEBENDEN Fassung
 * {@link englischVariante}.
 *
 * ★ FREIGABE 25.09.2026: Das Tor ist seither standardmässig OFFEN
 * (`englischLehrgangProbeAn()` liefert ohne Not-Aus `true`) - ein echter
 * `en-US`-Browser mit englischer Bedienung sieht die amerikanische
 * Schreibweise jetzt wirklich. Der Riegel bleibt nur als Not-Aus
 * (`?englisch-lehrgang=0`) erhalten; die UI-Überlagerung selbst trifft dank
 * `bedienSprache/texte.ts` (nur die `en`-Tabelle wird umschichtet) ohnehin
 * nie eine deutsche Bedienung.
 */
import { browserSprachen } from "../bedienSprache/sprache";
import type { Lang } from "./account";
import { istGeruestSprache } from "./sprachRegister";
import { englischLehrgangProbeAn } from "./lernweg";
import { franzVariante, type FranzVariante } from "./franzVariante";
import { activeLayoutId, type LayoutId } from "./layouts";

/** Britisch oder amerikanisch - die Schreibweise der englischen Inhalte/Bedienung. */
export type EnglischVariante = "gb" | "us";

export function istEnglischVariante(x: unknown): x is EnglischVariante {
  return x === "gb" || x === "us";
}

/** Die gemerkte Wahl (Schalter der Bedienung, oder eine Klasse, die sie festlegt). */
export const SCHREIBWEISE_SCHLUESSEL = "tastenflow-schreibweise";

// ⚠️ Jeder Zugriff auf `localStorage` in `try/catch` (wie `bedienSprache/sprache.ts`):
// Safari im privaten Modus und Browser mit gesperrten Websitedaten werfen schon
// beim Zugriff.
function lies(schluessel: string): string | null {
  try {
    return window.localStorage.getItem(schluessel);
  } catch {
    return null;
  }
}

function schreib(schluessel: string, wert: string): void {
  try {
    window.localStorage.setItem(schluessel, wert);
  } catch {
    /* Speicher gesperrt - dann gilt die Wahl eben nur bis zum Neuladen. */
  }
}

/** Die gemerkte Schreibweise, oder `null`, wenn auf diesem Gerät noch keine feststeht. */
export function gespeicherteSchreibweise(): EnglischVariante | null {
  const w = lies(SCHREIBWEISE_SCHLUESSEL);
  return istEnglischVariante(w) ? w : null;
}

export function schreibweiseMerken(variante: EnglischVariante): void {
  schreib(SCHREIBWEISE_SCHLUESSEL, variante);
}

/**
 * F5: `en-US` (mit Bindestrich ODER Unterstrich, wie Browser sie liefern) ⇒
 * amerikanisch. Jede andere Sprache, die mit `en` beginnt (GB, IE, AU, NZ,
 * ZA, CA, IN …) ⇒ britisch. Kommt in der ganzen Liste kein Englisch vor (oder
 * ist sie leer), gilt britisch - die Grundform der Inhalte (§8.2).
 *
 * Anders als `erkenneBedienSprache`: hier wird NICHT nach der ersten
 * passenden Sprache gesucht, sondern die erste ENGLISCHE Sprache der Liste
 * entscheidet - eine Liste `["fr", "en-US"]` ist damit amerikanisch, auch
 * wenn Französisch vorne steht (Englisch ist ohnehin nur relevant, wenn die
 * Bedienung schon Englisch ist).
 */
export function erkenneVarianteAusSprachen(sprachen: readonly string[]): EnglischVariante {
  for (const s of sprachen) {
    const code = s.trim();
    if (/^en[-_]us(?:[-_]|$)/i.test(code)) return "us";
    if (/^en(?:[-_]|$)/i.test(code)) return "gb";
  }
  return "gb";
}

/**
 * ★★★ DIE ENTSCHEIDUNG - die ganze Regel an EINER Stelle (§1.2 F5).
 * Rein: liest nichts, schreibt nichts.
 */
export function bestimmeSchreibweise(opts: {
  gespeichert: EnglischVariante | null | undefined;
  klassenVorgabe?: EnglischVariante | null | undefined;
  /**
   * ★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.4, Johannes
   * Entscheidung 6): die gewählte TASTATUR - zwischen Klasse und Browser, wie
   * beim Französischen (`bestimmeFranzVariante`). Bis W1 zählte sie hier
   * nicht: ein Kind an einer US-Tastatur mit britischem (oder deutschem)
   * Browser bekam britische Schreibung und britisches Datum. `us` ⇒
   * amerikanisch, `uk` ⇒ britisch; jede andere Tastatur sagt nichts.
   * Optional - ohne Angabe wie vor W1.
   */
  layout?: LayoutId | null;
  sprachen: readonly string[];
}): EnglischVariante {
  if (istEnglischVariante(opts.gespeichert)) return opts.gespeichert;
  if (istEnglischVariante(opts.klassenVorgabe)) return opts.klassenVorgabe;
  if (opts.layout === "us") return "us";
  if (opts.layout === "uk") return "gb";
  return erkenneVarianteAusSprachen(opts.sprachen);
}

/**
 * Die Schreibweise, die gerade gilt - ohne React, wie `aktuelleBedienSprache()`.
 *
 * @param klassenVorgabe die Einstellung der Klasse (`tt_classes.schreibweise`),
 *   sofern das Kind einer Klasse angehört und sie eine Vorgabe trägt. `null`/
 *   `undefined`/leer heisst „automatisch" (Stufe 3 der Entscheidung).
 */
export function englischVariante(
  klassenVorgabe?: EnglischVariante | null | undefined,
): EnglischVariante {
  // ★★★★★ DAS TOR (siehe Kopf-Doku): ohne den Probe-Schalter des englischen
  // Lehrgangs bleibt es UNBEDINGT bei „gb" - eine gemerkte Wahl, eine
  // Klassen-Vorgabe oder ein US-Browser werden dann gar nicht erst gelesen.
  if (!englischLehrgangProbeAn()) return "gb";
  return bestimmeSchreibweise({
    gespeichert: gespeicherteSchreibweise(),
    klassenVorgabe,
    // ★ W1: die Tastatur dieses Geräts (siehe `bestimmeSchreibweise`).
    layout: activeLayoutId(),
    sprachen: browserSprachen(),
  });
}

/**
 * Die Schreibweise-VORGABE einer Klasse (`TypingClass.schreibweise`), oder
 * `null`, wenn sie keine trägt („automatisch"). Reine Auslese, wie
 * `lernwegVon` - nimmt alles, was ein Feld `schreibweise` tragen kann.
 *
 * ★★★ AUFRUF: `englischVariante(schreibweiseVon(klasse))` - die Klassen-
 * Vorgabe gewinnt über die Browser-Erkennung, eine GEMERKTE persönliche Wahl
 * gewinnt über die Klasse (dieselbe Rangfolge wie überall in dieser Datei).
 */
export function schreibweiseVon(
  klasse: { schreibweise?: unknown } | null | undefined,
): EnglischVariante | null {
  const w = klasse?.schreibweise;
  return istEnglischVariante(w) ? w : null;
}

// ── Wortlisten und die Anwendung ─────────────────────────────────────────────

function wortRegex(wort: string): RegExp {
  if (wort.includes(" ")) {
    // eine Wortgruppe wie „full stop" - Wortgrenze vor dem ersten und nach
    // dem letzten Wort, das Leerzeichen dazwischen bleibt ein Leerzeichen.
    return new RegExp(`\\b${wort.replace(/ /g, "\\s+")}\\b`, "gi");
  }
  return new RegExp(`\\b${wort}\\b`, "gi");
}

/** Überträgt die Gross-/Kleinschreibung der Fundstelle auf das neue Wort. */
function gleicheGrossschreibung(fundstelle: string, ersatz: string): string {
  if (fundstelle === fundstelle.toUpperCase() && fundstelle !== fundstelle.toLowerCase()) {
    return ersatz.toUpperCase();
  }
  const ersterBuchstabeGross = fundstelle.charAt(0) === fundstelle.charAt(0).toUpperCase();
  const restKlein = fundstelle.slice(1) === fundstelle.slice(1).toLowerCase();
  if (ersterBuchstabeGross && restKlein) {
    return ersatz.charAt(0).toUpperCase() + ersatz.slice(1);
  }
  return ersatz;
}

function ersetzeWorte(text: string, karte: Readonly<Record<string, string>>): string {
  let out = text;
  for (const [gb, us] of Object.entries(karte)) {
    if (!out.toLowerCase().includes(gb)) continue; // billiger Vorab-Test, spart die Regex meistens
    out = out.replace(wortRegex(gb), (fund) => gleicheGrossschreibung(fund, us));
  }
  return out;
}

/**
 * ★★★ DIE ÜBUNGSTEXT-KARTE (§8.2) - britisch → amerikanisch, nur EINDEUTIGE
 * Wörter (Bauplan, Auftrag Punkt 2). Bewusst NICHT dabei, weil mehrdeutig:
 * practise/practice (Verb/Nomen), fall/autumn, football, tyre (Verb „tire"),
 * cheque (Verb/Nomen „check"), programme (Sendung vs. Programm - siehe
 * `{gb|us}`-Markup unten), sowie jedes Wort, das nur mit Kontext sicher wäre.
 *
 * ⚠️ Jede Charge, die hier ein Wort einträgt, prüft VORHER am Text (§6.2/
 * `tests/tastenflow-schreibweise-tier-waechter.test.ts`), ob die Ersetzung die
 * Sprosse einer Zeile verschiebt - siehe die Kopf-Doku dieser Datei.
 */
export const WOERTER_GB_ZU_US: Readonly<Record<string, string>> = Object.freeze({
  colour: "color",
  colours: "colors",
  favourite: "favorite",
  favourites: "favorites",
  centre: "center",
  centres: "centers",
  metre: "meter",
  metres: "meters",
  litre: "liter",
  litres: "liters",
  grey: "gray",
  neighbour: "neighbor",
  neighbours: "neighbors",
  harbour: "harbor",
  harbours: "harbors",
  humour: "humor",
  honour: "honor",
  honours: "honors",
  travelled: "traveled",
  travelling: "traveling",
  jewellery: "jewelry",
  mum: "mom",
  mums: "moms",
  maths: "math",
  aeroplane: "airplane",
  aeroplanes: "airplanes",
  defence: "defense",
  defences: "defenses",
  catalogue: "catalog",
  catalogues: "catalogs",
  plough: "plow",
  ploughs: "plows",
  ploughed: "plowed",
  ploughing: "plowing",
  pyjamas: "pajamas",
  cosy: "cozy",
  organise: "organize",
  organised: "organized",
  organising: "organizing",
  organises: "organizes",
  realise: "realize",
  realised: "realized",
  realising: "realizing",
  realises: "realizes",
  recognise: "recognize",
  recognised: "recognized",
  recognising: "recognizing",
  recognises: "recognizes",
  apologise: "apologize",
  apologised: "apologized",
  apologising: "apologizing",
  apologises: "apologizes",
});

/**
 * Wörter, die BEWUSST NICHT in {@link WOERTER_GB_ZU_US} stehen, weil eine
 * automatische Ersetzung mehrdeutig wäre (Auftrag Punkt 2). Nur zum
 * Nachschlagen aus Wächtern/Berichten - keine Ersetzung nimmt diese Liste.
 */
export const AMBIGE_WORTE: readonly string[] = [
  "practise",
  "practice",
  "fall",
  "football",
  "tyre",
  "tire",
  "check",
  "cheque",
  "programme",
  "program",
];

/**
 * Das Markup `{colour|color}` für Fälle, die die Karte nicht automatisch
 * trifft - ABSICHTLICH ohne jedes Leerzeichen in den beiden Seiten: Die
 * Programmcode-Texte der Tippchallenge enthalten echte Syntax wie
 * `{ self | rhs }` (Rust) - MIT Leerzeichen um das `|`. Ohne diese Einschränkung
 * hätte der Wächter (`tests/tastenflow-schreibweise.test.ts` §6) genau das
 * gefunden: Code wurde als Markup missverstanden und verstümmelt.
 */
const MARKUP_RE = /\{([^\s{}|]+)\|([^\s{}|]+)\}/g;

/**
 * ★★★ WENDET DIE SCHREIBWEISE AUF EINEN ÜBUNGSTEXT AN - die „letzte
 * Servierstufe" (Bauplan Auftrag Punkt 2): NACH `fitText`, NACH der
 * Ledger-Kennung (die liest immer den britischen Rohtext, siehe `ledger.ts`
 * `bausteinId`). Ein Wechsel der Schreibweise verändert darum nie, was ein
 * Kind schon getippt hat.
 *
 * Reihenfolge: zuerst das `{gb|us}`-Markup (deckt Fälle ab, die die Karte
 * nicht automatisch trifft - z. B. „programme" als Sendung), dann die Karte.
 * Bei „gb" verschwindet nur das Markup (immer die linke Seite) - die Karte
 * wird gar nicht erst durchsucht.
 */
export function wandleSchreibweise(text: string, variante: EnglischVariante): string {
  const ohneMarkup = text.replace(MARKUP_RE, (_treffer, gb: string, us: string) =>
    variante === "us" ? us : gb,
  );
  if (variante === "gb") return ohneMarkup;
  return ersetzeWorte(ohneMarkup, WOERTER_GB_ZU_US);
}

// ── Die UI-Überlagerung (§8.3) ───────────────────────────────────────────────

/**
 * ★★★ DIE UI-KARTE (§8.3) - eine DÜNNE Überlagerung der Bedienung, keine
 * dritte Sprache. Whole-word, Gross-/Kleinschreibung bleibt erhalten (siehe
 * {@link gleicheGrossschreibung}) - „Pupil" wird „Student", „pupils" wird
 * „students".
 *
 * ⚠️ Ein FEHLENDER Schlüssel fällt auf Britisch zurück, nie auf leer (§8.3) -
 * diese Karte ist eine ZUSÄTZLICHE Ersetzung über der fertigen englischen
 * Tabelle, kein Ersatz dafür.
 */
export const WOERTER_UI_GB_ZU_US: Readonly<Record<string, string>> = Object.freeze({
  pupil: "student",
  pupils: "students",
  practise: "practice",
  practising: "practicing",
  "full stop": "period",
  maths: "math",
  colour: "color",
  favourite: "favorite",
  programme: "program",
  centre: "center",
  organise: "organize",
  cancelled: "canceled",
  enrol: "enroll",
});

/** Wendet die UI-Karte auf einen Bedienungstext an (immer Richtung „us"). */
export function wandleUiSchreibweise(text: string): string {
  return ersetzeWorte(text, WOERTER_UI_GB_ZU_US);
}

/** Das `lang`-Attribut für Englisch, je nach Schreibweise. */
export function langAttribut(variante: EnglischVariante): "en-GB" | "en-US" {
  return variante === "us" ? "en-US" : "en-GB";
}

/**
 * ★★★ DAS `lang`-ATTRIBUT AM ÜBUNGSTEXT - wie {@link langAttribut}, aber mit
 * DEMSELBEN TOR wie {@link englischVariante} (§9/E10, Bauplan §8.1, Übergabe
 * 24.09. §3: „langAttribut() gebaut, nicht angebunden").
 *
 * Ohne den Probe-Schalter des englischen Lehrgangs bleibt „en" ein blosses
 * „en" - byte-identisch zu jeder Zeit vor E10, denn eine gespeicherte Wahl,
 * eine Klassen-Vorgabe oder ein US-Browser werden dann gar nicht erst
 * gelesen (dasselbe Tor wie in `englischVariante`). Erst mit dem Schalter
 * wird daraus „en-GB"/„en-US". „de" und `undefined` (kein aktiver
 * Sprachbereich) kommen unverändert zurück.
 *
 * @param lang die grobe Sprache dieses Textknotens (`Lang` aus `account.ts`,
 *   also „de" | „en" | „fr"), oder `undefined`, wenn (noch) kein
 *   `lang`-Attribut gesetzt werden soll.
 * @param klassenVorgabe wie bei {@link englischVariante}/{@link franzVariante} -
 *   die Einstellung der Klasse, sofern eine feststeht. Nur EINE der beiden
 *   Varianten kann zu `lang` passen; die andere wird ignoriert.
 *
 * ★ E12 (26.09.2026, Bauplan §11.1 Punkt 4, Auftrag Punkt 5): „fr" bekommt
 * jetzt dieselbe Verfeinerung wie „en" - `franzVariante()` liefert
 * `fr-FR`/`fr-BE`/`fr-CH`/`fr-CA` nach derselben Rangfolge (gemerkte Wahl >
 * Klasse > Browser) und demselben Tor (Not-Aus `?franzoesisch-lehrgang=0`
 * lässt es bei „fr"). Bis E2a stand hier „fr kommt unverändert zurück" - das
 * war nur richtig, SOLANGE es `franzVariante()` noch nicht gab.
 *
 * ★ ES-F2 (27.09.2026): „es" dazu - bekommt NOCH KEINE Verfeinerung (keine
 * `esVariante()`, kommt erst mit ES-F6/F7) und kommt darum wie „de"
 * unverändert zurück; das ist bereits „es-ES" (`SPRACH_TAG`, `vorlesen.ts`),
 * also richtig, kein Platzhalter.
 */
export function feinesLangAttribut(
  sprache: Lang | undefined,
  klassenVorgabe?: EnglischVariante | FranzVariante | null | undefined,
): string | undefined {
  // ★★★ SPRACHEN-9 (30.10.2026): die neun neuen Wege zeigen eigene Zeilen - das Attribut nennt ihre Sprache. Vorher stand `lang="en"`,
  // eine Sprachausgabe hätte bulgarische oder griechische Zeilen mit englischer Stimme gelesen. „br" ist kein Sprach-Tag (Bretonisch).
  if (sprache !== undefined && istGeruestSprache(sprache)) return sprache === "br" ? "pt-BR" : sprache;
  // ★★★ Johannes 31.10.2026: JEDE Sprache nennt sich selbst, damit NVDA, JAWS und Narrator wissen, welche Sprache sie sprechen.
  // it/pl/tr/cs trugen hier noch `lang="en"` aus der Gerüst-Zeit (G2a), obwohl ihre Zeilen längst eigene sind: gemessen `<LANG:en_GB>`.
  const lang = sprache;
  if (lang === "fr") {
    const vorgabe = klassenVorgabe && klassenVorgabe.startsWith("fr") ? (klassenVorgabe as FranzVariante) : null;
    return franzVariante(vorgabe);
  }
  if (lang !== "en") return lang;
  if (!englischLehrgangProbeAn()) return "en";
  const vorgabe = klassenVorgabe && !klassenVorgabe.startsWith("fr") ? (klassenVorgabe as EnglischVariante) : null;
  return langAttribut(englischVariante(vorgabe));
}
