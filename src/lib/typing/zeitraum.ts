/**
 * ★★ Der Zeitraum der Lernenden-Tabelle (01.09.2026).
 *
 * Johannes, wörtlich: *„dieser kopf soll bei der schülerstatistik-Tabelle sein
 * nicht beim streifen, der streifen bleibt immer beim schuljahr und nur bei der
 * ganzen klasse"* - und zum Kopf selbst: *„die Wochenpfeiltasten sind gut, aber
 * vielleicht links, und mittig ein schalter, schuljahr, und rechts ein schalter
 * gesamt"*.
 *
 * ── Warum das so wenig Code ist ────────────────────────────────────────────
 * `computePupilStats` ist eine REINE Funktion über die Übungs-Ereignisse. Ein
 * Zeitraum ist damit nichts als ein Filter davor: Ereignisse aussieben, und
 * jede Zahl der Tabelle - Anschläge, Treffsicherheit, geübte Zeit, zuletzt -
 * gilt von selbst für diesen Ausschnitt. Es entsteht keine zweite Rechnung, die
 * mit der ersten auseinanderlaufen könnte.
 *
 * ── ⚠️ EINE Wochengrenze, nicht zwei ───────────────────────────────────────
 * Die Woche hängt seit N6 am Unterrichtstag der Klasse, nicht am Montag
 * (`wochenStartFuerTag`). Diese Datei rechnet das NICHT nach, sondern ruft
 * dieselbe Funktion. Zwei Stellen, die dasselbe eigenständig rechnen, sind in
 * diesem Projekt schon mehrfach auseinandergelaufen
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── ⚠️ „Schuljahr" und „Gesamt" können gleich aussehen ─────────────────────
 * Im ersten Jahr sind beide meist zahlengleich - die Klassen haben im August
 * angefangen. Sie sind trotzdem nicht dasselbe: Wer im Sommer als
 * selbstlernendes Konto geübt hat, hat Ereignisse VOR dem Schuljahr, und ab dem
 * nächsten August trennen sich die beiden dauerhaft. Damit niemand zwei
 * Schalter für einen Fehler hält, sagt der Kopf es, wenn beide dasselbe zeigen.
 */
import type { TaskEvent } from "./account";
import type { BedienSprache } from "../bedienSprache/sprache";
import { schuljahrVon } from "./jahreskarte";
import { fmtTagMonat, itPrepTag } from "./datum";
import type { Wochenrhythmus } from "./wochenrhythmus";
import { wochenStartFuerTag } from "./wochenrhythmus";
import { mitRueckfallEn, type GeruestSprache } from "./sprachRegister";
import { istGeruestSprache } from "./sprachRegister";
import { KETTEN_NEUN } from "./kettenNeun";
import { GEBIET } from "../bedienSprache/texte";

export type ZeitraumArt = "woche" | "monat" | "schuljahr" | "gesamt";

/** Wie viele Wochen ein „Monat" umfasst - siehe Kopf-Kommentar unten (K4, 19.09.2026). */
const MONAT_WOCHEN = 4;

export interface Zeitraum {
  art: ZeitraumArt;
  /**
   * Nur bei `woche`: 0 = diese Woche, -1 = vorige, +1 = nächste. Bleibt beim
   * Umschalten auf Schuljahr/Gesamt stehen, damit die Pfeiltasten dorthin
   * zurückführen, wo man war.
   */
  wochenVersatz: number;
  /**
   * ★ Nur bei `schuljahr`: 0 = dieses Schuljahr, -1 = das davor (01.09.2026).
   *
   * Johannes: *„Wenn Schuljahr aktiv ist muss links das Schuljahr ausgewählt
   * werden können und bei den Pfeilen muss voriges Schuljahr und nächstes
   * Schuljahr erscheinen."* Eigene Zahl und nicht `wochenVersatz`
   * mitbenutzt: Wer ein Jahr zurückblättert und wieder auf „Woche" schaltet,
   * soll dort stehen, wo er war - die beiden Zeiträume merken sich ihre
   * Stelle getrennt.
   */
  jahrVersatz?: number;
  /**
   * ★ K4 (19.09.2026): Nur bei `monat` - 0 = die letzten 4 Wochen (bis
   * einschliesslich der laufenden), -1 = die 4 Wochen davor, +1 = die 4
   * danach. Johannes: *„das Monat ist ein wichtiger Wert"* - entschieden
   * (im Chat gesagt): „Monat" heisst die letzten 4 Ziel-Wochen (Montag 08:00,
   * `WOCHENZIEL_GRENZE`), NICHT der Kalendermonat. Eigene Zahl wie
   * `jahrVersatz`, aus demselben Grund: Wer in „Monat" blättert und wieder
   * auf „Woche" schaltet, soll dort stehen bleiben, wo er in der Woche war.
   */
  monatVersatz?: number;
  /**
   * ★ D2 (28.09.2026): der Beginn des Schuljahres der Klasse (Monat 1-12,
   * `schuljahrBeginn.ts`) - wirkt nur bei `schuljahr`. KEIN Zustand der
   * Oberfläche, sondern eine Eigenschaft der Klasse: Die Stelle, die den
   * Zeitraum hält, setzt ihn dazu (`{ ...zeitraum, schuljahrBeginn }`), und
   * jede Rechnung dahinter (`grenzen`, Titel, Vergleich, Excel) nimmt ihn von
   * hier - statt eines zusätzlichen Parameters an zwanzig Stellen. Fehlt er,
   * gilt der 1. August wie vor D2.
   */
  schuljahrBeginn?: number;
}

export const ZEITRAUM_START: Zeitraum = { art: "woche", wochenVersatz: 0, jahrVersatz: 0 };

