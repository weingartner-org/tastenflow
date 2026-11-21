/**
 * ★★★★ WÄCHTER: Die Heimattaste des rechten kleinen Fingers folgt dem WEG
 * (Bauplan englischer Lehrgang §7, E8, 24.09.2026).
 *
 * Befund: `FINGERS["kleiner-rechts"].homeKey` stand fest auf „ö" - richtig
 * für Weg „de" (jede Tastatur) und für Weg „en" auf einer DEUTSCHEN/
 * SCHWEIZER Tastatur (dort liegt „ö" physisch an der 8. Grundtaste,
 * `achteGrundtasteFuerLayout`), aber FALSCH für Weg „en" auf US/UK: dort ist
 * die 8. Grundtaste „;" - ein reiner Fingeranker, kein Buchstabe (F2).
 */
import { afterEach, describe, expect, it } from "vitest";
import { FINGERS, fingerGuide, fingerGuideEn, homeKeyFor } from "@/lib/typing/fingers";
import { setLayout } from "@/lib/typing/layouts";

afterEach(() => setLayout("de"));

describe(`★ homeKeyFor: nur der rechte kleine Finger unterscheidet sich, nur auf Weg „en"`, () => {
  it(`Weg „de": „ö" auf JEDER Tastatur - unverändert`, () => {
    for (const layout of ["de", "ch", "us", "uk"] as const) {
      setLayout(layout);
      expect(homeKeyFor(FINGERS["kleiner-rechts"], "de"), layout).toBe("ö");
    }
  });

  it(`Weg „en" auf US/UK: „;" - der Fingeranker, kein Buchstabe`, () => {
    setLayout("us");
    expect(homeKeyFor(FINGERS["kleiner-rechts"], "en")).toBe(";");
    setLayout("uk");
    expect(homeKeyFor(FINGERS["kleiner-rechts"], "en")).toBe(";");
  });

  it(`Weg „en" auf DE/CH: bleibt „ö" - dort liegt physisch keine „;"-Taste an dieser Stelle`, () => {
    setLayout("de");
    expect(homeKeyFor(FINGERS["kleiner-rechts"], "en")).toBe("ö");
    setLayout("ch");
    expect(homeKeyFor(FINGERS["kleiner-rechts"], "en")).toBe("ö");
  });

  it("jeder andere Finger bleibt unverändert, auf jedem Weg", () => {
    for (const id of Object.keys(FINGERS) as (keyof typeof FINGERS)[]) {
      if (id === "kleiner-rechts") continue;
      expect(homeKeyFor(FINGERS[id], "de"), id).toBe(FINGERS[id].homeKey);
      expect(homeKeyFor(FINGERS[id], "en"), id).toBe(FINGERS[id].homeKey);
    }
  });
});

describe(`★ fingerGuide/fingerGuideEn: die Ansage nennt die richtige Heimattaste`, () => {
  // ★ „p" statt „;": „;" trägt auf US/UK einen eigenen (harmlosen) Eintrag in
  // `layouts.ts`s Zugangstabelle (`access[";"] = { base: ";" }`) und geht damit
  // NIE über die Heimattaste-Zeile von `fingerGuide` - unabhängig von diesem
  // Befund. „p" liegt auf DEMSELBEN Finger (rechter kleiner, obere Reihe,
  // US-Layout) OHNE einen solchen Eintrag und zeigt die Heimattaste darum
  // wirklich an.
  it(`Weg „de" auf US-Tastatur: „Ö" bleibt die genannte Heimattaste (unverändert)`, () => {
    setLayout("us");
    expect(fingerGuide("p", false, "de")).toContain("Heimattaste Ö");
  });

  it(`Weg „en" auf US-Tastatur: „;" ist die genannte Heimattaste, nicht „Ö"`, () => {
    setLayout("us");
    const g = fingerGuide("p", false, "en");
    expect(g).toContain("Heimattaste ;");
    expect(g).not.toContain("Heimattaste Ö");
  });

  it(`Weg „en" auf US-Tastatur, Englisch: „reaching from ;", nicht „reaching from Ö"`, () => {
    setLayout("us");
    const g = fingerGuideEn("p", false, "en");
    expect(g).toContain("reaching from ;");
    expect(g).not.toContain("reaching from Ö");
  });

  it(`Weg „en" auf einer deutschen Tastatur: „ö" ist weiterhin die Grundstellung (F3)`, () => {
    setLayout("de");
    const g = fingerGuide("ö", false, "en");
    expect(g).toContain("auf der Grundstellung");
  });
});
