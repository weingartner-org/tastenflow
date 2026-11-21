/**
 * Zone 5 — „Die Polarstation" (Abend, warm). WORT RATEN im SCRABBLE-STIL — „Funkspruch
 * entschlüsseln" (Bauplan §4.5, Johannes 13.07.): Die Buchstaben des Wortes liegen von
 * Anfang an DURCHEINANDER sichtbar da (Kacheln). Das Kind erkennt das Wort und tippt es in
 * der RICHTIGEN Reihenfolge in die Slots; jeder richtige Buchstabe füllt den nächsten Slot
 * (Funk-Pieps) und verbraucht seine Kachel, ein falscher wackelt nur (Signal runter, KEIN
 * Scheitern). Ist das Wort komplett, bleibt es kurz stehen, wird vorgelesen und gefunkt.
 * Kommt man nicht weiter, setzt die Hinweis-Taste (Tab) den nächsten Buchstaben.
 *
 * Bild (Johannes 14.07.): Wir sind JETZT IN DER STATION — im Funkraum, nicht mehr davor.
 * Holzwand mit Blechband, Kabel, eine Seekarte, Wandlampen im warmen Abendlicht, Fenster
 * mit Blick auf Dünen, Funkmast und Schneetreiben (eigene Parallax-Tiefe), ein langer
 * Funktisch mit den Funk-Pulten. Der Pinguin steht auf dem Raumboden (STATION_GROUND_Y)
 * vor dem großen Funkgerät: dessen Frontplatte trägt die Buchstaben-Kärtchen im Holz-Rack,
 * das Leucht-Display (Slots) und die Empfangsanzeige. Nichts schwebt.
 *
 * Rein visuell (aria-hidden); die Ansagen (durcheinander gewürfelte Buchstaben, Fortschritt,
 * gelöstes Wort) laufen über die Live-Region/App-Stimme des Hooks (§7) — so ist das Anagramm
 * auch per Ohr (Kinder mit Blindheit) lösbar.
 *
 * Aufbau wie die übrigen Szenen (1280×720, Kamera zieht mit, Parallax, transform-only).
 * Kachel-Rack, Display und Empfangsstärke liegen bildschirm-fest (Frontplatte des Geräts).
 */
import type { ReactNode } from "react";
import type { FloeSpot } from "@/lib/typing";
import { VIEW_H, VIEW_W, type PackeisLayout, type Pt } from "./PackeisScene";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { laufweiteZusatzIn, type ZeichenabstandFaktor } from "@/lib/typing/zeichenabstand";
import { layoutSprache } from "@/lib/typing/layouts";
import { grossFuer, kleinFuer } from "@/lib/typing/sprachRegister";

/**
 * Die Beschriftung über der Buchstaben-Ablage. ★ E11a-5 (26.09.2026): eine Tabelle je
 * Bedienungssprache statt der Weiche `sprache === "en" ? … : …`, die „fr" still deutsch
 * gelassen hätte (Leitfaden Falle 30).
 */
export const ABLAGE_TEXT: Record<BedienSprache, string> = {
  de: "📻 Diese Buchstaben sind durcheinander",
  en: "📻 These letters are jumbled up",
  fr: "📻 Ces lettres sont mélangées",
  es: "📻 Estas letras están revueltas",
  it: "📻 Queste lettere sono mescolate",
  // ★ O-PL (02.10.2026): polnisch.
  pl: "📻 Te litery są pomieszane",
  // ★ O-TR (02.10.2026): türkisch.
  tr: "📻 Bu harfler karışmış",
  // ★ O-CS (03.10.2026): tschechisch.
  cs: "📻 Tahle písmena jsou přeházená",
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "📻 Тези букви са разбъркани",
  el: "📻 Αυτά τα γράμματα είναι ανακατεμένα",
  hu: "📻 Ezek a betűk összekeveredtek",
  nl: "📻 Deze letters zijn door elkaar gehusseld",
  pt: "📻 Estas letras estão baralhadas",
  br: "📻 Estas letras estão embaralhadas",
  ro: "📻 Aceste litere sunt amestecate",
  sv: "📻 De här bokstäverna har hamnat huller om buller",
  uk: "📻 Ці літери переплутані",
};

export const STATION_SHORE_X = 235;
/** Ebener Station-Boden (der Pinguin geht von Funk-Pult zu Funk-Pult). */
export const STATION_GROUND_Y = 452;
/** Schritt je Wort-Station. */
const STEP_X = 210;

/** Oberkante des Funktischs an der Wand (der Pinguin steht davor). */
const DESK_TOP = STATION_GROUND_Y - 86;
/** Frontplatte des großen Funkgeräts (bildschirm-fest, hängt an der Wand). */
const PANEL = { x: 112, y: 28, w: VIEW_W - 224, h: 216 };
/** Sichtbares Wandband unter dem Gerät: hier hängen Fenster, Karte, Lampen. */
const WALL_BAND_Y = 252;

