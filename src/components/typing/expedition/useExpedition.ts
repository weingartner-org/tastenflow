/**
 * Spiel-Zustand & -Logik der Polar-Expedition (Neubau, Bauplan §4/§5/§6). Trägt seit
 * E3 drei Zonen auf EINER Mechanik: PACKEIS (Einzelzeichen je Scholle), STEILWAND und
 * BAUCHRUTSCHE (kurze ZEICHENFOLGEN je Tritt/Hügel, Teilfortschritt innerhalb einer
 * Station). Die getestete Etappen-/Tastenlogik kommt aus `iceFloe.ts` (courseSpots,
 * floeKeyMatches, floeKeyIgnored, pickFishUnit); das Zeitfenster aus
 * `expedition/timing.ts` (§5, `sequenceWindowMs` summiert die Fenster einer Folge).
 *
 * Der zonen-abhängige Teil (Layout, Atmosphäre, Countdown-Klang, Scheitern, Pose,
 * Wortwahl) steckt gebündelt in {@link ZONE} + {@link zoneText} — für Wasser bleibt
 * das Verhalten bit-identisch zu E2, climb/slide setzen nur andere Bausteine ein.
 *
 * Rollen wie im Altspiel (das bis E8 weiterläuft): Tor vor einer neuen Taste
 * (`free=false`) und freies Spiel (`free=true`, Bonus-Fische nur im Wasser). Kein
 * Game Over — wer scheitert, beginnt am letzten Rastplatz neu.
 *
 * Barrierefrei (Bauplan §7): Ansagen über App-Stimme ODER Live-Region (nie beides),
 * Countdown pausiert bei `isSpeaking()`, Zeitdruck abschaltbar, Alt-Kürzel kommen
 * durch (`floeKeyIgnored`). Klänge (§6) über die K28-feste Engine `expedition/audio.ts`.
 */
import type { FingerId } from "@/lib/typing/fingers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SHIFT_UNIT,
  courseSpots,
  courseUnits,
  fingerForChar,
  fingerGuide,
  fingerName,
  heimtasteDerTastatur,
  homeKeyFor,
  cancelQueued,
  floeKeyIgnored,
  floeKeyMatches,
  isSpeaking,
  lexikonWoerter,
  pickFishUnit,
  playErrorSound,
  speakFishVoice,
  speakQueued,
  sprachausgabeBeschaeftigt,
  spokenLabel,
  // ★ E4 (25.09.2026, Bauplan §4.3 Punkt 5, §14 E4): Totasten - nur auf
  // Tastaturen wirksam, deren Lehrgang eine eigene Totasten-Einheit lehrt
  // (ES-P7a-Behebung M1: vorher nur fr), siehe die Schneerutsche unten.
  hatLehrgangsTotasten,
  activeLayout,
  activeLayoutId,
  type FloeCourse,
  type FloeSpot,
  type Mastery,
  type LetterStat,
} from "@/lib/typing";
import { anschlagAus, deuteAnschlag, type OffeneTotaste } from "@/lib/typing/anschlagDeuten";
import {
  POLSTER_START,
  advancePolster,
  sequenceWindowMs,
  unitMedianMs,
} from "@/lib/typing/expedition/timing";
import { STORM_MAX_LEN, STORM_START_LEN } from "@/lib/typing/expedition/course";
import { STATION_WORDS, rateWortSprache, scrambleLetters } from "@/lib/typing/expedition/words";
import { ladeSprachpakete } from "@/lib/typing/sprachpakete";
import { useSprachpaketStand } from "@/components/typing/SprachpaketTor";
import type { Lang } from "@/lib/typing/account";
import { hoehleHatWesen, zoneText, type PlayZone } from "@/lib/typing/expedition/texts";
import {
  playArrive,
  playCaveKeyTone,
  playCaveScare,
  playFall,
  playFishCatch,
  playFishSong,
  playHop,
  playMonsterRaunen,
  playMonsterSay,
  playRockfall,
  playSink,
  playSlideCue,
  playSlideNotYet,
  playSlideThud,
  playSlideTick,
  playSlideWush,
  preloadMonsterUnit,
  primeCaveAudio,
  primePackeisAudio,
  primeSlideAudio,
  primeSteilwandAudio,
  setCavePulse,
  setIceTension,
  startAmbience,
  startCaveAmbience,
  startIce,
  startStationAmbience,
  startStormAmbience,
  stopAllExpedition,
  stopIce,
  stormGust,
  primeStationAudio,
  primeStormAudio,
  playFamilyJingle,
  playRadioBeep,
  playRadioHint,
  playRadioSent,
  setTailwindLevel,
  type AmbienceKind,
} from "@/lib/typing/expedition/audio";
import { mehrzahl, texte, type BedienSprache } from "@/lib/bedienSprache";
import type { Lernweg } from "@/lib/typing/lernweg";
import { grossFuer, kleinFuer } from "@/lib/typing/sprachRegister";
import { istKuerzel } from "@/lib/typing/zeichenTaste";
import type { PenguinPose } from "./PenguinRig";
import { PACKEIS_GROUND_Y, VIEW_W, packeisLayout, type PackeisLayout } from "./scenes/PackeisScene";
import { STEIL_GROUND_Y, steilwandLayout } from "./scenes/SteilwandScene";
import { SLIDE_GROUND_Y, slideLayout } from "./scenes/SlideScene";
import { STORM_GROUND_Y, stormLayout } from "./scenes/StormScene";
import { STATION_GROUND_Y, stationLayout } from "./scenes/StationScene";
import { CAVE_GROUND_Y, caveLayout } from "./scenes/CaveScene";

const TICK_MS = 100;
/**
 * LEBEN (Johannes 14.07.): „Man kann generell immer Tasten spammen und hat irgendwann das
 * gesuchte Wort — soll überall bestraft werden und zurück zum Start springen (vielleicht 2
 * Leben?)". Jede Zone startet mit zwei Herzen. JEDER Fehlgriff kostet eines — in ALLEN Zonen,
 * auch dort, wo es früher gar kein Scheitern gab (Schneesturm, Polarstation). Ein abgelaufenes
 * Zeitfenster kostet ebenfalls eines. Sind beide weg, beginnt die Zone von vorn (Herzen voll)
 * — und der Lauf gilt nicht mehr als sauber, das Polarlicht bleibt aus (§4.6).
 */
export const ZONE_LIVES = 2;
/**
 * „WIRKLICH VERSUCHT" (02.10.2026, Lehrkraft aus einer echten Klasse: „Das Pinguinspiel hat
 * ein Schüler geschafft, indem er nur die Leertaste gedrückt hat."). Entscheidung Johannes:
 * Überspringen - ob per Eingabetaste oder durch die Gnadenregel nach zwei Neustarts - nur,
 * wenn das Kind an dieser Station wirklich etwas versucht hat. Gezählt wird JE STATION
 * (Schritt `pos`) und über Zonen-Neustarts hinweg (erst `open`/„Nochmal spielen" setzt zurück):
 *  - ein Treffer (auch die richtige Taste zu früh in der Rutsche) zählt immer;
 *  - ein Fehlgriff zählt nur, wenn die Taste eine Zeichentaste ist (kein Enter, Tab, Pfeil,
 *    Umschalt …) und NICHT die Leertaste - es sei denn, die Leertaste ist gerade gesucht;
 *  - Zeitablauf und verpasste Buchstaben der Rutsche zählen nie.
 * Wirklich versucht = mindestens `VERSUCH_TREFFER_MIN` Treffer ODER mindestens
 * `VERSUCH_FEHLGRIFFE_MIN` echte Fehlgriffe mit mindestens `VERSUCH_TASTEN_MIN` verschiedenen
 * Tasten. Dasselbe Drücken EINER Taste (Spammen) genügt also nicht.
 */
export const VERSUCH_TREFFER_MIN = 1;
export const VERSUCH_FEHLGRIFFE_MIN = 3;
export const VERSUCH_TASTEN_MIN = 2;

/** Versuche an EINER Station (s. `VERSUCH_*`). */
export interface StationsVersuch {
  treffer: number;
  fehlgriffe: number;
  tasten: Set<string>;
}

/** Zählt dieser Fehlgriff als echter Versuch? `gesucht` = die Taste(n), die dran wären. */
export function zaehltAlsEchterFehlgriff(key: string, gesucht: string): boolean {
  if (key.length !== 1) return false; // Enter/Tab/Pfeile/Umschalt/Dead … sind keine Zeichentasten
  if (key === " ") return gesucht.includes(" "); // Leertaste nur, wenn sie gesucht ist
  return true;
}

/** Hat das Kind an dieser Station wirklich etwas versucht? */
export function wirklichVersucht(v: StationsVersuch | undefined): boolean {
  if (!v) return false;
  return (
    v.treffer >= VERSUCH_TREFFER_MIN ||
    (v.fehlgriffe >= VERSUCH_FEHLGRIFFE_MIN && v.tasten.size >= VERSUCH_TASTEN_MIN)
  );
}
/**
 * Wie lange ein Bonus-Fisch springt, wenn kein Zeitfenster gilt („ohne Zeitdruck"). Sonst
 * bleibt der Fisch genau so lange, wie die Scholle trägt (Johannes 14.07.: „Ein Fisch taucht
 * beim Packeis immer viel zu spät auf, während das Eis unter einem zu schnell wegbricht") —
 * Fisch und Scholle laufen jetzt auf DERSELBEN Uhr, statt auf zwei verschiedenen.
 */
const FISH_MS_GENTLE = 8000;
/** Rücksprung-Pause nach dem Scheitern. */
const FAIL_BACK_MS = 1700;
/** Automatisches Gleiten von der letzten Station ins Ziel. */
const GLIDE_MS = 560;
/** Kurz „Bewegungs"-Pose nach dem Weiterspringen, dann wieder Ruhe-Pose. */
const JUMP_POSE_MS = 460;
/** Verzögerung, bis der Bonus-Fisch nach der Landung springt (Johannes 14.07.: viel früher). */
const FISH_SPAWN_MS = 120;
/**
 * Steilwand: VERBRAUCHTE Zeitanteile, an denen die Steine rieseln — viele, dicht gestaffelt,
 * schon FRÜH im Zeitfenster beginnend (Johannes 15.07.: „der Steinschlag muss schneller
 * passieren, gleich lang wie das Packeis, und stark visuell und fürs Hören"). Das Eisknacken
 * beim Packeis schwillt stufenlos über die GANZE Restzeit an; die Steine spannen jetzt
 * genauso den ganzen Bogen (ab 22 % verbrauchter Zeit bis kurz vor Schluss) statt erst spät
 * bei 55 % — so haben beide Zonen dieselbe Länge und dieselbe wachsende Dringlichkeit (beide
 * rechnen ohnehin mit demselben Zeitfenster aus `sequenceWindowMs`).
 */
const ROCK_WARN_AT: readonly number[] = [0.22, 0.38, 0.52, 0.64, 0.74, 0.83, 0.9, 0.96];
/**
 * Höhle (§4.3): Wenn das Wesen raunt, folgt der Buchstabe erst NACH einer Pause —
 * das Raunen (~0,5 s) muss ausklingen, sonst kleben Raunen und Zeichen (Johannes
 * 13.07.: „nicht zu nahe nebeneinander"). Ohne Raunen wird direkt gesprochen.
 */
const RAUNEN_PAUSE_MS = 950;
/**
 * Nur der Raunen-Eintritt wartet auf die Vorlese-Stimme (Intro/Fehlermeldung).
 * {@link afterIntro} beobachtet `speechSynthesis.speaking`: erst wenn die Stimme
 * WIRKLICH gesprochen hat UND wieder still ist, kommt das Raunen — so landet der
 * erste Buchstabe NIE mitten im Vorlesen (Johannes 13.07.). Zwei Sicherheitsnetze:
 * hat die Stimme nach {@link NO_SPEECH_MS} nie begonnen (Vorlesen aus / Fehlstart),
 * geht es trotzdem los; und ein hängendes `speaking` (Chrome) bricht spätestens nach
 * {@link VOICE_WAIT_CAP_MS} durch, damit die Ansage nie ausbleibt. Progression und
 * Fehlgriff-Wiederholung warten GAR NICHT — sie sprechen sofort.
 */
const VOICE_WAIT_CAP_MS = 10000;
/** Kein Sprechen erkannt (Vorlesen aus) → nach dieser Frist trotzdem raunen. */
const NO_SPEECH_MS = 1200;

/**
 * Schneesturm (§4.4): Die Merkfolge steht so lange auf der Tafel, dann verweht sie.
 * Zeit = Grundzeit + je Zeichen etwas mehr (längere Folge = mehr Merkzeit). Die
 * Verweh-Zeit deckt bewusst die Ansage mit ab (die Tafel bleibt, solange „Merk dir …"
 * spricht) und lässt danach noch einen Moment zum Einprägen.
 */
const STORM_MEMORIZE_BASE = 1400;
const STORM_MEMORIZE_PER = 520;
/** Höchste Steigerungsstufe: von {@link STORM_START_LEN} (4) bis {@link STORM_MAX_LEN} (10). */
const STORM_MAX_LEVEL = STORM_MAX_LEN - STORM_START_LEN;
/** Länge der Merkfolge auf Stufe `level` (0 = Start). */
const stormLenForLevel = (level: number): number =>
  Math.min(STORM_MAX_LEN, STORM_START_LEN + Math.max(0, level));

/**
 * Polarstation — Rate-Hilfe (Bauplan §4.5, umgebaut 13.07. auf Wunsch Johannes): Kommt
 * das Kind nicht weiter, verrät die HINWEIS-TASTE (Tab) den nächsten Buchstaben (das macht
 * `revealHint`). Auf diese Taste weist die Zonen-ERKLÄRUNG einmal am Anfang hin (Tagebuch/
 * Intro) — KEIN wiederkehrender Nudge während des Spiels mehr (Johannes 13.07.: „sag das
 * nur einmal am Anfang, dann nicht mehr").
 */
/** Nach dem Senden eines Wortes: Verzögerung bis zum Antwort-Piepsen der Familie. */
const FAMILY_REPLY_MS = 700;
/** Das fertige Wort bleibt kurz stehen + wird vorgelesen, bevor es weitergeht (Johannes 13.07.). */
const STATION_SOLVED_MS = 1400;

/**
 * Rückenwind-Meter (Bauplan §4.8): belohnt GLEICHMÄSSIGKEIT, nicht Hast. Aus den letzten
 * paar Anschlags-Abständen wird der Variationskoeffizient (Streuung ÷ Mittel) gebildet; ist
 * er klein (gleichmäßiger Rhythmus), füllt sich das Meter, sonst sinkt es sanft. Ein Fehlgriff
 * leert es teilweise. Kein Vergleich mit anderen — nur der eigene Fluss (§9). App-Code darf
 * `Date.now()` nutzen (die Skript-Sperre gilt nur für Workflow-Skripte).
 */
const TAILWIND_SAMPLES = 8; // so viele Abstände gehen in den Variationskoeffizienten
const TAILWIND_STEADY_COV = 0.42; // darunter = gleichmäßig genug → Meter steigt
const TAILWIND_RISE = 0.16; // Zuwachs je gleichmäßigem Anschlag
const TAILWIND_DRIFT = 0.07; // Abbau je ungleichmäßigem Anschlag
const TAILWIND_ERROR_DRAIN = 0.34; // ein Fehlgriff leert das Meter teilweise
const TAILWIND_MAX_GAP_MS = 3500; // längere Pause (Nachdenken/Ansage) bricht den Fluss

/**
 * HEIM-BAUCHRUTSCHE als RHYTHMUS-SPIEL (Johannes 14.07.): „Die Bauchrutsche wäre eher eine
 * Bauchrutsche, wenn man Buchstaben — nur einzelne, und es darf auch nur einer sichtbar sein —
 * schnell auf sich zukommen sieht und sie dann im richtigen Moment drücken muss; sonst ist sie
 * wie die Steilwand sehr unkreativ."
 *
 * Ein Buchstabe fliegt heran; er zählt nur, wenn er IM MOMENT der Ziellinie getippt wird —
 * zu früh oder zu spät kostet ein Herz (dieselbe Strafe wie überall). Damit ist die Zone kein
 * zweites „tippe die Folge ab" mehr, sondern Timing.
 *
 * Barrierefrei (§7): Der Anflug ist HÖRBAR — drei Ticks takten ihn wie ein Metronom-Auftakt,
 * und genau beim Aufgehen des Trefferfensters kommt der helle Zielton ({@link playSlideCue}):
 * „jetzt drücken". Parallel wandert der Buchstabe auf der Braille-Spur nach links auf die
 * Ziel-Position zu (`slideTrack` — die Zeile, die der Hook mitschreibt).
 *
 * Tempo: aus der GEMESSENEN Anschlagszeit der jeweiligen Taste (Median aus „Mein Training",
 * `unitMedianMs`) — dieselbe Datenquelle, aus der Packeis und Steilwand ihr Zeitfenster
 * ziehen. Schnelle Kinder bekommen einen zügigen Anflug, langsame einen ruhigen; niemand
 * bekommt ein Tempo, das nichts mit seinem Können zu tun hat.
 */
const SLIDE_APPROACH_FACTOR = 2.4; // Anflugdauer = Median der Taste × Faktor
const SLIDE_APPROACH_MIN_MS = 1500;
const SLIDE_APPROACH_MAX_MS = 3400;
const SLIDE_NEW_KEY_MS = 3000; // Taste ohne Messwerte: ruhiger Anflug
/** So lange VOR der Ziellinie geht das Trefferfenster auf (der Zielton erklingt dann). */
const SLIDE_HIT_MS = 380;
/** So lange NACH der Ziellinie zählt der Druck noch (Nachlauf, damit es fair bleibt). */
const SLIDE_GRACE_MS = 160;
/** Anteile des Anflugs, an denen ein Tick den Takt vorgibt (Auftakt „drei – zwei – eins"). */
const SLIDE_TICKS: readonly number[] = [0.3, 0.52, 0.72];
/** So viele Felder hat die Braille-/Sicht-Spur, über die der Buchstabe heranwandert. */
export const SLIDE_TRACK_CELLS = 12;

/** Anflugdauer eines Buchstabens auf der Bauchrutsche — aus seiner gemessenen Anschlagszeit. */
function slideApproachMs(unit: string | null, letters: Record<string, LetterStat> | undefined): number {
  if (!unit) return SLIDE_NEW_KEY_MS;
  const med = unitMedianMs(letters?.[unit] ?? letters?.[unit.toLowerCase()]);
  if (med === null) return SLIDE_NEW_KEY_MS;
  return Math.round(
    Math.max(SLIDE_APPROACH_MIN_MS, Math.min(SLIDE_APPROACH_MAX_MS, med * SLIDE_APPROACH_FACTOR)),
  );
}

/** Empfangsstärke aus der Zahl der Fehlgriffe/Hinweise (3 = klar … 1 = viel Rauschen). */
function signalFor(miss: number): number {
  return miss === 0 ? 3 : miss <= 2 ? 2 : 1;
}

/**
 * ★★ DIE SÄTZE DES SPIELS IN BEIDEN BEDIENUNGSSPRACHEN (EN3, 19.09.2026).
 *
 * Entschieden in EN3 (Glossar §4, §6 Nr. 5): Die Erzählung der Expedition ist
 * BEDIENUNG des Spiels und folgt der Bedienungssprache - mit deren Stimme
 * (`speakQueued(text, sprache)` bei aktivem Sprachbereich; sonst genau der
 * Aufruf von vorher). Deutsch wortgleich wie vorher. Die Zonentexte stehen in
 * `lib/typing/expedition/texts.ts`.
 *
 * ⚠️ Was NICHT der Bedienung folgt: das Höhlenwesen (deutsche Aufnahmen, samt
 * seiner Live-Region) und das gelöste Wort der Polarstation (deutsche
 * Wortliste - in der englischen Bedienung mit deutscher Stimme vorgelesen).
 *
 * Ton wie im Deutschen: „kind" erzählend und warm (Kind UND Jugend - `isAdult`
 * ist nur das Erwachsenen-Profil), „erwachsen" sachlich. Glossar §3.6: *floe*,
 * *foothold*, *radio message*, *bonus fish*, *northern lights*; Fehler ⇒
 * *mistake* (§3.2).
 */
