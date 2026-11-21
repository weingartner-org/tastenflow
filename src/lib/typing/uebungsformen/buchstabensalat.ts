/**
 * Übungsform „Buchstabensalat".
 *
 * Herkunft: eine der Übungsformen aus Testerin Mail (Kollegin, dieselbe
 * Zielgruppe), am 01.09.2026 mit Johannes durchgesprochen
 * (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md` §3, Punkt 6). Ein
 * langes Wort ist gegeben („Weihnachtsbaum"), das Kind bildet daraus so viele
 * neue Wörter wie möglich - Ziel etwa zehn.
 *
 * Warum das einen EIGENEN Bildschirm braucht (`eigenerBildschirm:
 * "buchstabensalat"`, kein `baue`): Jede andere Form liefert Zeilen zum
 * Abschreiben - eine feste, im Voraus bekannte Anzahl Antworten in fester
 * Reihenfolge. Hier weiß niemand vorher, wie viele Wörter ein Kind findet
 * oder in welcher Reihenfolge - es tippt frei, und jede Eingabe wird für
 * sich geprüft. Die gewohnte Tippzeile (eine Zeile, ein Text, ein Ergebnis)
 * passt darauf nicht.
 *
 * Diese Datei liefert nur die PRÜFUNG und die Quellwörter. Der Bildschirm
 * (freies Eingeben, Ansage, Fokus-Führung) liegt bei Johannes.
 *
 * ★★★ Die Prüfung ist reine MENGENRECHNUNG, keine Wertung: Ein Kind, das
 * „Eier" aus „Weihnachtsbaum" tippt, hat nicht falsch gemacht - es hat ein
 * Wort gefunden, für das der Buchstabenvorrat nicht reicht (nur ein „e"). Die
 * Gründe in {@link SalatUrteil} sind Auskunft für den Bildschirm, keine
 * Bewertung des Kindes - „schon gehabt" heißt nicht „falsch", „kein-wort"
 * nicht „dumm".
 */
import { fitsKeys } from "../corpus";
import { isRealWord, lexikonWoerter, normalizeWord } from "../lexicon";
import { beiSprachpaket } from "../sprachpakete";
import { contentStufenFor, type Lang, type InhaltsStufe } from "../account";
import { wandleSchreibweise } from "../schreibweise";
import type { FormKontext, Uebungsform } from "./typen";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";
import { FORM_NAMEN } from "./namen";
import { SALAT_KEINE_WOERTER, SALAT_NAMEN } from "./salatNamen";
import { SALATWOERTER_FR } from "./buchstabensalatFr";
import { SALATWOERTER_ES } from "./buchstabensalatEs";
import { SALATWOERTER_IT } from "./buchstabensalatIt";
import { SALATWOERTER_PL } from "./buchstabensalatPl";
import { SALATWOERTER_CS } from "./buchstabensalatCs";
import { SALATWOERTER_TR } from "./buchstabensalatTr";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Wege haben je eine eigene, noch leere Datei (`buchstabensalat<Xx>.ts`).
import { SALATWOERTER_BG } from "./buchstabensalatBg";
import { SALATWOERTER_EL } from "./buchstabensalatEl";
import { SALATWOERTER_HU } from "./buchstabensalatHu";
import { SALATWOERTER_NL } from "./buchstabensalatNl";
import { SALATWOERTER_PT } from "./buchstabensalatPt";
import { SALATWOERTER_BR } from "./buchstabensalatBr";
import { SALATWOERTER_RO } from "./buchstabensalatRo";
import { SALATWOERTER_SV } from "./buchstabensalatSv";
import { SALATWOERTER_UK } from "./buchstabensalatUk";
import { eigenOderEn } from "../geruestRueckfall";

/** Ein Quellwort mit dem, was aus ihm herausgeholt werden kann. */
export interface Salatwort {
  wort: string;
  stufen: InhaltsStufe[];
}

/**
 * Deutsche Quellwörter - lang und buchstabenreich, damit wirklich zehn Funde
 * drinstecken. Jedes einzelne ist gegen {@link salatVorrat} geprüft (siehe
 * Test `tests/tastenflow-form-buchstabensalat.test.ts`): unter zehn
 * herausholbaren Wörtern fliegt ein Kandidat raus, weil das sonst eine
 * Aufgabe gegen das Kind wäre.
 */
