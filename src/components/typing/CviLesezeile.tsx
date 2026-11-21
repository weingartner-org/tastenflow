/**
 * ★★★★★ DIE LESEZEILE - genau zwei helle Löcher (Lesezeile + Eingabefeld),
 * der GANZE BILDSCHIRM sonst 80 % verdunkelt (E12, 20.09.2026, mit der
 * Korrektur vom selben Tag - siehe `lib/typing/leseZeile.ts` für Anlass,
 * Zitat und die Rechnung `abdeckRechtecke`). Hier nur das WIE: messen,
 * merken, zeichnen.
 *
 * ── WIE DIE ZEILEN GEMESSEN WERDEN ───────────────────────────────────────────
 * `Range.selectNodeContents(textEl)` + `getClientRects()` liefert die Zeilen
 * des Fliesstexts, so wie der Browser ihn wirklich umgebrochen hat - nicht
 * geraten. Die Rechtecke werden relativ zum umschliessenden Container
 * gemessen (dessen eigenes `getBoundingClientRect()`); `useLeseZeile` liefert
 * sie in dieser Container-relativen Form (unverändert seit dem ersten Bau).
 *
 * ── WIE DIE VERDUNKELUNG GEZEICHNET WIRD ─────────────────────────────────────
 * Die Korrektur von Johannes verlangt den GANZEN Bildschirm, nicht nur die
 * Frage - Kopfzeile, Knöpfe, Fusszeile eingeschlossen. Das geht nur per
 * Portal an `<body>`, `position: fixed`, genau wie `CviAbdunkeln` (siehe dort
 * für die Begründung: ein `fixed`-Element richtet sich sonst nach dem
 * nächsten Vorfahren mit `transform`). `CviLesezeileAbdunkeln` rechnet dafür
 * die Lesezeile UND das Eingabefeld in Bildschirm-Koordinaten um (Container-
 * Rechteck + Zeilen-Offset, bzw. die eigene `getBoundingClientRect()` des
 * Felds) und lässt `abdeckRechtecke` daraus die Abdeck-Rechtecke berechnen.
 *
 * ── WANN NEU GEMESSEN WIRD ───────────────────────────────────────────────────
 * Bei Fenstergrösse, Rollen und alle 400 ms, solange aktiv - dieselbe Idee wie
 * `CviAbdunkeln` („folgt der Karte"): Der Umbruch verschiebt sich bei jeder
 * Änderung der Laufweite, und die reagiert selbst wieder auf Fenstergrösse.
 * Bei einer NEUEN Aufgabe (`zuruecksetzenWenn` ändert sich) beginnt die
 * Lesezeile wieder bei der ERSTEN Zeile - eine neue Frage liest man von vorn.
 *
 * ── BARRIEREFREIHEIT ─────────────────────────────────────────────────────────
 * Rein sichtbar: `aria-hidden`, `pointer-events: none`, kein Fokus, keine
 * Live-Region, keine Stimme, kein `preventDefault`. Die Messung selbst rührt
 * das `<p>` nicht an (ein `<div>` darf ohnehin kein Kind eines `<p>` sein) -
 * der zugängliche Text der Frage bleibt Zeichen für Zeichen derselbe.
 */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  abdeckRechtecke,
  CVI_VERDUNKELUNG,
  LESEZEILE_LUFT,
  mitLuft,
  naechsteZeile,
  vorherigeZeile,
  zeilenAusRechtecken,
  zeilenIndexKlemmen,
  type LesezeileRechteck,
} from "@/lib/typing/leseZeile";

/** Rechtecke Wert für Wert gleich? Vermeidet unnötige Re-Renders beim Poll. */
function gleicheZeilen(
  a: readonly LesezeileRechteck[],
  b: readonly LesezeileRechteck[],
): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (r, i) => r.x === b[i].x && r.y === b[i].y && r.w === b[i].w && r.h === b[i].h,
  );
}

