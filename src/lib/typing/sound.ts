/**
 * Kurze, latenzarme Töne (Earcons) für den Tipptrainer — per Web Audio erzeugt,
 * ohne Audiodatei. Sie geben blitzschnelles Feedback, das ein Screenreader so
 * nicht leistet, und kollidieren nicht mit dessen Sprachausgabe:
 *   • Fehlerton bei falschem Anschlag (zusätzlich zur roten Markierung),
 *   • leiser Tick bei richtigem Anschlag (abschaltbar),
 *   • Erfolgs-Klang am Ende einer Übung.
 *
 * Stummschaltbar (in localStorage gemerkt) — in einer ruhigen Klasse kann der
 * Ton stören. Die visuelle Rückmeldung bleibt davon unberührt.
 */

import { keepAudioAlive } from "@/lib/audioUnlock";
import { lautstaerke, type LautstaerkeArt } from "./lautstaerke";

const MUTE_KEY = "tippen-sound-muted";
const KEYTICK_KEY = "tippen-keytick"; // Anschlag-Tick getrennt schaltbar

let muted = readBool(MUTE_KEY, false);
let keyTick = readBool(KEYTICK_KEY, false); // Tick standardmäßig AUS (kann nerven)
let ctx: AudioContext | null = null;

function readBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "1";
  } catch {
    return fallback;
  }
}

function writeBool(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* localStorage nicht verfügbar — egal */
  }
}

export function isSoundMuted(): boolean {
  return muted;
}
export function setSoundMuted(value: boolean): void {
  muted = value;
  writeBool(MUTE_KEY, value);
}
export function isKeyTickOn(): boolean {
  return keyTick;
}
export function setKeyTickOn(value: boolean): void {
  keyTick = value;
  writeBool(KEYTICK_KEY, value);
}

/**
 * Der EINE AudioContext dieses Moduls - auch die Melodie beim Tippen
 * (`melodie.ts`) spielt über ihn. Ein zweiter Context hiesse auf iOS eine
 * zweite Entsperrung, die nicht garantiert gelingt.
 */
export function tonKontext(): AudioContext | null {
  return audioContext();
}

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    keepAudioAlive(ctx); // iOS: Gesten-Entsperrung + Lautlos-Schalter-Trick
    return ctx;
  } catch {
    return null;
  }
}

/**
 * Einzelner kurzer Ton (Hilfsfunktion).
 *
 * ★ Die Lautstärke (17.10.2026): `art` sagt, welcher Regler im Menü unter dem
 * Lautsprecher-Schalter gilt (`lautstaerke.ts`). Bei 0 wird gar kein Ton
 * erzeugt - ein Oszillator mit Pegel 0,0001 wäre nur ein unnötiger Knoten.
 */
function tone(
  freqStart: number,
  freqEnd: number,
  dur: number,
  peak: number,
  type: OscillatorType = "sine",
  art: LautstaerkeArt = "toene",
): void {
  const faktor = lautstaerke(art);
  if (faktor <= 0) return;
  peak = Math.max(0.0002, peak * faktor);
  const ac = audioContext();
  if (!ac) return;
  try {
    if (ac.state === "suspended") void ac.resume();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    if (freqEnd !== freqStart)
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  } catch {
    /* Audio fehlgeschlagen — unkritisch */
  }
}

/** Tiefer, leicht absteigender Fehlerton („uh-oh"). */
export function playErrorSound(): void {
  if (muted) return;
  tone(196, 147, 0.2, 0.14, "sawtooth");
}

/** Sehr kurzer, leiser Tick bei richtigem Anschlag (nur wenn aktiviert). */
export function playKeyTick(): void {
  if (muted || !keyTick) return;
  tone(880, 880, 0.03, 0.045, "sine", "klick");
}

/**
 * Hörprobe für den Klick-Regler (Menü unter dem Lautsprecher-Schalter): derselbe
 * Klick wie beim Tippen, aber auch dann, wenn „Tipp-Klick" noch aus ist - wer
 * die Lautstärke einstellt, will hören, wie laut er sein WÜRDE. „Ton aus"
 * gilt weiter.
 */
export function playKeyTickProbe(): void {
  if (muted) return;
  tone(880, 880, 0.03, 0.045, "sine", "klick");
}

/** Aufsteigender, freundlicher Klang am Ende einer geschafften Übung. */
export function playSuccessSound(): void {
  if (muted) return;
  const ac = audioContext();
  if (!ac) return;
  // kleine aufsteigende Terz-Folge
  tone(523, 523, 0.12, 0.10, "triangle");
  setTimeout(() => tone(659, 659, 0.12, 0.10, "triangle"), 90);
  setTimeout(() => tone(784, 784, 0.18, 0.10, "triangle"), 180);
}

/** Kleine Melodie aus Einzeltönen (Frequenz, Startzeit ms, Dauer s, Lautstärke). */
function melody(
  seq: Array<[number, number, number, number?]>,
  type: OscillatorType = "triangle",
): void {
  for (const [freq, startMs, dur, peak] of seq) {
    if (startMs <= 0) tone(freq, freq, dur, peak ?? 0.06, type);
    else setTimeout(() => tone(freq, freq, dur, peak ?? 0.06, type), startMs);
  }
}