export const SALATWOERTER_DE: Salatwort[] = [
  // Charge 3 (02.09.2026): kurze Quellwoerter, nach ERTRAG ausgewaehlt
  // 5 Buchstaben
  { wort: "Insel", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Liste", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Stiel", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Eisen", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Stein", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Truhe", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Herde", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Sorte", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Linde", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "steil", stufen: ["kids", "teens", "erwachsen"] },
  // 6 Buchstaben
  { wort: "Listen", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Sorten", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Reisen", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Sirene", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Leiste", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Sieben", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Seiten", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Steine", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Stange", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "einmal", stufen: ["kids", "teens", "erwachsen"] },
  // 7 Buchstaben
  { wort: "Leisten", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Fliesen", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Frieden", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Stiefel", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Seewind", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Borsten", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Trauben", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "Delfine", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "liefern", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "niemals", stufen: ["kids", "teens", "erwachsen"] },
  // 8 Buchstaben  - laenger: erst ab teens, ein langer Vorrat will im Kopf behalten werden
  { wort: "Streifen", stufen: ["teens", "erwachsen"] },
  { wort: "Stiefeln", stufen: ["teens", "erwachsen"] },
  { wort: "Erlebnis", stufen: ["teens", "erwachsen"] },
  { wort: "Helferin", stufen: ["teens", "erwachsen"] },
  { wort: "tauschen", stufen: ["teens", "erwachsen"] },
  { wort: "streiten", stufen: ["teens", "erwachsen"] },
  { wort: "Stacheln", stufen: ["teens", "erwachsen"] },
  { wort: "lebendig", stufen: ["teens", "erwachsen"] },
  { wort: "Landtier", stufen: ["teens", "erwachsen"] },
  { wort: "kleinste", stufen: ["teens", "erwachsen"] },
  // 9 Buchstaben  - laenger: erst ab teens, ein langer Vorrat will im Kopf behalten werden
  { wort: "Nordseite", stufen: ["teens", "erwachsen"] },
  { wort: "studieren", stufen: ["teens", "erwachsen"] },
  { wort: "Belastung", stufen: ["teens", "erwachsen"] },
  { wort: "Ruhestand", stufen: ["teens", "erwachsen"] },
  { wort: "Unterlage", stufen: ["teens", "erwachsen"] },
  { wort: "Setzlinge", stufen: ["teens", "erwachsen"] },
  { wort: "Schneider", stufen: ["teens", "erwachsen"] },
  { wort: "Bahnsteig", stufen: ["teens", "erwachsen"] },
  { wort: "schreiben", stufen: ["teens", "erwachsen"] },
  { wort: "klatschen", stufen: ["teens", "erwachsen"] },
  // 10 Buchstaben  - laenger: erst ab teens, ein langer Vorrat will im Kopf behalten werden
  { wort: "Steinmauer", stufen: ["teens", "erwachsen"] },
  { wort: "Fahrdienst", stufen: ["teens", "erwachsen"] },
  { wort: "magnetisch", stufen: ["teens", "erwachsen"] },
  { wort: "Seiltänzer", stufen: ["teens", "erwachsen"] },
  { wort: "Arbeitsweg", stufen: ["teens", "erwachsen"] },
  { wort: "Donnerstag", stufen: ["teens", "erwachsen"] },
  { wort: "elektrisch", stufen: ["teens", "erwachsen"] },
  { wort: "Tageslicht", stufen: ["teens", "erwachsen"] },
  { wort: "Satelliten", stufen: ["teens", "erwachsen"] },
  { wort: "Maiskolben", stufen: ["teens", "erwachsen"] },
];

/**
 * Englische Quellwörter - dieselbe Regel: lang, buchstabenreich, jedes
 * einzeln gegen {@link salatVorrat} geprüft.
 */
