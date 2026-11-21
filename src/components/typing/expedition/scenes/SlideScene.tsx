/**
 * Zone 6 — „Die Heim-Bauchrutsche" (Nacht), RHYTHMUS-SPIEL (umgebaut 14.07.).
 *
 * Vorher standen hier Schilder mit Zeichenfolgen am Hang — das war „die Steilwand noch
 * einmal, nur bergab" (Johannes: „sonst ist sie wie die Steilwand sehr unkreativ"). Jetzt
 * rast der Pinguin in Bauchlage den Hang hinab, und EIN EINZELNER Buchstabe kommt auf einer
 * Eisplatte auf ihn zugeflogen. Er zählt nur, wenn er GENAU an der Ziellinie getippt wird —
 * das Tor vor dem Pinguin. Es ist immer nur ein Buchstabe unterwegs (Johannes: „nur einzelne,
 * und es darf auch nur einer sichtbar sein").
 *
 * Der Moment ist auf drei Kanälen erkennbar (§7): Die Eisplatte trifft die Ziellinie (Blick),
 * der helle Zielton erklingt genau dann (Gehör — drei Ticks takten den Anflug davor), und auf
 * der Braille-Spur ist der Buchstabe an der Ziel-Position angekommen (Tasten). Die drei
 * Taktpfosten am Hang zeigen dieselben Zeitpunkte wie die Ticks.
 *
 * Aufbau wie {@link PackeisScene} (1280×720, Kamera zieht mit, Parallax, transform-only).
 */
import type { ReactNode } from "react";
import type { FloeSpot } from "@/lib/typing";
import { SHIFT_UNIT, unitGlyph } from "@/lib/typing";
import { VIEW_H, VIEW_W, type PackeisLayout, type Pt } from "./PackeisScene";

export const SLIDE_SHORE_X = 235;
/** Start oben am Hang. */
export const SLIDE_TOP_Y = 205;
/** Ziel unten (Iglu, Zuhause). */
export const SLIDE_GROUND_Y = 490;
/** Breiter Schritt je Hügel (Schwung-Optik; Wasser: 250). */
const STEP_X = 195;
/** So weit vor dem Pinguin steht das Tor, in dem der Buchstabe getroffen werden muss. */
const GOAL_AHEAD = 150;
/** Von so weit rechts fliegt die Eisplatte heran (Anflug-Strecke in Weltkoordinaten). */
const APPROACH_X = 620;

/**
 * ★ Kontrast-Farben von Tor und Taktpfosten (29.10.2026). Der Kern ist hell (≥ 3 : 1 gegen den
 * Nachthimmel `#3a4676`), der Rand dunkel (≥ 3 : 1 gegen den Schnee `#9fb4d6` bis `#e6eefb`).
 * Wächter: `tests/tastenflow-spiele-kontrast.test.ts` liest diese Zeilen.
 */
const TOR_RAND = "#14204a";
const TOR_RUHIG = "#cfe3fb";
const TOR_HEISS = "#ffd76a";
const POSTEN_OFFEN = "#d5e6ff";

/** Legt die Halte einer slide-Etappe in die Welt: oben starten, Hügel für Hügel hinab. */
export function slideLayout(spots: readonly FloeSpot[]): PackeisLayout {
  const slideCount = spots.filter((s) => s.kind === "station" && s.stage === "slide").length;
  const dy = slideCount > 0 ? (SLIDE_GROUND_Y - SLIDE_TOP_Y) / (slideCount + 1) : 0;
  const pts: Pt[] = [];
  let x = SLIDE_SHORE_X;
  let y = SLIDE_TOP_Y;
  spots.forEach((s, i) => {
    if (i === 0) {
      x = SLIDE_SHORE_X;
      y = SLIDE_TOP_Y;
    } else if (s.kind === "station") {
      x += STEP_X;
      y += dy;
    } else {
      x += STEP_X;
      y = SLIDE_GROUND_Y;
    }
    pts.push({ x, y });
  });
  const last = pts.length > 0 ? pts[pts.length - 1].x : SLIDE_SHORE_X;
  return { pts, worldW: Math.max(VIEW_W, last + STEP_X + 120) };
}

