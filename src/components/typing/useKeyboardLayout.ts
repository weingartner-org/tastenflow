/**
 * Das eingestellte Tastatur-Layout als React-Wert. Der Zustand selbst liegt in
 * `src/lib/typing/layouts.ts` (ohne React, weil reine Funktionen wie
 * `fingerForChar` ihn ebenfalls brauchen); dieser Haken hängt die Oberfläche
 * daran, damit Bildschirm-Tastatur und Auswahlfeld beim Umstellen sofort
 * nachziehen. Siehe [[project_zehnfinger_trainer]].
 */
import { useSyncExternalStore } from "react";
import { activeLayout, subscribeLayout, type KeyboardLayout } from "@/lib/typing/layouts";

export function useKeyboardLayout(): KeyboardLayout {
  return useSyncExternalStore(subscribeLayout, activeLayout, activeLayout);
}
