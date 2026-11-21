/**
 * ★★★ MELODIE BEIM TIPPEN (15.10.2026, Wunsch Johannes).
 *
 * Jeder richtige Anschlag spielt den NÄCHSTEN Ton einer Melodie. Wer
 * gleichmässig tippt, spielt so ein Lied - das ist der ganze Zweck: Kinder
 * sollen Lust bekommen, im Rhythmus zu tippen.
 *
 * Drei Teile:
 *   1. Die Melodien (`melodienListe.ts`) - nur Gemeinfreies und Eigenes.
 *   2. Die Klänge (unten, `KLAENGE`) - alle per Web Audio erzeugt, keine
 *      Datei, kein Laden: Spieluhr bis Monster-Chor. Darum klingt der erste
 *      Ton sofort, auch am iPad ([[feedback_web_audio_gesture]]: geplant wird
 *      SYNCHRON im Anschlag, nie hinter einem `await`).
 *   3. Die Band: Tippt ein Kind eine Weile gleichmässig, spielt erst ein Bass
 *      mit, dann ein Schlagzeug. Wird es unregelmässig, hört die Band wieder
 *      auf. Das ist die hörbare Belohnung für den Rhythmus.
 *
 * ★★ RECHTES OHR: Ist das Vorlesen an, liegt die Melodie ganz rechts
 *   (`StereoPannerNode`, pan = 1). Die Stimme selbst lässt sich NICHT auf ein
 *   Ohr legen - sie ist die Sprachausgabe des Browsers (`speechSynthesis`),
 *   und die gibt ihren Ton an keiner Stelle an Web Audio heraus. Gemessen
 *   bleibt also: Stimme auf beiden Ohren, Melodie nur rechts.
 *
 * ★ Ton aus (`isSoundMuted`) gilt auch hier - die Melodie ist ein Ton wie
 *   jeder andere ([[feedback_ton_aus_ist_der_normalfall]]). Sie trägt keine
 *   Information: Wer sie nicht hört, verpasst nichts ausser dem Spass.
 */
import { create } from "zustand";
import type { Lang } from "./account";
import { isSoundMuted, setSoundMuted, tonKontext } from "./sound";
import { useVoice } from "./voice";
import { lautstaerke, useLautstaerke } from "./lautstaerke";
import { MELODIEN as EIGENE_MELODIEN, type Melodie } from "./melodienListe";
import { bereit, laden, restLaden, sampleSpielen } from "./melodieSampler";
import { MELODIEN_KLANGPUNKTE } from "./melodienKlangpunkte";
import { mitRueckfallEn } from "@/lib/typing/sprachRegister";

export type { Melodie };

/** Alle Melodien: die eigene Sammlung und die geprüften Lieder aus Klangpunkte. */
export const MELODIEN: readonly Melodie[] = [...EIGENE_MELODIEN, ...MELODIEN_KLANGPUNKTE];

// ---------------------------------------------------------------------------
// Noten lesen
// ---------------------------------------------------------------------------

export interface Note {
  /** MIDI-Nummer, C4 = 60 (bei einer Pause 0 und ohne Bedeutung) */
  midi: number;
  /** Länge in Vierteln */
  laenge: number;
  /** ★ Pause (19.10.2026): der Anschlag zählt, aber es klingt nichts. */
  pause?: true;
}

const STAMM: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/**
 * „C4 D#4:0.5 | G4:2 R" ⇒ Noten. Unbekannte Tokens werfen - der Wächter-Test fängt sie.
 *
 * ★ PAUSEN (19.10.2026, Wunsch Johannes): `R` oder `R:2` ist eine Pause. Mit
 * `mitPausen` (Vorgabe) wird sie eine stumme Note - ein Anschlag, kein Ton.
 * Ohne verlängert sie den Ton davor, wie vor dem Schalter (eine Pause am
 * Anfang entfällt dann). Jede Pause ist EIN Anschlag, gleich wie lang sie ist.
 */
