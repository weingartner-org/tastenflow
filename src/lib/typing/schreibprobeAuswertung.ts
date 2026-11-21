/**
 * Das Rechenwerk der Schreibprobe: aus den Anschlägen einer Probe wird die
 * *„detaillierte auflistung ihrer leistung"* (Johannes, 09.09.2026).
 *
 * ── Warum ein eigenes Rechenwerk und nicht die Runden-Auswertung ────────────
 * Die Runden-Auswertung (`accuracy`, `cpm`, `letterLevel`) misst den LERNSTAND
 * eines Kindes über die letzten 60 Anschläge je Taste. Eine Schreibprobe misst
 * etwas anderes: was in DIESEN zehn Minuten passiert ist. Beide Zahlen tragen
 * denselben Namen und meinen nicht dasselbe - und genau deshalb stehen sie
 * getrennt, statt dass eine Funktion je nach Aufrufer zwei Bedeutungen hätte.
 *
 * Was hier NICHT passiert: In die Anschlags-Statistik des Kindes
 * (`progress.letters`) schreibt die Schreibprobe NICHTS.
 *
 * ★★★ Der Grund ist eine Entscheidung, keine Bequemlichkeit: Eine Prüfung darf
 * das Tor zur nächsten Taste weder öffnen noch zuschlagen. Ein Kind, das in
 * einer Probe auf einem Niveau schreibt, das es noch gar nicht gelernt hat
 * (die Lehrkraft stellt das Niveau für die ganze Klasse ein), würde sonst
 * reihenweise „hakende" Tasten geschenkt bekommen, die es nie geübt hat - und
 * danach in seinem eigenen Lehrgang festsitzen. Die ÜBEZEIT zählt trotzdem
 * (geschrieben wurde ja wirklich), das steht in `SchreibprobeLauf`.
 */
import type { BedienSprache } from "../bedienSprache/sprache";
import { SHIFT_UNIT } from "./letters";
import type { KeyEvent } from "./letters";
import { istLernweg, type Lernweg } from "./lernweg";
import {
  PROBEN_JE_NIVEAU,
  ZEILE_GROESST,
  type ProbenEnde,
  type ProbenNiveau,
} from "./schreibprobe";
import { werte, wirksamerZuschlag, type Wertung } from "./schreibprobeWertung";

/**
 * ★★ Eine Fehlerstelle im freien Modus - Original gegen Eingabe, für die
 * Anzeige „Fehlerstellen" (Bauplan §7, Entscheidung Johannes: „Die
 * Ergebnis-Karte bekommt eine Ansicht 'Fehlerstellen' ... Soll-Wort / Ist-Wort
 * je Fehler als Liste, nicht nur als Farbe").
 *
 * ⚠️ BEWUSST STRUKTURELL (`art: string`, kein importierter Union-Typ): Der
 * Vergleich („falsch"/„fehlend"/„ueberzaehlig"/„leerzeichen") entsteht in
 * `freiVergleich.ts`, die parallel zu dieser Datei entsteht. Ein Import von
 * dort hierher wäre eine Abhängigkeit in die falsche Richtung und hätte diese
 * Datei an eine noch nicht fertige Datei gebunden.
 */
export interface FehlerStelle {
  zeile: number;
  soll: string;
  ist: string;
  art: string;
}

/** Höchstens so viele Fehlerstellen werden gespeichert (freier Modus). */
export const FEHLERSTELLEN_KAPPE = 300;

/** Höchstens so viele getippte Zeilen werden gespeichert (freier Modus). */
export const GETIPPT_ZEILEN_KAPPE = 600;

/** Höchstens so viele Zeichen je getippter Zeile (freier Modus, Kappung). */
export const GETIPPT_ZEILE_ZEICHEN_KAPPE = 200;

/** Eine Taste in der Auswertung einer Schreibprobe. */
export interface TastenZeile {
  /** Das Soll-Zeichen (klein) oder `⇧` für die Umschalttaste. */
  zeichen: string;
  /** So oft war die Taste dran. */
  dran: number;
  /** So oft wurde daneben gegriffen. */
  fehler: number;
  /** Treffsicherheit 0..1. */
  quote: number;
  /** Mittlere Anschlagszeit in ms (null = nicht gemessen). */
  schnittMs: number | null;
}

