/**
 * Klang-Engine der Polar-Expedition (Neubau, Bauplan §6) — Web Audio mit ECHTEN
 * Aufnahmen (freesound, CC0) und synthetischem Sicherheitsnetz. Baut 1:1 auf dem
 * bewährten K28-Muster von `klangpunkte/audio.ts` auf: eigener AudioContext,
 * Master-Bus mit weicher Begrenzung, Samples werden lazy geladen/dekodiert, und
 * ALLES ist so geplant, dass es auf iPad/iOS zuverlässig klingt.
 *
 * Drei Ebenen je Zone (Bauplan §6):
 *   1. ATMOSPHÄRE-Loop (leise, duckt −8 dB, solange die Ansage spricht),
 *   2. SPANNUNGS-Layer an der Restzeit (Packeis: Eisknacken wird schneller+lauter),
 *   3. EARCONS + Stimmen (Scheitern, Fisch-Gesang).
 *
 * K28-GESETZE (Bauplan §6.1, [[feedback_web_audio_gesture]] — Abnahme-Blocker):
 *   1. Töne SYNCHRON in der Nutzergeste planen — nie `await` vor der Tonplanung.
 *      Samples werden nur im Hintergrund geladen; solange greift die Synthese.
 *   2. Automatisch startende Töne (Ambience beim Zonen-Eintritt) brauchen einen
 *      bei FRÜHERER Geste erzeugten Context → `primeOnGesture` (unten registriert).
 *   3. `keepAudioAlive` gegen den iPad-Lautlos-Schalter.
 *   Der Dev-Server maskiert diese Bugs — immer auch am Prod-Build prüfen.
 *
 * Welche TASTE gemeint ist, trägt weiterhin die Sprachausgabe/Live-Region — nie diese
 * Engine. Aber die Klänge sind NICHT bloß Deko: Eisknacken (Zeitdruck), der Zielton der
 * Bauchrutsche („jetzt drücken") und die Atmosphäre sind fürs Spielen OHNE Blick
 * unverzichtbar. Darum ignoriert die Expedition den „Ton aus"-Schalter des Tipptrainers
 * (s. {@link isSoundMuted} unten, Johannes 15.07.) — leiser wird sie nur am Gerät.
 */
import { keepAudioAlive, primeOnGesture } from "@/lib/audioUnlock";
import { spokenLabel } from "../fingers";
import { isSpeaking, speakMonsterVoice } from "../voice";

/**
 * Ob die Expeditions-Klänge stummgeschaltet sind — HIER bewusst IMMER `false`
 * (Johannes 15.07.: „ohne die Geräusche kann man das gar nicht blind spielen").
 *
 * Früher las diese Engine den globalen „Ton aus"-Schalter des Tipptrainers
 * (`isSoundMuted()` aus `../sound`, localStorage `tippen-sound-muted`) und behandelte
 * ihre Klänge als reine Deko. Das war falsch: Das Eisknacken (Zeitdruck), der helle
 * Zielton der Bauchrutsche („jetzt drücken") und die Atmosphäre TRAGEN Spiel-
 * Information und sind fürs Spielen ohne Blick unverzichtbar. Wer im Tipptrainer den
 * Anschlag-Ton abgeschaltet hatte, spielte die ganze Expedition tonlos — und damit
 * blind gar nicht (im Browser reproduziert 15.07.: Ansagen liefen, kein einziger
 * Web-Audio-Ton). Die Expedition ist eine bewusst geöffnete Vollbild-Bühne; ihre
 * Lautstärke regelt man am Gerät. Ein eigener Spiel-Mute kann später dazukommen —
 * dann greift diese eine Stelle statt des trainer-fremden Schalters.
 */
function isSoundMuted(): boolean {
  return false;
}

/** Zonen-Atmosphären-Kennung. Packeis = Meer & Möwen; Steilwand/Rutsche = Bergwind. */
export type AmbienceKind = "packeis" | "steilwand" | "slide";

const SAMPLE_BASE = `${import.meta.env.BASE_URL}sounds/expedition/`;

/** Datei je Atmosphäre (Loop). Steilwand und Nacht-Rutsche teilen sich den Bergwind. */
const AMBIENCE_FILE: Record<AmbienceKind, string> = {
  packeis: "meer.m4a",
  steilwand: "bergwind.m4a",
  slide: "bergwind.m4a",
};
/** Durchgehendes Eisknacken (Loop; Rate+Gain moduliert = Countdown). */
const ICE_FILE = "eisknacken.m4a";
/** Untergangs-Klänge (One-Shots). */
const BLUBBER_FILE = "blubbern.m4a";
const PLATSCH_FILE = "platsch.m4a";
/** Steinschlag/Felsrutsch (Steilwand: bei Zögern leise, beim Absturz laut). */
const STONE_FILE = "steinschlag.m4a";

// --- Context + Master-Bus ------------------------------------------------------

let ctx: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    keepAudioAlive(ctx); // iOS: Gesten-Entsperrung + Lautlos-Schalter-Trick (§6.1.3)
    return ctx;
  } catch {
    return null;
  }
}

// Den Context schon bei der ERSTEN Nutzergeste (Bühne öffnen / Tagebuch-Leertaste)
// anlegen und wecken — sonst bliebe die automatisch startende Atmosphäre stumm,
// bis man einmal tippt (§6.1.2). Idempotent (gibt den gecachten Context zurück).
primeOnGesture(() => audioContext());

let masterNode: GainNode | null = null;
let masterCtx: AudioContext | null = null;

/** Weiche Begrenzerkurve (tanh-Knie) — schützt vor Clipping bei Überlagerung. */
function softClipCurve(): Float32Array<ArrayBuffer> {
  const n = 1024;
  const knee = 0.9;
  const range = 1 - knee;
  const curve = new Float32Array(new ArrayBuffer(n * Float32Array.BYTES_PER_ELEMENT));
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    const a = Math.abs(x);
    const y = a <= knee ? a : knee + range * Math.tanh((a - knee) / range);
    curve[i] = Math.sign(x) * y;
  }
  return curve;
}

/** Gemeinsamer Ausgang aller Expedition-Klänge (idempotent pro Context). */
function masterBus(ac: AudioContext): AudioNode {
  if (masterNode && masterCtx === ac) return masterNode;
  const gain = ac.createGain();
  gain.gain.value = 0.9;
  const shaper = ac.createWaveShaper();
  shaper.curve = softClipCurve();
  shaper.oversample = "2x";
  gain.connect(shaper).connect(ac.destination);
  masterNode = gain;
  masterCtx = ac;
  return gain;
}

// --- Sample-Laden (lazy, gecacht) ----------------------------------------------

