/**
 * Alters-gestufter Text-Korpus des 10-Finger-Trainers „Tastenflow":
 * Witze, Zungenbrecher, Wortspiele, Sprüche, Fakten und ganze Sätze, jeweils
 * einer oder mehreren Altersstufen (a/b/c/erwachsen) zugeordnet.
 *
 * Die eigentlichen Daten liegen in `corpusData.ts` (maschinell erzeugt und
 * adversarisch geprüft: Rechtschreibung, Alterseignung, Anti-Cringe,
 * Faktencheck). Diese Datei enthält Typen + Auswahl-Logik.
 *
 * KERNREGEL (so früh wie möglich sinnvolle Texte): `corpusItemsFor` gibt
 * Einträge zurück, sobald deren BUCHSTABEN (und Ziffern) freigeschaltet sind —
 * angepasst an den Lernstand:
 *   • Großbuchstaben sind IMMER tippbar (Auto-Großschreibung bis zur Umschalt-
 *     taste, danach echt mit Umschalt) → die Schreibung bleibt stets KORREKT.
 *   • Noch nicht gelernte Satzzeichen werden WEGGELASSEN („ohne Punkt und
 *     Beistrich"), statt den ganzen Text zu sperren.
 * Fehlt hingegen ein Buchstabe, eine Ziffer oder ein Apostroph (aus „don't"
 * darf nie falsches „dont" werden), passt der Text (noch) nicht — eine
 * ungelernte Buchstaben-/Ziffern-Taste wird NIE verlangt. Siehe
 * [[project_zehnfinger_trainer]].
 *
 * ⚠️ NACH JEDER INHALTS-CHARGE (hier oder in einer der corpus*-Dateien):
 *        npx tsx scripts/erzeuge-korpus-anker.mts
 * Am Content-Manifest (corpusManifest.ts) hängt das No-Repeat-Ledger echter
 * Kinder-Konten: ein Bitset über die POSITION jeder schon getippten Zeile. Seit
 * L1 (21.08.2026) gibt `KORPUS_ANKER` (corpusAnker.ts) diese Positionen vor —
 * neue Zeilen dürfen deshalb überall stehen, müssen aber im Anker nachgetragen
 * werden. Wer es vergisst, wird von `tests/typing-ledger-anker.test.ts` erinnert.
 */
import type { Lang, Stufe } from "./account";
import { contentStufenFor } from "./account";
import type { Tier } from "./tiers";
import { KLAMMER_PAARE, lernwegDef, type Lernweg } from "./lernweg";
import { wandleSchreibweise, type EnglischVariante } from "./schreibweise";
import { wandleTypografie, type FranzVariante } from "./franzVariante";
import type { EsVariante } from "./esVariante";
import { activeLayout, toLayoutText, zugangFuer, type KeyboardLayout } from "./layouts";
import { KOMBIZEICHEN, grossbuchstabeWeg, istTotasteDerListen, kombizeichenFuerLayout, kombizeichenZu } from "./totasten";
import { isDeactivated } from "./corpusDeactivated";
import { bausteinKey } from "./ledger";
import { FRUEH_FASSUNGEN } from "./fruehFassungen";
import { istBuchstabe, istGeruestSprache, kleinFuer } from "./sprachRegister";
// ★★★ 28.09.2026: Die Texte selbst kommen aus den SPRACHPAKETEN
// (`sprachpaketDe|En|Fr|Es.ts`), geladen erst, wenn ein Kind sie braucht -
// siehe `sprachpakete.ts`. Hier stehen nur noch die Listen, die daraus werden.
import { beiSprachpaket, fehlZugriff, sprachpaketGeladen } from "./sprachpakete";
import { mitRueckfallEn } from "@/lib/typing/sprachRegister";
// ★ G3c-VERTEILER (25.10.2026): ein leerer Korpus eines Gerüst-Weges fällt auf den englischen (wie im Gerüst).
import { eigenOderEn } from "./geruestRueckfall";

export type CorpusKind =
  | "witz"
  | "zungenbrecher"
  | "wortspiel"
  | "spruch"
  | "sprichwort"
  | "fakt"
  | "satz"
  | "wissen"
  | "rechnung";

/**
 * Herkunft/Rechte eines kuratierten Textes (Textwelt §10; erfasst ab TW-E5). Nur
 * bei ÜBERNOMMENEN Texten nötig (CC/gemeinfrei) — Grundlage für die Namensnennung
 * im „Quellen & Dank"-Bereich der App. Selbst verfasste Texte tragen ein eigenes
 * Werk als `lizenz` (kein Autor/Fundstelle nötig).
 */
export interface Herkunft {
  /** Woher der Text stammt (Werk/Plattform), z. B. "Klexikon" oder "Sensorik". */
  quelle: string;
  /** Lizenz, z. B. "CC-BY-SA 4.0", "gemeinfrei", "Eigenes Werk". */
  lizenz: string;
  /** Urheber:in (bei CC-BY/BY-SA Pflicht). */
  autor?: string;
  /** Fundstelle (URL/Verweis) für die Nachvollziehbarkeit. */
  fundstelle?: string;
  /**
   * ★ Dieselbe Angabe auf ENGLISCH (23.09.2026) - für die englische Bedienung.
   * Ohne sie zeigt die Bücherei die deutsche Angabe (als `lang="de"`
   * ausgezeichnet). Zuerst bei den African-Storybook-Serien: deren Lizenz
   * verlangt die Nennung, und Leserinnen und Leser der englischen Fassung
   * sollen sie verstehen.
   */
  en?: { quelle: string; lizenz: string; autor?: string };
}

export interface CorpusItem {
  /** Die zu tippende Zeile (fertig formatiert, inkl. Groß-/Kleinschreibung). */
  text: string;
  kind: CorpusKind;
  /** Altersstufen, für die der Eintrag geeignet ist. */
  stufen: Stufe[];
  /**
   * NEU (Textwelt, TW-E1 — alle optional, abwärtskompatibel):
   *  • `minTier` = ab welchem Lernstand tippbar (siehe tiers.ts); zur Laufzeit aus
   *    `minTierFor` ableitbar (TW-E4: NICHT redundant gespeichert).
   *  • `id` = stabile Baustein-ID fürs No-Repeat-Ledger (aus `bausteinId` ableitbar).
   *  • `topic` = Themen-Tag für Abwechslung/Filter.
   *  • `herkunft` = Quelle/Lizenz/Autor bei ÜBERNOMMENEN Texten (TW-E5, §10).
   */
  minTier?: Tier;
  id?: string;
  topic?: string;
  herkunft?: Herkunft;
  /**
   * ★ E4a (24.09.2026, Bauplan §6.2/§10): Nur auf DIESEM Lernweg servieren -
   * für Inhalt, der eigens für die Sprossen des Weges „en" geschrieben wird
   * (Grundlage: Bauplan §3.3a) und auf Weg „de" nichts verloren hat (andere
   * Reihenfolge, andere Tasten frei). Fehlt das Feld - wie bei JEDEM
   * heutigen Eintrag -, gilt der Text auf BEIDEN Wegen (unverändertes
   * Verhalten). Siehe `CorpusQuery.lernweg`.
   */
  nurWeg?: Lernweg;
}

/**
 * ★ E4a (24.09.2026, Bauplan §6.2/§10): passt ein Eintrag mit optionalem
 * `nurWeg` auf den gegebenen Lernweg? EINE Stelle für die Regel, die
 * `corpusItemsFor`/`corpusEntriesFor` (hier), `serienForStufe` (serien.ts)
 * und `arcsFor` (arcs.ts) gleichermassen brauchen - keine drei Kopien
 * derselben Zeile (`feedback_zwei_stellen_die_voneinander_nichts_wissen`).
 * Fehlt `nurWeg`, gilt der Eintrag auf JEDEM Weg.
 */