export const SPIEL_TEXTE = texte({
  de: {
    signal: (signal: number) =>
      signal >= 3 ? "Klarer Empfang!" : signal === 2 ? "Guter Empfang." : "Empfangen - mit etwas Rauschen.",
    umschalt: "Umschalttaste",
    tafelVerweht: "Die Tafel verweht. Tippe aus dem Gedächtnis.",
    merkBraille: (folge: string) => `Merk dir: ${folge}.`,
    merkAnsage: (erwachsen: boolean, folge: string) =>
      erwachsen ? `Merken: ${folge}.` : `Merk dir: ${folge}!`,
    stationWort: (erwachsen: boolean, gemischt: string) =>
      erwachsen
        ? `Funkspruch, Buchstaben durcheinander: ${gemischt}. Welches Wort ergeben sie? Tippe es.`
        : `Diese Buchstaben sind durcheinander: ${gemischt}. Welches Wort ist das? Tippe es!`,
    beideHerzen: (erwachsen: boolean) =>
      erwachsen
        ? "Beide Herzen verbraucht - die Zone beginnt von vorn."
        : "Oh nein, beide Herzen weg! Die Zone geht wieder von vorn los - du schaffst das!",
    herzWeg: (erwachsen: boolean, rest: number) =>
      erwachsen
        ? `Fehler - noch ${rest} ${rest === 1 ? "Herz" : "Herzen"}.`
        : `Autsch, ein Herz weg! ${rest === 1 ? "Noch eines - pass auf!" : ""}`,
    /**
     * PUNKT 7 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Es wäre gut, wenn ich
     * eine Station nicht verstehe, dass ich die überspringen kann." Der Hinweis auf die
     * Eingabetaste kommt NUR einmal je Zonen-Besuch (beim ERSTEN Neustart, s. `failTo`) -
     * „sparsam, nicht bei jeder Station aufs Neue".
     */
    tippUeberspringen: (erwachsen: boolean) =>
      erwachsen
        ? "Fällt eine Station schwer: Nach ein paar Versuchen überspringt die Eingabetaste sie."
        : "Fällt dir eine Station schwer? Probier ein paar Tasten aus - dann kannst du sie mit der Eingabetaste überspringen!",
    /**
     * 02.10.2026 (Lehrkraft, echte Klasse: ein Kind kam nur mit der Leertaste durchs
     * Spiel): Die Eingabetaste überspringt erst, wenn das Kind an dieser Station wirklich
     * etwas versucht hat (`wirklichVersucht`). Vorher kommt dieser freundliche Hinweis -
     * kein Herzabzug, keine Wertung (Hausregel „nie etwas gegen ein Kind").
     */
    erstSelbst: (erwachsen: boolean) =>
      erwachsen
        ? "Erst ein paar Versuche - dann überspringt die Eingabetaste."
        : "Probier es zuerst selbst - dann kannst du überspringen!",
    /**
     * PUNKT 8 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Wenn man es nach zwei
     * Wiederholungen nicht geschafft hat, sollte es auch einfach weitergehen." Nie ein
     * Vorwurf (Hausregel „nie etwas gegen ein Kind") - darum „wir überspringen", nie
     * „du hast es nicht geschafft".
     */
    stationUebersprungen: (erwachsen: boolean) =>
      erwachsen
        ? "Diese Station wird übersprungen - es geht weiter."
        : "Diese Station lassen wir aus, es geht weiter!",
    /**
     * ★ 28.09.2026: Öffner und Stand der Höhle je nach WEG in zwei Fassungen - das
     * Höhlenwesen gibt es nur auf Weg „de" (`hoehleHatWesen` in texts.ts); sonst klingt
     * ein Ton, und der Name geht an den Screenreader. `mitWesen` kommt aus derselben
     * Frage wie die Ansage selbst (`caveAnnouncement`).
     */
    oeffnerHoehle: (mitWesen: boolean) =>
      mitWesen
        ? "Echo-Höhle: Das Höhlenwesen sagt jede Taste an. Tippe nach Gehör."
        : "Echo-Höhle: Jede Taste klingt als Ton, der Screenreader sagt, welche. Tippe nach Gehör.",
    oeffnerSturm: "Schneesturm: Merk dir jede Folge, dann verweht sie. Tippe aus dem Gedächtnis.",
    oeffnerStation: (buchstaben: number) =>
      `Polarstation: Die Buchstaben liegen durcheinander. Erkenne das Wort und tippe es in der richtigen Reihenfolge, ohne Zeitdruck; die Tab-Taste verrät einen Buchstaben. Erster Funkspruch mit ${buchstaben} Buchstaben.`,
    oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
      `${zone === "water" ? "Eisschollen" : zone === "climb" ? "Steilwand" : "Bauchrutsche"}: Drück ${erste}.`,
    weiter: (folge: string) => `Weiter: ${folge}.`,
    fische: (erwachsen: boolean, fisch: number) =>
      erwachsen
        ? ` ${fisch} ${fisch === 1 ? "Bonus-Fisch" : "Bonus-Fische"} gefangen.`
        : ` Und ${fisch === 1 ? "einen Fisch" : `${fisch} Fische`} gefangen!`,
    torGeschafft: (erwachsen: boolean) =>
      erwachsen ? "Geschafft - die neue Taste wird freigeschaltet." : "Juhu, geschafft! Deine neue Taste wartet!",
    fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
      erster
        ? erwachsen
          ? `Bonus-Fisch: ${taste}.`
          : `Ein Fisch springt! Fang ihn: ${taste}.`
        : `${taste}.`,
    gesendet: (erwachsen: boolean, signal: string) =>
      erwachsen ? `Gesendet. ${signal}` : `Nachricht gesendet. ${signal}`,
    wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
      erwachsen ? `${wort}. Gesendet. ${signal}` : `${wort}! Nachricht gesendet. ${signal}`,
    naechsterBuchstabe: (taste: string, finger: string) =>
      `Der nächste Buchstabe ist ${taste}. ${finger}`,
    nochNicht: (erwachsen: boolean) =>
      erwachsen ? "Noch nicht - der Buchstabe fliegt gleich los." : "Noch nicht! Gleich fliegt der Buchstabe los.",
    zuFrueh: (erwachsen: boolean) =>
      erwachsen ? "Zu früh - erst beim Zielton." : "Zu früh! Warte auf den hellen Ton.",
    gefangen: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Gefangen. Weiter: ${taste}.` : `Gefangen! Weiter: ${taste}.`,
    torStatus: (erwachsen: boolean) =>
      erwachsen ? "Geschafft - die neue Taste wird freigeschaltet." : "Juhu! Deine neue Taste wartet!",
    zurueck: (erwachsen: boolean) => (erwachsen ? "Zurück zum letzten Rastplatz …" : "Gleich nochmal …"),
    wortFertig: (wort: string) => `${wort}! Gesendet.`,
    bisher: (folge: string) => ` Bisher: ${folge}.`,
    /**
     * 02.10.2026 (Lehrkraft, echte Klasse: Kind tippte an der Polarstation zweimal K, das
     * zweite K kostete ein Herz): Ein Buchstabe, der schon an seiner Stelle steht (so oft,
     * wie er im Wort vorkommt), ist KEIN Fehlgriff - nur ein freundlicher Hinweis, kein Herz.
     */
    schonDa: (erwachsen: boolean, taste: string) =>
      erwachsen
        ? `${taste} ist schon gesetzt. Weiter mit dem nächsten Buchstaben.`
        : `${taste} hast du schon. Weiter mit dem nächsten Buchstaben.`,
    /** Nach einem Fehlgriff mit Herz in Reserve: was an der Station schon steht (Zeile und Ansage stimmen überein). */
    schonDaStand: (folge: string) => ` Schon da: ${folge}.`,
    stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
      `Polarstation, Funkspruch ${schritt} von ${von}. Buchstaben durcheinander: ${gemischt}.${bisher}`,
    fischStatus: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Bonus-Fisch: ${taste}!` : `Ein Fisch springt - fang ihn: ${taste}!`,
    hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
      `${nomen} ${schritt} von ${von}. ${mitWesen ? "Hör auf das Höhlenwesen." : "Hör auf die Taste."}`,
    sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
      `${nomen} ${schritt} von ${von}. ${
        getippt > 0 ? `${getippt} von ${laenge} getippt.` : "Tippe aus dem Gedächtnis."
      }`,
    folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
      `${nomen} ${schritt} von ${von}. ${mehrere ? `Folge: ${naechstes}` : `Als Nächstes: ${naechstes}`}`,
  },
  en: {
    signal: (signal: number) =>
      signal >= 3 ? "Crystal clear!" : signal === 2 ? "Good signal." : "Received - with a bit of crackle.",
    umschalt: "Shift",
    tafelVerweht: "The board has blown away. Type from memory.",
    merkBraille: (folge: string) => `Remember: ${folge}.`,
    merkAnsage: (erwachsen: boolean, folge: string) =>
      erwachsen ? `Memorise: ${folge}.` : `Remember: ${folge}!`,
    stationWort: (erwachsen: boolean, gemischt: string) =>
      erwachsen
        ? `Radio message, jumbled letters: ${gemischt}. Which word do they make? Type it.`
        : `These letters are jumbled up: ${gemischt}. Which word is it? Type it!`,
    beideHerzen: (erwachsen: boolean) =>
      erwachsen
        ? "Both hearts used up - the zone starts again from the beginning."
        : "Oh no, both hearts gone! The zone starts again from the beginning - you can do it!",
    herzWeg: (erwachsen: boolean, rest: number) =>
      erwachsen
        ? `Mistake - ${rest} ${rest === 1 ? "heart" : "hearts"} left.`
        : `Ouch, one heart gone! ${rest === 1 ? "One left - careful now!" : ""}`,
    tippUeberspringen: (erwachsen: boolean) =>
      erwachsen
        ? "If a station is difficult: after a few tries, the Enter key skips it."
        : "Finding a station tricky? Try a few keys - then you can press Enter to skip it!",
    erstSelbst: (erwachsen: boolean) =>
      erwachsen ? "A few tries first - then Enter skips." : "Try it yourself first - then you can skip!",
    stationUebersprungen: (erwachsen: boolean) =>
      erwachsen ? "This station will be skipped - moving on." : "We'll skip this one, let's keep going!",
    oeffnerHoehle: (mitWesen: boolean) =>
      mitWesen
        ? "Echo Cave: the cave creature announces each key. Type by ear."
        : "Echo Cave: each key sounds a tone, and the screen reader says which one. Type by ear.",
    oeffnerSturm: "Blizzard: remember each sequence, then it blows away. Type from memory.",
    oeffnerStation: (buchstaben: number) =>
      `Polar Station: the letters are jumbled up. Work out the word and type it in the right order, with no time pressure; the Tab key gives you a letter. First radio message with ${buchstaben} letters.`,
    oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
      `${zone === "water" ? "Ice floes" : zone === "climb" ? "Ice Cliff" : "Belly Slide"}: press ${erste}.`,
    weiter: (folge: string) => `Next: ${folge}.`,
    fische: (erwachsen: boolean, fisch: number) =>
      erwachsen
        ? ` ${fisch} bonus fish caught.`
        : ` And you caught ${fisch === 1 ? "a fish" : `${fisch} fish`}!`,
    torGeschafft: (erwachsen: boolean) =>
      erwachsen ? "Done - the new key is being unlocked." : "Hooray, you did it! Your new key is waiting!",
    fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
      erster
        ? erwachsen
          ? `Bonus fish: ${taste}.`
          : `A fish is jumping! Catch it: ${taste}.`
        : `${taste}.`,
    gesendet: (erwachsen: boolean, signal: string) =>
      erwachsen ? `Sent. ${signal}` : `Message sent. ${signal}`,
    wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
      erwachsen ? `${wort}. Sent. ${signal}` : `${wort}! Message sent. ${signal}`,
    naechsterBuchstabe: (taste: string, finger: string) => `The next letter is ${taste}. ${finger}`,
    nochNicht: (erwachsen: boolean) =>
      erwachsen ? "Not yet - the letter is about to set off." : "Not yet! The letter is about to fly.",
    zuFrueh: (erwachsen: boolean) =>
      erwachsen ? "Too early - wait for the target sound." : "Too early! Wait for the bright sound.",
    gefangen: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Caught. Next: ${taste}.` : `Caught it! Next: ${taste}.`,
    torStatus: (erwachsen: boolean) =>
      erwachsen ? "Done - the new key is being unlocked." : "Hooray! Your new key is waiting!",
    zurueck: (erwachsen: boolean) => (erwachsen ? "Back to the last resting point …" : "Here we go again …"),
    wortFertig: (wort: string) => `${wort}! Sent.`,
    bisher: (folge: string) => ` So far: ${folge}.`,
    schonDa: (erwachsen: boolean, taste: string) =>
      erwachsen
        ? `${taste} is already placed. Continue with the next letter.`
        : `You already have ${taste}. On to the next letter.`,
    schonDaStand: (folge: string) => ` Already placed: ${folge}.`,
    stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
      `Polar Station, radio message ${schritt} of ${von}. Jumbled letters: ${gemischt}.${bisher}`,
    fischStatus: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Bonus fish: ${taste}!` : `A fish is jumping - catch it: ${taste}!`,
    hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
      `${nomen} ${schritt} of ${von}. ${mitWesen ? "Listen to the cave creature." : "Listen for the key."}`,
    sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
      `${nomen} ${schritt} of ${von}. ${getippt > 0 ? `${getippt} of ${laenge} typed.` : "Type from memory."}`,
    folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
      `${nomen} ${schritt} of ${von}. ${mehrere ? `Sequence: ${naechstes}` : `Next: ${naechstes}`}`,
  },
  /*
   * ★ E11a-5 (26.09.2026): dieselben Sätze FRANZÖSISCH - neu geschrieben aus der Funktion
   * jedes Satzes, nicht übersetzt (Bauplan französischer Lehrgang §6.2/§9.1). Glossar §9.2:
   * « erreur de frappe », nie « faute »; Maj, Entrée, Tab wie auf der Kappe. Eine „Station"
   * des Spiels (Scholle, Tritt, Funkspruch) heisst « étape » - « station » ist im
   * Französischen die Polarstation. Mehrzahl über `mehrzahl()` (im Französischen zählt
   * auch 0 als Einzahl). Gewöhnliches Leerzeichen vor `: ; ! ?` wie im übrigen fr-Code.
   */
  fr: {
    signal: (signal: number) =>
      signal >= 3 ? "Réception parfaite !" : signal === 2 ? "Bonne réception." : "Reçu - avec un peu de grésillement.",
    umschalt: "Maj",
    tafelVerweht: "Le tableau s'est envolé. Tape de mémoire.",
    merkBraille: (folge: string) => `Retiens : ${folge}.`,
    merkAnsage: (erwachsen: boolean, folge: string) =>
      erwachsen ? `À retenir : ${folge}.` : `Retiens : ${folge} !`,
    stationWort: (erwachsen: boolean, gemischt: string) =>
      erwachsen
        ? `Message radio, lettres mélangées : ${gemischt}. Quel mot forment-elles ? Tape-le.`
        : `Ces lettres sont mélangées : ${gemischt}. Quel mot est-ce ? Tape-le !`,
    beideHerzen: (erwachsen: boolean) =>
      erwachsen
        ? "Les deux cœurs sont utilisés - la zone recommence depuis le début."
        : "Oh non, plus de cœurs ! La zone recommence depuis le début - tu vas y arriver !",
    herzWeg: (erwachsen: boolean, rest: number) =>
      erwachsen
        ? mehrzahl(rest, "fr", {
            one: (z) => `Erreur de frappe - il reste ${z} cœur.`,
            other: (z) => `Erreur de frappe - il reste ${z} cœurs.`,
          })
        : `Aïe, un cœur de moins ! ${rest === 1 ? "Plus qu'un - fais bien attention !" : ""}`,
    tippUeberspringen: (erwachsen: boolean) =>
      erwachsen
        ? "Si une étape est difficile : après quelques essais, la touche Entrée la passe."
        : "Une étape te semble difficile ? Essaie quelques touches - ensuite tu peux la passer avec la touche Entrée !",
    erstSelbst: (erwachsen: boolean) =>
      erwachsen
        ? "D'abord quelques essais - ensuite Entrée passe l'étape."
        : "Essaie d'abord toi-même - ensuite tu pourras passer !",
    stationUebersprungen: (erwachsen: boolean) =>
      erwachsen ? "Cette étape est passée - on continue." : "On passe cette étape, on continue !",
    // ★ D1 Randfund (28.09.2026): auf Weg „fr" gibt es kein Höhlenwesen - ein
    // Ton, der Name kommt über den Screenreader (`caveAnnouncement`). Auf Weg „de"
    // gibt es das Wesen: dort der frühere Wortlaut.
    oeffnerHoehle: (mitWesen: boolean) =>
      mitWesen
        ? "Grotte de l'écho : la créature de la grotte annonce chaque touche. Tape à l'oreille."
        : "Grotte de l'écho : chaque touche sonne, le lecteur d'écran dit laquelle. Tape à l'oreille.",
    oeffnerSturm: "Tempête de neige : retiens chaque suite, puis le vent l'emporte. Tape de mémoire.",
    oeffnerStation: (buchstaben: number) =>
      mehrzahl(buchstaben, "fr", {
        one: (z) =>
          `Station polaire : les lettres sont mélangées. Trouve le mot et tape-le dans le bon ordre, sans limite de temps ; la touche Tab donne une lettre. Premier message radio : ${z} lettre.`,
        other: (z) =>
          `Station polaire : les lettres sont mélangées. Trouve le mot et tape-le dans le bon ordre, sans limite de temps ; la touche Tab donne une lettre. Premier message radio : ${z} lettres.`,
      }),
    oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
      `${{ water: "Banquise", climb: "Falaise de glace", slide: "Glissade" }[zone]} : appuie sur ${erste}.`,
    weiter: (folge: string) => `Ensuite : ${folge}.`,
    fische: (erwachsen: boolean, fisch: number) =>
      erwachsen
        ? mehrzahl(fisch, "fr", {
            one: (z) => ` ${z} poisson bonus attrapé.`,
            other: (z) => ` ${z} poissons bonus attrapés.`,
          })
        : mehrzahl(fisch, "fr", {
            one: () => " Et tu as attrapé un poisson !",
            other: (z) => ` Et tu as attrapé ${z} poissons !`,
          }),
    torGeschafft: (erwachsen: boolean) =>
      erwachsen ? "Réussi - la nouvelle touche est débloquée." : "Youpi, tu as réussi ! Ta nouvelle touche t'attend !",
    fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
      erster
        ? erwachsen
          ? `Poisson bonus : ${taste}.`
          : `Un poisson saute ! Attrape-le : ${taste}.`
        : `${taste}.`,
    gesendet: (erwachsen: boolean, signal: string) =>
      erwachsen ? `Envoyé. ${signal}` : `Message envoyé. ${signal}`,
    wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
      erwachsen ? `${wort}. Envoyé. ${signal}` : `${wort} ! Message envoyé. ${signal}`,
    naechsterBuchstabe: (taste: string, finger: string) => `La lettre suivante est ${taste}. ${finger}`,
    nochNicht: (erwachsen: boolean) =>
      erwachsen ? "Pas encore - la lettre va bientôt partir." : "Pas encore ! La lettre va bientôt s'envoler.",
    zuFrueh: (erwachsen: boolean) =>
      erwachsen ? "Trop tôt - attends le son cible." : "Trop tôt ! Attends le son clair.",
    gefangen: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Attrapé. Ensuite : ${taste}.` : `Attrapé ! Ensuite : ${taste}.`,
    torStatus: (erwachsen: boolean) =>
      erwachsen ? "Réussi - la nouvelle touche est débloquée." : "Youpi ! Ta nouvelle touche t'attend !",
    zurueck: (erwachsen: boolean) => (erwachsen ? "Retour au dernier point de repos …" : "On recommence …"),
    wortFertig: (wort: string) => `${wort} ! Envoyé.`,
    bisher: (folge: string) => ` Jusqu'ici : ${folge}.`,
    schonDa: (erwachsen: boolean, taste: string) =>
      erwachsen
        ? `${taste} est déjà placé. On continue avec la lettre suivante.`
        : `Tu as déjà ${taste}. Passe à la lettre suivante !`,
    schonDaStand: (folge: string) => ` Déjà placées : ${folge}.`,
    stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
      `Station polaire, message radio ${schritt} sur ${von}. Lettres mélangées : ${gemischt}.${bisher}`,
    fischStatus: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Poisson bonus : ${taste} !` : `Un poisson saute - attrape-le : ${taste} !`,
    hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
      `${nomen} ${schritt} sur ${von}. ${mitWesen ? "Écoute la créature de la grotte." : "Écoute la touche."}`,
    sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
      `${nomen} ${schritt} sur ${von}. ${getippt > 0 ? `${getippt} sur ${laenge} tapés.` : "Tape de mémoire."}`,
    folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
      `${nomen} ${schritt} sur ${von}. ${mehrere ? `Suite : ${naechstes}` : `Ensuite : ${naechstes}`}`,
  },
  // ★ ES-O (27.09.2026): tú. Tastennamen wie auf der Kappe (Mayús, Intro, Tab).
  es: {
    signal: (signal: number) =>
      signal >= 3 ? "¡Recepción perfecta!" : signal === 2 ? "Buena recepción." : "Recibido - con un poco de ruido.",
    umschalt: "Mayús",
    tafelVerweht: "El viento se ha llevado el tablero. Escribe de memoria.",
    merkBraille: (folge: string) => `Recuerda: ${folge}.`,
    merkAnsage: (erwachsen: boolean, folge: string) =>
      erwachsen ? `Para recordar: ${folge}.` : `¡Recuerda: ${folge}!`,
    stationWort: (erwachsen: boolean, gemischt: string) =>
      erwachsen
        ? `Mensaje de radio, letras revueltas: ${gemischt}. ¿Qué palabra forman? Escríbela.`
        : `Estas letras están revueltas: ${gemischt}. ¿Qué palabra es? ¡Escríbela!`,
    beideHerzen: (erwachsen: boolean) =>
      erwachsen
        ? "Se han gastado los dos corazones - la zona vuelve a empezar desde el principio."
        : "¡Oh, no quedan corazones! La zona vuelve a empezar desde el principio - ¡lo vas a conseguir!",
    herzWeg: (erwachsen: boolean, rest: number) =>
      erwachsen
        ? mehrzahl(rest, "es", {
            one: (z) => `Error - queda ${z} corazón.`,
            other: (z) => `Error - quedan ${z} corazones.`,
          })
        : `¡Ay, un corazón menos! ${rest === 1 ? "Solo queda uno - ¡presta atención!" : ""}`,
    tippUeberspringen: (erwachsen: boolean) =>
      erwachsen
        ? "Si un paso cuesta: tras algunos intentos, la tecla Intro lo salta."
        : "¿Un paso te parece difícil? Prueba algunas teclas - ¡después puedes saltarlo con la tecla Intro!",
    erstSelbst: (erwachsen: boolean) =>
      erwachsen
        ? "Primero unos intentos - después Intro salta el paso."
        : "Pruébalo tú primero - ¡después podrás saltar!",
    stationUebersprungen: (erwachsen: boolean) =>
      erwachsen ? "Este paso se ha saltado - seguimos." : "¡Saltamos este paso, seguimos!",
    // ★ D1 Randfund (28.09.2026): auf Weg „es" gibt es kein Höhlenwesen - ein
    // Ton, der Name kommt über den Screenreader (`caveAnnouncement`). Auf Weg „de"
    // gibt es das Wesen: dort der frühere Wortlaut.
    oeffnerHoehle: (mitWesen: boolean) =>
      mitWesen
        ? "Cueva del Eco: la criatura de la cueva anuncia cada tecla. Escribe de oído."
        : "Cueva del Eco: cada tecla suena, y el lector de pantalla dice cuál es. Escribe de oído.",
    oeffnerSturm: "Tormenta de Nieve: recuerda cada serie, después el viento se la lleva. Escribe de memoria.",
    oeffnerStation: (buchstaben: number) =>
      mehrzahl(buchstaben, "es", {
        one: (z) =>
          `Estación Polar: las letras están revueltas. Descubre la palabra y escríbela en el orden correcto, sin límite de tiempo; la tecla Tab da una letra. Primer mensaje de radio: ${z} letra.`,
        other: (z) =>
          `Estación Polar: las letras están revueltas. Descubre la palabra y escríbela en el orden correcto, sin límite de tiempo; la tecla Tab da una letra. Primer mensaje de radio: ${z} letras.`,
      }),
    oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
      `${{ water: "Banquisa", climb: "Acantilado de hielo", slide: "Tobogán" }[zone]}: pulsa ${erste}.`,
    weiter: (folge: string) => `Después: ${folge}.`,
    fische: (erwachsen: boolean, fisch: number) =>
      erwachsen
        ? mehrzahl(fisch, "es", {
            one: (z) => ` ${z} pez extra atrapado.`,
            other: (z) => ` ${z} peces extra atrapados.`,
          })
        : mehrzahl(fisch, "es", {
            one: () => " ¡Y has atrapado un pez!",
            other: (z) => ` ¡Y has atrapado ${z} peces!`,
          }),
    torGeschafft: (erwachsen: boolean) =>
      erwachsen ? "Conseguido - la tecla nueva está desbloqueada." : "¡Bien, lo has conseguido! ¡Tu tecla nueva te espera!",
    fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
      erster
        ? erwachsen
          ? `Pez extra: ${taste}.`
          : `¡Salta un pez! Atrápalo: ${taste}.`
        : `${taste}.`,
    gesendet: (erwachsen: boolean, signal: string) =>
      erwachsen ? `Enviado. ${signal}` : `Mensaje enviado. ${signal}`,
    wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
      erwachsen ? `${wort}. Enviado. ${signal}` : `¡${wort}! Mensaje enviado. ${signal}`,
    naechsterBuchstabe: (taste: string, finger: string) => `La letra siguiente es ${taste}. ${finger}`,
    nochNicht: (erwachsen: boolean) =>
      erwachsen ? "Todavía no - la letra sale enseguida." : "¡Todavía no! La letra está a punto de salir volando.",
    zuFrueh: (erwachsen: boolean) =>
      erwachsen ? "Demasiado pronto - espera al sonido de meta." : "¡Demasiado pronto! Espera al sonido claro.",
    gefangen: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Atrapada. Después: ${taste}.` : `¡Atrapada! Después: ${taste}.`,
    torStatus: (erwachsen: boolean) =>
      erwachsen ? "Conseguido - la tecla nueva está desbloqueada." : "¡Bien! ¡Tu tecla nueva te espera!",
    zurueck: (erwachsen: boolean) => (erwachsen ? "Vuelta al último punto de descanso …" : "Otra vez …"),
    wortFertig: (wort: string) => `¡${wort}! Enviado.`,
    bisher: (folge: string) => ` Hasta ahora: ${folge}.`,
    schonDa: (erwachsen: boolean, taste: string) =>
      erwachsen
        ? `La letra ${taste} ya está colocada. Siguiente letra.`
        : `Ya tienes la ${taste}. ¡Sigue con la siguiente letra!`,
    schonDaStand: (folge: string) => ` Ya colocadas: ${folge}.`,
    stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
      `Estación Polar, mensaje de radio ${schritt} de ${von}. Letras revueltas: ${gemischt}.${bisher}`,
    fischStatus: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Pez extra: ${taste}.` : `¡Salta un pez - atrápalo: ${taste}!`,
    hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
      `${nomen} ${schritt} de ${von}. ${mitWesen ? "Escucha a la criatura de la cueva." : "Escucha la tecla."}`,
    sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
      `${nomen} ${schritt} de ${von}. ${getippt > 0 ? `${getippt} de ${laenge} escritos.` : "Escribe de memoria."}`,
    folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
      `${nomen} ${schritt} de ${von}. ${mehrere ? `Serie: ${naechstes}` : `Después: ${naechstes}`}`,
  },
  // ★ O-IT (02.10.2026): Kind „tu", höchstens ein „!" je Meldung, Erwachsene keins
  // (Regel 1); Zonen wie im Glossar §2.3 („Banchisa", „Grotta dell'eco" …).
  it: {
    signal: (signal: number) =>
      signal >= 3 ? "Ricezione perfetta!" : signal === 2 ? "Buona ricezione." : "Ricevuto - con un po' di disturbo.",
    umschalt: "Maiusc",
    tafelVerweht: "Il vento si è portato via la lavagna. Scrivi a memoria.",
    merkBraille: (folge: string) => `Ricorda: ${folge}.`,
    merkAnsage: (erwachsen: boolean, folge: string) =>
      erwachsen ? `Da ricordare: ${folge}.` : `Ricorda: ${folge}!`,
    stationWort: (erwachsen: boolean, gemischt: string) =>
      erwachsen
        ? `Messaggio radio, lettere mescolate: ${gemischt}. Che parola formano? Scrivila.`
        : `Queste lettere sono mescolate: ${gemischt}. Che parola è? Scrivila!`,
    beideHerzen: (erwachsen: boolean) =>
      erwachsen
        ? "Finiti tutti e due i cuori - la tappa ricomincia dall'inizio."
        : "Oh no, niente più cuori. La tappa ricomincia dall'inizio - ce la farai!",
    herzWeg: (erwachsen: boolean, rest: number) =>
      erwachsen
        ? mehrzahl(rest, "it", {
            one: (z) => `Errore - resta ${z} cuore.`,
            other: (z) => `Errore - restano ${z} cuori.`,
          })
        : `Ahi, un cuore in meno! ${rest === 1 ? "Ne resta solo uno - fai attenzione." : ""}`,
    tippUeberspringen: (erwachsen: boolean) =>
      erwachsen
        ? "Se un passo è difficile: dopo qualche tentativo, il tasto Invio lo salta."
        : "Un passo ti sembra difficile? Prova qualche tasto - poi puoi saltarlo con il tasto Invio!",
    erstSelbst: (erwachsen: boolean) =>
      erwachsen
        ? "Prima qualche tentativo - poi Invio salta il passo."
        : "Prova prima con le tue forze - poi potrai saltare!",
    stationUebersprungen: (erwachsen: boolean) =>
      erwachsen ? "Questo passo è stato saltato - si continua." : "Saltiamo questo passo, avanti!",
    oeffnerHoehle: (mitWesen: boolean) =>
      mitWesen
        ? "Grotta dell'eco: la creatura della grotta annuncia ogni tasto. Scrivi a orecchio."
        : "Grotta dell'eco: ogni tasto suona, e il lettore di schermo dice quale è. Scrivi a orecchio.",
    oeffnerSturm: "Bufera di neve: ricorda ogni serie, poi il vento la porta via. Scrivi a memoria.",
    oeffnerStation: (buchstaben: number) =>
      mehrzahl(buchstaben, "it", {
        one: (z) =>
          `Stazione polare: le lettere sono mescolate. Trova la parola e scrivila nell'ordine giusto, senza limite di tempo; il tasto Tab dà una lettera. Primo messaggio radio: ${z} lettera.`,
        other: (z) =>
          `Stazione polare: le lettere sono mescolate. Trova la parola e scrivila nell'ordine giusto, senza limite di tempo; il tasto Tab dà una lettera. Primo messaggio radio: ${z} lettere.`,
      }),
    oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
      `${{ water: "Banchisa", climb: "Parete di ghiaccio", slide: "Scivolata verso casa" }[zone]}: premi ${erste}.`,
    weiter: (folge: string) => `Poi: ${folge}.`,
    fische: (erwachsen: boolean, fisch: number) =>
      erwachsen
        ? mehrzahl(fisch, "it", {
            one: (z) => ` ${z} pesce bonus preso.`,
            other: (z) => ` ${z} pesci bonus presi.`,
          })
        : mehrzahl(fisch, "it", {
            one: () => " E hai preso un pesce!",
            other: (z) => ` E hai preso ${z} pesci!`,
          }),
    torGeschafft: (erwachsen: boolean) =>
      erwachsen ? "Fatto - il tasto nuovo è sbloccato." : "Ce l'hai fatta! Il tuo tasto nuovo ti aspetta.",
    fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
      erster
        ? erwachsen
          ? `Pesce bonus: ${taste}.`
          : `Salta un pesce! Prendilo: ${taste}.`
        : `${taste}.`,
    gesendet: (erwachsen: boolean, signal: string) =>
      erwachsen ? `Inviato. ${signal}` : `Messaggio inviato. ${signal}`,
    wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
      erwachsen ? `${wort}. Inviato. ${signal}` : `${wort}. Messaggio inviato. ${signal}`,
    naechsterBuchstabe: (taste: string, finger: string) => `La prossima lettera è ${taste}. ${finger}`,
    nochNicht: (erwachsen: boolean) =>
      erwachsen ? "Non ancora - la lettera arriva subito." : "Non ancora! La lettera sta per arrivare in volo.",
    zuFrueh: (erwachsen: boolean) =>
      erwachsen ? "Troppo presto - aspetta il suono del traguardo." : "Troppo presto! Aspetta il suono chiaro.",
    gefangen: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Presa. Poi: ${taste}.` : `Presa! Poi: ${taste}.`,
    torStatus: (erwachsen: boolean) =>
      erwachsen ? "Fatto - il tasto nuovo è sbloccato." : "Ce l'hai fatta! Il tuo tasto nuovo ti aspetta.",
    zurueck: (erwachsen: boolean) => (erwachsen ? "Ritorno all'ultimo punto di sosta..." : "Ancora una volta..."),
    wortFertig: (wort: string) => `${wort}! Inviato.`,
    bisher: (folge: string) => ` Finora: ${folge}.`,
    schonDa: (erwachsen: boolean, taste: string) =>
      erwachsen
        ? `La lettera ${taste} è già inserita. Si prosegue con la lettera successiva.`
        : `${taste} ce l'hai già. Vai con la lettera successiva!`,
    schonDaStand: (folge: string) => ` Già inserite: ${folge}.`,
    stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
      `Stazione polare, messaggio radio ${schritt} di ${von}. Lettere mescolate: ${gemischt}.${bisher}`,
    fischStatus: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Pesce bonus: ${taste}.` : `Salta un pesce - prendilo: ${taste}!`,
    hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
      `${nomen} ${schritt} di ${von}. ${mitWesen ? "Ascolta la creatura della grotta." : "Ascolta il tasto."}`,
    sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
      `${nomen} ${schritt} di ${von}. ${getippt > 0 ? `${getippt} di ${laenge} scritti.` : "Scrivi a memoria."}`,
    folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
      `${nomen} ${schritt} di ${von}. ${mehrere ? `Serie: ${naechstes}` : `Poi: ${naechstes}`}`,
  },
  // ★ O-PL (02.10.2026): Kind „ty", höchstens ein „!" je Meldung, Erwachsene keins
  // (Regel 1); nie eine Vergangenheit der 2. Person (Regel 2) - Präsens, -no-Form
  // („Wysłano."), Sätze über die Sache. Zonen wie im Glossar §2.3 („Pak lodowy",
  // „Jaskinia echa" …), „serduszka", „dodatkowe rybki". Ein einzelner Schritt des
  // Spiels heisst „krok". Zahl + Nomen mit allen vier Formen oder nach Doppelpunkt.
  pl: {
    signal: (signal: number) =>
      signal >= 3 ? "Doskonały odbiór!" : signal === 2 ? "Dobry odbiór." : "Odebrano - z lekkim szumem.",
    umschalt: "Shift",
    tafelVerweht: "Wiatr zwiał tablicę. Napisz z pamięci.",
    merkBraille: (folge: string) => `Zapamiętaj: ${folge}.`,
    merkAnsage: (erwachsen: boolean, folge: string) =>
      erwachsen ? `Do zapamiętania: ${folge}.` : `Zapamiętaj: ${folge}!`,
    stationWort: (erwachsen: boolean, gemischt: string) =>
      erwachsen
        ? `Wiadomość radiowa, pomieszane litery: ${gemischt}. Jakie słowo z nich powstaje? Napisz je.`
        : `Te litery są pomieszane: ${gemischt}. Jakie to słowo? Napisz je!`,
    beideHerzen: (erwachsen: boolean) =>
      erwachsen
        ? "Oba serduszka zużyte - etap zaczyna się od początku."
        : "Ojej, nie ma już serduszek. Etap zaczyna się od nowa - dasz radę!",
    herzWeg: (erwachsen: boolean, rest: number) =>
      erwachsen
        ? mehrzahl(rest, "pl", {
            one: (z) => `Pomyłka - zostało ${z} serduszko.`,
            few: (z) => `Pomyłka - zostały ${z} serduszka.`,
            many: (z) => `Pomyłka - zostało ${z} serduszek.`,
            other: (z) => `Pomyłka - zostało ${z} serduszka.`,
          })
        : `Auć, jedno serduszko mniej! ${rest === 1 ? "Zostało jeszcze jedno - uważaj." : ""}`,
    tippUeberspringen: (erwachsen: boolean) =>
      erwachsen
        ? "Jeśli jakiś krok jest trudny: po kilku próbach klawisz Enter go pomija."
        : "Ten krok jest trudny? Spróbuj kilku klawiszy - potem możesz go pominąć klawiszem Enter!",
    erstSelbst: (erwachsen: boolean) =>
      erwachsen ? "Najpierw kilka prób - potem Enter pomija krok." : "Najpierw spróbuj - potem możesz pominąć!",
    stationUebersprungen: (erwachsen: boolean) =>
      erwachsen ? "Ten krok zostaje pominięty - dalej." : "Ten krok pomijamy, idziemy dalej!",
    oeffnerHoehle: (mitWesen: boolean) =>
      mitWesen
        ? "Jaskinia echa: stworek z jaskini zapowiada każdy klawisz. Pisz ze słuchu."
        : "Jaskinia echa: każdy klawisz brzmi jak dźwięk, a czytnik ekranu mówi, który to. Pisz ze słuchu.",
    oeffnerSturm: "Śnieżyca: zapamiętaj każdy ciąg, potem wiatr go zwiewa. Pisz z pamięci.",
    oeffnerStation: (buchstaben: number) => {
      const satz =
        "Stacja polarna: litery są pomieszane. Odgadnij słowo i napisz je we właściwej kolejności, bez pośpiechu; klawisz Tab podpowiada literę. Pierwsza wiadomość radiowa:";
      return mehrzahl(buchstaben, "pl", {
        one: (z) => `${satz} ${z} litera.`,
        few: (z) => `${satz} ${z} litery.`,
        many: (z) => `${satz} ${z} liter.`,
        other: (z) => `${satz} ${z} litery.`,
      });
    },
    oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
      `${{ water: "Pak lodowy", climb: "Lodowa ściana", slide: "Ślizgiem do domu" }[zone]}: naciśnij ${erste}.`,
    weiter: (folge: string) => `Dalej: ${folge}.`,
    fische: (erwachsen: boolean, fisch: number) =>
      erwachsen
        ? mehrzahl(fisch, "pl", {
            one: (z) => ` Złowiono ${z} dodatkową rybkę.`,
            few: (z) => ` Złowiono ${z} dodatkowe rybki.`,
            many: (z) => ` Złowiono ${z} dodatkowych rybek.`,
            other: (z) => ` Złowiono ${z} dodatkowej rybki.`,
          })
        : mehrzahl(fisch, "pl", {
            one: () => " A do tego złowiona rybka!",
            few: (z) => ` A do tego ${z} złowione rybki!`,
            many: (z) => ` A do tego ${z} złowionych rybek!`,
            other: (z) => ` A do tego ${z} złowionej rybki!`,
          }),
    torGeschafft: (erwachsen: boolean) =>
      erwachsen ? "Gotowe - nowy klawisz zostaje odblokowany." : "Hura, udało się! Twój nowy klawisz już czeka.",
    fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
      erster
        ? erwachsen
          ? `Dodatkowa rybka: ${taste}.`
          : `Rybka wyskakuje! Złap ją: ${taste}.`
        : `${taste}.`,
    gesendet: (erwachsen: boolean, signal: string) =>
      erwachsen ? `Wysłano. ${signal}` : `Wiadomość wysłana. ${signal}`,
    wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
      erwachsen ? `${wort}. Wysłano. ${signal}` : `${wort}. Wiadomość wysłana. ${signal}`,
    naechsterBuchstabe: (taste: string, finger: string) => `Następna litera to ${taste}. ${finger}`,
    nochNicht: (erwachsen: boolean) =>
      erwachsen ? "Jeszcze nie - litera zaraz wyrusza." : "Jeszcze nie! Litera zaraz poleci.",
    zuFrueh: (erwachsen: boolean) =>
      erwachsen ? "Za wcześnie - poczekaj na dźwięk mety." : "Za wcześnie! Poczekaj na jasny dźwięk.",
    gefangen: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Złapana. Dalej: ${taste}.` : `Złapana! Dalej: ${taste}.`,
    torStatus: (erwachsen: boolean) =>
      erwachsen ? "Gotowe - nowy klawisz zostaje odblokowany." : "Hura! Twój nowy klawisz już czeka.",
    zurueck: (erwachsen: boolean) => (erwachsen ? "Powrót do ostatniego miejsca odpoczynku..." : "Jeszcze raz..."),
    wortFertig: (wort: string) => `${wort}! Wysłano.`,
    bisher: (folge: string) => ` Na razie: ${folge}.`,
    schonDa: (erwachsen: boolean, taste: string) =>
      erwachsen
        ? `Litera ${taste} jest już na miejscu. Dalej z następną literą.`
        : `${taste} już masz. Teraz następna litera.`,
    schonDaStand: (folge: string) => ` Już na miejscu: ${folge}.`,
    stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
      `Stacja polarna, wiadomość radiowa ${schritt} z ${von}. Pomieszane litery: ${gemischt}.${bisher}`,
    fischStatus: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Dodatkowa rybka: ${taste}.` : `Rybka wyskakuje - złap ją: ${taste}!`,
    hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
      `${nomen} ${schritt} z ${von}. ${mitWesen ? "Słuchaj stworka z jaskini." : "Słuchaj klawisza."}`,
    sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
      `${nomen} ${schritt} z ${von}. ${getippt > 0 ? `Napisano: ${getippt} z ${laenge}.` : "Pisz z pamięci."}`,
    folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
      `${nomen} ${schritt} z ${von}. ${mehrere ? `Ciąg: ${naechstes}` : `Dalej: ${naechstes}`}`,
  },
  // ★ O-TR (02.10.2026): Kind sen, höchstens ein "!" je Meldung, Erwachsene keins
  // (Regel 1). Keine Endung an einen Platzhalter (Regel 6): "${taste} tuşuna bas",
  // "${nomen} ${schritt}, toplam ${von}", "${rest} kalp kaldı" (Einzahl nach Zahl).
  // Spielorte wie im Glossar §2.3 ("Buz Tabakası", "Yankı Mağarası" ...), "kalpler",
  // "ödül balıkları". Ein einzelner Schritt des Spiels heisst "adım".
  tr: {
    signal: (signal: number) =>
      signal >= 3 ? "Çok net alındı!" : signal === 2 ? "İyi alındı." : "Alındı - biraz parazitle.",
    umschalt: "Shift",
    tafelVerweht: "Rüzgâr tahtayı savurdu. Aklından yaz.",
    merkBraille: (folge: string) => `Aklında tut: ${folge}.`,
    merkAnsage: (erwachsen: boolean, folge: string) =>
      erwachsen ? `Aklında tut: ${folge}.` : `Aklında tut: ${folge}!`,
    stationWort: (erwachsen: boolean, gemischt: string) =>
      erwachsen
        ? `Telsiz mesajı, harfler karışık: ${gemischt}. Bu harflerden hangi kelime çıkar? Onu yaz.`
        : `Bu harfler karışmış: ${gemischt}. Bu hangi kelime? Onu yaz!`,
    beideHerzen: (erwachsen: boolean) =>
      erwachsen
        ? "İki kalp de bitti - aşama baştan başlıyor."
        : "Eyvah, iki kalp de gitti! Aşama yeniden başlıyor - bunu başarabilirsin.",
    herzWeg: (erwachsen: boolean, rest: number) =>
      erwachsen
        ? `Hata - ${rest} kalp kaldı.`
        : `Ah, bir kalp gitti! ${rest === 1 ? "Bir tane kaldı - dikkat et." : ""}`,
    tippUeberspringen: (erwachsen: boolean) =>
      erwachsen
        ? "Bir adım zor gelirse: birkaç denemeden sonra Enter tuşu onu atlar."
        : "Bu adım zor mu geliyor? Birkaç tuş dene - sonra Enter tuşuyla onu atlayabilirsin!",
    erstSelbst: (erwachsen: boolean) =>
      erwachsen ? "Önce birkaç deneme - sonra Enter tuşu atlar." : "Önce kendin dene - sonra atlayabilirsin!",
    stationUebersprungen: (erwachsen: boolean) =>
      erwachsen ? "Bu adım atlanıyor - devam." : "Bu adımı atlıyoruz, devam ediyoruz!",
    oeffnerHoehle: (mitWesen: boolean) =>
      mitWesen
        ? "Yankı Mağarası: mağara yaratığı her tuşu duyurur. Duyarak yaz."
        : "Yankı Mağarası: her tuş bir ses olarak duyulur, ekran okuyucu hangisi olduğunu söyler. Duyarak yaz.",
    oeffnerSturm: "Kar Fırtınası: her diziyi aklında tut, sonra rüzgâr onu savurur. Aklından yaz.",
    oeffnerStation: (buchstaben: number) =>
      `Kutup İstasyonu: harfler karışık duruyor. Kelimeyi bul ve acele etmeden doğru sırayla yaz; Tab tuşu bir harf söyler. İlk telsiz mesajı: ${buchstaben} harf.`,
    oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
      `${{ water: "Buz Tabakası", climb: "Buz Duvarı", slide: "Eve Doğru Kayış" }[zone]}: ${erste} tuşuna bas.`,
    weiter: (folge: string) => `Devam: ${folge}.`,
    fische: (erwachsen: boolean, fisch: number) =>
      erwachsen
        ? ` Yakalanan ödül balığı: ${fisch}.`
        : fisch === 1
          ? " Bir de balık yakaladın!"
          : ` Bir de ${fisch} balık yakaladın!`,
    torGeschafft: (erwachsen: boolean) =>
      erwachsen ? "Başarıldı - yeni tuşun kilidi açılıyor." : "Yaşasın, başardın! Yeni tuşun seni bekliyor.",
    fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
      erster
        ? erwachsen
          ? `Ödül balığı: ${taste}.`
          : `Bir balık zıpladı! Yakala onu: ${taste}.`
        : `${taste}.`,
    gesendet: (erwachsen: boolean, signal: string) =>
      erwachsen ? `Gönderildi. ${signal}` : `Mesaj gönderildi. ${signal}`,
    wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
      erwachsen ? `${wort}. Gönderildi. ${signal}` : `${wort}. Mesaj gönderildi. ${signal}`,
    naechsterBuchstabe: (taste: string, finger: string) => `Sıradaki harf: ${taste}. ${finger}`,
    nochNicht: (erwachsen: boolean) =>
      erwachsen ? "Henüz değil - harf birazdan yola çıkıyor." : "Henüz değil! Harf birazdan uçacak.",
    zuFrueh: (erwachsen: boolean) =>
      erwachsen ? "Çok erken - hedef sesini bekle." : "Çok erken! Parlak sesi bekle.",
    gefangen: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Yakalandı. Devam: ${taste}.` : `Yakaladın! Devam: ${taste}.`,
    torStatus: (erwachsen: boolean) =>
      erwachsen ? "Başarıldı - yeni tuşun kilidi açılıyor." : "Yaşasın! Yeni tuşun seni bekliyor.",
    zurueck: (erwachsen: boolean) => (erwachsen ? "Son dinlenme yerine dönüş..." : "Bir kez daha..."),
    wortFertig: (wort: string) => `${wort}. Gönderildi.`,
    bisher: (folge: string) => ` Şu ana kadar: ${folge}.`,
    schonDa: (erwachsen: boolean, taste: string) =>
      erwachsen
        ? `Bu harf zaten yerinde: ${taste}. Sıradaki harfle devam et.`
        : `Bu harf sende zaten var: ${taste}. Şimdi sıradaki harf.`,
    schonDaStand: (folge: string) => ` Yerinde olanlar: ${folge}.`,
    stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
      `Kutup İstasyonu, telsiz mesajı ${schritt}, toplam ${von}. Karışık harfler: ${gemischt}.${bisher}`,
    fischStatus: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Ödül balığı: ${taste}.` : `Bir balık zıpladı - yakala onu: ${taste}!`,
    hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
      `${nomen} ${schritt}, toplam ${von}. ${mitWesen ? "Mağara yaratığını dinle." : "Tuşu dinle."}`,
    sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
      `${nomen} ${schritt}, toplam ${von}. ${getippt > 0 ? `Yazılan: ${getippt}, toplam ${laenge}.` : "Aklından yaz."}`,
    folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
      `${nomen} ${schritt}, toplam ${von}. ${mehrere ? `Dizi: ${naechstes}` : `Sıradaki: ${naechstes}`}`,
  },
  // ★ O-CS (03.10.2026): Kind „ty", höchstens ein „!" je Meldung, Erwachsene keins
  // (Regel 1); nie eine Vergangenheit der 2. Person (Regel 2) - Präsens, „se"-Sätze,
  // Sätze über die Sache („Zpráva odeslána."). Etappen wie im Glossar §2.3 („Ledová pole",
  // „Jeskyně ozvěny" ...), „srdíčka", „bonusové rybky", „zpráva vysílačkou", „jeskynní
  // tvor". Ein Schritt heisst „krok", eine Zeichenfolge „skupina znaků" („řada" ist die
  // Tastenreihe). Zahl + Nomen mit allen vier Formen (§2.11); „3/6" statt „z 6" (Regel 13);
  // nach einem Tasten- oder Zahl-Platzhalter am Satzende kein Punkt (Falle 4).
  cs: {
    signal: (signal: number) =>
      signal >= 3 ? "Výborný příjem!" : signal === 2 ? "Dobrý příjem." : "Přijato - trochu to šumí.",
    umschalt: "Shift",
    tafelVerweht: "Vítr odvál tabuli. Napiš to zpaměti.",
    merkBraille: (folge: string) => `Zapamatuj si: ${folge}`,
    merkAnsage: (erwachsen: boolean, folge: string) =>
      erwachsen ? `Zapamatovat: ${folge}` : `Zapamatuj si: ${folge}!`,
    stationWort: (erwachsen: boolean, gemischt: string) =>
      erwachsen
        ? `Zpráva vysílačkou, přeházená písmena: ${gemischt}. Jaké slovo z nich vznikne? Napiš ho.`
        : `Tahle písmena jsou přeházená: ${gemischt}. Jaké je to slovo? Napiš ho!`,
    beideHerzen: (erwachsen: boolean) =>
      erwachsen
        ? "Obě srdíčka jsou pryč - etapa začíná znovu."
        : "Jejda, obě srdíčka jsou pryč. Etapa začíná znovu - zvládneš to!",
    herzWeg: (erwachsen: boolean, rest: number) =>
      erwachsen
        ? mehrzahl(rest, "cs", {
            one: (z) => `Chyba - zbývá ${z} srdíčko.`,
            few: (z) => `Chyba - zbývají ${z} srdíčka.`,
            many: (z) => `Chyba - zbývá ${z} srdíčka.`,
            other: (z) => `Chyba - zbývá ${z} srdíček.`,
          })
        : `Au, jedno srdíčko je pryč! ${rest === 1 ? "Zbývá ještě jedno - dávej pozor." : ""}`,
    tippUeberspringen: (erwachsen: boolean) =>
      erwachsen
        ? "Když je některý krok těžký: po několika pokusech ho klávesa Enter přeskočí."
        : "Je tenhle krok těžký? Zkus pár kláves - pak ho můžeš přeskočit klávesou Enter!",
    erstSelbst: (erwachsen: boolean) =>
      erwachsen ? "Nejdřív několik pokusů - pak klávesa Enter krok přeskočí." : "Nejdřív to zkus - pak můžeš přeskočit!",
    stationUebersprungen: (erwachsen: boolean) =>
      erwachsen ? "Tento krok se přeskakuje - pokračuje se dál." : "Tenhle krok vynecháme a jdeme dál!",
    oeffnerHoehle: (mitWesen: boolean) =>
      mitWesen
        ? "Jeskyně ozvěny: jeskynní tvor ohlásí každou klávesu. Piš podle sluchu."
        : "Jeskyně ozvěny: každá klávesa zazní jako tón a odečítač obrazovky řekne, která to je. Piš podle sluchu.",
    oeffnerSturm: "Sněhová bouře: zapamatuj si každou skupinu znaků, pak ji vítr odvane. Piš zpaměti.",
    oeffnerStation: (buchstaben: number) => {
      const satz =
        "Polární stanice: písmena jsou přeházená. Poznej slovo a napiš ho ve správném pořadí, bez spěchu; klávesa Tabulátor prozradí jedno písmeno. První zpráva vysílačkou má";
      return mehrzahl(buchstaben, "cs", {
        one: (z) => `${satz} ${z} písmeno.`,
        few: (z) => `${satz} ${z} písmena.`,
        many: (z) => `${satz} ${z} písmena.`,
        other: (z) => `${satz} ${z} písmen.`,
      });
    },
    oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
      `${{ water: "Ledová pole", climb: "Ledová stěna", slide: "Skluzavka domů" }[zone]}: stiskni ${erste}`,
    weiter: (folge: string) => `Dál: ${folge}`,
    fische: (erwachsen: boolean, fisch: number) =>
      erwachsen
        ? mehrzahl(fisch, "cs", {
            one: (z) => ` Chycena ${z} bonusová rybka.`,
            few: (z) => ` Chyceny ${z} bonusové rybky.`,
            many: (z) => ` Chyceno ${z} bonusové rybky.`,
            other: (z) => ` Chyceno ${z} bonusových rybek.`,
          })
        : mehrzahl(fisch, "cs", {
            one: () => " A navíc jedna rybka v síti!",
            few: (z) => ` A navíc ${z} rybky v síti!`,
            many: (z) => ` A navíc ${z} rybky v síti!`,
            other: (z) => ` A navíc ${z} rybek v síti!`,
          }),
    torGeschafft: (erwachsen: boolean) =>
      erwachsen ? "Hotovo - nová klávesa se odemyká." : "Hurá, povedlo se! Nová klávesa už čeká.",
    fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
      erster
        ? erwachsen
          ? `Bonusová rybka: ${taste}`
          : `Rybka vyskakuje! Chyť ji: ${taste}`
        : `${taste}`,
    gesendet: (erwachsen: boolean, signal: string) =>
      erwachsen ? `Odesláno. ${signal}` : `Zpráva odeslána. ${signal}`,
    wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
      erwachsen ? `${wort}. Odesláno. ${signal}` : `${wort}. Zpráva odeslána. ${signal}`,
    naechsterBuchstabe: (taste: string, finger: string) => `Další písmeno: ${taste}. ${finger}`,
    nochNicht: (erwachsen: boolean) =>
      erwachsen ? "Ještě ne - písmeno za chvíli vyletí." : "Ještě ne! Písmeno za chvilku vyletí.",
    zuFrueh: (erwachsen: boolean) =>
      erwachsen ? "Příliš brzy - počkej na cílový tón." : "Moc brzy! Počkej na jasný tón.",
    gefangen: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Chyceno. Dál: ${taste}` : `Chyceno! Dál: ${taste}`,
    torStatus: (erwachsen: boolean) =>
      erwachsen ? "Hotovo - nová klávesa se odemyká." : "Hurá! Nová klávesa už čeká.",
    zurueck: (erwachsen: boolean) => (erwachsen ? "Zpět k poslednímu odpočívadlu..." : "Ještě jednou..."),
    wortFertig: (wort: string) => `${wort}. Odesláno.`,
    bisher: (folge: string) => ` Zatím: ${folge}.`,
    schonDa: (erwachsen: boolean, taste: string) =>
      erwachsen
        ? `Písmeno ${taste} už je na svém místě. Pokračuj dalším písmenem.`
        : `Písmeno ${taste} už máš. Teď další písmeno.`,
    schonDaStand: (folge: string) => ` Už na místě: ${folge}.`,
    stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
      `Polární stanice, zpráva vysílačkou ${schritt}/${von}. Přeházená písmena: ${gemischt}.${bisher}`,
    fischStatus: (erwachsen: boolean, taste: string) =>
      erwachsen ? `Bonusová rybka: ${taste}` : `Rybka vyskakuje - chyť ji: ${taste}!`,
    hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
      `${nomen} ${schritt}/${von} - ${mitWesen ? "Poslouchej jeskynního tvora." : "Poslouchej klávesu."}`,
    sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
      `${nomen} ${schritt}/${von} - ${getippt > 0 ? `Napsáno: ${getippt}/${laenge}` : "Piš zpaměti."}`,
    folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
      `${nomen} ${schritt}/${von} - ${mehrere ? `Skupina znaků: ${naechstes}` : `Další: ${naechstes}`}`,
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      signal: (signal: number) =>
        signal >= 3 ? "Отличен сигнал!" : signal === 2 ? "Добър сигнал." : "Прието - с малко шум.",
      umschalt: "Shift",
      tafelVerweht: "Таблото отлетя с вятъра. Пиши по памет.",
      merkBraille: (folge: string) => `Запомни: ${folge}.`,
      merkAnsage: (erwachsen: boolean, folge: string) =>
        erwachsen ? `Запомни: ${folge}.` : `Запомни: ${folge}!`,
      stationWort: (erwachsen: boolean, gemischt: string) =>
        erwachsen
          ? `Радиосъобщение, разбъркани букви: ${gemischt}. Каква дума образуват? Напиши я.`
          : `Тези букви са разбъркани: ${gemischt}. Коя дума е това? Напиши я!`,
      beideHerzen: (erwachsen: boolean) =>
        erwachsen
          ? "И двете сърчица са изразходвани - зоната започва отначало."
          : "Ох, и двете сърчица ги няма. Зоната започва отначало - ще се справиш!",
      herzWeg: (erwachsen: boolean, rest: number) =>
        erwachsen
          ? `Грешка - ${mehrzahl(rest, "bg", { one: (z) => `остава ${z} сърчице`, other: (z) => `остават ${z} сърчица` })}.`
          : `Ох, едно сърчице по-малко! ${rest === 1 ? "Остава още едно - внимавай." : ""}`,
      tippUeberspringen: (erwachsen: boolean) =>
        erwachsen
          ? "Ако някоя станция е трудна: след няколко опита клавишът Enter я пропуска."
          : "Трудна ли е станцията? Опитай няколко клавиша - после можеш да я пропуснеш с Enter!",
      erstSelbst: (erwachsen: boolean) =>
        erwachsen ? "Първо няколко опита - после Enter пропуска." : "Опитай първо ти - после можеш да пропуснеш!",
      stationUebersprungen: (erwachsen: boolean) =>
        erwachsen ? "Тази станция се пропуска - продължаваме." : "Тази станция я пропускаме, продължаваме нататък!",
      oeffnerHoehle: (mitWesen: boolean) =>
        mitWesen
          ? "Пещерата на ехото: пещерното същество казва всеки клавиш. Пиши по слух."
          : "Пещерата на ехото: всеки клавиш звучи като тон, а екранният четец казва кой е. Пиши по слух.",
      oeffnerSturm: "Снежна буря: запомни всяка поредица, после вятърът я отнася. Пиши по памет.",
      oeffnerStation: (buchstaben: number) =>
        `Полярната станция: буквите са разбъркани. Познай думата и я напиши в правилния ред, без да бързаш - клавишът Tab издава една буква. Първо радиосъобщение: ${mehrzahl(buchstaben, "bg", { one: (z) => `${z} буква`, other: (z) => `${z} букви` })}.`,
      oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
        `${zone === "water" ? "Ледени късове" : zone === "climb" ? "Ледената стена" : "Пързалка към дома"}: натисни ${erste}.`,
      weiter: (folge: string) => `Следва: ${folge}.`,
      fische: (erwachsen: boolean, fisch: number) =>
        erwachsen
          ? ` ${mehrzahl(fisch, "bg", { one: (z) => `${z} бонус рибка е хваната.`, other: (z) => `${z} бонус рибки са хванати.` })}`
          : ` И хвана ${fisch === 1 ? "една рибка" : `${fisch} рибки`}!`,
      torGeschafft: (erwachsen: boolean) =>
        erwachsen ? "Готово - новият клавиш се отключва." : "Ура, успя! Новият ти клавиш те чака.",
      fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
        erster
          ? erwachsen
            ? `Бонус рибка: ${taste}.`
            : `Рибка скача! Хвани я: ${taste}.`
          : `${taste}.`,
      gesendet: (erwachsen: boolean, signal: string) =>
        erwachsen ? `Изпратено. ${signal}` : `Съобщението е изпратено. ${signal}`,
      wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
        erwachsen ? `${wort}. Изпратено. ${signal}` : `${wort}! Съобщението е изпратено. ${signal}`,
      naechsterBuchstabe: (taste: string, finger: string) => `Следващата буква е ${taste}. ${finger}`,
      nochNicht: (erwachsen: boolean) =>
        erwachsen ? "Още не - буквата всеки момент тръгва." : "Още не! Буквата всеки момент ще полети.",
      zuFrueh: (erwachsen: boolean) =>
        erwachsen ? "Твърде рано - изчакай целевия тон." : "Твърде рано! Изчакай светлия тон.",
      gefangen: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Хваната. Следва: ${taste}.` : `Хвана я! Следва: ${taste}.`,
      torStatus: (erwachsen: boolean) =>
        erwachsen ? "Готово - новият клавиш се отключва." : "Ура! Новият ти клавиш те чака.",
      zurueck: (erwachsen: boolean) => (erwachsen ? "Обратно към последната почивка …" : "Още веднъж …"),
      wortFertig: (wort: string) => `${wort}! Изпратено.`,
      bisher: (folge: string) => ` Досега: ${folge}.`,
      schonDa: (erwachsen: boolean, taste: string) =>
        erwachsen
          ? `${taste} вече е на мястото си. Продължи със следващата буква.`
          : `${taste} вече е тук. Нататък със следващата буква.`,
      schonDaStand: (folge: string) => ` Вече на място: ${folge}.`,
      stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
        `Полярната станция, радиосъобщение ${schritt}/${von}. Разбъркани букви: ${gemischt}.${bisher}`,
      fischStatus: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Бонус рибка: ${taste}!` : `Рибка скача - хвани я: ${taste}!`,
      hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
        `${nomen} ${schritt}/${von}. ${mitWesen ? "Слушай пещерното същество." : "Слушай клавиша."}`,
      sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
        `${nomen} ${schritt}/${von}. ${getippt > 0 ? `Написани: ${getippt}/${laenge}.` : "Пиши по памет."}`,
      folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
        `${nomen} ${schritt}/${von}. ${mehrere ? `Поредица: ${naechstes}` : `Следва: ${naechstes}`}`,
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      signal: (signal: number) =>
        signal >= 3 ? "Πεντακάθαρο σήμα!" : signal === 2 ? "Καλό σήμα." : "Ελήφθη - με λίγο θόρυβο.",
      umschalt: "Shift",
      tafelVerweht: "Ο πίνακας χάθηκε στο χιόνι. Γράψε από μνήμης.",
      merkBraille: (folge: string) => `Θυμήσου: ${folge}.`,
      merkAnsage: (erwachsen: boolean, folge: string) =>
        erwachsen ? `Απομνημόνευση: ${folge}.` : `Θυμήσου: ${folge}!`,
      stationWort: (erwachsen: boolean, gemischt: string) =>
        erwachsen
          ? `Μήνυμα από τον ασύρματο, ανακατεμένα γράμματα: ${gemischt}. Ποια λέξη σχηματίζουν; Γράψε τη λέξη.`
          : `Αυτά τα γράμματα είναι ανακατεμένα: ${gemischt}. Ποια λέξη είναι; Γράψε την!`,
      beideHerzen: (erwachsen: boolean) =>
        erwachsen
          ? "Τελείωσαν και οι δύο καρδούλες - η ζώνη ξεκινά από την αρχή."
          : "Ωχ, χάθηκαν και οι δύο καρδούλες! Η ζώνη ξεκινά πάλι από την αρχή - θα τα καταφέρεις!",
      herzWeg: (erwachsen: boolean, rest: number) =>
        erwachsen
          ? `Λάθος πλήκτρο - ${mehrzahl(rest, "el", { one: (z) => `απομένει ${z} καρδούλα`, other: (z) => `απομένουν ${z} καρδούλες` })}.`
          : `Άου, χάθηκε μια καρδούλα! ${rest === 1 ? "Μένει μία ακόμα - πρόσεχε!" : ""}`,
      tippUeberspringen: (erwachsen: boolean) =>
        erwachsen
          ? "Αν ένας σταθμός είναι δύσκολος: μετά από μερικές προσπάθειες, το πλήκτρο Enter τον παραλείπει."
          : "Σου φαίνεται δύσκολος ένας σταθμός; Δοκίμασε μερικά πλήκτρα - μετά μπορείς να τον παραλείψεις με το Enter!",
      erstSelbst: (erwachsen: boolean) =>
        erwachsen
          ? "Πρώτα μερικές προσπάθειες - μετά το Enter παραλείπει τον σταθμό."
          : "Δοκίμασε πρώτα εσύ - μετά μπορείς να τον παραλείψεις!",
      stationUebersprungen: (erwachsen: boolean) =>
        erwachsen
          ? "Αυτός ο σταθμός παραλείπεται - συνεχίζουμε."
          : "Αυτόν τον σταθμό τον αφήνουμε, συνεχίζουμε!",
      oeffnerHoehle: (mitWesen: boolean) =>
        mitWesen
          ? "Σπηλιά της ηχούς: το πλάσμα της σπηλιάς λέει κάθε πλήκτρο. Γράψε με το αυτί."
          : "Σπηλιά της ηχούς: κάθε πλήκτρο ακούγεται ως ήχος, και ο αναγνώστης οθόνης λέει ποιο είναι. Γράψε με το αυτί.",
      oeffnerSturm: "Χιονοθύελλα: θυμήσου κάθε ακολουθία, μετά τη σκεπάζει το χιόνι. Γράψε από μνήμης.",
      oeffnerStation: (buchstaben: number) =>
        `Πολικός σταθμός: τα γράμματα είναι ανακατεμένα. Βρες τη λέξη και γράψε την με τη σωστή σειρά, χωρίς βιασύνη. Το πλήκτρο Tab σού δείχνει ένα γράμμα. Πρώτο μήνυμα από τον ασύρματο: ${mehrzahl(buchstaben, "el", { one: (z) => `${z} γράμμα`, other: (z) => `${z} γράμματα` })}.`,
      oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
        `${zone === "water" ? "Παγοκομμάτια" : zone === "climb" ? "Παγωμένος γκρεμός" : "Τσουλήθρα με την κοιλιά"}: πάτησε ${erste}.`,
      weiter: (folge: string) => `Επόμενο: ${folge}.`,
      fische: (erwachsen: boolean, fisch: number) =>
        erwachsen
          ? ` ${mehrzahl(fisch, "el", { one: (z) => `Πιάστηκε ${z} ψαράκι μπόνους`, other: (z) => `Πιάστηκαν ${z} ψαράκια μπόνους` })}.`
          : ` Και έπιασες ${fisch === 1 ? "ένα ψαράκι" : `${fisch} ψαράκια`}!`,
      torGeschafft: (erwachsen: boolean) =>
        erwachsen ? "Τέλος - το νέο πλήκτρο ξεκλειδώνεται." : "Ζήτω, τα κατάφερες! Το νέο σου πλήκτρο σε περιμένει!",
      fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
        erster
          ? erwachsen
            ? `Ψαράκι μπόνους: ${taste}.`
            : `Ένα ψαράκι πηδά! Πιάσε το: ${taste}.`
          : `${taste}.`,
      gesendet: (erwachsen: boolean, signal: string) =>
        erwachsen ? `Στάλθηκε. ${signal}` : `Το μήνυμα στάλθηκε. ${signal}`,
      wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
        erwachsen ? `${wort}. Στάλθηκε. ${signal}` : `${wort}! Το μήνυμα στάλθηκε. ${signal}`,
      naechsterBuchstabe: (taste: string, finger: string) => `Επόμενο γράμμα: ${taste}. ${finger}`,
      nochNicht: (erwachsen: boolean) =>
        erwachsen ? "Όχι ακόμα - το γράμμα ξεκινά σε λίγο." : "Όχι ακόμα! Σε λίγο το γράμμα πετάει.",
      zuFrueh: (erwachsen: boolean) =>
        erwachsen ? "Πολύ νωρίς - πρώτα ο ήχος-στόχος." : "Πολύ νωρίς! Περίμενε τον ψηλό ήχο.",
      gefangen: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Πιάστηκε. Επόμενο: ${taste}.` : `Το έπιασες! Επόμενο: ${taste}.`,
      torStatus: (erwachsen: boolean) =>
        erwachsen ? "Τέλος - το νέο πλήκτρο ξεκλειδώνεται." : "Ζήτω! Το νέο σου πλήκτρο σε περιμένει!",
      zurueck: (erwachsen: boolean) => (erwachsen ? "Πίσω στο τελευταίο σημείο ξεκούρασης..." : "Άλλη μια φορά..."),
      wortFertig: (wort: string) => `${wort}! Στάλθηκε.`,
      bisher: (folge: string) => ` Μέχρι τώρα: ${folge}.`,
      schonDa: (erwachsen: boolean, taste: string) =>
        erwachsen
          ? `${taste}: είναι ήδη στη θέση του. Συνέχεια με το επόμενο γράμμα.`
          : `${taste}: το έχεις ήδη. Συνέχισε με το επόμενο γράμμα.`,
      schonDaStand: (folge: string) => ` Ήδη στη θέση τους: ${folge}.`,
      stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
        `Πολικός σταθμός, μήνυμα ${schritt} από ${von}. Ανακατεμένα γράμματα: ${gemischt}.${bisher}`,
      fischStatus: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Ψαράκι μπόνους: ${taste}!` : `Ένα ψαράκι πηδά - πιάσε το: ${taste}!`,
      hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
        `${nomen} ${schritt} από ${von}. ${mitWesen ? "Άκου το πλάσμα της σπηλιάς." : "Άκου το πλήκτρο."}`,
      sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
        `${nomen} ${schritt} από ${von}. ${getippt > 0 ? `Έτοιμα ${getippt} από ${laenge} γράμματα.` : "Γράψε από μνήμης."}`,
      folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
        `${nomen} ${schritt} από ${von}. ${mehrere ? `Ακολουθία: ${naechstes}` : `Επόμενο: ${naechstes}`}`,
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      // Kein Schlusspunkt direkt nach ${folge}/${taste}: eine Ziffer davor würde als Ordnungszahl gelesen (Glossar hu §4 Falle 4).
      signal: (signal: number) =>
        signal >= 3 ? "Tiszta vétel!" : signal === 2 ? "Jó vétel." : "Vétel - kis zajjal.",
      umschalt: "Shift",
      tafelVerweht: "A táblát elfújta a szél. Gépeld be emlékezetből.",
      merkBraille: (folge: string) => `Jegyezd meg: ${folge}`,
      merkAnsage: (erwachsen: boolean, folge: string) =>
        erwachsen ? `Megjegyzendő: ${folge}` : `Jegyezd meg: ${folge}!`,
      stationWort: (erwachsen: boolean, gemischt: string) =>
        erwachsen
          ? `Rádióüzenet, összekevert betűk: ${gemischt}. Melyik szót adják ki? Gépeld be.`
          : `Ezek a betűk összekeveredtek: ${gemischt}. Melyik szó ez? Gépeld be!`,
      beideHerzen: (erwachsen: boolean) =>
        erwachsen
          ? "Mindkét szív elfogyott - a szakasz elölről kezdődik."
          : "Jaj, elfogyott mindkét szív! A szakasz újra kezdődik - menni fog.",
      herzWeg: (erwachsen: boolean, rest: number) =>
        erwachsen
          ? `Elütés - még ${rest} szív maradt.`
          : `Hoppá, elment egy szív! ${rest === 1 ? "Már csak egy van - figyelj." : ""}`,
      tippUeberspringen: (erwachsen: boolean) =>
        erwachsen
          ? "Ha egy állomás nehéz: néhány próbálkozás után az Enter billentyű átugorja."
          : "Nehéz egy állomás? Próbálj ki néhány billentyűt - utána az Enter billentyűvel átugorhatod!",
      erstSelbst: (erwachsen: boolean) =>
        erwachsen ? "Előbb néhány próbálkozás - utána az Enter billentyű átugorja." : "Előbb próbáld meg magad - utána átugorhatod!",
      stationUebersprungen: (erwachsen: boolean) =>
        erwachsen ? "Ezt az állomást kihagyjuk - megyünk tovább." : "Ezt az állomást kihagyjuk, megyünk tovább!",
      oeffnerHoehle: (mitWesen: boolean) =>
        mitWesen
          ? "Visszhangbarlang: a barlanglakó bemond minden billentyűt. Gépelj hallás után."
          : "Visszhangbarlang: minden billentyű egy hangként szól, a képernyőolvasó megmondja, melyik. Gépelj hallás után.",
      oeffnerSturm: "Hóvihar: jegyezz meg minden jelcsoportot, aztán elfújja a szél. Gépeld be emlékezetből.",
      oeffnerStation: (buchstaben: number) =>
        `Sarki állomás: a betűk összekeveredtek. Ismerd fel a szót, és gépeld be helyes sorrendben, időnyomás nélkül; a Tab billentyű elárul egy betűt. Az első rádióüzenet ${buchstaben} betűből áll.`,
      oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
        `${zone === "water" ? "Jégtáblák" : zone === "climb" ? "Jégfal" : "Hasoncsúszás"}. Nyomd meg: ${erste}`,
      weiter: (folge: string) => `Következik: ${folge}`,
      fische: (erwachsen: boolean, fisch: number) =>
        erwachsen
          ? ` ${fisch} bónuszhalat fogtál.`
          : ` És fogtál ${fisch === 1 ? "egy halat" : `${fisch} halat`}!`,
      torGeschafft: (erwachsen: boolean) =>
        erwachsen ? "Sikerült - az új billentyű feloldódik." : "Hurrá, sikerült! Vár az új billentyűd.",
      fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
        erster
          ? erwachsen
            ? `Bónuszhal: ${taste}`
            : `Kiugrott egy hal! Kapd el: ${taste}`
          : `${taste}`,
      gesendet: (erwachsen: boolean, signal: string) =>
        erwachsen ? `Elküldve. ${signal}` : `Üzenet elküldve. ${signal}`,
      wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
        erwachsen ? `${wort}. Elküldve. ${signal}` : `${wort}! Üzenet elküldve. ${signal}`,
      naechsterBuchstabe: (taste: string, finger: string) => `A következő betű: ${taste}. ${finger}`,
      nochNicht: (erwachsen: boolean) =>
        erwachsen ? "Még nem - a betű mindjárt elindul." : "Még nem! Mindjárt elrepül a betű.",
      zuFrueh: (erwachsen: boolean) =>
        erwachsen ? "Túl korán - csak a célhangnál." : "Túl korán! Várd meg a magas, tiszta hangot.",
      gefangen: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Elkapva. Következik: ${taste}` : `Elkaptad! Következik: ${taste}`,
      torStatus: (erwachsen: boolean) =>
        erwachsen ? "Sikerült - az új billentyű feloldódik." : "Hurrá! Vár az új billentyűd.",
      zurueck: (erwachsen: boolean) => (erwachsen ? "Vissza az utolsó pihenőhelyre..." : "Még egyszer..."),
      wortFertig: (wort: string) => `${wort}! Elküldve.`,
      bisher: (folge: string) => ` Eddig: ${folge}`,
      schonDa: (erwachsen: boolean, taste: string) =>
        erwachsen
          ? `${taste} már a helyén van. Tovább a következő betűvel.`
          : `${taste} már megvan. Jöhet a következő betű.`,
      schonDaStand: (folge: string) => ` Már megvan: ${folge}`,
      stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
        `Sarki állomás, rádióüzenet: ${schritt}/${von}, összekevert betűk: ${gemischt}.${bisher}`,
      fischStatus: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Bónuszhal: ${taste}!` : `Kiugrott egy hal - kapd el: ${taste}!`,
      hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
        `${nomen}: ${schritt}/${von}, ${mitWesen ? "figyelj a barlanglakóra." : "figyelj a billentyűre."}`,
      sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
        `${nomen}: ${schritt}/${von}, ${getippt > 0 ? `begépelve: ${getippt}/${laenge}` : "gépeld be emlékezetből."}`,
      folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
        `${nomen}: ${schritt}/${von}, ${mehrere ? `jelcsoport: ${naechstes}` : `következik: ${naechstes}`}`,
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      signal: (signal: number) =>
        signal >= 3 ? "Glashelder ontvangen!" : signal === 2 ? "Goede ontvangst." : "Ontvangen - met wat geruis.",
      umschalt: "Shift",
      tafelVerweht: "Het bord is weggewaaid. Typ uit je geheugen.",
      merkBraille: (folge: string) => `Onthoud: ${folge}.`,
      merkAnsage: (erwachsen: boolean, folge: string) =>
        erwachsen ? `Onthouden: ${folge}.` : `Onthoud: ${folge}!`,
      stationWort: (erwachsen: boolean, gemischt: string) =>
        erwachsen
          ? `Radiobericht, letters door elkaar: ${gemischt}. Welk woord vormen ze? Typ het.`
          : `Deze letters staan door elkaar: ${gemischt}. Welk woord is het? Typ het!`,
      beideHerzen: (erwachsen: boolean) =>
        erwachsen
          ? "Beide hartjes op - de zone begint opnieuw."
          : "O nee, beide hartjes weg! De zone begint opnieuw - jij kunt het.",
      herzWeg: (erwachsen: boolean, rest: number) =>
        erwachsen
          ? `Verkeerde toets - nog ${rest} ${rest === 1 ? "hartje" : "hartjes"} over.`
          : `Au, een hartje weg! ${rest === 1 ? "Nog één - let goed op." : ""}`,
      tippUeberspringen: (erwachsen: boolean) =>
        erwachsen
          ? "Is een station moeilijk: na een paar pogingen slaat de Enter-toets het over."
          : "Vind je een station lastig? Probeer een paar toetsen - dan kun je het met Enter overslaan!",
      erstSelbst: (erwachsen: boolean) =>
        erwachsen ? "Eerst een paar pogingen - dan slaat Enter het over." : "Probeer het eerst zelf - dan kun je overslaan!",
      stationUebersprungen: (erwachsen: boolean) =>
        erwachsen ? "Dit station wordt overgeslagen - we gaan verder." : "Dit station slaan we over, we gaan verder!",
      oeffnerHoehle: (mitWesen: boolean) =>
        mitWesen
          ? "De echogrot: het grotwezen noemt elke toets. Typ op gehoor."
          : "De echogrot: elke toets klinkt als een toon, en de schermlezer zegt welke. Typ op gehoor.",
      oeffnerSturm: "De sneeuwstorm: onthoud elke reeks, daarna waait die weg. Typ uit je geheugen.",
      oeffnerStation: (buchstaben: number) =>
        `Het poolstation: de letters liggen door elkaar. Herken het woord en typ het in de goede volgorde, zonder tijdsdruk; de Tab-toets verklapt een letter. Eerste radiobericht met ${buchstaben} letters.`,
      oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
        `${zone === "water" ? "IJsschotsen" : zone === "climb" ? "De ijswand" : "De buikglijbaan"}: druk op ${erste}.`,
      weiter: (folge: string) => `Volgende: ${folge}.`,
      fische: (erwachsen: boolean, fisch: number) =>
        erwachsen
          ? ` ${fisch} ${fisch === 1 ? "bonusvis" : "bonusvissen"} gevangen.`
          : ` En je hebt ${fisch === 1 ? "een vis" : `${fisch} vissen`} gevangen!`,
      torGeschafft: (erwachsen: boolean) =>
        erwachsen ? "Gelukt - de nieuwe toets wordt vrijgespeeld." : "Joepie, gelukt! Je nieuwe toets wacht op je.",
      fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
        erster
          ? erwachsen
            ? `Bonusvis: ${taste}.`
            : `Er springt een vis! Vang hem: ${taste}.`
          : `${taste}.`,
      gesendet: (erwachsen: boolean, signal: string) =>
        erwachsen ? `Verzonden. ${signal}` : `Bericht verzonden. ${signal}`,
      wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
        erwachsen ? `${wort}. Verzonden. ${signal}` : `${wort}! Bericht verzonden. ${signal}`,
      naechsterBuchstabe: (taste: string, finger: string) => `De volgende letter is ${taste}. ${finger}`,
      nochNicht: (erwachsen: boolean) =>
        erwachsen ? "Nog niet - de letter vliegt zo meteen weg." : "Nog niet! Zo meteen vliegt de letter weg.",
      zuFrueh: (erwachsen: boolean) =>
        erwachsen ? "Te vroeg - wacht op de doeltoon." : "Te vroeg! Wacht op de heldere toon.",
      gefangen: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Gevangen. Volgende: ${taste}.` : `Gevangen! Volgende: ${taste}.`,
      torStatus: (erwachsen: boolean) =>
        erwachsen ? "Gelukt - de nieuwe toets wordt vrijgespeeld." : "Joepie! Je nieuwe toets wacht op je.",
      zurueck: (erwachsen: boolean) => (erwachsen ? "Terug naar de laatste rustplaats..." : "Nog een keer..."),
      wortFertig: (wort: string) => `${wort}! Verzonden.`,
      bisher: (folge: string) => ` Tot nu toe: ${folge}.`,
      schonDa: (erwachsen: boolean, taste: string) =>
        erwachsen
          ? `${taste} staat er al. Verder met de volgende letter.`
          : `${taste} heb je al. Verder met de volgende letter.`,
      schonDaStand: (folge: string) => ` Staat er al: ${folge}.`,
      stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
        `Poolstation, radiobericht ${schritt} van ${von}. Letters door elkaar: ${gemischt}.${bisher}`,
      fischStatus: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Bonusvis: ${taste}!` : `Er springt een vis - vang hem: ${taste}!`,
      hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
        `${nomen} ${schritt} van ${von}. ${mitWesen ? "Luister naar het grotwezen." : "Luister naar de toets."}`,
      sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
        `${nomen} ${schritt} van ${von}. ${getippt > 0 ? `${getippt} van ${laenge} getypt.` : "Typ uit je geheugen."}`,
      folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
        `${nomen} ${schritt} van ${von}. ${mehrere ? `Reeks: ${naechstes}` : `Volgende: ${naechstes}`}`,
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      signal: (signal: number) =>
        signal >= 3 ? "Receção perfeita!" : signal === 2 ? "Boa receção." : "Recebido - com algum ruído.",
      umschalt: "Shift",
      tafelVerweht: "O vento levou o quadro. Escreve de memória.",
      merkBraille: (folge: string) => `Memoriza: ${folge}.`,
      merkAnsage: (erwachsen: boolean, folge: string) =>
        erwachsen ? `Memoriza: ${folge}.` : `Memoriza: ${folge}!`,
      stationWort: (erwachsen: boolean, gemischt: string) =>
        erwachsen
          ? `Mensagem de rádio, letras baralhadas: ${gemischt}. Que palavra formam? Escreve-a.`
          : `Estas letras estão baralhadas: ${gemischt}. Que palavra é? Escreve-a!`,
      beideHerzen: (erwachsen: boolean) =>
        erwachsen
          ? "Os dois corações acabaram - a zona recomeça do início."
          : "Oh não, foram-se os dois corações! A zona começa outra vez do início - tu consegues!",
      herzWeg: (erwachsen: boolean, rest: number) =>
        erwachsen
          ? `Tecla errada - ${rest === 1 ? `resta ${rest} coração` : `restam ${rest} corações`}.`
          : `Ai, foi-se um coração! ${rest === 1 ? "Só resta um - atenção!" : ""}`,
      tippUeberspringen: (erwachsen: boolean) =>
        erwachsen
          ? "Se uma estação for difícil: depois de algumas tentativas, a tecla Enter salta-a."
          : "Uma estação está difícil? Experimenta algumas teclas - depois podes saltá-la com a tecla Enter!",
      erstSelbst: (erwachsen: boolean) =>
        erwachsen ? "Primeiro algumas tentativas - depois a tecla Enter salta." : "Experimenta primeiro - depois podes saltar!",
      stationUebersprungen: (erwachsen: boolean) =>
        erwachsen ? "Esta estação é saltada - segue-se em frente." : "Esta estação fica para trás, vamos continuar!",
      oeffnerHoehle: (mitWesen: boolean) =>
        mitWesen
          ? "Gruta do Eco: a criatura da gruta diz cada tecla. Escreve de ouvido."
          : "Gruta do Eco: cada tecla soa como um som, e o leitor de ecrã diz qual é. Escreve de ouvido.",
      oeffnerSturm: "Tempestade de Neve: memoriza cada sequência, depois o vento leva-a. Escreve de memória.",
      oeffnerStation: (buchstaben: number) =>
        `Estação Polar: as letras estão baralhadas. Descobre a palavra e escreve-a pela ordem certa, sem pressa; a tecla de tabulação revela uma letra. Primeira mensagem de rádio com ${buchstaben} letras.`,
      oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
        `${zone === "water" ? "Banquisa" : zone === "climb" ? "Parede de Gelo" : "Escorrega"}: prime ${erste}.`,
      weiter: (folge: string) => `Seguinte: ${folge}.`,
      fische: (erwachsen: boolean, fisch: number) =>
        erwachsen
          ? ` ${fisch} ${fisch === 1 ? "peixe bónus apanhado" : "peixes bónus apanhados"}.`
          : ` E apanhaste ${fisch === 1 ? "um peixe" : `${fisch} peixes`}!`,
      torGeschafft: (erwachsen: boolean) =>
        erwachsen ? "Concluído - a tecla nova vai ser desbloqueada." : "Boa, conseguiste! A tua tecla nova está à espera!",
      fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
        erster
          ? erwachsen
            ? `Peixe bónus: ${taste}.`
            : `Salta um peixe! Apanha-o: ${taste}.`
          : `${taste}.`,
      gesendet: (erwachsen: boolean, signal: string) =>
        erwachsen ? `Enviado. ${signal}` : `Mensagem enviada. ${signal}`,
      wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
        erwachsen ? `${wort}. Enviado. ${signal}` : `${wort}! Mensagem enviada. ${signal}`,
      naechsterBuchstabe: (taste: string, finger: string) => `A letra seguinte é ${taste}. ${finger}`,
      nochNicht: (erwachsen: boolean) =>
        erwachsen ? "Ainda não - a letra está quase a partir." : "Ainda não! A letra já vai voar.",
      zuFrueh: (erwachsen: boolean) =>
        erwachsen ? "Cedo demais - só com o som do alvo." : "Cedo demais! Espera pelo som claro.",
      gefangen: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Apanhada. Seguinte: ${taste}.` : `Apanhaste-a! Seguinte: ${taste}.`,
      torStatus: (erwachsen: boolean) =>
        erwachsen ? "Concluído - a tecla nova vai ser desbloqueada." : "Boa! A tua tecla nova está à espera!",
      zurueck: (erwachsen: boolean) => (erwachsen ? "De volta ao último ponto de descanso ..." : "Outra vez ..."),
      wortFertig: (wort: string) => `${wort}! Enviado.`,
      bisher: (folge: string) => ` Até agora: ${folge}.`,
      schonDa: (erwachsen: boolean, taste: string) =>
        erwachsen
          ? `${taste} já está no lugar. Continua com a letra seguinte.`
          : `Já tens ${taste}. Segue para a letra seguinte.`,
      schonDaStand: (folge: string) => ` Já no lugar: ${folge}.`,
      stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
        `Estação Polar, mensagem de rádio ${schritt} de ${von}. Letras baralhadas: ${gemischt}.${bisher}`,
      fischStatus: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Peixe bónus: ${taste}!` : `Salta um peixe - apanha-o: ${taste}!`,
      hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
        `${nomen} ${schritt} de ${von}. ${mitWesen ? "Ouve a criatura da gruta." : "Ouve a tecla."}`,
      sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
        `${nomen} ${schritt} de ${von}. ${getippt > 0 ? `Escritas: ${getippt} de ${laenge}.` : "Escreve de memória."}`,
      folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
        `${nomen} ${schritt} de ${von}. ${mehrere ? `Sequência: ${naechstes}` : `Seguinte: ${naechstes}`}`,
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      signal: (signal: number) =>
        signal >= 3 ? "Sinal perfeito!" : signal === 2 ? "Sinal bom." : "Recebido - com um pouco de chiado.",
      umschalt: "Shift",
      tafelVerweht: "O quadro foi levado pelo vento. Digite de memória.",
      merkBraille: (folge: string) => `Memorize: ${folge}.`,
      merkAnsage: (erwachsen: boolean, folge: string) =>
        erwachsen ? `Memorizar: ${folge}.` : `Memorize: ${folge}!`,
      stationWort: (erwachsen: boolean, gemischt: string) =>
        erwachsen
          ? `Mensagem de rádio, letras embaralhadas: ${gemischt}. Que palavra elas formam? Digite a palavra.`
          : `Estas letras estão embaralhadas: ${gemischt}. Que palavra é essa? Digite!`,
      beideHerzen: (erwachsen: boolean) =>
        erwachsen
          ? "Os dois corações acabaram - a zona recomeça do início."
          : "Ah, não, os dois corações acabaram! A zona começa de novo - você consegue!",
      herzWeg: (erwachsen: boolean, rest: number) =>
        erwachsen
          ? `Erro - ${rest === 1 ? "resta 1 coração" : `restam ${rest} corações`}.`
          : `Ai, um coração a menos! ${rest === 1 ? "Ainda resta um - cuidado!" : ""}`,
      tippUeberspringen: (erwachsen: boolean) =>
        erwachsen
          ? "Se uma estação for difícil: depois de algumas tentativas, a tecla Enter pula a estação."
          : "Uma estação está difícil? Tente algumas teclas - depois você pode pular com Enter!",
      erstSelbst: (erwachsen: boolean) =>
        erwachsen ? "Primeiro algumas tentativas - depois o Enter pula." : "Tente primeiro - depois você pode pular!",
      stationUebersprungen: (erwachsen: boolean) =>
        erwachsen ? "Esta estação vai ser pulada - vamos em frente." : "Vamos pular esta e seguir em frente!",
      oeffnerHoehle: (mitWesen: boolean) =>
        mitWesen
          ? "Caverna do eco: a criatura da caverna anuncia cada tecla. Digite de ouvido."
          : "Caverna do eco: cada tecla toca um som, e o leitor de tela diz qual é. Digite de ouvido.",
      oeffnerSturm: "Nevasca: memorize cada sequência, depois ela some com o vento. Digite de memória.",
      oeffnerStation: (buchstaben: number) =>
        `Estação polar: as letras estão embaralhadas. Descubra a palavra e digite na ordem certa, sem pressa; a tecla Tab revela uma letra. Primeira mensagem de rádio com ${buchstaben} letras.`,
      oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
        `${zone === "water" ? "Placas de gelo" : zone === "climb" ? "O paredão de gelo" : "Escorregando para casa"}: pressione ${erste}.`,
      weiter: (folge: string) => `A seguir: ${folge}.`,
      fische: (erwachsen: boolean, fisch: number) =>
        erwachsen
          ? ` ${fisch === 1 ? "1 peixe bônus pescado" : `${fisch} peixes bônus pescados`}.`
          : ` E você pescou ${fisch === 1 ? "um peixe" : `${fisch} peixes`}!`,
      torGeschafft: (erwachsen: boolean) =>
        erwachsen ? "Feito - a tecla nova está sendo desbloqueada." : "Oba, você conseguiu! A sua tecla nova está esperando!",
      fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
        erster
          ? erwachsen
            ? `Peixe bônus: ${taste}.`
            : `Um peixe pulou! Pegue: ${taste}.`
          : `${taste}.`,
      gesendet: (erwachsen: boolean, signal: string) =>
        erwachsen ? `Enviado. ${signal}` : `Mensagem enviada. ${signal}`,
      wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
        erwachsen ? `${wort}. Enviado. ${signal}` : `${wort}! Mensagem enviada. ${signal}`,
      naechsterBuchstabe: (taste: string, finger: string) => `A próxima letra é ${taste}. ${finger}`,
      nochNicht: (erwachsen: boolean) =>
        erwachsen ? "Ainda não - a letra já vai sair voando." : "Ainda não! A letra já vai sair voando.",
      zuFrueh: (erwachsen: boolean) =>
        erwachsen ? "Cedo demais - espere o som de alvo." : "Cedo demais! Espere o som claro.",
      gefangen: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Pegou. A seguir: ${taste}.` : `Pegou! A seguir: ${taste}.`,
      torStatus: (erwachsen: boolean) =>
        erwachsen ? "Feito - a tecla nova está sendo desbloqueada." : "Oba! A sua tecla nova está esperando!",
      zurueck: (erwachsen: boolean) => (erwachsen ? "De volta ao último ponto de descanso …" : "Mais uma vez …"),
      wortFertig: (wort: string) => `${wort}! Mensagem enviada.`,
      bisher: (folge: string) => ` Até agora: ${folge}.`,
      schonDa: (erwachsen: boolean, taste: string) =>
        erwachsen
          ? `${taste} já está no lugar. Continue com a próxima letra.`
          : `Você já tem ${taste}. Vamos para a próxima letra.`,
      schonDaStand: (folge: string) => ` Já no lugar: ${folge}.`,
      stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
        `Estação polar, mensagem de rádio ${schritt} de ${von}. Letras embaralhadas: ${gemischt}.${bisher}`,
      fischStatus: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Peixe bônus: ${taste}!` : `Um peixe pulou - pegue: ${taste}!`,
      hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
        `${nomen} ${schritt} de ${von}. ${mitWesen ? "Escute a criatura da caverna." : "Escute a tecla."}`,
      sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
        `${nomen} ${schritt} de ${von}. ${getippt > 0 ? `${getippt} de ${laenge} digitadas.` : "Digite de memória."}`,
      folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
        `${nomen} ${schritt} de ${von}. ${mehrere ? `Sequência: ${naechstes}` : `A seguir: ${naechstes}`}`,
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      signal: (signal: number) =>
        signal >= 3 ? "Recepție clară!" : signal === 2 ? "Recepție bună." : "Recepționat - cu puțin fâșâit.",
      umschalt: "Shift",
      tafelVerweht: "Vântul a spulberat tabla. Scrie din memorie.",
      merkBraille: (folge: string) => `Ține minte: ${folge}.`,
      merkAnsage: (erwachsen: boolean, folge: string) =>
        erwachsen ? `De reținut: ${folge}.` : `Ține minte: ${folge}!`,
      stationWort: (erwachsen: boolean, gemischt: string) =>
        erwachsen
          ? `Mesaj radio, litere amestecate: ${gemischt}. Ce cuvânt formează? Scrie-l.`
          : `Literele astea sunt amestecate: ${gemischt}. Ce cuvânt este? Scrie-l!`,
      beideHerzen: (erwachsen: boolean) =>
        erwachsen
          ? "Ambele inimioare s-au dus - zona începe de la capăt."
          : "Vai, ambele inimioare s-au dus. Zona începe din nou - poți reuși!",
      herzWeg: (erwachsen: boolean, rest: number) =>
        erwachsen
          ? `Greșeală - ${rest === 1 ? "mai ai o inimioară" : rest === 2 ? "mai ai două inimioare" : `mai ai ${rest} inimioare`}.`
          : `Au, o inimioară mai puțin! ${rest === 1 ? "Mai e una - atenție." : ""}`,
      // PUNKT 7: indiciul despre tasta Enter vine doar o dată pe vizita unei zone.
      tippUeberspringen: (erwachsen: boolean) =>
        erwachsen
          ? "Dacă o stație e grea: după câteva încercări, tasta Enter o sare."
          : "O stație e grea? Încearcă câteva taste - apoi o poți sări cu tasta Enter!",
      // 02.10.2026: Enter sare abia după o încercare adevărată - fără inimioară pierdută, fără notă.
      erstSelbst: (erwachsen: boolean) =>
        erwachsen
          ? "Mai întâi câteva încercări - apoi tasta Enter sare stația."
          : "Încearcă mai întâi tu - apoi poți sări!",
      // PUNKT 8: niciodată un reproș - „sărim”, nu „nu ai reușit”.
      stationUebersprungen: (erwachsen: boolean) =>
        erwachsen
          ? "Această stație se sare - mergem mai departe."
          : "Pe asta o sărim, mergem mai departe!",
      oeffnerHoehle: (mitWesen: boolean) =>
        mitWesen
          ? "Peștera ecoului: făptura peșterii spune fiecare tastă. Scrie după auz."
          : "Peștera ecoului: fiecare tastă sună ca un ton, iar cititorul de ecran spune care este. Scrie după auz.",
      oeffnerSturm: "Viscolul: ține minte fiecare grup de caractere, apoi vântul îl spulberă. Scrie din memorie.",
      oeffnerStation: (buchstaben: number) =>
        `Stația polară: literele sunt amestecate. Găsește cuvântul și scrie-l în ordinea corectă, fără grabă; tasta Tab îți dezvăluie o literă. Primul mesaj radio are ${mehrzahl(buchstaben, "ro", {
          one: () => "o literă",
          few: (z) => `${z} litere`,
          other: (z) => `${z} de litere`,
        })}.`,
      oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
        `${zone === "water" ? "Sloiuri de gheață" : zone === "climb" ? "Peretele de gheață" : "Pe burtă spre casă"}: apasă ${erste}.`,
      weiter: (folge: string) => `Urmează: ${folge}.`,
      fische: (erwachsen: boolean, fisch: number) =>
        erwachsen
          ? ` Ai prins ${mehrzahl(fisch, "ro", {
              one: () => "un pește bonus",
              few: (z) => `${z} pești bonus`,
              other: (z) => `${z} de pești bonus`,
            })}.`
          : ` Și ai prins ${mehrzahl(fisch, "ro", {
              one: () => "un pește",
              few: (z) => `${z} pești`,
              other: (z) => `${z} de pești`,
            })}!`,
      torGeschafft: (erwachsen: boolean) =>
        erwachsen ? "Gata - tasta nouă se deblochează." : "Ura, ai reușit - tasta nouă te așteaptă!",
      fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
        erster
          ? erwachsen
            ? `Pește bonus: ${taste}.`
            : `Sare un pește! Prinde-l: ${taste}.`
          : `${taste}.`,
      gesendet: (erwachsen: boolean, signal: string) =>
        erwachsen ? `Trimis. ${signal}` : `Mesaj trimis. ${signal}`,
      wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
        erwachsen ? `${wort}. Trimis. ${signal}` : `${wort}! Mesaj trimis. ${signal}`,
      naechsterBuchstabe: (taste: string, finger: string) => `Următoarea literă este ${taste}. ${finger}`,
      nochNicht: (erwachsen: boolean) =>
        erwachsen ? "Încă nu - litera pornește imediat." : "Încă nu! Litera zboară imediat.",
      zuFrueh: (erwachsen: boolean) =>
        erwachsen ? "Prea devreme - abia la tonul-țintă." : "Prea devreme! Așteaptă sunetul clar.",
      gefangen: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Ai prins-o. Urmează: ${taste}.` : `Ai prins-o! Urmează: ${taste}.`,
      torStatus: (erwachsen: boolean) =>
        erwachsen ? "Gata - tasta nouă se deblochează." : "Ura, tasta nouă te așteaptă!",
      zurueck: (erwachsen: boolean) => (erwachsen ? "Înapoi la ultimul popas …" : "Încă o dată …"),
      wortFertig: (wort: string) => `${wort}! Trimis.`,
      bisher: (folge: string) => ` Până acum: ${folge}.`,
      // 02.10.2026: o literă deja la locul ei NU e o greșeală - doar un indiciu prietenos, fără inimioară.
      schonDa: (erwachsen: boolean, taste: string) =>
        erwachsen
          ? `Litera ${taste} este deja la locul ei. Continuă cu litera următoare.`
          : `Litera ${taste} e deja acolo. Mai departe cu litera următoare.`,
      schonDaStand: (folge: string) => ` Deja la locul lor: ${folge}.`,
      // Propozițiile nu se termină cu „număr.” (citit ca număr ordinal) - de aceea „ - ” după „din ${von}”.
      stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
        `Stația polară, mesajul radio ${schritt} din ${von} - litere amestecate: ${gemischt}.${bisher}`,
      fischStatus: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Pește bonus: ${taste}.` : `Sare un pește - prinde-l: ${taste}!`,
      hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
        `${nomen} ${schritt} din ${von} - ${mitWesen ? "ascultă făptura peșterii." : "ascultă tasta."}`,
      sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
        `${nomen} ${schritt} din ${von} - ${
          getippt > 0
            ? `ai scris ${getippt} din ${mehrzahl(laenge, "ro", {
                one: () => "un caracter",
                few: (z) => `${z} caractere`,
                other: (z) => `${z} de caractere`,
              })}.`
            : "scrie din memorie."
        }`,
      folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
        `${nomen} ${schritt} din ${von} - ${mehrere ? `secvența: ${naechstes}` : `urmează: ${naechstes}`}`,
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      signal: (signal: number) =>
        signal >= 3 ? "Kristallklart!" : signal === 2 ? "Bra mottagning." : "Mottaget - med lite brus.",
      umschalt: "Skift",
      tafelVerweht: "Tavlan har blåst bort. Skriv ur minnet.",
      merkBraille: (folge: string) => `Kom ihåg: ${folge}.`,
      merkAnsage: (erwachsen: boolean, folge: string) =>
        erwachsen ? `Lägg på minnet: ${folge}.` : `Kom ihåg: ${folge}!`,
      stationWort: (erwachsen: boolean, gemischt: string) =>
        erwachsen
          ? `Radiomeddelande, bokstäverna i oordning: ${gemischt}. Vilket ord blir det? Skriv det.`
          : `De här bokstäverna har blandats ihop: ${gemischt}. Vilket ord är det? Skriv det!`,
      beideHerzen: (erwachsen: boolean) =>
        erwachsen
          ? "Båda hjärtana är slut - zonen börjar om från början."
          : "Åh nej, båda hjärtana är borta! Zonen börjar om från början - du klarar det.",
      herzWeg: (erwachsen: boolean, rest: number) =>
        erwachsen
          ? `Fel - ${mehrzahl(rest, "sv", { one: (z) => `${z} hjärta`, other: (z) => `${z} hjärtan` })} kvar.`
          : `Aj, ett hjärta borta! ${rest === 1 ? "Ett kvar - var försiktig nu." : ""}`,
      tippUeberspringen: (erwachsen: boolean) =>
        erwachsen
          ? "Om en station är svår: efter några försök hoppar Retur över den."
          : "Är en station knepig? Prova några tangenter - sedan kan du hoppa över den med Retur!",
      erstSelbst: (erwachsen: boolean) =>
        erwachsen ? "Först några försök - sedan hoppar Retur över." : "Prova själv först - sedan kan du hoppa över!",
      stationUebersprungen: (erwachsen: boolean) =>
        erwachsen ? "Den här stationen hoppas över - det går vidare." : "Den här stationen hoppar vi över, nu går vi vidare!",
      oeffnerHoehle: (mitWesen: boolean) =>
        mitWesen
          ? "Ekogrottan: grottvarelsen säger varje tangent. Skriv efter gehör."
          : "Ekogrottan: varje tangent låter som en ton, och skärmläsaren säger vilken. Skriv efter gehör.",
      oeffnerSturm: "Snöstormen: kom ihåg varje följd, sedan blåser den bort. Skriv ur minnet.",
      oeffnerStation: (buchstaben: number) =>
        `Polarstationen: bokstäverna ligger i oordning. Lista ut ordet och skriv det i rätt ordning, utan tidspress; Tabb avslöjar en bokstav. Första radiomeddelandet har ${mehrzahl(buchstaben, "sv", { one: (z) => `${z} bokstav`, other: (z) => `${z} bokstäver` })}.`,
      oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
        `${zone === "water" ? "Isflaken" : zone === "climb" ? "Isväggen" : "Magåkning hem"}: tryck på ${erste}.`,
      weiter: (folge: string) => `Nästa: ${folge}.`,
      fische: (erwachsen: boolean, fisch: number) =>
        erwachsen
          ? mehrzahl(fisch, "sv", { one: (z) => ` ${z} bonusfisk fångad.`, other: (z) => ` ${z} bonusfiskar fångade.` })
          : ` Och du fångade ${fisch === 1 ? "en fisk" : `${fisch} fiskar`}!`,
      torGeschafft: (erwachsen: boolean) =>
        erwachsen ? "Klart - den nya tangenten låses upp." : "Hurra, du klarade det! Din nya tangent väntar.",
      fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
        erster
          ? erwachsen
            ? `Bonusfisk: ${taste}.`
            : `En fisk hoppar! Fånga den: ${taste}.`
          : `${taste}.`,
      gesendet: (erwachsen: boolean, signal: string) =>
        erwachsen ? `Skickat. ${signal}` : `Meddelandet är skickat. ${signal}`,
      wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
        erwachsen ? `${wort}. Skickat. ${signal}` : `${wort}! Meddelandet är skickat. ${signal}`,
      naechsterBuchstabe: (taste: string, finger: string) => `Nästa bokstav är ${taste}. ${finger}`,
      nochNicht: (erwachsen: boolean) =>
        erwachsen ? "Inte än - bokstaven flyger snart iväg." : "Inte än! Snart flyger bokstaven iväg.",
      zuFrueh: (erwachsen: boolean) =>
        erwachsen ? "För tidigt - vänta på måltonen." : "För tidigt! Vänta på den ljusa tonen.",
      gefangen: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Fångad. Nästa: ${taste}.` : `Fångad! Nästa: ${taste}.`,
      torStatus: (erwachsen: boolean) =>
        erwachsen ? "Klart - den nya tangenten låses upp." : "Hurra! Din nya tangent väntar.",
      zurueck: (erwachsen: boolean) => (erwachsen ? "Tillbaka till den senaste rastplatsen..." : "En gång till..."),
      wortFertig: (wort: string) => `${wort}! Skickat.`,
      bisher: (folge: string) => ` Hittills: ${folge}.`,
      schonDa: (erwachsen: boolean, taste: string) =>
        erwachsen
          ? `${taste} är redan på plats. Fortsätt med nästa bokstav.`
          : `${taste} har du redan. Vidare till nästa bokstav.`,
      schonDaStand: (folge: string) => ` Redan på plats: ${folge}.`,
      stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
        `Polarstationen, radiomeddelande ${schritt} av ${von}. Bokstäver i oordning: ${gemischt}.${bisher}`,
      fischStatus: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Bonusfisk: ${taste}.` : `En fisk hoppar - fånga den: ${taste}!`,
      hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
        `${nomen} ${schritt} av ${von}. ${mitWesen ? "Lyssna på grottvarelsen." : "Lyssna efter tangenten."}`,
      sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
        `${nomen} ${schritt} av ${von}. ${getippt > 0 ? `${getippt} av ${laenge} skrivna.` : "Skriv ur minnet."}`,
      folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
        `${nomen} ${schritt} av ${von}. ${mehrere ? `Följd: ${naechstes}` : `Nästa: ${naechstes}`}`,
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      signal: (signal: number) =>
        signal >= 3 ? "Чіткий сигнал!" : signal === 2 ? "Добрий сигнал." : "Прийнято - з невеликим шумом.",
      umschalt: "Shift",
      tafelVerweht: "Табличку замело. Друкуй з пам'яті.",
      merkBraille: (folge: string) => `Запам'ятай: ${folge}.`,
      merkAnsage: (erwachsen: boolean, folge: string) =>
        erwachsen ? `Запам'ятай: ${folge}.` : `Запам'ятай: ${folge}!`,
      stationWort: (erwachsen: boolean, gemischt: string) =>
        erwachsen
          ? `Радіоповідомлення, літери переплутані: ${gemischt}. Яке слово з них виходить? Надрукуй його.`
          : `Ці літери переплутані: ${gemischt}. Яке це слово? Надрукуй його!`,
      beideHerzen: (erwachsen: boolean) =>
        erwachsen
          ? "Обидва сердечка використано - зона починається спочатку."
          : "Ой, обидва сердечка зникли! Зона починається знову - у тебе все вийде!",
      herzWeg: (erwachsen: boolean, rest: number) =>
        erwachsen
          ? `Помилка - ${mehrzahl(rest, "uk", {
              one: (z) => `залишилося ${z} сердечко`,
              few: (z) => `залишилося ${z} сердечка`,
              many: (z) => `залишилося ${z} сердечок`,
              other: (z) => `залишилося ${z} сердечка`,
            })}.`
          : `Ой, одне сердечко зникло! ${rest === 1 ? "Залишилося ще одне - уважно!" : ""}`,
      tippUeberspringen: (erwachsen: boolean) =>
        erwachsen
          ? "Якщо станція складна: після кількох спроб клавіша Enter її пропускає."
          : "Станція складна? Спробуй кілька клавіш - тоді зможеш пропустити її клавішею Enter!",
      erstSelbst: (erwachsen: boolean) =>
        erwachsen ? "Спочатку кілька спроб - тоді Enter пропускає." : "Спершу спробуй - тоді можна пропустити!",
      stationUebersprungen: (erwachsen: boolean) =>
        erwachsen ? "Цю станцію пропущено - рухаємося далі." : "Цю станцію пропустимо, йдемо далі!",
      oeffnerHoehle: (mitWesen: boolean) =>
        mitWesen
          ? "Печера відлуння: печерна істота називає кожну клавішу. Друкуй на слух."
          : "Печера відлуння: кожна клавіша звучить як тон, а читач екрана каже, яка саме. Друкуй на слух.",
      oeffnerSturm: "Хуртовина: запам'ятай кожну послідовність, потім її замете. Друкуй з пам'яті.",
      oeffnerStation: (buchstaben: number) =>
        `Полярна станція: літери переплутані. Впізнай слово й надрукуй його в правильному порядку, без поспіху; клавіша Tab підкаже одну літеру. Перше радіоповідомлення: ${mehrzahl(buchstaben, "uk", {
          one: (z) => `${z} літера`,
          few: (z) => `${z} літери`,
          many: (z) => `${z} літер`,
          other: (z) => `${z} літери`,
        })}.`,
      oeffnerSonst: (zone: "water" | "climb" | "slide", erste: string) =>
        `${zone === "water" ? "Крижини" : zone === "climb" ? "Крижана стіна" : "Додому на животику"}: натисни ${erste}.`,
      weiter: (folge: string) => `Далі: ${folge}.`,
      fische: (erwachsen: boolean, fisch: number) =>
        erwachsen
          ? ` Спіймано ${mehrzahl(fisch, "uk", {
              one: (z) => `${z} бонусну рибку`,
              few: (z) => `${z} бонусні рибки`,
              many: (z) => `${z} бонусних рибок`,
              other: (z) => `${z} бонусної рибки`,
            })}.`
          : ` І ще спіймано ${mehrzahl(fisch, "uk", {
              one: (z) => `${z} рибку`,
              few: (z) => `${z} рибки`,
              many: (z) => `${z} рибок`,
              other: (z) => `${z} рибки`,
            })}!`,
      torGeschafft: (erwachsen: boolean) =>
        erwachsen ? "Готово - нова клавіша відкривається." : "Ура, вийшло! Твоя нова клавіша чекає!",
      fischSpringt: (erwachsen: boolean, erster: boolean, taste: string) =>
        erster
          ? erwachsen
            ? `Бонусна рибка: ${taste}.`
            : `Рибка стрибає! Лови її: ${taste}.`
          : `${taste}.`,
      gesendet: (erwachsen: boolean, signal: string) =>
        erwachsen ? `Надіслано. ${signal}` : `Повідомлення надіслано. ${signal}`,
      wortGesendet: (erwachsen: boolean, wort: string, signal: string) =>
        erwachsen ? `${wort}. Надіслано. ${signal}` : `${wort}! Повідомлення надіслано. ${signal}`,
      naechsterBuchstabe: (taste: string, finger: string) => `Наступна літера: ${taste}. ${finger}`,
      nochNicht: (erwachsen: boolean) =>
        erwachsen ? "Ще ні - літера зараз вилетить." : "Ще ні! Зараз літера полетить.",
      zuFrueh: (erwachsen: boolean) =>
        erwachsen ? "Зарано - чекай на цільовий звук." : "Зарано! Чекай на дзвінкий звук.",
      gefangen: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Спіймано. Далі: ${taste}.` : `Спіймано! Далі: ${taste}.`,
      torStatus: (erwachsen: boolean) =>
        erwachsen ? "Готово - нова клавіша відкривається." : "Ура! Твоя нова клавіша чекає!",
      zurueck: (erwachsen: boolean) => (erwachsen ? "Назад до останнього привалу..." : "Ще раз..."),
      wortFertig: (wort: string) => `${wort}! Надіслано.`,
      bisher: (folge: string) => ` Уже є: ${folge}.`,
      schonDa: (erwachsen: boolean, taste: string) =>
        erwachsen
          ? `Літера ${taste} уже на місці. Далі наступна літера.`
          : `Літера ${taste} у тебе вже є. Далі наступна літера.`,
      schonDaStand: (folge: string) => ` Уже на місці: ${folge}.`,
      stationStatus: (schritt: number, von: number, gemischt: string, bisher: string) =>
        `Полярна станція, радіоповідомлення ${schritt}/${von}. Переплутані літери: ${gemischt}.${bisher}`,
      fischStatus: (erwachsen: boolean, taste: string) =>
        erwachsen ? `Бонусна рибка: ${taste}!` : `Рибка стрибає - лови її: ${taste}!`,
      hoehleStatus: (nomen: string, schritt: number, von: number, mitWesen: boolean) =>
        `${nomen} ${schritt}/${von}. ${mitWesen ? "Слухай печерну істоту." : "Слухай клавішу."}`,
      sturmStatus: (nomen: string, schritt: number, von: number, getippt: number, laenge: number) =>
        `${nomen} ${schritt}/${von}. ${getippt > 0 ? `Надруковано: ${getippt}/${laenge}.` : "Друкуй з пам'яті."}`,
      folgeStatus: (nomen: string, schritt: number, von: number, mehrere: boolean, naechstes: string) =>
        `${nomen} ${schritt}/${von}. ${mehrere ? `Послідовність: ${naechstes}` : `Далі: ${naechstes}`}`,
    },
});

/**
 * Der Finger-Hinweis englisch (EN3) - die kurze Fassung von `fingerGuide` für
 * die Polarstation, in der nur Kleinbuchstaben verraten werden: „F: left
 * index finger, in the home position." Glossar §3.5.
 */
function fingerHinweisEn(ch: string, lernweg?: Lernweg): string {
  // ★ G2b-1: Gross-/Klein in der Sprache des Weges (ohne Weg Englisch = `toLowerCase()`).
  const sp: Lang = lernweg ?? "en";
  const name = spokenLabel(ch, "en");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  // ★ F3-tr: die Heimtaste der eingestellten Tastatur, wenn sie eigene trägt (türkisch F: u i e a | k m l y).
  const heimtaste = heimtasteDerTastatur(f) ?? f.homeKey;
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, sp);
  const wo = kleinFuer(ch, sp) === heimtaste ? ", in the home position" : heim ? `, home key ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, sp) : name}: ${fingerName(f, "en")}${wo}.`;
}

/**
 * ★ E11a-5 (26.09.2026): derselbe kurze Finger-Hinweis FRANZÖSISCH - « F : index gauche,
 * en position de départ. » bzw. « E : majeur gauche, depuis la touche D. ». Eine
 * französische Fassung von `fingerGuide` gibt es (noch) nicht; die Bausteine schon:
 * `spokenLabel(…, "fr")` und `fingerName(…, "fr")` (E10a/E12, `fingers.ts`). Die
 * Ausgangstaste kommt aus `homeKeyFor` mit dem Lernweg - auf AZERTY liegt der linke
 * kleine Finger auf Q, der rechte auf M (Glossar §9.2: « position de départ »).
 */
function fingerHinweisFr(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "fr");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", en position de départ" : heim ? `, depuis la touche ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name} : ${fingerName(f, "fr")}${wo}.`;
}

/**
 * ★ ES-O (27.09.2026): derselbe kurze Finger-Hinweis SPANISCH - « F: índice
 * izquierdo, en la posición inicial. » bzw. « E: medio izquierdo, desde la
 * tecla D. ». Bausteine aus `fingers.ts` (ES-F8).
 */
function fingerHinweisEs(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "es");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", en la posición inicial" : heim ? `, desde la tecla ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${fingerName(f, "es")}${wo}.`;
}

/**
 * ★ O-IT (02.10.2026): derselbe kurze Finger-Hinweis ITALIENISCH - « F: indice
 * sinistro, in posizione base. » bzw. « E: medio sinistro, dal tasto D. ».
 */
function fingerHinweisIt(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "it");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", in posizione base" : heim ? `, dal tasto ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${fingerName(f, "it")}${wo}.`;
}

/**
 * ★ O-PL (02.10.2026): derselbe kurze Finger-Hinweis POLNISCH - „F: lewy
 * wskazujący, w pozycji podstawowej." bzw. „E: lewy środkowy, od klawisza D."
 * (Glossar §2.1 „pozycja podstawowa"; Finger im Nominativ nach dem Doppelpunkt).
 */
function fingerHinweisPl(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "pl");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", w pozycji podstawowej" : heim ? `, od klawisza ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${fingerName(f, "pl")}${wo}.`;
}

/**
 * ★ O-TR (02.10.2026): derselbe kurze Finger-Hinweis TÜRKISCH - "F: sol işaret
 * parmağı, temel konumda." bzw. "E: sol orta parmak, D tuşundan başlayarak."
 * (Glossar §2.1 "temel konum"; die Endung hängt an "tuş", nie am Zeichen - Regel 6).
 */
function fingerHinweisTr(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "tr");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", temel konumda" : heim ? `, ${heim} tuşundan başlayarak` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${fingerName(f, "tr")}${wo}.`;
}

