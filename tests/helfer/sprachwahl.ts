/**
 * Testhilfe - der SPRACHWÄHLER der Kopfzeile (★ 28.09.2026, Freigabe fr/es).
 *
 * ── Warum es sie gibt ───────────────────────────────────────────────────────
 *
 * Bis zur Freigabe bot Tastenflow ohne Probe-Schalter nur Deutsch und Englisch
 * an; die Kopfzeile zeigte darum den ZWEIER-Knopf („EN - English" /
 * „DE - Deutsch", immer die ANDERE Sprache). Seit Französisch und Spanisch
 * default an sind (`lehrgangSchalter.ts`), stehen vier Sprachen zur Wahl - und
 * `AppKopfzeile.tsx` zeigt bei mehr als zwei Sprachen den SPRACHWÄHLER: ein
 * Knopf mit Weltkugel und dem Kürzel der AKTIVEN Sprache, `aria-label`
 * „Sprache - Language - Langue[ - Idioma]", `aria-haspopup="listbox"`, darunter
 * eine `role="listbox"` mit einem `role="option"`-Knopf je Sprache (`lang` je
 * Eintrag). Nach einer Wahl schliesst die Liste und der Fokus geht auf den
 * Knopf zurück (`useAufklapper` ohne `escAfterClose`, per `setTimeout(0)`).
 *
 * ★ Eine Stelle statt derselben Zeilen in jeder Datei: Wer den Wähler eines
 * Tages anders beschriftet, ändert es hier.
 */
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { expect } from "vitest";

import {
  GERUEST_LEHRGANG_SCHALTER,
  GERUEST_LEHRGAENGE,
  LEHRGANG_PROBE_MERKER_CS,
  LEHRGANG_PROBE_MERKER_ES,
  LEHRGANG_PROBE_MERKER_FR,
  LEHRGANG_PROBE_MERKER_IT,
  LEHRGANG_PROBE_MERKER_PL,
  LEHRGANG_PROBE_MERKER_TR,
} from "../../src/lib/typing/lehrgangSchalter";

/** Der Name des Wählers - mit „Idioma", sobald Spanisch in der Liste steht. */
export const SPRACHWAHL_NAME =
  /^Sprache - Language - Langue( - Idioma)?( - Lingua)?( - Język)?( - Dil)?( - Jazyk)?( - [^-]+)*$/u;

/** So nennt sich jede Sprache in der Liste selbst (`SPRACHWAHL_NAME` in `AppKopfzeile.tsx`). */
export type SprachName =
  | "Deutsch"
  | "English"
  | "Français"
  | "Español"
  | "Italiano"
  | "Polski"
  | "Türkçe"
  | "Čeština";

/** Der Knopf des Sprachwählers - `null`, wenn keiner da ist. */
export function sprachwahlKnopf(bereich?: HTMLElement): HTMLElement | null {
  const q = bereich ? within(bereich) : screen;
  return q.queryByRole("button", { name: SPRACHWAHL_NAME });
}

/** Wartet, bis der Knopf des Sprachwählers da ist. */
export function findeSprachwahlKnopf(bereich?: HTMLElement): Promise<HTMLElement> {
  const q = bereich ? within(bereich) : screen;
  return q.findByRole("button", { name: SPRACHWAHL_NAME });
}

/** Das sichtbare Kürzel der AKTIVEN Sprache am Knopf („DE", „EN", „FR", „ES"). */
export function sprachwahlKuerzel(knopf: HTMLElement | null = sprachwahlKnopf()): string {
  if (!knopf) throw new Error("Kein Sprachwähler in der Seite");
  return (knopf.textContent ?? "").trim();
}

/** Öffnet die Liste und gibt sie zurück. */
export async function sprachwahlOeffnen(
  knopf: HTMLElement | null = sprachwahlKnopf(),
): Promise<HTMLElement> {
  if (!knopf) throw new Error("Kein Sprachwähler in der Seite");
  if (knopf.getAttribute("aria-expanded") !== "true") fireEvent.click(knopf);
  return screen.findByRole("listbox", { name: SPRACHWAHL_NAME });
}

/** Die Einträge einer offenen Liste: Name, `lang`, gewählt? */
export function sprachwahlEintraege(
  liste: HTMLElement,
): { name: string; lang: string | null; gewaehlt: boolean }[] {
  return within(liste)
    .getAllByRole("option")
    .map((o) => ({
      name: (o.textContent ?? "").replace("✓", "").trim(),
      lang: o.getAttribute("lang"),
      gewaehlt: o.getAttribute("aria-selected") === "true",
    }));
}