/**
 * Ab wann heißt eine Taste in DIESER Probe „wacklig"?
 *
 * ⚠️ Bewusst andere Schwellen als `letterLevel`: Dort wird über 60 Anschläge
 * geurteilt, hier über die paar Anschläge einer Probe. Wer die 60er-Regel auf
 * zehn Anschläge anwendet, macht aus einem einzigen Vergreifer eine Diagnose
 * ([[feedback_gruener_waechter_beweist_was]] - was misst die Kennzahl wirklich?).
 *
 * Darum zwei Bedingungen, und beide müssen gelten:
 *  • die Taste war mindestens {@link WACKLIG_MIND_DRAN} mal dran (sonst ist es
 *    Zufall),
 *  • und blieb unter {@link WACKLIG_QUOTE} Treffsicherheit.
 */
export const WACKLIG_MIND_DRAN = 3;
export const WACKLIG_QUOTE = 0.9;

/** Das fertige Ergebnis EINER Schreibprobe EINES Kindes. */
export interface Probenergebnis {
  /** Zu welcher Schreibprobe der Klasse gehört das Ergebnis. */
  probeId: string;
  niveau: ProbenNiveau;
  /**
   * ★ E1 (24.09.2026): der Lernweg des Plans, aus dem Niveau und Text stammen.
   * Fehlt er, gilt „de" (jedes Ergebnis davor); geschrieben wird nur „en".
   * Gelesen über `lernwegVon(ergebnis)`.
   */
  lernweg?: Lernweg;
  /** 0-basierter Index des Textes (Anzeige über `textBezeichnung`). */
  textNr: number;
  /** Titel des Textes - mitgeschrieben, damit niemand nachschlagen muss. */
  textTitel: string;
  /**
   * ★★ Ab welcher Zeile des Textes `textNr` die Challenge begann (0-basiert,
   * Texte sparen seit 10.09.2026). Bei älteren Ergebnissen 0.
   */
  startZeile: number;
  /**
   * ★★ Wo das Kind aufgehört hat: Text und Zeile, an der es zuletzt stand -
   * auch wenn sie schon im nächsten Text lag. Daraus rechnet
   * `naechsterStart`, wo die nächste Challenge dieses Niveaus beginnt.
   */
  endeTextNr: number;
  endeZeile: number;
  /** Erster Tastendruck (ms seit 1970). */
  beginnMs: number;
  /** Ende der Probe (ms seit 1970). */
  endeMs: number;
  /** Gewährte Prüfungszeit in ms (Grundzeit plus Zuschlag). */
  zeitMs: number;
  /** Gewährter Zeitzuschlag in Prozent (0 = keiner). */
  zuschlagProzent: number;
  /**
   * Abgezogene Vorlesezeit in ms (die gemessene Hälfte der Lesezeit). Seit F1c
   * (18.09.2026) mit dem Zuhören vor dem ersten Anschlag jeder Zeile.
   */
  wartezeitMs: number;
  /**
   * ★ F1c (18.09.2026): Zeilenwechsel-Pausen in ms - Zeit der App, von der
   * Prüfungsuhr abgezogen (`eineMessart.ts`).
   *
   * ⚠️ Zugleich das MERKMAL der Messart: Steht es im Ergebnis, ist
   * {@link schreibMs} Prüfungsuhr − Zuhören − Zeilenwechsel. Fehlt es (alle
   * Ergebnisse vor F1c), ist `schreibMs` die Summe der Zeilenzeiten - ohne die
   * Zeit vor dem ersten Anschlag jeder Zeile. Die gespeicherten Anschläge je
   * Minute solcher alten Ergebnisse werden NICHT neu gerechnet: Ihr
   * `wartezeitMs` enthält die Zeilenansagen nicht, eine Neuberechnung nach der
   * Uhr träfe also genau die Kinder mit Sprachausgabe.
   */
  zeilenwechselMs?: number;
  /** Richtig geschriebene Soll-Zeichen (mit Leerzeichen). */
  zeichen: number;
  /** Fehlanschläge insgesamt. */
  fehler: number;
  /** Fertig geschriebene Zeilen. */
  zeilen: number;
  /**
   * Schreibzeit in ms - Grundlage für {@link Probenergebnis.anschlaege}. Seit
   * F1c die Prüfungsuhr (erster Anschlag bis Abgabe, höchstens die gewährte
   * Zeit) minus Zuhören minus Zeilenwechsel; Überlegen zählt. Davor die Summe
   * der Zeilenzeiten (siehe {@link zeilenwechselMs}).
   */
  schreibMs: number;
  /** Anschläge je Minute (richtige Zeichen / Schreibzeit). */
  anschlaege: number;
  /** Treffsicherheit 0..1. */
  genauigkeit: number;
  /** Jede Taste, die dran war - schwächste zuerst. */
  tasten: TastenZeile[];
  /** Nur die wackligen daraus (siehe {@link WACKLIG_QUOTE}). */
  wacklig: TastenZeile[];
  /** Auf welcher Tastaturbelegung geschrieben wurde ("de" | "ch" | "us" | "uk"). */
  layout: string;
  /** War der Text vor der Zeit zu Ende? */
  textZuEnde: boolean;
  /** Hat das Kind selbst abgegeben, bevor die Zeit um war? */
  frueherAbgegeben: boolean;
  /**
   * ★★★ DIE WERTUNG (10.09.2026) - Güte, Tempo-Anteil und der Leistungswert
   * 0..100, nach den Regeln gängiger Tastschreib-Wettkämpfe
   * (`schreibprobeWertung.ts`, Recherche in
   * `RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md`).
   *
   * ⚠️ Gespeichert wird der WERT, nicht der Rang. Der Rang hängt davon ab, wer
   * sonst noch mitgeschrieben hat - er taugt darum nicht, um den eigenen
   * Fortschritt über mehrere Tippchallenges zu verfolgen. Gerechnet wird er
   * beim Anzeigen, aus den Werten der ganzen Klasse.
   */
  wertung: Wertung;

