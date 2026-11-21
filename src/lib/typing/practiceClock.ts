/**
 * Übezeit-Uhr der aktuellen Lernsession von „Tastenflow".
 *
 * Zählt die Zeit, in der wirklich getippt wird. Jeder Anschlag hält die Uhr bis
 * zur Pausentoleranz ({@link IDLE_CAP_MS}, 30 s) danach am Laufen; folgt
 * innerhalb dieser Spanne der nächste Anschlag, läuft sie nahtlos weiter. Erst
 * bei längerer Tipp-Pause hält sie an und springt beim nächsten Anschlag wieder
 * an. Die Uhr ist damit die Vereinigung der Intervalle [Anschlag, Anschlag +
 * Toleranz] — rein aus Zeitstempeln berechnet, ohne Hintergrund-Timer.
 *
 * ⚠️ Dieser Text nannte bis zum 01.09.2026 noch die alten 5 s, obwohl daneben
 * längst 30 stand - genau die Sorte Halbwahrheit, die man beim Lesen glaubt,
 * statt sie nachzumessen.
 *
 * Für Kinder mit „Zeit lassen" ist die Toleranz seit dem 14.08.2026 größer
 * ({@link IDLE_CAP_SLOW_MS}, siehe {@link setPracticeIdleCap}); seit dem
 * 01.09.2026 ist sie für ALLE so groß. Wer alle 7,5 s einen Anschlag schafft,
 * verlor mit den festen 5 s ein Drittel seiner gesessenen Zeit — und damit
 * sein Wochenziel.
 *
 * Modul-weit (kein React-State), damit der Stand beim Wechsel zwischen „Mein
 * Training" und „Lektionen" und über die Runden hinweg erhalten bleibt. Beim
 * Laden wird die Uhr über {@link primePracticeClock} aus den gespeicherten
 * Übungs-Ereignissen des Tages aufgesetzt — sie überlebt damit ein Neuladen und
 * zeigt auch Übezeit von anderen Geräten desselben Tages. Zusätzlich wird die
 * Uhr um 0:00 Uhr (lokale Mitternacht) automatisch auf null gestellt — sie
 * zeigt damit die heute geübte Zeit.
 *
 * Die Uhr ist zugleich die EINE Zeitrechnung der Telemetrie: Beim Abschluss
 * jeder Zeile holt sich die Session über {@link takePracticeDelta} den
 * Uhr-Zuwachs seit der letzten Meldung als `activeMs` des Ereignisses. Die
 * Summe der gespeicherten `activeMs` ist damit GENAU der Uhrstand — Übezeit-Uhr
 * und Wochenziel-Kreise können nicht mehr auseinanderlaufen (Wunsch Johannes
 * 08.07., vorher zählte die Uhr Zwischen-Zeilen- und Vorlese-Zeiten, die
 * Telemetrie nicht). Siehe [[project_zehnfinger_trainer]].
 */
