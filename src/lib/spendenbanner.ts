/**
 * Spendenbanner - die Schwellen-/Sperr-Logik, app-übergreifend.
 * ===========================================================================
 * Johannes, 18.09.2026: Ein Popup mit Zahlungsmöglichkeit soll Lehrkräften
 * (und Selbstlernenden ohne Klasse) erscheinen, sobald die durchschnittliche
 * ECHTE Übezeit ihrer Klasse (bzw. die eigene) ein Vielfaches von 5 Stunden
 * erreicht - danach wieder von vorne, aber mit der jeweils RICHTIGEN
 * Stundenzahl. Zusätzlich, 18.09.2026: **nie öfter als alle zwei Monate**,
 * unabhängig davon, wie viele Meilensteine dazwischen überschritten wurden.
 *
 * ★★★ PRO KONTO, NICHT PRO KLASSE (Johannes, 18.09.2026). Eine Lehrkraft mit
 * mehreren Klassen soll den Banner trotzdem nur einmal alle zwei Monate sehen
 * - nicht einmal je Klasse. Die Sperre hängt darum an der Konto-Kennung, der
 * Aufrufer reicht bei mehreren Klassen den jeweils HÖCHSTEN erreichten
 * Meilenstein herein.
 *
 * ★★★★★ PRO KONTO ÜBER ALLE APPS HINWEG (Nachbesserung 19.09.2026). Johannes:
 * *„prüfe ob die Spendenaufrufe wirklich nur maximal alle zwei Monate
 * kommen, wenn ein Lehrer 3 Klassen hat … darf er nicht 3 Popups
 * bekommen"*. Bis hierher hing der Speicher-Schlüssel zusätzlich am
 * PROGRAMM (`spendenbanner.${app}.${kontoId}`) - dieselbe Lehrkraft konnte
 * darum in Tastenflow UND in Punktgenau je einen eigenen Banner sehen, weil
 * beide unter verschiedenen Schlüsseln standen. Der Schlüssel trägt jetzt NUR
 * noch die Konto-Kennung - `app` bleibt Parameter der aufrufenden Stellen
 * (für die Texte), fließt aber nicht mehr in den Speicher-Schlüssel ein.
 *
 * ★★★★★ SERVER + LOCALSTORAGE, NICHT MEHR NUR DAS GERÄT (19.09.2026). Ein
 * `localStorage`-Schlüssel gilt nur auf EINEM Gerät - dieselbe Lehrkraft sah
 * den Banner am Schulcomputer UND am eigenen Laptop erneut. Die eigentliche
 * Ablage liegt seither am KONTO selbst (`tt_teachers`/`tt_pupils`, Felder
 * `spendenAufrufAm`/`spendenAufrufMeilenstein`, siehe `pbBackend.ts` in
 * `lib/typing`/`lib/braille`) - `localStorage` bleibt nur der Rückfallweg,
 * wenn das Schreiben zum Server misslingt (offline). Die Sperre wird darum
 * gegen den NEUEREN der beiden Zustände geprüft ({@link spendenBannerZustandNeuestes}).
 *
 * ★ Vier Programme, EIN Mechanismus. Jedes Programm bringt seine eigenen
 * Texte (`spendenbannerTexte.ts`) und seine eigene Art, die durchschnittliche
 * Übezeit zu berechnen - diese Datei kennt nur Stunden-Zahlen, keine
 * Ereignisse, keine Kinder, kein Backend.
 *
 * ★★★★★ WER GESPENDET HAT, BEKOMMT IHN NIE WIEDER (19.09.2026). Johannes:
 * *„wir machen nur Version 2"* - nur eine BESTÄTIGTE Spende zählt (Rückkehr
 * von Stripe auf die Dankesseite, `lib/spendeBestaetigt.ts`), ein blosser
 * Druck auf einen Betrag ändert hier nichts. Entschieden wird das an GENAU
 * EINER Stelle: {@link spendenBannerFaellig} fragt zuerst
 * {@link spendenBannerGespendet} - das Konto (`gespendetAm` an
 * `tt_teachers`/`tt_pupils`, hier als `gespendetMs` im Zustand) ODER der
 * Merker am Gerät. Jeder Banner in jedem Programm, auch in den Reitern von
 * „Meine Klassen", läuft durch diese Prüfung (`SpendenBanner.tsx`).
 *
 * ★★★★★ EINZIGE AUSNAHME (21.09.2026): die Bitte NACH EINEM JAHR - siehe
 * {@link spendenBannerErneuerungFaellig}.
 */