/** Legt die Halte einer station-Etappe flach nebeneinander in die Welt. */
export function stationLayout(spots: readonly FloeSpot[]): PackeisLayout {
  const pts: Pt[] = [];
  let x = STATION_SHORE_X;
  spots.forEach((_s, i) => {
    if (i === 0) x = STATION_SHORE_X;
    else x += STEP_X;
    pts.push({ x, y: STATION_GROUND_Y });
  });
  const last = pts.length > 0 ? pts[pts.length - 1].x : STATION_SHORE_X;
  return { pts, worldW: Math.max(VIEW_W, last + STEP_X + 160) };
}

/* ---------------------------------------------------------------------------
 * Der Funkraum (Weltebene)
 * ------------------------------------------------------------------------- */

/** Ein Fenster: Rahmen, Sprossen, Raureif — dahinter Dämmerung, Dünen, Schneetreiben. */
function Window({ x, camX }: { x: number; camX: number }) {
  const w = 190;
  const h = 110;
  // Gegen-Parallax: der Ausblick wandert langsamer als der Rahmen (Tiefe).
  const outside = `translate(${(camX * 0.75) % 240} 0)`;
  return (
    <g transform={`translate(${x} ${WALL_BAND_Y})`}>
      <rect x="-11" y="-11" width={w + 22} height={h + 22} rx="6" fill="#6a4632" stroke="#42291b" strokeWidth="3" />
      <g clipPath="url(#stnWin)">
        <rect width={w} height={h} fill="url(#stnDusk)" />
        <g transform={outside}>
          {[-2, -1, 0, 1, 2].map((k) => (
            <g key={k} transform={`translate(${k * 240} 0)`}>
              <path d={`M0,${h} L0,74 Q60,56 120,68 Q180,78 240,60 L240,${h} Z`} fill="#c9a9b8" opacity=".75" />
              <path d={`M0,${h} L0,90 Q70,78 140,88 Q200,96 240,82 L240,${h} Z`} fill="#efd8cd" />
            </g>
          ))}
          {/* Der Funkmast der Station — jetzt draußen vor dem Fenster */}
          <path d="M78,84 L84,28 M84,28 L66,44 M84,28 L102,44 M64,86 L104,86" stroke="#7a5a58" strokeWidth="3" fill="none" />
          <path d="M84,22 l5,5 l-5,5 l-5,-5 Z" fill="#ff8a6b" className="px-station-lamp" />
        </g>
        {/* Schneetreiben draußen (Schlieren, keine Punkte) */}
        <g className="px-storm-snow">
          {Array.from({ length: 16 }, (_, i) => {
            const sx = -100 + i * 48 + ((i * 37) % 30);
            const sy = 6 + ((i * 53) % (h - 12));
            return (
              <path
                key={i}
                d={`M${sx},${sy} q-13,2 -28,7`}
                stroke="#fff3ea"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
                opacity={i % 2 ? 0.55 : 0.3}
              />
            );
          })}
        </g>
      </g>
      {/* Sprossen + Raureif in den Ecken */}
      <path d={`M${w / 2},0 L${w / 2},${h} M0,${h / 2} L${w},${h / 2}`} stroke="#6a4632" strokeWidth="6" />
      <path d="M0,0 q32,6 40,32 q-22,-15 -40,-11 Z" fill="#ffffff" opacity=".45" />
      <path d={`M${w},${h} q-32,-6 -40,-32 q22,15 40,11 Z`} fill="#ffffff" opacity=".35" />
      {/* Fensterbank (liegt auf dem Wandbrett auf) */}
      <rect x="-18" y={h + 11} width={w + 36} height="12" rx="3" fill="#8a5f42" stroke="#42291b" strokeWidth="2" />
    </g>
  );
}