  // ── „Freies Schreiben" (23.09.2026) - ALLE optional, damit ältere
  // Ergebnisse und der strenge Modus (der Normalfall) diese Felder einfach
  // nicht tragen (siehe `SchreibprobePlan.modus` für die Begründung der
  // 2000-Byte-Grenze; hier zählt dasselbe für die Grösse des gespeicherten
  // Ergebnisses). ────────────────────────────────────────────────────────────
  /** „frei" = Freies Schreiben; fehlt ⇒ streng (wie bisher). */
  modus?: "frei";
  /**
   * Rücktasten im freien Modus - nur zur AUSKUNFT, geht in KEINE Wertung ein.
   * Im strengen Modus gibt es keine Rücktaste, das Feld bleibt dort weg.
   */
  korrekturen?: number;
  /**
   * Fehlgriffe im freien Modus, AUCH ausgebesserte - nur zur Auskunft.
   *
   * ⚠️ NICHT dasselbe wie {@link fehler}: Im freien Modus bedeutet `fehler`
   * „stehengeblieben" (das, was gewertet wird); `fehlgriffe` zählt JEDEN
   * Vergreifer, auch den, der noch mit der Rücktaste ausgebessert wurde.
   */
  fehlgriffe?: number;
  /**
   * Fehlerarten im freien Modus - Schlüssel `falsch`/`fehlend`/`ueberzaehlig`/
   * `leerzeichen`, Wert die Anzahl. Nur zur Auskunft (Kind-Karte, Rangliste).
   */
  fehlerArten?: Record<string, number>;
  /**
   * Die Fehlerstellen im freien Modus - Original gegen Eingabe, für die
   * Auswertungs-Ansicht „Fehlerstellen". Gekappt auf {@link FEHLERSTELLEN_KAPPE}.
   */
  fehlerStellen?: FehlerStelle[];
  /**
   * Die abgegebenen Ist-Zeilen im freien Modus - Voraussetzung für „Original
   * gegen Eingabe" in der Auswertung (Bauplan §7 Punkt 8). Gekappt auf
   * {@link GETIPPT_ZEILEN_KAPPE} Zeilen, je Zeile höchstens
   * {@link GETIPPT_ZEILE_ZEICHEN_KAPPE} Zeichen.
   */
  getippt?: string[];
}