import { geraetHatGespendet } from "./spendeBestaetigt";

/** Alle 5 Stunden ein neuer Meilenstein. */
export const SPENDENBANNER_SCHRITT_H = 5;

/** So viele verschiedene Texte gibt es je Zielgruppe - danach von vorne. */
export const SPENDENBANNER_ANZAHL_TEXTE = 5;

/** Nie öfter als das - unabhängig vom Meilenstein. */
const SPENDENBANNER_MINDESTABSTAND_MONATE = 2;

export interface SpendenBannerZustand {
  /** Der zuletzt GEZEIGTE Meilenstein (Vielfaches von 5), nicht der erreichte. */
  meilensteinH: number;
  /** Wann zuletzt gezeigt (`Date.now()`-Zeitstempel). */
  zuletztGezeigtMs: number;
  /**
   * ★★★★★ Wann eine Spende BESTÄTIGT wurde (Konto-Feld `gespendetAm`, ms) -
   * fehlend/0 = nie. Ist es gesetzt, kommt der Banner nie wieder
   * ({@link spendenBannerGespendet}). Nur der Server-Zustand trägt es; der
   * `localStorage`-Zustand je Konto nicht - für das Gerät gibt es einen
   * eigenen Merker (`lib/spendeBestaetigt.ts`).
   */
  gespendetMs?: number;
}

function spendenbannerSchluessel(kontoId: string): string {
  return `spendenbanner.${kontoId}`;
}

/** Zustand lesen - `null` bei fehlendem/kaputtem Speicher (privates Fenster). */
export function spendenBannerZustandLesen(kontoId: string): SpendenBannerZustand | null {
  try {
    const roh = localStorage.getItem(spendenbannerSchluessel(kontoId));
    if (!roh) return null;
    const wert = JSON.parse(roh) as Partial<SpendenBannerZustand>;
    if (
      typeof wert.meilensteinH !== "number" ||
      typeof wert.zuletztGezeigtMs !== "number"
    ) {
      return null;
    }
    return { meilensteinH: wert.meilensteinH, zuletztGezeigtMs: wert.zuletztGezeigtMs };
  } catch {
    return null;
  }
}

/** Zustand nach dem Zeigen (oder Schließen) merken - EIN Eintrag je Konto, appübergreifend. */
export function spendenBannerMerken(
  kontoId: string,
  meilensteinH: number,
  jetztMs = Date.now(),
): void {
  try {
    localStorage.setItem(
      spendenbannerSchluessel(kontoId),
      JSON.stringify({ meilensteinH, zuletztGezeigtMs: jetztMs } satisfies SpendenBannerZustand),
    );
  } catch {
    // Kein Speicher (privates Fenster o. ä.) - im schlimmsten Fall erscheint
    // der Banner beim nächsten Mal erneut, nie öfter als das hier gilt.
  }
}

/**
 * Von zwei Zuständen (typischerweise Server und `localStorage`) gilt der
 * NEUERE als Wahrheit - nicht der mit dem höheren Meilenstein und nicht
 * grundsätzlich der Server. Ein Gerät ohne Netz merkt sich lokal trotzdem
 * korrekt „gerade gezeigt"; ist der Server danach wieder erreichbar, gilt
 * seine eigene (evtl. ältere) Ablage erst wieder, sobald sie tatsächlich
 * neuer geschrieben wurde. `null` verliert immer gegen einen echten Zustand.
 */
