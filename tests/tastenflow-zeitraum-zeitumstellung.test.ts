/**
 * ★ Wochen- und Monatsgrenzen über die Zeitumstellung (19.09.2026).
 *
 * Bis d5c07ccc verschob `grenzen()` Wochen um feste 7 × 24 Stunden. In der
 * Woche der Umstellung lag die Grenze darum eine Stunde neben Montag 8:00
 * (07:00 oder 09:00). Dieser Test stellt genau das nach: Er blättert von
 * einer Woche VOR der Umstellung in die Woche DANACH und verlangt 8:00.
 */
import { describe, expect, it } from "vitest";
import { grenzen } from "@/lib/typing/zeitraum";
import { WOCHENZIEL_GRENZE } from "@/lib/typing/wochenziel";

function stundeMinute(ms: number): string {
  const d = new Date(ms);
  return `${d.getDay()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

describe("grenzen() bleibt über die Zeitumstellung auf Montag 8:00", () => {
  // Die Woche, die die Umstellung ENTHÄLT (So 25.10.2026 bzw. So 28.03.2027),
  // hat 169 bzw. 167 Stunden - genau dort lag die alte Grenze daneben.
  const inWinterzeitWoche = new Date(2026, 9, 21, 12, 0, 0).getTime(); // Mi 21.10.2026
  const inSommerzeitWoche = new Date(2027, 2, 24, 12, 0, 0).getTime(); // Mi 24.03.2027
  // Ein Monat (4 Wochen), der die Umstellung überspannt: jetzt kurz danach.
  const nachWinterzeit = new Date(2026, 10, 4, 12, 0, 0).getTime(); // Mi 04.11.2026
  const nachSommerzeit = new Date(2027, 3, 7, 12, 0, 0).getTime(); // Mi 07.04.2027

  for (const [name, jetzt] of [
    ["Winterzeit", inWinterzeitWoche],
    ["Sommerzeit", inSommerzeitWoche],
  ] as const) {
    it(`Woche mit der Umstellung (${name}): Anfang UND Ende Montag 08:00`, () => {
      const g = grenzen({ art: "woche", wochenVersatz: 0, jahrVersatz: 0 }, jetzt, WOCHENZIEL_GRENZE)!;
      expect(stundeMinute(g.vonMs)).toBe("1 08:00");
      expect(stundeMinute(g.bisMs + 1)).toBe("1 08:00");
    });
  }

  for (const [name, jetzt] of [
    ["Winterzeit", nachWinterzeit],
    ["Sommerzeit", nachSommerzeit],
  ] as const) {
    it(`Monat über die Umstellung (${name}): Anfang UND Ende Montag 08:00`, () => {
      const g = grenzen(
        { art: "monat", wochenVersatz: 0, jahrVersatz: 0, monatVersatz: 0 },
        jetzt,
        WOCHENZIEL_GRENZE,
      )!;
      expect(stundeMinute(g.vonMs)).toBe("1 08:00");
      expect(stundeMinute(g.bisMs + 1)).toBe("1 08:00");
    });
  }
});
