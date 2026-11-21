/**
 * ★ 12.11.2026 (Johannes, nach mehreren Meldungen): das Geschriebene blendet
 * aus, und der Schreibzeiger lässt sich mit dem Anfasser von der Mitte nach
 * ganz links ziehen.
 * ★ 13.11.2026: die Ausblend-Strecke stellt ein zweiter Punkt ein (0 = aus),
 * und der Punkt rechts unten macht aus der Zeile eine Seite mit mehreren Zeilen.
 */
import { describe, expect, it } from "vitest";
import { ausblendDeckkraft, seitenText, seitenZeilenImFenster } from "@/components/typing/TypingSession";
import {
  AUSBLENDEN_SOFORT,
  AUSBLENDEN_ZEICHEN,
  AUSBLENDEN_ZEICHEN_MAX,
  CURSOR_STELLE_MITTE,
  CURSOR_STELLE_VORGABE,
  SEITEN_ZEILEN_MAX,
  ausblendZeichenAus,
  cursorStelleAus,
  seitenZeilenAus,
} from "@/lib/typing/a11y";

describe("Ausblenden des Geschriebenen", () => {
  it("das Zeichen direkt hinter dem Schreibzeiger ist voll da", () => {
    expect(ausblendDeckkraft(1)).toBe(1);
  });
  it("wird über 6 Zeichen blasser und ist danach weg (Vorgabe)", () => {
    expect(AUSBLENDEN_ZEICHEN).toBe(6);
    for (let d = 1; d < AUSBLENDEN_ZEICHEN; d++) {
      expect(ausblendDeckkraft(d + 1)).toBeLessThan(ausblendDeckkraft(d));
    }
    expect(ausblendDeckkraft(AUSBLENDEN_ZEICHEN)).toBeGreaterThan(0);
    expect(ausblendDeckkraft(AUSBLENDEN_ZEICHEN + 1)).toBe(0);
    expect(ausblendDeckkraft(40)).toBe(0);
  });
  it("das aktive und die kommenden Zeichen bleiben unberührt", () => {
    expect(ausblendDeckkraft(0)).toBe(1);
    expect(ausblendDeckkraft(-3)).toBe(1);
  });
  it("Punkt dicht am Schreibzeiger: nach einem Zeichen weg", () => {
    expect(ausblendDeckkraft(1, 1)).toBe(1);
    expect(ausblendDeckkraft(2, 1)).toBe(0);
  });
  it("Punkt ganz links (0): nichts blendet aus", () => {
    expect(ausblendDeckkraft(1, 0)).toBe(1);
    expect(ausblendDeckkraft(500, 0)).toBe(1);
  });
  it("gespeicherte Zeichenzahl: 0 = aus, sonst 1 bis Höchstwert, Unsinn = Vorgabe", () => {
    expect(ausblendZeichenAus(null)).toBe(AUSBLENDEN_ZEICHEN);
    expect(ausblendZeichenAus("quatsch")).toBe(AUSBLENDEN_ZEICHEN);
    expect(ausblendZeichenAus("0")).toBe(0);
    expect(ausblendZeichenAus(-4)).toBe(AUSBLENDEN_SOFORT); // seit 13.11. „sofort“, nicht „aus“
    expect(ausblendZeichenAus(0.6)).toBe(1);
    expect(ausblendZeichenAus("12")).toBe(12);
    expect(ausblendZeichenAus(99999)).toBe(AUSBLENDEN_ZEICHEN_MAX);
  });
});

describe("Stelle des Schreibzeigers", () => {
  it("Vorgabe ist der goldene Schnitt", () => {
    expect(cursorStelleAus(null)).toBe(CURSOR_STELLE_VORGABE);
    expect(cursorStelleAus("quatsch")).toBe(CURSOR_STELLE_VORGABE);
  });
  it("geht von ganz links bis zur Mitte, nicht weiter", () => {
    expect(cursorStelleAus("0")).toBe(0);
    expect(cursorStelleAus("0.2")).toBe(0.2);
    expect(cursorStelleAus("-1")).toBe(0);
    expect(cursorStelleAus("0.9")).toBe(CURSOR_STELLE_MITTE);
  });
});

