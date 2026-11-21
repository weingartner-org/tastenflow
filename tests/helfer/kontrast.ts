/**
 * WCAG-Kontrast nachrechnen — für die Farben der Arbeitsblätter.
 *
 * ── ★★ Warum ein Wächter für Farben (09.08.2026) ────────────────────────────
 *
 * Johannes hat die Arbeitsblätter der Brücken-Übungen einfärben lassen: „nur
 * weil viele schüler die das machen blind sind muss es nicht hässlich sein".
 * Genau da fängt aber die Gefahr an: Ein Blatt für eine INKLUSIVE Klasse wird
 * auch von Kindern mit Sehbehinderung gelesen — von denen, die noch sehen, aber
 * schlechter. Ein hübsches Hellgrau auf Weiß ist für sie nichts.
 *
 * Der Wächter rechnet darum nach, statt zu vertrauen: Jedes Paar (Schrift auf
 * Füllung), das in einer `docx` oder `xlsx` vorkommt, muss die WCAG-Schwelle
 * halten. Die Rechnung ist die aus WCAG 2.1 (relative Leuchtdichte, sRGB) —
 * dieselbe, die jedes Prüfwerkzeug benutzt.
 *
 * ⚠️ Der Wächter prüft KONSTANTEN, keine gerenderte Datei. Er beweist damit
 * nicht, dass Word die Farbe auch anzeigt — er beweist, dass die Farbe, die
 * wir hineinschreiben, überhaupt lesbar sein KANN. Das ist der Teil, den eine
 * Maschine sicher kann; der Rest ist Johannes' Blick auf das fertige Blatt.
 */

/** Ein Kanal von 0…255 in seinen linearen Anteil (WCAG 2.1, sRGB). */
function linear(kanal: number): number {
  const c = kanal / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/**
 * Die relative Leuchtdichte einer Hexfarbe.
 *
 * Nimmt `RRGGBB` mit oder ohne führendes `#` und mit oder ohne
 * Alpha-Vorsatz `FF` (so stehen die Farben in `styles.xml`).
 */
export function leuchtdichte(hex: string): number {
  let h = hex.replace(/^#/, "").toUpperCase();
  if (h.length === 8) h = h.slice(2); // FFRRGGBB → RRGGBB
  if (!/^[0-9A-F]{6}$/.test(h)) throw new Error(`„${hex}" ist keine Hexfarbe.`);
  const r = linear(parseInt(h.slice(0, 2), 16));
  const g = linear(parseInt(h.slice(2, 4), 16));
  const b = linear(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Das Kontrastverhältnis zweier Farben — 1 (gleich) bis 21 (Schwarz auf Weiß).
 *
 * WCAG AA verlangt 4,5:1 für Fließtext und 3:1 für große Schrift. Die
 * Arbeitsblätter halten überall 4,5:1, auch bei den Überschriften: Eine
 * Ausnahme für „groß genug" wäre eine Ausnahme, die beim nächsten
 * Schriftgrößen-Wechsel still falsch wird.
 */
export function kontrast(vorne: string, hinten: string): number {
  const a = leuchtdichte(vorne);
  const b = leuchtdichte(hinten);
  const hell = Math.max(a, b);
  const dunkel = Math.min(a, b);
  return (hell + 0.05) / (dunkel + 0.05);
}

/** Die Farbe des Papiers, wenn eine Zelle oder ein Absatz keine Füllung hat. */
export const PAPIER_WEISS = "FFFFFF";
