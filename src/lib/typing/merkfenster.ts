/**
 * Die Merker der Erklär-Fenster von „Tastenflow" (31.08.2026, E6: 19.09.2026,
 * Tastatur-Hinweis: 20.09.2026).
 *
 * Fünf Fenster, fünf verschiedene Lebensdauern - und genau deshalb liegen sie
 * an EINER Stelle statt verstreut in fünf Bauteilen:
 *
 *  • `umschalt`  - die falsche Umschalttaste. Kommt IMMER wieder, bis das Kind
 *                  den Haken „Diese Meldung nicht mehr anzeigen" setzt
 *                  (Johannes 31.08.: „immer Dialog bis das Häkchen geklickt
 *                  wird"). Der Haken gilt dauerhaft.
 *  • `grossschreibung` - der Hinweis, dass die Umschalttaste noch nicht nötig
 *                  ist. Kommt GENAU EINMAL, ganz ohne Haken.
 *  • `wochenziel`  - „Wochenziel geschafft!" (W4, 19.09.2026 - vorher hiess
 *                  dieselbe Stelle „tagesziel" und feierte die erste an einem
 *                  TAG fertige Einheit; seit `wochenziel.ts` (Minuten je
 *                  KALENDERWOCHE, keine Einheiten mehr) gibt es kein
 *                  Tagesziel mehr, nur noch das Wochenziel selbst). Kommt
 *                  EINMAL JE ZIEL-WOCHE, bewusst KEIN Haken - „das ändert
 *                  sich ja wöchentlich" (dieselbe Begründung wie vorher fürs
 *                  Tagesziel, nur eine Ebene höher).
 *  • `lesezeile` - die Erklärung der Lesezeile (E12, 20.09.2026, „Was fehlt
 *                  hier?" mit CVI). Kommt GENAU EINMAL, wie die Grossschreibung -
 *                  wer die Bedienung schon kennt, muss sie nicht zweimal lesen.
 *  • `tastaturHinweis` - die Bitte, eine echte Tastatur anzuschliessen
 *                  (Auftrag Johannes 20.09.2026: *„kannst du erkennen ob ein
 *                  mobiles gerät tastenflow öffnet und eine meldung
 *                  ausgeben"*). Kommt GENAU EINMAL JE GERÄT, wie die
 *                  Grossschreibung und die Lesezeile - UND verschwindet
 *                  zusätzlich von selbst, sobald ein Anschlag mit einem echten
 *                  `event.code` ankommt (`geraeteHinweis.ts`,
 *                  `istEchteTastatureingabe`): Die Frage „ist eine Tastatur
 *                  da?" ist dann beantwortet, gleichgültig ob das Kind vorher
 *                  geklickt hat.
 *
 * ⚠️ Das Fenster der „Eigenen Übung" („Weiter geht es mit einer Übung von
 * deiner Lehrkraft", E6) stand bis 19.09.2026 AUCH hier - mit EINEM Wert je
 * Gerät. Auf einem Klassen-Rechner, an dem sich Kinder nacheinander anmelden,
 * bekam darum nur das erste Kind das Fenster. Seit Z1 (19.09.2026) steht es je
 * Kind und je Text am Konto (`customTextProgress[textId].angekuendigt`, siehe
 * `useEigeneUebung.ts`) - ein alter Wert `eigeneUebungTextId` im Speicher
 * eines Geräts wird nicht mehr gelesen.
 *
 * ★ WARUM AM GERÄT UND NICHT AM KONTO: Ein Merker am Konto bräuchte ein neues
 * Feld in `tt_pupils` samt Server-Wächter und einen Deploy der Art „Update LMS
 * (komplett)". Am Gerät reicht `localStorage` - dasselbe, was `a11y.ts` für
 * „Stand ausblenden" tut. Der Preis ist gewollt und klein: Wer an einem zweiten
 * Gerät übt, bekommt die Erklärung dort noch einmal. Das ist bei einer
 * ERKLÄRUNG kein Schaden, sondern eher ein Gewinn.
 * ⚠️ Wenn Johannes einen dieser Merker doch am Konto will (Frage F6), ist
 * DIESE Datei die einzige Stelle, die sich ändert - die drei Fenster fragen
 * nur hier.
 *
 * Alle Zugriffe sind gegen fehlendes `localStorage` abgesichert (privates
 * Fenster, gesperrte Website-Daten): Im Zweifel gilt „noch nicht gesehen" -
 * lieber eine Erklärung zu viel als eine zu wenig.
 */