/** Die Zeilen des Textknotens, relativ zum Container gemessen. */
function missZeilen(containerEl: HTMLElement, textEl: HTMLElement): LesezeileRechteck[] {
  if (typeof document === "undefined") return [];
  const bereich = document.createRange();
  bereich.selectNodeContents(textEl);
  // ⚠️ jsdom kennt `Range.getClientRects` gar nicht erst (kein Layout) -
  // ohne diese Prüfung würfe JEDER Testlauf mit CVI an einer TypeError.
  if (typeof bereich.getClientRects !== "function") return [];
  const containerRect = containerEl.getBoundingClientRect();
  const liste = bereich.getClientRects();
  const rechtecke: LesezeileRechteck[] = [];
  for (let i = 0; i < liste.length; i++) {
    const r = liste[i];
    rechtecke.push({
      x: r.x - containerRect.x,
      y: r.y - containerRect.y,
      w: r.width,
      h: r.height,
    });
  }
  return zeilenAusRechtecken(rechtecke);
}

export interface LeseZeileStand {
  /** Die ermittelten Zeilen, relativ zum Container. */
  zeilen: readonly LesezeileRechteck[];
  /** Gilt die Lesezeile hier überhaupt (aktiv UND wirklich mehr als eine Zeile)? */
  mehrzeilig: boolean;
  /** Index der aktuell HELLEN Zeile. */
  zeile: number;
  /** Pfeil ab. */
  naechste: () => void;
  /** Pfeil auf. */
  vorherige: () => void;
}

/**
 * Misst die Zeilen eines Textes und hält fest, welche gerade „die Lesezeile"
 * ist. Reagiert nur, solange `aktiv` gilt (Zeichenabstand > 1) - ohne CVI wird
 * gar nicht erst gemessen.
 */
export function useLeseZeile({
  aktiv,
  containerRef,
  textRef,
  zuruecksetzenWenn,
}: {
  aktiv: boolean;
  /** Umschliesst `textRef` mit `position: relative` - der Nullpunkt der Kästchen. */
  containerRef: RefObject<HTMLElement | null>;
  /** Der Text, dessen Zeilen ermittelt werden. */
  textRef: RefObject<HTMLElement | null>;
  /** Ändert sich dieser Wert (neue Aufgabe), beginnt die Lesezeile wieder bei Zeile 1. */
  zuruecksetzenWenn: unknown;
}): LeseZeileStand {
  const [zeilen, setZeilen] = useState<LesezeileRechteck[]>([]);
  const [zeile, setZeile] = useState(0);

  const messen = useCallback(() => {
    const c = containerRef.current;
    const t = textRef.current;
    if (!c || !t) {
      setZeilen((alt) => (alt.length ? [] : alt));
      return;
    }
    const neu = missZeilen(c, t);
    setZeilen((alt) => (gleicheZeilen(alt, neu) ? alt : neu));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, textRef]);

  // Neue Aufgabe (oder CVI geht gerade an) - wieder von der ersten Zeile an.
  useLayoutEffect(() => {
    setZeile(0);
    if (aktiv) messen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zuruecksetzenWenn, aktiv]);

  // Fenstergrösse, Rollen, wachsende/schrumpfende Laufweite - dieselbe Idee
  // wie `CviAbdunkeln` (alle 400 ms, solange aktiv).
  useEffect(() => {
    if (!aktiv) return;
    messen();
    window.addEventListener("resize", messen);
    window.addEventListener("scroll", messen, true);
    const t = window.setInterval(messen, 400);
    return () => {
      window.removeEventListener("resize", messen);
      window.removeEventListener("scroll", messen, true);
      window.clearInterval(t);
    };
  }, [aktiv, messen]);

  // Weniger Zeilen als vorher (z. B. Fenster wieder breiter) - den Index einfangen.
  useEffect(() => {
    setZeile((i) => zeilenIndexKlemmen(i, zeilen.length));
  }, [zeilen.length]);

  return {
    zeilen,
    mehrzeilig: aktiv && zeilen.length > 1,
    zeile,
    naechste: useCallback(
      () => setZeile((i) => naechsteZeile(i, zeilen.length)),
      [zeilen.length],
    ),
    vorherige: useCallback(() => setZeile((i) => vorherigeZeile(i)), []),
  };
}

/** Ein Rechteck mit messbarer Fläche (kein leeres jsdom-Nullmass). */
function hatFlaeche(r: { width: number; height: number } | undefined | null): r is DOMRect {
  return !!r && r.width >= 1 && r.height >= 1;
}

