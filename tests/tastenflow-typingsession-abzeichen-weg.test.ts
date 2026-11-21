/**
 * ★★★★ WÄCHTER: Die Abschluss-Karte (`TypingSession.tsx`) nennt das Abzeichen
 * „Grundstellungs-Gorilla" mit der Grundreihe DES WEGES, nicht immer der
 * deutschen (Bauplan englischer Lehrgang §7, E8, 24.09.2026).
 *
 * Befund (E2-Nachtrag): `badgeBeschreibung(b, bedienSprache)` wurde in
 * `TypingSession.tsx` OHNE den dritten Parameter (`lernweg`) aufgerufen - er
 * hat eine Vorgabe („de"), die STILL griff, ganz unabhängig vom Weg des
 * Kindes. Ein Kind auf Weg „en" hätte in der Feier-Karte trotzdem „f j d k s
 * l a ö" gelesen/gehört statt „f j d k s l a ;".
 *
 * Zwei Ebenen:
 *  1. die REGEL selbst (`badgeBeschreibung`) unterscheidet die beiden Wege
 *     richtig - das stand schon seit E2 (auch hier als Gegenprobe gemessen);
 *  2. die STELLE, die sie aufruft (`TypingSession.tsx`), reicht den Weg DES
 *     KINDES tatsächlich durch - dafür genügt keine Rechnung, das muss am
 *     Quelltext selbst stehen (dieselbe Bauart wie andere Quelltext-Wächter
 *     in diesem Projekt, z. B. `tests/tastenflow-klassen-vorrang.test.tsx`
 *     gegen `pocketbase/setup.mjs`).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { badgeBeschreibung, badgeById } from "@/lib/typing/badges";

const TYPING_SESSION = readFileSync(
  resolve(__dirname, "..", "src/components/typing/TypingSession.tsx"),
  "utf-8",
);

describe("★ badgeBeschreibung: die Grundreihe folgt dem Weg", () => {
  const gorilla = badgeById("grundstellungs-gorilla")!;

  it(`Weg „en": „f j d k s l a ;" - nicht „ö"`, () => {
    const text = badgeBeschreibung(gorilla, "en", "en");
    expect(text).toContain("f j d k s l a ;");
    expect(text).not.toContain("ö");
  });

  it(`Weg „de" (Vorgabe): „f j d k s l a ö" - unverändert`, () => {
    expect(badgeBeschreibung(gorilla, "en")).toContain("f j d k s l a ö");
    expect(badgeBeschreibung(gorilla, "en", "de")).toContain("f j d k s l a ö");
  });
});

describe(`★★★★ TypingSession.tsx reicht den Lernweg DES KINDES an badgeBeschreibung durch`, () => {
  it("die Abschluss-Karte übergibt `lernweg`, nicht nur `bedienSprache`, an BEIDE Stellen", () => {
    // ★ Bewusst am Quelltext gemessen: eine Regression hier ist genau der
    // stillschweigende Rückfall auf die Vorgabe „de", den kein Datentest
    // sieht, weil die FUNKTION selbst nach wie vor richtig rechnet - nur der
    // Aufrufer vergisst, ihr den Weg mitzugeben.
    const treffer = [...TYPING_SESSION.matchAll(/badgeBeschreibung\(([^)]*)\)/g)].map((m) => m[1]);
    expect(treffer.length).toBeGreaterThanOrEqual(2);
    for (const args of treffer) {
      expect(args, args).toMatch(/,\s*lernweg\s*$/);
    }
  });

  it(`„lernweg" ist eine eigene Prop der Karte (mit Vorgabe „de" für alte Aufrufer)`, () => {
    expect(TYPING_SESSION).toMatch(/lernweg\?:\s*Lernweg/);
    expect(TYPING_SESSION).toMatch(/lernweg\s*=\s*"de"/);
  });
});
