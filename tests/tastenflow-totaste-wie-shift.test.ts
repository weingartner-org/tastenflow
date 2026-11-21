/**
 * ★★★ E4 (25.09.2026, Bauplan französischer Lehrgang §4.3 Punkt 3, §14 E4):
 * DER TOTASTEN-WÄCHTER.
 *
 * Überall, wo `key === "Shift"` eine Ausnahme hat (die Umschalttaste zählt an
 * dieser Stelle weder als Treffer noch als Fehler, ausser sie IST das Ziel),
 * braucht `"Dead"` eine GLEICHWERTIGE Ausnahme - sonst kostet jede Totaste
 * (auf einer französischen Tastatur: `^`/`¨`) an dieser Stelle ein Herz oder
 * einen Fehlanschlag, ganz gleich wie genau ein Kind trifft. Genau DAS war
 * die Schneerutschen-Falle vom 20.09.2026 mit der Umschalttaste (BEFUND, §4.1
 * des Bauplans) - dieselbe Fehlerklasse trifft jede Totaste, wenn niemand sie
 * behebt.
 *
 * Dieser Wächter ist bewusst GREP-BASIERT und prüft eine FEHLERKLASSE, keine
 * Einzelstellen (Bauplan, Auftrag E4 Punkt 3): jede Datei im
 * Tastenflow-eigenen Quelltext (`src/components/typing/`, `src/lib/typing/`),
 * die `key === "Shift"` oder `key !== "Shift"` (mit oder ohne `e.`-Vorsatz)
 * enthält, muss auch das Wort „Dead" enthalten - entweder als ECHTE
 * Behandlung (eigener Zweig, der `Dead` genauso wie `Shift` abfängt) oder als
 * BEGRÜNDUNG im Kommentar, warum die Stelle keine eigene Ausnahme braucht
 * (z. B. weil sie nur Bedien-UI ist, keine Wertung).
 *
 * ⚠️ Ausserhalb dieses Wächters (bewusst NICHT geprüft, andere Reviere):
 *  · `src/components/braille/`, `src/components/klangpunkte/`,
 *    `src/components/mathecoach/` - andere Apps (Punktgenau, Klangpunkte,
 *    Mathecoach), nicht Tastenflow.
 *  · `src/lib/computer/chord.ts` - Tastenkürzel der SEITE (Alt+H), von FÜNF
 *    Apps gemeinsam benutzt (`GEMEINSAM.md`) - Änderungen dort nur mit
 *    Johannes' Ja (Bauplan §15 Falle 16), kein E4-Auftrag.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { describe, expect, it } from "vitest";

const WURZEL = resolve(__dirname, "..");

/** Nur Tastenflows EIGENER Quelltext - siehe Kopf-Kommentar. */
const ORDNER = ["src/components/typing", "src/lib/typing"];
const ENDUNGEN = [".ts", ".tsx"];

function sammleDateien(pfad: string): string[] {
  const out: string[] = [];
  for (const eintrag of readdirSync(pfad)) {
    if (eintrag === "node_modules" || eintrag === "dist") continue;
    const voll = join(pfad, eintrag);
    const st = statSync(voll);
    if (st.isDirectory()) out.push(...sammleDateien(voll));
    else if (ENDUNGEN.some((e) => voll.endsWith(e))) out.push(voll);
  }
  return out;
}

/** `e.key === "Shift"`, `e.key !== "Shift"` und dieselben Formen ohne `e.`-Vorsatz. */
const SHIFT_AUSNAHME = /\bkey\s*[=!]==\s*"Shift"/;

function dateienMitShiftAusnahme(): string[] {
  const treffer: string[] = [];
  for (const ordner of ORDNER) {
    for (const datei of sammleDateien(resolve(WURZEL, ordner))) {
      const inhalt = readFileSync(datei, "utf8");
      if (SHIFT_AUSNAHME.test(inhalt)) treffer.push(datei);
    }
  }
  return treffer;
}

describe("Totasten-Wächter: wo Shift eine Ausnahme hat, braucht Dead eine (oder eine Begründung)", () => {
  it("jede Datei mit einer Shift-Ausnahme erwähnt auch \"Dead\"", () => {
    const dateien = dateienMitShiftAusnahme();
    const ohneDead = dateien.filter((d) => !readFileSync(d, "utf8").includes("Dead"));
    expect(ohneDead).toEqual([]);
  });

  it("die Zählung selbst funktioniert (Gegenprobe: findet mindestens eine bekannte Stelle)", () => {
    // ★ Gegenprobe gegen einen leeren/kaputten Wächter (Bauplan-Lehre „Was
    // beweist ein grüner Wächter?"): mindestens die Schneerutsche muss der
    // Wächter wirklich finden.
    const dateien = dateienMitShiftAusnahme();
    expect(dateien.some((d) => d.endsWith("useExpedition.ts"))).toBe(true);
    expect(dateien.length).toBeGreaterThanOrEqual(4);
  });
});