export interface AuswertungEingang {
  probeId: string;
  niveau: ProbenNiveau;
  /** ★ E1: der Lernweg des Plans (fehlt ⇒ „de"). */
  lernweg?: Lernweg;
  textNr: number;
  textTitel: string;
  /** Fehlt sie, begann die Challenge am Textanfang. */
  startZeile?: number;
  /** Fehlt das Ende, wird es aus Startzeile und fertigen Zeilen gezählt. */
  endeTextNr?: number;
  endeZeile?: number;
  beginnMs: number;
  endeMs: number;
  zeitMs: number;
  zuschlagProzent: number;
  wartezeitMs: number;
  /** ★ F1c - siehe {@link Probenergebnis.zeilenwechselMs}. */
  zeilenwechselMs?: number;
  /** Soll-Zeichen der fertigen Zeilen plus der angefangenen. */
  zeichen: number;
  fehler: number;
  zeilen: number;
  schreibMs: number;
  /** Alle Anschläge der Probe, in der Reihenfolge, in der sie fielen. */
  anschlaege: readonly KeyEvent[];
  layout: string;
  textZuEnde: boolean;
  frueherAbgegeben: boolean;

  // ── „Freies Schreiben" (23.09.2026) - siehe {@link Probenergebnis}. ────────
  /** „frei" = Freies Schreiben; fehlt ⇒ streng (wie bisher). */
  modus?: "frei";
  /** Rücktasten im freien Modus - nur zur Auskunft. */
  korrekturen?: number;
  /** Fehlgriffe im freien Modus, AUCH ausgebesserte - nur zur Auskunft. */
  fehlgriffe?: number;
  /** Fehlerarten im freien Modus - Schlüssel falsch/fehlend/ueberzaehlig/leerzeichen. */
  fehlerArten?: Record<string, number>;
  /** Fehlerstellen im freien Modus - wird auf {@link FEHLERSTELLEN_KAPPE} gekappt. */
  fehlerStellen?: FehlerStelle[];
  /** Die abgegebenen Ist-Zeilen im freien Modus - wird gekappt, siehe {@link GETIPPT_ZEILEN_KAPPE}. */
  getippt?: string[];
}

/**
 * Anschläge je Minute.
 *
 * ⚠️ Bewusst NICHT die „Nettoanschläge" des Wettschreibens (brutto minus zehn
 * Anschläge je Fehler). Diese Formel kann negativ werden, und eine negative
 * Leistungszahl ist eine Aussage GEGEN ein Kind
 * ([[feedback_nie_gegen_das_kind]]). Fehler stehen daneben, in einer eigenen
 * Zahl, die man lesen kann, ohne dass sie die andere auffrisst.
 */
export function anschlaegeProMinute(zeichen: number, schreibMs: number): number {
  if (!(schreibMs > 0) || !(zeichen > 0)) return 0;
  return Math.round((zeichen / schreibMs) * 60_000);
}

/** Treffsicherheit 0..1 - Soll-Zeichen gegen Soll-Zeichen plus Fehlgriffe. */
export function genauigkeitVon(zeichen: number, fehler: number): number {
  const gesamt = zeichen + fehler;
  if (!(gesamt > 0)) return 0;
  return zeichen / gesamt;
}

/**
 * Die Tasten-Auflistung aus den Anschlägen einer Probe.
 *
 * Leerzeichen bleiben draußen: Sie sind in jeder Zeile die häufigste Taste und
 * würden die Liste anführen, ohne je etwas über das Können zu sagen. Die
 * Umschalttaste bleibt DRIN - an ihr scheitern echte Anschläge, und die
 * Gegenhand-Regel macht sie zu einer der schwierigeren Tasten.
 */
export function tastenAuflistung(anschlaege: readonly KeyEvent[]): TastenZeile[] {
  const roh = new Map<string, { dran: number; fehler: number; sumMs: number; timed: number }>();
  for (const ev of anschlaege) {
    const c = ev.char;
    if (!c || c === " ") continue;
    let s = roh.get(c);
    if (!s) {
      s = { dran: 0, fehler: 0, sumMs: 0, timed: 0 };
      roh.set(c, s);
    }
    s.dran += 1;
    if (!ev.correct) s.fehler += 1;
    else if (typeof ev.ms === "number" && ev.ms > 0) {
      s.sumMs += ev.ms;
      s.timed += 1;
    }
  }
  const zeilen: TastenZeile[] = [];
  for (const [zeichen, s] of roh) {
    zeilen.push({
      zeichen,
      dran: s.dran,
      fehler: s.fehler,
      quote: s.dran > 0 ? (s.dran - s.fehler) / s.dran : 0,
      schnittMs: s.timed > 0 ? Math.round(s.sumMs / s.timed) : null,
    });
  }
  // Schwächste zuerst; bei gleicher Quote die häufigere Taste - sie wiegt mehr.
  zeilen.sort((a, b) => a.quote - b.quote || b.dran - a.dran || a.zeichen.localeCompare(b.zeichen, "de"));
  return zeilen;
}

