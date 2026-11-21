/**
 * Zone 4 — „Der Schneesturm" (Zwielicht). Vorauslesen & Merken (Bauplan §4.4):
 * Auf der Tafel steht eine kurze Folge (2→4 Zeichen), die Stimme sagt sie an —
 * dann VERWEHT die Tafel (die Folge verlässt Bildschirm UND DOM). Das Kind tippt
 * sie aus dem Gedächtnis; jedes richtige Zeichen füllt einen Eingabekasten, der
 * Pinguin stapft vorwärts. KEIN Zeitdruck/Scheitern — nur Wiederhol-Hilfe.
 *
 * Wichtig für die Barrierefreiheit: Die Merkfolge wird NUR gerendert, solange
 * `showSeq` gesetzt ist (React-Bedingung → beim Verwehen echt aus dem DOM). Die
 * Stationen am Boden tragen NIE ein Zeichen. Die schon getippten Zeichen
 * (`typedSeq`) sind die eigene Eingabe des Kindes und dürfen sichtbar bleiben.
 *
 * Bild (Johannes 14.07.): keine schwebenden Kreise mehr — eine SPUR VON FUSSABDRÜCKEN
 * läuft hinter dem Pinguin her (paarweise versetzt, nach hinten verwehend), der Schnee
 * fliegt als lange Schlieren, am Boden liegen Verwehungen, im Schnee stecken
 * Markierungsstöcke. Alles steht AUF dem durchgehenden Boden (Schneekante = Fußpunkt
 * des Pinguins), nichts schwebt: auch die Merk-Tafel und die Eingabekästen hängen an
 * einem Holz-Wegweiser, dessen Pfosten bis in den Schnee reichen.
 *
 * Aufbau wie die übrigen Szenen (1280×720, Kamera zieht mit, Parallax, transform-
 * only). Tafel + Eingabekästen liegen bildschirm-fest (ohne Kamera-Versatz) mittig.
 */
import type { ReactNode } from "react";
import type { FloeSpot } from "@/lib/typing";
import { SHIFT_UNIT, unitGlyph } from "@/lib/typing";
import { VIEW_H, VIEW_W, type PackeisLayout, type Pt } from "./PackeisScene";
import { laufweiteZusatzIn, type ZeichenabstandFaktor } from "@/lib/typing/zeichenabstand";

/*
 * ★ CVI (19.09.2026, „überall"): Die Zeichen der Merk-Tafel (56er-Schrift) und
 * der Eingabekästen (44er) rücken bei „Zeichenabstand groß" um dieselbe
 * Zusatzstrecke auseinander wie in der Übungszeile. Bei „aus" bleiben es die
 * alten Masse (66 und 14) - die Szene sieht dann aus wie immer.
 */
const tafelSchritt = (z: ZeichenabstandFaktor) => 66 + laufweiteZusatzIn(z, 56);
const kastenLuecke = (z: ZeichenabstandFaktor) => 14 + laufweiteZusatzIn(z, 44);

export const STORM_SHORE_X = 235;
/** Flacher Sturm-Boden (der Pinguin stapft gegen den Wind vorwärts). */
export const STORM_GROUND_Y = 440;
/** Schritt je Merkfolge. */
const STEP_X = 205;

/** Legt die Halte einer storm-Etappe flach nebeneinander in die Welt. */
export function stormLayout(spots: readonly FloeSpot[]): PackeisLayout {
  const pts: Pt[] = [];
  let x = STORM_SHORE_X;
  spots.forEach((_s, i) => {
    if (i === 0) x = STORM_SHORE_X;
    else x += STEP_X;
    pts.push({ x, y: STORM_GROUND_Y });
  });
  const last = pts.length > 0 ? pts[pts.length - 1].x : STORM_SHORE_X;
  return { pts, worldW: Math.max(VIEW_W, last + STEP_X + 120) };
}

const GLYPH = (unit: string, uppercase: boolean): string =>
  unit === SHIFT_UNIT ? "⇧" : unitGlyph(unit, uppercase);

/* ---------------------------------------------------------------------------
 * Bausteine der Landschaft (reine Zeichenfunktionen, deterministisch)
 * ------------------------------------------------------------------------- */

/** Durchgehende Schneekante: sanft gewellt, exakt auf Höhe des Pinguin-Fußpunkts. */
function groundPath(worldW: number): string {
  const base = STORM_GROUND_Y + 4;
  const parts: string[] = [`M-260,${base}`];
  let k = 0;
  for (let x = -260; x < worldW + 260; x += 120, k++) {
    parts.push(`q60,${k % 2 === 0 ? -9 : 7} 120,0`);
  }
  parts.push(`L${worldW + 260},${VIEW_H} L-260,${VIEW_H} Z`);
  return parts.join(" ");
}

