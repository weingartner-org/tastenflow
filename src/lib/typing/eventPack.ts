/**
 * Die Ereignisliste GEPACKT - damit die Geschichte eines Kindes nicht mehr
 * aufgefressen wird.
 *
 * ── Warum (Messung an Janos echten Daten, 28.08.2026) ───────────────────────
 * Bis heute standen je Kind die letzten **1000** Ereignisse als benannte Felder
 * in `lw_events.data.events`. Das sind 120 KB - und die werden bei JEDER
 * getippten Zeile gelesen UND geschrieben. Bei einem Kind, das viel übt, reicht
 * der Ring nur **22 Tage** zurück: Wer am fleißigsten ist, verliert seine
 * Geschichte am schnellsten.
 *
 * Entscheidung Johannes 28.08.2026: **6.500 gepackt, nichts läuft ab.**
 *
 * ── Wie ─────────────────────────────────────────────────────────────────────
 * Aus acht benannten Feldern je Zeile werden Differenz-Zeitstempel und ein paar
 * Zahlen zur Basis 36, alle Zeilen in EINER Zeichenkette.
 *
 * Nachgemessen am gebauten Format (`scripts/_ereignisgroesse.mts`, 29.08.2026):
 *
 *   Ereignisse    altes Format    gepackt
 *      1.000          97 KB        19 KB      je Ereignis 99 → 19 Bytes
 *      6.500         629 KB       123 KB      ⇐ so viel hebt ein Konto jetzt auf
 *     30.000        2.902 KB      568 KB
 *
 * Die 123 KB liegen in derselben Größenordnung wie die 97 KB von heute - bei
 * **6,5-facher** Geschichte. Das war die Bedingung: gleiche Last je getippter
 * Zeile.
 *
 * ⚠️ Die Skizze vom 28.08. schätzte 120 KB heute und 117 KB gepackt. Beide
 * Zahlen sind etwas daneben; gemessen wurde erst hier, am fertigen Format. Die
 * Aussage („gleiche Last, viel mehr Geschichte") hält, die Zahlen nicht.
 *
 *   { v: 2, t0, lastTs, lex: ["…"], ev: "0,3c,3,yqo,1jk,0;wf,2p,1,r5,q1,1" }
 *
 * Felder je Zeile (leere Felder am Ende fallen weg):
 *   0 dts          Abstand zum vorigen Ereignis in ms (das erste zu `t0`)
 *   1 chars        Soll-Zeichen der Übung
 *   2 errors       Fehlanschläge
 *   3 ms           Bearbeitungszeit (Wanduhr)
 *   4 pause        ms − activeMs; leer = `activeMs` fehlte (Altstand)
 *   5 lessonIdx    Platz im Lektions-Wörterbuch `lex`
 *   6 flags        Bit 0 pasted · Bit 1 blurred · Bit 2 Sprache Englisch · Bit 9 (512) Melodie · Bits 10-18 Sprachen des Gerüsts (G2-NEUN)
 *   7 minutesGoal  nur bei Ziel-Änderungs-Markern
 *
 * ★ Seit 19.09.2026 (Schritt M, `zeilenMessung.ts`) hinten angehängt - die
 * Messungen je Zeile für den Eigenständigkeits-Check. Leer = fehlt:
 *   8 haltezeitMs       ganze ms
 *   9 ueberlappung      × 100 (0 bis 100)
 *  10 rhythmusVk        × 100
 *  11 wackeligVersuche
 *  12 wackelige Fehlgriffe = Versuche − Treffer; leer bei gesetztem 11 = 0
 *  13 wegMs             ganze ms
 *  14 unechteTasten
 * Die Reihenfolge ist nach Häufigkeit gewählt: Was fast immer 0 ist (13, 14),
 * steht hinten und fällt als leeres Feld am Ende weg. Eine Zeile ohne
 * Messungen sieht aus wie vor dem 19.09. - ALTE Datensätze lesen sich darum
 * unverändert, und ALTE Leser (auch der Server-Zwilling vor diesem Stand)
 * lesen nur Feld 0-7 und übersehen den Rest.
 * ⚠️ Der Preis: Eine noch offene ALTE App (vor dem Neuladen) packt beim
 * nächsten Schreiben ohne diese Felder - die Messungen der Geschichte gehen
 * dann verloren, die Übungsdaten nicht.
 *
 * ── ⚠️ Die beiden Regeln, die man hier nicht brechen darf ───────────────────
 * 1. **`lastTs` ist Pflicht.** Daran - und nur daran - erkennt der Server-Hook
 *    `tt_selflearner_lifecycle.pb.js`, wann ein Konto zuletzt aktiv war, und an
 *    dieser Zahl hängt eine **Lösch-Automatik**. Wer `lastTs` weglässt oder
 *    falsch setzt, löscht im schlimmsten Fall ein Konto.
 * 2. **{@link unpackEvents} muss BEIDE Formate lesen.** Nach dem Deploy liegen
 *    beide nebeneinander: alte Konten tragen `events`, neue `ev`. Ein Leser, der
 *    nur eines kennt, sieht bei der Hälfte der Kinder eine leere Geschichte.
 *
 * Dieselbe Packung gibt es ein zweites Mal für die Server-Seite
 * (`pocketbase/pb_hooks/tt_events_pack_lib.pb.js`, CommonJS für goja). Dass die
 * beiden dasselbe tun, ist nicht Absicht allein - `tests/typing-eventpack.test.ts`
 * fährt beide gegen dieselben Proben und vergleicht.
 */
