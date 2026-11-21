/**
 * Zone 3 — „Die Echo-Höhle" (Finsternis). BLINDSCHREIBEN (Bauplan §4.3): die
 * Stationen tragen KEIN sichtbares Zeichen — das Höhlenwesen sagt jede Taste an,
 * das Kind tippt nur nach Gehör. Sichtbar ist bloß, WO die nächste Station liegt
 * (ein pochendes Echo-Zeichen), nie WELCHE Taste. Der Buchstabe darf nirgends im
 * DOM stehen (auch nicht sr-only in dieser Szene) — die Ansage läuft allein über
 * Monster-Klang + die Live-Region der Bühne (Braillezeile).
 *
 * Aufbau wie {@link PackeisScene}/{@link SteilwandScene} (Sichtfenster 1280×720,
 * Kamera zieht mit, transform-only). Neu: dunkle Palette mit Laternenschein um den
 * Pinguin, Kristallschimmer, blinzelnde Augenpaare, Stalaktiten/Stalagmiten. Der
 * Pflicht-Kontrastschalter „helle Höhle" (`bright`) hellt alles auf und gibt den
 * Formen kräftige Umrisse (für Kinder mit Sehbeeinträchtigung, Bauplan §4.3/§7).
 *
 * Die Layout-Formel ist ebenerdig (die Höhle ist flacher Boden), analog zum Packeis.
 */
import type { ReactNode } from "react";
import type { FloeSpot } from "@/lib/typing";
import { VIEW_H, VIEW_W, type PackeisLayout, type Pt } from "./PackeisScene";

/** Höhleneingang (Start, Pinguin-Fußpunkt). */
export const CAVE_SHORE_X = 240;
/** Höhlenboden (die Stationen liegen ebenerdig darauf). */
export const CAVE_GROUND_Y = 512;
/** Abstand der Echo-Stellen (etwas enger als das Wasser). */
const STEP_X = 232;

/**
 * Legt die Echo-Stellen einer cave-Etappe in die Welt: Eingang links, dann jede
 * Station ebenerdig nach rechts. Reine Funktion (testbar), gleiche Indizes wie die
 * Spot-Liste — analog {@link packeisLayout}, nur flach.
 */
export function caveLayout(spots: readonly FloeSpot[]): PackeisLayout {
  const pts: Pt[] = [];
  let x = CAVE_SHORE_X;
  spots.forEach((_s, i) => {
    if (i === 0) x = CAVE_SHORE_X;
    else x += STEP_X;
    pts.push({ x, y: CAVE_GROUND_Y });
  });
  const last = pts.length > 0 ? pts[pts.length - 1].x : CAVE_SHORE_X;
  return { pts, worldW: Math.max(VIEW_W, last + STEP_X + 140) };
}

/** Ein paar Stalaktiten/Stalagmiten über die Weltbreite streuen (ruhig, fix). */
function formations(worldW: number, bright: boolean): ReactNode[] {
  const spikes: ReactNode[] = [];
  const rockTop = bright ? "#b9b0c8" : "#2a2438";
  const rockBot = bright ? "#a89ebb" : "#231d30";
  for (let x = 120, k = 0; x < worldW; x += 196, k++) {
    const wTop = 34 + ((x * 7) % 26);
    const hTop = 70 + ((x * 13) % 90);
    // Stalaktit (von der Decke)
    spikes.push(
      <path key={`t${k}`} d={`M${x - wTop / 2},0 L${x + wTop / 2},0 L${x},${hTop} Z`} fill={rockTop} opacity={bright ? 0.9 : 1} />,
    );
    // Stalagmit (vom Boden), leicht versetzt
    const xb = x + 96;
    const wBot = 40 + ((xb * 5) % 30);
    const hBot = 60 + ((xb * 11) % 80);
    spikes.push(
      <path key={`g${k}`} d={`M${xb - wBot / 2},${VIEW_H} L${xb + wBot / 2},${VIEW_H} L${xb},${VIEW_H - hBot} Z`} fill={rockBot} opacity={bright ? 0.9 : 1} />,
    );
  }
  return spikes;
}

/** Kristallschimmer + blinzelnde Augenpaare (ruhig gestreut, CSS-animiert). */
function sparkles(worldW: number, bright: boolean): ReactNode[] {
  const nodes: ReactNode[] = [];
  for (let x = 180, k = 0; x < worldW; x += 173, k++) {
    const y = 150 + ((x * 29) % 260);
    if (k % 3 === 0) {
      // Augenpaar (zwei blinzelnde Punkte)
      const eye = bright ? "#7a6cff" : "#c7f0ff";
      nodes.push(
        <g key={`e${k}`} className="px-cave-eye" style={{ animationDelay: `${(x % 7) * 0.4}s` }}>
          <ellipse cx={x} cy={y} rx="7" ry="5" fill={eye} />
          <ellipse cx={x + 22} cy={y} rx="7" ry="5" fill={eye} />
        </g>,
      );
    } else {
      // Kristall (kleine leuchtende Raute) — Schimmer skaliert um die eigene Mitte
      // (transform-box: fill-box in der CSS), darum keine inline transform-origin.
      const cr = bright ? "#6d5fd0" : "#8fe6ff";
      nodes.push(
        <g key={`c${k}`} className="px-cave-crystal" style={{ animationDelay: `${(x % 5) * 0.5}s` }}>
          <path d={`M${x},${y - 12} L${x + 7},${y} L${x},${y + 12} L${x - 7},${y} Z`} fill={cr} opacity={bright ? 0.8 : 0.9} />
        </g>,
      );
    }
  }
  return nodes;
}

