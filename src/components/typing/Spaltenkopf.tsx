/**
 * ════════════════════════════════════════════════════════════════════════════
 * DER SPALTENKOPF MIT ERKLÄRUNG (01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„der ganze text oben ist viel zu viel … nur mouse over bei der
 * spaltenüberschrift"* - und zuvor: *„die mouse over - groß und schnell bei den
 * spaltenüberschriften funktionieren noch nicht."*
 *
 * ⚠️ Das VERHALTEN des Hinweises (sofort, groß, Escape schickt ihn weg, kein
 * neuer Tabstopp, `aria-describedby` für die Braillezeile) steht seit dem
 * 01.09.2026 in `Zeigerhinweis.tsx` - dort auch die gemessenen Begründungen.
 * Es wird von den Veränderungs-Pfeilen der Tabelle mitbenutzt; zwei Umsetzungen
 * nebeneinander wären genau die Doppelung, die auf dieser Seite nichts zu
 * suchen hat.
 */
import { useRef, type FocusEvent, type ReactNode } from "react";
import { Hinweiskasten, fokusIstSichtbar, useZeigerhinweis } from "./Zeigerhinweis";

/** Wonach und in welche Richtung sortiert wird. */
export type Sortierung = { spalte: string; ab: boolean } | null;

/** Das Zeichen der Sortierrichtung - „ab" heisst grösster Wert zuerst. */
const SORTPFEIL = { ab: "▼", auf: "▲" } as const;

