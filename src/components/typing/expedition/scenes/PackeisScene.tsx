/**
 * Zone 1 — „Das Packeis" (Morgen). Erstes Landschaftsbild der Polar-Expedition,
 * komponiert nach der Design-Referenz (Artifact 20c1048a) auf der Bauplan-Geometrie
 * (Sichtfenster 1280×720, Welt breiter — die Kamera zieht mit). Drei Parallax-
 * Ebenen (Himmel/Ferne · Mittelgrund · Spielebene) bewegen sich unterschiedlich
 * schnell gegen `camX`; alles transform-only (Bauplan §2: SVG + CSS/rAF, kein Canvas).
 *
 * Seit E2 ist die Szene SPIELBAR: Sie zeichnet die Schollen des laufenden Kurses an
 * den vom Spiel-Hook berechneten Weltpositionen (`packeisLayout`), hebt das Ziel
 * hervor, lässt die aktuelle Scholle bei ablaufender Zeit sinken und zeigt den
 * springenden Bonus-Fisch mit Flossenschlag. Die reine Spiellogik liegt im Hook
 * `useExpedition`; hier steht nur die Darstellung.
 */
import type { ReactNode } from "react";
import type { FloeSpot } from "@/lib/typing";
import { SHIFT_UNIT, unitGlyph } from "@/lib/typing";

/** Sichtfenster (Bauplan-Weltfenster) dieser Zone. */
export const VIEW_W = 1280;
export const VIEW_H = 720;
export const HORIZON = 430;
/** Fußpunkt/Oberfläche einer Scholle (Weltkoordinaten-Y). */
export const PACKEIS_GROUND_Y = 470;
/** Start-Ufer (Pinguin-Fußpunkt-X). */
export const PACKEIS_SHORE_X = 235;
/** Abstand zwischen zwei Halten (Sprung-Gefühl: sichtbar Wasser dazwischen). */
export const PACKEIS_GAP = 250;

// (Bis 11.09.2026 stand hier `PACKEIS_START`, entfernt weil ungenutzt - der
// Konsument dieser E1-Kompatibilität existiert nicht mehr.)

export interface Pt {
  x: number;
  y: number;
}

export interface PackeisLayout {
  /** Weltkoordinate je Halt (gleiche Indizes wie die Spot-Liste). */
  pts: Pt[];
  worldW: number;
}

/**
 * Legt die Halte eines (reinen Wasser-)Kurses in die Welt: Ufer links, dann jede
 * Scholle im festen Abstand, zuletzt das Ziel-Schelf. Reine Funktion (testbar);
 * der Spiel-Hook nutzt sie für Pinguin-Position und Kamera.
 */
export function packeisLayout(spots: readonly FloeSpot[]): PackeisLayout {
  const pts: Pt[] = [];
  let x = PACKEIS_SHORE_X;
  spots.forEach((s, i) => {
    if (i === 0) x = PACKEIS_SHORE_X; // Ufer
    else x += PACKEIS_GAP;
    pts.push({ x, y: PACKEIS_GROUND_Y });
    void s;
  });
  const last = pts.length > 0 ? pts[pts.length - 1].x : PACKEIS_SHORE_X;
  return { pts, worldW: Math.max(VIEW_W, last + PACKEIS_GAP + 80) };
}

/** Drei leicht unterschiedliche Schollen-Umrisse (um 0,0, Oberkante ~y=0). */
const FLOE_SHAPES = [
  "M-96,2 Q-104,-26 -44,-34 Q34,-42 92,-28 Q128,-18 130,6 Q112,40 34,48 Q-58,52 -104,26 Q-108,14 -96,2 Z",
  "M-88,4 Q-92,-22 -40,-30 Q30,-36 84,-24 Q118,-14 118,8 Q100,38 30,44 Q-52,48 -96,24 Q-100,12 -88,4 Z",
  "M-100,6 Q-96,-20 -36,-30 Q40,-38 96,-22 Q120,-12 122,10 Q104,42 28,46 Q-62,50 -102,22 Q-108,14 -100,6 Z",
];
/** Wasserlinien-Schatten (Unterseite) je Form. */
const FLOE_SHADOW = [
  "M-104,26 Q-40,52 34,48 L24,68 Q-52,70 -100,44 Z",
  "M-96,24 Q-36,48 30,44 L20,64 Q-48,66 -94,42 Z",
  "M-102,22 Q-42,50 28,46 L18,66 Q-56,68 -100,42 Z",
];

