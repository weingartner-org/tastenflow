/**
 * ★★★★★ DIE REIHE DER „EIGENEN ÜBUNGEN" EINER KLASSE (Z1, 19.09.2026).
 *
 * Auftrag Johannes, 19.09.2026 (wörtlich): „Prüfe, ob wirklich alle Schüler
 * einer Klasse ein Popup bekommen mit der letzten Übung, die ein Lehrer
 * gestartet hat, egal wann der Schüler Tastenflow startet. Wenn der Lehrer in
 * der Zwischenzeit schon eine neue Übung gestartet hat, dann kommt zuerst die
 * alte und dann die neue."
 *
 * ── Was vorher war (gemessen am Code, 19.09.2026) ─────────────────────────────
 * Die Klasse trug EINEN Zeiger (`tt_classes.settings.eigeneUebung`). „Eigene
 * Übung starten" ERSETZTE ihn - ein Kind, das die alte Übung noch nicht
 * geschrieben hatte (krank, erst am nächsten Tag in Tastenflow), bekam sie nie
 * mehr zu sehen. Genau das, was Johannes ausschliessen wollte.
 *
 * ── Was jetzt gilt ──────────────────────────────────────────────────────────
 * Die Klasse trägt eine REIHE (`tt_classes.eigeneUebungen`, eigenes JSON-Feld,
 * älteste zuerst). „Eigene Übung starten" HÄNGT AN. Jedes Kind arbeitet die
 * älteste Übung ab, die es noch nicht fertig hat - danach kommt die nächste,
 * wieder mit eigenem Fenster. Wer Tastenflow Tage später öffnet, bekommt alle
 * noch laufenden der Reihe nach; ein Kind, das später in die Klasse kommt,
 * ebenso (die Reihe hängt an der KLASSE, „fertig" am KIND).
 *
 * „Fertig" steht je Kind und je Text in seinem Fortschritt
 * (`TypingProgress.customTextProgress[textId].fertig`, `lw_progress` am
 * Server) - nicht am Gerät, nicht an der Klasse.
 *
 * ── Warum ein eigenes Feld und nicht `settings` ─────────────────────────────
 * `settings` ist auf 2000 Bytes gedeckelt und trägt schon Tippchallenge-Plan
 * und Zeiger; zwanzig Einträge mit Dateinamen passen dort nicht daneben, und
 * ein volles Feld verlöre still, was sonst noch darin steht (dieselbe
 * Begründung wie bei den anderen eigenen Feldern in `setup.mjs`).
 *
 * ── Der alte Zeiger (faules Umziehen) ────────────────────────────────────────
 * Klassen, in denen vor diesem Umbau eine Übung gestartet wurde, tragen nur
 * den alten Zeiger. Ist die Reihe LEER und der Zeiger da, gilt er als Reihe
 * mit einem Eintrag ({@link eigeneUebungReihe}) - kein Umschreiben am Server
 * nötig. Der nächste Start oder das nächste Beenden schreibt die Reihe und
 * leert den Zeiger im selben Aufruf.
 *
 * Alles hier ist rein (keine Zeit, kein Netz) - die Backends und beide Seiten
 * (Lehrkraft, Kind) rechnen mit DENSELBEN Funktionen.
 */
import { eigeneUebungZeigerAusEinstellungen } from "./eigenerText";
import type { TypingProgress } from "./progress";
import type { BedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache } from "./sprachRegister";
import { KETTEN_NEUN } from "./kettenNeun";

/** So viele Übungen hält die Reihe höchstens (Auftrag Z1). */
export const EIGENE_UEBUNGEN_HOECHSTENS = 20;

/**
 * Dateinamen werden für die Reihe gekürzt - ein Eintrag soll klein bleiben
 * (20 Einträge im JSON-Feld). Der volle Name steht weiter an der Textzeile.
 */
const DATEINAME_HOECHSTENS = 120;

/** Ein Eintrag der Reihe - älteste zuerst. */
export interface EigeneUebungEintrag {
  /** Id der Textzeile (`tt_eigene_texte`) - der Text selbst liegt dort. */
  textId: string;
  /** Für die Anzeige, ohne eigene Abfrage der Textzeile. */
  dateiname: string;
  /** Wann gestartet (ms). */
  gestartetAm: number;
  /** Kennung der Lehrkraft, die gestartet hat. */
  von: string;
}

/**
 * Die Reihe aus dem rohen Serverwert lesen - wehrhaft wie
 * `eigeneUebungZeigerAusEinstellungen`: Ein kaputter Eintrag fällt weg, er
 * setzt keinem Kind eine falsche Übung vor. Eine doppelte `textId` zählt nur
 * einmal (die frühere Stelle gilt).
 */