export interface CaveSceneProps {
  camX?: number;
  worldW?: number;
  penguin?: ReactNode;
  spots?: readonly FloeSpot[];
  pts?: readonly Pt[];
  pos?: number;
  targetIdx?: number;
  /** Zeit wird knapp → das nächste Echo pocht dringlicher (Bauplan §4.3). */
  cracking?: boolean;
  /** Kontrastschalter „helle Höhle" (Pflicht, Bauplan §4.3/§7). */
  bright?: boolean;
  /** Aurora bleibt hier ungenutzt (unter Tage kein Himmel) — nur Signatur-Parität. */
  aurora?: boolean;
}

export function CaveScene({
  camX = 0,
  worldW = VIEW_W,
  penguin,
  spots,
  pts,
  pos = 0,
  targetIdx = 1,
  cracking = false,
  bright = false,
}: CaveSceneProps) {
  const far = `translate(${-camX * 0.3} 0)`;
  const play = `translate(${-camX} 0)`;

  // Laternenschein sitzt am Pinguin (Fußpunkt der aktuellen Station).
  const lampX = pts?.[pos]?.x ?? CAVE_SHORE_X;
  const lampY = CAVE_GROUND_Y - 96;

  const floorTop = bright ? "#c3bad4" : "#2b2440";
  const floorBot = bright ? "#b0a6c6" : "#181322";

  return (
    <svg className="px-world px-scene" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
      <defs>
        <radialGradient id="cvSky" cx=".5" cy=".2" r=".9">
          <stop offset="0" stopColor={bright ? "#5b5170" : "#241d38"} />
          <stop offset="1" stopColor={bright ? "#413a55" : "#0c0916"} />
        </radialGradient>
        <linearGradient id="cvFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={floorTop} />
          <stop offset="1" stopColor={floorBot} />
        </linearGradient>
        <radialGradient id="cvLamp" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffe9b0" stopOpacity={bright ? 0.35 : 0.9} />
          <stop offset=".55" stopColor="#ffcf7a" stopOpacity={bright ? 0.15 : 0.4} />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cvEcho" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#9be7ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#9be7ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Finsternis / bei „helle Höhle" gedämpftes Grau */}
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#cvSky)" />

      {/* Ferne: Kristalle + blinzelnde Augen (langsames Parallax) */}
      <g transform={far}>{sparkles(worldW, bright)}</g>

      {/* Spielebene: Fels, Echo-Stellen, Laterne, Pinguin */}
      <g transform={play}>
        {/* Decke + Boden mit Formationen */}
        <rect x="0" y="0" width={worldW} height="18" fill={bright ? "#a99fbe" : "#201a2e"} />
        {formations(worldW, bright)}
        <rect x="0" y={CAVE_GROUND_Y + 8} width={worldW} height={VIEW_H - CAVE_GROUND_Y} fill="url(#cvFloor)" />
        <path
          d={`M0,${CAVE_GROUND_Y + 8} L${worldW},${CAVE_GROUND_Y + 8}`}
          stroke={bright ? "#8f83a8" : "#0c0916"}
          strokeWidth="3"
        />

        {/* Laternenschein um den Pinguin */}
        <circle cx={lampX} cy={lampY} r={bright ? 210 : 260} fill="url(#cvLamp)" />

        {/* Echo-Stellen (blind: KEIN Zeichen, nur ein Leucht-Ring am Boden) */}
        {spots?.map((s, i) => {
          if (!pts || s.kind !== "station") return null;
          const p = pts[i];
          const isTarget = i === targetIdx;
          const visited = i < pos;
          // ★ Kontrast (29.10.2026): in der „hellen Höhle" lag der blaue Ring `#3b57c9` auf einem
          // mittelgrauen Fleck (1,3 : 1). Jetzt ein heller Fleck und ein dunkelblauer Ring (≥ 3 : 1).
          const ringColor = bright ? "#26339a" : "#7fd8ff";
          return (
            <g key={i} transform={`translate(${p.x} ${p.y})`} style={{ opacity: visited ? 0.4 : 1, transition: "opacity .4s" }}>
              {/* Boden-Markierung (Echo-Kringel), pocht am Ziel */}
              <ellipse cx="0" cy="6" rx="52" ry="15" fill={bright ? "#f1edf8" : "#120e1e"} opacity={bright ? 0.9 : 0.7} />
              {isTarget && (
                <g className={cracking ? "px-echo px-echo--urgent" : "px-echo"}>
                  <circle cx="0" cy="0" r="46" fill="url(#cvEcho)" />
                  <ellipse cx="0" cy="4" rx="40" ry="13" fill="none" stroke={ringColor} strokeWidth="4" opacity="0.95" />
                  <ellipse cx="0" cy="4" rx="24" ry="8" fill="none" stroke={ringColor} strokeWidth="3" opacity="0.7" />
                </g>
              )}
              {!isTarget && !visited && (
                <ellipse cx="0" cy="4" rx="34" ry="11" fill="none" stroke={ringColor} strokeWidth="3" strokeDasharray="7 5" />
              )}
            </g>
          );
        })}

        {/* Höhlenausgang am Ziel (schwaches Tageslicht als Ziel-Marke) */}
        {pts && spots && spots.length > 0 && spots[spots.length - 1].kind !== "station" && (
          <g transform={`translate(${pts[pts.length - 1].x} ${CAVE_GROUND_Y})`}>
            <path d="M-46,8 Q-46,-96 0,-96 Q46,-96 46,8 Z" fill={bright ? "#d8d0e6" : "#0a0713"} stroke={bright ? "#8f83a8" : "#3a3350"} strokeWidth="3" />
            <path d="M-30,8 Q-30,-74 0,-74 Q30,-74 30,8 Z" fill="#ffe9b0" opacity={bright ? 0.5 : 0.75} />
          </g>
        )}

        {penguin}
      </g>
    </svg>
  );
}