export function parseNoten(noten: string, mitPausen = true): Note[] {
  const out: Note[] = [];
  for (const tok of noten.trim().split(/\s+/)) {
    if (!tok || tok === "|") continue;
    const r = /^R(?::([0-9.]+))?$/.exec(tok);
    if (r) {
      const laenge = r[1] ? Number(r[1]) : 1;
      if (!(laenge > 0)) throw new Error(`Falsche Länge: ${tok}`);
      if (mitPausen) out.push({ midi: 0, laenge, pause: true });
      else if (out.length) out[out.length - 1].laenge += laenge;
      continue;
    }
    const m = /^([A-G])([#b]?)([0-9])(?::([0-9.]+))?$/.exec(tok);
    if (!m) throw new Error(`Unbekannte Note: ${tok}`);
    const vorzeichen = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
    const midi = (Number(m[3]) + 1) * 12 + STAMM[m[1]] + vorzeichen;
    const laenge = m[4] ? Number(m[4]) : 1;
    if (!(laenge > 0)) throw new Error(`Falsche Länge: ${tok}`);
    out.push({ midi, laenge });
  }
  return out;
}

function hz(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ---------------------------------------------------------------------------
// Klänge
// ---------------------------------------------------------------------------

export const KLAENGE = [
  // ★ 16.10.2026: die vier ersten sind AUFNAHMEN (melodieSampler.ts)
  "klavier",
  "gitarre",
  "saxophon",
  "floete",
  "spieluhr",
  "xylophon",
  "orgel",
  "videospiel",
  "monster",
  "gespenst",
  "roboter",
  "katze",
  "frosch",
  "vogel",
  "elefant",
  "alien",
  "blubb",
  "drache",
] as const;
export type KlangId = (typeof KLAENGE)[number];
export type KlangWahl = KlangId | "zufall";

const KLANG_NAMEN: Record<KlangWahl, Record<Lang, string>> = {
  zufall: mitRueckfallEn({ de: "Überraschung - jedes Lied ein anderer Klang", en: "Surprise - a new sound for every tune", fr: "Surprise - un son différent pour chaque air", es: "Sorpresa - un sonido distinto en cada canción", it: "Sorpresa - un suono diverso per ogni melodia", pl: "Niespodzianka - każda melodia inny dźwięk", tr: "Sürpriz - her ezgide başka bir ses", cs: "Překvapení - každá melodie jiný zvuk", bg: "Изненада - всяка мелодия с различен звук", el: "Έκπληξη - άλλος ήχος σε κάθε μελωδία", hu: "Meglepetés - minden dallam más hangon szól", nl: "Verrassing - elke melodie een andere klank", pt: "Surpresa - um som diferente em cada melodia", br: "Surpresa - um som diferente em cada melodia", ro: "Surpriză - alt sunet la fiecare melodie", sv: "Överraskning - nytt ljud i varje melodi", uk: "Сюрприз - у кожній мелодії інший звук" }),
  spieluhr: mitRueckfallEn({ de: "Spieluhr", en: "Music box", fr: "Boite à musique", es: "Caja de música", it: "Carillon", pl: "Pozytywka", tr: "Müzik kutusu", cs: "Hrací skříňka", bg: "Музикална кутия", el: "Μουσικό κουτί", hu: "Zenedoboz", nl: "Speeldoos", pt: "Caixa de música", br: "Caixinha de música", ro: "Cutie muzicală", sv: "Speldosa", uk: "Музична скринька" }),
  klavier: mitRueckfallEn({ de: "Klavier", en: "Piano", fr: "Piano", es: "Piano", it: "Pianoforte", pl: "Pianino", tr: "Piyano", cs: "Klavír", bg: "Пиано", el: "Πιάνο", hu: "Zongora", nl: "Piano", pt: "Piano", br: "Piano", ro: "Pian", sv: "Piano", uk: "Піаніно" }),
  xylophon: mitRueckfallEn({ de: "Xylophon", en: "Xylophone", fr: "Xylophone", es: "Xilófono", it: "Xilofono", pl: "Ksylofon", tr: "Ksilofon", cs: "Xylofon", bg: "Ксилофон", el: "Ξυλόφωνο", hu: "Xilofon", nl: "Xylofoon", pt: "Xilofone", br: "Xilofone", ro: "Xilofon", sv: "Xylofon", uk: "Ксилофон" }),
  orgel: mitRueckfallEn({ de: "Orgel", en: "Organ", fr: "Orgue", es: "Órgano", it: "Organo", pl: "Organy", tr: "Org", cs: "Varhany", bg: "Орган", el: "Εκκλησιαστικό όργανο", hu: "Orgona", nl: "Orgel", pt: "Órgão", br: "Órgão", ro: "Orgă", sv: "Orgel", uk: "Орган" }),
  floete: mitRueckfallEn({ de: "Querflöte", en: "Flute", fr: "Flute traversière", es: "Flauta travesera", it: "Flauto traverso", pl: "Flet poprzeczny", tr: "Yan flüt", cs: "Příčná flétna", bg: "Флейта", el: "Φλάουτο", hu: "Fuvola", nl: "Dwarsfluit", pt: "Flauta transversal", br: "Flauta transversal", ro: "Flaut", sv: "Tvärflöjt", uk: "Флейта" }),
  gitarre: mitRueckfallEn({ de: "Gitarre", en: "Guitar", fr: "Guitare", es: "Guitarra", it: "Chitarra", pl: "Gitara", tr: "Gitar", cs: "Kytara", bg: "Китара", el: "Κιθάρα", hu: "Gitár", nl: "Gitaar", pt: "Guitarra", br: "Violão", ro: "Chitară", sv: "Gitarr", uk: "Гітара" }),
  saxophon: mitRueckfallEn({ de: "Saxophon", en: "Saxophone", fr: "Saxophone", es: "Saxofón", it: "Sassofono", pl: "Saksofon", tr: "Saksafon", cs: "Saxofon", bg: "Саксофон", el: "Σαξόφωνο", hu: "Szaxofon", nl: "Saxofoon", pt: "Saxofone", br: "Saxofone", ro: "Saxofon", sv: "Saxofon", uk: "Саксофон" }),
  videospiel: mitRueckfallEn({ de: "Videospiel", en: "Video game", fr: "Jeu vidéo", es: "Videojuego", it: "Videogioco", pl: "Gra wideo", tr: "Video oyunu", cs: "Videohra", bg: "Видеоигра", el: "Βιντεοπαιχνίδι", hu: "Videojáték", nl: "Videogame", pt: "Videojogo", br: "Videogame", ro: "Joc video", sv: "Datorspel", uk: "Відеогра" }),
  monster: mitRueckfallEn({ de: "Monster-Chor", en: "Monster choir", fr: "Chorale de monstres", es: "Coro de monstruos", it: "Coro di mostri", pl: "Chór potworów", tr: "Canavar korosu", cs: "Sbor příšer", bg: "Хор от чудовища", el: "Χορωδία τεράτων", hu: "Szörnykórus", nl: "Monsterkoor", pt: "Coro de monstros", br: "Coral de monstros", ro: "Cor de monștri", sv: "Monsterkör", uk: "Хор чудовиськ" }),
  gespenst: mitRueckfallEn({ de: "Gespenst", en: "Ghost", fr: "Fantôme", es: "Fantasma", it: "Fantasma", pl: "Duch", tr: "Hayalet", cs: "Strašidlo", bg: "Призрак", el: "Φάντασμα", hu: "Szellem", nl: "Spook", pt: "Fantasma", br: "Fantasma", ro: "Fantomă", sv: "Spöke", uk: "Привид" }),
  roboter: mitRueckfallEn({ de: "Roboter", en: "Robot", fr: "Robot", es: "Robot", it: "Robot", pl: "Robot", tr: "Robot", cs: "Robot", bg: "Робот", el: "Ρομπότ", hu: "Robot", nl: "Robot", pt: "Robô", br: "Robô", ro: "Robot", sv: "Robot", uk: "Робот" }),
  katze: mitRueckfallEn({ de: "Katzen-Chor", en: "Cat choir", fr: "Chorale de chats", es: "Coro de gatos", it: "Coro di gatti", pl: "Chór kotów", tr: "Kedi korosu", cs: "Kočičí sbor", bg: "Котешки хор", el: "Χορωδία γατών", hu: "Macskakórus", nl: "Kattenkoor", pt: "Coro de gatos", br: "Coral de gatos", ro: "Cor de pisici", sv: "Kattkör", uk: "Котячий хор" }),
  frosch: mitRueckfallEn({ de: "Frösche", en: "Frogs", fr: "Grenouilles", es: "Ranas", it: "Rane", pl: "Żaby", tr: "Kurbağalar", cs: "Žáby", bg: "Жаби", el: "Βατράχια", hu: "Békák", nl: "Kikkers", pt: "Rãs", br: "Sapos", ro: "Broaște", sv: "Grodor", uk: "Жаби" }),
  vogel: mitRueckfallEn({ de: "Vögel", en: "Birds", fr: "Oiseaux", es: "Pájaros", it: "Uccellini", pl: "Ptaki", tr: "Kuşlar", cs: "Ptáci", bg: "Птици", el: "Πουλιά", hu: "Madarak", nl: "Vogels", pt: "Pássaros", br: "Passarinhos", ro: "Păsări", sv: "Fåglar", uk: "Пташки" }),
  elefant: mitRueckfallEn({ de: "Elefant", en: "Elephant", fr: "Éléphant", es: "Elefante", it: "Elefante", pl: "Słoń", tr: "Fil", cs: "Slon", bg: "Слон", el: "Ελέφαντας", hu: "Elefánt", nl: "Olifant", pt: "Elefante", br: "Elefante", ro: "Elefant", sv: "Elefant", uk: "Слон" }),
  alien: mitRueckfallEn({ de: "Außerirdische", en: "Aliens", fr: "Extraterrestres", es: "Extraterrestres", it: "Alieni", pl: "Kosmici", tr: "Uzaylılar", cs: "Mimozemšťané", bg: "Извънземни", el: "Εξωγήινοι", hu: "Földönkívüliek", nl: "Buitenaardse wezens", pt: "Extraterrestres", br: "Extraterrestres", ro: "Extratereștri", sv: "Utomjordingar", uk: "Прибульці" }),
  blubb: mitRueckfallEn({ de: "Seifenblasen", en: "Bubbles", fr: "Bulles", es: "Burbujas", it: "Bolle di sapone", pl: "Bańki mydlane", tr: "Baloncuklar", cs: "Bubliny", bg: "Сапунени мехури", el: "Σαπουνόφουσκες", hu: "Szappanbuborékok", nl: "Zeepbellen", pt: "Bolas de sabão", br: "Bolhas de sabão", ro: "Baloane de săpun", sv: "Såpbubblor", uk: "Мильні бульбашки" }),
  drache: mitRueckfallEn({ de: "Drache", en: "Dragon", fr: "Dragon", es: "Dragón", it: "Drago", pl: "Smok", tr: "Ejderha", cs: "Drak", bg: "Дракон", el: "Δράκος", hu: "Sárkány", nl: "Draak", pt: "Dragão", br: "Dragão", ro: "Dragon", sv: "Drake", uk: "Дракон" }),
};

/**
 * ★ Kandidaten je Instrument (16.10.2026): Johannes hört sie auf der
 * Hörproben-Seite (`hoerprobe-melodie.html`) an und wählt; die Wahl steht dann
 * HIER als erster Eintrag. Bis dahin gilt der erste.
 */
export const KANDIDATEN: Record<string, readonly string[]> = {
  // ★ Johannes' Wahl in den Hörproben, 16.10.2026. Die anderen Kandidaten
  //   (klavier-ff, gitarre-ff, floete-vib, sax-vib) sind wieder entfernt -
  //   neu erzeugen mit `node scripts/melodie-instrumente.mjs <kandidat>`.
  klavier: ["klavier-mf"],
  gitarre: ["gitarre-mf"],
  floete: ["floete-novib"],
  sax: ["sax-novib"],
};
const KANDIDAT_SPEICHER = "tippen-melodie-kandidat";
/** Nur für die Hörproben: einen Kandidaten vorübergehend wählen (dieses Gerät). */
export function kandidatWaehlen(instrument: string, satz: string): void {
  try {
    const d = JSON.parse(localStorage.getItem(KANDIDAT_SPEICHER) ?? "{}") as Record<string, string>;
    d[instrument] = satz;
    localStorage.setItem(KANDIDAT_SPEICHER, JSON.stringify(d));
  } catch {
    /* egal */
  }
}
/** Kandidat „erzeugt" = ohne Aufnahme (nur für den Vergleich in den Hörproben). */
export const OHNE_AUFNAHME = "erzeugt";
function satzVon(sample: string): string | null {
  let d: Record<string, string> = {};
  try {
    d = JSON.parse(localStorage.getItem(KANDIDAT_SPEICHER) ?? "{}") as Record<string, string>;
  } catch {
    /* egal */
  }
  if (d[sample] === OHNE_AUFNAHME) return null;
  const k = KANDIDATEN[sample];
  if (!k) return sample; // Stimmen-Satz
  try {
    if (d[sample] && k.includes(d[sample])) return d[sample];
  } catch {
    /* egal */
  }
  return k[0];
}
/** Der Satz, aus dem dieser Ton kommt (Silben reihum). */
function satzFuer(art: KlangArt, schritt: number): string | null {
  if (!art.sample) return null;
  const s = typeof art.sample === "string" ? art.sample : art.sample[schritt % art.sample.length];
  return satzVon(s);
}
function alleSaetze(art: KlangArt): string[] {
  if (!art.sample) return [];
  return (typeof art.sample === "string" ? [art.sample] : [...art.sample])
    .map(satzVon)
    .filter((x): x is string => x !== null);
}

export function klangName(id: KlangWahl, lang: Lang): string {
  return KLANG_NAMEN[id][lang] ?? KLANG_NAMEN[id].de;
}

export function melodieName(m: Melodie, lang: Lang): string {
  return m.name[lang] ?? m.name.en ?? m.name.de;
}

const ZUFALL_NAMEN: Record<Lang, string> = {
  de: "Überraschung - ein Lied nach dem anderen",
  en: "Surprise - one tune after another",
  fr: "Surprise - un air après l'autre",
  es: "Sorpresa - una canción tras otra",
  it: "Sorpresa - una melodia dopo l'altra",
  pl: "Niespodzianka - melodia za melodią",
  tr: "Sürpriz - ezgiler art arda",
  cs: "Překvapení - jedna melodie za druhou",
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: "Изненада - мелодия след мелодия",
  el: "Έκπληξη - η μία μελωδία μετά την άλλη",
  hu: "Meglepetés - egyik dallam a másik után",
  nl: "Verrassing - de ene melodie na de andere",
  pt: "Surpresa - uma melodia atrás da outra",
  br: "Surpresa - uma melodia atrás da outra",
  ro: "Surpriză - o melodie după alta",
  sv: "Överraskning - den ena melodin efter den andra",
  uk: "Сюрприз - мелодія за мелодією",
};
export function melodieZufallName(lang: Lang): string {
  return ZUFALL_NAMEN[lang] ?? ZUFALL_NAMEN.de;
}

/** Wie ein Klang gespielt wird: Oktavlage und ob der vorige Ton abreisst. */
interface KlangArt {
  /**
   * Lautstärke-Ausgleich, GEMESSEN (15.10.2026, OfflineAudioContext, G4,
   * 0,4 s): ohne ihn lagen die Klänge bis Faktor 7 auseinander. Ziel ist
   * eine Spitze um 0,2 - leiser als der Fehlerton, damit der hörbar bleibt.
   */
  pegel: number;
  /**
   * Aufnahme statt Erzeugung (16.10.2026): ein Instrument mit Kandidaten
   * ({@link KANDIDATEN}) oder Stimmen-Sätze (mehrere ⇒ Silben reihum). Bis ein
   * Ton geladen ist, spielt `spiel`.
   */
  sample?: string | readonly string[];
  /** Pegel der Aufnahme, gemessen wie `pegel` (16.10.2026, mit Hall). */
  samplePegel?: number;
  /** Ausklingen nach dem Ton (s) - Angeschlagenes klingt nach, Geblasenes endet. */
  ausklang?: number;
  oktave: number; // Halbtöne
  mono: boolean; // Stimmen singen nacheinander, Glocken klingen ineinander
  spiel: (k: KlangKontext) => void;
}

interface KlangKontext {
  ac: BaseAudioContext;
  ziel: AudioNode;
  f: number; // Grundfrequenz
  vorher: number | null; // Frequenz des vorigen Tons (für Gleiten)
  t: number; // Startzeit
  dur: number; // Länge in Sekunden
  schritt: number; // der wievielte Ton - für wechselnde Silben
  /** Die Hüllkurve des Tons - damit der nächste Ton sie abschneiden kann. */
  huelle: GainNode;
}

const VOKALE: Record<string, [number, number, number]> = {
  a: [800, 1150, 2900],
  e: [400, 2000, 2600],
  i: [300, 2300, 3000],
  o: [450, 800, 2830],
  u: [325, 700, 2530],
};

let rauschPuffer: AudioBuffer | null = null;
function rauschen(ac: BaseAudioContext): AudioBuffer {
  if (rauschPuffer && rauschPuffer.sampleRate === ac.sampleRate) return rauschPuffer;
  const buf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  rauschPuffer = buf;
  return buf;
}

let verzerrKurve: Float32Array<ArrayBuffer> | null = null;
function verzerrung(): Float32Array<ArrayBuffer> {
  if (verzerrKurve) return verzerrKurve;
  const n = 1024;
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    c[i] = Math.tanh(3 * x);
  }
  verzerrKurve = c;
  return c;
}

/** Hüllkurve: Anstieg, kurz halten, dann ausklingen. */
function huelleSetzen(
  g: GainNode,
  t: number,
  anstieg: number,
  spitze: number,
  dur: number,
  halten = 0.4,
): void {
  const p = g.gain;
  p.setValueAtTime(0.0001, t);
  p.exponentialRampToValueAtTime(spitze, t + anstieg);
  const haltEnde = t + Math.max(anstieg, dur * halten);
  p.setValueAtTime(spitze, haltEnde);
  p.exponentialRampToValueAtTime(0.0001, t + dur);
}

function osz(ac: BaseAudioContext, typ: OscillatorType, f: number, t: number, ende: number): OscillatorNode {
  const o = ac.createOscillator();
  o.type = typ;
  o.frequency.setValueAtTime(f, t);
  o.start(t);
  o.stop(ende + 0.05);
  return o;
}

/** Leichtes Vibrato auf eine Frequenz legen (Tiefe als Anteil, z. B. 0.02). */
function vibrato(k: KlangKontext, ziel: AudioParam, rate: number, tiefe: number, verzoegert = 0.12): void {
  const lfo = osz(k.ac, "sine", rate, k.t, k.t + k.dur);
  const g = k.ac.createGain();
  g.gain.setValueAtTime(0, k.t);
  g.gain.linearRampToValueAtTime(k.f * tiefe, k.t + Math.min(k.dur, verzoegert + 0.1));
  lfo.connect(g).connect(ziel);
}

/**
 * Eine singende Stimme: Sägezahn durch drei Formant-Filter. Die Vokalfolge
 * macht aus einem Ton eine Silbe („miau", „buu", „waa").
 */
function formantStimme(
  k: KlangKontext,
  o: {
    vokale: string[];
    spitze: number;
    formantFaktor?: number;
    verstimmung?: number[]; // Cent je Stimme (Chor)
    tonVerlauf?: Array<[number, number]>; // [Anteil der Dauer, Faktor der Frequenz]
    vib?: [number, number]; // Rate, Tiefe
    anstieg?: number;
    quelle?: OscillatorType;
  },
): void {
  const { ac, t, dur } = k;
  const ende = t + dur;
  const summe = ac.createGain();
  summe.gain.value = 1;
  for (const cent of o.verstimmung ?? [0]) {
    const s = osz(ac, o.quelle ?? "sawtooth", k.f, t, ende);
    s.detune.setValueAtTime(cent, t);
    for (const [anteil, faktor] of o.tonVerlauf ?? []) {
      s.frequency.linearRampToValueAtTime(k.f * faktor, t + dur * anteil);
    }
    if (o.vib) vibrato(k, s.frequency, o.vib[0], o.vib[1]);
    s.connect(summe);
  }
  const ff = o.formantFaktor ?? 1;
  const staerken = [1, 0.7, 0.3];
  const qs = [5, 8, 10];
  for (let i = 0; i < 3; i++) {
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = qs[i];
    o.vokale.forEach((v, j) => {
      const f = VOKALE[v][i] * ff;
      const zeit = t + (o.vokale.length === 1 ? 0 : (dur * 0.8 * j) / (o.vokale.length - 1));
      if (j === 0) bp.frequency.setValueAtTime(f, zeit);
      else bp.frequency.linearRampToValueAtTime(f, zeit);
    });
    const g = ac.createGain();
    g.gain.value = staerken[i] * 4; // Bandpässe schlucken viel - hier ausgleichen
    summe.connect(bp).connect(g).connect(k.huelle);
  }
  huelleSetzen(k.huelle, t, o.anstieg ?? 0.03, o.spitze, dur, 0.6);
  k.huelle.connect(k.ziel);
}

/** Einfacher Ton mit Obertönen (Glocken, Klavier, Orgel). */
function obertoene(
  k: KlangKontext,
  teile: Array<[number, number, number?]>, // [Frequenzfaktor, Stärke, eigene Abklingzeit]
  typ: OscillatorType,
  spitze: number,
  anstieg = 0.005,
): void {
  const { ac, t, dur } = k;
  for (const [faktor, staerke, abkling] of teile) {
    const o = osz(ac, typ, k.f * faktor, t, t + dur);
    const g = ac.createGain();
    const d = abkling ? Math.min(dur, abkling) : dur;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(staerke, t + anstieg);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(k.huelle);
  }
  k.huelle.gain.setValueAtTime(spitze, t);
  k.huelle.gain.setValueAtTime(spitze, t + dur);
  k.huelle.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.04);
  k.huelle.connect(k.ziel);
}

function rauschStoss(k: KlangKontext, filterTyp: BiquadFilterType, f: number, q: number, laenge: number, spitze: number, an = k.t): void {
  const { ac } = k;
  const src = ac.createBufferSource();
  src.buffer = rauschen(ac);
  const bp = ac.createBiquadFilter();
  bp.type = filterTyp;
  bp.frequency.value = f;
  bp.Q.value = q;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, an);
  g.gain.exponentialRampToValueAtTime(spitze, an + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, an + laenge);
  src.connect(bp).connect(g).connect(k.ziel);
  src.start(an);
  src.stop(an + laenge + 0.05);
}

