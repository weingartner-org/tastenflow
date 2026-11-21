/**
 * ★★★★★ WER GESPENDET HAT, BEKOMMT NIE WIEDER EINEN SPENDENBANNER (19.09.2026).
 * ===========================================================================
 * Johannes, 19.09.2026, wörtlich: *„wir machen nur Version 2, aber dann nicht
 * mehr - weil wer schon drückt, möchte eigentlich spenden und wartet dann
 * vielleicht lieber noch ab, aber der spendet sehr wahrscheinlich in zwei
 * Monaten. Ja, unbedingt mit Dankesseite!"*
 *
 * ⇒ „Version 2": Nur eine BESTÄTIGTE Spende zählt. Ein blosser Druck auf einen
 *   Betrag ändert am Banner NICHTS - die Regel „alle 5 Stunden, höchstens alle
 *   zwei Monate" (`spendenbanner.ts`) bleibt für ihn unverändert.
 *
 * ── DER WEG IN DREI SCHRITTEN ───────────────────────────────────────────────
 *  1. DRUCK AUF EINEN BETRAG (`UnterstuetzenSchalter`): VOR dem Öffnen der
 *     Bezahlseite legt DIESE Adresse den Merker „Spende unterwegs" ab
 *     ({@link spendeUnterwegsMerken}) - Zeitstempel, Konto (falls angemeldet),
 *     Sprache der Bedienung und der Rückweg.
 *  2. STRIPE LEITET NACH ERFOLGREICHER ZAHLUNG ZURÜCK - für ALLE fünf Links
 *     auf EINE feste Adresse: `https://weingartner.org/unterstuetzen/danke`
 *     (eingestellt im Stripe-Dashboard, Anleitung:
 *     `apps/tastenflow/ANLEITUNG-2026-09-19-STRIPE-WEITERLEITUNG.md`).
 *  3. DIE DANKESEITE (`UnterstuetzenDankePage.tsx`) entscheidet mit
 *     {@link dankeSchritt}: frischer Merker hier ⇒ bestätigen (Konto-Feld
 *     `gespendetAm` + Merker am Gerät, „unterwegs" gelöscht); kein Merker auf
 *     weingartner.org ⇒ einmal weiter nach tastenflow.org (`?weiter=1`), denn
 *     dort kann der Druck passiert sein; sonst nur Dank, nichts gemerkt.
 *
 * ── WARUM ZWEI ADRESSEN EIN PROBLEM SIND ────────────────────────────────────
 * Dieselbe App läuft unter `weingartner.org` und `tastenflow.org`
 * (`lib/adressen.ts`). Jede Adresse hat ihren EIGENEN Browser-Speicher und
 * ihre eigene Anmeldung - ein Merker auf der einen ist auf der anderen
 * unsichtbar. Stripe kennt aber nur EINE Rückkehr-Adresse je Link. Darum die
 * Weiterleitung: weingartner.org sieht zuerst nach, tastenflow.org als zweites.
 * ⚠️ KEINE SCHLEIFE MÖGLICH: tastenflow.org leitet NIE weiter, und mit
 * `weiter=1` leitet auch weingartner.org nicht mehr weiter.
 *
 * ── WAS GEMERKT WIRD ─────────────────────────────────────────────────────────
 * Nur das Datum und DASS gespendet wurde - kein Betrag, keine Zahlungsdaten
 * (die sieht unser Server nie; Stripe schickt uns nichts zurück ausser dem
 * Aufruf dieser Seite). So steht es auch in der Datenschutzerklärung.
 *
 * ⚠️ Die Schlüssel heissen bewusst NICHT `tastenflow…`/`tippen-…`: Solche
 * Schlüssel zählen in `geraetKenntTastenflow()` (`lib/bedienSprache/sprache.ts`)
 * als „dieses Gerät kennt Tastenflow" und schalteten die Sprach-Erkennung ab.
 *
 * ★ Diese Datei kennt KEIN Backend - nur den Browser-Speicher und die
 * Entscheidung. Das Schreiben ans Konto steht in `lib/spendenKonto.ts`.
 */
import { GERUEST_SPRACHEN_BEDIENUNG, type BedienSprache } from "@/lib/bedienSprache/sprache";
import {
  TASTENFLOW_START,
  istEigenerHost,
  istTastenflowHost,
  type Herkunft,
} from "@/lib/adressen";
import type { SpendenBannerZielgruppe } from "@/lib/spendenbannerTexte";

/** Der Merker „Spende unterwegs" - gesetzt beim Druck auf einen Betrag. */
export const SPENDE_UNTERWEGS_SCHLUESSEL = "spende.unterwegs";

/** Der Merker am GERÄT: Hier wurde eine Spende bestätigt (Zeitstempel ms). */
export const SPENDE_BESTAETIGT_SCHLUESSEL = "spende.bestaetigt";