// --- Belohnungs-Sounddateien (optional, „Beides"-Variante) -------------------
// Echte, kostenlose Klänge für die große Belohnung. Liegt eine Datei unter
// public/sounds/<name>.mp3, ERSETZT sie die erzeugte Fanfare (kein Übereinander);
// fehlt sie (oder blockt der Browser), bleibt die Fanfare als sichere Grundlage.
// So lassen sich Sounds jederzeit austauschen, ohne Code zu ändern (siehe
// public/sounds/README.md). Vorab geladen, damit sie schon beim ersten Mal sitzt.
const fileEls: Record<string, HTMLAudioElement | null> = {};
const fileOk: Record<string, boolean | undefined> = {};

/**
 * ★★ Die Klangdateien, die es in `public/sounds/` WIRKLICH gibt (27.09.2026).
 *
 * Bis dahin lud das Modul auch `unlock`, `badge` und `storybadge` vor - die
 * gab es nie (kein Commit hat sie je angelegt). Der Server antwortete mit
 * `index.html` (200, 32 kB, `text/html`), der Browser meldete `error`, und es
 * spielte - wie gewollt - die erzeugte Fanfare. Hörbar war also nichts
 * anders; bezahlt hat jedes Kind beim ersten Besuch rund 0,1 MB umsonst
 * (gemessen: `BEFUND-2026-09-27-DATENVERBRAUCH-UND-NETZABBRUCH.md` §1).
 *
 * Nur was hier steht, wird angefragt - vorab UND beim Abspielen. Wer eine neue
 * Datei nach `public/sounds/` legt, trägt ihren Namen hier ein; der Wächter
 * `tests/tastenflow-toene-vorhanden.test.ts` prüft, dass jede genannte Datei
 * existiert.
 */
export const VORHANDENE_TOENE: readonly string[] = ["star3", "levelup"];

function ensureLoaded(name: string): void {
  if (typeof Audio === "undefined" || name in fileEls) return;
  if (!VORHANDENE_TOENE.includes(name)) return; // Datei gibt es nicht - nichts anfragen
  try {
    // Das Zuweisen der Quelle startet das Laden bereits (preload="auto"); ein
    // zusätzliches load() ist überflüssig und wirft in Testumgebungen (jsdom).
    const a = new Audio(`${import.meta.env.BASE_URL}sounds/${name}.mp3`);
    a.preload = "auto";
    a.addEventListener("canplaythrough", () => (fileOk[name] = true), { once: true });
    a.addEventListener("error", () => (fileOk[name] = false), { once: true });
    fileEls[name] = a;
  } catch {
    fileEls[name] = null;
  }
}

// Beim Laden des Moduls schon anstoßen (nur Laden, kein Abspielen — erlaubt ohne
// Nutzer-Geste). So ist die Datei bereit, bevor die erste Belohnung kommt.
for (const name of VORHANDENE_TOENE) ensureLoaded(name);

