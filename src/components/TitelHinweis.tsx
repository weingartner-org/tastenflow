/**
 * DER GROSSE HINWEIS FÜR JEDES `title` DER PLATTFORM.
 * ============================================================================
 *
 * > **Johannes, 30.09.2026:** „mach bei den mouse over einen Effekt wie bei
 * > Google Mail, dass das Fenster von der Mausspitze aufgeht, auch das hilft
 * > dem visuellen Verständnis" - und dann: „natürlich auf der ganzen
 * > Plattform!"
 *
 * Die Lernprogramme zeigen ihre Hinweise über `Tipp` / `Hinweiskasten` (groß,
 * sofort, aus der Mausspitze). Auf der übrigen Plattform stehen aber noch
 * native `title` - gemessen am 30.09.: die Kontrast-Auswahl auf jeder Seite,
 * Hilfe und Melden in den Simulationen, der Start von Klangpunkte, rund 120
 * Dateien insgesamt. Den `title` malt der Browser selbst: nach einer Sekunde,
 * winzig, ohne Zoom, und aufgehen lässt er sich nicht.
 *
 * ★ Statt 120 Dateien umzubauen, übernimmt EINE Stelle an der Wurzel der App
 * jeden `title`, über dem die MAUS steht: Sie zeigt ihn in derselben Gestalt
 * wie `Hinweiskasten` (`HINWEIS_GESTALT`) und nimmt ihn dem Browser weg,
 * solange die Maus darauf steht. Geht sie weg, steht alles wieder wie vorher.
 *
 * ⚠️ NUR DIE MAUS. Tastatur, Screenreader und Finger bekommen nichts anderes
 * als bisher - an ihrem Baum ändert sich nichts, solange keine Maus darüber
 * fährt. Und wenn doch (Kind mit Sehrest, Maus UND Screenreader): Hatte das
 * Element keinen anderen Namen als den `title`, steht er für diese Zeit als
 * `aria-label` da - der Name geht nie verloren.
 *
 * ⚠️ Ändert das Programm den `title`, während die Maus darauf steht („Sounds
 * sind an" → „aus" nach einem Klick), zieht der Hinweis nach
 * (`MutationObserver`) - sonst stünde der alte Satz da und der Browser zeigte
 * den neuen zusätzlich.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HINWEIS_GESTALT,
  HINWEIS_OFFEN,
  HINWEIS_ZU,
  aufgehPunkt,
  ebeneUeber,
  hinweisEbene,
  hoechstBreite,
  horcheZeiger,
  letzterZeiger,
  platziereHinweis,
} from "@/components/typing/Zeigerhinweis";

/** Wo der Browser seinen eigenen Hinweis zeigt oder ein `title` etwas anderes bedeutet. */
const AUSGENOMMEN = new Set(["IFRAME", "HTML", "BODY", "LINK", "STYLE", "META"]);

const MERK = "data-titel";
const MERK_NAME = "data-titel-name";
const MERK_BESCHR = "data-titel-beschreibung";

/** Hat das Element einen Namen ausser dem `title`? Bei Feldern zählt das Label, nicht der Text der Optionen. */
function hatEigenenNamen(el: HTMLElement): boolean {
  if (el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby")) return true;
  const labels = (el as HTMLInputElement).labels;
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    return !!labels && labels.length > 0;
  }
  return (el.textContent ?? "").trim() !== "";
}

function titelTraeger(ziel: EventTarget | null): HTMLElement | null {
  if (!(ziel instanceof Element)) return null;
  const el = ziel.closest(`[title],[${MERK}]`);
  if (!(el instanceof HTMLElement) || AUSGENOMMEN.has(el.tagName)) return null;
  return el;
}

/** Den `title` in die Merk-Stelle legen. Gibt den Text zurück - leer: nichts zu zeigen. */
function nimm(el: HTMLElement): string {
  const text = (el.getAttribute("title") ?? "").trim();
  if (!text) return "";
  el.setAttribute(MERK, el.getAttribute("title") ?? "");
  el.removeAttribute("title");
  if (!hatEigenenNamen(el)) {
    el.setAttribute("aria-label", text);
    el.setAttribute(MERK_NAME, "");
  } else if (!el.hasAttribute("aria-description") && !el.hasAttribute("aria-describedby")) {
    // Mit eigenem Namen war der `title` die Beschreibung - sie bleibt es.
    el.setAttribute("aria-description", text);
    el.setAttribute(MERK_BESCHR, "");
  }
  return text;
}

