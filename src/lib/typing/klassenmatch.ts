/**
 * ★★★★★ DAS KLASSENMATCH - Begriffe, Zeiten und das Rechenwerk (11.09.2026).
 *
 * Auftrag Johannes (Umbauplan §1 F, §2.6): *„Ein Kind lädt seine Klasse zu
 * einem Match ein, alle schreiben fünf Minuten auf ihrem eigenen Tastenniveau,
 * unter dem Feld läuft ein Ranking mit. Es gibt keine Statistik; Lehrer wissen
 * nicht, wer wie oft ein Match macht."*
 *
 * In dieser Datei stehen NUR reine Funktionen - keine React-Haken, kein
 * Backend, keine Anzeige. Das ist Absicht: Die Rangfolge, die Kugel-Position
 * und der Braille-Vorspann sind die drei Stellen, an denen sich ein Fehler
 * nicht als Absturz zeigt, sondern als falsche Zahl vor einem Kind. Sie
 * gehören darum in einen Wächter (`tests/typing-klassenmatch-modell.test.ts`)
 * und nicht in ein Bauteil.
 *
 * ── Warum `matchPhaseVon` und nicht `phaseVon` ──────────────────────────────
 * `schreibprobe.ts` hat schon ein `phaseVon` (Tippchallenge), und beide Dateien
 * hängen im selben Sammel-Modul (`lib/typing/index.ts`). Zwei gleiche Namen
 * darin sind kein Stilproblem, sondern ein Bauteil, das still den falschen
 * Zustand liest. Der Umbauplan nennt die Funktion `phaseVon`; sie heisst hier
 * `matchPhaseVon`, und das ist die einzige Abweichung vom Plan.
 *
 * ── Die Wertung ist NICHT die der Tippchallenge, sondern ihre Formel ────────
 * Gerechnet wird mit `werte()` aus `schreibprobeWertung.ts` - Güte
 * `Z/(Z+5F)` mal Wurzel des Tempos. **Die Mindestmenge von 200 Zeichen gilt
 * hier ausdrücklich NICHT** (Vorgabe Johannes): In einem Fünf-Minuten-Spiel
 * hat ein Kind der Grundreihe nach einer Minute vielleicht 60 Zeichen, und
 * eine Kugel, die bis dahin auf 0 steht, wäre kein Spiel. Für eine gespeicherte
 * Leistung wäre das zu wenig - gespeichert wird aber nichts (F10).
 */
import { werte } from "./schreibprobeWertung";
import { schreibzeitNachUhr, tempoJeMinute } from "./eineMessart";
import { mmss } from "./schreibprobe";
// ★ EN5 (19.09.2026): die englische Bedienung - direkt aus den Modulen, ohne
// den React-Provider (diese Datei bleibt frei von Haken, siehe oben).
import type { BedienSprache } from "../bedienSprache/sprache";
import { GEBIET, mehrzahl, texte } from "../bedienSprache/texte";
import { zZe } from "../bedienSprache/predlozkyCs";

// ── Zeiten und Grenzen ──────────────────────────────────────────────────────

/**
 * Wie lange ein Match dauert (Minuten). F6: *„Immer 5 Minuten."*
 *
 * Fest und nicht einstellbar - das ist der Punkt: Ein Match ist kein
 * Prüfungsformat mit Schrauben, sondern ein Spiel mit einer Regel, die jedes
 * Kind der Klasse kennt, ohne sie nachzulesen.
 */
export const MATCH_DAUER_MIN = 5;

/** Dieselbe Dauer in ms - damit niemand zweimal mal 60000 rechnet. */
export const MATCH_DAUER_MS = MATCH_DAUER_MIN * 60_000;

/**
 * Der Countdown zwischen „Starten" und dem ersten Anschlag (ms). F5: zehn
 * Sekunden, bei allen gleichzeitig.
 *
 * ★ Der Server setzt `startMs = jetzt + 10 s`; jeder Client rechnet von
 * `startMs` aus. Ein Countdown, den jedes Gerät für sich hochzählte, liefe je
 * nach Netzweg um Sekunden auseinander - und zwar ausgerechnet zwischen
 * Kindern, die nebeneinander sitzen.
 */
export const MATCH_COUNTDOWN_MS = 10_000;

/**
 * ★★★ WIE OFT EIN KIND SEINEN STAND SCHREIBT (ms).
 *
 * Drei Sekunden. Die Rechnung dahinter: 30 Kinder je Klasse (`MAX_KINDER` in
 * `tt_grenzen.pb.js`) ergeben **10 Schreibvorgänge je Sekunde je Klasse** -
 * und jeder davon fächert sich über Realtime auf bis zu 30 Leser auf. Das ist
 * die obere Grenze dessen, was der Seminarraum-Massstab trägt
 * ([[feedback_seminarraum_ist_der_massstab]]: 30 Geräte im selben WLAN sind
 * für den Server EINE Adresse).
 *
 * ⚠️ Kleiner zu takten ist verlockend (die Kugeln liefen flüssiger) und wäre
 * der falsche Handel: Bei 1 s wären es 30 Schreibvorgänge je Sekunde und 900
 * Zustellungen. Die Kugeln bewegen sich zwischen zwei Meldungen ohnehin
 * weiter - die eigene Position rechnet der Client aus seinen eigenen Zahlen.
 */
export const MATCH_TAKT_MS = 3_000;

/**
 * ★★★ WIE OFT DIE MATCH-LISTE VON SELBST NACHGEFRAGT WIRD (ms).
 *
 * **45 Sekunden - geändert am 11.09.2026 von 5 auf 45** (Befund des Prüfers,
 * Entscheidung Johannes/Fable). Die 5 Sekunden waren die teuerste Zahl der
 * ganzen Etappe: Dieses Abo läuft, solange ein Klassenkind die Seite offen hat
 * - also den ganzen Vormittag, auch in einer Klasse, die nie ein Match spielt.
 * 30 Kinder ergaben so **6 Abfragen je Sekunde je Klasse für nichts**.
 *
 * Der Hauptweg ist das Realtime-Abo auf `tt_matches` mit Filter `classCode`:
 * Eine Einladung kommt darüber in etwa einer Sekunde an (im Browser gemessen
 * am 11.09.2026). Dazu die Sofort-Nachfrage, sobald der Tab sichtbar wird, das
 * Fenster den Fokus bekommt oder das Netz zurückkommt. Dieser Takt ist nur
 * **das Netz unter dem Netz** ({@link useKlassenBeobachtung}) - genau wie die
 * 45 Sekunden der Tippchallenge (`useSchreibprobe.ts`) und der Klasse selbst.
 */
export const MATCH_NACHFRAGE_MS = 45_000;

/**
 * ★★★ WIE OFT DIE STAND-ZEILEN EINES LAUFENDEN MATCHES NACHGEFRAGT WERDEN (ms).
 *
 * 15 Sekunden, und nur, solange dieses Kind wirklich in einem Match steckt
 * (`aktiv: !!meinMatchId`). Auch hier ist der Hauptweg das Realtime-Abo mit
 * Filter `matchId`; es liefert die ZEILE mit, nicht ein „da war was".
 *
 * ⚠️ Bis zum 11.09.2026 lief dieser Takt im Schreib-Takt mit
 * ({@link MATCH_TAKT_MS} = 3 s) - das waren bei 30 Kindern 10 volle Abfragen je
 * Sekunde ZUSÄTZLICH zu den 10 Schreibvorgängen, die ohnehin über Realtime bei
 * allen ankommen. Fünfmal seltener zu fragen kostet fachlich nichts: Was der
 * Takt holt, hat das Abo längst geliefert; reisst es ab, steht das Ranking
 * höchstens 15 Sekunden still, und die eigene Kugel rechnet der Client sowieso
 * selbst.
 */
export const MATCH_STAND_NACHFRAGE_MS = 15_000;

/**
 * So oft wird die KLASSE nachgefragt (ms) - für `klassenmatchAus` (F8).
 *
 * 45 Sekunden wie bei der Tippchallenge, und aus demselben Grund: Die Klasse
 * ändert sich selten, und 30 Geräte, die dauernd fragen, sind für den Server
 * eine Adresse ([[feedback_seminarraum_ist_der_massstab]]). Dass ein
 * Abschalten trotzdem „mitten in der Stunde ankommt", macht das Realtime-Abo
 * (etwa eine Sekunde), nicht der Takt.
 *
 * ⚠️ Sie steht hier und nicht in `useKlassenmatch`, weil
 * {@link matchAnfragenJeSekunde} mit ihr rechnet - eine Zahl, zwei Stellen,
 * das wäre genau die Doppelung, vor der
 * [[feedback_zwei_stellen_die_voneinander_nichts_wissen]] warnt.
 */
export const MATCH_KLASSE_NACHFRAGE_MS = 45_000;

/**
 * Wie viele Kinder eine Klasse höchstens hat (`MAX_KINDER` in
 * `tt_grenzen.pb.js`) - der Massstab, an dem die Last gerechnet wird.
 */
export const MATCH_KINDER_JE_KLASSE = 30;

/**
 * ★★★ DIE LAST JE KLASSE UND SEKUNDE - hier wird sie VORGERECHNET.
 *
 * Der Umbauplan §2.6 gibt ein Budget von 10 Anfragen je Sekunde je Klasse vor.
 * Damit niemand die Zahl im Kopf nachrechnen muss (und damit ein Wächter sie
 * festhält), steht die Rechnung hier - aus genau den Konstanten, die auch der
 * Haken benutzt:
 *
 * | | vor dem 11.09. | jetzt |
 * |---|---|---|
 * | Schreiben im Match (30 / 3 s, **nur bei Änderung**) | 10/s | 10/s |
 * | Stände lesen (30 / 3 s ⇒ 30 / 15 s) | 10/s | **2/s** |
 * | Match-Liste (30 / 5 s ⇒ 30 / 45 s) | 6/s | **0,67/s** |
 * | Klasse (30 / 45 s) | 0,67/s | 0,67/s |
 * | **im Match** | **26,7/s** | **13,3/s** |
 * | **ohne Match** | **6,7/s** | **1,3/s** |
 *
 * Die verbleibenden 10/s sind die SCHREIBVORGÄNGE - das ausdrückliche Budget
 * des Plans ({@link MATCH_TAKT_MS}), und sie fallen nur an, solange wirklich
 * alle 30 Kinder ununterbrochen schreiben. Gelesen wird nur noch **3,3/s**
 * statt 16,7/s, und ausserhalb eines Matchs ist es praktisch nichts.
 *
 * @param kinder Wie viele Kinder der Klasse die Seite offen haben.
 * @param imMatch Sind sie in einem laufenden Match?
 */
