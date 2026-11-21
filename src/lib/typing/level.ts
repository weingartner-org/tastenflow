/**
 * Leistungsstufe (Anforderungs-Niveau) des Tipptrainers „Tastenflow".
 *
 * Statt drei fester Stufen (Normal/Gemächlich/Nur Genauigkeit) gibt es eine
 * FEIN abgestufte Skala von 1 bis {@link LEVEL_MAX} (=50), die sich AUTOMATISCH
 * an jedes Kind anpasst — „fordern, ohne zu überfordern". Sie deckt damit die
 * ganze Bandbreite ab: vom Kind mit Mehrfachbehinderung, das extrem langsam
 * beginnt und langsam steigert, bis zum Profi auf Sekretärniveau.
 *
 * Wichtige Grundsätze (Wunsch von Johannes):
 *   • Wer startet, beginnt je nach Vorerfahrung mittig und STEIGT durch Üben auf.
 *   • Wird ein Kind anhaltend sehr langsam UND sehr fehlerhaft, setzt das
 *     Programm es auf Stufe 1 zurück (dort zählt nur die Treffsicherheit).
 *   • Auch das schwächste Kind kommt weiter und bekommt Sterne — jede Stufe ist
 *     so gerechnet, dass 3 Sterne erreichbar bleiben (siehe stars.ts).
 *
 * Die Leistungsstufe ist NICHT die „Spielstufe" (das sind die XP-Punkte fürs
 * Üben, siehe progress.ts) und auch nicht die „Textstufe" (das Alter, siehe
 * account.ts) — drei verschiedene Dinge, die die Hilfe auseinanderhält.
 * Siehe [[project_zehnfinger_trainer]], [[feedback_data_transparency]].
 */
import type { TempoLevel } from "./letters";

/** Höchste Leistungsstufe. 1 = nur Genauigkeit, 50 = Sekretärniveau. */
export const LEVEL_MAX = 50;

/**
 * Tempo-Ziel (Anschläge/Min) der Eckstufen. Ab Stufe 2 wird Tempo gemessen;
 * dazwischen wächst das Ziel GEOMETRISCH (gleichmäßige relative Schritte —
 * unten feinfühlig für die langsamen Kinder, oben Luft bis zum Profi).
 *   • Stufe 2  → 22/min  (sehr behutsam)
 *   • Stufe 50 → 420/min (≈ 84 Wörter/Min, Sekretärniveau)
 */
export const LV_STEP2_CPM = 22;
export const LV_TOP_CPM = 420;

function clampLevel(level: number): number {
  if (!Number.isFinite(level)) return 1;
  return Math.max(1, Math.min(LEVEL_MAX, Math.round(level)));
}

/**
 * Tempo-Ziel (Anschläge/Min) einer Leistungsstufe. Stufe ≤ 1 liefert 0 — dort
 * zählt das Tempo nicht (Aufstieg/Sterne allein über die Treffsicherheit).
 */
export function levelTargetCpm(level: number): number {
  const L = clampLevel(level);
  if (L <= 1) return 0;
  const t = (L - 2) / (LEVEL_MAX - 2); // 0 … 1
  return LV_STEP2_CPM * Math.pow(LV_TOP_CPM / LV_STEP2_CPM, t);
}

/**
 * Welche Leistungsstufe passt zu einem gemessenen Tempo? Umkehrung von
 * {@link levelTargetCpm} — gerundet, geklemmt auf [2, LEVEL_MAX]. Sehr langsame
 * Tempi landen auf der untersten gemessenen Stufe (2).
 */
export function levelForCpm(cpm: number): number {
  if (!(cpm > LV_STEP2_CPM)) return 2;
  const t = Math.log(cpm / LV_STEP2_CPM) / Math.log(LV_TOP_CPM / LV_STEP2_CPM);
  return Math.max(2, Math.min(LEVEL_MAX, Math.round(2 + t * (LEVEL_MAX - 2))));
}

/** Start-Leistungsstufe für neue Konten, falls die Lehrkraft nichts wählt. */
export const DEFAULT_START_LEVEL = 6;

