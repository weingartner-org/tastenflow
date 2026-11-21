/**
 * DIE ÜBUNGSART von „Tastenflow": Mein Training · Geschichten · Wortspiele.
 *
 * Bis zum 22.08.2026 stand die Auswahl als Knopfreihe links in einer eigenen
 * grauen Leiste über der Übungskarte (`components/typing/A11yBar`). Mit der
 * Charge „SCHLANK" ist diese Leiste ersatzlos entfallen - so wenig wie möglich
 * soll vom Üben ablenken. Die Auswahl liegt jetzt als ERSTE Gruppe im
 * Einstellungs-Bereich hinter dem Zahnrad („Was übst du?", Alt + O) und
 * zusätzlich auf einem eigenen Kürzel, das reihum schaltet.
 *
 * ★ WARUM DIESE DATEI: Zwei Stellen müssen sich über Reihenfolge, Beschriftung
 * und Ansage einig sein - die Gruppe im Zahnrad und das Kürzel auf der Seite.
 * Stünden die drei Wörter zweimal im Quelltext, liefe eine Umbenennung
 * unweigerlich auseinander (die Ansage sagte etwas anderes als der Knopf).
 *
 * ★★★ E7 (19.09.2026, „Meine Klassen"-Umbau): Die Übungsart „Lektionen" ist
 * ENTFALLEN - Kinder fanden den Weg dorthin ohnehin nicht (versteckt im
 * Zahnrad, siehe Entwurf-Dokument §7b Frage 3). Der feste Lehrgang lebt
 * weiter als LEHRKRAFT-VORLAGE in „Eigene Übung" (`vorlagen.ts`); die
 * Lektionsdaten selbst (`curriculum.ts`, `LESSONS`) bleiben unverändert
 * stehen, nur der eigene Übungsbildschirm (`TypingTrainer.tsx`) ist weg.
 * Ein Altstand mit `lastPlace.mode === "lektionen"` (siehe `progress.ts`) ist
 * kein gültiger `TrainerMode` mehr - `TippenTrainerPage.tsx` fängt ihn beim
 * Wiederherstellen ab und setzt „adaptiv"; die Kartenauswahl selbst (JSX-
 * Weiche) landet bei jedem unbekannten Wert ohnehin auf „Mein Training".
 */

import type { Lang } from "./account";
import { ansage } from "./vorlesen";

/**
 * ★★★ „Wortspiele" ist der VIERTE Bereich (Johannes, 01.09.2026).
 *
 * Sein Wortlaut: *„oje, haben wir gesagt sie bekommen keinen eigenen bereich?
 * ich hab doch nur gesagt ich möchte sie AUCH in 'Mein Training' - aber warum
 * nicht ein eigener bereich. Die Frage ist, ob in Lektionen oder ein bereich
 * mit Wortspiele so wie Geschichten (mir vielleicht lieber)."* - und danach
 * das Ja.
 *
 * ⚠️ Ausdrücklich NICHT unter „Lektionen": Die sind ein Lehrgang mit fester
 * Reihenfolge. Die Wortspiele sind ein REGAL, aus dem man sich etwas nimmt -
 * dieselbe Art Ort wie die Geschichten. Daher der eigene Bereich und daher
 * dieser Name.
 *
 * Die Übungsformen selbst liegen ortsfrei in `lib/typing/uebungsformen`;
 * dieser Bereich ist ihr zweiter Konsument - der erste ist das Angebot auf der
 * Abschluss-Karte. Das GELÄUFIGKEITSSCHREIBEN gehört NICHT hierher: Es ist
 * kein Angebot, das man annehmen oder ablehnen kann, sondern eine Zeile je
 * Runde im Generator.
 */
export type TrainerMode = "adaptiv" | "buecherei" | "wortspiele";

/** Die Reihenfolge - sie gilt für die Knöpfe UND für das Reihum-Kürzel. */
export const TRAINER_MODES: readonly TrainerMode[] = [
  "adaptiv",
  "buecherei",
  "wortspiele",
] as const;

/** Beschriftung der Knöpfe (ohne Schmuckzeichen). */
export const TRAINER_MODE_LABELS: Record<TrainerMode, string> = {
  adaptiv: "Mein Training",
  buecherei: "Geschichten",
  wortspiele: "Wortspiele",
};

/**
 * Was gesprochen wird, wenn umgeschaltet wurde.
 *
 * „Geschichten" heißt in der Ansage seit jeher „Geschichten und Wissen" - der
 * Bereich enthält auch Sachtexte, und im Ohr fehlt das Buch-Zeichen, das auf
 * dem Bildschirm mitspricht.
 */
const ANSAGE_SCHLUESSEL = {
  adaptiv: "modusAdaptiv",
  buecherei: "modusBuecherei",
  wortspiele: "modusWortspiele",
} as const;

/**
 * Die Ansage in der Vorlese-Sprache. Die SÄTZE selbst stehen in `vorlesen.ts` -
 * beide Sprachen an einer Stelle, damit keine Fassung zurückbleibt.
 */
export function trainerModeAnsage(mode: TrainerMode, lang?: Lang): string {
  return ansage(ANSAGE_SCHLUESSEL[mode], lang);
}

/** Die deutschen Ansagen als Tabelle (Anzeige-nahe Aufrufer und Tests). */
export const TRAINER_MODE_ANSAGE: Record<TrainerMode, string> = {
  adaptiv: ansage("modusAdaptiv", "de"),
  buecherei: ansage("modusBuecherei", "de"),
  wortspiele: ansage("modusWortspiele", "de"),
};

/** Die nächste Übungsart im Kreis (für das Reihum-Kürzel). */
export function naechsteTrainerMode(aktuell: TrainerMode): TrainerMode {
  const i = TRAINER_MODES.indexOf(aktuell);
  return TRAINER_MODES[(i + 1) % TRAINER_MODES.length];
}
