/**
 * ★★★★★ EINE ANSAGE, EINE STIMME.
 *
 * Johannes am iPad, 03.09.2026 abends:
 *
 *   „bei VoiceOver am iPad wenn ich zwei mal umschalt drücke kommt klingt es
 *    wie wenn zwei stimmen sprechen, hier spricht dann auch die vorlese stimme
 *    mit."
 *
 * Genau so war es gebaut: `announce()` füllt den Live-Bereich (der
 * Screenreader spricht) und `speakUiAlways()` sprach ZUSÄTZLICH mit der
 * eigenen Stimme - unabhängig vom Vorlesen-Schalter. Bei „Vorlesen aus" kam
 * damit beides übereinander.
 *
 * ── DIE REGEL, DIE DIESER WÄCHTER FESTNAGELT ──────────────────────────────
 *
 *   Wo `announce` schon steht, gehört `speakUi` daneben - NIE `speakUiAlways`.
 *
 * `speakUiAlways` bleibt genau EINEM Fall vorbehalten: der Ansage „Vorlesen
 * aus." Die kann der Schalter selbst nicht mehr durchlassen, weil er in dem
 * Augenblick schon aus ist.
 *
 * ⚠️ Warum ein Wächter über den QUELLTEXT und kein Verhaltenstest: Die Sache
 * wiederholt sich. Sie stand an ZWEI Stellen (doppelte Umschalttaste und der
 * Speicher-Streifen), und die zweite fand sich erst beim Nachsehen. Ein
 * Verhaltenstest deckt die eine Stelle ab, die er kennt - dieser hier deckt
 * auch die ab, die morgen jemand dazuschreibt.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Die Dateien, in denen Tastenflow selbst ansagt. */
const DATEIEN = [
  "src/components/typing/TypingSession.tsx",
  "src/features/public/TippenTrainerPage.tsx",
];

/** Der eine erlaubte Fall - die Ansage, die der Schalter nicht mehr durchliesse. */
const VORLESEN_AUS = /speakUiAlways\("Vorlesen aus\."\)/;
/**
 * ★ Derselbe Fall in der englischen Bedienung (Probestück 12.09.2026): der
 * englische Satz mit englischer Stimme. Wörtlich festgehalten, damit hier
 * nicht nebenbei ein zweiter, anderer Aufruf durchrutscht.
 */
const VORLESEN_AUS_EN = /speakUiAlways\(SEITEN_TEXTE\.en\.vorlesenAus, undefined, "en"\)/;
/**
 * ★ E11a-5 (26.09.2026): dieselbe Stelle für jede Bedienung ausser Deutsch
 * (englisch UND französisch) - der Satz und die Stimme der Bedienung. Wörtlich
 * festgehalten wie oben.
 */
const VORLESEN_AUS_FREMD = /speakUiAlways\(SEITEN_TEXTE\[sprache\]\.vorlesenAus, undefined, sprache\)/;
const ERLAUBT = new RegExp(`${VORLESEN_AUS.source}|${VORLESEN_AUS_EN.source}|${VORLESEN_AUS_FREMD.source}`);

describe("Eine Ansage, eine Stimme", () => {
  for (const datei of DATEIEN) {
    it(`${datei}: kein speakUiAlways ausser der Vorlesen-aus-Ansage`, () => {
      const quelle = readFileSync(resolve(__dirname, "..", datei), "utf-8");
      const treffer = quelle
        .split("\n")
        // Kommentare und Importe erklären die Regel - sie brechen sie nicht.
        .filter((z) => {
          const t = z.trim();
          if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return false;
          if (/^import\b|^\s*speakUiAlways,$/.test(t)) return false;
          return t.includes("speakUiAlways(");
        })
        .filter((z) => !ERLAUBT.test(z));

      expect(
        treffer,
        "Wo `announce` schon steht, gehört `speakUi` daneben - sonst sprechen " +
          "bei „Vorlesen aus\" zwei Stimmen übereinander:\n" +
          treffer.map((z) => "    " + z.trim()).join("\n"),
      ).toEqual([]);
    });
  }

  it("★ die Gegenprobe: die Vorlesen-aus-Ansage darf bleiben", () => {
    // Ohne diesen Test wäre der Wächter oben auch grün, wenn jemand
    // `speakUiAlways` restlos entfernte - und dann bliebe das Abschalten des
    // Vorlesens unbestätigt, weil der Schalter da schon aus ist.
    const quelle = readFileSync(
      resolve(__dirname, "..", "src/features/public/TippenTrainerPage.tsx"),
      "utf-8",
    );
    // Die DEUTSCHE Fassung - die englische allein genügte nicht.
    expect(VORLESEN_AUS.test(quelle)).toBe(true);
  });
});