export function matchAnfragenJeSekunde(
  kinder = MATCH_KINDER_JE_KLASSE,
  imMatch = true,
): { schreiben: number; lesen: number; summe: number } {
  const jeSekunde = (taktMs: number) => kinder / (taktMs / 1000);
  const schreiben = imMatch ? jeSekunde(MATCH_TAKT_MS) : 0;
  const lesen =
    jeSekunde(MATCH_NACHFRAGE_MS) + // die Matches der Klasse
    jeSekunde(MATCH_KLASSE_NACHFRAGE_MS) + // die Klasse selbst (klassenmatchAus)
    (imMatch ? jeSekunde(MATCH_STAND_NACHFRAGE_MS) : 0);
  return { schreiben, lesen, summe: schreiben + lesen };
}

/**
 * ★★★ SO LANGE DARF EINE EINLADUNG OFFEN STEHEN, DER NIEMAND BEIGETRETEN IST
 * (ms) - geändert am 15.09.2026 von zehn Minuten auf 30 Sekunden.
 *
 * Johannes: *„matchanfragen die nicht beantwortet werden sollen einfach
 * verschwinden, wenn gar niemand was macht"* - und: *„wenn jemand ein match
 * starten möchte und alle lehnen ab, soll das nicht im Hintergrund
 * weiterlaufen, sondern beendet werden."* Zehn Minuten hiessen: Ein Match, das
 * niemand annimmt, blockierte zehn Minuten lang einen Platz in der Liste - und
 * war genau die stehende Einladung, die Sebastian zehnmal dieselbe Meldung
 * bescherte (Mustafas Einladung stand am Server, während er längst ein
 * anderes Match spielte).
 *
 * ★ WER PRÜFT DAS: Diese Zahl gilt für den GASTGEBER-CLIENT
 * ({@link useKlassenmatch}, „alleine nach 30 Sekunden"): Ist ausser ihm
 * niemand in der Stand-Liste, sagt sein eigenes Gerät nach dieser Frist selbst
 * ab - kein Warten auf den minütlichen Cron. Der Server-Cron
 * (`tt_match.pb.js`) bleibt zusätzlich das NETZ für den Fall, dass die
 * Gastgeberin die Seite verlassen hat und niemand mehr da ist, der absagen
 * könnte - er tickt nur einmal je Minute und kann darum nicht dieselbe
 * Genauigkeit haben, siehe dort.
 */
export const MATCH_EINLADUNG_FRIST_MS = 30_000;

/**
 * So lange nach dem Ende bleiben Match- und Stand-Zeilen stehen, dann löscht
 * der Hook sie (F10, eine Stunde). Sie sind Spielstand, keine Statistik - und
 * was nicht da ist, kann auch niemand auswerten.
 */
export const MATCH_AUFRAEUM_MS = 60 * 60_000;

/**
 * ★ M3 (19.09.2026): SEIT WANN DIE KLASSENMATCH-ANZAHL ZÄHLT.
 *
 * Die Zahl, die die Lehrkraft in „Übungszeiten" sieht (`/api/tt/klassenmatch-
 * anzahl`, `tt_match_anzahl_lib.pb.js`), zählt die Zeilen von
 * `tt_match_verlauf` - und die schreibt der Aufräum-Cron in `tt_match.pb.js`
 * erst seit dem Deploy vom 14.09.2026, 17:03 (`DEPLOYED-ARCHIV.md`: „neue
 * Sammlung tt_match_verlauf"). Was davor gespielt wurde, wurde eine Stunde
 * nach dem Ende gelöscht, ohne Spur ({@link MATCH_AUFRAEUM_MS}). Die Route
 * selbst filtert nach KEINER Zeit - nur nach dem Klassencode: gezählt wird
 * also alles in DIESER Klasse, seit es aufgezeichnet wird.
 *
 * Der Hinweis am Zähler nennt dieses Datum, damit „an 3 Klassenmatches
 * teilgenommen" nicht wie „seit Schulbeginn" klingt.
 */
export const MATCH_VERLAUF_SEIT_MS = new Date(2026, 8, 14).getTime();

/**
 * ★★★ „LÄUFT GERADE" - DER ZUSTAND AM SCHALTER (§2.6, Entscheidung 11.09.2026).
 *
 * Der Plan verlangt für ein gebundenes Kind *„den Match-Schalter mit dem
 * Hinweis ‚läuft gerade'"*. Gebaut war stattdessen: Der Schalter verschwindet.
 * Das ist eine Falle: **Der Schalter sagt nicht, warum er nicht (mehr) da
 * ist.** Ein Kind, das eben noch „⚔️ Klassenmatch" gesehen hat, sucht ihn und
 * findet nichts; Alt + M tut stillschweigend nichts, und genau das gibt es in
 * diesem Programm nicht (R-A3).
 *
 * Jetzt steht der Schalter da und trägt den Zustand IN SEINER BESCHRIFTUNG -
 * damit steht er auf der Braillezeile, sobald der Fokus ihn erreicht, und
 * braucht keine Live-Region (die beim Tippen ohnehin verboten wäre,
 * [[reference_live_region_ist_braille_blitzmeldung]]). Kein `disabled`: Der
 * Schalter bleibt anfahrbar und antwortet mit {@link matchHinweisSatz} über
 * `speakUi` - dieselbe Bauart wie „Starten" im Wartefenster.
 *
 * ★ Die zweite Ausprägung dieses Hinweises - „Zwei Matches laufen" - ist am
 * 15.09.2026 weggefallen: Johannes wollte keine feste Zahl mehr
 * (*„ich möchte dass mehr wie 2 match parallel laufen können"*), darum prüft
 * weder der Client noch der Server-Hook (`tt_match.pb.js`) mehr, wie viele
 * Matches in einer Klasse offen sind - nur noch, ob DIESES Kind selbst schon
 * gebunden ist, und ob die Lehrkraft das Match abgeschaltet hat (F8).
 */
export const MATCH_HINWEIS_LAEUFT = "Klassenmatch läuft gerade";

/**
 * ★ Dieselbe Beschriftung englisch (EN5, 19.09.2026). `useKlassenmatch` legt
 * je nach Bedienungssprache die eine ODER die andere in `hinweis` - die
 * Stand-Zeile zeigt sie unverändert, und {@link matchHinweisSatz} kennt beide.
 * So wird der Schalter englisch, ohne dass die Stand-Zeile oder die
 * Übungsseite die Sprache kennen müssen.
 */
export const MATCH_HINWEIS_LAEUFT_EN = "Class Match in progress";

/**
 * ★ Dieselbe Beschriftung französisch (E11a-5, 26.09.2026) - Glossar §9.2:
 * « le Match de la classe ».
 */
export const MATCH_HINWEIS_LAEUFT_FR = "Match de la classe en cours";

/** ★ ES-O (27.09.2026): dieselbe Beschriftung spanisch. */
export const MATCH_HINWEIS_LAEUFT_ES = "Competición de la clase en curso";

/** ★ O-IT (02.10.2026): dieselbe Beschriftung italienisch - Glossar §2.3 „Gara di classe". */
export const MATCH_HINWEIS_LAEUFT_IT = "Gara di classe in corso";

/** ★ O-PL (02.10.2026): dieselbe Beschriftung polnisch - Glossar §2.3 „Wyścig klasowy". */
export const MATCH_HINWEIS_LAEUFT_PL = "Wyścig klasowy trwa";

/** ★ O-TR (02.10.2026): dieselbe Beschriftung türkisch - Glossar §2.3 "Sınıf Maçı". */
export const MATCH_HINWEIS_LAEUFT_TR = "Sınıf Maçı sürüyor";

/** ★ O-CS (03.10.2026): dieselbe Beschriftung tschechisch - Glossar §2.3 „Třídní závod". */
export const MATCH_HINWEIS_LAEUFT_CS = "Třídní závod probíhá";

/** ★ O2-LIB (29.10.2026): dieselbe Beschriftung bulgarisch - Glossar „Състезание в класа". */
export const MATCH_HINWEIS_LAEUFT_BG = "Състезанието в класа тече";

/** ★ O-EL-LIB (30.10.2026): dieselbe Beschriftung griechisch - Glossar §2.3 „Αγώνας τμήματος". */
export const MATCH_HINWEIS_LAEUFT_EL = "Αγώνας τμήματος σε εξέλιξη";

/** ★ O2-LIB (29.10.2026): dieselbe Beschriftung ungarisch - Glossar „Osztályverseny". */
export const MATCH_HINWEIS_LAEUFT_HU = "Osztályverseny folyamatban";

/** ★ O2-LIB (29.10.2026): dieselbe Beschriftung niederländisch - Glossar nl §2.3 "Klassenwedstrijd". */
export const MATCH_HINWEIS_LAEUFT_NL = "Klassenwedstrijd bezig";

/** ★ O-LIB (30.10.2026): a mesma legenda em português - Glossar §2.3 „Corrida da turma". */
export const MATCH_HINWEIS_LAEUFT_PT = "Corrida da turma a decorrer";

/** ★ O2-LIB (29.10.2026): dieselbe Beschriftung, Portugiesisch (Brasilien) - Glossar "Competição da turma". */
export const MATCH_HINWEIS_LAEUFT_BR = "Competição da turma em andamento";

/** ★ O2-LIB (29.10.2026): dieselbe Beschriftung rumänisch - Glossar §2.3 „Întrecerea clasei“. */
export const MATCH_HINWEIS_LAEUFT_RO = "Întrecerea clasei este în curs";

/** ★ O2-LIB (30.10.2026): dieselbe Beschriftung schwedisch - Glossar sv §2.3 "Klasstävlingen". */
export const MATCH_HINWEIS_LAEUFT_SV = "Klasstävlingen pågår";