/**
 * ★★★ D-2 (28.09.2026, Didaktik-Synthese `recherche-didaktik-2026-09-27/
 * SYNTHESE-UND-ENTSCHEIDUNGEN.md`): ERWACHSENE bekommen vor der Umschalttaste
 * KEINE Grossbuchstaben. Die Auto-Grossschreibung (KERNREGEL oben: das Kind
 * tippt klein, das Programm setzt den Grossbuchstaben) bleibt die Brücke für
 * Kinder und Jugendliche (D-3); für die Stufe „erwachsen" gibt es vor ⇧ nur
 * Zeilen ohne Grossbuchstaben und im Generator Kleinschrift (auch Nomen
 * klein, wie TIPP10 L1-5). Alle gefundenen Lehrgänge zeigen vor der
 * Umschalttaste nur Kleinschrift; eine Auto-Grossschreibung kennt keiner.
 *
 * EINE Regel, hier - jeder Ort, der Texte auswählt, fragt sie
 * (`corpusItemsFor`/`corpusEntriesFor` über `CorpusQuery.umschalt`, Serien,
 * Themenstränge, Wort-Drill, Geläufigkeit). Wächter:
 * `tests/tastenflow-d2-kleinschrift-erwachsene.test.ts`.
 *
 * @param umschalt Ist die Umschalttaste (`⇧`) schon gelernt?
 */
export function nurKleinschrift(stufe: Stufe | undefined, umschalt: boolean): boolean {
  return !umschalt && stufe === "erwachsen";
}

/** Trägt der Text einen Grossbuchstaben (in irgendeiner Schrift)? */
export function hatGrossbuchstaben(text: string): boolean {
  return /\p{Lu}/u.test(text);
}

export function passtLernweg(nurWeg: Lernweg | undefined, lernweg: Lernweg): boolean {
  return nurWeg === undefined || nurWeg === lernweg;
}

/**
 * Schlüssel für Dedup: Sorte + auf Buchstaben/Ziffern reduzierter Text.
 * ★ G3a-SCHRIFT (25.10.2026): DIESELBE Rechnung wie `bausteinKey` (ledger.ts) - bis hierher eine Kopie der Formel.
 * Die Sprache ist der Weg der Zeile (`nurWeg`): eine Sprache mit `schluesselAlleBuchstaben` (die neun des Gerüsts)
 * behält jeden Buchstaben, sonst fielen alle kyrillischen und griechischen Zeilen zu EINER zusammen. Für jede Zeile
 * der acht Sprachen vor dem 25.10.2026 Zeichen für Zeichen der alte Schlüssel.
 */
function dedupKey(it: CorpusItem): string {
  return bausteinKey(it.kind, it.text, it.nurWeg);
}

/**
 * Gesamtkorpus: generierte (geprüfte) Einträge zuerst, danach handgepflegte
 * Ergänzungen. Doppelte (gleiche Sorte + gleicher Text) werden zusammengeführt,
 * ihre Altersstufen vereinigt.
 */
function mergeCorpus(items: CorpusItem[]): CorpusItem[] {
  const byKey = new Map<string, CorpusItem>();
  for (const it of items) {
    // ★ E4a-Nachbesserung (24.09.2026): der Lernweg gehört zum Schlüssel. Sonst
    // würde eine Zeile mit `nurWeg: "en"`, die zufällig wortgleich mit einer
    // gemeinsamen ist, mit ihr verschmolzen - und die gemeinsame Zeile wäre
    // danach für Weg „de" verschwunden (oder bekäme fremde Altersstufen).
    // Doppelte über die Wege hinweg verbietet ausserdem
    // `tests/tastenflow-lernweg-inhalt-keine-doppelten.test.ts`.
    const key = dedupKey(it) + "|" + (it.nurWeg ?? "");
    const ex = byKey.get(key);
    if (ex) {
      for (const s of it.stufen) if (!ex.stufen.includes(s)) ex.stufen.push(s);
      // Neue optionale Textwelt-Felder: erster Wert gewinnt, fehlende auffüllen.
      if (ex.minTier === undefined && it.minTier !== undefined) ex.minTier = it.minTier;
      if (ex.id === undefined && it.id !== undefined) ex.id = it.id;
      if (ex.topic === undefined && it.topic !== undefined) ex.topic = it.topic;
    } else {
      byKey.set(key, { ...it, stufen: [...it.stufen] });
    }
  }
  return [...byKey.values()];
}

/*
 * ★★★ DIE KORPORA JE SPRACHE (seit 28.09.2026 aus den Sprachpaketen).
 *
 * Bis dahin standen hier vier feste Listen aus statisch importierten Dateien
 * (`CORPUS` = Deutsch, `CORPUS_EN`, `CORPUS_FR` - `CORPUS_ES` kam unverändert
 * aus `corpusEs.ts`). Jetzt bringt jedes Sprachpaket seine Bausteine in genau
 * der Reihenfolge mit, in der sie hier zusammengeführt wurden, und die Liste
 * wird gebaut, sobald das Paket da ist - dieselbe Rechnung (`mergeCorpus`),
 * dasselbe Ergebnis (Wächter: `tests/sprachpakete-golden.test.ts`, gegen die
 * am 28.09. VOR dem Umbau gemessenen Werte).
 *
 * `export let`: Die Namen bleiben, wer sie liest, bekommt immer die aktuelle
 * Liste (lebendige Bindung). ⚠️ Nie auf oberster Ebene eines Moduls in eine
 * eigene Konstante kopieren - dort stünde für immer die Liste des
 * Ladezeitpunkts (vielleicht leer). Wer eine Sprache braucht, fragt
 * {@link korpusFuer}.
 *
 * ★ Spanisch geht seither ebenfalls durch `mergeCorpus` - gemessen am
 * 28.09.: kein Doppel, Inhalt Zeichen für Zeichen gleich (Golden-Test).
 */
/** Deutscher Gesamtkorpus (generiert + handgepflegt + alle Nachlagen). */
export let CORPUS: CorpusItem[] = [];
/** Englischer Gesamtkorpus (handgepflegt + Recherche-Schwarm + Nachlagen). */
export let CORPUS_EN: CorpusItem[] = [];
/**
 * ★ E8a (25./26.09.2026, Bauplan §15 Falle 1): eigener Korpus für Lernweg
 * „fr" - wie `CORPUS_EN`, NICHT als Zusatz zu `CORPUS` gedacht. Jede Zeile
 * trägt `nurWeg: "fr"` (siehe Kopf von `corpusFrWegFruehKids.ts`). Ohne
 * dieses eigene Array würde `corpusItemsFor` für Weg „fr" auf `CORPUS`
 * zurückfallen und deutsche Zeilen ohne `nurWeg` mit ausliefern - genau die
 * Falle, die der Bauplan nennt.
 */