/** Die Seekarte an der Wand: Küstenlinie, gestrichelte Route, Nadeln. */
function WallMap({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} ${WALL_BAND_Y - 4})`}>
      <rect x="-6" y="-6" width="172" height="124" rx="4" fill="#7d5236" stroke="#42291b" strokeWidth="3" />
      <rect width="160" height="112" fill="#f0e0bf" />
      <path d="M6,80 Q36,58 56,68 Q80,80 100,58 Q126,32 154,40" fill="none" stroke="#5f8fa6" strokeWidth="3" />
      <path d="M0,112 L0,90 Q42,80 70,92 Q108,106 160,90 L160,112 Z" fill="#cfe0e6" opacity=".8" />
      <path d="M18,92 L58,56 L96,72 L140,38" fill="none" stroke="#c0523f" strokeWidth="2.5" strokeDasharray="7 6" />
      <path d="M140,38 l5,10 l-10,0 Z" fill="#c0523f" />
      <path d="M18,92 l5,10 l-10,0 Z" fill="#c0523f" />
      <path d="M136,16 l6,-12 l6,12 l-6,5 Z" fill="#3c6079" />
    </g>
  );
}

/** Wandlampe mit warmem Lichtkegel auf den Funktisch. */
function WallLamp({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} ${WALL_BAND_Y + 4})`}>
      <path d={`M-46,${DESK_TOP - WALL_BAND_Y - 4} L-18,24 L18,24 L46,${DESK_TOP - WALL_BAND_Y - 4} Z`} fill="url(#stnBeam)" />
      <path d="M0,-16 L0,0" stroke="#2f2118" strokeWidth="4" />
      <path d="M-24,24 L24,24 L13,0 L-13,0 Z" fill="#c87a3c" stroke="#7a4522" strokeWidth="2.5" />
      <path d="M-20,24 L20,24 L17,19 L-17,19 Z" fill="#ffe6b8" />
    </g>
  );
}

/** Das Kabel, das hinter den Funk-Pulten über den Tisch läuft (Bögen zwischen Haltern). */
function deskCable(worldW: number): ReactNode {
  const y = DESK_TOP - 8;
  const parts: string[] = [`M-200,${y}`];
  for (let x = -200; x < worldW + 240; x += 210) parts.push(`q52,22 105,0 t105,0`);
  return (
    <g>
      <path d={parts.join(" ")} fill="none" stroke="#2f2118" strokeWidth="5" strokeLinecap="round" opacity=".85" />
      {Array.from({ length: Math.ceil((worldW + 440) / 210) }, (_, i) => (
        <path key={i} d={`M${-205 + i * 210},${y - 6} l10,0 l0,12 l-10,0 Z`} fill="#5a4433" />
      ))}
    </g>
  );
}

/** Der lange Funktisch an der Wand (Platte, Zarge, Beine) — der Pinguin steht davor. */
function desk(worldW: number): ReactNode {
  const legs: ReactNode[] = [];
  for (let x = -120; x < worldW + 200; x += 232) {
    legs.push(<path key={`lg${x}`} d={`M${x},${DESK_TOP + 18} l16,0 l5,${STATION_GROUND_Y - DESK_TOP - 18} l-16,0 Z`} fill="#5f4029" />);
  }
  return (
    <g>
      {/* Schatten unter der Tischplatte — trennt Tisch und Boden klar */}
      <rect x="-240" y={DESK_TOP + 20} width={worldW + 480} height={STATION_GROUND_Y - DESK_TOP - 20} fill="#2f1d10" opacity=".35" />
      {legs}
      <rect x="-240" y={DESK_TOP} width={worldW + 480} height="16" fill="#a9764c" />
      <rect x="-240" y={DESK_TOP + 16} width={worldW + 480} height="10" fill="#7c5334" />
      <path d={`M-240,${DESK_TOP + 3} L${worldW + 240},${DESK_TOP + 3}`} stroke="#c99a6c" strokeWidth="3" opacity=".7" />
    </g>
  );
}

/** Ein Funk-Pult (Halt) auf dem Tisch: Gehäuse, Skala mit Zeiger, Knöpfe, Morsetaste. */
function Console({ dim }: { dim: boolean }) {
  return (
    <g style={{ opacity: dim ? 0.55 : 1, transition: "opacity .4s" }}>
      <path d="M-46,0 L46,0 L42,-64 L-42,-64 Z" fill="#4c5a68" stroke="#2f3a45" strokeWidth="2.5" />
      <path d="M-42,-64 L42,-64 L38,-72 L-38,-72 Z" fill="#5d6c7b" stroke="#2f3a45" strokeWidth="2" />
      <rect x="-30" y="-58" width="60" height="26" rx="4" fill="#ffd9a0" stroke="#2f3a45" strokeWidth="2" />
      <path d="M-24,-38 L-24,-46 M-12,-38 L-12,-50 M0,-38 L0,-52 M12,-38 L12,-50 M24,-38 L24,-46" stroke="#8a6a3a" strokeWidth="1.6" />
      <path d="M0,-34 L9,-54" stroke="#c0523f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M-30,-24 l12,0 l0,10 l-12,0 Z" fill="#8f9aa6" />
      <path d="M-12,-24 l12,0 l0,10 l-12,0 Z" fill="#8f9aa6" />
      <path d="M14,-26 q10,-5 17,4 q-9,9 -17,0 Z" fill="#d98a5a" />
      <path d="M-16,-4 l34,0 l0,-4 l-34,0 Z" fill="#3a4550" />
    </g>
  );
}