/**
 * ★ Womit die LERNENDEN-TABELLE aufgeklappt wird (18.09.2026).
 *
 * Johannes, wörtlich: *„Bei der Bewertung der Schülertabelle soll standardmäßig
 * immer das Schuljahr und nicht die Woche ausgewählt sein."* `ZEITRAUM_START`
 * selbst bleibt unverändert - das Excel-Blatt „Woche" (`leistungExport.ts`)
 * verlässt sich auf `art: "woche"` als Grundstellung. Diese Konstante gilt
 * NUR für den ersten Zustand der Lernenden-Tabellen - Tastenflow und (seit
 * demselben Abend, Johannes: „ja") Punktgenau. Umschalten auf „Woche" bleibt
 * jederzeit möglich, nur eben nicht mehr der Ausgangspunkt.
 */
export const ZEITRAUM_VORGABE_TABELLE: Zeitraum = { ...ZEITRAUM_START, art: "schuljahr" };

/**
 * Das Schuljahr, `versatz` Jahre von dem entfernt, in dem `jetztMs` liegt.
 * Gerechnet wird über die Grenzen, nicht über die Jahreszahl - ein Schuljahr
 * beginnt am 1. August, und wer ein Jahr abzieht, landet sonst im falschen.
 */
/**
 * ★ O-TR (03.10.2026): das Schuljahr in türkischer Schreibweise - „2026-2027"
 * statt „2026/27". In der Türkei steht das Schuljahr mit Bindestrich und zwei
 * vollen Jahreszahlen („2026-2027 eğitim öğretim yılı", MEB); ein Schrägstrich
 * zwischen Zahlen liest die Sprachausgabe als „bölü" (Glossar Regel 6). Jede
 * andere Form kommt unverändert zurück.
 */
