/**
 * Wächter für das gemeinsame Sprachmodul (Bauplan 2026-11-06 §1b):
 * Deutsch bleibt, was die Apps heute wählen; die Kennungen bleiben die von Tastenflow;
 * fehlt eine Stimme, kommt keine fremde.
 */
import { describe, it, expect } from "vitest";
import { SPRACH_TAG } from "@/lib/typing/vorlesen";
import { SPRACH_KENNUNG, sprachKennung, stimmeFuer, setzeStimme } from "@/lib/sprechen/stimmeFuer";

const v = (name: string, lang: string, standard = false) =>
  ({ name, lang, voiceURI: name, default: standard, localService: true }) as SpeechSynthesisVoice;

describe("stimmeFuer", () => {
  it("die Kennungen sind genau die von Tastenflow", () => {
    expect(SPRACH_KENNUNG).toEqual(SPRACH_TAG);
  });
  it("Deutsch: de-DE, für Plus de-AT (wie plus/stimme.ts)", () => {
    expect(sprachKennung("de")).toBe("de-DE");
    expect(sprachKennung("de", "plus")).toBe("de-AT");
  });
  it("br ist pt-BR, nicht Bretonisch", () => {
    expect(sprachKennung("br")).toBe("pt-BR");
  });
  it("wählt die genaue Region vor einer anderen", () => {
    const s = [v("Paulina", "es-MX"), v("Elvira", "es-ES")];
    expect(stimmeFuer("es", s)?.name).toBe("Elvira");
  });
  it("nimmt bei Deutsch jede de-Stimme, wie bisher", () => {
    expect(stimmeFuer("de", [v("Hedda", "de-AT"), v("Zira", "en-US")])?.name).toBe("Hedda");
  });
  it("vertauscht pt und br nie", () => {
    expect(stimmeFuer("br", [v("Helia", "pt-PT")])).toBeNull();
    expect(stimmeFuer("pt", [v("Maria", "pt-BR")])).toBeNull();
  });
  it("ohne Stimme der Sprache: null, keine deutsche oder englische Ersatzstimme", () => {
    expect(stimmeFuer("hu", [v("Katja", "de-DE", true), v("Zira", "en-US")])).toBeNull();
  });
  it("lässt Spass-Stimmen aus und nimmt die Standardstimme", () => {
    const s = [v("Bubbles", "en-GB"), v("Daniel", "en-GB"), v("Kate", "en-GB", true)];
    expect(stimmeFuer("en", s)?.name).toBe("Kate");
  });
  it("setzeStimme setzt ohne Stimme die Kennung", () => {
    const u = { lang: "", voice: null } as unknown as SpeechSynthesisUtterance;
    expect(setzeStimme(u, "sv", [])).toBe(false);
    expect(u.lang).toBe("sv-SE");
  });
});