/**
 * Ein Wegweiser-Schild, das IN DER SCHOLLE STECKT (umgebaut 14.07.). Vorher hing die Tafel
 * 320 Einheiten über dem Eis, verbunden nur durch eine gepunktete Linie — Johannes: „Oft
 * schwebt der Pinguin und andere Dinge in der Luft". Jetzt ein Holzpfahl mit Schneehäubchen
 * auf dem Schild: er steht im Eis, und das Zeichen sitzt auf Augenhöhe darüber.
 */
function FloeSign({ glyph, target }: { glyph: string; target: boolean }) {
  return (
    <g>
      {/* Schnee-Anhäufung am Fuß des Pfahls — er steckt sichtbar im Eis */}
      <ellipse cx="0" cy="2" rx="20" ry="7" fill="#ffffff" opacity=".75" />
      {/* Pfahl */}
      <rect x={-6} y={-108} width="12" height="112" rx="4" fill="#a9825c" stroke="#8c6a49" strokeWidth="2" />
      {/* Schild */}
      <rect
        x={-46}
        y={-186}
        width="92"
        height="84"
        rx="12"
        fill="#ffffff"
        stroke={target ? "#2b6cb0" : "#c9dced"}
        strokeWidth={target ? 4 : 2}
      />
      {/* Schneehaube auf dem Schild */}
      <path d="M-46,-186 q46,-14 92,0 z" fill="#eef7ff" />
      <text
        x={0}
        y={-126}
        fontSize="58"
        fontWeight="700"
        textAnchor="middle"
        fill={target ? "#123a5e" : "#2e4a60"}
        fontFamily="system-ui, sans-serif"
        className="font-legible"
      >
        {glyph}
      </text>
    </g>
  );
}

/**
 * Ein springender Bonus-Fisch mit Flossenschlag (Bauplan §4.1). Position außen
 * (transform-Attribut), Sprung + Flossen als CSS-Animation innen — sonst würden
 * sich Positions- und Animations-transform gegenseitig überschreiben.
 */
function ExpeditionFish({ glyph, x, y }: { glyph: string; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="px-fishJump">
        <g className="px-fishBody">
          <ellipse cx="0" cy="0" rx="34" ry="20" fill="#5aa9d6" stroke="#2b6cb0" strokeWidth="2.5" />
          <ellipse cx="-6" cy="4" rx="22" ry="11" fill="#8fd0ea" opacity=".8" />
          <path className="px-fishTail" d="M28,0 L52,-16 L52,16 Z" fill="#5aa9d6" stroke="#2b6cb0" strokeWidth="2.5" />
          <path className="px-fishFin" d="M-4,-16 Q6,-32 20,-20 Z" fill="#4a97c4" stroke="#2b6cb0" strokeWidth="2" />
          <circle cx="-18" cy="-5" r="3.2" fill="#123246" />
          <circle cx="-16.6" cy="-6" r="1.1" fill="#fff" />
          <text
            x="2"
            y="2"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="24"
            fontWeight="bold"
            fill="#0f3550"
            className="font-legible"
          >
            {glyph}
          </text>
        </g>
      </g>
    </g>
  );
}

export interface PackeisSceneProps {
  /** Kamera-Versatz (Weltkoordinaten); 0 = linker Rand. */
  camX?: number;
  /** Weltbreite (aus `packeisLayout`); Default = Sichtfenster. */
  worldW?: number;
  /** Das Pinguin-Rig, bereits in Weltkoordinaten platziert (transform am Node). */
  penguin?: ReactNode;
  /** Die Halte des Kurses (Ufer, Schollen, Ziel). */
  spots?: readonly FloeSpot[];
  /** Weltposition je Halt (aus `packeisLayout`). */
  pts?: readonly Pt[];
  /** Index des Halts, auf dem der Pinguin steht. */
  pos?: number;
  /** Index des Ziel-Halts (leuchtet). */
  targetIdx?: number;
  /** Gescheitert (Scholle sinkt) auf dem aktuellen Halt? */
  sunk?: boolean;
  /** 0..~34: wie tief die aktuelle Scholle mit der Zeit schon eingesackt ist. */
  sinkOffset?: number;
  /** Buchstaben groß anzeigen (erst nach gelernter Umschalttaste). */
  uppercase?: boolean;
  /** Springender Bonus-Fisch (Weltposition + Zeichen). */
  fish?: { glyph: string; x: number; y: number } | null;
  /** Wasser-Ringe (Weltkoordinate-X), wo ein Fisch tauchte / eine Scholle sank. */
  rings?: number | null;
  /** Etappe geschafft (Polarlicht-Deko am Ziel, nur fehlerfreier Lauf). */
  aurora?: boolean;
}