/* ---------------------------------------------------------------------------
 * Frontplatte des Funkgeräts (bildschirm-fest): Kachel-Rack, Display, Anzeige
 * ------------------------------------------------------------------------- */

/**
 * Der Kachel-Vorrat: die Buchstaben des Wortes DURCHEINANDER (Scrabble-Stil) — sie stehen als
 * Buchstaben-Kärtchen in einer Holz-Ablage am Funkgerät. Kacheln, deren Buchstabe schon in die
 * Slots getippt wurde, sind verbraucht (gedimmt) — man sieht, was noch übrig ist.
 */
function TilePool({
  tiles,
  used,
  uppercase = false,
  zeichenabstand = 1,
}: {
  tiles: string[];
  used: boolean[];
  uppercase?: boolean;
  zeichenabstand?: ZeichenabstandFaktor;
}) {
  // ★ EN3 (19.09.2026): die Beschriftung der Ablage in der Bedienungssprache.
  const { sprache } = useBedienSprache();
  const n = tiles.length;
  if (n <= 0) return null;
  // ★ CVI (19.09.2026, „überall"): die Kärtchen rücken um dieselbe
  // Zusatzstrecke auseinander wie die Übungszeile (Schrift bis 34). „aus": 0.
  const gap = (n > 8 ? 10 : 14) + laufweiteZusatzIn(zeichenabstand, 34);
  const tw = Math.min(52, Math.floor((760 - (n - 1) * gap) / Math.max(1, n)));
  const total = n * tw + (n - 1) * gap;
  return (
    <g className="px-station-tiles" transform={`translate(${VIEW_W / 2 - total / 2} 70)`}>
      <text x={total / 2} y="-16" fontSize="16" fontWeight="700" textAnchor="middle" fill="#ffe8c8" fontFamily="system-ui, sans-serif">
        {ABLAGE_TEXT[sprache]}
      </text>
      {/* Holz-Ablage: Rückwand … */}
      <path d={`M-18,-4 L${total + 18},-4 L${total + 18},${tw + 14} L-18,${tw + 14} Z`} fill="#7a5232" stroke="#4d3220" strokeWidth="2.5" />
      {tiles.map((ch, i) => (
        <g key={i} transform={`translate(${i * (tw + gap)} 2)`} opacity={used[i] ? 0.72 : 1}>
          <path d={`M3,4 L${tw + 3},4 L${tw + 3},${tw + 4} L3,${tw + 4} Z`} fill="#33220f" opacity=".45" />
          {/* ★ Kontrast (29.10.2026): ein benutztes Kärtchen war mit Deckkraft .32 kaum zu lesen
              (2,0 : 1). Jetzt .72 (≥ 4,5 : 1) - „benutzt" zeigt der gestrichelte Rand. */}
          <rect width={tw} height={tw} rx="6" fill="#f6e4c3" stroke="#caa063" strokeWidth="2.5" strokeDasharray={used[i] ? "6 4" : undefined} />
          <path d={`M5,5 L${tw - 5},5`} stroke="#fffaf0" strokeWidth="3" strokeLinecap="round" opacity=".9" />
          <text
            x={tw / 2}
            y={tw / 2 + 12}
            fontSize={Math.min(34, tw - 12)}
            fontWeight="700"
            textAnchor="middle"
            fill="#5a3d14"
            fontFamily="system-ui, sans-serif"
            className="font-legible"
          >
            {/*
             * PUNKT 2 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Hier werden
             * Großbuchstaben angezeigt, es ist aber egal, was man drückt." Die Kärtchen
             * standen HIER fest auf Grossbuchstaben, unabhängig von `uppercase` — anders
             * als jede andere Szene (Packeis/Rutsche/Steilwand/Sturm folgen alle demselben
             * Schalter über `unitGlyph`). Getippt wird ohnehin klein (`handleStationKey`
             * vergleicht kleingeschrieben, keine Umschalttaste nötig) — die Anzeige zeigt
             * jetzt dasselbe Zeichen, das auch gedrückt wird.
             */}
            {uppercase ? grossFuer(ch, layoutSprache()) : ch /* G2b-1: türkisch i ⇒ İ */}
          </text>
        </g>
      ))}
      {/* … und vordere Leiste, an der die Kärtchen lehnen. */}
      <path d={`M-18,${tw + 4} L${total + 18},${tw + 4} L${total + 18},${tw + 16} L-18,${tw + 16} Z`} fill="#96693f" stroke="#4d3220" strokeWidth="2.5" />
    </g>
  );
}

