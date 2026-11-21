/**
 * Eigene Plakate auf Bulgarisch, Griechisch, Ukrainisch und Ungarisch (06.11.2026):
 * die Größe im Katalog stimmt mit der Datei in `public/` überein, jede Datei ist
 * ein PDF mit einer Seite (A3), und die Bedienung der Sprache lädt ihre eigene
 * Datei, offen unter `/` (Werbematerial, wie das deutsche und englische Plakat).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { downloadAdresse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

const WURZEL = resolve(__dirname, "..");
const SPRACHEN = ["bg", "el", "uk", "hu"] as const;

describe("Plakate bg/el/uk/hu", () => {
  for (const sprache of SPRACHEN) {
    it(`${sprache}: Datei, Größe, eine Seite A3, eigene Adresse`, () => {
      const plakat = tastenflowPlakat();
      const eintrag = plakat[sprache]!;
      expect(eintrag.datei).toBe(`tastenflow-plakat-${sprache}.pdf`);
      const pdf = readFileSync(resolve(WURZEL, "public", eintrag.datei!));
      expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-");
      expect(pdf.length).toBe(eintrag.bytes);
      const text = pdf.toString("latin1");
      expect((text.match(/\/Type\s*\/Page(?!s)/g) ?? []).length).toBe(1);
      expect(text).toMatch(/\/MediaBox\s*\[\s*0\s+0\s+841\.9\d*\s+1191\.\d+\s*\]/);
      const h = handbuchInSprache(plakat, sprache);
      expect(h.datei).toBe(eintrag.datei);
      expect(h.titel).toBe(eintrag.titel);
      expect(h.bytes).toBe(eintrag.bytes);
      expect(downloadAdresse(h)).toBe(`/${eintrag.datei}`);
    });
  }
});
