/**
 * ════════════════════════════════════════════════════════════════════════════
 * DIE WOCHENGRENZE - EIN WOCHENTAG UND EINE UHRZEIT
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ★★★★★ AUFGERÄUMT (19.09.2026, Bauplan §„W · Wochenziel neu"): Bis zum
 * 18.09.2026 konnte eine Klasse ihre Wochengrenze selbst einstellen -
 * „Unterricht am (Wochentag) bis (Uhrzeit)" (N6, §2c). Johannes hat das
 * abgeschafft: *„wir bleiben bei Minuten pro Woche ohne Einheiten"* und *„das
 * Wochenziel beginnt am Montag um 8:00 Uhr"* - für Tastenflow UND Punktgenau,
 * fest, ohne Einstellmöglichkeit. Die EINE Wochengrenze der ganzen Plattform
 * ist seither `WOCHENZIEL_GRENZE` in `wochenziel.ts` (Montag 08:00).
 *
 * Was aus dem alten Umbau blieb: die reine WOCHENTAG+UHRZEIT-Rechnung selbst
 * ({@link Wochenrhythmus}, {@link wochenStart}, {@link wochenStartFuerTag},
 * {@link uebungstagSchluessel}) - `WOCHENZIEL_GRENZE` braucht sie genau wie
 * `wochenziel.ts`s Kopf-Kommentar erklärt, und `zeitraum.ts` (die
 * Zeitraum-Auswahl der Lernenden-Tabelle) reicht denselben festen Rhythmus
 * ebenso durch. Entfernt sind die Teile, die nur zur EINSTELLBAREN Klassen-
 * Wochengrenze gehörten: das Lesen/Prüfen von `settings.unterrichtstag` samt
 * dem „nie zum Nachteil"-Vergleich zweier verschiedener Rhythmen, die
 * Werktage-Verteilung des früheren Tages-Deckels und die Anzeige-Sätze für
 * eine wählbare Unterrichtsstunde. Alte `settings.unterrichtstag`/
 * `-unterrichtsende`-Werte bestehender Klassen bleiben in den Datensätzen
 * stehen (kein Datenwechsel) - sie werden nur nirgends mehr gelesen.
 *
 * ⚠️ Ohne Rhythmus (`null`) verhält sich alles wie vor N6: Woche = Montag
 * 00:00 bis Sonntag 24:00.
 */

/** Mo=0 … So=6 - dieselbe Zählung wie überall in `goals.ts`. */
export type Wochentag = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Die Stunde des Abgabeschlusses am VORTAG (F27) - die Regel, die gilt,
 * solange KEINE Ende-Uhrzeit angegeben ist.
 *
 * ⚠️ 22:00 und nicht Mitternacht: Wer am Vorabend noch übt, soll es noch
 * schaffen; wer um 23:30 anfängt, übt für die NÄCHSTE Woche. Die Zahl steht
 * hier einmal und wird nirgends nachgebaut.
 */
export const SCHLUSS_STUNDE = 22;

export interface Wochenrhythmus {
  /** An welchem Wochentag die Woche endet (Mo=0 … So=6). */
  unterrichtstag: Wochentag;
  /**
   * Minuten nach Mitternacht, zu denen die Woche an diesem Wochentag endet
   * (14:00 = 840). Fehlt die Zahl, gilt die alte Regel: Abgabeschluss am
   * VORTAG um {@link SCHLUSS_STUNDE}.
   */
  endeMinuten?: number;
  /**
   * Ab wann dieser Rhythmus gilt (Zeitpunkt des Eintrags). Ohne Wirkung,
   * solange nichts diesen Rhythmus mit einem früheren vergleicht - siehe
   * `WOCHENZIEL_GRENZE` in `wochenziel.ts`.
   */
  giltAbMs: number;
}