/** ★ O2-LIB (30.10.2026): dieselbe Beschriftung ukrainisch - Glossar §2.3 „Перегони класу". */
export const MATCH_HINWEIS_LAEUFT_UK = "Перегони класу тривають";

/** ★ E11a-5: Tabelle je Sprache statt `sprache === "en" ? … : …` (Falle 30). */
const MATCH_HINWEIS_LAEUFT_JE_SPRACHE: Record<BedienSprache, string> = {
  de: MATCH_HINWEIS_LAEUFT,
  en: MATCH_HINWEIS_LAEUFT_EN,
  fr: MATCH_HINWEIS_LAEUFT_FR,
  es: MATCH_HINWEIS_LAEUFT_ES,
  it: MATCH_HINWEIS_LAEUFT_IT,
  pl: MATCH_HINWEIS_LAEUFT_PL,
  tr: MATCH_HINWEIS_LAEUFT_TR,
  cs: MATCH_HINWEIS_LAEUFT_CS,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: MATCH_HINWEIS_LAEUFT_BG,
  el: MATCH_HINWEIS_LAEUFT_EL,
  hu: MATCH_HINWEIS_LAEUFT_HU,
  nl: MATCH_HINWEIS_LAEUFT_NL,
  pt: MATCH_HINWEIS_LAEUFT_PT,
  br: MATCH_HINWEIS_LAEUFT_BR,
  ro: MATCH_HINWEIS_LAEUFT_RO,
  sv: MATCH_HINWEIS_LAEUFT_SV,
  uk: MATCH_HINWEIS_LAEUFT_UK,
};

/** Die Beschriftung „läuft gerade" in der Bedienungssprache. */
export function matchHinweisLaeuft(sprache: BedienSprache = "de"): string {
  return MATCH_HINWEIS_LAEUFT_JE_SPRACHE[sprache];
}

/**
 * Der ganze Satz zum Hinweis - gesprochen bei Alt + M und beim Drücken des
 * Schalters. Er sagt zusätzlich, was als Nächstes geht; die Beschriftung allein
 * sagt nur, was ist. Die Sprache steckt schon im Hinweis selbst (siehe
 * {@link MATCH_HINWEIS_LAEUFT_EN}).
 */
export function matchHinweisSatz(hinweis: string): string {
  if (hinweis === MATCH_HINWEIS_LAEUFT) {
    return "Dein Klassenmatch läuft gerade. Ein zweites geht erst, wenn es vorbei ist.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_EN) {
    return "Your Class Match is running right now. You can start another one once it is over.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_FR) {
    return "Ton Match de la classe est en cours. Tu pourras en lancer un autre quand il sera terminé.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_ES) {
    return "Tu Competición de la clase está en marcha. Podrás empezar otra cuando termine.";
  }
  // ★ O-PL (02.10.2026): ty, Präsens/unpersönlich - keine gegenderte Form.
  if (hinweis === MATCH_HINWEIS_LAEUFT_PL) {
    return "Twój Wyścig klasowy właśnie trwa. Kolejny można zacząć, gdy ten się skończy.";
  }
  // ★ O-TR (02.10.2026): sen; Endung am festen Wort ("Sınıf Maçın").
  if (hinweis === MATCH_HINWEIS_LAEUFT_TR) {
    return "Sınıf Maçın şu anda sürüyor. O bitince yenisini başlatabilirsin.";
  }
  // ★ O-CS (03.10.2026): ty, Gegenwart/Zukunft - keine gegenderte Form.
  if (hinweis === MATCH_HINWEIS_LAEUFT_CS) {
    return "Tvůj Třídní závod právě probíhá. Další můžeš začít, až tenhle skončí.";
  }
  // ★ O2-LIB (30.10.2026): die neun Sprachen des Gerüsts.
  if (hinweis === MATCH_HINWEIS_LAEUFT_BG) {
    return "Състезанието в класа тече в момента. Следващо може да започне, когато свърши.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_EL) {
    return "Ο Αγώνας τμήματος είναι σε εξέλιξη. Μπορείς να ξεκινήσεις άλλον όταν τελειώσει.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_HU) {
    return "Az osztályverseny éppen folyamatban van. Újat akkor indíthatsz, ha ez véget ért.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_NL) {
    return "De klassenwedstrijd is nu bezig. Je kunt een nieuwe starten als deze voorbij is.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_PT) {
    return "A corrida da turma está a decorrer. Podes começar outra quando esta terminar.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_BR) {
    return "A competição da turma está em andamento. Você pode começar outra quando esta terminar.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_RO) {
    return "Întrecerea clasei este în curs. Poți începe alta după ce se termină.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_SV) {
    return "Klasstävlingen pågår just nu. Du kan starta en ny när den är slut.";
  }
  if (hinweis === MATCH_HINWEIS_LAEUFT_UK) {
    return "Перегони класу тривають. Нові можна почати, коли ці закінчаться.";
  }
  return hinweis;
}

/**
 * Bei welcher Restzeit angesagt wird (Sekunden, absteigend) - dasselbe Muster
 * wie `ANSAGE_BEI_SEKUNDEN` der Tippchallenge, nur kürzer: Ein Match dauert
 * fünf Minuten, eine Ansage bei 5 Minuten wäre die Ansage des Starts.
 */
export const MATCH_ANSAGE_BEI_SEKUNDEN = [60, 10] as const;

// ── Die Daten ───────────────────────────────────────────────────────────────

/** Wo ein Match am Server steht. */
export type MatchStatus =
  | "einladung"
  | "countdown"
  | "laeuft"
  | "fertig"
  | "abgebrochen";

/**
 * Wo ein Kind IN einem Match steht.
 *
 * ★★★ SEIT 02.10.2026 ZWEI ZUSTÄNDE MEHR, und beide heissen NICHT „dabei"
 * (Klasse CSS6: Kinder starteten, bevor alle sich entschieden hatten;
 * Johannes: *„3 Kinder haben noch nicht entschieden! Trotzdem starten."*):
 *  • `eingeladen` - das Einladungsfenster ist auf dem Gerät dieses Kindes
 *    aufgegangen, es hat sich noch nicht entschieden.
 *  • `abgelehnt` - es hat „Jetzt nicht" gesagt (oder lädt selbst ein).
 * Nur so weiss die Gastgeberin, bei WEM die Einladung angekommen ist - Kinder,
 * die Tastenflow gar nicht offen haben, schreiben keine Zeile und zählen
 * darum nicht mit.
 *
 * ⚠️⚠️ Eine `eingeladen`- oder `abgelehnt`-Zeile ist KEINE Teilnahme - nicht im
 * Ranking, nicht in „3 dabei", nicht bei „Starten", nicht im Verlauf des
 * Servers. Wer Stand-Zeilen liest, fragt {@link nimmtTeil}.
 */
export type MatchStandStatus = "eingeladen" | "abgelehnt" | "dabei" | "schreibt" | "fertig";

/**
 * Nimmt diese Zeile am Match teil (dabei, schreibt oder fertig)? Eine
 * Einladung, über die noch nicht entschieden ist, und eine Absage nicht.
 */
export function nimmtTeil(stand: Pick<MatchStand, "status">): boolean {
  return stand.status === "dabei" || stand.status === "schreibt" || stand.status === "fertig";
}

/**
 * ★★★ WIE VIELE HABEN SICH NOCH NICHT ENTSCHIEDEN? (02.10.2026)
 *
 * Gezählt werden die Zeilen auf `eingeladen` - also Kinder, bei denen das
 * Einladungsfenster aufgegangen ist und die weder „Bin dabei" noch „Jetzt
 * nicht" gesagt haben. Die Gastgeberin selbst zählt nie mit.
 */
export function unentschiedenZahl(
  staende: readonly Pick<MatchStand, "status" | "pupilUid">[],
  hostUid: string,
): number {
  return staende.filter((s) => s.status === "eingeladen" && s.pupilUid !== hostUid).length;
}

/** Eine Zeile aus `tt_matches`. */
export interface Match {
  id: string;
  classCode: string;
  hostUid: string;
  hostName: string;
  status: MatchStatus;
  /** Wann geschrieben wird - vom Server gesetzt beim Übergang nach `countdown`. */
  startMs: number;
  /** `startMs + 5 min`, ebenfalls vom Server. */
  endeMs: number;
  dauerMin: number;
  createdMs: number;
}

/** Eine Zeile aus `tt_match_stand` - ein Kind in einem Match. */
export interface MatchStand {
  id: string;
  matchId: string;
  classCode: string;
  pupilUid: string;
  name: string;
  status: MatchStandStatus;
  /** Richtig geschriebene Zeichen. */
  zeichen: number;
  /** Fehlgriffe. */
  fehler: number;
  /** Anschläge je Minute. */
  apm: number;
  /** Der Leistungswert, wie ihn dieses Gerät gerechnet hat (Anzeige/Diagnose). */
  wert: number;
  /**
   * ★★★★★ Die gemessene Wartezeit aufs Vorlesen (ms), die {@link matchApm}
   * schon vom Nenner abgezogen hat - hier zusätzlich mitgeschickt, damit sie
   * NICHT verloren geht, sobald `apm` einmal gerechnet ist (14.09.2026).
   *
   * Optional, damit alte Stände (vor diesem Tag) und Test-Fixtures ohne das
   * Feld weiter gültig sind - dann zählt 0, wie bisher.
   *
   * Seit F1c (18.09.2026) mit dem Zuhören VOR dem ersten Anschlag einer Zeile.
   * Die Zeilenwechsel-Pausen, die {@link matchApm} ebenfalls abzieht, stehen
   * NICHT hier (kein eigenes Feld am Server) - sie sind Zeit der App, kein
   * Vorlesen: `verstrichenMs - wartezeitMs - zeichen / apm`.
   */
  wartezeitMs?: number;
  updatedMs: number;
}

