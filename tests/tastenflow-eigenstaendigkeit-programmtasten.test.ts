/**
 * ★★ Z5/E10 (19.09.2026): Programm-Tasten (`isTrusted === false`, je Zeile
 * seit Schritt M gezählt) fliessen in den Eigenständigkeits-Wert - eine oder
 * zwei Zeilen „auffällig" (4, orange), ab drei „stark auffällig" (7, rot).
 *
 * Anlass: Johannes' KI-Test vom 18.09. (*„ich kann ja Claude Code in Chrome
 * bitten … den Text zu tippen"*) - ein Skript im Browser erzeugt genau diese
 * Tasten; die App selbst und Braillezeilen/Screenreader nie (MESSUNG §13).
 *
 * Gegenprobe: ohne das Feld (alte Ereignisse, Konten ohne Zeilenmessung) und
 * mit 0 bleibt alles wie vorher - ein fehlender Wert heisst „unbekannt", nie
 * „verdächtig".
 */
import { describe, expect, it } from "vitest";
import { suspicionScore, type TaskEvent } from "@/lib/typing/account";
import { eigenstaendigkeitsStufe } from "@/components/lernwerkstatt/klasse/EigenstaendigkeitsMarke";

/** Eine gewöhnliche Zeile: 35 Zeichen in 8 s (≈ 262/min), ohne Fehler. */
function zeile(i: number, over: Partial<TaskEvent> = {}): TaskEvent {
  return { ts: 1_000_000 + i * 60_000, lesson: "adaptiv", chars: 35, errors: 1, ms: 8_000, ...over };
}

function zeilen(n: number, programm: number[] = []): TaskEvent[] {
  return Array.from({ length: n }, (_, i) =>
    zeile(i, programm.includes(i) ? { unechteTasten: 12 } : {}),
  );
}

describe("★★ Programm-Tasten im Eigenständigkeits-Wert", () => {
  it("ohne Programm-Tasten (Feld fehlt oder 0) bleibt der Wert unauffällig", () => {
    expect(suspicionScore(zeilen(10)).score).toBe(1);
    const mitNull = zeilen(10).map((e) => ({ ...e, unechteTasten: 0 }));
    const s = suspicionScore(mitNull);
    expect(s.score).toBe(1);
    expect(s.reasons).toEqual(["Unauffällig."]);
  });

  it("eine Zeile: auffällig (4) - orange Marke, der Grund nennt Zeile und Ausnahme", () => {
    const s = suspicionScore(zeilen(10, [4]));
    expect(s.score).toBe(4);
    expect(eigenstaendigkeitsStufe(s.score)).toBe("auffaellig");
    expect(s.reasons[0]).toContain("In 1 Zeile kamen Tasten von einem Programm im Browser");
    expect(s.reasons[0]).toContain("Bildschirmtastatur als Erweiterung");
  });

  it("zwei Zeilen: weiter auffällig, Mehrzahl stimmt", () => {
    const s = suspicionScore(zeilen(10, [2, 7]));
    expect(s.score).toBe(4);
    expect(s.reasons[0]).toContain("In 2 Zeilen kamen Tasten");
  });

  it("ab drei Zeilen: stark auffällig (7) - rote Marke", () => {
    const s = suspicionScore(zeilen(10, [1, 2, 3]));
    expect(s.score).toBe(7);
    expect(eigenstaendigkeitsStufe(s.score)).toBe("stark");
  });

  it("unter fünf Zeilen gilt weiter „noch zu wenige Daten“ - unverändert", () => {
    expect(suspicionScore(zeilen(4, [0, 1, 2])).score).toBe(1);
  });
});
