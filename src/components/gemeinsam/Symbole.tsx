import type { ReactNode } from "react";

/**
 * Symbole für Schalter und Menüs.
 * Statt großer Textschalter: ein Symbol mit Hinweis beim Zeiger UND bei der
 * Tastatur-Auswahl, mit einem Namen für Screenreader. Eigene kleine Sammlung im
 * Lucide-Stil (Strich, `currentColor`, hell/dunkel/Kontrast-tauglich) - bewusst
 * getrennt von `components/Icon.tsx`, das allen Apps gehört.
 */
export const SYMBOL = {
  mikrofon: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v3",
  stopp: "M6 6h12v12H6z",
  bild: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21",
  ansehen: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  ersetzen: "M3 12a9 9 0 0 1 15-6.7L21 8 M21 3v5h-5 M21 12a9 9 0 0 1-15 6.7L3 16 M3 21v-5h5",
  herunterladen: "M12 3v12 M7 10l5 5 5-5 M5 21h14",
  mehr: "M12 12h.01 M12 5h.01 M12 19h.01",
  fassungen: "M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l4 2",
  loeschen: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6 M10 11v6 M14 11v6",
  kopieren: "M8 8h12v12H8z M4 16V4h12",
  senden: "M22 2L11 13 M22 2l-7 20-4-9-9-4z",
  verweis: "M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5",
  chat: "M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  ansagenAus: "M13.7 21a2 2 0 0 1-3.4 0 M18.6 13A17 17 0 0 1 18 8 M6.3 6.3A6 6 0 0 0 6 8c0 7-3 9-3 9h14 M18 8a6 6 0 0 0-9.3-5 M2 2l20 20",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6",
  // Übersetzung (Lucide "languages"): Zeichen links, Buchstabe A rechts.
  uebersetzen: "M5 8l6 6 M4 14l6-6 2-3 M2 5h12 M7 2h1 M22 22l-5-10-5 10 M14 18h6",
  mailAus: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6 M3 3l18 18",
  ansagenAn: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0",
  raum: "M2 3h20 M4 3v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V3 M12 15v6 M8 21h8",
  hochladen: "M12 21V9 M7 14l5-5 5 5 M5 3h14",
  plus: "M12 5v14M5 12h14",
  zurueck: "M15 6l-6 6 6 6",
  weiter: "M9 6l6 6-6 6",
  schliessen: "M18 6L6 18M6 6l12 12",
  rueckgaengig: "M9 14L4 9l5-5 M4 9h11a5 5 0 0 1 0 10h-3",
  antworten: "M9 17l-5-5 5-5 M20 18v-2a4 4 0 0 0-4-4H4",
  wiederholen: "M15 14l5-5-5-5 M20 9H9a5 5 0 0 0 0 10h3",
  fett: "M6 4h8a4 4 0 0 1 0 8H6z M6 12h9a4 4 0 0 1 0 8H6z",
  kursiv: "M19 4h-9 M14 20H5 M15 4L9 20",
  haken: "M20 6L9 17l-5-5",
  schloss: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
  ordner: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  datei: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5",
  kontrast: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z M12 3v18 M12 3a9 9 0 0 1 0 18z",
  suche: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3",
  liste: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
  statistik: "M4 20V11 M10 20V4 M16 20v-6 M22 20H2",
  kacheln: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  vollbild: "M8 3H5a2 2 0 0 0-2 2v3 M21 8V5a2 2 0 0 0-2-2h-3 M3 16v3a2 2 0 0 0 2 2h3 M16 21h3a2 2 0 0 0 2-2v-3",
  neuerTab: "M15 3h6v6 M10 14L21 3 M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  umbenennen: "M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  verschieben: "M5 9l-3 3 3 3 M9 5l3-3 3 3 M15 19l-3 3-3-3 M19 9l3 3-3 3 M2 12h20 M12 2v20",
  zuklappen: "M6 15l6-6 6 6",
  aufklappen: "M6 9l6 6 6-6",
  anwesenheit: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 3h6v4H9z M9 14l2 2 4-4",
  feedback: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01",
  buch: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z M4 19.5V21h16",
  handout: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h6",
  leitung: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8",
  einstellungen: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  ausblenden: "M9 6l6 6-6 6",
  ordnerNeu: "M12 10v6 M9 13h6 M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.9 3.9A2 2 0 0 0 8.1 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z",
  ordnerHoch: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z M12 10v6 M9 13l3-3 3 3",
  mittel: "M7 8h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z",
  gross: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
} as const;

export type SymbolName = keyof typeof SYMBOL;

