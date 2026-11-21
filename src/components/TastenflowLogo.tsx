/**
 * Tastenflow-Zeichen (30.08.2026): eine Taste, oben das T, darunter die flache,
 * unregelmäßige Welle - der Fluss beim Tippen. Entworfen am Design-Canvas mit
 * Johannes; die Welle zitiert den Fühlstrich von F und J, ohne zu behaupten,
 * die T-Taste hätte einen.
 *
 * Zwei Auftritte (Wunsch Johannes 30.08.):
 *   - ohne `beschreibung`: dekorativ (aria-hidden), der Name „Tastenflow"
 *     steht als Text daneben (z. B. im Splash).
 *   - mit `beschreibung`: ein ECHTES Bild mit Bildbeschreibung. Wer mit dem
 *     Screenreader darauf kommt, erfährt, wie das Zeichen aussieht - dieselbe
 *     Teilhabe an der sichtbaren Welt wie bei den Abzeichen. Der Text
 *     beschreibt das Aussehen, nicht die Funktion; die steht im Titel daneben.
 *
 * Das T ist GEZEICHNET, kein <text>: So sieht das Zeichen überall gleich aus,
 * auch dort, wo keine Schrift geladen ist (Favicon, PDF-Kopf). Taste #0072b2 =
 * Zeigefinger links (Okabe-Ito), dieselbe Farbe wie in der Bildschirm-Tastatur.
 *
 * Quelle ist mit public/tastenflow-logo.svg (Favicon/Manifest) identisch zu
 * halten - wie beim Sensorik-Zeichen (Logo.tsx / public/logo.svg).
 */
export const TASTENFLOW_LOGO_BESCHREIBUNG =
  "Das Tastenflow-Zeichen: eine blaue Tastatur-Taste mit abgerundeten Ecken. " +
  "Oben ein großes weißes T, darunter eine flache, unregelmäßige weiße Welle.";

export function TastenflowLogo({
  className,
  beschreibung,
}: {
  className?: string;
  /** true = Standard-Bildbeschreibung; eigener Text überschreibt sie. */
  beschreibung?: boolean | string;
}) {
  const label =
    typeof beschreibung === "string"
      ? beschreibung
      : beschreibung
        ? TASTENFLOW_LOGO_BESCHREIBUNG
        : undefined;
  return (
    <svg
      // viewBox auf die Taste ZUGESCHNITTEN (30.08., Wunsch Johannes): Kein
      // Leerrand - bei gleicher CSS-Größe ist die Taste damit exakt so hoch
      // wie der Sensorik-Kreis (der seine Box auch ganz füllt).
      viewBox="4 4 56 56"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      focusable="false"
    >
      {/* Leichte Plastik (08.09.2026): der Verlauf über der Taste
          dunkelt nach unten ab und hellt NIE auf - sonst fällt der
          weiße Glyph unter seine gemessenen 4,5:1. Dieselben Werte
          stehen in public/tastenflow-logo.svg und im Startbild in index.html. */}
      <defs>
        <linearGradient id="tastenflow-tiefe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.55" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="13" fill="#0072b2" />
      <rect x="4" y="4" width="56" height="56" rx="13" fill="url(#tastenflow-tiefe)" />
      <path
        d="M22.5 13 H41.5 A1.2 1.2 0 0 1 42.7 14.2 V17.3 A1.2 1.2 0 0 1 41.5 18.5 H35.1 V33.8 A1.2 1.2 0 0 1 33.9 35 H30.1 A1.2 1.2 0 0 1 28.9 33.8 V18.5 H22.5 A1.2 1.2 0 0 1 21.3 17.3 V14.2 A1.2 1.2 0 0 1 22.5 13 Z"
        fill="#FBFBFD"
      />
      <path
        d="M12 46.5 C 13.3 45.8, 15.2 44.8, 17 44.8 C 19.5 44.8, 21.5 47.8, 24 47.8 C 27.5 47.8, 30 43.8, 34 43.8 C 38 43.8, 40.5 47.5, 44 47.5 C 47 47.5, 50.2 46.2, 52 45.5"
        stroke="#FBFBFD"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