/** Nur die wackligen Tasten (Definition siehe oben). */
export function wackligeTasten(tasten: readonly TastenZeile[]): TastenZeile[] {
  return tasten.filter((t) => t.dran >= WACKLIG_MIND_DRAN && t.quote < WACKLIG_QUOTE);
}

/** Die getippten Zeilen kappen (freier Modus) - siehe {@link Probenergebnis.getippt}. */
function kappeGetippt(zeilen: readonly string[]): string[] {
  return zeilen
    .slice(0, GETIPPT_ZEILEN_KAPPE)
    .map((z) => z.slice(0, GETIPPT_ZEILE_ZEICHEN_KAPPE));
}

export function werteAus(e: AuswertungEingang): Probenergebnis {
  const tasten = tastenAuflistung(e.anschlaege);
  const apm = anschlaegeProMinute(e.zeichen, e.schreibMs);
  // ⚠️ Der Zuschlag greift NUR, wo nichts gemessen wurde - sonst zählte die
  // Lesezeit zweimal (`wirksamerZuschlag` erklärt es).
  const zuschlag = wirksamerZuschlag(e.zuschlagProzent, true, e.wartezeitMs);
  const startZeile = Math.max(0, Math.round(e.startZeile ?? 0));
  // ★ 23.09.2026: wehrhaft wie überall - alles ausser genau "frei" ⇒ streng.
  const modus = e.modus === "frei" ? ("frei" as const) : undefined;
  return {
    probeId: e.probeId,
    niveau: e.niveau,
    // ★ E2a: wehrhaft wie `modus` oben - ein gültiger Weg AUSSER „de" zählt
    // (jetzt auch „fr"), alles andere ist „de". Vorher stand hier
    // `=== "en" ? "en" : ...` - das hätte „fr" still verworfen.
    ...(istLernweg(e.lernweg) && e.lernweg !== "de" ? { lernweg: e.lernweg } : {}),
    textNr: e.textNr,
    textTitel: e.textTitel,
    startZeile,
    endeTextNr: e.endeTextNr ?? e.textNr,
    // Ohne gemeldetes Ende: gezählt ab der Startzeile. Über das Textende hinaus
    // rechnet `normiereStelle` beim Lesen richtig in den nächsten Text.
    endeZeile: Math.max(0, Math.round(e.endeZeile ?? startZeile + e.zeilen)),
    beginnMs: e.beginnMs,
    endeMs: e.endeMs,
    zeitMs: e.zeitMs,
    zuschlagProzent: e.zuschlagProzent,
    wartezeitMs: Math.max(0, Math.round(e.wartezeitMs)),
    ...(e.zeilenwechselMs !== undefined
      ? { zeilenwechselMs: Math.max(0, Math.round(e.zeilenwechselMs)) }
      : {}),
    zeichen: Math.max(0, Math.round(e.zeichen)),
    // ★ Im freien Modus bedeutet `fehler` „stehengeblieben" (siehe
    // {@link Probenergebnis.fehlgriffe} für den Unterschied) - gezählt wird
    // hier trotzdem einfach das, was hereinkommt: Was „fehler" in diesem Lauf
    // bedeutet, entscheidet der Aufrufer über den Modus, nicht diese Funktion.
    fehler: Math.max(0, Math.round(e.fehler)),
    zeilen: Math.max(0, Math.round(e.zeilen)),
    schreibMs: Math.max(0, Math.round(e.schreibMs)),
    anschlaege: apm,
    genauigkeit: genauigkeitVon(e.zeichen, e.fehler),
    wertung: werte({
      zeichen: e.zeichen,
      fehler: e.fehler,
      anschlaege: apm,
      zuschlagProzent: zuschlag,
      modus,
    }),
    tasten,
    wacklig: wackligeTasten(tasten),
    layout: e.layout || "de",
    textZuEnde: e.textZuEnde,
    frueherAbgegeben: e.frueherAbgegeben,
    ...(modus ? { modus } : {}),
    ...(e.korrekturen !== undefined
      ? { korrekturen: Math.max(0, Math.round(e.korrekturen)) }
      : {}),
    ...(e.fehlgriffe !== undefined ? { fehlgriffe: Math.max(0, Math.round(e.fehlgriffe)) } : {}),
    ...(e.fehlerArten ? { fehlerArten: { ...e.fehlerArten } } : {}),
    ...(e.fehlerStellen ? { fehlerStellen: e.fehlerStellen.slice(0, FEHLERSTELLEN_KAPPE) } : {}),
    ...(e.getippt ? { getippt: kappeGetippt(e.getippt) } : {}),
  };
}