export const SALATWOERTER_EN: Salatwort[] = [
  // Batch 3 (02.09.2026): short source words, selected by YIELD
  // 5 Buchstaben
  { wort: "earth", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "heart", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "stage", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "trade", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "stone", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "notes", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "metal", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "tiles", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "steam", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "tales", stufen: ["kids", "teens", "erwachsen"] },
  // 6 Buchstaben
  { wort: "stream", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "master", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "hearts", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "metals", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "trades", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "ladies", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "waters", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "listen", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "plates", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "tables", stufen: ["kids", "teens", "erwachsen"] },
  // 7 Buchstaben
  { wort: "planets", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "parents", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "parties", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "plaster", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "largest", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "strange", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "carpets", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "magnets", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "heaters", stufen: ["kids", "teens", "erwachsen"] },
  { wort: "threads", stufen: ["kids", "teens", "erwachsen"] },
  // 8 Buchstaben  - laenger: erst ab teens, ein langer Vorrat will im Kopf behalten werden
  { wort: "teachers", stufen: ["teens", "erwachsen"] },
  { wort: "southern", stufen: ["teens", "erwachsen"] },
  { wort: "tadpoles", stufen: ["teens", "erwachsen"] },
  { wort: "forecast", stufen: ["teens", "erwachsen"] },
  { wort: "triangle", stufen: ["teens", "erwachsen"] },
  { wort: "distance", stufen: ["teens", "erwachsen"] },
  { wort: "blankets", stufen: ["teens", "erwachsen"] },
  { wort: "software", stufen: ["teens", "erwachsen"] },
  { wort: "feathers", stufen: ["teens", "erwachsen"] },
  { wort: "patterns", stufen: ["teens", "erwachsen"] },
  // 9 Buchstaben  - laenger: erst ab teens, ein langer Vorrat will im Kopf behalten werden
  { wort: "triangles", stufen: ["teens", "erwachsen"] },
  { wort: "particles", stufen: ["teens", "erwachsen"] },
  { wort: "hailstone", stufen: ["teens", "erwachsen"] },
  { wort: "merchants", stufen: ["teens", "erwachsen"] },
  { wort: "signature", stufen: ["teens", "erwachsen"] },
  { wort: "materials", stufen: ["teens", "erwachsen"] },
  { wort: "orchestra", stufen: ["teens", "erwachsen"] },
  { wort: "countries", stufen: ["teens", "erwachsen"] },
  { wort: "elephants", stufen: ["teens", "erwachsen"] },
  { wort: "limestone", stufen: ["teens", "erwachsen"] },
  // 10 Buchstaben  - laenger: erst ab teens, ein langer Vorrat will im Kopf behalten werden
  { wort: "smartphone", stufen: ["teens", "erwachsen"] },
  { wort: "trampoline", stufen: ["teens", "erwachsen"] },
  { wort: "earthworms", stufen: ["teens", "erwachsen"] },
  { wort: "palindrome", stufen: ["teens", "erwachsen"] },
  { wort: "resistance", stufen: ["teens", "erwachsen"] },
  { wort: "astronomer", stufen: ["teens", "erwachsen"] },
  { wort: "downstairs", stufen: ["teens", "erwachsen"] },
  { wort: "directions", stufen: ["teens", "erwachsen"] },
  { wort: "barometers", stufen: ["teens", "erwachsen"] },
  { wort: "kilometres", stufen: ["teens", "erwachsen"] },
];

/**
 * Warum eine Eingabe nicht zählt - der Bildschirm macht daraus die
 * Rückmeldung. Auskunft, keine Wertung (siehe Kopf-Kommentar).
 */
export type SalatUrteil =
  | { ok: true; wort: string }
  | {
      ok: false;
      grund: "zu-kurz" | "nicht-im-vorrat" | "kein-wort" | "name" | "schon-gehabt" | "das-quellwort";
    };

/**
 * Mindestlänge eines Fundes.
 *
 * ★★ 20.09.2026 von 3 auf 2 heruntergesetzt. Johannes, wörtlich: *„Und der
 * Buchstabensalat akzeptiert 'Ei' immer noch nicht. Mindestens 3
 * Buchstaben."* - „Ei" ist ein Wort, das jedes Kind kennt, es steht im
 * Lexikon (gemessen: `isRealWord("ei", "de")` ist wahr), und es aus dem
 * Buchstabenvorrat herauszulesen ist genau die Übung. Die Drei war eine
 * gesetzte Zahl ohne Messung; sie hat einen richtigen Fund als Fehler
 * ausgewiesen.
 *
 * Die Zahl gilt an BEIDEN Stellen zugleich - beim Zählen des Vorrats
 * ({@link salatVorrat}) und beim Annehmen einer Eingabe
 * ({@link pruefeSalatwort}). Zwei verschiedene Grenzen wären wieder die
 * Falle „zwei Stellen, die voneinander nichts wissen" (02.09.2026).
 *
 * ⚠️ Ein einzelner Buchstabe bleibt kein Fund: `isRealWord` nimmt ohnehin
 * erst ab zwei Zeichen etwas an.
 */
