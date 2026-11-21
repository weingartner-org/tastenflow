import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  AUSGLEICH_LANGSAM,
  MIN_ZEILEN_JE_RUNDE,
  RUNDE_VOLL_MINUTEN,
  RUNDE_ZIEL_MINUTEN,
  STANDARD_ZEILEN,
  rundeMinuten,
  rundenWert,
  zeichenJeZeile,
  zeilenJeRunde,
} from "@/lib/typing/rundenlaenge";

/**
 * Die Runde nach Tempo bemessen (29.08.2026).
 *
 * Der Kern ist nicht eine der beiden Funktionen, sondern ihr ZUSAMMENSPIEL:
 * Wer weniger Zeilen je Runde bekommt, muss dafür mehr Runden machen - sonst
 * hätten wir die Übung gekürzt statt sie zu teilen, und das war ausdrücklich
 * nicht gewollt („Übezeit ist wichtig"). Der Ratschen-Test dazu ist
 * »gleich viel Übung, nur anders geteilt«.
 */
describe("Runde nach Tempo bemessen", () => {
  describe("zeilenJeRunde", () => {
    it("gibt die volle Runde, solange nichts gemessen ist", () => {
      expect(zeilenJeRunde(undefined, 8)).toBe(STANDARD_ZEILEN);
      expect(zeilenJeRunde(0, 8)).toBe(STANDARD_ZEILEN);
      expect(zeilenJeRunde(-5, 8)).toBe(STANDARD_ZEILEN);
    });

    it("verlängert eine Runde NIE - schnelle Kinder merken nichts", () => {
      for (const cpm of [60, 100, 190, 420]) {
        for (let n = 2; n <= 32; n++) {
          expect(zeilenJeRunde(cpm, n)).toBeLessThanOrEqual(STANDARD_ZEILEN);
        }
      }
    });

    it("kürzt die Runde für ein langsames Kind - aber nie unter die Untergrenze", () => {
      // 30 Anschläge/min mit vollem Alphabet: die volle Runde dauerte 16 Minuten.
      expect(zeilenJeRunde(30, 24)).toBeLessThan(STANDARD_ZEILEN);
      expect(zeilenJeRunde(30, 24)).toBeGreaterThanOrEqual(MIN_ZEILEN_JE_RUNDE);
      expect(zeilenJeRunde(5, 24)).toBe(MIN_ZEILEN_JE_RUNDE);
    });

    it("hält die Runde unter der Zielzeit, wo die Untergrenze es zulässt", () => {
      for (const cpm of [30, 45, 60, 100]) {
        for (let n = 2; n <= 24; n++) {
          const zeilen = zeilenJeRunde(cpm, n);
          if (zeilen > MIN_ZEILEN_JE_RUNDE) {
            expect(rundeMinuten(zeilen, n, cpm)).toBeLessThanOrEqual(
              RUNDE_ZIEL_MINUTEN,
            );
          }
        }
      }
    });

    it("die frühe Runde bleibt auch für ein sehr langsames Kind ganz", () => {
      // Mit f und j hat eine Zeile 11 Zeichen: 12 Zeilen sind bei 30/min
      // vier Minuten - da gibt es nichts zu teilen.
      expect(zeilenJeRunde(30, 2)).toBe(STANDARD_ZEILEN);
    });
  });

  describe("rundenWert", () => {
    const lang = 10 * 60000; // zehn Minuten - die Zeit deckelt hier nie

    it("eine volle Runde in üblichem Tempo zählt 1,0", () => {
      expect(rundenWert(STANDARD_ZEILEN, lang)).toBe(1);
    });

    it("eine halb so lange Runde zählt halb - plus den Ausgleich", () => {
      expect(rundenWert(STANDARD_ZEILEN / 2, lang)).toBeCloseTo(
        0.5 * AUSGLEICH_LANGSAM,
        10,
      );
    });

    it("eine in Sekunden weggetippte Runde zählt anteilig", () => {
      expect(rundenWert(STANDARD_ZEILEN, RUNDE_VOLL_MINUTEN * 60000)).toBe(1);
      expect(
        rundenWert(STANDARD_ZEILEN, (RUNDE_VOLL_MINUTEN / 2) * 60000),
      ).toBeCloseTo(0.5, 10);
    });

    it("ohne Zeitmessung entscheiden allein die Zeilen", () => {
      // Eine fehlende Messung darf ein Kind nie bremsen.
      expect(rundenWert(STANDARD_ZEILEN)).toBe(1);
      expect(rundenWert(STANDARD_ZEILEN, 0)).toBe(1);
    });

    it("zählt nie mehr als 1,0 - auch eine lange Serien-Etappe nicht", () => {
      // Johannes 28.07.2026: eine Etappe zählt „genauso viel wie eine
      // Übungsrunde", nicht mehr.
      expect(rundenWert(18, lang)).toBe(1);
      expect(rundenWert(60, lang)).toBe(1);
    });

    it("ist nie negativ", () => {
      expect(rundenWert(0, lang)).toBeGreaterThanOrEqual(0);
      expect(rundenWert(-3, lang)).toBeGreaterThanOrEqual(0);
    });
  });

  describe("RATSCHE: geteilt, ausgeglichen - aber nicht ganz", () => {
    const langGenug = 60 * 60000; // die Zeit deckelt hier nie

    it("kürzere Runden ⇒ entsprechend mehr Runden bis zur neuen Taste", () => {
      // Das Pensum einer Taste steckt in `mindestRundenFuer` und ist in
      // STANDARD-Runden gerechnet. Eine gekürzte Runde zählt ihren Anteil -
      // mal dem Ausgleich, sonst nichts. Zeilen ÷ Wert muss deshalb überall
      // DENSELBEN Wert ergeben, nicht irgendwo mehr und irgendwo weniger.
      const voll = STANDARD_ZEILEN / AUSGLEICH_LANGSAM;
      for (const cpm of [10, 20, 30, 45, 60, 100, 190]) {
        for (let n = 2; n <= 24; n++) {
          const zeilen = zeilenJeRunde(cpm, n);
          const wert = rundenWert(zeilen, langGenug);
          // Unterhalb der Deckel-Grenze gilt der Ausgleich glatt; darüber (10/11
          // Zeilen und die volle Runde) gewinnt der Deckel.
          const soll = zeilen < voll ? voll : zeilen;
          expect(zeilen / wert).toBeCloseTo(soll, 6);
        }
      }
    });

    it("der Deckel gewinnt am Rand - eine Runde zählt nie mehr als 1,0", () => {
      for (let zeilen = 1; zeilen <= 60; zeilen++) {
        expect(rundenWert(zeilen, langGenug)).toBeLessThanOrEqual(1);
      }
      // …und mehr Zeilen zählen nie WENIGER als weniger Zeilen.
      for (let zeilen = 2; zeilen <= 60; zeilen++) {
        expect(rundenWert(zeilen, langGenug)).toBeGreaterThanOrEqual(
          rundenWert(zeilen - 1, langGenug),
        );
      }
    });

    it("NICHT ganz ausgeglichen: die kürzeste Runde bleibt deutlich unter einer vollen", () => {
      // Johannes 29.08.2026: „Wer so viel langsamer tippt, braucht auch länger
      // für die nächste Taste." Der Ausgleich darf also nie so groß werden, dass
      // eine kurze Runde so viel zählt wie eine ganze - sonst wäre das Tempo
      // vollständig herausgerechnet und ein langsames Kind übte weniger als alle
      // anderen.
      expect(rundenWert(MIN_ZEILEN_JE_RUNDE, langGenug)).toBeLessThan(0.5);
      // Dasselbe als Aussage über den Regler selbst, damit ein späterer Dreh
      // daran die Entscheidung nicht still umdreht.
      expect(AUSGLEICH_LANGSAM).toBeGreaterThan(1);
      expect(AUSGLEICH_LANGSAM).toBeLessThan(STANDARD_ZEILEN / MIN_ZEILEN_JE_RUNDE);
    });

    it("ein langsames Kind wird durch die ZEIT-Regel nicht zusätzlich gebremst", () => {
      // Gemessen (`scripts/_langsam.mts`): Bei 30 Anschlägen/min bleibt es bei
      // rund 25 Stunden bis zu allen 24 Tasten - die Zeit-Regel greift dort nie,
      // weil jede Runde ohnehin länger als RUNDE_VOLL_MINUTEN dauert.
      for (let n = 2; n <= 24; n++) {
        const zeilen = zeilenJeRunde(30, n);
        const ms = rundeMinuten(zeilen, n, 30) * 60000;
        const ohneZeit = rundenWert(zeilen, undefined);
        expect(rundenWert(zeilen, ms)).toBeCloseTo(ohneZeit, 6);
      }
    });
  });

  describe("zeichenJeZeile (gemessen, scripts/_zeilenlaenge.mts)", () => {
    it("wächst mit dem Tastenstand und bleibt jenseits der Messung stehen", () => {
      expect(zeichenJeZeile(2)).toBeCloseTo(11.1, 5);
      expect(zeichenJeZeile(24)).toBeCloseTo(35.5, 5);
      expect(zeichenJeZeile(99)).toBe(zeichenJeZeile(24));
      expect(zeichenJeZeile(0)).toBe(zeichenJeZeile(2));
      expect(zeichenJeZeile(24)).toBeGreaterThan(zeichenJeZeile(8));
    });
  });

  describe("WÄCHTER: beide Stellen zählen dieselbe Währung", () => {
    // Der Zähler `rundenOhneTaste` wird an ZWEI Stellen fortgeschrieben. Wird
    // eine davon vergessen, zählt ein Trainer Runden und der andere Übung -
    // und niemand merkt es (Muster: „zwei Stellen, die voneinander nichts
    // wissen", 28.08.2026).
    const lies = (p: string) =>
      readFileSync(resolve(__dirname, "..", "src/components/typing", p), "utf8");

    it("»Mein Training« verbucht die Runde über rundenWert, nicht mit + 1", () => {
      const src = lies("AdaptiveTrainer.tsx");
      expect(src).toContain("rundenWert(");
      expect(src).toContain("zeilenJeRunde(");
      expect(src).not.toMatch(/rundenOhneTaste\s*\?\?\s*0\)\s*\+\s*1\b/);
    });

    it("der Serien-Trainer zählt eine Etappe bewusst weiter als volle Runde", () => {
      // Entscheidung Johannes 28.07.2026 - hier festgehalten, damit ein
      // späterer Umbau sie SIEHT, statt sie versehentlich umzudrehen.
      const src = lies("SerienTrainer.tsx");
      expect(src).toMatch(/rundenOhneTaste\s*\?\?\s*0\)\s*\+\s*1\b/);
    });
  });
});
