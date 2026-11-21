import { useCallback, useEffect, useMemo, useState } from "react";
import { getBackend } from "@/backend";
import {
  isProgramReleased,
  sortByProgrammeOrder,
  type ProgrammeOverrides,
} from "@/lib/allPrograms";

/**
 * Lädt die Programm-Steuerung (Admin-Schalter, in PocketBase appSettings/
 * "programme-overrides" gespeichert) und liefert zwei Helfer für die
 * öffentlichen Seiten:
 *  - `released(key)` — ist die App öffentlich sichtbar?
 *  - `sort(items)`  — sortiert Karten-Arrays nach der im Admin festgelegten
 *                     Reihenfolge (Verwaltung → Programme → Hoch/Runter).
 *
 * Während des Ladens und bei Fehlern gilt der zuletzt geladene Stand dieses
 * Geräts, sonst die Code-Defaults (`!draft` bzw. die Reihenfolge in
 * ALL_PROGRAMS), damit bereits öffentliche Apps nie kurz verschwinden oder
 * springen. Schlägt das Laden fehl, wird bis zu dreimal neu versucht (nach 2,
 * 5 und 15 Sekunden) - bis 21.09.2026 blieb es bei einem Versuch, und ein
 * einziger Aussetzer im WLAN ließ die Lernwerkstatt bis zum Neuladen bei drei
 * statt fünf Programmen stehen. Der anonyme Lese-Zugriff ist über die
 * appSettings-Regel freigegeben (nur der Datensatz "programme-overrides",
 * siehe pocketbase/setup.mjs).
 */
/** Letzter erfolgreich geladener Stand - damit die Seite auch bei schwachem Netz nicht zurückfällt. */
const MERK_SCHLUESSEL = "sensorik:programme-overrides:v1";
const NEUE_VERSUCHE_NACH_MS = [2000, 5000, 15000];

function gemerkterStand(): ProgrammeOverrides {
  try {
    const roh = localStorage.getItem(MERK_SCHLUESSEL);
    const o = roh ? JSON.parse(roh) : null;
    return o && typeof o === "object" && !Array.isArray(o) ? (o as ProgrammeOverrides) : {};
  } catch {
    return {};
  }
}

function standMerken(o: ProgrammeOverrides): void {
  try {
    localStorage.setItem(MERK_SCHLUESSEL, JSON.stringify(o));
  } catch {
    /* Speicher gesperrt oder voll: ohne Merkzettel weiter */
  }
}

export function useProgrammeCatalog(): {
  released: (key: string) => boolean;
  sort: <T extends { key: string }>(items: T[]) => T[];
} {
  const [overrides, setOverrides] = useState<ProgrammeOverrides>(gemerkterStand);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const laden = (versuch: number) => {
      void getBackend()
        .then((b) => b.getProgrammeOverrides())
        .then((o) => {
          if (!alive) return;
          setOverrides(o);
          standMerken(o);
        })
        .catch(() => {
          // Netz-/Rechtefehler: der gemerkte Stand bzw. der Code-Default gilt
          // weiter - und es wird noch einige Male versucht, statt es bei einem
          // Fehlversuch zu belassen.
          const warte = NEUE_VERSUCHE_NACH_MS[versuch];
          if (alive && warte !== undefined) timer = setTimeout(() => laden(versuch + 1), warte);
        });
    };
    laden(0);
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const released = useCallback(
    (key: string) => isProgramReleased(key, overrides),
    [overrides],
  );
  const sort = useCallback(
    <T extends { key: string }>(items: T[]) => sortByProgrammeOrder(items, overrides),
    [overrides],
  );

  return useMemo(() => ({ released, sort }), [released, sort]);
}