export function schuljahrLabelTr(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}-${m[1].slice(0, 2)}${m[2]}` : label;
}

/**
 * ★ O-CS (03.10.2026): das Schuljahr in tschechischer Schreibweise -
 * „2026/2027" statt „2026/27". Das MŠMT schreibt „školní rok 2026/2027" mit
 * zwei vollen Jahreszahlen; mit Schrägstrich, weil ein Bindestrich zwischen zwei
 * Zahlen als „minus" gelesen werden kann (die Sprachausgabe liest „/" als
 * „lomeno" - so steht es auch in jedem tschechischen Schulbrief). Jede andere
 * Form kommt unverändert zurück.
 */
export function schuljahrLabelCs(label: string): string {
  const m = /^(\d{4})\/(\d{2})$/.exec(label);
  return m ? `${m[1]}/${m[1].slice(0, 2)}${m[2]}` : label;
}

export function schuljahrVersetzt(jetztMs: number, versatz: number, beginnMonat?: number) {
  let sj = schuljahrVon(jetztMs, beginnMonat);
  for (let i = 0; i < Math.abs(versatz); i += 1)
    sj = schuljahrVon(versatz < 0 ? sj.vonMs - 1 : sj.bisMs + 1, beginnMonat);
  return sj;
}


/**
 * Anfang und Ende (beide in ms, `bisMs` einschliesslich) des Zeitraums.
 * `gesamt` hat keine Grenzen - dort wird nichts ausgesiebt.
 */
export function grenzen(
  z: Zeitraum,
  jetztMs: number,
  rhythmus: Wochenrhythmus | null,
): { vonMs: number; bisMs: number } | null {
  if (z.art === "gesamt") return null;
  if (z.art === "schuljahr") {
    const sj = schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn);
    return { vonMs: sj.vonMs, bisMs: sj.bisMs };
  }
  if (z.art === "monat") {
    /*
     * ★ K4: die letzten {@link MONAT_WOCHEN} Ziel-Wochen, endend mit der
     * Woche, die `monatVersatz` trifft - dieselbe Rechnung wie bei `woche`
     * (Blättern in 4-Wochen-Schritten), nur um drei weitere Wochen nach
     * vorn ausgedehnt. Keine zweite Wochengrenze: `wochenStartFuerTag` ist
     * dieselbe EINE Quelle wie überall in dieser Datei.
     */
    // ★ Abnahme K4 (19.09.2026): in KALENDERTAGEN verschoben, nicht in
    // festen Millisekunden - sonst liegt die Grenze in der Woche der
    // Zeitumstellung eine Stunde neben Montag 8:00 (dieselbe Technik wie
    // `wocheVerschieben` in wochenziel.ts).
    const endeStart = wochenStartFuerTag(
      tageVerschieben(jetztMs, (z.monatVersatz ?? 0) * MONAT_WOCHEN * 7),
      rhythmus,
    );
    return {
      vonMs: tageVerschieben(endeStart, -(MONAT_WOCHEN - 1) * 7),
      bisMs: tageVerschieben(endeStart, 7) - 1,
    };
  }
  // ★ Die Wochengrenze kommt aus der EINEN Quelle - siehe Kopf dieser Datei.
  const start = wochenStartFuerTag(tageVerschieben(jetztMs, z.wochenVersatz * 7), rhythmus);
  return { vonMs: start, bisMs: tageVerschieben(start, 7) - 1 };
}

/** `ms` um `tage` KALENDERtage verschieben (Uhrzeit bleibt, auch über die Zeitumstellung). */
function tageVerschieben(ms: number, tage: number): number {
  const d = new Date(ms);
  d.setDate(d.getDate() + tage);
  return d.getTime();
}

/** Die Ereignisse, die in den Zeitraum fallen. */
export function ereignisseIm(
  ev: readonly TaskEvent[],
  z: Zeitraum,
  jetztMs: number,
  rhythmus: Wochenrhythmus | null,
): TaskEvent[] {
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return [...ev];
  return ev.filter((e) => e.ts >= g.vonMs && e.ts <= g.bisMs);
}

/**
 * ★ 18.09.2026: Das ANZEIGE-Ende einer Woche - der Kalendertag, der als
 * „bis" gemeint ist, unabhängig von der Uhrzeit der Wochengrenze.
 *
 * ⚠️ Warum nicht einfach `g.bisMs` nehmen: `grenzen()` liefert dort den
 * letzten MILLISEKUNDEN-Augenblick vor der nächsten Grenze - bei einer
 * Grenze um Mitternacht ist das Sonntag 23:59:59.999 (Sonntags-Datum,
 * passt). Bei einer Grenze NACH Mitternacht (WOCHENZIEL_GRENZE: Montag
 * 08:00, oder ein Unterrichtsende einer Klasse) liegt derselbe Augenblick
 * aber schon am nächsten Montag, kurz vor 08:00 - `g.bisMs` trüge dann das
 * FALSCHE Kalenderdatum („15.-22.09." statt „15.-21.09."). Das Ende wird
 * darum immer aus dem ANFANG errechnet: sechs Kalendertage später, egal um
 * welche Uhrzeit die Grenze liegt (`setDate`, DST-sicher wie überall in
 * diesem Haus).
 */
function anzeigeEndeDatum(vonMs: number): Date {
  const d = new Date(vonMs);
  d.setDate(d.getDate() + 6);
  return d;
}

/**
 * Wie der Zeitraum heisst - für die Überschrift und für die Sprachausgabe.
 * ⚠️ Bei der Woche steht das DATUM da, nicht „diese Woche": Wer blättert,
 * muss sehen, wo er ist, und beim nächsten Lesen wieder wissen, wo er war.
 */
export function zeitraumTitel(
  z: Zeitraum,
  jetztMs: number,
  rhythmus: Wochenrhythmus | null,
  /** ★ EN6a (19.09.2026): die Bedienungssprache - ohne Angabe Deutsch, wie vorher. */
  sprache: BedienSprache = "de",
): string {
  // ★ O-CS (03.10.2026): tschechisch eigene Fassung.
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) return zeitraumTitelNeun(z, jetztMs, rhythmus, sprache);
  if (sprache === "cs") return zeitraumTitelCs(z, jetztMs, rhythmus);
  // ★ O-TR (02.10.2026): türkisch eigene Fassung.
  if (sprache === "tr") return zeitraumTitelTr(z, jetztMs, rhythmus);
  // ★ O-PL (02.10.2026): polnisch eigene Fassung.
  if (sprache === "pl") return zeitraumTitelPl(z, jetztMs, rhythmus);
  // ★ O-IT (02.10.2026): italienisch eigene Fassung.
  if (sprache === "it") return zeitraumTitelIt(z, jetztMs, rhythmus);
  if (sprache === "en") return zeitraumTitelEn(z, jetztMs, rhythmus);
  // ★ E11a-5: französisch eigene Fassung (vorher still Deutsch, Falle 30).
  if (sprache === "fr") return zeitraumTitelFr(z, jetztMs, rhythmus);
  // ★ ES-O (27.09.2026): spanisch eigene Fassung (vorher still Deutsch).
  if (sprache === "es") return zeitraumTitelEs(z, jetztMs, rhythmus);
  if (z.art === "gesamt") return "Gesamt";
  if (z.art === "schuljahr")
    return `Schuljahr ${schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn).label}`;
  const tag = (ms: number) =>
    new Date(ms).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit" });
  if (z.art === "monat") {
    const g = grenzen(z, jetztMs, rhythmus)!;
    // ⚠️ `g.bisMs` trüge bei WOCHENZIEL_GRENZE (Montag 08:00, nicht Mitternacht)
    // das FALSCHE Kalenderdatum (siehe `anzeigeEndeDatum` oben) - das Ende der
    // letzten Woche kommt darum aus ihrem ANFANG, exakt zurückgerechnet.
    const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
    const versatz = z.monatVersatz ?? 0;
    const wort =
      versatz === 0
        ? "Dieser Monat"
        : versatz === -1
          ? "Voriger Monat"
          : versatz === 1
            ? "Nächster Monat"
            : "Monat";
    return `${wort}, ${tag(g.vonMs)} bis ${tag(anzeigeEndeDatum(letzteWocheVon).getTime())}`;
  }
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return "Woche";
  const wort =
    z.wochenVersatz === 0
      ? "Diese Woche"
      : z.wochenVersatz === -1
        ? "Vorige Woche"
        : z.wochenVersatz === 1
          ? "Nächste Woche"
          : "Woche";
  return `${wort}, ${tag(g.vonMs)} bis ${tag(anzeigeEndeDatum(g.vonMs).getTime())}`;
}

/**
 * ★ EN6a (19.09.2026): derselbe Titel englisch - Glossar §3.2 (*Week · Month
 * · School year · All time*), Datum kurz wie §1.2 („14 Sept"). „Monat" meint
 * auch hier die letzten 4 Wochen, nicht den Kalendermonat - das sagt der
 * Hinweis am Schalter, der Titel nennt nur die Daten.
 */
/** ★ O4 (30.10.2026): der Titel in einer der neun Sprachen - dieselbe Rechnung wie {@link zeitraumTitelEn}. */
function zeitraumTitelNeun(z: Zeitraum, jetztMs: number, rhythmus: Wochenrhythmus | null, sprache: GeruestSprache): string {
  const t = KETTEN_NEUN[sprache].zeitraum;
  if (z.art === "gesamt") return t.gesamt;
  if (z.art === "schuljahr") return t.schuljahr(schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn).label);
  const tag = (ms: number) => {
    const d = new Date(ms);
    return t.tag(d.getDate(), d.toLocaleDateString(GEBIET[sprache], { month: "short" }));
  };
  if (z.art === "monat") {
    const g = grenzen(z, jetztMs, rhythmus)!;
    const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
    const versatz = z.monatVersatz ?? 0;
    const wort = versatz === 0 ? t.monat.dieser : versatz === -1 ? t.monat.voriger : versatz === 1 ? t.monat.naechster : t.monat.sonst;
    return t.mitSpanne(wort, tag(g.vonMs), tag(anzeigeEndeDatum(letzteWocheVon).getTime()));
  }
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return t.woche.sonst;
  const wort =
    z.wochenVersatz === 0 ? t.woche.diese : z.wochenVersatz === -1 ? t.woche.vorige : z.wochenVersatz === 1 ? t.woche.naechste : t.woche.sonst;
  return t.mitSpanne(wort, tag(g.vonMs), tag(anzeigeEndeDatum(g.vonMs).getTime()));
}

function zeitraumTitelEn(z: Zeitraum, jetztMs: number, rhythmus: Wochenrhythmus | null): string {
  if (z.art === "gesamt") return "All time";
  if (z.art === "schuljahr") return `School year ${schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn).label}`;
  const tag = (ms: number) => tagKurzEn(new Date(ms));
  if (z.art === "monat") {
    const g = grenzen(z, jetztMs, rhythmus)!;
    const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
    const versatz = z.monatVersatz ?? 0;
    const wort =
      versatz === 0
        ? "This month"
        : versatz === -1
          ? "Previous month"
          : versatz === 1
            ? "Next month"
            : "Month";
    return `${wort}, ${tag(g.vonMs)} to ${tag(anzeigeEndeDatum(letzteWocheVon).getTime())}`;
  }
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return "Week";
  const wort =
    z.wochenVersatz === 0
      ? "This week"
      : z.wochenVersatz === -1
        ? "Previous week"
        : z.wochenVersatz === 1
          ? "Next week"
          : "Week";
  return `${wort}, ${tag(g.vonMs)} to ${tag(anzeigeEndeDatum(g.vonMs).getTime())}`;
}

/**
 * ★ E11a-5 (26.09.2026): derselbe Titel französisch - Glossar §9.2 wie der
 * Schalter (`ZeitraumKopf.tsx`: « Total », « Année scolaire »), Datum mit
 * Monatsnamen („14 sept.") aus `fmtTagMonat(…, "fr")` - die EINE Stelle,
 * die das französische Datum führt (`datum.ts`). „Mois" meint auch hier die
 * letzten 4 Wochen.
 */
function zeitraumTitelFr(z: Zeitraum, jetztMs: number, rhythmus: Wochenrhythmus | null): string {
  if (z.art === "gesamt") return "Total";
  if (z.art === "schuljahr") return `Année scolaire ${schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn).label}`;
  const tag = (ms: number) => fmtTagMonat(ms, "fr");
  if (z.art === "monat") {
    const g = grenzen(z, jetztMs, rhythmus)!;
    const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
    const versatz = z.monatVersatz ?? 0;
    const wort: Record<string, string> = { "0": "Ce mois-ci", "-1": "Mois précédent", "1": "Mois suivant" };
    return `${wort[String(versatz)] ?? "Mois"}, du ${tag(g.vonMs)} au ${tag(anzeigeEndeDatum(letzteWocheVon).getTime())}`;
  }
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return "Semaine";
  const wort: Record<string, string> = { "0": "Cette semaine", "-1": "Semaine précédente", "1": "Semaine suivante" };
  return `${wort[String(z.wochenVersatz)] ?? "Semaine"}, du ${tag(g.vonMs)} au ${tag(anzeigeEndeDatum(g.vonMs).getTime())}`;
}

/**
 * ★ ES-O (27.09.2026): derselbe Titel spanisch - wie der Schalter
 * (`ZeitraumKopf.tsx`: « Total », « Curso escolar »), Datum über
 * `fmtTagMonat(…, "es")` („14 sept"). „Mes" meint die letzten 4 Wochen.
 */
function zeitraumTitelEs(z: Zeitraum, jetztMs: number, rhythmus: Wochenrhythmus | null): string {
  if (z.art === "gesamt") return "Total";
  if (z.art === "schuljahr") return `Curso escolar ${schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn).label}`;
  const tag = (ms: number) => fmtTagMonat(ms, "es");
  if (z.art === "monat") {
    const g = grenzen(z, jetztMs, rhythmus)!;
    const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
    const versatz = z.monatVersatz ?? 0;
    const wort: Record<string, string> = { "0": "Este mes", "-1": "Mes anterior", "1": "Mes siguiente" };
    return `${wort[String(versatz)] ?? "Mes"}, del ${tag(g.vonMs)} al ${tag(anzeigeEndeDatum(letzteWocheVon).getTime())}`;
  }
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return "Semana";
  const wort: Record<string, string> = { "0": "Esta semana", "-1": "Semana anterior", "1": "Semana siguiente" };
  return `${wort[String(z.wochenVersatz)] ?? "Semana"}, del ${tag(g.vonMs)} al ${tag(anzeigeEndeDatum(g.vonMs).getTime())}`;
}

/** „14 Sept" - Tag und Monat, britisch kurz (Glossar §1.2). */
/**
 * ★ O-IT (02.10.2026): „Settimana precedente, dal 14 set al 20 set" - mit
 * Elision vor 1, 8, 11 („dall'8 set", {@link itPrepTag}); „Dall'inizio" für
 * Gesamt (Glossar §2.6).
 */
function zeitraumTitelIt(z: Zeitraum, jetztMs: number, rhythmus: Wochenrhythmus | null): string {
  if (z.art === "gesamt") return "Dall'inizio";
  if (z.art === "schuljahr") return `Anno scolastico ${schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn).label}`;
  const tag = (ms: number) => fmtTagMonat(ms, "it");
  const vonBis = (von: number, bis: number) =>
    `${itPrepTag("dal", new Date(von).getDate())}${tag(von)} ${itPrepTag("al", new Date(bis).getDate())}${tag(bis)}`;
  if (z.art === "monat") {
    const g = grenzen(z, jetztMs, rhythmus)!;
    const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
    const versatz = z.monatVersatz ?? 0;
    const wort: Record<string, string> = { "0": "Questo mese", "-1": "Mese precedente", "1": "Mese successivo" };
    return `${wort[String(versatz)] ?? "Mese"}, ${vonBis(g.vonMs, anzeigeEndeDatum(letzteWocheVon).getTime())}`;
  }
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return "Settimana";
  const wort: Record<string, string> = { "0": "Questa settimana", "-1": "Settimana precedente", "1": "Settimana successiva" };
  return `${wort[String(z.wochenVersatz)] ?? "Settimana"}, ${vonBis(g.vonMs, anzeigeEndeDatum(g.vonMs).getTime())}`;
}

/**
 * ★ O-PL (02.10.2026): „Poprzedni tydzień, od 14 do 20 września" - der Monat
 * ausgeschrieben im Genitiv (Intl), im selben Monat nur am Ende, sonst an
 * beiden Enden („od 31 sierpnia do 6 września"). „od … do …" statt „14-20":
 * eine Sprachausgabe liest den Strich sonst als „minus". „Od początku" für
 * Gesamt (Glossar §2.6).
 */
function zeitraumTitelPl(z: Zeitraum, jetztMs: number, rhythmus: Wochenrhythmus | null): string {
  if (z.art === "gesamt") return "Od początku";
  if (z.art === "schuljahr") return `Rok szkolny ${schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn).label}`;
  const vonBis = (von: number, bis: number) => {
    const a = new Date(von);
    const b = new Date(bis);
    const lang = (d: Date) => d.toLocaleDateString("pl-PL", { day: "numeric", month: "long" });
    const gleich = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    return gleich ? `od ${a.getDate()} do ${lang(b)}` : `od ${lang(a)} do ${lang(b)}`;
  };
  if (z.art === "monat") {
    const g = grenzen(z, jetztMs, rhythmus)!;
    const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
    const versatz = z.monatVersatz ?? 0;
    const wort: Record<string, string> = { "0": "Ten miesiąc", "-1": "Poprzedni miesiąc", "1": "Następny miesiąc" };
    return `${wort[String(versatz)] ?? "Miesiąc"}, ${vonBis(g.vonMs, anzeigeEndeDatum(letzteWocheVon).getTime())}`;
  }
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return "Tydzień";
  const wort: Record<string, string> = { "0": "Ten tydzień", "-1": "Poprzedni tydzień", "1": "Następny tydzień" };
  return `${wort[String(z.wochenVersatz)] ?? "Tydzień"}, ${vonBis(g.vonMs, anzeigeEndeDatum(g.vonMs).getTime())}`;
}

/**
 * ★ O-TR (02.10.2026): "Önceki hafta, 14-20 Eylül" - der Monat ausgeschrieben
 * (Intl tr-TR), im selben Monat nur am Ende ("14-20 Eylül", Glossar §2.10),
 * über zwei Monate an beiden Enden ("31 Ağustos - 6 Eylül"). KEINE
 * Kalenderwochen-Nummer (nie "38. hafta") und keine Endung an den Zahlen
 * (Glossar Regel 6). "Başından beri" für Gesamt, "Öğretim yılı" (Glossar §2.6).
 */
function zeitraumTitelTr(z: Zeitraum, jetztMs: number, rhythmus: Wochenrhythmus | null): string {
  if (z.art === "gesamt") return "Başından beri";
  if (z.art === "schuljahr") return `Öğretim yılı ${schuljahrLabelTr(schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn).label)}`;
  const vonBis = (von: number, bis: number) => {
    const a = new Date(von);
    const b = new Date(bis);
    const lang = (d: Date) => d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
    const gleich = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    return gleich ? `${a.getDate()}-${lang(b)}` : `${lang(a)} - ${lang(b)}`;
  };
  if (z.art === "monat") {
    const g = grenzen(z, jetztMs, rhythmus)!;
    const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
    const versatz = z.monatVersatz ?? 0;
    const wort: Record<string, string> = { "0": "Bu ay", "-1": "Önceki ay", "1": "Sonraki ay" };
    return `${wort[String(versatz)] ?? "Ay"}, ${vonBis(g.vonMs, anzeigeEndeDatum(letzteWocheVon).getTime())}`;
  }
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return "Hafta";
  const wort: Record<string, string> = { "0": "Bu hafta", "-1": "Önceki hafta", "1": "Sonraki hafta" };
  return `${wort[String(z.wochenVersatz)] ?? "Hafta"}, ${vonBis(g.vonMs, anzeigeEndeDatum(g.vonMs).getTime())}`;
}

/**
 * ★ O-CS (03.10.2026): „Předchozí týden, 14.-20. září" - der Monat
 * ausgeschrieben im Genitiv (Intl cs-CZ, nie selbst gebildet: Glossar §4 Falle
 * 7), im selben Monat nur am Ende (Glossar §2.10, Bindestrich), über zwei Monate
 * an beiden Enden („31. srpna - 6. září"). KEINE Kalenderwochen-Nummer (nie
 * „38. týden", Glossar §2.6). „Od začátku" für Gesamt, „Školní rok 2025/2026".
 */
function zeitraumTitelCs(z: Zeitraum, jetztMs: number, rhythmus: Wochenrhythmus | null): string {
  if (z.art === "gesamt") return "Od začátku";
  if (z.art === "schuljahr") return `Školní rok ${schuljahrLabelCs(schuljahrVersetzt(jetztMs, z.jahrVersatz ?? 0, z.schuljahrBeginn).label)}`;
  const vonBis = (von: number, bis: number) => {
    const a = new Date(von);
    const b = new Date(bis);
    const lang = (d: Date) => d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long" });
    const gleich = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    return gleich ? `${a.getDate()}.-${lang(b)}` : `${lang(a)} - ${lang(b)}`;
  };
  if (z.art === "monat") {
    const g = grenzen(z, jetztMs, rhythmus)!;
    const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
    const versatz = z.monatVersatz ?? 0;
    const wort: Record<string, string> = { "0": "Tento měsíc", "-1": "Předchozí měsíc", "1": "Příští měsíc" };
    return `${wort[String(versatz)] ?? "Měsíc"}, ${vonBis(g.vonMs, anzeigeEndeDatum(letzteWocheVon).getTime())}`;
  }
  const g = grenzen(z, jetztMs, rhythmus);
  if (!g) return "Týden";
  const wort: Record<string, string> = { "0": "Tento týden", "-1": "Předchozí týden", "1": "Příští týden" };
  return `${wort[String(z.wochenVersatz)] ?? "Týden"}, ${vonBis(g.vonMs, anzeigeEndeDatum(g.vonMs).getTime())}`;
}

function tagKurzEn(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/**
 * ★ 18.09.2026: Der KURZE Datumsbereich für den „Woche"-Schalter im
 * Tabellenkopf (E1 des Umbaus „Meine Klassen").
 *
 * Der Schalter selbst trägt jetzt den Zeitraum, nicht mehr eine eigene
 * Überschrift darüber - darum muss die Zahl knapp sein: „15.-21.09.", nicht
 * „Diese Woche, 15.09. bis 21.09." Liegt die Woche in zwei Monaten, steht der
 * Monat an BEIDEN Enden, sonst wüsste man beim ersten Datum nicht, welcher
 * Monat gemeint ist: „29.09.-05.10.".
 *
 * ⚠️ Nimmt `wochenVersatz` und nicht den ganzen `Zeitraum`: Der Schalter zeigt
 * diese Zahl auch dann (gedrückt oder nicht), wenn gerade „Schuljahr" oder
 * „Gesamt" gewählt ist - `wochenVersatz` bleibt beim Umschalten stehen (siehe
 * `Zeitraum.wochenVersatz`), die ART aber nicht.
 */
/**
 * ⚠️ Von Hand statt `toLocaleDateString(…, { day: "2-digit" })`: Ob dort „15"
 * oder „15." herauskommt, entscheidet die Sprachdatei des Browsers - mit
 * Punkt stünde „15..-21.09." am Schalter. Gemeinsame Formatierung für
 * {@link wochenBereichKompakt} und {@link monatBereichKompakt} (K4,
 * 19.09.2026) - eine Rechnung, zwei Aufrufer.
 */
function bereichKompaktAusDaten(von: Date, bis: Date, sprache: BedienSprache = "de"): string {
  // ★ O-CS (03.10.2026): „14.-20. 9.", über zwei Monate „31. 8.-6. 9." (Glossar
  // §2.10, Intl cs-CZ mit Ziffern; Bindestrich, nie Halbgeviert).
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) {
    const t = KETTEN_NEUN[sprache].zeitraum;
    const monat = (d: Date) => d.toLocaleDateString(GEBIET[sprache], { month: "short" });
    return von.getMonth() === bis.getMonth() && von.getFullYear() === bis.getFullYear()
      ? t.kompaktGleich(von.getDate(), bis.getDate(), monat(bis))
      : t.kompaktUeber(von.getDate(), monat(von), bis.getDate(), monat(bis));
  }
  if (sprache === "cs") {
    const tagMonat = (d: Date) => d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" });
    const gleich = von.getMonth() === bis.getMonth() && von.getFullYear() === bis.getFullYear();
    return gleich ? `${von.getDate()}.-${tagMonat(bis)}` : `${tagMonat(von)}-${tagMonat(bis)}`;
  }
  // ★ O-TR (02.10.2026): "14-20 Eyl", über zwei Monate "31 Ağu-6 Eyl" (Glossar §2.10, Intl tr-TR).
  if (sprache === "tr") {
    const monat = (d: Date) => d.toLocaleDateString("tr-TR", { month: "short" });
    const gleich = von.getMonth() === bis.getMonth() && von.getFullYear() === bis.getFullYear();
    return gleich
      ? `${von.getDate()}-${bis.getDate()} ${monat(bis)}`
      : `${von.getDate()} ${monat(von)}-${bis.getDate()} ${monat(bis)}`;
  }
  // ★ O-PL (02.10.2026): „14-20 wrz", über zwei Monate „31 sie-6 wrz" (Glossar §2.10).
  if (sprache === "pl") {
    const monat = (d: Date) => d.toLocaleDateString("pl-PL", { month: "short" });
    const gleich = von.getMonth() === bis.getMonth() && von.getFullYear() === bis.getFullYear();
    return gleich
      ? `${von.getDate()}-${bis.getDate()} ${monat(bis)}`
      : `${von.getDate()} ${monat(von)}-${bis.getDate()} ${monat(bis)}`;
  }
  // ★ O-IT (02.10.2026): „14-20 set", über zwei Monate „31 ago-6 set" (Glossar §2.10).
  if (sprache === "it") {
    const monat = (d: Date) => d.toLocaleDateString("it-IT", { month: "short" });
    const gleich = von.getMonth() === bis.getMonth() && von.getFullYear() === bis.getFullYear();
    return gleich
      ? `${von.getDate()}-${bis.getDate()} ${monat(bis)}`
      : `${von.getDate()} ${monat(von)}-${bis.getDate()} ${monat(bis)}`;
  }
  /*
    ★ EN6a (19.09.2026): englisch „14-20 Sept", über zwei Monate „31 Aug-6 Sept"
    - der Monat einmal am Ende, wo es reicht, sonst an beiden Enden (dieselbe
    Regel wie im Deutschen). Nur Bindestrich (Glossar §1.2).
  */
  if (sprache === "en") {
    const monat = (d: Date) => d.toLocaleDateString("en-GB", { month: "short" });
    const gleich = von.getMonth() === bis.getMonth() && von.getFullYear() === bis.getFullYear();
    return gleich
      ? `${von.getDate()}-${bis.getDate()} ${monat(bis)}`
      : `${von.getDate()} ${monat(von)}-${bis.getDate()} ${monat(bis)}`;
  }
  const zwei = (n: number) => String(n).padStart(2, "0");
  /*
    ★ E11a-3 (26.09.2026): „21-27/09" französisch (Glossar §9.1: Datum mit
    Schrägstrich, nie mit Punkt) - dieselbe Regel wie im Deutschen (Monat nur
    am Ende, wenn er reicht, sonst an beiden Enden), nur mit „/" statt „.".
  */
  // ★ ES-O (27.09.2026): spanisch wie französisch „21-27/09" - vorher still Deutsch.
  if (sprache === "fr" || sprache === "es") {
    const tagUndMonatFr = (d: Date) => `${zwei(d.getDate())}/${zwei(d.getMonth() + 1)}`;
    const gleicherMonatFr =
      von.getMonth() === bis.getMonth() && von.getFullYear() === bis.getFullYear();
    return gleicherMonatFr
      ? `${zwei(von.getDate())}-${tagUndMonatFr(bis)}`
      : `${tagUndMonatFr(von)}-${tagUndMonatFr(bis)}`;
  }
  const nurTag = (d: Date) => zwei(d.getDate());
  const tagUndMonat = (d: Date) => `${zwei(d.getDate())}.${zwei(d.getMonth() + 1)}.`;
  const gleicherMonat =
    von.getMonth() === bis.getMonth() && von.getFullYear() === bis.getFullYear();
  return gleicherMonat
    ? `${nurTag(von)}.-${tagUndMonat(bis)}`
    : `${tagUndMonat(von)}-${tagUndMonat(bis)}`;
}

export function wochenBereichKompakt(
  wochenVersatz: number,
  jetztMs: number,
  rhythmus: Wochenrhythmus | null,
  /** ★ EN6a: die Bedienungssprache - ohne Angabe Deutsch, wie vorher. */
  sprache: BedienSprache = "de",
): string {
  const g = grenzen({ art: "woche", wochenVersatz }, jetztMs, rhythmus)!;
  return bereichKompaktAusDaten(new Date(g.vonMs), anzeigeEndeDatum(g.vonMs), sprache);
}

/**
 * ★ K4 (19.09.2026): derselbe kurze Datumsbereich für den „Monat"-Schalter -
 * „24.08.-20.09." Da ein Monat immer {@link MONAT_WOCHEN} Wochen umfasst,
 * liegen die beiden Enden praktisch nie im selben Kalendermonat; die
 * Fallunterscheidung in {@link bereichKompaktAusDaten} bleibt trotzdem
 * bestehen, statt sie hier zu unterschlagen.
 */
export function monatBereichKompakt(
  monatVersatz: number,
  jetztMs: number,
  rhythmus: Wochenrhythmus | null,
  /** ★ EN6a: die Bedienungssprache - ohne Angabe Deutsch, wie vorher. */
  sprache: BedienSprache = "de",
): string {
  const g = grenzen({ art: "monat", wochenVersatz: 0, monatVersatz }, jetztMs, rhythmus)!;
  // ⚠️ Wie bei `zeitraumTitel`: das Ende kommt aus dem Anfang der LETZTEN
  // Woche, nicht aus `g.bisMs` selbst (Begründung an `anzeigeEndeDatum`).
  const letzteWocheVon = tageVerschieben(g.bisMs + 1, -7);
  return bereichKompaktAusDaten(new Date(g.vonMs), anzeigeEndeDatum(letzteWocheVon), sprache);
}

/**
 * Zeigen „Schuljahr" und „Gesamt" für DIESE Ereignisse dasselbe? Dann sagt der
 * Kopf es - sonst hält man zwei Schalter, die dasselbe tun, für einen Fehler.
 */
export function schuljahrIstAlles(
  ev: readonly TaskEvent[],
  jetztMs: number,
  /** ★ D2: der Beginn des Schuljahres der Klasse (1-12) - ohne Angabe August. */
  beginnMonat?: number,
): boolean {
  if (ev.length === 0) return true;
  const sj = schuljahrVon(jetztMs, beginnMonat);
  return ev.every((e) => e.ts >= sj.vonMs && e.ts <= sj.bisMs);
}

/**
 * ★★ DER ZEITRAUM DAVOR - Grundlage der Veränderungs-Pfeile (01.09.2026).
 *
 * Johannes: *„nimm die veränderung zur vorwoche in die tabelle einfach dabei,
 * nicht neue spalten, zB Treffsicherheit 95% und daneben einen Pfeil"*.
 *
 * ⚠️ VERGLICHEN WIRD IMMER GLEICHES MIT GLEICHEM: eine Woche mit der Woche
 * davor, ein Schuljahr mit dem Schuljahr davor. Stünde in der Schuljahr-Ansicht
 * eine Jahreszahl neben einem Wochen-Pfeil, trüge EINE Zelle zwei verschiedene
 * Zeiträume - genau die Doppelung, bei der zwei Stellen dasselbe verschieden
 * beantworten ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ⚠️ „Gesamt" hat kein Davor. Dort gibt es keinen Pfeil - und das ist keine
 * Lücke, sondern die einzige ehrliche Antwort. Eine erfundene Vergleichszahl
 * wäre schlimmer als keine ([[feedback_zusammenfassung_ist_kein_beleg]]).
 */
export function vergleichsGrenzen(
  z: Zeitraum,
  jetztMs: number,
  rhythmus: Wochenrhythmus | null,
): { vonMs: number; bisMs: number } | null {
  if (z.art === "gesamt") return null;
  if (z.art === "schuljahr") {
    const vorher = schuljahrVersetzt(jetztMs, (z.jahrVersatz ?? 0) - 1, z.schuljahrBeginn);
    return { vonMs: vorher.vonMs, bisMs: vorher.bisMs };
  }
  // ★ K4: „Monat" mit den 4 Wochen DAVOR - dieselbe Rechnung wie bei „Woche",
  // nur um `monatVersatz` statt `wochenVersatz` verschoben. Ohne diesen Fall
  // liefe der Wochen-Fallback unten mit und verschöbe das falsche Feld.
  if (z.art === "monat")
    return grenzen({ ...z, monatVersatz: (z.monatVersatz ?? 0) - 1 }, jetztMs, rhythmus);
  return grenzen({ ...z, wochenVersatz: z.wochenVersatz - 1 }, jetztMs, rhythmus);
}

/**
 * Wie der Vergleichszeitraum heisst - für die Erklärung am Pfeil.
 *
 * ★ EN6a (19.09.2026): englisch so, dass er hinter *than in …* und *compared
 * with …* passt (`veraenderungSatz` in `veraenderung.ts`, Glossar §3.2):
 * *the week before* · *the 4 weeks before* · *school year 2025/26*. Ohne
 * Angabe Deutsch, wie vorher.
 */
export function vergleichsName(
  z: Zeitraum,
  jetztMs: number,
  sprache: BedienSprache = "de",
): string {
  if (z.art === "gesamt") return "";
  // ★ E11a-5 (26.09.2026): eine Tabelle je Sprache statt drei Weichen - „fr"
  // bekam hier still „der Woche davor". Französisch MIT Artikel, so dass der
  // Name hinter « que … » und « pendant … » passt (`veraenderungSatzFr`,
  // `ohneVergleichSatz` in `veraenderung.ts`).
  const w = VERGLEICHS_WOERTER[sprache];
  if (z.art === "schuljahr") {
    const label = schuljahrVersetzt(jetztMs, (z.jahrVersatz ?? 0) - 1, z.schuljahrBeginn).label;
    // ★ O-TR (03.10.2026): „2025-2026" statt „2025/26" (`schuljahrLabelTr`); alle anderen Sprachen wie bisher.
    // ★ O-CS (03.10.2026): „2025/2026" (`schuljahrLabelCs`).
    if (sprache === "cs") return `${w.schuljahr} ${schuljahrLabelCs(label)}`;
    return `${w.schuljahr} ${sprache === "tr" ? schuljahrLabelTr(label) : label}`;
  }
  if (z.art === "monat") return w.monat;
  return w.woche;
}

const VERGLEICHS_WOERTER: Record<BedienSprache, { schuljahr: string; monat: string; woche: string }> = mitRueckfallEn(/* ★ O-CS (03.10.2026): alle Sprachen eingetragen */ {
  // ★ O4 (30.10.2026): die neun - so, dass der Name in ihre Sätze passt (`ketten<Xx>.ts`).
  bg: KETTEN_NEUN.bg.vergleich,
  el: KETTEN_NEUN.el.vergleich,
  hu: KETTEN_NEUN.hu.vergleich,
  nl: KETTEN_NEUN.nl.vergleich,
  pt: KETTEN_NEUN.pt.vergleich,
  br: KETTEN_NEUN.br.vergleich,
  ro: KETTEN_NEUN.ro.vergleich,
  sv: KETTEN_NEUN.sv.vergleich,
  uk: KETTEN_NEUN.uk.vergleich,
  de: { schuljahr: "Schuljahr", monat: "den 4 Wochen davor", woche: "der Woche davor" },
  en: { schuljahr: "school year", monat: "the 4 weeks before", woche: "the week before" },
  fr: { schuljahr: "l'année scolaire", monat: "les 4 semaines précédentes", woche: "la semaine précédente" },
  // ★ ES-O (27.09.2026): MIT Artikel, so dass der Name hinter « que … » und
  // « en … » passt (`veraenderungSatzEs`, `ohneVergleichSatz`).
  es: { schuljahr: "el curso escolar", monat: "las 4 semanas anteriores", woche: "la semana anterior" },
  // ★ O-IT (02.10.2026): MIT Artikel - die Sätze sagen „in confronto con …" und
  // „durante …" (keine Verschmelzung mit dem Artikel, `veraenderung.ts`).
  it: { schuljahr: "l'anno scolastico", monat: "le 4 settimane precedenti", woche: "la settimana precedente" },
  // ★ O-PL (02.10.2026): MIT der Präposition „w" und im Miejscownik - die Sätze
  // sagen „niż w poprzednim tygodniu", „jak w …", „Brak ćwiczeń w …"
  // (`veraenderung.ts`). Wer einen eigenen Namen für pl übergibt (z. B. die
  // erste Übungswoche), schreibt ihn genauso: „w pierwszym tygodniu ćwiczeń".
  pl: { schuljahr: "w roku szkolnym", monat: "w poprzednich 4 tygodniach", woche: "w poprzednim tygodniu" },
  // ★ O-TR (02.10.2026): blosses Hauptwort OHNE Endung - die Sätze stellen ein
  // eigenes Wort dahinter ("önceki hafta ile karşılaştırıldığında") oder setzen
  // den Namen hinter einen Doppelpunkt (`veraenderung.ts`, Glossar Regel 6).
  tr: { schuljahr: "öğretim yılı", monat: "önceki 4 hafta", woche: "önceki hafta" },
  // ★ O-CS (03.10.2026): MIT der Präposition „v"/„ve" und im 6. Fall - die Sätze
  // sagen „vyšší než v předchozím týdnu", „jako v ...", „V ... se necvičilo"
  // (`veraenderung.ts`). Wer einen eigenen Namen für cs übergibt (z. B. die
  // erste Übungswoche), schreibt ihn genauso: „v prvním týdnu cvičení".
  cs: { schuljahr: "ve školním roce", monat: "v předchozích 4 týdnech", woche: "v předchozím týdnu" },
});

/** Die Ereignisse zwischen zwei Zeitpunkten (beide einschliesslich). */
export function ereignisseZwischen(
  ev: readonly TaskEvent[],
  g: { vonMs: number; bisMs: number } | null,
): TaskEvent[] {
  if (!g) return [];
  return ev.filter((e) => e.ts >= g.vonMs && e.ts <= g.bisMs);
}