/**
 * So lange gilt ein Merker „unterwegs" als frisch. Eine Zahlung bei Stripe
 * dauert Minuten; 24 Stunden lassen Luft für jemanden, der die Bezahlseite
 * offen lässt und später fertig macht - und sind kurz genug, dass ein
 * vergessener Druck von letzter Woche keine fremde Spende bestätigt.
 */
export const SPENDE_UNTERWEGS_GUELTIG_MS = 24 * 60 * 60 * 1000;

/** Uhr-Abweichung, die ein Merker „aus der Zukunft" noch haben darf. */
const UHR_TOLERANZ_MS = 5 * 60 * 1000;

/** Die Adresse der Dankesseite - auf BEIDEN Rechnernamen derselbe Pfad. */
export const DANKE_PFAD = "/unterstuetzen/danke";

/** Die feste Rückkehr-Adresse für Stripe (alle fünf Zahlungslinks). */
export const DANKE_ADRESSE_STRIPE = "https://weingartner.org/unterstuetzen/danke";

/** Das Ziel der einen Weiterleitung von weingartner.org nach tastenflow.org. */
export const DANKE_WEITER_ZIEL = `${TASTENFLOW_START}${DANKE_PFAD}?weiter=1`;

/** Was beim Druck auf einen Betrag gemerkt wird. */
export interface SpendeUnterwegs {
  /** Wann gedrückt (`Date.now()`). */
  zeitMs: number;
  /** Das eigene Konto, falls angemeldet - dorthin kommt `gespendetAm`. */
  kontoId?: string;
  /** Welche Sammlung: „lehrkraft" ⇒ `tt_teachers`, „selbstlernend" ⇒ `tt_pupils`. */
  zielgruppe?: SpendenBannerZielgruppe;
  /** Welches Programm - wählt das Backend (`kontoBackendFuer`). */
  app?: string;
  /** Die Bedienungssprache beim Druck - für die Dankesseite in einem neuen Tab. */
  sprache?: BedienSprache;
  /** Der Pfad, von dem aus gespendet wurde - der Rückweg der Dankesseite. */
  zurueck?: string;
}

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
    // Speicher gesperrt (privates Fenster) - dann bleibt es beim Dank.
  }
}

function loesche(schluessel: string): void {
  try {
    window.localStorage.removeItem(schluessel);
  } catch {
    /* nichts zu tun */
  }
}

/**
 * Ein Rückweg ist nur ein Pfad der EIGENEN Adresse - nie `//fremd.org`, nie
 * eine volle Adresse. Der Speicher gehört zwar nur uns, aber ein Verweis, der
 * irgendwohin zeigen KANN, gehört nicht auf eine Seite, auf die man von aussen
 * geleitet wird.
 */
function istEigenerPfad(pfad: unknown): pfad is string {
  return typeof pfad === "string" && /^\/(?![/\\])/.test(pfad) && pfad.length <= 500;
}

/**
 * Wohin „Zurück ins Programm" führt: die Seite, auf der gerade gedrückt wird -
 * ausser den Spendenseiten selbst (von dort gibt es kein Programm zurück).
 */