/**
 * ★ O-CS (03.10.2026): derselbe kurze Finger-Hinweis TSCHECHISCH - „F: levý
 * ukazováček, v základním postavení." bzw. „E: levý prostředníček, od klávesy D."
 * (Glossar §2.1 „základní postavení"; die Taste mit Kopfwort „klávesa", Regel 11).
 */
function fingerHinweisCs(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "cs");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", v základním postavení" : heim ? `, od klávesy ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${fingerName(f, "cs")}${wo}.`;
}

// ★ O2-COMP (30.10.2026): bg eigene Fassung.
/** Die neun Fingernamen bulgarisch - wörtlich aus `FINGER_BG` (freischaltungBg.ts). */
const FINGER_HINWEIS_NAMEN_BG: Record<FingerId, string> = {
  "kleiner-links": "ляво кутре",
  "ring-links": "ляв безименен пръст",
  "mittel-links": "ляв среден пръст",
  "zeige-links": "ляв показалец",
  daumen: "палец",
  "zeige-rechts": "десен показалец",
  "mittel-rechts": "десен среден пръст",
  "ring-rechts": "десен безименен пръст",
  "kleiner-rechts": "дясно кутре",
};

/**
 * ★ O-BG: derselbe kurze Finger-Hinweis BULGARISCH - „Т: десен показалец, в изходна позиция."
 * bzw. „У: ляв среден пръст, от клавиша В." (Glossar §2.1 „изходна позиция"; Taste mit Kopfwort
 * „клавиш", Regel 11).
 */