/**
 * Start-Leistungsstufe aus der (alten) Anforderungs-Wahl der Lehrkraft. Sie legt
 * NUR den Einstieg fest — danach passt sich die Stufe automatisch an.
 *   • „Nur Genauigkeit" → Stufe 1 (Tempo zählt nicht),
 *   • „Gemächlich"      → Stufe 4 (sehr behutsam),
 *   • „Normal"          → Stufe 8 (behutsamer Einstieg mit Tempo).
 */
export function startLevelForTempo(tempo: TempoLevel | undefined): number {
  switch (tempo) {
    case "nurgenau":
      return 1;
    case "gemaechlich":
      return 4;
    case "normal":
      return 8;
    default:
      return DEFAULT_START_LEVEL;
  }
}

// (Bis 11.09.2026 stand hier `levelLabel()`, entfernt weil ungenutzt.)

/** Eine abgeschlossene Übungsrunde — Grundlage für Anpassung UND Steigerungs-Statistik. */
export interface RoundResult {
  ts: number;
  acc: number; // Treffsicherheit 0..1
  cpm: number; // Tempo der Runde (Anschläge/Min)
  stars: number; // 1..3
  level: number; // Leistungsstufe, auf der die Runde gespielt wurde
}

// --- Automatische Anpassung der Leistungsstufe -------------------------------
// Alle Stellschrauben bewusst hier gebündelt und großzügig dokumentiert, damit
// sich das Verhalten leicht nachjustieren lässt (Wunsch: ausgeklügelte Parameter).

/** So viele der jüngsten Runden AUF DER AKTUELLEN STUFE fließen in das Urteil ein. */
export const ADAPT_WINDOW = 5;
/**
 * Erst nach so vielen Runden auf der aktuellen Stufe wird überhaupt angepasst —
 * das ist die Hysterese/Abklingzeit gegen Hin-und-Her-Springen. Nach jedem
 * Wechsel beginnt diese Zählung von vorn (neue Runden tragen die neue Stufe).
 */
export const ADAPT_MIN_AT_LEVEL = 3;

/** Treffsicherheit, ab der eine Runde als „stark" zählt. */
export const STRONG_ACC = 0.93;
/** Mittlere Treffsicherheit, die ein Aufstieg zusätzlich verlangt. */
export const PROMOTE_ACC = 0.9;
/** Unter dieser Treffsicherheit gilt eine Runde als „schwach". */
export const WEAK_ACC = 0.8;
/** Unter dieser Treffsicherheit ist eine Runde „sehr schwach". */
export const EXTREME_ACC = 0.65;
/** Langsamer als dieser Anteil des Stufenziels = „schwach" (Tempo). */
export const WEAK_SPEED_FRAC = 0.5;
/** Langsamer als dieser Anteil des Stufenziels = „sehr langsam" (Tempo). */
export const EXTREME_SPEED_FRAC = 0.45;
/** Ab diesem Vielfachen des Ziels gilt das Tempo als „deutlich über Ziel". */
export const FAR_ABOVE_FRAC = 1.6;
/** Größter Stufensprung nach oben in EINER Anpassung (schnelle Kinder finden zügig ihr Niveau). */
export const PROMOTE_MAX_STEP = 6;
/** Anteil der betrachteten Runden, der ein Urteil tragen muss (Mehrheit). */
export const MAJORITY = 0.6;

/**
 * Anfangs-Kalibrierung („einpendeln"): Solange die Leistungsstufe noch ihr
 * passendes Niveau SUCHT, wird sie NICHT über das 5-Runden-Fenster gemittelt,
 * sondern direkt aufs gezeigte saubere Tempo gezogen — am Anfang ganz feinkörnig
 * (in der ersten Runde nach JEDER Zeile, danach nach jeder Runde), bis sie sich
 * einpendelt. Erst dann übernimmt die stabile, gedämpfte Fenster-Anpassung
 * ({@link adaptLevel}). Wer gleich schnell UND sauber tippt (z. B. 200/min),
 * landet so sofort beim passenden Ziel — nicht mehr „45 trotz 200". Eine
 * vergeigte (unsaubere) Messung zählt gar nicht; der Median der sauberen Tempi
 * dämpft Ausreißer. (Wunsch von Johannes: „am Anfang schneller, dann der Schnitt
 * aus 5 Runden".) Die einzelnen sauberen Tempi liegen im Spielstand
 * (`calSpeeds`); ist `calibrated` gesetzt, ist diese Phase abgeschlossen.
 */
