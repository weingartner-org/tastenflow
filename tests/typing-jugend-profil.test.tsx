/**
 * Pins der Jugend-Tonlage (AG-E2/E3, 29.07.2026 — Weichen 1–3, Johannes):
 * ab 11 gilt ein eigenes Profil »jugend« (du, aber trocken), mit neutralen
 * Abzeichen-Namen. Diese Tests sichern die MECHANIK; die Inhalts-Ratsche
 * (Doppel-Freigaben, Mindest-Versorgung) liegt in typing-altersgrenze.test.ts.
 *
 * ★ Der TIPP-SPRINT, der hier bis zum 22.08.2026 als Belohnung der Tonlage
 * geprüft wurde, ist ersatzlos entfallen (Charge »SCHLANK«): Er wiederholte
 * die wackligsten Zeichen - genau das, was »Mein Training« ohnehin bevorzugt
 * übt. Geblieben ist die Wahl zwischen keinem Spiel (Vorgabe) und der
 * Eisschollen-Expedition.
 */
import { describe, it, expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import {
  BADGES,
  UI_COPY,
  badgeName,
  gateModeFor,
  skinForStufe,
} from "../src/lib/typing";

afterEach(() => {
  cleanup();
});

describe("Weiche 1 — drei Tonlagen", () => {
  it("ab 11 gilt »jugend«, die Grenze liegt nicht mehr bei den Erwachsenen", () => {
    expect(skinForStufe("teens")).toBe("jugend");
    expect(skinForStufe("kids")).toBe("kind");
    expect(skinForStufe("erwachsen")).toBe("erwachsen");
    // Die alten Inhalts-/Konto-Etiketten folgen der Migration aus account.ts.
    expect(skinForStufe("c")).toBe("jugend");
    expect(skinForStufe("b")).toBe("jugend");
    expect(skinForStufe("a")).toBe("kind");
  });

  it("die Jugend-Kopie ist per Du, aber trocken: kein Ausrufezeichen, kein »Super«, kein »Sie«", () => {
    const j = UI_COPY.jugend;
    const texts = [
      j.subtitle,
      j.textstufeLabel,
      j.progressLabel,
      j.retry,
      j.locked,
      ...[0, 1, 2, 3].flatMap((n) => [
        j.summaryTitle(n),
        j.summaryRemark(n),
        j.starsSpoken(n),
      ]),
    ];
    for (const t of texts) {
      expect(t, `Jubel-Zeichen in: »${t}«`).not.toContain("!");
      expect(t.toLowerCase(), `»super« in: »${t}«`).not.toContain("super");
      // Kein »Sie«/»Ihr« als Anrede (Wortanfang, großgeschrieben mitten im Satz
      // wäre Anrede — am Satzanfang prüfen wir gegen die bekannten Sie-Floskeln).
      expect(t, `Sie-Anrede in: »${t}«`).not.toMatch(/\bSie\b|\bIhre?\b/);
    }
    // Und per Du, wo eine Anrede nötig ist:
    expect(j.locked).toContain("Schließ");
  });
});

describe("Weiche 2 — Belohnung je Profil", () => {
  it("kind spielt die Expedition, jugend nach Wahl, Erwachsene bekommen keins", () => {
    expect(gateModeFor("kind", "keins")).toBe("expedition");
    expect(gateModeFor("kind", "expedition")).toBe("expedition");
    expect(gateModeFor("jugend", "keins")).toBe("keins");
    expect(gateModeFor("jugend", "expedition")).toBe("expedition");
    expect(gateModeFor("erwachsen", "keins")).toBe("keins");
    expect(gateModeFor("erwachsen", "expedition")).toBe("keins");
  });
});

describe("Weiche 3 — Abzeichen-Namen je Tonlage", () => {
  it("kind sieht Maskottchen, jugend + erwachsen den neutralen Zweitnamen", () => {
    const pp = BADGES.find((b) => b.id === "praezisions-pinguin")!;
    expect(badgeName(pp, "kind")).toBe("Präzisions-Pinguin");
    expect(badgeName(pp, "jugend")).toBe("Dreimal sauber");
    expect(badgeName(pp, "erwachsen")).toBe("Dreimal sauber");
  });

  it("ohne Zweitnamen gilt der Name für alle (idiomatische Namen bleiben)", () => {
    const gt = BADGES.find((b) => b.id === "gewohnheitstier")!;
    expect(badgeName(gt, "jugend")).toBe("Gewohnheitstier");
  });
});