/**
 * Wo ein Match aus Sicht der UHR steht - das ist nicht dasselbe wie
 * {@link MatchStatus}.
 *
 * ★★★ Der Unterschied ist der Kern von F13: **Die Zeit läuft am Server
 * nicht.** Niemand sitzt dort und setzt `status` auf `fertig`, wenn `endeMs`
 * vorbei ist (der Cron tut es einmal je Minute, also zu spät für ein Spiel).
 * Jeder Client rechnet die Phase selbst aus `startMs`/`endeMs` - und weil alle
 * dieselben zwei Zahlen vom Server haben, kommen alle im selben Augenblick
 * heraus.
 */
export type MatchPhase = "keine" | "einladung" | "countdown" | "laeuft" | "fertig";

/**
 * Die Phase eines Matches zu einem Zeitpunkt.
 *
 * Wehrhaft in beide Richtungen: Ein Match ohne `startMs` steht in der
 * Einladung, ein abgebrochenes ist fertig, und ein `laeuft`, dessen `endeMs`
 * vorbei ist, ist fertig - auch wenn der Server es noch nicht weiss.
 */
export function matchPhaseVon(match: Match | null | undefined, jetztMs: number): MatchPhase {
  if (!match) return "keine";
  if (match.status === "fertig" || match.status === "abgebrochen") return "fertig";
  if (match.status === "einladung") return "einladung";
  // countdown und laeuft entscheidet die Uhr, nicht das Wort.
  if (!(match.startMs > 0)) return "einladung";
  if (jetztMs < match.startMs) return "countdown";
  const ende = match.endeMs > 0 ? match.endeMs : match.startMs + MATCH_DAUER_MS;
  return jetztMs < ende ? "laeuft" : "fertig";
}

/** Ein Match, das noch jemanden binden kann (Einladung, Countdown oder Lauf). */
export function matchOffen(match: Match, jetztMs: number): boolean {
  const p = matchPhaseVon(match, jetztMs);
  return p === "einladung" || p === "countdown" || p === "laeuft";
}

/** Die offenen Matches einer Klasse, jüngstes zuerst. */
export function offeneMatches(matches: readonly Match[], jetztMs: number): Match[] {
  return matches
    .filter((m) => matchOffen(m, jetztMs))
    .sort((a, b) => b.createdMs - a.createdMs);
}

// ── Zwei schreiben gleichzeitig aus (11.09.2026 abends) ────────────────────

/**
 * ★★★★ WER ZUERST AUSGESCHRIEBEN HAT. Negativ, wenn `a` früher kam.
 *
 * Johannes nach dem ersten Test mit einer echten Klasse: *„was machen wenn zwei
 * schüler zugleich ausschreiben: bitte schau wer der erste ist und wechsel das
 * zweite ausschreibungsfenster automatisch in ein anfragefenster"*.
 *
 * Geordnet wird nach `createdMs` - die Zahl setzt der SERVER, nicht das Gerät
 * (`tt_match.pb.js`) - und bei Gleichstand nach der Kennung. ★ Genau darauf
 * kommt es an: Jedes Gerät rechnet dieselbe Ordnung aus denselben zwei Zahlen,
 * also sagt genau EINES der beiden Matches ab, nie beide und nie keines.
 *
 * ⚠️ Die Kennung wird nach Zeichencode verglichen, nicht mit `localeCompare`:
 * Die Sortierregeln der Sprache können je Browser verschieden sein - und dann
 * hielte sich auf zwei Geräten jedes Kind für das erste.
 */
