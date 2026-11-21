/**
 * Sterne-Bewertung + adaptive Tempo-Schwelle des Tipptrainers „Tastenflow".
 *
 * Eine Runde bekommt 1–3 Sterne aus zwei Dingen — bewusst UNGLEICH gewichtet:
 *   • Treffsicherheit (wie wenig Fehler) zählt DREIFACH,
 *   • Geschwindigkeit (Anschläge/Min im Verhältnis zu einem Tempo-Ziel) einfach.
 *
 * Treffsicherheit ist IMMER deutlich wichtiger als Tempo (Wunsch Johannes,
 * 2026-07-07): Wer schludrig rast, kommt nie auf 3 Sterne (rechnerisch braucht
 * es dafür mindestens ≈ 96 % Treffer, egal wie schnell) — wer perfekt, aber
 * langsam tippt, hat die 2 Sterne dagegen sicher und holt die 3. schon mit
 * 60 % des Tempo-Ziels.
 *
 * Das Tempo-Ziel ist NICHT für alle gleich, sondern wächst mit der Spielstufe
 * (Wunsch #5: Anfänger dürfen langsam schreiben und trotzdem 3 Sterne) UND passt
 * sich an das Kind an (Wunsch #7):
 *   • Wer dauerhaft langsam, aber sauber tippt, bekommt ein niedrigeres Ziel und
 *     kann trotzdem 3 Sterne erreichen — und kommt im Programm weiter.
 *   • Wer schnell ist, bekommt ein höheres Ziel: 3 Sterne gibt es nicht
 *     automatisch, sondern für eine wirklich gute Runde — das hält es spannend.
 *   • Wer mitten in der Runde eine Pause macht, ist über die ganze Runde
 *     gerechnet langsam → das Tempo reicht nicht für 3 Sterne (Wunsch #6).
 *
 * Das persönliche „übliche Tempo" wird als gleitender Mittelwert (`speedEma`) der
 * letzten Runden geführt (siehe [[project_zehnfinger_trainer]]).
 */
import { levelTargetCpm } from "./level";

// --- Stellschrauben (bewusst hier gebündelt, leicht nachjustierbar) ----------

/** Faktor auf das persönliche Tempo: 1.0 = „dein übliches Tempo halten".
 *  Eine wirklich gute Runde (über dem üblichen Tempo) holt die 3. Sterne. */
export const CHALLENGE = 1.0;
/** Absolute Untergrenze des Ziels (nie trivial niedrig). */
export const SLOW_FLOOR_CPM = 20;
/** Das persönliche Ziel darf das Stufen-Ziel höchstens so weit übersteigen
 *  (sonst würde es für sehr schnelle Kinder demotivierend hoch). */
export const FAST_CAP_MULT = 1.4;

/** Gewicht des neuen Werts im gleitenden Tempo-Mittel (0..1). */
export const EMA_ALPHA = 0.35;

/** Treffsicherheit, ab der die Tempo-Wertung „zählt": <80 % = 0 Punkte, 98 % = voll. */
export const ACC0 = 0.8;
export const ACC1 = 0.98;

/** Schwellen für 3 bzw. 2 Sterne auf der Gesamt-Wertung (0..1). */
export const STAR3 = 0.9;
export const STAR2 = 0.6;

/**
 * Gewicht der Treffsicherheit in der Gesamt-Wertung (Rest = Tempo).
 * 0.75 heißt: Treffsicherheit zählt dreimal so viel wie das Tempo. Folgen:
 *   • 3 Sterne erfordern IMMER mindestens ≈ 96 % Treffer — volles Tempo kann
 *     fehlende Genauigkeit nicht ausgleichen.
 *   • 2 Sterne gibt es unter ≈ 88 % Treffern selbst bei vollem Tempo nicht.
 *   • Eine fehlerfreie Runde hat die 2 Sterne sicher (auch im Schneckentempo)
 *     und erreicht die 3 schon mit 60 % des Tempo-Ziels.
 */
export const ACC_WEIGHT = 0.75;

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/**
 * Tempo-Ziel (Anschläge/Min) für die Sterne. Es ergibt sich aus der
 * Leistungsstufe (siehe level.ts) und passt sich an das persönliche Tempo an.
 * `speedEma` ist das bisher übliche Rundentempo (undefined/0, solange es noch
 * keine Erfahrungswerte gibt). Stufe ≤ 1 liefert 0 → die Sterne zählen dort
 * allein die Treffsicherheit, damit auch das langsamste Kind 3 Sterne erreicht.
 */
