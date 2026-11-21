/**
 * ★ WIE DIE ALT-TASTE ANGESCHRIEBEN WIRD - in ALLEN Lern-Apps gleich
 * (Johannes, 18.10.2026: „kannst du erkennen, welches System gerade läuft:
 * beim Mac überall ‚Wahl', wenn nicht, dann mit Fußnote").
 *
 * - Läuft das Gerät als Mac, steht in jeder Kürzel-Liste, jedem Hinweis und
 *   jedem Menü „Wahl + O" statt „Alt + O".
 * - Sonst steht „Alt + O"; die Listen tragen weiter die Fußnote „auf dem Mac:
 *   Wahltaste (⌥)".
 *
 * ⚠️ Das ist reine ANZEIGE. Die Tasten selbst prüfen alle Apps über `e.code`
 * (am Mac liefert die Wahltaste für Buchstaben Sonderzeichen) - daran ändert
 * diese Datei nichts. Und `aria-keyshortcuts` bleibt „Alt+O": Der Wert nennt
 * den technischen Tastennamen, nicht die Beschriftung ({@link ariaKuerzel}).
 *
 * Erkannt wird das SYSTEM, auf dem die Seite läuft - nicht die Plattform, die
 * ein Kind in »Im Griff« zum Üben gewählt hat. Ein iPad meldet sich je nach
 * Einstellung als „MacIntel"; das ist kein Schaden, an einer angeschlossenen
 * Tastatur heißt die Taste dort ebenfalls Wahl (⌥).
 */

/** Läuft die Seite auf einem Mac (oder einem iPad, das sich so meldet)? */
export function istMacSystem(): boolean {
  try {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const roh = nav.userAgentData?.platform ?? nav.platform ?? "";
    return /mac/i.test(roh);
  } catch {
    return false; // kein navigator (Node/Test) - dann Windows, der Alltag
  }
}

/**
 * Wie die Taste am Mac in der Sprache der Seite heißt: Deutsch „Wahl" (Apples
 * deutscher Name), sonst „Option" (so steht es auf englischen Mac-Tastaturen).
 * Tastenflow spricht acht Sprachen - ein deutsches Wort in der englischen
 * Oberfläche wäre falsch.
 */
export function wahlWort(): string {
  try {
    const lang = document.documentElement.lang || navigator.language || "de";
    return /^de\b/i.test(lang) ? "Wahl" : "Option";
  } catch {
    return "Wahl";
  }
}

/**
 * Ein Kürzel-Text für dieses Gerät: am Mac „Alt" ⇒ `wort` (Vorgabe: „Wahl" bzw.
 * in anderen Sprachen „Option", {@link wahlWort}), sonst unverändert. Ganze
 * Sätze gehen auch („… (Alt + V schaltet um)").
 */
export function altAnzeige(text: string, mac: boolean = istMacSystem(), wort: string = wahlWort()): string {
  if (!mac) return text;
  return text.replace(/\bAlt\b/g, wort);
}

/** Der Wert für `aria-keyshortcuts`: immer der technische Name „Alt+X", ohne Leerzeichen. */
export function ariaKuerzel(text: string): string {
  return text.replace(/\b(Wahl|Option|⌥)\b/g, "Alt").replace(/⌥/g, "Alt").replace(/\s/g, "");
}

/*
 * ★★ WELCHER BUCHSTABE STEHT AUF DER GEDRÜCKTEN TASTE? (18.10.2026)
 *
 * Anlass: Johannes' Entscheidung „Alt + Z = wo bin ich; Alt + Y nicht mehr
 * mitwirken lassen". Bis dahin prüften Tastenflow, Punktgenau und Klangpunkte
 * BEIDE Codes (`KeyY` und `KeyZ`) - nicht aus Versehen: `e.code` nennt die LAGE
 * der Taste auf einer US-Tastatur, und auf der deutschen Tastatur liegt das Z
 * dort, wo die US-Tastatur das Y hat (`KeyY`). Wer nur `KeyZ` prüft, hätte die
 * Taste für jedes Kind mit deutscher Tastatur auf das Y verschoben.
 *
 * Darum fragt diese Funktion nach dem AUFGEDRUCKTEN Buchstaben:
 *   1. Liefert `e.key` einen Buchstaben (Windows, Linux: Alt + Z ⇒ „z"), gilt er.
 *   2. Sonst (Mac: die Wahltaste macht aus Z ein „Ω") die Belegungskarte des
 *      Browsers (`navigator.keyboard.getLayoutMap`, Chrome/Edge) - geladen mit
 *      {@link ladeTastaturBelegung}.
 *   3. Ohne Karte (Safari, Firefox): deutsche Sprache des Browsers ⇒ QWERTZ,
 *      also Y und Z getauscht; sonst die US-Lage.
 */
let belegung: Map<string, string> | null = null;

/** Die Belegungskarte des Browsers laden (einmal, im Hintergrund; wo es sie nicht gibt, still). */
export function ladeTastaturBelegung(): void {
  try {
    const kb = (navigator as Navigator & { keyboard?: { getLayoutMap?: () => Promise<Map<string, string>> } }).keyboard;
    void kb?.getLayoutMap?.().then((m) => { belegung = m; }).catch(() => {});
  } catch {
    /* kein navigator - dann eben ohne Karte */
  }
}

function deutscheBelegung(): boolean {
  try {
    return /^de\b/i.test(navigator.language ?? "");
  } catch {
    return false;
  }
}

/** Der aufgedruckte Buchstabe der Taste (klein), oder `null` für Nicht-Buchstaben. */
export function buchstabeDerTaste(e: KeyboardEvent): string | null {
  if (/^[a-z]$/i.test(e.key)) return e.key.toLowerCase();
  const c = belegung?.get(e.code);
  if (c && /^[a-z]$/i.test(c)) return c.toLowerCase();
  const m = /^Key([A-Z])$/.exec(e.code);
  if (!m) return null;
  const b = m[1].toLowerCase();
  if (deutscheBelegung()) {
    if (b === "y") return "z";
    if (b === "z") return "y";
  }
  return b;
}

/** Alt + <Buchstabe> nach dem AUFDRUCK - für die Tasten, deren Lage je Belegung wandert (Z/Y). */
export function istAltBuchstabe(e: KeyboardEvent, buchstabe: string): boolean {
  return e.altKey && !e.ctrlKey && !e.metaKey && buchstabeDerTaste(e) === buchstabe.toLowerCase();
}

// Einmal beim Laden: die Karte steht bereit, bevor jemand Alt + Z drückt.
ladeTastaturBelegung();
