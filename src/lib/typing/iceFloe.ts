/**
 * Logik des Eisschollen-Spiels — als Tor VOR jeder neuen Taste in „Mein
 * Training" (Wunsch Johannes 08.07.) und als jederzeit startbares freies Spiel
 * (Wunsch 10.07.). Die wackligsten Zeichen liegen als Stationen auf einem
 * Parcours: Eisschollen auf dem Wasser, Eisstufen den Buchstabenberg hinauf und
 * Schneehügel auf der Bauchrutsche hinunter. Wer die richtige Taste der jeweils
 * nächsten Station drückt, kommt weiter; wer zu lange wartet, geht unter bzw.
 * rutscht aus und beginnt am letzten Rastplatz neu. Beliebig viele Versuche,
 * kein Game Over ([[project_zehnfinger_trainer]]).
 *
 * Hier liegen die REINEN, testbaren Bausteine (Etappen/Kurse, Stationsfolge,
 * Standzeit, Tasten-Abgleich); die Szene selbst spielt seit dem Neubau die
 * Polar-Expedition (`expedition/useExpedition.ts` + `ExpeditionStage.tsx`), die
 * auf diesen Bausteinen aufbaut.
 */
import { SHIFT_UNIT, needScore, personalBaseMs, unitKindImWeg, weakestLetters, type Mastery } from "./letters";
import type { LetterStat } from "./progress";
import { lernwegDef, type Lernweg } from "./lernweg";
import type { Lang } from "./account";
import { layoutSprache } from "./layouts";
import { kleinFuer } from "./sprachRegister";
import { istKuerzel, type TastenEreignis } from "./zeichenTaste";

/** Anzahl der Eisschollen einer klassischen Tor-Überquerung. */
export const FLOE_COUNT = 6;

/** Aus wie vielen verschiedenen Problem-Zeichen ein Tor-Kurs besteht. */
export const FLOE_DISTINCT = 3;

/** Das freie Spiel darf breiter wiederholen (mehr verschiedene Zeichen). */
export const FLOE_DISTINCT_FREE = 5;

/**
 * Die Etappen-Arten des Parcours. „cave" ist die ECHO-HÖHLE (Wunsch Johannes
 * 10.07.): Dort steht auf den Stationen kein Zeichen — die Höhle SAGT jede
 * Taste an. Sehende und blinde Kinder spielen sie damit exakt gleich (nur nach
 * Gehör bzw. Braillezeile). Die Höhle kommt bewusst NUR im freien Spiel vor,
 * nie im Tor: Ein gehörloses Kind ohne Braillezeile könnte sie nicht lösen —
 * als freiwilliges Extra ist das in Ordnung, als Freischalt-Bedingung nicht.
 *
 * „storm" ist der SCHNEESTURM (Vorauslesen & Merken, E5), „station" die
 * POLARSTATION (ganze Wörter funken, E6) — beide Verschnaufzonen ohne Zeitdruck,
 * nur im freien Spiel. `courseSpots`/`FloeSpot` bleiben für sie unverändert; der
 * zonen-eigene Reiz (Merken bzw. Wörter) steckt allein in Szene + Spiel-Hook.
 */
export type FloeStageKind = "water" | "climb" | "slide" | "cave" | "storm" | "station";

/** Eine Etappe: Art + die Zeichen ihrer Stationen in Reihenfolge. */
export interface FloeStage {
  kind: FloeStageKind;
  units: string[];
  /**
   * Bonus-Fische (nur Wasser-Etappen, nur freies Spiel): Nach der Landung auf
   * diesen Stationen (1-basierte Etappen-Schritte) springt ein Fisch mit einem
   * eigenen Zeichen aus dem Wasser — rechtzeitig getippt = gefangen (reiner
   * Bonus, kein Fehler möglich).
   */
  fish?: number[];
}

/** Ein ganzer Parcours (Tor-Kurs kurz, freies Spiel lang). */
export interface FloeCourse {
  stages: FloeStage[];
}

/**
 * Ein Halt des Parcours, flach ausgerollt fürs Spiel:
 *  • `shore`   = Start-Ufer (kein Zeichen, kein Zeitdruck),
 *  • `station` = Scholle/Eisstufe/Schneehügel mit Zeichen + Standzeit,
 *  • `rest`    = Rastplatz zwischen zwei Etappen (Strand, Gipfel) — wird nach
 *                der letzten Station einer Etappe automatisch betreten,
 *  • `finish`  = Ziel (Fahne; im Tor-Modus wartet dort die neue Taste).
 * `checkpoint` ist der Halt-Index, zu dem ein Scheitern zurückwirft (immer der
 * letzte Rastplatz bzw. das Ufer — nie der ganze Parcours von vorn).
 */