import { GOAL_CHANGE_LESSON, type Lang, type TaskEvent } from "./account";
import { mehrzahl } from "../bedienSprache/texte";
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ PAUSENTOLERANZ 30 s - WARUM 5 s FALSCH WAREN (gemessen 01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, zum wiederholten Mal: *„die Übezeiten sind immer noch nicht gleich
 * mit dem was ein Kind angezeigt bekommt! Das Kind sagt ich hab 20 min
 * gearbeitet, der Lehrer sagt stimmt nicht es waren nur 18 min. Das darf nicht
 * sein."*
 *
 * ── Was gemessen wurde (Janos echte Daten vom Server) ──────────────────────
 * Zuerst der Verdacht, den die Messung WIDERLEGT hat: Kind-Ansicht und
 * Lehrkraft-Ansicht rechnen NICHT verschieden. Beide kommen auf dieselbe Zahl,
 * auf zwei Nachkommastellen genau - `buildDayPractice` (Wochenziel-Ringe) und
 * `computePupilStats` (Statistik) lieferten für jeden von Janos 14 Übungstagen
 * denselben Wert. Es gab nie zwei Rechnungen.
 *
 * Der Unterschied lag zwischen dem, was das Kind ERLEBT, und dem, was die App
 * ZÄHLT. Für den 31.08.: gesessen 15,8 Min, gezählt 12,5 Min - also 2,1
 * Sekunden je Zeile verworfen, bei 66 Zeilen gut drei Minuten.
 *
 * ── Wo die Sekunden blieben ────────────────────────────────────────────────
 * Die Uhr ist die Vereinigung der Intervalle [Anschlag, Anschlag + Toleranz].
 * Mit 5 s hiess das: **Jede Lesepause, die länger als fünf Sekunden dauert,
 * verliert alles darüber.** Und genau diese Pause ist bei einem Kind mit
 * Blindheit keine Pause: Es HÖRT die nächste Zeile. Die Ansage einer
 * Übungszeile dauert regelmässig sieben bis zehn Sekunden - das ist Übezeit,
 * die vollständigste, die es gibt, und sie fiel systematisch heraus.
 *
 * ── Warum genau 30 s, und warum das keine neue Zahl ist ────────────────────
 * Sie steht seit dem 14.08.2026 in dieser Datei - als Ausnahme für „Zeit
 * lassen", mit exakt derselben Begründung: *„Mit den festen 5 s verschluckte
 * die Uhr rund ein Drittel der wirklich gesessenen Zeit - das Wochenziel war
 * für das Kind unerreichbar, obwohl es LÄNGER übte als alle anderen."* Was
 * damals für langsam schreibende Kinder galt, gilt für jedes Kind, das sich
 * die Zeile vorlesen lässt. Die Ausnahme wird darum zur Regel.
 *
 * ⚠️ 30 s deckt Ansage und Nachdenken ab, aber nicht das Weggehen: Wer den
 * Platz verlässt, macht ohnehin eine längere Pause, und die Uhr hält an.
 *
 * ── ★★★★★ WARUM NICHT 7 s - AN ZWEI KINDERN GEMESSEN (01.09.2026) ─────────
 *
 * Johannes fragte zu Recht nach: *„blinde kinder hören extrem schnell, wie
 * kommen wir auf 30 sec, auch eine lange zeile dauert nie länger wie 7 sec?"*
 * Die Antwort steht in den Pausen ZWISCHEN zwei Zeilen (`scripts/_uhrregel.mts`).
 * SIEBEN Kinder, 5.026 gemessene Zeilenwechsel, Gruppen von Johannes benannt:
 *
 *                    Zeilen  Anschl./Min      >3 s    >5 s   >10 s   >30 s
 *     Hana    blind     798          131      76 %    46 %    22 %   4,4 %
 *     Sarah   blind     687          233      74 %    46 %    20 %   1,9 %
 *     Tester  blind     222          100      97 %    93 %    80 %    28 %
 *     ► BLIND          1680                   78 %    52 %    29 %   6,4 %
 *
 *     Jano    sehend   1117          194      15 %    11 %   6,3 %   3,1 %
 *     Tester sehend   1000          210      13 %   6,8 %   3,4 %   1,4 %
 *     Marcel  sehend    919          142      18 %   9,1 %   5,9 %   2,5 %
 *     Sebast. sehend    359          124      48 %    32 %    20 %   4,6 %
 *     ► SEHEND         3346                   19 %    11 %   6,8 %   2,6 %
 *
 * ★★★ 78 % gegen 19 % - und das ist NICHT Langsamkeit. Sarah tippt mit 233
 *   Anschlägen/Min am schnellsten von allen sieben. Die Pause ist die Zeit, in
 *   der sie die nächste Zeile überhaupt erst aufnimmt: hören oder auf der
 *   Braillezeile lesen. Die Sehenden sehen sie in einem Blick.
 *
 * ⚠️ Das ist der Grund, warum diese Zahl NICHT am eigenen Tippgefühl geprüft
 *   werden darf. Wer sehend nachfühlt, kommt auf 5 bis 7 Sekunden - richtig
 *   für die sehende Mehrheit und um ein Vielfaches daneben für die Kinder, um
 *   die es geht. Was eine kleinere Toleranz von der Übezeit wegnähme:
 *
 *              bei  7 s   bei 10 s
 *     Tester     -55 %      -44 %
 *     Hana       -31 %      -22 %
 *     Sarah      -14 %      -9 %
 *     Tester     -5 %      -4 %
 *
 * ★ Tester liegt schon bei 28 % der Zeilenwechsel ÜBER den heutigen 30 s. Für
 *   ihn ist die Toleranz eher zu klein als zu gross - eine Senkung wäre bei
 *   ihm keine Feinjustierung, sondern die Halbierung seiner Übezeit.
 *
 * ⇒ Der Unterschied zwischen 15 % und 74 % ist der Preis des nicht-visuellen
 *   Lesens, gemessen. Eine Toleranz von 7 s schnitte genau dort hinein: Sie
 *   kostete die Gruppe mit Blindheit 14 bis 55 % ihrer Übezeit, die sehende
 *   5 bis 12 % - das Wochenziel steht in MINUTEN, also hätte die Uhr
 *   angefangen, die Blindheit zu messen statt der Übung
 *   ([[feedback_nie_gegen_das_kind]], [[feedback_messtoleranz_bei_gemessenem]]).
 *
 * ⚠️ Bei fünf der sieben liegen unter 3,2 % der Pausen über 30 s. Die grosse Toleranz
 *   verschenkt also fast nichts - sie fängt nur die auf, die länger lesen.
 *   Wer diese Zahl je senken will, misst vorher an einem Kind mit Blindheit
 *   nach, nicht an sich selbst.
 *
 * ★ Die Uhr bleibt die EINE Quelle: Was sie zählt, wird als `activeMs` des
 * Ereignisses gespeichert, und daraus rechnen Ringe, Statistik und
 * Lehrkraft-Tabelle. Es gibt nichts „anzugleichen" - es gab immer nur eine
 * Zahl, sie war nur zu klein.
 */
export const IDLE_CAP_MS = 20000;

/**
 * Pausentoleranz für Kinder mit „Tempo zählt nicht" ({@link setPracticeIdleCap}).
 *
 * ★ Reparatur 14.08.2026: Mit den festen 5 s verschluckte die Uhr bei 8
 * Anschlägen pro Minute (ein Anschlag alle 7,5 s) rund ein Drittel der
 * wirklich gesessenen Zeit — das Wochenziel war für das Kind unerreichbar,
 * obwohl es LÄNGER übte als alle anderen.
 *
 * ★★★ 60 s seit dem 01.09.2026 (Johannes: *„bei der Einstellung Tempo zählt
 * nicht … da könnten wir 60 sec nehmen"*). Bis dahin stand hier dieselbe Zahl
 * wie in der Regel - der Schalter änderte an der Uhr also GAR NICHTS, obwohl
 * er es sollte. Jetzt trägt er wieder etwas:
 *
 *     Regel                 20 s
 *     „Tempo zählt nicht"   60 s
 *
 * Das ist die Antwort auf ein gemessenes Problem. Tester (blind) liegt bei
 * 28 % der Zeilenwechsel über 30 s - für ihn ist selbst die alte Regel zu
 * klein, und die neuen 20 s hätten ihm ein Sechstel seiner Übezeit genommen.
 * Mit dem Schalter bekommt er MEHR als vorher. Wer so ein Kind unterrichtet,
 * setzt ihm den Schalter; entschieden wird das dort, wo man das Kind sieht.
 *
 * ⚠️ Der Schalter tut zweierlei: Er nimmt das Tempo aus jeder Bewertung UND er
 * verdreifacht die Pausentoleranz. Wer das je trennen will, braucht eine
 * zweite Einstellung - nicht eine andere Bedeutung für diese.
 */
export const IDLE_CAP_SLOW_MS = 60000;

/* ══════════════════════════════════════════════════════════════════════════
 * ★★★★★ DIE TOLERANZ WÄCHST MIT DEM KIND (Johannes, 01.09.2026)
 * ══════════════════════════════════════════════════════════════════════════
 *
 * *„c ist ein guter vorschlag, aber dann mach untergrenze 5 sec, wenn sie eh
 * dynamisch ist."*
 *
 * Eine feste Zahl kann nicht für alle stimmen. Gemessen an den Pausen zwischen
 * zwei Zeilen (`scripts/_uhrregel.mts`) liegen Kinder mit Blindheit bei 78 %
 * Pausen über 3 s, sehende bei 19 % - und das ist nicht Langsamkeit, sondern
 * die Zeit fürs Hören bzw. die Braillezeile. Wer eine Zahl für alle wählt,
 * wählt gegen die eine oder die andere Gruppe.
 *
 * ⇒ EINE Regel für alle, aber je Kind aus SEINEN EIGENEN Pausen gerechnet.
 *   Das ist keine Sonderregel und keine Einstellung: Es gibt nichts zu wählen
 *   und nichts zu vergessen. Dasselbe Prinzip benutzt `letters.personalBaseMs`
 *   längst für die Anschlags-Grundgeschwindigkeit.
 *
 * ── Warum das 90. Perzentil ────────────────────────────────────────────────
 * Gemessen an 15 Konten mit Daten (01.09.2026) - die Toleranz, die jede
 * Kennzahl ergäbe:
 *
 *                        p90      p95      p98
 *     Tester  (blind)   57,3 s   60,0 s   60,0 s
 *     Hana    (blind)   17,5 s   26,5 s   55,5 s
 *     Sarah   (blind)   14,2 s   19,3 s   27,0 s
 *     Jano    (sehend)   5,0 s   14,2 s   46,5 s
 *     Tester (sehend)   5,0 s    6,7 s   20,4 s
 *
 * ★★★★★ ENTSCHIEDEN: 90 - und zwar aus einem Grund, der NICHT in den Daten
 * steht. Ich hatte 95 vorgeschlagen, weil es Tester 38 % mehr Übezeit gegeben
 * hätte. Johannes, der ihn unterrichtet: *„bleib bei 90 %, Tester macht nach
 * vielen Zeilen einen Kasperl, der soll sich konzentrieren und dabei bleiben,
 * wegen ihm machen wir nicht lascher."*
 *
 * ⇒ Seine langen Pausen sind NICHT Lesen. Das war meine Annahme, und sie war
 *   falsch - aus den Zeitstempeln allein ist „liest noch" von „ist gerade
 *   woanders" nicht zu unterscheiden. Wer diese Zahl je wieder anfasst, fragt
 *   ZUERST die Lehrkraft, was das Kind in diesen Pausen tut, und rechnet erst
 *   danach. Die Daten sagen, WIE LANG die Pause war; nur der Unterricht sagt,
 *   was sie war.
 *
 * ⚠️ Was 90 kostet: Bei Kindern, deren Pausen fast alle unter 5 s liegen (Jano,
 * Tester, Marcel, Samuel, Rebecca), greift die Untergrenze - gegenüber der
 * festen 20-s-Regel sind das 6 bis 10 % weniger angezeigte Übezeit. Das ist
 * kein Verlust an Übung, sondern eine ehrlichere Uhr: In diesen Pausen wurde
 * wirklich nicht getippt.
 *
 * ⚠️ Und in die andere Richtung: Wer sehend nachfühlt, kommt auf 5 bis 7
 * Sekunden für alle. Für ein Kind mit Blindheit ist das um ein Vielfaches zu
 * eng - deshalb wird hier gerechnet und nicht geschätzt.
 */

/** Untergrenze (Johannes 01.09.): Sie greift nur bei Kindern, deren Pausen
 *  ohnehin alle kurz sind - denen nimmt sie darum nichts. */
export const IDLE_CAP_MIN_MS = 5000;

/**
 * So viele Zeilenwechsel braucht es, bevor gerechnet statt vorgegeben wird.
 * Darunter ist das Perzentil Zufall: Bei 20 Lücken bestimmen zwei Ausreisser
 * das Ergebnis. Bis dahin gilt {@link IDLE_CAP_MS} - lieber die Vorgabe als
 * eine Zahl, die morgen ganz anders aussieht.
 */
export const TOLERANZ_MIN_LUECKEN = 60;

/**
 * Welches Perzentil der eigenen Pausen die Toleranz setzt. 0,90 heisst: Die
 * längsten zehn Prozent der Pausen werden gekappt. Entscheidung Johannes
 * 01.09.2026 - die Begründung steht oben und ist eine UNTERRICHTLICHE, keine
 * rechnerische.
 */
export const TOLERANZ_PERZENTIL = 0.9;

/** Grösser als das ist kein Zeilenwechsel, sondern eine neue Übungssitzung. */
const LUECKE_MAX_MS = 30 * 60_000;

/**
 * Die Pausen ZWISCHEN zwei Zeilen desselben Tages. Dort sitzt das Lesen: Die
 * Zeile endet, die Ansage läuft oder die Braillezeile wird abgetastet, dann
 * beginnt die nächste. Ziel-Wechsel-Marker sind keine Übung und zählen nicht.
 */
export function zeilenLuecken(events: readonly TaskEvent[]): number[] {
  const ev = events
    .filter((e) => e.ts > 0 && e.lesson !== GOAL_CHANGE_LESSON)
    .slice()
    .sort((a, b) => a.ts - b.ts);
  const tag = (ts: number) => {
    const d = new Date(ts);
    return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
  };
  const out: number[] = [];
  for (let i = 1; i < ev.length; i++) {
    if (tag(ev[i - 1].ts) !== tag(ev[i].ts)) continue;
    const l = ev[i].ts - Math.max(0, ev[i].ms || 0) - ev[i - 1].ts;
    if (l >= 0 && l < LUECKE_MAX_MS) out.push(l);
  }
  return out;
}

/**
 * Die Pausentoleranz für DIESES Kind.
 *
 * ★ „Tempo zählt nicht" bleibt die klare Ansage der Lehrkraft und hat Vorrang:
 *   Dort gilt die Obergrenze, ohne Rechnerei. Wer den Schalter setzt, will
 *   nicht, dass eine Kennzahl ihn wieder einholt.
 */
export function toleranzFuer(
  events: readonly TaskEvent[] | null | undefined,
  zeitLassen: boolean,
): number {
  if (zeitLassen) return IDLE_CAP_SLOW_MS;
  const l = zeilenLuecken(events ?? []);
  if (l.length < TOLERANZ_MIN_LUECKEN) return IDLE_CAP_MS;
  const s = [...l].sort((a, b) => a - b);
  const p = s[Math.min(s.length - 1, Math.floor((s.length - 1) * TOLERANZ_PERZENTIL))];
  return Math.min(IDLE_CAP_SLOW_MS, Math.max(IDLE_CAP_MIN_MS, p));
}

let idleCapMs = IDLE_CAP_MS;

/**
 * Pausentoleranz umstellen (siehe {@link IDLE_CAP_SLOW_MS}). Die Seite ruft das
 * auf, sobald sie weiß, ob „Zeit lassen" für diese Person gilt. Der laufende
 * Abschnitt wird dabei NICHT angetastet — die neue Toleranz greift ab dem
 * nächsten Anschlag.
 */
export function setPracticeIdleCap(ms: number): void {
  idleCapMs = Math.max(1000, Math.round(ms));
}

/** Aktuelle Pausentoleranz (ms) — für Anzeige und Wächter. */
export function practiceIdleCap(): number {
  return idleCapMs;
}

/** Übezeit abgeschlossener Abschnitte (vor der letzten längeren Pause). */
let committedMs = 0;
/** Start des laufenden aktiven Abschnitts (ms), oder -1, wenn gerade keiner läuft. */
let segStart = -1;
/** Ende des laufenden Abschnitts = letzter Anschlag + IDLE_CAP. */
let segEnd = 0;
/** Lokale Mitternacht (ms) des Tages, zu dem der aktuelle Stand gehört (-1 = noch keiner). */
let dayStart = -1;
/** Bereits per {@link takePracticeDelta} als Telemetrie gemeldete Übezeit (ms). */
let reportedMs = 0;
/** Konto, für das die Uhr gerade läuft (Kontowechsel am selben Gerät = Reset). */
let ownerKey: string | null = null;

/** Lokale Mitternacht (00:00) des Tages, in dem `now` liegt. */
function localDayStart(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Ist seit dem letzten Stand ein neuer Kalendertag angebrochen? Dann die Uhr auf
 * null stellen (Mitternachts-Reset). Wird vor jedem Lesen UND jedem Anschlag
 * aufgerufen, damit der Reset auch ohne Tastendruck (laufende Anzeige) greift.
 */
function rolloverIfNewDay(now: number): void {
  const ds = localDayStart(now);
  if (dayStart < 0) {
    dayStart = ds;
  } else if (ds !== dayStart) {
    committedMs = 0;
    segStart = -1;
    segEnd = 0;
    reportedMs = 0;
    dayStart = ds;
  }
}

/** Bei JEDEM Anschlag aufrufen — hält die Uhr am Laufen bzw. weckt sie auf. */
export function notePracticeActivity(now: number = Date.now()): void {
  rolloverIfNewDay(now);
  if (segStart < 0) {
    // neuer aktiver Abschnitt
    segStart = now;
    segEnd = now + idleCapMs;
  } else if (now <= segEnd) {
    // innerhalb der 5-s-Toleranz → Abschnitt nahtlos verlängern
    segEnd = now + idleCapMs;
  } else {
    // längere Pause → vorigen Abschnitt abschließen, neuen beginnen
    committedMs += segEnd - segStart;
    segStart = now;
    segEnd = now + idleCapMs;
  }
}

/** Aktuelle Übezeit (ms) der laufenden Lernsession. */
export function getPracticeMs(now: number = Date.now()): number {
  rolloverIfNewDay(now);
  if (segStart < 0) return committedMs;
  // der laufende Abschnitt zählt bis JETZT, höchstens aber bis segEnd (dann Pause).
  return committedMs + (Math.min(now, segEnd) - segStart);
}

/**
 * Läuft die Uhr gerade — wird also in diesem Augenblick geübt?
 *
 * Genau dann wahr, wenn der letzte Anschlag noch keine volle Pausentoleranz
 * her ist ({@link IDLE_CAP_MS}, bei „Zeit lassen" {@link IDLE_CAP_SLOW_MS}).
 * Das ist DIESELBE Grenze, an der die Uhr anhält — die Stand-Zeile unter dem
 * Übungsfeld blendet sich danach aus und wieder ein ({@link StandZeile}).
 *
 * Bewusst KEINE eigene Zeitschwelle für die Anzeige: Ein Kind mit „Zeit
 * lassen" schlägt alle 7,5 s eine Taste an. Mit festen 5 s für die Anzeige
 * würde die Zeile zwischen zwei Anschlägen ständig auf- und abblenden - genau
 * das Flackern, das niemand haben will.
 *
 * (Bis 11.09.2026 stand hier auch `isPracticing()`, entfernt weil ungenutzt.)
 */

/** Setzt die Uhr zurück (neue Lernsession/Kontowechsel). */
export function resetPracticeClock(): void {
  committedMs = 0;
  segStart = -1;
  segEnd = 0;
  reportedMs = 0;
  dayStart = -1;
  ownerKey = null;
  /*
   * ★★★★★ DIE TOLERANZ GEHÖRT ZUM KIND, NICHT ZUM GERÄT (01.09.2026).
   *
   * Sie fehlte hier - und das fiel erst auf, als sie persönlich wurde. Vorher
   * war sie für alle gleich, ein stehengebliebener Wert also folgenlos.
   *
   * Der Weg, auf dem es weh tut, ist der Klassenzimmer-Rechner: Jano übt
   * (Toleranz vielleicht 8 s), meldet sich ab, Tester meldet sich an. Ohne
   * diese Zeile liefe Tester mit Janos 8 s - und bei ihm liegen 28 % der
   * Zeilenwechsel über 30 s. Genau der Verlust, gegen den die persönliche
   * Toleranz gebaut wurde, nur über den Umweg des vorigen Kindes.
   *
   * Sie deckt zugleich den zweiten Fall ab: Die Seite setzt die Toleranz erst,
   * wenn die Ereignisse da sind. Kommen sie nie (Netz weg), gilt die Vorgabe -
   * und nicht der Wert des Kindes davor.
   *
   * ⚠️ Ein Test dafür braucht ZWEI Konten nacheinander im selben Modul-Leben.
   * Einer, der eine Seite mit EINEM Konto rendert, sieht es nie
   * ([[feedback_gruener_waechter_beweist_was]]).
   */
  idleCapMs = IDLE_CAP_MS;
}

/**
 * Uhr-Zuwachs seit der letzten Meldung — als `activeMs` des gerade beendeten
 * Übungs-Ereignisses. Jede Millisekunde der Uhr wird GENAU EINMAL gemeldet;
 * die Summe aller gemeldeten Werte ist damit exakt der Uhrstand (die Zeit
 * zwischen zwei Zeilen — Lesen, Ansage hören, kurze Denkpause bis zur
 * Toleranz — gehört
 * zur Zeile, die sie abschließt). Direkt beim Zeilenabschluss aufrufen.
 */
export function takePracticeDelta(now: number = Date.now()): number {
  const cur = getPracticeMs(now); // erledigt auch den Mitternachts-Reset
  const delta = Math.max(0, cur - reportedMs);
  reportedMs = cur;
  return delta;
}

/**
 * Übezeit, die die Uhr schon zählt, aber noch NICHT als Ereignis gespeichert ist
 * — also der Zuwachs der laufenden, noch nicht abgeschlossenen Zeile.
 *
 * Die Wochenziel-Kreise rechnen aus den gespeicherten Ereignissen; ohne diesen
 * Rest hinkten sie der Uhr um bis zu eine Zeile hinterher, und genau das sollte
 * nicht mehr passieren (Johannes 27.07.: Uhr und Kreise dürfen nicht
 * auseinanderlaufen). `gespeichert + pending` ergibt exakt den Uhrstand.
 */
export function pendingPracticeMs(now: number = Date.now()): number {
  return Math.max(0, getPracticeMs(now) - reportedMs);
}

/**
 * Setzt die Uhr beim Laden auf die heute schon GESPEICHERTE Übezeit auf
 * (Summe der `activeMs` der heutigen Übungs-Ereignisse). Die Uhr überlebt so
 * ein Neuladen und zählt Übezeit anderer Geräte desselben Tages mit — sie
 * zeigt dasselbe „heute geübt" wie die Wochenziel-Kreise.
 *
 * `owner` ist das Konto (bzw. "anon"): Meldet sich am selben Gerät ein anderes
 * Kind an, wird die Uhr komplett zurückgesetzt, damit keine fremde Übezeit
 * stehen bleibt. Beim selben Konto hebt der Aufruf den Stand höchstens AN
 * (nie absenken — die laufende Uhr ist aktueller als der letzte Speicherstand)
 * und markiert die Differenz als bereits gemeldet, damit
 * {@link takePracticeDelta} sie nicht ein zweites Mal in die Telemetrie gibt.
 */
export function primePracticeClock(
  owner: string,
  baseMs: number,
  now: number = Date.now(),
): void {
  if (ownerKey !== null && ownerKey !== owner) resetPracticeClock();
  ownerKey = owner;
  rolloverIfNewDay(now);
  const cur = getPracticeMs(now);
  if (baseMs > cur) {
    committedMs += baseMs - cur;
    reportedMs += baseMs - cur;
  }
}

/** Übezeit als Uhr-Text: „M:SS" oder ab einer Stunde „H:MM:SS". */
export function formatPracticeTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/**
 * Übezeit ausgeschrieben — für die Ansage auf der Braillezeile und (bei
 * eingeschaltetem Vorlesen) als Sprache, z. B. „3 Minuten 20 Sekunden" oder
 * „1 Stunde 5 Minuten". Sekunden ab einer Stunde weggelassen (zu kleinteilig).
 */
export function formatPracticeSpoken(ms: number, lang: Lang = "de"): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const teil = UHR_TEIL[lang];
  const parts: string[] = [];
  if (h > 0) parts.push(teil(h, "h"));
  if (m > 0) parts.push(teil(m, "m"));
  if (h === 0 && (s > 0 || parts.length === 0))
    parts.push(teil(s, "s"));
  return parts.join(" ");
}

type UhrEinheit = "h" | "m" | "s";
const UHR_WOERTER_DE: Record<UhrEinheit, [string, string]> = {
  h: ["Stunde", "Stunden"], m: ["Minute", "Minuten"], s: ["Sekunde", "Sekunden"],
};
const UHR_WOERTER_EN: Record<UhrEinheit, [string, string]> = {
  h: ["hour", "hours"], m: ["minute", "minutes"], s: ["second", "seconds"],
};
const UHR_WOERTER_FR: Record<UhrEinheit, [string, string]> = {
  h: ["heure", "heures"], m: ["minute", "minutes"], s: ["seconde", "secondes"],
};

/** ★ ES-O (27.09.2026): dieselben Wörter spanisch. */
const UHR_WOERTER_ES: Record<UhrEinheit, [string, string]> = {
  h: ["hora", "horas"], m: ["minuto", "minutos"], s: ["segundo", "segundos"],
};

/** ★ O-IT (02.10.2026): dieselben Wörter italienisch. */
const UHR_WOERTER_IT: Record<UhrEinheit, [string, string]> = {
  h: ["ora", "ore"], m: ["minuto", "minuti"], s: ["secondo", "secondi"],
};

/**
 * ★ O-PL (02.10.2026): dieselben Wörter polnisch, alle vier Formen (Glossar
 * §2.10a): one (1) · few (2-4, 22-24) · many (0, 5-21, 25 …) · other (Bruchzahl).
 */
const UHR_WOERTER_PL: Record<UhrEinheit, [string, string, string, string]> = {
  h: ["godzina", "godziny", "godzin", "godziny"],
  m: ["minuta", "minuty", "minut", "minuty"],
  s: ["sekunda", "sekundy", "sekund", "sekundy"],
};

/**
 * ★ O-TR (02.10.2026): dieselben Wörter türkisch - nach einer Zahl steht
 * IMMER die Einzahl ("3 saat 20 dakika", nie die Mehrzahl, Glossar Regel 5).
 */
const UHR_WOERTER_TR: Record<UhrEinheit, string> = { h: "saat", m: "dakika", s: "saniye" };

/**
 * ★ O-CS (03.10.2026): dieselben Wörter tschechisch, alle vier Formen (Glossar
 * §2.11): one (1) · few (2-4) · many (Bruchzahl, Genitiv Einzahl) · other (0, 5+,
 * auch 21, 22) - „1 minuta", „3 minuty", „5 minut", „22 minut".
 */
const UHR_WOERTER_CS: Record<UhrEinheit, { one: string; few: string; many: string; other: string }> = {
  h: { one: "hodina", few: "hodiny", many: "hodiny", other: "hodin" },
  m: { one: "minuta", few: "minuty", many: "minuty", other: "minut" },
  s: { one: "sekunda", few: "sekundy", many: "sekundy", other: "sekund" },
};

/**
 * ★ O2-LIB (30.10.2026): dieselben Wörter bulgarisch, zwei Formen (Glossar §2.11): one (1) und
 * other = Zählform (0, 2, 5, 1,5) - „1 час", „2 часа", „5 минути", „3 секунди".
 */
const UHR_WOERTER_BG: Record<UhrEinheit, { one: string; other: string }> = {
  h: { one: "час", other: "часа" },
  m: { one: "минута", other: "минути" },
  s: { one: "секунда", other: "секунди" },
};

/**
 * ★ O-EL-LIB (30.10.2026): dieselben Wörter griechisch - one (1) / other (alles andere, auch 0):
 * «1 λεπτό», «5 λεπτά», «0 λεπτά».
 */
const UHR_WOERTER_EL: Record<UhrEinheit, { one: string; other: string }> = {
  h: { one: "ώρα", other: "ώρες" },
  m: { one: "λεπτό", other: "λεπτά" },
  s: { one: "δευτερόλεπτο", other: "δευτερόλεπτα" },
};

/**
 * ★ O2-LIB (30.10.2026): dieselben Wörter ungarisch. Nach einer Zahl steht die
 * Einzahl (Glossar Regel 13): „5 perc", „1 óra" - alle Formen gleich.
 */
const UHR_WOERTER_HU: Record<UhrEinheit, string> = {
  h: "óra",
  m: "perc",
  s: "másodperc",
};

/**
 * ★ O2-LIB (29.10.2026): dieselben Wörter niederländisch - "uur" bleibt in der Mehrzahl gleich;
 * "minuut/minuten", "seconde/seconden" (Glossar nl §2.6).
 */
const UHR_WOERTER_NL: Record<UhrEinheit, { one: string; other: string }> = {
  h: { one: "uur", other: "uur" },
  m: { one: "minuut", other: "minuten" },
  s: { one: "seconde", other: "seconden" },
};

/**
 * ★ O-LIB (30.10.2026): as mesmas palavras em português (Portugal) - Glossar §2.11: one (1) · other (0, 2, 5 ...) ·
 * many (1 000 000, "de"): "1 minuto", "0 minutos", "2 horas".
 */
const UHR_WOERTER_PT: Record<UhrEinheit, { one: string; other: string }> = {
  h: { one: "hora", other: "horas" },
  m: { one: "minuto", other: "minutos" },
  s: { one: "segundo", other: "segundos" },
};

/**
 * ★ O2-LIB (29.10.2026): die Uhr-Wörter, Portugiesisch (Brasilien). "br": 0 und 1 sind beide
 * "one" (Intl) - darum hier selbst: nur die 1 ist Einzahl ("0 minutos", "1 minuto").
 */
const UHR_WOERTER_BR: Record<UhrEinheit, [string, string]> = {
  h: ["hora", "horas"], m: ["minuto", "minutos"], s: ["segundo", "segundos"],
};

/**
 * ★ O2-LIB (29.10.2026): dieselben Wörter rumänisch (Glossar §2.11): one (1) · few (0, 2-19) ·
 * other (20+, mit „de“) - „1 minut“, „3 minute“, „20 de minute“.
 */
const UHR_WOERTER_RO: Record<UhrEinheit, { one: string; few: string; other: string }> = {
  h: { one: "oră", few: "ore", other: "de ore" },
  m: { one: "minut", few: "minute", other: "de minute" },
  s: { one: "secundă", few: "secunde", other: "de secunde" },
};

/**
 * ★ O2-LIB (30.10.2026): dieselben Wörter schwedisch - one/other (Glossar sv §2.11):
 * "1 timme", "5 timmar"; "1 minut", "5 minuter"; "1 sekund", "5 sekunder".
 */
const UHR_WOERTER_SV: Record<UhrEinheit, { one: string; other: string }> = {
  h: { one: "timme", other: "timmar" },
  m: { one: "minut", other: "minuter" },
  s: { one: "sekund", other: "sekunder" },
};

/**
 * ★ O2-LIB (30.10.2026): dieselben Wörter ukrainisch, alle vier Formen (Glossar §2.11): one (1, 21) · few (2-4) ·
 * many (0, 5-20) · other (Bruchzahl, Genitiv Einzahl) - „1 хвилина", „3 хвилини", „5 хвилин", „1,5 хвилини".
 */
const UHR_WOERTER_UK: Record<UhrEinheit, { one: string; few: string; many: string; other: string }> = {
  h: { one: "година", few: "години", many: "годин", other: "години" },
  m: { one: "хвилина", few: "хвилини", many: "хвилин", other: "хвилини" },
  s: { one: "секунда", few: "секунди", many: "секунд", other: "секунди" },
};

/**
 * ★ E11a-5 (26.09.2026): ein Teil der Übezeit („3 Minuten") je Vorlese-
 * Sprache - eine Tabelle statt `lang === "en" ? … : Deutsch`, das „fr" still
 * deutsch sprechen liess (Falle 30). Französisch über {@link mehrzahl}: dort
 * sind 0 UND 1 Einzahl („0 seconde", „1 minute"), anders als im Deutschen
 * und Englischen, die hier Wort für Wort wie vorher bleiben.
 */
const UHR_TEIL: Record<Lang, (n: number, e: UhrEinheit) => string> = {
  de: (n, e) => `${n} ${n === 1 ? UHR_WOERTER_DE[e][0] : UHR_WOERTER_DE[e][1]}`,
  en: (n, e) => `${n} ${n === 1 ? UHR_WOERTER_EN[e][0] : UHR_WOERTER_EN[e][1]}`,
  fr: (n, e) =>
    mehrzahl(n, "fr", {
      one: (z) => `${z} ${UHR_WOERTER_FR[e][0]}`,
      other: (z) => `${z} ${UHR_WOERTER_FR[e][1]}`,
    }),
  // ★ ES-O (27.09.2026): spanisch - Einzahl nur bei 1 („0 minutos", „1 minuto").
  es: (n, e) => `${n} ${n === 1 ? UHR_WOERTER_ES[e][0] : UHR_WOERTER_ES[e][1]}`,
  // ★ O-IT (02.10.2026): über {@link mehrzahl} (one/other; „0 minuti", „1 minuto").
  it: (n, e) =>
    mehrzahl(n, "it", {
      one: (z) => `${z} ${UHR_WOERTER_IT[e][0]}`,
      other: (z) => `${z} ${UHR_WOERTER_IT[e][1]}`,
    }),
  // ★ O-PL (02.10.2026): „1 minuta", „3 minuty", „5 minut", „12 minut", „22 minuty".
  pl: (n, e) =>
    mehrzahl(n, "pl", {
      one: (z) => `${z} ${UHR_WOERTER_PL[e][0]}`,
      few: (z) => `${z} ${UHR_WOERTER_PL[e][1]}`,
      many: (z) => `${z} ${UHR_WOERTER_PL[e][2]}`,
      other: (z) => `${z} ${UHR_WOERTER_PL[e][3]}`,
    }),
  // ★ O-TR (02.10.2026): "1 dakika", "5 dakika", "3 saat" - one und other gleich.
  tr: (n, e) => `${n} ${UHR_WOERTER_TR[e]}`,
  // ★ O-CS (03.10.2026): „1 minuta", „3 minuty", „5 minut", „1 hodina 5 minut".
  cs: (n, e) =>
    mehrzahl(n, "cs", {
      one: (z) => `${z} ${UHR_WOERTER_CS[e].one}`,
      few: (z) => `${z} ${UHR_WOERTER_CS[e].few}`,
      many: (z) => `${z} ${UHR_WOERTER_CS[e].many}`,
      other: (z) => `${z} ${UHR_WOERTER_CS[e].other}`,
    }),
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: (n, e) =>
    mehrzahl(n, "bg", {
      one: (z) => `${z} ${UHR_WOERTER_BG[e].one}`,
      other: (z) => `${z} ${UHR_WOERTER_BG[e].other}`,
    }),
  el: (n, e) =>
    mehrzahl(n, "el", {
      one: (z) => `${z} ${UHR_WOERTER_EL[e].one}`,
      other: (z) => `${z} ${UHR_WOERTER_EL[e].other}`,
    }),
  hu: (n, e) =>
    mehrzahl(n, "hu", {
      one: (z) => `${z} ${UHR_WOERTER_HU[e]}`,
      other: (z) => `${z} ${UHR_WOERTER_HU[e]}`,
    }),
  nl: (n, e) =>
    mehrzahl(n, "nl", {
      one: (z) => `${z} ${UHR_WOERTER_NL[e].one}`,
      other: (z) => `${z} ${UHR_WOERTER_NL[e].other}`,
    }),
  pt: (n, e) =>
    mehrzahl(n, "pt", {
      one: (z) => `${z} ${UHR_WOERTER_PT[e].one}`,
      other: (z) => `${z} ${UHR_WOERTER_PT[e].other}`,
      many: (z) => `${z} de ${UHR_WOERTER_PT[e].other}`,
    }),
  br: (n, e) => `${n} ${n === 1 ? UHR_WOERTER_BR[e][0] : UHR_WOERTER_BR[e][1]}`,
  ro: (n, e) =>
    mehrzahl(n, "ro", {
      one: (z) => `${z} ${UHR_WOERTER_RO[e].one}`,
      few: (z) => `${z} ${UHR_WOERTER_RO[e].few}`,
      other: (z) => `${z} ${UHR_WOERTER_RO[e].other}`,
    }),
  sv: (n, e) =>
    mehrzahl(n, "sv", {
      one: (z) => `${z} ${UHR_WOERTER_SV[e].one}`,
      other: (z) => `${z} ${UHR_WOERTER_SV[e].other}`,
    }),
  uk: (n, e) =>
    mehrzahl(n, "uk", {
      one: (z) => `${z} ${UHR_WOERTER_UK[e].one}`,
      few: (z) => `${z} ${UHR_WOERTER_UK[e].few}`,
      many: (z) => `${z} ${UHR_WOERTER_UK[e].many}`,
      other: (z) => `${z} ${UHR_WOERTER_UK[e].other}`,
    }),
};
