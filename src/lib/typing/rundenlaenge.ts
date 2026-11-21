/**
 * Wie lang ist EINE Runde - in Zeilen, und was ist sie fürs Tor wert?
 *
 * ── Der Anlass (Johannes, 29.08.2026) ───────────────────────────────────────
 * Gemessen (`scripts/_langsam.mts`) brauchen ALLE Kinder für eine neue Taste
 * dieselbe Zahl RUNDEN: 5, 6, 6, 7, 8, 8, dann 9 - unabhängig vom Tempo. Eine
 * Runde ist aber eine feste Zahl ZEILEN und damit eine feste Zahl Zeichen. Für
 * ein Kind mit 190 Anschlägen/min dauert die letzte Runde vor einer neuen Taste
 * 2,5 Minuten, für ein Kind mit 30 Anschlägen/min **16 Minuten**: sechzehn
 * Minuten ohne Pause, ohne Stern, ohne Rückmeldung - während das schnelle Kind
 * alle zweieinhalb Minuten eine Belohnung bekommt. Das trifft besonders Kinder
 * mit einer körperlichen Einschränkung, die nicht schneller werden können.
 *
 * ── Was hier NICHT passiert ─────────────────────────────────────────────────
 * Die Übung wird nicht gekürzt. Johannes' Grundsatz vom 28.08. gilt weiter:
 * „Es gibt auch ein zu früh. Genauigkeit vor Geschwindigkeit. Übezeit ist
 * wichtig." Das Pensum bis zur nächsten Taste bleibt gleich - es wird nur
 * anders GETEILT: mehr, dafür kürzere Runden.
 *
 * Deshalb hängen die beiden Funktionen hier zusammen und dürfen nie einzeln
 * geändert werden:
 *   • {@link zeilenJeRunde} gibt einem langsamen Kind weniger Zeilen je Runde,
 *   • {@link rundenWert} lässt eine kürzere Runde fürs Tor entsprechend weniger
 *     zählen - sonst käme die neue Taste doppelt so früh.
 * Für ein Kind mit üblichem Tempo ändert sich nichts: 12 Zeilen, Wert 1,0.
 */

/** Zeilen einer vollen Runde - der Maßstab, auf den alles normiert ist. */
export const STANDARD_ZEILEN = 12;

/**
 * So lange darf eine Runde höchstens dauern, bevor sie geteilt wird (Minuten).
 *
 * Sechs Minuten, weil eine volle Runde beim schnellsten gemessenen Kind 2,5 min
 * dauert und beim langsamsten 16 min: Die Grenze greift also erst deutlich
 * jenseits dessen, was ein Kind mit üblichem Tempo je erlebt, und sie lässt auch
 * einem langsamen Kind eine Runde, in der etwas zusammenhängend passiert.
 */
export const RUNDE_ZIEL_MINUTEN = 6;

/** Kürzer als so viele Zeilen wird eine Runde nie - sonst zerfällt das Üben. */
export const MIN_ZEILEN_JE_RUNDE = 4;

/**
 * Zeichen je Zeile (mit Leerzeichen) nach Zahl der freigeschalteten Einheiten -
 * GEMESSEN mit `scripts/_zeilenlaenge.mts` am 29.08.2026, Schnitt aus je 40
 * Runden. Index 0 = 2 Einheiten (f und j), letzter Eintrag = 24.
 *
 * Warum eine gemessene Tabelle und keine Formel: Die Zeilen werden nicht
 * gerechnet, sondern aus dem Korpus gewählt - ab 13 Einheiten springt die Länge
 * (10,9 → 20,1), weil dort die ersten echten Sätze passen. Eine glatte Formel
 * würde genau diesen Sprung verschlucken.
 *
 * ⚠️ Jenseits von 24 Einheiten (Satzzeichen, Ziffern, Sonderzeichen) gilt der
 * letzte Wert weiter. Das UNTERschätzt die Zeile eher - und unterschätzen ist
 * die sichere Richtung: die Runde wird dann seltener geteilt, nie zu oft.
 */
const ZEICHEN_JE_ZEILE = [
  11.1, 10.9, 10.9, 11.1, 10.9, 12.8, 12.8, 13.5, 13.5, 14.2, 15.0, 20.1, 20.4,
  20.4, 20.4, 21.0, 22.9, 24.1, 28.3, 30.3, 32.7, 34.6, 35.5,
];

