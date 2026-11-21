/**
 * „Zuerst die Abzeichen" — die EINE Stelle, die den Fokus beim Öffnen von
 * „Meine Statistik" auf das erste Abzeichen holt.
 *
 * Anlass (Johannes, 22.08.2026 abends, `Sensorik/FOKUSZIELE-TASTENFLOW.md`
 * §0.5, umgesetzt am 28.08.2026): Bis dahin landete der Fokus auf der
 * Überschrift „Meine Statistik" (Nr 2 der Fokusziele). Johannes hat das selbst
 * geändert:
 *
 *   „Beim Öffnen von ‚Meine Statistik' steht der Fokus auf dem ERSTEN
 *   Abzeichen (oben links) - die Abzeichen sind extrem wichtig für die
 *   Kinder."
 *
 * Wer die Statistik öffnet, hört also „Meine Statistik. Deine Abzeichen." und
 * steht danach mit der Braillezeile auf der ersten Medaille - dem Teil, wegen
 * dem die meisten Kinder überhaupt hierher kommen. Die Überschrift bleibt als
 * Anker bestehen (`#tippen-statistik-titel`) und ist der letzte Halt, wenn es
 * kein Abzeichen-Regal gibt.
 *
 * ── Warum eine ANFORDERUNG und kein einfaches setTimeout ────────────────────
 *
 * Ein naives `setTimeout(…, 0)` auf das erste Abzeichen greift ins Leere: Die
 * Statistik lädt Fortschritt und Ereignisse asynchron und zeigt zuerst
 * „Lädt …" ({@link ../../components/typing/PupilSelfStats}). Im nächsten Takt
 * gibt es noch gar keine Medaille, die den Fokus nehmen könnte.
 *
 * Darum dasselbe Hausmuster wie für die Eingabezeile ({@link ./focusField}):
 * Der Öffner stellt eine ANFORDERUNG, die kurz offen bleibt
 * ({@link ABZEICHEN_PENDING_MS}); das Abzeichen-Regal löst sie beim Erscheinen
 * selbst ein ({@link takeFirstBadgeFocusRequest}). Zusätzlich geht im nächsten
 * Takt ein Ereignis raus ({@link FIRST_BADGE_FOCUS_EVENT}) - für den Fall,
 * dass das Regal schon steht.
 *
 * Fokus wird dabei grundsätzlich im NÄCHSTEN TAKT gesetzt (`setTimeout(…, 0)`,
 * nie `requestAnimationFrame` - [[feedback_fokus_pflicht_alle_apps]]).
 *
 * ── Die Rangfolge der Ziele (Entscheidung 28.08.2026) ───────────────────────
 *
 * Ein Kind darf NIE auf `body` landen. Gibt es „das erste Abzeichen" nicht,
 * gilt der Reihe nach:
 *
 *   1. der erste VERDIENTE Abzeichen-Knopf in der Vitrine,
 *   2. sonst der erste Medaillen-Knopf der „Nächsten Ziele" - wer noch keines
 *      hat, soll genau dort stehen, wo das nächste zu holen ist,
 *   3. sonst der Knopf „Alle Abzeichen anzeigen" - er ist immer da, solange
 *      das Regal überhaupt gerendert wird,
 *   4. sonst die Überschrift `#tippen-statistik-titel`. Der Fall tritt ein,
 *      wenn es das Regal gar nicht gibt: solange noch nichts geübt wurde,
 *      zeigt die Statistik nur „Sobald du ein bisschen geübt hast …".
 *
 * Die Ränge 1-3 liegen alle im Abzeichen-Regal und werden dort eingelöst
 * ({@link ../../components/typing/BadgeShelf}); Rang 4 löst die Statistik
 * selbst ein, sobald sie fertig geladen hat und kein Regal gebaut wurde.
 */

/**
 * Das Ereignis, auf das ein bereits stehendes Abzeichen-Regal hört. Es trägt
 * denselben Zweck wie `tippen-focus-field` für die Eingabezeile: eine
 * ausdrückliche Anforderung, die nicht warten muss, bis irgendetwas neu
 * aufgebaut wird.
 */
export const FIRST_BADGE_FOCUS_EVENT = "tippen-focus-first-badge";

/**
 * So lange bleibt eine Fokus-Anforderung offen, damit auch ein Abzeichen-Regal
 * sie noch einlöst, das erst nach dem Laden von Fortschritt und Ereignissen
 * erscheint. Großzügig genug für einen langsamen Server-Abruf, kurz genug,
 * dass sie nicht Minuten später überraschend zuschlägt.
 *
 * Bewusst NICHT `PENDING_MS` genannt: `src/lib/typing/index.ts` reicht beide
 * Module über `export *` weiter, zwei gleiche Namen kollidierten dort.
 */
export const ABZEICHEN_PENDING_MS = 5000;

let pendingUntil = 0;

/**
 * Fokus auf das erste Abzeichen holen - beim Öffnen von „Meine Statistik".
 * Feuert im nächsten Takt (siehe Dateikopf) und hält die Anforderung kurz
 * offen, falls das Regal erst nach dem Laden erscheint.
 */
export function focusFirstBadge(now: number = Date.now()): void {
  pendingUntil = now + ABZEICHEN_PENDING_MS;
  if (typeof window === "undefined") return;
  window.setTimeout(() => {
    window.dispatchEvent(new Event(FIRST_BADGE_FOCUS_EVENT));
  }, 0);
}

/**
 * Steht noch eine Fokus-Anforderung offen? Wird beim Lesen VERBRAUCHT (jede
 * Anforderung führt zu genau einem Fokus-Sprung - eine Doppel-Rückgabe wäre
 * auf der Braillezeile ein Sprung zu viel). Ruft das frisch aufgebaute
 * Abzeichen-Regal beim Erscheinen auf; die Statistik selbst fragt danach, ob
 * noch etwas offen ist, und setzt dann den letzten Halt (die Überschrift).
 */
export function takeFirstBadgeFocusRequest(now: number = Date.now()): boolean {
  const open = pendingUntil > 0 && now < pendingUntil;
  pendingUntil = 0;
  return open;
}

/**
 * Offene Anforderung verwerfen - entweder weil ein Ziel sie eben eingelöst hat
 * oder weil die Statistik wieder geschlossen wurde (sonst spränge ein später
 * aufgebautes Regal noch innerhalb der Verfallszeit an den Fokus).
 */
export function clearFirstBadgeFocusRequest(): void {
  pendingUntil = 0;
}
