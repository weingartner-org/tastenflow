/**
 * ★★★ Johannes 31.10.2026: Die Übungszeile nennt in JEDER Sprache sich selbst, damit NVDA, JAWS und Narrator wissen, welche Sprache
 * sie sprechen („ist doch logisch"). it/pl/tr/cs trugen bis dahin `lang="en"` aus der Gerüst-Zeit (mit NVDA gemessen: `<LANG:en_GB>`).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { feinesLangAttribut } from "../src/lib/typing/schreibweise";

describe("lang der Übungszeile", () => {
  it.each(["bg", "el", "hu", "nl", "pt", "ro", "sv", "uk", "it", "pl", "tr", "cs", "es", "de"] as const)("%s nennt sich selbst", (s) => {
    expect(feinesLangAttribut(s)).toBe(s);
  });
  it("Brasilien heisst pt-BR, nie br (Bretonisch)", () => {
    expect(feinesLangAttribut("br")).toBe("pt-BR");
  });
  it("Englisch und Französisch bleiben Englisch und Französisch", () => {
    expect(feinesLangAttribut("en")).toMatch(/^en/);
    expect(feinesLangAttribut("fr")).toMatch(/^fr/);
  });
  it.each([
    "BuchstabensalatLauf", "IgluLauf", "RaetselLauf", "SerienTrainer", "StoryOffer", "PupilStatsPanel", "StandZeile", "VoiceInstallHelp", "Wortspiele",
  ])("%s setzt kein rohes lang (br wäre Bretonisch)", (name) => {
    const q = readFileSync(resolve(__dirname, "../src/components/typing", name + ".tsx"), "utf8");
    expect(q).toMatch(/feinesLangAttribut\(|htmlLang\(/);
    expect(q).not.toMatch(/lang=\{(serie|s)\.lang \?\? "de"\}|lang=\{bereichAktiv \? lang|lang=\{sprache === "de"|lang=\{namenSprache === "de"/);
  });
});
