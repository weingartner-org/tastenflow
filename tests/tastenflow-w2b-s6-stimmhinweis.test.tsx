/**
 * ★★ W2b Punkt 5 = S6 aus dem Windows-Befund §3.5 (28.09.2026): der Hinweis
 * „No hay ninguna voz en español instalada" kam nur, wenn das Vorlesen VOR dem
 * Sprachwechsel an war. Jetzt auch, wenn es DANACH eingeschaltet wird
 * (Einrichtung Schritt „Ton", Zahnrad, Vorlese-Knopf).
 *
 *  1. Die Regel `stimmeBeimEinschalten`, rein.
 *  2. Die Seite hängt sie an den Übergang „Vorlesen aus ⇒ an".
 *  3. Der Windows-Wortlaut: „Texto a voz" (Microsoft-Support es-es).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { stimmeBeimEinschalten } from "@/lib/typing/stimmHinweis";

const GRUND = {
  warAn: false,
  istAn: true,
  lang: "es",
  gewaehlt: "",
  gewaehltSprache: null,
  stimmeFuerSprache: null,
  stimmenDa: true,
};

describe("1 · stimmeBeimEinschalten", () => {
  it("★★ Vorlesen eingeschaltet, Übungssprache Spanisch, keine spanische Stimme ⇒ der Hinweis", () => {
    expect(stimmeBeimEinschalten(GRUND)).toEqual({ art: "hinweis" });
  });
  it("es gibt eine spanische Stimme ⇒ sie wird gewählt (statt der deutschen Vorgabe)", () => {
    expect(stimmeBeimEinschalten({ ...GRUND, stimmeFuerSprache: "Helena" })).toEqual({
      art: "stimme",
      uri: "Helena",
    });
  });
  it("eine passende Stimme ist schon gewählt ⇒ nichts", () => {
    expect(
      stimmeBeimEinschalten({ ...GRUND, gewaehlt: "Jorge", gewaehltSprache: "es-ES", stimmeFuerSprache: "Helena" }),
    ).toBeNull();
  });
  it("eine UNPASSENDE Stimme ist gewählt (deutsch) ⇒ trotzdem Hinweis bzw. Wechsel", () => {
    expect(stimmeBeimEinschalten({ ...GRUND, gewaehlt: "Katja", gewaehltSprache: "de-DE" })).toEqual({
      art: "hinweis",
    });
  });
  it("nur beim Übergang aus ⇒ an; Ausschalten und „war schon an\" ⇒ nichts", () => {
    expect(stimmeBeimEinschalten({ ...GRUND, warAn: true })).toBeNull();
    expect(stimmeBeimEinschalten({ ...GRUND, istAn: false })).toBeNull();
  });
  it("Deutsch braucht nichts; ohne Stimmenliste (lädt noch) kein Hinweis", () => {
    expect(stimmeBeimEinschalten({ ...GRUND, lang: "de" })).toBeNull();
    expect(stimmeBeimEinschalten({ ...GRUND, stimmenDa: false })).toBeNull();
  });
  it("gilt für jede Übungssprache ausser Deutsch (en, fr)", () => {
    expect(stimmeBeimEinschalten({ ...GRUND, lang: "fr" })).toEqual({ art: "hinweis" });
    expect(stimmeBeimEinschalten({ ...GRUND, lang: "en" })).toEqual({ art: "hinweis" });
  });
});

describe("2 · die Übungsseite hängt es an den Vorlese-Schalter", () => {
  const seite = readFileSync(resolve(__dirname, "../src/features/public/TippenTrainerPage.tsx"), "utf8");
  it("ein Effekt am Vorlese-Zustand zeigt die Anleitung (`setShowVoiceInstall(true)`)", () => {
    expect(seite).toMatch(
      /const folge = stimmeBeimEinschalten\(\{[\s\S]*?else if \(folge\?\.art === "hinweis"\) setShowVoiceInstall\(true\);[\s\S]*?\}, \[vorlesenAn\]\);/,
    );
  });
});

describe("3 · der Windows-Wortlaut in der spanischen Anleitung", () => {
  const hilfe = readFileSync(resolve(__dirname, "../src/components/typing/VoiceInstallHelp.tsx"), "utf8");
  it("„Texto a voz\" (Windows 11 ES), nicht mehr „Síntesis de voz\"", () => {
    expect(hilfe).toContain("<b>Texto a voz</b>");
    expect(hilfe).not.toMatch(/<b>Síntesis de voz<\/b>/);
  });
});
