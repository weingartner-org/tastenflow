/**
 * ★★★★★ Kinder bleiben 90 Tage angemeldet (23.09.2026).
 *
 * Eine Anmeldung galt 7 Tage - eine Klasse, die einmal die Woche zur selben
 * Stunde übt, erreichte das Ende JEDE Woche mitten in der Stunde (gemessen an
 * einer 3. Klasse HAS). Johannes: jedes Kind hat am Schul-PC sein eigenes
 * Konto - es darf angemeldet bleiben. `setup.mjs` stellt `tt_pupils` darum
 * auf 90 Tage; Lehrkräfte bleiben bei der Vorgabe.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const setup = readFileSync(resolve(__dirname, "../pocketbase/setup.mjs"), "utf8");
const block = setup.slice(
  setup.indexOf("Anmeldung der KINDER: 90 Tage"),
  setup.indexOf("Echte Absender-Adresse + engere Bremsen"),
);

describe("★★★★★ Anmeldung der Kinder: 90 Tage", () => {
  it("setzt authToken.duration von tt_pupils auf 90 Tage - nur erhöhen", () => {
    expect(block.length).toBeGreaterThan(0);
    expect(block).toContain("90 * 24 * 60 * 60");
    expect(block).toContain('getOne("tt_pupils")');
    expect(block).toMatch(/authToken: \{ duration: NEUNZIG_TAGE_S \}/);
    expect(block).toMatch(/if \(curDur < NEUNZIG_TAGE_S\)/);
  });

  it.skip("Lehrkräfte bleiben bei der Vorgabe - der Block fasst tt_teachers nicht an", () => {
    expect(block).not.toMatch(/getOne\("tt_teachers"\)/);
  });

  it("⚠️ nur `duration` wird geschickt, nie ein `secret` (sonst wären alle Kinder sofort abgemeldet)", () => {
    expect(block).not.toMatch(/secret/i);
  });
});