const SILBEN_MONSTER = [["o", "u"], ["a", "o"], ["u", "o"], ["o", "a"]];

const KLANG: Record<KlangId, KlangArt> = {
  gitarre: {
    pegel: 1.3,
    sample: "gitarre",
    samplePegel: 0.65, // wie Klavier (gleiche Aufbereitung) - nachmessen, wenn aufbereitet
    ausklang: 0.9,
    oktave: -12,
    mono: false,
    spiel: (k) => KLANG.klavier.spiel(k), // bis die Aufnahme da ist
  },
  saxophon: {
    pegel: 0.85,
    sample: "sax",
    samplePegel: 1,
    ausklang: 0.12,
    oktave: -3, // Altsaxophon klingt Db3-A5 - drei Halbtöne tiefer liegt jedes Lied darin
    mono: true,
    spiel: (k) => KLANG.elefant.spiel(k), // bis die Aufnahme da ist
  },
  spieluhr: {
    pegel: 1.3,
    oktave: 12,
    mono: false,
    spiel: (k) => {
      k.dur = Math.max(k.dur, 0.6);
      obertoene(k, [[1, 0.5], [2, 0.25, 0.4], [3.01, 0.12, 0.2], [5.4, 0.05, 0.08]], "sine", 0.3);
    },
  },
  klavier: {
    pegel: 1.3,
    sample: "klavier",
    samplePegel: 0.85, // gemessen 16.10. (Iowa mf): Spitze 0,16 bei 0,65 - Ziel um 0,22
    ausklang: 0.9,
    oktave: 0,
    mono: false,
    spiel: (k) => {
      k.dur = Math.max(k.dur, 0.5);
      obertoene(k, [[1, 0.5], [2, 0.22, 0.5], [3, 0.1, 0.3], [4, 0.05, 0.15]], "triangle", 0.35, 0.004);
    },
  },
  xylophon: {
    pegel: 1.2,
    oktave: 12,
    mono: false,
    spiel: (k) => {
      k.dur = Math.min(Math.max(k.dur, 0.25), 0.5);
      obertoene(k, [[1, 0.6], [3.93, 0.15, 0.06], [9.2, 0.05, 0.02]], "sine", 0.4, 0.002);
    },
  },
  orgel: {
    pegel: 0.7,
    oktave: 0,
    mono: true,
    spiel: (k) => {
      const { ac, t, dur } = k;
      for (const [faktor, staerke] of [[1, 0.5], [2, 0.3], [3, 0.15], [4, 0.1]] as const) {
        const o = osz(ac, "sine", k.f * faktor, t, t + dur);
        const g = ac.createGain();
        g.gain.value = staerke;
        o.connect(g).connect(k.huelle);
      }
      huelleSetzen(k.huelle, t, 0.02, 0.3, dur, 0.85);
      k.huelle.connect(k.ziel);
    },
  },
  floete: {
    pegel: 0.45,
    sample: "floete",
    samplePegel: 1,
    ausklang: 0.12,
    oktave: 12,
    mono: true,
    spiel: (k) => {
      const { ac, t, dur } = k;
      const o = osz(ac, "sine", k.f, t, t + dur);
      vibrato(k, o.frequency, 5.5, 0.012, 0.15);
      const o2 = osz(ac, "triangle", k.f * 2, t, t + dur);
      const g2 = ac.createGain();
      g2.gain.value = 0.08;
      o.connect(k.huelle);
      o2.connect(g2).connect(k.huelle);
      huelleSetzen(k.huelle, t, 0.05, 0.35, dur, 0.7);
      k.huelle.connect(k.ziel);
      rauschStoss(k, "bandpass", k.f * 2, 2, 0.08, 0.04); // Anblasen
    },
  },
  videospiel: {
    pegel: 0.9,
    oktave: 0,
    mono: true,
    spiel: (k) => {
      const { ac, t, dur } = k;
      const o = osz(ac, "square", k.f, t, t + dur);
      // kleiner Sprung von oben - typisch für alte Spielkonsolen
      o.frequency.setValueAtTime(k.f * 2, t);
      o.frequency.setValueAtTime(k.f, t + 0.025);
      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 3500;
      o.connect(lp).connect(k.huelle);
      huelleSetzen(k.huelle, t, 0.004, 0.12, dur, 0.7);
      k.huelle.connect(k.ziel);
    },
  },
  monster: {
    sample: ["monster-buh", "monster-wah"],
    ausklang: 0.1,
    samplePegel: 0.9, // gemessen 16.10.: Stimmen-Aufnahmen (-20 LUFS) Spitze 0,1 bei Pegel 0,4
    pegel: 0.4,
    oktave: -12,
    mono: true,
    spiel: (k) => {
      formantStimme(k, {
        vokale: SILBEN_MONSTER[k.schritt % SILBEN_MONSTER.length],
        spitze: 0.3,
        formantFaktor: 0.75,
        verstimmung: [-14, 0, 12],
        tonVerlauf: [[0.08, 1]],
        vib: [4.5, 0.025],
        anstieg: 0.04,
      });
      // Knurren: eine Unteroktave, leicht verzerrt
      const { ac, t, dur } = k;
      const sub = osz(ac, "sawtooth", k.f / 2, t, t + dur);
      const ws = ac.createWaveShaper();
      ws.curve = verzerrung();
      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 400;
      const g = ac.createGain();
      g.gain.value = 0.25;
      sub.connect(ws).connect(lp).connect(g).connect(k.huelle);
    },
  },
  gespenst: {
    pegel: 0.5,
    oktave: 12,
    mono: true,
    spiel: (k) => {
      const { ac, t } = k;
      const dur = (k.dur = Math.max(k.dur, 0.35));
      const o = osz(ac, "sine", k.vorher ?? k.f, t, t + dur);
      o.frequency.exponentialRampToValueAtTime(k.f, t + Math.min(0.12, dur * 0.4));
      vibrato(k, o.frequency, 6, 0.03, 0.05);
      const o2 = osz(ac, "triangle", k.f * 1.005, t, t + dur);
      const g2 = ac.createGain();
      g2.gain.value = 0.15;
      o.connect(k.huelle);
      o2.connect(g2).connect(k.huelle);
      huelleSetzen(k.huelle, t, 0.09, 0.3, dur, 0.7);
      k.huelle.connect(k.ziel);
    },
  },
  roboter: {
    // Erzeugt, nicht aufgenommen: Johannes hat in den Hörproben den
    // erzeugten Roboter der Stimme vorgezogen (16.10.2026).
    pegel: 0.65,
    oktave: 0,
    mono: true,
    spiel: (k) => {
      const { ac, t, dur } = k;
      const o = osz(ac, "square", k.f, t, t + dur);
      const ring = ac.createGain();
      ring.gain.value = 0;
      const mod = osz(ac, "sine", 70, t, t + dur);
      mod.connect(ring.gain);
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1200;
      bp.Q.value = 1.2;
      const g = ac.createGain();
      g.gain.value = 2;
      o.connect(ring).connect(bp).connect(g).connect(k.huelle);
      huelleSetzen(k.huelle, t, 0.005, 0.3, Math.min(dur, 0.35), 0.8);
      k.huelle.connect(k.ziel);
    },
  },
  katze: {
    // Erzeugt, nicht aufgenommen: Johannes' Wahl in den Hörproben (16.10.2026).
    pegel: 0.3,
    oktave: 12,
    mono: true,
    spiel: (k) => {
      k.dur = Math.max(k.dur, 0.3);
      formantStimme(k, {
        vokale: ["i", "a", "u"],
        spitze: 0.22,
        formantFaktor: 1.3,
        verstimmung: [-6, 7],
        tonVerlauf: [[0.35, 1.18], [1, 0.92]],
        vib: [7, 0.015],
        anstieg: 0.05,
      });
    },
  },
  frosch: {
    sample: "frosch",
    ausklang: 0.1,
    samplePegel: 1.4, // gemessen 16.10.: Spitze 0,14 bei 0,9 - leiser als die übrigen
    pegel: 0.6,
    oktave: -12,
    mono: true,
    spiel: (k) => {
      const { ac, t } = k;
      const dur = (k.dur = Math.min(Math.max(k.dur, 0.2), 0.45));
      const o = osz(ac, "square", k.f, t, t + dur);
      o.frequency.linearRampToValueAtTime(k.f * 0.94, t + dur);
      const knarr = ac.createGain();
      knarr.gain.value = 0.5;
      const mod = osz(ac, "square", 28, t, t + dur);
      const modG = ac.createGain();
      modG.gain.value = 0.5;
      mod.connect(modG).connect(knarr.gain);
      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(1800, t);
      lp.frequency.linearRampToValueAtTime(700, t + dur);
      o.connect(knarr).connect(lp).connect(k.huelle);
      huelleSetzen(k.huelle, t, 0.01, 0.3, dur, 0.6);
      k.huelle.connect(k.ziel);
    },
  },
  vogel: {
    pegel: 1.3,
    oktave: 12,
    mono: false,
    spiel: (k) => {
      const { ac, t } = k;
      // zwei schnelle Zwitscherer pro Ton
      for (const versatz of [0, 0.07]) {
        const a = t + versatz;
        const o = osz(ac, "sine", k.f * 0.8, a, a + 0.09);
        o.frequency.exponentialRampToValueAtTime(k.f * 1.15, a + 0.05);
        o.frequency.exponentialRampToValueAtTime(k.f, a + 0.08);
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, a);
        g.gain.exponentialRampToValueAtTime(0.5, a + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, a + 0.09);
        o.connect(g).connect(k.huelle);
      }
      k.huelle.gain.value = 0.4;
      k.huelle.connect(k.ziel);
    },
  },
  elefant: {
    pegel: 0.85,
    oktave: 0,
    mono: true,
    spiel: (k) => {
      const { ac, t } = k;
      const dur = (k.dur = Math.max(k.dur, 0.3));
      const o = osz(ac, "sawtooth", k.f * 0.94, t, t + dur);
      o.frequency.exponentialRampToValueAtTime(k.f, t + 0.08); // „Tröö" schleift sich hoch
      vibrato(k, o.frequency, 6.5, 0.02, 0.1);
      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.Q.value = 4;
      lp.frequency.setValueAtTime(400, t);
      lp.frequency.exponentialRampToValueAtTime(2600, t + 0.1);
      lp.frequency.exponentialRampToValueAtTime(1200, t + dur);
      o.connect(lp).connect(k.huelle);
      huelleSetzen(k.huelle, t, 0.04, 0.22, dur, 0.7);
      k.huelle.connect(k.ziel);
    },
  },
  alien: {
    sample: "alien",
    ausklang: 0.1,
    samplePegel: 0.9, // gemessen 16.10.: Stimmen-Aufnahmen (-20 LUFS) Spitze 0,1 bei Pegel 0,4
    pegel: 0.65,
    oktave: -12, // die Stimme reicht nicht höher (melodie-stimmen.mjs, 16.10.2026)
    mono: true,
    spiel: (k) => {
      const { ac, t, dur } = k;
      const traeger = osz(ac, "sine", k.f, t, t + dur);
      const mod = osz(ac, "sine", k.f * 1.51, t, t + dur);
      const index = ac.createGain();
      index.gain.setValueAtTime(k.f * 3, t);
      index.gain.exponentialRampToValueAtTime(k.f * 0.2, t + dur);
      mod.connect(index).connect(traeger.frequency);
      vibrato(k, traeger.frequency, 9, 0.04, 0);
      traeger.connect(k.huelle);
      huelleSetzen(k.huelle, t, 0.01, 0.25, dur, 0.5);
      k.huelle.connect(k.ziel);
    },
  },
  blubb: {
    pegel: 1.0,
    oktave: 0,
    mono: false,
    spiel: (k) => {
      const { ac, t } = k;
      const dur = 0.12;
      const o = osz(ac, "sine", k.f * 0.55, t, t + dur);
      o.frequency.exponentialRampToValueAtTime(k.f * 1.05, t + 0.06);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.6, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(k.huelle);
      k.huelle.gain.value = 0.55;
      k.huelle.connect(k.ziel);
    },
  },
  drache: {
    pegel: 0.65,
    oktave: -12,
    mono: true,
    spiel: (k) => {
      formantStimme(k, {
        vokale: ["a", "o", "o"],
        spitze: 0.2,
        formantFaktor: 0.7,
        verstimmung: [-20, 15],
        tonVerlauf: [[0.1, 1.04], [1, 0.97]],
        vib: [3.5, 0.03],
        anstieg: 0.03,
      });
      const { ac, t, dur } = k;
      const ws = ac.createWaveShaper();
      ws.curve = verzerrung();
      const sub = osz(ac, "sawtooth", k.f / 2, t, t + dur);
      const g = ac.createGain();
      g.gain.value = 0.25;
      sub.connect(ws).connect(g).connect(k.huelle);
      rauschStoss(k, "lowpass", 600, 0.5, Math.min(dur, 0.4), 0.05); // Feueratem
    },
  },
};