export function eigeneUebungenAusRoh(roh: unknown): EigeneUebungEintrag[] {
  if (!Array.isArray(roh)) return [];
  const gesehen = new Set<string>();
  const reihe: EigeneUebungEintrag[] = [];
  for (const e of roh) {
    if (!e || typeof e !== "object") continue;
    const p = e as Record<string, unknown>;
    const textId = typeof p.textId === "string" ? p.textId.trim() : "";
    if (!textId || gesehen.has(textId)) continue;
    gesehen.add(textId);
    const amRoh = typeof p.gestartetAm === "number" ? p.gestartetAm : Number(p.gestartetAm);
    reihe.push({
      textId,
      dateiname: typeof p.dateiname === "string" ? p.dateiname : "",
      gestartetAm: Number.isFinite(amRoh) ? amRoh : 0,
      von: typeof p.von === "string" ? p.von : "",
    });
  }
  return reihe;
}

/**
 * ★★★ DIE Reihe einer Klasse - samt faulem Umziehen des alten Zeigers (siehe
 * Dateikopf). Das ist die EINE Stelle, an der Lehrkraft-Seite, Kind-Seite und
 * Backends lesen, welche Übungen laufen.
 */
export function eigeneUebungReihe(
  cls: { eigeneUebungen?: unknown; settings?: unknown; teacherId?: string } | null | undefined,
): EigeneUebungEintrag[] {
  if (!cls) return [];
  const reihe = eigeneUebungenAusRoh(cls.eigeneUebungen);
  if (reihe.length > 0) return reihe;
  const alt = eigeneUebungZeigerAusEinstellungen(cls.settings);
  if (!alt) return [];
  return [
    { textId: alt.textId, dateiname: alt.dateiname, gestartetAm: alt.angelegtMs, von: cls.teacherId ?? "" },
  ];
}

/**
 * Eine neue Übung HINTEN anhängen. Wird die Reihe dadurch länger als
 * {@link EIGENE_UEBUNGEN_HOECHSTENS}, fällt zuerst die älteste, die schon
 * ALLE Kinder fertig haben (`vonAllenFertig`), sonst die älteste überhaupt.
 * Dieselbe `textId` noch einmal ändert nichts.
 */
export function reiheMitNeuer(
  reihe: readonly EigeneUebungEintrag[],
  neu: EigeneUebungEintrag,
  vonAllenFertig: readonly string[] = [],
): EigeneUebungEintrag[] {
  if (reihe.some((e) => e.textId === neu.textId)) return [...reihe];
  const eintrag = { ...neu, dateiname: neu.dateiname.slice(0, DATEINAME_HOECHSTENS) };
  const ergebnis = [...reihe, eintrag];
  const fertig = new Set(vonAllenFertig);
  while (ergebnis.length > EIGENE_UEBUNGEN_HOECHSTENS) {
    // Nie die gerade angehängte - sie steht hinten und ist von niemandem fertig.
    const i = ergebnis.findIndex((e, j) => j < ergebnis.length - 1 && fertig.has(e.textId));
    ergebnis.splice(i >= 0 ? i : 0, 1);
  }
  return ergebnis;
}

/** Eine Übung aus der Reihe nehmen („Beenden"). */
export function reiheOhne(
  reihe: readonly EigeneUebungEintrag[],
  textId: string,
): EigeneUebungEintrag[] {
  return reihe.filter((e) => e.textId !== textId);
}

/** Der Teil des Fortschritts, den die Reihe braucht. */
type MitTextStand = Pick<TypingProgress, "customTextProgress"> | null | undefined;

/** Hat DIESES Kind diesen Text einmal ganz geschrieben? */
export function hatFertig(fortschritt: MitTextStand, textId: string): boolean {
  return fortschritt?.customTextProgress?.[textId]?.fertig === true;
}

/**
 * ★ Die Übung, an der DIESES Kind jetzt arbeitet: die älteste der Reihe, die
 * es noch nicht fertig hat. `null` = nichts offen, das Kind übt normal.
 */
export function naechsteOffeneUebung(
  reihe: readonly EigeneUebungEintrag[],
  fortschritt: MitTextStand,
): EigeneUebungEintrag | null {
  return reihe.find((e) => !hatFertig(fortschritt, e.textId)) ?? null;
}

/**
 * „n von m Kindern fertig" - aus den Fortschritten, die die Lehrkraft-Seite
 * ohnehin schon geladen hat (keine eigene Abfrage).
 */
