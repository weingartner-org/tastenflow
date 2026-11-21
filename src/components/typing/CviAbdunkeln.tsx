/**
 * ★★★ BEIM SCHREIBEN IST NUR DIE ÜBUNGSZEILE HELL (L7, 19.09.2026) - ein Teil
 * von „Zeichenabstand groß (CVI)".
 * ============================================================================
 *
 * Johannes, 19.09.2026, wörtlich: *„wir brauchen für die CVI-Einstellung noch
 * ein weiteres Feature: beim Schreiben soll nur das Eingabefeld hell erleuchtet
 * sein, alles andere soll verdunkeln (so wie beim Einführungsbildschirm bei
 * ‚Mit anderen Augen sehen'), nach 5 Sek. nicht tippen wird wieder alles
 * hell"*.
 *
 * Kinder mit zerebraler Sehbehinderung (CVI) verlieren die Zeile leicht in
 * einer vollen Seite (visuelles Gedränge). Solange getippt wird, tritt darum
 * alles ausser der Übungskarte zurück; wer innehält, bekommt die ganze Seite
 * wieder zu sehen.
 *
 * ── WANN ────────────────────────────────────────────────────────────────────
 *  · Nur, wenn der Zeichenabstand über 1 steht (doppelt/dreifach/vierfach) -
 *    DERSELBE Wert, den `TypingSession` schon für die Laufweite bekommt. Keine
 *    eigene Einstellung, kein eigenes Feld am Server.
 *  · Bei jedem Anschlag IN der Übungszeile (ein Zeichen, die Rücktaste, eine
 *    Totaste) wird dunkel, und die Uhr für „wieder hell" beginnt neu:
 *    {@link CVI_HELL_NACH_MS} ohne Anschlag, dann wird es wieder hell.
 *  · Nie, solange ein Fenster offen ist (`[role="dialog"][aria-modal="true"]`),
 *    und nie während des Rundgangs (`[data-einfuehrung]`, Z4) - geht eines
 *    davon auf, wird es SOFORT wieder hell.
 *
 * ── WAS ES NICHT TUT ────────────────────────────────────────────────────────
 * Es ist REIN SICHTBAR: `aria-hidden`, `pointer-events: none`, kein Fokus,
 * kein Live-Bereich, keine Stimme. Es hört mit, fängt aber nichts ab - kein
 * `preventDefault`, kein `stopPropagation`: Jeder Anschlag kommt beim
 * Übungsfeld an, als gäbe es diese Datei nicht. Eine Sprachausgabe und eine
 * Braillezeile merken davon nichts (sie sollen es auch nicht: für sie ändert
 * sich an der Seite nichts).
 *
 * ── WIE ─────────────────────────────────────────────────────────────────────
 * Dieselbe Bauart wie der Leuchtrahmen der Einführung (`SimEinfuehrung.tsx`):
 * EIN Element über der Karte, dessen riesiger Schlagschatten alles ausserhalb
 * abdunkelt. Es folgt der Karte (Fenstergrösse, Rollen, alle 400 ms).
 * Ein- und Ausblenden in 300 ms - ohne, wer „Bewegung reduzieren" eingestellt
 * hat. Im Windows-Kontrastmodus nimmt der Browser den Schatten weg; dann
 * bleibt die Seite eben hell - gezeichnet wird dort sonst nichts.
 *
 * Es hängt per Portal an `<body>`: Ein `fixed`-Element richtet sich sonst
 * nach dem nächsten Vorfahren mit `transform`, und die Übungszeile verschiebt
 * sich beim Tippen genau so.
 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { CVI_VERDUNKELUNG } from "@/lib/typing/leseZeile";

/** Nach so vielen Millisekunden ohne Anschlag wird wieder alles hell. */
export const CVI_HELL_NACH_MS = 5000;

/** Was „abgedunkelt nicht erlaubt" bedeutet: ein Fenster oder der Rundgang. */
const VORRANG = '[role="dialog"][aria-modal="true"], [data-einfuehrung]';

/**
 * ★ 19.09.2026 („überall", auch in den Spielen): Ein Fenster, in dem die helle
 * Fläche SELBST liegt, hat keinen Vorrang - es ist der Ort, an dem geschrieben
 * wird, keine Unterbrechung. So ist die Bühne der Polar-Expedition gebaut
 * (Vollbild, `role="dialog" aria-modal`); ihr Spielfeld soll beim Tippen hell
 * bleiben wie die Übungskarte. Jedes ANDERE Fenster (auch eines, das sich in
 * der Bühne öffnet) macht es weiter sofort hell.
 */
function etwasHatVorrang(ziel: HTMLElement | null): boolean {
  if (typeof document === "undefined") return false;
  for (const el of document.querySelectorAll(VORRANG)) {
    if (!ziel || !el.contains(ziel)) return true;
  }
  return false;
}

/** Zählt dieser Anschlag als Schreiben? (Kein Kürzel, keine Steuertaste.) */
function istSchreibAnschlag(e: KeyboardEvent): boolean {
  if (e.altKey || e.ctrlKey || e.metaKey) return false;
  return e.key.length === 1 || e.key === "Backspace" || e.key === "Dead";
}

type Kasten = { x: number; y: number; w: number; h: number };

/**
 * Luft um die Karte: Ihr Fokusring (4 px, `focus-within:ring-4`) liegt
 * AUSSERHALB ihres Rands und soll hell bleiben - dieselbe Luft wie beim
 * Leuchtrahmen der Einführung (6 px).
 */
const LUFT = 6;