// ---------------------------------------------------------------------------
// Einstellungen
// ---------------------------------------------------------------------------

const SPEICHER = "tippen-melodie";

interface MelodieGespeichert {
  an: boolean;
  klang: KlangWahl;
  /** id aus MELODIEN oder "zufall" */
  melodie: string;
  /** ★ 19.10.2026: Pausen der Lieder bleiben stumm (ein Anschlag ohne Ton). */
  pausen: boolean;
}

/**
 * ★ Vorgabe KLAVIER, nicht „Überraschung" (Johannes 17.10.2026: „jetzt ändern
 * sich die sounds standardmäßig dauernd, mach als standard das klavier und
 * wechsel es nicht, man kann es ja selbst umschalten").
 *
 * Bis dahin war „zufall" die Vorgabe - und wurde beim ersten Einschalten MIT
 * gespeichert. Wer die Melodie schon an hatte, trägt also „zufall", ohne es
 * gewählt zu haben. Darum: Ein gespeicherter Stand ohne `fassung` (vor dem
 * 17.10.) mit „zufall" wird einmalig zum Klavier. Wer danach „Überraschung"
 * wählt, bekommt `fassung: 2` und behält es.
 */
export const KLANG_VORGABE: KlangId = "klavier";
const FASSUNG = 2;

