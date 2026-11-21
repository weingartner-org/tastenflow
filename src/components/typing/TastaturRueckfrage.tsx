/**
 * ★★★ DIE RÜCKFRAGE „JA / NEIN" VOR EINEM WECHSEL DES LERNWEGES (W2b, 28.09.2026).
 *
 * Johannes (27.09.2026), wörtlich: *„pop up beim ändern der Sprache wäre
 * wichtig: Achtung diese Sprache ist nur mit der passenden Tastatur ....
 * möglich. Verwendet dieses Kind eine .... Tastatur? (Ja) (Nein) : bei nein
 * springt es wieder auf die ursprüngliche sprache zurück"*.
 *
 * EIN Bauteil für beide Stellen, an denen ein Weg gewählt wird:
 *  · die Lehrkraft stellt den Weg eines Kindes um (`WegJeKind.tsx`),
 *  · jemand wählt beim ersten Start eine Sprache, deren Weg eine andere
 *    Tastatur braucht (`TippenTrainerPage`, Sprachwähler der Kopfzeile).
 *
 * ── BEDIENUNG ───────────────────────────────────────────────────────────────
 * Das gemeinsame `Modal` (nicht geändert, nur benutzt): Fokus beim Öffnen auf
 * den Fragetext (ein Screenreader liest ihn vor), Tab bleibt im Fenster, und
 * beim Schliessen geht der Fokus an den Auslöser zurück - an das Auswahlfeld
 * bzw. an den Sprachwähler. „Nein", Escape und ✕ heissen dasselbe: nichts
 * ändert sich, die bisherige Sprache bleibt stehen. Nichts ist `disabled`.
 */
import { useRef, type ReactNode } from "react";
import { Modal } from "@/components/Modal";

export interface TastaturRueckfrageProps {
  titel: string;
  /** Die Sätze vor der Frage (Achtung-Satz, was mit dem Fortschritt geschieht). */
  saetze: readonly ReactNode[];
  /** Die Frage selbst - steht zuletzt, direkt vor den Knöpfen. */
  frage: string;
  ja: string;
  nein: string;
  /** Sprache des Fensters, wenn sie von der Seite abweicht (z. B. „fr" beim ersten Start). */
  lang?: string;
  onJa: () => void;
  /** Nein, Escape, ✕ - die bisherige Wahl bleibt. */
  onNein: () => void;
}

export function TastaturRueckfrage({
  titel,
  saetze,
  frage,
  ja,
  nein,
  lang,
  onJa,
  onNein,
}: TastaturRueckfrageProps) {
  const textRef = useRef<HTMLDivElement>(null);
  return (
    <Modal title={titel} onClose={onNein} initialFocus={textRef}>
      <div lang={lang}>
        <div
          ref={textRef}
          tabIndex={-1}
          className="space-y-2 outline-none"
          data-testid="tastatur-rueckfrage-text"
        >
          {saetze.map((satz, i) => (
            <p key={i} className="m-0 max-w-prose text-ink-soft">
              {satz}
            </p>
          ))}
          <p className="m-0 max-w-prose font-semibold text-ink">{frage}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={onJa}>
            {ja}
          </button>
          <button type="button" className="btn-secondary btn-toggle" onClick={onNein}>
            {nein}
          </button>
        </div>
      </div>
    </Modal>
  );
}