function fingerHinweisBg(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "bg");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", в изходна позиция" : heim ? `, от клавиша ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${FINGER_HINWEIS_NAMEN_BG[f.id]}${wo}.`;
}

// ★ O2-COMP (30.10.2026): el eigene Fassung.
/** ★ O2-COMP el: die neun Fingernamen, wörtlich aus `freischaltungEl.ts` (FINGER_EL). */
const FINGER_HINWEIS_NAMEN_EL: Record<FingerId, string> = {
  "kleiner-links": "αριστερό μικρό δάχτυλο",
  "ring-links": "αριστερός παράμεσος",
  "mittel-links": "αριστερός μέσος",
  "zeige-links": "αριστερός δείκτης",
  daumen: "αντίχειρας",
  "zeige-rechts": "δεξιός δείκτης",
  "mittel-rechts": "δεξιός μέσος",
  "ring-rechts": "δεξιός παράμεσος",
  "kleiner-rechts": "δεξί μικρό δάχτυλο",
};

/**
 * ★ O2-COMP el: derselbe kurze Finger-Hinweis GRIECHISCH - „Φ: αριστερός δείκτης, στη
 * βασική θέση." bzw. „Ε: αριστερός μέσος, από το πλήκτρο Δ." (Glossar §2.1 „βασική θέση";
 * die Taste mit Kopfwort „πλήκτρο", Regel 11).
 */