export function spendenBannerZustandNeuestes(
  a: SpendenBannerZustand | null,
  b: SpendenBannerZustand | null,
): SpendenBannerZustand | null {
  if (!a) return b;
  if (!b) return a;
  const neuer = b.zuletztGezeigtMs > a.zuletztGezeigtMs ? b : a;
  // ★ Eine bestätigte Spende geht beim Vergleich NIE verloren - auch wenn der
  // andere Zustand (das Gerät) den jüngeren Zeitstempel hat.
  const gespendetMs = Math.max(a.gespendetMs ?? 0, b.gespendetMs ?? 0);
  return gespendetMs > (neuer.gespendetMs ?? 0) ? { ...neuer, gespendetMs } : neuer;
}

/**
 * ★★★★★ Hat hier jemand BESTÄTIGT gespendet? Das Konto (`gespendetMs` im
 * Zustand, vom Server) ODER dieses Gerät (Merker aus der Dankesseite). Ein
 * Druck auf einen Betrag allein zählt nicht.
 */
export function spendenBannerGespendet(zustand: SpendenBannerZustand | null): boolean {
  return (zustand?.gespendetMs ?? 0) > 0 || geraetHatGespendet();
}

/** Der größte erreichte 5-Stunden-Meilenstein, oder 0 unter 5 Stunden. */
export function spendenBannerMeilenstein(stundenGesamt: number): number {
  if (!Number.isFinite(stundenGesamt) || stundenGesamt < SPENDENBANNER_SCHRITT_H) return 0;
  return Math.floor(stundenGesamt / SPENDENBANNER_SCHRITT_H) * SPENDENBANNER_SCHRITT_H;
}

/**
 * Welcher der `SPENDENBANNER_ANZAHL_TEXTE` Texte zu einem Meilenstein gehört -
 * 5⇒0, 10⇒1, 15⇒2, 20⇒3, 25⇒4, 30⇒0 (zyklisch, „dann müssen die Stunden
 * stimmen" - der Meilenstein selbst wandert weiter, nur der TEXT wiederholt
 * sich).
 */
export function spendenBannerTextIndex(meilensteinH: number): number {
  const schritt = Math.round(meilensteinH / SPENDENBANNER_SCHRITT_H) - 1;
  return ((schritt % SPENDENBANNER_ANZAHL_TEXTE) + SPENDENBANNER_ANZAHL_TEXTE) % SPENDENBANNER_ANZAHL_TEXTE;
}

/**
 * ★★★★★ DIE BITTE NACH EINEM JAHR (Johannes, 21.09.2026).
 * ---------------------------------------------------------------------------
 * *„Wenn jemand gespendet hat, dann soll er nach einem Jahr wieder ein Popup
 * bekommen, wenn er oder eine seiner Klassen im letzten halben Jahr im Schnitt
 * 5 Stunden geübt haben."* Das ist die EINZIGE Ausnahme von „wer gespendet hat,
 * bekommt ihn nie wieder": Ein Jahr nach der bestätigten Spende (Konto-Feld
 * `gespendetAm`) darf der Banner - mit eigenem Text - einmal je Jahreszyklus
 * wiederkommen, aber nur, wenn im letzten halben Jahr wirklich geübt wurde.
 *
 * Bedingungen (ALLE):
 *  1. Das KONTO hat bestätigt gespendet (`gespendetMs`). Der Merker am Gerät
 *     zählt hier NICHT: Er gilt für jedes Konto auf dem Gerät, und wer am
 *     Schulrechner eine Spende bestätigt hat, soll nicht für alle anderen die
 *     Bitte auslösen.
 *  2. Mindestens 12 Monate seit dieser Spende.
 *  3. Im Schnitt mindestens 5 Stunden ECHTE Übezeit in den letzten 6 Monaten
 *     (Klassen-Durchschnitt bei einer Lehrkraft, die eigene bei Selbstlernenden -
 *     dieselbe Rechnung wie beim ersten Banner, nur auf das Halbjahr begrenzt).
 *  4. In diesem Jahreszyklus (ab dem Jahrestag der Spende) noch nicht gezeigt:
 *     Wurde er gezeigt oder weggeklickt, kommt er erst zum nächsten Jahrestag
 *     wieder - oder nach einer neuen Spende, die den Zyklus neu beginnt.
 */
