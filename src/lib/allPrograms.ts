import { TASTENFLOW_PFAD, TASTENFLOW_START } from "./adressen";

export type ProgramType = "sim" | "lern";

export interface ProgramEntry {
  key: string;
  label: string;
  path: string | null;
  type: ProgramType;
  /** Code-Default. Der Admin-Schalter (`released`) schlägt diesen Wert. */
  draft: boolean;
  /**
   * Eigene Adresse im Netz, falls das Programm eine hat - Tastenflow seit dem
   * 22.08.2026 (`https://tastenflow.org`). Dort läuft dieselbe App vom selben
   * Server; `weingartner.org<path>` leitet dorthin weiter (das macht Caddy).
   *
   * ⚠️ `key` und `path` bleiben davon UNBERÜHRT: Am `key` hängt der Fortschritt
   *    der Kinder, am `path` hängen Lesezeichen, verschickte Links und die
   *    Arbeitsheft-Einbettungen. Beide sind eingefroren.
   *
   * Verweise darauf baut `programmHref()` (src/lib/adressen.ts) - nie von Hand.
   */
  externeAdresse?: string;
  /**
   * ★★★ BETA - „noch nicht fertig" (Johannes, 04.09.2026: *„kennzeichne die
   * apps Klangpunkte Punktgenau und im griff als BETA, damit die leute wissen
   * das ist noch nicht fertig"*).
   *
   * ⚠️ NICHT dasselbe wie `draft`. Die beiden Angaben beantworten zwei ganz
   * verschiedene Fragen, und sie zu verwechseln kostet entweder Sichtbarkeit
   * oder Vertrauen:
   *
   *   · `draft`  - DARF man es sehen? Steuert die Sichtbarkeit; der
   *                Admin-Schalter (`released`) schlägt den Wert.
   *   · `beta`   - Was DARF man erwarten? Ändert an der Sichtbarkeit nichts.
   *                Das Programm ist da, ist benutzbar und ist offen: Es kann
   *                sich noch ändern, und es kann noch Ecken haben.
   *
   * Alle drei hier gekennzeichneten Programme sind LIVE. Die Marke nimmt
   * ihnen nichts weg, sie sagt nur, woran man ist - wer mit einer Klasse
   * plant, soll das vorher wissen und nicht mitten im Unterricht merken.
   */
  beta?: boolean;
  // ★ 19.11.2026 (Johannes): „Beta" verschwindet bei allen Apps ausser »im Griff«
  // (das ist noch lange nicht fertig). Wer ein Programm wieder kennzeichnen will,
  // setzt hier `beta: true` - Kopfzeile, Überblick und Tests folgen von selbst.
}

export type ProgrammeOverride = { released?: boolean; type?: ProgramType; order?: number };
export type ProgrammeOverrides = Record<string, ProgrammeOverride>;

// Alle Programme der Plattform — eine Quelle der Wahrheit.
// ★ 21.09.2026 (Johannes: „manchmal werden in der Lernwerkstatt nicht 5,
// sondern nur 3 Apps angezeigt"): Punktgenau und Klangpunkte standen hier auf
// `draft: true` und waren nur über den Freigabe-Schalter auf dem Server LIVE.
// Kam diese Antwort nicht an (langsames oder unterbrochenes WLAN, Fehler im
// Netz), galt der Code-Default - und die Lernwerkstatt zeigte nur die drei
// Programme, die hier schon freigegeben standen. Der Default gehört zum
// Live-Stand: Was öffentlich ist, steht hier auf `draft: false`. Wer ein
// Programm PARKEN will, tut das weiter im Admin (schlägt den Default).
// `draft` ist nur der AUSLIEFERUNGS-Default. Die tatsächliche öffentliche
// Sichtbarkeit steuert der Admin live über den Freigabe-Schalter
// (Verwaltung → Programme); er wird in PocketBase unter appSettings/
// "programme-overrides" als `released` gespeichert und schlägt den Default —
// siehe isProgramReleased(). Kein Code-Deploy nötig zum Parken/Freigeben.
// type "sim" → erscheint in /erleben (anonym); "lern" → /lernwerkstatt.
// Die Reihenfolge INNERHALB einer Gruppe (lern / sim) ist der Anzeige-Default
// und deckt sich mit der öffentlichen Seite. Der Admin kann sie live umsortieren
// (Verwaltung → Programme → Hoch/Runter); die Reihung wird pro Programm als
// `order` in appSettings/"programme-overrides" gespeichert und schlägt diesen
// Default — siehe programmeOrder().
export const ALL_PROGRAMS: ProgramEntry[] = [
  // LernApps (Lernwerkstatt) — Reihenfolge = Default der /lernwerkstatt-Seite
  { key: "tippen", label: "Tastenflow — 10-Finger-Schreiben", path: TASTENFLOW_PFAD, type: "lern", draft: false, externeAdresse: TASTENFLOW_START },
];

/**
 * Effektiver Veröffentlichungs-Status eines Programms.
 * Der Admin-Override (`released`, in PocketBase appSettings/"programme-overrides")
 * schlägt den Code-Default (`!draft`). Kein Override → Code-Default.
 * Unbekannter key → sichtbar (defensive Vorgabe, sollte nicht vorkommen).
 */
export function isProgramReleased(key: string, overrides: ProgrammeOverrides): boolean {
  const prog = ALL_PROGRAMS.find((p) => p.key === key);
  const fallback = prog ? !prog.draft : true;
  return overrides[key]?.released ?? fallback;
}

/**
 * Effektive Anzeige-Reihenfolge eines Programms (kleiner = weiter oben).
 * Der Admin-Override (`order`) schlägt den Code-Default (= Position in
 * ALL_PROGRAMS). Verglichen wird immer nur innerhalb einer Gruppe (lern bzw.
 * sim), die je auf einer eigenen öffentlichen Seite erscheint.
 */
export function programmeOrder(key: string, overrides: ProgrammeOverrides): number {
  const ov = overrides[key]?.order;
  if (typeof ov === "number") return ov;
  const idx = ALL_PROGRAMS.findIndex((p) => p.key === key);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

/**
 * Sortiert Objekte mit `key` stabil nach der effektiven Reihenfolge
 * (programmeOrder). Praktisch für die öffentlichen Seiten, deren Karten-Arrays
 * ihre eigenen Texte/Icons tragen, aber der Admin-Reihung folgen sollen.
 */
export function sortByProgrammeOrder<T extends { key: string }>(
  items: T[],
  overrides: ProgrammeOverrides,
): T[] {
  return [...items].sort(
    (a, b) => programmeOrder(a.key, overrides) - programmeOrder(b.key, overrides),
  );
}

/**
 * Trägt dieses Programm die Marke BETA? Unbekannter Schlüssel: nein.
 *
 * ⚠️ EINE Quelle, nicht drei. Die Marke erscheint an drei Stellen - auf der
 * Karte in der Lernwerkstatt, in der Kopfzeile des Programms selbst und in der
 * Verwaltung. Stünde sie an jeder Stelle für sich hingeschrieben, würde beim
 * Fertigwerden eine davon vergessen - und die Plattform behauptete an einer
 * Stelle „noch nicht fertig", während sie es woanders nicht mehr sagt
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export function istBeta(key: string): boolean {
  return ALL_PROGRAMS.find((p) => p.key === key)?.beta === true;
}