import { GOAL_CHANGE_LESSON, type Lang, type TaskEvent } from "./account";

/** So viele Ereignisse hebt ein Konto auf (vorher 1000, siehe Kopf). */
export const MAX_EVENTS_GEPACKT = 6500;

/** Kennung des gepackten Formats. */
export const PACK_VERSION = 2;

export interface PackedEvents {
  v: number;
  /** Zeitstempel, auf den sich der erste Abstand bezieht. */
  t0: number;
  /** Jüngster Ereignis-Zeitstempel. ⚠️ Der Hook liest DIESE Zahl. */
  lastTs: number;
  /** Lektions-Wörterbuch (die Zeilen tragen nur den Platz darin). */
  lex: string[];
  /** Die Zeilen, mit `;` getrennt. */
  ev: string;
  /**
   * Tagesbilanz - eine Zeile je Übungstag, die NIE abläuft (siehe unten).
   * Fehlt, solange noch kein Tag verbucht ist.
   */
  tage?: string;
}

const b36 = (n: number): string => Math.round(n).toString(36);
const zahl = (s: string | undefined): number => {
  if (!s) return 0;
  const n = parseInt(s, 36);
  return Number.isFinite(n) ? n : 0;
};

/** Feld 12: wacklige Fehlgriffe - leer, wenn es keine gab (der Normalfall). */
const fehlgriffe = (e: TaskEvent): string => {
  const versuche = e.wackeligVersuche ?? 0;
  const f = Math.max(0, Math.round(versuche - (e.wackeligTreffer ?? versuche)));
  return f === 0 ? "" : b36(f);
};

/**
 * Die Sprache einer Zeile als Bit in `flags`. Deutsch hat keins (alte Stände
 * ohne `lang` zählen als Deutsch).
 *
 * ★ 27.09.2026: bis hierher kannte das Paket nur „en" (Bit 4) - eine
 * französische oder spanische Zeile kam vom Server als DEUTSCHE zurück, und
 * „Mes progrès" zählte ihre Übezeit nach dem nächsten Laden als „allemand".
 * Neue Sprachen bekommen hier ihr Bit; ältere Fassungen der App kennen die
 * neuen Bits nicht und lesen solche Zeilen wie bisher als Deutsch - zu wenig,
 * nie kaputt.
 */
/** ★ 19.10.2026: Bit 9 (512) = die Zeile wurde mit Melodie getippt (`TaskEvent.melodie`). */
export const MELODIE_BIT = 512;

