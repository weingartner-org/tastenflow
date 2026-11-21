/**
 * Finale der Reise (Bauplan §4.6, E7) — „Zuhause am Iglu, tief in der Nacht". Der Orchestrator
 * zeigt dieses Bild NACH der letzten Zone (Bauchrutsche). Nur bei einem KOMPLETT fehlerfreien
 * Lauf über die GESAMTE Reise (`aurora`) tanzen die Polarlicht-Bänder am Himmel und der
 * Polarlicht-Klang erklingt — so bleibt das Polarlicht selten und besonders. Sonst dasselbe
 * warme Nachtbild ohne Bänder (ein schöner Heimkehr-Moment für alle).
 *
 * Rein visuell (aria-hidden); die Ansage macht der Orchestrator über die Live-Region/App-Stimme.
 * Aufbau wie die übrigen Szenen (1280×720, transform-only, feste Nacht-Palette).
 */
import type { ReactNode } from "react";
import { VIEW_H, VIEW_W } from "./PackeisScene";

export interface AuroraFinaleProps {
  /** Das Pinguin-Rig (jubelnd), in Weltkoordinaten platziert. */
  penguin?: ReactNode;
  /** Fehlerfreier Gesamtlauf → Polarlicht-Bänder tanzen (Bauplan §4.6). */
  aurora?: boolean;
}

/** Ein paar ruhige Sterne (feste Positionen, damit nichts springt). */
const STARS: { x: number; y: number; r: number }[] = [
  { x: 120, y: 90, r: 2.2 }, { x: 240, y: 160, r: 1.6 }, { x: 360, y: 70, r: 2 },
  { x: 520, y: 130, r: 1.5 }, { x: 680, y: 60, r: 2.4 }, { x: 820, y: 150, r: 1.7 },
  { x: 960, y: 90, r: 2 }, { x: 1080, y: 150, r: 1.5 }, { x: 1180, y: 80, r: 2.2 },
  { x: 60, y: 200, r: 1.4 }, { x: 440, y: 210, r: 1.5 }, { x: 900, y: 220, r: 1.5 },
];