const SCHLUESSEL = "tt_merkfenster";

interface Merker {
  /** Haken „nicht mehr anzeigen" beim Umschalt-Fenster gesetzt? */
  umschaltAus?: boolean;
  /** Der Grossschreibungs-Hinweis wurde schon gezeigt. */
  grossGesehen?: boolean;
  /**
   * ISO-Wochenschlüssel („2026-W38", siehe `wochenziel.ts` `aktuelleWocheKey`),
   * in der das Wochenziel-Fenster zuletzt kam.
   */
  wochenzielWoche?: string;
  /** Die Erklärung der Lesezeile (E12, 20.09.2026) wurde schon gezeigt. */
  lesezeileGesehen?: boolean;
  /**
   * Die Bitte um eine echte Tastatur (20.09.2026) wurde schon gezeigt ODER
   * durch einen echten Tastendruck beantwortet - siehe `geraeteHinweis.ts`.
   */
  tastaturHinweisGesehen?: boolean;
}

function lies(): Merker {
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (!roh) return {};
    const d = JSON.parse(roh) as unknown;
    return d && typeof d === "object" ? (d as Merker) : {};
  } catch {
    return {};
  }
}

function schreib(m: Merker): void {
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(m));
  } catch {
    /* kein localStorage - dann bleibt es bei „noch nicht gesehen" */
  }
}

// --- Umschalttaste -----------------------------------------------------------

/** Soll das Umschalt-Fenster gezeigt werden? (Bis der Haken gesetzt ist: ja.) */
export function zeigeUmschaltFenster(): boolean {
  return !lies().umschaltAus;
}

/** Der Haken „Diese Meldung nicht mehr anzeigen". */
export function setzeUmschaltFensterAus(aus: boolean): void {
  schreib({ ...lies(), umschaltAus: aus });
}

// --- Grossschreibung ---------------------------------------------------------

/** Genau einmal: wurde der Hinweis schon gezeigt? */
export function grossschreibungGesehen(): boolean {
  return !!lies().grossGesehen;
}

export function merkeGrossschreibungGesehen(): void {
  schreib({ ...lies(), grossGesehen: true });
}

// --- Wochenziel ----------------------------------------------------------------

/**
 * Einmal je ZIEL-WOCHE: kam das Fenster in `wocheKey` (ISO-Wochenschlüssel,
 * z. B. „2026-W38") schon? Der Schlüssel kommt fertig vom Aufrufer
 * (`aktuelleWocheKey` aus `wochenziel.ts`) - dieselbe Montag-08:00-Grenze wie
 * überall sonst beim Wochenziel, statt sie hier ein zweites Mal zu rechnen.
 */
export function wochenzielFensterGezeigt(wocheKey: string): boolean {
  return lies().wochenzielWoche === wocheKey;
}

export function merkeWochenzielFenster(wocheKey: string): void {
  schreib({ ...lies(), wochenzielWoche: wocheKey });
}

// --- Lesezeile -----------------------------------------------------------------

/** Genau einmal: wurde die Erklärung der Lesezeile schon gezeigt? */
export function lesezeileGesehen(): boolean {
  return !!lies().lesezeileGesehen;
}

export function merkeLesezeileGesehen(): void {
  schreib({ ...lies(), lesezeileGesehen: true });
}

// --- Tastatur-Hinweis -----------------------------------------------------------

/**
 * Genau einmal je Gerät: wurde die Bitte um eine Tastatur schon gezeigt ODER
 * bereits durch einen echten Tastendruck beantwortet?
 */
export function tastaturHinweisGesehen(): boolean {
  return !!lies().tastaturHinweisGesehen;
}

export function merkeTastaturHinweisGesehen(): void {
  schreib({ ...lies(), tastaturHinweisGesehen: true });
}

/** Alles zurücksetzen - für Tests und für den Prüfstand. */
export function setzeMerkfensterZurueck(): void {
  try {
    localStorage.removeItem(SCHLUESSEL);
  } catch {
    /* nichts zu tun */
  }
}
