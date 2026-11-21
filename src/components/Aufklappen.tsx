/**
 * Aufklappen - ein Bereich, der sich SICHTBAR öffnet und schließt.
 *
 * Johannes 19.09.2026: „es ist für das Auge eine Herausforderung, wenn man
 * auf einen Schalter drückt und oben wird ein neuer Bereich eingeblendet und
 * unten steht immer noch alles von vorher - man weiß nicht, wie groß der
 * neue Bereich ist. Eine Animation würde hier helfen: der Rest rutscht nach
 * unten und der andere kommt nach."
 *
 * Darum wächst der Bereich beim Öffnen von 0 auf seine Höhe, und alles
 * darunter gleitet in derselben Bewegung mit nach unten. Beim Schließen
 * schrumpft er, und der Rest rückt nach. Das Auge kann dem Schalter und dem
 * Inhalt darunter folgen, statt sie neu suchen zu müssen.
 *
 * Gebrauch: `<Aufklappen offen={offen}>…Bereich…</Aufklappen>` STATT
 * `{offen && …Bereich…}`. Zugeklappt steht NICHTS im DOM - genau wie vorher;
 * `aria-controls`, Fokus-Ziele und Tests sehen denselben Baum.
 *
 * Regeln, die hier stecken:
 * - **Keine Bewegung bei „weniger Bewegung"** (`prefers-reduced-motion`) und
 *   dort, wo der Browser keine Web-Animation kann (jsdom in den Tests):
 *   dann auf/zu sofort, wie bisher.
 * - **Beim Schließen ist der Bereich schon weg, bevor er verschwindet:**
 *   `inert` und `aria-hidden` - Tabtaste und Screenreader erreichen nichts
 *   mehr darin, nur das Auge sieht ihn noch schrumpfen.
 * - **`overflow: clip`, nicht `hidden`:** Ein Fokus im wachsenden Bereich
 *   (manche Bereiche setzen ihn beim Öffnen selbst) würde einen
 *   `hidden`-Kasten in sich verschieben - der Inhalt stünde versetzt da.
 *   `clip` kann nicht rollen.
 * - Der Kasten selbst trägt keine Gestalt (kein Rand, kein Innenabstand):
 *   Die bringt der Inhalt mit. Nur sein Außenabstand (etwa aus `space-y-*`
 *   der Eltern) wächst mit, sonst spränge er am Anfang.
 */
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Wie lange die Bewegung dauert: kurze Bereiche schnell, lange ruhiger. */
export function aufklappDauer(hoehe: number): number {
  return Math.round(Math.min(450, 200 + hoehe * 0.25));
}

/** Ruhig auslaufend - der Bereich kommt schnell und setzt weich auf. */
export const AUFKLAPP_KURVE = "cubic-bezier(0.2, 0, 0, 1)";