const GLYPH = (unit: string, uppercase: boolean): string =>
  unit === SHIFT_UNIT ? "⇧" : unitGlyph(unit, uppercase);

/**
 * Die heranfliegende Eisplatte mit dem Buchstaben — eine geschliffene Eisscherbe (Sechseck),
 * kein schwebender Kreis (Johannes 14.07.: „Viele der Grafiken sind einfach nur Kreise"). Im
 * Trefferfenster (`hot`) leuchtet sie auf und bekommt einen kräftigen Rand: JETZT drücken.
 */
function IceTile({ glyph, hot }: { glyph: string; hot: boolean }) {
  return (
    <g className={`px-slideTile${hot ? " px-slideTile--hot" : ""}`}>
      <path
        d="M-34,-58 L34,-58 L58,0 L34,58 L-34,58 L-58,0 Z"
        fill={hot ? "#dff3ff" : "#a9cdea"}
        stroke={hot ? "#ffd76a" : "#e6f2ff"}
        strokeWidth={hot ? 7 : 3}
      />
      <path d="M-34,-58 L34,-58 L18,-30 L-18,-30 Z" fill="#ffffff" opacity=".45" />
      <text
        x="0"
        y="19"
        fontSize="58"
        fontWeight="800"
        textAnchor="middle"
        fill={hot ? "#0f3350" : "#1d4a70"}
        fontFamily="system-ui, sans-serif"
        className="font-legible"
      >
        {glyph}
      </text>
    </g>
  );
}

export interface SlideSceneProps {
  camX?: number;
  worldW?: number;
  penguin?: ReactNode;
  spots?: readonly FloeSpot[];
  pts?: readonly Pt[];
  pos?: number;
  uppercase?: boolean;
  /** Der eine heranfliegende Buchstabe (null = gerade keiner unterwegs). */
  slideLetter?: string | null;
  /** Anflug: 0 = eben losgeflogen, 1 = an der Ziellinie. */
  slideProgress?: number;
  /** Trefferfenster offen — jetzt drücken. */
  slideHot?: boolean;
  /** Polarlicht-Finale (nur fehlerfreier Lauf). */
  aurora?: boolean;
}

