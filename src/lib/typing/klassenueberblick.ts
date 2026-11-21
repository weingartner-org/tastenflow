/**
 * ════════════════════════════════════════════════════════════════════════════
 * DER KLASSENÜBERBLICK - die Rechnung (K3, 19.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 19.09.2026: *„ich mag den Klassenüberblick und die Score-Leiste,
 * ich hätte noch gerne ein Liniendiagramm Schuljahr (Score der Klasse) … und
 * der Klassenüberblick soll auch das vergangene Monat standardmäßig
 * ausgewählt haben, Schuljahr gibt es auch; diese Übersicht muss viel
 * schlanker und einfacher werden"*.
 *
 * Hier steht nur die REINE Rechnung (kein Zustand, kein Datum von selbst -
 * `jetztMs` kommt herein, damit ein Test die Woche festhalten kann). Die
 * Oberfläche steht in `components/lernwerkstatt/klasse/Klassenueberblick.tsx`.
 *
 * ── ⚠️ Keine zweite Rechnung ───────────────────────────────────────────────
 * Jede Zahl geht durch die Wege, die auch die Tabelle darunter nimmt:
 *   · Zeiträume und Wochengrenzen    `zeitraum.ts` (Montag 08:00, K4)
 *   · Tempo, Treffsicherheit          `computePupilStats`
 *   · Score                           `scoreAusStats` → `scoreAusWerten`
 *   · Trend im Schuljahr              `entwicklungImZeitraum` (K4: 4-Wochen-Blöcke)
 *   · Wochenaufgaben                  `abgeschlosseneZielwochen` + `erfuellungProzent`
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── ⚠️ Wer nicht geübt hat, ist kein schlechter Wert ───────────────────────
 * Gemittelt wird nur über Kinder, die im Zeitraum WIRKLICH geübt haben. Eine
 * Null für ein Kind ohne Übung zöge den Schnitt nach unten und sähe dabei aus
 * wie ein schlechter Wert statt wie ein fehlender (Befund A3, 11.09.2026:
 * 97 + 96 + 98 geteilt durch 6 statt durch 3 = 48 %). Wer fehlt, wird
 * genannt ({@link Kennzahlen.ohneUebung}) - ein Mittelwert, der verschweigt,
 * wer nicht mitgezählt ist, ist eine falsche Auskunft
 * ([[feedback_nie_gegen_das_kind]]).
 */
import { computePupilStats, type PupilStats, type TaskEvent } from "./account";
import { scoreAusStats } from "./score";
import {
  BLOCK_WOCHEN,
  MINDESTZEILEN,
  MINDEST_WOCHEN_FUER_BLOCK,
  entwicklungImZeitraum,
  veraenderung,
  type Veraenderung,
} from "./veraenderung";
import {
  WOCHENZIEL_GRENZE,
  erfuellungProzent,
  type GesperrteZeit,
  type KindWochenziel,
  type WochenErgebnis,
} from "./wochenziel";
import { abgeschlosseneZielwochen } from "./wochenzielZeitraum";
import {
  ereignisseIm,
  ereignisseZwischen,
  grenzen,
  vergleichsGrenzen,
  type Zeitraum,
} from "./zeitraum";
import { schuljahrVon } from "./jahreskarte";

/** Die zwei Zeiträume des Überblicks - „Monat" ist vorgewählt. */
export type UeberblickArt = "monat" | "schuljahr";

export const UEBERBLICK_VORGABE: UeberblickArt = "monat";

/**
 * Der Zeitraum hinter dem Schalter: „Monat" = die letzten 4 Wochen bis
 * einschliesslich der laufenden (K4, `monatVersatz: 0`), „Schuljahr" = das
 * laufende Schuljahr. Geblättert wird hier nicht - das kann die Tabelle.
 */
export function ueberblickZeitraum(
  art: UeberblickArt,
  /** ★ D2: der Beginn des Schuljahres der Klasse (1-12) - ohne Angabe August. */
  schuljahrBeginn?: number,
): Zeitraum {
  return art === "monat"
    ? { art: "monat", wochenVersatz: 0, monatVersatz: 0 }
    : {
        art: "schuljahr",
        wochenVersatz: 0,
        jahrVersatz: 0,
        ...(schuljahrBeginn !== undefined ? { schuljahrBeginn } : {}),
      };
}

