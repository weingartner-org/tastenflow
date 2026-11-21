/**
 * ★★★ Die gesperrten Zeiten der EIGENEN Klasse - für die Kind-Sicht (W4,
 * 19.09.2026, `wochenziel.ts` „Eine Stunde sperren"). Genauer Zwilling von
 * {@link useKlassenRhythmus}: Das Kind hat seine Klasse nicht vor sich, nur
 * seinen Klassencode - siehe dort für die ausführliche Begründung
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ⚠️ Er ist ABSICHTLICH wehrhaft: Kein Konto, keine Klasse, kein Netz, ein
 * kaputter Wert - in jedem dieser Fälle kommt eine leere Liste zurück, also
 * „nichts gesperrt". Ein Ladefehler darf einem Kind nie Übungszeit wegnehmen,
 * die ihm fürs Wochenziel eigentlich zusteht.
 */
import { useEffect, useState } from "react";
import { typingBackend } from "./backend";
import type { GesperrteZeit } from "./wochenziel";

const LEER: readonly GesperrteZeit[] = [];

/**
 * ★ EN10-Befund (19.09.2026): Die Sperrzeiten SAMT der Auskunft, ob sie für
 * diese Klasse schon geladen sind. Im Browser gesehen: „Wochenziel geschafft!"
 * erschien, während der Ring 33 von 45 Minuten zeigte - das Fenster rechnete
 * im ersten Durchlauf mit der noch LEEREN Liste, zählte die gesperrte Stunde
 * mit und merkte sich das Fenster für die ganze Woche. Wer eine Entscheidung
 * auf die Sperrzeiten stützt, die nicht zurückzunehmen ist, wartet auf
 * `geladen`. Ohne Klassencode (Selbstlernende) gibt es keine Sperre - dann
 * ist sofort `geladen`. Scheitert das Laden, gilt es als geladen mit leerer
 * Liste (wie bisher).
 */
export function useGesperrteZeitenStand(classCode: string | undefined | null): {
  zeiten: readonly GesperrteZeit[];
  geladen: boolean;
} {
  const [stand, setStand] = useState<{
    fuer: string | null;
    zeiten: readonly GesperrteZeit[];
  }>({ fuer: null, zeiten: LEER });
  useEffect(() => {
    if (!classCode) return;
    let lebt = true;
    void typingBackend()
      .getClass(classCode)
      .then((cls) => {
        if (lebt) setStand({ fuer: classCode, zeiten: cls?.gesperrteZeiten ?? LEER });
      })
      .catch(() => {
        if (lebt) setStand({ fuer: classCode, zeiten: LEER });
      });
    return () => {
      lebt = false;
    };
  }, [classCode]);
  if (!classCode) return { zeiten: LEER, geladen: true };
  return stand.fuer === classCode
    ? { zeiten: stand.zeiten, geladen: true }
    : { zeiten: LEER, geladen: false };
}

export function useGesperrteZeiten(
  classCode: string | undefined | null,
): readonly GesperrteZeit[] {
  return useGesperrteZeitenStand(classCode).zeiten;
}
