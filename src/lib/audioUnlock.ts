/**
 * Web-Audio-Entsperrung für iOS/iPadOS (und strenge Autoplay-Politiken).
 *
 * Fehlerbild auf dem iPad: die Sprachausgabe (speechSynthesis) spricht, aber
 * Web-Audio-Töne bleiben stumm. Zwei Safari-Eigenheiten stecken dahinter:
 *
 *  1. Ein AudioContext startet „suspended" und darf NUR innerhalb einer echten
 *     Nutzer-Geste gestartet werden. Unsere Töne starten aber oft aus einem
 *     setTimeout (Aufgabe ansagen → verzögert anspielen) — ein resume() dort
 *     wird von Safari abgelehnt, und zwar dauerhaft. Darum: globale Gesten-
 *     Horcher (pointerdown/keydown/touchend), die JEDEN registrierten Context
 *     synchron in der Geste resumen und einmal einen stummen Puffer anspielen.
 *
 *  2. Der Lautlos-Schalter (Seitenschalter bzw. Kontrollzentrum „Stumm")
 *     stummt Web Audio komplett (Audio-Session-Kategorie „ambient"), die
 *     Sprachausgabe dagegen NICHT — deckungsgleich mit dem Fehlerbild.
 *     Ein stummes, geloopte <audio>-Element hebt die Session in die
 *     „playback"-Kategorie, dann klingt Web Audio auch bei Lautlos
 *     (bewährter Trick, vgl. github.com/swevans/unmute).
 *
 *  3. Nach App-/Tab-Wechsel bleibt der Context mitunter als „interrupted"
 *     hängen → bei visibilitychange/pageshow/focus erneut resumen.
 *
 * Das stumme Loop-Element läuft nur auf iOS/iPadOS — auf dem Desktop würde es
 * bloß ein „spielt Ton"-Symbol im Browser-Tab erzeugen und nichts nützen.
 */

const contexts = new Set<AudioContext>();
const factories = new Set<() => AudioContext | null>();
let installed = false;
let silentLoop: HTMLAudioElement | null = null;

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
  // iPadOS 13+ meldet sich als „MacIntel" — Touch verrät das iPad.
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

/** ~0,25 s Stille als WAV (8 kHz, mono, 16 bit) — klein, überall abspielbar. */
function silentWavUrl(): string {
  const rate = 8000;
  const samples = 2000;
  const buf = new ArrayBuffer(44 + samples * 2);
  const v = new DataView(buf);
  const str = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i));
  };
  str(0, "RIFF");
  v.setUint32(4, 36 + samples * 2, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, "data");
  v.setUint32(40, samples * 2, true);
  // Datenteil bleibt 0 = Stille.
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

/** Stummes Loop-Element starten/weiterlaufen lassen (nur iOS, nur in Geste). */
function ensureSilentLoop(): void {
  if (!isIos()) return;
  if (!silentLoop) {
    const a = new Audio(silentWavUrl());
    a.loop = true;
    a.setAttribute("playsinline", "");
    a.setAttribute("x-webkit-airplay", "deny");
    (a as HTMLAudioElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
    a.preload = "auto";
    silentLoop = a;
  }
  if (silentLoop.paused) void silentLoop.play().catch(() => {});
}

/**
 * ★ Bluetooth-Leitung wach halten (Tester 13.11.2026: „Lautvorlesen mit
 * Kopfhörern verzögert"; Johannes: „Ist es nicht ohnehin gut, die
 * Bluetooth-Verbindung aufrecht zu erhalten?").
 *
 * Bluetooth-Kopfhörer bauen die Leitung ab, sobald nichts klingt. Die nächste
 * Ansage wartet dann, bis sie wieder steht - der Anfang kommt spät oder fehlt.
 * Bei „Ton aus" (der Normalfall) gibt es zwischen zwei Ansagen gar keinen
 * Klang. Darum läuft ab der ersten Geste ein eigenes, unhörbares Signal
 * (-80 dBFS, unter Chromes Grenze -72 dBFS für das Lautsprecher-Zeichen im
 * Tab) - echte Stille würde manche Kopfhörer trotzdem schlafen lassen.
 * Nur solange die Seite sichtbar ist. Auf iOS übernimmt das das Loop-Element.
 */
let leitung: AudioContext | null = null;
const LEITUNG_PEGEL = 0.0001; // -80 dBFS

function leitungWachHalten(): void {
  if (isIos() || leitung || typeof AudioContext === "undefined") return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 30;
    const g = ctx.createGain();
    g.gain.value = LEITUNG_PEGEL;
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    void ctx.resume();
    leitung = ctx;
  } catch {
    /* Audio nicht verfügbar - unkritisch */
  }
}