export interface FloeSpot {
  kind: "shore" | "station" | "rest" | "finish";
  /** Etappe der Station bzw. die GERADE BEENDETE Etappe eines Rastplatzes. */
  stage: FloeStageKind | null;
  /** Zeichen der Station (null bei Ufer/Rast/Ziel). */
  unit: string | null;
  checkpoint: number;
  /** Stations-Nummer innerhalb der Etappe (1-basiert) + Etappen-Länge. */
  step: number;
  of: number;
  /** Nach der Landung hier springt ein Bonus-Fisch (nur freies Spiel). */
  fish?: boolean;
}

/** Rollt einen Kurs zu der Halt-Folge aus, die das Spiel abläuft. */
export function courseSpots(course: FloeCourse): FloeSpot[] {
  const spots: FloeSpot[] = [
    { kind: "shore", stage: null, unit: null, checkpoint: 0, step: 0, of: 0 },
  ];
  let checkpoint = 0;
  course.stages.forEach((stage, si) => {
    stage.units.forEach((unit, i) => {
      spots.push({
        kind: "station",
        stage: stage.kind,
        unit,
        checkpoint,
        step: i + 1,
        of: stage.units.length,
        fish: stage.fish?.includes(i + 1) || undefined,
      });
    });
    const last = si === course.stages.length - 1;
    spots.push({
      kind: last ? "finish" : "rest",
      stage: stage.kind,
      unit: null,
      checkpoint,
      step: 0,
      of: 0,
    });
    // Der Rastplatz ist selbst der nächste Checkpoint (und der eigene).
    if (!last) {
      checkpoint = spots.length - 1;
      spots[checkpoint].checkpoint = checkpoint;
    }
  });
  return spots;
}

/** Alle Stationen (Zeichen-Halte) eines Kurses, in Reihenfolge. */
export function courseUnits(course: FloeCourse): string[] {
  return course.stages.flatMap((s) => s.units);
}

/**
 * Standzeit pro Station (ms), bevor die Scholle sinkt / der Pinguin ausrutscht.
 * Fair nach Anforderung:
 *  • `ignoreSpeed` (Lehrkraft-Stufe „nur Genauigkeit" bzw. Leistungsstufe 1):
 *    KEIN Zeitdruck — nichts sinkt je (WCAG: Zeitlimits abschaltbar).
 *  • „gemächlich": großzügige 14 Sekunden.
 *  • sonst: 9 Sekunden — genug zum Suchen, aber spürbar „das Eis wartet nicht".
 * Solange die Ansage eines Zeichens noch spricht, hält der Countdown ohnehin an
 * (die Komponente pausiert bei isSpeaking) — niemand verliert Zeit durchs Zuhören.
 */
export function floeStandMs(mastery: Pick<Mastery, "ignoreSpeed">, gentle: boolean): number | null {
  if (mastery.ignoreSpeed) return null;
  return gentle ? 14_000 : 9_000;
}

/**
 * Die (bis zu `distinct`) schwächsten eingeführten Zeichen — der Stoff, aus dem
 * die Stationen gebaut werden. Gibt es (noch) keine wackligen Zeichen, kommen
 * die zuletzt eingeführten dran (Wiederholung schadet nie).
 */
function weakUnits(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  distinct: number,
  // ★ E6a (24.09.2026, Bauplan §6.3): der Lernweg des Kindes, jetzt an jeder
  // ECHTEN Aufrufstelle gereicht (FloeFreePlay/ExpeditionJourney,
  // AdaptiveTrainer/SerienTrainer über `buildTorCourse`). Die Vorgabe „de"
  // bleibt NUR dort stehen, wo diese interne Funktion ohne einen Aufrufer
  // getestet wird - kein Kind erreicht sie je ohne Weg.
  lernweg: Lernweg = "de",
): string[] {
  const pool = [...introduced];
  if (pool.length === 0) return [];
  const weak = weakestLetters(pool, letters, lernweg, distinct, mastery);
  return weak.length > 0 ? weak : pool.slice(-distinct);
}

