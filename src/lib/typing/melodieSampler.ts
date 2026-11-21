/**
 * ★ AUFNAHMEN für die Melodie beim Tippen (16.10.2026).
 *
 * Johannes: die erzeugten Klänge klingen primitiv - Kinder mit Blindheit haben
 * oft ein sehr geschultes Gehör. Darum spielen Klavier, Gitarre, Querflöte und
 * Saxophon AUFNAHMEN, und zwar **jeder Ton seine eigene** (University of Iowa,
 * MIS, frei nutzbar - `scripts/melodie-instrumente.mjs`), und die Monster und
 * Tiere singen mit macOS-Stimmen auf fester Tonhöhe (`scripts/melodie-stimmen.mjs`).
 *
 * Ablage: `public/sounds/melodie/<satz>/<midi>.mp3` + `index.json` (welche Töne
 * es gibt). Ein „Satz" ist ein Instrument in einer Fassung (`klavier-mf`).
 *
 * ★★ Johannes' Regeln (16.10.2026):
 *   1. Geladen wird, was gerade gebraucht wird: ZUERST die Töne des laufenden
 *      Lieds, dann die des nächsten, dann der Rest - im Hintergrund, jeder Ton
 *      sobald er da ist.
 *   2. Verschoben wird höchstens um EINEN Halbton (geschulte Ohren hören
 *      mehr) - und nur, solange der richtige Ton noch lädt.
 *   3. Sonst spielt der erzeugte Klang, und es ist SICHTBAR, dass geladen wird
 *      ({@link useMelodieLaden}, [[feedback_nachladen_immer_animation]]).
 *
 * Gespielt wird SYNCHRON im Anschlag ([[feedback_web_audio_gesture]]); geladen
 * nie im Anschlag selbst.
 */
import { create } from "zustand";

const BASIS = `${import.meta.env.BASE_URL}sounds/melodie/`;
/** Höchstens so viele dekodierte Töne im Speicher (iPad). */
const PUFFER_MAX = 72;
/** Gleichzeitige Downloads - genug für Tempo, wenig genug für die Klasse im Schul-WLAN. */
const PARALLEL = 3;
/** Grösster erlaubter Abstand zum geladenen Ersatzton (Halbtöne). */
export const ERSATZ_MAX = 1;

/** Ladestand für die Anzeige an der Übungszeile. */
export const useMelodieLaden = create<{ offen: number; satz: string | null }>(() => ({ offen: 0, satz: null }));

const verzeichnis = new Map<string, Promise<number[] | null>>();
const vorhanden = new Map<string, number[]>();
/**
 * ★ Stimmung je Ton in Cent (gemessen, `scripts/melodie-stimmung.mjs`):
 * Iowa-Gitarre liegt im Mittel 28 Cent zu tief, Flöte und Saxophon schwanken
 * je Ton bis +40 Cent. Beim Spielen wird der Ton um genau so viel gerade
 * gezogen - eine STIMMKORREKTUR (höchstens ±50 Cent), kein Ersatzton.
 */
const stimmung = new Map<string, Record<string, number>>();
const puffer = new Map<string, AudioBuffer>(); // "klavier-mf:60" (Reihenfolge = LRU)
const laufend = new Map<string, Promise<void>>();

/** Welche Töne hat dieser Satz? (index.json, einmal) */
export function toeneDes(satz: string): Promise<number[] | null> {
  const da = verzeichnis.get(satz);
  if (da) return da;
  const p =
    typeof fetch !== "function"
      ? Promise.resolve(null)
      : fetch(`${BASIS}${satz}/index.json`)
          .then((r) => (r.ok ? (r.json() as Promise<{ toene?: number[]; cent?: Record<string, number> }>) : null))
          .then((d) => {
            if (d?.cent) stimmung.set(satz, d.cent);
            const t = Array.isArray(d?.toene) ? d!.toene!.slice().sort((a, b) => a - b) : null;
            // ★ Auch „gibt es nicht" wird gemerkt (bis zum Neuladen der Seite) -
            //   sonst fragte jeder Anschlag den Server erneut.
            if (t) vorhanden.set(satz, t);
            return t;
          })
          .catch(() => null);
  verzeichnis.set(satz, p);
  return p;
}

function merken(schluessel: string, buf: AudioBuffer): void {
  puffer.delete(schluessel);
  puffer.set(schluessel, buf);
  while (puffer.size > PUFFER_MAX) {
    const aeltester = puffer.keys().next().value;
    if (aeltester === undefined) break;
    puffer.delete(aeltester);
  }
}

// --- Warteschlange: wer zuerst gebraucht wird, kommt zuerst ------------------

interface Auftrag {
  ac: BaseAudioContext;
  satz: string;
  midi: number;
  stufe: number; // 0 = laufendes Lied, 1 = nächstes, 2 = Rest
  fertig: Array<() => void>;
}
const schlange: Auftrag[] = [];
let aktiv = 0;

function anzeigeAktualisieren(): void {
  const dringend = schlange.filter((a) => a.stufe === 0).length + [...laufendStufe0].length;
  const satz = schlange.find((a) => a.stufe === 0)?.satz ?? [...laufendStufe0][0]?.split(":")[0] ?? null;
  const s = useMelodieLaden.getState();
  if (s.offen !== dringend || s.satz !== satz) useMelodieLaden.setState({ offen: dringend, satz });
}
const laufendStufe0 = new Set<string>();