/** Wie lang ist eine Zeile bei so vielen freigeschalteten Einheiten? */
export function zeichenJeZeile(anzahlEinheiten: number): number {
  const i = Math.round(anzahlEinheiten) - 2;
  if (!(i > 0)) return ZEICHEN_JE_ZEILE[0];
  return ZEICHEN_JE_ZEILE[Math.min(i, ZEICHEN_JE_ZEILE.length - 1)];
}

/** Wie lange dauert eine Runde aus so vielen Zeilen bei diesem Tempo (Minuten)? */
export function rundeMinuten(
  zeilen: number,
  anzahlEinheiten: number,
  cpm: number,
): number {
  if (!(cpm > 0)) return 0;
  return (zeilen * zeichenJeZeile(anzahlEinheiten)) / cpm;
}

/**
 * Wie viele Zeilen bekommt DIESES Kind in der nächsten Runde?
 *
 * `cpm` ist sein übliches Rundentempo (`progress.speedEma`). Fehlt es (neues
 * Konto, noch nichts gemessen), bleibt es bei der vollen Runde - lieber einmal
 * zu lang als von Anfang an zerstückelt.
 *
 * Die Runde wird NUR gekürzt, nie verlängert: Wer schnell tippt, merkt von
 * dieser Regel nichts.
 */
export function zeilenJeRunde(
  cpm: number | undefined,
  anzahlEinheiten: number,
): number {
  if (!cpm || !(cpm > 0)) return STANDARD_ZEILEN;
  const voll = rundeMinuten(STANDARD_ZEILEN, anzahlEinheiten, cpm);
  if (voll <= RUNDE_ZIEL_MINUTEN) return STANDARD_ZEILEN;
  const gekuerzt = Math.floor((STANDARD_ZEILEN * RUNDE_ZIEL_MINUTEN) / voll);
  return Math.max(MIN_ZEILEN_JE_RUNDE, Math.min(STANDARD_ZEILEN, gekuerzt));
}

/**
 * So lange muss an einer Runde wirklich GETIPPT worden sein, damit sie fürs Tor
 * voll zählt (Minuten reine Tippzeit).
 *
 * Der Gegenpol zu {@link RUNDE_ZIEL_MINUTEN}, Entscheidung Johannes 29.08.2026:
 * „Bei 100 Anschlägen ist das etwas schnell, mach es leicht langsamer." Gemessen
 * (`scripts/_langsam.mts`) kam ein Kind mit 190 Anschlägen/min alle 3,6 Minuten
 * zu einer neuen Taste, bei 100 alle 6,7 - vor allem in der Grundreihe, wo die
 * Zeilen noch kurz sind und eine ganze Runde unter zwei Minuten dauert. Genau
 * dort sitzt aber die Technik, die Zeit braucht (Finger finden, nicht hinsehen).
 *
 * ⚠️ Gemessen wird die reine Tippzeit (`RoundDetail.ms`), nicht die Wanduhr:
 * Wartezeit auf das Vorlesen zählt nicht mit, und eine Pause macht die Runde
 * nicht wertvoller.
 *
 * ⚠️ Ein LANGSAMES Kind merkt davon nichts - seine Runden dauern ohnehin länger.
 * Die Regel bremst nur dort, wo es schnell geht.
 */
export const RUNDE_VOLL_MINUTEN = 2;

