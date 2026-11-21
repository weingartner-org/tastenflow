/**
 * Erkennung eines angeschlossenen ZIFFERNBLOCKS und die Einstellung „Große
 * Tastatur (mit Ziffernblock)" (25.09.2026).
 *
 * Auftrag Johannes, wörtlich: *„Wir brauchen die Unterstützung einer großen
 * Tastatur. Kannst du erkennen, ob eine Tastatur mit Zahlenblock dran hängt,
 * und dann eine volle einblenden?"*
 *
 * ★ WIE ERKANNT WIRD: Der Browser bietet keine Abfrage „ist ein Ziffernblock
 * angeschlossen" an - dieselbe Lage wie bei jedem angeschlossenen Gerät
 * ([[reference_screenreader_nicht_abfragbar]] gilt sinngemäss, siehe auch
 * `geraeteHinweis.ts`). Der einzige verlässliche Beleg ist ein TASTENDRUCK:
 * Jede physische Ziffernblock-Taste trägt ein `event.code`, das mit
 * `"Numpad"` beginnt - auch die Eingabetaste dort (`NumpadEnter`). Sobald das
 * einmal passiert ist, ist die Frage für DIESES Gerät beantwortet und bleibt
 * es (localStorage) - eine Bluetooth-Tastatur, die kurz getrennt war, muss
 * das nicht neu beweisen.
 *
 * ★ BEWUSSTE WAHL SCHLÄGT AUTOMATIK: Schaltet jemand die volle Tastatur in
 * den Einstellungen ausdrücklich AUS, darf die Automatik sie beim nächsten
 * Ziffernblock-Anschlag nicht wieder einschalten - sonst wirkt der Schalter
 * kaputt. Darum stehen ERKANNT (Gerätetatsache) und WAHL (bewusste
 * Entscheidung) in getrennten Speicherplätzen; sobald es eine Wahl gibt,
 * gewinnt sie über die Automatik.
 *
 * Bauart wie `a11y.ts` (`useTypingA11y`): ein kleiner Zustand, den
 * `Keyboard.tsx` selbst über den Hook liest - keine Seite muss dafür eine
 * Eigenschaft durchreichen.
 */
import { create } from "zustand";

const ERKANNT_KEY = "tippen-ziffernblock-erkannt";
const WAHL_KEY = "tippen-grosse-tastatur";

function leseErkannt(): boolean {
  try {
    return localStorage.getItem(ERKANNT_KEY) === "1";
  } catch {
    return false; // kein Speicher - dann eben nicht erkannt
  }
}

function schreibeErkannt(): void {
  try {
    localStorage.setItem(ERKANNT_KEY, "1");
  } catch {
    /* Speichern optional */
  }
}

/** Die bewusste Wahl - `null` heisst: noch nie umgeschaltet, die Automatik gilt. */
function leseWahl(): "an" | "aus" | null {
  try {
    const v = localStorage.getItem(WAHL_KEY);
    return v === "an" || v === "aus" ? v : null;
  } catch {
    return null;
  }
}

function schreibeWahl(an: boolean): void {
  try {
    localStorage.setItem(WAHL_KEY, an ? "an" : "aus");
  } catch {
    /* Speichern optional */
  }
}

interface GrosseTastaturState {
  /** Effektiver Zustand: die eigene Wahl, sonst die Automatik. */
  aktiv: boolean;
  /** Schalter in den Einstellungen - eine bewusste Entscheidung. */
  setAktiv: (an: boolean) => void;
}

export const useGrosseTastatur = create<GrosseTastaturState>((set) => ({
  aktiv: leseWahl() === "an" || (leseWahl() === null && leseErkannt()),
  setAktiv: (an: boolean) => {
    schreibeWahl(an);
    set({ aktiv: an });
  },
}));

/**
 * Ein Tastendruck aus dem Ziffernblock ist eingetroffen - schaltet die volle
 * Tastatur ein, AUSSER es gibt schon eine bewusste Wahl (siehe Dateikopf).
 */
export function meldeZiffernblockTaste(): void {
  schreibeErkannt();
  if (leseWahl() === null) useGrosseTastatur.setState({ aktiv: true });
}

/** Ist dieser `KeyboardEvent.code` eine Ziffernblock-Taste? */
export function istZiffernblockCode(code: string | undefined | null): boolean {
  return !!code && code.startsWith("Numpad");
}

let horcherInstalliert = false;

/**
 * Der Erkennungs-Horcher - EINMAL installiert (beim ersten Laden dieses
 * Moduls; `@/lib/typing` wird ohnehin früh eingebunden). Am `document`, im
 * CAPTURE-Modus, damit er jeden Anschlag sieht, egal welches Element gerade
 * den Fokus hat - und PASSIV: Er ruft nie `preventDefault`, ein Kind, das im
 * Ziffernblock tippt, darf dadurch nie eine Eingabe verlieren.
 */
function installiereZiffernblockHorcher(): void {
  if (horcherInstalliert) return;
  if (typeof document === "undefined" || typeof document.addEventListener !== "function") return;
  horcherInstalliert = true;
  document.addEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      if (istZiffernblockCode(e.code)) meldeZiffernblockTaste();
    },
    { capture: true, passive: true },
  );
}

installiereZiffernblockHorcher();