// ── Was davon gespeichert wird ──────────────────────────────────────────────

/**
 * Die gespeicherte Fassung eines Ergebnisses.
 *
 * ⚠️ Die volle Tasten-Auflistung wird MITGESPEICHERT, aber gekappt: Ein Niveau
 * „alles" hat über 70 Tasten, und der Datensatz soll auch nach zwanzig
 * Schreibproben noch handlich sein. Gespeichert werden die {@link TASTEN_KAPPE}
 * schwächsten - die starken Tasten sagen nichts, was die Gesamtquote nicht
 * schon sagt.
 */
export const TASTEN_KAPPE = 20;

export function fuersSpeichern(r: Probenergebnis): Probenergebnis {
  return { ...r, tasten: r.tasten.slice(0, TASTEN_KAPPE) };
}

/**
 * Ein gespeichertes Ergebnis zurücklesen - wehrhaft, wie alles, was vom Server
 * kommt. Ein kaputter Datensatz gibt `null` und verschwindet aus der Liste,
 * statt eine Statistik zum Absturz zu bringen.
 */
export function ergebnisAusJson(roh: unknown): Probenergebnis | null {
  if (!roh || typeof roh !== "object") return null;
  const o = roh as Record<string, unknown>;
  const probeId = typeof o.probeId === "string" ? o.probeId : "";
  if (!probeId) return null;
  const niveau = o.niveau as ProbenNiveau;
  if (typeof niveau !== "string") return null;
  const textNr = num(o.textNr);
  if (!(textNr >= 0 && textNr < PROBEN_JE_NIVEAU)) return null;
  const tasten = Array.isArray(o.tasten)
    ? o.tasten
        .map((t) => tastenZeileAusJson(t))
        .filter((t): t is TastenZeile => t !== null)
    : [];
  // ★ Ältere Ergebnisse (vor dem 10.09.2026 abends) haben weder Startzeile
  // noch Ende: Sie begannen am Textanfang und endeten nach ihren fertigen
  // Zeilen. Unsinn wird genauso ersetzt - ein Ende darf nie erfunden weit
  // hinten liegen, sonst übersprünge die nächste Challenge ungelesene Zeilen.
  const startZeile = ganzeZahlIm(o.startZeile, ZEILE_GROESST) ?? 0;
  // ★ 23.09.2026: wehrhaft wie überall - alles ausser genau "frei" ⇒ streng.
  const modus = o.modus === "frei" ? ("frei" as const) : undefined;
  return {
    probeId,
    niveau,
    // ★ E2a: wehrhaft - ein gültiger Weg AUSSER „de" zählt (jetzt auch „fr"),
    // alles andere ist „de". Vorher: nur ein exaktes „en" zählte.
    ...(istLernweg(o.lernweg) && o.lernweg !== "de" ? { lernweg: o.lernweg } : {}),
    textNr,
    textTitel: typeof o.textTitel === "string" ? o.textTitel : "",
    startZeile,
    endeTextNr: ganzeZahlIm(o.endeTextNr, PROBEN_JE_NIVEAU - 1) ?? textNr,
    endeZeile:
      ganzeZahlIm(o.endeZeile, ZEILE_GROESST) ?? startZeile + Math.max(0, Math.round(num(o.zeilen))),
    beginnMs: num(o.beginnMs),
    endeMs: num(o.endeMs),
    zeitMs: num(o.zeitMs),
    zuschlagProzent: num(o.zuschlagProzent),
    wartezeitMs: num(o.wartezeitMs),
    ...(typeof o.zeilenwechselMs === "number" && Number.isFinite(o.zeilenwechselMs)
      ? { zeilenwechselMs: Math.max(0, o.zeilenwechselMs) }
      : {}),
    zeichen: num(o.zeichen),
    fehler: num(o.fehler),
    zeilen: num(o.zeilen),
    schreibMs: num(o.schreibMs),
    anschlaege: num(o.anschlaege),
    genauigkeit: num(o.genauigkeit),
    tasten,
    wacklig: wackligeTasten(tasten),
    layout: typeof o.layout === "string" ? o.layout : "de",
    textZuEnde: o.textZuEnde === true,
    frueherAbgegeben: o.frueherAbgegeben === true,
    // ★ Die Wertung wird NEU GERECHNET, nicht aus dem Datensatz geglaubt.
    // Grund: Sie ist eine reine Funktion von Zeichen, Fehlern, Anschlägen UND
    // Modus - und wenn die Formel (oder ihr Fehlergewicht) sich einmal ändert,
    // sollen ALTE Ergebnisse nach der neuen Formel dastehen, nicht zwei
    // Jahrgänge nach zwei Regeln.
    wertung: werte({
      zeichen: num(o.zeichen),
      fehler: num(o.fehler),
      anschlaege: num(o.anschlaege),
      zuschlagProzent: wirksamerZuschlag(num(o.zuschlagProzent), true, num(o.wartezeitMs)),
      modus,
    }),
    // ── „Freies Schreiben" (23.09.2026) - jedes Feld einzeln wehrhaft: kaputt
    // oder fehlt ⇒ weglassen, nie erfinden. ────────────────────────────────
    ...(modus ? { modus } : {}),
    ...(typeof o.korrekturen === "number" && Number.isFinite(o.korrekturen)
      ? { korrekturen: Math.max(0, Math.round(o.korrekturen)) }
      : {}),
    ...(typeof o.fehlgriffe === "number" && Number.isFinite(o.fehlgriffe)
      ? { fehlgriffe: Math.max(0, Math.round(o.fehlgriffe)) }
      : {}),
    ...(() => {
      const fa = fehlerArtenAusJson(o.fehlerArten);
      return fa ? { fehlerArten: fa } : {};
    })(),
    ...(() => {
      const fs = fehlerStellenAusJson(o.fehlerStellen);
      return fs ? { fehlerStellen: fs } : {};
    })(),
    ...(() => {
      const g = getipptAusJson(o.getippt);
      return g ? { getippt: g } : {};
    })(),
  };
}

