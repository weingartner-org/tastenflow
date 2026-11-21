/**
 * Das eingestellte Belohnungs-Spiel als React-Wert. Der Zustand selbst liegt in
 * `src/lib/typing/belohnungsspiel.ts` (ohne React, weil die Trainer ihn im
 * Rundenende-Callback brauchen); dieser Haken hängt die Oberfläche daran, damit
 * Zahnrad-Auswahl und „Spielen"-Knopf beim Umstellen sofort nachziehen -
 * dasselbe Muster wie {@link ./useKeyboardLayout}. Siehe
 * [[project_zehnfinger_trainer]].
 */
import { useSyncExternalStore } from "react";
import {
  activeBelohnungsSpiel,
  subscribeBelohnungsSpiel,
  type BelohnungsSpiel,
} from "@/lib/typing";

export function useBelohnungsSpiel(): BelohnungsSpiel {
  return useSyncExternalStore(
    subscribeBelohnungsSpiel,
    activeBelohnungsSpiel,
    activeBelohnungsSpiel,
  );
}