export function ausschreibungsOrdnung(
  a: Pick<Match, "createdMs" | "id">,
  b: Pick<Match, "createdMs" | "id">,
): number {
  const za = Number.isFinite(a.createdMs) ? a.createdMs : 0;
  const zb = Number.isFinite(b.createdMs) ? b.createdMs : 0;
  if (za !== zb) return za - zb;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/**
 * Die Einladungen, die ein Kind gerade bekommen darf - die ÄLTESTE zuerst.
 *
 * Offen, in der Phase „einladung", von jemand anderem und nicht abgelehnt.
 * ★ Die älteste zuerst und nicht mehr die jüngste (Entscheidung 11.09.2026
 * abends): Wer zuerst gefragt hat, gewinnt - und die Klasse soll sich um dieses
 * eine Match sammeln, statt sich auf zwei Wartefenster zu verteilen.
 */
export function offeneEinladungen(
  matches: readonly Match[],
  jetztMs: number,
  fuerUid: string,
  abgelehnt: readonly string[],
): Match[] {
  return matches
    .filter(
      (m) =>
        m.status === "einladung" &&
        m.hostUid !== fuerUid &&
        !abgelehnt.includes(m.id) &&
        matchOffen(m, jetztMs),
    )
    .sort(ausschreibungsOrdnung);
}

// ── Wer ist erreichbar? (F9) ────────────────────────────────────────────────

/**
 * Wer steckt gerade in einem offenen Match und bekommt darum KEINE Einladung?
 *
 * Johannes F9: *„Läuft ein Match, kann ein nicht teilnehmendes Kind ein
 * zweites ausschreiben; Einladung nur an die, die nicht im ersten sind;
 * Teilnehmende sind für die Dauer nicht erreichbar."*
 *
 * Gebunden ist, wer in einem offenen Match eine Stand-Zeile auf `dabei` oder
 * `schreibt` hat - und der Gastgeber jedes offenen Matches, auch bevor er
 * seine eigene Zeile geschrieben hat.
 *
 * ⚠️ `fertig` bindet NICHT: Wer früher fertig ist (oder dessen Match abgelaufen
 * ist, während der Server noch `laeuft` sagt), darf sofort wieder eingeladen
 * werden.
 */
export function gebundeneKinder(
  matches: readonly Match[],
  staende: readonly MatchStand[],
  jetztMs: number,
): Set<string> {
  const offen = new Set(offeneMatches(matches, jetztMs).map((m) => m.id));
  const raus = new Set<string>();
  for (const m of matches) if (offen.has(m.id)) raus.add(m.hostUid);
  for (const s of staende) {
    if (!offen.has(s.matchId)) continue;
    if (s.status === "dabei" || s.status === "schreibt") raus.add(s.pupilUid);
  }
  return raus;
}

// ── Ein Kind, ein Match (02.10.2026) ────────────────────────────────────────

/**
 * ★★★★★ DIE SÄTZE DER SPERRE „EIN KIND, EIN MATCH" - wortgleich im Hook
 * (`tt_match_lib.pb.js`, der Wächter `typing-klassenmatch-start-rueckfrage`
 * vergleicht) und übersetzt in `serverMeldungen.ts`.
 *
 * Klasse CSS6, 02.10.2026, 10:18-10:19: Matti legte zwei Matches im Abstand
 * von 13 Sekunden an, Stephan, Arne und Matti steckten in zwei Matches
 * gleichzeitig. Johannes: mehrere Matches je Klasse bleiben erlaubt (grosse
 * Klassen) - aber EIN Kind steckt in höchstens EINEM offenen Match.
 */
export const MATCH_SPERRE_GASTGEBER =
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.";
export const MATCH_SPERRE_DABEI =
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.";

/**
 * ★★★★★ STECKT DIESES KIND SCHON IN EINEM ANDEREN OFFENEN MATCH? Leer heisst
 * nein, sonst der Satz, mit dem abgewiesen wird.
 *
 * Gebunden ist, wer in einem offenen Match (Einladung, Countdown, Lauf - nicht
 * abgelaufen) Gastgeber ist oder auf `dabei`/`schreibt` steht. ⚠️ Eine
 * Gastgeberin, deren EIGENE Zeile auf `fertig` steht, hat ihr Match mittendrin
 * verlassen (`mittendrinVerlassen`) - die anderen spielen weiter, sie ist frei.
 *
 * Das ist die Regel des SERVERS (`einKindEinMatch` in `tt_match_lib.pb.js`,
 * dort noch einmal in JavaScript, weil ein Hook kein TypeScript sieht); der
 * Mock (`matchMock.ts`) prüft mit dieser Funktion, damit der Weg ohne Server
 * derselbe ist.
 */
export function matchSperre(
  kindUid: string,
  matches: readonly Match[],
  staende: readonly MatchStand[],
  jetztMs: number,
  ausserMatchId = "",
): string {
  const offen = new Map(
    matches.filter((m) => m.id !== ausserMatchId && matchOffen(m, jetztMs)).map((m) => [m.id, m]),
  );
  for (const m of offen.values()) {
    if (m.hostUid !== kindUid) continue;
    const eigene = staende.find((s) => s.matchId === m.id && s.pupilUid === kindUid);
    if (eigene?.status === "fertig") continue;
    return MATCH_SPERRE_GASTGEBER;
  }
  for (const s of staende) {
    if (s.pupilUid !== kindUid || !offen.has(s.matchId)) continue;
    if (s.status === "dabei" || s.status === "schreibt") return MATCH_SPERRE_DABEI;
  }
  return "";
}

/**
 * Darf dieses Kind gerade zu einem Match eingeladen werden?
 *
 * Der Name stammt aus dem Umbauplan (§2.6 „einladbar"). Er beantwortet die
 * Frage aus der Sicht des EINLADENDEN - das eingeladene Gerät prüft dieselbe
 * Frage für sich selbst noch einmal, bevor es ein Fenster zeigt.
 */
export function einladbar(
  pupilUid: string,
  matches: readonly Match[],
  staende: readonly MatchStand[],
  jetztMs: number,
): boolean {
  return !gebundeneKinder(matches, staende, jetztMs).has(pupilUid);
}

// ── Anschläge je Minute: fair zwischen Überlegen und Zuhören (14.09.2026) ───

/**
 * ★★★★★ WIE DIE ANSCHLÄGE JE MINUTE GERECHNET WERDEN - der Kern der ganzen
 * Fairness-Frage.
 *
 * Johannes, 14.09.2026: *„überlegen gehört bestraft, aber zuhören von blinden
 * nicht, solange die sprache spricht und noch nicht getippt wird darf die
 * zeit nicht zählen. lass sie dementsprechend weiter vor springen."*
 *
 * Gerechnet wird auf die VERSTRICHENE MATCHZEIT, **minus** `wartezeitMs` - der
 * Zeit, die `TypingSession` selbst als „auf die Ansage gewartet, ohne zu
 * tippen" ausweist (`onZeilenWartezeit`, dieselbe Grösse, die die
 * Tippchallenge seit dem 10.09.2026 von der Prüfungsuhr abzieht,
 * `SchreibprobeLauf.tsx`). Reines ÜBERLEGEN (keine Ansage läuft) bleibt voll
 * auf der Uhr - das war und bleibt der Punkt der Regel vom 11.09.2026
 * ({@link KlassenmatchLauf}: „dieselbe Uhr für alle"): Ein Kind, das
 * nachdenkt, ist nicht dasselbe wie ein Kind, das auf die einzige Quelle
 * wartet, aus der es überhaupt weiss, was es schreiben soll.
 *
 * ★ Gemessen an Sarah (Braillezeile) gegen Tester (sehend), 10.09.2026
 * (`BEFUND-2026-09-10-VORLESEZEIT-GEMESSEN.md`): Sarah wartet 102 ms je
 * Zeichen auf die Ansage, Tester 13,8 ms - Faktor 7,4, ausschliesslich im
 * textabhängigen Teil. Ohne den Abzug misst dieselbe Uhr für beide, obwohl
 * nur eine der beiden wirklich auf sie wartet - das worked example in
 * `tests/typing-klassenmatch-modell.test.ts` rechnet es mit genau diesen
 * beiden Kindern durch.
 *
 * ★ Der Abzug wirkt erst, sobald eine Zeile FERTIG ist (dort, wo
 * `TypingSession` `wartezeitMs` ausrechnet) - die Kugel eines Kindes, das
 * lange gewartet hat, holt den Rückstand darum sichtbar in einem Ruck nach,
 * statt unsichtbar zu kriechen ({@link kugelPositionen} liest nur `wert`, der
 * wiederum nur diese Funktion). Kein Animationscode: Die Kugeln laufen
 * ohnehin mit `transition: left 600ms linear` ({@link KlassenmatchRanking}) -
 * eine neue, korrekte Zahl genügt.
 *
 * ★★★★★ SEIT F1c (18.09.2026) DIESELBE MESSART WIE ÜBEN UND TIPPCHALLENGE
 * (`eineMessart.ts`, Johannes: *„zähle nur richtige Zeichen ... mach es
 * überall gleich"*):
 *  - Gezählt werden nur RICHTIGE Zeichen. Bis dahin stand `zeichen + fehler`
 *    im Zähler - ein Fehlgriff machte das Tempo SCHNELLER, und die Güte
 *    bestrafte ihn danach noch einmal.
 *  - `wartezeitMs` enthält jetzt auch das Zuhören VOR dem ersten Anschlag
 *    einer Zeile (die Zeilenansage) - vorher fiel genau dieser Teil weg, und
 *    ein Kind mit Sprachausgabe verlor ihn auf der festen Uhr.
 *  - `zeilenwechselMs`: die kurze Pause, in der die App die nächste Zeile
 *    hinstellt, ist Zeit der App, nicht des Kindes.
 *
 * Der Boden von 1/60 min (eine Sekunde) verhindert Division durch (nahe)
 * null in der ersten Sekunde eines Matches, genau wie vorher.
 */
export function matchApm(e: {
  /** Richtig geschriebene Zeichen - Fehlgriffe zählen hier NICHT. */
  zeichen: number;
  /** Verstrichene Matchzeit seit dem gemeinsamen Start. */
  verstrichenMs: number;
  /** Gemessenes Zuhören (auch vor dem ersten Anschlag einer Zeile). */
  wartezeitMs: number;
  /** Zeilenwechsel-Pausen der App. */
  zeilenwechselMs?: number;
}): number {
  const schreibMs = schreibzeitNachUhr({
    uhrMs: e.verstrichenMs,
    zuhoerMs: e.wartezeitMs,
    zeilenwechselMs: e.zeilenwechselMs,
  });
  return Math.round(tempoJeMinute(Math.max(0, e.zeichen), Math.max(1000, schreibMs)));
}

// ── Die Rangliste ───────────────────────────────────────────────────────────

/**
 * Der Leistungswert EINES Standes.
 *
 * ★ Gerechnet und nicht gelesen: Im Datensatz steht zwar ein `wert`, den das
 * fremde Gerät geschrieben hat - aber wer die Rangfolge aus fremden Zahlen
 * baut, hat 30 Rechenwege statt einem. Hier rechnet jedes Gerät ALLE Stände
 * selbst, aus denselben drei Zahlen. Dann sehen alle dieselbe Liste.
 *
 * Die Mindestmenge von 200 Zeichen gilt hier nicht (siehe Dateikopf).
 */
export function matchWert(stand: Pick<MatchStand, "zeichen" | "fehler" | "apm">): number {
  return werte({
    zeichen: stand.zeichen,
    fehler: stand.fehler,
    anschlaege: stand.apm,
  }).wert;
}

export interface RanglistenEintrag {
  stand: MatchStand;
  /** 1, 2, 3 … - Platz 1 ist der beste. */
  platz: number;
  /** Der gerechnete Leistungswert (0 bis 100). */
  wert: number;
}

/**
 * Die Rangfolge: bester Wert zuerst, bei Gleichstand mehr Zeichen zuerst.
 *
 * ★ Der dritte Schlüssel ist der NAME, nicht die Reihenfolge des Eintreffens:
 * Zwei Kinder, die beide noch kein Zeichen geschrieben haben, hätten sonst je
 * nach Netzweg auf jedem Gerät eine andere Liste - und die Liste würde bei
 * jeder Meldung springen, ohne dass sich etwas geändert hat.
 */
export function rangliste(staende: readonly MatchStand[]): RanglistenEintrag[] {
  // ★ 02.10.2026: Wer nur eingeladen ist oder abgesagt hat, steht NICHT in der
  // Liste ({@link nimmtTeil}) - sonst stünde dort ein Kind mit null Zeichen,
  // das nie mitgespielt hat.
  const mitWert = staende.filter(nimmtTeil).map((stand) => ({ stand, wert: matchWert(stand) }));
  mitWert.sort((a, b) => {
    if (b.wert !== a.wert) return b.wert - a.wert;
    if (b.stand.zeichen !== a.stand.zeichen) return b.stand.zeichen - a.stand.zeichen;
    return a.stand.name.localeCompare(b.stand.name, "de");
  });
  return mitWert.map((e, i) => ({ ...e, platz: i + 1 }));
}

/**
 * ★★★ WO DIE KUGELN STEHEN (F11, §2.6 des Umbauplans).
 *
 * *„Die Kugel des Ersten steht bei `verstrichene Zeit / 5 min` der Strichbreite,
 * alle anderen bei `(eigener Wert / Wert des Ersten)` davon."*
 *
 * Zwei Dinge folgen daraus, und beide sind der Zweck:
 *  • **Die erste Kugel kommt genau nach fünf Minuten rechts an.** Wer sie
 *    ankommen sieht, weiss ohne Uhr, dass es vorbei ist.
 *  • **Aufholen ist sichtbar.** Ein Kind, dessen Wert steigt, wandert nach
 *    rechts, auch wenn der Erste weiter vorne bleibt.
 *
 * Zurückgegeben wird je Eintrag ein Anteil 0 bis 1 der Strichbreite, in der
 * Reihenfolge der übergebenen Rangliste.
 */
export function kugelPositionen(
  liste: readonly RanglistenEintrag[],
  verstrichenMs: number,
  dauerMs: number = MATCH_DAUER_MS,
): number[] {
  const anteilZeit = dauerMs > 0 ? Math.min(1, Math.max(0, verstrichenMs / dauerMs)) : 0;
  const bester = liste.length ? liste[0].wert : 0;
  // Hat noch niemand einen Wert (die ersten Sekunden), stehen alle links -
  // und nicht etwa alle ganz rechts, weil durch null geteilt wurde.
  if (!(bester > 0)) return liste.map(() => 0);
  return liste.map((e) => anteilZeit * Math.min(1, Math.max(0, e.wert) / bester));
}

// ── Die Braillezeile (F14) ──────────────────────────────────────────────────

/**
 * ★★★ DER VORSPANN AUF DER ZEILE - acht Zellen, immer (§6 Frage 4).
 *
 * Vorgabe Johannes: `P2 3:45 ` - Platz, Leerzeichen, Restzeit, Leerzeichen.
 * Ab Platz 10 wird aus dem abschliessenden Leerzeichen die dritte Stelle:
 * `P12 3:45`. **Acht Zellen, ohne Ausnahme.**
 *
 * ⚠️ Die feste Breite ist nicht Kosmetik. Wandert sie („P9 3:45 " auf
 * „P10 3:45"), wandert der ganze Text unter den lesenden Fingern um eine
 * Stelle - dieselbe Falle, wegen der `zeilenZeitstand` (schreibprobe.ts:995)
 * die Minute zweistellig schreibt.
 *
 * ⏳ Mit echter Braillezeile NICHT nachgemessen - wie der Zeitstand der
 * Tippchallenge.
 */
export const MATCH_VORSPANN_BREITE = 8;

export function matchZeitstand(platz: number, restMs: number): string {
  const p = Math.min(99, Math.max(1, Math.round(platz || 1)));
  const roh = `P${p} ${mmss(restMs)}`;
  return roh.length >= MATCH_VORSPANN_BREITE
    ? roh.slice(0, MATCH_VORSPANN_BREITE)
    : roh + " ".repeat(MATCH_VORSPANN_BREITE - roh.length);
}

// ── Was gesagt wird ─────────────────────────────────────────────────────────

/**
 * „1st", „2nd", „3rd", „4th", „11th", „21st" - die englische Ordnungszahl über
 * `Intl.PluralRules` (Regel der Sprache, nicht von Hand).
 */
function ordnungEn(n: number): string {
  const art = new Intl.PluralRules(GEBIET.en, { type: "ordinal" }).select(n);
  const endung = art === "one" ? "st" : art === "two" ? "nd" : art === "few" ? "rd" : "th";
  return `${n}${endung}`;
}

/**
 * ★ O-IT (02.10.2026, Glossar §2.3, Bauplan I9): der Platz italienisch mit
 * AUSGESCHRIEBENER Ordnungszahl - „secondo posto su 6", nie „2°" (das Zeichen
 * liest eine Sprachausgabe unzuverlässig). Ab elf: „posto 11 su 30".
 */
const ORDNUNG_IT = ["", "primo", "secondo", "terzo", "quarto", "quinto", "sesto", "settimo", "ottavo", "nono", "decimo"];
function platzIt(platz: number, anzahl: number): string {
  return platz >= 1 && platz < ORDNUNG_IT.length
    ? `${ORDNUNG_IT[platz]} posto su ${anzahl}`
    : `posto ${platz} su ${anzahl}`;
}

/** ★ E11a: „1er", „2e", „3e" … - die französische Ordnungszahl für den Rang. */
function ordnungFr(n: number): string {
  return n === 1 ? "1er" : `${n}e`;
}

/**
 * ★★ DIE SÄTZE DES KLASSENMATCHS in beiden Bedienungssprachen (EN5,
 * 19.09.2026). Deutsch wortgleich wie vorher (auch „Noch 1 Minute." neben
 * „Noch 5 Minuten." - so stand es da). Englisch nach dem Glossar §3.7:
 * *Class Match*, *place* ⇒ Ordnungszahl („2nd of 6" - so sagen es britische
 * Kinder), *Go!*. Der Braille-Vorspann `P2 3:45 ` bleibt in beiden Sprachen
 * gleich - *P* wie *place* -, acht Zellen, siehe {@link matchZeitstand}.
 */
const MATCH_TEXTE = texte({
  de: {
    einladung: (host: string) => `${host} lädt dich zu einem Klassenmatch ein.`,
    niemandDabei:
      "Noch niemand dabei - die Einladung ist bei allen aus deiner Klasse, die Tastenflow gerade offen haben.",
    dabei: (anzahl: number, namen: string) => `${anzahl} dabei: ${namen}`,
    platz: (platz: number, anzahl: number) => `Platz ${platz} von ${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}. ${name}`,
    nochMinuten: (min: number) => (min === 1 ? "Noch 1 Minute." : `Noch ${min} Minuten.`),
    nochSekunden: (sek: number) => `Noch ${sek} Sekunden.`,
    los: "Los!",
  },
  en: {
    einladung: (host: string) => `${host} is inviting you to a Class Match.`,
    niemandDabei:
      "Nobody has joined yet - the invitation has gone to everyone in your class who has Tastenflow open right now.",
    dabei: (anzahl: number, namen: string) => `${anzahl} joined: ${namen}`,
    platz: (platz: number, anzahl: number) => `${ordnungEn(platz)} of ${anzahl}`,
    topEintrag: (platz: number, name: string) => `${ordnungEn(platz)} ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "en", { one: (z) => `${z} minute left.`, other: (z) => `${z} minutes left.` }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "en", { one: (z) => `${z} second left.`, other: (z) => `${z} seconds left.` }),
    los: "Go!",
  },
  // ★ E11a: „tu" - der Défi spricht immer die lernende Person an (F9).
  fr: {
    einladung: (host: string) => `${host} t'invite à un Match de la classe.`,
    niemandDabei:
      "Personne pour l'instant - l'invitation est allée à tous les élèves de ta classe qui ont Tastenflow ouvert en ce moment.",
    dabei: (anzahl: number, namen: string) => `${anzahl} présents : ${namen}`,
    platz: (platz: number, anzahl: number) => `${ordnungFr(platz)} sur ${anzahl}`,
    topEintrag: (platz: number, name: string) => `${ordnungFr(platz)} ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "fr", { one: (z) => `Encore ${z} minute.`, other: (z) => `Encore ${z} minutes.` }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "fr", { one: (z) => `Encore ${z} seconde.`, other: (z) => `Encore ${z} secondes.` }),
    los: "C'est parti !",
  },
  // ★ ES-O (27.09.2026): tú. Der Platz als „Puesto 2 de 6" - ohne „º": Das
  // Zeichen liest eine Sprachausgabe unzuverlässig, und die Braillezeile
  // zeigt es als eigenes Zeichen (Bauplan S6: Ordnungszahlen als Wort).
  es: {
    einladung: (host: string) => `${host} te invita a una Competición de la clase.`,
    niemandDabei:
      "Todavía nadie - la invitación ha llegado a todo el alumnado de tu clase que tiene Tastenflow abierto ahora mismo.",
    dabei: (anzahl: number, namen: string) => `${anzahl} ${anzahl === 1 ? "participa" : "participan"}: ${namen}`,
    platz: (platz: number, anzahl: number) => `Puesto ${platz} de ${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}. ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "es", { one: (z) => `Queda ${z} minuto.`, other: (z) => `Quedan ${z} minutos.` }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "es", { one: (z) => `Queda ${z} segundo.`, other: (z) => `Quedan ${z} segundos.` }),
    los: "¡Ya!",
  },
  // ★ O-IT (02.10.2026): tu; „Gara di classe" (Glossar §2.3), Platz mit
  // ausgeschriebener Ordnungszahl, „Via!".
  it: {
    einladung: (host: string) => `${host} ti invita a una Gara di classe.`,
    niemandDabei:
      "Ancora nessuno - l'invito è arrivato a chi nella tua classe ha Tastenflow aperto in questo momento.",
    dabei: (anzahl: number, namen: string) => `${anzahl} ${anzahl === 1 ? "partecipa" : "partecipano"}: ${namen}`,
    platz: (platz: number, anzahl: number) => platzIt(platz, anzahl),
    topEintrag: (platz: number, name: string) => `${platz}. ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "it", { one: (z) => `Manca ${z} minuto.`, other: (z) => `Mancano ${z} minuti.` }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "it", { one: (z) => `Manca ${z} secondo.`, other: (z) => `Mancano ${z} secondi.` }),
    los: "Via!",
  },
  // ★ O-PL (02.10.2026): ty; „Wyścig klasowy" (Glossar §2.3), der Name des
  // Gastgebers als Subjekt im Nominativ („Ania zaprasza cię…", Regel 11);
  // „Miejsce 2 z 6" ohne Ordnungszahl; Restzeit mit vier Formen; „Start!" nur
  // als Ausruf.
  pl: {
    einladung: (host: string) => `${host} zaprasza cię do Wyścigu klasowego.`,
    niemandDabei:
      "Jeszcze nikogo - zaproszenie trafiło do wszystkich z twojej klasy, którzy mają teraz otwarty program Tastenflow.",
    dabei: (anzahl: number, namen: string) => `${anzahl} w wyścigu: ${namen}`,
    platz: (platz: number, anzahl: number) => `Miejsce ${platz} z ${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}: ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "pl", {
        one: (z) => `Została ${z} minuta.`,
        few: (z) => `Zostały ${z} minuty.`,
        many: (z) => `Zostało ${z} minut.`,
        other: (z) => `Zostało ${z} minuty.`,
      }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "pl", {
        one: (z) => `Została ${z} sekunda.`,
        few: (z) => `Zostały ${z} sekundy.`,
        many: (z) => `Zostało ${z} sekund.`,
        other: (z) => `Zostało ${z} sekundy.`,
      }),
    los: "Start!",
  },
  // ★ O-TR (02.10.2026): sen; "Sınıf Maçı" (Glossar §2.3); KEINE Endung an
  // Namen oder Zahl - "Davet eden: Ali.", "6 kişi arasında 2." (Ordnungszahl
  // mit Punkt, §1 Regel 5/6), "3 kişi katıldı: ..." (die Zahl bleibt links);
  // nach der Zahl die Einzahl ("5 dakika kaldı.").
  tr: {
    einladung: (host: string) => `Sınıf Maçı daveti. Davet eden: ${host}.`,
    niemandDabei:
      "Henüz katılan yok - davet, sınıfında şu anda Tastenflow açık olan herkese gitti.",
    dabei: (anzahl: number, namen: string) => `${anzahl} kişi katıldı: ${namen}`,
    platz: (platz: number, anzahl: number) => `${anzahl} kişi arasında ${platz}.`,
    topEintrag: (platz: number, name: string) => `${platz}. ${name}`,
    nochMinuten: (min: number) => `${min} dakika kaldı.`,
    nochSekunden: (sek: number) => `${sek} saniye kaldı.`,
    los: "Başla!",
  },
  // ★ O-CS (03.10.2026): ty; „Třídní závod" (Glossar §2.3); Namen nur nach
  // Doppelpunkt („Zve tě: Honza."); „2. místo ze 6" mit `zZe` (Regel 13);
  // die Zahl bleibt links („3 v závodě: Honza, Eva"); Restzeit mit vier Formen - das
  // Verb zieht mit (§2.11); „Start!" nur als Ruf.
  cs: {
    einladung: (host: string) => `Pozvánka na Třídní závod. Zve tě: ${host}.`,
    niemandDabei:
      "Zatím tu nikdo není - pozvánka šla všem ve tvé třídě, kdo má právě otevřenou aplikaci Tastenflow.",
    dabei: (anzahl: number, namen: string) => `${anzahl} v závodě: ${namen}`,
    platz: (platz: number, anzahl: number) => `${platz}. místo ${zZe(anzahl)} ${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}. ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "cs", {
        one: (z) => `Zbývá ${z} minuta.`,
        few: (z) => `Zbývají ${z} minuty.`,
        many: (z) => `Zbývá ${z} minuty.`,
        other: (z) => `Zbývá ${z} minut.`,
      }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "cs", {
        one: (z) => `Zbývá ${z} sekunda.`,
        few: (z) => `Zbývají ${z} sekundy.`,
        many: (z) => `Zbývá ${z} sekundy.`,
        other: (z) => `Zbývá ${z} sekund.`,
      }),
    los: "Start!",
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    einladung: (host: string) => `Покана за състезание в класа. Кани те: ${host}.`,
    niemandDabei:
      "Още никой не участва - поканата е стигнала до всички в класа ти, които в момента имат отворен Tastenflow.",
    dabei: (anzahl: number, namen: string) => `Участват (${anzahl}): ${namen}`,
    platz: (platz: number, anzahl: number) => `Място: ${platz}/${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}: ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "bg", {
        one: (z) => `Остава ${z} минута.`,
        other: (z) => `Остават ${z} минути.`,
      }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "bg", {
        one: (z) => `Остава ${z} секунда.`,
        other: (z) => `Остават ${z} секунди.`,
      }),
    los: "Старт!",
  },
  el: {
    einladung: (host: string) => `Πρόσκληση σε Αγώνα τμήματος. Σε προσκαλεί: ${host}.`,
    niemandDabei:
      "Δεν έχει έρθει ακόμα κανένα άτομο - η πρόσκληση έφτασε σε όλα τα άτομα του τμήματός σου που έχουν τώρα ανοιχτό το Tastenflow.",
    dabei: (anzahl: number, namen: string) => `Συμμετέχουν ${anzahl}: ${namen}`,
    platz: (platz: number, anzahl: number) => `${platz}η θέση από ${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}η θέση: ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "el", {
        one: (z) => `Απομένει ${z} λεπτό.`,
        other: (z) => `Απομένουν ${z} λεπτά.`,
      }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "el", {
        one: (z) => `Απομένει ${z} δευτερόλεπτο.`,
        other: (z) => `Απομένουν ${z} δευτερόλεπτα.`,
      }),
    los: "Πάμε!",
  },
  hu: {
    einladung: (host: string) => `${host} meghívott az osztályversenyre.`,
    niemandDabei:
      "Még senki sincs benne - a meghívó mindenkihez eljutott az osztályodból, akinél éppen nyitva van a Tastenflow.",
    dabei: (anzahl: number, namen: string) => `Résztvevők (${anzahl}): ${namen}`,
    platz: (platz: number, anzahl: number) => `Hely: ${platz}/${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}. ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "hu", { one: (z) => `Még ${z} perc.`, other: (z) => `Még ${z} perc.` }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "hu", { one: (z) => `Még ${z} másodperc.`, other: (z) => `Még ${z} másodperc.` }),
    los: "Rajt!",
  },
  nl: {
    einladung: (host: string) => `${host} nodigt je uit voor een Klassenwedstrijd.`,
    niemandDabei:
      "Nog niemand erbij - de uitnodiging is naar iedereen in je klas gegaan die Tastenflow nu open heeft.",
    dabei: (anzahl: number, namen: string) => `${anzahl} erbij: ${namen}`,
    platz: (platz: number, anzahl: number) => `Plaats ${platz} van ${anzahl}`,
    topEintrag: (platz: number, name: string) => `Plaats ${platz}: ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "nl", { one: (z) => `Nog ${z} minuut.`, other: (z) => `Nog ${z} minuten.` }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "nl", { one: (z) => `Nog ${z} seconde.`, other: (z) => `Nog ${z} seconden.` }),
    los: "Start!",
  },
  pt: {
    einladung: (host: string) => `${host} convida-te para a Corrida da turma.`,
    niemandDabei:
      "Ainda ninguém entrou - o convite foi enviado a todas as pessoas da tua turma que têm o Tastenflow aberto neste momento.",
    dabei: (anzahl: number, namen: string) => `${anzahl} na corrida: ${namen}`,
    platz: (platz: number, anzahl: number) => `Lugar: ${platz} de ${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}: ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "pt", {
        one: (z) => `Falta ${z} minuto.`,
        other: (z) => `Faltam ${z} minutos.`,
        many: (z) => `Faltam ${z} de minutos.`,
      }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "pt", {
        one: (z) => `Falta ${z} segundo.`,
        other: (z) => `Faltam ${z} segundos.`,
        many: (z) => `Faltam ${z} de segundos.`,
      }),
    los: "Já!",
  },
  br: {
    einladung: (host: string) => `${host} convida você para uma Competição da turma.`,
    niemandDabei:
      "Ainda não entrou ninguém - o convite foi para todas as pessoas da sua turma que estão com o Tastenflow aberto agora.",
    dabei: (anzahl: number, namen: string) => `${anzahl} na competição: ${namen}`,
    platz: (platz: number, anzahl: number) => `Posição ${platz} de ${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}º ${name}`,
    nochMinuten: (min: number) =>
      min === 0
        ? "Falta menos de 1 minuto."
        : mehrzahl(min, "br", {
            one: (z) => `Falta ${z} minuto.`,
            other: (z) => `Faltam ${z} minutos.`,
          }),
    nochSekunden: (sek: number) =>
      sek === 0
        ? "Acabou o tempo."
        : mehrzahl(sek, "br", {
            one: (z) => `Falta ${z} segundo.`,
            other: (z) => `Faltam ${z} segundos.`,
          }),
    los: "Já!",
  },
  ro: {
    einladung: (host: string) => `Invitație la Întrecerea clasei. Te invită: ${host}.`,
    niemandDabei:
      "Încă nu s-a alăturat nimeni - invitația a ajuns la toți din clasa ta care au Tastenflow deschis chiar acum.",
    dabei: (anzahl: number, namen: string) => `${anzahl} participă: ${namen}`,
    platz: (platz: number, anzahl: number) => `Locul ${platz} din ${anzahl}`,
    topEintrag: (platz: number, name: string) => `Locul ${platz}: ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "ro", {
        one: () => "Mai este un minut.",
        few: (z) => `Mai sunt ${z} minute.`,
        other: (z) => `Mai sunt ${z} de minute.`,
      }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "ro", {
        one: () => "Mai este o secundă.",
        few: (z) => `Mai sunt ${z} secunde.`,
        other: (z) => `Mai sunt ${z} de secunde.`,
      }),
    los: "Start!",
  },
  sv: {
    einladung: (host: string) => `${host} bjuder in dig till klasstävlingen.`,
    niemandDabei:
      "Ingen har gått med än - inbjudan har gått till alla i din klass som har Tastenflow öppet just nu.",
    dabei: (anzahl: number, namen: string) => `${anzahl} med: ${namen}`,
    platz: (platz: number, anzahl: number) => `Plats: ${platz}/${anzahl}`,
    topEintrag: (platz: number, name: string) => `Plats ${platz}: ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "sv", { one: (z) => `${z} minut kvar.`, other: (z) => `${z} minuter kvar.` }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "sv", { one: (z) => `${z} sekund kvar.`, other: (z) => `${z} sekunder kvar.` }),
    los: "Kör!",
  },
  uk: {
    einladung: (host: string) => `Запрошення на Перегони класу. Запрошує: ${host}.`,
    niemandDabei:
      "Поки що нікого немає - запрошення отримали всі з твого класу, хто зараз відкрив Tastenflow.",
    dabei: (anzahl: number, namen: string) => `Беруть участь (${anzahl}): ${namen}`,
    platz: (platz: number, anzahl: number) => `Місце: ${platz}/${anzahl}`,
    topEintrag: (platz: number, name: string) => `${platz}: ${name}`,
    nochMinuten: (min: number) =>
      mehrzahl(min, "uk", {
        one: (z) => `Залишилася ${z} хвилина.`,
        few: (z) => `Залишилися ${z} хвилини.`,
        many: (z) => `Залишилося ${z} хвилин.`,
        other: (z) => `Залишилося ${z} хвилини.`,
      }),
    nochSekunden: (sek: number) =>
      mehrzahl(sek, "uk", {
        one: (z) => `Залишилася ${z} секунда.`,
        few: (z) => `Залишилися ${z} секунди.`,
        many: (z) => `Залишилося ${z} секунд.`,
        other: (z) => `Залишилося ${z} секунди.`,
      }),
    los: "Старт!",
  },
});

