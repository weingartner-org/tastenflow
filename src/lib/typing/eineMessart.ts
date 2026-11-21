/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ EINE MESSART ÜBERALL (Bauplan F1c, 18.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„ich glaube nicht, dass Kinder bei Tippchallenges langsamer sind
 * als beim Üben ... ich denke, es ist ein Messfehler der Plattform"* - und nach
 * der Erklärung: *„ja, zähle nur richtige Zeichen, und ‚Überlegen' wird
 * bestraft, Zuhören natürlich nicht, mach es überall gleich"*. Dazu: *„Messfehler
 * sind Gift!"*
 *
 *     Tempo (Anschläge je Minute) = richtige Zeichen ÷ (Uhr − Zuhören − Zeilenwechsel)
 *
 * | Modus         | Uhr                                              |
 * |---------------|--------------------------------------------------|
 * | Klassenmatch  | der feste Start bis zum Ende (Server-Uhr)        |
 * | Tippchallenge | die Prüfungsuhr: erster Anschlag bis Abgabe, höchstens die gewährte Zeit |
 * | Üben          | je Zeile: vom ERSTEN bis zum letzten Anschlag - wie vor F1c (siehe unten) |
 *
 * ⚠️⚠️ ÜBEN IST (NOCH) NICHT UMGESTELLT - Entscheidung Johannes offen
 * (NACHTLAUF-2026-09-19 §3). Beim Üben zählt die Zeit VOR dem ersten Anschlag einer
 * Zeile nicht: weder Zuhören noch Lesen noch Überlegen, und das erste Zeichen
 * bekommt keine Zeit. Grund, es über Nacht nicht zu ändern: Wer die neue
 * Zeile auf der Braillezeile oder mit dem eigenen Screenreader liest, erzeugt
 * keine messbare Wartezeit - diese Zeit als Überlegen zu zählen, senkte genau
 * diesen Kindern Sterne, Kalibrierung, Rundenlänge und Stufe. An derselben
 * Leistung gemessen (`tests/typing-eine-messart.test.ts`): Klassenmatch und
 * Tippchallenge 247, Üben 262 Anschläge je Minute.
 *
 * - **Zuhören** (die App spricht, das Kind wartet) wird überall abgezogen -
 *   in Klassenmatch und Tippchallenge AUCH vor dem ersten Anschlag einer Zeile
 *   (die Zeilenansage). Gemessen in `TypingSession` ({@link zeilenLuecke} in
 *   `zeilenzeit.ts`, Schalter `zeilenuhrAbAnzeige`), an EINER Stelle.
 * - **Zeilenwechsel** (die kurze Pause, in der die App die nächste Zeile
 *   hinstellt - 550 ms im Lehrgang, 220 ms in Match und Challenge) ist Zeit der
 *   App, nicht des Kindes. In der Übung liegt sie ohnehin ausserhalb jeder
 *   Zeilenuhr; auf der festen Uhr von Match und Challenge wird sie abgezogen.
 *   Anschläge in dieser Pause gehen nicht verloren (`tasteAnnehmen`) und zählen.
 * - **Überlegen** wird NIRGENDS abgezogen - es ist Zeit am Text. Einzige
 *   Grenze: In der Übung zählt eine einzelne Pause höchstens bis zur
 *   Pausentoleranz des Kindes (Bauplan F1b - sonst zählte eine über Nacht
 *   offene Zeile 29 Std.). Match und Challenge haben eine feste Uhr, dort gilt
 *   jede Sekunde.
 * - **Fehlgriffe** sind keine Anschläge für das Tempo - sie stecken in der
 *   Güte des Leistungswerts (`werte()` in `schreibprobeWertung.ts`, überall
 *   dieselbe Formel).
 *
 * Wächter: `tests/typing-eine-messart.test.ts`.
 */

/** Anschläge je Minute aus richtigen Zeichen und Schreibzeit (ungerundet). */
export function tempoJeMinute(richtigeZeichen: number, schreibzeitMs: number): number {
  if (!(schreibzeitMs > 0) || !(richtigeZeichen > 0)) return 0;
  return (richtigeZeichen / schreibzeitMs) * 60_000;
}

/** Schreibzeit auf einer festen Uhr: Uhr minus Zuhören minus Zeilenwechsel, nie negativ. */
export function schreibzeitNachUhr(e: {
  uhrMs: number;
  zuhoerMs: number;
  zeilenwechselMs?: number;
}): number {
  const abzug = Math.max(0, e.zuhoerMs) + Math.max(0, e.zeilenwechselMs ?? 0);
  return Math.max(0, Math.max(0, e.uhrMs) - abzug);
}

/**
 * Die Prüfungsuhr der Tippchallenge: vom ersten Anschlag bis zur Abgabe,
 * höchstens die gewährte Zeit.
 *
 * Der Deckel ist nötig, weil ein Ergebnis auch Stunden später entstehen kann
 * (Seite nach Ablauf der Zeit neu geöffnet, `SchreibprobeLauf`); dann lief die
 * Prüfung trotzdem nur so lange, wie sie gewährt war.
 */
export function pruefungsUhrMs(beginnMs: number, endeMs: number, zeitMs: number): number {
  if (!(beginnMs > 0)) return 0;
  return Math.max(0, Math.min(endeMs - beginnMs, Math.max(0, zeitMs)));
}