/** Gespeicherten Stand lesen - rein, damit prüfbar. */
export function gespeichertLesen(roh: string | null): MelodieGespeichert {
  const vorgabe: MelodieGespeichert = { an: false, klang: KLANG_VORGABE, melodie: "zufall", pausen: true };
  if (!roh) return vorgabe;
  try {
    const d = JSON.parse(roh) as Partial<MelodieGespeichert> & { fassung?: number };
    let klang: KlangWahl =
      d.klang === "zufall" || (KLAENGE as readonly string[]).includes(d.klang ?? "") ? (d.klang as KlangWahl) : KLANG_VORGABE;
    if (klang === "zufall" && (d.fassung ?? 1) < FASSUNG) klang = KLANG_VORGABE;
    return {
      an: !!d.an,
      klang,
      melodie: d.melodie && (d.melodie === "zufall" || MELODIEN.some((m) => m.id === d.melodie)) ? d.melodie : "zufall",
      pausen: d.pausen !== false,
    };
  } catch {
    return vorgabe;
  }
}

function lesen(): MelodieGespeichert {
  try {
    return gespeichertLesen(localStorage.getItem(SPEICHER));
  } catch {
    return gespeichertLesen(null);
  }
}

function schreiben(s: MelodieGespeichert): void {
  try {
    localStorage.setItem(SPEICHER, JSON.stringify({ ...s, fassung: FASSUNG }));
  } catch {
    /* localStorage nicht verfügbar - egal */
  }
}

