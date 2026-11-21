/**
 * Wächter zu den zwei Funden des NVDA-Laufs vom 31.10.2026.
 *
 * 1. Die Einrichtung der neun neuen Sprachen fiel still auf Deutsch zurück.
 * 2. Das erste Alt + V blieb stumm: Beim Einschalten des Vorlesens wählt die Seite die Stimme der
 *    Sprache, und `setVoiceURI` brach dabei das eben begonnene „Vorlesen an" ab.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EINRICHTUNG_STEP_ORDER, einrichtungTexte } from "../src/lib/typing/einrichtung";
import { useVoice } from "../src/lib/typing/voice";

const NEUN = ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"] as const;

describe("Einrichtung der neun Sprachen", () => {
  const de = einrichtungTexte("de");
  const en = einrichtungTexte("en");

  it.each(NEUN)("%s: alles eigen, nichts Deutsches oder Englisches", (s) => {
    const t = einrichtungTexte(s);
    for (const id of EINRICHTUNG_STEP_ORDER) {
      expect(t.titel[id], id).toBeTruthy();
      expect(t.titel[id], id).not.toBe(de.titel[id]);
      expect(t.titel[id], id).not.toBe(en.titel[id]);
      expect(t.weiter[id], id).toBeTruthy();
      expect(t.weiter[id], id).not.toBe(de.weiter[id]);
      expect(t.weiter[id], id).not.toBe(en.weiter[id]);
    }
    expect(t.skipLabel).not.toBe(de.skipLabel);
    expect(t.fussnote).not.toBe(de.fussnote);
    expect(t.geburtsjahrLabel).not.toBe(de.geburtsjahrLabel);
    expect(t.geburtsjahrErklaerung).not.toBe(de.geburtsjahrErklaerung);
    expect(t.skipAnsage).toContain("Alt + R");
  });

  it.each(NEUN)("%s: keine Gedankenstriche", (s) => {
    expect(JSON.stringify(einrichtungTexte(s))).not.toMatch(/[–—]/);
  });

  it("Gegenprobe: die alten Sprachen bleiben, wie sie sind", () => {
    expect(de.weiter.alter).toBe("Weiter");
    expect(en.weiter.alter).toBe("Next");
    expect(einrichtungTexte("cs").weiter.alter).toBe("Další");
  });
});

describe("Stimmenwahl beim Einschalten bricht die Ansage nicht ab", () => {
  let cancel: ReturnType<typeof vi.fn>;
  const vorher = window.speechSynthesis;

  beforeEach(() => {
    cancel = vi.fn();
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speaking: true,
        pending: false,
        paused: false,
        cancel,
        speak: vi.fn(),
        resume: vi.fn(),
        getVoices: () => [],
        addEventListener: vi.fn(),
      },
    });
  });
  afterEach(() => {
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: vorher });
  });

  it("ohneAbbruch: Stimme gesetzt, kein cancel", () => {
    useVoice.getState().setVoiceURI("stimme-a", { ohneAbbruch: true });
    expect(useVoice.getState().voiceURI).toBe("stimme-a");
    expect(cancel).not.toHaveBeenCalled();
  });

  it("Gegenprobe: die Wahl im Menü bricht weiter ab", () => {
    useVoice.getState().setVoiceURI("stimme-b");
    expect(useVoice.getState().voiceURI).toBe("stimme-b");
    expect(cancel).toHaveBeenCalled();
  });

  it("die Seite wählt beim Einschalten ohne Abbruch", () => {
    const seite = readFileSync(resolve(__dirname, "../src/features/public/TippenTrainerPage.tsx"), "utf8");
    expect(seite).toContain('if (folge?.art === "stimme") setVoiceURI(folge.uri, { ohneAbbruch: true });');
  });
});
