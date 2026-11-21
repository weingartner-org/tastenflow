/**
 * ★★★ ALT + PLUS / ALT + MINUS VERGRÖSSERT AUCH DIE STATISTIK (29.10.2026).
 *
 * Wunsch einer Lehrerin: „Schriftgröße bei der Statistik größer (oder
 * anpassbar)". Entscheidung Johannes: Alt + Plus / Minus soll auch in der
 * Statistik wirken (Strg + Plus, der Browser-Zoom, ging ohnehin).
 *
 * ── WAS VORHER WAR ─────────────────────────────────────────────────────────
 * Die Seite nahm Alt + Plus auch in der Statistik an und stellte dann die
 * Übungszeile größer - die dort gar nicht zu sehen ist. Die Taste wirkte also,
 * aber an der falschen Stelle; die Statistik (fast alles `text-sm`, also
 * `rem`) blieb, wie sie war.
 *
 * ── EINE EIGENE STUFE, NICHT DIE DER ÜBUNGSZEILE ───────────────────────────
 * Die Übungszeile geht bis 8-fach (ein Kind mit starkem Sehrest braucht eine
 * Zeile in Handtellergröße). Dieselbe Stufe auf eine Statistik mit Tabellen,
 * Abzeichen und Karten angewandt, wäre unbenutzbar - und umgekehrt soll ein
 * Druck auf Alt + Plus in der Statistik nicht heimlich die Übungszeile
 * verstellen, die man erst beim Zurückkehren sieht. Darum: eigener
 * Speicher-Schlüssel, eigene Leiter - dieselben Stufen wie überall
 * (`ZOOM_STUFEN`, [[feedback_platform_parity]]), aber nur bis 2,5-fach.
 *
 * Kind („Meine Statistik") und Lehrkraft (Klassenstatistik) lesen DIESELBE
 * Stufe: Es ist ein Gerät, eine Person davor, eine gewünschte Schriftgröße.
 *
 * ── WARUM CSS-`zoom` ───────────────────────────────────────────────────────
 * Die Statistik ist in Tailwind-Klassen gesetzt (`text-sm` = `0.875rem`). Ein
 * `fontSize` am Container wirkt auf `rem` nicht. `zoom` skaliert den ganzen
 * Teilbaum samt Abständen, Symbolen, Abzeichen und Tabellen - und lässt den
 * Inhalt neu umbrechen (die Breite in CSS-Pixeln schrumpft mit), sodass
 * Tabellen in ihrem `overflow-auto`-Rahmen waagrecht rollen statt abzuschneiden.
 * Verfügbar in Chromium, Safari und seit Firefox 126.
 */
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { create } from "zustand";
import { ZOOM_STUFEN } from "@/lib/arbeitsblatt/vergroesserung";
import { zoomKeyDirection, istNormalgroesseTaste } from "@/lib/shortcuts";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/** Die Obergrenze der Statistik: 2,5-fach (bei mehr passt eine Tabelle nicht mehr sinnvoll). */
export const STATISTIK_SCHRIFT_MAX = 2.5;

/** Dieselben Stufen wie die Übungszeile, nur bis zur Obergrenze: 1 · 1,25 · 1,5 · 2 · 2,5. */
export const STATISTIK_STUFEN: readonly number[] = ZOOM_STUFEN.filter(
  (z) => z <= STATISTIK_SCHRIFT_MAX,
);

export const STATISTIK_SCHRIFT_KEY = "sensorik:tippen:statistik-schrift";

function leseIndex(): number {
  try {
    const raw = localStorage.getItem(STATISTIK_SCHRIFT_KEY);
    const i = raw === null ? 0 : Number(raw);
    return Number.isInteger(i) && i >= 0 && i < STATISTIK_STUFEN.length ? i : 0;
  } catch {
    return 0; // kein Speicher - dann die normale Größe
  }
}

function merke(i: number): void {
  try {
    localStorage.setItem(STATISTIK_SCHRIFT_KEY, String(i));
  } catch {
    /* Speichern ist optional */
  }
}

interface StatistikSchriftState {
  index: number;
  /** Der Multiplikator (= `STATISTIK_STUFEN[index]`). */
  faktor: number;
  groesser: () => void;
  kleiner: () => void;
  normal: () => void;
}

export const useStatistikSchrift = create<StatistikSchriftState>((set, get) => {
  const setze = (i: number) => {
    const index = Math.max(0, Math.min(i, STATISTIK_STUFEN.length - 1));
    merke(index);
    set({ index, faktor: STATISTIK_STUFEN[index] });
  };
  const start = leseIndex();
  return {
    index: start,
    faktor: STATISTIK_STUFEN[start],
    groesser: () => setze(get().index + 1),
    kleiner: () => setze(get().index - 1),
    normal: () => setze(0),
  };
});

const ANSAGE = texte({
  de: { schrift: (prozent: number) => `Schrift ${prozent} Prozent` },
  en: { schrift: (prozent: number) => `Text size ${prozent} per cent` },
});

/**
 * Was ein Statistik-Bereich braucht: den Stil und das Kennzeichen für sein
 * Wurzel-Element, die Ansage-Zeile - und, solange er auf der Seite steht, die
 * Tasten.
 *
 * Der Horcher hängt am `window` und lebt nur, solange die Statistik da ist.
 * Die Seite lässt Alt + Plus / Minus / 0 in der Statistik bewusst liegen
 * (`TippenTrainerPage`), sonst stellte sie nebenbei die Übungszeile um.
 */
export function useStatistikSchriftTasten(): {
  /** Auf das Wurzel-Element des Statistik-Bereichs. */
  wurzel: { style: CSSProperties; "data-statistik-schrift": string };
  /** Die Ansage-Zeile: ans Ende des Bereichs setzen (unsichtbar, für Sprachausgabe/Braille). */
  ansage: ReactNode;
} {
  const faktor = useStatistikSchrift((s) => s.faktor);
  const { sprache } = useBedienSprache();
  const [geaendert, setGeaendert] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const st = useStatistikSchrift.getState();
      const richtung = zoomKeyDirection(e);
      if (richtung) {
        e.preventDefault();
        if (richtung === "in") st.groesser();
        else st.kleiner();
      } else if (istNormalgroesseTaste(e)) {
        e.preventDefault();
        st.normal();
      } else {
        return;
      }
      setGeaendert(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const t = ANSAGE[sprache];
  return {
    wurzel: {
      // `zoom` als Text, damit der Wert unverändert ankommt. `--statistik-schrift`
      // gibt den Kindern die Stufe weiter (z. B. für Höhen in `vh`, die mitwachsen würden).
      style: { zoom: String(faktor), ["--statistik-schrift" as string]: String(faktor) },
      "data-statistik-schrift": String(faktor),
    },
    ansage: (
      <p role="status" aria-live="polite" className="sr-only" data-statistik-schrift-ansage>
        {geaendert ? t.schrift(Math.round(faktor * 100)) : ""}
      </p>
    ),
  };
}
