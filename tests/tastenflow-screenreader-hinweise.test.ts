/**
 * Die Tabellen in den Hilfen müssen in NVDA und JAWS wirklich vorkommen, und ihre
 * Namen dürfen nicht still veralten. Punkte: `BEFUND-2026-10-31-BRAILLEALPHABETE.md`.
 * Wo NVDA nicht installiert ist (Mac), prüft der Test nur die Texte.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { LERNWEGE_LISTE } from "../src/lib/typing/lernweg";
import { BRAILLE_TABELLEN, brailleTabellenSatz, SCREENREADER_HINWEISE } from "../src/lib/typing/screenreaderHinweise";

const TABELLEN = "C:/Program Files/NVDA/louis/tables/";

describe("Brailletabellen in den Hilfen", () => {
  it("jede Sprache hat Tabelle und Texte, ohne Gedankenstrich", () => {
    for (const w of LERNWEGE_LISTE) {
      expect(BRAILLE_TABELLEN[w].datei).toBeTruthy();
      const h = SCREENREADER_HINWEISE[w];
      const alle = [h.jawsRueckweg, h.tabelle, h.automatikFalsch, h.jawsNurComputer].join(" ");
      expect(alle).not.toMatch(/[–—]/);
      expect(h.jawsRueckweg).toContain("Alt + E");
      expect(brailleTabellenSatz(w)).toContain(BRAILLE_TABELLEN[w].nvda);
      expect(brailleTabellenSatz(w)).not.toContain("{");
    }
  });

  it("nie eine Computerbraille-Tabelle als Empfehlung (bg.ctb, ro.ctb, tr.ctb)", () => {
    for (const w of LERNWEGE_LISTE) expect(["bg.ctb", "ro.ctb", "tr.ctb"]).not.toContain(BRAILLE_TABELLEN[w].datei);
  });

  it.runIf(existsSync(TABELLEN))("die Tabellen liegen in NVDA", () => {
    for (const w of LERNWEGE_LISTE) expect(existsSync(TABELLEN + BRAILLE_TABELLEN[w].datei), w).toBe(true);
  });

  it("jede Hilfe zeigt die Zeilen", () => {
    for (const w of LERNWEGE_LISTE) {
      const nach = w === "de" ? "" : `.${w}`;
      expect(readFileSync(`src/components/typing/LehrerHilfe${nach}.tsx`, "utf8")).toContain(`<BrailleTabellenPunkte weg="${w}" />`);
      expect(readFileSync(`src/components/typing/TippenHilfe${nach}.tsx`, "utf8")).toContain(`<JawsRueckweg weg="${w}" />`);
    }
  });
});