/** Die Fehlerarten aus JSON lesen - wehrhaft: nur echte Zahlen bleiben stehen. */
function fehlerArtenAusJson(roh: unknown): Record<string, number> | undefined {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return undefined;
  const out: Record<string, number> = {};
  for (const [art, wert] of Object.entries(roh as Record<string, unknown>)) {
    if (typeof wert === "number" && Number.isFinite(wert)) out[art] = wert;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Die Fehlerstellen aus JSON lesen - wehrhaft, gekappt auf {@link FEHLERSTELLEN_KAPPE}. */
function fehlerStellenAusJson(roh: unknown): FehlerStelle[] | undefined {
  if (!Array.isArray(roh)) return undefined;
  const out: FehlerStelle[] = [];
  for (const x of roh) {
    if (out.length >= FEHLERSTELLEN_KAPPE) break;
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    const art = typeof o.art === "string" ? o.art : "";
    if (!art) continue;
    out.push({
      zeile: num(o.zeile),
      soll: typeof o.soll === "string" ? o.soll : "",
      ist: typeof o.ist === "string" ? o.ist : "",
      art,
    });
  }
  return out.length ? out : undefined;
}

/** Die getippten Zeilen aus JSON lesen - wehrhaft, gekappt wie {@link kappeGetippt}. */
function getipptAusJson(roh: unknown): string[] | undefined {
  if (!Array.isArray(roh)) return undefined;
  const zeilen = kappeGetippt(roh.filter((x): x is string => typeof x === "string"));
  return zeilen.length ? zeilen : undefined;
}

function tastenZeileAusJson(roh: unknown): TastenZeile | null {
  if (!roh || typeof roh !== "object") return null;
  const o = roh as Record<string, unknown>;
  const zeichen = typeof o.zeichen === "string" ? o.zeichen : "";
  if (!zeichen) return null;
  const dran = num(o.dran);
  const fehler = num(o.fehler);
  return {
    zeichen,
    dran,
    fehler,
    quote: dran > 0 ? (dran - fehler) / dran : 0,
    schnittMs: typeof o.schnittMs === "number" ? o.schnittMs : null,
  };
}

function num(x: unknown): number {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : 0;
}

/** Eine ganze Zahl von 0 bis `bis` - oder `null`, wenn es keine ist. */
function ganzeZahlIm(x: unknown, bis: number): number | null {
  if (typeof x !== "number" || !Number.isInteger(x) || x < 0 || x > bis) return null;
  return x;
}

/** Wo dieses Kind aufgehört hat - so, wie `naechsterStart` es braucht. */
export function endeVon(e: Probenergebnis): ProbenEnde {
  return { probeId: e.probeId, textNr: e.endeTextNr, zeile: e.endeZeile };
}

/**
 * Lesbarer Name einer Taste in der Auswertung („Leertaste", „Umschalt", sonst
 * das Zeichen). Englisch (EN5, Glossar §3.5): „Shift", „Space bar" - gross
 * am Anfang, weil der Name allein am Zeilenanfang steht.
 */
export function tastenName(zeichen: string, sprache: BedienSprache = "de"): string {
  if (zeichen === SHIFT_UNIT) return TASTEN_NAMEN[sprache].umschalt;
  if (zeichen === " ") return TASTEN_NAMEN[sprache].leer;
  return zeichen;
}

/**
 * ★ E11a-5 (26.09.2026, Falle 30): Tabelle statt `sprache === "en" ? … :
 * Deutsch`. Französisch nach Glossar §9.2 - so steht es auf der Taste:
 * „Maj", „Espace".
 */
const TASTEN_NAMEN: Record<BedienSprache, { umschalt: string; leer: string }> = {
  de: { umschalt: "Umschalt", leer: "Leertaste" },
  en: { umschalt: "Shift", leer: "Space bar" },
  fr: { umschalt: "Maj", leer: "Espace" },
  // ★ ES-O (27.09.2026): so steht es auf der spanischen Taste (Bauplan S13).
  es: { umschalt: "Mayús", leer: "Barra espaciadora" },
  // ★ O-IT (02.10.2026): so steht es auf der italienischen Taste (Glossar §2.9).
  it: { umschalt: "Maiusc", leer: "Barra spaziatrice" },
  // ★ O-PL (02.10.2026): Kappe „Shift", Leertaste „Spacja" (Glossar §2.9;
  // gross, weil der Name allein am Zeilenanfang steht).
  pl: { umschalt: "Shift", leer: "Spacja" },
  // ★ O-TR (02.10.2026): Kappe "Shift", Leertaste "Boşluk çubuğu" (Glossar
  // §2.9; gross, weil der Name allein am Zeilenanfang steht).
  tr: { umschalt: "Shift", leer: "Boşluk çubuğu" },
  // ★ O-CS (03.10.2026): Kappe „Shift", Leertaste „Mezerník" (Glossar §2.9;
  // gross, weil der Name allein am Zeilenanfang steht).
  cs: { umschalt: "Shift", leer: "Mezerník" },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: { umschalt: "Shift", leer: "Интервал" },
  el: { umschalt: "Shift", leer: "Πλήκτρο διαστήματος" },
  hu: { umschalt: "Shift", leer: "Szóköz" },
  nl: { umschalt: "Shift", leer: "Spatiebalk" },
  pt: { umschalt: "Shift", leer: "Barra de espaço" },
  br: { umschalt: "Shift", leer: "Barra de espaço" },
  ro: { umschalt: "Shift", leer: "Bara de spațiu" },
  sv: { umschalt: "Skift", leer: "Mellanslag" },
  uk: { umschalt: "Shift", leer: "Пробіл" },
};
