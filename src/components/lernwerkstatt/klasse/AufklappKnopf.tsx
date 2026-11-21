/**
 * ★ EIN Aufklapp-Knopf für die Kinderzeilen ALLER Programm-Reiter (Johannes
 * 20.10.2026: *„das Menü bei der Schülerverwaltung ist in jeder App anders,
 * einmal sind die Ausklapppfeile rechts, einmal links, einmal öffnet sich
 * unterhalb der Schülerliste die Daten, einmal direkt in der Zeile … Orientiere
 * dich genau an dem Verwaltungsfenster von Tastenflow"*).
 *
 * Das Muster ist das von Tastenflow (`EinstellungenKnopf`):
 *   • der runde Pfeil steht in der ERSTEN Spalte, links vom Namen;
 *   • zu: Pfeil nach rechts, offen: Pfeil nach unten;
 *   • die Einzelheiten öffnen sich als eigene Zeile DIREKT unter dem Kind
 *     (`AufklappHuelle`), nie unter der ganzen Tabelle;
 *   • der Hinweis steht am Schalter (Mouseover/Fokus), nicht als Absatz.
 *
 * Tastenflow benutzt diesen Baustein ebenfalls - EINE Fassung statt vier.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Tipp } from "@/components/Tipp";
import { Aufklappen } from "@/components/Aufklappen";

/** Breite der Knopfspalte - Tastenflow: `w-14`. Name und Knopf docken daran an. */
export const AUFKLAPP_KNOPF_ZELLE = "w-14 min-w-14 !pr-0";
/** Zeile beim Zeigen - wie `PupilRow` in Tastenflow. */
export const AUFKLAPP_ZEILE = "group/zeile hover:bg-accent-soft";
/** Der Zebra-Grund der Zeile (deckend) - wie `zebra` in Tastenflow. */
export function aufklappGrund(index: number): string {
  return index % 2 === 1 ? "bg-surface-sunken" : "bg-surface-raised";
}

export function AufklappKnopf({
  open,
  onToggle,
  label,
  tipp,
  controls,
}: {
  open: boolean;
  onToggle: () => void;
  /** Der Name des Schalters, schon fertig („… ausklappen" / „… einklappen"). */
  label: string;
  /** Der Hinweis beim Zeigen und bei Fokus. */
  tipp: string;
  /** `id` der Einzelheiten-Zeile (nur gesetzt, wenn sie im Baum steht). */
  controls?: string;
}) {
  return (
    <Tipp text={tipp} ausrichtung="links" unterdruecken={open}>
      {(beschreibungId) => (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={open ? controls : undefined}
          aria-describedby={beschreibungId}
          aria-label={label}
          className="btn-secondary btn-umriss inline-flex h-9 w-9 items-center justify-center rounded-full p-0"
        >
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {open ? <polyline points="5 9 12 16 19 9" /> : <polyline points="9 5 16 12 9 19" />}
          </svg>
        </button>
      )}
    </Tipp>
  );
}

/**
 * Die Einzelheiten-Zeile unter einem Kind - dieselbe Hülle wie in Tastenflow:
 * eine Tabellenzeile, deren Zelle den wachsenden Kasten trägt, mit dem leicht
 * eingesunkenen Grund und dem Innenabstand IM Kasten (`px-6 py-[18px]`).
 */
export function AufklappHuelle({
  offen,
  spalten,
  grund,
  id,
  children,
}: {
  offen: boolean;
  /** Wie viele Spalten die Tabelle hat (`colSpan`). */
  spalten: number;
  grund: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <Aufklappen
      offen={offen}
      huelle={(kasten) => (
        <tr id={id} className={grund}>
          <td colSpan={spalten} className="bg-surface-sunken/40 !p-0">
            {kasten}
          </td>
        </tr>
      )}
    >
      <div className="px-6 py-[18px] text-left">{children}</div>
    </Aufklappen>
  );
}