export const SPENDENBANNER_ERNEUERUNG_MONATE = 12;
export const SPENDENBANNER_HALBJAHR_MONATE = 6;
export const SPENDENBANNER_ERNEUERUNG_STUNDEN = 5;

function plusMonate(ms: number, monate: number): number {
  const d = new Date(ms);
  d.setMonth(d.getMonth() + monate);
  return d.getTime();
}

/** Beginn des „letzten halben Jahres" - nur Ereignisse ab hier zählen für die Bitte nach einem Jahr. */
export function spendenBannerHalbjahrVonMs(jetztMs = Date.now()): number {
  return plusMonate(jetztMs, -SPENDENBANNER_HALBJAHR_MONATE);
}

/** Aus einer Ereignisliste die des letzten halben Jahres (jedes Ereignis trägt `ts`). */
export function spendenBannerImHalbjahr<T extends { ts: number }>(
  ereignisse: readonly T[],
  jetztMs = Date.now(),
): T[] {
  const von = spendenBannerHalbjahrVonMs(jetztMs);
  return ereignisse.filter((e) => e.ts >= von);
}

/**
 * Beginn des laufenden Jahreszyklus: der jüngste Jahrestag der Spende, der
 * schon erreicht ist. `null`, solange das erste Jahr noch läuft.
 */
export function spendenBannerZyklusStartMs(gespendetMs: number, jetztMs = Date.now()): number | null {
  let start: number | null = null;
  for (let k = 1; k <= 200; k++) {
    const t = plusMonate(gespendetMs, SPENDENBANNER_ERNEUERUNG_MONATE * k);
    if (t > jetztMs) break;
    start = t;
  }
  return start;
}

/**
 * Darf die Bitte nach einem Jahr jetzt erscheinen? `halbjahrStunden` = im
 * Schnitt geübte Stunden der letzten sechs Monate, `null` = noch nicht geladen.
 */
export function spendenBannerErneuerungFaellig(
  zustand: SpendenBannerZustand | null,
  halbjahrStunden: number | null | undefined,
  jetztMs = Date.now(),
): boolean {
  const gespendetMs = zustand?.gespendetMs ?? 0;
  if (!(gespendetMs > 0)) return false;
  if (halbjahrStunden == null || !Number.isFinite(halbjahrStunden)) return false;
  if (halbjahrStunden < SPENDENBANNER_ERNEUERUNG_STUNDEN) return false;
  const start = spendenBannerZyklusStartMs(gespendetMs, jetztMs);
  if (start === null) return false;
  // In diesem Jahreszyklus schon gezeigt (oder weggeklickt)?
  return (zustand?.zuletztGezeigtMs ?? 0) < start;
}

function fruehestensWieder(zuletztGezeigtMs: number): number {
  const d = new Date(zuletztGezeigtMs);
  d.setMonth(d.getMonth() + SPENDENBANNER_MINDESTABSTAND_MONATE);
  return d.getTime();
}

/**
 * Darf der Banner jetzt erscheinen? Zuerst: Wer bestätigt gespendet hat,
 * bekommt ihn NIE wieder - egal wie viele Stunden, egal wie lange her
 * ({@link spendenBannerGespendet}). Sonst zwei Schranken, BEIDE müssen
 * erlauben: ein NEUER Meilenstein (streng größer als der zuletzt gezeigte) UND
 * mindestens zwei Monate seit dem letzten Mal. Ohne bisherigen Zustand greift
 * nur die erste Schranke - der ALLERERSTE Banner darf sofort ab 5 Stunden
 * kommen, nicht erst nach zwei Monaten Wartezeit auf ein Ereignis, das noch
 * nie stattfand.
 */
export function spendenBannerFaellig(
  meilensteinH: number,
  zustand: SpendenBannerZustand | null,
  jetztMs = Date.now(),
): boolean {
  if (spendenBannerGespendet(zustand)) return false;
  if (meilensteinH < SPENDENBANNER_SCHRITT_H) return false;
  if (!zustand) return true;
  if (meilensteinH <= zustand.meilensteinH) return false;
  return jetztMs >= fruehestensWieder(zustand.zuletztGezeigtMs);
}