/** „Sarah lädt dich zu einem Klassenmatch ein." (englisch „Sarah is inviting you to a Class Match.") */
export function einladungSatz(hostName: string, sprache: BedienSprache = "de"): string {
  return MATCH_TEXTE[sprache].einladung(hostName);
}

/**
 * ★★★ WER DABEI IST - die Zeile für den Gastgeber (F3).
 *
 * *„Auf der Braillezeile: ganz links die Zahl, daneben die Namen, die NEUESTEN
 * gleich neben der Zahl."* Also: „3 dabei: Tester, Sebastian, Tester" - Tester
 * ist gerade dazugekommen.
 *
 * Der Grund für die umgekehrte Reihenfolge steht im Auftrag selbst: Wer mit dem
 * Finger links auf der Zeile steht, liest die Zahl und gleich danach das
 * Neueste. Eine Liste in Beitritts-Reihenfolge zwänge ihn, jedes Mal bis zum
 * Ende zu fahren, nur um zu sehen, wer eben dazugekommen ist.
 */
export function dabeiSatz(
  namenNeuesteZuerst: readonly string[],
  sprache: BedienSprache = "de",
): string {
  // Johannes 11.09.2026: „wenn es daran liegt, dass niemand in der Klasse
  // angemeldet ist, dann wäre eine Meldung schön" - der Satz sagt, WO die
  // Einladung gerade ist, statt nur „niemand".
  const t = MATCH_TEXTE[sprache];
  if (!namenNeuesteZuerst.length) return t.niemandDabei;
  // ★ Englisch „3 joined: Tester, …" - die Zahl bleibt links, wie der Auftrag
  // es für die Braillezeile verlangt.
  return t.dabei(namenNeuesteZuerst.length, namenNeuesteZuerst.join(", "));
}

