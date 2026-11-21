/**
 * Jede `<details>`-Klappzeile der Plattform öffnet und schließt SICHTBAR -
 * dieselbe Bewegung wie `Aufklappen` (Johannes 19.09.2026: „der Rest rutscht
 * nach unten und der andere kommt nach … das würde überall helfen").
 *
 * EIN Horcher am Dokument statt einer Änderung an jeder Klappzeile: Die
 * Statistik, die Hilfen und die Lehrkraft-Seiten tragen Dutzende `<details>`,
 * und eine neue bekommt die Bewegung, ohne dass jemand daran denken muss.
 *
 * - Der Horcher hängt in der BLASEN-Phase, also nach Reacts eigenen
 *   Handlern: Wer einen Klick auf eine `<summary>` selbst abfängt
 *   (`preventDefault`), behält ihn.
 * - Klicks auf Schalter, Verweise oder Felder IN der `<summary>` bleiben
 *   nativ (die klappen auch sonst nicht).
 * - Ohne Web-Animation (jsdom) und bei „weniger Bewegung" tut er nichts -
 *   dann klappt der Browser selbst, wie bisher.
 * - Beim Öffnen steht `open` SOFORT (Screenreader hören „erweitert" ohne
 *   Verzug), nur die Höhe wächst nach. Beim Schließen fällt `open` am Ende
 *   der Bewegung.
 * - Wer eine Klappzeile ausnehmen will: `data-ohne-bewegung` an ihr oder
 *   einem Vorfahren.
 */
import { AUFKLAPP_KURVE, aufklappDauer, aufklappenBewegt } from "@/components/Aufklappen";

const laeufe = new WeakMap<HTMLDetailsElement, { lauf: Animation; oeffnet: boolean }>();
/** Die Höhe im zugeklappten Zustand, gemessen, solange sie zu war. */
const zuHoehen = new WeakMap<HTMLDetailsElement, number>();

function px(wert: string): number {
  return parseFloat(wert) || 0;
}

/** Geschätzte Höhe im zugeklappten Zustand, wenn sie nie zu gemessen wurde. */
function geschaetzteZuHoehe(d: HTMLDetailsElement, summary: HTMLElement): number {
  const ds = getComputedStyle(d);
  const ss = getComputedStyle(summary);
  return (
    summary.getBoundingClientRect().height +
    px(ss.marginTop) +
    px(ss.marginBottom) +
    px(ds.paddingTop) +
    px(ds.paddingBottom) +
    px(ds.borderTopWidth) +
    px(ds.borderBottomWidth)
  );
}

function bewege(d: HTMLDetailsElement, summary: HTMLElement, oeffnen: boolean) {
  const laufend = laeufe.get(d);
  const von = d.getBoundingClientRect().height;
  if (!laufend && !d.open) zuHoehen.set(d, von);
  laufend?.lauf.cancel();
  laeufe.delete(d);
  d.style.overflow = "clip";

  if (oeffnen) {
    d.open = true;
    const ziel = d.getBoundingClientRect().height;
    // Wächst die Zeile nicht (ihr Inhalt schwebt, etwa ein Menü), gibt es
    // nichts zu zeigen - und `clip` hielte das Schwebende nur zurück.
    if (Math.abs(ziel - von) < 4) {
      d.style.overflow = "";
      return;
    }
    const lauf = d.animate([{ height: `${von}px` }, { height: `${ziel}px` }], {
      duration: aufklappDauer(Math.abs(ziel - von)),
      easing: AUFKLAPP_KURVE,
    });
    laeufe.set(d, { lauf, oeffnet: true });
    lauf.onfinish = () => {
      if (laeufe.get(d)?.lauf !== lauf) return;
      laeufe.delete(d);
      d.style.overflow = "";
    };
    return;
  }

  const ziel = zuHoehen.get(d) ?? geschaetzteZuHoehe(d, summary);
  if (Math.abs(von - ziel) < 4) {
    d.open = false;
    d.style.overflow = "";
    return;
  }
  const lauf = d.animate([{ height: `${von}px` }, { height: `${ziel}px` }], {
    duration: Math.round(aufklappDauer(Math.abs(von - ziel)) * 0.8),
    easing: AUFKLAPP_KURVE,
    fill: "forwards",
  });
  laeufe.set(d, { lauf, oeffnet: false });
  lauf.onfinish = () => {
    if (laeufe.get(d)?.lauf !== lauf) return;
    laeufe.delete(d);
    // Beides vor dem nächsten Bild: erst zu, dann die gehaltene Höhe los.
    d.open = false;
    lauf.cancel();
    d.style.overflow = "";
  };
}

function beiKlick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const ziel = e.target instanceof Element ? e.target : null;
  const summary = ziel?.closest("summary");
  if (!ziel || !(summary instanceof HTMLElement)) return;
  const d = summary.parentElement;
  if (!(d instanceof HTMLDetailsElement)) return;
  // Nur die ERSTE summary klappt (so will es HTML). Ohne `:scope`-Selektor:
  // jsdoms Selektor-Maschine scheitert daran bei Klassen mit „/"
  // (`group/tasten`).
  if (Array.from(d.children).find((k) => k.tagName === "SUMMARY") !== summary) return;
  const bedienteil = ziel.closest("a, button, input, select, textarea, label, [contenteditable]");
  if (bedienteil && bedienteil !== summary && summary.contains(bedienteil)) return;
  if (d.closest("[data-ohne-bewegung]")) return;
  if (!aufklappenBewegt()) return;

  e.preventDefault();
  const laufend = laeufe.get(d);
  const oeffnen = laufend ? !laufend.oeffnet : !d.open;
  bewege(d, summary, oeffnen);
}

let eingeschaltet = false;

/** Einmal beim Start (main.tsx). Gibt eine Abschalt-Funktion zurück (Tests). */
export function detailsBewegungEinschalten(doc: Document = document): () => void {
  if (eingeschaltet) return () => {};
  eingeschaltet = true;
  doc.addEventListener("click", beiKlick);
  return () => {
    doc.removeEventListener("click", beiKlick);
    eingeschaltet = false;
  };
}
