/**
 * Plattformweiter Kontrast-/Farbmodus-Store — ersetzt den einfachen Hell/Dunkel-
 * Schalter. 7 Modi: zwei Standard-Themen (Hell/Dunkel, steuern die Tailwind-
 * dark-Klasse) + fünf Spezial-Kontraste für Sehbehinderung (überschreiben die
 * CSS-Variablen direkt auf :root).
 *
 * Forschungsbasis: RNIB, Windows HCM (#FFEE32 statt #FFFF00), W3C LVTF 2024.
 * Leitprinzip: Schrift darf leuchten — Hintergrund soll gedämpft/matt sein.
 * Kontrast-Komfort-Zone bei 10–15:1 (nicht am theoretischen Maximum 21:1).
 */
import { create } from "zustand";
import type { CSSProperties } from "react";
import { applyTheme } from "./theme";
import type { BedienSprache } from "./bedienSprache/sprache";

export type ContrastMode =
  | "hell"
  | "dunkel"
  | "sw"
  | "ws"
  | "sg"
  | "gs"
  | "gb";

export const CONTRAST_MODES: { id: ContrastMode; label: string; kurz: string }[] = [
  { id: "hell",   label: "Hell (Standard)",    kurz: "Hell"      },
  { id: "dunkel", label: "Dunkel",             kurz: "Dunkel"    },
  { id: "sw",     label: "Schwarz auf Weiß",   kurz: "S/W"       },
  { id: "ws",     label: "Weiß auf Schwarz",   kurz: "W/S"       },
  { id: "sg",     label: "Schwarz auf Gelb",   kurz: "S/Gelb"    },
  { id: "gs",     label: "Gelb auf Schwarz",   kurz: "Gelb/S"    },
  { id: "gb",     label: "Gelb auf Blau",      kurz: "Gelb/Blau" },
];

/**
 * Die sieben Farbmodi auf Englisch - nur für die englische Bedienung von
 * Tastenflow. Stand bis EN8 (19.09.2026) als
 * `FARBNAMEN_EN` in `AppKopfzeile.tsx`; hierher gezogen, weil jetzt auch der
 * Farb-Schalter der Rechtstexte (`ThemeToggle`) ihn braucht - EINE Liste,
 * nicht zwei, die auseinanderlaufen.
 */
export const CONTRAST_NAMEN_EN: Record<ContrastMode, string> = {
  hell: "Light (default)",
  dunkel: "Dark",
  sw: "Black on white",
  ws: "White on black",
  sg: "Black on yellow",
  gs: "Yellow on black",
  gb: "Yellow on blue",
};

/**
 * ★ E11a (25.09.2026, französische Oberfläche): dieselben sieben Farbmodi auf
 * Französisch - wie {@link CONTRAST_NAMEN_EN}, für den Sprachwähler der
 * Tastenflow-Kopfzeile.
 */
export const CONTRAST_NAMEN_FR: Record<ContrastMode, string> = {
  hell: "Clair (par défaut)",
  dunkel: "Sombre",
  sw: "Noir sur blanc",
  ws: "Blanc sur noir",
  sg: "Noir sur jaune",
  gs: "Jaune sur noir",
  gb: "Jaune sur bleu",
};

/**
 * ★ ES-O (27.09.2026, Bauplan D6): Spanisch - wie {@link CONTRAST_NAMEN_FR}.
 */
export const CONTRAST_NAMEN_ES: Record<ContrastMode, string> = {
  hell: "Claro (predeterminado)",
  dunkel: "Oscuro",
  sw: "Negro sobre blanco",
  ws: "Blanco sobre negro",
  sg: "Negro sobre amarillo",
  gs: "Amarillo sobre negro",
  gb: "Amarillo sobre azul",
};

/**
 * ★ O-IT (02.10.2026): Italienisch - Namen nach dem Glossar (§2.8).
 */
export const CONTRAST_NAMEN_IT: Record<ContrastMode, string> = {
  hell: "Chiaro (predefinito)",
  dunkel: "Scuro",
  sw: "Nero su bianco",
  ws: "Bianco su nero",
  sg: "Nero su giallo",
  gs: "Giallo su nero",
  gb: "Giallo su blu",
};

/**
 * ★ O-PL (02.10.2026): Polnisch - Namen nach dem Glossar (§2.8, `CONTRAST_NAMEN_PL`).
 */