export let CORPUS_FR: CorpusItem[] = [];
/** ★ ES-F5 (27.09.2026): der spanische Korpus (Lernweg „es"). */
export let CORPUS_ES: CorpusItem[] = [];
/**
 * ★★★ F5-it (02.10.2026): der italienische Korpus (Lernweg „it") - eigene Liste wie `CORPUS_ES`, NICHT als Zusatz
 * zu einer anderen gedacht. Bis zu den Text-Chargen (T1-T9) LEER: das Programm übt auf Weg „it" dann mit dem
 * Wort-Drill des Generators (`WORDS_IT`), nie mit deutschen oder englischen Sätzen (Falle 12/19/32). Jede Zeile
 * trägt `nurWeg: "it"`. Neue Chargen: Datei `corpusIt<Charge>.ts` anlegen, in `corpusIt.ts` anhängen, danach den Anker
 * neu erzeugen (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
export let CORPUS_IT: CorpusItem[] = [];
/**
 * ★★★ F5-pl (03.10.2026): der polnische Korpus (Lernweg „pl") - eigene Liste wie `CORPUS_IT`, NICHT als Zusatz zu einer anderen
 * gedacht. Bis zu den Text-Chargen (T1 ff.) LEER: das Programm übt auf Weg „pl" dann mit dem Wort-Drill des Generators
 * (`WORDS_PL`), nie mit deutschen oder englischen Sätzen (Falle 12/19/32). Jede Zeile trägt `nurWeg: "pl"`. Neue Chargen: Datei
 * `corpusPl<Charge>.ts` anlegen, in `corpusPl.ts` anhängen, danach den Anker neu erzeugen (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
export let CORPUS_PL: CorpusItem[] = [];
/**
 * ★★★ F5-tr (03.10.2026): der türkische Korpus (Lernweg „tr") - eigene Liste wie `CORPUS_IT`, NICHT als Zusatz zu einer anderen
 * gedacht. Bis zur Etappe T LEER: das Programm übt auf Weg „tr" dann mit dem Wort-Drill des Generators (`WORDS_TR`), nie mit
 * deutschen oder englischen Sätzen (Falle 12/19/32). Jede Zeile trägt `nurWeg: "tr"`. Neue Chargen: Datei `corpusTr<Charge>.ts`
 * anlegen, in `corpusTr.ts` anhängen, danach den Anker neu erzeugen (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
export let CORPUS_TR: CorpusItem[] = [];
/**
 * ★★★ F5-cs (03.10.2026): der tschechische Korpus (Lernweg „cs") - eigene Liste wie `CORPUS_IT`, NICHT als Zusatz zu einer anderen
 * gedacht. Bis zu den Text-Chargen LEER: das Programm übt auf Weg „cs" dann mit dem Wort-Drill des Generators (`WORDS_CS`), nie
 * mit englischen oder deutschen Sätzen (Falle 12/19/32; bis hierher gab `korpusFuer("cs")` den ENGLISCHEN Korpus, RÜCKFALL-EN).
 * Jede Zeile trägt `nurWeg: "cs"`. Neue Chargen: Datei `corpusCs<Charge>.ts` anlegen, in `corpusCs.ts` anhängen, danach den Anker
 * neu erzeugen (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
export let CORPUS_CS: CorpusItem[] = [];
/**
 * ★ G3c-VERTEILER (25.10.2026): die Korpora der neun Gerüst-Wege (bg, el, hu, nl, pt, br, ro, sv, uk) - eigene Listen wie `CORPUS_CS`, aus ihrem
 * Sprachpaket (`corpus<Xx>.ts`). Bis zur ersten Charge LEER; {@link korpusFuer} gibt dann den ENGLISCHEN Korpus (der Weg ist bis
 * zu seiner eigenen Reihenfolge ein Alias von „en"). Jede Zeile trägt `nurWeg: "<xx>"`; Anker: `scripts/erzeuge-korpus-anker.mts`.
 */
export let CORPUS_BG: CorpusItem[] = [];
export let CORPUS_EL: CorpusItem[] = [];
export let CORPUS_HU: CorpusItem[] = [];
export let CORPUS_NL: CorpusItem[] = [];
export let CORPUS_PT: CorpusItem[] = [];
export let CORPUS_BR: CorpusItem[] = [];
export let CORPUS_RO: CorpusItem[] = [];
export let CORPUS_SV: CorpusItem[] = [];
export let CORPUS_UK: CorpusItem[] = [];

beiSprachpaket((lang, daten) => {
  const liste = daten ? mergeCorpus([...daten.korpus]) : [];
  if (lang === "de") CORPUS = liste;
  else if (lang === "en") CORPUS_EN = liste;
  else if (lang === "fr") CORPUS_FR = liste;
  else if (lang === "es") CORPUS_ES = liste;
  else if (lang === "it") CORPUS_IT = liste;
  else if (lang === "pl") CORPUS_PL = liste;
  else if (lang === "tr") CORPUS_TR = liste;
  else if (lang === "cs") CORPUS_CS = liste;
  // ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Wege.
  else if (lang === "bg") CORPUS_BG = liste;
  else if (lang === "el") CORPUS_EL = liste;
  else if (lang === "hu") CORPUS_HU = liste;
  else if (lang === "nl") CORPUS_NL = liste;
  else if (lang === "pt") CORPUS_PT = liste;
  else if (lang === "br") CORPUS_BR = liste;
  else if (lang === "ro") CORPUS_RO = liste;
  else if (lang === "sv") CORPUS_SV = liste;
  else if (lang === "uk") CORPUS_UK = liste;
});

/**
 * ★★★ DER KORPUS EINER SPRACHE - die EINE Weiche (28.09.2026).
 *
 * Bis dahin stand dieselbe Tabelle an DREI Stellen (`corpusItemsFor` hier,
 * `corpusEntriesFor` in corpusManifest.ts, `korpusQuelle` in
 * uebungsformen/hilfen.ts - Leitfaden Falle 32: jede war schon einmal die
 * eine, die man vergisst). Alle drei fragen jetzt hier.
 *
 * Ist die Sprache nicht geladen, ist das ein Fehlzugriff (`sprachpakete.ts`):
 * notiert und nachgeladen; die Antwort ist in diesem Augenblick leer. Vor dem
 * Üben sorgt `SprachpaketTor` dafür, dass es dazu nicht kommt.
 */
export function korpusFuer(lang: Lang, wo = "korpusFuer"): CorpusItem[] {
  if (!sprachpaketGeladen(lang)) fehlZugriff(lang, wo);
  // Eine Tabelle, keine Ternäre (Weichen-Zähler, tests/tastenflow-sprach-weichen).
  const tabelle: Record<Lang, CorpusItem[]> = /* RÜCKFALL-EN (G2-NEUN) */ mitRueckfallEn({ de: CORPUS, en: CORPUS_EN, fr: CORPUS_FR, es: CORPUS_ES, it: CORPUS_IT, pl: CORPUS_PL, tr: CORPUS_TR, cs: CORPUS_CS, /* ★ G3c-VERTEILER (25.10.2026): leer ⇒ englisch */ bg: eigenOderEn(CORPUS_BG, CORPUS_EN), el: eigenOderEn(CORPUS_EL, CORPUS_EN), hu: eigenOderEn(CORPUS_HU, CORPUS_EN), nl: eigenOderEn(CORPUS_NL, CORPUS_EN), pt: eigenOderEn(CORPUS_PT, CORPUS_EN), br: eigenOderEn(CORPUS_BR, CORPUS_EN), ro: eigenOderEn(CORPUS_RO, CORPUS_EN), sv: eigenOderEn(CORPUS_SV, CORPUS_EN), uk: eigenOderEn(CORPUS_UK, CORPUS_EN) });
  return tabelle[lang];
}

/**
 * ★ E8b Block 1a (26./27.09.2026, `BEFUND-2026-09-26-E8A-TEXTE-KINDER.md` §6):
 * kannte bisher nur die deutschen Umlaute (ä ö ü ß) - ein GROSSER französischer
 * Akzentbuchstabe (É È À Ç Ù Â Ê Î Ô Û Ë Ï Ÿ Œ) fiel dadurch NIE in den
 * Buchstaben-Zweig unten und scheiterte an `fitText`, selbst wenn sein
 * Kleinbuchstabe längst frei war (z. B. „École" an Sprosse 21, sobald „é"
 * gelernt ist). Die KLEINEN Formen brauchten diese Erweiterung nicht - sie
 * sind als eigene Einheit in `FR_LETTER_ORDER` literal in `allowed` und
 * griffen bisher über den Zeichen-Zweig weiter unten (`allowed.has(ch)`).
 * Mit der Erweiterung nimmt `ch.toLowerCase()` denselben Weg wie jeder
 * gewöhnliche Buchstabe: ein grosser Akzentbuchstabe gilt als Grossform des
 * kleinen und ist frei, sobald der kleine es ist - unabhängig davon, ob der
 * Kleinbuchstabe eine eigene Taste ist (é) oder erst über eine Totaste
 * entsteht (â ê î ô û über `^`, ë ï ü ÿ über `¨` - für diese bleibt `allowed`
 * bis zu deren Umsetzung ohnehin leer, siehe Bauplan §4.3/E9 - die Erweiterung
 * schadet dort nicht, sie ändert nur, über welchen Zweig geprüft wird).
 * Die Tastatur-Ersetzung (`toLayoutText`/`ersatz`, z. B. É→E auf Windows-
 * AZERTY) läuft VOR dieser Prüfung und bleibt unverändert wirksam.
 */
