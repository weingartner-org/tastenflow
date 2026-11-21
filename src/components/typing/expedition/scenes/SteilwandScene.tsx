/**
 * Zone 2 — „Die Steilwand" (goldene Stunde). Der Buchstabenberg: felsige Tritte
 * führen aufwärts, an jedem tippt das Kind eine kurze ZEICHENFOLGE (Bauplan §4.2).
 * Aufbau wie {@link PackeisScene} (Sichtfenster 1280×720, Kamera zieht mit, drei
 * Parallax-Ebenen, transform-only) — nur Licht (warmes Gegenlicht, Rim-Light an den
 * Fels-Kanten), Geometrie (Steigung statt Wasser) und die Folgen-Tafel sind neu.
 *
 * Die reine Spiellogik liegt im Hook `useExpedition`; hier steht nur die Darstellung.
 * Die Layout-Formel ist aus dem getesteten Altspiel übernommen (climb: enger Schritt
 * nach rechts, je Tritt höher; Gipfel mit Fahne), auf die größere Welt skaliert.
 */
import type { ReactNode } from "react";
import type { FloeSpot } from "@/lib/typing";
import { SHIFT_UNIT, unitGlyph } from "@/lib/typing";
import { VIEW_H, VIEW_W, type PackeisLayout, type Pt } from "./PackeisScene";
import { laufweiteZusatzIn, type ZeichenabstandFaktor } from "@/lib/typing/zeichenabstand";

/** Bergfuß (Start, Pinguin-Fußpunkt). */
export const STEIL_SHORE_X = 235;
export const STEIL_GROUND_Y = 470;
/** Enger Schritt nach rechts je Tritt (Wasser: 250 — der Berg ist steil). */
const STEP_X = 155;
/** Gesamte Steighöhe, auf die climb-Tritte verteilt (Gipfel bleibt im Bild). */
const RISE_TOTAL = 240;
/** Der Gipfel liegt noch etwas über dem letzten Tritt (Fahne). */
const PEAK_RISE = 42;

/**
 * Legt die Halte einer climb-Etappe in die Welt: Bergfuß links, dann jeder Tritt
 * enger + höher, zuletzt der Gipfel. Reine Funktion (testbar), gleiche Indizes wie
 * die Spot-Liste — analog {@link packeisLayout}, aber aufsteigend.
 */
export function steilwandLayout(spots: readonly FloeSpot[]): PackeisLayout {
  const climbCount = spots.filter((s) => s.kind === "station" && s.stage === "climb").length;
  const dy = climbCount > 0 ? Math.min(64, RISE_TOTAL / climbCount) : 0;
  const pts: Pt[] = [];
  let x = STEIL_SHORE_X;
  let y = STEIL_GROUND_Y;
  spots.forEach((s, i) => {
    if (i === 0) {
      x = STEIL_SHORE_X;
      y = STEIL_GROUND_Y;
    } else if (s.kind === "station") {
      x += STEP_X;
      y -= dy;
    } else {
      // Gipfel (finish/rest): ein Schritt weiter, noch etwas höher.
      x += STEP_X;
      y -= PEAK_RISE;
    }
    pts.push({ x, y });
  });
  const last = pts.length > 0 ? pts[pts.length - 1].x : STEIL_SHORE_X;
  return { pts, worldW: Math.max(VIEW_W, last + STEP_X + 120) };
}

const GLYPH = (unit: string, uppercase: boolean): string =>
  unit === SHIFT_UNIT ? "⇧" : unitGlyph(unit, uppercase);

/**
 * Folgen-Tafel an einem Tritt: die Zeichen der Folge nebeneinander. Am Ziel-Tritt
 * zeigt sie den Fortschritt — schon getippte Zeichen abgehakt (grün), das nächste
 * hervorgehoben, die restlichen blass. An anderen Tritten steht die Folge nur ruhig.
 */