/** Alles zurück, wie es war. */
function gib(el: HTMLElement): void {
  const titel = el.getAttribute(MERK);
  if (titel !== null && !el.hasAttribute("title")) el.setAttribute("title", titel);
  if (el.hasAttribute(MERK_NAME)) {
    if (el.getAttribute("aria-label") === titel?.trim()) el.removeAttribute("aria-label");
    el.removeAttribute(MERK_NAME);
  }
  if (el.hasAttribute(MERK_BESCHR)) {
    if (el.getAttribute("aria-description") === titel?.trim()) el.removeAttribute("aria-description");
    el.removeAttribute(MERK_BESCHR);
  }
  el.removeAttribute(MERK);
}

export function TitelHinweis() {
  const [text, setText] = useState("");
  const [offen, setOffen] = useState(false);
  const kastenRef = useRef<HTMLSpanElement>(null);
  const ankerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    horcheZeiger();
    let beobachter: MutationObserver | null = null;

    const loese = () => {
      beobachter?.disconnect();
      beobachter = null;
      const el = ankerRef.current;
      ankerRef.current = null;
      if (el) gib(el);
      setOffen(false);
    };

    const ueber = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = titelTraeger(e.target);
      if (el && el === ankerRef.current) return;
      loese();
      if (!el || !el.hasAttribute("title")) return;
      const t = nimm(el);
      if (!t) return;
      ankerRef.current = el;
      setText(t);
      setOffen(true);
      beobachter = new MutationObserver(() => {
        if (!el.hasAttribute("title")) return;
        // Das Programm hat einen neuen Titel gesetzt: übernehmen.
        const neuerTitel = el.getAttribute("title");
        gib(el);
        el.setAttribute("title", neuerTitel ?? "");
        const neu = nimm(el);
        if (neu) setText(neu);
      });
      beobachter.observe(el, { attributes: true, attributeFilter: ["title"] });
    };

    const raus = (e: PointerEvent) => {
      const el = ankerRef.current;
      if (!el) return;
      const nach = e.relatedTarget;
      if (nach instanceof Node && el.contains(nach)) return;
      loese();
    };

    // Wie der Browser mit seinem `title`: Klick, Taste, Rollen - der Hinweis
    // geht weg, erst ein neues Betreten zeigt ihn wieder. ⚠️ Nur VERBERGEN,
    // den `title` behalten, bis die Maus geht: Gäbe man ihn hier zurück, zeigte
    // der Browser eine Sekunde später doch seinen kleinen.
    const weg = () => { if (ankerRef.current) setOffen(false); };

    document.addEventListener("pointerover", ueber, true);
    document.addEventListener("pointerout", raus, true);
    document.addEventListener("pointerdown", weg, true);
    document.addEventListener("keydown", weg, true);
    window.addEventListener("blur", weg);
    window.addEventListener("scroll", weg, { capture: true, passive: true });
    return () => {
      loese();
      document.removeEventListener("pointerover", ueber, true);
      document.removeEventListener("pointerout", raus, true);
      document.removeEventListener("pointerdown", weg, true);
      document.removeEventListener("keydown", weg, true);
      window.removeEventListener("blur", weg);
      window.removeEventListener("scroll", weg, { capture: true });
    };
  }, []);

  // Platz und Aufgeh-Punkt setzen, bevor der Browser malt.
  useLayoutEffect(() => {
    const kasten = kastenRef.current;
    const anker = ankerRef.current;
    if (!offen || !kasten || !anker) return;
    const wurzel = document.documentElement;
    const fenster = {
      breite: wurzel.clientWidth || window.innerWidth,
      hoehe: wurzel.clientHeight || window.innerHeight,
    };
    const remPx = parseFloat(getComputedStyle(wurzel).fontSize) || 16;
    kasten.style.maxWidth = `${hoechstBreite({ fensterBreite: fenster.breite, remPx, maxBreite: null })}px`;
    kasten.style.zIndex = String(ebeneUeber(anker));
    const rechteck = anker.getBoundingClientRect();
    const platz = platziereHinweis({
      anker: rechteck,
      kasten: { breite: kasten.offsetWidth, hoehe: kasten.offsetHeight },
      fenster,
      ausrichtung: "links",
      nachOben: false,
    });
    kasten.style.left = `${platz.links}px`;
    kasten.style.top = `${platz.oben}px`;
    const punkt = aufgehPunkt({ zeiger: letzterZeiger(), anker: rechteck, platz, kastenHoehe: kasten.offsetHeight });
    kasten.style.transformOrigin = `${punkt.x}px ${punkt.y}px`;
  }, [offen, text]);

  const ebene = hinweisEbene();
  // `aria-hidden`: Der Text steht schon am Element (als `title` oder, solange
  // die Maus darauf steht, als `aria-label`) - ein zweites Mal vorlesen
  // brauchte ihn niemand.
  const kasten = (
    <span ref={kastenRef} aria-hidden="true" data-titel-hinweis="" className={HINWEIS_GESTALT + (offen ? HINWEIS_OFFEN : HINWEIS_ZU)}>
      {text}
    </span>
  );
  return ebene ? createPortal(kasten, ebene) : kasten;
}