/** Schneeverwehungen: weiche, windgeformte Wellen, die auf dem Boden aufliegen. */
function drifts(worldW: number): ReactNode[] {
  const out: ReactNode[] = [];
  for (let x = -180, k = 0; x < worldW + 220; x += 214, k++) {
    const w = 130 + ((x * 7 + 900) % 90);
    const h = 16 + ((x * 11 + 300) % 22);
    const y = STORM_GROUND_Y + 6 + (k % 3) * 9;
    out.push(
      <g key={`d${k}`}>
        {/* Luv-Seite flach, Lee-Seite steil (so weht der Wind die Wächte). */}
        <path
          d={`M${x - w},${y + 4} Q${x - w * 0.35},${y - h} ${x + w * 0.25},${y - h * 0.9} Q${x + w * 0.75},${y - h * 0.5} ${x + w * 0.6},${y + 6} Z`}
          fill="#f2f6fd"
          opacity=".85"
        />
        <path
          d={`M${x - w},${y + 4} Q${x - w * 0.35},${y - h} ${x + w * 0.25},${y - h * 0.9}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          opacity=".7"
        />
        <path
          d={`M${x + w * 0.25},${y - h * 0.9} Q${x + w * 0.75},${y - h * 0.5} ${x + w * 0.6},${y + 6}`}
          fill="none"
          stroke="#a9bad6"
          strokeWidth="2.5"
          opacity=".5"
        />
      </g>,
    );
  }
  return out;
}

/**
 * Ein Pinguin-Fußabdruck: Ballen + drei Zehen nach vorn (der Pinguin läuft nach
 * rechts). Gezeichnet als Vertiefung — heller Schneerand oben, dunkler Abdruck darin.
 */
const FOOT_D =
  "M-9,-1 q0,-8 9,-8 q9,0 9,8 q0,7 -9,7 q-9,0 -9,-7 Z" +
  "M4,-6 L18,-12 L10,-2 Z" +
  "M7,-1 L21,-1 L8,3 Z" +
  "M4,4 L17,11 L9,3 Z";

function Footprint({ x, y, tilt, opacity, scale }: { x: number; y: number; tilt: number; opacity: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`} opacity={opacity}>
      <path d={FOOT_D} transform="translate(0 -3.5)" fill="#ffffff" opacity=".75" />
      <path d={FOOT_D} fill="#93a7c6" />
      <path d={FOOT_D} transform="translate(0 1.5) scale(.86)" fill="#7f95b8" opacity=".7" />
    </g>
  );
}

/** Markierungsstock im Schnee: leicht schräg (Wind), rot-weiße Bänder, flatternder Wimpel. */
function MarkerPole({ x, tall, dim = false }: { x: number; tall: number; dim?: boolean }) {
  const top = -tall;
  return (
    <g transform={`translate(${x} ${STORM_GROUND_Y + 4})`} opacity={dim ? 0.55 : 1}>
      {/* Fuß im Schnee (kleine Wächte, damit der Stock nicht „schwebt") */}
      <path d="M-26,4 Q-8,-11 6,-9 Q22,-7 28,5 Z" fill="#eef3fc" opacity=".9" />
      <path d={`M0,2 L${-tall * 0.075},${top}`} stroke="#8d6a4b" strokeWidth="6" strokeLinecap="round" />
      <path d={`M${-tall * 0.03},${top * 0.42} l7,-2`} stroke="#e0573f" strokeWidth="9" strokeLinecap="butt" opacity=".9" />
      <path d={`M${-tall * 0.055},${top * 0.72} l7,-2`} stroke="#e0573f" strokeWidth="9" strokeLinecap="butt" opacity=".9" />
      {/* Wimpel: weht nach links (der Wind kommt von vorn) */}
      <path
        d={`M${-tall * 0.075},${top} q-22,4 -40,-2 q16,10 4,20 q22,-4 36,-8 Z`}
        fill="#ffcf6b"
        stroke="#d9a13f"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** Wehende Schnee-Schlieren: lange, dünn auslaufende Striche (keine Punkte/Kreise). */
function streaks(worldW: number, band: 0 | 1): ReactNode[] {
  const out: ReactNode[] = [];
  const from = band === 0 ? 20 : 60;
  for (let x = -240, k = 0; x < worldW + 340; x += 96, k++) {
    const y = from + ((x * 71 + band * 137 + 4000) % (VIEW_H - 120));
    const len = (band === 0 ? 44 : 78) + ((x * 13 + 700) % 46);
    const w = band === 0 ? 2 : 3.4;
    const op = band === 0 ? (k % 2 === 0 ? 0.42 : 0.26) : k % 2 === 0 ? 0.3 : 0.18;
    out.push(
      <path
        key={`s${band}-${k}`}
        d={`M${x},${y} q${-len * 0.5},2 ${-len},7`}
        fill="none"
        stroke="#eaf1fc"
        strokeWidth={w}
        strokeLinecap="round"
        opacity={op}
      />,
    );
  }
  return out;
}

/** Die Merk-Tafel: ein Holzschild am Wegweiser. Nur gerendert, SOLANGE sie „steht". */
function MemoryBoard({
  seq,
  uppercase,
  w,
  schritt = 66,
}: {
  seq: string[];
  uppercase: boolean;
  w: number;
  /** Abstand der Zeichenmitten (CVI: {@link tafelSchritt}). */
  schritt?: number;
}) {
  return (
    <g className="px-storm-board" transform={`translate(${VIEW_W / 2 - w / 2} 48)`}>
      {/* Holzbrett mit Rahmen (in den Pfosten eingehängt) */}
      <path d={`M-8,6 L${w + 8},0 L${w + 8},96 L-8,102 Z`} fill="#8a6142" />
      <path d={`M-2,10 L${w + 2},4 L${w + 2},92 L-2,98 Z`} fill="#f3f7ff" />
      <path d={`M-2,10 L${w + 2},4 L${w + 2},18 L-2,24 Z`} fill="#dbe6f7" />
      <path d={`M-2,10 L${w + 2},4 L${w + 2},92 L-2,98 Z`} fill="none" stroke="#6f4c33" strokeWidth="3" />
      {/* Schnee auf der Oberkante */}
      <path d={`M-6,8 Q${w * 0.3},-6 ${w * 0.6},2 Q${w * 0.85},-4 ${w + 8},0 L${w + 8},6 L-6,12 Z`} fill="#ffffff" opacity=".9" />
      {seq.map((ch, i) => (
        <text
          key={i}
          x={20 + 33 + i * schritt}
          y={78}
          fontSize="56"
          fontWeight="700"
          textAnchor="middle"
          fill="#123a5e"
          fontFamily="system-ui, sans-serif"
          className="font-legible"
        >
          {GLYPH(ch, uppercase)}
        </text>
      ))}
    </g>
  );
}

/**
 * Der Wegweiser, in dem Tafel und Eingabekästen hängen: zwei Holzpfosten, die bis in
 * den Schnee reichen (nichts schwebt). Steht, sobald eine Folge läuft — die Tafel
 * selbst verweht davon unabhängig.
 */
function SignPost({ half }: { half: number }) {
  const cx = VIEW_W / 2;
  const foot = STORM_GROUND_Y + 6;
  return (
    <g>
      {[cx - half, cx + half].map((px, i) => (
        <g key={i}>
          <path d={`M${px - 8},40 L${px + 8},40 L${px + 7},${foot} L${px - 7},${foot} Z`} fill="#7d573b" stroke="#5e3f2a" strokeWidth="2.5" />
          <path d={`M${px - 3},44 L${px - 3},${foot - 4}`} stroke="#946b49" strokeWidth="2" opacity=".8" />
          {/* Schneekragen am Fuß */}
          <path d={`M${px - 34},${foot + 4} Q${px - 12},${foot - 16} ${px + 2},${foot - 14} Q${px + 22},${foot - 12} ${px + 34},${foot + 5} Z`} fill="#f0f5fd" />
          {/* Schneehäubchen oben */}
          <path d={`M${px - 10},42 Q${px},33 ${px + 10},42 Z`} fill="#ffffff" opacity=".9" />
        </g>
      ))}
    </g>
  );
}

/** Eingabekästen: `seqLen` Kästen, die ersten `typed.length` mit dem Getippten. */
function InputBoxes({
  len,
  typed,
  uppercase,
  gap = 14,
}: {
  len: number;
  typed: string[];
  uppercase: boolean;
  /** Lücke zwischen den Kästen (CVI: {@link kastenLuecke}). */
  gap?: number;
}) {
  if (len <= 0) return null;
  const bw = 58;
  const total = len * bw + (len - 1) * gap;
  return (
    <g transform={`translate(${VIEW_W / 2 - total / 2} 170)`}>
      {/* Querbalken des Wegweisers, auf dem die Kästen sitzen */}
      <path d={`M-26,-12 L${total + 26},-12 L${total + 26},2 L-26,2 Z`} fill="#7d573b" stroke="#5e3f2a" strokeWidth="2" />
      <path d={`M-26,84 L${total + 26},84 L${total + 26},94 L-26,94 Z`} fill="#6d4a32" />
      {Array.from({ length: len }, (_, i) => {
        const ch = typed[i];
        const filled = ch !== undefined;
        const next = i === typed.length;
        return (
          <g key={i} transform={`translate(${i * (bw + gap)} 6)`}>
            <rect
              width={bw}
              height="72"
              rx="10"
              fill={filled ? "#dff3e6" : "#26304d"}
              stroke={next ? "#ffd873" : filled ? "#6fc499" : "#9fb0d0"}
              strokeWidth={next ? 5 : 3}
            />
            {filled && (
              <text x={bw / 2} y={52} fontSize="44" fontWeight="700" textAnchor="middle" fill="#1f6b45" fontFamily="system-ui, sans-serif" className="font-legible">
                {GLYPH(ch, uppercase)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export interface StormSceneProps {
  camX?: number;
  worldW?: number;
  penguin?: ReactNode;
  spots?: readonly FloeSpot[];
  pts?: readonly Pt[];
  pos?: number;
  targetIdx?: number;
  /** Die Merkfolge, SOLANGE sie auf der Tafel steht (null = verweht, nicht im DOM). */
  showSeq?: string | null;
  /** Anzahl Eingabekästen (Länge der aktuellen Merkfolge). */
  seqLen?: number;
  /** Schon richtig getippte Zeichen (füllen die Kästen). */
  typedSeq?: string;
  uppercase?: boolean;
  /** „Zeichenabstand groß (CVI)" - Tafel und Kästen rücken auseinander (19.09.2026). */
  zeichenabstand?: ZeichenabstandFaktor;
}

export function StormScene({
  camX = 0,
  worldW = VIEW_W,
  penguin,
  spots,
  pts,
  pos = 0,
  showSeq = null,
  seqLen = 0,
  typedSeq = "",
  uppercase = false,
  zeichenabstand = 1,
}: StormSceneProps) {
  const far = `translate(${-camX * 0.3} 0)`;
  const mid = `translate(${-camX * 0.6} 0)`;
  const play = `translate(${-camX} 0)`;

  const boardSeq = showSeq === SHIFT_UNIT ? [SHIFT_UNIT] : showSeq ? [...showSeq] : [];
  const typedArr = typedSeq === SHIFT_UNIT ? [SHIFT_UNIT] : [...typedSeq];

  // Wegweiser-Maße: Tafel und Kästen hängen zwischen denselben zwei Pfosten.
  // Bei „aus" wörtlich die alten Masse: n × 66 + 40 und n × 58 + (n − 1) × 14.
  const schritt = tafelSchritt(zeichenabstand);
  const luecke = kastenLuecke(zeichenabstand);
  const tafelBreite = (n: number) => Math.max(150, (n - 1) * schritt + 106);
  const boardW = tafelBreite(Math.max(seqLen, boardSeq.length));
  const boxesW = seqLen > 0 ? seqLen * 58 + (seqLen - 1) * luecke : 0;
  const postHalf = Math.max(boardW, boxesW) / 2 + 34;

  // Fußspur: läuft hinter dem Pinguin her (er steht auf dem Halt `pos`) und verweht.
  const penX = pts?.[pos]?.x ?? STORM_SHORE_X;
  const prints: ReactNode[] = [];
  for (let i = 0; i < 20; i++) {
    const x = penX - 30 - i * 33;
    if (x < camX - 320) break;
    const right = i % 2 === 0;
    prints.push(
      <Footprint
        key={i}
        x={x}
        y={STORM_GROUND_Y + (right ? 3 : 15)}
        tilt={right ? -7 : 6}
        opacity={Math.max(0.08, 0.6 - i * 0.032)}
        scale={1.15 - i * 0.012}
      />,
    );
  }

  // Ferne Kammlinie (gekachelt über die Weltbreite).
  const ridges: ReactNode[] = [];
  for (let bx = -200; bx < worldW + 400; bx += 460) {
    ridges.push(
      <path
        key={`rg${bx}`}
        d={`M${bx},${STORM_GROUND_Y + 10} L${bx + 130},${STORM_GROUND_Y - 92} L${bx + 250},${STORM_GROUND_Y - 30} L${bx + 340},${STORM_GROUND_Y - 76} L${bx + 470},${STORM_GROUND_Y + 10} Z`}
        fill="#5c6188"
        opacity=".55"
      />,
    );
  }

  return (
    <svg className="px-world px-scene" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="stSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2f52" />
          <stop offset=".55" stopColor="#43486f" />
          <stop offset="1" stopColor="#6b6f92" />
        </linearGradient>
        <linearGradient id="stSnow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8eefa" />
          <stop offset=".35" stopColor="#cfd9ec" />
          <stop offset="1" stopColor="#9fadc9" />
        </linearGradient>
        <linearGradient id="stHaze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f96bd" stopOpacity="0" />
          <stop offset="1" stopColor="#8f96bd" stopOpacity=".55" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#stSky)" />
      {/* Diesiger Sturm-Dunst über dem Horizont (kein Kreis, ein Band) */}
      <rect x="0" y={STORM_GROUND_Y - 190} width={VIEW_W} height="200" fill="url(#stHaze)" />

      {/* Ferne: Kammlinie im Schneetreiben (langsames Parallax) */}
      <g transform={far} opacity=".7">
        {ridges}
      </g>

      {/* Mittelgrund: Reihe kleiner Markierungsstöcke, die im Dunst verschwinden */}
      <g transform={mid} opacity=".45">
        {Array.from({ length: Math.ceil((worldW + 400) / 300) }, (_, i) => (
          <MarkerPole key={`mp${i}`} x={-120 + i * 300} tall={70} dim />
        ))}
      </g>

      {/* Spielebene: Boden, Verwehungen, Halte, Fußspur, Pinguin, Schnee */}
      <g transform={play}>
        <path d={groundPath(worldW)} fill="url(#stSnow)" />
        {/* Windkante auf dem Schnee */}
        <path
          d={`M-260,${STORM_GROUND_Y + 10} Q${worldW / 2},${STORM_GROUND_Y - 8} ${worldW + 260},${STORM_GROUND_Y + 10}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          opacity=".55"
        />
        {drifts(worldW)}

        {/* Sastrugi: vom Wind gezogene Rillen im Schnee davor (Textur statt leerer Fläche) */}
        {Array.from({ length: Math.ceil((worldW + 500) / 190) }, (_, i) => {
          const x = -240 + i * 190;
          const y = 500 + ((i * 97) % 170);
          const len = 120 + ((i * 61) % 130);
          return (
            <g key={`sa${i}`}>
              <path d={`M${x},${y} q${len * 0.5},-12 ${len},0`} fill="none" stroke="#8ea0bf" strokeWidth="3" opacity=".22" strokeLinecap="round" />
              <path d={`M${x + 6},${y - 5} q${len * 0.5},-12 ${len - 12},0`} fill="none" stroke="#ffffff" strokeWidth="3" opacity=".5" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Wehender Schnee HINTER dem Pinguin (langsamere Bahn) */}
        <g className="px-storm-snow" style={{ animationDuration: "1.8s" }}>
          {streaks(worldW, 1)}
        </g>

        {/* Halte: eine Schneewächte mit Markierungsstock — NIE ein Zeichen (Merken, §4.4) */}
        {spots?.map((s, i) => {
          if (!pts || s.kind !== "station") return null;
          const p = pts[i];
          const visited = i < pos;
          return (
            <g key={i} style={{ opacity: visited ? 0.55 : 1, transition: "opacity .4s" }}>
              <g transform={`translate(${p.x} ${p.y})`}>
                <path d="M-70,16 Q-40,-14 -4,-12 Q36,-10 66,16 Z" fill="#f4f8ff" opacity=".95" />
                <path d="M-70,16 Q-40,-14 -4,-12" fill="none" stroke="#ffffff" strokeWidth="3" />
                <path d="M-4,-12 Q36,-10 66,16" fill="none" stroke="#aebdd8" strokeWidth="2.5" opacity=".6" />
              </g>
              <MarkerPole x={p.x + 44} tall={104} />
            </g>
          );
        })}

        {/* Fußabdrücke im Schnee, hinter dem Pinguin herlaufend */}
        <g>{prints}</g>

        {penguin}

        {/* Wehender Schnee VOR dem Pinguin (schnellere Bahn, feiner) */}
        <g className="px-storm-snow" style={{ animationDuration: "0.75s" }}>
          {streaks(worldW, 0)}
        </g>
      </g>

      {/* Bildschirm-fest (ohne Kamera): Wegweiser mit Merk-Tafel + Eingabekästen */}
      {seqLen > 0 && <SignPost half={postHalf} />}
      {boardSeq.length > 0 && (
        <MemoryBoard seq={boardSeq} uppercase={uppercase} w={tafelBreite(boardSeq.length)} schritt={schritt} />
      )}
      <InputBoxes len={seqLen} typed={typedArr} uppercase={uppercase} gap={luecke} />
    </svg>
  );
}
