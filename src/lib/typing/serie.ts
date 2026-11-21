/**
 * Datenmodell der fortlaufenden Texte („Ebene 2" des Textwelt-Umbaus, §3.2 in
 * `Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md`,
 * [[project_tastenflow_textwelt_neuaufbau]]).
 *
 * Eine `Serie` ist eine Geschichte ODER eine Wissens-Serie, erzählt in `etappen`
 * (runden-große Blöcke à 12–16 Zeilen) über viele Runden hinweg — mit Cliffhanger,
 * „weiterschreiben wollen". Dasselbe Modell für beide Sorten (`kind`).
 *
 * TW-E1: nur die TYPEN + kleine, getestete Helfer — noch KEIN Inhalt. Konsum
 * (Bücherei/Einweben/Resume) ist TW-E3; die Serien selbst kommen in TW-E10–E12.
 */
import type { Lang, Stufe } from "./account";
import type { Herkunft } from "./corpus";
import { minTierFor, type Tier } from "./tiers";
import type { Lernweg } from "./lernweg";

/** Empfohlene Etappen-Länge (variabel; 12 ist der Normalfall, bis 16 erlaubt). */
export const ETAPPE_MIN_LINES = 12;
export const ETAPPE_MAX_LINES = 16;

export type SerieKind = "geschichte" | "wissen-serie";

/** Eine Etappe = eine geordnete Runde einer Serie. */
export interface Etappe {
  /** Die zu tippenden Zeilen dieser Etappe, in Reihenfolge (12–16). */
  lines: string[];
}

/** Eine fortlaufende Serie (Geschichte oder Wissens-Thema). */
export interface Serie {
  /** Stabiler Kurzname (URL-/Fortschritts-Schlüssel), z. B. "der-verlorene-schluessel". */
  slug: string;
  titel: string;
  kind: SerieKind;
  /** Altersstufen, für die die Serie gedacht ist. */
  stufen: Stufe[];
  /**
   * Sprache der Serie. Fehlt das Feld, gilt "de" — so bleiben alle bestehenden
   * (deutschen) Serien unverändert gültig, und die Bücherei kann englische
   * Serien sauber trennen (sonst stünden sie im deutschen Regal).
   */
  lang?: Lang;
  /** Ab welchem Tier tippbar (typischerweise = Maximum über alle Zeilen). */
  minTier: Tier;
  /** Thema/Tag (für Bücherei-Filter und Abwechslung). */
  topic: string;
  /**
   * Herkunft/Rechte (TW-E5, §10): Quelle · Lizenz · Autor · Fundstelle. Pflicht
   * bei ÜBERNOMMENEN (CC/gemeinfreien) Texten — Grundlage der Namensnennung im
   * „Quellen & Dank"-Bereich. Selbst verfasste Serien tragen ein eigenes Werk.
   */
  herkunft?: Herkunft;
  /**
   * ★ E4a (24.09.2026, Bauplan §6.2/§10): Nur auf DIESEM Lernweg servieren -
   * für Serien, die eigens für die Sprossen des Weges „en" geschrieben
   * werden. Fehlt das Feld - wie bei JEDER heutigen Serie -, gilt sie auf
   * BEIDEN Wegen (unverändertes Verhalten). Wirkt in `serienForStufe`
   * (serien.ts); die Tier-Einstufung folgt automatisch (siehe
   * {@link computeSerieMinTier}).
   */
  nurWeg?: Lernweg;
  etappen: Etappe[];
}

/** Anzahl Etappen einer Serie. */
export function serieEtappeCount(s: Serie): number {
  return s.etappen.length;
}

/** Gesamtzahl der Zeilen über alle Etappen. */
export function serieLineCount(s: Serie): number {
  return s.etappen.reduce((n, e) => n + e.lines.length, 0);
}

/** Alle Zeilen einer Serie in Reihenfolge (flach). */
export function serieLines(s: Serie): string[] {
  return s.etappen.flatMap((e) => e.lines);
}

/**
 * Das aus dem Inhalt berechnete Tier einer Serie = das MAXIMUM der Zeilen-Tiers.
 * Nützlich als Prüfung gegen das deklarierte `minTier` (Pipeline-Gate) und in den
 * Inhalts-Etappen. `null`, wenn eine Zeile ein nie freischaltbares Zeichen enthält.
 *
 * @param lernweg ★ E2 (24.09.2026): Pflicht - gegen welchen Weg die Serie
 *   eingestuft wird (Bauplan §3.5, Falle 4). ALLE heutigen Serien (auch die
 *   englischsprachigen, siehe Bauplan §0) sind gegen die Stufen des Weges
 *   „de" geschrieben und bleiben es, bis sie in Etappe E5 neu eingestuft
 *   werden - bis dahin übergibt jeder Aufrufer ausdrücklich „de".
 *
 *   ★ E4a (24.09.2026): Trägt die Serie `nurWeg`, GEWINNT er - eine Serie, die
 *   nur auf Weg „en" läuft, wird immer gegen `LERNWEGE.en.tierCuts` geprüft,
 *   ganz gleich, was der Aufrufer hier übergibt (Bauplan §10 E4/§11 Falle 4).
 *   Serien ohne `nurWeg` verhalten sich unverändert - der Parameter entscheidet
 *   wie bisher.
 */
export function computeSerieMinTier(s: Serie, lernweg: Lernweg): Tier | null {
  const tierWeg = s.nurWeg ?? lernweg;
  let max: Tier = 0;
  for (const line of serieLines(s)) {
    const t = minTierFor(line, tierWeg);
    if (t === null) return null;
    if (t > max) max = t;
  }
  return max;
}

/**
 * Strukturprüfung einer Serie (für die Pipeline-Gates in TW-E5/E10–E12). Prüft
 * nur die FORM (Etappen vorhanden, Zeilenlängen im Rahmen, deklariertes `minTier`
 * konsistent) — nicht Sinn/Kohärenz (das leisten die Prüf-Schwärme).
 *
 * @param lernweg ★ E2: Pflicht, siehe {@link computeSerieMinTier} - inklusive
 *   der ★ E4a-Regel, dass `s.nurWeg` (falls gesetzt) diesen Parameter für die
 *   Tier-Prüfung überstimmt.
 */
export function validateSerie(s: Serie, lernweg: Lernweg): { ok: boolean; problems: string[] } {
  const problems: string[] = [];
  if (!s.slug) problems.push("slug fehlt");
  if (!s.titel) problems.push("titel fehlt");
  if (s.etappen.length === 0) problems.push("keine Etappen");
  s.etappen.forEach((e, i) => {
    if (e.lines.length < ETAPPE_MIN_LINES || e.lines.length > ETAPPE_MAX_LINES) {
      problems.push(
        `Etappe ${i + 1}: ${e.lines.length} Zeilen (erlaubt ${ETAPPE_MIN_LINES}-${ETAPPE_MAX_LINES})`,
      );
    }
    if (e.lines.some((l) => l.trim().length === 0)) {
      problems.push(`Etappe ${i + 1}: leere Zeile`);
    }
  });
  const computed = computeSerieMinTier(s, lernweg);
  if (computed === null) {
    problems.push("enthält nie freischaltbares Zeichen");
  } else if (computed !== s.minTier) {
    problems.push(`minTier deklariert ${s.minTier}, berechnet ${computed}`);
  }
  return { ok: problems.length === 0, problems };
}