/** Echte Datei abspielen, wenn vorhanden/abspielbar. Gibt zurück, ob sie lief. */
function playFile(name: string, volume: number): boolean {
  if (typeof Audio === "undefined") return false;
  ensureLoaded(name);
  if (fileOk[name] !== true) return false; // (noch) nicht abspielbar → Fanfare
  const a = fileEls[name];
  if (!a) return false;
  try {
    a.volume = Math.max(0, Math.min(1, volume * lautstaerke("toene")));
    a.currentTime = 0;
    void a.play().catch(() => {
      /* blockiert — der Aufrufer hat als Fallback die Fanfare gespielt */
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Belohnungs-Klang am Rundenende — je nach Sternzahl ein eigener Klang, plus ein
 * besonderer Aufstiegs-Jingle, wenn eine Leistungsstufe dazugekommen ist
 * (Wunsch #3: „bei Stufenaufstieg ändert sich der 3-Sterne-Sound"). Für blinde
 * Kinder ist dieser Klang die eigentliche Belohnung — darum klar unterscheidbar.
 * Liegt eine echte Sounddatei vor, ersetzt sie die erzeugte Fanfare.
 */
export function playStarReward(stars: number, opts: { levelUp?: boolean } = {}): void {
  if (muted) return;
  if (opts.levelUp) {
    // Stufenaufstieg: echte Jubel-Datei ODER eine triumphierende, deutlich
    // andere Fanfare als bei den Sternen.
    if (playFile("levelup", 0.8)) return;
    melody([
      [784, 0, 0.12, 0.11],
      [1047, 110, 0.12, 0.11],
      [1319, 220, 0.12, 0.11],
      [1568, 330, 0.32, 0.13],
      [1319, 470, 0.1, 0.08],
      [1568, 560, 0.36, 0.13],
    ]);
    return;
  }
  if (stars >= 3) {
    // 3 Sterne: echte Belohnungs-Datei ODER eine fröhliche Fanfare.
    if (playFile("star3", 0.7)) return;
    melody([
      [523, 0, 0.12, 0.10],
      [659, 100, 0.12, 0.10],
      [784, 200, 0.12, 0.10],
      [1047, 300, 0.3, 0.12],
    ]);
    return;
  }
  if (stars === 2) {
    // 2 Sterne: aufsteigender Dreiklang, freundlich.
    melody([
      [523, 0, 0.12, 0.10],
      [659, 100, 0.12, 0.10],
      [784, 200, 0.2, 0.11],
    ]);
    return;
  }
  // 1 Stern: kurze, ermutigende kleine Geste — JEDES Kind wird belohnt.
  melody([
    [523, 0, 0.12, 0.09],
    [659, 110, 0.18, 0.10],
  ]);
}

/**
 * Kleiner „Ta-daa"-Jingle für ein NEU verdientes Abzeichen. Bewusst eine eigene,
 * wiedererkennbare Klang-Signatur: aufsteigende QUARTEN (statt der Dreiklänge
 * der Stern-/Aufstiegs-Klänge) mit Glitzer-Schluss — so hören blinde Kinder
 * sofort „das ist ein Abzeichen", noch bevor die Stimme den Namen sagt.
 * Mittellage, weicher Einsatz, gut eine Sekunde (Earcon-Empfehlungen der
 * Recherche 2026-07-07). Liegt `public/sounds/badge.mp3` vor, ersetzt sie den
 * erzeugten Jingle.
 */
export function playBadgeSound(): void {
  if (muted) return;
  if (playFile("badge", 0.75)) return;
  melody([
    // aufsteigende Quarten: E5 → A5 → D6 („ta-da-daa")
    [659, 0, 0.1, 0.1],
    [880, 100, 0.1, 0.1],
    [1175, 200, 0.16, 0.12],
    // kleiner Glitzer obendrauf
    [988, 380, 0.07, 0.07],
    [1319, 460, 0.3, 0.12],
  ]);
}

/**
 * Eigener Klang für ein GESCHICHTEN-Abzeichen (Lesen statt Drill). Bewusst eine
 * zweite, klar unterscheidbare Signatur neben dem „Ta-daa" der Übungs-Abzeichen:
 * erst ein leises Umblättern (kurzes, weiches Rauschen als schneller Abwärts-
 * Sweep), dann ein warmer DUR-Dreiklang von unten nach oben mit langem Ausklang
 * — klingt nach „Buch zugeklappt, schön war's" statt nach Fanfare. Blinde Kinder
 * hören dadurch sofort, ob das Abzeichen fürs Üben oder fürs Lesen kam.
 * Liegt `public/sounds/storybadge.mp3` vor, ersetzt sie den erzeugten Klang.
 */
export function playStoryBadgeSound(): void {
  if (muted) return;
  if (playFile("storybadge", 0.75)) return;
  // „Blättern": kurzer, luftiger Abwärts-Sweep (Sägezahn wirkt papieriger als Sinus).
  tone(2200, 900, 0.14, 0.05, "sawtooth");
  // Warmer Dreiklang F-Dur: F4 → A4 → C5 → F5, weich und mit Nachhall-Geste.
  melody(
    [
      [349, 150, 0.18, 0.09],
      [440, 260, 0.18, 0.09],
      [523, 370, 0.22, 0.1],
      [698, 520, 0.55, 0.12],
    ],
    "sine",
  );
}

// (Bis 11.09.2026 standen hier `playFloeSlide`/`playFishCatch` für das alte
// Eisschollen-Modul, entfernt weil ungenutzt - die Pinguin-Expedition hat
// eigene, tatsächlich aufgerufene Klänge gleichen Namens in
// `src/lib/typing/expedition/audio.ts`.)

/**
 * Große Fanfare, wenn ein neuer Buchstabe/ein neues Zeichen freigeschaltet wird —
 * ein echtes Highlight im Lernweg, deshalb länger und festlicher als jeder andere
 * Klang (steigender Dreiklang, Glitzer-Triller, triumphaler Schluss-Akkord). Für
 * blinde Kinder ist dieser Klang das hörbare „Du hast etwas Neues freigeschaltet!".
 * Liegt eine echte Datei `public/sounds/unlock.mp3` vor, ersetzt sie die Fanfare.
 */
export function playUnlockFanfare(): void {
  if (muted) return;
  if (playFile("unlock", 0.85)) return;
  melody([
    // aufsteigender, voller Lauf
    [523, 0, 0.12, 0.11],
    [659, 110, 0.12, 0.11],
    [784, 220, 0.12, 0.11],
    [1047, 330, 0.16, 0.13],
    // kleiner Glitzer-Triller
    [1319, 500, 0.08, 0.10],
    [1568, 580, 0.08, 0.10],
    [1319, 660, 0.08, 0.08],
    // triumphaler Schluss
    [1047, 760, 0.1, 0.10],
    [1568, 860, 0.42, 0.14],
  ]);
}