const MINDESTLAENGE = 2;

/** Wie viele herausholbare Wörter ein Quellwort mindestens hergeben muss. */
/**
 * So viele Wörter sind das ZIEL einer Runde.
 *
 * ★★★★ Johannes am 02.09.2026: *„es müssen 4 gefunden werden"* - heruntergesetzt
 * von zehn, zusammen mit der Umstellung auf KURZE Quellwörter.
 *
 * Die beiden Änderungen gehören zusammen und sind an einer Messung
 * entschieden: Aus einem 17-Buchstaben-Wort wie „Schokoladenkuchen" sind 237
 * Wörter zu holen - für ein Kind mit Blindheit heisst das, siebzehn Buchstaben
 * im Kopf zu behalten und darin zu suchen. Aus „Insel" sind es 18, und die
 * fünf Buchstaben hat man beim Abtasten sofort beisammen. Weniger Vorrat ist
 * hier LEICHTER, nicht ärmer - Johannes: *„damit auch sicher welche gefunden
 * werden."*
 *
 * ⚠️ Vier ist ein ZIEL, keine Hürde: Die Runde endet, wann das Kind will, und
 * wer zwei findet, hat trotzdem geübt.
 */
export const SALAT_ZIEL = 4;

/** Buchstaben-Mengenrechnung: wie oft kommt jeder Buchstabe in `s` vor? */
function buchstabenZaehlung(s: string): Map<string, number> {
  const zaehlung = new Map<string, number>();
  for (const ch of s) zaehlung.set(ch, (zaehlung.get(ch) ?? 0) + 1);
  return zaehlung;
}

/**
 * Passt `kandidat` (normalisiert) in den Buchstabenvorrat von `vorrat`
 * (schon als Zählung vorliegend)? Jeder Buchstabe höchstens so oft wie im
 * Quellwort - genau die Mengenrechnung aus dem Auftrag („Ei" aus
 * „Weihnachtsbaum" zählt, „Eier" nicht - nur ein „e").
 */
function passtInVorrat(kandidat: string, vorrat: Map<string, number>): boolean {
  const zaehlung = buchstabenZaehlung(kandidat);
  for (const [ch, n] of zaehlung) {
    if ((vorrat.get(ch) ?? 0) < n) return false;
  }
  return true;
}


/**
 * ⚠️ Läuft über eine große Wortliste - deshalb gecacht, je Quellwort +
 * Sprache. Ohne den Cache würde jede Eingabe auf dem Bildschirm die ganze
 * Liste neu durchrechnen und die Übung zäh machen.
 */
const VORRAT_CACHE = new Map<string, string[]>();
// ★ 28.09.2026: Das Lexikon wächst, sobald ein Sprachpaket kommt
// (`sprachpakete.ts`) - ein vorher gerechneter Vorrat wäre dann zu klein.
beiSprachpaket(() => VORRAT_CACHE.clear());

/**
 * Wie viele echte Wörter aus diesem Quellwort überhaupt herauszuholen sind -
 * Mengenrechnung + Mindestlänge + Lexikon. Das Quellwort selbst zählt nicht mit.
 *
 * ★★★★ 02.09.2026 - DIESELBE QUELLE WIE DIE ANNAHME. Bis heute zählte diese
 * Funktion gegen `WORDS`/`STUFE_VOCAB` (531 deutsche Wörter), während
 * {@link pruefeSalatwort} über `isRealWord` gegen das ganze Lexikon annahm
 * (7952). Über alle 28 Quellwörter gemessen: gezählt 574, angenommen 4783 -
 * **Faktor 8,3**. Johannes am 02.09.: *„Der Buchstabensalat macht nur Spaß
 * wenn das Programm wirklich alle Wörter kennt, die man mit den gegebenen
 * Buchstaben finden kann."* Zwei Listen für eine Frage sind genau die Falle
 * aus [[feedback_zwei_stellen_die_voneinander_nichts_wissen]]; jetzt gibt es
 * nur noch eine.
 */
