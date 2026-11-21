/**
 * ARBEITSBLATT - die Vergrößerung, für ALLE Programme der Lernwerkstatt.
 * ============================================================================
 * ★★★ Dieser Bereich gehört keinem Programm allein (Johannes, 25.08.2026):
 * „Bitte speichere das in einem extra Bereich, auf den andere Programme der
 * Lernplattform auch zugreifen können … im Griff soll genau auf dieses Wissen
 * zugreifen können, und auch andere Apps unserer Lernplattform."
 *
 * ⚠️ DIE REGELN DAHINTER STEHEN IN
 * `Sensorik/BAUART-ARBEITSBLATT-BARRIEREFREI.md`. Wer hier etwas ändert, ändert
 * es dort mit - sonst gibt es zwei Wahrheiten, und die zweite ist irgendwann
 * die falsche.
 *
 * ★★★★ UND SIE WÄCHST MIT (Johannes, 25.08.2026): „Immer wenn etwas an der
 * Bauart von Arbeitsblättern nachgebessert wird, soll es im allgemeinen Wissen
 * für alle Apps gespeichert werden." Drei Schritte: Regel ins Dokument,
 * Bauteil hierher, Eintrag in den Änderungsverlauf §18 - mit der Angabe,
 * welche Programme noch nachziehen müssen. Schritt 3 vergisst man, und er ist
 * der wichtigste.
 *
 */

/**
 * ★★★ BIS 800 % (Johannes, 24.08.2026 abends: „wir brauchen leider Zoom-
 * Möglichkeit bis 800%").
 *
 * Der Bauplan §8 nannte 500 % - das war die Zahl aus den alten Wochenblättern.
 * 800 % ist keine Erfindung dieses Programms: `Tastenflow` und `Punktgenau`
 * gehen seit jeher bis 8-fach (`src/lib/typing/a11y.ts`), und »im Griff«
 * ebenfalls (`src/lib/computer/zoom.ts`, `ZOOM_MAX = 8`). Mathecoach hatte als
 * einziges Programm bei 3-fach aufgehört.
 *
 * ⚠️ DIE STUFEN SIND DIESELBEN wie in den anderen Programmen. Ein Kind, das in
 * „Tastenflow" siebenmal Alt + + drückt, um seine Größe zu treffen, soll hier
 * mit denselben sieben Drücken dieselbe Größe bekommen
 * ([[feedback_platform_parity]]).
 */
export const ZOOM_STUFEN = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8] as const;

/**
 * ★★★ AB WELCHER VERGRÖSSERUNG DIE RECHNUNG ÜBER DAS FELD RUTSCHT
 * (Johannes, 24.08.2026 abends): „Ab extremer Vergrößerung, zB 500 %, könnte
 * auch die Rechnung über die Eingabezeile springen."
 *
 * WARUM: Rechnung und Feld stehen nebeneinander, weil das die Bauart eines
 * Schulhefts ist - „a) -6 +4 =" und rechts davon das Ergebnis. Bei fünffacher
 * Schrift teilen sich beide dieselbe Zeile, und beide werden zu schmal: Die
 * Rechnung bricht mitten im Wort um, und daneben bleibt ein Feld, in das drei
 * Zeichen passen. Übereinander bekommt jedes die volle Breite.
 *
 * ⚠️ FÜR DIE SPRACHAUSGABE ÄNDERT SICH NICHTS. Die Rechnung ist und bleibt die
 * BESCHRIFTUNG des Feldes - sie steht auf der Braillezeile vor dem Inhalt,
 * egal ob sie links davon oder darüber gezeichnet wird. Das hier ist eine reine
 * Frage der Optik, und darum darf sie sich mit der Größe ändern.
 *
 * ⚠️ Die Schwelle liegt bei 5-fach, weil Johannes sie genannt hat - und weil
 * ein Blatt bei 4-fach nebeneinander noch gut aussieht. Sie gehört hierher und
 * nicht in eine Komponente: Wer sie verschiebt, soll EINE Zahl finden.
 */
export const STAPEL_AB = 5;

/** Rechnung über das Feld statt daneben? */
export function sollStapeln(faktor: number): boolean {
  return faktor >= STAPEL_AB;
}

/** „200 Prozent" - für die Ansage, ausgeschrieben statt als Zeichen. */
export function zoomAnsage(faktor: number): string {
  return `Textgröße ${Math.round(faktor * 100)} Prozent`;
}
