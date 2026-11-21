/**
 * ★★★ DER WEG JE KIND - WAS BEI EINEM WECHSEL MIT DEM FORTSCHRITT GESCHIEHT
 * (W2b, 28.09.2026).
 *
 * Auftrag Johannes (27.09.2026): gemischte Klassen - „2 verschiedene
 * Erstsprachen in einer Klasse". Die Lehrkraft stellt den Lernweg je Kind ein
 * (`TastenflowReiter` → „Einstellungen für …", am Server
 * `tt_pupils_field_guard.pb.js`). Ein Weg ist eine eigene Reihenfolge der
 * Tasten; `introduced`, `lessons`, die Serien, der Textvorrat - alles darin ist
 * in SEINEM Weg gezählt (Bauplan englischer Lehrgang §2.4, die Anzahlen-Falle).
 * Ein Wechsel heisst darum: ein neuer Lernweg mit eigenem Fortschritt.
 *
 * ── DIE SICHERSTE LÖSUNG: NICHTS WIRD GELÖSCHT ──────────────────────────────
 * Der bisherige Stand wird im selben Fortschritt GEPARKT (`wegStaende[alterWeg]`),
 * der neue Weg beginnt frisch - oder, wenn das Kind schon einmal auf ihm war,
 * mit genau dem Stand, den es dort verlassen hat. Wer zurückwechselt, macht
 * dort weiter, wo er war. Kein Feld wird gelöscht, kein Wert zurückgerechnet.
 *
 * ── WAS MITGEHT UND WAS BEIM WEG BLEIBT ─────────────────────────────────────
 * MIT dem Kind (gilt auf jedem Weg, nie gegen das Kind): die Erfahrungspunkte
 * (`xp`, der Spieler-Ring), die Abzeichen (`badges`, `badgeTally`) und der Stand
 * der „Eigenen Übung" der Lehrkraft (`customTextProgress` - eine Übung der
 * KLASSE, keine des Weges). Alles andere gehört dem Weg und wird geparkt.
 * Die Übezeit, das Wochenziel und jede Statistik der Lehrkraft stehen ohnehin
 * nicht hier, sondern in den Ereignissen (`lw_events`) - sie laufen weiter.
 *
 * ── WER DEN WECHSEL AUSFÜHRT ────────────────────────────────────────────────
 * Die Lehrkraft schreibt NUR den Weg am Konto; den Fortschritt darf nur das
 * Kind selbst schreiben (Regel `lw_progress.update`, dieselbe Grenze wie beim
 * Startpunkt). Das Kind führt den Wechsel beim nächsten Öffnen aus
 * (`TippenTrainerPage`, `loadFn`) und speichert sofort. Die Lehrkraft-Seite
 * rechnet mit DERSELBEN Funktion, wie der Stand nach dem Wechsel aussehen wird
 * - sonst zeigte sie bis dahin die Tasten des alten Weges als Anzahl im neuen.
 *
 * ── DER STARTPUNKT ──────────────────────────────────────────────────────────
 * `startUnits` am Konto ist eine Anzahl - in der Zählung des Weges, auf dem er
 * gesetzt wurde. ★★ S1 (28.09.2026, Schlussprüfung Nachtlauf): Die Zahl gilt
 * NUR in diesem Weg. Bis dahin wurde sie auf dem neuen Weg angewandt - auf
 * einem frischen als Beschluss (de „Alle Buchstaben" = 31 gab auf es auch `.`,
 * auf en `. , '`), auf einem zurückgeholten über die Automatik (ein fr-Stand
 * mit 9 Einheiten kam mit 14 zurück).
 *
 *  · Hat das Kind den heutigen Beschluss auf dem BISHERIGEN Weg übernommen
 *    (sein Vermerk trägt denselben Zeitpunkt), gehört er dorthin. Der neue
 *    Stand merkt ihn sich als fremd (`startpunktFremd`); solange er am Konto
 *    steht, gilt auf diesem Weg die EIGENE Zahl des Standes
 *    ({@link startpunktImWeg}): auf einem frischen Weg der Anfang (oder die
 *    Vorgabe einer Klasse DIESES Weges), auf einem zurückgeholten seine
 *    geparkte Zahl - er kommt unverändert wieder.
 *  · Setzt die Lehrkraft danach einen neuen Startpunkt (sie sieht dabei die
 *    Stufen des NEUEN Weges), gilt er normal.
 *  · Hat das Kind den Beschluss noch auf keinem Weg übernommen, ist nicht zu
 *    unterscheiden, ob er vor oder nach dem Umstellen gesetzt wurde. Dann
 *    bleibt es bei der bisherigen Regel - dieselbe Rechnung zeigt die
 *    Lehrkraft-Seite, die Lehrkraft sieht also, was das Kind bekommt: auf einem
 *    FRISCHEN Weg wird er beim Laden als Beschluss angewandt, auf einem
 *    ZURÜCKGEHOLTEN wird der Vermerk auf ihn gesetzt (er stuft dort nichts
 *    zurück, nur die Automatik nimmt dazu).
 *
 * Ein Kind, das nur einen Startpunkt bekommen und nie getippt hat, hat
 * trotzdem einen Stand auf seinem Weg (S1, dritter Fall): Er wird geparkt wie
 * jeder andere - vorher blieben die Tasten des alten Weges im neuen stehen.
 *
 * Rein: liest nichts, schreibt nichts.
 */