// ★★★ G2b-1 (02.10.2026, Befund G1c §3 Nr. 4): KEINE handgeschriebene Liste von
// Buchstaben mehr. Bis hierher stand hier `[a-zäöüßéèàçùâêîôûëïÿœñáíóú]` - jeder
// Sonderbuchstabe einer neuen Sprache (ı ğ ş ł ą ę ś č ě ř ž ů ì ò …) war darum
// „kein Buchstabe", fiel in den letzten Zweig von `fitText` und verwarf die
// ganze Zeile, selbst wenn der Buchstabe längst gelernt war (Leitfaden Falle 7,
// zum vierten Mal). Jetzt fragt `fitText` `istBuchstabe()` (Unicode `\p{L}`,
// sprachRegister.ts): ob ein Buchstabe FREI ist, entscheidet danach `allowed`
// (die Einheiten des Weges) - nicht eine Liste im Code. de/en/fr/es: dieselbe
// Antwort wie vorher (die Golden-Tests halten es fest).

/**
 * ★ E9-kids (26.09.2026): Ein Totasten-Buchstabe (ê â î ô û ë ï ü ÿ) ist im
 * Weg „fr" frei, sobald seine Totaste (`^`/`¨` - eigene Lerneinheiten seit E4)
 * UND sein Grundbuchstabe gelernt sind. Bis hierhin stand „ê" nie in
 * `allowed` (die Einheit heisst „^"), und JEDE Zeile mit Zirkumflex oder
 * Trema war an jeder Sprosse `null` - entgegen dem Kopf-Kommentar in
 * `lernweg.ts` („ê â î ô û werden schreibbar, SOBALD ihr Grundvokal … frei
 * ist"). Nur mit `lernweg === "fr"` (Aufrufer ohne Weg und die Wege „de"/„en"
 * bleiben Byte für Byte). Ob die Totaste auf der eingestellten Tastatur
 * existiert, entscheidet schon `allowed`: fehlt sie dort, ist „^" nie
 * eingeführt. Wächter: `tests/tastenflow-fittext-totasten-fr.test.ts`.
 *
 * ★★★ ES-F5 (27.09.2026, Bauplan §3/§4.3, Falle 37): dieselbe Mechanik gilt
 * für Weg „es" - á é í ó ú über die Akzent-Totaste `´` (auf ES in der
 * Grundreihe, auf LatAm oben, siehe layouts.ts) und ü über die Trema-Totaste
 * `¨` (dieselbe Zuordnung wie bei Französisch, `totasten.ts`). Der Aufrufer
 * unten prüft `lernweg === "fr" || lernweg === "es"` - ohne diese Erweiterung
 * bliebe jede Zeile mit einem Akzentbuchstaben an JEDER Sprosse `null`, genau
 * die Falle, die E9-kids für Französisch fand.
 *
 * ★★★★★ ES-P7a-Behebung (27.09.2026, M2): EXPORTIERT, damit `generator.ts`
 * (`filterWords`) dieselbe Prüfung benutzt statt einer zweiten Kopie (Leitfaden
 * Falle 32) - vorher kannte NUR `fitText` (echter Korpus-Text) Totasten-
 * Buchstaben; der GENERATOR (Wort-/Zeichen-Drill) prüfte ausschliesslich
 * `allowed.has(c)` und konnte „más", „está", „qué" & Co. darum NIE benutzen,
 * selbst wenn ´ und a längst gelernt waren (Prüfbericht e11: 114 von 663
 * Wörtern nie benutzbar).
 */
/**
 * ★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8 Punkt 2,
 * Johannes): Darf dieser GROSSBUCHSTABE in einer servierten Zeile stehen?
 *  · Erzeugt die Tastatur ihn auf keinem Weg (Windows Frankreich É und Ç,
 *    Belgien/Schweiz-Französisch Ç - `grossFehlt`), kommt die Zeile NICHT
 *    vor - auf jedem Weg. Bis W1 wurde er ersetzt (É → E): falsches
 *    Französisch (Académie française, AFNOR - Befund Anhang C).
 *  · Braucht er eine Totaste (Frankreich À È Ù über Gravis, Ê über ^ …, dann
 *    Umschalt + Buchstabe), ist er auf Weg „fr" frei, sobald die EINHEITEN
 *    gelernt sind, über die er auf DIESER Tastatur entsteht
 *    ({@link grossAkzentEinheiten}) - ★ W2a (28.09.2026), je Zeichen.
 *    Bis W2a: erst mit der LETZTEN Einheit des Weges (`grossAkzentAb`) -
 *    dadurch rutschten rund 29 Serien und 140 Korpuszeilen ans Ende, auch
 *    „Être …" auf der Kanada-Tastatur, wo ^ längst sass.
 *    Die Wege „de" (Schweiz Ä Ö Ü), „en" und „es" (Á É …) bleiben ohne
 *    diese Schranke, wie bisher.
 */
export function grossbuchstabeFrei(gross: string, allowed: Set<string>, lernweg?: Lernweg): boolean {
  const layout = activeLayout();
  const weg = grossbuchstabeWeg(gross, layout);
  if (weg === "fehlt") return false;
  if (weg === "totaste" && lernweg === "fr") {
    const einheiten = grossAkzentEinheiten(gross, layout, "fr");
    return einheiten.every((u) => allowed.has(u));
  }
  // ★★★ F4-it (02.10.2026, Bauplan italienischer Lehrgang I4, F3-Befund §5): ein Weg, der seine grossen Akzent-
  // buchstaben erst spät serviert (`LernwegDef.grossAkzentSpaet`, Italienisch À È É Ì Ò Ù), bringt sie erst, wenn die
  // Einheit `grossAkzentAb` (die letzte des Weges) gelernt ist: am Mac (Option + Umschalt) hat die Tastatur dafür
  // keinen Griff, den eine frühe Lektion lehrt (`weg === null`), auf der Schweizer Belegung (Tessin) ist es Totaste,
  // dann Umschalt + Buchstabe. Unter Windows kommt `"fehlt"` schon oben. An der EIGENSCHAFT des Weges festgemacht
  // (Falle 50), nicht an seinem Namen.
  // ★★★ F4-pl (02.10.2026): dazu der AltGr-Buchstabe-Dreiergriff (Polnisch Ą Ć Ę Ł Ń Ó Ś Ź Ż, AltGr + Umschalt + Buchstabe;
  // `KeyAccess.buchstabe`): die Tastatur erzeugt ihn "direkt", aber der Griff ist ein eigener - erst mit `grossAkzentAb`.
  if (lernweg !== undefined && (weg === null || weg === "totaste" || (weg === "direkt" && zugangFuer(layout, gross)?.buchstabe === true))) {
    const spaet = lernwegDef(lernweg).grossAkzentSpaet;
    if (spaet?.includes(gross)) return grossAkzentEinheiten(gross, layout, lernweg).every((u) => allowed.has(u));
  }
  return true;
}