/**
 * Wählt eine Sprache wie ein Mensch: Knopf drücken, Eintrag drücken. Wartet,
 * bis die Liste zu ist, und gibt den Knopf zurück. Wohin der Fokus danach geht,
 * prüft der Test selbst (siehe {@link fokusZurueckAufDemKnopf}).
 */
export async function waehleSprache(
  name: SprachName,
  knopf: HTMLElement | null = sprachwahlKnopf(),
): Promise<HTMLElement> {
  if (!knopf) throw new Error("Kein Sprachwähler in der Seite");
  const liste = await sprachwahlOeffnen(knopf);
  fireEvent.click(within(liste).getByRole("option", { name: new RegExp(`^${name}`) }));
  await waitFor(() => expect(screen.queryByRole("listbox", { name: SPRACHWAHL_NAME })).toBeNull());
  return knopf;
}

/**
 * Der Fokus nach einer Wahl: zurück auf den Knopf des Wählers (Listbox-Muster,
 * `useAufklapper` - per `setTimeout(0)`, darum gewartet).
 */
export async function fokusZurueckAufDemKnopf(knopf: HTMLElement): Promise<void> {
  await waitFor(() => expect(document.activeElement).toBe(knopf));
}

/**
 * Der ZWEIER-Fall (nur Deutsch und Englisch): Französisch, Spanisch und (seit
 * 10.10.2026) Italienisch, Polnisch, Türkisch, Tschechisch per Not-Aus
 * abschalten (Merker "0", wie `?franzoesisch-lehrgang=0&spanisch-lehrgang=0&…`).
 * ⚠️ VOR dem Zeichnen aufrufen und NACH jedem `localStorage.clear()` - der
 * Sprachbereich liest die Schalter beim Einhängen.
 */
export function nurDeutschUndEnglisch(): void {
  localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "0");
  localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "0");
  nurNeueAus();
}

/** Die neun Sprachen des Gerüsts (bg, el, hu, nl, pt, br, ro, sv, uk) per Not-Aus abschalten (Merker "0"). */
export function nurGeruestAus(): void {
  for (const l of GERUEST_LEHRGAENGE) localStorage.setItem(GERUEST_LEHRGANG_SCHALTER[l].merker, "0");
}

/**
 * Italienisch, Polnisch, Türkisch, Tschechisch UND (seit der Freigabe 06.11.2026, Vorgabe an) die neun des Gerüsts
 * per Not-Aus abschalten (Merker "0").
 */
export function nurNeueAus(): void {
  nurGeruestAus();
  localStorage.setItem(LEHRGANG_PROBE_MERKER_IT, "0");
  localStorage.setItem(LEHRGANG_PROBE_MERKER_PL, "0");
  localStorage.setItem(LEHRGANG_PROBE_MERKER_TR, "0");
  localStorage.setItem(LEHRGANG_PROBE_MERKER_CS, "0");
}

/** Der Vierer-Fall (Deutsch, English, Français, Español): die vier neuen per Not-Aus aus. */
export function nurDeutschEnglischFranzoesischSpanisch(): void {
  nurNeueAus();
}

/** Der ZWEIER-Knopf („EN - English" / „DE - Deutsch") - `null`, wenn keiner da ist. */
export function zweierKnopf(name: "EN - English" | "DE - Deutsch"): HTMLElement | null {
  return screen.queryByRole("button", { name });
}

/**
 * Nimmt den Sprachwähler samt seinem Rahmen (`div.relative` mit Tipp und Liste)
 * aus einer KOPIE des DOM - für Vergleiche „bis auf den Wähler dasselbe DOM".
 * Den Zweier-Knopf nimmt sie ebenso heraus (samt `Tipp`-Rahmen `span.relative`).
 */
export function ohneSprachwahl(kopie: Element): Element {
  for (const knopf of [...kopie.querySelectorAll("button[data-sprachschalter]")]) {
    const rahmen =
      knopf.getAttribute("aria-haspopup") === "listbox"
        ? knopf.closest("div.relative")
        : knopf.closest("span.relative");
    (rahmen ?? knopf).remove();
  }
  return kopie;
}
