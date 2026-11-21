/**
 * ★★★★★ WAS UNTER DEM FOKUS STEHT, WIRD VORGELESEN.
 *
 * ── DER BEFUND ────────────────────────────────────────────────────────────
 *
 * Johannes am 03.09.2026 abends:
 *
 *   „wenn ich mit Vorlesen an durchs Menü tab, dann wird kein Schalter und
 *    keine Erklärung vorgelesen."
 *
 * Am Code nachgesehen: Es gab **überhaupt keine Fokus-Ansage**. Die eigene
 * Stimme sprach nur beim KLICKEN eines Schalters („Finger-Farben: an.") und
 * beim Tippen. Wer sich mit der Tabulatortaste bewegte, hörte nichts - er
 * musste raten, worauf er steht, und ein Kind erfährt erst NACH dem Drücken,
 * was es gerade verstellt hat.
 *
 * ── WARUM DAS EINE LÜCKE UND KEIN SCHÖNHEITSFEHLER IST ────────────────────
 *
 * „Vorlesen" ist für Kinder gebaut, die (noch) KEINEN Screenreader
 * eingerichtet haben - so steht es im Kopf von `voice.ts`. Für die ist die
 * eigene Stimme der einzige Kanal. Ein Screenreader sagt beim Tabben
 * selbstverständlich Name, Zustand und Beschreibung; ohne ihn tat das hier
 * niemand. Damit war der Einstellungsbereich für genau die Gruppe unbedienbar,
 * für die er gedacht ist.
 *
 * ── WAS GESPROCHEN WIRD ───────────────────────────────────────────────────
 *
 *   Name, Zustand. Erklärung.
 *
 * z. B. „Finger-Farben, an. Tasten in der Farbe des Fingers, der sie drückt."
 *
 * Der Name kommt in derselben Reihenfolge zustande, in der ein Screenreader
 * ihn bildet (`aria-label` → `aria-labelledby` → eigene Beschriftung), damit
 * beide Wege dasselbe sagen und niemand zwei Wahrheiten lernt.
 *
 * ── ⚠️ WO SIE SCHWEIGT ────────────────────────────────────────────────────
 *
 *  • **Im Tippfeld.** Dort ist der Fokus die ganze Übungszeit lang; eine
 *    Ansage bei jeder Rückkehr wäre Dauerfeuer über dem, was das Kind gerade
 *    tut.
 *  • **Wenn der Screenreader spricht.** Läuft ein Screenreader, sagt er das
 *    alles selbst - dann wäre die eigene Stimme die zweite über derselben
 *    Sache. Wir können einen Screenreader zwar nicht abfragen
 *    ([[reference_screenreader_nicht_abfragbar]]), aber der Vorlesen-Schalter
 *    IST die Antwort: Wer ihn anschaltet, sagt damit „ich habe keinen".
 *  • **Bei Mausklicks.** Ein Klick setzt den Fokus auch; wer klickt, sieht.
 *    Angesagt wird nur, was über die TASTATUR angesteuert wurde.
 */
import { speakUi } from "./voice";

/** Elemente, deren Fokus nicht angesagt wird. */
function stumm(el: HTMLElement): boolean {
  // Das Tippfeld selbst - siehe Kopf.
  if (el.dataset.typingField === "practice") return true;
  if (el.dataset.feld === "tippen") return true;
  // Nichts Bedienbares (z. B. ein Behälter mit tabindex=-1 für die Fokus-Rettung).
  if (el.tabIndex < 0) return true;
  return false;
}

/**
 * Den sichtbaren Text eines Elements.
 *
 * ⚠️ `innerText` ZUERST, `textContent` als Rückfall - und beides mit Absicht:
 * Im Browser klammert `innerText` aus, was unsichtbar ist (`display: none`,
 * `aria-hidden`-Beiwerk), und trifft damit das, was auch ein Screenreader
 * bildet. In jsdom gibt es `innerText` gar nicht (gemessen: `undefined`) -
 * ohne den Rückfall wären alle Tests hier stumm grün gewesen, weil jeder Name
 * leer herauskam.
 */
function text(el: Element | null): string {
  if (!el) return "";
  /*
   * ★★★ WAS `aria-hidden` IST, WIRD NICHT MITGESPROCHEN.
   *
   * Am Live-Stand gehört (03.09.2026 abends): „⌨️ Tastatur ausblenden" - das
   * Symbol steckt als `<span aria-hidden="true">` in der Beschriftung, und
   * die Stimme versuchte es auszusprechen. Ein Screenreader überspringt es;
   * unsere Ansage soll dasselbe sagen wie er, sonst lernt ein Kind zwei
   * Namen für denselben Schalter.
   *
   * ⚠️ Auf einer KOPIE gearbeitet - die Seite selbst wird nicht angefasst.
   */
  const kopie = el.cloneNode(true) as HTMLElement;
  kopie.querySelectorAll('[aria-hidden="true"]').forEach((k) => k.remove());
  const roh = kopie.innerText ?? kopie.textContent ?? "";
  return roh.replace(/\s+/g, " ").trim();
}

/** Text aus einer Liste von Kennungen (`aria-labelledby`, `aria-describedby`). */
function textVonIds(el: HTMLElement, attribut: string): string {
  const roh = el.getAttribute(attribut);
  if (!roh) return "";
  return roh
    .split(/\s+/)
    .map((id) => text(document.getElementById(id)))
    .filter(Boolean)
    .join(" ");
}

/**
 * Der Name, den auch ein Screenreader bilden würde - in derselben Reihenfolge.
 * Ein eigener Weg würde hier über kurz oder lang etwas anderes sagen als der
 * Screenreader, und dann lernte ein Kind zwei Namen für denselben Schalter.
 */
