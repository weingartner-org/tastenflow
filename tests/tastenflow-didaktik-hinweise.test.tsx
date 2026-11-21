/**
 * ★ WÄCHTER: Hinweise für Lehrkräfte zur Didaktik (D-9, 28.09.2026).
 *
 * Dieselben Sätze stehen in der Lehrkraft-Hilfe (Abschnitt 4b) und im
 * Handbuch (Kapitel 4) - EINE Quelle: `lib/typing/didaktikHinweise.ts`.
 * Geprüft: alle vier Sprachen vollständig und je eigen geschrieben, die
 * Kennzahlen aus dem Code, nur Bindestrich, die Hausregeln je Sprache.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { ERSTES_TEMPO_ZIEL, SITZT_PROZENT, didaktikHinweise } from "@/lib/typing/didaktikHinweise";
import { TARGET_ACC } from "@/lib/typing/letters";
import { LV_STEP2_CPM } from "@/lib/typing/level";
import { DidaktikInhalt, didaktikAbschnittTitel } from "@/components/typing/DidaktikHinweise";
import type { Lang } from "@/lib/typing";

afterEach(cleanup);

const SPRACHEN: Lang[] = ["de", "en", "fr", "es"];
const IDS = ["dauer", "genauigkeit", "tempo", "reihenfolge", "grundstellung", "blindheit"];

describe("D-9: Hinweise zur Didaktik", () => {
  it("die Kennzahlen kommen aus dem Code", () => {
    expect(SITZT_PROZENT).toBe(Math.round(TARGET_ACC * 100));
    expect(ERSTES_TEMPO_ZIEL).toBe(LV_STEP2_CPM);
  });

  it.each(SPRACHEN)("%s: alle Absätze, Kennzahlen im Text, Quellen, nur Bindestrich", (lang) => {
    const h = didaktikHinweise(lang);
    expect(h.punkte.map((p) => p.id)).toEqual(IDS);
    const genau = h.punkte.find((p) => p.id === "genauigkeit")!.text;
    expect(genau).toContain(String(SITZT_PROZENT));
    expect(genau).toContain(String(ERSTES_TEMPO_ZIEL));
    expect(h.quellen.length).toBeGreaterThan(2);
    const alles = [h.titel, ...h.punkte.flatMap((p) => [p.kopf, p.text]), ...h.quellen].join(" ");
    expect(alles).not.toMatch(/[–—]/);
    // Kein anderes Programm beim Namen (Hausregel des Handbuchs).
    expect(alles).not.toMatch(/TIPP10|Typewriter|keybr|TypingClub|Tap'Touche|MecaNet|Mekanta|Pix\b/i);
  });

  it("jede Sprache ist eigen geschrieben - kein Absatz gleicht dem einer anderen", () => {
    for (const id of IDS) {
      const texte = SPRACHEN.map((l) => didaktikHinweise(l).punkte.find((p) => p.id === id)!.text);
      expect(new Set(texte).size).toBe(4);
    }
  });

  it("die Richtwerte sind die des jeweiligen Raums", () => {
    const tempo = (l: Lang) => didaktikHinweise(l).punkte.find((p) => p.id === "tempo")!.text;
    expect(tempo("de")).toMatch(/35.*50 Anschläge je Minute/);
    expect(tempo("de")).toMatch(/80 Anschläge je Minute.*120/);
    expect(tempo("en")).toMatch(/15, 25 and 35 words a minute/);
    expect(tempo("fr")).toMatch(/15, 25 et 35 mots par minute/);
    expect(tempo("es")).toMatch(/200 pulsaciones por minuto/);
  });

  it("Hausregeln: französische Hilfe mit geraden Anführungszeichen; Spanisch ohne ausgeschlossene Wörter; Englisch ohne Glossar-Verbote", () => {
    const text = (l: Lang) => {
      const h = didaktikHinweise(l);
      return [h.titel, ...h.punkte.flatMap((p) => [p.kopf, p.text]), ...h.quellen].join(" ");
    };
    expect(text("fr")).not.toMatch(/[«»]/);
    expect(text("fr")).not.toMatch(/\bfautes?\b/i);
    expect(text("es")).not.toMatch(/\b(profesores|alumnos|niños|ordenador|computadora|ciegos?|faltas)\b/i);
    expect(text("en")).not.toMatch(/blind typing|the blind\b|\bYear \d+\b|\bgrades?\b|\berrors?\b|\bWPM\b/i);
  });

  it.each(SPRACHEN)("%s: der Abschnitt 4b zeigt jeden Absatz", (lang) => {
    const { container } = render(<DidaktikInhalt lang={lang} />);
    for (const p of didaktikHinweise(lang).punkte) expect(container.textContent).toContain(p.text);
    expect(didaktikAbschnittTitel(lang)).toMatch(/^4b · /);
  });
});