/**
 * Die Eingabe-Slots: das Leucht-Display des Funkgeräts — ein Feld je Buchstabe, die ersten
 * `seqPos` mit dem richtig getippten Buchstaben. Das nächste Feld ist hervorgehoben. Ist das
 * Wort gelöst, leuchten alle grün.
 */
function SlotRow({
  letters,
  typed,
  seqPos,
  solved,
  uppercase = false,
  zeichenabstand = 1,
}: {
  letters: string[];
  /**
   * PUNKT 5 (20.09.2026): die TATSÄCHLICH getippten Buchstaben — seit auch andere echte
   * Wörter aus denselben Buchstaben zählen (`stationSolutions` im Hook), kann das vom
   * „gedachten" Wort (`letters`) abweichen. Fehlt sie (Vorschau ohne laufendes Spiel),
   * fällt jede Zelle auf `letters[i]` zurück.
   */
  typed?: string;
  seqPos: number;
  solved: boolean;
  uppercase?: boolean;
  zeichenabstand?: ZeichenabstandFaktor;
}) {
  const n = letters.length;
  if (n <= 0) return null;
  // ★ CVI: wie bei den Kärtchen (Schrift bis 38). „aus": 0.
  const gap = (n > 8 ? 10 : 14) + laufweiteZusatzIn(zeichenabstand, 38);
  const bw = Math.min(50, Math.floor((740 - (n - 1) * gap) / Math.max(1, n)));
  const bh = 62;
  const total = n * bw + (n - 1) * gap;
  return (
    <g className="px-station-slots" transform={`translate(${VIEW_W / 2 - total / 2} 158)`}>
      {/* Display-Fenster, in die Frontplatte eingelassen */}
      <rect x="-18" y="-12" width={total + 36} height={bh + 24} rx="8" fill="#14282a" stroke="#0c1618" strokeWidth="3" />
      <rect x="-13" y="-8" width={total + 26} height="4" rx="2" fill="#4c6a6f" opacity=".6" />
      {letters.map((ch, i) => {
        const filled = i < seqPos;
        const next = i === seqPos && !solved;
        return (
          <g key={i} transform={`translate(${i * (bw + gap)} 0)`}>
            <rect
              width={bw}
              height={bh}
              rx="8"
              fill={filled ? "#e7f6ec" : "#12494a"}
              stroke={solved ? "#3fae74" : next ? "#ffb454" : filled ? "#6fc499" : "#7fd0c8"}
              strokeWidth={next || solved ? 5 : 3}
            />
            {filled ? (
              <text
                x={bw / 2}
                y={bh / 2 + 13}
                fontSize={Math.min(38, bw - 8)}
                fontWeight="700"
                textAnchor="middle"
                fill="#1f6b45"
                fontFamily="system-ui, sans-serif"
                className="font-legible"
              >
                {/* PUNKT 5: das TATSÄCHLICH getippte Zeichen an dieser Stelle (`typed`),
                    nicht der Buchstabe des „gedachten" Wortes — die können seit den
                    mehreren gültigen Lösungen auseinanderlaufen. */}
                {(() => {
                  const echt = typed?.[i] ?? ch;
                  return uppercase ? grossFuer(echt, layoutSprache()) : echt;
                })()}
              </text>
            ) : (
              <rect x={bw * 0.2} y={bh - 16} width={bw * 0.6} height="5" rx="2.5" fill="#7fe0a6" />
            )}
          </g>
        );
      })}
    </g>
  );
}

/**
 * Empfangsstärke (Bauplan §4.5, „möglichst wenig Fehlgriffe"): drei Balken, so viele leuchten,
 * wie das Signal stark ist (3 = fehlerfrei gelöst … 1 = viele Fehlgriffe). Nur eigener Maßstab
 * pro Wort — kein Punktestand, kein Vergleich (§9). Sitzt links auf der Frontplatte.
 */