/**
 * ★★★★★ DIE KORREKTUR VOM 20.09.2026: Verdunkelt wird der GANZE Bildschirm,
 * hell bleiben genau zwei Löcher - die Lesezeile und das Eingabefeld (siehe
 * Dateikopf und `lib/typing/leseZeile.ts` für Johannes' Zitat und die
 * Rechnung). Ersetzt die frühere Fassung, die nur die ANDEREN ZEILEN der
 * Frage verdunkelte (ein eigenes Kästchen je Zeile, im Container der Frage).
 *
 * ★ Punkt 7 (Lesezeile UND `CviAbdunkeln` hängen am selben Faktor
 * `zeichenabstand > 1`): Solange die Lesezeile gilt (mehrzeilige Frage), ist
 * SIE die einzige Verdunkelung - `RaetselLauf` schaltet `CviAbdunkeln` in
 * diesem Fall aus (`aktiv={... && !lesezeile.mehrzeilig}`). Liefen beide
 * gleichzeitig, würde der Bereich ausserhalb der Übungskarte ZWEIMAL
 * verdunkelt (80 % über 80 % = 96 % - merklich dunkler als beabsichtigt).
 * Die Lesezeile deckt denselben Bereich ohnehin ab (das Eingabefeld ist eines
 * ihrer beiden Löcher), es geht also nichts verloren.
 */
export function CviLesezeileAbdunkeln({
  aktiv,
  containerRef,
  zeilen,
  zeile,
  feldRef,
  ebene = 40,
}: {
  /** `lesezeile.mehrzeilig` - nur dann gibt es diese Verdunkelung überhaupt. */
  aktiv: boolean;
  /** Umschliesst die Frage - liefert den Bildschirm-Nullpunkt der Zeilen-Rechtecke. */
  containerRef: RefObject<HTMLElement | null>;
  /** Die Zeilen der Frage, Container-relativ (aus `useLeseZeile`). */
  zeilen: readonly LesezeileRechteck[];
  /** Index der aktuell hellen Zeile. */
  zeile: number;
  /** Das Eingabefeld („Deine Antwort") - bleibt als zweites Loch hell. */
  feldRef: RefObject<HTMLElement | null>;
  /** `z-index` der Schicht - dieselbe Vorgabe wie `CviAbdunkeln`. */
  ebene?: number;
}) {
  const [rechtecke, setRechtecke] = useState<LesezeileRechteck[]>([]);

  // ── Messen: Lesezeile + Eingabefeld in Bildschirm-Koordinaten, daraus die
  // Abdeck-Rechtecke - bei Fenstergrösse, Rollen und alle 400 ms, solange
  // aktiv (dieselbe Kadenz wie `CviAbdunkeln`). `useLayoutEffect`, damit das
  // ERSTE Bild schon die richtigen Rechtecke zeigt, nicht einen Takt später.
  useLayoutEffect(() => {
    if (!aktiv) {
      setRechtecke([]);
      return;
    }
    const messen = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const zeileRel = zeilen[zeile];
      const feldRect = feldRef.current?.getBoundingClientRect();
      const loecher: LesezeileRechteck[] = [];
      if (containerRect && zeileRel) {
        loecher.push(
          mitLuft(
            {
              x: containerRect.x + zeileRel.x,
              y: containerRect.y + zeileRel.y,
              w: zeileRel.w,
              h: zeileRel.h,
            },
            LESEZEILE_LUFT,
          ),
        );
      }
      if (hatFlaeche(feldRect)) {
        loecher.push(
          mitLuft({ x: feldRect.x, y: feldRect.y, w: feldRect.width, h: feldRect.height }, LESEZEILE_LUFT),
        );
      }
      setRechtecke(abdeckRechtecke(loecher, { w: window.innerWidth, h: window.innerHeight }));
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
  }, [aktiv, containerRef, feldRef, zeilen, zeile]);

  if (!aktiv || rechtecke.length === 0 || typeof document === "undefined") return null;
  return createPortal(
    <>
      {rechtecke.map((r, i) => (
        <div
          key={i}
          aria-hidden="true"
          data-lesezeile-verdunkelt=""
          className="pointer-events-none fixed"
          style={{
            zIndex: ebene,
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            background: `rgba(8, 10, 16, ${CVI_VERDUNKELUNG})`,
          }}
        />
      ))}
    </>,
    document.body,
  );
}