/**
 * Die Namen der Beigetretenen, die NEUESTEN zuerst - aus den Stand-Zeilen.
 * Der Gastgeber selbst steht nicht darin: Er weiss, dass er dabei ist.
 */
export function dabeiNamen(
  staende: readonly MatchStand[],
  hostUid: string,
): string[] {
  return staende
    .filter((s) => s.pupilUid !== hostUid && (s.status === "dabei" || s.status === "schreibt"))
    .slice()
    .sort((a, b) => b.updatedMs - a.updatedMs)
    .map((s) => s.name);
}

/** „Platz 2 von 6" - der eigene Rang über dem Feld (F12). Englisch „2nd of 6". */
export function platzSatz(platz: number, anzahl: number, sprache: BedienSprache = "de"): string {
  return MATCH_TEXTE[sprache].platz(platz, anzahl);
}

/**
 * Die Antwort auf Alt + X im Match (F14): eigener Platz, Restzeit und die
 * ersten drei. Genau wie die Restzeit in der Tippchallenge geht sie
 * ausdrücklich auch in den Live-Bereich - wer fragt, will eine Antwort.
 */
export function matchBrailleSatz(
  platz: number,
  anzahl: number,
  restMs: number,
  liste: readonly RanglistenEintrag[],
  sprache: BedienSprache = "de",
): string {
  const t = MATCH_TEXTE[sprache];
  const top = liste
    .slice(0, 3)
    .map((e) => t.topEintrag(e.platz, e.stand.name))
    .join(", ");
  const kopf = `${platzSatz(platz, anzahl, sprache)}, ${mmss(restMs)}.`;
  return top ? `${kopf} ${top}` : kopf;
}