export function aufklappenBewegt(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof HTMLElement.prototype.animate !== "function") return false;
  try {
    return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

/**
 * Der Zeilenabstand der Eltern (`flex-col gap-4`, einspaltiges Grid), den
 * der Kasten schon bei Höhe 0 mitbringt - sonst spränge der Rest am Anfang
 * und am Ende um genau diesen Abstand (gemessen 19.09.: 16 px im
 * Tastenflow-Reiter). Zugeklappt zieht ein negativer Außenabstand ihn ab.
 */
export function elternAbstand(el: HTMLElement): number {
  const eltern = el.parentElement;
  if (!eltern) return 0;
  const stil = getComputedStyle(eltern);
  const spalte =
    (stil.display.includes("flex") && stil.flexDirection.startsWith("column")) ||
    (stil.display.includes("grid") && stil.gridTemplateColumns.trim().split(/\s+/).length === 1);
  if (!spalte) return 0;
  const nachbar = Array.from(eltern.children).some(
    (k) => k !== el && k.getClientRects().length > 0,
  );
  if (!nachbar) return 0;
  return parseFloat(stil.rowGap) || 0;
}

type Phase = "zu" | "offen" | "schliesst";

type Inhalt = ReactNode | ((verborgen: boolean) => ReactNode);

export function Aufklappen({
  offen,
  children,
  id,
  huelle,
  bleibt = false,
}: {
  offen: boolean;
  /**
   * Der Bereich. Als Funktion bekommt er `verborgen` - wahr erst, wenn er
   * GANZ zu ist (nach dem Schrumpfen), damit ein eigenes `hidden` am
   * Bereich nicht vor der Bewegung zuschlägt.
   */
  children: Inhalt;
  /** Für `aria-controls` am Schalter - sitzt am wachsenden Kasten. */
  id?: string;
  /**
   * Was um den wachsenden Kasten herum steht und mit ihm kommt und geht -
   * etwa die Tabellenzeile einer ausgeklappten Schülerzeile:
   * `huelle={(k) => <tr><td colSpan={9}>{k}</td></tr>}`. Eine `<tr>`
   * selbst lässt sich nicht in der Höhe bewegen, ein Kasten in ihrer Zelle
   * schon.
   */
  huelle?: (kasten: ReactNode) => ReactNode;
  /**
   * Zugeklappt bleibt der Inhalt im Baum (der Kasten trägt dann `hidden`) -
   * für Formulare, die ihren Stand über das Zuklappen hinweg behalten.
   */
  bleibt?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>(offen ? "offen" : "zu");
  const kastenRef = useRef<HTMLDivElement>(null);
  const laufRef = useRef<Animation | null>(null);
  /** Die fertige Schließ-Bewegung hält Höhe 0 fest, bis `hidden` greift. */
  const schlussRef = useRef<Animation | null>(null);
  /**
   * Die Phase, für die zuletzt bewegt wurde. Beim ersten Zeichnen `null`:
   * Wer schon offen auf die Seite kommt, klappt nicht auf. Hält auch den
   * doppelten Effekt-Lauf von StrictMode ab.
   */
  const bewegtFuer = useRef<Phase | null>(null);
  /** Beim Schließen zeigt der Kasten weiter, was zuletzt offen darin stand. */
  const zuletztRef = useRef<Inhalt>(children);
  if (offen) zuletztRef.current = children;

  // Phase aus `offen` ableiten - noch vor dem Zeichnen, damit nichts flackert.
  if (offen && phase !== "offen") setPhase("offen");
  if (!offen && phase === "offen") setPhase(aufklappenBewegt() ? "schliesst" : "zu");

  useLayoutEffect(() => {
    const el = kastenRef.current;
    const alt = bewegtFuer.current;
    bewegtFuer.current = phase;
    // Erst jetzt steht `hidden` im Baum - die gehaltene Höhe 0 darf los.
    if (phase !== "schliesst") {
      schlussRef.current?.cancel();
      schlussRef.current = null;
    }
    if (!el || alt === phase) return;
    if (phase !== "schliesst") {
      el.removeAttribute("inert");
      el.removeAttribute("aria-hidden");
    }
    if (phase === "zu") return;
    if (alt === null && phase === "offen") return;
    if (!aufklappenBewegt()) {
      if (phase === "schliesst") setPhase("zu");
      return;
    }

    // Läuft noch eine Bewegung, geht die neue von der JETZIGEN Höhe aus.
    const vorher = laufRef.current;
    const von = vorher ? el.getBoundingClientRect().height : phase === "offen" ? 0 : null;
    const vonDeckkraft = vorher ? Number(getComputedStyle(el).opacity || 1) : null;
    vorher?.cancel();
    laufRef.current = null;

    const stil = getComputedStyle(el);
    const rand = { oben: stil.marginTop, unten: stil.marginBottom };
    const obenZu = `${-elternAbstand(el)}px`;
    el.style.overflow = "clip";

    if (phase === "offen") {
      const ziel = el.getBoundingClientRect().height;
      const start = von ?? 0;
      const lauf = el.animate(
        [
          {
            height: `${start}px`,
            marginTop: start === 0 ? obenZu : rand.oben,
            marginBottom: start === 0 ? "0px" : rand.unten,
            opacity: vonDeckkraft ?? (start === 0 ? 0 : 1),
          },
          { height: `${ziel}px`, marginTop: rand.oben, marginBottom: rand.unten, opacity: 1 },
        ],
        { duration: aufklappDauer(Math.abs(ziel - start)), easing: AUFKLAPP_KURVE },
      );
      laufRef.current = lauf;
      lauf.onfinish = () => {
        if (laufRef.current !== lauf) return;
        laufRef.current = null;
        el.style.overflow = "";
      };
      return;
    }

    el.setAttribute("inert", "");
    el.setAttribute("aria-hidden", "true");
    const start = von ?? el.getBoundingClientRect().height;
    const lauf = el.animate(
      [
        {
          height: `${start}px`,
          marginTop: rand.oben,
          marginBottom: rand.unten,
          opacity: vonDeckkraft ?? 1,
        },
        { height: "0px", marginTop: obenZu, marginBottom: "0px", opacity: 0 },
      ],
      {
        duration: Math.round(aufklappDauer(start) * 0.8),
        easing: AUFKLAPP_KURVE,
        fill: "forwards",
      },
    );
    laufRef.current = lauf;
    lauf.onfinish = () => {
      if (laufRef.current !== lauf) return;
      laufRef.current = null;
      schlussRef.current = lauf;
      el.style.overflow = "";
      setPhase("zu");
    };
  }, [phase]);

  useLayoutEffect(
    () => () => {
      laufRef.current?.cancel();
      laufRef.current = null;
      schlussRef.current?.cancel();
      schlussRef.current = null;
    },
    [],
  );

  if (phase === "zu" && !bleibt) return null;
  const verborgen = phase === "zu";
  const inhalt = bleibt || phase === "offen" ? children : zuletztRef.current;
  const kasten = (
    <div
      ref={kastenRef}
      id={id}
      hidden={verborgen || undefined}
      data-aufklappen={phase}
      style={{ display: verborgen ? undefined : "flow-root" }}
    >
      {typeof inhalt === "function" ? inhalt(verborgen) : inhalt}
    </div>
  );
  return <>{huelle ? huelle(kasten) : kasten}</>;
}