interface MelodieZustand extends MelodieGespeichert {
  setAn: (v: boolean) => void;
  setKlang: (v: KlangWahl) => void;
  setMelodie: (id: string) => void;
  setPausen: (v: boolean) => void;
}

export const useMelodie = create<MelodieZustand>((set, get) => {
  const speichern = () => {
    const { an, klang, melodie, pausen } = get();
    schreiben({ an, klang, melodie, pausen });
  };
  return {
    ...lesen(),
    setAn: (v) => {
      set({ an: v });
      speichern();
    },
    setKlang: (v) => {
      set({ klang: v });
      lauf.klang = null;
      speichern();
    },
    setMelodie: (id) => {
      set({ melodie: id });
      lauf.melodie = null; // beim nächsten Anschlag von vorn
      speichern();
    },
    setPausen: (v) => {
      set({ pausen: v });
      lauf.melodie = null; // die Noten sind anders gelesen: das Lied beginnt von vorn
      lauf.naechste = null;
      speichern();
    },
  };
});

// ---------------------------------------------------------------------------
// Der Lauf: welcher Ton als Nächstes kommt, und ob die Band mitspielt
// ---------------------------------------------------------------------------

interface Lauf {
  /** Schon gewählt und vorgeladen, bevor das laufende Lied endet. */
  naechste: { melodie: Melodie; klang: KlangId | null } | null;
  melodie: Melodie | null;
  noten: Note[];
  schritt: number;
  klang: KlangId | null;
  letzterAnschlag: number | null;
  abstaende: number[];
  gleichmaessig: number; // wie viele Anschläge in Folge im Takt
  vorherHz: number | null;
  letzteHuelle: GainNode | null;
}

const lauf: Lauf = {
  naechste: null,
  melodie: null,
  noten: [],
  schritt: 0,
  klang: null,
  letzterAnschlag: null,
  abstaende: [],
  gleichmaessig: 0,
  vorherHz: null,
  letzteHuelle: null,
};

function zufallAus<T>(liste: readonly T[], ausser: T | null): T {
  if (liste.length === 1) return liste[0];
  let w = liste[Math.floor(Math.random() * liste.length)];
  if (w === ausser) w = liste[(liste.indexOf(w) + 1) % liste.length];
  return w;
}

function waehleMelodie(ausser: Melodie | null): { melodie: Melodie; klang: KlangId | null } {
  const { melodie, klang } = useMelodie.getState();
  const fest = melodie !== "zufall" ? MELODIEN.find((m) => m.id === melodie) : undefined;
  return {
    melodie: fest ?? zufallAus(MELODIEN, ausser),
    klang: klang === "zufall" ? zufallAus(KLAENGE, lauf.klang) : null,
  };
}

function naechsteMelodie(): void {
  const { melodie, klang } = useMelodie.getState();
  // Das vorgemerkte Lied gilt nur, wenn die Wahl inzwischen nicht geändert wurde.
  const vor = lauf.naechste;
  const passt =
    vor && (melodie === "zufall" || vor.melodie.id === melodie) && (klang === "zufall" ? !!vor.klang : !vor.klang);
  const w = passt && vor ? vor : waehleMelodie(lauf.melodie);
  lauf.melodie = w.melodie;
  lauf.noten = parseNoten(w.melodie.noten, useMelodie.getState().pausen);
  lauf.schritt = 0;
  if (klang === "zufall") lauf.klang = w.klang ?? zufallAus(KLAENGE, lauf.klang);
  // ★ Johannes 16.10.: das laufende Lied zuerst, dann das nächste, dann der Rest.
  aufnahmenLaden(aktuellerKlang(), lauf.noten, 0);
  lauf.naechste = waehleMelodie(lauf.melodie);
  aufnahmenLaden(lauf.naechste.klang ?? aktuellerKlang(), parseNoten(lauf.naechste.melodie.noten, false), 1);
}

/** Braucht der Klang Aufnahmen: die Töne dieser Melodie laden (Stufe 0/1), danach den Rest. */
function aufnahmenLaden(klangId: KlangId, noten: readonly Note[], stufe: 0 | 1): Promise<void> {
  const art = KLANG[klangId];
  const ac = tonKontext();
  if (!art.sample || !ac) return Promise.resolve();
  const midis = noten.filter((n) => !n.pause).map((n) => n.midi + art.oktave);
  return Promise.all(
    alleSaetze(art).map((satz) =>
      laden(ac, satz, midis, stufe).then(() => {
        if (stufe === 0) restLaden(ac, satz);
      }),
    ),
  ).then(() => undefined);
}

function aktuellerKlang(): KlangId {
  const { klang } = useMelodie.getState();
  if (klang !== "zufall") return klang;
  if (!lauf.klang) lauf.klang = zufallAus(KLAENGE, null);
  return lauf.klang;
}