/**
 * ★★★ W2a (28.09.2026, Auftrag Punkt 7): Welche Lern-Einheiten braucht dieser
 * GROSSBUCHSTABE über eine Totaste auf DIESER Tastatur? Aus dem Modell
 * (`access`) abgeleitet, keine Liste:
 *  · Ist die Totaste selbst eine Einheit des Weges (`^`, `¨`), dann sie:
 *    Ê Î Ô Û ⇒ `^`, Ë Ï ⇒ `¨`.
 *  · Sonst (Gravis `\`` auf AZERTY über AltGr + 7, Akut `´` auf Belgien über
 *    AltGr + ù, Gravis auf der Schweiz über Umschalt + ^) die erste
 *    Totasten-Einheit des Weges (die Technik „Totaste, dann Umschalt +
 *    Buchstabe" ist gelernt) UND - wenn die Totaste AltGr braucht - die erste
 *    Einheit, die auf dieser Tastatur AltGr braucht (der Griff ist gelernt).
 *  · Findet sich keine solche Einheit, bleibt es bei der letzten Einheit des
 *    Weges (`grossAkzentAb`) - der Stand vor W2a.
 *
 * Die Umschalttaste fehlt in der Liste mit Absicht: Sie steht auf jedem Weg
 * VOR jeder Totaste (Wächter `tastenflow-w2a-grossakzent-je-zeichen`), und
 * `allowed` führt sie ohnehin nicht (`allowedFromIntroduced`).
 * Der Grundbuchstabe (a, e, u …) wird in `fitText` für sich geprüft.
 */
export function grossAkzentEinheiten(gross: string, layout: KeyboardLayout, lernweg: Lernweg): string[] {
  const def = lernwegDef(lernweg);
  const ende = def.grossAkzentAb ?? def.introOrder[def.introOrder.length - 1];
  const k = kombizeichenZu(gross, layout);
  if (!k) return [ende];
  const order = def.introOrder;
  if (order.includes(k.tot)) return [k.tot];
  const ersteTotaste = order.find((u) => layout.access[u]?.dead === true);
  const zugang = layout.access[k.tot];
  const einheiten: string[] = [];
  if (ersteTotaste === undefined) return [ende];
  einheiten.push(ersteTotaste);
  if (zugang?.mod === "altgr") {
    const ersteAltGr = order.find((u) => layout.access[u]?.mod === "altgr" && layout.access[u]?.dead !== true);
    if (ersteAltGr === undefined) return [ende];
    einheiten.push(ersteAltGr);
  }
  return einheiten;
}

export function totastenBuchstabeFrei(lower: string, allowed: Set<string>, lernweg?: string): boolean {
  // ★ F4-cs (02.10.2026): Tschechisch `ď ť ň` (Háček + Buchstabe) stehen nur in der tschechischen Liste
  // (`KOMBIZEICHEN_CS`); `kombizeichenFuerLayout` nimmt sie nur für eine Tastatur der Sprache `cs` und lässt Zeichen mit
  // eigener Taste weg (`č š ř ž ě ý` sind eigene Einheiten, nie über die Totaste frei). Für jede andere Tastatur und jedes
  // Zeichen, das `KOMBIZEICHEN` schon kennt, gilt wie vorher der erste Fund.
  const k =
    KOMBIZEICHEN.find((z) => z.zeichen === lower) ??
    kombizeichenFuerLayout(activeLayout()).find((z) => z.zeichen === lower);
  if (k !== undefined) return allowed.has(k.tot) && allowed.has(k.dann);
  // ★ SPRACHEN-9 (29.10.2026): die neun Wege seit dem 25.10.2026 fragen zusätzlich ihre eigenen `totastenZiele`
  // (griechisch `΄` ⇒ ά έ ή ί ό ύ ώ). Ohne das kannte die Prüfung diese Zeichen nur, wenn gerade eine griechische Tastatur
  // eingestellt war - jedes Wort mit Tonos war sonst an jeder Sprosse „nie tippbar" (1.086 von 1.161 Übungswörtern).
  // Der Grundbuchstabe ist das Zeichen ohne Akzent (Unicode-Zerlegung). Die acht Wege davor erreichen diese Zeile nie.
  if (lernweg === undefined || !istGeruestSprache(lernweg)) return false;
  for (const [tot, ziele] of Object.entries(lernwegDef(lernweg).totastenZiele ?? {})) {
    if (!ziele.includes(lower)) continue;
    const grund = lower.normalize("NFD").replace(/\p{M}+/gu, "");
    return grund.length === 1 && allowed.has(tot) && allowed.has(grund);
  }
  return false;
}

/**
 * ★ F4-tr, F4-cs (02.10.2026): Lehrt dieser Weg eine Totaste als EINHEIT (`^ ´ ¨` Französisch/Spanisch, `^` Türkisch, `ˇ ´ ¨`
 * Tschechisch)? Dann sind seine Totasten-Buchstaben (`ê â î ô û`, `á é í ó ú`, `â î û`, `ď ť ň ó`) frei, sobald Totaste UND Grundbuchstabe
 * gelernt sind (`totastenBuchstabeFrei`). An der EIGENSCHAFT des Weges festgemacht (Falle 50), nicht an `lernweg === "fr" || "es"`:
 * für fr und es dieselbe Antwort wie vorher (beide führen eine Totaste in der Folge), für de, en, it und pl `false` (keine Totaste in der Folge).
 */
export function hatTotastenEinheit(lernweg: Lernweg | undefined): boolean {
  return lernweg !== undefined && folgeHatTotaste(lernwegDef(lernweg).letterOrder, lernweg);
}

/**
 * ★ G4-NAHT (25.10.2026, Wunsch G3a §3): führt diese Folge eine Totaste des Weges? MIT dem Weg gefragt
 * (`istTotasteDerListen(u, lernweg)`) - sonst wäre der griechische Tonos `΄`, die Tilde-Liste von pt/br oder `'` `"` auf
 * nl keine Totasten-Einheit, und jedes Wort mit ά, ã, ë fiele an jeder Sprosse heraus (Falle 50). Für die acht Wege vor
 * dem 25.10.2026 dieselbe Antwort wie ohne Weg (Wächter `tastenflow-g3a-schrift-totasten`).
 */
export function folgeHatTotaste(folge: readonly string[], lernweg: Lernweg): boolean {
  return folge.some((u) => istTotasteDerListen(u, lernweg));
}

/**
 * Satzzeichen, die WEGGELASSEN werden dürfen, solange sie noch nicht gelernt
 * sind („ohne Punkt und Beistrich"). Bindestrich/Gedankenstrich werden zu einem
 * Leerzeichen (trennt Wörter sauber), der Rest verschwindet und überzählige
 * Leerzeichen werden eingedampft. Ziffern und Buchstaben sind NICHT weglassbar
 * — und der APOSTROPH ebenfalls nicht: aus „I don't know." würde sonst falsch
 * geschriebenes „I dont know." (englische Kontraktionen, Prüfbericht 27.07.,
 * Teil 2 Punkt 1). Ein Text mit Apostroph passt erst, wenn die '-Taste gelernt
 * ist; typografische Varianten (’ ‘ `) werden dann auf das tippbare gerade '
 * normalisiert.
 */
const STRIP_TO_SPACE = new Set(["-", "–", "—"]);
const APOSTROPHES = new Set(["'", "’", "‘", "`"]);
const STRIPPABLE_PUNCT = new Set([
  ".", ",", "-", "?", "!", ":", ";",
  "–", "—",
  '"', "„", "“", "”", "«", "»", "(", ")", "…",
]);

/**
 * Zeichen, die einen Satz beenden. Fehlen sie ALLE im Tastenstand, verschwinden
 * beim Servieren auch alle inneren Satzgrenzen einer Mehrsatz-Zeile.
 */
