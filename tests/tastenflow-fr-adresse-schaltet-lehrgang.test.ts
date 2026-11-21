/**
 * ★ 26.09.2026 (Johannes: „/fr darf öffentlich werden" - „ja, bau
 * Möglichkeit 1"): Wer über `tastenflow.org/fr` kommt, bekommt den
 * französischen Lehrgang UND die französische Bedienung - die Adresse wirkt
 * wie `?franzoesisch-lehrgang=1`. Vorher sah ein neuer Besucher dort eine
 * französische Vorschau und dann eine deutsche App.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { franzoesischLehrgangProbeAn, LEHRGANG_PROBE_MERKER_FR } from "../src/lib/typing/lernweg";
import { adressWahlLesen } from "../src/lib/bedienSprache/sprache";

beforeEach(() => localStorage.clear());

describe("/fr schaltet den französischen Lehrgang an", () => {
  it("/fr und /fr/ schalten an und merken es auf dem Gerät", () => {
    expect(franzoesischLehrgangProbeAn("", "/fr")).toBe(true);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_FR)).toBe("1");
    localStorage.clear();
    expect(franzoesischLehrgangProbeAn("", "/fr/")).toBe(true);
  });

  it("danach gilt es auch auf anderen Seiten (gemerkt)", () => {
    franzoesischLehrgangProbeAn("", "/fr");
    expect(franzoesischLehrgangProbeAn("", "/programme/tastenflow")).toBe(true);
  });

  it("die Bedienung wird französisch", () => {
    const an = franzoesischLehrgangProbeAn("", "/fr");
    expect(adressWahlLesen("", "/fr", an)).toBe("fr");
  });

  it("Not-Aus in derselben Adresse geht vor", () => {
    expect(franzoesischLehrgangProbeAn("?franzoesisch-lehrgang=0", "/fr")).toBe(false);
  });

  // ★ 28.09.2026 (Freigabe fr/es): Seit der Schalter default AN ist, kann
  // „schaltet nichts an" nicht mehr am Rückgabewert hängen (der ist ohne
  // Merker ohnehin true). Die Aussage bleibt: andere Adressen wirken NICHT
  // wie diese - sie setzen keinen Merker und heben einen Not-Aus nicht auf.
  it("★ Gegenprobe: andere Adressen setzen den Merker nicht und schalten ein Not-Aus nicht wieder an", () => {
    for (const pfad of ["/", "/en", "/programme/tastenflow", "/freunde"]) {
      localStorage.clear();
      franzoesischLehrgangProbeAn("", pfad);
      expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_FR), pfad).toBeNull();
      localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "0");
      expect(franzoesischLehrgangProbeAn("", pfad), pfad).toBe(false);
      expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_FR), pfad).toBe("0");
    }
    // Gegenprobe zur Gegenprobe: DIESE Adresse hebt den Not-Aus auf.
    localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "0");
    expect(franzoesischLehrgangProbeAn("", "/fr")).toBe(true);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_FR)).toBe("1");
  });
});