/** Der Wochentag des Abgabeschlusses: der Tag VOR dem Ende-Wochentag (F27). */
export function schlusstag(r: Wochenrhythmus): Wochentag {
  return (((r.unterrichtstag + 6) % 7) as Wochentag);
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★ DIE EINE WOCHENGRENZE - Wochentag und Minute
 * ════════════════════════════════════════════════════════════════════════════
 *
 * MIT Ende-Uhrzeit liegt die Grenze auf dem `unterrichtstag` SELBST, im
 * Augenblick, in dem die Uhrzeit erreicht ist:
 *
 *     Di 14:00 ──────────────────────────────► Di 14:00
 *       ▲                                        ▲
 *       neue Woche beginnt                       Abgabeschluss
 *
 * OHNE Ende-Uhrzeit bleibt es bei: Vortag 22:00. Zwei Regeln, EINE Stelle -
 * jede andere Rechnung im Haus fragt hier nach und rechnet nichts nach
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export function wochengrenze(r: Wochenrhythmus): { tag: Wochentag; minute: number } {
  if (typeof r.endeMinuten === "number")
    return { tag: r.unterrichtstag, minute: r.endeMinuten };
  return { tag: schlusstag(r), minute: SCHLUSS_STUNDE * 60 };
}

/**
 * Der Beginn der Woche, in der `nowMs` liegt.
 *
 * Ohne Rhythmus: Montag 00:00 - Zeichen für Zeichen dasselbe wie bisher.
 * Mit Rhythmus: der letzte Abgabeschluss ({@link wochengrenze}).
 */
export function wochenStart(nowMs: number, r: Wochenrhythmus | null): number {
  const d = new Date(nowMs);
  if (!r) {
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.getTime();
  }
  const g = wochengrenze(r);
  const ziel = g.tag;
  // Vom heutigen Tag rückwärts bis zum jüngsten Schlusszeitpunkt, der nicht
  // in der Zukunft liegt. Höchstens acht Schritte - danach wäre eine Woche um.
  const kandidat = new Date(nowMs);
  kandidat.setHours(Math.floor(g.minute / 60), g.minute % 60, 0, 0);
  for (let i = 0; i < 8; i += 1) {
    const dow = ((kandidat.getDay() + 6) % 7) as Wochentag;
    if (dow === ziel && kandidat.getTime() <= nowMs) return kandidat.getTime();
    kandidat.setDate(kandidat.getDate() - 1);
  }
  // Unerreichbar - der Vollständigkeit halber der Montag.
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}

/**
 * ★★★ ZU WELCHER WOCHE GEHÖRT EIN KALENDERTAG?
 *
 * ⚠️ HIER STECKT DIE EINZIGE VEREINFACHUNG DIESES UMBAUS, und sie gehört
 * benannt statt versteckt:
 *
 * Die Übezeit wird im ganzen Haus JE KALENDERTAG gezählt (`buildDayPractice`)
 * - die einzelnen Uhrzeiten sind in dieser Zusammenfassung nicht mehr
 * enthalten. Eine Grenze um 22:00 zerschneidet aber einen Tag. Ein Tag wird
 * darum GANZ einer Woche zugeschlagen, und zwar der, in die seine ersten
 * 22 Stunden fallen:
 *
 *   Schlusstag Mittwoch ⇒ der ganze Mittwoch gehört noch zur ENDENDEN Woche,
 *                         der Donnerstag beginnt die neue.
 *
 * ★ Die Rundung geht damit ZUGUNSTEN des Kindes: Wer am Mittwoch um 22:30
 * noch übt, bekommt es auf die Woche gutgeschrieben, die gerade zu Ende geht -
 * nicht auf die nächste. Das ist die Richtung, in die eine Ungenauigkeit
 * fallen darf ([[feedback_nie_gegen_das_kind]]).
 *
 * Wer das tagesgenau haben will, muss `buildDayPractice` die Uhrzeiten
 * behalten lassen. Das ist ein eigener Umbau und war für diese Nacht nicht
 * beauftragt.
 */
export function wochenStartFuerTag(
  tagMs: number,
  r: Wochenrhythmus | null,
): number {
  if (!r) return wochenStart(tagMs, r);
  const d = new Date(tagMs);
  const g = wochengrenze(r);
  // ★ Ein Schlüssel, der NICHT auf Mitternacht liegt, ist die zweite Hälfte
  //   des Grenztages (siehe {@link uebungstagSchluessel}) - der ist schon ein
  //   genauer Zeitpunkt und wird nicht noch einmal gerundet.
  const mitternacht =
    d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0 &&
    d.getMilliseconds() === 0;
  if (!mitternacht) return wochenStart(tagMs, r);
  d.setHours(0, 0, 0, 0);
  return wochenStart(d.getTime() + g.minute * 60_000 - 1, r);
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★ DER ÜBUNGSTAG EINES EREIGNISSES - hier wird der Grenztag geteilt
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Die Wochenziel-Zählung fasst die Übezeit JE TAG zusammen: Ein Tag mit genug
 * Minuten ist eine Einheit. Solange die Wochengrenze um 22:00 lag, war die
 * Vereinfachung „ein Tag gehört ganz einer Woche" harmlos.
 *
 * Mit einer Ende-Uhrzeit ist sie es nicht mehr: Endet die Woche z. B. am
 * Dienstag um 14:00, dann gehört, was das Kind um 15:00 übt, zur NEUEN
 * Woche - was es um 8:00 geübt hat, zur endenden. Derselbe Kalendertag, zwei
 * Wochen.
 *
 * ⇒ Der Grenztag bekommt ZWEI Schlüssel: Mitternacht für alles davor, den
 *   Grenz-Zeitpunkt selbst für alles danach. Weil der Schlüssel ein Zeitpunkt
 *   ist, ordnet ihn {@link wochenStartFuerTag} von selbst der richtigen Woche
 *   zu - es braucht keine zweite Zuordnungsregel daneben.
 */
export function uebungstagSchluessel(
  ts: number,
  r: Wochenrhythmus | null,
): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  const mitternacht = d.getTime();
  if (!r) return mitternacht;
  const g = wochengrenze(r);
  const dow = ((new Date(ts).getDay() + 6) % 7) as Wochentag;
  if (dow !== g.tag) return mitternacht;
  const grenzeAmTag = mitternacht + g.minute * 60_000;
  return ts >= grenzeAmTag ? grenzeAmTag : mitternacht;
}