/** Ab dieser Pause beginnt der Takt von vorn (Lesen, Nachdenken, Ansage). */
const PAUSE_MS = 2000;
/** Gleichmässig: Streuung der letzten Abstände unter diesem Anteil des Mittels. */
const GLEICHMASS = 0.22;
export const BAND_BASS_AB = 6;
export const BAND_SCHLAGZEUG_AB = 14;

/** Der Takt des Kindes: Median der letzten Abstände, in Grenzen. */
function schrittDauer(): number {
  const a = lauf.abstaende;
  if (a.length < 2) return 0.4;
  const s = [...a].sort((x, y) => x - y);
  const median = s[Math.floor(s.length / 2)];
  return Math.min(0.9, Math.max(0.12, median / 1000));
}

/** Rechnet aus, ob das Kind gerade im Takt ist (für die Band). */
export function imTakt(abstaende: readonly number[]): boolean {
  if (abstaende.length < 4) return false;
  const letzte = abstaende.slice(-6);
  const mittel = letzte.reduce((x, y) => x + y, 0) / letzte.length;
  if (mittel < 100 || mittel > 1500) return false;
  const streu = Math.sqrt(letzte.reduce((x, y) => x + (y - mittel) ** 2, 0) / letzte.length);
  return streu / mittel < GLEICHMASS;
}

interface Kette {
  ac: BaseAudioContext;
  master: GainNode;
  panner: StereoPannerNode | null;
}

/**
 * ★ Raumhall (16.10.2026): ein kleiner, warmer Raum, aus abklingendem Rauschen
 * ERZEUGT (keine Datei). Er nimmt den erzeugten Klängen das Trockene,
 * „Piepsige" und setzt Aufnahmen und Synthese in denselben Raum.
 */
function raumImpuls(ac: BaseAudioContext): AudioBuffer {
  const rate = ac.sampleRate;
  const laenge = Math.floor(rate * 1.4);
  const buf = ac.createBuffer(2, laenge, rate);
  for (let kanal = 0; kanal < 2; kanal++) {
    const d = buf.getChannelData(kanal);
    let tief = 0;
    for (let i = 0; i < laenge; i++) {
      const t = i / rate;
      // Rauschen, sanft tiefpassgefiltert (warmer Raum), exponentiell abklingend
      tief = tief * 0.6 + (Math.random() * 2 - 1) * 0.4;
      d[i] = tief * Math.exp(-t / 0.32) * (t < 0.008 ? t / 0.008 : 1);
    }
  }
  return buf;
}
export const HALL_ANTEIL = 0.22;
let hallAnteil = HALL_ANTEIL;
let nassRegler: GainNode | null = null;
/** Nur für die Hörproben: den Hall-Anteil vergleichen (0 = trocken). */
export function hallAnteilSetzen(x: number): void {
  hallAnteil = x;
  if (nassRegler) nassRegler.gain.value = x;
}
let kette: Kette | null = null;
/** Pegel des Ausgangs bei Regler 100 % (siehe unten: 0,7 statt 0,9 seit dem Hall). */
const MASTER_PEGEL = 0.7;
// ★ Der Lautstärke-Regler im Menü unter dem Lautsprecher-Schalter (17.10.2026)
// wirkt sofort, auch auf eine Melodie, die gerade klingt.
useLautstaerke.subscribe((s) => {
  if (kette) kette.master.gain.value = MASTER_PEGEL * s.melodie;
});

/** Ausgang mit Stereo-Regler; rechts, solange das Vorlesen an ist. */
function ausgang(ac: BaseAudioContext, t: number): AudioNode {
  if (!kette || kette.ac !== ac) {
    const master = ac.createGain();
    // 0,7 statt 0,9 seit dem Hall (16.10.2026): er hob die Spitzen um rund 40 %.
    master.gain.value = MASTER_PEGEL * lautstaerke("melodie");
    let panner: StereoPannerNode | null = null;
    try {
      panner = typeof ac.createStereoPanner === "function" ? ac.createStereoPanner() : null;
    } catch {
      panner = null;
    }
    const summe = ac.createGain();
    master.connect(summe);
    try {
      const hall = ac.createConvolver();
      hall.buffer = raumImpuls(ac);
      const nass = ac.createGain();
      nass.gain.value = hallAnteil;
      nassRegler = nass;
      master.connect(hall).connect(nass).connect(summe);
    } catch {
      /* ohne Hall - unkritisch */
    }
    if (panner) summe.connect(panner).connect(ac.destination);
    else summe.connect(ac.destination);
    kette = { ac, master, panner };
  }
  if (kette.panner) kette.panner.pan.setValueAtTime(melodieRechts() ? 1 : 0, t);
  return kette.master;
}

/** Ist das Vorlesen an, gehört die Melodie aufs rechte Ohr. */
export function melodieRechts(): boolean {
  return useVoice.getState().enabled;
}

/**
 * Einen Ton in einem Klang spielen. Exportiert, damit die Lautstärke der
 * Klänge gegeneinander MESSBAR ist (OfflineAudioContext im Browser).
 */
export function spieleNote(ac: BaseAudioContext, klangId: KlangId, midi: number, dur: number, schritt: number, t: number): void {
  const art = KLANG[klangId];
  const ziel = ac.createGain();
  ziel.gain.value = art.pegel;
  ziel.connect(ausgang(ac, t));
  const f = hz(midi + art.oktave);
  if (art.mono && lauf.letzteHuelle) {
    // Die vorige Silbe abreissen, sonst singen die Monster durcheinander.
    try {
      const p = lauf.letzteHuelle.gain;
      // Firefox kennt cancelAndHoldAtTime nicht - dort springt der Wert kurz.
      if (typeof p.cancelAndHoldAtTime === "function") p.cancelAndHoldAtTime(t);
      else p.cancelScheduledValues(t);
      p.setTargetAtTime(0.0001, t, 0.015);
    } catch {
      /* unkritisch */
    }
  }
  // ★ Aufnahme zuerst - synchron, ohne Warten. Liegt sie noch nicht bereit,
  //   wird sie für später vorbereitet und der erzeugte Klang springt ein.
  const satz = satzFuer(art, schritt);
  if (satz) ziel.gain.value = art.samplePegel ?? art.pegel;
  const aufnahme = satz ? sampleSpielen(ac, ziel, satz, midi + art.oktave, t, dur, art.ausklang ?? 0.15) : null;
  if (satz && !aufnahme) {
    ziel.gain.value = art.pegel;
    void laden(ac, satz, [midi + art.oktave], 0);
  }
  if (aufnahme) {
    lauf.letzteHuelle = art.mono ? aufnahme : null;
    lauf.vorherHz = f;
    return;
  }
  const huelle = ac.createGain();
  huelle.gain.value = 0;
  art.spiel({ ac, ziel, f, vorher: lauf.vorherHz, t, dur, schritt, huelle });
  lauf.letzteHuelle = art.mono ? huelle : null;
  lauf.vorherHz = f;
}

function band(ac: BaseAudioContext, grundMidi: number, dur: number, schritt: number, t: number): void {
  const ziel = ausgang(ac, t);
  const stufe = lauf.gleichmaessig;
  if (stufe >= BAND_BASS_AB && schritt % 2 === 0) {
    // Bass: der Melodieton zwei Oktaven tiefer - passt immer.
    let m = grundMidi - 24;
    while (m < 36) m += 12;
    const o = osz(ac, "triangle", hz(m), t, t + dur * 1.6);
    const g = ac.createGain();
    huelleSetzen(g, t, 0.01, 0.28, dur * 1.6, 0.5);
    o.connect(g).connect(ziel);
  }
  if (stufe >= BAND_SCHLAGZEUG_AB) {
    if (schritt % 2 === 0) {
      // Bassdrum
      const o = osz(ac, "sine", 140, t, t + 0.18);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
      const g = ac.createGain();
      huelleSetzen(g, t, 0.003, 0.45, 0.18, 0.1);
      o.connect(g).connect(ziel);
    }
    // Becken auf jedem Schlag, leise
    const src = ac.createBufferSource();
    src.buffer = rauschen(ac);
    const hp = ac.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ac.createGain();
    huelleSetzen(g, t, 0.002, schritt % 2 === 0 ? 0.05 : 0.08, 0.05, 0.1);
    src.connect(hp).connect(g).connect(ziel);
    src.start(t);
    src.stop(t + 0.1);
  }
}

