import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

/** Polite live-region announcer for route changes, timers, answer feedback. */
const AnnounceCtx = createContext<(msg: string, assertive?: boolean) => void>(
  () => {},
);

export function AnnounceProvider({ children }: { children: ReactNode }) {
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");
  const announce = useCallback((msg: string, isAssertive = false) => {
    if (isAssertive) {
      setAssertive("");
      requestAnimationFrame(() => setAssertive(msg));
    } else {
      setPolite("");
      requestAnimationFrame(() => setPolite(msg));
    }
  }, []);
  return (
    <AnnounceCtx.Provider value={announce}>
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {polite}
      </div>
      <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true">
        {assertive}
      </div>
    </AnnounceCtx.Provider>
  );
}

export const useAnnounce = () => useContext(AnnounceCtx);

/**
 * ★ EN8 (19.09.2026): Die Beschriftung lässt sich hereinreichen - die
 * Rechtstexte (`LegalShell`) folgen aus Tastenflow heraus der englischen
 * Bedienung. Ohne Angabe steht dasselbe da wie immer.
 * ⚠️ Nicht über `useBedienSprache` hier drin: `lib/bedienSprache` bindet
 * `useAnnounce` aus DIESER Datei ein - das wäre ein Ring von Importen.
 */
export function SkipLink({ children = "Zum Hauptinhalt springen" }: { children?: ReactNode } = {}) {
  return (
    <a href="#hauptinhalt" className="skip-link">
      {children}
    </a>
  );
}

/**
 * Bei jedem Routenwechsel an den Seitenanfang springen UND den Fokus auf
 * die Seitenüberschrift setzen.
 *
 * Warum der Sprung an den Anfang? Der Data-Router (`createBrowserRouter`)
 * stellt die Scroll-Position NICHT von selbst zurück. Ohne diesen Sprung
 * „erbt" eine neu geöffnete Seite die Scroll-Position der vorigen — auf
 * langen Seiten landet man dann mitten im Inhalt, und die oben sticky
 * angeheftete Kurs-Reiter-Leiste (CourseTabs) ist durch ihr Hide-on-Scroll
 * bereits nach oben weggeschoben. Genau das ließ das Kurs-Menü
 * uneinheitlich wirken: auf kurzen Seiten (z. B. „Bewerten", dessen
 * Tabelle INTERN scrollt, sodass das Fenster kaum scrollt) blieb es
 * sichtbar, auf langen Seiten (Kursinformation) war es „verschwunden" und
 * man musste erst ganz nach oben scrollen. Mit dem Sprung startet JEDE
 * Seite — jede Rolle, jeder Reiter — oben mit sichtbarem Menü.
 *
 * `behavior: "instant"` umgeht das globale `scroll-behavior: smooth`
 * (sonst würde jeder Reiterwechsel sichtbar „hochrauschen"). Der Fokus
 * folgt mit `preventScroll: true`, damit er den Sprung an den Anfang nicht
 * wieder verschiebt — der Screenreader springt trotzdem zur Überschrift.
 */
export function FocusOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    fokusAufSeitentitel();
  }, [pathname]);
  return null;
}

/**
 * Der Fokus-Schritt von `FocusOnRouteChange` für sich - seit 28.09.2026 auch
 * von `lib/seiteNachladen.tsx` gebraucht: Eine nachgeladene Seite hat ihren
 * Titel erst, wenn ihre Datei da ist, und holt den Schritt dann nach.
 */
export function fokusAufSeitentitel() {
  const h = document.getElementById("seitentitel");
  if (h) {
    h.setAttribute("tabindex", "-1");
    h.focus({ preventScroll: true });
  }
}