function fingerHinweisEl(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "el");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", στη βασική θέση" : heim ? `, από το πλήκτρο ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${FINGER_HINWEIS_NAMEN_EL[f.id]}${wo}.`;
}

// ★ O2-COMP (30.10.2026): hu eigene Fassung.
/** ★ O-HU: die neun Fingernamen wörtlich aus `freischaltungHu.ts` (FINGER_HU). */
const FINGER_HINWEIS_NAMEN_HU: Record<FingerId, string> = {
  "kleiner-links": "bal kisujj",
  "ring-links": "bal gyűrűsujj",
  "mittel-links": "bal középső ujj",
  "zeige-links": "bal mutatóujj",
  daumen: "hüvelykujj",
  "zeige-rechts": "jobb mutatóujj",
  "mittel-rechts": "jobb középső ujj",
  "ring-rechts": "jobb gyűrűsujj",
  "kleiner-rechts": "jobb kisujj",
};

/**
 * ★ O-HU: derselbe kurze Finger-Hinweis UNGARISCH - „F: bal mutatóujj, alapállásban." bzw.
 * „E: bal középső ujj, kiinduló billentyű: D." (Glossar hu §2.1 „alapállás"). Die Heimtaste nach
 * Doppelpunkt, weil Artikel a/az und Endung von der Aussprache abhängen (Regel 11/12). Ohne Finger
 * kein Schlusspunkt nach dem Namen - eine Ziffer würde sonst als Ordnungszahl gelesen (§4 Falle 4).
 */
function fingerHinweisHu(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "hu");
  const f = fingerForChar(ch, lernweg);
  if (!f) return name;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", alapállásban" : heim ? `, kiinduló billentyű: ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${FINGER_HINWEIS_NAMEN_HU[f.id]}${wo}.`;
}

// ★ O2-COMP (30.10.2026): nl eigene Fassung.
/** ★ O-NL: die neun Fingernamen wörtlich aus `freischaltungNl.ts` (`VINGERS_NL`). */
const FINGER_HINWEIS_NAMEN_NL: Record<FingerId, string> = {
  "kleiner-links": "linkerpink",
  "ring-links": "linkerringvinger",
  "mittel-links": "linkermiddelvinger",
  "zeige-links": "linkerwijsvinger",
  daumen: "duim",
  "zeige-rechts": "rechterwijsvinger",
  "mittel-rechts": "rechtermiddelvinger",
  "ring-rechts": "rechterringvinger",
  "kleiner-rechts": "rechterpink",
};

/**
 * ★ O-NL: derselbe kurze Finger-Hinweis NIEDERLÄNDISCH - „F: linkerwijsvinger, in de
 * basishouding." bzw. „E: linkermiddelvinger, vanaf de toets D." (Glossar §2.1
 * „basishouding"; die Taste mit Kopfwort „de toets", Regel 12).
 */
function fingerHinweisNl(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "nl");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", in de basishouding" : heim ? `, vanaf de toets ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${FINGER_HINWEIS_NAMEN_NL[f.id]}${wo}.`;
}

// ★ O2-COMP (30.10.2026): pt eigene Fassung.
/** ★ O2-COMP pt (29.10.2026): die neun Fingernamen wörtlich aus `FINGER_PT` (freischaltungPt.ts). */
const FINGER_HINWEIS_NAMEN_PT: Record<FingerId, string> = {
  "kleiner-links": "mindinho esquerdo",
  "ring-links": "anelar esquerdo",
  "mittel-links": "médio esquerdo",
  "zeige-links": "indicador esquerdo",
  daumen: "polegar",
  "zeige-rechts": "indicador direito",
  "mittel-rechts": "médio direito",
  "ring-rechts": "anelar direito",
  "kleiner-rechts": "mindinho direito",
};

/**
 * ★ O2-COMP pt (29.10.2026): derselbe kurze Finger-Hinweis PORTUGIESISCH - „F: indicador
 * esquerdo, na posição inicial." bzw. „E: médio esquerdo, a partir da tecla D."
 * (Glossar pt §2.1 „posição inicial"; die Taste mit Kopfwort „tecla", Regel 11).
 */
function fingerHinweisPt(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "pt");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", na posição inicial" : heim ? `, a partir da tecla ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${FINGER_HINWEIS_NAMEN_PT[f.id]}${wo}.`;
}

// ★ O2-COMP (30.10.2026): br eigene Fassung.
const FINGER_HINWEIS_NAMEN_BR: Record<FingerId, string> = {
  "kleiner-links": "mínimo esquerdo",
  "ring-links": "anelar esquerdo",
  "mittel-links": "médio esquerdo",
  "zeige-links": "indicador esquerdo",
  daumen: "polegar",
  "zeige-rechts": "indicador direito",
  "mittel-rechts": "médio direito",
  "ring-rechts": "anelar direito",
  "kleiner-rechts": "mínimo direito",
};

/**
 * ★ O-BR: derselbe kurze Finger-Hinweis BRASILIANISCH - „F: indicador esquerdo,
 * na posição inicial." bzw. „E: médio esquerdo, a partir da tecla D."
 * (Glossar pt-BR §2.1 „posição inicial"; die Taste mit Kopfwort „a tecla", Regel 11).
 */
function fingerHinweisBr(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "br");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", na posição inicial" : heim ? `, a partir da tecla ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${FINGER_HINWEIS_NAMEN_BR[f.id]}${wo}.`;
}

// ★ O2-COMP (30.10.2026): ro eigene Fassung.
/**
 * ★ O-RO (29.10.2026): cele nouă degete românește, copiate cuvânt cu cuvânt din
 * `FINGER_RO` (freischaltungRo.ts, Glosar §2.1) - toate cuvintele sunt gramatical
 * masculine/neutre și nu spun nimic despre copil.
 */
const FINGER_HINWEIS_NAMEN_RO: Record<FingerId, string> = {
  "kleiner-links": "degetul mic stâng",
  "ring-links": "inelarul stâng",
  "mittel-links": "mijlociul stâng",
  "zeige-links": "arătătorul stâng",
  daumen: "degetul mare",
  "zeige-rechts": "arătătorul drept",
  "mittel-rechts": "mijlociul drept",
  "ring-rechts": "inelarul drept",
  "kleiner-rechts": "degetul mic drept",
};

/**
 * ★ O-RO (29.10.2026): același indiciu scurt pentru deget în ROMÂNĂ - „F: arătătorul
 * stâng, în poziția de bază.” sau „E: mijlociul stâng, de la tasta D.” (Glosar §2.1
 * „poziția de bază”; tasta cu cuvântul „tasta” înainte, Regula 11).
 */
function fingerHinweisRo(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "ro");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", în poziția de bază" : heim ? `, de la tasta ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${FINGER_HINWEIS_NAMEN_RO[f.id]}${wo}.`;
}

// ★ O2-COMP (30.10.2026): sv eigene Fassung.
/**
 * ★ O2-COMP sv: derselbe kurze Finger-Hinweis SCHWEDISCH - „F: vänster
 * pekfinger, i grundställning." bzw. „E: vänster långfinger, från tangenten D."
 * (Glossar §2.1 „grundställning"; die Taste mit Kopfwort „tangenten", Regel 13).
 * Fingernamen wörtlich aus `FINGER_SV` in `freischaltungSv.ts`.
 */
const FINGER_HINWEIS_NAMEN_SV: Record<FingerId, string> = {
  "kleiner-links": "vänster lillfinger",
  "ring-links": "vänster ringfinger",
  "mittel-links": "vänster långfinger",
  "zeige-links": "vänster pekfinger",
  daumen: "tumme",
  "zeige-rechts": "höger pekfinger",
  "mittel-rechts": "höger långfinger",
  "ring-rechts": "höger ringfinger",
  "kleiner-rechts": "höger lillfinger",
};

function fingerHinweisSv(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "sv");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", i grundställning" : heim ? `, från tangenten ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${FINGER_HINWEIS_NAMEN_SV[f.id]}${wo}.`;
}

// ★ O2-COMP (30.10.2026): uk eigene Fassung.
const FINGER_HINWEIS_NAMEN_UK: Record<FingerId, string> = {
  "kleiner-links": "лівий мізинець",
  "ring-links": "лівий безіменний палець",
  "mittel-links": "лівий середній палець",
  "zeige-links": "лівий вказівний палець",
  daumen: "великий палець",
  "zeige-rechts": "правий вказівний палець",
  "mittel-rechts": "правий середній палець",
  "ring-rechts": "правий безіменний палець",
  "kleiner-rechts": "правий мізинець",
};

/**
 * ★ O-UK: derselbe kurze Finger-Hinweis UKRAINISCH - „А: лівий вказівний палець, в основному
 * положенні." bzw. „У: лівий середній палець, від клавіші В." (Glossar uk §2.1 „основне
 * положення"; die Taste mit Kopfwort „клавіша", Regel 11).
 */
function fingerHinweisUk(ch: string, lernweg: Lernweg): string {
  const name = spokenLabel(ch, "uk");
  const f = fingerForChar(ch, lernweg);
  if (!f) return `${name}.`;
  const heimtaste = homeKeyFor(f, lernweg);
  const heim = heimtaste === " " ? "" : grossFuer(heimtaste, lernweg);
  const wo = kleinFuer(ch, lernweg) === heimtaste ? ", в основному положенні" : heim ? `, від клавіші ${heim}` : "";
  return `${name.length === 1 ? grossFuer(name, lernweg) : name}: ${FINGER_HINWEIS_NAMEN_UK[f.id]}${wo}.`;
}

/**
 * ★ E11a-5: der Finger-Hinweis der Polarstation je Bedienungssprache - EINE Tabelle statt
 * der früheren Weiche `sprache === "en" ? fingerHinweisEn(…) : fingerGuide(…)`, die „fr"
 * still auf den deutschen Satz hätte fallen lassen (Leitfaden Falle 30).
 */
const FINGER_HINWEIS: Record<BedienSprache, (ch: string, lernweg: Lernweg) => string> = {
  de: (ch, lernweg) => fingerGuide(ch, false, lernweg),
  en: (ch, lernweg) => fingerHinweisEn(ch, lernweg),
  fr: fingerHinweisFr,
  es: fingerHinweisEs,
  it: fingerHinweisIt,
  pl: fingerHinweisPl, // ★ O-PL (02.10.2026)
  tr: fingerHinweisTr, // ★ O-TR (02.10.2026)
  cs: fingerHinweisCs, // ★ O-CS (03.10.2026)
  bg: fingerHinweisBg, // ★ O2-COMP (30.10.2026)
  el: fingerHinweisEl, // ★ O2-COMP (30.10.2026)
  hu: fingerHinweisHu, // ★ O2-COMP (30.10.2026)
  nl: fingerHinweisNl, // ★ O2-COMP (30.10.2026)
  pt: fingerHinweisPt, // ★ O2-COMP (30.10.2026)
  br: fingerHinweisBr, // ★ O2-COMP (30.10.2026)
  ro: fingerHinweisRo, // ★ O2-COMP (30.10.2026)
  sv: fingerHinweisSv, // ★ O2-COMP (30.10.2026)
  uk: fingerHinweisUk, // ★ O2-COMP (30.10.2026)
};

interface ZoneCfg {
  layout: (spots: readonly FloeSpot[]) => PackeisLayout;
  /** Sample-Atmosphäre (null = eigene Live-Synthese, s. cave). */
  ambience: AmbienceKind | null;
  prime: () => void;
  groundY: number;
  /** Countdown-Klang: Eisknacken (water), Steinchen bei Zögern (climb), Höhlen-Puls (cave). */
  tension: "ice" | "rock" | "pulse" | null;
  hopSound: () => void;
  failSound: () => void;
  /** Pose beim Weiterziehen (Sprung/Rutsch/Watscheln) und im Ruhezustand auf einer Station. */
  movePose: PenguinPose;
  standPose: PenguinPose;
  /** So weit fällt/sackt der Pinguin beim Scheitern (Wasser sinkt, Rutsche kullert). */
  failDropY: number;
}

/**
 * Die zonen-spezifischen Bausteine (Bauplan §4.1/§4.2/§4.3/§4.6). Wasser = exakt E2.
 * climb: Bergwind + Steinchen-Warnung, Absturz statt Sinken, Watschel-Ruhepose.
 * slide: Bergwind, Rutsch-Wusch, Bauchlage durchgehend, kullert beim Scheitern.
 * cave: Höhlen-Atmo (Live-Synth), Puls als Countdown, Watscheln, Schreck beim Scheitern.
 */
const ZONE: Record<PlayZone, ZoneCfg> = {
  water: { layout: packeisLayout, ambience: "packeis", prime: primePackeisAudio, groundY: PACKEIS_GROUND_Y, tension: "ice", hopSound: playHop, failSound: playSink, movePose: "jump", standPose: "idle", failDropY: 130 },
  climb: { layout: steilwandLayout, ambience: "steilwand", prime: primeSteilwandAudio, groundY: STEIL_GROUND_Y, tension: "rock", hopSound: playHop, failSound: playFall, movePose: "jump", standPose: "idle", failDropY: 0 },
  slide: { layout: slideLayout, ambience: "slide", prime: primeSlideAudio, groundY: SLIDE_GROUND_Y, tension: null, hopSound: playSlideWush, failSound: playSlideThud, movePose: "slide", standPose: "slide", failDropY: 34 },
  cave: { layout: caveLayout, ambience: null, prime: primeCaveAudio, groundY: CAVE_GROUND_Y, tension: "pulse", hopSound: playHop, failSound: playCaveScare, movePose: "walk", standPose: "idle", failDropY: 0 },
  // storm: eigene Atmo (Sample+Böen), KEIN Countdown (tension=null → nie Scheitern:
  // „niemand hängt fest", §4.4); die Merkfolge wird gezeigt+angesagt, dann verweht.
  storm: { layout: stormLayout, ambience: null, prime: primeStormAudio, groundY: STORM_GROUND_Y, tension: null, hopSound: playHop, failSound: playHop, movePose: "walk", standPose: "idle", failDropY: 0 },
  // station: warme Abend-Atmo (Live-Synth), KEIN Countdown/Scheitern (Verschnaufzone,
  // §4.5). hopSound = Funkwellen-„Nachricht gesendet"; failSound ungenutzt (kein Scheitern).
  station: { layout: stationLayout, ambience: null, prime: primeStationAudio, groundY: STATION_GROUND_Y, tension: null, hopSound: playRadioSent, failSound: playHop, movePose: "walk", standPose: "idle", failDropY: 0 },
};

function zoneOfCourse(spots: readonly FloeSpot[]): PlayZone {
  const stage = spots.find((s) => s.kind === "station")?.stage;
  return stage === "climb" || stage === "slide" || stage === "cave" || stage === "storm" || stage === "station"
    ? stage
    : "water";
}

export interface UseExpeditionOpts {
  open: boolean;
  course: FloeCourse;
  free: boolean;
  isAdult: boolean;
  voiceEnabled: boolean;
  noTimePressure: boolean;
  letters: Record<string, LetterStat> | undefined;
  mastery: Mastery;
  /**
   * Reise-Modus (E7, Bauplan §4.7): Erstbesuch einer Zone → geschützter Probe-Schritt.
   * Die ERSTE Station (Ufer → Station 1) läuft dann ohne Zeitdruck und kann nicht
   * scheitern — ein sanfter erster Zug, nachdem das Tagebuch die Zone erklärt hat.
   */
  protectFirst?: boolean;
  /**
   * Zonen-Intro beim Spielstart ansagen? Standard `true` (Einzelzone/Tor/freies Einzelspiel).
   * Im Reise-Modus `false`: dort hat das Tagebuch die Zone bereits erklärt (§4.7) — beim Start
   * kommt dann nur noch das konkrete erste Ziel, keine zweite volle Erklärung.
   */
  announceIntro?: boolean;
  onWin: () => void;
  /**
   * Zone geschafft. `clean` = die Zone musste nie von vorn begonnen werden (beide Herzen nie
   * zugleich weg) — daraus baut der Journey die Polarlicht-Bedingung. `flawless` = kein
   * einziger Fehler (Fehlgriff oder Zeit) — nur damit lobt die Ansage „fehlerfrei".
   */
  onFinished?: (result: { clean: boolean; flawless: boolean; fish: number }) => void;
  /**
   * ★ EN3 (19.09.2026): die Bedienungssprache - in ihr erzählt das Spiel.
   * Ohne Angabe Deutsch.
   * ★ E2a (25.09.2026): `AktiveBedienSprache` - kommt aus `useBedienSprache()`
   * und ist damit nie „fr" (siehe `sprache.ts`).
   * ★ E11a-5 (26.09.2026): `BedienSprache` - das Spiel erzählt auch französisch
   * (`SPIEL_TEXTE.fr`, `zoneText(…, "fr")`), sobald die Oberfläche „fr" liefert.
   */
  sprache?: BedienSprache;
  /**
   * ★ EN3: Gilt die Bedienungssprache hier (Tastenflow)? Nur dann bekommt die
   * Stimme die Sprache mit (`speakQueued(text, sprache)`) - sonst genau der
   * Aufruf von vorher.
   */
  bereichAktiv?: boolean;
  /**
   * ★ E6c (24.09.2026, Bauplan §6.3): der Lernweg des Kindes - unabhängig von
   * der Bedienungssprache (die kann später umgeschaltet werden, der Weg nie,
   * D2). Weg „en" hat kein deutsches Höhlenwesen (Ton statt Stimme) und lässt
   * das gelöste Funkspruch-Wort englisch statt deutsch vorlesen. Ohne Angabe
   * „de" (Alt-Verhalten unverändert).
   */
  lernweg?: Lernweg;
}

export interface PenguinView {
  x: number;
  y: number;
  pose: PenguinPose;
}

export interface ExpeditionView {
  ready: boolean;
  zone: PlayZone;
  pos: number;
  targetIdx: number;
  /** Wie viele Zeichen der Ziel-Folge schon getippt sind (0..Folgenlänge). */
  seqPos: number;
  /**
   * Schneesturm (§4.4): die Merkfolge, SOLANGE sie auf der Tafel steht — sobald sie
   * verweht, wird das `null` (und der Text verlässt das DOM, auch für Screenreader).
   */
  showSeq: string | null;
  /** Schneesturm: Länge der aktuellen Merkfolge (Anzahl Eingabekästen). */
  seqLen: number;
  /** Schneesturm: die schon RICHTIG getippten Zeichen (füllen die Eingabekästen). */
  typedSeq: string;
  /** Polarstation (§4.5): das aktuelle Wort (Anzeige-Schreibung) — hinter dem Anagramm. */
  stationWord: string;
  /** Polarstation: die Buchstaben des Wortes DURCHEINANDER (Scrabble-Kacheln). */
  scrambled: string[];
  /** Polarstation: Empfangsstärke 0–3 (3 = fehlerfrei gelöst … 1 = viele Fehlgriffe). */
  signal: number;
  /** Polarstation: Wort gelöst → bleibt kurz stehen + wird vorgelesen (Tasten gesperrt). */
  solved: boolean;
  /** Polarstation: zählt hoch je gelöstem Wort (löst die Funkwellen-Animation aus). */
  sentPulse: number;
  /** Polarstation: zählt hoch je Fehlgriff (die Tafel wackelt). */
  wobble: number;
  penguin: PenguinView;
  camTarget: number;
  worldW: number;
  spots: ReturnType<typeof courseSpots>;
  pts: { x: number; y: number }[];
  sunk: boolean;
  sinkOffset: number;
  /** Steilwand: Zeit wird knapp → Steinchen/Risse am Tritt (Bauplan §4.2). */
  cracking: boolean;
  timed: boolean;
  timerPct: number;
  fish: { glyph: string; x: number; y: number } | null;
  rings: number | null;
  won: boolean;
  /** Per-Zone immer false — das Polarlicht zündet erst am Journey-Ende (E7, §4.6). */
  aurora: boolean;
  /** Rückenwind-Meter 0..1 (Gleichmäßigkeit der letzten Anschläge, §4.8). */
  tailwind: number;
  /** Verbleibende Herzen dieser Zone (0…{@link ZONE_LIVES}); bei 0 beginnt die Zone von vorn. */
  lives: number;
  /** Wie viele Herzen eine Zone hat (für die Anzeige leerer Herzen). */
  livesMax: number;
  /** Bauchrutsche: der EINE heranfliegende Buchstabe (nie mehrere) — sonst `null`. */
  slideLetter: string | null;
  /** Bauchrutsche: Anflug 0 = eben losgeflogen … 1 = an der Ziellinie (darüber: vorbei). */
  slideProgress: number;
  /** Bauchrutsche: Das Trefferfenster steht offen — JETZT drücken (Zielton erklingt dazu). */
  slideHot: boolean;
  statusText: string;
  handleKey: (e: React.KeyboardEvent) => void;
  restart: () => void;
  brailleRef: React.RefObject<HTMLDivElement>;
  statusRef: React.RefObject<HTMLDivElement>;
  /** Bauchrutsche: die (nicht vorgelesene) Braille-Spur mit dem wandernden Buchstaben. */
  trackRef: React.RefObject<HTMLDivElement>;
}

