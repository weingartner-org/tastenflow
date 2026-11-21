/**
 * WELCHES SPIEL kommt als Belohnung? - eine Einstellung auf GERÄTE-Ebene
 * (Charge S2, Bauplan 14.08.2026 §0b.4, Johannes: „super Idee!").
 *
 * Vorgeschichte: Bis zum Umbau auf drei Altersstufen hatten die 10- bis
 * 12-Jährigen ein eigenes, mittleres Profil mit der Polar-Expedition. Seit S1
 * gehören sie zu `teens`. Johannes' Weiche vom 30.07. („mit 11 ist ein Spiel
 * kein Kinderkram, sondern der Grund weiterzumachen") bleibt gültig - darum
 * entscheidet ab jetzt die Person selbst, statt eines vierten Profils.
 *
 * ★★ 22.08.2026 (Charge „SCHLANK"): Der TIPP-SPRINT ist ersatzlos entfallen.
 * Er war eine Dopplung ohne Spielwert - „Mein Training" bevorzugt die
 * schwachen Tasten ohnehin (`generator.ts`), und genau das tat auch der
 * Sprint: drei Zeilen aus Dreiergruppen der wackligsten Zeichen. Wer ihn
 * bekam, übte dasselbe noch einmal, nur in einem Fenster. Geblieben sind zwei
 * ehrliche Möglichkeiten: gar kein Spiel oder das Eisschollen-Spiel.
 * Neue Vorgabe für die Jugend-Stufe ist KEINS - wer die Expedition will, holt
 * sie sich im Zahnrad.
 *
 * ★ WARUM GERÄT UND NICHT KONTO: Genau wie das Tastatur-Layout ({@link
 * ./layouts}) beschreibt diese Wahl den Arbeitsplatz und die Laune, nicht das
 * Kind - sie darf ohne Anmeldung wirken (anonyme Besucher stehen auf `teens`),
 * ohne Server auskommen und ohne Schema-Änderung bleiben. S2 ist bewusst
 * frontend-only: kein Konto-Feld, keine setup.mjs-Änderung.
 *
 * Bewusst OHNE Zustandsbibliothek gehalten (Muster von layouts.ts/sound.ts):
 * Der Wert wird auch außerhalb von React gebraucht - im Rundenende-Callback der
 * Trainer, wo das Belohnungs-Angebot gebaut wird. Für die Oberfläche gibt es
 * {@link subscribeBelohnungsSpiel} (Haken: components/typing/useBelohnungsSpiel).
 */

/** Was als Belohnung in Frage kommt - seit 22.08.2026 nur noch diese zwei. */
export type BelohnungsSpiel = "keins" | "expedition";

/** „Keins" zuerst: Es ist die Vorgabe, und die Liste liest sich von leer nach voll. */
export const BELOHNUNGSSPIELE: BelohnungsSpiel[] = ["keins", "expedition"];

/**
 * Vorgabe = KEINS (Johannes 22.08.2026). Bis dahin stand hier der Tipp-Sprint;
 * mit seinem Wegfall bekommt niemand ab 11 ungefragt ein Spiel - wer eines
 * will, holt es sich im Zahnrad.
 */
export const VORGABE_BELOHNUNGSSPIEL: BelohnungsSpiel = "keins";

export const BELOHNUNGSSPIEL_LABELS: Record<BelohnungsSpiel, string> = {
  keins: "Keins",
  expedition: "Eisschollen-Spiel",
};

/** ★ EN2 (19.09.2026): in der englischen Bedienung (Glossar §3.6 *Ice Floe game*). */
export const BELOHNUNGSSPIEL_LABELS_EN: Record<BelohnungsSpiel, string> = {
  keins: "None",
  expedition: "Ice Floe game",
};

/** ★ E11a-4 (26.09.2026): auf Französisch (Glossar §9.2 *la Banquise*). */
export const BELOHNUNGSSPIEL_LABELS_FR: Record<BelohnungsSpiel, string> = {
  keins: "Aucun",
  expedition: "Jeu de la banquise",
};

/** ★ ES-O (27.09.2026): auf Spanisch (wie die Ansage in `vorlesen.ts`, ES-F8). */
export const BELOHNUNGSSPIEL_LABELS_ES: Record<BelohnungsSpiel, string> = {
  keins: "Ninguno",
  expedition: "Juego de la Banquisa",
};

/** ★ O-IT (02.10.2026): auf Italienisch (Glossar §2.3 „Gioco dei lastroni"). */
export const BELOHNUNGSSPIEL_LABELS_IT: Record<BelohnungsSpiel, string> = {
  keins: "Nessuno",
  expedition: "Gioco dei lastroni",
};

/** ★ O-PL (02.10.2026): auf Polnisch (Glossar §2.3 „Skoki po krach"). */
export const BELOHNUNGSSPIEL_LABELS_PL: Record<BelohnungsSpiel, string> = {
  keins: "Brak",
  expedition: "Skoki po krach",
};

/** ★ O-TR (02.10.2026): auf Türkisch (Glossar §2.3 "Buz Kütlesi Oyunu"). */
export const BELOHNUNGSSPIEL_LABELS_TR: Record<BelohnungsSpiel, string> = {
  keins: "Yok",
  expedition: "Buz Kütlesi Oyunu",
};

/** ★ O-CS (03.10.2026): auf Tschechisch (Glossar §2.3 „Ledové kry"). */
export const BELOHNUNGSSPIEL_LABELS_CS: Record<BelohnungsSpiel, string> = {
  keins: "Žádná",
  expedition: "Ledové kry",
};

/** ★ O2-LIB (29.10.2026): die Belohnungsspiele, bulgarisch (Glossar „Ледени късове"). */
export const BELOHNUNGSSPIEL_LABELS_BG: Record<BelohnungsSpiel, string> = {
  keins: "Няма",
  expedition: "Ледени късове",
};

