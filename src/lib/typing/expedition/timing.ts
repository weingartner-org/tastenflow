/**
 * Adaptiver Zeitdruck der Polar-Expedition (Neubau, Bauplan §5). Ersetzt die drei
 * starren Standzeit-Stufen des Altspiels (`floeStandMs`: 14 s / 9 s / kein Limit)
 * durch ein Zeitfenster, das sich am tatsächlich GEMESSENEN Tempo des Kindes für
 * die jeweilige Taste orientiert — schnelle Tipper bekommen ein knapperes, langsame
 * ein großzügigeres Fenster, ganz ohne Vergleich mit anderen.
 *
 *   fenster(taste) = clamp( median_ms(taste) × polster , 1600 ms … 12000 ms )
 *
 *   • polster: startet bei 2,2; je fehlerfrei geschaffter Station −0,1 (bis min
 *     1,5); nach jedem Scheitern zurück auf 2,2 — so wird der Lauf mit jeder
 *     sicheren Station ein bisschen sportlicher, ein Patzer macht ihn wieder
 *     gemütlich (Rückenwind statt Bestrafung, Bauplan §4.8).
 *   • Ganz neue Taste ohne Messwerte → großzügige 14 s (wie die alte Stufe
 *     „gemächlich"); erst wenn echte Anschlagszeiten vorliegen, greift der Median.
 *   • Zeichen-FOLGEN (Steilwand, Sturm): Summe der Einzelfenster ihrer Zeichen.
 *   • „Ohne Zeitdruck" (`ignoreSpeed`, Lehrkraft-Stufe „nur Genauigkeit") → `null`:
 *     nichts sinkt je, vollwertig wie bisher (WCAG: Zeitlimits abschaltbar).
 *
 * WICHTIG (Bauplan §5, §9): KEIN neues Tracking — gelesen werden ausschließlich die
 * ohnehin vorhandenen Pro-Zeichen-Messwerte (`LetterStat`) aus „Mein Training".
 * Der laufende Countdown pausiert, solange die Ansage noch spricht — das erledigt
 * die Komponente über `isSpeaking()`, nicht diese (reine, testbare) Datei.
 *
 * Siehe [[project_pinguinspiel_neubau]], [[project_zehnfinger_trainer]].
 */
import type { Mastery } from "../letters";
import type { LetterStat } from "../progress";

/**
 * Polster-Multiplikator zu Beginn eines Laufs. Bewusst KNAPPER als der ursprüngliche
 * §5-Wert (3.0): Johannes 13.07. — „die Zeit bis das Eis sinkt ist viel zu lang, nur
 * kurz Zeit". Die Scholle wartet spürbar nicht mehr lange.
 */
export const POLSTER_START = 2.2;
/** Kleinster Polster-Multiplikator (der Lauf wird flott, aber nie hektisch). */
export const POLSTER_MIN = 1.5;
/** Um so viel sinkt der Polster je fehlerfrei geschaffter Station. */
export const POLSTER_STEP = 0.1;

/** Untergrenze des Zeitfensters — auch schnelle Tipper haben kurz Zeit zum Suchen. */
export const WINDOW_MIN_MS = 1600;
/** Obergrenze des (aus Messwerten berechneten) Zeitfensters. */
export const WINDOW_MAX_MS = 12000;
/**
 * Fenster für eine ganz neue Taste OHNE Messwerte — bewusst großzügig (wie die
 * alte Stufe „gemächlich") und ABSICHTLICH über {@link WINDOW_MAX_MS}: eine
 * unbekannte Taste soll nie unter Zeitdruck geraten, bevor das Kind sie kennt.
 */
export const NEW_KEY_MS = 14000;

/** Median einer Zahlenliste (leer → null). */
function median(xs: readonly number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}

/**
 * Der Median der gemessenen Anschlagszeiten (ms) einer Taste — oder `null`, wenn
 * es (noch) keine gibt. Bevorzugt das gleitende Fenster der letzten Anschläge
 * (`recent` > 0 = getakteter Treffer; 0 = Treffer ohne Zeit, −1 = Fehler — beide
 * zählen nicht); nur für Altstände ohne Fenster fällt es auf das Lebenszeit-Mittel
 * (`sumMs / timed`) zurück. Median statt Mittel: robust gegen einen einzelnen
 * Ausreißer (ein verträumter Anschlag verzerrt das Fenster nicht).
 */
export function unitMedianMs(stat: LetterStat | undefined): number | null {
  if (!stat) return null;
  const timed = (stat.recent ?? []).filter((x) => x > 0);
  if (timed.length > 0) return median(timed);
  if (stat.timed > 0 && stat.sumMs > 0) return stat.sumMs / stat.timed; // Altstand-Fallback
  return null;
}

/**
 * Der Polster-Multiplikator nach dem Ausgang einer Station: eine fehlerfrei
 * geschaffte Station macht den Lauf um {@link POLSTER_STEP} sportlicher (bis
 * {@link POLSTER_MIN}), ein Scheitern setzt ihn großzügig auf {@link POLSTER_START}
 * zurück. Pure Funktion — den Zustand hält die Spiel-Komponente.
 */
export function advancePolster(polster: number, outcome: "cleared" | "failed"): number {
  if (outcome === "failed") return POLSTER_START;
  return Math.max(POLSTER_MIN, polster - POLSTER_STEP);
}

/**
 * Zeitfenster (ms) für eine EINZELNE Taste — oder `null`, wenn kein Zeitdruck gilt
 * (`ignoreSpeed`). Ohne Messwerte {@link NEW_KEY_MS}; sonst
 * `clamp(median × polster, WINDOW_MIN_MS … WINDOW_MAX_MS)`.
 */
export function unitWindowMs(
  unit: string,
  letters: Record<string, LetterStat> | undefined,
  mastery: Pick<Mastery, "ignoreSpeed">,
  polster: number = POLSTER_START,
): number | null {
  if (mastery.ignoreSpeed) return null;
  // Buchstaben werden kleingeschrieben gemessen (Taste, nicht Groß-/Kleinform).
  const stat = letters?.[unit] ?? letters?.[unit.toLowerCase()];
  const med = unitMedianMs(stat);
  if (med === null) return NEW_KEY_MS;
  return Math.round(Math.max(WINDOW_MIN_MS, Math.min(WINDOW_MAX_MS, med * polster)));
}

/**
 * Zeitfenster (ms) für eine ZEICHENFOLGE (Steilwand-Tritt, Sturm-Merkfolge) —
 * Summe der Einzelfenster ihrer Zeichen (Bauplan §5). `null` bei „ohne Zeitdruck".
 * Eine leere Folge ergibt `null` (nichts zu takten).
 */
export function sequenceWindowMs(
  units: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Pick<Mastery, "ignoreSpeed">,
  polster: number = POLSTER_START,
): number | null {
  if (mastery.ignoreSpeed) return null;
  if (units.length === 0) return null;
  let sum = 0;
  for (const u of units) sum += unitWindowMs(u, letters, mastery, polster) ?? 0;
  return sum;
}
