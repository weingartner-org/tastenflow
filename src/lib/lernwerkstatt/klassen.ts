/**
 * Fassade für den Lehrkraft-Bereich „Meine Klassen" (MK-E0).
 *
 * Warum eine Fassade? Konten, Klassen und Kinder liegen für ALLE vier
 * Lernprogramme in denselben Collections (`tt_teachers`/`tt_classes`/
 * `tt_pupils`), aber zwei Clients sprechen mit ihnen:
 *  • `typingBackend()`  — der reichere Weg: Co-Lehrkräfte, Passwort-Zurücksetzen,
 *    Wochenziele, `toolProfile`/`skillLevel`, „Programme dieser Klasse".
 *  • `brailleBackend()` — kennt zusätzlich die Punktgenau-Lern-Einstellungen
 *    (`tt_classes.settings`).
 * Beide teilen sich den authStore-Schlüssel `tt_pb_auth` → EINE Anmeldung gilt
 * überall. Diese Datei bündelt, was der neue Bereich braucht, und lässt beide
 * Backends unangetastet (die Kinder-Apps hängen daran).
 *
 * Sicherheit: Wer welche Klasse sehen/ändern darf, entscheiden ausschließlich
 * die Server-Regeln (`ttOwnsClass`/`ttCoTeacher` in `pocketbase/setup.mjs`).
 * Hier wird nichts geprüft, was dort nicht ohnehin erzwungen wird
 * ([[feedback_security_first]]).
 */
import { typingBackend } from "@/lib/typing/backend";
import type { TypingClass } from "@/lib/typing/account";

/** Die Lernprogramme mit Klassen-Verwaltung. */
export type LwProgramKey = "tippen" | "braille" | "klangpunkte" | "computer" | "plus" | "lexami";

/**
 * ★★ Welche Programme es in einer Bedienungssprache gibt (Johannes 28.09.2026:
 * „da die anderen Apps nur in Deutsch zur Verfügung stehen, müssen sie da
 * verschwinden"). Nur Tastenflow hat Englisch, Französisch und Spanisch; in
 * jeder anderen Sprache als Deutsch zeigt „Meine Klassen" darum nur Tastenflow -
 * Reiter, Programm-Auswahl der Klasse, Downloads, Einstiegs-Liste.
 * ⚠️ Nur ANZEIGE: Die gespeicherte Programm-Liste einer Klasse bleibt, wie sie
 *    ist - zurück auf Deutsch ist alles wieder da.
 * Bekommt eine weitere App eine Sprache, gehört sie hier dazu - nirgends sonst.
 */
export function programmInSprache(key: string, sprache: string): boolean {
  return sprache === "de" || key === "tippen";
}

export interface LwProgram {
  /** Schlüssel wie im Programm-Katalog (`allPrograms.ts`, Admin-Freigabe). */
  key: LwProgramKey;
  /** Anzeigename — Johannes denkt in Titeln ([[feedback_anzeigenamen]]). */
  label: string;
  /** Pfad der Kinder-App (für „← Zurück zu …"). */
  path: string;
  /** Kurzsatz für die Ankreuz-Liste „Programme dieser Klasse". */
  hint: string;
}

/*
 * ★ Ohne Zeichen-Feld (10.09.2026): Hier stand je Programm ein Sinnbild aus
 * dem Katalog. Das echte Zeichen einer App liefert seither
 * `components/lernwerkstatt/ProgrammZeichen.tsx` - an jeder Stelle dasselbe.
 */
export const LW_PROGRAMS: LwProgram[] = [
  {
    key: "tippen",
    label: "Tastenflow",
    path: "/programme/tastenflow",
    hint: "10-Finger-Schreiben",
  },
];

/** Programm zu einem Schlüssel (auch zu „braille"/„punktgenau"-Schreibweisen). */
export function lwProgram(key: string | null | undefined): LwProgram | null {
  if (!key) return null;
  const k = key === "punktgenau" ? "braille" : key;
  return LW_PROGRAMS.find((p) => p.key === k) ?? null;
}

/**
 * Welche Programme zeigt „Meine Klassen" für diese Klasse?
 *
 * Zwei Filter hintereinander:
 *  1. Die Live-Freigabe des Admins (`released`) — was nicht öffentlich ist,
 *     taucht auch hier nicht auf.
 *  2. Die Auswahl der Lehrkraft (`cls.programs`). **Leer oder fehlend = alle**,
 *     damit Bestandsklassen sich nicht plötzlich anders verhalten.
 *
 * Das ist ein reiner ANZEIGE-Filter. Kein Kind wird dadurch von einem Programm
 * ausgesperrt ([[feedback_programme_nicht_einschraenken]]).
 */