export const CAL_WINDOW = 6; // so viele saubere Tempi fließen in den Median
export const CAL_MIN_SAMPLES = 3; // erst ab so vielen Messungen kann es „eingependelt" sein
export const CAL_STABLE_DELTA = 1; // ändert der Median die Stufe um ≤ so viel → eingependelt

/** Mindest-Treffsicherheit, damit eine Messung als „sauber" in die Kalibrierung zählt. */
export const CLEAN_ACC = PROMOTE_ACC;

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Stufe aus den bisher gesammelten sauberen Tempi (`cleanSpeeds`). Liefert die
 * passende Stufe (Median → {@link levelForCpm}) und ob die Kalibrierung sich
 * EINGEPENDELT hat (genug Messungen UND die Stufe wandert kaum noch). Solange
 * `settled` falsch ist, läuft die feinkörnige Kalibrierung weiter.
 */
export function calibrateFromSpeeds(
  level: number,
  cleanSpeeds: readonly number[],
): { level: number; settled: boolean } {
  const L = clampLevel(level);
  if (cleanSpeeds.length === 0) return { level: L, settled: false };
  const lvl = Math.max(2, Math.min(LEVEL_MAX, levelForCpm(median([...cleanSpeeds]))));
  const settled =
    cleanSpeeds.length >= CAL_MIN_SAMPLES && Math.abs(lvl - L) <= CAL_STABLE_DELTA;
  return { level: lvl, settled };
}

/**
 * Nächste Leistungsstufe aus dem bisherigen Verlauf — die STABILE, gedämpfte
 * Fenster-Anpassung, die greift, NACHDEM sich die Stufe eingependelt hat
 * (Anfangs-Kalibrierung siehe {@link calibrateFromSpeeds}). Reine, testbare
 * Funktion.
 *
 * Vorgehen:
 *   1. Nur die jüngsten zusammenhängenden Runden AUF DER AKTUELLEN STUFE
 *      betrachten (max. {@link ADAPT_WINDOW}). Sind es zu wenige
 *      ({@link ADAPT_MIN_AT_LEVEL}), bleibt die Stufe — das ist die Abklingzeit.
 *   2. Sehr langsam UND sehr fehlerhaft (Mehrheit) → zurück auf Stufe 1.
 *   3. Sonst schwach (Mehrheit) → eine Stufe hinunter.
 *   4. Sonst stark (Mehrheit) und treffsicher → hinauf; deutlich über Ziel auch
 *      mehrere Stufen auf einmal (zügig zum passenden Niveau), sonst behutsam.
 */
