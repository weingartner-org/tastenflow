/**
 * ★ GEZIELT ÜBEN, ETAPPE C (13.11.2026, Bauplan §5): die Herkunft dessen, was für ein Kind gilt - für die Spalte
 * „Gezielt", die Zeile je Kind und die Mehrfachauswahl. Rechnet NICHTS Neues: den Vorrang entscheidet
 * `gezieltFuerKind` (gezielt.ts); hier steht nur, WOHER der Wert kommt, damit die Lehrkraft es lesen kann.
 */
import { datumLokal, gezieltFuerKind, type Gezielt } from "./gezielt";

export type GezieltQuelle =
  /** Das Kind hat einen eigenen Wert mit Zeichen. */
  | "kind"
  /** Das Kind hat einen eigenen Wert OHNE Zeichen: „aus für dieses Kind". */
  | "kind-aus"
  /** Das Kind hat keinen (oder einen abgelaufenen) Wert; die Klasse gibt Zeichen vor. */
  | "klasse"
  /** Nichts gilt. */
  | "keine";

export interface GezieltHerkunft {
  /** Was heute gilt (`null` = aus). */
  wirksam: Gezielt | null;
  quelle: GezieltQuelle;
}

/** Ist am Kind ein eigener Wert gesetzt, der heute noch gilt (auch „aus")? */
export function kindWertGilt(kind: Gezielt | null | undefined, heute: Date): kind is Gezielt {
  return !!kind && !(kind.bis !== null && kind.bis < datumLokal(heute));
}

export function gezieltHerkunft(
  kind: Gezielt | null | undefined,
  klasse: Gezielt | null | undefined,
  heute: Date,
): GezieltHerkunft {
  const wirksam = gezieltFuerKind(kind, klasse, heute);
  if (kindWertGilt(kind, heute)) return { wirksam, quelle: kind.zeichen.length === 0 ? "kind-aus" : "kind" };
  return { wirksam, quelle: wirksam ? "klasse" : "keine" };
}
