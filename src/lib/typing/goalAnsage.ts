/**
 * Der Wochenziel-Satz für die Ansage von Alt + D.
 *
 * WARUM ein eigenes, winziges Modul: Die Zeitansage sitzt in
 * {@link TypingSession} (dort liegt die Übezeit-Uhr), die Wochenziel-Daten
 * liegen aber in {@link WeeklyGoalRings} — die lädt sie ohnehin und rechnet sie
 * aus. Statt die Daten quer durch die Seite zu reichen (oder ein zweites Mal zu
 * laden), hinterlegt die Anzeige hier ihren fertigen Satz, und die Ansage holt
 * ihn sich ab. Kein Zustand, keine Abhängigkeit in beide Richtungen.
 *
 * Ohne gesetztes Wochenziel steht hier `null` — dann sagt Alt + D wie bisher
 * nur die Übezeit. Siehe [[project_zehnfinger_trainer]].
 */

let satz: string | null = null;

/** Die Wochenziel-Anzeige meldet ihren aktuellen Ansage-Satz (oder `null`). */
export function setzeWochenzielAnsage(text: string | null): void {
  satz = text;
}

/** Der zuletzt gemeldete Wochenziel-Satz — für Alt + D. */
export function wochenzielAnsage(): string | null {
  return satz;
}