export const CONTRAST_NAMEN_PL: Record<ContrastMode, string> = {
  hell: "Jasny (domyślny)",
  dunkel: "Ciemny",
  sw: "Czarny na białym",
  ws: "Biały na czarnym",
  sg: "Czarny na żółtym",
  gs: "Żółty na czarnym",
  gb: "Żółty na niebieskim",
};

/**
 * ★ O-TR (02.10.2026): Türkisch - Namen nach dem Glossar (§2.8, `CONTRAST_NAMEN_TR`).
 */
export const CONTRAST_NAMEN_TR: Record<ContrastMode, string> = {
  hell: "Açık (varsayılan)",
  dunkel: "Koyu",
  sw: "Beyaz üzerinde siyah",
  ws: "Siyah üzerinde beyaz",
  sg: "Sarı üzerinde siyah",
  gs: "Siyah üzerinde sarı",
  gb: "Mavi üzerinde sarı",
};

/**
 * ★ O-CS (03.10.2026): Tschechisch - Namen nach dem Glossar (§2.8, `CONTRAST_NAMEN_CS`).
 */
export const CONTRAST_NAMEN_CS: Record<ContrastMode, string> = {
  hell: "Světlý (výchozí)",
  dunkel: "Tmavý",
  sw: "Černá na bílé",
  ws: "Bílá na černé",
  sg: "Černá na žluté",
  gs: "Žlutá na černé",
  gb: "Žlutá na modré",
};

/** ★ O2-SONST (30.10.2026): die neun Sprachen des Gerüsts - Namen nach den Glossaren. */
export const CONTRAST_NAMEN_BG: Record<ContrastMode, string> = {
  hell: "Светла (по подразбиране)",
  dunkel: "Тъмна",
  sw: "Черно на бяло",
  ws: "Бяло на черно",
  sg: "Черно на жълто",
  gs: "Жълто на черно",
  gb: "Жълто на синьо",
};

export const CONTRAST_NAMEN_EL: Record<ContrastMode, string> = {
  hell: "Ανοιχτό (προεπιλογή)",
  dunkel: "Σκούρο",
  sw: "Μαύρο σε λευκό",
  ws: "Λευκό σε μαύρο",
  sg: "Μαύρο σε κίτρινο",
  gs: "Κίτρινο σε μαύρο",
  gb: "Κίτρινο σε μπλε",
};

export const CONTRAST_NAMEN_HU: Record<ContrastMode, string> = {
  hell: "Világos (alapértelmezett)",
  dunkel: "Sötét",
  sw: "Fekete fehéren",
  ws: "Fehér feketén",
  sg: "Fekete sárgán",
  gs: "Sárga feketén",
  gb: "Sárga kéken",
};

export const CONTRAST_NAMEN_NL: Record<ContrastMode, string> = {
  hell: "Licht (standaard)",
  dunkel: "Donker",
  sw: "Zwart op wit",
  ws: "Wit op zwart",
  sg: "Zwart op geel",
  gs: "Geel op zwart",
  gb: "Geel op blauw",
};

export const CONTRAST_NAMEN_PT: Record<ContrastMode, string> = {
  hell: "Claro (predefinido)",
  dunkel: "Escuro",
  sw: "Preto sobre branco",
  ws: "Branco sobre preto",
  sg: "Preto sobre amarelo",
  gs: "Amarelo sobre preto",
  gb: "Amarelo sobre azul",
};

export const CONTRAST_NAMEN_BR: Record<ContrastMode, string> = {
  hell: "Claro (padrão)",
  dunkel: "Escuro",
  sw: "Preto no branco",
  ws: "Branco no preto",
  sg: "Preto no amarelo",
  gs: "Amarelo no preto",
  gb: "Amarelo no azul",
};

export const CONTRAST_NAMEN_RO: Record<ContrastMode, string> = {
  hell: "Luminos (implicit)",
  dunkel: "Întunecat",
  sw: "Negru pe alb",
  ws: "Alb pe negru",
  sg: "Negru pe galben",
  gs: "Galben pe negru",
  gb: "Galben pe albastru",
};

export const CONTRAST_NAMEN_SV: Record<ContrastMode, string> = {
  hell: "Ljust (standard)",
  dunkel: "Mörkt",
  sw: "Svart på vitt",
  ws: "Vitt på svart",
  sg: "Svart på gult",
  gs: "Gult på svart",
  gb: "Gult på blått",
};