/** Das Symbol allein (dekorativ: der Name steht im Knopf oder daneben). */
export function Sym({ name, size = 20, strich = 2 }: { name: SymbolName; size?: number; strich?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strich}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={SYMBOL[name]} />
    </svg>
  );
}

export type HinweisOrt = "oben" | "unten" | "links" | "rechts";
const ORT: Record<HinweisOrt, string> = {
  oben: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  unten: "top-full left-1/2 mt-2 -translate-x-1/2",
  links: "right-full top-1/2 mr-2 -translate-y-1/2",
  rechts: "left-full top-1/2 ml-2 -translate-y-1/2",
};

/**
 * Symbol-Knopf mit Hinweis. Der sichtbare Hinweis erscheint beim Zeiger und bei der
 * Tastatur-Auswahl; Screenreader lesen `name` (mit dem Gegenstand, z. B. dem
 * Dateinamen: "Ansehen: Ablauf.docx"). `hinweis` ist der kurze sichtbare Text.
 */
export function SymbolKnopf({
  symbol,
  hinweis,
  name,
  onClick,
  ort = "oben",
  ton = "ruhig",
  groesse = 36,
  gedrueckt,
  aufgeklappt,
  extra,
  className = "",
  type = "button",
  tabIndex,
  id,
}: {
  id?: string;
  symbol: SymbolName;
  hinweis: string;
  /** Name für Screenreader; fehlt er, gilt `hinweis`. */
  name?: string;
  onClick?: () => void;
  ort?: HinweisOrt;
  ton?: "ruhig" | "gefahr" | "haupt";
  groesse?: 30 | 32 | 36 | 40 | 44;
  gedrueckt?: boolean;
  aufgeklappt?: boolean;
  /** Etwas neben dem Symbol, z. B. eine Zahl. */
  extra?: ReactNode;
  className?: string;
  type?: "button" | "submit";
  tabIndex?: number;
}) {
  const farbe =
    ton === "haupt"
      ? "bg-accent text-white hover:bg-accent-hover"
      : ton === "gefahr"
        ? "text-ink-muted hover:bg-danger-soft hover:text-danger focus-visible:bg-danger-soft focus-visible:text-danger"
        : "text-ink-muted hover:bg-accent-soft hover:text-accent focus-visible:bg-accent-soft focus-visible:text-accent";
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      aria-label={name ?? hinweis}
      aria-pressed={gedrueckt}
      aria-expanded={aufgeklappt}
      tabIndex={tabIndex}
      style={{ height: groesse, minWidth: groesse }}
      className={`group/knopf relative inline-flex shrink-0 items-center justify-center gap-1 rounded-lg px-1.5 ${farbe} ${
        gedrueckt ? "bg-ink text-surface hover:bg-ink hover:text-surface" : ""
      } ${className}`}
    >
      <Sym name={symbol} size={groesse >= 40 ? 22 : groesse <= 32 ? 17 : 20} />
      {extra}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-xs font-medium leading-none text-surface opacity-0 shadow transition-opacity group-hover/knopf:opacity-100 group-focus-visible/knopf:opacity-100 ${ORT[ort]}`}
      >
        {hinweis}
      </span>
    </button>
  );
}

/** Wie `SymbolKnopf`, aber ein Link (Herunterladen, neuer Tab). */
export function SymbolLink({
  symbol,
  hinweis,
  name,
  href,
  download,
  neuerTab,
  ort = "oben",
  groesse = 36,
}: {
  symbol: SymbolName;
  hinweis: string;
  name?: string;
  href: string;
  download?: string;
  neuerTab?: boolean;
  ort?: HinweisOrt;
  groesse?: 30 | 32 | 36 | 40 | 44;
}) {
  return (
    <a
      href={href}
      download={download}
      target={neuerTab ? "_blank" : undefined}
      rel={neuerTab ? "noopener noreferrer" : undefined}
      aria-label={name ?? hinweis}
      style={{ height: groesse, minWidth: groesse }}
      className="group/knopf relative inline-flex shrink-0 items-center justify-center rounded-lg px-1.5 text-ink-muted hover:bg-accent-soft hover:text-accent focus-visible:bg-accent-soft focus-visible:text-accent"
    >
      <Sym name={symbol} size={groesse >= 40 ? 22 : groesse <= 32 ? 17 : 20} />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-xs font-medium leading-none text-surface opacity-0 shadow transition-opacity group-hover/knopf:opacity-100 group-focus-visible/knopf:opacity-100 ${ORT[ort]}`}
      >
        {hinweis}
      </span>
    </a>
  );
}
