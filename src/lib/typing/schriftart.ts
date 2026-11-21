/**
 * ★★ SCHRIFTART DER ÜBUNGSZEILE (09.10.2026).
 *
 * Wunsch von ein Kollege (Lehrkraft, Meldung `xzdpz89gidp362t`, 08.10.2026):
 * *„dass man die Schriftart selber ändern kann, bzw. für die Volksschulkinder
 * die Schulschrift auswählbar ist"*. Johannes 09.10.: die Wiener Schulschrift
 * als Druck- UND als Schreibschrift, dazu fünf weitere Schriften; Atkinson
 * Hyperlegible bleibt Vorgabe und steht als „empfohlen" in der Liste.
 *
 * ★★★ Johannes 09.10.2026: *„die programmschrift wird nie geändert nur die
 * schrift im eingabefeld"*. Umgeschaltet wird darum NUR, was die Klasse
 * `tt-uebungsschrift` trägt: die Zeile zum Abschreiben (`PromptText`), die
 * getippte Zeile (`FreieSchreibzeile`) und das durchsichtige Eingabefeld
 * darüber - das MUSS dieselbe Schrift haben, sonst sitzt der Schreibzeiger
 * neben dem Zeichen. Der Weg: `useSchriftartAnwenden()` setzt an `<html>`
 * die Variable `--tt-uebungsschrift`, `src/index.css` liest sie in
 * `.tt-uebungsschrift.font-legible`. Alles andere bleibt Atkinson.
 *
 * Geräte-Einstellung wie die Größe des Übungsfeldes (`tippen-a11y`): Sie
 * beschreibt, was dieses Kind an diesem Bildschirm gut lesen kann.
 *
 * Die Dateien liegen in `public/fonts/` (die `@font-face` in `src/index.css`),
 * auf Latein samt Erweiterung A/B gekürzt - genug für alle acht Lernwege.
 * Ein Zeichen, das einer Schrift fehlt (Primæ: `~` und `^`), kommt aus
 * Atkinson Hyperlegible. Herkunft und Lizenz: `public/fonts/SCHRIFTEN-LIZENZEN.md`.
 */
import { useEffect } from "react";
import { create } from "zustand";

export type SchriftId =
  | "atkinson"
  | "mono"
  | "primae-druck"
  | "primae-schreib"
  | "andika"
  | "lexend"
  | "luciole"
  | "opendyslexic"
  | "inclusive"
  | "mm-schuldruck";

export interface Schrift {
  id: SchriftId;
  /** Eigenname - in jeder Sprache gleich. */
  name: string;
  /** Der Wert für `font-family` (Familien-Name aus `src/index.css`). */
  familie: string;
  /**
   * Schreibschrift: die Übungszeile setzt ihre Zeichen dann als Inline-Spannen
   * ohne Abstand, sonst verbinden sie sich nicht (`.tt-schreibschrift` in
   * `src/index.css`, Klasse an `<html>` aus `useSchriftartAnwenden`).
   */
  schreibschrift?: boolean;
  /**
   * ★★ Die Balken um das aktive Zeichen (09.10.2026, Johannes: „teste jede
   * schrift, dass der Abstand der Balken zu der schrift passt"). Zahl in em,
   * gelesen als `--tt-balken-oben`/`-unten` in `src/index.css`: der Weg von
   * der Kante der Zeichenbox bis zum Balken. Atkinson ist 0.165 (so
   * abgenommen); die anderen sind GEMESSEN - im Browser, 600er Stärke, Abstand
   * Tinte zu Box (oben `ÄÖÜbdfhklt`, unten `gjpqy`), dann so verschoben, dass
   * der Balken bei jeder Schrift so weit vom Buchstaben steht wie bei Atkinson:
   * `0.165 + (Abstand dieser Schrift - Abstand Atkinson)`.
   */
  balkenOben: number;
  balkenUnten: number;
  /**
   * Schräge Schrift: der obere Balken rückt um so viel em nach rechts, der
   * untere nach links (Johannes: „bei kursiver schrift müssen die balken auch
   * oben und unten leicht versetzt sein"). Gemessen an den Umrissen von
   * I, H, E, k, 1: Primæ Schreibschrift rund 14° (tan 14° mal rund 0,55 em
   * Weg von der Mitte des Mittelbands bis zum Balken ≈ 0,14), Primæ
   * DRUCKschrift rund 3,5° (≈ 0,03) - die österreichische Druckschrift steht
   * leicht schräg, obwohl ihre Datei 0° angibt. Alle anderen: 0°.
   */
  balkenSchraeg?: number;
  /**
   * Nur in Plus wählbar (16.10.2026, Johannes): die Schrift mit gleicher
   * Zeichenbreite. Tastenflow zeigt sie nicht - dort wäre sie unvermessen
   * (die Balken oben sind die von Atkinson, nicht gemessen), und die
   * Übungszeile setzt jedes Zeichen ohnehin einzeln.
   */
  nurPlus?: boolean;
}