/** Größter gemeinsamer Teiler (für die Schrittweite des Sturm-Folgen-Generators). */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Satzanfang gross („k hast du schon" -> „K hast du schon"); nie, wenn die Grossschreibung das Zeichen vervielfacht („ß"). */
function grossAnfang(satz: string, sprache: BedienSprache): string {
  const [erst, ...rest] = [...satz];
  if (!erst) return satz;
  const gross = erst.toLocaleUpperCase(sprache);
  return [...gross].length === 1 ? gross + rest.join("") : satz;
}

/** Wie oft kommt das Zeichen `c` in `text` vor (beides schon klein gemacht). */
function zaehlt(text: string, c: string): number {
  let n = 0;
  for (const x of text) if (x === c) n += 1;
  return n;
}

/**
 * Sprechbarer Name eines Ziels („Umschalttaste", „Komma", „K").
 * ★ EN3: mit der Bedienungssprache („Shift", „comma") - ohne Angabe Deutsch.
 */
function spoken(unit: string | null, sprache: BedienSprache = "de"): string {
  if (unit === SHIFT_UNIT) return SPIEL_TEXTE[sprache].umschalt;
  return spokenLabel(unit ?? "", sprache);
}

/**
 * ★ E6c (24.09.2026, Bauplan §6.3): OB und WIE das Höhlenwesen einen
 * Buchstaben ansagt - ausgelagert aus `announceCaveKey`, damit der Wächter
 * (`tests/tastenflow-lernweg-lektionen.test.ts`) die Entscheidung ohne den
 * ganzen Spiel-Hook prüfen kann. Weg „de" bleibt unverändert deutsch (EN3) -
 * unabhängig von der Bedienungssprache, weil die Zeichen dort deutsch sind
 * (z. B. „ö"). Weg „en" hat KEIN deutsches Höhlenwesen: kein Aufnahme-Vorrat,
 * keine unbesprochene neue englische Monster-Stimme - Vorgabe Johannes
 * (Bauplan §6.3): „weglassen, Ton statt Stimme". Die Live-Region (`text`)
 * trägt in JEDEM Fall den Namen des Zeichens - das Blindschreiben verliert
 * nie etwas, auch ohne Stimme.
 */
export function caveAnnouncement(
  unit: string,
  lernweg: Lernweg,
): { text: string; tone: boolean } {
  // ★ E2a (25.09.2026, Gerüst französischer Lehrgang): „fr" wie „en" (Ton
  // statt Stimme, kein deutsches Höhlenwesen) - TODO FR: E10/E12 für eine
  // echte französische Fassung. Vorher stand hier `lernweg === "en"` - das
  // hätte „fr" still auf die deutsche Höhle fallen lassen.
  //
  // ★ E11a-5 (26.09.2026): Der Ton bleibt für „fr" wie für „en" (es gibt keine
  // französischen Aufnahmen des Höhlenwesens) - aber der NAME in der Live-Region
  // steht jetzt in der Sprache des Weges: „virgule" statt „comma" für ein Kind
  // auf Weg „fr". Weg „en" liefert unverändert `spoken(unit, "en")`.
  //
  // ★ 28.09.2026: Die Frage „gibt es das Wesen?" steht an EINER Stelle
  // (`hoehleHatWesen`, texts.ts) - dieselbe, nach der sich alle Höhlen-Texte richten.
  if (hoehleHatWesen(lernweg)) return { text: `${spoken(unit)}.`, tone: false };
  return { text: `${spoken(unit, lernweg)}.`, tone: true };
}

/**
 * ★ E6c: in welcher Sprache das GELÖSTE Funkspruch-Wort der Polarstation
 * vorgelesen wird - es ist Inhalt DES LERNWEGS (`WORDS` bzw. `WORDS_EN`), nicht
 * der Bedienungssprache. Vorher stand hier fest „de" (EN3 kannte nur die
 * deutsche Wortliste); auf Weg „en" ist das Wort selbst englisch und braucht
 * die englische Stimme (Bauplan §6.3, „folgt der Übungssprache").
 */
export function stationWordLang(lernweg: Lernweg): Lang {
  // ★ E2a: „fr" wie „en" - der Wortvorrat kam bis E10 aus `WORDS_EN`.
  // ★★★ ES-M2 (27.09.2026, Fund des Text-Prüfers): seit E10b-2/ES-S haben
  // „fr" und „es" EIGENE Wörter - die englische Stimme las „pingüino" und
  // « château ». Die Sprache steht jetzt am Vorrat selbst
  // (`rateWortSprache`, expedition/words.ts), nicht an einer zweiten Stelle.
  return rateWortSprache(lernweg);
}

/** Zeichen einer Stations-Folge (Wasser: 1 Zeichen; Steilwand/Rutsche: 2–4). */
function unitSeq(unit: string | null): string[] {
  if (!unit) return [];
  return unit === SHIFT_UNIT ? [SHIFT_UNIT] : [...unit];
}

/** Ansage einer Folge: einzelne Zeichen (Wasser) knapp, mehrere als Aufzählung. */
function spokenSeq(seq: string[], sprache: BedienSprache = "de"): string {
  return seq.map((u) => spoken(u, sprache)).join(", ");
}


export function useExpedition(opts: UseExpeditionOpts): ExpeditionView {
  const {
    open,
    course,
    free,
    isAdult,
    voiceEnabled,
    noTimePressure,
    letters,
    mastery,
    protectFirst = false,
    announceIntro = true,
    onWin,
    onFinished,
    sprache = "de",
    bereichAktiv = false,
    lernweg = "de",
  } = opts;
  /** Die Sätze in der Bedienungssprache (EN3). */
  const S = SPIEL_TEXTE[sprache];

  const spots = useMemo(() => courseSpots(course), [course]);
  const zone = useMemo(() => zoneOfCourse(spots), [spots]);
  /*
    ★★ 28.09.2026 (Johannes: „Sprache des Weges"): Die Funkstation prüft die
    Lösungen im Lexikon des WEGES (`stationSolutions` unten) - bis dahin
    prüfte sie auf JEDEM Weg gegen das deutsche Lexikon, auch auf „es" und
    „fr", obwohl die Wörter der Station schon aus dem Lexikon des Weges kamen
    (`expedition/words.ts`). Ein spanisches Kind, das ein anderes echtes
    spanisches Wort aus denselben Buchstaben fand, bekam „falsch". Das Paket
    des Weges ist auf der Übungsseite schon geladen; hier nur zur Sicherheit,
    und die Lösungen werden neu gerechnet, sobald es da ist (`paketStand`).
  */
  const paketStand = useSprachpaketStand();
  useEffect(() => {
    if (open) void ladeSprachpakete([lernweg]).catch(() => {});
  }, [open, lernweg]);
  const cfg = ZONE[zone];
  // ★ 28.09.2026: mit dem Weg - die Höhle nennt das Wesen nur auf Weg „de".
  const T = useMemo(() => zoneText(zone, sprache, lernweg), [zone, sprache, lernweg]);
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  const { pts, worldW } = useMemo(() => cfg.layout(spots), [cfg, spots]);
  const units = useMemo(() => courseUnits(course), [course]);
  const hasStations = useMemo(() => spots.some((s) => s.kind === "station"), [spots]);

  const [pos, setPos] = useState(0);
  const [seqPos, setSeqPos] = useState(0);
  const [fail, setFail] = useState(false);
  const [gliding, setGliding] = useState(false);
  const [won, setWon] = useState(false);
  const [pose, setPose] = useState<PenguinPose>("idle");
  const [polster, setPolster] = useState(POLSTER_START);
  const [remaining, setRemaining] = useState(0);
  const [run, setRun] = useState(0);
  const [fishJump, setFishJump] = useState<{ unit: string; spot: number } | null>(null);
  const [fishLeft, setFishLeft] = useState(0);
  const [rings, setRings] = useState<number | null>(null);
  // Schneesturm (§4.4): die Folge, solange sie auf der Tafel steht; null = verweht.
  const [showSeq, setShowSeq] = useState<string | null>(null);
  // Die AKTUELLE Merkfolge (laufzeit-erzeugt, adaptive Länge) — die getippt/gemerkt wird.
  const [stormTarget, setStormTarget] = useState<string>("");
  // Polarstation (§4.5, Wort-Raten/Anagramm): die Zahl der Fehlgriffe+Hinweise (→
  // Empfangsstärke) und `solving` = das Wort ist fertig und bleibt kurz stehen (wird
  // vorgelesen), bevor es weitergeht. Funkwellen-Impuls je gefunktem Wort, Wackel je Fehlgriff.
  const [guessMiss, setGuessMiss] = useState(0);
  const [solving, setSolving] = useState(false);
  /**
   * PUNKT 5 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Bei ASG darf ich aber nicht
   * GAS antworten, sondern SAG." Die TATSÄCHLICH getippten Buchstaben des laufenden
   * Funkspruchs — seit auch ANDERE echte Wörter aus denselben Buchstaben zählen (s.
   * `stationSolutions`), ist das nicht mehr zwingend ein Präfix des „gedachten" Wortes.
   * Speist Slot-Anzeige und „Bisher: …" — beide dürfen nie ein Zeichen behaupten, das
   * nicht wirklich gedrückt wurde.
   */
  const [guessTyped, setGuessTyped] = useState("");
  const [sentPulse, setSentPulse] = useState(0);
  const [wobble, setWobble] = useState(0);
  // Rückenwind-Meter (§4.8): 0..1 = wie flüssig zuletzt getippt. `beatsRef` sammelt die
  // Zeitpunkte der letzten richtigen Anschläge (für den Variationskoeffizienten).
  const [tailwind, setTailwind] = useState(0);
  const beatsRef = useRef<number[]>([]);
  // Herzen der laufenden Zone (Anzeige im HUD); `livesRef` ist der synchron lesbare Spiegel.
  const [lives, setLives] = useState(ZONE_LIVES);
  // Bauchrutsche (Rhythmus): verstrichene Anflugzeit des aktuellen Buchstabens in ms.
  // `slideTickRef` = wie viele Auftakt-Ticks schon erklungen sind, `slideCueRef` = Zielton
  // erklungen? `slideElRef` ist der synchron (im keydown-Handler) lesbare Spiegel.
  const [slideEl, setSlideEl] = useState(0);
  const slideElRef = useRef(0);
  const slideTickRef = useRef(0);
  const slideCueRef = useRef(false);
  /** Riegel: ein vorbeigeflogener Buchstabe kostet GENAU ein Herz, nicht zwei (s. Effekt unten). */
  const slideMissedRef = useRef(false);
  /**
   * ★★★★★ EIN HINWEIS, DEN AUCH EIN SEHENDES KIND MIT „TON AUS" BEKOMMT.
   *
   * Johannes 04.09.2026: *„sehende kinder benutzen ton aus und wenn der einzige
   * Kanal dann die braillezeile ist dann haben sie keine chance."*
   *
   * Die zwei gewohnten Wege tragen diesen Hinweis NICHT: Ein Ton fällt bei
   * „Ton aus" weg, und `say()` schreibt ohne Vorlesen in die `sr-only`-Region -
   * die erreicht nur eine Sprachausgabe oder eine Braillezeile. Ein sehendes
   * Kind mit abgeschaltetem Ton hätte damit wieder GAR nichts, und das war
   * genau Testerin Befund. Dieser Hinweis geht darum zusätzlich in die SICHTBARE
   * Statuszeile und verschwindet nach {@link HINWEIS_MS} von selbst.
   */
  const [hinweis, setHinweis] = useState<string | null>(null);
  const hinweisTokenRef = useRef(0);
  slideElRef.current = slideEl;

  const stormLevelRef = useRef(0); // Steigerungsstufe: 0 = Länge 3 … STORM_MAX_LEVEL
  const stormGrowRef = useRef(0); // fehlerfreie Stationen seit der letzten Längen-Steigerung (Johannes 15.07.: langsamer)
  const stormOffsetRef = useRef(0); // Versatz in den Zeichen-Vorrat (Abwechslung je Station)
  const stormCleanRef = useRef(true); // war die AKTUELLE Station bisher fehlerfrei?
  const stormTokenRef = useRef(0); // laufende Tafel-Nummer (gegen veraltete Verweh-Timer)
  // Sturm: steht die Merk-Tafel noch? Synchron im nativen keydown-Handler lesbar (ohne dass
  // handleKey bei jedem showSeq-Wechsel neu gebaut werden muss) — sperrt die Eingabe, bis
  // die Buchstaben verweht sind (Johannes 13.07.: Sehende dürfen nicht abschreiben).
  const showSeqRef = useRef<string | null>(null);
  const helpTimerRef = useRef<number | null>(null); // Timer der Funker-Hilfe (Tab-Hinweis-Sound)
  // Spiegel des Rate-Stands (synchron in handleStationKey/revealHint lesbar, ohne Re-Render).
  const guessMissRef = useRef(0);
  const guessTypedRef = useRef(""); // Spiegel von `guessTyped` (synchron in handleStationKey lesbar)
  const solvingRef = useRef(false); // Wort fertig, bleibt kurz stehen → Tasten pausieren
  const warnedRef = useRef(0); // Steilwand: wie viele Steinschlag-Stufen schon gemeldet
  const keyFailsRef = useRef(0);
  const failsRef = useRef(0);
  /**
   * ★★★ W1 (27.09.2026): die gedrückte Totaste, deren Zeichen noch nicht
   * feststeht - dieselbe Idee wie in `useTypingItem.ts` (`deuteAnschlag`).
   * Bis W1 stand hier `totasteFehlgriffRef` (E4: Totaste an falscher Stelle
   * sofort ein Fehlgriff, der nächste Anschlag verschluckt). Von `handleKey`
   * UND `handleSlideKey` geteilt (immer nur eine Zone aktiv). Nur auf
   * Tastaturen mit Lehrgangs-Totasten überhaupt gesetzt.
   */
  const offeneTotasteRef = useRef<OffeneTotaste | null>(null);
  // Leben (Johannes 14.07.): zwei Herzen je Zone. `missesRef` zählt JEDEN Fehler (Fehlgriff
  // ODER abgelaufene Zeit) — daraus wird „fehlerfrei" für die Ansage; `restartsRef` zählt, wie
  // oft die Zone von vorn begonnen werden musste (beide Herzen weg) — daraus wird `clean`,
  // die Bedingung fürs Polarlicht (Johannes: „Aurora, wenn keine Zone neu gestartet wurde").
  const livesRef = useRef(ZONE_LIVES);
  const missesRef = useRef(0);
  const restartsRef = useRef(0);
  // „Wirklich versucht" je Station (Schritt) - überlebt Zonen-Neustarts, s. `VERSUCH_*` oben.
  const versucheRef = useRef<Map<number, StationsVersuch>>(new Map());
  const posRef = useRef(0);
  posRef.current = pos;
  const merkeTreffer = useCallback((station: number) => {
    const v = versucheRef.current.get(station) ?? { treffer: 0, fehlgriffe: 0, tasten: new Set<string>() };
    v.treffer += 1;
    versucheRef.current.set(station, v);
  }, []);
  const merkeFehlgriff = useCallback((station: number, key: string, gesucht: string) => {
    if (!zaehltAlsEchterFehlgriff(key, gesucht)) return;
    const v = versucheRef.current.get(station) ?? { treffer: 0, fehlgriffe: 0, tasten: new Set<string>() };
    v.fehlgriffe += 1;
    v.tasten.add(key.toLowerCase());
    versucheRef.current.set(station, v);
  }, []);
  const fishCaughtRef = useRef(0);
  // Nur beim ERSTEN Bonus-Fisch die volle Ansage („Ein Fisch springt!"), danach nur noch
  // den Buchstaben (Johannes 13.07.) — sonst wird der Hinweis schnell eintönig.
  const fishAnnouncedRef = useRef(false);
  /**
   * Spiegel von `hop` für `skipStation` (PUNKT 7/8): `hop` selbst wird erst weiter unten
   * gebaut (nach `arriveFinish`) und würde dort vor seiner eigenen Definition gebraucht -
   * der Spiegel (wie `slideElRef`/`showSeqRef` weiter oben) macht daraus einen normalen,
   * sicheren Rückruf, ohne die halbe Datei umzusortieren.
   */
  const hopRef = useRef<(i: number) => void>(() => {});
  const timersRef = useRef<number[]>([]);
  /** Die Bedienungssprache für Rückrufe ohne Abhängigkeiten (`verwehen`, EN3). */
  const spracheRef = useRef(sprache);
  spracheRef.current = sprache;
  const brailleRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  /** Braille-Spur der Bauchrutsche (wandernder Buchstabe, NICHT vorgelesen — s. Effekt unten). */
  const trackRef = useRef<HTMLDivElement>(null);
  showSeqRef.current = showSeq; // Spiegel für den synchronen keydown-Handler (Sturm-Sperre)

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  /** So lange steht ein Hinweis in der sichtbaren Statuszeile. */
  const HINWEIS_MS = 1600;

  /**
   * Einen kurzen Hinweis in die SICHTBARE Statuszeile setzen (siehe `hinweis`).
   * Das Token sorgt dafür, dass nur der jüngste Hinweis sich selbst wieder
   * abräumt - sonst löschte der Zeitgeber eines alten den frischen.
   */
  const zeigeHinweis = useCallback(
    (text: string) => {
      const token = ++hinweisTokenRef.current;
      setHinweis(text);
      later(() => {
        if (hinweisTokenRef.current === token) setHinweis(null);
      }, HINWEIS_MS);
    },
    [later],
  );

  /**
   * Ansage der Zone. Nutzt {@link speakQueued} statt `speakUi` (Johannes 14.07.: „spricht
   * Textzeile in Geschwindigkeit schnell nicht zu Ende"): `speakUi` rief intern
   * `speechSynthesis.cancel()`, sobald eine neue Ansage kam — bei flottem Spiel köpfte damit
   * jeder Satz seinen Vorgänger, besonders bei hohem Sprechtempo. Jetzt reiht sich die neue
   * Ansage dahinter ein (höchstens zwei warten; ältere Wartende fallen raus, der LAUFENDE
   * Satz wird nie abgeschnitten). Bei einem Zustandsbruch (Scheitern, Zonen-Neustart) leert
   * {@link cancelQueued} die Reihe — dort ist die alte Ansage ja gegenstandslos.
   */
  const say = useCallback(
    (text: string) => {
      // ★ EN3: in Tastenflow mit der Stimme der Bedienungssprache.
      if (voiceEnabled) {
        if (bereichAktiv) speakQueued(text, sprache);
        else speakQueued(text);
      } else if (statusRef.current) statusRef.current.textContent = text;
    },
    [voiceEnabled, bereichAktiv, sprache],
  );

  // Wie `say`, aber in der hohen „Fisch-Stimme" (Bauplan §4.1, Johannes 13.07.): bei
  // aktivem Vorlesen quietschig-hoch, sonst über die Live-Region (Braille) wie sonst.
  const sayFish = useCallback(
    (text: string) => {
      if (voiceEnabled) {
        if (bereichAktiv) speakFishVoice(text, sprache);
        else speakFishVoice(text);
      } else if (statusRef.current) statusRef.current.textContent = text;
    },
    [voiceEnabled, bereichAktiv, sprache],
  );

  // Rückenwind-Meter fortschreiben (§4.8): `ok=false` (Fehlgriff) leert es teilweise und
  // bricht den Rhythmus; `ok=true` misst den Variationskoeffizienten der letzten Abstände —
  // ist er klein (gleichmäßig), steigt das Meter, sonst sinkt es leicht. Reine App-Logik.
  const noteBeat = useCallback((ok: boolean) => {
    if (!ok) {
      beatsRef.current = [];
      setTailwind((t) => Math.max(0, t - TAILWIND_ERROR_DRAIN));
      return;
    }
    const now = Date.now();
    const arr = beatsRef.current;
    const last = arr[arr.length - 1];
    if (last !== undefined && now - last > TAILWIND_MAX_GAP_MS) arr.length = 0; // lange Pause bricht den Fluss
    arr.push(now);
    if (arr.length > TAILWIND_SAMPLES + 1) arr.shift();
    if (arr.length < 4) return; // erst ab ein paar Anschlägen bewerten
    const iv: number[] = [];
    for (let i = 1; i < arr.length; i++) iv.push(arr[i] - arr[i - 1]);
    const mean = iv.reduce((a, b) => a + b, 0) / iv.length;
    const variance = iv.reduce((a, b) => a + (b - mean) ** 2, 0) / iv.length;
    const cov = mean > 0 ? Math.sqrt(variance) / mean : 1;
    setTailwind((t) =>
      Math.max(0, Math.min(1, t + (cov < TAILWIND_STEADY_COV ? TAILWIND_RISE : -TAILWIND_DRIFT))),
    );
  }, []);

  // Echo-Höhle (Bauplan §4.3): das Höhlenwesen sagt die Taste an — IMMER hörbar
  // (Monster-Klang, auch bei ausgeschaltetem Vorlesen) UND parallel in die Live-
  // Region für die Braillezeile. Das ist die bewusste Ausnahme von der Doppelsprech-
  // Regel (analog `sayEcho` im Altspiel). Das Zeichen steht NIE als Glyph/sichtbar im
  // DOM (Blindschreiben für alle). Fällt das Monster-Sample aus (stumm oder noch nicht
  // geladen), sagt die App-Stimme die Taste (speakUiAlways) — die Ansage darf beim
  // Blindschreiben nie verloren gehen.
  // Beobachtet die Vorlese-Stimme und ruft `fn` erst, wenn sie WIRKLICH gesprochen
  // hat und wieder still ist (zwei stille Ticks gegen kurzes Flackern). Nie mid-Intro.
  // Startet die Stimme nie (Vorlesen aus / Fehlstart) → nach NO_SPEECH_MS; hängt sie
  // (Chrome) → spätestens nach VOICE_WAIT_CAP_MS. Über den aufräumbaren Timer-Speicher.
  const afterIntro = useCallback(
    (fn: () => void) => {
      const t0 = Date.now();
      let sawSpeech = false;
      let quiet = 0;
      const tick = () => {
        /*
         * ★ 20.09.2026 (Testerin Durchgang, Punkt 4): bis dahin stand hier `isSpeaking()`
         * (prüft NUR `speechSynthesis.speaking`). Genau das war die Lücke, die Johannes'
         * Bericht als Anhaltspunkt nennt: zwischen `speak()` und dem tatsächlichen
         * `speaking=true` liegt bei Chrome manchmal eine kurze Weile, in der die
         * Utterance schon `pending` ist, aber noch nicht hörbar - `isSpeaking()` sah das
         * als „Intro kam nie" und gab nach {@link NO_SPEECH_MS} vorzeitig frei, mitten in
         * der Anlaufzeit. `sprachausgabeBeschaeftigt()` (voice.ts) zählt `pending` UND
         * die Ruhefenster-/Reihen-Wartezeit mit - keine neue Frist nötig, nur das
         * vollständigere Signal.
         */
        const speaking = sprachausgabeBeschaeftigt();
        if (speaking) {
          sawSpeech = true;
          quiet = 0;
        } else {
          quiet += 1;
        }
        const elapsed = Date.now() - t0;
        if (elapsed >= VOICE_WAIT_CAP_MS) return void fn(); // Notbremse: hängendes speaking
        if (sawSpeech && quiet >= 2) return void fn(); // Intro gesprochen & (stabil) fertig
        if (!sawSpeech && elapsed >= NO_SPEECH_MS) return void fn(); // Intro kam nie
        later(tick, 120);
      };
      tick();
    },
    [later],
  );

  // Echo-Höhle (§4.3): Das Wesen RAUNT nur EINMAL beim Eintreten/Wiedereintreten
  // (`withRaunen`), danach kommen die Buchstaben OHNE Raunen (Johannes 13.07.). Beim
  // Raunen wird erst die Vorlese-Stimme (Intro/Fehlermeldung) abgewartet ({@link
  // afterIntro}), dann geraunt und das Raunen {@link RAUNEN_PAUSE_MS} lang ausklingen
  // gelassen, bevor das Zeichen kommt. Progression/Fehlgriff sprechen SOFORT (nie aufs
  // Sprechen warten → keine ausbleibende Ansage). Das Zeichen steht NIE als Glyph im
  // DOM; es geht in die sr-only Live-Region (Braillezeile) und über den Monster-Klang
  // (oder speakUiAlways, falls das Sample fehlt — Ansage nie verlieren).
  const announceCaveKey = useCallback(
    (unit: string | null, withRaunen: boolean) => {
      if (!unit) return;
      // Die Entscheidung (Weg „de" deutsch/EN3, Weg „en" nur Ton/§6.3) steht in
      // {@link caveAnnouncement} - dort auch getestet, ohne den ganzen Hook.
      const { text, tone } = caveAnnouncement(unit, lernweg);
      const sayChar = () => {
        if (statusRef.current) statusRef.current.textContent = text;
        if (tone) {
          playCaveKeyTone();
          return;
        }
        // `playMonsterSay` spielt das Monster-Sample (tiefer abgespielt) — und spricht, falls
        // das Sample fehlt, selbst mit der TIEFEN Höhlenwesen-Stimme (Johannes 14.07.: „Die
        // Stimme klingt immer gleich, auch das Höhlenmonster"). Die Ansage geht also nie
        // verloren und klingt nie wie die Erzählerin.
        playMonsterSay(unit, text);
      };
      if (withRaunen) {
        afterIntro(() => {
          playMonsterRaunen();
          later(sayChar, RAUNEN_PAUSE_MS);
        });
      } else {
        sayChar();
      }
    },
    [afterIntro, later, lernweg],
  );

  // Schneesturm (§4.4): Die Tafel VERWEHT — die Folge verlässt den Bildschirm UND
  // das DOM (auch die sr-only Live-Region: Merkübung gilt für Screenreader genauso).
  // Statt der Folge kommt ein neutraler Hinweis in die Live-Region (kein Zeichen).
  const verwehen = useCallback(() => {
    setShowSeq(null);
    stormGust(); // die Böe, die die Tafel wegbläst
    // Die Folge verlässt das DOM VOLLSTÄNDIG — auch die sr-only Braille-Alert-Region,
    // die sie beim Zeigen trug (sonst bliebe sie für Screenreader lesbar, §7/§4.4).
    if (brailleRef.current) brailleRef.current.textContent = "";
    if (statusRef.current) statusRef.current.textContent = SPIEL_TEXTE[spracheRef.current].tafelVerweht;
  }, []);

  // Schneesturm: die Folge auf die Tafel setzen, optional ansagen, dann nach `ms`
  // verwehen lassen. `announce` schreibt sie zusätzlich in die Live-Region (Braille)
  // — nur SOLANGE sie sichtbar ist; `verwehen` räumt beide wieder ab.
  const showStormSeq = useCallback(
    (seq: string, announce: boolean, ms: number) => {
      if (!seq) return;
      // Token: verwehen NUR, wenn seither keine neue Tafel gezeigt wurde — sonst
      // würde ein alter Timer (schnell durchgetippte Vorstation) die neue Tafel löschen.
      const token = ++stormTokenRef.current;
      setShowSeq(seq);
      if (announce) {
        const seqTxt = spokenSeq([...seq], sprache);
        if (brailleRef.current) brailleRef.current.textContent = S.merkBraille(seqTxt);
        say(S.merkAnsage(isAdult, seqTxt));
      }
      later(() => {
        if (stormTokenRef.current === token) verwehen();
      }, ms);
    },
    [say, isAdult, later, verwehen, sprache, S],
  );

  // Zeichen-Vorrat des Sturms (die wackligsten Zeichen, die der Kurs mitliefert).
  const stormPool = useMemo(() => {
    const seen = new Set<string>();
    const pool: string[] = [];
    for (const u of units) for (const ch of unitSeq(u)) if (!seen.has(ch)) (seen.add(ch), pool.push(ch));
    return pool;
  }, [units]);

  /**
   * Eine frische Merkfolge der Länge `len` aus dem Vorrat.
   *
   * Vorher lief die Folge stumpf im Kreis durch den Vorrat (`pool[(offset+j) % len]`) — bei
   * einem kleinen Zeichenvorrat kam dabei immer wieder dieselbe Handvoll Zeichen in derselben
   * Reihenfolge heraus (Johannes 14.07.: „Im Schneesturm sind die Folgen immer sich
   * wiederholende drei Zeichen, die aber variieren"). Jetzt springt ein deterministischer
   * Schrittweiten-Generator durch den Vorrat: die Schrittweite ist teilerfremd zur
   * Vorratsgröße, wechselt je Station und wird pro Zeichen weitergedreht — dieselbe Station
   * ergibt reproduzierbar dieselbe Folge (testbar), aber aufeinanderfolgende Stationen sehen
   * verschieden aus. Direkte Zeichen-Wiederholungen („aab") werden übersprungen.
   */
  const genStormSeq = useCallback(
    (len: number, offset: number): string => {
      const n = stormPool.length;
      if (n === 0) return "";
      if (n === 1) return stormPool[0].repeat(len);
      // Schrittweite teilerfremd zu n → der Umlauf trifft alle Zeichen, bevor er sich wiederholt.
      let stride = 1 + ((offset * 7 + 3) % Math.max(1, n - 1));
      while (gcd(stride, n) !== 1) stride += 1;
      let idx = (offset * 5 + 1) % n;
      let s = "";
      for (let j = 0; j < len; j++) {
        idx = (idx + stride + j) % n;
        let ch = stormPool[idx];
        if (ch === s[s.length - 1]) {
          idx = (idx + 1) % n; // nie zweimal dasselbe Zeichen hintereinander
          ch = stormPool[idx];
        }
        s += ch;
      }
      return s;
    },
    [stormPool],
  );

  // Nächste Sturm-Station betreten (Bauplan §4.4 + Johannes 13.07.): Die Länge wächst
  // NUR nach einer fehlerfreien Vorfolge (Start 4 → bis 10). Erzeugt die Merkfolge
  // frisch, zeigt+sagt sie an, dann verweht sie. `advance=false` beim ersten Eintritt.
  const enterStormStation = useCallback(
    (advance: boolean) => {
      if (advance && stormCleanRef.current) {
        // Langsamer steigern (Johannes 15.07.): erst nach ZWEI fehlerfreien Stationen wird
        // die Merkfolge um ein Zeichen länger — nicht mehr nach jeder einzelnen.
        stormGrowRef.current += 1;
        if (stormGrowRef.current >= 2) {
          stormGrowRef.current = 0;
          stormLevelRef.current = Math.min(STORM_MAX_LEVEL, stormLevelRef.current + 1);
        }
      }
      stormCleanRef.current = true; // neue Station startet fehlerfrei
      const len = stormLenForLevel(stormLevelRef.current);
      const seq = genStormSeq(len, stormOffsetRef.current);
      stormOffsetRef.current += len;
      setStormTarget(seq);
      setSeqPos(0);
      showStormSeq(seq, true, STORM_MEMORIZE_BASE + len * STORM_MEMORIZE_PER);
    },
    [genStormSeq, showStormSeq],
  );

  // --- Polarstation (§4.5, Wort-Raten/Anagramm): Ansage, Reihenfolge, Hinweis-Taste --

  /**
   * Einen neuen Funkspruch ansagen — die DURCHEINANDER gewürfelten Buchstaben, NIE das
   * fertige Wort (das ist das Rätsel; §7). So ist es auch per Ohr lösbar: das Kind hört
   * die Buchstaben und tippt das Wort, das sie ergeben.
   */
  const announceStationWord = useCallback(
    (word: string | null) => {
      if (!word) return;
      const mixed = spokenSeq(scrambleLetters(kleinFuer(word, lernweg)), sprache);
      say(S.stationWort(isAdult, mixed));
    },
    [say, isAdult, sprache, S, lernweg],
  );

  /**
   * PUNKT 5 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „In der Polarstation sind
   * vertauschte Buchstaben. Bei ASG darf ich aber nicht GAS antworten, sondern SAG. Da
   * sollte etwas eindeutiges hin oder mehrere Lösungen akzeptieren." Bis hierhin verglich
   * jede Eingabe NUR gegen das EINE „gedachte" Wort (feste Reihenfolge) - wer ein ANDERES
   * echtes Wort aus denselben Buchstaben fand, wurde wie ein Fehlgriff behandelt, obwohl
   * es richtig war.
   *
   * Jetzt zählt JEDE Eingabe, die (a) nur aus den ausliegenden Buchstaben besteht UND
   * (b) ein echtes Wort ist — geprüft über {@link lexikonWoerter}, DIESELBE Wortliste, aus
   * der auch der Buchstabensalat schöpft (KEINE zweite Wortliste, s.
   * `feedback_zwei_stellen_die_voneinander_nichts_wissen`). Das „gedachte" Wort steht
   * IMMER mit drin (es stammt aus `WORDS`, die selbst ins Lexikon einfliessen — s.
   * `lexicon.ts`), auch falls es aus irgendeinem Grund nicht gefunden würde.
   */
  const stationSolutions = useMemo(() => {
    if (zone !== "station") return [] as string[];
    const w = kleinFuer(spots[pos + 1]?.unit ?? "", lernweg);
    if (!w) return [] as string[];
    const key = [...w].sort().join("");
    const found = new Set<string>([w]);
    for (const cand of lexikonWoerter(lernweg)) {
      if (cand.length !== w.length) continue;
      if ([...cand].sort().join("") === key) found.add(cand);
    }
    return [...found];
    // `paketStand`: neu rechnen, sobald das Sprachpaket des Weges da ist (oben).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone, spots, pos, paketStand, lernweg]);

  /** Laufenden Nudge-Timer der Funker-Hilfe stoppen. */
  const clearHelp = useCallback(() => {
    if (helpTimerRef.current !== null) {
      window.clearTimeout(helpTimerRef.current);
      helpTimerRef.current = null;
    }
  }, []);

  /** Rate-Stand für ein neues Wort zurücksetzen: nichts getippt, keine Fehlgriffe. */
  const resetGuess = useCallback(() => {
    setSeqPos(0);
    guessMissRef.current = 0;
    setGuessMiss(0);
    solvingRef.current = false;
    setSolving(false);
    guessTypedRef.current = "";
    setGuessTyped("");
  }, []);

  /** Ziel ansagen: Höhle=Monster-Echo, Sturm=nächste Merkfolge, Station=Wort, sonst normal. */
  const announceTarget = useCallback(
    (unit: string | null) => {
      if (zone === "cave") announceCaveKey(unit, false); // Progression: kein Raunen
      else if (zone === "storm") enterStormStation(true); // adaptive Länge (nur nach fehlerfrei länger)
      else if (zone === "station") announceStationWord(unit); // ganzes Wort ansagen
      else if (unit) say(`${spokenSeq(unitSeq(unit), sprache)}.`);
    },
    [zone, say, announceCaveKey, enterStormStation, announceStationWord, sprache],
  );

  /** Die Ziel-Folge (Zeichen der nächsten Station) und ihr Gesamt-Zeitfenster. */
  const targetSeq = useMemo(() => unitSeq(spots[pos + 1]?.unit ?? null), [spots, pos]);

  const windowFor = useCallback(
    (standIdx: number, pol: number): number | null => {
      if (noTimePressure || zone === "storm" || zone === "station") return null; // Sturm/Station: kein Scheitern (§4.4/§4.5)
      /*
       * ★★★★★ DIE RUTSCHE HAT EINE EINZIGE UHR: DAS TOR (Lehrerin Zürich, 29.10.2026: „reagierte
       * immer an der gleichen Stelle nicht, obwohl der Buchstabe richtig und im richtigen Moment
       * getippt wurde").
       *
       * Bis hierher lief auf der Rutsche zusätzlich die Stations-Uhr der anderen Zonen mit
       * (`Median × Polster`, unsichtbar - `tension: null` - bis auf einen Zeitbalken). Das
       * Polster sinkt mit jeder geschafften Station von 2,2 auf 1,5, die Anflug-Uhr der Rutsche
       * aber bleibt bei `Median × 2,4`: Bei einer Taste mit Median ab ~0,9 s lief die Stations-Uhr
       * ab, BEVOR das Tor aufging - Herz weg, Rücksprung an den Anfang, Polster wieder 2,2, und
       * dann derselbe Kurs, dieselbe Stelle. Die richtige Taste im richtigen Moment konnte dort
       * gar nicht mehr zählen. Das Verpassen („Buchstabe fliegt vorbei") regelt die Anflug-Uhr
       * selbst (`SLIDE_GRACE_MS`), eine zweite Uhr braucht die Rutsche nicht.
       */
      if (zone === "slide") return null;
      // Erstbesuch-Probe-Schritt (§4.7): der allererste Zug (Ufer → Station 1) ist
      // geschützt — kein Zeitfenster, kann nicht scheitern (nach dem Tagebuch).
      if (protectFirst && standIdx === 0) return null;
      const target = spots[standIdx + 1];
      if (!target || target.unit === null) return null; // vor Rast/Ziel: kein Timer
      return sequenceWindowMs(unitSeq(target.unit), letters, mastery, pol);
    },
    [spots, letters, mastery, noTimePressure, zone, protectFirst],
  );

  const curWindow = useMemo(() => windowFor(pos, polster), [windowFor, pos, polster]);

  const cur = spots[pos];
  const targetIdx = pos + 1;
  const timed = !!cur && cur.kind === "station" && !won && !fail && !gliding && curWindow !== null;

  // --- Bauchrutsche: der heranfliegende Buchstabe (Rhythmus, §4.6 neu) -------------
  /** Anflugdauer des aktuellen Buchstabens — `null` bei „ohne Zeitdruck" (dann kein Timing). */
  const slideMs = useMemo(
    () =>
      zone === "slide" && !noTimePressure && !mastery.ignoreSpeed
        ? slideApproachMs(spots[pos + 1]?.unit ?? null, letters)
        : null,
    [zone, noTimePressure, mastery.ignoreSpeed, spots, pos, letters],
  );
  /**
   * Läuft gerade ein Anflug? Anders als der Countdown der übrigen Zonen (der erst AUF einer
   * Station tickt, am Ufer also nicht) beginnt der Anflug schon am Hang-Start: Der erste
   * Buchstabe fliegt dem Pinguin entgegen, sobald es losgeht — sonst stünde er oben und
   * wartete auf nichts.
   */
  const sliding =
    zone === "slide" && !!spots[pos + 1]?.unit && !won && !fail && !gliding && slideMs !== null;
  /** Der Anflug neu von vorn (nach Fehlgriff/Rücksprung/neuer Station). */
  const resetSlide = useCallback(() => {
    setSlideEl(0);
    slideElRef.current = 0;
    slideTickRef.current = 0;
    slideCueRef.current = false;
  }, []);

  // --- Leben, Fehler, Rücksprung (Johannes 14.07.) ---------------------------------
  //
  // Vorher: ein Fehlgriff spielte nur einen Ton und blieb sonst FOLGENLOS — man konnte
  // sich durch jede Zone hindurch-spammen, bis die richtige Taste dabei war (in der
  // Echo-Höhle hebelte das die ganze Idee aus), und am Ende lobte das Spiel trotzdem
  // „fehlerfrei", weil nur abgelaufene Zeitfenster gezählt wurden. Jetzt kostet JEDER
  // Fehler ein Herz; sind beide weg, beginnt die Zone von vorn.

  /** Die Zone (oder den Rastplatz) neu aufsetzen: Ziel neu ansagen, Zonen-Sonderzustand zurück. */
  const restartAt = useCallback(
    (idx: number, fromStart: boolean) => {
      setPos(idx);
      setSeqPos(0);
      resetSlide();
      warnedRef.current = 0;
      keyFailsRef.current = 0;
      setRemaining(windowFor(idx, POLSTER_START) ?? 0);
      const next = spots[idx + 1]?.unit ?? null;
      if (zone === "cave") {
        announceCaveKey(next, true); // Wiedereintritt: das Wesen raunt erneut
      } else if (zone === "storm") {
        if (fromStart) {
          stormLevelRef.current = 0; // Zone von vorn → wieder mit der kurzen Folge
          stormGrowRef.current = 0;
        }
        enterStormStation(false); // frische Merkfolge (die alte ist verbraucht)
      } else if (zone === "station") {
        resetGuess();
        announceStationWord(next);
      } else if (fromStart && next) {
        // Packeis/Steilwand/Bauchrutsche: Bis 31.08. hatte NUR die Höhle, der Sturm und die
        // Station hier einen Zweig - nach „beide Herzen weg" war es in diesen drei Zonen
        // still. Gemessen (pruefstand/kind/befunde/buecherei-und-spiel.md, SP-3;
        // pruefstand/kind/protokolle/spiel-neustart-vorher.txt): nach zwei Fehlgriffen
        // 3,2 Sekunden reines Zuhören, KEINE einzige Ansage. Wer nichts sieht, weiss danach,
        // dass es von vorn losgeht, aber nicht, welche Taste dran ist.
        // Warum genau `fromStart`: Beim Rücksprung mit noch einem Herzen (`fromStart=false`)
        // nennt `failTo` das Zeichen bereits über `named`/`T.failKid(back)` - dort noch einmal
        // anzusagen machte den gewöhnlichen Ablauf nur geschwätziger.
        // Warum `T.startText`: Genau dieser Satz sagt beim ZONENSTART das erste Ziel an
        // (s. u. „Reise-Modus") - der Zonen-Neustart ist derselbe Zustand. Kein neuer
        // Wortlaut. (★ EN3, 19.09.2026: Die Expedition erzählt seither in der
        // Bedienungssprache - `T` ist der Textsatz dieser Sprache, `say` spricht mit
        // ihrer Stimme; bis dahin durchgehend deutsch über `applyGermanVoice`.)
        say(T.startText(isAdult, spokenSeq(unitSeq(next), sprache)));
      }
    },
    [windowFor, spots, zone, announceCaveKey, enterStormStation, announceStationWord, resetGuess, resetSlide, say, isAdult, T, sprache],
  );

  /**
   * Scheitern: Pinguin fällt/sinkt/erschrickt, dann geht es zurück — entweder zum letzten
   * Rastplatz (noch ein Herz übrig war nicht der Fall … s. `loseLife`) oder an den ANFANG der
   * Zone (`toStart`), wenn beide Herzen aufgebraucht sind. Nur der Zonen-Neustart zerstört das
   * Polarlicht (`restartsRef`).
   */
  const failTo = useCallback(
    (toStart: boolean) => {
      cancelQueued(); // wartende Ansagen sind jetzt gegenstandslos (Ziel hat sich geändert)
      setFail(true);
      setPose("scare");
      setFishJump(null);
      setShowSeq(null);
      failsRef.current += 1;
      setPolster(POLSTER_START);
      setTailwind(0);
      beatsRef.current = [];
      cfg.failSound();
      if (zone === "cave") setCavePulse(0);
      const back = toStart ? 0 : (cur?.checkpoint ?? 0);
      if (toStart) {
        restartsRef.current += 1;
        hinweisTokenRef.current += 1;
        setHinweis(null); // ein alter Hinweis gehoert nicht in eine neu beginnende Zone
        livesRef.current = ZONE_LIVES;
        setLives(ZONE_LIVES);
      }
      setRings(zone === "water" ? pts[pos]?.x ?? null : null);
      const backUnit = spokenSeq(unitSeq(spots[back + 1]?.unit ?? ""), sprache);
      // Sturm/Höhle/Station nennen NIE das Zeichen (§7) — dort trägt der Zonentext keinen Namen.
      const named = zone === "cave" || zone === "storm" || zone === "station" ? "" : backUnit;
      if (toStart) {
        // PUNKT 7 (Testerin Durchgang 20.09.2026): der Hinweis auf die Überspring-Taste
        // kommt NUR einmal je Zonen-Besuch — GENAU beim ERSTEN Neustart (`restartsRef`
        // wurde eben erst auf 1 gesetzt) — „sparsam, nicht bei jeder Station aufs Neue",
        // aber sinnvoll gerade dann, wenn jemand offensichtlich hängt.
        const hinweisSatz = restartsRef.current === 1 ? ` ${S.tippUeberspringen(isAdult)}` : "";
        say(S.beideHerzen(isAdult) + hinweisSatz);
      } else {
        say(isAdult ? T.failAdult(named) : T.failKid(named));
      }
      later(() => {
        setRings(null);
        setFail(false);
        setPose(cfg.standPose);
        restartAt(back, toStart);
      }, FAIL_BACK_MS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg, zone, cur, pos, pts, spots, say, isAdult, T, later, restartAt],
  );

  /**
   * PUNKT 7/8 (Testerin Durchgang 20.09.2026): Eine Station (bzw. den nächsten Schritt)
   * überspringen und weiterspielen — ob das Kind selbst die Eingabetaste drückt (Punkt 7,
   * s. `handleKey`) oder die App es nach zwei Neustarts von selbst tut (Punkt 8, s.
   * `loseLife` unten). EIN Weg, EINE Ansage — nie ein Vorwurf (Hausregel „nie etwas gegen
   * ein Kind"): „Diese Station lassen wir aus", nie „du hast es nicht geschafft". Läuft
   * wie ein ganz normales Weiterkommen (`hop`) — frische Herzen, kein Fehler-Klang, kein
   * Rücksprung.
   */
  const skipStation = useCallback(() => {
    cancelQueued();
    setFishJump(null);
    livesRef.current = ZONE_LIVES;
    setLives(ZONE_LIVES);
    say(S.stationUebersprungen(isAdult));
    hopRef.current(pos + 1);
  }, [say, isAdult, pos, S]);

  /**
   * Ein Fehler ist passiert (falsche Taste ODER Zeit abgelaufen): ein Herz weg. Ist noch eines
   * übrig, geht es an derselben Station weiter — die angefangene Folge beginnt von vorn, die Uhr
   * läuft weiter (ein Fehlgriff kostet also Herz UND Zeit). Beim Zeit-Ablauf ist die Station
   * ohnehin verloren: dann zurück zum Rastplatz. Sind beide Herzen weg: Zone von vorn — AUSSER
   * das wäre schon der DRITTE Neustart (Punkt 8): dann wird stattdessen übersprungen.
   */
  const loseLife = useCallback(
    (reason: "miss" | "timeout") => {
      if (livesRef.current <= 0) return; // Rücksprung läuft schon
      missesRef.current += 1;
      livesRef.current -= 1;
      setLives(livesRef.current);
      noteBeat(false);
      if (livesRef.current <= 0) {
        // PUNKT 8 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Wenn man es nach
        // zwei Wiederholungen nicht geschafft hat, sollte es auch einfach weitergehen.
        // Endlosschleifen nerven." Die ersten zwei Male, in denen beide Herzen weg sind,
        // beginnt die Zone wie gehabt von vorn (`restartsRef` zählt mit). Stünde
        // `restartsRef` schon auf 2 (das WÄRE der dritte Neustart), wird stattdessen
        // übersprungen — das Polarlicht ist an dieser Stelle ohnehin längst kein Thema
        // mehr (zwei Neustarts stehen schon in `restartsRef`), dieser Zweig ändert nichts
        // an `clean`/`flawless`.
        // 02.10.2026: Gnadenregel NUR für ein Kind, das an dieser Station wirklich etwas
        // versucht hat (`wirklichVersucht`). Wer nur die Leertaste drückt (oder gar nichts),
        // bekommt den gewohnten Zonen-Neustart - kein Überspringen, kein Vorwurf.
        if (restartsRef.current >= 2 && wirklichVersucht(versucheRef.current.get(posRef.current))) {
          skipStation();
        } else {
          failTo(true); // beide Herzen weg → Zone von vorn (kein Polarlicht mehr)
        }
        return;
      }
      if (reason === "timeout") {
        failTo(false); // Zeit abgelaufen → zurück zum letzten Rastplatz
        return;
      }
      // Fehlgriff mit Herz in Reserve: Ton, Folge von vorn, Uhr läuft weiter.
      playErrorSound();
      // Polarstation: das bisher Getippte BLEIBT stehen (`guessTyped`, die Kärtchen bleiben
      // grau) - `seqPos` folgt ihm, statt auf 0 zu springen. Vorher widersprachen sich
      // Statuszeile („Bisher:" weg) und Kärtchen (verbraucht) (02.10.2026).
      setSeqPos(zone === "station" ? guessTypedRef.current.length : 0);
      setPolster(POLSTER_START);
      const schonDa =
        zone === "station" && guessTypedRef.current
          ? S.schonDaStand(spokenSeq([...guessTypedRef.current], sprache))
          : "";
      say(S.herzWeg(isAdult, livesRef.current) + schonDa);
    },
    [failTo, noteBeat, say, isAdult, S, skipStation, zone, sprache],
  );

  // --- Öffnen / „Nochmal spielen": Zustand aufsetzen, Ansage, Audio starten ------
  useEffect(() => {
    if (!open || !hasStations) return;
    setPos(0);
    setSeqPos(0);
    setFail(false);
    setGliding(false);
    setWon(false);
    setPose(zone === "slide" ? "slide" : "idle");
    setPolster(POLSTER_START);
    setRemaining(0);
    setFishJump(null);
    setRings(null);
    setShowSeq(null);
    setStormTarget("");
    setSentPulse(0);
    setWobble(0);
    setTailwind(0);
    beatsRef.current = [];
    resetGuess();
    resetSlide();
    stormLevelRef.current = 0;
    stormGrowRef.current = 0;
    stormOffsetRef.current = 0;
    stormCleanRef.current = true;
    clearHelp();
    warnedRef.current = 0;
    keyFailsRef.current = 0;
    failsRef.current = 0;
    hinweisTokenRef.current += 1;
    setHinweis(null); // ein alter Hinweis gehoert nicht in eine neu beginnende Zone
    livesRef.current = ZONE_LIVES;
    setLives(ZONE_LIVES);
    missesRef.current = 0;
    restartsRef.current = 0;
    versucheRef.current = new Map();
    fishCaughtRef.current = 0;
    fishAnnouncedRef.current = false;

    const first = spokenSeq(unitSeq(spots[1]?.unit ?? ""), sprache);
    if (brailleRef.current) {
      // Höhle/Sturm: Öffner OHNE das Zeichen (Blindschreiben bzw. Merken) — es wird
      // gleich angesagt bzw. auf der Tafel gezeigt (und verweht dann aus dem DOM).
      // ★ EN3: Der Name der Zone hing hier an `T.noun` („Scholle"/„Tritt") - das ist
      // englisch ein anderes Wort; darum jetzt an der Zone selbst.
      brailleRef.current.textContent =
        zone === "cave"
          ? S.oeffnerHoehle(hoehleMitWesen)
          : zone === "storm"
            ? S.oeffnerSturm
            : zone === "station"
              ? S.oeffnerStation([...(spots[1]?.unit ?? "")].filter((c) => c !== " ").length)
              : S.oeffnerSonst(zone, first);
    }
    const t = !noTimePressure;
    if (announceIntro) {
      say(isAdult ? T.introAdult(first, t) : T.introKid(first, t));
    } else if (zone === "water" || zone === "climb" || zone === "slide") {
      // Reise-Modus: das Tagebuch hat die Zone erklärt — beim Start nur noch das konkrete
      // erste Ziel ansagen (Höhle/Sturm/Station kündigen ihr erstes Ziel unten selbst an).
      say(T.startText(isAdult, first));
    }

    cfg.prime();
    if (zone === "cave") {
      // Höhlen-Atmo ist Live-Synthese (Bauplan §6.2); Monster-Ansagen vorladen und
      // die erste Taste nach kurzer Pause raunen (nach dem Intro, ohne Überlappung).
      startCaveAmbience();
      spots.forEach((s) => {
        if (s.unit) preloadMonsterUnit(s.unit);
      });
      // Eintritt: einmal raunen — afterIntro wartet das Intro ab (kein 1400er-Raten mehr).
      later(() => announceCaveKey(spots[1]?.unit ?? null, true), 300);
    } else if (zone === "storm") {
      // Sturm-Atmo (Sample+Böen); die erste Merkfolge (Länge 4) NACH dem Intro
      // zeigen+ansagen (afterIntro → kein Überlappen), dann verweht sie von selbst.
      startStormAmbience();
      later(() => afterIntro(() => enterStormStation(false)), 300);
    } else if (zone === "station") {
      // Warme Abend-Atmo (Live-Synth); das erste Wort NACH dem Intro ansagen
      // (afterIntro → kein Überlappen). Die Funker-Hilfe zieht der station-Effekt auf.
      startStationAmbience();
      later(() => afterIntro(() => announceStationWord(spots[1]?.unit ?? null)), 300);
    } else if (cfg.ambience) {
      startAmbience(cfg.ambience);
    }

    const timers = timersRef.current;
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
      if (helpTimerRef.current !== null) window.clearTimeout(helpTimerRef.current);
      helpTimerRef.current = null;
      stopAllExpedition();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, run]);

  // --- Countdown: läuft nur auf einer Station mit Zeitfenster ----------------------
  useEffect(() => {
    if (!timed || curWindow === null) return;
    warnedRef.current = 0;
    if (cfg.tension === "ice") startIce();
    const id = window.setInterval(() => {
      setRemaining((r) => (isSpeaking() ? r : Math.max(0, r - TICK_MS)));
    }, TICK_MS);
    return () => {
      window.clearInterval(id);
      if (cfg.tension === "ice") stopIce();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timed, pos, run]);

  // Spannungs-Klang an die Restzeit koppeln: Wasser = Eisknacken lauter/schneller;
  // Steilwand = einmal Steinchen rieseln, sobald das Kind zögert (Bauplan §4.2);
  // Höhle = Puls beschleunigt/vertieft schichtweise (Bauplan §4.3).
  useEffect(() => {
    if (!timed || !curWindow) return;
    const t = 1 - remaining / curWindow;
    if (cfg.tension === "ice") {
      setIceTension(t);
    } else if (cfg.tension === "rock") {
      // Mehrstufig statt einmalig: die Steine melden sich zu denselben Zeitpunkten,
      // zu denen beim Packeis das Eisknacken hörbar zulegt (Johannes 14.07.).
      while (warnedRef.current < ROCK_WARN_AT.length && t >= ROCK_WARN_AT[warnedRef.current]) {
        warnedRef.current += 1;
        playRockfall();
      }
    } else if (cfg.tension === "pulse") {
      setCavePulse(t);
    }
  }, [remaining, timed, curWindow, cfg.tension]);

  // --- Countdown abgelaufen → ein Herz weg (bei 0: Zone von vorn) -----------------
  useEffect(() => {
    if (!timed || curWindow === null) return;
    if (remaining <= 0) loseLife("timeout");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, timed]);

  // --- Bauchrutsche: Anflug-Uhr, Auftakt-Ticks, Zielton, Verpassen -----------------
  // Die Uhr pausiert (wie der Countdown), solange die Ansage spricht — sonst rauscht der
  // Buchstabe während des Vorlesens vorbei (§7: Ansage darf nie zum Nachteil werden).
  useEffect(() => {
    if (!sliding) return;
    const id = window.setInterval(() => {
      setSlideEl((e) => (isSpeaking() ? e : e + TICK_MS));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [sliding, pos, run]);

  useEffect(() => {
    if (!sliding || slideMs === null) return;
    const frac = slideEl / slideMs;
    // Auftakt: drei Ticks in gleichmäßigem Abstand — sie geben den Rhythmus vor.
    while (slideTickRef.current < SLIDE_TICKS.length && frac >= SLIDE_TICKS[slideTickRef.current]) {
      slideTickRef.current += 1;
      playSlideTick();
    }
    // Zielton GENAU beim Aufgehen des Trefferfensters: „jetzt drücken" (blind spielbar).
    if (!slideCueRef.current && slideEl >= slideMs - SLIDE_HIT_MS) {
      slideCueRef.current = true;
      playSlideCue();
    }
    // Vorbei — der Buchstabe ist durch: ein Herz weg, der nächste Anflug beginnt.
    // `slideMissedRef` sperrt das Nachfassen: ohne diesen Riegel feuerte der Effekt zweimal,
    // bevor der zurückgesetzte Anflug im Zustand ankam — ein einziger verpasster Buchstabe
    // kostete dann BEIDE Herzen und warf die Zone sofort zurück (im Browser gefunden, 14.07.).
    if (slideEl <= slideMs) slideMissedRef.current = false;
    if (slideEl > slideMs + SLIDE_GRACE_MS && !slideMissedRef.current) {
      slideMissedRef.current = true;
      loseLife("miss");
      resetSlide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideEl, sliding, slideMs]);

  // Die Braille-Spur der Bauchrutsche: der Buchstabe wandert nach LINKS auf die Ziel-Position
  // zu (Johannes 14.07.: „auf der Braillezeile soll sich der Buchstabe nach links bewegen und
  // im richtigen Moment gedrückt werden"). Bewusst `aria-live="off"`: die Zeile wird NICHT
  // vorgelesen (das wäre bei 10 Aktualisierungen je Sekunde unerträglich) — sie ist die
  // taktile Spur; gesprochen wird der Takt über Ticks und Zielton.
  useEffect(() => {
    if (!sliding || slideMs === null || !trackRef.current) return;
    const cellsFromGoal = Math.max(
      0,
      Math.min(SLIDE_TRACK_CELLS - 1, Math.round((1 - slideEl / slideMs) * (SLIDE_TRACK_CELLS - 1))),
    );
    const glyph = spots[pos + 1]?.unit ?? "?";
    const cells = Array.from({ length: SLIDE_TRACK_CELLS }, (_, i) =>
      i === cellsFromGoal ? glyph : i === 0 ? "|" : "·",
    );
    trackRef.current.textContent = cells.join("");
  }, [slideEl, sliding, slideMs, spots, pos]);

  // (Kein wiederkehrender Tab-Nudge mehr — die Hinweis-Taste wird EINMAL in der
  // Zonen-Erklärung genannt (Tagebuch/Intro), danach nicht mehr. Johannes 13.07.)

  // --- Rückenwind-Musikschicht (§4.8): leise Klangschicht, die mit dem Meter schwillt ---
  // Nur während gespielt wird; beim Zielerreichen/Scheitern/Schließen fährt sie zurück.
  useEffect(() => {
    setTailwindLevel(open && hasStations && !won && !fail ? tailwind : 0);
  }, [tailwind, open, hasStations, won, fail]);

  // --- Bonus-Fisch (nur Wasser): Fangzeit, Abtauchen -----------------------------
  useEffect(() => {
    if (!fishJump || won || fail || gliding) return;
    const id = window.setInterval(() => {
      setFishLeft((f) => (isSpeaking() ? f : Math.max(0, f - TICK_MS)));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [fishJump, won, fail, gliding]);

  useEffect(() => {
    if (!fishJump || fishLeft > 0) return;
    setRings(pts[fishJump.spot]?.x ?? null);
    setFishJump(null);
    later(() => setRings(null), 900);
    const target = spots[pos + 1];
    if (target?.unit) say(S.weiter(spokenSeq(unitSeq(target.unit), sprache)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fishLeft, fishJump]);

  // --- Ankunft am Ziel -----------------------------------------------------------
  const arriveFinish = useCallback(() => {
    setWon(true);
    setPose("cheer");
    setFishJump(null);
    stopIce();
    playArrive();
    // `clean` (= Polarlicht-Bedingung): die Zone wurde nie von vorn begonnen — beide Herzen
    // sind nie zugleich verbraucht worden. `flawless` (= die Ansage „fehlerfrei"): KEIN
    // einziger Fehler, weder Fehlgriff noch abgelaufene Zeit. Bis 14.07. zählte nur der
    // Zeit-Ablauf, weshalb das Spiel nach beliebig vielen Tippfehlern „fehlerfrei" lobte.
    const clean = restartsRef.current === 0;
    const flawless = missesRef.current === 0;
    const fish = fishCaughtRef.current;
    // Polarlicht (§4.6): NICHT mehr pro Zone — der Journey-Orchestrator (E7) zündet es
    // erst am Ende der GESAMTEN Reise, und nur bei durchweg fehlerfreiem Lauf.
    const fischSatz = fish > 0 ? S.fische(isAdult, fish) : "";
    say(
      free
        ? (isAdult ? T.winAdult() : T.winKid(flawless)) + fischSatz
        : S.torGeschafft(isAdult),
    );
    if (free) {
      onFinished?.({ clean, flawless, fish });
    } else {
      later(onWin, 1500);
    }
  }, [free, isAdult, later, onWin, onFinished, say, T, S]);

  // --- Weiter zur nächsten Station -----------------------------------------------
  const hop = useCallback(
    (i: number) => {
      const from = spots[pos];
      const nextPolster =
        from?.kind === "station" && !noTimePressure ? advancePolster(polster, "cleared") : polster;
      setPolster(nextPolster);
      setPose(cfg.movePose);
      cfg.hopSound();
      setFishJump(null);
      later(() => setPose((p) => (p === cfg.movePose ? cfg.standPose : p)), JUMP_POSE_MS);
      setPos(i);
      setSeqPos(0);
      resetSlide(); // Bauchrutsche: der nächste Buchstabe fliegt frisch los
      const nextWindow = windowFor(i, nextPolster);
      setRemaining(nextWindow ?? 0);
      warnedRef.current = 0;
      keyFailsRef.current = 0;
      // Polarstation: das nächste Wort startet frisch (Reihenfolge-Stand + Fehlgriffe neu).
      if (zone === "station") resetGuess();

      const next = spots[i + 1];
      if (!next) return;
      // ⚠️ Nur das ZIEL beendet die Reise. Ein Rastplatz zwischen zwei Etappen
      // trägt ebenfalls `unit === null` — bis 28.08.2026 hielt der Pinguin ihn
      // für die Ziel-Insel, jubelte dort und das Spiel war aus, obwohl noch
      // Stationen kamen. Gemeldet von Testerin (Marburg) am 28.08.: „größere Lücken
      // zwischen den Schollen … es sieht aus, als würde es weitergehen".
      // Betroffen war JEDE ZWEITE Freischaltung (buildGateCourse baute bei
      // ungerader Tastenzahl drei Etappen).
      if (next.kind === "rest") {
        // Auf den Rastplatz hüpfen und von dort weiterspielen.
        setGliding(true);
        later(() => {
          cfg.hopSound();
          setPose(cfg.movePose);
          setPos(i + 1);
          later(() => {
            setGliding(false);
            const danach = spots[i + 2];
            if (danach?.unit) announceTarget(danach.unit);
          }, GLIDE_MS);
        }, JUMP_POSE_MS);
        return;
      }
      if (next.unit === null) {
        // Nach der letzten Station noch ein Sprung auf die Ziel-Insel (Iglu bzw. Gipfel/
        // Zuhause) — nicht auf der letzten Stufe stehen bleiben (Johannes 13.07.): kurz dort
        // landen, dann ans Ziel hüpfen und erst DORT jubeln.
        setGliding(true);
        later(() => {
          cfg.hopSound();
          setPose(cfg.movePose);
          setPos(i + 1); // ans Ziel (Iglu/Gipfel/Zuhause)
          later(() => {
            setGliding(false);
            arriveFinish();
          }, GLIDE_MS);
        }, JUMP_POSE_MS);
        return;
      }
      // Höhle: das Wesen raunt die nächste Taste (Monster + Live-Region), sonst normal.
      announceTarget(next.unit);
      // Bonus-Fisch nur im Wasser (climb/slide tragen keine `fish`-Marke).
      if (spots[i].fish && free && zone === "water") {
        const fishUnit = pickFishUnit(units, next.unit, i);
        if (fishUnit) {
          later(() => {
            setFishJump({ unit: fishUnit, spot: i });
            // Der Fisch bleibt genau so lange, wie die Scholle trägt: Fisch und Eis laufen
            // auf DERSELBEN Uhr (Johannes 14.07.). Vorher hatte der Fisch starre 4 s, während
            // das Zeitfenster der Scholle je nach Tempo des Kindes viel kürzer sein konnte —
            // der Fisch erschien gefühlt „viel zu spät", das Eis brach „zu schnell weg".
            setFishLeft(nextWindow ?? FISH_MS_GENTLE);
            playFishSong(fishUnit);
            // Beim ERSTEN Fisch die volle Ansage, danach nur noch der Buchstabe (Johannes 13.07.).
            const firstFish = !fishAnnouncedRef.current;
            fishAnnouncedRef.current = true;
            sayFish(S.fischSpringt(isAdult, firstFish, spoken(fishUnit, sprache)));
          }, FISH_SPAWN_MS);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spots, pos, polster, noTimePressure, units, free, isAdult, later, say, arriveFinish, windowFor, cfg, zone, resetGuess, sprache, S],
  );
  hopRef.current = hop; // Spiegel für `skipStation` (PUNKT 7/8), s. Kommentar bei `hopRef`.

  // --- Polarstation (§4.5, Anagramm/Scrabble-Stil): senden, Hinweis-Taste, Eingabe --

  /**
   * Wort gelöst (Johannes 13.07.): Funkwellen + Empfangsstärke-Rückmeldung, das fertige
   * Wort bleibt kurz STEHEN und wird VORGELESEN (jetzt darf es genannt werden — es ist
   * gelöst), erst dann geht es weiter. `solving` sperrt die Tastatur währenddessen.
   */
  const completeWord = useCallback(
    (word: string) => {
      clearHelp();
      solvingRef.current = true;
      setSolving(true);
      setSentPulse((n) => n + 1);
      const s = signalFor(guessMissRef.current);
      // Welche Stimme das gelöste Wort bekommt, steht in {@link stationWordLang}
      // (Inhalt DES LERNWEGS, nicht der Bedienungssprache - siehe dort).
      if (bereichAktiv && sprache !== "de" && voiceEnabled) {
        speakQueued(isAdult ? `${word}.` : `${word}!`, stationWordLang(lernweg));
        speakQueued(S.gesendet(isAdult, S.signal(s)), sprache);
      } else {
        say(S.wortGesendet(isAdult, word, S.signal(s)));
      }
      later(playFamilyJingle, FAMILY_REPLY_MS);
      later(() => hop(pos + 1), STATION_SOLVED_MS); // 1 s stehen lassen + vorlesen, dann weiter
    },
    [clearHelp, say, isAdult, later, hop, pos, bereichAktiv, sprache, voiceEnabled, S, lernweg],
  );

  /**
   * Hinweis-Taste (Tab): setzt den NÄCHSTEN fehlenden Buchstaben (in Wort-Reihenfolge) —
   * für den Fall, dass man das Anagramm nicht knackt (Johannes 13.07.). Kostet
   * Empfangsstärke. Sagt Buchstabe + Finger-Tipp an; löst das Wort ggf. fertig.
   */
  const revealHint = useCallback(() => {
    if (won || gliding || solvingRef.current) return;
    const word = spots[pos + 1]?.unit;
    if (!word) return;
    const wordLower = kleinFuer(word, lernweg);
    const wordLen = [...word].length;
    const typed = guessTypedRef.current;
    if (typed.length >= wordLen) return;
    // PUNKT 5: Der Hinweis folgt der noch ERREICHBAREN Lösung — bevorzugt dem „gedachten"
    // Wort, sonst der ersten anderen, die zum bisher Getippten passt (bei freier
    // Reihenfolge kann das gedachte Wort selbst nicht mehr erreichbar sein, wenn das Kind
    // schon auf eine andere echte Lösung zusteuert — s. `stationSolutions`).
    const reachable = stationSolutions.filter((c) => c.length === wordLen && c.startsWith(typed));
    const basis = reachable.includes(wordLower) ? wordLower : (reachable[0] ?? wordLower);
    const ch = basis[typed.length];
    guessMissRef.current += 1; // Hilfe kostet Signal
    setGuessMiss(guessMissRef.current);
    playRadioHint();
    const attemptTyped = typed + ch;
    guessTypedRef.current = attemptTyped;
    setGuessTyped(attemptTyped);
    if (attemptTyped.length >= wordLen) {
      setSeqPos(seqPos + 1);
      completeWord(attemptTyped === wordLower ? word : attemptTyped);
      return;
    }
    setSeqPos(seqPos + 1);
    say(
      isAdult
        ? `${spoken(ch, sprache)}.`
        : S.naechsterBuchstabe(
            spoken(ch, sprache),
            FINGER_HINWEIS[sprache](kleinFuer(ch, lernweg), lernweg),
          ),
    );
  }, [won, gliding, spots, pos, seqPos, isAdult, say, completeWord, sprache, S, stationSolutions, lernweg]);

  /**
   * Eingabe der Polarstation (Anagramm/Scrabble-Stil): das Wort wird in RICHTIGER
   * Reihenfolge getippt (die Buchstaben liegen durcheinander sichtbar da). Richtiger
   * nächster Buchstabe → Slot füllt sich (Funk-Pieps); falscher → Wackeln + Signal runter
   * (KEIN Scheitern); Tab → Hinweis. Alt-Kürzel bleiben durch (§7). Während das gelöste
   * Wort steht (`solving`), sind Tasten gesperrt.
   */
  const handleStationKey = useCallback(
    (e: React.KeyboardEvent) => {
      // Alt-Kürzel der Seite durchlassen - AltGr aber ist ein Zeichen (09.10.2026: Option + A
      // ergibt am Mac „Polish - Pro" das „ą"; vorher ging es hier still verloren).
      if (istKuerzel(e)) return;
      e.preventDefault();
      e.stopPropagation();
      if (solvingRef.current) return; // gelöstes Wort steht/wird vorgelesen
      if (e.key === "Tab") {
        revealHint();
        return;
      }
      if (e.key.length !== 1) return; // Enter/Pfeile/… überhören (kein Fehlerton)
      const word = spots[pos + 1]?.unit;
      if (!word) return;
      const wordLower = kleinFuer(word, lernweg);
      const wordLen = [...word].length;
      const key = kleinFuer(e.key, lernweg);
      const typed = guessTypedRef.current;
      const attemptTyped = typed + key;
      // PUNKT 5: NICHT mehr „passt der Buchstabe zum EINEN gedachten Wort an DIESER
      // Stelle", sondern „führt er zu IRGENDEINER echten Lösung aus genau diesen
      // Buchstaben" (`stationSolutions`). Bei ASG zählt SAG damit ebenso wie GAS - das
      // Kind hat recht, egal welches der beiden Wörter es findet.
      const stillPossible = stationSolutions.filter((c) => c.length === wordLen && c.startsWith(attemptTyped));
      if (stillPossible.length > 0) {
        merkeTreffer(pos);
        playRadioBeep(); // Funk-Pieps je richtig gesetztem Buchstaben (§4.5)
        noteBeat(true); // gleichmäßiges Funken → Rückenwind (§4.8)
        clearHelp();
        guessTypedRef.current = attemptTyped;
        setGuessTyped(attemptTyped);
        if (attemptTyped.length >= wordLen) {
          setSeqPos(seqPos + 1);
          completeWord(attemptTyped === wordLower ? word : attemptTyped);
        } else {
          setSeqPos(seqPos + 1);
        }
      } else if (
        // 02.10.2026 (Lehrkraft, echte Klasse; Entscheidung Johannes): Ein Buchstabe, der
        // im Wort vorkommt und schon so oft getippt wurde, wie er vorkommt, ist KEIN
        // Fehlgriff - nur ein Hinweis, kein Herz. Bei „Klasse" ist das zweite S richtig
        // (führt zu einer Lösung, steht oben), ein drittes S ist „schon da". Alle Lösungen
        // (Anagramme) haben dieselben Buchstaben, die Zählung gilt darum für jede.
        zaehlt(wordLower, key) > 0 &&
        zaehlt(typed, key) >= zaehlt(wordLower, key)
      ) {
        const satz = grossAnfang(S.schonDa(isAdult, spoken(key, sprache)), sprache);
        zeigeHinweis(satz); // auch sichtbar - siehe `hinweis`
        say(satz);
      } else {
        // Falscher Buchstabe → Wackeln, Empfangsstärke runter UND ein Herz weg (Johannes
        // 14.07.). Vorher war der Fehlgriff hier folgenlos — man konnte das Anagramm
        // durch Durchprobieren aller Tasten „lösen". Die Tab-Taste bleibt der faire
        // Ausweg: sie verrät einen Buchstaben und kostet nur Empfangsstärke, kein Herz.
        // (e.key ist hier nie „Shift" — das hat Länge 5 und wurde oben schon abgefangen.)
        merkeFehlgriff(pos, e.key, word);
        setWobble((n) => n + 1);
        guessMissRef.current += 1;
        setGuessMiss(guessMissRef.current);
        loseLife("miss");
      }
    },
    [spots, pos, seqPos, clearHelp, completeWord, revealHint, loseLife, noteBeat, stationSolutions, lernweg, merkeTreffer, merkeFehlgriff, zeigeHinweis, say, isAdult, sprache, S],
  );

  /**
   * Eingabe der Bauchrutsche (Rhythmus): Der Buchstabe zählt nur IM MOMENT der Ziellinie —
   * also im Trefferfenster, das der Zielton ankündigt. Zu früh gedrückt (der Buchstabe ist
   * noch weit weg), zu spät (er ist vorbei — das erledigt die Anflug-Uhr) oder die falsche
   * Taste: jedes Mal ein Herz. Ohne Zeitdruck (`slideMs === null`) gilt der Treffer wie
   * früher jederzeit — Zeitlimits müssen abschaltbar bleiben (WCAG, §7).
   */
  const handleSlideKey = useCallback(
    (e: React.KeyboardEvent) => {
      const wanted = spots[pos + 1]?.unit ?? null;
      if (!wanted) return;
      // Der Buchstabe ist erst „unterwegs", wenn die Anflug-Uhr WIRKLICH läuft (Johannes
      // 15.07.: „erst Tasten und Fehler, wenn der Buchstabe schon unterwegs ist — ich habe
      // Leben verloren, ohne dass es losging"). Solange die Ansage noch spricht (die Uhr
      // pausiert bei `isSpeaking`) oder der Anflug noch bei 0 steht, zählt KEINE Taste —
      // weder Treffer noch Fehlgriff noch „zu früh". Erst wenn der Buchstabe losgeflogen
      // ist, greift das Timing unten. (Ohne Zeitdruck, `slideMs === null`, gilt jederzeit.)
      // ★ 29.10.2026 (Lehrerin Zürich): Ist der Buchstabe schon im Tor (der Zielton ist erklungen)
      // und setzt DANN erst eine Ansage ein, ist er trotzdem unterwegs gewesen - die Uhr steht
      // nur, weil die Stimme spricht. Die richtige Taste zählt dann wie sonst (Grundregel: ein
      // Druck im Tor ohne Antwort ist eine kaputte Tastatur). „Noch nicht" gilt nur davor.
      const imTor = slideMs !== null && slideElRef.current >= slideMs - SLIDE_HIT_MS;
      if (slideMs !== null && (slideElRef.current <= 0 || (isSpeaking() && !imTor))) {
        // ★★★★★ ABER NICHT STILL (Testerin, 04.09.2026): *„Es ist irgendwie nicht
        // klar gewesen, wann man den Buchstaben drückt. Da kam keine
        // Rückmeldung, wenn man gedrückt hat."* Hier stand ein blankes
        // `return` - kein Ton, keine Meldung, kein Herz, gar nichts. Dass die
        // Taste KEINEN Schaden anrichtet, war richtig; dass sie keine ANTWORT
        // bekam, war der Fehler. Für ein Kind mit Blindheit ist ein
        // folgenloser Tastendruck nicht von einer kaputten Tastatur zu
        // unterscheiden - und der Schüler hört auf zu drücken, weil er glaubt,
        // es komme nicht an.
        // Die RICHTIGE Taste ist ein Versuch (zählt für „wirklich versucht" -> Überspringen mit
        // Enter / nach zwei Neustarts), auch wenn sie hier noch nicht zählen kann. Eine falsche
        // Taste (Leertaste …) bleibt kein Versuch.
        if (floeKeyMatches(e.key, wanted)) merkeTreffer(pos);
        const satz = S.nochNicht(isAdult);
        playSlideNotYet();
        // ★★★ Drei Wege, damit KEIN Kind leer ausgeht: der Ton (fällt bei „Ton
        // aus" weg), die sichtbare Statuszeile (für sehende Kinder - der einzige
        // Weg, der ohne Ton und ohne Vorlesen trägt) und die Stimme bzw. die
        // sr-only-Region über `say`.
        zeigeHinweis(satz);
        // Gesprochen nur, wenn gerade nichts spricht: Sonst schnitte der
        // Hinweis genau die Ansage ab, die dem Kind sagt, welcher Buchstabe
        // kommt - und der Hinweis wäre teurer als das Schweigen.
        if (!isSpeaking()) say(satz);
        return;
      }
      /*
       * ★★★★★ DIE UMSCHALTTASTE IST KEIN FEHLGRIFF (20.09.2026, Johannes nach
       * Testerin Durchgang, wörtlich): *„Die Schneerutsche habe ich wieder nicht
       * geschafft … Er wollte das °-Zeichen. Vielleicht war das allein das
       * Problem, weil ich dafür ja zwei Tasten drücken muss und ich Umschalt
       * immer etwas früher drücke?!"*
       *
       * Genau das war es, und es war nicht sein Fehler: Für „°" (⇧ + ^) kommt
       * ZUERST ein eigenes Tasten-Ereignis mit `e.key === "Shift"`. Das passt
       * auf kein Ziel - und hier stand bisher ohne Ausnahme „Herz weg,
       * Anflug zurücksetzen". Jedes Zeichen, das eine Umschalt-Kombination
       * braucht, war in dieser Zone damit unschaffbar, ganz gleich wie genau
       * jemand trifft. Der Zonen-Handler (`handleKey`) und die Polarstation
       * (`handleStationKey`) kennen die Ausnahme seit jeher - der Rutsche
       * fehlte sie.
       *
       * Die Umschalttaste zählt hier also weder als Treffer noch als Fehler -
       * ausser sie IST das Ziel (Einheit „⇧"), dann greift `floeKeyMatches`
       * oben und alles läuft wie gehabt.
       */
      /*
       * ★★★ E4 (25.09.2026) → W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8): die
       * Totaste ist KEIN Fehlgriff mehr, auch wo das Ziel keine erwartet -
       * bewertet wird erst das fertige Zeichen (`deuteAnschlag`, dieselbe
       * Deutung wie in der Übungszeile). Nur Totaste + nicht zusammensetzbarer
       * Buchstabe („^p") und eine leere AltGr-Ebene kosten ein Herz.
       */
      const istTastaturMitTotasten = hatLehrgangsTotasten(activeLayoutId());
      let key = e.key;
      if (istTastaturMitTotasten) {
        const { deutung, offen } = deuteAnschlag(anschlagAus(e), offeneTotasteRef.current, activeLayout());
        offeneTotasteRef.current = offen;
        if (deutung.art === "totaste") return; // Zwischenzustand
        if (deutung.art === "fehlgriff") {
          merkeFehlgriff(pos, e.key, wanted);
          resetSlide();
          loseLife("miss");
          return;
        }
        if (deutung.art === "zeichen") key = deutung.zeichen;
      }
      if (key === "Shift" && wanted !== SHIFT_UNIT) return;
      if (!floeKeyMatches(key, wanted)) {
        merkeFehlgriff(pos, key, wanted);
        resetSlide();
        loseLife("miss");
        return;
      }
      merkeTreffer(pos); // die richtige Taste gefunden - auch wenn sie gleich als „zu früh" gilt
      if (slideMs !== null && slideElRef.current < slideMs - SLIDE_HIT_MS) {
        // Zu früh: der Buchstabe ist noch nicht an der Ziellinie.
        resetSlide();
        const zuFrueh = S.zuFrueh(isAdult);
        zeigeHinweis(zuFrueh); // auch sichtbar - siehe `hinweis`
        say(zuFrueh);
        loseLife("miss");
        return;
      }
      noteBeat(true);
      resetSlide();
      hop(pos + 1);
    },
    [spots, pos, slideMs, resetSlide, loseLife, say, zeigeHinweis, isAdult, noteBeat, hop, S, merkeTreffer, merkeFehlgriff],
  );

  // --- Tastatur ------------------------------------------------------------------
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (won || fail || gliding) return;
      /**
       * PUNKT 7 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Es beginnt dann
       * gnadenlos immer wieder von vorne. Es wäre gut, wenn ich eine Station nicht
       * verstehe, dass ich die überspringen kann. Ansonsten muss ich komplett beenden."
       *
       * Die EINGABETASTE dafür: Sie ist in JEDER Zone und an JEDER Station wirkungslos —
       * kein Kurs-Zeichen ist je „Enter" (die Zeichen sind Buchstaben/Ziffern/Satzzeichen
       * oder „⇧"), `floeKeyIgnored` liess sie bisher unberührt durch, und auch die
       * Polarstation überhört sie schon lange („Enter/Pfeile/… überhören" in
       * `handleStationKey`) — sie war also schon vorher an KEINER Stelle ein Fehlgriff.
       * Genau darum ist sie frei dafür, ohne irgendein Tippen zu stören. Alt-/Strg-/
       * Cmd-Kombis bleiben aussen vor (die gehören der Seite, s. `floeKeyIgnored`).
       *
       * Nicht während das gelöste Wort der Polarstation noch steht (`solvingRef`) — der
       * nächste Schritt kommt da ohnehin gleich von selbst.
       */
      if (e.key === "Enter" && !e.altKey && !e.ctrlKey && !e.metaKey) {
        if (solvingRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        // 02.10.2026: erst wenn an dieser Station wirklich etwas versucht wurde. Sonst ein
        // freundlicher Hinweis (sichtbar UND gesprochen), kein Herzabzug, keine Wertung.
        if (!wirklichVersucht(versucheRef.current.get(pos))) {
          const satz = S.erstSelbst(isAdult);
          zeigeHinweis(satz);
          if (!isSpeaking()) say(satz);
          return;
        }
        skipStation();
        return;
      }
      // Polarstation: eigenes Wort-Raten (Tab-Hinweis, Fehlgriff ohne Scheitern) — VOR
      // floeKeyIgnored, damit die Tab-Hinweis-Taste hier greift (Tab ist kein Zeichen).
      if (zone === "station") {
        handleStationKey(e);
        return;
      }
      /*
       * ★ E4 (25.09.2026, Bauplan §4.3 Punkt 5, §14 E4): `floeKeyIgnored`
       * verschluckt „Dead" heute wie jede andere Sondertaste (Länge ≠ 1,
       * nicht „Shift") - richtig für de/en (byte-für-byte unverändert), aber
       * genau darum kämen weder die Wasser- noch die Rutschen-Totasten-Prüfung
       * unten je zum Zug. Auf FRANZÖSISCHEN Tastaturen lässt dieser Zweig
       * „Dead" (und seit W1 den Anschlag nach einer offenen Totaste,
       * `offeneTotasteRef`) darum gezielt durch - alles andere bleibt wie
       * gehabt gefiltert.
       */
      const istTastaturMitTotasten = hatLehrgangsTotasten(activeLayoutId());
      // ★ W1: dazu der Anschlag NACH einer offenen Totaste (er entscheidet sie).
      const totastenDurchlass =
        istTastaturMitTotasten && (e.key === "Dead" || offeneTotasteRef.current !== null);
      if (floeKeyIgnored(e) && !totastenDurchlass) return; // Alt-Kürzel/Steuertasten durchlassen (§7)
      e.preventDefault();
      e.stopPropagation();
      const target = spots[pos + 1];
      if (!target || target.unit === null) return;
      // Bauchrutsche: eigenes Timing-Spiel (Treffer nur im Moment der Ziellinie).
      if (zone === "slide") {
        handleSlideKey(e);
        return;
      }
      // Sturm: erst tippen, wenn die Tafel VERWEHT ist (Johannes 13.07.) — solange sie
      // noch steht, wird die Eingabe überhört (kein Fehlerton, kein Fortschritt), sonst
      // hätten Sehende einen Vorteil (abschreiben). Merken gilt für alle gleich (§4.4).
      if (zone === "storm" && showSeqRef.current !== null) return;
      // Sturm: die Folge kommt LAUFZEIT-adaptiv aus `stormTarget` (nicht aus dem
      // Platzhalter-Unit des Kurses); sonst die Stations-Folge.
      const seq = zone === "storm" ? [...stormTarget] : unitSeq(target.unit);
      if (seq.length === 0) return; // Sturm: Folge noch nicht erzeugt (Merkphase)
      // Bonus-Fisch fangen (nur Wasser; Zeichen ist nie das Stations-Ziel → eindeutig).
      if (fishJump && floeKeyMatches(e.key, fishJump.unit)) {
        playFishCatch();
        fishCaughtRef.current += 1;
        setRings(pts[fishJump.spot]?.x ?? null);
        setFishJump(null);
        later(() => setRings(null), 900);
        say(S.gefangen(isAdult, spoken(seq[seqPos] ?? "", sprache)));
        return;
      }
      const wanted = seq[seqPos];

      // Fehlgriff — kostet ein Herz (in JEDER Zone). Eigene Funktion, weil
      // seit E4 zwei Stellen sie brauchen (der gewöhnliche Fehlgriff unten
      // UND der Totasten-Fehlgriff, siehe dort).
      const registriereFehlgriff = (taste: string) => {
        merkeFehlgriff(pos, taste, wanted ?? "");
        if (zone === "storm") {
          // Schneesturm (Johannes 15.07.: „wenn man bei der Merk-Station einen Fehler macht,
          // müssen die Buchstaben noch einmal gezeigt und angesagt werden"): ein Herz weg UND
          // die Merkfolge erneut einblenden + vorlesen, damit das Kind sie sich neu einprägen
          // kann (sie verweht dann wieder von selbst). Die Steigerung bleibt nach einem Fehler
          // aus. Bei null Herzen beginnt die Zone von vorn — dort zeigt restartAt die Folge neu.
          stormCleanRef.current = false;
          keyFailsRef.current += 1;
          loseLife("miss");
          if (livesRef.current > 0 && stormTarget) {
            setSeqPos(0);
            showStormSeq(
              stormTarget,
              true,
              STORM_MEMORIZE_BASE + stormTarget.length * STORM_MEMORIZE_PER,
            );
          }
          return;
        }
        keyFailsRef.current += 1;
        loseLife("miss");
      };

      /*
       * ★★★ E4 (25.09.2026, Bauplan §4.3 Punkt 5, §14 E4): dieselbe Ausnahme
       * wie für die Umschalttaste unten, jetzt für „Dead" - NUR auf
       * Tastaturen mit Lehrgangs-Totasten (`istTastaturMitTotasten`, oben
       * schon bestimmt - derselbe Wert, der auch `floeKeyIgnored` umgeht).
       * Die zweite Hälfte eines schon gezählten Totasten-Fehlgriffs wird
       * zuerst verschluckt.
       */
      // ★ W1 (27.09.2026): dieselbe Deutung wie in der Schneerutsche oben -
      // die Totaste wartet, erst das fertige Zeichen zählt.
      let key = e.key;
      if (istTastaturMitTotasten) {
        const { deutung, offen } = deuteAnschlag(anschlagAus(e), offeneTotasteRef.current, activeLayout());
        offeneTotasteRef.current = offen;
        if (deutung.art === "totaste") return; // Zwischenzustand
        if (deutung.art === "fehlgriff") {
          registriereFehlgriff(e.key);
          return;
        }
        if (deutung.art === "zeichen") key = deutung.zeichen;
      }

      if (wanted && floeKeyMatches(key, wanted)) {
        merkeTreffer(pos);
        noteBeat(true); // gleichmäßiger Anschlag → Rückenwind (§4.8)
        if (seqPos + 1 >= seq.length) {
          hop(pos + 1); // Folge komplett → weiter
        } else {
          setSeqPos((s) => s + 1); // Teilfortschritt innerhalb der Station
          keyFailsRef.current = 0;
        }
      } else if (key !== "Shift" || wanted === SHIFT_UNIT) {
        registriereFehlgriff(key);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spots, pos, seqPos, won, fail, gliding, fishJump, hop, isAdult, later, say, zone, stormTarget, loseLife, handleStationKey, handleSlideKey, showStormSeq, sprache, S, skipStation, zeigeHinweis, merkeTreffer, merkeFehlgriff],
  );

  const restart = useCallback(() => setRun((r) => r + 1), []);

  // --- Abgeleitete Anzeige-Werte -------------------------------------------------
  // Die Scholle sinkt LANGSAMER (Johannes 15.07.: „Das Absinken muss langsamer passieren beim
  // Packeis"): ease-OUT (Exponent > 1) — sie bleibt den Großteil der Zeit oben und sackt erst
  // gegen Ende zügig weg, statt gleich zu Beginn stark abzukippen. So wirkt der Untergang
  // gemächlicher; die Dringlichkeit trägt weiter das anschwellende Eisknacken.
  const sinkFrac = timed && curWindow && zone === "water" ? Math.max(0, 1 - remaining / curWindow) : 0;
  const sinkOffset = sinkFrac > 0 ? Math.pow(sinkFrac, 1.8) * 46 : 0;
  // Dringlichkeits-Signal (Steinchen an der Steilwand / pochendes Echo in der Höhle).
  const cracking =
    timed && curWindow
      ? (zone === "climb" || zone === "cave") && 1 - remaining / curWindow >= ROCK_WARN_AT[0]
      : false;
  const penguinX = pts[pos]?.x ?? 0;
  const penguinY = (pts[pos]?.y ?? cfg.groundY) + (fail ? cfg.failDropY : 0) + (cur?.kind === "station" ? sinkOffset : 0);
  const camTarget = Math.max(0, Math.min(worldW - VIEW_W, penguinX - VIEW_W * 0.36));
  const timerPct = timed && curWindow ? Math.max(0, Math.min(100, (remaining / curWindow) * 100)) : 100;

  const fish = fishJump
    ? {
        glyph: fishJump.unit === SHIFT_UNIT ? "⇧" : fishJump.unit,
        x: (pts[fishJump.spot]?.x ?? 0) + 150,
        y: PACKEIS_GROUND_Y - 24,
      }
    : null;

  const nextName = spokenSeq(targetSeq, sprache);
  const stationWord = zone === "station" ? (spots[pos + 1]?.unit ?? "") : "";
  // Ein frischer Hinweis geht der gewohnten Zeile VOR - aber nie einem Zustand,
  // der wichtiger ist als er (gewonnen, gescheitert, Gleitflug).
  const statusText = !won && !fail && !gliding && hinweis
    ? hinweis
    : won
    ? free
      ? isAdult
        ? T.winAdult()
        : T.winKid(missesRef.current === 0) // „fehlerfrei" nur ohne JEDEN Fehler (14.07.)
      : S.torStatus(isAdult)
    : fail
      ? S.zurueck(isAdult)
      : gliding
        ? "…"
        : zone === "station"
          ? // Wort-Raten: die sichtbare Zeile nennt NIE das Wort — nur Länge + aktueller
            // Rate-Stand (aufgedeckte Buchstaben, sonst „Lücke"; §4.5/§7).
            // Anagramm: durcheinander gewürfelte Buchstaben + der bisher getippte Anfang;
            // das fertige Wort erst, wenn es gelöst ist (`solving`) — nie vorher (§7).
            (() => {
              const step = spots[targetIdx]?.step ?? 1;
              const of = spots[targetIdx]?.of ?? STATION_WORDS;
              // PUNKT 5: „Bisher" nennt die TATSÄCHLICH getippten Buchstaben (`guessTyped`)
              // — nie mehr den Präfix des „gedachten" Wortes. Seit auch andere echte Wörter
              // aus denselben Buchstaben zählen, könnten die beiden auseinanderlaufen, und
              // eine falsche Ansage würde behaupten, das Kind habe etwas anderes getippt,
              // als es wirklich getan hat (Hausregel „nie etwas gegen ein Kind").
              if (solving) return S.wortFertig(guessTyped);
              const mixed = spokenSeq(scrambleLetters(kleinFuer(stationWord, lernweg)), sprache);
              const typed = guessTyped.length > 0 ? S.bisher(spokenSeq([...guessTyped], sprache)) : "";
              return S.stationStatus(step, of, mixed, typed);
            })()
          : cur?.kind === "shore"
            ? T.startText(isAdult, nextName)
          : fishJump
            ? S.fischStatus(isAdult, spoken(fishJump.unit, sprache))
            : zone === "cave"
              ? // Blindschreiben: die sichtbare Zeile nennt NIE das Zeichen (nur Klang/Braille).
                S.hoehleStatus(T.noun, cur?.step ?? 0, cur?.of ?? 0, hoehleMitWesen)
              : zone === "storm"
                ? // Merken (Bauplan §7, texts.ts): Die Tafel verweht — die sichtbare Zeile
                  // darf die Folge darum NIE nennen. Sie nannte hier bis 27.07. sogar eine
                  // FALSCHE Folge (den Platzhalter aus `buildStormCourse`, nicht die vom
                  // Hook gewürfelte `stormTarget`): Wer sie ablas und tippte, verlor ein Herz.
                  // Stattdessen nur der Stand — wie weit die Folge schon getippt ist, zeigt
                  // die Tafel selbst (`typedSeq`), die Ansage/Braillezeile hat sie genannt.
                  S.sturmStatus(T.noun, cur?.step ?? 0, cur?.of ?? 0, seqPos, stormTarget.length)
                : S.folgeStatus(T.noun, cur?.step ?? 0, cur?.of ?? 0, targetSeq.length > 1, nextName);

  return {
    ready: hasStations,
    zone,
    pos,
    targetIdx,
    seqPos,
    showSeq,
    seqLen: zone === "storm" ? stormTarget.length : targetSeq.length,
    // PUNKT 5: die Polarstation liefert hier die TATSÄCHLICH getippten Buchstaben
    // (`guessTyped`) — nicht mehr den Präfix des „gedachten" Wortes, der seit den
    // mehreren gültigen Lösungen davon abweichen kann.
    typedSeq:
      zone === "storm"
        ? [...stormTarget].slice(0, seqPos).join("")
        : zone === "station"
          ? guessTyped
          : targetSeq.slice(0, seqPos).join(""),
    stationWord,
    scrambled: zone === "station" ? scrambleLetters(kleinFuer(stationWord, lernweg)) : [],
    signal: signalFor(guessMiss),
    solved: solving,
    sentPulse,
    wobble,
    penguin: { x: penguinX, y: penguinY, pose },
    camTarget,
    worldW,
    spots,
    pts,
    sunk: fail && zone === "water",
    sinkOffset,
    cracking,
    timed,
    timerPct,
    fish,
    rings,
    won,
    aurora: false, // per-Zone kein Polarlicht mehr — der Journey zündet es am Ende (§4.6)
    tailwind,
    lives,
    livesMax: ZONE_LIVES,
    slideLetter: zone === "slide" && !won && !fail ? (spots[pos + 1]?.unit ?? null) : null,
    slideProgress: slideMs !== null && slideMs > 0 ? slideEl / slideMs : 0,
    slideHot: slideMs !== null && slideEl >= slideMs - SLIDE_HIT_MS && slideEl <= slideMs + SLIDE_GRACE_MS,
    statusText,
    handleKey,
    restart,
    brailleRef,
    statusRef,
    trackRef,
  };
}