export function rueckwegHier(): string | undefined {
  try {
    const { pathname, search } = window.location;
    if (pathname.toLowerCase().startsWith("/unterstuetzen")) return undefined;
    const pfad = pathname + search;
    return istEigenerPfad(pfad) ? pfad : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Schritt 1: der Merker „Spende unterwegs". Ändert am Banner NICHTS - er sagt
 * nur der Dankesseite, dass der Weg zu Stripe von DIESER Adresse ausging.
 * Ein zweiter Druck überschreibt den ersten (der jüngere zählt).
 */
export function spendeUnterwegsMerken(
  angaben: Omit<SpendeUnterwegs, "zeitMs">,
  jetztMs = Date.now(),
): void {
  const merker: SpendeUnterwegs = { zeitMs: jetztMs };
  if (angaben.kontoId) merker.kontoId = angaben.kontoId;
  if (angaben.zielgruppe) merker.zielgruppe = angaben.zielgruppe;
  if (angaben.app) merker.app = angaben.app;
  if (angaben.sprache) merker.sprache = angaben.sprache;
  if (istEigenerPfad(angaben.zurueck)) merker.zurueck = angaben.zurueck;
  schreib(SPENDE_UNTERWEGS_SCHLUESSEL, JSON.stringify(merker));
}

/**
 * Der Merker „unterwegs" - nur, wenn er FRISCH ist (jünger als
 * {@link SPENDE_UNTERWEGS_GUELTIG_MS}). Ein veralteter oder kaputter Merker
 * wird dabei gleich weggeräumt und zählt nicht.
 */
export function spendeUnterwegsLesen(jetztMs = Date.now()): SpendeUnterwegs | null {
  const roh = lies(SPENDE_UNTERWEGS_SCHLUESSEL);
  if (!roh) return null;
  let wert: Partial<SpendeUnterwegs> | null = null;
  try {
    wert = JSON.parse(roh) as Partial<SpendeUnterwegs>;
  } catch {
    wert = null;
  }
  const alter = typeof wert?.zeitMs === "number" ? jetztMs - wert.zeitMs : NaN;
  if (!wert || !Number.isFinite(alter) || alter > SPENDE_UNTERWEGS_GUELTIG_MS || alter < -UHR_TOLERANZ_MS) {
    loesche(SPENDE_UNTERWEGS_SCHLUESSEL);
    return null;
  }
  const merker: SpendeUnterwegs = { zeitMs: wert.zeitMs as number };
  if (typeof wert.kontoId === "string" && wert.kontoId) merker.kontoId = wert.kontoId;
  if (wert.zielgruppe === "lehrkraft" || wert.zielgruppe === "selbstlernend") {
    merker.zielgruppe = wert.zielgruppe;
  }
  if (typeof wert.app === "string" && wert.app) merker.app = wert.app;
  // ★ E11a-5 (26.09.2026): „fr" dazu - sonst dankte der neue Tab unter
  // weingartner.org einer französischsprachigen Person auf Deutsch.
  // ★ ES-O (27.09.2026): „es" ebenso.
  // ★ O-IT (02.10.2026): „it" ebenso.
  // ★ O-PL (02.10.2026): „pl" ebenso.
  // ★ O-TR (02.10.2026): "tr" ebenso.
  // ★ O-CS (03.10.2026): "cs" ebenso.
  if (
    wert.sprache === "de" ||
    wert.sprache === "en" ||
    wert.sprache === "fr" ||
    wert.sprache === "es" ||
    wert.sprache === "it" ||
    wert.sprache === "pl" ||
    wert.sprache === "tr" ||
    wert.sprache === "cs" ||
    // ★ O5 (30.10.2026): die neun ebenso - sonst käme die Dankesseite im neuen Tab nicht in ihrer Sprache.
    (GERUEST_SPRACHEN_BEDIENUNG as readonly unknown[]).includes(wert.sprache)
  ) {
    merker.sprache = wert.sprache;
  }
  if (istEigenerPfad(wert.zurueck)) merker.zurueck = wert.zurueck;
  return merker;
}

export function spendeUnterwegsLoeschen(): void {
  loesche(SPENDE_UNTERWEGS_SCHLUESSEL);
}

/** Auf diesem Gerät wurde eine Spende bestätigt - der Merker am Gerät. */
export function geraetSpendeMerken(jetztMs = Date.now()): void {
  schreib(SPENDE_BESTAETIGT_SCHLUESSEL, String(jetztMs));
}

/**
 * Hat dieses Gerät (diese Adresse) eine bestätigte Spende gesehen? Gilt für
 * JEDES Konto auf diesem Gerät - „das Gerät bekommt einen eigenen Merker".
 */
export function geraetHatGespendet(): boolean {
  const roh = lies(SPENDE_BESTAETIGT_SCHLUESSEL);
  return !!roh && Number(roh) > 0;
}

/** Was die Dankesseite beim Laden tut - genau eines davon, genau einmal. */
export type DankeSchritt =
  | { art: "bestaetigen"; merker: SpendeUnterwegs }
  | { art: "weiterleiten"; ziel: string }
  | { art: "nurDank" };

/**
 * Die Entscheidung der Dankesseite - rein, ohne Browser prüfbar.
 *
 *  · frischer Merker HIER               ⇒ bestätigen (auf jeder Adresse)
 *  · kein Merker auf weingartner.org,
 *    ohne `weiter=1`                    ⇒ weiter nach tastenflow.org
 *  · sonst (tastenflow.org, `weiter=1`,
 *    localhost, Vorschau-Rechner)       ⇒ nur Dank, nichts gemerkt
 *
 * @param herkunft `null` ausserhalb eines Browsers - dann nie weiterleiten.
 * @param suche    `location.search` (für `weiter=1`)
 * @param merker   {@link spendeUnterwegsLesen} - schon auf Frische geprüft
 */
export function dankeSchritt(
  herkunft: Herkunft | null,
  suche: string,
  merker: SpendeUnterwegs | null,
): DankeSchritt {
  if (merker) return { art: "bestaetigen", merker };
  if (new URLSearchParams(suche).get("weiter") === "1") return { art: "nurDank" };
  const host = herkunft?.hostname ?? "";
  // Nur weingartner.org (mit oder ohne www) leitet weiter. tastenflow.org ist
  // das Ende der Kette; localhost und Vorschau-Rechner haben keine zweite
  // Adresse, auf die man leiten könnte.
  if (istEigenerHost(host) && !istTastenflowHost(host)) {
    return { art: "weiterleiten", ziel: DANKE_WEITER_ZIEL };
  }
  return { art: "nurDank" };
}

/** Die Herkunft der laufenden Seite - `null` ausserhalb eines Browsers. */
export function laufendeHerkunft(): Herkunft | null {
  try {
    if (typeof window === "undefined" || !window.location) return null;
    return { hostname: window.location.hostname, origin: window.location.origin };
  } catch {
    return null;
  }
}