export function fertigeKinder(
  textId: string,
  fortschritte: readonly MitTextStand[],
): { fertig: number; gesamt: number } {
  return {
    fertig: fortschritte.filter((f) => hatFertig(f, textId)).length,
    gesamt: fortschritte.length,
  };
}

/** Die `textId`s, die schon JEDES Kind fertig hat (für {@link reiheMitNeuer}). */
export function vonAllenFertig(
  reihe: readonly EigeneUebungEintrag[],
  fortschritte: readonly MitTextStand[] | undefined,
): string[] {
  if (!fortschritte || fortschritte.length === 0) return [];
  return reihe
    .filter((e) => fortschritte.every((f) => hatFertig(f, e.textId)))
    .map((e) => e.textId);
}

/**
 * Der kurze Stand neben dem Schalter „Eigene Übung" (Aufgaben-Zeile) und im
 * zugeklappten Kasten - EINE Rechnung für beide Stellen.
 */
export function eigeneUebungKurzstand(
  cls: Parameters<typeof eigeneUebungReihe>[0],
  /**
   * ★ EN6a (19.09.2026): die Bedienungssprache - ohne Angabe Deutsch, genau
   * die Wörter von vorher. Englisch nach Glossar §3.8 (*assigned* / *not
   * assigned*), wie das Handbuch es zitiert: *assigned: autumn-poem.txt*.
   * ★ E11a-3 (26.09.2026): Französisch nach Bauplan §9.2 („Texte de la
   * classe").
   */
  sprache: BedienSprache = "de",
): string {
  const reihe = eigeneUebungReihe(cls);
  // ★ O-CS (03.10.2026): die Lehrkraft liest es - ohne Anrede; „přiřazeno"
  // (Neutrum, gehört zu „cvičení"), Zahl und Dateiname nach Doppelpunkt;
  // „cvičení" ist nach jeder Zahl gleich (Glossar §2.11).
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) {
    const k = KETTEN_NEUN[sprache];
    if (reihe.length === 0) return k.eigeneNichtZugewiesen;
    return reihe.length === 1 ? k.eigeneEine(reihe[0].dateiname) : k.eigeneMehrere(reihe.length);
  }
  if (sprache === "cs") {
    if (reihe.length === 0) return "nepřiřazeno";
    if (reihe.length === 1) return `přiřazeno: ${reihe[0].dateiname}`;
    return `přiřazeno: ${reihe.length} cvičení, postupně`;
  }
  // ★ O-TR (02.10.2026): die Lehrkraft liest es - ohne Anrede; Zahl und
  // Dateiname nach Doppelpunkt, ohne Endung (Glossar §1 Regel 6).
  if (sprache === "tr") {
    if (reihe.length === 0) return "atanmadı";
    if (reihe.length === 1) return `atandı: ${reihe[0].dateiname}`;
    return `atandı: ${reihe.length} alıştırma, sırayla`;
  }
  // ★ O-PL (02.10.2026): unpersönlich, „przydzielone" gehört zu „ćwiczenie"
  // (n.); die Zahl nach Doppelpunkt - keine Mehrzahl-Form nötig (Regel 11).
  if (sprache === "pl") {
    if (reihe.length === 0) return "nie przydzielono";
    if (reihe.length === 1) return `przydzielone: ${reihe[0].dateiname}`;
    return `przydzielone: ${reihe.length}, po kolei`;
  }
  // ★ O-IT (02.10.2026): „assegnato" - das Esercizio personalizzato (m.).
  if (sprache === "it") {
    if (reihe.length === 0) return "non assegnato";
    if (reihe.length === 1) return `assegnato: ${reihe[0].dateiname}`;
    return `${reihe.length} assegnati, in ordine`;
  }
  if (sprache === "fr") {
    if (reihe.length === 0) return "non assigné";
    if (reihe.length === 1) return `assigné : ${reihe[0].dateiname}`;
    return `${reihe.length} assignés, dans l'ordre`;
  }
  // ★ ES-O (27.09.2026): spanisch - vorher still Deutsch (Falle 30).
  if (sprache === "es") {
    if (reihe.length === 0) return "sin asignar";
    if (reihe.length === 1) return `asignado: ${reihe[0].dateiname}`;
    return `${reihe.length} asignados, por orden`;
  }
  if (sprache === "en") {
    if (reihe.length === 0) return "not assigned";
    if (reihe.length === 1) return `assigned: ${reihe[0].dateiname}`;
    return `${reihe.length} assigned, in order`;
  }
  if (reihe.length === 0) return "nicht zugewiesen";
  if (reihe.length === 1) return `zugewiesen: ${reihe[0].dateiname}`;
  return `${reihe.length} zugewiesen, der Reihe nach`;
}