export const SPRACH_BIT: Readonly<Record<Exclude<Lang, "de">, number>> = {
  en: 4,
  fr: 8,
  es: 16,
  // ★ G2b-2 (02.10.2026): neue Sprachen bekommen NEUE Bits - die Bits von en, fr,
  // es bleiben, wie sie sind (alte gepackte Ereignisse müssen gleich ausgepackt
  // werden). Die Tabelle ist `Record<…>` über alle Sprachen ausser Deutsch: eine
  // neue Sprache in `Lang` kompiliert erst, wenn sie hier ein Bit hat - nie
  // wieder „Zeile ohne Bit ⇒ kommt als Deutsch zurück".
  it: 32,
  pl: 64,
  tr: 128,
  cs: 256,
  // ★ G2-NEUN (25.10.2026): die neun Sprachen des Gerüsts - ab Bit 10 (1024), weil Bit 9 (512) die Melodie ist
  // (`MELODIE_BIT`). Spiegel im Server: `pocketbase/pb_hooks/tt_events_pack_lib.pb.js`.
  bg: 1024,
  el: 2048,
  hu: 4096,
  nl: 8192,
  pt: 16384,
  br: 32768,
  ro: 65536,
  sv: 131072,
  uk: 262144,
};

/**
 * Das Bit einer Sprache in `flags`. Deutsch hat KEIN Bit (Bestand: ein Stand ohne
 * `lang` ist Deutsch) - das ist die einzige Ausnahme. Ein unbekannter Wert wirft in
 * Entwicklung und Tests; im ausgelieferten Programm wird er laut gemeldet und die
 * Zeile ohne Bit gepackt (die Seite eines Kindes stürzt nie ab).
 */
export function spracheAlsBit(lang: Lang | undefined): number {
  if (!lang || lang === "de") return 0;
  if (Object.hasOwn(SPRACH_BIT, lang)) return SPRACH_BIT[lang];
  const meldung = `Ereignis mit unbekannter Sprache: ${JSON.stringify(lang)} (bekannt: de, ${Object.keys(SPRACH_BIT).join(", ")})`;
  if (import.meta.env.PROD) {
    console.error(meldung);
    return 0;
  }
  throw new Error(meldung);
}

/**
 * Ereignisse packen. Zeiten werden auf ganze Millisekunden gerundet -
 * Bruchteile einer Millisekunde sagen über das Tippen eines Kindes nichts.
 *
 * ── ★★★★★ FELD 4 DARF NEGATIV SEIN (Reparatur 01.09.2026) ─────────────────
 *
 * Feld 4 trägt `ms - activeMs`. Bis heute stand dort `Math.max(0, ms -
 * activeMs)` - und das hat bei JEDER Zeile, in der die Uhr mehr gezählt hat
 * als die Zeile selbst dauerte, den Überschuss **stillschweigend weggeworfen**.
 *
 * Das ist kein Randfall: `activeMs` ist der Zuwachs der Übezeit-Uhr seit der
 * letzten Meldung und enthält damit auch die Zeit VOR der Zeile - die Pause, in
 * der die Ansage lief. `ms` ist die Dauer der Zeile allein, abzüglich der
 * Wartezeit aufs Vorlesen. `activeMs > ms` ist also der NORMALFALL, sobald ein
 * Kind sich die Zeile vorlesen lässt.
 *
 * Gemessen an Janos echten Daten (01.09.2026): **41 % seiner 3.573 Zeilen**
 * tragen `activeMs > ms`; das Packen kostete ihn **0,81 von 8,90 Stunden - 9 %**.
 * Bei einem Kind mit Blindheit ist der Anteil grösser, denn genau dort ist die
 * Pause zwischen zwei Zeilen die Ansage.
 *
 * ⚠️ Warum es nie aufgefallen ist: In JEDEM Testfall dieser Datei war
 * `activeMs <= ms`. Die Tests prüften die Annahme, aus der der Fehler kam -
 * ein Wächter, der nur bestätigt, was der Autor ohnehin dachte.
 *
 * Rückwärts verträglich in beide Richtungen: Alte Datensätze tragen nur
 * nicht-negative Werte und werden unverändert gelesen; `zahl()` liest über
 * `parseInt(…, 36)` auch negative Werte. Ältere Fassungen der App, die einen
 * negativen Wert lesen, landen über das `Math.max(0, …)` in
 * {@link unpackEvents} beim alten Verhalten - zu wenig, aber nie kaputt.
 */
