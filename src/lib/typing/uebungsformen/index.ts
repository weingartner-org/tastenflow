/**
 * Alle ÜBUNGSFORMEN an einer Stelle - und die Antwort auf die einzige Frage,
 * die die Oberfläche stellt: „Was ist als Nächstes dran?"
 *
 * Herkunft: die Übungsformen aus Testerin Unterricht, am 01.09.2026 mit
 * Johannes durchgesprochen (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md`).
 * Das Geläufigkeitsschreiben steht bewusst NICHT in dieser Liste: Es ist kein
 * Angebot, sondern der Kern des Zehnfingerschreibens und läuft im gewöhnlichen
 * Übungslauf mit (`generator.ts`).
 *
 * Reihum statt zufällig - siehe `reihum.ts`. Wer immer den Hauptknopf drückt,
 * kommt an allem vorbei.
 */
import { alphabetreihen } from "./alphabetreihen";
import { korrekturlesen } from "./korrekturlesen";
import { langersatz } from "./langersatz";
import { spiegelwoerter } from "./spiegelwoerter";
import { wasfehlt } from "./wasfehlt";
import { zahlendiktat } from "./zahlendiktat";
import { zwillingsgriffe } from "./zwillingsgriffe";
import { buchstabensalat } from "./buchstabensalat";
import { fingerdiktat } from "./fingerdiktat";
import { iglu } from "./iglu";
import { handschwerpunkte } from "./handschwerpunkte";
import { lueckentext } from "./lueckentext";
import { pyramide } from "./pyramide";
import { wandernderGross } from "./wandernderGross";
import type { FormKontext, Uebungsform, UebungsformId } from "./typen";

export * from "./typen";
export * from "./reihum";
export * from "./bedienung";
export * from "./namen";

/**
 * Die feste Reihenfolge. Sie entscheidet bei Gleichstand in der Reihum-Zählung -
 * deshalb steht sie hier fest und wird nicht gemischt: Dasselbe Kind bekommt
 * auf zwei Geräten dieselbe Form.
 *
 * Charge A zuerst (die Formen im vorhandenen Motor), danach Charge B.
 */
export const UEBUNGSFORMEN: readonly Uebungsform[] = [
  alphabetreihen,
  pyramide,
  wandernderGross,
  fingerdiktat,
  buchstabensalat,
  lueckentext,
  handschwerpunkte,
  // ── Charge C (02.09.2026) ────────────────────────────────────────────
  // Aus den Vorschlaegen ausgewaehlt. Sie stehen HINTEN, damit die
  // Reihum-Zaehlung der Kinder nicht durcheinandergeraet: Die Reihenfolge
  // entscheidet bei Gleichstand, und wer heute bei „lueckentext" steht, soll
  // morgen dort weitermachen und nicht plötzlich woanders.
  spiegelwoerter,
  zwillingsgriffe,
  zahlendiktat,
  wasfehlt,
  langersatz,
  korrekturlesen,
  // 23.10.2026: Iglu-Raten (Testerin Galgenmännchen) - HINTEN angehängt, siehe oben.
  iglu,
];

export function formFuer(id: UebungsformId): Uebungsform | undefined {
  return UEBUNGSFORMEN.find((f) => f.id === id);
}

/**
 * Welche Formen taugen mit diesem Tastenstand? Eine Form, die nicht taugt, wird
 * nicht angeboten und rutscht in der Reihum-Zählung auch nicht weiter - sie
 * kommt dran, sobald sie taugt.
 *
 * ⚠️ `taugt` rechnet an echten Wortlisten. Der Aufrufer ruft das einmal je
 * Runde, nicht bei jedem Tastendruck.
 */
export function verfuegbareFormen(ctx: FormKontext): UebungsformId[] {
  return UEBUNGSFORMEN.filter((f) => f.taugt(ctx)).map((f) => f.id);
}