function SignalMeter({ signal }: { signal: number }) {
  const bars = [0, 1, 2];
  const bw = 16;
  const gap = 7;
  return (
    <g transform={`translate(${PANEL.x + 62} 62)`}>
      <rect x="-24" y="-10" width="118" height="60" rx="6" fill="#33404b" stroke="#222d36" strokeWidth="2" />
      <text x="-10" y="30" fontSize="16" textAnchor="end" fill="#ffe8c8" fontWeight="700" fontFamily="system-ui, sans-serif">
        📶
      </text>
      {bars.map((i) => {
        const bh = 14 + i * 10;
        const lit = i < signal;
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={34 - bh}
            width={bw}
            height={bh}
            rx="3"
            fill={lit ? "#7fe0a6" : "rgba(255,255,255,.16)"}
            stroke={lit ? "#bff3d3" : "rgba(255,255,255,.24)"}
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  );
}

/** Die Frontplatte: Blech, Nieten, Griffe, Drehknopf, Betriebslampe, Antenne + Funkwellen. */
function PanelBody({ sentPulse }: { sentPulse: number }) {
  const { x, y, w, h } = PANEL;
  const rivets: ReactNode[] = [];
  for (let rx = x + 18; rx < x + w - 10; rx += 48) {
    rivets.push(<circle key={`r1${rx}`} cx={rx} cy={y + 12} r="3" fill="#8f9aa6" />);
    rivets.push(<circle key={`r2${rx}`} cx={rx} cy={y + h - 12} r="3" fill="#6d7783" />);
  }
  const dialX = x + w - 92;
  const dialY = y + 66;
  return (
    <g>
      {/* Wandhalterung — das Gerät hängt, es schwebt nicht */}
      <path d={`M${x + 80},${y + 4} L${x + 80},-6 M${x + w - 80},${y + 4} L${x + w - 80},-6`} stroke="#3a4550" strokeWidth="9" />
      <rect x={x} y={y} width={w} height={h} rx="14" fill="#44525f" stroke="#26313a" strokeWidth="4" />
      <rect x={x + 7} y={y + 7} width={w - 14} height={h - 14} rx="10" fill="none" stroke="#5f6f7d" strokeWidth="2" />
      {rivets}
      {/* Tragegriffe seitlich */}
      <path d={`M${x - 6},${y + h / 2 - 26} q-16,26 0,52`} fill="none" stroke="#2f3a45" strokeWidth="7" strokeLinecap="round" />
      <path d={`M${x + w + 6},${y + h / 2 - 26} q16,26 0,52`} fill="none" stroke="#2f3a45" strokeWidth="7" strokeLinecap="round" />
      {/* Abstimm-Knopf rechts oben (mit Zeiger) */}
      <circle cx={dialX} cy={dialY} r="30" fill="#33404b" stroke="#222d36" strokeWidth="3" />
      <circle cx={dialX} cy={dialY} r="20" fill="#8f9aa6" stroke="#5f6f7d" strokeWidth="2" />
      <path d={`M${dialX},${dialY} L${dialX + 10},${dialY - 17}`} stroke="#2f3a45" strokeWidth="4" strokeLinecap="round" />
      {/* Betriebslampe unten links */}
      <circle cx={x + 34} cy={y + h - 30} r="9" fill="#ff6b5a" className="px-station-lamp" />
      {/* Antennenstummel + Funkwellen (nur nach dem Senden — key startet die Animation neu) */}
      <path d={`M${x + w - 40},${y + 4} L${x + w - 40},${y - 26}`} stroke="#cbb28c" strokeWidth="5" strokeLinecap="round" />
      <g key={sentPulse} className={sentPulse > 0 ? "px-station-waves" : undefined} transform={`translate(${x + w - 40} ${y - 28})`} opacity="0">
        <path d="M12,-12 A17,17 0 0 1 12,12" fill="none" stroke="#ffe4a0" strokeWidth="4" strokeLinecap="round" />
        <path d="M24,-24 A34,34 0 0 1 24,24" fill="none" stroke="#ffe4a0" strokeWidth="4" strokeLinecap="round" />
        <path d="M36,-36 A52,52 0 0 1 36,36" fill="none" stroke="#ffe4a0" strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* Kabel vom Gerät hinunter zum Funktisch (verankert es im Raum) */}
      <path d={`M${x + 40},${y + h} q-14,64 22,104`} fill="none" stroke="#2f2118" strokeWidth="5" strokeLinecap="round" opacity=".85" />
      <path d={`M${x + w - 40},${y + h} q14,64 -22,104`} fill="none" stroke="#2f2118" strokeWidth="5" strokeLinecap="round" opacity=".85" />
    </g>
  );
}

export interface StationSceneProps {
  camX?: number;
  worldW?: number;
  penguin?: ReactNode;
  spots?: readonly FloeSpot[];
  pts?: readonly Pt[];
  pos?: number;
  /** Das aktuelle Wort (mit Groß-/Kleinschreibung wie angezeigt) — steckt hinter dem Anagramm. */
  word?: string | null;
  /**
   * PUNKT 5 (20.09.2026): die TATSÄCHLICH getippten Buchstaben — kann vom Präfix von
   * `word` abweichen, seit auch andere echte Wörter aus denselben Buchstaben zählen.
   * Fehlt sie (Vorschau ohne laufendes Spiel), fällt jede Slot-Zelle auf `word` zurück.
   */
  typed?: string;
  /** Die Buchstaben des Wortes DURCHEINANDER (Scrabble-Kacheln). Fehlt sie → in Wort-Ordnung. */
  scrambled?: readonly string[];
  /** Wie viele Buchstaben schon richtig in die Slots getippt sind. */
  seqPos?: number;
  /** Empfangsstärke 0–3 (3 = fehlerfrei gelöst … 1 = viele Fehlgriffe). */
  signal?: number;
  /** Wort gelöst → alle Slots grün (bleibt kurz stehen + wird vorgelesen). */
  solved?: boolean;
  /** Zählt hoch bei jedem gelösten Wort → Funkwellen-Animation. */
  sentPulse?: number;
  /** Zählt hoch bei jedem Fehlgriff → die Tafel wackelt kurz. */
  wobble?: number;
  uppercase?: boolean;
  /** „Zeichenabstand groß (CVI)" - Kärtchen und Anzeige rücken auseinander (19.09.2026). */
  zeichenabstand?: ZeichenabstandFaktor;
}

export function StationScene({
  camX = 0,
  worldW = VIEW_W,
  penguin,
  spots,
  pts,
  pos = 0,
  word = null,
  typed = "",
  scrambled,
  seqPos = 0,
  signal = 3,
  solved = false,
  sentPulse = 0,
  wobble = 0,
  uppercase = false,
  zeichenabstand = 1,
}: StationSceneProps) {
  const far = `translate(${-camX * 0.3} 0)`;
  const mid = `translate(${-camX * 0.6} 0)`;
  const play = `translate(${-camX} 0)`;
  const letters = word ? [...word] : [];
  // Kachel-Vorrat: die gemischten Buchstaben (Fallback: Wort-Ordnung, für die Vorschau).
  const tiles = scrambled && scrambled.length > 0 ? [...scrambled] : letters.map((c) => kleinFuer(c, layoutSprache()));
  // Verbrauchte Kacheln markieren: für jeden schon getippten Buchstaben eine passende Kachel.
  // PUNKT 5: das sind die TATSÄCHLICH getippten Buchstaben (`typed`) - nicht mehr zwingend
  // der Präfix von `word` (dem „gedachten" Wort), seit auch andere echte Wörter aus
  // denselben Buchstaben zählen. Ohne `typed` (Vorschau) bleibt der alte Fallback.
  const getipptBisher = typed ? [...typed] : letters.slice(0, seqPos);
  const need = new Map<string, number>();
  for (const c of getipptBisher) {
    const k = kleinFuer(c, layoutSprache());
    need.set(k, (need.get(k) ?? 0) + 1);
  }
  const used = tiles.map((t) => {
    const k = kleinFuer(t, layoutSprache());
    const left = need.get(k) ?? 0;
    if (left > 0) {
      need.set(k, left - 1);
      return true;
    }
    return false;
  });

  // Wandbrett-Fugen, Fenster und Lampen über die Weltbreite verteilen.
  const seams: number[] = [];
  for (let y = 70; y < WALL_BAND_Y - 20; y += 42) seams.push(y);
  const windows: number[] = [];
  for (let x = 300; x < worldW + 140; x += 520) windows.push(x);
  // Wandlampen: nur dort, wo kein Fenster hängt (sonst stünde die Lampe „im" Fenster).
  const lamps: number[] = [];
  for (let x = 150; x < worldW + 200; x += 240) {
    if (windows.some((wx) => x > wx - 60 && x < wx + 250)) continue;
    lamps.push(x);
  }

  return (
    <svg className="px-world px-scene" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
      <defs>
        <clipPath id="stnWin">
          <rect width="190" height="110" rx="3" />
        </clipPath>
        <linearGradient id="stnDusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#43365e" />
          <stop offset=".5" stopColor="#a2637a" />
          <stop offset="1" stopColor="#e9a877" />
        </linearGradient>
        <linearGradient id="stnWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#452b1e" />
          <stop offset=".6" stopColor="#7a5033" />
          <stop offset="1" stopColor="#5d3a26" />
        </linearGradient>
        <linearGradient id="stnFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5f3d" />
          <stop offset="1" stopColor="#4a3020" />
        </linearGradient>
        <linearGradient id="stnBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffdca6" stopOpacity=".5" />
          <stop offset="1" stopColor="#ffdca6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Der Raum: Wand + Dielenboden füllen immer das Sichtfenster */}
      <rect x="0" y="0" width={VIEW_W} height={STATION_GROUND_Y} fill="url(#stnWall)" />
      <rect x="0" y={STATION_GROUND_Y} width={VIEW_W} height={VIEW_H - STATION_GROUND_Y} fill="url(#stnFloor)" />

      {/* Ferne (langsames Parallax): Deckenbalken + Bretterfugen der Rückwand */}
      <g transform={far}>
        <rect x="-260" y="0" width={worldW + 520} height="26" fill="#3a2417" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={-200 + i * 260} y="26" width="34" height="16" rx="3" fill="#4b3020" />
        ))}
        {seams.map((y) => (
          <path key={y} d={`M-260,${y} L${worldW + 260},${y}`} stroke="#5c3a28" strokeWidth="2" opacity=".45" />
        ))}
      </g>

      {/* Mittelgrund: Kabel, Fenster, Seekarte, Wandlampen (das sichtbare Wandband) */}
      <g transform={mid}>
        <rect x="-260" y={WALL_BAND_Y - 26} width={worldW + 520} height="10" fill="#3f2819" opacity=".8" />
        {lamps.map((x) => (
          <WallLamp key={`lp${x}`} x={x} />
        ))}
        {windows.map((x) => (
          <Window key={`wi${x}`} x={x} camX={camX} />
        ))}
        <WallMap x={70} />
      </g>

      {/* Spielebene: Sockelleiste, Dielen, Funktisch, Funk-Pulte, Pinguin, Vordergrund */}
      <g transform={play}>
        <rect x="-240" y={STATION_GROUND_Y - 14} width={worldW + 480} height="14" fill="#432a1c" />
        {Array.from({ length: Math.ceil((worldW + 520) / 96) }, (_, i) => (
          <path key={`fb${i}`} d={`M${-240 + i * 96},${STATION_GROUND_Y} L${-268 + i * 96},${VIEW_H}`} stroke="#3f2919" strokeWidth="2" opacity=".45" />
        ))}
        {desk(worldW)}
        {deskCable(worldW)}

        {/* Funk-Pulte (Halte) — sie STEHEN auf der Tischplatte und tragen NIE ein Zeichen */}
        {spots?.map((s, i) => {
          if (!pts || s.kind !== "station") return null;
          const p = pts[i];
          return (
            <g key={i} transform={`translate(${p.x} ${DESK_TOP})`}>
              <Console dim={i < pos} />
            </g>
          );
        })}

        {penguin}

        {/* Kisten und Seilrollen auf dem Raumboden (näher am Betrachter als der Pinguin) */}
        {Array.from({ length: Math.ceil((worldW + 480) / 440) }, (_, i) => (
          <g key={`fp${i}`} transform={`translate(${-120 + i * 440} 560)`}>
            {/* Schatten auf den Dielen */}
            <path d="M-12,4 L112,4 L104,14 L-4,14 Z" fill="#2a1a0e" opacity=".4" />
            {/* Holzkiste mit Deckel und Beschlägen */}
            <path d="M0,4 L96,4 L96,-66 L0,-66 Z" fill="#63421f" stroke="#3a2410" strokeWidth="3" />
            <path d="M0,-66 L96,-66 L86,-80 L10,-80 Z" fill="#8a5f2e" stroke="#3a2410" strokeWidth="3" />
            <path d="M0,-44 L96,-44 M0,-22 L96,-22" stroke="#3a2410" strokeWidth="2.5" opacity=".8" />
            <path d="M10,-62 L20,-62 L20,0 L10,0 Z M76,-62 L86,-62 L86,0 L76,0 Z" fill="#8a5f2e" opacity=".55" />
            {/* Seilrolle daneben */}
            <g transform="translate(158 -6)">
              <path d="M-38,8 q38,-30 76,0 q-38,14 -76,0 Z" fill="#b8925c" stroke="#7a5c33" strokeWidth="2.5" />
              <path d="M-26,4 q26,-20 52,0 q-26,10 -52,0 Z" fill="none" stroke="#7a5c33" strokeWidth="2.5" />
              <path d="M-14,0 q14,-11 28,0 q-14,6 -28,0 Z" fill="none" stroke="#7a5c33" strokeWidth="2.5" />
            </g>
          </g>
        ))}

        {/* Vordergrund: dunkle Kante eines Werktischs ganz vorn — gibt dem Raum Tiefe */}
        <rect x="-240" y="668" width={worldW + 480} height="10" fill="#a5764c" />
        <rect x="-240" y="678" width={worldW + 480} height={VIEW_H - 678} fill="#3b2617" />
      </g>

      {/* Bildschirm-fest: die Frontplatte des Funkgeräts (Kärtchen, Display, Empfang) */}
      {letters.length > 0 && (
        <>
          <PanelBody sentPulse={sentPulse} />
          <g key={`w${wobble}`} className={wobble > 0 ? "px-station-shake" : undefined}>
            <TilePool tiles={tiles} used={used} uppercase={uppercase} zeichenabstand={zeichenabstand} />
            <SlotRow
              letters={letters}
              typed={typed}
              seqPos={seqPos}
              solved={solved}
              uppercase={uppercase}
              zeichenabstand={zeichenabstand}
            />
          </g>
          <SignalMeter signal={signal} />
        </>
      )}
    </svg>
  );
}