export function packEvents(events: readonly TaskEvent[]): PackedEvents {
  const lex: string[] = [];
  const platz = new Map<string, number>();
  const zeilen: string[] = [];
  let vorher = events.length > 0 ? Math.round(events[0].ts) : 0;
  const t0 = vorher;
  let lastTs = t0;

  for (const e of events) {
    const ts = Math.round(e.ts);
    if (ts > lastTs) lastTs = ts;
    let idx = platz.get(e.lesson);
    if (idx === undefined) {
      idx = lex.length;
      lex.push(e.lesson);
      platz.set(e.lesson, idx);
    }
    const flags =
      (e.pasted ? 1 : 0) | (e.blurred ? 2 : 0) | (e.melodie ? MELODIE_BIT : 0) | spracheAlsBit(e.lang);
    const felder = [
      b36(ts - vorher),
      b36(e.chars),
      b36(e.errors),
      b36(e.ms),
      // ⚠️ KEIN Math.max(0, …) - siehe unten. Der Wert darf NEGATIV sein.
      e.activeMs == null ? "" : b36(e.ms - e.activeMs),
      b36(idx),
      flags === 0 ? "" : b36(flags),
      e.minutesGoal == null ? "" : b36(e.minutesGoal),
      // ── Schritt M (19.09.2026): Messungen je Zeile, siehe Kopf ──
      e.haltezeitMs == null ? "" : b36(e.haltezeitMs),
      e.ueberlappung == null ? "" : b36(e.ueberlappung * 100),
      e.rhythmusVk == null ? "" : b36(e.rhythmusVk * 100),
      e.wackeligVersuche == null ? "" : b36(e.wackeligVersuche),
      e.wackeligVersuche == null ? "" : fehlgriffe(e),
      !e.wegMs ? "" : b36(e.wegMs),
      !e.unechteTasten ? "" : b36(e.unechteTasten),
    ];
    while (felder.length > 0 && felder[felder.length - 1] === "") felder.pop();
    zeilen.push(felder.join(","));
    vorher = ts;
  }

  return { v: PACK_VERSION, t0, lastTs, lex, ev: zeilen.join(";") };
}

/**
 * Ereignisse auspacken - aus dem gepackten ODER dem alten Format.
 *
 * Angenommen wird alles, was aus `lw_events.data` kommen kann: der gepackte
 * Datensatz, der alte `{ events: [...] }`, ein blankes Feld (Altstände) und
 * Unsinn (dann eine leere Liste, nie ein Fehler - eine kaputte Zeile darf ein
 * Kind nicht am Üben hindern).
 */
export function unpackEvents(daten: unknown): TaskEvent[] {
  if (!daten) return [];
  if (Array.isArray(daten)) return daten as TaskEvent[];
  const d = daten as Record<string, unknown>;
  if (Array.isArray(d.events)) return d.events as TaskEvent[];
  if (typeof d.ev !== "string") return [];

  const lex = Array.isArray(d.lex) ? (d.lex as string[]) : [];
  const t0 = typeof d.t0 === "number" ? d.t0 : 0;
  const roh = d.ev.length > 0 ? d.ev.split(";") : [];
  const out: TaskEvent[] = [];
  let ts = t0;

  for (const zeile of roh) {
    const f = zeile.split(",");
    ts += zahl(f[0]);
    const ms = zahl(f[3]);
    const flags = zahl(f[6]);
    const e: TaskEvent = {
      ts,
      lesson: lex[zahl(f[5])] ?? "",
      chars: zahl(f[1]),
      errors: zahl(f[2]),
      ms,
    };
    if (f[4] !== undefined && f[4] !== "") e.activeMs = Math.max(0, ms - zahl(f[4]));
    if (flags & 1) e.pasted = true;
    if (flags & 2) e.blurred = true;
    if (flags & MELODIE_BIT) e.melodie = true;
    for (const [lang, bit] of Object.entries(SPRACH_BIT) as [Lang, number][]) if (flags & bit) e.lang = lang;
    if (f[7] !== undefined && f[7] !== "") e.minutesGoal = zahl(f[7]);
    // Schritt M (19.09.2026) - fehlt in allem, was vorher gepackt wurde.
    if (f[8]) e.haltezeitMs = zahl(f[8]);
    if (f[9]) e.ueberlappung = zahl(f[9]) / 100;
    if (f[10]) e.rhythmusVk = zahl(f[10]) / 100;
    if (f[11]) {
      e.wackeligVersuche = zahl(f[11]);
      e.wackeligTreffer = Math.max(0, e.wackeligVersuche - zahl(f[12]));
    }
    if (f[13]) e.wegMs = zahl(f[13]);
    if (f[14]) e.unechteTasten = zahl(f[14]);
    out.push(e);
  }
  return out;
}

