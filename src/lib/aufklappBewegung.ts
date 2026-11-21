/**
 * Jeder AUFKLAPP-SCHALTER der Plattform lässt seinen Bereich sichtbar
 * aufgleiten - der Rest rutscht nach unten (Johannes 28.09.2026: „Betrifft
 * alle Apps … alles, was oben ausgeklappt ist, bei dem der Rest nach unten
 * rutscht, braucht einen Effekt").
 *
 * Seit 19.09. gleiten `<details>` (`detailsBewegung.ts`) und jeder Bereich,
 * der `<Aufklappen>` benutzt (18 Dateien). Gezählt am 28.09.: 71 Schalter mit
 * `aria-expanded` in 39 Dateien - die meisten blenden ihren Bereich noch mit
 * `{offen && …}` ein, und der Rest springt. Statt jede Stelle umzubauen, hört
 * EIN Horcher am Dokument auf den Augenblick, in dem ein Schalter
 * `aria-expanded="true"` bekommt, und lässt den neuen Bereich wachsen - so
 * bekommt auch jeder künftige Schalter die Bewegung, ohne dass jemand daran
 * denken muss.
 *
 * Welcher Bereich? In dieser Reihenfolge:
 * 1. `aria-controls` zeigt auf ihn. Neu eingehängt oder eben sichtbar
 *    geworden (`hidden`/`class`/`style` im selben Zug geändert) ⇒ er wächst.
 *    Steht er schon und bekommt nur Inhalt ⇒ der neue Inhalt wächst.
 * 2. Ohne `aria-controls`: was im SELBEN Zug neu eingehängt wurde, in der
 *    Nähe des Schalters (bis vier Ebenen über ihm), ohne ihn selbst.
 *
 * Was er NICHT anfasst:
 * - Schwebendes (`absolute`/`fixed` - Menüs, Listen): Das schiebt nichts
 *   nach unten, da gibt es keinen Rest, der rutschen könnte.
 * - Was schon gleitet: `<Aufklappen>` (`data-aufklappen`) und alles, woran
 *   eine Web-Animation läuft.
 * - Tabellenzeilen: Eine `<tr>` lässt sich nicht in der Höhe bewegen - sie
 *   blendet nur weich ein. (Wer sie gleiten lassen will: `<Aufklappen huelle>`.)
 * - `data-ohne-bewegung` am Bereich oder einem Vorfahren.
 * - Bei „weniger Bewegung" und ohne Web-Animation (jsdom): nichts, wie bisher.
 *
 * Nur das ÖFFNEN gleitet. Ein `{offen && …}`-Bereich ist beim Schließen im
 * selben Augenblick aus dem Baum - dafür gibt es `<Aufklappen>`.
 *
 * Für Tastatur und Screenreader ändert sich nichts: Der Bereich steht sofort
 * vollständig im Baum, nur seine sichtbare Höhe wächst nach. `overflow: clip`
 * (nicht `hidden`), damit ein Fokus im wachsenden Bereich ihn nicht in sich
 * verschiebt - dieselbe Regel wie in `Aufklappen`.
 */
import {
  AUFKLAPP_KURVE,
  aufklappDauer,
  aufklappenBewegt,
  elternAbstand,
} from "@/components/Aufklappen";

const SICHTBAR_ATTRIBUTE = new Set(["hidden", "class", "style"]);
const NAEHE = 4;

function schwebt(el: HTMLElement): boolean {
  const pos = getComputedStyle(el).position;
  return pos === "absolute" || pos === "fixed";
}

function bewegtSchon(el: HTMLElement): boolean {
  if (el.closest("[data-aufklappen], [data-ohne-bewegung]")) return true;
  if (el.querySelector("[data-aufklappen]")) return true;
  const laeufe = el.getAnimations?.({ subtree: true }) ?? [];
  // Nur Web-Animationen zählen (Aufklappen, detailsBewegung) - CSS-Übergänge
  // wie `hover:` laufen dauernd irgendwo und sagen nichts.
  return laeufe.some((a) => a.constructor === Animation && a.playState === "running");
}