export function Spaltenkopf({
  children,
  hilfe,
  ausrichtung = "links",
  className = "",
  scope = "col",
  colSpan,
  sortSchluessel,
  sortierung,
  onSortieren,
  schlank = false,
  nurSprachausgabe = false,
}: {
  /** Die sichtbare Überschrift. */
  children: ReactNode;
  /** Der Satz, der beim Überfahren erscheint. Ohne ihn ist es ein normaler Kopf. */
  hilfe?: string;
  /**
   * Wo der Hinweis andockt. „links" (Vorgabe) läuft nach rechts über - richtig
   * für alles ausser der letzten Spalte. „rechts" für die Spalten am rechten
   * Rand, wo ein linksbündiger Hinweis aus dem Bild liefe.
   */
  ausrichtung?: "links" | "rechts";
  className?: string;
  /**
   * ★ B2 (11.09.2026): `colgroup` für die Gruppen-Überschrift „Üben" über drei
   * Spalten. Eine Sprachausgabe kündigt sie damit vor der Spaltenüberschrift
   * an - die Gruppe trägt also auch dort, wo die Tönung nichts sagt
   * (Windows-Kontrastmodus, Braillezeile).
   */
  scope?: "col" | "row" | "colgroup";
  /** Über wie viele Spalten der Kopf steht. Gehört zu `scope="colgroup"`. */
  colSpan?: number;
  /**
   * ★★ SORTIEREN (Johannes, 01.09.2026): *„alle Tabellenüberschriften können
   * angeklickt werden um nach dieser Spalte zu sortieren."*
   *
   * Fehlt der Schlüssel, ist der Kopf wie bisher nur eine Überschrift - kein
   * Tabstopp, kein Knopf. Das ist wichtig für die Knopfspalte, die gar keinen
   * Inhalt zum Sortieren hat.
   */
  sortSchluessel?: string;
  sortierung?: Sortierung;
  onSortieren?: (schluessel: string) => void;
  /**
   * ★★ T1 (19.09.2026): der SCHLANKE Kopf der Klassentabelle in „Meine
   * Klassen" (Johannes zum Entwurf: *„die Tabelle in deinem Entwurfsvorschlag
   * ist viel schlanker und schöner … aber nach Spalten muss ich trotzdem
   * sortieren können"*). Schlichte Beschriftung OHNE gepunktete Unterlinie.
   *
   * ⚠️ Damit fällt das einzige SICHTBARE Zeichen weg, dass hier ein Hinweis
   * wartet. Er bleibt trotzdem auffindbar: Er öffnet sich weiter beim Zeigen
   * UND zusätzlich, sobald der Sortier-Schalter per Tastatur den Fokus
   * bekommt (`:focus-visible` - nicht nach einem Mausklick, sonst bliebe
   * der Kasten nach dem Sortieren stehen und deckte die Zeilen zu). Escape
   * schickt ihn weg wie immer.
   *
   * Ohne `schlank` bleibt alles wie bisher - der Baustein gehört auch
   * Punktgenau, der Admin-Statistik und den Tippchallenge-Tabellen.
   */
  schlank?: boolean;
  /**
   * ★ T1: Ein Kopf NUR für die Sprachausgabe - die unsichtbare Gruppenzeile
   * „Üben"/„Prüfung" über der einen sichtbaren Kopfzeile. Der Inhalt steht
   * `sr-only` (absolut, ohne Platz), die Zelle hat damit keine Höhe; Name,
   * `scope`, `colSpan` und der Hinweis über `aria-describedby` bleiben.
   */
  nurSprachausgabe?: boolean;
}) {
  /*
    ★ T1: Solange der Schalter den Tastaturfokus hat, schliesst das Wegziehen
    der Maus den Hinweis nicht - er gehört dann dem Fokus.
  */
  const fokus = useRef(false);
  const { id, offen, nachOben, seite, maxBreite, huelle, setZeiger, betreten } =
    useZeigerhinweis(hilfe, ausrichtung, fokus);
  const sortierbar = !!sortSchluessel && !!onSortieren;
  const aktiv = sortierbar && sortierung?.spalte === sortSchluessel;
  const fokusHinweis = schlank && !!hilfe && sortierbar;
  const beiFokus = (e: FocusEvent<HTMLButtonElement>) => {
    if (!fokusIstSichtbar(e.currentTarget)) return;
    fokus.current = true;
    betreten();
  };
  const beiFokusVerlust = () => {
    fokus.current = false;
    setZeiger(false);
  };

  /*
    ★★★ `aria-sort` ist die Auskunft, ohne die eine Sprachausgabe nichts von
    der Sortierung erfährt - ein Pfeil allein ist für sie ein Zeichen ohne
    Bedeutung. Sie MUSS genau an dem `th` stehen, das gerade sortiert
    (WAI-ARIA, „table" pattern); an mehreren gleichzeitig wäre sie falsch.
  */
  const ariaSort = aktiv ? (sortierung!.ab ? "descending" : "ascending") : undefined;

  const inhalt = (
    <>
      {/*
        Die gepunktete Unterlinie ist das einzige sichtbare Zeichen dafür,
        dass hier etwas zu holen ist - Farbe allein wäre keins (WCAG 1.4.1).
      */}
      <span
        className={
          hilfe && !schlank && !nurSprachausgabe ? "underline decoration-dotted underline-offset-4" : ""
        }
      >
        {children}
      </span>
      {aktiv && (
        // ★ E7 (11.09.2026): `text-sm` statt der Sondergrösse `text-[0.7em]`
        // (rund 9,8-11 px je Kopfschrift) - unter der Mindestgrösse des Reviers.
        <span aria-hidden="true" className="ml-1 text-sm text-ink">
          {sortierung!.ab ? SORTPFEIL.ab : SORTPFEIL.auf}
        </span>
      )}
    </>
  );

  const kern = hilfe ? (
    <span
      ref={huelle}
      className="relative inline-flex items-baseline"
      onMouseEnter={betreten}
      onMouseLeave={() => {
        if (!fokus.current) setZeiger(false);
      }}
    >
      {inhalt}
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
  ) : (
    <span className="inline-flex items-baseline">{inhalt}</span>
  );

  return (
    <th
      scope={scope}
      colSpan={colSpan}
      className={className}
      aria-describedby={hilfe ? id : undefined}
      aria-sort={ariaSort}
    >
      {sortierbar ? (
        /*
          ⚠️ Ein echter Knopf, kein `onClick` am `th`. Damit ist der Kopf mit
          der Tabulatortaste erreichbar, reagiert auf Leertaste und Eingabe und
          wird als „Schalter" angesagt - all das müsste man sonst von Hand
          nachbauen und würde die Hälfte vergessen.

          ★ Der Hinweis-Kasten liegt INNERHALB des Knopfes: Er hängt an
          `aria-describedby` und wird damit beim Fokussieren mitgelesen - wer
          nicht mit der Maus arbeitet, bekommt die Erklärung genau dann, wenn
          er auf dem Kopf steht.
        */
        <button
          type="button"
          onClick={() => onSortieren!(sortSchluessel!)}
          onFocus={fokusHinweis ? beiFokus : undefined}
          onBlur={fokusHinweis ? beiFokusVerlust : undefined}
          className="inline-flex max-w-full items-baseline text-left font-inherit hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {kern}
        </button>
      ) : nurSprachausgabe ? (
        <span className="sr-only">{kern}</span>
      ) : (
        kern
      )}
    </th>
  );
}