export const CONTRAST_NAMEN_UK: Record<ContrastMode, string> = {
  hell: "Світла (типова)",
  dunkel: "Темна",
  sw: "Чорне на білому",
  ws: "Біле на чорному",
  sg: "Чорне на жовтому",
  gs: "Жовте на чорному",
  gb: "Жовте на синьому",
};

/**
 * ★ E11a-2 (26.09.2026, Weichen-Zähler §2.3): {@link CONTRAST_NAMEN_EN}/
 * {@link CONTRAST_NAMEN_FR} als EINE Tabelle statt einer Ternäre je Aufrufstelle
 * (`ThemeToggle.tsx`) - `undefined` bei „de" heisst: die deutsche Grundfassung
 * aus {@link CONTRAST_MODES} selbst gilt.
 */
export const CONTRAST_NAMEN_JE_SPRACHE: Readonly<
  Record<BedienSprache, Record<ContrastMode, string> | undefined>
> = {
  de: undefined,
  en: CONTRAST_NAMEN_EN,
  fr: CONTRAST_NAMEN_FR,
  es: CONTRAST_NAMEN_ES,
  it: CONTRAST_NAMEN_IT,
  // ★ O-PL (02.10.2026).
  pl: CONTRAST_NAMEN_PL,
  // ★ O-TR (02.10.2026).
  tr: CONTRAST_NAMEN_TR,
  // ★ O-CS (03.10.2026).
  cs: CONTRAST_NAMEN_CS,
  bg: CONTRAST_NAMEN_BG,
  el: CONTRAST_NAMEN_EL,
  hu: CONTRAST_NAMEN_HU,
  nl: CONTRAST_NAMEN_NL,
  pt: CONTRAST_NAMEN_PT,
  br: CONTRAST_NAMEN_BR,
  ro: CONTRAST_NAMEN_RO,
  sv: CONTRAST_NAMEN_SV,
  uk: CONTRAST_NAMEN_UK,
};

/**
 * Farbpaletten je Modus (RGB-Tripel wie in index.css).
 * hell/dunkel: null — Tailwind-dark-Klasse steuert das, kein Eingriff nötig.
 * Alle anderen: vollständiger Variablen-Satz für :root.
 */
