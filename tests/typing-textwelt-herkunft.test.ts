/**
 * TW-E5 (Textwelt): Herkunfts-/Rechte-Datenmodell + „Quellen & Dank"-Sammlung
 * (§10 CC-Namensnennung). Prüft:
 *  • jede Serie MIT Herkunft besteht die Rechte-Prüfung (Quelle+Lizenz da,
 *    CC-BY ⇒ Autor, kein ND),
 *  • collectHerkunft sammelt entdoppelt und listet die selbst verfasste Pilot-
 *    Serie,
 *  • das harte Rechte-Gate `validateHerkunft` weist ND ab und verlangt bei CC-BY
 *    die Namensnennung (Grundlage der Kurations-Pipeline TW-E5+).
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md §10
 */
import { describe, it, expect } from "vitest";
import { SERIEN, collectHerkunft, validateHerkunft } from "../src/lib/typing";

describe("TW-E5 — Herkunft/Rechte", () => {
  it("jede Serie mit Herkunft besteht die Rechte-Prüfung", () => {
    for (const s of SERIEN) {
      if (!s.herkunft) continue;
      const p = validateHerkunft(s.herkunft);
      expect(p, `${s.slug}: ${p.join("; ")}`).toEqual([]);
    }
  });

  it("collectHerkunft listet die selbst verfasste Pilot-Serie (entdoppelt)", () => {
    const hs = collectHerkunft();
    expect(hs.length).toBeGreaterThanOrEqual(1);
    expect(hs.some((h) => h.quelle === "Sensorik" && /eigenes werk/i.test(h.lizenz))).toBe(true);
    // Kein Duplikat: eindeutige Quelle+Lizenz+Autor-Schlüssel.
    const keys = hs.map((h) => `${h.quelle}|${h.lizenz}|${h.autor ?? ""}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("validateHerkunft: ND ausgeschlossen, CC-BY verlangt Autor", () => {
    // gültig: CC-BY-SA MIT Autor
    expect(
      validateHerkunft({ quelle: "Klexikon", lizenz: "CC-BY-SA 4.0", autor: "Klexikon-Autoren" }),
    ).toEqual([]);
    // gültig: gemeinfrei ohne Autor
    expect(validateHerkunft({ quelle: "Grimm (Nacherzählung)", lizenz: "gemeinfrei" })).toEqual([]);
    // ungültig: CC-BY ohne Autor
    expect(
      validateHerkunft({ quelle: "StoryWeaver", lizenz: "CC-BY 4.0" }).some((p) => /autor|namensnennung/i.test(p)),
    ).toBe(true);
    // ungültig: ND-Lizenz
    expect(
      validateHerkunft({ quelle: "Irgendwo", lizenz: "CC-BY-ND 4.0", autor: "X" }).some((p) => /nd/i.test(p)),
    ).toBe(true);
    // ungültig: Pflichtfeld fehlt
    expect(validateHerkunft({ quelle: "", lizenz: "" }).length).toBeGreaterThanOrEqual(2);
  });
});