/**
 * ★ Die Aufgaben-Leiste über der Kindertabelle - EINE Reihe Schalter, darunter
 * das Panel des gedrückten Schalters (höchstens eines offen), wie in Tastenflow
 * (E3: „Tippchallenge · Eigene Übung · Wochenziel · Einstellungen der Klasse").
 * Johannes 20.10.2026: *„auch alle Übungen und Lernabschnitte, die ich direkt
 * an die ganze Klasse schicken kann, sollen oben in Schaltern abgebildet sein."*
 *
 * Panels bleiben gemountet (`bleibt`): Formulare behalten ihren Entwurf, wenn
 * die Lehrkraft zwischen Schaltern wechselt. Escape im Panel schließt es und
 * legt den Fokus auf seinen Schalter zurück; beim Öffnen springt der Fokus in
 * die Überschrift des Panels.
 */
export type LeistenEintrag = {
  schluessel: string;
  label: string;
  /** Der Stand, unbetont hinter dem Namen („· läuft"). */
  stand?: string;
  tipp: string;
  inhalt: ReactNode;
  /** Direkte Handlung statt Panel: kein Panel, nur dieser Klick. */
  aktion?: { onClick: () => void; label?: string; busy?: boolean };
};

export function AufgabenLeiste({
  gruppe,
  praefix,
  eintraege,
}: {
  gruppe: string;
  /** Eindeutiger Anfang der `id`s, z. B. „mk-pg". */
  praefix: string;
  eintraege: LeistenEintrag[];
}) {
  const [offen, setOffen] = useState<string | null>(null);
  const knoepfe = useRef<Record<string, HTMLButtonElement | null>>({});
  const ueberschrift = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (offen) ueberschrift.current?.focus();
  }, [offen]);
  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label={gruppe}>
        {eintraege.map((e) => (
          <Tipp key={e.schluessel} text={e.tipp}>
            {(hinweisId) =>
              e.aktion ? (
                <button
                  type="button"
                  className="btn-secondary btn-toggle btn-umriss aria-disabled:opacity-40"
                  aria-disabled={e.aktion.busy}
                  aria-describedby={hinweisId}
                  onClick={e.aktion.onClick}
                >
                  {e.aktion.label ?? e.label}
                </button>
              ) : (
                <button
                  ref={(el) => {
                    knoepfe.current[e.schluessel] = el;
                  }}
                  type="button"
                  className="btn-secondary btn-toggle btn-umriss aria-expanded:bg-accent-soft"
                  aria-expanded={offen === e.schluessel}
                  aria-controls={`${praefix}-panel-${e.schluessel}`}
                  aria-describedby={hinweisId}
                  onClick={() => setOffen((o) => (o === e.schluessel ? null : e.schluessel))}
                >
                  {e.label}
                  {e.stand && <span className="font-normal text-ink-muted"> · {e.stand}</span>}
                </button>
              )
            }
          </Tipp>
        ))}
      </div>
      {eintraege
        .filter((e) => !e.aktion)
        .map((e) => (
          <Aufklappen key={e.schluessel} offen={offen === e.schluessel} bleibt>
            {(verborgen: boolean) => (
              <section
                id={`${praefix}-panel-${e.schluessel}`}
                aria-label={e.label}
                hidden={verborgen}
                className="space-y-3 rounded-xl border border-hairline bg-surface-sunken px-3 py-2"
                onKeyDown={(ev) => {
                  if (ev.key === "Escape" && !ev.defaultPrevented) {
                    setOffen(null);
                    knoepfe.current[e.schluessel]?.focus();
                  }
                }}
              >
                <h3
                  ref={offen === e.schluessel ? ueberschrift : undefined}
                  tabIndex={-1}
                  className="m-0 text-sm font-semibold text-ink outline-none"
                >
                  {e.label}
                </h3>
                {e.inhalt}
              </section>
            )}
          </Aufklappen>
        ))}
    </>
  );
}
