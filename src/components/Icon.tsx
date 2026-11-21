import type { ReactNode } from "react";

/**
 * Kleine Inline-SVG-Icon-Sammlung im flachen „Lucide"-Stil — ersetzt die
 * früheren Emoji-Symbole (Nutzerwunsch 2026-06-04). Bewusst OHNE neues npm-Paket
 * (Projekt-Linie: keine Extra-Deps). Alle Icons zeichnen mit `currentColor`
 * (stroke), also automatisch hell-/dunkel-tauglich, und sind standardmäßig
 * dekorativ (`aria-hidden`) — die Bedeutung steht immer im danebenstehenden Text
 * oder einem aria-label des umgebenden Elements.
 *
 * Größe: per `size` (Pixel) oder über die `className` (Tailwind h-… / w-…,
 * überschreibt die Default-Maße). Standard ist `1em`, läuft also mit der
 * Schriftgröße mit.
 */
export type IconName =
  | "bell"
  | "file"
  | "folder"
  | "link"
  | "book"
  | "lock"
  | "download"
  | "paperclip"
  | "pencil"
  | "film"
  | "image"
  | "help"
  | "list"
  | "chevronRight"
  | "sun"
  | "moon"
  | "sparkles"
  | "maximize"
  | "minimize"
  | "dashboard"
  | "users"
  | "graduationCap"
  | "keyboard"
  | "presentation"
  | "eye"
  | "flask"
  | "settings"
  | "contrast"
  | "volume"
  | "user"
  // ★ 30.08.2026: Sinnbilder für die Einträge des Konto-Menüs (Wunsch
  // Johannes: „zu jedem Eintrag ein dazupassendes Symbol"). `users` und
  // `bell` gab es schon.
  | "stats"
  | "key"
  | "logout"
  // ★ 22.09.2026: „Tasten erkunden" in der Kopfzeile von Tastenflow - eine
  // Taste unter der Lupe (die Tastatur trägt schon die Bildschirm-Tastatur).
  | "tasteLupe"
  // ★ E2b (25.09.2026): DER SPRACHWÄHLER (Bauplan D9/§9.3) - die weltweit
  // übliche Weltkugel, KEIN Emoji, KEINE Flagge (eine Flagge schlösse
  // Belgien, die Schweiz, Québec und Afrika aus - dieselbe Begründung gilt
  // für GB/US). Reiner Umriss, `currentColor` - stimmt darum in jedem
  // Kontrastmodus wie jedes andere Zeichen dieser Sammlung.
  | "globe";

const GLYPHS: Record<IconName, ReactNode> = {
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  file: (
    <>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </>
  ),
  folder: (
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  paperclip: (
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  ),
  pencil: (
    <>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </>
  ),
  film: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),
  // Balken-Diagramm - „Meine Statistik".
  stats: (
    <>
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="12" y1="20" x2="12" y2="8" />
      <line x1="18" y1="20" x2="18" y2="4" />
    </>
  ),
  // Schlüssel - „Passwort ändern".
  key: (
    <>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </>
  ),
  // Tür mit Pfeil hinaus - „Abmelden".
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ),
  help: (
    <>
      {/* Ohne eigenen Kreis (Johannes 30.08.2026): Das Sinnbild steht ohnehin
          in einem RUNDEN Knopf - der mitgelieferte Kreis machte daraus einen
          Kreis im Kreis, und das ? blieb winzig. Jetzt füllt das ? die Box. */}
      <path d="M7.64 7.5a4.5 4.5 0 0 1 8.75 1.5c0 3-4.5 4.5-4.5 4.5" />
      <line x1="12" y1="19.5" x2="12.01" y2="19.5" />
    </>
  ),
  list: (
    <>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </>
  ),
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </>
  ),
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  sparkles: (
    <>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </>
  ),
  maximize: (
    <>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </>
  ),
  minimize: (
    <>
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  graduationCap: (
    <>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
      <path d="M22 10v6" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
    </>
  ),
  tasteLupe: (
    <>
      <rect x="2" y="3" width="13" height="13" rx="2.5" />
      <path d="M6 12.5h5" />
      <circle cx="16" cy="16" r="4" />
      <path d="m22 22-3.2-3.2" />
    </>
  ),
  presentation: (
    <>
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  flask: (
    <>
      <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
      <path d="M6.453 15h11.094" />
      <path d="M8.5 2h7" />
    </>
  ),
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  // ★ KONTRAST — der halb gefüllte Kreis (30.08.2026, für den Farbschalter der
  // Kopfzeile). Er ist das Standard-Zeichen für „Kontrast/Farbmodus" und das
  // einzige der Sammlung, das eine FLÄCHE braucht: Ein reiner Umriss zeigt
  // keinen Unterschied zwischen hell und dunkel, und genau der ist die Sache.
  // Die Fläche liegt in `currentColor` wie der Umriss, damit sie in allen
  // sieben Kontrastmodi stimmt (siehe `src/lib/contrast.ts`).
  contrast: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" />
    </>
  ),
  // ★ MÄNNCHEN - der Konto-Knopf, abgemeldet (30.08.2026).
  //   Es stand als Inline-SVG in `AppKopfzeile.tsx` und ist hierher gezogen,
  //   damit ALLE Zeichen der Kopfzeile aus einer Quelle kommen - derselbe
  //   Grund, aus dem ❓ und ⚙ hier gelandet sind.
  //   ⚠️ ES IST DABEI VON EINER FLÄCHE ZU EINEM UMRISS GEWORDEN. Die alte
  //   Fassung war gefüllt; das passte, solange sie als 16-px-Zeichen VOR dem
  //   Wort „Anmelden / Konto" stand. Auf 22 px und ohne Wort säße sie als
  //   einziger schwarzer Klotz zwischen fünf Umrissen. Die Aussage bleibt
  //   dieselbe, `currentColor` auch - also stimmt sie weiter in allen sieben
  //   Kontrastmodi.
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21v-1.5a5.5 5.5 0 0 1 5.5-5.5h4a5.5 5.5 0 0 1 5.5 5.5V21" />
    </>
  ),
  // ★ LAUTSPRECHER MIT SCHALLWELLEN — „Vorlesen" (30.08.2026). Zwei Bögen statt
  // einem: Ein einzelner Bogen liest sich bei 22 px wie ein Klammerzeichen.
  volume: (
    <>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </>
  ),
  // ★ WELTKUGEL - der Sprachwähler (E2b, 25.09.2026). Kreis, Äquator, und ein
  // Meridian-Bogen (das klassische Zeichen für „Sprache/Land wählen") - reiner
  // Umriss, keine Fläche, wie „contrast" es NICHT ist: Ein Globus braucht
  // keine Fläche, um sich von einem blossen Kreis zu unterscheiden.
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 4 5.6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.6-4-9s1.5-6.5 4-9Z" />
    </>
  ),
};

export function Icon({
  name,
  className,
  size,
  title,
}: {
  name: IconName;
  className?: string;
  /** Pixelgröße; ohne Angabe „1em" (läuft mit der Schriftgröße). */
  size?: number;
  /** Optionaler Tooltip/zugänglicher Name. Ohne Angabe ist das Icon dekorativ. */
  title?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? "1em"}
      height={size ?? "1em"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {GLYPHS[name]}
    </svg>
  );
}