export function SlideScene({
  camX = 0,
  worldW = VIEW_W,
  penguin,
  spots,
  pts,
  pos = 0,
  uppercase = false,
  slideLetter = null,
  slideProgress = 0,
  slideHot = false,
  aurora = false,
}: SlideSceneProps) {
  const far = `translate(${-camX * 0.3} 0)`;
  const play = `translate(${-camX} 0)`;

  // Schnee-Hang aus den Hügel-Punkten (oben links → hinab → Boden rechts → zurück).
  // Die Schneeoberfläche verläuft GENAU durch die Standpunkte (früher 12 px darunter — dadurch
  // schwebte der Pinguin sichtbar über dem Hang; Johannes 14.07.). Der Hang beginnt schon
  // deutlich links vom Startpunkt, damit unter dem Pinguin nie ein Loch klafft.
  let hang = "";
  if (pts && pts.length > 0) {
    const parts = [`M${pts[0].x - 260},${VIEW_H}`, `L${pts[0].x - 260},${pts[0].y + 6}`];
    pts.forEach((p) => parts.push(`L${p.x},${p.y}`));
    const lastP = pts[pts.length - 1];
    parts.push(`L${lastP.x + 200},${SLIDE_GROUND_Y}`, `L${lastP.x + 200},${VIEW_H}`, "Z");
    hang = parts.join(" ");
  }

  // Sterne (fixe Streuung über die Weltbreite; ruhig, kein Flackern).
  const stars: ReactNode[] = [];
  for (let sx = 60; sx < worldW; sx += 137) {
    const sy = 60 + ((sx * 53) % 240);
    stars.push(<circle key={sx} cx={sx} cy={sy} r={sx % 3 === 0 ? 2.4 : 1.6} fill="#eaf2ff" opacity={sx % 2 === 0 ? 0.9 : 0.6} />);
  }

  // Der Pinguin steht auf `pts[pos]`; das Tor schwebt ein Stück vor ihm auf dem Hang, die
  // Eisplatte kommt von rechts darauf zu. Beides in Weltkoordinaten, damit die Kamera passt.
  // Das Tor steht MIT DEN FÜSSEN AUF DEM HANG (`goalY` = Bodenlinie am Pinguin), die Eisplatte
  // fliegt auf Kopfhöhe heran. Johannes 14.07.: „Oft schwebt der Pinguin und andere Dinge in der
  // Luft" — vorher hingen Tor, Taktpfosten und Platte frei über dem Schnee.
  const here = pts?.[pos];
  const goalX = (here?.x ?? SLIDE_SHORE_X) + GOAL_AHEAD;
  const goalY = (here?.y ?? SLIDE_TOP_Y) + 10; // knapp unter dem Bauch = Schneeoberfläche
  const tileX = goalX + Math.max(0, 1 - slideProgress) * APPROACH_X;
  const tileY = goalY - 78; // Kopfhöhe: die Platte kommt dem Pinguin entgegen, nicht über ihm

  return (
    <svg className="px-world px-scene" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="slSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141c3e" />
          <stop offset=".6" stopColor="#26305c" />
          <stop offset="1" stopColor="#3a4676" />
        </linearGradient>
        <linearGradient id="slSnow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6eefb" />
          <stop offset="1" stopColor="#9fb4d6" />
        </linearGradient>
        <radialGradient id="slMoon" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fdfbef" />
          <stop offset=".7" stopColor="#eef1e0" />
          <stop offset="1" stopColor="#eef1e0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#slSky)" />

      {aurora && (
        <g className="px-aurora" strokeWidth="14" fill="none" opacity=".85">
          <path d="M-40,150 Q300,105 640,150 T1320,150" stroke="#7de3a8" />
          <path d="M-40,185 Q320,150 640,185 T1320,185" stroke="#7cc4ff" />
          <path d="M-40,120 Q280,92 640,120 T1320,120" stroke="#c493ff" />
        </g>
      )}

      {/* Ferne: Mond + Sterne (langsames Parallax) */}
      <g transform={far}>
        <circle cx="240" cy="150" r="120" fill="url(#slMoon)" />
        <circle cx="240" cy="150" r="60" fill="#fdfbef" />
        <circle cx="266" cy="138" r="52" fill="#26305c" opacity=".25" />
        {stars}
      </g>

      {/* Spielebene: Hang, Tor, heranfliegende Eisplatte, Iglu, Pinguin */}
      <g transform={play}>
        {hang && <path d={hang} fill="url(#slSnow)" stroke="#c3d4ee" strokeWidth="3" />}

        {/* Rutschspur hinter dem Pinguin (er ist ja auf dem Bauch unterwegs) — sie beginnt nie
            vor dem Hang, sonst hinge sie in der Luft. */}
        {here && pts && (
          <path
            d={`M${Math.max(pts[0].x - 200, here.x - 420)},${here.y + 18} L${here.x + 10},${here.y + 14}`}
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            opacity=".35"
            fill="none"
          />
        )}

        {/* Das Tor: hier muss der Buchstabe getroffen werden. Leuchtet im Trefferfenster. */}
        {slideLetter && here && (
          <g transform={`translate(${goalX} ${goalY})`} className={slideHot ? "px-slideGate px-slideGate--hot" : "px-slideGate"}>
            {/* Zwei Torstangen, die IM SCHNEE stecken (Fuß auf y=0), mit Querlatte.
                ★ Kontrast (29.10.2026, Lehrerin Zürich: „Kontraste bei den Spielen"): Die Stangen
                stehen mal vor dunklem Himmel, mal vor hellem Schnee - EINE Farbe schafft nicht
                beides. Darum liegt unter jeder Stange ein dunkler Rand (≥ 3 : 1 gegen den Schnee)
                und die Stange selbst ist hell (≥ 3 : 1 gegen den Himmel). */}
            <ellipse cx="-46" cy="0" rx="14" ry="5" fill="#dfeaf7" opacity=".55" />
            <ellipse cx="46" cy="0" rx="14" ry="5" fill="#dfeaf7" opacity=".55" />
            <path d="M-46,0 L-46,-140 L46,-140 L46,0" stroke={TOR_RAND} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M-46,0 L-46,-140 M46,0 L46,-140" stroke={slideHot ? TOR_HEISS : TOR_RUHIG} strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M-46,-140 L46,-140" stroke={slideHot ? TOR_HEISS : TOR_RUHIG} strokeWidth="9" strokeLinecap="round" fill="none" />
            {/* Wimpel an der Querlatte — zeigen, wo „jetzt" ist */}
            <path d="M46,-140 L86,-126 L46,-112 Z" fill={slideHot ? TOR_HEISS : TOR_RUHIG} stroke={TOR_RAND} strokeWidth="3" strokeLinejoin="round" />
            <path d="M-46,-140 L-86,-126 L-46,-112 Z" fill={slideHot ? TOR_HEISS : TOR_RUHIG} stroke={TOR_RAND} strokeWidth="3" strokeLinejoin="round" />
          </g>
        )}

        {/* Taktpfosten: dieselben Zeitpunkte wie die drei Auftakt-Ticks (visuelles Metronom) */}
        {slideLetter &&
          here &&
          [0.3, 0.52, 0.72].map((t) => {
            const px = goalX + (1 - t) * APPROACH_X;
            const passed = slideProgress >= t;
            return (
              <g key={t}>
                {/* Markierungsstock, der im Schnee steckt (Fuß auf der Bodenlinie).
                    ★ Kontrast: vorher ein blasses Blaugrau mit Deckkraft .55 (≈ 1,7 : 1). Jetzt ein
                    heller Kern mit dunklem Rand; „schon vorbei" unterscheidet sich durch
                    Farbe (Gold) UND Form (Knauf oben), nicht durch Blässe. */}
                <ellipse cx={px} cy={goalY} rx="9" ry="4" fill="#dfeaf7" opacity=".45" />
                <path d={`M${px},${goalY} L${px},${goalY - 46}`} stroke={TOR_RAND} strokeWidth="11" strokeLinecap="round" />
                <path d={`M${px},${goalY} L${px},${goalY - 46}`} stroke={passed ? TOR_HEISS : POSTEN_OFFEN} strokeWidth="6" strokeLinecap="round" />
                {passed && <circle cx={px} cy={goalY - 50} r="8" fill={TOR_HEISS} stroke={TOR_RAND} strokeWidth="3" />}
              </g>
            );
          })}

        {/* Der EINE heranfliegende Buchstabe */}
        {slideLetter && (
          <g transform={`translate(${tileX} ${tileY})`}>
            <IceTile glyph={GLYPH(slideLetter, uppercase)} hot={slideHot} />
          </g>
        )}

        {/* Iglu am Ziel (Zuhause) */}
        {pts && spots && spots.length > 0 && spots[spots.length - 1].kind !== "station" && (
          <g transform={`translate(${pts[pts.length - 1].x} ${SLIDE_GROUND_Y})`}>
            <path d="M-70,22 Q-70,-52 0,-52 Q70,-52 70,22 Z" fill="#e9f1fc" stroke="#b9d0ea" strokeWidth="3" />
            <path d="M-70,22 Q-70,-52 0,-52 Q70,-52 70,22" fill="none" stroke="#cfe0f2" strokeWidth="2" />
            <path d="M-24,22 L-24,-14 Q0,-30 24,-14 L24,22 Z" fill="#2b3a63" />
            <circle cx="0" cy="-58" r="7" fill="#ffe08a" />
          </g>
        )}

        {penguin}
      </g>
    </svg>
  );
}
