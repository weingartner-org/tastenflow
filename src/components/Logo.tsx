/**
 * Marken-Logo: Braille-Zelle, Buchstabe „S" (Punkte 2,3,4 hell hervorgehoben).
 * Standardmäßig dekorativ (aria-hidden) — der Markenname steht als Text daneben.
 * Quelle ist mit public/logo.svg (Favicon) identisch zu halten.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Leichte Plastik (08.09.2026): der Verlauf über der Taste
          dunkelt nach unten ab und hellt NIE auf - sonst fällt der
          weiße Glyph unter seine gemessenen 4,5:1. Dieselben Werte
          stehen in public/logo.svg und im Startbild in index.html. */}
      <defs>
        <linearGradient id="sensorik-tiefe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" stopOpacity="0" />
          <stop offset="0.55" stopColor="#000000" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx="14.9" fill="#2C4C82" />
      <rect x="0" y="0" width="64" height="64" rx="14.9" fill="url(#sensorik-tiefe)" />
      <circle cx="24" cy="18" r="5" fill="#8BA3C7" />
      <circle cx="40" cy="18" r="5" fill="#F2F4F8" />
      <circle cx="24" cy="32" r="5" fill="#F2F4F8" />
      <circle cx="40" cy="32" r="5" fill="#8BA3C7" />
      <circle cx="24" cy="46" r="5" fill="#F2F4F8" />
      <circle cx="40" cy="46" r="5" fill="#8BA3C7" />
    </svg>
  );
}