const SIGN_UNIT_LABEL = (unit: string | null, uppercase: boolean): string =>
  unit === SHIFT_UNIT ? "⇧" : unit ? unitGlyph(unit, uppercase) : "";

export function PackeisScene({
  camX = 0,
  worldW = VIEW_W,
  penguin,
  spots,
  pts,
  pos = 0,
  targetIdx = 1,
  sunk = false,
  sinkOffset = 0,
  uppercase = false,
  fish = null,
  rings = null,
  aurora = false,
}: PackeisSceneProps) {
  // Parallax: fernere Ebenen wandern langsamer als die Spielebene.
  const far = `translate(${-camX * 0.3} 0)`;
  const mid = `translate(${-camX * 0.6} 0)`;
  const play = `translate(${-camX} 0)`;

  // Ferne Bergkette über die ganze Weltbreite kacheln (kein Leerraum beim Schwenk).
  const ridges: ReactNode[] = [];
  for (let bx = 0; bx < worldW + 400; bx += 520) {
    ridges.push(
      <polygon key={`r${bx}`} points={`${bx},430 ${bx + 170},300 ${bx + 350},430`} fill="#a9cee4" opacity=".7" />,
      <polygon key={`r2${bx}`} points={`${bx + 260},430 ${bx + 520},268 ${bx + 800},430`} fill="#93bfda" opacity=".8" />,
    );
  }

  return (
    <svg
      className="px-world px-scene"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pxSky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fa9d6" />
          <stop offset=".55" stopColor="#b8d9ee" />
          <stop offset=".92" stopColor="#ffd9a0" />
        </linearGradient>
        <linearGradient id="pxSea1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b83b4" />
          <stop offset="1" stopColor="#0b3d5e" />
        </linearGradient>
        <linearGradient id="pxFloe1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfdff" />
          <stop offset="1" stopColor="#cde5f2" />
        </linearGradient>
        <radialGradient id="pxSun1" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset=".35" stopColor="#ffd98e" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffd98e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ---- Hintergrund (fix): Himmel + Wasser füllen immer das Sichtfenster ---- */}
      <rect x="0" y="0" width={VIEW_W} height={HORIZON} fill="url(#pxSky1)" />
      <rect x="0" y={HORIZON} width={VIEW_W} height={VIEW_H - HORIZON} fill="url(#pxSea1)" />

      {/* ---- Polarlicht-Finale (nur fehlerfreier Lauf), über dem Himmel ---- */}
      {aurora && (
        <g className="px-aurora" strokeWidth="13" fill="none" opacity=".85">
          <path d="M-40,150 Q300,110 640,150 T1320,150" stroke="#7de3a8" />
          <path d="M-40,180 Q320,150 640,180 T1320,180" stroke="#7cc4ff" />
          <path d="M-40,120 Q280,95 640,120 T1320,120" stroke="#c493ff" />
        </g>
      )}

      {/* ---- Ferne (langsames Parallax): Sonne, blasse Berge, Möwen ---- */}
      <g transform={far}>
        <circle cx="1150" cy="300" r="150" fill="url(#pxSun1)" />
        <circle cx="1150" cy="300" r="46" fill="#fff0c9" />
        {ridges}
        <g className="gull" stroke="#3d5872" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M0,150 q11,-12 22,0 q11,-12 22,0" />
        </g>
        <g className="gull g2" stroke="#3d5872" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M0,110 q9,-10 18,0 q9,-10 18,0" />
        </g>
      </g>

      {/* ---- Mittelgrund: Sonnenspiegelung ---- */}
      <g transform={mid}>
        <ellipse cx="1150" cy="452" rx="120" ry="10" fill="#ffd98e" opacity=".28" />
        <ellipse cx="1142" cy="486" rx="80" ry="7" fill="#ffd98e" opacity=".18" />
      </g>

      {/* ---- Spielebene: Wellen, Schollen, Ziel, Fisch, Pinguin ---- */}
      <g transform={play}>
        <g className="wave" stroke="#ffffff" strokeOpacity=".2" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d={waveLine(502, worldW)} />
          <path d={waveLine(588, worldW)} strokeOpacity=".12" />
        </g>

        {/* Start-Ufer links (Schelf) */}
        {pts && pts[0] && (
          <g transform={`translate(${pts[0].x} ${PACKEIS_GROUND_Y})`}>
            <path d="M-260,20 Q-150,-16 -20,-6 Q40,0 54,24 Q30,60 -70,66 Q-190,68 -260,44 Z" fill="url(#pxFloe1)" />
            <path d="M-70,66 Q-180,66 -252,44 L-248,64 Q-176,84 -76,84 Z" fill="#8fb7cc" />
          </g>
        )}

        {/* Schollen (Wasser-Stationen) mit Zeichen-Tafel */}
        {spots?.map((s, i) => {
          if (!pts || s.kind !== "station") return null;
          const p = pts[i];
          const isTarget = i === targetIdx;
          const isCurrent = i === pos;
          const gone = sunk && isCurrent;
          const visited = i < pos && !gone;
          const shape = i % FLOE_SHAPES.length;
          const yOff = (isCurrent && !gone ? sinkOffset : 0) + (gone ? 120 : 0);
          // Die aktuelle Scholle steht still (Pinguin darauf); die anderen wippen.
          // Position (+ Sinken) außen als CSS-transform (weich), Wippen innen als
          // Animation — zwei Ebenen, damit sich die transforms nicht überschreiben.
          const bobClass = isCurrent || gone ? "px-floe" : `px-floe bob${(i % 3) + 1}`;
          return (
            <g
              key={i}
              style={{
                transform: `translate(${p.x}px, ${p.y + yOff}px)`,
                opacity: gone ? 0 : visited ? 0.6 : 1,
                transition: "opacity .5s, transform .5s",
              }}
            >
              <g className={bobClass}>
                <path d={FLOE_SHADOW[shape]} fill="#8fb7cc" />
                <path
                  d={FLOE_SHAPES[shape]}
                  fill="url(#pxFloe1)"
                  stroke={isTarget ? "#2b6cb0" : "#cfe5f2"}
                  strokeWidth={isTarget ? 5 : 2}
                />
                {/* Risse sofort beim Betreten (die Scholle „springt" gleich, §4.1/Johannes 13.07.) */}
                {isCurrent && sinkOffset > 1 && (
                  <path d="M-34,2 L-10,-8 L6,4 L30,-6" fill="none" stroke="#7fa9c0" strokeWidth="3" opacity=".8" />
                )}
              </g>
              <FloeSign glyph={SIGN_UNIT_LABEL(s.unit, uppercase)} target={isTarget} />
            </g>
          );
        })}

        {/* Ziel-Schelf (Iglu-Insel) am Ende */}
        {pts && spots && spots.length > 0 && spots[spots.length - 1].kind !== "station" && (
          <g transform={`translate(${pts[pts.length - 1].x} ${PACKEIS_GROUND_Y})`}>
            <path d="M-40,18 Q90,-18 220,-6 Q260,26 220,60 Q90,72 -40,54 Z" fill="url(#pxFloe1)" />
            <path d="M40,20 A34,30 0 0 1 108,20 Z" fill="#f4fafd" stroke="#b9d7e8" strokeWidth="2" />
            <path d="M62,20 A12,14 0 0 1 86,20 Z" fill="#9cc4dd" stroke="#b9d7e8" strokeWidth="2" />
          </g>
        )}

        {/* Wasser-Ringe (Fisch tauchte / Scholle sank) */}
        {rings !== null && (
          <g transform={`translate(${rings} ${PACKEIS_GROUND_Y + 20})`}>
            <circle r="20" className="px-ring px-ring--1" />
            <circle r="20" className="px-ring px-ring--2" />
          </g>
        )}

        {/* Bonus-Fisch */}
        {fish && <ExpeditionFish glyph={fish.glyph} x={fish.x} y={fish.y} />}

        {/* Der Pinguin (vom Aufrufer in Weltkoordinaten platziert) */}
        {penguin}
      </g>
    </svg>
  );
}

/** Durchgehende Wellenlinie über die Weltbreite (CSS lässt sie driften). */
function waveLine(y: number, worldW: number): string {
  const parts: string[] = [`M-40,${y}`];
  for (let x = 0; x <= worldW + 80; x += 70) parts.push(`q35,-9 70,0 t70,0`);
  return parts.join(" ");
}
