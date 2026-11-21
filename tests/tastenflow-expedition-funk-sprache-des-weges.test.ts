/**
 * ★★ Johannes 28.09.2026 („Sprache des Weges"): Die Funkstation der Expedition
 * prüft Lösungen im Lexikon des WEGES. Bis dahin stand dort fest
 * `lexikonWoerter("de")` - ein spanisches Kind, das ein anderes echtes
 * spanisches Wort aus denselben Buchstaben fand, bekam „falsch".
 *
 * Fehlerklasse: eine fest eingetragene Sprache im Expeditions-Code. Der Wächter
 * liest darum ALLE Expeditions-Dateien, nicht nur die eine reparierte Zeile.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { lexikonWoerter } from "@/lib/typing/lexicon";

const ORDNER = ["src/components/typing/expedition", "src/lib/typing/expedition"];

function quelltexte(): { datei: string; text: string }[] {
  return ORDNER.flatMap((o) =>
    readdirSync(o)
      .filter((d) => /\.(ts|tsx)$/.test(d))
      .map((d) => ({ datei: join(o, d), text: readFileSync(join(o, d), "utf8") })),
  );
}

describe("★★ Expedition: keine fest eingetragene Sprache für Wortprüfung und Sprachpaket", () => {
  it("kein lexikonWoerter(\"de\") und kein ladeSprachpakete([\"de\"]) im Expeditions-Code", () => {
    const funde = quelltexte().flatMap(({ datei, text }) =>
      [...text.matchAll(/lexikonWoerter\(\s*"(de|en|fr|es)"\s*\)|ladeSprachpakete\(\s*\[\s*"(de|en|fr|es)"\s*\]\s*\)/g)].map(
        (m) => `${datei}: ${m[0]}`,
      ),
    );
    expect(funde).toEqual([]);
  });

  it("die Prüfung hat auf Spanisch wirklich etwas zu finden: amor · ramo · mora · roma im spanischen Lexikon", () => {
    const es = new Set(lexikonWoerter("es"));
    const treffer = ["amor", "ramo", "mora", "roma"].filter((w) => es.has(w));
    expect(treffer.length, `gefunden: ${treffer.join(", ")}`).toBeGreaterThanOrEqual(2);
  });
});