/** Zyklische Zeichen-Folge ab einem Start-Versatz (rotiert über Etappen weiter). */
function cycle(units: string[], count: number, offset = 0): string[] {
  return Array.from({ length: count }, (_, i) => units[(offset + i) % units.length]);
}

/**
 * Die Schollen-Folge einer einzelnen Überquerung (klassisches Tor): die
 * schwächsten Zeichen, zyklisch auf `count` Schollen verteilt — so wird jedes
 * Problem-Zeichen mehrfach wiederholt.
 */
export function buildFloeSequence(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  count = FLOE_COUNT,
  lernweg: Lernweg = "de",
): string[] {
  return spielFolge(introduced, letters, mastery, count, lernweg);
}

/** Gewicht einer schwachen bzw. neuen Taste gegenüber einer sitzenden (die hat 1). */
const SCHWACH_GEWICHT = 2;

/**
 * Die Zeichen-Folge der SPIELE (Pinguin-Expedition, Tor und freies Spiel) - Entscheidung
 * Johannes 29.10.2026 (Wunsch einer Lehrerin: *„könnten bei den Spielen auch bei niedrigem
 * Niveau alle bereits erlernten Buchstaben vorkommen (f j d)?"*): ALLE gelernten
 * Buchstabentasten kommen vor, die schwachen (und die neu freigeschaltete) öfter.
 *
 * Vorher: nur die neueste Taste plus Tasten mit Übungsbedarf, höchstens {@link FLOE_DISTINCT}
 * - bei einem Kind, das nur „k" wacklig hat, hiess die Folge „k k k k k k".
 *
 *  • Länge bleibt `count` (die Spiele sind aufeinander abgestimmt, siehe `course.ts`).
 *  • Jede gelernte Buchstabentaste steht mindestens einmal drin. Sind es mehr als `count`,
 *    kommen zuerst die schwachen/neuen, dann die Grundreihen-Tasten (der tastbare Fingeranker,
 *    `homeKeys` des Weges), dann die übrigen nach Übungsbedarf - jede nur einmal.
 *  • Die übrigen Plätze verteilen sich im Verhältnis 2 : 1 (schwach/neu : sitzend) - schwache
 *    Tasten bekommen mehr, aber nie alle.
 *  • Nicht-Buchstaben (Ziffern, Satz-/Sonderzeichen, ⇧) kommen nur vor, wenn sie schwach sind -
 *    wie bisher.
 *  • Deterministisch (gleicher Stand ⇒ gleiche Folge) und ohne zwei gleiche Zeichen
 *    hintereinander, wo es sich vermeiden lässt.
 * Betrifft nur die Spiele: {@link weakestLetters} selbst (Übungsauswahl, Training) ist unberührt.
 */
function spielFolge(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  count: number,
  lernweg: Lernweg,
): string[] {
  const pool = [...introduced];
  if (pool.length === 0 || count <= 0) return [];
  const schwach = weakestLetters(pool, letters, lernweg, FLOE_DISTINCT, mastery);
  const base = personalBaseMs(pool, letters, lernweg, mastery);
  const bedarf = (u: string): number => needScore(letters?.[u], mastery, lernweg, u, base);
  const heim = lernwegDef(lernweg).homeKeys;
  const buchstaben = pool.filter((u) => !schwach.includes(u) && unitKindImWeg(u, lernweg) === "buchstabe");
  // Stabil: gleicher Bedarf ⇒ zuletzt eingeführte zuerst (Wiederholung des Neuen schadet nie).
  const nachBedarf = (a: string, b: string): number => bedarf(b) - bedarf(a) || pool.indexOf(b) - pool.indexOf(a);
  const reihenfolge = [
    ...schwach,
    ...buchstaben.filter((u) => heim.has(u)).sort(nachBedarf),
    ...buchstaben.filter((u) => !heim.has(u)).sort(nachBedarf),
  ];
  // Nichts davon (z. B. nur Ziffern gelernt, alle sitzen): wie früher die zuletzt eingeführten.
  const verschieden = (reihenfolge.length > 0 ? reihenfolge : pool.slice(-FLOE_DISTINCT)).slice(0, count);

  // Plätze: jede Taste einmal, der Rest nach Gewicht (D'Hondt: Gewicht / (bisherige Plätze + 1)).
  const gewicht = (u: string): number => (schwach.includes(u) ? SCHWACH_GEWICHT : 1);
  const plaetze = new Map<string, number>(verschieden.map((u) => [u, 1]));
  for (let rest = count - verschieden.length; rest > 0; rest--) {
    let beste = verschieden[0];
    for (const u of verschieden) {
      const q = gewicht(u) / (plaetze.get(u)! + 1);
      const qb = gewicht(beste) / (plaetze.get(beste)! + 1);
      // Gleichstand: wer weniger Plätze hat (gleichmässig), dann wer früher in der Reihenfolge steht.
      if (q > qb || (q === qb && plaetze.get(u)! < plaetze.get(beste)!)) beste = u;
    }
    plaetze.set(beste, plaetze.get(beste)! + 1);
  }

  // Anordnung: immer die Taste mit den meisten verbleibenden Plätzen, die nicht eben dran war.
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const vorher = out[out.length - 1];
    let wahl: string | null = null;
    for (const u of verschieden) {
      const n = plaetze.get(u)!;
      if (n <= 0 || u === vorher) continue;
      if (wahl === null || n > plaetze.get(wahl)!) wahl = u;
    }
    if (wahl === null) wahl = verschieden.find((u) => plaetze.get(u)! > 0)!; // nur noch die eben gespielte übrig
    out.push(wahl);
    plaetze.set(wahl, plaetze.get(wahl)! - 1);
  }
  return out;
}