export function speedTargetCpm(
  level: number,
  speedEma: number | undefined,
  zeitLassen = false,
): number {
  // „Zeit lassen" (Eigenschaft des Kindes, 14.08.2026): kein Tempo-Ziel, auf
  // keiner Stufe — die Sterne zählen dann allein die Sorgfalt.
  if (zeitLassen) return 0;
  const levelTarget = levelTargetCpm(level);
  if (levelTarget <= 0) return 0; // Stufe 1: Tempo zählt nicht
  if (!speedEma || speedEma <= 0) return levelTarget; // noch keine Erfahrung → Stufen-Ziel
  let t = speedEma * CHALLENGE;
  t = Math.max(t, SLOW_FLOOR_CPM); // nie trivial niedrig
  t = Math.min(t, levelTarget * FAST_CAP_MULT); // schnelle Kinder nicht überfordern
  return t;
}

/** Gleitendes Mittel des Rundentempos fortschreiben (nur saubere Runden füttern). */
export function updateSpeedEma(prev: number | undefined, cpm: number): number {
  if (!prev || prev <= 0) return cpm;
  return prev * (1 - EMA_ALPHA) + cpm * EMA_ALPHA;
}

/** Tempo-Wertung 0..1 (Rundentempo im Verhältnis zum Ziel). */
export function speedScore(cpm: number, target: number): number {
  return target > 0 ? clamp01(cpm / target) : 0;
}

/** Treffsicherheits-Wertung 0..1 (unter ACC0 = 0, ab ACC1 = voll). */
export function accuracyScore(acc: number): number {
  return clamp01((acc - ACC0) / (ACC1 - ACC0));
}

/**
 * Treffsicherheit, die OHNE Tempo-Ziel für eine Sterne-Schwelle nötig ist.
 *
 * Sie wird aus derselben Formel abgeleitet, die mit Tempo-Ziel gilt — mit
 * VOLLEM Tempo-Anteil: Wo das Tempo nicht bewertet wird, soll es auch nicht
 * fehlen. Damit ist die zeitdruckfreie Bewertung genau so streng wie die
 * beste erreichbare mit Tempo (≈ 95,6 % für drei, ≈ 88,4 % für zwei Sterne)
 * — und nicht mehr strenger.
 *
 * ★ Reparatur 14.08.2026: Vorher standen hier feste 98 % / 92 %. Damit war
 * ausgerechnet die zeitdruckfreie Bewertung die STRENGSTE der ganzen App
 * (Stufe 2 verlangte rechnerisch nur ≈ 96 %) — das Kind, dem man den Zeitdruck
 * genommen hatte, bekam dafür die härtere Genauigkeits-Latte.
 */
export function accOnlyThreshold(starScore: number): number {
  const needed = clamp01((starScore - (1 - ACC_WEIGHT)) / ACC_WEIGHT);
  return ACC0 + needed * (ACC1 - ACC0);
}

/**
 * Sterne (1–3) einer Runde aus Treffsicherheit (0..1) und Rundentempo
 * (Anschläge/Min) gegen das Tempo-Ziel. Die Treffsicherheit wird mit
 * {@link ACC_WEIGHT} gewichtet (dreifach), das Tempo mit dem Rest — Genauigkeit
 * ist IMMER deutlich wichtiger als Geschwindigkeit.
 * Ohne Tempo-Ziel (≤0 — Stufe 1 oder „Zeit lassen") zählt nur die
 * Treffsicherheit, und zwar mit denselben Schwellen (siehe
 * {@link accOnlyThreshold}).
 */
export function roundStars(acc: number, cpm: number, target: number): number {
  if (target <= 0)
    return acc >= accOnlyThreshold(STAR3)
      ? 3
      : acc >= accOnlyThreshold(STAR2)
        ? 2
        : 1;
  const combined =
    ACC_WEIGHT * accuracyScore(acc) + (1 - ACC_WEIGHT) * speedScore(cpm, target);
  if (combined >= STAR3) return 3;
  if (combined >= STAR2) return 2;
  return 1;
}