export function adaptLevel(level: number, rounds: readonly RoundResult[]): number {
  const L = clampLevel(level);

  // jüngste zusammenhängende Runden auf der aktuellen Stufe
  const atLevel: RoundResult[] = [];
  for (let i = rounds.length - 1; i >= 0; i--) {
    if (clampLevel(rounds[i].level) !== L) break;
    atLevel.unshift(rounds[i]);
    if (atLevel.length >= ADAPT_WINDOW) break;
  }
  if (atLevel.length < ADAPT_MIN_AT_LEVEL) return L;

  const n = atLevel.length;
  const need = Math.ceil(n * MAJORITY);
  const target = levelTargetCpm(L);
  const mAcc = median(atLevel.map((r) => r.acc));
  const mCpm = median(atLevel.map((r) => r.cpm));

  // ★ Reparatur 14.08.2026 (das „Pendel"): Der Aufstieg VON Stufe 1 sah das
  // Tempo überhaupt nicht an — drei saubere Runden genügten, und ein Kind mit
  // 8 Anschlägen/Min landete auf Stufe 2 mit Tempo-Ziel 22. Dort scheiterte es
  // am Tempo, fiel zurück, stieg wieder auf: ein Pendel, ohne dass sich seine
  // Leistung je änderte — genau das, was der Dateikopf ausschließen will
  // („langsame, genaue Kinder bleiben NICHT hängen"). Wer die geschützte Zone
  // verlässt, muss darum das Tempo der NÄCHSTEN Stufe wirklich zeigen.
  const isStrong = (r: RoundResult) =>
    r.acc >= STRONG_ACC &&
    (L <= 1 ? r.acc >= 0.97 && r.cpm >= LV_STEP2_CPM : r.cpm >= target);
  const isWeak = (r: RoundResult) =>
    r.acc < WEAK_ACC || (L > 1 && r.cpm < target * WEAK_SPEED_FRAC);
  const isExtreme = (r: RoundResult) =>
    r.acc < EXTREME_ACC && (L <= 1 || r.cpm < target * EXTREME_SPEED_FRAC);

  const strong = atLevel.filter(isStrong).length;
  const weak = atLevel.filter(isWeak).length;
  const extreme = atLevel.filter(isExtreme).length;

  // 1) sehr langsam UND sehr fehlerhaft → ganz nach unten (dort zählt nur Genauigkeit)
  if (L > 1 && extreme >= need) return 1;
  // 2) schwach → eine Stufe hinunter
  if (weak >= need) return Math.max(1, L - 1);
  // 3) stark + treffsicher → hinauf (ggf. mehrere Stufen)
  if (strong >= need && mAcc >= PROMOTE_ACC) {
    if (L <= 1) {
      // zurück ins gemessene Tempo: Stufe passend zum aktuellen Tempo
      return Math.max(2, Math.min(LEVEL_MAX, levelForCpm(Math.max(mCpm, LV_STEP2_CPM))));
    }
    const desired = levelForCpm(mCpm);
    const farAbove = mCpm >= target * FAR_ABOVE_FRAC;
    const maxStep = farAbove ? PROMOTE_MAX_STEP : 2;
    const step = Math.max(1, Math.min(maxStep, desired - L));
    return Math.min(LEVEL_MAX, L + step);
  }
  return L;
}

// --- Steigerung im Verlauf (für Schüler- und Lehrer-Statistik) ---------------

export interface Improvement {
  rounds: number;
  /** Tempo (Anschläge/Min): Mittel der ersten bzw. letzten Runden + Differenz. */
  cpmStart: number;
  cpmNow: number;
  cpmDelta: number;
  /** Treffsicherheit (0..1) am Anfang bzw. jetzt + Differenz. */
  accStart: number;
  accNow: number;
  accDelta: number;
  /** Leistungsstufe am Anfang bzw. jetzt. */
  levelStart: number;
  levelNow: number;
  /** Bestes Rundentempo überhaupt. */
  bestCpm: number;
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

/**
 * Steigerung aus dem Rundenverlauf: vergleicht das frühe Drittel mit dem späten
 * Drittel (mind. eine Runde je Seite). So sehen Kind UND Lehrkraft schwarz auf
 * weiß, dass sich Tempo, Treffsicherheit und Niveau über die Zeit verbessern.
 */
export function computeImprovement(rounds: readonly RoundResult[]): Improvement | null {
  if (rounds.length < 2) return null;
  const seg = Math.max(1, Math.floor(rounds.length / 3));
  const first = rounds.slice(0, seg);
  const last = rounds.slice(-seg);
  const cpmStart = mean(first.map((r) => r.cpm));
  const cpmNow = mean(last.map((r) => r.cpm));
  const accStart = mean(first.map((r) => r.acc));
  const accNow = mean(last.map((r) => r.acc));
  return {
    rounds: rounds.length,
    cpmStart,
    cpmNow,
    cpmDelta: cpmNow - cpmStart,
    accStart,
    accNow,
    accDelta: accNow - accStart,
    levelStart: clampLevel(first[0].level),
    levelNow: clampLevel(last[last.length - 1].level),
    bestCpm: Math.max(...rounds.map((r) => r.cpm)),
  };
}