function ClimbSign({
  seq,
  target,
  seqPos,
  uppercase,
  zeichenabstand = 1,
}: {
  seq: string[];
  target: boolean;
  seqPos: number;
  uppercase: boolean;
  zeichenabstand?: ZeichenabstandFaktor;
}) {
  // ★ CVI (19.09.2026, „überall"): Zeichen der Folge rücken um dieselbe
  // Zusatzstrecke auseinander wie in der Übungszeile (`laufweiteZusatzIn`).
  // Bei „aus" 46 wie immer - und die Tafel genau so breit wie vorher.
  const schritt = 46 + laufweiteZusatzIn(zeichenabstand, 46);
  const w = Math.max(96, (seq.length - 1) * schritt + 76);
  return (
    // Die aktive (Ziel-)Tafel bekommt eine Klasse: der Aufrufer rendert sie ZULETZT
    // (= im SVG oben, damit sie nie von einer Nachbar-Tafel verdeckt wird) und sie
    // „ploppt" beim Wechsel kurz nach vorn (Johannes 13.07.: kleiner Effekt genügt).
    <g className={`px-climb-sign${target ? " px-climb-sign--active" : ""}`}>
      {/* Das Schild STECKT im Fels-Tritt (Pfahl mit Fuß) — es schwebt nicht mehr darüber
          (Johannes 14.07.: „Oft schwebt der Pinguin und andere Dinge in der Luft"). */}
      <ellipse cx="0" cy="-4" rx="18" ry="6" fill="#8c6a49" opacity=".35" />
      <rect x={-6} y={-166} width="12" height="164" rx="4" fill="#a9825c" stroke="#8c6a49" strokeWidth="2" />
      <g transform={`translate(${-w / 2} -232)`}>
        <rect width={w} height="74" rx="15" fill="#fffaf0" stroke={target ? "#d9812e" : "none"} strokeWidth={target ? 4 : 0} />
        {seq.map((ch, i) => {
          const done = target && i < seqPos;
          const active = target && i === seqPos;
          // ★ Kontrast (29.10.2026): erledigt war `#3f9d6d` mit Deckkraft .75 (2,3 : 1), kommend
          // `#9a8a68` (3,3 : 1). Jetzt alles ≥ 4,5 : 1 auf dem Schild `#fffaf0`; „erledigt" trägt
          // zusätzlich die Durchstreichung, „aktiv" den hellblauen Grund.
          const fill = done ? "#1f6b45" : active ? "#123a5e" : "#6b5a3a";
          return (
            <g key={i} transform={`translate(${30 + i * schritt} 0)`}>
              {active && <rect x={-20} y={12} width={40} height={50} rx="9" fill="#bfe4f6" />}
              <text
                x={0}
                y={50}
                fontSize="46"
                fontWeight="700"
                textAnchor="middle"
                fill={fill}
                fontFamily="system-ui, sans-serif"
                className="font-legible"
                style={done ? { textDecoration: "line-through" } : undefined}
              >
                {GLYPH(ch, uppercase)}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

export interface SteilwandSceneProps {
  camX?: number;
  worldW?: number;
  penguin?: ReactNode;
  spots?: readonly FloeSpot[];
  pts?: readonly Pt[];
  pos?: number;
  targetIdx?: number;
  /** Wie viele Zeichen der Ziel-Folge schon getippt sind (Teilfortschritt). */
  seqPos?: number;
  uppercase?: boolean;
  /** Zeit wird knapp → Steinchen/Risse am aktuellen Tritt (Bauplan §4.2). */
  cracking?: boolean;
  aurora?: boolean;
  /** „Zeichenabstand groß (CVI)" - rückt die Zeichen der Tafel auseinander (19.09.2026). */
  zeichenabstand?: ZeichenabstandFaktor;
}

export function SteilwandScene({
  camX = 0,
  penguin,
  spots,
  pts,
  pos = 0,
  targetIdx = 1,
  seqPos = 0,
  uppercase = false,
  cracking = false,
  aurora = false,
  zeichenabstand = 1,
}: SteilwandSceneProps) {
  const far = `translate(${-camX * 0.3} 0)`;
  const mid = `translate(${-camX * 0.6} 0)`;
  const play = `translate(${-camX} 0)`;

  // Berg-Massiv aus den Tritt-Punkten (Bergfuß → Tritte hinauf → Gipfel → hinab), mit
  // Schneekappe am Grat und ein paar Fels-Rissen — ein „echterer Berg" statt der nackten
  // Silhouette (Johannes 15.07.: „Zeichne einen echteren Berg").
  let mountain = "";
  let ridge = "";
  let snow = "";
  const crevasses: string[] = [];
  if (pts && pts.length > 0) {
    const pt = pts;
    const footY = STEIL_GROUND_Y + 20;
    const body = [`M${pt[0].x - 170},${VIEW_H}`, `L${pt[0].x - 46},${footY}`];
    pt.forEach((p) => body.push(`L${p.x},${p.y + 6}`));
    const lastP = pt[pt.length - 1];
    body.push(`L${lastP.x + 160},${STEIL_GROUND_Y + 64}`, `L${lastP.x + 160},${VIEW_H}`, "Z");
    mountain = body.join(" ");

    // Grat (Oberkante) für Rim-Light und als Oberkante der Schneekappe.
    ridge = `M${pt[0].x - 46},${footY} ` + pt.map((p) => `L${p.x},${p.y + 6}`).join(" ");

    // Schneekappe: ein Band, das dem Grat folgt und nach oben zum Gipfel HÖHER wird
    // (mehr Schnee je höher der Punkt), mit leicht gezackter Unterkante.
    const baseY = STEIL_GROUND_Y;
    const top = pt.map((p) => ({ x: p.x, y: p.y + 6, alt: Math.max(0, baseY - p.y) }));
    const maxAlt = Math.max(1, ...top.map((t) => t.alt));
    const depth = (alt: number) => 7 + (alt / maxAlt) * 58; // 7…65 px, oben tiefer
    const fwd = top.map((t) => `L${t.x},${t.y}`).join(" ");
    const back = [...top]
      .reverse()
      .map((t, k) => `L${t.x},${t.y + depth(t.alt) + (k % 2 === 0 ? 7 : -5)}`)
      .join(" ");
    snow = `M${top[0].x},${top[0].y} ${fwd} ${back} Z`;

    // Ein paar Fels-Risse auf der Flanke (Struktur, damit es nicht flächig wirkt).
    for (let k = 1; k < pt.length - 1; k += 2) {
      const p = pt[k];
      crevasses.push(`M${p.x - 12},${p.y + 46} q 16,30 -8,80`);
    }
  }

  return (
    <svg className="px-world px-scene" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="stSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0a460" />
          <stop offset=".5" stopColor="#ffcf94" />
          <stop offset="1" stopColor="#ffe9c4" />
        </linearGradient>
        <linearGradient id="stRock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b4a5f" />
          <stop offset="1" stopColor="#3a2e42" />
        </linearGradient>
        <linearGradient id="stStep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf1e6" />
          <stop offset="1" stopColor="#d8c1b0" />
        </linearGradient>
        {/* Fels-Massiv mit Sonnenflanke (rechts hell) und Schattenflanke (links tief). */}
        <linearGradient id="stMassif" x1="0" y1="0" x2="1" y2="0.7">
          <stop offset="0" stopColor="#4a3c4f" />
          <stop offset=".55" stopColor="#5b4a5f" />
          <stop offset="1" stopColor="#7a6470" />
        </linearGradient>
        {/* Schneekappe: sonnenbeschienenes Weiß oben, kühler Blauton im Schatten unten. */}
        <linearGradient id="stSnow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset="1" stopColor="#d7e4f2" />
        </linearGradient>
        <radialGradient id="stSun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff6e0" />
          <stop offset=".4" stopColor="#ffcf8a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffcf8a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Himmel goldene Stunde */}
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#stSky)" />

      {aurora && (
        <g className="px-aurora" strokeWidth="13" fill="none" opacity=".8">
          <path d="M-40,140 Q300,105 640,140 T1320,140" stroke="#7de3a8" />
          <path d="M-40,175 Q320,145 640,175 T1320,175" stroke="#ffc98a" />
        </g>
      )}

      {/* Ferne: tiefstehende Sonne + blasse Gipfel mit Schneespitzen */}
      <g transform={far}>
        <circle cx="1040" cy="330" r="140" fill="url(#stSun)" />
        <circle cx="1040" cy="330" r="52" fill="#fff2d2" />
        <polygon points="0,430 240,250 470,430" fill="#e6b98a" opacity=".55" />
        <polygon points="180,309 240,250 300,309" fill="#fff6ea" opacity=".55" />
        <polygon points="360,430 700,210 1020,430" fill="#dcab7d" opacity=".5" />
        <polygon points="632,279 700,210 768,279" fill="#fff6ea" opacity=".5" />
      </g>

      <g transform={mid}>
        <polygon points="120,440 460,300 820,440" fill="#c98f66" opacity=".45" />
        <polygon points="404,344 460,300 516,344" fill="#fdf4ea" opacity=".55" />
      </g>

      {/* Spielebene: Berg, Tritte, Tafeln, Fahne, Pinguin */}
      <g transform={play}>
        {mountain && (
          <>
            <path d={mountain} fill="url(#stMassif)" />
            {/* Fels-Risse (Struktur der Flanke) */}
            {crevasses.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#2e2436" strokeWidth="3" strokeLinecap="round" opacity=".4" />
            ))}
            {/* Schneekappe am Grat (oben tiefer, gezackte Unterkante) */}
            {snow && <path d={snow} fill="url(#stSnow)" opacity=".96" />}
            {/* Rim-Light: helle, sonnenbeschienene Oberkante des Bergrückens */}
            {ridge && (
              <path d={ridge} fill="none" stroke="#fff4d8" strokeWidth="4.5" strokeLinejoin="round" opacity=".95" />
            )}
          </>
        )}

        {/* Tritte (felsige Plattformen) — in Reihenfolge; die Tafeln folgen darüber. */}
        {spots?.map((s, i) => {
          if (!pts || s.kind !== "station") return null;
          const p = pts[i];
          const isTarget = i === targetIdx;
          const isCurrent = i === pos;
          const visited = i < pos;
          return (
            <g key={i} transform={`translate(${p.x} ${p.y})`} style={{ opacity: visited ? 0.7 : 1, transition: "opacity .4s" }}>
              {/* Fels-Tritt */}
              <path d="M-64,6 Q-70,-14 -20,-18 L46,-18 Q78,-16 74,8 Q40,24 -20,24 Q-58,22 -64,6 Z" fill="url(#stStep)" stroke={isTarget ? "#d9812e" : "#c3ab98"} strokeWidth={isTarget ? 5 : 2} />
              <path d="M-64,6 Q-20,24 46,18 L40,30 Q-24,34 -62,18 Z" fill="#b79a86" />
              {/* Steinschlag: Riss, herabkollernde Steine und Staubwolke, wenn die Zeit am
                  aktuellen Tritt knapp wird — kräftig sichtbar (Johannes 15.07.). Der Klang
                  (playRockfall) kommt gestaffelt aus dem Hook dazu. */}
              {isCurrent && cracking && (
                <g className="px-rockle">
                  <path d="M-34,-8 L-12,-15 L0,-5 L18,-13 L34,-7" fill="none" stroke="#4f3f39" strokeWidth="3.5" opacity=".9" />
                  <ellipse cx="4" cy="40" rx="40" ry="11" fill="#cbb9ab" opacity=".35" />
                  <circle cx="-46" cy="30" r="5.5" fill="#8a7566" />
                  <circle cx="-30" cy="52" r="3.5" fill="#7a6459" />
                  <circle cx="52" cy="26" r="4.5" fill="#8a7566" />
                  <circle cx="62" cy="50" r="3" fill="#7a6459" />
                </g>
              )}
            </g>
          );
        })}

        {/* NUR die Folge des AKTUELLEN Tritts (14.07.). Vorher trug jeder Tritt seine Tafel —
            am steilen Berg überlappten sie sich zu einem unlesbaren Schindel-Teppich (Johannes:
            „Das Design … sieht nicht besonders gut aus"), und man las die Folgen der nächsten
            Tritte schon im Voraus. Jetzt hängt genau ein Schild am Ziel-Tritt. */}
        {pts &&
          spots
            ?.map((s, i) => ({ s, i }))
            .filter(({ s, i }) => s.kind === "station" && i === targetIdx)
            .map(({ s, i }) => {
              const p = pts[i];
              const seq = s.unit === SHIFT_UNIT ? [SHIFT_UNIT] : [...(s.unit ?? "")];
              return (
                <g key={i} transform={`translate(${p.x} ${p.y})`}>
                  <ClimbSign
                    seq={seq}
                    target
                    seqPos={seqPos}
                    uppercase={uppercase}
                    zeichenabstand={zeichenabstand}
                  />
                </g>
              );
            })}

        {/* Gipfel-Fahne am Ziel */}
        {pts && spots && spots.length > 0 && spots[spots.length - 1].kind !== "station" && (
          <g transform={`translate(${pts[pts.length - 1].x} ${pts[pts.length - 1].y})`}>
            <rect x="-4" y="-96" width="7" height="120" rx="3" fill="#7a5a3a" />
            <path d="M3,-96 L64,-78 L3,-58 Z" fill="#e0524f" />
            <path d="M-52,26 Q0,6 60,26 Q22,44 -52,26 Z" fill="#f4fafd" opacity=".8" />
          </g>
        )}

        {penguin}
      </g>
    </svg>
  );
}