const SATZENDE = [".", "!", "?", "…"] as const;

/**
 * Der Quelltext, der SERVIERT wird — Rohtext oder „frühe Fassung" (R3-neu,
 * 15.08.2026, Bauplan 14.08. §0b Punkt 1).
 *
 * Solange kein einziges Satzschlusszeichen der Zeile gelernt ist, lässt
 * `fitText` sie alle weg: aus „Warum lacht die Banane? Weil der Affe sie
 * kitzelt." würde „Warum lacht die Banane Weil der Affe sie kitzelt" — das
 * große W stünde mitten in der Zeile wie ein Rechtschreibfehler. Für genau
 * diese Zeit liegt in `fruehFassungen.ts` derselbe Text mit klein
 * geschriebenen NAHTWÖRTERN bereit (redaktionell geprüft; Nomen, Eigennamen,
 * Marken und das englische „I" bleiben groß).
 *
 * ★★★ M1 (28.09.2026, Schlussprüfung Nachtlauf): entschieden wird JE NAHT,
 * nicht je Zeile. Ein Nahtwort steht klein, solange KEINES der
 * Satzschlusszeichen direkt vor ihm gelernt ist (sie fallen dann in `fitText`
 * weg), und groß, sobald eines davon stehen bleibt. Frühfassung und Rohtext
 * werden dafür Zeichen für Zeichen gemischt - die eiserne Invariante („gleich
 * bis auf Groß-/Kleinschreibung, nur an Nähten") erlaubt das ohne neue Daten.
 * Bis dahin galt: sobald EIN Satzschlusszeichen der Zeile gelernt war, kam der
 * ganze Rohtext. Das Fenster zwischen „." und „?"/„!" war „wenige Lektionen" -
 * seit D-1 (Punkt direkt nach ⇧) reichte es über den ganzen Rest des Alphabets:
 * „Was macht die Kuh auf dem Eis Sie gibt kalte Milch." (de kids 48 Zeilen,
 * fr kids 65, gemessen `BEFUND-2026-09-28-SCHLUSSPRUEFUNG-NACHTLAUF.md` M1).
 * Wächter: `tests/tastenflow-fruehfassung-je-naht.test.ts`.
 *
 * EINE Einbaustelle: über `fitText` gilt das für Korpus, Serien, Bücherei und
 * Generator gleichermaßen. Der ROHTEXT bleibt überall der Schlüssel
 * (`bausteinId`, `isDeactivated`, Ledger) — hier wird nur die Anzeige gewählt.
 */
function servierFassung(text: string, allowed: Set<string>): string {
  const frueh = FRUEH_FASSUNGEN.get(text);
  if (frueh === undefined) return text;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    // Gleich im Rohtext und in der Frühfassung: kein Nahtbuchstabe.
    if (frueh[i] === text[i]) out += text[i];
    else out += satzendeVorNahtBleibt(text, i, allowed) ? text[i] : frueh[i];
  }
  return out;
}

/**
 * Bleibt vor der Naht an Position `pos` ein Satzschlusszeichen stehen? Gesucht
 * wird rückwärts bis zum letzten Buchstaben oder zur letzten Ziffer davor -
 * dazwischen liegen nur Satzzeichen, Anführungszeichen und Leerzeichen
 * („Eis? Sie", „doudou ? Il", „schon!» Er", „Tier. ¿Qué").
 */
function satzendeVorNahtBleibt(text: string, pos: number, allowed: Set<string>): boolean {
  for (let j = pos - 1; j >= 0; j--) {
    const c = text[j];
    if (/[\p{L}\p{N}]/u.test(c)) return false;
    if ((SATZENDE as readonly string[]).includes(c) && allowed.has(c)) return true;
  }
  return false;
}

/**
 * Passt den Korpus-Text an die freigeschalteten Tasten an und gibt die fertig
 * formatierte Tipp-Zeile zurück — oder `null`, wenn er (noch) nicht passt.
 *
 *  • Buchstaben (groß wie klein) sind erlaubt, sobald ihre GRUNDtaste frei ist;
 *    Großbuchstaben bleiben erhalten (immer tippbar, siehe KERNREGEL oben).
 *  • Ziffern müssen freigeschaltet sein, sonst passt der Text nicht.
 *  • Freigeschaltete Satzzeichen bleiben; noch nicht gelernte werden entfernt.
 *  • Apostrophe sind „hart": ohne gelernte '-Taste passt der Text nicht
 *    (Kontraktionen wie „don't" dürfen nie zu „dont" verstümmelt werden);
 *    typografische Apostrophe werden auf das gerade ' normalisiert.
 *  • ★ E8b Block 1b (27.09.2026, Weg „fr" NUR): der Bindestrich ist dort
 *    ebenso „hart" wie der Apostroph - sonst würde aus „Qu'est-ce que" das
 *    falsche „Qu'est ce que" (Bauplan §6.5, `BEFUND-2026-09-26-E8A…` §1a
 *    Punkt K10). Wo `-` freigeschaltet ist, steht in `lernweg.ts`
 *    (`FR_PUNCT_ORDER`). Deutsch/Englisch bleiben unverändert: dort wird ein
 *    noch nicht gelernter Bindestrich weiterhin zu einem Leerzeichen (siehe
 *    `STRIP_TO_SPACE`).
 *  • Unbekannte/noch gesperrte Sonderzeichen (z. B. % @ +) → Text passt nicht.
 *  • Mehrsatz-Zeilen werden an jeder Naht, deren Satzschlusszeichen noch
 *    nicht gelernt ist, in ihrer „frühen Fassung" serviert (Nahtwort klein) —
 *    siehe `servierFassung` oben.
 *
 * `allowed` ist der gemeinsame Satz aller freigeschalteten Zeichen (Klein-
 * buchstaben, Ziffern, gelernte Satz-/Sonderzeichen). `lernweg` ist optional
 * (nur für die Bindestrich-Regel oben nötig) - fehlt er, gilt das bisherige
 * Verhalten (Bindestrich weich, wie bei „de"/„en").
 */