import { hatSchonGeuebt } from "./einrichtung";
import { fortschrittsLernweg, lernwegVon, type Lernweg } from "./lernweg";
import { emptyProgress, type TypingProgress } from "./progress";

/** Ein geparkter Stand - ein Fortschritt ohne eigene Parkplätze. */
export type GeparkterStand = Omit<TypingProgress, "wegStaende">;

/** Was mit dem Kind mitgeht, egal auf welchem Weg (siehe Kopf). */
const GEHT_MIT = ["xp", "badges", "badgeTally", "customTextProgress"] as const;

/** Der Weg, auf dem dieser Fortschritt entstanden ist - `null`: noch keiner. */
export function wegDesFortschritts(p: TypingProgress): Lernweg | null {
  return fortschrittsLernweg(p, hatSchonGeuebt(p));
}

/**
 * Der Weg, dessen Stand beim Umstellen geparkt wird: wie
 * {@link wegDesFortschritts} - und ★ S1 auch dann, wenn das Kind nie getippt,
 * aber schon einen Startpunkt übernommen hat (Vermerk mit Wert oder Zeitpunkt).
 * Dessen freigeschaltete Tasten sind ein Stand SEINES Weges.
 */
function wegZumParken(p: TypingProgress): Lernweg | null {
  const weg = wegDesFortschritts(p);
  if (weg !== null) return weg;
  const hatStartpunkt = (p.startAngewandt ?? 0) > 0 || (p.startAngewandtAm ?? 0) > 0;
  return hatStartpunkt ? lernwegVon(p) : null;
}

/** Der Startpunkt-Beschluss eines Kontos, auf ganze Zahlen gebracht. */
function beschlussVon(konto?: { startUnits?: number; startUnitsAt?: number } | null) {
  return {
    units: Math.max(0, Math.round(konto?.startUnits ?? 0)),
    am: Math.max(0, Math.round(konto?.startUnitsAt ?? 0)),
  };
}

/**
 * Hat dieser Stand den Beschluss `b` übernommen? Am Zeitpunkt erkannt - der
 * Wert allein sagt nichts (`letters.startpunktAnwenden`). Ein Alt-Konto ohne
 * Zeitpunkt nur am Wert.
 */
function hatUebernommen(
  s: { startAngewandt?: number; startAngewandtAm?: number },
  b: { units: number; am: number },
): boolean {
  if (b.am > 0) return (s.startAngewandtAm ?? 0) === b.am;
  return b.units > 0 && s.startAngewandt === b.units;
}

/**
 * ★★ S1 (28.09.2026): der Startpunkt des Kontos, wie er auf dem Weg dieses
 * Fortschritts gilt. Steht am Konto der Beschluss, den der Stand als fremd
 * vermerkt hat (`startpunktFremd`, siehe Kopf), gilt die eigene Zahl des
 * Standes mit ihrem eigenen Zeitpunkt - dann gibt es weder einen neuen
 * Beschluss noch etwas für die Automatik. Sonst das Konto, wie es ist.
 *
 * VOR der Vorgabe der Klasse anwenden (`mitKlassenVorrang`): Die Klasse gilt
 * ohnehin nur für Kinder in ihrem Weg, und gegen die fremde Zahl darf sie
 * nicht verglichen werden. Dieselbe Funktion rechnet das Kind beim Laden
 * (`TippenTrainerPage`) und die Lehrkraft-Seite („Womit anfangen?").
 */
