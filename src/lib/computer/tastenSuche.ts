/**
 * Die Suchrunde „Taste finden" als reine Logik - ein Tastendruck, ein Schritt.
 *
 * Herausgelöst am 13.09.2026 aus `components/computer/TastenDojo.tsx` (Phase
 * „suchen"), weil sie seither ZWEI Stellen benutzen:
 *  · der Tasten-Dojo von »Im Griff« (Lehrpfad-Element, Motor 5),
 *  · das Fenster „Tasten erkunden" von Tastenflow und »Im Griff« im Modus
 *    „Tasten finden" (`components/typing/TastenErkunden.tsx`, Alt + 4).
 * Johannes, 13.09.2026: „kannst du in dieses fenster etwas einbauen dass du
 * schon gebaut hast". Zwei Kopien derselben Runde liefen sonst auseinander.
 *
 * ★★ Der didaktische Kern bleibt, wie Johannes ihn am 06.08.2026 beschrieben
 * hat: „wenn man die richtige taste gefunden hat sagt die stimme gefunden,
 * drücke noch einmal die zB Umschalttaste." Erst der ZWEITE Treffer zählt - seit 18.10.2026
 * (Testerin) erst nach einer anderen Taste dazwischen.
 * Eine falsche Taste wird benannt, nie getadelt.
 *
 * Ohne React, ohne DOM, ohne Ton: Was ein Kind hört, lässt sich so prüfen, und
 * jede Stelle entscheidet selbst, welchen Klang und welche Anzeige sie dazu gibt.
 * Die Sätze sind die, die der Dojo bis dahin selbst zusammensetzte - seit dem
 * 13.09.2026 mit dem richtigen Artikel (`istMaennlicherTastenname`).
 */
import {
  ANSAGE_UNBEKANNT,
  ansageBestaetigt,
  ansageGefunden,
  ansageSuchauftrag,
  tastenNennungKurz,
} from "./tastenNamen";
import type { TastenName } from "./tastenNamen";

/** Was nach einem Tastendruck in der Suchrunde geschieht. */
export type SuchSchritt =
  /** Eine andere oder eine unbekannte Taste - die Aufgabe bleibt. */
  | { art: "daneben"; ansage: string }
  /** Erster Treffer: noch einmal drücken lassen. */
  | { art: "gefunden"; ansage: string }
  /** Zweiter Treffer, und es kommt noch eine Taste (`naechste` ist ihr Platz). */
  | { art: "weiter"; ansage: string; naechste: number }
  /** Zweiter Treffer auf der letzten Taste. */
  | { art: "fertig"; ansage: string };

/**
 * Ein Schritt der Suchrunde.
 *
 * @param taste      die gedrückte Taste (`tasteFuerEreignis`), `null` = keine aus dem Wörterbuch
 * @param suchbar    die Tasten der Runde in ihrer Reihenfolge (nur `suchbar: true`)
 * @param index      welche davon gerade gesucht wird
 * @param bestaetigt ob sie schon einmal getroffen wurde
 * @param dazwischen ob nach dem ersten Treffer eine andere Taste kam - erst dann zählt der zweite
 *                   (D1, Testerin 18.10.2026: sonst lässt man den Finger einfach drauf)
 * @returns `null`, wenn `index` hinter der Liste liegt (nichts zu suchen)
 */
export function suchSchritt(
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  bestaetigt: boolean,
  dazwischen = false,
): SuchSchritt | null {
  const gesucht = suchbar[index];
  if (!gesucht) return null;

  if (!taste || taste.id !== gesucht.id) {
    // ★ 23.09.2026, Johannes: „du schreibst bei den anweisungen zu viel Text,
    // halte dich kürzer" - nur noch die Kurzform („Das ist Enter. Finde
    // Tab."), nicht mehr Artikel und Langname. Eine unbekannte Taste bekommt
    // den ersten Satz aus `ANSAGE_UNBEKANNT`, dazu wie im Fund-Fall den
    // Auftrag - nur ohne die Lage, die kannte das Kind schon.
    return {
      art: "daneben",
      ansage: taste
        ? `Das ist ${tastenNennungKurz(taste, "nominativ")}. Finde ${tastenNennungKurz(gesucht, "akkusativ")}. ${gesucht.lage}`
        : `${ANSAGE_UNBEKANNT} Finde ${tastenNennungKurz(gesucht, "akkusativ")}.`,
    };
  }

  if (!bestaetigt || !dazwischen) return { art: "gefunden", ansage: ansageGefunden(gesucht) };

  const naechste = index + 1;
  if (naechste >= suchbar.length) {
    return {
      art: "fertig",
      ansage: `${ansageBestaetigt(gesucht)} Alle ${suchbar.length} Tasten gefunden. Stark!`,
    };
  }
  return {
    art: "weiter",
    naechste,
    ansage: `${ansageBestaetigt(gesucht)} ${ansageSuchauftrag(suchbar[naechste]!)}`,
  };
}