function gleite(el: HTMLElement) {
  if (bewegtSchon(el) || schwebt(el)) return;
  const stil = getComputedStyle(el);
  if (stil.display === "contents" || stil.display === "none") return;

  if (el.tagName === "TR" || el.tagName === "TBODY") {
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: AUFKLAPP_KURVE });
    return;
  }

  const ziel = el.getBoundingClientRect().height;
  if (ziel < 4) return;
  const rand = { oben: stil.marginTop, unten: stil.marginBottom };
  const obenZu = `${-elternAbstand(el)}px`;
  const vorher = el.style.overflow;
  el.style.overflow = "clip";
  const lauf = el.animate(
    [
      { height: "0px", marginTop: obenZu, marginBottom: "0px", opacity: 0 },
      { height: `${ziel}px`, marginTop: rand.oben, marginBottom: rand.unten, opacity: 1 },
    ],
    { duration: aufklappDauer(ziel), easing: AUFKLAPP_KURVE },
  );
  const fertig = () => {
    el.style.overflow = vorher;
  };
  lauf.onfinish = fertig;
  lauf.oncancel = fertig;
}

/** Nur die obersten: Wächst ein Kasten, wächst sein Inhalt ohnehin mit. */
function oberste(els: HTMLElement[]): HTMLElement[] {
  return els.filter((el) => !els.some((a) => a !== el && a.contains(el)));
}

function naheBeiSchalter(schalter: Element, el: HTMLElement): boolean {
  if (el.contains(schalter)) return false;
  let rahmen: Element | null = schalter.parentElement;
  for (let i = 0; i < NAEHE && rahmen; i++) {
    if (rahmen.contains(el)) return true;
    rahmen = rahmen.parentElement;
  }
  return false;
}

export function beiAenderung(eintraege: MutationRecord[]) {
  const schalter: Element[] = [];
  for (const e of eintraege) {
    if (
      e.type === "attributes" &&
      e.attributeName === "aria-expanded" &&
      e.target instanceof Element &&
      e.target.getAttribute("aria-expanded") === "true" &&
      e.oldValue !== "true"
    ) {
      schalter.push(e.target);
    }
  }
  if (schalter.length === 0 || !aufklappenBewegt()) return;

  const neu: HTMLElement[] = [];
  const sichtbarGeworden = new Set<Element>();
  for (const e of eintraege) {
    if (e.type === "childList") {
      e.addedNodes.forEach((n) => {
        if (n instanceof HTMLElement && n.isConnected) neu.push(n);
      });
    } else if (e.type === "attributes" && SICHTBAR_ATTRIBUTE.has(e.attributeName ?? "")) {
      sichtbarGeworden.add(e.target as Element);
    }
  }

  const ziele = new Set<HTMLElement>();
  for (const s of schalter) {
    const ids = (s.getAttribute("aria-controls") ?? "").split(/\s+/).filter(Boolean);
    const bereiche = ids
      .map((id) => document.getElementById(id))
      .filter((b): b is HTMLElement => b instanceof HTMLElement);
    if (bereiche.length > 0) {
      for (const b of bereiche) {
        if (sichtbarGeworden.has(b) || neu.some((n) => n.contains(b))) ziele.add(b);
        else oberste(neu.filter((n) => b.contains(n))).forEach((n) => ziele.add(n));
      }
    } else {
      oberste(neu.filter((n) => naheBeiSchalter(s, n))).forEach((n) => ziele.add(n));
    }
  }
  oberste([...ziele]).forEach(gleite);
}

let beobachter: MutationObserver | null = null;

/** Einmal beim Start (main.tsx). Gibt eine Abschalt-Funktion zurück (Tests). */
export function aufklappBewegungEinschalten(doc: Document = document): () => void {
  if (beobachter || typeof MutationObserver === "undefined") return () => {};
  beobachter = new MutationObserver(beiAenderung);
  beobachter.observe(doc.body ?? doc.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["aria-expanded", "hidden", "class", "style"],
  });
  return () => {
    beobachter?.disconnect();
    beobachter = null;
  };
}
