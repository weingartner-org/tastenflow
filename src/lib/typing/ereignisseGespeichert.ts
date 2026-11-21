/**
 * ★ Das Signal „geübte Zeilen sind gespeichert" - MIT der Liste (28.09.2026,
 * Serverlast).
 *
 * Gemessen am Server (5 Tage): 65.764 Lesungen von `lw_events`. Ein grosser
 * Teil davon war die Wochenziel-Anzeige: Nach JEDER gespeicherten Zeile las
 * sie die ganze Ereignis-Zeile (Mittel 6,4 KB) noch einmal vom Server - obwohl
 * der Schreibweg genau diese Liste Augenblicke vorher selbst gebaut hatte.
 * Jetzt reicht der Schreibweg sie im Signal mit, und die Anzeige rechnet damit.
 *
 * ⚠️ `ereignisse` fehlt, wenn der Schreibweg die Liste nicht kennt - dann liest
 * die Anzeige wie früher selbst nach (nie eine falsche Null).
 * ⚠️ `accountId` ist Pflicht: Ein Signal eines ANDEREN Kontos (Kontowechsel am
 * selben Gerät, eine späte Antwort) darf die Anzeige nie mit fremder Übezeit
 * füllen.
 */
import type { TaskEvent } from "./account";

export const EREIGNISSE_GESPEICHERT = "tippen-events-recorded";

export interface EreignisseGespeichert {
  accountId: string;
  /** Die ganze Liste nach dem Schreiben - so, wie eine Lesung sie brächte. */
  ereignisse?: readonly TaskEvent[];
}

export function meldeEreignisseGespeichert(
  accountId: string,
  ereignisse: readonly TaskEvent[] | void,
): void {
  const detail: EreignisseGespeichert = ereignisse ? { accountId, ereignisse } : { accountId };
  window.dispatchEvent(new CustomEvent<EreignisseGespeichert>(EREIGNISSE_GESPEICHERT, { detail }));
}

/** Das Signal auslesen - `null` bei einem alten Signal ohne Angaben. */
export function leseEreignisseGespeichert(ev: Event): EreignisseGespeichert | null {
  const d = (ev as CustomEvent<unknown>).detail as Partial<EreignisseGespeichert> | null | undefined;
  if (!d || typeof d.accountId !== "string") return null;
  return {
    accountId: d.accountId,
    ...(Array.isArray(d.ereignisse) ? { ereignisse: d.ereignisse } : {}),
  };
}