export function fokusName(el: HTMLElement): string {
  const label = el.getAttribute("aria-label");
  if (label?.trim()) return label.trim();

  const ausIds = textVonIds(el, "aria-labelledby");
  if (ausIds) return ausIds;

  // Ein Formularfeld über sein <label> (auch das umschliessende).
  const id = el.getAttribute("id");
  if (id) {
    const zu = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (zu) return text(zu);
  }
  const drum = el.closest("label");
  if (drum) return text(drum);

  return text(el);
}

/** „an" / „aus" / „aufgeklappt" - was das Bedienelement gerade ist. */
export function fokusZustand(el: HTMLElement): string {
  const gedrueckt = el.getAttribute("aria-pressed");
  if (gedrueckt === "true") return "an";
  if (gedrueckt === "false") return "aus";

  const gehakt = el.getAttribute("aria-checked");
  if (gehakt === "true") return "gewählt";
  if (gehakt === "false") return "nicht gewählt";

  if (el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox"))
    return el.checked ? "gewählt" : "nicht gewählt";

  const offen = el.getAttribute("aria-expanded");
  if (offen === "true") return "aufgeklappt";
  if (offen === "false") return "zugeklappt";

  return "";
}

/** Die Erklärung - `aria-describedby` zuerst, sonst der Titel. */
export function fokusErklaerung(el: HTMLElement): string {
  const ausIds = textVonIds(el, "aria-describedby");
  if (ausIds) return ausIds;
  return el.getAttribute("title")?.trim() ?? "";
}

/** Für den Vergleich: die Wörter, klein, ohne Satzzeichen. */
function woerter(t: string): string[] {
  return t
    .toLowerCase()
    .replace(/[.,;:!?()„“"'+-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Sagt die Erklärung überhaupt etwas Neues?
 *
 * ⚠️ WORTWEISE, nicht als Textstück. Der erste Versuch verglich ganze
 * Zeichenketten - und liess „Hilfe in einfacher Sprache (Alt + H). Hilfe
 * (Alt + H)" durch, weil „hilfe alt h" im Namen zwar wortweise steckt, aber
 * nicht am Stück. Genau dieser Fall war der Anlass.
 */
function sagtNichtsNeues(name: string, erklaerung: string): boolean {
  const imNamen = new Set(woerter(name));
  const ausErklaerung = woerter(erklaerung);
  if (!ausErklaerung.length) return true;
  return ausErklaerung.every((w) => imNamen.has(w));
}

/**
 * Der ganze Satz - leer, wenn es nichts zu sagen gibt.
 *
 * ★★★★ DIE ERKLÄRUNG FÄLLT WEG, WENN SIE NICHTS ERKLÄRT (gemessen 03.09.2026
 * abends am Live-Stand). Der erste Lauf sagte beim Durchtabben:
 *
 *   „Hilfe in einfacher Sprache (Alt + H). Hilfe (Alt + H)"
 *   „Kurztasten - Tastenkürzel-Liste (Alt + T), aus. Alle Tastenkürzel (Alt + T)"
 *
 * Beschriftung und Titel überschneiden sich bei den meisten Schaltern fast
 * vollständig - das Kürzel kam jedes Mal zweimal. Für ein Kind, das sich allein
 * durch Hören orientiert, ist doppelte Länge doppelte Wartezeit.
 *
 * ⚠️ Verglichen wird WORTWEISE: Bringt die Erklärung kein einziges Wort mit,
 * das nicht schon im Namen steht, sagt sie nichts Neues und entfällt. Eine
 * echte Erklärung - „Im Kontrastmodus nicht verfügbar." - bringt neue Wörter
 * mit und bleibt darum erhalten.
 */
export function fokusSatz(el: HTMLElement): string {
  const name = fokusName(el);
  if (!name) return "";
  const zustand = fokusZustand(el);
  const erklaerung = fokusErklaerung(el);
  const kopf = zustand ? `${name}, ${zustand}.` : `${name}.`;
  if (!erklaerung || sagtNichtsNeues(name, erklaerung)) return kopf;
  return `${kopf} ${erklaerung}`;
}

/**
 * Ansagen starten. Gibt die Abmeldung zurück.
 *
 * ⚠️ NUR BEI TASTATUR-BEDIENUNG. `focusin` feuert auch nach einem Mausklick;
 * wer klickt, sieht den Schalter aber. Deshalb merkt sich der Wächter, ob der
 * letzte Anstoss eine Taste war.
 */
export function fokusVorlesenStarten(): () => void {
  if (typeof document === "undefined") return () => {};
  let letzteWarTaste = false;

  const merkeTaste = (e: KeyboardEvent) => {
    // Nur Navigations-Tasten zählen; ein Buchstabe im Tippfeld ist kein Wechsel.
    if (["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "Escape"].includes(e.key))
      letzteWarTaste = true;
  };
  const merkeZeiger = () => {
    letzteWarTaste = false;
  };

  const onFocus = (e: FocusEvent) => {
    if (!letzteWarTaste) return;
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    if (stumm(el)) return;
    const satz = fokusSatz(el);
    // „ersetzbar": Wer schnell durchtabbt, soll nicht jede Station nachgesagt
    // bekommen - nur die, auf der er stehen bleibt.
    if (satz) speakUi(satz);
  };

  document.addEventListener("keydown", merkeTaste, true);
  document.addEventListener("pointerdown", merkeZeiger, true);
  document.addEventListener("focusin", onFocus);
  return () => {
    document.removeEventListener("keydown", merkeTaste, true);
    document.removeEventListener("pointerdown", merkeZeiger, true);
    document.removeEventListener("focusin", onFocus);
  };
}