/**
 * Der jüngste Ereignis-Zeitstempel - die Zahl, an der die Lösch-Automatik hängt.
 * Liest beide Formate; 0, wenn es kein Ereignis gibt.
 */
export function letzterZeitstempel(daten: unknown): number {
  if (!daten) return 0;
  const d = daten as Record<string, unknown>;
  if (typeof d.lastTs === "number") return d.lastTs;
  const liste = unpackEvents(daten);
  let letzte = 0;
  for (const e of liste) if (typeof e.ts === "number" && e.ts > letzte) letzte = e.ts;
  return letzte;
}

// ── Tagesbilanz: die Geschichte, die NIE abläuft ────────────────────────────
//
// Auch 6.500 Ereignisse sind endlich: Wer täglich übt, verliert nach gut vier
// Monaten den Anfang. Für die Frage, die uns wirklich beschäftigt - „wie lange
// hat dieses Kind für die nächste Taste gebraucht?" - reicht aber eine Zeile je
// TAG. Die kostet 20 Bytes, und ein Schuljahr sind damit rund 4 KB.
//
// ⚠️ Sie wird BEIM SCHREIBEN fortgeschrieben, nie nachträglich aus den
// Ereignissen gerechnet: Sobald ein Ereignis aus dem Ring fällt, ist es weg -
// die Bilanz hat seinen Beitrag dann längst.
//
// ★ Warum ZEILEN und nicht Runden (Abweichung von der Skizze vom 28.08.): Seit
// dem 29.08. ist eine Runde keine feste Größe mehr - ein langsames Kind bekommt
// 5 Zeilen, ein schnelles 12 (`rundenlaenge.ts`). „Drei Runden" heißt seither
// bei zwei Kindern Verschiedenes, „36 Zeilen" bei beiden dasselbe.
// Die NEUEN TASTEN je Tag stehen ohnehin schon woanders und laufen auch nie ab:
// `progress.introducedAt` (seit 28.08.).

/** Eine Zeile der Tagesbilanz. */
export interface Tagesbilanz {
  /** Lokaler Kalendertag als Tage seit dem 01.01.1970. */
  tag: number;
  /** Reine Übungszeit des Tages in vollen Minuten (aus `activeMs`, sonst `ms`). */
  min: number;
  /**
   * Die angebrochene Minute in Millisekunden (0 bis 59_999).
   *
   * ⚠️ Ohne dieses Feld ging die Übezeit verloren: Eine Tipp-Zeile dauert 10
   * bis 30 Sekunden, und wer sie einzeln auf Minuten rundet, bekommt für einen
   * ganzen Übungstag null (siehe `bilanzErgaenzen`). Fehlt es in alten Zeilen,
   * gilt 0 - sie bleiben damit gültig.
   */
  restMs?: number;
  chars: number;
  errors: number;
  /** Abgeschlossene Übungszeilen. */
  zeilen: number;
}

const TAG_MS = 86_400_000;

/**
 * Lokaler Kalendertag als Zahl - dieselbe Uhr wie {@link dayKey} in badges.ts
 * (Übungstage zählen nach der Uhr des Kindes, nicht nach UTC).
 */
export function tagNummer(ts: number): number {
  const d = new Date(ts);
  return Math.floor(
    (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) ) / TAG_MS,
  );
}

/** Die Tagesbilanz aus dem Datensatz lesen (leere Liste, wenn es keine gibt). */
export function tagesbilanz(daten: unknown): Tagesbilanz[] {
  const d = (daten ?? {}) as Record<string, unknown>;
  if (typeof d.tage !== "string" || d.tage.length === 0) return [];
  const out: Tagesbilanz[] = [];
  for (const zeile of d.tage.split(";")) {
    const f = zeile.split(",");
    out.push({
      tag: zahl(f[0]),
      min: zahl(f[1]),
      chars: zahl(f[2]),
      errors: zahl(f[3]),
      zeilen: zahl(f[4]),
      // Fehlt in Zeilen von vor dem 08.09.2026 - dann ist der Rest 0.
      restMs: zahl(f[5]),
    });
  }
  return out;
}

