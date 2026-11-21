/**
 * Gemeinsame Datums-Anzeigen fürs Revier (`de-DE`).
 *
 * Bis 11.09.2026 hatten `PupilStatsPanel.tsx` und `BadgeZoomDialog.tsx` je
 * eine eigene, fast identische `fmtDate()` - eine mit Null-Schutz und ohne
 * Jahr, die andere ohne Null-Schutz und mit Jahr. Hier zusammengeführt.
 *
 * ★ EN3 (19.09.2026): beide mit der Bedienungssprache. Ohne Angabe Deutsch,
 * also genau wie vorher; englisch britisch nach Glossar §1.2 - kurz „5 Sept",
 * mit Jahr „5 Sept 2026" (Tag vor Monat, ohne Punkte, ohne führende Null).
 *
 * ★ E11a-5 (26.09.2026): französisch „5 sept." / „5 sept. 2026" - mit
 * Monatsnamen wie im Englischen, weil eine Sprachausgabe „05/09" Ziffer für
 * Ziffer liest. Bis dahin lieferten beide Funktionen für „fr" still das
 * DEUTSCHE Format (`sprache === "en"` - sonst Deutsch, Falle 30).
 */
import type { BedienSprache } from "../bedienSprache/sprache";
import { englischVariante } from "./schreibweise";

/**
 * ★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.4, Johannes
 * Entscheidung 6): das englische Datum folgt der Schreibweise - an einer
 * US-Tastatur (oder mit US-Browser, gemerkter Wahl, Klassen-Vorgabe)
 * amerikanisch „Sep 5, 2026", sonst britisch „5 Sept 2026". Bis W1 immer
 * britisch.
 */
/**
 * ★ O-IT (02.10.2026): die italienische Präposition mit Artikel vor einem
 * Tagesdatum - „dal 14", aber „dall'8", „all'1", „l'11" (Elision vor einer
 * Zahl, die mit Vokal gesprochen wird: uno, otto, undici). Mit Leerzeichen
 * bzw. Apostroph am Ende, das Datum folgt direkt.
 */
export function itPrepTag(prep: "il" | "dal" | "al" | "del", tagDesMonats: number): string {
  const elision = tagDesMonats === 1 || tagDesMonats === 8 || tagDesMonats === 11;
  if (!elision) return `${prep} `;
  return prep === "il" ? "l'" : `${prep.slice(0, -1)}ll'`;
}

function englischesDatum(): "en-US" | "en-GB" {
  return englischVariante() === "us" ? "en-US" : "en-GB";
}

/** ★ O2-LIB (30.10.2026): die neun Sprachen des Gerüsts mit eigenem Gebiet - Tag, kurzer Monat, Jahr macht Intl. */
const GEBIET_NEUN: Partial<Record<BedienSprache, string>> = {
  bg: "bg-BG",
  el: "el-GR",
  hu: "hu-HU",
  nl: "nl-NL",
  pt: "pt-PT",
  br: "pt-BR",
  ro: "ro-RO",
  sv: "sv-SE",
  uk: "uk-UA",
};

/** Tag/Monat, z. B. „05.09." (englisch „5 Sept") - null-sicher, liefert „-" ohne Zeitpunkt. */
export function fmtTagMonat(ts: number | null | undefined, sprache: BedienSprache = "de"): string {
  if (!ts) return "-";
  const gebietNeun = GEBIET_NEUN[sprache];
  if (gebietNeun) return new Date(ts).toLocaleDateString(gebietNeun, { day: "numeric", month: "short" });
  // ★ O-CS (03.10.2026): „21. 9." (Glossar §2.10, gemessen mit Intl cs-CZ - Ziffern, kein Monatsname).
  if (sprache === "cs")
    return new Date(ts).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
  // ★ O-TR (02.10.2026): "21 Eyl" (Glossar §2.10, gemessen mit Intl tr-TR).
  if (sprache === "tr")
    return new Date(ts).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  // ★ O-PL (02.10.2026): „21 wrz" (Glossar §2.10, Monat im Genitiv macht Intl).
  if (sprache === "pl")
    return new Date(ts).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
  // ★ O-IT (02.10.2026): „21 set" (Glossar §2.10).
  if (sprache === "it")
    return new Date(ts).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  if (sprache === "fr")
    return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  // ★ ES-O (27.09.2026): „es" fiel hier still auf das deutsche „05.09." (Falle 30).
  if (sprache === "es")
    return new Date(ts).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  if (sprache === "en")
    return new Date(ts).toLocaleDateString(englischesDatum(), { day: "numeric", month: "short" });
  return new Date(ts).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
}

/** Tag/Monat/Jahr, z. B. „05.09.2026" (englisch „5 Sept 2026") - null-sicher, liefert „-" ohne Zeitpunkt. */
export function fmtTagMonatJahr(
  ts: number | null | undefined,
  sprache: BedienSprache = "de",
): string {
  if (!ts) return "-";
  const gebietNeun = GEBIET_NEUN[sprache];
  if (gebietNeun) return new Date(ts).toLocaleDateString(gebietNeun, { day: "numeric", month: "short", year: "numeric" });
  // ★ O-CS (03.10.2026): „21. 9. 2026" (Glossar §2.10, gemessen mit Intl cs-CZ).
  if (sprache === "cs")
    return new Date(ts).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  // ★ O-TR (02.10.2026): "21 Eyl 2026" (gemessen mit Intl tr-TR).
  if (sprache === "tr")
    return new Date(ts).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  // ★ O-PL (02.10.2026): „21 wrz 2026".
  if (sprache === "pl")
    return new Date(ts).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  // ★ O-IT (02.10.2026): „21 set 2026".
  if (sprache === "it")
    return new Date(ts).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  if (sprache === "fr")
    return new Date(ts).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  // ★ ES-O (27.09.2026): Spanisch eigen - „5 sept 2026" (es-ES).
  if (sprache === "es")
    return new Date(ts).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  if (sprache === "en")
    return new Date(ts).toLocaleDateString(englischesDatum(), {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return new Date(ts).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