function kastenVon(el: HTMLElement | null): Kasten | null {
  const r = el?.getBoundingClientRect();
  if (!r || r.width < 1 || r.height < 1) return null;
  return { x: r.x, y: r.y, w: r.width, h: r.height };
}

function bewegungReduziert(): boolean {
  try {
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function CviAbdunkeln({
  aktiv,
  zielRef,
  ebene = 40,
}: {
  /** Zeichenabstand über 1 - nur dann gibt es das Abdunkeln überhaupt. */
  aktiv: boolean;
  /** Die Übungskarte (Zeile + Eingabefeld) - sie bleibt hell. */
  zielRef: RefObject<HTMLElement | null>;
  /**
   * `z-index` der Schicht. 40 über einer Seite; die Bühne der Polar-Expedition
   * liegt selbst auf 80 - dort muss die Schicht darüber liegen, sonst dunkelt
   * sie nichts ab (19.09.2026).
   */
  ebene?: number;
}) {
  const [dunkel, setDunkel] = useState(false);
  /** Ohne Übergang zurück (ein Fenster ging auf) - „sofort", nicht „sanft". */
  const [sofort, setSofort] = useState(false);
  const [kasten, setKasten] = useState<Kasten | null>(null);
  const hellZeitgeber = useRef<number | undefined>(undefined);

  // ── Mithören: jeder Schreib-Anschlag in der Übungskarte ──────────────────
  useEffect(() => {
    if (!aktiv) {
      window.clearTimeout(hellZeitgeber.current);
      setDunkel(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      const ziel = zielRef.current;
      if (!ziel || !(e.target instanceof Node) || !ziel.contains(e.target)) return;
      if (!istSchreibAnschlag(e) || etwasHatVorrang(ziel)) return;
      // Gleich messen: Das Element erscheint mit dem ersten Bild schon an
      // der richtigen Stelle, nicht einen Takt später.
      const k = kastenVon(ziel);
      if (k) setKasten(k);
      setSofort(false);
      setDunkel(true);
      window.clearTimeout(hellZeitgeber.current);
      hellZeitgeber.current = window.setTimeout(() => setDunkel(false), CVI_HELL_NACH_MS);
    };
    // Erfassungsphase, damit der Anschlag auch dann zählt, wenn ein Horcher
    // der Seite ihn später anhält - hier wird nur mitgehört, nie abgefangen.
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      window.clearTimeout(hellZeitgeber.current);
    };
  }, [aktiv, zielRef]);

  // ── Ein Fenster oder der Rundgang geht auf ⇒ sofort hell ────────────────
  useEffect(() => {
    if (!dunkel) return;
    const pruefe = () => {
      if (!etwasHatVorrang(zielRef.current)) return;
      window.clearTimeout(hellZeitgeber.current);
      setSofort(true);
      setDunkel(false);
    };
    pruefe();
    const beobachter = new MutationObserver(pruefe);
    beobachter.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["role", "aria-modal"],
    });
    return () => beobachter.disconnect();
  }, [dunkel, zielRef]);

  // ── Der Karte folgen (Fenstergrösse, Rollen, umbrechende Leisten) ───────
  useEffect(() => {
    if (!dunkel) return;
    const messen = () => {
      const k = kastenVon(zielRef.current);
      setKasten((alt) =>
        alt && k && alt.x === k.x && alt.y === k.y && alt.w === k.w && alt.h === k.h ? alt : k,
      );
    };
    messen();
    window.addEventListener("resize", messen);
    window.addEventListener("scroll", messen, true);
    const t = window.setInterval(messen, 400);
    return () => {
      window.removeEventListener("resize", messen);
      window.removeEventListener("scroll", messen, true);
      window.clearInterval(t);
    };
  }, [dunkel, zielRef]);

  // Das ERSTE Erscheinen blendet ein (danach bleibt das Element stehen und
  // wechselt nur seine Deckkraft - dafür reicht der Übergang unten). Ein
  // eben eingehängtes Element kennt keinen Vorher-Wert, von dem ein
  // Übergang ausgehen könnte; darum hier die Animations-Schnittstelle.
  const elRef = useRef<HTMLDivElement>(null);
  const eingeblendet = useRef(false);
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) {
      eingeblendet.current = false;
      return;
    }
    if (!dunkel || eingeblendet.current) return;
    eingeblendet.current = true;
    if (!bewegungReduziert() && typeof el.animate === "function")
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" });
  }, [dunkel, kasten, aktiv]);

  if (!aktiv || !kasten || typeof document === "undefined") return null;
  return createPortal(
    <div
      ref={elRef}
      aria-hidden="true"
      data-cvi-abdunkeln={dunkel ? "an" : "aus"}
      className={
        "pointer-events-none fixed motion-reduce:transition-none " +
        (sofort ? "" : "transition-opacity duration-300")
      }
      style={{
        zIndex: ebene,
        left: kasten.x - LUFT,
        top: kasten.y - LUFT,
        width: kasten.w + 2 * LUFT,
        height: kasten.h + 2 * LUFT,
        borderRadius: 16 + LUFT,
        opacity: dunkel ? 1 : 0,
        // ★ 19.09.2026, Johannes: „verdunkle die Umgebung noch etwas
        // stärker" - 0.8 statt 0.66. Die Zahl steht seit 20.09.2026 EINMAL in
        // `CVI_VERDUNKELUNG` (auch die Lesezeile benutzt sie).
        boxShadow: `0 0 0 9999px rgba(8, 10, 16, ${CVI_VERDUNKELUNG})`,
      }}
    />,
    document.body,
  );
}