export function AuroraFinale({ penguin, aurora = false }: AuroraFinaleProps) {
  return (
    <svg
      className="px-world px-scene"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="finSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1430" />
          <stop offset=".55" stopColor="#122a52" />
          <stop offset="1" stopColor="#20406e" />
        </linearGradient>
        <linearGradient id="finSnow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe0f2" />
          <stop offset="1" stopColor="#7f9bc0" />
        </linearGradient>
        <radialGradient id="finGlow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffe6a8" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffe6a8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#finSky)" />

      {/* Sterne */}
      <g fill="#eaf3fa">
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={0.55 + (i % 3) * 0.15} />
        ))}
      </g>

      {/* Polarlicht-Bänder — nur bei fehlerfreiem Gesamtlauf (Bauplan §4.6) */}
      {aurora && (
        <g className="px-aurora" strokeWidth="16" fill="none" opacity=".85">
          <path d="M-40,210 Q300,150 640,205 T1320,200" stroke="#7de3a8" />
          <path d="M-40,250 Q320,195 640,250 T1320,245" stroke="#7cc4ff" />
          <path d="M-40,170 Q280,120 640,165 T1320,160" stroke="#c493ff" />
        </g>
      )}

      {/* Ferne Bergkette (spitze Gipfel statt Ellipsen — die lasen sich als Blasen) */}
      <path
        d="M-40,600 L140,430 L280,540 L430,400 L560,560 L640,600 Z"
        fill="#26466f"
        opacity=".85"
      />
      <path
        d="M600,600 L760,450 L900,545 L1060,415 L1200,540 L1320,600 Z"
        fill="#1e3a60"
        opacity=".85"
      />

      {/* Schnee-Boden */}
      <rect x="0" y="560" width={VIEW_W} height={VIEW_H - 560} fill="url(#finSnow)" />
      <path d={`M-40,568 Q${VIEW_W / 2},540 ${VIEW_W + 40},568`} fill="none" stroke="#e6f0fb" strokeWidth="4" />
      {/* Weiche Schneeverwehungen (liegen auf dem Boden, schweben nicht) */}
      <path d="M-20,700 Q160,660 340,700 Z" fill="#e8f1fb" opacity=".55" />
      <path d="M840,690 Q1030,650 1250,690 Z" fill="#e8f1fb" opacity=".5" />

      {/*
        DAS IGLU (neu gezeichnet, 14.07.). Vorher: eine große Ellipse mit einem Halbkreis
        obendrauf — Johannes: „beim Polarlicht-Endbildschirm verstehe ich die Ellipse mit dem
        Halbkreis am Ende nicht, was soll das darstellen?" Zu Recht: die Ellipse lag zur Hälfte
        unter dem Boden und las sich als Kugel. Jetzt eine echte Schneekuppel auf der Bodenlinie,
        mit gemauerten Schneeziegeln (versetzte Fugen wie echtes Mauerwerk), einem Eingangstunnel
        davor, warmem Licht darin — und Fußspuren, die zur Tür führen: Zuhause.
      */}
      <g transform="translate(1000 660)">
        {/* Schneekuppel */}
        <path d="M-186,0 A186,186 0 0 1 186,0 Z" fill="#f2f8ff" stroke="#c2d6ea" strokeWidth="4" />
        {/* Ziegelreihen (Bögen) + versetzte Stoßfugen — macht es als Iglu lesbar */}
        <g fill="none" stroke="#d3e3f4" strokeWidth="2.5" opacity=".9">
          <path d="M-186,0 A186,186 0 0 1 186,0" />
          <path d="M-160,-62 A170,150 0 0 1 160,-62" />
          <path d="M-124,-116 A150,130 0 0 1 124,-116" />
          <path d="M-74,-158 A110,100 0 0 1 74,-158" />
          <path d="M-150,-30 L-146,-64 M-70,-46 L-72,-70 M10,-48 L12,-72 M92,-40 L96,-66 M158,-24 L152,-58" />
          <path d="M-120,-88 L-116,-120 M-40,-104 L-38,-134 M44,-104 L46,-134 M120,-86 L116,-118" />
          <path d="M-56,-140 L-52,-166 M40,-140 L44,-166" />
        </g>
        {/* Eingangstunnel davor (eigene kleine Kuppel) */}
        <path d="M-62,0 A62,58 0 0 1 62,0 Z" fill="#e9f2fd" stroke="#c2d6ea" strokeWidth="4" />
        {/* Türöffnung + warmes Licht von drinnen */}
        <path d="M-38,0 A38,42 0 0 1 38,0 Z" fill="#3a2b1e" />
        <path d="M-30,0 A30,33 0 0 1 30,0 Z" fill="#ffcf7a" opacity=".95" />
        <circle cx="0" cy="-6" r="72" fill="url(#finGlow)" />
        {/* Lichtschein, der auf den Schnee fällt */}
        <path d="M-34,0 L-74,26 L74,26 L34,0 Z" fill="#ffdf9e" opacity=".28" />
      </g>

      {/* Fußspuren des Pinguins: vom Hang herüber bis zur Iglu-Tür — die Reise endet hier */}
      <g fill="#c7d9ee" opacity=".75">
        {[
          { x: 660, y: 690 }, { x: 706, y: 672 }, { x: 752, y: 692 }, { x: 798, y: 674 },
          { x: 844, y: 692 }, { x: 890, y: 676 }, { x: 936, y: 690 },
        ].map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${i % 2 === 0 ? -6 : 6})`}>
            <ellipse cx="0" cy="0" rx="9" ry="6" />
            <path d="M-8,-4 L-12,-9 M0,-6 L0,-12 M8,-4 L12,-9" stroke="#c7d9ee" strokeWidth="2.5" fill="none" />
          </g>
        ))}
      </g>

      {/* Der jubelnde Pinguin vor dem Iglu */}
      {penguin}
    </svg>
  );
}
