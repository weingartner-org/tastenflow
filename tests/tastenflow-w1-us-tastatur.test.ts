/**
 * ★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.4, Johannes
 * Entscheidung 6): DIE US-TASTATUR LÖST US-SCHREIBUNG UND US-DATUM AUS.
 *
 * Bis W1 zählte die Tastatur beim Englischen nicht - US-Schreibung kam nur
 * über die Browsersprache, das Datum war immer britisch. Jetzt wie beim
 * Französischen: gemerkte Wahl > Klasse > Tastatur > Browser.
 */
import { afterEach, describe, expect, it } from "vitest";
import { bestimmeSchreibweise } from "../src/lib/typing/schreibweise";
import { setLayout } from "../src/lib/typing/layouts";
import { fmtTagMonatJahr } from "../src/lib/typing/datum";
import { LEHRGANG_PROBE_MERKER } from "../src/lib/typing/lernweg";

afterEach(() => setLayout("de"));

describe("★★ W1 Entscheidung 6: die US-Tastatur löst US-Schreibung aus", () => {
  it("ohne Speicher, ohne Klasse: US-Tastatur ⇒ us, UK-Tastatur ⇒ gb - auch bei britischem Browser", () => {
    expect(bestimmeSchreibweise({ gespeichert: null, layout: "us", sprachen: ["en-GB"] })).toBe("us");
    expect(bestimmeSchreibweise({ gespeichert: null, layout: "uk", sprachen: ["en-US"] })).toBe("gb");
    // Andere Tastatur: wie bisher der Browser.
    expect(bestimmeSchreibweise({ gespeichert: null, layout: "de", sprachen: ["en-US"] })).toBe("us");
    expect(bestimmeSchreibweise({ gespeichert: null, layout: "de", sprachen: ["en-GB"] })).toBe("gb");
    // Gemerkte Wahl und Klasse gehen vor.
    expect(bestimmeSchreibweise({ gespeichert: "gb", layout: "us", sprachen: [] })).toBe("gb");
    expect(bestimmeSchreibweise({ gespeichert: null, klassenVorgabe: "gb", layout: "us", sprachen: [] })).toBe("gb");
  });

  it("das englische Datum folgt: US-Tastatur ⇒ „Sep 5, 2026“, UK-Tastatur ⇒ „5 Sept 2026“", () => {
    const ts = new Date(2026, 8, 5, 12).getTime();
    // Der englische Lehrgang ist live freigegeben; die Test-Umgebung hält ihn
    // sonst aus (dasselbe Tor wie in `englischVariante`).
    const vorher = localStorage.getItem(LEHRGANG_PROBE_MERKER);
    localStorage.setItem(LEHRGANG_PROBE_MERKER, "1");
    setLayout("us");
    const us = fmtTagMonatJahr(ts, "en");
    setLayout("uk");
    const gb = fmtTagMonatJahr(ts, "en");
    expect(us).toMatch(/^Sep 5, 2026$/);
    expect(gb).toMatch(/^5 Sept? 2026$/);
    if (vorher === null) localStorage.removeItem(LEHRGANG_PROBE_MERKER);
    else localStorage.setItem(LEHRGANG_PROBE_MERKER, vorher);
  });
});