export function startpunktImWeg<T extends { startUnits?: number; startUnitsAt?: number }>(
  konto: T,
  p: Pick<TypingProgress, "startpunktFremd" | "startAngewandt" | "startAngewandtAm"> | null | undefined,
): T {
  const fremd = p?.startpunktFremd;
  if (!fremd) return konto;
  const b = beschlussVon(konto);
  const gleich = fremd.am > 0 ? b.am === fremd.am : b.am === 0 && b.units === fremd.units;
  if (!gleich) return konto;
  return { ...konto, startUnits: p?.startAngewandt ?? 0, startUnitsAt: p?.startAngewandtAm ?? 0 };
}

/**
 * Der Fortschritt eines Kindes, wie er auf dem Weg `weg` aussieht.
 *
 *  · Steht er schon auf `weg` (oder ist noch nichts geübt und kein Startpunkt
 *    übernommen): unverändert, nur die Kopie des Weges wird nachgetragen.
 *  · Sonst: der bisherige Stand wird unter seinem Weg geparkt, der Stand von
 *    `weg` wird zurückgeholt (oder frisch begonnen).
 *
 * @param konto der Startpunkt des Kontos, OHNE die Vorgabe der Klasse (siehe
 *   Kopf „Der Startpunkt").
 */
export function fortschrittImWeg(
  p: TypingProgress,
  weg: Lernweg,
  konto?: { startUnits?: number; startUnitsAt?: number } | null,
): TypingProgress {
  const bisher = wegZumParken(p);
  if (bisher === null || bisher === weg) {
    // Dieselbe Regel wie bisher in `TippenTrainerPage` (`lernwegVon`): ein
    // Fortschritt ohne Kopie heisst „de" und bleibt dann Byte für Byte, wie er ist.
    return weg === lernwegVon(p) ? p : { ...p, lernweg: weg };
  }
  const { wegStaende: alteStaende, ...stand } = p;
  const staende: Partial<Record<Lernweg, GeparkterStand>> = { ...(alteStaende ?? {}) };
  // Der bisherige Stand bekommt seine Wegkennung ausdrücklich mit - ein
  // Altstand ohne Kopie (vor E1) hiesse sonst beim Zurückholen wieder „kein Weg".
  staende[bisher] = { ...stand, lernweg: bisher };
  const zurueck = staende[weg];
  delete staende[weg];

  const mit: Partial<TypingProgress> = {};
  for (const feld of GEHT_MIT) {
    if (p[feld] !== undefined) (mit as Record<string, unknown>)[feld] = p[feld];
  }

  // ★ S1: Gehört der Beschluss am Konto zum bisherigen Weg (dort übernommen,
  // auf dem neuen nicht)? Dann ist er hier fremd - siehe Kopf.
  const b = beschlussVon(konto);
  const fremd =
    hatUebernommen(p, b) && !(zurueck !== undefined && hatUebernommen(zurueck, b));

  let neu: TypingProgress;
  if (zurueck) {
    const { startpunktFremd: _alt, ...geholt } = zurueck;
    neu = {
      ...emptyProgress(),
      ...geholt,
      ...mit,
      ...(fremd
        ? // Der zurückgeholte Stand behält seinen eigenen Vermerk - er kommt
          // unverändert wieder.
          { startpunktFremd: b }
        : // Siehe Kopf: ein Beschluss, den noch kein Stand übernommen hat, gilt
          // auf dem zurückgeholten Weg als schon übernommen - er stuft dort
          // nichts zurück.
          b.am > 0
          ? { startAngewandt: b.units, startAngewandtAm: b.am }
          : {}),
      lernweg: weg,
    };
  } else {
    neu = { ...emptyProgress(), ...mit, ...(fremd ? { startpunktFremd: b } : {}), lernweg: weg };
  }
  return Object.keys(staende).length > 0 ? { ...neu, wegStaende: staende } : neu;
}

/** Wurde durch {@link fortschrittImWeg} wirklich geparkt/zurückgeholt? */
export function wegGewechselt(vorher: TypingProgress, nachher: TypingProgress): boolean {
  const bisher = wegZumParken(vorher);
  return bisher !== null && bisher !== (nachher.lernweg ?? "de");
}

/** Die Wege, auf denen dieses Kind schon einen Stand hat (ausser dem aktuellen). */
export function geparkteWege(p: TypingProgress): Lernweg[] {
  return Object.keys(p.wegStaende ?? {}) as Lernweg[];
}
