/**
 * Der Polar-Pinguin als gebautes SVG-Rig (Neubau „Polar-Expedition", Bauplan
 * §2/§3): Körper, Kopf, zwei Flügel, zwei Füße, blinzelnde Augen und ein roter
 * Expeditions-Schal, der im Wind weht — kein aufgeklebtes Bild mehr. Die Figur
 * und ihre sechs Posen sind 1:1 aus der verbindlichen Design-Referenz (Artifact
 * 20c1048a) übernommen; die Bewegung liegt komplett in `expedition.css`
 * (transform-only, prefers-reduced-motion stellt sie still).
 *
 * Die Pose wird über das Attribut `data-pose` am Wurzel-<g> geschaltet, das die
 * CSS-Regeln (`.px-fig[data-pose="…"] …`) auswählen. Das Rig zeichnet in seinem
 * eigenen Koordinatensystem mit dem FUSSPUNKT bei (0,0) — der Aufrufer platziert
 * es also schlicht per `transform="translate(fußX fußY) scale(s)"`. Bei Größe 1
 * ist die Figur ~340 SVG-Einheiten hoch (Fuß bis Kopfscheitel).
 */
import { useId } from "react";

export type PenguinPose =
  | "idle"
  | "walk"
  | "jump"
  | "slide"
  | "scare"
  | "cheer";

export interface PenguinRigProps {
  pose: PenguinPose;
  /** SVG-Transform zum Platzieren/Skalieren (Fußpunkt der Figur = lokal 0,0). */
  transform?: string;
  /** Blickrichtung: -1 spiegelt die Figur (schaut nach links). */
  facing?: 1 | -1;
}

/**
 * Referenz-Rig in Artifact-Koordinaten (Körperachse x≈455, Fußsohle y≈399).
 * Wir schieben es per innerem <g> so, dass die Fußsohle auf (0,0) liegt.
 */
const ANCHOR_X = 455;
const ANCHOR_Y = 399;

