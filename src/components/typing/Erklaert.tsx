/**
 * Ein BEGRIFF MIT MOUSEOVER-HINWEIS - für alles, was keine Spaltenüberschrift
 * ist: eine Beschriftung im Formular, die grossen Zahlen der Ergebnis-Karte,
 * eine Zeile einer Beschreibungsliste (10.09.2026, Johannes: *„vergiss nicht
 * die mousover infos bei allen bereichen mitzudenken"*).
 *
 * Das Verhalten (sofort, gross, Escape schickt ihn weg, nach oben, wenn unten
 * kein Platz ist) kommt aus `Zeigerhinweis.tsx` - dieselbe Umsetzung wie am
 * `Spaltenkopf`, keine zweite.
 *
 * ⚠️ Kein neuer Tabstopp. Die Begriffe stehen neben Feldern und Zahlen, die
 * selbst erreichbar sind oder gelesen werden; ein Tabstopp je Beschriftung
 * verdoppelte den Weg durch die Seite. Wo ein Hinweis zu einem KNOPF gehört,
 * nimmt man `Tipp` - der erscheint auch beim Fokus.
 *
 * Die gepunktete Unterlinie ist das sichtbare Zeichen, dass hier etwas zu
 * holen ist - Farbe allein wäre keins (WCAG 1.4.1).
 */
import type { ReactNode } from "react";
import { Hinweiskasten, useZeigerhinweis } from "./Zeigerhinweis";

export function Erklaert({
  hilfe,
  children,
  ausrichtung = "links",
}: {
  /** Der Satz, der beim Überfahren erscheint. */
  hilfe: string;
  children: ReactNode;
  /**
   * „rechts" für Begriffe am rechten Rand, wo der Hinweis sonst aus dem Bild
   * liefe. Seit 11.09.2026 nur noch die VORGABE: Beim Überfahren wird gemessen,
   * ob die Seite passt (`seiteMitPlatz` in `Zeigerhinweis.tsx`).
   */
  ausrichtung?: "links" | "rechts";
}) {
  const { id, offen, nachOben, seite, maxBreite, huelle, setZeiger, betreten } =
    useZeigerhinweis(hilfe, ausrichtung);
  return (
    <span
      ref={huelle}
      className="relative inline-flex items-baseline"
      onMouseEnter={betreten}
      onMouseLeave={() => setZeiger(false)}
      aria-describedby={id}
    >
      <span className="underline decoration-dotted underline-offset-4">{children}</span>
      <Hinweiskasten
        id={id}
        offen={offen}
        ausrichtung={seite}
        nachOben={nachOben}
        maxBreite={maxBreite}
        ohneBreiteWennZu
      >
        {hilfe}
      </Hinweiskasten>
    </span>
  );
}