export function fitText(text: string, allowed: Set<string>, lernweg?: Lernweg, sprache?: Lang): string | null {
  // ★★★ G2b-1 (02.10.2026, Bauplan §2.1, Türkisch T7): Klein-/Grossschreibung in
  // der Sprache des TEXTES - Türkisch hat vier i-Buchstaben (i İ ı I); die
  // gewöhnliche `toLowerCase()` machte aus „İ" zwei Zeichen (i + Kombinationspunkt)
  // und aus „I" ein „i" statt „ı" (jede Zeile mit İ wurde verworfen, ein „I"
  // suchte die falsche Einheit). `sprache` ist die Sprache der Übung; fehlt sie,
  // gilt die des Weges, fehlt auch der, Deutsch (= `toLowerCase()`, wie bisher).
  const textSprache: Lang = sprache ?? lernweg ?? "de";
  // ★★★ ES-F4 (27.09.2026, Bauplan spanischer Lehrgang §4.4): ¿ und ? (ebenso
  // ¡ und !) sind im Spanischen ein HARTES Paar - ein Kind, das erst ¿ gelernt
  // hat, darf nie „¿Qué hora es" bekommen (das `?` wäre sonst stillschweigend
  // über STRIPPABLE_PUNCT weggefallen, wie es für de/en/fr ein normales,
  // weglassbares Satzzeichen bleibt UND BLEIBEN MUSS - „?"/„!" kommen dort in
  // jeder gewöhnlichen Frage/Ausrufe-Zeile vor, ganz ohne „¿"/„¡"). Geprüft
  // wird darum nur am ÖFFNENDEN Zeichen (existiert nur im Spanischen, kommt in
  // keiner anderen Sprache je vor): kommt „¿"/„¡" in der Zeile vor, muss auch
  // sein Gegenstück gelernt sein, sonst passt die Zeile nicht.
  const brauchtPaar = (auf: string, zu: string): boolean =>
    text.includes(auf) && !(allowed.has(auf) && allowed.has(zu));
  if (brauchtPaar("¿", "?") || brauchtPaar("¡", "!")) return null;
  // ★★★ D1 Nr. 19 (28.09.2026, Entscheidung Johannes „Klammern als festes
  // Paar"): auf JEDEM Weg streicht fitText nie eine Hälfte einer Klammer.
  // Ist genau EINE Hälfte gelernt, passt eine Zeile mit Klammer nicht (an der
  // Sprosse von „(" wurde „)" gestrichen: „… en La Paz (Bolivia en julio.").
  // Sind BEIDE gelernt, bleiben beide; ist KEINE gelernt, fallen beide weg
  // wie bisher (runde Klammern sind weglassbar) - die Zeile bleibt ganz.
  // Seit `paareGemeinsam` die Klammern gemeinsam freischaltet, ist „genau
  // eine" nur noch ein Altstand oder ein Startpunkt mitten im Paar.
  for (const [auf, zu] of Object.entries(KLAMMER_PAARE)) {
    if (!text.includes(auf) && !text.includes(zu)) continue;
    if (allowed.has(auf) !== allowed.has(zu)) return null;
  }
  let out = "";
  // Zuerst in die Schreibweise der eingestellten Tastatur bringen: auf der
  // Schweizer Tastatur wird aus „Straße" das dort richtige „Strasse", auf
  // englischen Tastaturen aus „Bär" das ersatzweise „Baer". Beim deutschen
  // Layout ändert sich nichts (dort fehlt keine Taste).
  for (const ch of toLayoutText(servierFassung(text, allowed))) {
    if (ch === " ") {
      out += " ";
      continue;
    }
    const lower = kleinFuer(ch, textSprache);
    if (istBuchstabe(lower)) {
      // Buchstabe nicht freigeschaltet - ausser (Weg „fr"/„es") ein
      // Totasten-Buchstabe, dessen Totaste UND Grundbuchstabe gelernt sind.
      const totastenWeg = hatTotastenEinheit(lernweg);
      if (!allowed.has(lower) && !(totastenWeg && totastenBuchstabeFrei(lower, allowed, lernweg))) {
        return null;
      }
      if (ch !== lower && !grossbuchstabeFrei(ch, allowed, lernweg)) return null;
      out += ch; // Groß-/Kleinschreibung beibehalten
    } else if (ch >= "0" && ch <= "9") {
      if (!allowed.has(ch)) return null; // Ziffer nicht freigeschaltet
      out += ch;
    } else if (allowed.has(ch)) {
      out += ch; // gelerntes Satz-/Sonderzeichen
    } else if (APOSTROPHES.has(ch)) {
      // „Hartes" Zeichen — nie stillschweigend strippen (aus „don't" würde
      // falsches „dont"): ohne '-Taste passt der Text nicht; mit ihr wird ein
      // typografischer Apostroph auf das tippbare gerade ' normalisiert.
      if (!allowed.has("'")) return null;
      out += "'";
    } else if (ch === "-" && lernweg === "fr") {
      // ★ E8b Block 1b: siehe Kopf-Doku - `allowed.has(ch)` oben hat für
      // diesen Bindestrich bereits „nein" ergeben, sonst wäre der Zweig nicht
      // erreicht worden. Für Weg „fr" NICHT stillschweigend zu einem
      // Leerzeichen machen, sondern wie beim Apostroph den ganzen Text sperren.
      return null;
    } else if (STRIP_TO_SPACE.has(ch) || STRIPPABLE_PUNCT.has(ch)) {
      // Gestrichen: eine LÜCKE, kein Leerzeichen - was daraus wird, entscheidet
      // `schliesseStreichLuecken` mit Blick auf die Nachbarn.
      out += GESTRICHEN;
    } else {
      return null; // noch gesperrtes Sonderzeichen, das wir nicht weglassen
    }
  }
  const render = schliesseStreichLuecken(out, lernweg).replace(/\s+/g, " ").trim();
  return render.length ? render : null;
}

/** Platzhalter für ein gestrichenes Zeichen in `fitText` (kommt in keinem Text vor). */
const GESTRICHEN = "\u0000";
/** Vor diesen Zeichen steht auf keinem Weg ein Leerzeichen. */
const NIE_LEERZEICHEN_DAVOR = new Set([",", ".", ")", "]", "}"]);
/** Vor diesen Zeichen steht nur auf Weg „fr" ein Leerzeichen (F8/D-6). */
const LEERZEICHEN_DAVOR_NUR_FR = new Set([";", ":", "!", "?"]);
const WORTZEICHEN = /[\p{L}\p{N}]/u;

/**
 * ★★★ Punkt 1 „vier Reste" (28.09.2026, Beobachtung in
 * `BEFUND-2026-09-28-FIX-SCHLUSSPRUEFUNG.md` M1): Bis hierher wurde jedes
 * gestrichene Zeichen zu einem Leerzeichen, und nur doppelte wurden
 * zusammengezogen. Stand das gestrichene Zeichen zwischen einem Wort und einem
 * GELERNTEN Satzzeichen, blieb das Leerzeichen davor stehen:
 * „"Je vais planter ce noyau d'avocat", explique Samir." ⇒ „… d'avocat ,
 * explique Samir." - gemessen (`pruefstand/vier-reste/p1-leerzeichen-nach-
 * streichen.mts`) auf Weg es 208 Zeilen, fr 67, de 4 (Satzzeichen vor dem
 * Anführungszeichen: „Kind!", ruft er" ⇒ „Kind , ruft er"; Ergänzungsstrich
 * „Saiten-, Blas-" ⇒ „Saiten , Blas"), en 0 (dort steht das Komma im Zitat).
 *
 * Jetzt entscheidet jede Folge aus Leerzeichen und Lücken für sich:
 *  · ohne Lücke: Rohtext, unverändert (auch ein Leerzeichen, das der Text
 *    selbst vor ein Satzzeichen setzt - das Französische tut das absichtlich),
 *  · am Zeilenrand: nichts,
 *  · vor , . ) ] }: nichts - auf jedem Weg,
 *  · vor ; : ! ?: auf Weg „fr" ein Leerzeichen, wenn der Rohtext dort eines
 *    hatte („« Vraiment » ?" ⇒ „Vraiment ?"), sonst nichts,
 *  · mit einem Leerzeichen des Rohtexts: eines,
 *  · nur Lücke: ein Leerzeichen zwischen zwei Wortzeichen („3.5" ⇒ „3 5",
 *    „Hals-Nasen" ⇒ „Hals Nasen", wie bisher), sonst nichts
 *    („(grâce aux msemen)"" ⇒ „grâce aux msemen"").
 * Nur der SERVIERTE Text ändert sich; Zeilen-IDs und Ledger hängen am Rohtext.
 */
function schliesseStreichLuecken(s: string, lernweg: Lernweg | undefined): string {
  if (!s.includes(GESTRICHEN)) return s;
  return s.replace(/[ \u0000]+/g, (lauf: string, pos: number) => {
    if (!lauf.includes(GESTRICHEN)) return lauf;
    const vor = s[pos - 1];
    const nach = s[pos + lauf.length];
    if (vor === undefined || nach === undefined) return "";
    if (NIE_LEERZEICHEN_DAVOR.has(nach)) return "";
    const leerzeichen = lauf.includes(" ");
    if (LEERZEICHEN_DAVOR_NUR_FR.has(nach)) return lernweg === "fr" && leerzeichen ? " " : "";
    if (leerzeichen) return " ";
    return WORTZEICHEN.test(vor) && WORTZEICHEN.test(nach) ? " " : "";
  });
}

