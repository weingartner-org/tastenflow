/** im Griff - die eingestellte Tastatur-Art als React-Wert (D2). Siehe `lib/computer/tastaturArt.ts`. */
import { useSyncExternalStore } from "react";
import {
  aktiveTastaturArt,
  subscribeTastaturArt,
  type TastaturArt,
} from "@/lib/computer/tastaturArt";

export function useTastaturArt(): TastaturArt {
  return useSyncExternalStore(subscribeTastaturArt, aktiveTastaturArt, aktiveTastaturArt);
}
