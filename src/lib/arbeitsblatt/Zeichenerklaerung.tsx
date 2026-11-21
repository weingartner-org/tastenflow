/**
 * Die Zeichenerklärung - kurz, und in der Hilfe.
 * ============================================================================
 *
 * ★★★ GEHÖRT KEINEM PROGRAMM ALLEIN. Die Regel dazu steht in
 * `Sensorik/BAUART-ARBEITSBLATT-BARRIEREFREI.md` §7.1. Wer hier etwas ändert,
 * ändert es dort mit - und trägt es in §18 ein, mit der Angabe, welche
 * Programme noch nachziehen müssen.
 *
 * ---------------------------------------------------------------------------
 *
 * ★★ DER ANLASS (Johannes, 25.08.2026): „Zeichenerklärung total abgespeckt in
 * die Hilfe, mehr nicht."
 *
 * In einem aufbereiteten Schulbuch ist die Zeichenerklärung das ERSTE KAPITEL
 * und zwei Seiten lang: Sie erklärt jedes Sonderzeichen, das im Buch vorkommt.
 * Bei uns braucht sie das nicht - Überschriften, Aufgaben und Kästen sind echte
 * Bauteile und brauchen kein Zeichen davor (§5.2). Übrig bleiben die wenigen
 * Zeichen, die WIRKLICH im Text stehen.
 *
 * ⚠️ WER EIN ZEICHEN BENUTZT, ERKLÄRT ES - sonst übernimmt er die halbe Hälfte
 * einer Vereinbarung. Vor dem 25.08.2026 stand `[]` schon in unserem Code, mit
 * der Begründung, ein Kind kenne es aus jedem aufbereiteten Schulbuch. Das
 * stimmt nur, WEIL es dort im ersten Kapitel erklärt steht. Bei uns gab es
 * dieses Kapitel nicht.
 *
 * ★ EINE STELLE, NICHT EINE JE BLATT. Die Erklärung steht in der Programm-Hilfe
 * (Alt + H), nicht auf jedem Arbeitsblatt. Ein Kind, das sie einmal gelesen
 * hat, soll nicht bei jeder Aufgabe daran vorbeilesen müssen.
 *
 * ⚠️ UND JEDES PROGRAMM ERKLÄRT SEINE EIGENEN ZEICHEN. Ein Punkt `·` steht in
 * Tastenflow zwischen zwei Angaben, in Punktgenau zwischen den Punkttasten -
 * eine gemeinsame Liste müsste beides sagen und wäre für beide falsch.
 */
import type { ReactNode } from "react";

export interface Zeichen {
  /** Das Zeichen, so wie es im Text steht. */
  zeichen: string;
  /** Was es heißt - ein Satz, in der Sprache des Kindes. */
  bedeutung: ReactNode;
}

/**
 * Die Liste in der Hilfe.
 *
 * ★★ EINE LISTE, KEINE TABELLE. Eine Sprachausgabe liest jede Zeile am Stück;
 * für eine Tabelle mit zwei Spalten müsste ein Kind in den Tabellenmodus
 * wechseln - für zwei Wörter je Zeile ist das ein Umweg (§9.1: Was ein Kind
 * überfordert, ist nicht die Tabelle, sondern die GROSSE Tabelle - und die
 * kleine hier ist gar keine).
 *
 * ⚠️ Das Zeichen steht VORNE. Auf der Braillezeile liest man von links nach
 * rechts; wer erst die Bedeutung liest, weiß bis zum Zeilenende nicht, wovon
 * die Rede ist.
 */
export function Zeichenerklaerung({
  zeichen,
  titel = "Diese Zeichen stehen im Text",
}: {
  zeichen: readonly Zeichen[];
  /**
   * ⚠️ `null`, wenn die Überschrift schon darüber steht - ein zweiter Titel
   * wäre für eine Sprachausgabe eine Zeile, die nichts Neues sagt.
   */
  titel?: string | null;
}) {
  return (
    <div data-zeichenerklaerung="">
      {titel ? <p className="font-semibold text-ink">{titel}</p> : null}
      <ul className="m-0 mt-2 list-none space-y-1 p-0">
        {zeichen.map((z) => (
          <li key={z.zeichen}>
            {/* ⚠️ `<strong>` und nicht `<Hervor>`: Das Zeichen ist hier keine
                Hervorhebung, sondern der Gegenstand des Satzes - es steht schon
                vorne, und was es heißt, folgt unmittelbar. Eine Rolle `mrkd`
                davor wäre in jeder Zeile dieselbe Ansage (§5.1, Zeile 1). */}
            <strong>{z.zeichen}</strong>{" "}
            <span className="text-ink-muted">- {z.bedeutung}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