function weiter(): void {
  while (aktiv < PARALLEL && schlange.length) {
    schlange.sort((a, b) => a.stufe - b.stufe);
    const a = schlange.shift()!;
    const schluessel = `${a.satz}:${a.midi}`;
    if (puffer.has(schluessel)) {
      a.fertig.forEach((f) => f());
      continue;
    }
    aktiv++;
    if (a.stufe === 0) laufendStufe0.add(schluessel);
    const lauf = fetch(`${BASIS}${a.satz}/${a.midi}.mp3`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((daten) => a.ac.decodeAudioData(daten))
      .then((buf) => merken(schluessel, buf))
      .catch(() => {
        /* fehlt oder kaputt - der erzeugte Klang springt ein */
      })
      .finally(() => {
        aktiv--;
        laufend.delete(schluessel);
        laufendStufe0.delete(schluessel);
        a.fertig.forEach((f) => f());
        anzeigeAktualisieren();
        weiter();
      });
    laufend.set(schluessel, lauf);
  }
  anzeigeAktualisieren();
}

/**
 * Töne laden lassen. `stufe` 0 = das laufende Lied (sofort, mit Anzeige),
 * 1 = das nächste Lied, 2 = alles Übrige. Ein schon wartender Ton rückt auf,
 * wenn er dringender wird. Das Versprechen erfüllt sich, wenn alle da sind
 * (oder fehlgeschlagen) - die Hörprobe wartet darauf.
 */
export function laden(ac: BaseAudioContext, satz: string, midis: readonly number[], stufe: 0 | 1 | 2): Promise<void> {
  return toeneDes(satz).then((toene) => {
    if (!toene) return;
    const wartet: Promise<void>[] = [];
    for (const m of new Set(midis)) {
      if (!toene.includes(m)) continue; // dieser Ton ist nicht aufgenommen
      const schluessel = `${satz}:${m}`;
      if (puffer.has(schluessel)) continue;
      const l = laufend.get(schluessel);
      if (l) {
        wartet.push(l);
        continue;
      }
      const schon = schlange.find((a) => a.satz === satz && a.midi === m);
      wartet.push(
        new Promise<void>((fertig) => {
          if (schon) {
            schon.stufe = Math.min(schon.stufe, stufe);
            schon.fertig.push(fertig);
          } else schlange.push({ ac, satz, midi: m, stufe, fertig: [fertig] });
        }),
      );
    }
    weiter();
    return Promise.all(wartet).then(() => undefined);
  });
}

/** Alle Töne eines Satzes im Hintergrund (Stufe 2), sobald das Verzeichnis da ist. */
export function restLaden(ac: BaseAudioContext, satz: string): void {
  void toeneDes(satz).then((t) => t && laden(ac, satz, t, 2));
}

/** Liegt dieser Ton (genau) dekodiert bereit? */
export function bereit(satz: string, midis: readonly number[]): boolean {
  return midis.every((m) => puffer.has(`${satz}:${m}`) || !(vorhanden.get(satz) ?? [m]).includes(m));
}

/**
 * Einen Ton als Aufnahme spielen - SYNCHRON. Gibt die Hüllkurve zurück, oder
 * null: dann spielt der Aufrufer den erzeugten Klang.
 * Genau der Ton, sonst ein geladener Nachbar mit höchstens {@link ERSATZ_MAX}
 * Halbton Abstand.
 */
export function sampleSpielen(
  ac: BaseAudioContext,
  ziel: AudioNode,
  satz: string,
  midi: number,
  t: number,
  dur: number,
  ausklang: number,
): GainNode | null {
  let quelle = midi;
  let buf = puffer.get(`${satz}:${midi}`);
  for (let d = 1; !buf && d <= ERSATZ_MAX; d++) {
    for (const m of [midi - d, midi + d]) {
      const b = puffer.get(`${satz}:${m}`);
      if (b) {
        buf = b;
        quelle = m;
        break;
      }
    }
  }
  if (!buf) return null;
  merken(`${satz}:${quelle}`, buf); // LRU auffrischen
  const src = ac.createBufferSource();
  src.buffer = buf;
  const cent = Math.max(-50, Math.min(50, stimmung.get(satz)?.[String(quelle)] ?? 0));
  if (quelle !== midi || cent !== 0) src.playbackRate.value = Math.pow(2, (midi - quelle) / 12 - cent / 1200);
  const g = ac.createGain();
  const halten = t + Math.max(dur, 0.06);
  const ende = Math.min(halten + ausklang, t + buf.duration);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(1, t + 0.004);
  if (ende > halten) {
    g.gain.setValueAtTime(1, halten);
    g.gain.exponentialRampToValueAtTime(0.0001, ende);
  }
  src.connect(g).connect(ziel);
  src.start(t);
  src.stop(Math.max(ende, t + 0.05) + 0.05);
  return g;
}

/** Für Tests. */
export function _samplerZuruecksetzen(): void {
  verzeichnis.clear();
  vorhanden.clear();
  stimmung.clear();
  puffer.clear();
  laufend.clear();
  laufendStufe0.clear();
  schlange.length = 0;
  aktiv = 0;
  useMelodieLaden.setState({ offen: 0, satz: null });
}

/** Für Tests: einen Ton direkt hinterlegen. */
export function _pufferSetzen(satz: string, midi: number, buf: AudioBuffer): void {
  merken(`${satz}:${midi}`, buf);
}