/** Was der Überblick von einem Kind braucht. */
export interface UeberblickKind {
  name: string;
  /** Die UNGEFILTERTEN Übungs-Ereignisse - gefiltert wird hier. */
  events: readonly TaskEvent[];
  /** Aus `kindWochenzielAusFeldern(pupil)` - die EINE Übersetzung Speicherform → Rechnung. */
  ziel: KindWochenziel;
}

/** Eine Zahl der Kennzahl-Zeile samt ihrem Trend. */
export interface Kennzahl {
  /** Der Klassenschnitt - `null`, wenn niemand im Zeitraum geübt hat. */
  wert: number | null;
  /** Über wie viele Kinder gemittelt wurde. */
  gezaehlt: number;
  /** `null` = es gibt nichts zu vergleichen. */
  veraenderung: Veraenderung | null;
  /** Über wie viele Kinder der Trend gerechnet ist. */
  verglichen: number;
}

export interface Aufgabenkennzahl {
  /** Hat überhaupt ein Kind der Klasse ein Wochenziel? */
  aktiv: boolean;
  /** Σ erfüllt ÷ Σ Ziel über alle abgeschlossenen Ziel-Wochen aller Kinder, 0..1. */
  anteil: number | null;
  /** In Prozentpunkten. */
  veraenderung: Veraenderung | null;
}

export interface ScorePunkt {
  name: string;
  /** Gerundet, 0..100. */
  wert: number;
}

export interface Kennzahlen {
  art: UeberblickArt;
  tempo: Kennzahl;
  treffer: Kennzahl;
  aufgaben: Aufgabenkennzahl;
  /** Die Punkte der Score-Leiste: je Kind mit Score im Zeitraum. */
  scores: ScorePunkt[];
  /** Hat im Zeitraum geübt, aber unter der Mindestmenge - kein Score, kein Punkt. */
  ohneScore: string[];
  /** Hat im Zeitraum nicht geübt - in keinem Mittelwert, auf keiner Leiste. */
  ohneUebung: string[];
}

function mittel(werte: readonly number[]): number | null {
  if (werte.length === 0) return null;
  return werte.reduce((a, b) => a + b, 0) / werte.length;
}

/** Treffsicherheit in Prozent - `null` ohne eine einzige Zeile (nie 0). */
function trefferVon(s: PupilStats): number | null {
  return s.tasks ? s.accuracy * 100 : null;
}

/** Anschläge je Minute - `null` ohne gemessene Zeile (nie 0). */
function tempoVon(s: PupilStats): number | null {
  return s.avgCpm ? s.avgCpm : null;
}

/**
 * Der Trend einer Klasse über Kinder, die in BEIDEN Zeiträumen einen Wert
 * haben - der Schnitt der Unterschiede je Kind. Wer nur in einem der beiden
 * geübt hat, bewegt die Zahl nicht: Sonst wechselte mit der Besetzung auch
 * die Klasse, und ein Kind, das neu dazukommt, sähe aus wie ein Rückschritt.
 */
function paarTrend(
  paare: readonly { jetzt: number | null; vorher: number | null }[],
  groesse: "treffer" | "tempo",
): { veraenderung: Veraenderung | null; verglichen: number } {
  const gueltig = paare.filter(
    (p): p is { jetzt: number; vorher: number } => p.jetzt !== null && p.vorher !== null,
  );
  const j = mittel(gueltig.map((p) => p.jetzt));
  const v = mittel(gueltig.map((p) => p.vorher));
  return { veraenderung: veraenderung(j, v, groesse), verglichen: gueltig.length };
}

/**
 * Der Trend im Schuljahr: je Kind `entwicklungImZeitraum` (K4 - die ersten 4
 * Übungswochen gegen die letzten 4, bei weniger als 5 Übungswochen die erste
 * gegen die letzte), dann der Schnitt dieser Unterschiede über die Kinder,
 * die einen haben. Die Totzone gilt auf den Schnitt, nicht je Kind.
 */
function entwicklungsTrend(
  unterschiede: readonly (number | null)[],
  groesse: "treffer" | "tempo",
): { veraenderung: Veraenderung | null; verglichen: number } {
  const da = unterschiede.filter((d): d is number => d !== null);
  const m = mittel(da);
  return { veraenderung: veraenderung(m, m === null ? null : 0, groesse), verglichen: da.length };
}

/** Σ erfüllt ÷ Σ Ziel über die Wochen-Zeilen - `erfuellungProzent`, nicht nachgebaut. */
function anteilUeber(zeilen: readonly WochenErgebnis[]): number | null {
  return erfuellungProzent(zeilen);
}