export function PenguinRig({ pose, transform, facing = 1 }: PenguinRigProps) {
  const uid = useId().replace(/:/g, "");
  const gBody = `pxBody-${uid}`;
  const flip = facing === -1 ? " scale(-1 1)" : "";
  return (
    <g className="px-fig" data-pose={pose} transform={transform}>
      <defs>
        <linearGradient id={gBody} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4f6b" />
          <stop offset="1" stopColor="#22344a" />
        </linearGradient>
      </defs>
      <g transform={`${flip} translate(${-ANCHOR_X} ${-ANCHOR_Y})`}>
        <g className="p-walker">
          <g className="p-rig">
            {/* ===== Seitenansicht: Bauchrutsche ===== */}
            <g className="p-side">
              <g className="p-sideLines" stroke="#ffffff" strokeWidth="5" strokeLinecap="round">
                <line x1="180" y1="300" x2="268" y2="300" />
                <line x1="160" y1="336" x2="256" y2="336" />
                <line x1="196" y1="368" x2="278" y2="368" />
              </g>
              {/* Schneespur hinter dem Bauch */}
              <path
                d="M270,394 q40,-8 80,0 q40,8 80,0"
                stroke="#ffffff"
                strokeWidth="7"
                fill="none"
                opacity=".7"
                strokeLinecap="round"
              />
              {/* Füße hinten oben */}
              <g fill="#ff9538">
                <path d="M300,338 q-30,-12 -46,-2 q-6,6 2,12 q22,8 46,0 z" />
                <path d="M312,362 q-32,-8 -48,4 q-5,7 4,11 q24,5 46,-4 z" />
              </g>
              {/* Körper liegend */}
              <g transform="rotate(-6 440 352)">
                <ellipse cx="440" cy="352" rx="135" ry="55" fill={`url(#${gBody})`} />
                <ellipse cx="452" cy="376" rx="112" ry="30" fill="#f3f9fd" />
              </g>
              {/* Flügel angelegt auf dem Rücken */}
              <path d="M400,318 q60,-16 118,6 q10,6 2,14 q-58,16 -118,-4 q-10,-8 -2,-16 z" fill="#1d2e42" />
              {/* Kopf vorn, leicht gehoben */}
              <circle cx="592" cy="302" r="48" fill={`url(#${gBody})`} />
              <ellipse cx="606" cy="313" rx="30" ry="24" fill="#f3f9fd" />
              <circle cx="601" cy="296" r="10.5" fill="#ffffff" stroke="#d7e6ef" strokeWidth="1" />
              <circle cx="604" cy="297" r="5.2" fill="#17222e" />
              <circle cx="606" cy="295" r="1.8" fill="#ffffff" />
              <polygon points="634,294 672,303 634,315" fill="#ff9538" />
              {/* Schal: Band + wehendes Ende nach hinten */}
              <path d="M552,272 q28,26 8,54 q-8,8 -16,2 q-22,-26 -8,-56 q8,-8 16,0 z" fill="#e0524f" />
              <g className="p-scarfSide">
                <path d="M548,290 q-42,-26 -84,-16 q-10,4 -6,12 q6,10 16,8 q38,-4 70,10 z" fill="#e0524f" />
                <path d="M478,278 l-6,14 M498,280 l-5,13" stroke="#f0716e" strokeWidth="4" />
              </g>
              {/* Schneefontäne an der Brust */}
              <g className="p-sideSpray" fill="#ffffff">
                <circle cx="560" cy="384" r="10" />
                <circle cx="586" cy="376" r="7" />
                <circle cx="540" cy="392" r="6" />
                <circle cx="600" cy="388" r="5" />
              </g>
            </g>

            {/* ===== Frontansicht (alle anderen Posen) ===== */}
            <g className="p-front">
              {/* Füße */}
              <g className="p-footL">
                <rect x="384" y="382" width="58" height="17" rx="8.5" fill="#ff9538" />
              </g>
              <g className="p-footR">
                <rect x="468" y="382" width="58" height="17" rx="8.5" fill="#ff9538" />
              </g>
              {/* Flügel */}
              <path
                className="p-wingL"
                d="M372,214 q-52,52 -36,132 q5,21 22,12 q30,-54 34,-134 q-9,-17 -20,-10 z"
                fill="#1d2e42"
              />
              <path
                className="p-wingR"
                d="M538,214 q52,52 36,132 q-5,21 -22,12 q-30,-54 -34,-134 q9,-17 20,-10 z"
                fill="#1d2e42"
              />
              {/* Körper */}
              <g className="p-body">
                <ellipse cx="455" cy="278" rx="100" ry="126" fill={`url(#${gBody})`} />
                <ellipse cx="455" cy="300" rx="64" ry="94" fill="#f3f9fd" />
              </g>
              {/* Kopf */}
              <g className="p-head">
                <circle cx="455" cy="128" r="66" fill={`url(#${gBody})`} />
                <ellipse cx="455" cy="143" rx="47" ry="38" fill="#f3f9fd" />
                <g className="p-brows" stroke="#17222e" strokeWidth="5" strokeLinecap="round">
                  <line x1="416" y1="102" x2="444" y2="112" />
                  <line x1="494" y1="102" x2="466" y2="112" />
                </g>
                <circle cx="431" cy="126" r="13.5" fill="#ffffff" stroke="#d7e6ef" strokeWidth="1" />
                <circle cx="479" cy="126" r="13.5" fill="#ffffff" stroke="#d7e6ef" strokeWidth="1" />
                <g className="p-pupils">
                  <g>
                    <circle cx="433.5" cy="128" r="7" fill="#17222e" />
                    <circle cx="436" cy="125" r="2.4" fill="#ffffff" />
                  </g>
                  <g>
                    <circle cx="481.5" cy="128" r="7" fill="#17222e" />
                    <circle cx="484" cy="125" r="2.4" fill="#ffffff" />
                  </g>
                </g>
                <polygon points="441,150 469,150 455,176" fill="#ff9538" />
                <path d="M443,152 q12,7 24,0" stroke="#d97a24" strokeWidth="2" fill="none" />
              </g>
              {/* Schal */}
              <path d="M398,182 q57,26 114,0 l3,20 q-60,28 -120,0 z" fill="#e0524f" />
              <path d="M404,188 q51,22 102,0" stroke="#f0716e" strokeWidth="5" fill="none" opacity=".8" />
              <g className="p-scarfTail">
                <path d="M412,198 q-8,34 -2,62 q2,10 14,8 q10,-2 9,-12 q-4,-28 -1,-56 z" fill="#e0524f" />
                <path d="M412,258 l22,-3 M414,246 l20,-3" stroke="#f0716e" strokeWidth="4" />
              </g>
              {/* Schneespray (Rutschen aus der Front — Landepose) */}
              <g className="p-spray" fill="#ffffff">
                <circle cx="380" cy="392" r="9" />
                <circle cx="356" cy="380" r="6" />
                <circle cx="398" cy="376" r="5" />
                <circle cx="342" cy="394" r="4.5" />
              </g>
              {/* Sterne (Jubeln) */}
              <g className="p-stars" fill="#ffd76b" fontSize="34">
                <text x="360" y="90">✦</text>
                <text x="520" y="70">✦</text>
                <text x="452" y="40">✦</text>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}