export function programsOfClass(
  cls: TypingClass | null | undefined,
  released: (key: string) => boolean = () => true,
): LwProgram[] {
  const offen = LW_PROGRAMS.filter((p) => released(p.key));
  const gewaehlt = cls?.programs ?? [];
  if (gewaehlt.length === 0) return offen;
  const gesetzt = new Set(gewaehlt);
  const gefiltert = offen.filter((p) => gesetzt.has(p.key));
  // Alles abgewählt (oder nur Programme gewählt, die der Admin geparkt hat) →
  // lieber alles zeigen als einen leeren Bereich.
  return gefiltert.length > 0 ? gefiltert : offen;
}

/**
 * Die meisten Schulen nutzen nur Tastenflow — wer über die Lernwerkstatt
 * einsteigt (kein Programm im Pfad/Anhang) und dessen Klasse noch keine
 * eigene Liste hat, bekommt darum dieses Programm geöffnet (E5, 19.09.2026).
 */
export const STANDARD_EINSTIEGSPROGRAMM: LwProgramKey = "tippen";

/**
 * Welche Programme zeigt „Meine Klassen" TATSÄCHLICH — für DIESE Sitzung,
 * über DIESES Programm eingestiegen (E5, 19.09.2026)?
 *
 * Anders als `programsOfClass` oben (die weiterhin nur die gespeicherte
 * Auswahl ohne Einstiegs-Kontext beschreibt, z. B. für die Ankreuz-Liste
 * „Programme dieser Klasse"): Johannes, 18.09.2026, wörtlich: *„Die meisten
 * Schulen verwenden nur Tastenflow. Wer ein Konto anmeldet und nichts
 * anderes aktiviert, soll den Tastenflow-Schalter gar nicht sehen … wer über
 * Tastenflow einsteigt, sieht nur Tastenflow, wer über Im Griff einsteigt,
 * sieht die Statistik von Im Griff."*
 *
 * Zwei Änderungen gegenüber `programsOfClass`:
 *  1. Eine LEERE gespeicherte Liste bedeutet jetzt „nur das Einstiegsprogramm"
 *     - nicht mehr „alle".
 *  2. Das Einstiegsprogramm steht IMMER in der Liste, auch wenn es dort
 *     (noch) nicht gespeichert ist - eine Lehrkraft, die über Punktgenau
 *     einsteigt, muss Punktgenau sehen, ganz gleich, was die Klasse bisher
 *     gewählt hat.
 */
export function effectiveProgramsOfClass(
  cls: TypingClass | null | undefined,
  einstiegsProgramm: LwProgramKey | null | undefined,
  released: (key: string) => boolean = () => true,
): LwProgram[] {
  const offen = LW_PROGRAMS.filter((p) => released(p.key));
  const gewaehlt = cls?.programs ?? [];
  const basis: string[] =
    gewaehlt.length === 0
      ? einstiegsProgramm
        ? [einstiegsProgramm]
        : []
      : einstiegsProgramm && !gewaehlt.includes(einstiegsProgramm)
        ? [einstiegsProgramm, ...gewaehlt]
        : gewaehlt;
  const gesetzt = new Set(basis);
  const gefiltert = offen.filter((p) => gesetzt.has(p.key));
  // Nichts übrig (das Einstiegsprogramm selbst ist geparkt)? Lieber alles
  // Offene zeigen als einen leeren Bereich - dieselbe Notbremse wie oben.
  return gefiltert.length > 0 ? gefiltert : offen;
}

/**
 * ★ 18.10.2026: Nutzt diese Klasse Tastenflow? Davon hängt ab, ob beim Anlegen
 * eines Kindes und in der Excel-Vorlage nach dem Tastenflow-Startniveau gefragt
 * wird (Johannes: „es ist verwirrend, dass nach Tastenflow gefragt wird,
 * weil jemand vielleicht nur Im Griff verwenden möchte").
 *
 * Dieselbe Regel wie die Reiter von „Meine Klassen": Tastenflow zählt, wenn es
 * in der EFFEKTIVEN Programm-Liste steht (`effectiveProgramsOfClass`) - also
 * auch als Einstiegsprogramm. Ausserhalb von Deutsch gibt es nur Tastenflow
 * (`programmInSprache`), dort ist die Antwort immer „ja".
 */
export function klasseMitTastenflow(
  cls: TypingClass | null | undefined,
  einstiegsProgramm: LwProgramKey | null | undefined,
  sprache: string = "de",
): boolean {
  if (!cls) return true;
  return effectiveProgramsOfClass(cls, einstiegsProgramm, (k) =>
    programmInSprache(k, sprache),
  ).some((p) => p.key === "tippen");
}

/** Klassen der angemeldeten Lehrkraft (eigene UND co-betreute). */
export async function listMyClasses(teacherId: string): Promise<TypingClass[]> {
  return typingBackend().listClasses(teacherId);
}

/** „Programme dieser Klasse" speichern (leere Liste = alle anzeigen). */
export async function saveClassPrograms(
  code: string,
  teacherId: string,
  keys: LwProgramKey[],
): Promise<TypingClass | null> {
  return typingBackend().setClassPrograms(code, teacherId, keys);
}