/**
 * Die Tagesbilanz in ihre gespeicherte Form bringen.
 *
 * ★ Exportiert seit dem 08.09.2026, weil die Rekonstruktion der verlorenen
 * Übezeit dieselbe Serialisierung braucht. Sie NACHZUBAUEN wäre die Doppelung,
 * die einander nicht kennt - und ausgerechnet an der Stelle, an der schon
 * einmal eine Rundung die Zahlen aller Kinder gefressen hat.
 */
export function bilanzSchreiben(liste: readonly Tagesbilanz[]): string {
  return liste
    .map((t) => {
      const felder = [t.tag, t.min, t.chars, t.errors, t.zeilen, t.restMs ?? 0];
      // ⚠️ Der Sekundenrest steht HINTEN und fällt weg, wenn er 0 ist: So
      // bleiben die Zeilen so kurz wie bisher, und ein alter Leser, der nur
      // fünf Felder kennt, liest sie unverändert richtig.
      while (felder.length > 5 && felder[felder.length - 1] === 0) felder.pop();
      return felder.map(b36).join(",");
    })
    .join(";");
}

/**
 * Den Beitrag EINES Ereignisses in die Tagesbilanz einrechnen. Der Tag des
 * Ereignisses wird gesucht (meist der letzte) und fortgeschrieben; gibt es ihn
 * noch nicht, kommt er dazu.
 */
export function bilanzErgaenzen(
  vorher: readonly Tagesbilanz[],
  e: TaskEvent,
): Tagesbilanz[] {
  const tag = tagNummer(e.ts);
  const ms = Math.max(0, e.activeMs ?? e.ms);
  const out = vorher.map((t) => ({ ...t }));
  let zeile = out.length > 0 && out[out.length - 1].tag === tag
    ? out[out.length - 1]
    : out.find((t) => t.tag === tag);
  if (!zeile) {
    zeile = { tag, min: 0, chars: 0, errors: 0, zeilen: 0 };
    out.push(zeile);
    out.sort((a, b) => a.tag - b.tag);
  }
  /*
    ════════════════════════════════════════════════════════════════════════
    ⚠️⚠️⚠️ HIER GING DIE GANZE ÜBEZEIT VERLOREN (behoben 08.09.2026)
    ════════════════════════════════════════════════════════════════════════

    Hier stand: `zeile.min = Math.round((zeile.min * 60_000 + ms) / 60_000)`
    mit dem Kommentar, so würden die halben Minuten NICHT verlorengehen.
    Das Gegenteil war der Fall - und zwar so gründlich, dass die Übezeit
    praktisch aller Kinder auf null stand:

      Start:      min = 0
      Ereignis 1: Math.round((0 * 60000 + 20000) / 60000) = Math.round(0,33) = 0
      Ereignis 2: Math.round((0 * 60000 + 20000) / 60000) = 0
      Ereignis 3: …                                        = 0

    `zeile.min` war bereits GERUNDET, der Rest also schon weg - jedes neue
    Ereignis fing wieder bei einem vollen Vielfachen an. Eine Tipp-Zeile
    dauert 10 bis 30 Sekunden; die Schwelle von 30 Sekunden erreichte darum
    fast nie eine. Gemessen am 08.09.2026 an echten Daten:

        fwx,0,172,11,3e   =  1.478 Zeichen, 122 Zeilen … und 0 Minuten.

    Johannes sah es auf der neuen Statistikseite sofort: „es kann nicht sein
    dass die übezeit in allen klassen 0 min ist?"

    ── Die Reparatur ──────────────────────────────────────────────────────
    Die angebrochene Minute wird als SEKUNDENREST mitgeführt (Feld 6) und
    beim nächsten Ereignis weiterverrechnet. Nichts wird mehr weggeworfen.

    ⚠️ Das sechste Feld ist ADDITIV: Alte Zeilen haben fünf Felder, ihr Rest
    ist dann 0 - sie bleiben lesbar, und niemand muss sie anfassen.
  */
  const gesamtMs = zeile.min * 60_000 + (zeile.restMs ?? 0) + ms;
  zeile.min = Math.floor(gesamtMs / 60_000);
  zeile.restMs = gesamtMs % 60_000;
  zeile.chars += Math.max(0, Math.round(e.chars));
  zeile.errors += Math.max(0, Math.round(e.errors));
  zeile.zeilen += 1;
  return out;
}

