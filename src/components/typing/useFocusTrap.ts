/**
 * Barrierefreiheit für modale Dialoge von „Tastenflow" (NVDA + Braillezeile +
 * Tastatur). Solange der Dialog offen ist:
 *   • setzt den Fokus beim Öffnen in den Dialog (auf `initialFocus`, sonst das
 *     erste fokussierbare Element),
 *   • hält Tab / Shift+Tab IM Dialog (Fokus-Falle) — man tabbt nicht unbemerkt in
 *     die verdeckte Seite; das gilt seit 31.08.2026 auch, wenn der Fokus auf
 *     einem ANKER ohne Tab-Halt steht (Überschrift mit `tabIndex={-1}`),
 *   • gibt den Fokus beim Schließen optional an das auslösende Element zurück
 *     (`restoreFocus`), statt ihn auf <body> fallen zu lassen.
 *
 * Das Schließen per Escape liegt bewusst NICHT hier (die Seite/der Dialog regelt
 * das je nach gewünschtem Fokusziel selbst). Siehe [[project_zehnfinger_trainer]].
 */
import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  active: boolean,
  ref: React.RefObject<HTMLElement | null>,
  opts: {
    initialFocus?: React.RefObject<HTMLElement | null>;
    restoreFocus?: boolean;
  } = {},
): void {
  // Stabil halten, damit der Effekt nur an `active` hängt (Opener wird genau
  // einmal beim Öffnen gemerkt, nicht bei jedem Render überschrieben).
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    if (!active) return;
    const o = optsRef.current;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusables = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);

    // Anfangs-Fokus in den Dialog.
    const initial = o.initialFocus?.current ?? focusables()[0] ?? null;
    initial?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const root = ref.current;
      if (!root) return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const a = document.activeElement;
      const drin = !!(a && root.contains(a));
      // ⚠️ 31.08.2026 (F1): `idx` statt eines Vergleichs mit `first`. Steht der
      // Fokus auf einem Element, das IM Dialog liegt, aber kein Tabstopp ist
      // (eine Überschrift mit `tabIndex={-1}` — das übliche Fokus-Ziel dieses
      // Projekts), dann ist `idx` gleich -1: Rückwärts-Tab lief bis dahin an
      // der Falle vorbei aus dem Dialog heraus. Vorwärts ist unverändert - dort
      // führt der normale Weg vom Anker zum ersten Tabstopp, also nach INNEN.
      const idx = a instanceof HTMLElement ? items.indexOf(a) : -1;
      if (e.shiftKey) {
        if (!drin || idx <= 0) {
          e.preventDefault();
          last.focus();
        }
      } else if (!drin || idx === items.length - 1) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (o.restoreFocus && opener && document.contains(opener)) opener.focus();
    };
    // Bewusst nur an `active` gekoppelt (siehe optsRef).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
