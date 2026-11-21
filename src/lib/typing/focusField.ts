/**
 * „Zurück ins Schreibfeld" — die EINE Stelle, die den Fokus des Tipptrainers
 * „Tastenflow" in die Eingabezeile holt.
 *
 * Grundregel (Johannes 14.08.2026): **Escape schließt jedes Fenster und der
 * Fokus steht danach IMMER in der Eingabezeile.** Egal, was offen war —
 * Statistik, Tastenkürzel, Hilfe, Einstellungen, Lektionsliste, Passwort,
 * Nachrichten —: eine Taste, und man schreibt weiter. Auch wenn gar nichts
 * offen war, holt Escape den Fokus zurück ins Feld.
 *
 * Zwei Fallen, die diese Datei löst:
 *
 *  1. **Zu früh gefeuert.** Wer das Fenster schließt und im selben Zug
 *     `tippen-focus-field` schickt, feuert, während der Dialog noch im Baum
 *     steht: `TypingSession` lässt den Fokus dann bewusst in Ruhe (der Dialog
 *     hat ihn), und niemand holt ihn nach. Darum geht die Anforderung erst im
 *     nächsten Takt raus — `setTimeout(0)`, NIE `requestAnimationFrame`
 *     ([[feedback_fokus_pflicht_alle_apps]]).
 *
 *  2. **Das Feld ist noch gar nicht da.** Nach der Statistik baut sich der
 *     Trainer neu auf und lädt seinen Spielstand asynchron („Lädt …") — im
 *     nächsten Takt gibt es kein Eingabefeld, das den Ruf hören könnte. Darum
 *     merkt sich das Modul die offene Anforderung kurz ({@link PENDING_MS}):
 *     Das frisch aufgebaute Feld löst sie beim Erscheinen selbst ein
 *     ({@link takePracticeFocusRequest}).
 */

/** Das Ereignis, auf das die Tipp-Sitzung hört (auch Alt + E schickt es). */
export const FOCUS_FIELD_EVENT = "tippen-focus-field";

/**
 * So lange bleibt eine Fokus-Anforderung offen, damit auch ein Eingabefeld sie
 * noch einlöst, das erst nach dem Laden des Spielstands erscheint. Großzügig
 * genug für einen langsamen Server-Abruf, kurz genug, dass sie nicht Minuten
 * später überraschend zuschlägt.
 */
export const PENDING_MS = 5000;

let pendingUntil = 0;

/**
 * Fokus in die Eingabezeile holen — nach dem Schließen JEDES Fensters.
 * Feuert im nächsten Takt (siehe Dateikopf) und hält die Anforderung kurz
 * offen, falls das Feld erst noch aufgebaut wird.
 */
export function focusPracticeField(now: number = Date.now()): void {
  pendingUntil = now + PENDING_MS;
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    window.dispatchEvent(new Event(FOCUS_FIELD_EVENT));
  }, 0);
}

/** So lange steht der Fokus beim Sprung im Spiegelfeld (gemessen: unter 50 ms zeigt NVDA kurz „klk mz ef" auf der Braillezeile). */
export const SPRUNG_MS = 50;

/**
 * ★★★ Alt + E: in die Eingabezeile, auch wenn der Fokus schon dort steht.
 *
 * Gemessen mit JAWS (31.10.2026): Esc in der Zeile schaltet JAWS in den
 * virtuellen Cursor, der Fokus bleibt aber im Feld. Ein `focus()` dorthin ändert
 * dann nichts, auch `blur()` + `focus()` nicht: JAWS sieht keinen Wechsel, und
 * die Tasten kommen weiter nicht an. Erst ein echter Fokuswechsel über ein
 * ANDERES Element schaltet den Formularmodus wieder ein.
 *
 * Das andere Element ist ein unsichtbarer SPIEGEL der Zeile, kein Knopf: Mit
 * einem Knopf stand bei NVDA kurz „sltr ." auf der Braillezeile (Regel: dort
 * steht nur die Übungszeile). Mit dem Spiegel steht dort dieselbe Zeile, der
 * Schreibzeiger an derselben Stelle. Nach Esc holt der Sprung auch NVDA aus dem
 * Lesemodus zurück.
 *
 * ⚠️ Nur für den ausdrücklichen Tastendruck. In `focusPracticeField` (Esc, jedes
 * geschlossene Fenster) hätte der Sprung nichts zu suchen: NVDA spricht die Zeile
 * dabei zweimal.
 */
export function zeileNeuAnsteuern(now: number = Date.now()): void {
  const aktiv = typeof document === "undefined" ? null : document.activeElement;
  if (!(aktiv instanceof HTMLTextAreaElement) || aktiv.dataset.typingField !== "practice" || !aktiv.parentNode) {
    focusPracticeField(now);
    return;
  }
  const stelle = aktiv.selectionStart;
  const spiegel = document.createElement("textarea");
  spiegel.value = aktiv.value;
  spiegel.lang = aktiv.lang;
  spiegel.rows = 1;
  spiegel.wrap = "off";
  spiegel.tabIndex = -1;
  spiegel.readOnly = aktiv.readOnly;
  const name = aktiv.getAttribute("aria-label");
  if (name) spiegel.setAttribute("aria-label", name);
  spiegel.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;overflow:hidden";
  aktiv.parentNode.appendChild(spiegel);
  spiegel.focus();
  spiegel.setSelectionRange(stelle, stelle);
  window.setTimeout(() => {
    aktiv.focus();
    spiegel.remove();
  }, SPRUNG_MS);
}

/**
 * Steht noch eine Fokus-Anforderung offen? Wird beim Lesen VERBRAUCHT (jede
 * Anforderung löst genau ein Feld ein). Ruft das frisch aufgebaute Eingabefeld
 * beim Erscheinen auf.
 */
export function takePracticeFocusRequest(now: number = Date.now()): boolean {
  const open = pendingUntil > 0 && now < pendingUntil;
  pendingUntil = 0;
  return open;
}

/** Offene Anforderung verwerfen (das Feld hat den Fokus bereits geholt). */
export function clearPracticeFocusRequest(): void {
  pendingUntil = 0;
}