/**
 * Alt + P - die ganze Platzliste: „1. Sarah, 2. Mia, 3. Ben, 4. Tester."
 * Tester (13.11.2026): „wo ich sehen kann, wievielter Platz jemand ist" -
 * Alt + X nennt nur den eigenen Platz und die ersten drei.
 */
export function matchPlatzliste(
  liste: readonly RanglistenEintrag[],
  sprache: BedienSprache = "de",
): string {
  const t = MATCH_TEXTE[sprache];
  return liste.map((e) => t.topEintrag(e.platz, e.stand.name)).join(", ") + ".";
}

/**
 * „Noch 1 Minute." / „Noch 10 Sekunden." - die zwei Ansagen des Laufs
 * (englisch „1 minute left." / „10 seconds left.").
 */
export function matchRestGesprochen(restMs: number, sprache: BedienSprache = "de"): string {
  const t = MATCH_TEXTE[sprache];
  const sek = Math.max(0, Math.round(restMs / 1000));
  if (sek >= 60) return t.nochMinuten(Math.round(sek / 60));
  return t.nochSekunden(sek);
}

/**
 * Der Countdown (F5). Gesprochen wird nur die letzte Sekunde jeder Zahl - und
 * ab 3, nicht ab 10: Zehn Zahlen hintereinander sind auf einer Braillezeile
 * zehn Blitzmeldungen, und in diesen zehn Sekunden tippt niemand, aber lesen
 * will vielleicht doch jemand.
 */
export function countdownAnsage(restSek: number, sprache: BedienSprache = "de"): string | null {
  if (restSek === 3) return "3";
  if (restSek === 2) return "2";
  if (restSek === 1) return "1";
  if (restSek === 0) return MATCH_TEXTE[sprache].los;
  return null;
}

/**
 * Die Ehrenplätze (F13). Zeichen UND Wort - ein Pokal, den nur sieht, wer
 * Farben und Formen sieht, ist für ein Kind mit Blindheit kein Platz 1.
 */
export const EHRENPLAETZE: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Pokal" },
  2: { zeichen: "🥈", wort: "Silber" },
  3: { zeichen: "🥉", wort: "Bronze" },
};

/** Dieselben Ehrenplätze englisch (EN5): *Trophy*, *Silver*, *Bronze*. */
export const EHRENPLAETZE_EN: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Trophy" },
  2: { zeichen: "🥈", wort: "Silver" },
  3: { zeichen: "🥉", wort: "Bronze" },
};

/**
 * Dieselben Ehrenplätze französisch (E11a-4, 26.09.2026): *Trophée*,
 * *Argent*, *Bronze* (Glossar §9.2 - kein „Médaille d'or/d'argent", das
 * Zeichen daneben sagt schon Gold/Silber/Bronze; „Bronze" bleibt wie im
 * Deutschen und Englischen dasselbe Wort).
 */
export const EHRENPLAETZE_FR: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Trophée" },
  2: { zeichen: "🥈", wort: "Argent" },
  3: { zeichen: "🥉", wort: "Bronze" },
};

/** ★ ES-O (27.09.2026): dieselben Ehrenplätze spanisch - *Oro*, *Plata*, *Bronce* (ES-TF2 Q: vorher „Trofeo"). */
export const EHRENPLAETZE_ES: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Oro" },
  2: { zeichen: "🥈", wort: "Plata" },
  3: { zeichen: "🥉", wort: "Bronce" },
};

/** ★ O-IT (02.10.2026): dieselben Ehrenplätze italienisch - *Coppa*, *Argento*, *Bronzo* (Glossar §2.3). */
export const EHRENPLAETZE_IT: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Coppa" },
  2: { zeichen: "🥈", wort: "Argento" },
  3: { zeichen: "🥉", wort: "Bronzo" },
};

/** ★ O-PL (02.10.2026): dieselben Ehrenplätze polnisch - *Puchar*, *Srebro*, *Brąz* (Glossar §2.3). */
export const EHRENPLAETZE_PL: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Puchar" },
  2: { zeichen: "🥈", wort: "Srebro" },
  3: { zeichen: "🥉", wort: "Brąz" },
};

/** ★ O-TR (02.10.2026): dieselben Ehrenplätze türkisch - *Kupa*, *Gümüş*, *Bronz* (Glossar §2.3). */
export const EHRENPLAETZE_TR: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Kupa" },
  2: { zeichen: "🥈", wort: "Gümüş" },
  3: { zeichen: "🥉", wort: "Bronz" },
};

/** ★ O-CS (03.10.2026): dieselben Ehrenplätze tschechisch - *Pohár*, *Stříbro*, *Bronz* (Glossar §2.3). */
export const EHRENPLAETZE_CS: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Pohár" },
  2: { zeichen: "🥈", wort: "Stříbro" },
  3: { zeichen: "🥉", wort: "Bronz" },
};

/** ★ O2-LIB (29.10.2026): dieselben Ehrenplätze bulgarisch - Купа, Сребро, Бронз (Glossar §2.3). */
export const EHRENPLAETZE_BG: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Купа" },
  2: { zeichen: "🥈", wort: "Сребро" },
  3: { zeichen: "🥉", wort: "Бронз" },
};

/** ★ O-EL-LIB (30.10.2026): dieselben Ehrenplätze griechisch - Κύπελλο, Ασημένιο, Χάλκινο (Glossar §2.3). */
export const EHRENPLAETZE_EL: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Κύπελλο" },
  2: { zeichen: "🥈", wort: "Ασημένιο" },
  3: { zeichen: "🥉", wort: "Χάλκινο" },
};

/** ★ O2-LIB (29.10.2026): dieselben Ehrenplätze ungarisch - Kupa, Ezüst, Bronz (Glossar §2.3). */
export const EHRENPLAETZE_HU: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Kupa" },
  2: { zeichen: "🥈", wort: "Ezüst" },
  3: { zeichen: "🥉", wort: "Bronz" },
};

/** ★ O2-LIB (29.10.2026): dieselben Ehrenplätze niederländisch - *Beker*, *Zilver*, *Brons* (Glossar nl §2.3). */
export const EHRENPLAETZE_NL: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Beker" },
  2: { zeichen: "🥈", wort: "Zilver" },
  3: { zeichen: "🥉", wort: "Brons" },
};

/** ★ O-LIB (30.10.2026): os mesmos lugares de honra em português - *Taça*, *Prata*, *Bronze* (Glossar §2.3). */
export const EHRENPLAETZE_PT: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Taça" },
  2: { zeichen: "🥈", wort: "Prata" },
  3: { zeichen: "🥉", wort: "Bronze" },
};

/** ★ O2-LIB (29.10.2026): dieselben Ehrenplätze, Portugiesisch (Brasilien) - Troféu, Prata, Bronze (Glossar §2.3). */
export const EHRENPLAETZE_BR: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Troféu" },
  2: { zeichen: "🥈", wort: "Prata" },
  3: { zeichen: "🥉", wort: "Bronze" },
};

/** ★ O2-LIB (29.10.2026): dieselben Ehrenplätze rumänisch - *Cupă*, *Argint*, *Bronz* (Glossar §2.3). */
export const EHRENPLAETZE_RO: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Cupă" },
  2: { zeichen: "🥈", wort: "Argint" },
  3: { zeichen: "🥉", wort: "Bronz" },
};

/** ★ O2-LIB (30.10.2026): dieselben Ehrenplätze schwedisch - *Pokal*, *Silver*, *Brons* (Glossar sv §2.3). */
export const EHRENPLAETZE_SV: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Pokal" },
  2: { zeichen: "🥈", wort: "Silver" },
  3: { zeichen: "🥉", wort: "Brons" },
};

/** ★ O2-LIB (30.10.2026): dieselben Ehrenplätze ukrainisch - *Кубок*, *Срібло*, *Бронза* (Glossar §2.3). */
export const EHRENPLAETZE_UK: Record<number, { zeichen: string; wort: string }> = {
  1: { zeichen: "🏆", wort: "Кубок" },
  2: { zeichen: "🥈", wort: "Срібло" },
  3: { zeichen: "🥉", wort: "Бронза" },
};

/**
 * Der Ehrenplatz eines Rangs in der Bedienungssprache - oder `undefined`.
 * ★ E11a-4: Tabellen-Zugriff statt der alten `=== "en"`-Weiche (Falle 30,
 * `LEITFADEN-NEUE-SPRACHE.md`) - sonst bekäme „fr" hier still Deutsch.
 */
const EHRENPLAETZE_JE_SPRACHE: Record<BedienSprache, Record<number, { zeichen: string; wort: string }>> = {
  de: EHRENPLAETZE,
  en: EHRENPLAETZE_EN,
  fr: EHRENPLAETZE_FR,
  es: EHRENPLAETZE_ES,
  it: EHRENPLAETZE_IT,
  pl: EHRENPLAETZE_PL,
  tr: EHRENPLAETZE_TR,
  cs: EHRENPLAETZE_CS,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: EHRENPLAETZE_BG,
  el: EHRENPLAETZE_EL,
  hu: EHRENPLAETZE_HU,
  nl: EHRENPLAETZE_NL,
  pt: EHRENPLAETZE_PT,
  br: EHRENPLAETZE_BR,
  ro: EHRENPLAETZE_RO,
  sv: EHRENPLAETZE_SV,
  uk: EHRENPLAETZE_UK,
};

export function ehrenplatz(
  platz: number,
  sprache: BedienSprache = "de",
): { zeichen: string; wort: string } | undefined {
  return EHRENPLAETZE_JE_SPRACHE[sprache][platz];
}