/** Alle registrierten Contexte anstoßen; in einer Geste zusätzlich entsperren. */
function resumeAll(inGesture: boolean): void {
  for (const ctx of contexts) {
    try {
      // iOS kennt zusätzlich den nicht-standardisierten Zustand "interrupted".
      if (ctx.state === "running") continue;
      void ctx.resume();
      if (inGesture) {
        // Ein stummer 1-Frame-Puffer „weckt" die Audio-Hardware verlässlich.
        const src = ctx.createBufferSource();
        src.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
        src.connect(ctx.destination);
        src.start(0);
      }
    } catch {
      /* Audio nicht verfügbar — unkritisch */
    }
  }
}

/**
 * Registrierte Context-Fabriken in der Geste aufrufen — erzeugt einen noch
 * fehlenden AudioContext, damit ein automatisch (nicht geste-gebunden) startender
 * Ton ihn bereits scharfgeschaltet vorfindet (s. primeOnGesture).
 */
function runFactories(): void {
  for (const make of factories) {
    try {
      make();
    } catch {
      /* Audio nicht verfügbar — unkritisch */
    }
  }
}

function install(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  const onGesture = () => {
    ensureSilentLoop();
    leitungWachHalten();
    runFactories();
    resumeAll(true);
  };
  // Dauerhaft installiert (nicht once): nach jedem App-Wechsel/Interrupt
  // entsperrt die nächste Berührung wieder. Kosten pro Tipper: vernachlässigbar.
  window.addEventListener("pointerdown", onGesture, { capture: true, passive: true });
  window.addEventListener("keydown", onGesture, { capture: true, passive: true });
  window.addEventListener("touchend", onGesture, { capture: true, passive: true });
  const onVisible = () => {
    if (document.visibilityState === "hidden") {
      silentLoop?.pause();
      void leitung?.suspend().catch(() => {});
      return;
    }
    if (silentLoop && silentLoop.paused) void silentLoop.play().catch(() => {});
    void leitung?.resume().catch(() => {});
    resumeAll(false);
  };
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("pageshow", onVisible);
  window.addEventListener("focus", () => resumeAll(false));
}

/**
 * Einen AudioContext für die Gesten-Entsperrung registrieren. Bei jeder
 * Nutzer-Geste (und bei Rückkehr in den Tab) wird er automatisch resumed.
 * Mehrfaches Registrieren desselben Contexts ist harmlos.
 */
export function keepAudioAlive(ctx: AudioContext): void {
  contexts.add(ctx);
  install();
  if (ctx.state !== "running") {
    try {
      void ctx.resume();
    } catch {
      /* unkritisch */
    }
  }
}

/**
 * Eine AudioContext-Fabrik registrieren, die bei der NÄCHSTEN Nutzergeste den
 * Context ERZEUGT (nicht nur resumt) und sofort scharfschaltet. Nötig für Töne,
 * die AUTOMATISCH starten (z. B. die Melodie einer Hör-Aufgabe nach kurzer
 * Verzögerung): sie kommen selbst aus keinem Klick, brauchen aber einen bereits
 * „running" gemachten Context — sonst blockiert die Autoplay-Politik sie (iOS
 * immer, Desktop bis zur ersten Interaktion). So wird der Context schon beim
 * ersten Tipp/Klick (z. B. Kapitelwahl) angelegt und geweckt. Idempotent; die
 * Fabrik selbst muss denselben Context zurückgeben (nicht bei jedem Aufruf neu).
 */
export function primeOnGesture(factory: () => AudioContext | null): void {
  factories.add(factory);
  install();
}