const PALETTES: Record<ContrastMode, Record<string, string> | null> = {
  hell:   null,
  dunkel: null,

  // Schwarz auf Cremeweiß — RNIB-Empfehlung: creme statt reines Weiß (#FFFFFF),
  // 53 % der Low-Vision-Nutzer bevorzugen diese Kombination (W3C LVTF 2024).
  sw: {
    "--c-ink": "0 0 0",             "--c-ink-soft": "0 0 0",          "--c-ink-muted": "60 60 60",
    "--c-surface": "255 253 240",   "--c-surface-raised": "255 253 240", "--c-surface-sunken": "242 240 224",
    "--c-accent": "0 40 160",       "--c-accent-hover": "0 30 130",   "--c-accent-soft": "224 230 250",
    "--c-accent-solid": "0 40 160", "--c-accent-solid-hover": "0 30 130", "--c-on-accent": "255 253 240",
    "--c-success": "0 110 0",       "--c-success-soft": "224 244 224",
    "--c-warning": "150 75 0",      "--c-warning-soft": "255 240 215",
    "--c-danger": "190 0 0",        "--c-danger-soft": "255 226 226", "--c-hairline": "0 0 0",
    "--contrast-weight": "600",
  },

  // Weiß auf Schwarz — für starke Photophobie; dunkler Hintergrund blendet nicht.
  ws: {
    "--c-ink": "255 255 255",       "--c-ink-soft": "238 238 238",    "--c-ink-muted": "190 190 190",
    "--c-surface": "0 0 0",         "--c-surface-raised": "0 0 0",    "--c-surface-sunken": "26 26 26",
    "--c-accent": "120 190 255",    "--c-accent-hover": "160 210 255", "--c-accent-soft": "20 40 70",
    "--c-accent-solid": "120 190 255", "--c-accent-solid-hover": "160 210 255", "--c-on-accent": "0 0 0",
    "--c-success": "120 235 130",   "--c-success-soft": "16 50 22",
    "--c-warning": "255 200 110",   "--c-warning-soft": "60 44 12",
    "--c-danger": "255 130 130",    "--c-danger-soft": "70 16 16",    "--c-hairline": "255 255 255",
    "--contrast-weight": "600",
  },

  // Schwarz auf Warmamber — gedämpftes Gelb (rgb 255,236,140) statt Neongelb.
  // Windows HCM nutzt #FFEE32 statt #FFFF00 aus exakt diesem Grund: weniger
  // chromatische Aberration, Kontrast ~16:1 (AAA), aber ohne Blendung.
  sg: {
    "--c-ink": "0 0 0",             "--c-ink-soft": "30 20 0",        "--c-ink-muted": "90 70 0",
    "--c-surface": "255 236 140",   "--c-surface-raised": "255 236 140", "--c-surface-sunken": "242 218 112",
    "--c-accent": "0 0 150",        "--c-accent-hover": "0 0 120",    "--c-accent-soft": "236 226 100",
    "--c-accent-solid": "0 0 150",  "--c-accent-solid-hover": "0 0 120", "--c-on-accent": "255 236 140",
    "--c-success": "0 100 0",       "--c-success-soft": "214 236 120",
    "--c-warning": "140 70 0",      "--c-warning-soft": "248 220 80",
    "--c-danger": "160 0 0",        "--c-danger-soft": "252 210 80",  "--c-hairline": "0 0 0",
    "--contrast-weight": "600",
  },

  // Gelb auf Schwarz — Schrift leuchtet (gewollt!), Hintergrund ist neutral.
  // Gelb rgb(255,214,0) statt rgb(255,230,0): wärmer, weniger grüner Stich.
  gs: {
    "--c-ink": "255 214 0",         "--c-ink-soft": "240 200 0",      "--c-ink-muted": "196 160 0",
    "--c-surface": "0 0 0",         "--c-surface-raised": "0 0 0",    "--c-surface-sunken": "26 26 0",
    "--c-accent": "120 200 255",    "--c-accent-hover": "160 220 255", "--c-accent-soft": "20 36 60",
    "--c-accent-solid": "120 200 255", "--c-accent-solid-hover": "160 220 255", "--c-on-accent": "0 0 0",
    "--c-success": "150 235 90",    "--c-success-soft": "20 48 8",
    "--c-warning": "255 200 80",    "--c-warning-soft": "56 44 0",
    "--c-danger": "255 140 110",    "--c-danger-soft": "60 20 10",    "--c-hairline": "255 214 0",
    "--contrast-weight": "600",
  },

  // Gelb auf Blau — klassische Low-Vision-Kombination (DIN 32975, Leitlinien BIK).
  // Kontrast Gelb/Marineblau ≈ 14:1 (AAA). Gelb rgb(255,214,0) = wärmeres Gold.
  gb: {
    "--c-ink": "255 214 0",         "--c-ink-soft": "240 200 0",      "--c-ink-muted": "212 174 0",
    "--c-surface": "19 46 120",     "--c-surface-raised": "28 58 140", "--c-surface-sunken": "12 32 92",
    "--c-accent": "255 214 0",      "--c-accent-hover": "255 236 80", "--c-accent-soft": "40 78 168",
    "--c-accent-solid": "255 214 0", "--c-accent-solid-hover": "255 236 80", "--c-on-accent": "12 32 92",
    "--c-success": "170 240 120",   "--c-success-soft": "18 70 60",
    "--c-warning": "255 210 110",   "--c-warning-soft": "70 58 18",
    "--c-danger": "255 168 150",    "--c-danger-soft": "96 30 48",    "--c-hairline": "255 214 0",
    "--contrast-weight": "600",
  },
};

const PALETTE_KEYS = Object.keys(PALETTES.sw!);

/** CSS-Variablen als inline-Style-Objekt (für Zoom-Container; :root-Anwendung über applyContrast). */
export function contrastVars(mode: ContrastMode): CSSProperties {
  return (PALETTES[mode] ?? {}) as CSSProperties;
}

/**
 * ★ DIE ZWEI FARBEN EINES MODUS - Grund und Schrift, als RGB-Tripel.
 *
 * Wofür (30.08.2026, Johannes): Der Farbschalter in der Kopfzeile zeigt neben
 * jedem Eintrag ein kleines Muster IN SEINEN EIGENEN FARBEN. Ein Kind mit
 * Sehrest soll „Gelb auf Blau" SEHEN und nicht erraten müssen, was der Name
 * bedeutet - der Name allein ist für genau die Gruppe unbrauchbar, für die
 * diese sieben Modi da sind.
 *
 * `hell` und `dunkel` haben keine eigene Palette (dort steuert die Tailwind-
 * dark-Klasse). Ihre beiden Werte stehen als einzige Kopie hier - sie sind
 * wörtlich aus `src/index.css` übernommen (`:root` bzw. `:root.dark`,
 * `--c-surface` und `--c-ink`). Wer sie dort ändert, ändert sie hier mit.
 */
