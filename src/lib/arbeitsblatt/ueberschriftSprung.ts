/**
 * ARBEITSBLATT - der DOM-KERN des Überschriften-Sprungs (Alt + G, „Gliederung").
 * ============================================================================
 * ★★★★★ GEHÖRT KEINEM PROGRAMM ALLEIN (Umbauplan P9a, 11.09.2026). Gebaut
 * wurde die Taste am 30.08.2026 nur für Tastenflow (`lib/typing/ueberschriften.ts`)
 * und hing dort fest an dessen Vorlese-Stimme (`speakUi`). Alt + G ist aber
 * plattformweit reserviert (`src/lib/shortcuts.ts:93-100`) - Mathecoach hat
 * keine eigene Sprachausgabe, braucht die Taste aber genauso: Ein Kind mit
 * Sehrest, das keinen Screenreader nutzt, hat sonst keinen Weg, sich die
 * Gliederung einer Ansicht (Blatt, Meine Blätter, Merkstoff) zu erschließen.
 *
 * ⇒ Der DOM-Kern wohnt jetzt HIER, mit einem austauschbaren „Melder" statt
 * einer festen Sprachausgabe. `lib/typing/ueberschriften.ts` ruft ihn mit
 * `speakUi` als Melder auf - Verhalten für Tastenflow unverändert.
 *
 * - Springt zur nächsten (bzw. vorherigen) sichtbaren Überschrift, setzt den
 *   FOKUS wirklich dorthin (`tabindex="-1"` + `focus()`): Braillezeile und
 *   echte Screenreader stehen danach an derselben Stelle wie die Meldung -
 *   keine zwei Wahrheiten.
 * - Zyklisch: nach der letzten geht es wieder zur ersten („Wieder oben."),
 *   rückwärts entsprechend zur letzten („Wieder unten.").
 * - `aria-hidden`-Teile und unsichtbare Überschriften (zugeklappte Bereiche)
 *   werden übersprungen; in jsdom (Tests) ist `offsetParent` IMMER null - dann
 *   zählen alle, statt dass die Taste dort stumm bleibt.
 */

/**
 * Der Text eines Elements, wie ihn eine Sprachausgabe lesen würde:
 * `aria-label` gewinnt, sonst der Textinhalt OHNE `aria-hidden`-Teile.
 *
 * ★ Warum nicht einfach `textContent`: Manche Bauteile tragen ihren Namen
 * zweimal - sichtbar (aria-hidden) und im sr-only-Satz für die Sprachausgabe.
 * `textContent` kennt kein aria-hidden und läse beide.
 */
export function zugaenglicherText(el: HTMLElement): string {
  const label = el.getAttribute("aria-label");
  if (label) return label;
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const teile = labelledby
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? "")
      .join(" ")
      .trim();
    if (teile) return teile;
  }
  const klon = el.cloneNode(true) as HTMLElement;
  klon.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
  return (klon.textContent ?? "").replace(/\s+/g, " ").trim();
}

/** Alle Überschriften einer Wurzel, in Dokument-Reihenfolge, sichtbar gefiltert. */
function ueberschriften(wurzel: ParentNode): HTMLElement[] {
  const kandidaten = Array.from(
    wurzel.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"),
  ).filter((h) => !h.closest('[aria-hidden="true"]'));
  // Unsichtbare (zugeklappte Bereiche, display:none) überspringen.
  // `offsetParent` ist dafür das übliche Maß; in jsdom (Tests) ist es
  // IMMER null - dann zählen alle, statt dass die Taste stumm bleibt.
  const sichtbar = kandidaten.filter((h) => h.offsetParent !== null);
  return sichtbar.length > 0 ? sichtbar : kandidaten;
}

export interface UeberschriftSprungOptionen {
  /** Wo gesucht wird. Standard: das ganze Dokument. */
  wurzel?: ParentNode;
  /** Wie die Meldung übermittelt wird - Sprachausgabe, Live-Region, … */
  melden: (text: string) => void;
  /** „vor" (Standard, Alt + G) oder „zurueck" (Umschalt + Alt + G). */
  richtung?: "vor" | "zurueck";
  /**
   * Das Ziel zusätzlich selbst in die Mitte rollen. Standard: false, damit
   * Tastenflow unverändert bleibt (dort übernimmt das niemand). Mathecoach
   * setzt es, weil `fokusMitteStarten` dort nur INNERHALB des offenen Blattes
   * hängt (`BlattSeite.tsx`) - eine Überschrift ausserhalb (Kopfzeile, Meine
   * Blätter) bekäme sonst keinen Bildlauf.
   */
  mitteRollen?: boolean;
}

/**
 * Zur nächsten (oder vorherigen) sichtbaren Überschrift springen. Gibt das
 * angesprungene Element zurück, oder `null`, wenn es keine Überschrift gibt.
 */
export function ueberschriftSpringen(
  opts: UeberschriftSprungOptionen,
): HTMLElement | null {
  const { wurzel = document, melden, richtung = "vor", mitteRollen = false } = opts;
  const vorwaerts = richtung !== "zurueck";
  const alle = ueberschriften(wurzel);
  if (alle.length === 0) {
    melden("Keine Überschriften auf dieser Ansicht.");
    return null;
  }

  const aktiv = document.activeElement;
  /**
   * Bezugspunkt in Dokumentreihenfolge: Steht der Fokus AUF oder IN einer
   * Überschrift, ist `idx` genau deren Index (`genau = true`). Sonst ist
   * `idx` die letzte Überschrift VOR dem Fokus (-1, wenn keine da ist) -
   * das reicht für VORWÄRTS unverändert wie in der ursprünglichen Fassung.
   * RÜCKWÄRTS braucht denselben Bezugspunkt, nur mit anderem Vorzeichen
   * (siehe unten) - eine Überschrift, vor der der Fokus gerade steht, ist
   * schon die richtige Antwort auf „vorherige Überschrift".
   */
  let idx = -1;
  let genau = false;
  if (aktiv instanceof HTMLElement && aktiv !== document.body) {
    const treffer = alle.findIndex((h) => h === aktiv || h.contains(aktiv));
    if (treffer !== -1) {
      idx = treffer;
      genau = true;
    } else {
      for (let i = 0; i < alle.length; i++) {
        if (
          aktiv.compareDocumentPosition(alle[i]) &
          Node.DOCUMENT_POSITION_PRECEDING
        ) {
          idx = i;
        }
      }
    }
  }

  let zielIdx: number;
  if (vorwaerts) {
    zielIdx = (idx + 1 + alle.length) % alle.length;
  } else if (genau) {
    zielIdx = (idx - 1 + alle.length) % alle.length;
  } else if (idx === -1) {
    zielIdx = alle.length - 1;
  } else {
    zielIdx = idx;
  }

  const ziel = alle[zielIdx];
  if (!ziel.hasAttribute("tabindex")) ziel.setAttribute("tabindex", "-1");
  ziel.focus({ preventScroll: false });
  if (mitteRollen) {
    ziel.scrollIntoView({ block: "center", behavior: "instant" });
  }

  const wiederOben = vorwaerts && idx >= 0 && zielIdx === 0;
  const wiederUnten = !vorwaerts && genau && idx === 0;
  const praefix = wiederOben ? "Wieder oben. " : wiederUnten ? "Wieder unten. " : "";
  melden(`${praefix}Überschrift: ${zugaenglicherText(ziel)}`);
  return ziel;
}