/**
 * Der Trend der Wochenaufgaben im Schuljahr - dieselbe Regel wie K4 für
 * Tempo und Treffsicherheit, nur über die abgeschlossenen ZIEL-Wochen der
 * ganzen Klasse: ab {@link MINDEST_WOCHEN_FUER_BLOCK} Wochen die ersten
 * {@link BLOCK_WOCHEN} gegen die letzten, darunter die erste gegen die letzte.
 */
function aufgabenTrendSchuljahr(zeilen: readonly WochenErgebnis[]): Veraenderung | null {
  const wochen = [...new Set(zeilen.map((w) => w.startMs))].sort((a, b) => a - b);
  if (wochen.length < 2) return null;
  const block = wochen.length >= MINDEST_WOCHEN_FUER_BLOCK;
  const erste = new Set(block ? wochen.slice(0, BLOCK_WOCHEN) : [wochen[0]]);
  const letzte = new Set(block ? wochen.slice(-BLOCK_WOCHEN) : [wochen[wochen.length - 1]]);
  const a = anteilUeber(zeilen.filter((w) => erste.has(w.startMs)));
  const b = anteilUeber(zeilen.filter((w) => letzte.has(w.startMs)));
  return veraenderung(b === null ? null : b * 100, a === null ? null : a * 100, "treffer");
}

/**
 * ★ Die Zahlen des Überblicks für den gewählten Zeitraum.
 *
 * Trend „Monat": gegen die 4 Wochen davor (`vergleichsGrenzen`, K4).
 * Trend „Schuljahr": wie weit die Klasse IM Schuljahr gekommen ist
 * (`entwicklungImZeitraum`, K4).
 */