const STANDARD: Record<"hell" | "dunkel", { grund: string; schrift: string }> = {
  hell:   { grund: "251 251 253", schrift: "29 29 31" },
  dunkel: { grund: "38 38 42",    schrift: "245 245 247" },
};

export function contrastMuster(mode: ContrastMode): { grund: string; schrift: string } {
  const p = PALETTES[mode];
  if (!p) return STANDARD[mode === "dunkel" ? "dunkel" : "hell"];
  return { grund: p["--c-surface"], schrift: p["--c-ink"] };
}

/** Wendet den Kontrastmodus plattformweit auf :root an. */
export function applyContrast(mode: ContrastMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "hell") {
    PALETTE_KEYS.forEach((k) => root.style.removeProperty(k));
    applyTheme("light");
  } else if (mode === "dunkel") {
    PALETTE_KEYS.forEach((k) => root.style.removeProperty(k));
    applyTheme("dark");
  } else {
    const palette = PALETTES[mode];
    if (palette) {
      Object.entries(palette).forEach(([k, v]) => root.style.setProperty(k, v));
    }
    // Kontrast-Modi bringen ihre eigene Palette — .dark würde Variablen überschreiben
    root.classList.remove("dark");
    root.dataset.theme = mode;
    root.style.colorScheme = "light";
  }
}

const KEY = "sensorik:contrast";

/**
 * ★ DEM SYSTEM FOLGEN, SOLANGE NIEMAND GEWÄHLT HAT (Johannes 30.08.2026:
 * „kannst du erkennen, ob jemand am Mac oder Win den Dark Mode aktiviert hat,
 * und dann automatisch auch auf diesen wechseln? Auch bei Linux natürlich.")
 *
 * Alle drei melden es über denselben Kanal: `prefers-color-scheme`. Das
 * No-Flash-Skript in index.html und theme.ts folgten ihm längst - dieser
 * Store überschrieb ihr Ergebnis aber beim Laden mit „hell", weil sein
 * Vorgabewert fest stand. Jetzt gilt überall dieselbe Regel:
 *
 *   - EIGENE WAHL (irgendein gespeicherter Modus) gewinnt immer und bleibt.
 *   - OHNE Wahl folgt die App dem System - auch live, wenn es umschaltet
 *     (etwa macOS am Abend). Die fünf Spezial-Kontraste wählt das System
 *     nie: Es kennt nur hell und dunkel.
 */
function systemDunkel(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** Hat die Person je selbst gewählt? Nur dann ignorieren wir das System. */
function explizitGewaehlt(): boolean {
  try {
    if (localStorage.getItem(KEY)) return true;
    const alt = localStorage.getItem("sensorik:theme");
    return alt === "light" || alt === "dark";
  } catch {
    return false;
  }
}

function readStored(): ContrastMode {
  let v: string | null = null;
  try { v = localStorage.getItem(KEY); } catch { /* ignore */ }
  if (v && v in PALETTES) return v as ContrastMode;
  // Migration vom alten sensorik:theme-Schlüssel
  try { v = localStorage.getItem("sensorik:theme"); } catch { /* ignore */ }
  if (v === "dark") return "dunkel";
  if (v === "light") return "hell";
  return systemDunkel() ? "dunkel" : "hell";
}

interface ContrastState {
  mode: ContrastMode;
  setMode: (m: ContrastMode) => void;
}

export const useContrast = create<ContrastState>((set) => {
  const initial = readStored();
  // Sofort anwenden — gleich beim Laden, vor dem ersten Render
  applyContrast(initial);
  // Schaltet das SYSTEM um (hell ↔ dunkel), zieht die App live mit - aber
  // nur, solange niemand selbst gewählt hat. Der Horcher bleibt bewusst für
  // immer angemeldet: Der Store lebt so lange wie die Seite.
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", () => {
        if (explizitGewaehlt()) return;
        const m: ContrastMode = mq.matches ? "dunkel" : "hell";
        applyContrast(m);
        set({ mode: m });
      });
    }
  }
  return {
    mode: initial,
    setMode: (m) => {
      try { localStorage.setItem(KEY, m); } catch { /* ignore */ }
      applyContrast(m);
      set({ mode: m });
    },
  };
});
