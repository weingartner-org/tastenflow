/**
 * Testerin 09.11.2026 (Meldung m5osk1wp8nsf8x6): „Bei der Shift-Taste werden jeweils beide
 * akzeptiert. Hier sollte die jeweilige Seite festgelegt sein, wie im Schreibtrainer auch."
 * Johannes 11.11.: bauen. Wie im Schreibtrainer: Umschalttaste der GEGENHAND - ausser bei
 * „Einhand schreiben" (`gegenhand` aus).
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import { findenSchritt, type FindenZiel } from "../src/lib/typing/findenRunde";
import { layoutById } from "../src/lib/typing/layouts";

const DE = layoutById("de");
const E = (o: Partial<KeyEventLike> & { key: string }): KeyEventLike => ({
  ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...o,
});
// ( = Umschalt + 8: die 8 tippt die RECHTE Hand, also gehört die LINKE Umschalttaste dazu.
const ziele: FindenZiel[] = [{ art: "zeichen", zeichen: "(", mod: "shift" }];
const klammer = E({ key: "(", code: "Digit8", shiftKey: true });
const schritt = (extra: Record<string, unknown>) =>
  findenSchritt({ e: klammer, ziele, index: 0, bestaetigt: false, plattform: "windows", layout: DE, ...extra });

describe("Tasten finden: die Seite der Umschalttaste", () => {
  it("die richtige (linke) Umschalttaste zählt", () => {
    expect(schritt({ gegenhand: true, shiftGehalten: "links" })?.art).toBe("gefunden");
  });
  it("die falsche (rechte) Umschalttaste zählt nicht und sagt, welche gemeint ist", () => {
    const s = schritt({ gegenhand: true, shiftGehalten: "rechts" });
    expect(s?.art).toBe("daneben");
    expect(s?.ansage).toMatch(/linke Umschalttaste/);
  });
  it("bei „Einhand schreiben“ zählen beide", () => {
    expect(schritt({ gegenhand: false, shiftGehalten: "rechts" })?.art).toBe("gefunden");
  });
  it("ohne bekannte Seite (Fokus weg, keine Messung) wird nichts verweigert", () => {
    expect(schritt({ gegenhand: true })?.art).toBe("gefunden");
  });
  it("ein Zeichen ohne Umschalttaste ist davon nicht betroffen", () => {
    const s = findenSchritt({
      e: E({ key: "d", code: "KeyD" }), ziele: [{ art: "zeichen", zeichen: "d" }], index: 0, bestaetigt: false,
      plattform: "windows", layout: DE, gegenhand: true, shiftGehalten: "rechts",
    } as never);
    expect(s?.art).toBe("gefunden");
  });
});