/** Die Reihenfolge der Liste: Vorgabe zuerst, dann die Schulschrift. */
export const SCHRIFTEN: readonly Schrift[] = [
  { id: "atkinson", name: "Atkinson Hyperlegible", familie: '"Atkinson Hyperlegible"', balkenOben: 0.165, balkenUnten: 0.165 },
  // ★ Plus (Johannes, 16.10.2026): „eine mit immer gleicher Laufweite, die aber gut lesbar ist".
  // Atkinson Hyperlegible Mono - dieselbe Schriftfamilie des Braille Institute, jedes Zeichen gleich breit.
  { id: "mono", name: "Atkinson Hyperlegible Mono", familie: '"Tastenflow Atkinson Mono"', balkenOben: 0.165, balkenUnten: 0.165, nurPlus: true },
  { id: "primae-druck", name: "Primæ", familie: '"Tastenflow Primae Druck"', balkenOben: 0.08, balkenUnten: -0.014, balkenSchraeg: 0.03 },
  { id: "primae-schreib", name: "Primæ", familie: '"Tastenflow Primae Schreib"', balkenOben: 0.055, balkenUnten: -0.044, schreibschrift: true, balkenSchraeg: 0.14 },
  { id: "andika", name: "Andika", familie: '"Tastenflow Andika"', balkenOben: 0.2, balkenUnten: -0.011 },
  { id: "lexend", name: "Lexend", familie: '"Tastenflow Lexend"', balkenOben: 0.219, balkenUnten: 0.038 },
  { id: "luciole", name: "Luciole", familie: '"Tastenflow Luciole"', balkenOben: -0.002, balkenUnten: 0.123 },
  { id: "opendyslexic", name: "OpenDyslexic", familie: '"Tastenflow OpenDyslexic"', balkenOben: -0.11, balkenUnten: -0.051 },
  { id: "inclusive", name: "Inclusive Sans", familie: '"Tastenflow Inclusive Sans"', balkenOben: 0.184, balkenUnten: 0.058 },
  // Österreichische Schul-Druckschrift außerhalb Wiens (Wunsch aus Wien, 11.10.2026).
  // Balken aus den Schriftmassen gerechnet (dieselbe Rechnung trifft die anderen
  // auf etwa 0,02), nicht im Browser gemessen.
  { id: "mm-schuldruck", name: "MM Schuldruck", familie: '"Tastenflow MM Schuldruck"', balkenOben: 0.029, balkenUnten: -0.084 },
];

/** Die Liste für eine App: Tastenflow ohne, Plus mit der Schrift gleicher Breite. */
export function schriftenFuer(mitMono: boolean): readonly Schrift[] {
  return SCHRIFTEN.filter((s) => mitMono || !s.nurPlus);
}

export const SCHRIFT_VORGABE: SchriftId = "atkinson";

export const SCHRIFT_KEY = "tippen-schrift";

export function schriftAus(roh: string | null | undefined): SchriftId {
  return SCHRIFTEN.some((s) => s.id === roh) ? (roh as SchriftId) : SCHRIFT_VORGABE;
}

export function schriftZu(id: SchriftId): Schrift {
  return SCHRIFTEN.find((s) => s.id === id) ?? SCHRIFTEN[0];
}

function lese(): SchriftId {
  try {
    return schriftAus(localStorage.getItem(SCHRIFT_KEY));
  } catch {
    return SCHRIFT_VORGABE;
  }
}

interface SchriftState {
  schrift: SchriftId;
  setSchrift: (id: SchriftId) => void;
}

export const useSchriftart = create<SchriftState>((set) => ({
  schrift: lese(),
  setSchrift: (id) => {
    try {
      localStorage.setItem(SCHRIFT_KEY, id);
    } catch {
      /* Speichern optional */
    }
    set({ schrift: id });
  },
}));

/**
 * Setzt `--tt-uebungsschrift` (und bei der Schreibschrift die Klasse
 * `tt-schreibschrift`) an `<html>`, solange das aufrufende Bauteil
 * steht. Bei der Vorgabe bleibt `<html>` unberührt - dann gilt der Rückfall
 * im `var()` (Atkinson).
 */
const VARIABLEN = [
  "--tt-uebungsschrift",
  "--tt-balken-oben",
  "--tt-balken-unten",
  "--tt-balken-schraeg",
] as const;

/**
 * Die Schrift, die in dieser App wirklich gilt: Hat jemand in Plus die Schrift
 * gleicher Breite gewählt (derselbe Speicher auf demselben Gerät), bleibt
 * Tastenflow bei der Vorgabe - es zeigt sie nicht an.
 */
export function schriftWirksam(id: SchriftId, mitMono: boolean): SchriftId {
  return !mitMono && schriftZu(id).nurPlus ? SCHRIFT_VORGABE : id;
}

export function useSchriftartAnwenden(mitMono = false): void {
  const gewaehlt = useSchriftart((s) => s.schrift);
  const id = schriftWirksam(gewaehlt, mitMono);
  useEffect(() => {
    const root = document.documentElement;
    const s = schriftZu(id);
    if (id === SCHRIFT_VORGABE) {
      for (const v of VARIABLEN) root.style.removeProperty(v);
    } else {
      root.style.setProperty("--tt-uebungsschrift", s.familie);
      root.style.setProperty("--tt-balken-oben", String(s.balkenOben));
      root.style.setProperty("--tt-balken-unten", String(s.balkenUnten));
      if (s.balkenSchraeg) root.style.setProperty("--tt-balken-schraeg", String(s.balkenSchraeg));
      else root.style.removeProperty("--tt-balken-schraeg");
    }
    root.classList.toggle("tt-schreibschrift", s.schreibschrift === true);
    return () => {
      for (const v of VARIABLEN) root.style.removeProperty(v);
      root.classList.remove("tt-schreibschrift");
    };
  }, [id]);
}