/**
 * Tor-Kurs VOR einer neuen Taste — mit eingebauter Abwechslung (Wunsch
 * Johannes 10.07.): Mal ist es die klassische Schollen-Überquerung, mal geht es
 * nach kürzerem Wasser zusätzlich den Buchstabenberg hinauf und auf dem Bauch
 * die Rutsche hinunter. Der Wechsel hängt an der Zahl der schon gelernten
 * Zeichen — so ist er ohne Zufall stabil (gleiches Tor bei jedem Anlauf) und
 * wechselt trotzdem von Freischaltung zu Freischaltung.
 */
export function buildGateCourse(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  lernweg: Lernweg = "de",
): FloeCourse {
  const weak = weakUnits(introduced, letters, mastery, FLOE_DISTINCT, lernweg);
  if (weak.length === 0) return { stages: [] };
  if (introduced.length % 2 === 0) {
    return { stages: [{ kind: "water", units: cycle(weak, FLOE_COUNT) }] };
  }
  return {
    stages: [
      { kind: "water", units: cycle(weak, 4) },
      { kind: "climb", units: cycle(weak, 4, 4) },
      { kind: "slide", units: cycle(weak, 3, 8) },
    ],
  };
}

/**
 * Tages-Zahl für den „Tages-Parcours" (Wunsch Johannes 10.07.): Der freie Kurs
 * würfelt sich einmal pro Kalendertag neu — deterministisch aus dem lokalen
 * Datum, damit er den ganzen Tag stabil bleibt (auch über „Nochmal spielen").
 */
export function dailySeed(now: number = Date.now()): number {
  const d = new Date(now);
  return d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
}

/**
 * Der lange Kurs des FREIEN Spiels (jederzeit startbar, zählt bewusst nicht als
 * Übezeit): volles Abenteuer über mehrere Bildschirm-Breiten — breites Wasser
 * mit Bonus-Fischen, Echo-Höhle, hoher Buchstabenberg, lange Bauchrutsche, am
 * Ziel ein Iglu. Immer aus den Zeichen, die gerade am schwersten fallen.
 * `seed` (Tages-Zahl) variiert Längen und Höhlen-Position — jeden Tag ein
 * bisschen anders, am selben Tag immer gleich.
 */
export function buildFreePlayCourse(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  seed = 0,
  lernweg: Lernweg = "de",
): FloeCourse {
  const weak = weakUnits(introduced, letters, mastery, FLOE_DISTINCT_FREE, lernweg);
  if (weak.length === 0) return { stages: [] };
  const waterLen = 8 + (seed % 3); // 8–10 Schollen
  const caveLen = 3 + ((seed >> 3) % 2); // 3–4 Echos
  const climbLen = 5 + ((seed >> 2) % 3); // 5–7 Stufen
  const slideLen = 3 + ((seed >> 4) % 2); // 3–4 Schneehügel
  const caveFirst = seed % 2 === 1; // Höhle vor dem Berg oder nach der Rutsche
  let off = 0;
  const take = (kind: FloeStageKind, len: number): FloeStage => {
    const stage: FloeStage = { kind, units: cycle(weak, len, off) };
    off += len;
    return stage;
  };
  const water = take("water", waterLen);
  // Bonus-Fische nach Scholle 2, 5 und 8 (soweit die Etappe reicht) — nie nach
  // der letzten Scholle (dort gleitet der Pinguin schon an den Strand).
  water.fish = [2, 5, 8].filter((s) => s < waterLen);
  const stages: FloeStage[] = caveFirst
    ? [water, take("cave", caveLen), take("climb", climbLen), take("slide", slideLen)]
    : [water, take("climb", climbLen), take("slide", slideLen), take("cave", caveLen)];
  return { stages };
}