export function klassenKennzahlen(
  kinder: readonly UeberblickKind[],
  art: UeberblickArt,
  jetztMs: number,
  gesperrt: readonly GesperrteZeit[] = [],
  /** ★ D2: der Beginn des Schuljahres der Klasse (1-12) - ohne Angabe August. */
  schuljahrBeginn?: number,
): Kennzahlen {
  const z = ueberblickZeitraum(art, schuljahrBeginn);
  const vorG = art === "monat" ? vergleichsGrenzen(z, jetztMs, WOCHENZIEL_GRENZE) : null;
  const zeitraumG = grenzen(z, jetztMs, WOCHENZIEL_GRENZE);

  const je = kinder.map((k) => {
    const stats = computePupilStats(ereignisseIm(k.events, z, jetztMs, WOCHENZIEL_GRENZE));
    const vorher = vorG ? computePupilStats(ereignisseZwischen(k.events, vorG)) : null;
    const ent = art === "schuljahr" ? entwicklungImZeitraum(k.events, zeitraumG) : null;
    return { k, stats, vorher, ent };
  });

  const geuebt = je.filter((x) => x.stats.tasks > 0);
  const tempoWerte = geuebt.map((x) => tempoVon(x.stats)).filter((v): v is number => v !== null);
  const trefferWerte = geuebt.map((x) => trefferVon(x.stats)).filter((v): v is number => v !== null);

  const tempoTrend =
    art === "monat"
      ? paarTrend(
          je.map((x) => ({ jetzt: tempoVon(x.stats), vorher: x.vorher ? tempoVon(x.vorher) : null })),
          "tempo",
        )
      : entwicklungsTrend(je.map((x) => x.ent?.tempo?.differenz ?? null), "tempo");
  const trefferTrend =
    art === "monat"
      ? paarTrend(
          je.map((x) => ({ jetzt: trefferVon(x.stats), vorher: x.vorher ? trefferVon(x.vorher) : null })),
          "treffer",
        )
      : entwicklungsTrend(je.map((x) => x.ent?.treffer?.differenz ?? null), "treffer");

  // ── Wochenaufgaben: SUMMIERT über die Klasse, nicht gemittelt ──────────
  // Erst alle Minuten zusammenzählen, dann EINMAL teilen - ein Mittel aus
  // einzelnen Prozentsätzen gewichtete jedes Kind gleich, egal wie viele
  // Zielminuten dahinterstehen. Hier zählt die Minute, nicht der Kopf.
  const aktiv = kinder.some((k) => k.ziel.verlauf.length > 0);
  const zeilenIn = (zz: Zeitraum) =>
    kinder.flatMap((k) => abgeschlosseneZielwochen(k.events, k.ziel, gesperrt, zz, jetztMs));
  const zeilen = zeilenIn(z);
  const anteil = anteilUeber(zeilen);
  let aufgabenTrend: Veraenderung | null = null;
  if (anteil !== null) {
    if (art === "monat") {
      const davor = anteilUeber(zeilenIn({ ...z, monatVersatz: -1 }));
      aufgabenTrend = veraenderung(anteil * 100, davor === null ? null : davor * 100, "treffer");
    } else {
      aufgabenTrend = aufgabenTrendSchuljahr(zeilen);
    }
  }

  // ── Score-Leiste ────────────────────────────────────────────────────────
  const scores: ScorePunkt[] = [];
  const ohneScore: string[] = [];
  for (const x of geuebt) {
    const s = scoreAusStats(x.stats).wert;
    if (s === null) ohneScore.push(x.k.name);
    else scores.push({ name: x.k.name, wert: Math.round(s) });
  }

  return {
    art,
    tempo: {
      wert: mittel(tempoWerte),
      gezaehlt: tempoWerte.length,
      ...tempoTrend,
    },
    treffer: {
      wert: mittel(trefferWerte),
      gezaehlt: trefferWerte.length,
      ...trefferTrend,
    },
    aufgaben: { aktiv, anteil, veraenderung: aufgabenTrend },
    scores,
    ohneScore,
    ohneUebung: je.filter((x) => x.stats.tasks === 0).map((x) => x.k.name),
  };
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★ DER SCORE DER KLASSE JE WOCHE - Grundlage des Liniendiagramms
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Ein Punkt je Woche (Montag 08:00, dieselbe Grenze wie überall) im laufenden
 * Schuljahr: der Schnitt der Scores aller Kinder, die in DIESER Woche
 * mindestens {@link MINDESTZEILEN} Zeilen geschrieben haben. Der Score je Kind
 * und Woche ist genau der, den die Spalte „Score" zeigt, wenn oben diese Woche
 * gewählt ist (`scoreAusStats(computePupilStats(…))`).
 *
 * ⚠️ Eine Woche ohne genug Übung ist eine LÜCKE (`wert: null`), keine Null:
 * Ferien sind kein Einbruch der Klasse.
 *
 * Die Reihe beginnt mit der ersten Woche, die einen Wert hat - der Sommer vor
 * dem Schulbeginn wäre sonst eine lange leere Strecke, die das Diagramm
 * zusammendrückt - und endet mit der laufenden Woche.
 */
export interface ScoreWoche {
  /** Montag 08:00 dieser Woche. */
  startMs: number;
  /** Klassenschnitt, gerundet - `null` = zu wenig Übung für einen Wert. */
  wert: number | null;
  /** Wie viele Kinder im Schnitt stecken. */
  kinder: number;
}

export function klassenScoreVerlauf(
  kinder: readonly { events: readonly TaskEvent[] }[],
  jetztMs: number,
  /** ★ D2: der Beginn des Schuljahres der Klasse (1-12) - ohne Angabe August. */
  schuljahrBeginn?: number,
): ScoreWoche[] {
  const sj = schuljahrVon(jetztMs, schuljahrBeginn);
  const wochen: ScoreWoche[] = [];
  // Rückwärts von der laufenden Woche - `grenzen` ist die EINE Quelle für
  // Wochengrenzen (Kalendertage, DST-sicher, K4).
  for (let versatz = 0; ; versatz -= 1) {
    const g = grenzen({ art: "woche", wochenVersatz: versatz }, jetztMs, WOCHENZIEL_GRENZE)!;
    if (g.bisMs < sj.vonMs) break;
    const imSchuljahr = { vonMs: Math.max(g.vonMs, sj.vonMs), bisMs: g.bisMs };
    const scores: number[] = [];
    for (const k of kinder) {
      const ev = ereignisseZwischen(k.events, imSchuljahr);
      // Eine „Zeile" wie in `entwicklungImZeitraum`: Zeichen UND Zeit.
      const zeilen = ev.filter((e) => e.chars > 0 && e.ms > 0).length;
      if (zeilen < MINDESTZEILEN) continue;
      const s = scoreAusStats(computePupilStats(ev)).wert;
      if (s !== null) scores.push(s);
    }
    const m = mittel(scores);
    wochen.unshift({
      startMs: g.vonMs,
      wert: m === null ? null : Math.round(m),
      kinder: scores.length,
    });
  }
  const erste = wochen.findIndex((w) => w.wert !== null);
  return erste === -1 ? [] : wochen.slice(erste);
}