export function salatVorrat(quellwort: string, lang: Lang): string[] {
  // ★ E10b-2: MIT Sprache normalisiert - für „fr" bleiben Akzente stehen
  // (ohne `lang` würde „é" still gestrichen); für „de"/„en" byte-gleich.
  const quelle = normalizeWord(quellwort, lang);
  const schluessel = `${lang}:${quelle}`;
  const gecacht = VORRAT_CACHE.get(schluessel);
  if (gecacht) return gecacht;

  const vorrat = buchstabenZaehlung(quelle);
  const treffer = lexikonWoerter(lang).filter(
    (w) =>
      w.length >= MINDESTLAENGE &&
      w !== quelle &&
      passtInVorrat(w, vorrat) &&
      // ★ 25.09.2026: Namen und Abkürzungen zählen nicht (`salatNamen.ts`).
      !SALAT_NAMEN[lang].has(w) &&
      !SALAT_KEINE_WOERTER[lang].has(w),
  );
  VORRAT_CACHE.set(schluessel, treffer);
  return treffer;
}

/**
 * Zählt diese Eingabe? Prüft der Reihe nach: Länge, Buchstabenvorrat
 * (Mengenrechnung), ob es genau das Quellwort ist, ob es schon gehabt wurde -
 * und zuletzt das Lexikon (großzügiger als der reine Fundus aus
 * {@link salatVorrat}: auch ein Wort aus den Geschichten oder dem
 * Übungs-Wortschatz, das nicht in `WORDS`/`STUFE_VOCAB` steht, zählt).
 *
 * Groß-/Kleinschreibung und Umlaute werden über `normalizeWord` angeglichen -
 * ein deutsches Nomen darf klein eingegeben zählen, ein Kind soll nicht an
 * der Großschreibung scheitern, wenn es die Aufgabe gelöst hat.
 */
export function pruefeSalatwort(
  eingabe: string,
  quellwort: string,
  schonGehabt: readonly string[],
  lang: Lang,
): SalatUrteil {
  // ★ E10b-2: MIT Sprache normalisiert (siehe `salatVorrat`).
  const wort = normalizeWord(eingabe, lang);
  const quelle = normalizeWord(quellwort, lang);

  if (wort.length < MINDESTLAENGE) return { ok: false, grund: "zu-kurz" };

  const vorrat = buchstabenZaehlung(quelle);
  if (!passtInVorrat(wort, vorrat)) return { ok: false, grund: "nicht-im-vorrat" };

  if (wort === quelle) return { ok: false, grund: "das-quellwort" };

  if (schonGehabt.some((w) => normalizeWord(w, lang) === wort)) return { ok: false, grund: "schon-gehabt" };

  // ★ 25.09.2026 (Johannes): Namen zählen nicht - mit eigener Auskunft, damit
  // das Kind weiss, WARUM (es hat ja etwas Richtiges geschrieben).
  if (SALAT_NAMEN[lang].has(wort)) return { ok: false, grund: "name" };
  if (SALAT_KEINE_WOERTER[lang].has(wort) || !isRealWord(wort, lang))
    return { ok: false, grund: "kein-wort" };

  // ★ Abnahme 02.09.2026 (Probelauf im Browser): Zurückgegeben wurde bis dahin
  // die kleingeschriebene Fassung - ein Kind tippte `Berg` und bekam `berg` in
  // seine Liste. Ein deutsches Nomen kleinzuschreiben ist falsch, und es sieht
  // aus wie eine Verbesserung, die keine ist. Geprüft wird weiter ohne
  // Rücksicht auf Groß- und Kleinschreibung (ein Kind soll nicht daran
  // scheitern) - ANGEZEIGT wird, was das Kind geschrieben hat.
  return { ok: true, wort: eingabe.trim() };
}

/**
 * ★ E10b (25.09.2026, Bauplan französischer Lehrgang §2.3 Punkt 4): eine
 * Tabelle statt der Zwei-Wege-Ternäre (nur „en" oder sonst Deutsch) - die
 * Ternäre gab für „fr" still den deutschen Vorrat zurück. ★ E10b-2
 * (26.09.2026): „fr" hat jetzt eigenen, auf Französisch geschriebenen Inhalt
 * (eigene Datei `…Fr.ts`).
 */