/**
 * Zeichen eines Bonus-Fischs: aus den Kurs-Zeichen, aber NIE das gerade
 * anstehende Stations-Ziel (sonst wäre unklar, ob der Anschlag Fisch oder
 * Scholle meint). Deterministisch über den Stations-Index; sind alle Zeichen
 * gleich dem Ziel, gibt es keinen Fisch (null).
 */
export function pickFishUnit(
  units: readonly string[],
  exclude: string | null,
  seed: number,
): string | null {
  const distinct = [...new Set(units)];
  if (distinct.length === 0) return null;
  for (let i = 0; i < distinct.length; i++) {
    const u = distinct[(seed + i) % distinct.length];
    if (u !== exclude) return u;
  }
  return null;
}

/**
 * Passt der Tastendruck zum Stations-Zeichen? Buchstaben vergleichen wir
 * kleingeschrieben (eine versehentlich gehaltene Umschalttaste macht den
 * Sprung nicht kaputt); die Umschalt-Einheit „⇧" verlangt die Umschalttaste
 * selbst; Ziffern/Satz-/Sonderzeichen kommen als `key` direkt so an, wie sie
 * auf der Station stehen (samt nötiger Umschalttaste — das ist die Übung).
 */
export function floeKeyMatches(key: string, unit: string, sprache?: Lang): boolean {
  if (!unit) return false;
  if (unit === SHIFT_UNIT) return key === "Shift";
  // ★ E4 (25.09.2026): „Dead" braucht HIER keine eigene Ausnahme - anders als
  // die Umschatteinheit oben ist eine Totaste nie selbst ein `unit`-Wert
  // dieses Kurses (nur ihre ZUSAMMENGESETZTEN Zeichen wie „ê" sind es, und
  // die kommen als fertiges, einzelnes `key` im ZWEITEN `keydown` an - siehe
  // BEFUND-2026-09-25-E1-TOTASTEN-MAC/-WINDOWS.md). `key.length !== 1` liefert
  // für „Dead" darum schon das richtige „kein Treffer". Ob DAS ein Fehlgriff
  // ist oder ein Zwischenzustand (die Stelle erwartet die Totaste), können
  // nur die AUFRUFER entscheiden, die auch das ZIEL kennen - siehe
  // `useExpedition.ts` (`handleKey`, `handleSlideKey`), die genau darum VOR
  // diesem Aufruf schon auf „Dead" prüfen.
  if (key.length !== 1) return false; // Funktions-/Steuertasten zählen nicht
  // ★ G2b-1: klein in der Sprache (ausdrücklich, sonst der eingestellten Tastatur) -
  // türkisch ist „I" die Grossform von „ı", nicht von „i".
  const sp = sprache ?? layoutSprache();
  return kleinFuer(key, sp) === kleinFuer(unit, sp);
}

/** Tasten, die das Spiel komplett ignoriert (weder Treffer noch Fehler). */
export function floeKeyIgnored(e: TastenEreignis): boolean {
  // Alt-/Strg-/Cmd-Kombis gehören den Tastenkürzeln der Seite (Alt+H, Alt+Z …).
  // ★ 09.10.2026: AltGr ist ein ZEICHEN, kein Kürzel (`istKuerzel`). Vorher warf
  // diese Zeile jedes `altKey` hinaus - am Mac „Polish - Pro" sind `ą ć ę ł ń ó ś ź ż`
  // Option + Grundbuchstabe, und Pinguin, Eisscholle und Rutsche überhörten sie still.
  if (istKuerzel(e)) return true;
  // Alles außer echten Zeichen-Tasten überhören (kein Fehlerton für Enter,
  // Tab, Pfeile, F-Tasten …) — nur Shift zählt, denn die Umschalt-Einheit „⇧"
  // kann selbst ein Stations-Ziel sein.
  return e.key !== "Shift" && e.key.length !== 1;
}