/** Wie `fitText`, aber nur ja/nein (passt der Text zu den Tasten?). */
export function fitsKeys(text: string, allowed: Set<string>, lernweg?: Lernweg, sprache?: Lang): boolean {
  return fitText(text, allowed, lernweg, sprache) !== null;
}

export interface CorpusQuery {
  stufe: Stufe;
  allowed: Set<string>;
  /** Auf bestimmte Sorten einschränken (z. B. nur Witze). */
  kinds?: CorpusKind[];
  /** Sprache der Inhalte (Deutsch oder Englisch). */
  lang?: Lang;
  /**
   * ★ E4a (24.09.2026, Bauplan §6.2/§10): der Lernweg des Kindes - Pflicht,
   * kein stiller Rückfall (wie schon bei `ensureIntroduced`/`minTierFor`,
   * Bauplan §2.3): sonst übersieht man eine Stelle, die einem Kind auf Weg
   * „de" versehentlich Inhalt zeigt, der nur für Weg „en" gedacht ist (oder
   * umgekehrt). Filtert Einträge mit gesetztem `CorpusItem.nurWeg` - ein
   * Eintrag ohne das Feld gilt weiter auf BEIDEN Wegen (jeder heutige
   * Eintrag).
   */
  lernweg: Lernweg;
  /**
   * ★ E9 (24.09.2026, Bauplan §8.2): britisch oder amerikanisch - nur bei
   * `lang === "en"` von Bedeutung. Optional (Vorgabe „gb" = unverändert):
   * anders als `lernweg` hängt an ihr keine Taste, ein fehlender Aufrufer
   * bricht darum nichts, er sieht nur weiter Britisch. Angewandt GANZ ZULETZT
   * ({@link wandleSchreibweise}), NACH `fitText` und NACH der Ledger-Kennung -
   * siehe die Kopf-Doku von `schreibweise.ts`.
   */
  variante?: EnglischVariante;
  /**
   * ★ E9a (26.09.2026, Bauplan §1.2 F8): die französische Landesvariante -
   * nur bei `lang === "fr"` von Bedeutung. Genau wie `variante` optional
   * (Vorgabe „fr-FR" = unverändert) und GANZ ZULETZT angewandt
   * ({@link wandleTypografie}), NACH `fitText` und NACH der Ledger-Kennung -
   * siehe die Kopf-Doku von `franzVariante.ts`.
   */
  franzVariante?: FranzVariante;
  /**
   * ★ ES-F7 (27.09.2026, Bauplan §1.2 S2): die spanische Landesvariante - nur
   * bei `lang === "es"` von Bedeutung. Genau wie `franzVariante` optional
   * (Vorgabe „es-ES" = unverändert).
   *
   * ★★★★★ ES-P7a-Behebung (27.09.2026, M8, Prüfbericht Fundament es): ANDERS
   * als bei „en"/„fr" wird sie hier auf KORPUS-Text NICHT mehr angewandt
   * (siehe {@link wandleVariante} unten) - eine echte Zeile mit Ort schreibt
   * ihre Zahlen schon in der Schreibweise ihres Landes (Bauplan §5.3:
   * „verortete Zeilen schreiben nach ihrem Ort"), eine variantenneutrale
   * Zeile hat gar keine Dezimalzahl/Währung. `wandleFormatoNumerico`
   * rechnete bisher blind JEDE erkannte Zahl um, auch in verorteten Zeilen -
   * gemessen (e5): 13 von 1.793 Platzhalterzeilen wurden umgeschrieben,
   * ALLE falsch (Argentinien „7.416 kilos" ⇒ „7,416 kilos", tatsächlich
   * 7,4 kg). Für ERZEUGTE (generator-eigene) Zeilen gilt sie weiterhin -
   * siehe `generator.ts` `fertigeZeile`, dort gibt es keinen Ort.
   */
  esVariante?: EsVariante;
  /**
   * ★ D-2 (28.09.2026): Ist die Umschalttaste schon gelernt? Fehlt das Feld,
   * gilt „ja" (unverändert für jeden Aufrufer, der es nicht setzt). Nur mit
   * `stufe: "erwachsen"` und `false` fallen Zeilen mit Grossbuchstaben weg
   * ({@link nurKleinschrift}).
   */
  umschalt?: boolean;
}

/**
 * Die letzte Servierstufe für KORPUS-Text (§8.2/§1.2 F8) - dieselbe
 * Einbaustelle für „en"/„fr". „es" bewusst NICHT hier (siehe `esVariante`
 * oben, M8) - Korpuszeilen bleiben in der Schreibweise, in der sie
 * geschrieben wurden.
 */
export function wandleVariante(
  text: string,
  q: Pick<CorpusQuery, "variante" | "franzVariante" | "esVariante">,
): string {
  if (q.variante === "us") return wandleSchreibweise(text, "us");
  if (q.franzVariante) return wandleTypografie(text, q.franzVariante);
  return text;
}

/**
 * Alle passenden Korpus-Zeilen für eine Altersstufe + Tastenstand — fertig an
 * den Lernstand angepasst (Satzzeichen ggf. weggelassen). Doppelte (nach dem
 * Weglassen identische) Zeilen werden einmalig zurückgegeben.
 */
export function corpusItemsFor(q: CorpusQuery): string[] {
  const kinds = q.kinds ? new Set(q.kinds) : null;
  // ★ E8a (Bauplan §15 Falle 1): NICHT mehr die alte binäre Weiche (Englisch
  // gegen CORPUS_EN, sonst CORPUS) - die lieferte für „fr" still den
  // deutschen Korpus (jede Zeile ohne `nurWeg` passt auf jeden Weg). Eine
  // Tabelle statt einer weiteren Ternäre, damit der Weichen-Zähler
  // (`tests/tastenflow-sprach-weichen.test.ts`) nicht wächst.
  // ★ ES-F5 (27.09.2026): CORPUS_ES vorbereitet. ★ 28.09.2026: die Tabelle
  // steht nur noch EINMAL, in `korpusFuer` (Falle 32) - dieselbe fragt
  // corpusManifest.ts:corpusEntriesFor, den Weg, den der Generator nimmt.
  const source = korpusFuer(q.lang ?? "de", "corpusItemsFor");
  // S1: Die Zeilen tragen noch die alten Etiketten (a/b/c/erwachsen), die
  // Konto-Stufe ist neu (kids/teens) — contentStufenFor übersetzt.
  const etiketten = contentStufenFor(q.stufe);
  const klein = nurKleinschrift(q.stufe, q.umschalt ?? true); // ★ D-2
  const seen = new Set<string>();
  const out: string[] = [];
  for (const it of source) {
    if (kinds && !kinds.has(it.kind)) continue;
    if (!etiketten.some((s) => it.stufen.includes(s))) continue;
    if (!passtLernweg(it.nurWeg, q.lernweg)) continue; // E4a: nur der eigene Weg
    if (isDeactivated(it.kind, it.text)) continue; // TW-E4: aussortiert, nicht servieren
    const fitted = fitText(it.text, q.allowed, q.lernweg, q.lang);
    if (fitted === null || seen.has(fitted)) continue;
    if (klein && hatGrossbuchstaben(fitted)) continue; // ★ D-2
    seen.add(fitted);
    // ★ E9/E9a: die Schreibweise/Typografie erst HIER, nach dem Dedup gegen
    // die britische/FR-BE-CH-(Grund-)Form - zwei Zeilen, die sich nur in
    // „colour"/"color" oder im Leerzeichen vor „?" unterscheiden würden,
    // sollen es gar nicht geben, aber die Reihenfolge ist dieselbe wie bei
    // der Ledger-Kennung: Grundform zuerst, Landes-Umwandlung ganz zuletzt.
    out.push(wandleVariante(fitted, q));
  }
  return out;
}