/** ★ O-EL-LIB (30.10.2026): auf Griechisch (Glossar §2.3 „Παγοκομμάτια"). */
export const BELOHNUNGSSPIEL_LABELS_EL: Record<BelohnungsSpiel, string> = {
  keins: "Κανένα",
  expedition: "Παγοκομμάτια",
};

/** ★ O2-LIB (29.10.2026): Belohnungsspiel-Namen, Ungarisch (Glossar: Jégtáblák). */
const BELOHNUNGSSPIEL_LABELS_HU: Record<BelohnungsSpiel, string> = {
  keins: "Nincs",
  expedition: "Jégtáblák",
};

/** ★ O2-LIB (29.10.2026): auf Niederländisch (Glossar nl §2.3 "IJsschotsenspel"). */
export const BELOHNUNGSSPIEL_LABELS_NL: Record<BelohnungsSpiel, string> = {
  keins: "Geen",
  expedition: "IJsschotsenspel",
};

/** ★ O-LIB (30.10.2026): em português (Glossar §2.3 „Blocos de gelo"). */
export const BELOHNUNGSSPIEL_LABELS_PT: Record<BelohnungsSpiel, string> = {
  keins: "Nenhum",
  expedition: "Blocos de gelo",
};

/** ★ O2-LIB (29.10.2026): Belohnungsspiel-Namen, Portugiesisch (Brasilien) - Glossar "Placas de gelo". */
export const BELOHNUNGSSPIEL_LABELS_BR: Record<BelohnungsSpiel, string> = {
  keins: "Nenhum",
  expedition: "Placas de gelo",
};

/** ★ O2-LIB (29.10.2026): auf Rumänisch (Glossar §2.3 „Sloiuri de gheață“). */
export const BELOHNUNGSSPIEL_LABELS_RO: Record<BelohnungsSpiel, string> = {
  keins: "Niciunul",
  expedition: "Sloiuri de gheață",
};

/** ★ O2-LIB (30.10.2026): auf Schwedisch (Glossar sv §2.3 "Isflaken"). */
export const BELOHNUNGSSPIEL_LABELS_SV: Record<BelohnungsSpiel, string> = {
  keins: "Inget",
  expedition: "Isflaken",
};

/** ★ O2-LIB (30.10.2026): auf Ukrainisch (Glossar §2.3 „Крижини"; „Без гри" §2.12). */
export const BELOHNUNGSSPIEL_LABELS_UK: Record<BelohnungsSpiel, string> = {
  keins: "Без гри",
  expedition: "Крижини",
};

/** ★ ES-O: eine Tabelle je Bedienungssprache statt einer Weiche (Falle 30). */
export const BELOHNUNGSSPIEL_LABELS_JE_SPRACHE: Record<Lang, Record<BelohnungsSpiel, string>> = {
  de: BELOHNUNGSSPIEL_LABELS,
  en: BELOHNUNGSSPIEL_LABELS_EN,
  fr: BELOHNUNGSSPIEL_LABELS_FR,
  es: BELOHNUNGSSPIEL_LABELS_ES,
  it: BELOHNUNGSSPIEL_LABELS_IT,
  pl: BELOHNUNGSSPIEL_LABELS_PL,
  tr: BELOHNUNGSSPIEL_LABELS_TR, // ★ O-TR (02.10.2026)
  cs: BELOHNUNGSSPIEL_LABELS_CS, // ★ O-CS (03.10.2026)
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: BELOHNUNGSSPIEL_LABELS_BG,
  el: BELOHNUNGSSPIEL_LABELS_EL,
  hu: BELOHNUNGSSPIEL_LABELS_HU,
  nl: BELOHNUNGSSPIEL_LABELS_NL,
  pt: BELOHNUNGSSPIEL_LABELS_PT,
  br: BELOHNUNGSSPIEL_LABELS_BR,
  ro: BELOHNUNGSSPIEL_LABELS_RO,
  sv: BELOHNUNGSSPIEL_LABELS_SV,
  uk: BELOHNUNGSSPIEL_LABELS_UK,
};

import type { Lang } from "./account";

const STORAGE_KEY = "tippen-belohnungsspiel";

let current: BelohnungsSpiel = VORGABE_BELOHNUNGSSPIEL;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded(): void {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // ★ ALTE SPEICHERSTÄNDE: Zwischen dem 15. und 22.08.2026 stand hier bei
    // vielen Geräten „sprint". Dieses Spiel gibt es nicht mehr; der Wert fällt
    // beim Lesen auf die Vorgabe zurück, statt eine leere Wahl zu erzeugen.
    // Bewusst wird der Schlüssel NICHT überschrieben - Lesen soll nichts
    // schreiben; beim nächsten bewussten Umstellen ist er ohnehin richtig.
    if (raw === "keins" || raw === "expedition") current = raw;
  } catch {
    /* localStorage nicht verfügbar - dann eben die Vorgabe */
  }
}

/** Das eingestellte Belohnungs-Spiel (Geräte-Einstellung). */
export function activeBelohnungsSpiel(): BelohnungsSpiel {
  ensureLoaded();
  return current;
}

/** Belohnungs-Spiel umstellen (wird im Browser gemerkt). */
export function setBelohnungsSpiel(wahl: BelohnungsSpiel): void {
  ensureLoaded();
  if (wahl === current) return;
  current = wahl;
  try {
    localStorage.setItem(STORAGE_KEY, wahl);
  } catch {
    /* ignore */
  }
  for (const fn of listeners) fn();
}

/** Auf die Umstellung horchen (für React-Komponenten). */
export function subscribeBelohnungsSpiel(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