// ★ ES-W (27.09.2026): „es" hat eigenen, auf Spanisch gewählten Inhalt
// (`buchstabensalatEs.ts`) - vorher LEER (ES-F2), die Form wurde nicht angeboten.
const QUELLWOERTER: Record<Lang, Salatwort[]> = {
  de: SALATWOERTER_DE,
  en: SALATWOERTER_EN,
  fr: SALATWOERTER_FR,
  es: SALATWOERTER_ES,
  // ★ IT-W (03.10.2026): „it" hat eigene Quellwörter (`buchstabensalatIt.ts`) - vorher das Englische (ein englisches
  // Quellwort, geprüft gegen das ITALIENISCHE Lexikon).
  it: SALATWOERTER_IT,
  // ★ PL-W (09.10.2026): „pl" hat eigene Quellwörter (`buchstabensalatPl.ts`) - vorher das Englische (ein englisches
  // Quellwort, geprüft gegen das POLNISCHE Lexikon).
  pl: SALATWOERTER_PL,
  // ★ TR-W (09.10.2026): „tr" hat eigene Quellwörter (`buchstabensalatTr.ts`) - vorher das Englische (ein englisches
  // Quellwort, geprüft gegen das TÜRKISCHE Lexikon).
  tr: SALATWOERTER_TR,
  // ★ CS-W (09.10.2026): „cs" hat eigene Quellwörter (`buchstabensalatCs.ts`) - vorher das Englische (ein englisches
  // Quellwort, geprüft gegen das TSCHECHISCHE Lexikon).
  cs: SALATWOERTER_CS,
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  // ★ G3c-VERTEILER (25.10.2026): jede liest schon ihre eigene Datei (`buchstabensalat<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  bg: eigenOderEn(SALATWOERTER_BG, SALATWOERTER_EN),
  el: eigenOderEn(SALATWOERTER_EL, SALATWOERTER_EN),
  hu: eigenOderEn(SALATWOERTER_HU, SALATWOERTER_EN),
  nl: eigenOderEn(SALATWOERTER_NL, SALATWOERTER_EN),
  pt: eigenOderEn(SALATWOERTER_PT, SALATWOERTER_EN),
  br: eigenOderEn(SALATWOERTER_BR, SALATWOERTER_EN),
  ro: eigenOderEn(SALATWOERTER_RO, SALATWOERTER_EN),
  sv: eigenOderEn(SALATWOERTER_SV, SALATWOERTER_EN),
  uk: eigenOderEn(SALATWOERTER_UK, SALATWOERTER_EN),
};

/** Die Quellwörter je Sprache. */
function quellwoerter(lang: Lang): Salatwort[] {
  return QUELLWOERTER[lang];
}

/**
 * Wähle ein Quellwort passend zu Tastenstand, Stufe und Sprache. `null`, wenn
 * keines taugt.
 *
 * ★ Zwei Bedingungen, beide hart: das Quellwort muss zur Alters-Stufe passen
 * (`contentStufenFor`, wie überall sonst im Wortschatz - alte Konten tragen
 * noch `a`/`b`/`c`) UND jeder seiner Buchstaben muss freigeschaltet sein
 * (`fitsKeys`) - sonst bekäme ein Kind ein Wort vorgesetzt, das es nicht
 * einmal selbst tippen kann.
 */
/**
 * Wie viele Zellen eine gewöhnliche Braillezeile hat.
 *
 * ★ Johannes am 02.09.2026: *„niemand im Schulalltag verwendet kleinere Zeilen
 * wie 40er, und wenn, dann kann er immer noch mit der Zeile hin und her."* 40
 * ist also die untere Grenze, nicht der Normalfall - wer eine 14er hat,
 * blättert, und das ist ihm zumutbar. Die Zahl bleibt als Haushalt stehen,
 * damit niemand versehentlich eine Beschriftung baut, die auch auf 40 Zellen
 * nicht mehr aufgeht.
 */
export const BRAILLE_ZELLEN = 40;