describe("Seite statt Zeile", () => {
  it("Zeilenzahl: Vorgabe 1, höchstens der Höchstwert", () => {
    expect(seitenZeilenAus(null)).toBe(1);
    expect(seitenZeilenAus("0")).toBe(1);
    expect(seitenZeilenAus("4")).toBe(4);
    expect(seitenZeilenAus(2.6)).toBe(3);
    expect(seitenZeilenAus(500)).toBe(SEITEN_ZEILEN_MAX);
  });
  it("die Zeilen der Runde laufen fortlaufend, Abstand zählt über alle Zeilen", () => {
    const t = seitenText(["ab c", "de"], 1, "de", 1, false);
    const flach = t.flat(2);
    expect(flach.map((z) => z.ch).join("")).toBe("ab cde");
    // „e" ist aktiv, „d" eins dahinter, „a" fünf dahinter.
    expect(flach.find((z) => z.abstand === 0)?.ch).toBe("e");
    expect(flach[0]).toEqual({ ch: "a", abstand: -5 });
    // Das Leerzeichen ist ein eigenes Wort - dort darf die Seite umbrechen.
    expect(t[0].map((w) => w.map((z) => z.ch).join(""))).toEqual(["ab", " ", "c"]);
  });
  it("mit Zeilenende-Enter endet jede Zeile mit ↵", () => {
    const t = seitenText(["ab", "c"], 0, "ab", 2, true);
    expect(t[0].flat().map((z) => z.ch).join("")).toBe("ab↵");
    expect(t[0].flat().find((z) => z.abstand === 0)?.ch).toBe("↵");
  });
  it("eine angepasste aktuelle Zeile wird so gezeigt, wie das Kind sie schreibt", () => {
    const t = seitenText(["Tu viens ?"], 0, "Tu viens?", 0, false);
    expect(t.flat(2).map((z) => z.ch).join("")).toBe("Tu viens?");
  });
});

describe("Seite: der untere Fensterrand begrenzt die Zeilen (Johannes 13.11.2026)", () => {
  // Schrift 38,4 px ⇒ Zeilenhöhe 2,1 × 38,4 = 80,64 px.
  it("so viele Zeilen, wie bis zum Fensterrand passen", () => {
    // 900 - 280 - 24 - 8 = 588 px frei ⇒ 7 Zeilen.
    expect(seitenZeilenImFenster(900, 280, 24, 38.4)).toBe(7);
  });
  it("kleineres Fenster ⇒ weniger Zeilen", () => {
    expect(seitenZeilenImFenster(600, 280, 24, 38.4)).toBe(3);
    expect(seitenZeilenImFenster(450, 280, 24, 38.4)).toBe(1);
  });
  it("nie weniger als eine Zeile, auch wenn das Feld schon unter dem Rand liegt", () => {
    expect(seitenZeilenImFenster(200, 280, 24, 38.4)).toBe(1);
    expect(seitenZeilenImFenster(900, 280, 24, 0)).toBe(1);
  });
  it("keine feste Obergrenze mehr bei 12 - ein hohes Fenster trägt mehr", () => {
    expect(seitenZeilenImFenster(2000, 100, 24, 38.4)).toBe(23);
    expect(SEITEN_ZEILEN_MAX).toBeGreaterThan(12);
  });
});

describe("Ausblenden „sofort“ - der Ring direkt neben dem vollen Punkt (Johannes 13.11.2026)", () => {
  it("schon das gerade getippte Zeichen ist weg, das aktive bleibt", () => {
    expect(ausblendDeckkraft(0, AUSBLENDEN_SOFORT)).toBe(1);
    expect(ausblendDeckkraft(1, AUSBLENDEN_SOFORT)).toBe(0);
    expect(ausblendDeckkraft(5, AUSBLENDEN_SOFORT)).toBe(0);
  });
  it("„sofort“ bleibt beim Speichern erhalten und ist nicht „aus“", () => {
    expect(ausblendZeichenAus(String(AUSBLENDEN_SOFORT))).toBe(AUSBLENDEN_SOFORT);
    expect(ausblendZeichenAus(-7)).toBe(AUSBLENDEN_SOFORT);
    expect(ausblendZeichenAus("0")).toBe(0);
    expect(AUSBLENDEN_SOFORT).not.toBe(0);
  });
  it("eine Stufe vor „sofort“ (1 Zeichen) bleibt wie bisher", () => {
    expect(ausblendDeckkraft(1, 1)).toBe(1);
    expect(ausblendDeckkraft(2, 1)).toBe(0);
  });
});