/**
 * ★ Der Anschlag. Aufruf SYNCHRON im Tastendruck (`TypingSession.onCorrect`).
 * Gibt zurück, ob ein Ton gespielt wurde - dann entfällt der Tipp-Klick.
 */
export function melodieAnschlag(jetzt: number = Date.now()): boolean {
  if (!useMelodie.getState().an || isSoundMuted()) return false;
  const ac = tonKontext();
  if (!ac) return false;
  try {
    if (ac.state === "suspended") void ac.resume();
    // Takt messen
    if (lauf.letzterAnschlag !== null) {
      const abstand = jetzt - lauf.letzterAnschlag;
      if (abstand > PAUSE_MS) {
        lauf.abstaende = [];
        lauf.gleichmaessig = 0;
      } else {
        lauf.abstaende.push(abstand);
        if (lauf.abstaende.length > 8) lauf.abstaende.shift();
        lauf.gleichmaessig = imTakt(lauf.abstaende) ? lauf.gleichmaessig + 1 : 0;
      }
    }
    lauf.letzterAnschlag = jetzt;

    if (!lauf.melodie || lauf.schritt >= lauf.noten.length) naechsteMelodie();
    const note = lauf.noten[lauf.schritt];
    const schritt = lauf.schritt;
    lauf.schritt += 1;
    // ★ Pause: der Anschlag zählt für Takt und Lauf, es klingt nichts - auch
    //   kein Tipp-Klick (Rückgabe true), die Stille IST die Melodie.
    if (note.pause) return true;
    const takt = schrittDauer();
    const dur = Math.min(1.6, Math.max(0.15, note.laenge * takt * 0.95));
    const t = ac.currentTime + 0.005;
    spieleNote(ac, aktuellerKlang(), note.midi, dur, schritt, t);
    band(ac, note.midi, takt, schritt, t);
    return true;
  } catch {
    return false; // Audio fehlgeschlagen - der Tipp-Klick springt ein
  }
}

/** Wo der Lauf steht - für Tests und für die Anzeige. */
export function melodieStand(): { melodie: Melodie | null; schritt: number; klang: KlangId | null; band: number } {
  const g = lauf.gleichmaessig;
  return {
    melodie: lauf.melodie,
    schritt: lauf.schritt,
    klang: lauf.klang,
    band: g >= BAND_SCHLAGZEUG_AB ? 2 : g >= BAND_BASS_AB ? 1 : 0,
  };
}

/** Für Tests: alles auf Anfang. */
export function melodieZuruecksetzen(): void {
  lauf.naechste = null;
  lauf.melodie = null;
  lauf.noten = [];
  lauf.schritt = 0;
  lauf.klang = null;
  lauf.letzterAnschlag = null;
  lauf.abstaende = [];
  lauf.gleichmaessig = 0;
  lauf.vorherHz = null;
  lauf.letzteHuelle = null;
}

/**
 * Hörprobe: die ersten Töne einer Melodie in einem Klang (Auswahl in den
 * Einstellungen). Der erste Ton geht synchron aus der Geste.
 */
export function melodieProbe(klang: KlangWahl, melodieId: string, toene = 6): void {
  if (isSoundMuted()) return;
  const ac = tonKontext();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();
  const m = MELODIEN.find((x) => x.id === melodieId) ?? MELODIEN[0];
  const k: KlangId = klang === "zufall" ? zufallAus(KLAENGE, null) : klang;
  const noten = parseNoten(m.noten, false).slice(0, toene);
  void probeNoten(k, noten);
}

/**
 * Töne in einem Klang vorspielen - ein Instrument mit Aufnahmen erst laden,
 * dann spielen (sonst hörte man beim Wählen ausgerechnet den Ersatzklang).
 * Auch für die Hörproben-Seite (Tonleitern). Erfüllt sich, wenn es klingt.
 */
export function probeNoten(k: KlangId, noten: readonly Note[], takt = 0.32): Promise<void> {
  const ac = tonKontext();
  if (!ac || isSoundMuted()) return Promise.resolve();
  if (ac.state === "suspended") void ac.resume();
  const art = KLANG[k];
  const midis = noten.map((n) => n.midi + art.oktave);
  const saetze = alleSaetze(art);
  if (saetze.some((satz) => !bereit(satz, midis))) {
    return Promise.all(saetze.map((satz) => laden(ac, satz, midis, 0))).then(() => probeSpielen(ac, k, noten, takt));
  }
  probeSpielen(ac, k, noten, takt);
  return Promise.resolve();
}

function probeSpielen(ac: BaseAudioContext, k: KlangId, noten: readonly Note[], takt = 0.32): void {
  let t = ac.currentTime + 0.01;
  noten.forEach((n, i) => {
    // Hier ohne setTimeout: Web Audio plant die ganze Probe im Voraus.
    spieleNote(ac, k, n.midi, Math.min(1.2, n.laenge * takt * 0.95), i, t);
    t += takt * Math.min(n.laenge, 2);
  });
  lauf.letzteHuelle = null;
  lauf.vorherHz = null;
}

/**
 * Alt + 6 und der Schalter in den Einstellungen. Einschalten schaltet auch den
 * Ton ein - wer die Melodie will, will sie hören. Ein kurzes Auf-/Ab-Motiv
 * bestätigt hörbar (auf dem Ohr, auf dem auch die Melodie kommt).
 * Gibt den neuen Zustand zurück.
 */
export function melodieUmschalten(): boolean {
  const an = !useMelodie.getState().an;
  useMelodie.getState().setAn(an);
  if (an && isSoundMuted()) setSoundMuted(false);
  lauf.abstaende = [];
  lauf.gleichmaessig = 0;
  lauf.letzterAnschlag = null;
  const ac = tonKontext();
  if (ac && !isSoundMuted()) {
    try {
      if (ac.state === "suspended") void ac.resume();
      const t = ac.currentTime + 0.01;
      const folge = an ? [72, 76, 79] : [79, 72];
      folge.forEach((midi, i) => spieleNote(ac, "spieluhr", midi - 12, 0.25, i, t + i * 0.11));
    } catch {
      /* unkritisch */
    }
  }
  return an;
}

/** Die Reihe, durch die Alt + 7 und Alt + 8 blättern - dieselbe wie im Auswahlfeld. */
export const KLANG_REIHE: readonly KlangWahl[] = ["zufall", ...KLAENGE];

/**
 * ★ Alt + 7 (zurück) und Alt + 8 (vor), Johannes 16.10.2026: den Klang wechseln,
 * ohne das Zahnrad zu öffnen. Ist die Melodie aus, schaltet der Wechsel sie
 * ein (wer einen Klang wählt, will ihn hören) - samt Ton, wie Alt + 6. Eine
 * kurze Hörprobe im neuen Klang bestätigt hörbar; den Namen sagt die Seite.
 * Gibt den neuen Klang zurück.
 */
export function klangWechseln(richtung: 1 | -1): KlangWahl {
  const z = useMelodie.getState();
  const i = KLANG_REIHE.indexOf(z.klang);
  const neu = KLANG_REIHE[(i + richtung + KLANG_REIHE.length) % KLANG_REIHE.length];
  z.setKlang(neu);
  if (!z.an) z.setAn(true);
  if (isSoundMuted()) setSoundMuted(false);
  const lied = lauf.melodie?.id ?? (z.melodie !== "zufall" ? z.melodie : MELODIEN[0].id);
  melodieProbe(neu, lied, 4);
  return neu;
}
