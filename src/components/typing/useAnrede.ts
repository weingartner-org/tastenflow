/**
 * ★ „du" oder „Sie" für die Person, die gerade angemeldet ist (19.09.2026).
 *
 * Die Regel selbst steht in `anredeFuer` (`lib/typing/skin.ts`): Lehrkraft
 * „Sie", alle anderen „du". Dieser Haken holt nur das Konto aus
 * `useTypingAuth` und fragt dann genau diese Regel - damit ein Bauteil tief in
 * der Übung (Abschluss-Karte, Merkfenster, Hilfe) die Anrede nicht über fünf
 * Ebenen gereicht bekommen muss und niemand an der Aufrufstelle selbst nach
 * `role` fragt ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * Ohne Anmeldung (Gast) gibt es kein Konto - dann „du".
 */
import { anredeFuer, type Anrede } from "@/lib/typing/skin";
import { useTypingAuth } from "./useTypingAuth";

export function useAnrede(): Anrede {
  return useTypingAuth((s) => anredeFuer(s.account));
}