/**
 * Eine Ereignisliste anhängen, kappen, packen - und die Tagesbilanz
 * fortschreiben. Der EINE Weg, auf dem geschrieben wird: Beide Speicher (Gerät
 * und Server) rufen ihn auf, damit sie nicht auseinanderlaufen können.
 *
 * ⚠️ Ziel-Änderungs-Marker (`lesson === "__goal__"`) sind keine Übung und
 * zählen in der Bilanz nicht mit - sonst hätte jedes Verstellen des Wochenziels
 * eine Übungszeile erfunden.
 */
export function ereignisAnhaengen(
  daten: unknown,
  neu: TaskEvent,
  grenze: number = MAX_EVENTS_GEPACKT,
): PackedEvents {
  const liste = unpackEvents(daten);
  liste.push(neu);
  if (liste.length > grenze) liste.splice(0, liste.length - grenze);
  const gepackt = packEvents(liste);
  const bilanz =
    neu.lesson === GOAL_CHANGE_LESSON
      ? tagesbilanz(daten)
      : bilanzErgaenzen(tagesbilanz(daten), neu);
  if (bilanz.length > 0) gepackt.tage = bilanzSchreiben(bilanz);
  return gepackt;
}

/** Woran ein Ereignis wiedererkannt wird: Zeitstempel und Lektion. */
function ereignisKennung(e: TaskEvent): string {
  return `${e.ts}|${e.lesson}`;
}

/**
 * ★★ MEHRERE Ereignisse nachtragen - ohne eines doppelt zu zählen
 * (27.09.2026, Warteschlange im Gerät, `nachsenden.ts`).
 *
 * Kam eine Sendung am Server an, aber die Antwort nicht, schickt das Gerät
 * dieselben Zeilen noch einmal. Hier werden darum nur die angehängt, deren
 * Kennung (Zeitstempel + Lektion) noch NICHT in der Liste steht - sonst zählte
 * die Übezeit dieser Minuten doppelt.
 *
 * ⚠️ EINMAL entpacken, alles anhängen, EINMAL packen (Prüfbefund 27.09.2026:
 * die erste Fassung ging je Zeile durch {@link ereignisAnhaengen} und packte
 * die ganze Geschichte jedes Mal neu - 2.000 Zeilen dauerten 12,6 s auf dem
 * Hauptfaden). Dasselbe Ergebnis wie Zeile für Zeile über
 * `ereignisAnhaengen`: gleiche Liste, gleiche Kappung, gleiche Tagesbilanz
 * (Ziel-Marker zählen dort nicht mit) - der Wächter vergleicht beide Wege.
 *
 * `neu` = wie viele wirklich dazukamen (0: alles lag schon, nichts schreiben).
 */
export function ereignisseNachtragen(
  daten: unknown,
  ereignisse: readonly TaskEvent[],
  grenze: number = MAX_EVENTS_GEPACKT,
): { gepackt: PackedEvents | null; neu: number } {
  const liste = unpackEvents(daten);
  const schon = new Set(liste.map(ereignisKennung));
  let bilanz = tagesbilanz(daten);
  let neu = 0;
  for (const e of ereignisse) {
    const k = ereignisKennung(e);
    if (schon.has(k)) continue;
    schon.add(k);
    liste.push(e);
    if (e.lesson !== GOAL_CHANGE_LESSON) bilanz = bilanzErgaenzen(bilanz, e);
    neu += 1;
  }
  if (neu === 0) return { gepackt: null, neu: 0 };
  if (liste.length > grenze) liste.splice(0, liste.length - grenze);
  const gepackt = packEvents(liste);
  if (bilanz.length > 0) gepackt.tage = bilanzSchreiben(bilanz);
  return { gepackt, neu };
}