/**
 * Der AUSGLEICH für ein Kind, das nicht schneller werden kann.
 *
 * Entscheidung Johannes 29.08.2026: „Es soll nicht ganz ausgeglichen werden -
 * wer so viel langsamer tippt, braucht auch länger für die nächste Taste. Aber
 * der Unterschied zwischen schnell und langsam soll etwas geringer werden."
 *
 * Eine GEKÜRZTE Runde zählt um diesen Faktor mehr, als ihre Zeilen hergeben.
 * Die beiden Enden der Skala:
 *   • 1,0 hieße „genau gleich viel Übung wie alle" - der Zeitunterschied bliebe
 *     in voller Höhe bestehen.
 *   • Der Kehrwert der Tempo-Spanne hieße „ganz ausgeglichen" - dann übte ein
 *     langsames Kind viel weniger als ein schnelles, nur damit die Uhr gleich
 *     aussieht. Das ist ausdrücklich nicht gewollt.
 * 1,25 liegt dazwischen: Ein langsames Kind übt weiterhin am längsten, aber die
 * Spanne schrumpft. Gemessen mit `scripts/_langsam.mts` (95 % Treffsicherheit,
 * bis alle 24 Tasten frei sind) - vorher/nachher, also mit ALLEN drei Reglern
 * dieser Datei zusammen:
 *
 *    30/min   25,2 h  →  19,7 h
 *   100/min    7,8 h  →   7,7 h      Spanne schnell↔langsam
 *   190/min    4,1 h  →   5,5 h      vorher 6,1-fach · nachher 3,6-fach
 *
 * In der Grundreihe, wo die Technik entsteht, ist der Ausgleich am stärksten -
 * dort wirkt zusätzlich die flachere Rampe in `letters.ts`:
 *
 *    30/min    182 min  →  108 min
 *   100/min     55 min  →   45 min   Spanne vorher 6,3-fach
 *   190/min     29 min  →   41 min   nachher 2,6-fach
 *
 * ⚠️ Wirkt NUR auf gekürzte Runden. Eine volle Runde zählt weiterhin 1,0 - ein
 * schnelles Kind bekommt hier nichts geschenkt und nichts genommen.
 */
export const AUSGLEICH_LANGSAM = 1.25;

/**
 * Was zählt eine geschaffte Runde für das Tor zur nächsten Taste? 1,0 = eine
 * volle Runde. Zwei Deckel, beide nach unten:
 *   • nach ZEILEN - eine gekürzte Runde ist weniger Übung ({@link zeilenJeRunde}),
 *   • nach ZEIT - eine in Sekunden weggetippte Runde auch
 *     ({@link RUNDE_VOLL_MINUTEN}).
 * In einem Satz: **Eine Runde zählt voll, wenn sie 12 Zeilen hatte UND mindestens
 * zwei Minuten lang getippt wurde.**
 *
 * `ms` ist die reine Tippzeit der Runde. Fehlt sie (alter Stand, Runde ohne
 * Messung), entscheiden allein die Zeilen - nie soll eine fehlende Messung ein
 * Kind bremsen.
 *
 * ⚠️ NIE MEHR ALS 1,0. Eine Serien-Etappe ist im Schnitt länger als eine
 * Übungsrunde (~18 statt 12 Zeilen); sie soll nach Johannes' Entscheidung vom
 * 28.07.2026 „genauso viel zählen wie eine Übungsrunde", nicht mehr. Die
 * Deckelung hält diese Entscheidung, während die Kürzung nach unten greift.
 *
 * Ob eine lange Etappe MEHR zählen sollte, ist eine offene Frage an Johannes -
 * sie ist hier bewusst nicht beantwortet.
 *
 * ⚠️ Wo der Deckel und der Ausgleich sich treffen (bei 10 und 11 Zeilen), zählt
 * eine knapp gekürzte Runde volle 1,0 statt 1,04 bzw. 1,15. Das ist der Deckel,
 * nicht ein Fehler: Er erspart dem Kind ein paar Zeilen und kann ihm nie welche
 * aufhalsen. Der Test »der Deckel gewinnt am Rand« hält das fest.
 */
export function rundenWert(
  zeilen: number,
  ms?: number,
  /** Nur fürs Messen: `scripts/_langsam.mts` probiert damit andere Werte durch. */
  vollMinuten: number = RUNDE_VOLL_MINUTEN,
  /** Nur fürs Messen: derselbe Zweck für {@link AUSGLEICH_LANGSAM}. */
  ausgleich: number = AUSGLEICH_LANGSAM,
): number {
  const anteil = zeilen > 0 ? zeilen / STANDARD_ZEILEN : 1;
  // Der Ausgleich gilt nur für die GEKÜRZTE Runde eines langsamen Kindes.
  const nachZeilen = anteil < 1 ? anteil * ausgleich : anteil;
  const nachZeit = ms != null && ms > 0 ? ms / 60000 / vollMinuten : 1;
  return Math.max(0, Math.min(1, nachZeilen, nachZeit));
}
