/**
 * ★★★★★ WÄCHTER: Jede Datei in pocketbase/pb_hooks ist gültiges JavaScript.
 *
 * Anlass (26.09.2026, Ausfall rund 70 Sekunden): In einer Antwort der Vorschau-
 * Karte stand „Tastschreiben (10-Finger-System)" mit einem GERADEN Schluss-
 * Anführungszeichen mitten in einer Zeichenkette. Die Datei war damit kein
 * gültiges JavaScript mehr; PocketBase lud sie nicht, und weingartner.org wie
 * tastenflow.org antworteten mit 400. Kein Test hatte die Datei je als GANZES
 * geparst - die Vorschau-Tests lesen sie über einen eigenen Weg, der den
 * Fehler nicht sah.
 *
 * Hier wird jede Hook-Datei mit dem Parser von Node übersetzt (ohne sie
 * auszuführen). Node versteht mehr als goja, der Motor von PocketBase - dieser
 * Wächter fängt also nicht jeden Fehler, aber jede kaputte Zeichenkette,
 * Klammer oder Zeile. Gegenprobe unten.
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";

const ORDNER = resolve(__dirname, "../pocketbase/pb_hooks");
const DATEIEN = readdirSync(ORDNER).filter((n) => n.endsWith(".pb.js"));

function parsebar(quelle: string): string | null {
  try {
    new Script(quelle);
    return null;
  } catch (e) {
    return (e as Error).message;
  }
}

describe("★★★★★ pb_hooks: jede Datei ist gültiges JavaScript", () => {
  it("es gibt Hook-Dateien (sonst misst der Wächter nichts)", () => {
    expect(DATEIEN.length).toBeGreaterThan(10);
  });

  it.each(DATEIEN)("%s lässt sich parsen", (name) => {
    expect(parsebar(readFileSync(resolve(ORDNER, name), "utf8"))).toBeNull();
  });

  it("GEGENPROBE: der Fehler vom 26.09. wird erkannt", () => {
    const kaputt = 'var x = { antwort: "Üblich sind „Tastschreiben" oder mehr." };';
    expect(parsebar(kaputt)).not.toBeNull();
    const heil = 'var x = { antwort: "Üblich sind „Tastschreiben“ oder mehr." };';
    expect(parsebar(heil)).toBeNull();
  });
});