const buffers = new Map<string, AudioBuffer>();
const bufferPromises = new Map<string, Promise<AudioBuffer | null>>();

/** Ein Sample laden+dekodieren (idempotent; bei Fehler später neuer Versuch). */
function ensureSample(file: string): Promise<AudioBuffer | null> {
  const have = buffers.get(file);
  if (have) return Promise.resolve(have);
  let p = bufferPromises.get(file);
  if (!p) {
    p = (async () => {
      const ac = audioContext();
      if (!ac) return null;
      try {
        const res = await fetch(`${SAMPLE_BASE}${file}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await ac.decodeAudioData(await res.arrayBuffer());
        buffers.set(file, buf);
        return buf;
      } catch {
        bufferPromises.delete(file); // offline / Decode-Fehler → Synth-Fallback
        return null;
      }
    })();
    bufferPromises.set(file, p);
  }
  return p;
}

/** Fertig dekodiertes Sample (oder undefined) — für den SYNCHRONEN Zugriff. */
function sample(file: string): AudioBuffer | undefined {
  return buffers.get(file);
}

/**
 * Die Samples einer Zone vorladen. Beim Spielstart aus einer Geste aufrufen, damit
 * die One-Shots (Untergang) beim Scheitern schon warm sind. Best effort — fehlt ein
 * Sample noch, klingt es synthetisch (nie stumm).
 */
export function preloadPackeis(): void {
  void ensureSample(AMBIENCE_FILE.packeis);
  void ensureSample(ICE_FILE);
  void ensureSample(BLUBBER_FILE);
  void ensureSample(PLATSCH_FILE);
}

/**
 * Context wecken + Packeis-Samples vorladen. Aus der ERSTEN Nutzergeste (Bühne
 * öffnen) aufrufen (K28 §6.1.2) — danach dürfen auch automatische Töne klingen.
 */
export function primePackeisAudio(): void {
  audioContext();
  preloadPackeis();
}

/** Steilwand-Samples vorladen (Bergwind-Loop + Steinschlag). */
export function preloadSteilwand(): void {
  void ensureSample(AMBIENCE_FILE.steilwand);
  void ensureSample(STONE_FILE);
}

/** Context wecken + Steilwand-Samples vorladen (aus der Öffnen-Geste, K28 §6.1.2). */
export function primeSteilwandAudio(): void {
  audioContext();
  preloadSteilwand();
}

/** Context wecken + Rutsch-Ambiente (Bergwind) vorladen; der Rutsch-Wusch ist Synth. */
export function primeSlideAudio(): void {
  audioContext();
  void ensureSample(AMBIENCE_FILE.slide);
}

// --- kleine Synth-Bausteine (Sicherheitsnetz, solange ein Sample fehlt) ---------

function blip(
  ac: AudioContext,
  dest: AudioNode,
  f0: number,
  f1: number,
  dur: number,
  peak: number,
  type: OscillatorType,
  at = 0,
): void {
  const t0 = ac.currentTime + at;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t0);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(dest);
  o.start(t0);
  o.stop(t0 + dur + 0.03);
}

// --- Ebene 1: Atmosphäre-Loop (mit Sprech-Ducking) -----------------------------

interface Loop {
  src: AudioBufferSourceNode;
  gain: GainNode;
  baseGain: number;
}
let ambience: Loop | null = null;
let ambienceDuckTimer: ReturnType<typeof setInterval> | null = null;

/** Atmosphäre einer Zone starten (leiser Loop). Idempotent je Zone. */
export function startAmbience(kind: AmbienceKind): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  const buf = sample(AMBIENCE_FILE[kind]);
  if (!buf) {
    // Sample noch nicht da → nachladen und beim nächsten Aufruf starten. Kein
    // Synth-Fallback für Atmosphäre (Stille ist hier verkraftbar).
    void ensureSample(AMBIENCE_FILE[kind]).then((b) => {
      if (b && !ambience) startAmbience(kind);
    });
    return;
  }
  if (ambience) return;
  const gain = ac.createGain();
  const baseGain = 0.32; // leise (Bauplan §6: Atmosphäre leise)
  gain.gain.value = baseGain;
  const src = ac.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  src.connect(gain).connect(masterBus(ac));
  src.start();
  ambience = { src, gain, baseGain };
  // Ducking: solange die Ansage spricht, die Atmosphäre um ~8 dB absenken (§6).
  if (ambienceDuckTimer === null) {
    ambienceDuckTimer = setInterval(() => {
      if (!ambience) return;
      const target = isSpeaking() ? ambience.baseGain * 0.4 : ambience.baseGain;
      try {
        const now = ambience.gain.context.currentTime;
        ambience.gain.gain.setTargetAtTime(target, now, 0.12);
      } catch {
        /* Context weg — egal */
      }
    }, 140);
  }
}

/** Atmosphäre ausblenden und stoppen. */
export function stopAmbience(): void {
  if (ambienceDuckTimer !== null) {
    clearInterval(ambienceDuckTimer);
    ambienceDuckTimer = null;
  }
  const a = ambience;
  ambience = null;
  if (!a) return;
  try {
    const now = a.gain.context.currentTime;
    a.gain.gain.cancelScheduledValues(now);
    a.gain.gain.setValueAtTime(Math.max(a.gain.gain.value, 0.0001), now);
    a.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    a.src.stop(now + 0.45);
  } catch {
    /* schon gestoppt */
  }
}

// --- Ebene 2: Eisknacken als hörbarer Countdown (Bauplan §4.1) ------------------
//
// Ein durchgehendes Knister-Sample läuft als Loop; mit ablaufender Zeit steigen
// `playbackRate` (schnelleres, höheres Knacken) und Gain (lauter) — der Countdown
// wird also HÖRBAR, nicht nur als Balken sichtbar. Fehlt das Sample, tickt ein
// synthetischer Knack im gleichen Tempo (nie stumm).

interface IceLoop {
  src: AudioBufferSourceNode;
  gain: GainNode;
}
let ice: IceLoop | null = null;
let iceSynthTimer: ReturnType<typeof setInterval> | null = null;
let iceTension = 0; // 0 = eben betreten … 1 = gleich versunken

const ICE_RATE_MIN = 0.85;
const ICE_RATE_MAX = 1.8;
const ICE_GAIN_MIN = 0.12;
const ICE_GAIN_MAX = 0.6;

/** Eisknacken auf einer frisch betretenen Scholle beginnen (Spannung 0). */
export function startIce(): void {
  stopIce();
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  iceTension = 0;
  const buf = sample(ICE_FILE);
  if (buf) {
    const gain = ac.createGain();
    gain.gain.value = ICE_GAIN_MIN;
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.playbackRate.value = ICE_RATE_MIN;
    src.connect(gain).connect(masterBus(ac));
    src.start();
    ice = { src, gain };
  } else {
    // Synth-Fallback: Knack-Ticker; Intervall/Gain folgen der Spannung.
    void ensureSample(ICE_FILE); // fürs nächste Mal nachladen
    iceSynthTimer = setInterval(() => {
      const a = audioContext();
      if (!a) return;
      const f = 150 - iceTension * 40;
      blip(a, masterBus(a), f, f * 0.8, 0.05, ICE_GAIN_MIN + iceTension * 0.25, "square");
    }, 260 - iceTension * 170);
  }
}

/** Countdown-Fortschritt 0..1 setzen — Knacken wird schneller und lauter. */
export function setIceTension(t: number): void {
  iceTension = Math.max(0, Math.min(1, t));
  if (ice) {
    try {
      const now = ice.gain.context.currentTime;
      ice.src.playbackRate.setTargetAtTime(
        ICE_RATE_MIN + (ICE_RATE_MAX - ICE_RATE_MIN) * iceTension,
        now,
        0.1,
      );
      ice.gain.gain.setTargetAtTime(
        ICE_GAIN_MIN + (ICE_GAIN_MAX - ICE_GAIN_MIN) * iceTension,
        now,
        0.1,
      );
    } catch {
      /* Context weg — egal */
    }
  } else if (iceSynthTimer !== null) {
    // Ticker-Intervall an die Spannung anpassen (schneller werden).
    clearInterval(iceSynthTimer);
    iceSynthTimer = setInterval(() => {
      const a = audioContext();
      if (!a) return;
      const f = 150 - iceTension * 40;
      blip(a, masterBus(a), f, f * 0.8, 0.05, ICE_GAIN_MIN + iceTension * 0.25, "square");
    }, Math.max(90, 260 - iceTension * 170));
  }
}

/** Eisknacken beenden (Scholle verlassen, geschafft, geschlossen). */
export function stopIce(): void {
  if (iceSynthTimer !== null) {
    clearInterval(iceSynthTimer);
    iceSynthTimer = null;
  }
  const i = ice;
  ice = null;
  if (!i) return;
  try {
    const now = i.gain.context.currentTime;
    i.gain.gain.cancelScheduledValues(now);
    i.gain.gain.setValueAtTime(Math.max(i.gain.gain.value, 0.0001), now);
    i.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    i.src.stop(now + 0.22);
  } catch {
    /* schon gestoppt */
  }
}

// --- Ebene 3: Earcons + Fisch-Stimme -------------------------------------------

/** One-Shot-Sample abspielen (oder nichts, wenn nicht geladen). */
function playSample(file: string, gainValue: number): boolean {
  const ac = audioContext();
  const buf = sample(file);
  if (!ac || !buf) return false;
  try {
    const g = ac.createGain();
    g.gain.value = gainValue;
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.connect(g).connect(masterBus(ac));
    src.start();
    return true;
  } catch {
    return false;
  }
}

/**
 * Untergang im Packeis (Bauplan §4.1): Blubbern + Platscher. Echte Samples, sonst
 * ein synthetisches „Blubb-Platsch". Kein Strafton — das Spiel kennt beliebig viele
 * Versuche.
 */
export function playSink(): void {
  stopIce();
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  const blubberOk = playSample(BLUBBER_FILE, 0.7);
  const platschOk = playSample(PLATSCH_FILE, 0.75);
  if (!blubberOk && !platschOk) {
    // Fallback: absteigendes Glissando + zwei „Blubb"-Töne.
    blip(ac, masterBus(ac), 440, 90, 0.5, 0.12, "sawtooth");
    blip(ac, masterBus(ac), 220, 110, 0.12, 0.1, "sine", 0.48);
    blip(ac, masterBus(ac), 180, 90, 0.14, 0.09, "sine", 0.62);
  } else if (!platschOk) {
    void ensureSample(PLATSCH_FILE);
  } else if (!blubberOk) {
    void ensureSample(BLUBBER_FILE);
  }
}

// Fisch-Stimme: pro Zeichen eine gerenderte Datei (voices/fisch/<slug>.m4a).
const fishBuffers = new Map<string, AudioBuffer | null>();

/** Dateisystem-sicherer Slug — MUSS identisch zu scripts/expedition-voices.mjs sein. */
export function fishSlug(unit: string): string {
  const map: Record<string, string> = {
    "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss",
    ".": "punkt", ",": "komma", "-": "bindestrich", "?": "fragezeichen",
    "!": "ausrufezeichen", ":": "doppelpunkt", ";": "strichpunkt",
    /*
     * ★ Ergänzt 20.09.2026 (Testerin Durchgang, Punkt 3 - „kann das Höhlenwesen
     * alles sagen?"): der ganze Sonderzeichen-Vorrat (`SYMBOL_ORDER`, letters.ts)
     * bekam bis dahin keinen Slug - manche seiner Zeichen (z. B. der Schrägstrich)
     * sind als Dateiname ohnehin unzulässig. MUSS mit dem `slug()` in
     * scripts/expedition-voices.mjs deckungsgleich bleiben (dort gespiegelt).
     */
    "(": "rundeklammerauf", ")": "rundeklammerzu", "\"": "anfuehrungszeichen",
    "'": "apostroph", "+": "plus", "*": "stern", "/": "schraegstrich", "=": "gleich",
    "%": "prozent", "&": "undzeichen", "@": "atzeichen", "€": "euro", "#": "raute",
    "$": "dollar", "§": "paragraf", "<": "kleinerals", ">": "groesserals",
    "[": "eckigeklammerauf", "]": "eckigeklammerzu",
    "{": "geschweifteklammerauf", "}": "geschweifteklammerzu",
    "|": "senkrechterstrich", "^": "dach", "~": "tilde", "°": "grad",
  };
  return map[unit] ?? unit.toLowerCase();
}

/**
 * Der Fisch „singt" sein Zeichen mit der Fischstimme A (Bauplan §4.1): die
 * gerenderte Stimm-Datei, sonst ein synthetischer, heller Zwitscher-Ruf. Die
 * KLARE Ansage, welche Taste den Fisch fängt, kommt getrennt über die Sprach-
 * ausgabe/Live-Region (diese Stimme ist verspielt verfremdet = reine Deko).
 */
export function playFishSong(unit: string): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  const file = `voices/fisch/${fishSlug(unit)}.m4a`;
  const buf = fishBuffers.get(file);
  if (buf) {
    try {
      const g = ac.createGain();
      g.gain.value = 0.85;
      const src = ac.createBufferSource();
      src.buffer = buf;
      // Viel höher pitchen (Johannes 13.07.: „viel höher") — ein hoher, quietschiger
      // Fisch-Ruf, klar abgesetzt von der normalen App-Stimme.
      src.playbackRate.value = 1.6;
      src.connect(g).connect(masterBus(ac));
      src.start();
      return;
    } catch {
      /* fällt unten auf Synth zurück */
    }
  }
  if (buf === undefined) {
    // Noch nicht versucht → laden; diesmal klingt der Synth-Ruf.
    void (async () => {
      const b = await ensureSample(file);
      fishBuffers.set(file, b);
    })();
  }
  // Synth-Fallback: sehr helle, schnelle Rufton-Paare (Fisch-Pfeifen, „viel höher" — §13.07.).
  blip(ac, masterBus(ac), 1568, 2093, 0.09, 0.09, "sine");
  blip(ac, masterBus(ac), 2093, 1568, 0.09, 0.08, "sine", 0.11);
  blip(ac, masterBus(ac), 1865, 2489, 0.12, 0.09, "sine", 0.26);
}

/** Fisch gefangen: fröhlicher Fang-Blip mit Wasser-Plopp (rein synthetisch). */
export function playFishCatch(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 660, 1047, 0.12, 0.1, "triangle");
  blip(ac, masterBus(ac), 1319, 1319, 0.08, 0.09, "triangle", 0.13);
  blip(ac, masterBus(ac), 300, 140, 0.12, 0.08, "sine", 0.24);
}

/** Freundlicher „Hüpfer" beim Sprung auf die nächste Scholle (dezent). */
export function playHop(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 330, 660, 0.14, 0.09, "sine");
  blip(ac, masterBus(ac), 880, 880, 0.05, 0.05, "triangle", 0.13);
}

/** Kleiner Jubel-Lauf am Etappen-Ziel (vor der Freischalt-Fanfare). */
export function playArrive(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 659, 659, 0.1, 0.1, "triangle");
  blip(ac, masterBus(ac), 784, 784, 0.1, 0.1, "triangle", 0.09);
  blip(ac, masterBus(ac), 1047, 1047, 0.12, 0.11, "triangle", 0.18);
  blip(ac, masterBus(ac), 1319, 1319, 0.26, 0.12, "triangle", 0.29);
}

// --- E3: Steilwand & Heim-Bauchrutsche -----------------------------------------

/**
 * Kurzer gefilterter Rausch-Stoß (weiße Störung, abklingend, tiefpassgefiltert) —
 * das Baumaterial für weiche Naturgeräusche ohne Sample: Schnee-Landung („pff"),
 * Rutsch-Rauschen. Erzeugt einen kleinen Rausch-Buffer (Browser: `Math.random`).
 */
function noiseBurst(ac: AudioContext, dur: number, peak: number, cutoff: number, at = 0): void {
  const t0 = ac.currentTime + at;
  const n = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, n, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n); // abklingend
  const src = ac.createBufferSource();
  src.buffer = buf;
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = cutoff;
  const g = ac.createGain();
  g.gain.value = peak;
  src.connect(lp).connect(g).connect(masterBus(ac));
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

/**
 * Steinchen rieseln, wenn das Kind an der Steilwand zögert (Bauplan §4.2): ein
 * LEISER Steinschlag-Anspieler (echtes Sample, sonst ein paar Kies-Körnchen). Kein
 * Strafton — nur der Hinweis „gleich bröckelt der Tritt".
 */
export function playRockfall(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  if (playSample(STONE_FILE, 0.28)) return;
  void ensureSample(STONE_FILE);
  blip(ac, masterBus(ac), 260, 180, 0.05, 0.09, "square");
  blip(ac, masterBus(ac), 200, 150, 0.05, 0.08, "square", 0.06);
  blip(ac, masterBus(ac), 320, 220, 0.04, 0.07, "square", 0.12);
}

/**
 * Absturz an der Steilwand (Bauplan §4.2): ein KOMISCHES „Aaah!" — nie bedrohlich,
 * er zwinkert — mit Poltern und weicher Schnee-Landung. Das Aaah-Sample ist noch
 * nicht beschafft (Bauplan §6.2 — Kandidaten Johannes vorspielen); bis dahin
 * synthetisch: ein fallendes Cartoon-Glissando + „pff"-Landung im Schnee.
 */
export function playFall(): void {
  stopIce();
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  playSample(STONE_FILE, 0.5); // Poltern (echtes Sample, wenn geladen)
  blip(ac, masterBus(ac), 660, 170, 0.5, 0.12, "sawtooth"); // „Aaah" fällt
  noiseBurst(ac, 0.2, 0.11, 900, 0.42); // weiche Schnee-Landung
}

/**
 * Rutsch-Schwung auf der Heim-Bauchrutsche (Bauplan §4.6): ein fröhliches „Wiii" —
 * aufsteigendes Glissando + Rutsch-Rauschen. (Rutsch-Wusch-Sample noch nicht
 * beschafft, §6.2 — bis dahin synthetisch, im Geist von `playFloeSlide`.)
 */
export function playSlideWush(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 523, 1175, 0.22, 0.09, "sine"); // „wiii" nach oben
  noiseBurst(ac, 0.26, 0.05, 2200); // Rutsch-Rauschen
}

/** Bauchrutsche verpatzt (Bauplan §4.6): sanft in den Schnee gekullert — ein „pff". */
export function playSlideThud(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 300, 150, 0.16, 0.08, "triangle");
  noiseBurst(ac, 0.22, 0.11, 850, 0.05);
}

/**
 * Polarlicht-Finale (Bauplan §4.6): ein sphärischer, langsam schwellender Akkord
 * (reine Live-Synthese) mit leichtem Schweben. Spielt NUR beim fehlerfreien Lauf —
 * darum bleibt der Klang selten und besonders. Klingt von selbst aus (~4,5 s).
 */
export function playAurora(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  const now = ac.currentTime;
  const chord = [329.63, 493.88, 659.25, 987.77]; // offener, heller Klang
  chord.forEach((f, i) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.055, now + 1.1 + i * 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    lfo.frequency.value = 0.2 + i * 0.05; // sanftes Schweben der Bänder
    lfoGain.gain.value = 2.2;
    lfo.connect(lfoGain).connect(o.frequency);
    o.connect(g).connect(masterBus(ac));
    o.start(now);
    lfo.start(now);
    o.stop(now + 4.7);
    lfo.stop(now + 4.7);
  });
}

// --- E4: Echo-Höhle — Atmosphäre (Live-Synthese) + Puls + Monsterstimme ---------
//
// Die Höhlen-Atmo ist bewusst SYNTH (Bauplan §6.2 „Höhle bleibt Live-Synthese"): ein
// tiefer, hohler Dröhn-Teppich, darauf ein langsamer Puls-„Herzschlag". Läuft die
// Zeit an einer Station, wird der Puls schneller, lauter und tiefer und das Dröhnen
// dichter (Bauplan §4.3 „schichtweise bedrohlicher" — an die Restzeit gekoppelt wie
// `setIceTension`, aber als Puls). Die Taste selbst trägt NIE diese Engine, sondern
// die Monster-Ansage + Live-Region — hier ist nur Stimmung.

interface CaveAmbience {
  drone: OscillatorNode;
  drone2: OscillatorNode;
  gain: GainNode;
  lp: BiquadFilterNode;
}
let caveAmb: CaveAmbience | null = null;
let cavePulseTimer: ReturnType<typeof setTimeout> | null = null;
let cavePulse = 0; // 0 = ruhig … 1 = bedrohlich (Zeit fast um)

const CAVE_PULSE_MS_MAX = 1500; // ruhiger Herzschlag (viel Zeit)
const CAVE_PULSE_MS_MIN = 360; // gehetzt (Zeit fast um)

/** Ein tiefer Puls-Schlag (Grollen); mit steigender Spannung tiefer + lauter + näher. */
function cavePulseHit(ac: AudioContext): void {
  const t0 = ac.currentTime;
  const base = 68 - cavePulse * 24; // 68 → 44 Hz: rückt „näher"/tiefer
  const o = ac.createOscillator();
  const g = ac.createGain();
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 300 + cavePulse * 240;
  o.type = "sine";
  o.frequency.setValueAtTime(base * 1.7, t0);
  o.frequency.exponentialRampToValueAtTime(base, t0 + 0.16);
  const peak = 0.11 + cavePulse * 0.32;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
  o.connect(lp).connect(g).connect(masterBus(ac));
  o.start(t0);
  o.stop(t0 + 0.55);
}

/** Höhlen-Atmosphäre starten (Dröhn-Teppich + Puls-Herzschlag). Idempotent. */
export function startCaveAmbience(): void {
  stopCaveAmbience();
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  cavePulse = 0;
  const gain = ac.createGain();
  gain.gain.value = 0.06;
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 220;
  const drone = ac.createOscillator();
  drone.type = "sine";
  drone.frequency.value = 57;
  const drone2 = ac.createOscillator();
  drone2.type = "sine";
  drone2.frequency.value = 85.5; // knappe Quinte drüber = hohl/beklemmend
  drone.connect(lp);
  drone2.connect(lp);
  lp.connect(gain).connect(masterBus(ac));
  drone.start();
  drone2.start();
  caveAmb = { drone, drone2, gain, lp };
  // Selbst-planender Puls: das Intervall liest bei JEDEM Schlag die aktuelle
  // Spannung → er wird von allein schneller, wenn die Zeit knapp wird.
  const schedule = () => {
    const a = audioContext();
    if (a && caveAmb) cavePulseHit(a);
    const ms = CAVE_PULSE_MS_MAX - (CAVE_PULSE_MS_MAX - CAVE_PULSE_MS_MIN) * cavePulse;
    cavePulseTimer = setTimeout(schedule, ms);
  };
  schedule();
}

/** Höhlen-Spannung 0..1 setzen — Puls beschleunigt/vertieft, Dröhnen wird dichter. */
export function setCavePulse(t: number): void {
  cavePulse = Math.max(0, Math.min(1, t));
  if (!caveAmb) return;
  try {
    const now = caveAmb.gain.context.currentTime;
    caveAmb.gain.gain.setTargetAtTime(0.06 + cavePulse * 0.06, now, 0.15);
    caveAmb.lp.frequency.setTargetAtTime(220 + cavePulse * 260, now, 0.15);
  } catch {
    /* Context weg — egal */
  }
}

/** Höhlen-Atmosphäre beenden (Station verlassen, geschafft, Bühne zu). */
export function stopCaveAmbience(): void {
  if (cavePulseTimer !== null) {
    clearTimeout(cavePulseTimer);
    cavePulseTimer = null;
  }
  const a = caveAmb;
  caveAmb = null;
  if (!a) return;
  try {
    const now = a.gain.context.currentTime;
    a.gain.gain.cancelScheduledValues(now);
    a.gain.gain.setValueAtTime(Math.max(a.gain.gain.value, 0.0001), now);
    a.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    a.drone.stop(now + 0.45);
    a.drone2.stop(now + 0.45);
  } catch {
    /* schon gestoppt */
  }
}

/** Context wecken + Raunen-Sample vorladen (aus der Öffnen-Geste, K28 §6.1.2). */
export function primeCaveAudio(): void {
  audioContext();
  void ensureSample("voices/monster/raunen.m4a");
}

// --- Schneesturm-Atmosphäre (E5, Bauplan §4.4/§6) ------------------------------
//
// Ein Sturm-Loop (Sample 505999), dessen Lautstärke in BÖEN schwillt: kurz laut
// (Böe) → dann leiser (Fenster = „jetzt aus dem Gedächtnis tippen"). Fehlt das
// Sample noch, heult ein gefiltertes Rauschen im selben Rhythmus (nie stumm, K28
// §6.1.1). Zwei Gain-Stufen: `wind` (Böen-Automation) → `duck` (Sprech-Ducking).
const STORM_FILE = "sturm.m4a";
const STORM_CALM = 0.2; // ruhiges Fenster (leiser)
const STORM_GUST = 0.5; // Böe (laut)
const STORM_GUST_MS_MIN = 3800;
const STORM_GUST_MS_MAX = 6200;

interface StormAmbience {
  src: AudioBufferSourceNode;
  wind: GainNode; // Böen-Automation
  duck: GainNode; // Sprech-Ducking
}
let stormAmb: StormAmbience | null = null;
let stormGustTimer: ReturnType<typeof setTimeout> | null = null;
let stormDuckTimer: ReturnType<typeof setInterval> | null = null;

/** Context wecken + Sturm-Sample vorladen (aus der Öffnen-Geste, K28 §6.1.2). */
export function primeStormAudio(): void {
  audioContext();
  void ensureSample(STORM_FILE);
}

/** Eine Böe: kurz anschwellen (laut), dann abflauen ins ruhige Fenster. */
export function stormGust(): void {
  const ac = audioContext();
  if (!ac || !stormAmb) return;
  try {
    const g = stormAmb.wind.gain;
    const now = ac.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(Math.max(g.value, 0.0001), now);
    g.linearRampToValueAtTime(STORM_GUST, now + 0.7); // Böe schwillt an
    g.linearRampToValueAtTime(STORM_CALM, now + 2.3); // flaut ab → Zeitfenster
  } catch {
    /* Context weg — egal */
  }
}

/** Schneesturm-Atmosphäre starten (Loop + Böen). Idempotent. */
export function startStormAmbience(): void {
  stopStormAmbience();
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  const duck = ac.createGain();
  duck.gain.value = 1;
  duck.connect(masterBus(ac));
  const wind = ac.createGain();
  wind.gain.value = STORM_CALM;
  wind.connect(duck);
  let src: AudioBufferSourceNode;
  const buf = sample(STORM_FILE);
  if (buf) {
    src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(wind);
  } else {
    // Synth-Wind: braunes Rauschen durch Tiefpass (heult), bis das Sample da ist.
    const n = Math.floor(ac.sampleRate * 2);
    const nb = ac.createBuffer(1, n, ac.sampleRate);
    const d = nb.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.2;
    }
    src = ac.createBufferSource();
    src.buffer = nb;
    src.loop = true;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 720;
    src.connect(lp).connect(wind);
    void ensureSample(STORM_FILE); // fürs nächste Mal nachladen
  }
  src.start();
  stormAmb = { src, wind, duck };
  // Selbst-planende Böen in zufälligem Abstand (Sturm bläst unregelmäßig).
  const gust = () => {
    if (!stormAmb) return;
    stormGust();
    const ms = STORM_GUST_MS_MIN + Math.random() * (STORM_GUST_MS_MAX - STORM_GUST_MS_MIN);
    stormGustTimer = setTimeout(gust, ms);
  };
  stormGustTimer = setTimeout(gust, 1500);
  // Ducking: solange die Ansage spricht, den ganzen Sturm absenken (§6).
  stormDuckTimer = setInterval(() => {
    if (!stormAmb) return;
    try {
      const now = stormAmb.duck.context.currentTime;
      stormAmb.duck.gain.setTargetAtTime(isSpeaking() ? 0.4 : 1, now, 0.12);
    } catch {
      /* Context weg — egal */
    }
  }, 140);
}

/** Schneesturm-Atmosphäre beenden. */
export function stopStormAmbience(): void {
  if (stormGustTimer !== null) {
    clearTimeout(stormGustTimer);
    stormGustTimer = null;
  }
  if (stormDuckTimer !== null) {
    clearInterval(stormDuckTimer);
    stormDuckTimer = null;
  }
  const a = stormAmb;
  stormAmb = null;
  if (!a) return;
  try {
    const now = a.wind.context.currentTime;
    a.wind.gain.cancelScheduledValues(now);
    a.wind.gain.setValueAtTime(Math.max(a.wind.gain.value, 0.0001), now);
    a.wind.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    a.src.stop(now + 0.45);
  } catch {
    /* schon gestoppt */
  }
}

// --- E6: Polarstation — warme Abend-Atmo + Funk-Earcons (Bauplan §4.5/§6) -------
//
// Die Polarstation ist die VERSCHNAUFZONE (Abend, warm): eine leise, wohlige
// Grund-Atmo (Live-Synthese — ein warmer Dur-Teppich, kein Sample nötig) und drei
// Funk-Earcons: ein kurzer Funk-Pieps je Anschlag, ein „Nachricht gesendet"-Wusch
// (Funkwellen vom Mast) und das freundliche Antwort-Piepsen der Familie (Jingle).
// Dazu ein eigener Aufmerksamkeits-Pieps vor der Funker-Hilfe (§4.5, 3 Stufen), damit
// er nicht mit dem Anschlag-Pieps verwechselt wird. Alles synthetisch → K28-fest
// (synchron planbar, kein Sample-Warten, §6.1.1).

interface StationAmbience {
  a: OscillatorNode;
  b: OscillatorNode;
  lfo: OscillatorNode;
  gain: GainNode;
}
let stationAmb: StationAmbience | null = null;
let stationDuckTimer: ReturnType<typeof setInterval> | null = null;

/** Context wecken (aus der Öffnen-Geste, K28 §6.1.2) — die Station braucht keine Samples. */
export function primeStationAudio(): void {
  audioContext();
}

/** Warme Abend-Atmosphäre der Station starten (leiser Dur-Teppich mit sanftem Schweben). */
export function startStationAmbience(): void {
  stopStationAmbience();
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  const gain = ac.createGain();
  gain.gain.value = 0.035; // sehr leise (Verschnaufzone, §4.5)
  const a = ac.createOscillator();
  a.type = "sine";
  a.frequency.value = 146.83; // D3
  const b = ac.createOscillator();
  b.type = "sine";
  b.frequency.value = 220; // A3 (offene Quinte = warm, ruhig)
  // Sanftes Schweben der Lautstärke = „atmende" Wärme, nie aufdringlich.
  const lfo = ac.createOscillator();
  const lfoGain = ac.createGain();
  lfo.frequency.value = 0.12;
  lfoGain.gain.value = 0.01;
  lfo.connect(lfoGain).connect(gain.gain);
  a.connect(gain);
  b.connect(gain);
  gain.connect(masterBus(ac));
  a.start();
  b.start();
  lfo.start();
  stationAmb = { a, b, lfo, gain };
  // Ducking: solange die Ansage/das Wort spricht, die Atmo absenken (§6).
  stationDuckTimer = setInterval(() => {
    if (!stationAmb) return;
    try {
      const now = stationAmb.gain.context.currentTime;
      stationAmb.gain.gain.setTargetAtTime(isSpeaking() ? 0.018 : 0.035, now, 0.15);
    } catch {
      /* Context weg — egal */
    }
  }, 160);
}

/** Station-Atmosphäre beenden. */
export function stopStationAmbience(): void {
  if (stationDuckTimer !== null) {
    clearInterval(stationDuckTimer);
    stationDuckTimer = null;
  }
  const s = stationAmb;
  stationAmb = null;
  if (!s) return;
  try {
    const now = s.gain.context.currentTime;
    s.gain.gain.cancelScheduledValues(now);
    s.gain.gain.setValueAtTime(Math.max(s.gain.gain.value, 0.0001), now);
    s.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    s.a.stop(now + 0.45);
    s.b.stop(now + 0.45);
    s.lfo.stop(now + 0.45);
  } catch {
    /* schon gestoppt */
  }
}

/** Funk-Pieps je Anschlag (Bauplan §4.5): ein kurzer, heller Telegrafen-Tick. */
export function playRadioBeep(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 1180, 1180, 0.05, 0.06, "square");
}

/**
 * Bauchrutsche — ANFLUG-TICKS und ZIELTON (Johannes 14.07.: der Buchstabe kommt auf einen zu,
 * und „es soll irgendwie klar gemacht sein, wann man drücken soll"). Drei Ticks takten den
 * Anflug wie ein Metronom-Auftakt; der Zielton (`cue`) erklingt GENAU dann, wenn das
 * Trefferfenster aufgeht — er ist heller, länger und liegt eine Quinte höher, damit er sich
 * vom Tick unverwechselbar abhebt. Damit ist die Zone ohne Blick auf den Bildschirm spielbar:
 * beim Zielton drücken (§7). Beide Töne werden SYNCHRON in der laufenden Spiel-Schleife
 * geplant (K28-Regel: kein `await` vor der Klangplanung).
 */
export function playSlideTick(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 660, 660, 0.04, 0.05, "triangle");
}

/**
 * „Ich habe Dich gehört, aber der Buchstabe ist noch nicht unterwegs" — ein
 * kurzer, tiefer, weicher Ton. Bewusst UNTER dem Auftakt-Tick (660 Hz) und
 * weit unter dem Zielton (990 Hz): Er darf nie mit „jetzt drücken" verwechselt
 * werden, sondern sagt nur, dass der Tastendruck angekommen ist.
 *
 * ★★★★ Testerin am 04.09.2026 zur Bauchrutsche: *„Es ist irgendwie nicht klar
 * gewesen, wann man den Buchstaben drückt. Da kam keine Rückmeldung, wenn man
 * gedrückt hat."* Genau so war es gebaut - solange die Ansage sprach, verwarf
 * `handleSlideKey` jede Taste stillschweigend. **Ein Tastendruck ohne jede
 * Antwort ist für ein Kind mit Blindheit nicht von einer kaputten Tastatur zu
 * unterscheiden.**
 */
export function playSlideNotYet(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 300, 260, 0.05, 0.07, "sine");
}

/** Der Moment zum Drücken ist da (Trefferfenster offen) — heller, tragender Zielton. */
export function playSlideCue(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 990, 990, 0.16, 0.09, "triangle");
  blip(ac, masterBus(ac), 1480, 1480, 0.1, 0.05, "sine", 0.02);
}

/**
 * „Nachricht gesendet" (Bauplan §4.5): ein aufsteigender Funk-Wusch mit zwei
 * Sende-Piepsen — die Funkwellen verlassen den Mast. Begleitet die Funkwellen-Animation.
 */
export function playRadioSent(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 620, 1500, 0.22, 0.08, "sawtooth"); // Wusch nach oben
  blip(ac, masterBus(ac), 1320, 1320, 0.05, 0.06, "square", 0.05);
  blip(ac, masterBus(ac), 1568, 1568, 0.06, 0.06, "square", 0.13);
}

/**
 * Antwort-Piepsen der Familie (Bauplan §4.5): ein freundlicher kleiner Dur-Dreiklang
 * — die Antwort kommt zurück. Warm (Dreieck), kurz, fröhlich.
 */
export function playFamilyJingle(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 523, 523, 0.12, 0.09, "triangle"); // C
  blip(ac, masterBus(ac), 659, 659, 0.12, 0.09, "triangle", 0.11); // E
  blip(ac, masterBus(ac), 784, 784, 0.12, 0.1, "triangle", 0.22); // G
  blip(ac, masterBus(ac), 1047, 1047, 0.2, 0.1, "triangle", 0.33); // C'
}

/**
 * Aufmerksamkeits-Pieps VOR der Funker-Hilfe (§4.5, Stufe 1): ein ruhiges Zwei-Ton-
 * Signal, klar unterscheidbar vom hellen Anschlag-Pieps — „hör mal, ein Tipp kommt".
 */
export function playRadioHint(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 740, 740, 0.09, 0.07, "sine");
  blip(ac, masterBus(ac), 990, 990, 0.11, 0.07, "sine", 0.11);
}

// Monster-Stimme: Raunen (einmalig) + je Taste eine Ansage (voices/monster/<slug>.m4a).
const monsterBuffers = new Map<string, AudioBuffer | null>();

/** Slug wie in scripts/expedition-voices.mjs (identisch zu {@link fishSlug}). */
export function monsterSlug(unit: string): string {
  return fishSlug(unit);
}

/** Das Monster-Sample einer Taste vorab laden (einen Zug im Voraus, für Latenzfreiheit). */
export function preloadMonsterUnit(unit: string): void {
  const file = `voices/monster/${monsterSlug(unit)}.m4a`;
  if (monsterBuffers.has(file)) return;
  void (async () => {
    monsterBuffers.set(file, await ensureSample(file));
  })();
}

/**
 * Das Raunen des Höhlenwesens (reiner Effekt ohne Inhalt, Bauplan §3/§6.3) — das
 * echte Sample, sonst ein tiefes Synth-Grollen. Wird VOR die Ansage gespielt.
 */
export function playMonsterRaunen(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  if (playSample("voices/monster/raunen.m4a", 0.72)) return;
  void ensureSample("voices/monster/raunen.m4a");
  const now = ac.currentTime;
  const o = ac.createOscillator();
  const g = ac.createGain();
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 620;
  o.type = "sawtooth";
  o.frequency.setValueAtTime(92, now);
  o.frequency.exponentialRampToValueAtTime(58, now + 0.5);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.14, now + 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
  o.connect(lp).connect(g).connect(masterBus(ac));
  o.start(now);
  o.stop(now + 0.6);
}

/**
 * Wie stark die Monster-Samples verlangsamt (und damit vertieft) abgespielt werden.
 * Johannes 14.07.: Das Höhlenwesen klang wie die Erzählerin — es muss DUNKLER und
 * schwerfälliger sein. 0,82 senkt die Tonhöhe um gut drei Halbtöne, ohne die
 * Verständlichkeit zu opfern (Bauplan §3 „Verständlichkeit vor Grusel").
 */
const MONSTER_RATE = 0.82;

/**
 * Die Monster-Ansage einer Taste (fast klar, Bauplan §3 „Verständlichkeit vor
 * Grusel") — in BEIDEN Wegen hörbar TIEF:
 *   • Sample vorhanden → mit {@link MONSTER_RATE} verlangsamt/vertieft abgespielt;
 *   • Sample fehlt (noch nicht geladen, offline, Sounds aus, kein AudioContext) →
 *     die tiefe TTS-Monsterstimme {@link speakMonsterVoice} (früher sprach hier die
 *     ganz normale App-Stimme — dadurch klang das Monster wie die Erzählerin).
 *
 * `text` ist die fertige Ansage (z. B. „K."); fehlt sie, wird der sprechbare Name
 * des Zeichens genommen. Der Rückgabewert sagt (wie bisher), ob die Ansage ÜBERNOMMEN
 * wurde — jetzt immer true, weil dieser Weg selbst tief spricht, wenn kein Sample da
 * ist. Der Sprech-Fallback des Aufrufers (`speakUiAlways`) läuft damit nie mehr an;
 * die Taste geht beim Blindschreiben trotzdem nie verloren.
 */
/**
 * ★ E6c (24.09.2026, Bauplan §6.3): Ton statt Stimme für die Höhle auf Weg
 * „en" - es gibt weder eine englische Monster-Aufnahme noch eine besprochene
 * englische Monster-TTS-Stimme (Vorgabe Johannes: „weglassen, Ton statt
 * Stimme"). Derselbe dunkle Klangcharakter wie {@link playMonsterRaunen}
 * (tiefes, kurzes Sägezahn-Grollen), aber knapper - er kommt bei JEDEM
 * Buchstaben, nicht nur einmal beim Betreten der Höhle.
 */
export function playCaveKeyTone(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  const now = ac.currentTime;
  const o = ac.createOscillator();
  const g = ac.createGain();
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 480;
  o.type = "sawtooth";
  o.frequency.setValueAtTime(150, now);
  o.frequency.exponentialRampToValueAtTime(105, now + 0.14);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  o.connect(lp).connect(g).connect(masterBus(ac));
  o.start(now);
  o.stop(now + 0.18);
}

export function playMonsterSay(unit: string, text?: string): boolean {
  const said = text && text.trim() ? text : `${spokenLabel(unit)}.`;
  const ac = isSoundMuted() ? null : audioContext();
  const file = `voices/monster/${monsterSlug(unit)}.m4a`;
  const buf = ac ? (monsterBuffers.get(file) ?? sample(file)) : undefined;
  if (ac && buf) {
    try {
      const g = ac.createGain();
      // Lauter als die übrigen Earcons: die Monster-Ansage IST der Inhalt der Höhle
      // und muss gegen die (masterBus-freie) System-Vorlese-Stimme bestehen — der
      // masterBus dämpft mit 0,9, darum >1 (Johannes 13.07.: „viel leiser“). Die
      // Dateien sind per loudnorm auf ~−16 LUFS (TP −1,5 dB); 1,1 × 0,9 hält den
      // Ausgang knapp unter Clipping, die Hauptlautheit steckt schon in der Datei.
      g.gain.value = 1.1;
      const src = ac.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = MONSTER_RATE; // dunkler/schwerfälliger als die Erzählerin
      src.connect(g).connect(masterBus(ac));
      src.start();
      return true;
    } catch {
      /* fällt unten auf die TTS-Monsterstimme zurück */
    }
  }
  if (ac && !monsterBuffers.has(file)) {
    // Noch nicht versucht → fürs nächste Mal laden; jetzt spricht die TTS-Stimme.
    void (async () => {
      monsterBuffers.set(file, await ensureSample(file));
    })();
  }
  speakMonsterVoice(said); // tief + langsam (nie die normale Erzählstimme)
  return true;
}

/**
 * Scheitern in der Höhle (Bauplan §4.3): der Pinguin erschrickt und flitzt zum
 * Eingang. Ein kurzer Schreck-Klang (tiefes Wusch + zwei flatternde Herzschläge) —
 * Geisterbahn-Grusel, nie echte Angst.
 */
export function playCaveScare(): void {
  if (isSoundMuted()) return;
  const ac = audioContext();
  if (!ac) return;
  blip(ac, masterBus(ac), 320, 70, 0.5, 0.13, "sawtooth"); // erschrockenes Abfallen
  blip(ac, masterBus(ac), 60, 48, 0.14, 0.16, "sine", 0.12); // Herzschlag
  blip(ac, masterBus(ac), 60, 48, 0.14, 0.16, "sine", 0.34);
}

// --- E7: Rückenwind-Musikschicht (Bauplan §4.8) --------------------------------
//
// Eine sehr leise, warme Klangschicht, die mit dem Rückenwind-Meter an- und abschwillt:
// bei ruhigem, gleichmäßigem Tippen legt sich ein sanfter Dur-Teppich (offene Quinte +
// hoher Oberton) über die Zone. Rein synthetisch → K28-fest (synchron planbar, kein
// Sample-Warten). `setTailwindLevel(0)` blendet sie aus und räumt sie ab.

interface TailwindLayer {
  a: OscillatorNode;
  b: OscillatorNode;
  c: OscillatorNode;
  gain: GainNode;
}
let tailwind: TailwindLayer | null = null;
const TAILWIND_MAX_GAIN = 0.05; // sehr leise (leichte Schicht, §4.8)
const TAILWIND_ON = 0.12; // erst ab etwas Rückenwind einsetzen

/** Rückenwind-Stärke 0..1 setzen — die Musikschicht schwillt weich mit (0 = ausblenden). */
export function setTailwindLevel(level: number): void {
  const lv = Math.max(0, Math.min(1, level));
  if (isSoundMuted() || lv < 0.02) {
    stopTailwind();
    return;
  }
  const ac = audioContext();
  if (!ac) return;
  if (!tailwind) {
    if (lv < TAILWIND_ON) return; // erst ab spürbarem Rückenwind starten
    const gain = ac.createGain();
    gain.gain.value = 0.0001;
    const mk = (f: number): OscillatorNode => {
      const o = ac.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(gain);
      o.start();
      return o;
    };
    const a = mk(261.63); // C4
    const b = mk(392.0); // G4 (offene Quinte = ruhig, warm)
    const c = mk(523.25); // C5 (leiser Oberton-Schimmer)
    gain.connect(masterBus(ac));
    tailwind = { a, b, c, gain };
  }
  try {
    const now = tailwind.gain.context.currentTime;
    tailwind.gain.gain.setTargetAtTime(TAILWIND_MAX_GAIN * lv, now, 0.3);
  } catch {
    /* Context weg — egal */
  }
}

/** Rückenwind-Schicht ausblenden und abräumen. */
function stopTailwind(): void {
  const t = tailwind;
  tailwind = null;
  if (!t) return;
  try {
    const now = t.gain.context.currentTime;
    t.gain.gain.cancelScheduledValues(now);
    t.gain.gain.setValueAtTime(Math.max(t.gain.gain.value, 0.0001), now);
    t.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    t.a.stop(now + 0.55);
    t.b.stop(now + 0.55);
    t.c.stop(now + 0.55);
  } catch {
    /* schon gestoppt */
  }
}

/** Alles aus (Bühne schließen). */
export function stopAllExpedition(): void {
  stopIce();
  stopAmbience();
  stopCaveAmbience();
  stopStormAmbience();
  stopStationAmbience();
  stopTailwind();
}
