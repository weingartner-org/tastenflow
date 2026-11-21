/**
 * ★★★ G3c-VERTEILER (25.10.2026): DER RÜCKFALL EINES EINHÄNGEPUNKTS DER NEUN GERÜST-SPRACHEN.
 *
 * Seit G2-NEUN stehen bg, el, hu, nl, pt, br, ro, sv, uk in jeder Tabelle - mit dem ENGLISCHEN Wert (Marke
 * `RÜCKFALL-EN (G2-NEUN)`). Seit G3c hat jede dieser Sprachen ihre EIGENEN, noch leeren Dateien (`wordsBg.ts`,
 * `uebungsformen/lueckentextBg.ts` …), und die Tabelle (der „Verteiler") liest sie schon. Damit ein Sprach-Agent nur
 * seine Datei füllt und keinen Verteiler mehr anfasst, entscheidet der Verteiler mit diesen Helfern selbst:
 *
 *   · eigene Liste LEER  ⇒ der englische Wert, GENAU dasselbe Objekt wie vorher (nichts ändert sich, auch nicht die
 *     Gleichheit `===`, die manche Wächter prüfen);
 *   · eigene Liste GEFÜLLT ⇒ die eigene Liste, ohne dass im Verteiler eine Zeile dazukommt.
 *
 * Nie Deutsch: ein leerer Einhängepunkt fällt auf Englisch (Falle 19/30), ein gefüllter liefert nur sich selbst.
 * Reine Funktionen ohne Import - darf von Code UND von Daten-Sammelstellen benutzt werden.
 */

/** Die eigene Liste, sobald sie etwas trägt - sonst die englische (dasselbe Objekt). */
export function eigenOderEn<L extends { readonly length: number }>(eigen: L, en: L): L {
  return eigen.length > 0 ? eigen : en;
}

/**
 * Für Tabellen „je Stufe" (`{ kids, teens, erwachsen }`): die eigene Tabelle, sobald IRGENDEINE Stufe etwas trägt -
 * sonst die englische. Bewusst kein Mischen je Stufe (eine Runde halb Englisch, halb Bulgarisch wäre schlimmer als eine
 * leere Stufe; die Vollständigkeit je Stufe prüft der Wächter der Sprache).
 */
export function stufenOderEn<T extends Readonly<Record<string, readonly unknown[]>>>(eigen: T, en: T): T {
  return Object.values(eigen).some((liste) => liste.length > 0) ? eigen : en;
}

/**
 * Für Kataloge nach Schlüssel (Abzeichen, Familien-Namen): leer ⇒ der englische Katalog (dasselbe Objekt); sonst der
 * englische MIT den eigenen Einträgen darüber - ein Schlüssel, den die Sprache noch nicht hat, bleibt englisch und
 * fällt nie auf den deutschen Grundtext des Aufrufers.
 */
export function eintraegeOderEn<V>(eigen: Readonly<Record<string, V>>, en: Readonly<Record<string, V>>): Readonly<Record<string, V>> {
  return Object.keys(eigen).length > 0 ? { ...en, ...eigen } : en;
}

/** Eine eigene Wortliste als Menge, sobald sie etwas trägt - sonst die englische Menge (dasselbe Objekt). */
export function mengeOderEn(eigen: readonly string[], en: ReadonlySet<string>): ReadonlySet<string> {
  return eigen.length > 0 ? new Set(eigen) : en;
}