/**
 * So viele Leerzellen stehen zwischen den Buchstaben und dem, was das Kind
 * schreibt - Johannes' Vorgabe vom 02.09.2026: *„ich kann die Buchstaben links
 * hinschreiben, dann immer 4 Leerzeichen machen und dann den Cursor
 * platzieren."*
 *
 * Vier, nicht eins: Auf einer Braillezeile ist eine einzelne Leerzelle beim
 * Abtasten leicht zu übersehen; vier sind eine fühlbare Lücke und trennen den
 * Vorrat sicher von der eigenen Eingabe.
 */
export const BRAILLE_ABSTAND = 4;

/**
 * Der BUCHSTABENVORRAT des Quellworts als Zeichenkette - sortiert, mit
 * Doppelungen.
 *
 * Sortiert, damit ein Kind beim Abtasten gleich fühlt, dass ein Buchstabe
 * zweimal da ist („aa", „hh"); ungeordnet müsste es die ganze Zeile im Kopf
 * behalten. Kleingeschrieben, weil die Mengenrechnung ohnehin so rechnet
 * (`normalizeWord`).
 */
export function salatBuchstaben(quellwort: string, lang?: Lang): string {
  // ★ ES-W (27.09.2026): MIT Sprache normalisiert - für „es" bleibt das ñ
  // stehen (ohne `lang` fiele es still weg: „piñata" zeigte „a a i p t").
  // Für „de"/„en" byte-gleich (dieselbe Zeichenklasse), für „fr" ebenso,
  // solange die Quellwörter keinen Akzent tragen (Wächter wortspiele-fr).
  return [...normalizeWord(quellwort, lang)].sort().join("");
}

/**
 * Die BESCHRIFTUNG des Eingabefeldes - der Buchstabenvorrat, dann eine Lücke.
 *
 * ★★★ So sieht eine Braillezeile beim Schreiben aus (Johannes' Vorgabe vom
 * 02.09.2026):
 *
 * ```
 *   a a b c e h h i m n s t u w        Weih▮
 *   └─ der Vorrat, links ──┘  └4┘      └─ was das Kind gerade schreibt
 * ```
 *
 * Eine Braillezeile zeigt die Beschriftung eines Feldes unmittelbar VOR dem
 * Feldinhalt (siehe `index.css`, Abschnitt zur Feldbeschriftung). Der Vorrat
 * steht damit dort, wo die Finger beim Schreiben ohnehin vorbeikommen -
 * vorher stand er als eigener Absatz auf der Seite, und ein Kind mit Blindheit
 * musste für jeden Versuch aus dem Feld heraus, ihn suchen und zurückgehen.
 *
 * ⚠️ **Kein erklärendes Wort in der Beschriftung.** Es würde vor dem Vorrat
 * stehen und ihn nach rechts schieben - und es sagt nichts, was die Ansage der
 * Form nicht schon gesagt hat. Was das Feld ist, steht sichtbar darüber.
 *
 * ★★★ 25.09.2026 (Testerin, Entscheidung Johannes): **das QUELLWORT steht vorne,**
 * dann die Buchstaben einzeln, nach dem Abc - `Insel: e i l n s`. Mit
 * Screenreader hörte ein Kind bis dahin nur `eilns`, das Wort selbst nie: die
 * Ansage der App schweigt, wenn ihre Stimme aus ist, und genau dann liest der
 * Screenreader die Beschriftung. Buchstaben ohne das Wort lassen sich schlecht
 * merken; kennt man das Wort, geht es leicht. Die Leerzeichen dazwischen
 * lassen den Screenreader buchstabieren statt ein Kunstwort zu lesen.
 */
export function salatFeldbeschriftung(quellwort: string, lang: Lang): string {
  // Geschützte Leerzeichen: gewöhnliche würden im HTML zu einem einzigen
  // zusammenfallen, und aus vier Zellen würde eine.
  return `${quellwort}: ${[...salatBuchstaben(quellwort, lang)].join(" ")}` + "\u00a0".repeat(BRAILLE_ABSTAND);
}

export function waehleSalatwort(ctx: FormKontext): string | null {
  const allowed = new Set(ctx.introduced);
  const etiketten = new Set(contentStufenFor(ctx.stufe));
  // ★ E10: Schreibweise VOR der Tastenprüfung - das Quellwort (und damit der
  // ganze Buchstabenvorrat, den `salatVorrat`/`pruefeSalatwort` daraus
  // rechnen) ist dann die WIRKLICH gezeigte Form.
  const varianteAn = ctx.lang === "en" && ctx.variante === "us";
  const kandidaten = quellwoerter(ctx.lang)
    .map((sw) => (varianteAn ? { ...sw, wort: wandleSchreibweise(sw.wort, "us") } : sw))
    .filter((sw) => sw.stufen.some((s) => etiketten.has(s)) && fitsKeys(sw.wort, allowed));
  if (kandidaten.length === 0) return null;
  const index = Math.min(kandidaten.length - 1, Math.floor(ctx.zufall() * kandidaten.length));
  return kandidaten[index].wort;
}

/** Bedienung (EN4) - Deutsch wortgleich wie vorher. */
const TEXTE = texte({
  de: {
    ankuendigung:
      "Jetzt kommt ein Buchstabensalat. Aus einem langen Wort machst du so viele neue Wörter wie möglich.",
  },
  en: {
    ankuendigung:
      "Now for a letter jumble. Use the letters of one long word to make as many new words as you can.",
  },
  // ★ E11a-5 (26.09.2026): Französisch aus der Funktion neu geschrieben (tu, kurz).
  fr: {
    ankuendigung:
      "Voici des lettres mélangées. Avec les lettres d'un mot, forme le plus de mots nouveaux possible.",
  },
  es: {
    ankuendigung:
      "Aquí tienes letras revueltas. Con las letras de una palabra, forma todas las palabras nuevas que puedas.",
  },
  it: {
    ankuendigung:
      "Ora tocca alle lettere mescolate. Con le lettere di una parola lunga formi tutte le parole nuove che puoi.",
  },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: {
    ankuendigung:
      "Teraz kolej na: Pomieszane litery. Z liter jednego długiego słowa ułóż jak najwięcej nowych słów.",
  },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: {
    ankuendigung:
      "Sırada: Karışık harfler. Uzun bir kelimenin harflerinden yapabildiğin kadar yeni kelime yap.",
  },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: {
    ankuendigung:
      "Teď: přeházená písmena. Z písmen jednoho dlouhého slova poskládej co nejvíc nových slov.",
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: разбъркани букви. С буквите на една дълга дума направи колкото можеш повече нови думи.",
  },
  el: {
    ankuendigung: "Τώρα: ανακατεμένα γράμματα. Με τα γράμματα μιας μεγάλης λέξης φτιάξε όσο περισσότερες νέες λέξεις μπορείς.",
  },
  hu: {
    ankuendigung: "Most: összekevert betűk. Egy hosszú szó betűiből rakj ki minél több új szót.",
  },
  nl: {
    ankuendigung: "Nu: husselwoorden. Maak met de letters van één lang woord zoveel mogelijk nieuwe woorden.",
  },
  pt: {
    ankuendigung: "Agora: letras baralhadas. Com as letras de uma palavra comprida, forma o maior número possível de palavras novas.",
  },
  br: {
    ankuendigung: "Agora: letras embaralhadas. Com as letras de uma palavra comprida, forme o maior número possível de palavras novas.",
  },
  ro: {
    ankuendigung: "Acum: litere amestecate. Din literele unui cuvânt lung formează cât mai multe cuvinte noi.",
  },
  sv: {
    ankuendigung: "Nu: bokstavssallad. Bilda så många nya ord du kan av bokstäverna i ett långt ord.",
  },
  uk: {
    ankuendigung: "Далі: переплутані літери. З літер одного довгого слова склади якомога більше нових слів.",
  },
});

export const buchstabensalat: Uebungsform = {
  id: "buchstabensalat",
  name: FORM_NAMEN.de.buchstabensalat,
  ankuendigung: (ctx) => TEXTE[bedienSpracheVon(ctx)].ankuendigung,
  // taugt: es gibt ein Quellwort für diesen Tastenstand - genau das rechnet
  // `waehleSalatwort` schon aus (Stufe + vollständige Tippbarkeit). Eine
  // eigene Buchstaben-Untergrenze hier wäre nur eine Vermutung über etwas,
  // das sich exakt ausrechnen lässt.
  taugt: (ctx) => waehleSalatwort(ctx) !== null,
  eigenerBildschirm: "buchstabensalat",
};
